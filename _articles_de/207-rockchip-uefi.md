---
title: "Rockchip UEFI: Entwicklerhandbuch"
description: "Rockchip UEFI: Entwicklerhandbuch — RK3588, V1.4.0"
excerpt: "Rockchip UEFI: Entwicklerhandbuch"
translation_key: "207-rockchip-uefi"
slug: "207-rockchip-uefi"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, RK3588, UEFI]
---

{% raw %}

# Rockchip UEFI: Entwicklerhandbuch

ArmSoM-Plattformreferenz nach RK-KF-YF-935 V1.4.0 für das ursprüngliche RK3588 Linux SDK/EVB. EVB-Partitionen, GPIO, Versorgung und Reset nicht ungeprüft auf ArmSoM übernehmen; Schaltplan, TRM und SDK/BSP abgleichen. Kernelbeispiele nennen 5.10.66/5.10.84-1, keine einheitliche SDK-Version. Es erfolgten weder Flashen noch Registerzugriffe oder Hardwaretests.

Beide Hauptquellen haben 12 Seiten und V1.4.0; alle fünf Kapitel samt Code sind erhalten. Die chinesische 10-Seiten-Kopie unter RK3588/UEFI wurde verglichen: gleicher technischer Inhalt, kein doppelter Artikel. ZH nutzt zwei chinesische, EN/RU/DE zwei englische Quellabbildungen. Die Quelle mischt boot_uef.img/boot_uefi.img und boot//u-boot/; diese Schreibweisen bleiben zur Prüfung erhalten. Firmware-Namen oder Register nicht erraten. Supportaussagen wie UEFI+ACPI gelten für den Quellenstand.

## 1. Codeübersicht

Das RK3588 Linux SDK enthält UEFI-Code. Prüfen Sie, ob das SDK ein uefi-Verzeichnis besitzt. Zugehörige Verzeichnisse:

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

## 2. UEFI bauen

Das RK3588 Linux SDK bietet zwei Build-Verfahren. Im uefi-Verzeichnis das Skript ausführen:

```text
./make.sh rk3588 #Build rk3588 by default
```

Oder build.sh im SDK-Hauptverzeichnis verwenden:

```text
./build.sh uefi
```

Das Skript richtet die EDK2-Umgebung ein. Während des Builds wird u-boot neu gebaut. Im aktuellen Verzeichnis entstehen uboot_uefi.img und RK3588_NOR_FLASH.img. Für eMMC wird uboot_uefi.img in die uboot-Partition geschrieben; für SPI Nor Flash dient RK3588_NOR_FLASH.img.

Zum Quellenstand unterstützt RK3588 nur UEFI + DTB, nicht UEFI + ACPI. build.sh uefi kopiert das Kernel-DTB in das UEFI-Verzeichnis, daher muss zuerst der Kernel gebaut werden. Bei make.sh im UEFI-Verzeichnis ist das DTB manuell nach uefi/edk2-platforms/Platform/Rockchip/DeviceTree/rk3588.dtb zu kopieren:

```text
$cp kernel/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4-v10-linux.dtb uefi/edk2-platforms/Platform/Rockchip/DeviceTree/rk3588.dtb
```

## 3. Flashen

Die Verfahren für eMMC und SPI Nor Flash unterscheiden sich.

#### Booten von eMMC

![Flash-Dialog der englischen Quelle](/docs/rockchip-uefi/assets/en-p005-figure-01.png)

Für eMMC wird eine parameter-Datei benötigt; mindestens folgende drei Dateien sind zu schreiben:

```text
u-boot/rk3588_spl_loader_v1.07.111.bin
parameter.txt
uefi/uboot_uefi.img
```

Die Adresse von uboot_uefi.img entspricht dem Beginn der uboot-Partition in parameter.txt. Im folgenden Beispiel beträgt die UEFI-Adresse 0x4000 und die maximale Größe 0x2000; die Einheit ist 512 Byte.

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

#### Booten von SPI Nor Flash

![Flash-Dialog der englischen Quelle](/docs/rockchip-uefi/assets/en-p006-figure-01.png)

SPI Nor Flash benötigt anders als eMMC keine parameter-Datei:

```text
boot/rk3588_spl_loader_v1.07.111.bin
uefi/RK3588_NOR_FLASH.img
```

Den rot markierten Bereich der Abbildung beachten.

## 4. Booten

Es gibt zwei Systemstartverfahren: Android Boot und GRUB. Beide werden nachfolgend beschrieben.

### 4.1 Android Boot

Der Modus ähnelt dem gewöhnlichen RK3588-Linux-Start, ersetzt aber uboot und boot durch uboot_uefi.img und boot_uef.img (Quellschreibweise); andere Partitionen bleiben unverändert. Die UUID der boot-Partition wird in parameter ergänzt. build.sh baut den Kernel und erzeugt boot_uefi.img für die boot-Partition. Dessen zweiter Abschnitt enthält anders als boot.img ein DTB statt resource.img.

#### 4.1.1 Boot-Partition bestimmen

UEFI bestimmt die Partition von boot_uefi.img anhand der GPT-GUID und weiterer Angaben. Der gewöhnlichen parameter-Datei die boot-GUID hinzufügen:

```text
uuid:boot=7A3F0000-0000-446A-8000-702F00006273
```

Offset und Größe von boot ebenfalls prüfen. Die Definition steht in PcdAndroidBootDevicePath der Datei uefi/edk2-platforms/Platform/Rockchip/RK3588/RK3588.dsc. UUID, Offset und Größe müssen mit parameter übereinstimmen; sonst findet UEFI die Partition nicht und Android Boot scheitert.

```text
gEmbeddedTokenSpaceGuid.PcdAndroidBootDevicePath|L"VenHw(100C2CFA-B586-4198-9B4C-1683D195B1DA)/HD(3,GPT,7A3F0000-0000-446A-8000-702F00006273,0x8000,0x20000)"
```

Im Beispiel lautet die UUID 7A3F0000-0000-446A-8000-702F00006273, der Offset 0x8000 und die Größe 0x20000. map in der UEFI-Shell zeigt die Partitionstabelle einschließlich boot:

```text
BLK3: Alias(s):
          VenHw(100C2CFA-B586-4198-9B4C-1683D195B1DA)/HD(3,GPT,7A3F0000-0000-446A-8000-702F00006273,0x8000,0x20000)
```

Hinweis: Android Boot prüft den Android-Header der boot-Partition. Das Image muss im Android-, nicht im FIT-Format vorliegen, sonst wird boot als nicht gefunden gemeldet. Das durch den Kernelpatch geänderte Skript erzeugt boot_uefi.img im Android-Format; das Standard-Linux-SDK-Skript erstellt boot.img als FIT.

### 4.2 GRUB-Boot

UEFI sucht auf der ESP-Partition /efi/boot/grubaa64.efi, die gewöhnlich auf dem Installationsmedium vorhandene GRUB-Anwendung. grub.cfg konfiguriert Kernel, initrd und weitere Angaben. Details stehen in der GRUB-Dokumentation und Installationsanleitungen wie Debian_Install_Guide. Beispiel für den RK3588-Kernelbau:

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

Im SDK-Hauptverzeichnis entstehen folgende Kernel-Installationspakete:

```text
linux-headers-5.10.66_5.10.84-1_arm64.deb
linux-image-5.10.66_5.10.84-1_arm64.deb
linux-libc-dev_5.10.84-1_arm64.deb
```

kernel/arch/arm64/boot/Image kann ebenfalls zum Starten des Installationsmediums dienen:

```text
cp kernel/arch/arm64/boot/Image /udisk/install.a64/vmlinuz
```

#### 4.2.1 cmdline

Beim GRUB-Start verwendet der Kernel die GRUB-cmdline statt der DTS-cmdline. Für ttyS als Debug-UART grub.cfg ändern:

```text
linux /install.a64/vmlinuz --- quiet
```

ersetzen durch

```text
linux /install.a64/vmlinuz earlycon=uart8250,mmio32,0xfeb50000 console=ttyS2,1500000n8 --- quiet
```

Ohne console=ttyS2,1500000n8 in GRUB verwendet der Kernel standardmäßig ttyFIQ0 als Debug-Port.

## 5. Konfiguration

Hardwarebezogene UEFI-Einstellungen stehen gewöhnlich in folgenden Dateien:

```text
make.sh //compilation switch
edk2-platforms/Platform/Rockchip/RK3588/RK3588.dsc //variable definition
edk2-platforms/Platform/Rockchip/RK3588/RK3588.fdf //Generate firmware Image configuration
edk2-platforms/Platform/Rockchip/RK3588/Library/RockchipPlatfromLib/RockchipPlatfromLib.c //Hardware related information
```

Das beschriebene UEFI besitzt keinen einheitlichen GPIO-Treiber; gewöhnlich werden Register direkt geschrieben. Pro GPIO sind typischerweise IOMUX- und GPIO-Register anzupassen.

### 5.1 SPI Nor

SPI-Nor-Flash-Pins gemäß Schaltplan konfigurieren. Das SDK verwendet standardmäßig FSPI_M1. Bei abweichender Belegung NorFspiIomux in edk2-platforms/Platform/Rockchip/RK3588/Library/RockchipPlatfromLib/RockchipPlatfromLib.c ändern:

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

Zur Parameterspeicherung im SPI Nor den emulated non-volatile variable mode deaktivieren.

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

eMMC und SPI_M0 teilen sich Pins. Bei SPI Nor mit FSPI_M0 entstehen eMMC-Kommunikationsfehler; eMMC deaktivieren:

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

ROCKCHIP_PCIE30 in make.sh prüfen. Falls nicht aktiviert, folgende Änderung ergänzen:

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

PCIe-Stromversorgung und Reset ebenfalls prüfen. Die Funktionen stehen in edk2-platforms/Platform/Rockchip/RK3588/Library/RockchipPlatfromLib/RockchipPlatfromLib.c. Register gemäß Schaltplan und TRM anpassen.

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

### 5.3 Anzeige

Die Anzeigefunktion ist standardmäßig deaktiviert. Zum Aktivieren FLAGS in make.sh ändern:

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

Die Host-Funktionen von USB2.0 und Type-C sind standardmäßig aktiviert; VBUS muss versorgt werden. Bei Hardwareabweichungen vom EVB UsbPortPowerEnable in edk2-platforms/Platform/Rockchip/RK3588/Library/RockchipPlatfromLib/RockchipPlatfromLib.c anpassen:

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

Der chinesische §4.1 nennt ausdrücklich `build.sh kernel`, Englisch nur `build.sh`. Beide Aussagen bleiben dokumentiert; SDK-Argumente prüfen. Das Beispiel nutzt `$CUR_DIR`, ohne es im Ausschnitt zu definieren; den tatsächlichen Wert prüfen.

[ArmSoM Docs](https://docs.armsom.org/)

{% endraw %}
