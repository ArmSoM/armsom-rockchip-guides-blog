---
title: "Rockchip Android14 GKI: modules, builds and troubleshooting"
description: "Rockchip Android14 GKI: modules, builds and troubleshooting"
excerpt: "Rockchip Android14 GKI: modules, builds and troubleshooting"
translation_key: "244-rockchip-android14-gki"
slug: "244-rockchip-android14-gki"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM","Rockchip","Android"]
---

{% raw %}

# Rockchip Android14 GKI: modules, builds and troubleshooting

Source scope: Rockchip Android14 GKI, Chinese RK-KF-YF-775 and English RK-KF-YF-778, both V1.1.1 , 21 pages each. Chinese numbering and the complete Chinese technical body are the mainline. English differences are identified below. These are historical SDK procedures and certification statements, not a current policy check or verified ArmSoM board support. Commands are documentary examples, not executed hardware tests; back up data before flashing or changing partitions.

## 1.1 What GKI means

GKI (Generic Kernel Image) addresses kernel fragmentation through a common core kernel with SoC/board drivers moved into loadable modules. A stable kernel module interface permits independent updates of modules and the core. Interfaces can be extended upstream. Vendors must use the defined interfaces; new core interfaces must be submitted to Google, a potentially long process that requires advance planning. The source describes mandatory GKI as a difficulty for Android14 GMS/EDLA certification.

![GKI architecture](/docs/rockchip-android14-gki/images/architecture-en.png)

GKI architecture - Original source figure; PDF page 5 (EN).

## 1.2 Products requiring GKI

The source requires GKI for products seeking GMS and EDLA certification with Android14, Android13, or Android12 on RK3588/RK3588S. Products not seeking these certifications are not forced to use GKI.

## 1.3 GKI versus non-GKI

| Item | GKI | Non-GKI |
| --- | --- | --- |
| boot.img | Google periodically releases it; its code cannot be modified locally. | Built from RK sources; freely modifiable. |
| Driver modules | KO loading; called interfaces must be exported by Google boot.img. | Embedded in boot; RK sources allow modification/new interfaces. |
| Kernel sources | RK sources compile driver KO only. | RK sources build the full kernel and drivers, with .o modules embedded. |

U-Boot must support header V4 (source spelling head4). GKI adds vendor_boot, init_boot and resource partitions and enables A/B. The English kernel-code table repeats its driver-module table; the distinct Chinese kernel-code comparison above is retained.

## 2 Adaptation status

The source kernel is 6.1; each listed chip is marked adapted. This is a chip-level SDK statement, not a board qualification.

| Chip | Status |
| --- | --- |
| RK3562 | Adapted |
| RK3568 | Adapted |
| RK3566 | Adapted |
| RK3588 | Adapted |
| RK3588S | Adapted |
| RK3326 | Adapted |
| PX30 | Adapted |
| RK3399 | Adapted |
| RK3576 | Adapted |

## 3 Upstream kernel download and build

Google publishes boot.img at relatively long intervals. Download its upstream kernel to build a boot.img for validation/debugging. Access to Google servers is required; the resulting image is out/boot.img.

```sh
repo init -u https://android.googlesource.com/kernel/manifest -b common-android14-6.1
tools/bazel run //common:kernel_aarch64_dist -- --dist_dir=out
```

## 4 SDK directories

| Purpose | Path |
| --- | --- |
| Kernel KO files | mkcombinedroot/vendor_ramdisk/lib/modules/ |
| Google boot.img | mkcombinedroot/prebuilts/boot-6.1.img |
| AOSP protected KO | kernel/prebuilts/6.1/arm64/ |
| Kernel-6.1 KO startup order | mkcombinedroot/res/vendor_ramdisk_modules.load |
| Android init KO order | mkcombinedroot/res/vendor_modules.load |

## 5 Build environment

Use Ubuntu20.04 or newer and pahole1.25 according to Chinese §5 and English §9. English §5 instead says pahole1.25 or newer; this difference is not silently resolved. English §9 repeats these requirements and shifts subsequent chapter numbers by one.

## 6.1 Enable GKI

Set BOARD_BUILD_GKI in the Android device product directory; RK3562_UGO already enables it. For standalone U-Boot compilation enable A/B in its config; a complete build.sh build adds the A/B macro automatically. The source patch mixes rk3568/rk3588 filenames, includes an Android13 checkout and spells false as fasle; these source literals are retained, not instructions to select an unrelated target.

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

## 6.2 Build images

Full compilation is the same as non-GKI. The local kernel build produces resource.img and KO modules packaged into vendor_boot.img; the actual kernel is Google’s mkcombinedroot/prebuilts/boot-6.1.img. Flash the resulting update.img. During debugging, vendor_boot.img can be built independently.

```sh
source build/envsetup.sh
lunch rk3562_ugo-userdebug
./build.sh -ACUKup
# output: rockdev/Image-rk3562_ugo/update.img
make installclean;make vendorbootimage -j12
# output: out/target/product/rk3562_ugo/vendor_boot.img
```

## 6.3 Flashing

Either flash rockdev/Image-rk3562_ugo/update.img with the Rockchip development tool, or flash separate images. For separate images, right-click the tool’s blank area → import configuration → import TXT → parameter.txt. Select each corresponding image; A and B use the same image. The prose names rockdev/Image-rk3588_t/ but its tree names rk3562_ugo; select your actual product, not a mixed example.

![Complete-image flashing](/docs/rockchip-android14-gki/images/flash-complete-en.png)

Complete-image flashing - Original source figure; PDF page 9 (EN).

![Import partition configuration](/docs/rockchip-android14-gki/images/flash-import-en.png)

Import partition configuration - Original source figure; PDF page 10 (EN).

![Separate-image flashing](/docs/rockchip-android14-gki/images/flash-parts-en.png)

Separate-image flashing - Original source figure; PDF page 10 (EN).

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

## 7.1 Adding and building driver modules

1. Place the new driver in the appropriate kernel-6.1 directory. For gt1x touchscreen, use drivers/input/touchscreen/ and add its Makefile and Kconfig normally. 2. Create arch/arm64/configs/xxx_gki.config and add CONFIG_TOUCHSCREEN_GT1X=m; m builds a KO. 3. Add its filename to the appropriate .load list.

| .load file | Partition | Makefile | Load stage |
| --- | --- | --- | --- |
| vendor_ramdisk_modules.load | vendor_boot | vendor_ramdisk_gki.mk | ramdisk init |
| vendor_modules.load | vendor | vendor_gki.mk | Android startup |
| recovery_modules.load | recovery | recovery_gki.mk | Recovery |

For drivers without early-load requirements, such as touchscreens/sensors, prefer Android-stage loading. Enter mkcombinedroot and add xxx_tp.ko to res/vendor_modules.load as below, then build and flash super.img. Such KO files are placed in vendor_dlkm/lib/modules/; while debugging, push the compiled KO there and reboot to load it automatically. Never change the existing order of mkcombinedroot/res/vendor_ramdisk_modules.load: this can prevent boot. Avoid adding modules there unnecessarily; more ramdisk modules slow boot. vendor_modules.load has less impact.

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

4. Prefer ./build.sh -K for kernel changes: it automatically copies KO to mkcombinedroot/vendor_ramdisk/lib/modules, from which a full build packs vendor_boot.img or super.img. A standalone build in kernel does not copy them; enter mkcombinedroot and run ./copy_modules.sh yourself. 5. From the project root, pack vendor_boot.img using the following command and flash its output. Vendor-partition KO instead require a complete super.img build/flash. 6. Boot to verify. Vendor KO may be pushed and manually mounted for testing after startup. If DTS changes, also flash kernel-6.1/resource.img. The Chinese source repeats step number5 for verification; English numbers it6.

```sh
make installclean;make vendorbootimage -j12
# output: out/target/product/rk3562_ugo/vendor_boot.img
```

| Boot mode | Storage | Display | Keypad | Battery | PMIC | TP | Sensors | NFC/Wi-Fi/BT | Camera |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Recovery | Y | Y | Y | Y | Y | N | N | N | N |
| Charger | Y | Y | Y | Y | Y | N | N | N | N |
| Android | Y | Y | Y | Y | Y | Y | Y | Y | Y |

AOSP loading-stage matrix: Y means loaded; N means not loaded.

## 8.1 U-Boot logs

| Content | Header version |
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

## 8.2 Android logs and bootconfig

The source calls its example GKI version 5.10.117-android13-9-00037-gbc08447eb7bd, but the log says android12; both are historical samples, not the Android14/6.1 build version. Header V4 must not carry androidboot.xxx in the kernel command line; these belong in bootconfig, inspected with cat /proc/bootconfig.

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

## 8.3 Successful KO loading

```text
[ 1.034730][ T1] Run /init as init process
[ 1.036190][ T1] init: init first stage started!
[ 1.040534][ T1] init: Loading module /lib/modules/io-domain.ko with args
''
[ 1.042038][ T1] init: Loaded kernel module /lib/modules/io-domain.ko
```

## 8.4 KO loading errors

```text
[ 0.805736][ T1] cryptodev: Unknown symbol crypto_ahash_final (err -2)
[ 0.806383][ T1] cryptodev: Unknown symbol sg_nents (err -2)
[ 0.806972][ T1] cryptodev: Unknown symbol crypto_alloc_akcipher (err -2)
[ 0.819768][ T1] Kernel panic - not syncing: Attempted to kill init!
exitcode=0x00007f00
```

Unknown-symbol errors show that boot.img does not export crypto_ahash_final, sg_nents and crypto_alloc_akcipher. Use another exported interface (search kernel-6.1/android), or if the interface is essential submit an extension as in §10. English §8.4 only says this normally does not happen and refers to “Noun explanation – ABI”, a section absent from this PDF. The Chinese resolution and following Exec format error case are retained here; English omits the latter.

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

Exec format error loading gc05a2.ko indicates a build-environment mismatch, usually the wrong pahole version. Check pahole --version for v1.25. The source proposes downloading/building pahole as below; if dwarves is installed, its removal affects the host environment. The “latest” clone is not pinned, so verify the resulting version against the stated1.25 requirement. If building fails, the Chinese source provides https://pan.baidu.com/s/1JP1F0EjzSn25ZVUsbO89Zg (code zy6z), to replace /usr/local/bin/pahole. This is an unverified historical download, not a tested binary recommendation.

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

## 8.5 bootcmdline parsing error

```text
Failed to parse bootconfig: Value is redefined at 416.
```

The device cannot boot or enters recovery because cmdline fields are duplicated. Hold Ctrl+P on the serial console during U-Boot to print all cmdline information. Locate the duplicate field, search its definitions in device and kernel DTS, and remove the duplicate definition.

## 8.6 Mali KO failure

A mismatched GPU KO can leave the display at “Rockchip kernel” and crash surfaceflinger in logcat. Preserve the diagnostic sample below; its lr/sp line is already truncated/corrupted in both source PDFs and is not reconstructed. Recompile the GPU KO and copy it to the corresponding vendor/rockchip/common/gpu directory. Add the chip-specific GPU configuration to PRODUCT_KERNEL_CONFIG in the device product directory.

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

For RK3399 change rk3399.config as follows, run ./build.sh -CK, then copy the resulting Mali KO to vendor as above.

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

## 8.7 Kernel build failure

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

For the BTF segmentation fault / error -22 above, the source repeats the pahole installation procedure in §8.4: clone, install cmake/libdw-dev, remove existing dwarves, create build/, configure static compilation with -DBUILD_SHARED_LIBS=OFF, sudo make install, then verify the version. Chinese repeats the prebuilt download/code from §8.4 if building fails; English omits that fallback and instead repeats Ubuntu20.04+/pahole1.25 in its §9.

## 9.1 More module-loading logs

Relax init logging rate limits to reveal otherwise hidden KO errors. The source implements this by adding printk.devkmsg=on in device/rockchip/common/BoardConfig.mk.

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

## 9.2 Pack a debug boot.img

Build the kernel normally to produce arch/arm64/boot/Image, then pack it with header4:

```sh
mkbootimg --kernel arch/arm64/boot/Image --header_version 4 --output ../mkcombinedroot/prebuilts/boot-6.1.img
```

## 9.3 Published kernel interfaces

Standard interface definitions are in the upstream common/android directory:

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

## 10 Submit interfaces upstream

Generate a patch for the new interface, submit it through Rockchip Redmine for review, then Rockchip submits it to Google collectively. Example additions required by r8168.ko:

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

## 11 Update AOSP boot and protected modules

AOSP periodically releases boot.img and matching protected KO. Open https://source.android.com/docs/core/architecture/kernel/gki-android14-6_1-release-builds, select the intended Android14-6.1 release and download boot-6.1.img; copy it to mkcombinedroot/prebuilts/boot-6.1.img. From Android14, download the protected modules with it: they must match boot.img to load correctly. Follow the kernel link for system_dlkm_staging_archive.tar.gz; extract and copy KO from flatten/lib/modules/ into kernel/prebuilts/6.1/arm64/. Do not update kernel/prebuilts/6.1/arm64/modules.load: replacing it can prevent module loading. Check it after extraction/copy because it may be overwritten.

![AOSP boot release download](/docs/rockchip-android14-gki/images/aosp-boot-en.png)

AOSP boot release download - Original source figure; PDF page 19 (EN).

![Matching protected modules](/docs/rockchip-android14-gki/images/aosp-modules-en.png)

Matching protected modules - Original source figure; PDF page 19 (EN).

## 12.1 Standalone vendor_boot: compile KO

The five-step flow is compile KO → copy KO → obtain a matching base vendor_boot.img → repack with mkgki4.sh → flash and verify. For Android14/kernel6.1, enter the kernel directory, export clang and build:

```sh
cd kernel-6.1
export PATH=../prebuilts/clang/host/linux-x86/clang-r487747c/bin:$PATH
make CROSS_COMPILE=aarch64-linux-gnu- LLVM=1 LLVM_IAS=1 ARCH=arm64 gki_defconfig rockchip_gki.config && make CROSS_COMPILE=aarch64-linux-gnu- LLVM=1 LLVM_IAS=1 ARCH=arm64 rk3562-rk817-tablet-v10.img -j32
```

## 12.2 Copy stripped KO

```sh
llvm-objcopy --strip-debug drivers/xxx.ko ../mkcombinedroot/vendor_ramdisk/lib/modules/xxx.ko
```

## 12.3 Copy the base image

Copy a base vendor_boot.img into mkcombinedroot, just as standalone boot.img uses boot_sample.img. It must match the vendor_boot.img currently in the target device; obtain it from the corresponding GKI firmware.

## 12.4 Repack

DTS is the board DTS name and must use a load name defined under res/board/. The source switches from an RK3562 build example to RK3568 here; choose the actual matching board rather than mixing them. Output is mkcombinedroot/new_vendor_boot.img.

```sh
cd ../mkcombinedroot/
./mkgki4.sh DTS=rk3568-evb1-ddr4-v10
```

## 12.5 Flash and verify

Flash new_vendor_boot.img and boot to verify. GKI firmware is generally A/B, so update both vendor_boot_a and vendor_boot_b. If repeated abnormal restarts already forced fastboot, the source also requires flashing misc.img to clear its flags. These are state-changing operations; use matching images and back up data. The Ubuntu examples below literally contain new_vendor_boot.img/vendor_boot.img, which conflicts with the generated single-file path above; preserved as a source defect, not a ready-to-run path. Verify the actual file before use. Vendor KO may be pushed/manually mounted after boot; DTS changes additionally require kernel-6.1/resource.img.

```sh
sudo ./upgrade_tool di -vendor_boot_a mkcombinedroot/new_vendor_boot.img/vendor_boot.img
sudo ./upgrade_tool di -vendor_boot_b mkcombinedroot/new_vendor_boot.img/vendor_boot.img;
sudo ./upgrade_tool rd
```

{% endraw %}
