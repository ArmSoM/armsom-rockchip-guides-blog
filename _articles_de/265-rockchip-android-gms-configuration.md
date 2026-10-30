---
title: "Rockchip Android GMS: Konfiguration, Zertifizierungstests und Fehlerbehebung"
description: "Rockchip Android GMS: Konfiguration, Zertifizierungstests und Fehlerbehebung"
excerpt: "Rockchip Android GMS: Konfiguration, Zertifizierungstests und Fehlerbehebung"
translation_key: "265-rockchip-android-gms-configuration"
slug: "265-rockchip-android-gms-configuration"
lang: "de"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

Gemeinsame Grundlage ist die chinesische Fassung RK-YH-YF-237 V3.0 (77 Seiten, bis Android 14). Englisch RK-YH-YF-251 V1.3 (16 Seiten, bis Android 11) dient zum historischen Abgleich; ausschließlich dort enthaltene Angaben bleiben separat erhalten. Regeln und Termine beschreiben die Quellversionen, nicht zwingend heutige Google-Richtlinien, und bestätigen keine GMS/EDLA-Zertifizierung von ArmSoM-Produkten. Board, SoC, Android-SDK/BSP, Kernel und Lizenzberechtigung prüfen. Keine Befehle, Schlüsselprogrammierung oder Zertifizierungstests wurden ausgeführt. Die englische Quelle enthält keine technischen Bilder; der einzige Screenshot stammt gekennzeichnet aus der chinesischen Fassung. Siehe [ArmSoM-Dokumentation](https://docs.armsom.org/).

## 1 Begriffe

| Begriff | Definition der Quelle |
| --- | --- |
| GMS (Google Mobile Service) | Google-Mobildienste einschließlich Dienstframework, Play Store, Chrome und weiterer Anwendungen. |
| MADA (Mobile Application Distribution Agreement) | Vorwiegend Telefone/Tablets mit sämtlichen CDD-Anforderungen des Handheld-/Tablet-Typs; Display 3.3–18 Zoll und Batterie erforderlich. |
| EDLA (Enterprise Device Licensing Agreement) | Ähnlich MADA, mit gelockerten Display-/Batterievorgaben für 18–70 Zoll oder batterielose Geräte; Speicher über 2G, keine direkte Verbraucheradressierung. |
| 3PL | Drittlabore unterstützen Google bei CDD-, GMS- und regionalen Prüfungen, z. B. Foxconn, Harman, Wind River und Pegatron; direkt oder über Vertrieb kontaktieren. |
| Google Partner | MADA/EDLA-Abschluss und Partnerstatus ermöglichen Partnerdokumente und 3PL-Testanträge. |
| EEA | EU-Geräte benötigen EEA-GMS-Zertifizierung; EEA-Typ im Code gemäß Situation und EMADA-Vertrag konfigurieren. |
| xTS | Passende Binary starten, in xTS-tradefed Test-/Retry-Befehle ausführen. |
| retry | Vorhandene Ergebnisse mit identischem Fingerprint fortsetzen. `l r` zeigt Ergebnisse; erste Spalte ist session id. `run retry --retry session_id` ohne Zusätze wie `--retry-type` verwenden. |
| Single test | Einzeltests zur Diagnose; Ergebnisse und Protokolle in `results` bzw. `logs`. |

[EEA](https://support.google.com/androidpartners_gms/answer/9071728?hl=en) · [CTS](https://source.android.com/compatibility/cts/run)

## 2 Hardwareanforderungen

- Echter Hardware-RTC, kein virtueller, und `/sys/class/rtc/rtc0/` erforderlich.
- Internes oder USB-Mikrofon erforderlich; ein ausschließliches USB-Mikrofon als eingebaut konfigurieren. Aufnahme vorher prüfen.
- BLE ist für Nearby Share ab Android 11 erforderlich.
- Jeder Type-C-Port muss OTG unterstützen, sonst schlägt GTS Interactive fehl; im Hardwareentwurf prüfen.
- Feature-Änderungen erfordern vollständige Neuzertifizierung; danach Features nicht ändern.

Quellbeispiele für Bericht/Protokoll folgen. `ASSUMPTION_FAILURE` bedeutet übersprungen und als Pass behandelt; laut Quelle zählt Google nur `FAILURE`.

```text
android-cts/logs/2023.05.04_14.13.15/inv_17873629097171453434/host_log_***.txt
android-cts/logs/2023.05.04_14.13.15/inv_17873629097171453434/device_logcat_test_PH0BEXGDPG_***.txt
```

## 3 Versionsanforderungen

### 3.1 Android 13

Neue Android-13+-Geräte benötigen mindestens `2Gb` DDR; kleinere einschließlich Go sind nicht zertifizierbar. RKP kommt hinzu. Die Quelle mischt Gb/GB/G; Schreibweise bleibt erhalten und ist mit geltender Spezifikation abzugleichen.

### 3.2 Android 14

Android 14+ mit `3Gb DDR` kann Go GMS beantragen. Device ID Attestation kommt hinzu. Neue GMS/EDLA-Geräte nur 64Bit; Beispiel:

```make
# device/rockchip/rk3588/rk3588s_u/BoardConfig.mk
DEVICE_IS_64BIT_ONLY := true
```

## 4 Vor den Tests

Google-Mobildienste erfordern GMS/EDLA-Zertifizierung und Berechtigung. Mit MADA/EDLA Partner-/Kontozugang beim Google-Kontakt klären, über Google/3PL beantragen, konfigurieren und sämtliche xTS selbst testen. Ohne Berechtigung ein ODM-MADA-Unternehmen kontaktieren. Die meisten Quellenlinks erfordern MADA/EDLA-Zugang. Befehlsausführung allein erteilt keine Zertifizierung.

Laut Quelle DDR bis 2G nur als Android Go, jedoch ab Android 13 nicht unter 2G. `lunch *go` wählen, z. B.:

```sh
lunch rk3326_rgo-user
```

PX30 ist die industrielle RK3326-Variante mit ähnlichen Funktionen; Google führt nur RK3326, daher laut Quelle so beantragen. RK3568 gehört zu RK356x, RK3566/RK3568 sind möglich; RK3562 ist eine andere Serie. PX30-Beispiel:
1. Sub-License-Antrag wie RK3326.
2. Für PX30-2GB DDR `lunch rk3326_rgo-user`.
3. Vor `./build.sh -UCA` Makefile ändern:

```make
# device/rockchip/rk3326/BoardConfig.mk
PRODUCT_UBOOT_CONFIG := px30
```

EDLA verwendet häufig USB- statt eingebauter MIPI-Kameras. 3PL schreibt kein Modell vor, CTS ist jedoch streng; bereits zertifizierte Sensoren in Anhang A.

## 5 Anträge vor dem Test

Frühzeitig beantragen:
1. 3PL-Sub-License (Keymaster & Optee).
2. 3PL-keybox (Attestation key).
3. 3PL-GTS-`APE_API_KEY` (GTS).
4. Google-Konto der Form `android-partner-api@company.com` und RKP (RKP).

## 6 Zulassungsfenster

Plattformen: [GMS Express/GO Ready Chipset](https://docs.google.com/spreadsheets/d/18cNgkWAlt6mYtZIgXS9yHflhMbE8pFB9CgYniqUsWR4/edit#gid=227777885); strenge Android-Fristen der Erstzertifizierung: [GMS approval windows](https://docs.partner.android.com/gms/policies/domains/reqs?authuser=2#gms_approval_windows_by_release). Historisches Beispiel: Android-12L-AOSP 2022-03-07, GMS-Ende 2023-02-28, EDLA-Ende 2023-12-31. Keine heutigen Antragsfristen.

## 7 Zertifizierungsdauer

Schätzungen der Quelle: Bei einfachen Tablets nach stabilem SDK und vollständigem Gerät ohne offensichtliche Abstürze etwa 3–4 Wochen Fehlerbehebung. Android 13+ nutzt GKI. Treiberschnittstellen außerhalb der Standard-ABI-Liste müssen an Google; Prüfung/Merge meist 3–4 Tage, Monatsstichtag 15., signiertes `boot.img` zum Monatsende. Nach dem 15. eingereicht kann ein Release etwa 40 Tage benötigen. Vorübergehend ist [tägliches Google-PAB-boot.img](https://ci.android.com/builds/branches/aosp_kernel-common-android13-5.10/grid?legacy=1&selected-targets=kernel_aarch64) nutzbar. RKP ab Android 13 ist komplex und braucht Google-Unterstützung; früh beantragen.

EDLA-Hardware/Treiber sind komplexer; GKI kann zusätzlich 4–6 Wochen benötigen. Vollständige Geräte mit größtem angebotenen Display testen. Parallele Tests ohne Abstürze laut Quelle etwa fünf Tage. Tabellenwerte ohne Einheit bleiben wie gedruckt:

| Test | Geräteempfehlung | Dauer |
| --- | --- | --- |
| CTS | 3+ | 2–4 Tage |
| CTS-ON-GSI | 2 | 2 |
| VTS | 1 | 1 |
| CTS-Verifier | 1 | 1 |
| GTS | 1 | 2 |
| GTS-Verifier | 1 | 1 |
| APTS | 1 | 1 |
| STS | 1 | 1 |

## 8 Google-Pakete beziehen

GMS, mainline und prebuilts integrieren. Von mainline verlangte Patches müssen im SDK vorliegen, sonst Buildfehler. Aktuelles mainline: [Release Tracker](https://releasetracker.partner.android.com/); Pakete/SDK-Patches: [Release notes](https://docs.partner.android.com/mainline/release/release-notes); GMS-Gültigkeit/Download: [GMS download](https://docs.partner.android.com/gms/building/integrating/gms-download).

| Paket | Verzeichnis |
| --- | --- |
| GMS | `vendor/partner_gms` |
| mainline | `vendor/partner_modules` |
| prebuilts | Gesamtes `prebuilts/module_sdk` durch zu mainline passende Dateien ersetzen |

GMS-Version abfragen:

```text
getprop | grep ro.com.google.gmsversion

/vendor/partner_gms/products/gms_package_version.mk: GMS_PACKAGE_VERSION_ID := 13_202310
/vendor/partner_gms/products/gms.mk: ro.com.google.gmsversion=$(GMS_PACKAGE_VERSION_ID)
```

Ohne MADA/EDLA kein eigener Download; Rockchip kann Pakete ebenfalls nicht bereitstellen, daher über 3PL beziehen. Berechtigten wird Express (§11) empfohlen, dessen synchronisierte Pakete den Quellanforderungen GMS Express Plus entsprechen. Manuell GMS nach `vendor/partner_gms` entpacken. Android-11+-mainline bietet Anleitung statt fertigem Archiv; per repo gemäß [Drive-Anleitung](https://drive.google.com/drive/folders/1gxxMalTC99Y2SvyRDUfiDFvY_k4OzjO5) synchronisieren:

```sh
# 下载 manifest 文件
repo init -u https://partner-android.googlesource.com/platform/manifest -b r-aml-prebuilt-release
# 开始同步，同步前，请先检查 .repo/manifests/default.xml 中是否有内容
repo sync -c -j8
```

Tests benötigen gewöhnlich das neueste Approved-Release. Git-Tag in Release Summary ermitteln; Quellbeispiel `mainline_m_2020_dec_preload_5`. Standardrevision im Manifest ändern:

```diff
diff --git a/default.xml b/default.xml
index 7be1f37..01ccba9 100644
--- a/default.xml
+++ b/default.xml
@@ -4,7 +4,7 @@
   <remote  name="ohd"
            fetch=".."
            review="https://partner-android-review.googlesource.com/" />
-  <default revision="r-aml-prebuilt-release"
+  <default revision="refs/tags/mainline_m_2020_dec_preload_5"
            remote="ohd" />
   <!-- Google-signed Mainline prebuilt module projects !-->
```

Ab Android 12 müssen prebuilts und mainline übereinstimmen, sonst Buildfehler. Beispiel: beide `T1003604/mainline_m_2022_feb_preload_5`.

![Buildfehler bei unpassenden mainline/prebuilts, chinesisches PDF S.9; kein englisches Gegenstück.](/docs/rockchip-android-gms-configuration/images/cn-p009-1.png)

Buildfehler bei unpassenden mainline/prebuilts, chinesisches PDF S.9; kein englisches Gegenstück.

## 9 Testpakete beziehen

Laut Quelle meist neueste Google-Testpakete, quartalsweise im Februar/Mai/August/November; siehe [Versionstabelle](https://docs.qq.com/sheet/DVG5KcFNnU2ZFZG9j?tab=BB08J2&u=74e1e99829764a9b8a46607a5c6980cf). Links in Anhang B; Rockchip-FTP `GMS-Test-Suite/xTS` kann ältere Kopien haben. Module unten. Tägliche PAB-Builds helfen bei der Prüfung bereits behobener Fehler.

| Modul | Firmware | Hinweise |
| --- | --- | --- |
| CTS | user | — |
| CTS-ON-GSI | user | Google-signiertes system.img |
| GTS | user | — |
| STS | userdebug | Update am ersten Mittwoch im Monat |
| VTS | user | Google-system.img und Firmware-vendor_boot-debug.img |
| CTS-Verifier | user | — |
| GTS-Verifier | user | Nur Android 13 |
| GTS Interactive | user | Android 13+; ab android-gts-11-R2 |
| Checklist | user | Auch für EDLA |
| BTS | user | — |
| GOATS | userdebug | Go bis Android 11 |
| APTS | userdebug | Go ab Android 12 |

## 10 GMS-Firmware konfigurieren

Folgende Protokolle, Konfigurationen, Pfade und Befehle sind Quellbeispiele. Chinesische Codekommentare bleiben, Operationen werden je Sprache erklärt. Auszüge werden nicht zu vollständigen Skripten erweitert.

### 10.1 Konfigurationsprüfung

Ab Android 12 nach lunch prüfen; vor Zertifizierung alles Pass. `BOARD_WIDEVINE_OEMCRYPTO_LEVEL` produktspezifisch; APK-Rechte bei `PRODUCT_HAVE_RKAPPS` prüfen.

```text
source build/envsetup.sh
lunch rk3588s_t-user
source device/rockchip/common/scripts/check_gms_env.sh
```

Bei Failed trotz gesetzter Makros u-boot zuerst bauen. Fehlende `.config`: `./make.sh rk3588` in `Android_SDK/u-boot`, erneut prüfen; weitere Fehler bis Pass beheben.

```text
Android_SDK$ source device/rockchip/common/scripts/check_gms_env.sh
grep: u-boot/.config: No such file or directory
 [Failed] "CONFIG_ANDROID_AB=y" Check Failed! Expect "CONFIG_ANDROID_AB=y"
 "Android 11+ MUST enable A/B update."
grep: u-boot/.config: No such file or directory
 [Failed] "CONFIG_ANDROID_WRITE_KEYBOX=y" Check Failed! Expect "CONFIG_ANDROID_WRITE_KEYBOX=y"
 "Attestation key MUST be enabled."

grep: u-boot/.config: No such file or directory
 [Failed] "CONFIG_ANDROID_KEYMASTER_CA=y" Check Failed! Expect "CONFIG_ANDROID_KEYMASTER_CA=y"
 "Keymaster in uboot MUST be enabled."
grep: u-boot/.config: No such file or directory
 [Failed] "CONFIG_OPTEE_CLIENT=y" Check Failed! Expect "CONFIG_OPTEE_CLIENT=y"
 "Optee MUST be enabled."
解决方法:Android_SDK/u-boot$ ./make.sh rk3588
```

### 10.2 Kernel bauen

Clang mit `./build.sh -CK` nutzen, sonst VTS `KernelVersionTest#IsClang`-Fehler. Auszug:

```text
vts_kernel_toolchain
KernelVersionTest#IsClang
相关逻辑:Android_SDK/build.sh
if [ "$BUILD_KERNEL_WITH_CLANG" = true ] ; then
if [ "$KERNEL_ARCH" = "arm64" ]; then
    ADDON_ARGS="CROSS_COMPILE=aarch64-linux-gnu- LLVM=1 LLVM_IAS=1"
else
    ADDON_ARGS="CC=clang LD=ld.lld"
```

Go nutzt `android-10-go.config` statt `android-10.config`; Android 11 mit11, Android 13 mit `android-13.config`. Fehlende `rkxxxx.config` weglassen. Weitere Einstellungen in `device/rockchip/rkxxxx/BoardConfig.mk` prüfen.

```text
make ARCH=arm64 rockchip_defconfig android-10-go.config rk3326.config
make ARCH=arm64 rockchip_defconfig android-11-go.config rk3326.config
```

### 10.3 EEA

Nur EU-EEA-Geräte konfigurieren, sonst leer; type1 durch tatsächlichen Typ ersetzen.

```text
BUILD_WITH_EEA := true
BUILD_WITH_EEA_TYPE := type1 (根据自己的EEA类型配置)
```

### 10.4 GMS aktivieren

MARKET_ALL true nur radio/4G, sonst false. User RKAPPS false entfernt Stresstools, sonst Startfehler.

```text
device/rockchip/rk3588/BoardConfig.mk
BUILD_WITH_GOOGLE_MARKET := true
# 含radio的设备(即带有4G通讯功能)请配置以下配置,其余设备保持false
BUILD_WITH_GOOGLE_MARKET_ALL := true
# 编译user固件时,请把下面的宏设成false,RK的压力测试工具将会移除,否则无法正常启动。
PRODUCT_HAVE_RKAPPS := false
```

Für Go2G ergänzen (Android13+ nicht unter2Gb), mk nach source/lunch abfragen. `gms-mandatory` entspricht `vendor/partner_gms/products/gms-mandatory.mk`; ohne Express Standard `gms.mk`.

```text
Android_SDK/device/rockchip/common$ git diff modules/gms.mk
   TMP_GMS_VAR := gms
   TMP_MAINLINE_VAR := mainline_modules
   ifeq ($(strip $(BUILD_WITH_GO_OPT)),true)
     # 2G A Go
- #TMP_GMS_VAR := $(TMP_GMS_VAR)_go_2gb
+ TMP_GMS_VAR := $(TMP_GMS_VAR)_go_2gb
```

```text
Android_SDK$ get_build_var TMP_GMS_VAR
gms-mandatory ##
vendor/partner_gms/products/gms-mandatory.mk
```

### 10.5 Hardware-Features

Mit Hardware-/Treiberteam abgleichen, Features fehlender Gyroskope/BLE entfernen. Nearby Share ab Android11 braucht BLE. Makros nutzen, sonst feature.xml unter `frameworks/native/data/etc/` entfernen.

```text
BOARD_GRAVITY_SENSOR_SUPPORT := true
BOARD_COMPASS_SENSOR_SUPPORT := true
```

BLE-Entfernungsbeispiel (hebt Pflicht nicht auf):

```text
BOARD_BLUETOOTH_LE_SUPPORT := false
```

USB-Kamera-Features:

```text
android.hardware.camera.any
android.hardware.camera.external
```

Auch ohne GPS für Netzwerkortung behalten:

```text
android.hardware.location
android.hardware.location.network
```

Bei leerem `pm list features | grep sensor` Sensor-Service entfernen. Manifest entsteht in `/vendor/etc/vintf/manifest.xml`.

```text
device/rockchip/common/device.mk:
-# Sensor HAL
-PRODUCT_PACKAGES += \
- android.hardware.sensors@1.0-service \
- android.hardware.sensors@1.0-impl \
- sensors.$(TARGET_BOARD_HARDWARE)
device/rockchip/common/manifests/manifest_level_33.xml:
- <hal format="hidl">
- <name>android.hardware.sensors</name>
- <transport>hwbinder</transport>
- <version>1.0</version>
- <interface>
- <name>ISensors</name>
- <instance>default</instance>
- </interface>
- </hal>
注:上述manifests配置文件生成目录/vendor/etc/vintf/manifest.xml
```

### 10.6 FRP

FRP aktivieren; siehe `RKDocs/android/Rockchip_Introduction_Android_Factory_Reset_Protection_CN&EN.pdf`.

```text
BUILD_WITH_GOOGLE_FRP := true
```

### 10.7 AVB und A/B

GMS braucht AVB; siehe `RKDocs/android/Rockchip_Introduction_Android_Verify_Boot_CN&EN.pdf`. SDK-Debugstandard ohne AVB/Sperre kann trotz Zertifizierung unzertifiziert anzeigen. Vor Produktion uboot-Patch zum Sperren beim Key-Schreiben. Nicht bei Diagnose, sonst andere Firmware eventuell unbootbar. Ohne AVB nicht sperren.

```text
BOARD_AVB_ENABLE := true ## 若没有启用AVB则不能锁定机器,否则会导致机器无法开机

RKDocs/android/patches/gms/0001-libavb-Lock-the-device-when-the-device-init-or-write.patch
```

Android11+ virtuelles A/B, fehlenden Include ergänzen:

```text
BOARD_USES_AB_IMAGE := true
BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
# 下面这段在配置时如果没有,请一起添加
ifeq ($(strip $(BOARD_USES_AB_IMAGE)), true)
  include device/rockchip/common/BoardConfig_AB.mk
  TARGET_RECOVERY_FSTAB := device/rockchip/rk356x/rk3566_rgo/recovery.fstab_AB
endif
```

Android13 GKI braucht komprimiertes virtuelles A/B:

```text
BOARD_ROCKCHIP_VIRTUAL_AB_COMPRESSION := true
```

Bei zu kleinen Partitionen Größe manuell setzen; Overlay nach Include `BoardConfig_AB.mk`.

```text
Android_SDK/device/rockchip/rk3588$ git diff rk3588_s/BoardConfig.mk
ifeq ($(strip $(BOARD_USES_AB_IMAGE)), true)
  include device/rockchip/common/BoardConfig_AB.mk
  TARGET_RECOVERY_FSTAB := device/rockchip/rk356x/rk3566_rgo/recovery.fstab_AB
endif
+ # 以下这段overlay必须要放到`include device/rockchip/common/BoardConfig_AB.mk`之后
+BOARD_SUPER_PARTITION_SIZE := 4294967296
+BOARD_ROCKCHIP_DYNAMIC_PARTITIONS_SIZE := $(shell expr $(BOARD_SUPER_PARTITION_SIZE) - 4194304)
```

A/B auch in RK3566/RK3568-u-boot:

```text
Android_SDK/u-boot$ git diff configs/rk3568_defconfig
+CONFIG_ANDROID_AB=y
 CONFIG_OPTEE_CLIENT=y
 CONFIG_OPTEE_V2=y
```

AVB/A-B prüfen, Fehlerbeispiel ohne AVB:

```sh
pm list features | grep android.software.verified_boot
ls -l /dev/block/by-name/
```

```text
CtsSecurityTestCases
android.security.cts.VerifiedBootTest#testVerifiedBootSupport
测试报错:java.lang.AssertionError: Verified boot must be supported on the device
```

Sperren ohne AVB verhindert Start. Quelllösungen: ① RKDevTool.exe→Advanced→Erase all→Neustart (Datenverlust); ② Boot-UART CTRL+C, seriell `fastboot usb 0`, adb-Port `fastboot oem at-unlock-vboot`.

```text
报错信息:Hit key to stop autoboot('CTRL+C'): 0
        ANDROID: reboot reason: "(none)"
        Vboot=0, AVB images, AVB verify
        read_is_device_unlocked() ops returned that device is LOCKED
        avb_slot_verify.c:763: ERROR: vbmeta: Error verifying vbmeta image: OK_NOT_SIGNED
        AVB verify failed ## AVB校验失败
        Android boot failed, error -1.
```

### 10.8 SELinux

Funktionsprobleme: `RKDocs/android/Rockchip_Developer_Guide_Android_SELinux(Sepolicy)_CN.pdf`. Vor Android12+-Zertifizierung userdebug gemäß README.md wiederholt scannen. Ergebnisse in `BOARD_SEPOLICY_DIRS`, z.B. `device/rockchip/rk3399/sepolicy_vendor/genfs_contexts`.

```text
device/rockchip/common/BoardConfig.mk:
BOARD_SELINUX_ENFORCING ?= true

RKTools/linux/Android_Devices_SELinux_Tool

console:/ $ chmod +x ./data/local/rockchip_selinux_tools
console:/ $ ./data/local/rockchip_selinux_tools
Please USE the following cmd to confirm which files need to be update!
get_build_var BOARD_SEPOLICY_DIRS ## 工程source和lunch后执行该命令
Add the following result to file: [genfs_contexts]
----------------------------------------------------- ## 将下面扫描结果添加到genfs_contexts
genfscon sysfs /devices/platform/av1d-master/wakeup u:object_r:sysfs_wakeup:s0
genfscon sysfs /devices/platform/es8388-sound/extcon u:object_r:sysfs_extcon:s0

Android_SDK$ get_build_var BOARD_SEPOLICY_DIRS
device/rockchip/common/sepolicy/vendor device/rockchip/rk3399/sepolicy_vendor
....
```

Mit `cat /vendor/etc/selinux/vendor_sepolicy.cil` prüfen. `/device/rockchip` ändern, nie `/system/sepolicy`. User-adb-root `ro.debuggable` nicht ändern: adbd hängt, Tests blockieren, Logs gehen verloren. Beispiele:

```text
I init : starting service 'adbd'...
I init : Created socket '/dev/socket/adbd', mode 660, user 1000, group 1000
W adbd : type=1400 audit(0.0:27602): avc: denied { setcurrent } for scontext=u:r:adbd:s0 tcontext=u:r:adbd:s0 tclass=process permissive=0
F adbd : main.cpp:162] Could not set SELinux context
I init : Service 'adbd' (pid 10075) received signal 6
I init : Sending signal 9 to service 'adbd' (pid 10075) process group...
E init : process with updatable components 'adbd' exited 4 times in 4 minutes

netd_integration_test
NetdSELinuxTest#CheckProperMTULabels
SuspendSepolicyTests
SuspendSepolicyTests#SuspendSepolicyTests
CtsSecurityHostTestCases
android.security.cts.SELinuxHostTest#testNoBugreportDenials ## 需要打开宏
BOARD_SELINUX_ENFORCING ?= true
```

### 10.9 Fingerprint fixieren (optional)

Fingerprint vor Test fixieren, damit Retry nach Firmwareänderung möglich bleibt; Ziffernfolge wählen.

```text
Android_SDK/device/rockchip/common$ git diff prebuild.mk
 -include $(TARGET_DEVICE_DIR)/prebuild.mk
+ROCKCHIP_BUILD_NUMBER := 202001 (写一串数字即可,自己定)
```

### 10.10 Sicherheitspatch-Level

Patches von Partner_Security_Bulletin oder Rockchip-FTP; `getprop | grep ro.build.version.security_patch`. Anleitung FTP `/GMS-Test-Suite/xTS/tools/Rockchip_Android_Security_Patch_Guide.pdf`. Laut Quelle meist drei Monate gültig; Fenster prüfen.

```text
GtsOsTestCases
com.google.android.os.gts.SecurityPatchTest#testSecurityPatchDate
报错信息:ro.build.version.security_patch should be "2023-03" or later. Found "2022-07-05"
```

| Android | Sicherheitszweig |
| --- | --- |
| 12 / 12L | android12-security-release |
| 13 | android13-security-release |
| 14 | android14-security-release |

Patches chronologisch anwenden, Level entsprechend ändern, nicht nur Datum. Jahr-Monat-Tag nötig, sonst leeres `--rollback_index` und vbmeta.img-Fehler. Werte, Fehler und Buildkette:

```text
build/make/core/version_defaults.mk
PLATFORM_SECURITY_PATCH := 2020-03-05

[ 99% 8801/8803] Target vbmeta image: out/target/product/rk3588_t/vbmeta.img
FAILED: out/target/product/rk3588_t/vbmeta.img
usage: avbtool make_vbmeta_image [-h] [--output OUTPUT]
                               [--padding_size NUMBER]
                               [--algorithm ALGORITHM] [--key KEY]
                               [--signing_helper APP]
                               [--signing_helper_with_files APP]
                               [--public_key_metadata KEY_METADATA]
                               [--rollback_index ROLLBACK_INDEX]
                               [--rollback_index_location ROLLBACK_INDEX_LOCATION]
                               [--append_to_release_string STR]
                               [--prop KEY:VALUE]
                               [--prop_from_file KEY:PATH]
                               [--kernel_cmdline CMDLINE]
                               [--setup_rootfs_from_kernel IMAGE]
                               [--include_descriptors_from_image IMAGE]
                               [--print_required_libavb_version]
                               [--chain_partition PART_NAME:ROLLBACK_SLOT:KEY_PATH]
                               [--flags FLAGS]
                               [--set_hashtree_disabled_flag]
avbtool make_vbmeta_image: error: argument --rollback_index: expected one argument

build/make/core/version_util.mk:
ifndef PLATFORM_SECURITY_PATCH_TIMESTAMP
  # Used to indicate the matching timestamp for the security patch string in PLATFORM_SECURITY_PATCH.
  PLATFORM_SECURITY_PATCH_TIMESTAMP := $(shell date -d 'TZ="GMT" $(PLATFORM_SECURITY_PATCH)' +%s)
endif
device/rockchip/common/modules/avb.mk:
BOARD_AVB_ROLLBACK_INDEX ?= $(PLATFORM_SECURITY_PATCH_TIMESTAMP)
build/make/core/Makefile:
ifdef BOARD_AVB_ROLLBACK_INDEX
  BOARD_AVB_MAKE_VBMETA_IMAGE_ARGS += --rollback_index $(BOARD_AVB_ROLLBACK_INDEX)
endif

define build-vbmetaimage-target
  $(call pretty,"Target vbmeta image: $(INSTALLED_VBMETAIMAGE_TARGET)")
  $(hide) mkdir -p $(AVB_CHAIN_KEY_DIR)
  $(call extract-avb-chain-public-keys, $(AVB_CHAIN_KEY_DIR))
  $(hide) $(AVBTOOL) make_vbmeta_image \
    $(INTERNAL_AVB_MAKE_VBMETA_IMAGE_ARGS) \
    $(PRIVATE_AVB_VBMETA_SIGNING_ARGS) \
    $(BOARD_AVB_MAKE_VBMETA_IMAGE_ARGS) \
    --output $@
  $(hide) rm -rf $(AVB_CHAIN_KEY_DIR)
endef
```

### 10.11 Widevine

Quelle nennt L1 bei RK3588/RK3399/RK356x, Tablets meist L3. Aktuelle L1-Unterstützung/Patches bei Rockchip, keine Zertifizierung aller Boards. Key-Packer FTP `GMS-Test-Suite/xTS/tools/rkpacker2`.

```text
BOARD_WIDEVINE_OEMCRYPTO_LEVEL := 3
```

### 10.12 Keymaster & Optee

Sub-License-Trust-OS: Optee V2 für RK3326/RK3562/RK356x/RK3588, sonst V1.

```text
PRODUCT_HAVE_OPTEE := true
```

### 10.13 Attestation key / Google keybox

Vor Test Google-keybox über3PL beantragen, rkpacker packen und schreiben. Tools `RKTools/linux/Linux_AttestationKeyboxPack_Tool.rar`, `RKTools/windows/KeyBoxWrite_v1.53.zip`, auch FTP `GMS-Test-Suite/xTS/tools/KeyBoxWrite_v1.53.zip`. Siehe `RKDocs/common/RKTools manuals/Rockchip_User_Guide_Keybox_Burning_EN.pdf`. Vor Build uboot-Schreiben aktivieren;3566/3568 unten, letztes Makro nichtRK3399.

```text
Android_SDK/u-boot$ git diff configs/rk3568_defconfig
 CONFIG_OPTEE_CLIENT=y
 CONFIG_OPTEE_V2=y
+CONFIG_ANDROID_WRITE_KEYBOX=y
+CONFIG_ANDROID_KEYMASTER_CA=y
+CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION=y ## RK3399不配置该宏
```

eMMC-security-Keys bleiben beim Flashen, nicht beim Löschen. Produktionsprüfung: uboot-FTP-Patch `/GMS-Test-Suite/Exp+/Attestation key`, `ro.boot.deviceid`. Testkeys Android/SoC-übergreifend, Produktion projektspezifisch. Im Bootloader schreiben, nach Fertigmeldung etwa8s vor Ausschalten warten. uboot ab2022-03, UART ret=0 erfolgreich. Android14+-logcat: yes programmiert, no nicht.

```text
write_key key_file=PrivateKey.RSA ret=0 ## 0表示烧写完成
write_key key_file=PrivateKey.EC ret=0
或
write attestation key: RSA ret_rsa=0

Provision google keybox:no,ID attestation:no ## yes表示已烧,no表示未烧
```

Neue Suiten brauchen beide Attestierungen, sonst unvollständiger/nicht hochladbarer Bericht. Mit3PL klären: Ein-Case-Bericht (`GtsEdiHostTestCases`), Gerätevorlage, txt mit einerID je Zeile/Gerät.

```text
W/ApkInstrumentationPreparer: Target preparation step
com.android.compatibility.common.deviceinfo.KeystoreAttestationDeviceInfo#testCollectDeviceInfo failed.
junit.framework.AssertionFailedError: KeystoreAttestationDeviceInfo collection
completed. expected:<COMPLETED> but was:<FAILED>
```

IDs eindeutig,1–32 Zeichen, nur `[a-z][A-Z][0-9][_][-][.]`, keine Leerzeichen. Unix-ASCII-Datei, sinnvoller Name gleicher Zeichen (`Make_Model_Date_Quantity.txt`); nurIDs, keine Kommentare/Kopfzeilen, eine je Zeile, keine Duplikate/Leerzeilen/Leerzeichen.

100000 keyboxes können Speicher erschöpfen. In4 teilen, `</Keybox>` zählen, NumberOfKeyboxes setzen; nach letztem `</Certificate></CertificateChain></Key></Keybox>` Rest entfernen, `</AndroidAttestation>` ergänzen, packen.100 und4 sind Beispielzahlen; tatsächliche Anzahl nutzen.

```text
$ chmod +x rkpacker
$ ./rkpacker attest_keyboxes.output -o keybox.kdb
55488 Data File Type : KEYBOX
Output File : keybox.kdb
Data File Num : 1
Total Key Num : 100000
out of memory at line 1
```

```sh
gzip -cdk 2023-01-01_***.output.gz > attest_keyboxes.output
split -n 4 attest_keyboxes.output --additional-suffix=.xml
cat xaa.xml | grep -w "</Keybox>" | wc -l
rkpacker xaa.xml -o keybox.kdb
```

```xml
<?xml version="1.0"?>
<AndroidAttestation>
<NumberOfKeyboxes>4</NumberOfKeyboxes>
<Keybox DeviceID="BW10RS23090001"><Key algorithm="ecdsa"><PrivateKey format="pem">......
......
-----END CERTIFICATE-----
</Certificate></CertificateChain></Key></Keybox>
</AndroidAttestation>
```

Bei fehlendem libcrypto FTP `/GMS-Test-Suite/xTS/tools/libcrypto.so.1.0.0` nach Ubuntu `/usr/lib/x86_64-linux-gnu/libcrypto.so.1.0.0`. Tests benötigen Key und `fastboot oem at-lock-vboot`; bei Fehlern laut Quelle Löschen/Flashen/Sperren mit Daten-/Keyverlust, nur freigegeben durchführen.

```text
报错信息:error while loading shared libraries: libcrypto.so.1.0.0: cannot open
shared object file: No such file or directory

CtsAppSecurityHostTestCases
CtsDevicePolicyManagerTestCases
CtsKeystorePerformanceTestCases
CtsKeystoreTestCases
VtsAidlKeyMintTargetTest
```

### 10.14 Android13 RKP

Android13+ vor Test Geräteinfos via `android-partner-api@company.com` hochladen. Siehe `RKDocs/android/Rockchip_Android_Remote_key_Provisioning_Guide.pdf`; Fehler ohne Upload:

```text
GtsGmscoreHostTestCases
com.google.android.gts.security.AttestationRootHostTest#testEcAttestationChainRemProvLength
com.google.android.gts.security.AttestationRootHostTest#testRsaAttestationChainRemProvLength
或
GtsGmscoreHostTestCases
com.google.android.gts.security.AttestationRootHostTest#testEcAttestationChainRemProvLengthTee
com.google.android.gts.security.AttestationRootHostTest#testRsaAttestationChainRemProvLengthTee
```

Tool `/vendor/bin/rockchip_rkp_factory_extraction_tool`. ErstSN; unveränderteSN kein neuerCSR. Gemeinsam Key/CSR: `RKTools/windows/KeyboxWriter-v1.55.7z`; getrennt FTP `GMS-Test-Suite/xTS/tools/KeyBoxWrite_v1.53.zip`. Konto mindestens1–2Wochen; früh beantragen.

### 10.15 Android14 Device ID Attestation

Android14+ schreibt Device ID Attestation einmalig, unveränderbar; vor Neuschreiben RKDevTool.exe löschen. Siehe `RKDocs/android/Rockchip_User_Guide_Android_Device_ID_Attestation_Flash_CN.pdf`; FTP `/GMS-Test-Suite/xTS/tools/RKDevInfoWriteTool-V1.2.1.7z`. ErstSN, sonstRKP-Fehler. Features/Fehler:

```text
10:54:48:013 ReadRkp[15]: reading sn from device fail

pm list features | grep android.software.device_id_attestation
pm list features | grep android.hardware.device_unique_attestation

CtsKeystoreTestCases
android.keystore.cts.KeyAttestationTest#testRsaAttestation
android.keystore.cts.KeyAttestationTest#testEcAttestation
android.keystore.cts.DeviceOwnerKeyManagementTest#testAllVariationsOfDeviceIdAttestation
报错信息:java.lang.UnsupportedOperationException: Device does not support Device ID attestation.
```

### 10.16 GKI

GKI ab Android12 mit Linux5.4 erforderlich; Quelle umfasst RK3588 Android12 und alle Android13. Siehe `RKDocs/android/Rockchip_Developer_Guide_GKI_CN.pdf` und AnhangB. Google Release boot.img verwenden, boot laut Quelle64Mb; Code67108864 bleibt erhalten. vendor_boot prüfen.

```text
BOARD_BUILD_GKI := true

device/rockchip/common/build/rockchip/Partitions.mk:
  ifeq ($(BOARD_BUILD_GKI),true)
    BOARD_BOOTIMAGE_PARTITION_SIZE ?= 67108864
    BOARD_VENDOR_BOOTIMAGE_PARTITION_SIZE ?= 41943040
```

```text
ls -l /dev/block/by-name/vendor_boot*
```

```text
CtsHardwareTestCases
android.hardware.input.cts.tests.SonyDualSenseBluetoothTest#testAllKeys
vts_fs_test
fs#ErofsSupported
VtsBootconfigTest
VtsBootconfigTest#ProcCmdlineAndroidbootTest
```

### 10.17 Kernelversionen

Android12: RK3326,RK356x,RK3399,RK3288 verwenden4.19 statt5.10; RK3588 verwendet5.10 statt4.19. Android13 verwendet kernel-5.10. Vor Änderungen Verzeichnis prüfen.

### 10.18 Incremental FS

Nur Android12 benötigt diesen Schritt mitV2. kernel-4.19 enthält es wegen älterer Kompatibilität nicht direkt; Module in user/userdebug. Kerneländerungen können ko ungültig machen: anhand base.txt/Patches neu bauen. Ohne ältere Kompatibilität fest einbauen, ohneko.

```text
vendor/rockchip/common/modular_kernel/4.19$ tree user*
user
`-- incrementalfs.ko
userdebug
`-- incrementalfs.ko
0 directories, 2 files

$ adb shell lsmod
Module Size Used by
bcmdhd 1150976 0
incrementalfs 77824 0

vendor/rockchip/common/modular_kernel/4.19/incrementalfs_patch

git log fs/incfs/

cat kernel-4.19/.config | grep CONFIG_INCREMENTAL_FS
# CONFIG_INCREMENTAL_FS is not set
```

`/sys/fs/incremental-fs/features/v2` oder `pm list features | grep incremental` prüfen; Feature/Fehler folgen.

```text
feature:android.software.incremental_delivery=2

GtsIncrementalInstallProxyHostTestCases
com.google.android.packageinstallerv2proxy.host.gts.ConcurrentInstallationHostTest#testConcurrentInstallWithOneFailure
报错信息:java.lang.AssertionError: expected:<SUCCESS> but was:<FAILURE>
关键打印:[incfs] Feature is not enabled
I InstallationHelper: Commit
I IncrementalService: createStorage: /data/app/vmdl1270450043.tmp | 5
W incfs : [incfs] Feature is not enabled
E IncrementalService: Vold::mountIncFs() failed: Status(-8,
EX_SERVICE_SPECIFIC): '-95: '
E InstallationHelper: Installation Failed. Error Code: 6, message:
INSTALL_FAILED_MEDIA_UNAVAILABLE: Couldn't create incremental storage at
/data/app/vmdl1270450043.tmp
```

### 10.19 Signaturen

Siehe build/target/product/security/README. media/platform/shared/testkey jeweils pem,pk8,x509.pem:12 Dateien. Passwort leer lassen, sonst Entschlüsselungsfehler. OTA_KEY_DIR in device/rockchip/common/mkimage.sh ist device/rockchip/common/security. Android11/12/14: build/target/product/security ersetzen; Android13: device/rockchip/common/security.

```text
build/target/product/security/README

  development/tools/make_key testkey '/C=CN/ST=Fujian/L=Fuzhou/O=Rockchip/OU=Rockchip/CN=Rockchip/emailAddress=gms@rock-chips.com'
  生成:testkey.pk8 testkey.x509.pem ## 文件在根目录下
  openssl pkcs8 -inform DER -nocrypt -in testkey.pk8 -out testkey.pem
  生成:testkey.pem

# Android 13替换到如下目录
device/rockchip/common/security/
# Android 14替换到如下目录
build/target/product/security/

Enter password for 'testkey' (blank for none; password will be visible):
 ## 不设密码直接回⻋Enter
报错信息:Error decrypting key
139:error:0D0680A8:asn1 encoding routines:asn1_check_tlen:wrong
tag:../crypto/asn1/tasn_dec.c:1149:
139:error:0D06C03A:asn1 encoding routines:asn1_d2i_ex_primitive:nested asn1
error:../crypto/asn1/tasn_dec.c:713:
139:error:0D08303A:asn1 encoding routines:asn1_template_noexp_d2i:nested asn1
error:../crypto/asn1/tasn_dec.c:646:Field=version, Type=PKCS8_PRIV_KEY_INFO
```

BTS prüft kompromittierte framework-res-Schlüssel: platform.pk8/x509.pem ersetzen. Drei Bluetooth-Zertifikatstellen unten müssen übereinstimmen.

```text
Blocked app /system/framework/framework-res.apk
报错信息:This build contains pre-installed "android" at
/system/framework/framework-res.apk which has been signed by a certificate that
is known to be compromised and should be replaced.

device/rockchip/common/security/bluetooth.x509.pem
packages/modules/Bluetooth/android/app/certs/com.android.bluetooth.x509.pem
vendor/partner_modules/build/certificates/bluetooth.x509.pem
```

### 10.20 Apex-Signaturen

Auch reguläres GMS benötigt Austausch. btservices: packages/modules/Bluetooth/apex. Für i18n erst source/lunch; anschließend make clean. AlgorithmusSHA256_RSA4096. Bei weiteren Fehlern Terminal neu öffnen, Cache /tmp/ApexSignatureVerificationTest*** prüfen.

```text
CtsAppSecurityHostTestCases
android.appsecurity.cts.ApexSignatureVerificationTest#testApexPubKeyIsNotWellKnownKey
报错信息:java.lang.AssertionError: must not use well known pubkey
        Expected: must not match well known key
         but: was
</tmp/ApexSignatureVerificationTest13030241211815479418/tests-apex_com.android.btservices874024/apex_pubkey>
GtsApexSignatureVerificationTest
android.appsecurity.cts.ApexSignatureVerificationTest#testApexPubKeyIsNotWellKnownKey
报错信息:1. com.rockchip.hardware.sensors must not use well known pubkey

          expected to be false
        7. com.android.rkpd must not use well known pubkey
          expected to be false
解决方法:根据报错信息替换apex_com.android.btservices签名(SDK目录
packages/modules/Bluetooth/apex)
GtsPackageSignatureTest
android.security.cts.PackageSignatureTest#testPackageSignatures
报错信息:These packages should not be signed with a well known key:
[com.android.bluetooth, com.android.btservices, com.android.i18n,
com.android.rkpd, com.android.runtime, com.android.uwb,
com.android.uwb.resources, com.android.virt, com.android.vndk.v34,
com.rockchip.hardware.sensors]

cd libcore/apex/
rm com.android.i18n.pem com.android.i18n.avbpubkey
openssl genrsa -out com.android.i18n.pem 4096 ## 注意换行
avbtool extract_public_key --key com.android.i18n.pem --output com.android.i18n.avbpubkey

报错信息:avbtool: Adding hashtree_footer failed: Key is wrong size for algorithm SHA256_RSA4096.
```

Pfade: i18n Android13/12 packages/modules/RuntimeI18n/apex, Android11 libcore/apex; runtime immer bionic/apex; art auf13/12 nicht nötig, auf11 art/build/apex. Tabelle enthält auch leere btservices-Zeile trotz Angabe dreier Module.

### 10.21 Vorinstallierte Anwendungen

User-Builds prüfen Berechtigungen. Ohne Express-Makro Fehler unten: Prüfung nur nach bestätigten Standard-API/Berechtigungen entfernen. Zum Debuggen enforce auf log. Ohne adb boot-debug.img für boot (A/B boot_a/boot_b); GKI vendor_boot-debug.img für vendor_boot_a/vendor_boot_b.

```text
error: Please note that all your apps MUST be able to get permissions, Otherwise android cannot boot!

Android_SDK/device/rockchip/common$ git diff modules/gms.mk
   ifeq ($(strip $(TARGET_BUILD_VARIANT)), user)
     ifneq ($(strip $(BUILD_WITH_GOOGLE_GMS_EXPRESS)),true)
       $(warning ****************************************)
- $(error Please note that all your apps MUST be able to get permissions, Otherwise android cannot boot!)
       $(warning After confirming your apps, please remove the above error line!)
       $(warning ****************************************)

device/rockchip/common/modules/gms.mk:
# Enforce privapp-permissions whitelist only for user build.
PRODUCT_PROPERTY_OVERRIDES += \
    ro.control_privapp_permissions=enforce --> 改为
ro.control_privapp_permissions=log
```

Nach not in privapp-permissions allowlist suchen, Berechtigung zur APK-Partition hinzufügen. Beispiel system_ext Wallpaper unten. RKDeviceTest,Lightning,StressTest,RKUpdateService nicht einbauen.

```text
W PackageManager: Privileged permission
android.permission.READ_WALLPAPER_INTERNAL for package
com.google.android.apps.wallpaper (/system_ext/priv-app/WallpaperGoogle) not in
privapp-permissions allowlist
W PackageManager: Privileged permission
android.permission.SET_WALLPAPER_COMPONENT for package
com.google.android.apps.wallpaper (/system_ext/priv-app/WallpaperGoogle) not in
privapp-permissions allowlist
W PackageManager: Privileged permission
android.permission.CHANGE_OVERLAY_PACKAGES for package
com.google.android.apps.wallpaper (/system_ext/priv-app/WallpaperGoogle) not in
privapp-permissions allowlist
W PackageManager: Privileged permission android.permission.WRITE_SECURE_SETTINGS
for package com.google.android.apps.wallpaper (/system_ext/priv-app/WallpaperGoogle) not in privapp-permissions allowlist

Android_SDK/vendor/partner_gms$ git diff etc/permissions/privapp-permissions-google-system-ext.xml
+ <privapp-permissions package="com.google.android.apps.wallpaper">
+ <permission name="android.permission.READ_WALLPAPER_INTERNAL"/>
+ <permission name="android.permission.SET_WALLPAPER_COMPONENT"/>
+ <permission name="android.permission.CHANGE_OVERLAY_PACKAGES"/>
+ <permission name="android.permission.WRITE_SECURE_SETTINGS"/>
+ </privapp-permissions>
 </permissions>
```

### 10.22 Vorprüfungen

Abgesicherter Modus: Leiser während Bootanimation oder Neustart lange drücken. Lockdown: Passwort setzen, Einstellungen→Sicherheit/Standort→Sperrbildschirmoptionen→Lockdown anzeigen. Verschlüsselung: Einstellungen→Sicherheit→Weitere Sicherheit→Verschlüsselung/Zugangsdaten→Tablet verschlüsseln.

## 11 GMS Express

GMS Express stellt monatliche Sicherheitsupdates bereit. Tabelle bewahrt Regular/Go-Status; Sternchen sind undefiniert, keine Verfügbarkeitsaussage.

| Chip | Android12 Regular/Go | Android13 Regular/Go | Android14 Regular/Go |
| --- | --- | --- | --- |
| RK3288 | Y/N | */N | N/N |
| RK3326 | Y/Y | */Y | * |
| RK3399 | Y/N | */N | */N |
| RK3562 | N/N | Y/Y | Y/Y |
| RK3566 | Y/Y | Y/Y | Y/Y |
| RK3576 | N/N | N/N | */N |
| RK3588 | Y/N | Y/N | Y/N |

### 11.1 Antrag und Wartung

MADA und gegebenenfalls Go-Zusatz erforderlich; EDLA nutzt Sonderkonfiguration unten. Express enthält monatliche Sicherheitspatches,GMS,wichtige AOSP-Basisupdates; Kunden informieren und Endgeräte per OTA aktualisieren, sonst endet entsprechende Rockchip-Unterstützung. Anderes SDK über Vertrieb mit Qualifikationsnachweis beantragen.

### 11.2 SDK und Konfiguration

Ab Android10 gemeinsamer Code: manifest wechseln ohne vollständigen Neudownload. Groß-/Kleinschreibung bleibt erhalten.

```text
repo init -m Android10_Express.xml
# Android 11请使用Android 11的xml
repo init -m Android11_Express.xml
# Android 12请使用Android 12的xml
repo init -m Android12_express.xml
# Android 13请使用Android 13的xml
repo init -m Android13_Express.xml
# Android 14请使用Android 14的xml
repo init -m Android14_Express.xml

repo init --repo-url=ssh://git@www.rockchip.com.cn:2222/repo-release/tools/repo.git -u ssh://git@www.rockchip.com.cn:2222/Android_Qt/manifests.git -m Android10_Express.xml
# Android 11
repo init --repo-url=ssh://git@www.rockchip.com.cn:2222/repo-release/tools/repo.git -u ssh://git@www.rockchip.com.cn:2222/Android_R/manifests.git -m Android11_Express.xml
# Android 12
repo init --repo-url=ssh://git@www.rockchip.com.cn:2222/repo-release/tools/repo.git -u ssh://git@www.rockchip.com.cn:2222/Android_S/manifests.git -m Android12_express.xml
# Android 13
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo -u https://gerrit.rock-chips.com:8443/Android_T/manifests.git -m Android13_Express.xml
# Android 14
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo -u https://gerrit.rock-chips.com:8443/Android_U/manifests.git -m Android14_Express.xml

BUILD_WITH_GOOGLE_GMS_EXPRESS := true
```

Makro entfernt RK-Apps, eigene ergänzen. GMSEXPRESS_BUILD steuert Features, Basis ExpPlus. Nach Anpassungen Exp+-Anforderungen vor PLUS-Änderung prüfen. Mögliche Förderung laut Quelle bei3PL klären; nicht EDLA, keine Zusage.

```text
Android_SDK/vendor/rockchip/common$ git diff gms-express.xml
  <!-- These are configurations that should exist on GMS Express devices. -->
  <config>
- <feature name="com.google.android.feature.GMSEXPRESS_BUILD " />
+ <feature name="com.google.android.feature.GMSEXPRESS_PLUS_BUILD" />
  </config>
```

EDLA kann Express nicht nutzen, true aktiviert jedoch Formfaktor-Features in gms-express.xml. Batterielos benötigt FTP GMS-Test-Suite/Exp+/batteryless.diff. Alle Namen mit Präfix com.google.android.feature.: batterielos other_form_factor,batteryless_device; Batterie und >18Zoll other_form_factor,large_display; batterielos >18Zoll alle drei; batterielos separater Bildschirm other_form_factor,batteryless_device,headless_device.

```text
Android_SDK/vendor/rockchip/common$ git diff gms-express.xml
  <!-- These are configurations that should exist on GMS Express devices. -->
  <config>
- <feature name="com.google.android.feature.GMSEXPRESS_BUILD " />
+ <feature name="com.google.android.feature.ENTERPRISE_DEVICE" />
+ <feature name="com.google.android.feature.batteryless_device"/>
  </config>
```

## 12 Hostkonfiguration

### 12.1 Ubuntu-Hostumgebung

Die Quelle verlangt einen Ubuntu-Host statt Windows mit eingerichtetem Java, Python, adb, fastboot und aapt. Nachfolgend stehen der Rockchip-FTP für Sicherheitspatches und die in der Quelle abgedruckten Zugangsdaten; ihre aktuelle Gültigkeit wurde nicht geprüft. Häufige Android-12+-Korrekturen und Werkzeuge liegen unter `GMS-Test-Suite/Exp+`.

| Adresse | Konto | Passwort |
| --- | --- | --- |
| ftp://ftp.rock-chips.com | xzj-guest | V3qTwMQ4YV |

Die Quelle empfiehlt, `Android_O_cts_env.tar.gz` vom FTP zu entpacken und diese Variablen in `~/.bashrc` einzutragen oder als `env` zu speichern und vor dem Test `source env` auszuführen. Ersetzen Sie `Your_Name`. Aktualisieren Sie anschließend adb, aapt und fastboot nach §12.2; zu alte Versionen verursachen Testprobleme.

```sh
export JAVA_HOME=/home/Your_Name/Software/jdk1.8.0_77 ## 注意替换Your_Name
export JRE_HOME=${JAVA_HOME}/jre
export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib
export PATH=${JAVA_HOME}/bin:$PATH
export PATH=/home/Your_Name/Software/android-sdk-linux/tools:$PATH
export PATH=/home/Your_Name/Software/android-sdk-linux/platform-tools:$PATH
export PATH=/home/Your_Name/Software/android-sdk-linux/build-tools/19.0.0:$PATH

$ aapt version
$ adb --version
$ fastboot --version
$ java --version
```

| Android-Version | adb mindestens | fastboot mindestens |
| --- | --- | --- |
| Android 10.0 | 29.0.6+ | 29.0.6+ |
| Android 11.0 | 30 | 30 |
| Android 12.0 | 31 | 31 |
| Android 12.1 (Android 12L) | 31 | 31 |
| Android 13 | 33 | 33 |

Ist aapt nicht verfügbar, installieren Sie die C++-Kompatibilitätsbibliotheken; sonst kann CtsDeqpTestCases fehlschlagen. Installieren Sie anschließend Python-Entwicklungspakete, Protocol Buffer und Werkzeuge für virtuelle Umgebungen. Python 3 benötigt gegebenenfalls auch das letzte Paket.

```sh
$ sudo apt-get install lib32stdc++6 lib32z1
$ sudo apt-get install python-dev
$ sudo apt-get install python-protobuf
$ sudo apt-get install protobuf-compiler
$ sudo apt-get install python-virtualenv
$ sudo apt-get install python-pip
$ sudo apt install virtualenv
```

### 12.2 Fehlerbehebung in der Hostumgebung

**1. Virtuelle Umgebung lässt sich nicht erstellen.** Für diesen VTS-Fehler schlägt die Quelle vor, pip auf pip2 zu setzen und virtualenv über pip zu installieren. Diese historischen Umgebungsschritte wurden hier nicht ausgeführt.

```sh
$ sudo apt autoremove python-virtualenv
$ sudo apt autoremove virtualenv
$ sudo ln -sf ~/.local/bin/pip2 /usr/bin/pip
$ pip install --user virtualenv
```

**2. adb, aapt und fastboot aktualisieren.** Ersetzen Sie sie durch SDK-Werkzeuge; siehe `Rockchip_Android_*_development_guide_V*_CN.pdf`. Ermitteln Sie bei adb zuerst den Pfad und stoppen Sie den Server, bevor Sie die Binärdateien ersetzen. Das FTP-Archiv heißt `GMS-Test-Suite/sdk_tools.tar.gz`. Ein altes fastboot kann bei `fastboot reboot fastboot` folgenden Fehler melden.

```text
$ whereis adb
adb: /home/rockchip/Software/android-sdk-linux/platform-tools/adb
$ adb kill-server
fastboot: usage: unknown reboot target fastboot
```

**3. Neue Testsuiten benötigen aapt2.** Zwei Fehler stehen unten. Ermitteln Sie den aapt-Pfad, kopieren Sie SDK `out/host/linux-x86/bin/aapt2` nach `/home/rockchip/Software/sdk_tools/aapt2` auf Ubuntu und führen Sie `chmod 775 aapt2` aus. Der folgende Build-Auszug der Quelle enthält nicht den vollständigen Abschlusskontext.

```text
java.io.IOException: Cannot run program "aapt2": error=2, No such file or directory
E/AaptParser: aapt2 dump badging stderr: W/ziparchive(2284292): Unable to open 'badging': No such file or directory
$ which aapt
/home/rockchip/Software/sdk_tools/aapt

prebuilts/sdk/tools/Android.bp
cc_prebuilt_binary {
    name: "aapt2",
    host_supported: true,
    prefer: true,
    target: {
        linux: {
            srcs: ["linux/bin/aapt2"],
        },
        darwin: {
            srcs: ["darwin/bin/aapt2"],
        },
        windows: {
            srcs: ["windows/bin/aapt2.exe"],
        },
    },
```

**4. adb devices meldet no permissions.** Ermitteln Sie VID/PID mit lsusb, tragen Sie die tatsächlichen Werte in eine udev-Regel ein und fragen Sie nach erneutem Verbinden des adb-Kabels ab. `1f3a:1001` ist nur das Quellenbeispiel.

```text
$ adb devices
List of devices attached
CKP0KUIQQ1 no permissions(missing udev rules? user is in the plugdev group);
see http://developer.android.com/tools/device.html

$ lsusb
Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 001 Device 070: ID 1f3a:1001 Onda (unverified)
## 获取adb设备识别码1f3a:1001
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub

$ sudo vim /etc/udev/rules.d/android.rules
SUBSYSTEM=="usb",ATTRS{idVendor}=="1f3a",ATTRS{idProduct}=="1001",MODE="0666"
## 添加adb设备注意替换1f3a:1001

$ adb devices
List of devices attached
CKP0KUIQQ1 device
```

**5. fastboot devices meldet no permissions.** Führen Sie lsusb im Fastboot-Modus aus und ergänzen Sie dessen VID/PID; die Kennungen unterscheiden sich vom adb-Modus.

```text
$ fastboot devices
no permissions(missing udev rules? user is in the plugdev group); see [......]
Android Fastboot
```

**6. JNI-Fehler in CtsUsesNativeLibraryTest.** Die Quelle empfiehlt ein JDK-Update aus FTP `/GMS-Test-Suite/openjdk-11+28_linux-x64_bin.tar.gz`. Fehler und Prüfausgabe:

```text
java.lang.RuntimeException: Error: A JNI error has occurred, please check your installation and try again
Exception in thread "main" java.lang.UnsupportedClassVersionError:
com/android/signapk/SignApk has been compiled by a more recent version of the Java Runtime (class file version 55.0), this version of the Java Runtime only recognizes class file versions up to 52.0

$ java --version
openjdk 11 2018-09-25
OpenJDK Runtime Environment 18.9 (build 11+28)
OpenJDK 64-Bit Server VM 18.9 (build 11+28, mixed mode)
$ whereis java
java: /usr/share/java /home/Rockchip/Software/jdk-11/bin/java
```

**7. Zu wenig Heap-Speicher unter Ubuntu.** Die Quelle verlangt mindestens 16 GB Host-RAM und schlägt einen Neustart vor dem erneuten Test vor.

```text
E/CommandScheduler: Java heap space
java.lang.OutOfMemoryError: Java heap space
${JAVA_BINARY} $RDBG_FLAG -Xmx16g -XX:+HeapDumpOnOutOfMemoryError -cp ${JAR_PATH} -DCTS_ROOT=${CTS_ROOT}
```

### 12.3 Docker-Testumgebung

Alternativ zur obigen Ubuntu-Einrichtung nennt die Quelle einen Docker-Container unter FTP `GMS-Test-Suite/xTS/tools/Docker` für die Tests.

## 13 GMS-Zertifizierungstests

### 13.1 Vorbereitung der Tests

1. Flashen Sie das DUT gemäß den Rockchip-Android-SDK-Releasehinweisen.
2. Der erste GMS-Start dauert länger. Warten Sie, wählen Sie United States English, überspringen Sie zunächst Wi-Fi, wählen Sie eine US-Zeitzone, melden Sie kein Konto an und wechseln Sie zu Home.
3. Verbinden Sie anschließend Gerät und Ubuntu-Host mit Wi-Fi/VPN; der Host soll direkt und nicht über SSR verbunden sein.
4. Vor CTS/GTS nicht bei GMS anmelden. Ausnahme: Der EEA-Go-Einzeltest `GtsRegulationComplianceTestCases` verlangt gemäß EEA-Dokumentation ein EEA-Testkonto und eine andere Suchmaschine als Google, etwa DuckDuckGo.
5. Settings → Security → Screenlock auf None setzen.
6. Bei physischer Tastatur Languages & input → Physical keyboard → Show virtual keyboard aktivieren.
7. Mehrfach Settings → About tablet (phone) → Build Number antippen, um Developer Options einzublenden.
8. Developer options → Stay awake aktivieren.
9. Settings → Location eingeschaltet lassen.
10. Display → Sleep auf das längste Intervall setzen und für lange Tests die Helligkeit reduzieren.
11. Display → Adaptive brightness aktivieren (Android-13-Anforderung laut Quelle).
12. Neuere android-cts-media-version-Ressourcen verwenden; siehe §14.
13. `source copy_media.sh && source copy_image.sh` aus dem Medienpaket ausführen oder es unter `/tmp/android-cts-media/android-cts-media-1.4` ablegen; Android 11+ benötigt media-1.5.
14. Vor VTS die Sensor-Kalibrierung prüfen. Sie bleibt erhalten, muss nach Firmwareupdates aber erneut geprüft werden. Ein unkalibriertes Gerät waagerecht und ruhig ablegen; für user-Firmware vendor_boot-debug.img flashen und folgende Befehle verwenden.

```text
$ adb root
adbd is already running as root
$ adb shell
console:/ $ cat /sys/class/sensor_class/accel_calibration
read error ## 未校准
console:/ $ echo 1 > /sys/class/sensor_class/accel_calibration ## 机器水平静止放置
console:/ $
console:/ $ cat /sys/class/sensor_class/accel_calibration
accel calibration: 166, -309, -177 ## 校准成功
```

15. Physische Hochformatdisplays hochkant, Querformatdisplays waagerecht aufstellen.
16. Für diese Tests keine PIN-Sperre setzen (`Device must have screen lock disabled`).
17. Prüfen, dass die SN nach Neustart unverändert bleibt; siehe §15.4.
18. Diese Konfiguration vor jedem neuen Test wiederholen.

Hinweis: §13.10 verlangt für bestimmte interaktive CTS-Verifier-Tests gesondert eine PIN. Unterscheiden Sie den Testkontext.

### 13.2 Testkonsolen starten

```sh
Rockchip@Rockchip-pc:~/android-cts/tools$ ./cts-tradefed ## CTS测试终端
Rockchip@Rockchip-pc:~/android-vts/tools$ ./vts-tradefed ## VTS测试终端
Rockchip@Rockchip-pc:~/android-gts/tools$ ./gts-tradefed ## GTS测试终端
Rockchip@Rockchip-pc:~/android-sts/tools$ ./sts-tradefed ## STS测试终端
Rockchip@Rockchip-pc:~/android-apts-go/tools$ ./apts-tradefed ## APTS测试终端
```

### 13.3 Tests auf mehrere Geräte verteilen

Die meisten Tests unterstützen `--shard-count`. Laut Quelle gehen bei Stromausfall oder Absturz eines Geräts dessen Berichte verloren, wodurch Modulzahlen abweichen. Empfohlen wird, stabile Geräte zunächst zehn Minuten einzeln zu testen, das Gerät dann für einen vollständigen Bericht zu trennen und darauf aufbauend mit mehreren Geräten retry auszuführen.

```sh
run cts --shard-count 3 -s SN1 -s SN2 -s SN3 ## 3台机器同时跑CTS
```

### 13.4 Modul oder Testfall ausschließen

```sh
run cts --exclude-filter "CtsViewTestCases"
run cts --exclude-filter "CtsViewTestCases android.view.cts.SurfaceViewSyncTests#testEmptySurfaceView"
```

### 13.5 GSI flashen

Nach bestätigter Entsperrung fastbootd starten und system.img aus GSI sowie misc.img aus dem Firmwarebuild flashen; anschließend setzt Recovery das Gerät zurück. Schritt 1: Bootloader und Entsperrung; bei geschriebenem AVB-Public-Key gilt die zugehörige Entsperranleitung. Schritt 2: Zurücksetzen und fastbootd starten. Schritt 3: GSI flashen; bei Platzmangel product beziehungsweise product_a und product_b bei A/B oder Virtual A/B entfernen. Der folgende Quellablauf wurde nicht ausgeführt.

```sh
adb reboot bootloader
fastboot oem at-unlock-vboot ## 对于烧写过avb公钥的客户，请参考对应的文档解锁。
fastboot reboot fastboot ## 此时将进入fastbootd
## (可选)对于分区空间紧张的设备，可以先执行本条命令删除product分区后再烧写GSI
fastboot delete-logical-partition product
## 对于使用A/B，虚拟A/B的设备，需要同时删除product_a/product_b
fastboot delete-logical-partition product_a
fastboot delete-logical-partition product_b
fastboot flash system system.img
## 烧misc.img恢复出厂设置(否则机器开机可能卡在加载界面)，misc是固件一起编译出来的
fastboot flash misc misc.img
## VTS测试：GKI固件烧写vendor_boot-debug.img到vendor_boot分区；非GKI固件烧写boot-debug.img到boot分区
fastboot flash vendor_boot vendor_boot-debug.img
## 烧写成功后，重启
fastboot reboot
```

1. Alternativ nennt die Quelle DSU (Dynamic System Updates) als standardmäßig unterstützt. Wegen des hohen Speicherbedarfs wird von Geräten mit 2G DDR oder weniger abgeraten; siehe Android-Dokumentation.
2. VTS benötigt zusätzlich boot-debug.img in boot oder bei GKI vendor_boot-debug.img in vendor_boot; das Gerät bleibt entsperrt.
3. CTS-ON-GSI benötigt diese Debug-Images nicht.
4. Offizielle Google-GSI-Images mit signed- und GKI-Boot-Images als Release-Build verwenden.
5. Startet GSI nicht, passendes Debug-Image flashen und logcat über adb/seriell erfassen.

| Versionskennung der Quelle | Downloadbeschreibung |
| --- | --- |
| aosp-android11-gsi | Android 11 PAB GSI; aosp_arm64-img suchen |
| aosp-android12-gsi | Android 12 PAB GSI; aosp_arm64-img suchen |
| aosp-android13-gsi | Android 13 PAB GSI; aosp_arm64-img suchen |
| aosp-android13-gsi | Android 14 PAB GSI; aosp_arm64-img suchen |

Die Android-14-Zeile nennt in der Quelle weiterhin aosp-android13-gsi. Diese Abweichung bleibt erhalten; die Downloadversion wird nicht geraten.

### 13.6 Sperrstatus für VTS / CTS-ON-GSI

- CTS/GTS: vollständige OEM-Firmware, vor dem Test mit `fastboot oem at-lock-vboot` sperren.
- CTS-on-GSI: entsperren, GSI flashen und wieder sperren; laut Quelle ist ab Android 13 nach GSI keine erneute Sperrung erforderlich.
- VTS: entsperren, boot-debug und GSI flashen, entsperrt lassen.

CTS-on-GSI verlangt signed- GSI mit einem Sicherheitspatchstand mindestens auf SDK-Niveau, sonst verhindert erneutes Sperren den Start. Nach GSI zeigt Security Patch dessen Stand statt des ursprünglichen Firmwarestands. Android 11/12 CTS und CTS-on-GSI müssen wie beschrieben gesperrt sein, sonst können folgende Fehler auftreten; Android 13+ CTS-ON-GSI verlangt dies nicht.

```text
CtsKeystoreTestCases
android.keystore.cts.KeyAttestationTest#testEcAttestation
android.keystore.cts.KeyAttestationTest#testRsaAttestation
android.keystore.cts.KeyAttestationTest#testEcAttestation_DeviceLocked
android.keystore.cts.KeyAttestationTest#testRsaAttestation_DeviceLocked

console:/ $ getprop | grep ro.boot.verifiedbootstate
[ro.boot.verifiedbootstate]: [orange] ## 属性值orange表示机器未锁定
[ro.boot.verifiedbootstate]: [green] ## 属性值green表示机器已锁定
console:/ $ getprop | grep ro.boot.vbmeta.device_state
[ro.boot.vbmeta.device_state]: [unlocked] ## 属性值unlocked表示机器未锁定
[ro.boot.vbmeta.device_state]: [locked] ## 属性值locked表示机器已锁定
```

### 13.7 VTS

Zusätzlich signiertes AOSP system-xxx-signed.img von Google, 3PL oder Rockchip-FTP sowie boot-debug.img flashen. Bei aktiviertem AVB liegt die Ausgabe unter rockdev/Image-xxx; die GKI-Debug-Variante steht oben.

| Testpaket | Start | Retry | Einzeltest |
| --- | --- | --- | --- |
| android-vts-xxx-arm_64.zip | `run vts` | `run retry --retry 0` | `run vts -m module_name -t case_name` |

### 13.8 CTS-ON-GSI

Signiertes GSI wie oben flashen. Die Quelle unterscheidet die aktuelle Tabelle vom Paket für Android 10 und älter:

| Testpaket | Start | Retry | Einzeltest |
| --- | --- | --- | --- |
| android-cts-xxx-arm_64.zip | `run cts-on-gsi` | `run retry --retry 0` | `run cts-on-gsi -m module_name -t case_name` |

Android 10 und älter:

| Testpaket | Start | Retry | Einzeltest |
| --- | --- | --- | --- |
| android-vts-xxx-arm_64.zip | `run cts-on-gsi` | `run retry --retry 0` | `run cts-on-gsi -m module_name -t case_name` |

### 13.9 CTS

Vollständige, wie oben konfigurierte user-Firmware verwenden.

| Testpaket | Start | Retry | Einzeltest |
| --- | --- | --- | --- |
| android-cts-_xxx-linux_x86-arm.zip | `run cts` | `run retry --retry 0` | `run cts -m module_name -t case_name` |

### 13.10 CTS-Verifier

Vollständige user-Firmware wie oben verwenden. Beim Paket `android-cts-verifier-xx_xx-linux_x86-arm.zip` erfolgen Start, Retry und Einzeltests manuell. Die Reihenfolge und jeweiligen Versionsbedingungen beachten:

1. Vor der Installation:

```sh
adb shell settings put global hidden_api_policy 1
```

2. Danach mit diesem Befehl installieren:

```sh
adb install -r -g CtsVerifier.apk
```

3. Android 10+:

```sh
adb shell appops set com.android.cts.verifier android:read_device_identifiers allow
```

4. Android 11+:

```sh
adb shell appops set com.android.cts.verifier MANAGE_EXTERNAL_STORAGE 0
```

5. Android 13+:

```sh
adb shell am compat enable ALLOW_TEST_API_ACCESS com.android.cts.verifier
```

6. Android 14+:

```sh
adb shell appops set com.android.cts.verifier TURN_SCREEN_ON 0
```

7. Systemzeit korrekt einstellen.
8. Für CTS-Verifier nach dem Flashen im Setup Wizard eine PIN setzen; sonst kann Notification Listener Test wegen eines fehlenden Eintrags fehlschlagen.
9. Berichte: `/storage/emulated/0/VerifierReports/`.

Auch Controls Panel tests benötigen zuvor eine PIN.

### 13.11 GTS

Vollständig konfigurierte user-Firmware verwenden. Im Setup Wizard VPN-Wi-Fi verbinden, ohne Google-Anmeldung. Hostumgebung und GTS-Schlüssel mit `echo $APE_API_KEY` prüfen. key.json von 3PL erhalten und die Umgebungsvariable setzen. Die Quelle behandelt Fehler des Dienstkontos und die EDI-Freischaltung.

```text
$ vi .bashrc
export APE_API_KEY=/path/to/key.json ## 注意替换/path/to
Test failed due to failed service account authentication, please ensure service account key is installed and try again.

run gts -m GtsEdiHostTestCases
This device isn't Play Protect certified
Test failed due to unrecognized service account for this product, please submit an initial GTS report for this product with full EDI (run gts -m GtsEdiHostTestCases) at https://partner.android.com/approvals/upload-report and try again.
```

Diesen Modulbericht (Quellenbeispiel `android-gts/results/2023.01.01_01.01.01.zip`) an 3PL für den Google-Upload und die EDI-Freischaltung geben. Hier wurde nichts eingereicht.

| Testpaket | Start | Retry | Einzeltest |
| --- | --- | --- | --- |
| android-gts-xx.zip | `run gts` | `run retry --retry 0` | `run gts -m module_name -t case_name` |

Ohne Attestation key kann nach VPN-Wi-Fi-Verbindung im Assistenten Folgendes auftreten:

```text
E/DynamiteLoaderV2Impl( 4625): gzh: Can't load code for GoogleCertificates.apk
E/GoogleCertificates( 4625): Failed to get Google certificates from remote
E/GoogleCertificates( 4625): amh: Remote load failed. No local fallback found.
D/AndroidRuntime( 4813): Shutting down VM
E/AndroidRuntime( 4813): FATAL EXCEPTION: main
E/AndroidRuntime( 4813): Process: com.google.android.apps.restore, PID: 4813
E/AndroidRuntime( 4813): java.lang.SecurityException: GoogleCertificatesRslt: module init: Remote load failed. No local fallback found. (go/gsrlt)
```

### 13.12 GTS-Verifier

Laut Quelle wird GTS-Verifier ab Android 14 nicht mehr getestet; siehe [GTS-Verifier](https://docs.partner.android.com/gms/testing/gts/gts-verifier?hl=en).

### 13.13 GTS Interactive

Die Quelle beschreibt dies als neue Android-13+-Anforderung, die manuelle GTS-Verifier-Tests ersetzt. Den Gerätehinweisen folgen.

| Testpaket | Start | Retry | Einzeltest |
| --- | --- | --- | --- |
| android-gts-xx.zip | `run gts-interactive` | `run retry --retry 0` | `run gts-interactive -m module_name -t case_name` |

### 13.14 STS

Vollständig konfigurierte userdebug-Firmware verwenden. Fehler behandelt die SDK-Anleitung für Android-Sicherheitspatches. Das STS-ZIP-Passwort lautet laut Quelle `sts`. Patches finden sich im [Android-Sicherheitsbulletin](https://source.android.com/docs/security/bulletin/asb-overview).

| Testpaket | Start | Retry | Einzeltest |
| --- | --- | --- | --- |
| android-sts-xx.zip | `sts-dynamic-full` | `run retry --retry 0` | `run sts -m module_name -t case_name` |

### 13.15 GOATS-Leistungstest

Vollständig konfigurierte userdebug-Firmware verwenden. Den Kernel mit Clang bauen und folgenden Quellpatch anwenden. Der Lizenzheader im Code bleibt erhalten.

```diff
diff --git a/drivers/video/rockchip/rga2/Kconfig b/drivers/video/rockchip/rga2/Kconfig
index efc1ef6..3458051 100644
--- a/drivers/video/rockchip/rga2/Kconfig
+++ b/drivers/video/rockchip/rga2/Kconfig
@@ -1,5 +1,5 @@
 # SPDX-License-Identifier: GPL-2.0
-menu "RGA2"
+menu "RGA2G"
 depends on ARCH_ROCKCHIP
 config ROCKCHIP_RGA2
```

### 13.16 APTS

Vollständige userdebug-Firmware verwenden. Go-Geräte ab Android 12 nutzen APTS statt GOATS. Den Fingerprint der passenden user-Firmware angeben; retry wird nicht unterstützt. Der Quellfingerprint endet mit `user/release` und wird nicht ergänzt.

| Paket | Testbefehl | Einzeltest |
| --- | --- | --- |
| android-apts-go.zip | `run test/approval-go --fingerprint-swap google/wembley/wembley:12/SP1A.210712.001/7539480:user/release` | `run test/approval-go --test-case app-start-cold-3p` |

### 13.17 BTS

Die Quelle nennt Android BTS (Build Test Suite) seit 2018-04-01 als Zertifizierungsanforderung; siehe [Partner-Dokument](https://support.google.com/androidpartners_gms/answer/9027630?hl=en). Kein gepacktes update.img hochladen, da Google es nicht analysieren kann; den Ablauf mit 3PL klären. Images in einen nach dem Fingerprint benannten Ordner legen, `:` und `/` durch `~` ersetzen und als ZIP packen.

```text
rockchip~rk3326_qgo~rk3326_qgo~10~QD1A.190821.014.C2~201911~user~release-keys$ ls
boot-debug.img boot.img dtbo.img misc.img recovery.img super.img vbmeta.img
```

Virtual-A/B-GMS-Firmware enthält kein recovery.img. GKI benötigt zusätzlich vendor_boot.img und init_boot.img; boot-debug.img wird durch vendor_boot-debug.img ersetzt.

Die Quelle berichtet von Ablehnungen wegen PHA (schädlicher Apps) in BTS trotz bestandener GMS-Tests. Sie schlägt vorherige Google-Play-Prüfungen der vorinstallierten Apps mit 3PL/TAM vor. Hier wurden weder Apps noch Firmware hochgeladen.

## 14 Tests mit lokalen Medienpaketen

### 14.1 Lokale CTS-Medien

Lokale Medien vermeiden Netzwerkprobleme und Videostartverzögerungen. Bezug nach Google-Anleitung oder über FTP `GMS-Test-Suite/xTS/CTS_local_media_package`.

1. media 1.5 und das Online-Testmedienpaket laden.
2. Online-Testmedien auf sdcard übertragen.
3. media 1.5 unter Ubuntu nach `/tmp/android-cts-media/android-cts-media-1.5` entpacken.
4. Folgenden Einzeltest mit dem tatsächlichen Pfad ausführen. Entpack- und Befehlspfad unterscheiden sich in der Quelle; beide bleiben erhalten und müssen vor Nutzung abgeglichen werden.

```sh
$ adb push CtsMediaTestCases /sdcard/
run cts -m CtsMediaTestCases \
--module-arg CtsMediaTestCases:config-url:https://storage.googleapis.com/cts_media/DynamicConfig_local.json \
--module-arg CtsMediaTestCases:local-media-path:/tmp/android-cts-media-1.5
```

### 14.2 Lokale GTS-Medien

Auch dies vermeidet Netzwerkprobleme und Videostartverzögerungen. Bezug nach Google-Anleitung oder über FTP `GMS-Test-Suite/xTS/GTS_local_media_package`.

1. GtsExoPlayerTestCases, GtsYouTubeTestCases und GtsMediaTestCases laden.
2. Lokale Medien auf sdcard übertragen.
3. Vollständigen Befehl unten ausführen.
4. Für Einzeltests den Modulnamen ersetzen; das Quellenbeispiel lautet WvtsDeviceTestCases.

```sh
$ adb push gts test wvmedia /sdcard/
run gts \
--module-arg GtsExoPlayerTestCases:config-url:https://storage.googleapis.com/exoplayer-test-media-1/gen-4/dynamic-config-sdcard-1.0.json \
--module-arg "GtsYouTubeTestCases:skip-media-download:true" \
--module-arg "GtsYouTubeTestCases:instrumentation-arg:media-path:=/sdcard/test" \
--module-arg "GtsMediaTestCases:instrumentation-arg:media-path:=file:///sdcard/wvmedia"

run gts -m WvtsDeviceTestCases \
--module-arg WvtsDeviceTestCases:config-url:https://storage.googleapis.com/exoplayer-test-media-1/gen-4/dynamic-config-sdcard-1.0.json \
--module-arg "WvtsDeviceTestCases:instrumentation-arg:media-path:=file:///sdcard/wvmedia"
```

Häufige Fehler, die die Quelle mit lokalen Medien prüft:

```text
WvtsDeviceTestCases
com.google.android.wvts.WidevineH264PlaybackTests#testL3WithUHD60
com.google.android.wvts.WidevineH264PlaybackTests#testClearWithUHD60
com.google.android.wvts.WidevineVP9WebMPlaybackTests#testVP9WebMCencSuperFramesL3WithUHD30
com.google.android.wvts.WidevineVP9WebMPlaybackTests#testVP9WebMProfile210bitCencSuperFramesL3With1080P30
com.google.android.wvts.WidevineVP9WebMPlaybackTests#testVP9WebMCencSubSampleL3WithUHD60
```

Quellenlinks für §12–14 (Partner-Seiten können ein berechtigtes Konto erfordern):

- [EEA choice screen](https://docs.partner.android.com/gms/policies/restricted/eea-builds?hl=en#choice-screen)
- [Android 11 GSI](https://ci.android.com/builds/branches/aosp-android11-gsi/grid?legacy=1&selected-targets=aosp_arm64-userdebug)
- [Android 12 GSI](https://ci.android.com/builds/branches/aosp-android12-gsi/grid?legacy=1&selected-targets=aosp_arm64-userdebug)
- [Android 13 GSI](https://ci.android.com/builds/branches/aosp-android13-gsi/grid?legacy=1&selected-targets=aosp_arm64-userdebug)
- [Android 14 GSI](https://ci.android.com/builds/branches/aosp-android14-gsi/grid?legacy=1&selected-targets=aosp_arm64-userdebug)
- [VTS / Treble](https://docs.partner.android.com/gms/testing/vts/treble-compliance?hl=en#sample-test-flor-without-dsu)
- [CTS-Verifier setup](https://source.android.com/docs/compatibility/cts/verifier?authuser=2#setup)
- [Partner builds](https://partner.android.com/approvals/builds?a=1991659975&pli=1)
- [CTS local media setup](https://source.android.com/docs/compatibility/cts/run-locally#sd-setup)
- [CTS media 1.5](https://dl.google.com/dl/android/cts/android-cts-media-1.5.zip)
- [CtsMediaTestCases](https://storage.googleapis.com/cts_media/CtsMediaTestCases.zip)
- [GTS media testing](https://docs.partner.android.com/gms/testing/gts/running-gts?hl=en#run-media-tests)
- [GtsExoPlayerTestCases media](https://storage.googleapis.com/exoplayer-test-media-1/gen-4/exoplayer-gts-media.zip)
- [GtsYouTubeTestCases media](https://storage.googleapis.com/youtube-test-media/gts/GtsYouTubeTestCases-media-1.2.zip)
- [GtsMediaTestCases media](https://storage.googleapis.com/gts_media/wvmedia-gts-media.zip)

Der DSU-Link der Quelle ist fehlerhaft: `http://https//source.android.com/devices/tech/ota/dynamic-system-updates`. Er bleibt als Text statt als anklickbarer Link erhalten. Die Android-14-GSI-Beschriftung nennt android13, der PDF-Link führt jedoch zu android14; die Abweichung wird ausdrücklich unterschieden.

## 15 Produktanpassungen

### 15.1 GMS-Paket aktualisieren

Die Quelle entpackt das Paket, entfernt passende APKs, nimmt APKs in die Versionsverwaltung auf und verlangt anschließend einen manuellen Vergleich der lokalen Änderungen. Der Kommentar bezeichnet das Entfernen von `*x86*apk` als „32-Bit-Anwendungen entfernen“. Dieses Dateinamensmuster erfasst nicht zwingend sämtliche 32-Bit-Anwendungen. Befehl und Originalkommentar bleiben zur Prüfung erhalten.

```sh
Android_SDK$ unzip -o gms-oem-U-14-202403.zip -d vendor/
Android_SDK/vendor/partner_gms$ find . -name "*x86*apk" | xargs rm -rf ## 删除32Bit应用
Android_SDK/vendor/partner_gms$ find . -name "*.apk" | xargs git add
Android_SDK/vendor/partner_gms$ git status ./ ## 查到本地修改差异，手动比对再合入
```

### 15.2 Systemkonfiguration prüfen

Das FTP-Werkzeug `/GMS-Test-Suite/xTS/tools/OverlayTools.apk` zeigt System- und Anwendungseinstellungen; wählen Sie den passenden Data Type.

```sh
am start -n cn.jcassistant.overlaytools/.MainActivity --es pkg android --es cfg config_automatic_brightness_available
```

### 15.3 RKSDK-Version ermitteln

Eigenschaft abfragen:

```sh
getprop | grep ro.rksdk.version
```

```text
device/rockchip/common/device.mk:
ro.rksdk.version=ANDROID$(PLATFORM_VERSION)_RKR5
```

### 15.4 Regeln für Geräteseriennummern

Zum Schreiben der SN muss sich das Gerät im Bootloader befinden. Das SDK-Werkzeug liegt unter `RKTools/windows/RKDevInfoWriteTool-1.3.0.7z`. Die Quelle verlangt einen Anfangsbuchstaben, 7-Bit-ASCII, eine Rockchip-Grenze von 6–14 Byte und das Muster `^[A-Za-z0-9]+$`; Zeichen wie `.` und `_` sind ausgeschlossen. Das Muster erlaubt jedoch auch eine führende Ziffer, und der Quellpuffer hat Länge 33. Diese Abweichungen bleiben dokumentiert; aus der Puffergröße darf nicht die zulässige SN-Länge abgeleitet werden.

```text
hardware/rockchip/drmservice/Android.mk:
# Verify sn with pattern "^[A-Za-z0-9]+$"
ifeq ($(BUILD_WITH_GOOGLE_MARKET), true)
LOCAL_CFLAGS += -DENABLE_SN_VERIFY
endif

hardware/rockchip/drmservice/drmservice.c:
#define SERIALNO_PATTERN "^[A-Za-z0-9]+$"
#define SERIALNO_BUF_LEN 33

CtsAppSecurityHostTestCases
android.appsecurity.cts.AccessSerialNumberTest#testGetSerialReturnsExpectedFormat
CtsUsbTests
com.android.cts.usb.TestUsbTest#testUsbSerialReadOnDeviceMatches
```

### 15.5 System-API-Level ändern

Lesen Sie das aktuelle API-Level und ändern Sie es mit den folgenden Einstellungen. Laut Quelle kommt bei Rockchip-Plattformen ab Android 14 GRF hinzu; ohne `BOARD_SHIPPING_API_LEVEL` schlägt der genannte Test fehl.

```sh
getprop | grep first_api_level
```

```text
device/rockchip/rk3588/rk3588_t/rk3588_t.mk:
PRODUCT_SHIPPING_API_LEVEL := 34

build/make/core/main.mk:
ifdef PRODUCT_SHIPPING_API_LEVEL
ADDITIONAL_VENDOR_PROPERTIES += ro.product.first_api_level=$(PRODUCT_SHIPPING_API_LEVEL)
endif

device/rockchip/rk3588/BoardConfig.mk:
BOARD_SHIPPING_API_LEVEL := 34

build/make/core/main.mk:
ifdef BOARD_SHIPPING_API_LEVEL
ADDITIONAL_VENDOR_PROPERTIES += ro.board.first_api_level=$(BOARD_SHIPPING_API_LEVEL)
endif

GtsOsTestCases
com.google.android.os.gts.GoogleRequirementFreezeTest#testChipsetInfo
```

### 15.6 System-dpi und aapt abstimmen

Passen `ro.sf.lcd_density` und `PRODUCT_AAPT_PREF_CONFIG` nicht zusammen, entsteht der folgende Fehler. Beide müssen übereinstimmen und dem in der Quelle genannten Google-Standard entsprechen. Berechnen Sie die ideale dpi aus physischer Bildschirmgröße und der Auflösung aus `wm size`, und prüfen Sie die standardisierte dpi/aapt-Zuordnung. Bei berechneten 200 dpi wählt die Quelle die nahe Stufe 213 dpi (tvdpi); diese muss auch in `PRODUCT_AAPT_CONFIG` enthalten sein.

```text
CtsThemeHostTestCases
android.theme.cts.ThemeHostTest#testThemes
FAILURE: junit.framework.AssertionFailedError: 36 failures in theme test

device/rockchip/rk3588/rk3588_t/rk3588_t.mk:
PRODUCT_PROPERTY_OVERRIDES += ro.sf.lcd_density=213
PRODUCT_AAPT_PREF_CONFIG := tvdpi

device/rockchip/common/device.mk:
PRODUCT_AAPT_CONFIG ?= normal large xlarge hdpi tvdpi xhdpi xxhdpi
```

### 15.7 clientidbase ändern

Setzen Sie `ro.com.google.clientidbase` entsprechend Ihrer eigenen MADA/EDLA-Berechtigung; verwenden Sie nicht Rockchips `android-rockchip`. Dieser Wert ist unten nur das Quellenbeispiel. Das Build-Ergebnis liegt unter `out/target/product/rk3588s_t/system/build.prop`.

```text
Android_SDK/vendor/rockchip/common$ git diff gms/gms.prop
+ro.com.google.clientidbase=android-rockchip

device/rockchip/common/modules/gms.mk:
ifeq ($(strip $(BUILD_WITH_GOOGLE_MARKET)), true)
......
$(warning Please set client id with your own MADA ID!)
TARGET_SYSTEM_PROP += vendor/rockchip/common/gms/gms.prop
```

### 15.8 Eigenschaften ro.product.*** ändern

```text
[ro.product.brand]: [rockchip]
[ro.product.device]: [rk3588_t]
[ro.product.manufacturer]: [rockchip]
[ro.product.model]: [rk3588_t]
[ro.product.name]: [rk3588_t]

build/make/core/product.mk:
_product_single_value_vars += \
    PRODUCT_SYSTEM_NAME \
    PRODUCT_SYSTEM_MODEL \
    PRODUCT_SYSTEM_DEVICE \
    PRODUCT_SYSTEM_BRAND \
    PRODUCT_SYSTEM_MANUFACTURER \

build/make/core/sysprop.mk:
$(if $(filter system,$(1)),\
    echo "ro.product.$(1).brand=$(PRODUCT_SYSTEM_BRAND)" >> $(2);\
    echo "ro.product.$(1).device=$(PRODUCT_SYSTEM_DEVICE)" >> $(2);\
    echo "ro.product.$(1).manufacturer=$(PRODUCT_SYSTEM_MANUFACTURER)" >> $(2);\
    echo "ro.product.$(1).model=$(PRODUCT_SYSTEM_MODEL)" >> $(2);\
    echo "ro.product.$(1).name=$(PRODUCT_SYSTEM_NAME)" >> $(2);\
,\
    echo "ro.product.$(1).brand=$(PRODUCT_BRAND)" >> $(2);\
    echo "ro.product.$(1).device=$(TARGET_DEVICE)" >> $(2);\
    echo "ro.product.$(1).manufacturer=$(PRODUCT_MANUFACTURER)" >> $(2);\
    echo "ro.product.$(1).model=$(PRODUCT_MODEL)" >> $(2);\
    echo "ro.product.$(1).name=$(TARGET_PRODUCT)" >> $(2);\ ## 工程lunch选项结果

build/make/core/product_config.mk:
TARGET_DEVICE := $(PRODUCT_DEVICE) ## 工程lunch选项结果
ifndef PRODUCT_SYSTEM_NAME
PRODUCT_SYSTEM_NAME := $(PRODUCT_NAME)
endif
ifndef PRODUCT_SYSTEM_DEVICE
PRODUCT_SYSTEM_DEVICE := $(PRODUCT_DEVICE)
endif
ifndef PRODUCT_SYSTEM_BRAND
PRODUCT_SYSTEM_BRAND := $(PRODUCT_BRAND)
endif
ifndef PRODUCT_SYSTEM_MODEL
PRODUCT_SYSTEM_MODEL := $(PRODUCT_MODEL)
endif
ifndef PRODUCT_SYSTEM_MANUFACTURER
PRODUCT_SYSTEM_MANUFACTURER := $(PRODUCT_MANUFACTURER)
endif

device/rockchip/rk3588/rk3588_t/rk3588_t.mk:
PRODUCT_NAME := rk3588_t
PRODUCT_DEVICE := rk3588_t
PRODUCT_BRAND := rockchip ## 修改PRODUCT_BRAND值
PRODUCT_MODEL := rk3588_t
PRODUCT_MANUFACTURER := rockchip

out/target/product/rk3588s_t/system/build.prop
out/target/product/rk3588s_t/vendor/build.prop
```

Die letzten beiden Pfade sind Build-Ausgaben. Die Konfigurationsauszüge enthalten ausgelassenen Kontext sowie ursprüngliche Fortsetzungen und Kommentare; sie sind kein vollständiges eigenständiges Makefile.

### 15.9 Build-Fingerprint ändern

```text
build/make/core/sysprop.mk:
ifeq (,$(strip $(BUILD_FINGERPRINT)))
ifdef ROCKCHIP_BUILD_NUMBER
BF_BUILD_NUMBER := $(ROCKCHIP_BUILD_NUMBER)
else
ifeq ($(strip $(HAS_BUILD_NUMBER)),false)
BF_BUILD_NUMBER := $(BUILD_USERNAME)$$($(DATE_FROM_FILE) +%m%d%H%M)
else
BF_BUILD_NUMBER := $(file <$(BUILD_NUMBER_FILE))
endif
endif
BUILD_FINGERPRINT := $(PRODUCT_BRAND)/$(TARGET_PRODUCT)/$(TARGET_DEVICE):$(PLATFORM_VERSION)/$(BUILD_ID)/$(BF_BUILD_NUMBER):$(TARGET_BUILD_VARIANT)/$(BUILD_VERSION_TAGS)
endif
```

Ändern Sie für einzelne Fingerprint-Felder die zugehörigen Makros an den folgenden Stellen. `TARGET_PRODUCT` und `TARGET_BUILD_VARIANT` stammen aus `lunch <product_name>-<build_variant>`.

```text
device/rockchip/rk3588/rk3588_t/rk3588_t.mk: PRODUCT_BRAND := rockchip
build/make/envsetup.sh: TARGET_PRODUCT=$product \
build/make/core/product_config.mk: TARGET_DEVICE := $(PRODUCT_DEVICE)
device/rockchip/rk3588/rk3588_t/rk3588_t.mk: PRODUCT_DEVICE := rk3588_t
build/make/core/version_util.mk: PLATFORM_VERSION := $(PLATFORM_VERSION_LAST_STABLE)
build/make/core/version_defaults.mk: PLATFORM_VERSION_LAST_STABLE := 13
build/make/core/build_id.mk: BUILD_ID=TQ3C.230805.001.B2
build/make/envsetup.sh: TARGET_BUILD_VARIANT=$variant \

```

Die Quelle verlangt für ein GMS/EDLA-zertifiziertes Produkt einen eindeutigen Fingerprint, der nach der Zertifizierung unverändert bleibt. Genannt werden 7-Bit-ASCII, keine Leerzeichen und kein Unterstrich im ersten Feld `PRODUCT_BRAND`; sonst schlägt die Play-Store-Erkennung fehl. Das Fehlerbeispiel folgt.

```text
CtsOsTestCases
android.os.cts.BuildVersionTest#testBuildFingerprint
Rockchip_Worship_Player/rk3399_t/rk3399_t:13/TQ2B.230505.005.A1/202303:user/release-keys
junit.framework.ComparisonFailure: expected:<Rockchip[ Worship ]Player> but was:<Rockchip[_Worship_]Player>
PRODUCT_BRAND := Rockchip_Worship_Player
```

### 15.10 Dateisystem der data-Partition ändern

Laut Quelle wird ext4 für GMS/EDLA nicht unterstützt; userdata soll verschlüsselte f2fs verwenden. Für Android 14 mit kernel-5.15 oder neuer nennt sie zusätzlich f2fs für /metadata und /data (userdata). Diese Aussagen bleiben auf den Versionsumfang der Quelle beschränkt und werden nicht auf sämtliche aktuellen Zertifizierungsregeln übertragen. Prüfung:

```sh
$ adb shell cat vendor/etc/fstab.rk30board | grep userdata
```

```text
CtsSecurityHostTestCases
android.security.cts.MetadataEncryptionTest#testMetadataEncryptionIsEnabled
java.lang.AssertionError: Metadata encryption must be enabled
```

Abhilfe: userdata benötigt Verschlüsselungsflags. Laut Quelle ist die f2fs-Standardkonfiguration bereits verschlüsselt. Flags:

```text
fileencryption=aes-256-xts:aes-256-cts:v2+inlinecrypt_optimized,keydirectory=/metadata/vold/metadata_encryption,checkpoint=fs
```

- `fileencryption=aes-256-xts:aes-256-cts:v2+inlinecrypt_optimized`: Algorithmen und Optimierung.
- `keydirectory=/metadata/vold/metadata_encryption`: Verzeichnis der Schlüsseldateien.
- `checkpoint=fs`: UDC (User Data Checkpoint) für ein Rollback der data-Partition.

Schlägt der Start nach Aktivierung von Virtual A/B fehl, müssen die userdata-Dateisystemangaben konsistent sein. Quellprotokoll:

```text
DEBUG: Cmdline: /system/bin/credstore /data/misc/credstore
DEBUG: pid: 720, tid: 720, name: credstore >>> /system/bin/credstore <<<
DEBUG: uid: 1076
DEBUG: tagged_addr_ctrl: 0000000000000001 (PR_TAGGED_ADDR_ENABLE)
DEBUG: signal 6 (SIGABRT), code -1 (SI_QUEUE), fault addr --------
DEBUG: Abort message: 'Check failed: chdir(data_dir.c_str()) != -1 chdir: /data/misc/credstore: No such file or directory' 
```

Die Quelle verlangt Übereinstimmung an drei Stellen (überall f2fs oder ext4). ext4 wird hier zur Startfehlerdiagnose genannt, nicht als Aussage zur obigen Zertifizierungsanforderung; das Zertifizierungsbeispiel bleibt f2fs.

```text
device/rockchip/rk3588/device.mk:
BOARD_USERDATAIMAGE_FILE_SYSTEM_TYPE := f2fs

device/rockchip/rk3588/rk3588_t/recovery.fstab_AB:
/dev/block/by-name/userdata /data f2fs defaults defaults

device/rockchip/common/scripts/fstab_tools/fstab.in:
/dev/block/by-name/userdata /data f2fs noatime,nosuid,nodev,discard,reserve_root=32768,resgid=1065
```

### 15.11 USB-Kamera als Front- oder Rückkamera konfigurieren

Verwenden Sie FRONT für die Frontkamera und BACK für die Rückkamera. Quellpatch:

```diff
Android_SDK/hardware/interfaces/camera$ git diff device/3.4/default/ExternalCameraDevice.cpp
- const uint8_t facing = ANDROID_LENS_FACING_EXTERNAL;
+ const uint8_t facing = ANDROID_LENS_FACING_FRONT; ## 后摄配置ANDROID_LENS_FACING_BACK
UPDATE(ANDROID_LENS_FACING, &facing, 1);
```

### 15.12 USB-Mikrofon als internes Mikrofon konfigurieren

Das Gerät benötigt ein internes oder ein USB-Mikrofon. Ist nur USB Mic vorhanden, verlangt die Quelle die Konfiguration als internes Mikrofon. Weitere Befehle enthält dieser Abschnitt nicht.

### 15.13 Patches für Geräte ohne Akku

EDLA-Geräte besitzen häufig keinen Akku. Die Quelle verlangt `/GMS-Test-Suite/Exp+/batteryless.diff` und verweist auf Supporting Batteryless Devices. Nach Patch und Kernelbau muss bei GKI-Firmware das Modul ersetzt werden:

```sh
mv kernel-5.10/drivers/power/supply/test_power.ko mkcombinedroot/vendor_ramdisk/lib/modules/test_power.ko
```

```text
CtsStatsdAtomHostTestCases
android.cts.statsdatom.statsd.HostAtomTests#testFullBatteryCapacity
FAILURE: expected to be greater than: 0 but was: 0
```

Quellenlösung: `/sys/class/power_supply/***battery/charge_full` soll größer als 0 sein, beschrieben als `battery_present=0`. Dies muss mit dem folgenden Patch abgeglichen werden, der CHARGE_FULL auf 0 setzt; beide Angaben bleiben erhalten.

```text
CtsStatsdAtomHostTestCases
android.cts.statsdatom.statsd.HostAtomTests#testRemainingBatteryCapacity
FAILURE: expected to be greater than: 0 but was: 0
```

Stellen Sie sicher, dass `/sys/class/power_supply/test_battery/charge_counter` größer als 0 ist.

```text
VtsHalHealthV2_1TargetTest
PerInstance/HealthHidlTest#getHealthInfo_2_1/0_default
Expected: ((long)value.batteryFullChargeDesignCapacityUah) > (((long)100 * 1000)), actual: 100 vs 100000
batteryFullChargeDesignCapacityUah should be greater than 100 mAh, or 0 if unknown

Android_SDK/kernel-5.10/drivers/power/supply$ git diff test_power.c
-static int battery_status = POWER_SUPPLY_STATUS_DISCHARGING;
+static int battery_status = POWER_SUPPLY_STATUS_UNKNOWN;
 static int battery_health = POWER_SUPPLY_HEALTH_GOOD;
-static int battery_present = 1; /* true */
+static int battery_present = 0; /* true */
 case POWER_SUPPLY_PROP_CHARGE_FULL_DESIGN:
 case POWER_SUPPLY_PROP_CHARGE_FULL:
- val->intval = 100;
+ val->intval = 0;
```

Anschließend listet die Quelle die folgenden AIDL-Health-Testfehler auf, ohne einen weiteren eigenen Patch anzugeben. Der hexadezimale Objektdump ist bereits im Original unvollständig; der sichtbare Text bleibt erhalten.

```text
VtsHalHealthTargetTest
Health/HealthAidl#getChargeCounterUah/0_android_hardware_health_IHealth_default
FAILURE:
hardware/interfaces/health/aidl/vts/functional/VtsHalHealthTargetTest.cpp:170: Failure
Value of: value
Expected: is >= 0
Actual: -1000

Health/HealthAidl#getHealthInfo/0_android_hardware_health_IHealth_default
FAILURE:
hardware/interfaces/health/aidl/vts/functional/VtsHalHealthTargetTest.cpp:413: Failure
Value of: value
Expected: is valid health info
Actual: 200-byte object <01-01 00-00 A0-25 26-00 40-4B 4C-00 03-00 00-00 02-00 00-00 01-00 00-00

Health/BatteryTest#ConnectedAgainstStatusFromHal/0_android_hardware_health_IHealth_default
FAILURE:
hardware/interfaces/health/aidl/vts/functional/VtsHalHealthTargetTest.cpp:592: Failure
Value of: SucceedOnce(gBatteryTestTimeout, testOnce)
Actual: false (BatteryStatus is DISCHARGING and power source is connected: ac=1, usb=1, wireless=0)
Expected: true
You may want to try again later when battery_status becomes stable.

Health/BatteryTest#ConnectedAgainstStatusInHealthInfo/0_android_hardware_health_IHealth_default
FAILURE:
hardware/interfaces/health/aidl/vts/functional/VtsHalHealthTargetTest.cpp:604: Failure
Value of: SucceedOnce(gBatteryTestTimeout, testOnce)
Actual: false (BatteryStatus is DISCHARGING and power source is connected: ac=1, usb=1, wireless=0)
Expected: true
You may want to try again later when getHealthInfo becomes stable.
```

### 15.14 Firmware- und Apex-Signaturskripte aktualisieren

Rockchip stellt die Skripte unter `/GMS-Test-Suite/xTS/tools/gms_certificate_tools.zip` bereit. Setzen Sie PLATFORM_VERSION passend zur Android-Version; bei `Enter password for` soll laut Quelle Enter gedrückt werden. Der Ablauf wird nur dokumentiert; es werden keine Schlüssel erzeugt oder ersetzt.

```text
Android_SDK/vendor$ unzip gms_certificate_tools.zip
Android_SDK/vendor$ cd gms_tools/
Android_SDK/vendor/gms_tools$ export PLATFORM_VERSION=14 ## 根据实际Android版本配置
Android_SDK/vendor/gms_tools$ ./apex_sig_gen.sh ## 提示输入密码"Enter password for"时直接Enter键
Android_SDK/vendor/gms_tools$ ./firmware_sig_gen.sh ## 提示输入密码"Enter password for"时直接Enter键

GtsApexSignatureVerificationTest
android.appsecurity.cts.ApexSignatureVerificationTest#testApexPubKeyIsNotWellKnownKey
GtsPackageSignatureTest
android.security.cts.PackageSignatureTest#testPackageSignatures
GtsPermissionTestCases
com.google.android.permission.gts.DefaultPermissionGrantPolicyTest#testDefaultGrantsWithRemoteExceptions
```

In diesem Quellkapitel verlinkte Referenzen (Partner-Dokumente können ein berechtigtes Konto erfordern):

- §15.4: [Android 13 CDD](https://source.android.com/docs/compatibility/13/android-13-cdd#32_soft_api_compatibility)
- §15.5: [Android requirements / GRF](https://docs.partner.android.com/gms/policies/domains/reqs?authuser=3#updates_in_android_requirements_release)
- §15.6: [DPI calculator](https://ppi.ihei5.com/)
- §15.6: [Android 12 CDD dpi/aapt](https://source.android.com/docs/compatibility/12/android-12-cdd#37_runtime_compatibility)
- §15.9: [GMS fingerprint](https://docs.partner.android.com/gms/building/integrating/gms-build#creating)
- §15.10: [Android 14 partition requirements](https://docs.partner.android.com/gms/policies/vsr/vsr-14#device-partition-requirements)
- §15.13: [Supporting Batteryless Devices](https://source.android.com/docs/core/power/batteryless)

## 16 Häufige Testprobleme

### 16.1 protobuf-Fehler

Fehlerprotokoll:

```text
java.lang.NoSuchMethodError: 'com.google.protobuf.Parser
com.android.os.StatsLog$ConfigMetricsReportList.parser()'
at
android.media.mediaparser.cts.MediaParserHostSideTest.getAndClearReportList(MediaParserHostSideTest.java:294)
at
android.media.mediaparser.cts.MediaParserHostSideTest.setUp(MediaParserHostSideTest.java:79)
at junit.framework.TestCase.runBare(TestCase.java:140)
```

Lösung: Terminalkonfiguration kann per SSH an den Server übertragen werden. Diese Umgebungsvariable prüfen:

```text
env | grep LC_ALL
```

Falls gesetzt, entfernen und das xTS-Paket erneut starten:

```text
unset LC_ALL
./cts-tradefed
```

### 16.2 Viele VTS-Module laufen nicht

Fehlerprotokoll:

```text
xxx.config syntax error: unexpected 'newline'
```

Schreibrechte oder Windows-Formatierung können Zeilenenden ändern. Direkt unter Ubuntu testen, nicht WSL oder VM. Mit unzip unter Ubuntu entpacken und nichts ändern, auch nicht per chmod 777.

### 16.3 WLAN im Einrichtungsassistenten nicht immer überspringbar

Ursache ist geringe Leistung; die Quelle nennt diesen Patch:

```text
patch/frameworks/base/increase_waiting_time_for_setup_wizard.diff
```

### 16.4 Zertifizierungsstatus nach Freigabe fehlt

Play Store → Settings → About → Play Protect certification prüfen. Typisch fehlen geschriebene Schlüssel oder das Gerät ist entsperrt. Zur Entwicklung ist es standardmäßig entsperrt. Vor Produktion den Patch einsetzen, damit Schreiben des Attestation-Schlüssels auch sperrt.

```text
RKDocs/android/patches/gms/0001-libavb-Lock-the-device-when-the-device-init-or-write.patch
```

### 16.5 Umgebungslicht und adaptive Helligkeit

Turbo.apk und TurboOverlay.apk gemeinsam integrieren oder beide weglassen; dann TURBO_PRELOAD mit dem Diff entfernen.

```text
CtsDisplayTestCases
android.display.cts.BrightnessTest#testGetDefaultCurve
CtsDisplayTestCases
android.display.cts.BrightnessTest#testSetAndGetPerDisplay
java.lang.AssertionError: Failed to fetch first slider event. Is the
ambient brightness sensor working?
GtsFeaturesTestCases
com.google.android.features.gts.GoogleFeaturesTest#testFeatureTurboPreload
Device Health Services was missing but the
"com.google.android.feature.TURBO_PRELOAD" feature was found.
expected to be false
Device Health Services was found but the
"com.google.android.feature.TURBO_PRELOAD" feature was not, please reach out to
your Google contact
Android_SDK/vendor/partner_gms$ git diff etc/sysconfig/Android.bp
-prebuilt_etc {
- name: "sysconfig_turbo",
- product_specific: true,
- sub_dir: "sysconfig",
- src: "turbo.xml",
- filename_from_src: true,
-}
```

Settings → Display → Adaptive brightness aktivieren (Android-13-Anforderung): `config_automatic_brightness_available`.

```text
dumpsys display | grep mAutoBrightnessAvailable
```

Die erste Abfrage muss true liefern, die nächste PhysicalMappingStrategy.

```text
dumpsys display | grep MappingStrategy
PhysicalMappingStrategy
```

Bei leerem Ergebnis TurboOverlay.apk sicherstellen. `pm list package -f | grep turbo` prüft Turbo.apk und TurboOverlay.apk.

```text
package:/product/priv-app/Turbo/Turbo.apk=com.google.android.apps.turbo
package:/product/overlay/TurboOverlay.apk=com.rockchip.android.overlay.turbo
pm list features | grep com.google.android.feature.TURBO_PRELOAD
```

Vorhandensein des Features prüfen. `config_autoBrightnessLevels` und `config_autoBrightnessDisplayValuesNits` müssen gleich lang sein; mit OverlayTools.apk oder overlay lookup prüfen.

Eine der beiden Array-Abfragen verwenden. Die sechs Tests erst bei hellem, dann erneut bei dunklerem Umgebungslicht ausführen.

```text
am start -n cn.jcassistant.overlaytools/.MainActivity --es pkg android --es cfg config_autoBrightnessLevels
am start -n cn.jcassistant.overlaytools/.MainActivity --es pkg android --es cfg config_autoBrightnessDisplayValuesNits

cmd overlay lookup android android:array/config_autoBrightnessLevels
cmd overlay lookup android android:array/config_autoBrightnessDisplayValuesNits
## 下面6个fail项需要:先调节环境光较亮测试,再调节环境光较暗retry测试
arm64-v8a CtsDisplayTestCases
android.display.cts.BrightnessTest#testNoColorSampleData
android.display.cts.BrightnessTest#testSliderEventsReflectCurves
armeabi-v7a CtsDisplayTestCases
android.display.cts.BrightnessTest#testSetAndGetPerDisplay
android.display.cts.BrightnessTest#testBrightnessSliderTracking
android.display.cts.BrightnessTest#testNoColorSampleData
android.display.cts.BrightnessTest#testSliderEventsReflectCurves
```

Ohne Lichtsensor `android.hardware.sensor.light` durch folgende Einstellung entfernen:

```text
BOARD_LIGHT_SENSOR_SUPPORT := false
```

Turbo.apk gehört zu Google Device Health Services, einer optionalen GMS-Requirements-Funktion.

### 16.6 remount-Fehler

Ein gesperrtes Gerät erzeugt diese Fehler. Vor remount entsperren.

```text
$ adb root
restarting adbd as root
$ adb remount
Skipping /system for remount
Skipping /vendor for remount
Skipping /product for remount
No partitions to remount
remount failed

$ adb remount
Device must be bootloader unlocked
```

### 16.7 Buildfehler

Konfiguration ohne 4G:

```text
BUILD_WITH_GOOGLE_MARKET_ALL := false
```

Keine RK-GMS-Express-Branch; gms-mandatory.mk fehlt:

Methode 1 behält BUILD_WITH_GOOGLE_MARKET_ALL := true trotz check_gms_env.sh-Fehler. Methode 2 kopiert gms.mk nach gms-mandatory.mk und entfernt comms suite. Mit berechtigter Branch abgleichen.

```text
device/rockchip/common/modules/gms.mk:100: error:
..."vendor/partner_gms/products/gms-mandatory.mk" does not exist.
Android_SDK/vendor/partner_gms/products$ cp gms.mk gms-mandatory.mk
Android_SDK/vendor/partner_gms/products$ git diff gms-mandatory.mk
-# GMS comms suite
-$(call inherit-product, $(ANDROID_PARTNER_GMS_HOME)/products/google_comms_suite.mk)
```

BOARD_SUPER_PARTITION_WARN_LIMIT: Größe von super ändern. Die Quelle nennt ein Vielfaches von 4Mb; Einheit mit den Byte-Werten prüfen, nicht stillschweigend umdeuten.

```text
RuntimeError: sum of sizes of ['system', 'system_dlkm', 'system_ext',
'vendor', 'vendor_dlkm', 'odm', 'odm_dlkm', 'product'] is greater than
BOARD_SUPER_PARTITION_SIZE:
977747968+15765504+207147008+251867136+8318976+897024+348160+2484719616 ==
3946811392 > 3932160000 == 3932160000
[ 99% 40908/40909] Target super fs image for debug:
out/target/product/rk3588s_s/super.img
Android_SDK/device/rockchip/common$ git diff BoardConfig_AB.mk
ifeq ($(PRODUCT_USE_DYNAMIC_PARTITIONS), true)
ifneq ($(PRODUCT_RETROFIT_DYNAMIC_PARTITIONS), true)
ifeq ($(BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE), true)
ifeq ($(BUILD_WITH_GO_OPT), true)
ifeq ($(strip $(TARGET_ARCH)), arm64) # arm64 go
BOARD_SUPER_PARTITION_SIZE := 2390753280
else # arm go
BOARD_SUPER_PARTITION_SIZE := 1971322880
endif
else # non-go
- BOARD_SUPER_PARTITION_SIZE := 3932160000
+ BOARD_SUPER_PARTITION_SIZE := 3963617280
endif
BOARD_ROCKCHIP_DYNAMIC_PARTITIONS_SIZE := $(shell expr $(BOARD_SUPER_PARTITION_SIZE) - 4194304)
```

Buildfehler: `<uses-library>` zwischen Buildsystem und Manifest abweichend.

```text
vendor/partner_gms/apps_go/FilesGoogle/FilesGoogle_arm64.apk )"
error: mismatch in the <uses-library> tags between the build system and the
manifest:
- required libraries in build system: []
vs. in the manifest: []
- optional libraries in build system: [org.apache.http.legacy]
vs. in the manifest: [org.apache.http.legacy,
androidx.window.extensions, androidx.window.sidecar]
- tags in the manifest
(vendor/partner_gms/apps_go/FilesGoogle/FilesGoogle_arm64.apk):
uses-library-not-required:'org.apache.http.legacy'
uses-library-not-required:'androidx.window.extensions'
uses-library-not-required:'androidx.window.sidecar'
Android_SDK/vendor/partner_gms$ git diff apps_go/FilesGoogle/Android.mk
-LOCAL_OPTIONAL_USES_LIBRARIES := org.apache.http.legacy
+LOCAL_OPTIONAL_USES_LIBRARIES := org.apache.http.legacy androidx.window.extensions androidx.window.sidecar
Android_SDK/vendor/partner_gms$ git diff apps_go/FilesGoogle/Android.mk
-LOCAL_OPTIONAL_USES_LIBRARIES := org.apache.http.legacy
+LOCAL_ENFORCE_USES_LIBRARIES := false
```

Buildfehler: manifest_level_32.xml.

first_api_level=31 bedeutet Android12.0, 32 Android12.1. manifest_level_31.xml nach manifest_level_32.xml kopieren.

```text
FAILED: ninja: 'device/rockchip/common/manifests/manifest_level_32.xml',
needed by
'out/target/product/rk3588_s/gen/ETC/vendor_manifest.xml_intermediates/manifest.xml', missing and no known rule to make it
Android_SDK/device/rockchip/common/manifests$ cp manifest_level_31.xml manifest_level_32.xml
```

Nach Mainline-Integration: Target of symlink is not executable.

```text
warning: Missing compilation artifacts. Dexpreopting is not working
for some system server jars
out/host/linux-x86/obj/EXECUTABLES/dexdump_intermediates/dexdump:
error: Target of symlink is not executable
out/host/linux-x86/obj/EXECUTABLES/hiddenapi_intermediates/hiddenapi:
error: Target of symlink is not executable
chmod a+x prebuilts/module_sdk/art/current/host-exports/x86_64/bin/*
chmod a+x prebuilts/module_sdk/art/go/current/host-exports/x86_64/bin/*
```

### 16.8 Netzwerkfehler

Diese Tests benötigen VPN/IPv6. Ubuntu muss direkt mit dem VPN verbunden sein, nicht über SSR.

DashDownloadTest#download darf kein lokales Medienpaket nutzen; HTTP-Download nötig.

```text
## VPN
CtsNetTestCases
android.net.cts.MultinetworkApiTest#testResNApi
libcore.java.net.InetAddressTest#test_getByName_invalid
android.net.cts.MultinetworkApiTest#testNativeDatagramTransmission
NativeDnsAsyncTest#Async_NXDOMAIN
GtsExoPlayerTestCases
com.google.android.exoplayer.gts.DashDownloadTest#download ## 该项不能使用本地媒体包
java.lang.ClassCastException: sun.net.www.protocol.file.FileURLConnection cannot
be cast to java.net.HttpURLConnection
## IPv6
CtsNetTestCases
android.net.cts.DnsTest#testDnsWorks
CtsLibcoreTestCases
libcore.java.net.InetAddressTest#test_getByName_invalid[1]
libcore.java.net.SocketTest#testSocketTestAllAddresses
```

### 16.9 CTS-Fehler

ConfigurationContainerProto: Testpaketversion passt nicht.

Android12L (ro.build.version.sdk=32) benötigt 12.1_r1 statt 12_r1.

```text
java.lang.NullPointerException: Attempt to read from field
'com.android.server.wm.nano.ConfigurationContainerProto
com.android.server.wm.nano.WindowContainerProto.configurationContainer' on a
null object reference
```

testGetMemoryClass: dalvik.vm.heapgrowthlimit reicht für dpi=640 nicht aus.

dalvik.vm.heapgrowthlimit gemäß Fehler auf 512m setzen; seriell `getprop | grep dalvik.vm.heap` prüfen.

```text
CtsAppTestCases
android.app.cts.ActivityManagerMemoryClassTest#testGetMemoryClass
AssertionFailedError: Expected to have at least 512mb of memory for
screen density 640
Android_SDK/frameworks/native/build$ git diff tablet-10in-xhdpi-2048-dalvik-heap.mk
PRODUCT_VENDOR_PROPERTIES += \
dalvik.vm.heapstartsize?=16m \
- dalvik.vm.heapgrowthlimit?=192m \
+ dalvik.vm.heapgrowthlimit?=512m \
```

testSensorFeatures: Beschleunigungssensor-Hardware, Software und Featuredeklaration passen nicht zusammen.

Mit Beschleunigungssensor android.hardware.sensor.accelerometer hinzufügen; ohne BOARD_GRAVITY_SENSOR_SUPPORT := false. Folgend Buildlogik, unvollständiger Originalausschnitt und sieben Sensormakros.

```text
CtsAppTestCases
android.app.cts.SystemFeaturesTest#testSensorFeatures
java.lang.AssertionError:
PackageManager#hasSystemFeature(android.hardware.sensor.accelerometer) returns
false but SensorManager#getSensorList(1) shows sensors [Accelerometer sensor]
expected:<false> but was:<true>
hardware/rockchip/sensor/st/Android.mk
ifeq ($(BOARD_GRAVITY_SENSOR_SUPPORT), true)
LOCAL_CFLAGS += -DGRAVITY_SENSOR_SUPPORT
endif
hardware/rockchip/sensor/st/sensors.c
static const struct sensor_t sSensorList[] = {
#ifdef GRAVITY_SENSOR_SUPPORT
{ .name = "Accelerometer sensor",
.vendor = "The Android Open Source Project",
.version = 1,
.handle = SENSORS_HANDLE_BASE+ID_A,
.type = SENSOR_TYPE_ACCELEROMETER,
BOARD_GRAVITY_SENSOR_SUPPORT := false
BOARD_COMPASS_SENSOR_SUPPORT := false
BOARD_GYROSCOPE_SENSOR_SUPPORT := false
BOARD_PROXIMITY_SENSOR_SUPPORT := false
BOARD_LIGHT_SENSOR_SUPPORT := false
BOARD_PRESSURE_SENSOR_SUPPORT := false
BOARD_TEMPERATURE_SENSOR_SUPPORT := false
```

testGenerateKeyWhenCredentialAndBiometricEnrolled: PIN-Sperren und Entsperren vor dem Test prüfen.

Sperrbildschirm nicht deaktivieren: `<bool name="def_lockscreen_disabled">false</bool>` beibehalten.

```text
CtsBiometricsTestCases
android.server.biometrics.BiometricCryptoTests#testGenerateKeyWhenCredentialAndBiometricEnrolled
java.lang.IllegalStateException: Secure lock screen must be enabled to
create keys requiring user authentication
```

testManagedProfileSupported: Go mit 2G benötigt das Feature, Go mit 1.5G oder weniger nicht.

```text
CtsContentTestCases
android.content.pm.cts.FeatureTest#testManagedProfileSupported
Device should support managed profiles, but
android.software.managed_users is not enabled
Android_SDK/device/rockchip/common$ git diff device.mk
ifneq ($(strip $(BUILD_WITH_GO_OPT)),true)
PRODUCT_COPY_FILES += \
frameworks/native/data/etc/tablet_core_hardware.xml:$(TARGET_COPY_OUT_VENDOR)/etc/permissions/tablet_core_hardware.xml
+else
+ PRODUCT_COPY_FILES += \
+
frameworks/native/data/etc/android.software.managed_users.xml:$(TARGET_COPY_OUT_VENDOR)/etc/permissions/android.software.managed_users.xml
```

CtsDeqpTestCases: Abort: Test cannot be executed.

aapt/aapt2 gemäß Hostkonfiguration einrichten; zuerst Mali-Version mit `getprop | grep sys.gmali.version` prüfen.

```text
CtsDeqpTestCases
dEQP-EGL.info#version
Abort: Test cannot be executed
dEQP : Writing test log into /sdcard/TestLog.qpa
dEQP : ERROR: Unable to open test log output file
'/sdcard/TestLog.qpa'.
dEQP : Failed to create activity: Failed to open test log file
'/sdcard/TestLog.qpa'
getprop | grep sys.gmali.version
```

setDefaultSmsApplication_notSmsCapable_unchanged: Overlay `config_defaultSms` konfigurieren.

```text
CtsDevicePolicyTestCases
android.devicepolicy.cts.DefaultSmsApplicationTest#setDefaultSmsApplication_notSmsCapable_unchanged[IncludeRunOnDeviceOwnerUser]
expected: com.android.messaging
but was : com.android.bedstead.testapp.SmsApp
Android_SDK/device/rockchip/common$ git diff overlay/frameworks/base/core/res/res/values/config.xml
<resources>
+ <!-- The name of the package that will hold the SMS role by default. -->
+ <!-- Set it empty here -->
+ <string name="config_defaultSms" translatable="false"></string>
```

testOpenGlEsDeqpLevel: android.software.opengles.deqp.level gemäß Fehler aktualisieren.

```text
CtsGraphicsTestCases
android.graphics.cts.OpenGlEsDeqpLevelTest#testOpenGlEsDeqpLevel
Feature android.software.opengles.deqp.level must be present and have at
least version 132383489.
pm list features | grep android.software.opengles.deqp.level
Android_SDK/frameworks/native/data/etc$ cat android.software.opengles.deqp.level-2022-03-01.xml
<permissions>
<feature name="android.software.opengles.deqp.level" version="132514561" />
</permissions>
Android_SDK/device/rockchip/common$ git diff modules/gms.mk
ifneq ($(filter true yes, $(BUILD_WITH_GOOGLE_MARKET) $(PRODUCT_USE_PREBUILT_GTVS)),)
PRODUCT_COPY_FILES += \
- frameworks/native/data/etc/android.software.opengles.deqp.level-2021-03-01.xml:$(TARGET_COPY_OUT_VENDOR)/etc/permissions/android.software.opengles.deqp.level-2020-03-01.xml
+ frameworks/native/data/etc/android.software.opengles.deqp.level-2022-03-01.xml:$(TARGET_COPY_OUT_VENDOR)/etc/permissions/android.software.opengles.deqp.level-2022-03-01.xml
```

testAllKeys: GKI unter Android 13 aktivieren.

GKI und die drei folgenden gki_defconfig-Optionen aktivieren.

```text
CtsHardwareTestCases
android.hardware.input.cts.tests.SonyDualSenseBluetoothTest#testAllKeys
android.hardware.input.cts.tests.SonyDualSenseBluetoothTest#testVibrator
android.hardware.input.cts.tests.SonyDualSenseBluetoothTest#testAllMotions
android.hardware.input.cts.tests.SonyDualSenseUsbTest#testAllKeys
android.hardware.input.cts.tests.SonyDualSenseUsbTest#testVibrator
android.hardware.input.cts.tests.SonyDualSenseUsbTest#testAllMotions
java.lang.RuntimeException: Did not receive device added notification in
time
kernel-5.10/arch/arm64/configs/gki_defconfig
CONFIG_HID_SONY=y
CONFIG_LEDS_CLASS=y
CONFIG_NEW_LEDS=y
```

CtsMediaDecoderTestCases: deklarierten Messbereich anhand des Fehlers so setzen, dass er die tatsächlichen Messwerte enthält.

c2.rk.avc.decoder bei 320x240 lokalisieren. Beispielbereich 125–140 enthält 134.16 und 129.51. Ausgabe /vendor/etc/media_codecs_performance.xml. Keine ArmSoM-Messwerte.

```text
CtsMediaDecoderTestCases
android.media.decoder.cts.VideoDecoderPerfTest#testPerf[0(c2.rk.avc.decoder:qvga)]
java.lang.AssertionError: Expected achievable frame rates for
c2.rk.avc.decoder video/avc 320x240: [600.0, 650.0].
Measured frame rate: [134.16529367461462, 129.51021865979183].
Android_SDK/vendor/rockchip/common/vpu/etc$ git diff media_codecs_performance_rk3588.xml
<MediaCodec name="c2.rk.avc.decoder" type="video/avc" update="true">
- <Limit name="measured-frame-rate-320x240" range="600-650" />
+ <Limit name="measured-frame-rate-320x240" range="125-140" />
```

SingleLayer_DepthTest_DepthAffectsDrawAcrossContexts_D32_FLOAT: Patch `/GMS-Test-Suite/Exp+/AHardwareBufferNativeTests`.

```text
CtsNativeHardwareTestCases
android.hardware.nativehardware.cts.AHardwareBufferNativeTests#SingleLayer_DepthTest_DepthAffectsDrawAcrossContexts_D32_FLOAT
android.hardware.nativehardware.cts.AHardwareBufferNativeTests#SingleLayer_DepthTest_DepthCanBeSampled_D32_FLOAT
android.hardware.nativehardware.cts.AHardwareBufferNativeTests#MultipleLayers_DepthTest_DepthCanBeSampled_D32_FLOAT
```

testSocketKeepaliveUnprivileged: Patch `/GMS-Test-Suite/Exp+/DisableKeepAliveMainlineBuild`.

```text
CtsNetTestCases
android.net.cts.ConnectivityManagerTest#testSocketKeepaliveUnprivileged
android.net.cts.ConnectivityManagerTest#testCreateTcpKeepalive
android.net.cts.ConnectivityManagerTest#testSocketKeepaliveLimitWifi
CtsHostsideNetworkTests
com.android.cts.net.HostsideVpnTests#testAutomaticOnOffKeepaliveModeNoClose
device/rockchip/common/device.mk:
PRODUCT_PACKAGES += \
RockchipTetheringNoKeepAliveOverlay \
RockchipTetheringNoKeepAliveMainlineOverlay
```

testPruneUnusedStaticSharedLibraries_reboot_fullMode benötigt funktionierende Hardware-RTC.

```text
CtsOsHostTestCases
android.os.cts.StaticSharedLibsHostTests#testPruneUnusedStaticSharedLibraries_reboot_fullMode
android.os.cts.StaticSharedLibsHostTests#testPruneUnusedStaticSharedLibraries_reboot_instantMode
java.lang.AssertionError: Library foo.bar.lib.recursive should be
uninstalled
```

Für testProfiles/testRequestNotifications ein sichtbares BLE-Gerät, etwa eine Uhr, danebenlegen.

```text
CtsOsTestCases
android.os.cts.CompanionDeviceManagerTest#testProfiles
android.os.cts.CompanionDeviceManagerTest#testRequestNotifications
FAILURE: java.lang.AssertionError: Test requires a discoverable
bluetooth device nearby
```

SELinuxNeverallowRulesTest: Für GMS/EDLA keine Berechtigungen unter /system/sepolicy ändern; nicht mit userdebug testen.

```text
CtsSecurityHostTestCases
android.security.cts.SELinuxNeverallowRulesTest#testNeverallowRules199
junit.framework.AssertionFailedError: The following errors were
encountered when validating the SELinuxneverallow rule:
libsepol.report_failure: neverallow violated by allow
hal_keymint_default serialno_prop:file { read getattr map open };
libsepol.check_assertions: 1 neverallow failures occurred
```

testNoRemovedCertificates: Google-Sicherheitspatch entfernte ein vom Test erwartetes CA-Zertifikat.

Die Quelle schlägt Rücknahme des TrustCor-Patches vor. Dies ändert Vertrauensanker und muss gegen aktuelle Sicherheitsanforderungen geprüft werden; hier als Quelleninformation erhalten.

```text
CtsSecurityTestCases
android.security.cts.CertificateTest#testNoRemovedCertificates
junit.framework.AssertionFailedError: Missing CA certificates expected:
<[]> but was:<[B8:BE:6D:CB:56:F1...]>
bulletin_2023_08_preview/.../0001-Drop-TrustCor-certificates.bulletin.patch
```

Fehler testSystemMemoryAtom.

Bei kernel-4.19 genannte dmabuf-Optionen deaktivieren; nicht für Android13 oder höher.

```text
CtsStatsdAtomHostTestCases
android.cts.statsdatom.memory.SystemMemoryStatsTests#testSystemMemoryAtom
FAILURE: expected to be at least: 0 but was: -1
Android_SDK/kernel-4.19$ git diff arch/arm64/configs/rockchip_defconfig
-CONFIG_DMABUF_HEAPS=y
-CONFIG_DMABUF_HEAPS_SYSTEM=y
-CONFIG_DMABUF_HEAPS_CMA=y
```

testRestart/testMultipleActivations benötigen Hardware-RTC, keine virtuelle, und `/sys/class/rtc/rtc0/`.

SELinux-Rechte für reale Knoten ergänzen (oder Android_Devices_SELinux_Tool); date -u und hwclock -r müssen übereinstimmen.

```text
CtsStatsdHostTestCases
android.cts.statsd.metric.MetricActivationTests#testRestart
android.cts.statsd.metric.MetricActivationTests#testMultipleActivations
console:/ $ ls -laZ /sys/class/rtc/
total 0
drwxr-xr-x 2 root root u:object_r:sysfs_rtc:s0 0 2023-08-12 18:19 .
drwxr-xr-x 82 root root u:object_r:sysfs:s0 0 2023-08-12 18:19 ..
lrwxrwxrwx 1 root root u:object_r:sysfs:s0 0 2023-08-12 18:53 rtc0 ->
../../devices/platform/feaa0000.i2c/i2c-2/2-0051/rtc/rtc0
Android_SDK/device/rockchip/rk3588$ git diff sepolicy_vendor/genfs_contexts
genfscon sysfs /devices/platform/fe2e0000.mmc/mmc_host/mmc0 u:object_r:sysfs_mmc:s0
+genfscon sysfs /devices/platform/feaa0000.i2c/i2c-2/2-0051/rtc/rtc0 u:object_r:sysfs_rtc:s0
```

testRefreshRate: Bildwiederholrate reicht nicht aus.

```text
CtsViewTestCases
android.view.cts.DisplayRefreshRateTest#testRefreshRate
D DisplayRefreshRateTest: claimed 75.0 fps, achieved 65.0 fps
D DisplayRefreshRateTest: claimed 75.0 fps, achieved 60.63158 fps
D DisplayRefreshRateTest: claimed 75.0 fps, achieved 61.125 fps
E TestRunner: failed:
testRefreshRate(android.view.cts.DisplayRefreshRateTest)
```

AnrTests: System-ANR-Dialog nicht entfernen und ANR-Zeit nicht ändern.

```text
CtsWindowManagerDeviceTestCases
android.server.wm.AnrTests#slowUiThreadWithKeyEventTriggersAnr
android.server.wm.AnrTests#slowOnCreateWithKeyEventTriggersAnr
android.server.wm.AnrTests#slowOnTouchEventHandleTriggersAnr
android.server.wm.AnrTests#slowOnKeyEventHandleTriggersAnr
android.server.wm.AnrTests#embeddedWindowTriggersAnr
FAILURE: java.lang.AssertionError: Could not find anr dialog
```

testSystemUiVisibilityCallbackCausedByInsets: `/GMS-Test-Suite/Exp+/12.1_CtsWindowManagerDeviceTestCases`.

```text
CtsWindowManagerDeviceTestCases
android.server.wm.WindowInsetsControllerTests#testSystemUiVisibilityCallbackCausedByInsets
```

CtsWindowManagerDeviceTestCases: Fensteranimation auf 1.0 setzen.

```text
CtsWindowManagerDeviceTestCases
android.server.wm.ActivityTransitionTests#testTaskTransitionOverride
android.server.wm.ActivityTransitionTests#testActivityTransitionDurationNoShortenAsExpected
android.server.wm.ActivityTransitionTests#testTaskTransitionOverrideDisabled
java.lang.AssertionError: Actual transition duration should be in the
range &lt;1900, 2900&gt; ms, actual=1012
Android_SDK/device/rockchip/rk3588$ git diff ./
--- a/overlay/frameworks/base/packages/SettingsProvider/res/values/defaults.xml
+++ b/overlay/frameworks/base/packages/SettingsProvider/res/values/defaults.xml
@@ -36,6 +36,6 @@
<integer name="def_wifi_sleep_policy">2</integer>
<!-- Decrease animation duration. -->
- <fraction name="def_window_animation_scale">50%</fraction>
- <fraction name="def_window_transition_scale">50%</fraction>
+ <fraction name="def_window_animation_scale">100%</fraction>
+ <fraction name="def_window_transition_scale">100%</fraction>
```

testMaxAspectRatioPreOActivity: Seitenverhältnis passt nicht. Ausrichtung wechseln oder navigation_bar_height verringern.

Originalrechnung: 1.9047619 = 1920/(1080-72), 1.87 = 1920/(1080-53); Näherungswerte erhalten.

```text
CtsWindowManagerSdk25TestCases
android.server.wm.AspectRatioSdk25Tests#testMaxAspectRatioPreOActivity
Expected: a value less than or equal to <1.87F>
but: <1.9047619F> was greater than <1.87F>
1.9047619 = 1920/(1080-72) 1.87 = 1920/(1080-53)
console:/ $ wm size
Physical size: 1920x1080
console:/ $ dumpsys SurfaceFlinger | grep NavigationBar
0xb400007eee0bd600: unknown | 1080 ( 0) x 72 | 1 | 1 |
0x40000000000b00 | NavigationBar0#0
Android_SDK/frameworks/base$ git diff core/res/res/values/dimens.xml
<!-- Height of the bottom navigation / system bar. -->
- <dimen name="navigation_bar_height">72dp</dimen>
+ <dimen name="navigation_bar_height">53dp</dimen>
```

BYOD Managed Provisioning — Camera support cross profile video capture (with extra output path): Nullzeiger-Hänger.

```text
Android_SDK/packages/apps/Camera2$ git diff src/com/android/camera/VideoModule.java
if (mIsVideoCaptureIntent) {
// if no file save is needed, we can show the post capture UI now
showCaptureResult();
- }
- if (mVideoFileDescriptor != null) {
+ }else if (mVideoFileDescriptor != null) {
saveVideo();
}
```

Fehler BYOD Managed Provisioning — Camera support cross profile video capture (without extra output path).

Ohne Kamera dürfen die drei genannten profilübergreifenden Tests nicht erscheinen; Quelle entfernt Camera2.

```text
Android_SDK/packages/apps/Camera2$ git diff src/com/android/camera/VideoModule.java
if (shouldAddToMediaStoreNow && !fail) {
- if (mIsVideoCaptureIntent) {
+ if (mIsVideoCaptureIntent && mActivity.getIntent().getExtras() != null)
{
// if no file save is needed, we can show the post capture UI now
Camera support cross profile image capture
Camera support cross profile video capture (with extra output path)
Camera support cross profile video capture (without extra output path)
Android_SDK/build/make$ git diff target/product/handheld_product.mk
- Camera2 \
```

Companion Device Service Test: sichtbares BLE-Gerät wie eine Uhr danebenlegen.

Genannte nRF-Connect-APK auf Begleitgerät installieren. ADVERTISER → +, beliebiger Display name, ADD RECORD → Complete Local Name, Connectable → OK. Schalter aktivieren, Advertisement duration bestätigen. Zielgerät: Companion Device Service Test. Verschwinden kann 2 Minuten dauern; Device appeared und Device disappeared müssen erscheinen.

```text
com.android.cts.verifier.companion.CompanionDeviceServiceTestActivity
/GMS-Test-Suite/xTS/tools/nrfconnect_v4.24.3_itmop.com.apk
```

Device Suspend Tests: 2 Sekunden Tiefschlaf und erfolgreiches Aufwachen; ADB trennen.

```text
com.android.cts.verifier.sensors.DeviceSuspendTestActivity#testTimestampClockSource
SensorTest: [TestExecution] Delta between clock sources too small (0mS),
device must sleep more than 2 seconds
```

Notification Listener Testb: PIN im Assistenten setzen oder PIN setzen und System → Reset options → Reset app preferences ausführen.

Nach Flashen PIN im Assistenten setzen, sonst kann Notification Listener Test Einträge nicht finden.

USB Accessory Test: Google-Telefon als Begleitgerät empfohlen.

USB Accessory: Begleitgerät Start accessory test companion, Ziel USB Accessory Test; Begleitgerät HOST/OTG, Ziel DEVICE/USB; OK am Begleitgerät. USB Device: Begleitgerät Start device test companion, Ziel USB Device Test; Begleitgerät DEVICE/USB, Ziel HOST/OTG; OK am Ziel.

### 16.10 GTS-Fehler

GtsAssistantHostTestCases: nicht zur Hardware passende Camera-Features entfernen. Vor dem Test Camera öffnen, Berechtigung erteilen, Foto aufnehmen und schließen.

camera bezeichnet Rückkamera, camera.any ist erforderlich, camera.external USB-Kamera, camera.front Frontkamera.

```text
GtsAssistantHostTestCases
com.google.android.assistant.gts.AssistantTest#testAssistantTakePhotoWithVoiceInteraction
com.google.android.assistant.gts.AssistantTest#testAssistantOpenRearCameraWithoutVoiceInteraction
com.google.android.assistant.gts.AssistantTest#testAssistantTakePhotoWithoutVoiceInteraction
com.google.android.assistant.gts.AssistantTest#testAssistantOpenRearCameraWithVoiceInteraction
console:/ $ pm list features | grep camera
feature:android.hardware.camera ## 后摄Camera
feature:android.hardware.camera.any ## 必须
feature:android.hardware.camera.external ## Usb Camera
feature:android.hardware.camera.front ## 前摄Camera
```

soundDoseReached_showsWarning: android.permission.MODIFY_AUDIO_SETTINGS_PRIVILEGED fehlt.

Referenz: https://android-review.googlesource.com/c/platform/frameworks/base/+/1261388 . Fehlende Berechtigung in Shell-Rechten und Manifest ergänzen.

```text
GtsAudioTestCases
com.google.android.audio.gts.SoundDoseTest#soundDoseReached_showsWarning
com.google.android.audio.gts.SoundDoseTest#momentaryExposure_showsWarning
com.android.bedstead.nene.exceptions.NeneException: Can not get required
permission
Running On User: User{id=0, name=Owner}
Permission: android.permission.MODIFY_AUDIO_SETTINGS_PRIVILEGED
Permission protection level: Permission not found
Permission state: -1
Instrumented Package: com.google.android.audio.gts
Requested Permissions:
[android.permission.QUERY_ALL_PACKAGES,
com.google.android.audio.gts.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION,
android.permission.REORDER_TASKS, android.permission.READ_EXTERNAL_STORAGE]
Can adopt shell permissions: true
Shell permissions:[android.permission.REQUEST_DELETE_PACKAGES,
android.permission.MANAGE_ROLLBACKS, ......
Android_SDK/frameworks/base$ git diff data/etc/privapp-permissions-platform.xml
<privapp-permissions package="com.android.shell">
+ <permission
name="android.permission.MODIFY_AUDIO_SETTINGS_PRIVILEGED"/>
<!-- Needed for test only -->
<permission name="android.permission.MODIFY_DAY_NIGHT_MODE"/>
Android_SDK/frameworks/base$ git diff packages/Shell/AndroidManifest.xml
<!-- Permission required for testing system audio effect APIs. -->
<uses-permission
android:name="android.permission.MODIFY_DEFAULT_AUDIO_EFFECTS"/>
+ <uses-permission
android:name="android.permission.MODIFY_AUDIO_SETTINGS_PRIVILEGED"/>
```

testTelephonyAudioAvailable: Telefoniekomponenten bei Geräten ohne Telefonie/4G entfernen.

AM im Log bezieht sich auf Messages.apk; Quelle entfernt Google comms suite.

```text
GtsGmscoreHostTestCases
com.google.android.gts.audio.AudioHostTest#testTelephonyAudioAvailable
GtsNmgiarcTestCases
com.google.android.comms.MessagesTests#testMessagesVersionCheck
java.lang.RuntimeException: AM should be a privileged system app
Android_SDK/vendor/partner_gms$ git diff products/gms.mk
-# GMS comms suite
-$(call inherit-product, $(ANDROID_PARTNER_GMS_HOME)/products/google_comms_suite.mk)
```

testDisablingDeviceProvisioningPackage: Laut Quelle OobConfig.apk nicht auf Versionen über Android 12 integrieren.

```text
GtsGmscoreHostTestCases
com.google.android.gts.provisioning.ProvisioningHostTest#testDisablingDeviceProvisioningPackage
android.content.pm.PackageManager$NameNotFoundException:
com.google.android.apps.work.oobconfig
```

testSerialNumberAttestation: Attestation-Schlüssel schreiben und Gerät sperren (`fastboot oem at-lock-vboot`).

```text
GtsGmscoreHostTestCases
com.google.android.gts.security.DeviceIdAttestationHostTest#testSerialNumberAttestation
junit.framework.AssertionFailedError: The verified boot key must be non-
trivial, at least 32 bytes long.
```

testMbaPrivilegedPermission: AndroidManifest.xml darf `android:debuggable="true"` nicht deklarieren.

```text
GtsMbaPrivilegedPermissionTestCases
com.google.android.mbaprivilegedpermission.gts.GtsDebugCertificateTest#testMbaPrivilegedPermission
java.lang.RuntimeException: Violation of the Debug certificate policy
[com.rockchip.mirror] is debuggable.
```

testPolicy: Paketname gemäß Fehlermeldung ändern.

Beispiel: com.google.android.apps.customization.pixe → com.rockchip.android.apps.customization.pixel. Log nennt pixel, Anleitung ohne letztes l; Quellabweichung prüfen.

```text
GtsMbaPrivilegedPermissionTestCases
com.google.android.mbaprivilegedpermission.gts.GtsPackageNamespaceTest#testPolicy
java.lang.RuntimeException: Violation of the Package Namespace
[Package Name: com.google.android.apps.customization.pixel,
Certificates:
[3cc6c5f27c0b54f96507c2a5b31c404b3dbf065a2edb093eacd41147f2480f30]] contains
Google, but not owned by Google.
```

Fehler testNetworkStack.

Methode 1: CaptivePortalLoginFrameworkOverlayGo.apk setzt config_defaultCaptivePortalLoginPackageName; Methode 2: POST_NOTIFICATIONS standardmäßig mit Original-Digest und fixed=false.

```text
GtsNetworkStackHostTestCases
com.google.android.gts.networkstack.NetworkStackHostTest#testNetworkStack

com.google.android.networkstack.gts.NetworkStackTest#testCaptivePortalAppInstalledAndHasPostNotificationsPermission:
java.lang.AssertionError: com.google.android.go.captiveportallogin does not have
android.permission.POST_NOTIFICATIONS permission. Check that its package name
was configured in config_defaultCaptivePortalLoginPackageName (typically via
overlay). expected:<0> but was:<-1>
Android_SDK/vendor/rockchip/common/gms/CaptivePortalLoginFrameworkOverlayGo$ cat res/values/config.xml
<string name="config_defaultCaptivePortalLoginPackageName"
translatable="false">com.google.android.go.captiveportallogin</string>
Android_SDK/vendor/partner_gms$ git diff etc/default-permissions/default-permissions-google.xml
+
+ <exception
+ package="com.google.android.go.captiveportallogin"
+ sha256-cert-digest="5F:A4:22:12:AD:40:3E:22:DD:6E:FE:75:F3:F3:11:84:05:1F:EF:74:4C:0B:05:BE:5C:73:ED:F6:0B:F6:2C:1E">
+ <!-- Notifications -->
+ <permission name="android.permission.POST_NOTIFICATIONS" fixed="false"/>
+ </exception>
</exceptions>
```

testDefaultGrantsWithRemoteExceptions: betroffene App-Berechtigung laut Fehler entfernen.

```text
GtsPermissionTestCases
com.google.android.permission.gts.DefaultPermissionGrantPolicyTest#testDefaultGrantsWithRemoteExceptions
java.lang.AssertionError: packageName: com.google.android.contacts {
priv app: false
targetSDK: 33
uid: 10101
persistent: false
signature: 917F8719D4C2C892DBF26BBE2BDB179FFF0E0DDBEB8FF9F31A4DD98BB4A4D25D
on system image: true
has platform signature: false
message: cannot be granted by default to package {
permission: android.permission.POST_NOTIFICATIONS
}
}
```

testPreloadedAppsTargetSdkVersion: `android:targetSdkVersion` der App gemäß Fehler ändern.

Wenn wirksames targetSdkVersion-Update nicht hilft, schlägt die Quelle compileSdkVersion auf neuestes ro.product.first_api_level vor; minSdkVersion ≤ targetSdkVersion ≤ compileSdkVersion. Mit tatsächlichem SDK prüfen.

```text
GtsPermissionTestCases
com.google.android.permission.gts.PreloadAppsTargetSdkVersionTest#testPreloadedAppsTargetSdkVersion
All apps preloaded on DEVICEs launching with Android 11 MUST target API
level 29 or higher.
All apps preloaded on DEVICEs launching with Android 12 or 12L MUST
target API level 30 or higher.
All apps preloaded on DEVICEs launching with Android 13 MUST target API
level 31 or higher.
com.android.launcher3 must target 30 or higher, but targets 29
minSdkVersion(lowest possible) <= targetSdkVersion <=
compileSdkVersion(latest SDK)
Android_SDK/vendor/partner_gms$ git diff apps/SearchLauncher/AndroidManifest.xml
- <uses-sdk android:targetSdkVersion="29" android:minSdkVersion="28"/>
+ <uses-sdk android:targetSdkVersion="30" android:minSdkVersion="28"/>
```

testSystemAppsInstalled: ohne 4G AndroidAutoStub.apk nicht integrieren.

```text
GtsPlacementTestCases
com.google.android.placement.gts.InstalledAppsTest#testSystemAppsInstalled
java.lang.RuntimeException: Test failed for cases: [0]
Reasons include:
Message [0]: com.google.android.projection.gearhead should not be
installed on devices without Telephony
Android_SDK/vendor/partner_gms$ git diff products/gms.mk
# GMS mandatory core packages
PRODUCT_PACKAGES := \
- AndroidAutoStub \
```

testWidgetPresence: Google-Search-Widget im Launcher nicht entfernen.

Variable QSB_ON_FIRST_SCREEN in /packages/apps/Launcher3/src_build_config/com/android/launcher3/BuildConfig.java.

```text
GtsSearchHostTestCases
com.google.android.search.gts.GoogleSearchWidgetTest#testWidgetPresence
FAILURE: java.lang.AssertionError: Launcher from package
com.android.launcher3 does not contain search widget provided by
com.google.android.googlequicksearchbox (Google App).
```

testZeroTouch_zeroTouchWrapperLaunched: Im Assistenten VPN-WLAN verbinden, ohne Google-Anmeldung. Attestation-Schlüssel muss geschrieben sein.

```text
GtsSetupWizardHostTestCases
com.google.android.gts.setupwizard.SetupWizardZeroTouchTest#testZeroTouch_zeroTouchWrapperLaunched
FAILURE: junit.framework.AssertionFailedError: SetupWizard didn't launch
ZeroTouchWrapper.
On Android R+ or when com.google.android.apps.work.oobconfig is installed,
SetupWizard MUST launch ZeroTouchWrapper with intent action
com.google.android.setupwizard.ZERO_TOUCH_SETUP during normal SetupWizard flow
when WIFI/mobile data is connected.
```

testWidevineVersion: FTP-Patch `/GMS-Test-Suite/Exp+/WvtsDeviceTestCases`.

```text
WvtsDeviceTestCases
com.google.android.wvts.WidevineBusinessLogicTests#testWidevineVersion
FAILURE: java.lang.AssertionError: Unknown build number with cdm version
16.1.0
```

### 16.11 STS-Fehler

testPocBug_258188673: FTP-Patch `/GMS-Test-Suite/Exp+/testPocBug_258188673`.

```text
StsHostTestCases
android.security.sts.Bug_258188673#testPocBug_258188673
java.lang.AssertionError: PoC exited with bad exit code.. Actual: 113
```

### 16.12 VTS-Fehler

ProcCmdlineAndroidbootTest: GKI (BOARD_BUILD_GKI) aktivieren; androidboot.*** nicht mehr in der Kernel-Befehlszeile verwenden.

```text
VtsBootconfigTest
VtsBootconfigTest#ProcCmdlineAndroidbootTest
Expected equality of these values:
cmdline.find("androidboot")
Which is: 18
cmdline.npos
Which is: 18446744073709551615
"androidboot" parameters are not allowed in the kernel cmdline for
devices using kernel version 5.10 or greater with Android S and beyond. These
parameters are to be placed in bootconfig.
```

audioPolicyConfigurationValidation: audio_policy_configuration.xml gemäß Fehler korrigieren.

BOARD_SUPPORT_MULTIAUDIO ?= false setzen; Mehrkarten-Audio deaktivieren und audio_policy_configuration_multiaudio.xml weglassen.

```text
VtsHalAudioV7_1TargetTest
CheckConfig#audioPolicyConfigurationValidation
1 error occurred during xml validation:
XML is not valid according to the xsd
While validating: xmlFilePath
Which is: /vendor/etc/audio_policy_configuration.xml
Against the schema: xsd
Which is: /data/local/tmp/audio_policy_configuration_V7_0.xsd
Libxml2 errors:
Error: Element 'devicePort', attribute 'type': 'AUDIO_DEVICE_OUT_HDMI_1'
is not a valid value of the union type 'extendableAudioDevice'.
BOARD_SUPPORT_MULTIAUDIO ?= false
```

KernelReleaseFormat: offizielles Google-GKI-Release-boot.img verwenden.

```text
vts_generic_boot_image_test
GenericBootImageTest#KernelReleaseFormat
GenericBootImageTest#GenericRamdisk
Value of: KernelRelease::Parse(release, true ).has_value()
Actual: false
Expected: true
Kernel release '5.10.168-maybe-dirty' does not have generic kernel image
(GKI) release format. It must match this regex:
^(?P<w>\d+)[.](?P<x>\d+)[.](?P<y>\d+)-(?P<z>android\d+)-(?P<k>\d+).*$
Example: 5.4.42-android12-0-something
```

GkiComplianceV2/GkiComplianceV2_kernel: offizielles Google-GKI-Release-boot.img verwenden.

```text
vts_gki_compliance_test
GkiComplianceTest#GkiComplianceV2
GkiComplianceTest#GkiComplianceV2_kernel
KernelVersionTest#AgainstPlatformRelease
The GKI image descriptor is not signed by an official key.
```

VtsHalSensorsV1_0TargetTest: Sensor kalibrieren (siehe Testvorbereitung).

```text
VtsHalSensorsV1_0TargetTest
PerInstance/SensorsHidlTest#AccelerometerStreamingOperationSlow/0_default
PerInstance/SensorsHidlTest#AccelerometerStreamingOperationNormal/0_default
Value of: checker.check(sensorEvents, &s)
Actual: false
Expected: true
Event @ 49513760914252 (8.6287, -0.603339, 1.13006) has norm 8.72328,
which is beyond range [8.80665, 10.8067]
echo 1 > /sys/class/sensor_class/accel_calibration
```

vts_kernel_net_tests: FTP-Patch `/GMS-Test-Suite/Exp+/vts_kernel_net_tests`.

```text
vts_kernel_net_tests
vts_kernel_net_tests#vts_kernel_net_tests
testVtiRekey_IPv4_in_IPv4 (xfrm_tunnel_test.XfrmVtiTest) ... ERROR
testVtiRekey_IPv4_in_IPv6 (xfrm_tunnel_test.XfrmVtiTest) ... ERROR
testVtiRekey_IPv6_in_IPv4 (xfrm_tunnel_test.XfrmVtiTest) ... ERROR
testVtiRekey_IPv6_in_IPv6 (xfrm_tunnel_test.XfrmVtiTest) ... ERROR
```

Enabled/vts_virtual_ab_test: virtuelles A/B mit Komprimierung aktivieren; folgende Eigenschaft sicherstellen.

```text
ro.virtual_ab.userspace.snapshots.enabled=true
vts_libsnapshot_test
SnapshotUpdateTest#FullUpdateFlow
SnapshotUpdateTest#MergeCannotRemoveCow
vts_ota_config_test
VAB#Enabled
vts_virtual_ab_test
VirtualAbRequirementTest#EnabledOnLaunchT
build/make/target/product/virtual_ab_ota/compression.mk:
PRODUCT_VENDOR_PROPERTIES += ro.virtual_ab.userspace.snapshots.enabled=true
build/make/target/product/virtual_ab_ota/compression_with_xor.mk:
$(call inherit-product, $(SRC_TARGET_DIR)/product/virtual_ab_ota/compression.mk)
BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
BOARD_ROCKCHIP_VIRTUAL_AB_COMPRESSION := true
BOARD_BOOT_HEADER_VERSION := 4 ##
BOARD_BUILD_GKI := true
```

vts_treble_vintf_vendor_test: leerer Hash erfordert Einfrieren der Schnittstelle in current.txt.

In hidl-gen name:path aus hidl_package_root und betroffene Schnittstelle einsetzen. Ausgabe in benachbarte current.txt, eventuell /vendor/rockchip/hardware/interfaces/current.txt, übernehmen; Fehlendes gemäß Fehler ergänzen. Quelle schreibt auch idl_package_root; prüfen.

```text
vts_treble_vintf_vendor_test
DeviceManifest/SingleManifestTest#InterfacesAreReleased/0
rockchip.hardware.tv.input@1.0::ITvInput has an empty hash. This is
because it was compiled without being frozen in a corresponding current.txt
file.
hidl-gen -L hash -r rockchip.hardware:vendor/rockchip/hardware/interfaces -r android.hardware:hardware/interfaces -r android.hidl:system/libhidl/transport rockchip.hardware.tv.input@1.0::ITvInput
```

### 16.13 Checklist-Fehler

M13 — Default Home Screen Display und M14 — Placement of Google Collections Folder benötigen GmsSampleIntegration.apk.

```text
vendor/partner_gms/apps/GmsSampleIntegration/res_dhs_full/xml/partner_default_layout.xml <folder title=......</folder>
```

Duo.apk und Meet.apk teilen `com.google.android.apps.tachyon`, haben aber verschiedene Symbole. Nur eine App integrieren, sonst erscheinen zwei Symbole.

```text
Android_SDK/vendor/partner_gms$ git diff products/gms.mk
PRODUCT_PACKAGES += \
Chrome \
Drive \
Gmail2 \
- Duo \
+ Meet \
```

Der Google-Ordner muss Google TV (früher Play Movies) aus Videos.apk enthalten.

```text
package:/product/app/Videos/Videos.apk=com.google.android.videos
Android_SDK/vendor/partner_gms$ git diff apps/GmsSampleIntegration/res_dhs_full/xml/partner_default_layout.xml
- <favorite packageName="com.google.android.videos"
className="com.google.android.youtube.videos.EntryPoint"/>
+ <favorite packageName="com.google.android.videos"
className="com.google.android.videos.GoogleTvEntryPoint"/>
<favorite packageName="com.google.android.apps.tachyon"
className="com.google.android.apps.tachyon.MainActivity"/>
```

- M30 — Restore Experience in the Setup Wizard: `/GMS-Test-Suite/Exp+/M30_A13_USB Data`
- M33 — Location Privacy: ohne GPS überspringen.
- M53 — Safety and Emergency settings: `/GMS-Test-Suite/Exp+/M53_Emergency`
- M56 — Monochrome app icons: `/GMS-Test-Suite/Exp+/M56_A13_0828.zip`

```text
Android_SDK/vendor/partner_gms$ git diff products/gms.mk
PRODUCT_PACKAGES += \
GmsSampleIntegration \
- SearchLauncherQuickStep
+ SearchLauncherQuickStep \
+ WallpaperGoogle
Android_SDK/vendor/partner_gms$ git diff etc/permissions/privapp-permissions-google-system-ext.xml
+ <privapp-permissions package="com.google.android.apps.wallpaper">
+ <permission name="android.permission.READ_WALLPAPER_INTERNAL"/>
+ <permission name="android.permission.SET_WALLPAPER_COMPONENT"/>
+ <permission name="android.permission.CHANGE_OVERLAY_PACKAGES"/>
+ <permission name="android.permission.WRITE_SECURE_SETTINGS"/>
+ <permission name="android.permission.MODIFY_DAY_NIGHT_MODE"/>
+ <permission name="android.permission.BIND_WALLPAPER"/>
+ </privapp-permissions>
```

M58 — Code scanner: `/GMS-Test-Suite/Exp+/M58_Code scanner`.

```text
Android_SDK/frameworks/base$ git diff core/res/res/values/config.xml
<!-- Default component for QR code scanner -->
- <string name="config_defaultQrCodeComponent"></string>
+ <string
name="config_defaultQrCodeComponent">com.google.android.gms/.mlkit.barcode.ui.PlatformBarcodeScanningActivityProxy</string>
Android_SDK/frameworks/base$ git diff packages/SystemUI/res/values/config.xml
<!-- The default tiles to display in QuickSettings -->
<string name="quick_settings_tiles_default" translatable="false">
-
wifi,bt,dnd,flashlight,rotation,battery,cell,airplane,night,screenrecord
+
wifi,bt,dnd,flashlight,rotation,battery,cell,qr_code_scanner,airplane,night,screenrecord
</string>
```

M60 — Long press on power to Assistant Education: `/GMS-Test-Suite/Exp+/M60_Assistant Education`. EEA-V2 SearchSelector darf kein Symbol haben und nicht deaktivierbar sein (siehe EEA).

```text
Android_SDK/packages/apps/Settings$ git diff src/com/android/settings/applications/ApplicationFeatureProviderImpl.java
keepEnabledPackages.add(euicc.packageName);
}
+
keepEnabledPackages.add("com.google.android.apps.setupwizard.searchselector");
keepEnabledPackages.addAll(getEnabledPackageAllowlist());
```

### 16.14 Fehler mit userdebug-Firmware

Folgende Tests benötigen user-Firmware, nicht userdebug.

```text
CtsDrmTestCases
android.drm.cts.DRMTest#testForwardLockAccess
FAILURE: java.lang.RuntimeException: setDataSource failed: status =
0x80000000
CtsOsHostTestCases
android.os.cts.BuildHostTests#testIsSecureUserBuild
FAILURE: org.junit.ComparisonFailure: Must be a user build expected:
<user[debug]> but was:<user[]>
CtsOsTestCases
android.os.cts.BuildVersionTest#testBuildFingerprint
FAILURE: junit.framework.ComparisonFailure: Variant expected:<user[]>
but was:<user[debug]>
CtsPermission2TestCases
android.permission2.cts.PrivappPermissionsTest#privappPermissionsMustBeEnforced
java.lang.AssertionError: ro.control_privapp_permissions is not set to
enforce expected:<enforce> but was:<null>
CtsPermissionPolicyTestCases
android.permissionpolicy.cts.PrivappPermissionsTest#privappPermissionsMustBeEnforced
java.lang.AssertionError: ro.control_privapp_permissions is not set to
enforce expected:<enforce> but was:<null>
```

## 17 Fehlersuche

Einige Tests hängen von Layout oder DPI ab. DPI oder Ausrichtung vor dem Test ändern.

wm density ändert DPI; user_rotation: 0/1/2/3.

```text
wm density *** ## 调节机器dpi
settings get system user_rotation
settings put system user_rotation 1 ## user_rotation值为0/1/2/3
GtsPermissionControllerHostTestCases
android.permissioncontroller.gts.PermissionControllerHostTest#testDenyAppPermissionFragment
FAILURE: java.lang.AssertionError: Expected four atoms reported
```

CTS erzeugt Personal und Work. Arbeitsprofil über Personal → Settings → Passwords & accounts → Work → Remove work profile entfernen.

## 18 Ausnahmeantrag

Falls die Produktform eine Testbedingung nicht erfüllt, Google-Ausnahme erwägen. Fehlgeschlagenen Test separat ausführen und results/logs liefern. Bugreport erfassen:

```text
adb bugreport
```

Bericht liefern, etwa `bugreport-rk3399_Android12-SQ3A.220705.003.A1-2023-05-10-04-58-08.zip`. Mit `@***.corp-partner.google.com` anmelden und über IssueTracker beantragen.

## 19 Anhang A

Die Quelle nennt diese Module als GMS/EDLA-zertifizierte Beispiele, nicht als ArmSoM-Zertifizierung:

| Modul | Modell |
|---|---|
| Camera | AR0230 / Sony IMS 179 |
| WiFi | AP6275P(PCIE) / ap6275S(sdio) |

Originalschreibweise `IMS 179` bleibt erhalten; tatsächliches Modell prüfen.

## 20 Anhang B

| Testpaket | Downloadadresse | MADA/EDLA erforderlich |
|---|---|---|
| GMS | [https://docs.partner.android.com/gms/building/integrating/gms-download](https://docs.partner.android.com/gms/building/integrating/gms-download) | Y |
| Mainline | [https://drive.google.com/drive/folders/1gxxMalTC99Y2SvyRDUfiDFvY_k4OzjO5](https://drive.google.com/drive/folders/1gxxMalTC99Y2SvyRDUfiDFvY_k4OzjO5) | Y |
| CTS/CTSV | [https://source.android.com/docs/compatibility/cts/downloads](https://source.android.com/docs/compatibility/cts/downloads) | N |
| VTS/GSI | [https://docs.partner.android.com/gms/testing/vts](https://docs.partner.android.com/gms/testing/vts) | Y |
| STS | [https://drive.google.com/drive/folders/1xqPTtC6MWiQizfFVdG7Ho0f2oGsmH0e-](https://drive.google.com/drive/folders/1xqPTtC6MWiQizfFVdG7Ho0f2oGsmH0e-) | Y |
| GTS | [https://docs.partner.android.com/gms/testing/gts?hl=en](https://docs.partner.android.com/gms/testing/gts?hl=en) | Y |
| GTSV | [https://docs.partner.android.com/gms/testing/gts/gts-verifier?hl=en#download](https://docs.partner.android.com/gms/testing/gts/gts-verifier?hl=en#download) | Quelle leer |
| GKI | [https://source.android.com/docs/core/architecture/kernel/gki-release-builds](https://source.android.com/docs/core/architecture/kernel/gki-release-builds) | N |
| APTS | [https://docs.partner.android.com/gms/testing/apts?hl=en](https://docs.partner.android.com/gms/testing/apts?hl=en) | Y |
| GOATS | [https://docs.partner.android.com/gms/testing/goats?hl=en](https://docs.partner.android.com/gms/testing/goats?hl=en) | Y |
| PAB | [https://ci.android.com/builds/branches/aosp-master/grid](https://ci.android.com/builds/branches/aosp-master/grid) | N |
| Checklist | [https://docs.partner.android.com/gms/policies/overview/manual-checklist?hl=en#](https://docs.partner.android.com/gms/policies/overview/manual-checklist?hl=en#) | Y |
| Sicherheitspatches | [https://drive.google.com/drive/u/0/folders/0B85mEDAGzAbsckRrZFhhV3YwTEk?resourcekey=0-6zNsbY0nWUmYsJO2TF-RZQ](https://drive.google.com/drive/u/0/folders/0B85mEDAGzAbsckRrZFhhV3YwTEk?resourcekey=0-6zNsbY0nWUmYsJO2TF-RZQ) | Quelle leer |


| PAB | CTS/VTS |
|---|---|
| aosp-android11-tests-release | [Android11](https://ci.android.com/builds/branches/aosp-android11-tests-release/grid?legacy=1&selected-targets=test_suites_arm64) |
| aosp-android12-tests-release | [Android12](https://ci.android.com/builds/branches/aosp-android12L-tests-release/grid?legacy=1&selected-targets=test_suites_arm64) |
| aosp-android13-tests-release | [Android13](https://ci.android.com/builds/branches/aosp-android13-tests-release/grid?legacy=1&selected-targets=test_suites_arm64) |

Android12 ist als aosp-android12-tests-release beschriftet, der PDF-Link führt jedoch zu aosp-android12L-tests-release. Beide Angaben bleiben nachvollziehbar. MADA/EDLA ist bei GTSV und Sicherheitspatches im Original leer; nichts wurde ergänzt. Partnerlinks können Zugang benötigen.

## 21 Ergänzungen und Unterschiede der englischen V1.3

Folgende Angaben stammen aus der englischen Quelle2021, ersetzen chinesischeV3.0 nicht und sind keine aktuellen Zertifizierungsvorgaben. Gemeinsamer Inhalt oben, zusätzliche Beispiele/Unterschiede hier.

Englisch S.2–3: Go bei2GB oder weniger; PX30 nutzt RK3326-Sublicense/Android, PX30-uboot/kernel. Alte L1-Liste S.4: RK3288/RK3399; OpteeV2 S.5: RK3326/RK3566/RK3568, sonstV1. Diese Listen ersetzen neuere Hauptangaben nicht.

S.7–9: Sicherheitspatches gewöhnlich drei Monate gültig; altes Tool RKTools/windows/KeyBoxWrite_v1.51_0109.zip und Rockchip_User_Guide_KeyWrite_CN.pdf. Keybox-Unterlagen nennen CTS-Einzeltest statt chinesisch GtsEdiHostTestCases. Android11 media1.5, alter Pfad /tmp/android-cts-media/android-cts-media-1.4. Versionsbezug bleibt.

Englisch STS run sts-engbuild, chinesisch sts-dynamic-full; VTS retry run vts --retry0. Zur tatsächlichen Suite abgleichen, nicht mischen. GOATS benötigt Clang und RGA2→RGA2G-Patch. S.14: BTS seit2018-04-01, ZIP statt update.img, PHA/3PL/TAM-Hinweise bleiben.

| Historische Android11-Plattform | Go Express | Regular Express |
| --- | --- | --- |
| RK3326 | Ready | WIP |
| RK3566 | Ready | Ready |
| RK3368a | WIP | WIP |
| RK3288 | N/A | WIP |
| RK3399 | N/A | WIP |

Ready/WIP/N/A sind historische Zustände. Quellcode unten nach englischer Seite bewahrt alte SDK-Werte und Herkunft auch bei Überschneidungen. Englische Codekommentare unverändert.

Code englische Quelle S.2:

```text
lunch rk3326_rgo-user
```

Code englische Quelle S.3:

```text
device/rockchip/rk3326/BoardConfig.mk
PRODUCT_UBOOT_CONFIG := px30
```

```text
https://docs.partner.android.com/gms/building/integrating/gms-download
```

```text
https://drive.google.com/drive/folders/1gxxMalTC99Y2SvyRDUfiDFvY_k4OzjO5
```

```text
# Initialize with repo
repo init -u https://partner-android.googlesource.com/platform/manifest -b r-aml-prebuilt-release
# Starting synchronize, please check if `.repo/manifests/default.xml` exists.
repo sync -c -j8
```

Code englische Quelle S.4:

```text
diff --git a/default.xml b/default.xml
index 7be1f37..01ccba9 100644
--- a/default.xml
+++ b/default.xml
@@ -4,7 +4,7 @@
   <remote name="ohd"
            fetch=".."
            review="https://partner-android-review.googlesource.com/" />
- <default revision="r-aml-prebuilt-release"
+ <default revision="refs/tags/mainline_m_2020_dec_preload_5"
            remote="ohd" />
   <!-- Google-signed Mainline prebuilt module projects !-->
```

```text
BOARD_WIDEVINE_OEMCRYPTO_LEVEL := 3
```

```text
BUILD_WITH_EEA := true
BUILD_WITH_EEA_TYPE := type1 (Please config according to your EEA type)
```

Code englische Quelle S.5:

```text
BUILD_WITH_GOOGLE_MARKET := true
# Only change the following macro when your product has radio
BUILD_WITH_GOOGLE_MARKET_ALL := true
# When creating the user build, please set this macro to false to delete the
Rockchip StressTest tool, otherwise the device may not start normally.
PRODUCT_HAVE_RKAPPS := false
```

```text
diff --git a/device.mk b/device.mk
index 63bb4ac..4340170 100644
--- a/device.mk
+++ b/device.mk
@@ -899,7 +899,7 @@ ifeq ($(strip $(BUILD_WITH_GOOGLE_MARKET)), true)
     OVERRIDE_TARGET_FLATTEN_APEX := true
     PRODUCT_PROPERTY_OVERRIDES += ro.apex.updatable=false
     # 2G A Go
- #TMP_GMS_VAR := $(TMP_GMS_VAR)_2gb
+ TMP_GMS_VAR := $(TMP_GMS_VAR)_2gb
   endif
   ifeq ($(strip $(BUILD_WITH_EEA)),true)
     BUILD_WITH_GOOGLE_MARKET_ALL := true
```

```text
PRODUCT_HAVE_OPTEE := true
```

```text
BOARD_GRAVITY_SENSOR_SUPPORT := true
BOARD_COMPASS_SENSOR_SUPPORT := true
```

```text
BOARD_BLUETOOTH_LE_SUPPORT := false
```

```text
BUILD_WITH_GOOGLE_FRP := true
```

Code englische Quelle S.6:

```text
BOARD_AVB_ENABLE := true
```

```text
RKDocs/android/patches/gms/0001-libavb-Lock-the-device-when-the-device-init-or-write.patch
```

```text
BOARD_USES_AB_IMAGE := true
BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
# Please add the following changes if it does not exist:
ifeq ($(strip $(BOARD_USES_AB_IMAGE)), true)
  include device/rockchip/common/BoardConfig_AB.mk
  TARGET_RECOVERY_FSTAB := device/rockchip/rk356x/rk3566_rgo/recovery.fstab_AB
endif
```

```text
ifeq ($(strip $(BOARD_USES_AB_IMAGE)), true)
  include device/rockchip/common/BoardConfig_AB.mk
  TARGET_RECOVERY_FSTAB := device/rockchip/rk356x/rk3566_rgo/recovery.fstab_AB
endif
+ # The following overlay must be placed after `include
device/rockchip/common/BoardConfig_AB.mk`
+BOARD_SUPER_PARTITION_SIZE := 3263168512
+BOARD_ROCKCHIP_DYNAMIC_PARTITIONS_SIZE := $(shell expr $(BOARD_SUPER_PARTITION_SIZE) - 4194304)
```

```text
diff --git a/configs/rk3568_defconfig b/configs/rk3568_defconfig
index b7d433a..a87e2e3 100644
--- a/configs/rk3568_defconfig
+++ b/configs/rk3568_defconfig
@@ -204,6 +204,7 @@ CONFIG_AVB_LIBAVB=y
 CONFIG_AVB_LIBAVB_AB=y
 CONFIG_AVB_LIBAVB_ATX=y
 CONFIG_AVB_LIBAVB_USER=y
+CONFIG_ANDROID_AB=y
 CONFIG_RK_AVB_LIBAVB_USER=y
 CONFIG_OPTEE_CLIENT=y
 CONFIG_OPTEE_V2=y
```

Code englische Quelle S.7:

```text
device/rockchip/common/BoardConfig.mk:
BOARD_SELINUX_ENFORCING ?= true
```

```text
diff --git a/prebuild.mk b/prebuild.mk
index 28391f6..7f38922 100644
--- a/prebuild.mk
+++ b/prebuild.mk
@@ -4,3 +4,4 @@ $(warning You can disable this by removing this and setting
BOARD_RECORD_COMMIT_
 $(shell test -d .repo && .repo/repo/repo manifest -r -o
$(OUT_DIR)/commit_id.xml)
 -include $(TARGET_DEVICE_DIR)/prebuild.mk
+ROCKCHIP_BUILD_NUMBER := 202001 (Some numbers)
```

```text
build/make:
core/version_defaults.mk
PLATFORM_SECURITY_PATCH := 2020-03-05
```

```text
diff --git a/configs/rk3568_defconfig b/configs/rk3568_defconfig
index 46440b6..22831d2 100644
```

Code englische Quelle S.8:

```text
--- a/configs/rk3568_defconfig
+++ b/configs/rk3568_defconfig
@@ -205,6 +205,10 @@ CONFIG_AVB_LIBAVB=y
 CONFIG_AVB_LIBAVB_AB=y
 CONFIG_AVB_LIBAVB_ATX=y
 CONFIG_AVB_LIBAVB_USER=y
 CONFIG_RK_AVB_LIBAVB_USER=y
 CONFIG_OPTEE_CLIENT=y
 CONFIG_OPTEE_V2=y
+CONFIG_ANDROID_WRITE_KEYBOX=y
+CONFIG_ANDROID_KEYMASTER_CA=y
+CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION=y
```

```text
1. A single testcase report from CTS.
2. Device information (Ask 3pl for a template).
3. A file ends with .txt and includes Device ID.
Google Requests to use Device ID to apply the key:
Device ID within the file should meet the following properties:
    1. Unique and cannot be duplicate of another Device IDs within the file
    2. Must be between 1-32 characters in length
    3. Only following characters allowed [a-z][A-Z][0-9][_][-][.]
    4. No whitespaces allowed
Device ID files have the following requirements:
    1. ASCII text file in unix format.
    2. File name should be created with the following characters [a-z][A-Z][0-
9][_][-][.] in a meaningful way (e.g. Make_Model_Date_Quantity.txt)
    3. Must only contain Device IDs. No comments, headers, or other
information
    4. One Device ID per line
    5. No duplicate Device IDs within file
    6. No blank lines
    7. No white spaces
```

Code englische Quelle S.10:

```text
In Ubuntu, you can add the following content to ~/.bashrc or edit the
following into a file such as env, then source env before testing:
export JAVA_HOME=/home/Your_Name/Software/jdk1.8.0_77
export JRE_HOME=${JAVA_HOME}/jre
export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib
export PATH=${JAVA_HOME}/bin:$PATH
export PATH=/home/Your_Name/Software/android-sdk-linux/tools:$PATH
export PATH=/home/Your_Name/Software/android-sdk-linux/platform-tools:$PATH
export PATH=/home/Your_Name/Software/android-sdk-linux/build-tools/19.0.0:$PATH
```

```text
sudo apt-get install lib32stdc++6 lib32z1
```

```text
$ sudo apt-get install python-dev
```

```text
$ sudo apt-get install python-protobuf
$ sudo apt-get install protobuf-compiler
```

```text
$ sudo apt-get install python-virtualenv
$ sudo apt-get install python-pip
```

```text
$ sudo apt install virtualenv
```

```text
sudo apt autoremove python-virtualenv
sudo apt autoremove virtualenv
sudo ln -sf ~/.local/bin/pip2 /usr/bin/pip
pip install --user virtualenv
```

Code englische Quelle S.11:

```text
Q: Replace your adb/fastboot
A: Take adb as an example, type in the terminal:
whereis adb
$ adb: /home/rockchip/Software/android-sdk-linux/platform-tools/adb
adb kill-server
After confirming the location of adb/fastboot, replace the adb/fastboot binary
```

```text
run cts --shard-count 3 -s SN1 -s SN2 -s SN3
```

```text
CtsKeystoreTestCases
android.keystore.cts.KeyAttestationTest#testEcAttestation
android.keystore.cts.KeyAttestationTest#testRsaAttestation
android.keystore.cts.KeyAttestationTest#testEcAttestation_DeviceLocked
android.keystore.cts.KeyAttestationTest#testRsaAttestation_DeviceLocked
```

Code englische Quelle S.12:

```text
adb shell settings put global hidden_api_policy 1
```

```text
adb install -r -g CtsVerifier.apk
```

Code englische Quelle S.13:

```text
adb shell appops set com.android.cts.verifier android:read_device_identifiers allow
```

```text
adb shell appops set com.android.cts.verifier MANAGE_EXTERNAL_STORAGE 0
```

```text
$ vi .bashrc
export APE_API_KEY=/path/to/key.json
```

Code englische Quelle S.14:

```text
diff --git a/drivers/video/rockchip/rga2/Kconfig b/drivers/video/rockchip/rga2/Kconfig
index efc1ef6..3458051 100644
--- a/drivers/video/rockchip/rga2/Kconfig
+++ b/drivers/video/rockchip/rga2/Kconfig
@@ -1,5 +1,5 @@
 # SPDX-License-Identifier: GPL-2.0
-menu "RGA2"
+menu "RGA2G"
        depends on ARCH_ROCKCHIP
 config ROCKCHIP_RGA2
```

```text
rockchip~rk3326_qgo~rk3326_qgo~10~QD1A.190821.014.C2~201911~user~release-keys$
ls
boot-debug.img boot.img dtbo.img misc.img recovery.img super.img
vbmeta.img
```

Code englische Quelle S.15:

```text
repo init -m Android10_Express.xml
# For Android 11
repo init -m Android11_Express.xml
```

```text
repo init --repo-url=ssh://git@www.rockchip.com.cn:2222/repo-release/tools/repo.git -u ssh://git@www.rockchip.com.cn:2222/Android_Qt/manifests.git -m Android10_Express.xml
# Android 11
repo init --repo-url=ssh://git@www.rockchip.com.cn:2222/repo-release/tools/repo.git -u ssh://git@www.rockchip.com.cn:2222/Android_R/manifests.git -m Android11_Express.xml
```

```text
BUILD_WITH_GOOGLE_GMS_EXPRESS := true
```

Code englische Quelle S.16:

```text
diff --git a/gms-express.xml b/gms-express.xml
index 78f4d99..de93557 100644
--- a/gms-express.xml
+++ b/gms-express.xml
@@ -16,5 +16,5 @@
  -->
  <!-- These are configurations that should exist on GMS Express devices. -->
  <config>
- <feature name="com.google.android.feature.GMSEXPRESS_BUILD " />
+ <feature name="com.google.android.feature.GMSEXPRESS_PLUS_BUILD" />
  </config>
```

```text
patch/frameworks/base/increase_waiting_time_for_setup_wizard.diff
```

```text
patches/gms/0001-libavb-Lock-the-device-when-the-device-init-or-write.patch
```

## 22 Technische Quelllinks

Technische Links nach PDF-Seite. Teilweise Partnerzugang erforderlich; keine Anmeldung oder Operation durchgeführt.

- [CN PDF p.4](https://docs.partner.android.com/gms/policies/domains/reqs?authuser=2#nearby-share)

- [CN PDF p.5](https://docs.partner.android.com/gms/policies/domains/reqs?authuser=3#10_android_go)

- [CN PDF p.5](https://docs.partner.android.com/gms/policies/domains/reqs?authuser=3#64-bit-gms)

- [CN PDF p.11](https://docs.partner.android.com/gms/policies/regional/eea-builds)

- [CN PDF p.17](https://cs.android.com/android/platform/superproject/+/android12-security-release:)

- [CN PDF p.17](https://cs.android.com/android/platform/superproject/+/android13-security-release:)

- [CN PDF p.17](https://cs.android.com/android/platform/superproject/+/android14-security-release:)

- [CN PDF p.26](https://source.android.com/docs/core/ota/apex?authuser=2#vbmeta-signing)

- [CN PDF p.30](https://docs.google.com/document/d/1SK2LvrqvTQDEvK8WlB-EujCVvyEogiz4O83gtNkd_sU/edit)

- [CN PDF p.30](https://docs.partner.android.com/gms/policies/edla/edla-other-form)

- [CN PDF p.54](https://docs.partner.android.com/gms/policies/domains/reqs?authuser=2&hl=zh-cn#app-standby-buckets)

- [CN PDF p.67](https://docs.partner.android.com/gms/building/enterprise/zero-touch/implementing?hl=en#remove-oobconfig)

- [CN PDF p.75](https://docs.partner.android.com/gms/policies/regional/eea-builds?hl=en#v2-build-reqs)

- [CN PDF p.76](https://issuetracker.google.com/)

- [EN PDF p.11](https://support.google.com/androidpartners_gms/answer/9380762?hl=en)

{% endraw %}
