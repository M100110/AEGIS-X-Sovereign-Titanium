package installmgr

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
	"runtime"
	"strings"

	"aegisx/internal/winapi"
)

type Status struct {
	IsWindows          bool   `json:"is_windows"`
	Installed          bool   `json:"installed"`
	RunningFromInstall bool   `json:"running_from_install"`
	CurrentExePath     string `json:"current_exe_path"`
	TargetInstallDir   string `json:"target_install_dir"`
	TargetExePath      string `json:"target_exe_path"`
	DesktopShortcut    bool   `json:"desktop_shortcut"`
	StartMenuShortcut  bool   `json:"start_menu_shortcut"`
}

func targetInstallDirectory() string {
	if runtime.GOOS != "windows" {
		return `C:\Users\User\AppData\Local\Programs\AEGIS-X Sovereign`
	}
	localApp := os.Getenv("LOCALAPPDATA")
	if localApp == "" {
		home, _ := os.UserHomeDir()
		localApp = filepath.Join(home, "AppData", "Local")
	}
	return filepath.Join(localApp, "Programs", "AEGIS-X Sovereign")
}

// GetStatus checks whether the user launched AEGIS-X from a temporary Downloads folder
// or from an already-installed Programs directory.
func GetStatus() Status {
	targetDir := targetInstallDirectory()
	targetExe := filepath.Join(targetDir, "AegisX.exe")

	if runtime.GOOS != "windows" {
		return Status{
			IsWindows:          false,
			Installed:          true,
			RunningFromInstall: true,
			CurrentExePath:     "/opt/aegisx/aegisx-engine",
			TargetInstallDir:   targetDir,
			TargetExePath:      targetExe,
			DesktopShortcut:    true,
			StartMenuShortcut:  true,
		}
	}

	curExe, _ := os.Executable()
	curClean := strings.ToLower(filepath.Clean(curExe))
	targetClean := strings.ToLower(filepath.Clean(targetExe))
	progFiles := strings.ToLower(os.Getenv("ProgramFiles"))

	_, errTarget := os.Stat(targetExe)
	installed := errTarget == nil || (progFiles != "" && strings.HasPrefix(curClean, progFiles))
	runningFromInstall := (curClean == targetClean) || (progFiles != "" && strings.HasPrefix(curClean, progFiles))

	home, _ := os.UserHomeDir()
	deskLnk := filepath.Join(home, "Desktop", "AEGIS-X Sovereign.lnk")
	appData := os.Getenv("APPDATA")
	startLnk := filepath.Join(appData, "Microsoft", "Windows", "Start Menu", "Programs", "AEGIS-X Sovereign.lnk")

	_, errDesk := os.Stat(deskLnk)
	_, errStart := os.Stat(startLnk)

	return Status{
		IsWindows:          true,
		Installed:          installed,
		RunningFromInstall: runningFromInstall,
		CurrentExePath:     curExe,
		TargetInstallDir:   targetDir,
		TargetExePath:      targetExe,
		DesktopShortcut:    errDesk == nil,
		StartMenuShortcut:  errStart == nil,
	}
}

// InstallSelfToSystem performs a clean, official per-user Windows installation directly from AegisX.exe!
// Copies AegisX.exe to %LOCALAPPDATA%\Programs\AEGIS-X Sovereign\AegisX.exe, creates Desktop & Start Menu shortcuts,
// and registers Windows Settings -> Installed Apps (Uninstall) entry — NO separate installer file needed!
func InstallSelfToSystem(createDesktopShortcut, enableEcoAutoStart bool) (Status, string, error) {
	if runtime.GOOS != "windows" {
		st := GetStatus()
		return st, "[Cloud Preview] على نظام ويندوز، يقوم هذا المعالج بتثبيت التطبيق في مجلد البرامج الرسمي وإنشاء اختصار سطح المكتب وقائمة ابدأ وتسجيله في تطبيقات ويندوز بضغطة واحدة.", nil
	}

	srcExe, err := os.Executable()
	if err != nil {
		return GetStatus(), "", err
	}

	targetDir := targetInstallDirectory()
	if err := os.MkdirAll(targetDir, 0755); err != nil {
		return GetStatus(), "", fmt.Errorf("تعذر إنشاء مجلد التثبيت %s: %v", targetDir, err)
	}

	targetExe := filepath.Join(targetDir, "AegisX.exe")
	if !strings.EqualFold(filepath.Clean(srcExe), filepath.Clean(targetExe)) {
		if err := copyFileContents(srcExe, targetExe); err != nil {
			return GetStatus(), "", fmt.Errorf("تعذر نسخ ملف المحرك إلى مجلد التثبيت: %v", err)
		}
	}

	// Create Start Menu + optional Desktop Shortcut + HKCU Uninstall registration silently via WScript.Shell COM (0 console windows!)
	psScript := fmt.Sprintf(`
$targetExe = '%s'
$targetDir = '%s'
$wsh = New-Object -ComObject WScript.Shell
$startMenuDir = [Environment]::GetFolderPath('Programs')
$lnkStart = $wsh.CreateShortcut((Join-Path $startMenuDir 'AEGIS-X Sovereign.lnk'))
$lnkStart.TargetPath = $targetExe
$lnkStart.WorkingDirectory = $targetDir
$lnkStart.Description = 'AEGIS-X v10.0 SOVEREIGN APEX — OS & Network Intelligence'
$lnkStart.IconLocation = "$targetExe,0"
$lnkStart.Save()
`, escapePSSingleQuotes(targetExe), escapePSSingleQuotes(targetDir))

	if createDesktopShortcut {
		psScript += `
$deskDir = [Environment]::GetFolderPath('Desktop')
$lnkDesk = $wsh.CreateShortcut((Join-Path $deskDir 'AEGIS-X Sovereign.lnk'))
$lnkDesk.TargetPath = $targetExe
$lnkDesk.WorkingDirectory = $targetDir
$lnkDesk.Description = 'AEGIS-X v10.0 SOVEREIGN APEX'
$lnkDesk.IconLocation = "$targetExe,0"
$lnkDesk.Save()
`
	}

	psScript += `
$uninstKey = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\AEGIS-X'
New-Item -Path $uninstKey -Force | Out-Null
Set-ItemProperty -Path $uninstKey -Name 'DisplayName' -Value 'AEGIS-X v10.0 SOVEREIGN APEX'
Set-ItemProperty -Path $uninstKey -Name 'DisplayVersion' -Value '10.0.0'
Set-ItemProperty -Path $uninstKey -Name 'Publisher' -Value 'AEGIS-X Sovereign Systems'
Set-ItemProperty -Path $uninstKey -Name 'DisplayIcon' -Value "$targetExe,0"
Set-ItemProperty -Path $uninstKey -Name 'InstallLocation' -Value $targetDir
$uninstCmd = 'cmd.exe /c rmdir /s /q "' + $targetDir + '"'
Set-ItemProperty -Path $uninstKey -Name 'UninstallString' -Value $uninstCmd
Set-ItemProperty -Path $uninstKey -Name 'NoModify' -Type DWord -Value 1
Set-ItemProperty -Path $uninstKey -Name 'NoRepair' -Type DWord -Value 1
`
	_, _ = winapi.HiddenCommand("powershell.exe", "-NoProfile", "-NonInteractive", "-Command", psScript).CombinedOutput()

	if enableEcoAutoStart {
		_ = winapi.SetAegisAutoStartPath(targetExe, true)
	}

	st := GetStatus()
	return st, fmt.Sprintf("تم تثبيت AEGIS-X v10.0 رسمياً على جهازك في (%s) وإنشاء اختصارات سطح المكتب وقائمة ابدأ بنجاح!", targetDir), nil
}

func copyFileContents(src, dst string) error {
	in, err := os.Open(src)
	if err != nil {
		return err
	}
	defer in.Close()

	tmp := dst + ".tmp"
	out, err := os.OpenFile(tmp, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0755)
	if err != nil {
		return err
	}
	if _, err := io.Copy(out, in); err != nil {
		_ = out.Close()
		_ = os.Remove(tmp)
		return err
	}
	_ = out.Close()
	_ = os.Remove(dst)
	return os.Rename(tmp, dst)
}

func escapePSSingleQuotes(s string) string {
	return strings.ReplaceAll(s, "'", "''")
}
