---
title: "Rockchip Android GMS 配置、认证测试与常见问题完整指南"
description: "Rockchip Android GMS 配置、认证测试与常见问题完整指南"
excerpt: "Rockchip Android GMS 配置、认证测试与常见问题完整指南"
translation_key: "265-rockchip-android-gms-configuration"
slug: "265-rockchip-android-gms-configuration"
lang: "zh"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

本文以中文 RK-YH-YF-237 V3.0（77 页，覆盖 Android 14）为共同主线；英文 RK-YH-YF-251 V1.3（16 页，止于 Android 11）用于核对旧版差异，英文独有内容另作历史补充。全部规则和时间节点均是原稿版本的记录，不等于当前 Google 政策，也不表示 ArmSoM 产品已通过 GMS/EDLA 认证。应用于 ArmSoM 必须确认板卡、SoC、Android SDK/BSP、内核和授权资格；本文未运行命令、烧写密钥或进行认证测试。旧英文稿无技术图；唯一技术截图来自中文稿并按来源标注。参考 [ArmSoM 官方文档](https://docs.armsom.org/)。

## 1 名词解释

| 术语 | 原稿定义 |
| --- | --- |
| GMS (Google Mobile Service) | Google 移动设备服务，包含 Google 服务框架、Play 商店、Chrome 等应用。 |
| MADA (Mobile Application Distribution Agreement) | 主要针对手机和平板，必须满足手持/平板设备类型全部 CDD 要求；屏幕 3.3–18 英寸，设备必须带电池。 |
| EDLA (Enterprise Device Licensing Agreement) | 类似 MADA，放宽屏幕和电池限制，可做 18–70 英寸及无电池设备；内存必须大于 2G，不能直接面向消费者。 |
| 3PL | 第三方实验室按 CDD、GMS Requirements 及各地区要求协助 Google 认证，例如富士康、哈曼、风河、和硕；可自行联系或经业务引荐。 |
| Google Partner | 签署 MADA/EDLA 成为 Partner 后，才能访问 Partner 文档并联系 3PL 申请测试。 |
| EEA | 欧盟销售设备需 EEA GMS 认证，代码 EEA 类型按实际情况及 EMADA 协议配置。 |
| xTS | 执行对应 binary 进入 xTS-tradefed 命令行后执行测试或 retry。 |
| retry | 在已有结果上续测，Fingerprint 必须相同。`l r` 列出结果，首列为 session id；执行 `run retry --retry session_id`。不要加 `--retry-type` 等额外参数。 |
| Single test | 单测用于调试指定测试项，结果与日志分别生成到 `results`、`logs`。 |

[EEA](https://support.google.com/androidpartners_gms/answer/9071728?hl=en) · [CTS](https://source.android.com/compatibility/cts/run)

## 2 硬件要求

- 主板必须有真实硬件 RTC，不可虚拟，节点 `/sys/class/rtc/rtc0/` 必须存在。
- 必须有内置或 USB 麦克风，只有 USB Mic 时需配置为内置 Mic；测试前确认录音正常。
- 必须有 BLE：Android 11+ 的 Nearby Share 依赖它。
- 有 Type-C 时必须支持 OTG，否则 GTS Interactive 会失败，硬件设计时确认。
- 相关 feature 变化后必须重新完整认证，认证后不要修改 feature。

原稿报告与日志示例路径如下；`ASSUMPTION_FAILURE` 表示跳过该项并按 Pass 处理，原稿称 Google 仅统计 `FAILURE`。

```text
android-cts/logs/2023.05.04_14.13.15/inv_17873629097171453434/host_log_***.txt
android-cts/logs/2023.05.04_14.13.15/inv_17873629097171453434/device_logcat_test_PH0BEXGDPG_***.txt
```

## 3 版本要求

### 3.1 Android 13 新要求

Android 13+ 新设备 DDR 至少 `2Gb`，低于它（包括 Go）不能认证；新增 RKP。原稿容量单位写 Gb/GB/G 混用，这里保留写法，选型必须按实际规范核对。

### 3.2 Android 14 新要求

Android 14+ 的 `3Gb DDR` 可申请 Go GMS；新增 Device ID Attestation；新设备 GMS/EDLA 只支持 64Bit，配置示例：

```make
# device/rockchip/rk3588/rk3588s_u/BoardConfig.mk
DEVICE_IS_64BIT_ONLY := true
```

## 4 测前需知

搭载 Google 移动服务需要 GMS/EDLA 认证及资格。有 MADA/EDLA 时，可向 Google 联系人咨询 Partner 文档/账号权限，向 Google 或 3PL 申请，按本指南配置并自测全部 xTS；没有资格时须联系有 ODM MADA 资格的公司。原稿中大多数外链需要 MADA/EDLA 权限。认证并非只运行本文命令即可获得。

原稿称 2G 及以下 DDR 只能以 Android Go 认证；Android 13+ 又禁止低于 2G。编译选择 `lunch *go`，例如：

```sh
lunch rk3326_rgo-user
```

PX30 是 RK3326 工业版本，功能大致相同，Google 记录仅有 RK3326；原稿要求 PX30 按 RK3326 申请。RK3568 属 RK356x，可用 RK3566/RK3568；RK3562 不属该系列，不可按 RK356x 申请。PX30 示例：
1. sub-license 申请与 RK3326 保持一致。
2. PX30-2GB DDR 编译直接 `lunch rk3326_rgo-user`。
3. 一键编译 `./build.sh -UCA` 前修改 makefile：

```make
# device/rockchip/rk3326/BoardConfig.mk
PRODUCT_UBOOT_CONFIG := px30
```

EDLA 通常使用 USB Camera 而非 MIPI 内置 Camera；3PL 不指定型号，但 CTS 较严格，已认证 sensor 参考附录 A。

## 5 测前申请

提前申请以免拖延：
1. 3PL sub-license（见 Keymaster & Optee）。
2. 3PL keybox（见 Attestation key）。
3. 3PL GTS `APE_API_KEY`（见 GTS）。
4. 向 Google 申请 `android-partner-api@company.com` 形式的账号及 RKP（见 RKP）。

## 6 认证窗口

平台支持见 [GMS Express/GO Ready Chipset](https://docs.google.com/spreadsheets/d/18cNgkWAlt6mYtZIgXS9yHflhMbE8pFB9CgYniqUsWR4/edit#gid=227777885)。首次认证的 Android 版本有严格窗口，见 [GMS approval windows](https://docs.partner.android.com/gms/policies/domains/reqs?authuser=2#gms_approval_windows_by_release)。原稿历史例：Android 12L AOSP 于 2022-03-07 发布，GMS 截止 2023-02-28，EDLA 截止 2023-12-31。这些不是当前申请截止时间。

## 7 认证周期

原稿估计：普通平板硬件较简单，取得稳定 SDK、整机无明显死机后处理问题约 3–4 周。Android 13+ 使用 GKI，驱动用默认 ABI 列表外接口时需提交 Google；审核合并通常 3–4 天，每月 15 日截版测试，签名 `boot.img` 月末发布，15 日后提交最快可能约 40 天才有 release。测试可暂用 [Google PAB 每日 boot.img](https://ci.android.com/builds/branches/aosp_kernel-common-android13-5.10/grid?legacy=1&selected-targets=kernel_aarch64)。Android 13+ RKP 流程复杂且需 Google 协助，应尽早申请。

EDLA 硬件驱动更多，GKI 可能额外拉长 4–6 周。必须使用整机，配多种屏时按最大尺寸屏测试。测试并行且无死机时原稿估计约 5 天，参考下表（未写单位的周期保持原表）：

| 测试 | 建议整机数 | 周期 |
| --- | --- | --- |
| CTS | 3+ | 2–4 天 |
| CTS-ON-GSI | 2 | 2 |
| VTS | 1 | 1 |
| CTS-Verifier | 1 | 1 |
| GTS | 1 | 2 |
| GTS-Verifier | 1 | 1 |
| APTS | 1 | 1 |
| STS | 1 | 1 |

## 8 谷歌包获取

认证集成 GMS、mainline、prebuilts 三个包。mainline 文档要求的补丁必须已在 SDK，否则编译失败。最新 mainline：[Release Tracker](https://releasetracker.partner.android.com/)，包与 SDK 补丁：[Release notes](https://docs.partner.android.com/mainline/release/release-notes)。GMS 有效期/下载：[GMS download](https://docs.partner.android.com/gms/building/integrating/gms-download)。

| 包 | 目录 |
| --- | --- |
| GMS | `vendor/partner_gms` |
| mainline | `vendor/partner_modules` |
| prebuilts | `prebuilts/module_sdk` 整个目录删除后换成 mainline 对应文件 |

查询 GMS 版本：

```text
getprop | grep ro.com.google.gmsversion

/vendor/partner_gms/products/gms_package_version.mk: GMS_PACKAGE_VERSION_ID := 13_202310
/vendor/partner_gms/products/gms.mk: ro.com.google.gmsversion=$(GMS_PACKAGE_VERSION_ID)
```

没有 MADA/EDLA 的客户不能自行下载，Rockchip 也不能提供包，需向 3PL 获取。有资格时推荐 Express 分支（见 §11），同步包符合该原稿 GMS Express Plus 要求。自行下载时将常规 GMS 包解压至 `vendor/partner_gms`；Android 11+ mainline 没有现成压缩包，按[网盘说明](https://drive.google.com/drive/folders/1gxxMalTC99Y2SvyRDUfiDFvY_k4OzjO5)用 repo 同步，例如：

```sh
# 下载 manifest 文件
repo init -u https://partner-android.googlesource.com/platform/manifest -b r-aml-prebuilt-release
# 开始同步，同步前，请先检查 .repo/manifests/default.xml 中是否有内容
repo sync -c -j8
```

测试一般要最新 Approved 版本，从该版本 Release Summary 找到 git tag，原稿示例 `mainline_m_2020_dec_preload_5`，把 manifest 默认 revision 改为对应 tag：

```diff
diff --git a/default.xml b/default.xml
index 7be1f37..01ccba9 100644
--- a/default.xml
+++ b/default.xml
@@ -4,7 +4,7 @@
   <remote  name="ohd"
            fetch=".."
            review="https://partner-android-review.googlesource.com/" />
-  <default revision="r-aml-prebuilt-release"
+  <default revision="refs/tags/mainline_m_2020_dec_preload_5"
            remote="ohd" />
   <!-- Google-signed Mainline prebuilt module projects !-->
```

Android 12+ 的 prebuilts 必须与 mainline 同版本，否则编译失败。例如二者都取 `T1003604/mainline_m_2022_feb_preload_5`。

![mainline/prebuilts 不匹配的编译报错示例，中文 PDF 第9页；无英文对应图。](/docs/rockchip-android-gms-configuration/images/cn-p009-1.png)

mainline/prebuilts 不匹配的编译报错示例，中文 PDF 第9页；无英文对应图。

## 9 测试包获取

原稿要求通常使用 Google 最新测试包，每季度 2/5/8/11 月更新；参考[测试版本表](https://docs.qq.com/sheet/DVG5KcFNnU2ZFZG9j?tab=BB08J2&u=74e1e99829764a9b8a46607a5c6980cf)。链接见附录 B，也可从 Rockchip 安全补丁 FTP 的 `GMS-Test-Suite/xTS` 取得，但不保证最新。MADA/EDLA 模块如下。PAB 是每日构建，可下载谷歌包/测试包排查问题是否已修复。

| 模块 | 固件 | 说明 |
| --- | --- | --- |
| CTS | user | — |
| CTS-ON-GSI | user | Google 签名 system.img |
| GTS | user | — |
| STS | userdebug | 每月第1个周三更新 |
| VTS | user | Google 签名 system.img 和固件 vendor_boot-debug.img |
| CTS-Verifier | user | — |
| GTS-Verifier | user | 仅 Android 13 |
| GTS Interactive | user | Android 13+；android-gts-11-R2 以上 |
| Checklist | user | EDLA 也需测试 |
| BTS | user | — |
| GOATS | userdebug | Android 11 及以下 Go |
| APTS | userdebug | Android 12 及以上 Go |

## 10 GMS 固件配置

下列日志、配置片段、路径和命令是原稿示例，不是本次执行结果。代码中文注释保留，操作含义在各语言正文说明；不将片段补成完整脚本。

### 10.1 固件配置检查

Android 12+ 在 lunch 后执行检查，所有项 Pass 再认证。`BOARD_WIDEVINE_OEMCRYPTO_LEVEL` 按产品需求；`PRODUCT_HAVE_RKAPPS` 确认 APK 权限符合要求。

```text
source build/envsetup.sh
lunch rk3588s_t-user
source device/rockchip/common/scripts/check_gms_env.sh
```

u-boot 宏已配置却 Failed 时，先编译 u-boot。以下 `.config` 缺失例在 `Android_SDK/u-boot` 执行 `./make.sh rk3588` 后再检查；其他失败按下文修复至全部 Pass。

```text
Android_SDK$ source device/rockchip/common/scripts/check_gms_env.sh
grep: u-boot/.config: No such file or directory
 [Failed] "CONFIG_ANDROID_AB=y" Check Failed! Expect "CONFIG_ANDROID_AB=y"
 "Android 11+ MUST enable A/B update."
grep: u-boot/.config: No such file or directory
 [Failed] "CONFIG_ANDROID_WRITE_KEYBOX=y" Check Failed! Expect "CONFIG_ANDROID_WRITE_KEYBOX=y"
 "Attestation key MUST be enabled."

grep: u-boot/.config: No such file or directory
 [Failed] "CONFIG_ANDROID_KEYMASTER_CA=y" Check Failed! Expect "CONFIG_ANDROID_KEYMASTER_CA=y"
 "Keymaster in uboot MUST be enabled."
grep: u-boot/.config: No such file or directory
 [Failed] "CONFIG_OPTEE_CLIENT=y" Check Failed! Expect "CONFIG_OPTEE_CLIENT=y"
 "Optee MUST be enabled."
解决方法:Android_SDK/u-boot$ ./make.sh rk3588
```

### 10.2 内核编译

用 Clang 编译，命令 `./build.sh -CK`，否则 VTS `KernelVersionTest#IsClang` 失败。原稿逻辑片段：

```text
vts_kernel_toolchain
KernelVersionTest#IsClang
相关逻辑:Android_SDK/build.sh
if [ "$BUILD_KERNEL_WITH_CLANG" = true ] ; then
if [ "$KERNEL_ARCH" = "arm64" ]; then
    ADDON_ARGS="CROSS_COMPILE=aarch64-linux-gnu- LLVM=1 LLVM_IAS=1"
else
    ADDON_ARGS="CC=clang LD=ld.lld"
```

Go 用 `android-10-go.config` 替代 `android-10.config`；Android 11 将10换11，Android 13 用 `android-13.config`。缺 `rkxxxx.config` 可省略。后续检查 `device/rockchip/rkxxxx/BoardConfig.mk`。

```text
make ARCH=arm64 rockchip_defconfig android-10-go.config rk3326.config
make ARCH=arm64 rockchip_defconfig android-11-go.config rk3326.config
```

### 10.3 EEA

仅欧盟 EEA 设备配置，其余留空；type1 按实际 EEA 类型替换。

```text
BUILD_WITH_EEA := true
BUILD_WITH_EEA_TYPE := type1 (根据自己的EEA类型配置)
```

### 10.4 GMS 包使能

含 radio/4G 才设 MARKET_ALL true，其余 false。user 的 RKAPPS false 移除压力工具，否则不能正常启动。

```text
device/rockchip/rk3588/BoardConfig.mk
BUILD_WITH_GOOGLE_MARKET := true
# 含radio的设备(即带有4G通讯功能)请配置以下配置,其余设备保持false
BUILD_WITH_GOOGLE_MARKET_ALL := true
# 编译user固件时,请把下面的宏设成false,RK的压力测试工具将会移除,否则无法正常启动。
PRODUCT_HAVE_RKAPPS := false
```

Android Go 2G 追加修改（Android13+ 不支持低于2Gb），source/lunch 后查询 mk。`gms-mandatory` 对应 `vendor/partner_gms/products/gms-mandatory.mk`；没有 Express 宏默认 `gms.mk`。

```text
Android_SDK/device/rockchip/common$ git diff modules/gms.mk
   TMP_GMS_VAR := gms
   TMP_MAINLINE_VAR := mainline_modules
   ifeq ($(strip $(BUILD_WITH_GO_OPT)),true)
     # 2G A Go
- #TMP_GMS_VAR := $(TMP_GMS_VAR)_go_2gb
+ TMP_GMS_VAR := $(TMP_GMS_VAR)_go_2gb
```

```text
Android_SDK$ get_build_var TMP_GMS_VAR
gms-mandatory ##
vendor/partner_gms/products/gms-mandatory.mk
```

### 10.5 Hardware Features

与硬件/驱动人员确认，缺陀螺仪、BLE等硬件就移除 feature。Android11+ Nearby Share 需要 BLE，设计时注意。优先用宏，无宏则从 `frameworks/native/data/etc/` 删除对应 feature.xml。

```text
BOARD_GRAVITY_SENSOR_SUPPORT := true
BOARD_COMPASS_SENSOR_SUPPORT := true
```

删除 BLE 示例（不表示可忽略强制 BLE 要求）：

```text
BOARD_BLUETOOTH_LE_SUPPORT := false
```

USB Camera features：

```text
android.hardware.camera.any
android.hardware.camera.external
```

即使无 GPS，网络定位仍需保留：

```text
android.hardware.location
android.hardware.location.network
```

`pm list features | grep sensor` 为空时移除 sensor 服务。配置最终生成 `/vendor/etc/vintf/manifest.xml`。

```text
device/rockchip/common/device.mk:
-# Sensor HAL
-PRODUCT_PACKAGES += \
- android.hardware.sensors@1.0-service \
- android.hardware.sensors@1.0-impl \
- sensors.$(TARGET_BOARD_HARDWARE)
device/rockchip/common/manifests/manifest_level_33.xml:
- <hal format="hidl">
- <name>android.hardware.sensors</name>
- <transport>hwbinder</transport>
- <version>1.0</version>
- <interface>
- <name>ISensors</name>
- <instance>default</instance>
- </interface>
- </hal>
注:上述manifests配置文件生成目录/vendor/etc/vintf/manifest.xml
```

### 10.6 FRP

必须启用 FRP，见 `RKDocs/android/Rockchip_Introduction_Android_Factory_Reset_Protection_CN&EN.pdf`。

```text
BUILD_WITH_GOOGLE_FRP := true
```

### 10.7 AVB 与 A/B

GMS 要 AVB，见 `RKDocs/android/Rockchip_Introduction_Android_Verify_Boot_CN&EN.pdf`。SDK 为调试默认不启用 AVB、不锁 bootloader，会使认证后仍显示未认证。量产前 uboot 加下方补丁，烧 key 时同时锁定。调试阶段先不加，否则换不同固件可能无法启动。未开 AVB 不可锁。

```text
BOARD_AVB_ENABLE := true ## 若没有启用AVB则不能锁定机器,否则会导致机器无法开机

RKDocs/android/patches/gms/0001-libavb-Lock-the-device-when-the-device-init-or-write.patch
```

Android11+ 启用虚拟 A/B，缺失的 include 段一并添加：

```text
BOARD_USES_AB_IMAGE := true
BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
# 下面这段在配置时如果没有,请一起添加
ifeq ($(strip $(BOARD_USES_AB_IMAGE)), true)
  include device/rockchip/common/BoardConfig_AB.mk
  TARGET_RECOVERY_FSTAB := device/rockchip/rk356x/rk3566_rgo/recovery.fstab_AB
endif
```

Android13 GKI 需压缩虚拟 A/B：

```text
BOARD_ROCKCHIP_VIRTUAL_AB_COMPRESSION := true
```

默认分区不够时手动设值，overlay 放在 `BoardConfig_AB.mk` include 之后。

```text
Android_SDK/device/rockchip/rk3588$ git diff rk3588_s/BoardConfig.mk
ifeq ($(strip $(BOARD_USES_AB_IMAGE)), true)
  include device/rockchip/common/BoardConfig_AB.mk
  TARGET_RECOVERY_FSTAB := device/rockchip/rk356x/rk3566_rgo/recovery.fstab_AB
endif
+ # 以下这段overlay必须要放到`include device/rockchip/common/BoardConfig_AB.mk`之后
+BOARD_SUPER_PARTITION_SIZE := 4294967296
+BOARD_ROCKCHIP_DYNAMIC_PARTITIONS_SIZE := $(shell expr $(BOARD_SUPER_PARTITION_SIZE) - 4194304)
```

RK3566/RK3568 的 u-boot 也启用 A/B：

```text
Android_SDK/u-boot$ git diff configs/rk3568_defconfig
+CONFIG_ANDROID_AB=y
 CONFIG_OPTEE_CLIENT=y
 CONFIG_OPTEE_V2=y
```

查询 AVB/A-B，及 AVB 未启用失败例：

```sh
pm list features | grep android.software.verified_boot
ls -l /dev/block/by-name/
```

```text
CtsSecurityTestCases
android.security.cts.VerifiedBootTest#testVerifiedBootSupport
测试报错:java.lang.AssertionError: Verified boot must be supported on the device
```

未开 AVB 却 `fastboot oem at-lock-vboot` 会无法启动。原稿解锁法：① RKDevTool.exe→高级功能→擦除所有→重启（丢失数据）；② 启动 UART 按 CTRL+C 入 cmdline，串口 `fastboot usb 0`，adb接口 `fastboot oem at-unlock-vboot`。

```text
报错信息:Hit key to stop autoboot('CTRL+C'): 0
        ANDROID: reboot reason: "(none)"
        Vboot=0, AVB images, AVB verify
        read_is_device_unlocked() ops returned that device is LOCKED
        avb_slot_verify.c:763: ERROR: vbmeta: Error verifying vbmeta image: OK_NOT_SIGNED
        AVB verify failed ## AVB校验失败
        Android boot failed, error -1.
```

### 10.8 SELinux

功能异常处理见 `RKDocs/android/Rockchip_Developer_Guide_Android_SELinux(Sepolicy)_CN.pdf`。Android12+ 认证前在 userdebug 上反复扫描，参照工具 README.md。结果添加至 `BOARD_SEPOLICY_DIRS` 指定文件，例如 `device/rockchip/rk3399/sepolicy_vendor/genfs_contexts`。

```text
device/rockchip/common/BoardConfig.mk:
BOARD_SELINUX_ENFORCING ?= true

RKTools/linux/Android_Devices_SELinux_Tool

console:/ $ chmod +x ./data/local/rockchip_selinux_tools
console:/ $ ./data/local/rockchip_selinux_tools
Please USE the following cmd to confirm which files need to be update!
get_build_var BOARD_SEPOLICY_DIRS ## 工程source和lunch后执行该命令
Add the following result to file: [genfs_contexts]
----------------------------------------------------- ## 将下面扫描结果添加到genfs_contexts
genfscon sysfs /devices/platform/av1d-master/wakeup u:object_r:sysfs_wakeup:s0
genfscon sysfs /devices/platform/es8388-sound/extcon u:object_r:sysfs_extcon:s0

Android_SDK$ get_build_var BOARD_SEPOLICY_DIRS
device/rockchip/common/sepolicy/vendor device/rockchip/rk3399/sepolicy_vendor
....
```

`cat /vendor/etc/selinux/vendor_sepolicy.cil` 检查修改。不可改 `/system/sepolicy`，应改 `/device/rockchip`。不可变更 user adb root `ro.debuggable`，否则 adbd 挂死、测试阻塞或日志报告丢失。相关日志及需扫描的失败项：

```text
I init : starting service 'adbd'...
I init : Created socket '/dev/socket/adbd', mode 660, user 1000, group 1000
W adbd : type=1400 audit(0.0:27602): avc: denied { setcurrent } for scontext=u:r:adbd:s0 tcontext=u:r:adbd:s0 tclass=process permissive=0
F adbd : main.cpp:162] Could not set SELinux context
I init : Service 'adbd' (pid 10075) received signal 6
I init : Sending signal 9 to service 'adbd' (pid 10075) process group...
E init : process with updatable components 'adbd' exited 4 times in 4 minutes

netd_integration_test
NetdSELinuxTest#CheckProperMTULabels
SuspendSepolicyTests
SuspendSepolicyTests#SuspendSepolicyTests
CtsSecurityHostTestCases
android.security.cts.SELinuxHostTest#testNoBugreportDenials ## 需要打开宏
BOARD_SELINUX_ENFORCING ?= true
```

### 10.9 固定 Fingerprint（可选）

测试前固定指纹以便修改固件后继续 retry。数字串自行确定。

```text
Android_SDK/device/rockchip/common$ git diff prebuild.mk
 -include $(TARGET_DEVICE_DIR)/prebuild.mk
+ROCKCHIP_BUILD_NUMBER := 202001 (写一串数字即可,自己定)
```

### 10.10 安全补丁等级

从 Partner_Security_Bulletin 或 Rockchip安全补丁FTP 获取；`getprop | grep ro.build.version.security_patch` 查询。指导文档 FTP `/GMS-Test-Suite/xTS/tools/Rockchip_Android_Security_Patch_Guide.pdf`。原稿有效期一般3个月，送测时核对认证窗口。

```text
GtsOsTestCases
com.google.android.os.gts.SecurityPatchTest#testSecurityPatchDate
报错信息:ro.build.version.security_patch should be "2023-03" or later. Found "2022-07-05"
```

| Android | 安全补丁分支 |
| --- | --- |
| 12 / 12L | android12-security-release |
| 13 | android13-security-release |
| 14 | android14-security-release |

按时间顺序打完补丁再按实际更新等级，不能只改日期。完整年-月-日格式，否则 `--rollback_index` 为空导致 vbmeta.img 编译失败。以下完整保留例值、错误及构建链。

```text
build/make/core/version_defaults.mk
PLATFORM_SECURITY_PATCH := 2020-03-05

[ 99% 8801/8803] Target vbmeta image: out/target/product/rk3588_t/vbmeta.img
FAILED: out/target/product/rk3588_t/vbmeta.img
usage: avbtool make_vbmeta_image [-h] [--output OUTPUT]
                               [--padding_size NUMBER]
                               [--algorithm ALGORITHM] [--key KEY]
                               [--signing_helper APP]
                               [--signing_helper_with_files APP]
                               [--public_key_metadata KEY_METADATA]
                               [--rollback_index ROLLBACK_INDEX]
                               [--rollback_index_location ROLLBACK_INDEX_LOCATION]
                               [--append_to_release_string STR]
                               [--prop KEY:VALUE]
                               [--prop_from_file KEY:PATH]
                               [--kernel_cmdline CMDLINE]
                               [--setup_rootfs_from_kernel IMAGE]
                               [--include_descriptors_from_image IMAGE]
                               [--print_required_libavb_version]
                               [--chain_partition PART_NAME:ROLLBACK_SLOT:KEY_PATH]
                               [--flags FLAGS]
                               [--set_hashtree_disabled_flag]
avbtool make_vbmeta_image: error: argument --rollback_index: expected one argument

build/make/core/version_util.mk:
ifndef PLATFORM_SECURITY_PATCH_TIMESTAMP
  # Used to indicate the matching timestamp for the security patch string in PLATFORM_SECURITY_PATCH.
  PLATFORM_SECURITY_PATCH_TIMESTAMP := $(shell date -d 'TZ="GMT" $(PLATFORM_SECURITY_PATCH)' +%s)
endif
device/rockchip/common/modules/avb.mk:
BOARD_AVB_ROLLBACK_INDEX ?= $(PLATFORM_SECURITY_PATCH_TIMESTAMP)
build/make/core/Makefile:
ifdef BOARD_AVB_ROLLBACK_INDEX
  BOARD_AVB_MAKE_VBMETA_IMAGE_ARGS += --rollback_index $(BOARD_AVB_ROLLBACK_INDEX)
endif

define build-vbmetaimage-target
  $(call pretty,"Target vbmeta image: $(INSTALLED_VBMETAIMAGE_TARGET)")
  $(hide) mkdir -p $(AVB_CHAIN_KEY_DIR)
  $(call extract-avb-chain-public-keys, $(AVB_CHAIN_KEY_DIR))
  $(hide) $(AVBTOOL) make_vbmeta_image \
    $(INTERNAL_AVB_MAKE_VBMETA_IMAGE_ARGS) \
    $(PRIVATE_AVB_VBMETA_SIGNING_ARGS) \
    $(BOARD_AVB_MAKE_VBMETA_IMAGE_ARGS) \
    --output $@
  $(hide) rm -rf $(AVB_CHAIN_KEY_DIR)
endef
```

### 10.11 Widevine

原稿列 RK3588/RK3399/RK356x 已支持L1，平板一般L3即可；需要L1时向Rockchip核对最新支持及补丁，不能推广为全部板卡认证。key打包工具 FTP `GMS-Test-Suite/xTS/tools/rkpacker2`。

```text
BOARD_WIDEVINE_OEMCRYPTO_LEVEL := 3
```

### 10.12 Keymaster & Optee

sub-license 的Trust OS：RK3326/RK3562/RK356x/RK3588 填Optee V2，其余V1。

```text
PRODUCT_HAVE_OPTEE := true
```

### 10.13 Attestation key / Google keybox

测试前经3PL申请Google keybox，rkpacker打包后烧写。工具 `RKTools/linux/Linux_AttestationKeyboxPack_Tool.rar`、`RKTools/windows/KeyBoxWrite_v1.53.zip`，后者也在FTP `GMS-Test-Suite/xTS/tools/KeyBoxWrite_v1.53.zip`。流程见 `RKDocs/common/RKTools manuals/Rockchip_User_Guide_Keybox_Burning_EN.pdf`。编译前启用uboot写key；3566/3568如下，RK3399不设最后宏。

```text
Android_SDK/u-boot$ git diff configs/rk3568_defconfig
 CONFIG_OPTEE_CLIENT=y
 CONFIG_OPTEE_V2=y
+CONFIG_ANDROID_WRITE_KEYBOX=y
+CONFIG_ANDROID_KEYMASTER_CA=y
+CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION=y ## RK3399不配置该宏
```

key 在eMMC security分区，重刷固件不丢，擦Flash后需重烧。产线检查：uboot加FTP `/GMS-Test-Suite/Exp+/Attestation key` 补丁后读 `ro.boot.deviceid`。测试key可跨Android/SoC，量产必须项目专用keybox。设备在bootloader烧写，显示完成后再等约8秒才断电；uboot至少2022-03，串口ret=0表示成功。Android14+启动logcat显示keybox/Device ID的yes已烧、no未烧。

```text
write_key key_file=PrivateKey.RSA ret=0 ## 0表示烧写完成
write_key key_file=PrivateKey.EC ret=0
或
write attestation key: RSA ret_rsa=0

Provision google keybox:no,ID attestation:no ## yes表示已烧,no表示未烧
```

新测试包需两种Attestation，否则报告信息不全无法上传Google。申请材料向3PL确认：单case报告（原稿 `GtsEdiHostTestCases`）、设备信息模板、每行一个Device ID的txt，一设备一ID。

```text
W/ApkInstrumentationPreparer: Target preparation step
com.android.compatibility.common.deviceinfo.KeystoreAttestationDeviceInfo#testCollectDeviceInfo failed.
junit.framework.AssertionFailedError: KeystoreAttestationDeviceInfo collection
completed. expected:<COMPLETED> but was:<FAILED>
```

Device ID唯一，1–32字符，只允许 `[a-z][A-Z][0-9][_][-][.]`，无空白。文件为Unix格式ASCII；名称同样仅限上述字符，须有意义，如 `Make_Model_Date_Quantity.txt`；只放ID，无注释、表头及其他信息；每行一个、无重复、无空行、无空格。

10万keybox打包可能内存不足，分4份后统计 `</Keybox>` 数，填入NumberOfKeyboxes；删除最后 `</Certificate></CertificateChain></Key></Keybox>` 后的内容，补 `</AndroidAttestation>` 再打包。原稿100与4是示例数量，必须用实际计数。

```text
$ chmod +x rkpacker
$ ./rkpacker attest_keyboxes.output -o keybox.kdb
55488 Data File Type : KEYBOX
Output File : keybox.kdb
Data File Num : 1
Total Key Num : 100000
out of memory at line 1
```

```sh
gzip -cdk 2023-01-01_***.output.gz > attest_keyboxes.output
split -n 4 attest_keyboxes.output --additional-suffix=.xml
cat xaa.xml | grep -w "</Keybox>" | wc -l
rkpacker xaa.xml -o keybox.kdb
```

```xml
<?xml version="1.0"?>
<AndroidAttestation>
<NumberOfKeyboxes>4</NumberOfKeyboxes>
<Keybox DeviceID="BW10RS23090001"><Key algorithm="ecdsa"><PrivateKey format="pem">......
......
-----END CERTIFICATE-----
</Certificate></CertificateChain></Key></Keybox>
</AndroidAttestation>
```

缺libcrypto时，把FTP `/GMS-Test-Suite/xTS/tools/libcrypto.so.1.0.0`放到Ubuntu `/usr/lib/x86_64-linux-gnu/libcrypto.so.1.0.0`。以下测试需烧key并 `fastboot oem at-lock-vboot`；仍失败原稿建议擦除重烧再锁，擦除会丢数据/key，须按授权流程。

```text
报错信息:error while loading shared libraries: libcrypto.so.1.0.0: cannot open
shared object file: No such file or directory

CtsAppSecurityHostTestCases
CtsDevicePolicyManagerTestCases
CtsKeystorePerformanceTestCases
CtsKeystoreTestCases
VtsAidlKeyMintTargetTest
```

### 10.14 Android13 RKP

Android13+测试前提机器信息，经 `android-partner-api@company.com` 上传Google。见 `RKDocs/android/Rockchip_Android_Remote_key_Provisioning_Guide.pdf`；未上传的GTS失败如下。

```text
GtsGmscoreHostTestCases
com.google.android.gts.security.AttestationRootHostTest#testEcAttestationChainRemProvLength
com.google.android.gts.security.AttestationRootHostTest#testRsaAttestationChainRemProvLength
或
GtsGmscoreHostTestCases
com.google.android.gts.security.AttestationRootHostTest#testEcAttestationChainRemProvLengthTee
com.google.android.gts.security.AttestationRootHostTest#testRsaAttestationChainRemProvLengthTee
```

设备工具 `/vendor/bin/rockchip_rkp_factory_extraction_tool`。提取前先写SN，SN不变无需重提CSR。同时写key及提CSR用 `RKTools/windows/KeyboxWriter-v1.55.7z`，分开用FTP `GMS-Test-Suite/xTS/tools/KeyBoxWrite_v1.53.zip`。账号申请至少1–2周，应提前。

### 10.15 Android14 Device ID Attestation

Android14+须同时烧Device ID Attestation，仅一次不可改，重烧先RKDevTool.exe擦除。见 `RKDocs/android/Rockchip_User_Guide_Android_Device_ID_Attestation_Flash_CN.pdf`；工具FTP `/GMS-Test-Suite/xTS/tools/RKDevInfoWriteTool-V1.2.1.7z`。两种attestation前先写SN，否则RKP失败。两features及缺信息测试失败如下。

```text
10:54:48:013 ReadRkp[15]: reading sn from device fail

pm list features | grep android.software.device_id_attestation
pm list features | grep android.hardware.device_unique_attestation

CtsKeystoreTestCases
android.keystore.cts.KeyAttestationTest#testRsaAttestation
android.keystore.cts.KeyAttestationTest#testEcAttestation
android.keystore.cts.DeviceOwnerKeyManagementTest#testAllVariationsOfDeviceIdAttestation
报错信息:java.lang.UnsupportedOperationException: Device does not support Device ID attestation.
```

### 10.16 GKI

Android12起、Linux5.4及以上要求GKI，原稿覆盖RK3588 Android12和全部Android13。参见 `RKDocs/android/Rockchip_Developer_Guide_GKI_CN.pdf` 及附录B。使用Google Release boot.img，boot分区按原稿64Mb配置；代码67108864保留。检查vendor_boot分区。

```text
BOARD_BUILD_GKI := true

device/rockchip/common/build/rockchip/Partitions.mk:
  ifeq ($(BOARD_BUILD_GKI),true)
    BOARD_BOOTIMAGE_PARTITION_SIZE ?= 67108864
    BOARD_VENDOR_BOOTIMAGE_PARTITION_SIZE ?= 41943040
```

```text
ls -l /dev/block/by-name/vendor_boot*
```

```text
CtsHardwareTestCases
android.hardware.input.cts.tests.SonyDualSenseBluetoothTest#testAllKeys
vts_fs_test
fs#ErofsSupported
VtsBootconfigTest
VtsBootconfigTest#ProcCmdlineAndroidbootTest
```

### 10.17 内核版本

Android12：RK3326、RK356x、RK3399、RK3288使用4.19，不使用5.10；RK3588使用5.10，不使用4.19。Android13全部使用kernel-5.10，修改前确认目录。

### 10.18 Incremental FS

仅Android12需要此步骤，要求V2。kernel-4.19为兼容旧版本没有直接合入，模块分别放user/userdebug目录。内核更新可能使ko失效，按base.txt和补丁重新编译；不需兼容Android12前版本可内建，不再需要ko。

```text
vendor/rockchip/common/modular_kernel/4.19$ tree user*
user
`-- incrementalfs.ko
userdebug
`-- incrementalfs.ko
0 directories, 2 files

$ adb shell lsmod
Module Size Used by
bcmdhd 1150976 0
incrementalfs 77824 0

vendor/rockchip/common/modular_kernel/4.19/incrementalfs_patch

git log fs/incfs/

cat kernel-4.19/.config | grep CONFIG_INCREMENTAL_FS
# CONFIG_INCREMENTAL_FS is not set
```

检查 `/sys/fs/incremental-fs/features/v2` 或 `pm list features | grep incremental`；以下保留功能声明和失败信息。

```text
feature:android.software.incremental_delivery=2

GtsIncrementalInstallProxyHostTestCases
com.google.android.packageinstallerv2proxy.host.gts.ConcurrentInstallationHostTest#testConcurrentInstallWithOneFailure
报错信息:java.lang.AssertionError: expected:<SUCCESS> but was:<FAILURE>
关键打印:[incfs] Feature is not enabled
I InstallationHelper: Commit
I IncrementalService: createStorage: /data/app/vmdl1270450043.tmp | 5
W incfs : [incfs] Feature is not enabled
E IncrementalService: Vold::mountIncFs() failed: Status(-8,
EX_SERVICE_SPECIFIC): '-95: '
E InstallationHelper: Installation Failed. Error Code: 6, message:
INSTALL_FAILED_MEDIA_UNAVAILABLE: Couldn't create incremental storage at
/data/app/vmdl1270450043.tmp
```

### 10.19 签名

参考build/target/product/security/README。生成media/platform/shared/testkey四组，各pem、pk8、x509.pem共12文件。密码留空直接回车，否则解密失败。OTA_KEY_DIR在device/rockchip/common/mkimage.sh定义为device/rockchip/common/security。Android11/12/14替换build/target/product/security，Android13替换device/rockchip/common/security。

```text
build/target/product/security/README

  development/tools/make_key testkey '/C=CN/ST=Fujian/L=Fuzhou/O=Rockchip/OU=Rockchip/CN=Rockchip/emailAddress=gms@rock-chips.com'
  生成:testkey.pk8 testkey.x509.pem ## 文件在根目录下
  openssl pkcs8 -inform DER -nocrypt -in testkey.pk8 -out testkey.pem
  生成:testkey.pem

# Android 13替换到如下目录
device/rockchip/common/security/
# Android 14替换到如下目录
build/target/product/security/

Enter password for 'testkey' (blank for none; password will be visible):
 ## 不设密码直接回⻋Enter
报错信息:Error decrypting key
139:error:0D0680A8:asn1 encoding routines:asn1_check_tlen:wrong
tag:../crypto/asn1/tasn_dec.c:1149:
139:error:0D06C03A:asn1 encoding routines:asn1_d2i_ex_primitive:nested asn1
error:../crypto/asn1/tasn_dec.c:713:
139:error:0D08303A:asn1 encoding routines:asn1_template_noexp_d2i:nested asn1
error:../crypto/asn1/tasn_dec.c:646:Field=version, Type=PKCS8_PRIV_KEY_INFO
```

BTS已泄露签名检查涉及framework-res，需替换platform.pk8及x509.pem。Bluetooth下列三处证书须一致。

```text
Blocked app /system/framework/framework-res.apk
报错信息:This build contains pre-installed "android" at
/system/framework/framework-res.apk which has been signed by a certificate that
is known to be compromised and should be replaced.

device/rockchip/common/security/bluetooth.x509.pem
packages/modules/Bluetooth/android/app/certs/com.android.bluetooth.x509.pem
vendor/partner_modules/build/certificates/bluetooth.x509.pem
```

### 10.20 Apex签名

常规GMS也需替换。btservices位于packages/modules/Bluetooth/apex。i18n示例先source、lunch再执行；修改后make clean。算法SHA256_RSA4096。若仍失败，关闭重开终端，检查/tmp/ApexSignatureVerificationTest***缓存。

```text
CtsAppSecurityHostTestCases
android.appsecurity.cts.ApexSignatureVerificationTest#testApexPubKeyIsNotWellKnownKey
报错信息:java.lang.AssertionError: must not use well known pubkey
        Expected: must not match well known key
         but: was
</tmp/ApexSignatureVerificationTest13030241211815479418/tests-apex_com.android.btservices874024/apex_pubkey>
GtsApexSignatureVerificationTest
android.appsecurity.cts.ApexSignatureVerificationTest#testApexPubKeyIsNotWellKnownKey
报错信息:1. com.rockchip.hardware.sensors must not use well known pubkey

          expected to be false
        7. com.android.rkpd must not use well known pubkey
          expected to be false
解决方法:根据报错信息替换apex_com.android.btservices签名(SDK目录
packages/modules/Bluetooth/apex)
GtsPackageSignatureTest
android.security.cts.PackageSignatureTest#testPackageSignatures
报错信息:These packages should not be signed with a well known key:
[com.android.bluetooth, com.android.btservices, com.android.i18n,
com.android.rkpd, com.android.runtime, com.android.uwb,
com.android.uwb.resources, com.android.virt, com.android.vndk.v34,
com.rockchip.hardware.sensors]

cd libcore/apex/
rm com.android.i18n.pem com.android.i18n.avbpubkey
openssl genrsa -out com.android.i18n.pem 4096 ## 注意换行
avbtool extract_public_key --key com.android.i18n.pem --output com.android.i18n.avbpubkey

报错信息:avbtool: Adding hashtree_footer failed: Key is wrong size for algorithm SHA256_RSA4096.
```

签名路径：i18n在Android13/12为packages/modules/RuntimeI18n/apex、Android11为libcore/apex；runtime全部bionic/apex；art在13/12无需替换、11为art/build/apex。原表还列btservices空行，虽文字称三个模块，保留此差异。

### 10.21 预装应用

user版本检查应用权限。不启用Express宏时出现以下错误，只有确认应用使用标准API和权限后才移除对应检查。调试时将enforce改log；user无adb可用boot-debug.img替换boot（A/B为boot_a/boot_b），GKI用vendor_boot-debug.img替换vendor_boot_a/vendor_boot_b。

```text
error: Please note that all your apps MUST be able to get permissions, Otherwise android cannot boot!

Android_SDK/device/rockchip/common$ git diff modules/gms.mk
   ifeq ($(strip $(TARGET_BUILD_VARIANT)), user)
     ifneq ($(strip $(BUILD_WITH_GOOGLE_GMS_EXPRESS)),true)
       $(warning ****************************************)
- $(error Please note that all your apps MUST be able to get permissions, Otherwise android cannot boot!)
       $(warning After confirming your apps, please remove the above error line!)
       $(warning ****************************************)

device/rockchip/common/modules/gms.mk:
# Enforce privapp-permissions whitelist only for user build.
PRODUCT_PROPERTY_OVERRIDES += \
    ro.control_privapp_permissions=enforce --> 改为
ro.control_privapp_permissions=log
```

搜索not in privapp-permissions allowlist日志，按APK实际所在分区添加权限；system_ext Wallpaper例子如下。不要编入RKDeviceTest、Lightning、StressTest、RKUpdateService。

```text
W PackageManager: Privileged permission
android.permission.READ_WALLPAPER_INTERNAL for package
com.google.android.apps.wallpaper (/system_ext/priv-app/WallpaperGoogle) not in
privapp-permissions allowlist
W PackageManager: Privileged permission
android.permission.SET_WALLPAPER_COMPONENT for package
com.google.android.apps.wallpaper (/system_ext/priv-app/WallpaperGoogle) not in
privapp-permissions allowlist
W PackageManager: Privileged permission
android.permission.CHANGE_OVERLAY_PACKAGES for package
com.google.android.apps.wallpaper (/system_ext/priv-app/WallpaperGoogle) not in
privapp-permissions allowlist
W PackageManager: Privileged permission android.permission.WRITE_SECURE_SETTINGS
for package com.google.android.apps.wallpaper (/system_ext/priv-app/WallpaperGoogle) not in privapp-permissions allowlist

Android_SDK/vendor/partner_gms$ git diff etc/permissions/privapp-permissions-google-system-ext.xml
+ <privapp-permissions package="com.google.android.apps.wallpaper">
+ <permission name="android.permission.READ_WALLPAPER_INTERNAL"/>
+ <permission name="android.permission.SET_WALLPAPER_COMPONENT"/>
+ <permission name="android.permission.CHANGE_OVERLAY_PACKAGES"/>
+ <permission name="android.permission.WRITE_SECURE_SETTINGS"/>
+ </privapp-permissions>
 </permissions>
```

### 10.22 预检查

安全模式：开机动画时按住音量减，或长按重启图标。Lockdown：添加密码，进入设置→安全和位置→锁屏偏好设置→显示锁定选项。加密：设置→安全→更多安全→加密与凭据→加密平板。

## 11 GMS Express

GMS Express按月提供安全更新。下表保留原稿Regular/Go支持状态；星号未定义，不作可用性推断。

| 芯片 | Android12 Regular/Go | Android13 Regular/Go | Android14 Regular/Go |
| --- | --- | --- | --- |
| RK3288 | Y/N | */N | N/N |
| RK3326 | Y/Y | */Y | * |
| RK3399 | Y/N | */N | */N |
| RK3562 | N/N | Y/Y | Y/Y |
| RK3566 | Y/Y | Y/Y | Y/Y |
| RK3576 | N/N | N/N | */N |
| RK3588 | Y/N | Y/N | Y/N |

### 11.1 申请与维护

需要MADA及Go附加协议等资格；EDLA合同项目需按原稿后述专用配置。Express包含月度安全补丁、GMS、AOSP重要基线更新；需通知客户并OTA更新终端，否则Rockchip不再提供相应支持。Express SDK不同，向Rockchip销售提交资格证明申请下载。

### 11.2 SDK与配置

Android10起共用代码，可切换manifest而不用重新下载全部代码；下面保留各版本文件名大小写。

```text
repo init -m Android10_Express.xml
# Android 11请使用Android 11的xml
repo init -m Android11_Express.xml
# Android 12请使用Android 12的xml
repo init -m Android12_express.xml
# Android 13请使用Android 13的xml
repo init -m Android13_Express.xml
# Android 14请使用Android 14的xml
repo init -m Android14_Express.xml

repo init --repo-url=ssh://git@www.rockchip.com.cn:2222/repo-release/tools/repo.git -u ssh://git@www.rockchip.com.cn:2222/Android_Qt/manifests.git -m Android10_Express.xml
# Android 11
repo init --repo-url=ssh://git@www.rockchip.com.cn:2222/repo-release/tools/repo.git -u ssh://git@www.rockchip.com.cn:2222/Android_R/manifests.git -m Android11_Express.xml
# Android 12
repo init --repo-url=ssh://git@www.rockchip.com.cn:2222/repo-release/tools/repo.git -u ssh://git@www.rockchip.com.cn:2222/Android_S/manifests.git -m Android12_express.xml
# Android 13
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo -u https://gerrit.rock-chips.com:8443/Android_T/manifests.git -m Android13_Express.xml
# Android 14
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo -u https://gerrit.rock-chips.com:8443/Android_U/manifests.git -m Android14_Express.xml

BUILD_WITH_GOOGLE_GMS_EXPRESS := true
```

宏会去掉RK应用，需添加自己的应用；功能由GMSEXPRESS_BUILD控制，基线为ExpPlus。定制后重新核对Google Exp+要求，合规后才改PLUS标志。原稿提到可能补贴，应咨询3PL，不适用于EDLA且不构成补贴承诺。

```text
Android_SDK/vendor/rockchip/common$ git diff gms-express.xml
  <!-- These are configurations that should exist on GMS Express devices. -->
  <config>
- <feature name="com.google.android.feature.GMSEXPRESS_BUILD " />
+ <feature name="com.google.android.feature.GMSEXPRESS_PLUS_BUILD" />
  </config>
```

EDLA不能使用Express，但设宏true可使用gms-express.xml中的机型features。无电池设备需FTP GMS-Test-Suite/Exp+/batteryless.diff。下列每个名称均带com.google.android.feature.前缀：无电池other_form_factor、batteryless_device；有电池且大于18英寸other_form_factor、large_display；无电池且大于18英寸三者都有；无电池且显示器独立other_form_factor、batteryless_device、headless_device。

```text
Android_SDK/vendor/rockchip/common$ git diff gms-express.xml
  <!-- These are configurations that should exist on GMS Express devices. -->
  <config>
- <feature name="com.google.android.feature.GMSEXPRESS_BUILD " />
+ <feature name="com.google.android.feature.ENTERPRISE_DEVICE" />
+ <feature name="com.google.android.feature.batteryless_device"/>
  </config>
```

## 12 主机配置

### 12.1 Ubuntu 主机环境

原稿要求使用 Ubuntu 主机，不使用 Windows，并自行配置 Java、Python、adb、fastboot、aapt。Rockchip 安全补丁 FTP 及原稿提供的访问信息如下；这不是新验证的账号或可用性承诺。Android 12+ 常见问题和工具位于 `GMS-Test-Suite/Exp+`。

| 地址 | 账户 | 密码 |
| --- | --- | --- |
| ftp://ftp.rock-chips.com | xzj-guest | V3qTwMQ4YV |

原稿建议解压 FTP 中的 `Android_O_cts_env.tar.gz`，将以下环境变量写入 `~/.bashrc`，或保存为 `env` 并在测试前执行 `source env`。其中 `Your_Name` 需替换。随后按 §12.2 升级 adb、aapt、fastboot，版本过低会导致测试异常。

```sh
export JAVA_HOME=/home/Your_Name/Software/jdk1.8.0_77 ## 注意替换Your_Name
export JRE_HOME=${JAVA_HOME}/jre
export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib
export PATH=${JAVA_HOME}/bin:$PATH
export PATH=/home/Your_Name/Software/android-sdk-linux/tools:$PATH
export PATH=/home/Your_Name/Software/android-sdk-linux/platform-tools:$PATH
export PATH=/home/Your_Name/Software/android-sdk-linux/build-tools/19.0.0:$PATH

$ aapt version
$ adb --version
$ fastboot --version
$ java --version
```

| Android版本 | 最低adb版本 | 最低fastboot版本 |
| --- | --- | --- |
| Android 10.0 | 29.0.6+ | 29.0.6+ |
| Android 11.0 | 30 | 30 |
| Android 12.0 | 31 | 31 |
| Android 12.1 (Android 12L) | 31 | 31 |
| Android 13 | 33 | 33 |

若 aapt 不可用，安装 C++ 兼容库；否则可能导致 CtsDeqpTestCases 失败。随后安装 Python 开发包、Protocol Buffer 和虚拟环境工具；Python 3 可能还需最后一项。

```sh
$ sudo apt-get install lib32stdc++6 lib32z1
$ sudo apt-get install python-dev
$ sudo apt-get install python-protobuf
$ sudo apt-get install protobuf-compiler
$ sudo apt-get install python-virtualenv
$ sudo apt-get install python-pip
$ sudo apt install virtualenv
```

### 12.2 主机环境问题与注意事项

**1. 无法创建虚拟环境。** VTS 无法创建虚拟环境时，原稿建议强制将 pip 指向 pip2，再通过 pip 安装 virtualenv。以下为历史环境操作，本文未执行。

```sh
$ sudo apt autoremove python-virtualenv
$ sudo apt autoremove virtualenv
$ sudo ln -sf ~/.local/bin/pip2 /usr/bin/pip
$ pip install --user virtualenv
```

**2. 升级 adb、aapt、fastboot。** 使用 SDK 工具替换，参考 `Rockchip_Android_*_development_guide_V*_CN.pdf`。以 adb 为例先查位置并停止服务，然后替换对应 binary；FTP 包为 `GMS-Test-Suite/sdk_tools.tar.gz`。旧 fastboot 执行 `fastboot reboot fastboot` 可能报下述错误。

```text
$ whereis adb
adb: /home/rockchip/Software/android-sdk-linux/platform-tools/adb
$ adb kill-server
fastboot: usage: unknown reboot target fastboot
```

**3. 新测试包需要 aapt2。** 两类报错如下。先查看 aapt 路径，将 SDK 的 `out/host/linux-x86/bin/aapt2` 放到 Ubuntu 的 `/home/rockchip/Software/sdk_tools/aapt2`，并执行 `chmod 775 aapt2`。原稿还给出构建配置摘录，末尾上下文未完整列出。

```text
java.io.IOException: Cannot run program "aapt2": error=2, No such file or directory
E/AaptParser: aapt2 dump badging stderr: W/ziparchive(2284292): Unable to open 'badging': No such file or directory
$ which aapt
/home/rockchip/Software/sdk_tools/aapt

prebuilts/sdk/tools/Android.bp
cc_prebuilt_binary {
    name: "aapt2",
    host_supported: true,
    prefer: true,
    target: {
        linux: {
            srcs: ["linux/bin/aapt2"],
        },
        darwin: {
            srcs: ["darwin/bin/aapt2"],
        },
        windows: {
            srcs: ["windows/bin/aapt2.exe"],
        },
    },
```

**4. adb devices 显示 no permissions。** 先用 lsusb 获取设备 VID/PID，在 udev 规则中填入实际值，重新插拔 adb 线后查询。下列 `1f3a:1001` 是原稿示例，不是通用值。

```text
$ adb devices
List of devices attached
CKP0KUIQQ1 no permissions(missing udev rules? user is in the plugdev group);
see http://developer.android.com/tools/device.html

$ lsusb
Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 001 Device 070: ID 1f3a:1001 Onda (unverified)
## 获取adb设备识别码1f3a:1001
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub

$ sudo vim /etc/udev/rules.d/android.rules
SUBSYSTEM=="usb",ATTRS{idVendor}=="1f3a",ATTRS{idProduct}=="1001",MODE="0666"
## 添加adb设备注意替换1f3a:1001

$ adb devices
List of devices attached
CKP0KUIQQ1 device
```

**5. fastboot devices 显示 no permissions。** 在 fastboot 模式运行 lsusb 并添加对应 VID/PID；fastboot 与 adb 模式的 VID/PID 不同。

```text
$ fastboot devices
no permissions(missing udev rules? user is in the plugdev group); see [......]
Android Fastboot
```

**6. CtsUsesNativeLibraryTest 的 JNI 错误。** 原稿处理方法是升级 JDK，FTP 包 `/GMS-Test-Suite/openjdk-11+28_linux-x64_bin.tar.gz`；错误和核对输出如下。

```text
java.lang.RuntimeException: Error: A JNI error has occurred, please check your installation and try again
Exception in thread "main" java.lang.UnsupportedClassVersionError:
com/android/signapk/SignApk has been compiled by a more recent version of the Java Runtime (class file version 55.0), this version of the Java Runtime only recognizes class file versions up to 52.0

$ java --version
openjdk 11 2018-09-25
OpenJDK Runtime Environment 18.9 (build 11+28)
OpenJDK 64-Bit Server VM 18.9 (build 11+28, mixed mode)
$ whereis java
java: /usr/share/java /home/Rockchip/Software/jdk-11/bin/java
```

**7. Ubuntu 堆内存不足。** 原稿要求主机内存至少 16 GB，可重启主机后再试。

```text
E/CommandScheduler: Java heap space
java.lang.OutOfMemoryError: Java heap space
${JAVA_BINARY} $RDBG_FLAG -Xmx16g -XX:+HeapDumpOnOutOfMemoryError -cp ${JAR_PATH} -DCTS_ROOT=${CTS_ROOT}
```

### 12.3 Docker 测试环境

不按上述流程搭建 Ubuntu 时，可从 FTP `GMS-Test-Suite/xTS/tools/Docker` 获取 Docker 容器运行测试。

## 13 GMS 认证测试

### 13.1 测前准备

1. 按 Rockchip Android SDK 发布说明给测试机刷入固件。
2. 集成 GMS 后首次启动较慢，等待完成；在 Setup Wizard 选择 United States English，先跳过 Wi-Fi，选择美国时区，不登录账号，进入 Home。
3. 随后在 Settings → Wi-Fi 联网，设备及 Ubuntu 主机连接 VPN；主机直接连接，不使用 SSR 方式。
4. CTS/GTS 前不要登录 GMS 账号；例外是 EEA Go 的 `GtsRegulationComplianceTestCases` 单测，按 EEA 文档登录 EEA 测试账号并选择非 Google 搜索引擎（如 DuckDuckGo）。
5. Settings → Security → Screenlock 选择 None。
6. 有物理键盘时启用 Languages & input → Physical keyboard → Show virtual keyboard。
7. 连续点击 Settings → About tablet（phone）→ Build Number，显示 Developer Options。
8. 启用 Developer options → Stay awake。
9. 保持 Settings → Location 定位开启。
10. Display → Sleep 设最长，亮度调暗以适应长时间测试。
11. 启用 Display → Adaptive brightness（原稿 Android 13 要求）。
12. 使用新版 android-cts-media-version 媒体资源，参见 §14。
13. 执行媒体包脚本 `source copy_media.sh && source copy_image.sh`，或放入 `/tmp/android-cts-media/android-cts-media-1.4`；Android 11+ 使用 media-1.5。
14. VTS 前确认 Sensor 校准，校准永久有效，但升级固件后需重新核验；未校准设备应水平静置，user 固件刷入 vendor_boot-debug.img 后按下列命令操作。

```text
$ adb root
adbd is already running as root
$ adb shell
console:/ $ cat /sys/class/sensor_class/accel_calibration
read error ## 未校准
console:/ $ echo 1 > /sys/class/sensor_class/accel_calibration ## 机器水平静止放置
console:/ $
console:/ $ cat /sys/class/sensor_class/accel_calibration
accel calibration: 166, -309, -177 ## 校准成功
```

15. 物理竖屏设备竖放，物理横屏设备横放。
16. 测前不得设置 PIN 锁屏（错误：`Device must have screen lock disabled`）。
17. 确认 SN 在重启后不变，烧写规范见 §15.4。
18. 每次重新测试都按以上步骤重新配置。

注意：§13.10 对 CTS-Verifier 的部分交互测试另外要求 PIN，必须区分测试场景。

### 13.2 进入测试终端

```sh
Rockchip@Rockchip-pc:~/android-cts/tools$ ./cts-tradefed ## CTS测试终端
Rockchip@Rockchip-pc:~/android-vts/tools$ ./vts-tradefed ## VTS测试终端
Rockchip@Rockchip-pc:~/android-gts/tools$ ./gts-tradefed ## GTS测试终端
Rockchip@Rockchip-pc:~/android-sts/tools$ ./sts-tradefed ## STS测试终端
Rockchip@Rockchip-pc:~/android-apts-go/tools$ ./apts-tradefed ## APTS测试终端
```

### 13.3 多机协作测试

大部分测试支持 `--shard-count`。原稿提醒，一台掉电或死机会丢失该机全部报告，模块数量异常。建议先稳定设备，单机跑十分钟后拔掉生成完整报告，再基于该报告多机 retry。

```sh
run cts --shard-count 3 -s SN1 -s SN2 -s SN3 ## 3台机器同时跑CTS
```

### 13.4 跳过模块或测试项

```sh
run cts --exclude-filter "CtsViewTestCases"
run cts --exclude-filter "CtsViewTestCases android.view.cts.SurfaceViewSyncTests#testEmptySurfaceView"
```

### 13.5 GSI 烧写

确认解锁后进入 fastbootd，烧 GSI 的 system.img 和固件编译出的 misc.img，随后 recovery 恢复出厂设置。1：进入 bootloader 并解锁；已烧 AVB 公钥的设备按相应文档解锁。2：恢复出厂并进入 fastbootd。3：刷入 GSI；空间不足时可删除 product，A/B 或虚拟 A/B 需同时处理 product_a/product_b。以下是原稿流程，仅供阅读，未执行。

```sh
adb reboot bootloader
fastboot oem at-unlock-vboot ## 对于烧写过avb公钥的客户，请参考对应的文档解锁。
fastboot reboot fastboot ## 此时将进入fastbootd
## (可选)对于分区空间紧张的设备，可以先执行本条命令删除product分区后再烧写GSI
fastboot delete-logical-partition product
## 对于使用A/B，虚拟A/B的设备，需要同时删除product_a/product_b
fastboot delete-logical-partition product_a
fastboot delete-logical-partition product_b
fastboot flash system system.img
## 烧misc.img恢复出厂设置(否则机器开机可能卡在加载界面)，misc是固件一起编译出来的
fastboot flash misc misc.img
## VTS测试：GKI固件烧写vendor_boot-debug.img到vendor_boot分区；非GKI固件烧写boot-debug.img到boot分区
fastboot flash vendor_boot vendor_boot-debug.img
## 烧写成功后，重启
fastboot reboot
```

1. 也可使用 DSU（Dynamic System Updates），原稿称平台已默认支持；由于耗内存，不建议 2G DDR 及以下设备使用，详见 Android 官方资料。
2. VTS 还需 boot-debug.img 到 boot；GKI 则 vendor_boot-debug.img 到 vendor_boot，设备不能锁定。
3. CTS-ON-GSI 不需要上述 debug 镜像。
4. 使用 Google 官方 signed- 开头的 GSI 和 Release build 的 GKI boot 镜像。
5. GSI 无法启动时，可刷相应 debug 镜像，通过 adb/串口取得 logcat 排查。

| 原稿版本标识 | 下载说明 |
| --- | --- |
| aosp-android11-gsi | Android 11 PAB GSI，搜索 aosp_arm64-img |
| aosp-android12-gsi | Android 12 PAB GSI，搜索 aosp_arm64-img |
| aosp-android13-gsi | Android 13 PAB GSI，搜索 aosp_arm64-img |
| aosp-android13-gsi | Android 14 PAB GSI，搜索 aosp_arm64-img |

原稿 Android 14 行仍写 aosp-android13-gsi，保留该矛盾，不猜改下载版本。

### 13.6 VTS / CTS-ON-GSI 的锁定状态

- CTS/GTS：原有 OEM 完整固件，锁定后测试，命令 `fastboot oem at-lock-vboot`。
- CTS-on-GSI：先解锁、刷 GSI，再锁定测试；原稿特别注明 Android 13+ 刷 GSI 后不再锁定。
- VTS：解锁后刷 boot-debug 和 GSI，不锁定。

CTS-on-GSI 必须是 signed- GSI，安全补丁级别等于或高于 SDK，否则重新锁定后无法启动。刷 GSI 后显示的是 GSI 的 Security Patch，不是原固件值。Android 11/12 的 CTS 或 CTS-on-GSI 必须按上面锁定，否则可能出现如下失败；Android 13+ CTS-ON-GSI 不要求锁定。

```text
CtsKeystoreTestCases
android.keystore.cts.KeyAttestationTest#testEcAttestation
android.keystore.cts.KeyAttestationTest#testRsaAttestation
android.keystore.cts.KeyAttestationTest#testEcAttestation_DeviceLocked
android.keystore.cts.KeyAttestationTest#testRsaAttestation_DeviceLocked

console:/ $ getprop | grep ro.boot.verifiedbootstate
[ro.boot.verifiedbootstate]: [orange] ## 属性值orange表示机器未锁定
[ro.boot.verifiedbootstate]: [green] ## 属性值green表示机器已锁定
console:/ $ getprop | grep ro.boot.vbmeta.device_state
[ro.boot.vbmeta.device_state]: [unlocked] ## 属性值unlocked表示机器未锁定
[ro.boot.vbmeta.device_state]: [locked] ## 属性值locked表示机器已锁定
```

### 13.7 VTS

额外烧写签名的 AOSP system-xxx-signed.img（Google/3PL/Rockchip FTP 获取）和 boot-debug.img。开启 AVB 后打包结果位于 rockdev/Image-xxx；GKI 的 debug 变体见上文。

| 测试包 | 测试命令 | retry命令 | 单测命令 |
| --- | --- | --- | --- |
| android-vts-xxx-arm_64.zip | `run vts` | `run retry --retry 0` | `run vts -m module_name -t case_name` |

### 13.8 CTS-ON-GSI

同上烧入签名 GSI，原稿区分当前表与 Android 10 及以前使用的测试包：

| 测试包 | 测试命令 | retry命令 | 单测命令 |
| --- | --- | --- | --- |
| android-cts-xxx-arm_64.zip | `run cts-on-gsi` | `run retry --retry 0` | `run cts-on-gsi -m module_name -t case_name` |

Android 10 及以前：

| 测试包 | 测试命令 | retry命令 | 单测命令 |
| --- | --- | --- | --- |
| android-vts-xxx-arm_64.zip | `run cts-on-gsi` | `run retry --retry 0` | `run cts-on-gsi -m module_name -t case_name` |

### 13.9 CTS

使用按前文配置的完整 user 固件。

| 测试包 | 测试命令 | retry命令 | 单测命令 |
| --- | --- | --- | --- |
| android-cts-_xxx-linux_x86-arm.zip | `run cts` | `run retry --retry 0` | `run cts -m module_name -t case_name` |

### 13.10 CTS-Verifier

使用按前文配置的完整 user 固件。测试包 `android-cts-verifier-xx_xx-linux_x86-arm.zip`，测试、retry 和单测均为手动。按以下顺序设置，版本条件逐项适用：

1. 安装前：

```sh
adb shell settings put global hidden_api_policy 1
```

2. 随后必须使用此安装命令：

```sh
adb install -r -g CtsVerifier.apk
```

3. Android 10+：

```sh
adb shell appops set com.android.cts.verifier android:read_device_identifiers allow
```

4. Android 11+：

```sh
adb shell appops set com.android.cts.verifier MANAGE_EXTERNAL_STORAGE 0
```

5. Android 13+：

```sh
adb shell am compat enable ALLOW_TEST_API_ACCESS com.android.cts.verifier
```

6. Android 14+：

```sh
adb shell appops set com.android.cts.verifier TURN_SCREEN_ON 0
```

7. 正确设置系统时间。
8. CTS-Verifier 在刷机后的开机向导中需设置 PIN，否则 Notification Listener Test 找不到条目会失败。
9. 报告路径 `/storage/emulated/0/VerifierReports/`。

Controls Panel tests 前也必须设置 PIN。

### 13.11 GTS

使用配置完整的 user 固件，开机向导连接 VPN-Wi-Fi，不登录 Google 账号。确认主机环境及 GTS key，使用 `echo $APE_API_KEY` 查看。从 3PL 取得 key.json 后配置环境变量；原稿列出服务账号认证失败、EDI 白名单申请的情形。

```text
$ vi .bashrc
export APE_API_KEY=/path/to/key.json ## 注意替换/path/to
Test failed due to failed service account authentication, please ensure service account key is installed and try again.

run gts -m GtsEdiHostTestCases
This device isn't Play Protect certified
Test failed due to unrecognized service account for this product, please submit an initial GTS report for this product with full EDI (run gts -m GtsEdiHostTestCases) at https://partner.android.com/approvals/upload-report and try again.
```

将该模块报告（原稿示例 `android-gts/results/2023.01.01_01.01.01.zip`）交给 3PL，由其上传 Google 申请 EDI 白名单。本文没有执行提交。

| 测试包 | 测试命令 | retry命令 | 单测命令 |
| --- | --- | --- | --- |
| android-gts-xx.zip | `run gts` | `run retry --retry 0` | `run gts -m module_name -t case_name` |

未烧 Attestation key 的设备在向导连接 VPN-Wi-Fi 时可能报：

```text
E/DynamiteLoaderV2Impl( 4625): gzh: Can't load code for GoogleCertificates.apk
E/GoogleCertificates( 4625): Failed to get Google certificates from remote
E/GoogleCertificates( 4625): amh: Remote load failed. No local fallback found.
D/AndroidRuntime( 4813): Shutting down VM
E/AndroidRuntime( 4813): FATAL EXCEPTION: main
E/AndroidRuntime( 4813): Process: com.google.android.apps.restore, PID: 4813
E/AndroidRuntime( 4813): java.lang.SecurityException: GoogleCertificatesRslt: module init: Remote load failed. No local fallback found. (go/gsrlt)
```

### 13.12 GTS-Verifier

原稿说明 Android 14+ 不再测试 GTS-Verifier；参考 [GTS-Verifier](https://docs.partner.android.com/gms/testing/gts/gts-verifier?hl=en)。

### 13.13 GTS Interactive

原稿说明这是 Android 13+ 新增要求，替代 GTS-Verifier 手动测试，按屏幕提示操作。

| 测试包 | 测试命令 | retry命令 | 单测命令 |
| --- | --- | --- | --- |
| android-gts-xx.zip | `run gts-interactive` | `run retry --retry 0` | `run gts-interactive -m module_name -t case_name` |

### 13.14 STS

使用完整 userdebug 固件，先完成上述配置；失败项处理参见 SDK《Android 安全补丁说明》。STS ZIP 解压密码为原稿给出的 `sts`。安全补丁查询参考 [Android 安全公告](https://source.android.com/docs/security/bulletin/asb-overview)。

| 测试包 | 测试命令 | retry命令 | 单测命令 |
| --- | --- | --- | --- |
| android-sts-xx.zip | `sts-dynamic-full` | `run retry --retry 0` | `run sts -m module_name -t case_name` |

### 13.15 GOATS 性能测试

使用配置完整的 userdebug 固件；内核必须用 Clang 编译，并应用以下原稿补丁。代码中的许可证头保留。

```diff
diff --git a/drivers/video/rockchip/rga2/Kconfig b/drivers/video/rockchip/rga2/Kconfig
index efc1ef6..3458051 100644
--- a/drivers/video/rockchip/rga2/Kconfig
+++ b/drivers/video/rockchip/rga2/Kconfig
@@ -1,5 +1,5 @@
 # SPDX-License-Identifier: GPL-2.0
-menu "RGA2"
+menu "RGA2G"
 depends on ARCH_ROCKCHIP
 config ROCKCHIP_RGA2
```

### 13.16 APTS

使用完整 userdebug 固件。Android 12+ 的 Go 设备使用新的 APTS 性能测试，不再跑 GOATS。填入对应 user 固件的 fingerprint；不支持 retry。原稿 fingerprint 示例末尾为 `user/release`，按原样保留，不补写。

| 测试包 | 测试命令 | 单测命令 |
| --- | --- | --- |
| android-apts-go.zip | `run test/approval-go --fingerprint-swap google/wembley/wembley:12/SP1A.210712.001/7539480:user/release` | `run test/approval-go --test-case app-start-cold-3p` |

### 13.17 BTS

原稿记录从 2018-04-01 起认证设备需 Android BTS（Build Test Suite），参考 [Partner 文档](https://support.google.com/androidpartners_gms/answer/9027630?hl=en)。上传固件时不要提交打包后的 update.img，否则 Google 无法解析；具体流程咨询 3PL。将下列镜像放入以 Fingerprint 命名的目录，把其中 `:` 和 `/` 换为 `~`，再压缩 ZIP。

```text
rockchip~rk3326_qgo~rk3326_qgo~10~QD1A.190821.014.C2~201911~user~release-keys$ ls
boot-debug.img boot.img dtbo.img misc.img recovery.img super.img vbmeta.img
```

虚拟 A/B 的 GMS 固件没有 recovery.img。GKI 还需 vendor_boot.img、init_boot.img，并用 vendor_boot-debug.img 替代 boot-debug.img。

原稿提到，有产品通过全部 GMS 测试后仍因 BTS 检出 PHA（有害应用）被拒。可先将拟预装应用提交 Google Play 检测，具体与 3PL/TAM 确认；本文没有上传应用或固件。

## 14 本地媒体包测试

### 14.1 CTS 本地媒体包

本地媒体可排除网络问题、减少视频等待。可按 Google 说明获取，或从 FTP `GMS-Test-Suite/xTS/CTS_local_media_package` 下载。

1. 下载 media 1.5 和在线测试媒体包。
2. 将在线测试媒体包推到设备 sdcard。
3. 解压 media 1.5 到 Ubuntu `/tmp/android-cts-media/android-cts-media-1.5`。
4. 使用下列单测命令并按实际目录调整路径。原稿解压路径与命令路径不同，此处保留并指出，执行前需统一。

```sh
$ adb push CtsMediaTestCases /sdcard/
run cts -m CtsMediaTestCases \
--module-arg CtsMediaTestCases:config-url:https://storage.googleapis.com/cts_media/DynamicConfig_local.json \
--module-arg CtsMediaTestCases:local-media-path:/tmp/android-cts-media-1.5
```

### 14.2 GTS 本地媒体包

同样可减少网络问题和视频等待，按 Google 说明或 FTP `GMS-Test-Suite/xTS/GTS_local_media_package` 获取。

1. 下载 GtsExoPlayerTestCases、GtsYouTubeTestCases、GtsMediaTestCases。
2. 推送本地媒体包到 sdcard。
3. 使用下面完整命令测试。
4. 单测时替换模块名，原稿示例为 WvtsDeviceTestCases。

```sh
$ adb push gts test wvmedia /sdcard/
run gts \
--module-arg GtsExoPlayerTestCases:config-url:https://storage.googleapis.com/exoplayer-test-media-1/gen-4/dynamic-config-sdcard-1.0.json \
--module-arg "GtsYouTubeTestCases:skip-media-download:true" \
--module-arg "GtsYouTubeTestCases:instrumentation-arg:media-path:=/sdcard/test" \
--module-arg "GtsMediaTestCases:instrumentation-arg:media-path:=file:///sdcard/wvmedia"

run gts -m WvtsDeviceTestCases \
--module-arg WvtsDeviceTestCases:config-url:https://storage.googleapis.com/exoplayer-test-media-1/gen-4/dynamic-config-sdcard-1.0.json \
--module-arg "WvtsDeviceTestCases:instrumentation-arg:media-path:=file:///sdcard/wvmedia"
```

原稿列出需用本地媒体排查的常见失败项：

```text
WvtsDeviceTestCases
com.google.android.wvts.WidevineH264PlaybackTests#testL3WithUHD60
com.google.android.wvts.WidevineH264PlaybackTests#testClearWithUHD60
com.google.android.wvts.WidevineVP9WebMPlaybackTests#testVP9WebMCencSuperFramesL3WithUHD30
com.google.android.wvts.WidevineVP9WebMPlaybackTests#testVP9WebMProfile210bitCencSuperFramesL3With1080P30
com.google.android.wvts.WidevineVP9WebMPlaybackTests#testVP9WebMCencSubSampleL3WithUHD60
```

§12–14 原稿参考链接（Partner 页面可能需要授权账号）：

- [EEA choice screen](https://docs.partner.android.com/gms/policies/restricted/eea-builds?hl=en#choice-screen)
- [Android 11 GSI](https://ci.android.com/builds/branches/aosp-android11-gsi/grid?legacy=1&selected-targets=aosp_arm64-userdebug)
- [Android 12 GSI](https://ci.android.com/builds/branches/aosp-android12-gsi/grid?legacy=1&selected-targets=aosp_arm64-userdebug)
- [Android 13 GSI](https://ci.android.com/builds/branches/aosp-android13-gsi/grid?legacy=1&selected-targets=aosp_arm64-userdebug)
- [Android 14 GSI](https://ci.android.com/builds/branches/aosp-android14-gsi/grid?legacy=1&selected-targets=aosp_arm64-userdebug)
- [VTS / Treble](https://docs.partner.android.com/gms/testing/vts/treble-compliance?hl=en#sample-test-flor-without-dsu)
- [CTS-Verifier setup](https://source.android.com/docs/compatibility/cts/verifier?authuser=2#setup)
- [Partner builds](https://partner.android.com/approvals/builds?a=1991659975&pli=1)
- [CTS local media setup](https://source.android.com/docs/compatibility/cts/run-locally#sd-setup)
- [CTS media 1.5](https://dl.google.com/dl/android/cts/android-cts-media-1.5.zip)
- [CtsMediaTestCases](https://storage.googleapis.com/cts_media/CtsMediaTestCases.zip)
- [GTS media testing](https://docs.partner.android.com/gms/testing/gts/running-gts?hl=en#run-media-tests)
- [GtsExoPlayerTestCases media](https://storage.googleapis.com/exoplayer-test-media-1/gen-4/exoplayer-gts-media.zip)
- [GtsYouTubeTestCases media](https://storage.googleapis.com/youtube-test-media/gts/GtsYouTubeTestCases-media-1.2.zip)
- [GtsMediaTestCases media](https://storage.googleapis.com/gts_media/wvmedia-gts-media.zip)

原稿 DSU 超链接写成 `http://https//source.android.com/devices/tech/ota/dynamic-system-updates`，协议格式损坏，因此保留为文本，不做可点击入口。GSI 表中 Android 14 行标签错写 android13，但 PDF 超链接实际指向 android14；两者差异明确保留。

## 15 用户客制修改

### 15.1 更新 GMS 包版本

原稿操作如下：解压包、按原命令删除匹配 APK、添加 APK 到版本管理，然后查看本地差异，手动比对后合入。原稿将 `*x86*apk` 的删除称为“删除32Bit应用”，此匹配规则仅按文件名筛选，不能直接等同所有 32 位应用；保留命令及其原注释供核对。

```sh
Android_SDK$ unzip -o gms-oem-U-14-202403.zip -d vendor/
Android_SDK/vendor/partner_gms$ find . -name "*x86*apk" | xargs rm -rf ## 删除32Bit应用
Android_SDK/vendor/partner_gms$ find . -name "*.apk" | xargs git add
Android_SDK/vendor/partner_gms$ git status ./ ## 查到本地修改差异，手动比对再合入
```

### 15.2 查看系统配置项

FTP 路径 `/GMS-Test-Suite/xTS/tools/OverlayTools.apk` 可查看系统或应用配置项，注意选择 Data Type。

```sh
am start -n cn.jcassistant.overlaytools/.MainActivity --es pkg android --es cfg config_automatic_brightness_available
```

### 15.3 查看 RKSDK 版本

获取属性：

```sh
getprop | grep ro.rksdk.version
```

```text
device/rockchip/common/device.mk:
ro.rksdk.version=ANDROID$(PLATFORM_VERSION)_RKR5
```

### 15.4 机器 SN 码命名规范

烧写 SN 时设备需要进入 bootloader。SDK 写号工具位于 `RKTools/windows/RKDevInfoWriteTool-1.3.0.7z`。原稿要求 SN 以字母开头、使用 7-bit ASCII，RK 限制为 6–14 字节，匹配 `^[A-Za-z0-9]+$`，不能包含 `.`、`_` 等符号。注意正则本身也允许数字开头，且源码缓冲区长度为 33；与文字约束的差异保留，不能从缓冲区推断允许长度。

```text
hardware/rockchip/drmservice/Android.mk:
# Verify sn with pattern "^[A-Za-z0-9]+$"
ifeq ($(BUILD_WITH_GOOGLE_MARKET), true)
LOCAL_CFLAGS += -DENABLE_SN_VERIFY
endif

hardware/rockchip/drmservice/drmservice.c:
#define SERIALNO_PATTERN "^[A-Za-z0-9]+$"
#define SERIALNO_BUF_LEN 33

CtsAppSecurityHostTestCases
android.appsecurity.cts.AccessSerialNumberTest#testGetSerialReturnsExpectedFormat
CtsUsbTests
com.android.cts.usb.TestUsbTest#testUsbSerialReadOnDeviceMatches
```

### 15.5 修改系统 API 等级

读取当前 API 等级，按下方配置修改。原稿称 Android 14+ 的 RK 平台增加 GRF 功能，需配置 `BOARD_SHIPPING_API_LEVEL`，否则出现所列测试失败。

```sh
getprop | grep first_api_level
```

```text
device/rockchip/rk3588/rk3588_t/rk3588_t.mk:
PRODUCT_SHIPPING_API_LEVEL := 34

build/make/core/main.mk:
ifdef PRODUCT_SHIPPING_API_LEVEL
ADDITIONAL_VENDOR_PROPERTIES += ro.product.first_api_level=$(PRODUCT_SHIPPING_API_LEVEL)
endif

device/rockchip/rk3588/BoardConfig.mk:
BOARD_SHIPPING_API_LEVEL := 34

build/make/core/main.mk:
ifdef BOARD_SHIPPING_API_LEVEL
ADDITIONAL_VENDOR_PROPERTIES += ro.board.first_api_level=$(BOARD_SHIPPING_API_LEVEL)
endif

GtsOsTestCases
com.google.android.os.gts.GoogleRequirementFreezeTest#testChipsetInfo
```

### 15.6 匹配系统 dpi 与 aapt

`ro.sf.lcd_density` 与 `PRODUCT_AAPT_PREF_CONFIG` 不匹配会产生如下失败，两者需匹配并符合原稿所引用的 Google 标准。根据屏幕物理尺寸和 `wm size` 给出的分辨率计算理想 dpi，并参照标准 dpi/aapt 对应关系。原稿示例计算为 200 时选择附近的 213 dpi（tvdpi），且 `PRODUCT_AAPT_CONFIG` 列表需含 tvdpi。

```text
CtsThemeHostTestCases
android.theme.cts.ThemeHostTest#testThemes
FAILURE: junit.framework.AssertionFailedError: 36 failures in theme test

device/rockchip/rk3588/rk3588_t/rk3588_t.mk:
PRODUCT_PROPERTY_OVERRIDES += ro.sf.lcd_density=213
PRODUCT_AAPT_PREF_CONFIG := tvdpi

device/rockchip/common/device.mk:
PRODUCT_AAPT_CONFIG ?= normal large xlarge hdpi tvdpi xhdpi xxhdpi
```

### 15.7 修改 clientidbase 属性

应按自己的 MADA/EDLA 资质设置 `ro.com.google.clientidbase`，不要使用 Rockchip 的 `android-rockchip`。下面 `android-rockchip` 只是原稿示例。构建结果位于 `out/target/product/rk3588s_t/system/build.prop`。

```text
Android_SDK/vendor/rockchip/common$ git diff gms/gms.prop
+ro.com.google.clientidbase=android-rockchip

device/rockchip/common/modules/gms.mk:
ifeq ($(strip $(BUILD_WITH_GOOGLE_MARKET)), true)
......
$(warning Please set client id with your own MADA ID!)
TARGET_SYSTEM_PROP += vendor/rockchip/common/gms/gms.prop
```

### 15.8 修改 ro.product.*** 属性

```text
[ro.product.brand]: [rockchip]
[ro.product.device]: [rk3588_t]
[ro.product.manufacturer]: [rockchip]
[ro.product.model]: [rk3588_t]
[ro.product.name]: [rk3588_t]

build/make/core/product.mk:
_product_single_value_vars += \
    PRODUCT_SYSTEM_NAME \
    PRODUCT_SYSTEM_MODEL \
    PRODUCT_SYSTEM_DEVICE \
    PRODUCT_SYSTEM_BRAND \
    PRODUCT_SYSTEM_MANUFACTURER \

build/make/core/sysprop.mk:
$(if $(filter system,$(1)),\
    echo "ro.product.$(1).brand=$(PRODUCT_SYSTEM_BRAND)" >> $(2);\
    echo "ro.product.$(1).device=$(PRODUCT_SYSTEM_DEVICE)" >> $(2);\
    echo "ro.product.$(1).manufacturer=$(PRODUCT_SYSTEM_MANUFACTURER)" >> $(2);\
    echo "ro.product.$(1).model=$(PRODUCT_SYSTEM_MODEL)" >> $(2);\
    echo "ro.product.$(1).name=$(PRODUCT_SYSTEM_NAME)" >> $(2);\
,\
    echo "ro.product.$(1).brand=$(PRODUCT_BRAND)" >> $(2);\
    echo "ro.product.$(1).device=$(TARGET_DEVICE)" >> $(2);\
    echo "ro.product.$(1).manufacturer=$(PRODUCT_MANUFACTURER)" >> $(2);\
    echo "ro.product.$(1).model=$(PRODUCT_MODEL)" >> $(2);\
    echo "ro.product.$(1).name=$(TARGET_PRODUCT)" >> $(2);\ ## 工程lunch选项结果

build/make/core/product_config.mk:
TARGET_DEVICE := $(PRODUCT_DEVICE) ## 工程lunch选项结果
ifndef PRODUCT_SYSTEM_NAME
PRODUCT_SYSTEM_NAME := $(PRODUCT_NAME)
endif
ifndef PRODUCT_SYSTEM_DEVICE
PRODUCT_SYSTEM_DEVICE := $(PRODUCT_DEVICE)
endif
ifndef PRODUCT_SYSTEM_BRAND
PRODUCT_SYSTEM_BRAND := $(PRODUCT_BRAND)
endif
ifndef PRODUCT_SYSTEM_MODEL
PRODUCT_SYSTEM_MODEL := $(PRODUCT_MODEL)
endif
ifndef PRODUCT_SYSTEM_MANUFACTURER
PRODUCT_SYSTEM_MANUFACTURER := $(PRODUCT_MANUFACTURER)
endif

device/rockchip/rk3588/rk3588_t/rk3588_t.mk:
PRODUCT_NAME := rk3588_t
PRODUCT_DEVICE := rk3588_t
PRODUCT_BRAND := rockchip ## 修改PRODUCT_BRAND值
PRODUCT_MODEL := rk3588_t
PRODUCT_MANUFACTURER := rockchip

out/target/product/rk3588s_t/system/build.prop
out/target/product/rk3588s_t/vendor/build.prop
```

末尾两个路径为编译结果。以上是原稿配置摘录，包含省略的上下文和原有续行、注释；不能作为完整 Makefile 独立执行。

### 15.9 修改 Fingerprint 指纹

```text
build/make/core/sysprop.mk:
ifeq (,$(strip $(BUILD_FINGERPRINT)))
ifdef ROCKCHIP_BUILD_NUMBER
BF_BUILD_NUMBER := $(ROCKCHIP_BUILD_NUMBER)
else
ifeq ($(strip $(HAS_BUILD_NUMBER)),false)
BF_BUILD_NUMBER := $(BUILD_USERNAME)$$($(DATE_FROM_FILE) +%m%d%H%M)
else
BF_BUILD_NUMBER := $(file <$(BUILD_NUMBER_FILE))
endif
endif
BUILD_FINGERPRINT := $(PRODUCT_BRAND)/$(TARGET_PRODUCT)/$(TARGET_DEVICE):$(PLATFORM_VERSION)/$(BUILD_ID)/$(BF_BUILD_NUMBER):$(TARGET_BUILD_VARIANT)/$(BUILD_VERSION_TAGS)
endif
```

修改指纹各字段时，按以下位置修改对应宏。`TARGET_PRODUCT` 和 `TARGET_BUILD_VARIANT` 来自 `lunch <product_name>-<build_variant>`。

```text
device/rockchip/rk3588/rk3588_t/rk3588_t.mk: PRODUCT_BRAND := rockchip
build/make/envsetup.sh: TARGET_PRODUCT=$product \
build/make/core/product_config.mk: TARGET_DEVICE := $(PRODUCT_DEVICE)
device/rockchip/rk3588/rk3588_t/rk3588_t.mk: PRODUCT_DEVICE := rk3588_t
build/make/core/version_util.mk: PLATFORM_VERSION := $(PLATFORM_VERSION_LAST_STABLE)
build/make/core/version_defaults.mk: PLATFORM_VERSION_LAST_STABLE := 13
build/make/core/build_id.mk: BUILD_ID=TQ3C.230805.001.B2
build/make/envsetup.sh: TARGET_BUILD_VARIANT=$variant \

```

原稿要求通过 GMS/EDLA 的产品使用唯一 Fingerprint，获得认证后不能再改；使用 7-bit ASCII，不能含空格，首字段 `PRODUCT_BRAND` 不能含下划线，否则 Play Store 识别失败。原稿错误示例如下。

```text
CtsOsTestCases
android.os.cts.BuildVersionTest#testBuildFingerprint
Rockchip_Worship_Player/rk3399_t/rk3399_t:13/TQ2B.230505.005.A1/202303:user/release-keys
junit.framework.ComparisonFailure: expected:<Rockchip[ Worship ]Player> but was:<Rockchip[_Worship_]Player>
PRODUCT_BRAND := Rockchip_Worship_Player
```

### 15.10 修改 data 分区文件格式

原稿称 GMS/EDLA 不支持 ext4，userdata 应使用 f2fs 并加密。其 Android 14 且 kernel-5.15 以上范围还要求 /metadata 和 /data（userdata）均为 f2fs。此处保留原稿版本范围，不推断所有 Android 版本的现行认证要求。检查命令：

```sh
$ adb shell cat vendor/etc/fstab.rk30board | grep userdata
```

```text
CtsSecurityHostTestCases
android.security.cts.MetadataEncryptionTest#testMetadataEncryptionIsEnabled
java.lang.AssertionError: Metadata encryption must be enabled
```

处理方法：userdata 必须添加加密标识，原稿说明默认 f2fs 已加密，标识如下。

```text
fileencryption=aes-256-xts:aes-256-cts:v2+inlinecrypt_optimized,keydirectory=/metadata/vold/metadata_encryption,checkpoint=fs
```

- `fileencryption=aes-256-xts:aes-256-cts:v2+inlinecrypt_optimized`：算法与优化组合。
- `keydirectory=/metadata/vold/metadata_encryption`：密钥文件存放目录。
- `checkpoint=fs`：UDC（User Data Checkpoint），支持 data 分区回滚。

若开启虚拟 A/B 后无法启动，需要保证 userdata 文件系统配置一致。原稿日志：

```text
DEBUG: Cmdline: /system/bin/credstore /data/misc/credstore
DEBUG: pid: 720, tid: 720, name: credstore >>> /system/bin/credstore <<<
DEBUG: uid: 1076
DEBUG: tagged_addr_ctrl: 0000000000000001 (PR_TAGGED_ADDR_ENABLE)
DEBUG: signal 6 (SIGABRT), code -1 (SI_QUEUE), fault addr --------
DEBUG: Abort message: 'Check failed: chdir(data_dir.c_str()) != -1 chdir: /data/misc/credstore: No such file or directory' 
```

原稿要求三处配置一致（都为 f2fs 或 ext4），其 ext4 说法针对启动排错，与前述认证范围不是同一结论；认证示例仍为 f2fs。

```text
device/rockchip/rk3588/device.mk:
BOARD_USERDATAIMAGE_FILE_SYSTEM_TYPE := f2fs

device/rockchip/rk3588/rk3588_t/recovery.fstab_AB:
/dev/block/by-name/userdata /data f2fs defaults defaults

device/rockchip/common/scripts/fstab_tools/fstab.in:
/dev/block/by-name/userdata /data f2fs noatime,nosuid,nodev,discard,reserve_root=32768,resgid=1065
```

### 15.11 将 USB Camera 配成前摄或后摄

前摄使用 FRONT，后摄使用 BACK，原稿补丁如下。

```diff
Android_SDK/hardware/interfaces/camera$ git diff device/3.4/default/ExternalCameraDevice.cpp
- const uint8_t facing = ANDROID_LENS_FACING_EXTERNAL;
+ const uint8_t facing = ANDROID_LENS_FACING_FRONT; ## 后摄配置ANDROID_LENS_FACING_BACK
UPDATE(ANDROID_LENS_FACING, &facing, 1);
```

### 15.12 将 USB Mic 配成内置 Mic

机器必须有麦克风，可以为内置或 USB；若只有 USB Mic，则原稿要求将其配置成内置 Mic。该节未提供进一步命令。

### 15.13 无电池设备补丁

EDLA 设备常不带电池，原稿要求应用 `/GMS-Test-Suite/Exp+/batteryless.diff`，并参考 Supporting Batteryless Devices。补丁后编译内核，GKI 固件还需替换模块：

```sh
mv kernel-5.10/drivers/power/supply/test_power.ko mkcombinedroot/vendor_ramdisk/lib/modules/test_power.ko
```

```text
CtsStatsdAtomHostTestCases
android.cts.statsdatom.statsd.HostAtomTests#testFullBatteryCapacity
FAILURE: expected to be greater than: 0 but was: 0
```

原稿处理：保证 `/sys/class/power_supply/***battery/charge_full` 大于 0，即配置 `battery_present=0`。此表述与下方补丁将 CHARGE_FULL 设为 0 存在需核对之处，两者均保留。

```text
CtsStatsdAtomHostTestCases
android.cts.statsdatom.statsd.HostAtomTests#testRemainingBatteryCapacity
FAILURE: expected to be greater than: 0 but was: 0
```

保证 `/sys/class/power_supply/test_battery/charge_counter` 大于 0。

```text
VtsHalHealthV2_1TargetTest
PerInstance/HealthHidlTest#getHealthInfo_2_1/0_default
Expected: ((long)value.batteryFullChargeDesignCapacityUah) > (((long)100 * 1000)), actual: 100 vs 100000
batteryFullChargeDesignCapacityUah should be greater than 100 mAh, or 0 if unknown

Android_SDK/kernel-5.10/drivers/power/supply$ git diff test_power.c
-static int battery_status = POWER_SUPPLY_STATUS_DISCHARGING;
+static int battery_status = POWER_SUPPLY_STATUS_UNKNOWN;
 static int battery_health = POWER_SUPPLY_HEALTH_GOOD;
-static int battery_present = 1; /* true */
+static int battery_present = 0; /* true */
 case POWER_SUPPLY_PROP_CHARGE_FULL_DESIGN:
 case POWER_SUPPLY_PROP_CHARGE_FULL:
- val->intval = 100;
+ val->intval = 0;
```

原稿随后列出的相关 AIDL 健康测试错误如下，未单独给出额外补丁。对象十六进制输出在原稿中已不完整，保留可见内容。

```text
VtsHalHealthTargetTest
Health/HealthAidl#getChargeCounterUah/0_android_hardware_health_IHealth_default
FAILURE:
hardware/interfaces/health/aidl/vts/functional/VtsHalHealthTargetTest.cpp:170: Failure
Value of: value
Expected: is >= 0
Actual: -1000

Health/HealthAidl#getHealthInfo/0_android_hardware_health_IHealth_default
FAILURE:
hardware/interfaces/health/aidl/vts/functional/VtsHalHealthTargetTest.cpp:413: Failure
Value of: value
Expected: is valid health info
Actual: 200-byte object <01-01 00-00 A0-25 26-00 40-4B 4C-00 03-00 00-00 02-00 00-00 01-00 00-00

Health/BatteryTest#ConnectedAgainstStatusFromHal/0_android_hardware_health_IHealth_default
FAILURE:
hardware/interfaces/health/aidl/vts/functional/VtsHalHealthTargetTest.cpp:592: Failure
Value of: SucceedOnce(gBatteryTestTimeout, testOnce)
Actual: false (BatteryStatus is DISCHARGING and power source is connected: ac=1, usb=1, wireless=0)
Expected: true
You may want to try again later when battery_status becomes stable.

Health/BatteryTest#ConnectedAgainstStatusInHealthInfo/0_android_hardware_health_IHealth_default
FAILURE:
hardware/interfaces/health/aidl/vts/functional/VtsHalHealthTargetTest.cpp:604: Failure
Value of: SucceedOnce(gBatteryTestTimeout, testOnce)
Actual: false (BatteryStatus is DISCHARGING and power source is connected: ac=1, usb=1, wireless=0)
Expected: true
You may want to try again later when getHealthInfo becomes stable.
```

### 15.14 更新固件签名与 Apex 签名脚本

Rockchip 在 `/GMS-Test-Suite/xTS/tools/gms_certificate_tools.zip` 提供脚本。按实际 Android 版本设置 PLATFORM_VERSION；原稿说明出现 `Enter password for` 提示时直接按 Enter。以下仅保留原稿操作，不执行密钥生成或更换。

```text
Android_SDK/vendor$ unzip gms_certificate_tools.zip
Android_SDK/vendor$ cd gms_tools/
Android_SDK/vendor/gms_tools$ export PLATFORM_VERSION=14 ## 根据实际Android版本配置
Android_SDK/vendor/gms_tools$ ./apex_sig_gen.sh ## 提示输入密码"Enter password for"时直接Enter键
Android_SDK/vendor/gms_tools$ ./firmware_sig_gen.sh ## 提示输入密码"Enter password for"时直接Enter键

GtsApexSignatureVerificationTest
android.appsecurity.cts.ApexSignatureVerificationTest#testApexPubKeyIsNotWellKnownKey
GtsPackageSignatureTest
android.security.cts.PackageSignatureTest#testPackageSignatures
GtsPermissionTestCases
com.google.android.permission.gts.DefaultPermissionGrantPolicyTest#testDefaultGrantsWithRemoteExceptions
```

本章原稿引用链接（Partner 文档可能需要相应账号权限）：

- §15.4: [Android 13 CDD](https://source.android.com/docs/compatibility/13/android-13-cdd#32_soft_api_compatibility)
- §15.5: [Android requirements / GRF](https://docs.partner.android.com/gms/policies/domains/reqs?authuser=3#updates_in_android_requirements_release)
- §15.6: [DPI calculator](https://ppi.ihei5.com/)
- §15.6: [Android 12 CDD dpi/aapt](https://source.android.com/docs/compatibility/12/android-12-cdd#37_runtime_compatibility)
- §15.9: [GMS fingerprint](https://docs.partner.android.com/gms/building/integrating/gms-build#creating)
- §15.10: [Android 14 partition requirements](https://docs.partner.android.com/gms/policies/vsr/vsr-14#device-partition-requirements)
- §15.13: [Supporting Batteryless Devices](https://source.android.com/docs/core/power/batteryless)

## 16 测试常见问题

### 16.1 protobuf 报错

报错log:

```text
java.lang.NoSuchMethodError: 'com.google.protobuf.Parser
com.android.os.StatsLog$ConfigMetricsReportList.parser()'
at
android.media.mediaparser.cts.MediaParserHostSideTest.getAndClearReportList(MediaParserHostSideTest.java:294)
at
android.media.mediaparser.cts.MediaParserHostSideTest.setUp(MediaParserHostSideTest.java:79)
at junit.framework.TestCase.runBare(TestCase.java:140)
```

解决方法:该问题和终端软件配置有关,且此配置可以通过SSH传到服务端。查看终端是否有配置如下环境:

```text
env | grep LC_ALL
```

如果有,请去掉此配置再进xTS测试包测试,例如:

```text
unset LC_ALL
./cts-tradefed
```

### 16.2 很多 VTS module 不运行

报错log:

```text
xxx.config syntax error: unexpected 'newline'
```

解决方法可写权限或Windows格式编码会修改文件的结束符。请直接使用Ubuntu测试,不要使用WSL(Windows Subsystem Linux)或任何的虚拟机测试,测试包直接在Ubuntu中使用unzip命令解压,不要做包括修改权限(chmod 777)在内的任何操作。

### 16.3 开机向导 Wi-Fi 偶尔无法 skip

性能差导致,可以打这个补丁:

```text
patch/frameworks/base/increase_waiting_time_for_setup_wizard.diff
```

### 16.4 通过认证后未显示已认证

查看机器认证状态:Play Store -> Settings -> About -> Play Protect certification不能显示已认证,一般有两种情况:1. 机器未烧key2. 机器未锁定为方便开发及调试,默认将机器的状态设为解锁,这里提供一个补丁,默认在烧写key时将机器锁定。待生产前,请务必加上补丁以保证烧attestation key时能够锁定机器。

```text
RKDocs/android/patches/gms/0001-libavb-Lock-the-device-when-the-device-init-or-write.patch
```

### 16.5 光感功能（自适应亮度）

Turbo.apk 与 TurboOverlay.apk 必须同时集成或同时不集成；都不集成时用下方差异删除 TURBO_PRELOAD。

```text
CtsDisplayTestCases
android.display.cts.BrightnessTest#testGetDefaultCurve
CtsDisplayTestCases
android.display.cts.BrightnessTest#testSetAndGetPerDisplay
java.lang.AssertionError: Failed to fetch first slider event. Is the
ambient brightness sensor working?
GtsFeaturesTestCases
com.google.android.features.gts.GoogleFeaturesTest#testFeatureTurboPreload
Device Health Services was missing but the
"com.google.android.feature.TURBO_PRELOAD" feature was found.
expected to be false
Device Health Services was found but the
"com.google.android.feature.TURBO_PRELOAD" feature was not, please reach out to
your Google contact
Android_SDK/vendor/partner_gms$ git diff etc/sysconfig/Android.bp
-prebuilt_etc {
- name: "sysconfig_turbo",
- product_specific: true,
- sub_dir: "sysconfig",
- src: "turbo.xml",
- filename_from_src: true,
-}
```

打开自适应亮度:Settings->Display->Adaptive brightness(Android13版本要求) --config_automatic_brightness_available

```text
dumpsys display | grep mAutoBrightnessAvailable
```

第一个查询结果应为 true；下面 MappingStrategy 查询应返回 PhysicalMappingStrategy。

```text
dumpsys display | grep MappingStrategy
PhysicalMappingStrategy
```

若查询为空，应确保安装 TurboOverlay.apk。使用 `pm list package -f | grep turbo` 查询 Turbo.apk、TurboOverlay.apk。

```text
package:/product/priv-app/Turbo/Turbo.apk=com.google.android.apps.turbo
package:/product/overlay/TurboOverlay.apk=com.rockchip.android.overlay.turbo
pm list features | grep com.google.android.feature.TURBO_PRELOAD
```

查询feature是否添加需要保证config_autoBrightnessLevels和config_autoBrightnessDisplayValuesNits数组⻓度相同(工具OverlayTools.apk)

两种方式查询数组。所列6个失败项先在较亮环境测试，再在较暗环境重试。

```text
am start -n cn.jcassistant.overlaytools/.MainActivity --es pkg android --es cfg config_autoBrightnessLevels
am start -n cn.jcassistant.overlaytools/.MainActivity --es pkg android --es cfg config_autoBrightnessDisplayValuesNits

cmd overlay lookup android android:array/config_autoBrightnessLevels
cmd overlay lookup android android:array/config_autoBrightnessDisplayValuesNits
## 下面6个fail项需要:先调节环境光较亮测试,再调节环境光较暗retry测试
arm64-v8a CtsDisplayTestCases
android.display.cts.BrightnessTest#testNoColorSampleData
android.display.cts.BrightnessTest#testSliderEventsReflectCurves
armeabi-v7a CtsDisplayTestCases
android.display.cts.BrightnessTest#testSetAndGetPerDisplay
android.display.cts.BrightnessTest#testBrightnessSliderTracking
android.display.cts.BrightnessTest#testNoColorSampleData
android.display.cts.BrightnessTest#testSliderEventsReflectCurves
```

若机器没有光感传感器,则需要删掉光感feature:android.hardware.sensor.light,即配置宏

```text
BOARD_LIGHT_SENSOR_SUPPORT := false
```

注意:应用Turbo.apk属于Google Device Health Services功能,是GMS Requirements的可选功能。

### 16.6 remount 失败

若机器锁定状态下remount则会报下面错误,需要先解锁机器再remount

```text
$ adb root
restarting adbd as root
$ adb remount
Skipping /system for remount
Skipping /vendor for remount
Skipping /product for remount
No partitions to remount
remount failed

$ adb remount
Device must be bootloader unlocked
```

### 16.7 编译失败处理

非4G设备配置

```text
BUILD_WITH_GOOGLE_MARKET_ALL := false
```

编译报错:没有使用RK的GMSExpress分支缺少gms-mandatory.mk

原稿方法1：即使 check_gms_env.sh 检查报错仍配置 BUILD_WITH_GOOGLE_MARKET_ALL := true。方法2：复制 gms.mk 为 gms-mandatory.mk 并删除 comms suite 引用。按实际授权分支核对。

```text
device/rockchip/common/modules/gms.mk:100: error:
..."vendor/partner_gms/products/gms-mandatory.mk" does not exist.
Android_SDK/vendor/partner_gms/products$ cp gms.mk gms-mandatory.mk
Android_SDK/vendor/partner_gms/products$ git diff gms-mandatory.mk
-# GMS comms suite
-$(call inherit-product, $(ANDROID_PARTNER_GMS_HOME)/products/google_comms_suite.mk)
```

编译报错BOARD_SUPER_PARTITION_WARN_LIMIT:修改super分区大小(必须是4Mb的整数倍)

```text
RuntimeError: sum of sizes of ['system', 'system_dlkm', 'system_ext',
'vendor', 'vendor_dlkm', 'odm', 'odm_dlkm', 'product'] is greater than
BOARD_SUPER_PARTITION_SIZE:
977747968+15765504+207147008+251867136+8318976+897024+348160+2484719616 ==
3946811392 > 3932160000 == 3932160000
[ 99% 40908/40909] Target super fs image for debug:
out/target/product/rk3588s_s/super.img
Android_SDK/device/rockchip/common$ git diff BoardConfig_AB.mk
ifeq ($(PRODUCT_USE_DYNAMIC_PARTITIONS), true)
ifneq ($(PRODUCT_RETROFIT_DYNAMIC_PARTITIONS), true)
ifeq ($(BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE), true)
ifeq ($(BUILD_WITH_GO_OPT), true)
ifeq ($(strip $(TARGET_ARCH)), arm64) # arm64 go
BOARD_SUPER_PARTITION_SIZE := 2390753280
else # arm go
BOARD_SUPER_PARTITION_SIZE := 1971322880
endif
else # non-go
- BOARD_SUPER_PARTITION_SIZE := 3932160000
+ BOARD_SUPER_PARTITION_SIZE := 3963617280
endif
BOARD_ROCKCHIP_DYNAMIC_PARTITIONS_SIZE := $(shell expr $(BOARD_SUPER_PARTITION_SIZE) - 4194304)
```

编译报错：build system 与 manifest 的 `<uses-library>` 不匹配。

```text
vendor/partner_gms/apps_go/FilesGoogle/FilesGoogle_arm64.apk )"
error: mismatch in the <uses-library> tags between the build system and the
manifest:
- required libraries in build system: []
vs. in the manifest: []
- optional libraries in build system: [org.apache.http.legacy]
vs. in the manifest: [org.apache.http.legacy,
androidx.window.extensions, androidx.window.sidecar]
- tags in the manifest
(vendor/partner_gms/apps_go/FilesGoogle/FilesGoogle_arm64.apk):
uses-library-not-required:'org.apache.http.legacy'
uses-library-not-required:'androidx.window.extensions'
uses-library-not-required:'androidx.window.sidecar'
Android_SDK/vendor/partner_gms$ git diff apps_go/FilesGoogle/Android.mk
-LOCAL_OPTIONAL_USES_LIBRARIES := org.apache.http.legacy
+LOCAL_OPTIONAL_USES_LIBRARIES := org.apache.http.legacy androidx.window.extensions androidx.window.sidecar
Android_SDK/vendor/partner_gms$ git diff apps_go/FilesGoogle/Android.mk
-LOCAL_OPTIONAL_USES_LIBRARIES := org.apache.http.legacy
+LOCAL_ENFORCE_USES_LIBRARIES := false
```

编译报错manifest_level_32.xml

first_api_level=31 对应 Android12.0；32 对应 Android12.1。复制 manifest_level_31.xml 为 manifest_level_32.xml。

```text
FAILED: ninja: 'device/rockchip/common/manifests/manifest_level_32.xml',
needed by
'out/target/product/rk3588_s/gen/ETC/vendor_manifest.xml_intermediates/manifest.xml', missing and no known rule to make it
Android_SDK/device/rockchip/common/manifests$ cp manifest_level_31.xml manifest_level_32.xml
```

集成Mainline包后编译报错:Target of symlink is not executable

```text
warning: Missing compilation artifacts. Dexpreopting is not working
for some system server jars
out/host/linux-x86/obj/EXECUTABLES/dexdump_intermediates/dexdump:
error: Target of symlink is not executable
out/host/linux-x86/obj/EXECUTABLES/hiddenapi_intermediates/hiddenapi:
error: Target of symlink is not executable
chmod a+x prebuilts/module_sdk/art/current/host-exports/x86_64/bin/*
chmod a+x prebuilts/module_sdk/art/go/current/host-exports/x86_64/bin/*
```

### 16.8 网络常见失败

网络环境问题:下面测试项需要VPN/IPv6网络环境(Ubuntu主机要直连VPN,不能用SSR方式连接VPN)

DashDownloadTest#download 不能使用本地媒体包；需 HTTP 网络下载。

```text
## VPN
CtsNetTestCases
android.net.cts.MultinetworkApiTest#testResNApi
libcore.java.net.InetAddressTest#test_getByName_invalid
android.net.cts.MultinetworkApiTest#testNativeDatagramTransmission
NativeDnsAsyncTest#Async_NXDOMAIN
GtsExoPlayerTestCases
com.google.android.exoplayer.gts.DashDownloadTest#download ## 该项不能使用本地媒体包
java.lang.ClassCastException: sun.net.www.protocol.file.FileURLConnection cannot
be cast to java.net.HttpURLConnection
## IPv6
CtsNetTestCases
android.net.cts.DnsTest#testDnsWorks
CtsLibcoreTestCases
libcore.java.net.InetAddressTest#test_getByName_invalid[1]
libcore.java.net.SocketTest#testSocketTestAllAddresses
```

### 16.9 CTS 常见失败

ConfigurationContainerProto报错:测试包版本不匹配

核对测试包版本，例如 Android12L（ro.build.version.sdk=32）使用12.1_r1，而非12_r1。

```text
java.lang.NullPointerException: Attempt to read from field
'com.android.server.wm.nano.ConfigurationContainerProto
com.android.server.wm.nano.WindowContainerProto.configurationContainer' on a
null object reference
```

测试项testGetMemoryClass报错:虚拟机内存dalvik.vm.heapgrowthlimit不满足当前机器dpi=640值所需虚拟机内存

按错误将 dalvik.vm.heapgrowthlimit 设为512m，并串口查询 `getprop | grep dalvik.vm.heap`。

```text
CtsAppTestCases
android.app.cts.ActivityManagerMemoryClassTest#testGetMemoryClass
AssertionFailedError: Expected to have at least 512mb of memory for
screen density 640
Android_SDK/frameworks/native/build$ git diff tablet-10in-xhdpi-2048-dalvik-heap.mk
PRODUCT_VENDOR_PROPERTIES += \
dalvik.vm.heapstartsize?=16m \
- dalvik.vm.heapgrowthlimit?=192m \
+ dalvik.vm.heapgrowthlimit?=512m \
```

测试项testSensorFeatures报错:Accelerometer sensor软件/硬件/feature不匹配导致

有加速度传感器则添加 android.hardware.sensor.accelerometer；没有则 BOARD_GRAVITY_SENSOR_SUPPORT := false。下方保留相关编译逻辑、未闭合源码节选和全部七项传感器宏。

```text
CtsAppTestCases
android.app.cts.SystemFeaturesTest#testSensorFeatures
java.lang.AssertionError:
PackageManager#hasSystemFeature(android.hardware.sensor.accelerometer) returns
false but SensorManager#getSensorList(1) shows sensors [Accelerometer sensor]
expected:<false> but was:<true>
hardware/rockchip/sensor/st/Android.mk
ifeq ($(BOARD_GRAVITY_SENSOR_SUPPORT), true)
LOCAL_CFLAGS += -DGRAVITY_SENSOR_SUPPORT
endif
hardware/rockchip/sensor/st/sensors.c
static const struct sensor_t sSensorList[] = {
#ifdef GRAVITY_SENSOR_SUPPORT
{ .name = "Accelerometer sensor",
.vendor = "The Android Open Source Project",
.version = 1,
.handle = SENSORS_HANDLE_BASE+ID_A,
.type = SENSOR_TYPE_ACCELEROMETER,
BOARD_GRAVITY_SENSOR_SUPPORT := false
BOARD_COMPASS_SENSOR_SUPPORT := false
BOARD_GYROSCOPE_SENSOR_SUPPORT := false
BOARD_PROXIMITY_SENSOR_SUPPORT := false
BOARD_LIGHT_SENSOR_SUPPORT := false
BOARD_PRESSURE_SENSOR_SUPPORT := false
BOARD_TEMPERATURE_SENSOR_SUPPORT := false
```

测试项testGenerateKeyWhenCredentialAndBiometricEnrolled报错:测试前需要保证机器PIN锁屏功能正常,即正常锁屏和解锁

不能禁用系统锁屏，保留 <bool name="def_lockscreen_disabled">false</bool> 默认值。

```text
CtsBiometricsTestCases
android.server.biometrics.BiometricCryptoTests#testGenerateKeyWhenCredentialAndBiometricEnrolled
java.lang.IllegalStateException: Secure lock screen must be enabled to
create keys requiring user authentication
```

测试项testManagedProfileSupported报错:2G的Go版本需要配置feature,但1.5G及以下Go版本不需要配置

```text
CtsContentTestCases
android.content.pm.cts.FeatureTest#testManagedProfileSupported
Device should support managed profiles, but
android.software.managed_users is not enabled
Android_SDK/device/rockchip/common$ git diff device.mk
ifneq ($(strip $(BUILD_WITH_GO_OPT)),true)
PRODUCT_COPY_FILES += \
frameworks/native/data/etc/tablet_core_hardware.xml:$(TARGET_COPY_OUT_VENDOR)/etc/permissions/tablet_core_hardware.xml
+else
+ PRODUCT_COPY_FILES += \
+
frameworks/native/data/etc/android.software.managed_users.xml:$(TARGET_COPY_OUT_VENDOR)/etc/permissions/android.software.managed_users.xml
```

测试项CtsDeqpTestCases报错:Abort: Test cannot be executed

按主机配置章节设置 aapt/aapt2；先查询 Mali 库版本 `getprop | grep sys.gmali.version`。

```text
CtsDeqpTestCases
dEQP-EGL.info#version
Abort: Test cannot be executed
dEQP : Writing test log into /sdcard/TestLog.qpa
dEQP : ERROR: Unable to open test log output file
'/sdcard/TestLog.qpa'.
dEQP : Failed to create activity: Failed to open test log file
'/sdcard/TestLog.qpa'
getprop | grep sys.gmali.version
```

测试项setDefaultSmsApplication_notSmsCapable_unchanged报错:overlay配置项config_defaultSms

```text
CtsDevicePolicyTestCases
android.devicepolicy.cts.DefaultSmsApplicationTest#setDefaultSmsApplication_notSmsCapable_unchanged[IncludeRunOnDeviceOwnerUser]
expected: com.android.messaging
but was : com.android.bedstead.testapp.SmsApp
Android_SDK/device/rockchip/common$ git diff overlay/frameworks/base/core/res/res/values/config.xml
<resources>
+ <!-- The name of the package that will hold the SMS role by default. -->
+ <!-- Set it empty here -->
+ <string name="config_defaultSms" translatable="false"></string>
```

测试项testOpenGlEsDeqpLevel报错:根据报错信息更新android.software.opengles.deqp.level

```text
CtsGraphicsTestCases
android.graphics.cts.OpenGlEsDeqpLevelTest#testOpenGlEsDeqpLevel
Feature android.software.opengles.deqp.level must be present and have at
least version 132383489.
pm list features | grep android.software.opengles.deqp.level
Android_SDK/frameworks/native/data/etc$ cat android.software.opengles.deqp.level-2022-03-01.xml
<permissions>
<feature name="android.software.opengles.deqp.level" version="132514561" />
</permissions>
Android_SDK/device/rockchip/common$ git diff modules/gms.mk
ifneq ($(filter true yes, $(BUILD_WITH_GOOGLE_MARKET) $(PRODUCT_USE_PREBUILT_GTVS)),)
PRODUCT_COPY_FILES += \
- frameworks/native/data/etc/android.software.opengles.deqp.level-2021-03-01.xml:$(TARGET_COPY_OUT_VENDOR)/etc/permissions/android.software.opengles.deqp.level-2020-03-01.xml
+ frameworks/native/data/etc/android.software.opengles.deqp.level-2022-03-01.xml:$(TARGET_COPY_OUT_VENDOR)/etc/permissions/android.software.opengles.deqp.level-2022-03-01.xml
```

测试项testAllKeys报错:Android13平台开启GKI

开启 GKI，并在 gki_defconfig 启用下方三项。

```text
CtsHardwareTestCases
android.hardware.input.cts.tests.SonyDualSenseBluetoothTest#testAllKeys
android.hardware.input.cts.tests.SonyDualSenseBluetoothTest#testVibrator
android.hardware.input.cts.tests.SonyDualSenseBluetoothTest#testAllMotions
android.hardware.input.cts.tests.SonyDualSenseUsbTest#testAllKeys
android.hardware.input.cts.tests.SonyDualSenseUsbTest#testVibrator
android.hardware.input.cts.tests.SonyDualSenseUsbTest#testAllMotions
java.lang.RuntimeException: Did not receive device added notification in
time
kernel-5.10/arch/arm64/configs/gki_defconfig
CONFIG_HID_SONY=y
CONFIG_LEDS_CLASS=y
CONFIG_NEW_LEDS=y
```

测试项CtsMediaDecoderTestCases报错:根据报错信息修改frame rate帧率为实际测试帧率Measured frame rate

由 c2.rk.avc.decoder 和320x240定位条目，原例125–140范围包含134.16与129.51。修改文件生成到 /vendor/etc/media_codecs_performance.xml。不要把原例测量值当作 ArmSoM 实测。

```text
CtsMediaDecoderTestCases
android.media.decoder.cts.VideoDecoderPerfTest#testPerf[0(c2.rk.avc.decoder:qvga)]
java.lang.AssertionError: Expected achievable frame rates for
c2.rk.avc.decoder video/avc 320x240: [600.0, 650.0].
Measured frame rate: [134.16529367461462, 129.51021865979183].
Android_SDK/vendor/rockchip/common/vpu/etc$ git diff media_codecs_performance_rk3588.xml
<MediaCodec name="c2.rk.avc.decoder" type="video/avc" update="true">
- <Limit name="measured-frame-rate-320x240" range="600-650" />
+ <Limit name="measured-frame-rate-320x240" range="125-140" />
```

测试项SingleLayer_DepthTest_DepthAffectsDrawAcrossContexts_D32_FLOAT报错:/GMS-Test-Suite/Exp+/AHardwareBufferNativeTests

```text
CtsNativeHardwareTestCases
android.hardware.nativehardware.cts.AHardwareBufferNativeTests#SingleLayer_DepthTest_DepthAffectsDrawAcrossContexts_D32_FLOAT
android.hardware.nativehardware.cts.AHardwareBufferNativeTests#SingleLayer_DepthTest_DepthCanBeSampled_D32_FLOAT
android.hardware.nativehardware.cts.AHardwareBufferNativeTests#MultipleLayers_DepthTest_DepthCanBeSampled_D32_FLOAT
```

测试项testSocketKeepaliveUnprivileged报错:补丁/GMS-Test-Suite/Exp+/DisableKeepAliveMainlineBuild

```text
CtsNetTestCases
android.net.cts.ConnectivityManagerTest#testSocketKeepaliveUnprivileged
android.net.cts.ConnectivityManagerTest#testCreateTcpKeepalive
android.net.cts.ConnectivityManagerTest#testSocketKeepaliveLimitWifi
CtsHostsideNetworkTests
com.android.cts.net.HostsideVpnTests#testAutomaticOnOffKeepaliveModeNoClose
device/rockchip/common/device.mk:
PRODUCT_PACKAGES += \
RockchipTetheringNoKeepAliveOverlay \
RockchipTetheringNoKeepAliveMainlineOverlay
```

测试项testPruneUnusedStaticSharedLibraries_reboot_fullMode报错:需要保证硬件RTC功能正常

```text
CtsOsHostTestCases
android.os.cts.StaticSharedLibsHostTests#testPruneUnusedStaticSharedLibraries_reboot_fullMode
android.os.cts.StaticSharedLibsHostTests#testPruneUnusedStaticSharedLibraries_reboot_instantMode
java.lang.AssertionError: Library foo.bar.lib.recursive should be
uninstalled
```

测试项testProfiles和testRequestNotifications报错:把BLE蓝牙设备(如手表)设置成可发现状态放旁边测试

```text
CtsOsTestCases
android.os.cts.CompanionDeviceManagerTest#testProfiles
android.os.cts.CompanionDeviceManagerTest#testRequestNotifications
FAILURE: java.lang.AssertionError: Test requires a discoverable
bluetooth device nearby
```

测试项SELinuxNeverallowRulesTest报错:GMS/EDLA认证不能修改/system/sepolicy目录下任何权限,且不能用userdebug固件测试

```text
CtsSecurityHostTestCases
android.security.cts.SELinuxNeverallowRulesTest#testNeverallowRules199
junit.framework.AssertionFailedError: The following errors were
encountered when validating the SELinuxneverallow rule:
libsepol.report_failure: neverallow violated by allow
hal_keymint_default serialno_prop:file { read getattr map open };
libsepol.check_assertions: 1 neverallow failures occurred
```

测试项testNoRemovedCertificates报错:缺失CA证书,Google安全补丁引入

原稿建议回退指定 TrustCor 证书补丁。该历史建议影响信任根，不应脱离当前安全要求直接执行；这里只保留原文可追溯信息。

```text
CtsSecurityTestCases
android.security.cts.CertificateTest#testNoRemovedCertificates
junit.framework.AssertionFailedError: Missing CA certificates expected:
<[]> but was:<[B8:BE:6D:CB:56:F1...]>
bulletin_2023_08_preview/.../0001-Drop-TrustCor-certificates.bulletin.patch
```

测试项testSystemMemoryAtom报错

kernel-4.19 情况下关闭所列 dmabuf 选项；不适用于 Android13 及以上。

```text
CtsStatsdAtomHostTestCases
android.cts.statsdatom.memory.SystemMemoryStatsTests#testSystemMemoryAtom
FAILURE: expected to be at least: 0 but was: -1
Android_SDK/kernel-4.19$ git diff arch/arm64/configs/rockchip_defconfig
-CONFIG_DMABUF_HEAPS=y
-CONFIG_DMABUF_HEAPS_SYSTEM=y
-CONFIG_DMABUF_HEAPS_CMA=y
```

测试项testRestart和testMultipleActivations报错:主板必须有硬件RTC(不能是虚拟RTC)且存在节点/sys/class/rtc/rtc0/

按实际节点添加 SELinux 权限（或 Android_Devices_SELinux_Tool 扫描），确保 date -u 与 hwclock -r 时间一致。

```text
CtsStatsdHostTestCases
android.cts.statsd.metric.MetricActivationTests#testRestart
android.cts.statsd.metric.MetricActivationTests#testMultipleActivations
console:/ $ ls -laZ /sys/class/rtc/
total 0
drwxr-xr-x 2 root root u:object_r:sysfs_rtc:s0 0 2023-08-12 18:19 .
drwxr-xr-x 82 root root u:object_r:sysfs:s0 0 2023-08-12 18:19 ..
lrwxrwxrwx 1 root root u:object_r:sysfs:s0 0 2023-08-12 18:53 rtc0 ->
../../devices/platform/feaa0000.i2c/i2c-2/2-0051/rtc/rtc0
Android_SDK/device/rockchip/rk3588$ git diff sepolicy_vendor/genfs_contexts
genfscon sysfs /devices/platform/fe2e0000.mmc/mmc_host/mmc0 u:object_r:sysfs_mmc:s0
+genfscon sysfs /devices/platform/feaa0000.i2c/i2c-2/2-0051/rtc/rtc0 u:object_r:sysfs_rtc:s0
```

测试项testRefreshRate报错:屏幕帧率不够导致fail

```text
CtsViewTestCases
android.view.cts.DisplayRefreshRateTest#testRefreshRate
D DisplayRefreshRateTest: claimed 75.0 fps, achieved 65.0 fps
D DisplayRefreshRateTest: claimed 75.0 fps, achieved 60.63158 fps
D DisplayRefreshRateTest: claimed 75.0 fps, achieved 61.125 fps
E TestRunner: failed:
testRefreshRate(android.view.cts.DisplayRefreshRateTest)
```

测试项AnrTests报错:不能去掉系统ANR弹框和修改ANR时间

```text
CtsWindowManagerDeviceTestCases
android.server.wm.AnrTests#slowUiThreadWithKeyEventTriggersAnr
android.server.wm.AnrTests#slowOnCreateWithKeyEventTriggersAnr
android.server.wm.AnrTests#slowOnTouchEventHandleTriggersAnr
android.server.wm.AnrTests#slowOnKeyEventHandleTriggersAnr
android.server.wm.AnrTests#embeddedWindowTriggersAnr
FAILURE: java.lang.AssertionError: Could not find anr dialog
```

测试项testSystemUiVisibilityCallbackCausedByInsets报错:/GMS-Test-Suite/Exp+/12.1_CtsWindowManagerDeviceTestCases

```text
CtsWindowManagerDeviceTestCases
android.server.wm.WindowInsetsControllerTests#testSystemUiVisibilityCallbackCausedByInsets
```

测试项CtsWindowManagerDeviceTestCases若报错:需要修改window动画参数为1.0

```text
CtsWindowManagerDeviceTestCases
android.server.wm.ActivityTransitionTests#testTaskTransitionOverride
android.server.wm.ActivityTransitionTests#testActivityTransitionDurationNoShortenAsExpected
android.server.wm.ActivityTransitionTests#testTaskTransitionOverrideDisabled
java.lang.AssertionError: Actual transition duration should be in the
range &lt;1900, 2900&gt; ms, actual=1012
Android_SDK/device/rockchip/rk3588$ git diff ./
--- a/overlay/frameworks/base/packages/SettingsProvider/res/values/defaults.xml
+++ b/overlay/frameworks/base/packages/SettingsProvider/res/values/defaults.xml
@@ -36,6 +36,6 @@
<integer name="def_wifi_sleep_policy">2</integer>
<!-- Decrease animation duration. -->
- <fraction name="def_window_animation_scale">50%</fraction>
- <fraction name="def_window_transition_scale">50%</fraction>
+ <fraction name="def_window_animation_scale">100%</fraction>
+ <fraction name="def_window_transition_scale">100%</fraction>
```

测试项testMaxAspectRatioPreOActivity报错:屏幕宽高比不满足要求,切换横竖屏测试或调小导航栏高度navigation_bar_height

原例计算1.9047619 = 1920/(1080-72)、1.87 = 1920/(1080-53)，保留近似值和原参数。

```text
CtsWindowManagerSdk25TestCases
android.server.wm.AspectRatioSdk25Tests#testMaxAspectRatioPreOActivity
Expected: a value less than or equal to <1.87F>
but: <1.9047619F> was greater than <1.87F>
1.9047619 = 1920/(1080-72) 1.87 = 1920/(1080-53)
console:/ $ wm size
Physical size: 1920x1080
console:/ $ dumpsys SurfaceFlinger | grep NavigationBar
0xb400007eee0bd600: unknown | 1080 ( 0) x 72 | 1 | 1 |
0x40000000000b00 | NavigationBar0#0
Android_SDK/frameworks/base$ git diff core/res/res/values/dimens.xml
<!-- Height of the bottom navigation / system bar. -->
- <dimen name="navigation_bar_height">72dp</dimen>
+ <dimen name="navigation_bar_height">53dp</dimen>
```

测试项BYOD Managed Provisioning - Camera support cross profile video capture (with extra outputpath)报错:空指针挂死

```text
Android_SDK/packages/apps/Camera2$ git diff src/com/android/camera/VideoModule.java
if (mIsVideoCaptureIntent) {
// if no file save is needed, we can show the post capture UI now
showCaptureResult();
- }
- if (mVideoFileDescriptor != null) {
+ }else if (mVideoFileDescriptor != null) {
saveVideo();
}
```

测试项BYOD Managed Provisioning - Camera support cross profile video capture (without extraoutput path)报错

无 Camera 的设备不应出现下方三个跨配置文件 Camera 测试项，原稿通过移除 Camera2 处理。

```text
Android_SDK/packages/apps/Camera2$ git diff src/com/android/camera/VideoModule.java
if (shouldAddToMediaStoreNow && !fail) {
- if (mIsVideoCaptureIntent) {
+ if (mIsVideoCaptureIntent && mActivity.getIntent().getExtras() != null)
{
// if no file save is needed, we can show the post capture UI now
Camera support cross profile image capture
Camera support cross profile video capture (with extra output path)
Camera support cross profile video capture (without extra output path)
Android_SDK/build/make$ git diff target/product/handheld_product.mk
- Camera2 \
```

测试项Companion Device Service Test报错:BLE蓝牙设备(如手表)设置成可发现状态放旁边

辅助机安装指定 nRF Connect APK；打开 ADVERTISER，点右下角+，随意填写 Display name，ADD RECORD→Complete Local Name，勾选 Connectable，点 OK。打开右侧开关，Advertisement duration 弹框点 OK；测试机运行 Companion Device Service Test。等待消失可能需2分钟，必须出现 Device appeared / Device disappeared 弹框。

```text
com.android.cts.verifier.companion.CompanionDeviceServiceTestActivity
/GMS-Test-Suite/xTS/tools/nrfconnect_v4.24.3_itmop.com.apk
```

测试项Device Suspend Tests报错:机器要进入深度休眠2秒且能够唤醒(测试时不接adb线)

```text
com.android.cts.verifier.sensors.DeviceSuspendTestActivity#testTimestampClockSource
SensorTest: [TestExecution] Delta between clock sources too small (0mS),
device must sleep more than 2 seconds
```

Notification Listener Testb：在开机向导设置 PIN，或设置 PIN 后执行 System → Reset options → Reset app preferences。

烧完固件后在开机向导设置 PIN，否则 Notification Listener Test 可能找不到条目而失败。

测试项USB Accessory Test报错:建议使用Google手机作为辅助机

USB Accessory：辅助机点 Start accessory test companion，测试机点 USB Accessory Test；辅助机为HOST接OTG，测试机为DEVICE接USB；辅助机弹框OK。USB Device：辅助机点 Start device test companion，测试机点 USB Device Test；辅助机为DEVICE接USB，测试机为HOST接OTG；测试机弹框OK。

### 16.10 GTS 常见失败

测试项GtsAssistantHostTestCases报错:根据产品Camera情况把多余的camera feature去掉(测试前先打开Camera授权拍照后退出再测试)

camera为后摄、camera.any为必须、camera.external为USB相机、camera.front为前摄。

```text
GtsAssistantHostTestCases
com.google.android.assistant.gts.AssistantTest#testAssistantTakePhotoWithVoiceInteraction
com.google.android.assistant.gts.AssistantTest#testAssistantOpenRearCameraWithoutVoiceInteraction
com.google.android.assistant.gts.AssistantTest#testAssistantTakePhotoWithoutVoiceInteraction
com.google.android.assistant.gts.AssistantTest#testAssistantOpenRearCameraWithVoiceInteraction
console:/ $ pm list features | grep camera
feature:android.hardware.camera ## 后摄Camera
feature:android.hardware.camera.any ## 必须
feature:android.hardware.camera.external ## Usb Camera
feature:android.hardware.camera.front ## 前摄Camera
```

测试项soundDoseReached_showsWarning报错:缺少android.permission.MODIFY_AUDIO_SETTINGS_PRIVILEGED权限

参考原链接 https://android-review.googlesource.com/c/platform/frameworks/base/+/1261388，在 shell 权限和 Manifest 两处加入缺失权限。

```text
GtsAudioTestCases
com.google.android.audio.gts.SoundDoseTest#soundDoseReached_showsWarning
com.google.android.audio.gts.SoundDoseTest#momentaryExposure_showsWarning
com.android.bedstead.nene.exceptions.NeneException: Can not get required
permission
Running On User: User{id=0, name=Owner}
Permission: android.permission.MODIFY_AUDIO_SETTINGS_PRIVILEGED
Permission protection level: Permission not found
Permission state: -1
Instrumented Package: com.google.android.audio.gts
Requested Permissions:
[android.permission.QUERY_ALL_PACKAGES,
com.google.android.audio.gts.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION,
android.permission.REORDER_TASKS, android.permission.READ_EXTERNAL_STORAGE]
Can adopt shell permissions: true
Shell permissions:[android.permission.REQUEST_DELETE_PACKAGES,
android.permission.MANAGE_ROLLBACKS, ......
Android_SDK/frameworks/base$ git diff data/etc/privapp-permissions-platform.xml
<privapp-permissions package="com.android.shell">
+ <permission
name="android.permission.MODIFY_AUDIO_SETTINGS_PRIVILEGED"/>
<!-- Needed for test only -->
<permission name="android.permission.MODIFY_DAY_NIGHT_MODE"/>
Android_SDK/frameworks/base$ git diff packages/Shell/AndroidManifest.xml
<!-- Permission required for testing system audio effect APIs. -->
<uses-permission
android:name="android.permission.MODIFY_DEFAULT_AUDIO_EFFECTS"/>
+ <uses-permission
android:name="android.permission.MODIFY_AUDIO_SETTINGS_PRIVILEGED"/>
```

测试项testTelephonyAudioAvailable报错:若机器不带通话功能(非4G),需要把通话组件去掉

日志中 AM 指 Messages.apk；原稿删除 Google comms suite 引用。

```text
GtsGmscoreHostTestCases
com.google.android.gts.audio.AudioHostTest#testTelephonyAudioAvailable
GtsNmgiarcTestCases
com.google.android.comms.MessagesTests#testMessagesVersionCheck
java.lang.RuntimeException: AM should be a privileged system app
Android_SDK/vendor/partner_gms$ git diff products/gms.mk
-# GMS comms suite
-$(call inherit-product, $(ANDROID_PARTNER_GMS_HOME)/products/google_comms_suite.mk)
```

测试项testDisablingDeviceProvisioningPackage报错:Android12以上版本不能集成应用OobConfig.apk

```text
GtsGmscoreHostTestCases
com.google.android.gts.provisioning.ProvisioningHostTest#testDisablingDeviceProvisioningPackage
android.content.pm.PackageManager$NameNotFoundException:
com.google.android.apps.work.oobconfig
```

测试项testSerialNumberAttestation报错:机器必须烧Attestation key且锁定(fastboot oem at-lock-vboot)

```text
GtsGmscoreHostTestCases
com.google.android.gts.security.DeviceIdAttestationHostTest#testSerialNumberAttestation
junit.framework.AssertionFailedError: The verified boot key must be non-
trivial, at least 32 bytes long.
```

测试项testMbaPrivilegedPermission报错:应用AndroidManifest.xml不能申明android:debuggable="true"

```text
GtsMbaPrivilegedPermissionTestCases
com.google.android.mbaprivilegedpermission.gts.GtsDebugCertificateTest#testMbaPrivilegedPermission
java.lang.RuntimeException: Violation of the Debug certificate policy
[com.rockchip.mirror] is debuggable.
```

测试项testPolicy报错:根据报错信息修改应用包名

改名示例从 com.google.android.apps.customization.pixe 到 com.rockchip.android.apps.customization.pixel；原日志是pixel，说明却少一个l，保留差异核对。

```text
GtsMbaPrivilegedPermissionTestCases
com.google.android.mbaprivilegedpermission.gts.GtsPackageNamespaceTest#testPolicy
java.lang.RuntimeException: Violation of the Package Namespace
[Package Name: com.google.android.apps.customization.pixel,
Certificates:
[3cc6c5f27c0b54f96507c2a5b31c404b3dbf065a2edb093eacd41147f2480f30]] contains
Google, but not owned by Google.
```

测试项testNetworkStack报错:

方法1集成 CaptivePortalLoginFrameworkOverlayGo.apk 设置 config_defaultCaptivePortalLoginPackageName；方法2默认授予应用 POST_NOTIFICATIONS，保留原证书摘要和 fixed=false。

```text
GtsNetworkStackHostTestCases
com.google.android.gts.networkstack.NetworkStackHostTest#testNetworkStack

com.google.android.networkstack.gts.NetworkStackTest#testCaptivePortalAppInstalledAndHasPostNotificationsPermission:
java.lang.AssertionError: com.google.android.go.captiveportallogin does not have
android.permission.POST_NOTIFICATIONS permission. Check that its package name
was configured in config_defaultCaptivePortalLoginPackageName (typically via
overlay). expected:<0> but was:<-1>
Android_SDK/vendor/rockchip/common/gms/CaptivePortalLoginFrameworkOverlayGo$ cat res/values/config.xml
<string name="config_defaultCaptivePortalLoginPackageName"
translatable="false">com.google.android.go.captiveportallogin</string>
Android_SDK/vendor/partner_gms$ git diff etc/default-permissions/default-permissions-google.xml
+
+ <exception
+ package="com.google.android.go.captiveportallogin"
+ sha256-cert-digest="5F:A4:22:12:AD:40:3E:22:DD:6E:FE:75:F3:F3:11:84:05:1F:EF:74:4C:0B:05:BE:5C:73:ED:F6:0B:F6:2C:1E">
+ <!-- Notifications -->
+ <permission name="android.permission.POST_NOTIFICATIONS" fixed="false"/>
+ </exception>
</exceptions>
```

测试项testDefaultGrantsWithRemoteExceptions报错:根据报错信息删除应用对应权限

```text
GtsPermissionTestCases
com.google.android.permission.gts.DefaultPermissionGrantPolicyTest#testDefaultGrantsWithRemoteExceptions
java.lang.AssertionError: packageName: com.google.android.contacts {
priv app: false
targetSDK: 33
uid: 10101
persistent: false
signature: 917F8719D4C2C892DBF26BBE2BDB179FFF0E0DDBEB8FF9F31A4DD98BB4A4D25D
on system image: true
has platform signature: false
message: cannot be granted by default to package {
permission: android.permission.POST_NOTIFICATIONS
}
}
```

testPreloadedAppsTargetSdkVersion：按错误修改应用的 android:targetSdkVersion。

若 targetSdkVersion 修改生效仍失败，原稿建议将 compileSdkVersion 更新到最新 ro.product.first_api_level；关系 minSdkVersion ≤ targetSdkVersion ≤ compileSdkVersion。此建议需按实际SDK核对，保留原述。

```text
GtsPermissionTestCases
com.google.android.permission.gts.PreloadAppsTargetSdkVersionTest#testPreloadedAppsTargetSdkVersion
All apps preloaded on DEVICEs launching with Android 11 MUST target API
level 29 or higher.
All apps preloaded on DEVICEs launching with Android 12 or 12L MUST
target API level 30 or higher.
All apps preloaded on DEVICEs launching with Android 13 MUST target API
level 31 or higher.
com.android.launcher3 must target 30 or higher, but targets 29
minSdkVersion(lowest possible) <= targetSdkVersion <=
compileSdkVersion(latest SDK)
Android_SDK/vendor/partner_gms$ git diff apps/SearchLauncher/AndroidManifest.xml
- <uses-sdk android:targetSdkVersion="29" android:minSdkVersion="28"/>
+ <uses-sdk android:targetSdkVersion="30" android:minSdkVersion="28"/>
```

测试项testSystemAppsInstalled报错:非4G设备不集成应用AndroidAutoStub.apk

```text
GtsPlacementTestCases
com.google.android.placement.gts.InstalledAppsTest#testSystemAppsInstalled
java.lang.RuntimeException: Test failed for cases: [0]
Reasons include:
Message [0]: com.google.android.projection.gearhead should not be
installed on devices without Telephony
Android_SDK/vendor/partner_gms$ git diff products/gms.mk
# GMS mandatory core packages
PRODUCT_PACKAGES := \
- AndroidAutoStub \
```

测试项testWidgetPresence报错:不能删掉桌面Google Search widget组件

修改变量路径 /packages/apps/Launcher3/src_build_config/com/android/launcher3/BuildConfig.java，变量 QSB_ON_FIRST_SCREEN。

```text
GtsSearchHostTestCases
com.google.android.search.gts.GoogleSearchWidgetTest#testWidgetPresence
FAILURE: java.lang.AssertionError: Launcher from package
com.android.launcher3 does not contain search widget provided by
com.google.android.googlequicksearchbox (Google App).
```

测试项testZeroTouch_zeroTouchWrapperLaunched报错:开机向导时需要连接VPN-Wifi,不要登陆Google帐号(务必确保机器烧Attestation key)

```text
GtsSetupWizardHostTestCases
com.google.android.gts.setupwizard.SetupWizardZeroTouchTest#testZeroTouch_zeroTouchWrapperLaunched
FAILURE: junit.framework.AssertionFailedError: SetupWizard didn't launch
ZeroTouchWrapper.
On Android R+ or when com.google.android.apps.work.oobconfig is installed,
SetupWizard MUST launch ZeroTouchWrapper with intent action
com.google.android.setupwizard.ZERO_TOUCH_SETUP during normal SetupWizard flow
when WIFI/mobile data is connected.
```

测试项testWidevineVersion报错:FTP服务器补丁/GMS-Test-Suite/Exp+/WvtsDeviceTestCases

```text
WvtsDeviceTestCases
com.google.android.wvts.WidevineBusinessLogicTests#testWidevineVersion
FAILURE: java.lang.AssertionError: Unknown build number with cdm version
16.1.0
```

### 16.11 STS 常见失败

测试项testPocBug_258188673报错:FTP服务器补丁/GMS-Test-Suite/Exp+/testPocBug_258188673

```text
StsHostTestCases
android.security.sts.Bug_258188673#testPocBug_258188673
java.lang.AssertionError: PoC exited with bad exit code.. Actual: 113
```

### 16.12 VTS 常见失败

测试项ProcCmdlineAndroidbootTest报错:需要开启GKI(宏BOARD_BUILD_GKI),不再使用androidboot.***

```text
VtsBootconfigTest
VtsBootconfigTest#ProcCmdlineAndroidbootTest
Expected equality of these values:
cmdline.find("androidboot")
Which is: 18
cmdline.npos
Which is: 18446744073709551615
"androidboot" parameters are not allowed in the kernel cmdline for
devices using kernel version 5.10 or greater with Android S and beyond. These
parameters are to be placed in bootconfig.
```

测试项audioPolicyConfigurationValidation报错:根据报错信息修改audio_policy_configuration.xml

配置 BOARD_SUPPORT_MULTIAUDIO ?= false，关闭多声卡输出，不集成 audio_policy_configuration_multiaudio.xml。

```text
VtsHalAudioV7_1TargetTest
CheckConfig#audioPolicyConfigurationValidation
1 error occurred during xml validation:
XML is not valid according to the xsd
While validating: xmlFilePath
Which is: /vendor/etc/audio_policy_configuration.xml
Against the schema: xsd
Which is: /data/local/tmp/audio_policy_configuration_V7_0.xsd
Libxml2 errors:
Error: Element 'devicePort', attribute 'type': 'AUDIO_DEVICE_OUT_HDMI_1'
is not a valid value of the union type 'extendableAudioDevice'.
BOARD_SUPPORT_MULTIAUDIO ?= false
```

测试项KernelReleaseFormat报错:需使用Google官方Release的boot.img镜像(GKI Releaseboot.img)

```text
vts_generic_boot_image_test
GenericBootImageTest#KernelReleaseFormat
GenericBootImageTest#GenericRamdisk
Value of: KernelRelease::Parse(release, true ).has_value()
Actual: false
Expected: true
Kernel release '5.10.168-maybe-dirty' does not have generic kernel image
(GKI) release format. It must match this regex:
^(?P<w>\d+)[.](?P<x>\d+)[.](?P<y>\d+)-(?P<z>android\d+)-(?P<k>\d+).*$
Example: 5.4.42-android12-0-something
```

测试项GkiComplianceV2和GkiComplianceV2_kernel报错:需使用Google官方Release的boot.img镜像(GKI Release boot.img)

```text
vts_gki_compliance_test
GkiComplianceTest#GkiComplianceV2
GkiComplianceTest#GkiComplianceV2_kernel
KernelVersionTest#AgainstPlatformRelease
The GKI image descriptor is not signed by an official key.
```

测试项VtsHalSensorsV1_0TargetTest报错信息:校准传感器(参考测前准备)

```text
VtsHalSensorsV1_0TargetTest
PerInstance/SensorsHidlTest#AccelerometerStreamingOperationSlow/0_default
PerInstance/SensorsHidlTest#AccelerometerStreamingOperationNormal/0_default
Value of: checker.check(sensorEvents, &s)
Actual: false
Expected: true
Event @ 49513760914252 (8.6287, -0.603339, 1.13006) has norm 8.72328,
which is beyond range [8.80665, 10.8067]
echo 1 > /sys/class/sensor_class/accel_calibration
```

测试项vts_kernel_net_tests报错:FTP服务器补丁/GMS-Test-Suite/Exp+/vts_kernel_net_tests

```text
vts_kernel_net_tests
vts_kernel_net_tests#vts_kernel_net_tests
testVtiRekey_IPv4_in_IPv4 (xfrm_tunnel_test.XfrmVtiTest) ... ERROR
testVtiRekey_IPv4_in_IPv6 (xfrm_tunnel_test.XfrmVtiTest) ... ERROR
testVtiRekey_IPv6_in_IPv4 (xfrm_tunnel_test.XfrmVtiTest) ... ERROR
testVtiRekey_IPv6_in_IPv6 (xfrm_tunnel_test.XfrmVtiTest) ... ERROR
```

测试项Enabled和vts_virtual_ab_test报错:需要启用虚拟A/B和压缩虚拟A/B,保证属性

```text
ro.virtual_ab.userspace.snapshots.enabled=true
vts_libsnapshot_test
SnapshotUpdateTest#FullUpdateFlow
SnapshotUpdateTest#MergeCannotRemoveCow
vts_ota_config_test
VAB#Enabled
vts_virtual_ab_test
VirtualAbRequirementTest#EnabledOnLaunchT
build/make/target/product/virtual_ab_ota/compression.mk:
PRODUCT_VENDOR_PROPERTIES += ro.virtual_ab.userspace.snapshots.enabled=true
build/make/target/product/virtual_ab_ota/compression_with_xor.mk:
$(call inherit-product, $(SRC_TARGET_DIR)/product/virtual_ab_ota/compression.mk)
BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
BOARD_ROCKCHIP_VIRTUAL_AB_COMPRESSION := true
BOARD_BOOT_HEADER_VERSION := 4 ##
BOARD_BUILD_GKI := true
```

测试项vts_treble_vintf_vendor_test报错:根据报错信息has an empty hash需要Frozen current

hidl-gen中 name:path 替换为 hidl_package_root 的定义，接口替换为失败项。结果加入同级 current.txt（可能 /vendor/rockchip/hardware/interfaces/current.txt），缺少项依错误继续补充。原稿另写 idl_package_root，需核对。

```text
vts_treble_vintf_vendor_test
DeviceManifest/SingleManifestTest#InterfacesAreReleased/0
rockchip.hardware.tv.input@1.0::ITvInput has an empty hash. This is
because it was compiled without being frozen in a corresponding current.txt
file.
hidl-gen -L hash -r rockchip.hardware:vendor/rockchip/hardware/interfaces -r android.hardware:hardware/interfaces -r android.hidl:system/libhidl/transport rockchip.hardware.tv.input@1.0::ITvInput
```

### 16.13 Checklist 常见失败

M13 - Default Home Screen DisplayM14 - Placement of Google Collections Folder测试项:需要集成应用GmsSampleIntegration.apk

```text
vendor/partner_gms/apps/GmsSampleIntegration/res_dhs_full/xml/partner_default_layout.xml <folder title=......</folder>
```

注意:Duo.apk和Meet.apk包名都是package="com.google.android.apps.tachyon"但图标不同,系统只能集成一个应用否则会出现两个应用图标

```text
Android_SDK/vendor/partner_gms$ git diff products/gms.mk
PRODUCT_PACKAGES += \
Chrome \
Drive \
Gmail2 \
- Duo \
+ Meet \
```

注意:Google文件夹需要包含"Google TV"图标(旧名称"Play Movies"),即应用Videos.apk

```text
package:/product/app/Videos/Videos.apk=com.google.android.videos
Android_SDK/vendor/partner_gms$ git diff apps/GmsSampleIntegration/res_dhs_full/xml/partner_default_layout.xml
- <favorite packageName="com.google.android.videos"
className="com.google.android.youtube.videos.EntryPoint"/>
+ <favorite packageName="com.google.android.videos"
className="com.google.android.videos.GoogleTvEntryPoint"/>
<favorite packageName="com.google.android.apps.tachyon"
className="com.google.android.apps.tachyon.MainActivity"/>
```

M30 - Restore Experience in the Setup Wizard测试项:/GMS-Test-Suite/Exp+/M30_A13_USB DataM33 - Location Privacy测试项:若机器没有GPS则跳过测试M53 - Safety and Emergency settings测试项:/GMS-Test-Suite/Exp+/M53_EmergencyM56 - Monochrome app icons测试项:/GMS-Test-Suite/Exp+/M56_A13_0828.zip

```text
Android_SDK/vendor/partner_gms$ git diff products/gms.mk
PRODUCT_PACKAGES += \
GmsSampleIntegration \
- SearchLauncherQuickStep
+ SearchLauncherQuickStep \
+ WallpaperGoogle
Android_SDK/vendor/partner_gms$ git diff etc/permissions/privapp-permissions-google-system-ext.xml
+ <privapp-permissions package="com.google.android.apps.wallpaper">
+ <permission name="android.permission.READ_WALLPAPER_INTERNAL"/>
+ <permission name="android.permission.SET_WALLPAPER_COMPONENT"/>
+ <permission name="android.permission.CHANGE_OVERLAY_PACKAGES"/>
+ <permission name="android.permission.WRITE_SECURE_SETTINGS"/>
+ <permission name="android.permission.MODIFY_DAY_NIGHT_MODE"/>
+ <permission name="android.permission.BIND_WALLPAPER"/>
+ </privapp-permissions>
```

M58 - Code scanner测试项:/GMS-Test-Suite/Exp+/M58_Code scanner

```text
Android_SDK/frameworks/base$ git diff core/res/res/values/config.xml
<!-- Default component for QR code scanner -->
- <string name="config_defaultQrCodeComponent"></string>
+ <string
name="config_defaultQrCodeComponent">com.google.android.gms/.mlkit.barcode.ui.PlatformBarcodeScanningActivityProxy</string>
Android_SDK/frameworks/base$ git diff packages/SystemUI/res/values/config.xml
<!-- The default tiles to display in QuickSettings -->
<string name="quick_settings_tiles_default" translatable="false">
-
wifi,bt,dnd,flashlight,rotation,battery,cell,airplane,night,screenrecord
+
wifi,bt,dnd,flashlight,rotation,battery,cell,qr_code_scanner,airplane,night,screenrecord
</string>
```

M60 - Long press on power to Assistant Education测试项:/GMS-Test-Suite/Exp+/M60_AssistantEducationEEA-V2固件SearchSelector测试项:SearchSelector app has no icon and cannot be disabled(EEA固件配置说明)

```text
Android_SDK/packages/apps/Settings$ git diff src/com/android/settings/applications/ApplicationFeatureProviderImpl.java
keepEnabledPackages.add(euicc.packageName);
}
+
keepEnabledPackages.add("com.google.android.apps.setupwizard.searchselector");
keepEnabledPackages.addAll(getEnabledPackageAllowlist());
```

### 16.14 userdebug 固件测试失败

下面相关fail项需要使用user固件测试,而不能使用userdebug固件

```text
CtsDrmTestCases
android.drm.cts.DRMTest#testForwardLockAccess
FAILURE: java.lang.RuntimeException: setDataSource failed: status =
0x80000000
CtsOsHostTestCases
android.os.cts.BuildHostTests#testIsSecureUserBuild
FAILURE: org.junit.ComparisonFailure: Must be a user build expected:
<user[debug]> but was:<user[]>
CtsOsTestCases
android.os.cts.BuildVersionTest#testBuildFingerprint
FAILURE: junit.framework.ComparisonFailure: Variant expected:<user[]>
but was:<user[debug]>
CtsPermission2TestCases
android.permission2.cts.PrivappPermissionsTest#privappPermissionsMustBeEnforced
java.lang.AssertionError: ro.control_privapp_permissions is not set to
enforce expected:<enforce> but was:<null>
CtsPermissionPolicyTestCases
android.permissionpolicy.cts.PrivappPermissionsTest#privappPermissionsMustBeEnforced
java.lang.AssertionError: ro.control_privapp_permissions is not set to
enforce expected:<enforce> but was:<null>
```

## 17 调试方法

某些测试项可能跟⻚面布局或机器dpi值有关,测试时可先调节机器dpi值或切换横竖屏测试

wm density 调节DPI；user_rotation可取0/1/2/3。

```text
wm density *** ## 调节机器dpi
settings get system user_rotation
settings put system user_rotation 1 ## user_rotation值为0/1/2/3
GtsPermissionControllerHostTestCases
android.permissioncontroller.gts.PermissionControllerHostTest#testDenyAppPermissionFragment
FAILURE: java.lang.AssertionError: Expected four atoms reported
```

CTS测试过程会设置机器为"Personal"和"Work"两种工作模式,去掉方法:Personal->Settings->Passwords & accounts->Work->Remove work profile

## 18 豁免申请

若机器产品型态不满足某个测试用例条件可考虑向Google申请豁免,申请豁免相关流程如下单侧某个fail项的测试用例,并提供单侧报告results和logs命令

```text
adb bugreport
```

抓取信息并提供报告bugreport-rk3399_Android12-SQ3A.220705.003.A1-2023-05-10-04-58-08.zip登录@***.corp-partner.google.com账号向Google豁免申请[IssueTracker]

## 19 附录 A

原稿列出的已知 GMS/EDLA 认证模块，不代表 ArmSoM 认证：

| 模块 | 型号 |
|---|---|
| Camera | AR0230 / 索尼 IMS 179 |
| WiFi | AP6275P(PCIE) / ap6275S(sdio) |

保留原文 `IMS 179` 拼写，需核对实际传感器型号。

## 20 附录 B

| 测试包 | 下载地址 | 需要 MADA/EDLA |
|---|---|---|
| GMS | [https://docs.partner.android.com/gms/building/integrating/gms-download](https://docs.partner.android.com/gms/building/integrating/gms-download) | Y |
| Mainline | [https://drive.google.com/drive/folders/1gxxMalTC99Y2SvyRDUfiDFvY_k4OzjO5](https://drive.google.com/drive/folders/1gxxMalTC99Y2SvyRDUfiDFvY_k4OzjO5) | Y |
| CTS/CTSV | [https://source.android.com/docs/compatibility/cts/downloads](https://source.android.com/docs/compatibility/cts/downloads) | N |
| VTS/GSI | [https://docs.partner.android.com/gms/testing/vts](https://docs.partner.android.com/gms/testing/vts) | Y |
| STS | [https://drive.google.com/drive/folders/1xqPTtC6MWiQizfFVdG7Ho0f2oGsmH0e-](https://drive.google.com/drive/folders/1xqPTtC6MWiQizfFVdG7Ho0f2oGsmH0e-) | Y |
| GTS | [https://docs.partner.android.com/gms/testing/gts?hl=en](https://docs.partner.android.com/gms/testing/gts?hl=en) | Y |
| GTSV | [https://docs.partner.android.com/gms/testing/gts/gts-verifier?hl=en#download](https://docs.partner.android.com/gms/testing/gts/gts-verifier?hl=en#download) | 原表空白 |
| GKI | [https://source.android.com/docs/core/architecture/kernel/gki-release-builds](https://source.android.com/docs/core/architecture/kernel/gki-release-builds) | N |
| APTS | [https://docs.partner.android.com/gms/testing/apts?hl=en](https://docs.partner.android.com/gms/testing/apts?hl=en) | Y |
| GOATS | [https://docs.partner.android.com/gms/testing/goats?hl=en](https://docs.partner.android.com/gms/testing/goats?hl=en) | Y |
| PAB | [https://ci.android.com/builds/branches/aosp-master/grid](https://ci.android.com/builds/branches/aosp-master/grid) | N |
| Checklist | [https://docs.partner.android.com/gms/policies/overview/manual-checklist?hl=en#](https://docs.partner.android.com/gms/policies/overview/manual-checklist?hl=en#) | Y |
| 安全补丁 | [https://drive.google.com/drive/u/0/folders/0B85mEDAGzAbsckRrZFhhV3YwTEk?resourcekey=0-6zNsbY0nWUmYsJO2TF-RZQ](https://drive.google.com/drive/u/0/folders/0B85mEDAGzAbsckRrZFhhV3YwTEk?resourcekey=0-6zNsbY0nWUmYsJO2TF-RZQ) | 原表空白 |


| PAB | CTS/VTS |
|---|---|
| aosp-android11-tests-release | [Android11](https://ci.android.com/builds/branches/aosp-android11-tests-release/grid?legacy=1&selected-targets=test_suites_arm64) |
| aosp-android12-tests-release | [Android12](https://ci.android.com/builds/branches/aosp-android12L-tests-release/grid?legacy=1&selected-targets=test_suites_arm64) |
| aosp-android13-tests-release | [Android13](https://ci.android.com/builds/branches/aosp-android13-tests-release/grid?legacy=1&selected-targets=test_suites_arm64) |

附录中 Android12 的可见分支名是 aosp-android12-tests-release，但 PDF 超链接实际指向 aosp-android12L-tests-release；两者均按原稿保留并注明。GTSV 和安全补丁的 MADA/EDLA 栏原本为空，未猜测。上述伙伴链接可能需账户权限。

## 21 英文V1.3旧稿补充与差异

以下仅为2021年英文旧稿的技术记录，不覆盖中文V3.0主线，也不代表当前认证要求。共有内容已合入对应章节；独有版本例值及冲突在此追溯。

英文第2–3页要求2GB及以下使用Go，PX30按RK3326申请sub-license、Android使用rk3326而uboot/kernel使用PX30。第4页旧Widevine L1清单为RK3288/RK3399；第5页Optee V2为RK3326/RK3566/RK3568，其余V1。不得将这些旧清单替换正文新清单。

英文第7–9页安全补丁通常三个月有效；旧工具RKTools/windows/KeyBoxWrite_v1.51_0109.zip、Rockchip_User_Guide_KeyWrite_CN.pdf；keybox材料写CTS单case报告，与中文GtsEdiHostTestCases不同。媒体Android11为1.5、旧路径/tmp/android-cts-media/android-cts-media-1.4。均保留版本上下文，不自行统一成新版本。

英文STS命令run sts-engbuild，中文为sts-dynamic-full；英文VTS表retry为run vts --retry 0。按实际测试包核对，不混用。GOATS要求Clang及RGA2→RGA2G补丁。英文第14页BTS自2018-04-01要求、zip而非update.img，以及PHA风险和向3PL/TAM确认已保留。

| 旧稿Android11平台 | Go Express | Regular Express |
| --- | --- | --- |
| RK3326 | Ready | WIP |
| RK3566 | Ready | Ready |
| RK3368a | WIP | WIP |
| RK3288 | N/A | WIP |
| RK3399 | N/A | WIP |

Ready/WIP/N/A是旧稿状态。为避免丢失旧SDK特定例值，下列按英文页码保留其配置代码；与主线重复的代码也保留历史出处，英文代码注释保持原文。

英文原稿第2页代码：

```text
lunch rk3326_rgo-user
```

英文原稿第3页代码：

```text
device/rockchip/rk3326/BoardConfig.mk
PRODUCT_UBOOT_CONFIG := px30
```

```text
https://docs.partner.android.com/gms/building/integrating/gms-download
```

```text
https://drive.google.com/drive/folders/1gxxMalTC99Y2SvyRDUfiDFvY_k4OzjO5
```

```text
# Initialize with repo
repo init -u https://partner-android.googlesource.com/platform/manifest -b r-aml-prebuilt-release
# Starting synchronize, please check if `.repo/manifests/default.xml` exists.
repo sync -c -j8
```

英文原稿第4页代码：

```text
diff --git a/default.xml b/default.xml
index 7be1f37..01ccba9 100644
--- a/default.xml
+++ b/default.xml
@@ -4,7 +4,7 @@
   <remote name="ohd"
            fetch=".."
            review="https://partner-android-review.googlesource.com/" />
- <default revision="r-aml-prebuilt-release"
+ <default revision="refs/tags/mainline_m_2020_dec_preload_5"
            remote="ohd" />
   <!-- Google-signed Mainline prebuilt module projects !-->
```

```text
BOARD_WIDEVINE_OEMCRYPTO_LEVEL := 3
```

```text
BUILD_WITH_EEA := true
BUILD_WITH_EEA_TYPE := type1 (Please config according to your EEA type)
```

英文原稿第5页代码：

```text
BUILD_WITH_GOOGLE_MARKET := true
# Only change the following macro when your product has radio
BUILD_WITH_GOOGLE_MARKET_ALL := true
# When creating the user build, please set this macro to false to delete the
Rockchip StressTest tool, otherwise the device may not start normally.
PRODUCT_HAVE_RKAPPS := false
```

```text
diff --git a/device.mk b/device.mk
index 63bb4ac..4340170 100644
--- a/device.mk
+++ b/device.mk
@@ -899,7 +899,7 @@ ifeq ($(strip $(BUILD_WITH_GOOGLE_MARKET)), true)
     OVERRIDE_TARGET_FLATTEN_APEX := true
     PRODUCT_PROPERTY_OVERRIDES += ro.apex.updatable=false
     # 2G A Go
- #TMP_GMS_VAR := $(TMP_GMS_VAR)_2gb
+ TMP_GMS_VAR := $(TMP_GMS_VAR)_2gb
   endif
   ifeq ($(strip $(BUILD_WITH_EEA)),true)
     BUILD_WITH_GOOGLE_MARKET_ALL := true
```

```text
PRODUCT_HAVE_OPTEE := true
```

```text
BOARD_GRAVITY_SENSOR_SUPPORT := true
BOARD_COMPASS_SENSOR_SUPPORT := true
```

```text
BOARD_BLUETOOTH_LE_SUPPORT := false
```

```text
BUILD_WITH_GOOGLE_FRP := true
```

英文原稿第6页代码：

```text
BOARD_AVB_ENABLE := true
```

```text
RKDocs/android/patches/gms/0001-libavb-Lock-the-device-when-the-device-init-or-write.patch
```

```text
BOARD_USES_AB_IMAGE := true
BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
# Please add the following changes if it does not exist:
ifeq ($(strip $(BOARD_USES_AB_IMAGE)), true)
  include device/rockchip/common/BoardConfig_AB.mk
  TARGET_RECOVERY_FSTAB := device/rockchip/rk356x/rk3566_rgo/recovery.fstab_AB
endif
```

```text
ifeq ($(strip $(BOARD_USES_AB_IMAGE)), true)
  include device/rockchip/common/BoardConfig_AB.mk
  TARGET_RECOVERY_FSTAB := device/rockchip/rk356x/rk3566_rgo/recovery.fstab_AB
endif
+ # The following overlay must be placed after `include
device/rockchip/common/BoardConfig_AB.mk`
+BOARD_SUPER_PARTITION_SIZE := 3263168512
+BOARD_ROCKCHIP_DYNAMIC_PARTITIONS_SIZE := $(shell expr $(BOARD_SUPER_PARTITION_SIZE) - 4194304)
```

```text
diff --git a/configs/rk3568_defconfig b/configs/rk3568_defconfig
index b7d433a..a87e2e3 100644
--- a/configs/rk3568_defconfig
+++ b/configs/rk3568_defconfig
@@ -204,6 +204,7 @@ CONFIG_AVB_LIBAVB=y
 CONFIG_AVB_LIBAVB_AB=y
 CONFIG_AVB_LIBAVB_ATX=y
 CONFIG_AVB_LIBAVB_USER=y
+CONFIG_ANDROID_AB=y
 CONFIG_RK_AVB_LIBAVB_USER=y
 CONFIG_OPTEE_CLIENT=y
 CONFIG_OPTEE_V2=y
```

英文原稿第7页代码：

```text
device/rockchip/common/BoardConfig.mk:
BOARD_SELINUX_ENFORCING ?= true
```

```text
diff --git a/prebuild.mk b/prebuild.mk
index 28391f6..7f38922 100644
--- a/prebuild.mk
+++ b/prebuild.mk
@@ -4,3 +4,4 @@ $(warning You can disable this by removing this and setting
BOARD_RECORD_COMMIT_
 $(shell test -d .repo && .repo/repo/repo manifest -r -o
$(OUT_DIR)/commit_id.xml)
 -include $(TARGET_DEVICE_DIR)/prebuild.mk
+ROCKCHIP_BUILD_NUMBER := 202001 (Some numbers)
```

```text
build/make:
core/version_defaults.mk
PLATFORM_SECURITY_PATCH := 2020-03-05
```

```text
diff --git a/configs/rk3568_defconfig b/configs/rk3568_defconfig
index 46440b6..22831d2 100644
```

英文原稿第8页代码：

```text
--- a/configs/rk3568_defconfig
+++ b/configs/rk3568_defconfig
@@ -205,6 +205,10 @@ CONFIG_AVB_LIBAVB=y
 CONFIG_AVB_LIBAVB_AB=y
 CONFIG_AVB_LIBAVB_ATX=y
 CONFIG_AVB_LIBAVB_USER=y
 CONFIG_RK_AVB_LIBAVB_USER=y
 CONFIG_OPTEE_CLIENT=y
 CONFIG_OPTEE_V2=y
+CONFIG_ANDROID_WRITE_KEYBOX=y
+CONFIG_ANDROID_KEYMASTER_CA=y
+CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION=y
```

```text
1. A single testcase report from CTS.
2. Device information (Ask 3pl for a template).
3. A file ends with .txt and includes Device ID.
Google Requests to use Device ID to apply the key:
Device ID within the file should meet the following properties:
    1. Unique and cannot be duplicate of another Device IDs within the file
    2. Must be between 1-32 characters in length
    3. Only following characters allowed [a-z][A-Z][0-9][_][-][.]
    4. No whitespaces allowed
Device ID files have the following requirements:
    1. ASCII text file in unix format.
    2. File name should be created with the following characters [a-z][A-Z][0-
9][_][-][.] in a meaningful way (e.g. Make_Model_Date_Quantity.txt)
    3. Must only contain Device IDs. No comments, headers, or other
information
    4. One Device ID per line
    5. No duplicate Device IDs within file
    6. No blank lines
    7. No white spaces
```

英文原稿第10页代码：

```text
In Ubuntu, you can add the following content to ~/.bashrc or edit the
following into a file such as env, then source env before testing:
export JAVA_HOME=/home/Your_Name/Software/jdk1.8.0_77
export JRE_HOME=${JAVA_HOME}/jre
export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib
export PATH=${JAVA_HOME}/bin:$PATH
export PATH=/home/Your_Name/Software/android-sdk-linux/tools:$PATH
export PATH=/home/Your_Name/Software/android-sdk-linux/platform-tools:$PATH
export PATH=/home/Your_Name/Software/android-sdk-linux/build-tools/19.0.0:$PATH
```

```text
sudo apt-get install lib32stdc++6 lib32z1
```

```text
$ sudo apt-get install python-dev
```

```text
$ sudo apt-get install python-protobuf
$ sudo apt-get install protobuf-compiler
```

```text
$ sudo apt-get install python-virtualenv
$ sudo apt-get install python-pip
```

```text
$ sudo apt install virtualenv
```

```text
sudo apt autoremove python-virtualenv
sudo apt autoremove virtualenv
sudo ln -sf ~/.local/bin/pip2 /usr/bin/pip
pip install --user virtualenv
```

英文原稿第11页代码：

```text
Q: Replace your adb/fastboot
A: Take adb as an example, type in the terminal:
whereis adb
$ adb: /home/rockchip/Software/android-sdk-linux/platform-tools/adb
adb kill-server
After confirming the location of adb/fastboot, replace the adb/fastboot binary
```

```text
run cts --shard-count 3 -s SN1 -s SN2 -s SN3
```

```text
CtsKeystoreTestCases
android.keystore.cts.KeyAttestationTest#testEcAttestation
android.keystore.cts.KeyAttestationTest#testRsaAttestation
android.keystore.cts.KeyAttestationTest#testEcAttestation_DeviceLocked
android.keystore.cts.KeyAttestationTest#testRsaAttestation_DeviceLocked
```

英文原稿第12页代码：

```text
adb shell settings put global hidden_api_policy 1
```

```text
adb install -r -g CtsVerifier.apk
```

英文原稿第13页代码：

```text
adb shell appops set com.android.cts.verifier android:read_device_identifiers allow
```

```text
adb shell appops set com.android.cts.verifier MANAGE_EXTERNAL_STORAGE 0
```

```text
$ vi .bashrc
export APE_API_KEY=/path/to/key.json
```

英文原稿第14页代码：

```text
diff --git a/drivers/video/rockchip/rga2/Kconfig b/drivers/video/rockchip/rga2/Kconfig
index efc1ef6..3458051 100644
--- a/drivers/video/rockchip/rga2/Kconfig
+++ b/drivers/video/rockchip/rga2/Kconfig
@@ -1,5 +1,5 @@
 # SPDX-License-Identifier: GPL-2.0
-menu "RGA2"
+menu "RGA2G"
        depends on ARCH_ROCKCHIP
 config ROCKCHIP_RGA2
```

```text
rockchip~rk3326_qgo~rk3326_qgo~10~QD1A.190821.014.C2~201911~user~release-keys$
ls
boot-debug.img boot.img dtbo.img misc.img recovery.img super.img
vbmeta.img
```

英文原稿第15页代码：

```text
repo init -m Android10_Express.xml
# For Android 11
repo init -m Android11_Express.xml
```

```text
repo init --repo-url=ssh://git@www.rockchip.com.cn:2222/repo-release/tools/repo.git -u ssh://git@www.rockchip.com.cn:2222/Android_Qt/manifests.git -m Android10_Express.xml
# Android 11
repo init --repo-url=ssh://git@www.rockchip.com.cn:2222/repo-release/tools/repo.git -u ssh://git@www.rockchip.com.cn:2222/Android_R/manifests.git -m Android11_Express.xml
```

```text
BUILD_WITH_GOOGLE_GMS_EXPRESS := true
```

英文原稿第16页代码：

```text
diff --git a/gms-express.xml b/gms-express.xml
index 78f4d99..de93557 100644
--- a/gms-express.xml
+++ b/gms-express.xml
@@ -16,5 +16,5 @@
  -->
  <!-- These are configurations that should exist on GMS Express devices. -->
  <config>
- <feature name="com.google.android.feature.GMSEXPRESS_BUILD " />
+ <feature name="com.google.android.feature.GMSEXPRESS_PLUS_BUILD" />
  </config>
```

```text
patch/frameworks/base/increase_waiting_time_for_setup_wizard.diff
```

```text
patches/gms/0001-libavb-Lock-the-device-when-the-device-init-or-write.patch
```

## 22 原稿技术链接索引

中文/英文原稿中的技术链接按PDF页码保留，部分需要合作伙伴权限；未尝试登录或执行其操作。

- [CN PDF p.4](https://docs.partner.android.com/gms/policies/domains/reqs?authuser=2#nearby-share)

- [CN PDF p.5](https://docs.partner.android.com/gms/policies/domains/reqs?authuser=3#10_android_go)

- [CN PDF p.5](https://docs.partner.android.com/gms/policies/domains/reqs?authuser=3#64-bit-gms)

- [CN PDF p.11](https://docs.partner.android.com/gms/policies/regional/eea-builds)

- [CN PDF p.17](https://cs.android.com/android/platform/superproject/+/android12-security-release:)

- [CN PDF p.17](https://cs.android.com/android/platform/superproject/+/android13-security-release:)

- [CN PDF p.17](https://cs.android.com/android/platform/superproject/+/android14-security-release:)

- [CN PDF p.26](https://source.android.com/docs/core/ota/apex?authuser=2#vbmeta-signing)

- [CN PDF p.30](https://docs.google.com/document/d/1SK2LvrqvTQDEvK8WlB-EujCVvyEogiz4O83gtNkd_sU/edit)

- [CN PDF p.30](https://docs.partner.android.com/gms/policies/edla/edla-other-form)

- [CN PDF p.54](https://docs.partner.android.com/gms/policies/domains/reqs?authuser=2&hl=zh-cn#app-standby-buckets)

- [CN PDF p.67](https://docs.partner.android.com/gms/building/enterprise/zero-touch/implementing?hl=en#remove-oobconfig)

- [CN PDF p.75](https://docs.partner.android.com/gms/policies/regional/eea-builds?hl=en#v2-build-reqs)

- [CN PDF p.76](https://issuetracker.google.com/)

- [EN PDF p.11](https://support.google.com/androidpartners_gms/answer/9380762?hl=en)

{% endraw %}
