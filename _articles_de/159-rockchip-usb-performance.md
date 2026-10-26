---
title: "Rockchip-USB-Leistung: Host, Gadget und Übertragungsengpässe"
description: "Rockchip-USB-Leistung: Host, Gadget und Übertragungsengpässe — V1.1.1"
excerpt: "Rockchip-USB-Leistung: Host, Gadget und Übertragungsengpässe"
translation_key: "159-rockchip-usb-performance"
slug: "159-rockchip-usb-performance"
lang: "de"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "peripherals"
products: []
tags: [ArmSoM, Rockchip, USB, Linux]
---

{% raw %}

# Rockchip-USB-Leistung: Host, Gadget und Übertragungsengpässe

ArmSoM-Plattformreferenz: Die chinesische Quelle RK-KF-YF-100 V1.1.1 behandelt die Serien 30, 31, 32, 33, PX, Sofia und RV1108 mit Linux 3.10/4.4. Daraus folgt keine Unterstützung aller ArmSoM-Platinen. Platine, SoC, BSP, Verdrahtung, Controller und Kernel prüfen. Alle Leistungswerte sind Quellenbeispiele, keine ArmSoM-Messungen; keine Hardwarevalidierung erfolgt. Kein englisches PDF vorhanden; alle vier Sprachen verwenden vier Abbildungen aus dem chinesischen PDF.

Quellenhinweise: Historische USB-Namen, “400MBps?”, Webcam 648×480 / UYV und KB/MB ohne Zeitangabe bleiben erhalten und sind keine Aussagen zu aktuellen Standards. rm of=…, ehco sowie lange Striche in blkparse-Optionen und ein Leerzeichen im Pfad sind fragwürdig; vor Verwendung die tatsächliche Werkzeugsyntax prüfen. Direkte Datenträgerzugriffe, Cache-Leeren, Gadget-Änderungen, CPU-Abschaltung und Firewall-Deaktivierung beeinflussen das System. Dies sind ausschließlich nicht ausgeführte Laborverfahren der Quelle für eine isolierte Testumgebung. Auch HID protocol=2 gegenüber dem Kommentar Keyboard bleibt ungeklärt.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## 1. Theoretische USB-Übertragungsraten

### 1.1 USB Communication Flow

Abbildung 1-1 zeigt ein Schichtenmodell: Die Host-Geräte-Verbindung besteht aus Verbindungen mehrerer Ebenen. Die Busschnittstelle stellt die physische Verbindung her und sendet/empfängt Daten. Die Geräteebene ist für die USB-Systemsoftware sichtbar, die darüber allgemeine Geräteoperationen ausführt. Die Anwendungsebene kann dem Host über passende Clientsoftware Zusatzfunktionen bieten. Kommunikation auf Geräte- und Anwendungsebene ist logisch; die Busschnittstelle führt die zugehörige physische Kommunikation aus.

![Quellenabbildung — PDF p4](/docs/rockchip-usb-performance/assets/cn-p004-figure-01.png)

Abbildung 1-1. USB Communication Flow

### 1.2 Datenrate der physikalischen Schicht

Die physikalische Datenrate ist die Rate auf dem USB-Bus. Die historische Quelle nennt fünf Standards: USB1.0, USB1.1, USB2.0, USB3.0 (USB3.1 Gen1) und USB3.1 Gen2. Tabelle 1-1 nennt die Maximalraten.

| USB-Version | Maximale Rate | Geschwindigkeitsname |
| --- | --- | --- |
| USB 1.0 | 1.5Mbps | Niedrige Geschwindigkeit(Low-Speed) |
| USB 1.1 | 12Mbps | Volle Geschwindigkeit(Full-Speed) |
| USB 2.0 | 480Mbps | Hohe Geschwindigkeit(High-Speed) |
| USB 3.0(USB 3.1 Gen1) | 5Gbps | SuperSpeed(Super-Speed) |
| USB 3.1 Gen2 | 10Gbps | In Quelle noch nicht definiert(Super-Speed+) |

### 1.3 Datenrate der Protokollschicht

USB-Geräteklassen verwenden verschiedene Protokolle: Datenträger USB Mass Storage Class mit Bulk-Only Transport, Kameras USB Video Class und HID USB Human Interface Devices Class. Weitere Spezifikationen stehen bei USB-IF. Paketformate unterscheiden sich; manche Protokolle benötigen Befehls- und Handshakepakete. Auch Übertragungsarten unterscheiden sich: Datenträger Bulk, Kameras Isochronous, HID Interrupt.

Vier Arten werden unterstützt:

- Control: Enumeration beim Anschluss und gerätespezifische Operationen.
- Interrupt: zuverlässige kleine Übertragungen mit strikten Latenzanforderungen, etwa Tastaturen und Gamepads.
- Bulk: zuverlässige große Datenmengen mit lockeren Latenzanforderungen, etwa Datenträger und Ethernetadapter.
- Isochronous: Echtzeitdaten mit geringeren Zuverlässigkeitsanforderungen, etwa Kameras und Audio.

Auf dem physikalischen Bus sind die Unterschiede gering; Mechanismen, Hostplanung, Bandbreitenlimits und maximale Paketlängen unterscheiden sich. Tabelle 1-2 vergleicht diese Arten.

[Quellenlink](http://www.usb.org/developers/docs/devclass_docs/)

| Übertragungstyp | USB 2.0 | USB 3.0 |
| --- | --- | --- |
| Control | Max Packet: 64Bytes<br>Burst:Nicht unterstützt<br>Flusskontrolle nur für OUT(PING) | Max Packet: 512Bytes<br>Burst:1<br>Flusskontrolle unterstützt(ERDY) |
| Interrupt | Max Packet: 0 〜 1024 ×3 Bytes<br>Max Transfer Speed:23.44MBps<br>Burst:Nicht unterstützt<br>Keine Flusskontrolle | Max Packet: 0 〜 1024 ×3 Bytes<br>Max Transfer Speed:23.44MBps<br>Burst:1 ~ 3<br>Flusskontrolle unterstützt(ERDY) |
| Bulk | Max Packet: 512Bytes<br>Max Transfer Speed:53.25MBps<br>Burst:Nicht unterstützt<br>Flusskontrolle nur für OUT(PING) | Max Packet: 1024Bytes<br>Max Transfer Speed:400MBps?<br>Burst:1 〜 16<br>Flusskontrolle unterstützt(ERDY)) |
| Isochron | Max Packet: 0 〜 1024 ×3 Bytes<br>Max Transfer Speed:23.44MBps<br>Burst:Nicht unterstützt<br>Keine Flusskontrolle | Max Packet: 0 〜 1024 ×16 × 3Bytes<br>Max Transfer Speed:375.04MBps<br>Burst:1 ~ 16<br>Flusskontrolle unterstützt(PING -> PING_RESPONSE) |

Tabelle 1-2 zeigt unterschiedliche theoretische Maximalraten. Übertragungsgrenzen und Klassenprotokoll-Interaktion machen den praktischen Durchsatz deutlich geringer als die physikalische Busrate.

### 1.4 Wesentliche Durchsatzfaktoren

Der USB-Durchsatz hängt hauptsächlich von folgenden Faktoren ab:

1. Signalqualität. Sie wird anhand des USB-Augendiagramms bewertet. Schlechte Signale verursachen Paketverluste und Wiederholungen und senken den Durchsatz.

2. AHB CLK und DMA Burst Length des Controllers. Höherer AHB-Takt und größere DMA-Bursts können die DMA-Effizienz verbessern.

3. Die CPU-Frequenz beeinflusst Codeausführung und memcpy. Ein höherer Takt kann USB-Treiber und Anwendungen beschleunigen und damit den Durchsatz erhöhen.

4. Die URB-Puffergröße (USB Request Block) ist die Datenmenge pro Controllertransfer. Für von der Quelle als MSC eingeordnete Beispiele wie USB Disk und USB MTP können größere Puffer Interrupts reduzieren, sofern Blockgrößeneffekte auf eMMC/NAND ignoriert werden. Die Quelle nennt maximal 512KB pro DWC2- und 16MB - 1 Bytes pro DWC3-Transfer.

5. Lese-/Schreibleistung der Medien. MSC-Geräte wie Datenträger hängen sowohl vom Hostspeicher als auch vom USB-Datenträger ab.

6. Dateisystemformat.

Übliche Formate sind VFAT, EXT4 und NTFS. Im Quellen-Stack fasst die Kernel-Blockschicht kleine VFAT/EXT4-Blöcke vor dem Schreiben zu 120K zusammen; NTFS schreibt aus Userspace ohne diese Zusammenfassung. Bei kleinen Anwendungsanfragen wie 4KB kann NTFS daher deutlich langsamer kopieren als VFAT/EXT4. Analyse siehe Abschnitt 2.1.

## 2. USB-Host-Leistungsanalyse

### 2.1 USB-Datenträgerdurchsatz

Testverfahren. Nach Anschluss an USB Host wird folgende Partition angenommen:

```text
/dev/block/sda1
```

Mountpfad:

```text
/mnt/media_rw/0E64-5F76/
```

Host-eMMC-Dateipfad: /sdcard/. Die folgenden Methoden setzen diese Pfade voraus.

Eine ausreichend große Testdatei verwenden. Für 3399 EVB mit 4G DDR empfiehlt die Quelle 2G und berichtet ungenaue Werte mit 1024MB. Begründung: proc/sys/vm/dirty_background_ratio beträgt meist 5%; asynchrones Zurückschreiben beginnt bei 4G × 5% = 204.8MB schmutzigen Seiten. conv=fsync bei dd schreibt den Cache auf den Datenträger.

Zwei Methoden: Methode 1 kopiert eine große Datei, etwa einen Film, manuell oder mit cp und bestimmt Zeit und Rate. Schritt 1 erzeugt test mit dd für Schritt 2.

```text
busybox dd if=/dev/zero of=/mnt/media_rw/0E64-5F76/test bs=64K count=16K
```

Schritt 2. Dauer des cp-Vorgangs messen.

```text
echo 3 > /proc/sys/vm/drop_caches
time cp /mnt/media_rw/0E64-5F76/test /sdcard/.
```

Dies prüft die Leserate. Zum Schreiben die Pfade umkehren. Methode 2 verwendet dd. Für Lesetests erzeugt Schritt 1 eine Testdatei für die nachfolgenden Kopien.

```text
busybox dd if=/dev/zero of=/mnt/media_rw/0E64-5F76/test bs=64K count=16K
```

Schritt 2. Vor jedem dd-Befehl den Cache leeren.

```text
echo 3 > /proc/sys/vm/drop_caches
```

Leserate mit 4K-Blöcken testen.

```text
busybox dd if=/mnt/media_rw/0E64-5F76/test of=/dev/null bs=4K count=256K
```

Schritt 3. Vor jedem dd-Befehl den Cache leeren.

```text
echo 3 > /proc/sys/vm/drop_caches
```

Leserate mit 64K-Blöcken testen.

```text
busybox dd if=/mnt/media_rw/0E64-5F76/test of=/dev/null bs=64K count=16K
```

Schritt 4. Vor jedem dd-Befehl den Cache leeren.

```text
echo 3 > /proc/sys/vm/drop_caches
```

Leserate mit 128K-Blöcken testen.

```text
busybox dd if=/mnt/media_rw/0E64-5F76/test of=/dev/null bs=128K count=8K
```

Schritt 5. Vor jedem dd-Befehl den Cache leeren.

```text
echo 3 > /proc/sys/vm/drop_caches
```

Leserate mit 512K-Blöcken testen.

```text
busybox dd if=/mnt/media_rw/0E64-5F76/test of=/dev/null bs=512K count=2K
```

USB-Datenträger-Schreibtest: Schritt 1. Cache vor jedem dd leeren.

```text
echo 3 > /proc/sys/vm/drop_caches
```

Schreibrate mit 4K-Blöcken testen.

```text
busybox dd if=/dev/zero of=/mnt/media_rw/0E64-5F76/test bs=4K count=256K
```

Schritt 2.

```text
rm of=/mnt/media_rw/0E64-5F76/test
```

```text
sync
```

```text
echo 3 > /proc/sys/vm/drop_caches
```

Schreibrate mit 64K-Blöcken testen.

```text
busybox dd if=/dev/zero of=/mnt/media_rw/0E64-5F76/test bs=64K count=16K
```

Schritt 3.

```text
rm of=/mnt/media_rw/0E64-5F76/test
```

```text
sync
```

```text
echo 3 > /proc/sys/vm/drop_caches
```

Schreibrate mit 128K-Blöcken testen.

```text
busybox dd if=/dev/zero of=/mnt/media_rw/0E64-5F76/test bs=128K count=8K
```

Schritt 4.

```text
rm of=/mnt/media_rw/0E64-5F76/test
```

```text
sync
```

```text
echo 3 > /proc/sys/vm/drop_caches
```

Schreibrate mit 512K-Blöcken testen.

```text
busybox dd if=/dev/zero of=/mnt/media_rw/0E64-5F76/test bs=512K count=2K
```

Methode 1 misst reale Kopierleistung, vermischt aber Hostspeicher-, Dateisystem- und Controller-Einflüsse. Methode 2 schließt Hostspeicher/Dateisystem aus; das Dateisystem des USB-Geräts wirkt weiterhin. Direkter Zugriff auf sd*-Partitionsknoten unter /dev/ umgeht es, kann jedoch vorhandene Daten zerstören: höchste Vorsicht. conv=fsync schreibt Cache-Daten auf den Datenträger; große Dateien verringern den Cache-Einfluss ebenfalls. Die Quelle empfiehlt beide Methoden: zuerst 1, bei zu geringer Leistung 2 zur Eingrenzung eines Controllerengpasses.

Quellenergebnisse mit dd: USB2.0 Host typischerweise 25–35MBps; USB3.0 ohne UAS 60–100MBps; UAS-Datenträger bis etwa 350MBps. Medien unterscheiden sich stark; manche lesen 3–5-mal schneller als sie schreiben. Mehrere Modelle testen und dieselben Geräte mit derselben Methode am Ubuntu-PC vergleichen.

RK3399/RK3328 USB3 unterstützt UASP (USB Attached SCSI PROTOCOL), was Leistung deutlich verbessern kann. Erforderlich sind CONFIG_USB_UAS (im Quellen-Kernel3.10/4.4 standardmäßig aktiv) und UAS-Unterstützung des Datenträgers. Enumerationslogs zeigen die Nutzung.

```text
[80373.513866] usb 4-1: new SuperSpeed USB device number 2 using xhci_hcd
[80373.534854] usb 4-1: New USB device found, idVendor=174c, idProduct=55aa
[80373.534871] usb 4-1: New USB device strings: Mfr=2, Product=3, SerialNumber=1
[80373.534873] usb 4-1: Product: CHIPFANCIER
[80373.534874] usb 4-1: Manufacturer: WINTOGO
[80373.534876] usb 4-1: SerialNumber: 000001485761816
[80373.537036] scsi host6: uas （说明将以UAS协议进⾏通信）
[80373.537648] scsi 6:0:0:0: Direct-Access    WINTOGO  CHIPFANCIER      0    PQ: 0 ANSI: 6
```

Analyse- und Optimierungsbeispiel: RK3399 EVB liest/schreibt einen USB3-Datenträger. Andere Szenarien können dieselbe Analysemethode nutzen.

Quellen-Testaufbau: RK3399 EVB mit 2G DDR + 16G eMMC; SanDisk Type-C USB3.0 32G, NTFS. Große Datei mit cp/dd von USB3 nach eMMC kopieren. USB-Mountpfad /mnt/media_rw/0E64-5F76/, eMMC /sdcard/. Bei 4G DDR empfiehlt die Quelle 2GB Testdateien gegen Cache-Einflüsse; conv=fsync schreibt Cache-Daten auf den Datenträger, große Dateien helfen ebenfalls. Schritt 1 erzeugt eine 1GB-Testdatei mit dd.

```text
busybox dd if=/dev/zero of=/mnt/media_rw/0E64-5F76/test bs=64K count=16K
```

Schritt 2 prüft das Kopieren von USB3 nach eMMC. Für test mit 1GB meldet die Quelle `0m48.42s real 0m00.29s user 0m18.17s system`, also `1024M/48 = 21MBps`, unter ihrer USB3-Erwartung.

Schritt 3 kopiert direkt von /dev/block/sda1 nach /sdcard/test und umgeht das USB-Dateisystem. Etwa 20MBps führen die Quelle zum Schluss, dass nicht das 3399-Dateisystem selbst die Ursache ist.

Schritt 4 testet USB-Datenträger und eMMC getrennt mit dd. Zuerst USB3-Lesen; vor jedem Befehl Cache leeren.

```text
time cp /mnt/media_rw/0E64-5F76/test /sdcard/.
time cp /dev/block/sda1 /sdcard/test
```

```text
echo 3 > /proc/sys/vm/drop_caches
```

Leserate mit 4K-Blöcken testen.

```text
busybox dd if=/mnt/media_rw/0E64-5F76/test of=/dev/null bs=4K count=256K
```

Quellenergebnis: `1073741824 bytes (1.0GB) copied, 14.183164 seconds, 72.2MB/s`. Cache vor jedem dd leeren.

```text
echo 3 > /proc/sys/vm/drop_caches
```

Leserate mit 64K-Blöcken testen.

```text
busybox dd if=/mnt/media_rw/0E64-5F76/test of=/dev/null bs=64K count=16K
```

Quellenergebnis: `1073741824 bytes (1.0GB) copied, 12.546069 seconds, 81.6MB/s`. Cache vor jedem dd leeren.

```text
echo 3 > /proc/sys/vm/drop_caches
```

Leserate mit 128K-Blöcken testen.

```text
busybox dd if=/mnt/media_rw/0E64-5F76/test of=/dev/null bs=128K count=8K
```

Quellenergebnis: `1073741824 bytes (1.0GB) copied, 12.601817 seconds, 81.3MB/s`. Cache vor jedem dd leeren.

```text
echo 3 > /proc/sys/vm/drop_caches
```

Leserate mit 512K-Blöcken testen.

```text
busybox dd if=/mnt/media_rw/0E64-5F76/test of=/dev/null bs=512K count=2K
```

Ergebnis: `1073741824 bytes (1.0GB) copied, 12.402147 seconds, 82.6MB/s`. Anschließend 3399-eMMC-Schreiben testen; Cache vor jedem dd leeren.

```text
echo 3 > /proc/sys/vm/drop_caches
```

Schreibrate mit 4K-Blöcken testen.

```text
busybox dd if=/dev/zero of=/sdcard/test bs=4K count=256K
```

Quellenergebnis: `1073741824 bytes (1.0GB) copied, 39.525297 seconds, 25.9MB/s`

```text
rm of=/sdcard/test
```

```text
sync
```

```text
echo 3 > /proc/sys/vm/drop_caches
```

Schreibrate mit 64K-Blöcken testen.

```text
busybox dd if=/dev/zero of=/sdcard/test bs=64K count=16K
```

Quellenergebnis: `1073741824 bytes (1.0GB) copied, 37.505206 seconds, 27.3MB/s`

```text
rm of=/sdcard/test
```

```text
sync
```

```text
echo 3 > /proc/sys/vm/drop_caches
```

Schreibrate mit 128K-Blöcken testen.

```text
busybox dd if=/dev/zero of=/sdcard/test bs=128K count=8K
```

Quellenergebnis: `1073741824 bytes (1.0GB) copied, 37.461603 seconds, 27.3MB/s`

```text
rm of=/sdcard/test
```

```text
sync
```

```text
echo 3 > /proc/sys/vm/drop_caches
```

Schreibrate mit 512K-Blöcken testen.

```text
busybox dd if=/dev/zero of=/sdcard/test bs=512K count=2K
```

Ergebnis: `1073741824 bytes (1.0GB) copied, 37.086531 seconds, 27.6MB/s`. USB3 liest schnell und bei kleinen/großen Blöcken ähnlich; sämtliche eMMC-Schreibvorgänge sind langsam. Die Quelle identifiziert eMMC als Engpass. Hier sind 4K/64K/128K/512K langsam; laut Quelle können viele Rockchip-eMMC-Medien und USB3-Datenträger nur bei 4K langsam sein. Ist nur 4K betroffen, diese Blockgröße weiter untersuchen. Schritt 5 analysiert cp und Blockschicht mit strace und blktrace.

cp mit strace verfolgen:

```text
strace cp /mnt/media_rw/0E64-5F76/test /sdcard/.
```

Die Quelle stellt fest, dass cp auf RK3399 4KB-Blöcke liest/schreibt. Blockzusammenfassung mit blktrace untersuchen. Wichtige Parameter:

```text
max_hw_sectors_kb
```

```text
max_sectors_kb
```

max_hw_sectors_kb und max_sectors_kb steuern die zusammengefasste Schreibblockgröße: laut Quelle meist 120KB bei USB und 512KB bei eMMC. eMMC-Pfade:

```text
/sys/block/mmcblk1/queue/max_hw_sectors_kb
/sys/block/mmcblk1/queue/max_sectors_kb
```

USB Disk:

```text
/sys/block/sda/queue/max_hw_sectors_kb
/sys/block/sda/queue/max_sectors_kb
```

max_hw_sectors_kb für USB-Datenträger wird hier gesetzt:

```text
drivers/usb/storage/scsiglue.c
/*limit the total size of a transfer to 120 KB */
.max_sectors =  240, （单位为block512 bytes）
```

Höhere Schichten können den Parameter setzen; Beispielpfad für RK3399 Type-C1:

```text
/sys/devices/platform/usb@fe900000/fe900000.dwc3/xhci-hcd.9.auto/usb4/4-1/4-1:1.0/host0/target0:0:0/0:0:0:0/max_sectors
```

I/O-Scheduler anzeigen:

```text
rk3399:/data# cat /sys/block/mmcblk1/queue/scheduler
```

`noop [cfq]` wählt cfq und lässt Zusammenfassung kleiner Blöcke erwarten. Android enthält blktrace, möglicherweise deaktiviert. mk-Datei ändern, Werkzeug bauen und per adb push nach /system/bin kopieren. Erste Android.mk-Zeile BUILD_BLKTRACE:= false ändern in:

```text
BUILD_BLKTRACE:= true
```

Für blktrace CONFIG_BLK_DEV_IO_TRACE im Kernel aktivieren:

```text
Kernel hacking  --->
    [*]Tracers  --->
        [*]  Support for tracing block IO actions
```

Beispiel für blktrace-Aufzeichnung:

1. Datenverzeichnis anlegen.

```text
mkdir /dev/blktrace
```

2. blktrace-Aufzeichnung starten.

```text
blktrace -d /dev/block/mmcxxx -o /dev/blktrace/blktrace &
```

/dev/block/mmcxxx ist das untersuchte Blockgerät, etwa mmcblk1 auf 3399.

3. Kopierbefehl ausführen:

```text
busybox dd if=/dev/zero of=/data/test bs=4K count=256K
```

4. blktrace stoppen. Nach dem Kopieren seinen Thread beenden; Daten werden unter /dev/blktrace gespeichert. Alternativ beendet -w nach der angegebenen Sekundenzahl. Aufzeichnung auswerten:

```text
blkparse –i /dev/blktrace/ blktrace.blktrace.0 –o /dev/blktrace/blkparse.txt
```

Die Quellenstatistik zeigt cfq-Zusammenfassung von 4k-Blöcken zu 1024 Sektoren beziehungsweise 512K vor eMMC-Schreibvorgängen (Abbildung 2-1).

![Quellenabbildung — PDF p14](/docs/rockchip-usb-performance/assets/cn-p014-figure-01.png)

Abbildung 2-1. blktrace-Daten. Die Quelle folgert, dass die 3399-Blockzusammenfassung korrekt arbeitet; Details stehen im verlinkten blktrace-I/O-Beitrag.

Die Quelle wiederholt „step5“ für die Dateisystemanalyse. VFAT/EXT4 fassen Blöcke im Kernel zusammen; ihr NTFS nutzt FUSE, Userspace-Schreiben und zusätzliche Kopien. Bei 4KB-Anfragen und CPU-Taktskalierung kann NTFS langsamer sein. RK3399-Android-cp fordert nur 4KB an, weshalb NTFS-USB3-Datenträger dort oft schlecht abschneiden.

Optimierungsfaktoren: USB-Datenträger- und Hostspeicherleistung, Hostcontroller, Dateisystem, Anforderungsgröße und CPU-Takt. Erst den Engpass lokalisieren, dann optimieren.

[Quellenlink](http://bean-li.github.io/blktrace-to-report/)

### 2.2 USB-Ethernet-Durchsatz

Testwerkzeug iperf prüft TCP/UDP-Bandbreitenqualität, misst maximale TCP-Bandbreite, bietet zahlreiche Parameter und UDP-Funktionen und meldet Bandbreite, Jitter und Paketverlust. Website https://iperf.fr/ ; Downloads für Windows, Android, Ubuntu und macOS: https://iperf.fr/iperf-download.php . Unter Ubuntu installieren mit:

[Quellenlink](https://iperf.fr/iperf-download.php)

```text
sudo apt install iperf
```

Unter Android kann iperf.apk installiert werden. Anleitungen: https://iperf.fr/iperf-doc.php und http://man.linuxde.net/iperf . UDP misst üblicherweise Grenzbandbreite, Jitter und Paketverlust. Mit der theoretischen Rate beginnen, etwa -b 100M für 100Mbps. Danach mit der gemessenen Rate erneut testen; Jitter/Verluste sollten sinken. Wiederholungen ergeben stabile praktische Bandbreite.

UDP-Beispiel: Ubuntu-PC als Server; RK3399 USB2/USB3 Host an UGREEN USB3 Ethernet und per Ethernetkabel an den PC. IPv4-Adresse, Netzmaske und Gateway wie Abbildung 2-2 setzen.

[Quellenlink](https://iperf.fr/iperf-doc.php)

![Quellenabbildung — PDF p16](/docs/rockchip-usb-performance/assets/cn-p016-figure-01.png)

Abbildung 2-2. IP-Konfiguration des Ubuntu-PC. Screenshotwerte: IPv4-Methode **Manuell**, Adresse `192.168.1.1`, Netzmaske `255.255.255.0`, Gateway `192.168.1.1`. Dies sind die Testparameter der Quelle, keine universelle Netzwerkkonfiguration. Anschließend ausführen:

```text
wlf@wlf-ubuntu:~$ iperf -u -s
------------------------------------------------------------
Server listening on UDP port 5001
Receiving 1470 byte datagrams
UDP buffer size:  208 KByte (default)
------------------------------------------------------------
```

3399-Client: zuerst USB-Ethernet-Adapterinformationen prüfen.

```text
eth1      Link encap:Ethernet  HWaddr 60:38:E0:E3:20:96
          inet6 addr: fe80::6238:e0ff:fee3:2096/64 Scope: Link
          UP BROADCAST MULTICAST  MTU:1500  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:2 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000
          RX bytes:0 TX bytes:168
```

Danach IP-Adresse setzen:

```text
ifconfig eth1 192.168.1.2 up
```

Bandbreitentest starten:

```text
iperf -u -c 192.168.1.1 -b 1000M -t 60
```

-b ist die UDP-Bandbreite in bits/sec. Die Quelle empfiehlt -b 100M für USB2.0 und -b 1000M für USB3.0. Originalergebnis mit UGREEN USB3.0 Ethernet:

```text
------------------------------------------------------------
Client connecting to 192.168.1.2, UDP port 5001
Sending 1470 byte datagrams
UDP buffer size:  208 KByte (default)
------------------------------------------------------------
[  3] local 192.168.1.2 port 40116 connected with 192.168.1.1 port 5001
[ ID] Interval       Transfer     Bandwidth
[  3]  0.0-60.0 sec  5.61 GBytes   803 Mbits/sec
[  3] Sent 4096616 datagrams
```

Dieselbe Methode liefert für CISCO USB2.0 Ethernet etwa 95Mbits/sec. Quellenrichtwerte in beide Richtungen: USB2.0 Host 95–100Mbits/sec, USB3.0 Host 750–800Mbits/sec. Bei Unterschreitung Fehler mit ifconfig/tcpdump prüfen; viele Fehler erfordern USB-Augendiagrammprüfung der Signalqualität.

### 2.3 USB-Kameradurchsatz

Vorschau der integrierten Camera APK und logcat über die serielle Verbindung zeigen die aktuelle Bildrate:

```text
CameraHal: debugShowFPS(622): Camera 1312 Frames, 30.000 FPS
```

UVC-Treiberdebugging: Trace-Ausgabe aktivieren.

```text
echo 0xffff > /sys/module/uvcvideo/parameters/trace
echo 8 > /proc/sysrq-trigger
```

UVC-Trace deaktivieren:

```text
ehco 0 > /sys/module/uvcvideo/parameters/trace
```

UVC-Decodierstatistik prüfen. Tabelle 2-1 nennt maximale USB-Kamera-Bildraten der Quelle.

```text
cat /d/usb/uvcvideo/*/stats
```

|  | YUYV Format | MJPEG Format | H264 Format |
| --- | --- | --- | --- |
| USB 2.0 | 640×480 @30fps | 1280×720 @30fps | 1920×1080 @30fps |
| USB 3.0 | 640×480 @60fps | 1280×720 @60fps | 1920×1080 @60fps |

Diese Raten setzen eine Kamera pro Controller voraus; bei mehreren Kameras messen. Die meisten Kameras verwenden isochrone Übertragung. Die theoretische USB2.0-Bandbreite laut Quelle beträgt

23.44MBps gegenüber 375.04MBps bei USB3.0. Die Bildrate hängt hauptsächlich von (a) Kameraausgabe und (b) isochroner Hosttreiberleistung ab. (a) am PC prüfen. Für (b) höhere USB-QOS-Priorität, schnellere Interruptreaktion, höheren AHB CLK und längere DMA-Bursts erwägen.

## 3. USB-Geräte-Leistungsanalyse

### 3.1 USB-MTP-Durchsatz

Zielgerät im MTP-Modus an PC anschließen, große Datei wie einen Film über 1GB manuell kopieren, Zeit messen und Durchschnittsrate berechnen. Gerät auf ruhendem Desktop halten und Suspend verhindern. Nach Anschluss Abschluss des Medienscans abwarten (logcat).

Quellentest: RK3399 BOX SDK Android N + Kernel4.4. Read bedeutet RK3399 → PC, Write PC → RK3399. 16K/64K/1M sind MTP-Tx/Rx-Pufferlängen. Große und kleine Kerne waren auf Maximaltakt fixiert. Tabelle 3-1: RK3399-BOX-SDK-MTP-Raten.

|  | Read 16K | Write 16K | Read 64K | Write 64K | Read 1M | Write 1M |
| --- | --- | --- | --- | --- | --- | --- |
| USB 2.0 | 24.7 MBps | 22.8 MBps | 22.8 MBps | 21.5 MBps | 24.7 MBps | 25.6 MBps |
| USB 3.0 | 65.6 MBps | 109.0 MBps | 71.3 MBps | 107.5 MBps | 87.3 MBps | 110.0 MBps |

Quellentest: RK3126C-Prototyp, Android O + Kernel4.4. Tabelle 3-2: MTP-Raten.

|  | Read 16K | Write 16K | Read 64K | Write 64K |
| --- | --- | --- | --- | --- |
| USB 2.0 | 14.85 MBps | 7.1 MBps | 15.15 MBps | 7.8 MBps |

Ergebnisanalyse und Optimierung:

MTP nutzt Bulk. Die Quelle nennt etwa 39MBps für USB2.0 (10 Transaktionen à 512 Bytes pro 125μs) und 400MBps für USB3.0; praktisch ist MTP deutlich langsamer. Fester hoher CPU-Takt verbessert Kopieren gegenüber Skalierung. Langsamer Speicher begrenzt MTP ebenfalls stark (Abschnitt 2.1). Kernel4.4 zeigt die Dauer jedes vfs_read/vfs_write während MTP über diese Schnittstelle:

```text
cat /sys/kernel/debug/usb_mtp/status
```

Statistik zurücksetzen:

```text
echo 0 > /sys/kernel/debug/usb_mtp/status
```

USB2-AHB-CLK von 150MHz und maximaler DMA Burst können Effizienz und Durchsatz steigern. DWC2 unterstützt 512KB pro Transfer, DWC3 16MB - 1B. Größere MTP-Tx/Rx-Puffer reduzieren Interrupts (Quellenstandard 64KB). Empfohlen werden 64KB für USB2 und 1MB für USB3. Kernel4.4-Modulparameter:

- `/sys/module/usb_f_mtp/parameters/mtp_tx_req_len`: Tx-Pufferlänge in Bytes.
- `/sys/module/usb_f_mtp/parameters/mtp_tx_reqs`: Anzahl Tx-Puffer.
- `/sys/module/usb_f_mtp/parameters/mtp_rx_req_len`: Rx-Pufferlänge in Bytes.

### 3.2 USB-MSC-Durchsatz

Beispiel: Linux4.4 RK3399 EVB USB3.0 MSC. Mass storage als Modul konfigurieren.

```text
<*>   USB Gadget Support  --->
      <M>   USB Gadget Drivers
      <M>     Mass Storage Gadget
```

Diesen Kernelpatch anwenden:

```text
index f3c7f15..5418d06 100644
--- a/arch/arm64/boot/dts/rockchip/rk3399.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3399.dtsi
@@ -404,7 +404,7 @@
                        compatible = "snps,dwc3";
                        reg = <0x0 0xfe800000 0x0 0x100000>;
                        interrupts = <GIC_SPI 105 IRQ_TYPE_LEVEL_HIGH 0>;
-                       dr_mode = "otg";
+                       dr_mode = "peripheral";
                        phys = <&u2phy0_otg>, <&tcphy0_usb3>;
                        phy-names = "usb2-phy", "usb3-phy";
                        phy_type = "utmi_wide";
```

Kernel und anschließend Mass-storage-Module bauen:

```text
make ARCH=arm64 modules SUBDIRS=drivers/usb/gadget
```

Erzeugte Module:

```text
libcomposite.ko
```

```text
usb_f_mass_storage.ko
```

```text
g_mass_storage.ko
```

Nach dem Start lun0.img unter data mit dd erzeugen und Module laden.

```text
insmod libcomposite.ko
insmod usb_f_mass_storage.ko
insmod g_mass_storage.ko  file=/data/lun0.img removable=1
```

Ubuntu-PC verbinden, lun0 formatieren und vom PC auf Mass storage zugreifen. Folgende Schleife prüft die Leserate:

```text
while true;
do time dd iflag=direct,nonblock if=/media/wlf/4625f014-95f3-419c-96c9-a38f91186eb2/test0 of=/dev/null bs=1024k count=400;
done
```

Alternativ mit USB3.0-Agilent-Analysator messen (Abbildung 3-1).

![Quellenabbildung — PDF p22](/docs/rockchip-usb-performance/assets/cn-p022-figure-01.png)

Abbildung 3-1. Agilent-USB3-Messung. Quellenergebnisse: RK3399-Taktskalierung 250MBps Lesen; kleine Kerne deaktiviert, große auf 1.8 fixiert: 300MBps.

```text
3399 关闭⼩核
echo 0 > /sys/devices/system/cpu/cpu0/online
echo 0 > /sys/devices/system/cpu/cpu1/online
echo 0 > /sys/devices/system/cpu/cpu2/online
echo 0 > /sys/devices/system/cpu/cpu3/online

3399 定频⼤核
echo userspace > /sys/devices/system/cpu/cpu4/cpufreq/scaling_governor
echo 1800000 >  /sys/devices/system/cpu/cpu4/cpufreq/scaling_setspeed
```

Die Quelle folgert einen deutlichen CPU-Takteinfluss auf USB MSC: höherer Takt ergibt höhere Leserate.

### 3.3 USB-Gadget-Webcam-Durchsatz

Werkzeuge: AMCAP unter Windows, guvcview unter Ubuntu (sudo apt install guvcview). Beide zeigen Echtzeit-Bildratenstatistiken.

Gadget Webcam benötigt Kernel-UVC-Gadget-Treiber und UVC-Verarbeitung in der Anwendung. In der SDK-Generation der Quelle unterstützen Kernel3.10/4.4 Gadget-Treiber, aber nur RV1108 die Anwendung; andere Plattformen können RV1108 oder die verlinkte GitHub-Anwendung usb gadget uvc driver test application anpassen. Kernel3.10 unterstützt Isochronous und Bulk, standardmäßig isochron 1KB pro 125μs-Mikroframe. Vier Konfigurationen bieten unterschiedliche Bandbreiten/Bildraten.

Konfiguration 1 (Standard): isochron 1KB pro 125μs, maximal 8000KB beziehungsweise 7.8MB in Quellenschreibweise. Tabelle 3-3: RV1108-Maximalbildraten, Konfiguration 1.

[Quellenlink](https://github.com/lintwins/uvc-gadget)

|  | YUYV Format | MJPG Format | H264 Format |
| --- | --- | --- | --- |
| USB 2.0 | 648×480 @12fps | 1920×1080 @30fps | 1920×1080 @30fps |

UVC-Gadget-Konfiguration 2: Isochron 2KB pro 125μs-Mikroframe. Folgenden Patch anwenden. Mehr Bandbreite kann Bildflackern verursachen; dann höhere USB-QOS-Priorität, AHB CLK (aclk_peri und hclk_peri) über 150MHz und andere DMA-Effizienzmaßnahmen erwägen.

```text
diff --git a/drivers/usb/gadget/f_uvc.c b/drivers/usb/gadget/f_uvc.c
index 382536d..17eac12 100644
--- a/drivers/usb/gadget/f_uvc.c
+++ b/drivers/usb/gadget/f_uvc.c
@@ -37,7 +37,7 @@ static unsigned int streaming_interval = 1;
 module_param(streaming_interval, uint, S_IRUGO|S_IWUSR);
 MODULE_PARM_DESC(streaming_interval, "1 - 16");

-static unsigned int streaming_maxpacket = 1024;
+static unsigned int streaming_maxpacket = 2048;
```

Maximale Bandbreite: 16000KB beziehungsweise 15.62MB laut Quelle. Tabelle 3-4: RV1108-Maximalbildraten, Konfiguration 2.

|  | YUYV Format | MJPG Format | H264 Format |
| --- | --- | --- | --- |
| USB 2.0 | 648×480 @24fps | 1920×1080 @30fps | 1920×1080 @30fps |

UVC-Gadget-Konfiguration 3:

Isochron 3KB pro 125μs-Mikroframe. Folgenden Patch anwenden. Mehr Bandbreite kann Bildflackern verursachen; dann höhere USB-QOS-Priorität, AHB CLK (aclk_peri und hclk_peri) über 150MHz und andere DMA-Effizienzmaßnahmen erwägen.

```text
diff --git a/drivers/usb/gadget/f_uvc.c b/drivers/usb/gadget/f_uvc.c
index 382536d..17eac12 100644
--- a/drivers/usb/gadget/f_uvc.c
+++ b/drivers/usb/gadget/f_uvc.c
@@ -37,7 +37,7 @@ static unsigned int streaming_interval = 1;
 module_param(streaming_interval, uint, S_IRUGO|S_IWUSR);
 MODULE_PARM_DESC(streaming_interval, "1 - 16");

-static unsigned int streaming_maxpacket = 1024;
+static unsigned int streaming_maxpacket = 3072;
```

Maximale Bandbreite: 24000KB beziehungsweise 23.43MB laut Quelle. Tabelle 3-5: RV1108-Maximalbildraten, Konfiguration 3.

|  | UYV Format | MJPG Format | H264 Format |
| --- | --- | --- | --- |
| USB 2.0 | 648×480 @30fps | 1920×1080 @30fps | 1920×1080 @30fps |

UVC-Gadget-Konfiguration 4: Bulk. Folgenden Patch anwenden. Bulk unterstützt keinen Auflösungswechsel; die Quelle rät davon ab, wenn mehrere Auflösungen nötig sind.

```text
diff --git a/drivers/usb/gadget/f_uvc.c b/drivers/usb/gadget/f_uvc.c
index d146ce7..9eb7aad 100644
--- a/drivers/usb/gadget/f_uvc.c
+++ b/drivers/usb/gadget/f_uvc.c
@@ -45,7 +45,7 @@ static unsigned int streaming_maxburst;
 module_param(streaming_maxburst, uint, S_IRUGO|S_IWUSR);
 MODULE_PARM_DESC(streaming_maxburst, "0 - 15 (ss only)");

-static bool bulk_streaming_ep;
+static bool bulk_streaming_ep = true;
 module_param(bulk_streaming_ep, bool, S_IRUGO | S_IWUSR);
```

Maximale Bandbreite: 35MB laut Quelle. Tabelle 3-6: RV1108-Maximalbildraten, Konfiguration 4.

|  | UYV Format | MJPG Format | H264 Format |
| --- | --- | --- | --- |
| USB 2.0 | 648×480 > 30fps | 1920×1080 > 30fps | 1920×1080 > 30fps |

### 3.4 USB-Rndis-Durchsatz

Rndis ist TCP/IP über USB: TCP/IP auf dem Gerät lässt es als Netzwerkadapter erscheinen. Mit iperf testen (Abschnitt 2.2). Kernelkonfiguration für Linux3.10 Android Gadget USB Rndis:

```text
Device Drivers  --->
   [*] USB support  --->
       <*>   USB Gadget Support  --->
           <*>   USB Gadget Drivers (Android Composite Gadget)  --->
                 Android Composite Gadget
```

Knoten unter /sys/class/android_usb/android0/f_rndis konfigurieren den Adapter. Linux3.10-Ethernet-Gadget-USB-Rndis-Konfiguration:

```text
Device Drivers  --->
   [*] USB support  --->
       <*>   USB Gadget Support  --->
           <*>   USB Gadget Drivers (Ethernet Gadget (with CDC Ethernet support)) --->
                 Ethernet Gadget (with CDC Ethernet support)
```

Linux4.4-Configfs-USB-Rndis-Konfiguration:

```text
Device Drivers  --->
   [*] USB support  --->
       <*>   USB Gadget Support  --->
           <*>   USB Gadget Drivers (USB functions configurable through configfs) --->
                  [*]       RNDIS
```

Beispiel-Enumerationslog für Linux3.10 Android Gadget USB Rndis:

```text
shell@android:/ # setprop sys.usb.config rndis
[ 2445.809337] rndis_function_bind_config MAC: 36:C8:78:69:C5:D3
[ 2445.809532] android_usb gadget: using random self ethernet address
[ 2445.809666] android_usb gadget: using random host ethernet address
[ 2445.812255] rndis0: MAC 0a:d4:f2:e3:c5:c7
[ 2445.812330] rndis0: HOST MAC ea:88:5c:93:9d:b5   如连接window，则对应windows以太网卡MAC
[ 2446.208233] DWC_OTG: ********soft connect!!!*****************************************
[ 2446.541253] android_usb gadget: high speed config #1: android
[ 2446.542681] android_work: sent uevent USB_STATE=CONFIGURED
```

IP-Adresse setzen und rndis starten:

```text
ifconfig rndis0 192.168.1.2 up
```

Die Quelle fordert dasselbe Subnetz für 192.168.1.2 und PC und beschreibt es als 192.168.XX.XX; tatsächliche Netzmasken müssen ebenfalls passen. Konfiguration/Tests siehe Abschnitt 2.2. Der Hinweis, bei Pingproblemen Windows Firewall abzuschalten, bleibt historische Anleitung für isolierte Tests, keine allgemeine Sicherheitsempfehlung.

Originale High-Speed-Ergebnisse (Super-Speed nicht getestet): Linux3.10 Android Gadget Upload 20Mbps/Download 40Mbps; Linux3.10 Ethernet Gadget 100Mbps in beide Richtungen; Linux4.4 Configfs ebenfalls 100Mbps. Die Quelle nennt die niedrige Linux3.10-Android-Gadget-Leistung als bekanntes Optimierungsproblem.

### 3.5 USB-Gadget-HID-Durchsatz

Werkzeuge: Windows HidTest.exe, PortHelper1.7.exe oder HID API; Ubuntu hid_gadget_test aus Linux3.10 Documentation/usb/gadget_hid.txt oder HID API. Quellenfall 1 für RK3188 Gadget HID: report_length 512 bytes, Intervall 1ms, Datei 10768KB, High-Speed. PC → 3188: 249KBps; 3188 → PC: 125KBps.

[Quellenlink](http://www.signal11.us/oss/hidapi/)

Fall 2: report_length 512 bytes, Intervall 125us, Datei 10768KB, High-Speed. PC → 3188: 872KBps; 3188 → PC: 2659KBps. Der Durchsatz hängt vor allem von report_length und Interruptintervall ab. Der Quellentreiber drivers/usb/gadget/hid.c liefert keinen HID-Deskriptor; dieser ist nach Documentation/usb/gadget_hid.txt zu entwickeln. Beispiel für report_length 512bytes:

```text
index 79afa82..a05ad79 100644
--- a/drivers/usb/gadget/hid.c
+++ b/drivers/usb/gadget/hid.c
@@ -271,10 +272,93 @@ MODULE_DESCRIPTION(DRIVER_DESC);
 MODULE_AUTHOR("Fabien Chouteau, Peter Korsgaard");
 MODULE_LICENSE("GPL");

+static struct hidg_func_descriptor rk_hidg_desc = {
+   .subclass       = 0, /* No subclass */
+   .protocol       = 2, /* Keyboard */
+   .report_length      = 512,
+   .report_desc_length = 38,
+   .report_desc        = {
+       0x06, 0x00, 0xFF,    /*USAGE_PAGE (Vendor Defined Page 1)*/
+       0x09, 0x01,     /*USAGE (Vendor Usage 1)*/
+       0xA1, 0x01,         /*COLLECTION (Application)*/
+       0x09, 0x02,     /*  USAGE (Vendor Usage 2)*/
+       0x09, 0x03,     /*USAGE (Vendor Usage 3)*/
+       0x15, 0x00,         /*LOGICAL_MINIMUM (0)*/
+       0x26, 0xFF, 0x00, /*LOGICAL_MAXIMUM (255)*/
+       0x75, 0x10,         /*REPORT_SIZE (16)*/
+       0x96, 0x00, 0x01, /* REPORT_COUNT (256) */
+       0x81, 0x02,         /*INPUT (Data,Var,Abs)  */
+       0x09, 0x04,     /*USAGE (Vendor Usage 4)*/
+       0x15, 0x00,         /*LOGICAL_MINIMUM (0)   */
+       0x26, 0xFF, 0x00, /*LOGICAL_MAXIMUM (255)   */
+       0x75, 0x10,         /*REPORT_SIZE (16)*/
+       0x96, 0x00, 0x01,   /*REPORT_COUNT (256)*/
+       0x91, 0x02,         /*OUTPUT (Data,Var,Abs) */
+       0xC0            /*END_COLLECTION*/
+   }
+};
```

Für report_length 1024bytes wie folgt ändern:

```text
@@ -275,7 +275,7 @@ MODULE_LICENSE("GPL");
 static struct hidg_func_descriptor rk_hidg_desc = {
    .subclass       = 0, /* No subclass */
    .protocol       = 2, /* Keyboard */
-   .report_length      = 512,
+   .report_length      = 1024,
    .report_desc_length = 38,
    .report_desc        = {
        0x06, 0x00, 0xFF,    /*USAGE_PAGE (Vendor Defined Page 1)*/
@@ -285,13 +285,13 @@ static struct hidg_func_descriptor rk_hidg_desc = {
        0x09, 0x03,     /*USAGE (Vendor Usage 3)*/
        0x15, 0x00,         /*LOGICAL_MINIMUM (0)*/
        0x26, 0xFF, 0x00, /*LOGICAL_MAXIMUM (255)*/
-       0x75, 0x10,         /*REPORT_SIZE (16)*/
+       0x75, 0x20,         /*REPORT_SIZE (32)*/
        0x96, 0x00, 0x01, /* REPORT_COUNT (256) */
        0x81, 0x02,         /*INPUT (Data,Var,Abs)  */
        0x09, 0x04,     /*USAGE (Vendor Usage 4)*/
        0x15, 0x00,         /*LOGICAL_MINIMUM (0)   */
        0x26, 0xFF, 0x00, /*LOGICAL_MAXIMUM (255)   */
-       0x75, 0x10,         /*REPORT_SIZE (16)*/
+       0x75, 0x20,         /*REPORT_SIZE (32)*/
        0x96, 0x00, 0x01,   /*REPORT_COUNT (256)*/
        0x91, 0x02,         /*OUTPUT (Data,Var,Abs) */
        0xC0            /*END_COLLECTION*/
```

HID-Interruptintervall über bInterval in hidg_hs_in_ep_desc und hidg_hs_out_ep_desc unter drivers/usb/gadget/f_hid.c ändern. Quellenstandard ist 4 (1ms), Minimum 1 (125us).

{% endraw %}
