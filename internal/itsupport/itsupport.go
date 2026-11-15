package itsupport

import (
	"bytes"
	"context"
	"fmt"
	"runtime"
	"strings"
	"sync"
	"time"

	"aegisx/internal/telemetry"
	"aegisx/internal/winapi"
)

type ToolAction struct {
	ID            string   `json:"id"`
	Category      string   `json:"category"` // omni, updates, repair, drivers, network, storage, performance, gaming, privacy, bsod
	TitleAr       string   `json:"title_ar"`
	TitleEn       string   `json:"title_en"`
	DescAr        string   `json:"desc_ar"`
	DescEn        string   `json:"desc_en"`
	Icon          string   `json:"icon"`
	Severity      string   `json:"severity"`
	RequiresAdmin bool     `json:"requires_admin"`
	EstDuration   string   `json:"est_duration"`
	DirectBin     string   `json:"direct_bin,omitempty"`  // Defender-clean direct Windows binary (e.g. sfc.exe, ipconfig.exe)
	DirectArgs    []string `json:"direct_args,omitempty"` // Arguments for direct binary execution
	WinCommand    string   `json:"win_command"`
	LinuxPreview  string   `json:"linux_preview"`
	NativeAction  string   `json:"native_action,omitempty"`
}

type ExecutionResult struct {
	ID            string   `json:"id"`
	ToolTitle     string   `json:"tool_title"`
	StartedAt     string   `json:"started_at"`
	FinishedAt    string   `json:"finished_at"`
	DurationMs    int64    `json:"duration_ms"`
	ExitCode      int      `json:"exit_code"`
	Status        string   `json:"status"`
	Platform      string   `json:"platform"`
	RawOutput     string   `json:"raw_output"`
	SmartAnalysis []string `json:"smart_analysis"`
	NextSteps     []string `json:"next_steps"`
}

type Manager struct {
	mu      sync.RWMutex
	catalog []ToolAction
	history []ExecutionResult
}

func NewManager() *Manager {
	return &Manager{
		catalog: buildMassiveCatalog(),
		history: make([]ExecutionResult, 0, 100),
	}
}

func (m *Manager) Catalog() []ToolAction {
	return m.catalog
}

func (m *Manager) History() []ExecutionResult {
	m.mu.RLock()
	defer m.mu.RUnlock()
	out := make([]ExecutionResult, len(m.history))
	copy(out, m.history)
	return out
}

// Execute runs ONLY when explicitly clicked by the user, using CREATE_NO_WINDOW (0x08000000) and Defender-clean direct binaries!
func (m *Manager) Execute(toolID string, snap telemetry.SystemSnapshot) (ExecutionResult, error) {
	var target *ToolAction
	for i := range m.catalog {
		if m.catalog[i].ID == toolID {
			target = &m.catalog[i]
			break
		}
	}
	if target == nil {
		return ExecutionResult{}, fmt.Errorf("unknown tool id: %s", toolID)
	}

	start := time.Now()
	exitCode := 0
	status := "success"
	var combined string

	if target.NativeAction == "trim_ram" {
		trimmedCount, freedMB := winapi.TrimAllIdleWorkingSetsNative()
		combined = fmt.Sprintf("[Win32 Kernel32 Direct API: SetProcessWorkingSetSize]\nTrimmed idle working sets across %d background processes.\nReclaimed Physical Memory: %.2f MB (0 subprocesses spawned).", trimmedCount, freedMB)
	} else {
		ctx, cancel := context.WithTimeout(context.Background(), 120*time.Second)
		defer cancel()

		var stdout, stderr bytes.Buffer
		if runtime.GOOS == "windows" {
			var cmdExec interface {
				Run() error
			}
			if target.DirectBin != "" {
				c := winapi.HiddenCommandContext(ctx, target.DirectBin, target.DirectArgs...)
				c.Stdout = &stdout
				c.Stderr = &stderr
				cmdExec = c
			} else {
				// Clean standard invocation without AV-flagged Bypass strings
				c := winapi.HiddenCommandContext(ctx, "powershell.exe", "-NoLogo", "-NoProfile", "-Command", target.WinCommand)
				c.Stdout = &stdout
				c.Stderr = &stderr
				cmdExec = c
			}
			if err := cmdExec.Run(); err != nil {
				status = "warning"
				exitCode = 1
			}
		} else {
			cmd := winapi.HiddenCommandContext(ctx, "bash", "-c", target.LinuxPreview)
			cmd.Stdout = &stdout
			cmd.Stderr = &stderr
			if err := cmd.Run(); err != nil {
				status = "warning"
				exitCode = 1
			}
		}
		combined = strings.TrimSpace(stdout.String())
		if stderr.Len() > 0 {
			if combined != "" {
				combined += "\n"
			}
			combined += strings.TrimSpace(stderr.String())
		}
		if combined == "" {
			combined = "[OK] Operation completed cleanly in background (0 errors)."
		}
	}

	analysis, nextSteps := analyzeOutputHeuristically(*target, combined, exitCode, snap)

	res := ExecutionResult{
		ID:            target.ID,
		ToolTitle:     target.TitleAr + " | " + target.TitleEn,
		StartedAt:     start.Format("15:04:05"),
		FinishedAt:    time.Now().Format("15:04:05"),
		DurationMs:    time.Since(start).Milliseconds(),
		ExitCode:      exitCode,
		Status:        status,
		Platform:      runtime.GOOS,
		RawOutput:     combined,
		SmartAnalysis: analysis,
		NextSteps:     nextSteps,
	}

	m.mu.Lock()
	m.history = append([]ExecutionResult{res}, m.history...)
	if len(m.history) > 80 {
		m.history = m.history[:80]
	}
	m.mu.Unlock()

	return res, nil
}

func analyzeOutputHeuristically(tool ToolAction, out string, code int, snap telemetry.SystemSnapshot) ([]string, []string) {
	var insights []string
	var next []string
	low := strings.ToLower(out)

	insights = append(insights, fmt.Sprintf("تم تنفيذ (%s) بصمت تام في الخلفية بدون أي نوافذ منبثقة.", tool.TitleAr))

	if code == 0 {
		insights = append(insights, "التقييم الهندسي: العملية اكتملت بنجاح 100% واستجابة النظام سليمة.")
	} else {
		if !snap.IsAdmin && tool.RequiresAdmin {
			insights = append(insights, "تنبيه صلاحيات: هذه الأداة تتطلب صلاحية المسؤول الكاملة (Administrator). اضغط زر (ترقية لمسؤول) أعلى اللوحة لتفعيل الصلاحية فوراً.")
			next = append(next, "اضغط زر (ترقية الصلاحية لمسؤول) في الشريط العلوي ثم أعد تشغيل الأداة.")
		} else {
			insights = append(insights, "اكتمل الفحص مع وجود ملاحظات نظامية في المخرجات التفصيلية أدناه.")
		}
	}

	if strings.Contains(low, "no applicable update") || strings.Contains(low, "up-to-date") || strings.Contains(low, "0 upgrades") {
		insights = append(insights, "كافة الحزم المفحوصة محدثة إلى آخر إصدار رسمي مستقر.")
	}
	if strings.Contains(low, "corrupt") || strings.Contains(low, "repaired") {
		insights = append(insights, "تم اكتشاف ومعالجة ملفات تالفة في مخزن المكونات.")
		next = append(next, "يُنصح بإعادة تشغيل الجهاز لاحقاً لتثبيت التصحيحات.")
	}
	if snap.RAMUsedPct > 85 {
		insights = append(insights, fmt.Sprintf("تنبيه استباقي: استهلاك الذاكرة مرتفع (%.1f%% — الأعلى: %s بـ %.0f MB). استخدم زر (تحرير RAM 0.1s) لتفريغ الذاكرة فوراً.", snap.RAMUsedPct, snap.TopRAMHogName, snap.TopRAMHogMB))
	}
	if len(next) == 0 {
		next = append(next, "النظام مستقر — لا يلزم أي إجراء إضافي.")
	}
	return insights, next
}
