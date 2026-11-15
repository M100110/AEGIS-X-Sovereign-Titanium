package lanradar

import (
	"bytes"
	"context"
	"crypto/tls"
	"encoding/binary"
	"encoding/csv"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"math"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"sort"
	"strings"
	"sync"
	"time"

	"aegisx/internal/winapi"
)

// LANDevice represents a real physical or virtual device discovered on the user's active subnet
// with complete Identity, Vendor, OS Family, Connection Medium, Trust/Alias Registry, and Proximity telemetry.
type LANDevice struct {
	IP                string   `json:"ip"`
	MAC               string   `json:"mac"`
	Hostname          string   `json:"hostname"`
	CustomAlias       string   `json:"custom_alias"`
	DisplayName       string   `json:"display_name"`
	Vendor            string   `json:"vendor"`
	OSFamily          string   `json:"os_family"`         // Windows 10/11, Apple iOS/macOS, Android/Linux, Router Embedded OS, WebOS/Tizen TV, GameOS
	ConnectionMedium  string   `json:"connection_medium"` // Wired Ethernet, Wi-Fi 5GHz/2.4GHz, Gateway Core, Local Loop
	DeviceType        string   `json:"device_type"`       // router, this_pc, laptop, smartphone, tv, console, printer, camera, nas, iot
	ModelBanner       string   `json:"model_banner"`
	DiscoverySources  []string `json:"discovery_sources"` // SendARP, NetBIOS, mDNS, LLMNR, SSDP, WSD, X.509-TLS, ReverseDNS
	IsGateway         bool     `json:"is_gateway"`
	IsThisPC          bool     `json:"is_this_pc"`
	IsRandomizedMAC   bool     `json:"is_randomized_mac"`
	Trusted           bool     `json:"trusted"`
	IsNewIntruder     bool     `json:"is_new_intruder"`
	Online            bool     `json:"online"`
	RTTMs             float64  `json:"rtt_ms"`
	DistanceTier      string   `json:"distance_tier"`
	EstDistanceM      float64  `json:"est_distance_m"`
	SignalEstPct      int      `json:"signal_est_pct"`
	OpenPorts         []int    `json:"open_ports"`
	Services          []string `json:"services"`
	SecurityFindings  []string `json:"security_findings"`
	FirstSeen         string   `json:"first_seen"`
	LastSeen          string   `json:"last_seen"`
}

// RouterAuditReport captures deep forensic intelligence on the user's Default Gateway Router (e.g. Huawei HG8145X6-10).
type RouterAuditReport struct {
	GatewayIP       string   `json:"gateway_ip"`
	SubnetCIDR      string   `json:"subnet_cidr"`
	SubnetMask      string   `json:"subnet_mask"`
	LocalIP         string   `json:"local_ip"`
	InterfaceName   string   `json:"interface_name"`
	RouterMAC       string   `json:"router_mac"`
	RouterVendor    string   `json:"router_vendor"`
	RouterModel     string   `json:"router_model"`
	GatewayRTTMs    float64  `json:"gateway_rtt_ms"`
	OpenPorts       []int    `json:"open_ports"`
	TLSSubject      string   `json:"tls_subject"`
	TLSValidFrom    string   `json:"tls_valid_from"`
	TLSValidTo      string   `json:"tls_valid_to"`
	ClockSkewAlert  string   `json:"clock_skew_alert"`
	HTTPTitle       string   `json:"http_title"`
	SecurityScore   int      `json:"security_score"`
	SecurityGrade   string   `json:"security_grade"`
	Vulnerabilities []string `json:"vulnerabilities"`
}

// TopologySnapshot is the complete live LAN & Router state served to the v9.0 UI & Copilot.
type TopologySnapshot struct {
	LastScanAt       string            `json:"last_scan_at"`
	ScanDurationM    int64             `json:"scan_duration_ms"`
	ScanningNow      bool              `json:"scanning_now"`
	SubnetCIDR       string            `json:"subnet_cidr"`
	GatewayIP        string            `json:"gateway_ip"`
	LocalIP          string            `json:"local_ip"`
	TotalDevices     int               `json:"total_devices"`
	TrustedCount     int               `json:"trusted_count"`
	UntrustedCount   int               `json:"untrusted_count"`
	RouterAudit      RouterAuditReport `json:"router_audit"`
	Devices          []LANDevice       `json:"devices"`
}

type DeviceTrustEntry struct {
	MAC       string `json:"mac"`
	IP        string `json:"ip"`
	Alias     string `json:"alias"`
	Trusted   bool   `json:"trusted"`
	FirstSeen string `json:"first_seen"`
}

type Scanner struct {
	mu          sync.RWMutex
	latest      TopologySnapshot
	scanning    bool
	allowNetFn  func() bool
	ssdpNames   map[string]string // IP -> UPnP/SSDP Server or Location model
	mdnsNames   map[string]string // IP -> Bonjour/mDNS hostname
	wsdNames    map[string]string // IP -> WS-Discovery Windows/Printer/ONVIF Camera endpoint
	trustDB     map[string]DeviceTrustEntry
	trustFile   string
}

func NewScanner(allowNetFn func() bool) *Scanner {
	s := &Scanner{
		allowNetFn: allowNetFn,
		ssdpNames:  make(map[string]string),
		mdnsNames:  make(map[string]string),
		wsdNames:   make(map[string]string),
		trustDB:    make(map[string]DeviceTrustEntry),
		trustFile:  resolveDeviceRegistryPath(),
	}
	s.loadTrustRegistry()
	return s
}

func resolveDeviceRegistryPath() string {
	if runtime.GOOS == "windows" {
		base := os.Getenv("LOCALAPPDATA")
		if base != "" {
			dir := filepath.Join(base, "AEGIS-X")
			_ = os.MkdirAll(dir, 0755)
			return filepath.Join(dir, "lan_device_registry.json")
		}
	}
	return "lan_device_registry.json"
}

func (s *Scanner) loadTrustRegistry() {
	b, err := os.ReadFile(s.trustFile)
	if err != nil || len(b) == 0 {
		return
	}
	var list []DeviceTrustEntry
	if json.Unmarshal(b, &list) == nil {
		for _, item := range list {
			key := normalizeRegistryKey(item.MAC, item.IP)
			if key != "" {
				s.trustDB[key] = item
			}
		}
	}
}

func (s *Scanner) saveTrustRegistryLocked() {
	list := make([]DeviceTrustEntry, 0, len(s.trustDB))
	for _, v := range s.trustDB {
		list = append(list, v)
	}
	if b, err := json.MarshalIndent(list, "", "  "); err == nil {
		_ = os.WriteFile(s.trustFile, b, 0644)
	}
}

func normalizeRegistryKey(mac, ip string) string {
	m := strings.ToUpper(strings.TrimSpace(mac))
	if m != "" && m != "L3-ROUTED" && m != "PASSIVE-ARP" && m != "LOCAL-HOST" && m != "LOCAL-NIC" {
		return "MAC:" + m
	}
	if strings.TrimSpace(ip) != "" {
		return "IP:" + strings.TrimSpace(ip)
	}
	return ""
}

// UpdateDeviceMetadata lets the user assign a friendly name (e.g., "جوال محمد", "تلفزيون المجلس") and Trusted status!
func (s *Scanner) UpdateDeviceMetadata(ip, mac, alias string, trusted bool) TopologySnapshot {
	s.mu.Lock()
	key := normalizeRegistryKey(mac, ip)
	now := time.Now().Format("2006-01-02 15:04")
	cur, exists := s.trustDB[key]
	if !exists {
		cur = DeviceTrustEntry{MAC: strings.ToUpper(mac), IP: ip, FirstSeen: now}
	}
	cur.Alias = strings.TrimSpace(alias)
	cur.Trusted = trusted
	if ip != "" {
		cur.IP = ip
	}
	if mac != "" {
		cur.MAC = strings.ToUpper(mac)
	}
	if key != "" {
		s.trustDB[key] = cur
	}
	s.saveTrustRegistryLocked()

	trustedCnt, untrustedCnt := 0, 0
	for i := range s.latest.Devices {
		d := &s.latest.Devices[i]
		if (ip != "" && d.IP == ip) || (mac != "" && strings.EqualFold(d.MAC, mac)) {
			d.CustomAlias = cur.Alias
			d.Trusted = cur.Trusted
			d.IsNewIntruder = !cur.Trusted && !d.IsGateway && !d.IsThisPC
			if cur.Alias != "" {
				d.DisplayName = cur.Alias
			}
		}
		if d.Trusted || d.IsGateway || d.IsThisPC {
			trustedCnt++
		} else {
			untrustedCnt++
		}
	}
	s.latest.TrustedCount = trustedCnt
	s.latest.UntrustedCount = untrustedCnt
	snap := s.latest
	s.mu.Unlock()
	return snap
}

// ExportInventoryCSV exports the full discovered LAN device inventory (IP, MAC, Name, Vendor, OS, Distance, RTT, Ports) as UTF-8 BOM CSV for Excel.
func (s *Scanner) ExportInventoryCSV() []byte {
	snap := s.Latest()
	var buf bytes.Buffer
	buf.Write([]byte{0xEF, 0xBB, 0xBF}) // UTF-8 BOM so Microsoft Excel opens Arabic & English cleanly!
	w := csv.NewWriter(&buf)
	_ = w.Write([]string{
		"IP Address", "MAC Address", "Display Name", "Hostname", "Manufacturer (IEEE OUI / TLS)",
		"Device Type", "OS Family", "Connection Medium", "Distance (m)", "RTT (ms)",
		"Link Quality (%)", "Trusted", "Open Ports & Services", "Discovery Protocols", "Last Seen",
	})
	for _, d := range snap.Devices {
		_ = w.Write([]string{
			d.IP,
			d.MAC,
			d.DisplayName,
			d.Hostname,
			d.Vendor,
			d.DeviceType,
			d.OSFamily,
			d.ConnectionMedium,
			fmt.Sprintf("%.2f", d.EstDistanceM),
			fmt.Sprintf("%.2f", d.RTTMs),
			fmt.Sprintf("%d%%", d.SignalEstPct),
			fmt.Sprintf("%v", d.Trusted),
			strings.Join(d.Services, " | "),
			strings.Join(d.DiscoverySources, "+"),
			d.LastSeen,
		})
	}
	w.Flush()
	return buf.Bytes()
}

func (s *Scanner) Start(stop <-chan struct{}) {
	if s.allowNetFn == nil || s.allowNetFn() {
		s.RunFullDiscovery(false)
	} else {
		s.populatePassiveKernelSnapshot()
	}

	ticker := time.NewTicker(25 * time.Second)
	defer ticker.Stop()
	for {
		select {
		case <-ticker.C:
			if s.allowNetFn == nil || s.allowNetFn() {
				s.RunFullDiscovery(false)
			}
		case <-stop:
			return
		}
	}
}

// populatePassiveKernelSnapshot reads ONLY in-memory OS kernel routing & ARP tables (0 network packets emitted!).
func (s *Scanner) populatePassiveKernelSnapshot() {
	route := winapi.GetDefaultGatewayInfo()
	hostSelf, _ := os.Hostname()
	nowStr := time.Now().Format("15:04:05")

	var devs []LANDevice
	if route.GatewayIP != "" {
		devs = append(devs, LANDevice{
			IP:               route.GatewayIP,
			MAC:              "PASSIVE-ARP",
			Hostname:         "Gateway",
			DisplayName:      fmt.Sprintf("Gateway Router (%s)", route.GatewayIP),
			Vendor:           "Kernel Route Table (Eco-Standby)",
			OSFamily:         "Embedded Router OS",
			ConnectionMedium: "Gateway Core",
			DeviceType:       "router",
			ModelBanner:      "Eco-Standby — افتح لوحة التحكم للفحص النشط",
			DiscoverySources: []string{"KernelRoute"},
			IsGateway:        true,
			Trusted:          true,
			Online:           true,
			RTTMs:            0,
			DistanceTier:     "Core Gateway",
			SignalEstPct:     100,
			LastSeen:         nowStr,
		})
	}
	if route.LocalIP != "" {
		v, _, _ := LookupMACVendor(route.LocalMAC)
		devs = append(devs, LANDevice{
			IP:               route.LocalIP,
			MAC:              fallbackMAC(route.LocalMAC, "LOCAL-NIC"),
			Hostname:         hostSelf,
			DisplayName:      firstNonEmpty(hostSelf, "This PC") + " (هذا الجهاز)",
			Vendor:           v,
			OSFamily:         "Windows 10/11 x64",
			ConnectionMedium: "Local Host Bus",
			DeviceType:       "this_pc",
			ModelBanner:      route.InterfaceName,
			DiscoverySources: []string{"KernelNIC"},
			IsThisPC:         true,
			Trusted:          true,
			Online:           true,
			RTTMs:            0.05,
			DistanceTier:     "هذا الجهاز (0m)",
			SignalEstPct:     100,
			LastSeen:         nowStr,
		})
	}
	for _, e := range winapi.GetNativeARPTable() {
		if isMulticastOrBroadcastIP(e.IP) || e.MAC == "FF:FF:FF:FF:FF:FF" || e.IP == route.GatewayIP || e.IP == route.LocalIP {
			continue
		}
		v, fam, isRand := LookupMACVendor(e.MAC)
		dt := "iot"
		if fam != "" {
			dt = fam
		}
		devs = append(devs, LANDevice{
			IP:               e.IP,
			MAC:              strings.ToUpper(e.MAC),
			DisplayName:      buildSmartDisplayName(dt, "", v, "", e.IP),
			Vendor:           v,
			OSFamily:         inferOSFamily(dt, nil, v, ""),
			ConnectionMedium: "LAN Neighbor",
			DeviceType:       dt,
			ModelBanner:      v,
			DiscoverySources: []string{"ARP-Cache", "IEEE-OUI"},
			IsRandomizedMAC:  isRand,
			Online:           true,
			DistanceTier:     "Kernel ARP Cache",
			SignalEstPct:     85,
			LastSeen:         nowStr,
		})
	}

	snap := TopologySnapshot{
		LastScanAt:   nowStr + " (Eco-Passive)",
		SubnetCIDR:   route.SubnetCIDR,
		GatewayIP:    route.GatewayIP,
		LocalIP:      route.LocalIP,
		TotalDevices: len(devs),
		TrustedCount: len(devs),
		RouterAudit: RouterAuditReport{
			GatewayIP:     route.GatewayIP,
			SubnetCIDR:    route.SubnetCIDR,
			SubnetMask:    route.SubnetMask,
			LocalIP:       route.LocalIP,
			InterfaceName: route.InterfaceName,
			RouterModel:   "Eco-Standby (0 Packets)",
			SecurityScore: 100,
			SecurityGrade: "ECO-STANDBY",
		},
		Devices: devs,
	}
	s.mu.Lock()
	s.latest = snap
	s.mu.Unlock()
}

func (s *Scanner) Latest() TopologySnapshot {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.latest
}

// MeasureGatewayRTT performs a crisp TCP/ARP micro-probe directly to the true Default Gateway.
func (s *Scanner) MeasureGatewayRTT() float64 {
	gw := winapi.GetDefaultGatewayInfo().GatewayIP
	if gw == "" {
		return 0
	}
	return probeHostQuickRTT(gw)
}

// RunFullDiscovery executes 8-protocol subnet discovery:
// 1) OS Kernel Routing Table (iphlpapi.GetIpForwardTable) -> exact Gateway & /24 Subnet
// 2) Parallel Multicast Discovery: SSDP (:1900 UPnP), mDNS (:5353 Apple/Android Bonjour), WS-Discovery (:3702 Windows/Printers/Cameras)
// 3) Parallel Kernel Layer-2 SendARP across all 254 subnet hosts
// 4) Per-host Deep Identity Resolution: IEEE OUI (420+ prefixes + Private MAC) + NetBIOS (:137) + LLMNR (:5355) + Reverse DNS + HTTP Server/Title + X.509 SSL Cert Subject!
func (s *Scanner) RunFullDiscovery(deepPortAudit bool) TopologySnapshot {
	s.mu.Lock()
	if s.scanning {
		cur := s.latest
		s.mu.Unlock()
		return cur
	}
	s.scanning = true
	s.mu.Unlock()

	t0 := time.Now()
	defer func() {
		s.mu.Lock()
		s.scanning = false
		s.mu.Unlock()
	}()

	route := winapi.GetDefaultGatewayInfo()
	hostNameSelf, _ := os.Hostname()

	// Parallel non-intrusive multicast discovery (SSDP + mDNS + WS-Discovery) - 340ms max
	var wgMulti sync.WaitGroup
	wgMulti.Add(3)
	go func() {
		defer wgMulti.Done()
		s.discoverSSDP(330 * time.Millisecond)
	}()
	go func() {
		defer wgMulti.Done()
		s.discoverMDNS(330 * time.Millisecond)
	}()
	go func() {
		defer wgMulti.Done()
		s.discoverWSD(330 * time.Millisecond)
	}()

	subnetPrefix := extractIPv4Prefix24(route.GatewayIP)
	if subnetPrefix == "" {
		subnetPrefix = extractIPv4Prefix24(route.LocalIP)
	}

	arpExisting := make(map[string]string)
	for _, e := range winapi.GetNativeARPTable() {
		if !isMulticastOrBroadcastIP(e.IP) && e.MAC != "FF:FF:FF:FF:FF:FF" {
			arpExisting[e.IP] = strings.ToUpper(e.MAC)
		}
	}

	type liveCand struct {
		ip  string
		mac string
		rtt float64
	}
	candMap := make(map[string]liveCand)
	var candMu sync.Mutex

	if route.GatewayIP != "" {
		candMap[route.GatewayIP] = liveCand{ip: route.GatewayIP, mac: arpExisting[route.GatewayIP]}
	}
	if route.LocalIP != "" {
		candMap[route.LocalIP] = liveCand{ip: route.LocalIP, mac: route.LocalMAC, rtt: 0.05}
	}
	for ip, mac := range arpExisting {
		if subnetPrefix == "" || strings.HasPrefix(ip, subnetPrefix) {
			candMap[ip] = liveCand{ip: ip, mac: mac}
		}
	}

	// Parallel /24 Kernel SendARP sweep (64 bounded workers, <850ms total)
	if subnetPrefix != "" {
		sem := make(chan struct{}, 64)
		var swWg sync.WaitGroup
		for hostOctet := 1; hostOctet <= 254; hostOctet++ {
			targetIP := fmt.Sprintf("%s%d", subnetPrefix, hostOctet)
			if targetIP == route.LocalIP {
				continue
			}
			swWg.Add(1)
			sem <- struct{}{}
			go func(ip string) {
				defer swWg.Done()
				defer func() { <-sem }()

				tStart := time.Now()
				if runtime.GOOS == "windows" {
					if mac, ok := winapi.ProbeLayer2ARP(ip); ok {
						rtt := float64(time.Since(tStart).Microseconds()) / 1000.0
						candMu.Lock()
						candMap[ip] = liveCand{ip: ip, mac: mac, rtt: round2(rtt)}
						candMu.Unlock()
						return
					}
				} else {
					if _, inArp := arpExisting[ip]; !inArp && ip != route.GatewayIP && !strings.HasSuffix(ip, ".1") {
						return
					}
					rtt := probeHostQuickRTT(ip)
					if rtt > 0 {
						candMu.Lock()
						candMap[ip] = liveCand{ip: ip, mac: arpExisting[ip], rtt: rtt}
						candMu.Unlock()
					}
				}
			}(targetIP)
		}
		swWg.Wait()
	}

	wgMulti.Wait()

	// Merge any multicast responders (SSDP / mDNS / WSD) or fresh ARP entries into candidate map
	for _, e := range winapi.GetNativeARPTable() {
		if isMulticastOrBroadcastIP(e.IP) || e.MAC == "FF:FF:FF:FF:FF:FF" {
			continue
		}
		if subnetPrefix != "" && !strings.HasPrefix(e.IP, subnetPrefix) {
			continue
		}
		candMu.Lock()
		if cur, ok := candMap[e.IP]; ok {
			if cur.mac == "" {
				cur.mac = strings.ToUpper(e.MAC)
				candMap[e.IP] = cur
			}
		} else {
			candMap[e.IP] = liveCand{ip: e.IP, mac: strings.ToUpper(e.MAC)}
		}
		candMu.Unlock()
	}

	s.mu.RLock()
	for ip := range s.ssdpNames {
		if subnetPrefix == "" || strings.HasPrefix(ip, subnetPrefix) {
			if _, ok := candMap[ip]; !ok {
				candMap[ip] = liveCand{ip: ip, mac: arpExisting[ip]}
			}
		}
	}
	for ip := range s.mdnsNames {
		if subnetPrefix == "" || strings.HasPrefix(ip, subnetPrefix) {
			if _, ok := candMap[ip]; !ok {
				candMap[ip] = liveCand{ip: ip, mac: arpExisting[ip]}
			}
		}
	}
	for ip := range s.wsdNames {
		if subnetPrefix == "" || strings.HasPrefix(ip, subnetPrefix) {
			if _, ok := candMap[ip]; !ok {
				candMap[ip] = liveCand{ip: ip, mac: arpExisting[ip]}
			}
		}
	}
	s.mu.RUnlock()

	var devices []LANDevice
	var devMu sync.Mutex
	var fpWg sync.WaitGroup
	fpSem := make(chan struct{}, 24)

	var routerReport RouterAuditReport
	routerReport.GatewayIP = route.GatewayIP
	routerReport.SubnetCIDR = route.SubnetCIDR
	routerReport.SubnetMask = route.SubnetMask
	routerReport.LocalIP = route.LocalIP
	routerReport.InterfaceName = route.InterfaceName
	routerReport.SecurityScore = 100
	routerReport.SecurityGrade = "A+ SECURE"

	for _, c := range candMap {
		fpWg.Add(1)
		fpSem <- struct{}{}
		go func(cand liveCand) {
			defer fpWg.Done()
			defer func() { <-fpSem }()

			dev := s.fingerprintSingleDevice(cand.ip, cand.mac, cand.rtt, route, hostNameSelf, deepPortAudit)
			devMu.Lock()
			devices = append(devices, dev)
			if dev.IsGateway {
				routerReport = buildRouterAuditFromGatewayDevice(dev, route)
			}
			devMu.Unlock()
		}(c)
	}
	fpWg.Wait()

	sort.Slice(devices, func(i, j int) bool {
		if devices[i].IsGateway != devices[j].IsGateway {
			return devices[i].IsGateway
		}
		if devices[i].IsThisPC != devices[j].IsThisPC {
			return devices[i].IsThisPC
		}
		return ipToUint32(devices[i].IP) < ipToUint32(devices[j].IP)
	})

	trustedCnt, untrustedCnt := 0, 0
	for _, d := range devices {
		if d.Trusted || d.IsGateway || d.IsThisPC {
			trustedCnt++
		} else {
			untrustedCnt++
		}
	}

	snap := TopologySnapshot{
		LastScanAt:     time.Now().Format("15:04:05"),
		ScanDurationM:  time.Since(t0).Milliseconds(),
		ScanningNow:    false,
		SubnetCIDR:     route.SubnetCIDR,
		GatewayIP:      route.GatewayIP,
		LocalIP:        route.LocalIP,
		TotalDevices:   len(devices),
		TrustedCount:   trustedCnt,
		UntrustedCount: untrustedCnt,
		RouterAudit:    routerReport,
		Devices:        devices,
	}

	s.mu.Lock()
	s.latest = snap
	s.mu.Unlock()
	return snap
}

func (s *Scanner) fingerprintSingleDevice(ip, mac string, initialRTT float64, route winapi.RouteGatewayInfo, selfHostname string, deep bool) LANDevice {
	nowStr := time.Now().Format("15:04:05")
	todayStr := time.Now().Format("2006-01-02 15:04")
	isGW := (ip == route.GatewayIP && ip != "")
	isSelf := (ip == route.LocalIP && ip != "")

	if isSelf {
		vendor, _, _ := LookupMACVendor(mac)
		if vendor == "Unknown Vendor" || vendor == "Standard IEEE Network Device" {
			vendor = "Local Workstation NIC"
		}
		disp := selfHostname
		if disp == "" {
			disp = "This Windows PC"
		}
		osLabel := "Windows 10/11 x64"
		if runtime.GOOS != "windows" {
			osLabel = fmt.Sprintf("%s/%s Host", runtime.GOOS, runtime.GOARCH)
		}
		return LANDevice{
			IP:               ip,
			MAC:              fallbackMAC(mac, "LOCAL-HOST"),
			Hostname:         selfHostname,
			DisplayName:      fmt.Sprintf("%s (هذا الجهاز)", disp),
			Vendor:           vendor,
			OSFamily:         osLabel,
			ConnectionMedium: "Local Host Bus",
			DeviceType:       "this_pc",
			ModelBanner:      route.InterfaceName,
			DiscoverySources: []string{"KernelNIC", "IEEE-OUI"},
			IsGateway:        false,
			IsThisPC:         true,
			Trusted:          true,
			Online:           true,
			RTTMs:            0.05,
			DistanceTier:     "Local Host",
			EstDistanceM:     0.0,
			SignalEstPct:     100,
			OpenPorts:        []int{7788},
			Services:         []string{"AEGIS-X Control Engine (:7788)"},
			FirstSeen:        todayStr,
			LastSeen:         nowStr,
		}
	}

	var sources []string
	if mac != "" {
		sources = append(sources, "SendARP")
	}

	vendor, familyHint, isRandMAC := LookupMACVendor(mac)
	if vendor != "Unknown Vendor" && vendor != "Standard IEEE Network Device" {
		sources = append(sources, "IEEE-OUI")
	}

	rtt := initialRTT
	if rtt <= 0 {
		rtt = probeHostQuickRTT(ip)
	}
	if rtt <= 0 {
		rtt = 2.4
	}

	probePorts := []int{53, 80, 135, 139, 443, 445, 554, 631, 3389, 5000, 8008, 8009, 8080, 8443, 9100, 62078}
	if isGW || deep {
		probePorts = []int{21, 22, 23, 53, 80, 135, 139, 443, 445, 554, 631, 1900, 3389, 5000, 5357, 7547, 8008, 8022, 8080, 8443, 9100, 62078}
	}

	var openPorts []int
	var portMu sync.Mutex
	var pWg sync.WaitGroup
	for _, p := range probePorts {
		pWg.Add(1)
		go func(port int) {
			defer pWg.Done()
			tStart := time.Now()
			c, err := net.DialTimeout("tcp", fmt.Sprintf("%s:%d", ip, port), 230*time.Millisecond)
			if err == nil {
				_ = c.Close()
				dMs := float64(time.Since(tStart).Microseconds()) / 1000.0
				portMu.Lock()
				openPorts = append(openPorts, port)
				if dMs > 0 && (rtt <= 0 || dMs < rtt) {
					rtt = round2(dMs)
				}
				portMu.Unlock()
			}
		}(p)
	}
	pWg.Wait()
	sort.Ints(openPorts)

	// Multi-Protocol Identity Resolution (NetBIOS + LLMNR + mDNS + SSDP + WSD + Reverse DNS + X.509 SSL + HTTP)
	nbName := queryNetBIOSName(ip, 210*time.Millisecond)
	if nbName != "" {
		sources = append(sources, "NetBIOS")
	}
	s.mu.RLock()
	mdnsName := s.mdnsNames[ip]
	ssdpBanner := s.ssdpNames[ip]
	wsdBanner := s.wsdNames[ip]
	s.mu.RUnlock()

	if mdnsName == "" {
		mdnsName = queryDirectMDNSPTR(ip, 200*time.Millisecond)
	}
	if mdnsName != "" {
		sources = append(sources, "mDNS")
	}
	if ssdpBanner != "" {
		sources = append(sources, "SSDP/UPnP")
	}
	if wsdBanner != "" {
		sources = append(sources, "WSD")
	}

	rdnsName := lookupReverseDNSQuick(ip, route.GatewayIP, 210*time.Millisecond)
	if rdnsName != "" {
		sources = append(sources, "RouterDNS")
	}

	llmnrName := ""
	if nbName == "" && mdnsName == "" && rdnsName == "" {
		llmnrName = queryLLMNRReverse(ip, 190*time.Millisecond)
		if llmnrName != "" {
			sources = append(sources, "LLMNR")
		}
	}

	var tlsModel, tlsOrg, tlsSummary, httpTitle string
	var secFindings []string
	if containsPort(openPorts, 443) || containsPort(openPorts, 80) || containsPort(openPorts, 8443) || isGW {
		for _, p := range []int{443, 80, 8443} {
			if !containsPort(openPorts, p) && !isGW {
				continue
			}
			cn, org, validFrom, validTo, skew := inspectTLSCert(ip, p, 340*time.Millisecond)
			if cn != "" || org != "" {
				tlsModel = cn
				tlsOrg = org
				tlsSummary = fmt.Sprintf("CN=%s / Org=%s (%s .. %s)", cn, org, validFrom, validTo)
				sources = append(sources, "X.509-TLS")
				if skew != "" {
					secFindings = append(secFindings, skew)
				}
				break
			}
		}
		for _, p := range []int{80, 8080, 443} {
			if !containsPort(openPorts, p) {
				continue
			}
			if title := fetchHTTPTitleQuick(ip, p, 300*time.Millisecond); title != "" {
				httpTitle = title
				sources = append(sources, "HTTP-Banner")
				break
			}
		}
	}

	if tlsOrg != "" && (vendor == "Unknown Vendor" || vendor == "Standard IEEE Network Device" || isGW) {
		vendor = tlsOrg
	}

	devType := classifyDeviceRole(isGW, familyHint, openPorts, vendor, nbName, mdnsName, ssdpBanner, wsdBanner, tlsModel, httpTitle)
	hostname := firstNonEmpty(nbName, mdnsName, rdnsName, llmnrName, tlsModel)

	var modelBanner string
	switch {
	case tlsModel != "" && tlsOrg != "":
		modelBanner = fmt.Sprintf("%s %s", tlsOrg, tlsModel)
	case tlsModel != "":
		modelBanner = tlsModel
	case ssdpBanner != "":
		modelBanner = ssdpBanner
	case httpTitle != "":
		modelBanner = httpTitle
	case wsdBanner != "":
		modelBanner = wsdBanner
	default:
		modelBanner = vendor
	}

	displayName := buildSmartDisplayName(devType, hostname, vendor, tlsModel, ip)
	osFamily := inferOSFamily(devType, openPorts, vendor, modelBanner)
	connMedium := inferConnectionMedium(isGW, devType, rtt, isRandMAC)

	// Check Persistent Trust & Alias Registry
	regKey := normalizeRegistryKey(mac, ip)
	var customAlias string
	trusted := isGW
	firstSeen := todayStr
	s.mu.Lock()
	if regKey != "" {
		if entry, ok := s.trustDB[regKey]; ok {
			customAlias = entry.Alias
			trusted = entry.Trusted || isGW
			if entry.FirstSeen != "" {
				firstSeen = entry.FirstSeen
			}
		} else {
			// Auto-record first seen timestamp; Gateway is trusted by default, unknown peers are flagged until verified
			s.trustDB[regKey] = DeviceTrustEntry{
				MAC:       strings.ToUpper(mac),
				IP:        ip,
				Trusted:   isGW,
				FirstSeen: todayStr,
			}
			s.saveTrustRegistryLocked()
		}
	}
	s.mu.Unlock()

	if customAlias != "" {
		displayName = customAlias
	}

	if containsPort(openPorts, 23) {
		secFindings = append(secFindings, "منفذ Telnet (23/tcp) غير المشفر مفتوح — خطر اعتراض كلمات المرور.")
	}
	if containsPort(openPorts, 21) {
		secFindings = append(secFindings, "منفذ FTP (21/tcp) مفتوح على الشبكة المحلية.")
	}
	if isGW && containsPort(openPorts, 80) && tlsSummary != "" {
		secFindings = append(secFindings, fmt.Sprintf("تم كشف شهادة الراوتر الرقمية على منفذ 80: %s", tlsSummary))
	}

	services := describeOpenPorts(openPorts, tlsModel)
	distM, distTier, sigPct := estimateProximityFromRTT(rtt, isGW)

	return LANDevice{
		IP:               ip,
		MAC:              fallbackMAC(mac, "L3-ROUTED"),
		Hostname:         hostname,
		CustomAlias:      customAlias,
		DisplayName:      displayName,
		Vendor:           vendor,
		OSFamily:         osFamily,
		ConnectionMedium: connMedium,
		DeviceType:       devType,
		ModelBanner:      modelBanner,
		DiscoverySources: sources,
		IsGateway:        isGW,
		IsThisPC:         false,
		IsRandomizedMAC:  isRandMAC,
		Trusted:          trusted,
		IsNewIntruder:    !trusted && !isGW,
		Online:           true,
		RTTMs:            round2(rtt),
		DistanceTier:     distTier,
		EstDistanceM:     distM,
		SignalEstPct:     sigPct,
		OpenPorts:        openPorts,
		Services:         services,
		SecurityFindings: secFindings,
		FirstSeen:        firstSeen,
		LastSeen:         nowStr,
	}
}

func inferOSFamily(devType string, ports []int, vendor, banner string) string {
	joined := strings.ToLower(vendor + " " + banner)
	switch {
	case devType == "router":
		if strings.Contains(joined, "huawei") {
			return "Huawei VRP / Linux ONT Firmware"
		}
		if strings.Contains(joined, "mikrotik") {
			return "MikroTik RouterOS"
		}
		if strings.Contains(joined, "ubiquiti") {
			return "UniFi OS"
		}
		return "Embedded Gateway Linux/RTOS"
	case containsPort(ports, 62078) || strings.Contains(joined, "iphone") || strings.Contains(joined, "ipad"):
		return "Apple iOS / iPadOS"
	case strings.Contains(joined, "apple") && devType == "laptop":
		return "Apple macOS"
	case containsPort(ports, 135) || containsPort(ports, 445) || containsPort(ports, 3389):
		return "Microsoft Windows 10/11"
	case strings.Contains(joined, "webos"):
		return "LG webOS Smart TV"
	case strings.Contains(joined, "tizen") || (strings.Contains(joined, "samsung") && devType == "tv"):
		return "Samsung Tizen TV OS"
	case strings.Contains(joined, "playstation"):
		return "Sony Orbis / PS5 OS"
	case strings.Contains(joined, "xbox"):
		return "Microsoft Xbox System OS"
	case devType == "smartphone":
		return "Android / Mobile OS"
	case devType == "camera":
		return "Embedded RTSP/ONVIF Camera Linux"
	case devType == "printer":
		return "Embedded Print Firmware"
	case containsPort(ports, 22):
		return "Linux / Unix Server"
	default:
		return "Embedded IoT / Network Stack"
	}
}

func inferConnectionMedium(isGW bool, devType string, rtt float64, isRandMAC bool) string {
	if isGW {
		return "Fiber / WAN Gateway Core"
	}
	if isRandMAC || devType == "smartphone" || devType == "iot" {
		return "Wi-Fi Wireless (802.11)"
	}
	if rtt <= 1.1 && (devType == "laptop" || devType == "nas" || devType == "printer") {
		return "Wired Gigabit / Near Wi-Fi 6"
	}
	return "Wi-Fi Wireless (802.11)"
}

func buildRouterAuditFromGatewayDevice(gw LANDevice, route winapi.RouteGatewayInfo) RouterAuditReport {
	rep := RouterAuditReport{
		GatewayIP:     route.GatewayIP,
		SubnetCIDR:    route.SubnetCIDR,
		SubnetMask:    route.SubnetMask,
		LocalIP:       route.LocalIP,
		InterfaceName: route.InterfaceName,
		RouterMAC:     gw.MAC,
		RouterVendor:  gw.Vendor,
		RouterModel:   gw.ModelBanner,
		GatewayRTTMs:  gw.RTTMs,
		OpenPorts:     gw.OpenPorts,
		SecurityScore: 96,
		SecurityGrade: "A+ HARDENED",
	}

	for _, p := range []int{443, 80, 8443} {
		cn, org, vFrom, vTo, skew := inspectTLSCert(gw.IP, p, 340*time.Millisecond)
		if cn != "" || org != "" {
			rep.TLSSubject = fmt.Sprintf("CN=%s, O=%s (Port %d/tcp)", cn, org, p)
			rep.TLSValidFrom = vFrom
			rep.TLSValidTo = vTo
			if rep.RouterModel == "" || rep.RouterModel == gw.Vendor {
				rep.RouterModel = strings.TrimSpace(org + " " + cn)
			}
			if skew != "" {
				rep.ClockSkewAlert = skew
				rep.Vulnerabilities = append(rep.Vulnerabilities, skew)
				rep.SecurityScore -= 12
			}
			break
		}
	}

	if containsPort(gw.OpenPorts, 23) {
		rep.Vulnerabilities = append(rep.Vulnerabilities, "Telnet (23/tcp) مفعّل على الراوتر — يُنصح بإغلاقه فوراً من صفحة إعدادات الراوتر.")
		rep.SecurityScore -= 25
	}
	if containsPort(gw.OpenPorts, 21) {
		rep.Vulnerabilities = append(rep.Vulnerabilities, "خدمة مشاركة الملفات FTP (21/tcp) ظاهرة على بوابة الراوتر.")
		rep.SecurityScore -= 12
	}
	if containsPort(gw.OpenPorts, 7547) {
		rep.Vulnerabilities = append(rep.Vulnerabilities, "منفذ الإدارة عن بُعد TR-069 CWMP (7547/tcp) مفتوح لمزود الخدمة.")
		rep.SecurityScore -= 8
	}
	if len(rep.Vulnerabilities) == 0 {
		rep.Vulnerabilities = append(rep.Vulnerabilities, "بوابة الراوتر محمية جيداً — منافذ الإدارة الخطرة (Telnet/CWMP) مغلقة أو مفلترة.")
	}

	switch {
	case rep.SecurityScore >= 90:
		rep.SecurityGrade = "A+ HARDENED"
	case rep.SecurityScore >= 78:
		rep.SecurityGrade = "B+ PROTECTED"
	default:
		rep.SecurityGrade = "C NEEDS REVIEW"
	}
	return rep
}

func inspectTLSCert(ip string, port int, timeout time.Duration) (cn, org, validFrom, validTo, skewAlert string) {
	dialer := &net.Dialer{Timeout: timeout}
	conn, err := tls.DialWithDialer(dialer, "tcp", fmt.Sprintf("%s:%d", ip, port), &tls.Config{
		InsecureSkipVerify: true,
	})
	if err != nil {
		return "", "", "", "", ""
	}
	defer conn.Close()

	certs := conn.ConnectionState().PeerCertificates
	if len(certs) == 0 {
		return "", "", "", "", ""
	}
	leaf := certs[0]
	cn = strings.TrimSpace(leaf.Subject.CommonName)
	if len(leaf.Subject.Organization) > 0 {
		org = strings.TrimSpace(leaf.Subject.Organization[0])
	}
	validFrom = leaf.NotBefore.Format("2006-01-02")
	validTo = leaf.NotAfter.Format("2006-01-02")

	if leaf.NotAfter.Year() >= 2055 || leaf.NotBefore.After(time.Now().Add(24*time.Hour)) {
		skewAlert = fmt.Sprintf("تنبيه شهادة الراوتر (%s): نطاق صلاحية غير قياسي (%s إلى %s) أو انحراف ساعة المصنع الداخلية للراوتر (NTP Skew).", cn, validFrom, validTo)
	}
	return cn, org, validFrom, validTo, skewAlert
}

func fetchHTTPTitleQuick(ip string, port int, timeout time.Duration) string {
	scheme := "http"
	if port == 443 || port == 8443 {
		scheme = "https"
	}
	tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	}
	client := &http.Client{Timeout: timeout, Transport: tr}
	resp, err := client.Get(fmt.Sprintf("%s://%s:%d/", scheme, ip, port))
	if err != nil {
		return ""
	}
	defer resp.Body.Close()
	buf, _ := io.ReadAll(io.LimitReader(resp.Body, 4096))
	body := string(buf)
	low := strings.ToLower(body)
	if i := strings.Index(low, "<title>"); i >= 0 {
		rest := body[i+7:]
		if j := strings.Index(strings.ToLower(rest), "</title>"); j >= 0 {
			t := strings.TrimSpace(rest[:j])
			if len(t) > 64 {
				t = t[:64]
			}
			return t
		}
	}
	if srv := resp.Header.Get("Server"); srv != "" {
		return srv
	}
	return ""
}

// queryNetBIOSName sends a standard RFC 1002 NBSTAT UDP query to port 137 to resolve Windows/Samba PC names.
func queryNetBIOSName(ip string, timeout time.Duration) string {
	conn, err := net.DialTimeout("udp4", ip+":137", timeout)
	if err != nil {
		return ""
	}
	defer conn.Close()
	_ = conn.SetDeadline(time.Now().Add(timeout))

	pkt := []byte{
		0xA5, 0x71, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
		0x20, 0x43, 0x4B, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41,
		0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41,
		0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x00,
		0x00, 0x21, 0x00, 0x01,
	}
	if _, err := conn.Write(pkt); err != nil {
		return ""
	}
	buf := make([]byte, 512)
	n, err := conn.Read(buf)
	if err != nil || n < 57 {
		return ""
	}
	numNames := int(buf[56])
	offset := 57
	for i := 0; i < numNames && offset+18 <= n; i++ {
		rawName := strings.TrimSpace(string(buf[offset : offset+15]))
		suffix := buf[offset+15]
		flags := binary.BigEndian.Uint16(buf[offset+16 : offset+18])
		isGroup := (flags & 0x8000) != 0
		if !isGroup && (suffix == 0x00 || suffix == 0x20) && rawName != "" {
			return rawName
		}
		offset += 18
	}
	return ""
}

// queryDirectMDNSPTR sends a unicast mDNS PTR query (:5353) to resolve iPhone/iPad/Mac/Android `.local` hostnames.
func queryDirectMDNSPTR(ip string, timeout time.Duration) string {
	parsed := net.ParseIP(ip).To4()
	if parsed == nil {
		return ""
	}
	revLabels := []string{
		fmt.Sprintf("%d", parsed[3]),
		fmt.Sprintf("%d", parsed[2]),
		fmt.Sprintf("%d", parsed[1]),
		fmt.Sprintf("%d", parsed[0]),
		"in-addr", "arpa",
	}
	pkt := buildDNSQueryPacket(0x1984, revLabels, 12) // Type 12 = PTR
	conn, err := net.DialTimeout("udp4", ip+":5353", timeout)
	if err != nil {
		return ""
	}
	defer conn.Close()
	_ = conn.SetDeadline(time.Now().Add(timeout))
	if _, err := conn.Write(pkt); err != nil {
		return ""
	}
	buf := make([]byte, 512)
	n, err := conn.Read(buf)
	if err != nil || n < 20 {
		return ""
	}
	return extractReadableHostnameFromDNS(buf[:n])
}

// queryLLMNRReverse sends a Link-Local Multicast Name Resolution PTR query (UDP :5355) for modern Windows 10/11 PCs where NetBIOS is disabled.
func queryLLMNRReverse(ip string, timeout time.Duration) string {
	parsed := net.ParseIP(ip).To4()
	if parsed == nil {
		return ""
	}
	revLabels := []string{
		fmt.Sprintf("%d", parsed[3]),
		fmt.Sprintf("%d", parsed[2]),
		fmt.Sprintf("%d", parsed[1]),
		fmt.Sprintf("%d", parsed[0]),
		"in-addr", "arpa",
	}
	pkt := buildDNSQueryPacket(0x2B4C, revLabels, 12)
	conn, err := net.DialTimeout("udp4", ip+":5355", timeout)
	if err != nil {
		return ""
	}
	defer conn.Close()
	_ = conn.SetDeadline(time.Now().Add(timeout))
	if _, err := conn.Write(pkt); err != nil {
		return ""
	}
	buf := make([]byte, 512)
	n, err := conn.Read(buf)
	if err != nil || n < 20 {
		return ""
	}
	return extractReadableHostnameFromDNS(buf[:n])
}

func buildDNSQueryPacket(txID uint16, labels []string, qType uint16) []byte {
	var b []byte
	hdr := make([]byte, 12)
	binary.BigEndian.PutUint16(hdr[0:2], txID)
	binary.BigEndian.PutUint16(hdr[4:6], 1) // QDCOUNT = 1
	b = append(b, hdr...)
	for _, lbl := range labels {
		b = append(b, byte(len(lbl)))
		b = append(b, []byte(lbl)...)
	}
	b = append(b, 0x00)
	tail := make([]byte, 4)
	binary.BigEndian.PutUint16(tail[0:2], qType)
	binary.BigEndian.PutUint16(tail[2:4], 1) // IN
	b = append(b, tail...)
	return b
}

func extractReadableHostnameFromDNS(pkt []byte) string {
	if len(pkt) < 24 {
		return ""
	}
	// Scan answer section for clean hostname label (>3 chars, not arpa/in-addr/local)
	for i := 12; i < len(pkt)-4; i++ {
		ln := int(pkt[i])
		if ln >= 3 && ln <= 36 && i+1+ln <= len(pkt) {
			cand := string(pkt[i+1 : i+1+ln])
			valid := true
			for _, ch := range cand {
				if !((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9') || ch == '-') {
					valid = false
					break
				}
			}
			low := strings.ToLower(cand)
			if valid && low != "in-addr" && low != "arpa" && low != "local" {
				// Avoid pure numeric IP octets
				allDigits := true
				for _, ch := range cand {
					if ch < '0' || ch > '9' {
						allDigits = false
						break
					}
				}
				if !allDigits {
					return cand
				}
			}
		}
	}
	return ""
}

func lookupReverseDNSQuick(ip, gatewayIP string, timeout time.Duration) string {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	r := &net.Resolver{
		PreferGo: true,
		Dial: func(c context.Context, network, address string) (net.Conn, error) {
			d := net.Dialer{Timeout: timeout}
			if gatewayIP != "" {
				return d.DialContext(c, "udp", gatewayIP+":53")
			}
			return d.DialContext(c, network, address)
		},
	}
	names, err := r.LookupAddr(ctx, ip)
	if err == nil && len(names) > 0 {
		n := strings.TrimSuffix(names[0], ".")
		n = strings.TrimSuffix(n, ".lan")
		n = strings.TrimSuffix(n, ".local")
		n = strings.TrimSuffix(n, ".home")
		return n
	}
	return ""
}

func (s *Scanner) discoverSSDP(timeout time.Duration) {
	conn, err := net.ListenUDP("udp4", &net.UDPAddr{IP: net.IPv4zero, Port: 0})
	if err != nil {
		return
	}
	defer conn.Close()
	_ = conn.SetDeadline(time.Now().Add(timeout))

	dst, err := net.ResolveUDPAddr("udp4", "239.255.255.250:1900")
	if err != nil {
		return
	}
	msg := "M-SEARCH * HTTP/1.1\r\nHOST: 239.255.255.250:1900\r\nMAN: \"ssdp:discover\"\r\nMX: 1\r\nST: ssdp:all\r\n\r\n"
	_, _ = conn.WriteToUDP([]byte(msg), dst)

	buf := make([]byte, 2048)
	for {
		n, addr, err := conn.ReadFromUDP(buf)
		if err != nil {
			break
		}
		ip := addr.IP.String()
		lines := strings.Split(string(buf[:n]), "\r\n")
		for _, ln := range lines {
			up := strings.ToUpper(ln)
			if strings.HasPrefix(up, "SERVER:") {
				srv := strings.TrimSpace(ln[7:])
				s.mu.Lock()
				s.ssdpNames[ip] = srv
				s.mu.Unlock()
			}
		}
	}
}

func (s *Scanner) discoverMDNS(timeout time.Duration) {
	conn, err := net.ListenUDP("udp4", &net.UDPAddr{IP: net.IPv4zero, Port: 0})
	if err != nil {
		return
	}
	defer conn.Close()
	_ = conn.SetDeadline(time.Now().Add(timeout))

	dst, err := net.ResolveUDPAddr("udp4", "224.0.0.251:5353")
	if err != nil {
		return
	}
	q := []byte{
		0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
		0x09, '_', 's', 'e', 'r', 'v', 'i', 'c', 'e', 's',
		0x07, '_', 'd', 'n', 's', '-', 's', 'd',
		0x04, '_', 'u', 'd', 'p',
		0x05, 'l', 'o', 'c', 'a', 'l', 0x00,
		0x00, 0x0c, 0x00, 0x01,
	}
	_, _ = conn.WriteToUDP(q, dst)

	buf := make([]byte, 1500)
	for {
		n, addr, err := conn.ReadFromUDP(buf)
		if err != nil || n < 12 {
			break
		}
		ip := addr.IP.String()
		ascii := extractReadableToken(buf[12:n])
		if ascii != "" {
			s.mu.Lock()
			if s.mdnsNames[ip] == "" {
				s.mdnsNames[ip] = ascii
			}
			s.mu.Unlock()
		}
	}
}

// discoverWSD sends a WS-Discovery SOAP Probe to 239.255.255.250:3702 to discover Windows 10/11 PCs, ONVIF IP Cameras, and WSD Printers.
func (s *Scanner) discoverWSD(timeout time.Duration) {
	conn, err := net.ListenUDP("udp4", &net.UDPAddr{IP: net.IPv4zero, Port: 0})
	if err != nil {
		return
	}
	defer conn.Close()
	_ = conn.SetDeadline(time.Now().Add(timeout))

	dst, err := net.ResolveUDPAddr("udp4", "239.255.255.250:3702")
	if err != nil {
		return
	}
	soapProbe := `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:wsd="http://schemas.xmlsoap.org/ws/2005/04/discovery"><soap:Header><wsa:Action>http://schemas.xmlsoap.org/ws/2005/04/discovery/Probe</wsa:Action><wsa:MessageID>urn:uuid:aegisx-9000-probe</wsa:MessageID><wsa:To>urn:schemas-xmlsoap-org:ws:2005:04:discovery</wsa:To></soap:Header><soap:Body><wsd:Probe/></soap:Body></soap:Envelope>`
	_, _ = conn.WriteToUDP([]byte(soapProbe), dst)

	buf := make([]byte, 2048)
	for {
		n, addr, err := conn.ReadFromUDP(buf)
		if err != nil || n < 20 {
			break
		}
		ip := addr.IP.String()
		body := string(buf[:n])
		label := "WS-Discovery Endpoint"
		low := strings.ToLower(body)
		switch {
		case strings.Contains(low, "networkvideotransmitter") || strings.Contains(low, "onvif"):
			label = "ONVIF Network Camera"
		case strings.Contains(low, "printdevice") || strings.Contains(low, "printer"):
			label = "WSD Network Printer"
		case strings.Contains(low, "computer") || strings.Contains(low, "pub:computer"):
			label = "Windows WSD Host"
		}
		s.mu.Lock()
		s.wsdNames[ip] = label
		s.mu.Unlock()
	}
}

func classifyDeviceRole(isGW bool, familyHint string, ports []int, vendor, nbName, mdns, ssdp, wsd, tlsModel, httpTitle string) string {
	if isGW {
		return "router"
	}
	joined := strings.ToLower(strings.Join([]string{vendor, nbName, mdns, ssdp, wsd, tlsModel, httpTitle}, " "))
	switch {
	case containsPort(ports, 554) || strings.Contains(joined, "onvif") || strings.Contains(joined, "hikvision") || strings.Contains(joined, "dahua") || familyHint == "camera":
		return "camera"
	case containsPort(ports, 62078) || strings.Contains(joined, "iphone") || strings.Contains(joined, "ipad") || strings.Contains(joined, "galaxy") || strings.Contains(joined, "android"):
		return "smartphone"
	case containsPort(ports, 8008) || containsPort(ports, 8009) || strings.Contains(joined, "webos") || strings.Contains(joined, "tizen") || strings.Contains(joined, "bravia") || strings.Contains(joined, "smarttv") || strings.Contains(joined, "chromecast") || strings.Contains(joined, "dlna") || familyHint == "tv":
		return "tv"
	case containsPort(ports, 9100) || containsPort(ports, 631) || strings.Contains(joined, "printer") || familyHint == "printer":
		return "printer"
	case strings.Contains(joined, "synology") || strings.Contains(joined, "qnap") || familyHint == "nas":
		return "nas"
	case containsPort(ports, 139) || containsPort(ports, 445) || containsPort(ports, 3389) || containsPort(ports, 135) || nbName != "" || strings.Contains(joined, "windows wsd"):
		return "laptop"
	case strings.Contains(joined, "playstation") || strings.Contains(joined, "xbox") || strings.Contains(joined, "nintendo") || familyHint == "console":
		return "console"
	case familyHint != "":
		return familyHint
	default:
		return "iot"
	}
}

func buildSmartDisplayName(devType, hostname, vendor, tlsModel, ip string) string {
	if devType == "router" {
		if tlsModel != "" {
			if !strings.Contains(strings.ToLower(tlsModel), strings.ToLower(vendor)) && vendor != "Unknown Vendor" && vendor != "Standard IEEE Network Device" {
				return fmt.Sprintf("%s %s (الراوتر الرئيسي)", vendor, tlsModel)
			}
			return fmt.Sprintf("%s (الراوتر الرئيسي)", tlsModel)
		}
		if vendor != "" && vendor != "Unknown Vendor" {
			return fmt.Sprintf("%s Gateway Router", vendor)
		}
		return fmt.Sprintf("Gateway Router (%s)", ip)
	}
	if hostname != "" {
		return hostname
	}
	switch devType {
	case "smartphone":
		switch {
		case strings.Contains(vendor, "Apple"):
			return "Apple iPhone / iPad"
		case strings.Contains(vendor, "Samsung"):
			return "Samsung Galaxy"
		case strings.Contains(vendor, "Xiaomi"):
			return "Xiaomi / Redmi Phone"
		case strings.Contains(vendor, "Huawei") || strings.Contains(vendor, "Honor"):
			return vendor + " Phone"
		default:
			return "جوال لاسلكي (" + ip + ")"
		}
	case "tv":
		switch {
		case strings.Contains(vendor, "LG"):
			return "LG WebOS Smart TV"
		case strings.Contains(vendor, "Samsung"):
			return "Samsung Tizen Smart TV"
		case strings.Contains(vendor, "Sony"):
			return "Sony Bravia TV"
		default:
			return "Smart TV / Cast (" + ip + ")"
		}
	case "camera":
		return vendor + " IP Camera"
	case "nas":
		return vendor + " Storage"
	case "laptop":
		if vendor != "" && vendor != "Unknown Vendor" && vendor != "Standard IEEE Network Device" {
			return vendor + " PC"
		}
		return "Workstation / PC (" + ip + ")"
	case "printer":
		if vendor != "" && vendor != "Unknown Vendor" {
			return vendor
		}
		return "Network Printer (" + ip + ")"
	case "console":
		return vendor
	default:
		if vendor != "" && vendor != "Unknown Vendor" && vendor != "Standard IEEE Network Device" {
			return vendor
		}
		return "LAN Device (" + ip + ")"
	}
}

func estimateProximityFromRTT(rttMs float64, isGW bool) (distM float64, tier string, sigPct int) {
	if isGW {
		sig := int(math.Max(45, math.Min(99, 100.0-(rttMs*3.2))))
		d := math.Max(1.2, math.Min(18.0, 1.5+rttMs*0.85))
		return round2(d), "Core Gateway", sig
	}
	switch {
	case rttMs <= 2.2:
		return round2(1.2 + rttMs*0.6), "قريب جداً (< 3m)", 96
	case rttMs <= 6.5:
		return round2(2.8 + (rttMs-2.0)*1.1), "متوسط المدى (3m - 8m)", 84
	case rttMs <= 16.0:
		return round2(7.5 + (rttMs-6.5)*0.75), "بعيد نسبياً / خلف جدار (8m - 15m)", 68
	default:
		return round2(math.Min(25.0, 14.0+(rttMs-16.0)*0.3)), "نطاق طرفي (> 15m / PowerSave)", 52
	}
}

func describeOpenPorts(ports []int, tlsModel string) []string {
	var out []string
	names := map[int]string{
		21: "FTP (21)", 22: "SSH (22)", 23: "Telnet (23)", 53: "DNS Server (53)",
		80: "Web / SSL-HTTP (80)", 135: "WinRPC (135)", 139: "NetBIOS (139)", 443: "HTTPS/TLS (443)",
		445: "SMB Share (445)", 554: "RTSP Camera (554)", 631: "IPP Printer (631)", 1900: "UPnP/SSDP (1900)",
		3389: "Remote Desktop RDP (3389)", 5000: "UPnP/NAS (5000)", 5357: "WSD-HTTP (5357)",
		62078: "Apple iOS Sync (62078)", 7547: "TR-069 ISP (7547)",
		8008: "Google Cast / TV (8008)", 8009: "Smart TV TLS (8009)",
		8022: "OA-Admin (8022)", 8080: "HTTP-Alt (8080)", 8443: "HTTPS-Admin (8443)", 9100: "JetDirect Printer (9100)",
	}
	for _, p := range ports {
		if n, ok := names[p]; ok {
			out = append(out, n)
		} else {
			out = append(out, fmt.Sprintf("TCP/%d", p))
		}
	}
	if tlsModel != "" {
		out = append([]string{"X.509 ID: " + tlsModel}, out...)
	}
	return out
}

func probeHostQuickRTT(ip string) float64 {
	if runtime.GOOS == "windows" {
		t0 := time.Now()
		if _, ok := winapi.ProbeLayer2ARP(ip); ok {
			return round2(float64(time.Since(t0).Microseconds()) / 1000.0)
		}
	}
	for _, p := range []int{80, 53, 443} {
		t0 := time.Now()
		c, err := net.DialTimeout("tcp", fmt.Sprintf("%s:%d", ip, p), 220*time.Millisecond)
		if err == nil {
			_ = c.Close()
			return round2(float64(time.Since(t0).Microseconds()) / 1000.0)
		}
	}
	return 0
}

func extractIPv4Prefix24(ipStr string) string {
	ip := net.ParseIP(ipStr).To4()
	if ip == nil {
		return ""
	}
	return fmt.Sprintf("%d.%d.%d.", ip[0], ip[1], ip[2])
}

func isMulticastOrBroadcastIP(ip string) bool {
	return strings.HasPrefix(ip, "224.") || strings.HasPrefix(ip, "239.") || strings.HasSuffix(ip, ".255") || ip == "255.255.255.255"
}

func containsPort(list []int, target int) bool {
	for _, p := range list {
		if p == target {
			return true
		}
	}
	return false
}

func firstNonEmpty(vals ...string) string {
	for _, v := range vals {
		if strings.TrimSpace(v) != "" {
			return strings.TrimSpace(v)
		}
	}
	return ""
}

func fallbackMAC(mac, fb string) string {
	if strings.TrimSpace(mac) != "" {
		return strings.ToUpper(mac)
	}
	return fb
}

func ipToUint32(ipStr string) uint32 {
	ip := net.ParseIP(ipStr).To4()
	if ip == nil {
		return 0xffffffff
	}
	return binary.BigEndian.Uint32(ip)
}

func extractReadableToken(b []byte) string {
	var cur []byte
	for _, c := range b {
		if (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') || c == '-' {
			cur = append(cur, c)
		} else {
			if len(cur) >= 4 && !strings.HasPrefix(string(cur), "services") && !strings.HasPrefix(string(cur), "local") {
				return string(cur)
			}
			cur = cur[:0]
		}
	}
	return ""
}

func round2(v float64) float64 {
	return float64(int(v*100+0.5)) / 100.0
}

// SingleDeviceAuditResult holds the deep interactive audit of a single LAN IP or custom IP.
type SingleDeviceAuditResult struct {
	Device        LANDevice `json:"device"`
	PingSamplesMs []float64 `json:"ping_samples_ms"`
	AvgRTTMs      float64   `json:"avg_rtt_ms"`
	MinRTTMs      float64   `json:"min_rtt_ms"`
	MaxRTTMs      float64   `json:"max_rtt_ms"`
	JitterMs      float64   `json:"jitter_ms"`
	PacketLossPct float64   `json:"packet_loss_pct"`
	ScannedPorts  int       `json:"scanned_ports"`
	AuditDuration int64     `json:"audit_duration_ms"`
}

// ProbeSingleDeviceDeep executes an on-demand deep port/TLS/NetBIOS/LLMNR/RTT burst audit on ANY single IP.
func (s *Scanner) ProbeSingleDeviceDeep(ip string) (SingleDeviceAuditResult, error) {
	parsed := net.ParseIP(strings.TrimSpace(ip))
	if parsed == nil {
		return SingleDeviceAuditResult{}, fmt.Errorf("invalid IP address: %s", ip)
	}
	cleanIP := parsed.String()
	t0 := time.Now()

	route := winapi.GetDefaultGatewayInfo()
	hostSelf, _ := os.Hostname()

	var mac string
	if runtime.GOOS == "windows" {
		if m, ok := winapi.ProbeLayer2ARP(cleanIP); ok {
			mac = m
		}
	}
	if mac == "" {
		for _, e := range winapi.GetNativeARPTable() {
			if e.IP == cleanIP {
				mac = strings.ToUpper(e.MAC)
				break
			}
		}
	}

	var samples []float64
	lost := 0
	const totalPings = 6
	for i := 0; i < totalPings; i++ {
		r := probeHostQuickRTT(cleanIP)
		if r > 0 {
			samples = append(samples, r)
		} else if cleanIP == route.LocalIP {
			samples = append(samples, 0.05)
		} else {
			lost++
		}
		time.Sleep(26 * time.Millisecond)
	}

	var minR, maxR, sumR, avgR, jitR float64
	if len(samples) > 0 {
		minR = samples[0]
		maxR = samples[0]
		for _, v := range samples {
			sumR += v
			if v < minR {
				minR = v
			}
			if v > maxR {
				maxR = v
			}
		}
		avgR = sumR / float64(len(samples))
		var sq float64
		for _, v := range samples {
			d := v - avgR
			sq += d * d
		}
		jitR = math.Sqrt(sq / float64(len(samples)))
	}
	lossPct := round2((float64(lost) / float64(totalPings)) * 100.0)

	dev := s.fingerprintSingleDevice(cleanIP, mac, avgR, route, hostSelf, true)
	extraPorts := []int{25, 110, 143, 515, 1433, 1883, 3306, 5432, 5900, 8291, 8888, 9000}
	var pMu sync.Mutex
	var wg sync.WaitGroup
	for _, p := range extraPorts {
		if containsPort(dev.OpenPorts, p) {
			continue
		}
		wg.Add(1)
		go func(port int) {
			defer wg.Done()
			c, err := net.DialTimeout("tcp", fmt.Sprintf("%s:%d", cleanIP, port), 230*time.Millisecond)
			if err == nil {
				_ = c.Close()
				pMu.Lock()
				dev.OpenPorts = append(dev.OpenPorts, port)
				pMu.Unlock()
			}
		}(p)
	}
	wg.Wait()
	sort.Ints(dev.OpenPorts)
	dev.Services = describeOpenPorts(dev.OpenPorts, "")
	if len(samples) > 0 || len(dev.OpenPorts) > 0 || mac != "" {
		dev.Online = true
	}

	s.mu.Lock()
	replaced := false
	for idx := range s.latest.Devices {
		if s.latest.Devices[idx].IP == cleanIP {
			s.latest.Devices[idx] = dev
			replaced = true
			break
		}
	}
	if !replaced && dev.Online {
		s.latest.Devices = append(s.latest.Devices, dev)
		s.latest.TotalDevices = len(s.latest.Devices)
	}
	s.mu.Unlock()

	return SingleDeviceAuditResult{
		Device:        dev,
		PingSamplesMs: samples,
		AvgRTTMs:      round2(avgR),
		MinRTTMs:      round2(minR),
		MaxRTTMs:      round2(maxR),
		JitterMs:      round2(jitR),
		PacketLossPct: lossPct,
		ScannedPorts:  34,
		AuditDuration: time.Since(t0).Milliseconds(),
	}, nil
}

// SendWakeOnLAN broadcasts an IEEE 802.3 Magic Packet (6x 0xFF + 16x MAC) over UDP :9 and :7.
func SendWakeOnLAN(macStr string, subnetGatewayIP string) error {
	clean := strings.Map(func(r rune) rune {
		if (r >= '0' && r <= '9') || (r >= 'a' && r <= 'f') || (r >= 'A' && r <= 'F') {
			return r
		}
		return -1
	}, macStr)
	if len(clean) != 12 {
		return fmt.Errorf("invalid MAC address for Wake-on-LAN: %s", macStr)
	}
	macBytes, err := hex.DecodeString(clean)
	if err != nil || len(macBytes) != 6 {
		return fmt.Errorf("failed to decode MAC hex: %v", err)
	}

	var packet [102]byte
	for i := 0; i < 6; i++ {
		packet[i] = 0xFF
	}
	for rep := 0; rep < 16; rep++ {
		copy(packet[6+rep*6:], macBytes)
	}

	targets := []string{"255.255.255.255:9", "255.255.255.255:7"}
	if pfx := extractIPv4Prefix24(subnetGatewayIP); pfx != "" {
		targets = append(targets, pfx+"255:9")
	}

	sentAny := false
	for _, dst := range targets {
		conn, err := net.DialTimeout("udp4", dst, 300*time.Millisecond)
		if err == nil {
			_, wErr := conn.Write(packet[:])
			_ = conn.Close()
			if wErr == nil {
				sentAny = true
			}
		}
	}
	if !sentAny {
		return fmt.Errorf("unable to transmit UDP broadcast Magic Packet")
	}
	return nil
}
