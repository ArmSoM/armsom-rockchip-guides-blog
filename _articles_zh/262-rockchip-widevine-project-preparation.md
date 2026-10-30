---
title: "Rockchip Android Widevine：L1 项目准备与 Keybox 流程"
description: "Rockchip Android Widevine：L1 项目准备与 Keybox 流程 — Android / Rockchip"
excerpt: "Rockchip Android Widevine：L1 项目准备与 Keybox 流程 — Android / Rockchip"
translation_key: "262-rockchip-widevine-project-preparation"
slug: "262-rockchip-widevine-project-preparation"
lang: "zh"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

ArmSoM 开发者平台参考。来源：cover V1.0 / revision table V2.0。使用前需核对板卡 SoC、Android SDK/BSP、内核配置和厂商工具；原文未确认特定 ArmSoM 板卡或内核版本的适配。本次未进行 ArmSoM 硬件验证，示例和截图来自原稿，不是 ArmSoM 实测。

## 来源版本与适用范围

这是 Rockchip Android Widevine 项目启动历史指南。封面写 V1.0，修订表列出 V2.0 及新增 Keybox 申请说明；此处保留两种版本信息，使用完整技术正文。原稿未指定 SoC、SDK 发行版或内核版本。Widevine L1 需要支持 TrustZone 的平台及相应 L1 Android SDK。本材料不代表现行许可条款、平台操作、认证结果或 ArmSoM 产品资格。仅有中文 PDF，各语言使用原图，其中部分图含英文标签。

## 1 概述

### 1.1 Widevine 简介

原稿将 Widevine 介绍为 Google 在 Android 3.0 之后推出的 DRM 数字版权管理功能。[Widevine 官网](https://www.widevine.com/) 提供产品、技术、文档、Keybox 和支持信息。原稿区分以下三个安全等级。

| 等级 | 安全引导加载程序 | 密钥配置 | 安全硬件 / TEE | Keybox 与视频密钥处理 | 视频路径 |
|---|---|---|---|---|---|
| L1 | 是 | 工厂 | 是 | 主机 CPU 不接触明文密钥 | 硬件保护的视频路径 |
| L2 | 是 | 工厂 | 是 | 主机 CPU 不接触明文密钥 | 明文视频流交给渲染器 |
| L3 | 是 | 现场 | 否 | 主机 CPU 可接触明文密钥 | 明文视频流交给解码器 |

![安全等级对照原表](/docs/rockchip-widevine-project-preparation/images/p004-01.png)

*安全等级对照原表 — 中文原稿图, p. 4.*

原稿说明因 L2 需求较少，主要提供 L1、L3。L3 为内容和 Keybox 提供基本保护，对芯片和方案无特殊要求，适合内容提供商没有特殊要求的场景。L1 使用 Rockchip TrustZone 硬件机制保护 Keybox、加解密密钥和解密后码流，适合内容提供商明确要求 TrustZone 与安全视频路径（Secure Video Path）的场景。

### 1.2 Widevine 工作流程

![Provisioning、内容与许可证工作流程](/docs/rockchip-widevine-project-preparation/images/p005-01.png)

*Provisioning、内容与许可证工作流程 — 中文原稿图, p. 5.*

1. 加密服务器将明文内容加密后存入内容库，通过标准 HTTP 服务器向客户端设备传送加密内容。
2. Provisioning Server 分发设备唯一证书。原稿将此步骤描述为非必须、用于增强安全性。设备以 Widevine Keybox 为信任根获取证书，应用使用 RSA 签名证书而非 Keybox 本身发起许可证请求。
3. 客户端向 Licence Server 请求许可证；服务器确认设备合法后返回签名并加密的许可证。设备取得许可证后才有权访问对应 DRM 内容。

## 2 Widevine L1 开发

### 2.1 项目关系

![Google、Rockchip 与设备制造商关系](/docs/rockchip-widevine-project-preparation/images/p006-01.png)

*Google、Rockchip 与设备制造商关系 — 中文原稿图, p. 6.*

关系图表示 Google 提供 Keybox、Rockchip 提供 SDK 和 Widevine 补丁，设备制造商集成两方输入。

### 2.2 项目开发流程

![L1 项目开发流程图](/docs/rockchip-widevine-project-preparation/images/p007-01.png)

*L1 项目开发流程图 — 中文原稿图, p. 7.*

1. 选择 Rockchip 平台，L1 需支持 TrustZone。
2. 获取支持 Widevine L1 的 Rockchip Android SDK。
3. 向 Widevine 商务申请，确定商务关系后申请 CDM 插件。
4. 使用 Widevine Level 1 时申请 Keybox。
5. 获取 Rockchip 相关补丁。
6. 将 Level 1 补丁及 Widevine CDM Client 集成到 SDK。
7. 开发、测试。
8. 工厂生产时完成 Keybox 烧写。

### 2.3 Keybox 申请步骤

![Keybox 申请及生产流程](/docs/rockchip-widevine-project-preparation/images/p008-01.png)

*Keybox 申请及生产流程 — 中文原稿图, p. 8.*

原图蓝色框为 OEM 负责的步骤：

1. 用公司邮箱创建 Google 账户。
2. 创建 PGP Key，原文指定 2048-bit RSA cipher key。
3. 注册 Integration Platform。
4. 登录该平台。
5. 添加设备。
6. 为 Google 白名单填写设备 Model、Make 等信息。
7. 手动生成 DeviceId 并上传。
8. 平台据此生成 Keybox。
9. 下载并校验 Keybox。
10. 在设备上测试 Widevine Level 1。
11. 设备量产 Level 1/2 出货并烧写 Keybox。

## 3 FAQ

### 3.1 Widevine_DRM_Getting_Started

厂商申请 Widevine L1 时，Google 通常提供 Getting Started 文档。原稿归纳以下参考要点：

1. 申请 Widevine CDM Client，即 Android 侧 CDM 适配插件；不同 Android 版本插件不同。
2. 申请组织专属 credentials。访问 Widevine Cloud License Services 必须使用每个组织的凭据；原稿描述通常提供一个 key，在交互流程中关联认证证书。
3. 基于 Android 集成 Widevine 产品化时，按最终应用分别报备，可能涉及服务器白名单。需要 Play Store、Gmail、YouTube 等 Google Apps 的设备联系 Android Partnership 团队；不需要 Google Apps 的 AOSP 设备联系 Widevine。
4. 历史原文说明使用产品或服务必须签订许可协议，并称 Widevine 不收取许可费用。这是来源信息，不是对现行商业或法律条款的确认。
5. 原稿引导通过 Widevine 官网咨询。

### 3.2 Widevine_DRM_Getting_Started_Device_Management

本节主要面向 AOSP；ATV 认证项目应按对应 ATV 要求执行。原稿建议 Keybox 申请超过一个月仍未完成时，可向 Rockchip 寻求协助。申请 Widevine L1 Keybox 时，Google 通常提供 Device Management 指南，流程为：

1. Widevine 通过 Integration Platform 管理设备和 Keybox。创建并注册账户，向 Widevine 提供要求的 public PGP key；账户审核通过后才能登录。
2. 创建 Google 账户后，请 Widevine 将其注册到 Integration Platform。
3. 登录 [Integration Platform](https://integration.widevine.com/)。
4. 在 Devices → Management 中执行添加设备、编辑已有设备记录、为已有设备生成 Keybox 三种操作。原文按钮拼写为 `GENERATEKEYBOXS`。

![Device Management 界面](/docs/rockchip-widevine-project-preparation/images/p011-01.png)

*Device Management 界面 — 中文原稿图, p. 11.*

### 3.3 Google 合约注意事项

原稿说明 Widevine 团队可能要求提供公司背景、人数、研发人员占比、合作品牌、未来产品方向及自有品牌情况。安全问题主要涉及密钥保护、安全启动和防刷机等，原稿提出可向 Rockchip 寻求回答协助。此外引用要求：在 Google 发出书面请求后，许可方可能需要于七（7）天内，以书面形式（含邮件）自行证明符合 Robustness Requirements。上述为历史文档描述，应以项目实际适用协议核对。

相关官方文档: [ArmSoM](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

{% endraw %}
