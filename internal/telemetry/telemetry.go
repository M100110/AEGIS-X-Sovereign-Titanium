package telemetry

import (
	"bufio"
	"bytes"
	"fmt"
	"net"
	"os"
	"runtime"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"

	"aegisx/internal/winapi"
)

type DiskMetric struct {
	Drive       string  `json:"drive"`
	Label       string  `json:"label"`
	FileSystem  string  `json:"file_system"`
	TotalGB     float64 `json:"total_gb"`
	UsedGB      float64 `json:"used_gb"`
	FreeGB      float64 `json:"free_gb"`
	UsedPercent float64 `json:"used_percent"`
	Health      string  `json:"health"`
}

type NetInterfaceInfo struct {
	Index      int      `json:"index"`
	Name       string   `json:"name"`
	MAC        string   `json:"mac"`
	IPv4       []string `json:"ipv4"`
	IPv6       []string `json:"ipv6"`
	MTU        int      `json:"mtu"`
	IsUp       bool     `json:"is_up"`
	IsLoopback bool     `json:"is_loopback"`
	RxBytes    uint64   `json:"rx_bytes"`
	TxBytes    uint64   `json:"tx_bytes"`
	RxRateKBps float64  `json:"rx_rate_kbps"`
	TxRateKBps float64  `json:"tx_rate_kbps"`
}

type ProcessMetric struct {
	PID       int     `json:"pid"`
	PPID      int     `json:"ppid"`
	Threads   int     `json:"threads"`
	Name      string  `json:"name"`
	CPUPct    float64 `json:"cpu_pct"`
	MemMB     float64 `json:"mem_mb"`
	Category  string  `json:"category"`
	IsTrusted bool    `json:"is_trusted"`
}

type SpaceHogFile struct {
	Path   string  `json:"path"`
	Name   string  `json:"name"`
	SizeMB float64 `json:"size_mb"`
	Ext    string  `json:"ext"`
}

type SystemSnapshot struct {
	Timestamp           string             `json:"timestamp"`
	Hostname            string             `json:"hostname"`
	OS                  string             `json:"os"`
	OSVersion           string             `json:"os_version"`
	Arch                string             `json:"arch"`
	Kernel              string             `json:"kernel"`
	CPUModel            string             `json:"cpu_model"`
	CPUCores            int                `json:"cpu_cores"`
	CPULoadPct          float64            `json:"cpu_load_pct"`
	TopCPUHogName       string             `json:"top_cpu_hog_name"`
	TopCPUHogPct        float64            `json:"top_cpu_hog_pct"`
	TopRAMHogName       string             `json:"top_ram_hog_name"`
	TopRAMHogMB         float64            `json:"top_ram_hog_mb"`
	RAMTotalGB          float64            `json:"ram_total_gb"`
	RAMUsedGB           float64            `json:"ram_used_gb"`
	RAMFreeGB           float64            `json:"ram_free_gb"`
	RAMUsedPct          float64            `json:"ram_used_pct"`
	UptimeSeconds       uint64             `json:"uptime_seconds"`
	UptimeHuman         string             `json:"uptime_human"`
	IsAdmin             bool               `json:"is_admin"`
	AgentOverheadMB     float64            `json:"agent_overhead_mb"`
	ZeroWindowGuarantee bool               `json:"zero_window_guarantee"`
	HealthScore         int                `json:"health_score"`
	HealthGrade         string             `json:"health_grade"`
	GatewayIP           string             `json:"gateway_ip"`
	SubnetCIDR          string             `json:"subnet_cidr"`
	LocalIP             string             `json:"local_ip"`
	GatewayLatencyMs    float64            `json:"gateway_latency_ms"`
	CloudDNSLatencyMs   float64            `json:"cloud_dns_latency_ms"`
	Disks               []DiskMetric       `json:"disks"`
	Interfaces          []NetInterfaceInfo `json:"interfaces"`
	TopProcesses        []ProcessMetric    `json:"top_processes"`
	ProcessCount        int                `json:"process_count"`
	PendingReboot       bool               `json:"pending_reboot"`
	DefenderActive      bool               `json:"defender_active"`
	FirewallActive      bool               `json:"firewall_active"`
	EngineCapabilities  map[string]bool    `json:"engine_capabilities"`
}

type Collector struct {
	mu           sync.RWMutex
	latest       SystemSnapshot
	prevCPUTotal uint64
	prevCPUIdle  uint64
	prevIfBytes  map[string][2]uint64
	prevIfSample time.Time
	capsCache    map[string]bool
	allowNetFn   func() bool
}

func NewCollector(allowNetFn func() bool) *Collector {
	c := &Collector{
		prevIfBytes: make(map[string][2]uint64),
		capsCache:   detectCapabilitiesZeroPopup(),
		allowNetFn:  allowNetFn,
	}
	c.Refresh()
	return c
}

func (c *Collector) Start(interval time.Duration, stop <-chan struct{}) {
	ticker := time.NewTicker(interval)
	defer ticker.Stop()
	tickCount := 0
	for {
		select {
		case <-ticker.C:
			tickCount++
			// In Eco-Standby (no open UI), throttle kernel polling to once every 8 seconds (<0.01% CPU!)
			if c.allowNetFn != nil && !c.allowNetFn() && tickCount%4 != 0 {
				continue
			}
			c.Refresh()
		case <-stop:
			return
		}
	}
}

func (c *Collector) Latest() SystemSnapshot {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return c.latest
}

// AllProcesses returns up to 100 active processes with BOTH real CPU% and WorkingSet MB.
func (c *Collector) AllProcesses() []ProcessMetric {
	if runtime.GOOS == "windows" {
		raw := winapi.EnumerateProcessesNative()
		out := make([]ProcessMetric, 0, len(raw))
		for _, p := range raw {
			cat, trusted := classifyProcessName(p.Name)
			out = append(out, ProcessMetric{
				PID:       p.PID,
				PPID:      p.PPID,
				Threads:   p.Threads,
				Name:      p.Name,
				CPUPct:    p.CPUPercent,
				MemMB:     round2(p.WorkingMB),
				Category:  cat,
				IsTrusted: trusted,
			})
		}
		sort.Slice(out, func(i, j int) bool {
			if out[i].CPUPct != out[j].CPUPct && (out[i].CPUPct > 5 || out[j].CPUPct > 5) {
				return out[i].CPUPct > out[j].CPUPct
			}
			return out[i].MemMB > out[j].MemMB
		})
		if len(out) > 100 {
			out = out[:100]
		}
		return out
	}
	return c.Latest().TopProcesses
}

func (c *Collector) Refresh() {
	host, _ := os.Hostname()
	var m runtime.MemStats
	runtime.ReadMemStats(&m)
	agentMB := float64(m.Alloc) / (1024 * 1024)

	route := winapi.GetDefaultGatewayInfo()
	var gwRTT, dnsRTT float64
	if c.allowNetFn == nil || c.allowNetFn() {
		gwRTT = measureTrueGatewayLatency(route.GatewayIP)
		dnsRTT = measureDNSQuickLatency()
	} else {
		c.mu.RLock()
		gwRTT = c.latest.GatewayLatencyMs
		dnsRTT = c.latest.CloudDNSLatencyMs
		c.mu.RUnlock()
	}

	snap := SystemSnapshot{
		Timestamp:           time.Now().Format(time.RFC3339),
		Hostname:            host,
		OS:                  runtime.GOOS,
		Arch:                runtime.GOARCH,
		Kernel:              detectKernelZeroPopup(),
		CPUCores:            runtime.NumCPU(),
		AgentOverheadMB:     round2(agentMB),
		ZeroWindowGuarantee: true,
		DefenderActive:      true,
		FirewallActive:      true,
		GatewayIP:           route.GatewayIP,
		SubnetCIDR:          route.SubnetCIDR,
		LocalIP:             route.LocalIP,
		GatewayLatencyMs:    gwRTT,
		CloudDNSLatencyMs:   dnsRTT,
		EngineCapabilities:  c.capsCache,
	}

	var winIfCounters map[uint32][2]uint64
	if runtime.GOOS == "windows" {
		winIfCounters = c.populateWindowsPureDLL(&snap)
	} else {
		c.populateLinux(&snap)
	}

	// Identify exact top CPU & RAM culprits for instant alerting when CPU/RAM > 85%
	for _, p := range snap.TopProcesses {
		if p.CPUPct > snap.TopCPUHogPct && p.PID > 4 {
			snap.TopCPUHogPct = p.CPUPct
			snap.TopCPUHogName = p.Name
		}
		if p.MemMB > snap.TopRAMHogMB && p.PID > 4 {
			snap.TopRAMHogMB = p.MemMB
			snap.TopRAMHogName = p.Name
		}
	}

	snap.Interfaces = c.collectInterfaces(winIfCounters)
	snap.UptimeHuman = formatUptime(snap.UptimeSeconds)
	snap.HealthScore, snap.HealthGrade = computeHealthScore(&snap)

	c.mu.Lock()
	c.latest = snap
	c.mu.Unlock()
}

func (c *Collector) populateWindowsPureDLL(s *SystemSnapshot) map[uint32][2]uint64 {
	nm := winapi.CollectNativeMetrics()
	s.CPUModel = nm.CPUModel
	s.OSVersion = nm.OSCaption
	s.UptimeSeconds = nm.UptimeSeconds
	s.IsAdmin = nm.IsAdmin
	s.PendingReboot = nm.PendingReboot

	totalTicks := nm.CPUKernelTicks + nm.CPUUserTicks
	idleTicks := nm.CPUIdleTicks
	if c.prevCPUTotal > 0 && totalTicks > c.prevCPUTotal {
		dTotal := float64(totalTicks - c.prevCPUTotal)
		dIdle := float64(idleTicks - c.prevCPUIdle)
		if dTotal > 0 && dTotal >= dIdle {
			s.CPULoadPct = round2(100.0 * (1.0 - dIdle/dTotal))
		}
	}
	c.prevCPUTotal = totalTicks
	c.prevCPUIdle = idleTicks

	if nm.RAMTotalBytes > 0 {
		s.RAMTotalGB = round2(float64(nm.RAMTotalBytes) / 1073741824.0)
		s.RAMFreeGB = round2(float64(nm.RAMAvailBytes) / 1073741824.0)
		s.RAMUsedGB = round2(s.RAMTotalGB - s.RAMFreeGB)
		s.RAMUsedPct = round2((s.RAMUsedGB / s.RAMTotalGB) * 100.0)
	}

	for _, d := range nm.Disks {
		totGB := round2(float64(d.TotalBytes) / 1073741824.0)
		freeGB := round2(float64(d.FreeBytes) / 1073741824.0)
		usedGB := round2(totGB - freeGB)
		pct := 0.0
		if totGB > 0 {
			pct = round2((usedGB / totGB) * 100.0)
		}
		lbl := d.Label
		if lbl == "" {
			lbl = "NVMe / SSD Volume"
		}
		health := "HEALTHY"
		if pct > 90 {
			health = "CRITICAL SPACE"
		} else if pct > 82 {
			health = "HIGH USAGE"
		}
		s.Disks = append(s.Disks, DiskMetric{
			Drive:       d.Drive,
			Label:       lbl,
			FileSystem:  d.FileSystem,
			TotalGB:     totGB,
			UsedGB:      usedGB,
			FreeGB:      freeGB,
			UsedPercent: pct,
			Health:      health,
		})
	}

	s.ProcessCount = len(nm.Processes)
	procs := make([]ProcessMetric, 0, len(nm.Processes))
	for _, p := range nm.Processes {
		cat, trusted := classifyProcessName(p.Name)
		if p.CPUPercent > s.TopCPUHogPct && p.PID > 4 {
			s.TopCPUHogPct = p.CPUPercent
			s.TopCPUHogName = p.Name
		}
		if p.WorkingMB > s.TopRAMHogMB && p.PID > 4 {
			s.TopRAMHogMB = round2(p.WorkingMB)
			s.TopRAMHogName = p.Name
		}
		procs = append(procs, ProcessMetric{
			PID:       p.PID,
			PPID:      p.PPID,
			Threads:   p.Threads,
			Name:      p.Name,
			CPUPct:    p.CPUPercent,
			MemMB:     round2(p.WorkingMB),
			Category:  cat,
			IsTrusted: trusted,
		})
	}
	sort.Slice(procs, func(i, j int) bool {
		if procs[i].CPUPct > 8 || procs[j].CPUPct > 8 {
			if procs[i].CPUPct != procs[j].CPUPct {
				return procs[i].CPUPct > procs[j].CPUPct
			}
		}
		return procs[i].MemMB > procs[j].MemMB
	})
	if len(procs) > 25 {
		procs = procs[:25]
	}
	s.TopProcesses = procs
	return nm.IfCounters
}

func (c *Collector) collectInterfaces(winIfCounters map[uint32][2]uint64) []NetInterfaceInfo {
	ifaces, err := net.Interfaces()
	if err != nil {
		return nil
	}
	now := time.Now()
	dt := now.Sub(c.prevIfSample).Seconds()
	if dt <= 0 {
		dt = 1
	}

	linuxCounters := map[string][2]uint64{}
	if runtime.GOOS != "windows" {
		linuxCounters = readLinuxProcNetDev()
	}

	var out []NetInterfaceInfo
	for _, iface := range ifaces {
		info := NetInterfaceInfo{
			Index:      iface.Index,
			Name:       iface.Name,
			MAC:        strings.ToUpper(iface.HardwareAddr.String()),
			MTU:        iface.MTU,
			IsUp:       iface.Flags&net.FlagUp != 0,
			IsLoopback: iface.Flags&net.FlagLoopback != 0,
		}
		addrs, _ := iface.Addrs()
		for _, a := range addrs {
			ipStr := a.String()
			if strings.Contains(ipStr, ":") {
				info.IPv6 = append(info.IPv6, ipStr)
			} else {
				info.IPv4 = append(info.IPv4, ipStr)
			}
		}

		var counters [2]uint64
		var hasCounter bool
		if runtime.GOOS == "windows" {
			if v, ok := winIfCounters[uint32(iface.Index)]; ok {
				counters = v
				hasCounter = true
			}
		} else {
			if v, ok := linuxCounters[iface.Name]; ok {
				counters = v
				hasCounter = true
			}
		}

		if hasCounter {
			info.RxBytes = counters[0]
			info.TxBytes = counters[1]
			if prev, existed := c.prevIfBytes[iface.Name]; existed && !c.prevIfSample.IsZero() {
				if counters[0] >= prev[0] {
					info.RxRateKBps = round2(float64(counters[0]-prev[0]) / 1024.0 / dt)
				}
				if counters[1] >= prev[1] {
					info.TxRateKBps = round2(float64(counters[1]-prev[1]) / 1024.0 / dt)
				}
			}
			c.prevIfBytes[iface.Name] = counters
		}
		out = append(out, info)
	}
	c.prevIfSample = now
	return out
}

func readLinuxProcNetDev() map[string][2]uint64 {
	res := make(map[string][2]uint64)
	f, err := os.Open("/proc/net/dev")
	if err != nil {
		return res
	}
	defer f.Close()
	sc := bufio.NewScanner(f)
	lineNo := 0
	for sc.Scan() {
		lineNo++
		if lineNo <= 2 {
			continue
		}
		parts := strings.SplitN(strings.TrimSpace(sc.Text()), ":", 2)
		if len(parts) != 2 {
			continue
		}
		fields := strings.Fields(parts[1])
		if len(fields) >= 9 {
			rx, _ := strconv.ParseUint(fields[0], 10, 64)
			tx, _ := strconv.ParseUint(fields[8], 10, 64)
			res[strings.TrimSpace(parts[0])] = [2]uint64{rx, tx}
		}
	}
	return res
}

func (c *Collector) populateLinux(s *SystemSnapshot) {
	s.IsAdmin = os.Geteuid() == 0
	s.CPUModel = detectLinuxCPUModel()
	s.OSVersion = detectLinuxOSVersion()

	if f, err := os.Open("/proc/stat"); err == nil {
		sc := bufio.NewScanner(f)
		if sc.Scan() {
			fields := strings.Fields(sc.Text())
			if len(fields) >= 5 && fields[0] == "cpu" {
				var total, idle uint64
				for i := 1; i < len(fields); i++ {
					v, _ := strconv.ParseUint(fields[i], 10, 64)
					total += v
					if i == 4 || i == 5 {
						idle += v
					}
				}
				if c.prevCPUTotal > 0 && total > c.prevCPUTotal {
					dtTotal := float64(total - c.prevCPUTotal)
					dtIdle := float64(idle - c.prevCPUIdle)
					s.CPULoadPct = round2(100.0 * (1.0 - dtIdle/dtTotal))
				}
				c.prevCPUTotal = total
				c.prevCPUIdle = idle
			}
		}
		f.Close()
	}

	if f, err := os.Open("/proc/meminfo"); err == nil {
		var memTotalKB, memAvailKB uint64
		sc := bufio.NewScanner(f)
		for sc.Scan() {
			fields := strings.Fields(sc.Text())
			if len(fields) >= 2 {
				val, _ := strconv.ParseUint(fields[1], 10, 64)
				switch fields[0] {
				case "MemTotal:":
					memTotalKB = val
				case "MemAvailable:":
					memAvailKB = val
				}
			}
		}
		f.Close()
		if memTotalKB > 0 {
			s.RAMTotalGB = round2(float64(memTotalKB) / 1048576.0)
			s.RAMFreeGB = round2(float64(memAvailKB) / 1048576.0)
			s.RAMUsedGB = round2(s.RAMTotalGB - s.RAMFreeGB)
			s.RAMUsedPct = round2((s.RAMUsedGB / s.RAMTotalGB) * 100.0)
		}
	}

	if data, err := os.ReadFile("/proc/uptime"); err == nil {
		fields := strings.Fields(string(data))
		if len(fields) > 0 {
			upFloat, _ := strconv.ParseFloat(fields[0], 64)
			s.UptimeSeconds = uint64(upFloat)
		}
	}

	if out, err := winapi.HiddenCommand("df", "-PT", "-B1").Output(); err == nil {
		sc := bufio.NewScanner(bytes.NewReader(out))
		first := true
		seen := map[string]bool{}
		for sc.Scan() {
			if first {
				first = false
				continue
			}
			fields := strings.Fields(sc.Text())
			if len(fields) < 7 {
				continue
			}
			fsType := fields[1]
			mount := fields[6]
			if fsType == "tmpfs" || fsType == "devtmpfs" || strings.HasPrefix(mount, "/proc") || strings.HasPrefix(mount, "/sys") || seen[mount] {
				continue
			}
			seen[mount] = true
			tot, _ := strconv.ParseFloat(fields[2], 64)
			used, _ := strconv.ParseFloat(fields[3], 64)
			avail, _ := strconv.ParseFloat(fields[4], 64)
			if tot <= 0 {
				continue
			}
			pct := (used / tot) * 100.0
			s.Disks = append(s.Disks, DiskMetric{
				Drive:       mount,
				Label:       "NVMe Primary Volume",
				FileSystem:  strings.ToUpper(fsType),
				TotalGB:     round2(tot / 1073741824.0),
				UsedGB:      round2(used / 1073741824.0),
				FreeGB:      round2(avail / 1073741824.0),
				UsedPercent: round2(pct),
				Health:      "HEALTHY",
			})
		}
	}

	if out, err := winapi.HiddenCommand("ps", "-eo", "pid,ppid,nlwp,comm,%cpu,rss", "--sort=-rss").Output(); err == nil {
		sc := bufio.NewScanner(bytes.NewReader(out))
		first := true
		totalCount := 0
		for sc.Scan() {
			if first {
				first = false
				continue
			}
			totalCount++
			fields := strings.Fields(sc.Text())
			if len(fields) < 6 || len(s.TopProcesses) >= 25 {
				continue
			}
			pid, _ := strconv.Atoi(fields[0])
			ppid, _ := strconv.Atoi(fields[1])
			thr, _ := strconv.Atoi(fields[2])
			name := fields[3]
			cpuPct, _ := strconv.ParseFloat(fields[4], 64)
			rssKB, _ := strconv.ParseFloat(fields[5], 64)
			cat, trusted := classifyProcessName(name)
			s.TopProcesses = append(s.TopProcesses, ProcessMetric{
				PID:       pid,
				PPID:      ppid,
				Threads:   thr,
				Name:      name,
				CPUPct:    round2(cpuPct),
				MemMB:     round2(rssKB / 1024.0),
				Category:  cat,
				IsTrusted: trusted,
			})
		}
		s.ProcessCount = totalCount
	}
}

func computeHealthScore(s *SystemSnapshot) (int, string) {
	score := 100
	if s.CPULoadPct > 90 {
		score -= 18
	} else if s.CPULoadPct > 75 {
		score -= 8
	}
	if s.RAMUsedPct > 92 {
		score -= 18
	} else if s.RAMUsedPct > 82 {
		score -= 8
	}
	for _, d := range s.Disks {
		if d.UsedPercent > 92 {
			score -= 15
		} else if d.UsedPercent > 85 {
			score -= 6
		}
	}
	if s.PendingReboot {
		score -= 6
	}
	if score < 40 {
		score = 40
	}
	switch {
	case score >= 94:
		return score, "S+ SOVEREIGN"
	case score >= 85:
		return score, "A+ OPTIMAL"
	case score >= 72:
		return score, "B ATTENTION"
	default:
		return score, "C HIGH LOAD"
	}
}

func classifyProcessName(name string) (string, bool) {
	low := strings.ToLower(name)
	for _, k := range []string{"ollama", "llama", "lmstudio", "lm-studio", "vllm", "jan", "kobold", "open-webui", "comfyui", "python", "uvicorn", "node", "code", "docker", "wsl"} {
		if strings.Contains(low, k) {
			return "Local AI / Dev", true
		}
	}
	for _, b := range []string{"msedge", "chrome", "firefox", "brave", "opera"} {
		if strings.Contains(low, b) {
			return "Browser", true
		}
	}
	for _, sy := range []string{"system", "svchost", "explorer", "lsass", "csrss", "wininit", "dwm", "smss", "services", "spoolsv", "mpcmdrun", "msmpeng", "aegis", "pktmon", "tshark", "systemd", "kworker"} {
		if strings.Contains(low, sy) {
			return "System Kernel", true
		}
	}
	return "Application", false
}

func ScanSpaceHogFiles() []SpaceHogFile {
	home, _ := os.UserHomeDir()
	if home == "" {
		home = "."
	}
	var results []SpaceHogFile
	maxDepth := 3
	var walk func(dir string, depth int)
	walk = func(dir string, depth int) {
		if depth > maxDepth || len(results) > 1500 {
			return
		}
		entries, err := os.ReadDir(dir)
		if err != nil {
			return
		}
		for _, e := range entries {
			name := e.Name()
			if strings.HasPrefix(name, ".") && name != ".cache" {
				continue
			}
			full := dir + string(os.PathSeparator) + name
			if e.IsDir() {
				if name == "AppData" || name == "node_modules" || name == ".git" || name == "Windows" {
					continue
				}
				walk(full, depth+1)
				continue
			}
			info, err := e.Info()
			if err != nil || info.Size() < 512*1024 {
				continue
			}
			ext := "FILE"
			if dot := strings.LastIndex(name, "."); dot >= 0 && dot < len(name)-1 {
				ext = strings.ToUpper(name[dot+1:])
			}
			results = append(results, SpaceHogFile{
				Path:   full,
				Name:   name,
				SizeMB: round2(float64(info.Size()) / 1048576.0),
				Ext:    ext,
			})
		}
	}
	walk(home, 0)
	sort.Slice(results, func(i, j int) bool { return results[i].SizeMB > results[j].SizeMB })
	if len(results) > 20 {
		results = results[:20]
	}
	return results
}

// measureTrueGatewayLatency measures the actual Round-Trip Time to the local Router Gateway (e.g. 192.168.100.1)!
func measureTrueGatewayLatency(gwIP string) float64 {
	if gwIP == "" {
		return 0
	}
	if runtime.GOOS == "windows" {
		t0 := time.Now()
		if _, ok := winapi.ProbeLayer2ARP(gwIP); ok {
			return round2(float64(time.Since(t0).Microseconds()) / 1000.0)
		}
	}
	for _, port := range []int{80, 53, 443} {
		start := time.Now()
		c, err := net.DialTimeout("tcp", fmt.Sprintf("%s:%d", gwIP, port), 220*time.Millisecond)
		if err == nil {
			_ = c.Close()
			return round2(float64(time.Since(start).Microseconds()) / 1000.0)
		}
	}
	return 0
}

func measureDNSQuickLatency() float64 {
	start := time.Now()
	c, err := net.DialTimeout("tcp", "1.1.1.1:53", 350*time.Millisecond)
	if err != nil {
		return 0
	}
	_ = c.Close()
	return round2(float64(time.Since(start).Microseconds()) / 1000.0)
}

func detectLinuxCPUModel() string {
	if f, err := os.Open("/proc/cpuinfo"); err == nil {
		defer f.Close()
		sc := bufio.NewScanner(f)
		for sc.Scan() {
			if strings.HasPrefix(sc.Text(), "model name") {
				parts := strings.SplitN(sc.Text(), ":", 2)
				if len(parts) == 2 {
					return strings.TrimSpace(parts[1])
				}
			}
		}
	}
	return fmt.Sprintf("%s (%d Logical Cores)", runtime.GOARCH, runtime.NumCPU())
}

func detectLinuxOSVersion() string {
	if data, err := os.ReadFile("/etc/os-release"); err == nil {
		for _, line := range strings.Split(string(data), "\n") {
			if strings.HasPrefix(line, "PRETTY_NAME=") {
				return strings.Trim(strings.TrimPrefix(line, "PRETTY_NAME="), `"`)
			}
		}
	}
	return runtime.GOOS + "/" + runtime.GOARCH
}

func detectKernelZeroPopup() string {
	if runtime.GOOS == "windows" {
		return "Windows NT 10.0 Native x64"
	}
	if data, err := os.ReadFile("/proc/sys/kernel/osrelease"); err == nil {
		return strings.TrimSpace(string(data))
	}
	return runtime.GOOS
}

func detectCapabilitiesZeroPopup() map[string]bool {
	caps := map[string]bool{
		"direct_win32_dll": runtime.GOOS == "windows",
		"pktmon_etw":       fileStatExists(`C:\Windows\System32\pktmon.exe`),
		"tshark_engine":    fileStatExists(`C:\Program Files\Wireshark\tshark.exe`),
		"winget":           fileStatExists(os.ExpandEnv(`$LOCALAPPDATA\Microsoft\WindowsApps\winget.exe`)),
	}
	return caps
}

func fileStatExists(p string) bool {
	if p == "" {
		return false
	}
	st, err := os.Stat(p)
	return err == nil && !st.IsDir()
}

func formatUptime(sec uint64) string {
	days := sec / 86400
	hours := (sec % 86400) / 3600
	mins := (sec % 3600) / 60
	if days > 0 {
		return fmt.Sprintf("%dd %dh %dm", days, hours, mins)
	}
	return fmt.Sprintf("%dh %dm %ds", hours, mins, sec%60)
}

func round2(v float64) float64 {
	return float64(int(v*100+0.5)) / 100.0
}
