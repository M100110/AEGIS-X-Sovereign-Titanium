package winapi

// NativeMetricData holds pure Win32 DLL telemetry collected in <0.3ms with ZERO subprocesses.
type NativeMetricData struct {
	CPUIdleTicks   uint64
	CPUKernelTicks uint64
	CPUUserTicks   uint64
	RAMTotalBytes  uint64
	RAMAvailBytes  uint64
	RAMLoadPct     uint32
	UptimeSeconds  uint64
	IsAdmin        bool
	PendingReboot  bool
	CPUModel       string
	OSCaption      string
	OSBuildNumber  string
	Disks          []NativeDisk
	Processes      []NativeProc
	IfCounters     map[uint32][2]uint64 // IfIndex -> [RxOctets, TxOctets]
}

type NativeDisk struct {
	Drive      string
	Label      string
	FileSystem string
	TotalBytes uint64
	FreeBytes  uint64
}

type NativeProc struct {
	PID        int
	PPID       int
	Threads    int
	Name       string
	WorkingMB  float64
	CPUPercent float64
}

type NativeSocketRow struct {
	Proto      string
	LocalIP    string
	LocalPort  int
	RemoteIP   string
	RemotePort int
	State      string
	PID        int
	ProcName   string
}

type ARPEntry struct {
	IP  string `json:"ip"`
	MAC string `json:"mac"`
	Typ string `json:"type"`
}

// RouteGatewayInfo captures the true OS default gateway & primary LAN interface from iphlpapi.GetIpForwardTable.
type RouteGatewayInfo struct {
	GatewayIP     string `json:"gateway_ip"`
	LocalIP       string `json:"local_ip"`
	SubnetCIDR    string `json:"subnet_cidr"`
	SubnetMask    string `json:"subnet_mask"`
	InterfaceIdx  int    `json:"interface_idx"`
	InterfaceName string `json:"interface_name"`
	LocalMAC      string `json:"local_mac"`
	Metric        int    `json:"metric"`
}

// WifiRadioMetrics captures live 802.11 RF telemetry via wlanapi.dll (or Linux wireless fallback).
type WifiRadioMetrics struct {
	Connected      bool    `json:"connected"`
	InterfaceDesc  string  `json:"interface_desc"`
	SSID           string  `json:"ssid"`
	BSSID          string  `json:"bssid"`
	SignalQuality  int     `json:"signal_quality"` // 0 - 100%
	RSSIdBm        float64 `json:"rssi_dbm"`       // Estimated or direct dBm (-30 to -95)
	RxRateMbps     float64 `json:"rx_rate_mbps"`
	TxRateMbps     float64 `json:"tx_rate_mbps"`
	Channel        int     `json:"channel"`
	FrequencyBand  string  `json:"frequency_band"` // 2.4 GHz / 5 GHz / 6 GHz / Ethernet
	ConnectionType string  `json:"connection_type"`
}

// NearbyWifiAP represents a neighboring wireless Access Point / Router BSSID detected in the RF field around the user's PC/Router.
type NearbyWifiAP struct {
	SSID          string  `json:"ssid"`
	BSSID         string  `json:"bssid"`
	RSSIdBm       float64 `json:"rssi_dbm"`
	SignalPct     int     `json:"signal_pct"`
	Channel       int     `json:"channel"`
	Band          string  `json:"band"`
	EstDistanceM  float64 `json:"est_distance_m"`
	SameChannel   bool    `json:"same_channel"`
}

type StartupItem struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Command  string `json:"command"`
	Location string `json:"location"`
	Hive     string `json:"hive"`
	Enabled  bool   `json:"enabled"`
}

// TrayCallbacks wires user actions from the Windows System Tray (Notification Area) right-click menu.
type TrayCallbacks struct {
	OnOpenDashboard func()
	OnQuickSelfHeal func()
	OnCopyURL       func()
	OnExit          func()
}

// RawPacketEvent represents a live IPv4 TCP packet header captured at the kernel IP layer via Winsock SIO_RCVALL (or Linux AF_INET raw).
type RawPacketEvent struct {
	SrcIP      string
	DstIP      string
	SrcPort    int
	DstPort    int
	TCPFlags   byte // Raw TCP flags byte (0x02=SYN, 0x01=FIN, 0x04=RST, 0x10=ACK, 0x29=FIN+PSH+URG Xmas, 0x00=NULL)
	FlagsStr   string
	WindowSize int
	TTL        int
	PacketLen  int
}
