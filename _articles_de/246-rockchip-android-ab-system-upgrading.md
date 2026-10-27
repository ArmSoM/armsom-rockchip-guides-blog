---
title: "Rockchip Android A/B-System-Updatehandbuch"
description: "Rockchip Android A/B-System-Updatehandbuch — V1.2.0"
excerpt: "Rockchip Android A/B-System-Updatehandbuch"
translation_key: "246-rockchip-android-ab-system-upgrading"
slug: "246-rockchip-android-ab-system-upgrading"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: [ArmSoM, Rockchip, Android, OTA, AB]
---

{% raw %}

# Rockchip Android A/B-System-Updatehandbuch

Vollständiger technischer Text der sechs Kapitel (Seiten 4–12) aus dem zwölfseitigen chinesischen RK-SM-YF-208 V1.2.0 vom . Android >=12, Konfigurationen für 12/13/>=14 und Hinweise zu virtuellem A/B beschreiben das historische SDK, nicht heutige Kompatibilität. Nur chinesische Quelle, keine englischen Originalbilder. Alle Ausgaben enthalten dieselben acht Originalabbildungen; Bildtexte werden nicht als übersetzt ausgegeben. Code und lesbare Screenshot-Konfigurationen/Logs sind editierbar. Rechts-/Kontakt-, Zielgruppen-, Revisions- und doppelte Inhaltsangaben entfallen. Keine Builds, Updates, Flash- oder Hardwaretests durchgeführt.

Quellprobleme: Android-12/13-Beispiele verweisen auf rk3399_Android11; Abschnitt 6.1 schreibt installcelan und erzeugt update_loader.zip, während 6.2 ohne Erläuterung update.zip überträgt. Diese Unterschiede bleiben. Einige make-Optionsstriche in Kapitel 3 sind typografische Striche; ASCII-Optionen vor Verwendung prüfen. Patchauszüge behalten PDF-Umbrüche und sind keine validierten Patchdateien. fstab-Screenshot und Text unterscheiden sich (backup/system_ext sichtbar, nicht alle genannten Knoten). Lesbare Einstellungen, Adressen und Statusfortschritte sind transkribiert; abgeschnittene Pfade und unklare Hashes bleiben ohne Vermutung im Originalbild. Dateiname/Größe auf Seite 9 lassen sich anhand späterer Zeilen desselben Bildes abgleichen; headers-Hashes sind nicht zuverlässig lesbar, die Abschrift ist daher keine vollständige ausführbare Updatesitzung. Flashen/OTA/Bootloader-Updates können Datenverlust oder Startausfall verursachen: autorisierte Testgeräte, Backup, passende Partitionen/Firmware und Wiederherstellungsplan. Die Quellwarnung vor routinemäßigen Miniloader-Updates bleibt erhalten.

<!-- source:cn p2 unit:scope -->

| Chipname | Kernelversion |
| --- | --- |
| <code>RK3326/RK3399/RK356x/RK3588</code> | <code>4.19, 5.10</code> |

<!-- source:cn p4 unit:0 -->

## 1. Überblick

<!-- source:cn p4 unit:1 -->

Dieses Dokument beschreibt das Rockchip-A/B-System für Rockchip Android >= 12. Jede aktualisierbare Partition außer super besitzt eine a- und b-Kopie, wodurch der Speicherbedarf gegenüber klassischen Recovery-Updates erheblich steigt. Vorteil sind nahtlose Updates während des Android-Betriebs gemäß kundenspezifischen Client-/Server-Protokollen und Interaktionsrichtlinien.

<!-- source:cn p4 unit:2 -->

## 2. Systemkonfiguration

<!-- source:cn p4 unit:3 -->

A/B ist auf der Rockchip-Android-Plattform standardmäßig deaktiviert. Für seine Nutzung sind Android-, U-Boot- und Kernel-DTS-Konfiguration wie folgt zu berücksichtigen.

<!-- source:cn p4 unit:4 -->

### 2.1 Android-Systemkonfiguration

<!-- source:cn p4 unit:5 -->

#### 2.1.1 Android-12-Konfiguration

<!-- source:cn p4 unit:6 -->

Die Android-12-Konfiguration umfasst:

<!-- source:cn p4 unit:7-0 -->

1. A/B-Updates in device\rockchip\rkxxx\BoardConfig.mk aktivieren. BOARD_USES_AB_IMAGE auf true setzen; Standard ist false. Beispiel für rk3326:

<!-- source:cn p4 unit:7-1 -->

```text
vim device/rockchip/rk3326_s/BoardConfig.mk
#AB image definition
-BOARD_USES_AB_IMAGE := false
+BOARD_USES_AB_IMAGE := true
```

<!-- source:cn p4 unit:7-2 -->

Hinweis: Für virtuelles A/B (nicht empfohlen) BOARD_USES_AB_IMAGE und BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE auf true setzen:

<!-- source:cn p4 unit:7-3 -->

```text
-BOARD_USES_AB_IMAGE := false
-BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
```

<!-- source:cn p4 unit:8 -->

2. Im entsprechenden device\rockchip\rkxxx nach recovery.fstab_AB suchen. Falls vorhanden, diesen Schritt überspringen; andernfalls: (1) Eine A/B-recovery-fstab namens recovery.fstab_AB anlegen. Gegenüber fstab.rk30board slotselect für system/vendor/odm/product ergänzen, Partitionsknoten exernal_sd, frp, parameter, baseparameter und resource hinzufügen und data-Mountoptionen ändern. Beispiel: device\rockchip\rk3399\rk3399_Android12\recovery.fstab_AB:

<!-- source:cn p5 unit:9 -->

![Abbildung der chinesischen Quelle und editierbare Abschrift: p5](/docs/rockchip-android-ab-system-upgrading/assets/cn-p005-figure-01.png)

```text
# Android fstab file.
#<src> <mnt_point> <type> <mnt_flags and options> <fs_mgr_flags>
# The filesystem that contains the filesystem checker binary (typically /system) cannot
# specify MF_CHECK, and must come before any filesystems that do specify MF_CHECK
system /system ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
vendor /vendor ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
odm /odm ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
product /product ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
system_ext /system_ext ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
/dev/block/by-name/metadata /metadata ext4 nodev,noatime,nosuid,discard,sync wait,formattable,first_stage_mount
/dev/block/by-name/misc /misc emmc defaults defaults
/dev/block/by-name/cache /cache ext4 noatime,nodiratime,nosuid,nodev,noauto_da_alloc,discard wait,check
/dev/block/mmcblk0p1 /mnt/external_sd vfat /dev/block/mmcblk0 defaults
/dev/block/by-name/frp /frp emmc defaults defaults
/dev/block/by-name/baseparameter /baseparameter emmc defaults defaults
/dev/block/by-name/backup /backup emmc defaults defaults
/dev/block/zram0 none swap defaults zramsize=50%
/dev/block/by-name/userdata /data f2fs defaults defaults
```

<!-- source:cn p5 unit:10 -->

(2) A/B-Einstellungen in BoardConfig unter device\rockchip\rkxxx einbinden, einschließlich TARGET_RECOVERY_FSTAB mit Verweis auf die neue recovery.fstab_AB.

<!-- source:cn p5 unit:11 -->

```text
device\rockchip\rk3399\rk3399_Android12\BoardConfig.mk：
diff --git a/ rk3399/rk3399_Android12/BoardConfig.mk b/
rk3399/rk3399_Android12/BoardConfig.mk
index 1e78940..159a3b6 100755
--- a/ rk3399/rk3399_Android12/BoardConfig.mk
+++ b/ rk3399/rk3399_Android12/BoardConfig.mk
+# AB image definition
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+
+ifeq ($(strip $(BOARD_USES_AB_IMAGE)), true)
+    include device/rockchip/common/BoardConfig_AB.mk
+    TARGET_RECOVERY_FSTAB := device/rockchip/
rk3399/rk3399_Android11/recovery.fstab_AB
+endif
```

<!-- source:cn p5 unit:12 -->

#### 2.1.2 Android-13-Konfiguration

<!-- source:cn p5 unit:13 -->

Die Android-13-Konfiguration umfasst:

<!-- source:cn p5 unit:14-0 -->

1. A/B-Updates in device\rockchip\rkxxx\BoardConfig.mk aktivieren. BOARD_USES_AB_IMAGE auf true setzen; Standard ist false. Beispiel für rk3326:

<!-- source:cn p5 unit:14-1 -->

```text
vim device/rockchip/rk3326_s/BoardConfig.mk
#AB image definition
-BOARD_USES_AB_IMAGE := false
+BOARD_USES_AB_IMAGE := true
```

<!-- source:cn p5 unit:14-2 -->

Hinweise: (1) Für virtuelles A/B (wegen Auswirkungen auf die Updateleistung nicht empfohlen) BOARD_USES_AB_IMAGE und BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE auf true setzen:

<!-- source:cn p5 unit:14-3 -->

```text
-BOARD_USES_AB_IMAGE := false
-BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
```

<!-- source:cn p5 unit:14-4 -->

(2) Komprimiertes virtuelles A/B wird ab Android 13 unterstützt. Zum Aktivieren (wegen Auswirkungen auf die Updateleistung nicht empfohlen) BOARD_USES_AB_IMAGE, BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE und BOARD_ROCKCHIP_VIRTUAL_AB_COMPRESSION auf true setzen:

<!-- source:cn p6 unit:15-0 -->

```text
-BOARD_USES_AB_IMAGE := false
-BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_COMPRESSION := true
```

<!-- source:cn p6 unit:16 -->

2. Im entsprechenden device\rockchip\rkxxx nach recovery.fstab_AB suchen. Falls vorhanden, diesen Schritt überspringen; andernfalls: (1) Eine A/B-recovery-fstab namens recovery.fstab_AB anlegen. Gegenüber fstab.rk30board slotselect für system/vendor/odm/product ergänzen, Partitionsknoten exernal_sd, frp, parameter, baseparameter und resource hinzufügen und data-Mountoptionen ändern. Beispiel: device\rockchip\rk3399\rk3399_Android12\recovery.fstab_AB:

<!-- source:cn p6 unit:17 -->

![Abbildung der chinesischen Quelle und editierbare Abschrift: p6](/docs/rockchip-android-ab-system-upgrading/assets/cn-p006-figure-01.png)

```text
# Android fstab file.
#<src> <mnt_point> <type> <mnt_flags and options> <fs_mgr_flags>
# The filesystem that contains the filesystem checker binary (typically /system) cannot
# specify MF_CHECK, and must come before any filesystems that do specify MF_CHECK
system /system ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
vendor /vendor ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
odm /odm ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
product /product ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
system_ext /system_ext ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
/dev/block/by-name/metadata /metadata ext4 nodev,noatime,nosuid,discard,sync wait,formattable,first_stage_mount
/dev/block/by-name/misc /misc emmc defaults defaults
/dev/block/by-name/cache /cache ext4 noatime,nodiratime,nosuid,nodev,noauto_da_alloc,discard wait,check
/dev/block/mmcblk0p1 /mnt/external_sd vfat /dev/block/mmcblk0 defaults
/dev/block/by-name/frp /frp emmc defaults defaults
/dev/block/by-name/baseparameter /baseparameter emmc defaults defaults
/dev/block/by-name/backup /backup emmc defaults defaults
/dev/block/zram0 none swap defaults zramsize=50%
/dev/block/by-name/userdata /data f2fs defaults defaults
```

<!-- source:cn p6 unit:18 -->

(2) A/B-Einstellungen in BoardConfig unter device\rockchip\rkxxx einbinden, einschließlich TARGET_RECOVERY_FSTAB mit Verweis auf die neue recovery.fstab_AB.

<!-- source:cn p6 unit:19 -->

```text
device\rockchip\rk3399\rk3399_Android12\BoardConfig.mk：
diff --git a/ rk3399/rk3399_Android12/BoardConfig.mk b/
rk3399/rk3399_Android12/BoardConfig.mk
index 1e78940..159a3b6 100755
--- a/ rk3399/rk3399_Android12/BoardConfig.mk
+++ b/ rk3399/rk3399_Android12/BoardConfig.mk
+# AB image definition
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+
+ifeq ($(strip $(BOARD_USES_AB_IMAGE)), true)
+    include device/rockchip/common/BoardConfig_AB.mk
+    TARGET_RECOVERY_FSTAB := device/rockchip/
rk3399/rk3399_Android11/recovery.fstab_AB
+endif
```

<!-- source:cn p6 unit:20 -->

#### 2.1.3 Konfiguration für Android >= 14

<!-- source:cn p6 unit:21 -->

Die Android-14-Konfiguration umfasst:

<!-- source:cn p6 unit:22 -->

1. Die entsprechende A/B-Einstellung unter device\rockchip\ aktivieren. BOARD_USES_AB_IMAGE auf true setzen; Standard false. Beispiel:

<!-- source:cn p7 unit:23 -->

```text
diff --git a/rk3588_u/BoardConfig.mk b/rk3588_u/BoardConfig.mk
index e30391c..c7a86ce 100644
--- a/rk3588_u/BoardConfig.mk
+++ b/rk3588_u/BoardConfig.mk
@@ -14,7 +14,10 @@
+
+BOARD_USES_AB_IMAGE := true
```

<!-- source:cn p7 unit:24-0 -->

Hinweise: (1) Für virtuelles A/B (wegen Auswirkungen auf die Updateleistung nicht empfohlen) BOARD_USES_AB_IMAGE und BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE auf true setzen:

<!-- source:cn p7 unit:24-1 -->

```text
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
```

<!-- source:cn p7 unit:24-2 -->

(2) Für komprimiertes virtuelles A/B bei GKI-Builds (wegen Auswirkungen auf die Updateleistung nicht empfohlen) BOARD_USES_AB_IMAGE, BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE und BOARD_ROCKCHIP_VIRTUAL_AB_COMPRESSION auf true setzen:

<!-- source:cn p7 unit:24-3 -->

```text
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_COMPRESSION := true
```

<!-- source:cn p7 unit:25 -->

### 2.2 Kernel-DTS-Konfiguration

<!-- source:cn p7 unit:26 -->

Für Android >= 12 ist keine Kernel-Konfiguration erforderlich.

<!-- source:cn p7 unit:27 -->

### 2.3 U-Boot-Konfiguration

<!-- source:cn p7 unit:28 -->

CONFIG_ANDROID_AB=y zur chipspezifischen U-Boot-Konfiguration hinzufügen. Der folgende Screenshot zeigt ein Beispiel.

<!-- source:cn p7 unit:29 -->

![Abbildung der chinesischen Quelle und editierbare Abschrift: p7](/docs/rockchip-android-ab-system-upgrading/assets/cn-p007-figure-01.png)

```text
diff --git a/configs/rk3326_defconfig b/configs/rk3326_defconfig
old mode 100644
new mode 100755
index 0465f23..d4648c
--- a/configs/rk3326_defconfig
+++ b/configs/rk3326_defconfig
@@ -114,3 +114,4 @@ CONFIG_OPTEE_CLIENT=y
 CONFIG_OPTEE_V2=y
 CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION=y
 CONFIG_TEST_ROCKCHIP=y
+CONFIG_ANDROID_AB=y
```

<!-- source:cn p7 unit:30 -->

### 2.4 Partitionen im Entwicklungs-Flashtool ergänzen

<!-- source:cn p7 unit:31 -->

B-Partitionseinträge hinzufügen und jedes A/B-Paar mit derselben Firmware flashen. Bei Android >= 12 erzeugt der Build nach Abschnitt 3 automatisch config.cfg unter rockdev/xxxx/. Die gleichnamige Datei in RKDevTool ersetzen und RKDevTool neu öffnen; keine manuelle Konfiguration erforderlich. Ein Beispiel folgt.

<!-- source:cn p8 unit:32 -->

![Abbildung der chinesischen Quelle und editierbare Abschrift: p8](/docs/rockchip-android-ab-system-upgrading/assets/cn-p008-figure-01.png)

```text
RKDevTool v2.63
Loader Ver:1.18
# Address Name
1 0x00000000 Loader
2 0x00000000 Parameter
3 0x00004000 Uboot_a
4 0x00006000 Uboot_b
5 0x00008000 trust_a
6 0x0000A000 trust_b
7 0x0000C000 Misc
8 0x00028000 Dtbo_a
9 0x0002A000 Dtbo_b
10 0x0002C000 vbmeta_a
11 0x0002C800 vbmeta_b
12 0x0002D000 Boot_a
13 0x0004D000 Boot_b
```

<!-- source:cn p8 unit:33 -->

Hinweis: Chips wie rk3566/rk3568/rk3588 besitzen keine trust-Partition; trust_a und trust_b sind daher nicht erforderlich.

<!-- source:cn p8 unit:34 -->

## 3. A/B-System und OTA-Paket erstellen

<!-- source:cn p8 unit:35 -->

A/B-Firmware unbedingt in folgender Reihenfolge erstellen. Methode 1:

<!-- source:cn p8 unit:36 -->

```text
source build/envsetup.sh
lunch XXX
make installclean –j16  OR make clean -j16
make –j16
make dist –j16
mkimage_ab.sh  ota
```

<!-- source:cn p8 unit:37 -->

Methode 2:

<!-- source:cn p8 unit:38 -->

```text
source build/envsetup.sh
lunch XXX
./build.sh -ABUCKuop
```

<!-- source:cn p8 unit:39 -->

Hinweise:

<!-- source:cn p8 unit:40 -->

1. Nach Aktivierung von A/B vor dem ersten Build make clean ausführen.

<!-- source:cn p8 unit:41 -->

2. Delta-Pakete werden wie bei Nicht-A/B-Systemen erstellt. Details zu Voll- und Delta-Paketen: Rockchip_Developer_Guide_Android_Recovery_CN. Zur A/B-OTA-Prüfung siehe Abschnitt 4 „Prüfung (Client und Server)“.

<!-- source:cn p9 unit:42 -->

## 4. Prüfung (Client und Server)

<!-- source:cn p9 unit:43 -->

Ein nahtloses Update kann das Paket gleichzeitig herunterladen und anwenden; benötigt werden HTTP-Server und Updateclient. Zur Prüfung update_device.py verwenden. Produktive Clients und Server muss der Kunde selbst entwickeln; Androids update_engine_client dient als Referenz. update_device.py zeigt dessen Nutzung durch Aufruf über adb. Prüfmethode: Das Skript macht den Host über adb zum HTTP-Server und ruft update_engine_client für das nahtlose Update auf. Folgenden Befehl auf dem Host mit funktionierendem adb und Python ausführen:

<!-- source:cn p9 unit:44 -->

```text
system/update_engine/scripts/update_device.py {升级包名字}
```

<!-- source:cn p9 unit:45 -->

Beispiel:

<!-- source:cn p9 unit:46 -->

![Abbildung der chinesischen Quelle und editierbare Abschrift: p9](/docs/rockchip-android-ab-system-upgrading/assets/cn-p009-figure-01.png)

```text
sudo system/update_engine/scripts/update_device.py ~/rk3326_evb-ota-eng.jdy.zip
INFO:root:Running: adb reverse tcp:1234 tcp:37213
INFO:root:Running: adb shell su 0 update_engine_client --update --follow --payload=http://127.0.0.1:1234/payload --offset=5501 --size=451914571
FILE_SIZE=451914571
METADATA_SIZE=59119
USER_AGENT=Dalvik (something, something)
NETWORK_ID=0
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_IDLE (0), 0)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_UPDATE_AVAILABLE (2), 0)
127.0.0.1 - - [17/Jul/2018 17:24:40] "GET /payload HTTP/1.1" 206 -
INFO:root:Serving request for /payload from /home/jdy/rk3326_evb-ota-eng.jdy.zip [5501, 451920072) length: 451914571
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 4.84229e-05)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.0100547)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.0200611)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.0300673)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.0400735)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.0500798)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.0600861)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.0700924)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.0800987)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.0901049)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.100111)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.110118)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.120124)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.13013)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.140137)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.150143)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.160149)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.170155)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.180161)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.190168)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.200174)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.21018)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.220187)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.230193)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.240199)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.250205)
```

<!-- source:cn p10 unit:47 -->

![Abbildung der chinesischen Quelle und editierbare Abschrift: p10](/docs/rockchip-android-ab-system-upgrading/assets/cn-p010-figure-01.png)

```text
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.230193)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.240199)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.250205)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.260212)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.270218)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.280224)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.290231)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.300237)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.310243)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.320249)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.330256)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.340262)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.350268)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.360275)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.370281)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.380287)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.390293)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.4003)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.410306)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.420312)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.430318)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.440325)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.450331)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.460337)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.470344)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.48035)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.490356)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.500362)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.510369)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.520375)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.530381)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.540388)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.550394)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.5604)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.570406)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.580413)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.590419)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.600425)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.610432)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.620438)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.630444)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.64045)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.650457)
```

<!-- source:cn p10 unit:48 -->

![Abbildung der chinesischen Quelle und editierbare Abschrift: p10](/docs/rockchip-android-ab-system-upgrading/assets/cn-p010-figure-02.png)

```text
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.780538)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.790545)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.800551)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.810557)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.820563)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.83057)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.840576)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.850582)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.860589)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.870595)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.880601)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.890607)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.900614)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.91062)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.920626)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.930633)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.940639)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.950645)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.960651)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.970658)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.980664)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.99067)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.01)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.03)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.04)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.05)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.08)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.1)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.12)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.13)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.14)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.16)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.17)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.19)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.21)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.22)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.23)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.25)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.26)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.27)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.29)
```

<!-- source:cn p11 unit:49 -->

![Abbildung der chinesischen Quelle und editierbare Abschrift: p11](/docs/rockchip-android-ab-system-upgrading/assets/cn-p011-figure-01.png)

```text
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.53)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.55)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.56)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.58)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.6)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.61)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.62)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.64)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.65)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.66)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.68)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.7)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.71)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.73)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.74)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.75)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.77)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.78)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.79)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.81)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.83)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.84)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.86)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.87)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.88)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.9)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.91)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.92)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.94)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.95)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.96)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.97)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.99)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 1)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 1)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 1)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_UPDATED_NEED_REBOOT (6), 0)
[INFO:update_engine_client_android.cc(98)] onPayloadApplicationComplete(ErrorCode::kSuccess (0))
INFO:root:Running: adb reverse --remove tcp:1234
INFO:root:Server Terminated
jdy@jdy-Latitude-E6440:/media/jdy/LDSecond/rk3326/rk3326_8.X$
```

<!-- source:cn p11 unit:50 -->

Die Screenshots zeigen den Updateablauf der Quelle. Bei Erfolg wird UPDATE_STATUS_UPDATED_NEED_REBOOT ausgegeben. Dann das Gerät manuell neu starten, um zum aktualisierten System zu wechseln.

<!-- source:cn p11 unit:51 -->

## 5. Wichtige Hinweise

<!-- source:cn p11 unit:52-0 -->

1. Beim Packen von update.img die entsprechenden Partitionen in package-file ergänzen. Beispiel für trust und uboot folgt; andere Partitionen entsprechend.

<!-- source:cn p11 unit:52-1 -->

```text
trust_a Image/trust.img
trust_b Image/trust.img
uboot_a Image/uboot.img
uboot_b Image/uboot.img
```

<!-- source:cn p11 unit:52-2 -->

Hinweis: Chips wie rk3566/rk3568/rk3588 besitzen keine trust-Partition; trust_a und trust_b sind daher nicht erforderlich.

<!-- source:cn p11 unit:53 -->

## 6. A/B-Miniloader-OTA

<!-- source:cn p11 unit:54 -->

Miniloader ist Rockchips Bootloader der ersten Stufe. Normalerweise ist sein OTA-Update weder erforderlich noch empfohlen. Für Ausnahmefälle beschreibt dieser Abschnitt ein Verfahren auf Rockchip-A/B-Systemen. Das Miniloader-OTA-Paket ist unabhängig vom normalen A/B-Paket. Das spezielle Paket nach Abschnitt 6.1 erzeugen und den Client nach 6.2 implementieren. Die Befehle wechseln in Recovery, aktualisieren den Miniloader und starten anschließend automatisch neu.

<!-- source:cn p12 unit:55 -->

### 6.1 rkloader-Updatepaket erstellen

<!-- source:cn p12 unit:56 -->

Für Android >= 12 ist nach dem OTA-Firmwarebuild (Quellbefehl: make installcelan && make -j16 && make dist -j16 && ./mkimage_ab.sh ota) die automatisch erzeugte rockdev/update_loader.zip das rk-loader-OTA-Paket.

<!-- source:cn p12 unit:57 -->

### 6.2 Referenzbefehle zum Update

<!-- source:cn p12 unit:58 -->

Die Updateclient-APK kann folgende Befehlsfolge implementieren:

<!-- source:cn p12 unit:59 -->

```text
adb root
adb push update.zip /cache/
adb shell "echo \"--fw_rkloader=/cache/update.zip\" > /cache/recovery/command"
adb reboot recovery
```

{% endraw %}
