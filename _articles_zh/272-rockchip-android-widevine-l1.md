---
title: "Rockchip Android 14 Widevine L1 集成与验证"
description: "Rockchip Android 14 Widevine L1 集成与验证"
excerpt: "Rockchip Android 14 Widevine L1 集成与验证"
translation_key: "272-rockchip-android-widevine-l1"
slug: "272-rockchip-android-widevine-l1"
lang: "zh"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

依据 RK-SM-YF-773 V1.0.0 中文原稿。适用表列 Android14 的 RK3326、RK3399、RK3562、RK356x、RK3568、RK3576、RK3588；原稿未指定内核。ArmSoM 仅作平台参考，具体板卡须匹配 Android BSP、TEE/OEMCrypto、设备注册和密钥生产流程，本文不代表任何产品获 L1 或 GMS 认证，未执行烧录、注册、上传或硬件测试。无对应英文 PDF，英俄德使用同一原稿图片（部分图本身为英文），明确来源。

## 1 功能

介绍 Widevine DRM 客户端集成到设备/SoC 的流程，区分 GMS 与 AOSP，以及 Android14 的 LR 升级版本和 IR 初始版本，包含验证和问题排查。

## 2 生态系统

重点为红框 CDM 与 OEMCrypto HAL：

![Widevine生态系统（原稿矢量图）](/docs/rockchip-android-widevine-l1/images/pdf-p03-1.png)

Widevine生态系统（原稿矢量图）

### 2.1 L1 要求

1. 严格满足 Widevine Level1 安全要求。
2. 符合要求的 L1 OEMCrypto；CDM 用兼容 OEMCrypto 构建，通常由芯片商提供，设备厂应与芯片商取得构建版本。
3. 有效 System ID，注册品牌/型号；集成时 IN_TESTING，完成后 RELEASED 才可生产。
4. 配置凭据：2.0 请求 keybox；4.0 上传密送数据、创建 Cloud 项目及上传密钥（原稿“密送”用语保留，须按接口定义核对）。
5. 正式发布前完成集成测试。

### 2.2 L3 要求

遵守 Level3 要求，使用 Widevine 提供的 L3 预构建库，无需设备系列注册、keybox或证书请求。注册平台不能选错：记录不共享数据库、不可互换；Widevine Integration Console 面向 AOSP/CE（Linux），APFE 面向 GMS/GAS/AAOS。

## 3 Android DRM 集成

### 3.1 GMS

申请 GMS 的 SDK 默认含 vendor/widevine；GAS/AAOS 汽车设备应通过相应合作伙伴团队获取软件和文档权限。这些工作流的客户端代码、测试要求和设备平台独立。

### 3.2 AOSP

Widevine 直接支持不含 GMS 的 AOSP 集成，原稿流程图：

![AOSP集成流程（原稿矢量图）](/docs/rockchip-android-widevine-l1/images/pdf-p05-2.png)

AOSP集成流程（原稿矢量图）

### 3.2.1 L1 流程

1. 从芯片商取得 L1 OEMCrypto。
2. [请求 Integration Console 权限](https://developers.google.com/widevine/drm/device-management/ic-workflow/getting-access?hl=zh-cn)，完成设备注册及 keybox 请求；品牌/型号对应原稿写法 product.ro.manufacturer / product.ro.model（属性前缀应按SDK核对）。
3. 获取 CDM 代码及文档：`<branch>/libwvdrmengine` 和 `<branch>/libwvdrmengine/docs`。放入 AOSP 的 ROOT/vendor/widevine，构建脚本自动检测编译。
4. 测试：在 WIDEVINE_ROOT/libwvdrmengine/ 执行 `sh build_and_run_all_unit_tests.sh`，运行 WVTS 集成测试，建议 CTS 兼容测试。

### 3.2.2 L3 流程

库位于 vendor/widevine/libwvdrmengine/level3/*/libl3oemcrypto.cpp，无需设备系列注册、keybox或证书请求。

### 3.2.3 启用 L1

设备产品目录 device/rockchip/rk…/BoardConfig.mk：

```make
BOARD_WIDEVINE_OEMCRYPTO_LEVEL := 1
```

### 3.2.4 GMS 服务（AOSP 不需要）

原稿本节称 provisioning4.0 需要 GMS，但后文又描述 AOSP4.0 注册，应按实际集成路线核对。配置后在 SDK 根目录 lunch，再检查值：

```make
BUILD_WITH_GOOGLE_MARKET := true
```

```sh
get_build_var BOARD_WIDEVINE_OEMCRYPTO_LEVEL
get_build_var BUILD_WITH_GOOGLE_MARKET
```

### 3.2.5 Widevine 仓库

IR初始Android14跳过；旧系统升级Android14的LR在vendor/widevine执行：

```sh
cp -rf prebuilt/arm64/liboemcrypto_lr.so prebuilt/arm64/liboemcrypto.so
cp -rf prebuilt/arm/liboemcrypto_lr.so prebuilt/arm/liboemcrypto.so
```

默认keybox库日志包含以下provisioning值。在 hardware/rockchip/keymaster4/rockchip_rkp_service 更换LR工具后，只提取name为default的CSR：

```text
"provisioning":"OEMCrypto_Keybox"
```

```sh
cp -rf bin/arm/rockchip_rkp_factory_extraction_tool_lr bin/arm/rockchip_rkp_factory_extraction_tool
cp -rf bin/arm64/rockchip_rkp_factory_extraction_tool_lr bin/arm64/rockchip_rkp_factory_extraction_tool
```

```json
{"build_fingerprint":"rockchip/rk3562_u/...TXNlLWtleXM=","name":"default","serialno":"rk83991906"}
```

## 4 Provisioning 要求

原稿按设备及OEMCrypto区分：

|设备|OEMCrypto|DICE|2.0|3.0|4.0 non-DICE|4.0 DICE|
|---|---|---|---|---|---|---|
|新设备|v18+|Yes|-|-|-|必须（默认）|
|新设备|v17+|No|必须（默认）|可选|可选|-|
|新设备|v17 or earlier|No|必须（默认）|可选|-|-|
|已有设备|v17+|No|必须（默认）|可选|-|-|

### 4.1 OTA 到 Android14（LR）

采用Provisioning2.0烧写L1 keybox，示例已省略部分内容，不是真实完整凭据：

```xml
<?xml version="1.0"?>
<Widevine>
<NumberOfKeyboxes>1</NumberOfKeyboxes>
<Keybox DeviceID="test-001"><Key>738a1896e6c7ec9fa3079220aaaa132</Key>
<ID>0000000200...</ID><Magic>6b626f78</Magic><CRC>5d6a650a</CRC></Keybox>
</Widevine>
```

使用rkpacker转kdb，再用1.64版工具烧写，兼容旧设备已烧keybox。同项目Android12/13升14，或新旧项目在APFE复用同SKU，必须保持keybox注册；改为4.0可能令已出货设备请求因认证方式不匹配而被拒，尽管新设备正常。

### 4.2 Android14 IR

新Android14采用Provisioning4.0，流程如下。

![原稿技术图：PDF 第8页，图1（中文原稿）](/docs/rockchip-android-widevine-l1/images/pdf-p08-3.png)

原稿技术图：PDF 第8页，图1（中文原稿）

1. SoC供应商开发OEMCrypto TA。
2. SoC供应商在Widevine网页注册芯片。
3. OEM通过Widevine/APFE注册设备。
4. OEM基于每芯片UDS建立信任根，在KDF中使用SoC全局唯一128位密钥生成OEMCrypto公私钥对。
5. OEM生产设备。重点关注3、5。

### 4.2.1 注册设备

先确认步骤2芯片已注册。AOSP向Widevine注册；GMS通常由3pl协助，在APFE已有产品信息。原图步骤：选择设备→Edit→补全红框CPU Make/CPU Model→Register DRM。

![原稿技术图：PDF 第9页，图1（中文原稿）](/docs/rockchip-android-widevine-l1/images/pdf-p09-4.png)

原稿技术图：PDF 第9页，图1（中文原稿）

![原稿技术图：PDF 第9页，图2（中文原稿）](/docs/rockchip-android-widevine-l1/images/pdf-p09-5.png)

原稿技术图：PDF 第9页，图2（中文原稿）

![原稿技术图：PDF 第10页，图1（中文原稿）](/docs/rockchip-android-widevine-l1/images/pdf-p10-6.png)

原稿技术图：PDF 第10页，图1（中文原稿）

![原稿技术图：PDF 第10页，图2（中文原稿）](/docs/rockchip-android-widevine-l1/images/pdf-p10-7.png)

原稿技术图：PDF 第10页，图2（中文原稿）

![原稿技术图：PDF 第10页，图3（中文原稿）](/docs/rockchip-android-widevine-l1/images/pdf-p10-8.png)

原稿技术图：PDF 第10页，图3（中文原稿）

![原稿技术图：PDF 第10页，图4（中文原稿）](/docs/rockchip-android-widevine-l1/images/pdf-p10-9.png)

原稿技术图：PDF 第10页，图4（中文原稿）

注册图的示例选Provisioning4.0、Key Upload、DICE No、OEM_CRYPTO_V18_5，TEE/TA可OTA=Yes、按设备单独OTA=Yes、防回滚=Yes、特权调试关闭=Yes、关闭音频输出=No。LR图则选Keybox/Verifier key。5.1数字输出支持（无数字输出或HDCP时unspecified）和5.2是否支持关闭数字视频输出必须按实际设备填写，不照抄图中HDCP_V2_3/Yes。以下为注册成功示例。

![原稿技术图：PDF 第11页，图1（中文原稿）](/docs/rockchip-android-widevine-l1/images/pdf-p11-10.png)

原稿技术图：PDF 第11页，图1（中文原稿）

### 4.2.2 生产

提取并上传Widevine RKP CSR前必须烧序列号及ID Attestation。调试可命令提取；生产使用RKDevInfoWriteTool。工具不存在时在system/security/provisioner执行mm。

```sh
rkp_factory_extraction_tool64 --output_format build+csr > /sdcard/csr.json
```

烧序列号/ID Attestation后正常重启一次，RKP服务生成CSR并存vendor storage；再次进入loader，烧attestation keybox后读取CSR到工具目录。占用ID66/67。检查default、widevine及非空serialno；示例省略数据为...。

```c
#define VENDOR_CSR_SERIAL_ID 66
#define VENDOR_CSR_ID 67
```

![原稿技术图：PDF 第12页，图1（中文原稿）](/docs/rockchip-android-widevine-l1/images/pdf-p12-11.png)

原稿技术图：PDF 第12页，图1（中文原稿）

```json
{"build_fingerprint":"rockchip/rk3562_u/...TXNlLWtleXM=","name":"default","serialno":"rk83991906"}
{"build_fingerprint":"rockchip/rk3562_u/...Vhc2Uta2V5cw==","name":"widevine","serialno":"rk83991906"}
```

生成方式与keymint相同，参照SDK RKDocs/android/Rockchip_Android_Remote_key_Provisioning_Guide。启用L1时一次提取同时包含keymint及widevine，只需提取上传一次。

## 5 验证

连接可访问Google/YouTube等外网的网络，重启或等待证书下载（图中步骤3/5）。

### 5.1 级别

安装new Drminfo.apk，System ID应与注册成功值一致，忽略Vendor/Version差别。

![原稿技术图：PDF 第14页，图1（中文原稿）](/docs/rockchip-android-widevine-l1/images/pdf-p14-12.png)

原稿技术图：PDF 第14页，图1（中文原稿）

![原稿技术图：PDF 第15页，图1（中文原稿）](/docs/rockchip-android-widevine-l1/images/pdf-p15-13.png)

原稿技术图：PDF 第15页，图1（中文原稿）

Provisioning4.0重点是System ID，不仅Security Level=L1。2147483647说明未获证书，检查注册、CSR上传及联网；8158表示liboemcrypto.so未正确加载、实际L3。

### 5.2 视频

ExoPlayer Demo红框/箭头条目应正常播放超过1分钟。格式由对应SoC的vendor/rockchip/common/vpu/etc/media_codecs_c2_rk***.xml和media_codecs_secure_rk***.xml决定。

![原稿技术图：PDF 第16页，图1（中文原稿）](/docs/rockchip-android-widevine-l1/images/pdf-p16-14.png)

原稿技术图：PDF 第16页，图1（中文原稿）

## 6 常见问题

### 6.1 注册固件必须完全一致吗？

不必，可以同芯片平台、同Android版本；至少Device Name、Product、CPU Make(Rockchip)、CPU Model(RK****实际型号)一致。原稿承认信息不完整，以实际申请结果为准。下图属性映射保留。

### 6.2 如何确认L1环境？

DrmInfo显示L1，查logcat：

![原稿技术图：PDF 第17页，图1（中文原稿）](/docs/rockchip-android-widevine-l1/images/pdf-p17-15.png)

原稿技术图：PDF 第17页，图1（中文原稿）

```text
WVCdm: [cdm_engine.cpp(1089):IsSecurityLevelSupported] level = L1
...
WVCdm: [oemcrypto_adapter_dynamic.cpp(875):Initialize] OEMCrypto_Initialize Level 1 success. I will use level 1.
```

### 6.3 DrmInfo未显示L1

1. 确认L1库整合，开机打开DrmInfo后查日志。IR4.0与LR2.0差异为provisioning字段：

```text
I/WVCdm: [oemcrypto_adapter_dynamic.cpp(885):Initialize] Level 1 Build Info
(v18): {"soc_vendor":"Rockchip","soc_model":"rk3562","ta_ver":"18.5.0+May 15 2024 14:48:28","uses_opk":true,"tee_os":"Optee","tee_os_ver":"3.13.0","form_factor":"tablet","implementer":"Rockchip","provisioning":"OEMCrypto_BootCertificateChain","is_factory_build":"false","fused":false,"is_debug":false}
```

```text
I/WVCdm: [oemcrypto_adapter_dynamic.cpp(885):Initialize] Level 1 Build Info
(v18): {"soc_vendor":"Rockchip","soc_model":"rk3562","ta_ver":"18.5.0+May 15 2024 14:48:28","uses_opk":true,"tee_os":"Optee","tee_os_ver":"3.13.0","form_factor":"tablet","implementer":"Rockchip","provisioning":"OEMCrypto_Keybox","is_factory_build":"false","fused":false,"is_debug":false}
```

2. 2.0确认已烧keybox；4.0确认注册及外网。非GMS应向Widevine注册并上传widevine CSR；GMS检查服务器可达：

```sh
ping remoteprovisioning.googleapis.com
```

证书申请失败可搜索RkpdWidevine；500通常是未注册成功或CSR未上传。原稿失败与成功日志：

```text
2024-04-19 10:38:14.366 2333-2406/? E/RkpdWidevine: Server request for WV certs
failed. Error: 500
2024-04-19 10:38:14.368 2333-2406/? E/RkpdWidevine: WV Provisioning failed.
java.io.IOException: Failed to request WV certs. Error: 500
at
com.android.rkpdapp.provisioner.WidevineProvisioner.sendNetworkRequest(WidevineProvisioner.java:188)
at
com.android.rkpdapp.provisioner.WidevineProvisioner.fetchWidevineCertificate(WidevineProvisioner.java:168)
at
com.android.rkpdapp.provisioner.WidevineProvisioner.provisionWidevine(WidevineProvisioner.java:144)
at
com.android.rkpdapp.provisioner.WidevineProvisioner.doWork(WidevineProvisioner.java:97)
at androidx.work.Worker$1.run(Worker.java:82)
at
java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1145)
at
java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:644)
at java.lang.Thread.run(Thread.java:1012)
```

```text
Line 45913: 2024-05-15 20:17:52.504 2947-5376/? I/RkpdWidevine: Starting WV
provisioning. Current attempt: 0
Line 46152: 2024-05-15 20:17:53.843 2947-5376/? I/RkpdWidevine: Provisioning
successful.
```

仍失败则提供：开机后打开DrmInfo的logcat及串口日志、服务器注册信息/截图、adb bugreport及RKP CSR。4.0以System ID非2147483647且与注册值一致为判断。原稿此处“非GMS/APFE”混用，应按2.2区分平台。

### 6.4 有声无图/绿屏/花屏

录制现象并抓adb bugreport；按5.2检查两份芯片XML配置，目录应有对应rk***。

### 6.5 同时支持2.0与4.0？

一台设备仅一个模型，OEM须选择。该规范用于视频输出保护，不含音频；达到Level1不要求音频输出保护。

### 6.6 OEMCrypto版本

原稿建议最新可用版本。v18起新实现要求4.0；从旧版升级到v18+的已存在设备必须保持制造时的预配方法。版本兼容表是原稿快照，不是当前兼容保证：

|Android|技术版本日期|MediaDRM HIDL|CDM|OEMCrypto(new)|OEMCrypto(upgrade)|
|---|---|---|---|---|---|
|Android15.0 V+|TBD|com.google.android.widevine.nonupdatable<br>com.google.android.widevine.nonupdatable<br>com.google.android.widevine.lazy<br>udc-widevine-release|19.0.0(APEX)|19.1+|18.1|
|Android14.0 U+|2023-10|com.google.android.widevine.nonupdatable<br>com.google.android.widevine.nonupdatable<br>com.google.android.widevine.lazy|18.0.0(APEX)|18.1+|17.1|
|Android13.0 T+|2022-08|android.hardware.drm-service.widevine<br>(tm-widevine-release)|17.0.0|17.1|16.3+|
|Android12.0 S+|2021-10|android.hardware.drm@1.4<br>sc-widevine-release|16.1.0|16.3 /16.4|16.3 /16.4|
|Android11.0 R+|2020-09|android.hardware.drm@1.3<br>rvc-widevine-release|16.0.0|16.3 /16.4|15.x /16.3 /16.4|

原表的重复HIDL项目及Android15“待定”保留，不据此更新当下规格。

### 6.7 上传时机

最终用户开机前先上传设备信息，可实时或批量，保存上传记录供Google审核。

## 7 附录：Android14代码环境

确认相应仓库有以下提交，没有则向RK获取补丁。代码中的作者署名属于技术提交记录，保留。

### vendor/widevine

```text
commit 9f0b92744eeaa144629c6c2e0101d40a50160d7e (HEAD)
Author: callen.cai <callen.cai@rock-chips.com>
Date: Wed May 15 15:15:24 2024 +0800
widevine : Add android LR version.
commit bab2013c13fdb22c5f244d38510c998da4c245ba (rk/rk35/mid/14.0/develop,
m/rk35/mid/14.0/develop)
Author: callen.cai <callen.cai@rock-chips.com>
Date: Mon Apr 22 09:07:46 2024 +0800
widevine : update opk to v18.5.
This version support widevine RKP.
```

### device/rockchip/common

```text
commit 56aa6a72e6f00753614fba71edef7261509320d6
Author: callen.cai <callen.cai@rock-chips.com>
Date: Tue Apr 23 16:28:03 2024 +0800
sepolicy : add sepolicy for widevine rkp csr provisioning.
-------------------------------------------------------------
commit b336ed61eff291ee0b9170e9a6415fd248a41428
Author: callen.cai <callen.cai@rock-chips.com>
Date: Tue Dec 19 17:12:08 2023 +0800
media_drm : add PRODUCT_VENDOR_LINKER_CONFIG_FRAGMENTS configuration
for widevine L1.
```

### frameworks/av

```text
commit 1649daedd5a3fc8bc1a876c512fe657ee4132a80 (HEAD, tag: android-14.0-mid-rkr4, m/rk35/mid/14.0/develop, aosp/rk35/mid/14.0/develop)
Author: Robert Shih <robertshih@google.com>
Date: Wed Jul 12 12:50:41 2023 -0700
DrmRkpAdapter: only return HALs supporting get bcc
commit 0c588a79543ee1ae5a74c7a27bd4731161b8c409
Author: Robert Shih <robertshih@google.com>
Date: Mon Jul 10 11:54:57 2023 -0700
DrmRemotelyProvisionedComponent: assemble csr in adaptor
commit 72cc71abe5b8544f467e2e8e9d7f9930d0dc32e9
Author: Kyle Zhang <kelzhan@google.com>
Date: Thu Jun 15 00:16:42 2023 +0000
Create libmediadrmrkp as drm to irpc adapter library
```

### hardware/rockchip/keymaster4

```text
IR:
commit a6ba57b20d107ccf318fc678a1360fd963c8996e (HEAD)
Author: callen.cai <callen.cai@rock-chips.com>
Date: Mon May 13 17:06:07 2024 +0800
rkp : add sepolicy for get serial number.
commit 7a176bf1ccf45cc0bc67b5dda8b855f6cfc057f3 (tag: android-14.0-mid-rkr4,
rk/rk35/mid/14.0/develop, m/rk35/mid/14.0/develop)
Author: callen.cai <callen.cai@rock-chips.com>
Date: Tue Apr 23 16:24:16 2024 +0800
rkp : support widevine rkp csr provisioning.
LR:
commit c6b01283afafe0ce4d9bf8ba22103ee0e33606dc
Author: callen.cai <callen.cai@rock-chips.com>
Date: Sat Jun 22 10:30:35 2024 +0800
rkp : Add LR version rkp csr tools.
```

### system/security

```text
commit 9b8fc62d77f0d7cf5f79efdaca53c2ee31c96dc0 (HEAD, tag: android-14.0-mid-rkr4, m/rk35/mid/14.0/develop, aosp/rk35/mid/14.0/develop)
Author: Robert Shih <robertshih@google.com>
Date: Mon Jul 10 13:07:35 2023 -0700
rkp_factory_extraction_tool: append drm CSRs
commit 36356e22faf3e78f0fbb90a03a4d750b15402395
Author: Robert Shih <robertshih@google.com>
Date: Wed Jun 28 15:32:45 2023 -0700
Export rkp_factory_extraction_tool on ci
```

### frameworks/native

原稿要求手工应用：

```diff
diff --git a/libs/renderengine/skia/AutoBackendTexture.cpp b/libs/renderengine/skia/AutoBackendTexture.cpp
index 23c99b0796..acd7ae844b 100644
--- a/libs/renderengine/skia/AutoBackendTexture.cpp
+++ b/libs/renderengine/skia/AutoBackendTexture.cpp
@@ -44,7 +44,7 @@ AutoBackendTexture::AutoBackendTexture(GrDirectContext* context, AHardwareBuffer
isOutputBuffer);
mColorType =
GrAHardwareBufferUtils::GetSkColorTypeFromBufferFormat(desc.format);
if (!mBackendTexture.isValid() || !desc.width || !desc.height) {
- LOG_ALWAYS_FATAL("Failed to create a valid texture. [%p]:[%d,%d]
isProtected:%d "
+ ALOGE("Failed to create a valid texture. [%p]:[%d,%d] isProtected:%d "
"isWriteable:%d format:%d",
this, desc.width, desc.height, createProtectedImage,
isOutputBuffer,
desc.format);
```

## 8 附录：官方参考（部分需要APFE账户）

- [Provisioning4.0](https://developers.google.com/widevine/drm/specification/provisioning-4?hl=zh-cn)
- [Provisioning4.0 options](https://developers.google.com/widevine/drm/specification/provisioning-4/options?hl=zh-cn#device_key_database_model)
- [Testing / CSR upload](https://docs.partner.android.com/gms/building/integrating/att-keys/rkp?hl=zh-cn#extract_and_upload_the_widevine_csr)
- [RKP FAQ](https://docs.partner.android.com/gms/building/integrating/att-keys/rkp-faqs?hl=zh-cn#upload-update)
- [ArmSoM](https://docs.armsom.org/)

{% endraw %}
