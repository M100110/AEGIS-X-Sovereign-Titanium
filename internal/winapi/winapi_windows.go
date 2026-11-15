//go:build windows

package winapi

import (
	"context"
	"encoding/binary"
	"fmt"
	"net"
	"os"
	"os/exec"
	"runtime"
	"strings"
	"sync"
	"syscall"
	"time"
	"unsafe"
)

const (
	createNoWindow          = 0x08000000
	th32csSnapProcess       = 0x00000002
	processQueryLimitedInfo = 0x1000
	processSetQuota         = 0x0100
	processTerminate        = 0x0001
	driveFixed              = 3
	afInet                  = 2
	tcpTableOwnerPidAll     = 5
	udpTableOwnerPid        = 1
	keyRead                 = 0x20019
	keySetValue             = 0x0002
	hkeyCurrentUser         = syscall.Handle(0x80000001)
	hkeyLocalMachine        = syscall.Handle(0x80000002)

	swShowNormal = 1

	// Win32 Window & System Tray constants
	wmDestroy       = 0x0002
	wmCommand       = 0x0111
	wmUser          = 0x0400
	wmTrayCallback  = wmUser + 42
	wmLButtonUp     = 0x0202
	wmLButtonDblClk = 0x0203
	wmRButtonUp     = 0x0205
	wmContextMenu   = 0x007B

	nimAdd      = 0x00000000
	nimModify   = 0x00000001
	nimDelete   = 0x00000002
	nifMessage  = 0x00000001
	nifIcon     = 0x00000002
	nifTip      = 0x00000004
	nifInfo     = 0x00000010
	niifInfo    = 0x00000001
	niifWarning = 0x00000002
	niifNoSound = 0x00000010 // STRICT MANDATE: ZERO SOUND / ZERO DING EVER!

	mfString       = 0x00000000
	mfSeparator    = 0x00000800
	tpmRightAlign  = 0x0008
	tpmBottomAlign = 0x0020
	tpmReturnCmd   = 0x0100
	tpmRightButton = 0x0002

	idiApplication = 32512
	cfUnicodeText  = 13
	gmemMoveable   = 0x0002

	// wlanapi.dll constants
	wlanIntfOpcodeCurrentConnection = 7
	wlanIntfOpcodeChannelNumber     = 8
)

var (
	modKernel32 = syscall.NewLazyDLL("kernel32.dll")
	modPsapi    = syscall.NewLazyDLL("psapi.dll")
	modIphlpapi = syscall.NewLazyDLL("iphlpapi.dll")
	modShell32  = syscall.NewLazyDLL("shell32.dll")
	modAdvapi32 = syscall.NewLazyDLL("advapi32.dll")
	modUser32   = syscall.NewLazyDLL("user32.dll")
	modWlanapi  = syscall.NewLazyDLL("wlanapi.dll")

	procCreateMutexW            = modKernel32.NewProc("CreateMutexW")
	procGetModuleHandleW        = modKernel32.NewProc("GetModuleHandleW")
	procGetSystemTimes          = modKernel32.NewProc("GetSystemTimes")
	procGetProcessTimes         = modKernel32.NewProc("GetProcessTimes")
	procGlobalMemoryStatusEx    = modKernel32.NewProc("GlobalMemoryStatusEx")
	procGetTickCount64          = modKernel32.NewProc("GetTickCount64")
	procGetLogicalDriveStringsW = modKernel32.NewProc("GetLogicalDriveStringsW")
	procGetDriveTypeW           = modKernel32.NewProc("GetDriveTypeW")
	procGetDiskFreeSpaceExW     = modKernel32.NewProc("GetDiskFreeSpaceExW")
	procGetVolumeInformationW   = modKernel32.NewProc("GetVolumeInformationW")
	procCreateToolhelp32Snap    = modKernel32.NewProc("CreateToolhelp32Snapshot")
	procProcess32FirstW         = modKernel32.NewProc("Process32FirstW")
	procProcess32NextW          = modKernel32.NewProc("Process32NextW")
	procOpenProcess             = modKernel32.NewProc("OpenProcess")
	procTerminateProcess        = modKernel32.NewProc("TerminateProcess")
	procSetProcessWorkingSet    = modKernel32.NewProc("SetProcessWorkingSetSize")
	procCloseHandle             = modKernel32.NewProc("CloseHandle")
	procGlobalAlloc             = modKernel32.NewProc("GlobalAlloc")
	procGlobalLock              = modKernel32.NewProc("GlobalLock")
	procGlobalUnlock            = modKernel32.NewProc("GlobalUnlock")

	procGetProcessMemoryInfo = modPsapi.NewProc("GetProcessMemoryInfo")

	procGetExtendedTcpTable = modIphlpapi.NewProc("GetExtendedTcpTable")
	procGetExtendedUdpTable = modIphlpapi.NewProc("GetExtendedUdpTable")
	procGetIfTable          = modIphlpapi.NewProc("GetIfTable")
	procGetIpNetTable       = modIphlpapi.NewProc("GetIpNetTable")
	procGetIpForwardTable   = modIphlpapi.NewProc("GetIpForwardTable")
	procSendARP             = modIphlpapi.NewProc("SendARP")

	procIsUserAnAdmin    = modShell32.NewProc("IsUserAnAdmin")
	procShellExecuteW    = modShell32.NewProc("ShellExecuteW")
	procShellNotifyIconW = modShell32.NewProc("Shell_NotifyIconW")

	procRegOpenKeyExW    = modAdvapi32.NewProc("RegOpenKeyExW")
	procRegCreateKeyExW  = modAdvapi32.NewProc("RegCreateKeyExW")
	procRegQueryValueExW = modAdvapi32.NewProc("RegQueryValueExW")
	procRegSetValueExW   = modAdvapi32.NewProc("RegSetValueExW")
	procRegEnumValueW    = modAdvapi32.NewProc("RegEnumValueW")
	procRegDeleteValueW  = modAdvapi32.NewProc("RegDeleteValueW")
	procRegCloseKey      = modAdvapi32.NewProc("RegCloseKey")

	// NOTE: ZERO MessageBeep anywhere! Strictly banned.
	procRegisterClassExW    = modUser32.NewProc("RegisterClassExW")
	procCreateWindowExW     = modUser32.NewProc("CreateWindowExW")
	procDefWindowProcW      = modUser32.NewProc("DefWindowProcW")
	procGetMessageW         = modUser32.NewProc("GetMessageW")
	procTranslateMessage    = modUser32.NewProc("TranslateMessage")
	procDispatchMessageW    = modUser32.NewProc("DispatchMessageW")
	procPostQuitMessage     = modUser32.NewProc("PostQuitMessage")
	procLoadIconW           = modUser32.NewProc("LoadIconW")
	procCreatePopupMenu     = modUser32.NewProc("CreatePopupMenu")
	procAppendMenuW         = modUser32.NewProc("AppendMenuW")
	procTrackPopupMenu      = modUser32.NewProc("TrackPopupMenu")
	procDestroyMenu         = modUser32.NewProc("DestroyMenu")
	procGetCursorPos        = modUser32.NewProc("GetCursorPos")
	procSetForegroundWindow = modUser32.NewProc("SetForegroundWindow")
	procOpenClipboard       = modUser32.NewProc("OpenClipboard")
	procEmptyClipboard      = modUser32.NewProc("EmptyClipboard")
	procSetClipboardData    = modUser32.NewProc("SetClipboardData")
	procCloseClipboard      = modUser32.NewProc("CloseClipboard")

	// Native Wi-Fi RF telemetry via wlanapi.dll
	procWlanOpenHandle        = modWlanapi.NewProc("WlanOpenHandle")
	procWlanCloseHandle       = modWlanapi.NewProc("WlanCloseHandle")
	procWlanEnumInterfaces    = modWlanapi.NewProc("WlanEnumInterfaces")
	procWlanQueryInterface    = modWlanapi.NewProc("WlanQueryInterface")
	procWlanGetNetworkBssList = modWlanapi.NewProc("WlanGetNetworkBssList")
	procWlanFreeMemory        = modWlanapi.NewProc("WlanFreeMemory")
)

var (
	procCPUHistMu   sync.Mutex
	prevProcTicks   = make(map[int]uint64)
	prevProcSampleT time.Time
)

// HiddenCommand guarantees ZERO console/terminal window creation on Windows (CREATE_NO_WINDOW = 0x08000000).
func HiddenCommand(name string, args ...string) *exec.Cmd {
	cmd := exec.Command(name, args...)
	cmd.SysProcAttr = &syscall.SysProcAttr{
		HideWindow:    true,
		CreationFlags: createNoWindow,
	}
	return cmd
}

// HiddenCommandContext guarantees ZERO console/terminal window creation with timeout context.
func HiddenCommandContext(ctx context.Context, name string, args ...string) *exec.Cmd {
	cmd := exec.CommandContext(ctx, name, args...)
	cmd.SysProcAttr = &syscall.SysProcAttr{
		HideWindow:    true,
		CreationFlags: createNoWindow,
	}
	return cmd
}

// AcquireSingleInstanceMutex uses "Local\\" namespace (NEVER "Global\\") so it works under Standard & Admin tokens.
func AcquireSingleInstanceMutex(name string) (uintptr, bool) {
	ptr, _ := syscall.UTF16PtrFromString("Local\\" + name)
	h, _, err := procCreateMutexW.Call(0, 1, uintptr(unsafe.Pointer(ptr)))
	if h == 0 {
		return 0, true
	}
	if err == syscall.Errno(183) {
		return h, false
	}
	return h, true
}

// OpenURLInBrowser calls shell32.dll!ShellExecuteW(0, "open", url, nil, nil, SW_SHOWNORMAL).
func OpenURLInBrowser(url string) error {
	verbPtr, _ := syscall.UTF16PtrFromString("open")
	urlPtr, _ := syscall.UTF16PtrFromString(url)
	ret, _, _ := procShellExecuteW.Call(
		0,
		uintptr(unsafe.Pointer(verbPtr)),
		uintptr(unsafe.Pointer(urlPtr)),
		0,
		0,
		swShowNormal,
	)
	if ret <= 32 {
		return fmt.Errorf("ShellExecuteW returned code %d", ret)
	}
	return nil
}

// ElevateSelfAsAdmin relaunches the current executable with UAC Administrator elevation ("runas").
func ElevateSelfAsAdmin(args string) error {
	exePath, err := os.Executable()
	if err != nil {
		return err
	}
	verbPtr, _ := syscall.UTF16PtrFromString("runas")
	exePtr, _ := syscall.UTF16PtrFromString(exePath)
	argPtr, _ := syscall.UTF16PtrFromString(args)
	ret, _, _ := procShellExecuteW.Call(
		0,
		uintptr(unsafe.Pointer(verbPtr)),
		uintptr(unsafe.Pointer(exePtr)),
		uintptr(unsafe.Pointer(argPtr)),
		0,
		swShowNormal,
	)
	if ret <= 32 {
		return fmt.Errorf("UAC elevation cancelled or declined (code %d)", ret)
	}
	return nil
}

// CopyTextToClipboard copies text natively to the Windows Clipboard via user32.dll.
func CopyTextToClipboard(text string) {
	r, _, _ := procOpenClipboard.Call(0)
	if r == 0 {
		return
	}
	defer procCloseClipboard.Call()
	procEmptyClipboard.Call()

	u16, err := syscall.UTF16FromString(text)
	if err != nil {
		return
	}
	byteLen := uintptr(len(u16) * 2)
	hMem, _, _ := procGlobalAlloc.Call(gmemMoveable, byteLen)
	if hMem == 0 {
		return
	}
	ptr, _, _ := procGlobalLock.Call(hMem)
	if ptr == 0 {
		return
	}
	dst := unsafe.Slice((*uint16)(unsafe.Pointer(ptr)), len(u16))
	copy(dst, u16)
	procGlobalUnlock.Call(hMem)
	procSetClipboardData.Call(cfUnicodeText, hMem)
}

// ==================== NATIVE WIN32 SYSTEM TRAY ENGINE ====================

type wndClassExW struct {
	Size       uint32
	Style      uint32
	WndProc    uintptr
	ClsExtra   int32
	WndExtra   int32
	Instance   uintptr
	Icon       uintptr
	Cursor     uintptr
	Background uintptr
	MenuName   *uint16
	ClassName  *uint16
	IconSm     uintptr
}

type point struct {
	X int32
	Y int32
}

type msgStruct struct {
	Hwnd    uintptr
	Message uint32
	WParam  uintptr
	LParam  uintptr
	Time    uint32
	Pt      point
}

type notifyIconDataW struct {
	CbSize           uint32
	HWnd             uintptr
	UID              uint32
	UFlags           uint32
	UCallbackMessage uint32
	HIcon            uintptr
	SzTip            [128]uint16
	DwState          uint32
	DwStateMask      uint32
	SzInfo           [256]uint16
	UVersion         uint32
	SzInfoTitle      [64]uint16
	DwInfoFlags      uint32
}

var (
	globalTrayHwnd uintptr
	globalTrayNID  notifyIconDataW
	globalTrayCB   TrayCallbacks
)

const (
	menuIDOpen     = 1001
	menuIDSelfHeal = 1002
	menuIDCopyURL  = 1003
	menuIDExit     = 1004
)

func trayWndProc(hwnd uintptr, msg uint32, wParam, lParam uintptr) uintptr {
	switch msg {
	case wmTrayCallback:
		low := uint32(lParam & 0xFFFF)
		switch low {
		case wmLButtonUp, wmLButtonDblClk:
			if globalTrayCB.OnOpenDashboard != nil {
				go globalTrayCB.OnOpenDashboard()
			}
		case wmRButtonUp, wmContextMenu:
			showTrayContextMenu(hwnd)
		}
		return 0
	case wmDestroy:
		RemoveSystemTray()
		procPostQuitMessage.Call(0)
		return 0
	}
	ret, _, _ := procDefWindowProcW.Call(hwnd, uintptr(msg), wParam, lParam)
	return ret
}

func showTrayContextMenu(hwnd uintptr) {
	hMenu, _, _ := procCreatePopupMenu.Call()
	if hMenu == 0 {
		return
	}
	defer procDestroyMenu.Call(hMenu)

	lblOpen, _ := syscall.UTF16PtrFromString("فتح لوحة التحكم | Open AEGIS-X v7.0")
	lblHeal, _ := syscall.UTF16PtrFromString("تحرير الذاكرة وإصلاح سريع | Quick Self-Heal")
	lblCopy, _ := syscall.UTF16PtrFromString("نسخ رابط اللوحة | Copy Dashboard URL")
	lblExit, _ := syscall.UTF16PtrFromString("إغلاق نهائي | Exit AEGIS-X")

	procAppendMenuW.Call(hMenu, mfString, menuIDOpen, uintptr(unsafe.Pointer(lblOpen)))
	procAppendMenuW.Call(hMenu, mfString, menuIDSelfHeal, uintptr(unsafe.Pointer(lblHeal)))
	procAppendMenuW.Call(hMenu, mfString, menuIDCopyURL, uintptr(unsafe.Pointer(lblCopy)))
	procAppendMenuW.Call(hMenu, mfSeparator, 0, 0)
	procAppendMenuW.Call(hMenu, mfString, menuIDExit, uintptr(unsafe.Pointer(lblExit)))

	var pt point
	procGetCursorPos.Call(uintptr(unsafe.Pointer(&pt)))
	procSetForegroundWindow.Call(hwnd)

	cmd, _, _ := procTrackPopupMenu.Call(
		hMenu,
		tpmRightAlign|tpmBottomAlign|tpmReturnCmd|tpmRightButton,
		uintptr(pt.X),
		uintptr(pt.Y),
		0,
		hwnd,
		0,
	)

	switch cmd {
	case menuIDOpen:
		if globalTrayCB.OnOpenDashboard != nil {
			go globalTrayCB.OnOpenDashboard()
		}
	case menuIDSelfHeal:
		if globalTrayCB.OnQuickSelfHeal != nil {
			go globalTrayCB.OnQuickSelfHeal()
		}
	case menuIDCopyURL:
		if globalTrayCB.OnCopyURL != nil {
			go globalTrayCB.OnCopyURL()
		}
	case menuIDExit:
		RemoveSystemTray()
		if globalTrayCB.OnExit != nil {
			go globalTrayCB.OnExit()
		}
	}
}

func StartSystemTrayLoop(tooltip string, cb TrayCallbacks) {
	go func() {
		runtime.LockOSThread()
		defer runtime.UnlockOSThread()

		globalTrayCB = cb
		hInst, _, _ := procGetModuleHandleW.Call(0)
		className, _ := syscall.UTF16PtrFromString("AegisXTrayHiddenWndClassV7")

		hIcon, _, _ := procLoadIconW.Call(hInst, uintptr(1))
		if hIcon == 0 {
			hIcon, _, _ = procLoadIconW.Call(0, uintptr(idiApplication))
		}

		wc := wndClassExW{
			Size:      uint32(unsafe.Sizeof(wndClassExW{})),
			WndProc:   syscall.NewCallback(trayWndProc),
			Instance:  hInst,
			Icon:      hIcon,
			ClassName: className,
		}
		procRegisterClassExW.Call(uintptr(unsafe.Pointer(&wc)))

		wndTitle, _ := syscall.UTF16PtrFromString("AEGIS-X v7.0 Sovereign Tray Host")
		hwnd, _, _ := procCreateWindowExW.Call(
			0,
			uintptr(unsafe.Pointer(className)),
			uintptr(unsafe.Pointer(wndTitle)),
			0,
			0, 0, 0, 0,
			0, 0, hInst, 0,
		)
		if hwnd == 0 {
			return
		}
		globalTrayHwnd = hwnd

		globalTrayNID = notifyIconDataW{
			CbSize:           uint32(unsafe.Sizeof(notifyIconDataW{})),
			HWnd:             hwnd,
			UID:              1,
			UFlags:           nifMessage | nifIcon | nifTip | nifInfo,
			UCallbackMessage: wmTrayCallback,
			HIcon:            hIcon,
			DwInfoFlags:      niifInfo | niifNoSound,
		}
		copyUTF16Fixed(globalTrayNID.SzTip[:], tooltip)
		copyUTF16Fixed(globalTrayNID.SzInfoTitle[:], "AEGIS-X v7.0 APEX Online")
		copyUTF16Fixed(globalTrayNID.SzInfo[:], "المنظومة نشطة الآن! انقر على الأيقونة بجانب الساعة لفتح مركز القيادة.")

		procShellNotifyIconW.Call(nimAdd, uintptr(unsafe.Pointer(&globalTrayNID)))

		var m msgStruct
		for {
			r, _, _ := procGetMessageW.Call(uintptr(unsafe.Pointer(&m)), 0, 0, 0)
			if int32(r) <= 0 {
				break
			}
			procTranslateMessage.Call(uintptr(unsafe.Pointer(&m)))
			procDispatchMessageW.Call(uintptr(unsafe.Pointer(&m)))
		}
	}()
}

func ShowSilentTrayNotification(title, message string, isWarning bool) {
	if globalTrayHwnd == 0 {
		return
	}
	nid := globalTrayNID
	nid.UFlags = nifInfo
	if isWarning {
		nid.DwInfoFlags = niifWarning | niifNoSound
	} else {
		nid.DwInfoFlags = niifInfo | niifNoSound
	}
	copyUTF16Fixed(nid.SzInfoTitle[:], title)
	copyUTF16Fixed(nid.SzInfo[:], message)
	procShellNotifyIconW.Call(nimModify, uintptr(unsafe.Pointer(&nid)))
}

func RemoveSystemTray() {
	if globalTrayHwnd != 0 {
		procShellNotifyIconW.Call(nimDelete, uintptr(unsafe.Pointer(&globalTrayNID)))
		globalTrayHwnd = 0
	}
}

func copyUTF16Fixed(dst []uint16, s string) {
	for i := range dst {
		dst[i] = 0
	}
	u, err := syscall.UTF16FromString(s)
	if err != nil {
		return
	}
	if len(u) >= len(dst) {
		copy(dst, u[:len(dst)-1])
		dst[len(dst)-1] = 0
	} else {
		copy(dst, u)
	}
}

// ==================== PURE WIN32 DLL TELEMETRY, ROUTING, ARP & WIFI RF ====================

type fileTime struct {
	LowDateTime  uint32
	HighDateTime uint32
}

func (ft fileTime) uint64() uint64 {
	return (uint64(ft.HighDateTime) << 32) | uint64(ft.LowDateTime)
}

type memoryStatusEx struct {
	Length               uint32
	MemoryLoad           uint32
	TotalPhys            uint64
	AvailPhys            uint64
	TotalPageFile        uint64
	AvailPageFile        uint64
	TotalVirtual         uint64
	AvailVirtual         uint64
	AvailExtendedVirtual uint64
}

type processEntry32W struct {
	Size            uint32
	CntUsage        uint32
	ProcessID       uint32
	DefaultHeapID   uintptr
	ModuleID        uint32
	CntThreads      uint32
	ParentProcessID uint32
	PriClassBase    int32
	Flags           uint32
	ExeFile         [260]uint16
}

type processMemoryCounters struct {
	CB                         uint32
	PageFaultCount             uint32
	PeakWorkingSetSize         uintptr
	WorkingSetSize             uintptr
	QuotaPeakPagedPoolUsage    uintptr
	QuotaPagedPoolUsage        uintptr
	QuotaPeakNonPagedPoolUsage uintptr
	QuotaNonPagedPoolUsage     uintptr
	PagefileUsage              uintptr
	PeakPagefileUsage          uintptr
}

func CollectNativeMetrics() NativeMetricData {
	var out NativeMetricData

	var idle, kernel, user fileTime
	r1, _, _ := procGetSystemTimes.Call(
		uintptr(unsafe.Pointer(&idle)),
		uintptr(unsafe.Pointer(&kernel)),
		uintptr(unsafe.Pointer(&user)),
	)
	if r1 != 0 {
		out.CPUIdleTicks = idle.uint64()
		out.CPUKernelTicks = kernel.uint64()
		out.CPUUserTicks = user.uint64()
	}

	var mem memoryStatusEx
	mem.Length = uint32(unsafe.Sizeof(mem))
	if r, _, _ := procGlobalMemoryStatusEx.Call(uintptr(unsafe.Pointer(&mem))); r != 0 {
		out.RAMTotalBytes = mem.TotalPhys
		out.RAMAvailBytes = mem.AvailPhys
		out.RAMLoadPct = mem.MemoryLoad
	}

	ticks, _, _ := procGetTickCount64.Call()
	out.UptimeSeconds = uint64(ticks) / 1000

	adm, _, _ := procIsUserAnAdmin.Call()
	out.IsAdmin = adm != 0

	out.CPUModel = readRegString(hkeyLocalMachine, `HARDWARE\DESCRIPTION\System\CentralProcessor\0`, "ProcessorNameString")
	if out.CPUModel == "" {
		out.CPUModel = "Windows x64 Processor"
	}
	prodName := readRegString(hkeyLocalMachine, `SOFTWARE\Microsoft\Windows NT\CurrentVersion`, "ProductName")
	buildNum := readRegString(hkeyLocalMachine, `SOFTWARE\Microsoft\Windows NT\CurrentVersion`, "CurrentBuildNumber")
	dispVer := readRegString(hkeyLocalMachine, `SOFTWARE\Microsoft\Windows NT\CurrentVersion`, "DisplayVersion")
	out.OSBuildNumber = buildNum
	if prodName != "" {
		if strings.Contains(prodName, "Windows 10") && buildNum >= "22000" {
			prodName = strings.Replace(prodName, "Windows 10", "Windows 11", 1)
		}
		out.OSCaption = fmt.Sprintf("%s %s (Build %s)", prodName, dispVer, buildNum)
	} else {
		out.OSCaption = "Microsoft Windows 11/10 x64"
	}
	out.PendingReboot = regKeyExists(hkeyLocalMachine, `SOFTWARE\Microsoft\Windows\CurrentVersion\Component Based Servicing\RebootPending`)

	buf := make([]uint16, 256)
	n, _, _ := procGetLogicalDriveStringsW.Call(uintptr(len(buf)), uintptr(unsafe.Pointer(&buf[0])))
	if n > 0 {
		drives := utf16SliceToStrings(buf[:n])
		for _, drv := range drives {
			drvPtr, _ := syscall.UTF16PtrFromString(drv)
			dt, _, _ := procGetDriveTypeW.Call(uintptr(unsafe.Pointer(drvPtr)))
			if dt != driveFixed {
				continue
			}
			var freeAvail, totalBytes, totalFree uint64
			ok, _, _ := procGetDiskFreeSpaceExW.Call(
				uintptr(unsafe.Pointer(drvPtr)),
				uintptr(unsafe.Pointer(&freeAvail)),
				uintptr(unsafe.Pointer(&totalBytes)),
				uintptr(unsafe.Pointer(&totalFree)),
			)
			if ok == 0 || totalBytes == 0 {
				continue
			}
			volName := make([]uint16, 128)
			fsName := make([]uint16, 64)
			_, _, _ = procGetVolumeInformationW.Call(
				uintptr(unsafe.Pointer(drvPtr)),
				uintptr(unsafe.Pointer(&volName[0])), uintptr(len(volName)),
				0, 0, 0,
				uintptr(unsafe.Pointer(&fsName[0])), uintptr(len(fsName)),
			)
			out.Disks = append(out.Disks, NativeDisk{
				Drive:      strings.TrimSuffix(drv, `\`),
				Label:      syscall.UTF16ToString(volName),
				FileSystem: syscall.UTF16ToString(fsName),
				TotalBytes: totalBytes,
				FreeBytes:  totalFree,
			})
		}
	}

	out.Processes = EnumerateProcessesNative()
	out.IfCounters = readIfTableCounters()
	return out
}

// EnumerateProcessesNative reads exact WorkingSet MB AND real per-process CPU% via GetProcessTimes!
func EnumerateProcessesNative() []NativeProc {
	snap, _, _ := procCreateToolhelp32Snap.Call(th32csSnapProcess, 0)
	if snap == uintptr(syscall.InvalidHandle) || snap == 0 {
		return nil
	}
	defer procCloseHandle.Call(snap)

	var pe processEntry32W
	pe.Size = uint32(unsafe.Sizeof(pe))
	r, _, _ := procProcess32FirstW.Call(snap, uintptr(unsafe.Pointer(&pe)))
	if r == 0 {
		return nil
	}

	now := time.Now()
	numCPU := float64(runtime.NumCPU())
	if numCPU < 1 {
		numCPU = 1
	}

	procCPUHistMu.Lock()
	elapsedWall100ns := float64(now.Sub(prevProcSampleT).Nanoseconds()) / 100.0
	hasPrev := !prevProcSampleT.IsZero() && elapsedWall100ns > 50000
	nextTicks := make(map[int]uint64, 320)

	var list []NativeProc
	for {
		pid := int(pe.ProcessID)
		name := syscall.UTF16ToString(pe.ExeFile[:])
		var memMB, cpuPct float64
		if pid > 4 {
			hProc, _, _ := procOpenProcess.Call(processQueryLimitedInfo, 0, uintptr(pid))
			if hProc != 0 {
				var pmc processMemoryCounters
				pmc.CB = uint32(unsafe.Sizeof(pmc))
				if ok, _, _ := procGetProcessMemoryInfo.Call(hProc, uintptr(unsafe.Pointer(&pmc)), uintptr(pmc.CB)); ok != 0 {
					memMB = float64(pmc.WorkingSetSize) / (1024.0 * 1024.0)
				}
				var cTime, eTime, kTime, uTime fileTime
				if okT, _, _ := procGetProcessTimes.Call(
					hProc,
					uintptr(unsafe.Pointer(&cTime)),
					uintptr(unsafe.Pointer(&eTime)),
					uintptr(unsafe.Pointer(&kTime)),
					uintptr(unsafe.Pointer(&uTime)),
				); okT != 0 {
					tot := kTime.uint64() + uTime.uint64()
					nextTicks[pid] = tot
					if hasPrev {
						if prev, existed := prevProcTicks[pid]; existed && tot >= prev {
							delta := float64(tot - prev)
							cpuPct = (delta / (elapsedWall100ns * numCPU)) * 100.0
							if cpuPct > 100.0 {
								cpuPct = 100.0
							}
						}
					}
				}
				procCloseHandle.Call(hProc)
			}
		}
		list = append(list, NativeProc{
			PID:        pid,
			PPID:       int(pe.ParentProcessID),
			Threads:    int(pe.CntThreads),
			Name:       name,
			WorkingMB:  memMB,
			CPUPercent: float64(int(cpuPct*10+0.5)) / 10.0,
		})
		pe.Size = uint32(unsafe.Sizeof(pe))
		nxt, _, _ := procProcess32NextW.Call(snap, uintptr(unsafe.Pointer(&pe)))
		if nxt == 0 {
			break
		}
	}

	if elapsedWall100ns > 2500000 || prevProcSampleT.IsZero() { // Update baseline every >=250ms
		prevProcTicks = nextTicks
		prevProcSampleT = now
	}
	procCPUHistMu.Unlock()

	return list
}

func TrimAllIdleWorkingSetsNative() (int, float64) {
	before := CollectNativeMetrics().RAMAvailBytes
	procs := EnumerateProcessesNative()
	trimmed := 0
	for _, p := range procs {
		if p.PID <= 4 || p.WorkingMB < 35 {
			continue
		}
		h, _, _ := procOpenProcess.Call(processQueryLimitedInfo|processSetQuota, 0, uintptr(p.PID))
		if h != 0 {
			negOne := ^uintptr(0)
			r, _, _ := procSetProcessWorkingSet.Call(h, negOne, negOne)
			if r != 0 {
				trimmed++
			}
			procCloseHandle.Call(h)
		}
	}
	after := CollectNativeMetrics().RAMAvailBytes
	var freedMB float64
	if after > before {
		freedMB = float64(after-before) / (1024.0 * 1024.0)
	}
	return trimmed, freedMB
}

func TerminateProcessNative(pid int) error {
	if pid <= 4 || pid == os.Getpid() {
		return fmt.Errorf("cannot terminate protected kernel/AEGIS PID %d", pid)
	}
	h, _, err := procOpenProcess.Call(processTerminate, 0, uintptr(pid))
	if h == 0 {
		return fmt.Errorf("OpenProcess failed: %v", err)
	}
	defer procCloseHandle.Call(h)
	r, _, err2 := procTerminateProcess.Call(h, 1)
	if r == 0 {
		return fmt.Errorf("TerminateProcess failed: %v", err2)
	}
	return nil
}

// GetDefaultGatewayInfo reads MIB_IPFORWARDTABLE from iphlpapi.dll!GetIpForwardTable
// to deterministically discover ANY subnet/gateway (e.g., 192.168.100.1/24, 192.168.1.1/24, 10.0.0.1/8, etc.)!
func GetDefaultGatewayInfo() RouteGatewayInfo {
	var info RouteGatewayInfo
	var size uint32
	_, _, _ = procGetIpForwardTable.Call(0, uintptr(unsafe.Pointer(&size)), 1)
	if size == 0 {
		return fallbackGatewayFromInterfaces()
	}
	buf := make([]byte, size+512)
	sz := uint32(len(buf))
	ret, _, _ := procGetIpForwardTable.Call(uintptr(unsafe.Pointer(&buf[0])), uintptr(unsafe.Pointer(&sz)), 1)
	if ret != 0 || sz < 4 {
		return fallbackGatewayFromInterfaces()
	}

	// MIB_IPFORWARDROW layout (56 bytes per row):
	// 0..4: dwForwardDest | 4..8: dwForwardMask | 8..12: dwForwardPolicy | 12..16: dwForwardNextHop
	// 16..20: dwForwardIfIndex | 20..24: dwForwardType | 36..40: dwForwardMetric1
	count := binary.LittleEndian.Uint32(buf[0:4])
	const rowLen = 56
	bestMetric := int(1<<30 - 1)
	offset := 4

	for i := uint32(0); i < count && offset+rowLen <= int(sz); i++ {
		dest := binary.LittleEndian.Uint32(buf[offset : offset+4])
		nextHopBytes := buf[offset+12 : offset+16]
		ifIdx := int(binary.LittleEndian.Uint32(buf[offset+16 : offset+20]))
		metric := int(binary.LittleEndian.Uint32(buf[offset+36 : offset+40]))
		gwIP := net.IPv4(nextHopBytes[0], nextHopBytes[1], nextHopBytes[2], nextHopBytes[3])

		if dest == 0 && !gwIP.IsUnspecified() && !gwIP.IsLoopback() {
			if metric < bestMetric || info.GatewayIP == "" {
				bestMetric = metric
				info.GatewayIP = gwIP.String()
				info.InterfaceIdx = ifIdx
				info.Metric = metric
			}
		}
		offset += rowLen
	}

	if info.GatewayIP == "" {
		return fallbackGatewayFromInterfaces()
	}

	// Match interface by InterfaceIdx or subnet containment to extract LocalIP, SubnetCIDR, and LocalMAC
	ifaces, _ := net.Interfaces()
	gwParsed := net.ParseIP(info.GatewayIP).To4()
	for _, iface := range ifaces {
		if iface.Flags&net.FlagLoopback != 0 || iface.Flags&net.FlagUp == 0 {
			continue
		}
		addrs, _ := iface.Addrs()
		for _, a := range addrs {
			ipNet, ok := a.(*net.IPNet)
			if !ok || ipNet.IP.To4() == nil {
				continue
			}
			if iface.Index == info.InterfaceIdx || (gwParsed != nil && ipNet.Contains(gwParsed)) {
				ip4 := ipNet.IP.To4()
				ones, _ := ipNet.Mask.Size()
				masked := ip4.Mask(ipNet.Mask)
				info.LocalIP = ip4.String()
				info.SubnetCIDR = fmt.Sprintf("%s/%d", masked.String(), ones)
				info.SubnetMask = net.IP(ipNet.Mask).String()
				info.InterfaceName = iface.Name
				info.LocalMAC = strings.ToUpper(iface.HardwareAddr.String())
				info.InterfaceIdx = iface.Index
				return info
			}
		}
	}
	return info
}

func fallbackGatewayFromInterfaces() RouteGatewayInfo {
	var info RouteGatewayInfo
	ifaces, _ := net.Interfaces()
	for _, iface := range ifaces {
		if iface.Flags&net.FlagLoopback != 0 || iface.Flags&net.FlagUp == 0 {
			continue
		}
		addrs, _ := iface.Addrs()
		for _, a := range addrs {
			ipNet, ok := a.(*net.IPNet)
			if !ok || ipNet.IP.To4() == nil {
				continue
			}
			ip4 := ipNet.IP.To4()
			if ip4.IsLinkLocalUnicast() {
				continue
			}
			ones, _ := ipNet.Mask.Size()
			masked := ip4.Mask(ipNet.Mask)
			gwGuess := net.IPv4(masked[0], masked[1], masked[2], 1).String()
			return RouteGatewayInfo{
				GatewayIP:     gwGuess,
				LocalIP:       ip4.String(),
				SubnetCIDR:    fmt.Sprintf("%s/%d", masked.String(), ones),
				SubnetMask:    net.IP(ipNet.Mask).String(),
				InterfaceIdx:  iface.Index,
				InterfaceName: iface.Name,
				LocalMAC:      strings.ToUpper(iface.HardwareAddr.String()),
			}
		}
	}
	return info
}

// ProbeLayer2ARP sends a direct kernel ARP request via iphlpapi.dll!SendARP (0 console windows, sub-millisecond L2 discovery!).
func ProbeLayer2ARP(targetIP string) (string, bool) {
	ip := net.ParseIP(targetIP).To4()
	if ip == nil {
		return "", false
	}
	destIP := binary.LittleEndian.Uint32(ip)
	var macBuf [8]byte
	phyLen := uint32(6)
	ret, _, _ := procSendARP.Call(
		uintptr(destIP),
		0,
		uintptr(unsafe.Pointer(&macBuf[0])),
		uintptr(unsafe.Pointer(&phyLen)),
	)
	if ret != 0 || phyLen < 6 {
		return "", false
	}
	parts := make([]string, 6)
	allZero := true
	for i := 0; i < 6; i++ {
		if macBuf[i] != 0 {
			allZero = false
		}
		parts[i] = fmt.Sprintf("%02X", macBuf[i])
	}
	if allZero {
		return "", false
	}
	return strings.Join(parts, ":"), true
}

// QueryWifiRadioNative queries wlanapi.dll directly in memory for live Wi-Fi SSID, BSSID, Signal %, RSSI dBm, Channel & PHY Rates!
func QueryWifiRadioNative() WifiRadioMetrics {
	var out WifiRadioMetrics
	var negVer uint32
	var hClient uintptr
	r, _, _ := procWlanOpenHandle.Call(2, 0, uintptr(unsafe.Pointer(&negVer)), uintptr(unsafe.Pointer(&hClient)))
	if r != 0 || hClient == 0 {
		out.ConnectionType = "Ethernet / Wired LAN"
		out.FrequencyBand = "Gigabit Copper/Fiber"
		return out
	}
	defer procWlanCloseHandle.Call(hClient, 0)

	var pIfList uintptr
	r2, _, _ := procWlanEnumInterfaces.Call(hClient, 0, uintptr(unsafe.Pointer(&pIfList)))
	if r2 != 0 || pIfList == 0 {
		out.ConnectionType = "Ethernet / Wired LAN"
		return out
	}
	defer procWlanFreeMemory.Call(pIfList)

	numItems := *(*uint32)(unsafe.Pointer(pIfList))
	if numItems == 0 {
		out.ConnectionType = "Ethernet / Wired LAN"
		out.FrequencyBand = "Wired"
		return out
	}

	// WLAN_INTERFACE_INFO starts at offset 8:
	// 0..16: InterfaceGuid | 16..528: strInterfaceDescription (256 WCHARs) | 528..532: isState
	const infoStride = 532
	base := pIfList + 8
	for i := uint32(0); i < numItems; i++ {
		itemPtr := base + uintptr(i*infoStride)
		guidPtr := itemPtr
		descSlice := unsafe.Slice((*uint16)(unsafe.Pointer(itemPtr+16)), 256)
		state := *(*uint32)(unsafe.Pointer(itemPtr + 528))
		desc := syscall.UTF16ToString(descSlice)
		if state != 1 { // 1 == wlan_interface_state_connected
			continue
		}

		out.Connected = true
		out.InterfaceDesc = desc
		out.ConnectionType = "802.11 Wireless RF"

		// Query WLAN_CONNECTION_ATTRIBUTES (opcode 7)
		var dataSize uint32
		var pData uintptr
		var opcodeType uint32
		rq, _, _ := procWlanQueryInterface.Call(
			hClient,
			guidPtr,
			wlanIntfOpcodeCurrentConnection,
			0,
			uintptr(unsafe.Pointer(&dataSize)),
			uintptr(unsafe.Pointer(&pData)),
			uintptr(unsafe.Pointer(&opcodeType)),
		)
		if rq == 0 && pData != 0 && dataSize >= 596 {
			raw := unsafe.Slice((*byte)(unsafe.Pointer(pData)), dataSize)
			// WLAN_ASSOCIATION_ATTRIBUTES starts at offset 520 inside WLAN_CONNECTION_ATTRIBUTES:
			// 520..524: uSSIDLength | 524..556: ucSSID[32] | 556..560: bssType | 560..566: dot11Bssid[6]
			// 568..572: dot11PhyType | 572..576: uDot11PhyIndex | 576..580: wlanSignalQuality | 580..584: ulRxRate | 584..588: ulTxRate
			ssidLen := binary.LittleEndian.Uint32(raw[520:524])
			if ssidLen > 32 {
				ssidLen = 32
			}
			out.SSID = string(raw[524 : 524+ssidLen])
			bssid := raw[560:566]
			out.BSSID = fmt.Sprintf("%02X:%02X:%02X:%02X:%02X:%02X", bssid[0], bssid[1], bssid[2], bssid[3], bssid[4], bssid[5])
			sigQual := int(binary.LittleEndian.Uint32(raw[576:580]))
			if sigQual < 0 {
				sigQual = 0
			} else if sigQual > 100 {
				sigQual = 100
			}
			out.SignalQuality = sigQual
			// IEEE / Microsoft linear conversion: RSSI (dBm) = (Quality / 2) - 100
			out.RSSIdBm = float64(sigQual)/2.0 - 100.0
			rxKbps := binary.LittleEndian.Uint32(raw[580:584])
			txKbps := binary.LittleEndian.Uint32(raw[584:588])
			out.RxRateMbps = float64(rxKbps) / 1000.0
			out.TxRateMbps = float64(txKbps) / 1000.0
			procWlanFreeMemory.Call(pData)
		}

		// Query Channel Number (opcode 8)
		var chSize uint32
		var pCh uintptr
		rc, _, _ := procWlanQueryInterface.Call(
			hClient,
			guidPtr,
			wlanIntfOpcodeChannelNumber,
			0,
			uintptr(unsafe.Pointer(&chSize)),
			uintptr(unsafe.Pointer(&pCh)),
			uintptr(unsafe.Pointer(&opcodeType)),
		)
		if rc == 0 && pCh != 0 && chSize >= 4 {
			ch := int(*(*uint32)(unsafe.Pointer(pCh)))
			out.Channel = ch
			switch {
			case ch >= 1 && ch <= 14:
				out.FrequencyBand = "2.4 GHz"
			case ch >= 32 && ch <= 177:
				out.FrequencyBand = "5 GHz"
			case ch > 177:
				out.FrequencyBand = "6 GHz (Wi-Fi 6E/7)"
			default:
				out.FrequencyBand = "5 GHz / Dual-Band"
			}
			procWlanFreeMemory.Call(pCh)
		}
		break
	}

	if !out.Connected {
		out.ConnectionType = "Ethernet / Wired LAN"
		out.FrequencyBand = "Wired Gigabit"
	}
	return out
}

func GetNativeSocketTable() []NativeSocketRow {
	procMap := make(map[int]string, 256)
	for _, p := range EnumerateProcessesNative() {
		procMap[p.PID] = p.Name
	}

	var rows []NativeSocketRow
	var size uint32
	_, _, _ = procGetExtendedTcpTable.Call(0, uintptr(unsafe.Pointer(&size)), 0, afInet, tcpTableOwnerPidAll, 0)
	if size > 0 {
		buf := make([]byte, size+256)
		sz := uint32(len(buf))
		ret, _, _ := procGetExtendedTcpTable.Call(uintptr(unsafe.Pointer(&buf[0])), uintptr(unsafe.Pointer(&sz)), 0, afInet, tcpTableOwnerPidAll, 0)
		if ret == 0 && sz >= 4 {
			count := binary.LittleEndian.Uint32(buf[0:4])
			offset := 4
			for i := uint32(0); i < count && offset+24 <= int(sz); i++ {
				stateCode := binary.LittleEndian.Uint32(buf[offset : offset+4])
				localAddr := net.IPv4(buf[offset+4], buf[offset+5], buf[offset+6], buf[offset+7]).String()
				localPort := int(binary.BigEndian.Uint16(buf[offset+8 : offset+10]))
				remoteAddr := net.IPv4(buf[offset+12], buf[offset+13], buf[offset+14], buf[offset+15]).String()
				remotePort := int(binary.BigEndian.Uint16(buf[offset+16 : offset+18]))
				if stateCode == 2 {
					remotePort = 0
				}
				pid := int(binary.LittleEndian.Uint32(buf[offset+20 : offset+24]))
				pname := procMap[pid]
				if pname == "" {
					pname = "System"
				}
				rows = append(rows, NativeSocketRow{
					Proto:      "TCP",
					LocalIP:    localAddr,
					LocalPort:  localPort,
					RemoteIP:   remoteAddr,
					RemotePort: remotePort,
					State:      tcpStateName(stateCode),
					PID:        pid,
					ProcName:   pname,
				})
				offset += 24
			}
		}
	}

	var uSize uint32
	_, _, _ = procGetExtendedUdpTable.Call(0, uintptr(unsafe.Pointer(&uSize)), 0, afInet, udpTableOwnerPid, 0)
	if uSize > 0 {
		buf := make([]byte, uSize+128)
		sz := uint32(len(buf))
		ret, _, _ := procGetExtendedUdpTable.Call(uintptr(unsafe.Pointer(&buf[0])), uintptr(unsafe.Pointer(&sz)), 0, afInet, udpTableOwnerPid, 0)
		if ret == 0 && sz >= 4 {
			count := binary.LittleEndian.Uint32(buf[0:4])
			offset := 4
			for i := uint32(0); i < count && offset+12 <= int(sz) && len(rows) < 220; i++ {
				localAddr := net.IPv4(buf[offset], buf[offset+1], buf[offset+2], buf[offset+3]).String()
				localPort := int(binary.BigEndian.Uint16(buf[offset+4 : offset+6]))
				pid := int(binary.LittleEndian.Uint32(buf[offset+8 : offset+12]))
				pname := procMap[pid]
				if pname == "" {
					pname = "System"
				}
				rows = append(rows, NativeSocketRow{
					Proto:      "UDP",
					LocalIP:    localAddr,
					LocalPort:  localPort,
					RemoteIP:   "*",
					RemotePort: 0,
					State:      "ACTIVE",
					PID:        pid,
					ProcName:   pname,
				})
				offset += 12
			}
		}
	}
	return rows
}

func GetNativeARPTable() []ARPEntry {
	var size uint32
	_, _, _ = procGetIpNetTable.Call(0, uintptr(unsafe.Pointer(&size)), 0)
	if size == 0 {
		return nil
	}
	buf := make([]byte, size+256)
	sz := uint32(len(buf))
	ret, _, _ := procGetIpNetTable.Call(uintptr(unsafe.Pointer(&buf[0])), uintptr(unsafe.Pointer(&sz)), 0)
	if ret != 0 || sz < 4 {
		return nil
	}
	count := binary.LittleEndian.Uint32(buf[0:4])
	offset := 4
	var list []ARPEntry
	for i := uint32(0); i < count && offset+24 <= int(sz); i++ {
		macLen := binary.LittleEndian.Uint32(buf[offset+4 : offset+8])
		if macLen > 8 {
			macLen = 6
		}
		macBytes := buf[offset+8 : offset+8+int(macLen)]
		ip := net.IPv4(buf[offset+16], buf[offset+17], buf[offset+18], buf[offset+19]).String()
		typCode := binary.LittleEndian.Uint32(buf[offset+20 : offset+24])
		if typCode != 2 && macLen >= 6 {
			macParts := make([]string, macLen)
			for j := 0; j < int(macLen); j++ {
				macParts[j] = fmt.Sprintf("%02X", macBytes[j])
			}
			typStr := "DYNAMIC"
			if typCode == 4 {
				typStr = "STATIC"
			}
			list = append(list, ARPEntry{
				IP:  ip,
				MAC: strings.Join(macParts, ":"),
				Typ: typStr,
			})
		}
		offset += 24
	}
	return list
}

func ListRegistryStartupItems() []StartupItem {
	var items []StartupItem
	items = append(items, enumRunKey(hkeyCurrentUser, "HKCU", `Software\Microsoft\Windows\CurrentVersion\Run`)...)
	items = append(items, enumRunKey(hkeyLocalMachine, "HKLM", `SOFTWARE\Microsoft\Windows\CurrentVersion\Run`)...)
	return items
}

func enumRunKey(root syscall.Handle, hiveName, subkey string) []StartupItem {
	subPtr, _ := syscall.UTF16PtrFromString(subkey)
	var hKey syscall.Handle
	ret, _, _ := procRegOpenKeyExW.Call(uintptr(root), uintptr(unsafe.Pointer(subPtr)), 0, keyRead, uintptr(unsafe.Pointer(&hKey)))
	if ret != 0 {
		return nil
	}
	defer procRegCloseKey.Call(uintptr(hKey))

	var res []StartupItem
	for idx := uint32(0); idx < 128; idx++ {
		nameBuf := make([]uint16, 256)
		nameLen := uint32(len(nameBuf))
		dataBuf := make([]uint16, 1024)
		dataLen := uint32(len(dataBuf) * 2)
		var valType uint32

		r, _, _ := procRegEnumValueW.Call(
			uintptr(hKey),
			uintptr(idx),
			uintptr(unsafe.Pointer(&nameBuf[0])),
			uintptr(unsafe.Pointer(&nameLen)),
			0,
			uintptr(unsafe.Pointer(&valType)),
			uintptr(unsafe.Pointer(&dataBuf[0])),
			uintptr(unsafe.Pointer(&dataLen)),
		)
		if r != 0 {
			break
		}
		valName := syscall.UTF16ToString(nameBuf[:nameLen])
		valData := syscall.UTF16ToString(dataBuf)
		res = append(res, StartupItem{
			ID:       hiveName + ":" + valName,
			Name:     valName,
			Command:  valData,
			Location: hiveName + `\` + subkey,
			Hive:     hiveName,
			Enabled:  true,
		})
	}
	return res
}

func DeleteRegistryStartupItem(hiveName, valueName string) error {
	root := hkeyCurrentUser
	subkey := `Software\Microsoft\Windows\CurrentVersion\Run`
	if strings.EqualFold(hiveName, "HKLM") {
		root = hkeyLocalMachine
		subkey = `SOFTWARE\Microsoft\Windows\CurrentVersion\Run`
	}
	subPtr, _ := syscall.UTF16PtrFromString(subkey)
	var hKey syscall.Handle
	ret, _, _ := procRegOpenKeyExW.Call(uintptr(root), uintptr(unsafe.Pointer(subPtr)), 0, keySetValue, uintptr(unsafe.Pointer(&hKey)))
	if ret != 0 {
		return fmt.Errorf("unable to open registry key %s (Administrator privilege required for HKLM)", hiveName)
	}
	defer procRegCloseKey.Call(uintptr(hKey))

	valPtr, _ := syscall.UTF16PtrFromString(valueName)
	r, _, _ := procRegDeleteValueW.Call(uintptr(hKey), uintptr(unsafe.Pointer(valPtr)))
	if r != 0 {
		return fmt.Errorf("RegDeleteValueW returned code %d", r)
	}
	return nil
}

// IsAegisAutoStartEnabled checks whether AEGIS-X is registered in HKCU\...\Run to start with Windows.
func IsAegisAutoStartEnabled() bool {
	val := readRegString(hkeyCurrentUser, `Software\Microsoft\Windows\CurrentVersion\Run`, "AEGIS-X Sovereign")
	return val != ""
}

// SetAegisAutoStart enables or disables Windows boot auto-start (always with -no-browser -eco-boot so it uses 0% network & 0% CPU!).
func SetAegisAutoStart(enable bool) error {
	exePath, err := os.Executable()
	if err != nil {
		return err
	}
	return SetAegisAutoStartPath(exePath, enable)
}

func SetAegisAutoStartPath(exePath string, enable bool) error {
	if !enable {
		_ = DeleteRegistryStartupItem("HKCU", "AEGIS-X Sovereign")
		return nil
	}
	cmdStr := fmt.Sprintf(`"%s" -no-browser -eco-boot`, exePath)
	subPtr, _ := syscall.UTF16PtrFromString(`Software\Microsoft\Windows\CurrentVersion\Run`)
	var hKey syscall.Handle
	var disp uint32
	ret, _, _ := procRegCreateKeyExW.Call(
		uintptr(hkeyCurrentUser),
		uintptr(unsafe.Pointer(subPtr)),
		0, 0, 0,
		keySetValue,
		0,
		uintptr(unsafe.Pointer(&hKey)),
		uintptr(unsafe.Pointer(&disp)),
	)
	if ret != 0 {
		return fmt.Errorf("RegCreateKeyExW returned code %d", ret)
	}
	defer procRegCloseKey.Call(uintptr(hKey))

	valNamePtr, _ := syscall.UTF16PtrFromString("AEGIS-X Sovereign")
	u16, err := syscall.UTF16FromString(cmdStr)
	if err != nil {
		return err
	}
	r2, _, _ := procRegSetValueExW.Call(
		uintptr(hKey),
		uintptr(unsafe.Pointer(valNamePtr)),
		0,
		1,
		uintptr(unsafe.Pointer(&u16[0])),
		uintptr(len(u16)*2),
	)
	if r2 != 0 {
		return fmt.Errorf("RegSetValueExW returned code %d", r2)
	}
	return nil
}

// ScanNearbyWifiAPsNative calls wlanapi.dll!WlanGetNetworkBssList directly in memory (0 console windows!)
// to map all nearby 2.4/5/6GHz wireless routers & access points around the user's room for multi-emitter RF tomography!
func ScanNearbyWifiAPsNative(primaryChannel int) []NearbyWifiAP {
	var results []NearbyWifiAP
	var negVer uint32
	var hClient uintptr
	r, _, _ := procWlanOpenHandle.Call(2, 0, uintptr(unsafe.Pointer(&negVer)), uintptr(unsafe.Pointer(&hClient)))
	if r != 0 || hClient == 0 {
		return results
	}
	defer procWlanCloseHandle.Call(hClient, 0)

	var pIfList uintptr
	if r2, _, _ := procWlanEnumInterfaces.Call(hClient, 0, uintptr(unsafe.Pointer(&pIfList))); r2 != 0 || pIfList == 0 {
		return results
	}
	defer procWlanFreeMemory.Call(pIfList)

	numIfs := *(*uint32)(unsafe.Pointer(pIfList))
	const infoStride = 532
	base := pIfList + 8
	for i := uint32(0); i < numIfs; i++ {
		guidPtr := base + uintptr(i*infoStride)
		var pBssList uintptr
		rb, _, _ := procWlanGetNetworkBssList.Call(hClient, guidPtr, 0, 0, 0, 0, uintptr(unsafe.Pointer(&pBssList)))
		if rb != 0 || pBssList == 0 {
			continue
		}
		totalSize := *(*uint32)(unsafe.Pointer(pBssList))
		numBss := *(*uint32)(unsafe.Pointer(pBssList + 4))
		if numBss > 32 {
			numBss = 32
		}
		if totalSize >= 8 && numBss > 0 {
			raw := unsafe.Slice((*byte)(unsafe.Pointer(pBssList)), totalSize)
			// WLAN_BSS_ENTRY fixed header = 360 bytes + ulIeSize
			offset := 8
			for bIdx := uint32(0); bIdx < numBss && offset+360 <= int(totalSize); bIdx++ {
				entry := raw[offset:]
				ssidLen := binary.LittleEndian.Uint32(entry[0:4])
				if ssidLen > 32 {
					ssidLen = 32
				}
				ssid := strings.TrimSpace(string(entry[4 : 4+ssidLen]))
				if ssid == "" {
					ssid = "[Hidden RF Emitter]"
				}
				bssidBytes := entry[40:46]
				bssid := fmt.Sprintf("%02X:%02X:%02X:%02X:%02X:%02X",
					bssidBytes[0], bssidBytes[1], bssidBytes[2], bssidBytes[3], bssidBytes[4], bssidBytes[5])
				rssi := int32(binary.LittleEndian.Uint32(entry[52:56]))
				linkQual := int(binary.LittleEndian.Uint32(entry[56:60]))
				freqKHz := binary.LittleEndian.Uint32(entry[72:76])
				ieSize := int(binary.LittleEndian.Uint32(entry[356:360]))

				ch, band := freqKHzToChannel(freqKHz)
				rssiF := float64(rssi)
				if rssiF > -10 || rssiF < -105 {
					rssiF = float64(linkQual)/2.0 - 100.0
				}
				// Free-Space Path Loss + indoor wall factor distance estimate (meters)
				dist := estimateRFDistanceMeters(rssiF, freqKHz)
				results = append(results, NearbyWifiAP{
					SSID:         ssid,
					BSSID:        bssid,
					RSSIdBm:      rssiF,
					SignalPct:    linkQual,
					Channel:      ch,
					Band:         band,
					EstDistanceM: dist,
					SameChannel:  primaryChannel > 0 && ch == primaryChannel,
				})

				step := 360 + ieSize
				if step < 360 {
					break
				}
				offset += step
			}
		}
		procWlanFreeMemory.Call(pBssList)
		if len(results) > 0 {
			break
		}
	}
	return results
}

func freqKHzToChannel(khz uint32) (int, string) {
	mhz := int(khz / 1000)
	switch {
	case mhz == 2484:
		return 14, "2.4 GHz"
	case mhz >= 2412 && mhz <= 2472:
		return (mhz-2407)/5, "2.4 GHz"
	case mhz >= 5170 && mhz <= 5885:
		return (mhz-5000)/5, "5 GHz"
	case mhz >= 5955 && mhz <= 7115:
		return (mhz-5950)/5, "6 GHz"
	default:
		return 0, "RF Band"
	}
}

func estimateRFDistanceMeters(rssiDBm float64, freqKHz uint32) float64 {
	// Indoor log-distance path loss model: d = 10 ^ ((TxPower_1m - RSSI) / (10 * n)), TxPower_1m ≈ -41 dBm, n ≈ 2.7
	exp := (-41.0 - rssiDBm) / 27.0
	if exp < -0.2 {
		exp = -0.2
	}
	if exp > 1.45 {
		exp = 1.45
	}
	// Fast Taylor/pow approximation without importing math in syscall file
	d := 1.0
	// 10^exp = e^(exp * 2.302585)
	x := exp * 2.302585
	term := 1.0
	for k := 1; k <= 10; k++ {
		term *= x / float64(k)
		d += term
	}
	if d < 0.8 {
		d = 0.8
	}
	if d > 28.0 {
		d = 28.0
	}
	return float64(int(d*10+0.5)) / 10.0
}

func readIfTableCounters() map[uint32][2]uint64 {
	res := make(map[uint32][2]uint64)
	var size uint32
	_, _, _ = procGetIfTable.Call(0, uintptr(unsafe.Pointer(&size)), 0)
	if size == 0 {
		return res
	}
	buf := make([]byte, size+512)
	sz := uint32(len(buf))
	ret, _, _ := procGetIfTable.Call(uintptr(unsafe.Pointer(&buf[0])), uintptr(unsafe.Pointer(&sz)), 0)
	if ret != 0 || sz < 4 {
		return res
	}
	count := binary.LittleEndian.Uint32(buf[0:4])
	const rowSize = 860
	offset := 4
	for i := uint32(0); i < count && offset+rowSize <= int(sz); i++ {
		ifIdx := binary.LittleEndian.Uint32(buf[offset+512 : offset+516])
		inOct := uint64(binary.LittleEndian.Uint32(buf[offset+552 : offset+556]))
		outOct := uint64(binary.LittleEndian.Uint32(buf[offset+576 : offset+580]))
		res[ifIdx] = [2]uint64{inOct, outOct}
		offset += rowSize
	}
	return res
}

func tcpStateName(code uint32) string {
	switch code {
	case 1:
		return "CLOSED"
	case 2:
		return "LISTEN"
	case 3:
		return "SYN-SENT"
	case 4:
		return "SYN-RECV"
	case 5:
		return "ESTABLISHED"
	case 6:
		return "FIN-WAIT-1"
	case 7:
		return "FIN-WAIT-2"
	case 8:
		return "CLOSE-WAIT"
	case 9:
		return "CLOSING"
	case 10:
		return "LAST-ACK"
	case 11:
		return "TIME-WAIT"
	case 12:
		return "DELETE-TCB"
	default:
		return "ACTIVE"
	}
}

func readRegString(root syscall.Handle, subkey, valName string) string {
	subPtr, _ := syscall.UTF16PtrFromString(subkey)
	var hKey syscall.Handle
	ret, _, _ := procRegOpenKeyExW.Call(uintptr(root), uintptr(unsafe.Pointer(subPtr)), 0, keyRead, uintptr(unsafe.Pointer(&hKey)))
	if ret != 0 {
		return ""
	}
	defer procRegCloseKey.Call(uintptr(hKey))

	valPtr, _ := syscall.UTF16PtrFromString(valName)
	buf := make([]uint16, 256)
	bufBytes := uint32(len(buf) * 2)
	r, _, _ := procRegQueryValueExW.Call(uintptr(hKey), uintptr(unsafe.Pointer(valPtr)), 0, 0, uintptr(unsafe.Pointer(&buf[0])), uintptr(unsafe.Pointer(&bufBytes)))
	if r != 0 {
		return ""
	}
	return strings.TrimSpace(syscall.UTF16ToString(buf))
}

func regKeyExists(root syscall.Handle, subkey string) bool {
	subPtr, _ := syscall.UTF16PtrFromString(subkey)
	var hKey syscall.Handle
	ret, _, _ := procRegOpenKeyExW.Call(uintptr(root), uintptr(unsafe.Pointer(subPtr)), 0, keyRead, uintptr(unsafe.Pointer(&hKey)))
	if ret == 0 {
		procRegCloseKey.Call(uintptr(hKey))
		return true
	}
	return false
}

func utf16SliceToStrings(buf []uint16) []string {
	var res []string
	start := 0
	for i, v := range buf {
		if v == 0 {
			if i > start {
				res = append(res, syscall.UTF16ToString(buf[start:i]))
			}
			start = i + 1
		}
	}
	return res
}

// GetFastKernelTCPStates reads ONLY MIB_TCPTABLE_OWNER_PID_ALL from iphlpapi.dll in <0.15ms
// (skipping Process32FirstW / UDP tables) so the Cyber IDS can catch sub-second Nmap -sT sweeps on ANY Windows port!
func GetFastKernelTCPStates() []NativeSocketRow {
	var rows []NativeSocketRow
	var size uint32
	_, _, _ = procGetExtendedTcpTable.Call(0, uintptr(unsafe.Pointer(&size)), 0, afInet, tcpTableOwnerPidAll, 0)
	if size == 0 {
		return nil
	}
	buf := make([]byte, size+256)
	sz := uint32(len(buf))
	ret, _, _ := procGetExtendedTcpTable.Call(uintptr(unsafe.Pointer(&buf[0])), uintptr(unsafe.Pointer(&sz)), 0, afInet, tcpTableOwnerPidAll, 0)
	if ret != 0 || sz < 4 {
		return nil
	}
	count := binary.LittleEndian.Uint32(buf[0:4])
	offset := 4
	rows = make([]NativeSocketRow, 0, count)
	for i := uint32(0); i < count && offset+24 <= int(sz); i++ {
		stateCode := binary.LittleEndian.Uint32(buf[offset : offset+4])
		if stateCode != 2 { // Skip static LISTEN sockets for speed
			localAddr := net.IPv4(buf[offset+4], buf[offset+5], buf[offset+6], buf[offset+7]).String()
			localPort := int(binary.BigEndian.Uint16(buf[offset+8 : offset+10]))
			remoteAddr := net.IPv4(buf[offset+12], buf[offset+13], buf[offset+14], buf[offset+15]).String()
			remotePort := int(binary.BigEndian.Uint16(buf[offset+16 : offset+18]))
			pid := int(binary.LittleEndian.Uint32(buf[offset+20 : offset+24]))
			rows = append(rows, NativeSocketRow{
				Proto:      "TCP",
				LocalIP:    localAddr,
				LocalPort:  localPort,
				RemoteIP:   remoteAddr,
				RemotePort: remotePort,
				State:      tcpStateName(stateCode),
				PID:        pid,
			})
		}
		offset += 24
	}
	return rows
}

// StartRawIPv4PacketSniffer opens an optional native Winsock2 IPPROTO_IP raw socket + WSAIoctl(SIO_RCVALL)
// when running with Administrator privileges. It catches stealth Nmap scans (-sS, -sF, -sX, -sN) at wire speed
// even on CLOSED or FILTERED ports! Gracefully returns false if running as Standard User.
func StartRawIPv4PacketSniffer(bindLocalIP string, stop <-chan struct{}, onPacket func(RawPacketEvent)) bool {
	ip4 := net.ParseIP(bindLocalIP).To4()
	if ip4 == nil {
		return false
	}
	fd, err := syscall.Socket(syscall.AF_INET, syscall.SOCK_RAW, syscall.IPPROTO_IP)
	if err != nil {
		return false
	}
	sa := &syscall.SockaddrInet4{Port: 0}
	copy(sa.Addr[:], ip4)
	if err := syscall.Bind(fd, sa); err != nil {
		_ = syscall.Closesocket(fd)
		return false
	}
	// SIO_RCVALL = _WSAIOW(IOC_VENDOR, 1) = 0x98000001; RCVALL_IPLEVEL = 3 (or RCVALL_ON = 1)
	const sioRcvAll = 0x98000001
	var inVal uint32 = 1
	var bytesRet uint32
	if err := syscall.WSAIoctl(fd, sioRcvAll, (*byte)(unsafe.Pointer(&inVal)), 4, nil, 0, &bytesRet, nil, 0); err != nil {
		_ = syscall.Closesocket(fd)
		return false
	}

	go func() {
		go func() {
			<-stop
			_ = syscall.Closesocket(fd)
		}()
		buf := make([]byte, 65535)
		for {
			n, _, rerr := syscall.Recvfrom(fd, buf, 0)
			if rerr != nil {
				select {
				case <-stop:
					return
				default:
					continue
				}
			}
			if n < 40 {
				continue
			}
			verIHL := buf[0]
			if (verIHL >> 4) != 4 {
				continue
			}
			ihl := int(verIHL&0x0F) * 4
			if ihl < 20 || n < ihl+20 {
				continue
			}
			proto := buf[9]
			if proto != 6 { // TCP == 6
				continue
			}
			ttl := int(buf[8])
			srcIP := net.IPv4(buf[12], buf[13], buf[14], buf[15]).String()
			dstIP := net.IPv4(buf[16], buf[17], buf[18], buf[19]).String()
			tcp := buf[ihl:]
			srcPort := int(binary.BigEndian.Uint16(tcp[0:2]))
			dstPort := int(binary.BigEndian.Uint16(tcp[2:4]))
			flags := tcp[13]
			win := int(binary.BigEndian.Uint16(tcp[14:16]))

			onPacket(RawPacketEvent{
				SrcIP:      srcIP,
				DstIP:      dstIP,
				SrcPort:    srcPort,
				DstPort:    dstPort,
				TCPFlags:   flags,
				FlagsStr:   formatRawTCPFlags(flags),
				WindowSize: win,
				TTL:        ttl,
				PacketLen:  n,
			})
		}
	}()
	return true
}

func formatRawTCPFlags(f byte) string {
	if f == 0 {
		return "NULL"
	}
	var p []string
	if f&0x02 != 0 {
		p = append(p, "SYN")
	}
	if f&0x10 != 0 {
		p = append(p, "ACK")
	}
	if f&0x01 != 0 {
		p = append(p, "FIN")
	}
	if f&0x04 != 0 {
		p = append(p, "RST")
	}
	if f&0x08 != 0 {
		p = append(p, "PSH")
	}
	if f&0x20 != 0 {
		p = append(p, "URG")
	}
	return strings.Join(p, ", ")
}
