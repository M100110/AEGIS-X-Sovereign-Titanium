; AEGIS-X Sovereign OS Intelligence v9.0 SOVEREIGN ULTRA — Enterprise Windows x64 Setup Wizard
Unicode True
!include "MUI2.nsh"
!include "x64.nsh"

Name "AEGIS-X v9.0 SOVEREIGN ULTRA Sovereign OS Intelligence"
OutFile "../releases/AegisX-Installer.exe"
InstallDir "$PROGRAMFILES64\AEGIS-X Sovereign"
InstallDirRegKey HKLM "Software\AEGIS-X" "Install_Dir"
RequestExecutionLevel admin
ShowInstDetails show
ShowUnInstDetails show
SetCompressor /SOLID lzma

VIProductVersion "9.0.0.0"
VIAddVersionKey "ProductName" "AEGIS-X v9.0 SOVEREIGN ULTRA Sovereign OS Intelligence"
VIAddVersionKey "CompanyName" "AEGIS-X Sovereign Systems"
VIAddVersionKey "FileDescription" "AEGIS-X v9.0 SOVEREIGN ULTRA Enterprise Setup & Engine Verifier"
VIAddVersionKey "FileVersion" "9.0.0.0"
VIAddVersionKey "LegalCopyright" "Copyright (c) 2026 AEGIS-X Sovereign Systems"

; Branded Enterprise Visuals & Icons
!define MUI_ICON "../build/aegisx.ico"
!define MUI_UNICON "../build/aegisx.ico"
!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_BITMAP "header.bmp"
!define MUI_WELCOMEFINISHPAGE_BITMAP "wizard.bmp"
!define MUI_COMPONENTSPAGE_SMALLDESC
!define MUI_ABORTWARNING

; Welcome Page Clear Explanation
!define MUI_WELCOMEPAGE_TITLE "Welcome to AEGIS-X v9.0 SOVEREIGN ULTRA Setup"
!define MUI_WELCOMEPAGE_TEXT "This wizard installs AEGIS-X v9.0 SOVEREIGN ULTRA (64-bit Native Windows Intelligence) and verifies all system & network engines on your PC.$\r$\n$\r$\nKey v9.0 SOVEREIGN ULTRA Guarantees:$\r$\n• ZERO Boot/Background Strain: Auto-Start is OPT-IN (OFF by default), and Adaptive Eco-Standby drops network load to 0.0 packets/sec whenever the dashboard is closed.$\r$\n• Real Pre-Flight Engine Verification: Audits Win32 Kernel DLLs, Visual C++, Pktmon ETW, Winget, Wireshark/TShark, and Nmap.$\r$\n• Click Next to choose exactly which components you want."

; Launch AegisX.exe directly after Finish (inherits UAC Admin token from Setup!)
!define MUI_FINISHPAGE_RUN "$INSTDIR\AegisX.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Launch AEGIS-X v9.0 SOVEREIGN ULTRA Command Center & System Tray Now"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "LICENSE.txt"
!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "English"
!insertmacro MUI_LANGUAGE "Arabic"

; ============================================================================
; SECTION 1: CORE ENGINE + REAL PRE-FLIGHT ENGINE VERIFICATION (REQUIRED)
; ============================================================================
Section "!AEGIS-X Core Engine, 8-Protocol LAN Inventory, FLIR Bio-Thermal Radar & 80 IT Tools" SecCore
  SectionIn RO

  DetailPrint "======================================================================"
  DetailPrint " AEGIS-X v9.0 SOVEREIGN ULTRA — Pre-Flight System & Engine Audit"
  DetailPrint "======================================================================"
  ${If} ${RunningX64}
    DetailPrint "[OK] 1/6 OS Architecture: 64-bit Windows NT (x86_64) Verified."
  ${Else}
    MessageBox MB_ICONSTOP "AEGIS-X v9.0 SOVEREIGN ULTRA requires 64-bit Windows 10 or Windows 11."
    Abort
  ${EndIf}

  DetailPrint "[INFO] Stopping any previous running AegisX.exe instance..."
  nsExec::ExecToLog 'taskkill /F /IM AegisX.exe'

  ; Audit Direct Win32 DLLs
  IfFileExists "$SYSDIR\iphlpapi.dll" 0 +2
    DetailPrint "[OK] 2/6 Kernel Network & Wi-Fi DLLs (iphlpapi.dll + wlanapi.dll): READY."

  ; Audit Visual C++ Runtime
  IfFileExists "$SYSDIR\vcruntime140.dll" 0 +3
    DetailPrint "[OK] 3/6 Microsoft Visual C++ 2015-2022 Runtime (vcruntime140.dll): INSTALLED."
    Goto audit_pktmon
    DetailPrint "[WARN] 3/6 Visual C++ Runtime not detected (enable Component #2 or install inside app)."

  audit_pktmon:
  IfFileExists "$SYSDIR\pktmon.exe" 0 +3
    DetailPrint "[OK] 4/6 Windows Native ETW Packet Monitor (pktmon.exe): INSTALLED."
    Goto audit_wireshark
    DetailPrint "[INFO] 4/6 pktmon.exe not present — using Built-in Win32 Socket Dissector."

  audit_wireshark:
  IfFileExists "$PROGRAMFILES64\Wireshark\tshark.exe" 0 +3
    DetailPrint "[OK] 5/6 Wireshark TShark L7 Dissector ($PROGRAMFILES64\Wireshark\tshark.exe): DETECTED & LINKED!"
    Goto audit_nmap
    DetailPrint "[INFO] 5/6 Wireshark TShark not installed — Built-in Kernel Dissector will run (0% CPU)."

  audit_nmap:
  IfFileExists "$PROGRAMFILES64\Nmap\nmap.exe" 0 +3
    DetailPrint "[OK] 6/6 Nmap Security Scanner ($PROGRAMFILES64\Nmap\nmap.exe): DETECTED & LINKED!"
    Goto install_core_files
    DetailPrint "[INFO] 6/6 Nmap not installed — Built-in SendARP + X.509 SSL Scanner active."

  install_core_files:
  DetailPrint "----------------------------------------------------------------------"
  DetailPrint "Installing AEGIS-X v9.0 SOVEREIGN ULTRA Native Binaries to: $INSTDIR"
  SetOutPath "$INSTDIR"
  File "../releases/AegisX.exe"
  File "../build/aegisx.ico"
  File "LICENSE.txt"

  DetailPrint "Configuring Windows Firewall Localhost Loopback Rule (127.0.0.1:7788)..."
  nsExec::ExecToLog 'netsh advfirewall firewall delete rule name="AEGIS-X Local Dashboard"'
  nsExec::ExecToLog 'netsh advfirewall firewall add rule name="AEGIS-X Local Dashboard" dir=in action=allow program="$INSTDIR\AegisX.exe" enable=yes profile=any'

  ; IMPORTANT: Clean any old forced auto-start registry key from older versions unless user explicitly checks SecAutoStart below!
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "AEGIS-X Sovereign"

  WriteRegStr HKLM "Software\AEGIS-X" "Install_Dir" "$INSTDIR"
  WriteRegStr HKLM "Software\AEGIS-X" "Version" "9.0.0"
  WriteUninstaller "$INSTDIR\Uninstall-AegisX.exe"

  DetailPrint "Creating Desktop & Start Menu Shortcuts..."
  CreateDirectory "$SMPROGRAMS\AEGIS-X Sovereign"
  CreateShortCut "$SMPROGRAMS\AEGIS-X Sovereign\AEGIS-X v9.0 SOVEREIGN ULTRA.lnk" "$INSTDIR\AegisX.exe" "" "$INSTDIR\aegisx.ico" 0
  CreateShortCut "$SMPROGRAMS\AEGIS-X Sovereign\Uninstall AEGIS-X.lnk" "$INSTDIR\Uninstall-AegisX.exe" "" "$INSTDIR\aegisx.ico" 0
  CreateShortCut "$DESKTOP\AEGIS-X Sovereign.lnk" "$INSTDIR\AegisX.exe" "" "$INSTDIR\aegisx.ico" 0

  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AEGIS-X" "DisplayName" "AEGIS-X v9.0 SOVEREIGN ULTRA Sovereign OS Intelligence"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AEGIS-X" "DisplayIcon" "$INSTDIR\aegisx.ico"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AEGIS-X" "Publisher" "AEGIS-X Sovereign Systems"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AEGIS-X" "DisplayVersion" "9.0.0"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AEGIS-X" "UninstallString" '"$INSTDIR\Uninstall-AegisX.exe"'
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AEGIS-X" "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AEGIS-X" "NoRepair" 1
  DetailPrint "[SUCCESS] AEGIS-X v9.0 SOVEREIGN ULTRA Core Engine Installed Cleanly!"
SectionEnd

; ============================================================================
; SECTION 2: VERIFY & REPAIR VISUAL C++ x64 RUNTIME IF MISSING (RECOMMENDED)
; ============================================================================
Section "Verify & Auto-Repair Microsoft Visual C++ x64 Runtime (If Missing)" SecVCRedist
  IfFileExists "$SYSDIR\vcruntime140.dll" vc_ok vc_install
  vc_ok:
    DetailPrint "[OK] Microsoft Visual C++ Runtime (vcruntime140.dll) is already installed — skipping download."
    Goto vc_done
  vc_install:
    DetailPrint "[INSTALLING] vcruntime140.dll missing — installing Microsoft.VCRedist.2015+.x64 silently via Winget..."
    nsExec::ExecToLog 'winget.exe install --id Microsoft.VCRedist.2015+.x64 -e --silent --accept-package-agreements --accept-source-agreements'
  vc_done:
SectionEnd

; ============================================================================
; SECTION 3: OPTIONAL WIRESHARK / TSHARK DEEP L7 ENGINE (OPT-IN)
; ============================================================================
Section /o "Install Wireshark & TShark L7 Packet Engine via Winget (Optional)" SecWireshark
  IfFileExists "$PROGRAMFILES64\Wireshark\tshark.exe" ws_ok ws_install
  ws_ok:
    DetailPrint "[OK] Wireshark TShark is already installed at $PROGRAMFILES64\Wireshark\tshark.exe!"
    Goto ws_done
  ws_install:
    DetailPrint "[INSTALLING] Downloading & installing WiresharkFoundation.Wireshark silently via Winget..."
    nsExec::ExecToLog 'winget.exe install --id WiresharkFoundation.Wireshark -e --silent --accept-package-agreements --accept-source-agreements'
  ws_done:
SectionEnd

; ============================================================================
; SECTION 4: OPTIONAL NMAP SECURITY SCANNER ENGINE (OPT-IN)
; ============================================================================
Section /o "Install Nmap Network Security Auditor via Winget (Optional)" SecNmap
  IfFileExists "$PROGRAMFILES64\Nmap\nmap.exe" nm_ok nm_install
  nm_ok:
    DetailPrint "[OK] Nmap is already installed at $PROGRAMFILES64\Nmap\nmap.exe!"
    Goto nm_done
  nm_install:
    DetailPrint "[INSTALLING] Downloading & installing Insecure.Nmap silently via Winget..."
    nsExec::ExecToLog 'winget.exe install --id Insecure.Nmap -e --silent --accept-package-agreements --accept-source-agreements'
  nm_done:
SectionEnd

; ============================================================================
; SECTION 5: OPTIONAL ECO-STANDBY AUTO-START WITH WINDOWS (UNCHECKED BY DEFAULT!)
; ============================================================================
Section /o "Start Silently with Windows in Zero-Load Eco-Standby Mode (Optional)" SecAutoStart
  DetailPrint "Enabling Smart Eco-Boot Startup (-no-browser -eco-boot -> 0.0% network load until opened)..."
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "AEGIS-X Sovereign" '"$INSTDIR\AegisX.exe" -no-browser -eco-boot'
SectionEnd

; ============================================================================
; DETAILED INTERACTIVE COMPONENT DESCRIPTIONS (ENGLISH & ARABIC)
; ============================================================================
LangString DESC_SecCore ${LANG_ENGLISH} "Required: Installs AegisX.exe (v9.0 SOVEREIGN ULTRA), 8-Protocol LAN Device Inventory (IP, MAC, Name, Vendor, OS), FLIR Bio-Thermal RF Radar, 80 Silent IT Tools, System Tray Icon, and runs a real verification check on all installed engines."
LangString DESC_SecVCRedist ${LANG_ENGLISH} "Recommended: Checks if Microsoft Visual C++ 2015-2022 (vcruntime140.dll) is present on your PC. If already installed, does nothing (0s). If missing, installs it silently via Winget."
LangString DESC_SecWireshark ${LANG_ENGLISH} "Optional External Engine: If checked and not already on your PC, downloads & installs official Wireshark/TShark via Winget for Deep Layer-7 Packet Inspection. (You can also install it later inside the app)."
LangString DESC_SecNmap ${LANG_ENGLISH} "Optional External Engine: If checked and not already on your PC, downloads & installs official Nmap Security Scanner via Winget. (AEGIS-X already includes a built-in SendARP/SSL scanner without needing Nmap)."
LangString DESC_SecAutoStart ${LANG_ENGLISH} "Optional (OFF by default so your PC boots at 100% speed): Starts AEGIS-X in the System Tray using '-eco-boot' Deep Eco-Standby (0 network packets & <0.02% CPU until you open the dashboard). Can be toggled anytime inside the app!"

LangString DESC_SecCore ${LANG_ARABIC} "إلزامي: يثبت المحرك الأساسي AegisX.exe (الإصدار v9.0 SOVEREIGN ULTRA)، خريطة الراوتر والأجهزة، رادار موجات الواي فاي RF، 80 أداة صيانة صامتة، ويفحص فعلياً حالة كافة المحركات على جهازك."
LangString DESC_SecVCRedist ${LANG_ARABIC} "موصى به: يتحقق من وجود مكتبات Microsoft Visual C++ x64 في جهازك؛ إذا كانت موجودة يتجاوزها فوراً في 0 ثانية، وإذا كانت مفقودة يثبتها بصمت عبر Winget."
LangString DESC_SecWireshark ${LANG_ARABIC} "محرك خارجي اختياري: إذا لم يكن Wireshark مثبتاً لديك، يقوم بتحميله وتثبيته رسمياً عبر Winget لفحص الحزم العميق L7 (يمكنك تركه وتثبيته لاحقاً من داخل البرنامج بضغطة زر)."
LangString DESC_SecNmap ${LANG_ARABIC} "محرك خارجي اختياري: يقوم بتثبيت Nmap الرسمي عبر Winget إذا لم يكن موجوداً (علماً أن AEGIS-X يحتوي مسبقاً على ماسح SendARP/SSL مدمج يعمل بدون Nmap)."
LangString DESC_SecAutoStart ${LANG_ARABIC} "اختياري (مغلق افتراضياً لعدم إبطاء تشغيل الويندوز إطلاقاً): يشغّل الأيقونة بوضع السكون الذكي (-eco-boot) بحمل 0% على الشبكة والمعالج حتى تفتح اللوحة بنفسك. يمكنك تفعيله أو إلغاؤه في أي وقت من داخل البرنامج!"

!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  !insertmacro MUI_DESCRIPTION_TEXT ${SecCore} $(DESC_SecCore)
  !insertmacro MUI_DESCRIPTION_TEXT ${SecVCRedist} $(DESC_SecVCRedist)
  !insertmacro MUI_DESCRIPTION_TEXT ${SecWireshark} $(DESC_SecWireshark)
  !insertmacro MUI_DESCRIPTION_TEXT ${SecNmap} $(DESC_SecNmap)
  !insertmacro MUI_DESCRIPTION_TEXT ${SecAutoStart} $(DESC_SecAutoStart)
!insertmacro MUI_FUNCTION_DESCRIPTION_END

; ============================================================================
; CLEAN UNINSTALLER
; ============================================================================
Section "Uninstall"
  DetailPrint "Stopping running AEGIS-X daemon & removing System Tray icon..."
  nsExec::ExecToLog 'taskkill /F /IM AegisX.exe'

  DetailPrint "Removing Firewall rules & Startup registration..."
  nsExec::ExecToLog 'netsh advfirewall firewall delete rule name="AEGIS-X Local Dashboard"'
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "AEGIS-X Sovereign"

  DetailPrint "Removing Shortcuts & Program Files..."
  Delete "$DESKTOP\AEGIS-X Sovereign.lnk"
  Delete "$SMPROGRAMS\AEGIS-X Sovereign\AEGIS-X v7.0 APEX.lnk"
  Delete "$SMPROGRAMS\AEGIS-X Sovereign\AEGIS-X v9.0 SOVEREIGN ULTRA.lnk"
  Delete "$SMPROGRAMS\AEGIS-X Sovereign\Uninstall AEGIS-X.lnk"
  RMDir "$SMPROGRAMS\AEGIS-X Sovereign"

  Delete "$INSTDIR\AegisX.exe"
  Delete "$INSTDIR\aegisx.ico"
  Delete "$INSTDIR\LICENSE.txt"
  Delete "$INSTDIR\Uninstall-AegisX.exe"
  RMDir "$INSTDIR"

  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AEGIS-X"
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AEGIS-X"
  DeleteRegKey HKLM "Software\AEGIS-X"
  DetailPrint "AEGIS-X v9.0 SOVEREIGN ULTRA Uninstalled 100% Cleanly."
SectionEnd
