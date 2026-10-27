---
title: "Leitfaden für Rockchip Linux updateEngine-Updates"
description: "Leitfaden für Rockchip Linux updateEngine-Updates — V1.2.0"
excerpt: "Leitfaden für Rockchip Linux updateEngine-Updates"
translation_key: "202-rockchip-linux-upgrade"
slug: "202-rockchip-linux-upgrade"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "system"
products: []
tags: [ArmSoM, Rockchip, Linux, Recovery, OTA, updateEngine]
---

{% raw %}

# Leitfaden für Rockchip Linux updateEngine-Updates

Grundlage sind Chinesisch und Englisch RK-KF-YF-348 V1.2.0 vom 2023-03-06; Chinesisch dient als Basis. Quellplattformen: RK3308/Linux 4.4 und RV1126/RV1109/Linux 4.19. Acht Kapitel, Partitions-/Struktur-/Parametertabellen, Code und Ablaufbilder bleiben erhalten. Für ArmSoM Platine, SDK, Partitionen und Startkette prüfen. Keine Updates oder Hardwaretests wurden ausgeführt. Flashen, SD-Erstellung und wipe_userdata überschreiben oder löschen Daten: zuvor sichern und Ziele prüfen. Beschriebene Stromausfallwiederherstellung und A/B-Rückfall garantieren keine Schadensfreiheit beliebiger Geräte.

## 1. Überblick und Quellcode

### 1.1 Überblick

Rockchip Linux unterstützt zwei Startmodi: recovery und Linux A/B.

1. Recovery: Eine separate recovery-Partition dient zur Aktualisierung.

2. Linux A/B: Zwei Firmware-Stände können umgeschaltet werden. Den Modus entsprechend Anforderungen sowie Vor- und Nachteilen wählen.

### 1.2 Quellcode

Für Rockchip Linux existieren zwei Update-Implementierungen.

| Implementierung | Quellen | Recovery | Linux A/B | Beschreibung |
| --- | --- | --- | --- | --- |
| updateEngine | external/recovery/update_engine; external/recovery | Ja | Ja | Standard für RV1126/RV1109 |
| rkupdate | external/rkupdate | Ja | Nein | Andere Plattformen, hier nicht beschrieben |

## 2. Recovery-Modus

### 2.1 Überblick

Eine zusätzliche recovery-Partition aus kernel+resource+ramdisk dient der Aktualisierung. U-Boot liest misc-Felder und wählt normales System oder recovery. Dessen Unabhängigkeit ermöglicht das Fortsetzen unterbrochener Updates, etwa nach Stromausfall. Vorteil:

1. Die Integrität des Updates wird gewährleistet. Nachteile:

1. Eine zusätzliche Partition ausschließlich für Updates ist nötig.

2. Ein Neustart nach recovery ist erforderlich; direkte Aktualisierung im normalen System ist nicht möglich. Partitionen:

| Partition | Abbild | Beschreibung |
| --- | --- | --- |
| loader | MiniLoaderAll.bin | Loader der ersten Stufe |
| u-boot | uboot.img | Loader der zweiten Stufe |
| trust | trust.img | Sichere Umgebung, etwa OP-TEE/ATF; einige Plattformen vereinen trust und uboot |
| misc | misc.img | Startparameter |
| recovery | recovery.img | Root-Dateisystem aus kernel+dtb+ramdisk |
| boot | boot.img | kernel+dtb |
| rootfs | rootfs.img | Root-Dateisystem, schreibgeschützt |
| oem | oem.img | Herstellerdaten, les-/schreibbar |
| userdata | userdata.img | Benutzerdaten, les-/schreibbar |

### 2.2 Konfiguration und Kompilierung

Buildroot: In der recovery-Konfiguration (make menuconfig) wählen:

```text
BR2_PACKAGE_RECOVERY=y  #turn on upgrade related functions
BR2_PACKAGE_RECOVERY_USE_UPDATEENGINE=y #use the new upgrade program, if not
configured, the original upgrade process will be used by default.
BR2_PACKAGE_RECOVERY_RECOVERYBIN=y  #turn on recovery bin file
BR2_PACKAGE_RECOVERY_UPDATEENGINEBIN=y #compile the new upgrade program
BR2_PACKAGE_RECOVERY_NO_UI=y # disable UI
```

Buildroot: In der rootfs-Konfiguration (make menuconfig) wählen:

```text
BR2_PACKAGE_RECOVERY=y #turn on upgrade related functions
BR2_PACKAGE_RECOVERY_USE_UPDATEENGINE=y #use the new upgrade program
BR2_PACKAGE_RECOVERY_UPDATEENGINEBIN=y  #compile the new upgrade program
BR2_PACKAGE_RECOVERY_NO_UI=y # disable UI
```

Mit und ohne Anzeige: Laut Quelle nutzt nur RK3308 recovery ohne Anzeige. Für andere Chips Folgendes in buildroot/package/rockchip/recovery/recovery.mk konfigurieren; der englische Pfad endet bei recovery, die Endung stammt aus Chinesisch.

```text
TARGET_MAKE_ENV += RecoveryNoUi=true
```

Laut Quelle aktiviert das SDK diese Einstellungen bereits. Der Quellcode liegt unter external/recovery/. Nach Änderungen so bauen:

```text
# Step1: run the following command:
source envsetup.sh
# Step2: choose the rootfs configuration of a platform,and then run the following
command:
make recovery-dirclean
source envsetup.sh
# Step3: choose the recovery configuration of a platform, and then run the
following command:
make recovery-dirclean
./build.sh
# Step4: flashing the firmware again.
```

Bei einem neueren SDK kann folgender Aufruf verwendet werden:

```text
./build.sh external/recovery
./build.sh
# flashing the firmware again.
```

### 2.3 OTA-Aktualisierung

Lokale und Netzwerkupdates mit Partitionsauswahl werden unterstützt. Befehle im normalen System ausführen. Netzwerkupdate:

```text
# updateEngine --misc=update --image_url=firmware address --partition=0x3FFC00 --
version_url=version file address --savepath=/userdata/update.img --reboot
updateEngine --image_url=http://172.16.21.110:8080/recovery/update.img \
    --misc=update --savepath=/userdata/update.img --reboot &
```

Lokales Update:

```text
updateEngine --image_url=/userdata/update.img --misc=update \
    --savepath=/userdata/update.img --reboot &
```

Ablauf:

1. Firmware-Versionen vergleichen (--version_url).

2. Firmware herunterladen (--image_url) und lokal speichern (--savepath).

3. recovery-Partition aktualisieren.

4. Neu starten (--reboot).

5. recovery starten und gewählte Partitionen aktualisieren (--partition).

6. Nach Erfolg das normale System starten. Optionale Parameter:

1. --version_url: entfernte oder lokale Adresse. Ohne diesen Parameter kein Versionsvergleich.

2. --savepath: Speicherpfad der Firmware, Standard /tmp/update.img; empfohlen /userdata/update.img.

3. --partition: Partitionsmaske, empfohlen 0x3FFC00. OTA unterstützt keine Aktualisierung von parameter und loader. Einzelheiten im Parameterabschnitt.

4. --reboot: Nach Aktualisierung von recovery dorthin neu starten.

### 2.4 Protokolle anzeigen

1. Serielle Schnittstelle: Unter buildroot/output/rockchip_***/target ausführen:

```text
touch .rkdebug
```

Diese versteckte Datei aktiviert die serielle Ausgabe des recovery-Protokolls.

2. Nach dem Update userdata/recovery/Log auf dem Gerät lesen.

```text
cat userdata/recovery/Log
```

## 3. Differenzielle Aktualisierung

Linux-SDK-Werkzeuge unter tools/linux/Linux_Diff_Firmware/ erstellen Differenzpakete. Unterstützt werden uboot/trust/kernel und rootfs mit squashfs. Nicht unterstützt: beschreibbare ext2/ext3/ext4-Dateisysteme, Partitionen auf MTD (etwa UBI/NAND), verschlüsselte Partitionen und A/B-OTA.

### 3.1 Abhängigkeiten und Kompilierung

Erstellung und Anwendung der Differenzpakete erfordern Änderungen in drei Projekten:

```text
.
├── buildroot
│   └── 0001-package-recovery-add-bzip2-dependency.
│   └── 0002-bsdiff-use-mmap-to-save-memory-when-apply-patch.patch
├── external
│   └── recovery
│       └── 0001-update_engine-add-differ-ota-funcion.patch
│       └── 0002-update_engine-recover-from-unexpected-reboot-when-do.patch
└── tools
    └── 0001-ota-add-diff-firmware-script.patch
```

Sicherstellen, dass diese Änderungen vorhanden sind. Andernfalls SDK aktualisieren oder Patches bei Rockchip anfordern. Auf dem PC werden bsdiff und md5sum benötigt. bsdiff installieren:

```text
sudo apt install bsdiff
```

### 3.2 Anforderungen an Partitionsgrößen

Die Quelle nennt keine von der Patchgröße abhängige DDR-Anforderung. Freier Speicher muss update_diff.img plus das vollständige neue rootfs.img aufnehmen. Liegt das Paket in /userdata, muss dort zusätzlich Platz für das neue rootfs.img bleiben.

### 3.3 Differenzpaket erstellen

Alte und neue OTA-Firmware entpacken, Unterschiede bilden und das Ergebnis verpacken.

![Leitfaden für Rockchip Linux updateEngine-Updates — diff](/docs/rockchip-linux-upgrade/assets/en-differential-flow.png)

Differenzablauf: altes und neues update.img entpacken, Unterschiede von uboot/trust/boot/rootfs bilden und diese zusammen mit nicht differenzierten Partitionen des neuen Abbilds zu diff_img packen.

Wichtig: Die chinesische Basis verlangt als neues Image eine OTA image mit ausschließlich zu aktualisierenden Partitionen, kein vollständiges Erst-Flash-Abbild. Als alte Firmware wird ein vollständiges update.img empfohlen, mindestens mit den zu aktualisierenden Partitionen. Die alte Firmware muss exakt der auf dem Zielgerät installierten entsprechen. Beispiel:

```text
cd tools/linux/Linux_Diff_Firmware/
./mk-diff-ota.sh update_old.img update_new.img update_diff.img
```

Das erzeugte update_diff.img ersetzt das neue update.img beim OTA auf dem Gerät. updateEngine verwenden: rkupdate unterstützt Differenzpakete noch nicht.

## 4. Linux-A/B-Modus

### 4.1 Überblick

Zwei unabhängige System-Firmwares liegen im Flash. Das System kann aus einem Slot starten und bei dessen Fehler den anderen verwenden. Aktualisierung erfolgt direkt im normalen System ohne besonderen Updatemodus; ein Neustart lädt danach das neue System. Vorteile der zwei Slots:

1. Aktualisierung direkt im laufenden System ohne Neustart in einen Updatemodus.

2. Bei Updatefehlern kann zur bisherigen Version zurückgekehrt werden, um Ausfälle zu vermeiden.

3. Bei versehentlicher Beschädigung des aktuellen Systems wird auf den anderen Slot gewechselt. Nachteil:

1. Zwei Slots benötigen mehr Flash. Anschließend behauptet die Quelle, miniloader, trust und uboot besäßen bereits Sicherungskopien und nur boot/system seien doppelt. Die folgende Tabelle enthält jedoch uboot_a/uboot_b; diesen Widerspruch am konkreten SDK prüfen.

| Partition | Abbild | Beschreibung |
| --- | --- | --- |
| loader | Miniloader.bin | Primärer Loader, 4 Kopien auf dem Gerät |
| uboot_a | uboot.img | Sekundärer Loader, 2 Kopien; Anzahl in u-boot/make.sh änderbar |
| uboot_b | uboot.img | Sicherungskopie von uboot_a |
| trust | trust.img | Sicherheit, 2 Kopien; Anzahl in u-boot/make.sh änderbar; teils sind trust und uboot vereint |
| misc | misc.img | Startparameter |
| boot_a | boot.img | kernel+dtb, startet system_a |
| boot_b | boot.img | kernel+dtb, startet system_b |
| system_a | rootfs.img | Root-Dateisystem |
| system_b | rootfs.img | Root-Dateisystem |
| oem | oem.img | Herstellerdaten, les-/schreibbar, ohne Sicherungskopie |
| userdata | userdata.img | Benutzerdaten, les-/schreibbar, ohne Sicherungskopie |

### 4.2 Startablauf

#### 4.2.1 Datenformat und Speicherung

Die Daten liegen bei Offset 2K in misc. Struktur AvbABSlotData enthält Daten für slot_a und slot_b.

| Feld | Bedeutung |
| --- | --- |
| unsigned char priority | Priorität 0–15: 0 ohne automatischen Start, 15 höchste |
| unsigned char tries_remaining | Verbleibende Startversuche, maximal 7; änderbar |
| unsigned char successful_boot | Quelle: 0 nicht startfähig, 1 startfähig; siehe Erläuterung zum Ablauf |
| unsigned char is_update:1 | 0 Update fehlgeschlagen, 1 erfolgreich; übrige 7 Bit reserviert |

AvbABData enthält die Startinformationen von slot_a/slot_b.

| Feld | Bedeutung |
| --- | --- |
| unsigned char magic[AVB_AB_MAGIC_LEN] | Strukturkopf: \0AB0 |
| unsigned char version_major | Hauptversion |
| unsigned char version_minor | Nebenversion |
| unsigned char reserved1[2] | Reserviert |
| AvbABSlotData slots[2] | Startinformationen der Slots |
| unsigned char last_boot | Zuletzt erfolgreich gestarteter Slot: 0→slot_a, 1→slot_b |
| unsigned char reserved2[11] | Reserviert |
| unsigned char crc32 | CRC-Prüfung; Typ unsigned char aus der Quelle beibehalten |

#### 4.2.2 Zwei Startmodi

Die bootcontrol-Einstellung bestimmt successful_boot oder reset retry. Vergleich:

| Modus | Vorteil | Nachteil | Nach erfolgreichem A-Start | Beim B-Update aus A |
| --- | --- | --- | --- | --- |
| Successful boot | Nach erfolgreichem Start kein Rückfall auf die alte Version | Bei späteren Speicherdefekten kann das System endlos neu starten | tries_remaining=0 successful_boot=1 last_boot=0 | A:priority=14 B:priority=15 |
| Reset retry | Dauerhafte Wiederholungen können Speicherprobleme abfangen | Unkontrollierter Versionsrückfall möglich. Fehlbedienung kann Versuche verbrauchen und eine falsche Slotbewertung auslösen; Quelle schreibt „startfähig“, siehe Hinweis | tries_remaining=7 last_boot=0 | A:priority=14 B:priority=15 |

#### 4.2.3 Ablaufdiagramm des Starts

![Leitfaden für Rockchip Linux updateEngine-Updates — en 14](/docs/rockchip-linux-upgrade/assets/en-p014-figure-01.png)

### 4.3 Kompilierung konfigurieren

#### 4.3.1 U-Boot

Folgende Einstellungen zu defconfig hinzufügen; Beispiel RK3308 64-Bit: u-boot/configs/rk3308_defconfig.

```text
CONFIG_AVB_LIBAVB=y
CONFIG_AVB_LIBAVB_AB=y
CONFIG_AVB_LIBAVB_ATX=y
CONFIG_AVB_LIBAVB_USER=y
CONFIG_RK_AVB_LIBAVB_USER=y
CONFIG_ANDROID_AB=y
```

#### 4.3.2 Buildroot

```text
BR2_PACKAGE_RECOVERY=y  #enable recovery function
BR2_PACKAGE_RECOVERY_BOOTCONTROL=y  #enable the boot control script
BR2_PACKAGE_RECOVERY_RETRY=y
#The boot mode is retry mode. it is successful_boot mode by default when not
configured.
BR2_PACKAGE_RECOVERY_USE_UPDATEENGINE=y  #Use the new upgrade program
BR2_PACKAGE_RECOVERY_UPDATEENGINEBIN=y
BR2_PACKAGE_RECOVERY_NO_UI=y # disable UI
#compile the new upgrade program
```

Nach der Konfiguration unbedingt neu bauen:

```text
make recovery-dirclean
make recovery
./build.sh
```

Für neuere SDKs kann verwendet werden:

```text
./build.sh external/recovery
./build.sh
# flashing the firmware again.
```

#### 4.3.3 Partitionstabelle

In der entsprechenden BoardConfig.mk parameter setzen:

```text
#choose device/rockchip/rk3308/parameter-ab-64bit.txt file
# parameter for GPT table
export RK_PARAMETER=parameter-ab-64bit.txt
```

64-Bit: /device/rockchip/rk3308/parameter-ab-64bit.txt. 32-Bit: /device/rockchip/rk3308/parameter-ab-32bit.txt.

#### 4.3.4 Erzeugte Firmware-Abbilder

Passende Platinenkonfiguration wählen, etwa BoardConfig***-ab.mk. Für A/B-Updates über eine bootfähige SD-Karte setzen:

```text
# enable build update_sdcard.img
export RK_UPDATE_SDCARD_ENABLE_FOR_AB=true
```

Nach der Konfiguration ausführen:

```text
./build.sh
```

Folgende Abbilder werden erzeugt:

```text
tree rockdev/
rockdev/
├── boot.img
├── MiniLoaderAll.bin
├── misc.img
├── oem.img
├── parameter.txt
├── rootfs.img
├── uboot.img
├── update_ab.img
├── update_sdcard.img
├── update_ota.img
└── userdata.img
```

OTA: update_ota.img liegt unter rockdev und IMAGE. Der Text nennt boot.img und rootfs.img, das Beispiel enthält auch uboot/oem; der tatsächliche Inhalt wird durch die anpassbare Datei tools/linux/Linux_Pack_Firmware/rockdev/rv1126_rv1109-package-file-2-ota bestimmt.

```text
# NAME        Relative path
#
#HWDEF        HWDEF
package-file  package-file
bootloader    Image/MiniLoaderAll.bin
parameter     Image/parameter.txt
uboot_a       Image/uboot.img
boot_a        Image/boot.img
system_a      Image/rootfs.img
oem           Image/oem.img
```

Flashen: update_ab.img entsteht unter rockdev und IMAGE. Inhalt über tools/linux/Linux_Pack_Firmware/rockdev/rv1126_rv1109-package-file-2-ab festlegen:

```text
# NAME          Relative path
#
#HWDEF          HWDEF
package-file    package-file
bootloader      Image/MiniLoaderAll.bin
parameter       Image/parameter.txt
misc            Image/misc.img
uboot_a         Image/uboot.img
uboot_b         Image/uboot.img
boot_a          Image/boot.img
boot_b          Image/boot.img
system_a        Image/rootfs.img
system_b        Image/rootfs.img
oem             Image/oem.img
```

### 4.4 OTA-Aktualisierung

Netzwerkupdate:

```text
# updateEngine --update --image_url=firmware address --partition=0x3FFC00 --
version_url=version file address --savepath=save the firmware address --reboot
updateEngine --image_url=http://172.16.21.110:8080/linuxab/update_ota.img --
update --reboot
```

Lokales Update:

```text
# updateEngine --update --image_url=firmware address(update_ab.img or
update_ota.img) --partition=0x3FFC00 --version_url=version file address --
savepath=save the firmware address --reboot
updateEngine --image_url=/userdata/update_ota.img --update --reboot
```

Ablauf:

1. Firmware-Versionen vergleichen.

2. Firmware herunterladen (--image_url) und speichern (--savepath).

3. Angegebene Partitionen aktualisieren (--partition).

4. Den aktualisierten Slot gemäß chinesischem Text als nächsten Startslot festlegen.

5. Neu starten.

6. Den aktualisierten Slot zu starten versuchen. Optionale Parameter:

1. --partition: Für A/B werden nur uboot_a/uboot_b, boot_a/boot_b, system_a/system_b empfohlen, also 0xFC00. OTA unterstützt parameter/loader nicht. Siehe Bittabelle.

2. --version: Laut Quelle entfällt ohne den Parameter der Versionsvergleich; die Hilfe nennt --version_url. Tatsächliche Schnittstelle prüfen.

3. --savepath: Standard /tmp/update.img; für A/B wird dieser Standard empfohlen.

4. --reboot: Neustart nach dem Update.

### 4.5 Startpartition konfigurieren

#### 4.5.1 Erfolgreichen Start markieren

Nach erfolgreichem Systemstart den aktuellen Slot über misc als startfähig markieren. Beispielskript:

```text
$external/recovery/update_engine$ cat S99_bootcontrol
case "$1" in
start)
/usr/bin/updateEngine --misc=now
```

```text
;;
stop)
printf "stop finished\n"
;;
*)
echo "Usage: $0 {start|stop}"
exit 1
;;
esac
exit 0
```

#### 4.5.2 Aktualisierten Slot auswählen

```text
updateEngine --misc=other --reboot
```

Ablauf:

1. Laut diesem Abschnitt einen Befehl zum Start des anderen Slots bei Offset 4K in misc schreiben; siehe Widerspruch zum Anhang.

2. Neu starten. Optionaler Parameter:

--reboot: Ohne diesen Parameter erfolgt kein sofortiger Neustart; die Umschaltung gilt beim nächsten Start. updateEngine setzt den Slot nach OTA automatisch; keine erneute Einstellung erforderlich.

## 5. SD-Aktualisierungskarte erstellen

Eine mit SDDiskTool erstellte Karte wird für das Update eingesetzt. Das Projektwerkzeug tools\windows\SDDiskTool wie abgebildet verwenden.

![Leitfaden für Rockchip Linux updateEngine-Updates — en 20](/docs/rockchip-linux-upgrade/assets/en-p020-figure-01.png)

Gepacktes update.img über Firmware wählen und Create anklicken. Bei Erfolg erscheint eine Meldung. Im Karten-Hauptverzeichnis liegen zwei Dateien; update.img heißt danach sdupdate.img. Karte einsetzen und Gerät einschalten.

### 5.1 Bootfähige SD-Karte für Recovery

Für Recovery update.img mit SDDiskTool als sdupdate.img auf der Karte erstellen.

### 5.2 Bootfähige SD-Karte für A/B

Für A/B erzeugt ./build.sh updateimg drei Abbilder: update_ab.img mit vollständigen A/B-Partitionen zum vollständigen Flashen; update_ota.img mit nur Slot A oder B; update_sdcard.img ausschließlich zur Erstellung der bootfähigen A/B-SD-Karte.

update_sdcard.img in SDDiskTool laden und die Karte erstellen; danach update_ab.img oder update_ota.img auf die Karte kopieren.

```text
rksdfw.tag
sd_boot_config.config
sdupdate.img
update_ab.img  # first priority
update_ota.img # second priority
```

## 6. Werkseinstellungen wiederherstellen

Beschreibbare Einstellungen liegen in userdata. Bei Nutzung ändern sich Werkswerte; Zurücksetzen entfernt diese Änderungen. Im SDK löst RECOVERY + VOLUMEUP den Reset aus. Quellen: buildroot/board/rockchip/rk3308/fs-overlay/etc/input-event-daemon.conf und board/rockchip/rk3308/fs-overlay/usr/sbin/factory_reset_cfg.

```text
updateEngine --misc=wipe_userdata --reboot
```

Ablauf:

1. Formatierbefehl bei Offset 4K in misc schreiben.

2. Neu starten (--reboot).

3. S21mountall.sh erkennt den Formatierbefehl in misc.

4. userdata wird formatiert. Optionaler Parameter:

--reboot: Ohne diesen Parameter erfolgt das Zurücksetzen beim nächsten Neustart.

## 7. Einzelheiten des Updateprogramms

### 7.1 Parameter

updateEngine aktualisiert Partitionen und schreibt misc-Konfigurationen. Befehlshilfe:

```text
*** update_engine: Version V1.1.0 ***.
--misc=now             Linux A/B mode: Setting the current partition to bootable.
--misc=other           Linux A/B mode: Setting another partition to bootable.
--misc=update          Recovery mode: Setting the partition to be upgraded.
--misc=wipe_userdata   Format data partition.
--update               Upgrade mode.
--partition=0x3FFC00   Set the partition to be upgraded.(NOTICE: OTA not support
upgrade loader and parameter)
                       0x3FFC00: 0011 1111 1111 1100 0000 0000.
                                 uboot trust boot recovery rootfs oem
                                 uboot_a uboot_b boot_a boot_b system_a system_b.
                       000000000000000000000000: reserved
                       100000000000000000000000: Upgrade loader
                       010000000000000000000000: Upgrade parameter
                       001000000000000000000000: Upgrade uboot
                       000100000000000000000000: Upgrade trust
                       000010000000000000000000: Upgrade boot
                       000001000000000000000000: Upgrade recovery
                       000000100000000000000000: Upgrade rootfs
                       000000010000000000000000: Upgrade oem
                       000000001000000000000000: Upgrade uboot_a
                       000000000100000000000000: Upgrade uboot_b
                       000000000010000000000000: Upgrade boot_a
                       000000000001000000000000: Upgrade boot_b
                       000000000000100000000000: Upgrade system_a
                       000000000000010000000000: Upgrade system_b
                       000000000000001000000000: Upgrade misc
                       000000000000000100000000: Upgrade userdata
--reboot               Restart the machine at the end of the program.
--version_url=url      The path to the file of version.
--image_url=url        Path to upgrade firmware.
--savepath=url         save the update.img to url.
```

--misc=now: In A/B den aktuellen Slot als startfähig markieren. external/recovery/update_engine/S99_bootcontrol führt dies am Ende des erfolgreichen Starts aus. Englisch nennt auch S99bootcontrol ohne Unterstrich; den tatsächlichen SDK-Pfad verwenden. Aktivieren:

```text
BR2_PACKAGE_RECOVERY_BOOTCONTROL=y
```

other: In A/B den anderen Slot als aktualisiert markieren und nach Neustart dessen Start versuchen.

Nach OTA erledigt updateEngine dies automatisch. update: Im Recovery-Modus zuerst recovery im normalen System, dann die übrigen Partitionen in recovery aktualisieren. display: misc-Struktur zur Fehlersuche anzeigen. --update sdboot: Flash direkt ohne Partitionskonzept aktualisieren. --update ohne Wert: hauptsächlich A/B, Update im laufenden System. --partition=0x0000 setzt die Maske; Standard 0x3FFC00 umfasst uboot, trust, boot, recovery, rootfs, oem, uboot_a, uboot_b, boot_a, boot_b, system_a, system_b. Obere 16 Bit sind belegt, untere 8 für Erweiterungen reserviert; 1 bedeutet aktualisieren, 0 nicht.

| Bit | Partition |
| --- | --- |
| 23 | loader |
| 22 | parameter |
| 21 | uboot |
| 20 | trust |
| 19 | boot |
| 18 | recovery |
| 17 | rootfs |
| 16 | oem |
| 15 | uboot_a |
| 14 | uboot_b |
| 13 | boot_a |
| 12 | boot_b |
| 11 | system_a |
| 10 | system_b |
| 9 | misc |
| 8 | userdata |
| 7~0 | Reserviert |

--reboot startet nach erfolgreichem updateEngine neu. --version_url (Quellfehler --vsersion_url) vergleicht mit RK_VERSION= in /etc/version: Lokal wird die Version aus der Firmware gelesen; eine entfernte Versionsdatei wird geladen und muss das Format von /etc/version haben. --image_url legt lokalen oder entfernten Firmwarepfad fest. --savepath setzt den Speicherpfad; bei entfernter Firmware ohne Angabe gilt /tmp/update.img.

### 7.2 Eigene Partition aktualisieren

```text
typedef struct {
char name[32];      //firmware name
bool need_update;   //need to upgrade
bool is_ab;         //whether it is A/B dual patition
long long size;     //firmware size
long long offset;   //Offset position in update.img
long long flash_offset; //Offset position in flash
char dest_path[100];    //Target path
update_func cmd;        //Upgrade function
}UPDATE_CMD, *PUPDATE_CMD;
```

Für eine eigene Partition factory folgende Zeile ergänzen und das entsprechende Bit in --partition auf 1 setzen.

```text
{"factory", false, false, 0, 0, 0, "", flash_normal},
```

Datei: external/recovery/update_engine/update.cpp.

```text
UPDATE_CMD update_cmd[] = {
           {"bootloader" , false , false , 0 , 0 , 0 , "" , flash_bootloader} ,
           {"parameter"  , false , false , 0 , 0 , 0 , "" , flash_parameter}  ,
           {"uboot"      , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"trust"      , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"boot"       , false , true  , 0 , 0 , 0 , "" , flash_normal}     ,
           {"recovery"   , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"rootfs"     , false , true  , 0 , 0 , 0 , "" , flash_normal}     ,
           {"oem"        , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"uboot_a"    , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"uboot_b"    , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"boot_a"     , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"boot_b"     , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"system_a"   , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"system_b"   , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"misc"       , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"userdata"   , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
```

Abschlusszeile aus der chinesischen Quelle ergänzt:

```text
};
```

## 8. Anhang

### 8.1 Firmware-Paketierung

#### 8.1.1 Windows

Das Windows-Werkzeug liegt unter tools\windows\AndroidTool\rockdev. Zuerst die zu aktualisierenden Abbilder in package-file aufnehmen; die Pfade sind relativ.

mkupdate.bat verknüpft tools\windows\AndroidTool\rockdev\Image mit rockdev im SDK-Hauptverzeichnis. Vorhandensein der Abbilder prüfen und mkupdate.bat starten: Die ausgewählten Abbilder werden als update.img im Hauptverzeichnis rockdev gepackt.

#### 8.1.2 Linux

Das Linux-Werkzeug liegt unter tools/linux/Linux_Pack_Firmware/rockdev. Abbilder mit relativen Pfaden in package-file aufnehmen. tools/linux/Linux_Pack_Firmware/rockdev/Image verweist auf das Hauptverzeichnis rockdev; Abbilder dort prüfen. mkupdate.sh packt sie als update.img im Hauptverzeichnis rockdev.

### 8.2 Partition misc

misc besitzt kein Dateisystem und speichert Startparameter. Aufbau siehe unten; Details in external/recovery/bootloader.h und external/recovery/update_engine/rkbootloader.cpp.

| Offset | Bedeutung |
| --- | --- |
| 2k | Linux-A/B-Startinformationen |
| 4k | Formatierbefehl |
| 16k | Kommunikation zwischen Recovery und normalem System |

## Quellenabgleich und Implementierungsgrenzen

- Beide V1.2.0: Chinesisch 21 Seiten, Englisch 25. Chinesisch Kapitel 5: 5.1 Erstellung, 5.2 Recovery, 5.3 A/B; Englisch integriert die Erstellung in die Einleitung und nutzt 5.1/5.2. Alles bleibt erhalten. Englisch schließt EXT3/UBI ausdrücklich aus, Chinesisch ext2/ext4 und MTD-NAND. Differenzielle A/B-, verschlüsselte und beschreibbare Partitionen bleiben ununterstützt. Chinesisch verlangt als neues Image OTA statt vollständigem Downloadabbild; diese strengere Vorgabe gilt als Basis.
- Das Vektor-Differenzdiagramm wurde aus CN-Seite 8/EN-Seite 9 exportiert, nicht durch isolierte Beschriftungen ersetzt. Nur das englische A/B-Bild ergänzt bei erfolgreichem slot_b successful_boot=1, tries_remaining=0, last_boot=1. Anfangs A priority=15, B=14, beide successful_boot=0 und tries_remaining=7. CRC-Fehler initialisiert misc. Priorität, Erfolg und Versuche bestimmen den Slot; erschöpfte Versuche setzen die Priorität auf null, bei zwei Nullprioritäten verwendet das Diagramm last_boot.
- Der Text verneint doppeltes uboot, Tabellen und Pakete enthalten uboot_a/uboot_b: Plattform prüfen. Englisch nennt OEM ausdrücklich ohne Sicherung; einzelne oem/userdata liefern keine A/B-Redundanz. OTA-Beschreibung nennt boot/rootfs, das Beispiel auch uboot/oem; package-file bestimmt den Inhalt.
- --version und der Tippfehler --vsersion_url widersprechen --version_url in der Hilfe. S99bootcontrol/S99_bootcontrol unterscheiden sich ebenfalls. Dem englischen recovery/recovery fehlt .mk aus Chinesisch. Code behält Kommentare und PDF-Umbrüche; getrennte --update- und Shell-Zeilen vor Ausführung prüfen. Private HTTP-Adressen wurden nicht aufgerufen.
- misc: 2K für A/B, 4K für Formatierung, 16K für Recovery/Normal; 4.5.2 nennt dennoch 4K für Slotwechsel. Keine rohen Offsets anhand dieses Widerspruchs schreiben, rkbootloader.cpp prüfen. unsigned char crc32 ist für CRC32 fragwürdig: Typ erhalten, Implementierung prüfen. successful_boot=0 verbietet nicht alle Startversuche; die Grafik nutzt tries_remaining. Der Reset-retry-Nachteil nennt einen Slot nach verbrauchten Versuchen irrtümlich startfähig; tatsächliches Verhalten prüfen.
- Dem englischen UPDATE_CMD update_cmd[] fehlt };. Original bleibt erhalten, chinesische Abschlusszeile wird separat ergänzt. factory-Bit muss zu Arrayreihenfolge und Maske passen; untere acht Bit sind reserviert. 0x3FFC00 ist die Standardgruppe, 0xFC00 für A/B empfohlen. Obwohl die Hilfe loader/parameter-Bits zeigt, schließt der Text deren OTA-Update ausdrücklich aus.
- Der erste Patchname endet in beiden Quellen bei 0001-package-recovery-add-bzip2-dependency.; tatsächlichen SDK-Namen prüfen. Standardmäßiger bildschirmloser Betrieb und „nur RK3308“ vermischen Konfigurationen; BR2_PACKAGE_RECOVERY_NO_UI sowie Log-Schreibweise prüfen.

{% endraw %}
