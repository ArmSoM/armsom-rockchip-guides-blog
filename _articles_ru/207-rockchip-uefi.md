---
title: "Rockchip UEFI: руководство разработчика"
description: "Rockchip UEFI: руководство разработчика — RK3588, V1.4.0"
excerpt: "Rockchip UEFI: руководство разработчика"
translation_key: "207-rockchip-uefi"
slug: "207-rockchip-uefi"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, RK3588, UEFI]
---

{% raw %}

# Rockchip UEFI: руководство разработчика

Платформенная справка ArmSoM по RK-KF-YF-935 V1.4.0 для исходного RK3588 Linux SDK/EVB. Нельзя без проверки переносить разделы, GPIO, питание и сброс EVB на ArmSoM: сверяйте схему, TRM и SDK/BSP. В примерах ядра указаны 5.10.66/5.10.84-1; единая версия SDK не задана. Прошивка, запись регистров и аппаратные проверки не выполнялись.

Основные оригиналы — по 12 страниц, V1.4.0; сохранены пять глав и весь код. Сравнена 10-страничная китайская копия RK3588/UEFI: техническое содержание совпадает, отдельная статья не создаётся. ZH использует два китайских рисунка, EN/RU/DE — два английских. В исходнике смешаны boot_uef.img/boot_uefi.img и boot//u-boot/; написания оставлены для проверки. Нельзя угадывать имена прошивки или менять регистры. Заявления о поддержке, включая UEFI+ACPI, относятся к версии оригинала.

## 1. Обзор кода

RK3588 Linux SDK включает UEFI. Проверьте наличие каталога uefi в SDK. Связанные каталоги:

1. edk2-platforms/Silicon/Rockchip

```text
├── Applications  //Test Demo and Tool
├── Drivers   //General driver
├── Include   //General header file
├── Library   //General library
├── RK3568   //is only for RK3568 IP driver, etc.
├── RK3588   //is only for RK3588 IP driver, etc.
├── Rockchip.dsc.inc   //General configuration
├── Rockchip.fdf.inc   //General configuration
└── RockchipPkg.dec    //General configuration
```

2. edk2-platforms/Platform/Rockchip

```text
├── DeviceTree
│   └── rk3588.dtb   // Device tree file, copied from
kernel/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4-v10-linux.dtb
├── RK3568
└── RK3588
    ├── AcpiTables
    ├── BootGraphicsResourceTableDxe
    ├── Include
    ├── Library
    ├── LogoDxe
    ├── RK3588.dec
    ├── RK3588.dsc
    ├── RK3588Dxe
    ├── RK3588.fdf
    └── RK3588GpioDxe
```

## 2. Сборка UEFI

RK3588 Linux SDK предоставляет два способа сборки. Запустите сценарий в каталоге uefi:

```text
./make.sh rk3588 #Build rk3588 by default
```

Или используйте build.sh из корня SDK:

```text
./build.sh uefi
```

Сценарий уже задаёт окружение EDK2. Во время сборки заново собирается u-boot. В текущем каталоге появляются прошивки uboot_uefi.img и RK3588_NOR_FLASH.img. Для eMMC используется uboot_uefi.img, записываемый в раздел uboot; для SPI Nor Flash — RK3588_NOR_FLASH.img.

На момент оригинала RK3588 поддерживал только UEFI + DTB, но не UEFI + ACPI. При build.sh uefi DTB ядра копируется в каталог UEFI, поэтому сначала необходимо собрать ядро. Если используется make.sh из каталога UEFI, DTB следует скопировать вручную в uefi/edk2-platforms/Platform/Rockchip/DeviceTree/rk3588.dtb:

```text
$cp kernel/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4-v10-linux.dtb uefi/edk2-platforms/Platform/Rockchip/DeviceTree/rk3588.dtb
```

## 3. Прошивка

Процедуры для загрузки с eMMC и SPI Nor Flash различаются.

#### Загрузка с eMMC

![Окно прошивки английского оригинала](/docs/rockchip-uefi/assets/en-p005-figure-01.png)

Для eMMC нужен parameter-файл, поэтому необходимо записать как минимум три файла:

```text
u-boot/rk3588_spl_loader_v1.07.111.bin
parameter.txt
uefi/uboot_uefi.img
```

Адрес uboot_uefi.img определяется началом раздела uboot в parameter.txt. В следующем примере адрес прошивки UEFI — 0x4000, максимальный размер — 0x2000; единица равна 512 Byte.

```text
FIRMWARE_VER: 1.0
MACHINE_MODEL: RK3588
MACHINE_ID: 007
MANUFACTURER: RK3588
MAGIC: 0x5041524B
ATAG: 0x00200800
MACHINE: 0xffffffff
CHECK_MASK: 0x80
PWR_HLD: 0,0,A,0,1
TYPE: GPT
CMDLINE: mtdparts=rk29xxnand:0x00002000@0x00004000(uboot),0x00002000@0x00006000(misc),0x00020000@0x00008000(boot),0x00040000@0x00028000(recovery),0x00010000@0x00068000(backup),0x01c00000@0x00078000(rootfs),0x00040000@0x01c78000(oem),-@0x01d18000(userdata:grow)
uuid:rootfs=614e0000-0000-4b53-8000-1d28000054a9
uuid:boot=7A3F0000-0000-446A-8000-702F00006273
```

#### Загрузка с SPI Nor Flash

![Окно прошивки английского оригинала](/docs/rockchip-uefi/assets/en-p006-figure-01.png)

Для SPI Nor Flash parameter-файл, в отличие от eMMC, не нужен:

```text
boot/rk3588_spl_loader_v1.07.111.bin
uefi/RK3588_NOR_FLASH.img
```

Обратите внимание на выделенную красным область рисунка.

## 4. Загрузка

Доступны два режима загрузки системы: Android Boot и GRUB. Они описаны ниже.

### 4.1 Android Boot

Режим похож на обычную загрузку Linux RK3588, но исходные uboot и boot заменяются uboot_uefi.img и boot_uef.img (так записано в оригинале), остальные разделы не меняются. В parameter добавляется UUID раздела boot. При запуске build.sh собирается ядро и создаётся boot_uefi.img для раздела boot. В отличие от boot.img, второй раздел boot_uefi.img содержит DTB вместо resource.img.

#### 4.1.1 Определение раздела boot

UEFI определяет раздел boot_uefi.img по GUID GPT и другой информации. К обычному parameter-файлу добавьте GUID boot:

```text
uuid:boot=7A3F0000-0000-446A-8000-702F00006273
```

Проверьте также смещение и размер boot. Определение находится в PcdAndroidBootDevicePath файла uefi/edk2-platforms/Platform/Rockchip/RK3588/RK3588.dsc. UUID, смещение и размер должны точно совпадать с parameter, иначе UEFI не найдёт раздел и Android Boot завершится неудачей.

```text
gEmbeddedTokenSpaceGuid.PcdAndroidBootDevicePath|L"VenHw(100C2CFA-B586-4198-9B4C-1683D195B1DA)/HD(3,GPT,7A3F0000-0000-446A-8000-702F00006273,0x8000,0x20000)"
```

В примере UUID — 7A3F0000-0000-446A-8000-702F00006273, смещение — 0x8000, размер — 0x20000. Команда map оболочки UEFI показывает таблицу разделов и boot:

```text
BLK3: Alias(s):
          VenHw(100C2CFA-B586-4198-9B4C-1683D195B1DA)/HD(3,GPT,7A3F0000-0000-446A-8000-702F00006273,0x8000,0x20000)
```

Примечание: Android Boot проверяет заголовок Android в boot. Образ должен иметь формат Android, не FIT, иначе появляется сообщение, что boot не найден. Изменённый сценарием патча ядра процесс создаёт Android-образ boot_uefi.img; стандартный Linux-SDK-сценарий создаёт boot.img в FIT.

### 4.2 Загрузка GRUB

UEFI ищет /efi/boot/grubaa64.efi в разделе ESP — приложение GRUB, обычно имеющееся на установочном носителе системы. grub.cfg задаёт ядро, initrd и прочие параметры. Подробности находятся в документации GRUB и установочных руководствах, например Debian_Install_Guide. Ниже пример сборки ядра RK3588:

```text
#Build kernel deb package
cd kernel
export CROSS_COMPILE=../prebuilts/gcc/linux-x86/aarch64/gcc-arm-10.3-2021.07-x86_64-aarch64-none-linux-gnu/bin/aarch64-none-linux-gnu-
export ARCH=arm64
export LOCALVERSION=
export KDEB_PKGVERSION=5.10.84-1
make rockchip_linux_defconfig
make bindeb-pkg -j16

#Build dynamic libraries, which is needed in initrd
make modules
make modules_install INSTALL_MOD_PATH=$(realpath $CUR_DIR)/tmp
```

В корне SDK появятся следующие установочные пакеты ядра:

```text
linux-headers-5.10.66_5.10.84-1_arm64.deb
linux-image-5.10.66_5.10.84-1_arm64.deb
linux-libc-dev_5.10.84-1_arm64.deb
```

Файл kernel/arch/arm64/boot/Image также можно использовать для запуска установочного носителя:

```text
cp kernel/arch/arm64/boot/Image /udisk/install.a64/vmlinuz
```

#### 4.2.1 cmdline

При запуске через GRUB ядро использует cmdline от GRUB, а не из DTS. Для отладки через ttyS измените grub.cfg:

```text
linux /install.a64/vmlinuz --- quiet
```

заменить на

```text
linux /install.a64/vmlinuz earlycon=uart8250,mmio32,0xfeb50000 console=ttyS2,1500000n8 --- quiet
```

Без console=ttyS2,1500000n8 в GRUB ядро использует стандартный отладочный порт ttyFIQ0.

## 5. Конфигурация

Аппаратные настройки UEFI обычно находятся в следующих файлах:

```text
make.sh //compilation switch
edk2-platforms/Platform/Rockchip/RK3588/RK3588.dsc //variable definition
edk2-platforms/Platform/Rockchip/RK3588/RK3588.fdf //Generate firmware Image configuration
edk2-platforms/Platform/Rockchip/RK3588/Library/RockchipPlatfromLib/RockchipPlatfromLib.c //Hardware related information
```

В описанном UEFI нет единого драйвера GPIO, поэтому обычно выполняется прямая запись регистров. Для GPIO обычно меняют IOMUX и GPIO.

### 5.1 SPI Nor

Выберите выводы SPI Nor Flash по схеме. SDK по умолчанию использует FSPI_M1. Для другой разводки измените NorFspiIomux в edk2-platforms/Platform/Rockchip/RK3588/Library/RockchipPlatfromLib/RockchipPlatfromLib.c:

```text
void
EFIAPI
NorFspiIomux(void)
{
  /* io mux */
  MmioWrite32(NS_CRU_BASE + CRU_CLKSEL_CON78,
             (((0x3 << 12) | (0x3f << 6)) << 16) | (0x0 << 12) | (0x3f << 6));
#define FSPI_M1
#if defined(FSPI_M0)
   /*FSPI M0*/
  BUS_IOC->GPIO2A_IOMUX_SEL_L = ((0xF << 0) << 16) | (2 << 0); //FSPI_CLK_M0
  BUS_IOC->GPIO2D_IOMUX_SEL_L = (0xFFFFUL << 16) | (0x2222);
//FSPI_D0_M0,FSPI_D1_M0,FSPI_D2_M0,FSPI_D3_M0
  BUS_IOC->GPIO2D_IOMUX_SEL_H = ((0xF << 8) << 16) | (0x2 << 8); //FSPI_CS0N_M0
#elif defined(FSPI_M1)
  /*FSPI M1*/
  BUS_IOC->GPIO2A_IOMUX_SEL_H = (0xFF00UL << 16) | (0x3300);
//FSPI_D0_M1,FSPI_D1_M1
  BUS_IOC->GPIO2B_IOMUX_SEL_L = (0xF0FFUL << 16) | (0x3033);
//FSPI_D2_M1,FSPI_D3_M1,FSPI_CLK_M1
  BUS_IOC->GPIO2B_IOMUX_SEL_H = (0xF << 16) | (0x3); //FSPI_CS0N_M1
#else
  /*FSPI M2*/
  BUS_IOC->GPIO3A_IOMUX_SEL_L = (0xFFFFUL << 16) | (0x5555); //[FSPI_D0_M2-FSPI_D3_M2]
  BUS_IOC->GPIO3A_IOMUX_SEL_H = (0xF0UL << 16) | (0x50); //FSPI_CLK_M2
  BUS_IOC->GPIO3C_IOMUX_SEL_H = (0xF << 16) | (0x2); //FSPI_CS0_M2
#endif
}
```

Для хранения параметров в SPI Nor отключите emulated non-volatile variable mode.

```text
diff --git a/edk2-platforms/Platform/Rockchip/RK3588/RK3588.dsc b/edk2-platforms/Platform/Rockchip/RK3588/RK3588.dsc
index 1cf0ca85ff..6301a05a83 100644
--- a/edk2-platforms/Platform/Rockchip/RK3588/RK3588.dsc
+++ b/edk2-platforms/Platform/Rockchip/RK3588/RK3588.dsc
@@ -241,7 +241,7 @@
   #
   # Make VariableRuntimeDxe work at emulated non-volatile variable mode.
   #
-  gEfiMdeModulePkgTokenSpaceGuid.PcdEmuVariableNvModeEnable|TRUE
+  gEfiMdeModulePkgTokenSpaceGuid.PcdEmuVariableNvModeEnable|FALSE
```

Выводы eMMC и SPI_M0 совмещены. При включении SPI Nor с FSPI_M0 возможны ошибки связи eMMC; отключите eMMC:

```text
diff --git a/edk2-platforms/Platform/Rockchip/RK3588/RK3588.fdf b/edk2-platforms/Platform/Rockchip/RK3588/RK3588.fdf
index 24c01a8463..f936c8ba34 100644
--- a/edk2-platforms/Platform/Rockchip/RK3588/RK3588.fdf
+++ b/edk2-platforms/Platform/Rockchip/RK3588/RK3588.fdf
@@ -279,7 +279,7 @@ READ_LOCK_STATUS   = TRUE
   #INF Silicon/Synopsys/DesignWare/Drivers/DwEmmcDxe/DwEmmcDxe.inf
   INF Silicon/Rockchip/Drivers/MmcDxe/MmcDxe.inf
   #INF Silicon/Rockchip/Drivers/DwEmmcDxe/DwEmmcDxe.inf
-  INF Silicon/Rockchip/Drivers/SdhciHostDxe/SdhciHostDxe.inf
+  #INF Silicon/Rockchip/Drivers/SdhciHostDxe/SdhciHostDxe.inf
```

### 5.2 PCIe

Проверьте ROCKCHIP_PCIE30 в make.sh. Если переключатель не включён, добавьте изменение:

```text
diff --git a/make.sh b/make.sh
index f8f8d68cee..3e35971a9a 100755
--- a/make.sh
+++ b/make.sh
@@ -13,6 +13,7 @@ case "$1" in
         *)
                 CHIP=3588
+                FLAGS+=" -D ROCKCHIP_PCIE30"
                 ;;
 esac
 echo Start to build rk$CHIP UEFI
```

Также проверьте питание и сброс PCIe. Функции находятся в edk2-platforms/Platform/Rockchip/RK3588/Library/RockchipPlatfromLib/RockchipPlatfromLib.c. Изменяйте регистры только согласно схеме и TRM.

```text
void
EFIAPI
Pcie30IoInit(void)
{
    /* Set reset and power IO to gpio output mode */
    MmioWrite32(0xFD5F808C, 0xf << (8 + 16)); /* gpio4b6 to gpio mode -> reset */
    MmioWrite32(0xFEC50008, 0x40004000); /* output */

    MmioWrite32(0xFD5F8070, 0xf << (12 + 16)); /* gpio3c3 to gpio mode -> power
*/
    MmioWrite32(0xFEC4000c, 0x80008); /* output */
}

void
EFIAPI
Pcie30PowerEn(void)
{
    MmioWrite32(0xFEC40004, 0x80008); /* output high to enable power */
}

void
EFIAPI
Pcie30PeReset(BOOLEAN enable)
{
    if(enable)
        MmioWrite32(0xFEC50000, 0x40000000); /* output low */
    else
        MmioWrite32(0xFEC50000, 0x40004000); /* output high */
}
```

### 5.3 Дисплей

Дисплей по умолчанию отключён. Для включения измените FLAGS в make.sh:

```text
diff --git a/make.sh b/make.sh
index f8f8d68cee..3e35971a9a 100755
--- a/make.sh
+++ b/make.sh
@@ -13,6 +13,7 @@ case "$1" in
         *)
                 CHIP=3588
+                FLAGS+=" -D ROCKCHIP_VOPEN"
                 ;;
 esac
 echo Start to build rk$CHIP UEFI
```

### 5.4 USB

Host-функции USB2.0 и Type-C включены по умолчанию, требуется питание VBUS. Если плата отличается от EVB, измените UsbPortPowerEnable в edk2-platforms/Platform/Rockchip/RK3588/Library/RockchipPlatfromLib/RockchipPlatfromLib.c:

```text
#define GPIO4_BASE         0xFEC50000
#define GPIO_SWPORT_DR_L   0x0000
#define GPIO_SWPORT_DR_H   0x0004
#define GPIO_SWPORT_DDR_L  0x0008
#define GPIO_SWPORT_DDR_H  0x000C

void
EFIAPI
UsbPortPowerEnable (void)
{
  /* enable usb host vbus supply */
  MmioWrite32(GPIO4_BASE + GPIO_SWPORT_DR_L, (0x0100UL << 16) | 0x0100); /*
GPIO4_B0 */
  MmioWrite32(GPIO4_BASE + GPIO_SWPORT_DDR_L, (0x0100UL << 16) | 0x0100);
  /* enable usb otg0 vbus supply */
  MmioWrite32(GPIO4_BASE + GPIO_SWPORT_DR_H, (0x0100UL << 16) | 0x0100); /*
GPIO4_D0 */
  MmioWrite32(GPIO4_BASE + GPIO_SWPORT_DDR_H, (0x0100UL << 16) | 0x0100);
}
```

Китайский §4.1 явно называет `build.sh kernel`, английский — только `build.sh`. Обе формулировки сохранены; проверяйте аргументы своего SDK. Пример использует `$CUR_DIR` без определения в фрагменте; проверьте значение в рабочей среде.

[ArmSoM Docs](https://docs.armsom.org/)

{% endraw %}
