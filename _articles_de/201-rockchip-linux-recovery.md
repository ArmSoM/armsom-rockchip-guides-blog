---
title: "Entwicklerhandbuch für Rockchip Linux Recovery-Updates"
description: "Entwicklerhandbuch für Rockchip Linux Recovery-Updates — V1.2.1"
excerpt: "Entwicklerhandbuch für Rockchip Linux Recovery-Updates"
translation_key: "201-rockchip-linux-recovery"
slug: "201-rockchip-linux-recovery"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "system"
products: []
tags: [ArmSoM, Rockchip, Linux, Recovery, OTA]
---

{% raw %}

# Entwicklerhandbuch für Rockchip Linux Recovery-Updates

Grundlage sind Chinesisch und Englisch RK-KF-YF-353 V1.2.1 vom 2021-07-30; Chinesisch dient als technische Basis. Der Quellumfang umfasst RK3308, RK3226, RK3399, RK3288, RK3326, PX30 und verwandte Linux-4.4-Plattformen. Für ArmSoM konkrete Platine, SoC, SDK/BSP, Partitionierung und Speicher prüfen. Es wurden keine Gerätebefehle oder Hardwaretests ausgeführt. Werkseinstellungen und wipe_all/wipe_data löschen Daten; auch SD-Erstellung und Flashen können Medien überschreiben. Zuvor sichern und Ziele prüfen. „Ohne Verlust“ in der Einleitung bedeutet nicht, dass jeder Ablauf Daten erhält.

## 1. OTA-Aktualisierung

### 1.1 Überblick

OTA (Over-the-Air) ist die drahtlose Bereitstellung von Aktualisierungen und ein Standardverfahren von Android. Die Quelle beschreibt Aktualisierungen ohne Datenverlust, automatisches Herunterladen über Wi-Fi, 3G/4G sowie Pakete auf SD-Karten oder USB-Datenträgern. Als typische Größe werden wenige bis etwa ein Dutzend MB genannt; dies ist keine Zusage für jede Firmware. Beschrieben werden das lokale recovery-Programm, Ablauf, technische Einzelheiten und Entwicklungshinweise.

### 1.2 Kompilierung

Hauptsystem rootfs: update durch BR2_PACKAGE_UPDATE=y in der configs-Datei aktivieren.

```text
source envsetup.sh
#choose a combo number to build rootfs according to platform chip
make menuconfig
```

Detaillierte Einstellungen:

```text
Target packages  --->
[*] Rockchip BSP packages  --->
[*]   Rockchip OTA update for linux
```

Recovery: Die Plattformkonfigurationen sind in buildroot/configs/rockchip/recovery.config ausgelagert. Folgenden Befehl im SDK-Hauptverzeichnis ausführen.

```text
./build.sh recovery
```

Bei Erfolg entsteht buildroot/output/rockchip_rkxxxx_recovery/images/recovery.img; rkxxxx bezeichnet den konkreten Chip. Danach ausführen:

```text
./mkfirmware.sh
```

Die Firmware wird nach rockdev/ kopiert. Wichtige Quellen: external/recovery/ erstellt das recovery-Binärprogramm für den Wiederherstellungsmodus; external/rkupdate/ erstellt rkupdate, das Partitionsdaten aus update.img ausliest und die Partitionen aktualisiert. Chinesisch präzisiert: rkupdate wird von recovery aufgerufen. Nach Änderungen in diesen Verzeichnissen wie folgt bauen:

1. source envsetup.sh ausführen.

2. recovery-Konfiguration der gewünschten Plattform auswählen.

3. Englisch: make recovery-dirclean &amp;&amp; recovery. Chinesisch: make recovery-dirclean &amp;&amp; make recovery; siehe Quellenabgleich.

4. make rkupdate-dirclean &amp;&amp; make rkupdate ausführen.

5. ./build.sh recovery ausführen.

6. ./mkfirmware.sh ausführen.

7. recovery.img flashen.

### 1.3 Aktualisierungsablauf

#### 1.3.1 Firmware vorbereiten

tools/linux/Linux_Pack_Firmware/rockdev/package-file entsprechend den zu aktualisierenden Partitionen anpassen. Im SDK-Hauptverzeichnis ausführen:

```text
./build.sh updateimg
```

Die in package-file angegebenen Partitionsabbilder werden zu update.img unter rockdev/ gepackt; diese Datei dient zur Aktualisierung. “Error!imageHead.uiTag !=0x57464B52” weist auf fehlerhafte Paketierung hin. update.img wie beschrieben erneut erstellen und wiederholen.

![Fehlerprotokoll des Updatepakets](/docs/rockchip-linux-recovery/assets/en-p006-figure-01.png)

#### 1.3.2 Aktualisierung ausführen

update.img im Hauptverzeichnis der SD-Karte oder des USB-Datenträgers bzw. unter /userdata ablegen. Im normalen System update ota /xxx/update.img ausführen: Das Gerät wechselt zu recovery und startet die Aktualisierung. Einhängepunkte: USB /udisk; SD /mnt/sdcard/ oder /sdcard; Flash /userdata/. Nach Erfolg startet das normale System erneut. Der Ablauf ist unten dargestellt.

![OTA-Aktualisierungsablauf](/docs/rockchip-linux-recovery/assets/en-p007-figure-01.png)

### 1.4 Werkseinstellungen wiederherstellen

Beschreibbare Einstellungen liegen in userdata. Die Werksfirmware enthält Standardwerte; während der Nutzung werden Konfigurationen erstellt oder geändert. Zum Löschen dieser Daten und Wiederherstellen der Werkseinstellungen update ohne Argumente oder mit factory/reset ausführen; das Gerät wechselt dafür zu recovery.

### 1.5 Hinweise

Nicht alle Partitionen müssen aktualisiert werden: Unnötige Einträge aus package-file entfernen, um update.img zu verkleinern. Enthält das Paket recovery.img, wird diese Partition vor dem Wechsel zu recovery im normalen System aktualisiert, damit ein Stromausfall während ihrer Aktualisierung nicht die übrigen Updates verhindert. misc sollte nicht enthalten sein: Die Aktualisierung ignoriert diese Partition und recovery löscht nach Erfolg ohnehin alle misc-Befehle und Parameter. Liegt update.img auf Flash in userdata, userdata.img NICHT in package-file aufnehmen: Dies kann das Dateisystem beschädigen und das Einhängen von oem/userdata verhindern. Bei SD-/USB-Updates kann userdata.img enthalten sein; anschließend wird userdata vergrößert bzw. angepasst.

## 2. Fehlersuche

### 2.1 Protokolle im recovery-Modus

Im Verzeichnis buildroot/output/rockchip_rkxxxx_recovery/target eine versteckte Datei anlegen:

```text
touch .rkdebug
```

Das recovery-Aktualisierungsprotokoll wird über die serielle Schnittstelle ausgegeben:

![recovery-Protokolle aktivieren](/docs/rockchip-linux-recovery/assets/en-p009-figure-01.png)

Alternativ nach erfolgreicher Aktualisierung die Protokolldatei unter userdata/recovery auf dem Gerät lesen. Der Quelltext schreibt Log, der Befehl log; Groß-/Kleinschreibung beachten.

```text
cat userdata/recovery/log
```

### 2.2 Geräte mit und ohne Bildschirm

Wenn recovery fehlschlägt und Folgendes ausgibt:

```text
failed to read font: res=-1, fall back to the compiled-in font
cannot find/open a drm device: No such file or directory
```

Die Meldung bedeutet, dass kein DRM-Gerät gefunden oder geöffnet werden kann. Bei Geräten mit Bildschirm diesen anschließen; Geräte ohne Bildschirm wie folgt konfigurieren. Dieser Quellabschnitt nennt bildschirmlose Geräte als SDK-Standard; der Widerspruch zur FAQ wird unten erläutert.

```text
cd Path_to_SDK/buildroot/package/rockchip/recovery

vim recovery.mk
```

recovery.mk unter buildroot/package/rockchip/recovery wie abgebildet öffnen.

![Kompilierung ohne Bildschirm](/docs/rockchip-linux-recovery/assets/en-p010-figure-01.png)

Bei BR2_PACKAGE_RECOVERY_NO_UI wird RecoveryNoUi auf true gesetzt; andernfalls werden Anzeigebibliotheken eingebunden.

```text
ifeq ($(BR2_PACKAGE_RECOVERY_NO_UI),y)
TARGET_MAKE_ENV += RecoveryNoUi=true
else
RECOVERY_BUILD_OPTS += -lz -lpng -ldrm
RECOVERY_DEPENDENCIES += libzlib libpng libdrm
endif
```

Für Geräte ohne Bildschirm BR2_PACKAGE_RECOVERY_NO_UI in der recovery-Konfiguration aktivieren. Anschließend bauen:

1. source envsetup.sh rockchip_xxxx_recovery; xxxx ist die konkrete Plattform.

2. In make menuconfig No UI for recovery aktivieren.

3. make recovery-dirclean &amp;&amp; make recovery ausführen.

4. ./build.sh recovery ausführen.

5. ./mkimage.sh ausführen, wie in diesem Quellabschnitt angegeben.

6. rockdev/recovery.img flashen.

#### 2.2.1 Drehung und Darstellung bei Geräten mit Bildschirm

Zum Drehen der recovery-Aktualisierungsoberfläche entsprechend der Displayausrichtung wie folgt vorgehen.

1. recovery-Quellcode aktualisieren.

2. In minui/graphics.c den Parameter des aus gr_init aufgerufenen gr_rotate ändern. ROTATION_NONE: keine Drehung; ROTATION_RIGHT: 90° im Uhrzeigersinn; ROTATION_DOWN: 180°; ROTATION_LEFT: 270°.

3. recovery neu bauen, Partitionsabbild erstellen und flashen. Für die sichtbare Helligkeit nennt die Quelle den letzten gr_color-Parameter alpha: 255 vollständig deckend, 0 vollständig transparent. Dies ist Transparenz, keine Hardware-Hintergrundbeleuchtung. Hintergrundbilder unter external/recovery/res/images bei unveränderten Dateinamen ersetzen.

### 2.3 Aktualisierung unter Debian und Ubuntu

Dasselbe recovery-OTA-Verfahren funktioniert unter Debian/Ubuntu. Recovery muss Partitionsknoten erkennen und passende Abbilder schreiben. Buildroot erzeugt universelle by-name-Aliase über udev; fehlen diese unter Debian/Ubuntu, kann recovery scheitern. buildroot/output/rockchip_rkxxxx/target/lib/udev/rules.d/61-partition-init.rules oder buildroot/output/rockchip_rkxxxx_recovery/target/lib/udev/rules.d/61-partition-init.rules in einen passenden Pfad wie rootfs/overlay-debug/lib/udev/rules.d/ kopieren. rkxxxx steht etwa für RK3308, RK3328, RK3399 oder RK3326. Nach dem Start sollen für /dev/mmcblk0p0, /dev/mmcblk0p1, /dev/mmcblk0p2, /dev/mmcblk0p3 usw. Namen wie /dev/block/by-name/uboot, /dev/block/by-name/misc, /dev/block/by-name/boot und /dev/block/by-name/rootfs erscheinen; dies sind Beispiele, keine allgemeine Nummernzuordnung. Falls weiterhin folgende Knoten erscheinen:

```text
root@linaro-alip :~# ls /dev/block/
179:0 179:3 179:5 179:7 179:96 7:0 7:3 7:6
179:1 179:32 179:6 179:8 1:0 7:1 7:4 7:7
179:2 179:4 179:64 179:9 254:0 7:2 7:5
```

61-partition-init.rules versuchsweise unter /etc/udev/rules.d/ oder /lib/udev/rules.d/ des Debian-/Ubuntu-Systems ablegen.

## 3. Aktualisierung über eine bootfähige SD-Karte

Dieser Abschnitt beschreibt die Erstellung einer bootfähigen SD-Karte und die Aktualisierung eines noch unprogrammierten Chips. Das Werkzeug unter tools\windows\SDDiskTool im Projektverzeichnis verwenden.

![SD-Aktualisierungskarte erstellen](/docs/rockchip-linux-recovery/assets/en-p012-figure-01.png)

Das vorbereitete update.img auswählen und die Erstellung starten; bei Erfolg erscheint eine Meldung. Im SD-Hauptverzeichnis liegen zwei Dateien; update.img wird in sdupdate.img umbenannt. Karte einsetzen und das Gerät erneut einschalten. Das folgende Protokoll zeigt einen erfolgreichen SD-Start.

```text
U-Boot 2017.09-g1bee468 (Oct 11 2018 - 16:53:06 +0800) V1.000
Model: USM-110 a102-1
Board:Advantech usm110_rk3288 Board,HW version:0
DRAM: 2 GiB
Relocation Offset is: 7ff5a000
PMIC: RK808
vdd_arm 1100000 uV
vdd_gpu 1100000 uV
vcc_io 3300000 uV
regulator(LDO_REG2) init 3300000 uV
regulator(LDO_REG3) init 1100000 uV
regulator(LDO_REG4) init 1800000 uV
regulator(LDO_REG5) init 3300000 uV
```

```text
regulator(LDO_REG6) init 1100000 uV
regulator(LDO_REG7) init 1800000 uV
regulator(LDO_REG8) init 1800000 uV
MMC: dwmmc@ff0c0000: 1, dwmmc@ff0f0000: 0
SF: Detected w25q32bv with page size 256 Bytes, erase size 4 KiB, total 4 MiB
*** Warning - bad CRC, using default environment
In: serial
Out: serial
Err: serial
switch to partitions #0, OK
mmc1 is current device
do_rkimg_test found IDB in SDcard
Boot from SDcard
enter Recovery mode!
SF: Detected w25q32bv with page size 256 Bytes, erase size 4 KiB, total 4 MiB
Skipped ethaddr assignment due to invalid,using default!
Net: No ethernet found.
Hit any key to stop autoboot: 0
ANDROID: reboot reason: "recovery"
FDT load addr 0x10f00000 size 263 KiB
Booting kernel at 0x3575c70 with fdt at 42cf470...
```

Die folgende serielle Ausgabe zeigt, dass das von SD gestartete recovery das Gerät mit unprogrammiertem Chip aktualisiert.

```text
firmware update will from SDCARD.
is_sdcard_update out
sdupdate_package = /mnt/sdcard/sdupdate.img
Command: "/usr/bin/recovery"
sdboot update will update from /mnt/sdcard/sdupdate.img
start with main.
```

## 4. Anhang

### 4.1 Die Partition misc

misc sind die ersten vier Buchstaben von miscellaneous („Verschiedenes“). Die Partition stammt aus Android und dient unter Linux meist Systemupdates oder dem Zurücksetzen auf Werkseinstellungen. Lesen/Schreiben erfolgt in folgenden Fällen.

1. U-Boot: Beim Einschalten startet zunächst U-Boot und liest misc. Das Feld command bestimmt normalen Start oder recovery: boot-recovery startet recovery, ein leeres Feld das normale System.

2. Recovery: Im recovery-Modus wird der recovery-Bereich von misc gelesen, der Aktualisierung, Löschen von Benutzerdaten und andere Aktionen bestimmt. Die Struktur von misc ist unten dargestellt.

![Aufbau von misc BootLoader Msg](/docs/rockchip-linux-recovery/assets/en-p014-figure-01.png)

Beispiel RK3308: misc.img in WinHex oder UltraEdit binär öffnen. Die Struktur BootLoader Msg beginnt bei Offset 16K (16384 Byte) ab Dateianfang.

![Binäres misc-Offset-Beispiel](/docs/rockchip-linux-recovery/assets/en-p014-figure-02.png)

Unterstützte recovery-Befehle stehen in OPTIONS in external/recovery/recovery.c.

#### 4.1.1 misc.img auswählen

misc.img-Vorlagen liegen unter device/rockchip/rockimg im SDK. Die Konfiguration bestimmt, welche Datei bei der Firmware-Erstellung kopiert wird.

```text
.
├ ── blank-misc.img     #blank misc partition file
├── pcba_small_misc.img #infrequently used
├── pcba_whole_misc.img #infrequently used
└── wipe_all-misc.img   #format the misc partition file used by the user
partition
```

Die üblichen Varianten sind blank-misc.img und wipe_all-misc.img. Zur Auswahl BoardConfig.mk des jeweiligen Chips öffnen.

```text
cd device/rockchip/rkxxxx
vim BoardConfig.mk
```

![misc in BoardConfig.mk wählen](/docs/rockchip-linux-recovery/assets/en-p015-figure-01.png)

Die Abbildung zeigt standardmäßig wipe_all-misc.img. Nach dem Flashen werden Benutzerpartition /userdata oder /data und die angepasste Partition /oem formatiert. Für den direkten normalen Start misc image in BoardConfig.mk auf blank-misc.img setzen und die Firmware neu erstellen.

### 4.2 Recovery in verschiedenen Situationen

#### 4.2.1 Erstes Einschalten

Für ein Gerät mit geflashtem misc.img und recovery.img zeigt die Quelle folgendes Protokoll des ersten Starts. Die konkrete Aktion hängt vom Befehl in misc ab.

```text
Boot command: boot-recovery
Got arguments from boot message
Command: "recovery" "--wipe_all"
format '/dev/block/by-name/userdata' to ext2 filesystem
executing '/sbin/mke2fs'
executed '/sbin/mke2fs' done
executed '/sbin/mke2fs' return 0
executing '/sbin/e2fsck'
e2fsck 1.43.9 (8-Feb-2018)
Pass 1: Checking inodes, blocks, and sizes
Pass 2: Checking directory structure
Pass 3: Checking directory connectivity
Pass 4: Checking reference counts
Pass 5: Checking group summary information
/dev/block/by-name/userdata: 11/2304 files (0.0% non-contiguous), 82/2299 blocks
executed '/sbin/e2fsck' done
executed '/sbin/e2fsck' return 0
executing '/usr/sbin/e2fsck'
e2fsck 1.43.9 (8-Feb-2018)
Pass 1: Checking inodes, blocks, and sizes
Pass 2: Checking directory structure
```

```text
Pass 3: Checking directory connectivity
Pass 4: Checking reference counts
Pass 5: Checking group summary information
/dev/block/by-name/oem: 18/2448 files (0.0% non-contiguous), 513/16384 blocks
executed '/usr/sbin/e2fsck' done
executed '/usr/sbin/e2fsck' return 1
executing '/usr/sbin/resize2fs'
resize2fs 1.43.9 (8-Feb-2018)
The filesystem is already 16384 (1k) blocks long. Nothing to do!
executed '/usr/sbin/resize2fs' done
executed '/usr/sbin/resize2fs' return 0
```

#### 4.2.2 Werkseinstellungen wiederherstellen

update in der Befehlszeile starten: Das Gerät wechselt zu recovery, formatiert und kehrt anschließend automatisch ins normale System zurück.

```text
update (or update reset)
```

Serielle Ausgabe:

```text
I:Boot command: boot-recovery
I:Got arguments from boot message
Command: "recovery" "--wipe_data"
format '/dev/block/by-name/userdata' to ext2 filesystem
executing '/sbin/mke2fs'
[ 4.692437] vendor storage:20160801 ret = -1
[ 6.030842] phy phy-ff008000.syscon:usb2-phy@100.0: charger =
USB_SDP_CHARGER
[ 10.891460] random: nonblocking pool is initialized
```

#### 4.2.3 Aktualisierung

update ota /xxx/update.img versetzt das Gerät in recovery und startet die Aktualisierung.

```text
update ota /udisk/update.img
```

Beispielprotokoll einer Aktualisierung vom USB-Datenträger:

```text
I:Boot command: boot-recovery
I:Got arguments from boot message
Command: "recovery" "--update_package=/udisk/update.img"
。。。。
librkupdate_ui_print = parameter writing....
########### RKA_Gpt_Download #########
librkupdate_###### Download trust ... #######
```

### 4.3 Häufige Fragen

#### 4.3.1 “cannot find or open a drm device”

Auf anderen Plattformen als RK3308 kann nach dem Wechsel zu recovery Folgendes erscheinen:

```text
we are in recovery, skip init oem/userdata
start debug recovery...
Starting recovery on Fri Jan 18 09:19:51 2013
failed to read font: res=-1, fall back to the compiled-in font
Starting network: cannot find/open a drm device: No such file or directory
```

Ein unterstütztes Display oder HDMI-Gerät anschließen. Laut Protokoll kann recovery kein DRM-Gerät finden oder öffnen. Dieser Quellabschnitt nennt UI als Standard auf Plattformen außer RK3308; ein nicht zu öffnendes Display führt zum Fehler. Für bildschirmlosen Betrieb etwa auf RK3399 oder RK3288 wie folgt vorgehen.

1. source envsetup.sh ausführen.

2. Die Nummer der recovery-Konfiguration der aktuellen Plattform eingeben.

3. In make menuconfig No UI for recovery aktivieren.

```text
> Target packages  --->
[*] Rockchip BSP packages  --->
[*]   Rockchip recovery for linux
[*]   No UI for recovery
[ ]   Linux AB bool control
Linux A/B bringup features. (successful_boot)  --->
choice the update bin of recovery. (rkupdate)  --->
-*-   recovery bin
[ ]   updateEngine bin
```

Dann kompiliert external/recovery/Makefile keinen Anzeigecode.

![Von RecoveryNoUi gesteuerte Objektdateien](/docs/rockchip-linux-recovery/assets/en-p018-figure-01.png)

4. recovery-Paket neu bauen.

```text
make recovery-dirclean && make recovery
```

5. recovery-Firmware neu erzeugen.

```text
./build.sh recovery
```

6. Firmware erzeugen.

```text
./mkfirmware.sh
```

#### 4.3.2 Standardbefehl in misc ändern

Zum Packen anderer recovery-Befehle in misc oder für ein leeres misc mkfirmware.sh im Projekt-Hauptverzeichnis wie abgebildet ändern.

![misc in mkfirmware.sh wählen](/docs/rockchip-linux-recovery/assets/en-p019-figure-01.png)

#### 4.3.3 vfat-Dateisystem für userdata

Das SDK verwendet standardmäßig ext2/ext4 für userdata. Für vfat32 nennt die Quelle folgende Änderungen.

1. board/rockchip/rkxxxx/fs-overlay-recovery/etc/fstab ändern. Vorher:

```text
/dev/block/by-name/userdata /userdata ext2 defaults0
```

Nachher:

```text
/dev/block/by-name/userdata /userdata vfat defaults0 0
```

2. In configs/rockchip_rkxxxx_release_defconfig ergänzen:

```text
BR2_PACKAGE_DOSFSTOOLS=y
BR2_PACKAGE_DOSFSTOOLS_FATLABEL=y
BR2_PACKAGE_DOSFSTOOLS_FSCK_FAT=y
BR2_PACKAGE_DOSFSTOOLS_MKFS_FAT=y
```

3. package/rockchip/usbdevice/S50usbdevice ändern.

```text
start)
mkdir /dev/usb-ffs -m 0770
mkdir /dev/usb-ffs/adb -m 0770
mount -t configfs none /sys/kernel/config
mkdir /sys/kernel/config/usb_gadget/rockchip -m 0770
echo 0x2207 > /sys/kernel/config/usb_gadget/rockchip/idVendor
echo "ums_adb" >
/sys/kernel/config/usb_gadget/rockchip/configs/b.1/strings/0x409/configuration
mount -t functionfs adb /dev/usb-ffs/adb
mount -t vfat /dev/disk/by-partlabel/userdata /media/usb0
export service_adb_tcp_port=5555
adbd &
sleep 1
```

4. Sicherstellen, dass 0001-common-mk-userdata-Fix-wrong-FS_TYPE-check.patch angewandt wurde.

```text
case $FS_TYPE in
ext[2-4])
$COMMON_DIR/mke2img.sh $USERDATA_DIR $USERDATA_IMG
;;
fat|vfat)
SIZE=$(du -h -BM --max-depth=1 $USERDATA_DIR|awk '{print int($1)}')
# echo "create image size=${SIZE}M"
dd if=/dev/zero of=$USERDATA_IMG bs=1M count=$SIZE >/dev/null 2>&1
mkfs.vfat $USERDATA_IMG >/dev/null 2>&1
mcopy -i $USERDATA_IMG $USERDATA_DIR/* ::/ >/dev/null 2>&1
;;
*)
echo "file system: $FS_TYPE not support."
exit 1
;;
Esac
```

5. common/mk-userdata.sh ändern.

```text
SIZE=$(du -h -BM --max-depth=1 $USERDATA_DIR|awk '{print int($1)}')
# echo "create image size=${SIZE}M"
dd if=/dev/zero of=$USERDATA_IMG bs=1M count=$SIZE >/dev/null 2>&1
mkfs.vfat -F 32 $USERDATA_IMG >/dev/null 2>&1
mcopy -i $USERDATA_IMG $USERDATA_DIR/* ::/ >/dev/null 2>&1
;;
*)
```

6. In rk3308/BoardConfig.mk export RK_USERDATA_FS_TYPE=ext2 durch folgende Einstellung ersetzen.

```text
# Set userdata partition type, including ext2, fat
export RK_USERDATA_FS_TYPE=vfat
```

#### 4.3.4 userdata oder data nicht formatieren

Ist wipe_all-misc.img in BoardConfig.mk gewählt, sollen userdata/oem aber erhalten bleiben, empfiehlt die Quelle eine Änderung von main in external/recovery/reocvery.c (Pfadfehler; richtig recovery.c). Chinesisch verlangt Auskommentieren, Englisch Entfernen des rot markierten Codes. Danach recovery neu bauen und flashen. Diese Änderung des Rücksetzverhaltens muss projektspezifisch geprüft werden.

![wipe_all-Zweig](/docs/rockchip-linux-recovery/assets/en-p021-figure-01.png)

#### 4.3.5 Probleme bei SD-Aktualisierung

SD-Karten dienen der Erstprogrammierung oder Flash-Aktualisierung. Kapitel 3 beschreibt den normalen recovery-Start von SD. Scheitert das Update ohne serielle Ausgabe, können SD-Pins mit Debug-UART2 multiplexiert sein. Folgendes Beispiel gilt für RK1808; RK3288, RK3399 und RK3399PRO sind unter Beachtung der Plattform ähnlich zu behandeln.

1. Im Schaltplan prüfen, ob SD-GPIOs mit UART2 multiplexiert sind. Falls ja, in der U-Boot-dtsi SDMMC aktivieren und den standardmäßigen Debug-UART2 deaktivieren. Andernfalls SD-Versorgung und Initialisierung prüfen.

2. Den Loader-UART in SDK/rkbin/tools/ddrbin_param.txt umstellen. Bei Drahtverbindung zu uart1 m0 uart id=1 setzen; für uart1 m1 uart id=1 und uart iomux=1.

3. ddr.bin mit folgendem Befehl neu erzeugen.

```text
cd SDK/rkbin/tools
rkbin/tools$./ddrbin_tool ddrbin_param.txt
../bin/rk1x/rk1808_ddr_933MHz_v1.04.bin
```

rk1808_ddr_933MHz_v1.04.bin muss dem tatsächlichen Dateinamen in SDK/rkbin/bin/rk1x/ entsprechen. Das Plattformverzeichnis richtet sich nach den ersten zwei Ziffern der Chipnummer. Parameter von ddrbin_tool stehen in SDK/rkbin/tools/ddrbin_tool_user_guide.txt.

4. Kernel-DTS ändern. Für einen anderen Debug-UART genügt ddr.bin nicht; auch der Kernel muss angepasst werden.

![UART-Konfiguration des FIQ-Debuggers](/docs/rockchip-linux-recovery/assets/en-p022-figure-01.png)

5. cmdline in kernel/arch/arm64/boot/dts/rockchip/rk1808-evb-v10.dts ändern.

```text
chosen {
    bootargs = "earlycon=uart8250,mmio32,0xff550000 console=ttyFIQ0
root=PARTUUID=614e0000-0000 rootfstype=ext4 rootwait swiotlb=1 kpti=0
snd_aloop.index=7";
};
```

0xff550000 an den gewählten UART anpassen. Adressen stehen in arch/arm64/boot/dts/rockchip/rk1808.dtsi bzw. im passenden Gerätebaum anderer Plattformen. RK1808: uart2 — serial@ff550000, uart1 — serial@ff540000.

![RK1808-UART-Registeradressen](/docs/rockchip-linux-recovery/assets/en-p022-figure-02.png)

6. Firmware bauen. U-Boot: ./build.sh uboot oder im Verzeichnis u-boot ./make.sh rk1808. Die erzeugten Dateien liegen unter u-boot:

```text
u-boot/
├── rk1808_loader_v1.03.104.bin
├── trust.img
└── uboot.img
```

Kernel: ./build.sh kernel. Recovery: ./build.sh recovery. Danach ./build.sh updateimg. Falsche Leerzeichen nach dem Punkt in Englisch wurden anhand Chinesisch korrigiert.

7. Nach korrektem Flashen der Firmware:

1. update.img packen und mit SDDiskTool_v1.62 oder neuer auf die SD-Karte schreiben.

2. Platine ausschalten, SD einsetzen und einschalten. Das Protokoll sollte über uart1 oder den anderen gewählten und verdrahteten UART erscheinen; damit das SD-Aktualisierungsproblem analysieren.

## Quellenabgleich und Grenzen

- Beide Quellen V1.2.1. Chinesischer Inhalt beginnt auf Seite 4, englischer auf Seite 5; vier Kapitel, fünf FAQ und technische Abbildungen bleiben erhalten. Chinesisch präzisiert den internen Aufruf von rkupdate aus recovery sowie die üblichen Vorlagen blank-misc.img/wipe_all-misc.img; diese Angaben ergänzen Englisch.
- In Englisch fehlt make bei make recovery-dirclean && recovery; Chinesisch lautet make recovery-dirclean && make recovery. Am Ende wird “. /build.sh” anhand Chinesisch als ./build.sh geklärt. Originalcode bleibt mit Hinweisen erhalten. Abschnitt 2.2 nennt ./mkimage.sh, andere ./mkfirmware.sh; keine Austauschbarkeit annehmen, SDK prüfen.
- Abschnitt 2.2 nennt bildschirmlosen Betrieb als Standard, FAQ 4.3.1 dagegen UI für alle außer RK3308. Beide Quellen enthalten diesen Widerspruch. BR2_PACKAGE_RECOVERY_NO_UI und Makefile prüfen. gr_color alpha ist Transparenz (255 deckend, 0 transparent), keine Hardware-Hintergrundbeleuchtung.
- external/recovery/reocvery.c ist ein Tippfehler für recovery.c. Chinesisch verlangt Auskommentieren des roten Bereichs, Englisch Entfernen; dies ändert wipe_all, nicht zwingend sämtliche Löschpfade. Die Abbildung ruft erase_volume("/userdata") und resize_volume("/oem") auf; die Aussage über Formatierung beider Partitionen an der Implementierung prüfen.
- Beide fstab-Beispiele verbinden defaults0 / defaults0 0; Feldabstände prüfen. Englisch beendet einen case-Ausschnitt mit Esac statt esac; das Original bleibt mit Warnung erhalten. Log und log unterscheiden sich in der Schreibweise. update (or update reset) nennt Alternativen und ist kein wörtlicher Shell-Befehl mit Klammern.
- misc-Diagramm: insgesamt 1088 Byte — Command 32, Status 32, Recovery 768, Reserved 256; das RK3308-Beispiel beginnt bei Byte 16384. mis und wip_all sind Bild-Tippfehler; misc, wipe_all und OPTIONS anhand der Implementierung prüfen. Im englischen Ablauf fehlt der Zweig ohne recovery-Abbild; der Text macht dessen Update ausdrücklich vom Paketinhalt abhängig.
- Bei SD/UART U-Boot-Pinmux, Loader-UART-ID/IOMUX, Kernel-FIQ-Debugger rockchip,serial-id und cmdline-Adresse gemeinsam abstimmen. serial-id 2 im RK1808-Bild muss zur Verdrahtung passen; UART2=0xff550000, UART1=0xff540000. Dies sind Quellplattform-Beispiele, keine allgemeinen ArmSoM-Adressen.

{% endraw %}
