---
title: "Rockchip U-Boot Nextdev: загрузка, драйверы, SPL/TPL, FIT и проверка безопасности"
description: "Rockchip U-Boot Nextdev: загрузка, драйверы, SPL/TPL, FIT и проверка безопасности — V2.37.0."
translation_key: "157-rockchip-uboot-nextdev"
slug: "157-rockchip-uboot-nextdev"
lang: "ru"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, U-Boot, SPL, FIT]
excerpt: "Rockchip U-Boot Nextdev: загрузка, драйверы, SPL/TPL, FIT и проверка безопасности — V2.37.0."
---

{% raw %}

Полная техническая основа китайского V2.37.0 (314 страниц), сопоставленная с английским V2.37.0 (329 страниц). Справочник платформы ArmSoM: проверяйте конкретный SoC, питание/выводы платы, SDK/BSP, U-Boot Nextdev, DDR/Loader, ATF/OP-TEE и ядро. Поддержка всех плат не заявляется. Проверка на аппаратуре ArmSoM не выполнялась; результаты, вывод и операции — примеры исходника. Китайская версия использует китайские изображения, английская/русская/немецкая — английские.

> Запись, стирание, OTP/eFuse, ключи и блокировки могут быть необратимыми. Частоты/напряжения должны соответствовать номинальным ограничениям конкретного чипа и платы. Используйте только выделенные тестовые устройства с резервной копией и проверенным восстановлением. Никакие аппаратные команды или настройки безопасности здесь не выполнялись.

> Неясности исходника сохранены для проверки: CONFIG_ENV_IS_NOWHERE_XXX; повтор regulator-min-microvolt; имена rk3588 у RK3566/RK3568 в таблице 14.1; rk3568-dfu.config у RK3588 в таблице 14.4. Некоторые примеры содержат полноширинные точки с запятой, типографские кавычки и заполнители. Не считайте их готовым исполняемым кодом: сверяйте с исходниками конкретного SDK. См. редакторский журнал в репозитории.

[ArmSoM Docs](https://docs.armsom.org/) · [U-Boot](https://docs.u-boot.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

| Чип | Miniloader + RKIMG u-boot | SPL + FIT u-boot |
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

## 1 Основы

### 1.1 Feature

v2017(next-dev) — разработанная RK ветвь официального U-Boot v2017.09; поддерживает основные продаваемые чипы RK. Возможности: загрузка прошивок RK Android, Android AOSP и Linux Distro; предварительные загрузчики Rockchip miniloader и SPL/TPL; дисплеи LVDS, EDP, MIPI, HDMI, CVBS, RGB; загрузка с eMMC, NAND Flash, SPI NAND, SPI NOR, SD и USB; файловые системы FAT, EXT2, EXT4; таблицы разделов GPT и RK parameter; загрузочный логотип, анимация зарядки, контроль низкого заряда и питания; I2C, PMIC, CHARGE, FUEL GUAGE, USB, GPIO, PWM, GMAC, eMMC, NAND, прерывания; Vendor storage для пользовательских данных/настроек; программирование eMMC через USB gadget RockUSB и Google Fastboot; USB Mass storage, Ethernet, HID; динамический выбор DTB ядра по состоянию оборудования.

### 1.2 Version

У RK две версии U-Boot: старая v2014 (внутреннее имя rkdevelop) и новая v2017 (next-dev). Проверить v2017 можно двумя способами. Способ1: VERSION в корневом Makefile должен быть2017.

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

Способ2: первая обычная строка загрузочного вывода должна содержать U-Boot 2017.09.

```text
U-Boot 2017.09-01818-g11818ff-dirty (Nov 14 2019 - 11:11:47 +0800)
......
```

v2017 открыт и регулярно обновляется на GitHub: https://github.com/rockchip-linux/u-boot. Требуется ядро RK версии &gt;=4.4.

### 1.3 DM

DM (Driver Model) — стандартная модель device-driver U-Boot, очень похожая на модель ядра Linux. Модули v2017 также разрабатываются в рамках DM. Сначала рекомендуется изучить архитектуру и реализацию DM в README:

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

Кратко: uclass — модель класса устройств/драйверов; driver — драйвер; device — устройство. Основной код:

```text
./drivers/core/
```

### 1.4 Security

В ARM TrustZone U-Boot относится к Non-Secure World и не обращается напрямую к защищённой памяти, OTP, efuse и другим безопасным ресурсам; нужен посредник trust. Режим CPU U-Boot на RK:

```text
32位平台： Non-Secure PL1
64位平台： EL2(Always be Non-Secure)
```

### 1.5 Boot-order

У RK две схемы запуска в зависимости от открытости кода предыдущего Loader:

```text
// 前级loader闭源
BOOTROM => ddr bin => Miniloader => TRUST => U-BOOT => KERNEL
// 前级loader开源
BOOTROM => TPL => SPL => TRUST => U-BOOT => KERNEL
```

TPL соответствует ddr bin, SPL — miniloader. Комбинация TPL+SPL реализует функции закрытых RK ddr.bin+miniloader и взаимозаменяема с ними.

### 1.6 Driver-probe

Несмотря на модель device-driver, U-Boot при инициализации не запускает автоматически probe зарегистрированных устройств/драйверов, как ядро. Пользователь должен явно инициировать probe следующими интерфейсами:

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

Внутренний основной вызов этих интерфейсов:

```text
int device_probe(struct udevice *dev);  // 建议⽤⼾⼀定要了解内部实现！
```

### 1.7 Shell

Shell U-Boot называется CLI (в исходнике cmdline line interface). Пользователь создаёт собственные CMD. Помимо Shell, команды вызываются программно через run_command() и run_command_list().

```text
int run_command(const char *cmd, int flag)
int run_command_list(const char *cmd, int len, int flag)
```

### 1.8 Boot-Command

U-Boot загружает ядро командой CONFIG_BOOTCOMMAND. Перед CONFIG_BOOTCMD также выполняется предварительная CONFIG_PREBOOT, обычно пустая. Обе формы имени BOOTCOMMAND/BOOTCMD сохранены как в оригинале.

### 1.9 TPL/SPL/U-Boot-proper

Разные условия компиляции создают из одного кода TPL, SPL и U-Boot proper. TPL (Tiny Program Loader) и SPL (Secondary Program Loader) работают раньше U-Boot: TPL выполняется в SRAM и инициализирует DDR; SPL выполняется в DDR, делает lowlevel-инициализацию и загружает trust.img/uboot.img; U-Boot proper работает в DDR и загружает ядро.

Название U-Boot proper служит главным образом для отличия от SPL. Далее оно сокращено до U-Boot. Последовательность:

```text
BOOTROM => TPL(ddr bin) => SPL(miniloader) => TRUST => U-BOOT => KERNEL
```

Подробнее: doc/README.TPL и doc/README.SPL.

### 1.10 Build-Output

После успешной сборки важные файлы создаются в корневом каталоге. TPL/SPL-файлы появляются только при поддержке их сборки:

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

ENV (Environment-Variables) — глобальный механизм управления/передачи данных через хеш-таблицу пар ключ–данные. Обычно задаёт адреса загрузки, сеть (ipaddr, serverip), bootcmd, bootargs и другие параметры. printenv выводит их в консоли. Пользователь выбирает, сохранять ли ENV на носителе. Данные предназначены только для U-Boot, не передаются ядру напрямую и не разбираются им. Userspace обращается через fw_printenv. Адрес и размер хранения на RK (байты):

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

U-Boot имеет собственный DTS. При сборке создаётся DTB и добавляется в конец u-boot.bin. Каталог:

```text
arch/arm/dts/
```

DTS платформы выбирает CONFIG_DEFAULT_DEVICE_TREE в defconfig.

### 1.13 Relocation

Предыдущий загрузчик обычно размещает U-Boot в нижних адресах DRAM. После board_f.c U-Boot переносится в зарезервированную область у конца памяти (relocation, адрес зависит от карты памяти), затем выполняет board_r.c. Это видно по загрузочному выводу:

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

## 2 Архитектура RK

В этой главе описаны важные основы и возможности платформ RK.

### 2.1 Введение

Во всём документе включение/выключение CONFIG_ означает make menuconfig, кроме специальных CONFIG_, определённых непосредственно в .h. Не меняйте CONFIG_ напрямую в defconfig: зависимости Kconfig могут помешать применению .config. Обновляйте defconfig через make savedefconfig.

### 2.2 Файлы платформы

Каталоги платформы:

```text
./arch/arm/include/asm/arch-rockchip/
./arch/arm/mach-rockchip/
./board/rockchip/
./include/configs/
```

Каталог defconfig:

```text
./configs/
```

Основной общий файл платы:

```text
./arch/arm/mach-rockchip/board.c
```

### 2.3 Конфигурация платформы

Конфигурационные файлы: параметры платформ обычно находятся здесь:

```text
// 各平台公共⽂件（开发者通常不需要修改）
./arch/arm/mach-rockchip/Kconfig
./include/configs/rockchip-common.h

// 各平台独有，以RK3399为例
./include/configs/rk3399_common.h
./include/configs/evb_rk3399.h
./configs/rk3399_defconfig
```

Важные определения rockchip-common.h, rkxxx_common.h, evb_rkxxx.h: RKIMG_DET_BOOTDEV — последовательное обнаружение типа текущего накопителя; RKIMG_BOOTCOMMAND — команда загрузки ядра; ENV_MEM_LAYOUT_SETTINGS — адреса ramdisk/fdt/kernel; PARTS_DEFAULT — GPT по умолчанию, используемая в некоторых случаях без действительной GPT на носителе; ROCKCHIP_DEVICE_SETTINGS — команды периферии, прежде всего stdio (обычно включает запуск дисплея); BOOTENV — обнаружение загрузочного устройства Linux Distro; CONFIG_SYS_MALLOC_LEN — размер пула malloc; CONFIG_SYS_TEXT_BASE — начальный адрес U-Boot; CONFIG_BOOTCOMMAND — команда загрузки, обычно RKIMG_BOOTCOMMAND; CONFIG_PREBOOT — команда перед CONFIG_BOOTCOMMAND; CONFIG_SYS_MMC_ENV_DEV — номер MMC-устройства хранения ENV, обычно0. Пример RK3399, ./include/configs/rockchip-common.h:

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

### 2.4 Процесс загрузки

Основные этапы загрузки U-Boot на RK:

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

### 2.5 Карта памяти

Предыдущий Loader загружает U-Boot по CONFIG_SYS_TEXT_BASE. Инициализация определяет общую память: 32-битная платформа считает доступными максимум4GB (это не ограничивает определение памяти ядром), 64-битная — всю память. reserve_xxx() резервируют области от конца к началу; затем U-Boot перемещается в одну из них. Типичная карта ARM64:

| Name | Start Addr Offset | Size | Usage | Secure |
| --- | --- | --- | --- | --- |
| ATF | 0x00000000 | 1M | ARM Trusted Firmware | Yes |
| SHM | 0x00100000 | 1M | SHM, Pstore | No |
| OP-TEE | 0x08400000 | 2M~30M | См. руководство разработчика TEE | Yes |
| FDT | fdt_addr_r | - | kernel dtb | No |
| KERNEL | kernel_addr_r | - | образ kernel | No |
| RAMDISK | ramdisk_addr_r | - | образ ramdisk | No |
| ...... | - | - | - | - |
| FASTBOOT | - | - | Fastboot buffer | No |
| ...... | - | - | - |  |
| SP | - | - | stack | No |
| FDT | - | sizeof(dtb) | U-Boot dtb | No |
| GD | - | sizeof(gd) | - | No |
| Board | - | sizeof(bd_t) | - | No |
| MALLOC | - | CONFIG_SYS_MALLOC_LEN | Куча системы | No |
| U-Boot | - | sizeof(mon) | образ u-boot | No |
| Video FB | - | fb size | 32M | No |
| TLB Table | RAM_TOP-64K | 32K | Таблица страниц MMU | No |

Start Addr Offset — смещение от базы DDR. Адрес/размер Fastboot определяются CONFIG_FASTBOOT_BUF_ADDR/CONFIG_FASTBOOT_BUF_SIZE. Video FB/U-Boot/Malloc/Board/Gd/Fdt/Sp выделяются сверху вниз по требуемому размеру. Для64бит ATF обязателен в ARMv8, OP-TEE необязателен; для32бит есть только OP-TEE. kernel fdt/kernel/ramdisk — загружаемые адреса из ENV_MEM_LAYOUT_SETTINGS. Буфер Fastboot задаётся в defconfig. OP-TEE занимает до30M по потребности; на RK1808/RK3308 находится в нижних адресах, не0x8400000.

### 2.6 Размещение в хранилище

Ниже карта носителя RK Linux. Android отличается главным образом boot/rootfs; остальное почти совпадает и служит ориентиром.

![Рисунок 1: английский оригинал, с. 28](/docs/rockchip-uboot-nextdev/assets/en-p028-figure-01.png)

*Рисунок 1: английский оригинал, с. 28*

Источник изображения: http://opensource.rock-chips.com/wiki_Partitions

### 2.7 Aliases

Некоторые aliases U-Boot отличаются от DTS ядра. eMMC/SD называются mmc и различаются номерами0/1; приоритет загрузки SD выше eMMC.

```text
mmc1：表⽰sd
mmc0：表⽰emmc
```

### 2.8 AMP

RK U-Boot поддерживает запуск AMP (Asymmetric Multi-Processing). См. главу драйверных модулей.

### 2.9 Atags

Последовательность загрузки RK:

```text
BOOTROM => ddr-bin => Miniloader => TRUST => U-BOOT => KERNEL
```

ATAGS передаёт конфигурацию между ddr-bin, miniloader, trust и U-Boot, но не ядром. Данные: UART, тип носителя, память ATF/OP-TEE, объём DDR и другие.

Реализация:

```text
./arch/arm/include/asm/arch-rockchip/rk_atags.h
./arch/arm/mach-rockchip/rk_atags.c
```

### 2.10 Bidram/sysmem

U-Boot использует всю память и резервирует системные области от высоких адресов к низким. Остаётся значительное свободное пространство без собственного механизма управления U-Boot. RK ввёл bidram и sysmem для этих блоков. Вместе с malloc они управляют всей памятью и предотвращают конфликты.

```text
low-addr                                                                    high-addr
|-----------------------------------------------------------|-----------------|
|             no management                                 | system used     |
|-----------------------------------------------------------|-----------------|
0x0                                                                          N GB
```

bidram управляет исключаемыми блоками, недоступными U-Boot и ядру, например ATF/OP-TEE. sysmem управляет видимой ядру памятью, например fdt/ramdisk/kernel/fastboot. Код:

```text
./lib/sysmem.c
./lib/bidram.c
./include/memblk.h
./arch/arm/mach-rockchip/memblk.c
```

При ошибке инициализации/выделения блоков выводятся таблицы bidram/sysmem. Сначала таблица bidram:

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

Таблица памяти sysmem:

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

Распространённые сообщения об ошибках ниже анализируйте вместе с таблицами bidram/sysmem.

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

Для отладки RK secure-boot можно включить только подписью прошивки без программирования efuse/OTP. Miniloader через U-Boot добавляет в cmdline ядра состояние: fuse.programmed=1 — secure-boot включён и efuse/OTP записаны; fuse.programmed=0 — включён, но не записаны. Отсутствие fuse.programmed означает выключенный secure-boot либо старый Miniloader без передачи параметра. U-Boot должен содержать следующий коммит:

```text
83c9bd4 board: rockchip: pass fuse programmed state to kernel
```

### 2.12 Hotkey

Комбинации UART вызывают отладку/прошивку; при неудаче повторите, с secure-boot они не действуют. Удерживайте при включении: ctrl+c — консоль U-Boot; ctrl+d — Loader; ctrl+b — Maskrom; ctrl+f — Fastboot; ctrl+m — bidram/system; ctrl+i — initcall_debug ядра; ctrl+p — cmdline; ctrl+s — консоль U-Boot после Starting kernel....

### 2.13 Image Decompress

64-битные системы обычно используют Image, загружаемый U-Boot на целевой адрес исполнения. RK U-Boot также распаковывает64-битное ядро LZ4, если включено:

```text
CONFIG_LZ4=y
```

Адреса до/после распаковки64-битного LZ4-ядра задайте в rkxxx_common.h платформы:

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

32-битные системы обычно используют zImage: U-Boot загружает по kernel_addr_r, затем ядро распаковывается само. RK U-Boot также поддерживает Image, загружаемый сразу на адрес исполнения. Сейчас rkxxx_common.h задаёт kernel_addr_r, но не kernel_addr_c. Менять это не требуется: U-Boot различает zImage/Image и динамически обрабатывает адреса. Однако отключите:

```text
CONFIG_SKIP_RELOCATE_UBOOT
```

Адрес загрузки32-битного ядра:

```text
#define ENV_MEM_LAYOUT_SETTINGS \
    "scriptaddr=0x60000000\0" \
    "pxefile_addr_r=0x60100000\0" \
    "fdt_addr_r=0x68300000\0" \
    "kernel_addr_r=0x62008000\0" \       // zImage压缩内核的地址
    "ramdisk_addr_r=0x6a200000\0"
```

### 2.14 Image kernel

RK U-Boot lädt drei Kernelformate. RK-Image hat Magic KRNL:

```text
00000000   4B 52 4E 4C  42 97 0F 00  1F 8B 08 00  00 00 00 00  KRNL..y.........
00000010   00 03 A4 BC  0B 78 53 55  D6 37 BE 4F  4E D2 A4 69  .....xSU.7.ON..i
```

kernel.img = kernel;resource.img = dtb + logo.bmp + logo_kernel.bmp;

boot.img = ramdisk; recovery.img = ramdisk(for recovery). Magic Android-образа — ANDROID!:

```text
00000000   41 4E 44 52  4F 49 44 21  24 10 74 00  00 80 40 60  ANDROID!$.t...@`
00000010   F9 31 CD 00  00 00 00 62  00 00 00 00  00 00 F0 60  .1.....b.......`
```

boot.img = kernel + ramdisk+ resource + &lt;dtb&gt;;recovery.img = kernel + ramdisk(for recovery) + resource + &lt;recovery_dtbo&gt; + &lt;dtb&gt;;

recovery_dtbo добавлен в Android9.0, dtb — в Android10.0. Distro — распространённая открытая Linux-упаковка ramdisk, dtb и kernel в один образ, обычно с ext2/ext4/FAT. Для доступа U-Boot использует файловую систему. Подробнее:

```text
./doc/README.distro
./include/config_distro_defaults.h
./include/config_distro_bootcmd.h
```

Приоритет android &gt; rk &gt; distro. Команды каждого формата выполняются по очереди до успешной загрузки; если все неудачны, остаётся консоль U-Boot. Определение приоритета:

```text
#define RKIMG_BOOTCOMMAND \
    "boot_android ${devtype} ${devnum};" \
    "bootrkp;" \
    "run distro_bootcmd;"
```

### 2.15 Image U-Boot

U-Boot/trust имеют форматы RK и FIT, загружаемые соответственно Miniloader и SPL. В SDK граница — RV1126: начиная с него FIT, ранее RK. RK — собственный формат Rockchip: U-Boot упакован в uboot.img, trust в trust.img. Magic uboot.img и32-битного trust.img — LOADER:

```text
00000000  4c 4f 41 44 45 52 20 20  00 00 00 00 00 00 00 00  |LOADER  ........|
00000010  00 00 20 00 78 d0 0f 00  06 99 c2 a8 20 00 00 00  |.. .x....... ...|
00000020  09 8a b0 e1 89 7a c2 89  0d e8 da ef 86 3e f2 24  |.....z.......>.$|
```

Magic64-битного trust.img — BL3X:

```text
00000000  42 4c 33 58 00 01 00 00  23 00 00 00 f8 00 04 00  |BL3X....#.......|
00000010  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
```

FIT — гибкий формат основного U-Boot. U-Boot, trust, MCU и другие компоненты упакованы вместе в uboot.img. Magic — d0 0d fe ed; fdtdump uboot.img показывает заголовок.

```text
00000000  d0 0d fe ed 00 00 06 00  00 00 00 58 00 00 04 c4  |...........X....|
00000010  00 00 00 28 00 00 00 11  00 00 00 10 00 00 00 00  |...(............|
```

Подробнее в главе FIT. Резервные копии: uboot.img и trust.img обычно содержат несколько копий для защиты от повреждения при отключении питания во время OTA и подобных ситуациях.

| Прошивка | Размер копии | Число упакованных копий |
| --- | --- | --- |
| RK uboot.img | 1MB | 4 |
| RK 32-битный trust.img | 1MB | 4 |
| RK 64-битный trust.img | 2MB | 2 |
| FIT uboot.img | 2MB | 2 |

По таблице uboot.img/trust.img по умолчанию4MB. Для RK измените число/размер копий параметрами сборки: --sz-uboot 2048 1 даёт одну2M-копию uboot.img; --sz-trust 4096 1 — одну4M-копию trust.img. Для FIT задайте CONFIG_SPL_FIT_IMAGE_KB (размер одной копии, KB) и CONFIG_SPL_FIT_IMAGE_MULTIPLE (число). SPL определяет положения и число копий по этим параметрам. После их изменения обязательно добавьте --spl-new к make.sh: Loader получит свежесобранный SPL. Иначе пакуется SPL из rkbin, по умолчанию ищущий2MB*2 копии. Исходник здесь называет файл u-boo-spl.bin; написание сохранено как исходное.

### 2.16 Interrupt

Исходный U-Boot не имеет полной поддержки прерываний; RK дополнил GIC-V2/V3. См. главу драйверов.

### 2.17 Kernel-DTB

Исходный U-Boot использует только собственный DTB. RK добавил Kernel DTB для инициализации периферии с учётом различий плат: питания, тактов, дисплея. U-Boot DTB инициализирует носитель и UART вывода; Kernel DTB — остальные устройства. Сначала U-Boot использует свой DTB, затем загружает Kernel DTB с носителя и продолжает инициализацию. Реализация init_kernel_dtb(). Обычно менять U-Boot DTB не нужно, кроме смены UART; defconfig SDK уже включает механизм. Для периферии меняйте Kernel DTB. Каталог U-Boot DTS:

```text
./arch/arm/dts/
```

При Kernel DTB сборка выбирает узлы U-Boot DTS с u-boot,dm-pre-reloc и u-boot,dm-spl, затем удаляет свойства из CONFIG_OF_SPL_REMOVE_PROPS в defconfig. Полученный u-boot.dtb добавляется к концу u-boot.bin. Проверка через fdtdump:

```text
fdtdump ./u-boot.dtb | less
```

Подробнее в главе углублённых принципов.

### 2.18 MMU Cache

RK по умолчанию включает MMU, Dcache и Icache. MMU линейно отображает1:1; Dcache использует write-back. Интерфейсы:

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

make.sh — скрипт сборки, упаковки и отладки, включая дизассемблирование и упаковку прошивки.

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

RK U-Boot выбирает из нескольких DTB подходящий по аппаратному состоянию GPIO/ADC. См. главу системных модулей.

### 2.21 Partition Table

Поддерживаются старая RK parameter и новая стандартная GPT. При наличии обеих GPT приоритетна. Файл программирования в обоих случаях parameter.txt; TYPE: GPT отличает GPT.

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

После board_f.c U-Boot перемещается к концу памяти по адресу карты памяти. По умолчанию RK:32бит без relocation при CONFIG_SKIP_RELOCATE_UBOOT=y, иначе с relocation;64бит всегда с relocation.

### 2.23 Reset

Сброс, как в ядре, выполняется через trust. Консоль U-Boot поддерживает reboot xxx аналогично ядру, в зависимости от Kernel DTS.

### 2.24 Sd/Udisk

RK U-Boot поддерживает загрузку/обновление с SD и USB. SD поддерживается с BootROM, USB — с U-Boot. См. главу системных модулей.

### 2.25 Stacktrace

RK добавил отсутствовавшую в оригинале обратную трассировку. Три запуска: автоматически при сбое; явный dump_stack(); CONFIG_ROCKCHIP_DEBUGGER. Пример abort:

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

Скопируйте трассировку в любой txt-файл, например dump.txt, затем выполните:

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

Есть три команды преобразования; выбирайте по инструкции после вывода трассировки.

```text
./scripts/stacktrace.sh ./dump.txt        // 解析来⾃U-Boot的调⽤栈信息
./scripts/stacktrace.sh ./dump.txt tpl    // 解析来⾃tpl的调⽤栈信息
./scripts/stacktrace.sh ./dump.txt spl    // 解析来⾃spl的调⽤栈信息
```

Прошивка устройства должна соответствовать текущему дереву кода, иначе преобразование даст неверный результат.

### 2.26 TimeCost

После инициализации U-Boot по умолчанию показывает общее время этапа:

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

Включите debug() и DEBUG в lib/initcall.c для времён отдельных этапов. Адреса функций можно дизассемблировать через ./make.sh.

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

Ядро по умолчанию выводит временные отметки, U-Boot — нет. При необходимости включите CONFIG_BOOTSTAGE_PRINTF_TIMESTAMP:

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

Отметка времени относительная, не абсолютная.

### 2.28 Vendor storage

Vendor storage RK U-Boot хранит пользовательские SN, MAC и другие данные. Смещения (см. vendor.c):

```text
#define EMMC_VENDOR_PART_OFFSET     (1024 * 7)
/* --- Spi Nand/SLC/MLC large capacity case define --- */
#define NAND_VENDOR_PART_OFFSET     0
/* --- Spi/Spi Nand/SLC/MLC small capacity case define --- */
#define FLASH_VENDOR_PART_OFFSET    8
......
```

Обычно смещения менять не требуется; используйте интерфейсы чтения/записи:

```text
int vendor_storage_read(u16 id, void *pbuf, u16 size)
int vendor_storage_write(u16 id, void *pbuf, u16 size)
```

## 3 Сборка и запись

### 3.1 Подготовка

Загрузите rkbin — репозиторий закрытых RK-бинарников, скриптов и инструментов упаковки. U-Boot берёт файлы оттуда для loader/trust/uboot. rkbin и U-Boot должны быть соседними каталогами; ссылки см. в приложении. Компилятор gcc-linaro-6.3.1 разместите в prebuilts, также рядом с U-Boot:

```text
// 32位：
prebuilts/gcc/linux-x86/arm/gcc-linaro-6.3.1-2017.05-x86_64_arm-linux-gnueabihf
// 64位：
prebuilts/gcc/linux-x86/aarch64/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu/
```

GCC: ссылки в приложении. defconfig: глава определения платформ. Разные продукты одной платформы требуют config fragments, поддерживаемых с RV1126 как наложение на defconfig. Например, rv1126-emmc-tb.config задаёт CONFIG_BASE_DEFCONFIG="rv1126_defconfig". ./make.sh rv1126-emmc-tb сначала создаёт .config из rv1126_defconfig, затем накладывает rv1126-emmc-tb.config. Эквивалентные команды:

```text
make rv1126_defconfig rv1126-emmc-tb.config && make
```

Обновление config fragment выполняет ./scripts/sync-fragment.sh, например:

```text
./scripts/sync-fragment.sh configs/rv1126-emmc-tb.config
```

Команда записывает различия текущего .config и rv1126_defconfig в rv1126-emmc-tb.config.

### 3.2 Сборка прошивки

Команда сборки:

```text
./make.sh [board]               // [board]：configs/[board]_defconfig⽂件。
```

Первая сборка либо смена defconfig требует [board] на32- и64-битных платформах:

```text
./make.sh rk3399                // build for rk3399_defconfig
./make.sh evb-rk3399            // build for evb-rk3399_defconfig
./make.sh firefly-rk3288        // build for firefly-rk3288_defconfig
```

Повторная сборка по текущему .config не требует [board] независимо от разрядности:

```text
./make.sh
```

При необычных ошибках попробуйте make distclean и повторите сборку. После неё в корне U-Boot упаковываются trust, uboot, loader. Вывод упаковки:

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

Готовые для программирования файлы в корне:

```text
./uboot.img
./trust.img    // 注意：如果是fit格式的固件，则没有trust.img。trust的⼆进制被打包在uboot.img⾥。
./rk3126_loader_v2.09.247.bin
```

Инструменты упаковки: глава инструментов.

### 3.3 Запись прошивки

Для Windows/Linux рекомендуется версия программатора из SDK либо актуальная. У RK два режима: Maskrom и Loader (U-Boot).

1. Loader: удерживайте громкость+ при включении, либо ctrl+d на хосте; в консоли U-Boot — download или rockusb 0 $devtype $devnum.

2. Maskrom: удерживайте ctrl+b на хосте при включении либо выполните rbrom в консоли U-Boot. При смене RK parameter на GPT или обратно NAND требует перепрошивки всего комплекта; eMMC допускает отдельную замену таблицы. При наличии обеих таблиц приоритетна GPT. Определение по загрузочному выводу:

```text
...
PartType: EFI // 当前为GPT分区表，否则打印"PartType: RKPARM"
...
```

### 3.4 Размер прошивки

См. RK-архитектура → Image U-Boot.

### 3.5 Специальная упаковка

./make.sh также предоставляет отдельные команды упаковки. Требуется хотя бы одна завершённая сборка U-Boot. Формат не FIT:

```text
./make.sh trust              // 打包trust
./make.sh loader             // 打包loader
./make.sh trust <ini-file>   // 打包trust时指定ini⽂件，否则使⽤默认ini⽂件
./make.sh loader <ini-file>  // 打包loader时指定ini⽂件，否则使⽤默认ini⽂件
```

Формат FIT:

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

Если новые команды работают, используется новый make.sh.

## 4 Системные модули

### 4.1 AArch32

64-битный процессор ARMv8 может переходить из AArch64 в режим AArch32, совместимый с ARMv7; код должен быть собран как 32-битный. Следующий макрос позволяет определить текущий режим AArch32 ARMv8:

```text
CONFIG_ARM64_BOOT_AARCH32=y
```

### 4.2 ANDROID AB

В A/B System имеются две копии системной прошивки: slot-a и slot-b. Загрузка возможна из любого слота; при отказе одного можно загрузиться из другого. Обновление записывается непосредственно в другой слот без перехода в режим обновления системы. Подробные принципы и последовательность приведены в главе об углублённых принципах. На платформах RK A/B поддерживают pre-loader и U-Boot.

#### 4.2.1 Параметры конфигурации

A/B System зависит от LIBAVB:

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

#### 4.2.2 Таблица разделов

Таблица разделов A/B System требует суффиксов _a и _b у каждого раздела с поддержкой A/B. Пример parameter.txt:

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

#### 4.2.3 Предостережения

В старом U-Boot после включения A/B при обращении к A/B-разделам имя, передаваемое part_get_info_by_name(), обязательно содержало суффикс слота, например "boot_a" или "boot_b". Это порождало избыточный код: сначала определялся текущий слот, затем объединялись строки для получения имени раздела. После приведённого ниже коммита суффикс при обращении к A/B-разделу необязателен: инфраструктура автоматически определяет текущий слот. Поэтому в этом примере можно непосредственно использовать "boot".

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

BCB (Bootloader Control Block) — механизм взаимодействия Android с загрузчиком для управления загрузкой системы. Структура данных находится в разделе misc по смещению 16KB или 0. Структура:

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

command: команда загрузки; поддерживаются следующие три:

| Параметр | Функция |
| --- | --- |
| bootonce-bootloader | Загрузка U-Boot fastboot |
| boot-recovery | Загрузка recovery |
| boot-fastboot | Загрузка recovery fastboot (fastbootd) |

recovery: дополнительные команды для входа в recovery mode. Строка начинается с "recovery\n"; за ней могут следовать несколько параметров, начинающихся с "--" и заканчивающихся "\n", например: "recovery\n--wipe_ab\n--wipe_package_size=345\n--reason=wipePackage\n".

| Параметр | Функция |
| --- | --- |
| update_package | Обновление OTA |
| retry_count | Число попыток обновления recovery; при потере питания по этому значению повторно входят в recovery |
| wipe_data | Стереть данные пользователя и кеш, затем перезагрузить |
| wipe_cache | Стереть кеш, но не данные пользователя, затем перезагрузить |
| show_text | Показать текстовое меню recovery; используется некоторыми загрузчиками |
| sideload |  |
| sideload_auto_reboot | Только в user-debug: перезагрузить устройство без ожидания |
| just_exit | Ничего не делать, выйти и перезагрузить |
| locale | Сохранить локаль в кеше для загрузки recovery при перезапуске |
| shutdown_after | Вернуть shutdown |
| wipe_all | Стереть весь раздел userdata |
| wipe_ab | Стереть текущее устройство A/B с безопасным стиранием всех разделов RECOVERY_WIPE |
| wipe_package_size | Размер пакета стирания |
| prompt_and_wipe_data | Сообщить о повреждении данных; с согласия пользователя стереть данные и кеш, перезагрузить |
| fw_update | Обновление прошивки с SD |
| factory_mode | Заводской режим для тестов устройства, например PCBA |
| pcba_test | Войти в тест PCBA |
| resize_partition | Изменить размеры разделов; поддержка динамических разделов Android Q |
| rk_fwupdate | Выбрать обновление RK SD/USB, только в U-Boot |

На стадии U-Boot эти параметры обычно не используются; они приведены для ознакомления.

### 4.4 Безопасная загрузка AVB

AVB (Android Verified Boot) — разработанная Google процедура проверки прошивок, главным образом boot, system и других образов. Rockchip Secure Boot использует способы проверки из коммуникационных систем и AVB для реализации полной схемы проверки Secure Boot.

#### 4.4.1 Feature

- Проверка безопасности.
- Проверка целостности.
- Защита от отката.
- Поддержка persistent partition.
- Поддержка chained partitions: закрытый ключ может совпадать с ключом подписи boot и system либо храниться у OEM, но подпись PRK обязательна.

#### 4.4.2 Конфигурация

Для включения AVB требуется поддержка в trust:

```text
CONFIG_OPTEE_CLIENT=y
CONFIG_OPTEE_V1=y
CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION=y  // 安全数据存储到security分区
```

CONFIG_OPTEE_V1: платформы 312x, 322x, 3288, 3228H, 3368, 3399.

CONFIG_OPTEE_V2: платформы 3326, 3308.

CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION включают только при невозможности использовать RPMB eMMC; по умолчанию выключено. Включите настройки AVB:

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

#### 4.4.3 Ссылки

Дополнительные принципы и настройки AVB, охватывающего обширную тему, приведены в главе об углублённых принципах.

### 4.5 Cmdline

cmdline — важный способ передачи параметров из U-Boot ядру, включая загрузочное хранилище и состояние устройства. Данные поступают из нескольких источников; U-Boot объединяет их, удаляет дубликаты и передаёт ядру. В U-Boot cmdline хранится в переменной окружения bootargs. Передача выполняется изменением /chosen/bootargs в DTB ядра.

#### 4.5.1 Источники данных

Файл parameter.txt: при таблице разделов формата RK в parameter.txt можно хранить cmdline, например:

```text
  CMDLINE: console=ttyFIQ0 androidboot.baseband=N/A androidboot.selinux=permissive
androidboot.hardware=rk30board androidboot.console=ttyFIQ0 init=/init
mtdparts=rk29xxnand:0x00002000@0x00002000(uboot),0x00002000@0x00004000(trust),
```

Для таблицы разделов GPT информация cmdline в parameter.txt не действует. /chosen/bootargs в DTS ядра, например:

```text
chosen {
    bootargs = "earlyprintk=uart8250,mmio32,0xff30000 swiotlb=1 console=ttyFIQ0
                androidboot.baseband=N/A androidboot.veritymode=enforcing
                androidboot.hardware=rk30board androidboot.console=ttyFIQ0
                init=/init kpti=0";
};
```

U-Boot динамически дополняет cmdline в зависимости от текущего состояния выполнения, например:

```text
storagemedia=emmc androidboot.mode=emmc ......
```

Заголовок прошивки boot/recovery.img обычно также содержит поле cmdline.

#### 4.5.2 Значение параметров

Ниже перечислены часто используемые параметры cmdline платформ RK. Дополнительные сведения: Documentation/admin-guide/kernel-parameters.txt.

- sdfwupdate: признак SD-карты обновления, необходимый программе recovery.
- root=PARTUUID: UUID раздела rootfs (system); поддерживается только GPT.

- skip_initramfs: ядро использует ramdisk из rootfs (system), а не загруженный U-Boot.
- storagemedia: тип загрузочного хранилища.
- console: настройки порта вывода ядра.
- earlycon: последовательный порт и его настройки до создания узла UART.
- loop.max_part: число разделов, поддерживаемых каждым loop-устройством.
- rootwait: ожидание доступности файловой системы, например завершения инициализации eMMC. Без ожидания root_wait монтирование rootfs может завершиться ошибкой; параметр позволяет дождаться драйвера, скопировать rootfs из хранилища и затем смонтировать его.
- ro/rw: монтирование rootfs только для чтения / для чтения и записи.
- firmware_calss.path: расположение драйверов, например Wi-Fi, BT, GPU; написание сохранено по исходнику.
- dm="lroot none 0, 0 4096 linear 98:3 0, 4096 4096 linear 98:32" root=/dev/dm-0: загрузка с доступной для чтения и записи целью dm-linear размером 8192 секторов, распределённой по двум блочным устройствам с указанными major:minor. После загрузки udev переименует цель в /dev/mapper/lroot согласно правилам. UUID не назначен. Ссылка: https://android.googlesource.com/kernel/common/+/android-3.18/Documentation/device-mapper/boot.txt
- androidboot.slot_suffix: слот загрузки ядра в A/B System.
- androidboot.serialno: серийный номер для ядра и верхних уровней, например adb.
- androidboot.verifiedbootstate: требуемое Android состояние проверки прошивки в U-Boot; три состояния:

1. green: состояние LOCKED, ключ проверки не задан конечным пользователем.

2. yellow: состояние LOCKED, ключ проверки задан конечным пользователем.

3. orange: состояние UNLOCKED.

- androidboot.hardware: загрузочное устройство, например rk30board.
- androidboot.verifymode: фактический режим/состояние проверки раздела (целостности прошивки).
- androidboot.selinux: SELinux — система принудительного контроля доступа (MAC) на основе модели domain-type; три режима:

1. enforcing: SELinux работает и действительно ограничивает доступ domain/type.

2. permissive: SELinux работает, но выдаёт лишь предупреждения, не ограничивая доступ domain/type; используется для отладки SELinux.

3. disabled: SELinux выключен.

androidboot.mode: режим запуска Android, normal или charger.

1. normal: обычное включение.

2. charger: запуск выключенного устройства после подключения питания. U-Boot обнаруживает зарядку и устанавливает androidboot.mode=charger в bootargs.

- androidboot.wificountrycode: код страны Wi-Fi, например US, CN.
- androidboot.baseband: настройка модема; RK не имеет этой функции, значение N/A.
- androidboot.console: порт вывода Android.
- androidboot.vbmeta.device=PARTUUID: расположение vbmeta в хранилище.
- androidboot.vbmeta.hash_alg: алгоритм хеширования vbmeta, например sha512.
- androidboot.vbmeta.size: размер vbmeta.

- androidboot.vbmeta.digest: передаёт ядру digest vbmeta. После загрузки vbmeta ядро вычисляет digest и сравнивает его с переданным.
- androidboot.vbmeta.device_state: состояние lock/unlock системы для AVB 2.0.

### 4.6 Обновление прошивки DFU

DFU (Device Firmware Update) обновляет прошивку устройства. Поддерживаемые платформы перечислены в главе об определениях платформ. Для DFU включают следующие макросы:

```text
CONFIG_CMD_DFU=y
CONFIG_USB_FUNCTION_DFU=y
```

В зависимости от носителя выбираются следующие переключатели:

```text
CONFIG_DFU_MMC
CONFIG_DFU_MTD
CONFIG_DFU_NAND
CONFIG_DFU_RAM
CONFIG_DFU_SF
```

Платформы с DFU обычно предоставляют отдельный config. Например, прошивка RV1126 с DFU собирается следующей командой:

```text
./make.sh rv1126-dfu
```

Запишите прошивку в плату, подключите OTG к ПК и выполните в командной строке U-Boot:

```text
dfu 0 $devtype $devnum
```

devtype может быть mmc или mtd. На ПК появится USB download gadget. Замените драйвер с помощью Zadig; результат показан на снимке:

![Рисунок 2: английский оригинал, с. 56](/docs/rockchip-uboot-nextdev/assets/en-p056-figure-01.png)

*Рисунок 2: английский оригинал, с. 56*

Выполните программу хоста в командной строке Windows:

```text
./dfu-util.exe -l
```

Устройство передаст таблицу разделов, определённую в include/configs/evb_rv1126.h:

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

Для передачи файла на плату выполните в Windows команду формата dfu-util.exe VID:PID -a (имя раздела) -D(имя файла) -R(параметр перезагрузки):

```text
F:\Prj\20210901-Hisense-AB\dfu-util-0.9-win64>dfu-util.exe -d 2207:0107 -a system_b -D
rootfs.img -R
```

Журнал успешной записи:

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

Для другого раздела замените имя раздела после -a и имя файла после -D. Добавление -R перезагружает плату после записи.

### 4.7 DTBO/DTO

Для понимания главы сначала прочитайте определения DTB, DTBO, DTC, DTO, DTS и FDT в приложении. DTS описывает FDT; DTC компилирует DTS в DTB/DTBO; операция DTO объединяет DTB и DTBO в новый DTB. Часто словом DTBO называют и операцию DTO, но здесь эти понятия разделяются: DTO — операция, DTBO — дополнительный DTB для наложения. Дополнительные сведения: https://source.android.google.cn/devices/architecture/dto.

#### 4.7.1 Принцип работы

DTO (Device Tree Overlay) введён после Android P и должен быть включён. Он накладывает дополнительный blob дерева устройств (DTBO) на основной. Это позволяет поддерживать дерево SoC и динамически добавлять дерево конкретного устройства, новые узлы и изменения свойств. Основной *.dtb обычно предоставляет поставщик, дополнительный *.dtbo — ODM/OEM. Загрузчик объединяет их и передаёт результат ядру, как показано ниже:

![Рисунок 3: английский оригинал, с. 58](/docs/rockchip-uboot-nextdev/assets/en-p058-figure-01.png)

*Рисунок 3: английский оригинал, с. 58*

Источник изображения: https://source.android.google.cn/devices/architecture/dto. Компиляция DTB/DTBO для DTO отличается от обычной компиляции DTB. При компиляции .dts через dtc требуется -@ для добавления узла _symbols_ в .dtbo. Он содержит список всех узлов с метками, используемый библиотекой DTO как справочник. Примеры:

1. Пример компиляции основного .dts:

```text
dtc -@ -O dtb -o my_main_dt.dtb my_main_dt.dts
```

2. Пример компиляции .dts слоя наложения:

```text
dtc -@ -O dtb -o my_overlay_dt.dtbo my_overlay_dt.dts
```

#### 4.7.2 Включение DTO

1. Включите конфигурацию:

```text
CONFIG_CMD_DTIMG=y
CONFIG_OF_LIBFDT_OVERLAY=y
```

2. Реализуйте board_select_fdt_index(). Это __weak-функция, которую можно переопределить под реальные условия. Она выбирает из нескольких DTBO используемый для DTO и возвращает индекс начиная с 0; реализация weak по умолчанию возвращает 0.

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

#### 4.7.3 Результат DTO

1. После DTO результат виден в сообщениях запуска U-Boot:

```text
// 成功时的打印
ANDROID: fdt overlay OK

// 失败时的打印
ANDROID: fdt overlay failed, ret=-19
```

Обычно отказ вызван несовместимостью содержимого основного и дополнительного blob. Необходимо понимать синтаксис их создания и требования совместимости.

2. После успешного DTO в cmdline ядра добавляются следующие сведения, указывающие использованный DTBO:

```text
androidboot.dtbo_idx=1  // idx从0开始，这⾥表⽰选取idx=1的那份DTBO进⾏DTO操作
```

3. После успешного DTO просмотрите DTB командой fdt в U-Boot и убедитесь, что изменения применены.

### 4.8 ENV

#### 4.8.1 Поддержка инфраструктуры

ENV — важный механизм управления данными U-Boot: hash table сопоставляет ключи и значения, поддерживая создание, удаление, изменение и поиск. Эти ключи и данные называются переменными окружения. U-Boot может сохранять ENV на NOWHERE/eMMC/FLASH/EEPROM/NAND/SPI_FLASH/UBI и других носителях. Конфигурация:

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

Код инфраструктуры:

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

#### 4.8.2 Интерфейсы

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

env_load(): вручную вызывать не требуется; инфраструктура U-Boot вызывает функцию на нужном этапе загрузки.

env_save(): вызывается пользователем при необходимости и сохраняет все ENV на носителе, заданном CONFIG_ENV_IS_NOWHERE_XXX (написание исходника).

#### 4.8.3 Расширенные интерфейсы

RK предоставляет два высокоуровневых интерфейса ENV для создания, добавления и замены. Они предназначены прежде всего для bootargs, но работают и с другими переменными.

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

1. Правила env_update(): если varname отсутствует, создаются varname и varvalue; если varname есть, а varvalue нет, значение добавляется; если оба существуют, прежнее varvalue заменяется текущим. Например, существующее storagemedia=emmc при передаче storagemedia=rknand становится storagemedia=rknand.

2. env_update_filter() расширяет env_update(): при обновлении ENV удаляет указанное ключевое слово из varvalue.

3. Обе функции делят содержимое ENV по пробелам и «=». Единица обработки — отдельное слово, например sdfwupdate, либо key=value, например storagemedia=emmc, init=/init, androidboot.console=ttyFIQ0. Длинная строка вроде «console=ttyFIQ0 androidboot.baseband=N/A androidboot.selinux=permissive» не может обрабатываться как единый элемент.

#### 4.8.4 Расположение данных

env_save() сохраняет ENV на носитель. Расположение и размер ENV платформ RK определены следующим образом:

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

Изменять ENV_OFFSET и ENV_SIZE обычно не рекомендуется.

#### 4.8.5 Общие настройки

Распространены eMMC, sdmmc, Nandflash и Norflash. Штатные ENV-драйверы U-Boot для NAND/NOR используют MTD, тогда как все поддерживаемые RK носители используют BLK, поэтому эти драйверы неприменимы. RK предоставляет CONFIG_ENV_IS_IN_BLK_DEV для носителей BLK. Для eMMC/sdmmc по-прежнему выбирают CONFIG_ENV_IS_IN_MMC; для NAND/NOR — CONFIG_ENV_IS_IN_BLK_DEV. Перед использованием изучите определение CONFIG_ENV_IS_IN_BLK_DEV в Kconfig.

```text
// 已经默认被指定好，不需要修改
CONFIG_ENV_OFFSET
CONFIG_ENV_SIZE

// 通常不需要使⽤到
CONFIG_ENV_OFFSET_REDUND (optional)
CONFIG_ENV_SIZE_REDUND (optional)
CONFIG_SYS_MMC_ENV_PART (optional)
```

Для любого CONFIG_ENV_IS_IN_XXX сначала прочитайте описание Kconfig, включая его поднастройки.

#### 4.8.6 Инструмент fw_printenv

fw_printenv — инструмент U-Boot для доступа к ENV и изменения его содержимого из Linux. Область ENV должна находиться в доступном ядру разделе (рекомендуется отдельный раздел): доступ фактически идёт через узел хранения в sys ядра. Получение инструмента:

```text
./make.sh env
```

После выполнения команды получаем:

```text
./tools/env/fw_printenv      // env读写⼯具
./tools/env/fw_env.config    // env配置⽂件
./tools/env/README           // env读写⼯具说明⽂档
```

Использование описано в README.

#### 4.8.7 ENVF

Функция применима только к SDK с env.img, главным образом IPC-продуктам. Если env.img отсутствует, пропустите раздел. Штатный ENV хранит все переменные в заданной области, которую можно произвольно изменять извне. Ошибочное изменение системных переменных может нарушить загрузку или позволить атаку, например удаление bootcmd либо подмена вредоносной последовательностью. ENV Fragment разделяет системные переменные U-Boot и внешние пользовательские. Пользователь создаёт отдельный раздел env для своих переменных и белый список в U-Boot. Импорт, экспорт и изменение через этот раздел разрешены только для переменных белого списка.

Процесс ENVF: создайте env.txt с нужным содержимым; mkenvimage создаёт env.img, который записывается по адресу 0 хранилища. При запуске Loader и U-Boot читают env.img и импортируют разрешённые CONFIG_ENVF_LIST переменные. Для разных типов хранения требуются разные размеры env.img. Конфигурация:

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

Код:

```text
./env/envf.c
```

Инструмент:

```text
// 默认参与U-Boot的编译并⽣成 tools/mkenvimage，⽤于打包env.img
./tools/mkenvimage.c
```

Пример процесса разработки на ПК:

1. Создайте env.txt:

```text
// 必须定义系统分区表，否则⽆法正常启动。例如：
blkdevparts=mmcblk0:4M@8M(uboot),4M(trust),32M(boot),32M(recovery),32M(backup),-(rootfs)
sys_bootargs=rootwait earlycon=uart8250,mmio32,0xff570000 console=ttyFIQ0
......
```

Формат: (1) пары key=value; (2) без пробелов вокруг «=», без одинарных/двойных кавычек; (3) конец пары — перевод строки. sys_bootargs аналогичен bootargs в DTS ядра. Если он задан, U-Boot накладывает sys_bootargs на bootargs из DTS, причём одинаковые параметры из sys_bootargs имеют приоритет. Для таблицы разделов поддерживаются стандартные форматы ядра mtdparts и blkdevparts: выберите один. Примеры для разных носителей:

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

2. Создайте env.img:

```text
## Chapter-4 eMMC:
./tools/mkenvimage -s 0x8000 -p 0x0 -o env.img env.txt

## Chapter-4 spi-nor:
./tools/mkenvimage -s 0x10000 -p 0x0 -o env.img env.txt

#spi-nand/slc-nand：
./tools/mkenvimage -s 0x40000 -p 0x0 -o env.img env.txt
```

3. Запишите env.img по адресу 0 хранилища. Пример разработки на стороне U-Boot:

1. Включите и настройте env.img:

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

2. Пересоберите и запишите uboot.img.

3. Сообщения запуска:

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

4. Сохраните ENV следующей командой U-Boot либо вызовом env_save() в коде.

```text
=> env save
Saving Environment to env...  // 导出并保存⽩名单⾥的环境变量
```

### 4.9 Fastboot

Fastboot — предоставленный Android способ взаимодействия с U-Boot по USB, обычно для чтения сведений об устройстве и записи прошивок.

#### 4.9.1 Настройки

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

#### 4.9.2 Способы запуска

Fastboot по умолчанию использует VID/PID Google adb. Способы запуска:
- В командной строке ядра: reboot fastboot.
- В командной строке U-Boot: fastboot usb 0.
- При включении удерживать ctrl+f.

#### 4.9.3 Поддерживаемые команды

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

#### 4.9.4 Описание команд

- fastboot flash &lt; partition &gt; [ &lt; filename &gt; ]: запись раздела; пример: fastboot flash boot boot.img.
- fastboot erase &lt; partition &gt;: стирание раздела; пример: fastboot erase boot.
- fastboot getvar &lt; variable &gt;: получение сведений об устройстве; пример: fastboot getvar version-bootloader.

Параметры &lt; variable &gt;:

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

- fastboot getvar all: все сведения об устройстве.
- fastboot set_active &lt; slot &gt;: слот следующей загрузки; пример: fastboot set_active _a.
- fastboot reboot: обычная перезагрузка; пример: fastboot reboot.
- fastboot reboot-bootloader: перезагрузка в fastboot; пример: fastboot reboot-bootloader.
- fastboot flashing unlock: разблокировать устройство для записи; пример: fastboot flashing unlock.
- fastboot flashing lock: заблокировать запись; пример: fastboot flashing lock.
- fastboot stage [ &lt; filename &gt; ]: загрузить данные в память устройства начиная с CONFIG_FASTBOOT_BUF_ADDR; пример: fastboot stage permanent_attributes.bin.
- fastboot get_staged [ &lt; filename &gt; ]: получить данные устройства; пример: fastboot get_staged raw_unlock_challenge.bin.
- fastboot oem fuse at-perm-attr: записать permanent_attributes.bin и hash; сначала fastboot stage permanent_attributes.bin, затем fastboot oem fuse at-perm-attr.
- fastboot oem fuse at-perm-attr-data: записать только permanent_attributes.bin в защищённое хранилище RPMB; сначала fastboot stage permanent_attributes.bin, затем fastboot oem fuse at-perm-attr-data.
- fastboot oem at-get-ca-request
- fastboot oem at-set-ca-response

- fastboot oem at-lock-vboot: блокировка; пример: fastboot oem at-lock-vboot.
- fastboot oem at-unlock-vboot: разблокировка, поддерживается authenticated unlock. Последовательность примера: fastboot oem at-get-vboot-unlock-challenge; fastboot get_staged raw_unlock_challenge.bin; ./make_unlock.sh (см. описание make_unlock.sh); fastboot stage unlock_credential.bin; fastboot oem at-unlock-vboot. См. how-to-generate-keys-about-avb.md.
- fastboot oem fuse at-bootloader-vboot-key: запись hash ключа загрузчика; сначала fastboot stage bootloader-pub-key.bin, затем fastboot oem fuse at-bootloader-vboot-key.
- fastboot oem format: переформатировать разделы согласно $partitions; пример: fastboot oem format.
- fastboot oem at-get-vboot-unlock-challenge: получить unlock challenge для authenticated unlock; пример см. пункт 16 fastboot oem at-unlock-vboot исходника.
- fastboot oem at-reset-rollback-index: сбросить данные rollback; пример: fastboot oem at-reset-rollback-index.
- fastboot oem at-disable-unlock-vboot: отключить команду fastboot oem at-unlock-vboot; пример: fastboot oem at-disable-unlock-vboot.

### 4.10 FileSystem

#### 4.10.1 Поддержка инфраструктуры

FAT и EXT2/4 — распространённые файловые системы. FAT использует таблицу разделов DOS (MBR), например на SD-картах и USB-накопителях. Обе часто используются в U-Boot. Конфигурация FAT:

```text
CONFIG_DOS_PARTITION=y
CONFIG_FS_FAT=y
CONFIG_FAT_WRITE=y
CONFIG_FS_FAT_MAX_CLUSTSIZE=65536
CONFIG_CMD_FAT=y
CONFIG_CMD_FS_GENERIC=y
```

Команды FAT:

```text
fatinfo fatload fatls fatsize fatwrite
```

Конфигурация EXT2/4:

```text
CONFIG_CMD_EXT2=y
CONFIG_CMD_EXT4=y
CONFIG_CMD_FS_GENERIC=y
```

Команды EXT2/4:

```text
ext2load ext2ls ext4load ext4ls ext4size
```

#### 4.10.2 Интерфейсы

Заголовок функций FAT ./include/fat.h:

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

Заголовок функций EXT2/4 include/ext4fs.h:

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

#### 4.10.3 Примеры команд

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

Команды ext2/4 используются аналогично fat, поэтому отдельно не рассматриваются.

### 4.11 HW-ID DTB

U-Boot платформ RK может выбирать Kernel DTB по аппаратным значениям GPIO или ADC. Эта функция далее называется HW-ID DTB (Hardware id DTB).

#### 4.11.1 Принцип проектирования

Версии аппаратуры и компоненты, например дисплей и Wi-Fi-модуль, часто меняются. Отдельное ПО для каждой версии усложняет сопровождение; HW_ID позволяет одному ПО поддерживать несколько вариантов. Для каждого варианта предоставляются DTB и уникальное аппаратное значение ADC/GPIO, например фиксированное значение ADC или уровень GPIO. Все DTB упаковываются в один resource.img. При загрузке ядра U-Boot определяет аппаратное значение, выбирает соответствующий DTB из resource.img и передаёт ядру.

#### 4.11.2 Аппаратный пример

Поддерживаются ADC и GPIO. Пример ADC: на RK3326-EVB/PX30-EVB предусмотрены резисторы делителя; разные коэффициенты дают разные значения ADC для определения версии аппаратуры:

![Рисунок 4: английский оригинал, с. 74](/docs/rockchip-uboot-nextdev/assets/en-p074-figure-01.png)

*Рисунок 4: английский оригинал, с. 74*

На плате совместимого MIPI-дисплея предусмотрен ещё один резистор подтяжки вниз:

![Рисунок 5: английский оригинал, с. 75](/docs/rockchip-uboot-nextdev/assets/en-p075-figure-01.png)

*Рисунок 5: английский оригинал, с. 75*

Разные MIPI-дисплеи получают разные сопротивления и вместе с EVB дают уникальный ADC. Расчёт для V1: максимум ADC 1024 соответствует прямой подтяжке ADC_IN0 к 1.8V. На дисплее установлен pull-down 10K; при подключении к EVB ADC=1024*10K/(10K + 51K) =167.8. Готового GPIO-референсного дизайна нет; пользователь может разработать собственный.

#### 4.11.3 Имена DTB

Уникальные значения ADC/GPIO должны входить в имя DTB. Для ADC: имя заканчивается на .dtb; единица HW_ID имеет вид #[controller]_ch[channel]=[adcval]. controller — имя узла ADC в DTS, channel — канал, adcval — центральное значение с допустимым диапазоном adcval+-30. Каждая единица состоит из строчных букв без пробелов; единицы разделяются #, максимум 10. Примеры:

```text
rk3326-evb-lp3-v10#saradc_ch2=111#saradc_ch1=810.dtb
rk3326-evb-lp3-v10#_saradc_ch2=569.dtb
```

Для GPIO: имя заканчивается на .dtb; единица HW_ID имеет вид #gpio[pin]=[level]. pin — контакт GPIO, например 0a2 означает gpio0a2; level — уровень. Используются строчные буквы без пробелов; единицы разделяются #, максимум 10. Примеры:

```text
rk3326-evb-lp3-v10#gpio0a2=0#gpio0c3=1.dtb
```

#### 4.11.4 Упаковка DTB

Скрипт scripts/mkmultidtb.py в репозитории ядра упаковывает несколько DTB в один resource.img. Внесите имена DTB в словарь DTBS и задайте соответствующие ADC/GPIO-настройки.

```text
...
DTBS = {}
DTBS['PX30-EVB'] = OrderedDict([('rk3326-evb-lp3-v10', '#_saradc_ch0=166'),
                ('px30-evb-ddr3-lvds-v10', '#_saradc_ch0=512')])
...
```

В примере scripts/mkmultidtb.py PX30-EVB создаёт resource.img с тремя DTB:

- rk-kernel.dtb: стандартный RK DTB, не показанный в словаре; используется при отсутствии совпадения. Скрипт берёт первый DTB из DTBS как стандартный.
- rk3326-evb-lp3-v10#_saradc_ch0=166.dtb: RK3326 DTB с ADC.
- px30-evb-ddr3-lvds-v10#_saradc_ch0=512.dtb: PX30 DTB с ADC.

При ручном запуске scripts/mkmultidtb.py созданный resource.img требуется вручную заменить в boot.img. Для удобства добавьте вызов по примеру ниже, чтобы сборка ядра автоматически включала resource.img с несколькими DTB.

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

#### 4.11.5 Включение функции

Настройки:

```text
CONFIG_ROCKCHIP_HWID_DTB=y
```

Код драйвера:

```text
./arch/arm/mach-rockchip/resource_img.c // 具体实现：rockchip_read_hwid_dtb()
```

DTS: для идентификации через GPIO сохраните соответствующие pinctrl- и gpio-узлы в rkxx-u-boot.dtsi; ADC включён по умолчанию. Пример для gpio0 и gpio1:

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

#### 4.11.6 Результат загрузки

```text
......
mmc0(part 0) is current device
boot mode: None
DTB: rk3326-evb-lp3-v10#_saradc_ch0=166.dtb // 打印匹配的DTB，否则默认"rk-kernel.dtb"
Using kernel dtb
......
```

### 4.12 SD и USB-накопитель

Раздел описывает запуск и обновление прошивок RK с SD и USB-накопителей.

#### 4.12.1 Принцип механизма

При создании загрузочной или обновляющей карты по фиксированному смещению в заголовке записывается tag её типа. U-Boot распознаёт tag и выбирает запуск или обновление. Загрузочная карта содержит одну полную прошивку, из которой U-Boot запускает систему. Карта обновления содержит две: утилита ПК записывает A — только разделы для входа в recovery, и B — полный update.img. U-Boot запускает recovery из A, затем recovery обновляет систему из B. Важно: SD-загрузка/обновление поддерживается начиная с BootROM; USB — только начиная с U-Boot, который должен уже исправно работать.

#### 4.12.2 Подготовка прошивки

Создание SD- и USB-носителей запуска/обновления одинаково: сначала создайте update.img инструментом SDK RKTools/linux/Linux_Pack_Firmware/rockdev/, затем запишите его на SD/USB через SDDiskTool. На показанном экране выберите съёмный диск, «обновление прошивки» либо «SD-загрузка», затем «начать создание».

![Рисунок 6: английский оригинал, с. 79](/docs/rockchip-uboot-nextdev/assets/en-p079-figure-01.png)

*Рисунок 6: английский оригинал, с. 79*

#### 4.12.3 Конфигурация SD

SD-загрузка/обновление включено по умолчанию в U-Boot платформенных SDK; дополнительные настройки не нужны.

#### 4.12.4 Конфигурация USB

USB-загрузка/обновление по умолчанию выключено, поскольку штатное USB-сканирование U-Boot занимает много времени. При необходимости:
1. Запишите полную исправную прошивку обновления в локальное хранилище eMMC/NAND и проверьте её.
2. Подключите USB-накопитель, войдите в консоль U-Boot. Командами usb start и usb info проверьте распознавание; при отказе сначала исправьте USB.
3. Скопируйте Kernel DTB из шага 1 как kern.dtb в ./dts/ U-Boot. При сборке он автоматически попадёт в uboot.img. Если Kernel DTB локального раздела повреждён, kern.dtb позволяет U-Boot правильно инициализировать USB.
4. Включите конфигурацию USB-загрузки/обновления:

```text
CONFIG_ROCKCHIP_USB_BOOT=y
```

Пересоберите и запишите uboot.img. Если упаковка не удаётся из-за размера U-Boot, причина — добавленный kern.dtb; отключите ненужные настройки U-Boot.

#### 4.12.5 Проверка действия

Для проверки SD/USB-загрузки или обновления исходник предлагает стереть ключевые локальные разделы kernel, resource, boot и recovery на eMMC/NAND и проверить вход в ядро с подключённым SD/USB. Это разрушительная проверка, требующая резервной копии и проверенного пути восстановления.

#### 4.12.6 Предостережения

USB-инициализация вызывает usb start и занимает заметное время. Для GPT необходим SDDiskTool &gt;= v1.59, для A/B — &gt;= v1.61. USB-загрузка/обновление добавлено в 2019.11; репозитории должны удовлетворять условиям:

1. Обновите U-Boot до следующего коммита (рекомендуется):

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

Либо отдельно перенесите изменения следующих патчей, что может быть затруднительно:

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

1. Репозиторий rkbin должен содержать этот коммит:

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

1. Репозиторий ядра должен содержать этот коммит:

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

Для старого SDK помимо перечисленных патчей уточните у инженера recovery, нужны ли соответствующие изменения recovery.

## 5 Драйверы

### 5.1 AMP

#### 5.1.1 Реализация

U-Boot по умолчанию не поддерживает AMP (Asymmetric Multi-Processing). RK реализует запуск разных прошивок на разных CPU.

(1) Упаковка: ITS задаёт состояние CPU и описание каждой AMP-прошивки, кроме Linux. Всё упаковывается в FIT-образ amp.img и записывается в раздел amp. U-Boot загружает amp.img и проверяет целостность SHA256; trust устанавливает состояния CPU и передаёт управление соответствующим адресам входа.

(2) Порядок: CPU с U-Boot — главный. Сначала он переключает состояния и запускает остальные ядра, затем обрабатывает себя.

(3) Ресурсы: U-Boot не координирует распределение памяти, прерываний и других ресурсов между AMP-прошивками; это обязанность разработчика.

(4) Trust: AMP требует поддержки trust. Для стандартного состояния CPU trust SDK уже подходит; для нестандартного требуется дополнительная поддержка, хотя некоторые SDK уже её включают. Стандарт для 32-битных чипов: arch = "arm", thumb = &lt;0&gt;, hyp = 0; для 64-битных: arch = "arm64", thumb = &lt;0&gt;, hyp = 1.

(5) Комбинация Linux+AMP:

1. Ради совместимости Linux-прошивка остаётся такой же, как в обычном SMP: комплект состоит из Linux-прошивки + amp.img.

2. Узел linux в AMP ITS задаёт состояние CPU для Linux; без узла используется стандартное состояние.

3. Если главный CPU запускает Linux или для него не назначена прошивка, после остальных AMP-прошивок U-Boot запускает Linux обычным способом SMP.

4. Если Linux запускается не на главном CPU, он стартует раньше остальных AMP-прошивок. Важно: главный CPU, отличный от CPU0, требует специальной поддержки trust.

5. Адрес загрузки Linux определяется только конфигурацией U-Boot, например rk3568_common.h.

#### 5.1.2 Поддержка инфраструктуры

Конфигурация:

```text
CONFIG_AMP
CONFIG_ROCKCHIP_AMP
```

Код инфраструктуры:

```text
./drivers/cpu/rockchip_amp.c
```

Шаблон ITS:

```text
./drivers/cpu/amp.its
```

Инструмент упаковки:

```text
./tools/mkimage  // 完整编译⼀次U-Boot后会⾃动⽣成
```

Минимально необходимый коммит:

```text
commit c51cf04095dde2df2dd047e70d2c7fb0866ea916
Author: Joseph Chen <chenjh@rock-chips.com>
Date:   Tue Oct 19 03:16:35 2021 +0000

    cpu: amp.its: update amps "arm64" => "arm"

    Signed-off-by: Joseph Chen <chenjh@rock-chips.com>
    Change-Id: I99de02c5b6c62ffdd9b25565acd172801d6e983c
```

#### 5.1.3 Включение функции

1. Для amp.img нужен ITS; измените drivers/cpu/amp.its. В следующем примере CPU1/2/3 работают с AMP, CPU0 — с Linux, главный — CPU3. Порядок: CPU0 =&gt; CPU1/2 =&gt; CPU3.

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

Поля:
- description: описание.
- type: обычно "firmware".
- compression: обычно "none".
- data: путь прошивки относительно amp.its.
- arch: режим CPU 32/64. ARMv7 допускает только "arm"; ARMv8 — "arm64" (AArch64) или "arm" (AArch32).
- cpu: аппаратный ID CPU, младшие 32 бита MPIDR (Multiprocessor Affinity Register), например:

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

- thumb: режим команд CPU; 1 для чистого Thumb, иначе 0.
- hyp: режим виртуализации CPU.
- load: адрес загрузки и выполнения прошивки.
- udelay: необязательная задержка в us после запуска текущего CPU перед следующим.
- loadables: загружаемые AMP-прошивки и порядок загрузки/запуска. Главный CPU всегда запускается последним независимо от этого порядка.
- linux: узел комбинации Linux+AMP; см. описание принципа реализации в этой главе.

2. Упаковка прошивки:

```text
// 0xe00为固件头⼤⼩，不建议改变
./tools/mkimage -f ./drivers/cpu/amp.its -E -p 0xe00 amp.img
```

mkimage автоматически создаётся после одной полной сборки U-Boot.

3. Добавьте раздел amp в parameter.txt и запишите amp.img. U-Boot загружает в память весь раздел amp; выбирайте размер по фактической потребности.

4. Bring-up: U-Boot автоматически запускает все AMP в нужный момент. Ниже журнал для CPU3 как главного ядра с AMP и CPU0/1/2 с Linux:

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

Вывод зависит от ITS пользователя; ориентируйтесь на фактический журнал.

### 5.2 Charge

#### 5.2.1 Поддержка инфраструктуры

Исходный U-Boot не поддерживает зарядку; RK реализовал её самостоятельно. Участвуют Display, PMIC, измеритель заряда, анимация, pwrkey, LED, энергосберегающий сон CPU, Timer и другие модули. Поддержка измерителей:

```text
RK809/RK816/RK817/RK818/cw201x。
```

Конфигурация:

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

Инфраструктура зарядки:

```text
./drivers/power/charge-display-uclass.c
```

Драйвер анимации зарядки:

```text
// 负责管理整个充电过程，它会获取电量、充电类型、按键事件，发起低功耗休眠等。
./drivers/power/charge_animation.c
```

Инфраструктура измерителя заряда:

```text
./drivers/power/fuel_gauge/fuel_gauge_uclass.c
```

Драйвер измерителя заряда:

```text
./drivers/power/fuel_gauge/fg_rk818.c
./drivers/power/fuel_gauge/fg_rk817.c   // rk809复⽤
./drivers/power/fuel_gauge/fg_rk816.c
......
```

Логическая последовательность:

```text
charge-display-uclass.c
    => charge_animation.c
        => fuel_gauge_uclass.c
            => fg_rkxx.c
```

#### 5.2.2 Упаковка изображений

Изображения зарядки находятся в ./tools/images/; для отображения их нужно включить в resource.img. Созданный ядром resource.img по умолчанию их не содержит; отдельно упакуйте их средствами U-Boot.

```text
$ ls tools/images/
battery_0.bmp  battery_1.bmp  battery_2.bmp  battery_3.bmp  battery_4.bmp  battery_bmp
battery_fail.bmp
```

Команда упаковки:

```text
./pack_resource.sh <input resource.img> 或
./scripts/pack_resource.sh <input resource.img>
```

Вывод упаковки:

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

В корне U-Boot создаётся resource.img с изображениями; проверьте содержимое через hd:

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

#### 5.2.3 Конфигурация DTS

Узел зарядки DTS:

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

#### 5.2.4 Сон системы

Короткое нажатие pwrkey включает/выключает экран; при выключенном экране система переходит в энергосберегающий режим. Долгое нажатие запускает систему. rockchip,system-suspend = &lt;VAL&gt; выбирает один из двух режимов: VAL=0 — CPU WFI, без обработки периферии; VAL=1 — system suspend, требующий ATF/OPTEE, глубокий сон всего SoC аналогично ядру. Минимальные версии ATF/OPTEE для сна U-Boot см. в главе об определениях платформ.

#### 5.2.5 Замена изображений

1. Замените изображения в ./tools/images/ (BMP 8bit или 24bit). Командой ls &#124; sort проверьте порядок от низкого заряда к высокому и упакуйте изображения скриптом pack_resource.sh в resource.img.

2. Измените соответствие изображений и заряда в ./drivers/power/charge_animation.c.

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

#### 5.2.6 Индикаторы зарядки

Требования к LED зависят от продукта, поэтому инфраструктура зарядки предоставляет лишь два демонстрационных индикатора: зарядка и полный заряд. Первый переключается при изменении уровня заряда во время зарядки; второй включается при 100%. В исходнике первое описание повторно подписано как полный заряд. Адаптируйте этот demo под требования продукта. Настройки:

```text
CONFIG_LED_CHARGING_NAME
CONFIG_LED_CHARGING_FULL_NAME
```

Обе настройки задают label соответствующих LED; см. главу LED.

### 5.3 Clock

#### 5.3.1 Поддержка инфраструктуры

Драйвер тактирования использует clk-uclass и стандартные интерфейсы. Конфигурация:

```text
CONFIG_CLK
```

Код инфраструктуры:

```text
./drivers/clk/clk-uclass.c
```

Платформенный драйвер:

```text
./drivers/clk/rockchip/...
```

#### 5.3.2 Интерфейсы

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

#### 5.3.3 Инициализация тактирования

В инициализации тактирования участвуют три группы интерфейсов. Сначала приведён узел CRU для последующих пояснений.

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

Первая группа — стандартная инициализация базовых частот платформы: rkclk_init(). probe драйвера CRU вызывает rkclk_init() для PLL/CPU/bus; частоты заданы в cru_rkxxx.h. Пример RK3399:

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

Вторая группа — повторная настройка базовых частот: clk_set_defaults(). probe CRU может вызвать её для чтения и применения assigned-clocks/assigned-clock-parents/assigned-clock-rates узла CRU, кроме частоты ARM. ARM меняется только при реализации set_armclk_rate(), см. повышение частоты CPU ниже. Другие устройства, например VOP и GMAC, также могут вызывать clk_set_defaults() из своего probe.

Третья группа — инициализация частоты модулей через clk_set_rate(); большинство периферийных модулей задают собственные частоты этим вызовом.

#### 5.3.4 Повышение частоты CPU

Поддержка повышения частоты CPU по платформам приведена в главе определений платформ. Есть три механизма.

Первый: CPU использует APLL.
1. Задайте целевую частоту ARM в assigned-clocks узла CRU.
2. probe CRU вызывает clk_set_defaults(), чтобы получить, но пока не применить эту частоту.
3. Реализуйте set_armclk_rate() для её установки. Некоторые платформы уже имеют реализацию; для других её можно добавить по примеру arch\arm\mach-rockchip\px30\px30.c.

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

4. По таблице частот/напряжений CPU opp-table добавьте regulator-init-microvolt = &lt;...&gt; в узел регулятора ARM, согласовав начальное напряжение с целевой частотой.

Второй механизм: CPU использует SCMI CLK, например RK356X. Частоты задаются интерфейсом SCMI.
1. Задайте ARM-частоту в rockchip,clk-init узла SCMI.
2. Убедитесь, что включён CONFIG_CLK_SCMI.
3. Реализуйте set_armclk_rate() для установки частоты из DTS SCMI. Некоторые платформы уже поддержаны; пример: arch\arm\mach-rockchip\rk3568\rk3568.c.

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

4. Добавьте regulator-init-microvolt = &lt;...&gt; в регулятор ARM по CPU opp-table, согласовав напряжение с частотой. SCMI описан в приложении главы 17.

Третий механизм также использует SCMI CLK, но требует только шага 4: частота CPU автоматически повышается при увеличении напряжения.

#### 5.3.5 Дерево тактирования

U-Boot не предоставляет управление деревом тактирования. Платформенная soc_clk_dump() выводит основные сведения о частотах, например:

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

Первая строка означает: sync kernel — драйвер CRU через clk_set_defaults() установил частоты шин из узла CRU ядра,

кроме ARM; иначе выводится sync uboot. enter 1200000 KHz — частота ARM при передаче управления от Loader к U-Boot. init 1200000 KHz — начальная частота ARM U-Boot, определённая APLL_HZ. kernel 800000 KHz — реализован set_armclk_rate() и задана ARM-частота из assigned-clocks узла CRU ядра; иначе выводится "kernel 0N/A".

### 5.4 Crypto

Crypto реализует аппаратные алгоритмы шифрования и хеширования; имеются версии IP v1 и v2.

#### 5.4.1 Поддержка инфраструктуры

U-Boot не имеет стандартной инфраструктуры crypto; RK реализует собственную. Конфигурация:

```text
CONFIG_DM_CRYPTO
// 2选1，各平台的defconfig已默认使能对应配置。
CONFIG_ROCKCHIP_CRYPTO_V1
CONFIG_ROCKCHIP_CRYPTO_V2
```

Код инфраструктуры:

```text
./drivers/crypto/crypto-uclass.c
./cmd/crypto.c
```

Код драйвера:

```text
// crypto v1:
./drivers/crypto/rockchip/crypto_v1.c

// crytpo v2:
./drivers/crypto/rockchip/crypto_v2.c
./drivers/crypto/rockchip/crypto_v2_pka.c
./drivers/crypto/rockchip/crypto_v2_util.c
```

#### 5.4.2 Интерфейсы

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

Применение интерфейсов см. ./cmd/crypto.c. Отличие SHA v1/v2: перед crypto_sha_init() в v1 требуется задать полную длину данных в ctx-&gt;length; v2 этого не требует.

#### 5.4.3 Конфигурация DTS

Узел crypto должен быть определён в DTS U-Boot: старые SDK не имеют его в DTS ядра, поэтому нужна обратная совместимость; кроме того, Secure Boot U-Boot использует crypto, и самостоятельное управление им безопаснее и целесообразнее.

1. Конфигурация crypto v1 на примере RK3399:

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

2. Конфигурация crypto v2 на примере PX30:

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

DTS-конфигурации v1/v2 отличаются заданием частоты clk.

### 5.5 Display

#### 5.5.1 Поддержка инфраструктуры

RK U-Boot поддерживает RGB, LVDS, EDP, MIPI, HDMI, CVBS, DP и другие интерфейсы. Логотипы берутся из logo.bmp и logo_kernel.bmp в корне ядра, упакованных в resource.img. Поддерживаются BMP BI_RGB 8bpp/16bpp/24bpp/32bpp и BI_RLE4/BI_RLE8. Чипы с VOP LITE, включая RK312X/PX30/RK3308/RV1126/RV1106, аппаратно не поддерживают mirror. Если логотип зеркален по X/Y, заранее преобразуйте BMP в Photoshop, ffmpeg или другом инструменте. Конфигурация:

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

Код инфраструктуры:

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

Файл драйвера:

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

#### 5.5.2 Интерфейсы

```text
// 显⽰ U-Boot logo 和 kernel logo：
void rockchip_show_logo(void);

// 显⽰ bmp 图⽚，⽬前主要⽤于充电图⽚显⽰：
void rockchip_show_bmp(const char *bmp);

// 将 U-Boot 中的⼀些变量通过 dtb 传给内核。
// 包括 kernel logo 的⼤⼩、地址、格式、bcsh/csc配置、crtc 输出扫描时序以及过扫描的配置等。
void rockchip_display_fixup(void *blob);
```

#### 5.5.3 Конфигурация DTS

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

Кроме платформ с ограниченной памятью или особыми требованиями к скорости запуска, defconfig U-Boot обычно уже поддерживает вывод; достаточно настроить DTS. Для RK3308/RV1103/RV1106 он по умолчанию выключен, в частности ради скорости запуска; добавьте в defconfig:

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

Либо включите соответствующие параметры .config:

```text
// rk3308
make rk3308_defconfig rk3308-display.config
// rv1103/rv1106
make rv1106_defconfig rv1106-display.config
```

Upstream поддерживает отдельный Rockchip U-Boot display driver, преимущественно для RK3288 и RK3399:

```text
./drivers/video/rockchip/
```

Для upstream-драйвера включите CONFIG_VIDEO_ROCKCHIP и выключите CONFIG_DRM_ROCKCHIP. Драйвер SDK имеет преимущества: больше платформ и интерфейсов; настройка разрешения, overscan и отображения HDMI/DP; плавный переход от логотипа U-Boot к логотипу ядра до запуска системы.

#### 5.5.5 Раздел LOGO

Для динамического обновления логотипа, обычно из приложения, создайте отдельный раздел LOGO и записывайте туда исходное изображение без упаковки. При недействительном изображении используется стандартное из resource. Если код содержит только следующий коммит, LOGO поддерживает одно изображение, заменяющее лишь logo.bmp:

```text
1d30bcc rockchip: resource: support parse "logo" partition picture
```

Со следующим коммитом LOGO содержит два изображения: первое заменяет logo.bmp, второе logo_kernel.bmp. Они располагаются подряд с выравниванием 512 байт; порядок менять нельзя.

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

Для изображений logo.bmp и logo_kernel.bmp команда упаковки logo.img:

```text
cat logo.bmp > logo.img && truncate -s %512 logo.img && cat logo_kernel.bmp >> logo.img
```

Запишите logo.img в раздел logo. При запуске появится сообщение "LOGO: ":

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

#### 5.5.6 Разбор типовых проблем

Вопрос 1: Можно ли по умолчанию показывать изображение зеркально по X/Y? Ответ: зеркальное отображение по Y по умолчанию не поддерживается. По X оно не поддерживается на VOP LITE, но платформы VOP2, например RK3568 и RK3588, могут включить его начиная с U-Boot следующей настройкой:

```text
&vp1 {
    xmirror-enable;
};
```

Вопрос 2: Поддерживаются ли BMP-логотипы разрешения 4K?

Ответ: Да, но стандартные defconfig платформ не позволяют корректно отобразить 4K. Требуются изменения, например для RK3576:

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

Также установите CONFIG_DRM_MEM_RESERVED_SIZE_MBYTES в 64 MB. Причины: ради памяти и стандартной таблицы parameter большие BMP не рекомендуются; MAX_IMAGE_BYTES ограничен 8 MB, для большего размера рекомендуется BI_RLE4/BI_RLE8. Типичный 4K BI_RGB 24bpp занимает около 24 MB, а стандартная malloc heap обычно 32 MB, поэтому BMP-декодирование может не получить память. Для плавного перехода U-Boot/Kernel оба логотипа обычно имеют одинаковый формат и разрешение; стандартные 32 MB, резервируемые CONFIG_DRM_MEM_RESERVED_SIZE_MBYTES, недостаточны.

### 5.6 Dvfs

В отличие от ядра, DVFS этой главы — механизм динамического изменения частоты/напряжения специально для чипов расширенного температурного диапазона.

#### 5.6.1 Температурная политика

U-Boot не поддерживает DVFS штатно. RK реализовал драйвер расширенного температурного диапазона, регулирующий частоту/напряжение CPU/DMC по температуре. В отличие от ядра он действует только при достижении верхнего/нижнего порога. Политика:

1. Политика регулирует CPU и DMC одновременно либо только один из них согласно DTS; правила одинаковы.

2. Драйвер читает opp table, regulator, clock узлов CPU/DMC и trip-point-0 thermal zone, получая уровни частоты/напряжения, температурные пороги и максимально допустимое напряжение.

3. Управление действует, если opp table содержит rockchip,low-temp = &lt;...&gt; или rockchip,high-temp = &lt;...&gt;, либо CPU/DMC ссылается на trip-узел thermal zone.

4. Основные свойства: rockchip,low-temp — нижний порог TEMP_min; rockchip,high-temp и thermal zone — верхний TEMP_max, причём при наличии обоих температура сравнивается с обоими; rockchip,max-volt — максимально допустимое V_max.

5. Выше TEMP_max частота и напряжение снижаются до минимального уровня. Ниже TEMP_min напряжение повышается на 50mv; если это превысит V_max, устанавливается V_max и частота снижается на две ступени.

6. Политика выполняется дважды: после инициализации regulator/clk при запуске драйвера из board_init() в board.c и в preboot перед загрузкой прошивки. Если в DTS заданы repeat и связанные свойства и температура после применения остаётся вне диапазона, загрузка останавливается, а политика повторяется до возвращения в диапазон. Без repeat система запускается после однократного применения; обычно repeat не требуется.

#### 5.6.2 Поддержка инфраструктуры

Код инфраструктуры:

```text
./drivers/power/dvfs/dvfs-uclass.c
./include/dvfs.h
./cmd/dvfs.c
```

Код драйвера:

```text
./drivers/power/dvfs/rockchip_wtemp_dvfs.c
```

#### 5.6.3 Интерфейсы

```text
// 执⾏⼀次dvfs策略
int dvfs_apply(struct udevice *dev);

// 如果存在repeat属性，当温度不在阈值范围内时循环执⾏dvfs策略
int dvfs_repeat_apply(struct udevice *dev);
```

#### 5.6.4 Включение температурной политики

1. Включите конфигурацию:

```text
CONFIG_DM_DVFS=y
CONFIG_ROCKCHIP_WTEMP_DVFS=y

CONFIG_DM_THERMAL=y
CONFIG_ROCKCHIP_THERMAL=y
CONFIG_USING_KERNEL_DTB=y
```

2. Задайте CONFIG_PREBOOT:

```text
#ifdef CONFIG_DM_DVFS
#define CONFIG_PREBOOT  "dvfs repeat"
#else
#define CONFIG_PREBOOT
#endif
```

3. Настройте температурный узел DTS ядра:

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

Обычно перечисленные свойства repeat не нужны.

#### 5.6.5 Результат температурного управления

Сообщения при включённом термоуправлении CPU:

```text
// <NULL>表明没有指定低温阈值
DVFS: cpu: low=<NULL>'c, high=95'c, Vmax=1350000uV, tz_temp=88.0'c, h_repeat=0, l_repeat=0
```

При превышении верхнего порога CPU выводятся изменения:

```text
DVFS: 90.352'c
DVFS: cpu(high): 600000000->408000000 Hz, 1050000->950000 uV
```

При достижении нижнего порога CPU выводятся изменения:

```text
DVFS: 10.352'c
DVFS: cpu(low): 600000000->600000000 Hz, 1050000->1100000 uV
```

Аналогичные сообщения с префиксом dmc выводятся при температурных порогах DMC:

```text
DVFS: dmc: ......
DVFS: dmc(high): ......
DVFS: dmc(low): ......
```

### 5.7 Efuse/Otp

#### 5.7.1 Поддержка инфраструктуры

efuse/otp использует misc-uclass.c и стандартные интерфейсы. Обычно имеются secure и non-secure области. U-Boot предоставляет non-secure доступ, U-Boot SPL — доступ к некоторым secure OTP областям. Non-secure конфигурация:

```text
CONFIG_MISC
// 2选1，各平台的defconfig已默认使能对应配置。
CONFIG_ROCKCHIP_EFUSE
CONFIG_ROCKCHIP_OTP
```

Secure-конфигурация:

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

Для проверки secure-поддержки, например RV1126B, найдите следующее определение в rv1126b_common.h:

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

Код инфраструктуры:

```text
./drivers/misc/misc-uclass.c
```

Код драйвера:

```text
// non-secure:
./drivers/misc/rockchip-efuse.c
./drivers/misc/rockchip-otp.c
// secure，以RK3588为例：
./drivers/misc/rk3588-secure-otp.S
```

#### 5.7.2 Интерфейсы

```text
int misc_read(struct udevice *dev, int offset, void *buf, int size)
int misc_write(struct udevice *dev, int offset, void *buf, int size)
// ⾃带回读校验
int misc_otp_write_verify(struct udevice *dev, int offset, const uint8_t *write_buf, int
size)
```

#### 5.7.3 Конфигурация DTS

Пример RK3308, non-secure:

```text
otp: otp@ff210000 {
    compatible = "rockchip,rk3308-otp";
    reg = <0x0 0xff210000 0x0 0x4000>;
};
```

Secure определяется в u-boot.dtsi; изменять не рекомендуется.

```text
secure_otp: secure_otp@0xff2a8000 {
    compatible = "rockchip,rk3308-secure-otp";
    reg = <0x0 0xff2a8000 0x0 0x4000>;
    secure_conf = <0xff2b0004>;
    mask_addr = <0xff540000>;
};
```

#### 5.7.4 Примеры вызова

Пример non-secure:

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

Пример secure:

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

#### 5.7.5 Доступные области

Secure OTP разрешает чтение/запись лишь некоторых областей; подробности в руководстве Rockchip OTP.

### 5.8 Ethernet

#### 5.8.1 Поддержка инфраструктуры

Код инфраструктуры:

```text
./net/*
./drivers/net/*
./drivers/net/phy/*
```

Код драйвера:

```text
./drivers/net/designware.c
./drivers/net/dwc_eth_qos.c
./drivers/net/gmac_rockchip.c
```

Настройка драйвера через menuconfig: у Rockchip две реализации Ethernet; при выборе ориентируйтесь на config соответствующего SDK.

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

dwc_eth_qos также требует nocache memory; пример RV1126:

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

Вручную включите нужные cmd-функции.

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

#### 5.8.2 Интерфейсы

Интерфейс инициализации структуры данных:

```text
void net_init(void);
int eth_register(struct eth_device *dev);
int phy_init(void);
```

Интерфейс регистрации устройства:

```text
int eth_register(struct eth_device *dev);
int phy_register(struct phy_driver *drv);
```

Сетевой обмен и доступ к PHY: приём/передача в U-Boot требуют явного вызова, не используют прерывания или опрос. Реализация — NetLoop().

```text
int eth_send(void *packet, int length);
int eth_rx(void);

int phy_read(struct phy_device *phydev, int devad, int regnum);
int phy_write(struct phy_device *phydev, int devad, int regnum, u16 val);
```

#### 5.8.3 Конфигурация DTS

DTS-узлы такие же, как у ядра. Проверьте параметры платы: phy-mode; сброс PHY snps,reset-gpio и snps,reset-delays-us; направление тактирования контроллера clock_in_out; источник и частоту assigned-clock-parents и assigned-clock-rates; для RGMII также delayline tx_delay и rx_delay.

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

#### 5.8.4 Примеры использования

Распространённые сетевые команды: DHCP

```text
Usage:
dhcp [loadAddress] [[hostIPaddr:]bootfilename]
```

С этой командой serverip, ipaddr и gateway задавать не нужно. Получив IP от DHCP-сервера, устройство скачивает файл через TFTP с hostIPaddr. Сеть 100M:

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

TFTP, сеть 1000M:

```text
Usage:
tftp [loadAddress] [[hostIPaddr:]bootfilename]
```

IP можно задать вручную:

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

#### 5.8.5 Диагностика сети

1. Проверьте сеть: выключен ли firewall ПК; задан ли gateway при переходе между подсетями; правильно ли настроен TFTP-сервер; не отключён ли TFTP на маршрутизаторе.

2. В коде проверьте три области. Pinctrl: правильность IOMUX и drive strength; сравните дамп регистров с ядром. Обычно сначала отлаживают сеть ядра, затем U-Boot. Тактирование: делители, источник и направление; большинство регистров в CRU, некоторые платформы используют GRF; сравните с ядром. Сброс PHY: правильность GPIO и соответствие сигнала сброса требованиям PHY.

### 5.9 Gpio

#### 5.9.1 Поддержка инфраструктуры

GPIO использует gpio-uclass и стандартные интерфейсы. Конфигурация:

```text
CONFIG_DM_GPIO
CONFIG_ROCKCHIP_GPIO
```

Код инфраструктуры:

```text
./drivers/gpio/gpio-uclass.c
```

Код драйвера:

```text
./drivers/gpio/rk_gpio.c
```

#### 5.9.2 Интерфейсы DM

Стандартный DM-интерфейс: доступ к GPIO через struct gpio_desc; рекомендуемый вариант.

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

dm_gpio_get_value() возвращает активность, а не физический уровень. Для gpios = &lt;&amp;gpio2 RK_PD0 GPIO_ACTIVE_LOW&gt; низкий уровень даёт 1, высокий 0; для GPIO_ACTIVE_HIGH — наоборот. Параметр value функции dm_gpio_set_value() также означает 1=active, 0=inactive.

#### 5.9.3 Устаревшие интерфейсы

Интерфейс совместимости сохраняет старые API U-Boot. Внутри используется DM, но struct gpio_desc скрыт от вызывающего. Работает, однако для стандартизации DM не рекомендуется.

```text
int gpio_request(unsigned gpio, const char *label)
int gpio_free(unsigned gpio)
int gpio_direction_input(unsigned gpio)
int gpio_direction_output(unsigned gpio, int value)
int gpio_get_value(unsigned gpio)
int gpio_set_value(unsigned gpio, int value)
```

@gpio вычисляется исходя из 32 контактов в группе GPIO и 8 контактов в каждом bank, например:

```text
gpio0_a7 = (0 * 32) + (0 * 8) + 7 = 7
gpio1_b6 = (1 * 32) + (1 * 8) + 6 = 46
gpio3_c2 = (3 * 32) + (2 * 8) + 2 = 114
```

@value имеет тот же смысл, что в интерфейсах dm_gpio_ выше.

### 5.10 Interrupt

#### 5.10.1 Поддержка инфраструктуры

Штатный U-Boot не имеет инфраструктуры прерываний. RK реализовал GICv2/v3, включённые по умолчанию. Применения: pwrkey пробуждает CPU из энергосберегающего сна при зарядке; Timer используется зарядкой и тестами; Debug — CONFIG_ROCKCHIP_DEBUGGER. Конфигурация:

```text
CONFIG_IRQ
CONFIG_GICV2
CONFIG_GICV3
```

Код инфраструктуры:

```text
./drivers/irq/irq-gpio-switch.c
./drivers/irq/irq-gpio.c
./drivers/irq/irq-generic.c
./drivers/irq/irq-gic.c
./drivers/irq/virq.c
./include/irq-generic.h
```

#### 5.10.2 Интерфейсы

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

Запрос IRQ: периферия с собственным аппаратным номером, например PWM/Timer, не требует преобразования. GPIO-пины собственного номера не имеют; преобразование возможно тремя способами. (1) Передать struct gpio_desc:

```text
// 此⽅法可以动态解析dts配置，⽐较灵活、常⽤。
int gpio_to_irq(struct gpio_desc *gpio);
```

Пример:

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

(2) Передать GPIO phandle и pin:

```text
// 此⽅法可以动态解析dts配置，⽐较灵活、常⽤。
int phandle_gpio_to_irq(u32 gpio_phandle, u32 pin);
```

Пример: IRQ RK817 подключён к GPIO0_A7:

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

(3) Явно указать GPIO:

```text
// 此⽅法直接强制指定 gpio，传⼊的 gpio 必须通过特殊的宏来声明才⾏，不够灵活，不建议使⽤。
int hard_gpio_to_irq(unsigned gpio);
```

Пример запроса IRQ GPIO0_A0:

```text
int gpio0_a0, irq;

// 为了⽰例简单，省去返回值判断
gpio0_a0 = RK_IRQ_GPIO(RK_GPIO0, RK_PA0);
irq = hard_gpio_to_irq(gpio0_a0);
irq_install_handler(irq, ...);
irq_handler_enable(irq);
```

### 5.11 I2C

#### 5.11.1 Поддержка инфраструктуры

I2C использует i2c-uclass и стандартные интерфейсы. Конфигурация:

```text
CONFIG_DM_I2C
CONFIG_SYS_I2C_ROCKCHIP
```

Код инфраструктуры:

```text
./drivers/i2c/i2c-uclass.c
```

Код драйвера:

```text
./drivers/i2c/rk_i2c.c
./drivers/i2c/i2c-gpio.c    // gpio模拟i2c通讯，⽬前⽤不到
```

#### 5.11.2 Интерфейсы

```text
// i2c 读写
int dm_i2c_read(struct udevice *dev, uint offset, uint8_t *buffer, int len)
int dm_i2c_write(struct udevice *dev, uint offset, const uint8_t *buffer, int len)

// 对上⾯接⼝的封装
int dm_i2c_reg_read(struct udevice *dev, uint offset)
int dm_i2c_reg_write(struct udevice *dev, uint offset, unsigned int val);
```

### 5.12 IO-Domain

#### 5.12.1 Поддержка инфраструктуры

Штатный U-Boot не поддерживает io-domain; RK реализует собственную поддержку. Конфигурация:

```text
CONFIG_IO_DOMAIN
CONFIG_ROCKCHIP_IO_DOMAIN
```

Код инфраструктуры:

```text
./drivers/power/io-domain/io-domain-uclass.c
```

Код драйвера:

```text
./drivers/power/io-domain/rockchip-io-domain.c
```

#### 5.12.2 Интерфейсы

```text
void io_domain_init(void)
```

Вызывать io_domain_init() вручную не нужно: включите настройки выше, инфраструктура U-Boot выполнит инициализацию автоматически.

### 5.13 Key

#### 5.13.1 Поддержка инфраструктуры

Штатный U-Boot не имеет поддержки кнопок; RK реализует собственную. Все кнопки определяются в DTS ядра/U-Boot, без hard code. Сначала ищется определение в DTS ядра, затем U-Boot. DTS U-Boot содержит только кнопку прошивки; при её изменении обновляйте оба DTS. Конфигурация:

```text
CONFIG_DM_KEY
CONFIG_RK8XX_PWRKEY
CONFIG_ADC_KEY
CONFIG_GPIO_KEY
CONFIG_RK_KEY
```

Код инфраструктуры:

```text
./include/dt-bindings/input/linux-event-codes.h
./drivers/input/key-uclass.c
./include/key.h
```

Код драйвера:

```text
./drivers/input/rk8xx_pwrkey.c    // ⽀持PMIC的pwrkey(RK805/RK809/RK816/RK817)
./drivers/input/rk_key.c          // ⽀持compatible = "rockchip,key"
./drivers/input/gpio_key.c        // ⽀持compatible = "gpio-keys"
./drivers/input/adc_key.c         // ⽀持compatible = "adc-keys"
```

pwrkey распознаётся только прерыванием; остальные GPIO-кнопки — опросом.

#### 5.13.2 Интерфейсы

Интерфейс:

```text
int key_read(int code)
```

Определения code:

```text
/include/dt-bindings/input/linux-event-codes.h
```

Возвращаемое значение:

```text
enum key_state {
    KEY_PRESS_NONE,      // ⾮完整的短按（没有释放按键）或⾮完整⻓按（按下时间不够⻓）；
    KEY_PRESS_DOWN,      // ⼀次完整的短按（按下=>释放）；
    KEY_PRESS_LONG_DOWN, // ⼀次完整的⻓按（可以不释放）；
    KEY_NOT_EXIST,       // 按键不存在
};
```

KEY_PRESS_LONG_DOWN по умолчанию требует 2000ms и используется только для долгого нажатия pwrkey при зарядке U-Boot.

```text
#define KEY_LONG_DOWN_MS    2000
```

Пример:

```text
int ret;

ret = key_read(KEY_VOLUMEUP);
...
```

### 5.14 Led

#### 5.14.1 Поддержка инфраструктуры

LED использует led-uclass.c и стандартные интерфейсы. Конфигурация:

```text
CONFIG_LED_GPIO
```

Код инфраструктуры:

```text
drivers/led/led-uclass // 默认编译
```

Код драйвера:

```text
drivers/led/led_gpio.c // ⽀持 compatible = "gpio-leds"
```

#### 5.14.2 Интерфейсы

```text
// 获取led device
int led_get_by_label(const char *label, struct udevice **devp);
// 设置/获取led状态
int led_set_state(struct udevice *dev, enum led_state_t state);
enum led_state_t led_get_state(struct udevice *dev);
// 忽略，⽬前未做底层驱动实现
int led_set_period(struct udevice *dev, int period_ms);
```

#### 5.14.3 Узел DTS

led_gpio.c U-Boot читает только три свойства LED-узла: gpios — управляющий контакт и активный уровень; label — имя; default-state — состояние, устанавливаемое при probe.

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

MTD (Memory Technology Device) поддерживает параллельную NAND, SPI NAND и SPI NOR.

#### 5.15.1 Поддержка инфраструктуры

```text
CONFIG_MTD=y
CONFIG_CMD_MTD=y
```

#### 5.15.2 Интерфейсы

Основные интерфейсы:

```text
struct mtd_info *get_mtd_device_nm(const char *name);
int mtd_read(struct mtd_info *mtd, loff_t from, size_t len, size_t *retlen, u_char *buf);
int mtd_write(struct mtd_info *mtd, loff_t to, size_t len, size_t *retlen, const u_char
*buf);
int mtd_erase(struct mtd_info *mtd, struct erase_info *instr);
int mtd_block_isbad(struct mtd_info *mtd, loff_t ofs);
int mtd_block_markbad(struct mtd_info *mtd, loff_t ofs);
```

#### 5.15.3 Примеры использования

Пример загрузки из SPI NOR: 0x800 bytes со смещения flash 0x400000 byte в память по адресу 0x4000000:

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

Для NAND используйте интерфейсы чтения/записи/стирания с распознаванием bad blocks из drivers/mtd/nand/nand_util.c. Для небольшой полной записи, обычно менее 2KB за включение, можно рассмотреть MTD_BLK; частые вызовы сокращают ресурс flash.

### 5.16 Mtd_blk

RK реализовал MTD block поверх MTD для параллельной NAND, SPI NAND и SPI NOR. Он регистрирует block-устройства с соответствующими интерфейсами. Единица — сектор 512B. Любая запись независимо от размера стирает соответствующий flash block; мелкие частые записи сокращают ресурс flash.

#### 5.16.1 Поддержка инфраструктуры

Конфигурация U-Boot:

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

Конфигурация SPL:

```text
CONFIG_MTD=y
CONFIG_CMD_MTDPARTS=y
CONFIG_MTD_DEVICE=y
CONFIG_SPL_MTD_SUPPORT=y

// 其他nand设备驱动config
......
```

Код инфраструктуры:

```text
drivers/mtd/mtd-uclass.c
drivers/mtd/mtdcore.c
drivers/mtd/mtd_uboot.c
drivers/mtd/mtd_blk.c
```

Драйверы контроллеров подключают операции чтения/записи и другие интерфейсы к MTD.

#### 5.16.2 Интерфейсы

```text
unsigned long blk_dread(struct blk_desc *block_dev, lbaint_t start,
                        lbaint_t blkcnt, void *buffer)
unsigned long blk_dwrite(struct blk_desc *block_dev, lbaint_t start,
                        lbaint_t blkcnt, const void *buffer)
```

### 5.17 Optee Client

U-Boot работает в Non-Secure World ARM TrustZone и обращается к защищённым ресурсам через OPTEE Client.

#### 5.17.1 Поддержка инфраструктуры

Штатный U-Boot не поддерживает OPTEE Client; RK реализует собственный. Конфигурация:

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

Инфраструктура и драйвер:

```text
lib/optee_clientApi/
```

#### 5.17.2 Примечания к прошивке

trust.img должен поддерживать TA, иначе взаимодействие с OPTEE Client невозможно.

#### 5.17.3 Описание интерфейсов

Драйвер находится в lib/optee_client. API описан в TEE_Client_API_Specification-V1.0_c.pdf: https://globalplatform.org/specs-library/tee-client-api-specification/. RK оборачивает функции встроенных TA в интерфейсы Optee Client. Исходник: lib\optee_clientApi\OpteeClientInterface.c; подключайте include\optee_include\OpteeClientInterface.h. Далее описаны отдельные API.

##### 5.17.3.1 Применимость

Применимость интерфейсов к платформам приведена в главе определений платформ.

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

##### 5.17.3.2 Возвращаемые значения

Если не указано иное, возвращаемые значения API описаны в разделе Return Codes документа TEE_Client_API_Specification-V1.0_c.pdf.

##### 5.17.3.3 trusty_base_write_security_data

```text
uint32_t trusty_base_write_security_data(char *filename,
                        uint32_t filename_size,
                        uint8_t *data,
                        uint32_t data_size)
```

Записывает данные в защищённое хранилище: RPMB для eMMC/UFS, security для других носителей, например NAND. CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION принудительно выбирает security. Параметры: [in] filename — имя; [in] filename_size — длина имени; [in] data — записываемые данные; [in] data_size — длина данных.

##### 5.17.3.4 trusty_base_read_security_data

```text
uint32_t trusty_base_read_security_data(char *filename,
                           uint32_t filename_size,
                           uint8_t *data,
                           uint32_t data_size)
```

Читает защищённое хранилище: RPMB для eMMC/UFS, security для других носителей, например NAND. CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION принудительно выбирает security. Параметры по исходнику: [in] filename — имя; [in] filename_size — длина имени; [in] data — читаемые данные; [in] data_size — длина чтения.

##### 5.17.3.5 trusty_read_vbootkey_hash

```text
uint32_t trusty_read_vbootkey_hash(uint32_t *buf, uint32_t length);
```

Читает hash открытого ключа Secure Boot из OTP/eFuse. См. Rockchip_Developer_Guide_Secure_Boot_Application_Note_EN. [out] buf — буфер hash; [in] length — длина hash в word (32bits), поддерживаемые длины/алгоритмы см. в руководстве Secure Boot.

##### 5.17.3.6 trusty_write_vbootkey_hash

```text
uint32_t trusty_write_vbootkey_hash(uint32_t *buf, uint32_t length);
```

Записывает hash открытого ключа в OTP/eFuse и одновременно включает Secure Boot flag. См. Rockchip_Developer_Guide_Secure_Boot_Application_Note_EN. [in] buf — hash; [in] length — длина в word (32bits), допустимые длины/алгоритмы согласно руководству Secure Boot.

##### 5.17.3.7 trusty_read_vbootkey_enable_flag

```text
uint32_t trusty_read_vbootkey_enable_flag(uint8_t *flag);
```

Читает признак включения Secure Boot; см. Rockchip_Developer_Guide_Secure_Boot_Application_Note_EN. Параметр по исходнику [in] flag — 1 Byte: 1 включено, 0 выключено.

##### 5.17.3.8 trusty_read_attribute_hash

```text
uint32_t trusty_read_attribute_hash(uint32_t *buf, uint32_t length)
```

Читает hash atx_permanent_attributes.bin для проверки его подлинности.

[out] buf — hash; [in] length — длина.

##### 5.17.3.9 trusty_write_attribute_hash

```text
uint32_t trusty_write_attribute_hash(uint32_t *buf, uint32_t length)
```

Записывает hash atx_permanent_attributes.bin. [in] buf — hash; [in] length — длина.

##### 5.17.3.10 trusty_write_oem_otp_key

```text
uint32_t trusty_write_oem_otp_key(enum RK_OEM_OTP_KEYID key_id,
                                  uint8_t *byte_buf,
                                  uint32_t byte_len);
```

Записывает открытый ключевой материал в указанную OEM OTP-область. См. Rockchip_Developer_Guide_OTP_CN. [in] key_id — обычно один из четырёх RK_OEM_OTP_KEY0–3; RV1126/RV1109 дополнительно поддерживают RK_OEM_OTP_KEY_FW, которым BootROM расшифровывает loader. trusty_oem_otp_key_cipher может использовать его для прикладного шифрования/дешифрования или расшифровки kernel image. [in] byte_buf — незашифрованный ключ; [in] byte_len — его длина: для RK_OEM_OTP_KEY_FW только 16, для остальных ключей

16, 24 или 32.

##### 5.17.3.11 trusty_oem_otp_key_is_written

```text
uint32_t trusty_oem_otp_key_is_written(enum RK_OEM_OTP_KEYID key_id, uint8_t *value);
```

Проверяет запись ключа в OEM OTP-область; свойства описаны в Rockchip_Developer_Guide_OTP_CN.

[in] key_id — индекс области: RK_OEM_OTP_KEY0–3, дополнительно RK_OEM_OTP_KEY_FW для RV1126/RV1109. [out] value — 1 записан, 0 не записан; действительно только при TEEC_SUCCESS 0x00000000. RK3588 также проверяет блокировку key_id и возвращает TEEC_ERROR_ACCESS_DENIED 0xFFFF0001 для заблокированного ключа.

##### 5.17.3.12 trusty_set_oem_hr_otp_read_lock

```text
uint32_t trusty_set_oem_hr_otp_read_lock(enum RK_OEM_OTP_KEYID key_id);
```

Устанавливает read lock OEM OTP-области. После успеха запись запрещена, а существующие данные недоступны CPU; ключ можно использовать через trusty_oem_otp_key_cipher. См. Rockchip_Developer_Guide_OTP_CN. Важно: блокировка RK_OEM_OTP_KEY0, KEY1 или KEY2 влияет и на другие OTP-области, например запрещает запись в некоторые из них; подробности в указанном руководстве. [in] key_id — RK_OEM_OTP_KEY0–3.

##### 5.17.3.13 trusty_oem_otp_key_cipher

```text
uint32_t trusty_oem_otp_key_cipher(enum RK_OEM_OTP_KEYID key_id,
                                   rk_cipher_config *config,
                                   uint32_t src_phys_addr,
                                   uint32_t dst_phys_addr,
                                   uint32_t len);
```

Выполняет одну cipher-операцию с ключом OEM OTP. [in] key_id — RK_OEM_OTP_KEY0–3, дополнительно RK_OEM_OTP_KEY_FW для RV1126/RV1109. [in] config — алгоритм, режим, ключ, IV и т. д.; AES/SM4, режимы ECB/CBC/CTS/CTR/CFB/OFB.

Длины ключей: 16/24/32 Bytes; на RV1109/RV1126 только 16/32, для RK_OEM_OTP_KEY_FW только 16. [in] src_phys_addr — адрес входного буфера, может совпадать с dst_phys_addr для in-place операции; [out] dst_phys_addr — выходной буфер, может совпадать с src_phys_addr; [in] len — длина входа/выхода в Byte с выравниванием по блоку алгоритма.

##### 5.17.3.14 trusty_read_oem_ns_otp

```text
uint32_t trusty_read_oem_ns_otp(uint32_t byte_off, uint8_t *byte_buf, uint32_t byte_len)
```

Читает Non-Protected OEM Zone безопасной OTP. [in] byte_off — смещение области; [out] byte_buf — результат, размер памяти не меньше byte_len; [in] byte_len — длина чтения.

##### 5.17.3.15 trusty_write_oem_ns_otp

```text
uint32_t trusty_write_oem_ns_otp(uint32_t byte_off, uint8_t *byte_buf, uint32_t byte_len)
```

Записывает Non-Protected OEM Zone безопасной OTP. [in] byte_off — смещение; [in] byte_buf — данные; [in] byte_len — длина.

##### 5.17.3.16 trusty_write_ta_encryption_key

```text
uint32_t trusty_write_ta_encryption_key(uint32_t *buf, uint32_t length)
```

Записывает ключ шифрования TA. [in] buf — ключ; [in] length — длина.

##### 5.17.3.17 trusty_ta_encryption_key_is_written

```text
uint32_t trusty_ta_encryption_key_is_written(uint8_t *value)
```

Проверяет запись ключа шифрования TA. [out] value — 0 не записан, 1 записан.

##### 5.17.3.18 trusty_write_oem_encrypt_data

```text
uint32_t trusty_write_oem_encrypt_data(uint32_t *buf, uint32_t length)
```

Записывает частные данные защиты от копирования платы. [in] buf — данные; [in] length — длина.

##### 5.17.3.19 trusty_oem_encrypt_data_is_written

```text
uint32_t trusty_oem_encrypt_data_is_written(uint8_t *value)
```

Проверяет запись частных данных защиты от копирования платы. [out] value — 0 не записаны, 1 записаны.

##### 5.17.3.20 trusty_check_security_level_flag

```text
uint32_t trusty_check_security_level_flag(uint8_t flag)
```

Задаёт сильный/слабый уровень безопасности TEE. [in] flag — уровень безопасности.

##### 5.17.3.21 trusty_write_oem_huk

```text
uint32_t trusty_write_oem_huk(uint32_t *buf, uint32_t length)
```

Записывает OEM HUK. [in] buf — данные; [in] length — длина.

#### 5.17.4 Общая память

Обмен U-Boot/OPTEE использует shared memory. Выделяйте её через TEEC_AllocateSharedMemory(), желательно не более 1M; большие данные разбивайте на несколько передач. Освобождайте через TEEC_ReleaseSharedMemory().

#### 5.17.5 Тестовые команды

Проверка защищённого хранилища из командной строки U-Boot:

```text
=> mmc testsecurestorage
```

Тест циклически читает и пишет защищённое хранилище. Для eMMC проверяет RPMB и security; для NAND только security.

#### 5.17.6 Типовые сообщения ошибок

eMMC/NAND не найдены; проверьте настройки U-Boot и исправность аппаратуры.

```text
"TEEC: Could not find device"
```

Раздел security не найден. При отсутствии RPMB определите security в parameter.txt.

```text
"TEEC: Could not find security partition"
```

Сообщение появляется при первом использовании security или несанкционированном изменении его данных.

```text
"TEEC: verify [%d] fail, cleanning ...."
```

Недостаточно защищённого хранилища: проверьте размер данных и не удалённые старые данные.

```text
"TEEC: Not enough space available in secure storage !"
```

### 5.18 PCIe

#### 5.18.1 Указания разработчику

Определите стадию U-Boot, на которой нужен PCIe, и настройте DTS соответственно:

1. Загрузочный NVMe требует ранней инициализации: вся следующая прошивка находится на нём, поэтому PCIe использует только DTS U-Boot.

2. Не загрузочные устройства, например сетевые карты, допускают позднюю инициализацию; можно использовать Kernel DTB из boot.img.

3. PCIe RC U-Boot регистрирует только mem 32bits range, не mem 64bits-pref.

#### 5.18.2 Поддержка инфраструктуры

Код инфраструктуры:

```text
./drivers/pci/*
./drivers/phy/*
```

Код драйвера:

```text
drivers/pci/pcie_dw_rockchip.c
drivers/phy/phy-rockchip-snps-pcie3.c
drivers/phy/phy-rockchip-naneng-combphy.c
```

Настройка драйвера через menuconfig: платформы Rockchip PCIe перечислены в compatible файла pcie_dw_rockchip.c; при выборе ориентируйтесь на config SDK.

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

#### 5.18.3 Конфигурация DTS

Выбор стадии: flash + PCIe NVMe — до Kernel DTB; AMP — после Embedded DTB; общий случай — после Kernel DTB. Для раннего PCIe перенесите настройки узлов Kernel DTB в U-Boot DTSI с u-boot,dm-pre-reloc: питание PHY (можно пропустить, если уже включено), vcc 3v3, PHY и контроллер. Пример RK3588 PCIe3x4:

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

Пример RK3566:

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

PCIe после Embedded DTB: встроенный DTB изолирует U-Boot от изменений Kernel DTB и подходит продуктам без ядра. Обычно используется стандартный DTB ядра. Сначала соберите ядро для получения нужного DTB, затем включите Embedded DTB в U-Boot:

```text
CONFIG_EMBED_KERNEL_DTB=y
CONFIG_EMBED_KERNEL_DTB_ALWAYS=y
CONFIG_EMBED_KERNEL_DTB_PATH=”./dts/rk⽬标芯⽚-⽬标设备.dtb“  # 例如
CONFIG_EMBED_KERNEL_DTB_PATH="dts/rk3588-evb1.dtb"
```

Соберите U-Boot image. Для AMP без раннего PCIe и без ядра, но с необходимостью перечисления PCIe до загрузки AMP, используйте следующий патч для перечисления в загрузочном процессе:

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

PCIe после Kernel DTB: вызовы можно разместить после стадии «RK u-boot using kernel DTB», напрямую используя Kernel DTB. См. документацию настройки PCIe ядра.

#### 5.18.4 Примеры использования

Основные команды:

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

dcache flush/clean включается CONFIG_CMD_CACHE; требуется следующий патч поддержки:

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

dcache flush/clean включается CONFIG_CMD_CACHE; требуется следующий патч поддержки:

```text
commit b46a81a12dd4a1514a6522e33a1d16194f242d62
Author: Joseph Chen <chenjh@rock-chips.com>
Date:   Wed Sep 28 01:36:45 2022 +0000

    cmd: cache: Add flush/invalidate dcache range support

    Signed-off-by: Joseph Chen <chenjh@rock-chips.com>
    Change-Id: Id0e0cd9019072e8c557ebd2987b439057cb4ae3b
```

#### 5.18.5 Разбор типовых проблем

Отключение энергосбережения PCIe ASPM в U-Boot RK3568 Linux5.10: контроллер по умолчанию уже отключает ASPM. Проверка PCIe3x2 из U-Boot shell:

```text
pci display.l 20.00.00 0x80 1
```

BITS[1:0] — PCIE_CAP_ACTIVE_STATE_LINK_PM_CONTROL:

```text
Values:
0x0 (DISABLED): Disabled
0x1 (L0S_ENTRY_EN): L0s Entry Enabled
0x2 (L1_ENTRY_En): L1 Entry Enabled
0x3 (L0S_L1_ENTRY_EN): L0s and L1 Entry Enabled
```

Ограничения доступа RC DMA к FPGA: поведение BAR зависит от устройства. Некоторые принимают memory read/write TLP различной длины, другие только 4Bytes. Во втором случае CPU нормально обращается к BAR, но запросы RC DMA с длиной более 4B могут давать ошибки, например ca abort.

```text
## Chapter-5 RK3568 DMA read ca abort 信息
=> md.l 0xf63800b8 1
f63800b8: 00000100                               ....
```

Для анализа используйте TLP trigger PCIe-анализатора, а не memory trigger: после ошибки без cpl последний не сработает. Предполагается, что при запросе длиннее 4B периферия ограничивает доступ к шине, вызывая ca abort; конкретную причину должен помочь установить её производитель.

### 5.19 Pinctrl

#### 5.19.1 Поддержка инфраструктуры

Pinctrl использует pinctrl-uclass и стандартные интерфейсы. Конфигурация:

```text
CONFIG_PINCTRL_GENERIC
CONFIG_PINCTRL_ROCKCHIP
```

Код инфраструктуры:

```text
./drivers/pinctrl/pinctrl-uclass.c
```

Код драйвера:

```text
./drivers/pinctrl/pinctrl-rockchip.c
```

#### 5.19.2 Интерфейсы

```text
int pinctrl_select_state(struct udevice *dev, const char *statename)    // 设置状态
int pinctrl_get_gpio_mux(struct udevice *dev, int banknum, int index)   // 获取状态
```

При probe каждого драйвера pinctrl автоматически устанавливает состояние default; обычно ручные вызовы не нужны.

### 5.20 Pmic/Regulator

#### 5.20.1 Поддержка инфраструктуры

PMIC/Regulator использует pmic-uclass, regulator-uclass и стандартные интерфейсы. Поддержка PMIC:

```text
rk805/rk808/rk809/rk816/rk817/rk818
```

Поддерживаемые регуляторы:

```text
rk805/rk808/rk809/rk816/rk817/rk818/syr82x/tcs452x/fan53555/pwm/gpio/fixed
```

Конфигурация:

```text
CONFIG_DM_PMIC
CONFIG_PMIC_CHILDREN
CONFIG_PMIC_RK8XX        // 适⽤于⽬前所有RK8XX系列芯⽚
CONFIG_DM_REGULATOR
CONFIG_REGULATOR_PWM
CONFIG_REGULATOR_RK8XX   // 适⽤于⽬前所有RK8XX系列芯⽚
CONFIG_REGULATOR_FAN53555
```

Код инфраструктуры:

```text
./drivers/power/pmic/pmic-uclass.c
./drivers/power/regulator/regulator-uclass.c
```

Файл драйвера:

```text
./drivers/power/pmic/rk8xx.c
./drivers/power/regulator/rk8xx.c
./drivers/power/regulator/fixed.c
./drivers/power/regulator/gpio-regulator.c
./drivers/power/regulator/pwm_regulator.c
./drivers/power/regulator/fan53555_regulator.c
```

#### 5.20.2 Интерфейсы

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

#### 5.20.3 Начальное напряжение

Начальное напряжение регулятора задаётся двумя способами при обязательном regulator-boot-on: одинаковые пределы напряжения либо regulator-init-microvolt = &lt;...&gt;. Исходная строка дважды называет regulator-min-microvolt; не следует выводить корректное имя второго свойства только из этого текста — сверяйте DTS/драйвер.

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

#### 5.20.4 Пропуск инициализации

Для пропуска инициализации регулятора добавьте regulator-loader-ignore.

```text
vdd_arm: DCDC_REG1 {
    regulator-name = "vdd_arm";
    regulator-loader-ignore;// 仅对U-Boot阶段的regulator初始化有效，kernel⽆效
    ......
};
```

### 5.21 Reset

#### 5.21.1 Поддержка инфраструктуры

Reset использует reset-uclass.c и стандартные интерфейсы. На RK это программный сброс через CRU. Конфигурация:

```text
CONFIG_DM_RESET
CONFIG_RESET_ROCKCHIP
```

Код инфраструктуры:

```text
./drivers/reset/reset-uclass.c
```

Код драйвера:

```text
./drivers/reset/reset-rockchip.c
```

#### 5.21.2 Интерфейсы

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

Пример:

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

#### 5.21.3 Конфигурация DTS

Reset включён по умолчанию; достаточно указать объект сброса в узле периферии:

```text
// 格式：
reset-names = <name-string-list>
resets = <cru-phandle-list>
```

Например, gmac2phy:

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

#### 5.22.1 Поддержка инфраструктуры

RNG реализует аппаратный генератор случайных чисел. Код инфраструктуры:

```text
./drivers/rng/rng-uclass.c
```

Код драйвера:

```text
./drivers/rng/rockchip_rng.c
```

Конфигурация:

```text
CONFIG_DM_RNG=y
CONFIG_RNG_ROCKCHIP=y
```

#### 5.22.2 Интерфейсы

```text
// @buffer: 保存随机数输出
// @size: 随机数⻓度，单位：byte
int dm_rng_read(struct udevice *dev, void *buffer, size_t size)
```

#### 5.22.3 Конфигурация DTS

RNG — часть аппаратного Crypto; как у Crypto, имеются V1/V2. Два варианта compatible узла RNG:

```text
compatible = "rockchip,cryptov1-rng";
compatible = "rockchip,cryptov2-rng";
```

Полные примеры узлов: rv1126.dtsi, rk3568.dtsi, rk3399.dtsi.

### 5.23 Spi

#### 5.23.1 Поддержка инфраструктуры

Код инфраструктуры:

```text
./drivers/spi/spi-uclass.c
```

Код драйвера:

```text
./drivers/spi/rk_spi.c
```

Конфигурация menuconfig:

```text
CONFIG_ROCKCHIP_SPI=y
CONFIG_CMD_SPI=y
```

#### 5.23.2 Интерфейсы

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

#### 5.23.3 Конфигурация DTS

```text
&spi0 {
        u-boot,dm-pre-reloc;
        status = "okay";
};
```

#### 5.23.4 Примеры вызова

Рекомендуемый пример — drivers/power/power_spi.c. Простой demo:

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

Частота SPI задаётся свойством spi-max-frequency дочернего DTS-узла либо при spi_get_bus_and_cs/spi_setup_slave.

#### 5.23.5 Тестовые команды

Команды cmd_spi:

```text
sspi 3:0.0 24 AAA           # bus3:cs0:mode0 传输⻓度为24bits 传输数据为 "AAA"
```

#### 5.23.6 Разбор типовых проблем

Вопрос 1: Нет сигнала? Проверьте IOMUX и clock. Вопрос 2: Сбой cmd_spi RK3399? На стадии команд используется Kernel DTB; проверьте SPI в aliases kernel rk3399.dtsi. Вопрос 3: Отказ spi_setup_slave? Узлу SPI bus нужен дочерний девайс. U-Boot предоставляет стандартный generic_1:0 с драйвером spi_generic_drv; укажите его в spi_setup_slave. Вопрос 4: Как проверить частоту SPI U-Boot? Включите debug:

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

Пример проверки cmd/spi.c; ключевые сообщения debug:

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

Драйверы хранения используют стандартную инфраструктуру и подключаются к BLK для поддержки файловых систем. Поддерживаются eMMC, NAND flash, SPI NAND и SPI NOR. Инфраструктура flash:

| Схема | Основные типы памяти | Драйвер контроллера | Подсистема flash | Тип регистрируемого устройства | Основные файловые системы |
| --- | --- | --- | --- | --- | --- |
| Схема rknand | MLC TLC<br>Nand | drivers/rkand | drivers/rkand | Устройство block | FAT、EXT、<br>SquashFS |
| Схема rkflash | SLC Nand、<br>SPI Nand | drivers/rkflash | drivers/rkflash | Устройство block | FAT、EXT、<br>SquashFS |
| Схема rkflash (поддержка SPI Nor) | SPI Nor | drivers/rkflash | drivers/rkflash | Устройство block или mtd | SquashFS、<br>JFFS2 |
| Открытая схема SLC Nand | SLC Nand | drivers/mtd/nand/raw | drivers/mtd/nand/raw | Устройство mtd | UBI |
| Открытая схема SPI Nand | SPI Nand | drivers/spi/rockchip_sfc.c | drivers/mtd/nand/raw | Устройство mtd | UBI |
| Открытая схема SPI Nor | SPI Nor | drivers/spi/rockchip_sfc.c | drivers/mtd/spi | Устройство mtd или mtd block | SquashFS、<br>JFFS2 |

Пояснение:

1. Главное отличие NAND-поддержки rkflash от открытой реализации: rkflash включает RK FTL (Flash Transfer Layer) в драйвер; открытая реализация полагается на управление flash файловой системой, например bad-block management и wear leveling UBI.

#### 5.24.1 Поддержка инфраструктуры

rknand предназначен для NAND большой ёмкости и взаимодействует с устройством через NANDC host. Выбор микросхем — RKNandFlashSupportList; поддерживаются SLC/MLC/TLC NAND. Конфигурация:

```text
CONFIG_RKNAND
```

Файл драйвера:

```text
./drivers/rknand/
```

rkflash предназначен для небольшой ёмкости: NAND через NANDC host, SPI flash через SFC host. Выбор микросхем — RKSpiNor and SLC Nand SupportList. Поддерживаются SLC NAND 128MB/256MB/512MB, некоторые SPI NAND

и некоторые SPI NOR. Конфигурация:

```text
CONFIG_RKFLASH

CONFIG_RKNANDC_NAND  /* ⼩容量并⼝Nand flash */
CONFIG_RKSFC_NOR     /* SPI Nor flash */
CONFIG_RKSFC_NAND    /* SPI Nand flash */
```

Файл драйвера:

```text
./drivers/rkflash/
```

Примечания:

1. SFC (serial flash controller) — специализированный модуль Rockchip для упрощённой поддержки SPI flash.

2. FTL в rknand и NAND-коде rkflash несовместимы: CONFIG_RKNAND нельзя сочетать с CONFIG_RKNANDC_NAND или CONFIG_RKSFC_NAND.

MMC и SD: MMC — мультимедийные карты, например eMMC; SD — полупроводниковая flash-память. На Rockchip они используют общий dw_mmc, кроме RK3399/RK3399Pro. Конфигурация:

```text
CONFIG_MMC_DW=y
CONFIG_MMC_DW_ROCKCHIP=y
CONFIG_CMD_MMC=y
```

Файл драйвера:

```text
./drivers/mmc/
```

Открытая реализация SLC NAND/SPI NAND/SPI NOR: благодаря развитию сообщества и UBI RK расширил использование открытого кода. По умолчанию pre-loader — SPL, поэтому большинство настроек связано со SPL. Конфигурация:

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

Удалите настройки rkflash/rknand:

```text
CONFIG_RKFLASH=n
CONFIG_RKNAND=n
```

Файл драйвера:

```text
./drivers/mtd/nand/raw          //SLC Nand 主控驱动及协议层
./drivers/mtd/nand/spi          //SPI Nand 协议层
./drivers/spi/rockchip_sfc.c    //SPI Flash 主控驱动
./drivers/mtd/spi               //SPI Nor 协议层
```

#### 5.24.2 Интерфейсы

Все драйверы хранения подключены к BLK, поэтому любые носители доступны через следующие интерфейсы:

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

#### 5.24.3 Определение типа

Тип текущего загрузочного носителя определяется двумя способами: строковыми переменными окружения devtype/devnum либо полями if_type/devnum текущего struct blk_desc.

| devtype | if_type | devnum | Тип накопителя | Примечания |
| --- | --- | --- | --- | --- |
| mmc | IF_TYPE_MMC | 0 | eMMC | - |
| mmc | IF_TYPE_MMC | 1 | SD card | - |
| mtd | IF_TYPE_MTD | 0 | Nand | Открытая схема mtd |
| mtd | IF_TYPE_MTD | 1 | SPI Nand | Открытая схема mtd |
| mtd | IF_TYPE_MTD | 2 | SPI Nor | Открытая схема mtd |
| rknand | IF_TYPE_RKNAND | 0 | Nand | Схема rkflash |
| spinand | IF_TYPE_SPINAND | 0 | SPI Nand | Схема rkflash |
| spinor | IF_TYPE_SPINOR | 1 | SPI Nor | Схема rkflash |
| nvme | IF_TYPE_NVME | 0 | SSD | - |
| scsi | IF_TYPE_SCSI | 0 | SATA | - |

#### 5.24.4 Конфигурация DTS

Конфигурация eMMC:

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

Конфигурация NANDC:

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

Конфигурация SFC:

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

Примечание:

1. Ради программной совместимости U-Boot поддерживает только однолинейную передачу SPI flash spi-tx-bus-width = &lt;1&gt;.

#### 5.24.5 Двойное хранилище

Подробности: Rockchip_Developer_Guide_Dual_Storage_CN.pdf.

#### 5.24.6 Разбор типовых проблем

Как настроить и проверить частоту FSPI/SFC открытой реализации? Задайте spi-max-frequency дочернего устройства SFC в rkxxxx-u-boot.dtsi, отключите неиспользуемые дочерние устройства и включите debug драйвера:

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

#### 5.25.1 Поддержка инфраструктуры

Thermal получает температуру чипа от TSADC, по умолчанию CPU. Код инфраструктуры:

```text
./drivers/thermal/thermal-uclass.c
```

Код драйвера:

```text
./drivers/thermal/rockchip_thermal.c
```

Конфигурация:

```text
CONFIG_DM_THERMAL=y
CONFIG_ROCKCHIP_THERMAL=y
```

#### 5.25.2 Интерфейсы

```text
// @temp: 保存获取到的温度
int thermal_get_temp(struct udevice *dev, int *temp)
```

#### 5.25.3 Конфигурация DTS

DTS ядра обычно уже полностью настроен и включён.

### 5.26 Uart

Serial использует serial-uclass.c и стандартные интерфейсы; основное применение — UART debug. Конфигурация:

```text
// 使能配置
CONFIG_DEBUG_UART
CONFIG_SYS_NS16550

// 参数配置
CONFIG_DEBUG_UART_BASE
CONFIG_DEBUG_UART_CLOCK
CONFIG_BAUDRATE
```

Код инфраструктуры:

```text
./drivers/serial/serial-uclass.c
```

Код драйвера:

```text
./drivers/serial/ns16550.c
```

#### 5.26.1 Локальная замена

Замена UART debug только для U-Boot, пример UART2: отключите CONFIG_ROCKCHIP_PRELOADER_SERIAL; настройте UART IOMUX в board_debug_uart_init(), включая режим m0/m1 при наличии; там же задайте clock с источником 24Mhz; обновите CONFIG_BAUDRATE и CONFIG_DEBUG_UART_BASE в defconfig; добавьте два обязательных свойства и включите UART-узел U-Boot:

```text
&uart2 {
    u-boot,dm-pre-reloc;
    clock-frequency = <24000000>;
    status = "okay";
};
```

Укажите stdout-path в chosen U-Boot:

```text
chosen {
    stdout-path = &uart2;
};
```

#### 5.26.2 Глобальная замена

Pre-loader serial позволяет DDR, miniloader, BL31, OP-TEE и U-Boot совместно использовать UART debug. Ранний DDR bin настраивает UART и передаёт параметры следующим стадиям через ATAGS; они применяют их, кроме ядра. Для общей замены UART измените настройки DDR bin. Репозиторий rkbin содержит инструмент настройки параметров, включая UART:

```text
tools/ddrbin_tool
tools/ddrbin_param.txt
tools/ddrbin_tool_user_guide.txt
```

Конфигурация U-Boot

1. Включите настройку:

```text
CONFIG_ROCKCHIP_PRELOADER_SERIAL  // 已经默认使能
```

2. В rkxx-u-boot.dtsi добавьте u-boot,dm-pre-reloc; используемому UART.
3. Создайте serial aliases: U-Boot ищет и инициализирует узел через aliases. В ./arch/arm/dts/rk1808-u-boot.dtsi для удобства aliases созданы всем UART.

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

#### 5.26.3 Отключение вывода

```text
CONFIG_DISABLE_CONSOLE=y
```

#### 5.26.4 Интерфейсы

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

USB U-Boot включает Device, Host, PHY и периферийные драйверы. Далее рассмотрены инфраструктура, настройки платы и команды.

#### 5.27.1 Поддержка инфраструктуры

Device использует Gadget без DM_USB, обычно rockusb или fastboot для обновления и проверки прошивок. Rockusb основан на UMS, его state machine встроена через HOOK; см. драйвер. Контроллеры Device — DWC2/DWC3; обычно чип содержит один тип OTG, поэтому включают только его CONFIG. Конкретный тип уточняется по TRM или Rockchip USB guide. Конфигурация:

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

Код инфраструктуры:

```text
// gadget框架
drivers/usb/gadget/g_dnl.c
drivers/usb/gadget/g_dnl.c
drivers/usb/gadget/config.c
drivers/usb/gadget/epautoconf.c
drivers/usb/gadget/usbstring.c
drivers/usb/gadget/f_mass_storage.c
```

Код драйвера:

```text
// rockusb
cmd/rockusb.c
drivers/usb/gadget/f_rockusb.c

// controller
drivers/usb/gadget/dwc2_udc_otg* // dwc2 OTG控制器
drivers/usb/dwc3 // dwc3 OTG控制器
```

Host включает OHCI/EHCI/xHCI; xHCI поддерживает USB3, но имеется не на всех чипах, см. TRM/USB guide. Используются upstream-драйверы с DM_USB, поэтому основная работа — адаптация DTS контроллера. Конфигурация:

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

Код инфраструктуры:

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

USB PHY включает USB2/USB3 PHY, использует DM_USB и совместим с Kernel DTB. Наличие конкретного IP см. TRM/Rockchip USB PHY guide. Конфигурация:

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

Код инфраструктуры:

```text
drivers/phy/phy-uclass.c
```

Код драйвера:

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

Прочая периферия: USB HUB, USB-клавиатура и UMS. Конфигурация:

```text
// USB键盘
CONFIG_USB_KEYBOARD=y
CONFIG_USB_KEYBOARD_FN_KEYS=y // ⽀持F1-F12, INS, HOME等快捷键。

// USB存储设备
CONFIG_USB_STORAGE=y
```

Код инфраструктуры:

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

#### 5.27.2 Настройки платы

Device не использует DM_USB, поэтому свойства контроллера, например адрес и TX FIFO, задаются в Board-файле.

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

Для USB-клавиатуры как стандартного ввода U-Boot добавьте usbkbd в stdin, например:

```text
// 环境变量配置位于各板级头⽂件中
// include/configs/evb_rk3568.h

#define ROCKCHIP_DEVICE_SETTINGS \
        "stdin=serial,usbkbd\0" \
```

#### 5.27.3 Конфигурация DTS

USB Device без DM_USB не требует DT-узлов. Host/PHY совместимы с Kernel DTB, который можно использовать напрямую; для U-Boot DTB ориентируйтесь на соответствующие узлы ядра.

#### 5.27.4 Команды

rockusb

```text
rockusb - Use the rockusb Protocol

Usage:
rockusb <USB_controller> <devtype> <dev[:part]>  e.g. rockusb 0 mmc 0
```

Три способа входа в режим обновления U-Boot loader:

Кнопки reset + recovery (в исходнике revovery); указанная выше команда rockusb в консоли U-Boot; либо reboot loader из работающей системы.

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

U-Boot не поддерживает USB hotplug: команды необходимы для перечисления и отключения. usb start/usb reset разбирают контроллер и сканируют устройства всех портов; usb stop отключает всё и удаляет устройство контроллера; usb info/usb tree показывают контроллеры и подключённые устройства; usb storage и его подкоманды предназначены для UMS, см. справку команд. Настройку fastboot см. в главе 4, системные модули.

### 5.28 Vendor Storage

Vendor Storage хранит небольшие незашифрованные данные, например SN и MAC, в зарезервированной области NVM (eMMC/NAND и др.). Несколько копий сохраняют данные при обновлении и повышают надёжность. Подробности: appnote rk vendor storage.

#### 5.28.1 Обзор принципа

Блок Vendor Storage разделён на vendor0, vendor1, vendor2 и vendor3. В hdr каждого vendorX (X=0,1,2,

3) есть монотонно возрастающая version, обозначающая обновление. Чтение использует максимальную version; запись увеличивает её и переносит старые и новые данные в vendorX+1. Например, данные из vendor2 после изменения записываются в vendor3. Это простая мера защиты.

#### 5.28.2 Поддержка инфраструктуры

U-Boot не поддерживает Vendor Storage штатно; Rockchip реализует собственный драйвер. Конфигурация:

```text
CONFIG_ROCKCHIP_VENDOR_PARTITION
```

Файл драйвера:

```text
./arch/arm/mach-rockchip/vendor.c
./arch/arm/include/asm/arch-rockchip/vendor.h
```

#### 5.28.3 Интерфейсы

```text
int vendor_storage_read(u16 id, void *pbuf, u16 size)
int vendor_storage_write(u16 id, void *pbuf, u16 size)
```

Определения и применение id см. в appnote rk vendor storage.

#### 5.28.4 Самопроверка

Самопроверка Vendor Storage: rktest vendor в последовательной консоли U-Boot.

### 5.29 Watchdog

#### 5.29.1 Поддержка инфраструктуры

Watchdog использует wdt-uclass.c и стандартные интерфейсы. Конфигурация:

```text
CONFIG_WDT
CONFIG_ROCKCHIP_WATCHDOG
```

Код инфраструктуры:

```text
./drivers/watchdog/wdt-uclass.c
```

Код драйвера:

```text
./drivers/watchdog/rockchip_wdt.c
```

#### 5.29.2 Интерфейсы

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

Стандартный процесс U-Boot не включает и не использует WDT; активируйте согласно требованиям продукта.

## 6 Углублённые принципы

### 6.1 kernel-DTB

#### 6.1.1 Предпосылки

В исходной архитектуре U-Boot каждой плате соответствует собственный DTS; полученный DTB включается в образ U-Boot. Поэтому для N плат одной SoC требуется N образов. Однако платы одной SoC отличаются главным образом периферией, а ядро SoC одинаково. Чтобы использовать один образ U-Boot на платформу SoC, RK добавила механизм kernel DTB: на ранней стадии происходит переключение на DTB ядра, по которому инициализируется периферия. Так учитываются различия display, pmic/regulator, pinctrl, clk и других устройств. Для kernel DTB необходим OF_LIVE (live device tree, сокращённо live-dt).

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

Предпосылки и принцип: после добавления kernel DTB на стадии U-Boot существуют два DTB. Накопитель, UART, Crypto и некоторые другие модули используют DTB U-Boot; остальные — DTB ядра. Обе группы могут поочерёдно обращаться к своим узлам, но gd-&gt;fdt_blob может указывать только на один DTB, и произвольно переключать его неудобно. Нельзя и наложить узлы DTS U-Boot на DTS ядра: последний в итоге передаётся самому ядру. Live DT решает проблему так: при инициализации U-Boot сканирует весь DTB, преобразует узлы в связанный список struct device_node и связывает их с конкретными device-driver. Затем драйвер обращается непосредственно к собственному device_node, а не к исходному DTB. В результате оба DTB связаны каждый со своей группой device-driver, и непосредственный доступ к файлам DTB больше не требуется. Конфликт доступа к двум DTB устранён. Подробнее:

```text
./doc/driver-model/livetree.txt
```

Переход между FDT и live DT: тип ofnode (include/dm/ofnode.h) является общей оболочкой для обоих представлений. Для live DT узел доступен через device_node, для FDT — через offset. Если драйвер должен поддерживать оба типа, используйте ofnode. Структура ofnode:

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

Функции с префиксами dev_ и ofnode_ поддерживают оба способа доступа; of_ — только live DT; fdtdec_ и fdt_ — только FDT.

#### 6.1.3 Реализация механизма

Переключение kernel DTB реализовано в init_kernel_dtb() файла ./arch/arm/mach-rockchip/board.c. К этому моменту DTS U-Boot уже просканирован, драйверы mmc/nand/nor работают. DTB ядра читается из прошивки, создаётся дерево live DT, привязываются все device-driver, затем gd-&gt;fdt_blob переключается на DTB ядра.

#### 6.1.4 U-Boot

После сборки в ./dts/ создаются два DTB. dt.dtb компилируется из DTS, указанного CONFIG_DEFAULT_DEVICE_TREE в defconfig. dt-spl.dtb получается извлечением из dt.dtb всех узлов со свойством u-boot,dm-pre-reloc и удалением свойств из CONFIG_OF_SPL_REMOVE_PROPS. Обычно остаются только узлы, необходимые UART, DDR и накопителям: DMC, UART, MMC, NAND, GRF, CRU и т. п. Без CONFIG_USING_KERNEL_DTB используется dt.dtb, с ним — dt-spl.dtb. В конце сборки выбранный файл переименовывается в u-boot.dtb и добавляется в конец u-boot.bin. Содержимое u-boot.dtb можно проверить командой fdtdump.

### 6.2 Передача параметров ядру

В этом разделе описана передача параметров из U-Boot ядру.

#### 6.2.1 cmdline

U-Boot читает /chosen/bootargs из DTB ядра, изменяет или дополняет содержимое и записывает его обратно в /chosen/bootargs, передавая таким образом cmdline.

#### 6.2.2 Объём памяти

U-Boot изменяет узел /memory в DTB ядра, записывая доступный объём памяти. Соответствующие сведения выводятся при загрузке:

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

#### 6.2.3 Другие способы

Остальные способы передачи параметров также сводятся к изменению DTB ядра. Например:

| Узел/свойство | Операция | Назначение |
| --- | --- | --- |
| /serial-number | Создать | Серийный номер |
| /memory | Изменить | Память, видимая ядру |
| /display-subsystem/route/route-edp/ | Добавить | Параметры дисплея (пример edp) |
| /chosen/linux,initrd-start | Создать | Начальный адрес ramdisk |
| /chosen/linux,initrd-end | Создать | Конечный адрес ramdisk |
| /bootargs | Изменить | cmdline, видимая ядру |
| mac-address или local-mac-address узла GMAC | Изменить | MAC-адрес |
| arch/arm/mach-rockchip/board.c: board_fdt_fixup() | Изменить | Исправление fdt на уровне платы |

### 6.3 Система A/B

#### 6.3.1 Формат данных A/B

Структура данных A/B находится по смещению 2 KB в разделе misc.

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

На накопителях малой ёмкости без misc, но с разделом vendor данные можно хранить в vendor. Добавляется lastboot, обозначающий последнюю загружаемую прошивку. Это полезно при низком заряде или заводских испытаниях, когда попытки retry исчерпаны ещё до входа в систему и вызова службы boot_ctrl. Пример:

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

В AvbABSlotData также добавляется флаг is_update для обозначения состояния обновления системы:

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

Значения параметров приведены в таблицах. AvbABData:

| Параметр | Значение |
| --- | --- |
| priority | Приоритет слота: 0 — незагрузочный, 15 — максимальный |
| tries_remaining | Попытки загрузки, установлено 7 |
| successful_boot | Устанавливается после загрузки: 1 — слот успешно загружен, 0 — нет |
| is_update | Статус обновления слота: 1 — обновляется; 0 — не обновлялся или обновлён |

AvbABSlotData:

| Параметр | Значение |
| --- | --- |
| magic | Заголовок структуры: \0AB0 |
| version_major | Основная версия |
| version_minor | Дополнительная версия |
| slots | Сведения загрузки слота; см. AvbABData |
| last_boot | Последний успешно загруженный слот: 0 A, 1 B |
| crc32 | Проверка данных |

#### 6.3.2 Режим загрузки A/B

Для system bootctrl предусмотрены два режима управления; bootloader поддерживает загрузку в обоих режимах.

##### 6.3.2.1 successful-boot

После нормального входа в систему boot_ctrl устанавливает переменные текущего слота на основании androidboot.slot_suffix:

```text
successful_boot = 1;
priority = 15;
tries_remaining = 0;
is_update = 0;
last_boot = 0 or 1;     :refer to androidboot.slot_suffix
```

Во время обновления системы boot_ctrl устанавливает:

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

После завершения обновления boot_ctrl устанавливает:

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

После нормального входа в систему boot_ctrl устанавливает переменные текущего слота на основании androidboot.slot_suffix:

```text
successful_boot = 0;
priority = 15;
tries_remaining = 7;
is_update = 0;
last_boot = 0 or 1;     :refer to androidboot.slot_suffix
```

Во время обновления системы boot_ctrl устанавливает:

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

После завершения обновления boot_ctrl устанавливает:

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

##### 6.3.2.3 Сравнение режимов

successful_boot: преимущество — после успешного запуска система не откатывается к старой прошивке, если это не задано system bootctrl; недостаток — после длительной работы отказ некоторых ячеек накопителя может привести к непрерывным перезагрузкам. reset retry: преимущество — механизм retry действует постоянно и позволяет обработать неисправности накопителя; недостаток — возможен откат к старой прошивке.

#### 6.3.3 Процесс загрузки

Поток данных A/B в режиме successful_boot:

Поток данных A/B в режиме reset retry:

#### 6.3.4 Обновление и исключения

Обновление системы: см. руководство Rockchip Linux по разработке схемы обновления. Обновление через recovery: система A/B не предусматривает поддержку такого обновления.

#### 6.3.5 Способ проверки

##### 6.3.5.1 successful-boot

1. Запишите только slot A: система запускается из A. Выберите загрузку из B: система по-прежнему запускается из A. После испытания очистите раздел misc.

2. Запишите A и B, запустите систему из A. Выберите B и выполните reboot: текущая система теперь B. После испытания очистите misc.

3. Запишите A и B, затем быстро выполните reset 14 раз. После исчерпания retry counter система всё ещё запускается из указанного last_boot, то есть штатно из A. После испытания очистите misc.

4. Запишите A и B и запустите A. Выберите B, выполните reboot и проверьте запуск B. Затем выберите A, выполните reboot и проверьте запуск A. После испытания очистите misc.

##### 6.3.5.2 reset-retry

1. Запишите только slot A: система запускается из A. Выберите загрузку из B: система по-прежнему запускается из A. После испытания очистите раздел misc.

2. Запишите A и B, запустите систему из A. Выберите B и выполните reboot: текущая система теперь B. После испытания очистите misc.

3. Запишите A и B, затем быстро выполните reset 14 раз. После исчерпания retry counter система всё ещё запускается из указанного last_boot, то есть штатно из A. После испытания очистите misc.

4. Запишите A и B, причём boot.img слота B должен быть повреждён. Запустите A, выберите B и выполните reboot. После 7 перезагрузок система нормально запустится из A. После испытания очистите misc.

5. Запишите A и B и запустите A. Выберите B, выполните reboot и проверьте запуск B. Затем выберите A, выполните reboot и проверьте запуск A. После испытания очистите misc.

#### 6.3.6 Источники

Rockchip-Secure-Boot2.0.md; Rockchip-Secure-Boot-Application-Note.md; Android Verified Boot 2.0.

### 6.4 Безопасная загрузка AVB

#### 6.4.1 Источники

Rockchip-Secure-Boot-Application-Note.md; Android Verified Boot 2.0; Rockchip_Developer_Guide_Linux4.4_SecureBoot_CN.pdf.

#### 6.4.2 Термины

AVB: Android Verified Boot. OTP и efuse: One Time Programmable. Product RootKey (PRK): корневой ключ AVB проверяется корневым ключом, подписывающим loader, uboot и trust. Product Intermediate Key (PIK): промежуточный ключ. Product Signing Key (PSK): ключ подписи прошивки. Product Unlock Key (PUK): ключ разблокировки устройства. Разделение ключей и их обязанностей снижает риск утечки ключей.

#### 6.4.3 Введение

Здесь описана безопасная проверка загрузки Rockchip: проверка безопасности и проверка целостности. Первая проверяет открытый ключ: его хеш читается из защищённого хранилища OTP/efuse и сравнивается с вычисленным хешем ключа; затем открытым ключом расшифровывается хеш прошивки. Для проверки целостности прошивка загружается с накопителя, вычисляется её хеш и сравнивается с расшифрованным.

#### 6.4.4 Пример шифрования

Проверка безопасной загрузки похожа на шифрование и проверку данных при связи. Следующий пример облегчает понимание AVB. Alice передаёт Bob цифровые данные. Чтобы обеспечить конфиденциальность, подлинность, целостность и невозможность отказа от авторства, данные шифруются и подписываются следующим образом:

1. Alice подготавливает передаваемые цифровые данные — открытый текст.

2. Alice вычисляет хеш данных и получает дайджест сообщения.

3. Alice шифрует дайджест своим закрытым ключом, получая цифровую подпись, и прикладывает её к данным.

4. Alice случайным образом создаёт ключ шифрования и шифрует им передаваемые данные.

5. Alice шифрует этот случайный ключ открытым ключом Bob и отправляет зашифрованный ключ DES вместе с шифротекстом.

6. Bob получает шифротекст и зашифрованный ключ DES. Своим закрытым ключом он расшифровывает ключ DES и получает случайный ключ Alice.

7. Bob расшифровывает данные случайным ключом, получает открытый текст и удаляет случайный ключ.

8. Bob расшифровывает цифровую подпись Alice её открытым ключом и получает дайджест.

9. Bob повторно хеширует полученный открытый текст тем же алгоритмом и получает новый дайджест.

10. Bob сравнивает полученный и вычисленный дайджесты. Их совпадение означает, что сообщение не изменялось. DES в этом примере можно заменить другим алгоритмом, например AES; для пары открытого и закрытого ключей можно использовать RSA. Схема:

![Рисунок 7: английский оригинал, с. 196](/docs/rockchip-uboot-nextdev/assets/en-p196-figure-01.png)

*Рисунок 7: английский оригинал, с. 196*

#### 6.4.5 AVB

AVB — Android Verified Boot, разработанная Google процедура проверки прошивок, прежде всего boot и system. Rockchip Secure Boot объединяет подходы проверки данных при связи и AVB в полноценную схему Secure Boot.

##### 6.4.5.1 Возможности AVB

Проверка безопасности; проверка целостности; защита от отката; поддержка persistent partition; поддержка chained partitions. Для последних можно использовать тот же закрытый ключ, что для boot/system, либо отдельный ключ OEM, однако требуется подпись PRK.

##### 6.4.5.2 Ключи, подписи и сертификаты

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

Создание permanent_attributes.bin:

```text
python avbtool make_atx_permanent_attributes --output=permanent_attributes.bin --
product_id=product_id.bin --root_authority_key=testkey_prk.pem
```

product_id.bin необходимо определить самостоятельно; он занимает 16 байт и может служить идентификатором продукта. Пример подписи boot.img:

```text
avbtool add_hash_footer --image boot.img --partition_size 33554432 --partition_name boot --
key testkey_psk.pem --algorithm SHA256_RSA4096
```

Внимание: partition size должен превышать исходную прошивку минимум на 64K, быть выровнен на 4K и не превышать размер раздела в parameter.txt. Пример подписи sytem.img:

```text
avbtool add_hashtree_footer --partition_size 536870912 --partition_name system --image
system.img --algorithm SHA256_RSA4096 --key testkey_psk.pem
```

Создание vbmeta, содержащего metadata.bin; пример команды:

```text
python avbtool make_vbmeta_image --public_key_metadata metadata.bin --
include_descriptors_from_image boot.img --include_descriptors_from_image system.img --
generate_dm_verity_cmdline_from_hashtree system.img --algorithm SHA256_RSA4096 --key
testkey_psk.pem  --output vbmeta.img
```

Полученный vbmeta.img записывается в соответствующий раздел, например vbmeta. PrivateKey.pem и PublicKey.pem создаются с помощью SecureBootTool.

![Рисунок 8: английский оригинал, с. 198](/docs/rockchip-uboot-nextdev/assets/en-p198-figure-01.png)

*Рисунок 8: английский оригинал, с. 198*

Подпись permanent_attributes.bin:

```text
openssl dgst -sha256 -out permanent_attributes_cer.bin -sign PrivateKey.pem
permanent_attributes.bin
```

permanent_attributes.bin содержит данные безопасности всей системы. Его хеш записывается в efuse/OTP либо данные аутентифицируются предыдущей стадией (pre-load). На платформах Rockchip места в efuse недостаточно, поэтому permanent_attributes.bin проверяется открытым ключом предыдущей стадии и сертификатом permanent_attributes.bin. На платформах с OTP места достаточно, и хеш записывается непосредственно в OTP. Поддержку efuse/OTP на конкретных платформах см. в разделе драйверов. Запись pub_key на платформах efuse:

```text
fastboot stage permanent_attributes.bin
fastboot oem fuse at-perm-attr
fastboot stage permanent_attributes_cer.bin
fastboot oem fuse at-rsa-perm-attr
```

Запись pub_key на платформах OTP:

```text
fastboot stage permanent_attributes.bin
fastboot oem fuse at-perm-attr
```

Полный процесс подписи:

![Рисунок 9: английский оригинал, с. 199](/docs/rockchip-uboot-nextdev/assets/en-p199-figure-01.png)

*Рисунок 9: английский оригинал, с. 199*

##### 6.4.5.3 AVB lock

```text
fastboot oem at-lock-vboot
```

Вход в fastboot описан в разделе поддержки команды fastboot.

##### 6.4.5.4 AVB unlock

Rockchip использует строгую проверку безопасности; в соответствующий defconfig необходимо добавить:

```text
CONFIG_RK_AVB_LIBAVB_ENABLE_ATH_UNLOCK=y
```

Иначе fastboot oem at-unlock-vboot разблокирует устройство, и оно загрузится даже при ошибке проверки vbmeta.img или boot.img.

Сначала создайте PUK:

```text
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:4096 -outform PEM -out
testkey_puk.pem
```

unlock_credential.bin — сертификат, загружаемый на устройство для разблокировки. Процесс создания:

```text
python avbtool make_atx_certificate --output=puk_certificate.bin --subject=product_id.bin --
subject_key=testkey_puk.pem --usage=com.google.android.things.vboot.unlock --
subject_key_version 42 --authority_key=testkey_pik.pem
```

Получение unlock_credential.bin от устройства: используйте avb-challenge-verify.py и следующие команды для получения unlock_credential.bin:

```text
python avbtool make_atx_unlock_credential --output=unlock_credential.bin --
intermediate_key_certificate=pik_certificate.bin --
unlock_key_certificate=puk_certificate.bin --challenge=unlock_challenge.bin --
unlock_key=testkey_puk.pem
```

Наконец, загрузите сертификат на устройство и разблокируйте его командами fastboot:

```text
fastboot stage unlock_credential.bin
fastboot oem at-unlock-vboot
```

Итоговая процедура разблокировки устройства OTP:

![Рисунок 10: английский оригинал, с. 201](/docs/rockchip-uboot-nextdev/assets/en-p201-figure-01.png)

*Рисунок 10: английский оригинал, с. 201*

Итоговая процедура разблокировки устройства efuse:

![Рисунок 11: английский оригинал, с. 202](/docs/rockchip-uboot-nextdev/assets/en-p202-figure-01.png)

*Рисунок 11: английский оригинал, с. 202*

Порядок действий:

1. Переведите устройство в fastboot и введите на компьютере:

```text
fastboot oem at-get-vboot-unlock-challenge
fastboot get_staged raw_unlock_challenge.bin
```

Полученные данные содержат версию, Product Id и 16-байтовое случайное число. Извлеките случайное число в unlock_challenge.bin.

1. Создайте unlock_credential.bin с помощью avbtool; см. make_unlock.sh.

2. Введите на компьютере:

```text
fastboot stage unlock_credential.bin
fastboot oem at-unlock-vboot
```

Внимание: устройство должно оставаться в том же сеансе fastboot, в который оно вошло первоначально. Не отключайте питание, не выключайте и не перезагружайте его: после шага 1 устройство хранит созданное случайное число, и эти действия его уничтожат. Последующая проверка challenge signature завершится ошибкой из-за несовпадения случайного числа. Если включить:

```text
CONFIG_MISC=y
CONFIG_ROCKCHIP_EFUSE=y
CONFIG_ROCKCHIP_OTP=y
```

В качестве challenge number используется CPUID, привязанный к устройству и не теряющийся при выключении. Поэтому unlock_credential.bin можно использовать повторно, не создавая заново unlock_challenge.bin и unlock_credential.bin. Повторная разблокировка выполняется так:

```text
fastboot oem at-get-vboot-unlock-challenge
fastboot stage unlock_credential.bin
fastboot oem at-unlock-vboot
```

1. Переведите устройство в состояние разблокировки и начните разблокировку. Пример make_unlock.sh:

```text
#!/bin/sh
python avb-challenge-verify.py raw_unlock_challenge.bin product_id.bin
python avbtool make_unlock_credential --output=unlock_credential.bin --
intermediate_key_certificate=pik_certificate.bin --
unlock_key_certificate=puk_certificate.bin --challenge=unlock_challenge.bin --
unlock_key=testkey_puk.pem
```

Исходный код avb-challenge-verify.py:

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

4.5.5 Включение AVB в U-Boot требует поддержки trust. В defconfig U-Boot задайте:

```text
CONFIG_OPTEE_CLIENT=y
CONFIG_OPTEE_V1=y
CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION=y  // 安全数据存储到security分区
```

CONFIG_OPTEE_V1: платформы 312x, 322x, 3288, 3228H, 3368, 3399. CONFIG_OPTEE_V2: 3326, 3308. CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION включайте только при недоступном RPMB eMMC; по умолчанию выключено. Для AVB в defconfig задайте:

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

##### 6.4.5.5 Настройка ядра

Разделы system, vendor, oem и другие загружаются и проверяются модулем dm-verify ядра, поэтому его необходимо включить. Для AVB настройте параметр avb в DTS ядра, например:

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

Для A/B system настройте параметр slotselect, например:

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

Настройки Android SDK. AVB: включите BOARD_AVB_ENABLE. Переменные A/B system делятся на три группы. Обязательные: `AB_OTA_UPDATER := true`; `AB_OTA_PARTITIONS := boot system vendor`; `BOARD_BUILD_SYSTEM_ROOT_IMAGE := true`; `TARGET_NO_RECOVERY := true`; `BOARD_USES_RECOVERY_AS_BOOT := true`; `PRODUCT_PACKAGES += update_engine update_verifier`. Необязательные: `PRODUCT_PACKAGES_DEBUG += update_engine_client`. Недопустимые для определения в A/B: BOARD_RECOVERYIMAGE_PARTITION_SIZE, BOARD_CACHEIMAGE_PARTITION_SIZE, BOARD_CACHEIMAGE_FILE_SYSTEM_TYPE.

##### 6.4.5.7 Новые параметры cmdline

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

Пояснения к некоторым параметрам:

1. Зачем передаётся PARTUUID раздела vbmeta? Чтобы обеспечить достоверность дальнейшего использования hash-tree vbmeta, ядро повторно проверяет vbmeta; дайджест передаётся в androidboot.vbmeta.digest.

2. skip_initramfs: наличие boot ramdisk в boot.img. В A/B system ramdisk не включается в

boot.img, поэтому этот параметр требуется в cmdline.

3. root=/dev/dm-0 включает dm-verify и указывает system.

4. androidboot.vbmeta.device_state: состояние Android verify.

5. androidboot.verifiedbootstate: результат проверки. green — состояние LOCKED, ключ проверки не задан конечным пользователем; yellow — LOCKED, ключ задан конечным пользователем; orange — UNLOCKED. Ниже отдельно поясняется создание параметра dm="1 vroot none ro......":

```text
avbtool make_vbmeta_image --include_descriptors_from_image boot.img --
include_descriptors_from_image system.img --generate_dm_verity_cmdline_from_hashtree
system.img --include_descriptors_from_image vendor.img --algorithm SHA512_RSA4096 --key
testkey_psk.pem --public_key_metadata metadata.bin --output vbmeta.img
```

При создании vbmeta с avbtool добавьте --generate_dm_verity_cmdline_from_hashtree для прошивки system. Данные dm="1 vroot none ro......" сохраняются в vbmeta. Это относится только к Android; если проверяется лишь boot.img, параметр не нужен. В Android SDK включение BOARD_AVB_ENABLE добавляет эти сведения в vbmeta.

#### 6.4.6 Пример разделов

Добавлены разделы vbmeta и security: vbmeta хранит сведения для проверки прошивки, security — зашифрованные защищённые данные.

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

Пример определения разделов A/B System:

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

#### 6.4.7 Команды fastboot

В U-Boot можно перейти в fastboot следующей командой:

```text
fastboot usb 0
```

##### 6.4.7.1 Обзор команд

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

##### 6.4.7.2 Использование команд

1. `fastboot flash &lt; partition &gt; [ &lt; filename &gt; ]`: запись раздела. Пример: `fastboot flash boot boot.img`.

1. `fastboot erase &lt; partition &gt;`: стирание раздела. Пример: `fastboot erase boot`.

1. `fastboot getvar &lt; variable &gt; &#124; all`: сведения об устройстве. Пример: `fastboot getvar all` получает все сведения. Возможные значения variable:

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

Пример fastboot getvar all:

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

1. `fastboot set_active &lt; slot &gt;`: выбор слота для перезагрузки. Пример: `fastboot set_active _a`.

1. `fastboot reboot`: штатная перезагрузка устройства. Пример: `fastboot reboot`.

1. `fastboot reboot-bootloader`: перезагрузка в fastboot. Пример: `fastboot reboot-bootloader`.

1. `fastboot flashing unlock`: разблокировка устройства с разрешением записи прошивки. Пример: `fastboot flashing unlock`.

1. `fastboot flashing lock`: блокировка устройства с запретом записи.

Пример: `fastboot flashing lock`.

1. `fastboot stage [ &lt; filename &gt; ]`: загрузка данных в память устройства с начального адреса CONFIG_FASTBOOT_BUF_ADDR. Пример: `fastboot stage permanent_attributes.bin`.

1. `fastboot get_staged [ &lt; filename &gt; ]`: получение данных от устройства. Пример: `fastboot get_staged raw_unlock_challenge.bin`.

1. `fastboot oem fuse at-perm-attr`: запись permanent_attributes.bin и его хеша. Пример: сначала `fastboot stage permanent_attributes.bin`, затем `fastboot oem fuse at-perm-attr`.

1. `fastboot oem fuse at-perm-attr-data`: запись только permanent_attributes.bin в защищённое хранилище RPMB. Пример: сначала `fastboot stage permanent_attributes.bin`, затем `fastboot oem fuse at-perm-attr-data`.

1. fastboot oem at-get-ca-request

2. fastboot oem at-set-ca-response

3. `fastboot oem at-lock-vboot`: блокировка устройства. Пример: `fastboot oem at-lock-vboot`.

1. `fastboot oem at-unlock-vboot`: разблокировка устройства, поддерживается authenticated unlock. Пример последовательности: `fastboot oem at-get-vboot-unlock-challenge`; `fastboot get_staged raw_unlock_challenge.bin`; `./make_unlock.sh` (см. пример make_unlock.sh); `fastboot stage unlock_credential.bin`; `fastboot oem at-unlock-vboot`.

1. `fastboot oem fuse at-bootloader-vboot-key`: запись хеша ключа bootloader. Пример: сначала `fastboot stage bootloader-pub-key.bin`, затем `fastboot oem fuse at-bootloader-vboot-key`.

1. `fastboot oem format`: повторное форматирование разделов; сведения о разделах берутся из $partitions.

Пример: `fastboot oem format`.

1. `fastboot oem at-get-vboot-unlock-challenge`: получение unlock challenge для authenticated unlock. Пример см. в пункте 16, fastboot oem at-unlock-vboot.

1. `fastboot oem at-reset-rollback-index`: сброс данных rollback устройства. Пример: `fastboot oem at-reset-rollback-index`.

1. `fastboot oem at-disable-unlock-vboot`: отключение команды fastboot oem at-unlock-vboot. Пример: `fastboot oem at-disable-unlock-vboot`.

#### 6.4.8 Запись прошивки

Ниже показана утилита записи прошивки для Windows:

![Рисунок 12: английский оригинал, с. 213](/docs/rockchip-uboot-nextdev/assets/en-p213-figure-01.png)

*Рисунок 12: английский оригинал, с. 213*

Запись A/B System

![Рисунок 13: английский оригинал, с. 214](/docs/rockchip-uboot-nextdev/assets/en-p214-figure-01.png)

*Рисунок 13: английский оригинал, с. 214*

#### 6.4.9 Pre-loader verified

См. Rockchip-Secure-Boot-Application-Note.md.

![Рисунок 14: английский оригинал, с. 215](/docs/rockchip-uboot-nextdev/assets/en-p215-figure-01.png)

*Рисунок 14: английский оригинал, с. 215*

#### 6.4.10 U-boot verified

Процедура проверки устройства OTP:

Процедура проверки устройства efuse:

#### 6.4.11 Проверенная загрузка системы

![Рисунок 15: английский оригинал, с. 220](/docs/rockchip-uboot-nextdev/assets/en-p220-figure-02.png)

*Рисунок 15: английский оригинал, с. 220*

После запуска ядро анализирует cmdline от U-Boot и определяет, используется ли dm-verify. Затем загружается и запускается служба fs_mgr для system. Она проверяет и загружает прошивку по fsmgr_flags; хеш и дерево хешей прошивки хранятся в vbmeta.img. Основные параметры: avb — проверка и загрузка раздела методом AVB; slotselect — раздел имеет варианты A/B, при загрузке используется androidboot.slot_suffix=_a из cmdline.

#### 6.4.12 Linux AVB

Ниже описаны работа с AVB и его проверка в Linux.

##### 6.4.12.1 Порядок работы

1. Создайте полный комплект прошивок.

2. Создайте PrivateKey.pem и PublicKey.pem через SecureBootConsole; используется rk_sign_tool со следующей командой:

```text
rk_sign_tool cc --chip 3399
rk_sign_tool kk --out .
```

3. Загрузите ключ.

```text
rk_sign_tool lk --key privateKey.pem --pubkey publicKey.pem
```

4. Подпишите loader.

```text
rk_sign_tool sl --loader loader.bin
```

5. Подпишите uboot.img и trust.img.

```text
rk_sign_tool si --img uboot.img
rk_sign_tool si --img trust.img
```

6. Подготовка подписи AVB: создайте пустой temp.bin, 16-байтовый product_id.bin и подготовьте boot.img для подписи. Выполните следующий код:

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

Создаются vbmeta.img, permanent_attributes_cer.bin и permanent_attributes.bin. На этом шаге подписывается boot.img и т. д.

7. Запишите прошивку.

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

1. Запишите permanent_attributes_cer.bin и permanent_attributes.bin. Для платформ с OTP:

```text
fastboot stage permanent_attributes.bin
fastboot oem fuse at-perm-attr
```

Для платформ с efuse:

```text
fastboot stage permanent_attributes.bin
fastboot oem fuse at-perm-attr
fastboot stage permanent_attributes_cer.bin
fastboot oem fuse at-rsa-perm-attr
```

1. Запись efuse: утилита пока существует только для Windows. Выберите специальный loader и нужное устройство, затем нажмите кнопку запуска записи.

![Рисунок 16: английский оригинал, с. 223](/docs/rockchip-uboot-nextdev/assets/en-p223-figure-01.png)

*Рисунок 16: английский оригинал, с. 223*

1. Запись открытого ключа loader на OTP-платформах описана в Rockchip-Secure-Boot-Application-Note.md.

##### 6.4.12.2 Процедура проверки

[TODO — раздел оставлен незавершённым в оригинале.]

### 6.5 Загрузка и обновление с SD

#### 6.5.1 Введение

Rockchip различает обычные SD-карты, карты обновления, загрузочные карты и карты восстановления. Утилита Rockchip для создания диска обновления записывает update.img на SD-карту и позволяет создать нужный тип карты.

| Тип карты | Функция |
| --- | --- |
| Обычная SD-карта | Обычный накопитель |
| SD-карта обновления | Загрузка recovery с SD; recovery обновляет накопитель прошивкой с SD |
| Загрузочная SD-карта | Загрузка устройства непосредственно с SD |
| SD-карта восстановления | Копирование прошивки с SD на накопитель начинается в pre-loader |

#### 6.5.2 Классификация

##### 6.5.2.1 Обычная карта

Обычная SD-карта используется так же, как на ПК: в U-Boot и ядре она служит обычным накопителем. Обработка карты специальной утилитой не требуется.

##### 6.5.2.2 Карта обновления

Карта обновления создаётся утилитой RK и обновляет прошивку локального накопителя, например eMMC или NAND Flash, без ПК и сети. Загрузочный код записывается в резервную область SD, прошивка копируется в видимый раздел. При старте с SD загрузочный код и код обновления записывают прошивку в основной локальный накопитель. Поддерживаются также испытания PCBA и копирование файлов Demo. Это повышает эффективность производства, устраняя необходимость в ПК. Если карта уже создана и требуется только обновить прошивку и Demo, выполните следующие действия:

1. Скопируйте прошивку в корень SD-карты и переименуйте в sdupdate.img.

2. Скопируйте файлы Demo в каталог Demo в корне SD-карты. Формат загрузочной карты обновления SD без GPT:

| Смещение | Раздел данных |
| --- | --- |
| Сектор 0 | MBR |
| Сектор 64-4M | IDBLOCK(флаг загрузки установлен в 0) |
| 4M-8M | Parameter |
| 12M-16M | uboot |
| 16M-20M | trust |
| ...... | misc |
| ...... | resource |
| ...... | kernel |
| ...... | recovery |
| Оставшееся место | Fat32 хранит update.img |

Формат загрузочной карты обновления SD с GPT:

| Смещение | Раздел данных |
| --- | --- |
| Сектор 0 | MBR |
| Сектор 1-34 | Таблица разделов GPT |
| Сектор 64-4M | IDBLOCK(флаг загрузки установлен в 0) |
| 4M-8M | Parameter |
| ...... | uboot |
| ...... | trust |
| ...... | misc |
| ...... | resource |
| ...... | kernel |
| ...... | recovery |
| Оставшееся место | Fat32 хранит update.img |

##### 6.5.2.3 Загрузочная карта

Загрузочная карта создаётся утилитой RK и позволяет запускать новую прошивку непосредственно с SD, не перепрограммируя накопитель устройства. Прошивка записывается на SD, которая становится основным накопителем. Прошивка и временные файлы находятся на SD; наличие локального основного накопителя не требуется. Основные применения — загрузка системы с SD и испытания PCBA. Примечание: PCBA-тестирование является функцией recovery и доступно как для карт обновления, так и для загрузочных карт. Формат загрузочной SD-карты без GPT:

| Смещение | Раздел данных |
| --- | --- |
| Сектор 0 | MBR |
| Сектор 64-4M | IDBLOCK(флаг загрузки установлен в 1) |
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

Формат загрузочной SD-карты с GPT:

| Смещение | Раздел данных |
| --- | --- |
| Сектор 0 | MBR |
| Сектор 1-34 | Таблица разделов GPT |
| Сектор 64-4M | IDBLOCK(флаг загрузки установлен в 1) |
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
| Последние 33 сектора | Резервная GPT |

##### 6.5.2.4 Карта восстановления

Карта восстановления похожа на карту обновления, но прошивку обновляет miniloader. Утилита записывает загрузочный код в резервную область SD и копирует прошивку в видимый раздел. При старте с SD код обновления записывает прошивку в основной локальный накопитель. Карта предназначена прежде всего для восстановления устройства с повреждённой прошивкой. Формат карты восстановления без GPT:

| Смещение | Раздел данных |
| --- | --- |
| Сектор 0 | MBR |
| Сектор 64-4M | IDBLOCK(флаг загрузки установлен в 2) |
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

Формат карты восстановления с GPT:

| Смещение | Раздел данных |
| --- | --- |
| Сектор 0 | MBR |
| Сектор 1-34 | Таблица разделов GPT |
| Сектор 64-4M | IDBLOCK(флаг загрузки установлен в 2) |
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
| Последние 33 сектора | Резервная GPT |

#### 6.5.3 Метки прошивки

Назначение SD-карты обозначается флагами. Если magic number в начале сектора 64 равен 0xFCDC8C3B, карта специальная: с неё читается прошивка и загружается устройство. Иначе это обычная SD-карта. По адресу сектор 64 + 616 bytes находится флаг типа карты. Предусмотрены три типа:

| Флаг | Тип карты |
| --- | --- |
| 0 | Карта обновления или теста PCBA |
| 1 | Загрузочная карта |
| 2 | Карта восстановления |

#### 6.5.4 Процесс загрузки

Загрузка с SD делится на этапы pre-loader и U-Boot. Оба обнаруживают и загружают SD-карту, проверяют Startup Flag в её IDBBlock и выполняют соответствующие функции. Схема:

![Рисунок 17: английский оригинал, с. 229](/docs/rockchip-uboot-nextdev/assets/en-p229-figure-01.png)

*Рисунок 17: английский оригинал, с. 229*

##### 6.5.4.1 Запуск pre-loader

![Рисунок 18: английский оригинал, с. 230](/docs/rockchip-uboot-nextdev/assets/en-p230-figure-01.png)

*Рисунок 18: английский оригинал, с. 230*

Maskrom сначала находит пригодный miniloader и передаёт ему управление. Поддерживаемые носители и их приоритет указаны в TRM; Maskrom последовательно ищет на них прошивку. Miniloader повторно ищет накопители и при обнаружении SD проверяет наличие прошивки IDB, затем флаг карты. Если карта пригодна и флаг равен 0 или 1, с SD загружается U-Boot. Флаг 2 включает восстановление и обновление прошивки на стадии loader. Обычная загрузка сканирует остальные накопители и запускает следующий loader.

##### 6.5.4.2 Запуск U-Boot

![Загрузка U-Boot: английский оригинал, с. 232 (продолжение схемы)](/docs/rockchip-uboot-nextdev/assets/en-p232-uboot-flow-vector.png)

*Загрузка U-Boot: английский оригинал, с. 232 (продолжение схемы)*

![Загрузка U-Boot: английский оригинал, с. 233 (продолжение схемы)](/docs/rockchip-uboot-nextdev/assets/en-p233-uboot-flow-vector.png)

*Загрузка U-Boot: английский оригинал, с. 233 (продолжение схемы)*

Карта обновления: U-Boot повторно ищет накопители. Если SD содержит IDB-прошивку и флаг карты равен 0, в cmdline ядра добавляется sdfwupdate. Затем из misc на SD читается режим загрузки; при recovery запускается recovery. Загрузочная карта: U-Boot также повторно ищет накопители, проверяет IDB и флаг 1. Из misc на SD читается режим: recovery запускает recovery, normal — kernel.

##### 6.5.4.3 Recovery и PCBA

Подробнее см. Rockchip Recovery 用户操作指南 V1.03.pdf — руководство пользователя Rockchip Recovery.

#### 6.5.5 Предостережения

Для прошивки без GPT включите CONFIG_RKPARM_PARTITION в U-Boot. При создании карты обновления SD образ update.img должен содержать MiniloaderAll.bin, parameter.txt, uboot.img, trust.img, misc.img, resource.img и recovery.img. Иначе запись update.img выдаст ошибку записи MBR.

## 7 Сокращение конфигурации

TODO — в оригинале раздел не заполнен.

## 8 Отладка

В этой главе описаны распространённые способы отладки U-Boot: команды, скрипты, параметры конфигурации, загрузочные сообщения и т. д.

### 8.1 DEBUG

Назначение: глобально включить вывод debug(). Добавьте определение макроса в rkxxx_common.h соответствующей платформы:

```text
#define DEBUG
```

### 8.2 Initcall

Назначение: вывести последовательность запуска. Загрузка U-Boot представляет собой серию initcall. Замените debug() в initcall_run_list() на printf(), например:

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

### 8.3 Команда io

Назначение: чтение и запись памяти.

```text
// 读操作
md - memory display
Usage: md [.b, .w, .l, .q] address [# of objects]

// 写操作
mw - memory write (fill)
Usage: mw [.b, .w, .l, .q] address value [count]
```

Чтение. Пример: вывести 0x10 последовательных элементов данных начиная с адреса 0x76000000.

```text
=> md.l 0x76000000 0x10
76000000: fffffffe ffffffff ffffffff ffffffff    ................
76000010: ffffffdf ffffffff feffffff ffffffff    ................
76000020: ffffffff ffffffff ffffffff ffffffff    ................
76000030: ffffffff ffffffff ffffffff ffffffff    ................
```

Запись. Пример: записать 0x1234 по адресу 0x76000000.

```text
=> mw.l 0x76000000 0xffff1234 // ⾼16位有mask
=> md.l 0x76000000 0x10       // 回读
76000000: ffff1234 ffffffff ffffffff ffffffff    ................
76000010: ffffffdf ffffffff feffffff ffffffff    ................
76000020: ffffffff ffffffff ffffffff ffffffff    ................
76000030: ffffffff ffffffff ffffffff ffffffff    ................
```

### 8.4 Команда iomem

Назначение: чтение памяти. Гибче md: базовый адрес определяется автоматически из узла DTS.

```text
=> iomem
iomem - Show iomem data by device compatible

Usage:
// @<compatible>：节点的compatible部分关键词匹配
iomem <compatible> <start offset>  <end offset>
eg: iomem -grf 0x0 0x200
```

Пример: чтение данных GRF RK3228 в диапазоне 0x00–0x20.

```text
// 这⾥为了和"rockchip, rk3288-pmugrf" 区分开，所以⽤"-grf"作为关键词
=> iomem -grf 0x0 0x20
rockchip,rk3228-grf:
11000000:  00000000 00000000 00004000 00002000
11000010:  00000000 00005028 0000a5a5 0000aaaa
11000020:  00009955
```

### 8.5 Команда i2c

Назначение: чтение и запись устройства I2C.

```text
=> i2c
i2c - I2C sub-system

Usage:
i2c dev [dev] - show or set current I2C bus
i2c md chip address[.0, .1, .2] [# of objects] - read from I2C device
i2c mw chip address[.0, .1, .2] value [count] ‐ write to I2C device (fill)
......
```

Пример чтения:

```text
=> i2c dev 0                     // 切到i2c0（指定⼀次即可）
Setting bus to 0

=> i2c md 0x1b 0x2e 0x20         // i2c设备地址为1b(7位地址)，读取0x2e开始的连续0x20个寄存器值
002e: 11 0f 00 00 11 0f 00 00 01 00 00 00 09 00 00 0c    ................
003e: 00 0a 0a 0c 0c 0c 00 07 07 0a 00 0c 0c 00 00 00    ................
```

Пример записи:

```text
=> i2c dev 0                     // 切到i2c0（指定⼀次即可）
Setting bus to 0

=> i2c mw 0x1b 0x2e 0x10         // i2c设备地址为1b(7位地址)，对0x2e寄存器赋值为0x10
=> i2c md 0x1b 0x2e 0x20         // 回读
002e: 10 0f 00 00 11 0f 00 00 01 00 00 00 09 00 00 0c    ................
003e: 00 0a 0a 0c 0c 0c 00 07 07 0a 00 0c 0c 00 00 00    ................
```

### 8.6 Команда gpio

Назначение: чтение входов и запись выходов выводов GPIO.

```text
=> gpio
gpio - query and control gpio pins

Usage:
gpio <input|set|clear|toggle> <pin>
    - input/set/clear/toggle the specified pin
gpio status [-a] [<bank> | <pin>]  - show [all/claimed] GPIOs
```

Проверка состояния вывода, например RV1126:

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

Вход:

```text
=> gpio input A7
```

Выход INACTIVE:

```text
=> gpio clear A7
```

Выход ACTIVE:

```text
=> gpio set A7
```

Переключение состояния, например A7: input: 0 в A7: output: 1.

```text
=> gpio toggle A7
```

### 8.7 Команда fdt

Назначение: вывод содержимого DTB.

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

Следующие две команды вместе позволяют вывести полное дерево устройств:

```text
=> fdt addr $fdt_addr_r   // 指定fdt地址
=> fdt print              // 把fdt内容全部打印出来
```

### 8.8 Команда mmc

Назначение: чтение, запись и переключение MMC. Просмотр устройств MMC:

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

Переключение устройства MMC:

```text
=> mmc dev 0                            // 切换到eMMC
=> mmc dev 1                            // 切换到sd卡
```

Чтение и запись устройства MMC:

```text
mmc read addr blk# cnt
mmc write addr blk# cnt
mmc erase blk# cnt
例：
=> mmc read 0x70000000 0 1    // 读取MMC设备第⼀个block，⼤⼩为1 sector的数据到内存0x70000000
=> mmc write 0x70000000 0 1   // 把内存0x70000000起1 sector的数据写到存储第⼀个block起位置
=> mmc erase 0 1              // 擦除存储第⼀个block起1 sector数据
```

При ошибках MMC замените debug() на printf() в drivers/mmc/dw_mmc.c, пересоберите и запишите образ. Проверьте вывод: если последнее сообщение Sending CMD0, проверьте питание, соединения выводов и не переключил ли другой IP программный IOMUX. При Sending CMD8 разрешите MMC доступ к защищённому хранилищу в защищённом ПО. Если инициализация прошла и последним выведено Sending CMD18, проверьте питание MMC и достаточность ёмкости конденсаторов рядом с питанием MMC (можно увеличить); программно можно снизить частоту или сменить скоростной режим MMC.

### 8.9 Временные метки

Назначение: добавить относительные временные метки к сообщениям U-Boot.

```text
CONFIG_BOOTSTAGE_PRINTF_TIMESTAMP
```

Пример:

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

Метка показывает текущее значение системного таймера; отсчёт не начинается с нуля. Поэтому это относительное, а не абсолютное время.

### 8.10 dm tree

Назначение: просмотр привязок и состояния probe всех device-driver.

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

Вывод перечисляет все привязанные device-driver и отношения uclass-device-driver. [ + ] означает завершённый probe драйвера. Звёздочка * отмечает device-driver из DTB U-Boot; без неё — из DTB ядра.

### 8.11 dm uclass

Назначение: просмотр всех устройств определённого uclass.

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

Анализ контекста abort и dump_stack() с помощью обратной трассировки стека описан в главе об архитектуре RK.

### 8.13 Зависание системы

Назначение: вывод текущего контекста CPU и стека вызовов, полезный при зависании системы. UART каждые 5 s выводит информацию, аналогичную abort.

```text
CONFIG_ROCKCHIP_DEBUGGER
```

Полученный стек преобразуйте скриптом stacktrace; см. главу об архитектуре RK.

### 8.14 Проверка CRC

Назначение: проверка целостности прошивки формата RK. Заголовок образа содержит CRC32 всего образа; включение следующего макроса позволяет проверять целостность по CRC32.

```text
CONFIG_ROCKCHIP_CRC
```

Пример:

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

### 8.15 Проверка HASH

Назначение: проверка целостности прошивки формата Android.

```text
ANDROID_BOOT_IMAGE_HASH
```

После включения этой настройки целостность проверяется при загрузке прошивки формата Android.

По историческим причинам проверка выше может работать некорректно; в таком случае попробуйте дополнительно включить:

```text
HASH_ROCKCHIP_LEGACY
```

### 8.16 Изменение объёма DDR

При старте код инициализации DDR передаёт U-Boot объём DDR. U-Boot исключает защищённые области и передаёт оставшийся объём ядру. На стадии U-Boot пользователь может изменить передаваемый объём DDR. Пример:

```text
......
// 传递给内核的可⽤内存块（已去除安全内存块）。
Adding bank: 0x00200000 - 0x08400000 (size: 0x08200000)
Adding bank: 0x0a200000 - 0x40000000 (size: 0x35e00000)
Total: 895.411 ms

Starting kernel ...
[    0.000000] Booting Linux on physical CPU 0x0
```

Расположение кода:

```text
./arch/arm/mach-rockchip/param.c
```

Место изменения:

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

### 8.17 Информация о переходе

Назначение: определение версии прошивки и последовательности выполнения. В некоторых случаях загрузочные сообщения помогают найти причины зависания.

1. Зависание сразу после trust. Возможная причина — ошибка упаковки или записи прошивки, из-за которой trust переходит на неверный адрес U-Boot. Проверьте адрес запуска U-Boot в выводе trust. На 64-битных платформах это обычно смещение 0x200000 при начале DRAM 0x0:

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

На 32-битных платформах адрес запуска U-Boot обычно имеет смещение 0x0 при начале DRAM 0x60000000:

```text
INF [0x0] TEE-CORE:init_primary_helper:378: Release version: 1.9
INF [0x0] TEE-CORE:init_primary_helper:379: Next entry point address: 0x60000000  // U-Boot
地址
INF [0x0] TEE-CORE:init_teecore:83: teecore inits done
```

2. Определение версии U-Boot: по загрузочным сообщениям можно установить версию сборки. В примере указан commit b34f08b.

```text
U-Boot 2017.09-01730-gb34f08b (Jul 06 2018 - 17:47:52 +0800)
```

Слово dirty означает, что при сборке имелись локальные изменения, не включённые в коммит; дерево сборки было изменено.

```text
U-Boot 2017.09-01730-gb34f08b-dirty (Jul 06 2018 - 17:35:04 +0800)
```

### 8.18 Сообщения загрузки

Загрузочные сообщения U-Boot показывают текущий процесс и состояние периферии, помогая быстро локализовать неисправности. Поддерживаются три формата прошивки в порядке Android &gt; RK &gt; DISTRO. SDK Rockchip в основном используют первые два, а DISTRO обычно применяется пользователями открытых проектов.

Примечание: в старом коде некоторые сообщения могут отсутствовать; это не мешает общему пониманию вывода U-Boot.

17.1 Прошивка Android

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

#### 8.18.1 Прошивка RK

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

#### 8.18.2 Прошивка Didstro

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

#### 8.18.3 Нет действительной прошивки

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

## 9 Тесты

## 10 SPL

### 10.1 Загрузка прошивки

SPL заменяет miniloader, загружая и запуская trust.img и uboot.img. Поддерживаются два типа прошивки: FIT включён по умолчанию; RKFW выключен по умолчанию и требует отдельной настройки и включения.

#### 10.1.1 Прошивка FIT

FIT (flattened image tree) — сравнительно новый формат, поддерживаемый SPL. Он позволяет упаковывать и проверять несколько образов. Описание u-boot.its использует синтаксис DTS, итоговая прошивка называется u-boot.itb. Преимущества FIT: гибкое повторное использование синтаксиса и правил компиляции DTS, разбор средствами libfdt. В u-boot.its узел /images статически определяет все доступные ресурсы (не обязательно используемые), подобно DTSI; в /configurations каждый config задаёт загрузочную конфигурацию, подобно DTS платы. default = выбирает текущую конфигурацию по умолчанию. Пример:

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

Файл u-boot.itb:

```text
                          mkimage + dtc
[u-boot.its] + [images]        ==>         [u-boot.itb]
```

Выше показано создание ITB. FIT можно рассматривать как специальный DTB, содержащий образы. Просмотреть ITB можно командой fdtdump:

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

Дополнительные сведения о FIT:

```text
./doc/uImage.FIT/
```

#### 10.1.2 Прошивка RKFW

Чтобы заменить miniloader без изменения разделов и упаковки последующей прошивки, RK добавляет загрузку RKFW: отдельные образы trust.img и uboot.img в собственных разделах. Настройка:

```text
CONFIG_SPL_LOAD_RKFW           // 使能开关
CONFIG_RKFW_TRUST_SECTOR       // trust.img分区地址，需要和分区表的定义保持⼀致
CONFIG_RKFW_U_BOOT_SECTOR      // uboot.img分区地址，需要和分区表的定义保持⼀致
```

Код:

```text
./include/spl_rkfw.h
./common/spl/spl_rkfw.c
```

#### 10.1.3 Приоритет носителей

Приоритет загрузочных накопителей задаётся свойством u-boot,spl-boot-order в DTS U-Boot.

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

### 10.2 Сборка и упаковка

#### 10.2.1 Сборка кода

SPL собирается из того же кода U-Boot с другим путём компиляции. При сборке SPL автоматически определяется CONFIG_SPL_BUILD. После u-boot.bin сборка U-Boot продолжает сборку SPL в отдельном выходном каталоге ./spl/.

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

Результат сборки:

```text
./spl/u-boot-spl.bin
```

#### 10.2.2 Упаковка прошивки

### 10.3 Системные модули

#### 10.3.1 GPT

SPL использует таблицу разделов GPT. Настройка:

```text
CONFIG_SPL_LIBDISK_SUPPORT=y
CONFIG_SPL_EFI_PARTITION=y
CONFIG_PARTITION_TYPE_GUID=y
```

Драйвер:

```text
./disk/part.c
./disk/part_efi.c
```

Интерфейс:

```text
int part_get_info(struct blk_desc *dev_desc, int part, disk_partition_t *info);
int part_get_info_by_name(struct blk_desc *dev_desc,
                          const char *name, disk_partition_t *info);
```

#### 10.3.2 A/B system

SPL поддерживает загрузку A/B. Настройка:

```text
CONFIG_SPL_AB=y
```

Драйвер:

```text
./common/spl/spl_ab.c
```

Интерфейс:

```text
int spl_get_current_slot(struct blk_desc *dev_desc, char *partition, char *slot);
int spl_get_partitions_sector(struct blk_desc *dev_desc, char *partition,u32 *sectors);
```

#### 10.3.3 Приоритет загрузки

SPL использует порядок u-boot,spl-boot-order из rkxxxx-u-boot.dtsi:

```text
chosen {
stdout-path = &uart2;
u-boot,spl-boot-order = &sdmmc, &sfc, &nandc, &emmc;
};
```

Приоритет загрузки Maskrom:

```text
spi nor > spi nand > emmc > sd
```

Приоритет загрузки pre-loader (SPL):

```text
sd > spi nor > spi nand > emmc
```

Максимальный приоритет SD облегчает загрузку системы с SD-карты.

#### 10.3.4 ATAGS

SPL и U-Boot передают параметры через ATAGS: загрузочный накопитель, UART вывода и другие сведения. Настройка:

```text
CONFIG_ROCKCHIP_PRELOADER_ATAGS=y
```

Драйвер:

```text
./arch/arm/include/asm/arch-rockchip/rk_atags.h
./arch/arm/mach-rockchip/rk_atags.c
```

Интерфейс:

```text
int atags_set_tag(u32 magic, void *tagdata);
struct tag *atags_get_tag(u32 magic);
```

#### 10.3.5 kernel boot

Обычно ядро загружает и запускает U-Boot, но это может делать и SPL. Поддерживаются boot.img с Android head version 2 и прошивка формата RK. Порядок запуска:

```text
Maskrom -> ddr -> SPL -> Trust -> Kernel
```

#### 10.3.6 pinctrl

Настройка:

```text
CONFIG_SPL_PINCTRL_GENERIC=y
CONFIG_SPL_PINCTRL=y
```

Драйвер:

```text
./drivers/pinctrl/pinctrl-uclass.c
./drivers/pinctrl/pinctrl-generic.c
./drivers/pinctrl/pinctrl-rockchip.c
```

Пример настройки DTS для sdmmc:

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

Примечание: при включении pinctrl в SPL удалите pinctrl-0 и pinctrl-names из CONFIG_OF_SPL_REMOVE_PROPS в defconfig.

#### 10.3.7 secure boot

[TODO — раздел оставлен незавершённым в оригинале.]

### 10.4 Драйверы

#### 10.4.1 MMC

Настройка:

```text
CONFIG_SPL_MMC_SUPPORT=y  // 默认已使能
```

Драйвер:

```text
./common/spl/spl_mmc.c
```

Интерфейс:

```text
int spl_mmc_load_image(struct spl_image_info *spl_image,
                       struct spl_boot_device *bootdev);
```

#### 10.4.2 MTD block

SPL объединяет интерфейсы NAND, SPI NAND и SPI NOR на уровне block. Настройка:

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

Драйвер:

```text
./common/spl/spl_mtd_blk.c
```

Интерфейс:

```text
int spl_mtd_load_image(struct spl_image_info *spl_image,
                       struct spl_boot_device *bootdev);
```

#### 10.4.3 OTP

Хранение неизменяемых данных, используемых Secure Boot. Настройка:

```text
CONFIG_SPL_MISC=y
CONFIG_SPL_ROCKCHIP_SECURE_OTP=y
```

Драйвер:

```text
./drivers/misc/misc-uclass.c
./drivers/misc/rockchip-secure-otp.S
```

Интерфейс:

```text
int misc_read(struct udevice *dev, int offset, void *buf, int size);
int misc_write(struct udevice *dev, int offset, void *buf, int size);
```

#### 10.4.4 Crypto

Secure Boot использует Crypto для вычисления hash и ras (так в оригинале). Настройка:

```text
CONFIG_SPL_DM_CRYPTO=y

// 2选1，各平台的defconfig已默认使能对应配置。
CONFIG_SPL_ROCKCHIP_CRYPTO_V1=y
CONFIG_SPL_ROCKCHIP_CRYPTO_V2=y
```

Драйвер:

```text
./drivers/crypto/crypto-uclass.c
./drivers/crypto/rockchip/crypto_v1.c
./drivers/crypto/rockchip/crypto_v2.c
./drivers/crypto/rockchip/crypto_v2_pka.c
./drivers/crypto/rockchip/crypto_v2_util.c
```

Интерфейс:

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

UART SPL задаётся узлом chosen в rkxxxx-u-boot.dtsi. Пример RK3308:

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

TPL — загрузчик более ранней стадии, чем U-Boot. Он работает в SRAM и заменяет ddr bin при инициализации DRAM. TPL имеет открытый исходный код, ddr bin — закрытый.

### 11.1 Сборка и упаковка

#### 11.1.1 Конфигурация

Настройка UART: CONFIG_DEBUG_UART_BASE — базовый адрес UART; CONFIG_ROCKCHIP_UART_MUX_SEL_M — группа IOMUX UART. Пример: RV1126 использует UART2 M2 для DEBUG LOG. Способ 1: изменить rv1126_defconfig.

```text
CONFIG_DEBUG_UART_BASE=0xff570000
CONFIG_ROCKCHIP_UART_MUX_SEL_M=2
```

Способ 2: make menuconfig.

```text
Device Drivers ---> Serial drivers ---> (0xff570000) Base address of UART
ARM architecture ---> (2) UART mux select
```

Настройка типа DRAM: CONFIG_ROCKCHIP_TPL_INIT_DRAM_TYPE задаёт поддерживаемый TPL тип DRAM.

| DDR TYPE | Значение настройки |
| --- | --- |
| DDR2 | 2 |
| DDR3 | 3 |
| DDR4 | 0 |
| LPDDR2 | 5 |
| LPDDR3 | 6 |
| LPDDR4 | 7 |

Пример:

Пример: TPL RV1126 с поддержкой DDR3. Способ 1: изменить rv1126_defconfig.

```text
CONFIG_ROCKCHIP_TPL_INIT_DRAM_TYPE=3
```

Способ 2: make menuconfig. Если make.sh вызывается с моделью чипа, сборка выполняет make xxxdefconfig и перезаписывает изменения menuconfig. Чтобы их сохранить, запускайте make.sh без аргументов.

```text
Device Drivers ---> (3) TPL select DRAM type
```

Пример: make rv1126_defconfig или ./make.sh rv1126 → изменить настройки через make menuconfig → ./make.sh. Быстрый старт: включите CONFIG_SPL_KERNEL_BOOT для tpl.bin с поддержкой быстрого старта; пока только RV1126/RV1109. Расширенный температурный диапазон: включите CONFIG_ROCKCHIP_DRAM_EXTENDED_TEMP_SUPPORT; пока только RV1126/RV1109. Остальные параметры: код инициализации DDR находится в drivers/ram/rockchip. Частота, сила драйверов, ODT и другие параметры изменяются в исходниках. Для RV1126/RV1109 они собраны в sdram_inc/rv1126/sdram-rv1126-loader_params.inc этого каталога; для других платформ изменяйте соответствующий sdram_xxx.c.

#### 11.1.2 Сборка

TPL собирается из того же кода U-Boot с другим путём компиляции. Автоматически определяется CONFIG_TPL_BUILD. После сборки u-boot.bin продолжается сборка TPL с отдельным каталогом результатов ./tpl/.

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

Результат сборки:

```text
./tpl/u-boot-tpl.bin
```

Пример: сборка U-Boot RV1126.

```text
./make.sh rv1126
```

#### 11.1.3 Упаковка

1. Для получения корректного ddr bin замените первые 4 байта u-boot-tpl.bin тегом платформы. Для RV1126/RV1109 это 110B. Если требуется только ddr bin, замену нужно выполнить самостоятельно; см. scripts/spl.sh. Пример замены тега u-boot-tpl.bin RV1126:

```text
dd bs=4 skip=1 if=tpl/u-boot-tpl.bin of=tpl/u-boot-tpl-tag.bin && sed -i '1s/^/110B&/'
tpl/u-boot-tpl-tag.bin
```

2. Следующая команда автоматически заменяет тег u-boot-tpl.bin и упаковывает его с spl.bin в полный Loader, пригодный для записи на плату.

```text
./make.sh tpl
```

## 12 FIT

### 12.1 Введение

Глава описывает FIT и безопасную/обычную загрузку на его основе. Для удобства примеры и операции показаны на boot.img, но также применимы к recovery.img.

### 12.2 Введение

#### 12.2.1 Основы

FIT (flattened image tree) — поддерживаемая U-Boot схема загрузки нового типа прошивок, позволяющая упаковывать и проверять произвольное число образов. ITS (image source file) описывает образы, mkimage создаёт ITB (flattened image tree blob). ITS использует гибкий синтаксис DTS, libfdt и соответствующие инструменты применимы напрямую. FIT поддерживается по умолчанию и рекомендуется U-Boot; загрузка FIT доступна и в SPL, и в U-Boot. Подробнее:

```text
./doc/uImage.FIT/
```

Поскольку стандартные функции FIT не покрывают потребности изделий, RK адаптировала и оптимизировала FIT. Поэтому обязателен mkimage, собранный из RK U-Boot, а не штатный mkimage компьютера.

#### 12.2.2 Разбор примера

Пример u-boot.its/u-boot.itb: /images статически определяет все ресурсы, подобно DTSI; в /configurations каждый config описывает загрузочную конфигурацию, подобно DTS платы; default = указывает конфигурацию по умолчанию.

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

Создание ITB с помощью mkimage и ITS:

```text
                          mkimage + dtc
[u-boot.its] + [images]    =========>      [u-boot.itb]
```

Просмотр ITB командой fdtdump:

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

#### 12.2.3 Структура ITB

ITB представляет собой совокупность fdt_blob и образов. Существуют две схемы упаковки; RK использует структуру 2.

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

### 12.3 Конфигурация платформы

#### 12.3.1 Поддержка чипов

Платформы, для которых функция официально выпущена в SDK, указаны в таблице возможностей чипов в начале документа.

#### 12.3.2 Конфигурация кода

Код:

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

Настройка:

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

Crypto различается между платформами, поэтому настройки RSA также отличаются. См. общий defconfig текущей платформы.

```text
CONFIG_RSA_N_SIZE
CONFIG_RSA_E_SIZE
CONFIG_RSA_C_SIZE
```

Общий defconfig: [чип]_defconfig, например rv1126_defconifg, rk3568_defconifg (написание примеров сохранено). Если FIT официально включён в SDK, большинство базовых настроек уже активировано. Пользователь задаёт следующие параметры:

```text
// U-Boot 安全启动和防回滚机制
CONFIG_FIT_SIGNATURE=y
CONFIG_FIT_ROLLBACK_PROTECT=y

// SPL 安全启动和防回滚机制
CONFIG_SPL_FIT_SIGNATURE=y
CONFIG_SPL_FIT_ROLLBACK_PROTECT=y
```

Без CONFIG_FIT_SIGNATURE U-Boot может загружать android, uimage и fit; конкретный SDK включает нужные платформе форматы. С CONFIG_FIT_SIGNATURE поддерживается только FIT.

#### 12.3.3 Файлы образов

Схема FIT создаёт два записываемых FIT-образа — uboot.img (без trust.img) и boot.img — и SPL для упаковки Loader. uboot.itb = trust + u-boot.bin + mcu.bin (необязательно); uboot.img = N копий uboot.itb, обычно N=2. Trust и MCU берутся из rkbin автоматически скриптом сборки. boot.itb = kernel + fdt + resource + ramdisk (необязательно); boot.img = M копий boot.itb, обычно M=1.

Настройка MCU: некоторые платформы содержат MCU-прошивку. Её включение определяется TRUST INI для конкретного изделия, например:

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

Сжатие прошивки: некоторые платформы поддерживают сжатие внутренних компонентов uboot.img следующим образом:

| Платформа | Формат сжатия | Прошивка |
| --- | --- | --- |
| RV1126 | gzip、none | u-boot.bin, trust, mcu(optional) |

Для включения добавьте свойства в соответствующий TRUST INI проекта rkbin, например:

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

SPL — полученный при сборке spl/u-boot-spl.bin, загружающий FIT-образ uboot.img. Им заменяется закрытый miniloader RK, после чего упаковывается Loader. После сборки U-Boot создаётся каталог ./fit с промежуточными файлами, описанными далее. boot.img собирается в SDK, uboot.img — в проекте U-Boot. Но boot.img для Secure Boot необходимо повторно упаковать и подписать в проекте U-Boot, как показано далее.

#### 12.3.4 Файл ITS

ITS U-Boot расположен в ./fit/u-boot.its. Он динамически создаётся скриптом CONFIG_SPL_FIT_GENERATOR из defconfig и появляется после успешной сборки. ITS boot находится в проекте SDK:

```text
device/rockchip/[platform]/xxx.its  // [platform]是平台⽬录
```

#### 12.3.5 Инструменты

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

Инструменты описаны далее; здесь параметры make.sh. Необязательные: --spl-new использует только что собранный SPL для Loader, иначе берётся SPL из rkbin; --version-uboot [n], --version-boot [n], --version-recovery [n] задают версии uboot.img, boot.img, recovery.img соответственно, n — положительное десятичное целое. Обязательные при Secure Boot: --rollback-index-uboot [n], --rollback-index-boot [n], --rollback-index-recovery [n] задают версии защиты от отката для соответствующих образов, n — положительное десятичное целое. --no-check применяется при упаковке защищённой прошивки для пропуска самопроверки скрипта упаковки.

Пояснения:

1. Версия защиты от отката активируется только при Secure Boot и хранится в OTP или другом защищённом хранилище. Она предотвращает атаки через уязвимости старой прошивки после отката.

2. Версия прошивки необязательна, по умолчанию 0. Это лишь идентификатор, облегчающий управление версиями.

### 12.4 Загрузка без Secure Boot

#### 12.4.1 uboot.img

Команда сборки:

```text
./make.sh rv1126 --spl-new --uboot-version 10  // 可不指定 --spl-new和--uboot-version
```

Результат сборки:

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

Резервные копии: число копий uboot.img задаётся в defconfig:

```text
CONFIG_SPL_FIT_IMAGE_KB=2048    // 单份itb⼤⼩
CONFIG_SPL_FIT_IMAGE_MULTIPLE=2 // 打包的份数
```

SPL ищет и запускает U-Boot и trust согласно этой настройке, главным образом чтобы избежать отказа загрузки после повреждения прошивки при аварийном отключении питания во время OTA.

#### 12.4.2 boot.img

Если FIT официально включён в SDK, сборка SDK создаёт boot.img формата FIT. Для Secure Boot перенесите его в проект U-Boot, повторно упакуйте и подпишите: инструменты подписи, настройки и параметры защищённой упаковки находятся именно там.

### 12.5 Безопасная загрузка

FIT поддерживает Secure Boot: sha256 + rsa2048 + pkcs-v2.1 (PSS) padding, защиту от отката, повторную/удалённую подпись прошивки и аппаратное ускорение Crypto.

#### 12.5.1 Принцип

##### 12.5.1.1 Процедура проверки

Maskrom проверяет Loader (SPL, DDR, usbplug). SPL проверяет uboot.img (trust, U-Boot и т. д.). U-Boot проверяет boot.img (kernel, fdt, ramdisk и т. д.). По умолчанию поддерживается только sha256+rsa2048+pkcs-v2.1 (PSS) padding.

##### 12.5.1.2 Хранение ключа

mkimage помещает RSA-ключ в u-boot.dtb и u-boot-spl.dtb, которые затем включаются в u-boot.bin и u-boot-spl.bin. Формат ключа в u-boot.dtb показан ниже; для u-boot-spl.dtb аналогично:

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

SPL поддерживает запись хеша ключа; в key-dev файла u-boot-spl.dtb добавляется burn-key-hash = &lt;0x00000001&gt;;.

##### 12.5.1.3 Использование ключа

От Maskrom до ядра используется единый открытый RSA-ключ. Maskrom проверяет Loader: ПК-утилита rk_sign_tool записывает ключ в заголовок Loader. При Secure Boot Maskrom извлекает и проверяет ключ, затем им проверяет подпись Loader. rk_sign_tool находится в rkbin; U-Boot автоматически подписывает Loader. SPL проверяет U-Boot и trust: ключ хранится в u-boot-spl.dtb, включённом в u-boot-spl.bin и затем Loader. SPL извлекает ключ из собственного DTB и проверяет uboot.img.

U-Boot проверяет boot: открытый RSA-ключ находится в u-boot.dtb, включённом в u-boot.bin и затем uboot.img. При Secure Boot ключ извлекается из собственного DTB для проверки boot.img. Таким образом, ключ текущей стадии является частью её прошивки и уже проверен предыдущим загрузчиком, что обеспечивает его защищённость.

##### 12.5.1.4 Хранение подписи

RSA-подпись хранится в ITB. Подписываемое содержимое определяется hashed-nodes и включает свойства всего узла conf, узлы упакованных прошивок и т. д. Ниже сведения о подписи u-boot.itb; для boot.itb аналогично:

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

##### 12.5.1.5 Защита от отката

При Secure Boot текущие версии boot.img и uboot.img задаются отдельно. Если версия меньше минимально допустимой на устройстве, загрузка запрещается. Минимальная версия обновляется в OTP или защищённом хранилище после успешной проверки безопасности и подтверждения нормального запуска системы.

#### 12.5.2 Подготовка

##### 12.5.2.1 Ключ

Следующие три команды в проекте U-Boot создают пару RSA-ключей для подписи. Обычно её создают один раз и далее используют для подписи и проверки всех прошивок. Храните ключи надёжно.

```text
// 1. 放key的⽬录：keys
mkdir -p keys

// 2. 使⽤RK的"rk_sign_tool"⼯具⽣成RSA2048的私钥privateKey.pem和publicKey.pem（请参考
rk_sign_tool的使⽤⼿册），分别更名存放为：keys/dev.key和keys/dev.pubkey。

// 3. 使⽤-x509和私钥⽣成⼀个⾃签名证书：keys/dev.crt （效果本质等同于公钥）
openssl req -batch -new -x509 -key keys/dev.key -out keys/dev.crt
```

Если сообщается об отсутствии .rnd в домашнем каталоге: `Can't load /home4/cjh//.rnd into RNG` и `140522933268928:error:2406F079:random number generator:RAND_load_file:Cannot open file:../crypto/rand/randfile.c:88:Filename=/home4/cjh//.rnd`, создайте файл командой `touch ~/.rnd`. Проверьте результат: `ls keys/`.

```text
dev.crt  dev.key  dev.pubkey
```

Внимание: имена keys, dev.key, dev.crt и dev.pubkey изменять нельзя: они статически заданы в ITS, и изменение приведёт к ошибке упаковки.

##### 12.5.2.2 Настройка

Включите в defconfig U-Boot:

```text
// 必选。
CONFIG_FIT_SIGNATURE=y
CONFIG_SPL_FIT_SIGNATURE=y

// 可选。
CONFIG_FIT_ROLLBACK_PROTECT=y       // boot.img防回滚
CONFIG_SPL_FIT_ROLLBACK_PROTECT=y   // uboot.img防回滚
```

Рекомендуется выбирать настройки через make menuconfig, затем обновлять исходный defconfig командой make savedefconfig. Это предотвращает ошибки зависимостей и сборки при прямом добавлении параметров в defconfig.

##### 12.5.2.3 Прошивка

Скопируйте созданный в SDK boot.img в корень проекта U-Boot.

#### 12.5.3 Сборка и упаковка

(1) Основная команда без защиты от отката:

```text
./make.sh rv1126 --spl-new --boot_img boot.img --recovery_img recovery.img
```

Результат сборки:

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

(2) Расширение 1: при включении защиты от отката добавьте параметры rollback к команде (1), например:

```text
// 指定 uboot.img和boot.img的最⼩版本号分别为10、12.
./make.sh rv1126 --spl-new --boot_img boot.img --recovery_img recovery.img --rollback-index-
uboot 10 --rollback-index-boot 12 --rollback-index-recovery 12
```

Результат сборки:

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

(3) Расширение 2: чтобы записать хеш открытого ключа в OTP/eFUSE, добавьте --burn-key-hash к (1) или (2), например:

```text
// 指定uboot.img和boot.img的最⼩版本号分别为10、12.
// 要求SPL阶段把公钥hash烧写到OTP/eFUSE中。
./make.sh rv1126 --spl-new --boot_img boot.img --recovery_img recovery.img --rollback-index-
uboot 10 --rollback-index-boot 12 --rollback-index-recovery 12 --burn-key-hash
```

Результат сборки:

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

После включения SPL выводит: RSA: Write key hash successfully. (4) Примечания: --boot_img и --recovery_img необязательно задают подписываемые boot.img и recovery.img. --rollback-index-uboot, --rollback-index-boot, --rollback-index-recovery необязательно задают версии защиты от отката. Без --spl-new Loader упаковывается с SPL из rkbin; с этим параметром используется только что собранный

SPL. Поскольку u-boot-spl.dtb должен содержать RSA-ключ пользователя, опубликованный RK SDK не содержит в rkbin SPL с поддержкой Secure Boot. Поэтому укажите этот параметр. Можно также сохранить собственный стабильный SPL в rkbin и в дальнейшем собирать без параметра, используя его каждый раз. Создаются Loader, uboot.img и boot.img; пока RSA-ключ не меняется, любой из этих образов можно обновлять отдельно.

#### 12.5.4 Принципы проверки

(1) Maskrom проверяет SPL: без ключа в OTP загрузка незащищённая. При записанном ключе Maskrom требует совпадения ключа Loader с OTP и только затем проверяет безопасность; несовпадение запрещает старт. (2) SPL проверяет U-Boot: CONFIG_SPL_FIT_SIGNATURE=y всегда проверяет uboot.img и запускает его только при успехе; отсутствие или ошибка подписи запрещают старт. При =n SPL не содержит соответствующего кода и не проверяет uboot.img независимо от наличия подписи. (3) U-Boot проверяет boot/recovery: CONFIG_FIT_SIGNATURE=y всегда проверяет boot.img/recovery.img и запускает только при успехе; отсутствие или ошибка подписи запрещают старт. При =n эти образы не проверяются независимо от подписи. Важно: проверка следующей стадии зависит не от подписи текущей стадии, а исключительно от наличия кода Secure Boot, то есть значений y указанных настроек.

#### 12.5.5 Сообщения загрузки

Вывод при Secure Boot:

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

### 12.6 Независимая подпись

Независимая подпись FIT распаковывает неподписанную прошивку, затем упаковывает и подписывает её заново. Сначала описан процесс, затем инструменты. Функция поддерживается с января 2025 года; убедитесь, что U-Boot и rkbin содержат необходимые патчи. Репозиторий U-Boot:

```text
91b5d8722da scripts: Add fit-sign.sh
554ddf99bfb scripts: fit-core.sh: Add fit_signcfg export support
cb458c93a05 scripts: fit-core.sh: Add --no-sign support
bc02f36c3b2 scripts: fit-unpack: Support none digest node
```

Репозиторий rkbin:

```text
44216040fad tools: build mkimage/fit_check_sign with -static
88d46662a9b tools: Add fit sign tools support
```

#### 12.6.1 Процесс подписания

Действия специалиста по сборке прошивки:

1. Включите необходимые настройки согласно предыдущему разделу Secure Boot.

2. Выполните сборку:

```text
./make.sh rk3588 --spl-new --no-sign   # 必须追加 --spl-new --no-sign
```

После сборки создаются:

```text
uboot.img
rk3588_spl_loader_v1.18.113.bin
fit/fit_signcfg/
```

3. Передайте три полученных файла и остальные FIT-образы для подписи, например boot.img/recovery.img, ответственному специалисту или серверу. Важно: Loader, uboot и fit_signcfg строго связаны; нельзя смешивать их с одноимёнными файлами другой сборки, иначе скрипт подписи завершится ошибкой. Действия специалиста или сервера подписи:

1. Создайте рабочий каталог с произвольным именем:

```text
$ mkdir workspace
$ cd workspace
$ mkdir keys src output
```

2. Загрузите репозиторий rkbin и скопируйте либо символически подключите его каталог tools в workspace:

```text
$ cp ~/rkbin/tools/ ./ -R
```

3. Поместите пару RSA-ключей в keys согласно разделу Secure Boot, а прошивки и fit_signcfg — в src. Loader, uboot и fit_signcfg обязательны; дополнительно можно поместить другие FIT-образы, например boot.img/recovery.img. Пример:

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

4. Выполните подпись:

```text
$ ./tools/fit-sign.sh --key-dir keys/ --src-dir src/ --out-dir output/
```

Исходные файлы в src не изменяются. После успешной подписи все подписанные прошивки появляются в output:

```text
$ tree output/
output/
├── boot.img
├── recovery.img
├── rk3588_spl_loader_v1.18.113.bin
└── uboot.img
```

#### 12.6.2 Скрипт подписания

Инструменты независимой подписи находятся в rkbin. Скрипт для разработчиков: ./tools/fit-sign.sh.

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

--key-dir обязателен: каталог RSA-ключей. --src-dir обязателен: каталог прошивок, содержащий Loader, uboot и fit_signcfg. --out-dir обязателен: каталог результатов подписи. --burn-key-hash необязателен, без дополнительного значения: разрешает SPL записать хеш открытого RSA-ключа в OTP. --rollback-index необязательно задаёт десятичную версию защиты от отката соответствующей прошивки. --version необязательно задаёт обычную десятичную версию файла. Пример:

```text
./tools/fit-sign.sh --key-dir keys/ --src-dir src/ --out-dir output/ --version uboot.img 1
boot.img 3 --rollback-index uboot.img 3 boot.img 5
```

#### 12.6.3 Конфигурация подписи

Чтобы гарантировать включение указанных при подписи функций в SPL и U-Boot, сборка дополнительно создаёт файлы записи конфигурации. Скрипт подписи использует эти файлы.

```text
$ tree fit_signcfg/
fit_signcfg/
├── MINIALL.ini            # 打包loader⽤的ini⽂件。
├── sign.readonly_config   # 当前编译配置、uboot、loader版本相关的记录⽂件。
└── test_images.tar.gz     # 暂时⽆⽤，忽略。
```

### 12.7 Удалённая подпись

Независимая подпись требует передачи всей прошивки специалисту или серверу, что влияет на объём и скорость передачи. Удалённая подпись — более лёгкая альтернатива. Выберите подходящую схему с учётом её преимуществ и недостатков.

#### 12.7.1 Реализация

Поскольку доступен только открытый ключ сервера, сначала на локальном ПК прошивка упаковывается и подписывается временным закрытым ключом вместе с открытым ключом сервера. Получаются защищённая прошивка с временной подписью и подписываемые данные. Открытый ключ включается в DTB для Secure Boot, закрытый создаёт временную подпись. Серверу отправляются только подписываемые данные, а не вся прошивка. Сервер подписывает их своим закрытым ключом и возвращает подпись. Она заменяет временную подпись в образе, образуя окончательную защищённую прошивку для записи.

#### 12.7.2 Подписываемые данные

Подписываемые данные состоят из конфигурации FDT blob и набора хешей подобразов. hashed-nodes задаёт узлы FDT, содержимое которых включается в подписываемые данные.

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

Набор хешей подобразов: mkimage автоматически вычисляет хеш каждого и добавляет узел hash. Все хеши образов из sign-images включаются в подписываемые данные, фактически через указание узлов hash в hashed-nodes. Пример:

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

#### 12.7.3 Подробные шаги

Пара RSA-ключей представлена dev.key, dev.pubkey и dev.crt. Закрытый dev.key хранится на сервере; пользователь имеет только dev.pubkey и dev.crt. Шаг 1 в локальном проекте U-Boot: поместите dev.crt в keys, утилитой RK rk_sign_tool создайте случайный временный закрытый ключ и сохраните его как keys/dev.key. По предыдущему разделу создайте подписанные uboot.img и boot.img, обязательно добавив --no-check. Сами эти образы не будут использоваться; нужны промежуточные файлы. --no-check обязателен, иначе несовпадение dev.key/dev.crt приведёт к ошибке самопроверки упаковки. Например:

```text
./make.sh rv1126 --spl-new --boot_img boot.img --rollback-index-uboot 10 --rollback-index-
boot 12 --no-check
```

Помимо подписанных uboot.img и boot.img в fit/ доступны промежуточные файлы:

```text
// 被签名内容(data2sign意为：data to sign)
fit/uboot.data2sign
fit/boot.data2sign

// 已签名itb⽂件（使⽤临时私钥），我们的img⽂件由它们进⾏多备份后获得。
fit/uboot.itb
fit/boot.itb
```

Шаг 2: передайте uboot.data2sign удалённому серверу. Если его закрытый ключ называется dev.key, следующая команда создаёт подпись uboot.sig:

```text
openssl dgst -sha256 -sign dev.key -sigopt rsa_padding_mode:pss -out uboot.sig
uboot.data2sign
```

Сервер возвращает uboot.sig. Замените им временную подпись в uboot.itb:

```text
./scripts/fit-resign.sh -f fit/uboot.itb -s uboot.sig // 会⽣成新的uboot.img，⽤于烧写
```

Для boot.itb выполните то же самое: получаются действительные подписанные uboot.img и boot.img. Важно: -f в fit-resign.sh указывает ITB, не IMG; скрипт переподписывает ITB и создаёт IMG. ITB должен быть именно из шага 1: ITB и data2sign связаны один к одному, поскольку data2sign включает временную метку /timestamp = &lt;...&gt; создания ITB. Даже без изменения кода новая сборка uboot.itb с прежним uboot.sig приведёт к отказу Secure Boot. Поскольку локально закрытого ключа нет, Loader отправляется серверу для подписи отдельно.

### 12.8 Распаковка прошивки

Скрипт распаковывает прошивку, например boot.img:

```text
cjh@ubuntu:~/uboot-nextdev$ ./scripts/fit-unpack.sh -f boot.img -o out
Unpack to directory out:
  fdt                 : 82813 bytes... sha256+
  kernel              : 5844640 bytes... sha256+
  ramdisk             : 0 bytes... sha256+
  resource            : 120832 bytes... sha256+
```

Если IMG содержит несколько копий, распаковывается только первый ITB. sha256+ означает отсутствие повреждений; иначе выводится sha256-.

### 12.9 Замена прошивки

Скрипт позволяет пакетно заменять компоненты. Например, для использования своего bl31.elf вместо компонента чужого uboot_legacy.img:

1. Соберите собственный uboot.img со своим bl31.elf.

2. Распакуйте uboot_legacy.img в out/ скриптом fit-unpack.sh.

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

3. Удалите все atf-xxx из out/.

4. С помощью fit-repack.sh замените в собственном uboot.img все подобразы содержимым out/. Теперь uboot.img содержит собственный bl31 и остальные компоненты uboot_legacy.img, как требовалось.

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

Принцип: не собственный компонент вставляется в чужой uboot.img, а чужие компоненты — в собственный. Компоненты atf-xxx происходят из bl31.elf; их количество в разных версиях может отличаться, делая прямую замену невозможной. Хотя число u-boot, bl32, mcu и остальных компонентов фиксировано, для поддержки bl31.elf выбрана обратная стратегия. Для других компонентов применяется тот же подход.

### 12.10 Проверка безопасности пошагово

1. В каталоге u-boot откройте configs/rxxxxx_defconfig нужной платформы и выберите:

```text
// 必选。
CONFIG_FIT_SIGNATURE=y
CONFIG_SPL_FIT_SIGNATURE=y

// 可选。
CONFIG_FIT_ROLLBACK_PROTECT=y       // boot.img防回滚
CONFIG_SPL_FIT_ROLLBACK_PROTECT=y   // uboot.img防回滚
```

2. Создайте keys следующими действиями:

```text
mkdir -p keys
../rkbin/tools/rk_sign_tool kk --bits 2048 --out .
cp privateKey.pem keys/dev.key && cp publicKey.pem keys/dev.pubkey
openssl req -batch -new -x509 -key keys/dev.key -out keys/dev.crt
```

Примечание: выполните этот шаг один раз и надёжно сохраните ключи.

3. Сборка и подпись на примере RV1126. Для другого чипа, например RK3566, замените rv1126 на rk3566 в командах:

```text
// Linux：拷⻉boot.img，recovery.img到u-boot⽂件下，执⾏下列脚本签名loader,uboot,boot,recovery，设
置uboot,boot,recovery的防版本回滚号，注意防版本回滚号依据需要配置
./make.sh rv1126 --spl-new --boot_img boot.img --recovery_img recovery.img --rollback-index-
uboot 1 --rollback-index-boot 2

// Android：签名loader,uboot，设置uboot的防版本回滚号，注意防版本回滚号依据需要配置
./make.sh rv1126 --spl-new --rollback-index-uboot 1
```

Если при сборке появляется:

```text
Can't load XXXXXX//.rnd into RNG
```

Выполните:

```text
touch ~/.rnd
```

4. Запись хеша открытого ключа:

```text
// Linux：拷⻉boot.img，recovery.img到u-boot⽂件下，执⾏下列脚本签名loader,uboot,boot,recovery，设
置uboot,boot,recovery的防版本回滚号，注意防版本回滚号依据需要配置，使能烧写key hash
./make.sh rv1126 --spl-new --boot_img boot.img --recovery_img recovery.img --rollback-index-
uboot 1 --rollback-index-boot 2 --burn-key-hash

// Android：签名loader,uboot，设置uboot的防版本回滚号，注意防版本回滚号依据需要配置，使能烧写key hash
./make.sh rv1126 --spl-new --rollback-index-uboot 1 --burn-key-hash
```

Внимание: настройте --burn-key-hash только после завершения разработки и проверки изделия. Иначе Secure Boot включится, и в ходе разработки обновлять можно будет только подписанной прошивкой.

5. Подпись остальных прошивок Android: см. Rockchip_Developer_Guide_Secure_Boot_for_UBoot_Next_Dev_CN.md.

## 13 Быстрая загрузка

### 13.1 Поддержка чипов

rv1126

### 13.2 Поддержка носителей

eMMC; SPI NOR

### 13.3 Поддержка BootROM

Драйвер SPI NOR BootROM поддерживает загрузку следующей прошивки в четырёхлинейном DMA-режиме. Это уже настраивается usbplug при записи прошивки, дополнительных действий заказчика не требуется. Для eMMC такой оптимизации пока нет.

### 13.4 Поддержка U-Boot SPL

U-Boot SPL поддерживает быстрый старт FIT, вход в Loader по кнопке и обнаружение низкого заряда. Настройка:

```text
CONFIG_SPL_KERNEL_BOOT=y             // 开启快速开机功能
CONFIG_SPL_BLK_READ_PREPARE=y        // 开启预加载功能
CONFIG_SPL_MISC_DECOMPRESS=y         // 开启解压功能
CONFIG_SPL_ROCKCHIP_HW_DECOMPRESS=y
```

Предзагрузка U-Boot SPL позволяет загружать прошивку параллельно выполнению других программ. Сейчас главным образом используется для ramdisk. Пример предварительно сжатого gzip ramdisk; команда сжатия:

```text
cat ramdisk | gzip -n -f -9 > ramdisk.gz
```

Настройка ITS:

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

Сборка прошивки, например RV1126 eMMC:

```text
./make.sh rv1126-emmc-tb && ./make.sh --spl
```

### 13.5 Конфигурация MCU

MCU помогает запуску системы, заранее инициализируя ISP и другие модули. После запуска ядро принимает управление ими. Настройка находится в файле соответствующего чипа в rkbin/RKTRUST, пример RV1126:

```text
[MCU]
MCU=bin/rv11/rv1126_mcu_v1.02.bin,0x108000,okay // 配置对应固件位置，启动地址和使能标志
```

Адрес программы MCU:

```text
https://10.10.10.29/admin/repos/rtos/rt-thread/rt-thread-amp
https://10.10.10.29/admin/repos/rk/mcu/hal
```

При сборке U-Boot прошивка MCU включается в uboot.img. Во время старта SPL извлекает и загружает её из uboot.img.

### 13.6 Поддержка ядра

Настройка:

```text
CONFIG_ROCKCHIP_THUNDER_BOOT=y           // 开启快速开机功能
CONFIG_ROCKCHIP_THUNDER_BOOT_MMC=y       // 开启⽀持emmc快速开机优化功能
CONFIG_ROCKCHIP_THUNDER_BOOT_SFC=y       // 开启⽀持spi nor快速开机优化功能
CONFIG_VIDEO_ROCKCHIP_THUNDER_BOOT_ISP=y // 开启⽀持ISP快速开机优化功能
```

Для быстрого старта SPL не корректирует DTB ядра по фактическим аппаратным параметрам. Пользователь должен самостоятельно задать memory и размеры ramdisk до и после распаковки.

Подробнее: kernel/arch/arm/boot/dts/rv1126-thunder-boot.dtsi.

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

Настройки eMMC:

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

Настройки SPI NOR:

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

### 13.7 Процесс быстрой загрузки

## 14 Определения платформ

### 14.1 ATF/OPTEE

1. Минимальные версии ATF/OPTEE для режима ожидания зарядки U-Boot:

| Чип | Минимальная версия |
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

| Чип | Минимальная версия |
| --- | --- |
| RV1126B | N/A |

### 14.2 Clock

1. Поддержка повышения частоты CPU:

| Чип | Поддержка | Изменения при повышении частоты |
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
| PX30 | Обычный clock | Напряжение + частота |
| RK3326 | Обычный clock | Напряжение + частота |
| RV1126/RV1109 | N/A | N/A |
| RK3568 | SCMI clock | Напряжение + частота |
| RK3566 | SCMI clock | Напряжение + частота |
| RK3588 | N/A | N/A |
| RV1106/RV1103 | N/A | N/A |
| RK3528 | SCMI clock | Напряжение |
| RK3562 | SCMI clock | Напряжение |
| RK3576 | N/A | N/A |
| RV1106B/RV1103B | N/A | N/A |
| RK3506 | N/A | N/A |
| RV1126B | N/A | N/A |

### 14.3 Defconfig

1. Поддерживаемые defconfig платформ (определяется выпущенным SDK): [чип]_defconfig или [чип].config обычно являются полнофункциональными версиями; остальные предназначены для отдельных возможностей.

| Чип | defconfig | Поддержка kernel dtb | Примечания |
| --- | --- | --- | --- |
| RV1108 | evb-rv1108_defconfig | N | Общая версия |
| RK1808 | rk1808_defconfig | Y | Общая версия |
| RK1806 | rk1806_defconfig | Y | Общая версия |
| RK3036 | rk3036_defconfig | Y | Общая версия |
| RK3128x | rk3128x_defconfig | Y | Общая версия |
| RK3126 | rk3126_defconfig | Y | Общая версия |
| RK322x | rk322x_defconfig | Y | Общая версия |
| RK3288 | rk3288_defconfig | Y | Общая версия |
| RK3368 | rk3368_defconfig | Y | Общая версия |
| RK3328 | rk3328_defconfig | Y | Общая версия |
| RK3399 | rk3399_defconfig | Y | Общая версия |
| RK3399Pro | rk3399pro_defconfig | Y | Общая версия |
| RK3399Pro-npu | rknpu-lion_defconfig | Y | Общая версия |
| RK3308 | rk3308_defconfig<br>rk3308-aarch32_defconfig | Y | Общая версия<br>Поддержка режима aarch32 |
| PX30 | px30_defconfig | Y | Общая версия |
| RK3326 | rk3326_defconfig<br>rk3326-aarch32_defconfig | Y | Общая версия<br>Поддержка режима aarch32 |
| RV1126 | rv1126_defconfig<br>rv1126-ab.config<br>rv1126-spi-nor-tiny_defconfig<br>rv1126-ramboot.config<br>rv1126-usbplug.config<br>rv1126-dfu.config<br>rv1126-ipc.config | Y | Общая версия<br>Общая версия + поддержка A/B<br>Spi Nor малого объёма<br>Без накопителя (загрузка из RAM)<br>Функция usbplug<br>Поддержка dfu<br>Для ipc sdk |
| RV1126 | rv1126-emmc-tb.config<br>rv1126-lp3-emmc-tb.config<br>rv1126-spi-nor-tb.config | Y | Быстрый запуск eMMC+DDR3<br>Быстрый запуск eMMC+LP3<br>Быстрый запуск Spi Nor+DDR3 |
| RK3568 | rk3568_defconfig<br>rk3568-dfu.config<br>rk3568-nand.config<br>rk3568-spl-spi-nand_defconfig<br>rk3568-aarch32.config<br>rk3568-usbplug.config | Y | Общая версия<br>Поддержка dfu<br>Поддержка MLC/TLC/ eMMC<br>Специальный SPL для SPI-nand<br>Поддержка режима aarch32<br>Поддержка режима usbplug |

| Чип | defconfig | Поддержка kernel dtb | Примечания |
| --- | --- | --- | --- |
| RK3566 | rk3566.config<br>rk3566-eink.config | Y | Общая версия<br>Версия для электронной книги |
| RK3588 | rk3588_defconfig<br>rk3588-ramboot.config<br>rk3588-sata.config<br>rk3588-aarch32.config<br>rk3588-ipc.config | Y | Общая версия<br>Без накопителя (загрузка из RAM)<br>Два накопителя с загрузкой sata<br>Поддержка режима aarch32<br>Для ipc sdk |
| RV1106/RV1103 | rv1106_defconfig<br>rv1106-emmc-tb_defconfig<br>rv1106-spi-nor-tb_defconfig<br>rv1106-spi-nor_defconfig<br>rv1106-display.config<br>rv1106-dfu.config<br>rv1106-ipc.config | Y | Общая версия<br>Быстрый запуск eMMC<br>Быстрый запуск Spi Nor<br>Spi Nor малого объёма<br>Поддержка загрузочного логотипа<br>Поддержка dfu<br>Для ipc sdk |
| RK3528 | rk3528_defconfig | Y | Общая версия |
| RK3562 | rk3562_defconfig | Y | Общая версия |
| RK3576 | rk3576_defconfig<br>rk3576-usbplug.config<br>rk3576-car.config<br>rk3576-ab-car.config<br>rk3576-eink.config | Y | Общая версия<br>Открытый usbplug<br>Автомобильная версия<br>Автомобильная версия с поддержкой ab<br>Версия для электронной книги |
| RV1106B | rv1106b_defconfig<br>rv1106b-emmc-tb_defconfig<br>rv1106b-spi-nand-tb_defconfig | Y | Общая версия<br>Быстрый запуск eMMC<br>Быстрый запуск Spi Nand |
| RV1103B | rv1103b_defconfig<br>rv1103b-optee.config<br>rv1103b-spi-nor_defconfig | Y | Общая версия<br>Поддержка OP-TEE<br>Spi Nor малого объёма |
| RK3506 | rk3506_defconfig<br>rk3506_tb.config<br>rk3506-amp.config<br>rk3506b.config | Y | Общая версия<br>Версия быстрого запуска<br>Для amp sdk<br>Только для RK3506B |
| RV1126B | rv1126b_defconfig<br>rv1126b-usbplug.config<br>rv1126b-ipc.config<br>rv1126b-spi-nor_defconfig | Y | Общая версия<br>Открытый usbplug<br>Для ipc sdk<br>Spi Nor малого объёма |

### 14.4 DFU

1. Поддержка DFU:

| Чип | defconfig |
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

1. Применимость интерфейса OP-TEE client на платформах:

| API | RV1109/RV1126 | RK3566/RK3568 | RK3588 | RV1106/RV1103 | RK3528 | RK3562 | RK3576 | RV1106B/RV1103B | RK3506 | RV1126B | others |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| trusty_read_vbootkey_hash | √ | √ | √ | N/A | √ | √ | √ | √ | N/A | √ | √ |
| trusty_write_vbootkey_hash | √ | √ | √ | N/A | √ | √ | √ | √ | N/A | √ | √ |
| trusty_read_vbootkey_enable_flag | √ | √ | √ | N/A | √ | √ | √ | √ | N/A | √ | √ |
| trusty_write_oem_otp_key | √ | √ | √ | N/A | √ | √ | √ | √ | N/A | √ | N/A |
| trusty_oem_otp_key_is_written | √ | √ | √ | N/A | √ | √ | √ | √ | N/A | √ | N/A |
| trusty_set_oem_hr_otp_read_lock | N/A | N/A | √ | N/A | √ | √ | √ | N/A | N/A | √ | N/A |
| trusty_oem_otp_key_cipher | √ | √ | √ | N/A | √ | √ | √ | √ | N/A | √ | N/A |

## 15 Предостережения

### 15.1 Совместимость SDK

#### 15.1.1 Совместимость androidboot.mode

Для SDK старше Android 8.1 необходимо включить следующую настройку U-Boot, чтобы Android нормально запускался:

```text
CONFIG_RKIMG_ANDROID_BOOTMODE_LEGACY
```

Причина описана в коммите:

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

#### 15.1.2 Совместимость misc

misc.img обеспечивает обмен загрузочной информацией между U-Boot и Android; его основное содержимое — BCB (Bootloader Control Block). По историческим причинам RK в SDK Android &gt;=10.0 BCB должен находиться по смещению 0 раздела misc, а в версиях ниже Android 10.0 — по смещению 16 KB. В готовом SDK дополнительных действий не требуется: U-Boot адаптируется автоматически. Смешивание misc.img из разных SDK может привести к постоянному входу Android в recovery.

## 16 Инструменты

Пути инструментов этой главы относительно корня U-Boot:

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

Назначение: по INI упаковать bl30, bl31 и bl32 BIN 64-битной платформы в trust.img. Пример INI: RK3368TRUST.ini.

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

Команда упаковки:

```text
/*
 * @<sha>：可选。sha相关，参考make.sh
 * @<rsa>：可选。rsa相关，参考make.sh
 * @<size>：可选，格式：--size [KB] [count]。输出⽂件⼤⼩，省略时默认单份2M，打包2份
 * @[ini file]: 必选。ini⽂件
 */

./tools/trust_merger <sha> <rsa> <size> [ini file]
```

Пример:

```text
./tools/trust_merger --rsa 3 --sha 2 ./ RKTRUST/RK3399TRUST.ini
out:trust.img
merge success(trust.img)
```

Команда распаковки:

```text
// @[input image]: 必选。⽤于解包的固件，⼀般是trust.img

./tools/trust_merger --unpack [input image]
```

Пример:

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

Назначение: по INI упаковать miniloader, DDR и USB plug в прошивку Loader. Пример INI: RK3288MINIALL.ini.

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

Команда упаковки:

```text
// @[ini file]: 必选。ini⽂件

./tools/boot_merger [ini file]
```

Пример:

```text
./tools/boot_merger ./RKBOOT/RK3399MINIALL.ini
out:rk3399_loader_v1.17.115.bin
fix opt:rk3399_loader_v1.17.115.bin
merge success(rk3399_loader_v1.17.115.bin)
```

Команда распаковки:

```text
// @[input image]: 必选。⽤于解包的固件，⼀般是loader⽂件

./tools/boot_merger --unpack [input image]
```

Пример:

```text
./tools/boot_merger --unpack rk3399_loader_v1.17.115.bin
unpack entry(rk3399_ddr_800MHz_v1.17)
unpack entry(rk3399_usbplug_v1.15)
unpack entry(FlashData)
unpack entry(FlashBoot)
unpack success
```

### 16.3 loaderimage

Назначение: упаковка u-boot.bin в uboot.img и TEE BIN 32-битной платформы в trust.img. Упаковка U-Boot:

```text
/*
 * @[input bin]: 必选。bin源⽂件
 * @[output image]：必选。输出⽂件
 * @[load_addr]：必选。加载地址
 * @<size>：可选，格式：--size [KB] [count]。输出⽂件⼤⼩，省略时默认单份1M，打包4份
 */

./tools/loaderimage --pack --uboot [input bin] [output image] [load_addr] <size>
```

Пример:

```text
./tools/loaderimage --pack --uboot ./u-boot.bin uboot.img 0x60000000 --size 1024 2

 load addr is 0x60000000!
pack input u-boot.bin
pack file size: 701981
crc = 0xc595eb85
uboot version: U-Boot 2017.09-02593-gb6e59d9 (Feb 18 2019 - 13:58:53)
pack uboot.img success!
```

Распаковка U-Boot:

```text
/*
 * @[input image]: 必选。解包源⽂件
 * @[output bin]: 必选。解包输出⽂件，任意名字均可
 */

./tools/loaderimage --unpack --uboot [input image] [output bin]
```

Пример:

```text
./tools/loaderimage --unpack --uboot uboot.img uboot.bin
unpack input uboot.img
unpack uboot.bin success!
```

Упаковка trust:

```text
/*
 * @[input bin]: 必选。bin⽂件
 * @[output image]：必选。输出⽂件
 * @[load_addr]：必选。加载地址
 * @<size>：可选。格式：--size [KB] [count]，输出⽂件⼤⼩，省略时默认单份1M，打包4份
 */

./tools/loaderimage --pack --trustos [input bin] [output image] [load_addr] <size>
```

Пример:

```text
./tools/loaderimage --pack --trustos ./bin/rk32/rk322x_tee_v2.00.bin trust.img \
                       0x80000000  --size 1024 2

 load addr is 0x80000000!
pack input bin/rk32/rk322x_tee_v2.00.bin
pack file size: 333896
crc = 0x2de93b46
pack trust.img success!
```

Распаковка trust:

```text
/*
 * @[input image]: 必选。解包源⽂件
 * @[output bin]: 必选。解包输出⽂件，任意名均可
 */

./tools/loaderimage --unpack --trustos [input image] [output bin]
```

Пример:

```text
./tools/loaderimage --unpack --trustos trust.img tee.bin
unpack input trust.img
unpack tee.bin success!
```

### 16.4 resource_tool

Назначение: упаковка произвольных ресурсов в resource.img. Команда:

```text
./tools/resource_tool [--pack] [--image=<resource.img>] <file list>
```

Пример:

```text
./scripts/resource_tool ./arch/arm/boot/dts/rk3126-evb.dtb logo.bmp logo_kernel.bmp
Pack to resource.img successed!
```

Команда распаковки:

```text
./tools/resource_tool --unpack --image=<resource.img> [output dir]
```

Пример:

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

Назначение: создание Loader в режиме SPL. Следующая команда создаёт IDBLOCK для Rockchip BootROM, одновременно заменяя первые 4 байта u-boot-tpl.bin идентификатором, проверяемым BootROM:

```text
./tools/mkimage -n rk3328 -T rksd -d tpl/u-boot-tpl.bin idbloader.img
```

Подробности:

```text
./doc/mkimage.1
```

### 16.6 stacktrace.sh

Назначение: разбор стека вызовов. См. главу об архитектуре RK.

### 16.7 mkbootimg

Назначение: упаковка прошивки в boot и recovery.img; исходники взяты из Android. Пример:

```text
./scripts/mkbootimg --kernel zImage --second resource.img --ramdisk ramdisk.img --out
boot.img
```

### 16.8 unpack_bootimg

Назначение: распаковка boot и recovery.img; исходники взяты из Android. Пример:

```text
./scripts/unpack_bootimg --boot_img boot.img --out out/
```

### 16.9 repack-bootimg

Назначение: замена прошивки внутри boot и recovery.img. Пример:

```text
// 例如：只替换kernel
./scripts/repack-bootimg --boot_img boot.img --kernel zImage -o boot_repack.img

// 例如：只替换resource
./scripts/repack-bootimg --boot_img boot.img --second resource.img -o boot_repack.img
```

### 16.10 pack_resource.sh

Назначение: упаковка изображений зарядки из ./tools/images/ в resource.img. Пример:

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

Назначение: пакетная сборка, удобная для проверки влияния коммитов одной платформы на другие. Подробнее:

```text
./tools/buildman/README
```

Перед использованием buildman задайте путь toolchain в ~/.buildman:

```text
[toolchain]
arm: ~/prebuilts/gcc/linux-x86/arm/gcc-linaro-6.3.1-2017.05-x86_64_arm-linux-gnueabihf/
aarch64: ~/prebuilts/gcc/linux-x86/aarch64/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-
gnu/
```

Типичный пример: сборка U-Boot для всех платформ Rockchip.

```text
./tools/buildman/buildman rockchip
```

Ожидаемый результат без ошибок:

```text
$ ./tools/buildman/buildman rockchip
boards.cfg is up to date. Nothing to do.
Building current source for 34 boards (4 threads, 1 job per thread)
   34    0    0 /34     evb-rk3326
```

Первое число — платформы с полностью успешной сборкой (зелёное); второе — с предупреждениями (жёлтое); третье — с ошибками сборки (красное). Предупреждения и ошибки выводятся в терминале.

### 16.12 patman

Назначение: инструмент Python, вызывающий другие средства для проверки и отправки патчей, полезный для upstream U-Boot и Kernel. Основные функции: автоматическое форматирование патчей по параметрам; проверка через checkpatch;

извлечение из коммитов Cover-letter, версии патчей и изменений версий для upstream mailing list; автоматическое удаление change-id; определение адресатов каждого патча по Maintainer и истории файлов; отправка всех патчей по настройкам ~/.gitconfig или ./.gitconfig. Подробнее:

```text
./tools/patman/README
```

Все параметры команды доступны через -h:

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

Типичный пример: отправить 3 последних патча.

```text
patman -t -c3
```

При ошибке или предупреждении checkpatch выполнение автоматически прерывается; исправьте патч и повторите. Другие частые параметры: -t — часть заголовка до двоеточия считается TAG, который patman часто не распознаёт; используйте -t.

-i позволяет отправить патч несмотря на предупреждения, которые решено не исправлять, например строки длиннее 80 символов. -s пропускает N верхних патчей, если отправляемые не находятся на вершине текущего дерева. -n только проверяет последние патчи через checkpatch без отправки. Ключевые слова commit message позволяют patman (в исходнике здесь patchman) создать данные upstream mailing list. Типичный коммит:

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

При отправке этого патча через patman создаётся Cover-letter:

```text
[PATCH v4 00/11] rockchip: add tpl and OPTEE support for rk3229
```

Заголовок патча содержит версию и его порядковый номер в серии:

```text
[PATCH v4,07/11] spl: add support to booting with OP-TEE
```

Сообщение коммита обработано: change-id и Cover-letter удалены, version-changes преобразованы в информацию вне основного текста:

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

Другие ключевые слова, например Series-prefix и Series-cc, описаны в README.

## 17 Приложение

### 17.1 Адреса загрузки

#### 17.1.1 rkbin

Внутренние инженеры RK: войдите в Gerrit и найдите rk/rkbin. Внешние инженеры: загрузите полный SDK RK либо репозиторий GitHub https://github.com/rockchip-linux/rkbin.

#### 17.1.2 GCC

Внутренние инженеры RK: найдите gcc-linaro-6.3.1 в Gerrit. Внешние инженеры: загрузите полный SDK RK либо пакет с официального сайта Linaro.

### 17.2 Термины

U-Boot: Universal Boot Loader. AOSP: Android Open-Source Project. AVB: Android Verified Boot. DTB: Device Tree Binary. DTS: Device Tree Source. Fastboot: изначально способ обновления Android, теперь широко используемый во встраиваемых системах. GPT: GUID Partition Table. MMC: Multi Media Card, включая eMMC, SD и др. SPL: Secondary Program Loader. TPL: Tertiary Program Loader. DTB: blob дерева устройств. DTB: blob дерева устройств для наложения (повторное обозначение сохранено из оригинала). DTC: компилятор дерева устройств. DTO: операция наложения дерева устройств. DTS: исходный файл дерева устройств. FDT: плоское дерево устройств.

SCMI: System Control and Management Interfacee (написание исходника).

{% endraw %}
