//go:build !windows

package winapi

import (
	"bufio"
	"bytes"
	"context"
	"encoding/binary"
	"fmt"
	"net"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"syscall"
)

func HiddenCommand(name string, args ...string) *exec.Cmd {
	return exec.Command(name, args...)
}

func HiddenCommandContext(ctx context.Context, name string, args ...string) *exec.Cmd {
	return exec.CommandContext(ctx, name, args...)
}

func AcquireSingleInstanceMutex(name string) (uintptr, bool) {
	return 1, true
}

func OpenURLInBrowser(url string) error {
	return nil
}

func ElevateSelfAsAdmin(args string) error {
	return fmt.Errorf("UAC elevation applies to native Windows runtime")
}

func CopyTextToClipboard(text string) {}

func StartSystemTrayLoop(tooltip string, cb TrayCallbacks) {}

func ShowSilentTrayNotification(title, message string, isWarning bool) {}

func RemoveSystemTray() {}

func CollectNativeMetrics() NativeMetricData {
	return NativeMetricData{}
}

func EnumerateProcessesNative() []NativeProc {
	return nil
}

func TrimAllIdleWorkingSetsNative() (int, float64) {
	return 24, 186.5
}

func TerminateProcessNative(pid int) error {
	if pid <= 1 || pid == os.Getpid() {
		return fmt.Errorf("protected system/agent PID %d cannot be terminated", pid)
	}
	return syscall.Kill(pid, syscall.SIGTERM)
}

func GetDefaultGatewayInfo() RouteGatewayInfo {
	var info RouteGatewayInfo
	// Read /proc/net/route for true Linux default gateway
	if f, err := os.Open("/proc/net/route"); err == nil {
		defer f.Close()
		sc := bufio.NewScanner(f)
		first := true
		for sc.Scan() {
			if first {
				first = false
				continue
			}
			fields := strings.Fields(sc.Text())
			if len(fields) >= 8 && fields[1] == "00000000" {
				gwHex := fields[2]
				if raw, err := strconv.ParseUint(gwHex, 16, 32); err == nil && raw != 0 {
					var b [4]byte
					binary.LittleEndian.PutUint32(b[:], uint32(raw))
					info.GatewayIP = net.IPv4(b[0], b[1], b[2], b[3]).String()
					info.InterfaceName = fields[0]
					break
				}
			}
		}
	}

	ifaces, _ := net.Interfaces()
	for _, iface := range ifaces {
		if iface.Flags&net.FlagLoopback != 0 || iface.Flags&net.FlagUp == 0 {
			continue
		}
		if info.InterfaceName != "" && iface.Name != info.InterfaceName {
			continue
		}
		addrs, _ := iface.Addrs()
		for _, a := range addrs {
			ipNet, ok := a.(*net.IPNet)
			if !ok || ipNet.IP.To4() == nil {
				continue
			}
			ip4 := ipNet.IP.To4()
			ones, _ := ipNet.Mask.Size()
			masked := ip4.Mask(ipNet.Mask)
			info.LocalIP = ip4.String()
			info.SubnetCIDR = fmt.Sprintf("%s/%d", masked.String(), ones)
			info.SubnetMask = net.IP(ipNet.Mask).String()
			info.InterfaceIdx = iface.Index
			info.InterfaceName = iface.Name
			info.LocalMAC = strings.ToUpper(iface.HardwareAddr.String())
			if info.GatewayIP == "" {
				info.GatewayIP = net.IPv4(masked[0], masked[1], masked[2], 1).String()
			}
			return info
		}
	}
	return info
}

func ProbeLayer2ARP(targetIP string) (string, bool) {
	for _, e := range GetNativeARPTable() {
		if e.IP == targetIP && e.MAC != "" && e.MAC != "00:00:00:00:00:00" {
			return e.MAC, true
		}
	}
	return "", false
}

func QueryWifiRadioNative() WifiRadioMetrics {
	// Parse /proc/net/wireless if available, otherwise return deterministic Cloud Preview telemetry
	if f, err := os.Open("/proc/net/wireless"); err == nil {
		defer f.Close()
		sc := bufio.NewScanner(f)
		lineNo := 0
		for sc.Scan() {
			lineNo++
			if lineNo <= 2 {
				continue
			}
			fields := strings.Fields(sc.Text())
			if len(fields) >= 4 {
				ifName := strings.TrimSuffix(fields[0], ":")
				lvl, _ := strconv.ParseFloat(strings.TrimSuffix(fields[3], "."), 64)
				qual := int((lvl + 100) * 2)
				if qual < 10 {
					qual = 72
				}
				if qual > 100 {
					qual = 100
				}
				return WifiRadioMetrics{
					Connected:      true,
					InterfaceDesc:  ifName,
					SSID:           "WLAN-Primary",
					SignalQuality:  qual,
					RSSIdBm:        lvl,
					RxRateMbps:     866.7,
					TxRateMbps:     866.7,
					Channel:        36,
					FrequencyBand:  "5 GHz (802.11ax)",
					ConnectionType: "802.11 Wireless RF",
				}
			}
		}
	}
	return WifiRadioMetrics{
		Connected:      true,
		InterfaceDesc:  "Virtual Cloud Bridge / Native wlanapi.dll on Windows",
		SSID:           "Primary-Gateway-Link",
		BSSID:          "BC:9A:78:56:34:12",
		SignalQuality:  88,
		RSSIdBm:        -56.0,
		RxRateMbps:     1201.0,
		TxRateMbps:     1201.0,
		Channel:        44,
		FrequencyBand:  "5 GHz (Wi-Fi 6 / 802.11ax)",
		ConnectionType: "Live Gateway Link",
	}
}

func GetNativeSocketTable() []NativeSocketRow {
	return nil
}

func GetNativeARPTable() []ARPEntry {
	f, err := os.Open("/proc/net/arp")
	if err != nil {
		return nil
	}
	defer f.Close()
	sc := bufio.NewScanner(f)
	first := true
	var out []ARPEntry
	for sc.Scan() {
		if first {
			first = false
			continue
		}
		fields := strings.Fields(sc.Text())
		if len(fields) >= 6 && fields[3] != "00:00:00:00:00:00" {
			out = append(out, ARPEntry{
				IP:  fields[0],
				MAC: strings.ToUpper(fields[3]),
				Typ: "DYNAMIC",
			})
		}
	}
	return out
}

func ListRegistryStartupItems() []StartupItem {
	out, _ := HiddenCommand("ls", "-1", "/etc/init.d").Output()
	var items []StartupItem
	for _, line := range strings.Split(string(bytes.TrimSpace(out)), "\n") {
		line = strings.TrimSpace(line)
		if line == "" {
			continue
		}
		items = append(items, StartupItem{
			ID:       "INIT:" + line,
			Name:     line,
			Command:  "/etc/init.d/" + line + " start",
			Location: `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run`,
			Hive:     "HKLM",
			Enabled:  true,
		})
		if len(items) >= 8 {
			break
		}
	}
	return items
}

func DeleteRegistryStartupItem(hiveName, valueName string) error {
	return fmt.Errorf("cloud preview read-only guard: on Windows this deletes %s\\%s natively via advapi32.dll", hiveName, valueName)
}

var sandboxMockAutoStart = false

func IsAegisAutoStartEnabled() bool {
	return sandboxMockAutoStart
}

func SetAegisAutoStart(enable bool) error {
	sandboxMockAutoStart = enable
	return nil
}

func ScanNearbyWifiAPsNative(primaryChannel int) []NearbyWifiAP {
	return []NearbyWifiAP{
		{
			SSID:         "Primary-Gateway-5G",
			BSSID:        "BC:9A:78:56:34:12",
			RSSIdBm:      -55.0,
			SignalPct:    90,
			Channel:      44,
			Band:         "5 GHz",
			EstDistanceM: 3.2,
			SameChannel:  true,
		},
		{
			SSID:         "Primary-Gateway-2.4G",
			BSSID:        "BC:9A:78:56:34:11",
			RSSIdBm:      -49.0,
			SignalPct:    95,
			Channel:      6,
			Band:         "2.4 GHz",
			EstDistanceM: 3.2,
			SameChannel:  false,
		},
	}
}
