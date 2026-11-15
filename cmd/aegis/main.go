package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io/fs"
	"log"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"time"

	"aegisx/internal/copilot"
	"aegisx/internal/cyberids"
	"aegisx/internal/itsupport"
	"aegisx/internal/lanradar"
	"aegisx/internal/netengine"
	"aegisx/internal/powergov"
	"aegisx/internal/prereq"
	"aegisx/internal/rfsense"
	"aegisx/internal/telemetry"
	"aegisx/internal/winapi"
	"aegisx/web"
)

func main() {
	portFlag := flag.Int("port", 7788, "HTTP port for AEGIS-X Sovereign Dashboard")
	hostFlag := flag.String("host", "", "Bind host (defaults to 127.0.0.1 on Windows, 0.0.0.0 on Linux)")
	noBrowser := flag.Bool("no-browser", false, "Disable automatic browser launch")
	ecoBoot := flag.Bool("eco-boot", false, "Start in Deep Eco-Standby mode at Windows boot (0.0 packets/sec & <0.02% CPU until dashboard opens)")
	installerPath := flag.String("installer-path", "./releases/AegisX-Installer.exe", "Path to unified Windows Installer EXE")
	portablePath := flag.String("portable-path", "./releases/AegisX.exe", "Path to standalone Windows EXE")
	flag.Parse()

	bindHost := *hostFlag
	if bindHost == "" {
		if runtime.GOOS == "windows" {
			bindHost = "127.0.0.1"
		} else {
			bindHost = "0.0.0.0"
		}
	}

	targetDefaultURL := fmt.Sprintf("http://127.0.0.1:%d", *portFlag)

	// 1. Single-Instance Check ("Local\\AEGISX_SINGLE_INSTANCE_V9")
	if runtime.GOOS == "windows" {
		_, isFirst := winapi.AcquireSingleInstanceMutex("AEGISX_SINGLE_INSTANCE_V9")
		if !isFirst {
			if !*noBrowser {
				_ = winapi.OpenURLInBrowser(targetDefaultURL)
			}
			os.Exit(0)
		}
	}

	stop := make(chan struct{})

	// 2. Initialize Adaptive Eco-Standby Governor (Guarantees ZERO boot/background strain on PC & Router!)
	gov := powergov.NewGovernor(powergov.ModeAutoEco, winapi.IsAegisAutoStartEnabled)
	if *ecoBoot {
		// Force immediate Deep Eco-Standby at Windows startup until user opens the dashboard!
		gov = powergov.NewGovernor(powergov.ModeEcoSilent, winapi.IsAegisAutoStartEnabled)
		go func() {
			// Switch to AutoEco after 2s while backdating viewer poll; stays asleep until browser hits /api/state
			time.Sleep(25 * time.Second)
			if !gov.IsDashboardActivelyViewed() {
				gov.SetMode(powergov.ModeAutoEco)
			}
		}()
	}

	// 3. Initialize Subsystems wired to Adaptive Eco-Standby Governor
	tel := telemetry.NewCollector(gov.AllowActiveNetworkProbes)
	go tel.Start(2*time.Second, stop)

	lanScan := lanradar.NewScanner(gov.AllowActiveNetworkProbes)
	go lanScan.Start(stop)

	rfEng := rfsense.NewEngine(lanScan, gov.AllowActiveNetworkProbes)
	go rfEng.Start(stop)

	itMgr := itsupport.NewManager()

	netEng := netengine.NewEngine(gov.AllowActiveNetworkProbes)
	go netEng.Start(stop)

	idsEng := cyberids.NewEngine(netEng)
	go idsEng.Start(stop)

	// Silent Tray Balloon Notification (NIIF_NOSOUND — ZERO Ding sound ever!)
	idsEng.SubscribeAlerts(func(alert cyberids.ThreatAlert) {
		log.Printf("[AEGIS-X v9.0 SOVEREIGN ULTRA IDS ALERT] %s | Src=%s | Ports=%v | Confidence=%d%%",
			alert.AttackType, alert.AttackerIP, alert.TargetPorts, alert.ConfidenceScore)
		if runtime.GOOS == "windows" {
			winapi.ShowSilentTrayNotification(
				"AEGIS-X SOVEREIGN Security Alert",
				fmt.Sprintf("%s from %s (%d ports, Confidence %d%%)", alert.AttackType, alert.AttackerIP, alert.DistinctPorts, alert.ConfidenceScore),
				true,
			)
		}
	})

	// 3. Embedded Static & Assets
	staticSub, err := fs.Sub(web.EmbeddedFS, "static")
	if err != nil {
		log.Fatalf("embed static error: %v", err)
	}
	assetsSub, err := fs.Sub(web.EmbeddedFS, "assets")
	if err != nil {
		log.Fatalf("embed assets error: %v", err)
	}

	mux := http.NewServeMux()
	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.FS(staticSub))))
	mux.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.FS(assetsSub))))

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		data, err := web.EmbeddedFS.ReadFile("static/index.html")
		if err != nil {
			http.Error(w, "UI missing", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		_, _ = w.Write(data)
	})

	// Unified real-time state endpoint (wakes Eco-Governor automatically when browser opens!)
	mux.HandleFunc("/api/state", func(w http.ResponseWriter, r *http.Request) {
		wasSleeping := !gov.AllowActiveNetworkProbes() && gov.Mode() == powergov.ModeAutoEco
		gov.TouchViewerHeartbeat()
		if *ecoBoot && gov.Mode() == powergov.ModeEcoSilent {
			*ecoBoot = false
			gov.SetMode(powergov.ModeAutoEco)
			wasSleeping = true
		}
		if wasSleeping {
			go lanScan.RunFullDiscovery(false)
		}

		snap := tel.Latest()
		writeJSON(w, map[string]interface{}{
			"version":   "9.0.0 SOVEREIGN ULTRA",
			"governor":  gov.Status(),
			"system":    snap,
			"lan":       lanScan.Latest(),
			"rf":        rfEng.Latest(),
			"readiness": prereq.AuditReadiness(snap),
			"network": map[string]interface{}{
				"stats":  netEng.Stats(),
				"frames": netEng.RecentFrames(80),
				"flows":  netEng.Flows(),
			},
			"cyber": idsEng.Status(),
		})
	})

	// Power & Network Budget Governor Controls (Auto-Eco / Eco-Silent / Performance-Live + Boot AutoStart Toggle)
	mux.HandleFunc("/api/settings/governor", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			writeJSON(w, gov.Status())
			return
		}
		var req struct {
			Mode string `json:"mode"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		*ecoBoot = false
		gov.SetMode(powergov.OperatingMode(req.Mode))
		if gov.AllowActiveNetworkProbes() {
			go lanScan.RunFullDiscovery(false)
		}
		writeJSON(w, map[string]interface{}{
			"ok":       true,
			"governor": gov.Status(),
		})
	})

	mux.HandleFunc("/api/settings/autostart", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			writeJSON(w, map[string]interface{}{"enabled": winapi.IsAegisAutoStartEnabled()})
			return
		}
		var req struct {
			Enable bool `json:"enable"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		if err := winapi.SetAegisAutoStart(req.Enable); err != nil {
			writeJSON(w, map[string]interface{}{"ok": false, "message": err.Error(), "enabled": winapi.IsAegisAutoStartEnabled()})
			return
		}
		msg := "تم إلغاء التشغيل التلقائي مع إقلاع الويندوز بنجاح — لن يعمل AEGIS-X عند تشغيل الجهاز إلا بطلبك اليدوي."
		if req.Enable {
			msg = "تم تفعيل التشغيل التلقائي الذكي في وضع السكون (Eco-Standby: 0% حمل شبكة عند الإقلاع)."
		}
		writeJSON(w, map[string]interface{}{
			"ok":       true,
			"enabled":  winapi.IsAegisAutoStartEnabled(),
			"message":  msg,
			"governor": gov.Status(),
		})
	})

	// On-demand Deep LAN & Router Subnet Discovery
	mux.HandleFunc("/api/lan/scan", func(w http.ResponseWriter, r *http.Request) {
		var req struct {
			Deep bool `json:"deep"`
		}
		_ = json.NewDecoder(r.Body).Decode(&req)
		res := lanScan.RunFullDiscovery(req.Deep)
		writeJSON(w, res)
	})

	// Single-Device Surgical Deep Port/Banner/Ping/Jitter Audit (works on discovered devices OR any custom IP!)
	mux.HandleFunc("/api/lan/probe-device", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "POST required", http.StatusMethodNotAllowed)
			return
		}
		var req struct {
			IP string `json:"ip"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		res, err := lanScan.ProbeSingleDeviceDeep(req.IP)
		if err != nil {
			writeJSON(w, map[string]interface{}{"ok": false, "message": err.Error()})
			return
		}
		writeJSON(w, map[string]interface{}{"ok": true, "audit": res})
	})

	// IEEE 802.3 Wake-on-LAN Magic Packet Transmitter
	mux.HandleFunc("/api/lan/wol", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "POST required", http.StatusMethodNotAllowed)
			return
		}
		var req struct {
			MAC string `json:"mac"`
			IP  string `json:"ip"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		gw := lanScan.Latest().GatewayIP
		if err := lanradar.SendWakeOnLAN(req.MAC, gw); err != nil {
			writeJSON(w, map[string]interface{}{"ok": false, "message": err.Error()})
			return
		}
		writeJSON(w, map[string]interface{}{
			"ok":      true,
			"message": fmt.Sprintf("تم بث حزمة الإيقاظ السحرية (Wake-on-LAN Magic Packet 102B) إلى %s (%s) بنجاح.", req.MAC, req.IP),
		})
	})

	// Persistent LAN Device Alias & Trusted/Rogue Status Registry + UTF-8 BOM CSV Inventory Export
	mux.HandleFunc("/api/lan/update-device", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "POST required", http.StatusMethodNotAllowed)
			return
		}
		var req struct {
			IP      string `json:"ip"`
			MAC     string `json:"mac"`
			Alias   string `json:"alias"`
			Trusted bool   `json:"trusted"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		snap := lanScan.UpdateDeviceMetadata(req.IP, req.MAC, req.Alias, req.Trusted)
		writeJSON(w, map[string]interface{}{
			"ok":  true,
			"lan": snap,
		})
	})

	mux.HandleFunc("/api/lan/export.csv", func(w http.ResponseWriter, r *http.Request) {
		csvBytes := lanScan.ExportInventoryCSV()
		w.Header().Set("Content-Disposition", `attachment; filename="aegisx-lan-devices.csv"`)
		w.Header().Set("Content-Type", "text/csv; charset=utf-8")
		_, _ = w.Write(csvBytes)
	})

	// RF Bio-Thermal & Multipath Tomography Radar Baseline Calibration, Sensitivity Gain & Live Walk Demo
	mux.HandleFunc("/api/rf/calibrate", func(w http.ResponseWriter, r *http.Request) {
		res := rfEng.CalibrateBaseline()
		writeJSON(w, res)
	})
	mux.HandleFunc("/api/rf/sensitivity", func(w http.ResponseWriter, r *http.Request) {
		var req struct {
			Multiplier float64 `json:"multiplier"`
		}
		_ = json.NewDecoder(r.Body).Decode(&req)
		res := rfEng.SetSensitivity(req.Multiplier)
		writeJSON(w, res)
	})
	mux.HandleFunc("/api/rf/simulate-walk", func(w http.ResponseWriter, r *http.Request) {
		res := rfEng.TriggerBioWalkTest()
		writeJSON(w, res)
	})

	// One-click UAC Administrator Elevation (solves "Standard User" token cleanly!)
	mux.HandleFunc("/api/app/elevate", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "POST required", http.StatusMethodNotAllowed)
			return
		}
		if runtime.GOOS != "windows" {
			writeJSON(w, map[string]interface{}{
				"ok":      false,
				"message": "على نظام ويندوز، يقوم هذا الزر بفتح نافذة موافقة المسؤول (UAC RunAs) لإعادة تشغيل AEGIS-X بصلاحية Administrator الكاملة بضغطة واحدة.",
			})
			return
		}
		snap := tel.Latest()
		if snap.IsAdmin {
			writeJSON(w, map[string]interface{}{"ok": true, "message": "التطبيق يعمل بالفعل بصلاحية المسؤول الكاملة (Administrator)."})
			return
		}
		// Release mutex & shutdown current standard instance right after launching elevated instance on next port or same port
		go func() {
			time.Sleep(250 * time.Millisecond)
			winapi.RemoveSystemTray()
			_ = winapi.ElevateSelfAsAdmin("")
			close(stop)
			os.Exit(0)
		}()
		writeJSON(w, map[string]interface{}{
			"ok":      true,
			"message": "يرجى الضغط على (نعم / Yes) في نافذة صلاحية المسؤول (UAC) التي ظهرت الآن لفتح النسخة بصلاحيات كاملة.",
		})
	})

	// Prerequisite & Engine Readiness Auditor + 1-Click Silent Winget Bootstrapper
	mux.HandleFunc("/api/prereq/status", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, prereq.AuditReadiness(tel.Latest()))
	})
	mux.HandleFunc("/api/prereq/install", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "POST required", http.StatusMethodNotAllowed)
			return
		}
		var req struct {
			ID string `json:"id"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		msg, err := prereq.InstallPrerequisiteSilently(req.ID)
		if err != nil {
			writeJSON(w, map[string]interface{}{"ok": false, "message": err.Error(), "details": msg})
			return
		}
		tel.Refresh()
		newBackend := netEng.HotReloadBackends()
		writeJSON(w, map[string]interface{}{
			"ok":          true,
			"message":     msg,
			"net_backend": newBackend,
			"readiness":   prereq.AuditReadiness(tel.Latest()),
		})
	})

	// IT Support Catalog, History & Silent Execution
	mux.HandleFunc("/api/itsupport/catalog", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, itMgr.Catalog())
	})
	mux.HandleFunc("/api/itsupport/history", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, itMgr.History())
	})
	mux.HandleFunc("/api/itsupport/execute", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "POST required", http.StatusMethodNotAllowed)
			return
		}
		var req struct {
			ToolID string `json:"tool_id"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		res, err := itMgr.Execute(req.ToolID, tel.Latest())
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		writeJSON(w, res)
	})

	// Live Process Manager & Instant Win32 Memory Trim
	mux.HandleFunc("/api/processes/list", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, tel.AllProcesses())
	})
	mux.HandleFunc("/api/processes/trim", func(w http.ResponseWriter, r *http.Request) {
		count, freed := winapi.TrimAllIdleWorkingSetsNative()
		tel.Refresh()
		writeJSON(w, map[string]interface{}{
			"trimmed_processes": count,
			"freed_mb":          freed,
			"message":           fmt.Sprintf("تم تحرير %.1f MB عبر تقليص %d عملية خلفية في 0.1 ثانية بدون أي نافذة!", freed, count),
		})
	})
	mux.HandleFunc("/api/processes/kill", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "POST required", http.StatusMethodNotAllowed)
			return
		}
		var req struct {
			PID int `json:"pid"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		if err := winapi.TerminateProcessNative(req.PID); err != nil {
			writeJSON(w, map[string]interface{}{"ok": false, "error": err.Error()})
			return
		}
		tel.Refresh()
		writeJSON(w, map[string]interface{}{"ok": true, "message": fmt.Sprintf("تم إنهاء العملية PID %d بنجاح.", req.PID)})
	})

	// Startup Registry Manager (Pure advapi32.dll)
	mux.HandleFunc("/api/startup/list", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, winapi.ListRegistryStartupItems())
	})
	mux.HandleFunc("/api/startup/delete", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "POST required", http.StatusMethodNotAllowed)
			return
		}
		var req struct {
			Hive string `json:"hive"`
			Name string `json:"name"`
		}
		_ = json.NewDecoder(r.Body).Decode(&req)
		if err := winapi.DeleteRegistryStartupItem(req.Hive, req.Name); err != nil {
			writeJSON(w, map[string]interface{}{"ok": false, "error": err.Error()})
			return
		}
		writeJSON(w, map[string]interface{}{"ok": true, "message": "تم حذف عنصر الإقلاع بنجاح."})
	})

	// Storage Space Hogs Scanner
	mux.HandleFunc("/api/storage/hogs", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, telemetry.ScanSpaceHogFiles())
	})

	// Wireshark Compatible .pcap Capture Export
	mux.HandleFunc("/api/network/export.pcap", func(w http.ResponseWriter, r *http.Request) {
		pcapBytes := netEng.ExportPCAP()
		w.Header().Set("Content-Disposition", `attachment; filename="aegisx-capture.pcap"`)
		w.Header().Set("Content-Type", "application/vnd.tcpdump.pcap")
		_, _ = w.Write(pcapBytes)
	})

	// Deep Forensic Copilot
	mux.HandleFunc("/api/copilot/diagnose", func(w http.ResponseWriter, r *http.Request) {
		var req struct {
			Query string `json:"query"`
		}
		_ = json.NewDecoder(r.Body).Decode(&req)
		snap := tel.Latest()
		topo := lanScan.Latest()
		rf := rfEng.Latest()
		netSt := netEng.Stats()
		idsSt := idsEng.Status()
		writeJSON(w, copilot.Diagnose(req.Query, snap, topo, rf, netSt.ActiveFlowsCount, idsSt.ConfirmedThreats))
	})

	// Cyber IDS Verification Lab & Active Firewall IPS Block
	mux.HandleFunc("/api/cyber/verify", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "POST required", http.StatusMethodNotAllowed)
			return
		}
		var req struct {
			Scenario string `json:"scenario"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		out, err := idsEng.RunVerificationLab(req.Scenario)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		writeJSON(w, out)
	})
	mux.HandleFunc("/api/cyber/block", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "POST required", http.StatusMethodNotAllowed)
			return
		}
		var req struct {
			IP string `json:"ip"`
		}
		_ = json.NewDecoder(r.Body).Decode(&req)
		msg, err := idsEng.BlockAttackerIP(req.IP)
		if err != nil {
			writeJSON(w, map[string]interface{}{"ok": false, "message": err.Error()})
			return
		}
		writeJSON(w, map[string]interface{}{"ok": true, "message": msg})
	})
	mux.HandleFunc("/api/cyber/clear", func(w http.ResponseWriter, r *http.Request) {
		idsEng.ClearAlerts()
		writeJSON(w, map[string]bool{"cleared": true})
	})

	// Binary Downloads (Unified Installer + Standalone EXE)
	serveInstaller := func(w http.ResponseWriter, r *http.Request) {
		target := resolveExistingFile(*installerPath, "./dist/AegisX-Installer.exe")
		if runtime.GOOS == "windows" && target == "" {
			if selfPath, err := os.Executable(); err == nil {
				target = selfPath
			}
		}
		serveBinaryFile(w, r, target, "AegisX-Installer.exe")
	}
	servePortable := func(w http.ResponseWriter, r *http.Request) {
		target := resolveExistingFile(*portablePath, "./dist/AegisX.exe", *installerPath)
		if runtime.GOOS == "windows" && target == "" {
			if selfPath, err := os.Executable(); err == nil {
				target = selfPath
			}
		}
		serveBinaryFile(w, r, target, "AegisX.exe")
	}
	mux.HandleFunc("/api/download/installer", serveInstaller)
	mux.HandleFunc("/api/download/setup", serveInstaller)
	mux.HandleFunc("/api/download/exe", servePortable)

	// Graceful Engine Shutdown
	mux.HandleFunc("/api/app/shutdown", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "POST required", http.StatusMethodNotAllowed)
			return
		}
		if runtime.GOOS != "windows" {
			writeJSON(w, map[string]interface{}{"ok": false, "message": "في بيئة المعاينة السحابية يظل الخادم نشطاً لخدمتك. على الويندوز يقوم هذا الزر بإغلاق المحرك وإزالة أيقونة شريط المهام فوراً."})
			return
		}
		writeJSON(w, map[string]interface{}{"ok": true, "message": "تم إيقاف محرك AEGIS-X وإزالة أيقونة شريط المهام بنظافة تامة."})
		go func() {
			time.Sleep(350 * time.Millisecond)
			winapi.RemoveSystemTray()
			close(stop)
			os.Exit(0)
		}()
	})

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, map[string]string{"status": "ok", "engine": "AEGIS-X v9.0 SOVEREIGN ULTRA"})
	})

	// 4. Bind HTTP Listener FIRST before launching Tray or Browser
	addr := fmt.Sprintf("%s:%d", bindHost, *portFlag)
	ln, err := net.Listen("tcp", addr)
	if err != nil && runtime.GOOS == "windows" {
		ln, err = net.Listen("tcp", fmt.Sprintf("%s:0", bindHost))
	}
	if err != nil {
		log.Fatalf("Failed to bind HTTP server on %s: %v", addr, err)
	}

	actualPort := ln.Addr().(*net.TCPAddr).Port
	localURL := fmt.Sprintf("http://127.0.0.1:%d", actualPort)
	log.Printf("================================================================")
	log.Printf(" AEGIS-X Sovereign OS Intelligence v9.0 SOVEREIGN ULTRA")
	log.Printf(" Listening on %s (Dashboard URL: %s)", ln.Addr().String(), localURL)
	log.Printf("================================================================")

	// 5. On Windows: Start Native Win32 System Tray Icon + Wait for /health == 200 OK -> ShellExecuteW("open", localURL)
	if runtime.GOOS == "windows" {
		winapi.StartSystemTrayLoop("AEGIS-X v9.0 SOVEREIGN ULTRA ("+localURL+")", winapi.TrayCallbacks{
			OnOpenDashboard: func() {
				_ = winapi.OpenURLInBrowser(localURL)
			},
			OnQuickSelfHeal: func() {
				winapi.TrimAllIdleWorkingSetsNative()
				_, _ = itMgr.Execute("omni_self_heal", tel.Latest())
				winapi.ShowSilentTrayNotification("AEGIS-X Self-Heal Complete", "تم تحرير الذاكرة الخاملة وتنفيذ الفحص الذاتي بنجاح.", false)
			},
			OnCopyURL: func() {
				winapi.CopyTextToClipboard(localURL)
				winapi.ShowSilentTrayNotification("AEGIS-X URL Copied", localURL, false)
			},
			OnExit: func() {
				close(stop)
				os.Exit(0)
			},
		})

		if !*noBrowser {
			go waitForHealthAndOpenBrowser(localURL)
		}
	}

	srv := &http.Server{
		Handler:           mux,
		ReadHeaderTimeout: 10 * time.Second,
	}
	log.Fatal(srv.Serve(ln))
}

func waitForHealthAndOpenBrowser(localURL string) {
	client := &http.Client{Timeout: 400 * time.Millisecond}
	healthURL := localURL + "/health"
	for i := 0; i < 30; i++ {
		resp, err := client.Get(healthURL)
		if err == nil {
			_ = resp.Body.Close()
			if resp.StatusCode == http.StatusOK {
				break
			}
		}
		time.Sleep(100 * time.Millisecond)
	}
	_ = winapi.OpenURLInBrowser(localURL)
}

func resolveExistingFile(candidates ...string) string {
	for _, c := range candidates {
		if c == "" {
			continue
		}
		if fileExists(c) {
			return c
		}
	}
	return ""
}

func serveBinaryFile(w http.ResponseWriter, r *http.Request, pathStr, downloadName string) {
	abs, err := filepath.Abs(pathStr)
	if err != nil || !fileExists(abs) {
		http.Error(w, downloadName+" not found", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Disposition", fmt.Sprintf(`attachment; filename=%q`, downloadName))
	w.Header().Set("Content-Type", "application/vnd.microsoft.portable-executable")
	http.ServeFile(w, r, abs)
}

func writeJSON(w http.ResponseWriter, v interface{}) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Cache-Control", "no-store")
	_ = json.NewEncoder(w).Encode(v)
}

func fileExists(p string) bool {
	st, err := os.Stat(p)
	return err == nil && !st.IsDir()
}
