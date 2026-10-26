---
title: "Rockchip U-Boot Nextdev: Boot, Treiber, SPL/TPL, FIT und Sicherheitsprüfung"
description: "Rockchip U-Boot Nextdev: Boot, Treiber, SPL/TPL, FIT und Sicherheitsprüfung — V2.37.0."
translation_key: "157-rockchip-uboot-nextdev"
slug: "157-rockchip-uboot-nextdev"
lang: "de"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, U-Boot, SPL, FIT]
excerpt: "Rockchip U-Boot Nextdev: Boot, Treiber, SPL/TPL, FIT und Sicherheitsprüfung — V2.37.0."
---

{% raw %}

Vollständige technische Grundlage der chinesischen V2.37.0 (314 Seiten), mit englischer V2.37.0 (329 Seiten) abgeglichen. ArmSoM-Plattformreferenz: konkreten SoC, Boardversorgung/Pins, SDK/BSP, U-Boot Nextdev, DDR/Loader, ATF/OP-TEE und Kernel abgleichen. Keine Zusage für alle Boards. Keine ArmSoM-Hardwarevalidierung; Ergebnisse, Ausgaben und Abläufe stammen aus der Vorlage. Chinesische Fassung mit chinesischen Bildern, Englisch/Russisch/Deutsch mit englischen Bildern.

> Programmieren, Löschen, OTP/eFuse, Schlüssel und Sperren können unumkehrbar sein. Frequenzen/Spannungen müssen die Grenzwerte des konkreten Chips/Boards einhalten. Nur dedizierte Testgeräte mit Sicherung und geprüftem Wiederherstellungsweg verwenden. Keine Hardware- oder Sicherheitskonfigurationsbefehle wurden hier ausgeführt.

> Unklarheiten der Vorlage bleiben prüfbar erhalten: CONFIG_ENV_IS_NOWHERE_XXX; doppeltes regulator-min-microvolt; rk3588-Dateinamen bei RK3566/RK3568 in Tabelle 14.1; rk3568-dfu.config bei RK3588 in Tabelle 14.4. Manche Beispiele enthalten vollbreite Semikolons, typografische Anführungszeichen und Platzhalter. Sie sind nicht automatisch ausführbarer Code; mit dem konkreten SDK-Quelltext abgleichen. Siehe Prüfprotokoll im Repository.

[ArmSoM Docs](https://docs.armsom.org/) · [U-Boot](https://docs.u-boot.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

| Chip | Miniloader + RKIMG u-boot | SPL + FIT u-boot |
| --- | --- | --- |
| RV1108 | Y |  |
| RK3036 | Y |  |
| RK3126C | Y |  |
| RK3128 | Y |  |
| RK3229 | Y |  |
| RK3288 | Y |  |
| RK3308 | Y |  |
| RK3326/PX30 | Y |  |
| RK3328 | Y |  |
| RK3368/PX5 | Y |  |
| RK3399 | Y |  |
| RK1808 | Y |  |
| RV1126/RV1109 |  | Y |
| RK3566/RK3568 |  | Y |
| RK3588 |  | Y |
| RV1106/RV1103 |  | Y |
| RK3528 |  | Y |
| RK3562 |  | Y |
| RK3576 |  | Y |
| RV1106B/RV1103B |  | Y |
| RK3506 |  | Y |
| RV1126B |  | Y |

## 1 Grundlagen

### 1.1 Feature

v2017(next-dev) ist der von RK aus dem offiziellen U-Boot v2017.09 entwickelte Zweig und unterstützt die wesentlichen verkauften RK-Chips. Funktionen: Booten von RK Android, Android AOSP und Linux Distro; Rockchip-miniloader- und SPL/TPL-Vorlader; LVDS-, EDP-, MIPI-, HDMI-, CVBS- und RGB-Anzeigen; Booten von eMMC, NAND Flash, SPI NAND, SPI NOR, SD und USB; FAT-, EXT2- und EXT4-Dateisysteme; GPT- und RK-parameter-Partitionstabellen; Bootlogo, Ladeanimation, Niedrigladezustands- und Energieverwaltung; I2C, PMIC, CHARGE, FUEL GUAGE, USB, GPIO, PWM, GMAC, eMMC, NAND, Interrupts; Vendor storage für Nutzerdaten/-konfiguration; eMMC-Programmierung über RockUSB- und Google-Fastboot-USB-Gadgets; USB Mass storage, Ethernet, HID; dynamische Kernel-DTB-Auswahl nach Hardwarezustand.

### 1.2 Version

RK hat zwei U-Boot-Versionen: v2014 (intern rkdevelop) und v2017 (next-dev). v2017 lässt sich auf zwei Arten erkennen. Methode1: VERSION im Makefile des Wurzelverzeichnisses muss2017 sein.

```text
#
## Chapter-1 SPDX-License-Identifier:      GPL-2.0+
#

VERSION = 2017
PATCHLEVEL = 09
SUBLEVEL =
EXTRAVERSION =
NAME =
......
```

Methode2: Die erste reguläre Bootausgabe muss U-Boot 2017.09 enthalten.

```text
U-Boot 2017.09-01818-g11818ff-dirty (Nov 14 2019 - 11:11:47 +0800)
......
```

v2017 ist quelloffen und wird regelmäßig auf GitHub aktualisiert: https://github.com/rockchip-linux/u-boot. Erforderlich ist ein RK-Kernel &gt;=4.4.

### 1.3 DM

DM (Driver Model) ist das Standard-Geräte-/Treibermodell von U-Boot und ähnelt stark dem Linux-Kernel-Modell. Auch v2017-Module folgen DM. Zunächst Architektur und Implementierung im DM-README lesen:

```text
./doc/driver-model/README.txt
Terminology
-----------

Uclass - a group of devices which operate in the same way. A uclass provides
         a way of accessing individual devices within the group, but always
         using the same interface. For example a GPIO uclass provides
         operations for get/set value. An I2C uclass may have 10 I2C ports,
         4 with one driver, and 6 with another.

Driver - some code which talks to a peripheral and presents a higher-level
         interface to it.

Device - an instance of a driver, tied to a particular port or peripheral.
```

Kurz: uclass — Geräte-/Treiberklassenmodell; driver — Treiber; device — Gerät. Kerncode:

```text
./drivers/core/
```

### 1.4 Security

U-Boot gehört in ARM TrustZone zur Non-Secure World und kann sicheren Speicher, OTP, efuse und andere sichere Ressourcen nicht direkt ansprechen; trust vermittelt. CPU-Modus von U-Boot auf RK:

```text
32位平台： Non-Secure PL1
64位平台： EL2(Always be Non-Secure)
```

### 1.5 Boot-order

RK verwendet zwei Bootschemata, abhängig davon, ob der vorherige Loader quelloffen ist:

```text
// 前级loader闭源
BOOTROM => ddr bin => Miniloader => TRUST => U-BOOT => KERNEL
// 前级loader开源
BOOTROM => TPL => SPL => TRUST => U-BOOT => KERNEL
```

TPL entspricht ddr bin, SPL miniloader. TPL+SPL implementiert die Funktionen der proprietären RK-Komponenten ddr.bin+miniloader und ist damit austauschbar.

### 1.6 Driver-probe

Trotz Geräte-/Treibermodell startet U-Boot bei der Initialisierung nicht wie der Kernel automatisch probe registrierter Geräte/Treiber. Der Nutzer muss probe über folgende Schnittstellen ausdrücklich auslösen:

```text
int uclass_get_device(enum uclass_id id, int index, struct udevice **devp);
int uclass_get_device_by_name(enum uclass_id id, const char *name,
                              struct udevice **devp);
int uclass_get_device_by_seq(enum uclass_id id, int seq, struct udevice **devp);
int uclass_get_device_by_of_offset(enum uclass_id id, int node, struct udevice **devp);
int uclass_get_device_by_ofnode(enum uclass_id id, ofnode node, struct udevice **devp);
int uclass_get_device_by_phandle_id(enum uclass_id id,
                                    int phandle_id, struct udevice **devp);
int uclass_get_device_by_phandle(enum uclass_id id,
                                 struct udevice *parent, struct udevice **devp);
int uclass_get_device_by_driver(enum uclass_id id,
                                const struct driver *drv, struct udevice **devp);
int uclass_get_device_tail(struct udevice *dev, int ret, struct udevice **devp);
......
```

Zentraler interner Aufruf dieser Schnittstellen:

```text
int device_probe(struct udevice *dev);  // 建议⽤⼾⼀定要了解内部实现！
```

### 1.7 Shell

Die U-Boot-Shell heißt CLI (Quelle: cmdline line interface). Nutzer können eigene CMDs definieren. Neben Shell-Aufrufen sind programmatische Aufrufe über run_command() und run_command_list() möglich.

```text
int run_command(const char *cmd, int flag)
int run_command_list(const char *cmd, int len, int flag)
```

### 1.8 Boot-Command

U-Boot startet den Kernel über CONFIG_BOOTCOMMAND. Vor CONFIG_BOOTCMD wird zusätzlich CONFIG_PREBOOT ausgeführt, normalerweise leer. Die unterschiedlichen Quellschreibweisen BOOTCOMMAND/BOOTCMD bleiben erhalten.

### 1.9 TPL/SPL/U-Boot-proper

Unterschiedliche Buildbedingungen erzeugen aus demselben Code TPL, SPL und U-Boot proper. TPL (Tiny Program Loader) und SPL (Secondary Program Loader) liegen vor U-Boot: TPL läuft im SRAM und initialisiert DDR; SPL läuft im DDR, initialisiert Low-Level-Funktionen und lädt trust.img/uboot.img; U-Boot proper läuft im DDR und startet den Kernel.

U-Boot proper unterscheidet hauptsächlich von SPL; im Folgenden kurz U-Boot. Ablauf:

```text
BOOTROM => TPL(ddr bin) => SPL(miniloader) => TRUST => U-BOOT => KERNEL
```

Weitere Informationen: doc/README.TPL und doc/README.SPL.

### 1.10 Build-Output

Nach erfolgreichem Build entstehen wichtige Dateien im Wurzelverzeichnis. TPL-/SPL-Dateien werden nur bei entsprechender Buildunterstützung erzeugt:

```text
// U-Boot阶段
./u-boot.map            // MAP表⽂件
./u-boot.sym            // SYMBOL表⽂件
./u-boot                // ELF⽂件，类同内核的vmlinux（重要！）
./u-boot.dtb            // u-boot⾃⼰的dtb⽂件
./u-boot.bin            // 可执⾏⼆进制⽂件，会被打包成uboot.img⽤于烧写

// SPL阶段
./spl/u-boot-spl.map    // MAP表⽂件
./spl/u-boot-spl.sym    // SYMBOL表⽂件
./spl/u-boot-spl        // ELF⽂件，类同内核的vmlinux（重要！）
./spl/u-boot-spl.dtb    // spl⾃⼰的dtb⽂件
./spl/u-boot-spl.bin    // 可执⾏⼆进制⽂件，会被打包成loader⽤于烧写

// TPL阶段
./tpl/u-boot-tpl.map    // MAP表⽂件
./tpl/u-boot-tpl.sym    // SYMBOL表⽂件
./tpl/u-boot-tpl        // ELF⽂件，类同内核的vmlinux（重要！）
./tpl/u-boot-tpl.dtb    // tpl⾃⼰的dtb⽂件
./tpl/u-boot-tpl.bin    // 可执⾏⼆进制⽂件，会被打包成loader⽤于烧写
```

### 1.11 Environment-Variables

ENV (Environment-Variables) verwaltet/überträgt globale Daten als Schlüssel-Daten-Paare einer Hashtabelle. Typische Parameter sind Ladeadressen, Netzwerk (ipaddr, serverip), bootcmd und bootargs. printenv gibt sie in der Konsole aus. Nutzer entscheiden über Speicherung auf dem Datenträger. ENV gilt nur für U-Boot, wird nicht direkt an den Kernel übergeben oder von ihm interpretiert. Userspace greift über fw_printenv zu. RK-Speicheradresse und -größe in Bytes:

```text
if ARCH_ROCKCHIP
config ENV_OFFSET
        hex
        depends on !ENV_IS_IN_UBI
        depends on !ENV_IS_NOWHERE
        default 0x3f8000
        help
          Offset from the start of the device (or partition)

config ENV_SIZE
        hex
        default 0x8000
        help
          Size of the environment storage area
endif
```

### 1.12 U-Boot DTS

U-Boot hat eine eigene DTS-Datei. Beim Build entsteht die DTB, angehängt an u-boot.bin. Verzeichnis:

```text
arch/arm/dts/
```

CONFIG_DEFAULT_DEVICE_TREE in defconfig wählt die Plattform-DTS.

### 1.13 Relocation

Der vorherige Bootloader lädt U-Boot gewöhnlich in niedrige DRAM-Adressen. Nach board_f.c verlagert U-Boot sich in einen reservierten Bereich am Speicherende (Relocation; Adresse abhängig vom Speicherlayout) und führt anschließend board_r.c aus. Erkennbar an der Bootausgabe:

```text
U-Boot 2017.09-gabfd1c5e3d-210202-dirty #cjh (Mar 08 2021 - 16:57:31 +0800)

Model: Rockchip RK3568 Evaluation Board
PreSerial: 2, raw, 0xfe660000
DRAM:  2 GiB
Sysmem: init
// relocate到ddr⾸地址偏移0x7d304000的地址。如果为0，则没有做relocation。
Relocation Offset: 7d304000, fdt: 7b9f8ed8
Using default environment
......
```

## 2 RK-Architektur

Dieses Kapitel beschreibt wichtige Grundlagen und Funktionen der RK-Plattformen.

### 2.1 Vorwort

Im gesamten Dokument bedeutet CONFIG_ aktivieren/deaktivieren die Nutzung von make menuconfig, außer speziellen direkt in .h definierten Optionen. CONFIG_ nicht direkt in defconfig ändern: Kconfig-Abhängigkeiten können die Wirksamkeit von .config verhindern. defconfig mit make savedefconfig aktualisieren.

### 2.2 Plattformdateien

Plattformverzeichnisse:

```text
./arch/arm/include/asm/arch-rockchip/
./arch/arm/mach-rockchip/
./board/rockchip/
./include/configs/
```

defconfig-Verzeichnis:

```text
./configs/
```

Zentrale gemeinsame Boarddatei:

```text
./arch/arm/mach-rockchip/board.c
```

### 2.3 Plattformkonfiguration

Konfigurationsdateien: Plattformoptionen und Parameter liegen üblicherweise hier:

```text
// 各平台公共⽂件（开发者通常不需要修改）
./arch/arm/mach-rockchip/Kconfig
./include/configs/rockchip-common.h

// 各平台独有，以RK3399为例
./include/configs/rk3399_common.h
./include/configs/evb_rk3399.h
./configs/rk3399_defconfig
```

Wichtige Definitionen in rockchip-common.h, rkxxx_common.h, evb_rkxxx.h: RKIMG_DET_BOOTDEV — sequenzielle Erkennung des aktuellen Speichertyps; RKIMG_BOOTCOMMAND — Kernel-Bootbefehl; ENV_MEM_LAYOUT_SETTINGS — ramdisk-/fdt-/kernel-Ladeadressen; PARTS_DEFAULT — Standard-GPT, in bestimmten Fällen ohne gültige GPT verwendet; ROCKCHIP_DEVICE_SETTINGS — Peripheriebefehle, hauptsächlich stdio (meist inklusive Displaystart); BOOTENV — Bootgeräteerkennung für Linux Distro; CONFIG_SYS_MALLOC_LEN — malloc-Poolgröße; CONFIG_SYS_TEXT_BASE — U-Boot-Startadresse; CONFIG_BOOTCOMMAND — Bootbefehl, meist RKIMG_BOOTCOMMAND; CONFIG_PREBOOT — Befehl vor CONFIG_BOOTCOMMAND; CONFIG_SYS_MMC_ENV_DEV — MMC-Gerätenummer für ENV, meist0. RK3399-Beispiel, ./include/configs/rockchip-common.h:

```text
......
#define RKIMG_DET_BOOTDEV \                           // 动态探测当前的存储类型
    "rkimg_bootdev=" \
    "if mmc dev 1 && rkimgtest mmc 1; then " \
        "setenv devtype mmc; setenv devnum 1; echo Boot from SDcard;" \
    "elif mmc dev 0; then " \
        "setenv devtype mmc; setenv devnum 0;" \
    "elif rknand dev 0; then " \
        "setenv devtype rknand; setenv devnum 0;" \
        "elif rksfc dev 0; then " \
                "setenv devtype rksfc; setenv devnum 0;" \
    "fi; \0"

#define RKIMG_BOOTCOMMAND \
    "boot_android ${devtype} ${devnum};" \           // 启动android格式固件
    "bootrkp;" \                                     // 启动RK格式固件
    "run distro_bootcmd;"                            // 启动linux固件
......
```

./include/configs/rk3399_common.h:

```text
......
#ifndef CONFIG_SPL_BUILD
#define ENV_MEM_LAYOUT_SETTINGS \        // 固件的加载地址
    "scriptaddr=0x00500000\0" \
    "pxefile_addr_r=0x00600000\0" \
    "fdt_addr_r=0x01f00000\0" \
    "kernel_addr_r=0x02080000\0" \
    "ramdisk_addr_r=0x0a200000\0"

#include <config_distro_bootcmd.h>
#define CONFIG_EXTRA_ENV_SETTINGS \
    ENV_MEM_LAYOUT_SETTINGS \
    "partitions=" PARTS_DEFAULT \        // 默认的GPT分区表
    ROCKCHIP_DEVICE_SETTINGS \
    RKIMG_DET_BOOTDEV \
    BOOTENV                              // 启动linux时的启动设备探测命令
#endif

#define CONFIG_PREBOOT                   // 在CONFIG_BOOTCOMMAND之前被执⾏的预启动命令
......
```

./include/configs/evb_rk3399.h:

```text
......
#ifndef CONFIG_SPL_BUILD
#undef CONFIG_BOOTCOMMAND
#define CONFIG_BOOTCOMMAND RKIMG_BOOTCOMMAND // 定义启动命令（设置为RKIMG_BOOTCOMMAND）
#endif
......
#define ROCKCHIP_DEVICE_SETTINGS \           // 使能显⽰模块
        "stdout=serial,vidconsole\0" \
        "stderr=serial,vidconsole\0"
......
```

### 2.4 Startablauf

Wichtige Schritte beim U-Boot-Start auf RK:

```text
start.s
    // 汇编环境
    => IRQ/FIQ/lowlevel/vbar/errata/cp15/gic   // ARM架构相关的lowlevel初始化
    => _main
        => stack                               // 准备好C环境需要的栈
        // 【第⼀阶段】C环境初始化，发起⼀系列的函数调⽤
        => board_init_f: init_sequence_f[]
            initf_malloc
            arch_cpu_init                      // 【SoC的lowlevel初始化】
            serial_init                        // 串⼝初始化
            dram_init                          // 【获取ddr容量信息】
            reserve_mmu                        // 从ddr末尾开始往低地址reserve内存
    reserve_video
    reserve_uboot
    reserve_malloc
    reserve_global_data
    reserve_fdt
    reserve_stacks
    dram_init_banksize
    sysmem_init
    setup_reloc                        // 确定U-Boot⾃⾝要reloc的地址
// 汇编环境
=> relocate_code                       // 汇编实现U-Boot代码的relocation
// 【第⼆阶段】C环境初始化，发起⼀系列的函数调⽤
=> board_init_r: init_sequence_r[]
    initr_caches                       // 使能MMU和I/Dcache
    initr_malloc
    bidram_initr
    sysmem_initr
    initr_of_live                      // 初始化of_live
    initr_dm                           // 初始化dm框架
    board_init                         // 【平台初始化，最核⼼部分】
        board_debug_uart_init          // 串⼝iomux、clk配置
        init_kernel_dtb                // 【切到kernel dtb】！
        clks_probe                     // 初始化系统频率
        regulators_enable_boot_on      // 初始化系统电源
        io_domain_init                 // io-domain初始化
        set_armclk_rate                // __weak，ARM提频(平台有需求才实现)
        dvfs_init                      // 宽温芯⽚的调频调压
        rk_board_init                  // __weak，由各个具体平台进⾏实现
    console_init_r
    board_late_init                    // 【平台late初始化】
        rockchip_set_ethaddr           // 设置mac地址
        rockchip_set_serialno          // 设置serialno
        setup_boot_mode                // 解析"reboot xxx"命令、
                                       // 识别按键和loader烧写模式、recovery
        charge_display                 // U-Boot充电
        rockchip_show_logo             // 显⽰开机logo
        soc_clk_dump                   // 打印clk tree
        rk_board_late_init             // __weak，由各个具体平台进⾏实现
    run_main_loop                      // 【进⼊命令⾏模式，或执⾏启动命令】
```

### 2.5 Speicheraufteilung

Der vorherige Loader lädt U-Boot an CONFIG_SYS_TEXT_BASE. Die Initialisierung erkennt den Gesamtspeicher: 32-Bit-Plattformen betrachten höchstens4GB als verfügbar (ohne die Kernel-Erkennung zu begrenzen), 64-Bit-Plattformen den gesamten Speicher. reserve_xxx() reservieren Bereiche vom Ende nach vorne; anschließend verlagert U-Boot sich in einen davon. Typisches ARM64-Layout:

| Name | Start Addr Offset | Size | Usage | Secure |
| --- | --- | --- | --- | --- |
| ATF | 0x00000000 | 1M | ARM Trusted Firmware | Yes |
| SHM | 0x00100000 | 1M | SHM, Pstore | No |
| OP-TEE | 0x08400000 | 2M~30M | Siehe TEE-Entwicklerhandbuch | Yes |
| FDT | fdt_addr_r | - | kernel dtb | No |
| KERNEL | kernel_addr_r | - | Kernel-Abbild | No |
| RAMDISK | ramdisk_addr_r | - | Ramdisk-Abbild | No |
| ...... | - | - | - | - |
| FASTBOOT | - | - | Fastboot buffer | No |
| ...... | - | - | - |  |
| SP | - | - | stack | No |
| FDT | - | sizeof(dtb) | U-Boot dtb | No |
| GD | - | sizeof(gd) | - | No |
| Board | - | sizeof(bd_t) | - | No |
| MALLOC | - | CONFIG_SYS_MALLOC_LEN | System-Heap | No |
| U-Boot | - | sizeof(mon) | U-Boot-Abbild | No |
| Video FB | - | fb size | 32M | No |
| TLB Table | RAM_TOP-64K | 32K | MMU-Seitentabelle | No |

Start Addr Offset ist der Versatz zur DDR-Basis. Fastboot-Adresse/-Größe folgen CONFIG_FASTBOOT_BUF_ADDR/CONFIG_FASTBOOT_BUF_SIZE. Video FB/U-Boot/Malloc/Board/Gd/Fdt/Sp werden bedarfsgerecht von oben nach unten reserviert. Bei64Bit ist ATF für ARMv8 erforderlich, OP-TEE optional; bei32Bit gibt es nur OP-TEE. kernel fdt/kernel/ramdisk sind Ladeadressen aus ENV_MEM_LAYOUT_SETTINGS. Der Fastboot-Puffer wird in defconfig definiert. OP-TEE benötigt je nach Bedarf höchstens30M; auf RK1808/RK3308 liegt es niedrig statt an0x8400000.

### 2.6 Massenspeicheraufteilung

Nachfolgend das RK-Linux-Speicherlayout. Android unterscheidet sich hauptsächlich bei boot/rootfs; der Rest ist weitgehend gleich und dient als Orientierung.

![Abbildung 1: englische Quelle, Seite 28](/docs/rockchip-uboot-nextdev/assets/en-p028-figure-01.png)

*Abbildung 1: englische Quelle, Seite 28*

Bildquelle: http://opensource.rock-chips.com/wiki_Partitions

### 2.7 Aliases

Einige U-Boot-aliases unterscheiden sich vom Kernel-DTS. eMMC/SD heißen gemeinsam mmc und werden durch0/1 unterschieden; SD hat höhere Bootpriorität als eMMC.

```text
mmc1：表⽰sd
mmc0：表⽰emmc
```

### 2.8 AMP

RK-U-Boot unterstützt AMP (Asymmetric Multi-Processing). Siehe Treibermodulkapitel.

### 2.9 Atags

RK-Bootablauf:

```text
BOOTROM => ddr-bin => Miniloader => TRUST => U-BOOT => KERNEL
```

ATAGS übergibt Konfiguration zwischen ddr-bin, miniloader, trust und U-Boot, jedoch nicht dem Kernel. Daten: UART, Speichertyp, ATF-/OP-TEE-Speicher, DDR-Kapazität und weitere.

Implementierung:

```text
./arch/arm/include/asm/arch-rockchip/rk_atags.h
./arch/arm/mach-rockchip/rk_atags.c
```

### 2.10 Bidram/sysmem

U-Boot nutzt den gesamten Speicher und reserviert Systembereiche von hohen zu niedrigen Adressen. Ein großer Restbereich besitzt keine eigene U-Boot-Verwaltung. RK führte dafür bidram und sysmem ein. Zusammen mit malloc verwalten sie den gesamten Speicher und verhindern Konflikte.

```text
low-addr                                                                    high-addr
|-----------------------------------------------------------|-----------------|
|             no management                                 | system used     |
|-----------------------------------------------------------|-----------------|
0x0                                                                          N GB
```

bidram verwaltet auszusparende, für U-Boot/Kernel nicht verfügbare Blöcke wie ATF/OP-TEE. sysmem verwaltet für den Kernel sichtbaren Speicher wie fdt/ramdisk/kernel/fastboot. Code:

```text
./lib/sysmem.c
./lib/bidram.c
./include/memblk.h
./arch/arm/mach-rockchip/memblk.c
```

Bei Fehlern der Blockinitialisierung/-zuweisung werden bidram-/sysmem-Tabellen ausgegeben. Zunächst bidram:

```text
bidram_dump_all:
    --------------------------------------------------------------------
    // <1> 这⾥显⽰了U-Boot从前级loader获取的ddr的总容量信息，⼀共有2GB
    memory.rgn[0].addr     = 0x00000000 - 0x80000000 (size: 0x80000000)

    memory.total           = 0x80000000 (2048 MiB. 0 KiB)
    --------------------------------------------------------------------
    // <2> 这⾥显⽰了被预留起来的各固件内存信息，这些空间对kernel不可⻅
    reserved.rgn[0].name   = "ATF"
                   .addr   = 0x00000000 - 0x00100000 (size: 0x00100000)
    reserved.rgn[1].name   = "SHM"
                   .addr   = 0x00100000 - 0x00200000 (size: 0x00100000)
    reserved.rgn[2].name   = "OP-TEE"
                   .addr   = 0x08400000 - 0x0a200000 (size: 0x01e00000)
reserved.total         = 0x02000000 (32 MiB. 0 KiB)
--------------------------------------------------------------------
// <3> 这⾥是核⼼算法对上述<2>进⾏的预留信息整理，例如：会对相邻块进⾏合并
LMB.reserved[0].addr   = 0x00000000 - 0x00200000 (size: 0x00200000)
LMB.reserved[1].addr   = 0x08400000 - 0x0a200000 (size: 0x01e00000)

reserved.core.total    = 0x02000000 (32 MiB. 0 KiB)
--------------------------------------------------------------------
```

sysmem-Speichertabelle:

```text
sysmem_dump_all:
    --------------------------------------------------------------------
    // <1> 这⾥是sysmem可管理的总内存容量，即bidram<3>之外的可⽤ddr容量，对kernel可⻅。
    memory.rgn[0].addr     = 0x00200000 - 0x08400000 (size: 0x08200000)
    memory.rgn[1].addr     = 0x0a200000 - 0x80000000 (size: 0x75e00000)

    memory.total           = 0x7e000000 (2016 MiB. 0 KiB)
    --------------------------------------------------------------------
    // <2> 这⾥显⽰了各个固件alloc⾛的内存块信息
    allocated.rgn[0].name  = "U-Boot"
                    .addr  = 0x71dd6140 - 0x80000000 (size: 0x0e229ec0)
    allocated.rgn[1].name  = "STACK"      <Overflow!> // 表明栈溢出
                    .addr  = 0x71bd6140 - 0x71dd6140 (size: 0x00200000)
    allocated.rgn[2].name  = "FDT"
                    .addr  = 0x08300000 - 0x08316204 (size: 0x00016204)
    allocated.rgn[3].name  = "KERNEL"     <Overflow!> // 表明内存块溢出
                    .addr  = 0x00280000 - 0x014ce204 (size: 0x0124e204)
    allocated.rgn[4].name  = "RAMDISK"
                    .addr  = 0x0a200000 - 0x0a3e6804 (size: 0x001e6804)
    // <3> malloc_r/f的⼤⼩
    malloc_r: 192 MiB, malloc_f: 16 KiB

    allocated.total        = 0x0f874acc (248 MiB. 466 KiB)
    --------------------------------------------------------------------
    // <4> 这⾥是核⼼算法对上述<2>进⾏的信息整理，显⽰被占⽤⾛的内存块信息
    LMB.reserved[0].addr   = 0x00280000 - 0x014ce204 (size: 0x0124e204)
    LMB.reserved[1].addr   = 0x08300000 - 0x08316204 (size: 0x00016204)
    LMB.reserved[2].addr   = 0x0a200000 - 0x0a3e6804 (size: 0x001e6804)
    LMB.reserved[3].addr   = 0x71bd6140 - 0x80000000 (size: 0x0e429ec0)

    reserved.core.total    = 0x0f874acc (248 MiB. 466 KiB)
    --------------------------------------------------------------------
```

Folgende häufige Fehlermeldungen zusammen mit den bidram-/sysmem-Tabellen analysieren.

```text
// 期望申请的内存已经被其他固件占⽤了，存在内存重叠。这说明当前系统的内存块使⽤规划不合理
Sysmem Error: "KERNEL" (0x00200000 - 0x02200000) alloc is overlap with existence "RAMDISK"
(0x00100000 - 0x01200000)

// 期望申请的内存因为⼀些特殊原因⽆法申请到（分析sysmem和bidram信息）
Sysmem Error: Failed to alloc "KERNEL" expect at 0x00200000 - 0x02200000 but at 0x00400000 -
0x0420000

// sysmem管理的空间起始地址为0x200000，所以根本申请不到0x100000起始的空间
Sysmem Error: Failed to alloc "KERNEL" at 0x00100000 - 0x02200000

// 重复申请"RAMDISK"内存块
Sysmem Error: Failed to double alloc for existence "RAMDISK"
```

### 2.11 Fuse/OTP

Zur RK-secure-boot-Diagnose genügt signierte Firmware ohne Programmierung von efuse/OTP. Miniloader ergänzt über U-Boot die Kernel-cmdline: fuse.programmed=1 — secure-boot aktiv und efuse/OTP programmiert; fuse.programmed=0 — aktiv, jedoch nicht programmiert. Fehlt fuse.programmed, ist secure-boot deaktiviert oder Miniloader zu alt zur Übergabe. U-Boot benötigt folgenden Commit:

```text
83c9bd4 board: rockchip: pass fuse programmed state to kernel
```

### 2.12 Hotkey

UART-Tastenkombinationen lösen Debug-/Programmierereignisse aus; nötigenfalls mehrfach versuchen, bei secure-boot wirkungslos. Beim Start halten: ctrl+c — U-Boot-Konsole; ctrl+d — Loader; ctrl+b — Maskrom; ctrl+f — Fastboot; ctrl+m — bidram/system; ctrl+i — Kernel-initcall_debug; ctrl+p — cmdline; ctrl+s — U-Boot-Konsole nach Starting kernel....

### 2.13 Image Decompress

64-Bit-Systeme verwenden gewöhnlich Image, das U-Boot an die Ausführungsadresse lädt. RK-U-Boot kann auch64-Bit-LZ4-Kernel entpacken, wenn Folgendes aktiv ist:

```text
CONFIG_LZ4=y
```

Adressen vor/nach Entpacken des64-Bit-LZ4-Kernels in rkxxx_common.h der Plattform definieren:

```text
#define ENV_MEM_LAYOUT_SETTINGS \
    "scriptaddr=0x00500000\0" \
    "pxefile_addr_r=0x00600000\0" \
    "fdt_addr_r=0x01f00000\0" \
    "kernel_addr_no_bl32_r=0x00280000\0" \
    "kernel_addr_r=0x00680000\0" \        // LZ4解压内核的地址
    "kernel_addr_c=0x02480000\0" \        // LZ4压缩内核的地址
    "ramdisk_addr_r=0x04000000\0"
```

32-Bit-Systeme verwenden gewöhnlich zImage: U-Boot lädt an kernel_addr_r, der Kernel entpackt sich selbst. RK-U-Boot unterstützt auch Image direkt an der Ausführungsadresse. rkxxx_common.h definiert derzeit kernel_addr_r, nicht kernel_addr_c. Keine Änderung nötig: U-Boot erkennt zImage/Image und behandelt die Adressen dynamisch. Jedoch Folgendes deaktivieren:

```text
CONFIG_SKIP_RELOCATE_UBOOT
```

Ladeadresse des32-Bit-Kernels:

```text
#define ENV_MEM_LAYOUT_SETTINGS \
    "scriptaddr=0x60000000\0" \
    "pxefile_addr_r=0x60100000\0" \
    "fdt_addr_r=0x68300000\0" \
    "kernel_addr_r=0x62008000\0" \       // zImage压缩内核的地址
    "ramdisk_addr_r=0x6a200000\0"
```

### 2.14 Image kernel

RK-U-Boot lädt drei Kernelformate. Ein RK-Image hat Magic KRNL:

```text
00000000   4B 52 4E 4C  42 97 0F 00  1F 8B 08 00  00 00 00 00  KRNL..y.........
00000010   00 03 A4 BC  0B 78 53 55  D6 37 BE 4F  4E D2 A4 69  .....xSU.7.ON..i
```

kernel.img = kernel;resource.img = dtb + logo.bmp + logo_kernel.bmp;

boot.img = ramdisk; recovery.img = ramdisk(for recovery). Android-Image-Magic: ANDROID!:

```text
00000000   41 4E 44 52  4F 49 44 21  24 10 74 00  00 80 40 60  ANDROID!$.t...@`
00000010   F9 31 CD 00  00 00 00 62  00 00 00 00  00 00 F0 60  .1.....b.......`
```

boot.img = kernel + ramdisk+ resource + &lt;dtb&gt;;recovery.img = kernel + ramdisk(for recovery) + resource + &lt;recovery_dtbo&gt; + &lt;dtb&gt;;

recovery_dtbo wurde mit Android9.0, dtb mit Android10.0 ergänzt. Distro ist ein verbreitetes offenes Linux-Paketformat für ramdisk, dtb und kernel in einem Image, meist mit ext2/ext4/FAT. U-Boot benötigt das Dateisystem zum Zugriff. Weitere Informationen:

```text
./doc/README.distro
./include/config_distro_defaults.h
./include/config_distro_bootcmd.h
```

Priorität android &gt; rk &gt; distro. Formatbefehle werden nacheinander bis zum erfolgreichen Start ausgeführt; scheitern alle, bleibt die U-Boot-Konsole. Prioritätsdefinition:

```text
#define RKIMG_BOOTCOMMAND \
    "boot_android ${devtype} ${devnum};" \
    "bootrkp;" \
    "run distro_bootcmd;"
```

### 2.15 Image U-Boot

U-Boot/trust verwenden RK oder FIT, geladen durch Miniloader beziehungsweise SPL. SDK-Grenze ist RV1126: ab dort FIT, zuvor RK. RK ist das Rockchip-eigene Format: U-Boot in uboot.img, trust in trust.img. Magic von uboot.img und32-Bit-trust.img: LOADER:

```text
00000000  4c 4f 41 44 45 52 20 20  00 00 00 00 00 00 00 00  |LOADER  ........|
00000010  00 00 20 00 78 d0 0f 00  06 99 c2 a8 20 00 00 00  |.. .x....... ...|
00000020  09 8a b0 e1 89 7a c2 89  0d e8 da ef 86 3e f2 24  |.....z.......>.$|
```

Magic von64-Bit-trust.img: BL3X:

```text
00000000  42 4c 33 58 00 01 00 00  23 00 00 00 f8 00 04 00  |BL3X....#.......|
00000010  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
```

FIT ist ein sehr flexibles Mainline-U-Boot-Format. U-Boot, trust, MCU und weitere Komponenten werden zusammen in uboot.img gepackt. Magic: d0 0d fe ed; fdtdump uboot.img zeigt den Header.

```text
00000000  d0 0d fe ed 00 00 06 00  00 00 00 58 00 00 04 c4  |...........X....|
00000010  00 00 00 28 00 00 00 11  00 00 00 10 00 00 00 00  |...(............|
```

Weitere Informationen im FIT-Kapitel. Sicherungskopien: uboot.img und trust.img enthalten normalerweise mehrere Kopien gegen Beschädigung durch Stromausfall während OTA und ähnliche Fälle.

| Firmware | Größe je Kopie | Anzahl gepackter Kopien |
| --- | --- | --- |
| RK uboot.img | 1MB | 4 |
| RK 32-Bit trust.img | 1MB | 4 |
| RK 64-Bit trust.img | 2MB | 2 |
| FIT uboot.img | 2MB | 2 |

Laut Tabelle sind uboot.img/trust.img standardmäßig4MB groß. Für RK Kopiengröße/-anzahl per Buildparameter ändern: --sz-uboot 2048 1 ergibt eine2M-Kopie uboot.img, --sz-trust 4096 1 eine4M-Kopie trust.img. Für FIT CONFIG_SPL_FIT_IMAGE_KB (Kopiengröße in KB) und CONFIG_SPL_FIT_IMAGE_MULTIPLE (Anzahl) setzen. SPL bestimmt daraus Position und Anzahl. Nach Änderungen --spl-new an make.sh anhängen, damit Loader frisch gebautes SPL enthält. Sonst wird SPL aus rkbin gepackt, das standardmäßig2MB*2 Kopien sucht. Die Quelle nennt hier u-boo-spl.bin; diese Schreibweise bleibt als Quellangabe erhalten.

### 2.16 Interrupt

Original-U-Boot unterstützt Interrupts nicht vollständig; RK ergänzte GIC-V2/V3. Siehe Treiberkapitel.

### 2.17 Kernel-DTB

Original-U-Boot nutzt nur seine eigene DTB. RK ergänzt Kernel-DTB zur Peripherieinitialisierung für Boardunterschiede bei Stromversorgung, Takten und Anzeige. U-Boot-DTB initialisiert Speichergerät und Ausgabe-UART, Kernel-DTB die übrigen Geräte. Zuerst wird die eigene DTB verwendet, dann Kernel-DTB vom Speicher geladen und die Initialisierung fortgesetzt. Implementierung: init_kernel_dtb(). Eigene DTB meist nur bei UART-Wechsel ändern; SDK-defconfigs aktivieren den Mechanismus bereits. Peripherieänderungen gehören in Kernel-DTB. U-Boot-DTS-Verzeichnis:

```text
./arch/arm/dts/
```

Bei Kernel-DTB wählt der Build U-Boot-DTS-Knoten mit u-boot,dm-pre-reloc und u-boot,dm-spl und entfernt anschließend Eigenschaften aus CONFIG_OF_SPL_REMOVE_PROPS in defconfig. Das erzeugte u-boot.dtb wird an u-boot.bin angehängt. Mit fdtdump prüfen:

```text
fdtdump ./u-boot.dtb | less
```

Weitere Informationen im Kapitel vertiefender Prinzipien.

### 2.18 MMU Cache

RK aktiviert standardmäßig MMU, Dcache und Icache. MMU bildet linear1:1 ab; Dcache verwendet Write-back. Schnittstellen:

```text
// Icache接⼝：
void icache_enable (void);
void icache_disable (void);
void invalidate_icache_all(void);

// Dcache接⼝：
void dcache_disable (void);
void dcache_enable(void);
void flush_dcache_range(unsigned long start, unsigned long stop);
void flush_cache(unsigned long start, unsigned long size)；
void flush_dcache_all(void);
void invalidate_dcache_range(unsigned long start, unsigned long stop);
void invalidate_dcache_all(void);
// 重新映射某块内存区间的Dcache属性
void mmu_set_region_dcache_behaviour(phys_addr_t start, size_t size,
                                     enum dcache_option option)
```

### 2.19 Make.sh

make.sh dient zum Bauen, Packen und Debuggen, einschließlich Disassemblierung und Firmwarepaketierung.

```text
// 帮助命令
./make.sh --help

// 打包固件的功能
./make.sh trust              // 打包trust
./make.sh loader             // 打包loader
./make.sh trust <ini-file>   // 打包trust时指定ini⽂件
./make.sh loader <ini-file>  // 打包loader时指定ini⽂件
./make.sh spl                // ⽤tpl+spl替换ddr和miniloader，打包成loader
./make.sh spl-s              // ⽤spl替换miniloader，打包成loader
./make.sh itb                // 打包u-boot.itb（64位平台只⽀持打包ATF和U-Boot，OP-TEE不打包）
./make.sh env                // ⽣成fw_printenv⼯具

// 反汇编的功能
./make.sh elf-[x] [type]     // 反汇编：使⽤-[x]参数, [type]可选择是否反汇编SPL或TPL
./make.sh elf                // 反汇编u-boot⽂件，默认使⽤-D参数
./make.sh elf-S              // 反汇编u-boot⽂件，使⽤-S参数
./make.sh elf-d              // 反汇编u-boot⽂件，使⽤-d参数
./make.sh elf spl            // 反汇编tpl/u-boot-tpl⽂件，默认使⽤-D参数
./make.sh elf tpl            // 反汇编spl/u-boot-tpl⽂件，默认使⽤-D参数
./make.sh <addr>             // 需要addr对应的函数名和代码位置
./make.sh map                // 打开u-boot.map
./make.sh sym                // 打开u-boot.sym
```

### 2.20 HW-ID DTB

RK-U-Boot wählt aus mehreren DTBs anhand von GPIO-/ADC-Hardwarezuständen die passende. Siehe Systemmodulkapitel.

### 2.21 Partition Table

Unterstützt werden altes RK parameter und neue Standard-GPT. Sind beide vorhanden, hat GPT Vorrang. Die Programmierdatei heißt jeweils parameter.txt; TYPE: GPT kennzeichnet GPT.

```text
FIRMWARE_VER:8.1
MACHINE_MODEL:RK3399
MACHINE_ID:007
MANUFACTURER: RK3399
MAGIC: 0x5041524B
ATAG: 0x00200800
MACHINE: 3399
CHECK_MASK: 0x80
PWR_HLD: 0,0,A,0,1
TYPE: GPT               // 当前是GPT格式的分区表，否则为RK paramter
CMDLINE:mtdparts=rk29xxnand:0x00002000@0x00004000(uboot),0x00002000@0x00006000(trust),0
x00002000@0x00008000(misc),0x00008000@0x0000a000(resource),0x00010000@0x00012000(kernel
),0x00010000@0x00022000(boot),0x00020000@0x00032000(recovery),0x00038000@0x00052000(bac
kup),0x00002000@0x0008a000(security),0x00100000@0x0008c000(cache),0x00500000@0x0018c000
(system),0x00008000@0x0068c000(metadata),0x00100000@0x00694000(vendor),0x00100000@0x007
96000(oem),0x00000400@0x00896000(frp),-@0x00896400(userdata:grow)
```

### 2.22 Relocation

Nach board_f.c verlagert sich U-Boot an eine vom Speicherlayout bestimmte Adresse nahe dem Ende. RK-Standard:32Bit ohne Relocation bei CONFIG_SKIP_RELOCATE_UBOOT=y, sonst mit;64Bit mit Relocation.

### 2.23 Reset

Reset erfolgt wie im Kernel über trust. Die U-Boot-Konsole unterstützt reboot xxx analog zum Kernel, abhängig vom Kernel-DTS.

### 2.24 Sd/Udisk

RK-U-Boot unterstützt Booten/Aktualisieren über SD und USB. SD wird ab BootROM, USB ab U-Boot unterstützt. Siehe Systemmodulkapitel.

### 2.25 Stacktrace

RK ergänzte ursprünglich fehlende Stackrückverfolgung. Drei Auslöser: automatisch beim Absturz, explizit über dump_stack(), über CONFIG_ROCKCHIP_DEBUGGER. Abort-Beispiel:

```text
"Synchronous Abort" handler, esr 0x96000010

// abort的原因、pc、lr、sp
* Reason:        Exception from a Data abort, from current exception level
* PC         =   000000000028f430
* LR         =   00000000002608d0
* SP         =   00000000f3dceb30

...

// 重点突出PC和LR
Call trace:
  PC:   [< 0028f430 >]
  LR:   [< 002608d0 >]

// 函数调⽤关系
Stack:
        [< 0028f430 >]
        [< 0028da24 >]
        [< 00211600 >]
        [< 002117b0 >]
        [< 00202910 >]
        [< 00202aa8 >]
        [< 0027698c >]
        [< 002151ec >]
        [< 00201b2c >]

// 指导⽤⼾转换上述调⽤栈信息
Copy info from "Call trace..." to a file(eg. dump.txt), and run
command in your U-Boot project: ./scripts/stacktrace.sh dump.txt
```

Stacktrace in eine txt-Datei, etwa dump.txt, kopieren und ausführen:

```text
cjh@Ubuntu:~/u-boot$ ./scripts/stacktrace.sh dump.txt

// 符号表来源
SYMBOL File: ./u-boot.sym

// 重点列出PC和LR对应的代码位置
Call trace:
 PC:   [< 0028f430 >]  strncpy+0xc/0x20      ./lib/string.c:98
 LR:   [< 002608d0 >]  on_serialno+0x10/0x1c ./drivers/usb/gadget/g_dnl.c:217

// 转换后得到真实函数名
Stack:
       [< 0028f430 >]  strncpy+0xc/0x20
       [< 0028da24 >]  hdelete_r+0xcc/0xf0
       [< 00211600 >]  _do_env_set.isra.0+0x70/0x1b8
       [< 002117b0 >]  env_set+0x3c/0x58
       [< 00202910 >]  rockchip_set_serialno+0x54/0x140
       [< 00202aa8 >]  board_late_init+0x5c/0xa0
       [< 0027698c >]  initcall_run_list+0x58/0x94
       [< 002151ec >]  board_init_r+0x20/0x24
[< 00201b2c >]  relocation_return+0x4/0x0
```

Es gibt drei Umwandlungsbefehle; gemäß der Anleitung hinter dem Stacktrace wählen.

```text
./scripts/stacktrace.sh ./dump.txt        // 解析来⾃U-Boot的调⽤栈信息
./scripts/stacktrace.sh ./dump.txt tpl    // 解析来⾃tpl的调⽤栈信息
./scripts/stacktrace.sh ./dump.txt spl    // 解析来⾃spl的调⽤栈信息
```

Gerätefirmware muss zum aktuellen Codebaum passen, sonst liefert die Umwandlung falsche Ergebnisse.

### 2.26 TimeCost

Nach der Initialisierung zeigt U-Boot standardmäßig die gesamte Phasendauer:

```text
### Booting Android Image at 0x02007800 ...
Kernel load addr 0x02008000 size 8062 KiB
### Flattened Device Tree blob at 08300000
   Booting using the fdt blob at 0x8300000
   XIP Kernel Image ... OK
  'reserved-memory' dma-unusable@fe000000: addr=fe000000 size=1000000
  'reserved-memory' ramoops@00000000: addr=8000000 size=f0000
   Using Device Tree in place at 08300000, end 08316ed1
Adding bank: 0x00000000 - 0x08400000 (size: 0x08400000)
Adding bank: 0x09200000 - 0x80000000 (size: 0x76e00000)
Total: 812.613 ms    // U-Boot阶段的总耗时

Starting kernel ...
```

debug() und DEBUG in lib/initcall.c für einzelne Ablaufzeiten aktivieren. Funktionsadressen über ./make.sh disassemblieren.

```text
U-Boot 2017.09-00019-g9b55ed0-dirty (Dec 26 2019 - 14:45:33 +0800)

                                         #    5212 us # 137.868 ms
initcall: 0020de1f
                                         #       1 us # 142.636 ms
initcall: 0020e015
Model: Evb-RK3288
                                         #    1646 us # 149. 48 ms
initcall: 0020dd61
PreSerial: 2
                                         #    1213 us # 155. 28 ms
initcall: 0020ddcd
DRAM:                                    #     606 us # 160.401 ms
initcall: 00203719
              // 如下 187 us     是 initcall: 00203719 调⽤的耗时
              // 如下 165.355 ms 是 initcall: 00203719 为⽌的U-Boot启动耗时
                                         #     187 us # 165.355 ms
initcall: 0020de81
                                         #       2 us # 169.938 ms
initcall: 0020dc29
                                         #       1 us # 174.703 ms
initcall: 0020dc3d
                                         #       1 us # 179.469 ms
initcall: 0020ddad
                                         #       2 us # 184.237 ms
initcall: 0020de27
                                         #       1 us # 189.  2 ms
......
```

### 2.27 Timestamp

Der Kernel zeigt standardmäßig Zeitstempel, U-Boot nicht. Bei Bedarf CONFIG_BOOTSTAGE_PRINTF_TIMESTAMP aktivieren:

```text
[    0.324987] U-Boot 2017.09-00019-g9b55ed0-dirty (Dec 26 2019 - 14:31:44 +0800)

[    0.327215] Model: Evb-RK3288
[    0.330039] PreSerial: 2
[    0.332526] DRAM:  2 GiB
[    0.336454] Relocation Offset: 00000000, fdt: 7be22c38
[    0.346981] Using default environment

[    0.351075] dwmmc@ff0c0000: 1, dwmmc@ff0f0000: 0
[    0.394136] Bootdev(atags): mmc 0
[    0.394272] MMC0: High Speed, 52Mhz
[    0.395276] PartType: EFI
[    0.400347] Android 9.0, Build 2019.6
[    0.402070] boot mode: None
[    0.405213] Found DTB in boot part
[    0.407833] DTB: rk-kernel.dtb
[    0.418211] ANDROID: fdt overlay OK
[    0.432128] I2c0 speed: 400000Hz
[    0.435916] PMIC:  RK808
[    0.439113] vdd_arm 1100000 uV
[    0.444148] vdd_gpu 1100000 uV
......

[    1.005018] ## Booting Android Image at 0x02007800 ...
[    1.009917] Kernel load addr 0x02008000 size 8062 KiB
[    1.014981] ## Flattened Device Tree blob at 08300000
[    1.019970]    Booting using the fdt blob at 0x8300000
[    1.025185]    XIP Kernel Image ... OK
[    1.035469]   'reserved-memory' dma-unusable@fe000000: addr=fe000000 size=1000000
[    1.037448]   'reserved-memory' ramoops@00000000: addr=8000000 size=f0000
[    1.044412]    Using Device Tree in place at 08300000, end 08316ed1
[    1.064363] Adding bank: 0x00000000 - 0x08400000 (size: 0x08400000)
[    1.064976] Adding bank: 0x09200000 - 0x80000000 (size: 0x76e00000)
[    1.075259] Total: 812.613 ms
[    1.075279] Starting kernel ...
......：
```

Der Zeitstempel ist relativ, nicht absolut.

### 2.28 Vendor storage

Vendor storage in RK-U-Boot speichert SN, MAC und weitere Nutzerdaten. Offsets (siehe vendor.c):

```text
#define EMMC_VENDOR_PART_OFFSET     (1024 * 7)
/* --- Spi Nand/SLC/MLC large capacity case define --- */
#define NAND_VENDOR_PART_OFFSET     0
/* --- Spi/Spi Nand/SLC/MLC small capacity case define --- */
#define FLASH_VENDOR_PART_OFFSET    8
......
```

Offsets müssen normalerweise nicht geändert werden; Lese-/Schreibschnittstellen verwenden:

```text
int vendor_storage_read(u16 id, void *pbuf, u16 size)
int vendor_storage_write(u16 id, void *pbuf, u16 size)
```

## 3 Bauen und Programmieren

### 3.1 Vorbereitung

rkbin herunterladen: Repository für proprietäre RK-Binärdateien, Skripte und Paketwerkzeuge. U-Boot nutzt daraus Dateien für loader/trust/uboot. rkbin und U-Boot müssen benachbarte Verzeichnisse sein; Links im Anhang. gcc-linaro-6.3.1 unter prebuilts ebenfalls neben U-Boot ablegen:

```text
// 32位：
prebuilts/gcc/linux-x86/arm/gcc-linaro-6.3.1-2017.05-x86_64_arm-linux-gnueabihf
// 64位：
prebuilts/gcc/linux-x86/aarch64/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu/
```

GCC-Links im Anhang, defconfig im Plattformdefinitionskapitel. Produktunterschiede erfordern Config-Fragmente, ab RV1126 als Overlay auf defconfig unterstützt. Beispiel: rv1126-emmc-tb.config setzt CONFIG_BASE_DEFCONFIG="rv1126_defconfig". ./make.sh rv1126-emmc-tb erzeugt zuerst .config aus rv1126_defconfig und legt dann rv1126-emmc-tb.config darüber. Gleichwertige Befehle:

```text
make rv1126_defconfig rv1126-emmc-tb.config && make
```

Config-Fragmente mit ./scripts/sync-fragment.sh aktualisieren, beispielsweise:

```text
./scripts/sync-fragment.sh configs/rv1126-emmc-tb.config
```

Der Befehl schreibt Unterschiede zwischen aktueller .config und rv1126_defconfig nach rv1126-emmc-tb.config.

### 3.2 Firmware bauen

Buildbefehl:

```text
./make.sh [board]               // [board]：configs/[board]_defconfig⽂件。
```

Erster Build oder neuer defconfig benötigt [board] auf32- und64-Bit-Plattformen:

```text
./make.sh rk3399                // build for rk3399_defconfig
./make.sh evb-rk3399            // build for evb-rk3399_defconfig
./make.sh firefly-rk3288        // build for firefly-rk3288_defconfig
```

Erneuter Build mit aktueller .config benötigt unabhängig von der Bitbreite kein [board]:

```text
./make.sh
```

Bei ungewöhnlichen Fehlern make distclean und erneut bauen. Danach werden trust, uboot und loader im U-Boot-Wurzelverzeichnis gepackt. Paketausgabe:

```text
// 编译...
....

// uboot打包过程
load addr is 0x60000000!
pack input u-boot.bin
pack file size: 478737
crc = 0x840f163c
uboot version: v2017.12 Dec 11 2017
pack uboot.img success!
pack uboot okay! Input: u-boot.bin

// loader打包过程及引⽤的ini⽂件
out:rk3126_loader_v2.09.247.bin
fix opt:rk3126_loader_v2.09.247.bin
merge success(rk3126_loader_v2.09.247.bin)
pack loader okay! Input: /home/cjh/rkbin/RKBOOT/RK3126MINIALL.ini

// trust打包过程及引⽤的ini⽂件
 load addr is 0x68400000!
pack file size: 602104
crc = 0x9c178803
trustos version: Trust os
pack ./trust.img success!
trust.img with ta is ready
pack trust okay! Input: /home/cjh/rkbin/RKTRUST/RK3126TOS.ini

// 提⽰编译成功。注意：即使上述的trust和loader打包失败也会提⽰这句话，说明⾄少⽣成了uboot.img
Platform RK3126 is build OK, with new .config(make rk3126_defconfig)
```

Programmierbare Dateien im Wurzelverzeichnis:

```text
./uboot.img
./trust.img    // 注意：如果是fit格式的固件，则没有trust.img。trust的⼆进制被打包在uboot.img⾥。
./rk3126_loader_v2.09.247.bin
```

Paketwerkzeuge: Werkzeugkapitel.

### 3.3 Firmware programmieren

Unter Windows/Linux wird das Flashwerkzeug aus dem SDK oder eine aktuelle Version empfohlen. RK hat zwei Modi: Maskrom und Loader (U-Boot).

1. Loader: Beim Einschalten Lautstärke+ oder am Host ctrl+d halten; in der U-Boot-Konsole download oder rockusb 0 $devtype $devnum.

2. Maskrom: Beim Einschalten am Host ctrl+b halten oder rbrom in der U-Boot-Konsole ausführen. Beim Wechsel zwischen RK parameter und GPT benötigt NAND den gesamten Firmwaresatz neu; bei eMMC kann nur die Partitionstabelle ersetzt werden. Sind beide vorhanden, hat GPT Vorrang. Erkennung anhand der Bootausgabe:

```text
...
PartType: EFI // 当前为GPT分区表，否则打印"PartType: RKPARM"
...
```

### 3.4 Firmwaregröße

Siehe RK-Architektur → Image U-Boot.

### 3.5 Besondere Paketierung

./make.sh bietet außerdem eigenständige Paketbefehle. Voraussetzung ist mindestens ein vorheriger U-Boot-Build. Nicht-FIT-Format:

```text
./make.sh trust              // 打包trust
./make.sh loader             // 打包loader
./make.sh trust <ini-file>   // 打包trust时指定ini⽂件，否则使⽤默认ini⽂件
./make.sh loader <ini-file>  // 打包loader时指定ini⽂件，否则使⽤默认ini⽂件
```

FIT-Format:

```text
// 旧脚本：
./make.sh spl                // ⽤tpl+spl替换ddr和miniloader，打包成loader
./make.sh spl-s              // ⽤spl替换miniloader，打包成loader

// 新脚本：
./make.sh --spl              // ⽤spl替换miniloader，打包成loader
./make.sh --tpl              // ⽤tpl替换ddr，打包成loader
./make.sh --tpl --spl        // ⽤tpl、spl替换ddr、miniloader，打包成loader
./make.sh --spl-new          // ./make.sh --spl 命令只打包但不编译，此命令会重新编译再打包。
```

Funktionieren die neuen Befehle, ist make.sh die neue Skriptversion.

## 4 Systemmodule

### 4.1 AArch32

Ein 64-Bit-ARMv8-Prozessor kann aus AArch64 in den zu ARMv7 kompatiblen AArch32-Modus wechseln; der Code muss dafür als 32-Bit-Code übersetzt werden. Mit folgendem Makro lässt sich der aktuelle AArch32-Modus von ARMv8 erkennen:

```text
CONFIG_ARM64_BOOT_AARCH32=y
```

### 4.2 ANDROID AB

Bei A/B System gibt es zwei Kopien der Systemfirmware, slot-a und slot-b. Das System kann aus beiden Slots starten; schlägt einer fehl, kann der andere verwendet werden. Updates lassen sich direkt in den anderen Slot kopieren, ohne in einen Systemaktualisierungsmodus zu wechseln. Einzelheiten zu Prinzip und Ablauf stehen im Kapitel über weiterführende Prinzipien. Auf RK-Plattformen unterstützen pre-loader und U-Boot A/B-Systeme.

#### 4.2.1 Konfigurationsoptionen

A/B System setzt LIBAVB voraus:

```text
// A/B依赖的库
CONFIG_AVB_LIBAVB=y
CONFIG_AVB_LIBAVB_AB=y
CONFIG_AVB_LIBAVB_ATX=y
CONFIG_AVB_LIBAVB_USER=y
CONFIG_RK_AVB_LIBAVB_USER=y
// 使能A/B功能
CONFIG_ANDROID_AB=y
```

#### 4.2.2 Partitionstabelle

Die Partitionstabelle eines A/B-Systems verlangt die Suffixe _a und _b für alle A/B-Partitionen. Beispiel für parameter.txt:

```text
FIRMWARE_VER:8.1
MACHINE_MODEL:RK3326
MACHINE_ID:007
MANUFACTURER: RK3326
MAGIC: 0x5041524B
ATAG: 0x00200800
MACHINE: 3326
CHECK_MASK: 0x80
PWR_HLD: 0,0,A,0,1
TYPE: GPT
CMDLINE:
mtdparts=rk29xxnand:0x00002000@0x00004000(uboot_a),0x00002000@0x00006000(uboot_b),0x00002000
@0x00008000(trust_a),0x00002000@0x0000a000(trust_b),0x00001000@0x0000c000(misc),0x00001000@0
x0000d000(vbmeta_a),0x00001000@0x0000e000(vbmeta_b),0x00020000@0x0000e000(boot_a),0x00020000
@0x0002e000(boot_b),0x00100000@0x0004e000(system_a),0x00300000@0x0032e000(system_b),0x001000
00@0x0062e000(vendor_a),0x00100000@0x0072e000(vendor_b),0x00002000@0x0082e000(oem_a),0x00002
000@0x00830000(oem_b),0x0010000@0x00832000(factory),0x00008000@0x842000(factory_bootloader),
0x00080000@0x008ca000(oem),-@0x0094a000(userdata)
```

#### 4.2.3 Hinweise

Bei älterem U-Boot musste nach Aktivierung von A/B der an part_get_info_by_name() übergebene Name eines A/B-Partitionszugriffs ein Slot-Suffix enthalten, beispielsweise "boot_a" oder "boot_b". Das erforderte zusätzlichen Code: aktuellen Slot ermitteln und Zeichenketten zum Partitionsnamen zusammensetzen. Nach dem folgenden Commit ist das Suffix optional; das Framework erkennt den aktuellen Slot automatisch. Im Beispiel genügt somit "boot".

```text
commit c6666740ee3b51c3e102bfbaf1ab95b78df29246
Author: Joseph Chen <chenjh@rock-chips.com>
Date:   Thu Oct 24 15:48:46 2019 +0800

    common: android/rkimg: remove/clean android a/b (slot) code

    - the partition disk layer takes over the responsibility of slot suffix
      appending, we remove relative code to make file clean;
    - put android a/b code together and name them to be eary understood,
      this makes file esay to read.

    Change-Id: Id8c838da682ce6098bd7192d7d7c64269f4e86ba
    Signed-off-by: Joseph Chen <chenjh@rock-chips.com>
```

### 4.3 ANDROID BCB

BCB (Bootloader Control Block) ist ein Android-Mechanismus zur Kommunikation mit dem Bootloader und Steuerung des Systemstarts. Die Datenstruktur liegt in der Partition misc am Offset 16KB oder 0. Struktur:

```text
struct android_bootloader_message {
    char command[32];
    char status[32];
    char recovery[768];

    /* The 'recovery' field used to be 1024 bytes.  It has only ever
     * been used to store the recovery command line, so 768 bytes
     * should be plenty.  We carve off the last 256 bytes to store the
     * stage string (for multistage packages) and possible future
     * expansion. */
    char stage[32];

    /* The 'reserved' field used to be 224 bytes when it was initially
     * carved off from the 1024-byte recovery field. Bump it up to
     * 1184-byte so that the entire bootloader_message struct rounds up
     * to 2048-byte. */
    char reserved[1184];
};
```

command: Bootbefehl; derzeit werden die folgenden drei unterstützt:

| Parameter | Funktion |
| --- | --- |
| bootonce-bootloader | Start in U-Boot fastboot |
| boot-recovery | Start in recovery |
| boot-fastboot | Start in recovery fastboot (fastbootd) |

recovery: zusätzliche Befehle für recovery mode. Der Anfang lautet "recovery\n"; danach können mehrere Parameter folgen, jeweils mit "--" am Anfang und "\n" am Ende, zum Beispiel: "recovery\n--wipe_ab\n--wipe_package_size=345\n--reason=wipePackage\n".

| Parameter | Funktion |
| --- | --- |
| update_package | OTA-Aktualisierung |
| retry_count | Anzahl der Recovery-Aktualisierungsversuche; nach Stromausfall anhand dieses Wertes erneut recovery starten |
| wipe_data | Benutzerdaten und Cache löschen, dann neu starten |
| wipe_cache | Cache, nicht Benutzerdaten, löschen und neu starten |
| show_text | Recovery-Textmenü anzeigen; von einigen Bootloadern verwendet |
| sideload |  |
| sideload_auto_reboot | Nur im user-debug-Build: Gerät ohne Warten neu starten |
| just_exit | Nichts ausführen, beenden und neu starten |
| locale | Gebietsschema im Cache speichern; recovery lädt es beim Neustart |
| shutdown_after | shutdown zurückgeben |
| wipe_all | Gesamte userdata-Partition löschen |
| wipe_ab | Aktuelles A/B-Gerät und alle Partitionen in RECOVERY_WIPE sicher löschen |
| wipe_package_size | Größe des Löschpakets |
| prompt_and_wipe_data | Auf beschädigte Daten hinweisen; mit Zustimmung Benutzerdaten und Cache löschen und neu starten |
| fw_update | Firmware-Aktualisierung per SD-Karte |
| factory_mode | Werksmodus für Gerätetests, etwa PCBA |
| pcba_test | PCBA-Test starten |
| resize_partition | Partitionsgrößen neu festlegen; Unterstützung dynamischer Android-Q-Partitionen |
| rk_fwupdate | RK-SD/USB-Firmwareaktualisierung wählen, nur für U-Boot |

In der U-Boot-Phase werden diese Parameter normalerweise nicht benötigt; sie dienen hier als Hintergrundinformation.

### 4.4 AVB Secure Boot

AVB (Android Verified Boot) ist ein von Google entwickeltes Verfahren zur Prüfung von Firmware, insbesondere von boot, system und anderen Images. Rockchip Secure Boot greift auf Prüfverfahren aus Kommunikationssystemen sowie AVB zurück und implementiert damit eine vollständige Secure-Boot-Prüfkette.

#### 4.4.1 Feature

- Sicherheitsprüfung.
- Integritätsprüfung.
- Rollback-Schutz.
- Unterstützung für persistent partition.
- Unterstützung für chained partitions: Der private Schlüssel kann dem Signaturschlüssel von boot und system entsprechen oder vom OEM selbst verwaltet werden; eine Signatur durch PRK ist jedoch erforderlich.

#### 4.4.2 Konfiguration

AVB benötigt Unterstützung durch trust:

```text
CONFIG_OPTEE_CLIENT=y
CONFIG_OPTEE_V1=y
CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION=y  // 安全数据存储到security分区
```

CONFIG_OPTEE_V1: Plattformen 312x, 322x, 3288, 3228H, 3368, 3399.

CONFIG_OPTEE_V2: Plattformen 3326, 3308.

CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION nur aktivieren, wenn RPMB der eMMC nicht nutzbar ist; standardmäßig deaktiviert. AVB-Konfiguration aktivieren:

```text
CONFIG_AVB_LIBAVB=y
CONFIG_AVB_LIBAVB_AB=y
CONFIG_AVB_LIBAVB_ATX=y
CONFIG_AVB_LIBAVB_USER=y
CONFIG_RK_AVB_LIBAVB_USER=y
// 上⾯⼏个为必选，下⾯选择为⽀持 AVB 与 A/B 特性，两个特性可以分开使⽤。
CONFIG_ANDROID_AB=y //这个⽀持 A/B
CONFIG_ANDROID_AVB=y //这个⽀持 AVB
// 下⾯宏为仅有 efuse 的平台使⽤
CONFIG_ROCKCHIP_PRELOADER_PUB_KEY=y
// 下⾯宏需要严格unlock校验时候打开
CONFIG_RK_AVB_LIBAVB_ENABLE_ATH_UNLOCK=y
// 安全校验开启
CONFIG_AVB_VBMETA_PUBLIC_KEY_VALIDATE=y
// 如果需要cpuid作为challenge number，开启以下宏
CONFIG_MISC=y
CONFIG_ROCKCHIP_EFUSE=y
CONFIG_ROCKCHIP_OTP=y
```

#### 4.4.3 Referenzen

Weitere Prinzipien und Einstellungen des umfangreichen Themas AVB stehen im Kapitel über weiterführende Prinzipien.

### 4.5 Cmdline

cmdline ist ein wichtiger Weg, Parameter wie Bootmedium und Gerätezustand von U-Boot an den Kernel zu übergeben. Die Parameter stammen aus mehreren Quellen; U-Boot führt sie zusammen, filtert Duplikate und übergibt sie an den Kernel. In U-Boot liegt cmdline in der Umgebungsvariablen bootargs. Die Übergabe erfolgt letztlich durch Änderung von /chosen/bootargs im Kernel-DTB.

#### 4.5.1 Datenquellen

Datei parameter.txt: Bei einer Partitionstabelle im RK-Format kann parameter.txt cmdline-Daten enthalten, beispielsweise:

```text
  CMDLINE: console=ttyFIQ0 androidboot.baseband=N/A androidboot.selinux=permissive
androidboot.hardware=rk30board androidboot.console=ttyFIQ0 init=/init
mtdparts=rk29xxnand:0x00002000@0x00002000(uboot),0x00002000@0x00004000(trust),
```

Bei einer GPT-Partitionstabelle bleiben cmdline-Daten in parameter.txt wirkungslos. /chosen/bootargs im Kernel-DTS, beispielsweise:

```text
chosen {
    bootargs = "earlyprintk=uart8250,mmio32,0xff30000 swiotlb=1 console=ttyFIQ0
                androidboot.baseband=N/A androidboot.veritymode=enforcing
                androidboot.hardware=rk30board androidboot.console=ttyFIQ0
                init=/init kpti=0";
};
```

U-Boot ergänzt cmdline abhängig vom aktuellen Laufzeitzustand dynamisch, beispielsweise:

```text
storagemedia=emmc androidboot.mode=emmc ......
```

Der Firmware-Header von boot/recovery.img enthält normalerweise ebenfalls ein cmdline-Feld.

#### 4.5.2 Bedeutung der Daten

Nachfolgend die häufigen cmdline-Parameter der RK-Plattformen. Weitere Informationen: Documentation/admin-guide/kernel-parameters.txt.

- sdfwupdate: Kennzeichnung einer SD-Updatekarte; vom recovery-Programm benötigt.
- root=PARTUUID: UUID der rootfs-(system-)Partition; nur bei GPT unterstützt.

- skip_initramfs: Der Kernel verwendet die Ramdisk aus rootfs (system), nicht die von U-Boot geladene.
- storagemedia: Typ des Bootmediums.
- console: Konfiguration der Kernel-Ausgabeschnittstelle.
- earlycon: serielle Schnittstelle und Konfiguration vor Erstellung des UART-Knotens.
- loop.max_part: Anzahl der von jedem loop-Gerät unterstützten Partitionen.
- rootwait: Auf die Verfügbarkeit des Dateisystems warten, etwa auf abgeschlossene eMMC-Initialisierung. Ohne root_wait kann das Einhängen von rootfs fehlschlagen; der Parameter erlaubt das Warten auf den Treiber, anschließend das Kopieren von rootfs aus dem Speicher und dessen Einhängen.
- ro/rw: rootfs schreibgeschützt / les- und schreibbar einhängen.
- firmware_calss.path: Treiberpfad, etwa für Wi-Fi, BT und GPU; Schreibweise aus der Vorlage beibehalten.
- dm="lroot none 0, 0 4096 linear 98:3 0, 4096 4096 linear 98:32" root=/dev/dm-0: Start mit einem les- und schreibbaren dm-linear-Ziel von 8192 Sektoren, verteilt auf zwei durch major:minor bezeichnete Blockgeräte. Nach dem Start benennt udev das Ziel regelabhängig in /dev/mapper/lroot um. Es wurde keine UUID zugewiesen. Quelle: https://android.googlesource.com/kernel/common/+/android-3.18/Documentation/device-mapper/boot.txt
- androidboot.slot_suffix: Kernel-Bootslot im A/B-System.
- androidboot.serialno: Seriennummer für Kernel und höhere Schichten, beispielsweise adb.
- androidboot.verifiedbootstate: Von Android benötigter Zustand der U-Boot-Firmwareprüfung; drei Zustände:

1. green: Zustand LOCKED; der Prüfschlüssel wurde nicht vom Endbenutzer gesetzt.

2. yellow: Zustand LOCKED; der Prüfschlüssel wurde vom Endbenutzer gesetzt.

3. orange: Zustand UNLOCKED.

- androidboot.hardware: Bootgerät, etwa rk30board.
- androidboot.verifymode: tatsächlicher Modus/Zustand der Partitionsprüfung (Firmwareintegrität).
- androidboot.selinux: SELinux ist ein MAC-Sicherheitssystem (Mandatory Access Control) auf Grundlage des domain-type-Modells; drei Modi:

1. enforcing: SELinux ist aktiv und beschränkt domain/type-Zugriffe tatsächlich.

2. permissive: SELinux ist aktiv, gibt aber nur Warnungen aus, ohne domain/type-Zugriffe zu beschränken; für SELinux-Debugging geeignet.

3. disabled: SELinux ist abgeschaltet.

androidboot.mode: Android-Startmodus, normal oder charger.

1. normal: regulärer Start.

2. charger: Start des ausgeschalteten Geräts beim Anschluss einer Stromversorgung. U-Boot erkennt den Ladevorgang und setzt androidboot.mode=charger in bootargs.

- androidboot.wificountrycode: Wi-Fi-Ländercode, etwa US, CN.
- androidboot.baseband: Modemkonfiguration; auf RK nicht vorhanden, Wert N/A.
- androidboot.console: Android-Ausgabeport.
- androidboot.vbmeta.device=PARTUUID: Speicherposition von vbmeta.
- androidboot.vbmeta.hash_alg: Hashalgorithmus für vbmeta, beispielsweise sha512.
- androidboot.vbmeta.size: Größe von vbmeta.

- androidboot.vbmeta.digest: übergibt dem Kernel den vbmeta-Digest. Nach dem Laden von vbmeta berechnet der Kernel dessen Digest und vergleicht ihn mit diesem Wert.
- androidboot.vbmeta.device_state: lock/unlock-Systemzustand für AVB 2.0.

### 4.6 DFU-Firmwareupdate

DFU (Device Firmware Update) aktualisiert Gerätefirmware. Unterstützte Plattformen sind im Kapitel zu Plattformdefinitionen aufgeführt. Für DFU sind folgende Makros zu aktivieren:

```text
CONFIG_CMD_DFU=y
CONFIG_USB_FUNCTION_DFU=y
```

Abhängig vom Speichermedium folgende Optionen wählen:

```text
CONFIG_DFU_MMC
CONFIG_DFU_MTD
CONFIG_DFU_NAND
CONFIG_DFU_RAM
CONFIG_DFU_SF
```

Plattformen mit DFU bieten normalerweise eine eigene config-Datei. RV1126-Firmware mit DFU wird beispielsweise mit folgendem Befehl gebaut:

```text
./make.sh rv1126-dfu
```

Firmware auf das Board schreiben, den OTG-Anschluss mit dem PC verbinden und in der U-Boot-Befehlszeile ausführen:

```text
dfu 0 $devtype $devnum
```

devtype kann mmc oder mtd sein. Auf dem PC erscheint ein USB download gadget. Den Treiber mit Zadig ersetzen; das Ergebnis zeigt der Screenshot:

![Abbildung 2: englische Quelle, Seite 56](/docs/rockchip-uboot-nextdev/assets/en-p056-figure-01.png)

*Abbildung 2: englische Quelle, Seite 56*

Das Hostprogramm in der Windows-Befehlszeile ausführen:

```text
./dfu-util.exe -l
```

Das Gerät überträgt die in include/configs/evb_rv1126.h definierte Partitionstabelle:

```text
F:\Prj\20210901-Hisense-AB\dfu-util-0.9-win64>dfu-util.exe -l
dfu-util 0.9

Copyright 2005-2009 Weston Schmidt, Harald Welte and OpenMoko Inc.
Copyright 2010-2016 Tormod Volden and Stefan Schmidt
This program is Free Software and has ABSOLUTELY NO WARRANTY
Please report bugs to http://sourceforge.net/p/dfu-util/tickets/

Found DFU: [2207:0107] ver=0223, devnum=16, cfg=1, intf=0, path="1-12", alt=5,
name="userdata", serial="UNKNOWN"
Found DFU: [2207:0107] ver=0223, devnum=16, cfg=1, intf=0, path="1-12", alt=4,
name="rootfs", serial="UNKNOWN"
Found DFU: [2207:0107] ver=0223, devnum=16, cfg=1, intf=0, path="1-12", alt=3, name="boot",
serial="UNKNOWN"
Found DFU: [2207:0107] ver=0223, devnum=16, cfg=1, intf=0, path="1-12", alt=2, name="uboot",
serial="UNKNOWN"
Found DFU: [2207:0107] ver=0223, devnum=16, cfg=1, intf=0, path="1-12", alt=1,
name="loader", serial="UNKNOWN"
Found DFU: [2207:0107] ver=0223, devnum=16, cfg=1, intf=0, path="1-12", alt=0, name="gpt",
serial="UNKNOWN"
```

Zur Dateiübertragung auf das Board in Windows folgenden Befehlsaufbau verwenden: dfu-util.exe VID:PID -a (Partitionsname) -D(Dateiname) -R(Neustartoption):

```text
F:\Prj\20210901-Hisense-AB\dfu-util-0.9-win64>dfu-util.exe -d 2207:0107 -a system_b -D
rootfs.img -R
```

Protokoll einer erfolgreichen Programmierung:

```text
dfu-util 0.9

Copyright 2005-2009 Weston Schmidt, Harald Welte and OpenMoko Inc.
Copyright 2010-2016 Tormod Volden and Stefan Schmidt
This program is Free Software and has ABSOLUTELY NO WARRANTY
Please report bugs to http://sourceforge.net/p/dfu-util/tickets/

Invalid DFU suffix signature
A valid DFU suffix will be required in a future dfu-util release!!!
Opening DFU capable USB device...
ID 2207:0107
Run-time device DFU version 0110
Claiming USB DFU Interface...
Setting Alternate Setting #8 ...
Determining device status: state = dfuIDLE, status = 0
dfuIDLE, continuing
DFU mode device DFU version 0110
Device returned transfer size 4096
Copying data from PC to DFU device
Download        [=========================] 100%     49938432 bytes
Download done.
state(7) = dfuMANIFEST, status(0) = No error condition is present
state(2) = dfuIDLE, status(0) = No error condition is present
Done!
can't detach
Resetting USB to switch back to runtime mode
```

Für andere Partitionen den Namen nach -a und den Dateinamen nach -D ersetzen. Mit -R wird das Board nach dem Schreiben neu gestartet.

### 4.7 DTBO/DTO

Zum Verständnis zunächst die Begriffe DTB, DTBO, DTC, DTO, DTS und FDT im Anhang lesen. DTS beschreibt FDT; DTC übersetzt DTS in DTB/DTBO; DTO vereinigt DTB und DTBO zu einem neuen DTB. Häufig wird auch die DTO-Operation als DTBO bezeichnet; hier wird unterschieden: DTO ist die Operation, DTBO der zusätzliche DTB für das Overlay. Weitere Informationen: https://source.android.google.cn/devices/architecture/dto.

#### 4.7.1 Funktionsprinzip

DTO (Device Tree Overlay) wurde nach Android P eingeführt und muss aktiviert werden. Ein zusätzlicher Device-Tree-Blob (DTBO) wird auf den Hauptbaum gelegt. So lässt sich der SoC-Baum pflegen und dynamisch um gerätespezifische Bäume, Knoten und Eigenschaftsänderungen ergänzen. Der Hauptbaum *.dtb stammt üblicherweise vom Vendor, *.dtbo von ODM/OEM. Der Bootloader vereinigt beide und übergibt das Ergebnis an den Kernel:

![Abbildung 3: englische Quelle, Seite 58](/docs/rockchip-uboot-nextdev/assets/en-p058-figure-01.png)

*Abbildung 3: englische Quelle, Seite 58*

Bildquelle: https://source.android.google.cn/devices/architecture/dto. Die Kompilierung von DTB/DTBO für DTO unterscheidet sich von normaler DTB-Kompilierung. Beim Übersetzen von .dts mit dtc ist -@ erforderlich, um dem .dtbo einen _symbols_-Knoten hinzuzufügen. Dieser listet alle markierten Knoten als Referenz für die DTO-Bibliothek auf. Beispiele:

1. Beispiel zum Übersetzen der Haupt-.dts:

```text
dtc -@ -O dtb -o my_main_dt.dtb my_main_dt.dts
```

2. Beispiel zum Übersetzen der Overlay-.dts:

```text
dtc -@ -O dtb -o my_overlay_dt.dtbo my_overlay_dt.dts
```

#### 4.7.2 DTO aktivieren

1. Konfiguration aktivieren:

```text
CONFIG_CMD_DTIMG=y
CONFIG_OF_LIBFDT_OVERLAY=y
```

2. board_select_fdt_index() implementieren. Diese __weak-Funktion kann für die jeweiligen Anforderungen überschrieben werden. Sie wählt den für DTO verwendeten DTBO aus mehreren aus und liefert einen Index ab 0; die weak-Standardimplementierung liefert 0.

```text
/*
* Default return index 0.
*/
__weak int board_select_fdt_index(ulong dt_table_hdr)
{
    /*
     * User can use "dt_for_each_entry(entry, hdr, idx)" to iterate
     * over all dt entry of DT image and pick up which they want.
     *
     * Example:
     *  struct dt_table_entry *entry;
     *  int index;
     *
     *  dt_for_each_entry(entry, dt_table_hdr, index) {
     *
     *      .... (use entry)
     *  }
     *
     *  return index;
     */
    return 0;
}
```

#### 4.7.3 DTO-Ergebnis

1. Nach DTO erscheint das Ergebnis in den Startmeldungen von U-Boot:

```text
// 成功时的打印
ANDROID: fdt overlay OK

// 失败时的打印
ANDROID: fdt overlay failed, ret=-19
```

Fehler entstehen meist durch inkompatible Inhalte von Haupt- und Zusatz-Blob. Syntax ihrer Erzeugung und Kompatibilitätsanforderungen müssen daher bekannt sein.

2. Nach erfolgreichem DTO wird cmdline des Kernels um folgende Angabe zum verwendeten DTBO ergänzt:

```text
androidboot.dtbo_idx=1  // idx从0开始，这⾥表⽰选取idx=1的那份DTBO进⾏DTO操作
```

3. Nach erfolgreichem DTO den DTB mit fdt in der U-Boot-Befehlszeile prüfen und die Änderungen kontrollieren.

### 4.8 ENV

#### 4.8.1 Framework-Unterstützung

ENV ist ein wichtiger Datenverwaltungsmechanismus in U-Boot. Eine Hash-Tabelle ordnet Schlüssel und Werte zu und unterstützt Anlegen, Löschen, Ändern und Abfragen. Schlüssel und Daten werden als Umgebungsvariablen bezeichnet. U-Boot unterstützt ENV-Speicherung auf NOWHERE/eMMC/FLASH/EEPROM/NAND/SPI_FLASH/UBI und weiteren Medien. Konfiguration:

```text
// 默认配置：ENV保存在内存
CONFIG_ENV_IS_NOWHERE

// ENV保存在各种存储介质
CONFIG_ENV_IS_IN_MMC
CONFIG_ENV_IS_IN_NAND
CONFIG_ENV_IS_IN_EEPROM
CONFIG_ENV_IS_IN_FAT
CONFIG_ENV_IS_IN_FLASH
CONFIG_ENV_IS_IN_NVRAM
CONFIG_ENV_IS_IN_ONENAND
CONFIG_ENV_IS_IN_REMOTE
CONFIG_ENV_IS_IN_SPI_FLASH
CONFIG_ENV_IS_IN_UBI

// 任意已经接⼊到BLK框架层的存储介质（mmc除外），RK平台推荐使⽤ ！
CONFIG_ENV_IS_IN_BLK_DEV
```

Framework-Code:

```text
./env/nowhere.c
./env/env_blk.c
./env/mmc.c
./env/nand.c
./env/eeprom.c
./env/embedded.c
./env/ext4.c
./env/fat.c
./env/flash.c
......
```

#### 4.8.2 Schnittstellen

```text
// 获取环境变量
char *env_get(const char *varname);
ulong env_get_ulong(const char *name, int base, ulong default_val);
ulong env_get_hex(const char *varname, ulong default_val);

// 修改或创建环境变量，value为NULL时等同于删除操作
int env_set(const char *varname, const char *value);
int env_set_ulong(const char *varname, ulong value);
int env_set_hex(const char *varname, ulong value);

// 把保存在存储介质上的ENV信息全部加载出来
int env_load(void);

// 把当前所有ENV信息保存到存储介质上
int env_save(void);
```

env_load(): kein eigener Aufruf erforderlich; U-Boot ruft die Funktion an der passenden Stelle des Startablaufs auf.

env_save(): bei Bedarf vom Anwender aufzurufen; speichert sämtliche ENV-Daten auf dem durch CONFIG_ENV_IS_NOWHERE_XXX bezeichneten Medium (Schreibweise der Vorlage).

#### 4.8.3 Erweiterte Schnittstellen

RK bietet zwei übergeordnete ENV-Schnittstellen zum Anlegen, Ergänzen und Ersetzen. Sie dienen vor allem bootargs, sind aber auch für andere Variablen geeignet.

```text
/**
 * env_update() - update sub value of an environment variable
 *
 * This add/append/replace the sub value of an environment variable.
 *
 * @varname: Variable to adjust
 * @valude: Value to add/append/replace
 * @return 0 if OK, 1 on error
 */
int env_update(const char *varname, const char *varvalue);

/**
 * env_update_filter() - update sub value of an environment variable but
 * ignore some key word
 *
 * This add/append/replace/igore the sub value of an environment variable.
 *
 * @varname: Variable to adjust
 * @valude: Value to add/append/replace
 * @ignore: Value to be ignored that in varvalue
 * @return 0 if OK, 1 on error
 */
int env_update_filter(const char *varname, const char *varvalue, const char *ignore);
```

1. Regeln für env_update(): Fehlt varname, werden varname und varvalue angelegt; existiert varname, aber nicht varvalue, wird varvalue ergänzt; existieren beide, ersetzt das aktuelle varvalue den bisherigen Wert. Beispielsweise wird storagemedia=emmc bei Übergabe von storagemedia=rknand zu storagemedia=rknand.

2. env_update_filter() erweitert env_update(): Beim ENV-Update wird ein angegebenes Schlüsselwort aus varvalue entfernt.

3. Beide Funktionen zerlegen ENV anhand von Leerzeichen und „=“. Verarbeitungseinheit ist ein einzelnes Wort wie sdfwupdate oder key=value wie storagemedia=emmc, init=/init, androidboot.console=ttyFIQ0. Eine lange Zeichenkette wie „console=ttyFIQ0 androidboot.baseband=N/A androidboot.selinux=permissive“ lässt sich nicht als eine Einheit bearbeiten.

#### 4.8.4 Speicherposition

env_save() speichert ENV auf dem Medium. Position und Größe von ENV auf RK-Plattformen sind wie folgt definiert:

```text
if ARCH_ROCKCHIP
config ENV_OFFSET
    hex
    depends on !ENV_IS_IN_UBI
    depends on !ENV_IS_NOWHERE
    default 0x3f8000
    help
      Offset from the start of the device (or partition)

config ENV_SIZE
    hex
    default 0x8000
    help
      Size of the environment storage area
endif
```

Änderungen an ENV_OFFSET und ENV_SIZE werden normalerweise nicht empfohlen.

#### 4.8.5 Allgemeine Optionen

Übliche Medien sind eMMC, sdmmc, Nandflash und Norflash. Die nativen NAND/NOR-ENV-Treiber von U-Boot verwenden MTD, alle unterstützten RK-Speicher dagegen BLK; diese Treiber sind deshalb nicht nutzbar. RK stellt CONFIG_ENV_IS_IN_BLK_DEV für BLK-Medien bereit. Für eMMC/sdmmc weiterhin CONFIG_ENV_IS_IN_MMC wählen, für NAND/NOR CONFIG_ENV_IS_IN_BLK_DEV. Vor der Verwendung die Kconfig-Definition von CONFIG_ENV_IS_IN_BLK_DEV lesen.

```text
// 已经默认被指定好，不需要修改
CONFIG_ENV_OFFSET
CONFIG_ENV_SIZE

// 通常不需要使⽤到
CONFIG_ENV_OFFSET_REDUND (optional)
CONFIG_ENV_SIZE_REDUND (optional)
CONFIG_SYS_MMC_ENV_PART (optional)
```

Bei jeder CONFIG_ENV_IS_IN_XXX-Auswahl zunächst die Kconfig-Beschreibung einschließlich Unteroptionen lesen.

#### 4.8.6 Werkzeug fw_printenv

fw_printenv ist ein U-Boot-Werkzeug zum Lesen und Ändern von ENV aus Linux. Der ENV-Bereich muss in einer für den Kernel sichtbaren Partition liegen, vorzugsweise einer eigenen; der Zugriff erfolgt über den Speicherknoten im Kernel-sys. Werkzeug erzeugen:

```text
./make.sh env
```

Nach Ausführung des Befehls erhält man:

```text
./tools/env/fw_printenv      // env读写⼯具
./tools/env/fw_env.config    // env配置⽂件
./tools/env/README           // env读写⼯具说明⽂档
```

Die Verwendung ist in README beschrieben.

#### 4.8.7 ENVF

Die Funktion gilt nur für SDK-Firmware mit env.img, hauptsächlich IPC-Produkte. Ohne env.img diesen Abschnitt überspringen. Natives ENV speichert sämtliche Variablen in einem Bereich, der von außen beliebig verändert werden kann. Falsche Änderungen an Systemvariablen können den Start verhindern oder Angriffe ermöglichen, etwa durch Löschen von bootcmd oder Umleitung auf einen bösartigen Startablauf. ENV Fragment trennt U-Boot-Systemvariablen von externen Benutzervariablen. Dazu eine eigene env-Partition und eine Positivliste in U-Boot definieren. Nur gelistete Variablen dürfen über diese Partition importiert, exportiert und geändert werden.

ENVF-Ablauf: env.txt mit gewünschtem Inhalt erstellen; mit mkenvimage env.img erzeugen und an Speicheradresse 0 schreiben. Beim Start lesen Loader und U-Boot env.img und importieren die durch CONFIG_ENVF_LIST erlaubten Variablen. Unterschiedliche Speichertypen erfordern unterschiedliche env.img-Größen. Konfiguration:

```text
CONFIG_ENVF
CONFIG_SPL_ENVF
CONFIG_ENVF_LIST="blkdevparts mtdparts sys_bootargs app reserved"

// eMMC：
// 指定 Primary env.img 的存储地址。单位：字节。
CONFIG_ENV_OFFSET=0x0
// 指定 Backup env.img 的存储地址，⽆备份时跟CONFIG_ENV_OFFSET保持⼀致。单位：字节。
CONFIG_ENV_OFFSET_REDUND=0x0
// Primary 和 Backup env.img 的⼤⼩。单位：字节。
CONFIG_ENV_SIZE=0x8000

// spi-nor：⽤法同上。
CONFIG_ENV_NOR_OFFSET=0x0
CONFIG_ENV_NOR_OFFSET_REDUND=0x0
CONFIG_ENV_NOR_SIZE=0x10000

// spi-nand/slc-nand：⽤法同上。
CONFIG_ENV_NAND_OFFSET=0x0
CONFIG_ENV_NAND_OFFSET_REDUND=0x0
CONFIG_ENV_NAND_SIZE=0x40000
```

Code:

```text
./env/envf.c
```

Werkzeug:

```text
// 默认参与U-Boot的编译并⽣成 tools/mkenvimage，⽤于打包env.img
./tools/mkenvimage.c
```

Beispiel eines Entwicklungsablaufs auf dem PC:

1. env.txt erstellen:

```text
// 必须定义系统分区表，否则⽆法正常启动。例如：
blkdevparts=mmcblk0:4M@8M(uboot),4M(trust),32M(boot),32M(recovery),32M(backup),-(rootfs)
sys_bootargs=rootwait earlycon=uart8250,mmio32,0xff570000 console=ttyFIQ0
......
```

Format: (1) Paare key=value; (2) keine Leerzeichen um „=“, keine einfachen/doppelten Anführungszeichen; (3) Zeilenumbruch als Ende jedes Paars. sys_bootargs entspricht bootargs im Kernel-DTS. Ist es angegeben, legt U-Boot sys_bootargs über die DTS-bootargs; bei gleichen Parametern hat sys_bootargs Vorrang. Für Partitionstabellen werden die Kernel-Standardformate mtdparts und blkdevparts unterstützt; eines davon auswählen. Beispiele je Speichertyp:

```text
// eMMC：
blkdevparts=mmcblk0:32K(env),512K@32K(idblock),256K(uboot),32M(boot),2G(rootfs),1G(oem),2G(u
serdata),-(media)

// spi-nor：
mtdparts=sfc_nor:64K(env),128K@64K(idblock),128K(uboot),2M(boot),4M(rootfs),6M(oem),-
(userdata)

// spi-nand/slc-nand：
mtdparts=rk-
nand:256K(env),256K@256K(idblock),256K(uboot),8M(boot),64M(rootfs),32M(userdata),-(media)
```

2. env.img erzeugen:

```text
## Chapter-4 eMMC:
./tools/mkenvimage -s 0x8000 -p 0x0 -o env.img env.txt

## Chapter-4 spi-nor:
./tools/mkenvimage -s 0x10000 -p 0x0 -o env.img env.txt

#spi-nand/slc-nand：
./tools/mkenvimage -s 0x40000 -p 0x0 -o env.img env.txt
```

3. env.img an Speicheradresse 0 schreiben. Beispiel für die U-Boot-Seite:

1. env.img aktivieren und konfigurieren:

```text
// 使能ENVF
CONFIG_ENVF=y
CONFIG_SPL_ENVF=y
CONFIG_ENVF_LIST="blkdevparts mtdparts sys_bootargs app reserved"

// eMMC：
CONFIG_ENV_SIZE=0x8000
CONFIG_ENV_OFFSET=0x0
CONFIG_ENV_OFFSET_REDUND=0x0

// spi nor:
CONFIG_ENV_NOR_OFFSET=0x0
CONFIG_ENV_NOR_OFFSET_REDUND=0x0
CONFIG_ENV_NOR_SIZE=0x10000

// spi nand/slc nand：
CONFIG_ENV_NAND_OFFSET=0x0
CONFIG_ENV_NAND_OFFSET_REDUND=0x0
CONFIG_ENV_NAND_SIZE=0x40000
```

2. uboot.img neu bauen und programmieren.

3. Startmeldungen:

```text
......
dwmmc@ffc50000: 0, dwmmc@ffc60000: 1
Bootdev(atags): mmc 0
MMC0: HS200, 200Mhz
// 有如下打印
ENVF: Primary 0x00000000 - 0x00008000
ENVF: OK
PartType: ENV
DM: v1
boot mode: normal
FIT: no signed, no conf required
DTB: rk-kernel.dtb
......
```

4. ENV mit folgendem U-Boot-Befehl oder im Code mit env_save() speichern.

```text
=> env save
Saving Environment to env...  // 导出并保存⽩名单⾥的环境变量
```

### 4.9 Fastboot

Fastboot ist ein von Android bereitgestellter Weg zur USB-Kommunikation mit U-Boot, üblicherweise für Geräteinformationen und das Programmieren von Firmware.

#### 4.9.1 Konfigurationsoptionen

```text
// 使能配置
CONFIG_FASTBOOT
CONFIG_FASTBOOT_FLASH
CONFIG_USB_FUNCTION_FASTBOO

// 参数配置
CONFIG_FASTBOOT_BUF_ADDR
CONFIG_FASTBOOT_BUF_SIZE
CONFIG_FASTBOOT_FLASH_MMC_DEV
CONFIG_FASTBOOT_USB_DEV
```

#### 4.9.2 Auslösen

Fastboot verwendet standardmäßig VID/PID von Google adb. Startmöglichkeiten:
- Kernel-Befehlszeile: reboot fastboot.
- U-Boot-Befehlszeile: fastboot usb 0.
- Beim Einschalten ctrl+f gedrückt halten.

#### 4.9.3 Unterstützte Befehle

```text
fastboot flash < partition > [ < filename > ]
fastboot erase < partition >
fastboot getvar < variable > | all
fastboot set_active < slot >
fastboot reboot
fastboot reboot-bootloader
fastboot flashing unlock
fastboot flashing lock
fastboot stage [ < filename > ]
fastboot get_staged [ < filename > ]
fastboot oem fuse at-perm-attr-data
fastboot oem fuse at-perm-attr
fastboot oem at-get-ca-request
fastboot oem at-set-ca-response
fastboot oem at-lock-vboot
fastboot oem at-unlock-vboot
fastboot oem at-disable-unlock-vboot
fastboot oem fuse at-bootloader-vboot-key
fastboot oem format
fastboot oem at-get-vboot-unlock-challenge
fastboot oem at-reset-rollback-index
```

#### 4.9.4 Befehlsdetails

- fastboot flash &lt; partition &gt; [ &lt; filename &gt; ]: Partition schreiben; Beispiel: fastboot flash boot boot.img.
- fastboot erase &lt; partition &gt;: Partition löschen; Beispiel: fastboot erase boot.
- fastboot getvar &lt; variable &gt;: Geräteinformationen abrufen; Beispiel: fastboot getvar version-bootloader.

Parameter &lt; variable &gt;:

```text
version                               /* fastboot 版本 */
version-bootloader                    /* uboot 版本 */
version-baseband
product                               /* 产品信息 */
serialno                              /* 序列号 */
secure                                /* 是否开启安全校验 */
max-download-size                     /* fastboot ⽀持单次传输最⼤字节数 */
logical-block-size                    /* 逻辑块数 */
erase-block-size                      /* 擦除块数 */
partition-type : < partition >        /* 分区类型 */
partition-size : < partition >        /* 分区⼤⼩ */
unlocked                              /* 设备lock状态 */
off-mode-charge
battery-voltage
variant
battery-soc-ok
slot-count                            /* slot 数⽬ */
has-slot: < partition >               /* 查看slot内是否有该分区名 */
current-slot                          /* 当前启动的slot */
slot-suffixes                         /* 当前设备具有的slot,打印出其name */
slot-successful: < _a | _b >          /* 查看分区是否正确校验启动过 */
slot-unbootable: < _a | _b >          /* 查看分区是否被设置为unbootable */
slot-retry-count: < _a | _b >         /* 查看分区的retry-count次数 */
at-attest-dh
at-attest-uuid
at-vboot-state
```

- fastboot getvar all: sämtliche Geräteinformationen.
- fastboot set_active &lt; slot &gt;: Slot für den Neustart setzen; Beispiel: fastboot set_active _a.
- fastboot reboot: regulärer Neustart; Beispiel: fastboot reboot.
- fastboot reboot-bootloader: Neustart in fastboot; Beispiel: fastboot reboot-bootloader.
- fastboot flashing unlock: Gerät zum Programmieren entsperren; Beispiel: fastboot flashing unlock.
- fastboot flashing lock: Programmieren sperren; Beispiel: fastboot flashing lock.
- fastboot stage [ &lt; filename &gt; ]: Daten ab CONFIG_FASTBOOT_BUF_ADDR in den Gerätespeicher laden; Beispiel: fastboot stage permanent_attributes.bin.
- fastboot get_staged [ &lt; filename &gt; ]: Daten vom Gerät abrufen; Beispiel: fastboot get_staged raw_unlock_challenge.bin.
- fastboot oem fuse at-perm-attr: permanent_attributes.bin und Hash programmieren; zuerst fastboot stage permanent_attributes.bin, dann fastboot oem fuse at-perm-attr.
- fastboot oem fuse at-perm-attr-data: nur permanent_attributes.bin in den sicheren RPMB-Speicher schreiben; zuerst fastboot stage permanent_attributes.bin, dann fastboot oem fuse at-perm-attr-data.
- fastboot oem at-get-ca-request
- fastboot oem at-set-ca-response

- fastboot oem at-lock-vboot: Gerät sperren; Beispiel: fastboot oem at-lock-vboot.
- fastboot oem at-unlock-vboot: entsperren, mit authenticated unlock. Beispielablauf: fastboot oem at-get-vboot-unlock-challenge; fastboot get_staged raw_unlock_challenge.bin; ./make_unlock.sh (siehe Beschreibung von make_unlock.sh); fastboot stage unlock_credential.bin; fastboot oem at-unlock-vboot. Siehe how-to-generate-keys-about-avb.md.
- fastboot oem fuse at-bootloader-vboot-key: Hash des Bootloaderschlüssels programmieren; zuerst fastboot stage bootloader-pub-key.bin, dann fastboot oem fuse at-bootloader-vboot-key.
- fastboot oem format: Partitionen anhand von $partitions neu formatieren; Beispiel: fastboot oem format.
- fastboot oem at-get-vboot-unlock-challenge: Unlock-Challenge für authenticated unlock abrufen; Beispiel siehe Punkt 16 fastboot oem at-unlock-vboot der Vorlage.
- fastboot oem at-reset-rollback-index: Rollback-Daten zurücksetzen; Beispiel: fastboot oem at-reset-rollback-index.
- fastboot oem at-disable-unlock-vboot: Befehl fastboot oem at-unlock-vboot deaktivieren; Beispiel: fastboot oem at-disable-unlock-vboot.

### 4.10 FileSystem

#### 4.10.1 Framework-Unterstützung

FAT und EXT2/4 sind verbreitete Dateisysteme. FAT verwendet DOS-(MBR-)Partitionstabellen, beispielsweise auf SD-Karten und USB-Sticks. Beide werden häufig aus U-Boot angesprochen. FAT-Konfiguration:

```text
CONFIG_DOS_PARTITION=y
CONFIG_FS_FAT=y
CONFIG_FAT_WRITE=y
CONFIG_FS_FAT_MAX_CLUSTSIZE=65536
CONFIG_CMD_FAT=y
CONFIG_CMD_FS_GENERIC=y
```

FAT-Befehle:

```text
fatinfo fatload fatls fatsize fatwrite
```

EXT2/4-Konfiguration:

```text
CONFIG_CMD_EXT2=y
CONFIG_CMD_EXT4=y
CONFIG_CMD_FS_GENERIC=y
```

EXT2/4-Befehle:

```text
ext2load ext2ls ext4load ext4ls ext4size
```

#### 4.10.2 Schnittstellen

Header für FAT-Funktionen ./include/fat.h:

```text
int file_fat_detectfs(void);
int fat_exists(const char *filename);
int fat_size(const char *filename, loff_t *size);
int file_fat_read_at(const char *filename, loff_t pos, void *buffer,
             loff_t maxsize, loff_t *actread);
int file_fat_read(const char *filename, void *buffer, int maxsize);
int fat_set_blk_dev(struct blk_desc *rbdd, disk_partition_t *info);
int fat_register_device(struct blk_desc *dev_desc, int part_no);

int file_fat_write(const char *filename, void *buf, loff_t offset, loff_t len,
           loff_t *actwrite);
int fat_read_file(const char *filename, void *buf, loff_t offset, loff_t len,
          loff_t *actread);
int fat_opendir(const char *filename, struct fs_dir_stream **dirsp);
int fat_readdir(struct fs_dir_stream *dirs, struct fs_dirent **dentp);
void fat_closedir(struct fs_dir_stream *dirs);
void fat_close(void);
```

Header für EXT2/4-Funktionen include/ext4fs.h:

```text
struct ext_filesystem *get_fs(void);
int ext4fs_open(const char *filename, loff_t *len);
int ext4fs_read(char *buf, loff_t offset, loff_t len, loff_t *actread);
int ext4fs_mount(unsigned part_length);
void ext4fs_close(void);
void ext4fs_reinit_global(void);
int ext4fs_ls(const char *dirname);
int ext4fs_exists(const char *filename);
int ext4fs_size(const char *filename, loff_t *size);
void ext4fs_free_node(struct ext2fs_node *node, struct ext2fs_node *currroot);
int ext4fs_devread(lbaint_t sector, int byte_offset, int byte_len, char *buf);
void ext4fs_set_blk_dev(struct blk_desc *rbdd, disk_partition_t *info);
long int read_allocated_block(struct ext2_inode *inode, int fileblock);
int ext4fs_probe(struct blk_desc *fs_dev_desc,
         disk_partition_t *fs_partition);
int ext4_read_file(const char *filename, void *buf, loff_t offset, loff_t len,
           loff_t *actread);
int ext4_read_superblock(char *buffer);
int ext4fs_uuid(char *uuid_str);
```

#### 4.10.3 Befehlsbeispiele

```text
// 确认SD卡可识别（如果是U盘则⽤usb命令进⾏识别，设备编号⼀般是：usb 0）
=> mmc dev 1
switch to partitions #0, OK
mmc1 is current device

// 查看信息
=> fatinfo mmc 1
Interface:  MMC
  Device 1: Vendor: Man 000003 Snr e81ec501 Rev: 1.9 Prod: SC16G
  Type: Removable Hard Disk
  Capacity: 15193.5 MB = 14.8 GB (31116288 x 512)
Filesystem: FAT32 "NO NAME    "

// 查看⽂件
=> fatls mmc 1
            System Volume Information/
       23   hello.txt
       23   linux.txt

2 file(s), 1 dir(s)

// 读取hello.txt⽂件的⼤⼩（结果默认被保存到变量filesize中）
=> fatsize mmc 1 hello.txt
=> echo $filesize
0x17

// 读取hello.txt⽂件到0x2000000地址
=> fatload mmc 1 0x2000000 hello.txt
reading hello.txt
23 bytes read in 2 ms (10.7 KiB/s)
// 查看读取的hello.txt内容
=> md.l 0x2000000
02000000: 6c6c6568 65682d6f 2d6f6c6c 6c6c6568    hello-hello-hell
02000010: 65682d6f ff6f6c6c ffffffff ffffffff    o-hello.........

// 新建⽂件：hello-copy.txt。把0x2000000~0x2000017的地址内容写⼊hello-copy.txt。
=> fatwrite mmc 1 0x2000000 hello-copy.txt 0x17
writing hello-copy.txt
23 bytes written
// 看到新⽂件：hello-copy.txt
=> fatls mmc 1
            System Volume Information/
       23   hello.txt
       23   linux.txt
       23   hello-copy.txt

3 file(s), 1 dir(s)
```

ext2/4-Befehle werden ähnlich wie fat verwendet und daher nicht gesondert erläutert.

### 4.11 HW-ID DTB

U-Boot auf RK-Plattformen kann anhand von GPIO- oder ADC-Zuständen unterschiedliche Kernel-DTBs laden. Diese Funktion wird hier HW-ID DTB (Hardware id DTB) genannt.

#### 4.11.1 Entwurfsprinzip

Hardwareversionen und Bauteile wie Display oder Wi-Fi-Modul ändern sich häufig. Eigene Software je Version erschwert die Pflege; HW_ID erlaubt einer Software, mehrere Varianten zu unterstützen. Für jede Variante werden ein DTB und ein eindeutiger ADC/GPIO-Wert bereitgestellt, beispielsweise ein fester ADC-Wert oder GPIO-Pegel. Alle DTBs kommen in ein gemeinsames resource.img. Beim Kernelstart erkennt U-Boot den Hardwarewert, wählt den passenden DTB aus resource.img und übergibt ihn dem Kernel.

#### 4.11.2 Hardware-Referenz

ADC und GPIO werden unterstützt. ADC-Referenzdesign: Auf RK3326-EVB/PX30-EVB sind Spannungsteiler vorgesehen. Unterschiedliche Widerstandsverhältnisse ergeben unterschiedliche ADC-Werte zur Hardwareerkennung:

![Abbildung 4: englische Quelle, Seite 74](/docs/rockchip-uboot-nextdev/assets/en-p074-figure-01.png)

*Abbildung 4: englische Quelle, Seite 74*

Auf der zugehörigen MIPI-Displayplatine ist ein weiterer Pull-down-Widerstand vorgesehen:

![Abbildung 5: englische Quelle, Seite 75](/docs/rockchip-uboot-nextdev/assets/en-p075-figure-01.png)

*Abbildung 5: englische Quelle, Seite 75*

Unterschiedliche MIPI-Displays erhalten unterschiedliche Widerstände und ergeben zusammen mit dem EVB einen eindeutigen ADC-Wert. Berechnung für V1: ADC-Maximum 1024 entspricht ADC_IN0 direkt an 1.8V. Am Display liegt ein 10K-Pull-down; mit dem EVB ergibt sich ADC=1024*10K/(10K + 51K) =167.8. Für GPIO liegt kein Hardware-Referenzdesign vor; es kann selbst entwickelt werden.

#### 4.11.3 DTB-Benennung

Die eindeutigen ADC/GPIO-Werte müssen im DTB-Dateinamen stehen. ADC: Endung .dtb; eine HW_ID-Einheit hat das Format #[controller]_ch[channel]=[adcval]. controller ist der ADC-Knotenname im DTS, channel der Kanal, adcval der Mittelwert mit gültigem Bereich adcval+-30. Jede Einheit verwendet Kleinbuchstaben ohne Leerzeichen; mehrere Einheiten werden durch # getrennt, maximal 10. Beispiele:

```text
rk3326-evb-lp3-v10#saradc_ch2=111#saradc_ch1=810.dtb
rk3326-evb-lp3-v10#_saradc_ch2=569.dtb
```

GPIO: Endung .dtb; eine HW_ID-Einheit hat das Format #gpio[pin]=[level]. pin bezeichnet den GPIO, etwa 0a2 für gpio0a2; level ist der Pegel. Kleinbuchstaben ohne Leerzeichen verwenden; Einheiten durch # trennen, maximal 10. Beispiele:

```text
rk3326-evb-lp3-v10#gpio0a2=0#gpio0c3=1.dtb
```

#### 4.11.4 DTB-Paketierung

scripts/mkmultidtb.py im Kernel-Repository packt mehrere DTBs in ein resource.img. Die gewünschten DTBs in das Dictionary DTBS eintragen und die jeweiligen ADC/GPIO-Einstellungen ergänzen.

```text
...
DTBS = {}
DTBS['PX30-EVB'] = OrderedDict([('rk3326-evb-lp3-v10', '#_saradc_ch0=166'),
                ('px30-evb-ddr3-lvds-v10', '#_saradc_ch0=512')])
...
```

Im Beispiel erzeugt scripts/mkmultidtb.py PX30-EVB ein resource.img mit drei DTBs:

- rk-kernel.dtb: Standard-RK-DTB, nicht im Dictionary dargestellt; wird verwendet, wenn kein DTB passt. Das Skript verwendet den ersten DTB aus DTBS als Standard.
- rk3326-evb-lp3-v10#_saradc_ch0=166.dtb: RK3326-DTB mit ADC-Angaben.
- px30-evb-ddr3-lvds-v10#_saradc_ch0=512.dtb: PX30-DTB mit ADC-Angaben.

Bei manuellem Aufruf von scripts/mkmultidtb.py muss das erzeugte resource.img manuell in boot.img ersetzt werden. Für automatische Einbindung des Multi-DTB-resource.img beim Kernelbuild den Aufruf wie unten ergänzen.

```text
diff --git a/scripts/mkimg b/scripts/mkimg
index 1d895602935..5e1355b9da8 100755
--- a/scripts/mkimg
+++ b/scripts/mkimg
@@ -248,6 +248,7 @@ if [ "${srctree}" != "${objtree}" ]; then
 fi
 scripts/resource_tool ${DTB_PATH} ${LOGO} ${LOGO_KERNEL} >/dev/null
 echo "  Image:  resource.img (with ${DTB} ${LOGO} ${LOGO_KERNEL}) is ready"
+./scripts/mkmultidtb.py PX30-EVB

 if [ -f "${BOOT_IMG}" ]; then
        if file -L -p -b ${BOOT_IMG} | grep -q 'Device Tree Blob' ; then
```

#### 4.11.5 Funktion aktivieren

Konfigurationsoptionen:

```text
CONFIG_ROCKCHIP_HWID_DTB=y
```

Treibercode:

```text
./arch/arm/mach-rockchip/resource_img.c // 具体实现：rockchip_read_hwid_dtb()
```

DTS: Für GPIO-Erkennung die zugehörigen pinctrl- und gpio-Knoten in rkxx-u-boot.dtsi beibehalten; ADC ist standardmäßig aktiv. Beispiel für gpio0 und gpio1:

```text
...

&pinctrl {
    u-boot,dm-spl;  // 追加该属性，让该节点被保留在U-Boot DTB中。下同。
};

&gpio0 {
    u-boot,dm-spl;
};

&gpio1 {
    u-boot,dm-spl;
};

...
```

#### 4.11.6 Ladeergebnis

```text
......
mmc0(part 0) is current device
boot mode: None
DTB: rk3326-evb-lp3-v10#_saradc_ch0=166.dtb // 打印匹配的DTB，否则默认"rk-kernel.dtb"
Using kernel dtb
......
```

### 4.12 SD und USB-Speicher

Dieser Abschnitt behandelt Firmwarestart und -aktualisierung auf RK über SD und USB-Speicher.

#### 4.12.1 Mechanismus

Beim Erstellen einer Boot- oder Updatekarte wird an einem festen Offset im Firmware-Header ein Typ-Tag geschrieben. U-Boot erkennt es und wählt Start oder Update. Eine Bootkarte enthält eine vollständige Firmware für den regulären Start. Eine Updatekarte enthält zwei: Das PC-Werkzeug schreibt A mit den für recovery notwendigen Partitionen und B als vollständiges update.img. U-Boot startet recovery aus A, anschließend aktualisiert recovery das System aus B. Wichtig: SD-Start/Update wird schon ab BootROM unterstützt; USB erst ab U-Boot, das deshalb bereits funktionieren muss.

#### 4.12.2 Firmware erstellen

SD- und USB-Boot-/Updatemedien werden identisch erstellt: update.img mit dem SDK-Werkzeug unter RKTools/linux/Linux_Pack_Firmware/rockdev/ erzeugen, anschließend mit SDDiskTool auf SD/USB schreiben. Im gezeigten Fenster Wechseldatenträger, „Firmwareupdate“ oder „SD-Start“ und anschließend „Erstellung starten“ wählen.

![Abbildung 6: englische Quelle, Seite 79](/docs/rockchip-uboot-nextdev/assets/en-p079-figure-01.png)

*Abbildung 6: englische Quelle, Seite 79*

#### 4.12.3 SD-Konfiguration

SD-Start/Update ist im U-Boot der Plattform-SDKs standardmäßig aktiv; keine zusätzliche Konfiguration erforderlich.

#### 4.12.4 USB-Konfiguration

USB-Start/Update ist standardmäßig deaktiviert, da die native USB-Suche von U-Boot lange dauert. Bei Bedarf:
1. Eine vollständige funktionsfähige Updatefirmware auf den lokalen eMMC/NAND-Speicher schreiben und prüfen.
2. USB-Speicher anschließen und die U-Boot-Konsole öffnen. Mit usb start und usb info die Erkennung prüfen; bei Problemen zuerst USB funktionsfähig machen.
3. Den Kernel-DTB aus Schritt 1 als kern.dtb nach ./dts/ in U-Boot kopieren. Beim Build wird er automatisch in uboot.img eingebunden. Ist der Kernel-DTB der lokalen Partition beschädigt, ermöglicht kern.dtb eine korrekte USB-Initialisierung.
4. USB-Start/Update konfigurieren:

```text
CONFIG_ROCKCHIP_USB_BOOT=y
```

uboot.img neu bauen und programmieren. Scheitert das Packen wegen zu großer U-Boot-Firmware, ist der hinzugefügte kern.dtb die Ursache; nicht benötigte U-Boot-Optionen deaktivieren.

#### 4.12.5 Funktion prüfen

Zum Prüfen von SD/USB-Start oder Update schlägt die Vorlage vor, wichtige lokale Partitionen kernel, resource, boot und recovery auf eMMC/NAND zu löschen und den Kernelstart mit SD/USB zu prüfen. Dieser destruktive Test erfordert Sicherung und einen geprüften Wiederherstellungsweg.

#### 4.12.6 Hinweise

Die USB-Initialisierung ruft usb start auf und benötigt merklich Zeit. GPT erfordert SDDiskTool &gt;= v1.59, A/B &gt;= v1.61. USB-Start/Update wurde 2019.11 ergänzt; die Repository-Stände müssen folgende Bedingungen erfüllen:

1. U-Boot auf folgenden Commit aktualisieren (empfohlen):

```text
commit 369e944c844f783508b7839ae86a3418e2f63bc7
Author: Joseph Chen <chenjh@rock-chips.com>
Date:   Thu Dec 12 18:07:07 2019 +0800

    fdt/Makefile: make u-boot-dtb.bin 8-byte aligned

    The dts/kern.dtb is appended after u-boot-dtb.bin for U-disk boot.

    Make sure u-boot-dtb.bin is 8-byte aligned to avoid data-abort on
    calling: fdt_check_header(gd->fdt_blob_kern).

    Signed-off-by: Joseph Chen <chenjh@rock-chips.com>
    Change-Id: Id5f2daf0c5446e7ea828cb970d3d4879e3acda86
```

Alternativ die Änderungen folgender Patches einzeln übernehmen, was schwierig sein kann:

```text
369e944 fdt/Makefile: make u-boot-dtb.bin 8-byte aligned
b3b57ac rockchip: board: fix always entering recovery on normal boot U-disk
e0cee41 rockchip: resource: add sha1/256 verify for kernel dtb
5e817a0 tools: rockchip: resource_tool: add sha1 for file entry
fc474da lib: sha256: add sha256_csum()
0ed06f1 rockchip: support boot from U-disk
01f0422 common: bootm: skip usb_stop() if usb is boot device
5704c89 fdtdec: support pack "kern.dtb" to the end of u-boot.bin
3bdef7e gpt: return 1 directly when test the mbr sector
```

1. Das rkbin-Repository muss diesen Commit enthalten:

```text
commit f9c0b0b72673a65865b00a8824908ca6f12ecc32
Author: Joseph Chen <chenjh@rock-chips.com>
Date:   Thu Nov 7 09:21:36 2019 +0800

    tools: resource: add sha1 for file entry

    Base on U-Boot next-dev branch:
    (5e817a0 tools: rockchip: resource_tool: add sha1 for file entry)

    Change-Id: Ife061cabacab488dbecf2a3245d58cc660091dbd
    Signed-off-by: Joseph Chen <chenjh@rock-chips.com>
```

1. Das Kernel-Repository muss diesen Commit enthalten:

```text
commit 078785057478c789bb033ba06925fa3a07e3130a
Author: Tao Huang <huangtao@rock-chips.com>
Date:   Thu Nov 7 17:53:38 2019 +0800

    rk: scripts/resource_tool: add sha1 for file entry

    From u-boot 5e817a0ea427 ("tools: rockchip: resource_tool: add sha1 for file
entry").
    Merge all C files to one resource_tool.c

    Change-Id: If63ba77d1f5a3660bd6ef87769bb456fa086ae71
    Signed-off-by: Tao Huang <huangtao@rock-chips.com>
```

Bei älteren SDKs zusätzlich zu diesen Patches mit dem recovery-Verantwortlichen klären, ob zugehörige recovery-Patches benötigt werden.

## 5 Treibermodule

### 5.1 AMP

#### 5.1.1 Implementierungsansatz

U-Boot unterstützt standardmäßig kein AMP (Asymmetric Multi-Processing). RK implementiert unterschiedliche Firmware auf verschiedenen CPUs.

(1) Paketierung: ITS beschreibt CPU-Zustände und AMP-Firmware außer Linux. Alles wird als FIT-Image amp.img gepackt und in die amp-Partition geschrieben. U-Boot lädt amp.img und prüft SHA256; trust setzt die CPU-Zustände und verzweigt zu den jeweiligen Einsprungadressen.

(2) Startreihenfolge: Die U-Boot-CPU ist der Hauptkern. Er schaltet zuerst die anderen Kerne um und startet deren Firmware, bevor er sich selbst behandelt.

(3) Ressourcen: U-Boot koordiniert weder Speicher noch Interrupts oder andere Ressourcen zwischen AMP-Firmwares; dies verantwortet der Entwickler.

(4) Trust: AMP benötigt trust-Unterstützung. Standard-CPU-Zustände werden vom SDK-trust unterstützt; andere Zustände erfordern zusätzliche Unterstützung, die einige SDKs bereits enthalten. Standard für 32-Bit-Chips: arch = "arm", thumb = &lt;0&gt;, hyp = 0; für 64-Bit-Chips: arch = "arm64", thumb = &lt;0&gt;, hyp = 1.

(5) Kombination Linux+AMP:

1. Aus Kompatibilitätsgründen bleibt die Linux-Firmware wie bei gewöhnlichem SMP: Linux-Firmware + amp.img.

2. Ein linux-Knoten in der AMP-ITS legt den CPU-Zustand für Linux fest; ohne Angabe gilt der Standardzustand.

3. Läuft Linux auf dem Hauptkern oder wurde ihm keine Firmware zugewiesen, startet U-Boot nach den anderen AMP-Firmwares Linux auf gewöhnlichem SMP-Weg.

4. Läuft Linux nicht auf dem Hauptkern, startet es vor den anderen AMP-Firmwares. Wichtig: Ein Hauptkern ungleich CPU0 benötigt besondere trust-Unterstützung.

5. Die Linux-Ladeadresse wird ausschließlich durch die U-Boot-Konfiguration festgelegt, etwa rk3568_common.h.

#### 5.1.2 Framework-Unterstützung

Konfiguration:

```text
CONFIG_AMP
CONFIG_ROCKCHIP_AMP
```

Framework-Code:

```text
./drivers/cpu/rockchip_amp.c
```

ITS-Vorlage:

```text
./drivers/cpu/amp.its
```

Paketierungswerkzeug:

```text
./tools/mkimage  // 完整编译⼀次U-Boot后会⾃动⽣成
```

Mindestens erforderlicher Commit:

```text
commit c51cf04095dde2df2dd047e70d2c7fb0866ea916
Author: Joseph Chen <chenjh@rock-chips.com>
Date:   Tue Oct 19 03:16:35 2021 +0000

    cpu: amp.its: update amps "arm64" => "arm"

    Signed-off-by: Joseph Chen <chenjh@rock-chips.com>
    Change-Id: I99de02c5b6c62ffdd9b25565acd172801d6e983c
```

#### 5.1.3 Funktion aktivieren

1. amp.img benötigt eine ITS-Datei; drivers/cpu/amp.its entsprechend anpassen. Im Beispiel laufen CPU1/2/3 mit AMP, CPU0 mit Linux; Hauptkern ist CPU3. Reihenfolge: CPU0 =&gt; CPU1/2 =&gt; CPU3.

```text
/dts-v1/;
/ {
    description = "FIT source file for rockchip AMP";
    #address-cells = <1>;

    // 所有AMP固件（不含Linux）请在images节点下指定；
    images {
        amp1 {
            description  = "bare-mental-core1";       // 必选项：描述信息
            data         = /incbin/("./amp1.bin");    // 必选项：amp1固件
            type         = "firmware";  // 必选项：不做改动
            compression  = "none";      // 必选项：不做改动
        arch         = "arm";       // 必选项："arm64"：64位， "arm"：32位
        cpu          = <0x100>;     // 必选项：cpu硬件id(mpidr)
        thumb        = <0>;         // 必选项：0: arm or thumb2; 1: 纯thumb
        hyp          = <0>;         // 必选项：0: el1/svc; 1: el2/hyp
        load         = <0x01800000>;// 必选项：固件加载和运⾏地址
        udelay       = <1000000>;   // 可选项：启动完当前CPU后做延时后再启动下⼀个CPU
        hash {                      // 必选项：不做改动
            algo = "sha256";
        };
    };

    amp2 {
        description  = "bare-mental-core2";
        data         = /incbin/("./amp2.bin");
        type         = "firmware";
        compression  = "none";
        arch         = "arm";
        cpu          = <0x200>;
        thumb        = <0>;
        hyp          = <0>;
        load         = <0x03800000>;
        udelay       = <1000000>;
        hash {
            algo = "sha256";
        };
    };

    amp3 {
        description  = "bare-mental-core3";
        data         = /incbin/("./amp3.bin");
        type         = "firmware";
        compression  = "none";
        arch         = "arm";
        cpu          = <0x300>;
        thumb        = <0>;
        hyp          = <0>;
        load         = <0x05800000>;
        udelay       = <1000000>;
        hash {
            algo = "sha256";
        };
    };
};

configurations {
    default = "conf";
    conf {
        description = "Rockchip AMP images";
        rollback-index = <0x0>;
        // 指定需要被加载的固件及其加载、启动顺序，但是主核不受此顺序限制。
        loadables = "amp1", "amp2", "amp3";

        signature {
                algo = "sha256,rsa2048";
                padding = "pss";
                key-name-hint = "dev";
                sign-images = "loadables";
            };

            // Linux CPU的运⾏状态指定：
            // （1）只有udelay属性是可选项；
            // （2）启动地址不可配，由U-Boot的平台配置⽂件决定，例如：rk3568_common.h；
            linux {
                description  = "linux-os";
                arch         = "arm64";
                cpu          = <0x000>;    // CPU0跑linux
                thumb        = <0>;
                hyp          = <0>;
                udelay       = <1000000>;
            };
        };
    };
};
```

Felder:
- description: Beschreibung.
- type: standardmäßig "firmware".
- compression: standardmäßig "none".
- data: Firmwarepfad relativ zu amp.its.
- arch: CPU-Modus 32/64. ARMv7 erlaubt nur "arm"; ARMv8 erlaubt "arm64" (AArch64) oder "arm" (AArch32).
- cpu: Hardware-ID der CPU, untere 32 Bit von MPIDR (Multiprocessor Affinity Register), beispielsweise:

```text
cpus {
    #address-cells = <2>;
    #size-cells = <0>;

    cpu0: cpu@0 {
        device_type = "cpu";
        compatible = "arm,cortex-a55";
        reg = <0x0 0x0>;    // mpidr
        ......
    };

    cpu1: cpu@100 {
        device_type = "cpu";
        compatible = "arm,cortex-a55";
        reg = <0x0 0x100>;  // mpidr
        ......
    };
    ......
};
```

- thumb: CPU-Befehlsmodus; 1 für reines Thumb, sonst 0.
- hyp: CPU-Virtualisierungsmodus.
- load: Lade- und Ausführungsadresse der Firmware.
- udelay: optionale Verzögerung in us nach Start der aktuellen CPU vor der nächsten.
- loadables: zu ladende AMP-Firmwares und ihre Lade-/Startreihenfolge. Der Hauptkern startet unabhängig davon immer zuletzt.
- linux: Knoten für Linux+AMP; siehe Implementierungsprinzip in diesem Kapitel.

2. Firmware paketieren:

```text
// 0xe00为固件头⼤⼩，不建议改变
./tools/mkimage -f ./drivers/cpu/amp.its -E -p 0xe00 amp.img
```

mkimage wird nach einem vollständigen U-Boot-Build automatisch erzeugt.

3. Partition amp in parameter.txt ergänzen und amp.img schreiben. U-Boot lädt die gesamte amp-Partition in den Speicher; deren Größe nach tatsächlichem Bedarf festlegen.

4. Bring-up: U-Boot startet alle AMP-Firmwares automatisch zum passenden Zeitpunkt. Protokoll für CPU3 als AMP-Hauptkern und CPU0/1/2 mit Linux:

```text
......
// 主核加载固件amp3固件
### Loading loadables from FIT Image at 7bdbcf80 ...
   Trying 'amp3' loadables subimage
     Description:  rtthread
     Type:         Firmware
     Compression:  uncompressed
     Data Start:   0x7bdbdd80
     Data Size:    311296 Bytes = 304 KiB
     Architecture: ARM
     Load Address: 0x01800000
     Hash algo:    sha256
     Hash value:   d08db937e4d7bd4125056239154bb30d44a2fcca9e70aa8dea448fabda4838d5
   Verifying Hash Integrity ... sha256+ OK
   Loading loadables from 0x7bdbdd80 to 0x01800000
### Booting FIT Image FIT: No fit blob
FIT: No FIT image
ANDROID: reboot reason: "(none)"
optee api revision: 2.0
TEEC: Waring: Could not find security partition
Not AVB images, AVB skip
ANDROID: Hash OK

// 主核加载Linux固件
Booting IMAGE kernel at 0x03880000 with fdt at 0x0a100000...

Fdt Ramdisk skip relocation
### Booting Android Image at 0x0387f800 ...
Kernel load addr 0x03880000 size 21655 KiB
### Flattened Device Tree blob at 0x0a100000
   Booting using the fdt blob at 0x0a100000
   XIP Kernel Image from 0x03880000 to 0x03880000 ... OK
  'reserved-memory' ramoops@110000: addr=110000 size=f0000
   Using Device Tree in place at 000000000a100000, end 000000000a12322a
vp1 adjust cursor plane from 0 to 1
vp0, plane_mask:0x2a, primary-id:5, curser-id:1
vp1 adjust cursor plane from 1 to 0
vp1, plane_mask:0x15, primary-id:4, curser-id:0
vp2, plane_mask:0x0, primary-id:0, curser-id:-1
Adding bank(fixed): 0x03880000 - 0x80000000 (size: 0x7c780000)

// ⾄此，所有的固件都被加载完毕，如下开始按⽅案的优先级规则去启动各个CPU。

// 主核启动CPU0跑Linux (CPU1/2后续通过Linux启动)
AMP: Brought up cpu[0] with state 0x12, entry 0x03880000 ...OK
// 主核启动⾃⼰（CPU3）跑AMP固件
AMP: Brought up cpu[300, self] with state 0x10, entry 0x01800000 ...OK

// Linux在CPU0上运⾏：
[    0.000000] Booting Linux on physical CPU 0x0000000000 [0x412fd050]
[    0.000000] Linux version 4.19.193 (stevenliu@stevenliu) (gcc version 6.3.1 20170404
(Linaro GCC 6.3-2017.05), GNU ld (Linaro_Binutils-2017.05) 2.27.0.20161019) #5 SMP Mon Sep
13 16:22:51 CST 2021
[    0.000000] Machine model: Rockchip RK3568 EVB1 DDR4 V10 Board
......
```

Die Ausgabe hängt von der ITS-Konfiguration ab; maßgeblich ist das tatsächliche Protokoll.

### 5.2 Charge

#### 5.2.1 Framework-Unterstützung

Natives U-Boot unterstützt keine Ladefunktion; RK implementiert sie selbst. Beteiligte Module sind Display, PMIC, Ladestandsmesser, Ladeanimation, pwrkey, LED, CPU-Energiesparmodus, Timer und weitere. Unterstützte Ladestandsmesser:

```text
RK809/RK816/RK817/RK818/cw201x。
```

Konfiguration:

```text
// 框架
CONFIG_DM_CHARGE_DISPLAY
CONFIG_CHARGE_ANIMATION
CONFIG_DM_FUEL_GAUGE
// 驱动
CONFIG_POWER_FG_CW201X
CONFIG_POWER_FG_RK818
CONFIG_POWER_FG_RK817
CONFIG_POWER_FG_RK816
```

Lade-Framework:

```text
./drivers/power/charge-display-uclass.c
```

Treiber der Ladeanimation:

```text
// 负责管理整个充电过程，它会获取电量、充电类型、按键事件，发起低功耗休眠等。
./drivers/power/charge_animation.c
```

Framework des Ladestandsmessers:

```text
./drivers/power/fuel_gauge/fuel_gauge_uclass.c
```

Treiber des Ladestandsmessers:

```text
./drivers/power/fuel_gauge/fg_rk818.c
./drivers/power/fuel_gauge/fg_rk817.c   // rk809复⽤
./drivers/power/fuel_gauge/fg_rk816.c
......
```

Logischer Ablauf:

```text
charge-display-uclass.c
    => charge_animation.c
        => fuel_gauge_uclass.c
            => fg_rkxx.c
```

#### 5.2.2 Bilder paketieren

Ladebilder liegen in ./tools/images/ und müssen zur Anzeige in resource.img gepackt werden. Das beim Kernelbuild erzeugte resource.img enthält sie standardmäßig nicht; sie sind separat mit U-Boot zu paketieren.

```text
$ ls tools/images/
battery_0.bmp  battery_1.bmp  battery_2.bmp  battery_3.bmp  battery_4.bmp  battery_bmp
battery_fail.bmp
```

Paketierungsbefehl:

```text
./pack_resource.sh <input resource.img> 或
./scripts/pack_resource.sh <input resource.img>
```

Paketierungsausgabe:

```text
./pack_resource.sh  /home/cjh/3399/kernel/resource.img

Pack ./tools/images/ & /home/guest/3399/kernel/resource.img to resource.img ...
Unpacking old image(/home/guest/3399/kernel/resource.img):
rk-kernel.dtb logo.bmp logo_kernel.bmp
Pack to resource.img successed!
Packed resources:
rk-kernel.dtb battery_1.bmp battery_2.bmp battery_3.bmp battery_4.bmp battery_bmp
battery_fail.bmp logo.bmp logo_kernel.bmp battery_0.bmp

resource.img is packed ready
```

Im U-Boot-Stammverzeichnis entsteht resource.img mit Bildern; den Inhalt mit hd prüfen:

```text
hd resource.img | less

00000000  52 53 43 45 00 00 00 00  01 01 01 00 0a 00 00 00  |RSCE............|
00000010  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
*
......
*
00000400  45 4e 54 52 62 61 74 74  65 72 79 5f 31 2e 62 6d  |ENTRbattery_1.bm| // 图⽚1
00000410  70 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |p...............|
00000420  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
*
00000500  00 00 00 00 4d 00 00 00  9c 18 00 00 00 00 00 00  |....M...........|
00000510  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
*
00000600  45 4e 54 52 62 61 74 74  65 72 79 5f 32 2e 62 6d  |ENTRbattery_2.bm| // 图⽚2
00000610  70 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |p...............|
00000620  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
......
```

#### 5.2.3 DTS-Konfiguration

DTS-Ladeknoten:

```text
charge-animation {
    compatible = "rockchip,uboot-charge";
    status = "okay";

    rockchip,uboot-charge-on = <0>;             // 是否开启U-Boot充电
    rockchip,android-charge-on = <1>;           // 是否开启Android充电
    rockchip,uboot-exit-charge-level = <5>;     // U-Boot充电时，允许开机的最低电量
    rockchip,uboot-exit-charge-voltage = <3650>;// U-Boot充电时，允许开机的最低电压
    rockchip,screen-on-voltage = <3400>;        // U-Boot充电时，允许点亮屏幕的最低电压

    rockchip,uboot-low-power-voltage = <3350>;  // U-Boot⽆条件强制进⼊充电模式的最低电压

    rockchip,system-suspend = <1>;              // 是否灭屏时进⼊trust低功耗待机（要ATF⽀持）
    rockchip,auto-off-screen-interval = <20>;   // ⾃动灭屏超时，单位秒，默认15s
    rockchip,auto-wakeup-interval = <10>;       // 休眠⾃动唤醒时间，单位秒。如果值为0或没
                                                // 有这个属性，则禁⽌休眠⾃动唤醒，⼀般⽤于
                                                // 压⼒测试使⽤
    rockchip,auto-wakeup-screen-invert = <1>;   // 休眠⾃动唤醒时是否需要亮/灭屏
};
```

#### 5.2.4 System-Suspend

Kurzes Drücken von pwrkey schaltet den Bildschirm ein/aus; bei ausgeschaltetem Bildschirm geht das System in den Energiesparmodus. Langes Drücken startet das System. rockchip,system-suspend = &lt;VAL&gt; wählt zwischen zwei Modi: VAL=0 — CPU WFI ohne Behandlung der Peripherie; VAL=1 — system suspend mit erforderlicher ATF/OPTEE-Unterstützung, Tiefschlaf des gesamten SoC wie im Kernel. Mindestversionen von ATF/OPTEE für U-Boot-Suspend stehen im Kapitel zu Plattformdefinitionen.

#### 5.2.5 Bilder austauschen

1. Bilder in ./tools/images/ durch 8bit- oder 24bit-BMP ersetzen. Mit ls &#124; sort die Reihenfolge vom niedrigen zum hohen Ladestand prüfen und mit pack_resource.sh in resource.img packen.

2. Zuordnung von Bildern und Ladestand in ./drivers/power/charge_animation.c anpassen.

```text
/*
 * IF you want to use your own charge images, please:
 *
 * 1. Update the following 'image[]' to point to your own images;
 * 2. You must set the failed image as last one and soc = -1 !!!
 */
static const struct charge_image image[] = {
    { .name = "battery_0.bmp", .soc = 5, .period = 600 },
    { .name = "battery_1.bmp", .soc = 20, .period = 600 },
    { .name = "battery_2.bmp", .soc = 40, .period = 600 },
    { .name = "battery_3.bmp", .soc = 60, .period = 600 },
    { .name = "battery_4.bmp", .soc = 80, .period = 600 },
    { .name = "battery_bmp", .soc = 100, .period = 600 },
    { .name = "battery_fail.bmp", .soc = -1, .period = 1000 },
};

// @name：图⽚的名字；
// @soc：图⽚对应的电量；
// @period：图⽚刷新时间（单位：ms）；
// 注意：最后⼀张图⽚必须是 fail 图⽚，且“soc=-1”不可改变 !!
```

#### 5.2.6 Ladeanzeigen

LED-Anforderungen unterscheiden sich je Produkt; das Lade-Framework bietet daher nur zwei Demo-Anzeigen: Laden und vollständig geladen. Die erste wechselt bei Ladestandsänderung während des Ladens, die zweite leuchtet bei 100%. In der Vorlage ist die erste Beschreibung ebenfalls als vollständig geladen beschriftet. Das Demo an die Produktanforderungen anpassen. Optionen:

```text
CONFIG_LED_CHARGING_NAME
CONFIG_LED_CHARGING_FULL_NAME
```

Beide Optionen geben die label-Eigenschaft der LEDs an; siehe Kapitel LED.

### 5.3 Clock

#### 5.3.1 Framework-Unterstützung

Der Clock-Treiber verwendet clk-uclass und Standardschnittstellen. Konfiguration:

```text
CONFIG_CLK
```

Framework-Code:

```text
./drivers/clk/clk-uclass.c
```

Plattformtreiber:

```text
./drivers/clk/rockchip/...
```

#### 5.3.2 Schnittstellen

```text
// 申请时钟
int clk_get_by_index(struct udevice *dev, int index, struct clk *clk);
int clk_get_by_name(struct udevice *dev, const char *name, struct clk *clk);

// 使能/关闭时钟
int clk_enable(struct clk *clk);
int clk_disable(struct clk *clk);

// 配置/获取频率
ulong (*get_rate)(struct clk *clk);
ulong (*set_rate)(struct clk *clk, ulong rate);

// 配置/获取相位
int (*get_phase)(struct clk *clk);
int (*set_phase)(struct clk *clk, int degrees);
```

#### 5.3.3 Taktinitialisierung

Drei Schnittstellengruppen sind an der Clock-Initialisierung beteiligt. Zunächst der CRU-Knoten als Grundlage der Erklärung.

```text
cru: clock-controller@ff2b0000 {
    compatible = "rockchip,px30-cru";
    ......
    assigned-clocks =
        <&pmucru PLL_GPLL>, <&pmucru PCLK_PMU_PRE>,
        <&pmucru SCLK_WIFI_PMU>, <&cru ARMCLK>,
        <&cru ACLK_BUS_PRE>, <&cru ACLK_PERI_PRE>,
        <&cru HCLK_BUS_PRE>, <&cru HCLK_PERI_PRE>,
        <&cru PCLK_BUS_PRE>, <&cru SCLK_GPU>;
    assigned-clock-rates =
        <1200000000>, <100000000>,
        <26000000>, <600000000>,
        <200000000>, <200000000>,
        <150000000>, <150000000>,
        <100000000>, <200000000>;
    ......
}
```

Erste Gruppe: Standardinitialisierung der Plattform-Basistakte durch rkclk_init(). probe des CRU-Treibers ruft rkclk_init() für PLL/CPU/bus auf; Frequenzen stehen in cru_rkxxx.h. Beispiel RK3399:

```text
#define APLL_HZ         (600 * MHz)
#define GPLL_HZ         (800 * MHz)
#define CPLL_HZ         (384 * MHz)
#define NPLL_HZ         (600 * MHz)
#define PPLL_HZ         (676 * MHz)
#define PMU_PCLK_HZ     ( 48 * MHz)
#define ACLKM_CORE_HZ   (300 * MHz)
#define ATCLK_CORE_HZ   (300 * MHz)
#define PCLK_DBG_HZ     (100 * MHz)
#define PERIHP_ACLK_HZ  (150 * MHz)
#define PERIHP_HCLK_HZ  ( 75 * MHz)
#define PERIHP_PCLK_HZ  (37500 * KHz)
#define PERILP0_ACLK_HZ (300 * MHz)
#define PERILP0_HCLK_HZ (100 * MHz)
#define PERILP0_PCLK_HZ ( 50 * MHz)
#define PERILP1_HCLK_HZ (100 * MHz)
#define PERILP1_PCLK_HZ ( 50 * MHz)
......
```

Zweite Gruppe: erneute Basistaktkonfiguration mit clk_set_defaults(). CRU-probe kann damit assigned-clocks/assigned-clock-parents/assigned-clock-rates des CRU-Knotens einlesen und anwenden, ausgenommen den ARM-Takt. Dieser ändert sich nur mit implementiertem set_armclk_rate(); siehe CPU-Takterhöhung unten. Auch andere Geräte wie VOP und GMAC können clk_set_defaults() in ihrem probe aufrufen.

Dritte Gruppe: Modultaktinitialisierung mit clk_set_rate(); die meisten Peripheriemodule setzen damit ihre Frequenz.

#### 5.3.4 CPU-Takterhöhung

Plattformunterstützung für CPU-Takterhöhung steht im Kapitel zu Plattformdefinitionen. Es gibt drei Mechanismen.

Erstens: CPU verwendet APLL.
1. ARM-Zielfrequenz in assigned-clocks des CRU-Knotens angeben.
2. CRU-probe ruft clk_set_defaults() auf, um die Frequenz zunächst nur zu lesen.
3. set_armclk_rate() zum Setzen implementieren. Einige Plattformen enthalten dies bereits; andere können beispielsweise arch\arm\mach-rockchip\px30\px30.c als Vorlage nutzen.

```text
int set_armclk_rate(void)
{
    struct px30_clk_priv *priv;
    struct clk clk;
    int ret;

    ret = rockchip_get_clk(&clk.dev);
    if (ret) {
        printf("Failed to get clk dev\n");
        return ret;
    }
    clk.id = ARMCLK;
    priv = dev_get_priv(clk.dev);
    ret = clk_set_rate(&clk, priv->armclk_hz);
    if (ret < 0) {
        printf("Failed to set armclk %lu\n", priv->armclk_hz);
        return ret;
    }
    priv->set_armclk_rate = true;

    return 0;
}
```

4. Anhand der CPU-opp-table für Frequenz/Spannung regulator-init-microvolt = &lt;...&gt; im ARM-Regulatorknoten ergänzen; Anfangsspannung und Zielfrequenz müssen zusammenpassen.

Zweitens: CPU verwendet SCMI CLK, etwa RK356X. Die Taktparameter werden über SCMI gesetzt.
1. ARM-Zielfrequenz in rockchip,clk-init des SCMI-Knotens angeben.
2. CONFIG_CLK_SCMI aktivieren.
3. set_armclk_rate() zum Setzen der Frequenz aus dem SCMI-DTS implementieren. Einige Plattformen unterstützen dies bereits; Beispiel: arch\arm\mach-rockchip\rk3568\rk3568.c.

```text
#ifdef CONFIG_CLK_SCMI
#include <dm.h>
/*
 * armclk: 1104M:
 *  rockchip,clk-init = <1104000000>,
 *  vdd_cpu : regulator-init-microvolt = <825000>;
 * armclk: 1416M(by default):
 *  rockchip,clk-init = <1416000000>,
 *  vdd_cpu : regulator-init-microvolt = <900000>;
 * armclk: 1608M:
 *  rockchip,clk-init = <1608000000>,
 *  vdd_cpu : regulator-init-microvolt = <975000>;
 */

int set_armclk_rate(void)
{
    struct clk clk;
    u32 *rates = NULL;
    int ret, size, num_rates;

    ret = rockchip_get_scmi_clk(&clk.dev);
    if (ret) {
        printf("Failed to get scmi clk dev\n");
        return ret;
    }

    size = dev_read_size(clk.dev, "rockchip,clk-init");
    if (size < 0)
        return 0;

    num_rates = size / sizeof(u32);
    rates = calloc(num_rates, sizeof(u32));
    if (!rates)
        return -ENOMEM;

    ret = dev_read_u32_array(clk.dev, "rockchip,clk-init",
                 rates, num_rates);
    if (ret) {
        printf("Cannot get rockchip,clk-init reg\n");
        return -EINVAL;
    }
    clk.id = 0;
    ret = clk_set_rate(&clk, rates[clk.id]);
    if (ret < 0) {
        printf("Failed to set armclk\n");
        return ret;
    }
    return 0;
}
#endif
```

4. regulator-init-microvolt = &lt;...&gt; anhand der CPU-opp-table im ARM-Regulator ergänzen; Spannung und Frequenz abstimmen. SCMI wird im Anhang von Kapitel 17 erläutert.

Drittens: ebenfalls SCMI CLK, aber nur Schritt 4 ist erforderlich; der CPU-Takt steigt automatisch mit der Spannung.

#### 5.3.5 Taktbaum

U-Boot bietet keine Taktbaumverwaltung. Die plattformspezifische soc_clk_dump() gibt grundlegende Taktinformationen aus, beispielsweise:

```text
CLK: (sync kernel. arm: enter 1200000 KHz, init 1200000 KHz, kernel 800000 KHz)
  apll 800000 KHz
  dpll 392000 KHz
  cpll 1000000 KHz
  gpll 1188000 KHz
  npll 24000 KHz
  ppll 100000 KHz
  hsclk_bus 297000 KHz
  msclk_bus 198000 KHz
  lsclk_bus 99000 KHz
  msclk_peri 198000 KHz
  lsclk_peri 99000 KHz
```

Bedeutung der ersten Zeile: sync kernel — der CRU-Treiber hat mit clk_set_defaults() die Busfrequenzen aus dem Kernel-CRU-Knoten gesetzt,

ausgenommen ARM; andernfalls erscheint sync uboot. enter 1200000 KHz ist der ARM-Takt beim Übergang vom Loader zu U-Boot. init 1200000 KHz ist der durch APLL_HZ definierte anfängliche U-Boot-ARM-Takt. kernel 800000 KHz bedeutet, dass set_armclk_rate() implementiert und die ARM-Frequenz aus assigned-clocks des Kernel-CRU-Knotens gesetzt wurde; andernfalls erscheint "kernel 0N/A".

### 5.4 Crypto

Crypto implementiert hardwaregestützte Verschlüsselungs- und Hashalgorithmen; verfügbar sind die IP-Versionen v1 und v2.

#### 5.4.1 Framework-Unterstützung

U-Boot besitzt kein natives Crypto-Framework; RK implementiert ein eigenes. Konfiguration:

```text
CONFIG_DM_CRYPTO
// 2选1，各平台的defconfig已默认使能对应配置。
CONFIG_ROCKCHIP_CRYPTO_V1
CONFIG_ROCKCHIP_CRYPTO_V2
```

Framework-Code:

```text
./drivers/crypto/crypto-uclass.c
./cmd/crypto.c
```

Treibercode:

```text
// crypto v1:
./drivers/crypto/rockchip/crypto_v1.c

// crytpo v2:
./drivers/crypto/rockchip/crypto_v2.c
./drivers/crypto/rockchip/crypto_v2_pka.c
./drivers/crypto/rockchip/crypto_v2_util.c
```

#### 5.4.2 Schnittstellen

```text
// 获取crypto：
struct udevice *crypto_get_device(u32 capability);
// SHA接⼝：
int crypto_sha_init(struct udevice *dev, sha_context *ctx);
int crypto_sha_update(struct udevice *dev, u32 *input, u32 len);
int crypto_sha_final(struct udevice *dev, sha_context *ctx, u8 *output);
int crypto_sha_csum(struct udevice *dev, sha_context *ctx,
            char *input, u32 input_len, u8 *output);
// RSA接⼝：
int crypto_rsa_verify(struct udevice *dev, rsa_key *ctx, u8 *sign, u8 *output);
```

Schnittstellenverwendung siehe ./cmd/crypto.c. Unterschied bei SHA v1/v2: v1 verlangt vor crypto_sha_init() die gesamte Datenlänge in ctx-&gt;length; v2 nicht.

#### 5.4.3 DTS-Konfiguration

Der crypto-Knoten muss im U-Boot-DTS definiert sein: Ältere SDKs enthalten ihn nicht im Kernel-DTS, weshalb Rückwärtskompatibilität erforderlich ist. Außerdem nutzt U-Boot-Secure-Boot crypto; eigene Kontrolle durch U-Boot ist daher sicherer und sinnvoller.

1. crypto-v1-Konfiguration am Beispiel RK3399:

```text
crypto: crypto@ff8b0000 {
    u-boot,dm-pre-reloc;

    compatible = "rockchip,rk3399-crypto";
    reg = <0x0 0xff8b0000 0x0 0x10000>;
    clock-names = "sclk_crypto0", "sclk_crypto1";
    clocks = <&cru SCLK_CRYPTO0>, <&cru SCLK_CRYPTO1>; // 不需要指定频率，默认100M
    status = "disabled";
};
```

2. crypto-v2-Konfiguration am Beispiel PX30:

```text
crypto: crypto@ff0b0000 {
    u-boot,dm-pre-reloc;

    compatible = "rockchip,px30-crypto";
    reg = <0x0 0xff0b0000 0x0 0x4000>;
    clock-names = "sclk_crypto", "apkclk_crypto";
    clocks = <&cru SCLK_CRYPTO>, <&cru SCLK_CRYPTO_APK>;
    clock-frequency = <200000000>, <300000000>; // ⼀般需要指定频率
    status = "disabled";
};
```

Die DTS-Konfigurationen von v1/v2 unterscheiden sich bei der clk-Frequenzangabe.

### 5.5 Display

#### 5.5.1 Framework-Unterstützung

RK U-Boot unterstützt RGB, LVDS, EDP, MIPI, HDMI, CVBS, DP und weitere Schnittstellen. Logos stammen aus logo.bmp und logo_kernel.bmp im Kernel-Stamm und werden in resource.img gepackt. Unterstützt sind BMP BI_RGB 8bpp/16bpp/24bpp/32bpp sowie BI_RLE4/BI_RLE8. VOP-LITE-Chips wie RK312X/PX30/RK3308/RV1126/RV1106 unterstützen hardwareseitig kein mirror. Bei X/Y-gespiegeltem Logo das BMP zuvor mit Photoshop, ffmpeg oder einem anderen Werkzeug passend umwandeln. Konfiguration:

```text
CONFIG_DM_VIDEO
CONFIG_DISPLAY
CONFIG_DRM_ROCKCHIP
CONFIG_DRM_ROCKCHIP_PANEL
CONFIG_DRM_ROCKCHIP_DW_HDMI
CONFIG_DRM_ROCKCHIP_DW_HDMI_QP
CONFIG_DRM_ROCKCHIP_INNO_HDMI
CONFIG_ROCKCHIP_INNO_HDMI_PHY
CONFIG_DRM_ROCKCHIP_INNO_MIPI_PHY
CONFIG_DRM_ROCKCHIP_INNO_VIDEO_PHY
CONFIG_DRM_ROCKCHIP_INNO_VIDEO_COMBO_PHY
CONFIG_DRM_ROCKCHIP_DW_MIPI_DSI
CONFIG_DRM_ROCKCHIP_DW_MIPI_DSI2
CONFIG_DRM_ROCKCHIP_DW_DP
CONFIG_DRM_ROCKCHIP_ANALOGIX_DP
CONFIG_DRM_ROCKCHIP_LVDS
CONFIG_DRM_ROCKCHIP_RGB
CONFIG_DRM_ROCKCHIP_RK618
CONFIG_DRM_ROCKCHIP_RK628
CONFIG_DRM_ROCKCHIP_SAMSUNG_MIPI_DCPHY
CONFIG_PHY_ROCKCHIP_SAMSUNG_HDPTX_HDMI
CONFIG_ROCKCHIP_DRM_TVE
CONFIG_SII902X
```

Framework-Code:

```text
drivers/video/drm/rockchip_display.c
drivers/video/drm/rockchip_display.h
drivers/video/drm/rockchip_crtc.c
drivers/video/drm/rockchip_crtc.h
drivers/video/drm/rockchip_connector.c
drivers/video/drm/rockchip_connector.h
drivers/video/drm/rockchip_bridge.c
drivers/video/drm/rockchip_bridge.h
drivers/video/drm/rockchip_panel.c
drivers/video/drm/rockchip_panel.h
drivers/video/drm/rockchip_phy.c
drivers/video/drm/rockchip_phy.h
```

Treiberdatei:

```text
vop:
  drivers/video/drm/rockchip_vop.c
  drivers/video/drm/rockchip_vop.h
  drivers/video/drm/rockchip_vop_reg.c
  drivers/video/drm/rockchip_vop_reg.h
  drivers/video/drm/rockchip_vop2.c

rgb:
  drivers/video/drm/rockchip_rgb.c
  drivers/video/drm/rockchip_rgb.h

lvds:
  drivers/video/drm/rockchip_lvds.c
  drivers/video/drm/rockchip_lvds.h

mipi:
  drivers/video/drm/drm_mipi_dsi.c
  drivers/video/drm/dw_mipi_dsi.c
  drivers/video/drm/dw_mipi_dsi2.c

edp:
  drivers/video/drm/rockchip_analogix_dp.c
  drivers/video/drm/rockchip_analogix_dp.h
  drivers/video/drm/rockchip_analogix_dp_reg.c
  drivers/video/drm/rockchip_analogix_dp_reg.h

hdmi:
  drivers/video/drm/dw_hdmi.c
  drivers/video/drm/dw_hdmi.h
  drivers/video/drm/rockchip_dw_hdmi.c
  drivers/video/drm/rockchip_dw_hdmi.h
  drivers/video/drm/dw_hdmi_qp.c
  drivers/video/drm/dw_hdmi_qp.h
  drivers/video/drm/rockchip_dw_hdmi_qp.c
  drivers/video/drm/rockchip_dw_hdmi_qp.h

cvbs:
  drivers/video/drm/rockchip_tve.c
  drivers/video/drm/rockchip_tve.h

dp:
  drivers/video/drm/dw-dp.c

bridge:
  drivers/video/drm/rk618.c
  drivers/video/drm/rk618.h
  drivers/video/drm/rk618_lvds.c
  drivers/video/drm/rk618_lvds.c
  drivers/video/drm/rk628/
  drivers/video/drm/sii902x.c
```

#### 5.5.2 Schnittstellen

```text
// 显⽰ U-Boot logo 和 kernel logo：
void rockchip_show_logo(void);

// 显⽰ bmp 图⽚，⽬前主要⽤于充电图⽚显⽰：
void rockchip_show_bmp(const char *bmp);

// 将 U-Boot 中的⼀些变量通过 dtb 传给内核。
// 包括 kernel logo 的⼤⼩、地址、格式、bcsh/csc配置、crtc 输出扫描时序以及过扫描的配置等。
void rockchip_display_fixup(void *blob);
```

#### 5.5.3 DTS-Konfiguration

```text
reserved-memory {
    #address-cells = <2>;
    #size-cells = <2>;
    ranges;

    drm_logo: drm-logo@00000000 {
        compatible = "rockchip,drm-logo";
        // 预留buffer⽤于kernel logo的存放，具体地址和⼤⼩在U-Boot中会修改
        reg = <0x0 0x0 0x0 0x0>;
    };
};

&route-edp {
    status = "okay";                      // 使能U-Boot logo显⽰功能
    logo,uboot = "logo.bmp";              // 指定U-Boot logo显⽰的图⽚
    logo,kernel = "logo_kernel.bmp";      // 指定kernel logo显⽰的图⽚
    logo,mode = "center";                 // center：居中显⽰，fullscreen：全屏显⽰
    logo,rotate = <90>;                   // 旋转⻆度：90/180/270
    charge_logo,mode = "center";          // center：居中显⽰，fullscreen：全屏显⽰
    connect = <&vopb_out_edp>;            // 确定显⽰通路，vopb->edp->panel
};
&edp {
    status = "okay"; // 使能edp
};

&vopb {
    status = "okay"; // 使能vopb
};

&panel {
    "simple-panel";
    ...
    status = "okay";

    disp_timings: display-timings {
        native-mode = <&timing0>;
        timing0: timing0 {
            ...
        };
    };
};
```

#### 5.5.4 defconfig

Abgesehen von Plattformen mit wenig Speicher oder besonderen Bootzeitanforderungen unterstützt U-Boot-defconfig die Anzeige normalerweise bereits; die DTS-Konfiguration genügt. Auf RK3308/RV1103/RV1106 ist sie unter anderem aus Bootzeitgründen standardmäßig aus; defconfig wie folgt ergänzen:

```text
--- a/configs/evb-rk3308_defconfig
+++ b/configs/evb-rk3308_defconfig
@@ -4,7 +4,6 @@ CONFIG_SYS_MALLOC_F_LEN=0x2000
CONFIG_ROCKCHIP_RK3308=y
CONFIG_ROCKCHIP_SPL_RESERVE_IRAM=0x0
CONFIG_RKIMG_BOOTLOADER=y
-# CONFIG_USING_KERNEL_DTB is not set
CONFIG_TARGET_EVB_RK3308=y
CONFIG_DEFAULT_DEVICE_TREE="rk3308-evb"
CONFIG_DEBUG_UART=y
@@ -55,6 +54,11 @@ CONFIG_USB_GADGET_DOWNLOAD=y
CONFIG_G_DNL_MANUFACTURER="Rockchip"
CONFIG_G_DNL_VENDOR_NUM=0x2207
CONFIG_G_DNL_PRODUCT_NUM=0x330d
+CONFIG_DM_VIDEO=y
+CONFIG_DISPLAY=y
+CONFIG_DRM_ROCKCHIP=y
+CONFIG_DRM_ROCKCHIP_RGB=y
+CONFIG_LCD=y
CONFIG_USE_TINY_PRINTF=y
CONFIG_SPL_TINY_MEMSET=y
CONFIG_ERRNO_STR=y
```

Oder die entsprechenden .config-Optionen aktivieren:

```text
// rk3308
make rk3308_defconfig rk3308-display.config
// rv1103/rv1106
make rv1106_defconfig rv1106-display.config
```

Upstream pflegt einen eigenen Rockchip-U-Boot-Displaytreiber, hauptsächlich für RK3288 und RK3399:

```text
./drivers/video/rockchip/
```

Für den Upstream-Treiber CONFIG_VIDEO_ROCKCHIP aktivieren und CONFIG_DRM_ROCKCHIP deaktivieren. Der SDK-Treiber bietet mehr Plattformen und Schnittstellen, konfigurierbare Auflösung, Overscan und Anzeigeeffekte für HDMI/DP sowie einen nahtlosen Übergang vom U-Boot- zum Kernel-Logo bis zum Systemstart.

#### 5.5.5 LOGO-Partition

Für dynamische Logo-Updates, meist aus einer Anwendung, eine eigene LOGO-Partition anlegen und das Originalbild ohne Paketierung hineinschreiben. Ist das Bild ungültig, wird das Standardbild aus resource verwendet. Enthält der Code nur folgenden Commit, unterstützt LOGO ein einzelnes Bild und ersetzt nur logo.bmp:

```text
1d30bcc rockchip: resource: support parse "logo" partition picture
```

Mit folgendem Commit enthält LOGO zwei Bilder: Das erste ersetzt logo.bmp, das zweite logo_kernel.bmp. Sie liegen unmittelbar hintereinander mit 512-Byte-Ausrichtung; die Reihenfolge darf nicht geändert werden.

```text
commit 07f987d8d495380787203e2bc2accd44100e6051
Author: Joseph Chen <chenjh@rock-chips.com>
Date:   Sun Dec 8 18:00:37 2019 +0800

    rockchip: resource: support parse logo_kernel.bmp from logo partition

    "logo" partition layout, not change order:

    |----------------------| 0x00
    | raw logo.bmp         |
    |----------------------| N*512-byte aligned
| raw logo_kernel.bmp  |
|----------------------|

N: the sector count of logo.bmp

Signed-off-by: Joseph Chen <chenjh@rock-chips.com>
Change-Id: I2deba013d3963c99664c5bfd69693835a46ba48f
```

Für logo.bmp und logo_kernel.bmp lautet der Paketierungsbefehl für logo.img:

```text
cat logo.bmp > logo.img && truncate -s %512 logo.img && cat logo_kernel.bmp >> logo.img
```

logo.img in die logo-Partition schreiben. Beim Start erscheint "LOGO: ":

```text
U-Boot 2017.09-g042c01531e-210512-dirty #cjh (May 14 2021 - 11:25:03 +0800)

Model: Rockchip RK3568 Evaluation Board
PreSerial: 2, raw, 0xfe660000
DRAM:  2 GiB
Sysmem: init
Relocation Offset: 7d34f000, fdt: 7b9f8758
Using default environment

dwmmc@fe2b0000: 1, dwmmc@fe2c0000: 2, sdhci@fe310000: 0
Bootdev(atags): mmc 0
MMC0: HS200, 200Mhz
PartType: EFI
boot mode: normal
FIT: No fdt blob
Android 11.0, Build 2021.4, v2
Found DTB in boot part
// 如下打印说明logo.img分区的图⽚被正确识别到。
LOGO: logo.bmp
LOGO: logo_kernel.bmp
DTB: rk-kernel.dtb
HASH(c): OK
......
```

#### 5.5.6 Häufige Probleme

Frage 1: Ist standardmäßige X/Y-Spiegelung möglich? Antwort: Standardmäßige Y-Spiegelung wird nicht unterstützt. X-Spiegelung ist auf VOP LITE nicht verfügbar; auf VOP2-Plattformen wie RK3568 und RK3588 kann sie ab U-Boot wie folgt aktiviert werden:

```text
&vp1 {
    xmirror-enable;
};
```

Frage 2: Werden BMP-Logos mit 4K-Auflösung unterstützt?

Antwort: Ja, die Standard-defconfigs reichen aber nicht für korrekte 4K-Anzeige. Erforderliche Änderungen am Beispiel RK3576:

```text
diff --git a/drivers/video/drm/rockchip_display.c b/drivers/video/drm/rockchip_display.c
index b1773ba6942..d1606db1ba5 100644
--- a/drivers/video/drm/rockchip_display.c
+++ b/drivers/video/drm/rockchip_display.c
@@ -52,7 +52,7 @@
 #define RK_BLK_SIZE 512
 #define BMP_PROCESSED_FLAG 8399
 #define BYTES_PER_PIXEL sizeof(uint32_t)
-#define MAX_IMAGE_BYTES (8 * 1024 * 1024)
+#define MAX_IMAGE_BYTES (32 * 1024 * 1024)

 DECLARE_GLOBAL_DATA_PTR;
 static LIST_HEAD(rockchip_display_list);
diff --git a/include/configs/rk3576_common.h b/include/configs/rk3576_common.h
index 16abba314c5..b4a8ec3b898 100644
--- a/include/configs/rk3576_common.h
+++ b/include/configs/rk3576_common.h
@@ -22,7 +22,7 @@
 #endif
 #define CONFIG_SPL_LOAD_FIT_ADDRESS    0x42000000

-#define CONFIG_SYS_MALLOC_LEN          (32 << 20)
+#define CONFIG_SYS_MALLOC_LEN          (32 << 21)
 #define CONFIG_SYS_CBSIZE              1024

 #ifdef CONFIG_SUPPORT_USBPLUG
```

CONFIG_DRM_MEM_RESERVED_SIZE_MBYTES außerdem auf 64 MB setzen. Gründe: Wegen Speicherbedarf und Standard-parameter-Tabelle werden große BMPs nicht empfohlen; MAX_IMAGE_BYTES ist auf 8 MB begrenzt, darüber BI_RLE4/BI_RLE8 verwenden. Ein typisches 4K-BI_RGB-24bpp-BMP benötigt etwa 24 MB, der Standard-malloc-Heap meist 32 MB; die BMP-Decodierung kann daher keinen Speicher erhalten. Für nahtlosen U-Boot/Kernel-Übergang haben beide Logos meist dasselbe Format und dieselbe Auflösung; die standardmäßig durch CONFIG_DRM_MEM_RESERVED_SIZE_MBYTES reservierten 32 MB reichen dann nicht.

### 5.6 Dvfs

Anders als im Kernel bezeichnet DVFS hier die dynamische Frequenz-/Spannungsregelung speziell für Chips mit erweitertem Temperaturbereich.

#### 5.6.1 Strategie für erweiterten Temperaturbereich

U-Boot unterstützt DVFS nicht nativ. RK implementiert einen Treiber für erweiterten Temperaturbereich, der CPU/DMC-Frequenz und -Spannung temperaturabhängig regelt. Anders als Kernel-DVFS greift er nur an oberem/unterem Grenzwert. Regelstrategie:

1. Je nach DTS regelt die Strategie CPU und DMC gemeinsam oder nur eines; die Regeln sind identisch.

2. Der Treiber liest opp table, regulator, clock der CPU/DMC-Knoten und trip-point-0 der thermal zone für Frequenz-/Spannungsstufen, Temperaturgrenzen und maximal zulässige Spannung.

3. Die Regelung wird aktiv, wenn die opp table rockchip,low-temp = &lt;...&gt; oder rockchip,high-temp = &lt;...&gt; enthält oder CPU/DMC einen thermal-zone-trip-Knoten referenziert.

4. Wichtige Eigenschaften: rockchip,low-temp bezeichnet TEMP_min; rockchip,high-temp und thermal zone bezeichnen TEMP_max, wobei bei Gültigkeit beider mit beiden verglichen wird; rockchip,max-volt bezeichnet die maximal zulässige Spannung V_max.

5. Oberhalb TEMP_max werden Frequenz und Spannung auf die niedrigste Stufe gesenkt. Unterhalb TEMP_min steigt die Spannung um 50mv; würde dadurch V_max überschritten, wird V_max gesetzt und die Frequenz um zwei Stufen gesenkt.

6. Die Strategie läuft an zwei Stellen: nach regulator/clk-Initialisierung beim Treiberstart aus board_init() in board.c sowie in preboot vor dem Firmwareladen. Sind repeat und verwandte DTS-Eigenschaften gesetzt und bleibt die Temperatur außerhalb der Grenzen, stoppt der Start; die Strategie wird bis zur Rückkehr in den Bereich wiederholt. Ohne repeat startet das System nach einmaliger Anwendung; repeat ist normalerweise nicht erforderlich.

#### 5.6.2 Framework-Unterstützung

Framework-Code:

```text
./drivers/power/dvfs/dvfs-uclass.c
./include/dvfs.h
./cmd/dvfs.c
```

Treibercode:

```text
./drivers/power/dvfs/rockchip_wtemp_dvfs.c
```

#### 5.6.3 Schnittstellen

```text
// 执⾏⼀次dvfs策略
int dvfs_apply(struct udevice *dev);

// 如果存在repeat属性，当温度不在阈值范围内时循环执⾏dvfs策略
int dvfs_repeat_apply(struct udevice *dev);
```

#### 5.6.4 Temperaturstrategie aktivieren

1. Konfiguration aktivieren:

```text
CONFIG_DM_DVFS=y
CONFIG_ROCKCHIP_WTEMP_DVFS=y

CONFIG_DM_THERMAL=y
CONFIG_ROCKCHIP_THERMAL=y
CONFIG_USING_KERNEL_DTB=y
```

2. CONFIG_PREBOOT angeben:

```text
#ifdef CONFIG_DM_DVFS
#define CONFIG_PREBOOT  "dvfs repeat"
#else
#define CONFIG_PREBOOT
#endif
```

3. Temperaturknoten im Kernel-DTS konfigurieren:

```text
uboot-wide-temperature {
    compatible = "rockchip,uboot-wide-temperature";

    // 可选项。表⽰是否在U-Boot阶段触发cpu的最⾼/低温度阈值时让宽温驱动停⽌启动系统，
    // 且不断执⾏宽温处理策略，直到芯⽚温度回归到阈值范围内才继续启动系统。
    cpu,low-temp-repeat;
    cpu,high-temp-repeat;

    // 可选项。表⽰是否在U-Boot阶段触发dmc的最⾼/低温度阈值时让宽温驱动停⽌启动系统，
    // 且不断执⾏宽温处理策略，直到芯⽚温度回归到阈值范围内才继续启动系统。
    dmc,low-temp-repeat;
    dmc,high-temp-repeat;

    status = "okay";
};
```

Die genannten repeat-Eigenschaften sind normalerweise nicht nötig.

#### 5.6.5 Ergebnis der Temperaturregelung

Ausgabe bei aktivierter CPU-Temperaturregelung:

```text
// <NULL>表明没有指定低温阈值
DVFS: cpu: low=<NULL>'c, high=95'c, Vmax=1350000uV, tz_temp=88.0'c, h_repeat=0, l_repeat=0
```

Beim oberen CPU-Grenzwert werden Anpassungen ausgegeben:

```text
DVFS: 90.352'c
DVFS: cpu(high): 600000000->408000000 Hz, 1050000->950000 uV
```

Beim unteren CPU-Grenzwert werden Anpassungen ausgegeben:

```text
DVFS: 10.352'c
DVFS: cpu(low): 600000000->600000000 Hz, 1050000->1100000 uV
```

Entsprechende Meldungen mit Präfix dmc erscheinen an den DMC-Temperaturgrenzen:

```text
DVFS: dmc: ......
DVFS: dmc(high): ......
DVFS: dmc(low): ......
```

### 5.7 Efuse/Otp

#### 5.7.1 Framework-Unterstützung

efuse/otp verwendet misc-uclass.c und Standardschnittstellen. Üblicherweise gibt es secure- und non-secure-Bereiche. U-Boot bietet non-secure-Zugriff, U-Boot SPL Zugriff auf bestimmte secure-OTP-Bereiche. Non-secure-Konfiguration:

```text
CONFIG_MISC
// 2选1，各平台的defconfig已默认使能对应配置。
CONFIG_ROCKCHIP_EFUSE
CONFIG_ROCKCHIP_OTP
```

Secure-Konfiguration:

```text
CONFIG_SPL_MISC=y
CONFIG_SPL_ROCKCHIP_SECURE_OTP=y
// 禁⽤maskrom升级⽅式的⽀持，仅部分平台⽀持。
CONFIG_SPL_OTP_DISABLE_SD=y
CONFIG_SPL_OTP_DISABLE_USB=y
CONFIG_SPL_OTP_DISABLE_UART=y
CONFIG_SPL_OTP_DISABLE_SPI2APB=y
// 撤销已写⼊OTP的rsa公钥hash，仅部分平台⽀持。
CONFIG_SPL_REVOKE_PUB_KEY=y
```

Zur Prüfung der Secure-Unterstützung, etwa bei RV1126B, folgende Definition in rv1126b_common.h prüfen:

```text
// 有如下定义则说明⽀持禁⽤maskrom升级⽅式
#define OTP_DISABLE_UPGRADE_ADDR    0x154
#define OTP_DISABLE_USB_VAL     0x3
#define OTP_DISABLE_SD_VAL      0xc
#define OTP_DISABLE_UART_VAL        0x30
#define OTP_DISABLE_SPI2APB_VAL     0xc0
// 有如下定义则说明⽀持撤销已写⼊OTP的rsa公钥hash，默认仅⽀持撤销⼀次，需要⽀持多次撤销请联系RK⼯程师处理
#define OTP_NEXT_RSA_HASH_ADDR      0x1a0
#define OTP_NEXT_RSA_HASH_SIZE      32
#define OTP_RSA_HASH_REVOKE_VAL     0x3
#define OTP_RSA_HASH_REVOKE_ADDR    0x23
#define OTP_RSA_HASH_REVOKE_SIZE    1
```

Framework-Code:

```text
./drivers/misc/misc-uclass.c
```

Treibercode:

```text
// non-secure:
./drivers/misc/rockchip-efuse.c
./drivers/misc/rockchip-otp.c
// secure，以RK3588为例：
./drivers/misc/rk3588-secure-otp.S
```

#### 5.7.2 Schnittstellen

```text
int misc_read(struct udevice *dev, int offset, void *buf, int size)
int misc_write(struct udevice *dev, int offset, void *buf, int size)
// ⾃带回读校验
int misc_otp_write_verify(struct udevice *dev, int offset, const uint8_t *write_buf, int
size)
```

#### 5.7.3 DTS-Konfiguration

Beispiel RK3308, non-secure:

```text
otp: otp@ff210000 {
    compatible = "rockchip,rk3308-otp";
    reg = <0x0 0xff210000 0x0 0x4000>;
};
```

Secure wird in u-boot.dtsi definiert; Änderungen werden nicht empfohlen.

```text
secure_otp: secure_otp@0xff2a8000 {
    compatible = "rockchip,rk3308-secure-otp";
    reg = <0x0 0xff2a8000 0x0 0x4000>;
    secure_conf = <0xff2b0004>;
    mask_addr = <0xff540000>;
};
```

#### 5.7.4 Aufrufbeispiele

Non-secure-Beispiel:

```text
char data[10] = {0};
struct udevice *dev;

/* retrieve the device */
ret = uclass_get_device_by_driver(UCLASS_MISC,
                  DM_GET_DRIVER(rockchip_otp), &dev);
if (ret) {
    printf("no misc-device found\n");
    return 0;
}

misc_read(dev, 0x10, &data, 10);
```

Secure-Beispiel:

```text
char data[10] = {0};
struct udevice *dev;
int i;

dev = misc_otp_get_device(OTP_S);
if (!dev)
    return -ENODEV;
for (i = 0; i < 10; i++)
    data[i] = i;

// 基础版本
misc_otp_write(dev, 0x10, &data, 10);
memset(data, 0, 10);
misc_otp_read(dev, 0x10, &data, 10);
// 优化版本
misc_otp_write_verify(dev, 0x10, &data, 10);
```

#### 5.7.5 Freigegebene Bereiche

Secure OTP erlaubt Lesen/Schreiben nur bestimmter Bereiche; Einzelheiten im Rockchip-OTP-Entwicklerhandbuch.

### 5.8 Ethernet

#### 5.8.1 Framework-Unterstützung

Framework-Code:

```text
./net/*
./drivers/net/*
./drivers/net/phy/*
```

Treibercode:

```text
./drivers/net/designware.c
./drivers/net/dwc_eth_qos.c
./drivers/net/gmac_rockchip.c
```

Treiberkonfiguration mit menuconfig: Rockchip bietet zwei Ethernet-Treiber; bei der Auswahl die config des jeweiligen SDK beachten.

```text
// designware:
CONFIG_DM_ETH=y
CONFIG_ETH_DESIGNWARE=y
CONFIG_GMAC_ROCKCHIP=y
// dwc_eth_qos:
CONFIG_DM_ETH=y
CONFIG_DM_ETH_PHY=y
CONFIG_DWC_ETH_QOS=y
CONFIG_GMAC_ROCKCHIP=y
```

dwc_eth_qos benötigt zusätzlich nocache memory; Beispiel RV1126:

```text
diff --git a/include/configs/rv1126_common.h b/include/configs/rv1126_common.h
index 933917f3f0..9d70795fb8 100644
--- a/include/configs/rv1126_common.h
+++ b/include/configs/rv1126_common.h
@@ -50,6 +50,7 @@
 #define CONFIG_SYS_SDRAM_BASE          0
 #define SDRAM_MAX_SIZE                 0xfd000000

+#define CONFIG_SYS_NONCACHED_MEMORY    (1 << 20)       /* 1 MiB */
 #ifndef CONFIG_SPL_BUILD
```

Benötigte cmd-Funktionen manuell aktivieren.

```text
Command line interface  ---> Network commands  --->

[*] bootp, tftpboot
[ ] tftp put
[ ] tftp download and bootm
[ ] tftp download and flash
[ ] tftpsrv
[ ] rarpboot
-*- dhcp
-*- pxe
[ ] nfs
-*- mii
-*- ping
[ ] cdp
[ ] sntp
[ ] dns
[ ] linklocal
[ ] ethsw
```

#### 5.8.2 Schnittstellen

Schnittstelle zur Initialisierung der Datenstruktur:

```text
void net_init(void);
int eth_register(struct eth_device *dev);
int phy_init(void);
```

Schnittstelle zur Geräteregistrierung:

```text
int eth_register(struct eth_device *dev);
int phy_register(struct phy_driver *drv);
```

Netzwerkdaten und PHY-Zugriff: Senden/Empfangen in U-Boot erfordert einen expliziten Aufruf, nicht Interrupts oder Polling. Implementierung siehe NetLoop().

```text
int eth_send(void *packet, int length);
int eth_rx(void);

int phy_read(struct phy_device *phydev, int devad, int regnum);
int phy_write(struct phy_device *phydev, int devad, int regnum, u16 val);
```

#### 5.8.3 DTS-Konfiguration

DTS-Knoten entsprechen denen des Kernels. Boardspezifische Eigenschaften prüfen: phy-mode; PHY-Reset snps,reset-gpio und snps,reset-delays-us; Taktrichtung clock_in_out; Taktquelle/Frequenz assigned-clock-parents und assigned-clock-rates; für RGMII außerdem Delayline tx_delay und rx_delay.

```text
&gmac {
    phy-mode = "rgmii";
    clock_in_out = "input";

    snps,reset-gpio = <&gpio3 RK_PA0 GPIO_ACTIVE_LOW>;
    snps,reset-active-low;
    /* Reset time is 20ms, 100ms for rtl8211f */
    snps,reset-delays-us = <0 20000 100000>;

    assigned-clocks = <&cru CLK_GMAC_SRC>, <&cru CLK_GMAC_TX_RX>, <&cru
CLK_GMAC_ETHERNET_OUT>;
    assigned-clock-parents = <&cru CLK_GMAC_SRC_M1>, <&cru RGMII_MODE_CLK>;
    assigned-clock-rates = <125000000>, <0>, <25000000>;

    pinctrl-names = "default";
    pinctrl-0 = <&rgmiim1_pins &clk_out_ethernetm1_pins>;

    tx_delay = <0x2a>;
    rx_delay = <0x1a>;

    phy-handle = <&phy>;
    status = "okay";
};
```

#### 5.8.4 Anwendungsbeispiele

Häufige Netzwerkbefehle: DHCP

```text
Usage:
dhcp [loadAddress] [[hostIPaddr:]bootfilename]
```

Mit diesem Befehl müssen serverip, ipaddr und gateway nicht gesetzt werden. Nach erfolgreichem DHCP-Bezug lädt das Gerät die Datei per TFTP von hostIPaddr. 100M-Netz:

```text
=> dhcp 0x20000000 192.168.0.100:kernel.img
ethernet@ffc40000 Waiting for PHY auto negotiation to complete. done
BOOTP broadcast 1
DHCP client bound to address 192.168.0.106 (2 ms)
Using ethernet@ffc40000 device
TFTP from server 192.168.0.100; our IP address is 192.168.0.106
Filename 'kernel.img'.
Load address: 0x20000000
Loading: #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         ###############################################################
         1.5 MiB/s
done
Bytes transferred = 19054084 (122be04 hex)
```

PING

```text
=> ping 192.168.0.1
ethernet@ffc40000 Waiting for PHY auto negotiation to complete. done
Using ethernet@ffc40000 device
host 192.168.0.1 is alive
```

TFTP im 1000M-Netz:

```text
Usage:
tftp [loadAddress] [[hostIPaddr:]bootfilename]
```

Die IP kann auch manuell gesetzt werden:

```text
=> setenv ipaddr 192.168.1.101
=> setenv serverip 192.168.1.100

=> tftp kernel.img 0x20000000
ethernet@ffc40000 Waiting for PHY auto negotiation to complete. done
Using ethernet@ffc40000 device
TFTP from server 192.168.1.100; our IP address is 192.168.1.101
Filename 'kernel.img'.
Load address: 0x20000000
Loading: #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################
         12.2 MiB/s
done
Bytes transferred = 20275220 (1356014 hex)
```

#### 5.8.5 Netzwerkdiagnose

1. Netzwerk prüfen: PC-Firewall deaktiviert; Gateway bei subnetzübergreifendem Zugriff gesetzt; TFTP-Server korrekt konfiguriert; TFTP am Router nicht abgeschaltet.

2. Im Code drei Bereiche prüfen. Pinctrl: IOMUX und Treiberstärke korrekt; Registerdump mit Kernel vergleichen. Üblicherweise zuerst das Kernelnetzwerk und danach U-Boot in Betrieb nehmen. Takte: Teiler, Quelle und Richtung; Register liegen meist in CRU, auf manchen Chips teilweise in GRF; mit dem Kernel vergleichen. PHY-Reset: GPIO-Konfiguration und Reset-Wellenform gemäß PHY-Anforderungen.

### 5.9 Gpio

#### 5.9.1 Framework-Unterstützung

GPIO verwendet gpio-uclass und Standardschnittstellen. Konfiguration:

```text
CONFIG_DM_GPIO
CONFIG_ROCKCHIP_GPIO
```

Framework-Code:

```text
./drivers/gpio/gpio-uclass.c
```

Treibercode:

```text
./drivers/gpio/rk_gpio.c
```

#### 5.9.2 DM-Schnittstellen

Standard-DM-Schnittstelle: GPIO-Zugriff über struct gpio_desc; empfohlene Variante.

```text
// 申请/释放GPIO
int gpio_request_by_name(struct udevice *dev, const char *list_name,
                         int index, struct gpio_desc *desc, int flags);
int gpio_request_by_name_nodev(ofnode node, const char *list_name, int index,
                               struct gpio_desc *desc, int flags);
int gpio_request_list_by_name(struct udevice *dev, const char *list_name,
                              struct gpio_desc *desc_list, int max_count, int flags);
int gpio_request_list_by_name_nodev(ofnode node, const char *list_name,
                                    struct gpio_desc *desc_list, int max_count,
                                    int flags);
int dm_gpio_free(struct udevice *dev, struct gpio_desc *desc)

// 配置GPIO⽅向。@flags：GPIOD_IS_OUT（输出）和 GPIOD_IS_IN（输⼊）
int dm_gpio_set_dir_flags(struct gpio_desc *desc, ulong flags);

// 设置/获取GPIO电平
int dm_gpio_get_value(const struct gpio_desc *desc)
int dm_gpio_set_value(const struct gpio_desc *desc, int value)
```

dm_gpio_get_value() liefert den aktiven Zustand, nicht den physikalischen Pegel. Bei gpios = &lt;&amp;gpio2 RK_PD0 GPIO_ACTIVE_LOW&gt; ergibt Low 1 und High 0; bei GPIO_ACTIVE_HIGH umgekehrt. Auch value von dm_gpio_set_value() bedeutet 1=active, 0=inactive.

#### 5.9.3 Legacy-Schnittstellen

Die Kompatibilitätsschnittstelle erhält alte U-Boot-APIs. Intern wird DM verwendet, struct gpio_desc aber verborgen. Funktionsfähig, jedoch aus Sicht der DM-Standardisierung nicht empfohlen.

```text
int gpio_request(unsigned gpio, const char *label)
int gpio_free(unsigned gpio)
int gpio_direction_input(unsigned gpio)
int gpio_direction_output(unsigned gpio, int value)
int gpio_get_value(unsigned gpio)
int gpio_set_value(unsigned gpio, int value)
```

@gpio wird aus 32 Pins je GPIO-Gruppe und 8 Pins je Bank berechnet, beispielsweise:

```text
gpio0_a7 = (0 * 32) + (0 * 8) + 7 = 7
gpio1_b6 = (1 * 32) + (1 * 8) + 6 = 46
gpio3_c2 = (3 * 32) + (2 * 8) + 2 = 114
```

@value hat dieselbe Bedeutung wie in den obigen dm_gpio_-Schnittstellen.

### 5.10 Interrupt

#### 5.10.1 Framework-Unterstützung

Natives U-Boot enthält kein Interrupt-Framework. RK implementiert standardmäßig aktiviertes GICv2/v3. Anwendungen: pwrkey weckt die CPU beim Laden aus dem Energiesparmodus; Timer wird beim Laden und in Tests verwendet; Debug nutzt CONFIG_ROCKCHIP_DEBUGGER. Konfiguration:

```text
CONFIG_IRQ
CONFIG_GICV2
CONFIG_GICV3
```

Framework-Code:

```text
./drivers/irq/irq-gpio-switch.c
./drivers/irq/irq-gpio.c
./drivers/irq/irq-generic.c
./drivers/irq/irq-gic.c
./drivers/irq/virq.c
./include/irq-generic.h
```

#### 5.10.2 Schnittstellen

```text
// CPU本地中断开关
void enable_interrupts(void);
int disable_interrupts(void);

// GPIO转换成中断号
int gpio_to_irq(struct gpio_desc *gpio);
int phandle_gpio_to_irq(u32 gpio_phandle, u32 pin);
int hard_gpio_to_irq(unsigned gpio);

// 注册/释放中断回调
void irq_install_handler(int irq, interrupt_handler_t *handler, void *data);
void irq_free_handler(int irq);

// 使能/关闭中断
int irq_handler_enable(int irq);
int irq_handler_disable(int irq);

// 中断触发类型
int irq_set_irq_type(int irq, unsigned int type);
```

IRQ anfordern: Peripherie mit eigener Hardware-Interruptnummer wie PWM/Timer benötigt keine Umwandlung. GPIO-Pins haben keine eigene Nummer; es gibt drei Umwandlungswege. (1) struct gpio_desc übergeben:

```text
// 此⽅法可以动态解析dts配置，⽐较灵活、常⽤。
int gpio_to_irq(struct gpio_desc *gpio);
```

Beispiel:

```text
battery {
    compatible = "battery,rk817";
    ......
    dc_det_gpio = <&gpio2 7 GPIO_ACTIVE_LOW>;
    ......
};
struct gpio_desc dc_det;
int ret, irq;

ret = gpio_request_by_name_nodev(dev_ofnode(dev), "dc_det_gpio", 0,
                                 &dc_det, GPIOD_IS_IN);
// 为了⽰例简单，省去返回值判断
if (!ret) {
    irq = gpio_to_irq(&dc_det);
    irq_install_handler(irq, ...);
    irq_set_irq_type(irq, IRQ_TYPE_EDGE_FALLING);
    irq_handler_enable(irq);
}
```

(2) GPIO-phandle und pin übergeben:

```text
// 此⽅法可以动态解析dts配置，⽐较灵活、常⽤。
int phandle_gpio_to_irq(u32 gpio_phandle, u32 pin);
```

Beispiel: RK817-Interrupt an GPIO0_A7:

```text
rk817: pmic@20 {
    compatible = "rockchip,rk817";
    reg = <0x20>;
    ......
    interrupt-parent = <&gpio0>;             // "&gpio0": 指向gpio0节点的phandle；
    interrupts = <7 IRQ_TYPE_LEVEL_LOW>;     // "7": pin脚；
    ......
};
u32 interrupt[2], phandle;
int irq, ret;

phandle = dev_read_u32_default(dev->parent, "interrupt-parent", -1);
if (phandle < 0) {
    printf("failed get 'interrupt-parent', ret=%d\n", phandle);
    return phandle;
}

ret = dev_read_u32_array(dev->parent, "interrupts", interrupt, 2);
if (ret) {
    printf("failed get 'interrupt', ret=%d\n", ret);
    return ret;
}

// 为了⽰例简单，省去返回值判断
irq = phandle_gpio_to_irq(phandle, interrupt[0]);
irq_install_handler(irq, pwrkey_irq_handler, dev);
irq_set_irq_type(irq, IRQ_TYPE_EDGE_FALLING);
irq_handler_enable(irq);
```

(3) GPIO explizit angeben:

```text
// 此⽅法直接强制指定 gpio，传⼊的 gpio 必须通过特殊的宏来声明才⾏，不够灵活，不建议使⽤。
int hard_gpio_to_irq(unsigned gpio);
```

Beispiel für IRQ-Anforderung von GPIO0_A0:

```text
int gpio0_a0, irq;

// 为了⽰例简单，省去返回值判断
gpio0_a0 = RK_IRQ_GPIO(RK_GPIO0, RK_PA0);
irq = hard_gpio_to_irq(gpio0_a0);
irq_install_handler(irq, ...);
irq_handler_enable(irq);
```

### 5.11 I2C

#### 5.11.1 Framework-Unterstützung

I2C verwendet i2c-uclass und Standardschnittstellen. Konfiguration:

```text
CONFIG_DM_I2C
CONFIG_SYS_I2C_ROCKCHIP
```

Framework-Code:

```text
./drivers/i2c/i2c-uclass.c
```

Treibercode:

```text
./drivers/i2c/rk_i2c.c
./drivers/i2c/i2c-gpio.c    // gpio模拟i2c通讯，⽬前⽤不到
```

#### 5.11.2 Schnittstellen

```text
// i2c 读写
int dm_i2c_read(struct udevice *dev, uint offset, uint8_t *buffer, int len)
int dm_i2c_write(struct udevice *dev, uint offset, const uint8_t *buffer, int len)

// 对上⾯接⼝的封装
int dm_i2c_reg_read(struct udevice *dev, uint offset)
int dm_i2c_reg_write(struct udevice *dev, uint offset, unsigned int val);
```

### 5.12 IO-Domain

#### 5.12.1 Framework-Unterstützung

Natives U-Boot unterstützt io-domain nicht; RK implementiert eigene Unterstützung. Konfiguration:

```text
CONFIG_IO_DOMAIN
CONFIG_ROCKCHIP_IO_DOMAIN
```

Framework-Code:

```text
./drivers/power/io-domain/io-domain-uclass.c
```

Treibercode:

```text
./drivers/power/io-domain/rockchip-io-domain.c
```

#### 5.12.2 Schnittstellen

```text
void io_domain_init(void)
```

io_domain_init() muss nicht selbst aufgerufen werden: Obige Optionen aktivieren; U-Boot initialisiert automatisch.

### 5.13 Key

#### 5.13.1 Framework-Unterstützung

Natives U-Boot bietet keine Tastenunterstützung; RK implementiert ein eigenes Framework. Alle Tasten werden im Kernel-/U-Boot-DTS ohne Hardcoding definiert. Zuerst wird im Kernel-DTS gesucht, danach im U-Boot-DTS. Letzteres definiert nur die Programmiertaste; bei Änderung beide DTS aktualisieren. Konfiguration:

```text
CONFIG_DM_KEY
CONFIG_RK8XX_PWRKEY
CONFIG_ADC_KEY
CONFIG_GPIO_KEY
CONFIG_RK_KEY
```

Framework-Code:

```text
./include/dt-bindings/input/linux-event-codes.h
./drivers/input/key-uclass.c
./include/key.h
```

Treibercode:

```text
./drivers/input/rk8xx_pwrkey.c    // ⽀持PMIC的pwrkey(RK805/RK809/RK816/RK817)
./drivers/input/rk_key.c          // ⽀持compatible = "rockchip,key"
./drivers/input/gpio_key.c        // ⽀持compatible = "gpio-keys"
./drivers/input/adc_key.c         // ⽀持compatible = "adc-keys"
```

pwrkey wird ausschließlich per Interrupt erkannt, andere GPIO-Tasten per Polling.

#### 5.13.2 Schnittstellen

Schnittstelle:

```text
int key_read(int code)
```

code-Definitionen:

```text
/include/dt-bindings/input/linux-event-codes.h
```

Rückgabewert:

```text
enum key_state {
    KEY_PRESS_NONE,      // ⾮完整的短按（没有释放按键）或⾮完整⻓按（按下时间不够⻓）；
    KEY_PRESS_DOWN,      // ⼀次完整的短按（按下=>释放）；
    KEY_PRESS_LONG_DOWN, // ⼀次完整的⻓按（可以不释放）；
    KEY_NOT_EXIST,       // 按键不存在
};
```

KEY_PRESS_LONG_DOWN dauert standardmäßig 2000ms und wird nur für langes pwrkey-Drücken während des Ladens in U-Boot verwendet.

```text
#define KEY_LONG_DOWN_MS    2000
```

Beispiel:

```text
int ret;

ret = key_read(KEY_VOLUMEUP);
...
```

### 5.14 Led

#### 5.14.1 Framework-Unterstützung

LED verwendet led-uclass.c und Standardschnittstellen. Konfiguration:

```text
CONFIG_LED_GPIO
```

Framework-Code:

```text
drivers/led/led-uclass // 默认编译
```

Treibercode:

```text
drivers/led/led_gpio.c // ⽀持 compatible = "gpio-leds"
```

#### 5.14.2 Schnittstellen

```text
// 获取led device
int led_get_by_label(const char *label, struct udevice **devp);
// 设置/获取led状态
int led_set_state(struct udevice *dev, enum led_state_t state);
enum led_state_t led_get_state(struct udevice *dev);
// 忽略，⽬前未做底层驱动实现
int led_set_period(struct udevice *dev, int period_ms);
```

#### 5.14.3 DTS-Knoten

led_gpio.c von U-Boot liest nur drei Eigenschaften des LED-Knotens: gpios für Steuerpin und aktiven Pegel, label für den Namen, default-state für den bei probe gesetzten Anfangszustand.

```text
leds {
    compatible = "gpio-leds";
    status = "okay";

    blue-led {
        gpios = <&gpio2 RK_PA1 GPIO_ACTIVE_LOW>;
        label = "battery_full";
        default-state = "off";
    };

    green-led {
        gpios = <&gpio2 RK_PA0 GPIO_ACTIVE_LOW>;
        label = "greenled";
        default-state = "off";
    };

    ......
};
```

### 5.15 Mtd

MTD (Memory Technology Device) unterstützt paralleles NAND, SPI NAND und SPI NOR.

#### 5.15.1 Framework-Unterstützung

```text
CONFIG_MTD=y
CONFIG_CMD_MTD=y
```

#### 5.15.2 Schnittstellen

Häufige Schnittstellen:

```text
struct mtd_info *get_mtd_device_nm(const char *name);
int mtd_read(struct mtd_info *mtd, loff_t from, size_t len, size_t *retlen, u_char *buf);
int mtd_write(struct mtd_info *mtd, loff_t to, size_t len, size_t *retlen, const u_char
*buf);
int mtd_erase(struct mtd_info *mtd, struct erase_info *instr);
int mtd_block_isbad(struct mtd_info *mtd, loff_t ofs);
int mtd_block_markbad(struct mtd_info *mtd, loff_t ofs);
```

#### 5.15.3 Anwendungsbeispiele

SPI-NOR-Ladebeispiel: 0x800 bytes ab Flash-Offset 0x400000 byte nach Speicheradresse 0x4000000:

```text
#include <mtd.h>

#define MTD_SPINOR_NAME     "nor0"

static int mtd_demo(void)
{
    char *mtd_name = MTD_SPINOR_NAME;
    struct mtd_info *mtd;
    size_t retlen, off, size;
    u_char *des_buf;
    int ret;

    mtd = get_mtd_device_nm(mtd_name);
    if (IS_ERR_OR_NULL(mtd)) {
        printf("MTD device %s not found, ret %ld\n",
               mtd_name, PTR_ERR(mtd));
        return CMD_RET_FAILURE;
    }

    des_buf = (u_char *)0x4000000;

    off = 0x4000000;
    size = 0x800;

    ret = mtd_read(mtd, off, size, &retlen, des_buf);
    if (ret || size != retlen) {
        pr_err("mtd read fail, ret=%d retlen=%ld size=%ld\n", ret, retlen, size);
    }

    return ret;
}
```

Für NAND Lese-/Schreib-/Löschschnittstellen mit Bad-Block-Erkennung aus drivers/mtd/nand/nand_util.c verwenden. Für kleine vollständige Schreibvorgänge, üblicherweise unter 2KB je Einschalten, kommt MTD_BLK infrage; häufige Aufrufe beeinträchtigen die Flash-Lebensdauer.

### 5.16 Mtd_blk

RK implementiert eine MTD-Blockschicht über MTD für paralleles NAND, SPI NAND und SPI NOR und registriert passende Blockgeräte. Einheit ist ein 512B-Sektor. Jeder Schreibzugriff löscht unabhängig von seiner Größe den zugehörigen Flashblock; kleine häufige Schreibzugriffe verkürzen die Lebensdauer.

#### 5.16.1 Framework-Unterstützung

U-Boot-Konfiguration:

```text
// MTD驱动
CONFIG_MTD=y
CONFIG_CMD_MTDPARTS=y
CONFIG_MTD_DEVICE=y

// MTD block设备驱动
CONFIG_CMD_MTD_BLK=y
CONFIG_MTD_BLK=y

// 其他nand设备驱动config
......
```

SPL-Konfiguration:

```text
CONFIG_MTD=y
CONFIG_CMD_MTDPARTS=y
CONFIG_MTD_DEVICE=y
CONFIG_SPL_MTD_SUPPORT=y

// 其他nand设备驱动config
......
```

Framework-Code:

```text
drivers/mtd/mtd-uclass.c
drivers/mtd/mtdcore.c
drivers/mtd/mtd_uboot.c
drivers/mtd/mtd_blk.c
```

Die jeweiligen Controllertreiber binden Lesen, Schreiben und weitere Schnittstellen an MTD an.

#### 5.16.2 Schnittstellen

```text
unsigned long blk_dread(struct blk_desc *block_dev, lbaint_t start,
                        lbaint_t blkcnt, void *buffer)
unsigned long blk_dwrite(struct blk_desc *block_dev, lbaint_t start,
                        lbaint_t blkcnt, const void *buffer)
```

### 5.17 Optee Client

U-Boot läuft in der Non-Secure World von ARM TrustZone und benötigt OPTEE Client für sichere Ressourcen.

#### 5.17.1 Framework-Unterstützung

Natives U-Boot unterstützt OPTEE Client nicht; RK implementiert ihn selbst. Konfiguration:

```text
// 总使能
CONFIG_OPTEE_CLIENT

// 旧平台使⽤，如 RK312x、RK322x、RK3288、RK3228H、RK3368、RK3399
CONFIG_OPTEE_V1
// 新平台使⽤，如 RK3326、RK3308
CONFIG_OPTEE_V2
// 当 eMMC 的 RPMB 不能⽤时必须开启此配置，即启⽤security分区！
CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION
```

Framework und Treiber:

```text
lib/optee_clientApi/
```

#### 5.17.2 Firmwarehinweise

trust.img muss TA unterstützen; andernfalls ist keine Kommunikation mit OPTEE Client möglich.

#### 5.17.3 Schnittstellenbeschreibung

Der Treiber liegt in lib/optee_client. API-Beschreibung: TEE_Client_API_Specification-V1.0_c.pdf unter https://globalplatform.org/specs-library/tee-client-api-specification/. RK kapselt Funktionen eingebauter TAs in Optee-Client-Schnittstellen. Quelle: lib\optee_clientApi\OpteeClientInterface.c; include\optee_include\OpteeClientInterface.h einbinden. Nachfolgend ausgewählte APIs.

##### 5.17.3.1 Anwendbarkeit

Plattformbezogene Anwendbarkeit siehe Kapitel zu Plattformdefinitionen.

```text
trusty_base_write_security_data()
trusty_base_read_security_data()
trusty_read_vbootkey_hash()
trusty_write_vbootkey_hash()
trusty_read_vbootkey_enable_flag()
trusty_read_attribute_hash()
trusty_write_attribute_hash()
trusty_write_oem_otp_key()
trusty_oem_otp_key_is_written()
trusty_set_oem_hr_otp_read_lock()
trusty_oem_otp_key_cipher()
trusty_read_oem_ns_otp()
trusty_write_oem_ns_otp()
trusty_write_ta_encryption_key()
trusty_ta_encryption_key_is_written()
trusty_write_oem_encrypt_data()
trusty_oem_encrypt_data_is_written()
trusty_check_security_level_flag()
trusty_write_oem_huk()
```

##### 5.17.3.2 Rückgabewerte

Soweit nicht anders angegeben, entsprechen API-Rückgabewerte dem Abschnitt Return Codes in TEE_Client_API_Specification-V1.0_c.pdf.

##### 5.17.3.3 trusty_base_write_security_data

```text
uint32_t trusty_base_write_security_data(char *filename,
                        uint32_t filename_size,
                        uint8_t *data,
                        uint32_t data_size)
```

Schreibt Daten in sicheren Speicher: RPMB bei eMMC/UFS, security bei anderen Medien wie NAND. CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION erzwingt security. Parameter: [in] filename — Name; [in] filename_size — Namenslänge; [in] data — zu schreibende Daten; [in] data_size — Datenlänge.

##### 5.17.3.4 trusty_base_read_security_data

```text
uint32_t trusty_base_read_security_data(char *filename,
                           uint32_t filename_size,
                           uint8_t *data,
                           uint32_t data_size)
```

Liest sicheren Speicher: RPMB bei eMMC/UFS, security bei anderen Medien wie NAND. CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION erzwingt security. Parameter gemäß Vorlage: [in] filename — Name; [in] filename_size — Namenslänge; [in] data — gelesene Daten; [in] data_size — Leselänge.

##### 5.17.3.5 trusty_read_vbootkey_hash

```text
uint32_t trusty_read_vbootkey_hash(uint32_t *buf, uint32_t length);
```

Liest den Hash des Secure-Boot-Public-Keys aus OTP/eFuse. Siehe Rockchip_Developer_Guide_Secure_Boot_Application_Note_EN. [out] buf — Hashpuffer; [in] length — Hashlänge in word (32bits); unterstützte Längen/Algorithmen siehe Secure-Boot-Handbuch.

##### 5.17.3.6 trusty_write_vbootkey_hash

```text
uint32_t trusty_write_vbootkey_hash(uint32_t *buf, uint32_t length);
```

Schreibt den Public-Key-Hash in OTP/eFuse und aktiviert zugleich das Secure-Boot-Flag. Siehe Rockchip_Developer_Guide_Secure_Boot_Application_Note_EN. [in] buf — Hash; [in] length — Länge in word (32bits), zulässige Längen/Algorithmen gemäß Secure-Boot-Handbuch.

##### 5.17.3.7 trusty_read_vbootkey_enable_flag

```text
uint32_t trusty_read_vbootkey_enable_flag(uint8_t *flag);
```

Liest den Secure-Boot-Aktivierungsstatus; siehe Rockchip_Developer_Guide_Secure_Boot_Application_Note_EN. Parameter gemäß Vorlage [in] flag — 1 Byte: 1 aktiviert, 0 deaktiviert.

##### 5.17.3.8 trusty_read_attribute_hash

```text
uint32_t trusty_read_attribute_hash(uint32_t *buf, uint32_t length)
```

Liest den Hash von atx_permanent_attributes.bin zur Gültigkeitsprüfung.

[out] buf — Hash; [in] length — Länge.

##### 5.17.3.9 trusty_write_attribute_hash

```text
uint32_t trusty_write_attribute_hash(uint32_t *buf, uint32_t length)
```

Schreibt den Hash von atx_permanent_attributes.bin. [in] buf — Hash; [in] length — Länge.

##### 5.17.3.10 trusty_write_oem_otp_key

```text
uint32_t trusty_write_oem_otp_key(enum RK_OEM_OTP_KEYID key_id,
                                  uint8_t *byte_buf,
                                  uint32_t byte_len);
```

Schreibt Klartext-Schlüsselmaterial in den angegebenen OEM-OTP-Bereich. Siehe Rockchip_Developer_Guide_OTP_CN. [in] key_id — normalerweise einer von vier RK_OEM_OTP_KEY0–3; RV1126/RV1109 unterstützen zusätzlich RK_OEM_OTP_KEY_FW zum BootROM-Entschlüsseln des Loaders. trusty_oem_otp_key_cipher kann ihn für Anwendungsdaten oder Kernel-Image-Entschlüsselung verwenden. [in] byte_buf — Klartextschlüssel; [in] byte_len — Länge: für RK_OEM_OTP_KEY_FW nur 16, für andere Schlüssel

16, 24 oder 32.

##### 5.17.3.11 trusty_oem_otp_key_is_written

```text
uint32_t trusty_oem_otp_key_is_written(enum RK_OEM_OTP_KEYID key_id, uint8_t *value);
```

Prüft, ob der Schlüssel im OEM-OTP-Bereich geschrieben ist; Eigenschaften siehe Rockchip_Developer_Guide_OTP_CN.

[in] key_id — Bereichsindex: RK_OEM_OTP_KEY0–3, zusätzlich RK_OEM_OTP_KEY_FW bei RV1126/RV1109. [out] value — 1 geschrieben, 0 ungeschrieben; nur bei TEEC_SUCCESS 0x00000000 gültig. RK3588 prüft zusätzlich die Sperre von key_id und liefert bei gesperrtem Schlüssel TEEC_ERROR_ACCESS_DENIED 0xFFFF0001.

##### 5.17.3.12 trusty_set_oem_hr_otp_read_lock

```text
uint32_t trusty_set_oem_hr_otp_read_lock(enum RK_OEM_OTP_KEYID key_id);
```

Setzt read lock des OEM-OTP-Bereichs. Danach ist Schreiben verboten und vorhandene Daten sind für CPU-Software unlesbar; der Schlüssel bleibt über trusty_oem_otp_key_cipher nutzbar. Siehe Rockchip_Developer_Guide_OTP_CN. Wichtig: Sperren von RK_OEM_OTP_KEY0, KEY1 oder KEY2 beeinflusst weitere OTP-Bereiche, etwa durch Schreibsperren; Einzelheiten im genannten Handbuch. [in] key_id — RK_OEM_OTP_KEY0–3.

##### 5.17.3.13 trusty_oem_otp_key_cipher

```text
uint32_t trusty_oem_otp_key_cipher(enum RK_OEM_OTP_KEYID key_id,
                                   rk_cipher_config *config,
                                   uint32_t src_phys_addr,
                                   uint32_t dst_phys_addr,
                                   uint32_t len);
```

Führt eine einzelne Cipher-Operation mit einem OEM-OTP-Schlüssel aus. [in] key_id — RK_OEM_OTP_KEY0–3, zusätzlich RK_OEM_OTP_KEY_FW bei RV1126/RV1109. [in] config — Algorithmus, Modus, Schlüssel, IV usw.; AES/SM4, Modi ECB/CBC/CTS/CTR/CFB/OFB.

Schlüssellängen: 16/24/32 Bytes; RV1109/RV1126 nur 16/32, RK_OEM_OTP_KEY_FW nur 16. [in] src_phys_addr — Eingabepufferadresse, darf für In-place-Verarbeitung dst_phys_addr entsprechen; [out] dst_phys_addr — Ausgabepuffer, darf src_phys_addr entsprechen; [in] len — Ein-/Ausgabelänge in Byte, auf Algorithmusblockgröße ausgerichtet.

##### 5.17.3.14 trusty_read_oem_ns_otp

```text
uint32_t trusty_read_oem_ns_otp(uint32_t byte_off, uint8_t *byte_buf, uint32_t byte_len)
```

Liest die Non-Protected OEM Zone der sicheren OTP. [in] byte_off — Bereichsoffset; [out] byte_buf — Ergebnis, Speicher mindestens byte_len groß; [in] byte_len — Leselänge.

##### 5.17.3.15 trusty_write_oem_ns_otp

```text
uint32_t trusty_write_oem_ns_otp(uint32_t byte_off, uint8_t *byte_buf, uint32_t byte_len)
```

Schreibt die Non-Protected OEM Zone der sicheren OTP. [in] byte_off — Offset; [in] byte_buf — Daten; [in] byte_len — Länge.

##### 5.17.3.16 trusty_write_ta_encryption_key

```text
uint32_t trusty_write_ta_encryption_key(uint32_t *buf, uint32_t length)
```

Schreibt den TA-Verschlüsselungsschlüssel. [in] buf — Schlüssel; [in] length — Länge.

##### 5.17.3.17 trusty_ta_encryption_key_is_written

```text
uint32_t trusty_ta_encryption_key_is_written(uint8_t *value)
```

Prüft den geschriebenen TA-Verschlüsselungsschlüssel. [out] value — 0 ungeschrieben, 1 geschrieben.

##### 5.17.3.18 trusty_write_oem_encrypt_data

```text
uint32_t trusty_write_oem_encrypt_data(uint32_t *buf, uint32_t length)
```

Schreibt private Anti-Copy-Board-Daten. [in] buf — Daten; [in] length — Länge.

##### 5.17.3.19 trusty_oem_encrypt_data_is_written

```text
uint32_t trusty_oem_encrypt_data_is_written(uint8_t *value)
```

Prüft geschriebene private Anti-Copy-Board-Daten. [out] value — 0 ungeschrieben, 1 geschrieben.

##### 5.17.3.20 trusty_check_security_level_flag

```text
uint32_t trusty_check_security_level_flag(uint8_t flag)
```

Setzt das starke/schwache TEE-Sicherheitsniveau. [in] flag — Sicherheitsniveau.

##### 5.17.3.21 trusty_write_oem_huk

```text
uint32_t trusty_write_oem_huk(uint32_t *buf, uint32_t length)
```

Schreibt OEM HUK. [in] buf — Daten; [in] length — Länge.

#### 5.17.4 Shared Memory

U-Boot/OPTEE-Kommunikation verwendet Shared Memory. Mit TEEC_AllocateSharedMemory() möglichst höchstens 1M reservieren; größere Daten auf mehrere Übertragungen aufteilen. Mit TEEC_ReleaseSharedMemory() freigeben.

#### 5.17.5 Testbefehle

Test des sicheren Speichers in der U-Boot-Befehlszeile:

```text
=> mmc testsecurestorage
```

Der Test liest und schreibt sicheren Speicher zyklisch. Bei eMMC werden RPMB und security geprüft, bei NAND nur security.

#### 5.17.6 Häufige Fehlermeldungen

eMMC/NAND nicht gefunden; U-Boot-Konfiguration und Hardware prüfen.

```text
"TEEC: Could not find device"
```

security-Partition nicht gefunden. Ohne RPMB security in parameter.txt definieren.

```text
"TEEC: Could not find security partition"
```

Diese Meldung erscheint bei erstmaliger Verwendung von security oder unzulässiger Datenmanipulation.

```text
"TEEC: verify [%d] fail, cleanning ...."
```

Sicherer Speicher voll: Datengröße und nicht gelöschte alte Daten prüfen.

```text
"TEEC: Not enough space available in secure storage !"
```

### 5.18 PCIe

#### 5.18.1 Entwicklungshinweise

Die U-Boot-Phase für PCIe festlegen und DTS entsprechend konfigurieren:

1. Boot-NVMe benötigt frühe Initialisierung: Alle weiteren Firmwares liegen darauf; PCIe kann daher nur das U-Boot-DTS nutzen.

2. Nicht-Bootgeräte wie Netzwerkkarten erlauben späte Initialisierung; Kernel-DTB aus boot.img kann verwendet werden.

3. U-Boot-PCIe-RC registriert nur mem 32bits range, nicht mem 64bits-pref.

#### 5.18.2 Framework-Unterstützung

Framework-Code:

```text
./drivers/pci/*
./drivers/phy/*
```

Treibercode:

```text
drivers/pci/pcie_dw_rockchip.c
drivers/phy/phy-rockchip-snps-pcie3.c
drivers/phy/phy-rockchip-naneng-combphy.c
```

Treiberkonfiguration mit menuconfig: Unterstützte Rockchip-PCIe-Plattformen stehen in compatible von pcie_dw_rockchip.c; bei der Auswahl SDK-config beachten.

```text
CONFIG_DM_REGULATOR_GPIO=y
CONFIG_DM_REGULATOR_FIXED=y
CONFIG_PCI=y
CONFIG_DM_PCI=y
CONFIG_DM_PCI_COMPAT=y
CONFIG_PCI_PNP=y
CONFIG_PCIE_DW_ROCKCHIP=y
CONFIG_PHY_ROCKCHIP_SNPS_PCIE3=y
CONFIG_PHY_ROCKCHIP_NANENG_COMBOPHY=y
CONFIG_PHY=y
CONFIG_CMD_PCI=y
//添加NVMe⽀持
CONFIG_NVME=y
CONFIG_CMD_NVME=y
//添加PCIe转USB⽀持
CONFIG_USB_XHCI_PCI=y
//添加Embedded DTB ⽀持, 增加Embedded DTB ⽀持后镜像⼤⼩会变⼤
CONFIG_EMBED_KERNEL_DTB_ALWAYS=y
CONFIG_SPL_FIT_IMAGE_KB=2560
```

#### 5.18.3 DTS-Konfiguration

Phasenwahl: flash + PCIe NVMe vor Kernel-DTB; AMP nach Embedded-DTB; allgemein nach Kernel-DTB. Für frühes PCIe Kernel-DTB-Knoten ins U-Boot-DTSI übertragen und u-boot,dm-pre-reloc ergänzen: PHY-Versorgung (entbehrlich, wenn bereits aktiv), vcc 3v3, PHY und Controller. Beispiel RK3588 PCIe3x4:

```text
diff --git a/arch/arm/dts/rk3588-u-boot.dtsi b/arch/arm/dts/rk3588-u-boot.dtsi
index 3fe8054aac..a8e2defbad 100644
--- a/arch/arm/dts/rk3588-u-boot.dtsi
+++ b/arch/arm/dts/rk3588-u-boot.dtsi
@@ -22,6 +22,28 @@
                compatible = "rockchip,rk3588-secure-otp";
                reg = <0x0 0xfe3a0000 0x0 0x4000>;
        };
+
+       vcc12v_dcin: vcc12v-dcin {
+               u-boot,dm-pre-reloc;
+               compatible = "regulator-fixed";
+               regulator-name = "vcc12v_dcin";
+               regulator-always-on;
+               regulator-boot-on;
+               regulator-min-microvolt = <12000000>;
+               regulator-max-microvolt = <12000000>;
+       };
+
+       vcc3v3_pcie30: vcc3v3-pcie30 {
+               u-boot,dm-pre-reloc;
+               compatible = "regulator-fixed";
+               regulator-name = "vcc3v3_pcie30";
+               regulator-min-microvolt = <3300000>;
+               regulator-max-microvolt = <3300000>;
+               enable-active-high;
+               gpio = <&gpio3 RK_PC3 GPIO_ACTIVE_HIGH>;
+               startup-delay-us = <5000>;
+               vin-supply = <&vcc12v_dcin>;
+       };
 };

 &firmware {
@@ -117,6 +139,19 @@
        status = "okay";
 };

+&pcie30phy {
+       u-boot,dm-pre-reloc;
+       rockchip,pcie30-phymode = <PHY_MODE_PCIE_AGGREGATION>;
+       status = "okay";
+};
+
+&pcie3x4 {
+       u-boot,dm-pre-reloc;
+       reset-gpios = <&gpio4 RK_PB6 GPIO_ACTIVE_HIGH>;
+       vpcie3v3-supply = <&vcc3v3_pcie30>;
+       status = "okay";
+};
+
 &uart2 {
        u-boot,dm-spl;
        status = "okay";
```

Beispiel RK3566:

```text
From b58a47956bbd03de0fcef572fa06cdeea974e2a9 Mon Sep 17 00:00:00 2001
From: Jon Lin <jon.lin@rock-chips.com>
Date: Thu, 9 Mar 2023 15:29:37 +0800
Subject: [PATCH] TEST: uboot: rk3566_evb2_v11: nvme

Change-Id: I87b3786a433691f3c385460fa8636291bce8ed9a
Signed-off-by: Jon Lin <jon.lin@rock-chips.com>
---
 arch/arm/dts/rk3568-u-boot.dtsi | 43 +++++++++++++++++++++++++++++++++
 configs/rk3568_defconfig        | 13 ++++++++++
 2 files changed, 56 insertions(+)

diff --git a/arch/arm/dts/rk3568-u-boot.dtsi b/arch/arm/dts/rk3568-u-boot.dtsi
index a0678e35db..1ab8ea4436 100644
--- a/arch/arm/dts/rk3568-u-boot.dtsi
+++ b/arch/arm/dts/rk3568-u-boot.dtsi
@@ -26,6 +26,27 @@
        cru_rst_addr = <0xfdd20470>;
        u-boot,dm-spl;
    };
+
+   dc_12v: dc-12v {
+       compatible = "regulator-fixed";
+       regulator-name = "dc_12v";
+       regulator-always-on;
+       regulator-boot-on;
+       regulator-min-microvolt = <12000000>;
+       regulator-max-microvolt = <12000000>;
+   };
+
+   vcc3v3_pcie: gpio-regulator {
+       u-boot,dm-pre-reloc;
+       compatible = "regulator-fixed";
+       regulator-name = "vcc3v3_pcie";
+       regulator-min-microvolt = <3300000>;
+       regulator-max-microvolt = <3300000>;
+       enable-active-high;
+       gpio = <&gpio0 RK_PC2 GPIO_ACTIVE_HIGH>;
+       startup-delay-us = <5000>;
+       vin-supply = <&dc_12v>;
+   };
 };

 &psci {
@@ -386,6 +407,28 @@
    status = "okay";
 };

+&pipegrf {
+   u-boot,dm-pre-reloc;
+   status = "okay";
+};
+
+&pipe_phy_grf2 {
+   u-boot,dm-pre-reloc;
+   status = "okay";
+};
+
+&combphy2_psq {
+   u-boot,dm-pre-reloc;
+   status = "okay";
+};
+
+&pcie2x1 {
+   u-boot,dm-pre-reloc;
+   reset-gpios = <&gpio1 RK_PB2 GPIO_ACTIVE_HIGH>;
+   vpcie3v3-supply = <&vcc3v3_pcie>;
+   status = "okay";
+};
+
 &pinctrl {
    u-boot,dm-pre-reloc;
    status = "okay";
```

PCIe nach Embedded-DTB: Ein eingebetteter DTB isoliert U-Boot von Kernel-DTB-Änderungen und eignet sich auch für Produkte ohne Kernel. Üblicherweise stammt er aus dem Standard-Kernel-DTB. Zunächst Kernel bauen und Ziel-DTB erzeugen, dann Embedded-DTB in U-Boot aktivieren:

```text
CONFIG_EMBED_KERNEL_DTB=y
CONFIG_EMBED_KERNEL_DTB_ALWAYS=y
CONFIG_EMBED_KERNEL_DTB_PATH=”./dts/rk⽬标芯⽚-⽬标设备.dtb“  # 例如
CONFIG_EMBED_KERNEL_DTB_PATH="dts/rk3588-evb1.dtb"
```

U-Boot-Image bauen. Für AMP ohne frühes PCIe und ohne Kernel, aber mit nötiger PCIe-Enumeration vor AMP-Laden, folgenden Patch zur Enumeration im Startablauf verwenden:

```text
diff --git a/arch/arm/mach-rockchip/board.c b/arch/arm/mach-rockchip/board.c
index 979598ff7b..87d131e118 100644
--- a/arch/arm/mach-rockchip/board.c
+++ b/arch/arm/mach-rockchip/board.c
@@ -537,6 +537,11 @@ int board_init(void)
        io_domain_init();
 #endif
        set_armclk_rate();
+
+#ifdef CONFIG_PCI
+       pci_init();
+#endif
+
 #ifdef CONFIG_DM_DVFS
        dvfs_init(true);
 #endif
```

PCIe nach Kernel-DTB: Aufrufe nach der Phase „RK u-boot using kernel DTB“ platzieren und Kernel-DTB direkt wiederverwenden. Siehe Kernel-PCIe-Konfigurationsdokumentation.

#### 5.18.4 Anwendungsbeispiele

Häufige Befehle:

##### 5.18.4.1 PCIe CMD

```text
## Chapter-5 PCI 枚举，其中 CFG 映射的内存地址为 0x00000000f0000000
=> pci enum
pcie@fe150000: PCIe Linking... LTSSM is 0x1
pcie@fe150000: PCIe Linking... LTSSM is 0x6
pcie@fe150000: PCIe Linking... LTSSM is 0x4
pcie@fe150000: PCIe Linking... LTSSM is 0x210023
pcie@fe150000: PCIe Link up, LTSSM is 0x230011
pcie@fe150000: PCIE-0: Link up (Gen3-x2, Bus0)
pcie@fe150000: invalid flags type!
pcie@fe150000: Config space: [0x00000000f0000000 - 0x00000000f0100000, size 0x100000]

## Chapter-5 扫描所有设备
=> pci
BusDevFun  VendorId   DeviceId   Device Class       Sub-Class
_____________________________________________________________
00.00.00   0x1d87     0x3588     Bridge device           0x04
01.00.00   0x144d     0xa809     Mass storage controller 0x08

## Chapter-5 显⽰ bus 01 设备详细信息
=> pci 01 long
Scanning PCI devices on bus 1

Found PCI device 01.00.00:
  vendor ID =                   0x144d
  device ID =                   0xa809
  command register ID =         0x0006
  status register =             0x0010
  revision ID =                 0x00
  class code =                  0x01 (Mass storage controller)
  sub class code =              0x08
  programming interface =       0x02
  cache line =                  0x08
  latency time =                0x00
  header type =                 0x00
  BIST =                        0x00
  base address 0 =              0xf0300004
  base address 1 =              0x00000000
  base address 2 =              0x00000000
  base address 3 =              0x00000000
  base address 4 =              0x00000000
  base address 5 =              0x00000000
  cardBus CIS pointer =         0x00000000
  sub system vendor ID =        0x144d
  sub system ID =               0xa801
  expansion ROM base address =  0x00000000
  interrupt line =              0xff
  interrupt pin =               0x01
  min Grant =                   0x00
  max Latency =                 0x00
## Chapter-5 显⽰ bdf 01.00.00 设备 bar 映射地址，⽰例代码显⽰ bar0 映射内存地址 0xf0300000，size
0x4000，
=> pci bar 01.00.00
ID   Base                Size                Width  Type
----------------------------------------------------------
 0   0x00000000f0300000  0x0000000000004000  64     MEM

## Chapter-5 读取 bdf 01.00.00 设备 CFG 空间信息
=> pci d.w 01.00.00 0
00000000: 144d a809 0006 0010 0200 0108 0008 0000
00000010: 0004 f030 0000 0000 0000 0000 0000 0000
00000020: 0000 0000 0000 0000 0000 0000 144d a801
00000030: 0000 0000 0040 0000 0000 0000 01ff 0000

## Chapter-5 AER功能，⽤于读取指定设备的AER寄存器信息，输出格式与Linux lspci⼯具⼀致。
=> pci aer 01.00.0
    AER Capability found at offset 0x40
    UESta: DLP-- SDES-- TLP-- FCP-- CmpltTO-- CmpltAbrt-- UnxCmplt-- RxOF-- MalfTLP-- ECRC--
UnsupReq-- ACSViol--
    UEMsk: DLP-- SDES-- TLP-- FCP-- CmpltTO-- CmpltAbrt-- UnxCmplt-- RxOF-- MalfTLP-- ECRC--
UnsupReq-- ACSViol--
    UESvrt: DLP+ SDES- TLP+ FCP- CmpltTO- CmpltAbrt- UnxCmplt- RxOF- MalfTLP- ECRC-
UnsupReq- ACSViol-
    CESta: RxErr-- BadTLP-- BadDLLP-- Rollover-- Timeout-- NonFatalErr--
    CEMsk: RxErr-- BadTLP-- BadDLLP-- Rollover-- Timeout-- NonFatalErr--
    AERCap: First Error Pointer: 00, GenCap- CGenEn- ChkCap- ChkEn-

## Chapter-5 retrain link功能，⽤于链路重新建⽴
=> pci x 01.00.0
    Retrain triggered for device 0001:0000
    Link Status for device 0001:0000: 0x1022
    Speed: Gen3
    Width: x2
    Link Up: Yes

## Chapter-5 FLR(Function Level Reset)功能，⽤于复位外设功能
=> pci flr 01.00.0
    FLR completed and state restored for device 01:00.0
```

##### 5.18.4.2 NVMe

```text
## Chapter-5 发起nvme 扫描
=> nvme scan

## Chapter-5 罗列nvme设备详细信息
=> nvme details
    Blk device 0: Optional Admin Command Support:
            Namespace Management/Attachment: no
            Firmware Commit/Image download: yes
            Format NVM: yes
            Security Send/Receive: no
    Blk device 0: Optional NVM Command Support:
            Reservation: yes
            Save/Select field in the Set/Get features: yes
            Write Zeroes: yes
            Dataset Management: yes
            Write Uncorrectable: yes
    Blk device 0: Format NVM Attributes:
            Support Cryptographic Erase: No
            Support erase a particular namespace: Yes
            Support format a particular namespace: Yes
    Blk device 0: LBA Format Support:
    Blk device 0: End-to-End DataProtect Capabilities:
            As last eight bytes: No
            As first eight bytes: No
            Support Type3: No
            Support Type2: No
            Support Type1: No
    Blk device 0: Metadata capabilities:
            As part of a separate buffer: No
            As part of an extended data LBA: No

## Chapter-5 看到⼀个256GB的NVMe, 如果看不到容量，需要拔出设备确保完全掉电，重来。
=> nvme info
    Device 0: Vendor: 0x144d Rev: EXD7201Q Prod: S444NA0M384608
                Type: Hard Disk
                Capacity: 244198.3 MB = 238.4 GB (500118192 x 512)

## Chapter-5 选择ID为0的nvme设备
=> nvme device 0

Device 0: Vendor: 0x144d Rev: EXD7201Q Prod: S444NA0M384608
            Type: Hard Disk
            Capacity: 244198.3 MB = 238.4 GB (500118192 x 512)
... is now current device

## Chapter-5 将0x40000000内存设置位0x55aa55aa
=> md.l 0x40000000 1
    40000000: d08ec033                               3...
=> mw.l 0x40000000 0x55aa55aa
=> md.l 0x40000000 1
    40000000: 55aa55aa                               .U.U

## Chapter-5 从0x40000000内存开始取1个block数据，写⼊NVME的LBA 0地址
=> nvme write 0x40000000 0x0 0x1

    nvme write: device 0 block # 0, count 1 ... 1 blocks written: OK

## Chapter-5 检查下0x44000000内存，确认原始数据
=> md.l 0x44000000 1
    44000000: ffffffff                               ....

## Chapter-5 从NVMe的LBA 0地址，读取1个block数据，写⼊内存0x44000000
=> nvme read 0x44000000 0x0 0x1
    nvme read: device 0 block # 0, count 1 ... 1 blocks read: OK

## Chapter-5 确认0x44000000内存数据是从NVMe读回来的
=> md.l 0x44000000 1
    44000000: 55aa55aa

## Chapter-5 从0地址开始，擦除⼀个block
=> nvme erase 0x0 0x1
    nvme erase: device 0 block # 0, count 1 ... 1 blocks erased: OK

## Chapter-5 从NVMe的LBA 0地址，读取1个block数据，写⼊内存0x44000000
=> nvme read 0x44000000 0x0 0x1
    nvme read: device 0 block # 0, count 1 ... 1 blocks read: OK

## Chapter-5 确认0x44000000内存数据是从NVMe读回来的
=> md.l 0x44000000 0x200        #NVMe第⼀个block的数据已经清除了
    44000000: 00000000 00000000 00000000 00000000    ................
    44000010: 00000000 00000000 00000000 00000000    ................
    44000020: 00000000 00000000 00000000 00000000    ................
    ...

## Chapter-5 使⽤write zero功能清空0x100地址开始的⼀个block数据
=> nvme write_zeroes 0x100 0x1
    nvme write_zeroes: device 0 block # 0x100, count 1 ... 1 blocks write_zeroed: OK
```

##### 5.18.4.3 RK3588 RC dma

```text
=> pci
BusDevFun  VendorId   DeviceId   Device Class       Sub-Class
_____________________________________________________________
00.00.00   0x1d87     0x3588     Bridge device           0x04
01.00.00   0x1d87     0x356a     ???                     0x00
=> pci 1 long
Scanning PCI devices on bus 1

Found PCI device 01.00.00:
  vendor ID =                   0x1d87
  device ID =                   0x356a
  command register ID =         0x0006
  status register =             0x0010
  revision ID =                 0x01
  class code =                  0x12 (???)
  sub class code =              0x00
  programming interface =       0x00
  cache line =                  0x08
  latency time =                0x00
  header type =                 0x00
  BIST =                        0x00
  base address 0 =              0xf0400000    # BAR0 映射的 CPU 地址，由于 RK PCIe 采⽤ CPU-BUS
⼀⼀映射，所以 bus addr 相同值
  base address 1 =              0x00000000
  base address 2 =              0x0400000c
  base address 3 =              0x00000000
  base address 4 =              0xf0800000
  base address 5 =              0x00000000
  cardBus CIS pointer =         0x00000000
  sub system vendor ID =        0x0000
  sub system ID =               0x0000
  expansion ROM base address =  0x00000000
  interrupt line =              0xff
  interrupt pin =               0x01
  min Grant =                   0x00
  max Latency =                 0x00
=>

## Chapter-5 BAR CPU 访问，PIO 访问
md.l 0xf0400000 0x40

## Chapter-5 DMA read
mw.l 0x3c000000 0xffffffff
dcache flush 0x3c000000 0x100      # flush
mw.l 0xf538002c 0x1
mw.l 0xf5380300 0x4000008
mw.l 0xf5380304 0x0
mw.l 0xf5380308 0x100
mw.l 0xf538030c 0xf0400000
mw.l 0xf5380310 0x0
mw.l 0xf5380314 0x3c000000
mw.l 0xf5380318 0x0
mw.l 0xf5380030 0x0
dcache invalidate 0x3c000000 0x100  # invalidate
md.l 0x3c000000

## Chapter-5 DMA write
mw.l 0x3c000000 0xffffffff
dcache flush 0x3c000000 0x100 # flush
mw.l 0xf538000c 0x1
mw.l 0xf5380200 0x4000008
mw.l 0xf5380204 0x0
mw.l 0xf5380208 0x100
mw.l 0xf538020c 0x3c000000
mw.l 0xf5380210 0x0
mw.l 0xf5380214 0xf0400000
mw.l 0xf5380218 0x0
mw.l 0xf5380010 0x0
md.l 0x3c000000 0x40
```

dcache flush/clean wird über CONFIG_CMD_CACHE aktiviert; folgender Unterstützungspatch ist erforderlich:

```text
commit b46a81a12dd4a1514a6522e33a1d16194f242d62
Author: Joseph Chen <chenjh@rock-chips.com>
Date:   Wed Sep 28 01:36:45 2022 +0000

    cmd: cache: Add flush/invalidate dcache range support

    Signed-off-by: Joseph Chen <chenjh@rock-chips.com>
    Change-Id: Id0e0cd9019072e8c557ebd2987b439057cb4ae3b
```

##### 5.18.4.4 RK3568 RC dma

```text
=> pci
BusDevFun  VendorId   DeviceId   Device Class       Sub-Class
_____________________________________________________________
00.00.00   0x1d87     0x356a     Bridge device           0x04
01.00.00   0x1d87     0x356a     ???                     0x00
=> pci 1 long
Scanning PCI devices on bus 1

Found PCI device 01.00.00:
  vendor ID =                   0x1d87
  device ID =                   0x356a
  command register ID =         0x0006
  status register =             0x0010
  revision ID =                 0x01
  class code =                  0x12 (???)
  sub class code =              0x00
  programming interface =       0x00
  cache line =                  0x08
  latency time =                0x00
  header type =                 0x00
  BIST =                        0x00
  base address 0 =              0xf0400000    # BAR0 映射的 CPU 地址，由于 RK PCIe 采⽤ CPU-BUS
⼀⼀映射，所以 bus addr 相同值
  base address 1 =              0x00000000
  base address 2 =              0x0400000c
  base address 3 =              0x00000000
  base address 4 =              0xf0800000
  base address 5 =              0x00000000
  cardBus CIS pointer =         0x00000000
  sub system vendor ID =        0x0000
  sub system ID =               0x0000
  expansion ROM base address =  0x00000000
  interrupt line =              0xff
  interrupt pin =               0x01
  min Grant =                   0x00
  max Latency =                 0x00
=>

## Chapter-5 BAR CPU 访问，PIO 访问
md.l 0xf0400000 0x40
## Chapter-5 DMA read
mw.l 0x3c000000 0xffffffff
dcache flush 0x3c000000 0x100      # flush
mw.l 0xf638002c 0x1
mw.l 0xf6380300 0x4000008
mw.l 0xf6380304 0x0
mw.l 0xf6380308 0x100
mw.l 0xf638030c 0xf0400000
mw.l 0xf6380310 0x0
mw.l 0xf6380314 0x3c000000
mw.l 0xf6380318 0x0
mw.l 0xf6380030 0x0
dcache invalidate 0x3c000000 0x100  # invalidate
md.l 0x3c000000

## Chapter-5 DMA write
mw.l 0x3c000000 0xffffffff
dcache flush 0x3c000000 0x100 # flush
mw.l 0xf638000c 0x1
mw.l 0xf6380200 0x4000008
mw.l 0xf6380204 0x0
mw.l 0xf6380208 0x100
mw.l 0xf638020c 0x3c000000
mw.l 0xf6380210 0x0
mw.l 0xf6380214 0xf0400000
mw.l 0xf6380218 0x0
mw.l 0xf6380010 0x0
md.l 0x3c000000 0x40
```

dcache flush/clean wird über CONFIG_CMD_CACHE aktiviert; folgender Unterstützungspatch ist erforderlich:

```text
commit b46a81a12dd4a1514a6522e33a1d16194f242d62
Author: Joseph Chen <chenjh@rock-chips.com>
Date:   Wed Sep 28 01:36:45 2022 +0000

    cmd: cache: Add flush/invalidate dcache range support

    Signed-off-by: Joseph Chen <chenjh@rock-chips.com>
    Change-Id: Id0e0cd9019072e8c557ebd2987b439057cb4ae3b
```

#### 5.18.5 Häufige Probleme

PCIe-ASPM-Energiesparen in RK3568-Linux5.10-U-Boot deaktivieren: Der Controller deaktiviert ASPM bereits standardmäßig. Prüfung von PCIe3x2 in der U-Boot-Shell:

```text
pci display.l 20.00.00 0x80 1
```

BITS[1:0] bezeichnet PCIE_CAP_ACTIVE_STATE_LINK_PM_CONTROL:

```text
Values:
0x0 (DISABLED): Disabled
0x1 (L0S_ENTRY_EN): L0s Entry Enabled
0x2 (L1_ENTRY_En): L1 Entry Enabled
0x3 (L0S_L1_ENTRY_EN): L0s and L1 Entry Enabled
```

Einschränkungen von RC-DMA-Zugriffen auf FPGA: BAR-Verhalten ist geräteabhängig. Manche Geräte unterstützen memory-read/write-TLP unterschiedlicher Länge, andere nur 4Bytes. Im zweiten Fall funktioniert CPU-Zugriff auf BAR, während RC-DMA-Anfragen über 4B Fehler wie ca abort auslösen können.

```text
## Chapter-5 RK3568 DMA read ca abort 信息
=> md.l 0xf63800b8 1
f63800b8: 00000100                               ....
```

Zur Analyse TLP trigger des PCIe-Analysators verwenden, nicht memory trigger: Nach einem Fehler ohne cpl würde dieser nicht auslösen. Vermutet wird eine Buszugriffsbeschränkung der Peripherie bei TLP über 4B mit folgendem ca abort; die genaue Ursache muss mit dem Gerätehersteller untersucht werden.

### 5.19 Pinctrl

#### 5.19.1 Framework-Unterstützung

Pinctrl verwendet pinctrl-uclass und Standardschnittstellen. Konfiguration:

```text
CONFIG_PINCTRL_GENERIC
CONFIG_PINCTRL_ROCKCHIP
```

Framework-Code:

```text
./drivers/pinctrl/pinctrl-uclass.c
```

Treibercode:

```text
./drivers/pinctrl/pinctrl-rockchip.c
```

#### 5.19.2 Schnittstellen

```text
int pinctrl_select_state(struct udevice *dev, const char *statename)    // 设置状态
int pinctrl_get_gpio_mux(struct udevice *dev, int banknum, int index)   // 获取状态
```

Bei probe jedes Treibers setzt pinctrl automatisch den Zustand default; eigene Aufrufe sind normalerweise unnötig.

### 5.20 Pmic/Regulator

#### 5.20.1 Framework-Unterstützung

PMIC/Regulator verwendet pmic-uclass, regulator-uclass und Standardschnittstellen. Unterstützte PMICs:

```text
rk805/rk808/rk809/rk816/rk817/rk818
```

Unterstützte Regulatoren:

```text
rk805/rk808/rk809/rk816/rk817/rk818/syr82x/tcs452x/fan53555/pwm/gpio/fixed
```

Konfiguration:

```text
CONFIG_DM_PMIC
CONFIG_PMIC_CHILDREN
CONFIG_PMIC_RK8XX        // 适⽤于⽬前所有RK8XX系列芯⽚
CONFIG_DM_REGULATOR
CONFIG_REGULATOR_PWM
CONFIG_REGULATOR_RK8XX   // 适⽤于⽬前所有RK8XX系列芯⽚
CONFIG_REGULATOR_FAN53555
```

Framework-Code:

```text
./drivers/power/pmic/pmic-uclass.c
./drivers/power/regulator/regulator-uclass.c
```

Treiberdatei:

```text
./drivers/power/pmic/rk8xx.c
./drivers/power/regulator/rk8xx.c
./drivers/power/regulator/fixed.c
./drivers/power/regulator/gpio-regulator.c
./drivers/power/regulator/pwm_regulator.c
./drivers/power/regulator/fan53555_regulator.c
```

#### 5.20.2 Schnittstellen

```text
// 获取regulator。 @platname：“regulator-name”指定的名字，如：vdd_arm、vdd_logic；
int regulator_get_by_platname(const char *platname, struct udevice **devp);

// 使能/关闭
int regulator_get_enable(struct udevice *dev);
int regulator_set_enable(struct udevice *dev, bool enable);
int regulator_set_suspend_enable(struct udevice *dev, bool enable);
int regulator_get_suspend_enable(struct udevice *dev);

// 配置/获取电压
int regulator_get_value(struct udevice *dev);
int regulator_set_value(struct udevice *dev, int uV);
int regulator_set_suspend_value(struct udevice *dev, int uV);
int regulator_get_suspend_value(struct udevice *dev);
```

#### 5.20.3 Initialspannung

Die Anfangsspannung eines Regulators lässt sich bei erforderlichem regulator-boot-on auf zwei Arten festlegen: gleiche Spannungsgrenzen oder regulator-init-microvolt = &lt;...&gt;. Die Vorlage nennt regulator-min-microvolt zweimal; der korrekte zweite Eigenschaftsname darf daraus nicht geraten werden, sondern ist anhand von DTS/Treiber zu prüfen.

```text
vdd_arm: DCDC_REG1 {
    regulator-name = "vdd_arm";
    regulator-boot-on；                     // 必须配置
    regulator-min-microvolt = <712500>;
    regulator-max-microvolt = <1450000>;
    regulator-init-microvolt = <1100000>;   // 设置初始化电压为1.1v
    ......
};
```

#### 5.20.4 Initialisierung überspringen

Zum Überspringen der Regulatorinitialisierung regulator-loader-ignore ergänzen.

```text
vdd_arm: DCDC_REG1 {
    regulator-name = "vdd_arm";
    regulator-loader-ignore;// 仅对U-Boot阶段的regulator初始化有效，kernel⽆效
    ......
};
```

### 5.21 Reset

#### 5.21.1 Framework-Unterstützung

Reset verwendet reset-uclass.c und Standardschnittstellen. Auf RK handelt es sich um CRU-Softreset. Konfiguration:

```text
CONFIG_DM_RESET
CONFIG_RESET_ROCKCHIP
```

Framework-Code:

```text
./drivers/reset/reset-uclass.c
```

Treibercode:

```text
./drivers/reset/reset-rockchip.c
```

#### 5.21.2 Schnittstellen

```text
// 获取reset句柄
int reset_get_by_index(struct udevice *dev, int index, struct reset_ctl *reset_ctl);
int reset_get_by_name(struct udevice *dev, const char *name,
                      struct reset_ctl *reset_ctl);
// 释放reset
int reset_free(struct reset_ctl *reset_ctl);
// 请求reset
int reset_request(struct reset_ctl *reset_ctl);
// 触发reset、释放reset
int reset_assert(struct reset_ctl *reset_ctl);
int reset_deassert(struct reset_ctl *reset_ctl);
```

Beispiel:

```text
struct reset_ctl reset_ctl;

ret = reset_get_by_name(dev, "mac-phy", &reset_ctl);
if (ret) {
    debug("reset_get_by_name() failed: %d\n", ret);
    return ret;
}

ret = reset_request(&reset_ctl);
if (ret)
    return ret;

ret = reset_assert(&reset_ctl);
if (ret)
    return ret;

......

ret = reset_deassert(&reset_ctl);
if (ret)
    return ret;

......

ret = reset_free(&reset_ctl);
if (ret)
    return ret;
```

#### 5.21.3 DTS-Konfiguration

Reset ist standardmäßig aktiv; das Resetobjekt im Peripherieknoten angeben:

```text
// 格式：
reset-names = <name-string-list>
resets = <cru-phandle-list>
```

Beispielsweise gmac2phy:

```text
gmac2phy: ethernet@ff550000 {
    compatible = "rockchip,rk3328-gmac";
    ......

    // 指定reset属性
    reset-names = "stmmaceth", "mac-phy";
    resets = <&cru SRST_GMAC2PHY_A>, <&cru SRST_MACPHY>;
};
```

### 5.22 Rng

#### 5.22.1 Framework-Unterstützung

RNG implementiert einen Hardware-Zufallszahlengenerator. Framework-Code:

```text
./drivers/rng/rng-uclass.c
```

Treibercode:

```text
./drivers/rng/rockchip_rng.c
```

Konfiguration:

```text
CONFIG_DM_RNG=y
CONFIG_RNG_ROCKCHIP=y
```

#### 5.22.2 Schnittstellen

```text
// @buffer: 保存随机数输出
// @size: 随机数⻓度，单位：byte
int dm_rng_read(struct udevice *dev, void *buffer, size_t size)
```

#### 5.22.3 DTS-Konfiguration

RNG ist Teil der Crypto-Hardware und besitzt wie Crypto V1/V2-Varianten. Zwei compatible-Werte des RNG-Knotens:

```text
compatible = "rockchip,cryptov1-rng";
compatible = "rockchip,cryptov2-rng";
```

Vollständige Knotenbeispiele: rv1126.dtsi, rk3568.dtsi, rk3399.dtsi.

### 5.23 Spi

#### 5.23.1 Framework-Unterstützung

Framework-Code:

```text
./drivers/spi/spi-uclass.c
```

Treibercode:

```text
./drivers/spi/rk_spi.c
```

menuconfig-Konfiguration:

```text
CONFIG_ROCKCHIP_SPI=y
CONFIG_CMD_SPI=y
```

#### 5.23.2 Schnittstellen

./include/spi.h

```text
// 初始化对应 SPI 总线
struct spi_slave *spi_setup_slave(unsigned int bus, unsigned int cs, unsigned int max_hz,
unsigned int mode);

// 获取\释放总线
int spi_claim_bus(struct spi_slave *slave);
void spi_release_bus(struct spi_slave *slave);

// 常⽤读写接⼝
int spi_xfer(struct spi_slave *slave, unsigned int bitlen, const void *dout,
                void *din, unsigned long flags);
int spi_write_then_read(struct spi_slave *slave, const u8 *opcode,
                        size_t n_opcode, const u8 *txbuf, u8 *rxbuf,
                        size_t n_buf);
```

#### 5.23.3 DTS-Konfiguration

```text
&spi0 {
        u-boot,dm-pre-reloc;
        status = "okay";
};
```

#### 5.23.4 Aufrufbeispiele

Empfohlene Referenz: drivers/power/power_spi.c. Einfaches Demo:

```text
static u32 spi_bus_test(int bus, int cs)
{
    struct spi_slave *spi_slave;
    u32 tx_data, rx_data;
    int ret;
#ifdef CONFIG_DM_SPI
    struct udevice *dev;
    char name[30], *str;

    snprintf(name, sizeof(name), "generic_%d:%d", bus, cs);
    str = strdup(name);
    if (!str)
        return -ENOMEM;
    ret = spi_get_bus_and_cs(bus, cs, 50000000, SPI_MODE_0, "spi_generic_drv", str, &dev,
&spi_slave);
    if (ret)
        return ret;
#else
    spi_slave = spi_setup_slave(bus, cs, 50000000, SPI_MODE_0);
    if (!spi_slave) {
        /*
         * Invalid bus 1 (err=-19) means that spi1 is disabled in dts
         * Invalid chip select 1:0 (err=-19) means that there is no dev under spi1 bus in
dts
         * check it in uboot dtb or kernel dtb(if is enabled)
         *
         * btw, spi_get_bus_and_cs support no sub dev operation but spi_setup_slave can't
         */
        return -ENODEV;
    }
#endif

    if (spi_claim_bus(spi_slave))
        return -ENODEV;

    tx_data = 0x12345678;
    ret = spi_xfer(spi_slave, 32, &tx_data, &rx_data, SPI_XFER_BEGIN | SPI_XFER_END);

    spi_release_bus(spi_slave);

    pr_err("%s succuss\n", __func__);

    return ret;
}
```

Die SPI-Frequenz wird über spi-max-frequency des DTS-Gerätekindknotens oder bei spi_get_bus_and_cs/spi_setup_slave gesetzt.

#### 5.23.5 Testbefehle

cmd_spi-Befehle:

```text
sspi 3:0.0 24 AAA           # bus3:cs0:mode0 传输⻓度为24bits 传输数据为 "AAA"
```

#### 5.23.6 Häufige Probleme

Frage 1: Kein Signal? IOMUX und clock prüfen. Frage 2: RK3399-cmd_spi-Fehler? Die Befehlsphase verwendet Kernel-DTB; SPI-Einträge in aliases von kernel rk3399.dtsi prüfen. Frage 3: spi_setup_slave schlägt fehl? Der SPI-Busknoten benötigt ein Gerät. U-Boot bietet das Standardgerät generic_1:0 mit Treiber spi_generic_drv; dieses bei spi_setup_slave angeben. Frage 4: SPI-Frequenz in U-Boot prüfen? Debug aktivieren:

```text
diff --git a/drivers/spi/rk_spi.c b/drivers/spi/rk_spi.c
index 836b94a24ec..8aaa51b9e84 100644
--- a/drivers/spi/rk_spi.c
+++ b/drivers/spi/rk_spi.c
@@ -24,6 +24,8 @@

 DECLARE_GLOBAL_DATA_PTR;

+#undef _DEBUG
+#define _DEBUG 1
 /* Change to 1 to output registers at the start of each transaction */
 #define DEBUG_RK_SPI   0
```

Testbeispiel mit cmd/spi.c; wichtige Debugmeldungen:

```text
=> sspi 0:0.0 24 AAA
rockchip_spi_ofdata_to_platdata: base=ff500000, max-frequency=50000000, deactivate_delay=0
rsd=0
rockchip_spi_probe: probe
rockchip_spi_probe: rate = 200000000        #控制器⼯作时钟
spi speed 50000000, div 4                   #io 时钟，io 时钟由控制器⼯作时钟 4 分频输出
rockchip_spi_xfer: dout=07fd640c, din=07fd63ec, len=3, flags=3
activate cs0
deactivate cs0
000000
```

### 5.24 Storage

Speichertreiber verwenden das Standardframework und binden für Dateisystemunterstützung an BLK an. Unterstützt: eMMC, NAND-Flash, SPI NAND und SPI NOR. Flash-Framework:

| Schema | Hauptsächlich unterstützte Flash-Typen | Controller-Treiber | Flash-Framework | Registrierter Gerätetyp | Hauptsächlich unterstützte Dateisysteme |
| --- | --- | --- | --- | --- | --- |
| rknand-Schema | MLC TLC<br>Nand | drivers/rkand | drivers/rkand | Blockgerät | FAT、EXT、<br>SquashFS |
| rkflash-Schema | SLC Nand、<br>SPI Nand | drivers/rkflash | drivers/rkflash | Blockgerät | FAT、EXT、<br>SquashFS |
| rkflash-Schema (SPI-Nor-Unterstützung) | SPI Nor | drivers/rkflash | drivers/rkflash | Block- oder MTD-Gerät | SquashFS、<br>JFFS2 |
| SLC-Nand-Open-Source-Schema | SLC Nand | drivers/mtd/nand/raw | drivers/mtd/nand/raw | MTD-Gerät | UBI |
| SPI-Nand-Open-Source-Schema | SPI Nand | drivers/spi/rockchip_sfc.c | drivers/mtd/nand/raw | MTD-Gerät | UBI |
| SPI-Nor-Open-Source-Schema | SPI Nor | drivers/spi/rockchip_sfc.c | drivers/mtd/spi | MTD- oder MTD-Blockgerät | SquashFS、<br>JFFS2 |

Erläuterung:

1. Hauptunterschied der NAND-Unterstützung: rkflash integriert RK FTL (Flash Transfer Layer) in den Treiber; die offene Lösung überlässt Flashverwaltung dem Dateisystem, etwa Bad-Block-Management und Wear-Leveling von UBI.

#### 5.24.1 Framework-Unterstützung

rknand ist für große NAND-Speicher vorgesehen und kommuniziert über NANDC host mit dem Gerät. Bauteilauswahl siehe RKNandFlashSupportList; unterstützt werden SLC/MLC/TLC NAND. Konfiguration:

```text
CONFIG_RKNAND
```

Treiberdatei:

```text
./drivers/rknand/
```

rkflash ist für kleine Speicher vorgesehen: NAND über NANDC host, SPI-Flash über SFC host. Bauteilauswahl siehe RKSpiNor and SLC Nand SupportList. Unterstützt werden SLC NAND mit 128MB/256MB/512MB, bestimmte SPI NAND

und bestimmte SPI NOR. Konfiguration:

```text
CONFIG_RKFLASH

CONFIG_RKNANDC_NAND  /* ⼩容量并⼝Nand flash */
CONFIG_RKSFC_NOR     /* SPI Nor flash */
CONFIG_RKSFC_NAND    /* SPI Nand flash */
```

Treiberdatei:

```text
./drivers/rkflash/
```

Hinweise:

1. SFC (serial flash controller) ist ein spezielles Rockchip-Modul zur einfacheren SPI-Flash-Unterstützung.

2. FTL in rknand und rkflash-NAND-Code sind inkompatibel: CONFIG_RKNAND darf nicht mit CONFIG_RKNANDC_NAND oder CONFIG_RKSFC_NAND kombiniert werden.

MMC und SD: MMC bezeichnet Multimedia-Karten wie eMMC, SD Halbleiter-Flashspeicher. Auf Rockchip teilen sie sich dw_mmc, ausgenommen RK3399/RK3399Pro. Konfiguration:

```text
CONFIG_MMC_DW=y
CONFIG_MMC_DW_ROCKCHIP=y
CONFIG_CMD_MMC=y
```

Treiberdatei:

```text
./drivers/mmc/
```

Offene SLC-NAND/SPI-NAND/SPI-NOR-Lösung: Durch Communityentwicklung und UBI erweiterte RK die Nutzung offenen Codes. Standard-pre-loader ist SPL; deshalb hängen die meisten Optionen mit SPL zusammen. Konfiguration:

```text
// MTD 驱动⽀持
CONFIG_MTD=y
CONFIG_CMD_MTD_BLK=y
CONFIG_SPL_MTD_SUPPORT=y
CONFIG_MTD_BLK=y
CONFIG_MTD_DEVICE=y

// spi nand 驱动⽀持
CONFIG_MTD_SPI_NAND=y
CONFIG_ROCKCHIP_SFC=y
CONFIG_SPL_SPI_FLASH_SUPPORT=y
CONFIG_SPL_SPI_SUPPORT=y

// nand 驱动⽀持
CONFIG_NAND=y
CONFIG_CMD_NAND=y
CONFIG_NAND_ROCKCHIP=y /* NandC v6 可根据 TRM NANDC->NANDC_NANDC_VER 寄存器确认，0x00000801 */
//CONFIG_NAND_ROCKCHIP_V9=y  /* NandC v9 可根据 TRM NANDC->NANDC_NANDC_VER 寄存器确认，
0x56393030, 例如：RK3326/PX30 为此版本 */
CONFIG_SPL_NAND_SUPPORT=y
CONFIG_SYS_NAND_U_BOOT_LOCATIONS=y
// nand page size需要按真实⼤⼩定义，如果使⽤容量⼤于等于512MB的NAND，⼀般需要配置为4096
#define CONFIG_SYS_NAND_PAGE_SIZE   2048

// spi nor 驱动⽀持
CONFIG_CMD_SF=y
CONFIG_CMD_SPI=y
CONFIG_SPI_FLASH=y
CONFIG_SF_DEFAULT_MODE=0x1
CONFIG_SF_DEFAULT_SPEED=50000000
CONFIG_SPI_FLASH_GIGADEVICE=y
CONFIG_SPI_FLASH_MACRONIX=y
CONFIG_SPI_FLASH_WINBOND=y
CONFIG_SPI_FLASH_MTD=y
CONFIG_ROCKCHIP_SFC=y
CONFIG_SPL_SPI_SUPPORT=y
CONFIG_SPL_MTD_SUPPORT=y
CONFIG_SPL_SPI_FLASH_SUPPORT=y
```

rkflash/rknand-Konfiguration entfernen:

```text
CONFIG_RKFLASH=n
CONFIG_RKNAND=n
```

Treiberdatei:

```text
./drivers/mtd/nand/raw          //SLC Nand 主控驱动及协议层
./drivers/mtd/nand/spi          //SPI Nand 协议层
./drivers/spi/rockchip_sfc.c    //SPI Flash 主控驱动
./drivers/mtd/spi               //SPI Nor 协议层
```

#### 5.24.2 Schnittstellen

Alle Speichertreiber sind an BLK angebunden; sämtliche Medien werden daher über folgende Schnittstellen angesprochen:

```text
// 获取存储句柄
struct blk_desc *rockchip_get_bootdev(void)

// 访问接⼝
unsigned long blk_dread(struct blk_desc *block_dev, lbaint_t start,
                        lbaint_t blkcnt, void *buffer)
unsigned long blk_dwrite(struct blk_desc *block_dev, lbaint_t start,
                         lbaint_t blkcnt, const void *buffer)
unsigned long blk_derase(struct blk_desc *block_dev, lbaint_t start,
                         lbaint_t blkcnt)
```

#### 5.24.3 Typunterscheidung

Der aktuelle Bootspeichertyp lässt sich auf zwei Arten bestimmen: über die Umgebungszeichenketten devtype/devnum oder die Felder if_type/devnum des aktuellen struct blk_desc.

| devtype | if_type | devnum | Speichertyp | Hinweise |
| --- | --- | --- | --- | --- |
| mmc | IF_TYPE_MMC | 0 | eMMC | - |
| mmc | IF_TYPE_MMC | 1 | SD card | - |
| mtd | IF_TYPE_MTD | 0 | Nand | MTD-Open-Source-Schema |
| mtd | IF_TYPE_MTD | 1 | SPI Nand | MTD-Open-Source-Schema |
| mtd | IF_TYPE_MTD | 2 | SPI Nor | MTD-Open-Source-Schema |
| rknand | IF_TYPE_RKNAND | 0 | Nand | rkflash-Schema |
| spinand | IF_TYPE_SPINAND | 0 | SPI Nand | rkflash-Schema |
| spinor | IF_TYPE_SPINOR | 1 | SPI Nor | rkflash-Schema |
| nvme | IF_TYPE_NVME | 0 | SSD | - |
| scsi | IF_TYPE_SCSI | 0 | SATA | - |

#### 5.24.4 DTS-Konfiguration

eMMC-Konfiguration:

```text
// rkxxxx.dtsi配置
emmc: dwmmc@ff390000 {
    compatible = "rockchip,px30-dw-mshc", "rockchip,rk3288-dw-mshc";
    reg = <0x0 0xff390000 0x0 0x4000>;      // 控制器寄存器base address及⻓度
    max-frequency = <150000000>;            // eMMC普通模式时钟为50MHz,当配置为eMMC
                                            // HS200模式，该max-frequency⽣效
    clocks = <&cru HCLK_EMMC>, <&cru SCLK_EMMC>,
         <&cru SCLK_EMMC_DRV>, <&cru SCLK_EMMC_SAMPLE>;   // 控制器对应时钟编号
    clock-names = "biu", "ciu", "ciu-drv", "ciu-sample";  // 控制器时钟名
    fifo-depth = <0x100>;                                 // fifo深度，默认配置
    interrupts = <GIC_SPI 53 IRQ_TYPE_LEVEL_HIGH>;        // 中断配置
    status = "disabled";
};

// rkxxxx-u-boot.dtsi
&emmc {
    u-boot,dm-pre-reloc;
    status = "okay";
}

// rkxxxx.dts
&emmc {
    bus-width = <8>;                   // 设备总线位宽
    cap-mmc-highspeed;                 // 标识此卡槽⽀持highspeed mmc
    mmc-hs200-1_8v;                    // ⽀持HS200
    supports-emmc;                     // 标识此插槽为eMMC功能，必须添加，否则⽆法初始化外设
    disable-wp;                        // 对于⽆物理WP管脚，需要配置
    non-removable;                     // 此项表⽰该插槽为不可移动设备。 此项为必须添加项
    num-slots = <1>;                   // 标识为第⼏插槽
    status = "okay";
};
```

NANDC-Konfiguration:

```text
&nandc0 {
    u-boot,dm-pre-reloc;
    status = "okay";
    #address-cells = <1>;
    #size-cells = <0>;

    nand@0 {
        u-boot,dm-pre-reloc;
        reg = <0>;
        nand-ecc-mode = "hw_syndrome";
        nand-ecc-strength = <16>;
        nand-ecc-step-size = <1024>;
    };
}
```

SFC-Konfiguration:

```text
&sfc {
    u-boot,dm-pre-reloc;
    status = "okay";
    spi_nand: flash@0 {
        u-boot,dm-spl;
        compatible = "spi-nand";
        reg = <0>;
        spi-tx-bus-width = <1>;
        spi-rx-bus-width = <4>;
        spi-max-frequency = <96000000>;
    };
    spi_nor: flash@1 {
        u-boot,dm-spl;
        compatible = "jedec,spi-nor";
        reg = <0>;
        spi-tx-bus-width = <1>;
        spi-rx-bus-width = <4>;
        spi-max-frequency = <96000000>;
    };
};
```

Hinweis:

1. Aus Softwarekompatibilitätsgründen unterstützt U-Boot nur einspurige SPI-Flash-Übertragung mit spi-tx-bus-width = &lt;1&gt;.

#### 5.24.5 Dual-Storage-Erweiterung

Einzelheiten: Rockchip_Developer_Guide_Dual_Storage_CN.pdf.

#### 5.24.6 Häufige Probleme

Wie wird die FSPI/SFC-Frequenz der offenen Lösung eingestellt und geprüft? spi-max-frequency des SFC-Gerätekindknotens in rkxxxx-u-boot.dtsi setzen, ungenutzte Kindgeräte deaktivieren und Treiber-debug einschalten:

```text
diff --git a/drivers/spi/rockchip_sfc.c b/drivers/spi/rockchip_sfc.c
index 939b48e377c..62a425a29f4 100644
--- a/drivers/spi/rockchip_sfc.c
+++ b/drivers/spi/rockchip_sfc.c
@@ -790,7 +790,7 @@ static int rockchip_sfc_set_speed(struct udevice *bus, uint speed)
        sfc->cur_speed = speed;
        sfc->cur_real_speed = clk_get_rate(&sfc->clk);

-       dev_dbg(sfc->dev, "set_freq=%dHz real_freq=%dHz\n",
+       dev_err(sfc->dev, "set_freq=%dHz real_freq=%dHz\n",
                sfc->cur_speed, sfc->cur_real_speed);
 #else
        dev_dbg(sfc->dev, "sfc failed, CLK not support\n");
```

### 5.25 Thermal

#### 5.25.1 Framework-Unterstützung

Thermal liest die Chiptemperatur von TSADC, standardmäßig CPU. Framework-Code:

```text
./drivers/thermal/thermal-uclass.c
```

Treibercode:

```text
./drivers/thermal/rockchip_thermal.c
```

Konfiguration:

```text
CONFIG_DM_THERMAL=y
CONFIG_ROCKCHIP_THERMAL=y
```

#### 5.25.2 Schnittstellen

```text
// @temp: 保存获取到的温度
int thermal_get_temp(struct udevice *dev, int *temp)
```

#### 5.25.3 DTS-Konfiguration

Das Kernel-DTS ist normalerweise vollständig konfiguriert und aktiviert.

### 5.26 Uart

Serial verwendet serial-uclass.c und Standardschnittstellen, hauptsächlich für UART-Debug. Konfiguration:

```text
// 使能配置
CONFIG_DEBUG_UART
CONFIG_SYS_NS16550

// 参数配置
CONFIG_DEBUG_UART_BASE
CONFIG_DEBUG_UART_CLOCK
CONFIG_BAUDRATE
```

Framework-Code:

```text
./drivers/serial/serial-uclass.c
```

Treibercode:

```text
./drivers/serial/ns16550.c
```

#### 5.26.1 Einzelne Änderung

UART-Debug nur für U-Boot ändern, Beispiel UART2: CONFIG_ROCKCHIP_PRELOADER_SERIAL deaktivieren; UART-IOMUX in board_debug_uart_init() konfigurieren, gegebenenfalls inklusive m0/m1; dort clock mit 24Mhz-Quelle setzen; CONFIG_BAUDRATE und CONFIG_DEBUG_UART_BASE in defconfig aktualisieren; zwei erforderliche Eigenschaften ergänzen und U-Boot-UART-Knoten aktivieren:

```text
&uart2 {
    u-boot,dm-pre-reloc;
    clock-frequency = <24000000>;
    status = "okay";
};
```

stdout-path im U-Boot-chosen-Knoten angeben:

```text
chosen {
    stdout-path = &uart2;
};
```

#### 5.26.2 Globale Änderung

Pre-loader serial teilt UART-Debug-Konfiguration zwischen DDR, miniloader, BL31, OP-TEE und U-Boot. Das frühe DDR-Bin konfiguriert UART und reicht Parameter über ATAGS weiter; die folgenden Stufen außer dem Kernel verwenden sie. Für globale UART-Änderung die DDR-Bin-Konfiguration anpassen. rkbin enthält ein Werkzeug für Parameter einschließlich UART:

```text
tools/ddrbin_tool
tools/ddrbin_param.txt
tools/ddrbin_tool_user_guide.txt
```

U-Boot-Konfiguration

1. Option aktivieren:

```text
CONFIG_ROCKCHIP_PRELOADER_SERIAL  // 已经默认使能
```

2. Im verwendeten UART-Knoten von rkxx-u-boot.dtsi u-boot,dm-pre-reloc; ergänzen.
3. Serial-Aliases anlegen: U-Boot findet und initialisiert den Knoten darüber. In ./arch/arm/dts/rk1808-u-boot.dtsi erhalten der Einfachheit halber alle UARTs Aliases.

```text
aliases {
    mmc0 = &emmc;
    mmc1 = &sdmmc;

// 必须创建别名
    serial0 = &uart0;
    serial1 = &uart1;
    serial2 = &uart2;
    serial3 = &uart3;
    serial4 = &uart4;
    serial5 = &uart5;
    serial6 = &uart6;
    serial7 = &uart7;
};

.....

// 必须增加u-boot,dm-pre-reloc属性
&uart0 {
    u-boot,dm-pre-reloc;
};
&uart1 {
    u-boot,dm-pre-reloc;
};
&uart2 {
    u-boot,dm-pre-reloc;
    clock-frequency = <24000000>;
    status = "okay";
};
&uart3 {
    u-boot,dm-pre-reloc;
};
&uart4 {
    u-boot,dm-pre-reloc;
};
```

#### 5.26.3 Ausgabe deaktivieren

```text
CONFIG_DISABLE_CONSOLE=y
```

#### 5.26.4 Schnittstellen

```text
// UART debug接⼝
void putc(const char c);
void puts(const char *s);
int printf(const char *fmt, ...);
void flushc(void);

// 跟外设通信功能的普通UART接⼝
int serial_dev_getc(struct udevice *dev);
int serial_dev_tstc(struct udevice *dev);
void serial_dev_putc(struct udevice *dev, char ch);
void serial_dev_puts(struct udevice *dev, const char *str);
void serial_dev_setbrg(struct udevice *dev, int baudrate);
void serial_dev_clear(struct udevice *dev);
```

### 5.27 USB

U-Boot-USB umfasst Device, Host, PHY und Peripherietreiber. Nachfolgend Framework-, Boardkonfiguration und Befehle.

#### 5.27.1 Framework-Unterstützung

Device verwendet Gadget ohne DM_USB, meist rockusb oder fastboot für Firmwareupdate/-prüfung. Rockusb basiert auf UMS; seine Zustandsmaschine ist per HOOK eingebettet, siehe Treiber. Device-Controller sind DWC2/DWC3; normalerweise enthält ein Chip einen OTG-Typ, dessen CONFIG allein zu aktivieren ist. Typ gemäß TRM oder Rockchip-USB-Handbuch prüfen. Konfiguration:

```text
CONFIG_USB=y

// gadget配置
CONFIG_USB_GADGET=y
CONFIG_USB_GADGET_MANUFACTURER="Rockchip"
CONFIG_USB_GADGET_VENDOR_NUM=0x2207
CONFIG_USB_GADGET_PRODUCT_NUM=0x330a // 根据芯⽚ID配置
CONFIG_USB_GADGET_VBUS_DRAW=2
CONFIG_USB_GADGET_DUALSPEED=y
// rockusb配置
#define CONFIG_USB_FUNCTION_MASS_STORAGE // 位于include/configs/rkxxx_common.h中
CONFIG_USB_GADGET_DOWNLOAD=y
CONFIG_CMD_ROCKUSB=y

// DWC3控制器配置
CONFIG_USB_DWC3=y
CONFIG_USB_DWC3_GADGET=y

// DWC2控制器配置
CONFIG_USB_GADGET_DWC2_OTG=y
```

Framework-Code:

```text
// gadget框架
drivers/usb/gadget/g_dnl.c
drivers/usb/gadget/g_dnl.c
drivers/usb/gadget/config.c
drivers/usb/gadget/epautoconf.c
drivers/usb/gadget/usbstring.c
drivers/usb/gadget/f_mass_storage.c
```

Treibercode:

```text
// rockusb
cmd/rockusb.c
drivers/usb/gadget/f_rockusb.c

// controller
drivers/usb/gadget/dwc2_udc_otg* // dwc2 OTG控制器
drivers/usb/dwc3 // dwc3 OTG控制器
```

Host umfasst OHCI/EHCI/xHCI. xHCI unterstützt USB3, ist aber nicht in allen Chips vorhanden; siehe TRM/USB-Handbuch. Es werden Upstream-Treiber mit DM_USB verwendet; Hauptaufgabe ist daher Controller-DTS-Anpassung. Konfiguration:

```text
CONFIG_USB=y
CONFIG_DM_USB=y

// xHCI
CONFIG_USB_HOST=y
CONFIG_USB_XHCI_HCD=y
CONFIG_USB_XHCI_DWC3=y
CONFIG_USB_DWC3_GENERIC=y

// EHCI
CONFIG_USB_EHCI_HCD=y
CONFIG_USB_EHCI_GENERIC=y

// OHCI
#define CONFIG_USB_OHCI_NEW // 位于include/configs/rkxxx_common.h中
#define CONFIG_SYS_USB_OHCI_MAX_ROOT_PORTS      1
CONFIG_USB_OHCI_HCD=y
CONFIG_USB_OHCI_GENERIC=y
```

Framework-Code:

```text
// 框架代码
cmd/usb.c
drivers/usb/host/usb-uclass.c

// EHCI
drivers/usb/host/ehci-generic.c
drivers/usb/host/ehci-hcd.c

// OHCI
drivers/usb/host/ohci-generic.c
drivers/usb/host/ohci-hcd.c

// xHCI
drivers/usb/host/xhci.c
drivers/usb/host/xhci-dwc3.c
drivers/usb/host/xhci-mem.c
drivers/usb/host/xhci-ring.c
```

USB-PHY umfasst USB2/USB3-PHY, verwendet DM_USB und ist zum Kernel-DTB kompatibel. Integrierte IPs gemäß TRM/Rockchip-USB-PHY-Handbuch prüfen. Konfiguration:

```text
CONFIG_PHY=y

// INNO USB2
CONFIG_PHY_ROCKCHIP_INNO_USB2=y
// INNO USB3
CONFIG_PHY_ROCKCHIP_INNO_USB3=y
// NANENG USB2
CONFIG_PHY_ROCKCHIP_NANENG_USB2=y
// NANENG COMBOPHY
CONFIG_PHY_ROCKCHIP_NANENG_COMBOPHY=y
// RK3399 USBDP PHY
CONFIG_PHY_ROCKCHIP_TYPEC=y
```

Framework-Code:

```text
drivers/phy/phy-uclass.c
```

Treibercode:

```text
// INNO USB2
drivers/phy/phy-rockchip-inno-usb2.c
// INNO USB3
drivers/phy/phy-rockchip-inno-usb3.c
// NANENG USB2
drivers/phy/phy-rockchip-naneng-usb2.c
// NANENG COMBOPHY
drivers/phy/phy-rockchip-naneng-combphy.c
// RK3399 USBDP PHY
drivers/phy/phy-rockchip-typec.c
```

Weitere Peripherie: USB-HUB, USB-Tastatur und UMS. Konfiguration:

```text
// USB键盘
CONFIG_USB_KEYBOARD=y
CONFIG_USB_KEYBOARD_FN_KEYS=y // ⽀持F1-F12, INS, HOME等快捷键。

// USB存储设备
CONFIG_USB_STORAGE=y
```

Framework-Code:

```text
// 框架代码
common/usb.c
drivers/usb/host/usb-uclass.c

// USB键盘
drivers/input/usb_kbd.c
drivers/input/keyboard-uclass.c

// USB存储设备
common/usb/usb_storage.c
```

#### 5.27.2 Boardkonfiguration

Device verwendet kein DM_USB; Controllereigenschaften wie Adresse und TX-FIFO-Größe deshalb in der Board-Datei konfigurieren.

```text
// DWC3控制器配置
// board/rockchip/evb_rk3399/evb_rk3399.c
#ifdef CONFIG_USB_DWC3
static struct dwc3_device dwc3_device_data = {
    .maximum_speed = USB_SPEED_HIGH,
    .base = 0xfe800000, // 根据不同芯⽚USB OTG控制器基地址进⾏修改
    .dr_mode = USB_DR_MODE_PERIPHERAL,
    .index = 0,
    .dis_u2_susphy_quirk = 1,
    .usb2_phyif_utmi_width = 16,
};

int usb_gadget_handle_interrupts(void)
{
    dwc3_uboot_handle_interrupt(0);
    return 0;
}

int board_usb_init(int index, enum usb_init_type init)
{
    return dwc3_uboot_init(&dwc3_device_data);
}
#endif

// DWC2控制器配置已在rockchip通⽤board.c⽂件实现，⼀般不需要修改。
// arch/arm/mach-rockchip/board.c
```

Für USB-Tastatur als U-Boot-Standardeingabe usbkbd zu stdin hinzufügen, beispielsweise:

```text
// 环境变量配置位于各板级头⽂件中
// include/configs/evb_rk3568.h

#define ROCKCHIP_DEVICE_SETTINGS \
        "stdin=serial,usbkbd\0" \
```

#### 5.27.3 DTS-Konfiguration

USB-Device ohne DM_USB benötigt keine DT-Knoten. Host/PHY sind zum Kernel-DTB kompatibel, der direkt verwendet werden kann; U-Boot-DTB anhand der entsprechenden Kernelknoten konfigurieren.

#### 5.27.4 Zugehörige Befehle

rockusb

```text
rockusb - Use the rockusb Protocol

Usage:
rockusb <USB_controller> <devtype> <dev[:part]>  e.g. rockusb 0 mmc 0
```

Drei Wege zum U-Boot-Loader-Updatemodus:

Tasten reset + recovery (Vorlage: revovery); obiger rockusb-Befehl in der U-Boot-Konsole; oder reboot loader aus dem laufenden System.

```text
usb - USB sub-system

Usage:
usb start - start (scan) USB controller
usb reset - reset (rescan) USB controller
usb stop [f] - stop USB [f]=force stop
usb tree - show USB device tree
usb info [dev] - show available USB devices
usb test [dev] [port] [mode] - set USB 2.0 test mode
    (specify port 0 to indicate the device's upstream port)
    Available modes: J, K, S[E0_NAK], P[acket], F[orce_Enable]
usb storage - show details of USB storage devices
usb dev [dev] - show or set current USB storage device
usb part [dev] - print partition table of one or all USB storage    devices
usb read addr blk# cnt - read `cnt' blocks starting at block `blk#'
    to memory address `addr'
usb write addr blk# cnt - write `cnt' blocks starting at block `blk#'
    from memory address `addr'
```

U-Boot unterstützt kein USB-Hotplug; Enumeration und Trennen erfolgen per Befehl. usb start/usb reset lesen den Controller und scannen Geräte aller Ports; usb stop trennt alles und baut das Controllergerät ab; usb info/usb tree zeigen Controller und angeschlossene Geräte; usb storage und Unterbefehle dienen UMS, siehe Befehlshilfe. Fastboot-Konfiguration siehe Kapitel 4, Systemmodule.

### 5.28 Vendor Storage

Vendor Storage speichert kleine unverschlüsselte Daten wie SN und MAC im reservierten NVM-Bereich (eMMC/NAND usw.). Mehrere Kopien bewahren Daten bei Aktualisierung und erhöhen die Zuverlässigkeit. Einzelheiten: appnote rk vendor storage.

#### 5.28.1 Prinzipübersicht

Der Vendor-Speicherblock besteht aus vendor0, vendor1, vendor2 und vendor3. Im hdr jedes vendorX (X=0,1,2,

3) steht eine monoton steigende version zur Kennzeichnung des Updates. Lesen verwendet die höchste version; Schreiben erhöht sie und verschiebt alte und neue Daten nach vendorX+1. Daten aus vendor2 werden nach Änderung beispielsweise nach vendor3 geschrieben. Dies ist eine einfache Schutzmaßnahme.

#### 5.28.2 Framework-Unterstützung

U-Boot unterstützt Vendor Storage nicht nativ; Rockchip implementiert einen eigenen Treiber. Konfiguration:

```text
CONFIG_ROCKCHIP_VENDOR_PARTITION
```

Treiberdatei:

```text
./arch/arm/mach-rockchip/vendor.c
./arch/arm/include/asm/arch-rockchip/vendor.h
```

#### 5.28.3 Schnittstellen

```text
int vendor_storage_read(u16 id, void *pbuf, u16 size)
int vendor_storage_write(u16 id, void *pbuf, u16 size)
```

Definitionen und Verwendung von id siehe appnote rk vendor storage.

#### 5.28.4 Funktionstest

Vendor-Storage-Selbsttest: rktest vendor in der seriellen U-Boot-Konsole.

### 5.29 Watchdog

#### 5.29.1 Framework-Unterstützung

Watchdog verwendet wdt-uclass.c und Standardschnittstellen. Konfiguration:

```text
CONFIG_WDT
CONFIG_ROCKCHIP_WATCHDOG
```

Framework-Code:

```text
./drivers/watchdog/wdt-uclass.c
```

Treibercode:

```text
./drivers/watchdog/rockchip_wdt.c
```

#### 5.29.2 Schnittstellen

```text
// 设置喂狗超时时间且启动wdt（@flags默认填0）
int wdt_start(struct udevice *dev, u64 timeout_ms, ulong flags);
// 关闭wdt
int wdt_stop(struct udevice *dev);
// 喂狗
int wdt_reset(struct udevice *dev);
// 忽略，⽬前未做底层驱动实现
int wdt_expire_now(struct udevice *dev, ulong flags)
```

Der Standard-U-Boot-Ablauf aktiviert und nutzt WDT nicht; je nach Produktanforderung einschalten.

## 6 Weiterführende Prinzipien

### 6.1 kernel-DTB

#### 6.1.1 Entwurfshintergrund

In der ursprünglichen U-Boot-Architektur hat jede Platine einen eigenen DTS; dessen DTB wird in das U-Boot-Abbild gepackt. N Platinen einer SoC benötigen daher N Abbilder. Die Unterschiede liegen jedoch hauptsächlich in der Peripherie, während der SoC-Kern gleich bleibt. RK ergänzt deshalb kernel DTB, um je SoC-Plattform nur ein U-Boot-Abbild zu benötigen: Früh im Startablauf wird zum Kernel-DTB gewechselt und dessen Konfiguration zur Peripherieinitialisierung verwendet. So werden Unterschiede bei display, pmic/regulator, pinctrl, clk usw. berücksichtigt. kernel DTB setzt OF_LIVE (live device tree, kurz live-dt) voraus.

```text
config USING_KERNEL_DTB
        bool "Using dtb from Kernel/resource for U-Boot"
        depends on RKIMG_BOOTLOADER && OF_LIVE
        default y
        help
          This enable support to read dtb from resource and use it for U-Boot,
          the uart and emmc will still using U-Boot dtb, but other devices like
          regulator/pmic, display, usb will use dts node from kernel.
```

#### 6.1.2 Live device tree

Hintergrund und Prinzip: Mit kernel DTB existieren in U-Boot zwei DTBs. Speicher, UART, Crypto und weitere Module verwenden den U-Boot-DTB, die übrigen den Kernel-DTB. Beide Gruppen müssen zu unterschiedlichen Zeitpunkten auf ihre eigenen Knoten zugreifen. gd-&gt;fdt_blob kann aber nur auf einen DTB zeigen und lässt sich nicht bequem beliebig umschalten. Auch ein Overlay der U-Boot-DTS-Knoten auf den Kernel-DTS scheidet aus, da letzterer anschließend dem Kernel übergeben wird. Live DT löst dies: U-Boot durchsucht bei der Initialisierung den gesamten DTB, wandelt alle Knoten in eine verkettete Liste von struct device_node um und bindet sie an konkrete device-driver. Später greift jeder Treiber direkt auf seinen device_node statt auf den ursprünglichen DTB zu. Beide DTBs erhalten somit ihre eigenen device-driver-Gruppen; direkte Zugriffe auf die DTB-Dateien entfallen. Damit entfällt der Konflikt zwischen zwei DTBs. Weitere Informationen:

```text
./doc/driver-model/livetree.txt
```

Übergang zwischen FDT und Live DT: ofnode (include/dm/ofnode.h) kapselt beide Darstellungen. Bei Live DT erfolgt der Knotenzugriff über device_node, bei FDT über offset. Treiber, die beide Typen unterstützen sollen, verwenden ofnode. Struktur von ofnode:

```text
/*
 * @np: Pointer to device node, used for live tree
 * @of_offset: Pointer into flat device tree, used for flat tree. Note that this
 *      is not a really a pointer to a node: it is an offset value. See above.
 */
typedef union ofnode_union {
        const struct device_node *np;   /* will be used for future live tree */
        long of_offset;
} ofnode;
```

Funktionen mit dev_ oder ofnode_ unterstützen beide Zugriffsarten; of_ unterstützt nur Live DT, fdtdec_ und fdt_ nur FDT.

#### 6.1.3 Mechanismusimplementierung

Der Wechsel zum Kernel-DTB erfolgt in init_kernel_dtb() in ./arch/arm/mach-rockchip/board.c. Zu diesem Zeitpunkt ist der U-Boot-DTS bereits eingelesen und die mmc/nand/nor-Treiber funktionieren. Der Kernel-DTB wird aus der Firmware gelesen, die Live-DT-Struktur aufgebaut und alle device-driver gebunden; anschließend zeigt gd-&gt;fdt_blob auf den Kernel-DTB.

#### 6.1.4 U-Boot

Nach dem Build entstehen in ./dts/ zwei DTBs. dt.dtb wird aus dem durch CONFIG_DEFAULT_DEVICE_TREE in defconfig bestimmten DTS kompiliert. Für dt-spl.dtb werden alle Knoten mit u-boot,dm-pre-reloc aus dt.dtb übernommen und die in CONFIG_OF_SPL_REMOVE_PROPS genannten Eigenschaften entfernt. Üblicherweise bleiben nur die für UART, DDR und Speicher notwendigen Knoten: DMC, UART, MMC, NAND, GRF, CRU usw. Ohne CONFIG_USING_KERNEL_DTB wird dt.dtb verwendet, mit dieser Option dt-spl.dtb. Am Build-Ende wird die gewählte Datei u-boot.dtb genannt und an u-boot.bin angehängt. fdtdump zeigt ihren Inhalt.

### 6.2 Kernel-Parameterübergabe

Dieser Abschnitt beschreibt die Parameterübergabe von U-Boot an den Kernel.

#### 6.2.1 cmdline

U-Boot liest /chosen/bootargs aus dem Kernel-DTB, ändert oder ergänzt den Inhalt und schreibt ihn nach /chosen/bootargs zurück. Dadurch wird cmdline übergeben.

#### 6.2.2 Speicherkapazität

U-Boot trägt die verfügbare Speicherkapazität in den Knoten /memory des Kernel-DTB ein. Entsprechende Meldungen erscheinen beim Start:

```text
......
## Chapter-6 Booting Android Image at 0x0027f800 ...
Kernel load addr 0x00280000 size 23387 KiB
RAM disk load addr 0x0a200000 size 782 KiB
## Chapter-6 Flattened Device Tree blob at 08300000
   Booting using the fdt blob at 0x8300000
   XIP Kernel Image ... OK
  'reserved-memory' ramoops@110000: addr=110000 size=f0000
   Using Device Tree in place at 0000000008300000, end 0000000008314648

// kernel可⽤的内存空间
Adding bank: 0x00200000 - 0x08400000 (size: 0x08200000)
Adding bank: 0x0a200000 - 0x80000000 (size: 0x75e00000)
Total: 473.217 ms

Starting kernel ...
```

#### 6.2.3 Andere Wege

Auch die übrige Parameterübergabe erfolgt letztlich durch Änderungen am Kernel-DTB. Beispiel:

| Knoten/Eigenschaft | Operation | Zweck |
| --- | --- | --- |
| /serial-number | Erstellen | Seriennummer |
| /memory | Ändern | Für Kernel sichtbarer Speicher |
| /display-subsystem/route/route-edp/ | Anhängen | Anzeigeparameter (edp-Beispiel) |
| /chosen/linux,initrd-start | Erstellen | Ramdisk-Startadresse |
| /chosen/linux,initrd-end | Erstellen | Ramdisk-Endadresse |
| /bootargs | Ändern | Für Kernel sichtbare cmdline |
| mac-address oder local-mac-address im GMAC-Knoten | Ändern | MAC-Adresse |
| arch/arm/mach-rockchip/board.c: board_fdt_fixup() | Ändern | FDT-Anpassung auf Platinenebene |

### 6.3 A/B-System

#### 6.3.1 A/B-Datenformat

Die A/B-Datenstruktur liegt bei Offset 2 KB in der Partition misc.

```text
/* Magic for the A/B struct when serialized. */
#define AVB_AB_MAGIC "\0AB0"
#define AVB_AB_MAGIC_LEN 4

/* Versioning for the on-disk A/B metadata - keep in sync with avbtool. */
#define AVB_AB_MAJOR_VERSION 1
#define AVB_AB_MINOR_VERSION 0

/* Size of AvbABData struct. */
#define AVB_AB_DATA_SIZE 32

/* Maximum values for slot data */
#define AVB_AB_MAX_PRIORITY 15
#define AVB_AB_MAX_TRIES_REMAINING 7

typedef struct AvbABSlotData {
  /* Slot priority. Valid values range from 0 to AVB_AB_MAX_PRIORITY,
   * both inclusive with 1 being the lowest and AVB_AB_MAX_PRIORITY
   * being the highest. The special value 0 is used to indicate the
   * slot is unbootable.
   */
  uint8_t priority;

  /* Number of times left attempting to boot this slot ranging from 0
   * to AVB_AB_MAX_TRIES_REMAINING.
   */
  uint8_t tries_remaining;
  /* Non-zero if this slot has booted successfully, 0 otherwise. */
  uint8_t successful_boot;

  /* Reserved for future use. */
  uint8_t reserved[1];
} AVB_ATTR_PACKED AvbABSlotData;

/* Struct used for recording A/B metadata.
 *
 * When serialized, data is stored in network byte-order.
 */
typedef struct AvbABData {
  /* Magic number used for identification - see AVB_AB_MAGIC. */
  uint8_t magic[AVB_AB_MAGIC_LEN];

  /* Version of on-disk struct - see AVB_AB_{MAJOR,MINOR}_VERSION. */
  uint8_t version_major;
  uint8_t version_minor;

  /* Padding to ensure |slots| field start eight bytes in. */
  uint8_t reserved1[2];

  /* Per-slot metadata. */
  AvbABSlotData slots[2];

  /* Reserved for future use. */
  uint8_t reserved2[12];

  /* CRC32 of all 28 bytes preceding this field. */
  uint32_t crc32;
} AVB_ATTR_PACKED AvbABData;
```

Bei kleinen Speichern ohne misc, aber mit vendor können die Daten in vendor abgelegt werden. Zusätzlich markiert lastboot die zuletzt bootfähige Firmware. Dies betrifft vor allem niedrigen Akkustand oder Fertigungstests, bei denen retry bereits vor dem Systemstart und dem Aufruf von boot_ctrl aufgebraucht ist. Beispiel:

```text
typedef struct AvbABData {
  /* Magic number used for identification - see AVB_AB_MAGIC. */
  uint8_t magic[AVB_AB_MAGIC_LEN];

  /* Version of on-disk struct - see AVB_AB_{MAJOR,MINOR}_VERSION. */
  uint8_t version_major;
  uint8_t version_minor;

  /* Padding to ensure |slots| field start eight bytes in. */
  uint8_t reserved1[2];

  /* Per-slot metadata. */
  AvbABSlotData slots[2];

  /* mark last boot slot */
  uint8_t last_boot;
  /* Reserved for future use. */
  uint8_t reserved2[11];

  /* CRC32 of all 28 bytes preceding this field. */
  uint32_t crc32;
} AVB_ATTR_PACKED AvbABData;
```

In AvbABSlotData wird außerdem is_update ergänzt, um den Systemaktualisierungszustand zu kennzeichnen:

```text
typedef struct AvbABSlotData {
  /* Slot priority. Valid values range from 0 to AVB_AB_MAX_PRIORITY,
   * both inclusive with 1 being the lowest and AVB_AB_MAX_PRIORITY
   * being the highest. The special value 0 is used to indicate the
   * slot is unbootable.
   */
  uint8_t priority;

  /* Number of times left attempting to boot this slot ranging from 0
   * to AVB_AB_MAX_TRIES_REMAINING.
   */
  uint8_t tries_remaining;

  /* Non-zero if this slot has booted successfully, 0 otherwise. */
  uint8_t successful_boot;

  /* Mark update state, mark 1 if the slot is in update state, 0 otherwise. */
  uint8_t is_update : 1;
  /* Reserved for future use. */
  uint8_t reserved : 7;
} AVB_ATTR_PACKED AvbABSlotData;
```

Die Tabellen erläutern die Parameter. AvbABData:

| Parameter | Bedeutung |
| --- | --- |
| priority | Slot-Priorität: 0 nicht bootfähig, 15 höchste |
| tries_remaining | Startversuche, auf 7 gesetzt |
| successful_boot | Nach erfolgreichem Systemstart gesetzt: 1 Slot erfolgreich gestartet, 0 nicht |
| is_update | Slot-Updatezustand: 1 wird aktualisiert, 0 nicht aktualisiert oder erfolgreich aktualisiert |

AvbABSlotData:

| Parameter | Bedeutung |
| --- | --- |
| magic | Strukturkopf: \0AB0 |
| version_major | Hauptversion |
| version_minor | Nebenversion |
| slots | Slot-Startinformationen; siehe AvbABData |
| last_boot | Zuletzt erfolgreich gestarteter Slot: 0 A, 1 B |
| crc32 | Datenprüfung |

#### 6.3.2 A/B-Bootmodus

system bootctrl bietet zwei Steuerungsmodi; der Bootloader unterstützt beide.

##### 6.3.2.1 successful-boot

Nach einem normalen Systemstart setzt boot_ctrl anhand von androidboot.slot_suffix die Variablen des aktuellen Slots:

```text
successful_boot = 1;
priority = 15;
tries_remaining = 0;
is_update = 0;
last_boot = 0 or 1;     :refer to androidboot.slot_suffix
```

Während der Systemaktualisierung setzt boot_ctrl:

```text
升级的slot设置：
successful_boot = 0;
priority = 14;
tries_remaining = 7;
is_update = 1;
lastboot = 0 or 1;     :refer to androidboot.slot_suffix

当前slot设置：
successful_boot = 1;
priority = 15;
tries_remaining = 0;
is_update = 0;
last_boot = 0 or 1;     :refer to androidboot.slot_suffix
```

Nach Abschluss der Systemaktualisierung setzt boot_ctrl:

```text
升级的slot设置：
successful_boot = 0;
priority = 15;
tries_remaining = 7;
is_update = 0;
lastboot = 0 or 1;     :refer to androidboot.slot_suffix

当前slot设置：
successful_boot = 1;
priority = 14;
tries_remaining = 0;
is_update = 0;
last_boot = 0 or 1;     :refer to androidboot.slot_suffix
```

##### 6.3.2.2 reset-retry

Nach einem normalen Systemstart setzt boot_ctrl anhand von androidboot.slot_suffix die Variablen des aktuellen Slots:

```text
successful_boot = 0;
priority = 15;
tries_remaining = 7;
is_update = 0;
last_boot = 0 or 1;     :refer to androidboot.slot_suffix
```

Während der Systemaktualisierung setzt boot_ctrl:

```text
升级的slot设置：
successful_boot = 0;
priority = 14;
tries_remaining = 7;
is_update = 1;
lastboot = 0 or 1;     :refer to androidboot.slot_suffix

当前slot设置：
successful_boot = 0;
priority = 15;
tries_remaining = 7;
is_update = 0;
last_boot = 0 or 1;     :refer to androidboot.slot_suffix
```

Nach Abschluss der Systemaktualisierung setzt boot_ctrl:

```text
升级的slot设置：
successful_boot = 0;
priority = 15;
tries_remaining = 7;
is_update = 0;
lastboot = 0 or 1;     :refer to androidboot.slot_suffix

当前slot设置：
successful_boot = 0;
priority = 14;
tries_remaining = 7;
is_update = 0;
last_boot = 0 or 1;     :refer to androidboot.slot_suffix
```

##### 6.3.2.3 Vergleich der Modi

successful_boot: Vorteil — nach einem erfolgreichen Systemstart erfolgt kein Rückfall auf alte Firmware, sofern system bootctrl dies nicht konfiguriert; Nachteil — defekte Speicherzellen nach langer Betriebszeit können endlose Neustarts verursachen. reset retry: Vorteil — der ständig aktive retry-Mechanismus kann Speicherfehler abfangen; Nachteil — ein Rückfall auf ältere Firmware ist möglich.

#### 6.3.3 Startablauf

A/B-Datenfluss im Modus successful_boot:

A/B-Datenfluss im Modus reset retry:

#### 6.3.4 Update und Fehlerfälle

Systemaktualisierung: siehe Rockchip Linux-Entwicklerhandbuch zum Aktualisierungsverfahren. Recovery-Aktualisierung: Für das A/B-System ist keine Unterstützung vorgesehen.

#### 6.3.5 Prüfmethode

##### 6.3.5.1 successful-boot

1. Nur slot A programmieren: Das System startet aus A. Start aus B einstellen: Es startet weiterhin aus A. Nach dem Test die Partition misc leeren.

2. A und B programmieren und das System aus A starten. B auswählen und reboot ausführen: Jetzt läuft B. Nach dem Test misc leeren.

3. A und B programmieren, dann 14 schnelle Resets ausführen. Trotz aufgebrauchtem retry counter startet das durch last_boot bezeichnete System weiterhin, also regulär A. Nach dem Test misc leeren.

4. A und B programmieren und A starten. B auswählen, reboot ausführen und den Start von B prüfen. Danach A auswählen, reboot ausführen und den Start von A prüfen. Nach dem Test misc leeren.

##### 6.3.5.2 reset-retry

1. Nur slot A programmieren: Das System startet aus A. Start aus B einstellen: Es startet weiterhin aus A. Nach dem Test die Partition misc leeren.

2. A und B programmieren und das System aus A starten. B auswählen und reboot ausführen: Jetzt läuft B. Nach dem Test misc leeren.

3. A und B programmieren, dann 14 schnelle Resets ausführen. Trotz aufgebrauchtem retry counter startet das durch last_boot bezeichnete System weiterhin, also regulär A. Nach dem Test misc leeren.

4. A und B programmieren, wobei boot.img von B beschädigt ist. A starten, B auswählen und reboot ausführen. Nach 7 Neustarts startet das System regulär aus A. Nach dem Test misc leeren.

5. A und B programmieren und A starten. B auswählen, reboot ausführen und den Start von B prüfen. Danach A auswählen, reboot ausführen und den Start von A prüfen. Nach dem Test misc leeren.

#### 6.3.6 Referenzen

Rockchip-Secure-Boot2.0.md; Rockchip-Secure-Boot-Application-Note.md; Android Verified Boot 2.0.

### 6.4 AVB Secure Boot

#### 6.4.1 Referenzen

Rockchip-Secure-Boot-Application-Note.md; Android Verified Boot 2.0; Rockchip_Developer_Guide_Linux4.4_SecureBoot_CN.pdf.

#### 6.4.2 Begriffe

AVB: Android Verified Boot. OTP und efuse: One Time Programmable. Product RootKey (PRK): Der AVB-Wurzelschlüssel wird durch den Wurzelschlüssel geprüft, der loader, uboot und trust signiert. Product Intermediate Key (PIK): Zwischenschlüssel. Product Signing Key (PSK): Firmware-Signaturschlüssel. Product Unlock Key (PUK): Geräteentsperrschlüssel. Getrennte Schlüssel mit klaren Zuständigkeiten verringern das Risiko einer Schlüsseloffenlegung.

#### 6.4.3 Einführung

Die sichere Rockchip-Startprüfung besteht aus Sicherheits- und Integritätsprüfung. Erstere prüft den öffentlichen Schlüssel: Sein Hash wird aus dem sicheren OTP/efuse-Speicher gelesen und mit dem berechneten Schlüsselhash verglichen; anschließend wird mit dem öffentlichen Schlüssel der Firmwarehash entschlüsselt. Zur Integritätsprüfung wird die Firmware geladen, ihr Hash berechnet und mit dem entschlüsselten Hash verglichen.

#### 6.4.4 Verschlüsselungsbeispiel

Die sichere Startprüfung ähnelt der Verschlüsselung und Prüfung übertragener Daten. Das folgende Beispiel erleichtert das Verständnis von AVB. Alice überträgt digitale Daten an Bob. Für Vertraulichkeit, Authentizität, Integrität und Nichtabstreitbarkeit werden die Daten folgendermaßen verschlüsselt und signiert:

1. Alice bereitet die zu übertragenden digitalen Daten als Klartext vor.

2. Alice berechnet den Hash der Daten und erhält einen Nachrichtendigest.

3. Alice verschlüsselt den Digest mit ihrem privaten Schlüssel, erhält ihre digitale Signatur und fügt diese den Daten hinzu.

4. Alice erzeugt einen zufälligen Verschlüsselungsschlüssel und verschlüsselt damit die zu sendenden Daten.

5. Alice verschlüsselt diesen Zufallsschlüssel mit Bobs öffentlichem Schlüssel und sendet den verschlüsselten DES-Schlüssel zusammen mit dem Chiffretext.

6. Bob empfängt Chiffretext und verschlüsselten DES-Schlüssel. Mit seinem privaten Schlüssel entschlüsselt er den DES-Schlüssel und erhält Alices Zufallsschlüssel.

7. Bob entschlüsselt die Daten mit dem Zufallsschlüssel, erhält den Klartext und verwirft den Zufallsschlüssel.

8. Bob entschlüsselt Alices digitale Signatur mit ihrem öffentlichen Schlüssel und erhält den Digest.

9. Bob hasht den erhaltenen Klartext erneut mit demselben Algorithmus und erhält einen neuen Digest.

10. Bob vergleicht den empfangenen mit dem neu berechneten Digest. Stimmen beide überein, wurden die Daten nicht verändert. DES kann hier durch einen anderen Algorithmus wie AES ersetzt werden; für das asymmetrische Schlüsselpaar kann RSA verwendet werden. Ablauf:

![Abbildung 7: englische Quelle, Seite 196](/docs/rockchip-uboot-nextdev/assets/en-p196-figure-01.png)

*Abbildung 7: englische Quelle, Seite 196*

#### 6.4.5 AVB

AVB (Android Verified Boot) ist Googles Firmwareprüfverfahren, insbesondere für boot und system. Rockchip Secure Boot verbindet die Prüfverfahren aus der Datenkommunikation mit AVB zu einer vollständigen Secure-Boot-Lösung.

##### 6.4.5.1 AVB-Funktionen

Sicherheitsprüfung; Integritätsprüfung; Rollbackschutz; Unterstützung für persistent partition und chained partitions. Letztere können denselben privaten Signaturschlüssel wie boot/system oder einen vom OEM verwahrten Schlüssel verwenden, müssen jedoch durch PRK signiert sein.

##### 6.4.5.2 Schlüssel, Signaturen und Zertifikate

```text
#!/bin/sh
touch temp.bin
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:4096 -outform PEM -out
testkey_prk.pem
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:4096 -outform PEM -out
testkey_psk.pem
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:4096 -outform PEM -out
testkey_pik.pem
python avbtool make_atx_certificate --output=pik_certificate.bin --subject=temp.bin --
subject_key=testkey_pik.pem --subject_is_intermediate_authority --subject_key_version 42 --
authority_key=testkey_prk.pem
python avbtool make_atx_certificate --output=psk_certificate.bin --subject=product_id.bin --
subject_key=testkey_psk.pem --subject_key_version 42 --authority_key=testkey_pik.pem
python avbtool make_atx_metadata --output=metadata.bin --
intermediate_key_certificate=pik_certificate.bin --
product_key_certificate=psk_certificate.bin
```

permanent_attributes.bin erzeugen:

```text
python avbtool make_atx_permanent_attributes --output=permanent_attributes.bin --
product_id=product_id.bin --root_authority_key=testkey_prk.pem
```

product_id.bin muss selbst definiert werden, umfasst 16 Byte und kann als Produkt-ID dienen. Beispiel zur Signatur von boot.img:

```text
avbtool add_hash_footer --image boot.img --partition_size 33554432 --partition_name boot --
key testkey_psk.pem --algorithm SHA256_RSA4096
```

Achtung: partition size muss mindestens 64K größer als die ursprüngliche Firmware, auf 4K ausgerichtet und höchstens so groß wie die Partition in parameter.txt sein. Signaturbeispiel für sytem.img:

```text
avbtool add_hashtree_footer --partition_size 536870912 --partition_name system --image
system.img --algorithm SHA256_RSA4096 --key testkey_psk.pem
```

vbmeta mit metadata.bin erzeugen; Beispielbefehl:

```text
python avbtool make_vbmeta_image --public_key_metadata metadata.bin --
include_descriptors_from_image boot.img --include_descriptors_from_image system.img --
generate_dm_verity_cmdline_from_hashtree system.img --algorithm SHA256_RSA4096 --key
testkey_psk.pem  --output vbmeta.img
```

Das erzeugte vbmeta.img wird in die entsprechende Partition, beispielsweise vbmeta, geschrieben. PrivateKey.pem und PublicKey.pem werden mit SecureBootTool erzeugt.

![Abbildung 8: englische Quelle, Seite 198](/docs/rockchip-uboot-nextdev/assets/en-p198-figure-01.png)

*Abbildung 8: englische Quelle, Seite 198*

permanent_attributes.bin signieren:

```text
openssl dgst -sha256 -out permanent_attributes_cer.bin -sign PrivateKey.pem
permanent_attributes.bin
```

permanent_attributes.bin enthält die Sicherheitsauthentifizierungsdaten des gesamten Systems. Sein Hash muss in efuse/OTP programmiert oder die Daten durch die vorherige Stufe (pre-load) authentifiziert werden. Der für Rockchip vorgesehene efuse-Platz reicht nicht aus; deshalb erfolgt die Prüfung mit dem öffentlichen Schlüssel der vorherigen Stufe und dem Zertifikat von permanent_attributes.bin. Bei OTP-Plattformen reicht der sichere Speicher aus, sodass der Hash direkt in OTP geschrieben wird. Zur plattformspezifischen efuse-/OTP-Unterstützung siehe Treiberkapitel. pub_key auf efuse-Plattformen programmieren:

```text
fastboot stage permanent_attributes.bin
fastboot oem fuse at-perm-attr
fastboot stage permanent_attributes_cer.bin
fastboot oem fuse at-rsa-perm-attr
```

pub_key auf OTP-Plattformen programmieren:

```text
fastboot stage permanent_attributes.bin
fastboot oem fuse at-perm-attr
```

Vollständiger Signaturablauf:

![Abbildung 9: englische Quelle, Seite 199](/docs/rockchip-uboot-nextdev/assets/en-p199-figure-01.png)

*Abbildung 9: englische Quelle, Seite 199*

##### 6.4.5.3 AVB lock

```text
fastboot oem at-lock-vboot
```

Der Wechsel zu fastboot wird im Abschnitt zur fastboot-Befehlsunterstützung beschrieben.

##### 6.4.5.4 AVB unlock

Rockchip verwendet eine strenge Sicherheitsprüfung; im entsprechenden defconfig ist Folgendes zu ergänzen:

```text
CONFIG_RK_AVB_LIBAVB_ENABLE_ATH_UNLOCK=y
```

Andernfalls entsperrt fastboot oem at-unlock-vboot das Gerät, das dann trotz fehlgeschlagener Prüfung von vbmeta.img oder boot.img startet.

Zunächst PUK erzeugen:

```text
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:4096 -outform PEM -out
testkey_puk.pem
```

unlock_credential.bin ist das zum Entsperren auf das Gerät zu ladende Zertifikat. Erzeugung:

```text
python avbtool make_atx_certificate --output=puk_certificate.bin --subject=product_id.bin --
subject_key=testkey_puk.pem --usage=com.google.android.things.vboot.unlock --
subject_key_version 42 --authority_key=testkey_pik.pem
```

unlock_credential.bin vom Gerät erhalten: Mit avb-challenge-verify.py und den folgenden Befehlen unlock_credential.bin beziehen:

```text
python avbtool make_atx_unlock_credential --output=unlock_credential.bin --
intermediate_key_certificate=pik_certificate.bin --
unlock_key_certificate=puk_certificate.bin --challenge=unlock_challenge.bin --
unlock_key=testkey_puk.pem
```

Anschließend das Zertifikat mit fastboot auf das Gerät laden und es entsperren:

```text
fastboot stage unlock_credential.bin
fastboot oem at-unlock-vboot
```

Abschließender Entsperrablauf für OTP-Geräte:

![Abbildung 10: englische Quelle, Seite 201](/docs/rockchip-uboot-nextdev/assets/en-p201-figure-01.png)

*Abbildung 10: englische Quelle, Seite 201*

Abschließender Entsperrablauf für efuse-Geräte:

![Abbildung 11: englische Quelle, Seite 202](/docs/rockchip-uboot-nextdev/assets/en-p202-figure-01.png)

*Abbildung 11: englische Quelle, Seite 202*

Vorgehensweise:

1. Das Gerät in fastboot versetzen und am Computer eingeben:

```text
fastboot oem at-get-vboot-unlock-challenge
fastboot get_staged raw_unlock_challenge.bin
```

Die erhaltenen Daten enthalten Version, Product Id und eine 16 Byte lange Zufallszahl. Die Zufallszahl als unlock_challenge.bin extrahieren.

1. unlock_credential.bin mit avbtool erzeugen; siehe make_unlock.sh.

2. Am Computer eingeben:

```text
fastboot stage unlock_credential.bin
fastboot oem at-unlock-vboot
```

Achtung: Das Gerät muss in derselben, ursprünglich gestarteten fastboot-Sitzung bleiben. Nicht stromlos machen, ausschalten oder neu starten: Nach Schritt 1 speichert es die erzeugte Zufallszahl, die dadurch verloren ginge. Die folgende Prüfung der challenge signature würde wegen einer abweichenden Zufallszahl fehlschlagen. Wird Folgendes aktiviert:

```text
CONFIG_MISC=y
CONFIG_ROCKCHIP_EFUSE=y
CONFIG_ROCKCHIP_OTP=y
```

Als challenge number wird die gerätegebundene CPUID verwendet, die beim Ausschalten nicht verloren geht. unlock_credential.bin ist damit wiederverwendbar; die erneute Erzeugung von unlock_challenge.bin und unlock_credential.bin entfällt. Der erneute Entsperrvorgang lautet:

```text
fastboot oem at-get-vboot-unlock-challenge
fastboot stage unlock_credential.bin
fastboot oem at-unlock-vboot
```

1. Das Gerät in den Entsperrzustand versetzen und die Entsperrung starten. Beispiel für make_unlock.sh:

```text
#!/bin/sh
python avb-challenge-verify.py raw_unlock_challenge.bin product_id.bin
python avbtool make_unlock_credential --output=unlock_credential.bin --
intermediate_key_certificate=pik_certificate.bin --
unlock_key_certificate=puk_certificate.bin --challenge=unlock_challenge.bin --
unlock_key=testkey_puk.pem
```

Quellcode von avb-challenge-verify.py:

```text
#/user/bin/env python
"This is a test module for getting unlock_challenge.bin"
import sys
import  os
from hashlib import sha256

def challenge_verify():
    if (len(sys.argv) != 3) :
        print "Usage: rkpublickey.py [challenge_file] [product_id_file]"
        return
    if ((sys.argv[1] == "-h") or (sys.argv[1] == "--h")):
        print "Usage: rkpublickey.py [challenge_file] [product_id_file]"
        return
    try:
        challenge_file = open(sys.argv[1], 'rb')
        product_id_file = open(sys.argv[2], 'rb')
        challenge_random_file = open('unlock_challenge.bin', 'wb')
        challenge_data = challenge_file.read(52)
        product_id_data = product_id_file.read(16)
        product_id_hash = sha256(product_id_data).digest()
        print("The challege version is %d" %ord(challenge_data[0]))
        if (product_id_hash != challenge_data[4:36]) :
            print("Product id verify error!")
            return
        challenge_random_file.write(challenge_data[36:52])
        print("Success!")

    finally:
        if challenge_file:
            challenge_file.close()
        if product_id_file:
            product_id_file.close()
        if challenge_random_file:
            challenge_random_file.close()

if __name__ == '__main__':
    challenge_verify()
```

4.5.5 AVB in U-Boot benötigt trust-Unterstützung. Im U-Boot-defconfig konfigurieren:

```text
CONFIG_OPTEE_CLIENT=y
CONFIG_OPTEE_V1=y
CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION=y  // 安全数据存储到security分区
```

CONFIG_OPTEE_V1: Plattformen 312x, 322x, 3288, 3228H, 3368, 3399. CONFIG_OPTEE_V2: 3326, 3308. CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION nur aktivieren, wenn eMMC-RPMB nicht nutzbar ist; standardmäßig deaktiviert. Für AVB im defconfig konfigurieren:

```text
CONFIG_AVB_LIBAVB=y
CONFIG_AVB_LIBAVB_AB=y
CONFIG_AVB_LIBAVB_ATX=y
CONFIG_AVB_LIBAVB_USER=y
CONFIG_RK_AVB_LIBAVB_USER=y
// 上⾯⼏个为必选，下⾯选择为⽀持 AVB 与 A/B 特性，两个特性可以分开使⽤。
CONFIG_ANDROID_AB=y //这个⽀持 A/B
CONFIG_ANDROID_AVB=y //这个⽀持 AVB
// 下⾯宏为仅有 efuse 的平台使⽤
CONFIG_ROCKCHIP_PRELOADER_PUB_KEY=y
// 下⾯宏需要严格unlock校验时候打开
CONFIG_RK_AVB_LIBAVB_ENABLE_ATH_UNLOCK=y
// 安全校验开启
CONFIG_AVB_VBMETA_PUBLIC_KEY_VALIDATE=y
// 如果需要cpuid作为challenge number，开启以下宏
CONFIG_MISC=y
CONFIG_ROCKCHIP_EFUSE=y
CONFIG_ROCKCHIP_OTP=y
```

##### 6.4.5.5 Kernel-Konfiguration

Partitionen wie system, vendor und oem werden durch das Kernelmodul dm-verify geladen und geprüft; dieses muss daher aktiviert sein. Für AVB den Parameter avb im Kernel-DTS konfigurieren, beispielsweise:

```text
&firmware_android {
    compatible = "android,firmware";
    boot_devices = "fe330000.sdhci";
    vbmeta {
        compatible = "android,vbmeta";
        parts = "vbmeta,boot,system,vendor,dtbo";
    };
    fstab {
        compatible = "android,fstab";
        vendor {
            compatible = "android,vendor";
            dev = "/dev/block/by-name/vendor";
            type = "ext4";
            mnt_flags = "ro,barrier=1,inode_readahead_blks=8";
            fsmgr_flags = "wait,avb";
        };
    };
};
```

Für A/B system den Parameter slotselect konfigurieren, beispielsweise:

```text
firmware {
    android {
        compatible = "android,firmware";
        fstab {
            compatible = "android,fstab";
            system {
                compatible = "android,system";
                dev = "/dev/block/by-name/system";
                type = "ext4";
                mnt_flags = "ro,barrier=1,inode_readahead_blks=8";
                fsmgr_flags = "wait,verify,slotselect";
            };
            vendor {
                compatible = "android,vendor";
                dev = "/dev/block/by-name/vendor";
                type = "ext4";
                mnt_flags = "ro,barrier=1,inode_readahead_blks=8";
                fsmgr_flags = "wait,verify,slotselect";
            };
        };
    };
};
```

##### 6.4.5.6 Android SDK

Android-SDK-Konfiguration: Für AVB BOARD_AVB_ENABLE aktivieren. Die A/B-system-Variablen fallen in drei Gruppen. Erforderlich: `AB_OTA_UPDATER := true`; `AB_OTA_PARTITIONS := boot system vendor`; `BOARD_BUILD_SYSTEM_ROOT_IMAGE := true`; `TARGET_NO_RECOVERY := true`; `BOARD_USES_RECOVERY_AS_BOOT := true`; `PRODUCT_PACKAGES += update_engine update_verifier`. Optional: `PRODUCT_PACKAGES_DEBUG += update_engine_client`. In A/B nicht definierbar: BOARD_RECOVERYIMAGE_PARTITION_SIZE, BOARD_CACHEIMAGE_PARTITION_SIZE, BOARD_CACHEIMAGE_FILE_SYSTEM_TYPE.

##### 6.4.5.7 Neue cmdline-Inhalte

```text
Kernel command line: androidboot.verifiedbootstate=green androidboot.slot_suffix=_a dm="1
vroot none ro 1,0 1031864 verity 1 PARTUUID=b2110000-0000-455a-8000-44780000706f
PARTUUID=b2110000-0000-455a-8000-44780000706f 4096 4096 128983 128983 sha1
90d1d406caac04b7e3fbf48b9a4dcd6992cc628e 4172683f0d6b6085c09f6ce165cf152fe3523c89 10
restart_on_corruption ignore_zero_blocks use_fec_from_device PARTUUID=b2110000-0000-455a-
8000-44780000706f fec_roots 2 fec_blocks 130000 fec_start 130000" root=/dev/dm-0
androidboot.vbmeta.device=PARTUUID=f24f0000-0000-4e1b-8000-791700006a98
androidboot.vbmeta.avb_version=1.1 androidboot.vbmeta.device_state=unlocked
androidboot.vbmeta.hash_alg=sha512 androidboot.vbmeta.size=6528
androidboot.vbmeta.digest=41991c02c82ea1191545c645e2ac9cc7ca08b3da0a2e3115aff479d2df61feaccd
d35b6360cfa936f6f4381e4557ef18e381f4b236000e6ecc9ada401eda4cae
androidboot.vbmeta.invalidate_on_error=yes androidboot.veritymode=enforcing
```

Erläuterungen zu einigen Parametern:

1. Warum wird die PARTUUID von vbmeta übergeben? Damit der später verwendete vbmeta-Hashbaum gültig ist, prüft der Kernel vbmeta erneut; der Digest steht in androidboot.vbmeta.digest.

2. skip_initramfs: Enthält boot.img eine Boot-Ramdisk? Bei A/B system wird die Ramdisk nicht in

boot.img gepackt; deshalb muss cmdline diesen Parameter enthalten.

3. root=/dev/dm-0 aktiviert dm-verify und bezeichnet system.

4. androidboot.vbmeta.device_state: Android-verify-Zustand.

5. androidboot.verifiedbootstate: Prüfergebnis. green — Zustand LOCKED und der Prüfschlüssel wurde nicht vom Endnutzer gesetzt; yellow — LOCKED und der Prüfschlüssel wurde vom Endnutzer gesetzt; orange — UNLOCKED. Die Erzeugung von dm="1 vroot none ro......" wird nachfolgend gesondert erläutert:

```text
avbtool make_vbmeta_image --include_descriptors_from_image boot.img --
include_descriptors_from_image system.img --generate_dm_verity_cmdline_from_hashtree
system.img --include_descriptors_from_image vendor.img --algorithm SHA512_RSA4096 --key
testkey_psk.pem --public_key_metadata metadata.bin --output vbmeta.img
```

Beim Erzeugen von vbmeta mit avbtool für die system-Firmware --generate_dm_verity_cmdline_from_hashtree ergänzen. Die Angaben dm="1 vroot none ro......" werden in vbmeta gespeichert. Dies ist Android-spezifisch; wird nur boot.img geprüft, ist der Parameter nicht erforderlich. Im Android SDK fügt BOARD_AVB_ENABLE diese Informationen zu vbmeta hinzu.

#### 6.4.6 Partitionsreferenz

Neu sind die Partitionen vbmeta und security: vbmeta speichert Firmwareprüfdaten, security verschlüsselte Sicherheitsdaten.

```text
FIRMWARE_VER:8.0
MACHINE_MODEL:RK3326
MACHINE_ID:007
MANUFACTURER: RK3326
MAGIC: 0x5041524B
ATAG: 0x00200800
MACHINE: 3326
CHECK_MASK: 0x80
PWR_HLD: 0,0,A,0,1
TYPE: GPT
CMDLINE:mtdparts=rk29xxnand:0x00002000@0x00004000(uboot),0x00002000@0x00006000(trust),0x0000
2000@0x00008000(misc),0x00008000@0x0000a000(resource),0x00010000@0x00012000(kernel),0x000020
00@0x00022000(dtb),0x00002000@0x00024000(dtbo),0x00000800@0x00026000(vbmeta),0x00010000@0x00
026800(boot),0x00020000@0x00036800(recovery),0x00038000@0x00056800(backup),0x00002000@0x0008
e800(security),0x000c0000@0x00090800(cache),0x00514000@0x00150800(system),0x00008000@0x00664
800(metadata),0x000c0000@0x0066c800(vendor),0x00040000@0x0072c800(oem),0x00000400@0x0076c800
(frp),-@0x0076cc00(userdata:grow)
uuid:system=af01642c-9b84-11e8-9b2a-234eb5e198a0
```

Beispiel einer A/B-System-Partitionsdefinition:

```text
FIRMWARE_VER:8.1
MACHINE_MODEL:RK3326
MACHINE_ID:007
MANUFACTURER: RK3326
MAGIC: 0x5041524B
ATAG: 0x00200800
MACHINE: 3326
CHECK_MASK: 0x80
PWR_HLD: 0,0,A,0,1
TYPE: GPT
CMDLINE:
mtdparts=rk29xxnand:0x00002000@0x00004000(uboot_a),0x00002000@0x00006000(uboot_b),0x00002000
@0x00008000(trust_a),0x00002000@0x0000a000(trust_b),0x00001000@0x0000c000(misc),0x00001000@0
x0000d000(vbmeta_a),0x00001000@0x0000e000(vbmeta_b),0x00020000@0x0000e000(boot_a),0x00020000
@0x0002e000(boot_b),0x00100000@0x0004e000(system_a),0x00300000@0x0032e000(system_b),0x001000
00@0x0062e000(vendor_a),0x00100000@0x0072e000(vendor_b),0x00002000@0x0082e000(oem_a),0x00002
000@0x00830000(oem_b),0x0010000@0x00832000(factory),0x00008000@0x842000(factory_bootloader),
0x00080000@0x008ca000(oem),-@0x0094a000(userdata)
```

#### 6.4.7 fastboot-Befehle

In U-Boot lässt sich fastboot mit folgendem Befehl aufrufen:

```text
fastboot usb 0
```

##### 6.4.7.1 Befehlsübersicht

```text
fastboot flash < partition > [ < filename > ]
fastboot erase < partition >
fastboot getvar < variable > | all
fastboot set_active < slot >
fastboot reboot
fastboot reboot-bootloader
fastboot flashing unlock
fastboot flashing lock
fastboot stage [ < filename > ]
fastboot get_staged [ < filename > ]
fastboot oem fuse at-perm-attr-data
fastboot oem fuse at-perm-attr
fastboot oem fuse at-rsa-perm-attr
fastboot oem at-get-ca-request
fastboot oem at-set-ca-response
fastboot oem at-lock-vboot
fastboot oem at-unlock-vboot
fastboot oem at-disable-unlock-vboot
fastboot oem fuse at-bootloader-vboot-key
fastboot oem format
fastboot oem at-get-vboot-unlock-challenge
fastboot oem at-reset-rollback-index
```

##### 6.4.7.2 Befehlsverwendung

1. `fastboot flash &lt; partition &gt; [ &lt; filename &gt; ]`: Partition programmieren. Beispiel: `fastboot flash boot boot.img`.

1. `fastboot erase &lt; partition &gt;`: Partition löschen. Beispiel: `fastboot erase boot`.

1. `fastboot getvar &lt; variable &gt; &#124; all`: Geräteinformationen abrufen. Beispiel: `fastboot getvar all` ruft alle Informationen ab. Weitere Werte für variable:

```text
version                               /* fastboot 版本 */
version-bootloader                    /* U-Boot 版本 */
version-baseband
product                               /* 产品信息 */
serialno                              /* 序列号 */
secure                                /* 是否开启安全校验 */
max-download-size                     /* fastboot ⽀持单次传输最⼤字节数 */
logical-block-size                    /* 逻辑块数 */
erase-block-size                      /* 擦除块数 */
partition-type : < partition >        /* 分区类型 */
partition-size : < partition >        /* 分区⼤⼩ */
unlocked                              /* 设备lock状态 */
off-mode-charge
battery-voltage
variant
battery-soc-ok
slot-count                            /* slot 数⽬ */
has-slot: < partition >               /* 查看slot内是否有该分区名 */
current-slot                          /* 当前启动的slot */
slot-suffixes                         /* 当前设备具有的slot,打印出其name */
slot-successful: < _a | _b >          /* 查看分区是否正确校验启动过 */
slot-unbootable: < _a | _b >          /* 查看分区是否被设置为unbootable */
slot-retry-count: < _a | _b >         /* 查看分区的retry-count次数 */
at-attest-dh
at-attest-uuid
at-vboot-state
```

Beispiel für fastboot getvar all:

```text
PS E:\U-Boot-AVB\adb> .\fastboot.exe getvar all
(bootloader) version:0.4
(bootloader) version-bootloader:U-Boot 2017.09-gc277677
(bootloader) version-baseband:N/A
(bootloader) product:rk3229
(bootloader) serialno:7b2239270042f8b8
(bootloader) secure:yes
(bootloader) max-download-size:0x04000000
(bootloader) logical-block-size:0x512
(bootloader) erase-block-size:0x80000
(bootloader) partition-type:bootloader_a:U-Boot
(bootloader) partition-type:bootloader_b:U-Boot
(bootloader) partition-type:tos_a:U-Boot
(bootloader) partition-type:tos_b:U-Boot
(bootloader) partition-type:boot_a:U-Boot
(bootloader) partition-type:boot_b:U-Boot
(bootloader) partition-type:system_a:ext4
(bootloader) partition-type:system_b:ext4
(bootloader) partition-type:vbmeta_a:U-Boot
(bootloader) partition-type:vbmeta_b:U-Boot
(bootloader) partition-type:misc:U-Boot
(bootloader) partition-type:vendor_a:ext4
(bootloader) partition-type:vendor_b:ext4
(bootloader) partition-type:oem_bootloader_a:U-Boot
(bootloader) partition-type:oem_bootloader_b:U-Boot
(bootloader) partition-type:factory:U-Boot
(bootloader) partition-type:factory_bootloader:U-Boot
(bootloader) partition-type:oem_a:ext4
(bootloader) partition-type:oem_b:ext4
(bootloader) partition-type:userdata:ext4
(bootloader) partition-size:bootloader_a:0x400000
(bootloader) partition-size:bootloader_b:0x400000
(bootloader) partition-size:tos_a:0x400000
(bootloader) partition-size:tos_b:0x400000
(bootloader) partition-size:boot_a:0x2000000
(bootloader) partition-size:boot_b:0x2000000
(bootloader) partition-size:system_a:0x20000000
(bootloader) partition-size:system_b:0x20000000
(bootloader) partition-size:vbmeta_a:0x10000
(bootloader) partition-size:vbmeta_b:0x10000
(bootloader) partition-size:misc:0x100000
(bootloader) partition-size:vendor_a:0x4000000
(bootloader) partition-size:vendor_b:0x4000000
(bootloader) partition-size:oem_bootloader_a:0x400000
(bootloader) partition-size:oem_bootloader_b:0x400000
(bootloader) partition-size:factory:0x2000000
(bootloader) partition-size:factory_bootloader:0x1000000
(bootloader) partition-size:oem_a:0x10000000
(bootloader) partition-size:oem_b:0x10000000
(bootloader) partition-size:userdata:0x7ad80000
(bootloader) unlocked:no
(bootloader) off-mode-charge:0
(bootloader) battery-voltage:0mv
(bootloader) variant:rk3229_evb
(bootloader) battery-soc-ok:no
(bootloader) slot-count:2
(bootloader) has-slot:bootloader:yes
(bootloader) has-slot:tos:yes
(bootloader) has-slot:boot:yes
(bootloader) has-slot:system:yes
(bootloader) has-slot:vbmeta:yes
(bootloader) has-slot:misc:no
(bootloader) has-slot:vendor:yes
(bootloader) has-slot:oem_bootloader:yes
(bootloader) has-slot:factory:no
(bootloader) has-slot:factory_bootloader:no
(bootloader) has-slot:oem:yes
(bootloader) has-slot:userdata:no
(bootloader) current-slot:a
(bootloader) slot-suffixes:a,b
(bootloader) slot-successful:a:yes
(bootloader) slot-successful:b:no
(bootloader) slot-unbootable:a:no
(bootloader) slot-unbootable:b:yes
(bootloader) slot-retry-count:a:0
(bootloader) slot-retry-count:b:0
(bootloader) at-attest-dh:1:P256
(bootloader) at-attest-uuid:
all: Done!
finished. total time: 0.636s
```

1. `fastboot set_active &lt; slot &gt;`: Slot für den Neustart auswählen. Beispiel: `fastboot set_active _a`.

1. `fastboot reboot`: Gerät regulär neu starten. Beispiel: `fastboot reboot`.

1. `fastboot reboot-bootloader`: Neustart in fastboot. Beispiel: `fastboot reboot-bootloader`.

1. `fastboot flashing unlock`: Gerät entsperren und Firmwareprogrammierung zulassen. Beispiel: `fastboot flashing unlock`.

1. `fastboot flashing lock`: Gerät sperren und Programmierung verbieten.

Beispiel: `fastboot flashing lock`.

1. `fastboot stage [ &lt; filename &gt; ]`: Daten in den Gerätespeicher ab CONFIG_FASTBOOT_BUF_ADDR laden. Beispiel: `fastboot stage permanent_attributes.bin`.

1. `fastboot get_staged [ &lt; filename &gt; ]`: Daten vom Gerät abrufen. Beispiel: `fastboot get_staged raw_unlock_challenge.bin`.

1. `fastboot oem fuse at-perm-attr`: permanent_attributes.bin und seinen Hash programmieren. Beispiel: zuerst `fastboot stage permanent_attributes.bin`, dann `fastboot oem fuse at-perm-attr`.

1. `fastboot oem fuse at-perm-attr-data`: Nur permanent_attributes.bin in den sicheren RPMB-Speicher schreiben. Beispiel: zuerst `fastboot stage permanent_attributes.bin`, dann `fastboot oem fuse at-perm-attr-data`.

1. fastboot oem at-get-ca-request

2. fastboot oem at-set-ca-response

3. `fastboot oem at-lock-vboot`: Gerät sperren. Beispiel: `fastboot oem at-lock-vboot`.

1. `fastboot oem at-unlock-vboot`: Gerät entsperren; authenticated unlock wird unterstützt. Beispielablauf: `fastboot oem at-get-vboot-unlock-challenge`; `fastboot get_staged raw_unlock_challenge.bin`; `./make_unlock.sh` (siehe make_unlock.sh-Beispiel); `fastboot stage unlock_credential.bin`; `fastboot oem at-unlock-vboot`.

1. `fastboot oem fuse at-bootloader-vboot-key`: Bootloader-Schlüsselhash programmieren. Beispiel: zuerst `fastboot stage bootloader-pub-key.bin`, dann `fastboot oem fuse at-bootloader-vboot-key`.

1. `fastboot oem format`: Partitionen neu formatieren; die Partitionsinformationen richten sich nach $partitions.

Beispiel: `fastboot oem format`.

1. `fastboot oem at-get-vboot-unlock-challenge`: unlock challenge für authenticated unlock abrufen. Beispiel siehe Punkt 16, fastboot oem at-unlock-vboot.

1. `fastboot oem at-reset-rollback-index`: Rollbackdaten des Geräts zurücksetzen. Beispiel: `fastboot oem at-reset-rollback-index`.

1. `fastboot oem at-disable-unlock-vboot`: fastboot oem at-unlock-vboot deaktivieren. Beispiel: `fastboot oem at-disable-unlock-vboot`.

#### 6.4.8 Firmware programmieren

Nachfolgend das Windows-Werkzeug zum Programmieren der Firmware:

![Abbildung 12: englische Quelle, Seite 213](/docs/rockchip-uboot-nextdev/assets/en-p213-figure-01.png)

*Abbildung 12: englische Quelle, Seite 213*

A/B System programmieren

![Abbildung 13: englische Quelle, Seite 214](/docs/rockchip-uboot-nextdev/assets/en-p214-figure-01.png)

*Abbildung 13: englische Quelle, Seite 214*

#### 6.4.9 Pre-loader verified

Siehe Rockchip-Secure-Boot-Application-Note.md.

![Abbildung 14: englische Quelle, Seite 215](/docs/rockchip-uboot-nextdev/assets/en-p215-figure-01.png)

*Abbildung 14: englische Quelle, Seite 215*

#### 6.4.10 U-boot verified

Prüfablauf für OTP-Geräte:

Prüfablauf für efuse-Geräte:

#### 6.4.11 Verifizierter Systemstart

![Abbildung 15: englische Quelle, Seite 220](/docs/rockchip-uboot-nextdev/assets/en-p220-figure-02.png)

*Abbildung 15: englische Quelle, Seite 220*

Nach dem Start wertet der Kernel die von U-Boot übergebene cmdline aus und bestimmt, ob dm-verify verwendet wird. Anschließend wird der fs_mgr-Dienst für system geladen und aktiviert. fs_mgr prüft und lädt Firmware anhand von fsmgr_flags; Firmwarehash und Hashbaum liegen in vbmeta.img. Wesentliche Parameter: avb — Partition mit AVB prüfen und laden; slotselect — Partition besitzt A/B-Slots, beim Laden wird androidboot.slot_suffix=_a aus cmdline verwendet.

#### 6.4.12 Linux AVB

Nachfolgend Bedienung und Prüfung von AVB unter Linux.

##### 6.4.12.1 Vorgehensweise

1. Den vollständigen Firmware-Satz erzeugen.

2. PrivateKey.pem und PublicKey.pem mit SecureBootConsole erzeugen; das Werkzeug ist rk_sign_tool mit folgendem Befehl:

```text
rk_sign_tool cc --chip 3399
rk_sign_tool kk --out .
```

3. Schlüssel laden.

```text
rk_sign_tool lk --key privateKey.pem --pubkey publicKey.pem
```

4. loader signieren.

```text
rk_sign_tool sl --loader loader.bin
```

5. uboot.img und trust.img signieren.

```text
rk_sign_tool si --img uboot.img
rk_sign_tool si --img trust.img
```

6. Vorbereitung der AVB-Signatur: Eine leere temp.bin, eine 16 Byte große product_id.bin sowie die zu signierende boot.img vorbereiten. Folgenden Code ausführen:

```text
#!/bin/bash
touch temp.bin
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:4096 -outform PEM -out
testkey_prk.pem
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:4096 -outform PEM -out
testkey_psk.pem
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:4096 -outform PEM -out
testkey_pik.pem
python avbtool make_atx_certificate --output=pik_certificate.bin --subject=temp.bin --
subject_key=testkey_pik.pem --subject_is_intermediate_authority --subject_key_version 42 --
authority_key=testkey_prk.pem
python avbtool make_atx_certificate --output=psk_certificate.bin --subject=product_id.bin --
subject_key=testkey_psk.pem --subject_key_version 42 --authority_key=testkey_pik.pem
python avbtool make_atx_metadata --output=metadata.bin --
intermediate_key_certificate=pik_certificate.bin --
product_key_certificate=psk_certificate.bin
python avbtool make_atx_permanent_attributes --output=permanent_attributes.bin --
product_id=product_id.bin --root_authority_key=testkey_prk.pem
python avbtool add_hash_footer --image boot.img --partition_size 33554432 --partition_name
boot --key testkey_psk.pem --algorithm SHA256_RSA4096
python avbtool make_vbmeta_image --public_key_metadata metadata.bin --
include_descriptors_from_image boot.img --algorithm SHA256_RSA4096 --key testkey_psk.pem  --
output vbmeta.img
openssl dgst -sha256 -out permanent_attributes_cer.bin -sign PrivateKey.pem
permanent_attributes.bin
```

Erzeugt werden vbmeta.img, permanent_attributes_cer.bin und permanent_attributes.bin. Dieser Schritt signiert boot.img usw.

7. Firmware programmieren.

```text
rkdeveloptool db loader.bin
rkdeveloptool ul loader.bin
rkdeveloptool gpt parameter.txt
rkdeveloptool wlx uboot uboot.img
rkdeveloptool wlx trust trust.img
rkdeveloptool wlx boot boot.img
rkdeveloptool wlx system system.img
```

rkdeveloptool: https://github.com/rockchip-linux/rkdeveloptool.

1. permanent_attributes_cer.bin und permanent_attributes.bin programmieren. Für OTP-Plattformen:

```text
fastboot stage permanent_attributes.bin
fastboot oem fuse at-perm-attr
```

Für efuse-Plattformen:

```text
fastboot stage permanent_attributes.bin
fastboot oem fuse at-perm-attr
fastboot stage permanent_attributes_cer.bin
fastboot oem fuse at-rsa-perm-attr
```

1. efuse programmieren: Das Werkzeug ist derzeit nur für Windows verfügbar. Den speziellen loader und das passende Gerät auswählen, dann die Programmierung starten.

![Abbildung 16: englische Quelle, Seite 223](/docs/rockchip-uboot-nextdev/assets/en-p223-figure-01.png)

*Abbildung 16: englische Quelle, Seite 223*

1. Das Programmieren des öffentlichen loader-Schlüssels auf OTP-Plattformen beschreibt Rockchip-Secure-Boot-Application-Note.md.

##### 6.4.12.2 Prüfverfahren

[TODO — dieser Abschnitt ist bereits im Original unvollständig.]

### 6.5 SD-Start und -Update

#### 6.5.1 Einführung

Rockchip unterscheidet normale SD-Karten, Aktualisierungs-, Boot- und Reparaturkarten. Das Rockchip-Werkzeug zur Erstellung von Aktualisierungsdatenträgern schreibt update.img auf die SD-Karte und erzeugt den gewünschten Kartentyp.

| Kartentyp | Funktion |
| --- | --- |
| Normale SD-Karte | Normales Speichergerät |
| SD-Updatekarte | Recovery von SD starten; recovery aktualisiert Gerätespeicher mit SD-Firmware |
| SD-Startkarte | Gerät direkt von SD starten |
| SD-Reparaturkarte | Firmware ab pre-loader von SD in Gerätespeicher kopieren |

#### 6.5.2 Klassifizierung

##### 6.5.2.1 Normale Karte

Eine normale SD-Karte wird wie am PC verwendet und dient in U-Boot und Kernel als gewöhnlicher Speicher. Eine Vorbereitung mit einem speziellen Werkzeug ist nicht erforderlich.

##### 6.5.2.2 Aktualisierungskarte

Die mit dem RK-Werkzeug erstellte Aktualisierungskarte aktualisiert Firmware auf lokalem Speicher wie eMMC oder NAND Flash ohne PC oder Netzwerk. Der Bootcode liegt im reservierten SD-Bereich, die Firmware in der sichtbaren Partition. Beim Start von SD schreiben Boot- und Aktualisierungscode die Firmware in den lokalen Hauptspeicher. Auch PCBA-Tests und das Kopieren von Demo-Dateien werden unterstützt. Dies erhöht die Fertigungseffizienz durch den PC-unabhängigen Ablauf. Ist die Karte bereits erstellt und sollen nur Firmware und Demo-Dateien erneuert werden, wie folgt vorgehen:

1. Firmware in das SD-Wurzelverzeichnis kopieren und in sdupdate.img umbenennen.

2. Demo-Dateien in das Verzeichnis Demo im SD-Wurzelverzeichnis kopieren. Format der SD-Aktualisierungsbootkarte ohne GPT:

| Offset | Datenabschnitt |
| --- | --- |
| Sektor 0 | MBR |
| Sektor 64-4M | IDBLOCK(Startflag auf 0) |
| 4M-8M | Parameter |
| 12M-16M | uboot |
| 16M-20M | trust |
| ...... | misc |
| ...... | resource |
| ...... | kernel |
| ...... | recovery |
| Restlicher Speicher | Fat32 enthält update.img |

Format der SD-Aktualisierungsbootkarte mit GPT:

| Offset | Datenabschnitt |
| --- | --- |
| Sektor 0 | MBR |
| Sektor 1-34 | GPT-Partitionstabelle |
| Sektor 64-4M | IDBLOCK(Startflag auf 0) |
| 4M-8M | Parameter |
| ...... | uboot |
| ...... | trust |
| ...... | misc |
| ...... | resource |
| ...... | kernel |
| ...... | recovery |
| Restlicher Speicher | Fat32 enthält update.img |

##### 6.5.2.3 Bootkarte

Eine mit dem RK-Werkzeug erstellte Bootkarte startet neue Firmware direkt von SD, ohne den Gerätespeicher neu programmieren zu müssen. Die Firmware wird auf SD geschrieben und diese als Hauptspeicher verwendet. Firmware und temporäre Dateien liegen auf SD; ein lokaler Hauptspeicher ist nicht erforderlich. Hauptanwendungen sind Systemstart von SD und PCBA-Tests. Hinweis: PCBA-Tests sind eine Funktion von recovery und sowohl auf Aktualisierungs- als auch auf Bootkarten möglich. Format einer SD-Bootkarte ohne GPT:

| Offset | Datenabschnitt |
| --- | --- |
| Sektor 0 | MBR |
| Sektor 64-4M | IDBLOCK(Startflag auf 1) |
| 4M-8M | Parameter |
| 8M-12M | uboot |
| 12M-16M | trust |
| ...... | misc |
| ...... | resource |
| ...... | boot |
| ...... | kernel |
| ...... | recovery |
| ...... | system |
| ...... | user |

Format einer SD-Bootkarte mit GPT:

| Offset | Datenabschnitt |
| --- | --- |
| Sektor 0 | MBR |
| Sektor 1-34 | GPT-Partitionstabelle |
| Sektor 64-4M | IDBLOCK(Startflag auf 1) |
| ...... | uboot |
| ...... | Boot |
| ...... | trust |
| ...... | resource |
| ...... | kernel |
| ...... | recovery |
| ...... | system |
| ...... | vendor |
| ...... | oem |
| ...... | user |
| Letzte 33 Sektoren | GPT-Sicherung |

##### 6.5.2.4 Reparaturkarte

Die Reparaturkarte ähnelt der Aktualisierungskarte, die Firmwareaktualisierung übernimmt jedoch miniloader. Das Werkzeug schreibt Bootcode in den reservierten SD-Bereich und kopiert Firmware in die sichtbare Partition. Beim Start von SD schreibt der Aktualisierungscode die Firmware in den lokalen Hauptspeicher. Hauptzweck ist die Reparatur eines Geräts mit beschädigter Firmware. Format ohne GPT:

| Offset | Datenabschnitt |
| --- | --- |
| Sektor 0 | MBR |
| Sektor 64-4M | IDBLOCK(Startflag auf 2) |
| 4M-8M | Parameter |
| 8M-12M | uboot |
| 12M-16M | trust |
| ...... | misc |
| ...... | resource |
| ...... | boot |
| ...... | kernel |
| ...... | recovery |
| ...... | system |
| ...... | user |

Format der Reparaturkarte mit GPT:

| Offset | Datenabschnitt |
| --- | --- |
| Sektor 0 | MBR |
| Sektor 1-34 | GPT-Partitionstabelle |
| Sektor 64-4M | IDBLOCK(Startflag auf 2) |
| ...... | uboot |
| ...... | Boot |
| ...... | trust |
| ...... | resource |
| ...... | kernel |
| ...... | recovery |
| ...... | system |
| ...... | vendor |
| ...... | oem |
| ...... | user |
| Letzte 33 Sektoren | GPT-Sicherung |

#### 6.5.3 Firmwarekennzeichnungen

Die Funktion der SD-Karte wird durch Kennzeichen festgelegt. Ist die magic number am Anfang von Sektor 64 gleich 0xFCDC8C3B, handelt es sich um eine Spezialkarte, von der Firmware gelesen und das Gerät gestartet wird. Andernfalls gilt sie als normale SD-Karte. Bei Sektor 64 + 616 bytes liegt die Kartentypkennung. Es gibt drei Typen:

| Flag | Kartentyp |
| --- | --- |
| 0 | Update- oder PCBA-Testkarte |
| 1 | Startkarte |
| 2 | Reparaturkarte |

#### 6.5.4 Startablauf

Der SD-Bootablauf gliedert sich in pre-loader und U-Boot. Beide erkennen und laden die SD-Karte, prüfen das Startup Flag in ihrem IDBBlock und führen abhängig davon unterschiedliche Funktionen aus. Ablauf:

![Abbildung 17: englische Quelle, Seite 229](/docs/rockchip-uboot-nextdev/assets/en-p229-figure-01.png)

*Abbildung 17: englische Quelle, Seite 229*

##### 6.5.4.1 pre-loader-Start

![Abbildung 18: englische Quelle, Seite 230](/docs/rockchip-uboot-nextdev/assets/en-p230-figure-01.png)

*Abbildung 18: englische Quelle, Seite 230*

Maskrom findet zunächst einen verwendbaren miniloader und übergibt ihm die Kontrolle. Unterstützte Bootmedien und Prioritäten stehen im TRM; Maskrom durchsucht verfügbare Speicher nacheinander. Miniloader sucht die Speichergeräte erneut und prüft bei vorhandener SD-Karte deren IDB-Firmware und anschließend den Kartenflag. Ist die Karte nutzbar und der Flag 0 oder 1, wird U-Boot von SD geladen. Flag 2 startet die Reparatur und Firmwareaktualisierung im loader. Der normale Start durchsucht die übrigen Speicher und startet den nachfolgenden loader.

##### 6.5.4.2 U-Boot-Start

![U-Boot-Start: englische Quelle, S. 232 (seitenübergreifendes Diagramm)](/docs/rockchip-uboot-nextdev/assets/en-p232-uboot-flow-vector.png)

*U-Boot-Start: englische Quelle, S. 232 (seitenübergreifendes Diagramm)*

![U-Boot-Start: englische Quelle, S. 233 (seitenübergreifendes Diagramm)](/docs/rockchip-uboot-nextdev/assets/en-p233-uboot-flow-vector.png)

*U-Boot-Start: englische Quelle, S. 233 (seitenübergreifendes Diagramm)*

Aktualisierungskarte: U-Boot sucht Speichergeräte erneut. Enthält SD IDB-Firmware und ist der Kartenflag 0, wird sdfwupdate zur Kernel-cmdline hinzugefügt. Anschließend wird der Bootmodus aus misc auf SD gelesen; bei recovery wird recovery gestartet. Bootkarte: U-Boot sucht ebenfalls erneut nach Speichern, prüft IDB und Flag 1. Der Modus aus misc auf SD bestimmt den Start: recovery startet recovery, normal den Kernel.

##### 6.5.4.3 Recovery und PCBA

Einzelheiten siehe Rockchip Recovery 用户操作指南 V1.03.pdf, das Rockchip-Recovery-Benutzerhandbuch.

#### 6.5.5 Hinweise

Für Firmware ohne GPT muss U-Boot CONFIG_RKPARM_PARTITION aktivieren. Beim Erstellen einer SD-Aktualisierungskarte muss update.img MiniloaderAll.bin, parameter.txt, uboot.img, trust.img, misc.img, resource.img und recovery.img enthalten. Andernfalls meldet das Programmieren von update.img einen MBR-Schreibfehler.

## 7 Konfiguration verkleinern

TODO — im Original nicht ausgefüllt.

## 8 Debugging

Dieses Kapitel beschreibt gebräuchliche U-Boot-Debugverfahren: Befehle, Skripte, Konfigurationsoptionen, Startausgaben usw.

### 8.1 DEBUG

Funktion: debug()-Ausgaben global aktivieren. Die Makrodefinition in rkxxx_common.h der jeweiligen Plattform ergänzen:

```text
#define DEBUG
```

### 8.2 Initcall

Funktion: Startablauf ausgeben. U-Boot startet durch eine Folge von initcall-Aufrufen. debug() in initcall_run_list() durch printf() ersetzen, beispielsweise:

```text
U-Boot 2017.09-01725-g03b8d3b-dirty (Jul 06 2018 - 10:08:27 +0800)

initcall: 0000000000214388
initcall: 0000000000214724
Model: Rockchip RK3399 Evaluation Board
initcall: 0000000000214300
DRAM:  initcall: 0000000000203f68
initcall: 0000000000214410  // 结合反汇编找出地址对应的函数
initcall: 00000000002140dc
....
3.8 GiB
initcall: 00000000002143b8
....
Relocation Offset is: f5c03000
initcall: 00000000f5e176bc
initcall: 00000000002146a4 (relocated to 00000000f5e176a4)
initcall: 0000000000214668 (relocated to 00000000f5e17668)

...
```

### 8.3 io-Befehl

Funktion: Speicher lesen und schreiben.

```text
// 读操作
md - memory display
Usage: md [.b, .w, .l, .q] address [# of objects]

// 写操作
mw - memory write (fill)
Usage: mw [.b, .w, .l, .q] address value [count]
```

Lesen. Beispiel: 0x10 aufeinanderfolgende Datenwerte ab Adresse 0x76000000 anzeigen.

```text
=> md.l 0x76000000 0x10
76000000: fffffffe ffffffff ffffffff ffffffff    ................
76000010: ffffffdf ffffffff feffffff ffffffff    ................
76000020: ffffffff ffffffff ffffffff ffffffff    ................
76000030: ffffffff ffffffff ffffffff ffffffff    ................
```

Schreiben. Beispiel: 0x1234 an Adresse 0x76000000 schreiben.

```text
=> mw.l 0x76000000 0xffff1234 // ⾼16位有mask
=> md.l 0x76000000 0x10       // 回读
76000000: ffff1234 ffffffff ffffffff ffffffff    ................
76000010: ffffffdf ffffffff feffffff ffffffff    ................
76000020: ffffffff ffffffff ffffffff ffffffff    ................
76000030: ffffffff ffffffff ffffffff ffffffff    ................
```

### 8.4 iomem-Befehl

Funktion: Speicher lesen. Flexibler als md, da die Basisadresse automatisch aus dem DTS-Knoten ermittelt wird.

```text
=> iomem
iomem - Show iomem data by device compatible

Usage:
// @<compatible>：节点的compatible部分关键词匹配
iomem <compatible> <start offset>  <end offset>
eg: iomem -grf 0x0 0x200
```

Beispiel: GRF-Daten von RK3228 im Bereich 0x00–0x20 lesen.

```text
// 这⾥为了和"rockchip, rk3288-pmugrf" 区分开，所以⽤"-grf"作为关键词
=> iomem -grf 0x0 0x20
rockchip,rk3228-grf:
11000000:  00000000 00000000 00004000 00002000
11000010:  00000000 00005028 0000a5a5 0000aaaa
11000020:  00009955
```

### 8.5 i2c-Befehl

Funktion: I2C-Geräte lesen und schreiben.

```text
=> i2c
i2c - I2C sub-system

Usage:
i2c dev [dev] - show or set current I2C bus
i2c md chip address[.0, .1, .2] [# of objects] - read from I2C device
i2c mw chip address[.0, .1, .2] value [count] ‐ write to I2C device (fill)
......
```

Lesebeispiel:

```text
=> i2c dev 0                     // 切到i2c0（指定⼀次即可）
Setting bus to 0

=> i2c md 0x1b 0x2e 0x20         // i2c设备地址为1b(7位地址)，读取0x2e开始的连续0x20个寄存器值
002e: 11 0f 00 00 11 0f 00 00 01 00 00 00 09 00 00 0c    ................
003e: 00 0a 0a 0c 0c 0c 00 07 07 0a 00 0c 0c 00 00 00    ................
```

Schreibbeispiel:

```text
=> i2c dev 0                     // 切到i2c0（指定⼀次即可）
Setting bus to 0

=> i2c mw 0x1b 0x2e 0x10         // i2c设备地址为1b(7位地址)，对0x2e寄存器赋值为0x10
=> i2c md 0x1b 0x2e 0x20         // 回读
002e: 10 0f 00 00 11 0f 00 00 01 00 00 00 09 00 00 0c    ................
003e: 00 0a 0a 0c 0c 0c 00 07 07 0a 00 0c 0c 00 00 00    ................
```

### 8.6 gpio-Befehl

Funktion: Ein-/Ausgänge der Pins lesen und schreiben.

```text
=> gpio
gpio - query and control gpio pins

Usage:
gpio <input|set|clear|toggle> <pin>
    - input/set/clear/toggle the specified pin
gpio status [-a] [<bank> | <pin>]  - show [all/claimed] GPIOs
```

Pinzustand prüfen, beispielsweise RV1126:

```text
=> gpio status -a
Bank A:
A0: input: 0 [ ]
A1: output: 1 [ ]
A2: input: 1 [ ]
...
A29: unused: 1 [ ]
A30: unknown
A31: unused: 0 [ ]
...
D6: input: 0 [ ]
D7: output: 1 [x] vcc18-lcd-n.gpio
...
D31: input: 0 [ ]

Bank E:
E0: input: 0 [ ]
E1: input: 0 [ ]
```

Pin als Eingang:

```text
=> gpio input A7
```

Pin-Ausgang INACTIVE:

```text
=> gpio clear A7
```

Pin-Ausgang ACTIVE:

```text
=> gpio set A7
```

Pinzustand umschalten, beispielsweise A7: input: 0 auf A7: output: 1.

```text
=> gpio toggle A7
```

### 8.7 fdt-Befehl

Funktion: DTB-Inhalt ausgeben.

```text
=> fdt
fdt - flattened device tree utility commands

Usage:
fdt addr [-c]  <addr> [<length>]    - Set the [control] fdt location to <addr>
fdt print  <path> [<prop>]          - Recursive print starting at <path>
fdt list   <path> [<prop>]          - Print one level starting at <path>
......
NOTE: Dereference aliases by omitting the leading '/', e.g. fdt print ethernet0.
```

Die folgenden beiden Befehle geben zusammen den vollständigen Device Tree aus:

```text
=> fdt addr $fdt_addr_r   // 指定fdt地址
=> fdt print              // 把fdt内容全部打印出来
```

### 8.8 mmc-Befehl

Funktion: MMC lesen, schreiben und umschalten. MMC-Geräte anzeigen:

```text
=> mmc info
Device: dwmmc@ff0f0000                  // 设备节点
Manufacturer ID: 15
OEM: 100
Name: 8GME4
Timing Interface: High Speed            // 速度模式
Tran Speed: 52000000                    // 当前速度
Rd Block Len: 512
MMC version 5.1
High Capacity: Yes
Capacity: 7.3 GiB                       // 存储容量
Bus Width: 8-bit                        // 总线宽度
Erase Group Size: 512 KiB
HC WP Group Size: 8 MiB
User Capacity: 7.3 GiB WRREL
Boot Capacity: 4 MiB ENH
RPMB Capacity: 512 KiB ENH
```

MMC-Gerät umschalten:

```text
=> mmc dev 0                            // 切换到eMMC
=> mmc dev 1                            // 切换到sd卡
```

MMC-Gerät lesen und schreiben:

```text
mmc read addr blk# cnt
mmc write addr blk# cnt
mmc erase blk# cnt
例：
=> mmc read 0x70000000 0 1    // 读取MMC设备第⼀个block，⼤⼩为1 sector的数据到内存0x70000000
=> mmc write 0x70000000 0 1   // 把内存0x70000000起1 sector的数据写到存储第⼀个block起位置
=> mmc erase 0 1              // 擦除存储第⼀个block起1 sector数据
```

Bei MMC-Fehlern debug() in drivers/mmc/dw_mmc.c durch printf() ersetzen, neu bauen und programmieren. Ausgabe prüfen: Bei letzter Meldung Sending CMD0 Versorgung, Pinverbindungen und eine mögliche IOMUX-Umschaltung durch andere IP prüfen. Bei Sending CMD8 der MMC in der sicheren Software Zugriff auf sicheren Speicher erlauben. Ist die Initialisierung durchlaufen und erscheint zuletzt Sending CMD18, MMC-Versorgung und ausreichende Kapazität nahe der MMC-Versorgung prüfen (gegebenenfalls vergrößern); softwareseitig Takt reduzieren oder MMC-Geschwindigkeitsmodus wechseln.

### 8.9 Zeitstempel

Funktion: Relative Zeitstempel zu U-Boot-Ausgaben hinzufügen.

```text
CONFIG_BOOTSTAGE_PRINTF_TIMESTAMP
```

Beispiel:

```text
[    0.259266] U-Boot 2017.09-01739-g856f373-dirty (Jul 10 2018 - 20:26:05 +0800)
[    0.260596] Model: Rockchip RK3399 Evaluation Board
[    0.261332] DRAM:  3.8 GiB
Relocation Offset is: f5bfd000
Using default environment

[    0.354038] dwmmc@fe320000: 1, sdhci@fe330000: 0
[    0.521125] Card did not respond to voltage select!
[    0.521188] mmc_init: -95, time 9
[    0.671451] switch to partitions #0, OK
[    0.671500] mmc0(part 0) is current device
[    0.675507] boot mode: None
[    0.683738] DTB: rk-kernel.dtb
[    0.706940] Using kernel dtb
......
```

Der Zeitstempel zeigt den aktuellen Systemtimerwert; die Zählung beginnt nicht bei null. Er ist daher relativ und nicht absolut.

### 8.10 dm tree

Funktion: Bindungen und probe-Zustände aller device-driver anzeigen.

```text
=> dm tree

 Class      Probed        Driver               Name
----------------------------------------------------------
 root       [ + ]   root_driver                root_driver
 syscon     [   ]   rk322x_syscon              |-- syscon@11000000
 serial     [ + ]   ns16550_serial             |-- serial@11030000 *
 clk        [ + ]   clk_rk322x                 |-- clock-controller@110e0000
 sysreset   [   ]   rockchip_sysreset          |   |-- sysreset
 reset      [   ]   rockchip_reset             |   `-- reset
 mmc        [ + ]   rockchip_rk3288_dw_mshc    |-- dwmmc@30020000 *
 blk        [ + ]   mmc_blk                    |   `-- dwmmc@30020000.blk *
 ram        [   ]   rockchip_rk322x_dmc        |-- dmc@11200000
 serial     [ + ]   ns16550_serial             |-- serial@11020000
 i2c        [ + ]   i2c_rockchip               |-- i2c@11050000
 ......
```

Die Ausgabe zeigt alle gebundenen device-driver und die Beziehungen uclass-device-driver. [ + ] bedeutet, dass probe abgeschlossen ist. * bezeichnet device-driver aus dem U-Boot-DTB; ohne Stern stammen sie aus dem Kernel-DTB.

### 8.11 dm uclass

Funktion: Alle Geräte einer bestimmten uclass anzeigen.

```text
=> dm uclass

uclass 0: root
- * root_driver @ 7be54c88, seq 0, (req -1)

uclass 11: adc
- * saradc@ff100000 @ 7be56220, seq 0, (req -1)
......
uclass 40: backlight
- * backlight @ 7be81178, seq 0, (req -1)

uclass 77: key
-   rockchip-key @ 7be811f0
......
```

### 8.12 stacktrace.sh

Die Auswertung von abort und dump_stack() durch Stack-Rückverfolgung beschreibt das Kapitel zur RK-Architektur.

### 8.13 Systemstillstand

Funktion: Aktuellen CPU-Kontext und Aufrufstack ausgeben, hilfreich bei einem Systemstillstand. UART gibt alle 5 s Informationen ähnlich einem abort aus.

```text
CONFIG_ROCKCHIP_DEBUGGER
```

Den erhaltenen Stack mit stacktrace umwandeln; siehe Kapitel zur RK-Architektur.

### 8.14 CRC-Prüfung

Funktion: Integrität von Firmware im RK-Format prüfen. Der Imageheader enthält die CRC32 des gesamten Abbilds; das folgende Makro aktiviert die CRC32-Integritätsprüfung.

```text
CONFIG_ROCKCHIP_CRC
```

Beispiel:

```text
=Booting Rockchip format image=
kernel image CRC32 verify... okay.      // kernel 校验成功（如果失败则打印“fail！”）
boot image CRC32 verify... okay.        // boot 校验成功（如果失败则打印“fail！”）
kernel   @ 0x02080000 (0x01249808)
ramdisk  @ 0x0a200000 (0x001e6650)
## Chapter-8 Flattened Device Tree blob at 01f00000
   Booting using the fdt blob at 0x1f00000
  'reserved-memory' secure-memory@20000000: addr=20000000 size=10000000
   Loading Ramdisk to 08019000, end 081ff650 ... OK
   Loading Device Tree to 0000000008003000, end 0000000008018c97 ... OK
Adding bank: start=0x00200000, size=0x08200000
Adding bank: start=0x0a200000, size=0xede00000

Starting kernel ...
```

### 8.15 HASH-Prüfung

Funktion: Integrität von Firmware im Android-Format prüfen.

```text
ANDROID_BOOT_IMAGE_HASH
```

Mit dieser Option wird die Integrität beim Laden von Android-Firmware geprüft.

Aus historischen Gründen kann die obige Prüfung fehlschlagen; in diesem Fall zusätzlich Folgendes aktivieren:

```text
HASH_ROCKCHIP_LEGACY
```

### 8.16 DDR-Kapazität ändern

Beim Start übergibt die DDR-Initialisierung U-Boot die DDR-Kapazität. U-Boot zieht geschützte Speicherbereiche ab und reicht den Rest an den Kernel weiter. In U-Boot lässt sich die übergebene Kapazität ändern. Beispiel:

```text
......
// 传递给内核的可⽤内存块（已去除安全内存块）。
Adding bank: 0x00200000 - 0x08400000 (size: 0x08200000)
Adding bank: 0x0a200000 - 0x40000000 (size: 0x35e00000)
Total: 895.411 ms

Starting kernel ...
[    0.000000] Booting Linux on physical CPU 0x0
```

Codeposition:

```text
./arch/arm/mach-rockchip/param.c
```

Änderungsstelle:

```text
struct memblock *param_parse_ddr_mem(int *out_count)
{
    ......

    // 这⾥就是ddr传递给U-Boot的容量信息。
    // 因为可能出现不连续的地址，所以会分块传递，分别指明各个内存块的起始地址和⼤⼩。
    // PS: ⼀般情况下都是连续内存，不会需要分块。
    for (i = 0, n = 0; i < count; i++, n++) {
        // ⽐如2GB容量（连续地址），则：count=1, base = 0，size = 0x80000000。
        // ⽤⼾调试时可以在这⾥按需修改。
        base = t->u.ddr_mem.bank[i];
        size = t->u.ddr_mem.bank[i + count];

        /* 0~4GB */
        if (base < SZ_4GB) {
            mem[n].base = base;
            mem[n].size = ddr_mem_get_usable_size(base, size);
            if (base + size > SZ_4GB) {
                n++;
                mem[n].base_u64 = SZ_4GB;
                mem[n].size_u64 = base + size - SZ_4GB;
            }
        } else {
            /* 4GB+ */
            mem[n].base_u64 = base;
            mem[n].size_u64 = size;
        }

        assert(n < count + MEM_RESV_COUNT);
    }
    ......
}
```

### 8.17 Sprunginformationen

Funktion: Firmwareversion und Ablauf bestimmen. Startmeldungen helfen in manchen Fällen auch beim Eingrenzen eines Stillstands.

1. Stillstand direkt nach trust. Ein Fehler beim Packen oder Programmieren kann trust zu einer falschen U-Boot-Startadresse springen lassen. Die von trust ausgegebene U-Boot-Startadresse prüfen. Bei 64-Bit-Plattformen ist dies normalerweise Offset 0x200000 bei DRAM-Start 0x0:

```text
NOTICE:  BL31: v1.3(debug):d98d16e
NOTICE:  BL31: Built : 15:03:07, May 10 2018
NOTICE:  BL31: Rockchip release version: v1.1
INFO:    GICv3 with legacy support detected. ARM GICV3 driver initialized in EL3
INFO:    Using opteed sec cpu_context!
INFO:    boot cpu mask: 0
INFO:    plat_rockchip_pmu_init(1151): pd status 3e
INFO:    BL31: Initializing runtime services
INFO:    BL31: Initializing BL32
INFO:    BL31: Preparing for EL3 exit to normal world
INFO:    Entry point address = 0x200000  // U-Boot地址
INFO:    SPSR = 0x3c9
```

Bei 32-Bit-Plattformen ist die U-Boot-Startadresse normalerweise Offset 0x0 bei DRAM-Start 0x60000000:

```text
INF [0x0] TEE-CORE:init_primary_helper:378: Release version: 1.9
INF [0x0] TEE-CORE:init_primary_helper:379: Next entry point address: 0x60000000  // U-Boot
地址
INF [0x0] TEE-CORE:init_teecore:83: teecore inits done
```

2. U-Boot-Version zurückverfolgen: Die Startmeldung identifiziert den Buildstand. Im Beispiel entspricht er Commit b34f08b.

```text
U-Boot 2017.09-01730-gb34f08b (Jul 06 2018 - 17:47:52 +0800)
```

dirty bedeutet, dass beim Build lokale, nicht eingecheckte Änderungen vorlagen; der Buildstand war nicht sauber.

```text
U-Boot 2017.09-01730-gb34f08b-dirty (Jul 06 2018 - 17:35:04 +0800)
```

### 8.18 Startmeldungen

U-Boot-Startmeldungen zeigen Ablauf und Peripheriezustand und helfen, Fehler rasch einzugrenzen. Drei Firmwareformate werden unterstützt: Android &gt; RK &gt; DISTRO. Rockchip-SDKs verwenden hauptsächlich die ersten beiden; DISTRO wird meist in Open-Source-Projekten eingesetzt.

Hinweis: In älterem Code fehlen möglicherweise einige Meldungen; dies beeinträchtigt das grundsätzliche Verständnis der U-Boot-Ausgaben nicht.

17.1 Android-Firmware

```text
// U-Boot第⼀⾏打印，包含了commit版本、编译时间等信息
// 注意: 这⾥只是U-Boot"相对早"的第⼀⾏正规打印，⽽不是U-Boot能做出的最早打印
// 打开debug信息，可以看到更早的调试打印
U-Boot 2017.09-03033-g81b79f7-dirty (Jul 04 2019 - 15:04:00 +0800)

// U-Boot dts的“model"字段内容，通过这个信息可以知道我们使⽤了U-Boot哪份dts
Model: Rockchip RK3399 Evaluation Board
// 启⽤了preloader-serial功能，即沿⽤前级loader的串⼝配置，当前使⽤UART2作为打印⼝
PreSerial: 2
// 板⼦的总内存容量是2GB
DRAM: 2 GiB
// 当前版本⽀持了sysmem内存卡管理机制
Sysmem: init
// U-Boot会把⾃⼰的代码进⾏⾃搬移，从当前ddr靠前的位置搬到靠后的位置（详⻅U-Boot开发⽂档启动流程）
// ⾃搬移后的代码起始地址是0x7dbe2000, 这个信息在反汇编调试时可能有⽤到
Relocation Offset is: 7dbe2000
// ENV默认保存在ddr⾥。如果是选择保存在eMMC、Nand等存储介质⾥，则不会有这个打印
Using default environment

// 当前的存储介质是mmc0，即eMMC(如果是sd卡，则为mmc1)
dwmmc@fe320000: 1, sdhci@fe330000: 0
// 存储介质类型是通过atags，由前级miniloader传参告知U-Boot
Bootdev(atags): mmc 0
// 当前的eMMC的⼯作在HS400模式，时钟频率是150M
MMC0: HS400, 150Mhz
// 当前采⽤GPT分区表（如果是RK parameter分区表，则打印：RKPARM）
PartType: EFI
// 当前是recovery模式
// kernel⾥执⾏的"reboot xxx"命令，最终也是由这个打印来体现
boot mode: recovery
// Kernel DTB来⾃于recovery.img，其正常被加载
Load FDT from recovery part
DTB: rk-kernel.dtb
HASH: OK(c)

// ==> 注意：⾃此之后，U-Boot已经切到kernel dtb，后续所有外设驱动都使⽤kernel dtb的信息！！

// DTBO执⾏成功
ANDROID: fdt overlay OK
// I2C的速度，这个是U-Boot开机速度的影响因素之⼀，尤其对于DCDC和LDO⾮常多的PMIC，如果I2C速度慢，
// 那么对开机速度有⼀定影响。如果⽤⼾关⼼开机速度，可以关注这个信息
I2c speed: 400000Hz
// 当前PMIC是RK818
// on值对应ON_SOURCE寄存器，表明了当前这次PMIC上电的原因
// off值对应OFF_SOURCE寄存器，表明前⼀次关机或掉电的原因
// on和off信息，对于系统出现异常重启或关机等情况时，这是个有价值的信息
PMIC: RK818 (on=0x20 off=0x40)
// 各路可调压regulator的当前电压值，⼀般是DCDC且对应的是RK平台的arm、logic、center等电压
// 在出现系统启动异常、开机不稳定等问题时，这是个有价值的信息vdd_center 900000 uV
vdd_cpu_l 900000 uV
vdd_log 900000 uV
// Kernel dts的“model"字段内容，通过这个信息可以知道我们使⽤了Kernel的哪份dts
Model: Rockchip RK3399 Excavator Board edp avb (Android)
enter Recovery mode!
// 显⽰驱动的相关信息
Rockchip UBOOT DRM driver version: v1.0.1
Using display timing dts
Detailed mode clock 200000 kHz, flags[a]
  H: 1536 1548 1564 1612
  V: 2048 2056 2060 2068
bus_format: 100e
// clk-tree信息，具体含义请参考U-Boot开发⽂档的CLK章节
CLK: (uboot. arml: enter 816000 KHz, init 816000 KHz, kernel 0N/A)
CLK: (uboot. armb: enter 24000 KHz, init 24000 KHz, kernel 0N/A)
 aplll 816000 KHz
 apllb 24000 KHz
 dpll 800000 KHz
 cpll 200000 KHz
 gpll 800000 KHz
 npll 600000 KHz
 vpll 24000 KHz
 aclk_perihp 133333 KHz
 hclk_perihp 66666 KHz
 pclk_perihp 33333 KHz
 aclk_perilp0 266666 KHz
 hclk_perilp0 88888 KHz
 pclk_perilp0 44444 KHz
 hclk_perilp1 100000 KHz
 pclk_perilp1 50000 KHz
// GMAC驱动使能
Net:  eth0: ethernet@fe300000
// 开机⻓按ctrl+c，可在如下打印之后进⼊U-Boot命令⾏模式
Hit key to stop autoboot('CTRL+C'): 0
// 再⼀次知道当前是recovery模式
ANDROID: reboot reason: "recovery"
// vboot=0表⽰没有启⽤secureboot；当前是AVB固件，所以会⾛AVB的常规校验流程
Vboot=0, AVB images, AVB verify
// 设备是否unlock
read_is_device_unlocked() ops returned that device is UNLOCKED
// 原⽣的U-Boot默认是把整个boot.img/recovery.img加载起来，然后再把ramdisk、fdt、kernel再进⾏
// ⼀次搬移（称为relocation），搬到⽤⼾预定的地址上，这样是⽐较耗时的，尤其当ramdisk⾮常⼤的时候。
// RK平台做了修改，⼀次性直接从存储上把ramdisk、fdt、kernel搬到预定的内存地址。
// 有如下打印则说明启⽤了这种⼀次性搬移的操作，更省时间
Fdt Ramdisk skip relocation
// 加载Android格式的固件，把kernel加载到0x00280000，fdt加载到0x8300000
// 假如是LZ4压缩内核，这⾥可能打印：
// Booting LZ4 kernel at 0x00680000(Uncompress to 0x00280000) with fdt at 0x8300000...
Booting IMAGE kernel at 0x00280000 with fdt at 0x8300000...

// 忽略，可不关⼼
### Booting Android Image at 0x0027f800 ...
// kernel和ramdisk的加载地址以及⼤⼩
Kernel load addr 0x00280000 size 19081 KiB
RAM disk load addr 0x0a200000 size 9627 KiB
// fdt的加载地址
### Flattened Device Tree blob at 08300000
   Booting using the fdt blob at 0x8300000
// 忽略，可不关⼼
   XIP Kernel Image ... OK
// 这⾥仅仅是打印kernel dts指定的reserved-memory，可作为出内核启动出问题时的⼀个分析信息
   'reserved-memory' secure-memory@20000000: addr=20000000 size=10000000
// fdt的起始和结束地址
   Using Device Tree in place at 0000000008300000, end 000000000831c6f7
// 传递给内核，告知内核可使⽤的内存空间范围（ATF、optee等空间已经被除去）
Adding bank: 0x00200000 - 0x08400000 (size: 0x08200000)
Adding bank: 0x0a200000 - 0x80000000 (size: 0x75e00000)
// U-Boot阶段开机耗时
Total: 367.128 ms

// 由U-Boot打印，这个打印之后，U-Boot会完成⼀些ARM架构相关（⽐如：清cache、关中断、
// cpu状态切换等）和U-Boot的dm设备注销等清零⼯作，出问题的概率极低。
// 完成上述⼯作后就跳到kernel，因此也可以理解为，出现这个打印就是到了内核阶段。
Starting kernel ...

// kernel阶段的打印信息
[    0.000000] Booting Linux on physical CPU 0x0
[    0.000000] Initializing cgroup subsys cpuset
[    0.000000] Initializing cgroup subsys cpu
[    0.000000] Initializing cgroup subsys cpuacct
[    0.000000] Initializing cgroup subsys schedtune
[    0.000000] Linux version 4.4.167 (hgc@ubuntu) (gcc version 6.3.1 20170404 (Linaro
GCC 6.3-2017.05) ) #83 SMP PREEMPT Thu Mar 21 09:31:08 CST 2019
[    0.000000] Boot CPU: AArch64 Processor [410fd034]
[    0.000000] earlycon: Early serial console at MMIO32 0xff1a0000 (options '')
[    0.000000] bootconsole [uart0] enabled
[    0.000000] Reserved memory: failed to reserve memory for node 'stb-
devinfo@00000000': base 0x0000000000000000, size 0 MiB
[    0.000000] cma: Reserved 16 MiB at 0x000000007f000000
......
```

#### 8.18.1 RK-Firmware

```text
U-Boot 2017.09-03352-gb1265b5 (Jul 12 2019 - 09:57:24 +0800)

Model: Rockchip RK3399 Evaluation Board
PreSerial: 2
DRAM:  2 GiB
Sysmem: init
Relocation Offset is: 7dbe2000
Using default environment
......

Hit key to stop autoboot('CTRL+C'):  0
ANDROID: reboot reason: "recovery"
// 因为是RK格式的固件，所以不可能是AVB格式
Not AVB images, AVB skip
// 因为是RK格式的固件，所以这⾥会提⽰加载android格式固件失败
// 因为⽬前启动优先级是：android格式 > RK格式 > distro格式
** Invalid Android Image header **
Android image load failed
Android boot failed, error -1.
// 当前是recovery模式
boot mode: recovery
// 启动RK格式的固件，加载ramdis、kernel、fdt
=Booting Rockchip format image=
fdt      @ 0x08300000 (0x00012dd0)
kernel   @ 0x00280000 (0x0119e008)
ramdisk  @ 0x0a200000 (0x00754540)

// 下⾯基本类同android格式固件的启动信息
Fdt Ramdisk skip relocation
### Flattened Device Tree blob at 08300000
   Booting using the fdt blob at 0x8300000
   Using Device Tree in place at 0000000008300000, end 0000000008315dcf
Adding bank: 0x00200000 - 0x08400000 (size: 0x08200000)
Adding bank: 0x0a200000 - 0x80000000 (size: 0x75e00000)
Total: 508.11 ms

Starting kernel ...

[    0.000000] Booting Linux on physical CPU 0x0
[    0.000000] Initializing cgroup subsys cpuset
[    0.000000] Initializing cgroup subsys cpu
......
```

#### 8.18.2 Didstro-Firmware

```text
U-Boot 2017.09-03352-gb1265b5 (Jul 12 2019 - 09:57:24 +0800)

Model: Rockchip RK3399 Evaluation Board
PreSerial: 2
DRAM:  2 GiB
Sysmem: init
Relocation Offset is: 7dbe2000
Using default environment
......

// 找到mmc0，即eMMCswitch to partitions #0, OK
mmc0(part 0) is current device
// 查找eMMC存储上第6个分区的固件（GPT分区表⾥，6对应的是boot.img分区，GPT⾥⽤"-bootable"属性指明）
Scanning mmc 0:6...
// 找到了配置⽂件extlinux.conf
Found /extlinux/extlinux.conf
Retrieving file: /extlinux/extlinux.conf

// 加载kernel
205 bytes read in 82 ms (2 KiB/s)
1:      rockchip-kernel-4.4
Retrieving file: /Image
13484040 bytes read in 1833 ms (7 MiB/s)

// 打包时指定的cmdline信息
append: earlycon=uart8250,mmio32,0xff1a0000 console=ttyS2,1500000n8 rw
root=/dev/mmcblk0p7 rootwait rootfstype=ext4 init=/sbin/init

// 加载fdt
Retrieving file: /rk3399.dtb
61714 bytes read in 54 ms (1.1 MiB/s)

// ==> 如果打包时没有ramdisk，就不会有ramdisk信息打印; 否则这⾥也会有打印

### Flattened Device Tree blob at 01f00000
   Booting using the fdt blob at 0x1f00000
   Loading Device Tree to 000000007df14000, end 000000007df26111 ... OK

Starting kernel ...

[    0.000000] Booting Linux on physical CPU 0x0
[    0.000000] Initializing cgroup subsys cpuset
[    0.000000] Initializing cgroup subsys cpu
......
```

#### 8.18.3 Keine gültige Firmware

```text
U-Boot 2017.09-03352-gb1265b5 (Jul 12 2019 - 09:57:24 +0800)

Model: Rockchip RK3399 Evaluation Board
PreSerial: 2
DRAM:  2 GiB
Sysmem: init
Relocation Offset is: 7dbe2000
Using default environment

......

// 找到mmc0，即eMMC
找不到固件的开机信息
switch to partitions #0, OK
mmc0(part 0) is current device
// 查找eMMC存储上第6个分区的固件（GPT分区表⾥，6对应的是boot.img分区，GPT⾥⽤"-bootable"属性指明）
Scanning mmc 0:6...
// 找到了配置⽂件extlinux.conf
Found /extlinux/extlinux.conf
Retrieving file: /extlinux/extlinux.conf

// 加载kernel
205 bytes read in 82 ms (2 KiB/s)
1:      rockchip-kernel-4.4
Retrieving file: /Image
13484040 bytes read in 1833 ms (7 MiB/s)

// 打包时指定的cmdline信息
append: earlycon=uart8250,mmio32,0xff1a0000 console=ttyS2,1500000n8 rw
root=/dev/mmcblk0p7 rootwait rootfstype=ext4 init=/sbin/init

// 加载fdt
Retrieving file: /rk3399.dtb
61714 bytes read in 54 ms (1.1 MiB/s)

// ==> 如果打包时没有ramdisk，就不会有ramdisk信息打印; 否则这⾥也会有打印

### Flattened Device Tree blob at 01f00000
   Booting using the fdt blob at 0x1f00000
   Loading Device Tree to 000000007df14000, end 000000007df26111 ... OK

Starting kernel ...

[    0.000000] Booting Linux on physical CPU 0x0
[    0.000000] Initializing cgroup subsys cpuset
[    0.000000] Initializing cgroup subsys cpu
......
U-Boot 2017.09-03352-gb1265b5 (Jul 12 2019 - 09:57:24 +0800)

Model: Rockchip RK3399 Evaluation Board
PreSerial: 2
DRAM:  2 GiB
Sysmem: init
Relocation Offset is: 7dbe2000
Using default environment

......

Net:   eth0: ethernet@fe300000
Hit key to stop autoboot('CTRL+C'):  0 ANDROID: reboot reason: "recovery"
// 不是Android格式固件
Not AVB images, AVB skip
** Invalid Android Image header **
Android image load failed
Android boot failed, error -1.
boot mode: recovery

// 不是RK格式固件
=Booting Rockchip format image=
kernel: invalid image tag(0x45435352)
boot_rockchip_image kernel part read error

// 不是DISTRO格式固件。后⾯所有的打印都来在distro加载命令，因为distro命令会试图从mmc、nand、net、
// usb等所有我们预先定义的设备（详⻅rockchip-common.h中的宏定义：BOOT_TARGET_DEVICES）中去寻
// 找distro固件，即逐⼀扫描进⾏查找
switch to partitions #0, OK
mmc0(part 0) is current device
Failed to mount ext2 filesystem...
** Unrecognized filesystem type **
starting USB...
USB0:   Register 2000140 NbrPorts 2
Starting the controller
USB XHCI 1.10
USB1:   Register 2000140 NbrPorts 2
Starting the controller
USB XHCI 1.10
USB2:   USB EHCI 1.00
USB3:   USB OHCI 1.0
USB4:   USB EHCI 1.00
USB5:   USB OHCI 1.0
scanning bus 0 for devices... 1 USB Device(s) found
scanning bus 1 for devices... 1 USB Device(s) found
scanning bus 2 for devices... 1 USB Device(s) found
scanning bus 3 for devices... 1 USB Device(s) found
scanning bus 4 for devices... 1 USB Device(s) found
scanning bus 5 for devices... 1 USB Device(s) found
       scanning usb for storage devices... 0 Storage Device(s) found

Device 0: unknown device
ethernet@fe300000 Waiting for PHY auto negotiation to complete......... TIMEOUT !
Could not initialize PHY ethernet@fe300000
missing environment variable: pxeuuid
missing environment variable: bootfile
Retrieving file: pxelinux.cfg/01-7a-1d-33-50-3d-a1
ethernet@fe300000 Waiting for PHY auto negotiation to complete..
......

// 最终distro命令对所有可能的存储介质都扫描后也找不到固件，就停在U-Boot命令⾏模式
=>
```

## 9 Testfälle

## 10 SPL

### 10.1 Firmwarestart

SPL ersetzt miniloader beim Laden und Starten von trust.img und uboot.img. Zwei Firmwaretypen werden unterstützt: FIT ist standardmäßig aktiv; RKFW ist standardmäßig deaktiviert und muss eigens konfiguriert und aktiviert werden.

#### 10.1.1 FIT-Firmware

FIT (flattened image tree) ist ein neueres von SPL unterstütztes Firmwareformat zum Packen und Prüfen mehrerer Images. Die Beschreibung u-boot.its verwendet DTS-Syntax; die fertige Firmware heißt u-boot.itb. Vorteile: flexible Wiederverwendung von DTS-Syntax und Buildregeln sowie direkte Analyse mit libfdt. In u-boot.its definiert /images statisch alle verfügbaren Ressourcen, ähnlich DTSI; nicht alle müssen genutzt werden. Unter /configurations beschreibt jeder config-Knoten eine bootfähige Konfiguration, ähnlich einem Platinen-DTS. default = wählt die aktuelle Standardkonfiguration. Beispiel:

```text
/dts-v1/;

/ {
    description = "Configuration to load ATF before U-Boot";
    #address-cells = <1>;

    images {
        uboot@1 {
            description = "U-Boot (64-bit)";
            data = /incbin/("u-boot-nodtb.bin");
            type = "standalone";
            os = "U-Boot";
            arch = "arm64";
            compression = "none";
            load = <0x00200000>;
        };

        atf@1 {
            description = "ARM Trusted Firmware";
            data = /incbin/("bl31_0x00010000.bin");
            type = "firmware";
            arch = "arm64";
            os = "arm-trusted-firmware";
            compression = "none";
            load = <0x00010000>;
            entry = <0x00010000>;
        };

        atf@2 {
            description = "ARM Trusted Firmware";
            data = /incbin/("bl31_0xff091000.bin");
            type = "firmware";
            arch = "arm64";
            os = "arm-trusted-firmware";
            compression = "none";
            load = <0xff091000>;
        };

        optee@1 {
            description = "OP-TEE";
            data = /incbin/("bl32.bin");
            type = "firmware";
            arch = "arm64";
            os = "op-tee";
            compression = "none";
            load = <0x08400000>;
        };

        fdt@1 {
            description = "rk3328-evb.dtb";
            data = /incbin/("arch/arm/dts/rk3328-evb.dtb");
            type = "flat_dt";
            compression = "none";
        };
    };

    configurations {
        default = "config@1";
        config@1 {
            description = "rk3328-evb.dtb";
            firmware = "atf@1";
            loadables = "uboot@1", "atf@2", "optee@1" ;
            fdt = "fdt@1";
        };
    };
};
```

Datei u-boot.itb:

```text
                          mkimage + dtc
[u-boot.its] + [images]        ==>         [u-boot.itb]
```

Oben ist die ITB-Erzeugung gezeigt. FIT lässt sich als spezieller DTB mit Images als Inhalt betrachten. fdtdump zeigt den Inhalt:

```text
cjh@ubuntu:~/uboot-nextdev/u-boot$ fdtdump u-boot.itb | less

/dts-v1/;
// magic:               0xd00dfeed
// totalsize:           0x497 (1175)
// off_dt_struct:       0x38
// off_dt_strings:      0x414
// off_mem_rsvmap:      0x28
// version:             17
// last_comp_version:   16
// boot_cpuid_phys:     0x0
// size_dt_strings:     0x83
// size_dt_struct:      0x3dc

/ {
    timestamp = <0x5d099c85>;
    description = "Configuration to load ATF before U-Boot";
    #address-cells = <0x00000001>;
    images {
        uboot@1 {
            data-size = <0x0009f8a8>;
            data-offset = <0x00000000>;
            description = "U-Boot (64-bit)";
            type = "standalone";
            os = "U-Boot";
            arch = "arm64";
            compression = "none";
            load = <0x00600000>;
        };
        atf@1 {
            data-size = <0x0000c048>;   // 编译过程⾃动增加了该字段，描述atf@1固件⼤⼩
            data-offset = <0x0009f8a8>; // 编译过程⾃动增加了该字段，描述atf@1固件偏移
            description = "ARM Trusted Firmware";
            type = "firmware";
            arch = "arm64";
            os = "arm-trusted-firmware";
            compression = "none";
            load = <0x00010000>;
            entry = <0x00010000>;
        };
        atf@2 {
            data-size = <0x00002000>;
            data-offset = <0x000ab8f0>;
            description = "ARM Trusted Firmware";
            type = "firmware";
            arch = "arm64";
            os = "arm-trusted-firmware";
            compression = "none";
            load = <0xfff82000>;
        };
        fdt@1 {
            data-size = <0x00005793>;
            data-offset = <0x000ad8f0>;
            description = "rk3308-evb.dtb";
            type = "flat_dt";
            ......
        };
        ......
    };
};
```

Weitere FIT-Informationen:

```text
./doc/uImage.FIT/
```

#### 10.1.2 RKFW-Firmware

Damit miniloader ohne Änderung der Partitionen oder des Packformats nachfolgender Firmware ersetzt werden kann, ergänzt RK RKFW-Boot: trust.img und uboot.img in separaten Partitionen. Konfiguration:

```text
CONFIG_SPL_LOAD_RKFW           // 使能开关
CONFIG_RKFW_TRUST_SECTOR       // trust.img分区地址，需要和分区表的定义保持⼀致
CONFIG_RKFW_U_BOOT_SECTOR      // uboot.img分区地址，需要和分区表的定义保持⼀致
```

Code:

```text
./include/spl_rkfw.h
./common/spl/spl_rkfw.c
```

#### 10.1.3 Speicherpriorität

Die Bootpriorität der Speichergeräte wird durch u-boot,spl-boot-order im U-Boot-DTS festgelegt.

```text
/ {
    aliases {
        mmc0 = &emmc;
        mmc1 = &sdmmc;
    };

    chosen {
        u-boot,spl-boot-order = &sdmmc, &nandc, &emmc;
        stdout-path = &uart2;
    };
    ......
};
```

### 10.2 Bauen und Paketieren

#### 10.2.1 Code bauen

SPL wird aus demselben U-Boot-Code über einen anderen Buildpfad erzeugt. Dabei wird CONFIG_SPL_BUILD automatisch definiert. Nach u-boot.bin wird SPL in einem separaten Ausgabeverzeichnis ./spl/ gebaut.

```text
  // 编译u-boot
  ......
  DTC     arch/arm/dts/rk3399-puma-ddr1866.dtb
  DTC     arch/arm/dts/rv1108-evb.dtb
make[2]: `arch/arm/dts/rk3328-evb.dtb' is up to date.
  SHIPPED dts/dt.dtb
  FDTGREP dts/dt-spl.dtb
  CAT     u-boot-dtb.bin
  MKIMAGE u-boot.img
  COPY    u-boot.dtb
  MKIMAGE u-boot-dtb.img
  COPY    u-boot.bin

  // 编译spl，有独⽴的spl/⽬录
  LD      spl/arch/arm/cpu/built-in.o
  CC      spl/board/rockchip/evb_rk3328/evb-rk3328.o
  LD      spl/dts/built-in.o
  CC      spl/common/init/board_init.o
  COPY    tpl/u-boot-tpl.dtb
  CC      spl/cmd/nvedit.o
  CC      spl/env/common.o
  CC      spl/env/env.o
  .....
  LD      spl/drivers/block/built-in.o

  ......
```

Build-Ergebnis:

```text
./spl/u-boot-spl.bin
```

#### 10.2.2 Firmware paketieren

### 10.3 Systemmodule

#### 10.3.1 GPT

SPL verwendet GPT-Partitionstabellen. Konfiguration:

```text
CONFIG_SPL_LIBDISK_SUPPORT=y
CONFIG_SPL_EFI_PARTITION=y
CONFIG_PARTITION_TYPE_GUID=y
```

Treiber:

```text
./disk/part.c
./disk/part_efi.c
```

Schnittstelle:

```text
int part_get_info(struct blk_desc *dev_desc, int part, disk_partition_t *info);
int part_get_info_by_name(struct blk_desc *dev_desc,
                          const char *name, disk_partition_t *info);
```

#### 10.3.2 A/B system

SPL unterstützt A/B-Boot. Konfiguration:

```text
CONFIG_SPL_AB=y
```

Treiber:

```text
./common/spl/spl_ab.c
```

Schnittstelle:

```text
int spl_get_current_slot(struct blk_desc *dev_desc, char *partition, char *slot);
int spl_get_partitions_sector(struct blk_desc *dev_desc, char *partition,u32 *sectors);
```

#### 10.3.3 Bootpriorität

SPL verwendet die in rkxxxx-u-boot.dtsi durch u-boot,spl-boot-order definierte Reihenfolge:

```text
chosen {
stdout-path = &uart2;
u-boot,spl-boot-order = &sdmmc, &sfc, &nandc, &emmc;
};
```

Maskrom-Bootpriorität:

```text
spi nor > spi nand > emmc > sd
```

Pre-loader-/SPL-Bootpriorität:

```text
sd > spi nor > spi nand > emmc
```

Die höchste Priorität für SD erleichtert den Systemstart von SD.

#### 10.3.4 ATAGS

SPL und U-Boot übergeben Parameter über ATAGS, darunter Bootspeichergerät und Ausgabe-UART. Konfiguration:

```text
CONFIG_ROCKCHIP_PRELOADER_ATAGS=y
```

Treiber:

```text
./arch/arm/include/asm/arch-rockchip/rk_atags.h
./arch/arm/mach-rockchip/rk_atags.c
```

Schnittstelle:

```text
int atags_set_tag(u32 magic, void *tagdata);
struct tag *atags_get_tag(u32 magic);
```

#### 10.3.5 kernel boot

Normalerweise lädt und startet U-Boot den Kernel; auch SPL kann dies übernehmen. Unterstützt werden boot.img mit Android head version 2 und Firmware im RK-Format. Startreihenfolge:

```text
Maskrom -> ddr -> SPL -> Trust -> Kernel
```

#### 10.3.6 pinctrl

Konfiguration:

```text
CONFIG_SPL_PINCTRL_GENERIC=y
CONFIG_SPL_PINCTRL=y
```

Treiber:

```text
./drivers/pinctrl/pinctrl-uclass.c
./drivers/pinctrl/pinctrl-generic.c
./drivers/pinctrl/pinctrl-rockchip.c
```

DTS-Konfigurationsbeispiel für sdmmc:

```text
&pinctrl {
    u-boot,dm-spl;
};

&pcfg_pull_none_4ma {
    u-boot,dm-spl;
};

&pcfg_pull_up_4ma {
    u-boot,dm-spl;
};

&sdmmc {
    u-boot,dm-spl;
};

&sdmmc_pin {
    u-boot,dm-spl;
};

&sdmmc_clk {
    u-boot,dm-spl;
};

&sdmmc_cmd {
    u-boot,dm-spl;
};

&sdmmc_bus4 {
    u-boot,dm-spl;
};

&sdmmc_pwren {
    u-boot,dm-spl;
};
```

Hinweis: Bei aktivem pinctrl in SPL pinctrl-0 und pinctrl-names aus CONFIG_OF_SPL_REMOVE_PROPS in defconfig entfernen.

#### 10.3.7 secure boot

[TODO — dieser Abschnitt ist bereits im Original unvollständig.]

### 10.4 Treibermodule

#### 10.4.1 MMC

Konfiguration:

```text
CONFIG_SPL_MMC_SUPPORT=y  // 默认已使能
```

Treiber:

```text
./common/spl/spl_mmc.c
```

Schnittstelle:

```text
int spl_mmc_load_image(struct spl_image_info *spl_image,
                       struct spl_boot_device *bootdev);
```

#### 10.4.2 MTD block

SPL vereinheitlicht NAND-, SPI-NAND- und SPI-NOR-Schnittstellen auf Blockebene. Konfiguration:

```text
// MTD 驱动⽀持
CONFIG_MTD=y
CONFIG_CMD_MTD_BLK=y
CONFIG_SPL_MTD_SUPPORT=y
CONFIG_MTD_BLK=y
CONFIG_MTD_DEVICE=y

// spi nand 驱动⽀持
CONFIG_MTD_SPI_NAND=y
CONFIG_ROCKCHIP_SFC=y
CONFIG_SPL_SPI_FLASH_SUPPORT=y
CONFIG_SPL_SPI_SUPPORT=y

// nand 驱动⽀持
CONFIG_NAND=y
CONFIG_CMD_NAND=y
CONFIG_NAND_ROCKCHIP=y /* NandC v6 可根据 TRM NANDC->NANDC_NANDC_VER 寄存器确认，0x00000801 */
//CONFIG_NAND_ROCKCHIP_V9=y  /* NandC v9 可根据 TRM NANDC->NANDC_NANDC_VER 寄存器确认，
0x56393030, 例如：RK3326/PX30 为此版本 */
CONFIG_SPL_NAND_SUPPORT=y
CONFIG_SYS_NAND_U_BOOT_LOCATIONS=y
CONFIG_SYS_NAND_U_BOOT_OFFS=0x8000
CONFIG_SYS_NAND_U_BOOT_OFFS_REDUND=0x10000
// nand page size需要按真实⼤⼩定义，如果使⽤容量⼤于等于512MB的NAND，⼀般需要配置为4096
#define CONFIG_SYS_NAND_PAGE_SIZE   2048

// spi nor 驱动⽀持
CONFIG_CMD_SF=y
CONFIG_CMD_SPI=y
CONFIG_SPI_FLASH=y
CONFIG_SF_DEFAULT_MODE=0x1
CONFIG_SF_DEFAULT_SPEED=50000000
CONFIG_SPI_FLASH_GIGADEVICE=y
CONFIG_SPI_FLASH_MACRONIX=y
CONFIG_SPI_FLASH_WINBOND=y
CONFIG_SPI_FLASH_MTD=y
CONFIG_ROCKCHIP_SFC=y
CONFIG_SPL_SPI_SUPPORT=y
CONFIG_SPL_MTD_SUPPORT=y
CONFIG_SPL_SPI_FLASH_SUPPORT=y
```

Treiber:

```text
./common/spl/spl_mtd_blk.c
```

Schnittstelle:

```text
int spl_mtd_load_image(struct spl_image_info *spl_image,
                       struct spl_boot_device *bootdev);
```

#### 10.4.3 OTP

Speicherung unveränderlicher Daten für Secure Boot. Konfiguration:

```text
CONFIG_SPL_MISC=y
CONFIG_SPL_ROCKCHIP_SECURE_OTP=y
```

Treiber:

```text
./drivers/misc/misc-uclass.c
./drivers/misc/rockchip-secure-otp.S
```

Schnittstelle:

```text
int misc_read(struct udevice *dev, int offset, void *buf, int size);
int misc_write(struct udevice *dev, int offset, void *buf, int size);
```

#### 10.4.4 Crypto

Secure Boot verwendet Crypto für hash- und ras-Berechnungen (Schreibweise des Originals). Konfiguration:

```text
CONFIG_SPL_DM_CRYPTO=y

// 2选1，各平台的defconfig已默认使能对应配置。
CONFIG_SPL_ROCKCHIP_CRYPTO_V1=y
CONFIG_SPL_ROCKCHIP_CRYPTO_V2=y
```

Treiber:

```text
./drivers/crypto/crypto-uclass.c
./drivers/crypto/rockchip/crypto_v1.c
./drivers/crypto/rockchip/crypto_v2.c
./drivers/crypto/rockchip/crypto_v2_pka.c
./drivers/crypto/rockchip/crypto_v2_util.c
```

Schnittstelle:

```text
u32 crypto_algo_nbits(u32 algo);
struct udevice *crypto_get_device(u32 capability);
int crypto_sha_init(struct udevice *dev, sha_context *ctx);
int crypto_sha_update(struct udevice *dev, u32 *input, u32 len);
int crypto_sha_final(struct udevice *dev, sha_context *ctx, u8 *output);
int crypto_sha_csum(struct udevice *dev, sha_context *ctx,
                    char *input, u32 input_len, u8 *output);
int crypto_rsa_verify(struct udevice *dev, rsa_key *ctx, u8 *sign, u8 *output);
```

#### 10.4.5 Uart

Der SPL-UART wird im chosen-Knoten von rkxxxx-u-boot.dtsi festgelegt. Beispiel RK3308:

```text
chosen {
    stdout-path = &uart2;
};

&uart2 {
    u-boot,dm-pre-reloc;
    clock-frequency = <24000000>;
    status = "okay";
};
```

## 11 TPL

TPL ist ein früherer Loader als U-Boot. Er läuft im SRAM und ersetzt ddr bin bei der DRAM-Initialisierung. TPL ist quelloffen, ddr bin proprietär.

### 11.1 Bauen und Paketieren

#### 11.1.1 Konfiguration

UART-Konfiguration: CONFIG_DEBUG_UART_BASE bezeichnet die UART-Basisadresse, CONFIG_ROCKCHIP_UART_MUX_SEL_M die UART-IOMUX-Gruppe. Beispiel: RV1126 verwendet UART2 M2 für DEBUG LOG. Methode 1: rv1126_defconfig ändern.

```text
CONFIG_DEBUG_UART_BASE=0xff570000
CONFIG_ROCKCHIP_UART_MUX_SEL_M=2
```

Methode 2: make menuconfig.

```text
Device Drivers ---> Serial drivers ---> (0xff570000) Base address of UART
ARM architecture ---> (2) UART mux select
```

DRAM-Typ konfigurieren: CONFIG_ROCKCHIP_TPL_INIT_DRAM_TYPE legt den von TPL unterstützten DRAM-Typ fest.

| DDR TYPE | Konfigurationswert |
| --- | --- |
| DDR2 | 2 |
| DDR3 | 3 |
| DDR4 | 0 |
| LPDDR2 | 5 |
| LPDDR3 | 6 |
| LPDDR4 | 7 |

Beispiel:

Beispiel: RV1126-TPL mit DDR3-Unterstützung. Methode 1: rv1126_defconfig ändern.

```text
CONFIG_ROCKCHIP_TPL_INIT_DRAM_TYPE=3
```

Methode 2: make menuconfig. Wird make.sh mit einem Chipnamen aufgerufen, führt der Build make xxxdefconfig aus und überschreibt menuconfig-Änderungen. make.sh ohne Argumente ausführen, um dies zu verhindern.

```text
Device Drivers ---> (3) TPL select DRAM type
```

Beispiel: make rv1126_defconfig oder ./make.sh rv1126 → Einstellungen mit make menuconfig ändern → ./make.sh. Schnellstart: CONFIG_SPL_KERNEL_BOOT für ein schnellstartfähiges tpl.bin aktivieren; derzeit nur RV1126/RV1109. Erweiterter Temperaturbereich: CONFIG_ROCKCHIP_DRAM_EXTENDED_TEMP_SUPPORT aktivieren; derzeit ebenfalls nur RV1126/RV1109. Weitere Parameter: DDR-Initialisierungscode liegt in drivers/ram/rockchip. Frequenz, Treiberstärke, ODT-Stärke usw. werden im Quellcode geändert. Für RV1126/RV1109 sind sie in sdram_inc/rv1126/sdram-rv1126-loader_params.inc dieses Verzeichnisses zusammengefasst; bei anderen Plattformen die jeweilige sdram_xxx.c ändern.

#### 11.1.2 Bauen

TPL wird aus demselben U-Boot-Code über einen anderen Buildpfad erzeugt. CONFIG_TPL_BUILD wird dabei automatisch definiert. Nach u-boot.bin folgt TPL mit dem separaten Ausgabeverzeichnis ./tpl/.

```text
// 编译u-boot
......
DTC     arch/arm/dts/rv1108-evb.dtb
DTC     arch/arm/dts/rk3399-puma-ddr1866.dtb
DTC     arch/arm/dts/rv1126-evb.dtb
FDTGREP dts/dt.dtb
FDTGREP dts/dt-spl.dtb
FDTGREP dts/dt-tpl.dtb
CAT     u-boot-dtb.bin
MKIMAGE u-boot.img
COPY    u-boot.dtb
MKIMAGE u-boot-dtb.img
COPY    u-boot.bin
ALIGN   u-boot.bin

// 编译tpl，有独⽴的tpl/⽬录
......
CC      tpl/common/init/board_init.o
CC      tpl/disk/part.o
LD      tpl/common/init/built-in.o
......
LD      tpl/u-boot-tpl
......
OBJCOPY tpl/u-boot-tpl-nodtb.bin
COPY    tpl/u-boot-tpl.bin
```

Build-Ergebnis:

```text
./tpl/u-boot-tpl.bin
```

Beispiel: U-Boot für RV1126 bauen.

```text
./make.sh rv1126
```

#### 11.1.3 Paketieren

1. Für eine gültige ddr bin müssen die ersten 4 Byte von u-boot-tpl.bin durch den Plattformtag ersetzt werden. Bei RV1126/RV1109 lautet er 110B. Wird nur ddr bin benötigt, den Tag selbst ersetzen; siehe scripts/spl.sh. Beispiel für RV1126:

```text
dd bs=4 skip=1 if=tpl/u-boot-tpl.bin of=tpl/u-boot-tpl-tag.bin && sed -i '1s/^/110B&/'
tpl/u-boot-tpl-tag.bin
```

2. Der folgende Befehl ersetzt den Tag in u-boot-tpl.bin automatisch und packt die Datei mit spl.bin zu einem vollständigen, auf die Platine programmierbaren Loader.

```text
./make.sh tpl
```

## 12 FIT

### 12.1 Vorwort

Dieses Kapitel beschreibt FIT sowie den sicheren und nicht sicheren Start damit. Beispiele und Bedienung beziehen sich der Übersichtlichkeit halber auf boot.img, gelten jedoch ebenso für recovery.img.

### 12.2 Einführung

#### 12.2.1 Grundlagen

FIT (flattened image tree) ist ein von U-Boot unterstütztes neueres Firmware-Bootformat zum Packen und Prüfen beliebig vieler Images. ITS (image source file) beschreibt die Images; mkimage erzeugt den ITB (flattened image tree blob). ITS verwendet flexible DTS-Syntax, sodass libfdt und zugehörige Werkzeuge direkt nutzbar sind. FIT ist das standardmäßig unterstützte und bevorzugte U-Boot-Format; SPL und U-Boot können FIT-Firmware starten. Weitere Informationen:

```text
./doc/uImage.FIT/
```

Da die offiziellen FIT-Funktionen die Produktanforderungen nicht vollständig abdecken, hat RK FIT angepasst und optimiert. Deshalb muss mkimage aus RK U-Boot verwendet werden, nicht die auf dem PC vorhandene Standardversion.

#### 12.2.2 Beispielvorstellung

Beispiel u-boot.its/u-boot.itb: /images definiert alle Ressourcen statisch, ähnlich DTSI; unter /configurations beschreibt jeder config-Knoten eine bootfähige Konfiguration, ähnlich einem Platinen-DTS; default = bestimmt die Standardkonfiguration.

```text
/dts-v1/;

/ {
    description = "Simple image with OP-TEE support";
    #address-cells = <1>;

    images {
        uboot {
            description = "U-Boot";
            data = /incbin/("./u-boot-nodtb.bin");
            type = "standalone";
            os = "U-Boot";
            arch = "arm";
            compression = "none";
            load = <0x00400000>;
            hash {
                algo = "sha256";
            };
        };
        optee {
            description = "OP-TEE";
            data = /incbin/("./tee.bin");
            type = "firmware";
            arch = "arm";
            os = "op-tee";
            compression = "none";
            load = <0x8400000>;
            entry = <0x8400000>;
            hash {
                algo = "sha256";
            };
        };
        fdt {
            description = "U-Boot dtb";
            data = /incbin/("./u-boot.dtb");
            type = "flat_dt";
            compression = "none";
            hash {
                algo = "sha256";
            };
        };
    };

    // configurations 节点下可以定义任意多个不同的conf节点，但实际产品⽅案上我们只需要⼀个conf即可。
    configurations {
        default = "conf";
        conf {
            description = "Rockchip armv7 with OP-TEE";
            rollback-index = <0x0>;
            firmware = "optee";
            loadables = "uboot";
            fdt = "fdt";
            signature {
                algo = "sha256,rsa2048";
                padding = "pss";
                key-name-hint = "dev";
                sign-images = "fdt", "firmware", "loadables";
            };
        };
    };
};
```

ITB mit mkimage und ITS erzeugen:

```text
                          mkimage + dtc
[u-boot.its] + [images]    =========>      [u-boot.itb]
```

ITB-Inhalt mit fdtdump anzeigen:

```text
cjh@ubuntu:~/uboot-nextdev/u-boot$ fdtdump fit/u-boot.itb | less

/dts-v1/;
// magic:       0xd00dfeed
// totalsize:       0x600 (1536)
// off_dt_struct:   0x48
// off_dt_strings:  0x48c
// off_mem_rsvmap:  0x28
// version:     17
// last_comp_version:   16
// boot_cpuid_phys: 0x0
// size_dt_strings: 0xc3
// size_dt_struct:  0x444

/memreserve/ 7f34d3411000 600;
/ {
    version = <0x00000001>;               // 新增固件版本号
    totalsize = <0x000bb600>;             // 新增字段描述整个itb⽂件的⼤⼩
    timestamp = <0x5ecb3553>;             // 新增当前固件⽣成时刻的时间戳
    description = "Simple image with OP-TEE support";
    #address-cells = <0x00000001>;
    images {
        uboot {
            data-size = <0x0007ed54>;     // 新增字段描述固件⼤⼩
            data-position = <0x00000a00>; // 新增字段描述固件偏移
            description = "U-Boot";
            type = "standalone";
            os = "U-Boot";
            arch = "arm";
            compression = "none";
            load = <0x00400000>;
            hash {
                // 新增固件的sha256校验和
                value = <0xeda8cd52 0x8f058118 0x00000003 0x35360000 0x6f707465 0x0000009f
0x00000091 0x00000000>;
                algo = "sha256";
            };
        };
        optee {
            data-size = <0x0003a058>;
            data-position = <0x0007f800>;
            description = "OP-TEE";
            type = "firmware";
            arch = "arm";
            os = "op-tee";
            compression = "none";
            load = <0x08400000>;
            entry = <0x08400000>;
            hash {
                value = <0xa569b7fc 0x2450ed39 0x00000003 0x35360000 0x66647400 0x00001686
0x000b9a00 0x552d426f>;
                algo = "sha256";
            };
        };
        fdt {
            data-size = <0x00001686>;
            data-position = <0x000b9a00>;
            description = "U-Boot dtb";
            type = "flat_dt";
            compression = "none";
            hash {
                value = <0x0f718794 0x78ece7b2 0x00000003 0x35360000 0x00000001 0x6e730000
0x636f6e66 0x00000000>;
                algo = "sha256";
            };
        };
    };
    configurations {
        default = "conf";
        conf {
            description = "Rockchip armv7 with OP-TEE";
            rollback-index = <0x00000001>; // 固件防回滚版本号，没有⼿动指定时默认为0
            firmware = "optee";
            loadables = "uboot";
            fdt = "fdt";
            signature {
                algo = "sha256,rsa2048";
                padding = "pss";
                key-name-hint = "dev";
                sign-images = "fdt", "firmware", "loadables";
            };
        };
    };
};
```

#### 12.2.3 ITB-Struktur

ITB besteht aus fdt_blob und Images. Zwei Packstrukturen sind möglich; RK verwendet Struktur 2.

```text
            fdt blob
|-----------------------------------|
|   |------|  |------|  |------|    |
|   | img0 |  | img1 |  | img2 |    | 结构1：image在fdt_blob内，即:itb = fdt_blob(含img)
|   |------|  |------|  |------|    |
|-----------------------------------|

|--------------|------|------|------|
|              |      |      |      |
|   fdt blob   | img0 | img1 | img2 | 结构2：image在fdt_blob外，即itb = fdt_blob + img
|              |      |      |      |
|--------------|------|------|------|
```

### 12.3 Plattformkonfiguration

#### 12.3.1 Chipunterstützung

Für Plattformen mit offiziell im SDK freigegebener Funktion siehe Funktionsübersicht der Chips am Dokumentanfang.

#### 12.3.2 Codekonfiguration

Code:

```text
// 框架代码
./common/image.c
./common/image-fit.c
./common/spl/spl_fit.c

// 平台代码：
./arch/arm/mack-rockchip/fit.c
./cmd/bootfit.c

// ⼯具代码
./tools/mkimage.c
./tools/fit_image.c
```

Konfiguration:

```text
// U-Boot阶段⽀持FIT
CONFIG_ROCKCHIP_FIT_IMAGE=y

// U-Boot阶段：安全启动、防回滚、硬件crypto
CONFIG_FIT_SIGNATURE=y
CONFIG_FIT_ROLLBACK_PROTECT=y
CONFIG_DM_CRYPTO=y
CONFIG_FIT_HW_CRYPTO=y
// SPL阶段：安全启动、防回滚、硬件crypto
CONFIG_SPL_FIT_SIGNATURE=y
CONFIG_SPL_FIT_ROLLBACK_PROTECT=y
CONFIG_SPL_DM_CRYPTO=y
CONFIG_SPL_FIT_HW_CRYPTO=y

// uboot.img镜像包含⼏份uboot.itb，单份uboot.itb多⼤
CONFIG_SPL_FIT_IMAGE_KB=2048
CONFIG_SPL_FIT_IMAGE_MULTIPLE=2

// uboot⼯程编译后默认输出fit格式的uboot.img; 否则为传统的RK格式uboot.img和trust.img。
CONFIG_ROCKCHIP_FIT_IMAGE_PACK=y
```

Crypto kann sich je Plattform unterscheiden; entsprechend unterscheiden sich die RSA-Parameter. Siehe allgemeinen defconfig der jeweiligen Plattform.

```text
CONFIG_RSA_N_SIZE
CONFIG_RSA_E_SIZE
CONFIG_RSA_C_SIZE
```

Allgemeiner defconfig: [Chip]_defconfig, beispielsweise rv1126_defconifg, rk3568_defconifg (Originalschreibweise). Ist FIT eine offiziell veröffentlichte SDK-Funktion, sind die meisten Grundeinstellungen bereits aktiv. Folgende Optionen sind selbst zu konfigurieren:

```text
// U-Boot 安全启动和防回滚机制
CONFIG_FIT_SIGNATURE=y
CONFIG_FIT_ROLLBACK_PROTECT=y

// SPL 安全启动和防回滚机制
CONFIG_SPL_FIT_SIGNATURE=y
CONFIG_SPL_FIT_ROLLBACK_PROTECT=y
```

Ohne CONFIG_FIT_SIGNATURE kann U-Boot android, uimage und fit starten; das jeweilige SDK aktiviert die benötigten Formate. Mit CONFIG_FIT_SIGNATURE wird ausschließlich FIT unterstützt.

#### 12.3.3 Imagedateien

Die FIT-Lösung erzeugt zwei programmierbare FIT-Abbilder, uboot.img (ohne trust.img) und boot.img, sowie SPL zum Packen des Loaders. uboot.itb = trust + u-boot.bin + mcu.bin (optional); uboot.img = N Kopien von uboot.itb, meist N=2. Trust und MCU bezieht das Buildskript automatisch aus rkbin. boot.itb = kernel + fdt + resource + ramdisk (optional); boot.img = M Kopien von boot.itb, meist M=1.

MCU-Konfiguration: Manche Plattformen enthalten MCU-Firmware. Ob sie eingebunden wird, bestimmt die jeweilige TRUST-INI-Konfiguration des Produkts, beispielsweise:

```text
// ⽂件：RKTRUST/RV1126TOS_TB.ini，⽤于快速开机产品，启⽤了MCU。
[TOS]
TOSTA=bin/rv11/rv1126_tee_ta_tb_v1.04.bin
ADDR=0x00040000

// MCU配置格式：固件路径，启动地址，状态(okay或disabled)。
// 如果为disabled，则mcu不会被打包进uboot.img中。
[MCU]
MCU=bin/rv11/rv1126_mcu_v1.02.bin,0x108000,okay
```

Firmwarekompression: Manche Plattformen unterstützen die Kompression interner uboot.img-Komponenten wie folgt:

| Plattform | Kompressionsformat | Firmware |
| --- | --- | --- |
| RV1126 | gzip、none | u-boot.bin, trust, mcu(optional) |

Zum Aktivieren Eigenschaften in der passenden TRUST-INI-Datei von rkbin ergänzen, beispielsweise:

```text
// ⽂件：RKTRUST/RV1126TOS_SPI_NOR_TINY.ini，⽤于⼩容量SPI Nor产品。
[TOS]
TOS=bin/rv11/rv1126_tee_v1.02.bin
ADDR=0x08400000
[MCU]
MCU=bin/rv11/rv1126_mcu_v1.00.bin,0x208000,disabled

// 压缩格式：gzip或none，不存在如下配置字段则默认⾮压缩。
[COMPRESSION]
COMPRESSION=gzip
```

SPL bezeichnet die erzeugte spl/u-boot-spl.bin, die uboot.img im FIT-Format startet. Sie ersetzt den proprietären RK-miniloader und wird zum Loader gepackt. Nach dem U-Boot-Build entsteht ./fit mit später erläuterten Zwischendateien. boot.img wird im SDK, uboot.img im U-Boot-Projekt gebaut. Ein boot.img für Secure Boot muss jedoch im U-Boot-Projekt erneut gepackt und signiert werden, wie nachfolgend beschrieben.

#### 12.3.4 ITS-Datei

Der U-Boot-ITS liegt in ./fit/u-boot.its. Er wird durch das in defconfig mit CONFIG_SPL_FIT_GENERATOR bestimmte Skript dynamisch erzeugt und ist nach erfolgreichem Build verfügbar. Der boot-ITS liegt im SDK-Projekt:

```text
device/rockchip/[platform]/xxx.its  // [platform]是平台⽬录
```

#### 12.3.5 Zugehörige Werkzeuge

```text
// 核⼼打包⼯具，编译完成后会⾃动⽣成，U-Boot和rkbin仓库下都有（U-Boot仓库下是实时编译⽣成）。
./tools/mkimage
// 固件打包脚本
./make.sh
// 固件重签名脚本
scripts/fit-resign.sh
// 固件解包脚本
scripts/fit-unpack.sh
// 固件替换脚本
./scripts/fit-repack.sh
```

Die Werkzeuge werden später erläutert; hier die make.sh-Parameter. Optional: --spl-new verwendet den neu gebauten SPL für den Loader, andernfalls den SPL aus rkbin; --version-uboot [n], --version-boot [n] und --version-recovery [n] setzen die Versionen von uboot.img, boot.img bzw. recovery.img, n ist jeweils eine positive Dezimal-Ganzzahl. Bei Secure Boot erforderlich: --rollback-index-uboot [n], --rollback-index-boot [n] und --rollback-index-recovery [n] setzen die Rollbackschutzversionen der entsprechenden Abbilder, ebenfalls als positive Dezimal-Ganzzahl. --no-check überspringt beim Packen sicherer Firmware die Selbstprüfung des Packskripts.

Erläuterungen:

1. Die Rollbackschutzversion ist nur bei Secure Boot aktivierbar und wird in OTP oder anderem sicherem Speicher abgelegt. Sie verhindert Angriffe über Schwachstellen älterer Firmware nach einem Rollback.

2. Die Firmwareversion ist optional und standardmäßig 0. Sie dient nur als Kennzeichnung zur Versionsverwaltung.

### 12.4 Start ohne Secure Boot

#### 12.4.1 uboot.img

Buildbefehl:

```text
./make.sh rv1126 --spl-new --uboot-version 10  // 可不指定 --spl-new和--uboot-version
```

Build-Ergebnis:

```text
  ......
  CC      spl/common/spl/spl.o
  CC      spl/lib/display_options.o
  LD      spl/common/spl/built-in.o
  LD      spl/lib/built-in.o
  LD      spl/u-boot-spl
  OBJCOPY spl/u-boot-spl-nodtb.bin
  CAT     spl/u-boot-spl-dtb.bin
  COPY    spl/u-boot-spl.bin
  CFGCHK  u-boot.cfg

out:rv1126_spl_loader_v1.00.100.bin
fix opt:rv1126_spl_loader_v1.00.100.bin
merge success(rv1126_spl_loader_v1.00.100.bin)
/home4/cjh/uboot-nextdev

// ⽣成 rv1126_spl_loader_v1.00.100.bin（⽤spl替代了RK平台传统的miniloader
// loader ini ⽂件来源
pack loader(SPL) okay! Input: /home4/cjh/rkbin/RKBOOT/RV1126MINIALL.ini
// 来⾃ --spl-new 参数的提⽰；⽤⼾可以选择不加这个参数。
pack loader with new: spl/u-boot-spl.bin

// ⽣成 uboot.img（包含trust和uboot），版本号为10
Image(no-signed, version=10):  uboot.img (FIT with uboot, trust...) is ready
// trust ini⽂件来源
pack uboot.img okay! Input: /home4/cjh/rkbin/RKTRUST/RV1126TOS.ini

Platform RV1126 is build OK, with exist .config
```

Sicherungskopien: Mehrere Kopien von uboot.img werden in defconfig konfiguriert:

```text
CONFIG_SPL_FIT_IMAGE_KB=2048    // 单份itb⼤⼩
CONFIG_SPL_FIT_IMAGE_MULTIPLE=2 // 打包的份数
```

SPL sucht und startet U-Boot und trust anhand dieser Einstellung. Sie schützt insbesondere vor Startausfällen durch beschädigte Firmware nach unerwartetem Stromverlust während OTA.

#### 12.4.2 boot.img

Ist FIT eine offizielle SDK-Funktion, erzeugt der SDK-Build boot.img im FIT-Format. Für Secure Boot dieses ins U-Boot-Projekt übernehmen, neu packen und signieren, da Signaturwerkzeuge, Konfiguration und Parameter dort liegen.

### 12.5 Secure Boot

FIT unterstützt Secure Boot mit sha256 + rsa2048 + pkcs-v2.1-(PSS)-Padding, Rollbackschutz, erneuter/entfernter Firmware-Signierung und Crypto-Hardwarebeschleunigung.

#### 12.5.1 Prinzip

##### 12.5.1.1 Prüfablauf

Maskrom prüft den Loader (SPL, DDR, usbplug). SPL prüft uboot.img (trust, U-Boot usw.). U-Boot prüft boot.img (kernel, fdt, ramdisk usw.). Standardmäßig wird nur sha256+rsa2048+pkcs-v2.1-(PSS)-Padding unterstützt.

##### 12.5.1.2 Schlüsselspeicherung

mkimage packt den RSA-Schlüssel in u-boot.dtb und u-boot-spl.dtb; diese werden anschließend in u-boot.bin bzw. u-boot-spl.bin eingebettet. Schlüsselstruktur in u-boot.dtb, analog für u-boot-spl.dtb:

```text
cjh@ubuntu:~/uboot-nextdev$ fdtdump u-boot.dtb | less
/dts-v1/;
....

/ {
    #address-cells = <0x00000001>;
    #size-cells = <0x00000001>;
    compatible = "rockchip,rv1126-evb", "rockchip,rv1126";
    model = "Rockchip RV1126 Evaluation Board";

    // signature节点由mkimage⼯具⾃动插⼊⽣成，节点⾥保存了RSA-SHA算法类型、RSA核⼼因⼦参数等信息。
    signature {
        key-dev {
            required = "conf";
            algo = "sha256,rsa2048";
            rsa,np = <0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000
0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000
0x00000000 0x1327f633 0x00000003 0x00000003 0x00000003 0xc7aead6a 0xb4c79f40 0xa82bdf76
0xfb2f8387 0xa1e06dce 0xd451a706 0xc7f865e3 0x3e2d7ca8 0x6a71762e 0x125f1828 0x36ab1a41
0xb7e9e852 0x7bd0011a 0x7279e0b8 0xf37e189c 0x8cf00963 0x00000100 0x00000000 0x00000000
0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000
0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000377 0x00000004
0x00000004 0x00000004 0x00000002 0x00000003 0x69616c40 0x00000003 0x6d634066 0x00000010
0x66633630 0x73797363>;
            rsa,c = <0x00000000>;
            rsa,r-squared = <0x00000000>;
            rsa,modulus = <0xc25ae693 0xc359f2a4 0xa866c89d 0xb7b1994f 0xf9f9f690 0x518d54a7
0xda0b83e8 0x06606e12 0x6ad1cbf9 0x92438edd 0x81e039c0 0x5d7322cc 0x124cdc80 0xa0c3288a
0x9265c3ae 0x6ac47a4b 0x00000003 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000
0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000
0x00000000 0x00000000 0x00000000 0x00000008 0x00000003 0x00000003 0x00000003 0x00000002
0x73657300 0x2f736572 0x00000000 0x2f64776d 0x00000003 0x6d634066 0x00000001 0x30303000
0x726f636b 0x67726600 0x00000008 0x00000003 0x00000004 0x00000001 0x30303000 0x726f636b
0x706d7567 0x00000003 0x00001000 0x00000003 0x00000002 0x6e616765 0x30000000 0x726f636b
0x706d7500 0x00000008>;
            rsa,exponent-BN = <0x00000000 0x00000000 0x00000000 0x00000000 0x00000000
0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000
0x00000000 0x00000000 0x00000000 0x00000003 0x00010001 0xe95771c5 0x00000800 0x64657600
0x616c6961 0x0000002c 0x30303030 0x00000034 0x30303000 0x2f64776d 0x00000002 0x65303030
0x0000001b 0x3132362d 0x00000003 0x00020000 0x00000003 0x00000002 0x65303230 0x0000001b
0x3132362d 0x6e000000 0xfe020000 0x00000042 0x0000006d 0x722d6d61 0x65303030 0x0000001b
0x3132362d 0x00000003 0x00001000 0x00000002 0x6e74726f 0x30000000 0x726f636b 0x706d7563
0x0000003e 0x00000004 0x00000004 0x00000004 0x00000000 0x00000050 0x636c6f63 0x40666634
0x00000014 0x2c727631 0x00000008>;
            rsa,exponent = <0x00000000 0x00000368>;
            rsa,n0-inverse = <0xe95771c5>;
            rsa,num-bits = <0x00000800>;
            key-name-hint = "dev";
        };
    };
```

SPL unterstützt das Programmieren des Schlüsselhashs; im key-dev von u-boot-spl.dtb wird burn-key-hash = &lt;0x00000001&gt;; ergänzt.

##### 12.5.1.3 Schlüsselverwendung

Von Maskrom bis zum Kernel wird derselbe öffentliche RSA-Schlüssel verwendet. Maskrom prüft den Loader: Das PC-Werkzeug rk_sign_tool schreibt den Schlüssel in dessen Header. Bei Secure Boot liest und prüft Maskrom den Schlüssel und prüft damit die Loader-Signatur. rk_sign_tool liegt in rkbin; U-Boot signiert den Loader automatisch. SPL prüft U-Boot und trust: Der Schlüssel liegt in u-boot-spl.dtb, eingebettet in u-boot-spl.bin und anschließend in den Loader. SPL entnimmt ihn seinem eigenen DTB und prüft uboot.img.

U-Boot prüft boot: Der öffentliche RSA-Schlüssel liegt in u-boot.dtb, eingebettet in u-boot.bin und anschließend uboot.img. Bei Secure Boot wird er dem eigenen DTB entnommen, um boot.img zu prüfen. Der Schlüssel jeder Stufe ist somit Teil ihrer Firmware und bereits durch den vorherigen Loader authentifiziert.

##### 12.5.1.4 Signaturspeicherung

Die RSA-Signatur liegt im ITB. hashed-nodes bestimmt den signierten Inhalt, darunter die Eigenschaften des gesamten conf-Knotens und die Knoten der gepackten Firmware. Nachfolgend die Signaturinformationen von u-boot.itb; für boot.itb gilt dasselbe:

```text
cjh@ubuntu:~/uboot-nextdev$ fdtdump uboot.img | less
/dts-v1/;
......

    configurations {
        default = "conf";
        conf {
            description = "Rockchip armv7 with OP-TEE";
            // 当前的固件版本号
            rollback-index = <0x0000001c>;
            firmware = "optee";
            loadables = "uboot";
            fdt = "fdt";

            // 被签名内容和签名结果，由mkimage⾃动插⼊
            signature {
                hashed-strings = <0x00000000 0x000000da>;
                // 指定被签名内容
                hashed-nodes = "/", "/configurations", "/configurations/conf",
"/images/fdt", "/images/fdt/hash", "/images/optee", "/images/optee/hash", "/images/uboot",
"/images/uboot/hash";
                // 进⾏签名的时间、签名者、版本
                timestamp = <0x5e9427b4>;
                signer-version = "2017.09-g8bb63db-200413-dirty #cjh";
                signer-name = "mkimage";
                // 签名结果！！(采⽤sha256+rsa2048)
                value = <0x78397d5d 0xb9219a0b 0xa7cb91a7 0xe1f32867 0x62719d9b 0x8901200c
0xfcbac03a 0x1295ccc8 0x1cff9608 0xdf5f69d2 0x21391225 0x7af10ca7 0x5527864f 0xb13f527e
0xddf9ee62 0xea50199d 0x00000003 0x35362c72 0x00000004 0x00000017 0x77617265 0x00000002
0x00000009 0x23616464 0x6d616765 0x73006172 0x6f6e006c 0x72790064 0x61636b2d 0x7265006c
0x006b6579 0x69676e2d 0x706f7369 0x7a650074 0x75650073 0x69676e65 0x73686564 0x642d7374
0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000
0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000
0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000
0x00000000 0x00000000>;
                algo = "sha256,rsa2048";
                key-name-hint = "dev";
                sign-images = "fdt", "firmware", "loadables";
        };
    };
};
```

##### 12.5.1.5 Rollbackschutz

Bei Secure Boot werden die aktuellen Versionen von boot.img und uboot.img getrennt festgelegt. Liegt eine Version unter der Gerätemindestversion, wird der Start verweigert. Die Mindestversion wird nach erfolgreicher Sicherheitsprüfung und bestätigtem regulärem Systemstart in OTP oder sicherem Speicher aktualisiert.

#### 12.5.2 Vorbereitung

##### 12.5.2.1 Schlüssel

Die folgenden drei Befehle erzeugen im U-Boot-Projekt ein RSA-Schlüsselpaar zum Signieren. Normalerweise wird es einmal erzeugt und anschließend zum Signieren und Prüfen der Firmware weiterverwendet. Die Schlüssel sicher aufbewahren.

```text
// 1. 放key的⽬录：keys
mkdir -p keys

// 2. 使⽤RK的"rk_sign_tool"⼯具⽣成RSA2048的私钥privateKey.pem和publicKey.pem（请参考
rk_sign_tool的使⽤⼿册），分别更名存放为：keys/dev.key和keys/dev.pubkey。

// 3. 使⽤-x509和私钥⽣成⼀个⾃签名证书：keys/dev.crt （效果本质等同于公钥）
openssl req -batch -new -x509 -key keys/dev.key -out keys/dev.crt
```

Bei fehlender .rnd-Datei im Benutzerverzeichnis erscheinen `Can't load /home4/cjh//.rnd into RNG` und `140522933268928:error:2406F079:random number generator:RAND_load_file:Cannot open file:../crypto/rand/randfile.c:88:Filename=/home4/cjh//.rnd`. Die Datei mit `touch ~/.rnd` anlegen. Ergebnis prüfen: `ls keys/`.

```text
dev.crt  dev.key  dev.pubkey
```

Achtung: keys, dev.key, dev.crt und dev.pubkey dürfen nicht umbenannt werden. Die Namen stehen statisch im ITS; Änderungen führen zu Packfehlern.

##### 12.5.2.2 Konfiguration

Im U-Boot-defconfig aktivieren:

```text
// 必选。
CONFIG_FIT_SIGNATURE=y
CONFIG_SPL_FIT_SIGNATURE=y

// 可选。
CONFIG_FIT_ROLLBACK_PROTECT=y       // boot.img防回滚
CONFIG_SPL_FIT_ROLLBACK_PROTECT=y   // uboot.img防回滚
```

Optionen vorzugsweise mit make menuconfig auswählen und den ursprünglichen defconfig anschließend mit make savedefconfig aktualisieren. So werden falsche Abhängigkeiten und Buildfehler durch direkt erzwungene defconfig-Einträge vermieden.

##### 12.5.2.3 Firmware

Das im SDK erzeugte boot.img in das U-Boot-Wurzelverzeichnis kopieren.

#### 12.5.3 Bauen und Paketieren

(1) Grundbefehl ohne Rollbackschutz:

```text
./make.sh rv1126 --spl-new --boot_img boot.img --recovery_img recovery.img
```

Build-Ergebnis:

```text
......

// 编译完成后，⽣成已签名的uboot.img和boot.img。
start to sign rv1126_spl_loader_v1.00.100.bin
......
sign loader ok.
......
Image(signed, version=0):  uboot.img (FIT with uboot, trust...) is ready
Image(signed, version=0):  recovery.img (FIT with kernel, fdt, resource...) is ready
Image(signed, version=0):  boot.img (FIT with kernel, fdt, resource...) is ready
Image(signed):  rv1126_spl_loader_v1.05.106.bin (with spl, ddr, usbplug) is ready
pack uboot.img okay! Input: /home4/cjh/rkbin/RKTRUST/RV1126TOS.ini

Platform RV1126 is build OK, with new .config(make rv1126-secure_defconfig)
```

(2) Erweiterung 1: Bei Rollbackschutz die rollback-Parameter zu (1) ergänzen, beispielsweise:

```text
// 指定 uboot.img和boot.img的最⼩版本号分别为10、12.
./make.sh rv1126 --spl-new --boot_img boot.img --recovery_img recovery.img --rollback-index-
uboot 10 --rollback-index-boot 12 --rollback-index-recovery 12
```

Build-Ergebnis:

```text
......

// 编译完成后，⽣成已签名的uboot.img和boot.img，且包含防回滚版本号。
start to sign rv1126_spl_loader_v1.00.100.bin
......
sign loader ok.
......
Image(signed, version=0, rollback-index=10):  uboot.img (FIT with uboot, trust) is ready
Image(signed, version=0, rollback-index=12):  recovery.img (FIT with kernel, fdt,
resource...) is ready
Image(signed, version=0, rollback-index=12):  boot.img (FIT with kernel, fdt, resource...)
is ready
Image(signed):  rv1126_spl_loader_v1.00.100.bin (with spl, ddr, usbplug) is ready
```

(3) Erweiterung 2: Zum Programmieren des öffentlichen Schlüsselhashs in OTP/eFUSE --burn-key-hash zu (1) oder (2) ergänzen, beispielsweise:

```text
// 指定uboot.img和boot.img的最⼩版本号分别为10、12.
// 要求SPL阶段把公钥hash烧写到OTP/eFUSE中。
./make.sh rv1126 --spl-new --boot_img boot.img --recovery_img recovery.img --rollback-index-
uboot 10 --rollback-index-boot 12 --rollback-index-recovery 12 --burn-key-hash
```

Build-Ergebnis:

```text
......

// 使能 burn-key-hash
### spl/u-boot-spl.dtb: burn-key-hash=1

// 编译完成后，⽣成已签名的uboot.img和boot.img，且包含防回滚版本号。
start to sign rv1126_spl_loader_v1.00.100.bin
......
sign loader ok.
......
Image(signed, version=0, rollback-index=10):  uboot.img (FIT with uboot, trust) is ready
Image(signed, version=0, rollback-index=12):  recovery.img (FIT with kernel, fdt,
resource...) is ready
Image(signed, version=0, rollback-index=12):  boot.img (FIT with kernel, fdt, resource...)
is ready
Image(signed):  rv1126_spl_loader_v1.00.100.bin (with spl, ddr, usbplug) is ready
```

Nach dem Einschalten meldet SPL: RSA: Write key hash successfully. (4) Hinweise: --boot_img und --recovery_img geben optional die zu signierenden boot.img und recovery.img an. --rollback-index-uboot, --rollback-index-boot und --rollback-index-recovery setzen optional die Rollbackschutzversionen. Ohne --spl-new wird der Loader mit SPL aus rkbin gepackt; mit diesem Parameter wird der neu gebaute

SPL verwendet. Da u-boot-spl.dtb den RSA-Schlüssel des Nutzers enthalten muss, veröffentlicht RK im rkbin des SDK keinen Secure-Boot-SPL. Deshalb diesen Parameter angeben. Alternativ den eigenen stabilen SPL in rkbin ablegen und später ohne Parameter stets diese Version verwenden. Erzeugt werden Loader, uboot.img und boot.img; solange der RSA-Schlüssel gleich bleibt, darf jedes Abbild separat aktualisiert werden.

#### 12.5.4 Prüfprinzipien

(1) Maskrom prüft SPL: Ohne Schlüssel in OTP erfolgt ein nicht sicherer Start. Mit programmiertem Schlüssel muss der Loader-Schlüssel mit OTP übereinstimmen; erst dann erfolgt die Sicherheitsprüfung. Eine Abweichung verhindert den Start. (2) SPL prüft U-Boot: CONFIG_SPL_FIT_SIGNATURE=y prüft uboot.img immer und startet nur bei Erfolg; fehlende oder ungültige Signatur verhindert den Start. Bei =n enthält SPL den Prüfcode nicht und prüft uboot.img unabhängig von dessen Signatur nicht. (3) U-Boot prüft boot/recovery: CONFIG_FIT_SIGNATURE=y prüft boot.img/recovery.img immer und startet nur bei Erfolg; fehlende oder ungültige Signatur verhindert den Start. Bei =n werden diese Abbilder unabhängig von ihrer Signatur nicht geprüft. Wichtig: Ob eine Stufe die nächste prüft, hängt nicht von ihrer eigenen Signatur ab, sondern allein vom enthaltenen Secure-Boot-Code, also den genannten Optionen auf y.

#### 12.5.5 Startmeldungen

Secure-Boot-Ausgabe:

```text
BW=32 Col=10 Bk=8 CS0 Row=15 CS=1 Die BW=16 Size=1024MB
out
U-Boot SPL board init
U-Boot SPL 2017.09-gacb99c5-200408-dirty #cjh (Apr 09 2020 - 20:51:21)
unrecognized JEDEC id bytes: 00, 00, 00

Trying to boot from MMC1
// SPL完成签名校验
sha256,rsa2048:dev+
// 防回滚检测：当前uboot.img固件版本号是10，本机的最⼩版本号是9
rollback index: 10 >= 9, OK
// SPL完成各⼦镜像的hash校验
### Checking optee ... sha256+ OK
### Checking uboot ... sha256+ OK
### Checking fdt ... sha256+ OK

Jumping to U-Boot via OP-TEE
I/TC:
E/TC:0 0 plat_rockchip_pmu_init:2003 0
E/TC:0 0 plat_rockchip_pmu_init:2006 cpu off
E/TC:0 0 plat_rockchip_pmusram_prepare:1945 pmu sram prepare 0x14b10000 0x8400880 0x1c
E/TC:0 0 plat_rockchip_pmu_init:2020 pmu sram prepare
E/TC:0 0 plat_rockchip_pmu_init:2056 remap
I/TC: OP-TEE version: 3.6.0-233-g35ecf936 #1 Tue Mar 31 08:46:13 UTC 2020 arm
I/TC: Next entry point address: 0x00400000
I/TC: Initialized

U-Boot 2017.09-gacb99c5-200408-dirty #cjh (Apr 09 2020 - 20:51:21 +0800)

Model: Rockchip RV1126 Evaluation Board
PreSerial: 2
DRAM:  1023.5 MiB
Sysmem: init
Relocation Offset: 00000000, fdt: 3df404e0
Using default environment

dwmmc@ffc50000: 0
Bootdev(atags): mmc 0
MMC0: HS200, 200Mhz
PartType: EFI
boot mode: normal
conf: sha256,rsa2048:dev+
resource: sha256+
DTB: rk-kernel.dtb
FIT: signed, conf required
HASH(c): OK

I2c0 speed: 400000Hz
PMIC:  RK8090 (on=0x10, off=0x00)
vdd_logic 800000 uV
vdd_arm 800000 uV
vdd_npu init 800000 uV
vdd_vepu init 800000 uV
......

Hit key to stop autoboot('CTRL+C'):  0
### Booting FIT Image at 0x3d8122c0 with size 0x0052b200
Fdt Ramdisk skip relocation
### Loading kernel from FIT Image at 3d8122c0 ...
   Using 'conf' configuration
   // uboot完成签名校验
   Verifying Hash Integrity ... sha256,rsa2048:dev+ OK
   // 防回滚检测：当前boot.img固件版本号是22，本机的最⼩版本号是21
   Verifying Rollback-index ... 22 >= 21, OK
   Trying 'kernel' kernel subimage
     Description:  Kernel for arm
     Type:         Kernel Image
     Compression:  uncompressed
     Data Start:   0x3d8234c0
     Data Size:    5349248 Bytes = 5.1 MiB
     Architecture: ARM
     OS:           Linux
     Load Address: 0x02008000
     Entry Point:  0x02008000
     Hash algo:    sha256
     Hash value:   64b4a0333f7862967be052a67ee3858884fcefebf4565db5c3828a941a15f34a
   Verifying Hash Integrity ... sha256+ OK  // 完成kernel的hash校验
### Loading ramdisk from FIT Image at 3d8122c0 ...
   Using 'conf' configuration
   Trying 'ramdisk' ramdisk subimage
     Description:  Ramdisk for arm
     Type:         RAMDisk Image
     Compression:  uncompressed
     Data Start:   0x3dd3d4c0
     Data Size:    0 Bytes = 0 Bytes
     Architecture: ARM
     OS:           Linux
     Load Address: 0x0a200000
     Entry Point:  unavailable
     Hash algo:    sha256
     Hash value:   e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
   Verifying Hash Integrity ... sha256+ OK  // 完成ramdisk的hash校验
   Loading ramdisk from 0x3dd3d4c0 to 0x0a200000
### Loading fdt from FIT Image at 3d8122c0 ...
   Using 'conf' configuration
   Trying 'fdt' fdt subimage
     Description:  Device tree blob for arm
     Type:         Flat Device Tree
     Compression:  uncompressed
     Data Start:   0x3d812ec0
     Data Size:    66974 Bytes = 65.4 KiB
     Architecture: ARM
     Load Address: 0x08300000
     Hash algo:    sha256
     Hash value:   8fb1f170766270ed4f37cce4b082a51614cb346c223f96ddfe3526fafc5729d7
   Verifying Hash Integrity ... sha256+ OK // 完成fdt的hash校验
   Loading fdt from 0x3d812ec0 to 0x08300000
   Booting using the fdt blob at 0x8300000
   Loading Kernel Image from 0x3d8234c0 to 0x02008000 ... OK
   Using Device Tree in place at 08300000, end 0831359d
Adding bank: 0x00000000 - 0x08400000 (size: 0x08400000)
Adding bank: 0x0848a000 - 0x40000000 (size: 0x37b76000)
Total: 236.327 ms

Starting kernel ...

[    0.000000] Booting Linux on physical CPU 0xf00
[    0.000000] Linux version 4.19.111 (cjh@ubuntu) (gcc version 6.3.1 20170404 (Linaro GCC
6.3-2017.05)) #28 SMP PREEMPT Wed Mar 25 16:03:27 CST 2020
[    0.000000] CPU: ARMv7 Processor [410fc075] revision 5 (ARMv7), cr=10c5387d
```

### 12.6 Unabhängige Signatur

Beim unabhängigen FIT-Signieren wird unsignierte Firmware entpackt, neu gepackt und signiert. Zunächst folgt der Ablauf, danach die Werkzeuge. Die Funktion wird seit Januar 2025 unterstützt; U-Boot und rkbin müssen die entsprechenden Patches enthalten. U-Boot-Repository:

```text
91b5d8722da scripts: Add fit-sign.sh
554ddf99bfb scripts: fit-core.sh: Add fit_signcfg export support
cb458c93a05 scripts: fit-core.sh: Add --no-sign support
bc02f36c3b2 scripts: fit-unpack: Support none digest node
```

rkbin-Repository:

```text
44216040fad tools: build mkimage/fit_check_sign with -static
88d46662a9b tools: Add fit sign tools support
```

#### 12.6.1 Signaturablauf

Aufgaben der für den Firmwarebuild zuständigen Person:

1. Die nötigen Optionen gemäß dem vorherigen Secure-Boot-Abschnitt aktivieren.

2. Bauen:

```text
./make.sh rk3588 --spl-new --no-sign   # 必须追加 --spl-new --no-sign
```

Nach dem Build entstehen:

```text
uboot.img
rk3588_spl_loader_v1.18.113.bin
fit/fit_signcfg/
```

3. Die drei erzeugten Dateien und weitere zu signierende FIT-Dateien wie boot.img/recovery.img an die signierende Person oder den Server übertragen. Wichtig: Loader, uboot und fit_signcfg gehören strikt zusammen; gleichnamige Dateien anderer Builds dürfen nicht gemischt werden, sonst meldet das Signaturskript einen Fehler. Aufgaben der signierenden Person bzw. des Servers:

1. Ein Arbeitsverzeichnis mit beliebigem Namen erstellen:

```text
$ mkdir workspace
$ cd workspace
$ mkdir keys src output
```

2. rkbin beziehen und dessen tools-Verzeichnis in workspace kopieren oder symbolisch verknüpfen:

```text
$ cp ~/rkbin/tools/ ./ -R
```

3. Das RSA-Schlüsselpaar gemäß Secure-Boot-Abschnitt in keys, die Firmware und fit_signcfg in src ablegen. Loader, uboot und fit_signcfg sind erforderlich; weitere FIT-Abbilder wie boot.img/recovery.img sind möglich. Beispiel:

```text
cjh@sys2:/home4/cjh/rkbin/workspace$ tree
├── keys
│   ├── dev.crt
│   ├── dev.key
│   └── dev.pubkey
├── output
├── src
│   ├── fit_signcfg
│   │   ├── MINIALL.ini
│   │   ├── sign.readonly_config
│   │   └── test_images.tar.gz
│   ├── boot.img
│   ├── recovery.img
│   ├── rk3588_spl_loader_v1.18.113.bin
│   └── uboot.img
└── tools
    ├── bmp2gray16
    ├── boot_merger
    ├── burner_image_kits
    │   ├── make.sh
    │   ├── make_slc_nand.sh
    ......
```

4. Signieren:

```text
$ ./tools/fit-sign.sh --key-dir keys/ --src-dir src/ --out-dir output/
```

Die Quelldateien in src werden nicht verändert. Nach erfolgreicher Signatur liegen alle signierten Firmwaredateien in output:

```text
$ tree output/
output/
├── boot.img
├── recovery.img
├── rk3588_spl_loader_v1.18.113.bin
└── uboot.img
```

#### 12.6.2 Signaturskript

Die Werkzeuge zum unabhängigen Signieren liegen in rkbin. Entwicklerskript: ./tools/fit-sign.sh.

```text
$ ./tools/fit-sign.sh -h

Usage:
    ./tools/fit-sign.sh [args]

Args:
    --key-dir                  <dir>                         | Mandatory
    --src-dir                  <dir>                         | Mandatory
    --out-dir                  <dir>                         | Mandatory
    --burn-key-hash                                          | Optional
    --rollback-index           <image1 n1> <image2 n2> ...   | Optional
    --version                  <image1 n1> <image2 n2> ...   | Optional
```

--key-dir erforderlich: RSA-Schlüsselverzeichnis. --src-dir erforderlich: Firmwareverzeichnis mit Loader, uboot und fit_signcfg. --out-dir erforderlich: Ausgabeverzeichnis der signierten Dateien. --burn-key-hash optional ohne Zusatzwert: aktiviert das Programmieren des öffentlichen RSA-Schlüsselhashs in OTP durch SPL. --rollback-index setzt optional die dezimale Rollbackschutzversion der jeweiligen Firmware. --version setzt optional deren gewöhnliche dezimale Dateiversion. Beispiel:

```text
./tools/fit-sign.sh --key-dir keys/ --src-dir src/ --out-dir output/ --version uboot.img 1
boot.img 3 --rollback-index uboot.img 3 boot.img 5
```

#### 12.6.3 Signaturkonfiguration

Damit die beim Signieren angegebenen Funktionen tatsächlich in SPL und U-Boot aktiviert sind, erzeugt der Build zusätzliche Konfigurationsnachweise. Das Signaturskript benötigt diese Dateien.

```text
$ tree fit_signcfg/
fit_signcfg/
├── MINIALL.ini            # 打包loader⽤的ini⽂件。
├── sign.readonly_config   # 当前编译配置、uboot、loader版本相关的记录⽂件。
└── test_images.tar.gz     # 暂时⽆⽤，忽略。
```

### 12.7 Remote-Signatur

Unabhängiges Signieren erfordert die Übertragung der gesamten Firmware zur signierenden Person oder zum Server, was Datenmenge und Geschwindigkeit beeinflusst. Entferntes Signieren ist eine schlankere Alternative. Beide Varianten haben Vor- und Nachteile; bedarfsgerecht auswählen.

#### 12.7.1 Implementierungsansatz

Da nur der öffentliche Serverschlüssel verfügbar ist, wird die Firmware lokal zunächst mit einem temporären privaten Schlüssel und dem öffentlichen Serverschlüssel gepackt und signiert. Es entstehen sichere Firmware mit temporärer Signatur sowie die zu signierenden Daten. Der öffentliche Schlüssel wird für Secure Boot in den DTB eingebettet, der private erzeugt die temporäre Signatur. Nur die zu signierenden Daten statt der gesamten Firmware gehen an den Server. Dieser signiert sie mit seinem privaten Schlüssel und liefert die Signatur zurück. Sie ersetzt die temporäre Signatur und ergibt die endgültige programmierbare sichere Firmware.

#### 12.7.2 Zu signierende Daten

Die signierten Daten bestehen aus FDT-Blob-Konfiguration und Subimage-Hashes. hashed-nodes benennt die FDT-Knoten, deren Inhalte einbezogen werden.

```text
cjh@ubuntu:~/uboot-nextdev$ fdtdump uboot.img | less
/dts-v1/;
......

configurations {
        default = "conf";
        conf {
            description = "Rockchip armv7 with OP-TEE";
            rollback-index = <0x0000001c>;
            firmware = "optee";
            loadables = "uboot";
            fdt = "fdt";

            signature {
                hashed-strings = <0x00000000 0x000000da>;
                // 这些节点的内容都会纳⼊被签名数据
                hashed-nodes = "/", "/configurations/conf", "/images/fdt",
"/images/fdt/hash", "/images/optee", "/images/optee/hash", "/images/uboot",
"/images/uboot/hash";
                ......
```

Subimage-Hashes: mkimage berechnet automatisch jeden Hash und ergänzt einen hash-Knoten. Alle durch sign-images bestimmten Subimage-Hashes werden signiert, technisch durch Aufnahme ihrer hash-Knoten in hashed-nodes. Beispiel:

```text
cjh@ubuntu:~/uboot-nextdev/u-boot$ fdtdump fit/u-boot.itb | less

/dts-v1/;
......

/ {
    totalsize = <0x000bb600>;
    timestamp = <0x5ecb3553>;
    description = "Simple image with OP-TEE support";
    #address-cells = <0x00000001>;
    images {
        uboot {
            data-size = <0x0007ed54>;
            data-position = <0x00000a00>;
            description = "U-Boot";
            type = "standalone";
            os = "U-Boot";
            arch = "arm";
            compression = "none";
            load = <0x00400000>;
            hash {
                // uboot镜像的hash，由mkimage⼯具⾃动计算⽣成
                value = <0xeda8cd52 0x8f058118 0x00000003 0x35360000 0x6f707465
0x0000009f 0x00000091 0x00000000>;
                algo = "sha256";
            };
        };
        ......
```

#### 12.7.3 Einzelschritte

Das RSA-Schlüsselpaar umfasst dev.key, dev.pubkey und dev.crt. Der private dev.key bleibt auf dem Server; der Nutzer besitzt nur dev.pubkey und dev.crt. Schritt 1 im lokalen U-Boot-Projekt: dev.crt in keys ablegen, mit RK rk_sign_tool einen zufälligen temporären privaten Schlüssel erzeugen und als keys/dev.key speichern. Nach dem vorherigen Abschnitt signierte uboot.img und boot.img erzeugen und unbedingt --no-check ergänzen. Diese Abbilder selbst werden nicht verwendet; benötigt werden die Zwischendateien. Ohne --no-check scheitert die Pack-Selbstprüfung an den nicht zusammenpassenden dev.key/dev.crt. Beispiel:

```text
./make.sh rv1126 --spl-new --boot_img boot.img --rollback-index-uboot 10 --rollback-index-
boot 12 --no-check
```

Neben signierten uboot.img und boot.img liegen in fit/ folgende Zwischendateien:

```text
// 被签名内容(data2sign意为：data to sign)
fit/uboot.data2sign
fit/boot.data2sign

// 已签名itb⽂件（使⽤临时私钥），我们的img⽂件由它们进⾏多备份后获得。
fit/uboot.itb
fit/boot.itb
```

Schritt 2: uboot.data2sign an den Server senden. Heißt dessen privater Schlüssel dev.key, erzeugt folgender Befehl uboot.sig:

```text
openssl dgst -sha256 -sign dev.key -sigopt rsa_padding_mode:pss -out uboot.sig
uboot.data2sign
```

Der Server liefert uboot.sig zurück. Damit die temporäre Signatur in uboot.itb ersetzen:

```text
./scripts/fit-resign.sh -f fit/uboot.itb -s uboot.sig // 会⽣成新的uboot.img，⽤于烧写
```

Für boot.itb genauso vorgehen; dadurch entstehen gültig signierte uboot.img und boot.img. Wichtig: -f von fit-resign.sh bezeichnet ITB, nicht IMG; das Skript signiert ITB erneut und erzeugt IMG. Der ITB muss exakt aus Schritt 1 stammen: ITB und data2sign gehören eins zu eins zusammen, da data2sign den Erzeugungszeitstempel /timestamp = &lt;...&gt; enthält. Selbst ohne Codeänderung führt ein neu gebauter uboot.itb mit altem uboot.sig zum Secure-Boot-Fehler. Da lokal kein privater Schlüssel vorliegt, muss der Loader separat zum Signieren an den Server gesendet werden.

### 12.8 Firmware entpacken

Firmware lässt sich per Skript entpacken, beispielsweise boot.img:

```text
cjh@ubuntu:~/uboot-nextdev$ ./scripts/fit-unpack.sh -f boot.img -o out
Unpack to directory out:
  fdt                 : 82813 bytes... sha256+
  kernel              : 5844640 bytes... sha256+
  ramdisk             : 0 bytes... sha256+
  resource            : 120832 bytes... sha256+
```

Enthält IMG mehrere Kopien, wird nur der erste ITB entpackt. sha256+ bedeutet unbeschädigte Firmware, andernfalls erscheint sha256-.

### 12.9 Firmware ersetzen

Das Skript ermöglicht den gemeinsamen Austausch von Komponenten. Beispiel: Die eigene bl31.elf anstelle derjenigen in fremdem uboot_legacy.img verwenden:

1. Eigenes uboot.img mit eigener bl31.elf bauen.

2. uboot_legacy.img mit fit-unpack.sh nach out/ entpacken.

```text
cjh@ubuntu:~/uboot-nextdev$ ./scripts/fit-unpack.sh -f uboot_legacy.img -o out/

uboot_legacy.img: Device Tree Blob version 17, size=2560, boot CPU=0, string block
size=197, DT structure block size=2204
Unpack to directory out:
  uboot               : 576352 bytes... sha256+
  atf-1               : 69089 bytes... sha256+
  atf-2               : 36864 bytes... sha256+
  atf-3               : 24576 bytes... sha256+
  optee               : 228134 bytes... sha256+
  fdt                 : 8867 bytes... sha256+
```

3. Alle atf-xxx-Dateien in out/ entfernen.

4. Mit fit-repack.sh alle Subimages aus out/ in das eigene uboot.img übernehmen. Dieses enthält nun den eigenen bl31 und die übrigen Komponenten von uboot_legacy.img, wie beabsichtigt.

```text
cjh@ubuntu:~/uboot-nextdev$ ./scripts/fit-repack.sh -f uboot.img -d out/

uboot.img: Device Tree Blob version 17, size=2560, boot CPU=0, string block size=197,
DT structure block size=2204
Unpack to directory out/repack/:
  uboot               : 576352 bytes... sha256+
  atf-1               : 69089 bytes... sha256+
  atf-2               : 36864 bytes... sha256+
  atf-3               : 24576 bytes... sha256+
  optee               : 228134 bytes... sha256+
  fdt                 : 8867 bytes... sha256+
  ......
Image(repack):  uboot.img is ready
```

Prinzip: Nicht das eigene Subimage wird in das fremde uboot.img eingefügt, sondern die fremden Subimages in das eigene. atf-xxx stammt aus bl31.elf; unterschiedliche Versionen können unterschiedlich viele atf-xxx enthalten, was einen direkten Austausch verhindert. Obwohl die Anzahl von u-boot, bl32, mcu usw. fest ist, wird für bl31.elf diese umgekehrte Strategie genutzt. Sie gilt auch für andere Komponenten.

### 12.10 Sicherheitsprüfung Schritt für Schritt

1. In u-boot die passende configs/rxxxxx_defconfig öffnen und Folgendes wählen:

```text
// 必选。
CONFIG_FIT_SIGNATURE=y
CONFIG_SPL_FIT_SIGNATURE=y

// 可选。
CONFIG_FIT_ROLLBACK_PROTECT=y       // boot.img防回滚
CONFIG_SPL_FIT_ROLLBACK_PROTECT=y   // uboot.img防回滚
```

2. keys wie folgt erzeugen:

```text
mkdir -p keys
../rkbin/tools/rk_sign_tool kk --bits 2048 --out .
cp privateKey.pem keys/dev.key && cp publicKey.pem keys/dev.pubkey
openssl req -batch -new -x509 -key keys/dev.key -out keys/dev.crt
```

Hinweis: Diesen Schritt nur einmal ausführen und die Schlüssel sicher aufbewahren.

3. Bauen und signieren am Beispiel RV1126. Für andere Chips wie RK3566 rv1126 in den Befehlen durch rk3566 ersetzen:

```text
// Linux：拷⻉boot.img，recovery.img到u-boot⽂件下，执⾏下列脚本签名loader,uboot,boot,recovery，设
置uboot,boot,recovery的防版本回滚号，注意防版本回滚号依据需要配置
./make.sh rv1126 --spl-new --boot_img boot.img --recovery_img recovery.img --rollback-index-
uboot 1 --rollback-index-boot 2

// Android：签名loader,uboot，设置uboot的防版本回滚号，注意防版本回滚号依据需要配置
./make.sh rv1126 --spl-new --rollback-index-uboot 1
```

Falls beim Build Folgendes erscheint:

```text
Can't load XXXXXX//.rnd into RNG
```

Ausführen:

```text
touch ~/.rnd
```

4. Öffentlichen Schlüsselhash programmieren:

```text
// Linux：拷⻉boot.img，recovery.img到u-boot⽂件下，执⾏下列脚本签名loader,uboot,boot,recovery，设
置uboot,boot,recovery的防版本回滚号，注意防版本回滚号依据需要配置，使能烧写key hash
./make.sh rv1126 --spl-new --boot_img boot.img --recovery_img recovery.img --rollback-index-
uboot 1 --rollback-index-boot 2 --burn-key-hash

// Android：签名loader,uboot，设置uboot的防版本回滚号，注意防版本回滚号依据需要配置，使能烧写key hash
./make.sh rv1126 --spl-new --rollback-index-uboot 1 --burn-key-hash
```

Achtung: --burn-key-hash erst nach abgeschlossener Produktentwicklung und Validierung konfigurieren. Sonst wird Secure Boot aktiviert und während der Entwicklung kann nur noch signierte Firmware aktualisiert werden.

5. Weitere Android-Firmware signieren: siehe Rockchip_Developer_Guide_Secure_Boot_for_UBoot_Next_Dev_CN.md.

## 13 Schnellstart

### 13.1 Chipunterstützung

rv1126

### 13.2 Speicherunterstützung

eMMC; SPI NOR

### 13.3 BootROM-Unterstützung

Der BootROM-SPI-NOR-Treiber unterstützt das Laden nachfolgender Firmware im Vierleitungs-DMA-Modus. usbplug konfiguriert dies bereits beim Programmieren; kundenseitig ist nichts zusätzlich einzustellen. Für eMMC gibt es diese Optimierung derzeit nicht.

### 13.4 U-Boot-SPL-Unterstützung

U-Boot SPL unterstützt FIT-Schnellstart, Loader-Einstieg per Taste und Niedrigladezustandserkennung. Konfiguration:

```text
CONFIG_SPL_KERNEL_BOOT=y             // 开启快速开机功能
CONFIG_SPL_BLK_READ_PREPARE=y        // 开启预加载功能
CONFIG_SPL_MISC_DECOMPRESS=y         // 开启解压功能
CONFIG_SPL_ROCKCHIP_HW_DECOMPRESS=y
```

U-Boot SPL kann Firmware vorladen, während andere Programme ausgeführt werden. Derzeit dient dies vor allem ramdisk. Beispiel einer mit gzip komprimierten Ramdisk; Kompressionsbefehl:

```text
cat ramdisk | gzip -n -f -9 > ramdisk.gz
```

ITS-Konfiguration:

```text
ramdisk {
    data = /incbin/("./images-tb/ramdisk.gz");
    compression = "gzip"; // 压缩格式
    type = "ramdisk";
    arch = "arm";
    os = "linux";
    preload = <1>;        // 预加载标志
    comp = <0x5800000>;   // 加载地址
    load = <0x2800000>;   // 解压地址
    decomp-async;         // 异步解压
    hash {
        algo = "sha256";
        uboot-ignore = <1>; // 不做hash校验
    };
};
```

Firmware bauen, beispielsweise RV1126 eMMC:

```text
./make.sh rv1126-emmc-tb && ./make.sh --spl
```

### 13.5 MCU-Konfiguration

Die MCU unterstützt den Systemstart durch frühzeitige Initialisierung von ISP und anderen Modulen. Nach dem Start übernimmt der Kernel deren Kontrolle. Konfiguration in der jeweiligen Chipdatei unter rkbin/RKTRUST, Beispiel RV1126:

```text
[MCU]
MCU=bin/rv11/rv1126_mcu_v1.02.bin,0x108000,okay // 配置对应固件位置，启动地址和使能标志
```

MCU-Programmadresse:

```text
https://10.10.10.29/admin/repos/rtos/rt-thread/rt-thread-amp
https://10.10.10.29/admin/repos/rk/mcu/hal
```

Beim U-Boot-Build wird die MCU-Firmware in uboot.img gepackt. Beim Start liest und lädt SPL sie daraus.

### 13.6 Kernel-Unterstützung

Konfiguration:

```text
CONFIG_ROCKCHIP_THUNDER_BOOT=y           // 开启快速开机功能
CONFIG_ROCKCHIP_THUNDER_BOOT_MMC=y       // 开启⽀持emmc快速开机优化功能
CONFIG_ROCKCHIP_THUNDER_BOOT_SFC=y       // 开启⽀持spi nor快速开机优化功能
CONFIG_VIDEO_ROCKCHIP_THUNDER_BOOT_ISP=y // 开启⽀持ISP快速开机优化功能
```

Für Schnellstart passt SPL den Kernel-DTB nicht an die tatsächlichen Hardwareparameter an. Daher müssen memory sowie die ramdisk-Größen vor und nach der Dekompression selbst konfiguriert werden.

Einzelheiten: kernel/arch/arm/boot/dts/rv1126-thunder-boot.dtsi.

```text
memory: memory {
    device_type = "memory";
    reg = <0x00000000 0x20000000>; // 需要依据真实DDR容量预先定义，SPL不修正
};

reserved-memory {
    trust@0 {
        reg = <0x00000000 0x00200000>; // trust 空间
        no-map;
    };

    trust@200000 {
        reg = <0x00200000 0x00008000>;
    };

    ramoops@210000 {
        compatible = "ramoops";
        reg = <0x00210000 0x000f0000>;
        record-size = <0x20000>;
        console-size = <0x20000>;
        ftrace-size = <0x00000>;
        pmsg-size = <0x50000>;
    };

    rtos@300000 {
        reg = <0x00300000 0x00100000>; // 预留给⽤⼾端使⽤，没有使⽤可以删掉
        no-map;
    };

    ramdisk_r: ramdisk@2800000 {
        reg = <0x02800000 (48 * 0x00100000)>; // 解压源地址，可以依据实际⼤⼩进⾏更改
    };

    ramdisk_c: ramdisk@5800000 {
        reg = <0x05800000 (20 * 0x00100000)>; // 压缩源地址，可以依据实际⼤⼩进⾏更改
    };
};
```

eMMC-Konfiguration:

```text
/ {
        reserved-memory {
                mmc_ecsd: mmc@20f000 {
                        reg = <0x0020f000 0x00001000>; // SPL 给kernel上传ecsd区域
                };

                mmc_idmac: mmc@500000 {
                        reg = <0x00500000 0x00100000>; // 预加载ramdisk时，预留的idmac的内存区
域，预加载完成，该区域内存释放掉
                };
        };

        thunder_boot_mmc: thunder-boot-mmc {
                compatible = "rockchip,thunder-boot-mmc";
                reg = <0xffc50000 0x4000>;
                memory-region-src = <&ramdisk_c>;
                memory-region-dst = <&ramdisk_r>;
                memory-region-idmac = <&mmc_idmac>;
        };
};
```

SPI-NOR-Konfiguration:

```text
/ {
        thunder_boot_spi_nor: thunder-boot-spi-nor {
                compatible = "rockchip,thunder-boot-sfc";
                reg = <0xffc90000 0x4000>;
                memory-region-src = <&ramdisk_c>;
                memory-region-dst = <&ramdisk_r>;
        };
};
```

### 13.7 Schnellstartablauf

## 14 Plattformdefinitionen

### 14.1 ATF/OPTEE

1. ATF-/OPTEE-Mindestversionen für den U-Boot-Ladebereitschaftsmodus:

| Chip | Mindestversion |
| --- | --- |
| RV1108 | N/A |
| RK1808 | N/A |
| RK1806 | N/A |
| RK3036 | N/A |
| RK3128x | N/A |
| RK3126 | rk3126_tee_ta_v1.39.bin |
| RK322x | N/A |
| RK3288 | rk3288_tee_ta_v1.43.bin |
| RK3368 | rk3368h_bl31_v2.22.elf |
| RK3328 | N/A |
| RK3399 | rk3399_bl31_v1.32.elf |
| RK3399Pro | rk3399_bl31_v1.32.elf |
| RK3399Pro-npu | rk3399_bl31_v1.32.elf |
| RK3308 | rk3308_bl31_v2.00.elf<br>rk3308_bl31_aarch32_v2.20.elf |
| PX30 | px30_bl31_v1.05.elf |
| RK3326 | rk3326_bl31_v1.05.elf |
| RV1126/RV1109 | N/A |
| RK3568 | rk3588_bl31_v1.26.elf<br>rk3588_bl31_ultra_v2.06.elf |
| RK3566 | rk3588_bl31_v1.26.elf<br>rk3588_bl31_ultra_v2.06.elf |
| RK3588 | rk3588_bl31_v1.24.elf |
| RV1106/RV1103 | N/A |
| RK3528 | N/A |
| RK3562 | In-process |
| RK3576 | rk3576_bl31_v1.04.elf |
| RV1106B/RV1103B | N/A |
| RK3506 | In-process |

| Chip | Mindestversion |
| --- | --- |
| RV1126B | N/A |

### 14.2 Clock

1. Unterstützung der CPU-Frequenzerhöhung:

| Chip | Unterstützung | Anpassungen bei Frequenzerhöhung |
| --- | --- | --- |
| RV1108 | N/A | N/A |
| RK1808 | N/A | N/A |
| RK1806 | N/A | N/A |
| RK3036 | N/A | N/A |
| RK3128x | N/A | N/A |
| RK3126 | N/A | N/A |
| RK322x | N/A | N/A |
| RK3288 | N/A | N/A |
| RK3368 | N/A | N/A |
| RK3328 | N/A | N/A |
| RK3399 | N/A | N/A |
| RK3399Pro | N/A | N/A |
| RK3399Pro-npu | N/A | N/A |
| RK3308 | N/A | N/A |
| PX30 | Normaler clock | Spannung + Frequenz |
| RK3326 | Normaler clock | Spannung + Frequenz |
| RV1126/RV1109 | N/A | N/A |
| RK3568 | SCMI clock | Spannung + Frequenz |
| RK3566 | SCMI clock | Spannung + Frequenz |
| RK3588 | N/A | N/A |
| RV1106/RV1103 | N/A | N/A |
| RK3528 | SCMI clock | Spannung |
| RK3562 | SCMI clock | Spannung |
| RK3576 | N/A | N/A |
| RV1106B/RV1103B | N/A | N/A |
| RK3506 | N/A | N/A |
| RV1126B | N/A | N/A |

### 14.3 Defconfig

1. Plattform-defconfig-Unterstützung (maßgeblich ist das veröffentlichte SDK): [Chip]_defconfig oder [Chip].config sind gewöhnlich Vollfunktionsversionen; die übrigen dienen bestimmten Funktionen.

| Chip | defconfig | Unterstützt Kernel-dtb | Hinweise |
| --- | --- | --- | --- |
| RV1108 | evb-rv1108_defconfig | N | Allgemeine Version |
| RK1808 | rk1808_defconfig | Y | Allgemeine Version |
| RK1806 | rk1806_defconfig | Y | Allgemeine Version |
| RK3036 | rk3036_defconfig | Y | Allgemeine Version |
| RK3128x | rk3128x_defconfig | Y | Allgemeine Version |
| RK3126 | rk3126_defconfig | Y | Allgemeine Version |
| RK322x | rk322x_defconfig | Y | Allgemeine Version |
| RK3288 | rk3288_defconfig | Y | Allgemeine Version |
| RK3368 | rk3368_defconfig | Y | Allgemeine Version |
| RK3328 | rk3328_defconfig | Y | Allgemeine Version |
| RK3399 | rk3399_defconfig | Y | Allgemeine Version |
| RK3399Pro | rk3399pro_defconfig | Y | Allgemeine Version |
| RK3399Pro-npu | rknpu-lion_defconfig | Y | Allgemeine Version |
| RK3308 | rk3308_defconfig<br>rk3308-aarch32_defconfig | Y | Allgemeine Version<br>Unterstützt aarch32-Modus |
| PX30 | px30_defconfig | Y | Allgemeine Version |
| RK3326 | rk3326_defconfig<br>rk3326-aarch32_defconfig | Y | Allgemeine Version<br>Unterstützt aarch32-Modus |
| RV1126 | rv1126_defconfig<br>rv1126-ab.config<br>rv1126-spi-nor-tiny_defconfig<br>rv1126-ramboot.config<br>rv1126-usbplug.config<br>rv1126-dfu.config<br>rv1126-ipc.config | Y | Allgemeine Version<br>Allgemeine Version + A/B-Unterstützung<br>Spi Nor mit kleiner Kapazität<br>Ohne Speichergerät (RAM-Start)<br>usbplug-Funktion<br>Unterstützt dfu<br>Für ipc sdk |
| RV1126 | rv1126-emmc-tb.config<br>rv1126-lp3-emmc-tb.config<br>rv1126-spi-nor-tb.config | Y | eMMC+DDR3-Schnellstart<br>eMMC+LP3-Schnellstart<br>Spi-Nor+DDR3-Schnellstart |
| RK3568 | rk3568_defconfig<br>rk3568-dfu.config<br>rk3568-nand.config<br>rk3568-spl-spi-nand_defconfig<br>rk3568-aarch32.config<br>rk3568-usbplug.config | Y | Allgemeine Version<br>Unterstützt dfu<br>Unterstützt MLC/TLC/ eMMC<br>Spezieller SPI-nand-SPL<br>Unterstützt aarch32-Modus<br>Unterstützt usbplug-Modus |

| Chip | defconfig | Unterstützt Kernel-dtb | Hinweise |
| --- | --- | --- | --- |
| RK3566 | rk3566.config<br>rk3566-eink.config | Y | Allgemeine Version<br>E-Book-Version |
| RK3588 | rk3588_defconfig<br>rk3588-ramboot.config<br>rk3588-sata.config<br>rk3588-aarch32.config<br>rk3588-ipc.config | Y | Allgemeine Version<br>Ohne Speichergerät (RAM-Start)<br>Doppelspeicher unterstützt SATA-Start<br>Unterstützt aarch32-Modus<br>Für ipc sdk |
| RV1106/RV1103 | rv1106_defconfig<br>rv1106-emmc-tb_defconfig<br>rv1106-spi-nor-tb_defconfig<br>rv1106-spi-nor_defconfig<br>rv1106-display.config<br>rv1106-dfu.config<br>rv1106-ipc.config | Y | Allgemeine Version<br>eMMC-Schnellstart<br>Spi-Nor-Schnellstart<br>Spi Nor mit kleiner Kapazität<br>Startlogo-Unterstützung<br>Unterstützt dfu<br>Für ipc sdk |
| RK3528 | rk3528_defconfig | Y | Allgemeine Version |
| RK3562 | rk3562_defconfig | Y | Allgemeine Version |
| RK3576 | rk3576_defconfig<br>rk3576-usbplug.config<br>rk3576-car.config<br>rk3576-ab-car.config<br>rk3576-eink.config | Y | Allgemeine Version<br>Open-Source-usbplug<br>Fahrzeugversion<br>Fahrzeugversion mit ab-Unterstützung<br>E-Book-Version |
| RV1106B | rv1106b_defconfig<br>rv1106b-emmc-tb_defconfig<br>rv1106b-spi-nand-tb_defconfig | Y | Allgemeine Version<br>eMMC-Schnellstart<br>Spi-Nand-Schnellstart |
| RV1103B | rv1103b_defconfig<br>rv1103b-optee.config<br>rv1103b-spi-nor_defconfig | Y | Allgemeine Version<br>Unterstützt OP-TEE<br>Spi Nor mit kleiner Kapazität |
| RK3506 | rk3506_defconfig<br>rk3506_tb.config<br>rk3506-amp.config<br>rk3506b.config | Y | Allgemeine Version<br>Schnellstartversion<br>Für amp sdk<br>Nur für RK3506B |
| RV1126B | rv1126b_defconfig<br>rv1126b-usbplug.config<br>rv1126b-ipc.config<br>rv1126b-spi-nor_defconfig | Y | Allgemeine Version<br>Open-Source-usbplug<br>Für ipc sdk<br>Spi Nor mit kleiner Kapazität |

### 14.4 DFU

1. DFU-Unterstützung:

| Chip | defconfig |
| --- | --- |
| RV1108 | N/A |
| RK1808 | N/A |
| RK1806 | N/A |
| RK3036 | N/A |
| RK3128x | N/A |
| RK3126 | N/A |
| RK322x | N/A |
| RK3288 | N/A |
| RK3368 | N/A |
| RK3328 | N/A |
| RK3399 | N/A |
| RK3399Pro | N/A |
| RK3399Pro-npu | N/A |
| RK3308 | N/A |
| PX30 | N/A |
| RK3326 | N/A |
| RV1126/RV1109 | rv1126-dfu.config |
| RK3568 | N/A |
| RK3566 | N/A |
| RK3588 | rk3568-dfu.config |
| RV1106/RV1103 | rv1106-dfu.config |
| RK3528 | N/A |
| RK3562 | N/A |
| RK3576 | N/A |
| RV1106B/RV1103B | N/A |
| RK3506 | N/A |
| RV1126B | N/A |

### 14.5 Optee

1. Verwendbarkeit der OP-TEE-client-Schnittstelle je Plattform:

| API | RV1109/RV1126 | RK3566/RK3568 | RK3588 | RV1106/RV1103 | RK3528 | RK3562 | RK3576 | RV1106B/RV1103B | RK3506 | RV1126B | others |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| trusty_read_vbootkey_hash | √ | √ | √ | N/A | √ | √ | √ | √ | N/A | √ | √ |
| trusty_write_vbootkey_hash | √ | √ | √ | N/A | √ | √ | √ | √ | N/A | √ | √ |
| trusty_read_vbootkey_enable_flag | √ | √ | √ | N/A | √ | √ | √ | √ | N/A | √ | √ |
| trusty_write_oem_otp_key | √ | √ | √ | N/A | √ | √ | √ | √ | N/A | √ | N/A |
| trusty_oem_otp_key_is_written | √ | √ | √ | N/A | √ | √ | √ | √ | N/A | √ | N/A |
| trusty_set_oem_hr_otp_read_lock | N/A | N/A | √ | N/A | √ | √ | √ | N/A | N/A | √ | N/A |
| trusty_oem_otp_key_cipher | √ | √ | √ | N/A | √ | √ | √ | √ | N/A | √ | N/A |

## 15 Hinweise

### 15.1 SDK-Kompatibilität

#### 15.1.1 androidboot.mode-Kompatibilität

Bei SDK-Versionen vor Android 8.1 muss folgende U-Boot-Option aktiviert sein, damit Android regulär startet:

```text
CONFIG_RKIMG_ANDROID_BOOTMODE_LEGACY
```

Begründung siehe Commit:

```text
commit a7774f5911624928ed1d9cfed5453aab206c512e
Author: Zhangbin Tong <zebulun.tong@rock-chips.com>
Date:   Thu Sep 6 17:35:16 2018 +0800

    common: boot_rkimg: set "androidboot.mode=" as "normal" or "charger"

    - The legacy setting rule is deprecated(Android SDK < 8.1).
    - Provide CONFIG_RKIMG_ANDROID_BOOTMODE_LEGACY to enable legacy setting.

    Change-Id: I5c8b442b02df068a0ab98ccc81a4f008ebe540c1
    Signed-off-by: Zhangbin Tong <zebulun.tong@rock-chips.com>
    Signed-off-by: Joseph Chen <chenjh@rock-chips.com>
```

#### 15.1.2 misc-Kompatibilität

misc.img dient dem Austausch von Bootinformationen zwischen U-Boot und Android; Hauptinhalt ist der BCB (Bootloader Control Block). Historisch bedingt muss der BCB bei RK-SDKs mit Android &gt;=10.0 an Offset 0 der misc-Partition liegen, bei älteren Versionen an Offset 16 KB. Im ausgelieferten SDK ist keine Zusatzbehandlung nötig: U-Boot passt sich automatisch an. Das Mischen von misc.img aus unterschiedlichen SDKs kann dazu führen, dass Android ständig recovery startet.

## 16 Werkzeuge

Werkzeugpfade dieses Kapitels relativ zum U-Boot-Wurzelverzeichnis:

```text
./scripts/mkbootimg
./scripts/unpack_bootimg
./scripts/repack-bootimg
./scripts/unpack_resource.sh
./scripts/stacktrace.sh
./tools/patman/patman
./tools/buildman/buildman

../rkbin/tools/resource_tool
../rkbin/tools/loaderimage
../rkbin/tools/trust_merger
../rkbin/tools/boot_merger
```

### 16.1 trust_merger

Funktion: bl30-, bl31- und bl32-BIN einer 64-Bit-Plattform anhand einer INI zu trust.img packen. INI-Beispiel: RK3368TRUST.ini.

```text
[VERSION]
MAJOR=0                     ----主版本号
MINOR=1                     ----次版本号
[BL30_OPTION]               ----bl30，⽬前设置为mcu bin
SEC=1                       ----存在BL30 bin
PATH=tools/rk_tools/bin/rk33/rk3368bl30_v2.00.bin   ----指定bin路径
ADDR=0xff8c0000             ----固件DDR中的加载和运⾏地址
[BL31_OPTION]               ----bl31，⽬前设置为多核和电源管理相关的bin
SEC=1                       ----存在BL31 bin
PATH=tools/rk_tools/bin/rk33/rk3368bl31-20150401-v0.1.bin----指定bin路径
ADDR=0x00008000             ----固件DDR中的加载和运⾏地址
[BL32_OPTION]
SEC=0                       ----不存在BL32 bin
[BL33_OPTION]
SEC=0                       ----不存在BL33 bin
[OUTPUT]
PATH=trust.img [OUTPUT]     ----输出固件名字
```

Packbefehl:

```text
/*
 * @<sha>：可选。sha相关，参考make.sh
 * @<rsa>：可选。rsa相关，参考make.sh
 * @<size>：可选，格式：--size [KB] [count]。输出⽂件⼤⼩，省略时默认单份2M，打包2份
 * @[ini file]: 必选。ini⽂件
 */

./tools/trust_merger <sha> <rsa> <size> [ini file]
```

Beispiel:

```text
./tools/trust_merger --rsa 3 --sha 2 ./ RKTRUST/RK3399TRUST.ini
out:trust.img
merge success(trust.img)
```

Entpackbefehl:

```text
// @[input image]: 必选。⽤于解包的固件，⼀般是trust.img

./tools/trust_merger --unpack [input image]
```

Beispiel:

```text
./tools/trust_merger --unpack trust.img

File Size = 4194304
Header Tag:BL3X
Header version:256
Header flag:35
SrcFileNum:4
SignOffset:992
Component 0:
ComponentID:BL31
StorageAddr:0x4
ImageSize:0x1c0
LoadAddr:0x10000
Component 1:
ComponentID:BL31
StorageAddr:0x1c4
ImageSize:0x10
LoadAddr:0xff8c0000
Component 2:
ComponentID:BL31
StorageAddr:0x1d4
ImageSize:0x48
LoadAddr:0xff8c2000
Component 3:
ComponentID:BL32
StorageAddr:0x21c
ImageSize:0x2e0
LoadAddr:0x8400000
unpack success
```

### 16.2 boot_merger

Funktion: miniloader, DDR und USB plug anhand einer INI zur Loader-Firmware packen. INI-Beispiel: RK3288MINIALL.ini.

```text
[CHIP_NAME]
NAME=RK320A                 ----芯⽚名称：”RK”加上与maskrom约定的4B芯⽚型号
[VERSION]
MAJOR=2                     ----主版本号
MINOR=36                    ----次版本号
[CODE471_OPTION]            ----code471，⽬前设置为ddr bin
NUM=1
Path1=tools/rk_tools/bin/rk32/rk3288_ddr_400MHz_v1.06.bin
[CODE472_OPTION]            ----code472，⽬前设置为usbplug bin
NUM=1
Path1=tools/rk_tools/bin/rk32/rk3288_usbplug_v2.36.bin
[LOADER_OPTION]
NUM=2
LOADER1=FlashData           ----flash data，⽬前设置为ddr bin
LOADER2=FlashBoot           ----flash boot，⽬前设置为miniloader bin
FlashData=tools/rk_tools/bin/rk32/rk3288_ddr_400MHz_v1.06.bin
FlashBoot=tools/rk_tools/bin/rk32/rk3288_miniloader_v2.36.bin
[OUTPUT]                    ----输出⽂件名
PATH=rk3288_loader_v1.06.236.bin
```

Packbefehl:

```text
// @[ini file]: 必选。ini⽂件

./tools/boot_merger [ini file]
```

Beispiel:

```text
./tools/boot_merger ./RKBOOT/RK3399MINIALL.ini
out:rk3399_loader_v1.17.115.bin
fix opt:rk3399_loader_v1.17.115.bin
merge success(rk3399_loader_v1.17.115.bin)
```

Entpackbefehl:

```text
// @[input image]: 必选。⽤于解包的固件，⼀般是loader⽂件

./tools/boot_merger --unpack [input image]
```

Beispiel:

```text
./tools/boot_merger --unpack rk3399_loader_v1.17.115.bin
unpack entry(rk3399_ddr_800MHz_v1.17)
unpack entry(rk3399_usbplug_v1.15)
unpack entry(FlashData)
unpack entry(FlashBoot)
unpack success
```

### 16.3 loaderimage

Funktion: u-boot.bin zu uboot.img und TEE BIN einer 32-Bit-Plattform zu trust.img packen. U-Boot packen:

```text
/*
 * @[input bin]: 必选。bin源⽂件
 * @[output image]：必选。输出⽂件
 * @[load_addr]：必选。加载地址
 * @<size>：可选，格式：--size [KB] [count]。输出⽂件⼤⼩，省略时默认单份1M，打包4份
 */

./tools/loaderimage --pack --uboot [input bin] [output image] [load_addr] <size>
```

Beispiel:

```text
./tools/loaderimage --pack --uboot ./u-boot.bin uboot.img 0x60000000 --size 1024 2

 load addr is 0x60000000!
pack input u-boot.bin
pack file size: 701981
crc = 0xc595eb85
uboot version: U-Boot 2017.09-02593-gb6e59d9 (Feb 18 2019 - 13:58:53)
pack uboot.img success!
```

U-Boot entpacken:

```text
/*
 * @[input image]: 必选。解包源⽂件
 * @[output bin]: 必选。解包输出⽂件，任意名字均可
 */

./tools/loaderimage --unpack --uboot [input image] [output bin]
```

Beispiel:

```text
./tools/loaderimage --unpack --uboot uboot.img uboot.bin
unpack input uboot.img
unpack uboot.bin success!
```

trust packen:

```text
/*
 * @[input bin]: 必选。bin⽂件
 * @[output image]：必选。输出⽂件
 * @[load_addr]：必选。加载地址
 * @<size>：可选。格式：--size [KB] [count]，输出⽂件⼤⼩，省略时默认单份1M，打包4份
 */

./tools/loaderimage --pack --trustos [input bin] [output image] [load_addr] <size>
```

Beispiel:

```text
./tools/loaderimage --pack --trustos ./bin/rk32/rk322x_tee_v2.00.bin trust.img \
                       0x80000000  --size 1024 2

 load addr is 0x80000000!
pack input bin/rk32/rk322x_tee_v2.00.bin
pack file size: 333896
crc = 0x2de93b46
pack trust.img success!
```

trust entpacken:

```text
/*
 * @[input image]: 必选。解包源⽂件
 * @[output bin]: 必选。解包输出⽂件，任意名均可
 */

./tools/loaderimage --unpack --trustos [input image] [output bin]
```

Beispiel:

```text
./tools/loaderimage --unpack --trustos trust.img tee.bin
unpack input trust.img
unpack tee.bin success!
```

### 16.4 resource_tool

Funktion: Beliebige Ressourcendateien zu resource.img packen. Befehl:

```text
./tools/resource_tool [--pack] [--image=<resource.img>] <file list>
```

Beispiel:

```text
./scripts/resource_tool ./arch/arm/boot/dts/rk3126-evb.dtb logo.bmp logo_kernel.bmp
Pack to resource.img successed!
```

Entpackbefehl:

```text
./tools/resource_tool --unpack --image=<resource.img> [output dir]
```

Beispiel:

```text
./tools/resource_tool --unpack --image=resource.img ./out/

Dump header:
partition version:0.0
header size:1
index tbl:
        offset:1        entry size:1    entry num:3
Dump Index table:
entry(0):
        path:rk-kernel.dtb
        offset:4        size:33728
entry(1):
        path:logo.bmp
        offset:70       size:170326
entry(2):
        path:logo_kernel.bmp
        offset:403      size:19160
Unack resource.img to ./out successed!
```

### 16.5 mkimage

Funktion: Loader im SPL-Modus erzeugen. Der folgende Befehl erstellt das von Rockchip BootROM benötigte IDBLOCK-Format und ersetzt gleichzeitig die ersten 4 Byte von u-boot-tpl.bin durch die von BootROM geprüfte ID:

```text
./tools/mkimage -n rk3328 -T rksd -d tpl/u-boot-tpl.bin idbloader.img
```

Einzelheiten:

```text
./doc/mkimage.1
```

### 16.6 stacktrace.sh

Funktion: Aufrufstack analysieren. Siehe Kapitel zur RK-Architektur.

### 16.7 mkbootimg

Funktion: Firmware zu boot und recovery.img packen; die Quelldateien stammen aus Android. Beispiel:

```text
./scripts/mkbootimg --kernel zImage --second resource.img --ramdisk ramdisk.img --out
boot.img
```

### 16.8 unpack_bootimg

Funktion: boot und recovery.img entpacken; die Quelldateien stammen aus Android. Beispiel:

```text
./scripts/unpack_bootimg --boot_img boot.img --out out/
```

### 16.9 repack-bootimg

Funktion: Firmware in boot und recovery.img ersetzen. Beispiel:

```text
// 例如：只替换kernel
./scripts/repack-bootimg --boot_img boot.img --kernel zImage -o boot_repack.img

// 例如：只替换resource
./scripts/repack-bootimg --boot_img boot.img --second resource.img -o boot_repack.img
```

### 16.10 pack_resource.sh

Funktion: Ladebilder aus ./tools/images/ in resource.img packen. Beispiel:

```text
./scripts/pack_resource.sh resource.img

Pack ./tools/images/ & resource.img to resource.img ...
Unpacking old image(resource.img):
rk-kernel.dtb 1
Pack to resource.img successed!
Packed resources:
rk-kernel.dtb battery_1.bmp battery_2.bmp battery_3.bmp battery_4.bmp battery_5.bmp
battery_fail.bmp battery_0.bmp 8

resource.img is packed ready
```

### 16.11 buildman

Funktion: Stapel-Builds, besonders geeignet zur Prüfung, ob Änderungen einer Plattform andere Plattformen beeinflussen. Einzelheiten:

```text
./tools/buildman/README
```

Vor Verwendung von buildman den Toolchain-Pfad in ~/.buildman konfigurieren:

```text
[toolchain]
arm: ~/prebuilts/gcc/linux-x86/arm/gcc-linaro-6.3.1-2017.05-x86_64_arm-linux-gnueabihf/
aarch64: ~/prebuilts/gcc/linux-x86/aarch64/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-
gnu/
```

Typisches Beispiel: U-Boot für alle Rockchip-Plattformen bauen.

```text
./tools/buildman/buildman rockchip
```

Ideales Ergebnis:

```text
$ ./tools/buildman/buildman rockchip
boards.cfg is up to date. Nothing to do.
Building current source for 34 boards (4 threads, 1 job per thread)
   34    0    0 /34     evb-rk3326
```

Die erste Zahl zählt vollständig erfolgreiche Plattformen (grün), die zweite solche mit Warnungen (gelb), die dritte mit Buildfehlern (rot). Warnungen und Fehler werden im Terminal ausgegeben.

### 16.12 patman

Funktion: Python-Werkzeug, das andere Werkzeuge zum Prüfen und Einsenden von Patches aufruft, besonders hilfreich für U-Boot-/Kernel-Upstream. Hauptfunktionen: Patches anhand von Parametern automatisch formatieren; mit checkpatch prüfen;

Cover-letter, Patchversion und Versionsänderungen für die Upstream-Mailingliste aus Commitnachrichten extrahieren; change-id automatisch entfernen; Empfänger je Patch aus Maintainer- und Dateihistorie ermitteln; alle Patches gemäß ~/.gitconfig oder ./.gitconfig versenden. Einzelheiten:

```text
./tools/patman/README
```

Alle Befehlsoptionen mit -h anzeigen:

```text
$ patman -h
Usage: patman [options]

Create patches from commits in a branch, check them and email them as
specified by tags you place in the commits. Use -n to do a dry run first.

Options:
  -h, --help            show this help message and exit
  -H, --full-help       Display the README file
  -c COUNT, --count=COUNT
                        Automatically create patches from top n commits
  -i, --ignore-errors   Send patches email even if patch errors are found
  -m, --no-maintainers  Don't cc the file maintainers automatically
  -n, --dry-run         Do a dry run (create but don't email patches)
  -p PROJECT, --project=PROJECT
                        Project name; affects default option values and
                        aliases [default: u-boot]
  -r IN_REPLY_TO, --in-reply-to=IN_REPLY_TO
                        Message ID that this series is in reply to
  -s START, --start=START
                        Commit to start creating patches from (0 = HEAD)
  -t, --ignore-bad-tags
                        Ignore bad tags / aliases
  --test                run tests
  -v, --verbose         Verbose output of errors and warnings
  --cc-cmd=CC_CMD       Output cc list for patch file (used by git)
  --no-check            Don't check for patch compliance
  --no-tags             Don't process subject tags as aliaes
  -T, --thread          Create patches as a single thread
```

Typisches Beispiel: Die letzten 3 Patches einsenden.

```text
patman -t -c3
```

Bei checkpatch-Fehlern oder -Warnungen wird automatisch abgebrochen; den Patch korrigieren und erneut ausführen. Weitere häufige Optionen: -t — Text vor dem Doppelpunkt im Betreff gilt als TAG, den patman häufig nicht erkennt; dafür -t verwenden.

-i erlaubt die Einsendung trotz Warnungen, die bewusst nicht behoben werden, etwa Zeilen über 80 Zeichen. -s überspringt die obersten N Patches, wenn die gewünschten Patches nicht an der Spitze des aktuellen Baums liegen. -n prüft lediglich die neuesten Patches mit checkpatch, ohne sie zu senden. Schlüsselwörter in der Commitnachricht liefern patman (hier im Original patchman) die Daten für die Upstream-Mailingliste. Typischer Commit:

```text
commit 72aa9e3085e64e785680c3fa50a28651a8961feb
Author: Kever Yang <kever.yang@rock-chips.com>
Date:   Wed Sep 6 09:22:42 2017 +0800

    spl: add support to booting with OP-TEE

    OP-TEE is an open source trusted OS, in armv7, its loading and
    running are like this:
    loading:
    - SPL load both OP-TEE and U-Boot
    running:
    - SPL run into OP-TEE in secure mode;
    - OP-TEE run into U-Boot in non-secure mode;

    More detail:
    <https://github.com/OP-TEE/optee_os>
    and search for 'boot arguments' for detail entry parameter in:
    core/arch/arm/kernel/generic_entry_a32.S

    Cover-letter:
    rockchip: add tpl and OPTEE support for rk3229

    Add some generic options for TPL support for arm 32bit, and then
    and TPL support for rk3229(cortex-A7), and then add OPTEE support
    in SPL.

    Tested on latest u-boot-rockchip master.

    END

    Series-version: 4
    Series-changes: 4
    - use NULL instead of '0'
    - add fdt_addr as arg2 of entry

    Series-changes: 2
    - Using new image type for op-tee

    Change-Id: I3fd2b8305ba8fa9ea687ab7f3fd1ffd2fac9ece6
    Signed-off-by: Kever Yang <kever.yang@rock-chips.com>
```

Beim Versenden dieses Patches mit patman entsteht ein Cover-letter:

```text
[PATCH v4 00/11] rockchip: add tpl and OPTEE support for rk3229
```

Der Patchbetreff enthält Version und laufende Nummer innerhalb der Serie:

```text
[PATCH v4,07/11] spl: add support to booting with OP-TEE
```

Die Commitnachricht wurde aufbereitet: change-id und Cover-letter sind entfernt, version-changes in Informationen außerhalb des Haupttextes umgewandelt:

```text
OP-TEE is an open source trusted OS, in armv7, its loading and
running are like this:
loading:
- SPL load both OP-TEE and U-Boot
running:
- SPL run into OP-TEE in secure mode;
- OP-TEE run into U-Boot in non-secure mode;

More detail:
<https://github.com/OP-TEE/optee_os>
and search for 'boot arguments' for detail entry parameter in:
core/arch/arm/kernel/generic_entry_a32.S

Signed-off-by: Kever Yang <kever.yang@rock-chips.com>
---

Changes in v4:
- use NULL instead of '0'
- add fdt_addr as arg2 of entry

Changes in v3: None
Changes in v2:
- Using new image type for op-tee

 common/spl/Kconfig     |  7 +++++++
 common/spl/Makefile    |  1 +
 common/spl/spl.c       |  9 +++++++++
 common/spl/spl_optee.S | 13 +++++++++++++
 include/spl.h          | 13 +++++++++++++
 5 files changed, 43 insertions(+)
 create mode 100644 common/spl/spl_optee.S
```

Weitere Schlüsselwörter wie Series-prefix und Series-cc beschreibt README.

## 17 Anhang

### 17.1 Downloadadressen

#### 17.1.1 rkbin

Interne RK-Entwickler: In Gerrit nach rk/rkbin suchen. Externe Entwickler wählen entweder das vollständige RK-SDK oder GitHub: https://github.com/rockchip-linux/rkbin.

#### 17.1.2 GCC

Interne RK-Entwickler: In Gerrit nach gcc-linaro-6.3.1 suchen. Externe Entwickler: vollständiges RK-SDK oder Paket von der offiziellen Linaro-Website beziehen.

### 17.2 Begriffe

U-Boot: Universal Boot Loader. AOSP: Android Open-Source Project. AVB: Android Verified Boot. DTB: Device Tree Binary. DTS: Device Tree Source. Fastboot: ursprünglich Android-Firmwareaktualisierung, heute im Embedded-Bereich verbreitet. GPT: GUID Partition Table. MMC: Multi Media Card, einschließlich eMMC, SD usw. SPL: Secondary Program Loader. TPL: Tertiary Program Loader. DTB: Device-Tree-Blob. DTB: Device-Tree-Blob für Overlays (doppelte Bezeichnung aus dem Original beibehalten). DTC: Device-Tree-Compiler. DTO: Device-Tree-Overlay-Vorgang. DTS: Device-Tree-Quelldatei. FDT: Flattened Device Tree.

SCMI: System Control and Management Interfacee (Originalschreibweise).

{% endraw %}
