---
title: "Rockchip PCIe EP Linux: Start, BAR, Firmware und Reset"
description: "Rockchip PCIe EP Linux: Start, BAR, Firmware und Reset — RK-KF-YF-C51 V3.2.0; RK3588, RK3568."
translation_key: "108-rockchip-pcie-ep"
slug: "108-rockchip-pcie-ep"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, PCIe, RK3588, RK3568]
excerpt: "Rockchip PCIe EP Linux: Start, BAR, Firmware und Reset — RK-KF-YF-C51 V3.2.0; RK3588, RK3568."
---

{% raw %}

Vollständige technische Übersetzung der chinesischen Quelle RK-KF-YF-C51 V3.2.0. Geltungsbereich: RK3588 Linux 6.1/5.10; RK3568 Linux 6.1/5.10/4.19; RT-Thread ist nur auf der RK-PCIe-EP-Seite implementiert. Kein englisches PDF liegt vor; alle Sprachen verwenden chinesische Originalbilder. Plattformreferenz: PCIe-Anbindung, Versorgung, PERST#/WAKE#, SDK/BSP, Loader und Kernel des konkreten ArmSoM-Boards prüfen. Keine ArmSoM-Hardwarevalidierung durchgeführt.

> Zu prüfen: „1MB(2^0) bis 8EB(2^20)“ ist rechnerisch widersprüchlich; SPL_PCIE_EP_SUPPOR weicht von SUPPORT im Code ab; reset-gpios und wake-gpios verwenden beide gpio3 13; §1.4 endet unvollständig, §7.2.2 ist diagnostisch unklar und §7.2.3 nennt Host Reset. Beispiele nicht ungeprüft einsetzen. Flashen, OTP, Partitionierung und Reset können Datenverlust verursachen; keine Befehle wurden ausgeführt.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

<!-- Source PDF p.5 -->

## 1 Startverfahren

### 1.1 Vergleich der Startverfahren

| Verfahren | Vorteile | Nachteile |
| --- | --- | --- |
| PCIe Boot | Schnelle PCIe-Initialisierung; kein Speicher; Host-Firmwaredownloads | Wenige einstellbare PCIe-Parameter; begrenzte Kompatibilität |
| Flash Boot mit PCIe Bin und EP Boot | Allgemeine RCs; vollständig einstellbare PCIe-Parameter; kleiner Speicher; Host-Firmwaredownloads | Relativ komplexer Softwareablauf |
| Flash Boot mit PCIe Bin | Allgemeine RCs; vollständig einstellbare PCIe-Parameter; lokaler Speicher | Großer Speicher |
| Common Boot | Einfachster Softwareablauf; lokaler Speicher | Großer Speicher; nur bestimmte RCs |

### 1.2 PCIe Boot

PCIe Boot ist die im ROM-Code integrierte PCIe-Firmwareladelogik. Sie übernimmt PCIe-Enumeration und Firmwareübertragung: schnelle PCIe-Initialisierung, kein Speicher und Firmwaredownload vom Host. Die Chipunterstützung ist unter „RK SOC PCIe-Verbindungseigenschaften“ zu prüfen. Da der Initialisierungscode im Masken-ROM festliegt, lassen sich die meisten Parameter nicht ändern; nur bestimmte PCIe-Einstellungen sind über OTP anpassbar. Eine Umgebung mit festem RC-Typ wird empfohlen. Es folgt das Ablaufdiagramm.

<!-- Source PDF p.6 -->

![Ablaufdiagramm der chinesischen Quelle, Seite 6](/docs/rockchip-pcie-ep/assets/cn-p006-figure-01.png)

*Ablaufdiagramm der chinesischen Quelle, Seite 6*

Hinweis: Rote Pfeile kennzeichnen Firmwaredownloads vom Host. Ablauf: BootROM führt die PCIe-Enumeration und PCIe Boot aus; der Host lädt Pre-Loader herunter, der anschließend ausgeführt wird. Loader startet mehrere frühe Firmwareteile: üblicherweise ddr.bin zur DDR-Initialisierung und loader.bin mit EP-Boot-Logik. Der Host lädt firmware mit nachfolgenden Firmwareteilen, Algorithmen und weiteren Daten; anschließend startet die nachfolgende Firmware. Unter Linux ist loader.bin gleich spl.bin. OS bezeichnet die nachfolgende Firmware mit dem chips connectr-Paket zur Chipverbindung in kernel/userspace.

### 1.3 Flash Boot mit PCIe Bin und EP Boot

Flash Boot ist das SPI-Flash-Startverfahren für RK SOC. Zusätzlich zu SPI Flash Boot integriert die Loader-Stufe PCIe Bin für schnelle PCIe-Initialisierung sowie EP-Boot-Logik, damit der Host nachfolgende Firmware übertragen kann. Es folgt das Ablaufdiagramm.

<!-- Source PDF p.7 -->

![Ablaufdiagramm der chinesischen Quelle, Seite 7](/docs/rockchip-pcie-ep/assets/cn-p007-figure-01.png)

*Ablaufdiagramm der chinesischen Quelle, Seite 7*

SPI Flash dient als Startspeicher; PCIe Bin ermöglicht schnelle PCIe-Initialisierung, der Host liefert nachfolgende Firmware. Der Anschluss an einen allgemeinen PC wird unterstützt.

Rote Pfeile zeigen vom Host eingeleitete Firmwaredownloads. BootROM lädt und startet PCIe Bin/Pre-Loader. PCIe Bin übernimmt die PCIe-Enumeration. Loader führt frühe Firmware aus: normalerweise pcie.bin für die PCIe-Enumeration, ddr.bin für DDR-Initialisierung und loader.bin mit EP Boot. Der Host lädt fw packet mit nachfolgender Firmware, Algorithmen und weiteren Daten; anschließend startet die nachfolgende Firmware. Unter Linux entspricht loader.bin der spl.bin. OS führt chips connect in kernel/userspace aus.

### 1.4 Flash Boot mit PCIe Bin

Flash Boot ist das SPI-Flash-Startverfahren für RK SOC. In der Loader-Stufe ermöglicht PCIe Bin schnelle PCIe-Initialisierung und die Anbindung allgemeiner PCs. Lokaler Speicher wird unterstützt: Bei einem Speicher wird nachfolgende Firmware aus SPI Flash geladen; bei zwei Speichern dient SPI Flash als Startspeicher zusammen mit großem NVMe/eMMC-Speicher, aus dem

<!-- Source PDF p.8 -->

nachfolgende Firmware geladen wird. Einzelheiten stehen in Rockchip_Developer_Guide_Dual_Storage_CN.pdf. Es folgt das Ablaufdiagramm.

![Ablaufdiagramm der chinesischen Quelle, Seite 8](/docs/rockchip-pcie-ep/assets/cn-p008-figure-01.png)

*Ablaufdiagramm der chinesischen Quelle, Seite 8*

Rote Pfeile markieren Host-Firmwaredownloads. BootROM lädt PCIe Bin/Pre-Loader; PCIe Bin enumeriert. Loader startet pcie.bin zur Enumeration, ddr.bin zur DDR-Initialisierung und loader.bin für nachfolgende Firmware. OS führt chips connect in kernel/userspace aus. Zwei Speicher sind möglich: SPI Flash zum Start, NVMe/eMMC als Hauptspeicher; siehe Rockchip_Developer_Guide_Dual_Storage_CN.pdf. Der letzte Quellsatz nennt eine Erweiterung auf SPI Nand Flash Boot und Optimierung des RC-Firmwaredownloads zu EP, führt die Erklärung aber nicht zu Ende.

### 1.5 Common Boot

Common Boot ist das allgemeine Startverfahren für RK SOC; PCIe-Initialisierung und Enumeration erfolgen im Kernel. Da eine schnelle PCIe-Initialisierung fehlt, ist die Anbindung allgemeiner PCs nicht unterstützt. Geeignet sind RK-Chipverbindungen, nicht standardmäßige EP-Karten mit eigener Versorgung und anpassbare RC-Mainboards. Es folgt das Ablaufdiagramm.

<!-- Source PDF p.9 -->

![Ablaufdiagramm der chinesischen Quelle, Seite 9](/docs/rockchip-pcie-ep/assets/cn-p009-figure-01.png)

*Ablaufdiagramm der chinesischen Quelle, Seite 9*

## 2 Hardwarekonfiguration

Für das detaillierte Hardwaredesign kann ein Referenzschaltplan bei RK angefordert werden, beispielsweise RK_PCIeEP_DEMO_RK3588_LP4XD200P232SD8_V10_20230323RZF.pdf für RK3588. Das PCIe-EP-Hardwaredesign ist zusätzlich an die tatsächliche Produktform anzupassen.

## 3 DTS-Konfiguration

```text
/{
    reserved-memory {
        #address-cells = <2>;
        #size-cells = <2>;
        ranges;
        bar0_region: bar0-region@3c000000 {
            reg = <0x0 0x3c000000 0x0 0x00400000>;
        };
        bar2_region: bar2-region@40000000 {
            reg = <0x0 0x40000000 0x0 0x04000000>; # Bar⼤⼩配置：0x04000000Bytes
        };
    };
}

&pcie3x4 {
        compatible = "rockchip,rk3588-pcie-std-ep";
        memory-region = <&bar0_region>, <&bar2_region>;
        memory-region-names = "bar0", "bar2";
        reset-gpios = <&gpio4 RK_PB6 GPIO_ACTIVE_LOW>; # PERST# GPIO配置
        rockchip,ep-power-independent; # PERST# GPIO配置
        status = "okay";
};
```

Sondereinstellungen für RK-Chipverbindungen mit unabhängiger Versorgung (für Standardkarten nicht erforderlich).

1. reset-gpios = &lt;&gpio3 13 GPIO_ACTIVE_HIGH&gt;; Pflichtangabe für den PERST#-Reseteingang der PCIe-Schnittstelle. Bei gesteckten wie verlöteten Geräten den Pin im Schaltplan ermitteln und korrekt konfigurieren; andernfalls ist ein stabiler Linkaufbau möglicherweise nicht möglich.

2. wake-gpios = &lt;&gpio3 13 GPIO_ACTIVE_HIGH&gt;; Pflichtangabe für den WAKE#-Ausgang der PCIe-Schnittstelle. Bei gesteckten wie verlöteten Geräten den Pin korrekt bestimmen und konfigurieren; andernfalls kann der Host beim Aufwachen nicht benachrichtigt werden.

## 4 Menuconfig-Konfiguration

```text
CONFIG_PCIE_DW_ROCKCHIP_EP=y
# CONFIG_STRICT_DEVMEM is not set   #建议开发阶段关闭STRICT_DEVMEM限制，⽅便使⽤io命令调试
```

## 5 Gerätetreiberkonfiguration

Der PCIe-EP-Gerätetreiber läuft auf dem Root Complex (RC), steuert Busübertragungen und stellt die von Anwendungen benötigten Kernelschnittstellen bereit. Es folgen die RK-RC-Kconfig-Einstellungen.

```text
CONFIG_PCIE_FUNC_RKEP=y
```

Allgemeiner RC-FUNC-Treiber: Das RK-Chips-Connect-Paket unterstützt den Bau eines KO-Moduls; siehe chips_connect/patch-kernelx.xx/通用RC-FUNC驱动/.

## 6 Weitere Softwareeinstellungen

### 6.1 Hinweise zur Softwareentwicklung

Einige EP-Karteneinstellungen sind gekoppelt: Bei einer Änderung müssen alle zugehörigen Stellen angepasst werden. Bei der BAR-Größe betrifft dies die PCIe-Bin-Stufe (Zweispeicherverfahren) und SPL.

<!-- Source PDF p.11 -->

### 6.2 Konfiguration der PCIe-Bin-Stufe

PCIe bin initialisiert ausschließlich den PCIe-Controller im EP-Modus, noch vor dram.bin. Eine kompilierte pcie.bin und Quellcode stehen für Anpassungen bereit. Die Binärdatei liegt unter SDK/rkbin/bin/rkxx/, der Quellcode unter patch-*/bootloader. Direkte Änderungen der pcie.bin-Konfiguration werden empfohlen; nur Sonderänderungen erfordern einen eigenen Build.

#### 6.2.1 Dynamische pcie.bin-Konfiguration

pcie.bin erlaubt Änderungen im reservierten Konfigurationsbereich der Binärdatei für PCIe Generation, PCIe lanes, UART-Baudrate, PCIe vendor id und PCIe device id. Dazu dient rkbin/tools/pcie_idb_config.sh; die Befehlsbeschreibung folgt.

```text
./tools/pcie_idb_config.sh <soc> <gen> <lanes> <uart_baundary> <vid_l> <vid_h> <did_l> <did_h> <input>
like following:
./tools/pcie_idb_config.sh RK3588 3 4 1500000 87 1d 6a 35 bin/rk35/rk3588_pcie_v*.bin
#vid=0x1d87 did=0x356a
./tools/pcie_idb_config.sh RK3588 3 2 1500000 87 1d 6a 35 bin/rk35/rk3588_pcie_v*.bin
./tools/pcie_idb_config.sh RK3588 3 1 1500000 87 1d 6a 35 bin/rk35/rk3588_pcie_v*.bin
./tools/pcie_idb_config.sh RK3588 3 4 115200  87 1d 6a 35 bin/rk35/rk3568_pcie_v*.bin
./tools/pcie_idb_config.sh RK3568 3 2 1500000 87 1d 6a 35 bin/rk35/rk3588_pcie_v*.bin
```

Reichen die verfügbaren Einstellungen nicht aus, kann der Quellcode angepasst werden.

#### 6.2.2 pcie.bin aus Quellcode bauen

Der Quellcode benötigt Werkzeuge aus rkbin. Neben rkbin/ entpacken oder die Pfade von boot_merger und programmer_image_tool in tools/mk_pcie_idb.sh ändern. Die Compiler-Toolchain ist in src/platform/common/GCC/Cortex-A.mk festgelegt:

<!-- Source PDF p.12 -->

```text
#############################################################################
# Cross compiler
#############################################################################
ifneq ($(wildcard ${ROOT_PATH}/../prebuilts/gcc/linux-x86/aarch64/gcc-arm-10.2-2020.11-x86_64-aarch64-none-linux-gnu/bin),)
CROSS_COMPILE   ?= ${ROOT_PATH}/../prebuilts/gcc/linux-x86/aarch64/gcc-arm-10.2-2020.11-x86_64-aarch64-none-linux-bin/aarch64-none-linux-gnu-else ifeq ($(wildcard /opt/prebuilts/gcc/linux-x86/aarch64/arm-gnu-toolchain-11.3.rel1-x86_64-aarch64-none-linux-gnu/bin),)
CROSS_COMPILE   ?= /opt/prebuilts/gcc/linux-x86/aarch64/arm-gnu-toolchain-11.3.rel1-x86_64-aarch64-none-linux-gnu/bin/aarch64-none-linux-gnu-else
CROSS_COMPILE   ?= aarch64-none-linux-gnu-endif
```

Build-Befehl für RK3588:

```text
./tools/mk_pcie_idb.sh RK3588
```

RK3568:

```text
./tools/mk_pcie_idb.sh RK3588
```

Ausgabedatei: pcie_idb.img

##### 6.2.2.1 BSP-Konfiguration

RK3588-Beispielquellcode: src/platform/RK3588/bsp/platform.h

```text
#define BOOT_USING_UART_BAUD 1500000                      // 修改波特率，⽀持1500000或115200
```

##### 6.2.2.2 BAR-Standardkonfiguration

Quellcode: src/driver/pcie/pcie_ep.c. Die Demo-Vorgaben lassen sich außer BAR4 anpassen: BAR0: 32bits 4MB, Befehlsstrom; BAR2: 64bits 64MB, Datenstrom; BAR4: 32bits 1MB, EP-PCIe-Register, unveränderlich. BAR4-Offsets für direkten RC-Registerzugriff: 0: DMA; 0x2000: iATU;

<!-- Source PDF p.13 -->

0x20000: MSI-X-Tabelle

##### 6.2.2.3 BAR-Größenkonfiguration

PCIe_EP_Init() setzt BAR-Größen über die resize-BAR-Funktion des Controllers. Für BAR SIZE wählt (bar_id * 0x8) die BAR-ID, bit[13:8] legt die Größe als 2^n fest. Die Quelle nennt 1MB (2^0) bis 8EB (2^20). Es folgen die Einstellungen für BAR0–5:

```text
writel(0x2c0, resbar_base + 0x8 + 0 * 0x8);
writel(0x2c0, resbar_base + 0x8 + 1 * 0x8);
writel(0x6c0, resbar_base + 0x8 + 2 * 0x8);
writel(0x6c0, resbar_base + 0x8 + 3 * 0x8);
writel(0x0c0, resbar_base + 0x8 + 4 * 0x8); /* wired register */
writel(0x6c0, resbar_base + 0x8 + 5 * 0x8);
```

BAR-Attribute mit vordefinierten Makros konfigurieren: 32bit oder 64bit, mit oder ohne PREFETCH.

```text
    rockchip_pcie_ep_set_bar_flag(dbi_base, 0, PCI_BASE_ADDRESS_MEM_TYPE_32);
    rockchip_pcie_ep_set_bar_flag(dbi_base, 2, PCI_BASE_ADDRESS_MEM_PREFETCH |
PCI_BASE_ADDRESS_MEM_TYPE_64);
    rockchip_pcie_ep_set_bar_flag(dbi_base, 4, PCI_BASE_ADDRESS_MEM_TYPE_32);
```

Nicht verwendete BARs deaktivieren:

```text
//writel(0x0, dbi_base + 0x100000 + 0x10 + 0 * 4);
writel(0x0, dbi_base + 0x100000 + 0x10 + 1 * 4); /* BAR1 disabled */
//writel(0x0, dbi_base + 0x100000 + 0x10 + 2 * 4);
//writel(0x0, dbi_base + 0x100000 + 0x10 + 3 * 4);
//writel(0x0, dbi_base + 0x100000 + 0x10 + 4 * 4);
writel(0x0, dbi_base + 0x100000 + 0x10 + 5 * 4);  /* BAR5 disabled */
```

Die BAR-Größe in PCIe Bin ist eine gekoppelte Einstellung. BAR-Größen in PCIe Bin (zwei Speicher), SPL und Kernel gemeinsam ändern.

##### 6.2.2.4 BAR-Mappingkonfiguration

RK3588-Beispielquellcode: src/platform/RK3588/bsp/platform.h

```text
#define BOOT_USING_PCIE_EP_BAR0_CPU_ADDRESS 0x3C000000    // 调整Bar0映射地址
```

Implementierung im Code:

<!-- Source PDF p.14 -->

```text
HAL_PCIE_InboundConfig(pcie, 0, 0, BOOT_USING_PCIE_EP_BAR0_CPU_ADDRESS);
```

Das BAR-Mapping der PCIe.bin-Stufe ist unabhängig vom Kernel-Mapping; bei Bedarf können unterschiedliche Bereiche abgebildet werden.

##### 6.2.2.5 PHY-Moduskonfiguration

RK3588 kombiniert phy0/1 standardmäßig für Gen3x4. Die Quelle nennt eine Aufteilung in Gen3x2, Gen3x2, Gen3x1. Beispiel für RK3588 PCIe PHY 3x2:

```text
diff --git a/src/hal/lib/bsp/RK3588/hal_bsp.c b/src/hal/lib/bsp/RK3588/hal_bsp.c
index 4a6c2e6..f03995b 100644
--- a/src/hal/lib/bsp/RK3588/hal_bsp.c
+++ b/src/hal/lib/bsp/RK3588/hal_bsp.c
@@ -123,7 +123,7 @@ const struct HAL_UART_DEV g_uart9Dev =
 #ifdef HAL_PCIE_MODULE_ENABLED
 const struct HAL_PHY_SNPS_PCIE3_DEV g_phy_pcie3Dev =
 {
-    .phyMode = PHY_MODE_PCIE_AGGREGATION,
+    .phyMode = PHY_MODE_PCIE_NANBNB,
 };

 struct HAL_PCIE_DEV g_pcieDev =
```

Beispiel für RK3588 PCIe PHY 3x1:

```text
diff --git a/src/hal/lib/bsp/RK3588/hal_bsp.c b/src/hal/lib/bsp/RK3588/hal_bsp.c
index 4a6c2e6..f03995b 100644
--- a/src/hal/lib/bsp/RK3588/hal_bsp.c
+++ b/src/hal/lib/bsp/RK3588/hal_bsp.c
@@ -123,7 +123,7 @@ const struct HAL_UART_DEV g_uart9Dev =
 #ifdef HAL_PCIE_MODULE_ENABLED
 const struct HAL_PHY_SNPS_PCIE3_DEV g_phy_pcie3Dev =
 {
-    .phyMode = PHY_MODE_PCIE_AGGREGATION,
+    .phyMode = PHY_MODE_PCIE_NABIBI,
 };

 struct HAL_PCIE_DEV g_pcieDev =
```

<!-- Source PDF p.15 -->

#### 6.2.3 PCIe Bin verpacken und flashen

##### 6.2.3.1 Flashen mit Softwarewerkzeugen

1. pcie.bin in pcie_idb.img umwandeln.

```text
#⽣成 loader
./tools/boot_merger RKBOOT/RK3588MINIALL_PCIE_EP.ini
$git:(master) $ ls rk3588_pcie_loader_v1.00.bin
rk3588_pcie_loader_v1.00.bin

#spinand 制作 idb，要求使⽤ spinand type 做对⻬
./tools/programmer_image_tool -i rk3588_pcie_loader_v1.00.bin -b 128 -p 2 -t spinand -o ./
#emmc
./tools/programmer_image_tool -i rk3588_pcie_loader_v1.00.bin -t emmc -o ./

#制作双备份的 pcie_idb.img
cat idblock.img > pcie_idb.img
cat idblock.img >> pcie_idb.img
rm idblock.img
```

2. Für getrenntes Flashen eine pcie_idb-Partition hinzufügen: eMMC-Flash-Startadresse 0x40, SPI-Flash-Startadresse 0x100. In config.ini des Flashwerkzeugs CLOSE_CHECK_IDB=TRUE aktivieren. Das Board in Maskrom versetzen und die Flash-Schaltfläche betätigen.

3. Für ein vollständiges Paket pcie_idb zur Partitionstabelle hinzufügen. Das Beispiel gilt für eMMC; SPI NAND verwendet eine andere Adresse.

```text
CMDLINE:
mtdparts=rk29xxnand:0x00000400@0x00000040(pcie_idb),0x00000800@0x00002000(security),0x00002000@0x00004000(uboot),0x00010000@0x00006000(boot),0x00064000@0x00016000(rootfs),-@0x0007a000(userdata:grow)
```

package-file ändern: tools/linux/Linux_Pack_Firmware/rockdev/rk3588-package-file-nvr-emmc / spi-nand.

```text
package-file    package-file
bootloader      Image/MiniLoaderAll.bin
pcie_idb        Image/pcie_idb.img    #添加pcie_idb⽂件
parameter       Image/parameter.txt
uboot           Image/uboot.img
boot            Image/boot.img
rootfs          Image/rootfs.img
userdata        Image/userdata.img
```

build_emmc.sh ausführen, update.img erstellen und flashen.

<!-- Source PDF p.16 -->

##### 6.2.3.2 Flashen mit Programmiergerät

Siehe Flashen der EP-Karten-Firmware.

### 6.3 SPL-Stufenkonfiguration

#### 6.3.1 Kconfig-Konfiguration

Diese SPL-Funktion hat die drei folgenden Kconfig-Einträge. Für EP Boot alle drei wählen; ohne EP Boot genügt SPL_PCIE_EP_SUPPOR, entsprechend der Schreibweise der Quelle.

```text
CONFIG_SPL_PCIE_EP_SUPPORT=y
CONFIG_SPL_RAM_SUPPORT=y
CONFIG_SPL_RAM_DEVICE=y
```

#### 6.3.2 BAR-Standardkonfiguration

Demo-Vorgaben, außer BAR4 anpassbar: BAR0: 32bits 4MB, Befehlsstrom; BAR2: 64bits 64MB, Datenstrom; BAR4: 32bits 1MB, EP-PCIe-Register, unveränderlich. Direkt vom RC erreichbare BAR4-Offsets: 0: DMA; 0x2000: iATU; 0x20000: MSI-X-Tabelle.

#### 6.3.3 BAR-Größenkonfiguration

pcie_bar_init() setzt die Größe über resize BAR. Im Register offset+0x8 bestimmt bit[13:8] die Größe als 2^n; die Quelle nennt 1MB (2^0) bis 8EB (2^20):

```text
/* Resize BAR0 to support 4M 32bits */
resbar_base = dbi_base + 0x2e8;
writel(0xfffff0, resbar_base + 0x4);
writel(0x2c0, resbar_base + 0x8);
/* BAR2: 64M 64bits */
writel(0xfffff0, resbar_base + 0x14);
writel(0x6c0, resbar_base + 0x18);
/* BAR4: Fixed for EP wired register, 2M 32bits */
writel(0xfffff0, resbar_base + 0x24);
writel(0xc0, resbar_base + 0x28);
```

<!-- Source PDF p.17 -->

BAR-Attribute mit vordefinierten Makros setzen: 32bit/64bit und PREFETCH.

```text
        rockchip_pcie_ep_set_bar_flag(dbi_base, 0, PCI_BASE_ADDRESS_MEM_TYPE_32);
        rockchip_pcie_ep_set_bar_flag(dbi_base, 2, PCI_BASE_ADDRESS_MEM_PREFETCH |
PCI_BASE_ADDRESS_MEM_TYPE_64);
        rockchip_pcie_ep_set_bar_flag(dbi_base, 4, PCI_BASE_ADDRESS_MEM_TYPE_32);
```

Nicht verwendete BARs deaktivieren:

```text
/* Close bar1 bar3 bar5 */
writel(0x0, dbi_base + 0x100000 + 0x14);
//writel(0x0, dbi_base + 0x100000 + 0x18);
writel(0x0, dbi_base + 0x100000 + 0x1c);
//writel(0x0, dbi_base + 0x100000 + 0x20);
writel(0x0, dbi_base + 0x100000 + 0x24);
/* Close ROM BAR */
writel(0x0, dbi_base + 0x100000 + 0x30);
```

Die SPL-BAR-Größe ist mit den BAR-Größen in PCIe Bin (zwei Speicher), SPL und Kernel gekoppelt; gemeinsam ändern.

#### 6.3.4 BAR-Mappingkonfiguration

pcie_inbound_config() bildet jeden BAR auf einen internen Speicherbereich ab. RKEP_BAR0_ADDR und RKEP_BAR2_ADDR ändern die Zieladressen.

```text
/* BAR0: RKEP_BAR0_ADDR */
writel(RKEP_BAR0_ADDR, base + PCIE_ATU_CPU_ADDR_LOW);
writel(0, base + PCIE_ATU_CPU_ADDR_HIGH);
writel(0, base + PCIE_ATU_UNR_REGION_CTRL1);
/* PCIE_ATU_UNR_REGION_CTRL2 */
writel(PCIE_ATU_ENABLE | PCIE_ATU_BAR_MODE_ENABLE | (0 << 8),
       base + PCIE_ATU_UNR_REGION_CTRL2);
```

SPL-BAR-Mapping ist vom Kernel-Mapping unabhängig; unterschiedliche Bereiche sind möglich.

#### 6.3.5 PHY-Moduskonfiguration

Die Demo verwendet Controller 0xfe150000 im PCIe3x4-Modus, somit auch vier PHY-Lanes. Die PHY kann aufgeteilt werden; für andere Modi pcie_cru_init() ändern. Für 2lane+2lane PHY_MODE_PCIE_AGGREGATION durch PHY_MODE_PCIE_NANBNB oder einen anderen passenden Wert ersetzen:

<!-- Source PDF p.18 -->

Beispiel RK3588 PCIe PHY 3x2:

```text
diff --git a/arch/arm/mach-rockchip/spl_pcie_ep_boot.c b/arch/arm/mach-rockchip/spl_pcie_ep_boot.c
index 8b054d91558..54f9d22cde2 100644
--- a/arch/arm/mach-rockchip/spl_pcie_ep_boot.c
+++ b/arch/arm/mach-rockchip/spl_pcie_ep_boot.c
@@ -384,7 +384,7 @@ static void pcie_board_init(void)
 #define PHY_MODE_PCIE_NABINB   2       /* P1:PCIe3x1*2 + P0:PCIe3x2 */
 #define PHY_MODE_PCIE_NABIBI   3       /* P1:PCIe3x1*2 + P0:PCIe3x1*2 */

-#define PHY_MODE_PCIE                  PHY_MODE_PCIE_AGGREGATION
+#define PHY_MODE_PCIE                  PHY_MODE_PCIE_NANBNB

 #define CRU_BASE_ADDR                  0xfd7c0000
 #define CRU_SOFTRST_CON32              (CRU_BASE_ADDR + 0x0a80)
```

Beispiel RK3588 PCIe PHY 3x1:

```text
diff --git a/arch/arm/mach-rockchip/spl_pcie_ep_boot.c b/arch/arm/mach-rockchip/spl_pcie_ep_boot.c
index 8b054d91558..54f9d22cde2 100644
--- a/arch/arm/mach-rockchip/spl_pcie_ep_boot.c
+++ b/arch/arm/mach-rockchip/spl_pcie_ep_boot.c
@@ -384,7 +384,7 @@ static void pcie_board_init(void)
 #define PHY_MODE_PCIE_NABINB   2       /* P1:PCIe3x1*2 + P0:PCIe3x2 */
 #define PHY_MODE_PCIE_NABIBI   3       /* P1:PCIe3x1*2 + P0:PCIe3x1*2 */

-#define PHY_MODE_PCIE                  PHY_MODE_PCIE_AGGREGATION
+#define PHY_MODE_PCIE                  PHY_MODE_PCIE_NABIBI

 #define CRU_BASE_ADDR                  0xfd7c0000
 #define CRU_SOFTRST_CON32              (CRU_BASE_ADDR + 0x0a80)
```

#### 6.3.6 EP-Boot-Konfiguration

EP wartet auf Firmware und führt sie aus. Dazu müssen Downloadprotokoll mit RC und Firmwarepositionen zwischen BootLoader-Stufen übereinstimmen. pcie_wait_for_fw() lädt, pcie_update_atags() legt spätere Positionen fest. Die folgenden Adressen nur ändern, wenn RC/EP-Befehle und Adressen sowie Positionen zwischen Stufen konsistent bleiben. Ohne Verständnis des Gesamtablaufs nicht ändern. RC lädt zunächst an die vorgegebenen Positionen und sendet dann den Startbefehl.

1. Vereinbarte Downloadpositionen für zwei Firmwareabbilder:

<!-- Source PDF p.19 -->

| Firmware | Format | Inhalt | Downloadadresse |
| --- | --- | --- | --- |
| uboot.img | FIT | ATF und U-Boot | BAR2+0 |
| boot.img | FIT | Kernel, DTB, ramdisk | BAR2+0x400000 |

2. Befehl zur Firmwareausführung:

| Befehl | Position | Wert | Aktion |
| --- | --- | --- | --- |
| CMD_LOADER_RUN | BAR0 + 0x400 | 0x524b4501 | Geladene Firmware starten |

Von den zwei vom RC geladenen Abbildern analysiert und startet SPL (EP-Boot-Umgebung) uboot.img direkt. Ein RK-spezifischer RAM_PARTITION übergibt die boot.img-Position an U-Boot. pcie_update_atags() legt RAM-Anfang und SIZE der boot-Partition fest. BAR2 hat standardmäßig 64M: erste 4M für uboot.img, übrige 60M für boot.img, damit die RC-CPU direkt über BAR2 schreiben kann. Reicht dies nicht, kann RC die EP-DMA ohne BAR2-Größenlimit nutzen; size in RAM_PARTITION entsprechend aktualisieren.

#### 6.3.7 SRNS-Konfiguration

Für SRNS-Referenztakt-Designs das folgende Makro aktivieren. EP nutzt dann intern 100MHz und ist nicht auf einen externen Takt angewiesen.

```text
/* SRNS: Use Seperate refclk(internal clock) instead of from RC */
// #define PCIE_ENABLE_SRNS_PLL_REFCLK
```

SPL-SRNS-Einstellungen sind gekoppelt: PCIe Bin SRNS (zwei Speicher), SPL SRNS-size (Quellwortlaut) und Kernel SRNS gemeinsam ändern.

### 6.4 Kernel-Stufenkonfiguration

#### 6.4.1 BAR-Größenkonfiguration

rockchip_pcie_resize_bar setzt BAR-Größen über resize BAR. Im Register offset+0x8 bestimmt bit[13:8] die Größe als 2^n; die Quelle nennt 1MB (2^0) bis 8EB (2^20). Vordefinierte Makros für 32bit/64bit und PREFETCH verwenden:

```text
/* Resize BAR0 4M 32bits, BAR2 64M 64bits-pref, BAR4 1MB 32bits */
bar = BAR_0;
dw_pcie_writel_dbi(pci, resbar_base + 0x4 + bar * 0x8, 0xfffff0);
dw_pcie_writel_dbi(pci, resbar_base + 0x8 + bar * 0x8, 0x2c0);
rockchip_pcie_ep_set_bar_flag(rockchip, bar, PCI_BASE_ADDRESS_MEM_TYPE_32);

bar = BAR_2;
dw_pcie_writel_dbi(pci, resbar_base + 0x4 + bar * 0x8, 0xfffff0);
dw_pcie_writel_dbi(pci, resbar_base + 0x8 + bar * 0x8, 0x6c0);
rockchip_pcie_ep_set_bar_flag(rockchip, bar,PCI_BASE_ADDRESS_MEM_PREFETCH |
PCI_BASE_ADDRESS_MEM_TYPE_64);

bar = BAR_4;
dw_pcie_writel_dbi(pci, resbar_base + 0x4 + bar * 0x8, 0xfffff0);
dw_pcie_writel_dbi(pci, resbar_base + 0x8 + bar * 0x8, 0xc0);
rockchip_pcie_ep_set_bar_flag(rockchip, bar, PCI_BASE_ADDRESS_MEM_TYPE_32);
```

Nicht verwendete BARs deaktivieren:

```text
/* Disable BAR1 BAR5*/
bar = BAR_1;
dw_pcie_writel_dbi(pci, PCIE_TYPE0_HDR_DBI2_OFFSET + 0x10 + bar * 4, 0);
bar = BAR_5;
dw_pcie_writel_dbi(pci, PCIE_TYPE0_HDR_DBI2_OFFSET + 0x10 + bar * 4, 0);
```

Die Kernel-BAR-Größe ist gekoppelt: PCIe Bin (zwei Speicher), SPL und Kernel gemeinsam ändern. Kernel-BAR-Mapping ist unabhängig von SPL und darf andere Bereiche abbilden.

#### 6.4.2 BAR-Mappingkonfiguration

Jeder BAR wird auf einen internen Speicherbereich abgebildet; Zieladressen lassen sich über DTS ändern.

```text
reserved-memory {
       #address-cells = <2>;
       #size-cells = <2>;
       ranges;
       bar0_region: bar0-region@3c000000 {
                reg = <0x0 0x3c000000 0x0 0x00400000>;
       };
       bar2_region: bar2-region@40000000 {
                reg = <0x0 0x40000000 0x0 0x04000000>;
       };
};
```

Zusätzliche bar1/bar5-Speicherabbildungen werden unterstützt und aktivieren bar1/5 automatisch. Bei PCIe-Initialisierung durch PCIe Bin/SPL den Deaktivierungscode für bar1/5 gemäß BAR-Größenkonfiguration auskommentieren.

<!-- Source PDF p.21 -->

#### 6.4.3 SRNS-Konfiguration

SRNS wird als Patch geliefert: 0001-TEST-kernel5.10-rk3588-SRNS.patch aus dem Entwicklungspaket beziehen. Kernel SRNS ist mit PCIe Bin SRNS (zwei Speicher) und SPL SRNS-size (Quellwortlaut) gekoppelt; gemeinsam ändern.

### 6.5 EP-Karten-Firmware bauen

Passende Patches nach Beschreibung im patch-Verzeichnis anwenden und das Szenario wählen. Flash Boot mit PCIe Bin, ein Speicher: pcie_idb ergänzen und pcie_idb.img aktualisieren; normal_idb ergänzen und normal_idb.img automatisch über MiniLoaderAll.bin aktualisieren; übrige Partitionsabbilder und update.img normal bauen. Zwei Speicher: RK-PCIe-EP-Kapitel in Rockchip_Developer_Guide_Dual_Storage_CN.pdf beachten. Das SDK verpackt dies standardmäßig nicht in update.img. tools/dual_storage verwenden, Abbilder gemäß tools/dual_storage/README.txt kopieren und build.sh ausführen. Flash Boot mit PCIe Bin und EP Boot für allgemeine PCs: pcie_idb/pcie_idb.img und normal_idb/normal_idb.img ergänzen (letzteres automatisch über MiniLoaderAll.bin); übrige Firmware liefert der Host. Bei RK RC kann PCIe Bin entfallen: SPL implementiert EP Boot, EP-Speicher enthält nur Miniloader, der Host liefert den Rest. Common Boot: Partitionsabbilder und update.img normal ohne Sonderkonfiguration bauen.

<!-- Source PDF p.22 -->

### 6.6 EP-Karten-Firmware flashen

Ein Speicher: Flashen erfolgt wie bei normaler Firmware; dem Flash-Kapitel der Chip-Release-Dokumentation folgen. Zwei Speicher: siehe „RK PCIe EP dual-storage firmware packaging“ in Rockchip_Developer_Guide_Dual_Storage_CN.pdf.

### 6.7 EP-Karten-OTA

Bei Partitionsupdates erzeugt der Kernel Gerätenodes anhand der Partitionstabelle; Userspace schreibt die Nodes unter /dev/. RK-OTA über recovery oder eine eigene Lösung zum Schreiben dieser Gerätenodes ist möglich.

1. OTA für Flash Boot mit PCIe Bin. Ein Speicher: normale OTA nach docs\Linux\Recovery\Rockchip_Developer_Guide_Linux_Recovery_CN.pdf. Zwei Speicher: „RK PCIe EP dual-storage OTA upgrade“ in Rockchip_Developer_Guide_Dual_Storage_CN.pdf.

2. OTA für Flash Boot mit PCIe Bin und EP Boot. EP Boot besitzt nur eine loader-Partition, die zur Partitionstabelle hinzuzufügen ist. NOR: EP-Karten-OTA &gt; zwei Speicher &gt; NOR-Uboot-Partitionskonfiguration beachten. EMMC: EMMC-Abschnitt für zwei Speicher beachten und loader direkt ergänzen. RK OTA kann loader nicht einzeln aktualisieren; eine eigene Umsetzung ist erforderlich. Wegen des hohen Risikos wird ein loader-Update nicht empfohlen. MiniLoaderAll.bin und parameter.txt dürfen nicht direkt in /dev/-Nodes geschrieben werden; vorher in Binärdateien umwandeln.

## 7 Fehlerbehebung

### 7.1 EP-Karten-Startfehler untersuchen

Ausgabe der EP-Karte in SPL:

<!-- Source PDF p.23 -->

```text
U-Boot SPL board init
RKEP: Init PCIe EP
RKEP: 175301 - PHY Mode 0x4
RKEP: 176542 - RefClock in common clock_mode
RKEP: 187578 - BAR0: 0x3c000000
RKEP: 187848 - BAR2: 0x010000000
RKEP: 188227 - init PCIe fast Link up
RKEP: 208576 - Link up 230011
RKEP: 243683 - Done
```

Stoppt die Ausführung bei „RKEP: Init PCIe EP“, ist meist die Enumeration fehlgeschlagen. EP-Referenztakt, 12V-Versorgung und Freigabe von PERST# prüfen. Es folgt die Kernel-Ausgabe.

```text
[root@RK3588:/]# dmesg | grep pci
[    3.371073] rk-pcie-ep fe150000.pcie: bar0: assigned [0x3c000000-3c3fffff]
[    3.371890] rk-pcie-ep fe150000.pcie: bar2: assigned [0x40000000-43ffffff]
[    3.371901] rk-pcie-ep fe150000.pcie: no vpcie3v3 regulator found
[    3.371918] rk-pcie-ep fe150000.pcie: already linkup
[    3.372001] rk-pcie-ep fe150000.pcie: register misc device pcie_ep
[    3.725930] ehci-pci: EHCI PCI platform driver
[    3.869983] pcie30_avdd1v8: supplied by avcc_1v8_s0
[    3.870541] pcie30_avdd0v75: supplied by avdd_0v75_s0
```

Ausgabe des EP-Gerätetreiber-Kernelmoduls:

```text
rk3588_s:/ # dmesg | grep rkep
[    2.278964] pcie-rkep 0000:01:00.0: success to request msi irq
    # 成功申请MSI 中断 log
[    2.280601] pcie-rkep 0000:01:00.0: successfully allocate continuouse buffer for
userspace   # 成功预留⽤⼾内存，默认不开
[    2.280619] pcie-rkep 0000:01:00.0: vid=1d87
    # 正常访问EP卡config空间
[    2.280625] pcie-rkep 0000:01:00.0: did=356a
[    2.280629] pcie-rkep 0000:01:00.0: obj_info magic=524b4550, ver=100
    # 正常访问EP卡bar空间
```

### 7.2 Fehlerbehandlung

Systeminstabilität und äußere Störungen können Fehler verursachen. PCIe bietet Störschutz, CRC in Protokollschichten und Wiederholung bei Fehlern; die Quelle beschreibt dies als Sicherstellung korrekter Controllerausgaben. Fehler, die der PCIe-Controller nicht beheben kann, erfordern zusätzliche Maßnahmen zum Weiterbetrieb.

<!-- Source PDF p.24 -->

#### 7.2.1 EP-Zustandsinformationen

Ein kleines EP-Programm sollte den Gerätezustand darstellen und per Tick aktualisieren. RC liest ihn zur Funktionsprüfung. Die Demo reserviert BAR0-Speicher für Zustandsaktualisierung und Abfrage.

#### 7.2.2 Watchdog

RK3588 besitzt einen Watchdog für automatischen Reset bei Systemfehlern. Er kann vom Zustandsprogramm bedient werden, sodass dessen Stillstand einen Reset auslöst. Die Quelle nennt eine EP-PCIe-Störung und ein durch andere Module hängendes System; diese Diagnoseformulierung bleibt zu prüfen. RC-Software erkennt den selbst ausgelösten EP-Reset nicht. Die PCIe-Physik verbindet sich wieder, EP muss jedoch RC-konfigurierte Register wie BAR-Adressen wiederherstellen.

#### 7.2.3 Hot Reset

Im Text des Abschnitts Hot Reset wird das Signal Host Reset genannt. Es ist durch PCIe definiert und wird über normale Datenleitungen übertragen. EP erkennt es und löst einen Interrupt aus. Die Hardware setzt bei HotReset BAR-Register automatisch zurück; deshalb muss der Interrupt-Handler EP erneut initialisieren und BAR sowie ATU wiederherstellen.

#### 7.2.4 Warm Reset (PERST)

PERST setzt PCIe unabhängig zurück. Beim x86-Neustart wurde PERST ohne Unterbrechung der Slotversorgung beobachtet. EP muss deshalb vollständig zurückgesetzt werden. RK empfiehlt direkten Anschluss an NPOR von RK3588 und PMIC für ein dem Einschalten entsprechendes Resetverhalten. Bei kontrollierbarem RC und geringeren Anforderungen kann PERST als Interrupt-GPIO dienen, dessen Handler einen RK3588-global-reset auslöst.

#### 7.2.5 Cold Reset (Power On Reset)

Power-on-Reset entspricht dem Gerätestart.

#### 7.2.6 Reset und Suspend/Resume bei unabhängig versorgter RK-Chipverbindung

Anforderungen: RC benötigt WAKE#-GPIO im PMU-IO-Bereich mit von PCIe unabhängiger GPIO-Aufweckfunktion. rockchip,wait-for-link-ms entsprechend der tatsächlichen EP-Startzeit erhöhen; siehe Rockchip_Developer_Guide_PCIe_CN.pdf. EP muss WAKE# und PERST# gemäß den Sondereinstellungen für unabhängige Versorgung unter Kernel-Konfiguration implementieren.

<!-- Source PDF p.25 -->

EP-Resetsteuersignal für Hardwarewiederherstellung herausführen und Watchdog für Softwarewiederherstellung aktivieren. Wegen angepasster Hardware-/Softwareabläufe benötigt dieses Referenzdesign eigene Stresstests; an Projekterfahrung und Anforderungen anpassen. RC-Reset bei versorgtem EP: RC-Userspace benachrichtigt EP, deinitialisiert Dienste (siehe Softwarebenachrichtigung), setzt RC zurück und initialisiert Dienste neu. EP-Reset bei versorgtem RC: RC benachrichtigt EP, Dienste werden deinitialisiert, EP wird zurückgesetzt und neu initialisiert, einschließlich PCIe rescan auf RC. RC-Suspend bei versorgtem EP: EP benachrichtigen, Dienste deinitialisieren, RC suspend/resume, neu initialisieren einschließlich rescan. EP-Suspend bei versorgtem RC: EP benachrichtigt RC, Dienste deinitialisieren, EP suspend/resume, neu initialisieren einschließlich RC-rescan. Für beide eine Reihenfolge nutzen, etwa RC suspend → EP suspend → EP resume → RC resume. EP fordert RC zum Suspend auf und weckt ihn per WAKE#.

{% endraw %}
