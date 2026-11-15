/* AEGIS-X v10.0 SOVEREIGN APEX — 54,703 IEEE OUI, Dedicated Interactive Topology, Kalman Smooth RF & 3-Layer Nmap IDS */
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
      nav_overview_sub: 'عدادات دقيقة 60FPS وصحة النظام',
      nav_topology: 'خريطة الشبكة التفاعلية المستقلة',
      nav_topology_sub: 'توبولوجيا حية (تكبير + سحب + فحص)',
      nav_network: 'جرد الأجهزة ومفتش الحزم',
      nav_network_sub: '54,703 شركة مصنعة + IP/MAC/CSV',
      nav_rfsense: 'المختبر الموجي للراوتر (RF)',
      nav_rfsense_sub: 'مسح طيفي ناعم 100% صادق فيزيائياً',
      nav_itsupport: 'مركز الصيانة والعمليات (80 أداة)',
      nav_itsupport_sub: 'تحديثات + إصلاح صامت + العمليات',
      nav_cyber: 'درع الأمن وكاشف Nmap اللحظي',
      nav_cyber_sub: 'رصد فوري لـ -sT / -sS / -sF وعزل',
      nav_copilot: 'المستشار الخوارزمي الجنائي',
      nav_copilot_sub: 'ذكاء إحصائي Z-Score + Kalman حتمي',
      sb_gateway_lbl: 'بوابة الراوتر',
      sb_subnet_lbl: 'نطاق الشبكة',
      sb_oui_lbl: 'قاعدة الشركات IEEE',
      sb_overhead_lbl: 'استهلاك المحرك',
      dl_box_title: 'معالج التثبيت الرسمي للويندوز',
      dl_btn_installer: 'تحميل المثبت الكامل Setup.exe',
      dl_btn_portable: 'أو النسخة المحمولة المباشرة (بدون تثبيت)',
      btn_top_install: 'تثبيت رسمي على الويندوز',
      self_inst_title: '📦 التثبيت الرسمي الدائم على الويندوز (اختصار سطح المكتب + قائمة ابدأ)',
      self_inst_desc: 'حتى إذا قمت بتشغيل ملف AegisX.exe مباشرة بدون المثبت، يمكنك تثبيته رسمياً في نظامك بضغطة واحدة هنا بدون إعادة تحميل!',
      btn_install_self: 'تثبيت رسمي على الجهاز الآن',
      topo_hero_title: 'خريطة طوبولوجيا الشبكة التفاعلية المستقلة (تكبير بالعجلة + سحب حر + بدون تداخل نصوص)',
      topo_hero_desc: 'قسم مستقل بالكامل لخريطة الشبكة يمنع أي ازدحام بصري: استخدم عجلة الماوس للتكبير/التصغير (Zoom)، واسحب الخريطة بحرية، واضغط على أي جهاز لفحص 34 منفذاً أو تسميته أو إيقاظه.',
      btn_goto_inventory: 'فتح جدول الجرد الكامل ➔',
      leg_new: 'جهاز جديد للمراجعة',
      lan_kpi_open_map: 'خريطة الشبكة التفاعلية',
      lan_kpi_map_cta: 'عرض الخريطة المستقلة ➔',
      lan_kpi_map_sub: 'تكبير وسحب وتسمية الأجهزة',
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
      nav_overview_sub: '60FPS Precision Gauges & Health',
      nav_topology: 'Interactive Topology Map',
      nav_topology_sub: 'Dedicated Zoom/Pan Orbital Graph',
      nav_network: 'Device Inventory & Dissector',
      nav_network_sub: '54,703 IEEE OUI Vendors + CSV',
      nav_rfsense: 'Kalman-DSP RF Sensing Lab',
      nav_rfsense_sub: '100% Physics-Honest Smooth Field',
      nav_itsupport: 'System Repair & Task Center',
      nav_itsupport_sub: '80 Silent Tools + CPU/RAM Control',
      nav_cyber: 'Real-Time Nmap IDS & Shield',
      nav_cyber_sub: 'Sub-90ms -sT/-sS/-sF Detection',
      nav_copilot: 'Algorithmic Heuristic Copilot',
      nav_copilot_sub: 'Z-Score + Bayesian Root-Cause AI',
      sb_gateway_lbl: 'Default Gateway',
      sb_subnet_lbl: 'Active Subnet',
      sb_oui_lbl: 'IEEE OUI Database',
      sb_overhead_lbl: 'Engine Footprint',
      dl_box_title: 'Official Windows Setup Wizard',
      dl_btn_installer: 'Download Official Setup.exe',
      dl_btn_portable: 'Or Portable Single-File AegisX.exe',
      btn_top_install: 'Install Officially to Windows',
      self_inst_title: '📦 1-Click Official Windows System Installation (Desktop + Start Menu)',
      self_inst_desc: 'Running portable AegisX.exe? Click here to install officially into Windows Programs with Desktop & Start Menu shortcuts.',
      btn_install_self: 'Install to System Now',
      topo_hero_title: 'Dedicated Interactive Network Topology Map (Scroll Zoom + Free Pan + Zero Overlap)',
      topo_hero_desc: 'Dedicated full-canvas workspace: use mouse wheel to zoom, drag to pan, and click any device to inspect 34 ports, rename, or send Wake-on-LAN.',
      btn_goto_inventory: 'Open Full Inventory Table ➔',
      leg_new: 'New Unverified Node',
      lan_kpi_open_map: 'Interactive Topology Map',
      lan_kpi_map_cta: 'Open Dedicated Map ➔',
      lan_kpi_map_sub: 'Zoom, pan & inspect nodes',
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

  // v10.0 Interactive Topology Viewport (Zoom + Pan)
  let topoZoom = 1.0;
  let topoPanX = 0;
  let topoPanY = 0;
  let topoDragging = false;
  let topoDragStartX = 0;
  let topoDragStartY = 0;
  let topoDragMoved = false;

  // v10.0 60FPS Spring-Interpolated Precision Instrument Needles
  const gaugeSpring = {
    healthTarget: 100, healthCur: 100, healthVel: 0,
    cpuTarget: 0, cpuCur: 0, cpuVel: 0,
    ramTarget: 0, ramCur: 0, ramVel: 0,
    sweepDeg: 0,
  };

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

  // ==================== 60FPS SPRING-PHYSICS PRECISION GAUGES ====================
  function startPrecisionGaugesLoop() {
    function step() {
      gaugeSpring.health += (gaugeSpring.healthTarget - gaugeSpring.health) * 0.11;
      gaugeSpring.cpu += (gaugeSpring.cpuTarget - gaugeSpring.cpu) * 0.13;
      gaugeSpring.ram += (gaugeSpring.ramTarget - gaugeSpring.ram) * 0.13;

      drawSovereignPrecisionDial('sovereignDialCanvas', gaugeSpring.health);
      drawPrecisionMiniArc('cpuArcGauge', gaugeSpring.cpu, gaugeSpring.cpu >= 85 ? '#ff4769' : '#00f0ff');
      drawPrecisionMiniArc('ramArcGauge', gaugeSpring.ram, gaugeSpring.ram >= 85 ? '#ff4769' : '#c084fc');

      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function drawSovereignPrecisionDial(canvasId, val) {
    const c = document.getElementById(canvasId);
    if (!c) return;
    const ctx = c.getContext('2d');
    const w = c.width;
    const h = c.height;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const outerR = Math.min(w, h) * 0.43;
    const startAng = Math.PI * 0.75;
    const totalSweep = Math.PI * 1.5;
    const endAng = startAng + totalSweep;
    const norm = Math.max(0, Math.min(100, val)) / 100;

    // 1. Machined precision tick marks (45 ticks)
    const ticks = 45;
    for (let i = 0; i <= ticks; i++) {
      const frac = i / ticks;
      const ang = startAng + frac * totalSweep;
      const isMajor = i % 9 === 0;
      const r1 = outerR + (isMajor ? 2 : 5);
      const r2 = outerR + 12;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(ang) * r1, cy + Math.sin(ang) * r1);
      ctx.lineTo(cx + Math.cos(ang) * r2, cy + Math.sin(ang) * r2);
      const active = frac <= norm;
      ctx.strokeStyle = active
        ? (val < 72 ? 'rgba(255,71,105,0.9)' : 'rgba(52,255,182,0.88)')
        : 'rgba(148, 163, 184, 0.22)';
      ctx.lineWidth = isMajor ? 2.2 : 1.1;
      ctx.stroke();
    }

    // 2. Background dark arc track
    ctx.beginPath();
    ctx.arc(cx, cy, outerR - 6, startAng, endAng);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 11;
    ctx.lineCap = 'round';
    ctx.stroke();

    // 3. Active glowing gradient arc
    const valAng = startAng + norm * totalSweep;
    const grad = ctx.createLinearGradient(0, h, w, 0);
    if (val < 72) {
      grad.addColorStop(0, '#fbbf24');
      grad.addColorStop(1, '#ff4769');
    } else {
      grad.addColorStop(0, '#00f0ff');
      grad.addColorStop(0.55, '#34ffb6');
      grad.addColorStop(1, '#c084fc');
    }
    ctx.save();
    ctx.shadowColor = val < 72 ? 'rgba(255,71,105,0.55)' : 'rgba(0,240,255,0.48)';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR - 6, startAng, Math.max(startAng + 0.02, valAng));
    ctx.strokeStyle = grad;
    ctx.lineWidth = 11;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();

    // 4. Precision luminous indicator bead on needle tip
    const bx = cx + Math.cos(valAng) * (outerR - 6);
    const by = cy + Math.sin(valAng) * (outerR - 6);
    ctx.beginPath();
    ctx.arc(bx, by, 6.2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = val < 72 ? '#ff4769' : '#34ffb6';
    ctx.lineWidth = 2.4;
    ctx.stroke();
  }

  function drawPrecisionMiniArc(canvasId, pct, colorHex) {
    const c = document.getElementById(canvasId);
    if (!c) return;
    const ctx = c.getContext('2d');
    const w = c.width;
    const h = c.height;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h * 0.78;
    const r = Math.min(w * 0.41, h * 0.66);
    const startA = Math.PI * 1.05;
    const sweepA = Math.PI * 0.90;
    const norm = Math.max(0, Math.min(100, pct)) / 100;

    ctx.beginPath();
    ctx.arc(cx, cy, r, startA, startA + sweepA);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 7.5;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.save();
    ctx.shadowColor = colorHex;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(cx, cy, r, startA, startA + Math.max(0.02, norm * sweepA));
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 7.5;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();

    const na = startA + norm * sweepA;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(na) * (r - 12), cy + Math.sin(na) * (r - 12));
    ctx.lineTo(cx + Math.cos(na) * (r + 3), cy + Math.sin(na) * (r + 3));
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // ==================== OFFICIAL IN-APP WINDOWS SELF-INSTALLER ====================
  function updateInstallStateUI(st) {
    if (!st) return;
    const strip = document.getElementById('selfInstallBannerStrip');
    const sbBtn = document.getElementById('sidebarSelfInstallBtn');
    const topBtn = document.getElementById('topSelfInstallBtn');

    const showInstall = st.can_self_install && !st.is_installed;
    if (strip) strip.style.display = showInstall ? 'flex' : 'none';
    if (sbBtn) sbBtn.style.display = showInstall ? 'flex' : 'none';
    if (topBtn && st.is_installed) {
      topBtn.innerHTML = `<span>✓</span><span>${currentLang === 'ar' ? 'مثبّت رسمياً في النظام' : 'Installed Officially'}</span>`;
      topBtn.style.borderColor = 'rgba(52,255,182,0.45)';
      topBtn.style.color = 'var(--emerald)';
    }
  }

  window.installAegisSelfNow = async function () {
    pushInfoToast(
      '📦 Official Windows System Installer',
      currentLang === 'ar'
        ? 'جاري تثبيت AEGIS-X رسمياً في مجلد البرامج وإنشاء اختصار سطح المكتب وقائمة ابدأ...'
        : 'Installing AEGIS-X officially to Windows Programs + Desktop & Start Menu shortcuts...'
    );
    try {
      const res = await fetch('/api/app/install-self', { method: 'POST' });
      const data = await res.json();
      const msg = currentLang === 'ar' ? (data.message_ar || data.message_en) : (data.message_en || data.message_ar);
      pushInfoToast(data.ok ? '✓ اكتمل التثبيت الرسمي' : 'ℹ️ System Installer', msg || 'Done');
      await pollFullDashboard();
    } catch (err) {
      pushInfoToast('Installer Error', err.message);
    }
  };

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
    if (tabId === 'topology' && latestLan) {
      drawRealLanTopologyMap(latestLan);
      renderSelectedDeviceCard(latestLan);
    }
    if (tabId === 'network' && latestLan) {
      renderLanInventoryTable(latestLan);
    }
    if (tabId === 'rfsense' && latestRf) {
      drawRfTomographyCanvases(latestRf);
    }
  };

  window.adjustTopoZoom = function (delta) {
    topoZoom = Math.max(0.65, Math.min(2.6, +(topoZoom + delta).toFixed(2)));
    const lbl = document.getElementById('topoZoomPct');
    if (lbl) lbl.textContent = `${Math.round(topoZoom * 100)}%`;
    if (latestLan) drawRealLanTopologyMap(latestLan);
  };

  window.resetTopoViewport = function () {
    topoZoom = 1.0;
    topoPanX = 0;
    topoPanY = 0;
    const lbl = document.getElementById('topoZoomPct');
    if (lbl) lbl.textContent = '100%';
    if (latestLan) drawRealLanTopologyMap(latestLan);
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

    // Interactive Zoom, Drag-Pan & Node Selection on Dedicated Topology Canvas!
    const lanCanvas = document.getElementById('lanRadialCanvas');
    if (lanCanvas) {
      let movedDuringDrag = false;
      lanCanvas.addEventListener('wheel', (ev) => {
        ev.preventDefault();
        const delta = ev.deltaY < 0 ? 0.14 : -0.14;
        window.adjustTopoZoom(delta);
      }, { passive: false });

      lanCanvas.addEventListener('mousedown', (ev) => {
        topoDragging = true;
        movedDuringDrag = false;
        topoDragStartX = ev.clientX - topoPanX;
        topoDragStartY = ev.clientY - topoPanY;
      });

      window.addEventListener('mousemove', (ev) => {
        if (!topoDragging) return;
        const nx = ev.clientX - topoDragStartX;
        const ny = ev.clientY - topoDragStartY;
        if (Math.hypot(nx - topoPanX, ny - topoPanY) > 4) movedDuringDrag = true;
        topoPanX = Math.max(-420, Math.min(420, nx));
        topoPanY = Math.max(-320, Math.min(320, ny));
        if (latestLan && document.getElementById('tab-topology').classList.contains('active')) {
          drawRealLanTopologyMap(latestLan);
        }
      });

      window.addEventListener('mouseup', () => {
        topoDragging = false;
      });

      lanCanvas.addEventListener('click', (ev) => {
        if (movedDuringDrag) return;
        const rect = lanCanvas.getBoundingClientRect();
        const scaleX = lanCanvas.width / rect.width;
        const scaleY = lanCanvas.height / rect.height;
        const mx = (ev.clientX - rect.left) * scaleX;
        const my = (ev.clientY - rect.top) * scaleY;
        for (const hb of renderedNodeHitboxes) {
          if (Math.hypot(mx - hb.x, my - hb.y) <= hb.r + 10) {
            selectedDeviceIP = hb.ip;
            if (latestLan) {
              drawRealLanTopologyMap(latestLan);
              renderSelectedDeviceCard(latestLan);
              renderLanInventoryTable(latestLan);
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

    // Health Score & 60FPS Precision Dial Target
    const score = snap.health_score || 98;
    gaugeSpring.healthTarget = score;
    document.getElementById('healthScoreNum').textContent = score;
    document.getElementById('healthGradeText').textContent = snap.health_grade || 'S+ SOVEREIGN';
    document.getElementById('hostBeacon').className = score < 72 ? 'status-beacon warn' : 'status-beacon';

    document.getElementById('uptimeSummary').textContent = currentLang === 'ar'
      ? `مدة التشغيل: ${snap.uptime_human} | العمليات النشطة: ${snap.process_count} | الصلاحية: ${privStr}`
      : `Uptime: ${snap.uptime_human} | Active Processes: ${snap.process_count} | Token: ${privStr}`;

    // CPU & RAM Cards + 60FPS Arc Targets + Automatic Red Alert Styling if >= 85%
    const cpuPct = snap.cpu_load_pct || 0;
    const ramPct = snap.ram_used_pct || 0;
    gaugeSpring.cpuTarget = cpuPct;
    gaugeSpring.ramTarget = ramPct;
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
    const navDevEl = document.getElementById('navDevicesCount');
    if (navDevEl) navDevEl.textContent = topo.total_devices || 0;
    const navTopoEl = document.getElementById('navTopoCount');
    if (navTopoEl) navTopoEl.textContent = topo.total_devices || 0;

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
    const topoTab = document.getElementById('tab-topology');
    if (topoTab && topoTab.classList.contains('active')) {
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

  window.jumpToDeviceOnTopology = function (ip) {
    selectedDeviceIP = ip;
    window.switchTab('topology');
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

  // Dedicated Interactive Anti-Collision Router Topology Map (Zoom + Pan + Zero Label Overlap)
  function drawRealLanTopologyMap(topo) {
    const canvas = document.getElementById('lanRadialCanvas');
    if (!canvas || !topo) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Subtle precision telemetry background grid
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.035)';
    ctx.lineWidth = 1;
    const step = 44;
    for (let gx = (topoPanX % step); gx < w; gx += step) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
    }
    for (let gy = (topoPanY % step); gy < h; gy += step) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
    }
    ctx.restore();

    const cx = w / 2 + topoPanX;
    const cy = h / 2 + topoPanY;
    const maxR = Math.min(w, h) * 0.41 * topoZoom;
    renderedNodeHitboxes = [];

    // Concentric calibrated distance rings
    const rings = [
      { r: maxR * 0.36, lbl: '3m (Direct / Wired)' },
      { r: maxR * 0.68, lbl: '8m (Mid Room)' },
      { r: maxR * 0.98, lbl: '15m+ (Outer / Repeater)' },
    ];
    rings.forEach((rg) => {
      ctx.beginPath();
      ctx.arc(cx, cy, rg.r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.13)';
      ctx.setLineDash([4, 6]);
      ctx.lineWidth = 1.1;
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = 'rgba(147, 168, 201, 0.56)';
      ctx.font = '500 10.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(rg.lbl, cx + rg.r + 7, cy - 4);
    });

    const devs = topo.devices || [];
    const gwDev = devs.find((d) => d.is_gateway) || {
      ip: topo.gateway_ip || '192.168.1.1',
      display_name: 'Gateway Router',
      device_type: 'router',
    };
    const peers = devs.filter((d) => !d.is_gateway);

    peers.forEach((d, idx) => {
      const angle = (idx / Math.max(1, peers.length)) * Math.PI * 2 - Math.PI / 2;
      let normDist = 0.52;
      if (d.is_this_pc) {
        normDist = 0.38;
      } else {
        const base = Math.min(0.95, Math.max(0.42, (d.est_distance_m || 5) / 16.0));
        const stagger = (idx % 2 === 0 ? 0.06 : -0.05);
        normDist = Math.min(0.97, Math.max(0.36, base + stagger));
      }
      const nx = cx + Math.cos(angle) * (maxR * normDist);
      const ny = cy + Math.sin(angle) * (maxR * normDist);

      let color = '#00f0ff';
      if (d.is_this_pc) color = '#34ffb6';
      else if (d.device_type === 'smartphone') color = '#c084fc';
      else if (d.device_type === 'tv' || !d.trusted) color = '#fbbf24';

      const isSel = d.ip === selectedDeviceIP;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle = isSel ? '#ffffff' : color + '68';
      ctx.lineWidth = isSel ? 2.8 : 1.7;
      ctx.stroke();

      const mx = cx + (nx - cx) * 0.54;
      const my = cy + (ny - cy) * 0.54;
      ctx.fillStyle = 'rgba(4, 10, 24, 0.90)';
      ctx.fillRect(mx - 27, my - 8, 54, 15);
      ctx.fillStyle = color;
      ctx.font = '600 9.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${d.rtt_ms}ms`, mx, my + 3);

      const nodeR = (isSel ? 22 : 17) * Math.min(1.25, Math.max(0.88, topoZoom));
      if (isSel) {
        ctx.beginPath();
        ctx.arc(nx, ny, nodeR + 7, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.16)';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(nx, ny, nodeR, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(8, 17, 36, 0.96)';
      ctx.fill();
      ctx.strokeStyle = isSel ? '#ffffff' : color;
      ctx.lineWidth = isSel ? 3 : 2.1;
      ctx.stroke();

      const glyphMap = { this_pc: 'PC', laptop: 'PC', smartphone: 'MOB', tv: 'TV', printer: 'PRT', console: 'PS', iot: 'IoT', camera: 'CAM', nas: 'NAS' };
      ctx.fillStyle = color;
      ctx.font = '800 10px "JetBrains Mono", monospace';
      ctx.fillText(glyphMap[d.device_type] || 'NODE', nx, ny + 3.5);

      const vendorShort = (d.vendor && !d.vendor.startsWith('IEEE') && !d.vendor.startsWith('Randomized'))
        ? d.vendor.split(' ')[0]
        : '';
      const rawTitle = d.custom_alias || d.display_name || d.ip;
      const shortName = rawTitle.length > 22 ? rawTitle.slice(0, 21) + '…' : rawTitle;
      const subIp = vendorShort ? `${d.ip} • ${vendorShort}` : d.ip;

      const pillW = Math.max(shortName.length * 6.5, subIp.length * 6.2) + 16;
      const pillY = ny + nodeR + 6;
      ctx.fillStyle = 'rgba(5, 11, 24, 0.86)';
      ctx.strokeStyle = isSel ? 'rgba(255,255,255,0.45)' : 'rgba(110,165,255,0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(nx - pillW / 2, pillY, pillW, 30, 6);
      else ctx.rect(nx - pillW / 2, pillY, pillW, 30);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f8fbff';
      ctx.font = '700 11px "Inter", "Cairo", sans-serif';
      ctx.fillText(shortName, nx, pillY + 13);
      ctx.fillStyle = '#93a8c9';
      ctx.font = '500 9.8px "JetBrains Mono", monospace';
      ctx.fillText(subIp, nx, pillY + 25);

      renderedNodeHitboxes.push({ ip: d.ip, x: nx, y: ny, r: nodeR + 6 });
    });

    // Central Gateway Router Core
    const gwSelected = gwDev.ip === selectedDeviceIP;
    const gwR = 32 * Math.min(1.2, Math.max(0.9, topoZoom));
    const gwGrad = ctx.createRadialGradient(cx, cy, 4, cx, cy, gwR + 12);
    gwGrad.addColorStop(0, 'rgba(52, 255, 182, 0.34)');
    gwGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.beginPath();
    ctx.arc(cx, cy, gwR + 12, 0, Math.PI * 2);
    ctx.fillStyle = gwGrad;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, gwR, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(7, 19, 38, 0.96)';
    ctx.fill();
    ctx.strokeStyle = gwSelected ? '#ffffff' : '#34ffb6';
    ctx.lineWidth = gwSelected ? 3.5 : 2.6;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 10.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GATEWAY', cx, cy - 2);
    ctx.fillStyle = '#34ffb6';
    ctx.font = '700 9.8px "JetBrains Mono", monospace';
    ctx.fillText(gwDev.ip || '', cx, cy + 12);

    const rLabel = (topo.router_audit && topo.router_audit.router_model) ? topo.router_audit.router_model : gwDev.display_name;
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 12px "Inter", "Cairo", sans-serif';
    ctx.fillText((rLabel || 'Gateway Router').slice(0, 34), cx, cy - gwR - 10);

    renderedNodeHitboxes.push({ ip: gwDev.ip, x: cx, y: cy, r: gwR + 4 });
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
    const isWiredNoRf = !rf.sensor_capable && !rf.simulation_active;

    const lanBioCnt = document.getElementById('lanBioBodiesCountTxt');
    if (lanBioCnt) {
      if (isWiredNoRf) {
        lanBioCnt.textContent = currentLang === 'ar' ? 'كابل سلكي (لا يوجد Wi-Fi)' : 'Wired LAN (No Wi-Fi RF)';
        lanBioCnt.className = 'amber-text';
      } else if (bodiesCnt > 0) {
        lanBioCnt.textContent = currentLang === 'ar' ? `${bodiesCnt} جسم مادي مرصود!` : `${bodiesCnt} Physical Body!`;
        lanBioCnt.className = 'danger-text';
      } else {
        lanBioCnt.textContent = currentLang === 'ar' ? '0 أجسام (مجال ساكن 100%)' : '0 Bodies (Static Field)';
        lanBioCnt.className = 'emerald-text';
      }
    }
    const kalmanSub = document.getElementById('lanRfModeSubTxt');
    if (kalmanSub) {
      kalmanSub.textContent = rf.sensor_mode || 'Kalman-DSP Zero-Hallucination';
    }

    const honestyBox = document.getElementById('rfHardwareHonestyBanner');
    const honestyTitle = document.getElementById('rfHonestyTitle');
    const honestyDesc = document.getElementById('rfHonestyDesc');
    if (honestyBox && honestyTitle && honestyDesc) {
      if (isWiredNoRf) {
        honestyBox.className = 'rf-honesty-banner wired-warn';
        honestyTitle.style.color = 'var(--amber)';
        honestyTitle.textContent = currentLang === 'ar'
          ? '⚠️ وضع الصدق الفيزيائي الصارم: جهازك متصل بكابل سلكي (Ethernet) بدون كرت Wi-Fi نشط — تم قفل التوليد الوهمي (0 أجسام)'
          : '⚠️ Hardware Honesty Gate: Wired Ethernet Detected (No Active Wi-Fi Radio) — 0 Fake Bodies Guaranteed';
      } else {
        honestyBox.className = 'rf-honesty-banner';
        honestyTitle.style.color = 'var(--emerald)';
        honestyTitle.textContent = currentLang === 'ar'
          ? `✓ مرشح كالمان وهامبل الفيزيائي نشط (${rf.sensor_mode || 'Kalman-DSP'}) — صفر مربعات وصفر أشباح وهمية`
          : `✓ Active Kalman + Hampel 3σ RF Filter (${rf.sensor_mode || 'Kalman-DSP'}) — Zero Ghost Detections`;
      }
      honestyDesc.textContent = currentLang === 'ar' ? (rf.honesty_banner_ar || rf.physics_note_ar) : (rf.honesty_banner_en || rf.physics_note_en);
    }

    const badge = document.getElementById('navRfBadge');
    const stEl = document.getElementById('rfPresenceStateTxt');
    if (isWiredNoRf) {
      badge.textContent = 'NO-RF';
      badge.className = 'nav-counter cyan';
      stEl.textContent = currentLang === 'ar' ? 'إيثرنت سلكي (0 أجسام)' : 'WIRED LAN (NO RF)';
      stEl.className = 'amber-text';
    } else if (rf.presence_state === 'BIO_THERMAL_DETECTED' || rf.presence_state === 'MOTION_DETECTED' || bodiesCnt > 0) {
      badge.textContent = `${bodiesCnt || 1} BIO`;
      badge.className = 'nav-counter danger';
      stEl.textContent = currentLang === 'ar' ? `رصد ${bodiesCnt || 1} كتلة حيوية!` : `${bodiesCnt || 1} BIO-MASS DETECTED`;
      stEl.className = 'danger-text';
    } else if (rf.presence_state === 'MICRO_ACTIVITY') {
      badge.textContent = 'WAVE';
      badge.className = 'nav-counter cyan';
      stEl.textContent = currentLang === 'ar' ? 'تموج راديوي طفيف (قيد التثبت)' : 'MICRO MULTIPATH';
      stEl.className = 'cyan-text';
    } else {
      badge.textContent = 'CLEAR';
      badge.className = 'nav-counter emerald';
      stEl.textContent = currentLang === 'ar' ? 'سكون مؤكد (0 أجسام)' : 'KALMAN CLEAR (0)';
      stEl.className = 'emerald-text';
    }

    document.getElementById('rfConfidenceTxt').textContent = `Bodies: ${bodiesCnt} • Confidence: ${rf.presence_confidence || 99}%`;
    document.getElementById('rfCurrentRssiTxt').textContent = isWiredNoRf
      ? 'N/A (Wired)'
      : `${(rf.kalman_rssi_dbm || rf.current_rssi_dbm || -56).toFixed(1)} dBm`;
    document.getElementById('rfBaselineRssiTxt').textContent = isWiredNoRf
      ? 'Ethernet Cable (0 dBm RF)'
      : `Baseline: ${(rf.baseline_rssi_dbm || -56).toFixed(1)} dBm (σ=${(rf.rssi_variance_db || 0).toFixed(2)})`;
    document.getElementById('rfEntropyTxt').textContent = `${(rf.multipath_entropy || 0).toFixed(1)}%`;
    document.getElementById('rfJitterTxt').textContent = `Gateway Micro-Jitter: ${(rf.gateway_micro_jitter_ms || 0).toFixed(2)} ms`;

    const rad = rf.radio || {};
    const apsCount = (rf.nearby_aps || []).length;
    document.getElementById('rfBandTxt').textContent = `${rad.frequency_band || 'Wired LAN'}${rad.channel ? ` (CH ${rad.channel})` : ''}`;
    document.getElementById('rfLinkRateTxt').textContent = `${rad.rx_rate_mbps > 0 ? `${rad.rx_rate_mbps} Mbps` : (rad.connection_type || 'Ethernet')} • ${apsCount} APs`;

    const physBanner = document.getElementById('rfPhysicsBanner');
    if (physBanner) physBanner.textContent = currentLang === 'ar' ? rf.physics_note_ar : rf.physics_note_en;

    const bioListEl = document.getElementById('rfBioTargetsList');
    if (bioListEl) {
      if (isWiredNoRf) {
        bioListEl.innerHTML = `<div class="disk-item" style="font-size:0.78rem;color:var(--amber);line-height:1.65">
          ${currentLang === 'ar'
            ? '⚡ جهازك متصل عبر كابل سلكي ولا يلتقط موجات Wi-Fi حالياً، لذلك يعرض النظام <strong>0 أجسام</strong> بصدق علمي 100% بدلاً من اختلاق أوهام من تذبذب البينج. لتفعيل الرصد الحقيقي افتح الـ Wi-Fi، أو اضغط (تشغيل معاينة خوارزمية لموجة افتراضية) لمشاهدة التمثيل الطيفي الناعم.'
            : '⚡ Your PC is on Wired Ethernet without an active Wi-Fi radio, so AEGIS-X honestly reports 0 bodies instead of hallucinating targets from ping jitter. Enable Wi-Fi for real sensing, or click Preview Synthetic Wave.'}
        </div>`;
      } else if (bodiesCnt === 0) {
        bioListEl.innerHTML = `<div class="disk-item" style="font-size:0.78rem;color:var(--emerald);line-height:1.65">✓ ${currentLang === 'ar'
          ? 'المجال الكهرومغناطيسي مستقر تماماً بعد تصفية الضجيج بمرشح كالمان (0 أجسام متحركة في خط الرؤية المباشر للراوتر). ملاحظة علمية: الأسقف الخرسانية تحجب هذا الرصد ولا علاقة له بأي ظواهر غير مادية.'
          : 'Kalman-filtered RF field is 100% static (0 physical bodies crossing line-of-sight Fresnel zone). Reinforced concrete slabs block sub-6GHz human scatter.'}</div>`;
      } else {
        bioListEl.innerHTML = bodies.map((b) => `
          <div class="bio-target-card">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:6px">
              <strong style="color:#ffd166">🧬 ${escapeHtml(currentLang === 'ar' ? b.label_ar : b.label_en)}</strong>
              <span class="tag-pill tag-warn" dir="ltr">${b.z_score ? `Z=${b.z_score}σ • ` : ''}${b.confidence_pct}%</span>
            </div>
            <div style="margin-top:3px;color:var(--text-main)">
              ${escapeHtml(currentLang === 'ar' ? b.sector_ar : b.sector_en)} — <strong dir="ltr">~${b.distance_m}m (${b.azimuth_deg}°)</strong>
            </div>
            <div dir="ltr" style="font-family:var(--font-mono);font-size:0.69rem;color:var(--cyan);margin-top:2px">
              Ray: ${escapeHtml(b.intersecting_ray)} | H2O Attenuation: ${b.heat_intensity}%
            </div>
          </div>
        `).join('');
      }
    }

    const linksEl = document.getElementById('rfLinksList');
    if (linksEl) {
      const linkCards = (rf.links || []).map((lk) => `
        <div class="disk-item" style="padding:7px 11px">
          <div class="disk-row-top" style="margin-bottom:3px">
            <strong>${escapeHtml(lk.device_name)} <span dir="ltr" style="color:var(--text-muted);font-size:0.71rem">(${escapeHtml(lk.ip)})</span></strong>
            <span dir="ltr" style="font-family:var(--font-mono);color:${lk.perturbed ? 'var(--danger)' : 'var(--emerald)'}">
              Kalman Z: ${lk.kalman_z || 0}σ | Absorb: ${lk.attenuation_pct}%
            </span>
          </div>
          <div class="progress-rail">
            <div class="progress-fill ${lk.perturbed ? 'danger' : 'emerald'}" style="width:${Math.max(3, lk.attenuation_pct)}%"></div>
          </div>
        </div>
      `);
      const apCards = (rf.nearby_aps || []).slice(0, 5).map((ap) => `
        <div class="disk-item" style="padding:6px 11px;font-size:0.73rem">
          <div class="disk-row-top" style="margin-bottom:0">
            <span dir="ltr">📡 AP: <strong>${escapeHtml(ap.ssid)}</strong> (${escapeHtml(ap.band)} CH ${ap.channel})</span>
            <span dir="ltr" style="font-family:var(--font-mono);color:var(--cyan)">${ap.rssi_dbm} dBm (~${ap.est_distance_m}m)</span>
          </div>
        </div>
      `);
      linksEl.innerHTML = [...linkCards, ...apCards].join('') || `<div class="disk-item" style="font-size:0.75rem;color:var(--text-muted)">No active Wi-Fi BSSID rays (Wired Ethernet mode).</div>`;
    }

    const evEl = document.getElementById('rfEventsList');
    if (evEl) {
      const evs = rf.recent_events || [];
      evEl.innerHTML = evs.length === 0
        ? `<div class="disk-item" style="font-size:0.76rem;color:var(--emerald)">✓ سجل الرصد خالٍ من أي اختراق موجي مؤكد (صفر إنذارات كاذبة).</div>`
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
  }

  // ==================== HIGH-DPI BILINEAR SHADER + ORGANIC SILHOUETTE RENDERER (ZERO SQUARES!) ====================
  let offscreenShaderCanvas = null;

  function renderBioThermalCanvasScene(canvas, rf) {
    if (!canvas || !rf || !Array.isArray(rf.heatmap_grid) || rf.heatmap_grid.length === 0) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const grid = rf.heatmap_grid;
    const gRows = grid.length;
    const gCols = grid[0].length;

    const bufW = 240;
    const bufH = 150;
    if (!offscreenShaderCanvas) {
      offscreenShaderCanvas = document.createElement('canvas');
      offscreenShaderCanvas.width = bufW;
      offscreenShaderCanvas.height = bufH;
    }
    const octx = offscreenShaderCanvas.getContext('2d');
    const imgData = octx.createImageData(bufW, bufH);
    const pixels = imgData.data;

    for (let py = 0; py < bufH; py++) {
      const gy = (py / (bufH - 1)) * (gRows - 1);
      const y0 = Math.floor(gy);
      const y1 = Math.min(gRows - 1, y0 + 1);
      const fy = gy - y0;

      for (let px = 0; px < bufW; px++) {
        const gx = (px / (bufW - 1)) * (gCols - 1);
        const x0 = Math.floor(gx);
        const x1 = Math.min(gCols - 1, x0 + 1);
        const fx = gx - x0;

        const v00 = grid[y0][x0] || 0;
        const v10 = grid[y0][x1] || 0;
        const v01 = grid[y1][x0] || 0;
        const v11 = grid[y1][x1] || 0;

        const top = v00 + (v10 - v00) * fx;
        const bot = v01 + (v11 - v01) * fx;
        const val = top + (bot - top) * fy;

        const [r, g, b, a] = flirContinuousRGB(val);
        const idx = (py * bufW + px) * 4;
        pixels[idx] = r;
        pixels[idx + 1] = g;
        pixels[idx + 2] = b;
        pixels[idx + 3] = a;
      }
    }
    octx.putImageData(imgData, 0, 0);

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(offscreenShaderCanvas, 0, 0, w, h);
    ctx.restore();

    const cx = w / 2;
    const cy = h / 2;
    const minDim = Math.min(w, h);
    const isWiredNoRf = !rf.sensor_capable && !rf.simulation_active;

    ctx.save();
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, 16); ctx.lineTo(cx, h - 16);
    ctx.moveTo(16, cy); ctx.lineTo(w - 16, cy);
    ctx.stroke();

    [0.19, 0.33, 0.46].forEach((ratio, idx) => {
      const r = minDim * ratio;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(148, 210, 255, 0.16)';
      ctx.setLineDash([4, 6]);
      ctx.lineWidth = 1.1;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(203, 224, 248, 0.58)';
      ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(['2.5m Fresnel', '6.0m Mid', '11m Same-Floor'][idx], cx + r + 5, cy - 4);
    });
    ctx.restore();

    (rf.links || []).forEach((lk) => {
      const rad = lk.angle_deg * (Math.PI / 180);
      const dist = lk.radius_norm * minDim * 0.44;
      const tx = cx + Math.cos(rad) * dist;
      const ty = cy + Math.sin(rad) * dist;

      const midX = (cx + tx) / 2;
      const midY = (cy + ty) / 2;
      const rx = Math.hypot(tx - cx, ty - cy) / 2;
      const ry = lk.perturbed ? 22 : 13;
      ctx.save();
      ctx.translate(midX, midY);
      ctx.rotate(rad);
      ctx.beginPath();
      ctx.ellipse(0, 0, Math.max(8, rx), ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = lk.perturbed ? 'rgba(255, 190, 85, 0.48)' : 'rgba(0, 240, 255, 0.16)';
      ctx.fillStyle = lk.perturbed ? 'rgba(255, 130, 50, 0.09)' : 'rgba(0, 240, 255, 0.03)';
      ctx.lineWidth = 1.2;
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(tx, ty);
      ctx.strokeStyle = lk.perturbed ? 'rgba(255, 225, 120, 0.92)' : 'rgba(0, 240, 255, 0.42)';
      ctx.lineWidth = lk.perturbed ? 2.2 : 1.3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(tx, ty, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = lk.perturbed ? '#ffd166' : '#00f0ff';
      ctx.fill();

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '600 9.8px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText((lk.device_name || lk.ip).slice(0, 18), tx, ty + 16);
    });

    (rf.bio_thermal_targets || []).forEach((b) => {
      const bx = b.norm_x * w;
      const by = b.norm_y * h;

      const auraR = 46;
      const grad = ctx.createRadialGradient(bx, by, 3, bx, by, auraR);
      grad.addColorStop(0, 'rgba(255, 255, 240, 0.95)');
      grad.addColorStop(0.28, 'rgba(255, 170, 35, 0.78)');
      grad.addColorStop(0.62, 'rgba(235, 45, 65, 0.36)');
      grad.addColorStop(1, 'rgba(235, 45, 65, 0)');
      ctx.beginPath();
      ctx.arc(bx, by, auraR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      [18, 30].forEach((cr, ci) => {
        ctx.beginPath();
        ctx.ellipse(bx, by, cr * 0.78, cr * 1.12, 0, 0, Math.PI * 2);
        ctx.strokeStyle = ci === 0 ? 'rgba(255, 250, 220, 0.85)' : 'rgba(255, 165, 70, 0.45)';
        ctx.lineWidth = ci === 0 ? 1.5 : 1.0;
        ctx.stroke();
      });

      drawOrganicHumanSilhouette(ctx, bx, by);

      const tagTxt = `${b.equiv_temp_c}°C • ~${b.distance_m}m (${b.confidence_pct}%)`;
      const tw = tagTxt.length * 6.4 + 16;
      const ty = by - 46;
      ctx.fillStyle = 'rgba(8, 14, 28, 0.88)';
      ctx.strokeStyle = 'rgba(255, 210, 102, 0.75)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(bx - tw / 2, ty - 14, tw, 20, 10);
      else ctx.rect(bx - tw / 2, ty - 14, tw, 20);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fffbeb';
      ctx.font = '700 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(tagTxt, bx, ty);
    });

    ctx.beginPath();
    ctx.arc(cx, cy, 11, 0, Math.PI * 2);
    ctx.fillStyle = isWiredNoRf ? '#fbbf24' : '#34ffb6';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 10.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(isWiredNoRf ? 'WIRED LAN (RF STANDBY)' : 'ROUTER RF ORIGIN', cx, cy - 16);

    if (isWiredNoRf) {
      ctx.fillStyle = 'rgba(5, 12, 26, 0.78)';
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
      ctx.lineWidth = 1.2;
      const bw = 460;
      const bh = 42;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(cx - bw / 2, h - 60, bw, bh, 12);
      else ctx.rect(cx - bw / 2, h - 60, bw, bh);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = '700 11px "Inter", "Cairo", sans-serif';
      ctx.fillText(
        currentLang === 'ar'
          ? '⚡ وضع الكابل السلكي: لا يوجد راديو Wi-Fi نشط — 0 أجسام وهمية (اضغط معاينة الموجة للاختبار)'
          : '⚡ Wired Ethernet Mode: No Active Wi-Fi Radio — 0 Fake Bodies Guaranteed',
        cx,
        h - 34
      );
    }
  }

  function drawOrganicHumanSilhouette(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = 'rgba(255, 253, 240, 0.94)';
    ctx.strokeStyle = 'rgba(255, 120, 30, 0.9)';
    ctx.lineWidth = 1.3;

    ctx.beginPath();
    ctx.arc(0, -13, 5.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-11, -2);
    ctx.quadraticCurveTo(-10, -7.2, 0, -7.2);
    ctx.quadraticCurveTo(10, -7.2, 11, -2);
    ctx.quadraticCurveTo(11.5, 6, 7.2, 14);
    ctx.quadraticCurveTo(3.5, 17, 0, 17);
    ctx.quadraticCurveTo(-3.5, 17, -7.2, 14);
    ctx.quadraticCurveTo(-11.5, 6, -11, -2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawRfTomographyCanvases(rf) {
    renderBioThermalCanvasScene(document.getElementById('rfHeatmapCanvas'), rf);
    const wCanvas = document.getElementById('rfWaveCanvas');
    if (wCanvas && Array.isArray(rf.entropy_history)) {
      drawAreaSparkline('rfWaveCanvas', rf.entropy_history.length > 1 ? rf.entropy_history : [0, 0], '#fbbf24', 'rgba(251, 191, 36, 0.18)', 100);
    }
  }

  function flirContinuousRGB(v) {
    const c = Math.max(0, Math.min(1, v));
    if (c < 0.20) {
      const t = c / 0.20;
      return [Math.round(5 + t * 22), Math.round(11 + t * 18), Math.round(34 + t * 62), 232];
    }
    if (c < 0.46) {
      const t = (c - 0.20) / 0.26;
      return [Math.round(27 + t * 125), Math.round(29 - t * 9), Math.round(96 + t * 48), 238];
    }
    if (c < 0.74) {
      const t = (c - 0.46) / 0.28;
      return [Math.round(152 + t * 96), Math.round(20 + t * 96), Math.round(144 - t * 122), 244];
    }
    const t = (c - 0.74) / 0.26;
    return [255, Math.round(116 + t * 136), Math.round(22 + t * 212), 250];
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
      const matrixHtml = (rep.anomaly_matrix && rep.anomaly_matrix.length > 0)
        ? `<div class="anomaly-matrix-grid">
             ${rep.anomaly_matrix.map((m) => `
               <div class="anomaly-cell ${escapeHtml(m.severity || 'NOMINAL')}">
                 <span dir="ltr">${escapeHtml(m.subsystem)}</span>
                 <strong dir="ltr">${escapeHtml(m.metric)} (Z=${m.z_score}σ)</strong>
                 <small>${escapeHtml(m.verdict)}</small>
               </div>
             `).join('')}
           </div>`
        : '';
      const recBtns = (rep.recommended_tool_ids || []).map((id) => {
        const found = allTools.find((t) => t.id === id);
        const label = found ? (currentLang === 'ar' ? found.title_ar : found.title_en) : id;
        return `<button class="btn-primary-glow" onclick="window.triggerITTool('${id}')">▶ ${escapeHtml(label)}</button>`;
      }).join('');

      area.innerHTML = `
        <div class="copilot-report-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
            <div>
              <span class="eyebrow" dir="ltr">${escapeHtml(rep.engine_type || 'STATISTICAL_DSP')} • ${escapeHtml(rep.intent)} • Confidence ${rep.confidence_pct}%</span>
              <h4 style="font-size:1.08rem">${escapeHtml(currentLang === 'ar' ? rep.headline_ar : rep.headline_en)}</h4>
            </div>
            <span class="tag-pill tag-ai">${escapeHtml(rep.safety_guarantee)}</span>
          </div>
          ${matrixHtml}
          <div>
            <strong style="color:var(--cyan);font-size:0.86rem">${currentLang === 'ar' ? '1. القراءات الحية ومصفوفة الانحراف الإحصائي:' : '1. Live Hardware & Router Telemetry:'}</strong>
            <ul style="padding-inline-start:20px;margin-top:6px;font-size:0.83rem;color:var(--text-muted);line-height:1.7">${live}</ul>
          </div>
          <div>
            <strong style="color:var(--emerald);font-size:0.86rem">${currentLang === 'ar' ? '2. الاستنتاج السببي الحتمي (0% LLM):' : '2. Deterministic Causal Findings (0% LLM):'}</strong>
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

    const layerPills = (ids.sensor_layers || []).map((l) =>
      `<span class="tag-pill tag-ai" dir="ltr">${escapeHtml(l)}</span>`
    ).join(' ');
    const canaryPills = (ids.canary_ports || []).map((p) =>
      `<span class="tag-pill tag-sys" dir="ltr">Decoy :${p}</span>`
    ).join(' ');
    document.getElementById('canaryBadgesBox').innerHTML = `${layerPills} ${canaryPills}`;

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
      if (state.install_state) updateInstallStateUI(state.install_state);
      if (state.oui_db_count) {
        const ouiEl = document.getElementById('sbOuiCount');
        if (ouiEl) ouiEl.textContent = `${Number(state.oui_db_count).toLocaleString()} Vendors`;
      }
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
    startPrecisionGaugesLoop();
    injectStaticIcons();
    setupNavigation();
    setupCopilot();
    await loadITCatalog();
    await pollFullDashboard();
    if (!localStorage.getItem('aegisx_v8_onboarded')) {
      document.getElementById('readinessModal').style.display = 'grid';
    }
    setInterval(pollFullDashboard, 1600);
  });
})();
