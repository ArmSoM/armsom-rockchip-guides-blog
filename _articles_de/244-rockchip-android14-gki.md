---
title: "Rockchip Android14 GKI: Module, Builds und Fehlerdiagnose"
description: "Rockchip Android14 GKI: Module, Builds und Fehlerdiagnose"
excerpt: "Rockchip Android14 GKI: Module, Builds und Fehlerdiagnose"
translation_key: "244-rockchip-android14-gki"
slug: "244-rockchip-android14-gki"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM","Rockchip","Android"]
---

{% raw %}

# Rockchip Android14 GKI: Module, Builds und Fehlerdiagnose

Quellen: Rockchip Android14 GKI, chinesisch RK-KF-YF-775 und englisch RK-KF-YF-778, jeweils V1.1.1 , 21 Seiten. Vollständiger chinesischer Fachinhalt und Nummerierung bilden die Grundlage; englische Unterschiede sind vermerkt. Historische SDK-Verfahren und Zertifizierungsaussagen, keine aktuelle Richtlinienprüfung oder bestätigte ArmSoM-Unterstützung. Befehle wurden nicht auf Hardware ausgeführt; vor Flashen/Partitionsänderungen Daten sichern.

## 1.1 Was GKI bedeutet

GKI (Generic Kernel Image) vermindert Kernelfragmentierung: gemeinsamer Kern, SoC-/Boardtreiber als ladbare Module. Eine stabile Modulschnittstelle erlaubt unabhängige Aktualisierungen von Kern und Treibern. Erweiterungen erfolgen upstream. Hersteller verwenden definierte Schnittstellen; neue Kernelschnittstellen müssen Google vorgelegt werden, was lange dauern kann und frühzeitige Planung erfordert. Die Quelle nennt verpflichtendes GKI als Schwierigkeit der Android14-GMS/EDLA-Zertifizierung.

![GKI-Architektur](/docs/rockchip-android14-gki/images/architecture-en.png)

GKI-Architektur - Originalabbildung;PDF-Seite 5 (EN).

## 1.2 Produkte mit GKI-Anforderung

Laut Quelle benötigen GMS-/EDLA-Produkte GKI bei Android14, Android13 und Android12 auf RK3588/RK3588S. Ohne diese Zertifizierungen besteht diese Pflicht nicht.

## 1.3 GKI gegenüber Nicht-GKI

| Punkt | GKI | Nicht-GKI |
| --- | --- | --- |
| boot.img | Regelmäßig von Google; Code nicht lokal veränderbar. | Aus RK-Quellen gebaut; frei veränderbar. |
| Treibermodule | KO-Laden; Schnittstellen müssen in Google boot.img enthalten sein. | In boot eingebettet; RK-Quellen erlauben Änderungen/neue Schnittstellen. |
| Kernelquellen | RK-Quellen bauen nur Treiber-KO. | RK baut vollständigen Kernel/Treiber; Module als .o eingebettet. |

U-Boot benötigt Header V4 (Quelle:head4). GKI ergänzt vendor_boot, init_boot, resource und aktiviert A/B. Die englische Kernelcode-Tabelle wiederholt die Treibertabelle; oben bleibt der eigenständige chinesische Quellenvergleich erhalten.

## 2 Anpassungsstand

Quellkernel:6.1; alle folgenden Chips gelten als angepasst. SDK-Chipstatus, keine Boardqualifikation.

| Chip | Status |
| --- | --- |
| RK3562 | Angepasst |
| RK3568 | Angepasst |
| RK3566 | Angepasst |
| RK3588 | Angepasst |
| RK3588S | Angepasst |
| RK3326 | Angepasst |
| PX30 | Angepasst |
| RK3399 | Angepasst |
| RK3576 | Angepasst |

## 3 Upstream-Kernel herunterladen und bauen

Google veröffentlicht boot.img in größeren Abständen. Upstream kann für Prüfung/Debugging selbst gebaut werden. Google-Serverzugriff erforderlich; Ergebnis:out/boot.img.

```sh
repo init -u https://android.googlesource.com/kernel/manifest -b common-android14-6.1
tools/bazel run //common:kernel_aarch64_dist -- --dist_dir=out
```

## 4 SDK-Verzeichnisse

| Zweck | Pfad |
| --- | --- |
| Kernel-KO | mkcombinedroot/vendor_ramdisk/lib/modules/ |
| Google boot.img | mkcombinedroot/prebuilts/boot-6.1.img |
| Geschützte AOSP-KO | kernel/prebuilts/6.1/arm64/ |
| Kernel-6.1-KO-Startreihenfolge | mkcombinedroot/res/vendor_ramdisk_modules.load |
| Android-init-KO-Reihenfolge | mkcombinedroot/res/vendor_modules.load |

## 5 Buildumgebung

Chinesischer §5 und englischer §9 verlangen Ubuntu20.04+ sowie pahole1.25. Englischer §5 nennt dagegen pahole1.25 oder neuer; Widerspruch bleibt sichtbar. Englischer §9 wiederholt Anforderungen und verschiebt folgende Kapitelnummern um eins.

## 6.1 GKI aktivieren

BOARD_BUILD_GKI im Android-device-Produkt setzen; bei RK3562_UGO bereits aktiv. Separater U-Boot-Build benötigt A/B in config; vollständiges build.sh ergänzt das Makro automatisch. Der Quellpatch mischt rk3568/rk3588, Android13-Pfad und fasle statt false; Originalwerte, keine Empfehlung für ein fremdes Ziel.

```diff
~/a2_Android14_sdk/device/rockchip/rk3562$ git diff
diff --git a/rk3562_u/BoardConfig.mk b/rk3562_u/BoardConfig.mk
old mode 100644
new mode 100755
index 50da541..06da5f3
--- a/rk3562_u/BoardConfig.mk
+++ b/rk3562_u/BoardConfig.mk
@@ -15,10 +15,21 @@
#
include device/rockchip/rk3562/BoardConfig.mk
BUILD_WITH_GO_OPT := false
-BOARD_BUILD_GKI := fasle
+BOARD_BUILD_GKI := true
```

```diff
~/a2_Android13_sdk/u-boot$ git diff
diff --git a/configs/rk3568_defconfig b/configs/rk3568_defconfig
index fbd9820acc..e23e438792 100644
--- a/configs/rk3588_defconfig
+++ b/configs/rk3588_defconfig
@@ -207,6 +207,7 @@ CONFIG_RSA_N_SIZE=0x200
CONFIG_RSA_E_SIZE=0x10
CONFIG_RSA_C_SIZE=0x20
CONFIG_SHA512=y
CONFIG_LZ4=y
CONFIG_LZMA=y
CONFIG_SPL_GZIP=y
@@ -220,3 +221,4 @@ CONFIG_RK_AVB_LIBAVB_USER=y
CONFIG_OPTEE_CLIENT=y
CONFIG_OPTEE_V2=y
CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION=y
+CONFIG_ANDROID_AB=y
```

## 6.2 Images bauen

Vollbuild wie Nicht-GKI. Lokaler Kernelbuild erzeugt resource.img und KO für vendor_boot.img; der eigentliche Kernel kommt aus Googles mkcombinedroot/prebuilts/boot-6.1.img. update.img flashen; beim Debugging vendor_boot.img separat bauen.

```sh
source build/envsetup.sh
lunch rk3562_ugo-userdebug
./build.sh -ACUKup
# output: rockdev/Image-rk3562_ugo/update.img
make installclean;make vendorbootimage -j12
# output: out/target/product/rk3562_ugo/vendor_boot.img
```

## 6.3 Flashen

Komplettes rockdev/Image-rk3562_ugo/update.img mit Rockchip-Tool oder Einzelimages flashen. Rechtsklick in freien Toolbereich → Konfiguration importieren → TXT → parameter.txt. Passende Images auswählen; A/B verwenden dasselbe Image. Text nennt rockdev/Image-rk3588_t/, Baum rk3562_ugo; tatsächliches Produkt prüfen, Beispiele nicht mischen.

![Komplettimage flashen](/docs/rockchip-android14-gki/images/flash-complete-en.png)

Komplettimage flashen - Originalabbildung;PDF-Seite 9 (EN).

![Partitionskonfiguration importieren](/docs/rockchip-android14-gki/images/flash-import-en.png)

Partitionskonfiguration importieren - Originalabbildung;PDF-Seite 10 (EN).

![Einzelimages flashen](/docs/rockchip-android14-gki/images/flash-parts-en.png)

Einzelimages flashen - Originalabbildung;PDF-Seite 10 (EN).

```text
rockdev/Image-rk3562_ugo
├── baseparameter.img
├── boot.img
├── dtbo.img
├── init_boot.img
├── MiniLoaderAll.bin
├── misc.img
├── parameter.txt
├── resource.img
├── super.img
├── uboot.img
├── update.img
├── vbmeta.img
└── vendor_boot.img
```

## 7.1 Treibermodule ergänzen und bauen

1. Treiber im passenden kernel-6.1-Verzeichnis ablegen: gt1x unter drivers/input/touchscreen/ mit regulärem Makefile/Kconfig. 2. arch/arm64/configs/xxx_gki.config mit CONFIG_TOUCHSCREEN_GT1X=m anlegen; m erzeugt KO. 3. KO-Dateiname in passende .load-Liste eintragen.

| .load-Datei | Partition | Makefile | Ladephase |
| --- | --- | --- | --- |
| vendor_ramdisk_modules.load | vendor_boot | vendor_ramdisk_gki.mk | ramdisk init |
| vendor_modules.load | vendor | vendor_gki.mk | Android-Start |
| recovery_modules.load | recovery | recovery_gki.mk | Recovery |

Treiber ohne frühen Ladebedarf (Touchscreen/Sensoren) bevorzugt beim Android-Start laden. In mkcombinedroot xxx_tp.ko zu res/vendor_modules.load hinzufügen, danach super.img bauen/flashen. KO liegen in vendor_dlkm/lib/modules/; zum Debuggen dorthin pushen und für automatisches Laden neu starten. Bestehende Reihenfolge in mkcombinedroot/res/vendor_ramdisk_modules.load niemals ändern: Bootausfall möglich. Zusätzliche Ramdiskmodule verzögern den Start; vendor_modules.load wirkt sich weniger aus.

```sh
cd mkcombinedroot
```

```diff
diff --git a/res/vendor_modules.load b/res/vendor_modules.load
index e69de29..a53449f 100644
--- a/res/vendor_modules.load
+++ b/res/vendor_modules.load
@@ -0,0 +1,4 @@
pcie-dw-rockchip.ko
cfg80211.ko
+xxx_tp.ko
```

4. Kerneländerungen mit ./build.sh -K bauen: KO werden automatisch nach mkcombinedroot/vendor_ramdisk/lib/modules kopiert und im Vollbuild in vendor_boot.img/super.img gepackt. Bei separatem Kernelbuild ./copy_modules.sh in mkcombinedroot manuell ausführen. 5. Im Projektwurzelverzeichnis vendor_boot.img unten bauen und flashen; Vendor-KO benötigen vollständigen super.img-Build/Flash. 6. Boot prüfen; Vendor-KO können nach Start gepusht/manuell gemountet werden. Bei DTS-Änderung auch kernel-6.1/resource.img flashen. Chinesische Verifikation wiederholt Nummer5, englische zählt6.

```sh
make installclean;make vendorbootimage -j12
# output: out/target/product/rk3562_ugo/vendor_boot.img
```

| Bootmodus | Speicher | Display | Tasten | Akku | PMIC | TP | Sensoren | NFC/Wi-Fi/BT | Kamera |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Recovery | Y | Y | Y | Y | Y | N | N | N | N |
| Charger | Y | Y | Y | Y | Y | N | N | N | N |
| Android | Y | Y | Y | Y | Y | Y | Y | Y | Y |

AOSP-Ladematrix:Y bedeutet geladen, N nicht geladen.

## 8.1 U-Boot-Logs

| Inhalt | Header-Version |
| --- | --- |
| vendor_ramdisk (v-ramdisk) | V3+ |
| bootconfig | V4+ |

```text
## Booting Android Image at 0x003ff000 ...
Kernel: 0x00400000 - 0x03088ffc (45604 KiB)
v-ramdisk: 0x0a200000 - 0x0a6944c8 (4690 KiB)
ramdisk: 0x0a6944c8 - 0x0a7e54df (1349 KiB)
bootconfig: 0x0a7e54df - 0x0a7e559c (1 KiB)
bootparams: 0x0a7e559c - 0x0a7e759c
```

## 8.2 Android-Logs und bootconfig

Beispielversion laut Quelle:5.10.117-android13-9-00037-gbc08447eb7bd; Log nennt android12. Historische Muster, keine Android14/6.1-Buildversion. Header V4 darf androidboot.xxx nicht in der Kernel-Cmdline führen; dafür bootconfig verwenden, mit cat /proc/bootconfig prüfen.

```text
[ 0.000000][ T0] Booting Linux on physical CPU 0x0000000000 [0x412fd050]
[ 0.000000][ T0] Linux version 5.10.117-android12-9-00037-gbc08447eb7bd
(build-user@build-host) (Android (7284624, based on r416183b) clang version
12.0.5 (https://android.googlesource.com/toolchain/llvm-project
c935d99d7cf2016289302412d708641d52d2f7ee), LLD 12.0.5
(/buildbot/src/android/llvm-toolchain/out/llvm-project/lld c935d99d7cf2016289302412d708641d52d2f7ee)) #1 SMP PREEMPT
Thu Aug 25 15:24:20 UTC 2022
```

```text
[ 0.000000][ T0] Kernel command line: stack_depot_disable=on
kasan.stacktrace=off kvm-arm.mode=protected cgroup_disable=pressure
cgroup.memory=nokmem storagemedia=emmc console=ttyFIQ0 firmware_class.path=/vendor/etc/firmware
init=/init rootwait ro loop.max_part=7 bootconfig buildvariant=userdebug earlycon=uart8250,mmio32,0xfeb50000 irqchip.gicv3_pseudo_nmi=0
```

## 8.3 Erfolgreiches KO-Laden

```text
[ 1.034730][ T1] Run /init as init process
[ 1.036190][ T1] init: init first stage started!
[ 1.040534][ T1] init: Loading module /lib/modules/io-domain.ko with args
''
[ 1.042038][ T1] init: Loaded kernel module /lib/modules/io-domain.ko
```

## 8.4 KO-Ladefehler

```text
[ 0.805736][ T1] cryptodev: Unknown symbol crypto_ahash_final (err -2)
[ 0.806383][ T1] cryptodev: Unknown symbol sg_nents (err -2)
[ 0.806972][ T1] cryptodev: Unknown symbol crypto_alloc_akcipher (err -2)
[ 0.819768][ T1] Kernel panic - not syncing: Attempted to kill init!
exitcode=0x00007f00
```

Unknown symbol bedeutet fehlende Exporte crypto_ahash_final, sg_nents, crypto_alloc_akcipher in boot.img. Anderen Export nutzen (kernel-6.1/android durchsuchen) oder notwendige Erweiterung gemäß §10 einreichen. Englischer §8.4 sagt lediglich, dies trete normalerweise nicht auf, und verweist auf den hier fehlenden Abschnitt „Noun explanation – ABI“. Chinesische Lösung und der im Englischen fehlende Fall Exec format error bleiben erhalten.

```text
[ 1.825070][ T1] init: Failed to insmod '/lib/modules/gc05a2.ko' with args
'': Exec format error
[ 1.825094][ T1] init: LoadWithAliases was unable to load gc05a2
[ 1.826118][ T1] init: Failed to load kernel modules
[ 1.827032][ T1] init: InitFatalReboot: signal 6
[ 1.836535][ T1] init: #00 pc 000000000031fe7c /init
(unwindstack::AndroidLocalUnwinder::InternalUnwind(std::__1::optional<int>,
unwindstack::AndroidUnwinderData&)+92) (BuildId:
aec5ebfd90cec4000c74ac83c809ae14)
[ 1.836603][ T1] init: #01 pc 000000000031444c /init
(android::init::InitFatalReboot(int)+204) (BuildId:
aec5ebfd90cec4000c74ac83c809ae14)
[ 1.836638][ T1] init: #02 pc 0000000000314b00 /init
(android::init::InstallRebootSignalHandlers()::$_0::__invoke(int)+32) (BuildId:
aec5ebfd90cec4000c74ac83c809ae14)
[ 1.836658][ T1] init: #03 pc 0000000000000860 [vdso]
[ 1.836685][ T1] init: #04 pc 00000000004ddfb0 /init (abort+176)
(BuildId: aec5ebfd90cec4000c74ac83c809ae14)
[ 1.836719][ T1] init: #05 pc 0000000000319dac /init
(android::init::InitAborter(char const*)+44) (BuildId:
aec5ebfd90cec4000c74ac83c809ae14)
[ 1.836760][ T1] init: #06 pc 000000000049eed0 /init
(android::base::SetAborter(std::__1::function<void (char
const*)>&&)::$_0::__invoke(char const*)+80) (BuildId:
aec5ebfd90cec4000c74ac83c809ae14)
[ 1.836793][ T1] init: #07 pc 000000000049e664 /init
(android::base::LogMessage::~LogMessage()+356) (BuildId:
aec5ebfd90cec4000c74ac83c809ae14)
[ 1.836824][ T1] init: #08 pc 000000000030adc8 /init
(android::init::FirstStageMain(int, char**)+8696) (BuildId:
aec5ebfd90cec4000c74ac83c809ae14)
[ 1.836870][ T1] init: #09 pc 00000000004dbd9c /init
(__real_libc_init(void*, void (*)(), int (*)(int, char**, char**),
structors_array_t const*, bionic_tcb*)+716) (BuildId:
aec5ebfd90cec4000c74ac83c809ae14)
[ 1.836887][ T1] init: Reboot ending, jumping to kernel
```

Exec format error bei gc05a2.ko weist auf abweichende Buildumgebung hin, meist pahole. pahole --version soll v1.25 melden. Quelle empfiehlt folgenden Build; Entfernen von installiertem dwarves verändert den Host. Der „aktuelle“ Clone ist nicht gepinnt; Ergebnis gegen1.25-Anforderung prüfen. Bei Buildfehler nennt die chinesische Quelle https://pan.baidu.com/s/1JP1F0EjzSn25ZVUsbO89Zg (Code zy6z) als Ersatz für /usr/local/bin/pahole; ungeprüfter historischer Download, keine getestete Binärempfehlung.

```sh
pahole --version
git clone https://git.kernel.org/pub/scm/devel/pahole/pahole.git
sudo apt-get install cmake
sudo apt-get install libdw-dev
sudo apt-get --purge remove dwarves
# Run the following in the cloned pahole directory
mkdir build
cd build/
cmake -D__LIB=lib -DBUILD_SHARED_LIBS=OFF ..
sudo make install
pahole --version
```

## 8.5 bootcmdline-Parsingfehler

```text
Failed to parse bootconfig: Value is redefined at 416.
```

Doppelte Cmdlinefelder verhindern Boot oder führen zu Recovery. In U-Boot über serielle Konsole Ctrl+P halten, gesamte Cmdline ausgeben, Duplikat finden und doppelte Definition in device/Kernel-DTS entfernen.

## 8.6 Mali-KO-Fehler

Unpassendes GPU-KO kann beim „Rockchip kernel“-Logo hängen bleiben und surfaceflinger-Abstürze in logcat erzeugen. Das Muster unten bleibt erhalten; lr/sp-Zeile ist bereits in beiden PDFs beschädigt/abgeschnitten und wird nicht erfunden ergänzt. GPU-KO neu bauen und nach vendor/rockchip/common/gpu kopieren. In PRODUCT_KERNEL_CONFIG des device-Produkts passende Chip-GPU-Konfiguration ergänzen.

```text
04-27 22:45:27.653 366 366 F DEBUG : *** *** *** *** *** *** *** *** ***
*** *** *** *** *** *** ***
04-27 22:45:27.653 366 366 F DEBUG : Build fingerprint:
'rockchip/rk3562_t/rk3562_t:13/TQ2A.230305.008.F1/eng.wlq.20230427.101925:userdebug/release-keys'
04-27 22:45:27.653 366 366 F DEBUG : Revision: '0'
04-27 22:45:27.653 366 366 F DEBUG : ABI: 'arm64'
04-27 22:45:27.653 366 366 F DEBUG : Timestamp: 2023-04-27
22:45:27.509738048+0000
04-27 22:45:27.653 366 366 F DEBUG : Process uptime: 2s
04-27 22:45:27.653 366 366 F DEBUG : Cmdline: /system/bin/surfaceflinger
04-27 22:45:27.653 366 366 F DEBUG : pid: 335, tid: 360, name:
surfaceflinger >>> /system/bin/surfaceflinger <<<
04-27 22:45:27.653 366 366 F DEBUG : uid: 1000
04-27 22:45:27.653 366 366 F DEBUG : tagged_addr_ctrl: 0000000000000001
(PR_TAGGED_ADDR_ENABLE)
04-27 22:45:27.653 366 366 F DEBUG : signal 6 (SIGABRT), code -1
(SI_QUEUE), fault addr --------
04-27 22:45:27.653 366 366 F DEBUG : Abort message: 'no suitable EGLConfig
found, giving up'
04-27 22:45:27.653 366 366 F DEBUG : x0 0000000000000000 x1
0000000000000168 x2 0000000000000006 x3 000000710899d340
04-27 22:45:27.654 366 366 F DEBUG : x4 7568661f2b636d74 x5
7568661f2b636d74 x6 7568661f2b636d74 x7 7f7f7f7f7f7f7f7f
04-27 22:45:27.654 366 366 F DEBUG : x8 00000000000000f0 x9
000000739bcbda00 x10 0000000000000001 x11 000000739bcff6a0
04-27 22:45:27.654 366 366 F DEBUG : x12 000000710899d310 x13
0000000000000027 x14 000000710899d4e0 x15 00000000197b1a4f
04-27 22:45:27.654 366 366 F DEBUG : x16 000000739bd6dd58 x17
000000739bd48770 x18 0000007108812000 x19 00000000000000ac
04-27 22:45:27.654 366 366 F DEBUG : x20 00000000000000b2 x21
000000000000014f x22 0000000000000168 x23 00000000ffffffff
04-27 22:45:27.654 366 366 F DEBUG : x24 b4000071bbca60b0 x25
000000710899dcb0 x26 000000710899dff8 x27 00000000000fe000
04-27 22:45:27.654 366 366 F DEBUG : x28 000000710899daf0 x29
000000710899d3c0
04-27 22:45:27.654 366 366 F DEBUG : lr 000000739bcef3f4 sp
00000071089ndroid.runtime/lib64/bionic/libc.so (__pthread_start(void*)+208)
(BuildId: e2429c64ab29f2d0ffc5a8f42c0c1b80)
04-27 22:45:27.655 366 366 F DEBUG : #09 pc 0000000000054c50
/apex/com.android.runtime/lib64/bionic/libc.so (__start_thread+64) (BuildId:
e2429c64ab29f2d0ffc5a8f42c0c1b80)
```

| Chip | PRODUCT_KERNEL_CONFIG |
| --- | --- |
| RK3588 | gki_defconfig rockchip_gki.config |
| RK356X/RK3562 | gki_defconfig rockchip_gki.config rk356x.config |
| RK3326/RK3326-S; PX30/PX30-S | gki_defconfig rockchip_gki.config rk3326.config |
| RK3399 | gki_defconfig rockchip_gki.config rk3399.config |

Für RK3399 rk3399.config unten ändern, ./build.sh -CK ausführen und Mali-KO wie oben nach vendor kopieren.

```diff
wlq@sys2_206:~/a0_Android13_gki/mkcombinedroot$ git diff configs/
diff --git a/configs/rk3399.config b/configs/rk3399.config
old mode 100644
new mode 100755
index 0d66674..a003ba5
--- a/configs/rk3399.config
+++ b/configs/rk3399.config
@@ -1,4 +1,11 @@
-CONFIG_MALI_MIDGARD=y
+CONFIG_MALI_MIDGARD=m
+CONFIG_MALI_PLATFORM_THIRDPARTY_NAME="rk"
+CONFIG_MALI_PLATFORM_THIRDPARTY=y
+CONFIG_MALI_DEBUG=y
+CONFIG_MALI_DEVFREQ=y
+CONFIG_MALI_DT=y
+CONFIG_MALI_EXPERT=y
+CONFIG_MALI_SHARED_INTERRUPTS=y
```

## 8.7 Kernel-Buildfehler

```text
BTF .btf.vmlinux.bin.o
Segmentation fault (core dumped)
LD .tmp_vmlinux.kallsyms1
KSYMS .tmp_vmlinux.kallsyms1.S
AS .tmp_vmlinux.kallsyms1.S
LD .tmp_vmlinux.kallsyms2
KSYMS .tmp_vmlinux.kallsyms2.S
AS .tmp_vmlinux.kallsyms2.S
LD vmlinux
BTFIDS vmlinux
FAILED: load BTF from vmlinux: Unknown error -22Makefile:1293: recipe for target
'vmlinux' failed
make[1]: *** [vmlinux] Error 255
arch/arm64/Makefile:214: recipe for target 'rk3588-evb1-lp4-v10.img' failed
make: *** [rk3588-evb1-lp4-v10.img] Error 2
failed to build some targets (21 seconds)
```

Beim BTF-Segfault/-22 wiederholt die Quelle pahole-Installation aus §8.4: Clone, cmake/libdw-dev, dwarves entfernen, build/, statische Konfiguration -DBUILD_SHARED_LIBS=OFF, sudo make install und Versionsprüfung. Chinesisch wiederholt Ersatzdownload/Code aus §8.4; Englisch lässt diesen weg und ergänzt §9 mit Ubuntu20.04+/pahole1.25.

## 9.1 Mehr Modulladelogs

Init-Logbegrenzung lockern, damit KO-Fehler sichtbar werden; Quelle ergänzt printk.devkmsg=on in device/rockchip/common/BoardConfig.mk.

```diff
xxx@sys2_206:~/a0_Android13_gki/device/rockchip/common$ vim BoardConfig.mk
xxx@sys2_206:~/a0_Android13_gki/device/rockchip/common$ git diff
diff --git a/BoardConfig.mk b/BoardConfig.mk
index 0d1c886..1761ed0 100755
--- a/BoardConfig.mk
+++ b/BoardConfig.mk
@@ -392,3 +392,5 @@ ifeq ($(strip $(BOARD_BASEPARAMETER_SUPPORT)), true)
endif
BOARD_WITH_SPECIAL_PARTITIONS := baseparameter:1M
endif
+
+BOARD_KERNEL_CMDLINE += printk.devkmsg=on
```

## 9.2 Debug-boot.img packen

Kernel regulär zu arch/arm64/boot/Image bauen und mit Header4 packen:

```sh
mkbootimg --kernel arch/arm64/boot/Image --header_version 4 --output ../mkcombinedroot/prebuilts/boot-6.1.img
```

## 9.3 Veröffentlichte Kernelschnittstellen

Standard-Schnittstellendefinitionen liegen in upstream common/android:

```text
:~/a5_google_kenrel/common$ tree a
android/ arch/
wlq@sys2_206:~/a5_google_kenrel/common$ tree android/
android/
├── abi_gki_aarch64
├── abi_gki_aarch64_core
├── abi_gki_aarch64_db845c
├── abi_gki_aarch64_exynos
├── abi_gki_aarch64_fips140
├── abi_gki_aarch64_galaxy
├── abi_gki_aarch64_generic
├── abi_gki_aarch64_hikey960
├── abi_gki_aarch64_rockchip
├── abi_gki_aarch64_type_visibility
├── abi_gki_aarch64_virtual_device
├── abi_gki_aarch64.xml
├── abi_gki_modules_exports
├── abi_gki_modules_protected
├── gki_aarch64_fips140_modules
├── gki_aarch64_modules
└── gki_system_dlkm_modules
```

## 10 Schnittstellen upstream einreichen

Patch der neuen Schnittstelle über Rockchip Redmine zur Prüfung einreichen; Rockchip reicht gesammelt bei Google ein. Beispiel für r8168.ko:

```diff
diff --git a/android/abi_gki_aarch64_rockchip b/android/abi_gki_aarch64_rockchip
index 85bd8bc134cf..3344cf064e06 100644
--- a/android/abi_gki_aarch64_rockchip
+++ b/android/abi_gki_aarch64_rockchip
@@ -2144,6 +2144,15 @@
mmc_pwrseq_register
mmc_pwrseq_unregister
+# required by r8168.ko
+ pci_set_mwi
+ pci_clear_mwi
+ proc_get_parent_data
+ skb_checksum_help
+ __skb_gso_segment
+ remove_proc_subtree
+ pci_choose_state
+
# required by reboot-mode.ko
devres_release
kernel_kobj
```

## 11 AOSP boot und geschützte Module aktualisieren

AOSP veröffentlicht boot.img und passende geschützte KO. Unter https://source.android.com/docs/core/architecture/kernel/gki-android14-6_1-release-builds passenden Android14-6.1-Release wählen, boot-6.1.img nach mkcombinedroot/prebuilts/boot-6.1.img kopieren. Ab Android14 geschützte Module gemeinsam herunterladen: Sie müssen zu boot.img passen. Über kernel-Link system_dlkm_staging_archive.tar.gz laden; KO aus flatten/lib/modules/ nach kernel/prebuilts/6.1/arm64/ kopieren. Dort modules.load nicht aktualisieren: Austausch kann Laden verhindern. Nach Entpacken/Kopieren auf versehentliches Überschreiben prüfen.

![AOSP-boot-Download](/docs/rockchip-android14-gki/images/aosp-boot-en.png)

AOSP-boot-Download - Originalabbildung;PDF-Seite 19 (EN).

![Passende geschützte Module](/docs/rockchip-android14-gki/images/aosp-modules-en.png)

Passende geschützte Module - Originalabbildung;PDF-Seite 19 (EN).

## 12.1 Separates vendor_boot: KO bauen

Fünf Schritte:KO bauen → kopieren → passendes Basis-vendor_boot.img beschaffen → mit mkgki4.sh packen → flashen/prüfen. Für Android14/kernel6.1:

```sh
cd kernel-6.1
export PATH=../prebuilts/clang/host/linux-x86/clang-r487747c/bin:$PATH
make CROSS_COMPILE=aarch64-linux-gnu- LLVM=1 LLVM_IAS=1 ARCH=arm64 gki_defconfig rockchip_gki.config && make CROSS_COMPILE=aarch64-linux-gnu- LLVM=1 LLVM_IAS=1 ARCH=arm64 rk3562-rk817-tablet-v10.img -j32
```

## 12.2 KO ohne Debugdaten kopieren

```sh
llvm-objcopy --strip-debug drivers/xxx.ko ../mkcombinedroot/vendor_ramdisk/lib/modules/xxx.ko
```

## 12.3 Basisimage kopieren

Basis-vendor_boot.img nach mkcombinedroot kopieren, analog boot_sample.img bei separatem boot.img. Es muss dem aktuellen Image des Zielgeräts entsprechen; aus passender GKI-Firmware beziehen.

## 12.4 Neu packen

DTS bezeichnet Board-DTS und benötigt definierten Loadnamen unter res/board/. Quelle wechselt von RK3562 zu RK3568; passendes Board wählen, nicht mischen. Ergebnis:mkcombinedroot/new_vendor_boot.img.

```sh
cd ../mkcombinedroot/
./mkgki4.sh DTS=rk3568-evb1-ddr4-v10
```

## 12.5 Flashen und prüfen

new_vendor_boot.img flashen und Boot prüfen. GKI ist meist A/B: vendor_boot_a und vendor_boot_b aktualisieren. Nach mehreren Fehlstarts mit Fastboot verlangt die Quelle zusätzlich misc.img zum Löschen der Flags. Zustandsändernde Schritte:passende Images und Backup erforderlich. Die Ubuntu-Beispiele enthalten wörtlich new_vendor_boot.img/vendor_boot.img, widersprüchlich zum erzeugten Einzelfile. Als Quellfehler erhalten, kein sofort ausführbarer Pfad; tatsächliche Datei prüfen. Vendor-KO können nach Boot gepusht/manuell gemountet werden; DTS-Änderungen benötigen zusätzlich kernel-6.1/resource.img.

```sh
sudo ./upgrade_tool di -vendor_boot_a mkcombinedroot/new_vendor_boot.img/vendor_boot.img
sudo ./upgrade_tool di -vendor_boot_b mkcombinedroot/new_vendor_boot.img/vendor_boot.img;
sudo ./upgrade_tool rd
```

{% endraw %}
