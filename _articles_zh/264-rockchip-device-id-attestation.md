---
title: "Rockchip Android Device ID Attestation：生产烧写与验证"
description: "Rockchip Android Device ID Attestation：生产烧写与验证 — Android / Rockchip"
excerpt: "Rockchip Android Device ID Attestation：生产烧写与验证 — Android / Rockchip"
translation_key: "264-rockchip-device-id-attestation"
slug: "264-rockchip-device-id-attestation"
lang: "zh"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

ArmSoM 开发者平台参考。来源：RK-YH-YF-780 V1.0.0。使用前需核对板卡 SoC、Android SDK/BSP、内核配置和厂商工具；原文未确认特定 ArmSoM 板卡或内核版本的适配。本次未进行 ArmSoM 硬件验证，示例和截图来自原稿，不是 ArmSoM 实测。

## 原稿适用范围

V1.0.0 列出 RK3399、RK3326、RK3562、RK3568、RK3588、RK3576，Android 14 及以上版本。SDK、TEE 和生产工具需支持对应流程。本主题仅提供中文原稿，三张原图用于全部语言。

## 1 概述

ID 认证（ID attestation）使设备能够证明序列号或 IMEI 等硬件标识符。设备身份证明能提高真正零触摸远程配置等场景的安全性，使远程端确认通信对象是目标设备而不是冒充者。

设备出厂前创建仅可信执行环境（TEE）可访问的硬件标识符副本。用户可解锁引导加载程序、修改系统软件及 Android 框架报告的标识符，但不能以这种方式操控 TEE 保存的副本。因此认证用于证明设备原始硬件标识符，阻止身份冒充。本文介绍烧写、验证及注意事项。

## 2 烧写验证

### 2.1 硬件标识符

支持的标识符如下：

1. 品牌名称：`Build.BRAND`
2. 设备名称：`Build.DEVICE`
3. 产品名称：`Build.PRODUCT`
4. 制造商名称：`Build.MANUFACTURER`
5. 型号名称：`Build.MODEL`
6. 序列号
7. 所有无线装置的 IMEI
8. 所有无线装置的 MEID

所有 Android 设备都有前六项，且它们是功能正常运行的必要元素。若设备集成手机无线装置，还必须支持其 IMEI 或 MEID 认证。每个属性最大 **32 字节**，产品属性配置和 GMS 相关信息申请均需遵守此限制。

### 2.2 烧写流程

![典型 keybox 与 ID attestation 配置流程](/docs/rockchip-device-id-attestation/images/p004-01.png)

*典型 keybox 与 ID attestation 配置流程 — 中文原稿图, p. 4.*

同一台设备通过 `RKDevInfoWriteTool` 烧写的序列号，必须与 ID attestation 中配置的序列号一致。可使用 Rockchip 相关接口定制工具。下图给出可参考的烧写流程。

![生产烧写参考流程](/docs/rockchip-device-id-attestation/images/p005-01.png)

*生产烧写参考流程 — 中文原稿图, p. 5.*

依赖关系：

- 生成 RKP CSR 需要设备序列号属性，因此先烧入序列号。
- RKP CSR 生成服务在 Android 系统正常启动后才运行。

触发 RKP CSR 生成的场景：序列号存储区从空变为已写入值；或存储的序列号与上次生成 RKP CSR 时相比发生变化。

#### 2.2.1 烧写 ID attestation

使用 `RKDevInfoTool-for-IDATTE-V1.0.0` 或 `rk_vendor_storage`。

![RKDevInfoTool ID attestation 界面](/docs/rockchip-device-id-attestation/images/p006-01.png)

*RKDevInfoTool ID attestation 界面 — 中文原稿图, p. 6.*

命令行示例如下，工具详细用法参见 `vendorstorage-tutorial`。**ID attestation 各属性只能一次性全部写入，不能分多次逐项写入。**

```text
rk_vendor_storage.exe -w -i 21 -v "rockchip;rk3562_tgo;rk3562_tgo;rockchip;rk3562_tgo;rk83991906;;;"
```

#### 2.2.2 验证 ID attestation

原稿给出两种方式。第一种是检查串口日志：

```text
write_id_attestation_to_secure_storage size=288
write id attestation : ret=0
```

第二种是运行 VTS 测试：

```sh
data/local/tmp/VtsAidlKeyMintTargetTest --gtest_filter=PerInstance/AttestKeyTest.EcdsaAttestationID/0_android_hardware_security_keymint_IKeyMintDevice_default
```

在源码目录 `hardware/interfaces/security/keymint/aidl/vts/functional` 下执行 `mm` 可生成 `VtsAidlKeyMintTargetTest`。原稿可执行路径没有前导 `/`，此处保留该写法，并拼接 PDF 拆行的参数和测试名称；执行前应核对目标设备实际路径。

为防止用户修改，写入后不允许再次修改 ID attestation。再次尝试写入会出现以下原始日志：

```text
id attestation already exsit,you cannot update it!
```

若确需修改，原稿要求使用固件烧写工具执行“擦除所有”后重新写入。这是破坏性擦除，不是普通属性更新。

## 3 附录

原稿附录只有空白的 `1.`、`2.` 两项，没有参考链接或技术内容；此处未猜测补写。

相关官方文档: [ArmSoM](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

{% endraw %}
