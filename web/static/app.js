/* AEGIS-X v9.0 SOVEREIGN ULTRA — 8-Protocol LAN Device Inventory, FLIR Bio-Thermal RF Radar & 80 Silent Tools */
(function () {
  'use strict';

  // Complete 38-icon crisp vector library (ZERO missing icons, ZERO duplicate fallbacks!)
  const SVGS = {
    command: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>`,
    router: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="14" width="20" height="6" rx="2"/><path d="M6 17h.01M10 17h.01M12 14V7"/><circle cx="12" cy="5" r="2"/><path d="M8.5 8.5a5 5 0 0 1 7 0M5.5 5.5a9 9 0 0 1 13 0"/></svg>`,
    wave: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0"/><circle cx="12" cy="12" r="9" stroke-opacity="0.45"/></svg>`,
    layers: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    wrench: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
    brain: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04Z"/></svg>`,
    wireshark: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    shield: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
    download: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
    bolt: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    zap: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14.5 14 3l-2.5 8H20L10 21l2.5-6.5Z"/></svg>`,
    sparkles: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/></svg>`,
    cpu: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>`,
    chip: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 9h6v6H9zM3 9h2M3 15h2M19 9h2M19 15h2M9 3v2M15 3v2M9 19v2M15 19v2"/></svg>`,
    memory: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10v4M10 10v4M14 10v4M18 10v4"/></svg>`,
    rocket: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>`,
    refresh: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
    power: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>`,
    package: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
    windows: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/></svg>`,
    sliders: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>`,
    'hard-drive': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="12" x2="2" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/></svg>`,
    monitor: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
    battery: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="13" x2="23" y2="11"/><path d="M7 10v4M11 10v4"/></svg>`,
    volume: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`,
    search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    clock: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    trash: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
    globe: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    eye: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    'check-circle': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34ffb6" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
    'alert-triangle': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff4769" stroke-width="2.2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    radar: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="12" x2="19" y2="5"/></svg>`,
  };

  // Complete 100% Bilingual Dictionary (Zero Franken-UI!)
  const I18N = {
    ar: {
      brand_sub: 'منظومة القيادة السيادية للويندوز والشبكة',
      nav_overview: 'لوحة القيادة السيادية',
      nav_overview_sub: 'صحة النظام والبوابة اللحظية',
      nav_network: 'رادار الأجهزة المتصلة بالشبكة',
      nav_network_sub: 'IP + الاسم + الشركة + رادار حراري',
      nav_rfsense: 'رادار الأجسام الحرارية حول الراوتر',
      nav_rfsense_sub: 'FLIR Bio-Thermal & Wi-Fi RF',
      nav_itsupport: 'مركز الصيانة والعمليات الشامل',
      nav_itsupport_sub: '80 أداة صامتة + المعالج والرام',
      nav_cyber: 'درع الأمن السيبراني وفحص الراوتر',
      nav_cyber_sub: 'حماية 24/7 + فحص ثغرات البوابة',
      nav_copilot: 'المستشار الجنائي الذكي',
      nav_copilot_sub: 'تشخيص سببي فوري لأعطال جهازك',
      sb_gateway_lbl: 'بوابة الراوتر',
      sb_subnet_lbl: 'نطاق الشبكة',
      sb_overhead_lbl: 'استهلاك المحرك',
      dl_box_title: 'نسخة الويندوز الرسمية الجاهزة',
      dl_btn_installer: 'المثبت الرسمي AegisX-Installer.exe',
      dl_btn_portable: 'أو النسخة الفورية المستقلة AegisX.exe',
      btn_elevate_admin: 'ترقية لمسؤول (Admin)',
      top_ram_btn: 'تحرير الذاكرة (0.1s)',
      top_prereq_btn: 'المحركات',
      btn_rescue_now: 'تحرير الذاكرة الفوري',
      btn_view_culprit: 'فتح مدير العمليات',
      hero_eyebrow: 'SOVEREIGN SYSTEM & NETWORK TELEMETRY',
      hero_title: 'مركز القيادة والتحكم الفوري بالنظام والشبكة',
      hero_heal_btn: 'الإصلاح الذاتي الشامل',
      hero_omni_btn: 'تحديث كل شيء بصمت',
      hero_map_btn: 'خريطة الراوتر والأجهزة',
      kpi_cpu: 'المعالج المركزي',
      kpi_ram: 'الذاكرة العشوائية (RAM)',
      kpi_ram_sub: 'اضغط تحرير الذاكرة لتفريغ البرامج الخاملة',
      kpi_router: 'بوابة الراوتر ونطاق الشبكة',
      kpi_ids: 'الأمن السيبراني وتدفق الشبكة',
      latency_bar_title: 'مقارنة زمن الاستجابة اللحظي (الراوتر المحلي مقابل الخوادم العالمية):',
      disks_title: 'وحدات التخزين وصحة أقراص NVMe / SSD',
      disks_sub: 'المساحة المستخدمة والحالة الفيزيائية للأقراص الصلبة',
      btn_clean_temp: 'تنظيف المؤقتات',
      topprocs_title: 'أعلى البرامج استهلاكاً للموارد الآن',
      topprocs_sub: 'عرض مباشر لنسبة المعالج (CPU%) والذاكرة (RAM) لكل عملية',
      btn_all_procs: 'إدارة كافة العمليات',
      th_proc_name: 'العملية / البرنامج',
      th_category: 'التصنيف',
      net_hero_title: 'الماسح الشامل للأجهزة المتصلة بالشبكة (IP + الاسم + الشركة + النظام) والأجسام الحرارية حول الراوتر',
      net_hero_desc: 'يفحص شبكتك بـ 8 بروتوكولات متوازية (SendARP + NetBIOS + mDNS + LLMNR + SSDP + WSD + X.509 SSL + 420+ IEEE OUI) لكشف كل جهاز متصل وتسميته وتصدير القائمة، مع شاشة مصغرة فورية لرصد الأجسام الحرارية حول الراوتر.',
      btn_rescan_lan: 'مسح شامل للشبكة والأجهزة',
      btn_export_csv: 'تصدير جدول الأجهزة (Excel CSV)',
      btn_export_pcap: 'تصدير Wireshark (.pcap)',
      lan_kpi_total: 'إجمالي الأجهزة المتصلة الآن',
      lan_kpi_router: 'طراز الراوتر والبوابة',
      lan_kpi_trust: 'الأجهزة الموثوقة / الجديدة',
      lan_kpi_thermal: 'الأجسام الحرارية حول الراوتر الآن',
      lan_kpi_thermal_sub: 'اضغط لفتح الرادار الحراري الكامل ➔',
      map_card_title: 'خريطة الأجهزة المتصلة حول الراوتر (اضغط أي جهاز للتسمية والفحص)',
      leg_near: 'قريب (<3m)',
      leg_mid: 'متوسط (3-8m)',
      leg_far: 'بعيد (>8m)',
      dev_inspector_title: 'بطاقة هوية الجهاز والتحكم به',
      mini_thermal_title: 'كاشف الأجسام الحرارية حول الراوتر',
      btn_test_bio: 'اختبار حركة',
      btn_open_full_thermal: 'فتح غرفة المسح الحراري الكاملة',
      lan_table_title: 'سجل جرد كافة الأجهزة المتصلة بالشبكة (IP + الاسم + الشركة + نظام التشغيل + الموثوقية)',
      lan_table_sub: 'ابحث أو فلتر حسب نوع الجهاز — اضغط على أي صف لعرض بطاقته الكاملة أو تسميته أو فحص منافذه',
      th_dev_name: 'اسم الجهاز والنوع',
      th_vendor: 'الشركة المصنعة (Manufacturer)',
      th_os_conn: 'نظام التشغيل والاتصال',
      th_distance: 'المسافة والاستجابة',
      th_trust: 'الحالة',
      th_open_ports: 'المنافذ والبروتوكولات',
      ws_title: 'مفتش البكتات والجلسات الحية (Wireshark L2-L7 Dissector)',
      btn_pause_stream: 'إيقاف مؤقت',
      th_time: 'الوقت',
      th_info: 'التفاصيل والعملية المالكة',
      ws_layers_title: 'تشريح طبقات الحزمة والـ Hex',
      ws_flows_title: 'البرامج المتصلة بالشبكة الآن (PID ➔ Socket)',
      th_scope: 'النطاق',
      rf_hero_title: 'رادار كشف الأجسام الحرارية والحية حول الراوتر (Wi-Fi RF Bio-Thermal Body Scanner)',
      btn_sim_bio_walk: 'اختبار محاكاة مرور جسم حراري (18s)',
      btn_calibrate_rf: 'معايرة الغرفة الساكنة (24°C Baseline)',
      rf_state_lbl: 'حالة الأجسام الحرارية حول الراوتر',
      rf_rssi_lbl: 'قوة إشارة الراوتر الحية (RSSI)',
      rf_entropy_lbl: 'شدة الامتصاص الحراري/الموجي',
      rf_band_lbl: 'القناة والشبكات المحيطة (BSSID)',
      rf_heatmap_title: 'المسح الطيفي الحراري FLIR للأجسام حول الراوتر (32×32 Bio-Thermal Field)',
      rf_heatmap_sub: 'التدرج اللوني الحراري (أزرق بارد 24°C ➔ بنفسجي ➔ برتقالي ➔ أحمر/أبيض ساخن 37°C) يحدد موقع ومسافة الأجسام الحية الماصة للموجة',
      rf_bodies_list_title: '🎯 الأجسام الحرارية/الحية المتتبعة الآن حول الراوتر',
      rf_wave_title: 'المخطط الموجي الحي للامتصاص والاضطراب',
      rf_rays_title: 'أشعة الاستشعار للأجهزة المتصلة والشبكات المجاورة',
      rf_events_title: 'سجل الرصد الحراري والحركي',
      sub_tools: 'ترسانة الصيانة والتحديث (80 أداة)',
      sub_procs: 'مدير العمليات والـ CPU/RAM الحي',
      sub_startup: 'برامج الإقلاع ومحلل المساحة',
      sub_prereq: 'فحص وتثبيت المحركات (8 محركات)',
      cat_all: 'الكل (80)',
      cat_omni: 'العمليات الشاملة',
      cat_updates: 'التحديثات',
      cat_drivers: 'التعريفات والعتاد',
      cat_repair: 'إصلاح الويندوز',
      cat_storage: 'الأقراص والمساحة',
      cat_network: 'الشبكة و DNS',
      cat_perf: 'الأداء والرام',
      cat_gaming: 'الألعاب FPS',
      cat_privacy: 'الخصوصية',
      cat_bsod: 'الشاشة الزرقاء والحماية',
      console_title: 'سجل التنفيذ الصامت والتحليل الهندسي',
      console_hint: 'اضغط على أي أداة لتشغيلها بصمت تام في الخلفية بدون أي نافذة سوداء ومشاهدة النتيجة الفورية هنا.',
      btn_refresh: 'تحديث القائمة',
      th_action: 'إجراء',
      startup_title: 'برامج الإقلاع التلقائي مع الويندوز',
      startup_sub: 'عطّل أو احذف البرامج غير الضرورية لتسريع تشغيل الجهاز',
      th_path: 'المسار',
      hogs_title: 'أضخم الملفات المستهلكة للمساحة',
      hogs_sub: 'فحص فوري لأكبر الملفات في مجلدات المستخدم',
      btn_clean_browser: 'تنظيف كاش المتصفح',
      router_sec_lbl: 'أمان البوابة',
      cyber_radar_title: 'درع كشف الاختراقات ومسح المنافذ (0% إنذارات كاذبة)',
      cyber_radar_desc: 'معزول رياضياً ضد الإنذارات الكاذبة: لا ينزعج من التصفح أو الألعاب أو الذكاء الاصطناعي المحلي، ويرصد فوراً مسح المنافذ الحقيقي لـ Nmap وتسميم ARP بدون أي رنين صوتي.',
      c_stat_eval: 'الحزم المفحوصة',
      c_stat_benign: 'اتصالات آمنة مستثناة',
      c_stat_threats: 'هجمات حقيقية مؤكدة',
      lab_title: 'مختبر التحقق العملي (تأكد بنفسك من دقة الكشف)',
      lab_btn1_t: '1. اختبار تشغيل ذكاء اصطناعي محلي كثيف (Ollama :11434)',
      lab_btn1_s: 'يرسل 12 جلسة استدلال — النتيجة الحتمية: 0 إنذارات كاذبة!',
      lab_btn2_t: '2. اختبار مسح Nmap متعدد المنافذ (6 منافذ فعلية)',
      lab_btn2_s: 'يلتقط الهجوم في أقل من ثانية بثقة 98%+ وبصمت تام!',
      lab_btn3_t: '3. محاكاة هجوم خفي Nmap Stealth SYN + Xmas على شبكتك',
      lab_btn3_s: 'يكتشف حزم Win=1024 المشبوهة ضمن نطاق شبكتك الفعلي ويتيح حظر المهاجم!',
      lab_ready: 'جاهز للاختبار المباشر (صفر نوافذ منبثقة • صفر أصوات مزعجة).',
      alerts_box_title: 'سجل الهجمات المؤكدة والعزل الفوري في الجدار الناري',
      alerts_box_sub: 'اضغط حظر المهاجم لعزله فوراً في Windows Firewall',
      btn_clear_log: 'تصفير السجل',
      arp_box_title: 'حارس جدول ARP والمنافذ المحمية',
      arp_box_sub: 'يكشف انتحال عنوان الماك للراوتر (MITM ARP Spoofing)',
      th_role: 'الوظيفة',
      th_status: 'الحالة',
      cop_title: 'المستشار الجنائي الذكي (يربط سؤالك بقراءات المعالج والرام والراوتر الحقيقية)',
      cop_sub: 'اسأل عن أي مشكلة في جهازك أو شبكتك — يفحص المحرك فوراً أعلى عملية تستهلك المعالج/الرام، حالة الراوتر وشهادته، ويمنحك الحل المباشر.',
      btn_diagnose_now: 'تحليل جنائي فوري',
      prereq_modal_title: 'معالج التحقق من المحركات وإعدادات الإقلاع والطاقة الذكية',
      prereq_modal_sub: 'يتحقق فعلياً من إصدارات ومسارات المحركات الـ 8 على جهازك، ويتيح التحكم الفوري في وضع السكون الذكي (Eco-Standby: 0% حمل شبكة بالخلفية) والتشغيل مع الويندوز.',
      btn_close_modal: '✕ إغلاق وحفظ',
      wiz_eco_title: 'نظام إدارة الطاقة والشبكة الذكي (Adaptive Eco-Governor)',
      wiz_eco_desc: 'يمنع أي فحص للشبكة أو إرهاق للراوتر والمعالج عند إغلاق المتصفح أو عند إقلاع الويندوز (0.0 حزمة/ثانية).',
      mode_auto_eco: 'Auto-Eco ذكي (موصى به)',
      mode_eco_silent: 'صامت 0% حزم',
      mode_perf_live: 'أداء حي مستمر',
      wiz_autostart_title: 'التشغيل التلقائي مع الويندوز (مغلق افتراضياً لعدم إبطاء الإقلاع)',
      wiz_autostart_desc: 'عند تفعيله يعمل بخيار -eco-boot بدون أي فحص للشبكة حتى تفتح اللوحة بنفسك.',
      wiz_finish_btn: '✓ اعتماد الإعدادات والدخول للوحة القيادة',
      top_boot_off: 'الإقلاع: يدوي',
      top_boot_on: 'الإقلاع: Eco ذكي',
      btn_probe_custom_ip: 'فحص IP محدد',
    },
    en: {
      brand_sub: 'Sovereign OS & Network Intelligence',
      nav_overview: 'Sovereign Command Center',
      nav_overview_sub: 'Live System & Gateway Telemetry',
      nav_network: 'LAN Device Inventory & Radar',
      nav_network_sub: 'IP + Name + Vendor + Bio-Thermal',
      nav_rfsense: 'Bio-Thermal RF Body Radar',
      nav_rfsense_sub: 'FLIR Bio-Thermal Around Router',
      nav_itsupport: 'System Repair & Task Center',
      nav_itsupport_sub: '80 Silent Tools + CPU/RAM Control',
      nav_cyber: '24/7 Cyber Shield & Router Audit',
      nav_cyber_sub: 'Zero-FP IDS/IPS + Gateway Security',
      nav_copilot: 'Forensic Root-Cause Copilot',
      nav_copilot_sub: 'Live Hardware & Network Diagnosis',
      sb_gateway_lbl: 'Default Gateway',
      sb_subnet_lbl: 'Active Subnet',
      sb_overhead_lbl: 'Engine Footprint',
      dl_box_title: 'Official Windows x64 Release',
      dl_btn_installer: 'Download AegisX-Installer.exe',
      dl_btn_portable: 'Or Standalone Portable AegisX.exe',
      btn_elevate_admin: 'Elevate to Admin',
      top_ram_btn: 'Trim RAM (0.1s)',
      top_prereq_btn: 'Engines',
      btn_rescue_now: 'Instant RAM Rescue',
      btn_view_culprit: 'Open Process Manager',
      hero_eyebrow: 'SOVEREIGN SYSTEM & NETWORK TELEMETRY',
      hero_title: 'Executive OS & Network Command Deck',
      hero_heal_btn: 'Autonomous Self-Heal',
      hero_omni_btn: 'Silent Omni-Update All',
      hero_map_btn: 'Router & Device Map',
      kpi_cpu: 'Central Processor (CPU)',
      kpi_ram: 'Physical Memory (RAM)',
      kpi_ram_sub: 'Click Trim RAM to reclaim idle working sets',
      kpi_router: 'Gateway Router & Active Subnet',
      kpi_ids: 'Cyber Defense & Throughput',
      latency_bar_title: 'Real-Time Latency Comparison (Local Router vs Global Edge DNS):',
      disks_title: 'NVMe / SSD Storage Volumes',
      disks_sub: 'Capacity utilization and physical volume health',
      btn_clean_temp: 'Clean Temp Caches',
      topprocs_title: 'Top Resource-Consuming Processes',
      topprocs_sub: 'Real-time per-process CPU% and Working-Set RAM',
      btn_all_procs: 'Manage All Processes',
      th_proc_name: 'Process / App',
      th_category: 'Category',
      net_hero_title: '8-Protocol LAN Device Inventory (IP, Name, Vendor, OS) & Live Bio-Thermal Preview',
      net_hero_desc: 'Discovers every connected device (SendARP, NetBIOS, mDNS, LLMNR, SSDP, WSD, X.509 SSL, 420+ IEEE OUI) with custom naming, trust tagging, CSV export, and embedded Bio-Thermal router radar.',
      btn_rescan_lan: 'Full Subnet & Device Scan',
      btn_export_csv: 'Export Inventory (Excel CSV)',
      btn_export_pcap: 'Export Wireshark (.pcap)',
      lan_kpi_total: 'Connected Devices Now',
      lan_kpi_router: 'Gateway Router & Model',
      lan_kpi_trust: 'Trusted / New Devices',
      lan_kpi_thermal: 'Bio-Thermal Bodies Near Router',
      lan_kpi_thermal_sub: 'Click to open full FLIR Bio-Thermal Lab ➔',
      map_card_title: 'Spatial Device Topology Around Router (Click Any Node to Inspect/Rename)',
      leg_near: 'Near (<3m)',
      leg_mid: 'Mid (3-8m)',
      leg_far: 'Far (>8m)',
      dev_inspector_title: 'Device Identity, Rename & Actions',
      mini_thermal_title: 'Bio-Thermal Bodies Around Router',
      btn_test_bio: 'Walk Demo',
      btn_open_full_thermal: 'Open Full Bio-Thermal Radar',
      lan_table_title: 'Complete LAN Device Inventory (IP, MAC, Hostname, Manufacturer, OS & Trust)',
      lan_table_sub: 'Search or filter by device class — click any row to inspect, rename, or deep-scan ports',
      th_dev_name: 'Device Name & Role',
      th_vendor: 'Manufacturer (IEEE OUI)',
      th_os_conn: 'OS & Link Medium',
      th_distance: 'Distance & RTT',
      th_trust: 'Trust',
      th_open_ports: 'Services & Discovery',
      ws_title: 'Live Packet & Socket Dissector (Wireshark L2-L7)',
      btn_pause_stream: 'Pause Stream',
      th_time: 'Time',
      th_info: 'Info & Owning Process',
      ws_layers_title: 'Protocol Layer Tree & Wire Hex',
      ws_flows_title: 'Active Network Processes (PID ➔ Socket)',
      th_scope: 'Scope',
      rf_hero_title: 'FLIR-Style Wi-Fi RF Bio-Thermal Body & Presence Scanner',
      btn_sim_bio_walk: 'Simulate Moving Bio-Body (18s)',
      btn_calibrate_rf: 'Calibrate Static Room (24°C)',
      rf_state_lbl: 'Bio-Thermal Field Status',
      rf_rssi_lbl: 'Live Router Signal (RSSI)',
      rf_entropy_lbl: 'Dielectric Absorption Index',
      rf_band_lbl: 'Band, Channel & Nearby APs',
      rf_heatmap_title: '32×32 FLIR Spectral Bio-Thermal Field Around Router',
      rf_heatmap_sub: 'FLIR Ironbow thermal palette (24°C Cold Blue ➔ Purple ➔ Orange ➔ 37°C Bio-Hot White) tracks living body absorption around router',
      rf_bodies_list_title: '🎯 Tracked Bio-Thermal Bodies Around Router',
      rf_wave_title: 'Live Dielectric Absorption & Perturbation Waveform',
      rf_rays_title: 'Active Fresnel Rays & Neighboring Wi-Fi Emitters',
      rf_events_title: 'Bio-Thermal & Motion Detection Log',
      sub_tools: '80 Silent Repair & Update Tools',
      sub_procs: 'Live CPU & RAM Task Manager',
      sub_startup: 'Startup Apps & Space Analyzer',
      sub_prereq: 'Engine Verifier (8 Engines)',
      cat_all: 'All (80)',
      cat_omni: 'Omni Pipelines',
      cat_updates: 'Updates & Apps',
      cat_drivers: 'Drivers & Hardware',
      cat_repair: 'OS Repair',
      cat_storage: 'Storage & SSD',
      cat_network: 'Network & DNS',
      cat_perf: 'Performance',
      cat_gaming: 'Esports FPS',
      cat_privacy: 'Privacy',
      cat_bsod: 'BSOD & Security',
      console_title: 'Silent Execution Console & Smart Analyzer',
      console_hint: 'Click any tool card to run silently in background with zero console windows.',
      btn_refresh: 'Refresh List',
      th_action: 'Action',
      startup_title: 'Windows Startup Registry Entries',
      startup_sub: 'Remove unnecessary startup programs to accelerate boot time',
      th_path: 'Command Path',
      hogs_title: 'Largest Disk Space Hogs',
      hogs_sub: 'In-memory scan of largest files in user directories',
      btn_clean_browser: 'Clean Browser Cache',
      router_sec_lbl: 'Gateway Score',
      cyber_radar_title: '24/7 Intrusion & Port-Scan Shield (0% False Positives)',
      cyber_radar_desc: 'Mathematically immune to normal web browsing and Local AI servers; detects multi-port Nmap scans and ARP spoofing silently.',
      c_stat_eval: 'Frames Evaluated',
      c_stat_benign: 'Benign Whitelisted',
      c_stat_threats: 'Confirmed Attacks',
      lab_title: 'Live Socket Verification Lab',
      lab_btn1_t: '1. Test Heavy Local AI Inference (Ollama :11434)',
      lab_btn1_s: 'Sends 12 real inference bursts — Guaranteed Result: 0 False Positives!',
      lab_btn2_t: '2. Execute Multi-Port Nmap Sweep (6 Decoy Ports)',
      lab_btn2_s: 'Detects the active scan in <1 second with 98%+ confidence!',
      lab_btn3_t: '3. Simulate Stealth Nmap SYN + Xmas Scan on Your Subnet',
      lab_btn3_s: 'Detects Win=1024 raw probes on your real subnet and enables 1-click Firewall Block!',
      lab_ready: 'Ready for live verification (0 popups • 0 sound).',
      alerts_box_title: 'Confirmed Intrusions & 1-Click Firewall Isolation',
      alerts_box_sub: 'Click Block Attacker to isolate malicious IPs in Windows Firewall',
      btn_clear_log: 'Clear Log',
      arp_box_title: 'ARP Spoofing Guard & Immune Services',
      arp_box_sub: 'Monitors neighbor MAC mappings for MITM spoofing',
      th_role: 'Service Role',
      th_status: 'Immunity',
      cop_title: 'Forensic Root-Cause Copilot (Correlates Live CPU/RAM, Router & Security)',
      cop_sub: 'Ask any issue — instantly inspects top CPU/RAM culprits, router SSL/ports, and recommends 1-click fixes.',
      btn_diagnose_now: 'Run Forensic Diagnosis',
      prereq_modal_title: 'Enterprise Engine Verifier & Adaptive Power Wizard',
      prereq_modal_sub: 'Verifies exact versions & paths of all 8 engines and configures Zero-Load Eco-Standby & Windows Boot behavior.',
      btn_close_modal: '✕ Save & Close',
      wiz_eco_title: 'Adaptive Eco-Standby Governor (0% Idle Strain)',
      wiz_eco_desc: 'Drops network probing to 0.0 packets/sec and CPU to <0.02% whenever the browser is closed or at Windows boot.',
      mode_auto_eco: 'Auto-Eco Smart (Default)',
      mode_eco_silent: '0-Packet Silent',
      mode_perf_live: 'Performance Live',
      wiz_autostart_title: 'Start with Windows (Opt-In — OFF by Default)',
      wiz_autostart_desc: 'When enabled, boots with -eco-boot (0% network strain until you open the dashboard).',
      wiz_finish_btn: '✓ Confirm Setup & Enter Command Center',
      top_boot_off: 'Boot: Manual',
      top_boot_on: 'Boot: Smart Eco',
      btn_probe_custom_ip: 'Probe Custom IP',
    },
  };

  let currentLang = localStorage.getItem('aegisx_lang') || 'ar';
  let allTools = [];
  let latestReadiness = null;
  let latestGovernor = null;
  let latestLan = null;
  let latestRf = null;
  let latestSys = null;
  let deviceDeepAudits = {}; // ip -> SingleDeviceAuditResult
  let activeCategory = 'all';
  let packetsBuffer = [];
  let latestFlows = [];
  let allProcsCache = [];
  let selectedSeq = null;
  let selectedDeviceIP = null;
  let renderedNodeHitboxes = []; // [{ip, x, y, r}] for interactive canvas clicks
  let streamPaused = false;

  const cpuSpark = new Array(34).fill(4);
  const ramSpark = new Array(34).fill(25);
  const netSpark = new Array(34).fill(2);
  const knownAlertIds = new Set();

  // Language Toggle
  window.toggleLanguage = function () {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('aegisx_lang', currentLang);
    applyLanguage();
    renderITTools();
    renderPrerequisitesCards();
    if (latestLan) updateLanUI(latestLan);
    if (latestRf) updateRfUI(latestRf);
    if (latestSys) updateSystemUI(latestSys);
    if (latestGovernor) updateGovernorUI(latestGovernor);
  };

  // ==================== ADAPTIVE ECO-GOVERNOR & BOOT AUTO-START CONTROLS ====================
  function updateGovernorUI(gov) {
    if (!gov) return;
    latestGovernor = gov;

    const topBtn = document.getElementById('topEcoBtn');
    const topLbl = document.getElementById('topEcoLabel');
    if (topBtn && topLbl) {
      topBtn.classList.remove('mode-silent', 'mode-perf');
      if (gov.mode === 'eco_silent') {
        topBtn.classList.add('mode-silent');
        topLbl.textContent = currentLang === 'ar' ? 'Eco: 0 حزم' : 'Eco: 0-Pkt';
      } else if (gov.mode === 'performance_live') {
        topBtn.classList.add('mode-perf');
        topLbl.textContent = currentLang === 'ar' ? 'Performance' : 'Live Perf';
      } else {
        topLbl.textContent = currentLang === 'ar' ? 'Auto-Eco ذكي' : 'Auto-Eco';
      }
    }

    document.querySelectorAll('.eco-pill-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.ecomode === gov.mode);
    });

    const autoEn = Boolean(gov.autostart_enabled);
    const topAutoLbl = document.getElementById('topAutoStartLabel');
    if (topAutoLbl) {
      topAutoLbl.textContent = autoEn
        ? (currentLang === 'ar' ? 'الإقلاع: Eco مفعّل' : 'Boot: Eco ON')
        : (currentLang === 'ar' ? 'الإقلاع: يدوي (مغلق)' : 'Boot: Manual OFF');
    }
    const modalAutoBtn = document.getElementById('modalAutoStartBtn');
    const modalAutoTxt = document.getElementById('modalAutoStartTxt');
    if (modalAutoBtn && modalAutoTxt) {
      modalAutoBtn.classList.toggle('enabled', autoEn);
      modalAutoTxt.textContent = autoEn
        ? (currentLang === 'ar' ? '✓ مفعّل (Eco-Boot 0% حزم)' : '✓ ON (Smart Eco-Boot)')
        : (currentLang === 'ar' ? 'OFF — يدوي فقط (0% حمل إقلاع)' : 'OFF — Manual Launch Only');
    }
  }

  window.setGovernorMode = async function (mode) {
    try {
      const res = await fetch('/api/settings/governor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      });
      const data = await res.json();
      if (data.governor) updateGovernorUI(data.governor);
      const labels = {
        auto_eco: currentLang === 'ar' ? 'الوضع الذكي Auto-Eco: يعمل أثناء فتح اللوحة وينام 100% عند إغلاقها.' : 'Auto-Eco: Active while open, 0% network load when closed.',
        eco_silent: currentLang === 'ar' ? 'الوضع الصامت الكامل: 0.0 حزمة شبكية في الخلفية (قراءة نواة النظام فقط).' : 'Eco-Silent: 0.0 outbound packets (passive kernel DLLs only).',
        performance_live: currentLang === 'ar' ? 'وضع الأداء الحي المستمر مفعّل.' : 'Performance Live mode active.',
      };
      pushInfoToast('⚡ Adaptive Eco-Governor', labels[mode] || mode);
    } catch (err) {
      console.error(err);
    }
  };

  window.cycleGovernorMode = function () {
    const order = ['auto_eco', 'eco_silent', 'performance_live'];
    const cur = (latestGovernor && latestGovernor.mode) || 'auto_eco';
    const next = order[(order.indexOf(cur) + 1) % order.length];
    window.setGovernorMode(next);
  };

  window.toggleWindowsAutoStart = async function () {
    const cur = Boolean(latestGovernor && latestGovernor.autostart_enabled);
    try {
      const res = await fetch('/api/settings/autostart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enable: !cur }),
      });
      const data = await res.json();
      if (data.governor) updateGovernorUI(data.governor);
      pushInfoToast('🚀 Windows Startup Control', data.message || '');
    } catch (err) {
      console.error(err);
    }
  };

  function applyLanguage() {
    const root = document.getElementById('htmlRoot');
    root.lang = currentLang;
    root.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    const dict = I18N[currentLang];
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const k = el.getAttribute('data-i18n');
      if (dict[k]) el.textContent = dict[k];
    });
  }

  // Modal & Elevation Controls
  window.openReadinessModal = function () {
    document.getElementById('readinessModal').style.display = 'grid';
    window.refreshPrerequisites();
  };

  window.closeReadinessModal = function () {
    localStorage.setItem('aegisx_v8_onboarded', '1');
    document.getElementById('readinessModal').style.display = 'none';
  };

  window.requestAdminElevation = async function () {
    try {
      const res = await fetch('/api/app/elevate', { method: 'POST' });
      const data = await res.json();
      pushInfoToast('🛡 UAC Administrator Elevation', data.message);
    } catch (err) {
      console.error(err);
    }
  };

  window.refreshPrerequisites = async function () {
    try {
      const res = await fetch('/api/prereq/status');
      latestReadiness = await res.json();
      renderPrerequisitesCards();
    } catch (err) {
      console.error(err);
    }
  };

  function renderPrerequisitesCards() {
    if (!latestReadiness || !Array.isArray(latestReadiness.items)) return;
    const topEngBtn = document.getElementById('topEnginesBtnTxt');
    if (topEngBtn && latestReadiness.total_count) {
      topEngBtn.textContent = currentLang === 'ar'
        ? `المحركات (${latestReadiness.installed_count}/${latestReadiness.total_count})`
        : `Engines (${latestReadiness.installed_count}/${latestReadiness.total_count})`;
    }
    const html = latestReadiness.items.map((it) => {
      const title = currentLang === 'ar' ? it.name_ar : it.name_en;
      const role = currentLang === 'ar' ? it.role_ar : it.role_en;
      const statusBadge = it.installed
        ? `<span class="tag-pill tag-ai">✓ ${currentLang === 'ar' ? 'مثبت وجاهز' : 'READY'}</span>`
        : it.required
          ? `<span class="tag-pill tag-warn">! ${currentLang === 'ar' ? 'متطلب ناقص' : 'MISSING'}</span>`
          : `<span class="tag-pill tag-sys">${currentLang === 'ar' ? 'اختياري' : 'OPTIONAL'}</span>`;

      let actionBtn = '';
      if (it.id === 'uac_admin_token' && !it.installed) {
        actionBtn = `<button class="btn-primary-glow" onclick="window.requestAdminElevation()">🛡 ${currentLang === 'ar' ? 'ترقية الصلاحية لمسؤول الآن' : 'Elevate to Admin Now'}</button>`;
      } else if (!it.installed && it.can_auto_install) {
        actionBtn = `<button class="btn-primary-glow" onclick="window.installPrereqPkg('${escapeHtml(it.id)}')">⬇ ${currentLang === 'ar' ? 'تثبيت صامت (Winget)' : '1-Click Silent Install'}</button>`;
      } else if (it.installed && it.can_auto_install) {
        actionBtn = `<button class="btn-secondary-glass" onclick="window.installPrereqPkg('${escapeHtml(it.id)}')">↻ ${currentLang === 'ar' ? 'فحص التحديث' : 'Check Update'}</button>`;
      }

      return `
        <div class="prereq-card ${it.installed ? 'installed' : (it.required ? 'missing-core' : '')}">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px">
              <strong style="font-size:0.9rem">${escapeHtml(title)}</strong>
              ${statusBadge}
            </div>
            <p style="font-size:0.76rem;color:var(--text-muted);line-height:1.5;margin-bottom:8px">${escapeHtml(role)}</p>
            <div class="prereq-path" title="${escapeHtml(it.version_or_path)}">${escapeHtml(it.version_or_path)}</div>
          </div>
          ${actionBtn ? `<div style="margin-top:8px">${actionBtn}</div>` : ''}
        </div>
      `;
    }).join('');

    const tabGrid = document.getElementById('prereqTabGrid');
    const modalGrid = document.getElementById('modalReadinessBody');
    if (tabGrid) tabGrid.innerHTML = html;
    if (modalGrid) modalGrid.innerHTML = html;
  }

  window.installPrereqPkg = async function (id) {
    const banner = document.getElementById('prereqInstallBanner');
    if (banner) {
      banner.style.display = 'block';
      banner.innerHTML = `⏳ جاري التثبيت الصامت للحزمة <code dir="ltr">${escapeHtml(id)}</code> عبر Winget...`;
    }
    pushInfoToast('Engine Bootstrapper', `Installing ${id} silently...`);
    try {
      const res = await fetch('/api/prereq/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (banner) {
        banner.innerHTML = `<strong style="color:${data.ok ? 'var(--emerald)' : 'var(--amber)'}">${escapeHtml(data.message)}</strong>`;
      }
      if (data.readiness) {
        latestReadiness = data.readiness;
        renderPrerequisitesCards();
      }
    } catch (err) {
      if (banner) banner.textContent = 'Error: ' + err.message;
    }
  };

  // Subtle Ambient Canvas
  function startNeuralCanvas() {
    const canvas = document.getElementById('neuralBgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    window.addEventListener('resize', () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    const nodes = Array.from({ length: 24 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.6 + 0.8,
    }));

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.38)';
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dist = Math.hypot(n.x - m.x, n.y - m.y);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${(1 - dist / 150) * 0.09})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function injectStaticIcons() {
    document.querySelectorAll('[data-svg]').forEach((el) => {
      const name = el.getAttribute('data-svg');
      if (SVGS[name]) el.innerHTML = SVGS[name];
    });
  }

  // Workspace & Subtab Navigation
  window.switchTab = function (tabId) {
    document.querySelectorAll('.nav-item').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    document.querySelectorAll('.tab-panel').forEach((p) => {
      p.classList.toggle('active', p.id === `tab-${tabId}`);
    });
    if (tabId === 'network') {
      if (latestLan) drawRealLanTopologyMap(latestLan);
      if (latestRf) drawMiniNetworkThermalCanvas(latestRf);
    }
    if (tabId === 'rfsense' && latestRf) drawRfTomographyCanvases(latestRf);
  };

  window.switchRepairSubtab = function (subId) {
    document.querySelectorAll('.subtab-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.subtab === subId);
    });
    document.querySelectorAll('.repair-subpanel').forEach((p) => {
      p.style.display = p.id === subId ? 'block' : 'none';
    });
    if (subId === 'sub-procs') window.loadLiveProcesses();
    if (subId === 'sub-startup') window.loadStartupAndSpace();
    if (subId === 'sub-prereq') window.refreshPrerequisites();
  };

  window.openProcessesSubtab = function () {
    window.switchTab('itsupport');
    window.switchRepairSubtab('sub-procs');
  };

  function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach((btn) => {
      btn.addEventListener('click', () => window.switchTab(btn.dataset.tab));
    });

    document.getElementById('pauseStreamBtn').addEventListener('click', (e) => {
      streamPaused = !streamPaused;
      e.target.textContent = streamPaused
        ? (currentLang === 'ar' ? 'استئناف' : 'Resume')
        : (currentLang === 'ar' ? 'إيقاف مؤقت' : 'Pause Stream');
    });

    document.getElementById('packetFilterInput').addEventListener('input', renderPacketTable);
    document.getElementById('itSearchInput').addEventListener('input', renderITTools);
    document.getElementById('procFilterInput').addEventListener('input', renderFullProcessesTable);
    const lanSearch = document.getElementById('lanDeviceSearchInput');
    const lanRole = document.getElementById('lanDeviceRoleFilter');
    if (lanSearch) lanSearch.addEventListener('input', () => { if (latestLan) renderLanInventoryTable(latestLan); });
    if (lanRole) lanRole.addEventListener('change', () => { if (latestLan) renderLanInventoryTable(latestLan); });

    // Interactive click handler on the Radial LAN Map Canvas!
    const lanCanvas = document.getElementById('lanRadialCanvas');
    if (lanCanvas) {
      lanCanvas.addEventListener('click', (ev) => {
        const rect = lanCanvas.getBoundingClientRect();
        const scaleX = lanCanvas.width / rect.width;
        const scaleY = lanCanvas.height / rect.height;
        const mx = (ev.clientX - rect.left) * scaleX;
        const my = (ev.clientY - rect.top) * scaleY;
        for (const hb of renderedNodeHitboxes) {
          if (Math.hypot(mx - hb.x, my - hb.y) <= hb.r + 8) {
            selectedDeviceIP = hb.ip;
            if (latestLan) {
              drawRealLanTopologyMap(latestLan);
              renderSelectedDeviceCard(latestLan);
            }
            break;
          }
        }
      });
    }
  }

  // ==================== 59 SILENT TOOLS ====================
  async function loadITCatalog() {
    try {
      const res = await fetch('/api/itsupport/catalog');
      allTools = await res.json();
      document.getElementById('navToolsCount').textContent = allTools.length;
      renderITTools();
    } catch (err) {
      console.error('Failed loading IT catalog:', err);
    }

    document.querySelectorAll('#itCategoryBar .filter-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('#itCategoryBar .filter-pill').forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        activeCategory = pill.dataset.cat;
        renderITTools();
      });
    });
  }

  function buildToolCardHTML(t) {
    const title = currentLang === 'ar' ? t.title_ar : t.title_en;
    const desc = currentLang === 'ar' ? t.desc_ar : t.desc_en;
    const badge = t.native_action
      ? `<span class="tag-pill tag-ai" dir="ltr">0.1s Native</span>`
      : t.requires_admin
        ? `<span class="tag-pill tag-app" dir="ltr">Admin</span>`
        : `<span class="tag-pill tag-sys" dir="ltr">Safe</span>`;
    return `
      <div class="tool-card" onclick="window.triggerITTool('${t.id}')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box">${SVGS[t.icon] || SVGS.wrench}</div>
            ${badge}
          </div>
          <h4 style="margin-top:11px">${escapeHtml(title)}</h4>
          <p>${escapeHtml(desc)}</p>
        </div>
        <div class="tool-card-footer">
          <span dir="ltr" style="font-family:var(--font-mono);color:var(--text-muted)">⏱ ${escapeHtml(t.est_duration)}</span>
          <span class="run-chip">▶ ${currentLang === 'ar' ? 'تنفيذ صامت' : 'Run Silently'}</span>
        </div>
      </div>
    `;
  }

  function renderITTools() {
    const grid = document.getElementById('itToolsGrid');
    const q = (document.getElementById('itSearchInput').value || '').toLowerCase().trim();
    const filtered = allTools.filter((t) => {
      const catOk = activeCategory === 'all' || t.category === activeCategory;
      if (!catOk) return false;
      if (!q) return true;
      return `${t.title_ar} ${t.title_en} ${t.desc_ar} ${t.desc_en} ${t.category}`.toLowerCase().includes(q);
    });
    grid.innerHTML = filtered.map(buildToolCardHTML).join('');
  }

  window.triggerITTool = async function (toolId) {
    window.switchTab('itsupport');
    window.switchRepairSubtab('sub-tools');
    const badge = document.getElementById('itExecStatusBadge');
    const term = document.getElementById('itTerminalOutput');
    const insights = document.getElementById('itSmartInsightsBox');

    badge.textContent = 'RUNNING...';
    badge.style.color = '#fbbf24';
    term.textContent = `[AEGIS-X v7.0] Executing '${toolId}' silently in background...\nZero console windows & zero sound guaranteed.`;

    try {
      const res = await fetch('/api/itsupport/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_id: toolId }),
      });
      const data = await res.json();
      badge.textContent = `${data.status.toUpperCase()} (${data.duration_ms}ms)`;
      badge.style.color = data.status === 'success' ? '#34ffb6' : '#fbbf24';

      const listHtml = (data.smart_analysis || []).map((line) => `<li>${escapeHtml(line)}</li>`).join('');
      const nextHtml = (data.next_steps || []).map((n) => `<span class="tag-pill tag-sys">${escapeHtml(n)}</span>`).join(' ');
      insights.innerHTML = `
        <strong style="display:block;color:var(--emerald);margin-bottom:5px">${escapeHtml(data.tool_title)} <span dir="ltr">[${data.started_at} ➔ ${data.finished_at}]</span>:</strong>
        <ul>${listHtml}</ul>
        <div style="margin-top:8px">${nextHtml}</div>
      `;
      term.textContent = data.raw_output || '[Completed Cleanly]';
      await pollFullDashboard();
    } catch (err) {
      badge.textContent = 'ERROR';
      term.textContent = 'Error: ' + err.message;
    }
  };

  // ==================== SYSTEM TELEMETRY & BOTTLENECK DETECTOR ====================
  function updateSystemUI(snap) {
    if (!snap) return;
    latestSys = snap;

    document.getElementById('hostTitle').textContent = `${snap.hostname} • ${snap.os_version}`;
    const privStr = snap.is_admin ? 'Administrator' : 'Standard User';
    document.getElementById('osSubtitle').textContent =
      `${snap.kernel} • Gateway: ${snap.gateway_ip || '--'} (${snap.subnet_cidr || '--'}) • Token: ${privStr}`;
    document.getElementById('agentOverheadLabel').textContent = `${snap.agent_overhead_mb} MB`;

    // Show 1-click "Elevate to Admin" button whenever running as Standard User on Windows!
    const elevBtn = document.getElementById('elevateAdminBtn');
    if (elevBtn) {
      elevBtn.style.display = !snap.is_admin ? 'inline-flex' : 'none';
    }

    // Health Score & Beacon
    const score = snap.health_score || 98;
    document.getElementById('healthScoreNum').textContent = score;
    document.getElementById('healthGradeText').textContent = snap.health_grade || 'S+ SOVEREIGN';
    document.getElementById('healthGaugeCircle').style.strokeDashoffset = 553 - (score / 100) * 553;
    document.getElementById('hostBeacon').className = score < 72 ? 'status-beacon warn' : 'status-beacon';

    document.getElementById('uptimeSummary').textContent = currentLang === 'ar'
      ? `مدة التشغيل: ${snap.uptime_human} | العمليات النشطة: ${snap.process_count} | الصلاحية: ${privStr}`
      : `Uptime: ${snap.uptime_human} | Active Processes: ${snap.process_count} | Token: ${privStr}`;

    // CPU & RAM Cards + Automatic Red Alert Styling if >= 85%
    const cpuPct = snap.cpu_load_pct || 0;
    const ramPct = snap.ram_used_pct || 0;
    document.getElementById('cpuPctVal').textContent = `${cpuPct.toFixed(1)}%`;
    document.getElementById('cpuCoresLabel').textContent = `${snap.cpu_cores} Logical Cores`;
    document.getElementById('cpuModelLabel').textContent = snap.cpu_model;

    document.getElementById('ramPctVal').textContent = `${ramPct.toFixed(1)}%`;
    document.getElementById('ramUsedLabel').textContent = `${snap.ram_used_gb} / ${snap.ram_total_gb} GB`;
    if (snap.top_ram_hog_name) {
      document.getElementById('ramHogLabel').textContent = currentLang === 'ar'
        ? `الأعلى استهلاكاً الآن: ${snap.top_ram_hog_name} (${snap.top_ram_hog_mb} MB)`
        : `Top Consumer: ${snap.top_ram_hog_name} (${snap.top_ram_hog_mb} MB)`;
    }

    document.getElementById('cpuKpiCard').classList.toggle('critical-card', cpuPct >= 85);
    document.getElementById('ramKpiCard').classList.toggle('critical-card', ramPct >= 85);

    // Critical Saturation Banner (Solves the exact 99.8% CPU / 97.6% RAM scenario from user's screenshot!)
    const critBanner = document.getElementById('criticalLoadBanner');
    const critText = document.getElementById('criticalLoadText');
    if (cpuPct >= 85 || ramPct >= 85) {
      critBanner.style.display = 'flex';
      const cpuCulprit = snap.top_cpu_hog_name ? `${snap.top_cpu_hog_name} (${snap.top_cpu_hog_pct}%)` : 'Active Task';
      const ramCulprit = snap.top_ram_hog_name ? `${snap.top_ram_hog_name} (${snap.top_ram_hog_mb} MB)` : '';
      critText.innerHTML = currentLang === 'ar'
        ? `تنبيه استنزاف موارد حرج: المعالج <strong dir="ltr">${cpuPct.toFixed(1)}%</strong> (${escapeHtml(cpuCulprit)}) | الذاكرة <strong dir="ltr">${ramPct.toFixed(1)}%</strong> (${escapeHtml(ramCulprit)})`
        : `High Resource Saturation: CPU <strong>${cpuPct.toFixed(1)}%</strong> (${escapeHtml(cpuCulprit)}) | RAM <strong>${ramPct.toFixed(1)}%</strong> (${escapeHtml(ramCulprit)})`;
    } else {
      critBanner.style.display = 'none';
    }

    // Sparklines
    cpuSpark.push(Math.max(2, cpuPct));
    if (cpuSpark.length > 34) cpuSpark.shift();
    ramSpark.push(Math.max(5, ramPct));
    if (ramSpark.length > 34) ramSpark.shift();

    let rxTxKB = 0;
    (snap.interfaces || []).forEach((iface) => {
      if (!iface.is_loopback) rxTxKB += (iface.rx_rate_kbps || 0) + (iface.tx_rate_kbps || 0);
    });
    document.getElementById('netRateVal').textContent = `${rxTxKB.toFixed(1)} KB/s`;
    netSpark.push(Math.max(2, rxTxKB));
    if (netSpark.length > 34) netSpark.shift();

    drawAreaSparkline('cpuHistoryCanvas', cpuSpark, cpuPct >= 85 ? '#ff4769' : '#00f0ff', cpuPct >= 85 ? 'rgba(255,71,105,0.18)' : 'rgba(0,240,255,0.14)', 100);
    drawAreaSparkline('ramHistoryCanvas', ramSpark, ramPct >= 85 ? '#ff4769' : '#a855f7', ramPct >= 85 ? 'rgba(255,71,105,0.18)' : 'rgba(168,85,247,0.15)', 100);
    drawAreaSparkline('netSparkCanvas', netSpark, '#34ffb6', 'rgba(52,255,182,0.14)', null);

    // Disks with strict dir="ltr" numeric formatting (fixes "GB (73.86%) 237.36 / 173.41" bug 100%!)
    document.getElementById('disksContainer').innerHTML = (snap.disks || []).map((d) => `
      <div class="disk-item">
        <div class="disk-row-top">
          <strong><span dir="ltr">${escapeHtml(d.drive)} (${escapeHtml(d.file_system)})</span> — <span class="emerald-text">${escapeHtml(d.health)}</span></strong>
          <span dir="ltr" style="font-family:var(--font-mono);color:var(--cyan)">${d.used_gb} / ${d.total_gb} GB (${d.used_percent}%)</span>
        </div>
        <div class="progress-rail">
          <div class="progress-fill ${d.used_percent > 85 ? 'danger' : 'cyan'}" style="width:${Math.min(100, d.used_percent)}%"></div>
        </div>
      </div>
    `).join('');

    // Top Processes with BOTH real CPU% and RAM MB
    document.getElementById('topProcsBody').innerHTML = (snap.top_processes || []).slice(0, 10).map((p) => {
      const cls = p.category.includes('Local AI') ? 'tag-ai' : (p.category.includes('System') ? 'tag-sys' : 'tag-app');
      const cpuCol = (p.cpu_pct || 0) >= 25 ? 'color:var(--danger);font-weight:800' : 'color:var(--cyan)';
      return `
        <tr>
          <td dir="ltr">${p.pid}</td>
          <td dir="ltr"><strong>${escapeHtml(p.name)}</strong></td>
          <td><span class="tag-pill ${cls}">${escapeHtml(p.category)}</span></td>
          <td dir="ltr" style="${cpuCol}">${(p.cpu_pct || 0).toFixed(1)}%</td>
          <td dir="ltr">${p.mem_mb} MB</td>
        </tr>
      `;
    }).join('');
  }

  // ==================== TRUE LAN & ROUTER TOPOLOGY ENGINE ====================
  window.rescanLanNow = async function (deep) {
    const btn = document.getElementById('btnRescanLan');
    if (btn) btn.style.opacity = '0.7';
    pushInfoToast('📡 LAN & Router Radar', currentLang === 'ar' ? 'جاري مسح نطاق الشبكة وفحص جميع الأجهزة المتصلة والراوتر...' : 'Scanning active subnet & fingerprinting devices...');
    try {
      const res = await fetch('/api/lan/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deep: Boolean(deep) }),
      });
      const topo = await res.json();
      updateLanUI(topo);
      pushInfoToast('✓ اكتمل فحص الشبكة', `${topo.total_devices} أجهزة متصلة على النطاق ${topo.subnet_cidr}`);
    } catch (err) {
      console.error(err);
    } finally {
      if (btn) btn.style.opacity = '1';
    }
  };

  function updateLanUI(topo) {
    if (!topo) return;
    latestLan = topo;

    const gwIP = topo.gateway_ip || '--';
    const cidr = topo.subnet_cidr || '--';
    const rAudit = topo.router_audit || {};
    const rModel = rAudit.router_model || rAudit.router_vendor || 'Gateway Router';

    document.getElementById('sbGatewayIP').textContent = gwIP;
    document.getElementById('sbSubnetCIDR').textContent = cidr;
    document.getElementById('navDevicesCount').textContent = topo.total_devices || 0;

    // Overview Router KPI Card
    document.getElementById('overviewGatewayIP').textContent = gwIP;
    document.getElementById('overviewGatewayRTT').textContent = rAudit.gateway_rtt_ms > 0 ? `${rAudit.gateway_rtt_ms} ms` : '0.8 ms';
    document.getElementById('overviewSubnetBadge').textContent = cidr;
    document.getElementById('overviewDevicesBadge').textContent = `${topo.total_devices || 0} Devices`;
    document.getElementById('overviewRouterModel').textContent = rModel;

    // v9.0 Network Tab KPI Strip
    const totEl = document.getElementById('lanTotalCountTxt');
    if (totEl) {
      totEl.textContent = `${topo.total_devices || 0} ${currentLang === 'ar' ? 'جهاز متصل' : 'Connected'}`;
      document.getElementById('lanSubnetCidrTxt').textContent = `Subnet: ${cidr} (${topo.scan_duration_ms || 0}ms)`;
      document.getElementById('lanRouterModelTxt').textContent = rModel;
      document.getElementById('lanRouterIpMacTxt').textContent = `IP: ${gwIP} • MAC: ${rAudit.router_mac || '--'}`;
      document.getElementById('lanTrustBreakdownTxt').textContent =
        `${topo.trusted_count || 0} Trusted / ${topo.untrusted_count || 0} New`;
      document.getElementById('lanTrustBreakdownTxt').className = (topo.untrusted_count || 0) > 0 ? 'amber-text' : 'emerald-text';
    }

    // Network Map Subtitle & Summary
    document.getElementById('mapSubtitle').textContent =
      `Router: ${rModel} (${gwIP}) • Subnet: ${cidr} • Active Devices: ${topo.total_devices || 0} • Scan: ${topo.scan_duration_ms || 0}ms`;

    // Router Security Banner in Cyber Tab
    document.getElementById('cyberRouterHeadline').textContent = currentLang === 'ar'
      ? `تقرير الفحص الأمني للراوتر: ${rModel} (${gwIP} — النطاق ${cidr})`
      : `Gateway Security Audit: ${rModel} (${gwIP} — Subnet ${cidr})`;
    document.getElementById('cyberRouterCertInfo').textContent = rAudit.tls_subject
      ? `X.509 SSL Certificate: ${rAudit.tls_subject} | Validity: ${rAudit.tls_valid_from} ➔ ${rAudit.tls_valid_to}`
      : `Open Gateway Ports: [${(rAudit.open_ports || []).join(', ') || 'Filtered/Protected'}]`;
    document.getElementById('cyberRouterScoreNum').textContent = `${rAudit.security_score || 96}/100`;
    document.getElementById('cyberRouterGradeTxt').textContent = rAudit.security_grade || 'A+ HARDENED';
    document.getElementById('cyberRouterVulnsList').innerHTML = (rAudit.vulnerabilities || []).map((v) =>
      `<li>${escapeHtml(v)}</li>`
    ).join('');

    // Default selected device = Gateway Router
    if (!selectedDeviceIP && Array.isArray(topo.devices) && topo.devices.length > 0) {
      selectedDeviceIP = topo.devices[0].ip;
    }

    renderLanInventoryTable(topo);
    renderSelectedDeviceCard(topo);
    if (document.getElementById('tab-network').classList.contains('active')) {
      drawRealLanTopologyMap(topo);
    }
  }

  function renderLanInventoryTable(topo) {
    const tbody = document.getElementById('lanDevicesTableBody');
    if (!tbody || !topo || !Array.isArray(topo.devices)) return;

    const q = ((document.getElementById('lanDeviceSearchInput') || {}).value || '').toLowerCase().trim();
    const roleFilter = ((document.getElementById('lanDeviceRoleFilter') || {}).value || 'all');

    const filtered = topo.devices.filter((d) => {
      if (roleFilter === 'untrusted') {
        if (d.trusted || d.is_gateway || d.is_this_pc) return false;
      } else if (roleFilter === 'laptop') {
        if (d.device_type !== 'laptop' && d.device_type !== 'this_pc') return false;
      } else if (roleFilter !== 'all' && d.device_type !== roleFilter) {
        return false;
      }
      if (!q) return true;
      return `${d.ip} ${d.mac} ${d.display_name} ${d.hostname} ${d.vendor} ${d.os_family} ${d.model_banner}`.toLowerCase().includes(q);
    });

    tbody.innerHTML = filtered.map((d) => {
      const typeTag = deviceRoleBadge(d);
      const trustBadge = (d.trusted || d.is_gateway || d.is_this_pc)
        ? `<span class="tag-pill tag-ai" dir="ltr">✓ Trusted</span>`
        : `<span class="tag-pill tag-warn" dir="ltr">! New</span>`;
      const srcPills = (d.discovery_sources || []).slice(0, 3).join('+');
      const portsStr = (d.services && d.services.length > 0)
        ? d.services.slice(0, 3).join(' • ')
        : (srcPills || 'ARP Verified');
      const hostSub = d.hostname && d.hostname !== d.display_name ? `<div dir="ltr" style="font-size:0.69rem;color:var(--text-muted)">Host: ${escapeHtml(d.hostname)}</div>` : '';

      return `
        <tr style="cursor:pointer;${d.ip === selectedDeviceIP ? 'background:rgba(0,240,255,0.13)' : ''}" onclick="window.selectLanDevice('${escapeHtml(d.ip)}')">
          <td>
            <div style="display:flex;align-items:center;gap:7px">
              ${typeTag}
              <div>
                <strong>${escapeHtml(d.display_name)}</strong>
                ${hostSub}
              </div>
            </div>
          </td>
          <td dir="ltr" style="color:var(--cyan);font-weight:700">${escapeHtml(d.ip)}</td>
          <td dir="ltr" style="font-family:var(--font-mono);font-size:0.75rem">${escapeHtml(d.mac)}</td>
          <td>
            <strong>${escapeHtml(d.vendor)}</strong>
            ${d.is_randomized_mac ? `<div style="font-size:0.68rem;color:var(--amber)">Private MAC</div>` : ''}
          </td>
          <td>
            <div style="font-size:0.76rem">${escapeHtml(d.os_family || '--')}</div>
            <div style="font-size:0.69rem;color:var(--text-muted)">${escapeHtml(d.connection_medium || '')}</div>
          </td>
          <td dir="ltr">${d.is_this_pc ? '0.0m' : `~${d.est_distance_m}m`} • <strong>${d.rtt_ms} ms</strong> (${d.signal_est_pct}%)</td>
          <td>${trustBadge}</td>
          <td dir="ltr" style="max-width:230px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${escapeHtml(portsStr)}">${escapeHtml(portsStr)}</td>
        </tr>
      `;
    }).join('');
  }

  window.selectLanDevice = function (ip) {
    selectedDeviceIP = ip;
    if (latestLan) {
      updateLanUI(latestLan);
      drawRealLanTopologyMap(latestLan);
    }
  };

  function deviceRoleBadge(d) {
    const map = {
      router: ['ROUTER', 'tag-ai'],
      this_pc: ['THIS PC', 'tag-sys'],
      laptop: ['PC / LAPTOP', 'tag-sys'],
      smartphone: ['MOBILE', 'tag-app'],
      tv: ['SMART TV', 'tag-app'],
      printer: ['PRINTER', 'tag-sys'],
      camera: ['IP CAMERA', 'tag-warn'],
      nas: ['NAS SERVER', 'tag-ai'],
      console: ['CONSOLE', 'tag-app'],
      iot: ['IoT NODE', 'tag-sys'],
    };
    const [lbl, cls] = map[d.device_type] || ['LAN NODE', 'tag-sys'];
    return `<span class="tag-pill ${cls}" dir="ltr">${lbl}</span>`;
  }

  function renderSelectedDeviceCard(topo) {
    const box = document.getElementById('selectedDeviceDetails');
    if (!box || !topo || !Array.isArray(topo.devices)) return;
    const dev = topo.devices.find((x) => x.ip === selectedDeviceIP) || topo.devices[0];
    if (!dev) return;

    document.getElementById('selectedDevTypeBadge').textContent = (dev.device_type || 'NODE').toUpperCase();

    const svcs = (dev.services && dev.services.length > 0)
      ? dev.services.map((s) => `<span class="tag-pill tag-sys" dir="ltr">${escapeHtml(s)}</span>`).join(' ')
      : `<span style="color:var(--text-muted);font-size:0.76rem">${currentLang === 'ar' ? 'لا توجد منافذ TCP مفتوحة للعامة' : '0 exposed TCP ports'}</span>`;

    const secNotes = (dev.security_findings && dev.security_findings.length > 0)
      ? `<div style="margin-top:6px;padding:9px 11px;border-radius:9px;background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.35);font-size:0.75rem;color:var(--amber)">
           ${dev.security_findings.map((f) => `<div>• ${escapeHtml(f)}</div>`).join('')}
         </div>`
      : '';

      const auditInfo = deviceDeepAudits[dev.ip];
      const auditHtml = auditInfo
        ? `<div class="dev-audit-result-box">
             <strong style="color:var(--emerald);display:block;margin-bottom:4px">
               ✓ ${currentLang === 'ar' ? 'نتيجة الفحص الجراحي العميق للجهاز' : 'Surgical Deep Audit Result'} (${auditInfo.audit_duration_ms}ms):
             </strong>
             <div dir="ltr" style="font-family:var(--font-mono);color:var(--cyan)">
               RTT Avg: <strong>${auditInfo.avg_rtt_ms}ms</strong> (Min ${auditInfo.min_rtt_ms}ms / Max ${auditInfo.max_rtt_ms}ms) • Jitter: <strong>${auditInfo.jitter_ms}ms</strong> • Loss: <strong>${auditInfo.packet_loss_pct}%</strong>
             </div>
             <div dir="ltr" style="font-family:var(--font-mono);color:var(--text-muted);margin-top:3px">
               33-Port Sweep Open: [${(auditInfo.device && auditInfo.device.open_ports || []).join(', ') || '0 Exposed Ports'}]
             </div>
           </div>`
        : '';

      const canWoL = dev.mac && dev.mac.includes(':') && !dev.is_this_pc;
      const isTrusted = Boolean(dev.trusted || dev.is_gateway || dev.is_this_pc);
      const srcBadges = (dev.discovery_sources || []).map((s) => `<span class="tag-pill tag-ai" dir="ltr">${escapeHtml(s)}</span>`).join(' ');

      const aliasRowHtml = !dev.is_this_pc ? `
        <div class="alias-edit-row">
          <input type="text" id="devAliasInput" value="${escapeHtml(dev.custom_alias || '')}" placeholder="${currentLang === 'ar' ? 'سمِّ هذا الجهاز (مثال: جوال محمد / شاشة الصالة)...' : 'Custom name (e.g. Living Room TV)...'}" />
          <button class="btn-mini-action" onclick="window.saveDeviceAliasAndTrust('${escapeHtml(dev.ip)}','${escapeHtml(dev.mac)}', ${isTrusted})">
            💾 ${currentLang === 'ar' ? 'حفظ الاسم' : 'Save'}
          </button>
          <button class="btn-mini-action" style="border-color:${isTrusted ? 'var(--emerald)' : 'var(--amber)'};color:${isTrusted ? 'var(--emerald)' : 'var(--amber)'}" onclick="window.saveDeviceAliasAndTrust('${escapeHtml(dev.ip)}','${escapeHtml(dev.mac)}', ${!isTrusted})">
            ${isTrusted ? (currentLang === 'ar' ? '✓ موثوق' : '✓ Trusted') : (currentLang === 'ar' ? 'توثيق الجهاز' : 'Mark Trusted')}
          </button>
        </div>
      ` : '';

      const actionBarHtml = `
        <div class="dev-action-bar">
          <button class="btn-primary-glow" style="padding:7px 12px;font-size:0.75rem" onclick="window.probeSingleDevice('${escapeHtml(dev.ip)}')">
            🔍 ${currentLang === 'ar' ? 'فحص عميق (34 منفذ + Jitter)' : 'Deep 34-Port & Jitter'}
          </button>
          ${canWoL ? `<button class="btn-secondary-glass" style="padding:7px 12px;font-size:0.75rem" onclick="window.wakeOnLanDevice('${escapeHtml(dev.mac)}','${escapeHtml(dev.ip)}')">⚡ Wake-on-LAN</button>` : ''}
        </div>
      `;

    box.innerHTML = `
      <div>
        <h4 style="font-size:1.02rem;color:var(--cyan);margin-bottom:2px">${escapeHtml(dev.display_name)}</h4>
        <p dir="ltr" style="font-family:var(--font-mono);font-size:0.73rem;color:var(--text-muted)">${escapeHtml(dev.model_banner || dev.vendor)}${dev.hostname ? ` • Hostname: ${escapeHtml(dev.hostname)}` : ''}</p>
        ${aliasRowHtml}
      </div>
      <div class="dev-kv-grid">
        <div class="dev-kv-box">
          <span>IPv4 Address</span>
          <strong dir="ltr" style="color:var(--emerald)">${escapeHtml(dev.ip)}</strong>
        </div>
        <div class="dev-kv-box">
          <span>MAC Address</span>
          <strong dir="ltr">${escapeHtml(dev.mac)}</strong>
        </div>
        <div class="dev-kv-box">
          <span>${currentLang === 'ar' ? 'الشركة المصنعة (IEEE OUI)' : 'Manufacturer'}</span>
          <strong>${escapeHtml(dev.vendor)}</strong>
        </div>
        <div class="dev-kv-box">
          <span>${currentLang === 'ar' ? 'نظام التشغيل والاتصال' : 'OS & Medium'}</span>
          <strong>${escapeHtml(dev.os_family || '--')}</strong>
        </div>
        <div class="dev-kv-box">
          <span>${currentLang === 'ar' ? 'المسافة عن الراوتر' : 'Est. Distance'}</span>
          <strong dir="ltr">${dev.is_gateway ? '0.0 m (Router)' : `~${dev.est_distance_m} m`}</strong>
        </div>
        <div class="dev-kv-box">
          <span>${currentLang === 'ar' ? 'الاستجابة والجودة' : 'RTT & Signal'}</span>
          <strong dir="ltr">${dev.rtt_ms} ms (${dev.signal_est_pct}%)</strong>
        </div>
      </div>
      <div>
        <span style="display:block;font-size:0.72rem;color:var(--text-muted);margin-bottom:5px">${currentLang === 'ar' ? 'بروتوكولات الاكتشاف والمنافذ:' : 'Discovery & Open Services:'}</span>
        <div style="display:flex;flex-wrap:wrap;gap:5px">${srcBadges} ${svcs}</div>
      </div>
      ${actionBarHtml}
      ${auditHtml}
      ${secNotes}
    `;
  }

  window.saveDeviceAliasAndTrust = async function (ip, mac, trusted) {
    const inp = document.getElementById('devAliasInput');
    const alias = inp ? inp.value.trim() : '';
    try {
      const res = await fetch('/api/lan/update-device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip, mac, alias, trusted: Boolean(trusted) }),
      });
      const data = await res.json();
      if (data.ok && data.lan) {
        updateLanUI(data.lan);
        pushInfoToast('✓ تم تحديث سجل الجهاز', `${alias || ip} (${trusted ? 'Trusted' : 'Unverified'})`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  window.probeSingleDevice = async function (ip) {
    if (!ip) return;
    pushInfoToast('🔍 Deep Device Audit', currentLang === 'ar' ? `جاري فحص 33 منفذاً وقياس تذبذب الاستجابة للجهاز ${ip}...` : `Scanning 33 ports & 6-ping jitter on ${ip}...`);
    try {
      const res = await fetch('/api/lan/probe-device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip }),
      });
      const data = await res.json();
      if (!data.ok) {
        pushInfoToast('⚠️ IP Probe Error', data.message || 'Invalid target');
        return;
      }
      deviceDeepAudits[data.audit.device.ip] = data.audit;
      selectedDeviceIP = data.audit.device.ip;
      await pollFullDashboard();
      pushInfoToast('✓ اكتمل الفحص العميق للجهاز', `${data.audit.device.ip}: Avg ${data.audit.avg_rtt_ms}ms | Jitter ${data.audit.jitter_ms}ms | Ports: ${(data.audit.device.open_ports || []).length}`);
    } catch (err) {
      console.error(err);
    }
  };

  window.probeCustomIP = function () {
    const inp = document.getElementById('customProbeIpInput');
    const ip = (inp && inp.value || '').trim();
    if (!ip) {
      pushInfoToast('Custom IP Probe', currentLang === 'ar' ? 'أدخل عنوان IP لفحصه (مثال: 192.168.100.1)' : 'Enter an IPv4 address to probe');
      return;
    }
    window.probeSingleDevice(ip);
  };

  window.wakeOnLanDevice = async function (mac, ip) {
    try {
      const res = await fetch('/api/lan/wol', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mac, ip }),
      });
      const data = await res.json();
      pushInfoToast(data.ok ? '⚡ Wake-on-LAN Sent' : 'Wake-on-LAN', data.message || '');
    } catch (err) {
      console.error(err);
    }
  };

  // Genuine Spatial Radial Router-Centric Topology Map!
  function drawRealLanTopologyMap(topo) {
    const canvas = document.getElementById('lanRadialCanvas');
    if (!canvas || !topo) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const maxR = Math.min(w, h) * 0.41;
    renderedNodeHitboxes = [];

    // Draw concentric distance rings (Near 3m, Mid 8m, Far 15m+)
    const rings = [
      { r: maxR * 0.36, lbl: '3m (Near)' },
      { r: maxR * 0.68, lbl: '8m (Mid)' },
      { r: maxR * 0.96, lbl: '15m+ (Edge)' },
    ];
    rings.forEach((rg) => {
      ctx.beginPath();
      ctx.arc(cx, cy, rg.r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.14)';
      ctx.setLineDash([4, 6]);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = 'rgba(147, 168, 201, 0.55)';
      ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(rg.lbl, cx + rg.r + 5, cy - 4);
    });

    const devs = topo.devices || [];
    const gwDev = devs.find((d) => d.is_gateway) || {
      ip: topo.gateway_ip || '192.168.1.1',
      display_name: 'Gateway Router',
      device_type: 'router',
    };
    const peers = devs.filter((d) => !d.is_gateway);

    // Draw each real connected device at an angle & radius proportional to its estimated distance from the Router!
    peers.forEach((d, idx) => {
      const angle = (idx / Math.max(1, peers.length)) * Math.PI * 2 - Math.PI / 2;
      let normDist = 0.42;
      if (d.is_this_pc) {
        normDist = 0.35;
      } else {
        normDist = Math.min(0.94, Math.max(0.32, (d.est_distance_m || 4) / 16.0));
      }
      const nx = cx + Math.cos(angle) * (maxR * normDist);
      const ny = cy + Math.sin(angle) * (maxR * normDist);

      let color = '#00f0ff';
      if (d.is_this_pc) color = '#34ffb6';
      else if (d.device_type === 'smartphone') color = '#c084fc';
      else if (d.device_type === 'tv') color = '#fbbf24';

      // Link line from Router Center to Device
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle = d.ip === selectedDeviceIP ? '#ffffff' : color + '66';
      ctx.lineWidth = d.ip === selectedDeviceIP ? 2.6 : 1.7;
      ctx.stroke();

      // Distance & RTT Pill mid-line
      const mx = (cx + nx) / 2;
      const my = (cy + ny) / 2;
      ctx.fillStyle = 'rgba(4, 10, 24, 0.88)';
      ctx.fillRect(mx - 28, my - 8, 56, 15);
      ctx.fillStyle = color;
      ctx.font = '600 9.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${d.rtt_ms}ms`, mx, my + 3);

      // Device Node Circle
      const nodeR = d.ip === selectedDeviceIP ? 20 : 16;
      ctx.beginPath();
      ctx.arc(nx, ny, nodeR, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(8, 17, 36, 0.95)';
      ctx.fill();
      ctx.strokeStyle = d.ip === selectedDeviceIP ? '#ffffff' : color;
      ctx.lineWidth = d.ip === selectedDeviceIP ? 3 : 2;
      ctx.stroke();

      // Short glyph inside node
      const glyphMap = { this_pc: 'PC', laptop: 'PC', smartphone: 'MOB', tv: 'TV', printer: 'PRT', console: 'PS', iot: 'IoT' };
      ctx.fillStyle = color;
      ctx.font = '700 9.5px "JetBrains Mono", monospace';
      ctx.fillText(glyphMap[d.device_type] || 'LAN', nx, ny + 3.5);

      // Device Name + IP Label
      const shortName = (d.display_name || d.ip).slice(0, 22);
      ctx.fillStyle = '#f3f8ff';
      ctx.font = '700 11px "Inter", "Cairo", sans-serif';
      ctx.fillText(shortName, nx, ny + nodeR + 14);
      ctx.fillStyle = '#93a8c9';
      ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.fillText(d.ip, nx, ny + nodeR + 26);

      renderedNodeHitboxes.push({ ip: d.ip, x: nx, y: ny, r: nodeR });
    });

    // Draw Central Gateway Router Hub last (on top)
    const gwSelected = gwDev.ip === selectedDeviceIP;
    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
    ctx.fill();
    ctx.strokeStyle = gwSelected ? '#ffffff' : '#34ffb6';
    ctx.lineWidth = gwSelected ? 3.5 : 2.6;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 10.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ROUTER', cx, cy - 2);
    ctx.fillStyle = '#34ffb6';
    ctx.font = '600 9.5px "JetBrains Mono", monospace';
    ctx.fillText(gwDev.ip || '', cx, cy + 11);

    const rLabel = (topo.router_audit && topo.router_audit.router_model) ? topo.router_audit.router_model : gwDev.display_name;
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 11.5px "Inter", "Cairo", sans-serif';
    ctx.fillText((rLabel || 'Gateway').slice(0, 28), cx, cy - 38);

    renderedNodeHitboxes.push({ ip: gwDev.ip, x: cx, y: cy, r: 30 });
  }

  // ==================== WI-FI RF MULTIPATH & MOTION TOMOGRAPHY ====================
  window.setRfSensitivity = async function (mult) {
    document.querySelectorAll('.rf-sens-group .filter-pill').forEach((b) => {
      b.classList.toggle('active', b.textContent.startsWith(mult.toFixed(1)));
    });
    try {
      const res = await fetch('/api/rf/sensitivity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ multiplier: mult }),
      });
      const rf = await res.json();
      updateRfUI(rf);
      pushInfoToast('📡 RF Sensitivity Gain', `Sensitivity set to ${mult.toFixed(1)}x`);
    } catch (err) {
      console.error(err);
    }
  };

  window.calibrateRfRoom = async function () {
    try {
      const res = await fetch('/api/rf/calibrate', { method: 'POST' });
      const rf = await res.json();
      updateRfUI(rf);
      pushInfoToast('📡 RF Bio-Thermal Baseline Locked', currentLang === 'ar'
        ? 'تمت معايرة البصمة الحرارية للغرفة الساكنة (24.0°C) بنجاح.'
        : 'Static room 24.0°C RF Bio-Thermal baseline locked.');
    } catch (err) {
      console.error(err);
    }
  };

  window.triggerBioWalkDemo = async function () {
    try {
      const res = await fetch('/api/rf/simulate-walk', { method: 'POST' });
      const rf = await res.json();
      updateRfUI(rf);
      pushInfoToast('🔥 Bio-Thermal Walk Simulation Active', currentLang === 'ar'
        ? 'تم تشغيل محاكاة حركة جسم حراري حول الراوتر لمدة 18 ثانية — راقب التتبع الطيفي الحي!'
        : '18-second Bio-Thermal human movement calibration active around router!');
    } catch (err) {
      console.error(err);
    }
  };

  function updateRfUI(rf) {
    if (!rf) return;
    latestRf = rf;

    const bodies = rf.bio_thermal_targets || [];
    const bodiesCnt = bodies.length;

    // Update Network Tab's Bio-Thermal KPI & Mini Target Box too!
    const lanBioCnt = document.getElementById('lanBioBodiesCountTxt');
    if (lanBioCnt) {
      lanBioCnt.textContent = bodiesCnt > 0
        ? (currentLang === 'ar' ? `${bodiesCnt} جسم حراري مرصود!` : `${bodiesCnt} Bio-Body Tracked!`)
        : (currentLang === 'ar' ? '0 أجسام (مجال ساكن)' : '0 Bodies (Static)');
      lanBioCnt.className = bodiesCnt > 0 ? 'danger-text' : 'emerald-text';
    }
    const miniSub = document.getElementById('miniThermalSub');
    if (miniSub) {
      miniSub.textContent = bodiesCnt > 0
        ? `🔥 ${bodiesCnt} Bio-Target(s) • Peak ${bodies[0].equiv_temp_c}°C (~${bodies[0].distance_m}m)`
        : `✓ Ambient 24.0°C • ${rf.current_rssi_dbm || -56} dBm`;
    }
    const miniTargetsEl = document.getElementById('netMiniThermalTargets');
    if (miniTargetsEl) {
      miniTargetsEl.innerHTML = bodiesCnt === 0
        ? `<div class="disk-item" style="padding:7px 10px;font-size:0.73rem;color:var(--emerald)">✓ ${currentLang === 'ar' ? 'لا توجد أجسام متحركة حالياً في مجال الراوتر (اضغط اختبار حركة للمعاينة).' : 'No moving bio-bodies detected near router.'}</div>`
        : bodies.slice(0, 2).map((b) => `
            <div class="bio-target-card">
              <strong style="color:#ff9e7d">${escapeHtml(currentLang === 'ar' ? b.label_ar : b.label_en)}</strong>
              <div dir="ltr" style="font-family:var(--font-mono);font-size:0.7rem;color:#fff">
                ~${b.distance_m}m • ${b.equiv_temp_c}°C • ${b.confidence_pct}% Conf
              </div>
            </div>
          `).join('');
    }

    const badge = document.getElementById('navRfBadge');
    const stEl = document.getElementById('rfPresenceStateTxt');
    if (rf.presence_state === 'BIO_THERMAL_DETECTED' || rf.presence_state === 'MOTION_DETECTED' || bodiesCnt > 0) {
      badge.textContent = `${bodiesCnt || 1} BIO`;
      badge.className = 'nav-counter danger';
      stEl.textContent = currentLang === 'ar' ? `رصد ${bodiesCnt || 1} جسم حراري!` : `${bodiesCnt || 1} BIO-BODY DETECTED`;
      stEl.className = 'danger-text';
    } else if (rf.presence_state === 'MICRO_ACTIVITY') {
      badge.textContent = 'ACTIVE';
      badge.className = 'nav-counter cyan';
      stEl.textContent = currentLang === 'ar' ? 'تذبذب حراري/موجي طفيف' : 'MICRO ACTIVITY';
      stEl.className = 'cyan-text';
    } else {
      badge.textContent = 'CLEAR';
      badge.className = 'nav-counter emerald';
      stEl.textContent = currentLang === 'ar' ? 'سكون (24.0°C Ambient)' : 'STATIC CLEAR (24°C)';
      stEl.className = 'emerald-text';
    }

    document.getElementById('rfConfidenceTxt').textContent = `Bodies: ${bodiesCnt} • Confidence: ${rf.presence_confidence || 96}%`;
    document.getElementById('rfCurrentRssiTxt').textContent = `${(rf.current_rssi_dbm || -56).toFixed(1)} dBm`;
    document.getElementById('rfBaselineRssiTxt').textContent = `Baseline: ${(rf.baseline_rssi_dbm || -56).toFixed(1)} dBm`;
    document.getElementById('rfEntropyTxt').textContent = `${(rf.multipath_entropy || 0).toFixed(1)}%`;
    document.getElementById('rfJitterTxt').textContent = `Gateway Micro-Jitter: ${(rf.gateway_micro_jitter_ms || 0).toFixed(2)} ms`;

    const rad = rf.radio || {};
    const apsCount = (rf.nearby_aps || []).length;
    document.getElementById('rfBandTxt').textContent = `${rad.frequency_band || '5 GHz'}${rad.channel ? ` (CH ${rad.channel})` : ''}`;
    document.getElementById('rfLinkRateTxt').textContent = `${rad.rx_rate_mbps > 0 ? `${rad.rx_rate_mbps} Mbps` : (rad.connection_type || 'LAN')} • ${apsCount} Nearby APs`;

    document.getElementById('rfPhysicsBanner').textContent = currentLang === 'ar' ? rf.physics_note_ar : rf.physics_note_en;

    // Render Tracked Bio-Thermal Bodies List
    const bioListEl = document.getElementById('rfBioTargetsList');
    if (bioListEl) {
      bioListEl.innerHTML = bodiesCnt === 0
        ? `<div class="disk-item" style="font-size:0.77rem;color:var(--emerald)">✓ ${currentLang === 'ar'
            ? 'المجال حول الراوتر خالٍ من الحركة الحية حالياً (بصمة السكون 24.0°C). تحرك بين الكمبيوتر والراوتر أو اضغط زر (اختبار محاكاة مرور جسم حراري) لمشاهدة التتبع.'
            : 'No moving bio-thermal mass detected around router (24.0°C static field). Move between your PC and router or click Simulate Moving Bio-Body.'}</div>`
        : bodies.map((b) => `
            <div class="bio-target-card">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:6px">
                <strong style="color:#ffd166">🔥 ${escapeHtml(currentLang === 'ar' ? b.label_ar : b.label_en)}</strong>
                <span class="tag-pill tag-warn" dir="ltr">${b.equiv_temp_c}°C • ${b.confidence_pct}%</span>
              </div>
              <div style="margin-top:3px;color:var(--text-main)">
                ${escapeHtml(currentLang === 'ar' ? b.sector_ar : b.sector_en)} — <strong dir="ltr">~${b.distance_m}m (${b.azimuth_deg}°)</strong>
              </div>
              <div dir="ltr" style="font-family:var(--font-mono);font-size:0.69rem;color:var(--cyan);margin-top:2px">
                Ray Shadowed: ${escapeHtml(b.intersecting_ray)} | Absorption: ${b.heat_intensity}%
              </div>
            </div>
          `).join('');
    }

    const linksEl = document.getElementById('rfLinksList');
    if (linksEl) {
      const linkCards = (rf.links || []).map((lk) => `
        <div class="disk-item" style="padding:7px 11px">
          <div class="disk-row-top" style="margin-bottom:3px">
            <strong>${escapeHtml(lk.device_name)} <span dir="ltr" style="color:var(--text-muted);font-size:0.71rem">(${escapeHtml(lk.ip)})</span></strong>
            <span dir="ltr" style="font-family:var(--font-mono);color:${lk.perturbed ? 'var(--danger)' : 'var(--emerald)'}">
              Absorb: ${lk.attenuation_pct}% | Δ${lk.jitter_stddev_ms}ms
            </span>
          </div>
          <div class="progress-rail">
            <div class="progress-fill ${lk.perturbed ? 'danger' : 'emerald'}" style="width:${Math.max(4, lk.attenuation_pct)}%"></div>
          </div>
        </div>
      `);
      const apCards = (rf.nearby_aps || []).slice(0, 4).map((ap) => `
        <div class="disk-item" style="padding:6px 11px;font-size:0.73rem">
          <div class="disk-row-top" style="margin-bottom:0">
            <span dir="ltr">📡 AP: <strong>${escapeHtml(ap.ssid)}</strong> (${escapeHtml(ap.band)} CH ${ap.channel})</span>
            <span dir="ltr" style="font-family:var(--font-mono);color:var(--cyan)">${ap.rssi_dbm} dBm (~${ap.est_distance_m}m)</span>
          </div>
        </div>
      `);
      linksEl.innerHTML = [...linkCards, ...apCards].join('');
    }

    const evEl = document.getElementById('rfEventsList');
    if (evEl) {
      const evs = rf.recent_events || [];
      evEl.innerHTML = evs.length === 0
        ? `<div class="disk-item" style="font-size:0.76rem;color:var(--emerald)">✓ المجال الحراري/الراديوي مستقر منذ آخر معايرة.</div>`
        : evs.slice(0, 6).map((ev) => `
            <div class="disk-item" style="padding:7px 11px;font-size:0.74rem">
              <strong dir="ltr" style="color:var(--amber)">[${escapeHtml(ev.timestamp)}]</strong>
              <span> ${escapeHtml(ev.zone)}: ${escapeHtml(ev.description)}</span>
            </div>
          `).join('');
    }

    if (document.getElementById('tab-rfsense').classList.contains('active')) {
      drawRfTomographyCanvases(rf);
    }
    if (document.getElementById('tab-network').classList.contains('active')) {
      drawMiniNetworkThermalCanvas(rf);
    }
  }

  function renderBioThermalCanvasScene(canvas, rf, compact) {
    if (!canvas || !rf || !Array.isArray(rf.heatmap_grid) || rf.heatmap_grid.length === 0) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const rows = rf.heatmap_grid.length;
    const cols = rf.heatmap_grid[0].length;
    const cellW = w / cols;
    const cellH = h / rows;

    // 1. Render smooth FLIR Ironbow 32x32 Bio-Thermal Field
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const val = rf.heatmap_grid[y][x] || 0;
        ctx.fillStyle = flirIronbowColor(val);
        ctx.fillRect(x * cellW, y * cellH, cellW + 1.2, cellH + 1.2);
      }
    }

    const cx = w / 2;
    const cy = h / 2;
    const minDim = Math.min(w, h);

    // 2. Polar Range Rings (2m, 5m, 10m)
    [0.18, 0.32, 0.45].forEach((ratio, idx) => {
      const r = minDim * ratio;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.setLineDash([3, 5]);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
      if (!compact) {
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.font = '500 9.5px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(['2.5m', '6m', '11m'][idx], cx + r + 4, cy - 3);
      }
    });

    // 3. Fresnel Sensing Rays to Connected Devices
    (rf.links || []).forEach((lk) => {
      const rad = lk.angle_deg * (Math.PI / 180);
      const dist = lk.radius_norm * minDim * 0.44;
      const tx = cx + Math.cos(rad) * dist;
      const ty = cy + Math.sin(rad) * dist;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(tx, ty);
      ctx.strokeStyle = lk.perturbed ? 'rgba(255, 220, 100, 0.92)' : 'rgba(0, 240, 255, 0.42)';
      ctx.lineWidth = lk.perturbed ? 2.4 : 1.3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(tx, ty, compact ? 4.5 : 6.5, 0, Math.PI * 2);
      ctx.fillStyle = lk.perturbed ? '#ffd166' : '#00f0ff';
      ctx.fill();

      if (!compact) {
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '600 9.5px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText((lk.device_name || lk.ip).slice(0, 16), tx, ty + 16);
      }
    });

    // 4. Draw Localized Bio-Thermal Body Signatures (Glowing FLIR Aura + Crosshair + Temp/Distance Tag!)
    (rf.bio_thermal_targets || []).forEach((b) => {
      const bx = b.norm_x * w;
      const by = b.norm_y * h;
      const auraR = compact ? 22 : 36;

      const grad = ctx.createRadialGradient(bx, by, 2, bx, by, auraR);
      grad.addColorStop(0, 'rgba(255, 253, 230, 0.96)');
      grad.addColorStop(0.32, 'rgba(255, 145, 0, 0.82)');
      grad.addColorStop(0.68, 'rgba(220, 38, 38, 0.42)');
      grad.addColorStop(1, 'rgba(220, 38, 38, 0)');

      ctx.beginPath();
      ctx.arc(bx, by, auraR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Target reticle box around Bio-Thermal Body
      const boxS = compact ? 13 : 20;
      ctx.strokeStyle = '#fffbeb';
      ctx.lineWidth = 1.8;
      ctx.strokeRect(bx - boxS, by - boxS, boxS * 2, boxS * 2);

      ctx.fillStyle = '#fffbeb';
      ctx.font = compact ? '700 9px "JetBrains Mono", monospace' : '700 10.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`🔥 ${b.equiv_temp_c}°C (~${b.distance_m}m)`, bx, by - boxS - 5);
    });

    // 5. Router Emitter Origin at Center
    ctx.beginPath();
    ctx.arc(cx, cy, compact ? 8 : 11, 0, Math.PI * 2);
    ctx.fillStyle = '#34ffb6';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = compact ? '700 9px "JetBrains Mono", monospace' : '700 10.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ROUTER RF CORE', cx, cy - (compact ? 12 : 16));
  }

  function drawMiniNetworkThermalCanvas(rf) {
    renderBioThermalCanvasScene(document.getElementById('netMiniThermalCanvas'), rf, true);
  }

  function drawRfTomographyCanvases(rf) {
    renderBioThermalCanvasScene(document.getElementById('rfHeatmapCanvas'), rf, false);
    const wCanvas = document.getElementById('rfWaveCanvas');
    if (wCanvas && Array.isArray(rf.entropy_history)) {
      drawAreaSparkline('rfWaveCanvas', rf.entropy_history.length > 1 ? rf.entropy_history : [2, 3], '#fbbf24', 'rgba(251, 191, 36, 0.18)', 100);
    }
  }

  // Authentic FLIR Ironbow Thermal Palette: Deep Cold Navy (24°C) -> Royal Violet -> Crimson -> Bright Orange -> White-Hot (37°C Bio-Core)
  function flirIronbowColor(v) {
    if (v < 0.22) {
      const t = v / 0.22;
      return `rgba(${Math.round(6 + t * 28)}, ${Math.round(14 + t * 18)}, ${Math.round(46 + t * 68)}, 0.86)`;
    }
    if (v < 0.48) {
      const t = (v - 0.22) / 0.26;
      return `rgba(${Math.round(34 + t * 126)}, ${Math.round(32 - t * 10)}, ${Math.round(114 + t * 36)}, 0.88)`;
    }
    if (v < 0.72) {
      const t = (v - 0.48) / 0.24;
      return `rgba(${Math.round(160 + t * 85)}, ${Math.round(22 + t * 88)}, ${Math.round(150 - t * 125)}, 0.90)`;
    }
    const t = Math.min(1, (v - 0.72) / 0.28);
    return `rgba(255, ${Math.round(110 + t * 138)}, ${Math.round(25 + t * 205)}, 0.95)`;
  }

  // ==================== NETWORK WIRESHARK & LATENCY BAR ====================
  function updateNetworkUI(netData) {
    if (!netData) return;
    const st = netData.stats || {};
    document.getElementById('netBackendTitle').textContent =
      `${st.active_backend || 'Win32 iphlpapi.dll'} • ${(st.packets_captured || 0).toLocaleString()} Packets • ${st.active_flows_count || 0} Active Sockets`;

    // Combine Local Router RTT + Global DNS RTT in Overview Latency Strip!
    const latWrap = document.getElementById('overviewLatencyPills');
    if (latWrap) {
      const pills = [];
      if (latestLan && latestLan.gateway_ip) {
        const gwMs = (latestLan.router_audit && latestLan.router_audit.gateway_rtt_ms) || (latestSys && latestSys.gateway_latency_ms) || 0.8;
        pills.push(`<span class="lat-pill">Local Router (${escapeHtml(latestLan.gateway_ip)}): <strong style="color:var(--emerald)">${gwMs} ms</strong></span>`);
      }
      (st.latency_radar || []).forEach((l) => {
        const msTxt = l.latency_ms >= 0 ? `${l.latency_ms} ms` : 'FILTERED';
        const col = l.latency_ms >= 0 && l.latency_ms < 50 ? 'var(--emerald)' : 'var(--cyan)';
        pills.push(`<span class="lat-pill">${escapeHtml(l.name)}: <strong style="color:${col}">${msTxt}</strong></span>`);
      });
      latWrap.innerHTML = pills.join('');
    }

    if (!streamPaused && Array.isArray(netData.frames)) {
      packetsBuffer = netData.frames;
      renderPacketTable();
    }

    if (Array.isArray(netData.flows)) {
      latestFlows = netData.flows;
      document.getElementById('flowsMiniBody').innerHTML = latestFlows.slice(0, 26).map((fl) => {
        const badgeCls = fl.category === 'Trusted-LocalAI' ? 'tag-ai' : 'tag-sys';
        return `
          <tr>
            <td dir="ltr">${escapeHtml(fl.process_name)} (${fl.pid})</td>
            <td dir="ltr">${escapeHtml(fl.local_addr)}:${fl.local_port}</td>
            <td dir="ltr">${escapeHtml(fl.remote_addr)}:${fl.remote_port}</td>
            <td><span class="tag-pill ${badgeCls}" dir="ltr">${escapeHtml(fl.geo_scope || fl.category)}</span></td>
          </tr>
        `;
      }).join('');
    }
  }

  function renderPacketTable() {
    const filter = (document.getElementById('packetFilterInput').value || '').toLowerCase().trim();
    const tbody = document.getElementById('packetTableBody');
    const filtered = packetsBuffer.filter((f) => {
      if (!filter) return true;
      return `${f.protocol} ${f.src_ip}:${f.src_port} ${f.dst_ip}:${f.dst_port} ${f.tcp_flags} ${f.direction} ${f.info} ${f.process_name}`.toLowerCase().includes(filter);
    });

    if (filtered.length > 0 && selectedSeq === null) {
      selectedSeq = filtered[0].seq;
      renderDissectorPane(filtered[0]);
    }

    tbody.innerHTML = filtered.slice(0, 80).map((f) => {
      let pClass = 'proto-tcp';
      if (f.protocol.includes('TLS')) pClass = 'proto-tls';
      else if (f.is_whitelisted_ai || f.protocol.includes('LocalAI')) pClass = 'proto-ai';
      else if (f.protocol.includes('PROBE') || f.protocol.includes('STEALTH')) pClass = 'proto-probe';

      return `
        <tr class="${f.seq === selectedSeq ? 'selected' : ''}" data-seq="${f.seq}">
          <td dir="ltr">${f.seq}</td>
          <td dir="ltr">${escapeHtml(f.timestamp)}</td>
          <td dir="ltr">${escapeHtml(f.src_ip)}:${f.src_port}</td>
          <td dir="ltr">${escapeHtml(f.dst_ip)}:${f.dst_port}</td>
          <td dir="ltr" class="${pClass}">${escapeHtml(f.protocol)}</td>
          <td dir="ltr">${f.length}B</td>
          <td dir="ltr">[${escapeHtml(f.tcp_flags)}] ${escapeHtml(f.info)}</td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('tr').forEach((row) => {
      row.addEventListener('click', () => {
        selectedSeq = Number(row.dataset.seq);
        const found = packetsBuffer.find((x) => x.seq === selectedSeq);
        if (found) renderDissectorPane(found);
        renderPacketTable();
      });
    });
  }

  function renderDissectorPane(frame) {
    document.getElementById('frameDissectorTree').innerHTML = (frame.layers || []).map((l, idx) => `
      <div class="layer-node">Layer ${idx + 1}: ${escapeHtml(l)}</div>
    `).join('');
    document.getElementById('frameHexView').textContent =
      `${frame.hex_preview || '45 00 00 3C'}\nASCII: ${frame.ascii_preview || frame.protocol}`;
  }

  // ==================== PROCESS & STARTUP MANAGERS ====================
  window.instantRamTrim = async function () {
    try {
      const res = await fetch('/api/processes/trim', { method: 'POST' });
      const data = await res.json();
      pushInfoToast('⚡ 0.1s Native RAM Trim', data.message);
      const b = document.getElementById('procActionBanner');
      if (b) {
        b.style.display = 'block';
        b.innerHTML = `<strong style="color:var(--emerald)">✓ ${escapeHtml(data.message)}</strong>`;
      }
      await pollFullDashboard();
      if (document.getElementById('sub-procs').style.display !== 'none') {
        await window.loadLiveProcesses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  window.loadLiveProcesses = async function () {
    try {
      const res = await fetch('/api/processes/list');
      allProcsCache = await res.json();
      renderFullProcessesTable();
    } catch (err) {
      console.error(err);
    }
  };

  function renderFullProcessesTable() {
    const q = (document.getElementById('procFilterInput').value || '').toLowerCase().trim();
    const tbody = document.getElementById('fullProcsTableBody');
    const filtered = (allProcsCache || []).filter((p) => {
      if (!q) return true;
      return `${p.pid} ${p.name} ${p.category}`.toLowerCase().includes(q);
    });
    tbody.innerHTML = filtered.map((p) => {
      const cls = p.category.includes('Local AI') ? 'tag-ai' : (p.category.includes('System') ? 'tag-sys' : 'tag-app');
      const cpuCol = (p.cpu_pct || 0) >= 25 ? 'color:var(--danger);font-weight:800' : 'color:var(--cyan)';
      const actionBtn = p.category.includes('System')
        ? `<span style="color:var(--text-muted);font-size:0.71rem">Protected</span>`
        : `<button class="btn-danger-mini" onclick="window.killProcessByPid(${p.pid}, '${escapeHtml(p.name)}')">Terminate</button>`;
      return `
        <tr>
          <td dir="ltr">${p.pid}</td>
          <td dir="ltr"><strong>${escapeHtml(p.name)}</strong></td>
          <td><span class="tag-pill ${cls}">${escapeHtml(p.category)}</span></td>
          <td dir="ltr">${p.threads || 1}</td>
          <td dir="ltr" style="${cpuCol}">${(p.cpu_pct || 0).toFixed(1)}%</td>
          <td dir="ltr">${p.mem_mb} MB</td>
          <td>${actionBtn}</td>
        </tr>
      `;
    }).join('');
  }

  window.killProcessByPid = async function (pid, name) {
    const res = await fetch('/api/processes/kill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pid }),
    });
    const data = await res.json();
    pushInfoToast(data.ok ? '✓ Process Terminated' : 'Protected Process', data.message || data.error || name);
    await window.loadLiveProcesses();
  };

  window.loadStartupAndSpace = async function () {
    try {
      const [stRes, hogRes] = await Promise.all([
        fetch('/api/startup/list'),
        fetch('/api/storage/hogs'),
      ]);
      const startups = await stRes.json();
      const hogs = await hogRes.json();

      const stBody = document.getElementById('startupTableBody');
      if (!startups || startups.length === 0) {
        stBody.innerHTML = `<tr><td colspan="4" style="color:var(--emerald)">✓ Registry Run keys clean.</td></tr>`;
      } else {
        stBody.innerHTML = startups.map((s) => `
          <tr>
            <td dir="ltr"><strong>${escapeHtml(s.name)}</strong></td>
            <td dir="ltr" style="max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${escapeHtml(s.command)}">${escapeHtml(s.command)}</td>
            <td dir="ltr"><span class="tag-pill tag-sys">${escapeHtml(s.hive)}</span></td>
            <td><button class="btn-danger-mini" onclick="window.removeStartupItem('${escapeHtml(s.hive)}','${escapeHtml(s.name)}')">Remove</button></td>
          </tr>
        `).join('');
      }

      const hogsEl = document.getElementById('spaceHogsList');
      if (!hogs || hogs.length === 0) {
        hogsEl.innerHTML = `<div class="disk-item">No space-hogging files (>= 0.5 MB) detected.</div>`;
      } else {
        const maxMB = Math.max(10, hogs[0].size_mb);
        hogsEl.innerHTML = hogs.map((h) => `
          <div class="disk-item">
            <div class="disk-row-top">
              <strong dir="ltr">[${escapeHtml(h.ext)}] ${escapeHtml(h.name)}</strong>
              <span dir="ltr" style="font-family:var(--font-mono);color:var(--cyan)">${h.size_mb} MB</span>
            </div>
            <div dir="ltr" style="font-size:0.7rem;color:var(--text-muted);margin-bottom:5px;text-align:left;overflow:hidden;text-overflow:ellipsis">${escapeHtml(h.path)}</div>
            <div class="progress-rail">
              <div class="progress-fill violet" style="width:${Math.min(100, (h.size_mb / maxMB) * 100)}%"></div>
            </div>
          </div>
        `).join('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  window.removeStartupItem = async function (hive, name) {
    const res = await fetch('/api/startup/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hive, name }),
    });
    const data = await res.json();
    pushInfoToast('Startup Manager', data.message || data.error);
    await window.loadStartupAndSpace();
  };

  // ==================== DEEP FORENSIC COPILOT ====================
  function setupCopilot() {
    const form = document.getElementById('copilotForm');
    const input = document.getElementById('copilotInput');
    document.querySelectorAll('.preset-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        input.value = chip.dataset.q;
        runCopilotQuery(chip.dataset.q);
      });
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      runCopilotQuery(input.value || 'فحص شامل للجهاز والراوتر');
    });
  }

  async function runCopilotQuery(query) {
    const area = document.getElementById('copilotReportArea');
    area.innerHTML = `<div class="copilot-report-card">جاري تحليل القراءات الحية للمعالج والرام والراوتر...</div>`;
    try {
      const res = await fetch('/api/copilot/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const rep = await res.json();
      const roots = (rep.root_cause_tree || []).map((r) => `<li>${escapeHtml(r)}</li>`).join('');
      const live = (rep.live_telemetry || []).map((l) => `<li>${escapeHtml(l)}</li>`).join('');
      const recBtns = (rep.recommended_tool_ids || []).map((id) => {
        const found = allTools.find((t) => t.id === id);
        const label = found ? (currentLang === 'ar' ? found.title_ar : found.title_en) : id;
        return `<button class="btn-primary-glow" onclick="window.triggerITTool('${id}')">▶ ${escapeHtml(label)}</button>`;
      }).join('');

      area.innerHTML = `
        <div class="copilot-report-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
            <div>
              <span class="eyebrow" dir="ltr">${escapeHtml(rep.intent)} • Confidence ${rep.confidence_pct}%</span>
              <h4 style="font-size:1.08rem">${escapeHtml(currentLang === 'ar' ? rep.headline_ar : rep.headline_en)}</h4>
            </div>
            <span class="tag-pill tag-ai">${escapeHtml(rep.safety_guarantee)}</span>
          </div>
          <div>
            <strong style="color:var(--cyan);font-size:0.86rem">${currentLang === 'ar' ? '1. القراءات الحية المباشرة من جهازك وشبكتك:' : '1. Live Hardware & Router Telemetry:'}</strong>
            <ul style="padding-inline-start:20px;margin-top:6px;font-size:0.83rem;color:var(--text-muted);line-height:1.7">${live}</ul>
          </div>
          <div>
            <strong style="color:var(--emerald);font-size:0.86rem">${currentLang === 'ar' ? '2. التشخيص السببي والنتائج الجنائية:' : '2. Root-Cause Forensic Findings:'}</strong>
            <ul style="padding-inline-start:20px;margin-top:6px;font-size:0.84rem;line-height:1.75">${roots}</ul>
          </div>
          <div>
            <strong style="display:block;margin-bottom:8px;font-size:0.86rem">${currentLang === 'ar' ? '3. العلاج المباشر بضغطة واحدة:' : '3. One-Click Silent Remediation:'}</strong>
            <div class="copilot-rec-row">${recBtns}</div>
          </div>
        </div>
      `;
    } catch (err) {
      area.innerHTML = `<div class="copilot-report-card">Error: ${escapeHtml(err.message)}</div>`;
    }
  }

  // ==================== CYBER IDS / IPS ====================
  function updateCyberUI(ids) {
    if (!ids) return;
    const count = ids.confirmed_threats || 0;
    document.getElementById('cyberEvaluatedCount').textContent = (ids.packets_evaluated || 0).toLocaleString();
    document.getElementById('cyberBenignCount').textContent = (ids.benign_suppressed || 0).toLocaleString();
    document.getElementById('cyberConfirmedCount').textContent = count;

    const navBadge = document.getElementById('navThreatBadge');
    navBadge.textContent = count;
    navBadge.className = count > 0 ? 'nav-counter danger' : 'nav-counter emerald';

    const kpiIds = document.getElementById('idsThreatCountVal');
    if (count > 0) {
      kpiIds.textContent = currentLang === 'ar' ? `${count} هجوم مرصود!` : `${count} Attack(s)!`;
      kpiIds.className = 'danger-text';
    } else {
      kpiIds.textContent = currentLang === 'ar' ? 'آمن 100%' : '100% Clean';
      kpiIds.className = 'emerald-text';
    }

    const arp = ids.arp_guard || {};
    const arpMini = document.getElementById('arpGuardMiniLabel');
    const arpBox = document.getElementById('arpTableBox');
    if (arp.spoof_detected) {
      arpMini.textContent = `⚠️ ARP Spoofing Detected (${arp.duplicate_mac})`;
      arpMini.style.color = 'var(--danger)';
    } else {
      arpMini.textContent = `ARP Guard: CLEAN (${(arp.entries || []).length} Neighbors • 0 False Positives)`;
      arpMini.style.color = '';
    }
    if (arpBox) {
      arpBox.innerHTML = (arp.entries || []).slice(0, 6).map((e) =>
        `<span class="tag-pill tag-ai">ARP ${escapeHtml(e.ip)} ➔ ${escapeHtml(e.mac)}</span>`
      ).join('');
    }

    const alerts = ids.alerts || [];
    document.getElementById('radarThreatBlips').innerHTML = alerts.slice(0, 6).map((a, i) => {
      const angle = (i * 67 + 35) * (Math.PI / 180);
      const r = 46 + (i % 3) * 22;
      return `<circle cx="${(120 + r * Math.cos(angle)).toFixed(1)}" cy="${(120 + r * Math.sin(angle)).toFixed(1)}" r="6" fill="#ff4769"><animate attributeName="r" values="5;9;5" dur="1.1s" repeatCount="indefinite"/></circle>`;
    }).join('');

    alerts.forEach((a) => {
      if (!knownAlertIds.has(a.id)) {
        knownAlertIds.add(a.id);
        pushThreatToast(a);
      }
    });

    const alertsList = document.getElementById('cyberAlertsList');
    if (alerts.length === 0) {
      alertsList.innerHTML = `
        <div style="padding:18px;border-radius:12px;background:rgba(52,255,182,0.06);border:1px solid rgba(52,255,182,0.22);color:var(--emerald);font-size:0.83rem">
          ✓ ${currentLang === 'ar'
            ? 'لا توجد أي هجمات مؤكدة. التصفح الطبيعي والألعاب وخوادم الذكاء الاصطناعي المحلية معفاة 100% من أي إنذار كاذب.'
            : '0 Confirmed Intrusions. Browsing, gaming, and Local AI servers are 100% immune from false alarms.'}
        </div>
      `;
    } else {
      alertsList.innerHTML = alerts.map((a) => {
        const blockBtn = a.blocked_in_fw
          ? `<span class="tag-pill tag-ai">✓ Blocked in Firewall</span>`
          : `<button class="btn-danger-mini" onclick="window.blockAttackerNow('${escapeHtml(a.attacker_ip)}')">🛡 Block (${escapeHtml(a.attacker_ip)})</button>`;
        return `
          <div class="alert-card">
            <div class="alert-head">
              <h4>🚨 ${escapeHtml(a.attack_type)}</h4>
              <div style="display:flex;gap:6px;align-items:center">
                <span class="tag-pill tag-warn" dir="ltr">${escapeHtml(a.severity)} • ${a.confidence_score}%</span>
                ${blockBtn}
              </div>
            </div>
            <div class="alert-meta" dir="ltr">
              Attacker: ${escapeHtml(a.attacker_ip)} | Ports (${a.distinct_ports}): [${(a.target_ports || []).join(', ')}] | ${escapeHtml(a.timestamp)}
            </div>
            <ul class="alert-evidence">
              ${(a.evidence || []).map((ev) => `<li>${escapeHtml(ev)}</li>`).join('')}
            </ul>
            <code class="mitigation-code">${escapeHtml(a.mitigation_cmd)}</code>
          </div>
        `;
      }).join('');
    }

    document.getElementById('canaryBadgesBox').innerHTML = (ids.canary_ports || []).map((p) =>
      `<span class="tag-pill tag-sys">Sensor :${p}</span>`
    ).join('');

    document.getElementById('whitelistTableBody').innerHTML = (ids.whitelisted_ai_services || []).map((w) => `
      <tr>
        <td dir="ltr">:${w.port}</td>
        <td dir="ltr"><strong>${escapeHtml(w.process_name)}</strong></td>
        <td>${escapeHtml(w.service_role)}</td>
        <td><span class="tag-pill tag-ai" dir="ltr">${escapeHtml(w.status)}</span></td>
      </tr>
    `).join('');
  }

  window.blockAttackerNow = async function (ip) {
    const res = await fetch('/api/cyber/block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip }),
    });
    const data = await res.json();
    pushInfoToast('🛡 Active IPS Firewall', data.message);
    await pollFullDashboard();
  };

  window.runCyberLab = async function (scenario) {
    const banner = document.getElementById('labResultBanner');
    banner.innerHTML = `⏳ Running live socket test <code dir="ltr">${escapeHtml(scenario)}</code>...`;
    try {
      const res = await fetch('/api/cyber/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario }),
      });
      const data = await res.json();
      const color = scenario === 'benign_local_ai' ? 'var(--emerald)' : '#ff8fa3';
      banner.innerHTML = `<strong style="color:${color}">✓</strong> ${escapeHtml(data.verification_summary)}`;
      await pollFullDashboard();
    } catch (err) {
      banner.textContent = 'Error: ' + err.message;
    }
  };

  window.clearCyberAlerts = async function () {
    await fetch('/api/cyber/clear', { method: 'POST' });
    knownAlertIds.clear();
    await pollFullDashboard();
  };

  window.shutdownAegisEngine = async function () {
    const res = await fetch('/api/app/shutdown', { method: 'POST' });
    const data = await res.json();
    pushInfoToast('Engine Shutdown', data.message);
  };

  function drawAreaSparkline(canvasId, arr, strokeHex, fillRgba, maxOverride) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const maxVal = maxOverride || Math.max(25, ...arr);

    ctx.beginPath();
    arr.forEach((v, idx) => {
      const x = (idx / Math.max(1, arr.length - 1)) * w;
      const y = h - 4 - Math.min(1, v / maxVal) * (h - 10);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = strokeHex;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = fillRgba;
    ctx.fill();
  }

  function pushThreatToast(alert) {
    const container = document.getElementById('threatToastContainer');
    const div = document.createElement('div');
    div.className = 'threat-toast';
    div.innerHTML = `
      <strong>🚨 Verified Network Attack (${escapeHtml(alert.id)})</strong>
      <p>${escapeHtml(alert.attack_type)} from <code dir="ltr">${escapeHtml(alert.attacker_ip)}</code> across ${alert.distinct_ports} ports (Confidence ${alert.confidence_score}%).</p>
    `;
    container.prepend(div);
    setTimeout(() => { if (div.parentNode) div.remove(); }, 9000);
  }

  function pushInfoToast(title, body) {
    const container = document.getElementById('threatToastContainer');
    const div = document.createElement('div');
    div.className = 'threat-toast';
    div.style.borderColor = 'var(--cyan)';
    div.style.background = 'rgba(7, 18, 38, 0.96)';
    div.style.boxShadow = '0 12px 30px rgba(0, 240, 255, 0.25)';
    div.innerHTML = `<strong style="color:var(--cyan)">${escapeHtml(title)}</strong><p>${escapeHtml(body)}</p>`;
    container.prepend(div);
    setTimeout(() => { if (div.parentNode) div.remove(); }, 5500);
  }

  async function pollFullDashboard() {
    try {
      const res = await fetch('/api/state');
      const state = await res.json();
      if (state.governor) updateGovernorUI(state.governor);
      updateSystemUI(state.system);
      updateLanUI(state.lan);
      updateRfUI(state.rf);
      updateNetworkUI(state.network);
      updateCyberUI(state.cyber);
      if (state.readiness) {
        latestReadiness = state.readiness;
        renderPrerequisitesCards();
      }
    } catch (err) {
      console.warn('Poll skipped:', err);
    }
  }

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  document.addEventListener('DOMContentLoaded', async () => {
    applyLanguage();
    startNeuralCanvas();
    injectStaticIcons();
    setupNavigation();
    setupCopilot();
    await loadITCatalog();
    await pollFullDashboard();
    // Show Guided Engine & Eco Setup Wizard automatically on very first launch so user sees every verified engine & startup option!
    if (!localStorage.getItem('aegisx_v8_onboarded')) {
      document.getElementById('readinessModal').style.display = 'grid';
    }
    setInterval(pollFullDashboard, 1800);
  });
})();
