---
title: "Vollständiger Rockchip-Zweispeicherleitfaden: NOR + EMMC/NVMe, PCIe EP, Pakete und OTA"
description: "Vollständiger Rockchip-Zweispeicherleitfaden: NOR + EMMC/NVMe, PCIe EP, Pakete und OTA — RK-KF-YF-461 V1.5.1; kernel 4.19+, BOOTROM, U-Boot, Vendor Storage."
translation_key: "102-rockchip-dual-storage"
slug: "102-rockchip-dual-storage"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "Dual Storage", "NVMe", "SPI NOR", "EMMC", "PCIe EP", "OTA"]
excerpt: "Vollständiger Rockchip-Zweispeicherleitfaden: NOR + EMMC/NVMe, PCIe EP, Pakete und OTA — RK-KF-YF-461 V1.5.1; kernel 4.19+, BOOTROM, U-Boot, Vendor Storage."
---

{% raw %}

# Vollständiger Rockchip-Zweispeicherleitfaden: NOR + EMMC/NVMe, PCIe EP, Pakete und OTA

Dieser Artikel bewahrt den vollständigen technischen Inhalt von RK-KF-YF-461 V1.5.1: chinesische Seiten 4–18, englische 5–19. Die Kapitel entsprechen einander; Beispiele und Code folgen dem Chinesischen, EN/RU/DE sind vollständig übersetzt. Chinesisch verwendet fünf chinesische Originalbilder, die anderen Sprachen fünf entsprechende englische. Quellenumfang: Chips mit mehreren I/O-unabhängigen Speichern, Kernel 4.19 und neuer; keine Freigabe jeder ArmSoM-Platine. SoC, unabhängige I/Os, NOR-/EMMC-/NVMe-/SATA-Topologie, Versorgung, SDK/BSP, Loader/U-Boot, Kernel, Android-Zweig, Partitionseinheiten und Treiber prüfen. RK3588s-EVB1- und RK3568-EVB1-Patches sind Herstellerreferenzen, keine direkt nutzbaren ArmSoM-Patches oder Messungen. Flashen, OTA, Registerschreiben und Hardwaretests wurden nicht durchgeführt.

> Wichtige Quellenprobleme: §7.1 lässt vnvm und uboot beide bei `0x00000c00` Sektoren beginnen, wodurch sie überlappen; der uboot-Byteoffset in §7.2 weicht ebenfalls ab. Die SPI-NAND-mtdparts-Werte in §6.2 wirken sektorbasiert und müssen mit den Bytebeispielen und Einheiten abgeglichen werden. Alles bleibt ohne vermutete Korrekturen erhalten; nicht direkt für Produktionspartitionierung oder OTA verwenden. Das Packskript löscht temporäre Dateien; diese Seite zeigt es nur. Daten und Geräteidentität zuerst sichern.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel) · [EDITORIAL-NOTES](/docs/rockchip-dual-storage/EDITORIAL-NOTES.md)

<!-- Chinese baseline PDF p.4 -->

## 1. Einführung

<!-- Chinese baseline PDF p.4 -->

Mehrspeicherunterstützung: RK-SoCs besitzen meist mehrere Speichercontroller mit unabhängigen I/Os. RK3568 unterstützt beispielsweise NOR-Flash plus eMMC, RK3588 NOR-Flash plus PCIe-SSD. Bausteine werden danach eingeteilt, ob Masken-ROM-Code sie erkennt:

- Bootable: eMMC, SPI-Flash, paralleles NAND.
- Non-bootable: NVMe-SSD und SATA. Nur damit kann das Masken-ROM nicht starten.

Für nicht startfähigen Hauptspeicher wird ein bootfähiger Baustein ergänzt, etwa NOR + NVMe-SSD/SATA für große Kapazität. Ein weiteres Beispiel ist Firmwareabsicherung mit NOR + eMMC: Ein kleines Wiederherstellungssystem im NOR bleibt bei irreparablem eMMC-Ausfall verfügbar.

<!-- Chinese baseline PDF p.4 -->

## 2. Prinzip

<!-- Chinese baseline PDF p.4 -->

### 2.1 Allgemeiner RK-Zweispeicherstart

<!-- Chinese baseline PDF p.4 -->

![2.1 Allgemeiner RK-Zweispeicherstart: englisches Original, Seite 5](/docs/rockchip-dual-storage/assets/en-p005-figure-01.png)

*2.1 Allgemeiner RK-Zweispeicherstart: englisches Original, Seite 5*

<!-- Chinese baseline PDF p.4 -->

RK-Zweispeicher-Startablauf und Firmwareinformationen:

<!-- Chinese baseline PDF p.5 -->

| Startphase | Firmware-Speicherort | In dieser Phase initialisierter Hauptspeicher | Erforderliche Konfiguration |
| --- | --- | --- | --- |
| Bootrom | Chip-Masken-ROM | Bootfähiger Speicher, etwa NOR | \ |
| SPL | Bootfähiger Speicher, etwa NOR | Bootfähiger Speicher, etwa NOR | \ |
| u-boot | Bootfähiger Speicher, etwa NOR | Hauptspeicher, etwa NVMe | Spezielle U-Boot-Konfiguration |
| kernel | Hauptspeicher, etwa NVMe | Hauptspeicher, etwa NVMe | Standard-Kernelkonfiguration |

<!-- Chinese baseline PDF p.5 -->

U-Boot initialisiert standardmäßig den Speichertyp der vorherigen Phase. Für den Wechsel zum Hauptspeicher, etwa NVMe, eine spezielle U-Boot-Konfiguration ergänzen; siehe Konfiguration.

<!-- Chinese baseline PDF p.5 -->

### 2.2 RK-PCIe-EP-Zweispeicherstart

<!-- Chinese baseline PDF p.5 -->

Einige RK-SoCs unterstützen PCIe EP und können als Standard-Endpoint-Karten für PCs dienen. Dafür muss der PCIe-Controller früh initialisiert werden; dies übernimmt ein zusätzliches pcie_idb.img. Ablauf:

<!-- Chinese baseline PDF p.5 -->

![2.2 RK-PCIe-EP-Zweispeicherstart: englisches Original, Seite 6](/docs/rockchip-dual-storage/assets/en-p006-figure-01.png)

*2.2 RK-PCIe-EP-Zweispeicherstart: englisches Original, Seite 6*

<!-- Chinese baseline PDF p.5 -->

RK-Zweispeicher-Startablauf und Firmwareinformationen:

<!-- Chinese baseline PDF p.6 -->

| Startphase | Firmware-Speicherort | In dieser Phase initialisierter Hauptspeicher | Erforderliche Konfiguration |
| --- | --- | --- | --- |
| Bootrom | Chip-Masken-ROM | Bootfähiger Speicher, etwa NOR | \ |
| PCIe.bin | Bootfähiger Speicher, etwa NOR | NULL | \ |
| SPL | Bootfähiger Speicher, etwa NOR | Bootfähiger Speicher, etwa NOR | \ |
| u-boot | Bootfähiger Speicher, etwa NOR | Hauptspeicher, etwa NVMe | Spezielle U-Boot-Konfiguration |
| kernel | Hauptspeicher, etwa NVMe | Hauptspeicher, etwa NVMe | Standard-Kernelkonfiguration |

<!-- Chinese baseline PDF p.6 -->

U-Boot initialisiert standardmäßig den Speichertyp der vorherigen Phase. Für den Wechsel zum Hauptspeicher, etwa NVMe, eine spezielle U-Boot-Konfiguration ergänzen; siehe Konfiguration.

<!-- Chinese baseline PDF p.6 -->

## 3. Konfiguration

<!-- Chinese baseline PDF p.6 -->

Wie unter Prinzip beschrieben, wechselt das SDK die Zielspeicherinitialisierung in U-Boot. Hauptspeichertreiber, Speicherwechsel und Embedded Kernel DTB wie folgt konfigurieren.

<!-- Chinese baseline PDF p.6 -->

### 3.1 U-Boot-Konfiguration

<!-- Chinese baseline PDF p.6 -->

#### 3.1.1 Hauptspeichertreiber-Konfiguration

<!-- Chinese baseline PDF p.6 -->

Siehe CH05 „Treibermodule“ in Rockchip_Developer_Guide_UBoot_Nextdev_CN.pdf:

- eMMC: Storage, üblicherweise standardmäßig kompatibel.
- PCIe-NVMe: PCIe.

<!-- Chinese baseline PDF p.6 -->

#### 3.1.2 Konfiguration des Hauptspeicherwechsels

<!-- Chinese baseline PDF p.6 -->

In defconfig ergänzen:

<!-- Chinese baseline PDF p.6 -->

```text
CONFIG_ROCKCHIP_BOOTDEV="nvme 0"  # 可择 "nvme"-NVMe "mmc"-eMMC "scsi"-SATA
CONFIG_ROCKCHIP_EMMC_IOMUX=y   # Nor + eMMC ⽅案 spl.bin 中完成 eMMC iomux
```

<!-- Chinese baseline PDF p.7 -->

#### 3.1.3 Embedded Kernel DTB für NVMe/SATA

<!-- Chinese baseline PDF p.7 -->

RK-U-Boot besitzt zwei Phasen:

- Frühe Initialisierung mit standardmäßigem, informationsarmem U-Boot-DTB; siehe Hauptspeichertreiber-Konfiguration.
- Später stehen zwei Optionen zur Verfügung: using kernel dtb liest den DTB aus dem nachfolgenden Image und initialisiert dessen Treiber; using embedded dtb packt einen DTB aus einem U-Boot-Verzeichnis ins U-Boot-Image und initialisiert daraus. Hier embedded verwenden.

Embedded-DTB-defconfig:

<!-- Chinese baseline PDF p.7 -->

```text
CONFIG_EMBED_KERNEL_DTB_ALWAYS=y
CONFIG_EMBED_KERNEL_DTB_PATH="dts/rk3588-evb1-lp4-v10.dtb"  # dtb 存放⽬录
CONFIG_SPL_FIT_IMAGE_KB=2560               # 通常使⽤ embedded dtb 后 u-boot 固件会变⼤
```

<!-- Chinese baseline PDF p.7 -->

DTB ergänzen: Den erforderlichen Kernel-DTB bauen und unter u-boot/dts/ ablegen. Zur Unterscheidung den Kernelnamen beibehalten und bei Updates die Datei ersetzen.

<!-- Chinese baseline PDF p.7 -->

### 3.2 Kernelkonfiguration

<!-- Chinese baseline PDF p.7 -->

Standard-Kernelkonfiguration verwenden.

<!-- Chinese baseline PDF p.7 -->

### 3.3 Android-Konfiguration

<!-- Chinese baseline PDF p.7 -->

In Android das Speichermedium für das Partitionsmounten auf das passende PCIe-Gerät ändern:

<!-- Chinese baseline PDF p.7 -->

```text
@sys2_206:~/4_Android12_29_sdk/device/rockchip/rk3588$ git diff
--- a/BoardConfig.mk
+++ b/BoardConfig.mk
@@ -25,7 +25,7 @@ PRODUCT_KERNEL_CONFIG ?= rockchip_defconfig pcie_wifi.config

#BOARD_AVB_ENABLE := true
# used for fstab_generator, sdmmc controller address
-PRODUCT_BOOT_DEVICE := fe2e0000.mmc
+PRODUCT_BOOT_DEVICE := fe180000.pcie
PRODUCT_SDMMC_DEVICE := fe2c0000.mmc

SF_PRIMARY_DISPLAY_ORIENTATION := 0
```

<!-- Chinese baseline PDF p.8 -->

## 4. Firmware-Partitionslayout und Paketierung

<!-- Chinese baseline PDF p.8 -->

### 4.1 Allgemeine RK-Zweispeicherfirmware

<!-- Chinese baseline PDF p.8 -->

Das Standard-SDK packt nur Firmware für einen Speicher. Die SDK-Skripte anhand des Beispiels anpassen oder das neue Zweispeicher-Packverfahren direkt verwenden.

Werkzeugverzeichnis:

<!-- Chinese baseline PDF p.8 -->

```text
.
├── afptool
├── gen-package-file.sh
├── Image             # main storage 固件
│ ├── boot.img
│ ├── MiniLoaderAll.bin
│ ├── parameter.txt
│ └── userdata.img
├── Image-nor            # boot storage 固件
│ ├── MiniLoaderAll.bin
│ ├── parameter.txt
│ └── uboot.img
├── mkupdate.sh
└── rkImageMaker
```

<!-- Chinese baseline PDF p.8 -->

Image-nor erstellen und die gebaute NOR-Firmware dort ablegen. Beispiel für parameter.txt:

<!-- Chinese baseline PDF p.8 -->

```text
CMDLINE:mtdparts=rk29xxnand:0x00000080@0x00000000(gpt),0x00000800@0x00000080(idb),0x00000800@0x00001000(vnvm),0x00002000@0x00001800(uboot)
```

<!-- Chinese baseline PDF p.8 -->

mkupdate.sh für Zweispeicher-Pakete ändern:

<!-- Chinese baseline PDF p.8 -->

```text
#!/bin/bash
# Author: kenjc@rock-chips.com
# 2021-08-13
# Use: ./mkupdate.sh PLATFORM IMAGE_PATH to pack update.img

declare -A vendor_id_map
vendor_id_map["rk3588"]="-RK3588"
vendor_id_map["rk356x"]="-RK3568"
vendor_id_map["rk3326"]="-RK3326"
vendor_id_map["px30"]="-RKPX30"
vendor_id_map["rk3368"]="-RK330A"
vendor_id_map["rk322x"]="-RK322A"
vendor_id_map["rk3399pro"]="-RK330C"
vendor_id_map["rk3328"]="-RK322H"
vendor_id_map["rk3288"]="-RK32"
vendor_id_map["rk3126c"]="-RK312A"
vendor_id_map["rk3399"]="-RK330C"

readonly PLATFORM=$1
readonly IMAGE_PATH=$2
readonly IMAGE_PATH_NOR=$3
readonly PACKAGE_FILE=package-file-tmp

echo "packing update.img with $IMAGE_PATH ${vendor_id_map[$PLATFORM]}"

pause() {
 echo "Press any key to quit:"
 read -n1 -s key
 exit 1
}

if [ ! -f "$IMAGE_PATH/parameter.txt" ]; then
  echo "Error:No found parameter!"
# pause
fi

echo "regenernate $PACKAGE_FILE..."
if [ -f "$PACKAGE_FILE" ]; then
  rm -rf $PACKAGE_FILE
fi
./gen-package-file.sh $IMAGE_PATH > $PACKAGE_FILE

echo "start to make emmc update.img..."
./afptool -pack ./ $IMAGE_PATH/update.img $PACKAGE_FILE || pause
./rkImageMaker ${vendor_id_map[$PLATFORM]} $IMAGE_PATH/MiniLoaderAll.bin $IMAGE_PATH/update.img emmc_update.img -os_type:androidos -storage:emmc || pause
echo "Making emmc_update.img OK."

echo "regenernate $PACKAGE_FILE..."
if [ -f "$PACKAGE_FILE" ]; then
  rm -rf $PACKAGE_FILE
fi

./gen-package-file.sh $IMAGE_PATH_NOR > $PACKAGE_FILE

echo "start to make spinor update.img..."

./afptool -pack ./ $IMAGE_PATH_NOR/update.img $PACKAGE_FILE || pause
./rkImageMaker ${vendor_id_map[$PLATFORM]} $IMAGE_PATH_NOR/MiniLoaderAll.bin $IMAGE_PATH_NOR/update.img spinor_update.img -os_type:androidos -storage:spinor || pause
echo "Making spi_update.img OK."

./rkImageMaker -merge ./update.img ./emmc_update.img ./spinor_update.img
rm ./spinor_update.img ./emmc_update.img

exit 0
```

<!-- Chinese baseline PDF p.9 -->

Skript ausführen — RK3568:

<!-- Chinese baseline PDF p.9 -->

```text
./mkupdate.sh rk356x Image/ Image-nor/
```

<!-- Chinese baseline PDF p.10 -->

RK3588:

<!-- Chinese baseline PDF p.10 -->

```text
./mkupdate.sh rk3588 Image/ Image-nor/
```

<!-- Chinese baseline PDF p.10 -->

### 4.2 RK-PCIe-EP-Zweispeicherpakete

<!-- Chinese baseline PDF p.10 -->

Das Packprinzip entspricht dem allgemeinen RK-Zweispeicherverfahren. Verzeichnis:

<!-- Chinese baseline PDF p.10 -->

```text
.
├── afptool
├── gen-package-file.sh
├── Image          # main storage 固件
│ ├── boot.img
│ ├── MiniLoaderAll.bin
│ ├── parameter.txt
│ └── userdata.img
├── Image-flash        # boot storage 固件
│ ├── MiniLoaderAll.bin
│ ├── normal_idb.img     # idblock.img，包含 ddr.bin 和 spl.bin
│ ├── parameter.txt
│ ├── pcie_idb.img      # PCIe_idblock.img，源码⼯程 bootloader-ep 默认输出双备份镜像，包含 pcie.bin
│ └── uboot.img
├── mkupdate.sh
└── rkImageMaker
```

<!-- Chinese baseline PDF p.10 -->

pcie_idb.img mit folgenden Befehlen aus rkbin erzeugen:

<!-- Chinese baseline PDF p.10 -->

```text
#⽣成 loader
./tools/boot_merger RKBOOT/RK3588MINIALL_PCIE_EP.ini
$ls rk3588_pcie_loader_v1.00.bin
rk3588_pcie_loader_v1.00.bin

#制作 idb，要求使⽤ spinand type 做对⻬
./tools/programmer_image_tool -i rk3588_pcie_loader_v1.00.bin -b 128 -p 2 -t spinand -o ./

#制作双备份的 pcie_idb.img
cat idblock.img > pcie_idb.img
cat idblock.img >> pcie_idb.img
rm idblock.img
```

<!-- Chinese baseline PDF p.10 -->

normal_idb.img aus rkbin mit folgenden Befehlen erzeugen. Der chinesische Fließtext schreibt nornal_idb.img; der tatsächliche Befehlsdateiname bleibt erhalten:

<!-- Chinese baseline PDF p.11 -->

```text
#⽣成 loader
./tools/boot_merger RKBOOT/RK3588MINIALL.ini
$ls rk3588_spl_loader_v1.14.113.bin
rk3588_spl_loader_v1.14.113.bin

#制作 idb，要求使⽤ spinand type 做对⻬
./tools/programmer_image_tool -i rk3588_spl_loader_v1.14.113.bin -b 128 -p 2 -t spinand -o ./

#制作双备份的 normal_idb.img
cat idblock.img > normal_idb.img
cat idblock.img >> normal_idb.img
rm idblock.img
```

<!-- Chinese baseline PDF p.11 -->

Image-flash erstellen und parameter konfigurieren. SPI-NOR-Beispiel:

<!-- Chinese baseline PDF p.11 -->

```text
CMDLINE:mtdparts=rk29xxnand:0x00000080@0x00000000(gpt),0x00000400@0x00000080(pcie_idb),0x00000b80@0x00000480(normal_idb),0x00000800@0x00001000(vnvm),0x00002000@0x00001800(uboot)
```

<!-- Chinese baseline PDF p.11 -->

Beispiel für SPI-NAND mit 2KB-Seiten:

<!-- Chinese baseline PDF p.11 -->

```text
CMDLINE:mtdparts=rk29xxnand:0x00000080@0x00000000(gpt),0x00000400@0x00000100(pcie_idb),0x00000400@0x00000500(normal_idb),0x00000800@0x00001000(vnvm),0x00002000@0x00001800(uboot)
```

<!-- Chinese baseline PDF p.11 -->

Beispiel für SPI-NAND mit 4KB-Seiten (auch mit 2KB kompatibel):

<!-- Chinese baseline PDF p.11 -->

```text
CMDLINE:mtdparts=rk29xxnand:0x00000080@0x00000000(gpt),0x00000400@0x00000200(pcie_idb),0x00000400@0x00000600(normal_idb),0x00000800@0x00001000(vnvm),0x00002000@0x00001800(uboot)
```

<!-- Chinese baseline PDF p.11 -->

mkupdate.sh gemäß dem allgemeinen RK-Zweispeicher-Packabschnitt ändern und ausführen.

<!-- Chinese baseline PDF p.11 -->

## 5. Firmware flashen

<!-- Chinese baseline PDF p.11 -->

RK-Werkzeuge unterstützen das Flashen mehrerer Speicher. Unter Windows RKDevTool_Release_v2.93 oder neuer verwenden; siehe §1.12 zur Mehrgeräteauswahl im mitgelieferten Entwicklerhandbuch.

Beide in einem Vorgang flashen:

<!-- Chinese baseline PDF p.12 -->

![5. Firmware flashen: englisches Original, Seite 13](/docs/rockchip-dual-storage/assets/en-p013-figure-01.png)

*5. Firmware flashen: englisches Original, Seite 13*

<!-- Chinese baseline PDF p.12 -->

Nur SPI-NOR: maskrom aufrufen und nur SPINOR-Firmware auswählen.

Nur NVMe: Loader-Modus aufrufen und nur PCIe-Firmware auswählen.

<!-- Chinese baseline PDF p.12 -->

## 6. OTA-Upgrade

<!-- Chinese baseline PDF p.12 -->

### 6.1 Allgemeines RK-Zweispeicher-OTA

<!-- Chinese baseline PDF p.12 -->

Beispiel NOR + eMMC. NOR enthält MiniLoader, parameter.txt und uboot.img, laut Quelle alle OTA-fähig. Das Beispiel aktualisiert uboot. MiniLoader- oder parameter.txt-Updates werden wegen hohen Risikos nicht empfohlen.

U-Boot liegt im NOR, boot/rootfs im eMMC. U-Boot-Partition und NOR-Gerätekonfiguration im Kernel ergänzen. Auf Grundlage von parameter.txt des allgemeinen Packverfahrens recovery-DTS-mtdparts definieren:

<!-- Chinese baseline PDF p.12 -->

```text
mtdparts=sfc_nor:0x00100000@0x00010000(idb),0x00100000@0x00200000(vnvm),0x00400000@0x00300000(uboot)
```

<!-- Chinese baseline PDF p.12 -->

NOR-Gerätekonfiguration ergänzen:

<!-- Chinese baseline PDF p.13 -->

```text
&sfc {
   status = "okay";
   pinctrl-names = "default";
   pinctrl-0 = <&fspim1_pins>;       // 选择实际 io
   flash@0 {
       compatible = "jedec,spi-nor";
       reg = <0>;
       spi-max-frequency = <75000000>;
       spi-rx-bus-width = <4>;
       spi-tx-bus-width = <1>;
   };
};
```

<!-- Chinese baseline PDF p.13 -->

Danach /dev/mtdblock im Root-Dateisystem prüfen. Fehlt es, Konfiguration und Startprotokoll auf SPI-NOR-Fehler wie falsches iomux oder nicht unterstützte Modelle untersuchen.

EMMC: Die Partitionsdaten liegen in dessen parameter.txt. Entsprechende Einträge erzeugen mmcblock-Geräte im Root-Dateisystem. Sind beide Speicherpartitionen vorhanden, den Recovery-Patch über den Quellenlink beziehen und dessen OTA-Anleitung befolgen. Eigene Updater können die Schreibmethode für die Partitionsknoten selbst wählen:

<!-- Chinese baseline PDF p.13 -->

[Recovery-Patch-Link der Quelle (Verfügbarkeit/Zugriff nicht geprüft)](https://pan.baidu.com/s/1LiutCDJZ8BXiEN6X8U6teQ?pwd=nwm3) — `nwm3`

<!-- Chinese baseline PDF p.13 -->

### 6.2 RK-PCIe-EP-Zweispeicher-OTA

<!-- Chinese baseline PDF p.13 -->

Das Prinzip entspricht allgemeinem RK-Zweispeicher-OTA; nur die Partitionseinträge ändern sich. Auf Basis von parameter.txt des PCIe-EP-Packabschnitts recovery-DTS-mtdparts ergänzen. SPI-NOR:

<!-- Chinese baseline PDF p.13 -->

```text
mtdparts=sfc_nor:0x00080000@0x00010000(pcie_idb),0x00170000@0x00090000(normal_idb),0x00100000@0x00200000(vnvm),0x00400000@0x00300000(uboot)
```

<!-- Chinese baseline PDF p.13 -->

Beispiel für SPI-NAND mit 2KB-Seiten:

<!-- Chinese baseline PDF p.13 -->

```text
mtdparts=spi-nand0:0x00000080@0x00000000(gpt),0x00000400@0x00000100(pcie_idb),0x00000400@0x00000500(normal_idb),0x00000800@0x00001000(vnvm),0x00002000@0x00001800(uboot)
```

<!-- Chinese baseline PDF p.13 -->

Beispiel für SPI-NAND mit 4KB-Seiten (auch mit 2KB kompatibel):

<!-- Chinese baseline PDF p.13 -->

```text
mtdparts=spi-nand0:0x00000080@0x00000000(gpt),0x00000400@0x00000200(pcie_idb),0x00000400@0x00000600(normal_idb),0x00000800@0x00001000(vnvm),0x00002000@0x00001800(uboot)
```

<!-- Chinese baseline PDF p.14 -->

## 7. SPI-NOR-Vendor-Storage-Unterstützung

<!-- Chinese baseline PDF p.14 -->

Bei SPI-NOR + SSD (SATA oder NVMe) SN, MAC und ähnliche Daten im SPI-NOR ablegen. Eine vnvm-Partition für Vendor Storage definieren; Offset und Größe müssen Vielfache von 64KB sein.

<!-- Chinese baseline PDF p.14 -->

### 7.1 Partitionstabelle ändern

<!-- Chinese baseline PDF p.14 -->

vnvm in SPI-NOR-parameter.txt ergänzen. Einheit: Sektoren (512 Byte). Quellbeispiel:

<!-- Chinese baseline PDF p.14 -->

```text
CMDLINE: mtdparts=rk29xxnand:0x00000200@0x00000c00(vnvm),0x00003000@0x00000c00(uboot)
```

<!-- Chinese baseline PDF p.14 -->

### 7.2 SPI-NOR-Partitionen im Kernel ergänzen

<!-- Chinese baseline PDF p.14 -->

Die SPI-NOR-Partitionstabelle in Kernel-DTS-CMDLINE ergänzen; Offsets und Größen müssen parameter.txt entsprechen, hier jedoch in Byte. Quellbeispiel:

<!-- Chinese baseline PDF p.14 -->

```text
CMDLINE: mtdparts=sfc_nor:0x00040000@0x00180000(vnvm),0x00600000@0x00200000(uboot)
```

<!-- Chinese baseline PDF p.14 -->

## 8. Häufige Fragen

<!-- Chinese baseline PDF p.14 -->

### 8.1 NOR-Firmwarelayout verkleinern

<!-- Chinese baseline PDF p.14 -->

NOR-Loader-Upgrades platzieren IDB standardmäßig automatisch, einschließlich Startoffset und Mehrfachkopien. Dieses Verfahren möglichst beibehalten. Für abweichende NOR-Layouts dient folgendes RK3568-NOR-/eMMC-Beispiel. AndroidTool-Firmwarelayout:

<!-- Chinese baseline PDF p.15 -->

![8.1 NOR-Firmwarelayout verkleinern: englisches Original, Seite 16](/docs/rockchip-dual-storage/assets/en-p016-figure-01.png)

*8.1 NOR-Firmwarelayout verkleinern: englisches Original, Seite 16*

<!-- Chinese baseline PDF p.15 -->

AndroidTool-Konfigurationsdatei ändern:

<!-- Chinese baseline PDF p.15 -->

![8.1 NOR-Firmwarelayout verkleinern: englisches Original, Seite 17](/docs/rockchip-dual-storage/assets/en-p017-figure-01.png)

*8.1 NOR-Firmwarelayout verkleinern: englisches Original, Seite 17*

Die Werkzeug-Screenshots stammen aus der englischen PDF; Oberfläche und Konfigurationskommentare sind darin weiterhin chinesisch. Editierbare Abschrift des Konfigurationsbildes; leere Werte bleiben erhalten und sind keine empfohlenen Standardwerte:

```ini
MSC_VIDPID=
ADB_VIDPID=
MTP_VIDPID=
UVC_VIDPID=

#指定是否支持全速usb设备,当SUPPORTLOWUSB=TRUE时,增加全速usb设备支持,默认只支持高速usb设备
SUPPORTLOWUSB=true
#设置烧写固件时单次传输的数据带宽,取值在[0-6]之间,6代表1M,5代表512K,0代表16K
FORCE_DATA_BAND=
MSC_TIMEOUT=30
ROCKUSB_TIMEOUT=30
#指定启动时加载的镜像配置文件,默认为config.cfg
DEFAULT_IMAGE_CONFIG=config.cfg
#下载Image镜像后是否进行设备重启
RESET_AFTER_DOWNLOAD=TRUE
#当设置FW_NOT_CHECK=TRUE时,固件加载时不进行完整性校验
FW_NOT_CHECK=TRUE
#当设置RB_CHECK_OFF=FALSE时,固件升级时才进行回读校验
RB_CHECK_OFF=
#LBA_PARITY=TRUE时,设备端开启写后校验
LBA_PARITY=
#NorFlash单个IDBlock
NOR_SINGLE_IDB=
#当设置CLOSE_CHECK_IDB=TRUE时,不检查IDBLOCK是否会被覆盖
CLOSE_CHECK_IDB=TRUE
#自动保存配置
AUTO=true
```

<!-- Chinese baseline PDF p.15 -->

Erklärung:

<!-- Chinese baseline PDF p.15 -->

**1.** Loader zu LoaderToDDR ändern, um automatisches IDB-Layout abzuschalten. Der Loader startet dann nur das Upgrade.

<!-- Chinese baseline PDF p.15 -->

**2.** SPI-NOR: Partitionstabelle automatisch über parameter / parameter.txt oder explizit über gpt / gpt.img aktualisieren.

<!-- Chinese baseline PDF p.15 -->

**3.** EMMC entspricht dem Einzelspeicherverfahren und benötigt weiterhin parameter.txt zur Partitionstabellenerstellung.

<!-- Chinese baseline PDF p.15 -->

**4.** Da automatisches IDB-Layout abgeschaltet ist, auch die IDB-Imageprüfung im Upgradewerkzeug abschalten.

<!-- Chinese baseline PDF p.16 -->

## 9. Anhang

<!-- Chinese baseline PDF p.16 -->

### 9.1 RK3588s-EVB1-NOR-/NVMe-Referenzpatch

<!-- Chinese baseline PDF p.16 -->

```text
From 89825ff12bc92ba9dd9e063e9835ecb03b732b92 Mon Sep 17 00:00:00 2001
From: Jon Lin <jon.lin@rock-chips.com>
Date: Fri, 19 Nov 2021 20:57:52 +0800
Subject: [PATCH] TEST: uboot: rk3588s-tablet&evb1: nvme

Change-Id: I332fcceb8984712a4cd3eec053f813590f4e9bbe
Signed-off-by: Jon Lin <jon.lin@rock-chips.com>
---
arch/arm/dts/rk3588-u-boot.dtsi | 34 +++++++++++++++++++++++++++++++++
configs/rk3588_defconfig   | 12 ++++++++++++
2 files changed, 46 insertions(+)

diff --git a/arch/arm/dts/rk3588-u-boot.dtsi b/arch/arm/dts/rk3588-u-boot.dtsi
index 3fe8054aac..25ebf26873 100644
--- a/arch/arm/dts/rk3588-u-boot.dtsi
+++ b/arch/arm/dts/rk3588-u-boot.dtsi
@@ -22,6 +22,33 @@
   compatible = "rockchip,rk3588-secure-otp";
   reg = <0x0 0xfe3a0000 0x0 0x4000>;
  };
+
+ vcc12v_dcin: vcc12v-dcin {
+   u-boot,dm-pre-reloc;
+   compatible = "regulator-fixed";
+   regulator-name = "vcc12v_dcin";
+   regulator-always-on;
+   regulator-boot-on;
+   regulator-min-microvolt = <12000000>;
+   regulator-max-microvolt = <12000000>;
+ };
+
+ vcc3v3_pcie20: vcc3v3-pcie20 {
+   u-boot,dm-pre-reloc;
+   compatible = "regulator-fixed";
+   regulator-name = "vcc3v3_pcie20";
+   regulator-min-microvolt = <3300000>;
+   regulator-max-microvolt = <3300000>;
+   enable-active-high;
+   gpio = <&gpio4 RK_PB1 GPIO_ACTIVE_HIGH>;
+   startup-delay-us = <5000>;
+   vin-supply = <&vcc12v_dcin>;
+ };
+};
+
+&combphy2_psu {
+ u-boot,dm-pre-reloc;
+ status = "okay";
};
&firmware {
@@ -201,6 +228,13 @@
  u-boot,dm-spl;
};

+&pcie2x1l1 {
+ u-boot,dm-pre-reloc;
+ reset-gpios = <&gpio4 RK_PA2 GPIO_ACTIVE_HIGH>;
+ vpcie3v3-supply = <&vcc3v3_pcie20>;
+ status = "okay";
+};
+
&pinctrl {
  u-boot,dm-spl;
  /delete-node/ sdmmc;
diff --git a/configs/rk3588_defconfig b/configs/rk3588_defconfig
index f65da00444..f9fbaa145b 100644
--- a/configs/rk3588_defconfig
+++ b/configs/rk3588_defconfig
@@ -226,3 +226,15 @@ CONFIG_RK_AVB_LIBAVB_USER=y
CONFIG_OPTEE_CLIENT=y
CONFIG_OPTEE_V2=y
CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION=y
+CONFIG_CMD_PCI=y
+CONFIG_NVME=y
+CONFIG_PCI=y
+CONFIG_DM_PCI=y
+CONFIG_DM_PCI_COMPAT=y
+CONFIG_PCIE_DW_ROCKCHIP=y
+CONFIG_PHY_ROCKCHIP_NANENG_COMBOPHY=y
+CONFIG_PHY_ROCKCHIP_SNPS_PCIE3=y
+CONFIG_DM_REGULATOR_FIXED=y
+CONFIG_ROCKCHIP_BOOTDEV="nvme 0"
+CONFIG_EMBED_KERNEL_DTB_ALWAYS=y
+CONFIG_SPL_FIT_IMAGE_KB=2560
--
2.17.1
```

<!-- Chinese baseline PDF p.17 -->

### 9.2 RK3568-EVB1-NOR-/eMMC-Referenzpatch

<!-- Chinese baseline PDF p.17 -->

```text
diff --git a/configs/rk3568_defconfig b/configs/rk3568_defconfig
index d157307403..82801f3dcb 100644
--- a/configs/rk3568_defconfig
+++ b/configs/rk3568_defconfig
@@ -222,3 +222,5 @@ CONFIG_RK_AVB_LIBAVB_USER=y
CONFIG_OPTEE_CLIENT=y
CONFIG_OPTEE_V2=y
CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION=y
+CONFIG_ROCKCHIP_EMMC_IOMUX=y
+CONFIG_ROCKCHIP_BOOTDEV="mmc 0"
```

<!-- Chinese baseline PDF p.17 -->

Hinweis:

<!-- Chinese baseline PDF p.18 -->

Für diesen Referenzpatch muss Embedded Kernel DTB nicht aktiviert werden.

{% endraw %}
