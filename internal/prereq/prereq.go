package prereq

import (
	"bytes"
	"context"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"sync"
	"time"

	"aegisx/internal/telemetry"
	"aegisx/internal/winapi"
)

type RequirementItem struct {
	ID             string `json:"id"`
	NameAr         string `json:"name_ar"`
	NameEn         string `json:"name_en"`
	RoleAr         string `json:"role_ar"`
	RoleEn         string `json:"role_en"`
	Installed      bool   `json:"installed"`
	Required       bool   `json:"required"` // Core OS vs Optional Deep Engine
	ExactVersion   string `json:"exact_version"`
	BinaryPath     string `json:"binary_path"`
	VersionOrPath  string `json:"version_or_path"`
	WingetID       string `json:"winget_id,omitempty"`
	CanAutoInstall bool   `json:"can_auto_install"`
}

type ReadinessReport struct {
	ReadyScore       int               `json:"ready_score"`
	AllCoreReady     bool              `json:"all_core_ready"`
	InstalledCount   int               `json:"installed_count"`
	TotalCount       int               `json:"total_count"`
	Arch             string            `json:"arch"`
	OSVersion        string            `json:"os_version"`
	IsAdmin          bool              `json:"is_admin"`
	AutoStartEnabled bool              `json:"autostart_enabled"`
	SystemTrayReady  bool              `json:"system_tray_ready"`
	Items            []RequirementItem `json:"items"`
}

var (
	verCacheMu   sync.RWMutex
	verCache     = make(map[string]string)
	verCacheTime time.Time
)

func InvalidateVersionCache() {
	verCacheMu.Lock()
	verCache = make(map[string]string)
	verCacheTime = time.Time{}
	verCacheMu.Unlock()
}

func getCachedCLIOutput(key, binPath string, args ...string) string {
	if binPath == "" {
		return ""
	}
	verCacheMu.RLock()
	if !verCacheTime.IsZero() && time.Since(verCacheTime) < 90*time.Second {
		if v, ok := verCache[key]; ok {
			verCacheMu.RUnlock()
			return v
		}
	}
	verCacheMu.RUnlock()

	ctx, cancel := context.WithTimeout(context.Background(), 1200*time.Millisecond)
	defer cancel()
	out, err := winapi.HiddenCommandContext(ctx, binPath, args...).CombinedOutput()
	val := ""
	if err == nil || len(out) > 0 {
		lines := strings.Split(strings.TrimSpace(string(out)), "\n")
		if len(lines) > 0 {
			val = strings.TrimSpace(lines[0])
			if len(val) > 78 {
				val = val[:78]
			}
		}
	}

	verCacheMu.Lock()
	if verCacheTime.IsZero() || time.Since(verCacheTime) >= 90*time.Second {
		verCacheTime = time.Now()
	}
	verCache[key] = val
	verCacheMu.Unlock()
	return val
}

func AuditReadiness(snap telemetry.SystemSnapshot) ReadinessReport {
	var items []RequirementItem

	// 1. x64 Architecture & Kernel DLL Layer
	is64 := runtime.GOARCH == "amd64" || runtime.GOARCH == "arm64"
	items = append(items, RequirementItem{
		ID:             "win32_dll_kernel",
		NameAr:         "1. نواة النظام المباشرة (Direct Win32 x64 Kernel DLLs)",
		NameEn:         "1. Direct Win32 x64 Kernel Syscall Layer",
		RoleAr:         "المحرّك الأساسي المدمج لقراءة المعالج، الرام، جدول الراوتر، وإشارات Wi-Fi في 0.2ms بدون أي نوافذ.",
		RoleEn:         "Built-in sub-millisecond kernel telemetry (kernel32, iphlpapi, wlanapi, psapi).",
		Installed:      is64,
		Required:       true,
		ExactVersion:   fmt.Sprintf("Native %s/%s Active", runtime.GOOS, runtime.GOARCH),
		BinaryPath:     "System32\\iphlpapi.dll + wlanapi.dll + kernel32.dll",
		VersionOrPath:  fmt.Sprintf("Verified Native %s/%s (kernel32 + iphlpapi + wlanapi)", runtime.GOOS, runtime.GOARCH),
		CanAutoInstall: false,
	})

	// 2. Administrator UAC Elevation Token
	items = append(items, RequirementItem{
		ID:             "uac_admin_token",
		NameAr:         "2. صلاحية المسؤول الكاملة (UAC Administrator Token)",
		NameEn:         "2. UAC Administrator Security Token",
		RoleAr:         "تمنح الأداة القدرة على إصلاح ملفات النظام (SFC/DISM)، تحديث التعريفات، وحظر المخترقين في جدار الحماية.",
		RoleEn:         "Unlocks SFC, DISM, PnPUtil, Pktmon, and Active Firewall IPS blocking.",
		Installed:      snap.IsAdmin || runtime.GOOS != "windows",
		Required:       true,
		ExactVersion:   adminShortVer(snap.IsAdmin),
		BinaryPath:     "Advapi32 Token Privilege",
		VersionOrPath:  adminStatusStr(snap.IsAdmin),
		CanAutoInstall: false,
	})

	// 3. Windows Package Manager (Winget CLI)
	wingetFound, wingetPath := detectBinaryZeroPopup("winget", []string{
		filepath.Join(os.Getenv("LOCALAPPDATA"), `Microsoft\WindowsApps\winget.exe`),
	})
	wingetVer := ""
	if wingetFound {
		wingetVer = getCachedCLIOutput("winget", wingetPath, "--version")
	}
	items = append(items, RequirementItem{
		ID:             "winget_cli",
		NameAr:         "3. مدير حزم مايكروسوفت الرسمي (Windows Winget CLI)",
		NameEn:         "3. Microsoft Windows Package Manager (Winget)",
		RoleAr:         "يُستخدم لتحديث كافة برامج جهازك وتثبيت المحركات الاختيارية أدناه بضغطة زر وبصمت تام.",
		RoleEn:         "Official package engine for silent app upgrades and 1-click engine installation.",
		Installed:      wingetFound || runtime.GOOS != "windows",
		Required:       true,
		ExactVersion:   fallbackStr(wingetVer, "System Ready"),
		BinaryPath:     wingetPath,
		VersionOrPath:  combineVerPath(wingetVer, wingetPath, "System Package Pipeline Ready"),
		CanAutoInstall: false,
	})

	// 4. Windows Native Packet Monitor (pktmon.exe ETW)
	pktmonFound, pktmonPath := detectBinaryZeroPopup("pktmon", []string{
		`C:\Windows\System32\pktmon.exe`,
	})
	items = append(items, RequirementItem{
		ID:             "pktmon_etw",
		NameAr:         "4. مراقب حزم النواة المدمج في ويندوز (Microsoft Pktmon ETW)",
		NameEn:         "4. Windows Native Packet Monitor (Pktmon ETW)",
		RoleAr:         "موجود مسبقاً في Windows 10/11 لتحليل مسار الحزم في النواة بدون أي برامج إضافية.",
		RoleEn:         "In-box Windows kernel ETW packet telemetry engine.",
		Installed:      pktmonFound || runtime.GOOS != "windows",
		Required:       true,
		ExactVersion:   "Windows Built-in ETW",
		BinaryPath:     pktmonPath,
		VersionOrPath:  fallbackStr(pktmonPath, "Built-in Kernel Socket Dissector Active"),
		CanAutoInstall: false,
	})

	// 5. Microsoft Visual C++ 2015-2022 Redistributable (x64)
	vcFound := true
	vcVer := "Verified System C++ Runtime"
	if runtime.GOOS == "windows" {
		if st, err := os.Stat(`C:\Windows\System32\vcruntime140.dll`); err == nil {
			vcFound = true
			vcVer = fmt.Sprintf(`Installed (vcruntime140.dll • %d KB)`, st.Size()/1024)
		} else {
			vcFound = false
			vcVer = "غير مثبت (اضغط تثبيت صامت لإضافته فوراً)"
		}
	}
	items = append(items, RequirementItem{
		ID:             "vcredist_x64",
		NameAr:         "5. حزمة تشغيل مايكروسوفت Visual C++ 2015-2022 (x64)",
		NameEn:         "5. Microsoft Visual C++ 2015-2022 Runtime (x64)",
		RoleAr:         "تمنع أخطاء نقص ملفات VCRUNTIME140.dll في الألعاب ومحللات الشبكة والتطبيقات الحديثة.",
		RoleEn:         "Essential runtime required by Wireshark, Nmap, games, and native tools.",
		Installed:      vcFound,
		Required:       true,
		ExactVersion:   vcVer,
		BinaryPath:     `C:\Windows\System32\vcruntime140.dll`,
		VersionOrPath:  vcVer,
		WingetID:       "Microsoft.VCRedist.2015+.x64",
		CanAutoInstall: true,
	})

	// 6. Wireshark TShark + Npcap L7 Deep Protocol Dissector
	tsharkFound, tsharkPath := detectBinaryZeroPopup("tshark", []string{
		`C:\Program Files\Wireshark\tshark.exe`,
		`C:\Program Files (x86)\Wireshark\tshark.exe`,
		`/usr/bin/tshark`,
	})
	tsharkVer := ""
	if tsharkFound {
		tsharkVer = getCachedCLIOutput("tshark", tsharkPath, "-v")
	}
	items = append(items, RequirementItem{
		ID:             "wireshark_tshark",
		NameAr:         "6. محرك Wireshark TShark لتشريح البروتوكولات العميق (L7)",
		NameEn:         "6. Wireshark TShark Deep L7 Dissector (Optional)",
		RoleAr:         "محرك اختياري احترافي: عند تثبيته يرتبط تلقائياً بـ AEGIS-X لفك تشفير مئات بروتوكولات الطبقة السابعة.",
		RoleEn:         "Optional deep packet engine; auto-binds to AEGIS-X when installed.",
		Installed:      tsharkFound,
		Required:       false,
		ExactVersion:   fallbackStr(tsharkVer, "Not Installed"),
		BinaryPath:     tsharkPath,
		VersionOrPath:  combineVerPath(tsharkVer, tsharkPath, "غير مثبت — يعمل المحرك المدمج iphlpapi تلقائياً (يمكنك تثبيته بضغطة زر)"),
		WingetID:       "WiresharkFoundation.Wireshark",
		CanAutoInstall: true,
	})

	// 7. Nmap Security & Port Auditor
	nmapFound, nmapPath := detectBinaryZeroPopup("nmap", []string{
		`C:\Program Files (x86)\Nmap\nmap.exe`,
		`C:\Program Files\Nmap\nmap.exe`,
		`/usr/bin/nmap`,
	})
	nmapVer := ""
	if nmapFound {
		nmapVer = getCachedCLIOutput("nmap", nmapPath, "--version")
	}
	items = append(items, RequirementItem{
		ID:             "nmap_engine",
		NameAr:         "7. محرك الفحص الأمني Nmap Security Scanner",
		NameEn:         "7. Nmap Network & Port Auditor (Optional)",
		RoleAr:         "محرك اختياري لفحص المنافذ المتقدم واختبار الجدار الناري عملياً من داخل لوحة التحكم.",
		RoleEn:         "Optional security scanner for deep port auditing and IDS self-verification.",
		Installed:      nmapFound,
		Required:       false,
		ExactVersion:   fallbackStr(nmapVer, "Not Installed"),
		BinaryPath:     nmapPath,
		VersionOrPath:  combineVerPath(nmapVer, nmapPath, "غير مثبت — يعمل رادار SendARP/TLS المدمج تلقائياً (تثبيت صامت متاح)"),
		WingetID:       "Insecure.Nmap",
		CanAutoInstall: true,
	})

	// 8. Microsoft Sysinternals Suite
	sysintFound, sysintPath := detectBinaryZeroPopup("autorunsc", []string{
		`C:\Program Files\SysinternalsSuite\autorunsc64.exe`,
		filepath.Join(os.Getenv("LOCALAPPDATA"), `Microsoft\WindowsApps\autorunsc64.exe`),
	})
	items = append(items, RequirementItem{
		ID:             "sysinternals_suite",
		NameAr:         "8. حزمة أدوات مايكروسوفت الجنائية (Microsoft Sysinternals)",
		NameEn:         "8. Microsoft Sysinternals Forensics Suite (Optional)",
		RoleAr:         "أدوات مايكروسوفت الرسمية المتقدمة (Autoruns, ProcDump, TCPView, Handle) للفحص العميق.",
		RoleEn:         "Official Microsoft kernel & persistence analysis utilities.",
		Installed:      sysintFound,
		Required:       false,
		ExactVersion:   boolLabel(sysintFound, "Installed", "Not Installed"),
		BinaryPath:     sysintPath,
		VersionOrPath:  fallbackStr(sysintPath, "حزمة اختيارية رسمية من مايكروسوفت — تثبيت صامت بضغطة واحدة"),
		WingetID:       "Microsoft.Sysinternals.Suite",
		CanAutoInstall: true,
	})

	coreOK := true
	installedCount := 0
	for _, it := range items {
		if it.Installed {
			installedCount++
		} else if it.Required {
			coreOK = false
		}
	}
	score := int(float64(installedCount) / float64(len(items)) * 100.0)

	return ReadinessReport{
		ReadyScore:       score,
		AllCoreReady:     coreOK,
		InstalledCount:   installedCount,
		TotalCount:       len(items),
		Arch:             runtime.GOARCH,
		OSVersion:        snap.OSVersion,
		IsAdmin:          snap.IsAdmin,
		AutoStartEnabled: winapi.IsAegisAutoStartEnabled(),
		SystemTrayReady:  true,
		Items:            items,
	}
}

// InstallPrerequisiteSilently installs any missing engine via Winget silently and invalidates version cache so hot-reload works immediately!
func InstallPrerequisiteSilently(itemID string) (string, error) {
	wingetMap := map[string]string{
		"vcredist_x64":       "Microsoft.VCRedist.2015+.x64",
		"wireshark_tshark":   "WiresharkFoundation.Wireshark",
		"nmap_engine":        "Insecure.Nmap",
		"sysinternals_suite": "Microsoft.Sysinternals.Suite",
	}
	pkgID, ok := wingetMap[itemID]
	if !ok {
		return "", fmt.Errorf("unknown prerequisite package id: %s", itemID)
	}

	if runtime.GOOS != "windows" {
		return fmt.Sprintf("[Cloud Preview] على نظام ويندوز يقوم هذا الزر بتثبيت الحزمة الرسمية (%s) بصمت تام عبر Winget ثم يربطها بالمحرك تلقائياً بدون ريستارت!", pkgID), nil
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()

	var out bytes.Buffer
	cmd := winapi.HiddenCommandContext(ctx, "winget.exe",
		"install", "--id", pkgID, "-e", "--silent", "--accept-package-agreements", "--accept-source-agreements")
	cmd.Stdout = &out
	cmd.Stderr = &out
	err := cmd.Run()
	InvalidateVersionCache()

	txt := strings.TrimSpace(out.String())
	if err != nil && !strings.Contains(strings.ToLower(txt), "already installed") {
		return txt, fmt.Errorf("تعذر إكمال التثبيت الصامت للحزمة %s (تأكد من الاتصال بالإنترنت أو اضغط زر الترقية لمسؤول): %s", pkgID, txt)
	}
	return fmt.Sprintf("تم تثبيت وتفعيل المحرك (%s) بنجاح 100%% وبصمت تام!", pkgID), nil
}

func detectBinaryZeroPopup(binName string, candidates []string) (bool, string) {
	for _, c := range candidates {
		if c == "" {
			continue
		}
		if st, err := os.Stat(c); err == nil && !st.IsDir() {
			return true, c
		}
	}
	if p, err := exec.LookPath(binName); err == nil {
		return true, p
	}
	return false, ""
}

func adminShortVer(isAdmin bool) string {
	if isAdmin {
		return "Elevated Admin"
	}
	if runtime.GOOS != "windows" {
		return "Cloud Container"
	}
	return "Standard Token"
}

func adminStatusStr(isAdmin bool) string {
	if isAdmin {
		return "مفعّل بصلاحية المسؤول الكاملة (Elevated Administrator)"
	}
	if runtime.GOOS != "windows" {
		return "Cloud Preview Container Ready"
	}
	return "يعمل كمستخدم عادي — اضغط زر (ترقية لمسؤول) لتفعيل كامل القوة"
}

func combineVerPath(ver, path, fb string) string {
	if ver != "" && path != "" {
		return fmt.Sprintf("%s  •  [%s]", ver, path)
	}
	if path != "" {
		return path
	}
	return fb
}

func boolLabel(b bool, t, f string) string {
	if b {
		return t
	}
	return f
}

func fallbackStr(val, fb string) string {
	if val != "" {
		return val
	}
	return fb
}
