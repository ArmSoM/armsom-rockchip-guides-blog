---
title: "Полное руководство Rockchip по двум накопителям: NOR + EMMC/NVMe, PCIe EP, упаковка и OTA"
description: "Полное руководство Rockchip по двум накопителям: NOR + EMMC/NVMe, PCIe EP, упаковка и OTA — RK-KF-YF-461 V1.5.1; kernel 4.19+, BOOTROM, U-Boot, Vendor Storage."
translation_key: "102-rockchip-dual-storage"
slug: "102-rockchip-dual-storage"
lang: "ru"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "Dual Storage", "NVMe", "SPI NOR", "EMMC", "PCIe EP", "OTA"]
excerpt: "Полное руководство Rockchip по двум накопителям: NOR + EMMC/NVMe, PCIe EP, упаковка и OTA — RK-KF-YF-461 V1.5.1; kernel 4.19+, BOOTROM, U-Boot, Vendor Storage."
---

{% raw %}

# Полное руководство Rockchip по двум накопителям: NOR + EMMC/NVMe, PCIe EP, упаковка и OTA

Статья полностью сохраняет техническое содержание RK-KF-YF-461 V1.5.1: китайские стр. 4–18, английские 5–19. Главы соответствуют; примеры и код следуют китайскому оригиналу, EN/RU/DE переведены полностью. Китайская версия использует пять китайских рисунков, остальные — пять соответствующих английских. Область источника: микросхемы с несколькими накопителями с независимыми I/O, ядро 4.19 и выше; это не подтверждение каждой платы ArmSoM. Проверьте SoC, независимость I/O, топологию NOR/EMMC/NVMe/SATA, питание, SDK/BSP, Loader/U-Boot, ядро, ветку Android, единицы разметки и драйверы. Патчи RK3588s EVB1 и RK3568 EVB1 — примеры плат производителя, не готовые патчи ArmSoM и не измерения. Прошивка, OTA, запись регистров и аппаратные проверки не выполнялись.

> Важные проблемы оригинала: в §7.1 vnvm и uboot начинаются с одного `0x00000c00` сектора и перекрываются; байтовое смещение uboot в §7.2 также не совпадает. Значения mtdparts SPI NAND §6.2 похожи на секторные и требуют сверки с другими байтовыми примерами и указанными единицами. Все сохранены без догадок; не использовать напрямую для производственной разметки или OTA. Скрипт удаляет временные файлы; страница лишь показывает его. Сначала сохраните данные и идентичность устройства.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel) · [EDITORIAL-NOTES](/docs/rockchip-dual-storage/EDITORIAL-NOTES.md)

<!-- Chinese baseline PDF p.4 -->

## 1. Введение

<!-- Chinese baseline PDF p.4 -->

Поддержка нескольких накопителей: SoC RK обычно имеют несколько контроллеров с независимыми I/O. Например, RK3568 поддерживает NOR flash и eMMC, RK3588 — NOR flash и PCIe SSD. Компоненты классифицируются по возможности обнаружения кодом масочного ROM:

- Bootable: eMMC, SPI flash, параллельная NAND.
- Non-bootable: NVMe SSD и SATA. Система только с ними не загружается масочным ROM.

Для основного non-bootable накопителя нужен bootable-компонент, например NOR + NVMe SSD/SATA для большой ёмкости. Другой пример — защита прошивки NOR + eMMC: небольшая система восстановления в NOR сохраняется при невосстановимом отказе eMMC.

<!-- Chinese baseline PDF p.4 -->

## 2. Принцип работы

<!-- Chinese baseline PDF p.4 -->

### 2.1 Общая схема загрузки двух накопителей RK

<!-- Chinese baseline PDF p.4 -->

![2.1 Общая схема загрузки двух накопителей RK: английский оригинал, стр. 5](/docs/rockchip-dual-storage/assets/en-p005-figure-01.png)

*2.1 Общая схема загрузки двух накопителей RK: английский оригинал, стр. 5*

<!-- Chinese baseline PDF p.4 -->

Процесс загрузки и сведения о прошивке двух накопителей RK:

<!-- Chinese baseline PDF p.5 -->

| Этап загрузки | Местонахождение прошивки | Основной накопитель, инициализируемый на этапе | Нужная настройка |
| --- | --- | --- | --- |
| Bootrom | Масочный ROM микросхемы | Загрузочный накопитель, например NOR | \ |
| SPL | Загрузочный накопитель, например NOR | Загрузочный накопитель, например NOR | \ |
| u-boot | Загрузочный накопитель, например NOR | Основной накопитель, например NVMe | Специальная настройка U-Boot |
| kernel | Основной накопитель, например NVMe | Основной накопитель, например NVMe | Стандартная настройка ядра |

<!-- Chinese baseline PDF p.5 -->

U-Boot по умолчанию инициализирует тип памяти предыдущего этапа. Для переключения на основной накопитель, например NVMe, нужна специальная настройка U-Boot; см. «Конфигурация».

<!-- Chinese baseline PDF p.5 -->

### 2.2 Схема загрузки двух накопителей RK PCIe EP

<!-- Chinese baseline PDF p.5 -->

Некоторые SoC RK поддерживают PCIe EP и могут работать как стандартные endpoint-карты для обычного ПК. Контроллеру PCIe нужна ранняя инициализация, обеспечиваемая дополнительным pcie_idb.img. Процесс:

<!-- Chinese baseline PDF p.5 -->

![2.2 Схема загрузки двух накопителей RK PCIe EP: английский оригинал, стр. 6](/docs/rockchip-dual-storage/assets/en-p006-figure-01.png)

*2.2 Схема загрузки двух накопителей RK PCIe EP: английский оригинал, стр. 6*

<!-- Chinese baseline PDF p.5 -->

Процесс загрузки и сведения о прошивке двух накопителей RK:

<!-- Chinese baseline PDF p.6 -->

| Этап загрузки | Местонахождение прошивки | Основной накопитель, инициализируемый на этапе | Нужная настройка |
| --- | --- | --- | --- |
| Bootrom | Масочный ROM микросхемы | Загрузочный накопитель, например NOR | \ |
| PCIe.bin | Загрузочный накопитель, например NOR | NULL | \ |
| SPL | Загрузочный накопитель, например NOR | Загрузочный накопитель, например NOR | \ |
| u-boot | Загрузочный накопитель, например NOR | Основной накопитель, например NVMe | Специальная настройка U-Boot |
| kernel | Основной накопитель, например NVMe | Основной накопитель, например NVMe | Стандартная настройка ядра |

<!-- Chinese baseline PDF p.6 -->

U-Boot по умолчанию инициализирует тип памяти предыдущего этапа. Для переключения на основной накопитель, например NVMe, нужна специальная настройка U-Boot; см. «Конфигурация».

<!-- Chinese baseline PDF p.6 -->

## 3. Конфигурация

<!-- Chinese baseline PDF p.6 -->

Как описано в разделе принципов, SDK переключает инициализацию целевого накопителя в U-Boot. Настройте драйвер, переключение основного накопителя и Embedded Kernel DTB.

<!-- Chinese baseline PDF p.6 -->

### 3.1 Настройка U-Boot

<!-- Chinese baseline PDF p.6 -->

#### 3.1.1 Настройка драйвера основного накопителя

<!-- Chinese baseline PDF p.6 -->

См. CH05 «Модули драйверов» в Rockchip_Developer_Guide_UBoot_Nextdev_CN.pdf:

- eMMC: Storage; обычно совместим по умолчанию.
- PCIe NVMe: PCIe.

<!-- Chinese baseline PDF p.6 -->

#### 3.1.2 Настройка переключения основного накопителя

<!-- Chinese baseline PDF p.6 -->

Добавить в defconfig:

<!-- Chinese baseline PDF p.6 -->

```text
CONFIG_ROCKCHIP_BOOTDEV="nvme 0"  # 可择 "nvme"-NVMe "mmc"-eMMC "scsi"-SATA
CONFIG_ROCKCHIP_EMMC_IOMUX=y   # Nor + eMMC ⽅案 spl.bin 中完成 eMMC iomux
```

<!-- Chinese baseline PDF p.7 -->

#### 3.1.3 Embedded Kernel DTB для NVMe/SATA

<!-- Chinese baseline PDF p.7 -->

U-Boot RK имеет два этапа:

- Ранний использует стандартный DTB U-Boot с небольшим объёмом сведений; см. настройку драйвера накопителя.
- Поздний предлагает using kernel dtb — DTB из следующего образа с инициализацией драйверов; либо using embedded dtb — DTB из каталога U-Boot упаковывается в образ U-Boot и используется для драйверов. Здесь нужен embedded.

Defconfig embedded DTB:

<!-- Chinese baseline PDF p.7 -->

```text
CONFIG_EMBED_KERNEL_DTB_ALWAYS=y
CONFIG_EMBED_KERNEL_DTB_PATH="dts/rk3588-evb1-lp4-v10.dtb"  # dtb 存放⽬录
CONFIG_SPL_FIT_IMAGE_KB=2560               # 通常使⽤ embedded dtb 后 u-boot 固件会变⼤
```

<!-- Chinese baseline PDF p.7 -->

Добавление DTB: соберите нужный kernel DTB и поместите в u-boot/dts/. Для ясности сохраните имя ядра. При обновлении замените файл.

<!-- Chinese baseline PDF p.7 -->

### 3.2 Настройка ядра

<!-- Chinese baseline PDF p.7 -->

Используйте стандартную настройку ядра.

<!-- Chinese baseline PDF p.7 -->

### 3.3 Настройка Android

<!-- Chinese baseline PDF p.7 -->

В Android измените носитель на соответствующее PCIe-устройство для монтирования разделов:

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

## 4. Разметка и упаковка прошивки

<!-- Chinese baseline PDF p.8 -->

### 4.1 Прошивка общей схемы двух накопителей RK

<!-- Chinese baseline PDF p.8 -->

SDK по умолчанию упаковывает только один накопитель. Измените скрипты по примеру либо используйте новую схему упаковки для двух накопителей.

Каталог инструментов:

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

Создайте Image-nor и поместите туда собранную NOR-прошивку. Пример parameter.txt:

<!-- Chinese baseline PDF p.8 -->

```text
CMDLINE:mtdparts=rk29xxnand:0x00000080@0x00000000(gpt),0x00000800@0x00000080(idb),0x00000800@0x00001000(vnvm),0x00002000@0x00001800(uboot)
```

<!-- Chinese baseline PDF p.8 -->

Измените mkupdate.sh для упаковки двух накопителей:

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

Выполнить скрипт — RK3568:

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

### 4.2 Упаковка прошивки двух накопителей RK PCIe EP

<!-- Chinese baseline PDF p.10 -->

Принцип упаковки тот же, что в общей схеме двух накопителей RK. Каталог:

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

Создайте pcie_idb.img следующими командами в rkbin:

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

Создайте normal_idb.img из rkbin следующими командами. В китайском тексте опечатка nornal_idb.img; имя команды сохранено:

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

Создайте Image-flash и настройте parameter. Пример SPI NOR:

<!-- Chinese baseline PDF p.11 -->

```text
CMDLINE:mtdparts=rk29xxnand:0x00000080@0x00000000(gpt),0x00000400@0x00000080(pcie_idb),0x00000b80@0x00000480(normal_idb),0x00000800@0x00001000(vnvm),0x00002000@0x00001800(uboot)
```

<!-- Chinese baseline PDF p.11 -->

Пример SPI NAND со страницей 2KB:

<!-- Chinese baseline PDF p.11 -->

```text
CMDLINE:mtdparts=rk29xxnand:0x00000080@0x00000000(gpt),0x00000400@0x00000100(pcie_idb),0x00000400@0x00000500(normal_idb),0x00000800@0x00001000(vnvm),0x00002000@0x00001800(uboot)
```

<!-- Chinese baseline PDF p.11 -->

Пример SPI NAND со страницей 4KB (совместим и с 2KB):

<!-- Chinese baseline PDF p.11 -->

```text
CMDLINE:mtdparts=rk29xxnand:0x00000080@0x00000000(gpt),0x00000400@0x00000200(pcie_idb),0x00000400@0x00000600(normal_idb),0x00000800@0x00001000(vnvm),0x00002000@0x00001800(uboot)
```

<!-- Chinese baseline PDF p.11 -->

Измените mkupdate.sh и запустите по соответствующему разделу общей схемы упаковки RK.

<!-- Chinese baseline PDF p.11 -->

## 5. Запись прошивки

<!-- Chinese baseline PDF p.11 -->

Инструменты RK поддерживают запись нескольких накопителей. В Windows используйте RKDevTool_Release_v2.93 и выше; см. §1.12 выбора нескольких устройств в руководстве из комплекта.

Одновременная запись:

<!-- Chinese baseline PDF p.12 -->

![5. Запись прошивки: английский оригинал, стр. 13](/docs/rockchip-dual-storage/assets/en-p013-figure-01.png)

*5. Запись прошивки: английский оригинал, стр. 13*

<!-- Chinese baseline PDF p.12 -->

Только SPI NOR: войти в maskrom и выбрать лишь прошивку SPINOR.

Только NVMe: войти в Loader и выбрать лишь прошивку PCIe.

<!-- Chinese baseline PDF p.12 -->

## 6. Обновление OTA

<!-- Chinese baseline PDF p.12 -->

### 6.1 OTA общей схемы двух накопителей RK

<!-- Chinese baseline PDF p.12 -->

Пример NOR + eMMC. NOR содержит MiniLoader, parameter.txt и uboot.img; все описаны как поддерживающие OTA. Пример обновляет uboot. Обновлять MiniLoader или parameter.txt не рекомендуется из-за высокого риска.

U-Boot находится в NOR, boot/rootfs — в eMMC. Добавьте раздел U-Boot и конфигурацию NOR в ядро. По parameter.txt общей схемы задайте mtdparts recovery DTS:

<!-- Chinese baseline PDF p.12 -->

```text
mtdparts=sfc_nor:0x00100000@0x00010000(idb),0x00100000@0x00200000(vnvm),0x00400000@0x00300000(uboot)
```

<!-- Chinese baseline PDF p.12 -->

Добавьте настройку NOR:

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

После добавления проверьте /dev/mtdblock в корневой ФС. При отсутствии изучите конфигурацию и стартовые ошибки SPI NOR: неверный iomux, неподдерживаемая модель и т. п.

EMMC: разметка хранится в parameter.txt EMMC. Добавление разделов создаёт соответствующие mmcblock в корневой ФС. После появления узлов обоих накопителей получите recovery-патч по ссылке оригинала и следуйте инструкции OTA. Собственный обновлятор может самостоятельно выбирать запись узлов:

<!-- Chinese baseline PDF p.13 -->

[Ссылка recovery-патча оригинала (доступ не проверен)](https://pan.baidu.com/s/1LiutCDJZ8BXiEN6X8U6teQ?pwd=nwm3) — `nwm3`

<!-- Chinese baseline PDF p.13 -->

### 6.2 OTA двух накопителей RK PCIe EP

<!-- Chinese baseline PDF p.13 -->

Принцип совпадает с общим OTA RK; меняются только сведения о разделах. По parameter.txt раздела PCIe EP добавьте mtdparts recovery DTS. SPI NOR:

<!-- Chinese baseline PDF p.13 -->

```text
mtdparts=sfc_nor:0x00080000@0x00010000(pcie_idb),0x00170000@0x00090000(normal_idb),0x00100000@0x00200000(vnvm),0x00400000@0x00300000(uboot)
```

<!-- Chinese baseline PDF p.13 -->

Пример SPI NAND со страницей 2KB:

<!-- Chinese baseline PDF p.13 -->

```text
mtdparts=spi-nand0:0x00000080@0x00000000(gpt),0x00000400@0x00000100(pcie_idb),0x00000400@0x00000500(normal_idb),0x00000800@0x00001000(vnvm),0x00002000@0x00001800(uboot)
```

<!-- Chinese baseline PDF p.13 -->

Пример SPI NAND со страницей 4KB (совместим и с 2KB):

<!-- Chinese baseline PDF p.13 -->

```text
mtdparts=spi-nand0:0x00000080@0x00000000(gpt),0x00000400@0x00000200(pcie_idb),0x00000400@0x00000600(normal_idb),0x00000800@0x00001000(vnvm),0x00002000@0x00001800(uboot)
```

<!-- Chinese baseline PDF p.14 -->

## 7. Поддержка Vendor Storage SPI NOR

<!-- Chinese baseline PDF p.14 -->

В схеме SPI NOR + SSD (SATA либо NVMe) храните SN, MAC и подобные данные в SPI NOR. Определите vnvm для Vendor Storage; начало и размер должны быть кратны 64KB.

<!-- Chinese baseline PDF p.14 -->

### 7.1 Изменение таблицы разделов

<!-- Chinese baseline PDF p.14 -->

Добавьте vnvm в parameter.txt SPI NOR. Единица — сектор (512 bytes). Пример источника:

<!-- Chinese baseline PDF p.14 -->

```text
CMDLINE: mtdparts=rk29xxnand:0x00000200@0x00000c00(vnvm),0x00003000@0x00000c00(uboot)
```

<!-- Chinese baseline PDF p.14 -->

### 7.2 Добавление разделов SPI NOR в ядро

<!-- Chinese baseline PDF p.14 -->

Добавьте таблицу SPI NOR в CMDLINE DTS ядра; начало и размер каждого раздела должны совпадать с parameter.txt, но задаются в байтах. Пример:

<!-- Chinese baseline PDF p.14 -->

```text
CMDLINE: mtdparts=sfc_nor:0x00040000@0x00180000(vnvm),0x00600000@0x00200000(uboot)
```

<!-- Chinese baseline PDF p.14 -->

## 8. Частые вопросы

<!-- Chinese baseline PDF p.14 -->

### 8.1 Сокращение разметки NOR-прошивки

<!-- Chinese baseline PDF p.14 -->

По умолчанию обновление Loader NOR автоматически размещает IDB, включая смещение и копии. Рекомендуется сохранить схему. Если нужно изменить разметку, используйте пример RK3568 NOR + eMMC. Разметка AndroidTool:

<!-- Chinese baseline PDF p.15 -->

![8.1 Сокращение разметки NOR-прошивки: английский оригинал, стр. 16](/docs/rockchip-dual-storage/assets/en-p016-figure-01.png)

*8.1 Сокращение разметки NOR-прошивки: английский оригинал, стр. 16*

<!-- Chinese baseline PDF p.15 -->

Изменение конфигурации AndroidTool:

<!-- Chinese baseline PDF p.15 -->

![8.1 Сокращение разметки NOR-прошивки: английский оригинал, стр. 17](/docs/rockchip-dual-storage/assets/en-p017-figure-01.png)

*8.1 Сокращение разметки NOR-прошивки: английский оригинал, стр. 17*

Снимки инструмента взяты из английского PDF, но интерфейс и комментарии конфигурации в нём остаются китайскими. Ниже приведена редактируемая расшифровка конфигурации; пустые значения сохранены и не являются рекомендуемыми настройками:

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

Пояснение:

<!-- Chinese baseline PDF p.15 -->

**1.** Замените Loader на LoaderToDDR для отключения автоматического размещения IDB. Loader только запускает обновление.

<!-- Chinese baseline PDF p.15 -->

**2.** SPI NOR: обновлять таблицу автоматически через parameter / parameter.txt либо явно через gpt / gpt.img.

<!-- Chinese baseline PDF p.15 -->

**3.** EMMC соответствует однонакопительной схеме и по-прежнему требует parameter.txt для создания таблицы.

<!-- Chinese baseline PDF p.15 -->

**4.** После отключения автоматического размещения IDB отключите проверку IDB в инструменте обновления.

<!-- Chinese baseline PDF p.16 -->

## 9. Приложение

<!-- Chinese baseline PDF p.16 -->

### 9.1 Справочный патч RK3588s EVB1 NOR + NVMe

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

### 9.2 Справочный патч RK3568 EVB1 NOR + eMMC

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

Примечание:

<!-- Chinese baseline PDF p.18 -->

Для этого справочного патча Embedded Kernel DTB включать не требуется.

{% endraw %}
