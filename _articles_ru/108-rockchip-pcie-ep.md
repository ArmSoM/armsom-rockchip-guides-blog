---
title: "Руководство Rockchip PCIe EP Linux: загрузка, BAR, прошивка и сброс"
description: "Руководство Rockchip PCIe EP Linux: загрузка, BAR, прошивка и сброс — RK-KF-YF-C51 V3.2.0; RK3588, RK3568."
translation_key: "108-rockchip-pcie-ep"
slug: "108-rockchip-pcie-ep"
lang: "ru"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, PCIe, RK3588, RK3568]
excerpt: "Руководство Rockchip PCIe EP Linux: загрузка, BAR, прошивка и сброс — RK-KF-YF-C51 V3.2.0; RK3588, RK3568."
---

{% raw %}

Полный перевод технического текста китайского RK-KF-YF-C51 V3.2.0. Область оригинала: RK3588 Linux 6.1/5.10; RK3568 Linux 6.1/5.10/4.19; RT-Thread реализован только на стороне RK PCIe EP. Английского PDF нет, во всех языках используются китайские оригинальные рисунки. Это справочник платформы: проверьте разводку PCIe, питание, PERST#/WAKE#, SDK/BSP, Loader и ядро конкретной платы ArmSoM. Аппаратная проверка ArmSoM не выполнена.

> Сохранены для проверки: арифметическое противоречие “1MB(2^0) — 8EB(2^20)”; SPL_PCIE_EP_SUPPOR отличается от SUPPORT в коде; reset-gpios и wake-gpios оба используют gpio3 13; конец §1.4 неполон, диагностика §7.2.2 неоднозначна, §7.2.3 пишет Host Reset. Не применяйте примеры без проверки. Запись, OTP, разделы и сброс могут привести к потере данных; команды не выполнялись.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

<!-- Source PDF p.5 -->

## 1 Схемы загрузки

### 1.1 Сравнение схем загрузки

| Схема | Преимущества | Недостатки |
| --- | --- | --- |
| PCIe Boot | Быстрая инициализация PCIe; без накопителя; прошивка с хоста | Мало настраиваемых параметров PCIe; ограниченная совместимость |
| Flash Boot с PCIe Bin и EP Boot | Обычный RC; полная настройка PCIe; малый накопитель; прошивка с хоста | Относительно сложный процесс ПО |
| Flash Boot с PCIe Bin | Обычный RC; полная настройка PCIe; локальный накопитель | Большой накопитель |
| Common Boot | Простейший процесс ПО; локальный накопитель | Большой накопитель; только определённые RC |

### 1.2 PCIe Boot

PCIe Boot — логика загрузки прошивки PCIe, встроенная в ROM. Она выполняет перечисление PCIe и загрузку прошивки: быстрая инициализация PCIe, отсутствие накопителя и загрузка с хоста. Поддержку чипа проверьте в разделе «Характеристики межсоединения PCIe RK SOC». Код инициализации зафиксирован в масочном ROM, поэтому большинство параметров не меняется; через OTP доступны лишь определённые настройки PCIe. Рекомендуется среда с фиксированным типом RC. Далее приведена схема.

<!-- Source PDF p.6 -->

![Схема китайского оригинала, стр. 6](/docs/rockchip-pcie-ep/assets/cn-p006-figure-01.png)

*Схема китайского оригинала, стр. 6*

Примечание: красные стрелки обозначают загрузку прошивки с хоста. Основной процесс: BootROM выполняет перечисление PCIe и реализует PCIe Boot; хост загружает Pre-Loader, который затем запускается. Loader выполняет несколько ранних компонентов: обычно ddr.bin инициализирует DDR, а loader.bin реализует EP Boot. Хост загружает firmware с последующими прошивками, алгоритмами и другими данными, после чего запускается последующая прошивка. В Linux loader.bin соответствует spl.bin. OS — последующая прошивка, запускающая пакет межсоединения chips connectr в kernel/userspace.

### 1.3 Flash Boot с PCIe Bin и EP Boot

Flash Boot — схема загрузки RK SOC из SPI Flash. На основе SPI Flash Boot этап Loader объединяет PCIe Bin для быстрой инициализации PCIe и логику EP Boot для передачи последующей прошивки хостом. Далее приведена схема.

<!-- Source PDF p.7 -->

![Схема китайского оригинала, стр. 7](/docs/rockchip-pcie-ep/assets/cn-p007-figure-01.png)

*Схема китайского оригинала, стр. 7*

SPI Flash используется как загрузочный накопитель, PCIe Bin обеспечивает быструю инициализацию PCIe, а хост передаёт последующую прошивку. Поддерживается подключение к обычному ПК.

Красные стрелки обозначают загрузку прошивки хостом. BootROM загружает и запускает PCIe Bin/Pre-Loader. PCIe Bin выполняет перечисление PCIe. Loader запускает ранние компоненты: обычно pcie.bin для перечисления PCIe, ddr.bin для инициализации DDR и loader.bin с EP Boot. Хост загружает fw packet с последующей прошивкой, алгоритмами и другими данными, затем запускается последующая прошивка. В Linux loader.bin — это spl.bin. OS запускает пакет chips connect в kernel/userspace.

### 1.4 Flash Boot с PCIe Bin

Flash Boot — схема загрузки RK SOC из SPI Flash. На этапе Loader PCIe Bin обеспечивает быструю инициализацию PCIe и поддержку обычных ПК. Поддерживается локальное хранение: при одном накопителе последующая прошивка загружается из SPI Flash; при двух накопителях SPI Flash служит загрузочным, а NVMe/eMMC — основным накопителем большой ёмкости, откуда

<!-- Source PDF p.8 -->

загружается последующая прошивка. Подробнее см. Rockchip_Developer_Guide_Dual_Storage_CN.pdf. Далее приведена схема.

![Схема китайского оригинала, стр. 8](/docs/rockchip-pcie-ep/assets/cn-p008-figure-01.png)

*Схема китайского оригинала, стр. 8*

Красные стрелки обозначают загрузку прошивки хостом. BootROM загружает PCIe Bin/Pre-Loader; PCIe Bin выполняет перечисление. Loader запускает pcie.bin для перечисления, ddr.bin для DDR и loader.bin для последующей прошивки. OS запускает chips connect в kernel/userspace. Поддерживаются два накопителя: SPI Flash для загрузки, NVMe/eMMC как основной; см. Rockchip_Developer_Guide_Dual_Storage_CN.pdf. Последняя фраза оригинала говорит о расширении до SPI Nand Flash Boot и переносе загрузки прошивки RC на EP, но объяснение не завершено.

### 1.5 Common Boot

Common Boot — общая схема загрузки RK SOC: инициализация и перечисление PCIe завершаются на этапе ядра. Быстрая инициализация PCIe отсутствует, поэтому подключение к обычному ПК не поддерживается. Подходит для соединения чипов RK, нестандартных EP-плат с независимым питанием и настраиваемых RC-плат. Далее приведена схема.

<!-- Source PDF p.9 -->

![Схема китайского оригинала, стр. 9](/docs/rockchip-pcie-ep/assets/cn-p009-figure-01.png)

*Схема китайского оригинала, стр. 9*

## 2 Настройка аппаратуры

Подробную аппаратную схему можно запросить у RK, например RK_PCIeEP_DEMO_RK3588_LP4XD200P232SD8_V10_20230323RZF.pdf для RK3588. Аппаратную часть PCIe EP следует дополнительно адаптировать к форм-фактору изделия.

## 3 Настройка DTS

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

Особые настройки соединения чипов RK с независимым питанием (для стандартных карт не требуются).

1. reset-gpios = &lt;&gpio3 13 GPIO_ACTIVE_HIGH&gt;; Обязательная настройка входа сброса PERST# интерфейса PCIe. Для устройств в разъёме и припаянных устройств найдите этот вывод на схеме и правильно настройте; иначе стабильное установление соединения может оказаться невозможным.

2. wake-gpios = &lt;&gpio3 13 GPIO_ACTIVE_HIGH&gt;; Обязательная настройка выхода WAKE# интерфейса PCIe. Для устройств в разъёме и припаянных устройств правильно определите и настройте вывод; иначе уведомление хоста при выходе из сна невозможно.

## 4 Настройка Menuconfig

```text
CONFIG_PCIE_DW_ROCKCHIP_EP=y
# CONFIG_STRICT_DEVMEM is not set   #建议开发阶段关闭STRICT_DEVMEM限制，⽅便使⽤io命令调试
```

## 5 Настройка драйвера

Драйвер устройства PCIe EP (Endpoint) работает на стороне Root Complex (RC), управляет передачей по шине и предоставляет приложениям необходимые интерфейсы ядра. Далее приведены настройки RK RC Kconfig.

```text
CONFIG_PCIE_FUNC_RKEP=y
```

Универсальный драйвер RC-FUNC: пакет RK Chips Connect поддерживает сборку модуля KO; см. chips_connect/patch-kernelx.xx/通用RC-FUNC驱动/.

## 6 Другие настройки ПО

### 6.1 Примечания по разработке ПО

Некоторые настройки EP-карты взаимосвязаны: при изменении обновите все связанные места. Для размера BAR это этап PCIe Bin (схема с двумя накопителями) и этап SPL.

<!-- Source PDF p.11 -->

### 6.2 Настройка этапа PCIe Bin

PCIe bin инициализирует только контроллер PCIe в режиме EP, до dram.bin. Для настройки предоставляются готовый pcie.bin и исходный код. Файл находится в SDK/rkbin/bin/rkxx/, исходники — в patch-*/bootloader. Рекомендуется менять параметры pcie.bin непосредственно; сборка из исходников нужна для специальных изменений.

#### 6.2.1 Динамическая настройка pcie.bin

pcie.bin позволяет изменять зарезервированную область конфигурации в бинарном файле: PCIe Generation, PCIe lanes, скорость UART, PCIe vendor id и PCIe device id. Используется rkbin/tools/pcie_idb_config.sh; команды приведены далее.

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

Если доступных настроек недостаточно, измените исходный код.

#### 6.2.2 Сборка pcie.bin из исходников

Исходники зависят от инструментов rkbin. Распакуйте их рядом с rkbin/ либо измените пути boot_merger и programmer_image_tool в tools/mk_pcie_idb.sh. Цепочка компиляции указана в src/platform/common/GCC/Cortex-A.mk:

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

Команда сборки RK3588:

```text
./tools/mk_pcie_idb.sh RK3588
```

RK3568:

```text
./tools/mk_pcie_idb.sh RK3588
```

Выходной файл: pcie_idb.img

##### 6.2.2.1 Настройка BSP

Пример RK3588: src/platform/RK3588/bsp/platform.h

```text
#define BOOT_USING_UART_BAUD 1500000                      // 修改波特率，⽀持1500000或115200
```

##### 6.2.2.2 Настройки BAR по умолчанию

Исходник: src/driver/pcie/pcie_ep.c. Настройки Demo можно менять, кроме BAR4: BAR0: 32bits 4MB, поток команд; BAR2: 64bits 64MB, поток данных; BAR4: 32bits 1MB, регистры PCIe EP, менять нельзя. Смещения BAR4 для прямого доступа RC: 0: DMA; 0x2000: iATU;

<!-- Source PDF p.13 -->

0x20000: таблица MSI-X

##### 6.2.2.3 Настройка размера BAR

PCIe_EP_Init() задаёт размеры BAR через функцию resize BAR контроллера. В BAR SIZE выражение (bar_id * 0x8) выбирает BAR ID, bit[13:8] задаёт размер как 2^n. В оригинале указан диапазон от 1MB (2^0) до 8EB (2^20). Настройки BAR0–5:

```text
writel(0x2c0, resbar_base + 0x8 + 0 * 0x8);
writel(0x2c0, resbar_base + 0x8 + 1 * 0x8);
writel(0x6c0, resbar_base + 0x8 + 2 * 0x8);
writel(0x6c0, resbar_base + 0x8 + 3 * 0x8);
writel(0x0c0, resbar_base + 0x8 + 4 * 0x8); /* wired register */
writel(0x6c0, resbar_base + 0x8 + 5 * 0x8);
```

Настройте атрибуты BAR предопределёнными макросами: 32bit или 64bit, с PREFETCH либо без него.

```text
    rockchip_pcie_ep_set_bar_flag(dbi_base, 0, PCI_BASE_ADDRESS_MEM_TYPE_32);
    rockchip_pcie_ep_set_bar_flag(dbi_base, 2, PCI_BASE_ADDRESS_MEM_PREFETCH |
PCI_BASE_ADDRESS_MEM_TYPE_64);
    rockchip_pcie_ep_set_bar_flag(dbi_base, 4, PCI_BASE_ADDRESS_MEM_TYPE_32);
```

Отключите неиспользуемые BAR:

```text
//writel(0x0, dbi_base + 0x100000 + 0x10 + 0 * 4);
writel(0x0, dbi_base + 0x100000 + 0x10 + 1 * 4); /* BAR1 disabled */
//writel(0x0, dbi_base + 0x100000 + 0x10 + 2 * 4);
//writel(0x0, dbi_base + 0x100000 + 0x10 + 3 * 4);
//writel(0x0, dbi_base + 0x100000 + 0x10 + 4 * 4);
writel(0x0, dbi_base + 0x100000 + 0x10 + 5 * 4);  /* BAR5 disabled */
```

Размер BAR этапа PCIe Bin — связанная настройка. Одновременно обновите размеры BAR в PCIe Bin (два накопителя), SPL и Kernel.

##### 6.2.2.4 Настройка отображения BAR

Пример RK3588: src/platform/RK3588/bsp/platform.h

```text
#define BOOT_USING_PCIE_EP_BAR0_CPU_ADDRESS 0x3C000000    // 调整Bar0映射地址
```

Реализация в коде:

<!-- Source PDF p.14 -->

```text
HAL_PCIE_InboundConfig(pcie, 0, 0, BOOT_USING_PCIE_EP_BAR0_CPU_ADDRESS);
```

Отображение BAR на этапе PCIe.bin независимо от Kernel; при необходимости можно отображать разные области.

##### 6.2.2.5 Настройка режима PHY

По умолчанию RK3588 объединяет phy0/1 для Gen3x4. Оригинал указывает разделение на Gen3x2, Gen3x2, Gen3x1. Пример RK3588 PCIe PHY 3x2:

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

Пример RK3588 PCIe PHY 3x1:

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

#### 6.2.3 Упаковка и запись PCIe Bin

##### 6.2.3.1 Запись программными инструментами

1. Преобразуйте pcie.bin в pcie_idb.img.

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

2. При раздельной записи добавьте раздел pcie_idb: начальный адрес eMMC flash 0x40, SPI flash 0x100. В config.ini инструмента включите CLOSE_CHECK_IDB=TRUE. Переведите плату в Maskrom и нажмите кнопку записи.

3. Для полного пакета добавьте pcie_idb в таблицу разделов. Пример относится к eMMC; для SPI NAND отличается адрес.

```text
CMDLINE:
mtdparts=rk29xxnand:0x00000400@0x00000040(pcie_idb),0x00000800@0x00002000(security),0x00002000@0x00004000(uboot),0x00010000@0x00006000(boot),0x00064000@0x00016000(rootfs),-@0x0007a000(userdata:grow)
```

Измените package-file: tools/linux/Linux_Pack_Firmware/rockdev/rk3588-package-file-nvr-emmc / spi-nand.

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

Запустите build_emmc.sh для сборки update.img и запишите образ.

<!-- Source PDF p.16 -->

##### 6.2.3.2 Запись программатором

См. запись прошивки EP-карты.

### 6.3 Настройка этапа SPL

#### 6.3.1 Настройка Kconfig

Эта функция SPL имеет три пункта Kconfig ниже. Для EP Boot включите все три; без EP Boot достаточно SPL_PCIE_EP_SUPPOR (написание оригинала).

```text
CONFIG_SPL_PCIE_EP_SUPPORT=y
CONFIG_SPL_RAM_SUPPORT=y
CONFIG_SPL_RAM_DEVICE=y
```

#### 6.3.2 Настройки BAR по умолчанию

Настройки Demo, изменяемые кроме BAR4: BAR0: 32bits 4MB, поток команд; BAR2: 64bits 64MB, поток данных; BAR4: 32bits 1MB, регистры PCIe EP, менять нельзя. Смещения BAR4 для прямого доступа RC: 0: DMA; 0x2000: iATU; 0x20000: таблица MSI-X.

#### 6.3.3 Настройка размера BAR

pcie_bar_init() задаёт размер через resize BAR. В регистре offset+0x8 биты bit[13:8] задают размер 2^n; оригинал указывает от 1MB (2^0) до 8EB (2^20):

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

Атрибуты BAR задаются предопределёнными макросами: 32bit/64bit и PREFETCH.

```text
        rockchip_pcie_ep_set_bar_flag(dbi_base, 0, PCI_BASE_ADDRESS_MEM_TYPE_32);
        rockchip_pcie_ep_set_bar_flag(dbi_base, 2, PCI_BASE_ADDRESS_MEM_PREFETCH |
PCI_BASE_ADDRESS_MEM_TYPE_64);
        rockchip_pcie_ep_set_bar_flag(dbi_base, 4, PCI_BASE_ADDRESS_MEM_TYPE_32);
```

Отключите неиспользуемые BAR:

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

Размер BAR в SPL связан с размерами BAR в PCIe Bin (два накопителя), SPL и Kernel; обновляйте вместе.

#### 6.3.4 Настройка отображения BAR

pcie_inbound_config() отображает каждый BAR во внутреннюю область памяти. Для смены адресов измените RKEP_BAR0_ADDR и RKEP_BAR2_ADDR.

```text
/* BAR0: RKEP_BAR0_ADDR */
writel(RKEP_BAR0_ADDR, base + PCIE_ATU_CPU_ADDR_LOW);
writel(0, base + PCIE_ATU_CPU_ADDR_HIGH);
writel(0, base + PCIE_ATU_UNR_REGION_CTRL1);
/* PCIE_ATU_UNR_REGION_CTRL2 */
writel(PCIE_ATU_ENABLE | PCIE_ATU_BAR_MODE_ENABLE | (0 << 8),
       base + PCIE_ATU_UNR_REGION_CTRL2);
```

Отображение BAR в SPL независимо от Kernel; можно отображать разные области.

#### 6.3.5 Настройка режима PHY

Demo использует контроллер 0xfe150000 в PCIe3x4, соответственно PHY работает с четырьмя линиями. PHY допускает разделение; для другого режима измените pcie_cru_init(). Для 2lane+2lane замените PHY_MODE_PCIE_AGGREGATION на PHY_MODE_PCIE_NANBNB либо другое подходящее значение:

<!-- Source PDF p.18 -->

Пример RK3588 PCIe PHY 3x2:

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

Пример RK3588 PCIe PHY 3x1:

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

#### 6.3.6 Настройка EP Boot

EP ожидает прошивку и запускает её, что требует согласованного протокола с RC и расположения прошивок между этапами BootLoader. Загрузка выполняется pcie_wait_for_fw(), расположение последующих образов задаёт pcie_update_atags(). Изменяйте адреса ниже только при согласованных командах и адресах RC/EP и позициях между этапами. Без понимания полного процесса ничего не меняйте. RC сначала загружает образы в заданные места, затем посылает команду запуска.

1. Согласованные адреса загрузки двух образов:

<!-- Source PDF p.19 -->

| Прошивка | Формат | Содержимое | Адрес загрузки |
| --- | --- | --- | --- |
| uboot.img | FIT | ATF и U-Boot | BAR2+0 |
| boot.img | FIT | Kernel, DTB, ramdisk | BAR2+0x400000 |

2. Команда запуска прошивки:

| Команда | Расположение | Значение | Действие |
| --- | --- | --- | --- |
| CMD_LOADER_RUN | BAR0 + 0x400 | 0x524b4501 | Запустить загруженную прошивку |

Из двух образов от RC файл uboot.img разбирает и запускает SPL (среда EP Boot). Специальный RK RAM_PARTITION передаёт U-Boot расположение boot.img. pcie_update_atags() задаёт начало и SIZE раздела boot в RAM. BAR2 по умолчанию 64M: первые 4M для uboot.img, оставшиеся 60M для boot.img, чтобы CPU RC мог записывать непосредственно через BAR2. Если места мало, RC может использовать DMA EP без ограничения размера BAR2; согласованно обновите size в RAM_PARTITION.

#### 6.3.7 Настройка SRNS

Для схем с опорной частотой SRNS включите следующий макрос. EP использует внутреннюю опорную частоту 100MHz и не зависит от внешнего генератора.

```text
/* SRNS: Use Seperate refclk(internal clock) instead of from RC */
// #define PCIE_ENABLE_SRNS_PLL_REFCLK
```

Настройки SPL SRNS связаны: одновременно измените PCIe Bin SRNS (два накопителя), SPL SRNS-size (формулировка оригинала) и Kernel SRNS.

### 6.4 Настройка этапа Kernel

#### 6.4.1 Настройка размера BAR

rockchip_pcie_resize_bar задаёт размеры BAR через resize BAR. В регистре offset+0x8 поле bit[13:8] задаёт размер 2^n; оригинал указывает 1MB (2^0) — 8EB (2^20). Для атрибутов 32bit/64bit и PREFETCH используйте предопределённые макросы:

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

Отключите неиспользуемые BAR:

```text
/* Disable BAR1 BAR5*/
bar = BAR_1;
dw_pcie_writel_dbi(pci, PCIE_TYPE0_HDR_DBI2_OFFSET + 0x10 + bar * 4, 0);
bar = BAR_5;
dw_pcie_writel_dbi(pci, PCIE_TYPE0_HDR_DBI2_OFFSET + 0x10 + bar * 4, 0);
```

Размер BAR ядра связан с PCIe Bin (два накопителя), SPL и Kernel; обновляйте вместе. Отображение BAR ядра независимо от SPL и может использовать другие области.

#### 6.4.2 Настройка отображения BAR

Каждый BAR отображается во внутреннюю область памяти; целевые адреса меняются в DTS.

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

Дополнительные отображения памяти bar1/bar5 поддерживаются и автоматически включают bar1/5. Если PCIe инициализируется в PCIe Bin/SPL, закомментируйте отключение bar1/5 согласно настройке размеров BAR.

<!-- Source PDF p.21 -->

#### 6.4.3 Настройка SRNS

SRNS добавляется патчем 0001-TEST-kernel5.10-rk3588-SRNS.patch из пакета разработки. Kernel SRNS связан с PCIe Bin SRNS (два накопителя) и SPL SRNS-size (формулировка оригинала); изменяйте их совместно.

### 6.5 Сборка прошивки EP-карты

Примените патчи по описанию каталога patch и выберите сценарий. Flash Boot с PCIe Bin, один накопитель: добавьте pcie_idb и обновите pcie_idb.img; добавьте normal_idb и автоматически обновите normal_idb.img через MiniLoaderAll.bin; остальные образы и update.img собираются обычно. Два накопителя: следуйте главе RK PCIe EP в Rockchip_Developer_Guide_Dual_Storage_CN.pdf. SDK по умолчанию не упаковывает такую прошивку в update.img. Используйте tools/dual_storage: скопируйте образы согласно tools/dual_storage/README.txt и запустите build.sh. Flash Boot с PCIe Bin и EP Boot для обычного ПК: добавьте pcie_idb/pcie_idb.img и normal_idb/normal_idb.img (последний автоматически через MiniLoaderAll.bin); остальное передаёт хост. Для RK RC можно исключить PCIe Bin: EP Boot реализуется SPL, накопитель EP содержит только Miniloader, остальное передаёт хост. Common Boot: обычная сборка образов разделов и update.img без специальных настроек.

<!-- Source PDF p.22 -->

### 6.6 Запись прошивки EP-карты

Один накопитель: запись совпадает с обычной прошивкой; используйте раздел записи документации выпуска чипа. Два накопителя: см. «Упаковка прошивки RK PCIe EP с двумя накопителями» в Rockchip_Developer_Guide_Dual_Storage_CN.pdf.

### 6.7 OTA EP-карты

При обновлении разделов ядро создаёт узлы устройств по таблице разделов; пользовательский слой записывает узлы /dev/. Можно использовать RK OTA через recovery либо собственную реализацию записи этих узлов.

1. OTA Flash Boot с PCIe Bin. Один накопитель: обычная OTA по docs\Linux\Recovery\Rockchip_Developer_Guide_Linux_Recovery_CN.pdf. Два накопителя: раздел «OTA RK PCIe EP с двумя накопителями» в Rockchip_Developer_Guide_Dual_Storage_CN.pdf.

2. OTA Flash Boot с PCIe Bin и EP Boot. В EP Boot есть только раздел loader, который необходимо добавить в таблицу. NOR: см. EP OTA &gt; два накопителя &gt; настройка раздела Uboot NOR. EMMC: см. раздел EMMC и добавьте loader в таблицу. RK OTA не поддерживает отдельное обновление loader; нужна собственная реализация. Обновлять loader не рекомендуется из-за высокого риска. MiniLoaderAll.bin и parameter.txt нельзя непосредственно записывать в узлы /dev/; сначала преобразуйте их в бинарные файлы.

## 7 Устранение неисправностей

### 7.1 Диагностика загрузки EP-карты

Вывод этапа SPL EP-карты:

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

Если выполнение останавливается на «RKEP: Init PCIe EP», обычно произошла ошибка перечисления. Проверьте опорную частоту EP, питание 12V и снятие PERST#. Далее вывод этапа Kernel.

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

Вывод модуля ядра драйвера EP:

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

### 7.2 Обработка ошибок

Нестабильность системы и внешние помехи могут вызывать сбои. PCIe включает защиту от помех, CRC на уровнях протокола и повторную передачу при ошибках; оригинал описывает это как обеспечение правильных выходных данных контроллера. Ошибки, которые сам контроллер PCIe не устраняет, требуют дополнительных мер для работы устройства.

<!-- Source PDF p.24 -->

#### 7.2.1 Состояние EP

На EP рекомендуется небольшая программа состояния, обновляемая по tick. RC читает её для проверки работы EP. В Demo часть BAR0 зарезервирована для обновления и чтения состояния.

#### 7.2.2 Watchdog

RK3588 имеет watchdog для автоматического сброса при сбоях. Его можно обслуживать из программы состояния, чтобы остановка программы приводила к сбросу. Оригинал одновременно говорит о неисправности PCIe EP и зависании из-за других модулей; диагностическая формулировка требует проверки. ПО RC не знает о самостоятельном сбросе EP. Физический уровень PCIe восстановит связь, но EP должен восстановить настроенные RC регистры, включая адреса BAR.

#### 7.2.3 Hot Reset

В тексте раздела Hot Reset сигнал назван Host Reset. Он определён PCIe и передаётся по обычным линиям данных. Контроллер EP обнаруживает его и вызывает прерывание. Аппаратура автоматически реагирует на HotReset сбросом регистров BAR, поэтому обработчик должен повторно инициализировать EP и восстановить BAR и ATU.

#### 7.2.4 Warm Reset (PERST)

PERST независимо сбрасывает PCIe. При перезапуске x86 наблюдалось срабатывание PERST без отключения питания слота. Поэтому EP должен выполнять полный сброс. Рекомендация RK — прямое подключение к NPOR RK3588 и PMIC для эффекта сброса по питанию. Если RC управляем и требования мягче, PERST можно сделать GPIO-прерыванием и программно вызвать global reset RK3588.

#### 7.2.5 Cold Reset (Power On Reset)

Сброс по питанию соответствует запуску устройства.

#### 7.2.6 Сброс и сон/пробуждение при независимом питании соединённых чипов RK

Требования: RC нужен WAKE# GPIO в домене PMU IO с пробуждением GPIO независимо от PCIe. Увеличьте rockchip,wait-for-link-ms с учётом фактического времени запуска EP; см. Rockchip_Developer_Guide_PCIe_CN.pdf. EP должен реализовать WAKE# и PERST# GPIO по специальным настройкам независимого питания в разделе Kernel.

<!-- Source PDF p.25 -->

Выведите сигнал сброса EP для аппаратного восстановления и включите Watchdog для программного. Из-за индивидуальных аппаратно-программных процессов эта эталонная схема требует специальных стресс-тестов; адаптируйте её к проекту. Сброс RC при питании EP: RC уведомляет EP, деинициализирует сервисы (см. программные сообщения), сбрасывается и повторно инициализирует сервисы. Сброс EP при питании RC: RC уведомляет EP, сервисы деинициализируются, EP сбрасывается, затем повторная инициализация с PCIe rescan на RC. Сон RC при питании EP: уведомление EP, деинициализация, сон/пробуждение RC, инициализация с rescan. Сон EP при питании RC: EP уведомляет RC, деинициализация, сон/пробуждение EP, инициализация с rescan RC. При сне обоих соблюдайте порядок, например RC сон → EP сон → EP пробуждение → RC пробуждение. EP уведомляет RC о переходе в сон и будит его сигналом WAKE#.

{% endraw %}
