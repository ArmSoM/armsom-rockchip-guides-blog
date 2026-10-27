---
title: "Rockchip Android14 GKI：模块、编译与故障排查"
description: "Rockchip Android14 GKI：模块、编译与故障排查"
excerpt: "Rockchip Android14 GKI：模块、编译与故障排查"
translation_key: "244-rockchip-android14-gki"
slug: "244-rockchip-android14-gki"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM","Rockchip","Android"]
---

{% raw %}

# Rockchip Android14 GKI：模块、编译与故障排查

来源范围：Rockchip Android14 GKI，中文 RK-KF-YF-775、英文 RK-KF-YF-778，均为 V1.1.1，各21页。以中文编号和完整技术正文为主线，下文说明英文差异。认证与SDK操作为原稿历史说明，不代表当前政策核验或ArmSoM板卡已验证支持。命令为文档示例而非硬件实测，烧录及改分区前须备份数据。

## 1.1 什么是GKI

GKI（Generic Kernel Image，通用内核映像）通过统一核心内核并将SoC及板级驱动移入可加载模块来解决内核碎片化。核心提供稳定模块接口，使驱动与核心能独立更新；接口可通过upstream扩展。厂商开发应使用已定义接口，新核心接口须提交Google，周期可能较长，应提前准备。原稿将Android14 GMS/EDLA认证强制GKI列为难点。

![GKI架构](/docs/rockchip-android14-gki/images/architecture.png)

GKI架构 - 原稿技术图；PDF页 4 (CN).

## 1.2 需要GKI的产品

原稿要求：Android14、Android13，以及RK3588/RK3588S的Android12产品，如需GMS和EDLA认证，应使用GKI；不做这些认证的产品不强制使用。

## 1.3 GKI与非GKI

| 项目 | GKI | 非GKI |
| --- | --- | --- |
| boot.img | Google定期发布，不能自行修改代码。 | 由RK源码编译，可自行修改。 |
| 驱动模块 | KO加载，所用接口须在Google boot.img内。 | 内嵌boot，RK源码可修改和添加接口。 |
| 内核源码 | RK源码仅编译驱动KO。 | RK源码编译完整内核和驱动，模块以.o内嵌。 |

U-Boot须支持header V4（原文head4）；GKI增加vendor_boot、init_boot、resource分区并启用A/B。英文kernel code表重复驱动模块表，本节保留中文对源码用途的独立比较。

## 2 适配情况

原稿内核版本6.1，下列芯片均标记已适配；此为芯片SDK状态，不是板卡认证。

| 芯片 | 状态 |
| --- | --- |
| RK3562 | 已适配 |
| RK3568 | 已适配 |
| RK3566 | 已适配 |
| RK3588 | 已适配 |
| RK3588S | 已适配 |
| RK3326 | 已适配 |
| PX30 | 已适配 |
| RK3399 | 已适配 |
| RK3576 | 已适配 |

## 3 下载编译upstream内核

Google boot.img发布间隔较长，可下载upstream内核自编boot.img验证调试。需要访问Google服务器，产物为out/boot.img。

```sh
repo init -u https://android.googlesource.com/kernel/manifest -b common-android14-6.1
tools/bazel run //common:kernel_aarch64_dist -- --dist_dir=out
```

## 4 SDK目录

| 用途 | 路径 |
| --- | --- |
| 内核KO | mkcombinedroot/vendor_ramdisk/lib/modules/ |
| Google boot.img | mkcombinedroot/prebuilts/boot-6.1.img |
| AOSP受保护KO | kernel/prebuilts/6.1/arm64/ |
| Kernel-6.1 KO启动加载顺序 | mkcombinedroot/res/vendor_ramdisk_modules.load |
| Android init KO加载顺序 | mkcombinedroot/res/vendor_modules.load |

## 5 编译环境

按中文§5及英文§9使用Ubuntu20.04及以上、pahole1.25；英文§5却写pahole1.25及以上，保留此差异，不擅自统一。英文§9重复环境要求，因此后续章号比中文多1。

## 6.1 启用GKI

在Android device产品目录设置BOARD_BUILD_GKI；RK3562_UGO默认已启用。单编U-Boot须在config打开A/B，build.sh完整编译会自动增加宏。原补丁混用rk3568/rk3588文件名、Android13工作目录，并将false写成fasle；保留原字面值，不代表应选用无关目标。

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

## 6.2 编译镜像

完整编译与非GKI相同。本地kernel编译生成resource.img及打入vendor_boot.img的KO，实际内核采用Google的mkcombinedroot/prebuilts/boot-6.1.img。编译后烧录update.img；调试时可单编vendor_boot.img。

```sh
source build/envsetup.sh
lunch rk3562_ugo-userdebug
./build.sh -ACUKup
# output: rockdev/Image-rk3562_ugo/update.img
make installclean;make vendorbootimage -j12
# output: out/target/product/rk3562_ugo/vendor_boot.img
```

## 6.3 烧录

可用瑞芯微开发工具烧录rockdev/Image-rk3562_ugo/update.img完整包，或散包烧录。散包在工具空白处右键→导入配置→选择TXT→parameter.txt，再依次选择对应img，A/B使用同一镜像。原说明路径为rockdev/Image-rk3588_t/，目录树却为rk3562_ugo，应核实实际产品，勿混用示例。

![完整包烧录](/docs/rockchip-android14-gki/images/flash-complete.png)

完整包烧录 - 原稿技术图；PDF页 8 (CN).

![导入分区配置](/docs/rockchip-android14-gki/images/flash-import.png)

导入分区配置 - 原稿技术图；PDF页 9 (CN).

![散包烧录](/docs/rockchip-android14-gki/images/flash-parts.png)

散包烧录 - 原稿技术图；PDF页 9 (CN).

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

## 7.1 添加与编译驱动模块

1.将新驱动放入kernel-6.1对应目录；gt1x触摸屏示例放drivers/input/touchscreen/，按内核标准添加Makefile、Kconfig。2.新建arch/arm64/configs/xxx_gki.config，加入CONFIG_TOUCHSCREEN_GT1X=m，m表示编译KO。3.将KO文件名加入适当的.load列表。

| .load文件 | 分区 | Makefile | 加载阶段 |
| --- | --- | --- | --- |
| vendor_ramdisk_modules.load | vendor_boot | vendor_ramdisk_gki.mk | ramdisk init |
| vendor_modules.load | vendor | vendor_gki.mk | Android启动 |
| recovery_modules.load | recovery | recovery_gki.mk | Recovery |

无早期加载要求的触摸屏、sensor等建议在Android阶段加载。进入mkcombinedroot，按下方将xxx_tp.ko加入res/vendor_modules.load，再编译烧录super.img。此类KO位于vendor_dlkm/lib/modules/，调试可push编译好的KO到该目录并重启自动加载。不要修改mkcombinedroot/res/vendor_ramdisk_modules.load既有顺序，否则可能无法开机；非必要不增加其中的模块，以免拖慢启动，vendor_modules.load影响较小。

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

4.内核修改建议./build.sh -K，会自动把KO复制至mkcombinedroot/vendor_ramdisk/lib/modules，完整编译再打入vendor_boot.img或super.img。若在kernel单编则须进入mkcombinedroot运行./copy_modules.sh手动复制。5.在工程根目录用下方命令打包vendor_boot.img并烧录产物；vendor分区KO需完整编译烧录super.img。6.开机验证；vendor KO可启动后push并手动挂载验证。涉及DTS修改还须烧录kernel-6.1/resource.img。中文验证步骤重复编号5，英文编号6。

```sh
make installclean;make vendorbootimage -j12
# output: out/target/product/rk3562_ugo/vendor_boot.img
```

| 启动模式 | 存储 | 显示 | 键盘 | 电池 | PMIC | TP | 传感器 | NFC/Wi-Fi/BT | 摄像头 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Recovery | Y | Y | Y | Y | Y | N | N | N | N |
| Charger | Y | Y | Y | Y | Y | N | N | N | N |
| Android | Y | Y | Y | Y | Y | Y | Y | Y | Y |

AOSP加载阶段矩阵：Y表示加载，N表示不加载。

## 8.1 U-Boot日志

| 内容 | Header版本 |
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

## 8.2 Android日志与bootconfig

原稿示例GKI版本写5.10.117-android13-9-00037-gbc08447eb7bd，日志却是android12；均为历史日志，不是Android14/6.1构建版本。Header V4的kernel命令行不能含androidboot.xxx，此类参数应在bootconfig，用cat /proc/bootconfig查看。

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

## 8.3 KO正常加载

```text
[ 1.034730][ T1] Run /init as init process
[ 1.036190][ T1] init: init first stage started!
[ 1.040534][ T1] init: Loading module /lib/modules/io-domain.ko with args
''
[ 1.042038][ T1] init: Loaded kernel module /lib/modules/io-domain.ko
```

## 8.4 KO加载错误

```text
[ 0.805736][ T1] cryptodev: Unknown symbol crypto_ahash_final (err -2)
[ 0.806383][ T1] cryptodev: Unknown symbol sg_nents (err -2)
[ 0.806972][ T1] cryptodev: Unknown symbol crypto_alloc_akcipher (err -2)
[ 0.819768][ T1] Kernel panic - not syncing: Attempted to kill init!
exitcode=0x00007f00
```

Unknown symbol表示boot.img未导出crypto_ahash_final、sg_nents、crypto_alloc_akcipher。可改用已导出接口（搜索kernel-6.1/android）；必须使用则按§10提交新增接口。英文§8.4仅称通常不会发生并引用本PDF不存在的“Noun explanation – ABI”章节；本节保留中文解决方法及下方Exec format error案例，后者英文遗漏。

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

gc05a2.ko的Exec format error表示编译环境不匹配，通常pahole版本错误。用pahole --version确认v1.25。原稿建议如下下载编译；已装dwarves时卸载会改变主机环境。所谓“最新”clone未固定版本，应核对产物满足1.25要求。若编译失败，中文提供https://pan.baidu.com/s/1JP1F0EjzSn25ZVUsbO89Zg（提取码zy6z），替换/usr/local/bin/pahole；这是未核验的历史下载，不是已测试二进制推荐。

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

## 8.5 bootcmdline解析错误

```text
Failed to parse bootconfig: Value is redefined at 416.
```

cmdline字段重复使设备无法开机或进入recovery。在U-Boot阶段串口按住Ctrl+P打印全部cmdline，找出重复字段，在device及kernel DTS搜索定义并移除重复项。

## 8.6 Mali KO加载失败

GPU KO不匹配可使界面卡在“Rockchip kernel”，logcat出现surfaceflinger崩溃。下方保留诊断样例；lr/sp行在两份PDF中已截断/损坏，不臆造补全。重新编译GPU KO，复制到vendor/rockchip/common/gpu对应目录，在device产品目录的PRODUCT_KERNEL_CONFIG增加芯片对应GPU配置。

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

| 芯片 | PRODUCT_KERNEL_CONFIG |
| --- | --- |
| RK3588 | gki_defconfig rockchip_gki.config |
| RK356X/RK3562 | gki_defconfig rockchip_gki.config rk356x.config |
| RK3326/RK3326-S; PX30/PX30-S | gki_defconfig rockchip_gki.config rk3326.config |
| RK3399 | gki_defconfig rockchip_gki.config rk3399.config |

RK3399还需如下修改rk3399.config，运行./build.sh -CK后按上述路径复制Mali KO。

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

## 8.7 内核编译错误

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

上述BTF段错误/-22，原稿重复§8.4的pahole安装流程：clone、安装cmake/libdw-dev、卸载已有dwarves、新建build/、-DBUILD_SHARED_LIBS=OFF静态配置、sudo make install并确认版本。中文还重复§8.4的编译失败预编译下载和提取码；英文未含该备用下载，而在§9再次列Ubuntu20.04+/pahole1.25。

## 9.1 增加模块加载日志

放宽init日志速率限制，避免KO错误被隐藏；原稿在device/rockchip/common/BoardConfig.mk增加printk.devkmsg=on。

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

## 9.2 打包调试boot.img

正常编译内核生成arch/arm64/boot/Image，再按header4打包：

```sh
mkbootimg --kernel arch/arm64/boot/Image --header_version 4 --output ../mkcombinedroot/prebuilts/boot-6.1.img
```

## 9.3 已发布内核接口

标准接口定义位于upstream common/android目录：

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

## 10 提交接口到upstream

新增接口生成补丁，通过Rockchip Redmine提交审核，再由Rockchip统一提交Google；下例为r8168.ko所需接口。

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

## 11 更新AOSP boot及受保护模块

AOSP定期发布boot.img及配套受保护KO。打开https://source.android.com/docs/core/architecture/kernel/gki-android14-6_1-release-builds，选择目标Android14-6.1发布版，下载boot-6.1.img并复制到mkcombinedroot/prebuilts/boot-6.1.img。Android14开始须同时下载受保护模块，必须与boot.img匹配才能加载。通过kernel链接下载system_dlkm_staging_archive.tar.gz，解压后将flatten/lib/modules/下KO复制到kernel/prebuilts/6.1/arm64/。不要更新其中modules.load，替换可能造成加载失败；解压复制后务必检查未被覆盖。

![AOSP boot发布下载](/docs/rockchip-android14-gki/images/aosp-boot.png)

AOSP boot发布下载 - 原稿技术图；PDF页 19 (CN).

![配套受保护模块](/docs/rockchip-android14-gki/images/aosp-modules.png)

配套受保护模块 - 原稿技术图；PDF页 19 (CN).

## 12.1 单编vendor_boot：编译KO

五步流程：编译KO→复制KO→取得匹配基础vendor_boot.img→mkgki4.sh重打包→烧录验证。Android14/kernel6.1进入内核目录、导入clang并编译：

```sh
cd kernel-6.1
export PATH=../prebuilts/clang/host/linux-x86/clang-r487747c/bin:$PATH
make CROSS_COMPILE=aarch64-linux-gnu- LLVM=1 LLVM_IAS=1 ARCH=arm64 gki_defconfig rockchip_gki.config && make CROSS_COMPILE=aarch64-linux-gnu- LLVM=1 LLVM_IAS=1 ARCH=arm64 rk3562-rk817-tablet-v10.img -j32
```

## 12.2 复制去调试信息的KO

```sh
llvm-objcopy --strip-debug drivers/xxx.ko ../mkcombinedroot/vendor_ramdisk/lib/modules/xxx.ko
```

## 12.3 复制基础镜像

将基础vendor_boot.img复制到mkcombinedroot，类似单编boot.img使用boot_sample.img。基础包须与目标设备当前vendor_boot.img一致，可从对应GKI固件取得。

## 12.4 重打包

DTS为板级DTS名称，须使用res/board/已定义的load名。原稿在此由RK3562编译例切换RK3568，应选实际匹配板型，勿混用。产物为mkcombinedroot/new_vendor_boot.img。

```sh
cd ../mkcombinedroot/
./mkgki4.sh DTS=rk3568-evb1-ddr4-v10
```

## 12.5 烧录验证

烧录new_vendor_boot.img开机验证。GKI通常为A/B，须同时更新vendor_boot_a和vendor_boot_b；若此前多次异常重启已进入fastboot，原稿要求同时烧录misc.img清除标记。操作会改变设备状态，应使用匹配镜像并备份。下方Ubuntu示例原样含new_vendor_boot.img/vendor_boot.img，与上方生成单文件路径矛盾；作为原稿错误保留，不应直接运行，应先核实文件。vendor KO可开机后push/手动挂载验证；DTS修改还须烧录kernel-6.1/resource.img。

```sh
sudo ./upgrade_tool di -vendor_boot_a mkcombinedroot/new_vendor_boot.img/vendor_boot.img
sudo ./upgrade_tool di -vendor_boot_b mkcombinedroot/new_vendor_boot.img/vendor_boot.img;
sudo ./upgrade_tool rd
```

{% endraw %}
