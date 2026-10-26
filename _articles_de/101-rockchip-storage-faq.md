---
title: "Vollständige Rockchip-Speicher-FAQ: Flashen, UBIFS, EMMC, NAND, SPI-NOR und Schnellstart"
description: "Vollständige Rockchip-Speicher-FAQ: Flashen, UBIFS, EMMC, NAND, SPI-NOR und Schnellstart — RK-PC-YF-133 V2.2.0; MTD, FTL, CONT_READ, AUTO_MERGE."
translation_key: "101-rockchip-storage-faq"
slug: "101-rockchip-storage-faq"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "Storage", "UBIFS", "EMMC", "SPI NAND", "SPI NOR"]
excerpt: "Vollständige Rockchip-Speicher-FAQ: Flashen, UBIFS, EMMC, NAND, SPI-NOR und Schnellstart — RK-PC-YF-133 V2.2.0; MTD, FTL, CONT_READ, AUTO_MERGE."
---

{% raw %}

# Vollständige Rockchip-Speicher-FAQ: Flashen, UBIFS, EMMC, NAND, SPI-NOR und Schnellstart

Dieser Artikel bewahrt den vollständigen technischen Text des chinesischen RK-PC-YF-133 / V2.2.0, Seiten 6–55: alle zehn Kapitel, Fragen/Antworten, Protokolle, Befehle, Parameter, Tabellen, Patches und Bilder. Ein englisches Gegenstück liegt nicht vor. Englisch, Russisch und Deutsch sind vollständig aus dem Chinesischen übersetzt; alle vier verwenden chinesische Originalbilder mit lokalisierten Bildunterschriften, keine angeblichen englischen Bilder. Die Quelle nennt „alle Produkte“ ohne Kernelversion, während Beispiele mehrere SoCs, SDKs und Kernelzweige betreffen. Dies belegt keine Unterstützung jeder ArmSoM-Platine. SoC, Flash/EMMC und Versorgung/I/O, SDK/BSP, Loader, U-Boot, Kernel, MTD/rkflash/rknand und Partitionierung prüfen. Hersteller-/Kundentests, Raten und Lebensdauerwerte sind Quellbeispiele; es erfolgte keine ArmSoM-Hardwarevalidierung.

> Sicherheit: Beispiele enthalten vollständiges Löschen, ubiformat, Flashen, Neupartitionierung, Kurzschließen von Pins und Timingbeschleunigung. Irreversibler Daten-/Identitätsverlust, Startausfall und Hardwaregefahr sind möglich. Nicht direkt auf Produktionsgeräten ausführen; zuerst sichern und Schaltplan/BSP prüfen. Diese Seite führt keine Befehle aus. Quellenunklarheiten wie „ubifs ohne Integritätsprüfung“ in §2.13 TEST02, zwei TYPE_B-EXT-CSD-Felder, fopen mit open-Flags in §4.5 sowie widersprüchliche Überschriften/Pfade bleiben erläutert erhalten.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel) · [EDITORIAL-NOTES](/docs/rockchip-storage-faq/EDITORIAL-NOTES.md)

<!-- Chinese PDF p.6 -->

## 1. Probleme beim Flashen

<!-- Chinese PDF p.6 -->

### 1.1 Rolle des Loaders beim Flashen

<!-- Chinese PDF p.6 -->

![1.1 Rolle des Loaders beim Flashen: chinesische Originalabbildung, Seite 6](/docs/rockchip-storage-faq/assets/cn-p006-figure-01.png)

*1.1 Rolle des Loaders beim Flashen: chinesische Originalabbildung, Seite 6*

<!-- Chinese PDF p.6 -->

### 1.2 Fehler des Flash-Werkzeugs

<!-- Chinese PDF p.6 -->

Werkzeugoberfläche:

<!-- Chinese PDF p.6 -->

![1.2 Fehler des Flash-Werkzeugs: chinesische Originalabbildung, Seite 6](/docs/rockchip-storage-faq/assets/cn-p006-figure-02.png)

*1.2 Fehler des Flash-Werkzeugs: chinesische Originalabbildung, Seite 6*

<!-- Chinese PDF p.6 -->

Werkzeugprotokoll:

<!-- Chinese PDF p.6 -->

```text
18:05:40 125    Layer<1-1-2-3-1>:下载Boot成功
18:05:40 127    Layer<1-1-2-3-1>:等待Maskrom开始
18:05:40 552    Layer<1-1-2-3-1>:等待Maskrom成功
18:05:40 557    Layer<1-1-2-3-1>:测试设备开始
18:05:40 572    Layer<1-1-2-3-1>:测试设备成功
18:05:40 583    Layer<1-1-2-3-1>:校验芯⽚开始
18:05:40 592    Layer<1-1-2-3-1>:校验芯⽚成功
18:05:40 600    Layer<1-1-2-3-1>:获取FlashInfo开始
18:05:40 606    <LAYER 1-12-3-1> INFO:FlashInfo: 00 00 00 00 00 04 04 00 28 00 00
18:05:40 615    <LAYER 1-12-3-1> INFO:GetFlashInfo-->Emmc storage.
18:05:40 626    Layer<1-1-2-3-1>:获取FlashInfo成功
18:05:40 640    Layer<1-1-2-3-1>:准备IDB开始
18:05:40 645    <LAYER 1-12-3-1> ERROR:PrepareIDB-->No Found 1st Flash CS
18:05:40 663    Error:Layer<1-1-2-3-1>:准备IDB失败
18:05:40 686    Layer<1-12-3-1>: RunProc is ending, ret=0
```

<!-- Chinese PDF p.7 -->

UART-Ausgabe des Geräts:

<!-- Chinese PDF p.7 -->

```text
ddr.bin log:     DDR Version V1.30 20191125
ddr.bin log:     REG2C: 0x00000031, 0x00000031
ddr.bin log:     In
ddr.bin log:     451MHz
ddr.bin log:     DDR2
ddr.bin log:     Col=10 Bank=2 Row=13 Size=64MB
ddr.bin log:     msch:0
ddr.bin log:     OUT
usbplug log:     Boot1 Release Time: Dec  7 2020 11:25:17, version: 1.25
usbplug log:     chip_id:000000,0
usbplug log:     DPLL = 1300 MHz
usbplug log:     ...nandc_flash_init enter...
usbplug log:     No.1 FLASH ID:ff ff ff ff ff ff                          /* flash id 全 FF，未探测到 SLC Nand */
usbplug log:     DPLL = 1300 MHz
usbplug log:     sfc nor id: ff ff ff                                     /* flash id 全 FF，未探测到 SPI Nor */
usbplug log:     DPLL = 1300 MHz
usbplug log:     sfc_nand id: ff ff ff                                    /* flash id 全 FF，未探测到 SPI Nand */
usbplug log:     UsbBoot ...11943
usbplug log:     powerOn 664713
```

<!-- Chinese PDF p.7 -->

Analyse:

<!-- Chinese PDF p.7 -->

**1.** Bei auffälligen ddr.bin-Protokollen einen DDR-Entwickler hinzuziehen.

<!-- Chinese PDF p.7 -->

**2.** Bei parallelem SLC-NAND, SPI-NAND oder SPI-NOR weist eine nur aus FF bestehende Flash-ID beim Upgrade meist auf Probleme mit VCC, I/O-Pegel oder Lötstellen hin.

<!-- Chinese PDF p.7 -->

**3.** Ist die Flash-ID korrekt, erscheint aber “The device not support yet!”, obwohl die Plattform in RK SpiNor and SLC Nand SupportList unterstützt wird, fehlt diese Bausteinunterstützung in der alten Firmware. Zuerst den Speichertreiber aktualisieren: Redmine → FAE-Projekt → Dokumente → Nand-flash-Freigabeliste → Speicherpatch-Link.

<!-- Chinese PDF p.7 -->

**4.** Schlägt der Download nach der Aktualisierung weiterhin fehl, die RK-Speicherentwickler hinzuziehen.

<!-- Chinese PDF p.7 -->

### 1.3 SLC-NAND-Image startet nicht

<!-- Chinese PDF p.8 -->

#### 1.3.1 pin38-Funktion ist aktiviert

<!-- Chinese PDF p.8 -->

Typisches Programmierprotokoll:

<!-- Chinese PDF p.8 -->

```text
prog read s error: = 7fc00 1fff0e0 ffffffff
prog read d error: = 7fc00 0 ffffffff
phyBlk = 0x1ff die = 0 block_in_die = 0x1ff 0x80000000
prog read s error: = 7f800 1fef0e0 ffffffff
prog read d error: = 7f800 0 ffffffff
phyBlk = 0x1fe die = 0 block_in_die = 0x1fe 0xc0000000
prog read s error: = 7f400 1fdf0e0 ffffffff
prog read d error: = 7f400 0 ffffffff
```

<!-- Chinese PDF p.8 -->

Prüfen, ob Flash-pin38 eine Funktion hat und auf dem deaktivierenden Pegel liegt:

- Lock#: üblicherweise aktiv-low mit schwachem internem Pull-up. Gemäß Datenblatt offen lassen oder externen Pull-up vorsehen.
- PT: üblicherweise aktiv-high mit schwachem internem Pull-down. Gemäß Datenblatt offen lassen oder externen Pull-down vorsehen.
- NC: ohne Funktion; offen lassen.

<!-- Chinese PDF p.8 -->

### 1.4 SPI-NAND-Start bleibt in SPL stehen

<!-- Chinese PDF p.8 -->

Das folgende Protokoll zeigt fehlende SPI-NAND-Softwareunterstützung im SDK. Den passenden Speicherpatch unter Redmine → FAE-Projekt → Dokumente → Nand-flash-Freigabeliste beziehen.

<!-- Chinese PDF p.8 -->

```text
DDR Version V1.04 20201030
DDR, 328MHz
BW=32 Col=10 Bk=8 CS0 Row=15 CS=1 Die BW=16 Size=1024MB
change to 328MHz
change to 528MHz
change to 784MHz
change to 924MHz(final freq)
out
U-Boot SPL board init
U-Boot SPL 2017.09.g2d25c32e07-201118 #huke (Feb 26 2021 - 13:51:03)
unknown raw ID phN    # 该 log 说明 spl 驱动未⽀持该颗粒，需重新编译 spl，且核对并更新 uboot, kernel 对
应补丁
unrecognized JEDEC id bytes: ff, 98, ed
Tring to boot from MMC1
Card did not respond to voltage select!
mmc_init: -95, time 9
spl: mmc init failed with error: -95
SPL: failed to boot from all boot devices
### ERROR ### Please RESET the board ###
# Reset the board to bootrom #
```

<!-- Chinese PDF p.8 -->

### 1.5 maskrom-Modus aufrufen

<!-- Chinese PDF p.8 -->

**1.** Mit maskrom-Taste: reset halten, maskrom drücken, reset loslassen (das Werkzeug sollte maskrom anzeigen), dann maskrom loslassen. Zur Vermeidung von Fehlern die Reihenfolge einhalten.

<!-- Chinese PDF p.8 -->

**2.** Ohne maskrom-Taste: Die Quelle ersetzt diese durch Kurzschließen der Flash-Datenleitung io0 gegen Masse. Dies ist ein Quellverfahren, keine platinenunabhängige Verdrahtungsanweisung; vor Hardwareeingriffen den tatsächlichen Schaltplan prüfen.

<!-- Chinese PDF p.9 -->

### 1.6 SPL separat bauen und testen

<!-- Chinese PDF p.9 -->

Das Buildverfahren ändern. Das SDK verwendet vorgefertigte SPL-Firmware aus rkbin/bin/xx/. Der mit ./build.sh u-boot erzeugte Loader enthält daher nicht zwangsläufig die gerade kompilierte SPL. Für die eigene SPL folgende Befehle verwenden:

<!-- Chinese PDF p.9 -->

```text
cd uboot
./make.sh rv1126
./make.sh spl-s
```

<!-- Chinese PDF p.9 -->

Ausgaben unter uboot: rv1126_spl_loader_vxxx.xxx.bin und uboot.img. Diese loader.bin und uboot.img verwenden.

Das SPL-Update anhand des Protokolls prüfen, etwa “U-Boot SPL 2017.09-gf899931b5f-201209 #ldq (Dec 10 2020 - 15:34:13)”. Es muss die selbst kompilierte Version ausweisen.

Zum Ersetzen der SDK-SPL die kompilierte uboot/spl/u-boot-spl.bin anstelle von ./rkbin/bin/xx/xxxx_spl_xxxx.bin einsetzen.

<!-- Chinese PDF p.9 -->

### 1.7 Flash-Images und Debuginformationen abrufen

<!-- Chinese PDF p.9 -->

#### 1.7.1 Export Image

<!-- Chinese PDF p.9 -->

Android tool: Firmware im maskrom-Modus exportieren:

<!-- Chinese PDF p.9 -->

![1.7.1 Export Image: chinesische Originalabbildung, Seite 9](/docs/rockchip-storage-faq/assets/cn-p009-figure-01.png)

*1.7.1 Export Image: chinesische Originalabbildung, Seite 9*

<!-- Chinese PDF p.9 -->

Export im Loader-Modus: Kein Loader-Download erforderlich; die Adresse direkt im Werkzeug eingeben.

Linux upgrade tool und Android_Console_Tool: Export im maskrom-Modus:

<!-- Chinese PDF p.10 -->

```text
db MiniloadAll.bin
rl 0x0 0x10000 Exportimage.bin
```

<!-- Chinese PDF p.10 -->

Export im Loader-Modus:

<!-- Chinese PDF p.10 -->

```text
rl 0x0 0x10000 Exportimage.bin
```

<!-- Chinese PDF p.10 -->

Hinweis: Sektoradressen verwenden 512B per sector.

Toolskit:

<!-- Chinese PDF p.10 -->

![1.7.1 Export Image: chinesische Originalabbildung, Seite 10](/docs/rockchip-storage-faq/assets/cn-p010-figure-01.png)

*1.7.1 Export Image: chinesische Originalabbildung, Seite 10*

<!-- Chinese PDF p.10 -->

#### 1.7.2 Dump All

<!-- Chinese PDF p.10 -->

Ein spezieller Loader mit Endung dump_all.bin exportiert RK-FTL-spezifische Flash-Informationen.

<!-- Chinese PDF p.11 -->

![1.7.2 Dump All: chinesische Originalabbildung, Seite 11](/docs/rockchip-storage-faq/assets/cn-p011-figure-01.png)

*1.7.2 Dump All: chinesische Originalabbildung, Seite 11*

<!-- Chinese PDF p.11 -->

#### 1.7.3 Flash Stress Test

<!-- Chinese PDF p.11 -->

Ein spezieller Loader mit Endung stress_test.bin führt einen einfachen Flash-Lese-/Schreib-/Lösch-Stresstest aus.

<!-- Chinese PDF p.11 -->

![1.7.3 Flash Stress Test: chinesische Originalabbildung, Seite 11](/docs/rockchip-storage-faq/assets/cn-p011-figure-02.png)

*1.7.3 Flash Stress Test: chinesische Originalabbildung, Seite 11*

<!-- Chinese PDF p.11 -->

#### 1.7.4 Flash Erase All

<!-- Chinese PDF p.11 -->

Ein spezieller Loader mit Endung erase_all.bin löscht sämtliche Flash-Daten.

<!-- Chinese PDF p.12 -->

![1.7.4 Flash Erase All: chinesische Originalabbildung, Seite 12](/docs/rockchip-storage-faq/assets/cn-p012-figure-01.png)

*1.7.4 Flash Erase All: chinesische Originalabbildung, Seite 12*

<!-- Chinese PDF p.12 -->

## 2. Dateisystemprobleme

<!-- Chinese PDF p.12 -->

### 2.1 UBIFS-Partition vor Upgrade nicht vollständig gelöscht

<!-- Chinese PDF p.12 -->

Vor dem Upgrade eines UBIFS-Images die gesamte Zielpartition löschen oder vorzugsweise ubiupdatevol verwenden. Typische Fehler:

<!-- Chinese PDF p.12 -->

```text
...
[    4.452318] ubi0: attaching mtd5
[    4.685258] ubi0 error: ubi_attach: bad image sequence number 1251817256 in PEB 543, expected
1051610977
[    4.685317] Erase counter header dump:
[    4.685334]  magic          0x55424923
[    4.685348]  version        1
[    4.685361]  ec             1
[    4.685374]  vid_hdr_offset 2048
[    4.685386]  data_offset    4096
[    4.685400]  image_seq      1251817256
[    4.685413]  hdr_crc        0x88225c8a
[    4.685426] erase counter header hexdump:
[    4.685753] ubi0 error: ubi_attach_mtd_dev: failed to attach mtd5, error -22
[    4.685814] UBI error: cannot attach mtd5
...
[    4.695772] ALSA device list:
[    4.695796]   #7: Loopback 1
[    4.696063] VFS: Cannot open root device "ubi0:rootfs" or unknown-block(0,0): error -19
[    4.696091] Please append a correct "root=" boot option; here are the available partitions:
...
```

<!-- Chinese PDF p.12 -->

Empfohlene Werkzeugversionen:

<!-- Chinese PDF p.13 -->

Windows rkdevtool ab v2.79; Linux_Upgrade_Tool ab v1.59.

<!-- Chinese PDF p.13 -->

### 2.2 UBIFS-Image passt nicht zur Flash-Geometrie

<!-- Chinese PDF p.13 -->

Prüfen, ob Flash-bezogene mkfs-Optionen wie -e und -m zum Baustein passen. Andernfalls findet das gestartete System die UBI-Informationen nicht. Typische Fehler — Fall 1:

<!-- Chinese PDF p.13 -->

```text
...
[    1.319729] ubi0: attaching mtd3
[    1.549286] ubi0: scanning is finished
[    1.549326] ubi0 error: ubi_read_volume_table: the layout volume was not found
[    1.549464] ubi0 error: ubi_attach_mtd_dev: failed to attach mtd3, error -22
[    1.549499] UBI error: cannot attach mtd3
...
[    1.563848]   #7: Loopback 1
[    1.564173] UBIFS error (pid: 1): cannot open "ubi0:rootfs", error -19VFS: Cannot open root device
"ubi0:rootfs" or unknown-block(0,0): error -19
...
```

<!-- Chinese PDF p.13 -->

Fall 2: tatsächliche Seitengröße 4KB, Image-Seitengröße 2KB.

<!-- Chinese PDF p.13 -->

```text
[    0.517603] ubi0 error: validate_ec_hdr: bad VID header offset 2048, expected 4096
[    0.517618] ubi0 error: validate_ec_hdr: bad EC header
[    0.517626] Erase counter header dump:
[    0.517634]  magic          0x55424923
[    0.517639]  version        1
[    0.517645]  ec             0
[    0.517650]  vid_hdr_offset 2048
[    0.517657]  data_offset    4096
[    0.517664]  image_seq      2053699779
[    0.517672]  hdr_crc        0x2416c7f2
[    0.517679] erase counter header hexdump:
[    0.517701] CPU: 0 PID: 1 Comm: swapper/0 Not tainted 4.19.111 #2
```

<!-- Chinese PDF p.13 -->

Fall 3: tatsächliche Seitengröße 2KB, Image-Seitengröße 4KB.

<!-- Chinese PDF p.13 -->

```text
[    1.678775] ubi0: attaching mtd6
[    1.679040] ubi0 error: validate_ec_hdr: bad VID header offset 4096, expected 2048
[    1.679054] ubi0 error: validate_ec_hdr: bad EC header
[    1.679068] Erase counter header dump:
[    1.679079]  magic          0x55424923
[    1.679090]  version        1
[    1.679101]  ec             0
[    1.679110]  vid_hdr_offset 4096
[    1.679120]  data_offset    8192
[    1.679131]  image_seq      362848614
[    1.679141]  hdr_crc        0x9438b345
[    1.679157] erase counter header hexdump:
[    1.679195] CPU: 0 PID: 1 Comm: swapper/0 Not tainted 4.19.172 #8
[    1.679207] Hardware name: Rockchip RK3566 For 360 X200 (DT)
[    1.679220] Call trace:
[    1.679238]  dump_backtrace+0x0/0x178
```

<!-- Chinese PDF p.14 -->

### 2.3 UBIFS-Image größer als Partition

<!-- Chinese PDF p.14 -->

Das Image verkleinern oder die Partition vergrößern. Typische Fehler:

<!-- Chinese PDF p.14 -->

```text
[    2.121208] ubi0 error: vtbl_check: too large reserved_pebs 824, good PEBs 767
[    2.121295] ubi0 error: vtbl_check: volume table check failed: record 0, error 9
[    2.121338] Volume table record 0 dump:
[    2.121375]  reserved_pebs   824
[    2.121412]  alignment       1
[    2.121449]  data_pad        0
[    2.121529]  vol_type        1
[    2.121568]  upd_marker      0
[    2.121605]  name_len        6
[    2.121642]  name            rootfs
[    2.121680]  crc             0x9ab0c6a3
[    2.122162] ubi0 error: ubi_attach_mtd_dev: failed to attach mtd3, error -22
[    2.122278] UBI error: cannot attach mtd3
```

<!-- Chinese PDF p.14 -->

### 2.4 UBIFS-Firmwareende beschädigt

<!-- Chinese PDF p.14 -->

Dieses Problem erfordert weitere Untersuchung. Typische Fehler:

<!-- Chinese PDF p.14 -->

```text
[    1.867789] ALSA device list:
[    1.867830]   #7: Loopback 1
[    1.916907] UBIFS (ubi0:0): UBIFS: mounted UBI device 0, volume 0, name "rootfs", R/O mode
[    1.917010] UBIFS (ubi0:0): LEB size: 126976 bytes (124 KiB), min./max. I/O unit sizes: 2048 bytes/2048
bytes
[    1.917061] UBIFS (ubi0:0): FS size: 103231488 bytes (98 MiB, 813 LEBs), journal size 9023488 bytes (8
MiB, 72 LEBs)
[    1.917106] UBIFS (ubi0:0): reserved for root: 0 bytes (0 KiB)
[    1.917155] UBIFS (ubi0:0): media format: w4/r0 (latest is w5/r0), UUID 1C1DDBB4-77E6-4AA9-855F-
ED8F10EB5916, small LPT model
```

<!-- Chinese PDF p.14 -->

### 2.5 UBIFS-Journalreservierung zu groß

<!-- Chinese PDF p.14 -->

UBIFS ist ein Journaling-Dateisystem. Ein zu großes Journal in einer kleinen Partition kann das Mounten verhindern. Folgenden Parameter prüfen:

<!-- Chinese PDF p.14 -->

```text
-j, --jrn-size=SIZE       journal size
```

<!-- Chinese PDF p.14 -->

Typische Fehlermeldungen:

<!-- Chinese PDF p.14 -->

```text
[root@RV1126_RV1109:/]# mount -t ubifs /dev/ubi2_0 /record/
[   65.788339] UBIFS error (ubi2:0 pid 890): ubifs_read_superblock: mount: mounting /dev/ubi2_0 on
/record/ failed: Invalid argument
too large journal size (8388608 bytes), only 3555328 bytes available in the main area
[   65.78[root@RV1126_RV1109:/]# 8394] UBIFS error (ubi2:0 pid 890): ubifs_read_superblock: bad
superblock, error 1
[   65.788413]  magic          0x6101831
[   65.788434]  crc            0x663d9574
[   65.788455]  node_type      6 (superblock node)
[   65.788475]  group_type     0 (no node group)
[   65.788493]  sqnum          1
[   65.788512]  len            4096
[   65.788531]  key_hash       0 (R5)
[   65.788620]  key_fmt        0 (simple)
[   65.788639]  flags          0x4
[   65.788660]  big_lpt        0
[   65.788684]  space_fixup    1
[   65.788706]  min_io_size    2048
[   65.788728]  leb_size       126976
[   65.788755]  leb_cnt        39
[   65.788773]  max_leb_cnt    2048
[   65.788786]  max_bud_bytes  8388608
[   65.788799]  log_lebs       5
[   65.788812]  lpt_lebs       2
[   65.788826]  orph_lebs      1
[   65.788838]  jhead_cnt      1
[   65.788851]  fanout         8
[   65.788864]  lsave_cnt      256
[   65.788877]  default_compr  1
[   65.788890]  rp_size        0
[   65.788905]  rp_uid         0
[   65.788918]  rp_gid         0
[   65.788931]  fmt_version    4
[   65.788945]  time_gran      1000000000
[   65.788961]  UUID           DBC08BA0-15FE-49BD-BC47-8A9200F1D625
```

<!-- Chinese PDF p.15 -->

### 2.6 SquashFS auf UBI-Block ohne ZLIB-Unterstützung

<!-- Chinese PDF p.15 -->

CONFIG_SQUASHFS_ZLIB aktivieren. Typische Fehler:

<!-- Chinese PDF p.15 -->

```text
[    4.564088] rockchip-mipi-dphy-rx: No link between dphy and sensor
[    4.564102] rkisp0: update sensor failed
[    4.564181] ALSA device list:
[    4.564191]   #0: rockchip,rk809-codec
[    4.564200]   #7: Loopback 1
[    4.566057] squashfs: SQUASHFS error: Filesystem uses "zlib" compression. This is not supported
[    4.566158] List of all partitions:
[    4.566179] fd00           31792 ubiblock0_0
[    4.566181]  (driver?)
[    4.566196] No filesystem could mount root, tried:
[    4.566197]  squashfs
[    4.566206]
[    4.566225] Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(253,0)
[    4.570008] CPU: 3 PID: 1 Comm: swapper/0 Not tainted 4.19.149 #3
[    4.570547] Hardware name: Generic DT based system
[    4.570993] [<b010f47c>] (unwind_backtrace) from [<b010b9a8>] (show_stack+0x10/0x14)
[    4.571677] [<b010b9a8>] (show_stack) from [<b0827b68>] (dump_stack+0x90/0xa4)
[    4.572317] [<b0827b68>] (dump_stack) from [<b01264fc>] (panic+0x114/0x2a0)
[    4.572962] [<b01264fc>] (panic) from [<b0c013a8>] (mount_block_root+0x2a4/0x2f4)
[    4.573629] [<b0c013a8>] (mount_block_root) from [<b0c015d0>] (prepare_namespace+0x150/0x1
```

<!-- Chinese PDF p.16 -->

### 2.7 UBIFS-Image auf zu kleiner leerer Partition nicht mountbar

<!-- Chinese PDF p.16 -->

Minimale UBIFS-Partition:

<!-- Chinese PDF p.16 -->

```text
Minimum block num = 4（固定预留） + B + 17  /* B - 为坏块替换预留的 f1ash blocks,与 ubiattach - b 参数相
关 */
```

<!-- Chinese PDF p.16 -->

Den Wert anhand des ubiattach-Protokolls bestimmen, zum Beispiel:

<!-- Chinese PDF p.16 -->

```text
ubi4: available PEBs: 7, total reserved PEBs: 24, PEBs reserved for bad PEB handling: 20   /* B = 20 */
```

<!-- Chinese PDF p.16 -->

Ist available PEBs + total reserved PEBs der Partition kleiner als Minimum block num, meldet der Mountvorgang:

<!-- Chinese PDF p.16 -->

```text
mount: mounting /dev/ubi4_0 on userdata failed: Invalid argument
```

<!-- Chinese PDF p.16 -->

### 2.8 LZO oder ZLIB für UBIFS

<!-- Chinese PDF p.16 -->

Das RK SDK verwendet standardmäßig LZO. In einem Quellbeispiel werden 103M auf 80M komprimiert; ZLIB erreicht ein ähnliches Verhältnis. Für höhere Kompression SquashFS verwenden.

<!-- Chinese PDF p.16 -->

### 2.9 Entpacktes UBIFS-Image übersteigt Partition

<!-- Chinese PDF p.16 -->

UBIFS-Images verwenden normalerweise autoresize. Eine Größenangabe in der Konfiguration des folgenden Befehls kann dazu führen, dass das entpackte Image die Partition übersteigt:

<!-- Chinese PDF p.16 -->

```text
ubinize -o ubi.img -m 2048 -p 128kiB -O 2048 ubinize.cfg

//ubinize.cfg
[ubifs]
  mode=ubi
  image=ubifs.img
  vol_id=0
  vol_size=192MB                // ⽆需指定⼤⼩，使⽤ autoresize 特性
  vol_type=dynamic
  vol_name=rootfs
  vol_flags=autoresize
```

<!-- Chinese PDF p.16 -->

Typische Fehlermeldungen:

<!-- Chinese PDF p.16 -->

```text
[    2.345243] ubi0: attaching mtd2
[    2.415631] ubi0: scanning is finished
[    2.419742] ubi0 error: vtbl_check: too large reserved_pebs 1586, good PEBs 699
[    2.419785] ubi0 error: vtbl_check: volume table check failed: record 0, error 9
[    2.419792] Volume table record 0 dump:
[    2.419798]  reserved_pebs   1586
[    2.419803]  alignment       1
[    2.419808]  data_pad        0
[    2.419813]  vol_type        1
[    2.419818]  upd_marker      0
[    2.419823]  name_len        6
[    2.419829]  name            rootfs
[    2.419835]  crc             0x23e79a61
[    2.420000] ubi0 error: ubi_attach_mtd_dev: failed to attach mtd2, error -22
[    2.420024] UBI error: cannot attach mtd2
```

<!-- Chinese PDF p.17 -->

UBIFS lässt sich nach einem Loader-Upgrade mit geänderter GPT nicht mounten. Im RK-SDK-MTD-Startschema wird dabei anhand der alten, beim U-Boot-Start erzeugten Bad-Block-Zuordnung geschrieben. Loader-Upgrades unterstützen deshalb nur unveränderte GPT-Layouts; andernfalls in maskrom wechseln. Typische Protokolle nach fehlerhaftem Upgrade — Fall 1:

<!-- Chinese PDF p.17 -->

```text
[    0.659432] ubi0: attaching mtd3
[    1.264467] ubi0: scanning is finished
[    1.271151] ubi0 warning: ubi_read_volume_table: static volume 0 misses 1 LEBs - corrupted
[    1.302342] ubi0: volume 0 ("rootfs") re-sized from 613 to 636 LEBs
[    1.303492] ubi0: attached mtd3 (name "rootfs", size 85 MiB)
[    1.303526] ubi0: PEB size: 131072 bytes (128 KiB), LEB size: 126976 bytes
[    1.303533] ubi0: min./max. I/O unit sizes: 2048/2048, sub-page size 2048
[    1.303540] ubi0: VID header offset: 2048 (aligned 2048), data offset: 4096
[    1.303547] ubi0: good PEBs: 677, bad PEBs: 3, corrupted PEBs: 0
[    1.303559] ubi0: user volume: 1, internal volumes: 1, max. volumes count: 128
[    1.303568] ubi0: max/mean erase counter: 1/0, WL threshold: 4096, image sequence number:
980761742
[    1.303578] ubi0: available PEBs: 0, total reserved PEBs: 677, PEBs reserved for bad PEB handling: 37
[    1.303599] ubi0: background thread "ubi_bgt0d" started, PID 80
```

<!-- Chinese PDF p.17 -->

Fall 2:

<!-- Chinese PDF p.17 -->

```text
[11:34:08:931][    0.661124] ubi0: attaching mtd6
[11:34:08:931][    0.662524] ubi0 error: ubi_attach: bad image sequence number 67638577 in PEB 1,
expected 980761742
[11:34:08:931][    0.662571] Erase counter header dump:
[11:34:08:931][    0.662578]  magic          0x55424923
[11:34:08:931][    0.662584]  version        1
[11:34:08:931][    0.662590]  ec             0
[11:34:08:931][    0.662595]  vid_hdr_offset 2048
[11:34:08:931][    0.662601]  data_offset    4096
[11:34:08:931][    0.662606]  image_seq      67638577
[11:34:08:947][    0.662611]  hdr_crc        0x3a381cee
[11:34:08:947][    0.662616] erase counter header hexdump:
[11:34:08:949][    0.662645] ubi0 error: ubi_attach_mtd_dev: failed to attach mtd6, error -22
[11:34:08:949][    0.662675] UBI error: cannot attach mtd6
[11:34:08:949][    0.662691] UBI: block: can't open volume on ubi0_-1, err=-19
```

<!-- Chinese PDF p.18 -->

### 2.10 UBIFS-Unterstützung auf SPI-NOR

<!-- Chinese PDF p.18 -->

Wichtig: Für SPI-NOR wird JFFS2 als beschreibbares Dateisystem empfohlen. Kernelkonfiguration:

<!-- Chinese PDF p.18 -->

```text
CONFIG_MTD_SPI_NOR_USE_4K_SECTORS = n
```

<!-- Chinese PDF p.18 -->

Image erstellen:

<!-- Chinese PDF p.18 -->

```text
mkfs.ubifs -r data/ -m 1 -e 65408 -c 62 userdata.ubifs
ubinize -o ubi.img -m 1 -p 64KiB -O 64 ubinize_userdata.cfg

(cid:0)(cid:0)(cid:0)(cid:0)(cid:0)(cid:0)(cid:0)  ubifs cat ubinize_userdata.cfg
[userdata-volume]
mode=ubi
image=userdata.ubifs
vol_id=0
vol_size=2MiB
vol_type=dynamic
vol_name=userdata
vol_flags=autoresize
```

<!-- Chinese PDF p.18 -->

Erklärung: 4KB-Löschen wird nicht unterstützt, da c->leb_size < UBIFS_MIN_LEB_SZ. UBIFS_MIN_LEB_SZ beträgt 15KB; leb_size hängt von den MTD-Eigenschaften ab.

<!-- Chinese PDF p.18 -->

### 2.11 UBIFS-userdata durch Formatierung wiederherstellen

<!-- Chinese PDF p.18 -->

Vorschlag zur userdata-Wiederherstellung durch Low-Level-Formatierung:

- Häufig geschriebene Dateien in einer Partition ablegen.
- Dort keine unwiederherstellbaren Dateien speichern.
- Bei Mountfehlern die Partition formatieren und wesentliche Daten neu erzeugen, damit das Gerät weiterarbeiten kann.

Referenzbefehle zur Formatierung:

<!-- Chinese PDF p.18 -->

```text
ubidetach -m 7
ubiformat -y /dev/mtd7
ubiattach /dev/ubi_ctrl -m 7 -d 7
ubimkvol /dev/ubi7 -N userdata -m
mount -t ubifs /dev/ubi7_0 /userdata
```

<!-- Chinese PDF p.19 -->

### 2.12 UBIFS-Fehler durch falschen vol_name

<!-- Chinese PDF p.19 -->

Fehlerprotokoll:

<!-- Chinese PDF p.19 -->

```text
[    6.278922] VFS: Cannot open root device "ubi0:rootfs" or unknown-block(0,0): error -19
[    6.278943] Please append a correct "root=" boot option; here are the available partitions:
```

<!-- Chinese PDF p.19 -->

Erklärung: vol_name der rootfs-Partition wurde nicht als rootfs definiert.

<!-- Chinese PDF p.19 -->

### 2.13 Lange Startzeit von SquashFS auf UBI

<!-- Chinese PDF p.19 -->

Für SPI-NAND-Produkte, bei denen Dateisystemzuverlässigkeit wichtiger als Startzeit ist, empfiehlt die Quelle beim Erstellen des SquashFS-UBI-Images static volume, damit beim Einschalten die Integrität geprüft wird. Das beschriebene RK SDK aktiviert dies standardmäßig. Bei Änderungen muss die Datenintegritätsprüfung selbst gewährleistet werden.

Problem: Kunden- und lokale Tests der Quelle zeigten für SquashFS auf SPI-NAND-UBI-Images etwa eine Sekunde Ladezeit je 10MB; eine 50MB-UBI-Partition konnte fünf Sekunden benötigen. Dies sind Quelltests, keine ArmSoM-Messungen.

Analyse: UBI-Images können static- oder dynamic-Volumes verwenden. Static ist schreibgeschützt und prüft beim Start-Mount die CRC des gesamten Images; dies eignet sich zur zusätzlichen Prüfung von Images ohne Dateisystem, etwa kernel/initramdisk. Dynamic unterstützt Lesen und Schreiben.

Die UBIFS-Dokumentation erläutert, warum ein dynamic-Volume schneller zugänglich ist als ein gleich großes static-Volume. Statische UBI-Volumes waren ursprünglich für Datenblobs wie Konfigurationsdateien gedacht. Sie schützen gespeicherte Daten durch CRC-32 und kennen deren tatsächliche Länge. Ein statisches /dev/ubi0_1 mit 254KiB aus zwei 127KiB-LEBs und einer darin gespeicherten 200KiB-Datei liefert beim vollständigen Lesen genau 200KiB. Ein dynamic-Volume würde 254KiB liefern. Static vereinfacht damit die Blob-Speicherung, ist wegen der UBI-CRC-32-Prüfung jedoch langsamer. Static mit schreibgeschütztem UBIFS wird nicht empfohlen: UBIFS schützt seine Informationen bereits mit CRC-32; eine weitere Prüfung verlangsamt nur das Mounten.

Die Quelle rät daher bei UBIFS mit eigener CRC-Prüfung von zusätzlicher static-volume-CRC-Prüfung ab. Analog dazu:

<!-- Chinese PDF p.20 -->

Da SquashFS beim Start nicht die Integrität des gesamten Images prüft, empfiehlt die Quelle static volume für dessen UBI-Image.

Tests der Quelle:

TEST01 — Startzeit: RV1106 mit SPI-NAND und einem dynamic-UBI-Volume mit SquashFS startete normal. Beim Start entstand kein zusätzlicher Schreibaufwand (schreibgeschützt); ohne redundante CRC-Prüfung war die Ladezeit normal.

TEST02 — SquashFS-Kompression/Dekompression ohne static-Integritätsprüfung: SquashFS-UBI mit dynamic volume erstellen, Zieldatei suchen und einige Bytes verändern, Image flashen und nach dem Start lesen. Die Dateidaten waren tatsächlich beschädigt. Die Quelle folgert „ubifs hat keine Integritätsprüfung“; dieser Name widerspricht dem SquashFS-Testkontext und bleibt als Quellenunklarheit erhalten, nicht als bestätigte Aussage.

TEST03 — zusätzliche static-Prüfung: SquashFS-UBI mit static volume erstellen, Dateibytes verändern, flashen und nach dem Start lesen. UBI scannt das Image beim Einschalten und gibt folgende Fehler aus:

<!-- Chinese PDF p.20 -->

```text
[    6.358100] ubi0 warning: ubi_eba_read_leb: CRC error: calculated 0xae6dc941, must be 0xf62e2df5
[    6.358212] ubi0 warning: ubi_open_volume: volume 0 on UBI device 0 is corrupted
```

<!-- Chinese PDF p.20 -->

Anhang: Änderungen von static zu dynamic:

<!-- Chinese PDF p.20 -->

```text
[rootfs-volume]
mode=ubi
image=rootfs.squashfs
vol_id=0
vol_size=60MiB
vol_type=static
vol_name=rootfs
vol_alignment=1
vol_flags=autoresize
```

<!-- Chinese PDF p.20 -->

Ändern zu:

<!-- Chinese PDF p.21 -->

```text
[rootfs-volume]
mode=ubi
image=rootfs.squashfs
vol_id=0
vol_size=60MiB
vol_type=dynamic
vol_name=rootfs
vol_alignment=1
vol_flags=autoresize
```

<!-- Chinese PDF p.21 -->

### 2.14 UBIFS: 4KB-Seiten benötigen mehr Verwaltungsraum als 2KB-Seiten bei gleicher Partition

<!-- Chinese PDF p.21 -->

Dies ist erwartbar: UBIFS reserviert eine feste Zahl von Flash-Blöcken für seine Algorithmen. Bei gleicher Partitionsgröße belegen Bausteine mit 4KB-Seiten daher mehr Verwaltungsraum.

<!-- Chinese PDF p.21 -->

### 2.15 UBIFS-df zeigt wenig Platz

<!-- Chinese PDF p.21 -->

Siehe den UBIFS-Community-Abschnitt „Why does df report too little free space?“. UBIFS muss Verwaltungsdaten, Kompression und Algorithmen berücksichtigen und kann die nutzbare Datenkapazität nicht exakt vorhersagen. Es schätzt konservativ; df zeigt daher weniger Platz, während tatsächlich übertragene Daten diesen Wert übersteigen können.

<!-- Chinese PDF p.21 -->

### 2.16 JFFS2 mountet langsam

<!-- Chinese PDF p.21 -->

JFFS2 führt beim Start Garbage Collection aus. Dies gehört zum Verhalten; selbst ls kann langsam sein, und mit der Nutzung nimmt die Geschwindigkeit ab.

<!-- Chinese PDF p.21 -->

### 2.17 JFFS2-Partition nicht gelöscht

<!-- Chinese PDF p.21 -->

Das Upgradewerkzeug aktualisieren. Neuere Versionen erkennen JFFS2-Images und löschen die Partition vor dem Upgrade:

<!-- Chinese PDF p.21 -->

```text
mount -t jffs2 /dev/block/by-name/userdata /userdata
[    2.232850] jffs2: Empty flash at 0x002c1204 ends at 0x002c2000
[    2.232931] jffs2: CLEANMARKER node found at 0x002c2000, not first node in block (0x002c0000)
[    2.233065] jffs2: Empty flash at 0x002c200c ends at 0x002c3000
[    2.233075] jffs2: CLEANMARKER node found at 0x002c3000, not first node in block (0x002c0000)
[    2.233428] jffs2: Empty flash at 0x002c300c ends at 0x002c4000
```

<!-- Chinese PDF p.21 -->

### 2.18 JFFS2-Konflikt mit SPI-NOR-4K-Löschen

<!-- Chinese PDF p.21 -->

JFFS2 benötigt mindestens 8KB-Löschausrichtung, das SPI-NOR-Kernelframework unterstützt jedoch 4KB oder 64KB. Für JFFS2 deshalb CONFIG_MTD_SPI_NOR_USE_4K_SECTORS nicht aktivieren und 64KB-Löschausrichtung verwenden.

<!-- Chinese PDF p.22 -->

### 2.19 YAFFS wird nicht empfohlen

<!-- Chinese PDF p.22 -->

Die Quelle rät dringend von YAFFS ab, verweist auf fehlende Community-Wartung und empfiehlt UBIFS. Dies ist die Quellenempfehlung, keine neu verifizierte Aussage zum Wartungsstatus.

<!-- Chinese PDF p.22 -->

### 2.20 RK-Lösung unterstützt YAFFS2 nicht

<!-- Chinese PDF p.22 -->

Gründe:

- Die UBIFS-Unterstützung auf RK SPI-NAND ist relativ vollständig; UBIFS wird empfohlen.
- YAFFS2 verwendet OOB-Operationen und mehrfache Seitenschreibzugriffe; Quelltests zeigten Inkompatibilität.

Für selbst entwickelte YAFFS-Unterstützung nennt die Quelle folgende Controllertreiber:

- Kernel 4.19 und älter: drivers/rfkash/ (Quellschreibweise; vor Nutzung prüfen).
- Kernel 5.10: drivers/spi/spi-rockchip-sfc.c.

<!-- Chinese PDF p.22 -->

### 2.21 EXT mit dieser NAND-Lösung nicht nutzbar

<!-- Chinese PDF p.22 -->

EXT besitzt keine für Raw-NAND geeignete FTL und bietet kein Wear-Leveling, Daten-Refresh, Bad-Block-Management sowie weitere für NAND wesentliche Algorithmen.

<!-- Chinese PDF p.22 -->

### 2.22 EXT2-Unterstützung auf SPI-NOR

<!-- Chinese PDF p.22 -->

Warnung: Kein Wear-Leveling; vorsichtig verwenden. Löschausrichtung 4KB.

<!-- Chinese PDF p.22 -->

CONFIG_MTD_SPI_NOR_USE_4K_SECTORS aktivieren. SPI-NOR unterstützt ext2 beim Mounten der Partition über mtdblock. Häufige Schreibzugriffe vermeiden. Die Quelle nennt typisch 100K SPI-NOR-P/E-Zyklen (Löschen/Schreiben); die tatsächliche Produktlebensdauer eigenständig bewerten.

<!-- Chinese PDF p.22 -->

### 2.23 Fehlendes discard in EXT2 senkt spätere Lese-/Schreibleistung

<!-- Chinese PDF p.22 -->

Die Quelle beschreibt ext2 ohne discard-Unterstützung, auch für die von ihr betrachteten Linux-Versionen. Wurde der gesamte Flash-Platz genutzt, ändert Dateilöschen nur Inodes und meldet dem darunterliegenden Speicher keine Freigabe; der dort belegte Platz wird so nicht zurückgegeben.

Empfehlungen: Dateien wiederverwenden, häufiges Neuerstellen und ständiges Vollschreiben mit großen Dateien vermeiden. Falls unvermeidbar, regelmäßiges Formatieren erwägen: mkfs.ext2 ruft zur Freigabe discard auf. Alternativ zu ext4 wechseln und mit discard mounten. Dies sind Aussagen der Quellversion; das Verhalten der konkreten Werkzeuge, Treiber und Kernel vor Anpassung prüfen.

<!-- Chinese PDF p.23 -->

### 2.24 SquashFS-Kompressionsverfahren und Effizienz

<!-- Chinese PDF p.23 -->

Die folgenden Angaben sind nur eine erste Referenz; die Kompression hängt vom Datentyp und weiteren Faktoren ab:

<!-- Chinese PDF p.23 -->

| Verfahren | Kompressionsverhältnis | Kompression MB/s | Dekompression MB/s |
| --- | --- | --- | --- |
| gzip | 2.92 | 15 | 128 |
| lzo | 2.64 | 9.5 | 217 |
| lz4 | 2.12 | 94 | 218 |
| xz | 3.43 | 5.5 | 35 |
| xz 256 KB | 3.53 | 5.4 | 40 |
| zstd 1 | 2.71 | 96 | 210 |
| zstd 5 | 2.93 | 69 | 198 |
| zstd 10 | 3.01 | 41 | 225 |
| zstd 15 | 3.13 | 11.4 | 224 |
| zstd 16 256 KB | 3.24 | 8.1 | 210 |

<!-- Chinese PDF p.23 -->

Datenquelle: squashfs: Add zstd support.

<!-- Chinese PDF p.23 -->

## 3. EMMC-Probleme

<!-- Chinese PDF p.23 -->

### 3.1 Sporadische EMMC-Kommunikationsfehler im Kernel

<!-- Chinese PDF p.23 -->

Mehrere Ursachen sind möglich. Die Quelle nennt folgende beobachtete Fälle:

Zu kleine externe VDDI-Kapazität. Der EMMC-Controller benötigt etwa 1.2V Betriebsspannung, meist per LDO aus VCCQ erzeugt. Der VDDI-Kondensator filtert diese 1.2V-Versorgung. Die meisten EMMC-Gehäuse enthalten bereits einen kleinen internen VDDI-Kondensator. Unterschiedliche Hersteller und Modelle verwenden jedoch unterschiedliche Controller und Kapazitäten; entsprechend unterscheiden sich externe Anforderungen. Typische Quellanforderungen:

<!-- Chinese PDF p.23 -->

| Betriebsmodus | VDDI-Kapazität |
| --- | --- |
| HS400 | 1 - 2.2uF (einzelne Bausteine 2-4.7uF) |
| Andere Modi als HS400 | 0.1uF - 2.2uF |

<!-- Chinese PDF p.23 -->

Ein zu kleiner oder ausgefallener externer VDDI-Kondensator kann erklären, warum Baustein A funktioniert, nach Austausch gegen B aber sporadische Kommunikationsfehler auftreten.

<!-- Chinese PDF p.24 -->

Empfohlene VDDI-Kapazitäten (Obergrenze oder nahe daran verwenden):

<!-- Chinese PDF p.24 -->

| Plattform | Betriebsmodus | VDDI-Kapazität |
| --- | --- | --- |
| RK3399 | HS400 | 2.2uF |
| Andere Plattformen | HS200,DDR50, SDR 50 | 1uF |

<!-- Chinese PDF p.24 -->

Fehlender oder zu kleiner VCCQ-Kondensator auf Hostseite. EMMC 5.1 liest und schreibt schnell; größere Kapazitäten schreiben meist schneller. Stromspitzen von VCC/VCCQ können 400mA überschreiten (bei den meisten Bausteinen etwa 200mA). Ohne ausreichende Host-VCCQ-Kapazität kann VCCQ beim Einschalten oder im Betrieb einbrechen und Lesefehler verursachen.

ESD-Bausteine an EMMC-DATA-Leitungen. SD-Karten benötigen diese; EMMC ist jedoch verlötet und nicht hotplugfähig, weshalb die Quelle zusätzliche ESD-Bausteine als unnötig beschreibt. Zu große ESD-Kapazität kann Signale stark beeinträchtigen und HS400-/HS200-Fehler verursachen.

EMMC-CLK/CMD zu nahe an schnellen Signalen wie HDMI. Störungen können Kommunikationsfehler auslösen.

Ungleiche Leitungslängen und große Serienwiderstände an CMD/CLK. HS200 und HS400 verwenden beide 200MHz. Diese Bedingungen verkleinern das gültige Lesefenster und begünstigen Fehler bei Spannungs- oder Temperaturänderungen.

<!-- Chinese PDF p.24 -->

### 3.2 EMMC beim Upgrade nicht gefunden oder Prüfung fehlgeschlagen

<!-- Chinese PDF p.24 -->

Mehrere Ursachen sind möglich. Falsche VCCQ-Auswahl: VCCQ unterstützt 1.8V und 3.3V; Host-I/O muss passend konfiguriert sein. Die Auswahl erfolgt meist über eine an VCC oder Masse gelegte I/O-Leitung; den Schaltplan prüfen.

<!-- Chinese PDF p.24 -->

| VCCQ-Spannung | Host-I/O-Modus | Ergebnis |
| --- | --- | --- |
| 1.8V | 1.8V | Normal |
| 1.8V | 3.3V | Funktioniert nicht |
| 3.3V | 1.8V | Bei niedriger Rate eventuell normal; Fehler bei hoher Rate |
| 3.3V | 3.3V | Normal |

<!-- Chinese PDF p.24 -->

Zu kleine VDDI-Kapazität: siehe die vorherige VDDI-Beschreibung (Querverweis der Quelle: „1.1“).

EMMC-Lötfehler oder Bausteinschaden: Einige DNU-/NC-Balls müssen reserviert bleiben und können intern an Masse oder VCCQ liegen. Eine Verbindung zu anderen I/Os auf der Platine kann bei bestimmten Modellen Daten oder Versorgung kurzschließen. Schlechte Handlötung verhindert die Erkennung. Zu hohe Reflowtemperatur oder Feuchtigkeit können den Baustein beschädigen und die Hosterkennung verhindern.

<!-- Chinese PDF p.25 -->

### 3.3 EMMC-Schaden oder Firmwareverlust nach Nutzung

<!-- Chinese PDF p.25 -->

Wesentliche Quellfälle:

EMMC-Bausteinfehler fallen üblicherweise in zwei Kategorien:

<!-- Chinese PDF p.25 -->

**1.** Einzelne Bausteine entwickeln nach Nutzung Datenfehler, etwa durch fehlerhafte Blöcke; erneutes Flashen der Hostfirmware kann helfen. Fehler der internen EMMC-Firmware erfordern Austausch. Die Quelle nennt meist weniger als einen Fehler je tausend Bausteine; dies ist keine ArmSoM-Messung.

<!-- Chinese PDF p.25 -->

**2.** EMMC-Firmwarefehler können massenhaften Datenverlust oder Firmwareausfälle mit deutlich höherer Fehlerquote verursachen. Erforderlich sind FFU zur EMMC-Firmwareaktualisierung oder eine erneute Bausteininitialisierung.

Lebensdauer durch übermäßige Systemschreibzugriffe erschöpft: Ungünstiges Anwendungs-/Android-Design oder Konfiguration erzeugt viele kleine zufällige Logschreibzugriffe. Die EMMC-Schreibverstärkung kann groß sein: 1KB Logdaten können eine 16KB-Seite plus Dateisystemänderungen erfordern, im Quellbeispiel insgesamt drei Schreibvorgänge beziehungsweise 48KB.

EMMC 5.1 EXT CSD enthält Lebensdauerinformationen: DEVICE_LIFE_TIME_EST_TYP_B [269], PRE_EOL_INFO [267] und DEVICE_LIFE_TIME_EST_TYP_B [268]. Der doppelte TYPE_B-Name ist die unverändert erhaltene Quellschreibweise. EXT CSD lesen:

<!-- Chinese PDF p.25 -->

**1.** Mit mmc-utils lesen; die Werkzeughilfe beachten.

<!-- Chinese PDF p.25 -->

**2.** In einer Linux-Konsole den EMMC-Knoten ext_csd mit cat lesen. Der Ort hängt vom System ab; die Quelle nennt find ext_csd zum Suchen.

<!-- Chinese PDF p.25 -->

```text
cat /sys/kernel/debug/mmc0/mmc0:0001/ext_csd
```

<!-- Chinese PDF p.25 -->

**3.** Im maskrom-Upgrademodus einen Debug-Loader mit dump_ext_csd im Dateinamen herunterladen. Die serielle Schnittstelle gibt EXT CSD aus.

Linux upgrade tool und Android_Console_Tool:

<!-- Chinese PDF p.25 -->

```text
db xxxloaderxxx.bin
```

<!-- Chinese PDF p.25 -->

Android tool:

<!-- Chinese PDF p.25 -->

![3.3 EMMC-Schaden oder Firmwareverlust nach Nutzung: chinesische Originalabbildung, Seite 25](/docs/rockchip-storage-faq/assets/cn-p025-figure-01.png)

*3.3 EMMC-Schaden oder Firmwareverlust nach Nutzung: chinesische Originalabbildung, Seite 25*

<!-- Chinese PDF p.25 -->

EXT-CSD-Lebensdauerinformationen:

<!-- Chinese PDF p.26 -->

DEVICE_LIFE_TIME_EST_TYP_B [269] und DEVICE_LIFE_TIME_EST_TYP_B [268] erfassen die EMMC-Programmier-/Löschlebensdauer; siehe Tabelle. Beide Namen entsprechen der Quellschreibweise.

<!-- Chinese PDF p.26 -->

| Wert | Beschreibung |
| --- | --- |
| 0x00 | Nicht definiert |
| 0x01 | Verbrauchte Lebensdauer 0% - 10% |
| 0x02 | Verbrauchte Lebensdauer 10% -20% |
| 0x03 | Verbrauchte Lebensdauer 20% -30% |
| 0x04 | Verbrauchte Lebensdauer 30% - 40% |
| 0x05 | Verbrauchte Lebensdauer 40% - 50% |
| 0x06 | Verbrauchte Lebensdauer 50% - 60% |
| 0x07 | Verbrauchte Lebensdauer 60% - 70% |
| 0x08 | Verbrauchte Lebensdauer 70% - 80% |
| 0x09 | Verbrauchte Lebensdauer 80% - 90% |
| 0x0A | Verbrauchte Lebensdauer 90% - 100% |
| 0x0B | Geschätzte maximale Lebensdauer überschritten |
| Andere | Reserviert |

<!-- Chinese PDF p.26 -->

PRE_EOL_INFO [267] zeigt die Erschöpfung reservierter EMMC-Blöcke; siehe Tabelle:

<!-- Chinese PDF p.26 -->

| Wert | Pre-EOL-Information | Beschreibung |
| --- | --- | --- |
| 0x00 | Nicht definiert |   |
| 0x01 | Normal | Normal |
| 0x02 | Warnung | 80% der reservierten Blöcke verbraucht |
| 0x03 | Dringend |   |
| 0x04 ~ 0xFF | Reserviert |   |

<!-- Chinese PDF p.26 -->

Stromausfall während OTA: Laut Quelle aktualisieren Android-Versionen nach 7.1 die Blöcke der system-Partition direkt statt dateibasiert. Ein Stromausfall kann dabei die system-Partition beschädigen.

<!-- Chinese PDF p.26 -->

### 3.4 EMMC bleibt nach Upgrade in maskrom

<!-- Chinese PDF p.26 -->

Schlechte EMMC-Lötung oder PCB-Probleme: BOOTROM startet im 8-Bit-Modus. Ist eine D1–D7-Leitung nicht korrekt verbunden, funktioniert dieser nicht. Schlechte Lötung:

<!-- Chinese PDF p.27 -->

Bei Fehlern einzelner Muster ist schlechte Lötung meist die Ursache.

PCB-Problem: Sind alle Muster betroffen, die Platine prüfen, etwa Datenleitungen durch RFU- oder DNU-Balls.

<!-- Chinese PDF p.27 -->

![3.4 EMMC bleibt nach Upgrade in maskrom: chinesische Originalabbildung, Seite 27](/docs/rockchip-storage-faq/assets/cn-p027-figure-01.png)

*3.4 EMMC bleibt nach Upgrade in maskrom: chinesische Originalabbildung, Seite 27*

<!-- Chinese PDF p.27 -->

Fehlendes oder falsch platziertes uboot/trust: Fehlt ein Image oder liegt es am falschen Offset, kann Miniloader U-Boot nicht starten und kehrt nach maskrom zurück. Serielle Protokolle zeigen Miniloader-Start und Neustart.

<!-- Chinese PDF p.27 -->

## 4. Flash-Probleme

<!-- Chinese PDF p.27 -->

### 4.1 Flash-Lese-/Schreibraten

<!-- Chinese PDF p.27 -->

Allgemeiner Test (nahe optimal): Mit dd mindestens 10MB Speicher testen.

<!-- Chinese PDF p.28 -->

| Bausteintyp | Testumgebung | Sequenzielles Lesen | Sequenzielles Schreiben |
| --- | --- | --- | --- |
| SLC Nand | Linux | 16MB/s(IO 30MHz) | 4MB/s(IO 30MHz) |
| SPI Nand | Linux | 10.8MB/s (IO 80MHz) | 4.0 MB/s (IO 48MHz) |
| SPI Nor | Linux | 24.0MB/s(IO 80MHz) | 100~200 KB/s(IO 48MHz) |
| SPI Nor | RTT | 35MB/s (IO 80MHz) | 100~200KB/s(IO 80MHz) |

<!-- Chinese PDF p.28 -->

| Bausteintyp | Testumgebung | Zufälliges 4K-Lesen | Zufälliges 4K-Schreiben |
| --- | --- | --- | --- |
| SPI Nor | RKOS | 13MB/s (IO 80MHz) | 100~200 KB/s(IO 48MHz) |

<!-- Chinese PDF p.28 -->

Spezieller Schreibratentest 1 (nahe Sättigung), Quellumgebung:

- RK3308_V10_EVB.
- Kernel 4.4, 64 Bit.
- Benutzerpartition: 352MB.
- Flash-Kapazität: 512MB.

Testfall:

<!-- Chinese PDF p.28 -->

```text
Sub Main
    while (1)
        crt.Screen.Send "rm /userdata/test && sync"
        crt.Screen.Send chr (13)
        crt.Sleep 2000
        crt.Screen.Send "time dd if=/dev/zero of=/userdata/test bs=1M count=350 && sync"
        crt.Screen.Send chr (13)
        crt.Screen.waitForString "real"
        crt.Sleep 2000
    wend
End Sub
```

<!-- Chinese PDF p.28 -->

Quellergebnis: Ein halbstündiger Test ergab unter Volllast 2.0 MB/s Schreibrate. Keine ArmSoM-Messung.

<!-- Chinese PDF p.28 -->

### 4.2 Flash-Schreibschutz

<!-- Chinese PDF p.28 -->

Flash-Schreibschutz:

- Softwareseitiger Schutz wird meist unterstützt, die Umsetzung variiert jedoch.
- Einige Bausteine besitzen hardwareseitig wp#. RK kann diesen Pin nicht direkt steuern; bei Bedarf GPIO-Steuerung verwenden.

Die beschriebene RK-Speicherlösung ergänzt keine Schreibschutzbehandlung: Es gibt eine einheitliche Lese-/Schreibschnittstelle, ein Störsignal sollte theoretisch keine vollständige Transaktion auslösen, und Bausteinschutzverfahren unterscheiden sich stark.

<!-- Chinese PDF p.29 -->

### 4.3 Software-Chipauswahl mit Zwei-Die-Flash inkompatibel

<!-- Chinese PDF p.29 -->

Das aktuelle Softwareframework unterstützt keinen Stacked-Die-Baustein mit zwei gleichartigen Flash-Dies bei softwareseitiger Chipauswahl.

<!-- Chinese PDF p.29 -->

### 4.4 Typische Kernelmeldungen bei fehlgeschlagener Speicherinitialisierung

<!-- Chinese PDF p.29 -->

Schlägt die Speicherinitialisierung fehl, entstehen keine zugehörigen MTD-Partitionen. Das System läuft dennoch bis zum Mounten eines nicht auf ramdisk liegenden Root-Dateisystems weiter und stoppt mit Meldungen wie „waiting for root......“.

<!-- Chinese PDF p.29 -->

### 4.5 Schreiben auf Geräteknoten bis zum Medium sicherstellen

<!-- Chinese PDF p.29 -->

Die Quelle empfiehlt O_SYNC oder O_DIRECT bei fopen beziehungsweise fsync nach dem Schreiben. Für dd-Image-Upgrades nennt sie iflag=nocache und oflag=direct. Sie nennt fopen, obwohl diese Flags üblicherweise zu open gehören; dieser Widerspruch bleibt zur Prüfung erhalten.

<!-- Chinese PDF p.29 -->

### 4.6 Flash-Bausteine austauschen

<!-- Chinese PDF p.29 -->

T/A und S/A in der Freigabeliste: RK-SPI-Flash-Controller-IP ist plattformkompatibel. T/A bezeichnet ein auf der Speicherprüfplattform validiertes Muster; S/A eine kompatible Plattform. Laut Quelle können Produkte Flash mit T/A- oder S/A-Unterstützung einsetzen.

Neue NAND-Bausteine: RK prüft Grundfunktion und Musterstabilität auf der Testplattform. Konkrete Produkte sollten zusätzlich Signalübereinstimmung vor/nach dem Austausch, Einhaltung der Bausteinspezifikation und Robustheit bei unerwartetem Stromausfall prüfen. Siehe Rockchip_Developer_Guide_Linux_Flash_Open_Source_Solution_CN.pdf.

<!-- Chinese PDF p.29 -->

### 4.7 TFTP-Download-/Programmierfehler diagnostizieren

<!-- Chinese PDF p.29 -->

Erstdiagnose: md5sum in jeder Phase berechnen und vergleichen:

**1.** Nach Erstellung des Upgrade-Images.
**2.** Nach TFTP-Download; Abweichungen deuten auf Netzwerk oder DRAM.
**3.** Nach Flashen online zurücklesen und md5sum berechnen; Abweichungen deuten auf Flash-Probleme. Geschwindigkeit reduzieren oder einleitige Übertragung prüfen.
**4.** In maskrom wechseln, Image zurücklesen und md5sum berechnen; mit dem Online-Rückleseergebnis vergleichen.

Bei anfänglichem Flash-Verdacht:

<!-- Chinese PDF p.30 -->

Hilft niedrigere Geschwindigkeit oder einleitige Übertragung, Signalqualität und Flash-Versorgungsstabilität messen, Hardware anpassen und Standardeinstellungen erneut prüfen. Andernfalls die RK-Speichersoftwareentwicklung hinzuziehen.

<!-- Chinese PDF p.30 -->

### 4.8 U-Boot-MTD- und mtd_block-Schnittstellen

<!-- Chinese PDF p.30 -->

![4.8 U-Boot-MTD- und mtd_block-Schnittstellen: chinesische Originalabbildung, Seite 30](/docs/rockchip-storage-faq/assets/cn-p030-figure-01.png)

*4.8 U-Boot-MTD- und mtd_block-Schnittstellen: chinesische Originalabbildung, Seite 30*

<!-- Chinese PDF p.30 -->

Unterschiedliche Programmier-/Löschgranularität: NOR und NAND besitzen unterschiedliche kleinste Einheiten. Für 256B in einem 4K-NOR-Sektor müssen 4K gelöscht werden; die übrigen (4KB - 256B) Byte sind vorher zu sichern und zurückzuschreiben.

MTD- und Blockschnittstellen:

- MTD verlangt P/E-Verwaltung durch die obere Schicht.
- Blockschnittstellen abstrahieren einen kleinsten logischen Sektor; andere Sektoren bleiben unberührt, da die Granularitätsanpassung intern erfolgt.
- Linux-mtdblock bietet 512B-Sektoren und verwaltet P/E so, dass beim Schreiben eines 512B-Sektors der Unterschied behandelt wird.

RK-SDK-U-Boot setzt entsprechende Logik nach Linux-Vorbild um.

<!-- Chinese PDF p.30 -->

### 4.9 Flash-Stresstestfehler bei niedriger Temperatur

<!-- Chinese PDF p.30 -->

Zuerst prüfen, ob die VCCIO-Flash-sel-Pull-up-/Pull-down-Pegel bei niedriger Temperatur auffällig sind.

<!-- Chinese PDF p.30 -->

### 4.10 Versehentliche maskrom-Betätigung stört Transfers

<!-- Chinese PDF p.30 -->

Die maskrom-Taste so platzieren, dass versehentliche Betätigung die Datenübertragung nicht stört.

<!-- Chinese PDF p.30 -->

## 5. Flash-Controller-Probleme

<!-- Chinese PDF p.30 -->

### 5.1 FSPI-Tastverhältnis ist nicht 50%

<!-- Chinese PDF p.30 -->

Der Ausgangstakt wird aus einer bestimmten PLL des Taktbaums geteilt. Ungerade Teiler ergeben nicht zwingend 50% Tastverhältnis und können das Timing bei maximaler Peripherierate kritisch machen. Gerade Teiler ergeben 50%.

<!-- Chinese PDF p.31 -->

### 5.2 FSPI ist kein allgemeines SPI: nur SPI Memory

<!-- Chinese PDF p.31 -->

FSPI (früher SFC) unterstützt nur SPI-Memory-Timing: cmd + addr (optional) + dummy (optional) + data (optional). Insbesondere wird unmittelbare Eingabe nach CS-Aktivierung nicht unterstützt. Das Timing sorgfältig prüfen. Bei externer Peripherie wie FPGA die Protokolleignung bewerten. Kerneltreiber: spi-rockchip-sfc.c.

<!-- Chinese PDF p.31 -->

### 5.3 FSPI-Setup-/Hold-Timing wird nicht gemessen

<!-- Chinese PDF p.31 -->

FSPI-Lesezugriffe in U-Boot und Kernel verwenden standardmäßig vier Leitungen. Bei gleicher Rate sind die Host-Setup-/Hold-Anforderungen theoretisch identisch.

Hintergrund:

<!-- Chinese PDF p.31 -->

**1.** Grundlagen der FSPI-Leseabtastung. SPI mode 0: CPOL im Ruhezustand low, CPHA-Abtastung an der ersten Flanke. Die Leseabtastung wird um eine halbe Periode auf die fallende Flanke verschoben.

<!-- Chinese PDF p.31 -->

![5.3 FSPI-Setup-/Hold-Timing wird nicht gemessen: chinesische Originalabbildung, Seite 31](/docs/rockchip-storage-faq/assets/cn-p031-figure-01.png)

*5.3 FSPI-Setup-/Hold-Timing wird nicht gemessen: chinesische Originalabbildung, Seite 31*

<!-- Chinese PDF p.31 -->

**2.** DLL-Bedarf (delay line). I/O-Verzögerung aus den FSPI-Timingbedingungen und Output-Delay der meisten Bausteine lassen wenig Setup-/Hold-Spielraum. Eine Delay-Line wird für die beste Abtastreserve ergänzt.

<!-- Chinese PDF p.31 -->

**3.** DLL-Eigenschaften. RK-FSPI unterstützt eine Delay-Line zur Leseabtastung. Die Verzögerung entsteht intern und ist am I/O nicht messbar. DLL hängt von PVT und Fertigungsprozess ab, ist weder konstant noch phasenverriegelt. Sie überlagert die beschriebene Abtastung an der fallenden Flanke. Die genaue DLL-Verzögerung lässt sich daher nicht berechnen und erscheint nicht im externen Signal.

<!-- Chinese PDF p.31 -->

**4.** DLL-Softwarestrategie. DLL wird bei I/O-Raten über 50MHz aktiviert. Jede Softwarephase stimmt sie durch Flash-ID-Vergleich ab.

Zusammenfassung: Das RK-Host-FSPI-Lese-Setup/Hold wird nicht gemessen, weil die meisten I/O-Takte über 50MHz DLL verwenden und das tatsächliche interne Sampling wie beschrieben nicht extern messbar ist. Unter 50MHz bietet die grundlegende Abtastung große Reserven.

<!-- Chinese PDF p.32 -->

### 5.4 Können zwei FSPI-Chip-Selects unterschiedliche Geräte ansprechen?

<!-- Chinese PDF p.32 -->

Stellt der Chip eine FSPI-CS1N-I/O-Erweiterung bereit, unterstützt die IP theoretisch zwei Chip-Selects. Nur das CS0N-Gerät ist bootdev. Viele gemeinsame I/Os können Störungen und Ratenbegrenzungen verursachen. Hardware und Software umfassend bewerten.

<!-- Chinese PDF p.32 -->

## 6. NAND-Probleme

<!-- Chinese PDF p.32 -->

### 6.1 PX30-NAND auf rkflash umstellen

<!-- Chinese PDF p.32 -->

Zu rk_nand/rk_flash siehe Kapitel Storage in Rockchip_Developer_Guide_UBoot_Nextdev_CN. rk_nand dient vor allem großen MLC-/TLC-NANDs, rk_flash SLC-NAND. PX30-SDKs liefern meist Firmware für große NANDs; der Wechsel zu SLC erfordert Treiberanpassungen. Wesentliche Änderungen:

<!-- Chinese PDF p.32 -->

**1.** In rkbin die mit RKBOOT/PX30MINIALL_SLC.ini gepackte Loader-Firmware verwenden.

<!-- Chinese PDF p.32 -->

**2.** In U-Boot gemäß Storage-Kapitel von Rockchip_Developer_Guide_UBoot_Nextdev_CN RKNAND durch RKFLASH ersetzen.

<!-- Chinese PDF p.32 -->

**3.** Im Kernel entsprechend RK_NAND zu RK_FLASH ändern und nandc0 im DTS aktivieren.

Mögliches Problem — Q1: U-Boot startet nicht normal. A1: Speichertreiber oder DTS sind eventuell falsch konfiguriert. Mit folgenden Befehlen prüfen:

<!-- Chinese PDF p.32 -->

```text
=> dm tree
...
# 正常设备应有以下类似打印
rksfc [ + ] rksfc |-- sfc@ff4c0000 **
blk [ + ] rkflash_blk | |-- sfc@ff4c0000.spinand.blk
blk [ ] rkflash_blk | `-- sfc@ff4c0000.spinor.blk
```

<!-- Chinese PDF p.32 -->

### 6.2 Regeln für eigene NAND-Zugriffe in U-Boot

<!-- Chinese PDF p.32 -->

Bei seltenen Lösch-/Schreibzugriffen kann MTD direkt aufgerufen werden. Manche Kunden protokollieren jedoch häufig in U-Boot in einer Rohpartition ohne Dateisystem und wollen vendor nicht beeinflussen. Zur Verringerung des NAND-Verschleißes durch In-place-Schreiben eine eigene Partition mit Zugriffen nach Vendor-Vorbild ergänzen. Referenz: arch/arm/mach-rockchip/vendor.c, Schnittstellen mtd_vendor_storage_init und mtd_vendor_write.

Vendor-Implementierung:

<!-- Chinese PDF p.33 -->

Die Initialisierung erkennt vnvm und registriert gegebenenfalls die Vendor-Schnittstelle. Pro Vorgang werden zwei Kopien geschrieben, auf Seitengröße ausgerichtet und ab der ersten Blockseite; gelöscht wird der gesamte Block.

<!-- Chinese PDF p.33 -->

### 6.3 NAND-SFTL-Speicheraufteilung

<!-- Chinese PDF p.33 -->

| Bausteinkapazität | idblock | Benutzerdaten | Reservierte Daten | sys block | Overhead |
| --- | --- | --- | --- | --- | --- |
| 128MB | 2MB | 107MB | 11MB | 8MB | 14.8% |
| 256MB | 2MB | 218MB | 24MB | 12MB | 14% |
| 512MB | 2MB | 464MB | 31MB | I5MB | 9% |

<!-- Chinese PDF p.33 -->

Der 11M-Bereich dient dem Flash-Datenaustausch zur Verbesserung der Lese-/Schreibeffizienz; sys block ist für FTL reserviert.

<!-- Chinese PDF p.33 -->

### 6.4 Getrennte NAND-Images nicht in einem Vorgang zusammen flashen

<!-- Chinese PDF p.33 -->

Ein Programmer muss letztlich partitionenweise schreiben, weil die Laufzeit-Bad-Block-Verwaltung partitionslokal ist und Vorprogrammierung dazu passen muss. Einige Programmer unterstützen eigene oder offene all_in_one-Pakete: Einzelimages werden gegebenenfalls mit Partitionsmetadaten zusammengefasst, anschließend vom Programmer interpretiert, entpackt und einzeln geflasht. Ein Herstellerdemo beziehen oder selbst entwickeln. RK hat ein solches Format analysiert; siehe SPI-NAND-Programmer-Dokument 20210804_flash_programer.

<!-- Chinese PDF p.33 -->

### 6.5 Bad-Block-Verwaltung im offenen NAND-Framework

<!-- Chinese PDF p.33 -->

Anforderungen an die Bad-Block-Tabelle: Fast jeder NAND-Vorgang muss den Blockzustand kennen. Ohne Cache wird die Markierung jedes Mal aus einer Flash-Seite gelesen, was I/O-Zeit kostet. Neue Markierungen lassen sich bei instabilen Blöcken außerdem nicht immer zuverlässig schreiben.

MTD puffert das erste I/O-Ergebnis in einer Bad-Block-Tabelle; weitere Abfragen nutzen den Cache. Nach Neustart wird er neu aufgebaut, weshalb die Tabelle zusätzlich nichtflüchtig gespeichert werden sollte. Cache: drivers/mtd/nand/bbt.c.

SLC-NAND-BBT im Flash: Das offene SLC-NAND-Framework enthält bereits persistente Tabellenverwaltung zur zentralen Pflege der Bad-Block-Informationen.

<!-- Chinese PDF p.34 -->

SPI-NAND-BBT im Flash: Das beschriebene offene Framework bietet keine persistente SPI-NAND-Bad-Block-Verwaltung. RK ergänzt deshalb standardmäßig aktivierte Unterstützung. Code — U-Boot:

<!-- Chinese PDF p.34 -->

```text
drivers/mtd/nand/bbt.c
```

<!-- Chinese PDF p.34 -->

Kernel:

<!-- Chinese PDF p.34 -->

```text
drivers/rkflash/sfc_nand_mtd_bbt.c
```

<!-- Chinese PDF p.34 -->

Eigenschaften:

<!-- Chinese PDF p.34 -->

**1.** Nutzt den vorhandenen bbt.cache-Mechanismus aus drivers/mtd/nand/bbt.c.

<!-- Chinese PDF p.34 -->

**2.** Die letzten vier NAND-Blöcke als mögliche Tabellenspeicher reservieren und die letzte Partition entsprechend anpassen.

<!-- Chinese PDF p.34 -->

**3.** Die Tabelle beim ersten Einschalten in U-Boot erzeugen.

<!-- Chinese PDF p.34 -->

**4.** Jeweils zwei Kopien zurückschreiben.

<!-- Chinese PDF p.34 -->

**5.** Laut Quelle tritt hier in U-Boot kein Deadlock auf, da in diesem Kontext keine echten Mutex-/Multithreading-Situationen bestehen.

<!-- Chinese PDF p.34 -->

## 7. Probleme mit parallelem SLC-NAND

<!-- Chinese PDF p.34 -->

### 7.1 PX30-SLC-NAND-IDB-Images erstellen

<!-- Chinese PDF p.34 -->

Unterschiedliche Images benötigen unterschiedliche Erstellungsverfahren:

<!-- Chinese PDF p.34 -->

**1.** IDB: Mit dem Programmer ein Image einschließlich OOB ab Flash-Block 0 exportieren; üblicherweise zwei Blöcke lang.

<!-- Chinese PDF p.34 -->

**2.** Andere Images: Mit programmer_image_tool und -l die Listenverknüpfung ändern.

<!-- Chinese PDF p.34 -->

PX30-IDB-Programmerimages werden separat erstellt, weil ältere Plattformen eine Flash-Info-Seite und speziellen ECC im SLC-NAND-IDB-Bereich ergänzen. programmer_image_tool implementiert dies nicht; neuere Plattformen besitzen diese Seite nicht. Die Formate sind daher inkompatibel.

<!-- Chinese PDF p.34 -->

### 7.2 Herstelleranalyse meldet viele aufeinanderfolgende fehlerhafte SLC-NAND-Blöcke

<!-- Chinese PDF p.34 -->

Nach Auslöten eines SLC-NANDs und Prüfung mit Programmer oder anderem Werkzeug können Kunden/Hersteller viele vermeintliche Bad-Block-Markierungen feststellen. Laut Quelle ist dieser Schluss falsch: RK-FTL verwendet eine Tabelle; Spare-Byte 0 genutzter Blöcke ist nicht als gewöhnliche Markierung interpretierbar. Drittwerkzeugprüfungen ausgelöteter Bausteine sind daher nicht schlüssig; reale Fehler einzeln analysieren.

<!-- Chinese PDF p.35 -->

### 7.3 SLC-NAND-Programmer unterstützt keine Mastergeräteimages

<!-- Chinese PDF p.35 -->

Angenommen, das „Image“ enthält nur data:

<!-- Chinese PDF p.35 -->

**1.** SPI-NAND verwendet bausteinseitigen ECC; das Flashimage enthält daher nur data, ECC liefert der Baustein.

<!-- Chinese PDF p.35 -->

**2.** SLC-NAND verwendet hostseitig erzeugten BCH für ECC. Nach der RK-BCH-Verarbeitung einer Seite werden Daten und OOB (Metadaten plus BCH-Code) wie gezeigt abgelegt:

<!-- Chinese PDF p.35 -->

![7.3 SLC-NAND-Programmer unterstützt keine Mastergeräteimages: chinesische Originalabbildung, Seite 35](/docs/rockchip-storage-faq/assets/cn-p035-figure-01.png)

*7.3 SLC-NAND-Programmer unterstützt keine Mastergeräteimages: chinesische Originalabbildung, Seite 35*

<!-- Chinese PDF p.35 -->

Re-Layout: Aus data + OOB wird verschachteltes data + OOB + data + OOB … . Die ursprüngliche Bad-Block-Markierung im ersten OOB-Byte liegt nun im Datenbereich. Nach dem Flashen kann SLC-NAND nicht nach der Hersteller-Standardregel dieses Bytes beurteilt werden. RK bestätigt zuerst BCH-Fehler und prüft dann die Markierung im ersten OOB-Byte. Beim Rücklesen kann ein Programmer deshalb fehlerhafte Blöcke nicht korrekt überspringen.

<!-- Chinese PDF p.35 -->

### 7.4 SLC-NAND-Programmerimages enthalten Daten und OOB

<!-- Chinese PDF p.35 -->

OOB (Metadaten und BCH) wird bei der Imageerstellung ergänzt. Das Programmerimage als data mit OOB konfigurieren.

<!-- Chinese PDF p.36 -->

![7.4 SLC-NAND-Programmerimages enthalten Daten und OOB: chinesische Originalabbildung, Seite 36](/docs/rockchip-storage-faq/assets/cn-p036-figure-01.png)

*7.4 SLC-NAND-Programmerimages enthalten Daten und OOB: chinesische Originalabbildung, Seite 36*

<!-- Chinese PDF p.36 -->

### 7.5 SLC-NAND-SDK-Images enthalten Daten ohne OOB

<!-- Chinese PDF p.36 -->

OOB (Metadaten und BCH) ergänzt der Controller; das Benutzerimage enthält nur data.

<!-- Chinese PDF p.37 -->

![7.5 SLC-NAND-SDK-Images enthalten Daten ohne OOB: chinesische Originalabbildung, Seite 37](/docs/rockchip-storage-faq/assets/cn-p037-figure-01.png)

*7.5 SLC-NAND-SDK-Images enthalten Daten ohne OOB: chinesische Originalabbildung, Seite 37*

<!-- Chinese PDF p.37 -->

### 7.6 SLC-NAND-ECC-Layout in Software

<!-- Chinese PDF p.37 -->

Paralleles SLC-NAND im RK SDK verwendet das Hostcontroller-BCH-Modul für ECC mit 16bits/1KB. Layout:

<!-- Chinese PDF p.37 -->

![7.6 SLC-NAND-ECC-Layout in Software: chinesische Originalabbildung, Seite 37](/docs/rockchip-storage-faq/assets/cn-p037-figure-02.png)

*7.6 SLC-NAND-ECC-Layout in Software: chinesische Originalabbildung, Seite 37*

<!-- Chinese PDF p.37 -->

### 7.7 Kernel-rkflash-SLC-NAND-Durchsatz optimieren

<!-- Chinese PDF p.37 -->

Kompromiss bei der CPU-Zeitplanung:

<!-- Chinese PDF p.37 -->

**1.** Den Speicherpatch über den zugehörigen Quellenlink aktualisieren.

<!-- Chinese PDF p.37 -->

**2.** In drivers/rkflash/nandc.c usleep_range von 20–30 auf 5–10 ändern. Laut Quelle optimiert die Schlafgranularität die Threadplanung auf Kosten eines Teils der Übertragungsrate. Längeres Schlafen senkt umgekehrt die CPU-Last bei hohem I/O-Durchsatz. Dies sind Quellaussagen; erst nach Messung der realen Last abstimmen.

<!-- Chinese PDF p.37 -->

### 7.8 SPL-MTD-SLC-NAND-Leserate optimieren

<!-- Chinese PDF p.37 -->

Hintergrund: PP-NAND-Spezifikationen variieren; NandC ist daher konservativ auf Stabilität eingestellt. Bei höherem Geschwindigkeitsbedarf sind geeignete Optimierungen möglich.

<!-- Chinese PDF p.38 -->

Patch aktualisieren/prüfen: Für RV1126 folgenden U-Boot-Patch ergänzen, SPL neu bauen und für 30MHz-I/O aktualisieren:

<!-- Chinese PDF p.38 -->

```text
diff --git a/arch/arm/mach-rockchip/rv1126/rv1126.c b/arch/arm/mach-rockchip/rv1126/rv1126.c
index 84df82ab138..e3ae330e413 100644
--- a/arch/arm/mach-rockchip/rv1126/rv1126.c
+++ b/arch/arm/mach-rockchip/rv1126/rv1126.c
@@ -77,6 +77,7 @@ DECLARE_GLOBAL_DATA_PTR;
 #define CRU_CLKSEL_CON50       0x1c8
 #define CRU_CLKSEL_CON51       0x1cc
 #define CRU_CLKSEL_CON54       0x1d8
+#define CRU_CLKSEL_CON59       0x1ec
 #define CRU_CLKSEL_CON61       0x1f4
 #define CRU_CLKSEL_CON63       0x1fc
 #define CRU_CLKSEL_CON65       0x204
@@ -749,6 +750,11 @@ int arch_cpu_init(void)
        udelay(1);
        writel(0x00100000, CRU_BASE + CRU_SOFTRST_CON10);

+#ifdef CONFIG_SPL_BUILD
+       writel(0x00ff004, CRU_BASE + CRU_CLKSEL_CON59);
+       printf("NandC gpll=768,div=(%d+1)\n", readl(CRU_BASE + CRU_CLKSEL_CON59) & 0xff);
+#endif
+
        return 0;
 }
 #endif
diff --git a/drivers/mtd/nand/raw/rockchip_nand_spl.c b/drivers/mtd/nand/raw/rockchip_nand_spl.c
index 6e39287ef39..d6ed7038914 100644
--- a/drivers/mtd/nand/raw/rockchip_nand_spl.c
+++ b/drivers/mtd/nand/raw/rockchip_nand_spl.c
@@ -92,7 +92,7 @@ static u32 nand_block_num;

 static void nandc_init(struct rk_nand *rknand)
 {
-       writel(0x1081, rknand->regs + NANDC_REG_V6_FMWAIT);
+       writel(0x1061, rknand->regs + NANDC_REG_V6_FMWAIT);
 }

 static void rockchip_nand_wait_dev_ready(void __iomem *regs)
```

<!-- Chinese PDF p.38 -->

Nach Erhöhung der SPL-NandC-Rate prüfen:

<!-- Chinese PDF p.38 -->

**1.** Signalqualität gemäß Bausteinspezifikation.

<!-- Chinese PDF p.38 -->

**2.** Stressteststabilität, etwa durch wiederholte Neustarts.

<!-- Chinese PDF p.38 -->

### 7.9 Zu viele schlechte Blöcke am SLC-NAND-Ende verhindern MTD-Betrieb

<!-- Chinese PDF p.38 -->

Bei Kernel 4.19 zuerst prüfen, ob dieser Patch vorhanden ist:

<!-- Chinese PDF p.39 -->

```text
commit e323080273b1e6ad2862158c2c634bf9f36671b2
Author: Jon Lin <jon.lin@rock-chips.com>
Date:   Tue Aug 29 15:56:56 2023 +0800

    mtd: rawnand: rockchip: Modify the judgment of the last page

    Incorrect judgment without affecting bad block judgment logic.

    Change-Id: I123be12cc50e52e6a24c4276a5ac68208239af42
    Signed-off-by: Jon Lin <jon.lin@rock-chips.com>
```

<!-- Chinese PDF p.39 -->

## 8. Häufige SPI-NAND-Fragen

<!-- Chinese PDF p.39 -->

### 8.1 SPI-NAND-Plane-Select-Kompatibilität

<!-- Chinese PDF p.39 -->

Problem: RV1126/RV1109 haben Kompatibilitätsprobleme mit bestimmten Two-Plane-SPI-NANDs. Für den Start muss IDB verkleinert werden; diese Bausteine werden nicht empfohlen und sind in der Freigabeliste markiert.

Workaround: RK liefert eine reduzierte SPL-Konfiguration configs/rv1126-spl-spi-nand_defconfig. Entfernt werden hauptsächlich:

<!-- Chinese PDF p.39 -->

**1.** Andere Speicher: paralleles NAND, EMMC, SPI-NOR und SD-Karte.

<!-- Chinese PDF p.39 -->

**2.** GPT-Unterstützung.

<!-- Chinese PDF p.39 -->

**3.** A/B-Partitionen. Werden diese Funktionen benötigt, andere ungenutzte Herstellerbausteindefinitionen unten entfernen, um Platz zu schaffen:

<!-- Chinese PDF p.39 -->

```text
CONFIG_MTD_SPI_NAND=y
CONFIG_SPI_NAND_GIGADEVICE=y
CONFIG_SPI_NAND_MACRONIX=y
CONFIG_SPI_NAND_MICRON=y
CONFIG_SPI_NAND_TOSHIBA=y
CONFIG_SPI_NAND_WINBOND=y
CONFIG_SPI_NAND_DOSILICON=y
CONFIG_SPI_NAND_ESMT=y
CONFIG_SPI_NAND_XTX=y
CONFIG_SPI_NAND_HYF=y
CONFIG_SPI_NAND_FMSH=y
CONFIG_SPI_NAND_FORESEE=y
CONFIG_SPI_NAND_BIWIN=y
```

<!-- Chinese PDF p.39 -->

Prüfen, ob das IDB aus spl.bin und ddr.bin passt. Im U-Boot-Verzeichnis folgenden Befehl ausführen und ddr.bin durch die Zielfirmware ersetzen:

<!-- Chinese PDF p.40 -->

```text
./tools/mkimage -n rv1126 -T rksd -d ./../rkbin/bin/rv11/rv1126_ddr_924MHz_v1.05.bin:./spl/u-boot-spl.bin rv1126_idb1.bin
```

<!-- Chinese PDF p.40 -->

Laut Quelle bekannte betroffene Bausteine:

<!-- Chinese PDF p.40 -->

| Bausteinaufdruck | ID0 | ID1 |
| --- | --- | --- |
| MT29F2G01ABA, XT26G02E, F50L2G41XA | 2C | 24 |
| DS35Q2GA-IB | E5 | 72 |
| DS35M2GA-IB | E5 | 22 |
| FM25S02A | A1 | E5 |
| DS35Q2GB-IB | E5 | F2 |
| DS35Q4GM | E5 | F4 |

<!-- Chinese PDF p.40 -->

BOOTROM kann bei diesen Bausteinen ungerade Blöcke 1, 3, 5, … nicht scannen. Ein Block umfasst 128KB; ein größeres IDB überschreitet die Blockgrenze, sodass BOOTROM nicht alle Daten findet und das Laden fehlschlägt.

<!-- Chinese PDF p.40 -->

### 8.2 1.8V-SPI-NAND auswählen

<!-- Chinese PDF p.40 -->

1.8V-Bausteine sind bei Herstellern meist verfügbar. Die Quelle nennt sieben unterstützte Hersteller; die aktuelle Freigabeliste statt dieser historischen Anzahl prüfen. Bei korrekter Domainkonfiguration und I/O-Versorgung bleibt der Treiber ohne Sonderkonfiguration mit dem 3.3V-Fall kompatibel:

<!-- Chinese PDF p.41 -->

| Quelleintrag | Hersteller | Modell | Kapazität (bits) | Kapazität (bytes) | Spannung | Schnittstelle |
| --- | --- | --- | --- | --- | --- | --- |
| 20230705 | XTX | XT26Q04DWSIGA | 4GBits | 512MB | 1.7V-<br>1.95V | SPI<br>NAND |
| 20230705 | XTX | XT26Q01DWSIGA | 1GBits | 128MB | 1.7V-<br>1.95V | SPI<br>NAND |
| 20230705 | XTX | XT26Q02DWSIGA | 2GBits | 256MB | 1.7V-<br>1.95V | SPI<br>NAND |
| 20230705 | FORESEE | F35UQA002G-<br>WWT | 2GBits | 256MB | 1.7V-<br>1.95V | SPI<br>NAND |
| 20230705 | FORESEE | F35UQA001G-<br>WWT | 1GBits | 128MB | 1.7V-<br>1.95V | SPI<br>NAND |
| 20230317 | HYF | HYF1GQ4IDACAE | 1GBits | 128MB | 1.70V-<br>1.98V | SPI<br>NAND |
| 20230317 | HYF | HYF2GQ4IAACAE | 2GBits | 256MB | 1.70V-<br>1.98V | SPI<br>NAND |
| 20230217 | Dosilicon | DS35M12B-IB | 512MBits | 64MB | 1.7V-<br>1.95V | SPI<br>NAND |
| 20220901 | MXIC | MX35UF1GE4AD-<br>Z4I | 1GBits | 128MB | 1.7V-<br>1.95V | SPI<br>NAND |
| 20220818 | MXIC | MX35UF4GE4AD-<br>Z4I | 4GBits | 512MB | 1.7V-<br>1.95V | SPI<br>NAND |
| 20220818 | MXIC | MX35UF2GE4AD-<br>Z4I | 2GBits | 256MB | 1.7V-<br>1.95V | SPI<br>NAND |
| 20210918 | GigaDevice | GD5F2GM7REYIGY | 2GBits | 256MB | 1.7V-<br>2.0V | SPI<br>NAND |
| 20210911 | Dosilicon | DS35M2GA-IBR | 2GBits | 256MB | 1.7V-<br>2.0V | SPI<br>NAND |
| 20210911 | Dosilicon | DS35M1GA-IBR | 1GBits | 128MB | 1.7V-<br>1.95V | SPI<br>NAND |
| 20210911 | Dosilicon | DS35M1GB-IB | 1GBits | 128MB | 1.7V-<br>1.95V | SPI<br>NAND |
| 20210911 | GigaDevice | GD5F2GQ5REYIG | 2GBits | 256MB | 1.7V-<br>2.0V | SPI<br>NAND |
| 20210911 | GigaDevice | GD5F1GQ5REYIG | 1GBits | 128MB | 1.7V-<br>2.0V | SPI<br>NAND |
| 200701 | Dosilicon | DS35M1GA-IBR | 1GBits | 128MB | 1.65V-<br>1.95V | SPI<br>NAND |
| 200831 | MXIC | MX35UF1GE4AC-<br>Z4I | 1GBits | 128MB | 1.7V-<br>1.95V | SPI<br>NAND |
| 200831 | MXIC | MX35UF2GE4AC-<br>Z4I | 2GBits | 256MB | 1.7V-<br>1.95V | SPI<br>NAND |

<!-- Chinese PDF p.42 -->

### 8.3 HYF1GQ4UTXCAE-Stromausfallproblem

<!-- Chinese PDF p.42 -->

Das Herstellermuster HYF1GQ4UTXCAE bestand den Stromausfalltest nicht. Die Quelle führt dies auf fehlende Upstream-HWP_EN-Anpassungen der Bausteinfamilie zurück:

<!-- Chinese PDF p.42 -->

```text
commit 72986913fc4ba3e0c1c276aa63e2040ff8290201
Author: Jon Lin <jon.lin@rock-chips.com>
Date:   Mon Aug 14 14:52:36 2023 +0800

    mtd: spinand: Enable HWP_EN for skyhigh devices

    HWP_EN must be enabled first before block unlock region is set.

    Change-Id: I6b107d97de48bb2644da865f353d2adace95224e
    Signed-off-by: Jon Lin <jon.lin@rock-chips.com>
```

<!-- Chinese PDF p.42 -->

### 8.4 Software-ECC für SPI-NAND untersuchen

<!-- Chinese PDF p.42 -->

Die Quelle unterscheidet Korrektur und Gültigkeitsprüfung: Software-ECC bringt hier wenig zusätzliche Korrektur, kann aber ungültige Daten erkennen; die RK-Lösung selbst verwendet bausteinintegrierten Hardware-ECC.

SPI-NAND benötigt ECC wegen möglicher NAND-Bitfehler. Hardware-ECC sitzt meist im Baustein, gelegentlich im Host (Quellbeispiel HiSilicon). RK unterstützt SPI-NAND ohne integrierten Hardware-ECC wegen geringer Zuverlässigkeit standardmäßig nicht.

Bei vorhandenem Hardware-ECC hilft zusätzliche Softwarekorrektur wenig: Ein Hardware-ECC-Fehler bedeutet meist großflächige Korruption jenseits kleiner Softwarekorrekturfähigkeit. Softwareprüfungen können jedoch ungültige Daten bei außergewöhnlichen Übertragungsfehlern wie Stromausfall erkennen, die Hardware-ECC nicht zwingend meldet. Eine UBIFS-artige Datenprüfung ist deshalb hilfreich.

Bei Partitionen ohne Dateisystem, etwa misc, ECC oder andere wirksame Schutzmechanismen für SPI-NAND-Lese-/Schreibzugriffe unter Extrembedingungen erwägen.

<!-- Chinese PDF p.42 -->

### 8.5 Schutz für SPI-NAND-BBT im Flash

<!-- Chinese PDF p.42 -->

Hintergrund: Das RK-SPI-NAND-SDK speichert Bad-Block-Informationen in BBT; siehe den entsprechenden FAQ-Abschnitt. Frühe Prüfungen verwendeten hauptsächlich das erste OOB-Byte und Magic am Ende gültiger BBT-Daten.

<!-- Chinese PDF p.43 -->

Patchversionen — U-Boot:

<!-- Chinese PDF p.43 -->

```text
commit 78cac1dffdc0bd64e47294e41d2432b7760e7186
Author: Jon Lin <jon.lin@rock-chips.com>
Date:   Sun Jun 28 20:13:39 2020 +0800

    mtd: nand: Remove bbt option property if scan fail

    Change-Id: Ifb5b500b6ffee551aea5b6aecea629b3d0ea6207
    Signed-off-by: Jon Lin <jon.lin@rock-chips.com>
```

<!-- Chinese PDF p.43 -->

Kernel:

<!-- Chinese PDF p.43 -->

```text
commit fe246b156492ee509bb1d071c176d324542d3193
Author: Jon Lin <jon.lin@rock-chips.com>
Date:   Thu Dec 17 16:05:27 2020 +0800

    drivers: rkflash: Fixed bbt operation calculation error

    Fixes: 008340a82 ("drivers: rkflash: Change to use the api which the oob area available")
    Change-Id: I140aa76a2acb73271ba04b7060030dc06a2353e6
    Signed-off-by: Jon Lin <jon.lin@rock-chips.com>
```

<!-- Chinese PDF p.43 -->

Optimierung: Instabiles SPI-NAND kann BBT zerstören, selbst wenn deren Logik nicht die Ursache ist. Schutz gegen solche Grenzfälle ergänzen. BBT-Framework:

<!-- Chinese PDF p.43 -->

![8.5 Schutz für SPI-NAND-BBT im Flash: chinesische Originalabbildung, Seite 43](/docs/rockchip-storage-faq/assets/cn-p043-figure-01.png)

*8.5 Schutz für SPI-NAND-BBT im Flash: chinesische Originalabbildung, Seite 43*

<!-- Chinese PDF p.43 -->

Zusätzliche Schutzmaßnahmen:

<!-- Chinese PDF p.44 -->

- Hash zur BBT-Prüfung ergänzen.
- Beim vollständigen format_bbt-Scan verdächtige als schlecht erkannte Blöcke erneut prüfen.
- Bei update_bbt zurücklesen und verifizieren; bei Fehlern redundante Informationen löschen.

Fehlerinjektion in U-Boot/Kernel simuliert BBT-Startscanfehler, Fehler beim vollständigen Formatierungsscan sowie Schreib-, Hash-, Rücklese- und Rücklese-Hash-Fehler. SPL kann BBT nicht formatieren und führt keine destruktiven Vorgänge aus; dort injiziert die Quelle keine Fehler. Laut Quelle blieb BBT nach Stresstests normal ohne falsche Bad-Block-Einträge.

Optimierungspatches — U-Boot:

<!-- Chinese PDF p.44 -->

```text
commit 55ef8700b677919efa06f3bfe1dcab3a4554a92d
Author: Jon Lin <jon.lin@rock-chips.com>
Date:   Sun Sep 24 20:11:20 2023 +0800

    mtd: nand: bbt: Add mechanisms to protect bad block tables

    1.Add hash check
    2.Add anti-shake mechanism to avoid damaging the bad block tables
    3.Add anti-shake mechanism to optimize the reliability of bad block table

    Change-Id: I6ac9554ae0f642d6a89d21a8f79a2a87d607f993
    Signed-off-by: Jon Lin <jon.lin@rock-chips.com>
```

<!-- Chinese PDF p.44 -->

Kernel:

<!-- Chinese PDF p.44 -->

```text
commit cc1f433fb9ade372b06e9d62651ed8d719aaac94
Author: Jon Lin <jon.lin@rock-chips.com>
Date:   Sun Sep 24 20:24:00 2023 +0800

    drivers: rkflash: Add mechanisms to protect bad block tables

    1.Add hash check
    2.Add anti-shake mechanism to avoid damaging the bad block tables
    3.Add anti-shake mechanism to optimize the reliability of bad block table

    Change-Id: I888ceba54e5bbc55283850316e27560c484a9cf5
    Signed-off-by: Jon Lin <jon.lin@rock-chips.com>
```

<!-- Chinese PDF p.44 -->

### 8.6 SPI-NAND-Programmer unterstützt Master, aber keinen vollständigen Einzelexport

<!-- Chinese PDF p.44 -->

Die Quelle empfiehlt Programmerimages mit RK programmer_image_tool statt von einem Mastergerät. Die Überschrift erlaubt einen Master, der Text lehnt jedoch ein vollständiges SPI-NAND-Masterimage ab, weil Linux-MTD/UBIFS fehlerhafte Blöcke partitionsweise verwaltet. Dieser Widerspruch bleibt zur Prüfung erhalten.

<!-- Chinese PDF p.45 -->

Beispiel: Partition A umfasst 8MB mit einem fehlerhaften 128KB-Block; B ebenfalls 8MB. A- und B-Image sind je 7MB groß. Bei einem Gesamtimage 7MB_A + 1MB Auffüllung + 7MB_B verschiebt das Überspringen des Blocks gültige B-Daten auf 8MB + 128KB; A beginnt bei 0. Die Software erwartet B weiterhin ab 8MB und lädt versetzt.

Richtig: A separat bei 0 und B bei 8MB programmieren, jeweils ab Partitionsanfang mit Skip-Bad-Block-Verfahren. Die Software liest jede Partition entsprechend ab ihrem Anfang mit derselben Strategie. Programmierung und Lesen stimmen dann überein.

<!-- Chinese PDF p.45 -->

### 8.7 SPI-NAND-SDK-Images enthalten Daten ohne OOB

<!-- Chinese PDF p.45 -->

Grund: Der SPI-Flash-Controller besitzt keinen integrierten ECC und ist auf bausteinseitigen ECC angewiesen.

<!-- Chinese PDF p.45 -->

![8.7 SPI-NAND-SDK-Images enthalten Daten ohne OOB: chinesische Originalabbildung, Seite 45](/docs/rockchip-storage-faq/assets/cn-p045-figure-01.png)

*8.7 SPI-NAND-SDK-Images enthalten Daten ohne OOB: chinesische Originalabbildung, Seite 45*

<!-- Chinese PDF p.46 -->

### 8.8 Kernel-rkflash-SPI-NAND-Durchsatz optimieren

<!-- Chinese PDF p.46 -->

Große I/O-Datenmengen können hohe CPU-Last verursachen. Etwas geringere Flash-Geschwindigkeit kann die CPU-Zeitplanung verbessern.

<!-- Chinese PDF p.46 -->

```text
diff --git a/drivers/rkflash/sfc_nand.c b/drivers/rkflash/sfc_nand.c
index 0bc1c6b43fd7..ca190c115ad3 100644
--- a/drivers/rkflash/sfc_nand.c
+++ b/drivers/rkflash/sfc_nand.c
@@ -274,7 +274,7 @@ static int sfc_nand_wait_busy(u8 *data, int timeout)

        *data = 0;

-       for (i = 0; i < timeout; i++) {
+       for (i = 0; i < timeout; i+= 20) {
                ret = sfc_nand_read_feature(0xC0, &status);

                if (ret != SFC_OK)
@@ -285,7 +285,7 @@ static int sfc_nand_wait_busy(u8 *data, int timeout)
                if (!(status & (1 << 0)))
                        return SFC_OK;

-               sfc_delay(1);
+               usleep_range(20, 30);
        }

        return SFC_NAND_WAIT_TIME_OUT;
```

<!-- Chinese PDF p.46 -->

### 8.9 Kernel-MTD-SPI-NAND- und Bad-Block-Informationen

<!-- Chinese PDF p.46 -->

Bad-Block-Informationen:

<!-- Chinese PDF p.46 -->

```text
cat /sys/devices/virtual/mtd/mtd5/bad_blocks
```

<!-- Chinese PDF p.46 -->

Weitere Informationen:

<!-- Chinese PDF p.46 -->

```text
# ls /sys/devices/virtual/mtd/mtd4/
bad_blocks         ecc_step_size      numeraseregions    subsystem/
bbt_blocks         ecc_strength       offset             type
bitflip_threshold  erasesize          oobsize            uevent
corrected_bits     flags              power/             writesize
dev                mtdblock4/         size
ecc_failures       name               subpagesize
```

<!-- Chinese PDF p.46 -->

### 8.10 Kernel-MTD-SPI-NAND-Schreibfehler

<!-- Chinese PDF p.46 -->

Prüfen, ob einer dieser Quellbausteine verwendet wird:

- S35ML01G3, ANV1GCP0CLG, HYF1GQ4UTXCAE, YX25G1E.
- S35ML02G3, ANV2GCP0CLG, HYF2GQ4UTXCAE, YX25G2E.

Die zwei Quellzeilen waren bei der Extraktion zusammengefügt; Modellnamen bleiben unverändert.

<!-- Chinese PDF p.47 -->

Diese Bausteine haben Kompatibilitätsprobleme mit Befehl 84h. Ein Patch wurde ergänzt und der Hersteller um Dokumentkorrektur gebeten.

<!-- Chinese PDF p.47 -->

```text
commit 328145662f6d6154fbf4329a0d53f9c152673648
Author: Jon Lin <jon.lin@rock-chips.com>
Date:   Fri Jul 7 12:06:40 2023 +0800

    mtd: spinand: skyhigh: The vendor requires the devices to be patched

    1.Double OIP=0 after page 13H
    2.The nand flash does not support 84H and 34H command

    Change-Id: Ie805f42a36e1a864115988087bdc43592cc94ded
    Signed-off-by: Jon Lin <jon.lin@rock-chips.com>
```

<!-- Chinese PDF p.47 -->

### 8.11 Automatisches Root-Mounten für MTD-SPI-NAND und EMMC

<!-- Chinese PDF p.47 -->

Das Standard-SDK unterstützt dies nicht. Für EMMC-/SPI-NAND-Kompatibilität den Typ in U-Boot erkennen und den passenden root-Parameter über Kernel-bootargs übergeben.

<!-- Chinese PDF p.47 -->

### 8.12 ENV-Partitionsupgrades mit 4K-Seiten-SPI-NAND-IDB-Images

<!-- Chinese PDF p.47 -->

Für Bausteine mit 4KB-Seiten das idblock-Upgradeimage mit folgendem Spezialbefehl erzeugen:

<!-- Chinese PDF p.47 -->

```text
./tools/programmer_image_tool -i rv1106_download_v1.14.108.bin -b 128 -p 4 -2 -t spinand -o ./
```

<!-- Chinese PDF p.47 -->

Ausgabe: idblock.img. Das von der Quelle beschriebene neueste SDK erzeugt dieses Image standardmäßig.

<!-- Chinese PDF p.47 -->

### 8.13 SPI-NAND-Schnellstart erstellt keine Kernel-BBT

<!-- Chinese PDF p.47 -->

SPI-NAND-Seitenleseproblem/Optimierung: Der SPL-Schnellstart umgeht U-Boot, wodurch die Kernel-BBT-Erstellung inkompatibel ist oder fehlt. Siehe Patch:

<!-- Chinese PDF p.47 -->

```text
commit c7270465b2a699211dfd8ad3c2f882f22247c40c
Author: Jon Lin <jon.lin@rock-chips.com>
Date:   Thu Dec 17 16:05:27 2020 +0800

    drivers: rkflash: Fixed bbt operation calculation error

    Fixes: 008340a82 ("drivers: rkflash: Change to use the api which the oob area available")
    Change-Id: I140aa76a2acb73271ba04b7060030dc06a2353e6
    Signed-off-by: Jon Lin <jon.lin@rock-chips.com>
```

<!-- Chinese PDF p.48 -->

### 8.14 Eigenes MTD-Upgrade scheitert bei Partitionen mit Bad Blocks

<!-- Chinese PDF p.48 -->

Ursache: Schreibzugriffe an zufälligen Partitionsoffsets. Beispiel: Ein etwa 2M großes Image wird mit nandwrite in 512K-Stücken geschrieben, der nächste Offset jeweils um 512K erhöht. Ein schlechter Block kann U-Boot-MTD-Lesefehler verursachen. In einem Vorgang schreiben oder eigene Bad-Block-Verwaltung implementieren.

Grund: Einzelzugriffe statt eines am Partitionsanfang ausgerichteten Gesamtzugriffs berücksichtigen übersprungene Blöcke eventuell nicht. Ist Block 8 schlecht, schreibt write 7_8 tatsächlich 7_9. Ein späteres write 9 programmiert Block 9 erneut, was beim Rücklesen ECC-Fehler verursacht.

<!-- Chinese PDF p.48 -->

### 8.15 Continuous-Read-SPI-NAND-Unterstützung und Schnellstartanpassung

<!-- Chinese PDF p.48 -->

#### 8.15.1 Einführung

<!-- Chinese PDF p.48 -->

Winbond (in der Quelle einmal „Winbound“) bietet spezielles schnelles Laden ausgewählter SPI-NANDs. W25N01GV unterstützt Bad-Block-Ersatz für einen konfigurierten fehlerfreien Bereich, Continuous Read über Seitengrenzen bei fortlaufendem Takt sowie 104MHz-SDR-Continuous-Read mit angegebenen 52MB/s.

Das Winbond-W25N01XX-CONT_READ-Schnellstartverfahren beschleunigt damit ROM und SPL und lädt ausgewählte SPL-Firmware per FSPI-DMA asynchron im Hintergrund. Dies sind Quellfähigkeiten und -raten, keine ArmSoM-Testergebnisse.

<!-- Chinese PDF p.48 -->

#### 8.15.2 Konfiguration

<!-- Chinese PDF p.48 -->

RV1103B-rkbin-INI-Beispiel: RV1103BMINIALL_SPI_NAND_W25N01XX_TB.ini.

U-Boot-Konfiguration:

<!-- Chinese PDF p.48 -->

```text
CONFIG_SPI_NAND_WINBOND_CONT_READ
```

<!-- Chinese PDF p.48 -->

## 9. SPI-NOR-Probleme

<!-- Chinese PDF p.49 -->

### 9.1 1.8V-SPI-NOR ab 256Mbits auswählen

<!-- Chinese PDF p.49 -->

In der Quelle genannte Bausteine:

- MX25U25645GZ4I-00: 256MBits, 32MB.
- MX25U51245GZ4I00: 512Mbits, 64MB.
- GD25LQ256CW1G: 256MBits, 32MB.
- W25Q256JWEQ: 256MBits, 32MB.
- XTX XT25W512BSFHGU: 512Mbit, 1.65–3.6V, laut Quelle nicht validiert.
- Dosilicon DS25M4BA-1AIB1: 256Mb, nicht validiert.
- Dosilicon DS25M4BA-1AIB4: 256Mb, nicht validiert.

Bei den Herstellern passende Bausteine anfragen. Für von RK nicht validierte Modelle können Prüfmuster eingereicht werden. Die aktuelle Flash-Freigabeliste entscheidet über Unterstützung; diese Liste ist keine ArmSoM-Qualifikation.

<!-- Chinese PDF p.49 -->

### 9.2 rkflash-SPI-NOR gegenüber offenem MTD in Kernel 4.4 und älter

<!-- Chinese PDF p.49 -->

Ältere offene Kernelframeworks unterstützen wenige Bausteine und verwenden eine ältere MTD-Struktur; RK passte sie deshalb nicht an. rkflash unterstützt dagegen mehr SPI-Flash-Bausteine.

<!-- Chinese PDF p.49 -->

### 9.3 SPI-NOR-MTD-sf-Befehle und U-Boot-Schnittstellen

<!-- Chinese PDF p.49 -->

RK-SDK-U-Boot verwendet DM_SPI_FLASH. spi_flash.h enthält spi_find_bus_and_cs und spi_flash_probe_bus_cs zur Initialisierung sowie spi_flash_read und weitere Lese-/Schreibfunktionen. Anwendung siehe cmd/sf.c und U-Boot-Befehl cmd_sf.

RV1106-Beispielpatch:

<!-- Chinese PDF p.49 -->

```text
diff --git a/arch/arm/dts/rv1106-u-boot.dtsi b/arch/arm/dts/rv1106-u-boot.dtsi
index b0632e9ce9..03bc933125 100644
--- a/arch/arm/dts/rv1106-u-boot.dtsi
+++ b/arch/arm/dts/rv1106-u-boot.dtsi
@@ -167,6 +167,7 @@
                spi-tx-bus-width = <1>;
                spi-rx-bus-width = <4>;
                spi-max-frequency = <80000000>;
+               status = "disabled";
        };

        spi_nor: flash@1 {
diff --git a/configs/rv1106_defconfig b/configs/rv1106_defconfig
index 9b20bcfb65..b1f3933a11 100644
--- a/configs/rv1106_defconfig
+++ b/configs/rv1106_defconfig
@@ -148,3 +148,4 @@ CONFIG_SPL_LZMA=y
 CONFIG_SPL_GZIP=y
 CONFIG_ERRNO_STR=y
 # CONFIG_EFI_LOADER is not set
+CONFIG_CMD_SF=y
```

<!-- Chinese PDF p.50 -->

Befehle:

<!-- Chinese PDF p.50 -->

```text
=> sf probe 2:0 10000000 3
SF: Detected sfc_nor with page size 256 Bytes, erase size 4 KiB, total 16 MiB

=> sf read 0x400000 0x200 0x200
device 0 offset 0x200, size 0x200
SF: 512 bytes @ 0x200 Read: OK
```

<!-- Chinese PDF p.50 -->

### 9.4 Langsame SPI-NOR-MTD-mtdparts-Registrierung

<!-- Chinese PDF p.50 -->

Jede MTD-Partition ist ein MTD-Gerät. Mit mtdblock werden zusätzlich Blockgeräte registriert, was die Gesamtdauer erhöht. Quellbeispiel für add_mtd_device:

- device_register: 0.15ms.
- mtd_nvmem_add: 0.08ms.
- device_create: 0.12ms.
- mtdpstore_notify_add: 0.5ms.

<!-- Chinese PDF p.50 -->

### 9.5 Langsames SPI-NOR-MTD-Löschen/Schreiben in U-Boot

<!-- Chinese PDF p.50 -->

Wird JFFS2 in U-Boot nicht verwendet, SPI_FLASH_USE_4K_SECTORS entfernen und 64KB-ausgerichtet löschen.

<!-- Chinese PDF p.50 -->

### 9.6 Einleitige gegenüber vierleitiger SPI-NOR-Leistung

<!-- Chinese PDF p.50 -->

Testumgebung: 80MHz-I/O-Takt.

<!-- Chinese PDF p.50 -->

|   |   |   |   |
| --- | --- | --- | --- |
| I/O-Nutzung | io0~3 bidirektional | io0~1 bidirektional | io0 Empfang, io1 Senden |
| Dateisystemlesen | 35MB/s | 19MB/s | 11MB/s |
| Dateisystem-Löschen/Schreiben | 150KB/s | 150KB/s | 150KB/s |

<!-- Chinese PDF p.50 -->

„Einleitiges“ SPI-Flash bedeutet nicht wörtlich nur ein beteiligtes physisches I/O, sondern eine unidirektionale Übertragung.

<!-- Chinese PDF p.51 -->

### 9.7 SPI-NOR-Stresstestfehler bei höheren Raten

<!-- Chinese PDF p.51 -->

Beispiel eines mit 104MHz beworbenen Bausteins: Einzelne Eigenschaften sind auf 83MHz begrenzt, Tests bei 80MHz waren instabil.

Ziel: Stresstests mit 80MHz-I/O bestehen. Zuerst die Kernelsignale clk, d0, d1 und cs möglichst gleichzeitig messen und klare Qualitätsprobleme suchen. Falls keine sichtbar sind:

- Test A: Verdächtigen Baustein auf 60MHz reduzieren und automatische Neustarts bei hohen/niedrigen Temperaturen testen.
- Test B: Einen ähnlich mit 100MHz spezifizierten Baustein eines anderen Herstellers als Platinenkontrolle per Auto-Reboot testen.

Auswertung:

- A und B scheitern: Vermutlich begrenzt Platinenhardware die SPI-NOR-Rate; Signale weiter untersuchen.
- Beide bestehen, Standard-80MHz scheitern: Die Quelle vermutet eine überhöhte ursprüngliche Bausteinangabe.
- A scheitert, B besteht: A auf 40MHz senken. Besteht dies, vermutet die Quelle stark überhöhte Angaben oder schlechte Kompatibilität.

Weitere Schritte aus den Ergebnissen ableiten. Wird der ausreichend stabile Baustein gewählt, prüfen, ob 60MHz die Produktanforderungen erfüllt. Dies sind Diagnosehypothesen der Quelle, keine bestätigten Herstellerqualitätsurteile.

<!-- Chinese PDF p.51 -->

### 9.8 SPI-NOR-AUTO_MERGE

<!-- Chinese PDF p.51 -->

#### 9.8.1 Einführung

<!-- Chinese PDF p.51 -->

Die Quelle beschreibt Marktsituationen, in denen zwei 16MB-SPI-NORs deutlich günstiger sind als ein 32MB-Baustein. AUTO_MERGE vereint zwei SPI-NORs zu einem größeren logischen Gerät und vereinfacht Einführung, Entwicklung und Wartung:

- Ein NOR-Gerät im Device Tree.
- Ein AUTO_MERGE-NOR mit zwei Untergeräten im Framework.
- Ein NOR-Gerät im Userspace.

Der Preisvergleich ist historischer Quellenkontext, kein aktuelles Angebot.

<!-- Chinese PDF p.52 -->

#### 9.8.2 Einschränkungen

<!-- Chinese PDF p.52 -->

Einschränkungen:

- AUTO_MERGE kombiniert nur zwei identische SPI-NORs und erfordert ähnliches PCB-Layout.
- Ein einzelner NOR wird unterstützt; am CS1N-GPIO erscheinen während der Erkennung dennoch Signale.
- Asynchrone SPL-FSPI-DMA-Hintergrundladebereiche dürfen die physische NOR-Grenze nicht überschreiten; Beispiel: Fastboot-ramdisk mit preload im DTS.
- Offener usbplug ist selbst kompilierbar, unterstützt aber nur USB-Download. Für UART die selbst zu packenden geschlossenen download_xxxcs1.bin und usbplug_xxxcs1.bin verwenden.

<!-- Chinese PDF p.52 -->

#### 9.8.3 Konfiguration

<!-- Chinese PDF p.52 -->

RV1103B-rkbin-INI-Beispiel: RKBOOT/RV1103BMINIALL_AUTO_MERGE.ini.

usbplug-/SPL-/U-Boot-Buildoptionen:

<!-- Chinese PDF p.52 -->

```text
CONFIG_SPI_FLASH_AUTO_MERGE=y
CONFIG_SPL_GPIO_SUPPORT=y
```

<!-- Chinese PDF p.52 -->

usbplug-/SPL-/U-Boot-DTS-Optionen:

<!-- Chinese PDF p.52 -->

```text
diff --git a/arch/arm/dts/rv1103b-u-boot.dtsi b/arch/arm/dts/rv1103b-u-boot.dtsi
index a31355a..88ceb85 100644
--- a/arch/arm/dts/rv1103b-u-boot.dtsi
+++ b/arch/arm/dts/rv1103b-u-boot.dtsi
@@ -67,12 +67,12 @@
 };

 &gpio1 {
-   u-boot,dm-pre-reloc;
+   u-boot,dm-spl;
    status = "okay";
 };

 &gpio2 {
-   u-boot,dm-pre-reloc;
+   u-boot,dm-spl;
    status = "okay";
 };

@@ -92,6 +92,7 @@
 };

 &sfc {
+   sfc-cs-gpios= <&gpio1 RK_PA5 GPIO_ACTIVE_LOW>, <&gpio2 RK_PA6 GPIO_ACTIVE_LOW>;
    u-boot,dm-spl;
    status = "okay";
    };
```

<!-- Chinese PDF p.52 -->

Kernel-Buildoption:

<!-- Chinese PDF p.53 -->

```text
CONFIG_MTD_SPI_NOR_AUTO_MERGE=y
```

<!-- Chinese PDF p.53 -->

Kernel-DTS-Referenz:

<!-- Chinese PDF p.53 -->

```text
&fspi0 {
    sfc-cs-gpios = <&gpio1 RK_PA5 GPIO_ACTIVE_LOW>, <&gpio1 RK_PA6 GPIO_ACTIVE_LOW>;
    pinctrl-names = "default";
    pinctrl-0 = <&fspi_cs0n &fspi_cs1n>;
    status = "okay";

    flash@0 {
        compatible = "jedec,spi-nor";
        reg = <0>;
        spi-max-frequency = <75000000>;
        spi-rx-bus-width = <4>;
        spi-tx-bus-width = <1>;
    };
};

&pinctrl {
    fspi {
        fspi_cs0n: fspi-cs0n {
            rockchip,pins = <1 RK_PA5 RK_FUNC_GPIO &pcfg_pull_up>;
        };
        fspi_cs1n: fspi-cs1n {
            rockchip,pins = <1 RK_PA6 RK_FUNC_GPIO &pcfg_pull_up>;
        };
    };
};
```

<!-- Chinese PDF p.53 -->

#### 9.8.4 CSN1-Konfiguration

<!-- Chinese PDF p.53 -->

Den von RK empfohlenen CSN1-GPIO verwenden. Hardwarezeichnungen beim zuständigen Entwickler beziehen. usbplug-/SPL-/U-Boot-DTS-Beispiel: RV1103B GPIO1A6 auf GPIO1A7 ändern:

<!-- Chinese PDF p.53 -->

```text
diff --git a/arch/arm/dts/rv1103b-u-boot.dtsi b/arch/arm/dts/rv1103b-u-boot.dtsi
index d346eae20bf..86265f76304 100644
--- a/arch/arm/dts/rv1103b-u-boot.dtsi
+++ b/arch/arm/dts/rv1103b-u-boot.dtsi
@@ -92,7 +92,7 @@
 };

 &sfc {
-       sfc-cs-gpios= <&gpio1 RK_PA5 GPIO_ACTIVE_LOW>, <&gpio1 RK_PA6 GPIO_ACTIVE_LOW>;
+       sfc-cs-gpios= <&gpio1 RK_PA5 GPIO_ACTIVE_LOW>, <&gpio1 RK_PA7 GPIO_ACTIVE_LOW>;
        u-boot,dm-spl;
        status = "okay";

diff --git a/arch/arm/mach-rockchip/rv1103b/rv1103b.c b/arch/arm/mach-rockchip/rv1103b/rv1103b.c
index 7353528afdd..8e30240076e 100644
--- a/arch/arm/mach-rockchip/rv1103b/rv1103b.c
+++ b/arch/arm/mach-rockchip/rv1103b/rv1103b.c
@@ -252,9 +252,9 @@ int arch_cpu_init(void)
        writel(0x00000000, USBPHY_APB_BASE + USBPHY_FSLS_DIFF_RECEIVER);

 #ifdef CONFIG_SPI_FLASH_AUTO_MERGE
-       /* gpio1a5/gpio1a6 cs-gpio */
+       /* gpio1a5/gpio1a7 cs-gpio */
        writel(0x00F00000, GPIO1_IOC_BASE + GPIO1A_IOMUX_SEL_1_0);
-       writel(0x0F000000, GPIO1_IOC_BASE + GPIO1A_IOMUX_SEL_1_1);
+       writel(0xF0000000, GPIO1_IOC_BASE + GPIO1A_IOMUX_SEL_1_1);
 #endif
 #endif
```

<!-- Chinese PDF p.54 -->

Kernelbeispiel: RV1103B GPIO1A6 auf GPIO1A7 ändern:

<!-- Chinese PDF p.54 -->

```text
diff --git a/arch/arm/boot/dts/rv1103b-evb1-v10-spi-nor-auto-merge.dts b/arch/arm/boot/dts/rv1103b-evb1-v10-spi-nor-auto-merge.dts
index ae3fa579b05f..00bf8008e107 100644
--- a/arch/arm/boot/dts/rv1103b-evb1-v10-spi-nor-auto-merge.dts
+++ b/arch/arm/boot/dts/rv1103b-evb1-v10-spi-nor-auto-merge.dts
@@ -14,7 +14,7 @@ / {
 };

 &fspi0 {
-       sfc-cs-gpios = <&gpio1 RK_PA5 GPIO_ACTIVE_LOW>, <&gpio1 RK_PA6 GPIO_ACTIVE_LOW>;
+       sfc-cs-gpios = <&gpio1 RK_PA5 GPIO_ACTIVE_LOW>, <&gpio1 RK_PA7 GPIO_ACTIVE_LOW>;
        pinctrl-names = "default";
        pinctrl-0 = <&fspi_cs0n &fspi_cs1n>;
        status = "okay";
@@ -34,7 +34,7 @@ fspi_cs0n: fspi-cs0n {
                        rockchip,pins = <1 RK_PA5 RK_FUNC_GPIO &pcfg_pull_up>;
                };
                fspi_cs1n: fspi-cs1n {
-                       rockchip,pins = <1 RK_PA6 RK_FUNC_GPIO &pcfg_pull_up>;
+                       rockchip,pins = <1 RK_PA7 RK_FUNC_GPIO &pcfg_pull_up>;
                };
        };
 };
```

<!-- Chinese PDF p.54 -->

## 10. Werkzeugprobleme

<!-- Chinese PDF p.54 -->

### 10.1 Separates GPT-Image mit upgrade_tool erstellen

<!-- Chinese PDF p.54 -->

Linux upgrade tool ab v1.67 verwenden.

<!-- Chinese PDF p.54 -->

```text
./upgrade_tool gpt parameter.txt  gpt.img
```

<!-- Chinese PDF p.55 -->

### 10.2 Loader mit boot_merger entpacken

<!-- Chinese PDF p.55 -->

```text
./tools/boot_merger unpack -i rk356x_spl_loader_v1.01.102-528M-1115.bin -o .
```

<!-- Chinese PDF p.55 -->

### 10.3 LoaderToDDR im Android-Upgradewerkzeug

<!-- Chinese PDF p.55 -->

Das Loader-Feld des Werkzeugs besitzt zwei Konfigurationen:

<!-- Chinese PDF p.55 -->

**1.** loader: startet das Upgrade und extrahiert idb.img aus dem Loader-Image zum Flashen.

<!-- Chinese PDF p.55 -->

**2.** loaderToDDR: startet nur das Upgrade.

<!-- Chinese PDF p.55 -->

### 10.4 Einführung in idb_bootconfig

<!-- Chinese PDF p.55 -->

ROM-Code lädt SPI-NOR-Firmware standardmäßig einleitig. bootconfig im gepackten IDB-Header kann vierleitiges schnelleres Laden wählen. Das Skript idb_bootconfig ergänzt diese NOR-Startbeschleunigung im IDB. Die Parameter unterscheiden sich je Baustein. Deshalb empfiehlt die Quelle das Skript statt fester Daten in einem vorgefertigten Image; andernfalls benötigt jedes Modell eigene bootconfig-Parameter.

{% endraw %}
