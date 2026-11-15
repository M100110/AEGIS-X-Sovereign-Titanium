package lanradar

import (
	"strings"
	"testing"
)

func TestFullIEEEOUIDatabaseAndVirtualMeshResolution(t *testing.T) {
	total := TotalOUIPrefixes()
	if total < 54000 {
		t.Fatalf("expected >= 54,000 embedded IEEE OUI prefixes, got %d", total)
	}

	cases := []struct {
		mac      string
		expected string
	}{
		// User's exact real router MAC from screenshot (previously missed!)
		{"A4:6C:24:76:11:E0", "Huawei"},
		// User's exact TP-Link repeater MAC from screenshot
		{"50:3D:D1:12:DA:14", "TP-Link"},
		// User's exact Dell PC MAC from screenshot
		{"18:66:DA:28:B1:11", "Dell"},
		// User's virtual mesh repeater MAC (CC:28:AC -> clears UAA bit -> C8:28:AC or virtual translation)
		{"52:3D:D1:12:DA:15", "TP-Link"},
	}

	for _, tc := range cases {
		vendor, _, _ := LookupMACVendor(tc.mac)
		if !strings.Contains(strings.ToLower(vendor), strings.ToLower(tc.expected)) {
			t.Errorf("MAC %s: expected vendor containing %q, got %q", tc.mac, tc.expected, vendor)
		}
	}
}
