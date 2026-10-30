---
title: "Integrating and verifying Widevine L1 on Rockchip Android 14"
description: "Integrating and verifying Widevine L1 on Rockchip Android 14"
excerpt: "Integrating and verifying Widevine L1 on Rockchip Android 14"
translation_key: "272-rockchip-android-widevine-l1"
slug: "272-rockchip-android-widevine-l1"
lang: "en"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

Based on Chinese RK-SM-YF-773 V1.0.0. Its table lists Android14 on RK3326, RK3399, RK3562, RK356x, RK3568, RK3576 and RK3588; no kernel is specified. This is an ArmSoM platform reference: match the board’s Android BSP, TEE/OEMCrypto, registration and production-key process. It does not certify any product for L1 or GMS. No flashing, registration, upload or hardware test was performed. No English PDF exists here; English/Russian/German retain the same source figures, some already English.

## 1 Scope

Integrating the Widevine DRM client into a device/SoC, distinguishing GMS/AOSP and Android14 LR upgrades versus IR initial releases, with verification and troubleshooting.

## 2 Ecosystem

Focus on the red-box CDM and OEMCrypto HAL:

![Widevine ecosystem (source vector diagram)](/docs/rockchip-android-widevine-l1/images/pdf-p03-1.png)

Widevine ecosystem (source vector diagram)

### 2.1 L1 requirements

1. Strictly meet Widevine Level1 security requirements.
2. Use compliant L1 OEMCrypto; build CDM with compatible OEMCrypto, normally supplied by the chipset vendor. Device manufacturers obtain the build from that vendor.
3. Obtain a valid System ID by registering brand/model; records are IN_TESTING during integration and RELEASED before production.
4. Credentials:2.0 requests a keybox;4.0 uploads the source’s “密送” data, creates a Cloud project and uploads keys. This ambiguous source term must be checked against the interface specification.
5. Complete integration tests before release.

### 2.2 L3 requirements

Follow Level3 requirements and use Widevine’s prebuilt L3 library. No device-family registration, keybox or certificate request is required. Choose the right platform: records use separate databases and cannot be exchanged. Widevine Integration Console serves AOSP/CE(Linux); APFE serves GMS/GAS/AAOS.

## 3 Android DRM integration

### 3.1 GMS

The GMS-requested SDK includes vendor/widevine by default. GAS/AAOS automotive devices obtain software/document access from the relevant partner team. Their client code, tests and management platforms are separate.

### 3.2 AOSP

Widevine directly supports AOSP without GMS. Source workflow:

![AOSP integration workflow (source vector diagram)](/docs/rockchip-android-widevine-l1/images/pdf-p05-2.png)

AOSP integration workflow (source vector diagram)

### 3.2.1 L1 workflow

1. Obtain L1 OEMCrypto from the chipset vendor.
2. [Request Integration Console access](https://developers.google.com/widevine/drm/device-management/ic-workflow/getting-access?hl=zh-cn), register devices and request keyboxes. Brand/model correspond to source spellings product.ro.manufacturer / product.ro.model; verify property prefixes in the SDK.
3. Obtain CDM source/docs at `<branch>/libwvdrmengine` and `<branch>/libwvdrmengine/docs`. Place under AOSP ROOT/vendor/widevine for automatic build detection.
4. Run `sh build_and_run_all_unit_tests.sh` in WIDEVINE_ROOT/libwvdrmengine/, plus WVTS integration tests; CTS is recommended.

### 3.2.2 L3 workflow

Library: vendor/widevine/libwvdrmengine/level3/*/libl3oemcrypto.cpp. No family registration, keybox or certificate request.

### 3.2.3 Enable L1

Product device/rockchip/rk…/BoardConfig.mk:

```make
BOARD_WIDEVINE_OEMCRYPTO_LEVEL := 1
```

### 3.2.4 GMS service (not needed for AOSP)

This source section says provisioning4.0 requires GMS, while later describing AOSP4.0 registration. Resolve against the actual integration route. After configuration run lunch at SDK root and check values:

```make
BUILD_WITH_GOOGLE_MARKET := true
```

```sh
get_build_var BOARD_WIDEVINE_OEMCRYPTO_LEVEL
get_build_var BUILD_WITH_GOOGLE_MARKET
```

### 3.2.5 Widevine repository

Skip for Android14 IR. For older systems upgraded to Android14 LR, in vendor/widevine:

```sh
cp -rf prebuilt/arm64/liboemcrypto_lr.so prebuilt/arm64/liboemcrypto.so
cp -rf prebuilt/arm/liboemcrypto_lr.so prebuilt/arm/liboemcrypto.so
```

The default keybox library logs the following provisioning value. After replacing LR tools in hardware/rockchip/keymaster4/rockchip_rkp_service, only the default CSR is extracted:

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

## 4 Provisioning requirements

Source classification by device/OEMCrypto:

|Device|OEMCrypto|DICE|2.0|3.0|4.0 non-DICE|4.0 DICE|
|---|---|---|---|---|---|---|
|New|v18+|Yes|-|-|-|Required(default)|
|New|v17+|No|Required(default)|Optional|Optional|-|
|New|v17 or earlier|No|Required(default)|Optional|-|-|
|Existing|v17+|No|Required(default)|Optional|-|-|

### 4.1 OTA to Android14(LR)

Use Provisioning2.0 and flash the L1 keybox. This abbreviated example is not a complete real credential:

```xml
<?xml version="1.0"?>
<Widevine>
<NumberOfKeyboxes>1</NumberOfKeyboxes>
<Keybox DeviceID="test-001"><Key>738a1896e6c7ec9fa3079220aaaa132</Key>
<ID>0000000200...</ID><Magic>6b626f78</Magic><CRC>5d6a650a</CRC></Keybox>
</Widevine>
```

Convert to kdb with rkpacker and flash with tool1.64, retaining compatibility with previously provisioned keyboxes. Projects upgrading Android12/13 to14 or new projects reusing an old APFE SKU must keep keybox registration. Switching to4.0 can reject shipped devices because authentication no longer matches, even if new devices work.

### 4.2 Android14 IR

New Android14 uses Provisioning4.0 as follows.

![Source technical figure: PDF page 8, figure 1 (Chinese source)](/docs/rockchip-android-widevine-l1/images/pdf-p08-3.png)

Source technical figure: PDF page 8, figure 1 (Chinese source)

1. SoC vendor develops OEMCrypto TA.
2. SoC vendor registers the chipset with Widevine.
3. OEM registers devices through Widevine/APFE.
4. OEM uses per-chip UDS as root of trust; a globally unique128-bit SoC key in the KDF generates a new OEMCrypto key pair.
5. OEM manufactures devices. Focus on3 and5.

### 4.2.1 Register devices

First confirm chipset registration(step2). AOSP registers with Widevine; GMS generally uses a3pl and existing APFE product information. Screenshots: select device→Edit→complete red-box CPU Make/CPU Model→Register DRM.

![Source technical figure: PDF page 9, figure 1 (Chinese source)](/docs/rockchip-android-widevine-l1/images/pdf-p09-4.png)

Source technical figure: PDF page 9, figure 1 (Chinese source)

![Source technical figure: PDF page 9, figure 2 (Chinese source)](/docs/rockchip-android-widevine-l1/images/pdf-p09-5.png)

Source technical figure: PDF page 9, figure 2 (Chinese source)

![Source technical figure: PDF page 10, figure 1 (Chinese source)](/docs/rockchip-android-widevine-l1/images/pdf-p10-6.png)

Source technical figure: PDF page 10, figure 1 (Chinese source)

![Source technical figure: PDF page 10, figure 2 (Chinese source)](/docs/rockchip-android-widevine-l1/images/pdf-p10-7.png)

Source technical figure: PDF page 10, figure 2 (Chinese source)

![Source technical figure: PDF page 10, figure 3 (Chinese source)](/docs/rockchip-android-widevine-l1/images/pdf-p10-8.png)

Source technical figure: PDF page 10, figure 3 (Chinese source)

![Source technical figure: PDF page 10, figure 4 (Chinese source)](/docs/rockchip-android-widevine-l1/images/pdf-p10-9.png)

Source technical figure: PDF page 10, figure 4 (Chinese source)

The form example selects Provisioning4.0, Key Upload, DICE No, OEM_CRYPTO_V18_5, TEE/TA OTA Yes, individual OTA Yes, rollback protection Yes, privileged debugging disabled Yes, audio-output shutdown No. LR uses Keybox/Verifier key. Fields5.1 digital-output support(unspecified if no digital output/HDCP) and5.2 disabling digital video outputs must reflect the device, not blindly copy HDCP_V2_3/Yes. Successful-registration example follows.

![Source technical figure: PDF page 11, figure 1 (Chinese source)](/docs/rockchip-android-widevine-l1/images/pdf-p11-10.png)

Source technical figure: PDF page 11, figure 1 (Chinese source)

### 4.2.2 Manufacturing

Program serial number and ID Attestation before extracting/uploading Widevine RKP CSR. Debug using the command; production uses RKDevInfoWriteTool. If missing, build with mm in system/security/provisioner.

```sh
rkp_factory_extraction_tool64 --output_format build+csr > /sdcard/csr.json
```

After serial/ID Attestation programming reboot normally once. RKP generates CSR in vendor storage; re-enter loader, flash attestation keybox and read CSR to the tool directory. IDs66/67 are used. Check default, widevine and nonempty serialno; example data is shortened with....

```c
#define VENDOR_CSR_SERIAL_ID 66
#define VENDOR_CSR_ID 67
```

![Source technical figure: PDF page 12, figure 1 (Chinese source)](/docs/rockchip-android-widevine-l1/images/pdf-p12-11.png)

Source technical figure: PDF page 12, figure 1 (Chinese source)

```json
{"build_fingerprint":"rockchip/rk3562_u/...TXNlLWtleXM=","name":"default","serialno":"rk83991906"}
{"build_fingerprint":"rockchip/rk3562_u/...Vhc2Uta2V5cw==","name":"widevine","serialno":"rk83991906"}
```

CSR generation follows keymint; see SDK RKDocs/android/Rockchip_Android_Remote_key_Provisioning_Guide. With L1 enabled, one extraction contains keymint and widevine; upload once.

## 5 Verification

Connect to a network reaching Google/YouTube; reboot or wait for certificate download(diagram steps3/5).

### 5.1 Level

Install new Drminfo.apk. System ID must match registration; ignore Vendor/Version differences.

![Source technical figure: PDF page 14, figure 1 (Chinese source)](/docs/rockchip-android-widevine-l1/images/pdf-p14-12.png)

Source technical figure: PDF page 14, figure 1 (Chinese source)

![Source technical figure: PDF page 15, figure 1 (Chinese source)](/docs/rockchip-android-widevine-l1/images/pdf-p15-13.png)

Source technical figure: PDF page 15, figure 1 (Chinese source)

For Provisioning4.0 check System ID, not only Security Level=L1.2147483647 means no certificate: check registration, CSR upload and connectivity.8158 means liboemcrypto.so did not load correctly and L3 is running.

### 5.2 Video

ExoPlayer Demo red-box/arrow items should play over1minute. Formats depend on the SoC’s vendor/rockchip/common/vpu/etc/media_codecs_c2_rk***.xml and media_codecs_secure_rk***.xml.

![Source technical figure: PDF page 16, figure 1 (Chinese source)](/docs/rockchip-android-widevine-l1/images/pdf-p16-14.png)

Source technical figure: PDF page 16, figure 1 (Chinese source)

## 6 FAQ

### 6.1 Must registration firmware be identical?

No; same chip/platform and Android version may be used. At least Device Name, Product, CPU Make(Rockchip) and CPU Model(actual RK****) must match. The source acknowledges incomplete information; follow actual approval results. Property mapping is retained below.

### 6.2 Confirm L1 environment

DrmInfo shows L1; inspect logcat:

![Source technical figure: PDF page 17, figure 1 (Chinese source)](/docs/rockchip-android-widevine-l1/images/pdf-p17-15.png)

Source technical figure: PDF page 17, figure 1 (Chinese source)

```text
WVCdm: [cdm_engine.cpp(1089):IsSecurityLevelSupported] level = L1
...
WVCdm: [oemcrypto_adapter_dynamic.cpp(875):Initialize] OEMCrypto_Initialize Level 1 success. I will use level 1.
```

### 6.3 DrmInfo does not show L1

1. Verify L1 library integration and logs after boot/opening DrmInfo. IR4.0 and LR2.0 differ in provisioning:

```text
I/WVCdm: [oemcrypto_adapter_dynamic.cpp(885):Initialize] Level 1 Build Info
(v18): {"soc_vendor":"Rockchip","soc_model":"rk3562","ta_ver":"18.5.0+May 15 2024 14:48:28","uses_opk":true,"tee_os":"Optee","tee_os_ver":"3.13.0","form_factor":"tablet","implementer":"Rockchip","provisioning":"OEMCrypto_BootCertificateChain","is_factory_build":"false","fused":false,"is_debug":false}
```

```text
I/WVCdm: [oemcrypto_adapter_dynamic.cpp(885):Initialize] Level 1 Build Info
(v18): {"soc_vendor":"Rockchip","soc_model":"rk3562","ta_ver":"18.5.0+May 15 2024 14:48:28","uses_opk":true,"tee_os":"Optee","tee_os_ver":"3.13.0","form_factor":"tablet","implementer":"Rockchip","provisioning":"OEMCrypto_Keybox","is_factory_build":"false","fused":false,"is_debug":false}
```

2. For2.0 confirm keybox programming; for4.0 registration and network. Non-GMS must register with Widevine and upload widevine CSR; GMS checks server reachability:

```sh
ping remoteprovisioning.googleapis.com
```

Search RkpdWidevine for certificate failures.500 usually indicates registration failure or missing CSR upload. Source failure/success logs:

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

If unresolved provide boot/DrmInfo logcat and serial logs, registration data/screenshots, adb bugreport and RKP CSR. For4.0 System ID must differ from2147483647 and match registration. The source mixes “non-GMS/APFE” here; distinguish platforms using2.2.

### 6.4 Audio without image/green or corrupt frames

Record symptoms and adb bugreport; check the chip XML files in5.2 and corresponding rk*** entries.

### 6.5 Both2.0 and4.0?

Only one model per device; OEM chooses. The specification covers video-output protection, not audio. Audio-output protection is not required for Level1.

### 6.6 OEMCrypto version

The source recommends the latest available. Fromv18 new implementations require4.0; existing devices upgraded tov18+ must retain manufacturing-time provisioning. The following table is a source snapshot, not a current guarantee:

|Android|Version date|MediaDRM HIDL|CDM|OEMCrypto(new)|OEMCrypto(upgrade)|
|---|---|---|---|---|---|
|Android15.0 V+|TBD|com.google.android.widevine.nonupdatable<br>com.google.android.widevine.nonupdatable<br>com.google.android.widevine.lazy<br>udc-widevine-release|19.0.0(APEX)|19.1+|18.1|
|Android14.0 U+|2023-10|com.google.android.widevine.nonupdatable<br>com.google.android.widevine.nonupdatable<br>com.google.android.widevine.lazy|18.0.0(APEX)|18.1+|17.1|
|Android13.0 T+|2022-08|android.hardware.drm-service.widevine<br>(tm-widevine-release)|17.0.0|17.1|16.3+|
|Android12.0 S+|2021-10|android.hardware.drm@1.4<br>sc-widevine-release|16.1.0|16.3 /16.4|16.3 /16.4|
|Android11.0 R+|2020-09|android.hardware.drm@1.3<br>rvc-widevine-release|16.0.0|16.3 /16.4|15.x /16.3 /16.4|

Repeated HIDL entries and Android15 “TBD” are preserved, not updated into present-day specifications.

### 6.7 Upload timing

Upload device information before end users power on, individually or in batches; retain records for Google review.

## 7 Appendix: Android14 code environment

Confirm these repository commits; obtain missing patches from RK. Author attributions within technical commit records are preserved.

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

The source requests this manual change:

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

## 8 Appendix: official references(some require APFE)

- [Provisioning4.0](https://developers.google.com/widevine/drm/specification/provisioning-4?hl=zh-cn)
- [Provisioning4.0 options](https://developers.google.com/widevine/drm/specification/provisioning-4/options?hl=zh-cn#device_key_database_model)
- [Testing / CSR upload](https://docs.partner.android.com/gms/building/integrating/att-keys/rkp?hl=zh-cn#extract_and_upload_the_widevine_csr)
- [RKP FAQ](https://docs.partner.android.com/gms/building/integrating/att-keys/rkp-faqs?hl=zh-cn#upload-update)
- [ArmSoM](https://docs.armsom.org/)

{% endraw %}
