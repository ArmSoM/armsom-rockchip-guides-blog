---
title: "Rockchip Linux Flash: полное руководство по открытому решению"
description: "Rockchip Linux Flash: полное руководство по открытому решению — NAND, NOR, MTD, UBIFS, JFFS2, OTA; V3.18.0."
translation_key: "103-rockchip-flash-open-source"
slug: "103-rockchip-flash-open-source"
lang: "ru"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: [ArmSoM, Rockchip, Flash, NAND, NOR, UBIFS, MTD]
excerpt: "Rockchip Linux Flash: полное руководство по открытому решению — NAND, NOR, MTD, UBIFS, JFFS2, OTA; V3.18.0."
---

{% raw %}

Основа — китайский технический текст RK-KF-YF-314 V3.18.0, сверенный с английским оригиналом той же версии. Область: SoC с FSPI (ранее SFC), Linux 4.4, 4.19, 5.10 и 6.1. Описание закрытых ранних SDK 4.4 и перехода на открытые реализации — исторические сведения поставщика, а не гарантия для любого BSP ArmSoM. Это справочник платформы: проверьте тип Flash, подключение, Loader, SDK/BSP и драйвер ядра конкретной платы. Проверка на аппаратуре ArmSoM не проводилась. Использованы оригинальные английские рисунки.

> Различия оригиналов: по согласованию принят китайский текст. В §5.3.1 NAND off\|partition измеряется в байтах (выравнивание по странице, без OOB), count — шестнадцатеричное число страниц; английский оригинал указывает соответственно page и byte. До выполнения проверьте реализацию команды в используемом U-Boot. Для ENV SPI NAND IDB китайский текст задаёт блоки 1–3, английский — 1–7; сохранён китайский вариант, требующий проверки Loader. Формула 5456KB + 4KB *256 =6456KB противоречива; 512B/s как единица сектора и SPI NAND в абзаце SPI NOR также требуют проверки. Стирание, запись и переразметка могут безвозвратно уничтожить данные; команды не выполнялись.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel)

<!-- Chinese baseline PDF p.7 -->

## 1 Примечания к открытому решению

### 1.1 Возможности решения

Проверьте следующие характеристики открытых реализаций:

| Решение | Основные типы flash | Регистрируемые устройства | Основные файловые системы | Способы программирования |
| --- | --- | --- | --- | --- |
| Открытое решение SLC NAND (параллельная NAND) | SLC Nand | Устройства mtd, ubiblock | SquashFS、UBIFS | Обновление через USB, SD-карту и программатор |
| Открытое решение SPI NAND | SPI Nand | Устройства mtd, ubiblock | SquashFS、UBIFS | Обновление через USB, SD-карту и программатор |
| Открытое решение SPI NOR | SPI Nor | Устройства mtd, mtdblock | SquashFS、JFFS2 | Обновление через USB, SD-карту и программатор |

Основные проверки: выбранный тип flash и соответствие файловой системы требованиям.

### 1.2 Выбор NAND Flash

Образы UBIFS зависят от характеристик NAND и несовместимы с устройствами с другими размерами страницы или блока. Характеристики выбранных NAND-компонентов должны совпадать. SLC NAND здесь означает параллельную NAND.

### 1.3 Расширение разделов по моделям SoC

Как описано в разделе настройки разделов, RK SDK добавляет специальные расширения MTD. Проверьте поддержку конкретным чипом:

<!-- Chinese baseline PDF p.8 -->

| Чип | Расширение разделов GPT | Расширение разделов ENV |
| --- | --- | --- |
| RK3308 | Y | N |
| RV1126 & RV1109 | Y | N |
| RK3568 & RK3566 | Y | N |
| RK3588 & RK3588s | Y (по умолчанию) | Y (опционально) |
| RV1106/RV1103 | N | Y |
| RK3528 | Y | N |
| RK3562 | Y | N |
| RK3576 | Y | N |
| RV1106B/RV1103B | N | Y |
| RK3506 | Y | N |

### 1.4 Основные возможности FSPI/SFC

Перечислены только SoC с открытой реализацией хранения:

| SOC | FSPI/SFC IO rate | FSPI/SFCdata io lines | Поддержка ROM ContRead |
| --- | --- | --- | --- |
| RK3308 | <= 48MHz (рекомендуется) | x1\x4 | N |
| RV1126 & RV1109 | <= 125MHz | x1\x4 | N |
| RK3568/RK3566 | <= 150MHz, фиксированные частоты OSC\50\75\100\125\150 MHz | x1\x4 | N |
| RK3588/RK3588s | <= 150MHz | x1\x4 | N |
| RV1106/RV1103 | <= 150MHz; поддерживаются 125MHz и 150MHz, но не промежуточные частоты из-за ограничений делителя | x1\x4 | N |
| RK3528 | <= 150MHz | x1\x4 | N |
| RK3562 | <= 150MHz | x1\x4 | N |
| RK3576 | <= 133MHz; из-за делителя максимум 125MHz | x1\x4 | Y |
| RV1106B/RV1103B | FSPI0 <= 133MHz,FSPI1 <= 125MHz | x1\x4 | Y |
| RK3506 | <= 133MHz | x1\x4 | Y |

Примечания:

<!-- Chinese baseline PDF p.9 -->

IP поддерживает x4 и совместим с x2, но открытая подсистема не поддерживает dual SPI. Хотя IP допускает высокие частоты, SDK обычно задаёт более низкую; рекомендуется 80MHz с настройкой под проект и компонент. Quad SPI NAND обычно до 133MHz, Quad SPI NOR обычно до 133MHz, отдельные модели до 166MHz. Octal SPI Flash обычно до 200MHz. Вблизи предела измеряйте фактическую частоту для выявления разгона и при необходимости снижайте её; обычно достаточно сопоставить спецификацию со средней частотой по осциллографу.

### 1.5 Расширение разделов и размещение IDB

#### 1.5.1 Схемы расширения разделов

| Чип | Расширение разделов GPT | Расширение разделов ENV |
| --- | --- | --- |
| RK3308 | Схема по умолчанию (совместимая схема 1) | N |
| RV1126/RV1109 | Схема по умолчанию (совместимая схема 2) | N |
| RK3568/RK3566 | Схема по умолчанию | N |
| RK3588/RK3588s | Схема по умолчанию | N |
| RV1106/RV1103 | N | Схема по умолчанию |
| RK3528 | Схема по умолчанию | N |
| RK3562 | Схема по умолчанию | N |
| RK3576 | Схема по умолчанию | N |
| RV1106B/RV1103B | N | Схема по умолчанию |
| RK3506 | Схема по умолчанию | N |

Изменения схем совместимости см. в планировании IDB для GPT.

#### 1.5.2 Размещение IDB при расширении ENV

| Тип накопителя | Начальный адрес idb | Требования к копиям |
| --- | --- | --- |
| SLC Nand | 256KB | Требуются две копии образа |
| SPI Nand | 256KB | Требуются несколько копий образа |
| SPI Nor | 64KB | Требуются две копии образа |

<!-- Chinese baseline PDF p.10 -->

#### 1.5.3 Размещение IDB при расширении GPT

| Тип накопителя | Начальный адрес idb | Требования к копиям |
| --- | --- | --- |
| SLC Nand | Размер блока flash (128KB или 256KB) | Инструмент должен поддерживать две копии; размер выровнен по блоку flash |
| SPI Nand | Размер блока flash (128KB или 256KB) | Инструмент должен поддерживать две копии; размер выровнен по блоку flash |
| SPI Nor | 64KB | Инструмент должен поддерживать две копии; выравнивание размера 64KB |

Инструменты ПК поддерживают запись двух копий IDB. Схема совместимости 1: RK3308 SPI NOR IDB допускает одну копию; блоки SPI NAND 1–8 содержат область резервных IDB, до пяти копий. Схема 2: RV1126/RV1109 SPI NOR IDB начинается с 32KB и допускает одну копию.

## 2 Настройка драйверов хранения

### 2.1 Базовая настройка SPL и U-Boot

Настройки defconfig:

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

Удалите настройки макросов rkflash/rknand:

```text
CONFIG_RKFLASH=n
CONFIG_RKNAND=n
```

Файлы драйвера:

```text
./drivers/mtd/nand/raw          //SLC Nand 主控驱动及协议层
./drivers/mtd/nand/spi          //SPI Nand 协议层
./drivers/spi/rockchip_sfc.c    //SPI Flash 主控驱动
./drivers/mtd/spi               //SPI Nor 协议层
```

Для SPI NOR см. drivers/mtd/spi/spi-nor-ids.c; оригинал называет поддерживаемые устройства здесь SPI NAND, что сохраняется как терминологическое противоречие для проверки. Для Winbound SPI NAND см. drivers/mtd/nand/spi/winbond.c; другие компоненты находятся в том же каталоге. Сопоставляйте по flash ID либо маркировке.

### 2.2 Базовая настройка ядра

#### 2.2.1 SLC NAND

Обзор подсистемы:

| Решение | Основные типы flash | Драйвер контроллера | Подсистема flash |
| --- | --- | --- | --- |
| Открытое решение SLC NAND | SLC Nand | drivers/mtd/nand/raw | drivers/mtd/nand/raw |

Настройки defconfig:

<!-- Chinese baseline PDF p.12 -->

```text
CONFIG_RK_NANDC_NAND=n   /* 不兼容 */
CONFIG_MTD_NAND_ROCKCHIP_V6=y /* NandC v6 可根据 TRM NANDC->NANDC_NANDC_VER 寄存器确认，
0x00000801 */
# CONFIG_MTD_NAND_ROCKCHIP_V9=y /* NandC v9 可根据 TRM NANDC->NANDC_NANDC_VER 寄存器确认，
0x56393030 */
CONFIG_MTD_CMDLINE_PARTS=y
```

#### 2.2.2 SPI NOR/NAND

##### 2.2.2.1 Linux 4.19 и более ранние

Обзор подсистемы:

| Решение | Основные типы flash | Драйвер контроллера | Подсистема flash |
| --- | --- | --- | --- |
| Открытое решение SPI NAND | SPI Nand | drivers/rkflash | drivers/rkflash |
| Открытое решение SPI NOR | SPI Nor | drivers/rkflash | drivers/rkflash |

Настройки defconfig:

```text
CONFIG_RK_FLASH=y

CONFIG_RK_SFC_NAND=y     /* SPI Nand flash */
CONFIG_RK_SFC_NAND_MTD=y /* SPI Nand flash 及其分区注册为 mtd 设备，不选中则注册为普通 block 设备
（rkflash0pn） */
CONFIG_RK_SFC_NOR=y      /* SPI Nor flash */
CONFIG_RK_SFC_NOR_MTD=y  /* SPI Nor flash 及其分区注册为 mtd 设备，不选中则注册为普通 block 设备
（rkflash0pn） */
CONFIG_MTD_CMDLINE_PARTS=y
```

Настройки DTS:

```text
&sfc {
    assigned-clocks = <&cru SCLK_SFC>; # 选择 dtsi sfc 设备节点中的 clk_sfc 对应时钟源修改 IO 速率
    assigned-clock-rates = <100000000>;
    status = "okay";
};
```

##### 2.2.2.2 Linux 5.10 и новее

Обзор подсистемы:

<!-- Chinese baseline PDF p.13 -->

| Решение | Основные типы flash | Драйвер контроллера | Подсистема flash |
| --- | --- | --- | --- |
| Открытое решение SPI NAND | SPI Nand | drivers/spi/spi-rockchip-sfc.c | drivers/mtd/nand/spi |
| Открытое решение SPI NOR | SPI Nor | drivers/spi/spi-rockchip-sfc.c | drivers/mtd/spi-nor |

Поддерживаемые Winbound SPI NOR перечислены в drivers/mtd/spi-nor/winbond.c; другие производители — в том же каталоге. Для Winbound SPI NAND используйте drivers/mtd/nand/spi/winbond.c и соседние файлы. Сопоставляйте flash ID или маркировку. ПО определяет компонент по flash ID. Если исходная конфигурация компонента и bus-width узла контроллера DTS задают quad/octal, драйвер выбирает quad/octal. Настройки defconfig:

```text
CONFIG_SPI_ROCKCHIP_SFC=y
CONFIG_MTD_SPI_NAND=y
CONFIG_MTD_SPI_NOR=y
```

Настройки DTS:

```text
&fspi { # 旧平台节点命名为 sfc
    sfc-cs-gpios = <&gpio4 RK_PB0 GPIO_ACTIVE_LOW>, <&gpio4 RK_PA5 GPIO_ACTIVE_LOW>; # 扩展 gpio 为 CSN
    status = "okay";

    flash@0 {
        compatible = "spi-nand";    # compatible = "jedec,spi-nor"; for spinor
        reg = <0>;
        spi-max-frequency = <75000000>; # 修改 IO 速率
        spi-rx-bus-width = <4>;         # 阅读 "芯⽚ FSPI/SFC 关键特性" 确认⽀持的线宽
        spi-tx-bus-width = <1>;         # 阅读 "芯⽚ FSPI/SFC 关键特性" 确认⽀持的线宽，x4 软件⾃动降级为兼容性更好的 x1 传输
    };
};
```

### 2.3 Настройка разделов

#### 2.3.1 Основы разделов MTD

Открытая реализация flash регистрирует MTD-устройства и разбирает только стандартную таблицу mtd partition. Обычно mtdparts задаётся в cmdline DTS ядра.

<!-- Chinese baseline PDF p.14 -->

#### 2.3.2 Расширение разделов GPT

Некоторые RK SDK разбирают GPT в U-Boot, формируют MTD mtdparts и передают ядру через cmdline. Проверьте поддержку чипом в разделе расширений. Преобразование реализовано в u-boot/drivers/mtd_blk.c. GPT задаётся файлом parameter, аналогично MTD Partition, с четырьмя отличиями:

1. Установите TYPE в GPT.

2. Не определяйте раздел parameter; если задан, он не используется.

3. Добавьте grow к последнему разделу.

4. MTD не требует UUID rootfs.

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
CMDLINE:mtdparts=rk29xxnand:0x00002000@0x00004000 (uboot),0x00002000@0x00006000(trust),0x00002000@0x00008000 (misc),0x00008000@0x0000a000 (resource),0x00010000@0x00012000(kernel),0x00010000@0x00022000 (boot),0x00020000@0x00032000 (recovery),0x00038000@0x00052000(backup),0x00002000@0x0008a000 (security),0x000c0000@0x0008c000(cache),0x00300000@0x0014c000 (system),0x00008000@0x0044c000(metadata),0x000c0000@0x00454000 (vendor),0x00040000@0x00514000 (oem),0x00000400@0x00554000(frp),-@0x00554400 (userdata:grow)
```

Порядок обновления GPT:

1. Прочитать определения разделов из parameter.

2. Получить ёмкость накопителя от Loader.

3. Изменить размер последнего раздела и создать GPT.

4. Записать таблицу по адресам 0 и -33 (конец).

5. Сам файл parameter на накопитель не записывается.

#### 2.3.3 Расширение разделов ENV

Некоторые RK SDK поддерживают ENV со стандартными переменными U-Boot, передаваемыми ядру через cmdline. Поддержку чипа см. в расширениях разделов. Образ ENV создаётся ./tools/mkenvimage из U-Boot с собственным файлом, например env.txt:

<!-- Chinese baseline PDF p.15 -->

```text
mtdparts=spi-nand0:256K(env),256K@256K(idblock),4M(uboot),8M(boot),72M(rootfs),32M(userdata),-(media)
sys_bootargs=ubi.mtd=4 root=ubi0:rootfs rootfstype=ubifs
```

Пример SPI NAND: ./tools/mkenvimage -s 0x40000 -p 0x0 -o env.img env_.txt. Пример SPI NOR: ./tools/mkenvimage -s 0x10000 -p 0x0 -o env.img env.txt. sys_bootargs задавайте по реальному SDK и руководству разработки.

#### 2.3.4 Планирование разделов NAND

В каждом разделе SLC/SPI NAND оставляйте 3–4 блока для замены плохих, особенно в U-Boot. Свыше 10MB увеличьте резерв: 4 + число блоков раздела * 1%; при блоке 128KB и oem 16MB (128 блоков) можно взять 5. Начала разделов выравнивайте по блоку. Последние четыре блока резервируются глобально под таблицу плохих блоков и не должны входить в последний пользовательский раздел. Иначе четыре блока помечаются плохими и полезная ёмкость уменьшается на четыре блока. Малый образ может работать, но такое включение не рекомендуется.

### 2.4 Vendor Storage

Vendor Storage хранит небольшие незащищённые данные SN/MAC. Задайте vnvm после IDB и до uboot, желательно четыре блока: SPI NOR 256KB, SPI NAND 1MB (совместимо с 128KB/256KB). parameter.txt: NOR 0x00000200@0x00000800(vnvm), NAND 0x00000800@0x00001800(vnvm). env.txt: NOR 256K@1M(vnvm), NAND 1M@3M(vnvm). U-Boot: CONFIG_MTD_BLK = y, реализация arch/arm/mach-rockchip/vendor.c, интерфейс ./arch/arm/include/asm/arch-rockchip/vendor.h. Ядро: CONFIG_ROCKCHIP_MTD_VENDOR_STORAGE=y, drivers/soc/rockchip/mtd_vendor_storage.c и ./include/linux/soc/rockchip/rk_vendor_storage.h.

<!-- Chinese baseline PDF p.16 -->

Поддерживаются инструменты ПК, производства и интерфейсы пользовательского слоя ядра; см. Rockchip_Application_Notes_Storage_CN.pdf.

## 3 Специализированные решения

### 3.1 Thunder Boot с SPI NAND Continuous Read Mode

Некоторые семейства SPI NAND поддерживают continuous read без ограничения страницей, что для отдельных задач повышает ожидаемую скорость с 20MB/s примерно до 50MB/s. RK интегрирует это в Thunder Boot: ROM читает непрерывно на поддерживаемых SoC (см. Rom ContRead в свойствах FSPI/SFC); SPL также использует этот режим. usbplug заменяет плохие блоки при записи, поэтому ramdisk быстро читается и распаковывается без проверки результатов ECC. Остальные этапы используют Buffer Read: мелкие обращения ФС не выигрывают от непрерывного чтения. Стоимость выше. В конце flash резервируется bbm_reserved для переназначения блоков. 1Gbit: [0000,999] user/scan; [1000,1019] user/replay/bbm_reserved; [1020,1023] reserved/RK bbt. 2Gbit: [0000,2003] user/scan; [2004,2043] user/replay/bbm_reserved; [2044,2047] reserved/RK bbt. 4Gbit: [0000,4011] user/scan; [4012,4091] user/replay/bbm_reserved; [4092,4095] reserved/RK bbt. Требуется предварительное переназначение всего устройства, поэтому предварительная запись программатором не поддерживается. Для поддерживаемых ROM выберите конфигурацию упаковки Loader rkbin с суффиксом _CONT_TB.ini.

<!-- Chinese baseline PDF p.17 -->

В SPL/U-Boot включите CONFIG_SPI_NAND_CONT_READ; в ядре — узел rockchip,thunder-boot-sfc и CONFIG_ROCKCHIP_THUNDER_BOOT_SFC.

### 3.2 Программное решение SPI NOR AUTO_MERGE

#### 3.2.1 Введение

RK SDK поддерживает дополнительную SPI NOR через cs-gpio, но устройства независимы: ПК записывает только CS0, SPL/U-Boot/Linux управляют CS0/CS1 отдельно. AUTO_MERGE объединяет два чипа в одно виртуальное устройство удвоенной ёмкости для всех этих слоёв. Модели обоих чипов должны совпадать. Один чип также работает, но CS1N GPIO выдаёт сигналы опроса при загрузке. При быстром старте preload, например ramdisk, не должен пересекать устройства. Открытый usbplug_auto_merge собирается из U-Boot и поддерживает только USB; для UART нужен пересобранный закрытый usbplug.bin под CS1 GPIO. Проверьте патч U-Boot:

```text
spi: rockchip_sfc: Support auto_merge

Change-Id: I4416b004d315f2f5689312b1eb53e36fce7f6bbf
Signed-off-by: Jon Lin <jon.lin@rock-chips.com>
```

Проверьте патч ядра:

```text
spi: rockchip-sfc: Support sfc-cs-gpio

Change-Id: I24bfbf39ed7bea0596f299d3413159c7e2038ba8
Signed-off-by: Jon Lin <jon.lin@rock-chips.com>
```

<!-- Chinese baseline PDF p.18 -->

#### 3.2.2 Базовая настройка

Полный пример rv1103b: настройки DTS U-Boot.

```text
&gpio1 {
+   u-boot,dm-spl;
    status = "okay";
};

&gpio2 {
+   u-boot,dm-spl;
    status = "okay";
};

&sfc {
+   sfc-cs-gpios= <&gpio1 RK_PA5 GPIO_ACTIVE_LOW>, <&gpio2 RK_PA6 GPIO_ACTIVE_LOW>;
    u-boot,dm-spl;
    status = "okay";

@@ -104,6 +105,7 @@
        spi-tx-bus-width = <1>;
        spi-rx-bus-width = <4>;
        spi-max-frequency = <80000000>;
+       status = "disabled";
    };
```

Настройки CS0/CS1 GPIO IOMUX U-Boot.

```text
diff --git a/arch/arm/mach-rockchip/rv1103b/rv1103b.c b/arch/arm/mach-rockchip/rv1103b/rv1103b.c
index 7353528afdd..8e30240076e 100644
--- a/arch/arm/mach-rockchip/rv1103b/rv1103b.c
+++ b/arch/arm/mach-rockchip/rv1103b/rv1103b.c
@@ -252,9 +252,9 @@ int arch_cpu_init(void)
        writel(0x00000000, USBPHY_APB_BASE + USBPHY_FSLS_DIFF_RECEIVER);

+#ifdef CONFIG_SPI_FLASH_AUTO_MERGE
+       /* gpio1a5/gpio2a6 cs-gpio */
+       writel(0x00F00000, GPIO1_IOC_BASE + GPIO1A_IOMUX_SEL_1_0);
+       writel(0x0F000000, GPIO2_IOC_BASE + GPIO2A_IOMUX_SEL_1_1);
+#endif
 #endif
```

Настройки defconfig U-Boot.

```text
CONFIG_SPI_FLASH_AUTO_MERGE=y
CONFIG_SPL_GPIO_SUPPORT=y
```

Настройки DTS ядра.

<!-- Chinese baseline PDF p.19 -->

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

Настройки defconfig ядра.

```text
CONFIG_MTD_SPI_NOR_AUTO_MERGE=y
```

#### 3.2.3 Обновление USBPLUG

usbplug.bin — прошивка загрузочной записи Rockchip. Для auto_merge используйте рекомендуемый CS1 GPIO и стандартный usbplug_auto_merge в исходниках U-Boot:

```text
./make.sh rv1103b-usbplug
cp u-boot.bin ./../rkbin/bin/rv11/rv1103b_usbplug_*.bin
./make.sh loader
```

Стандартные CS1 GPIO для некоторых usbplug_auto_merge:

| Чип | CS1 GPIO |
| --- | --- |
| RV1103B | GPIO2_A6 |

<!-- Chinese baseline PDF p.20 -->

#### 3.2.4 Функциональная проверка

Проверяйте нагрузкой flash_stresstest из rockchip_test: создайте userdata 20MB с JFFS2, пересекающий устройства SPI NOR.

## 4 Запись инструментами ПК

### 4.1 Запись с ПК: расширение GPT

Нужны AndroidTools V2.7.8+ и upgrade_tools V1.5.6+. ПК записывает копии IDB в блоки NAND 1–7: GPT и IDB занимают первые 1MB при странице 2KB либо 2MB при 4KB. Для NOR создаются две копии IDB: первая с 64KB, вторая сразу за ней с выравниванием размера на 64KB. После изменения GPT обновляйте в Maskrom, иначе возможны ошибки монтирования UBIFS. Инструмент распознаёт UBIFS, стирает целевой раздел и записывает образ (английский оригинал дополняет оборванную китайскую фразу).

### 4.2 Запись с ПК: расширение ENV

Используйте SocToolKit для Windows/Linux и соответствующий производственный инструмент.

## 5 OTA

### 5.1 Примечания к OTA

Перед онлайн-обновлением размонтируйте UBIFS целевого раздела. Для MTD с таблицей parameter добавьте разделы gpt/idb в parameter.txt, если требуется обновлять GPT и IDB:

<!-- Chinese baseline PDF p.21 -->

NAND с блоком 128KB: 0x00000100@0x00000000(gpt),0x00000700@0x00000100(idb). Блок 256KB: 0x00000200@0x00000000(gpt),0x00000e00@0x00000200(idb). SPI NOR: 0x00000080@0x00000000(gpt),0x00000780@0x00000080(idb).

### 5.2 Источники образов

OTA поддерживает только предварительно созданные образы; см. создание образов в главе о программаторе.

### 5.3 Обновление разделов MTD из командной строки

Для UBIFS в MTD используйте главу обновления UBIFS командами shell. Здесь речь о разделах прошивки только для чтения без ФС: IDB, U-Boot, kernel.

#### 5.3.1 SLC NAND в U-Boot

nand info:

```text
nand info
```

nand erase:

```text
nand erase off size
```

off и size: выровнены по блоку, байты, только hex, без OOB. Для 128KB данных + 8KB OOB используйте 128KB. nand write:

```text
nand write.raw[.noverify] - addr off|partition [count]
```

addr: hex-адрес памяти. off\|partition: выравнивание по странице, байты, hex, без OOB (128KB + 8KB OOB считается 128KB). count: страницы, hex; OOB учитывается в размере образа: при 0x800 данных + 0x80 OOB count = file_size / 0x880. Проверка чтением после записи включена по умолчанию. nand read:

```text
nand read.raw - addr off|partition [count]
```

<!-- Chinese baseline PDF p.22 -->

addr: hex-адрес памяти. off\|partition: выравнивание по странице, байты, hex, без OOB (128KB + 8KB OOB считается 128KB). count: страницы, hex; OOB учитывается в размере образа: при 0x800 данных + 0x80 OOB count = file_size / 0x880. Рекомендуемый порядок обновления раздела:

```text
tftp 0x4000000 rootfs.img
nand erase 0x600000 0x200000                        /* 升级分区时先擦除整个分区 */
nand write.raw 0x4000000 0x600000 0x1000
```

#### 5.3.2 SLC NAND в ядре

flash_erase:

```text
flash_erase       /* 例如: flash_erase /dev/mtd1 0 0 */
```

nanddump:

```text
nanddump -o -n --bb=skipbad /dev/mtd3 -f /userdata/boot_read.img
```

--bb=skipbad: пропустить плохие блоки; -o: читать OOB; -n: читать без ECC. nandwrite:

```text
nandwrite -o -n -p /dev/mtd3 /rockchip_test/rockchip_test.sh
```

-o: входной файл содержит OOB; -n: запись без ECC. Рекомендуемый порядок обновления раздела:

```text
flash_erase /dev/mtd4 0 0                       /* 升级分区时先擦除整个分区 */
nandwrite -o -n -p /dev/mtd4 /userdata/boot.img
sync
nanddump -o -n --bb=skipbad /dev/mtd4 -f /userdata/boot_read.img -l 0xXXXX
md5sum /userdata/boot_read.img ...              /* 建议添加校验 */
```

<!-- Chinese baseline PDF p.23 -->

#### 5.3.3 SPI NAND в U-Boot

SPI NAND не поддерживает команды nand; используйте cmd/mtd.c с пропуском плохих блоков. mtd erase:

```text
mtd erase <name> <off> <size>
```

name: spi-nand0 для SPI NAND MTD. off и size: выравнивание по блоку, байты, только шестнадцатеричные значения. mtd write:

```text
mtd write <name> <addr> <off> <size>
```

name: spi-nand0. addr: адрес памяти, только hex. off и size: выровнены по странице, байты, только hex. mtd read:

```text
mtd read <name> <addr> <off> <size>
```

name: spi-nand0. addr: адрес памяти, только hex. off и size: выровнены по странице, байты, только hex. Рекомендуемый порядок обновления:

```text
tftp 0x4000000 rootfs.img
mtd erase spi-nand0 0x600000 0x200000                       /* 升级分区时先擦除整个分区 */
mtd write spi-nand0 0x4000000 0x600000 0x200000
```

#### 5.3.4 SPI NAND в ядре

flash_erase:

```text
flash_erase       /* 例如: flash_erase /dev/mtd1 0 0 */
```

nanddump:

```text
nanddump --bb=skipbad /dev/mtd3 -f /userdata/boot_read.img
```

<!-- Chinese baseline PDF p.24 -->

--bb=skipbad: пропустить плохие блоки. nandwrite:

```text
nandwrite -p /dev/mtd3 /rockchip_test/rockchip_test.sh
```

Рекомендуемый порядок обновления раздела:

```text
flash_erase /dev/mtd4 0 0                       /* 升级分区时先擦除整个分区 */
nandwrite -p /dev/mtd4 /userdata/boot.img
sync
nanddump --bb=skipbad /dev/mtd3 /userdata/boot_read.img -l 0xXXXX
md5sum /userdata/boot_read.img ...              /* 建议添加校验 */
```

#### 5.3.5 SPI NOR в U-Boot

Рекомендуется интерфейс MTD; альтернатива — cmd/sf.c. mtd erase:

```text
mtd erase <name> <off> <size>
```

name: nor0 для SPI NOR MTD. off и size: выравнивание по сектору (4KB), байты, только hex. mtd write:

```text
mtd write <name> <addr> <off> <size>
```

name: nor0. addr: адрес памяти, только hex. off и size: минимальное выравнивание в байт, единица байт, только hex. mtd read:

```text
mtd read <name> <addr> <off> <size>
```

name: nor0. addr: адрес памяти, только hex. off и size: минимальное выравнивание в байт, единица байт, только hex. Рекомендуемый порядок обновления раздела:

<!-- Chinese baseline PDF p.25 -->

```text
tftp 0x4000000 rootfs.img
mtd erase nor0 0x600000 0x200000                        /* 升级分区时先擦除整个分区 */
mtd write nor0 0x4000000 0x600000 0x200000
```

#### 5.3.6 SPI NOR в ядре

Используйте интерфейс mtd_debug.

### 5.4 Обновление разделов образов UBIFS из командной строки

См. Файловая система UBIFS → UBIFS OTA.

### 5.5 Обновление разделов MTD через функции API

Для MTD с UBIFS используйте главу shell-обновления UBIFS; сырые операции относятся к разделам IDB/U-Boot/kernel без ФС и только для чтения. U-Boot: используйте интерфейсы чтения/записи/стирания с учётом плохих блоков в drivers/mtd/nand/raw/nand_util.c. Для малых полных записей (рекомендуется менее 2KB за включение) возможны RK MTD-to-block в drivers/mtd/mtd_blk.c. Каждая запись стирает соответствующий блок независимо от объёма, поэтому частые мелкие записи сокращают ресурс. Ядро: примеры mtd-utils ./miscutils/nandwrite.c и ./miscutils/flash_eraseall.c, интерфейсы с учётом плохих блоков. Пользовательский слой: те же примеры и ioctl MTD из include/uapi/mtd/mtd-abi.h. Возвраты чтения: 0 — данные верны/ECC OK; -EUCLEAN — данные верны, ECC достиг предела, стоит обновить чтением/стиранием/перезаписью; -EBADMSG — ошибка данных/ECC; -EIO и прочие — неверные данные, ошибка контроллера или обработки. Далее пример проверки результата:

<!-- Chinese baseline PDF p.26 -->

```text
ret = mtd_read(mtd, from, len, &retlen, data);
if (ret < 0 && ret != -EUCLEAN) {
    return ret;
}
```

## 6 Файловые системы

### 6.1 Файловая система UBIFS

#### 6.1.1 Введение

UBIFS означает Unsorted Block Image File System, обычно применяется на raw NAND как преемник JFFS2. Оригинал говорит о взаимодействии с MTD через подсистему UBIFS.

#### 6.1.2 Настройка

Поддержка ядра:

```text
CONFIG_MTD_UBI=y
CONFIG_UBIFS_FS=y
CONFIG_UBIFS_FS_ADVANCED_COMPR=y
CONFIG_UBIFS_FS_LZO=y /* 建议选⽤ lzo 压缩 */
```

#### 6.1.3 Создание и монтирование образа

##### 6.1.3.1 Предварительное создание образа

Подробное описание команды:

```text
Usage: mkfs.ubifs [OPTIONS] target
Make a UBIFS file system image from an existing directory tree
Examples:
Build file system from directory /opt/img, writting the result in the ubifs.img file
        mkfs.ubifs -m 512 -e 128KiB -c 100 -r /opt/img ubifs.img
The same, but writting directly to an UBIFS volume
        mkfs.ubifs -r /opt/img/dev/ubi0_0
Creating an empty UBIFS filesystem on an UBIFS volume
        mkfs.ubifs/dev/ubi0_0
Options:
-r, -d, --root=DIR         build file system from directory DIR, 待制作的⽂件系统⽬录
-m, --min-io-size=SIZE     minimum I/O unit size，最⼩输⼊输出⼤⼩, NAND FLASH 的最⼩读写单元，⼀
般为 page size，有 4096 或 2048
-e, --leb-size=SIZE        logical erase block size 逻辑可擦出块⼤⼩，为 block size-2x (page
size)，如 block_size 256KB page_size 2KB 应设置 -e 258048，如 block_size 128KB page_size 2KB 应
设置 -e 126976
-c, --max-leb-cnt=COUNT    maximum logical erase block count 最⼤逻辑可擦出块数⽬，autoresize 时
⽂件系统的的上限
-o, --output=FILE          output to FILE 输出⽂件名
-j, --jrn-size=SIZE        journal size
-R, --reserved=SIZE        how much space should be reserved for the super-user
-x, --compr=TYPE           compression type - "lzo", "favor_lzo", "zlib" or "none" (default:
"lzo")
-X, --favor-percent        may only be used with favor LZO compression and defines how many
percent better zlib should compress to make mkfs.ubifs use zlib instead of LZO (default 20%)
-f, --fanout=NUM           fanout NUM (default: 8)
-F, --space-fixup          file-system free space has to be fixed up on first mount(requires
kernel version 3.0 or greater),如果是通过 u-boot 烧写需要使能此功能。
-k, --keyhash=TYPE         key hash type - "r5" or "test" (default: "r5")
-p, --orph-lebs=COUNT      count of erase blocks for orphans (default: 1)
-D, --devtable=FILE        use device table FILE
-U, --SquashFS-uids        SquashFS owners making all files owned by root
-l, --log-lebs=COUNT       count of erase blocks for the log (used only for debugging)
-v, --verbose              verbose operation
-V, --version              display version information
-g, --debug=LEVEL          display debug information (0 - none, 1 - statistics, 2 - files, 3
- more details)
-h, --help                 display this help text
```

Порядок:

1. Создайте образ UBIFS; обычно достаточно следующих параметров.

```text
mkfs.ubifs -F -d rootfs_dir -e real_value -c real_value -m real_value -v -o rootfs.ubifs
```

2. Преобразуйте в формат записи flash.

```text
ubinize -o ubi.img -m 2048 -p 128KiB ubinize.cfg
```

-p: размер блока. -m: минимальная единица чтения/записи NAND, обычно страница. -o: выходной ubi.img. Настройки ubinize.cfg:

```text
[ubifs-volumn]
mode=ubi
image=rootfs.ubifs
vol_id=0
vol_type=dynamic
vol_alignment=1
vol_name=ubifs
vol_flags=autoresize
```

<!-- Chinese baseline PDF p.28 -->

mode=ubi обязателен; прочие значения зарезервированы. image=out/rootfs.ubifs — входной файл. vol_id=0 различает тома многотомного UBI. vol_type=dynamic — чтение/запись, static — только чтение. vol_name=ubifs — имя. vol_flags=autosize допускает расширение. Пример: страница 2KB, 64 страницы/блок, блок 128KB, раздел 64MB:

```text
mkfs.ubifs -F -d /path-to-it/buildroot/output/rockchip_rv1126_rv1109_spi_nand/target -e 0x1f000 -c 0x200 -m 0x800 -v -o rootfs.ubifs
ubinize -o ubi.img -m 2048 -p 128KiB ubinize.cfg
```

Страница 2KB, 128 страниц/блок, блок 256KB, раздел 64MB:

```text
mkfs.ubifs -F -d /path-to-it/buildroot/output/rockchip_rv1126_rv1109_spi_nand/target -e 0x3f000 -c 0x100 -m 0x800 -v -o rootfs.ubifs
ubinize -o ubi.img -m 2048 -p 256KiB ubinize.cfg
```

Страница 4KB, 64 страницы/блок, блок 256KB, раздел 64MB:

```text
mkfs.ubifs -F -d /path-to-it/buildroot/output/rockchip_rv1126_rv1109_spi_nand/target -e 0x3e000 -c 0x100 -m 0x1000 -v -o rootfs.ubifs
ubinize -o ubi.img -m 0x1000 -p 256KiB ubinize.cfg
```

Многотомный пример: страница 2KB, 64 страницы/блок, блок 128KB; объединены oem 8MB и userdata 8MB.

```text
mkfs.ubifs -F -d oem -e 0x1f000 -c 0x40 -m 0x800 -v -o oem.ubifs
mkfs.ubifs -F -d userdata -e 0x1f000 -c 0x40 -m 0x800 -v -o userdata.ubifs
ubinize -o oem_userdata.img -p 0x20000 -m 2048 -s 2048 -v ubinize_oem_userdata.cfg
```

Задайте ubinize_oem_userdata.cfg:

```text
[oem-volume]
mode=ubi
image=oem.ubifs
vol_id=0
vol_size=8MiB
vol_type=dynamic
vol_name=oem

[userdata-volume]
mode=ubi
image=userdata.ubifs
vol_id=1
vol_size=8MiB
vol_type=dynamic
vol_name=userdata
vol_flags=autoresize
```

Смонтируйте разделы:

```text
ubiattach /dev/ubi_ctrl -m 4 -d 4 -b 5
mount -t ubifs /dev/ubi4_0 /oem
mount -t ubifs /dev/ubi4_1 /uesrdata
```

Отдельные тома нельзя просто обновлять независимо прямыми flash-интерфейсами. Требования и частота OTA томов одного образа должны быть близкими.

##### 6.1.3.2 Онлайн низкоуровневое форматирование раздела в ядре

```text
umount userdata/
ubidetach -m 4
ubiformat -y /dev/mtd4
ubiattach /dev/ubi_ctrl -m 4 -d 4
ubimkvol /dev/ubi4 -N userdata -m                        # -N 指定卷名，-m 将分区设备 autorisize 可动态调整到最⼤
mount -t ubifs /dev/ubi4_0 /userdata
```

##### 6.1.3.3 Монтирование UBIFS командами

Подключите MTD к UBI:

```text
ubiattach /dev/ubi_ctrl -m 4 -d 4
```

-m: номер MTD. -d: номер UBI после подключения, желательно совпадающий с MTD. -b/--max-beb-per1024: ожидаемый максимум плохих eraseblock на 1024; примечания:

1. По умолчанию 20.

2. Готовый образ: резервные блоки раздела &lt; фактический --max-beb-per1024 &lt; заданный --max-beb-per1024. Фактическое значение может быть меньше.

3. При создании пустого UBI командой фактическое значение равно заданному.

4. SDK может задавать 10; старые SDK могут не задавать значение.

5. Для экономии места: 4 + число блоков * 1%; при блоках 128KB и oem 16MB (128 блоков) можно взять 5.

```text
mount -t ubifs /dev/ubi4_0 /oem
```

<!-- Chinese baseline PDF p.30 -->

##### 6.1.3.4 Автоматическое монтирование UBIFS

```text
ubi.mtd=4 root=ubi0:rootfs rootfstype=ubifs
```

##### 6.1.3.5 Накладные расходы раздела UBI

Полезная ёмкость UBI после монтирования меньше раздела из-за метаданных UBIFS и резерва замены плохих блоков. Точный расчёт:

```text
UBI overhead = (B + 4) * SP + 0 * (P - B - 4) /* 该空间⽤⼾⽆法获取 */
P - MTD 设备上物理除块的总数
SP - 物理擦除块⼤⼩,通常为 128KB 或 256KB
SL - 逻辑擦除块，即 mkfs 时 -e 参数值,通常为 block_size - 2 * page_size
B - 为坏块替换预留的 f1ash blocks,与 ubiattach- b参数相关
O - 与以字节为单位存储 EC 和 VID ⽂件头有关的开销, i.e. 0 = SP - SL
```

Пример 1: блоки 128KB, страницы 2KB, устройство 128MB; ubiattach -b по умолчанию 20.

```text
SP = block size = 128KB
SL = 128kb - 2 * 2KB = 124KB
B = --max-beb-per1024 * n_1024 = 20 * 1 = 20
O = 128KB -124KB = 4KB
UBI overhead = (20 + 4) * 128KB + 4KB * (P - 20 - 4) = 2976KB + 4KB * P
```

Для раздела 32MB P = 256: UBI overhead = 2976KB + 4KB * 256 = 4000KB. Пример 2: блоки 128KB, страницы 2KB, устройство 256MB; ubiattach -b по умолчанию 20.

```text
SP = block size = 128KB
SL = 128kb - 2 * 2KB = 124KB
B = --max-beb-per1024 * n_1024 = 20 * 2 = 40
O = 128KB -124KB = 4KB
UBI overhead = (40 + 4) * 128KB + 4KB * (P - 40 - 4) = 5456KB + 4KB * P
```

Для раздела 32MB P = 256: оригинал указывает UBI overhead = 5456KB + 4KB * 256 = 6456KB. См. Flash space overhead: http://www.linux-mtd.infradead.org/doc/ubi.html#L_overhead.

#### 6.1.4 Поддержка SquashFS через UBI Block

Настройка ядра:

```text
+CONFIG_MTD_UBI_BLOCK=y
```

<!-- Chinese baseline PDF p.31 -->

Задайте rootfs в DTS:

```text
dts 中 bootargs 参数指定了 cmdline 中相关 ubi 的参数。

- ubi.mtd=4              : 选择 MTD 设备（从0开始）
- ubi.block=0,rootfs     : "rootfs" 是 vol_name (参考 ubinize.cfg), block=0 指定了ubi block的序
号
- root=/dev/ubiblock0_0  : 指定 rootfs 分区名；由 ubi block 驱动根据 ubi.block 参数⽣成的块设备
- rootfstype=squashfs    : 指定⽂件系统类型
```

Пример:

```text
ubi.mtd=3 ubi.block=0,rootfs root=/dev/ubiblock0_0 rootfstype=squashfs
```

Примечания:

1. Если U-Boot получает MTD из GPT, разделы соответствуют parameter.txt и нумеруются от mtd0 или mtdblock0.

2. mtd — символьное устройство, mtdblock — блочное. Для тома SquashFS UBI Buildroot обычно создаёт SquashFS. Отдельно используйте mksquashfs, например:

```text
sudo mksquashfs squashfs-root/ squashfs.img -noappend -always-use-fragments
```

Упакуйте SquashFS в UBI с ubinize. Сначала создайте ubinize.cfg:

```text
cat > ubinize.cfg << EOF
[ubifs]
mode=ubi
vol_id=0
vol_type=static
vol_name=rootfs
vol_alignment=1
vol_flags=autoresize
image=/data/rk/projs/rv1126/sdk/buildroot/output/rockchip_rv1126_robot/images/rootfs.squashfs
EOF
```

vol_type=static задаёт только чтение; image — путь SquashFS. Затем выполните ubinize:

```text
ubinize -o rootfs.ubi -p 0x20000 -m 2048 -s 2048 -v ubinize.cfg
```

<!-- Chinese baseline PDF p.32 -->

-p: размер физического eraseblock. -m: минимальная единица ввода-вывода, 1 для NOR, страница для NAND. -s: размер подстраницы, 1 для NOR, размер подстраницы NAND для NAND. Результат rootfs.ubi используется для обновления. На NAND открытой схемы монтируйте SquashFS на UBI block, не mtdblock: последний не обнаруживает и не пропускает плохие блоки. Пример ручного монтирования:

```text
ubiattach /dev/ubi_ctrl -m 4 -d 4   /* 先挂载 UBI 设备 */
ubiblock -c /dev/ubi4_0             /* UBI 设备上扩展 UBI block ⽀持 */
mount -t squashfs /dev/ubiblock4_0 /oem
```

#### 6.1.5 Оптимизация размера образа

Полезную ёмкость образа можно улучшить тремя способами:

1. Выберите --max-beb-per1024 по пункту 5 описания -b при создании и монтировании пустого UBI.

2. Разделите накладные расходы UBIFS между несколькими томами UBI; см. создание многотомного образа.

3. Используйте SquashFS поверх UBI block; см. соответствующий раздел. Минимальный раздел UBIFS:

```text
Minimum block num = 4（固定预留） + B + 17  /* B - 为坏块替换预留的 f1ash blocks,与 ubiattach - b
参数相关，UBIFS_MIN_LEB_CNT 等于 17 */
```

Проверьте журнал ubiattach, например:

```text
ubi4: available PEBs: 7, total reserved PEBs: 24, PEBs reserved for bad PEB handling: 20
/* B = 20 */
```

Монтирование завершается ошибкой, если available PEBs + total reserved PEBs &lt; Minimum block num:

```text
mount: mounting /dev/ubi4_0 on userdata failed: Invalid argument
```

#### 6.1.6 UBIFS OTA

Обновляйте UBIFS с ubiupdatevol:

```text
ubiupdatevol /dev/ubi1_0 rootfs.ubifs
```

<!-- Chinese baseline PDF p.33 -->

rootfs.ubifs создаётся mkfs.ubifs, а не является итоговым образом ubinize.

#### 6.1.7 UBIFS FASTMAP

FASTMAP описан как экспериментальная опция UBI, включаемая CONFIG_MTD_UBI_FASTMAP=y. При fm_autoconvert=1 (по умолчанию 0) UBI автоматически создаёт внутренний том fastmap для ускорения последующих подключений. Пул занимает максимум 5% физических блоков и минимум два блока для fastmaps. Большие разделы могут выиграть; измерения оригинала не выявили явного ускорения загрузки 128MB UBIFS/UBI Block SquashFS. Настройки ядра:

```text
CONFIG_MTD_UBI_FASTMAP=y
```

Включите fm_autoconvert после загрузки ядра:

```text
echo 1 > /sys/module/ubi/parameters/fm_autoconvert
```

Затем подключите устройство через ubiattach, например:

```text
ubiattach /dev/ubi_ctrl -m 7 -d 7
```

fastmap можно отключить при ubiattach; некоторые старые инструменты этого не поддерживают.

```text
ubiattach /dev/ubi_ctrl -m 7 -d 7 -f
```

В общем SDK явного выигрыша нет, поэтому настройка по умолчанию выключена; включайте по необходимости.

#### 6.1.8 Поддержка UBIFS в U-Boot

UBIFS в U-Boot поддерживает только чтение, без записи и удаления. Патч SLC NAND: см. RK3308 ниже.

```text
CONFIG_CMD_UBI=y

diff --git a/include/configs/rk3308_common.h b/include/configs/rk3308_common.h
index 1c2b9e4461..bc861acde8 100644
--- a/include/configs/rk3308_common.h
+++ b/include/configs/rk3308_common.h
@@ -57,6 +57,9 @@
 #define CONFIG_USB_FUNCTION_MASS_STORAGE
 #define CONFIG_ROCKUSB_G_DNL_PID        0x330d
+#define MTDIDS_DEFAULT "nand0=rk-nand"
+#define MTDPARTS_DEFAULT "mtdparts=rk-nand:0x100000@0x400000(uboot),0x100000@0x500000(trust),0x600000@0x600000(boot),0x3000000@0xc00000(rootfs),0x1200000@0x4000000(oem),0x9f60000@0x6000000(userdata)"
+
 #ifdef CONFIG_ARM64
 #define ENV_MEM_LAYOUT_SETTINGS \
        "scriptaddr=0x00500000\0" \
```

Патч SPI NAND: поддержка RK3568 ниже.

```text
diff --git a/include/configs/rk3568_common.h b/include/configs/rk3568_common.h
index cce44b52a8..eb93455c62 100644
--- a/include/configs/rk3568_common.h
+++ b/include/configs/rk3568_common.h
@@ -92,6 +92,9 @@
        "run distro_bootcmd;"
 #endif
+#define MTDIDS_DEFAULT "spi-nand0=spi-nand0"
+#define MTDPARTS_DEFAULT "mtdparts=spi-nand0:0x100000@0x400000(vnvm),0x440000@0x500000(uboot),0x1600000@0xa00000(boot),0x4400000@0x2000000(rootfs),0x1b60000@0x6400000(userdata)"
+
 /* rockchip ohci host driver */
 #define CONFIG_USB_OHCI_NEW
 #define CONFIG_SYS_USB_OHCI_MAX_ROOT_PORTS     1
(END)
```

Включите макросы menuconfig:

```text
#define CONFIG_CMD_UBI = y
```

Пример монтирования rootfs; подробнее doc/README.ubi.

```text
mtdpart
ubi part rootfs
ubifsmount ubi0:rootfs
ubifsls
```

U-Boot передаёт mtdparts через cmdline согласно расширению GPT, кроме MTDPARTS_DEFAULT. Добавьте mtdparts в cmdline ядра для определения MTD.

<!-- Chinese baseline PDF p.35 -->

#### 6.1.9 Настройка SDK для UBIFS

Пример RK3568 EVB1: сократите SDK и создайте rootfs.ubi, изменив buildroot/configs/rockchip_rk3568_defconfig.

```text
#include "base/base.config"
#include "chips/rk3566_rk3568_aarch64.config"
#include "fs/ubifs.config"
```

Измените выходную ссылку rootfs.img на rootfs.ubi.

```text
diff --git a/.chips/rk3566_rk3568/rockchip_rk3568_evb1_ddr4_v10_defconfig b/.chips/rk3566_rk3568/rockchip_rk3568_evb1_ddr4_v10_defconfig
index a2788203..31528f73 100644
--- a/.chips/rk3566_rk3568/rockchip_rk3568_evb1_ddr4_v10_defconfig
+++ b/.chips/rk3566_rk3568/rockchip_rk3568_evb1_ddr4_v10_defconfig
@@ -1,3 +1,6 @@
 RK_KERNEL_DTS_NAME="rk3568-evb1-ddr4-v10-linux"
 RK_PARAMETER="parameter-buildroot-fit.txt"
 RK_USE_FIT_IMG=y
+RK_ROOTFS_UBI=y
```

Измените стандартные параметры NAND 2KB/128KB на страницу 4KB/блок 256KB:

```text
diff --git a/.chips/rk3566_rk3568/rockchip_rk3568_evb1_ddr4_v10_defconfig b/.chips/rk3566_rk3568/rockchip_rk3568_evb1_ddr4_v10_defconfig
index a2788203..31528f73 100644
--- a/.chips/rk3566_rk3568/rockchip_rk3568_evb1_ddr4_v10_defconfig
+++ b/.chips/rk3566_rk3568/rockchip_rk3568_evb1_ddr4_v10_defconfig
@@ -1,3 +1,6 @@
 RK_KERNEL_DTS_NAME="rk3568-evb1-ddr4-v10-linux"
 RK_PARAMETER="parameter-buildroot-fit.txt"
 RK_USE_FIT_IMG=y
+RK_UBI_PAGE_SIZE=0x1000
+RK_UBI_BLOCK_SIZE=0x40000
```

RK_UBI_PAGE_SIZE и RK_UBI_BLOCK_SIZE соответствуют параметрам Buildroot:

```text
BR2_TARGET_ROOTFS_UBI=y
BR2_TARGET_ROOTFS_UBI_PEBSIZE=0x40000
BR2_TARGET_ROOTFS_UBI_SUBSIZE=4096
BR2_TARGET_ROOTFS_UBI_OPTS="-v"
BR2_TARGET_ROOTFS_UBIFS_LEBSIZE=0x3e000
BR2_TARGET_ROOTFS_UBIFS_MINIOSIZE=4096
BR2_TARGET_ROOTFS_UBIFS_MAX_SIZE=1024
BR2_TARGET_ROOTFS_UBIFS_OPTS="-F -v"
```

После изменения параметров пересоберите rootfs и перепакуйте прошивку.

<!-- Chinese baseline PDF p.36 -->

### 6.2 Поддержка файловой системы JFFS2

#### 6.2.1 Введение

JFFS2 — Journalling Flash FileSystem Version 2. Она реализует журналируемую ФС непосредственно на MTD, без слоя преобразования для обычных ФС. При монтировании сканирует журнал MTD и восстанавливает структуры в RAM.

#### 6.2.2 Примечания

1. mkfs.jffs2 не создаёт заранее образы JFFS2 с erase size 4KB.

1. Стандартные mtd-utils не поддерживают стирание 4KB.

2. RK Buildroot изменяет mtd-utils для 4KB; изменения ниже.

```text
diff --git a/jffsX-utils/mkfs.jffs2.c b/jffsX-utils/mkfs.jffs2.c
index 9aa6c39..3cec529 100644
--- a/jffsX-utils/mkfs.jffs2.c
+++ b/jffsX-utils/mkfs.jffs2.c
@@ -1668,6 +1668,11 @@ int main(int argc, char **argv)

                          /* If it's less than 8KiB, they're not allowed */
                          if (erase_block_size < 0x2000) {
+                             if (erase_block_size == 0x1000) {
+                                 warnmsg("Set Erase size to 4KB with Experimental.\n");
+                                 erase_block_size = 0x1000;
+                                 break;
+                             }
                              fprintf(stderr, "Erase size 0x%x too small. Increasing to 8KiB minimum\n",
                                      erase_block_size);
                              erase_block_size = 0x2000;
diff --git a/jffsX-utils/sumtool.c b/jffsX-utils/sumtool.c
index 68268a9..836b426 100644
--- a/jffsX-utils/sumtool.c
+++ b/jffsX-utils/sumtool.c
@@ -194,6 +194,11 @@ static void process_options (int argc, char **argv)

                          /* If it's less than 8KiB, they're not allowed */
                          if (erase_block_size < 0x2000) {
+                             if (erase_block_size == 0x1000) {
+                                 warnmsg("Set Erase size to 4KB with Experimental.\n");
+                                 erase_block_size = 0x1000;
+                                 break;
+                             }
                              warnmsg("Erase size 0x%x too small. Increasing to 8KiB minimum\n",
                                    erase_block_size);
                              erase_block_size = 0x2000;
--
2.23.0-rc1
```

2. JFFS2 ядра поддерживает стирание NOR 4KB и форматирование flash_erase -j для создания раздела JFFS2 4KB.

#### 6.2.3 Настройка

Настройка ядра:

```text
CONFIG_JFFS2_FS=y
CONFIG_MTD_SPI_NOR_USE_4K_SECTORS=n /* 内核版本 5.10 及更⾼版本可配 */
```

В Linux 5.10+ RK SPI NOR использует стандартный MTD NOR. Большинство компонентов поддерживают SECT_4K; CONFIG_MTD_SPI_NOR_USE_4K_SECTORS выбирает 64KB/4KB. 64KB быстрее (GD25Q256E типично 0.12s/0.15s), но выравнивание расходует место. 4KB медленнее (GD25Q256E типично 30ms, менее трети эффективности блочного стирания), но экономнее по месту.

#### 6.2.4 Создание образа

Пример создания образа:

```text
mkfs.jffs2 -r data/ -o data.jffs2 -e 0x10000 --pad=0x400000 -s 0x1000 -n
Options:
 --pad [=SIZE]            Pad output to SIZE bytes with 0xFF. If SIZE is
                          not specified, the output is padded to the end of
                          the final erase block
  -r, -d, --root=DIR      Build file system from directory DIR (default: cwd)
  -s, --pagesize=SIZE     Use page size (max data node size) SIZE.
                          Set according to target system's memory management
                          page size (default: 4KiB)
  -e, --eraseblock=SIZE   Use erase block size SIZE (default: 64KiB)
  -n, --no-cleanmarkers   Don't add a cleanmarker to every eraseblock
```

--pad: размер раздела. -e: erase size, обычно только 64KB; для 4KB измените mtd-utils по примечаниям. -s: по умолчанию 4KB.

<!-- Chinese baseline PDF p.38 -->

## 7 Запись аппаратным программатором

### 7.1 Запись образа SPI NAND: GPT

#### 7.1.1 Создание образа SPI NAND для записи

Вход: образы SDK для инструментов записи ПК.

```text
[/IMAGES] tree
.
├── parameter.txt
├── MiniLoaderAll.bin
├── uboot.img
├── boot.img
├── rootfs.img
├── oem.img
└── update.img                  // ⽤以制作烧录镜像
```

programmer_image_tool находится в SDK rkbin/. Использование:

```text
./tools/programmer_image_tool  --help
NAME
        programmer_image_tool - creating image for programming on flash
SYNOPSIS
        programmer_image_tool [-iotbpsvh]
DESCRIPTION
        This tool aims to convert firmware into image for programming
        From now on,it can support slc nand(rk)|spi nand|nor|emmc.
OPTIONS:
          -i    input firmware
          -o    output directory
          -t    storage type,range in[SLC|SPINAND|SPINOR|EMMC]
          -b    block size,unit KB
          -p    page size,unit KB
          -s    oob size,unit B
          -2    2k data in one page
          -l    using page linked l
```

Пример: rv1126, блоки 128KB, страницы 2KB; 256KB, 4KB * 64.

```text
./tools/programmer_image_tool  -i update.img -b 128 -p 2 -t spinand -o out
input firmware is 'update.img'
block size is '128'
page size is '2'
flash type is 'spinand'
output directory is 'out'
writing idblock...
start to write partitions...gpt=1
preparing gpt saving at out/gpt.img
writing gpt...OK
preparing trust saving at out/trust.img
writing trust...OK
preparing uboot saving at out/uboot.img
writing uboot...OK
preparing boot saving at out/boot.img
writing boot...OK
preparing rootfs saving at out/rootfs.img
writing rootfs...OK
preparing recovery saving at out/recovery.img
writing recovery...OK
preparing oem saving at out/oem.img
writing oem...OK
preparing userdata:grow saving at out/userdata:grow.img
writing userdata:grow...OK
preparing misc saving at out/misc.img
writing misc...OK
creating programming image ok.
```

Для страниц 4KB добавьте -2 в programmer_image_tool. Выход: образы программатора.

```text
out
├── boot.img
├── gpt.img
├── idblock.img            // ⾃⾏根据需求制作 idblock_mutli_copies.img 的多备份镜像
├── misc.img
├── oem.img
├── recovery.img
├── rootfs.img
├── trust.img
├── uboot.img
└── userdata.img
```

Пример нескольких копий IDB; обычно достаточно двух:

```text
cat out/idblock.img > out/idblock_mutli_copies.img   // 1 copy
cat out/idblock.img >> out/idblock_mutli_copies.img  // 2 copies
```

<!-- Chinese baseline PDF p.40 -->

#### 7.1.2 Запись SPI NAND программатором

Адреса записи: сравнение инструмента ПК и программатора при блоках 128KB:

| Источник образа программатора: стандартный образ SDK | Адрес сектора инструмента записи на ПК | Образ программатора | Начальный адрес блока программатора | Конечный адрес | Размер прошивки | Примечания |
| --- | --- | --- | --- | --- | --- | --- |
| paramter.txt | 0 | gpt.img | 0x0 | 0x1 | 0x1 | Примечание 1 |
| MiniLoaderAll.bin | 0 | idblock_mutli_copies.img | 0x1 | 0x7 | 0x6 | Примечание 2 |
| uboot.img | 0x2000 | uboot.img | 0x20 | 0x47 | 0x20 | Примечание 3 |
| boot.img | 0x4800 | boot.img | 0x48 | 0xa0 | 0x50 |  |
| ... | ... | ... | ... |  |  |  |
| xxx.img | 0x3E000 | xxx.img | 0x3e0 | 0x3fb | 0x18 | Примечание 4 |

Примечания таблицы:

1. gpt.img записывается в блок 0; U-Boot автоматически восстанавливает/создаёт резервную GPT.

2. idblock_mutli_copies.img начинается с блока 1, конец — блок 7; образ меньше раздела с резервом одного блока.

3. Кроме специальных адресов gpt.img/idblocks.img, используйте parameter.txt. Оригинал пишет единицу 512B/s; расчёт использует 512 байт: адрес блока = sectors * 512B / block_size, либо sectors / 0x100 для 128KB и / 0x200 для 256KB. Кроме gpt.img, образы должны быть на 1–2 блока меньше разделов для замены плохих.

4. Последние четыре блока резервируются под таблицу плохих блоков. Пользовательские разделы не должны входить туда; можно определить reverved (написание оригинала) для защиты от использования. Дополнительно:

1. FSPI RK SPI NAND (ранее SFC) не имеет ECC, поэтому используется ECC компонента. Образы без OOB; программатор заполняет OOB значением FF и включает ECC устройства.

2. На непустой flash перед записью сотрите все исправные блоки.

3. Включите проверку записи.

<!-- Chinese baseline PDF p.41 -->

### 7.2 Запись образа SLC NAND: GPT

#### 7.2.1 Создание образа SLC NAND для записи

Вход: образы SDK для инструментов записи ПК.

```text
[/IMAGES] tree
.
├── parameter.txt
├── MiniLoaderAll.bin
├── uboot.img
├── boot.img
├── rootfs.img
├── oem.img
└── update.img                  // ⽤以制作烧录镜像
```

Пример создания: rv1126, блоки 128KB, страницы 2KB, OOB 128.

```text
./tools/programmer_image_tool -i update.img -b 128 -p 2 -s 128 -t slc -o out
input firmware is 'update.img'
block size is '128'
page size is '2'
oob size is '128'
flash type is 'slc'
2k data page on.
output directory is 'out'
writing idblock...
start to write partitions...gpt=1
preparing gpt saving at out/gpt.img
writing gpt...OK
preparing trust saving at out/trust.img
writing trust...OK
preparing uboot saving at out/uboot.img
writing uboot...OK
preparing boot saving at out/boot.img
writing boot...OK
preparing rootfs saving at out/rootfs.img
writing rootfs...OK
preparing recovery saving at out/recovery.img
writing recovery...OK
preparing oem saving at out/oem.img
writing oem...OK
preparing userdata:grow saving at out/userdata:grow.img
writing userdata:grow...OK
preparing misc saving at out/misc.img
writing misc...OK
creating programming image ok.
```

<!-- Chinese baseline PDF p.42 -->

Добавьте -l для RK3326/PX30/RK3568 для изменения связного списка; -2 для RV1126/RK3326/PX30/RK3308 со страницами 4KB. Образ выровнен по блоку с OOB; см. информацию NAND. Выход используется программатором.

```text
out
├── boot.img
├── gpt.img
├── idblock.img            // ⾃⾏根据需求制作 idblock_mutli_copies.img 的多备份镜像
├── misc.img
├── oem.img
├── recovery.img
├── rootfs.img
├── trust.img
├── uboot.img
└── userdata.img
```

Пример команды резервных копий IDB:

```text
cat out/idblock.img > out/idblock_mutli_copies.img   // 1 copy
cat out/idblock.img >> out/idblock_mutli_copies.img  // 2 copies
```

#### 7.2.2 Запись SLC NAND программатором

Адреса записи: сравнение инструмента ПК и программатора при блоках 128KB:

| Источник образа программатора: стандартный образ SDK | Адрес сектора инструмента записи на ПК | Образ программатора | Начальный адрес блока программатора | Конечный адрес | Размер прошивки | Примечания |
| --- | --- | --- | --- | --- | --- | --- |
| paramter.txt | 0 | gpt.img | 0x0 | 0x1 | 0x1 | Примечание 1 |
| MiniLoaderAll.bin | 0 | idblock_mutli_copies.img | 0x1 | 0x7 | 0x6 | Примечание 2 |
| uboot.img | 0x2000 | uboot.img | 0x20 | 0x47 | 0x20 | Примечание 3 |
| boot.img | 0x4800 | boot.img | 0x48 | 0xa0 | 0x50 |  |
| ... | ... | ... | ... |  |  |  |
| xxx.img | 0x3E000 | xxx.img | 0x3e0 | 0x3fb | 0x18 | Примечание 4 |

Примечания таблицы:

<!-- Chinese baseline PDF p.43 -->

1. Запишите gpt.img в блок 0.

2. idblock_mutli_copies.img начинается в блоке 1, заканчивается блоком 7 и меньше семи блоков, с резервом одного блока.

3. Кроме специальных адресов gpt.img/idblocks.img, используйте parameter.txt. Оригинал пишет единицу 512B/s; расчёт использует 512 байт: адрес блока = sectors * 512B / block_size, либо sectors / 0x100 для 128KB и / 0x200 для 256KB. Кроме gpt.img, образы должны быть на 1–2 блока меньше разделов для замены плохих.

4. Последние четыре блока резервируются под таблицу плохих блоков. Пользовательские разделы не должны входить туда; можно определить reverved (написание оригинала) для защиты от использования. Дополнительно:

1. Все образы содержат OOB.

2. На непустой flash перед записью сотрите все исправные блоки.

3. Включите проверку записи.

### 7.3 Запись образа SPI NOR: GPT

#### 7.3.1 Создание образа SPI NOR для записи

Вход: образы SDK для инструментов записи ПК.

```text
[/IMAGES] tree
.
├── parameter.txt
├── MiniLoaderAll.bin
├── uboot.img
├── boot.img
├── rootfs.img
├── oem.img
└── update.img                  // ⽤以制作烧录镜像
```

Пример создания образа:

```text
./tools/programmer_image_tool -i update.img  -t SPINOR -o ./out
input firmware is 'update.img'
flash type is 'SPINOR'
output directory is './out'
writing idblock...
start to write partitions...gpt=1
preparing gpt at 0x00000000
writing gpt...OK
preparing trust at 0x00002800
writing trust...OK
preparing uboot at 0x00002000
writing uboot...OK
preparing boot at 0x00009800
writing boot...OK
preparing rootfs at 0x0000c800
writing rootfs...OK
preparing recovery at 0x00003800
writing recovery...OK
preparing misc at 0x00003000
writing misc...OK
creating programming image ok.
```

Выход: образы для программатора.

```text
tree
.
└── out_image.img
```

#### 7.3.2 Запись SPI NOR программатором

Запишите результат programmer_image_tool по адресу SPI NOR 0.

### 7.4 Запись образа SPI NAND: ENV

#### 7.4.1 Создание образа SPI NAND для записи

Вход: образы SDK.

```text
[/IMAGES] tree
.
├── boot.img
├── download.bin
├── env.img
├── idblock.img
├── oem_2KB_128KB_48MB.ubi
├── oem_2KB_256KB_48MB.ubi
├── oem_4KB_256KB_48MB.ubi
├── oem.img
├── rootfs_2KB_128KB_32MB.ubi
├── rootfs_2KB_256KB_32MB.ubi
├── rootfs_4KB_256KB_32MB.ubi
├── rootfs.img
├── sd_update.txt
├── tftp_update.txt
├── uboot.img
├── update.img
├── userdata_2KB_128KB_32MB.ubi
├── userdata_2KB_256KB_32MB.ubi
├── userdata_4KB_256KB_32MB.ubi
└── userdata.img
```

Образы SDK подходят ПК и программатору. Стандартный idblock.img поддерживает SPI NAND 2KB; для страницы 4KB пересоздайте его. Выход остаётся idblock.img:

```text
./rkbin/tools/programmer_image_tool  -i download.bin -b 256 -p 4 -2 -t spinand -o ./
```

#### 7.4.2 Запись SPI NAND программатором

Адреса записи: сравнение инструмента ПК и программатора при блоках 128KB:

| Источник образа программатора: стандартный образ SDK | Адрес сектора инструмента записи на ПК | Образ программатора | Начальный адрес блока программатора | Конечный адрес | Размер прошивки | Примечания |
| --- | --- | --- | --- | --- | --- | --- |
| env.img | 0 | env.img | 0x0 | 0x1 | 0x1 | Примечание 1 |
| idblock.img | 0x40000 | idblock_mutli_copies.img | 0x1 | 0x3 | 0x3 | Примечание 2 |
| uboot.img | 0x80000 | uboot.img | 0x4 | 0x7 | 0x4 | Примечание 3 |
| boot.img | 0xC0000 | boot.img | 0x8 | 0x47 | 0x40 |  |
| ... | ... | ... | ... |  |  |  |
| xxx.img | 0x58C0000 | xxx.img | 0x2c6 | 0x3fc | 0x136 | Примечание 4 |

Примечания таблицы:

1. Запишите env.img в блок 0.

2. idblock_mutli_copies.img начинается в блоке 1, конец — блок 3; оставьте один резервный блок в разделе.

3. Кроме специальных gpt.img/idblocks.img (формулировка оригинала), используйте байтовые адреса env.img. Адрес блока = address / block_size: / 0x20000 для 128KB, / 0x40000 для 256KB. Кроме env.img, оставьте 1–2 блока резерва.

4. Последние четыре блока резервируются под таблицу плохих блоков. Пользовательские разделы не должны входить туда; можно определить reverved (написание оригинала) для защиты от использования. Дополнительно:

<!-- Chinese baseline PDF p.46 -->

1. FSPI RK SPI NAND (ранее SFC) не имеет ECC, поэтому используется ECC компонента. Образы без OOB; программатор заполняет OOB значением FF и включает ECC устройства.

2. На непустой flash перед записью сотрите все исправные блоки.

3. Включите проверку записи.

### 7.5 Запись образа SPI NOR: ENV

#### 7.5.1 Создание образа SPI NOR для записи

Вход: образы SDK для инструментов записи ПК.

```text
[/IMAGES] tree
.
├── env.img
├── idblock.img
├── uboot.img
├── boot.img
├── rootfs.img
├── oem.img
└── update.img                  // ⽤以制作烧录镜像
```

Пример создания образа:

```text
./tools/programmer_image_tool -i update.img  -t SPINOR -o ./out
input firmware is 'update.img'
flash type is 'SPINOR'
output directory is './out'
start to write partitions...env
preparing env at 0x00000000
writing env...OK
preparing idblock at 0x00000200
writing idblock...OK
preparing uboot at 0x00000400
writing uboot...OK
preparing boot at 0x00000600
writing boot...OK
preparing rootfs at 0x00004600
writing rootfs...OK
preparing oem at 0x00014600
writing oem...OK
preparing userdata at 0x0002c600
writing userdata...OK
creating programming image ok.
```

Выход: образы для программатора.

<!-- Chinese baseline PDF p.47 -->

```text
tree
.
└── out_image.img
```

#### 7.5.2 Запись SPI NOR программатором

Запишите результат programmer_image_tool по адресу SPI NOR 0.

## 8 Тесты

### 8.1 Тесты изделий с NAND Flash

Для продуктов SLC parallel NAND и SPI NAND.

#### 8.1.1 Стресс-тест чтения/записи flash_stress_test

Цель: устойчивость SPI NAND под нагрузкой чтения/записи. Тесты обычно входят в SDK Buildroot; включите rockchip_test. Подготовьте десять устройств с резервом около 30MB в userdata. Порядок:

1. Выберите “3 flash_stress_test” в ./rockchip_test/rockchip_test.sh SDK Buildroot. Не отключайте питание.

Записывайте журналы теста.

3. Остановите с хоста сочетанием ctrl + c.

Тест пройден при нормальной работе после 24 часов, иначе провален. Ищите ubi и error в журналах.

#### 8.1.2 Внезапное отключение питания: power_lost_test

NAND-устройства, особенно без батареи, испытывают внезапные отключения; рекомендуется проверка устойчивости. Тесты обычно входят в SDK Buildroot; добавьте rockchip_test. Подготовьте десять устройств с примерно 30MB в userdata. Порядок:

1. Выберите “18 nand power lost test” в ./rockchip_test/rockchip_test.sh. После включения начнётся непрерывный тест; записывайте UART-журнал.

<!-- Chinese baseline PDF p.48 -->

2. Питание 14 секунд, отключение 3 секунды: цикл 17 секунд в течение 24 часов, около 5000 отключений. При каждом запуске загрузка и старт скрипта должны укладываться в 17 секунд.

Записывайте журналы теста.

4. Остановите с хоста: echo off &gt; /data/cfg/rockchip_test/reboot_cnt

Тест пройден при нормальной работе после 24 часов, иначе провален. Ищите ubi и error в журналах.

## 9 Частые вопросы

### 9.1 Информация о NAND Flash

Для UBIFS и IDB (Pre loader) возьмите параметры NAND из руководства: страница обычно 2KB/4KB; OOB 64B/128B/256B; страниц/блок 64/128. block size = page_size * page_per_block, обычно 128KB/256KB; с OOB: (page_size + oob_size) * page_per_block. Образы программатора и UBIFS обычно по умолчанию 2KB/128KB; для других компонентов измените по руководству.

![Рисунок английского оригинала, стр. 52](/docs/rockchip-flash-open-source/assets/en-p052-figure-01.png)

*Рисунок английского оригинала, стр. 52*

<!-- Chinese baseline PDF p.49 -->

### 9.2 Размещение IDB

IDB объединяет ddr.bin и spl.bin как первую прошивку после mask ROM. ПК заполняет блоки flash 1–7 резервными копиями. Размещение программатором см. в адресах записи соответствующей главы.

### 9.3 Измерение скорости SPI Flash в ядре

Выберите свободный MTD-раздел без смонтированной ФС, чтобы исключить влияние; измерьте скорость mtd_debug:

```text
#测试准备
dd if=/dev/random of=/tmp/test4M bs=1M count=4
mtd_debug read /dev/mtd6 0 0x400000 /tmp/test_backup
sync

#写速率测试
mtd_debug erase /dev/mtd6 0 0x400000 && sync
time mtd_debug write /dev/mtd6 0 0x400000 /tmp/test4M && time sync

#读测试
time mtd_debug read /dev/mtd6 0 0x400000 /tmp/test4M && time sync

#擦除测试
time mtd_debug erase /dev/mtd6 0 0x400000 && time sync

#测试结束
time mtd_debug write /dev/mtd6 0 0x400000 /tmp/test_backup && time sync
```

Пример SPI NAND W25N01KVxxIR, AC Electrical Characteristics: блок 128KB, страница 2KB; типично tBE 2ms, tPP 250us, tRD с ECC 45us. При 100MHz single-line tIO 160us, запись page_size/(tPP+tIO) около 5MB/s; ядро по умолчанию пишет одной линией. При 100MHz quad tIO 40us, чтение page_size/(tRD+tIO) около 23MB/s.

<!-- Chinese baseline PDF p.50 -->

Стирание без задержки I/O: block_size/tBE ≈64MB/s. Пример SPI NOR XT25F128B: блок 64KB, страница 256B, типично tBE 200ms и tPP 300us, чтение близко к tIO. При 100MHz одной линией и tIO 160us оригинала запись page_size/(tPP+tIO) ≈557KB/s; ядро по умолчанию пишет одной линией. Чтение 100MHz quad около 50MB/s. Стирание block_size/tBE ≈320KB/s.

### 9.4 Срок службы NAND

Ресурс NAND задаётся циклами P/E, обычно 100K. Нужен запас: производители ограничивают частую запись одного блока и иногда баланс данных для сохранения заряда. Учитывайте реальный ресурс и различия производителей, например 50%, то есть 50K циклов. Раздел 100M даёт 50K * 100M сырых данных. Политика ФС снижает объём: UBIFS расходует около 20% (около 25KB блока 128KB), получаем 50K * 100M * 80% = 4T полезных данных. При сжатии 50% это около 8T пользовательских данных. Учтены лишь основные факторы; результат зависит от ФС, сжатия и реального ресурса. При загрузке UBIFS выводит P/E раздела:

```text
ubi0: max/mean erase counter: 164/10, WL threshold: 4096, image sequence number: 207598880
```

Пояснение:

<!-- Chinese baseline PDF p.51 -->

max — наибольшее число стираний блока раздела. Сравните после нагрузки: рост на 100 за 24h при расчётных 50K P/E даёт 500 дней. Без ФС следующий патч следит за userdata:

```text
diff --git a/drivers/mtd/mtdcore.c b/drivers/mtd/mtdcore.c
index ad527bdbd463..ae34665e5c89 100644
--- a/drivers/mtd/mtdcore.c
+++ b/drivers/mtd/mtdcore.c
@@ -36,6 +36,28 @@

 struct backing_dev_info *mtd_bdi;

+#include <linux/moduleparam.h>
+
+static int e_count;
+module_param(e_count, int, S_IRUGO);
+MODULE_PARM_DESC(e_count, "e_count");
+
+static int p_count;
+module_param(p_count, int, S_IRUGO);
+MODULE_PARM_DESC(p_count, "p_count");
+
+static int r_count;
+module_param(r_count, int, S_IRUGO);
+MODULE_PARM_DESC(r_count, "r_count");
+
+static inline int mtd_trace(struct mtd_info *mtd, char *cmp_name, int len)
+{
+       if (cmp_name && strcmp(mtd->name, cmp_name))
+               return 0;
+       else
+               return len;
+}
+
 #ifdef CONFIG_PM_SLEEP

 static int mtd_cls_suspend(struct device *dev)
@@ -1336,6 +1358,8 @@ int mtd_erase(struct mtd_info *mtd, struct erase_info *instr)
        struct erase_info adjinstr;
        int ret;

+       e_count += mtd_trace(mtd, "userdata", mtd->erasesize);
+
        instr->fail_addr = MTD_FAIL_ADDR_UNKNOWN;
        adjinstr = *instr;

@@ -1467,6 +1491,8 @@ int mtd_read(struct mtd_info *mtd, loff_t from, size_t len, size_t *retlen,
        };
        int ret;

+       r_count += mtd_trace(mtd, "userdata", len);
+
        ret = mtd_read_oob(mtd, from, &ops);
        *retlen = ops.retlen;

@@ -1483,6 +1509,8 @@ int mtd_write(struct mtd_info *mtd, loff_t to, size_t len, size_t *retlen,
        };
        int ret;

+       p_count += mtd_trace(mtd, "userdata", len);
+
        ret = mtd_write_oob(mtd, to, &ops);
        *retlen = ops.retlen;

(END)
```

Установите прошивку с патчем, проведите нагрузку и получите байты стирания/записи/чтения e/p/r:

```text
cat /sys/module/mtd/parameters/e_count
cat /sys/module/mtd/parameters/p_count
cat /sys/module/mtd/parameters/r_count
```

Рассчитайте MB записи в час. Раздел 50MB при 100K P/E номинально даёт 5T; ресурс = общий объём / запись за час. В модели оригинала P/E — главный показатель, прочие влияют меньше.

### 9.5 Внезапное отключение питания NAND

Внезапное отключение обходит штатную деинициализацию и может оставить NAND при нестабильном напряжении. Больше всего страдают стирание (миллисекунды) и программирование (сотни микросекунд). Компонент 3V3 обычно требует не менее 2.7V; проверьте руководство. Типичные ошибки: неполная запись и:

<!-- Chinese baseline PDF p.53 -->

Команды при нестабильном напряжении могут давать случайные сбои. Восстановление ФС защищает структуру от неполной записи, но данные могут потеряться. PMIC контролирует питание и сбрасывает CPU ниже порога, прекращая стирание/запись NAND; разрядная цепь поддерживает напряжение около 1ms для последней операции. Reset IC действует аналогично. RK NPOR выдаёт прерывание ниже порога и позволяет запросить состояние напряжения. Предпочтительно питание от батареи либо постоянное. Иначе контролируйте VCC IO через PMIC/Reset IC/RK NPOR и сбрасывайте CPU до записи при низком напряжении; подберите VCC3V3-конденсаторы по схемам RK для удержания последней операции на tPROG, по возможности tBERS. Сократите отключения во время доступа. Важные данные защищайте двумя копиями прошивки и read-only хранением; изменяемым разделам нужны восстановление или OTA. В реальном изделии и нагрузке запустите power_lost_test и снимите временные диаграммы VCC3V3/RESETn:

![Рисунок английского оригинала, стр. 57](/docs/rockchip-flash-open-source/assets/en-p057-figure-01.png)

*Рисунок английского оригинала, стр. 57*

<!-- Chinese baseline PDF p.54 -->

На осциллографе отметьте RESETn как Y1, падение VCC3V3 до 2V7 как Y2 (минимум по руководству). Измеряйте ΔY1Y2 многократно, берите минимум; можно накладывать сигналы. Некоторые RKNPOR SoC скрывают RESETn внутри; используйте последний спад FSPI CSN, например RV1106.

### 9.6 Скрипт проверки сигналов Flash в ядре

MTD_TESTS находится в drivers/mtd/tests. Для теста сигнала записи SPI NAND добавьте задержку вместо частого опроса статуса.

```text
diff --git a/drivers/mtd/nand/spi/core.c b/drivers/mtd/nand/spi/core.c
index f0ba92a09ae5..3f1d09200f74 100644
--- a/drivers/mtd/nand/spi/core.c
+++ b/drivers/mtd/nand/spi/core.c
@@ -573,6 +573,7 @@ static int spinand_write_page(struct spinand_device *spinand,
        if (ret)
                return ret;

+       mdelay(1);
        ret = spinand_wait(spinand, &status);
        if (!ret && (status & STATUS_PROG_FAILED))
                ret = -EIO;
```

Включите CONFIG_MTD_TESTS=m. Модули: mtd_readtest.ko, mtd_torturetest.ko. Передайте тестовые модули:

```text
adb push mtd_readtest.ko mtd_torturetest.ko /data
```

Команды чтения/записи:

<!-- Chinese baseline PDF p.55 -->

```text
insmod /data/mtd_readtest.ko dev=0 cycles_count=10                  # 读测试，可以通过修改 cycles_count 来调整测试时⻓
rmmod mtd_readtest                                                  # 读测试清除，如需重新测试，重新 insmod

insmod /data/mtd_torturetest.ko dev=0 check=0 cycles_count=10 random_pattern=1      # 写测试，可以通过修改 cycles_count 来调整测试时⻓
rmmod mtd_torturetest                                               # 写测试清除，如需重新测试，重新 insmod
```

Для чтения выберите большой раздел с корректными данными, чтобы видеть переключения уровней. Для записи — свободный раздел, чтобы не нарушить работу системы.

### 9.7 Сбой обновления или загрузки после замены Flash на поддерживаемую микросхему

Новые flash-компоненты обычно требуют обновления драйверов; запросите доступ Redmine у RK и синхронизируйте патчи хранения.

### 9.8 Периодические сбои загрузки или контрольных сумм файловой системы

Попробуйте изменить сигналы; если нагрузка проходит, измерьте и оптимизируйте качество. Снизьте частоту по настройке ядра. Для одной линии MTD задайте spi-rx-bus-width=1 узла spiflash DTS: чтение/запись одной линией. Далее патч rkflash SPI NAND:

```text
diff --git a/drivers/rkflash/sfc_nand.c b/drivers/rkflash/sfc_nand.c
index 4accf3d791c6..98b1cfecc821 100644
--- a/drivers/rkflash/sfc_nand.c
+++ b/drivers/rkflash/sfc_nand.c
@@ -1179,6 +1179,8 @@ u32 sfc_nand_init(void)
                return -ENOMEM;
        }

+       p_nand_info->feature &= ~(FEA_4BIT_READ | FEA_4BIT_PROG); // 单线写、单线读
+       // p_nand_info->feature &= (~FEA_4BIT_PROG); // 单线写、四线读
        if (p_nand_info->feature & FEA_4BIT_READ) {
                if ((p_nand_info->has_qe_bits && sfc_nand_enable_QE() == SFC_OK) ||
                    !p_nand_info->has_qe_bits) {
```

Патч одной линии rkflash SPI NOR:

```text
diff --git a/drivers/rkflash/sfc_nor.c b/drivers/rkflash/sfc_nor.c
index c38801b4fb0d..4badff4249ac 100644
--- a/drivers/rkflash/sfc_nor.c
+++ b/drivers/rkflash/sfc_nor.c
@@ -678,7 +678,9 @@ static int snor_parse_flash_table(struct SFNOR_DEV *p_dev,
                        p_dev->write_status = snor_write_status1;
                else if (i == 2)
                        p_dev->write_status = snor_write_status2;

+               g_spi_flash_info->feature &= ~(FEA_4BIT_READ | FEA_4BIT_PROG); // 单线写、单线读
+               // g_spi_flash_info->feature &= ~(FEA_4BIT_PROG); // 单线写、四线读
                if (g_spi_flash_info->feature & FEA_4BIT_READ) {
                        ret = SFC_OK;
                        if (g_spi_flash_info->QE_bits)
```

### 9.9 Монтирование UBIFS с ro не делает систему полностью доступной только для чтения

Даже при ro алгоритмы UBIFS в фоне могут стирать/записывать NAND. Для действительно read-only используйте SquashFS на UBI Block.

### 9.10 Быстрая загрузка ROM из SPI NOR

Быстрый старт ROM RK SPI NOR: usbplug ПК автоматически добавляет bootconfig к корректному idblock Loader. Программатор по умолчанию: готовый образ без bootconfig не поддерживает быстрый ROM; при первом запуске ядра idb_bootconfig добавляет данные с одним стиранием/записью idblock. Альтернатива: добавьте BOOT0_PARAM в INI упаковки rkbin/RKBOOT для включения bootconfig в idblock.img. Параметры возьмите из UART-журнала записи ПК, например:

```text
[BOOT0_PARAM]
WORD_0=0x524f4e53
WORD_1=0x0
WORD_2=0xe
WORD_3=0x326b0203
WORD_4=0x90dd820
WORD_5=0x2000000
WORD_6=0x0
WORD_7=0x0
WORD_8=0x0
WORD_9=0x0
```

<!-- Chinese baseline PDF p.57 -->

Добавьте данные в INI:

```text
diff --git a/RKBOOT/RV1103BMINIALL.ini b/RKBOOT/RV1103BMINIALL.ini
index de54116c2106..4b27d284c5f4 100644
--- a/RKBOOT/RV1103BMINIALL.ini
+++ b/RKBOOT/RV1103BMINIALL.ini
@@ -25,3 +25,14 @@ NEWIDB=true
 471_RC4_OFF=true
 RC4_OFF=true
 CREATE_IDB=true
+[BOOT0_PARAM]
+WORD_0=0x524f4e53
+WORD_1=0x0
+WORD_2=0xe
+WORD_3=0x326b0203
+WORD_4=0x90dd820
+WORD_5=0x2000000
+WORD_6=0x0
+WORD_7=0x0
+WORD_8=0x0
+WORD_9=0x0
```

### 9.11 Другие способы диагностики

Прочие вопросы: Rockchip_Developer_FAQ_Storage_CN.pdf (Redmine: Rokchip_Developer_FAQ_Storage_CN.pdf). Основы flash: главы введения и проверки компонентов в Rockchip_Application_Notes_Storage_CN.pdf (Redmine: Rockchip_Application_Notes_Storage_CN). Драйверы двух накопителей: Rockchip_Developer_Guide_Dual_Storage_CN.pdf, тот же путь Redmine.

## 10 Ссылки приложения

[1] UBI FAQ: http://www.linux-mtd.infradead.org/faq/ubi.html
[2] UBIFS FAQ: http://www.linux-mtd.infradead.org/faq/ubifs.html#L_lebsz_mismatch
[3] MTD FAQ: http://www.linux-mtd.infradead.org/faq/general.html

### Дополнения английского оригинала и точные различия

Английский §6.1.4 уточняет: параметр ubinize `-p, --peb-size` обязателен, размер физического блока стирания задаётся в bytes, KiB или MiB. `-s, --sub-page-size` задаёт минимальную единицу ввода-вывода для заголовков UBI, например подстраницу NAND; по умолчанию она равна минимальной единице ввода-вывода.

Английский пример чтения §5.3.2: `nanddump -o -n --bb=skipbad /dev/mtd3 -f /userdata/boot_read.img -l 0xXXXX`; китайский читает `/dev/mtd4`. Английский §5.3.4: `nanddump --bb=skipbad /dev/mtd3 -f /userdata/boot_read.img -l 0xXXXX`; китайская строка не содержит `-f`. Основные примеры сохранены по китайскому оригиналу. До применения проверьте целевой раздел и параметры установленной программы; исполнимость примеров не проверена.

В английской таблице программатора ENV размер idblock Size(block) равен `0x6`, в китайской — `0x3`; PC-адрес xxx.img равен соответственно `0x3E000` и `0x58C0000`. В обоих оригиналах Programmer Start(block) — `0x2c6`. Таблицы сохраняют китайские значения; ни одна схема не считается проверенной.

{% endraw %}
