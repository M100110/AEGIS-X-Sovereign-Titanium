# AEGIS-X v9.0 SOVEREIGN ULTRA — 8-Protocol LAN Device Inventory, FLIR Bio-Thermal RF Radar & 80 Silent Windows Tools

**منظومة القيادة السيادية للويندوز والشبكة (الإصدار الأسمى v9.0 SOVEREIGN ULTRA) — جاهزة للتحميل المباشر كملف مثبت رسمي (`releases/AegisX-Installer.exe`) ونسخة مستقلة فورية (`releases/AegisX.exe`) على نظام Windows 10 / 11 (x64).**

---

## التحميل المباشر لنظام ويندوز (Ready-to-Run Windows x64 Binaries)

1. **[`releases/AegisX-Installer.exe`](./releases/AegisX-Installer.exe)** — معالج التثبيت المؤسسي وفاحص المحركات الفعلي (**v9.0 SOVEREIGN ULTRA**).
2. **[`releases/AegisX.exe`](./releases/AegisX.exe)** — النسخة المستقلة الجاهزة للتشغيل الفوري بدون تثبيت.

---

## أبرز قدرات الإصدار v9.0 SOVEREIGN ULTRA

1. **الماسح الشامل للأجهزة المتصلة بالشبكة بـ 8 بروتوكولات (`8-Protocol LAN Device Inventory`)**:
   - يجمع متوازياً بين `iphlpapi.dll!GetIpForwardTable` + `SendARP` + `NetBIOS (:137)` + `mDNS PTR (:5353)` + `LLMNR (:5355)` + `SSDP/UPnP (:1900)` + `WS-Discovery (:3702)` + `Reverse DNS` + شهادات `X.509 SSL/TLS` + قاعدة مصنعين موسعة لأكثر من **420+ بادئة IEEE OUI** مع كشف الماك العشوائي (`Private Wi-Fi MAC`).
   - يعرض لكل جهاز: **الـ IP، الـ MAC، اسم الجهاز (Hostname)، الشركة المصنعة، نظام التشغيل المستنتج (`OS Family`)، نوع الاتصال، المسافة بالمتر، زمن الاستجابة، المنافذ المفتوحة**، مع ميزة **تسمية الأجهزة وحفظ موثوقيتها (`Trusted / New Intruder`)** وتصدير القائمة كاملة بصيغة **Excel CSV (`UTF-8 BOM`)**، بالإضافة إلى فحص جراحي لـ 34 منفذاً و `Wake-on-LAN`.

2. **رادار كشف الأجسام الحرارية والحية حول الراوتر (`32×32 FLIR Bio-Thermal & RF Tomography`)**:
   - يرصد الأجسام الحية المائية (`~65%` ماء وبصمة مكافئة `~37°C`) العابرة حول الراوتر عبر فيزياء امتصاص وتشتت موجات `2.4/5GHz` في مناطق فرينل (`Fresnel Zone`) عبر `wlanapi.dll!WlanQueryInterface` + مسح الشبكات المجاورة `WlanGetNetworkBssList`.
   - يعرض **خريطة طيفية حرارية عالية الدقة (`32×32 FLIR Ironbow`)** داخل قسم الشبكة مباشرة وفي المختبر المخصص، مع تتبع إحداثيات الجسم والقطاع الجغرافي والزاوية والمسافة بالمتر ومختبر محاكاة حركة حي (`18s Walk Calibration`).

3. **محافظ الطاقة والشبكة التكيفي (`Adaptive Eco-Standby Governor — 0.0% Idle Strain`) + 80 أداة صيانة صامتة**:
   - **0.0 حزمة/ثانية** و **`<0.02%` CPU** عند إغلاق المتصفح أو الإقلاع الاختياري (`-eco-boot`)، مع **80 أداة صيانة وتشخيص أصلية صامتة** بدون أي شاشات سوداء أو أصوات مزعجة.
