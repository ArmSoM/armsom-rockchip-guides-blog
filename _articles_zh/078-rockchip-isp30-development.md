---
title: "Rockchip ISP30 开发：RK3588 RkAiq 完整 API、图像处理与调试指南"
description: "完整整理 ISP30 V1.2.5：RkAiq 系统控制、AE/AWB/AF、图像处理模块、调试及 RK-RAW 数据格式，保留全部代码与参数。"
translation_key: "078-rockchip-isp30-development"
slug: "078-rockchip-isp30-development"
lang: "zh"
date: "2026-10-19"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "camera"
products: []
tags: ["Rockchip", "ISP30", "RK3588", "RkAiq", "AE", "AWB", "AF"]
keywords: "ArmSoM Rockchip RK3588 ISP30 RkAiq API"
excerpt: "完整整理 ISP30 V1.2.5：RkAiq 系统控制、AE/AWB/AF、图像处理模块、调试及 RK-RAW 数据格式，保留全部代码与参数。"
---

{% raw %}

# Rockchip ISP30 开发：RK3588 RkAiq 完整 API、图像处理与调试指南

本文为平台参考，完整保留 436 页英文 V1.2.5 原稿的技术正文（PDF 第 16–436 页），包括 RK-RAW 格式说明及最后的错误码、缩略语章节。未提供对应中文 PDF；中文和俄文均为此英文版本的完整译文。42 张技术原图全部来自英文 PDF，保留原图中已有的中文标签；其中 10 张 RAW 位布局/格式截图另恢复为可编辑表格，不以整页图片代替正文。

原稿列明 RK3588 / Linux 5.10，BuildRoot、Android 为 Y，Debian、Yocto 为 N。这是原稿当时的支持记录，不代表所有 BSP 均兼容。用于 ArmSoM 时，应先核实具体板卡的 SoC、ISP 代际、Sensor/VCM、内核、AIQ 库、IQ 文件和 SDK/BSP 分支。ArmSoM Sige7 使用 RK3588，但本文 API 和示例尚未在该板硬件上验证。所有数据及示例均属原文，不是 ArmSoM 实测；本次未执行硬件命令或摄像头/马达操作。

**原稿疑点：**重复 API 标题、混用 ISP 代际和类型、单位/默认值/日志等级及 RAW 字段说明矛盾均保留并记录，不静默修改数值或标识符。代码注释保留原文。命令和 API 可能改变摄像头或马达状态，使用前应审查并适配。

[EDITORIAL-NOTES](/docs/rockchip-isp30-development/EDITORIAL-NOTES.md) · [ArmSoM Sige7](https://docs.armsom.org/armsom-sige7) · [ArmSoM camera documentation](https://docs.armsom.org/sige-family-started) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source EN PDF p.16; unit 0 -->

## 1. 总体概述

<!-- Source EN PDF p.16; unit 1 -->

### 1.1 结构框图

<!-- Source EN PDF p.16; unit 2 -->

![英文原稿技术图 — PDF p.16](/docs/rockchip-isp30-development/assets/en-p016-X692.jpg)

<!-- Source EN PDF p.16; unit 3 -->

RK3588 VI 是视频输入模块的统称，包含：

<!-- Source EN PDF p.16; unit 4 -->

接口与数据采集部分：C/DPHY、DVP、CSI、VICAP。

<!-- Source EN PDF p.16; unit 5 -->

图像处理部分：ISP-0、ISP-1、FEC-0、FEC-1。

<!-- Source EN PDF p.16; unit 6 -->

RK3588 ISP 属于 RK ISP v3.0 版本，后续文档中以 ISP30 标识。

<!-- Source EN PDF p.16; unit 7 -->

### 1.2 工作模式

<!-- Source EN PDF p.16; unit 8 -->

单 ISP、单 CIS（CMOS 图像传感器）：

<!-- Source EN PDF p.16; unit 9 -->

RAW 直通/在线模式：框图中的蓝色箭头表示数据流路径 1.0。

<!-- Source EN PDF p.16; unit 10 -->

Raw 回读/离线模式：框图中的橙色箭头表示数据流路径 1.1、1.2。

<!-- Source EN PDF p.16; unit 11 -->

单 CIS 的双 ISP 2-in-1 模式：

<!-- Source EN PDF p.16; unit 12 -->

2-in-1 模式支持 ISP-0/ISP-1 分别处理单个 CIS 图像的左、右部分，以支持大分辨率 CIS。

<!-- Source EN PDF p.16; unit 13 -->

多 CIS：

<!-- Source EN PDF p.17; unit 14 -->

单 ISP 采用 Raw 回读/离线模式，可通过时分复用支持多 CIS 输入。

<!-- Source EN PDF p.17; unit 15 -->

### 1.3 性能与约束概述

<!-- Source EN PDF p.17; unit 16 -->

支持的分辨率与吞吐量：

<!-- Source EN PDF p.17; unit 17 -->

| 工作模式 | 吞吐量 | 最大分辨率 | 支持的最小分辨率 |
|---|---|---|---|
| 单 ISP、单 CIS | 16Mega@30fps | 4672x3504 | 208x128 |
| 双 ISP 2-in-1、单 CIS | 32Mega@30fps | 8064x6048 | \ |

<!-- Source EN PDF p.17; unit 18 -->

支持 Raw12 数据输入。

<!-- Source EN PDF p.17; unit 19 -->

ISP30 支持处理 Raw12 数据。Raw14 输入会丢弃低位后按 Raw12 处理；位宽不足 12 位的图像数据会补齐低位后按 Raw12 处理。

<!-- Source EN PDF p.17; unit 20 -->

支持 Bayer 彩色 CIS 与 Mono 单色 CIS。

<!-- Source EN PDF p.17; unit 21 -->

支持三帧合一 HDR，支持的 HDR CIS 类型如下：

<!-- Source EN PDF p.17; unit 22 -->

| 多曝光 HDR | RK 平台支持情况 | CIS | 应用 |
|---|---|---|---|
| Sequential / Framebase HDR（顺序/帧式） | ISP20：RV1109/RV1126 等；ISP21：RK356X 等；ISP30：RK3588；ISP32：RV1106 | OV4689 | IPC/CVR |
| Staggered / DOL HDR（交错） | ISP20：RV1109/RV1126 等；ISP21：RK356X 等；ISP30：RK3588；ISP32：RV1106 | OS04A10 IMX464 AR0239 | IPC/CVR |
| DCG HDR | ISP20：RV1109/RV1126 等；ISP21：RK356X 等；ISP30：RK3588；ISP32：RV1106 | OS04A10 IMX585 | IPC/CVR |
| SME HDR | N | IMX378 | 消费类 |
| BME HDR | N | IMX258 | 消费类 |
| QBC HDR | N | OV50C40 IMX586 | 消费类 |
| 横向溢出 HDR | N | AR0821 | IPC |
| Splite-diode pixel HDR（原文拼写） | N | OV10640 | CVR |

<!-- Source EN PDF p.17; unit 23 -->

Raw 直通/在线模式中，ISP30 数据输出到 DDR 通知阶段的最低延迟约为图像帧传输时间/15。

<!-- Source EN PDF p.18; unit 24 -->

在 ISP 时分复用模式下，单个 ISP 最多支持四路数据源输入。

<!-- Source EN PDF p.18; unit 25 -->

RAW 直通/在线模式下，最小帧消隐为 136 行，最小行消隐为 16 像素。

<!-- Source EN PDF p.18; unit 26 -->

CSM 模块不支持 YUV 限幅范围转换，详见 IMGPROC/CSM 模块 API 说明。

<!-- Source EN PDF p.18; unit 27 -->

## 2. 概述

<!-- Source EN PDF p.18; unit 28 -->

ISP30 包含一系列图像处理算法模块，主要包括暗电流校正、坏点校正、3A、HDR、镜头阴影校正、镜头畸变校正、3DLUT、降噪（RAW 域降噪、多帧降噪、色彩降噪等）和锐化等。

<!-- Source EN PDF p.18; unit 29 -->

ISP30 包括硬件算法实现与软件逻辑控制两部分，RkAiq 是软件逻辑控制部分的实现。

<!-- Source EN PDF p.18; unit 30 -->

RkAiq 软件模块从 ISP 驱动获取图像统计数据，结合 IQ Tuning 参数，通过一系列算法计算新的 ISP、Sensor 等硬件参数，并不断迭代以获得最佳图像效果。

<!-- Source EN PDF p.18; unit 31 -->

### 2.1 功能说明

<!-- Source EN PDF p.18; unit 32 -->

![英文原稿技术图 — PDF p.18](/docs/rockchip-isp30-development/assets/en-p018-X701.png)

<!-- Source EN PDF p.18; unit 33 -->

图 1-1 ISP21 系统框图（原文标注）

<!-- Source EN PDF p.18; unit 34 -->

ISP30 软硬件总体框图见图 1-1。传感器向 ISP HW 输出数据流，ISP 经一系列图像处理算法后输出图像。RkAiq 持续从 ISP HW 获取统计数据，通过 3A 等算法生成新参数并反馈到各硬件模块。Tuning 工具支持实时在线调参，调试后可保存并生成新的 IQ 参数文件。

<!-- Source EN PDF p.19; unit 35 -->

### 2.2 RkAiq 架构

<!-- Source EN PDF p.19; unit 36 -->

![英文原稿技术图 — PDF p.19](/docs/rockchip-isp30-development/assets/en-p019-X706.png)

<!-- Source EN PDF p.19; unit 37 -->

图 1-2 RkAiq 总体架构图

<!-- Source EN PDF p.19; unit 38 -->

1\. ISP30 RkAiq 的软件设计思路见图 1-2，主要分为以下四部分：

<!-- Source EN PDF p.19; unit 39 -->

1\. RkAiq lib 动态库：包含主要逻辑，负责从驱动获取统计数据并传递给各算法库。

<!-- Source EN PDF p.19; unit 40 -->

2\. Integrated algo libs：RK 提供的静态算法库默认注册到 RkAiq lib 动态库中。

<!-- Source EN PDF p.19; unit 41 -->

3\. customer 3A libs：客户可按算法库接口定义实现自有 3A 或其他算法库。向 RkAiq lib 注册自定义算法库后，可通过所提供的接口选择运行自定义库或 RK 库。

<!-- Source EN PDF p.19; unit 42 -->

4\. IQ file：IQ 调优结果文件保存算法相关参数及 CIS 等系统静态参数。

<!-- Source EN PDF p.20; unit 43 -->

### 2.3 软件架构

<!-- Source EN PDF p.20; unit 44 -->

![英文原稿技术图 — PDF p.20](/docs/rockchip-isp30-development/assets/en-p020-X710.png)

<!-- Source EN PDF p.20; unit 45 -->

图 1-3 软件架构框图

<!-- Source EN PDF p.20; unit 46 -->

ISP30 软件框图见图 1-3，主要分为以下三层：

<!-- Source EN PDF p.20; unit 47 -->

1\. kernel 层：包含摄像头系统所有硬件驱动，主要为 ISP、sensor、VCM、flashlight、IrCutter 等驱动，基于 V4L2 和 Media 框架。

<!-- Source EN PDF p.20; unit 48 -->

2\. framework 层：RkAiq lib 的集成层，支持两种集成方式：

<!-- Source EN PDF p.20; unit 49 -->

IspServer 模式：Rkaiq lib 运行在独立 IspServer 进程中，客户端通过 dbus 与其通信。此方式还可在不修改源代码的情况下，向 v4L-CTL 等现有第三方应用提供经 ISP 调试效果处理的图像。

<!-- Source EN PDF p.20; unit 50 -->

直接集成：RkAiq lib 可直接集成到应用程序中。

<!-- Source EN PDF p.20; unit 51 -->

3\. user 层：用户应用层。

<!-- Source EN PDF p.21; unit 52 -->

### 2.4 软件流程

<!-- Source EN PDF p.22; unit 53 -->

![英文原稿技术图 — PDF p.22](/docs/rockchip-isp30-development/assets/en-p022-X717.png)

<!-- Source EN PDF p.23; unit 54 -->

图 1-4 流程图

<!-- Source EN PDF p.23; unit 55 -->

RkAiq 接口调用流程见图 1-4。虚线框部分可选，蓝色文字表示应用需配合 RkAiq 流程使用的配置。

<!-- Source EN PDF p.23; unit 56 -->

configure media pipeline：可选配置 ISP30 链路，如 sensor 输出分辨率，驱动已有默认配置。rk_aiq_uapi2_sysctl_init：初始化 RkAiq，包括 IQ 调优参数及各算法库。other Aiq or algo params uapis：可选通过各算法 API 设置所需参数，注册第三方算法库。rk_aiq_uapi2_sysctl_prepare：准备各算法库与硬件模块的初始参数，并设置到驱动。

<!-- Source EN PDF p.23; unit 57 -->

video capture start：为应用开启 ISP 数据流，必须在 rk_aiq_uapi2_sysctl_prepare 之后调用。

<!-- Source EN PDF p.23; unit 58 -->

rk_aiq_uapi2_sysctl_start：启动 RkAiq 内部流程。调用成功后，sensor 开始输出数据，ISP 开始处理并输出图像。

<!-- Source EN PDF p.23; unit 59 -->

Rkaiq running：持续获取 ISP 驱动统计数据，调用 3A 等算法计算新参数并应用到驱动。PC Online Tuning Tool：PC 可通过 Tuning Tool 在线调参。video capture stop：停止 RkAiq 之前须先停止数据流。rk_aiq_uapi2_sysctl_stop：停止 RkAiq 运行流程；可调整参数后重新启动，也可直接重新启动。

<!-- Source EN PDF p.23; unit 60 -->

rk_aiq_uapi2_sysctl_deinit：反初始化 RkAiq。

<!-- Source EN PDF p.23; unit 61 -->

### 2.5 API 说明

<!-- Source EN PDF p.23; unit 62 -->

RKAiq 提供功能级 API 和模块级 API 两个层级。

<!-- Source EN PDF p.23; unit 63 -->

功能级 API：封装模块级 API，主要面向产品应用，对模块进行简单的功能设置。

<!-- Source EN PDF p.23; unit 64 -->

模块级 API：对模块进行详细参数设置与查询，不按功能再划分 API。

<!-- Source EN PDF p.23; unit 65 -->

RKAiq 模块级 API 支持同步和异步模式；功能级 API 默认封装模块级 API 的同步模式。

<!-- Source EN PDF p.23; unit 66 -->

同步模式（Sync）：阻塞式 API。AIQ 基本以视频帧为粒度更新参数；同步模式下，调用线程可能阻塞的时间 &lt;= 视频帧周期。

<!-- Source EN PDF p.23; unit 67 -->

异步模式（ASync）：非阻塞式 API。AIQ 框架将设置参数存入内部参数缓冲区，并在相应时刻将最新 ISP 参数配置到硬件。

<!-- Source EN PDF p.23; unit 68 -->

模块级 API 同步/异步模式使用说明

<!-- Source EN PDF p.23; unit 69 -->

模块级 API 的第二个参数通常是设置参数的集合，称为属性结构体。其中的 rk_aiq_uapi_sync_t 成员可配置当前 API 的调用模式，详见以下数据类型：

<!-- Source EN PDF p.24; unit 70 -->

#### 2.5.1  rk_aiq_uapi_sync_t

<!-- Source EN PDF p.24; unit 71 -->

【说明】模块同步模式

<!-- Source EN PDF p.24; unit 72 -->

【定义】

<!-- Source EN PDF p.24; unit 73 -->

```text
 typedef struct rk_aiq_uapi_sync_s {
     rk_aiq_uapi_mode_sync_e     sync_mode;
     bool                        done;
 } rk_aiq_uapi_sync_t;
```

<!-- Source EN PDF p.24; unit 74 -->

【成员】

<!-- Source EN PDF p.24; unit 75 -->

| 成员名称 | 说明 |
|---|---|
| sync_mode | @setAttrib：参数更新模式标志；RK_AIQ_UAPI_MODE_DEFAULT 默认同步；RK_AIQ_UAPI_MODE_SYNC 为同步；RK_AIQ_UAPI_MODE_ASYNC 为异步。@getAttrib：RK_AIQ_UAPI_MODE_DEFAULT 默认获取最后设置的属性（sync_mode == RK_AIQ_UAPI_MODE_ASYNC），该属性可能尚未生效；RK_AIQ_UAPI_MODE_SYNC 获取当前实际使用的属性；RK_AIQ_UAPI_MODE_ASYNC 与 RK_AIQ_UAPI_MODE_DEFAULT 相同。 |
| done | @done（parsm out，原文拼写）：参数更新状态标志，true 表示参数已更新，false 表示尚未更新。 |

<!-- Source EN PDF p.24; unit 76 -->

AIQ API 参考代码按模块组织，分别提供 API 示例，建议直接参考这些示例。

<!-- Source EN PDF p.24; unit 77 -->

rkisp_demo/demo/sample

<!-- Source EN PDF p.25; unit 78 -->

| 文件名 | 模块 |
|---|---|
| sample_3dlut_module.cpp | 3DLUT |
| sample_ccm_module.cpp | CCM |
| sample_csm_module.cpp | CSM |
| sample_ablc_module.cpp | BLC |
| sample_abayer2dnr_module.cpp | BayerNR 2D |
| sample_abayertnr_module.cpp | BayerNR 3D |
| sample_aynr_module.cpp | YNR |
| sample_acnr_module.cpp | CNR |
| sample_asharp_module.cpp | Sharp |
| sample_amerge_module.cpp | Merge(HDR) |
| sample_adrc_module.cpp | DRC |
| sample_adehaze_module.cpp | 去雾与增强 |
| sample_agamma_module.cpp | Gamma |
| sample_awb_module.cpp | AWB |
| sample_ae_module.cpp | AE |
| sample_af_module.cpp | AF |

<!-- Source EN PDF p.25; unit 79 -->

## 3. 系统控制

<!-- Source EN PDF p.25; unit 80 -->

### 3.1 功能概述

<!-- Source EN PDF p.25; unit 81 -->

系统控制部分包括 AIQ 公共属性配置、初始化、运行、退出及 AIQ 模块设置等功能。

<!-- Source EN PDF p.25; unit 82 -->

### 3.2 API 参考

<!-- Source EN PDF p.25; unit 83 -->

#### 3.2.1  rk_aiq_uapi2_sysctl_preInit

<!-- Source EN PDF p.25; unit 84 -->

【说明】初始化 AIQ 前预设参数，例如所使用的 IQ 文件。

<!-- Source EN PDF p.25; unit 85 -->

【语法】

<!-- Source EN PDF p.26; unit 86 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_preInit (const char* sns_ent_name,
                          rk_aiq_working_mode_t mode,
                          const char* force_iq_file);
```

<!-- Source EN PDF p.26; unit 87 -->

【参数】

<!-- Source EN PDF p.26; unit 88 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sns_ent_name | sensor 实体名称 | 输入 |
| mode | ISP 工作模式 | 输入 |
| force_iq_file | 强制指定的 iq 文件 | 输入 |

<!-- Source EN PDF p.26; unit 89 -->

【返回值】

<!-- Source EN PDF p.26; unit 90 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.26; unit 91 -->

【依赖】

<!-- Source EN PDF p.26; unit 92 -->

头文件：rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.26; unit 93 -->

库文件：librkaiq.so

<!-- Source EN PDF p.26; unit 94 -->

【注意】

<!-- Source EN PDF p.26; unit 95 -->

应先于 rk_aiq_uapi2_sysctl_init 调用。

<!-- Source EN PDF p.26; unit 96 -->

mode 仅用于选择 IQ 文件，不配置 ISP 工作模式；工作模式需在 rk_aiq_uapi2_sysctl_prepare 中配置。force_iq_file 非空时，mode 无效。

<!-- Source EN PDF p.26; unit 97 -->

force_iq_file 参数为完整路径。

<!-- Source EN PDF p.26; unit 98 -->

此函数并非必需，仅用于在 rk_aiq_uapi2_sysctl_init 前修改部分默认设置。

<!-- Source EN PDF p.26; unit 99 -->

#### 3.2.2  rk_aiq_uapi2_sysctl_preInit_scene

<!-- Source EN PDF p.26; unit 100 -->

【说明】初始化 AIQ 前选择 IQ 场景参数。

<!-- Source EN PDF p.26; unit 101 -->

【语法】

<!-- Source EN PDF p.26; unit 102 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_preInit_scene (const char* sns_ent_name,
                          const char *main_scene,
                         const char *sub_scene);
```

<!-- Source EN PDF p.26; unit 103 -->

【参数】

<!-- Source EN PDF p.27; unit 104 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sns_ent_name | sensor 实体名称 | 输入 |
| main_scene | 主场景，取值在 IQ 文件中定义。 | 输入 |
| sub_scene | 子场景，取值在 IQ 文件中定义。 | 输入 |

<!-- Source EN PDF p.27; unit 105 -->

【返回值】

<!-- Source EN PDF p.27; unit 106 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.27; unit 107 -->

【依赖】

<!-- Source EN PDF p.27; unit 108 -->

头文件：rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.27; unit 109 -->

库文件：librkaiq.so

<!-- Source EN PDF p.27; unit 110 -->

【注意】

<!-- Source EN PDF p.27; unit 111 -->

应先于 rk_aiq_uapi2_sysctl_init 调用。

<!-- Source EN PDF p.27; unit 112 -->

main_scene 应根据 IQ 文件的主场景数组选择，默认通常为 "normal"。

<!-- Source EN PDF p.27; unit 113 -->

sub_scene 应根据 IQ 文件中所选主场景的子场景数组选择，默认通常为 "day"。

<!-- Source EN PDF p.27; unit 114 -->

默认场景为 normal-day。要运行 hdr-day 或其他自定义模式，需调用此函数指定，否则 IQ 参数可能不正确。

<!-- Source EN PDF p.27; unit 115 -->

#### 3.2.3  rk_aiq_uapi2_sysctl_switch_scene

<!-- Source EN PDF p.27; unit 116 -->

【说明】初始化 AIQ 后切换 IQ 场景参数。

<!-- Source EN PDF p.27; unit 117 -->

【语法】

<!-- Source EN PDF p.27; unit 118 -->

```text
 int
 rk_aiq_uapi2_sysctl_switch_scene (const rk_aiq_sys_ctx_t* sys_ctx,
                          const char *main_scene,
                         const char *sub_scene);
```

<!-- Source EN PDF p.27; unit 119 -->

【参数】

<!-- Source EN PDF p.27; unit 120 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| main_scene | 主场景，取值在 IQ 文件中定义。 | 输入 |
| sub_scene | 子场景，取值在 IQ 文件中定义。 | 输入 |

<!-- Source EN PDF p.28; unit 121 -->

【返回值】

<!-- Source EN PDF p.28; unit 122 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.28; unit 123 -->

【依赖】

<!-- Source EN PDF p.28; unit 124 -->

头文件：rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.28; unit 125 -->

库文件：librkaiq.so

<!-- Source EN PDF p.28; unit 126 -->

【注意】

<!-- Source EN PDF p.28; unit 127 -->

在 rk_aiq_uapi2_sysctl_init 之后调用。

<!-- Source EN PDF p.28; unit 128 -->

main_scene 应从 IQ 文件中的主场景数组选择。

<!-- Source EN PDF p.28; unit 129 -->

sub_scene 应从 IQ 文件中所选主场景的子场景数组选择。

<!-- Source EN PDF p.28; unit 130 -->

此接口涉及 IQ 动态切换，目前测试不足，可能产生意外结果，须谨慎使用。

<!-- Source EN PDF p.28; unit 131 -->

#### 3.2.4  rk_aiq_uapi2_sysctl_init

<!-- Source EN PDF p.28; unit 132 -->

【说明】初始化 AIQ 上下文。

<!-- Source EN PDF p.28; unit 133 -->

【语法】

<!-- Source EN PDF p.28; unit 134 -->

```text
 rk_aiq_sys_ctx_t*
 rk_aiq_uapi2_sysctl_init (const char* sns_ent_name,
                          const char* iq_file_dir,
                          rk_aiq_error_cb err_cb,
                          rk_aiq_metas_cb metas_cb);
```

<!-- Source EN PDF p.28; unit 135 -->

【参数】

<!-- Source EN PDF p.28; unit 136 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sns_ent_name | sensor 实体名称 | 输入 |
| iq_file_dir | 校准参数文件路径 | 输入 |
| err_cb | 错误回调函数，可为 NULL。 | 输入 |
| metas_cb | 元数据回调函数，可为 NULL。 | 输入 |

<!-- Source EN PDF p.28; unit 137 -->

【返回值】

<!-- Source EN PDF p.28; unit 138 -->

| 返回值 | 说明 |
|---|---|
| rk_aiq_sys_ctx_t* | AIQ 上下文指针 |

<!-- Source EN PDF p.29; unit 139 -->

【依赖】

<!-- Source EN PDF p.29; unit 140 -->

头文件：rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.29; unit 141 -->

库文件：librkaiq.so

<!-- Source EN PDF p.29; unit 142 -->

【注意】

<!-- Source EN PDF p.29; unit 143 -->

应先于其他函数调用。

<!-- Source EN PDF p.29; unit 144 -->

#### 3.2.5  rk_aiq_uapi2_sysctl_deinit

<!-- Source EN PDF p.29; unit 145 -->

【说明】反初始化 AIQ 上下文。

<!-- Source EN PDF p.29; unit 146 -->

【语法】

<!-- Source EN PDF p.29; unit 147 -->

```text
 void
 rk_aiq_uapi2_sysctl_deinit( rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.29; unit 148 -->

【参数】

<!-- Source EN PDF p.29; unit 149 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |

<!-- Source EN PDF p.29; unit 150 -->

【返回值】

<!-- Source EN PDF p.29; unit 151 -->

| 返回值 | 说明 |
|---|---|
| 无 | 无 |

<!-- Source EN PDF p.29; unit 152 -->

【依赖】

<!-- Source EN PDF p.29; unit 153 -->

头文件：rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.29; unit 154 -->

库文件：librkaiq.so

<!-- Source EN PDF p.29; unit 155 -->

【注意】

<!-- Source EN PDF p.29; unit 156 -->

AIQ 处于 start 状态时不得调用。

<!-- Source EN PDF p.29; unit 157 -->

#### 3.2.6  rk_aiq_uapi2_sysctl_prepare

<!-- Source EN PDF p.29; unit 158 -->

【说明】准备 AIQ 运行环境。

<!-- Source EN PDF p.29; unit 159 -->

【语法】

<!-- Source EN PDF p.29; unit 160 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_prepare(const rk_aiq_sys_ctx_t* ctx,
                            uint32_t  width,
                            uint32_t  height,
                            rk_aiq_working_mode_t mode);
```

<!-- Source EN PDF p.30; unit 161 -->

【参数】

<!-- Source EN PDF p.30; unit 162 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| width | sensor 输出分辨率的宽度，仅用于校验。 | 输入 |
| height | sensor 输出分辨率的高度，仅用于校验。 | 输入 |
| mode | ISP Pipeline 工作模式（NORMAL/HDR）。 | 输入 |

<!-- Source EN PDF p.30; unit 163 -->

【返回值】

<!-- Source EN PDF p.30; unit 164 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.30; unit 165 -->

【依赖】

<!-- Source EN PDF p.30; unit 166 -->

头文件：rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.30; unit 167 -->

库文件：librkaiq.so

<!-- Source EN PDF p.30; unit 168 -->

【注意】

<!-- Source EN PDF p.30; unit 169 -->

应在 rk_aiq_uapi2_sysctl_start 之前调用。

<!-- Source EN PDF p.30; unit 170 -->

若需在 rk_aiq_uapi2_sysctl_start 之后调用，应先调用 rk_aiq_uapi2_sysctl_stop，再调用 rk_aiq_uapi2_sysctl_prepare 重新准备运行环境。

<!-- Source EN PDF p.30; unit 171 -->

#### 3.2.7  rk_aiq_uapi2_sysctl_start

<!-- Source EN PDF p.30; unit 172 -->

【说明】启动 AIQ 控制系统。启动后持续从 ISP 驱动获取 3A 统计数据，运行 3A 算法，并应用计算得到的新参数。

<!-- Source EN PDF p.30; unit 173 -->

【语法】

<!-- Source EN PDF p.30; unit 174 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_start(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.30; unit 175 -->

【参数】

<!-- Source EN PDF p.30; unit 176 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |

<!-- Source EN PDF p.30; unit 177 -->

【返回值】

<!-- Source EN PDF p.31; unit 178 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.31; unit 179 -->

【依赖】

<!-- Source EN PDF p.31; unit 180 -->

头文件：rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.31; unit 181 -->

库文件：librkaiq.so

<!-- Source EN PDF p.31; unit 182 -->

【注意】

<!-- Source EN PDF p.31; unit 183 -->

应在 rk_aiq_uapi2_sysctl_prepare 之后调用。

<!-- Source EN PDF p.31; unit 184 -->

#### 3.2.8  rk_aiq_uapi2_sysctl_stop

<!-- Source EN PDF p.31; unit 185 -->

【说明】停止 AIQ 控制系统。

<!-- Source EN PDF p.31; unit 186 -->

【语法】

<!-- Source EN PDF p.31; unit 187 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_stop(const rk_aiq_sys_ctx_t* ctx, bool keep_ext_hw_st);
```

<!-- Source EN PDF p.31; unit 188 -->

【参数】

<!-- Source EN PDF p.31; unit 189 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| keep_ext_hw_st | 停止后，是否保持 ircut/cpsl 等外部设备的状态不变。 | 输入 |

<!-- Source EN PDF p.31; unit 190 -->

【返回值】

<!-- Source EN PDF p.31; unit 191 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.31; unit 192 -->

【依赖】

<!-- Source EN PDF p.31; unit 193 -->

头文件：rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.31; unit 194 -->

库文件：librkaiq.so

<!-- Source EN PDF p.32; unit 195 -->

#### 3.2.9  rk_aiq_uapi2_sysctl_getStaticMetas

<!-- Source EN PDF p.32; unit 196 -->

【说明】查询 sensor 对应的分辨率、数据格式等静态信息。

<!-- Source EN PDF p.32; unit 197 -->

【语法】

<!-- Source EN PDF p.32; unit 198 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_getStaticMetas(const char* sns_ent_name,
 rk_aiq_static_info_t* static_info);
```

<!-- Source EN PDF p.32; unit 199 -->

【参数】

<!-- Source EN PDF p.32; unit 200 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sns_ent_name | sensor 实体名称 | 输入 |
| static_info | 静态信息结构体指针 | 输出 |

<!-- Source EN PDF p.32; unit 201 -->

【返回值】

<!-- Source EN PDF p.32; unit 202 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.32; unit 203 -->

【依赖】

<!-- Source EN PDF p.32; unit 204 -->

头文件：rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.32; unit 205 -->

库文件：librkaiq.so

<!-- Source EN PDF p.32; unit 206 -->

#### 3.2.10  rk_aiq_uapi2_sysctl_enumStaticMetas

<!-- Source EN PDF p.32; unit 207 -->

【说明】枚举 AIQ 获取到的静态信息。

<!-- Source EN PDF p.32; unit 208 -->

【语法】

<!-- Source EN PDF p.32; unit 209 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_enumStaticMetas(int index, rk_aiq_static_info_t*
 static_info);
```

<!-- Source EN PDF p.32; unit 210 -->

【参数】

<!-- Source EN PDF p.32; unit 211 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| index | 索引号，从 0 开始。 | 输入 |
| static_info | 静态信息结构体指针 | 输出 |

<!-- Source EN PDF p.32; unit 212 -->

【返回值】

<!-- Source EN PDF p.33; unit 213 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.33; unit 214 -->

【依赖】

<!-- Source EN PDF p.33; unit 215 -->

头文件：rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.33; unit 216 -->

库文件：librkaiq.so

<!-- Source EN PDF p.33; unit 217 -->

#### 3.2.11  rk_aiq_uapi2_sysctl_enableAxlib

<!-- Source EN PDF p.33; unit 218 -->

【说明】设置自定义算法库的运行状态。

<!-- Source EN PDF p.33; unit 219 -->

【语法】

<!-- Source EN PDF p.33; unit 220 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_enableAxlib(const rk_aiq_sys_ctx_t* ctx,
                                const int algo_type,
                                const int lib_id,
                                bool enable);
```

<!-- Source EN PDF p.33; unit 221 -->

【参数】

<!-- Source EN PDF p.33; unit 222 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| algo_type | 待操作的算法模块类型。 | 输入 |
| lib_id | 算法库标识 ID | 输入 |
| enable | 状态设置 | 输入 |

<!-- Source EN PDF p.33; unit 223 -->

【返回值】

<!-- Source EN PDF p.33; unit 224 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.33; unit 225 -->

【依赖】

<!-- Source EN PDF p.33; unit 226 -->

头文件：rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.33; unit 227 -->

库文件：librkaiq.so

<!-- Source EN PDF p.33; unit 228 -->

【注意】

<!-- Source EN PDF p.33; unit 229 -->

若 lib_id 与当前运行的算法库相同，除未初始化状态外，任何状态均可调用。

<!-- Source EN PDF p.34; unit 230 -->

其他情况下仅能在 prepared 状态调用，并以 lib_id 标识的新算法库替换 algo_type 标识的算法库。

<!-- Source EN PDF p.34; unit 231 -->

#### 3.2.12  rk_aiq_uapi2_sysctl_getAxlibStatus

<!-- Source EN PDF p.34; unit 232 -->

【说明】获取算法库状态。

<!-- Source EN PDF p.34; unit 233 -->

【语法】

<!-- Source EN PDF p.34; unit 234 -->

```text
 bool
 rk_aiq_uapi2_sysctl_getAxlibStatus(const rk_aiq_sys_ctx_t* ctx,
                                   const int algo_type,
                                   const int lib_id);
```

<!-- Source EN PDF p.34; unit 235 -->

【参数】

<!-- Source EN PDF p.34; unit 236 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| algo_type | 待操作的算法模块类型。 | 输入 |
| lib_id | 算法库标识 ID | 输入 |

<!-- Source EN PDF p.34; unit 237 -->

【返回值】

<!-- Source EN PDF p.34; unit 238 -->

| 返回值 | 说明 |
|---|---|
| false | 关闭状态 |
| true | 开启状态 |

<!-- Source EN PDF p.34; unit 239 -->

【依赖】

<!-- Source EN PDF p.34; unit 240 -->

头文件：rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.34; unit 241 -->

库文件：librkaiq.so

<!-- Source EN PDF p.34; unit 242 -->

#### 3.2.13  rk_aiq_uapi2_sysctl_getEnabledAxlibCtx

<!-- Source EN PDF p.34; unit 243 -->

【说明】获取已启用算法库的上下文结构体。

<!-- Source EN PDF p.34; unit 244 -->

【语法】

<!-- Source EN PDF p.34; unit 245 -->

```text
 const RkAiqAlgoContext*
 rk_aiq_uapi2_sysctl_getEnabledAxlibCtx(const rk_aiq_sys_ctx_t* ctx, const int
 algo_type);
```

<!-- Source EN PDF p.34; unit 246 -->

【参数】

<!-- Source EN PDF p.35; unit 247 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| algo_type | 待操作的算法模块类型。 | 输入 |

<!-- Source EN PDF p.35; unit 248 -->

【返回值】

<!-- Source EN PDF p.35; unit 249 -->

| 返回值 | 说明 |
|---|---|
| NULL | 获取失败 |
| Non-NULL | 获取成功 |

<!-- Source EN PDF p.35; unit 250 -->

【依赖】

<!-- Source EN PDF p.35; unit 251 -->

头文件：rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.35; unit 252 -->

库文件：librkaiq.so

<!-- Source EN PDF p.35; unit 253 -->

【注意】

<!-- Source EN PDF p.35; unit 254 -->

返回的算法上下文结构体供内部私有函数使用。对于用户自定义算法库，应在 rk_aiq_uapi2_sysctl_enableAxlib 后调用，否则返回 NULL。

<!-- Source EN PDF p.35; unit 255 -->

#### 3.2.14  rk_aiq_uapi2_sysctl_setCpsLtCfg

<!-- Source EN PDF p.35; unit 256 -->

【说明】设置补光控制信息。

<!-- Source EN PDF p.35; unit 257 -->

【语法】

<!-- Source EN PDF p.35; unit 258 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_setCpsLtCfg(const rk_aiq_sys_ctx_t* ctx,
                        rk_aiq_cpsl_cfg_t* cfg);
```

<!-- Source EN PDF p.35; unit 259 -->

【参数】

<!-- Source EN PDF p.35; unit 260 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| cfg | 补光配置结构体指针 | 输入 |

<!-- Source EN PDF p.35; unit 261 -->

【返回值】

<!-- Source EN PDF p.35; unit 262 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.35; unit 263 -->

【依赖】

<!-- Source EN PDF p.36; unit 264 -->

头文件：rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.36; unit 265 -->

库文件：librkaiq.so

<!-- Source EN PDF p.36; unit 266 -->

#### 3.2.15  rk_aiq_uapi2_sysctl_getCpsLtInfo

<!-- Source EN PDF p.36; unit 267 -->

【说明】获取补光控制信息。

<!-- Source EN PDF p.36; unit 268 -->

【语法】

<!-- Source EN PDF p.36; unit 269 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_getCpsLtInfo(const rk_aiq_sys_ctx_t* ctx,
                        rk_aiq_cpsl_info_t* info);
```

<!-- Source EN PDF p.36; unit 270 -->

【参数】

<!-- Source EN PDF p.36; unit 271 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| info | 补光配置结构体指针 | 输出 |

<!-- Source EN PDF p.36; unit 272 -->

【返回值】

<!-- Source EN PDF p.36; unit 273 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.36; unit 274 -->

【依赖】

<!-- Source EN PDF p.36; unit 275 -->

头文件：rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.36; unit 276 -->

库文件：librkaiq.so

<!-- Source EN PDF p.36; unit 277 -->

#### 3.2.16  rk_aiq_uapi2_sysctl_queryCpsLtCap

<!-- Source EN PDF p.36; unit 278 -->

【说明】查询补光能力。

<!-- Source EN PDF p.36; unit 279 -->

【语法】

<!-- Source EN PDF p.36; unit 280 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_queryCpsLtCap(const rk_aiq_sys_ctx_t* ctx,
                        rk_aiq_cpsl_cap_t* cap);
```

<!-- Source EN PDF p.36; unit 281 -->

【参数】

<!-- Source EN PDF p.37; unit 282 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| cap | 用于查询补光支持能力的结构体指针。 | 输出 |

<!-- Source EN PDF p.37; unit 283 -->

【返回值】

<!-- Source EN PDF p.37; unit 284 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.37; unit 285 -->

【依赖】

<!-- Source EN PDF p.37; unit 286 -->

头文件：rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.37; unit 287 -->

库文件：librkaiq.so

<!-- Source EN PDF p.37; unit 288 -->

#### 3.2.17  rk_aiq_uapi2_sysctl_getBindedSnsEntNmByVd

<!-- Source EN PDF p.37; unit 289 -->

【说明】查询视频节点对应的 sensor 实体名称。

<!-- Source EN PDF p.37; unit 290 -->

【语法】

<!-- Source EN PDF p.37; unit 291 -->

```text
 const char* rk_aiq_uapi2_sysctl_getBindedSnsEntNmByVd(const char* vd);
```

<!-- Source EN PDF p.37; unit 292 -->

【参数】

<!-- Source EN PDF p.37; unit 293 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| vd | 视频设备路径，例如 /dev/video20 | 输入 |

<!-- Source EN PDF p.37; unit 294 -->

【返回值】

<!-- Source EN PDF p.37; unit 295 -->

| 返回值 | 说明 |
|---|---|
| sensor 实体名称 | 字符串指针 |

<!-- Source EN PDF p.37; unit 296 -->

【注意】

<!-- Source EN PDF p.37; unit 297 -->

参数必须是 ISPP scale 节点路径。

<!-- Source EN PDF p.37; unit 298 -->

【依赖】

<!-- Source EN PDF p.37; unit 299 -->

头文件：rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.37; unit 300 -->

库文件：librkaiq.so

<!-- Source EN PDF p.38; unit 301 -->

#### 3.2.18  rk_aiq_uapi2_sysctl_updateIq

<!-- Source EN PDF p.38; unit 302 -->

【说明】不停止数据流，动态更新当前使用的 IQ 参数文件。

<!-- Source EN PDF p.38; unit 303 -->

【语法】

<!-- Source EN PDF p.38; unit 304 -->

```text
 XCamReturn rk_aiq_uapi2_sysctl_updateIq(const rk_aiq_sys_ctx_t* sys_ctx, char*
 iqfile);
```

<!-- Source EN PDF p.38; unit 305 -->

【参数】

<!-- Source EN PDF p.38; unit 306 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| iqfile | 新 IQ 文件 | 输入 |

<!-- Source EN PDF p.38; unit 307 -->

【返回值】

<!-- Source EN PDF p.38; unit 308 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.38; unit 309 -->

【注意】

<!-- Source EN PDF p.38; unit 310 -->

iqfile 必须为完整路径。

<!-- Source EN PDF p.38; unit 311 -->

更新 IQ 参数不等于切换工作模式，例如 HDR 与 normal 之间不能靠更新 IQ 文件切换。但部分功能可通过不同 IQ 参数配置切换，如日夜切换完全通过 IQ 配置实现。

<!-- Source EN PDF p.38; unit 312 -->

切换 IQ 时，IQ 中的配置会覆盖用户 API 设置。例如 IQ 可将 AWB 配置为手动或自动；执行此函数后，无论 AWB 当前模式如何，最终都会被新 IQ 的默认配置覆盖。

<!-- Source EN PDF p.38; unit 313 -->

【依赖】

<!-- Source EN PDF p.38; unit 314 -->

头文件：rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.38; unit 315 -->

库文件：librkaiq.so

<!-- Source EN PDF p.38; unit 316 -->

#### 3.2.19  rk_aiq_uapi2_sysctl_getCrop

<!-- Source EN PDF p.38; unit 317 -->

【说明】获取裁剪参数。

<!-- Source EN PDF p.38; unit 318 -->

【语法】

<!-- Source EN PDF p.39; unit 319 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_getCrop(const rk_aiq_sys_ctx_t* sys_ctx, rk_aiq_rect_t
 *rect);
```

<!-- Source EN PDF p.39; unit 320 -->

【参数】

<!-- Source EN PDF p.39; unit 321 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| rect | 裁剪参数结构体指针 | 输出 |

<!-- Source EN PDF p.39; unit 322 -->

【返回值】

<!-- Source EN PDF p.39; unit 323 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.39; unit 324 -->

### 3.3 数据类型

<!-- Source EN PDF p.39; unit 325 -->

#### 3.3.1  rk_aiq_working_mode_t

<!-- Source EN PDF p.39; unit 326 -->

【说明】AIQ 图像链路工作模式。

<!-- Source EN PDF p.39; unit 327 -->

【定义】

<!-- Source EN PDF p.39; unit 328 -->

```text
 typedef enum {
     RK_AIQ_WORKING_MODE_NORMAL,
     RK_AIQ_WORKING_MODE_ISP_HDR2    = 0x10,
     RK_AIQ_WORKING_MODE_ISP_HDR3    = 0x20,
 } rk_aiq_working_mode_t;
```

<!-- Source EN PDF p.39; unit 329 -->

【成员】

<!-- Source EN PDF p.39; unit 330 -->

| 成员名称 | 说明 |
|---|---|
| RK_AIQ_WORKING_MODE_NORMAL | 普通模式 |
| RK_AIQ_WORKING_MODE_ISP_HDR2 | 双帧 HDR 模式 |
| RK_AIQ_WORKING_MODE_ISP_HDR3 | 三帧 HDR 模式 |

<!-- Source EN PDF p.39; unit 331 -->

【注意事项】

<!-- Source EN PDF p.39; unit 332 -->

应先查询 sensor 与 AIQ 支持的模式；设置不支持的模式无效。

<!-- Source EN PDF p.40; unit 333 -->

#### 3.3.2  rk_aiq_static_info_t

<!-- Source EN PDF p.40; unit 334 -->

【说明】AIQ 静态信息。

<!-- Source EN PDF p.40; unit 335 -->

【定义】

<!-- Source EN PDF p.40; unit 336 -->

```text
 typedef struct {
     rk_aiq_sensor_info_t    sensor_info;
     rk_aiq_lens_info_t      lens_info;
     bool has_lens_vcm;
     bool has_fl;
     bool fl_strth_adj_sup;
     bool has_irc;
     bool fl_ir_strth_adj_sup;
 } rk_aiq_static_info_t;
```

<!-- Source EN PDF p.40; unit 337 -->

【成员】

<!-- Source EN PDF p.40; unit 338 -->

| 成员名称 | 说明 |
|---|---|
| sensor_info | sensor 名称、支持分辨率等信息。 |
| lens_info | 镜头信息 |
| has_lens_vcm | 是否配有 VCM |
| has_fl | 是否配有闪光灯 |
| fl_strth_adj_sup | 闪光灯强度是否可调 |
| bool has_irc | 是否配有 IR-CUT |
| bool fl_ir_strth_adj_sup |  |

<!-- Source EN PDF p.40; unit 339 -->

#### 3.3.3  rk_aiq_sensor_info_t

<!-- Source EN PDF p.40; unit 340 -->

【说明】sensor 信息。

<!-- Source EN PDF p.40; unit 341 -->

【定义】

<!-- Source EN PDF p.40; unit 342 -->

```text
 typedef struct {
     char sensor_name[32];
     rk_frame_fmt_t  support_fmt[SUPPORT_FMT_MAX];
     int32_t num;
     /* binded pp stream media index */
     int8_t binded_strm_media_idx;
 } rk_aiq_sensor_info_t;
```

<!-- Source EN PDF p.40; unit 343 -->

【成员】

<!-- Source EN PDF p.41; unit 344 -->

| 成员名称 | 说明 |
|---|---|
| sensor_name | sensor 名称 |
| support_fmt | 支持的格式 |
| num | 支持的格式数量 |
| has_fl | 是否配有闪光灯 |
| binded_strm_media_idx | sensor 挂载的 media 节点编号。 |

<!-- Source EN PDF p.41; unit 345 -->

#### 3.3.4  rk_aiq_module_id_t

<!-- Source EN PDF p.41; unit 346 -->

【说明】AIQ 模块 ID。

<!-- Source EN PDF p.41; unit 347 -->

【定义】

<!-- Source EN PDF p.41; unit 348 -->

```text
 typedef enum {
     RK_MODULE_INVAL = 0,
     RK_MODULE_DPCC,
     RK_MODULE_BLS,
     RK_MODULE_LSC,
     RK_MODULE_AWB_GAIN,
     RK_MODULE_CTK,
     RK_MODULE_GOC,
     RK_MODULE_SHARP,
     RK_MODULE_AE,
     RK_MODULE_AWB,
     RK_MODULE_NR,
     RK_MODULE_GIC,
     RK_MODULE_3DLUT,
     RK_MODULE_LDCH,
     RK_MODULE_TNR,
     RK_MODULE_FEC,
     RK_MODULE_MAX
 }rk_aiq_module_id_t;
```

<!-- Source EN PDF p.41; unit 349 -->

【成员】

<!-- Source EN PDF p.42; unit 350 -->

| 成员名称 | 说明 |
|---|---|
| RK_MODULE_DPCC | 坏点检测与校正 |
| RK_MODULE_BLS | 黑电平 |
| RK_MODULE_LSC | 镜头阴影校正 |
| RK_MODULE_AWB_GAIN | 白平衡增益 |
| RK_MODULE_CTK | 色彩校正 |
| RK_MODULE_GOC | Gamma |
| RK_MODULE_SHARP | 锐化 |
| RK_MODULE_AE | 曝光 |
| RK_MODULE_AWB | 白平衡 |
| RK_MODULE_NR | 降噪 |
| RK_MODULE_GIC | 绿色平衡 |
| RK_MODULE_3DLUT | 3DLUT |
| RK_MODULE_LDCH | LDCH |
| RK_MODULE_TNR | 3D 降噪 |
| RK_MODULE_FEC | 鱼眼校正 |

<!-- Source EN PDF p.42; unit 351 -->

#### 3.3.5  rk_aiq_cpsl_cfg_t

<!-- Source EN PDF p.42; unit 352 -->

【说明】补光设置信息结构体。

<!-- Source EN PDF p.42; unit 353 -->

【定义】

<!-- Source EN PDF p.42; unit 354 -->

```text
 typedef struct rk_aiq_cpsl_cfg_s {
     RKAiqOPMode_t mode;
     rk_aiq_cpsls_t lght_src;
     bool gray_on; /*!< force to gray if light on */
     union {
         struct {
             float sensitivity; /*!< Range [0-100] */
             uint32_t sw_interval; /*!< switch interval time, unit  seconds */
         } a; /*< auto mode */
         struct {
             uint8_t on; /*!< disable 0, enable 1 */
             float strength_led; /*!< Range [0-100] */
             float strength_ir; /*!< Range [0-100] */
         } m; /*!< manual mode */
     } u;
 } rk_aiq_cpsl_cfg_t;
```

<!-- Source EN PDF p.43; unit 355 -->

【成员】

<!-- Source EN PDF p.43; unit 356 -->

| 成员名称 | 说明 |
|---|---|
| mode | 工作模式 |
| lght_src | 光源类型 |
| gray_on | 切换到夜间模式后，是否将图像切为黑白。 |
| sensitivity | 自动模式的切换灵敏度，范围 [0,100]。 |
| sw_interval | 自动模式的切换间隔，单位秒。 |
| on | 手动模式是否切换到夜间模式。 |
| strength_led | 手动模式 LED 光强，范围 [0,100]。 |
| strength_ir | 手动模式红外灯强度，范围 [0,100]。 |

<!-- Source EN PDF p.43; unit 357 -->

#### 3.3.6  rk_aiq_cpsl_info_t

<!-- Source EN PDF p.43; unit 358 -->

【说明】补光查询信息结构体。

<!-- Source EN PDF p.43; unit 359 -->

【定义】

<!-- Source EN PDF p.43; unit 360 -->

```text
 typedef struct rk_aiq_cpsl_info_s {
     int32_t mode;
     uint8_t on;
     bool gray;
     float strength_led;
     float strength_ir;
     float sensitivity;
     uint32_t sw_interval;
     int32_t lght_src;
 } rk_aiq_cpsl_info_t;
```

<!-- Source EN PDF p.43; unit 361 -->

【成员】

<!-- Source EN PDF p.44; unit 362 -->

| 成员名称 | 说明 |
|---|---|
| mode | 工作模式 |
| lght_src | 光源类型 |
| gray | 切换到夜间模式后，是否将图像切为黑白。 |
| sensitivity | 自动模式的切换灵敏度，范围 [0,100]。 |
| sw_interval | 自动模式的切换间隔，单位秒。 |
| on | 手动模式是否切换到夜间模式。 |
| strength_led | 手动模式 LED 光强，范围 [0,100]。 |
| strength_ir | 手动模式红外灯强度，范围 [0,100]。 |

<!-- Source EN PDF p.44; unit 363 -->

#### 3.3.7  rk_aiq_cpsl_cap_t

<!-- Source EN PDF p.44; unit 364 -->

【说明】补光支持能力结构体。

<!-- Source EN PDF p.44; unit 365 -->

【定义】

<!-- Source EN PDF p.44; unit 366 -->

```text
 typedef struct rk_aiq_cpsl_cap_s {
     int32_t supported_modes[RK_AIQ_OP_MODE_MAX];
     uint8_t modes_num;
     int32_t supported_lght_src[RK_AIQ_CPSLS_MAX];
     uint8_t lght_src_num;
     rk_aiq_range_t strength_led;
     rk_aiq_range_t sensitivity;
     rk_aiq_range_t strength_ir;
 } rk_aiq_cpsl_cap_t;
```

<!-- Source EN PDF p.44; unit 367 -->

【成员】

<!-- Source EN PDF p.44; unit 368 -->

| 成员名称 | 说明 |
|---|---|
| supported_modes | 支持的工作模式 |
| modes_num | 支持的模式数量 |
| gray | 切换到夜间模式后，是否将图像切为黑白。 |
| supported_lght_src | 支持的光源 |
| lght_src_num | 支持的光源数量 |
| strength_led | LED 强度范围 |
| sensitivity | 灵敏度范围 |
| strength_ir | 红外灯强度范围 |

<!-- Source EN PDF p.45; unit 369 -->

#### 3.3.8  rk_aiq_rect_t

<!-- Source EN PDF p.45; unit 370 -->

【说明】定义裁剪参数结构体。

<!-- Source EN PDF p.45; unit 371 -->

【定义】

<!-- Source EN PDF p.45; unit 372 -->

```text
 typedef struct rk_aiq_rect_s {
     int left;
     int top;
     int width;
     int height;
 } rk_aiq_rect_t;
```

<!-- Source EN PDF p.45; unit 373 -->

【成员】

<!-- Source EN PDF p.45; unit 374 -->

| 成员名称 | 说明 |
|---|---|
| left | 水平输出偏移 |
| top | 垂直输出偏移 |
| width | 水平输出尺寸 |
| height | 垂直输出尺寸 |

<!-- Source EN PDF p.46; unit 375 -->

## 4. 离线帧处理

<!-- Source EN PDF p.46; unit 376 -->

### 4.1 概述

<!-- Source EN PDF p.46; unit 377 -->

RKAIQ 提供离线 RAW 帧处理功能：解析 RK 自定义 RAW 格式文件，送入 ISP 处理，再输出可正常显示的图像。

<!-- Source EN PDF p.46; unit 378 -->

注意：离线帧处理功能尚未测试。

<!-- Source EN PDF p.46; unit 379 -->

### 4.2 功能框图

<!-- Source EN PDF p.46; unit 380 -->

![英文原稿技术图 — PDF p.46](/docs/rockchip-isp30-development/assets/en-p046-X802.png)

<!-- Source EN PDF p.46; unit 381 -->

离线帧处理框图

<!-- Source EN PDF p.46; unit 382 -->

### 4.3 功能说明

<!-- Source EN PDF p.46; unit 383 -->

支持 RK-RAW 文件输入。使用文件输入接口时，调用进程会阻塞，直到文件处理完成且成功输出。

<!-- Source EN PDF p.46; unit 384 -->

支持 RK-RAW buffer 输入及异步处理。使用该 buffer 输入接口时调用进程不阻塞；buffer 处理完成后调用已注册的回调函数（若已注册）。

<!-- Source EN PDF p.47; unit 385 -->

支持 RK-RAW buffer 输入及同步处理。调用进程会阻塞，直到 buffer 处理完成且成功输出。

<!-- Source EN PDF p.47; unit 386 -->

### 4.4 RK-RAW 格式说明

<!-- Source EN PDF p.47; unit 387 -->

参见 RK RAW File Format 文档。

<!-- Source EN PDF p.47; unit 388 -->

### 4.5 支持的 RAW 格式

<!-- Source EN PDF p.47; unit 389 -->

支持 raw8/raw10/raw12，以及 BGGR/GBRG/GRBG/RGGB 四种 Bayer 格式。

<!-- Source EN PDF p.47; unit 390 -->

### 4.6 API 参考

<!-- Source EN PDF p.47; unit 391 -->

### 4.7 数据结构

<!-- Source EN PDF p.47; unit 392 -->

### 4.8 注意事项

<!-- Source EN PDF p.47; unit 393 -->

使用 RK Raw 数据处理功能创建 AIQ Context 时，rk_aiq_uapi2_sysctl_init 的 sns_ent_name 参数必须为 "FakeCamera"。

<!-- Source EN PDF p.47; unit 394 -->

Raw 数据处理依赖 IQ XML 效果文件。XML 应按与输入 RK Raw 帧相同的分辨率生成，文件必须命名为 FakeCamera.xml，并放在 XML 文件的加载路径中。

<!-- Source EN PDF p.47; unit 395 -->

### 4.9 参考示例

<!-- Source EN PDF p.47; unit 396 -->

离线帧处理 API 用法详见 rkisp_demo，路径为 YOUR_SDK_DIR/external/camera_engine_rkaiq/rkisp_demo。

<!-- Source EN PDF p.48; unit 397 -->

## 5. 摄像头组

<!-- Source EN PDF p.48; unit 398 -->

### 5.1 概述

<!-- Source EN PDF p.48; unit 399 -->

环视等应用需要将多个摄像头编为一组，统一管理并设置曝光等参数。可创建 group 将多个摄像头划入同组。Camera Group API 基于单摄像头 AIQ API 实现；除另有说明外，单 AIQ API 同样适用于 Camera group。AIQ 内部按传入 Context 类型，将请求分派到摄像头组或单摄像头。

<!-- Source EN PDF p.48; unit 400 -->

#### 5.1.1  rk_aiq_uapi2_camgroup_create

<!-- Source EN PDF p.48; unit 401 -->

【说明】创建 Camera group 时，会为每个 Camera 创建独立 AIQ ctx，再交由 Group Ctx 管理。

<!-- Source EN PDF p.48; unit 402 -->

【语法】

<!-- Source EN PDF p.48; unit 403 -->

```text
 rk_aiq_camgroup_ctx_t*
 rk_aiq_uapi2_camgroup_create (rk_aiq_camgroup_instance_cfg_t* cfg);
```

<!-- Source EN PDF p.48; unit 404 -->

【参数】

<!-- Source EN PDF p.48; unit 405 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| cfg | 配置参数 | 输入 |

<!-- Source EN PDF p.48; unit 406 -->

【返回值】

<!-- Source EN PDF p.48; unit 407 -->

| 返回值 | 说明 |
|---|---|
| rk_aiq_camgroup_ctx_t* | 组运行环境 |
| NULL | 失败 |

<!-- Source EN PDF p.48; unit 408 -->

【依赖】

<!-- Source EN PDF p.48; unit 409 -->

头文件：rk_aiq_user_api2_camgroup.h

<!-- Source EN PDF p.48; unit 410 -->

库文件：librkaiq.so

<!-- Source EN PDF p.48; unit 411 -->

【注意】

<!-- Source EN PDF p.48; unit 412 -->

rk_aiq_uapi2_sysctl_init 创建单摄像头 AIQ 运行环境。已用该函数创建运行环境的 sensor 实体，不应再用 rk_aiq_uapi2_camgroup_create 创建组运行环境，反之亦然。

<!-- Source EN PDF p.49; unit 413 -->

IQ 默认场景为 normal-day。若使用 HDR 或其他模式，需预先通过 rk_aiq_uapi2_sysctl_preInit_scene 设置。

<!-- Source EN PDF p.49; unit 414 -->

#### 5.1.2  rk_aiq_uapi2_camgroup_prepare

<!-- Source EN PDF p.49; unit 415 -->

【说明】按选定的 pipeline 模式生成初始化参数并创建链路，会调用各 Camera 的 AIQ ctx 对应的 rk_aiq_uapi2_sysctl_prepare。

<!-- Source EN PDF p.49; unit 416 -->

【语法】

<!-- Source EN PDF p.49; unit 417 -->

```text
 XCamReturn
 rk_aiq_uapi2_camgroup_prepare (rk_aiq_camgroup_ctx_t* camgroup_ctx,
 rk_aiq_working_mode_t mode);
```

<!-- Source EN PDF p.49; unit 418 -->

【参数】

<!-- Source EN PDF p.49; unit 419 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| camgroup_ctx | 组运行环境 | 输入 |
| mode | Pipeline 工作模式 | 输入 |

<!-- Source EN PDF p.49; unit 420 -->

【返回值】

<!-- Source EN PDF p.49; unit 421 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 参见错误码 |

<!-- Source EN PDF p.49; unit 422 -->

【依赖】

<!-- Source EN PDF p.49; unit 423 -->

头文件：rk_aiq_user_api2_camgroup.h；库文件：librkaiq.so

<!-- Source EN PDF p.49; unit 424 -->

#### 5.1.3  rk_aiq_uapi2_camgroup_start

<!-- Source EN PDF p.49; unit 425 -->

【说明】运行摄像头组，调用各 Camera 的 AIQ ctx 对应的 rk_aiq_uapi2_sysctl_start。

<!-- Source EN PDF p.49; unit 426 -->

【语法】

<!-- Source EN PDF p.49; unit 427 -->

```text
 XCamReturn
 rk_aiq_uapi2_camgroup_start (rk_aiq_camgroup_ctx_t* camgroup_ctx);
```

<!-- Source EN PDF p.49; unit 428 -->

【参数】

<!-- Source EN PDF p.50; unit 429 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| camgroup_ctx | 组运行环境 | 输入 |

<!-- Source EN PDF p.50; unit 430 -->

【返回值】

<!-- Source EN PDF p.50; unit 431 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，参见错误码 |

<!-- Source EN PDF p.50; unit 432 -->

【依赖】

<!-- Source EN PDF p.50; unit 433 -->

头文件：rk_aiq_user_api2_camgroup.h；库文件：librkaiq.so

<!-- Source EN PDF p.50; unit 434 -->

#### 5.1.4  rk_aiq_uapi2_camgroup_stop

<!-- Source EN PDF p.50; unit 435 -->

【说明】停止摄像头组，调用各 Camera 的 AIQ ctx 对应的 rk_aiq_uapi2_sysctl_stop。

<!-- Source EN PDF p.50; unit 436 -->

【语法】

<!-- Source EN PDF p.50; unit 437 -->

```text
 XCamReturn
 rk_aiq_uapi2_camgroup_stop (rk_aiq_camgroup_ctx_t* camgroup_ctx);
```

<!-- Source EN PDF p.50; unit 438 -->

【参数】

<!-- Source EN PDF p.50; unit 439 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| camgroup_ctx | 组运行环境 | 输入 |

<!-- Source EN PDF p.50; unit 440 -->

【返回值】

<!-- Source EN PDF p.50; unit 441 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，参见错误码 |

<!-- Source EN PDF p.50; unit 442 -->

【依赖】

<!-- Source EN PDF p.50; unit 443 -->

头文件：rk_aiq_user_api2_camgroup.h；库文件：librkaiq.so

<!-- Source EN PDF p.51; unit 444 -->

#### 5.1.5  rk_aiq_uapi2_camgroup_destroy

<!-- Source EN PDF p.51; unit 445 -->

【说明】销毁摄像头组，调用各 Camera 的 AIQ ctx 对应的 rk_aiq_uapi2_sysctl_deinit。

<!-- Source EN PDF p.51; unit 446 -->

【语法】

<!-- Source EN PDF p.51; unit 447 -->

```text
 XCamReturn
 rk_aiq_uapi2_camgroup_destroy (rk_aiq_camgroup_ctx_t* camgroup_ctx);
```

<!-- Source EN PDF p.51; unit 448 -->

【参数】

<!-- Source EN PDF p.51; unit 449 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| camgroup_ctx | 组运行环境 | 输入 |

<!-- Source EN PDF p.51; unit 450 -->

【返回值】

<!-- Source EN PDF p.51; unit 451 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，参见错误码 |

<!-- Source EN PDF p.51; unit 452 -->

【依赖】

<!-- Source EN PDF p.51; unit 453 -->

头文件：rk_aiq_user_api2_camgroup.h；库文件：librkaiq.so

<!-- Source EN PDF p.51; unit 454 -->

#### 5.1.6  rk_aiq_uapi2_camgroup_getOverlapMap

<!-- Source EN PDF p.51; unit 455 -->

【说明】在环视场景中，从 CameraGroup 上下文获取各摄像头的重叠区域信息。

<!-- Source EN PDF p.51; unit 456 -->

【语法】

<!-- Source EN PDF p.51; unit 457 -->

```text
 struct RK_PS_SrcOverlapMap*
 rk_aiq_uapi2_camgroup_getOverlapMap (rk_aiq_camgroup_ctx_t* camgroup_ctx);
```

<!-- Source EN PDF p.51; unit 458 -->

【参数】

<!-- Source EN PDF p.51; unit 459 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| camgroup_ctx | 组运行环境 | 输入 |

<!-- Source EN PDF p.51; unit 460 -->

【返回值】

<!-- Source EN PDF p.52; unit 461 -->

| 返回值 | 说明 |
|---|---|
| struct RK_PS_SrcOverlapMap* | 重叠区域信息结构体指针 |
| NULL | 失败 |

<!-- Source EN PDF p.52; unit 462 -->

【依赖】

<!-- Source EN PDF p.52; unit 463 -->

头文件：rk_aiq_user_api2_camgroup.h；库文件：librkaiq.so

<!-- Source EN PDF p.52; unit 464 -->

#### 5.1.7  rk_aiq_uapi2_camgroup_getOverlapMap

<!-- Source EN PDF p.52; unit 465 -->

【说明】在环视场景中，从文件获取各摄像头的重叠区域信息。

<!-- Source EN PDF p.52; unit 466 -->

【语法】

<!-- Source EN PDF p.52; unit 467 -->

```text
 XCamReturn
 rk_aiq_uapi2_camgroup_getOverlapMap_from_file (const char* map_file,
                                                             struct
 RK_PS_SrcOverlapMap** overlapMap);
```

<!-- Source EN PDF p.52; unit 468 -->

【参数】

<!-- Source EN PDF p.52; unit 469 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| map_file | 存储重叠信息的文件 | 输入 |
| overlapMap | 存储获取到的重叠信息 | 输入、输出 |

<!-- Source EN PDF p.52; unit 470 -->

【返回值】

<!-- Source EN PDF p.52; unit 471 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，参见错误码 |

<!-- Source EN PDF p.52; unit 472 -->

【依赖】

<!-- Source EN PDF p.52; unit 473 -->

头文件：rk_aiq_user_api2_camgroup.h；库文件：librkaiq.so

<!-- Source EN PDF p.52; unit 474 -->

#### 5.1.8  rk_aiq_uapi2_camgroup_getAiqCtxBySnsNm

<!-- Source EN PDF p.52; unit 475 -->

【说明】通过组内 Sensor 实体名称获取单个 Camera 的 AIQ 上下文。

<!-- Source EN PDF p.52; unit 476 -->

【语法】

<!-- Source EN PDF p.53; unit 477 -->

```text
 rk_aiq_sys_ctx_t*
 rk_aiq_uapi2_camgroup_getAiqCtxBySnsNm (rk_aiq_camgroup_ctx_t* camgroup_ctx,
 const char* sns_entity_name);
```

<!-- Source EN PDF p.53; unit 478 -->

【参数】

<!-- Source EN PDF p.53; unit 479 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| camgroup_ctx | 组运行环境 | 输入 |
| sns_entity_name | 组内 sensor 实体名称 | 输入 |

<!-- Source EN PDF p.53; unit 480 -->

【返回值】

<!-- Source EN PDF p.53; unit 481 -->

| 返回值 | 说明 |
|---|---|
| rk_aiq_sys_ctx_t* | 获取到的 AIQ 运行环境 |
| NULL | 失败 |

<!-- Source EN PDF p.53; unit 482 -->

【依赖】

<!-- Source EN PDF p.53; unit 483 -->

头文件：rk_aiq_user_api2_camgroup.h；库文件：librkaiq.so

<!-- Source EN PDF p.53; unit 484 -->

#### 5.1.9  rk_aiq_uapi2_camgroup_getCamInfos

<!-- Source EN PDF p.53; unit 485 -->

【说明】获取组内摄像头信息，例如 sensor 实体名称。

<!-- Source EN PDF p.53; unit 486 -->

【语法】

<!-- Source EN PDF p.53; unit 487 -->

```text
 XCamReturn
 rk_aiq_uapi2_camgroup_getCamInfos (rk_aiq_camgroup_ctx_t* camgroup_ctx,
                    rk_aiq_camgroup_camInfos_t* camInfos);
```

<!-- Source EN PDF p.53; unit 488 -->

【参数】

<!-- Source EN PDF p.53; unit 489 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| camgroup_ctx | 组运行环境 | 输入 |
| camInfos | 获取到的组内摄像头信息 | 输出 |

<!-- Source EN PDF p.53; unit 490 -->

【返回值】

<!-- Source EN PDF p.53; unit 491 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，参见错误码 |

<!-- Source EN PDF p.54; unit 492 -->

【依赖】

<!-- Source EN PDF p.54; unit 493 -->

头文件：rk_aiq_user_api2_camgroup.h；库文件：librkaiq.so

<!-- Source EN PDF p.54; unit 494 -->

#### 5.1.10  rk_aiq_uapi2_camgroup_bind

<!-- Source EN PDF p.54; unit 495 -->

【说明】预留接口，尚未实现。

<!-- Source EN PDF p.54; unit 496 -->

#### 5.1.11  rk_aiq_uapi2_camgroup_unbind

<!-- Source EN PDF p.54; unit 497 -->

【说明】预留接口，尚未实现。

<!-- Source EN PDF p.54; unit 498 -->

### 5.2 数据结构

<!-- Source EN PDF p.54; unit 499 -->

#### 5.2.1  rk_aiq_camgroup_instance_cfg_t

<!-- Source EN PDF p.54; unit 500 -->

【说明】Carmelaghrup 配置参数（原文拼写）。

<!-- Source EN PDF p.54; unit 501 -->

【定义】

<!-- Source EN PDF p.54; unit 502 -->

```text
   typedef struct rk_aiq_camgroup_instance_cfg_s {
       const char* sns_ent_nm_array[RK_AIQ_CAM_GROUP_MAX_CAMS];
       int sns_num;
       const char* config_file_dir;
        /* followings are relative path to config_file_dir */
        const char* single_iq_file;
        const char* group_iq_file;
        const char* overlap_map_file;
    } rk_aiq_camgroup_instance_cfg_t;
```

<!-- Source EN PDF p.54; unit 503 -->

【成员】

<!-- Source EN PDF p.55; unit 504 -->

| 成员名称 | 说明 |
|---|---|
| sns_ent_nm_array | 需要加入由组管理的 Sensor 实体数组。 |
| sns_num | 需加入组的 sensor 实体数量。 |
| config_file_dir | 指定 IQ 文件路径。 |
| single_iq_file | 指定 IQ 文件名，可为 NULL；为 NULL 时由 AIQ 自动选择。 |
| group_iq_file | 指定 Camera group 的 IQ 配置文件，目前未使用。 |
| overlap_map_file | 指定 Camera 重叠信息文件，可为 NULL。 |

<!-- Source EN PDF p.55; unit 505 -->

#### 5.2.2  rk_aiq_camgroup_camInfos_t

<!-- Source EN PDF p.55; unit 506 -->

【说明】Camera group 中各摄像头的信息。

<!-- Source EN PDF p.55; unit 507 -->

【定义】

<!-- Source EN PDF p.55; unit 508 -->

```text
    typedef struct rk_aiq_camgroup_camInfos_s {
        int valid_sns_num;
        const char* sns_ent_nm[RK_AIQ_CAM_GROUP_MAX_CAMS];
        int sns_camPhyId[RK_AIQ_CAM_GROUP_MAX_CAMS];
   } rk_aiq_camgroup_camInfos_t;
```

<!-- Source EN PDF p.55; unit 509 -->

【成员】

<!-- Source EN PDF p.55; unit 510 -->

| 成员名称 | 说明 |
|---|---|
| valid_sns_num | 组中包含的 Sensor 实体数量。 |
| sns_ent_nm | 组中包含的 Sensor 实体名称数组。 |
| sns_camPhyId | 组中各 Sensor 实体对应的物理 ID 数组。 |

<!-- Source EN PDF p.55; unit 511 -->

#### 5.2.3  struct RK_PS_SrcOverlapMap

<!-- Source EN PDF p.55; unit 512 -->

【说明】定义摄像头重叠区域。

<!-- Source EN PDF p.55; unit 513 -->

【定义】

<!-- Source EN PDF p.55; unit 514 -->

```text
        struct RK_PS_SrcOverlapMap
      {
            char versionInfo[64];
            RK_PS_SrcOverlapPosition srcOverlapPositon[8];
            unsigned char overlapMap[15 * 15 * 8];
        };
```

<!-- Source EN PDF p.56; unit 515 -->

【成员】

<!-- Source EN PDF p.56; unit 516 -->

| 成员名称 | 说明 |
|---|---|
| versionInfo | 版本信息 |
| srcOverlapPositon | 各摄像头的旋转方向，可为 0、90、180、270 度。 |
| overlapMap | 8 个摄像头各统计块的重叠信息：每个摄像头统计数据为 15*15，共 8 个摄像头（编号 0~7）；实际不足 8 个时，对应位置填 0。按行保存：先保存 8 个摄像头的第 1 行，再保存第 2 行，以此类推。取值 0~255：完全不重叠为 0，完全重叠为 255，部分重叠按比例插值。存储顺序为 camera0 row0; camera1 row0; camera2 row0; camera3 row0; camera4 row0; camera5 row0; camera6 row0; camera7 row0; camera0 row1; camera1 row1; camera2 row1; camera3 row1; camera4 row1; camera5 row1; camera6 row1; camera7 row1; ...... camera0 row14; camera1 row14; camera2 row14; camera3 row14; camera4 row14; camera5 row14; camera6 row14; camera7 row14; |

<!-- Source EN PDF p.57; unit 517 -->

## 6.   AE

<!-- Source EN PDF p.57; unit 518 -->

### 6.1 概述

<!-- Source EN PDF p.57; unit 519 -->

AE 模块按自动测光系统获取当前图像曝光量，自动配置镜头光圈、sensor 快门和增益，以获得最佳图像质量。

<!-- Source EN PDF p.57; unit 520 -->

### 6.2 重要概念

<!-- Source EN PDF p.57; unit 521 -->

曝光时间：sensor 积累电荷的时间，即像素开始曝光至电荷读出的间隔。

<!-- Source EN PDF p.57; unit 522 -->

曝光增益：sensor 输出电荷的总放大倍数，一般包括数字增益和模拟增益。模拟增益引入的噪声略少，因此通常优先使用。

<!-- Source EN PDF p.57; unit 523 -->

光圈：镜头中可改变通光孔径大小的机构。

<!-- Source EN PDF p.57; unit 524 -->

防闪烁：抑制灯光电源频率与 sensor 帧率不匹配引起的画面闪烁，一般通过限制曝光时间和修改 sensor 帧率实现。

<!-- Source EN PDF p.57; unit 525 -->

### 6.3 功能说明

<!-- Source EN PDF p.57; unit 526 -->

AE 模块由 AE 统计和 AE 控制策略算法组成。

<!-- Source EN PDF p.57; unit 527 -->

### 6.4 功能级 API 参考

<!-- Source EN PDF p.57; unit 528 -->

#### 6.4.1  rk_aiq_uapi2_setAeLock

<!-- Source EN PDF p.57; unit 529 -->

【说明】

<!-- Source EN PDF p.57; unit 530 -->

设置 AE 曝光锁定功能。

<!-- Source EN PDF p.57; unit 531 -->

【语法】

<!-- Source EN PDF p.57; unit 532 -->

```text
 XCamReturn rk_aiq_uapi2_setAeLock（const rk_aiq_sys_ctx_t* ctx, bool on);
```

<!-- Source EN PDF p.57; unit 533 -->

【参数】

<!-- Source EN PDF p.57; unit 534 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| on | 锁定使能 | 输入 |

<!-- Source EN PDF p.58; unit 535 -->

【返回值】

<!-- Source EN PDF p.58; unit 536 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 |  |

<!-- Source EN PDF p.58; unit 537 -->

#### 6.4.2  rk_aiq_uapi2_setExpMode

<!-- Source EN PDF p.58; unit 538 -->

【说明】设置曝光模式，支持自动曝光和手动曝光。

<!-- Source EN PDF p.58; unit 539 -->

【语法】

<!-- Source EN PDF p.58; unit 540 -->

```text
 XCamReturn rk_aiq_uapi2_setExpMode(const rk_aiq_sys_ctx_t* ctx, opMode_t mode);
```

<!-- Source EN PDF p.58; unit 541 -->

【参数】

<!-- Source EN PDF p.58; unit 542 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| mode | 曝光模式 | 输入 |

<!-- Source EN PDF p.58; unit 543 -->

【返回值】

<!-- Source EN PDF p.58; unit 544 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.58; unit 545 -->

【注意】

<!-- Source EN PDF p.58; unit 546 -->

切换为手动曝光时，增益和曝光时间采用图像效果文件中的初始值。如需切换时同时设置曝光值，可使用 rk_aiq_uapi2_setManualExp。

<!-- Source EN PDF p.58; unit 547 -->

【依赖】

<!-- Source EN PDF p.58; unit 548 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.58; unit 549 -->

库文件：librkaiq.so

<!-- Source EN PDF p.58; unit 550 -->

#### 6.4.3  rk_aiq_uapi2_getExpMode

<!-- Source EN PDF p.58; unit 551 -->

【说明】获取曝光模式。

<!-- Source EN PDF p.58; unit 552 -->

【语法】

<!-- Source EN PDF p.59; unit 553 -->

```text
 XCamReturn rk_aiq_uapi2_getExpMode(const rk_aiq_sys_ctx_t* ctx, opMode_t *mode);
```

<!-- Source EN PDF p.59; unit 554 -->

【参数】

<!-- Source EN PDF p.59; unit 555 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| mode | 曝光模式 | 输出 |

<!-- Source EN PDF p.59; unit 556 -->

【返回值】

<!-- Source EN PDF p.59; unit 557 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.59; unit 558 -->

【依赖】

<!-- Source EN PDF p.59; unit 559 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.59; unit 560 -->

库文件：librkaiq.so

<!-- Source EN PDF p.59; unit 561 -->

#### 6.4.4  rk_aiq_uapi2_setManualExp

<!-- Source EN PDF p.59; unit 562 -->

【说明】使用手动曝光模式并设置增益和曝光时间。

<!-- Source EN PDF p.59; unit 563 -->

【语法】

<!-- Source EN PDF p.59; unit 564 -->

```text
 XCamReturn rk_aiq_uapi2_setManualExp(const rk_aiq_sys_ctx_t* ctx, float gain,
 float time);
```

<!-- Source EN PDF p.59; unit 565 -->

【参数】

<!-- Source EN PDF p.59; unit 566 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| gain | 曝光增益 | 输入 |
| time | 曝光时间 | 输入 |

<!-- Source EN PDF p.59; unit 567 -->

【返回值】

<!-- Source EN PDF p.59; unit 568 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.59; unit 569 -->

【依赖】

<!-- Source EN PDF p.60; unit 570 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.60; unit 571 -->

库文件：librkaiq.so

<!-- Source EN PDF p.60; unit 572 -->

#### 6.4.5  rk_aiq_uapi2_setExpGainRange

<!-- Source EN PDF p.60; unit 573 -->

【说明】设置增益范围。

<!-- Source EN PDF p.60; unit 574 -->

【语法】

<!-- Source EN PDF p.60; unit 575 -->

```text
 XCamReturn rk_aiq_uapi2_setExpGainRange(const rk_aiq_sys_ctx_t* ctx, paRange_t
 *gain);
```

<!-- Source EN PDF p.60; unit 576 -->

【参数】

<!-- Source EN PDF p.60; unit 577 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| gain | 曝光增益范围 | 输入 |

<!-- Source EN PDF p.60; unit 578 -->

【返回值】

<!-- Source EN PDF p.60; unit 579 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.60; unit 580 -->

【依赖】

<!-- Source EN PDF p.60; unit 581 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.60; unit 582 -->

库文件：librkaiq.so

<!-- Source EN PDF p.60; unit 583 -->

#### 6.4.6  rk_aiq_uapi2_getExpGainRange

<!-- Source EN PDF p.60; unit 584 -->

【说明】获取增益范围。

<!-- Source EN PDF p.60; unit 585 -->

【语法】

<!-- Source EN PDF p.60; unit 586 -->

```text
 XCamReturn rk_aiq_uapi2_getExpGainRange(const rk_aiq_sys_ctx_t* ctx, paRange_t
 *gain);
```

<!-- Source EN PDF p.60; unit 587 -->

【参数】

<!-- Source EN PDF p.61; unit 588 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| gain | 曝光增益范围 | 输出 |

<!-- Source EN PDF p.61; unit 589 -->

【返回值】

<!-- Source EN PDF p.61; unit 590 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.61; unit 591 -->

【依赖】

<!-- Source EN PDF p.61; unit 592 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.61; unit 593 -->

库文件：librkaiq.so

<!-- Source EN PDF p.61; unit 594 -->

#### 6.4.7  rk_aiq_uapi2_setExpTimeRange

<!-- Source EN PDF p.61; unit 595 -->

【说明】设置曝光时间范围。

<!-- Source EN PDF p.61; unit 596 -->

【语法】

<!-- Source EN PDF p.61; unit 597 -->

```text
 XCamReturn rk_aiq_uapi2_setExpTimeRange(const rk_aiq_sys_ctx_t* ctx, paRange_t
 *time);
```

<!-- Source EN PDF p.61; unit 598 -->

【参数】

<!-- Source EN PDF p.61; unit 599 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| time | 曝光时间范围 | 输入 |

<!-- Source EN PDF p.61; unit 600 -->

【返回值】

<!-- Source EN PDF p.61; unit 601 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.61; unit 602 -->

【依赖】

<!-- Source EN PDF p.61; unit 603 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.61; unit 604 -->

库文件：librkaiq.so

<!-- Source EN PDF p.62; unit 605 -->

#### 6.4.8  rk_aiq_uapi2_getExpTimeRange

<!-- Source EN PDF p.62; unit 606 -->

【说明】获取曝光时间范围。

<!-- Source EN PDF p.62; unit 607 -->

【语法】

<!-- Source EN PDF p.62; unit 608 -->

```text
 XCamReturn rk_aiq_uapi2_getExpTimeRange(const rk_aiq_sys_ctx_t* ctx, paRange_t
 *time);
```

<!-- Source EN PDF p.62; unit 609 -->

【参数】

<!-- Source EN PDF p.62; unit 610 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| time | 曝光时间范围 | 输出 |

<!-- Source EN PDF p.62; unit 611 -->

【返回值】

<!-- Source EN PDF p.62; unit 612 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.62; unit 613 -->

【依赖】

<!-- Source EN PDF p.62; unit 614 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.62; unit 615 -->

库文件：librkaiq.so

<!-- Source EN PDF p.62; unit 616 -->

#### 6.4.9  rk_aiq_uapi2_setBLCMode

<!-- Source EN PDF p.62; unit 617 -->

【说明】背光补偿开关及区域设置。

<!-- Source EN PDF p.62; unit 618 -->

【语法】

<!-- Source EN PDF p.62; unit 619 -->

```text
 XCamReturn rk_aiq_uapi2_setBLCMode(const rk_aiq_sys_ctx_t* ctx, bool on,
 aeMeasAreaType_t areaType);
```

<!-- Source EN PDF p.62; unit 620 -->

【参数】

<!-- Source EN PDF p.62; unit 621 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| on | 开关 | 输入 |
| areaType | 补偿区域选择 | 输入 |

<!-- Source EN PDF p.62; unit 622 -->

【返回值】

<!-- Source EN PDF p.63; unit 623 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.63; unit 624 -->

【注意】

<!-- Source EN PDF p.63; unit 625 -->

接口仅在线性模式下可用。

<!-- Source EN PDF p.63; unit 626 -->

【依赖】

<!-- Source EN PDF p.63; unit 627 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.63; unit 628 -->

库文件：librkaiq.so

<!-- Source EN PDF p.63; unit 629 -->

#### 6.4.10  rk_aiq_uapi2_setBLCStrength

<!-- Source EN PDF p.63; unit 630 -->

【说明】设置暗区提升强度。

<!-- Source EN PDF p.63; unit 631 -->

【语法】

<!-- Source EN PDF p.63; unit 632 -->

```text
 XCamReturn rk_aiq_uapi2_setBLCStrength(const rk_aiq_sys_ctx_t* ctx, int
 strength);
```

<!-- Source EN PDF p.63; unit 633 -->

【参数】

<!-- Source EN PDF p.63; unit 634 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| strength | 提升强度，范围 [1,100]。 | 输入 |

<!-- Source EN PDF p.63; unit 635 -->

【返回值】

<!-- Source EN PDF p.63; unit 636 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.63; unit 637 -->

【注意】

<!-- Source EN PDF p.63; unit 638 -->

接口仅在线性模式下可用。

<!-- Source EN PDF p.63; unit 639 -->

【依赖】

<!-- Source EN PDF p.63; unit 640 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.63; unit 641 -->

库文件：librkaiq.so

<!-- Source EN PDF p.64; unit 642 -->

#### 6.4.11  rk_aiq_uapi2_setHLCMode

<!-- Source EN PDF p.64; unit 643 -->

【说明】强光抑制开关。

<!-- Source EN PDF p.64; unit 644 -->

【语法】

<!-- Source EN PDF p.64; unit 645 -->

```text
 XCamReturn rk_aiq_uapi2_setHLCMode(const rk_aiq_sys_ctx_t* ctx, bool on);
```

<!-- Source EN PDF p.64; unit 646 -->

【参数】

<!-- Source EN PDF p.64; unit 647 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| on | 开关 | 输入 |

<!-- Source EN PDF p.64; unit 648 -->

【返回值】

<!-- Source EN PDF p.64; unit 649 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.64; unit 650 -->

【注意】

<!-- Source EN PDF p.64; unit 651 -->

接口仅在线性模式下可用。

<!-- Source EN PDF p.64; unit 652 -->

【依赖】

<!-- Source EN PDF p.64; unit 653 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.64; unit 654 -->

库文件：librkaiq.so

<!-- Source EN PDF p.64; unit 655 -->

#### 6.4.12  rk_aiq_uapi2_setHLCStrength

<!-- Source EN PDF p.64; unit 656 -->

【说明】设置强光抑制强度。

<!-- Source EN PDF p.64; unit 657 -->

【语法】

<!-- Source EN PDF p.64; unit 658 -->

```text
 XCamReturn rk_aiq_uapi2_setHLCStrength(const rk_aiq_sys_ctx_t* ctx, int
 strength);
```

<!-- Source EN PDF p.64; unit 659 -->

【参数】

<!-- Source EN PDF p.64; unit 660 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| strength | 抑制强度，范围 [1,100]。 | 输入 |

<!-- Source EN PDF p.65; unit 661 -->

【返回值】

<!-- Source EN PDF p.65; unit 662 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.65; unit 663 -->

【注意】

<!-- Source EN PDF p.65; unit 664 -->

接口仅在线性模式下可用。

<!-- Source EN PDF p.65; unit 665 -->

【依赖】

<!-- Source EN PDF p.65; unit 666 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.65; unit 667 -->

库文件：librkaiq.sov（原文拼写，须核对）。

<!-- Source EN PDF p.65; unit 668 -->

#### 6.4.13  rk_aiq_uapi2_setAntiFlickerEn

<!-- Source EN PDF p.65; unit 669 -->

【说明】设置抗工频闪烁开关。

<!-- Source EN PDF p.65; unit 670 -->

【语法】

<!-- Source EN PDF p.65; unit 671 -->

```text
 XCamReturn rk_aiq_uapi2_setAntiFlickerEn(const rk_aiq_sys_ctx_t* ctx, bool on)；
```

<!-- Source EN PDF p.65; unit 672 -->

【参数】

<!-- Source EN PDF p.65; unit 673 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| on | 功能开关参数 | 输入 |

<!-- Source EN PDF p.65; unit 674 -->

【返回值】

<!-- Source EN PDF p.65; unit 675 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.65; unit 676 -->

【依赖】

<!-- Source EN PDF p.65; unit 677 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.65; unit 678 -->

库文件：librkaiq.so

<!-- Source EN PDF p.66; unit 679 -->

#### 6.4.14  rk_aiq_uapi2_getAntiFlickerEn

<!-- Source EN PDF p.66; unit 680 -->

【说明】设置抗工频闪烁开关。

<!-- Source EN PDF p.66; unit 681 -->

【语法】

<!-- Source EN PDF p.66; unit 682 -->

```text
 XCamReturn rk_aiq_uapi2_getAntiFlickerEn(const rk_aiq_sys_ctx_t* ctx, bool* on)；
```

<!-- Source EN PDF p.66; unit 683 -->

【参数】

<!-- Source EN PDF p.66; unit 684 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| on | 功能开关参数 | 输入 |

<!-- Source EN PDF p.66; unit 685 -->

【返回值】

<!-- Source EN PDF p.66; unit 686 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.66; unit 687 -->

【依赖】

<!-- Source EN PDF p.66; unit 688 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.66; unit 689 -->

库文件：librkaiq.so

<!-- Source EN PDF p.66; unit 690 -->

#### 6.4.15  rk_aiq_uapi2_setAntiFlickerMode

<!-- Source EN PDF p.66; unit 691 -->

【说明】设置抗闪烁模式。

<!-- Source EN PDF p.66; unit 692 -->

【语法】

<!-- Source EN PDF p.66; unit 693 -->

```text
 XCamReturn rk_aiq_uapi2_setAntiFlickerMode(const rk_aiq_sys_ctx_t* ctx,
 antiFlickerMode_t mode);
```

<!-- Source EN PDF p.66; unit 694 -->

【参数】

<!-- Source EN PDF p.66; unit 695 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| mode | 抗闪烁模式 | 输入 |

<!-- Source EN PDF p.66; unit 696 -->

【返回值】

<!-- Source EN PDF p.67; unit 697 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.67; unit 698 -->

【依赖】

<!-- Source EN PDF p.67; unit 699 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.67; unit 700 -->

库文件：librkaiq.so

<!-- Source EN PDF p.67; unit 701 -->

#### 6.4.16  rk_aiq_uapi2_getAntiFlickerMode

<!-- Source EN PDF p.67; unit 702 -->

【说明】获取抗闪烁模式。

<!-- Source EN PDF p.67; unit 703 -->

【语法】

<!-- Source EN PDF p.67; unit 704 -->

```text
 XCamReturn rk_aiq_uapi2_getAntiFlickerMode(const rk_aiq_sys_ctx_t* ctx,
 antiFlickerMode_t *mode);
```

<!-- Source EN PDF p.67; unit 705 -->

【参数】

<!-- Source EN PDF p.67; unit 706 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| mode | 抗闪烁模式 | 输出 |

<!-- Source EN PDF p.67; unit 707 -->

【返回值】

<!-- Source EN PDF p.67; unit 708 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.67; unit 709 -->

【依赖】

<!-- Source EN PDF p.67; unit 710 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.67; unit 711 -->

库文件：librkaiq.so

<!-- Source EN PDF p.67; unit 712 -->

#### 6.4.17  rk_aiq_uapi2_setExpPwrLineFreqMode

<!-- Source EN PDF p.67; unit 713 -->

【说明】设置抗闪烁频率。

<!-- Source EN PDF p.67; unit 714 -->

【语法】

<!-- Source EN PDF p.67; unit 715 -->

```text
 XCamReturn rk_aiq_uapi2_setExpPwrLineFreqMode(const rk_aiq_sys_ctx_t* ctx,
 expPwrLineFreq_t freq);
```

<!-- Source EN PDF p.68; unit 716 -->

【参数】

<!-- Source EN PDF p.68; unit 717 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| freq | 抗闪烁频率 | 输入 |

<!-- Source EN PDF p.68; unit 718 -->

【返回值】

<!-- Source EN PDF p.68; unit 719 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.68; unit 720 -->

【依赖】

<!-- Source EN PDF p.68; unit 721 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.68; unit 722 -->

库文件：librkaiq.so

<!-- Source EN PDF p.68; unit 723 -->

#### 6.4.18  rk_aiq_uapi2_getExpPwrLineFreqMode

<!-- Source EN PDF p.68; unit 724 -->

【说明】获取抗闪烁频率。

<!-- Source EN PDF p.68; unit 725 -->

【语法】

<!-- Source EN PDF p.68; unit 726 -->

```text
 XCamReturn rk_aiq_uapi2_getExpPwrLineFreqMode(const rk_aiq_sys_ctx_t* ctx,
 expPwrLineFreq_t *freq);
```

<!-- Source EN PDF p.68; unit 727 -->

【参数】

<!-- Source EN PDF p.68; unit 728 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| freq | 抗闪烁频率 | 输出 |

<!-- Source EN PDF p.68; unit 729 -->

【返回值】

<!-- Source EN PDF p.68; unit 730 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.68; unit 731 -->

【依赖】

<!-- Source EN PDF p.68; unit 732 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.68; unit 733 -->

库文件：librkaiq.so

<!-- Source EN PDF p.69; unit 734 -->

### 6.5 功能级 API 数据类型

<!-- Source EN PDF p.69; unit 735 -->

#### 6.5.1  opMode_t

<!-- Source EN PDF p.69; unit 736 -->

【说明】定义自动/手动模式。

<!-- Source EN PDF p.69; unit 737 -->

【定义】

<!-- Source EN PDF p.69; unit 738 -->

```text
 typedef enum opMode_e {
     OP_AUTO = 0,
     OP_MANUALl = 1,
     OP_INVAL
 } opMode_t;
```

<!-- Source EN PDF p.69; unit 739 -->

【成员】

<!-- Source EN PDF p.69; unit 740 -->

| 成员名称 | 说明 |
|---|---|
| OP_AUTO | 自动模式 |
| OP_MANUALl | 手动模式 |
| OP_INVAL | 无效值 |

<!-- Source EN PDF p.69; unit 741 -->

#### 6.5.2  paRange_t

<!-- Source EN PDF p.69; unit 742 -->

【说明】定义参数范围。

<!-- Source EN PDF p.69; unit 743 -->

【定义】

<!-- Source EN PDF p.69; unit 744 -->

```text
 typedef struct paRange_s {
     float max;
     float min;
 } paRange_t;
```

<!-- Source EN PDF p.69; unit 745 -->

【成员】

<!-- Source EN PDF p.69; unit 746 -->

| 成员名称 | 说明 |
|---|---|
| max | 上限值 |
| min | 下限值 |

<!-- Source EN PDF p.70; unit 747 -->

#### 6.5.3  aeMeasAreaType_t

<!-- Source EN PDF p.70; unit 748 -->

【说明】定义 AE 测量区域类型。

<!-- Source EN PDF p.70; unit 749 -->

【定义】

<!-- Source EN PDF p.70; unit 750 -->

```text
 typedef enum aeMeasAreaType_e {
     AE_MEAS_AREA_AUTO = 0,
     AE_MEAS_AREA_UP,
     AE_MEAS_AREA_BOTTOM,
     AE_MEAS_AREA_LEFT,
     AE_MEAS_AREA_RIGHT,
     AE_MEAS_AREA_CENTER,
 } aeMeasAreaType_t;
```

<!-- Source EN PDF p.70; unit 751 -->

【成员】

<!-- Source EN PDF p.70; unit 752 -->

| 成员名称 | 说明 |
|---|---|
| AE_MEAS_AREA_AUTO | 自动 |
| AE_MEAS_AREA_UP | 上部区域 |
| AE_MEAS_AREA_BOTTOM | 下部区域 |
| AE_MEAS_AREA_LEFT | 左侧区域 |
| AE_MEAS_AREA_RIGHT | 右侧区域 |
| AE_MEAS_AREA_CENTER | 中央区域 |

<!-- Source EN PDF p.70; unit 753 -->

#### 6.5.4  expPwrLineFreq_t

<!-- Source EN PDF p.70; unit 754 -->

【说明】定义抗闪烁频率。

<!-- Source EN PDF p.70; unit 755 -->

【定义】

<!-- Source EN PDF p.70; unit 756 -->

```text
 typedef enum expPwrLineFreq_e {
        EXP_PWR_LINE_FREQ_DIS   = 0,
        EXP_PWR_LINE_FREQ_50HZ  = 1,
        EXP_PWR_LINE_FREQ_60HZ  = 2,
 } expPwrLineFreq_t;
```

<!-- Source EN PDF p.70; unit 757 -->

【成员】

<!-- Source EN PDF p.71; unit 758 -->

| 成员名称 | 说明 |
|---|---|
| EXP_PWR_LINE_FREQ_DIS |  |
| EXP_PWR_LINE_FREQ_50HZ | 50 Hz |
| EXP_PWR_LINE_FREQ_60HZ | 60 Hz |

<!-- Source EN PDF p.71; unit 759 -->

#### 6.5.5  antiFlickerMode_t

<!-- Source EN PDF p.71; unit 760 -->

【说明】定义抗闪烁模式。

<!-- Source EN PDF p.71; unit 761 -->

【定义】

<!-- Source EN PDF p.71; unit 762 -->

```text
 typedef enum antiFlickerMode_e {
     ANTIFLICKER_NORMAL_MODE = 0,
     ANTIFLICKER_AUTO_MODE = 1,
 } antiFlickerMode_t;
```

<!-- Source EN PDF p.71; unit 763 -->

【成员】

<!-- Source EN PDF p.71; unit 764 -->

| 成员名称 | 说明 |
|---|---|
| ANTIFLICKER_NORMAL_MODE | 普通模式 |
| ANTIFLICKER_AUTO_MODE | 自动选择模式 |

<!-- Source EN PDF p.71; unit 765 -->

### 6.6 模块级 API 参考

<!-- Source EN PDF p.71; unit 766 -->

#### 6.6.1  rk_aiq_user_api2_ae_setExpSwAttr

<!-- Source EN PDF p.71; unit 767 -->

【说明】设置 AE 曝光软件属性。

<!-- Source EN PDF p.71; unit 768 -->

【语法】

<!-- Source EN PDF p.71; unit 769 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_setExpSwAttr(const rk_aiq_sys_ctx_t* ctx,
                                 const Uapi_ExpSwAttrV2_t expSwAttr);
```

<!-- Source EN PDF p.71; unit 770 -->

【参数】

<!-- Source EN PDF p.71; unit 771 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| expSwAttr | AE 公共功能控制参数结构体 | 输入 |

<!-- Source EN PDF p.71; unit 772 -->

【返回值】

<!-- Source EN PDF p.72; unit 773 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.72; unit 774 -->

【依赖】

<!-- Source EN PDF p.72; unit 775 -->

头文件：rk_aiq_user_api2_ae.h、rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.72; unit 776 -->

库文件：librkaiq.so

<!-- Source EN PDF p.72; unit 777 -->

【示例】

<!-- Source EN PDF p.72; unit 778 -->

设置手动曝光属性

<!-- Source EN PDF p.72; unit 779 -->

曝光分量包括 sensor 曝光时间、sensor 曝光增益和 ISP 数字增益。设置手动曝光模式后，还需分别设置各分量的手动状态（ManualGainEn、ManualTimeEn、ManualIspDgainEn）及对应手动值。手动曝光模式要求所有曝光分量均为手动；各分量取值受 sensor 和镜头限制。设置值超过 sensor 限制时，算法自动修正。

<!-- Source EN PDF p.72; unit 780 -->

```text
 Uapi_ExpSwAttrV2_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 expSwAttr.AecOpType = RK_AIQ_OP_MODE_MANUAL;
 //LinearAE
 expSwAttr.stManual.LinearAE.ManualGainEn = true;
 expSwAttr.stManual.LinearAE.ManualTimeEn = true;
 expSwAttr.stManual.LinearAE.GainValue = 1.0f; /*gain = 1x*/
 expSwAttr.stManual.LinearAE.TimeValue = 0.02f; /*time = 1/50s*/
 //HdrAE (should set all frames)
 expSwAttr.stManual.HdrAE.ManualGainEn = true;
 expSwAttr.stManual.HdrAE.ManualTimeEn = true;
 expSwAttr.stManual.HdrAE.GainValue[0] = 1.0f; /*sframe gain = 1x*/
 expSwAttr.stManual.HdrAE.TimeValue[0] = 0.002f; /*sframe time = 1/500s*/
 expSwAttr.stManual.HdrAE.GainValue[1] = 2.0f; /*mframe gain = 2x*/
 expSwAttr.stManual.HdrAE.TimeValue[1] = 0.01f; /*mframe time = 1/100s*/
 expSwAttr.stManual.HdrAE.GainValue[2] = 4.0f; /*lframe gain = 4x*/
 expSwAttr.stManual.HdrAE.TimeValue[2] = 0.02f; /*lframe time = 1/50s*/
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

<!-- Source EN PDF p.72; unit 781 -->

设置自动曝光属性

<!-- Source EN PDF p.72; unit 782 -->

自动曝光可设置各曝光分量范围；超过 sensor 限制时，算法自动修正。

<!-- Source EN PDF p.72; unit 783 -->

【注意】设置曝光分量范围所用参数，与获取该范围所用参数不同。

<!-- Source EN PDF p.72; unit 784 -->

```text
 Uapi_ExpSwAttrV2_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 expSwAttr.AecOpType = RK_AIQ_OP_MODE_AUTO;
 //set time range in struct "stAdvanced"
 expSwAttr.stAdvanced.SetAeRangeEn = true;/*must enable*/
 //LinAE
 expSwAttr.stAdvanced.SetLinAeRange.stExpTimeRange.Max = 0.04f; /*time_max =
 0.04*/
 expSwAttr.stAdvanced.SetLinAeRange.stExpTimeRange.Min = 0.001f; /*time_min =
 0.001*/
 //HdrAE
 expSwAttr.stAdvanced.SetHdrAeRange.stExpTimeRange[0].Max = 0.002f; /*sframe
 time_max = 0.02*/
 expSwAttr.stAdvanced.SetHdrAeRange.stExpTimeRange[0].Min = 0.001f; /*sframe
 time_min = 0.01*/
 expSwAttr.stAdvanced.SetHdrAeRange.stExpTimeRange[1].Max = 0.003f; /*mframe
 time_max = 0.03*/
 expSwAttr.stAdvanced.SetHdrAeRange.stExpTimeRange[1].Min = 0.002f; /*mframe
 time_min = 0.02*/
 expSwAttr.stAdvanced.SetHdrAeRange.stExpTimeRange[2].Max = 0.04f; /*lframe
 time_max = 0.03*/
 expSwAttr.stAdvanced.SetHdrAeRange.stExpTimeRange[2].Min = 0.03f; /*lframe
 time_min = 0.02*/
 //get time range in struct "stAuto"
 printf("linear time range=[%f,%f]\n",
     expSwAttr.stAuto.LinAeRange.stExpTimeRange.Min,
 expSwAttr.stAuto.LinAeRange.stExpTimeRange.Max);
 printf("hdr stime range=[%f,%f], mtime range=[%f,%f], ltime range=[%f,%f]\n",
     expSwAttr.stAuto.HdrAeRange.stExpTimeRange[0].Min,
 expSwAttr.stAuto.HdrAeRange.stExpTimeRange[0].Max,
     expSwAttr.stAuto.HdrAeRange.stExpTimeRange[1].Min,
 expSwAttr.stAuto.HdrAeRange.stExpTimeRange[1].Max,
     expSwAttr.stAuto.HdrAeRange.stExpTimeRange[2].Min,
 expSwAttr.stAuto.HdrAeRange.stExpTimeRange[2].Max);
 //set gain range in struct "stAdvanced"
 expSwAttr.stAdvanced.SetAeRangeEn = true;/*must enable*/
 //LinAE
 expSwAttr.stAdvanced.SetLinAeRange.stGainRange.Max = 32.0f; /*gain_max = 32x*/
 expSwAttr.stAdvanced.SetLinAeRange.stGainRange.Min = 1.0f; /*gain_min = 1x*/
 //HdrAE
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[0].Max = 32.0f; /*sframe gain_max
 = 2x*/
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[0].Min = 1.0f; /*sframe gain_min =
 1x*/
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[1].Max = 64.0f; /*mframe gain_max
 = 64x*/
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[1].Min = 1.0f; /*mframe gian_min =
 1x*/
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[2].Max = 64.0f; /*lframe gain_max
 = 64x*/
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[2].Min = 1.0f; /*lframe gain_min =
 1x*/
 //get gain range in struct "stAuto"
 printf("linear gain range=[%f,%f]\n",
     expSwAttr.stAuto.LinAeRange.stGainRange.Min,
 expSwAttr.stAuto.LinAeRange.stGainRange.Max);
 printf("hdr sgain range=[%f,%f], mgain range=[%f,%f], lgain range=[%f,%f]\n",
     expSwAttr.stAuto.HdrAeRange.stGainRange[0].Min,
 expSwAttr.stAuto.HdrAeRange.stGainRange[0].Max,
     expSwAttr.stAuto.HdrAeRange.stGainRange[1].Min,
 expSwAttr.stAuto.HdrAeRange.stGainRange[1].Max,
     expSwAttr.stAuto.HdrAeRange.stGainRange[2].Min,
 expSwAttr.stAuto.HdrAeRange.stGainRange[2].Max);
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

<!-- Source EN PDF p.74; unit 785 -->

设置半手动曝光属性

<!-- Source EN PDF p.74; unit 786 -->

半手动曝光要求至少一个曝光分量（sensor 曝光时间、sensor 曝光增益、ISP 数字增益）为手动，其余分量为自动，否则报错退出。例如要实现增益手动、曝光时间及 ISP 数字增益自动，有两种方式：方式 1，在手动曝光模式中将曝光时间和 ISP 数字增益的手动使能设为 false，将曝光增益的手动使能设为 true，并设置对应手动值；方式 2，在自动曝光模式中将曝光增益的最大值和最小值均设为需固定的数值。

<!-- Source EN PDF p.74; unit 787 -->

【注意】方式 1：HDR 模式各帧手动行为同步（各帧对应曝光分量的手动状态一致），且长帧最大曝光必须大于短帧最大曝光，长帧最小曝光必须大于短帧最小曝光。方式 2：HDR 模式允许各帧手动行为不同（如短帧增益手动而长帧增益自动），同时仍要求长帧最大曝光大于短帧最大曝光、长帧最小曝光大于短帧最小曝光。

<!-- Source EN PDF p.74; unit 788 -->

```text
 //Method One
 Uapi_ExpSwAttrV2_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 expSwAttr.AecOpType = RK_AIQ_OP_MODE_MANUAL;
 //LinearAE
 expSwAttr.stManual.LinearAE.ManualGainEn = true;
 expSwAttr.stManual.LinearAE.ManualTimeEn = false;
 expSwAttr.stManual.LinearAE.ManualIspDgainEn = false;
 expSwAttr.stManual.LinearAE.GainValue = 2.0f; /*gain = 2x*/
 //HdrAE (need to set all frames)
 expSwAttr.stManual.HdrAE.ManualGainEn = true;
 expSwAttr.stManual.HdrAE.ManualTimeEn = false;
 expSwAttr.stManual.HdrAE.ManualIspDgainEn = false;
 expSwAttr.stManual.HdrAE.GainValue[0] = 1.0f; /*sframe gain = 1x*/
 expSwAttr.stManual.HdrAE.GainValue[1] = 2.0f; /*mframe gain = 2x*/
 expSwAttr.stManual.HdrAE.GainValue[2] = 4.0f; /*lframe gain = 4x*/
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
 //Method Two
 Uapi_ExpSwAttrV2_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 expSwAttr.AecOpType = RK_AIQ_OP_MODE_AUTO;
 //set gain range
 expSwAttr.stAdvanced.SetAeRangeEn = true;/*Must be enabled*/
 //LinAE
 expSwAttr.stAdvanced.SetLinAeRange.stGainRange.Max = 2.0f; /*gain_max = 2x*/
 expSwAttr.stAdvanced.SetLinAeRange.stGainRange.Min = 2.0f;  /*gain_min = 2x*/
 //HdrAE (allow to set only one frame)
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[0].Max = 2.0f; /*sframe gain_max =
 2x*/
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[0].Min = 2.0f;  /*sframe gain_min
 = 2x*/
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

<!-- Source EN PDF p.75; unit 789 -->

设置固定帧率或自动降帧

<!-- Source EN PDF p.75; unit 790 -->

固定帧率模式不允许超过驱动定义的最大帧率；超出时输出日志提示，并禁用该帧率设置。

<!-- Source EN PDF p.75; unit 791 -->

```text
 //set fixed framemode
 Uapi_ExpSwAttrV2_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 expSwAttr.stAuto.stFrmRate.isFpsFix = true;
 expSwAttr.stAuto.stFrmRate.FpsValue = 25; /*fps = 25*/
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
 //set auto framemode
 Uapi_ExpSwAttrV2_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 expSwAttr.stAuto.stFrmRate.isFpsFix = false;
 /*Generally, the automatic frame reduction mode is configured by tuning personnel
 in advance with the minimum frame rate and the gain value corresponding to the
 switching frame rate*/
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

<!-- Source EN PDF p.75; unit 792 -->

设置曝光调节速度和延迟帧参数

<!-- Source EN PDF p.75; unit 793 -->

```text
 Uapi_ExpSwAttrV2_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 //set ae speed
 expSwAttr.stAuto.stAeSpeed.DampOver = 0.8f;
 expSwAttr.stAuto.stAeSpeed.DampDark2Bright = 0.8f;
 expSwAttr.stAuto.stAeSpeed.DampUnder = 0.8f;
 expSwAttr.stAuto.stAeSpeed.DampBright2Dark = 0.8f;
 //set ae delay
 expSwAttr.stAuto.BlackDelayFrame = 2;
 expSwAttr.stAuto.WhiteDelayFrame = 4;
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

<!-- Source EN PDF p.75; unit 794 -->

设置抗闪烁

<!-- Source EN PDF p.75; unit 795 -->

```text
 Uapi_ExpSwAttr_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 //set antifilicker mode
 expSwAttr.stAuto.stAntiFlicker.enable = true;
 expSwAttr.stAuto.stAntiFlicker.Frequency = AECV2_FLICKER_FREQUENCY_50HZ;
 expSwAttr.stAuto.stAntiFlicker.Mode = AECV2_ANTIFLICKER_AUTO_MODE;
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

<!-- Source EN PDF p.75; unit 796 -->

设置 AE 权重

<!-- Source EN PDF p.76; unit 797 -->

设置 15X15 权重，算法按实际硬件分块规格压缩权重。目前有两种方法：直接修改 JSON 中的权重；或通过 stadvanced 修改，取消使能后可恢复 JSON 权重，推荐后一种。

<!-- Source EN PDF p.76; unit 798 -->

人脸应用建议在人脸出现时设置 expSwAttr.stAdvanced.enable = true，使用 expSwAttr.stAdvanced 中的权重；人脸消失时设为 false，恢复原始权重。

<!-- Source EN PDF p.76; unit 799 -->

```text
 Uapi_ExpSwAttr_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 uint8_t GridWeights[225]={
 0,  0, 1,  2,  2,  3,  4,  5,  4, 3,  2,  2,  1,  0,  0,
 0,  1, 2,  3,  3,  4,  5,  6,  5, 4,  3,  3,  2,  1,  0,
 1,  2, 3,  5,  5,  6,  7,  8,  7, 6,  5,  5,  3,  2,  1,
 2,  3, 5,  7,  7,  8,  9, 10,  9, 8,  7,  7,  5,  3,  2,
 2,  3, 5,  7,  8,  9, 10, 11, 10, 9,  8,  7,  5,  3,  2,
 2,  4, 6,  8,  9, 10, 11, 12, 11,10,  9,  8,  6,  4,  2,
 2,  4, 6,  9, 10, 11, 12, 13, 12,11, 10,  9,  6,  4,  2,
 3,  5 ,7, 10, 11, 12, 13, 14, 13,12, 11, 10,  7,  5,  3,
 2,  4, 6,  9, 10, 11, 12, 13, 12,11, 10,  9,  6,  4,  2,
 2,  4, 6,  8,  9, 10, 11, 12, 11,10,  9,  8,  6,  4,  2,
 2,  3, 5,  7,  8,  9, 10, 11, 10, 9,  8,  7,  5,  3,  2,
 2,  3, 5,  7,  7,  8,  9, 10,  9, 8,  7,  7,  5,  3,  2,
 1,  2, 4,  6,  6,  7,  8,  9,  8, 7,  6,  6,  4,  2,  1,
 0,  1, 3,  5,  5,  6,  7,  8,  7, 6,  5,  5,  3,  1,  0,
 0,  1, 3,  5,  5,  6,  7,  8,  7, 6,  5,  5,  3,  1,  0
 };
 //method one：
 memcpy(expSwAttr.GridWeights.uCoeff, GridWeights,
 sizeof(expSwAttr.GridWeights.uCoeff));
 //method two:
 expSwAttr.stAdvanced.enable = true; //important! true means preferring to use these parameters
 memcpy(expSwAttr.stAdvanced.GridWeights, GridWeights,
 sizeof(expSwAttr.stAdvanced.GridWeights));
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

<!-- Source EN PDF p.76; unit 800 -->

#### 6.6.2  rk_aiq_user_api2_ae_getExpSwAttr

<!-- Source EN PDF p.76; unit 801 -->

【说明】获取 AE 曝光软件属性。

<!-- Source EN PDF p.76; unit 802 -->

【语法】

<!-- Source EN PDF p.76; unit 803 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_getExpSwAttr(const rk_aiq_sys_ctx_t* ctx,
                         Uapi_ExpSwAttrV2_t* pExpSwAttr);
```

<!-- Source EN PDF p.77; unit 804 -->

【参数】

<!-- Source EN PDF p.77; unit 805 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| pExpSwAttr | AE 曝光软件属性结构体指针 | 输出 |

<!-- Source EN PDF p.77; unit 806 -->

【返回值】

<!-- Source EN PDF p.77; unit 807 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.77; unit 808 -->

【依赖】

<!-- Source EN PDF p.77; unit 809 -->

头文件：rk_aiq_user_api2_ae.h、rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.77; unit 810 -->

库文件：librkaiq.so

<!-- Source EN PDF p.77; unit 811 -->

#### 6.6.3  rk_aiq_user_api2_ae_setLinAeRouteAttr

<!-- Source EN PDF p.77; unit 812 -->

【说明】设置线性模式 AE 的场景曝光分配策略。

<!-- Source EN PDF p.77; unit 813 -->

【语法】

<!-- Source EN PDF p.77; unit 814 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_setLinAeRouteAttr(const rk_aiq_sys_ctx_t* ctx, const
 Uapi_LinAeRouteAttr_t linAeRouteAttr);
```

<!-- Source EN PDF p.77; unit 815 -->

【参数】

<!-- Source EN PDF p.77; unit 816 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| linAeRouteAttr | AE 曝光分配策略结构体 | 输入 |

<!-- Source EN PDF p.77; unit 817 -->

【返回值】

<!-- Source EN PDF p.77; unit 818 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.77; unit 819 -->

【依赖】

<!-- Source EN PDF p.77; unit 820 -->

头文件：rk_aiq_user_api2_ae.h、rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.77; unit 821 -->

库文件：librkaiq.so

<!-- Source EN PDF p.78; unit 822 -->

【示例】

<!-- Source EN PDF p.78; unit 823 -->

```text
 Uapi_LinAeRouteAttr_t LinAeRouteAttr;
 memset(&LinAeRouteAttr,0x00,sizeof(Uapi_LinAeRouteAttr_t));
 rk_aiq_user_api2_ae_getLinAeRouteAttr(sys_ctx,&LinAeRouteAttr);
 int len = 8;
 float TimeDot[8]={0,0.01,0.01,0.02,0.02,0.03,0.03,0.04};
 float GainDot[8]={1,1,4,4,8,8,16,32};
 float IspGainDot[8]={1,1,1,1,1,1,1,1};
 int PirisDot[8]={512,512,512,512,512,512,512,512};
 LinAeRouteAttr.TimeDot_len = len;
 LinAeRouteAttr.GainDot_len = len;
 LinAeRouteAttr.IspDGainDot_len = len;
 LinAeRouteAttr.PIrisDot_len = len;
 LinAeRouteAttr.GainDot = GainDot;
 LinAeRouteAttr.IspDGainDot = IspGainDot;
 LinAeRouteAttr.TimeDot = TimeDot;
 LinAeRouteAttr.PIrisDot = PirisDot;
 rk_aiq_user_api2_ae_setLinAeRouteAttr(sys_ctx,LinAeRouteAttr);
```

<!-- Source EN PDF p.78; unit 824 -->

#### 6.6.4  rk_aiq_user_api2_ae_getLinAeRouteAttr

<!-- Source EN PDF p.78; unit 825 -->

【说明】获取线性模式 AE 的场景曝光分配策略。

<!-- Source EN PDF p.78; unit 826 -->

【语法】

<!-- Source EN PDF p.78; unit 827 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_getLinAeRouteAttr(const rk_aiq_sys_ctx_t* ctx,
 Uapi_LinAeRouteAttr_t* pLinAeRouteAttr);
```

<!-- Source EN PDF p.78; unit 828 -->

【参数】

<!-- Source EN PDF p.78; unit 829 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| pLinAeRouteAttr | AE 曝光分配策略结构体指针 | 输出 |

<!-- Source EN PDF p.78; unit 830 -->

【返回值】

<!-- Source EN PDF p.78; unit 831 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.78; unit 832 -->

【依赖】

<!-- Source EN PDF p.79; unit 833 -->

头文件：rk_aiq_user_api2_ae.h、rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.79; unit 834 -->

库文件：librkaiq.so

<!-- Source EN PDF p.79; unit 835 -->

#### 6.6.5  rk_aiq_user_api2_ae_setHdrAeRouteAttr

<!-- Source EN PDF p.79; unit 836 -->

【说明】设置 HDR 模式 AE 的场景曝光分配策略。

<!-- Source EN PDF p.79; unit 837 -->

【语法】

<!-- Source EN PDF p.79; unit 838 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_setHdrAeRouteAttr(const rk_aiq_sys_ctx_t* ctx, const
 Uapi_HdrAeRouteAttr_t hdrAeRouteAttr);
```

<!-- Source EN PDF p.79; unit 839 -->

【参数】

<!-- Source EN PDF p.79; unit 840 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| hdrAeRouteAttr | AE 曝光分配策略结构体 | 输入 |

<!-- Source EN PDF p.79; unit 841 -->

【返回值】

<!-- Source EN PDF p.79; unit 842 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.79; unit 843 -->

【依赖】

<!-- Source EN PDF p.79; unit 844 -->

头文件：rk_aiq_user_api2_ae.h、rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.79; unit 845 -->

库文件：librkaiq.so

<!-- Source EN PDF p.79; unit 846 -->

【示例】

<!-- Source EN PDF p.79; unit 847 -->

```text
 Uapi_HdrAeRouteAttr_t stHdrRoute;
 memset(&stHdrRoute,0x00,sizeof(Uapi_HdrAeRouteAttr_t));
 ret = rk_aiq_user_api2_ae_getHdrAeRouteAttr(ctx,&stHdrRoute);
 int len = 6;
 float HdrTimeDot[3][6] = {0.0, 0.01, 0.01, 0.01, 0.01, 0.01,
                           0.0, 0.02, 0.02, 0.02, 0.02, 0.02,
                           0.0, 0.03, 0.03, 0.03, 0.03, 0.03};
 float HdrGainDot[3][6] = {1, 1, 4, 6, 8, 12,
                           1, 1, 4, 6, 8, 12,
                           1, 1, 4, 6, 8, 12};
 float HdrIspDGainDot[3][6] = {1, 1, 1, 1, 1, 1,
                               1, 1, 1, 1, 1, 1,
                               1, 1, 1, 1, 1, 1};
 int   HdrPIrisGainDot[6] = {1, 1, 1, 1, 1, 1};
 stHdrRoute.Frm0TimeDot_len = len;
 stHdrRoute.Frm0GainDot_len = len;
 stHdrRoute.Frm0IspDGainDot_len = len;
 stHdrRoute.Frm1TimeDot_len = len;
 stHdrRoute.Frm1GainDot_len = len;
 stHdrRoute.Frm1IspDGainDot_len = len;
 stHdrRoute.Frm2TimeDot_len = len;
 stHdrRoute.Frm2GainDot_len = len;
 stHdrRoute.Frm2IspDGainDot_len = len;
 stHdrRoute.PIrisDot_len = len;
 stHdrRoute.Frm0TimeDot = HdrTimeDot[0];
 stHdrRoute.Frm0GainDot = HdrGainDot[0];
 stHdrRoute.Frm0IspDGainDot = HdrIspDGainDot[0];
 stHdrRoute.Frm1TimeDot = HdrTimeDot[1];
 stHdrRoute.Frm1GainDot = HdrGainDot[1];
 stHdrRoute.Frm1IspDGainDot = HdrIspDGainDot[1];
 stHdrRoute.Frm2TimeDot = HdrTimeDot[2];
 stHdrRoute.Frm2GainDot = HdrGainDot[2];
 stHdrRoute.Frm2IspDGainDot = HdrIspDGainDot[2];
 stHdrRoute.PIrisDot = HdrPIrisGainDot;
 ret = rk_aiq_user_api2_ae_setHdrAeRouteAttr(ctx,stHdrRoute);
```

<!-- Source EN PDF p.80; unit 848 -->

#### 6.6.6  rk_aiq_user_api2_ae_getHdrAeRouteAttr

<!-- Source EN PDF p.80; unit 849 -->

【说明】获取 HDR 模式 AE 的场景曝光分配策略。

<!-- Source EN PDF p.80; unit 850 -->

【语法】

<!-- Source EN PDF p.80; unit 851 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_getHdrAeRouteAttr(const rk_aiq_sys_ctx_t* ctx,
 Uapi_HdrAeRouteAttr_t* pHdrAeRouteAttr);
```

<!-- Source EN PDF p.80; unit 852 -->

【参数】

<!-- Source EN PDF p.80; unit 853 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| pHdrAeRouteAttr | AE 曝光分配策略结构体指针 | 输出 |

<!-- Source EN PDF p.80; unit 854 -->

【返回值】

<!-- Source EN PDF p.80; unit 855 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.80; unit 856 -->

【依赖】

<!-- Source EN PDF p.81; unit 857 -->

头文件：rk_aiq_user_api2_ae.h、rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.81; unit 858 -->

库文件：librkaiq.so

<!-- Source EN PDF p.81; unit 859 -->

#### 6.6.7  rk_aiq_user_api2_ae_setLinExpAttr

<!-- Source EN PDF p.81; unit 860 -->

【说明】设置 AE 线性模式曝光参数。

<!-- Source EN PDF p.81; unit 861 -->

【语法】

<!-- Source EN PDF p.81; unit 862 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_setLinExpAttr(const rk_aiq_sys_ctx_t* ctx, const
 Uapi_LinExpAttrV2_t linExpAttr);
```

<!-- Source EN PDF p.81; unit 863 -->

【参数】

<!-- Source EN PDF p.81; unit 864 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| linExpAttr | AE 曝光参数结构体 | 输入 |

<!-- Source EN PDF p.81; unit 865 -->

【返回值】

<!-- Source EN PDF p.81; unit 866 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.81; unit 867 -->

【依赖】

<!-- Source EN PDF p.81; unit 868 -->

头文件：rk_aiq_user_api2_ae.h、rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.81; unit 869 -->

库文件：librkaiq.so

<!-- Source EN PDF p.81; unit 870 -->

【示例】

<!-- Source EN PDF p.81; unit 871 -->

设置线性 AE 曝光参数，包括但不限于亮度调整强度 Evbias、背光补偿 BackLightCtrl、强光抑制 OverExpCtrl 等。背光补偿与强光抑制不能同时开启。

<!-- Source EN PDF p.81; unit 872 -->

```text
 Uapi_LinExpAttrV2_t linExpAttr;
 memset(&linExpAttr,0,sizeof(Uapi_LinExpAttrV2_t));
 ret = rk_aiq_user_api2_ae_getLinExpAttr(ctx, &linExpAttr);
 //set Evbias
 printf("Evbias=%f\n", linExpAttr.Evbias);
 linExpAttr.Evbias = 100.0f;
 //set BackLightCtrl
 linExpAttr.BackLightCtrl.Enable = true;
 linExpAttr.BackLightCtrl.StrBias = 200.0f;
 //set OverExpCtrl
 linExpAttr.OverExpCtrl.Enable = true;
 linExpAttr.OverExpCtrl.StrBias = 100.0f;
 ret = rk_aiq_user_api2_ae_setLinExpAttr(ctx, linExpAttr);
```

<!-- Source EN PDF p.82; unit 873 -->

#### 6.6.8  rk_aiq_user_api2_ae_getLinExpAttr

<!-- Source EN PDF p.82; unit 874 -->

【说明】获取 AE 线性模式曝光参数。

<!-- Source EN PDF p.82; unit 875 -->

【语法】

<!-- Source EN PDF p.82; unit 876 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_getLinExpAttr(const rk_aiq_sys_ctx_t* ctx,
 Uapi_LinExpAttrV2_t* pLinExpAttr);
```

<!-- Source EN PDF p.82; unit 877 -->

【参数】

<!-- Source EN PDF p.82; unit 878 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| pLinExpAttr | AE 曝光参数结构体指针 | 输出 |

<!-- Source EN PDF p.82; unit 879 -->

【返回值】

<!-- Source EN PDF p.82; unit 880 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.82; unit 881 -->

【依赖】

<!-- Source EN PDF p.82; unit 882 -->

头文件：rk_aiq_user_api2_ae.h、rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.82; unit 883 -->

库文件：librkaiq.so

<!-- Source EN PDF p.82; unit 884 -->

#### 6.6.9  rk_aiq_user_api2_ae_setHdrExpAttr

<!-- Source EN PDF p.82; unit 885 -->

【说明】设置 AE HDR 模式曝光参数。

<!-- Source EN PDF p.82; unit 886 -->

【语法】

<!-- Source EN PDF p.82; unit 887 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_setHdrExpAttr(const rk_aiq_sys_ctx_t* ctx, const
 Uapi_HdrExpAttrV2_t hdrExpAttr);
```

<!-- Source EN PDF p.82; unit 888 -->

【参数】

<!-- Source EN PDF p.83; unit 889 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| hdrExpAttr | AE 曝光参数结构体 | 输入 |

<!-- Source EN PDF p.83; unit 890 -->

【返回值】

<!-- Source EN PDF p.83; unit 891 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.83; unit 892 -->

【依赖】

<!-- Source EN PDF p.83; unit 893 -->

头文件：rk_aiq_user_api2_ae.h、rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.83; unit 894 -->

库文件：librkaiq.so

<!-- Source EN PDF p.83; unit 895 -->

【示例】

<!-- Source EN PDF p.83; unit 896 -->

设置 HDR AE 曝光参数，包括但不限于手动/自动曝光比及亮度调整强度 Evbias。

<!-- Source EN PDF p.83; unit 897 -->

```text
 Uapi_HdrExpAttrV2_t HdrExpAttr;
 memset(&HdrExpAttr,0,sizeof(Uapi_HdrExpAttrV2_t));
 ret = rk_aiq_user_api2_ae_getHdrExpAttr(ctx, &HdrExpAttr);
 //set hdr mframe params
 int len = 8;
 float explevel[8] = {0, 0.096, 0.192, 0.384, 0.96, 1.344, 1.92, 3};
 float setpoint[8] = {50, 45, 40, 35, 30, 25, 20, 15};
 HdrExpAttr.HdrAEAttr.MframeCtrl.MExpLevel_len = len;
 HdrExpAttr.HdrAEAttr.MframeCtrl.MSetPoint_len = len;
 HdrExpAttr.HdrAEAttr.MframeCtrl.MExpLevel = explevel;
 HdrExpAttr.HdrAEAttr.MframeCtrl.MSetPoint = setpoint;
 //set ExpRatioType (AUTO/FIX)
 HdrExpAttr.ExpRatioCtrl.ExpRatioType = AECV2_HDR_RATIOTYPE_MODE_AUTO;
 //set Evbias
 HdrExpAttr.Evbias = -100.0f;
 ret = rk_aiq_user_api2_ae_setHdrExpAttr(ctx, HdrExpAttr);
```

<!-- Source EN PDF p.83; unit 898 -->

#### 6.6.10  rk_aiq_user_api2_ae_getHdrExpAttr

<!-- Source EN PDF p.83; unit 899 -->

【说明】获取 AE HDR 模式曝光参数。

<!-- Source EN PDF p.83; unit 900 -->

【语法】

<!-- Source EN PDF p.84; unit 901 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_getHdrExpAttr(const rk_aiq_sys_ctx_t* ctx,
 Uapi_HdrExpAttrV2_t* pHdrExpAttr);
```

<!-- Source EN PDF p.84; unit 902 -->

【参数】

<!-- Source EN PDF p.84; unit 903 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| pHdrExpAttr | AE 曝光参数结构体指针 | 输出 |

<!-- Source EN PDF p.84; unit 904 -->

【返回值】

<!-- Source EN PDF p.84; unit 905 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.84; unit 906 -->

【依赖】

<!-- Source EN PDF p.84; unit 907 -->

头文件：rk_aiq_user_api2_ae.h、rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.84; unit 908 -->

库文件：librkaiq.so

<!-- Source EN PDF p.84; unit 909 -->

#### 6.6.11  rk_aiq_user_api2_ae_setIrisAttr

<!-- Source EN PDF p.84; unit 910 -->

【说明】设置 AE 光圈控制参数。

<!-- Source EN PDF p.84; unit 911 -->

【语法】

<!-- Source EN PDF p.84; unit 912 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_setIrisAttr(const rk_aiq_sys_ctx_t * sys_ctx, const
 Uapi_IrisAttrV2_t irisAttr);
```

<!-- Source EN PDF p.84; unit 913 -->

【参数】

<!-- Source EN PDF p.84; unit 914 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| irisAttr | 光圈控制参数结构体 | 输入 |

<!-- Source EN PDF p.84; unit 915 -->

【返回值】

<!-- Source EN PDF p.84; unit 916 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.85; unit 917 -->

【依赖】

<!-- Source EN PDF p.85; unit 918 -->

头文件：rk_aiq_user_api2_ae.h、rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.85; unit 919 -->

库文件：librkaiq.so

<!-- Source EN PDF p.85; unit 920 -->

【示例】

<!-- Source EN PDF p.85; unit 921 -->

```text
 Uapi_IrisAttrV2_t irisAttr;
 ret = rk_aiq_user_api2_ae_getIrisAttr(ctx, &irisAttr);
 irisAttr.enable = true; /*run AIris*/
 //set P-iris attributes
 irisAttr.IrisType = IRIS_P_TYPE;
 irisAttr.PIrisAttr.TotalStep = 81;
 irisAttr.PIrisAttr.EffcStep = 44;
 irisAttr.PIrisAttr.ZeroIsMax = true;
 uint16_t StepTable[1024] = {512, 511, 506, 499, 491, 483, 474, 465, 456,
                             446, 437, 427, 417, 408, 398, 388, 378, 368,
                             359, 349, 339, 329, 319, 309, 300, 290, 280,
                             271, 261, 252, 242, 233, 224, 214, 205, 196,
                             187, 178, 170, 161, 153, 144, 136, 128, 120,
                             112, 105, 98, 90, 83, 77, 70, 64, 58,
                             52, 46, 41, 36, 31, 27, 23, 19, 16,
                             13, 10, 8, 6, 4, 3, 1, 1, 0,
                             0, 0, 0, 0, 0, 0, 0, 0, 0};
 memcpy(irisAttr.PIrisAttr.StepTable,StepTable,sizeof(irisAttr.PIrisAttr.StepTable
 ));
 ret = rk_aiq_user_api2_ae_setIrisAttr(ctx, irisAttr);
 //set DC-iris attributes
 irisAttr.IrisType = IRIS_DC_TYPE;
 irisAttr.DCIrisAttr.Kp= 0.5f;
 irisAttr.DCIrisAttr.Ki= 0.2f;
 irisAttr.DCIrisAttr.Kd = 0.3f;
 irisAttr.DCIrisAttr.OpenPwmDuty = 40;
 irisAttr.DCIrisAttr.ClosePwmDuty = 22;
 irisAttr.DCIrisAttr.MinPwmDuty = 0;
 irisAttr.DCIrisAttr.MaxPwmDuty = 100;
 ret = rk_aiq_user_api2_ae_setIrisAttr(ctx, irisAttr);
 //set manual iris with auto ae
 irisAttr.IrisOpType = RK_AIQ_OP_MODE_MANUAL;
 if(irisAttr.IrisType == IRIS_P_TYPE);
     irisAttr.ManualAttr.PIrisGainValue = 512; /*p-iris F#=1.4*/
 if(irisAttr.IrisType == IRIS_DC_TYPE);
     irisAttr.ManualAttr.DCIrisHoldValue = 20; /*dc-iris PwmDuty=20*/
 ret = rk_aiq_user_api2_ae_setIrisAttr(ctx, irisAttr);
```

<!-- Source EN PDF p.85; unit 922 -->

#### 6.6.12  rk_aiq_user_api2_ae_getIrisAttr

<!-- Source EN PDF p.85; unit 923 -->

【说明】获取 AE 光圈控制参数。

<!-- Source EN PDF p.85; unit 924 -->

【语法】

<!-- Source EN PDF p.86; unit 925 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_getIrisAttr(const rk_aiq_sys_ctx_t * sys_ctx, const
 Uapi_IrisAttrV2_t* irisAttr);
```

<!-- Source EN PDF p.86; unit 926 -->

【参数】

<!-- Source EN PDF p.86; unit 927 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| irisAttr | 光圈控制参数结构体 | 输出 |

<!-- Source EN PDF p.86; unit 928 -->

【返回值】

<!-- Source EN PDF p.86; unit 929 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.86; unit 930 -->

【依赖】

<!-- Source EN PDF p.86; unit 931 -->

头文件：rk_aiq_user_api2_ae.h、rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.86; unit 932 -->

库文件：librkaiq.so

<!-- Source EN PDF p.86; unit 933 -->

#### 6.6.13  rk_aiq_user_api2_ae_setExpWinAttr

<!-- Source EN PDF p.86; unit 934 -->

【说明】设置 AE 统计窗口属性。

<!-- Source EN PDF p.86; unit 935 -->

【语法】

<!-- Source EN PDF p.86; unit 936 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_setExpWinAttr(const rk_aiq_sys_ctx_t* sys_ctx, const
 Uapi_ExpWin_t ExpWin);
```

<!-- Source EN PDF p.86; unit 937 -->

【参数】

<!-- Source EN PDF p.86; unit 938 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| ExpWin | 窗口属性参数 | 输入 |

<!-- Source EN PDF p.86; unit 939 -->

【返回值】

<!-- Source EN PDF p.86; unit 940 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.87; unit 941 -->

【依赖】

<!-- Source EN PDF p.87; unit 942 -->

头文件：rk_aiq_user_api2_ae.h、rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.87; unit 943 -->

库文件：librkaiq.so

<!-- Source EN PDF p.87; unit 944 -->

【示例】

<!-- Source EN PDF p.87; unit 945 -->

按人脸位置修改 AE 统计坐标，实现人脸区域亮度统计。

<!-- Source EN PDF p.87; unit 946 -->

注意：设置统计坐标时，应保证 ExpWin.h_offs+ExpWin.h_size&lt;=pic_width 且 ExpWin.v_offs+ExpWin.v_size&lt;=pic_height。

<!-- Source EN PDF p.87; unit 947 -->

```text
 Uapi_ExpWin_t ExpWin;
 //Suppose the sensor resolution is 2688X1520, the lateral offset of the face from the upper left corner of the screen is 100 pixel, the vertical offset is 100 pixel, and the face size is a square with a side length of 100 pixel
 ExpWin.h_offs=100;
 ExpWin.v_offs=100;
 ExpWin.h_size=100;
 ExpWin.v_size=100;
 rk_aiq_user_api2_ae_setExpWinAttr(ctx, ExpWin);
```

<!-- Source EN PDF p.87; unit 948 -->

#### 6.6.14  rk_aiq_user_api2_ae_getExpWinAttr

<!-- Source EN PDF p.87; unit 949 -->

【说明】获取 AE 统计窗口属性。

<!-- Source EN PDF p.87; unit 950 -->

【语法】

<!-- Source EN PDF p.87; unit 951 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_getExpWinAttr(const rk_aiq_sys_ctx_t* sys_ctx,const
 Uapi_ExpWin_t* ExpWin);
```

<!-- Source EN PDF p.87; unit 952 -->

【参数】

<!-- Source EN PDF p.87; unit 953 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| ExpWin | 窗口属性参数 | 输出 |

<!-- Source EN PDF p.87; unit 954 -->

【返回值】

<!-- Source EN PDF p.87; unit 955 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.87; unit 956 -->

【依赖】

<!-- Source EN PDF p.87; unit 957 -->

头文件：rk_aiq_user_api2_ae.h、rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.88; unit 958 -->

库文件：librkaiq.so

<!-- Source EN PDF p.88; unit 959 -->

#### 6.6.15  rk_aiq_user_api2_ae_queryExpResInfo

<!-- Source EN PDF p.88; unit 960 -->

【说明】获取 AE 内部状态信息。

<!-- Source EN PDF p.88; unit 961 -->

【语法】

<!-- Source EN PDF p.88; unit 962 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_queryExpResInfo(const rk_aiq_sys_ctx_t* ctx,
 Uapi_ExpQueryInfo_t* pExpResInfo);
```

<!-- Source EN PDF p.88; unit 963 -->

【参数】

<!-- Source EN PDF p.88; unit 964 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| pExpResInfo | AE 内部状态信息结构体指针 | 输出 |

<!-- Source EN PDF p.88; unit 965 -->

【返回值】

<!-- Source EN PDF p.88; unit 966 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.88; unit 967 -->

【依赖】

<!-- Source EN PDF p.88; unit 968 -->

头文件：rk_aiq_user_api2_ae.h、rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.88; unit 969 -->

库文件：librkaiq.so

<!-- Source EN PDF p.88; unit 970 -->

### 6.7 模块级 API 数据类型

<!-- Source EN PDF p.88; unit 971 -->

#### 6.7.1  Uapi_ExpSwAttr_t

<!-- Source EN PDF p.88; unit 972 -->

【说明】

<!-- Source EN PDF p.88; unit 973 -->

AE 公共功能控制参数结构体。

<!-- Source EN PDF p.88; unit 974 -->

【定义】

<!-- Source EN PDF p.89; unit 975 -->

```text
 typedef struct Uapi_ExpSwAttrV2_s {
     rk_aiq_uapi_sync_t                 sync;
     uint8_t                            Enable;
     CalibDb_CamRawStatsModeV2_t        RawStatsMode;
     CalibDb_CamHistStatsModeV2_t       HistStatsMode;
     CalibDb_CamYRangeModeV2_t          YRangeMode;
     uint8_t                            AecRunInterval;
     RKAiqOPMode_t                      AecOpType;
     Cam15x15UCharMatrix_t              GridWeights;
     Uapi_AeAttrV2_t                    stAuto;
     Uapi_MeAttrV2_t                    stManual;
     Uapi_ExpSwAttr_AdvancedV2_t        stAdvanced;
 } Uapi_ExpSwAttrV2_t;
```

<!-- Source EN PDF p.89; unit 976 -->

【成员】

<!-- Source EN PDF p.89; unit 977 -->

| 成员名称 | 说明 |
|---|---|
| sync | rk_aiq_uapi_sync_t 的定义参见“概述/API 说明”。 |
| Enable | AEC 使能开关：1 开启算法；0 关闭算法，曝光保持关闭前的数值。 |
| RawStatsMode | AEC 亮度统计模式，有 CAM_RAWSTATSV2_MODE_Y/R/G/B 四种，默认 Y。 |
| HistStatsMode | AEC 直方图统计模式。原文称“五种”，列出 CAM_HISTV2_MODE_Y/R/G/B，默认 Y；数量疑点保留。 |
| YRangeMode | AEC Y 通道范围：CAM_YRANGEV2_MODE_FULL/LIMITED 两种，默认 FULL。 |
| AecRunInterval | AE 算法运行间隔，范围 [0,255]，默认 0。0 表示每帧运行；1 表示每隔 1 帧运行，依此类推。 |
| AecOpType | 曝光模式分自动（RK_AIQ_OP_MODE_AUTO）和手动（RK_AIQ_OP_MODE_MANUAL），默认 AUTO。手动模式须配合 stManual 设置手动曝光值。 |
| GridWeights | 窗口（直方图）权重，包含 15*15 个数组元素，范围 [0,32]。 |
| stAuto | 自动曝光参数结构体 |
| stManual | 手动曝光参数结构体 |
| stAdvanced | 参数结构体 |

<!-- Source EN PDF p.89; unit 978 -->

相关数据类型

<!-- Source EN PDF p.89; unit 979 -->

rk_aiq_uapi_sync_t

<!-- Source EN PDF p.89; unit 980 -->

Uapi_ExpSwAttr_AdvancedV2_t

<!-- Source EN PDF p.89; unit 981 -->

Uapi_AeAttrV2_t

<!-- Source EN PDF p.90; unit 982 -->

Uapi_MeAttrV2_t

<!-- Source EN PDF p.90; unit 983 -->

6.7.1.1  Uapi_ExpSwAttr_AdvancedV2_t

<!-- Source EN PDF p.90; unit 984 -->

【说明】

<!-- Source EN PDF p.90; unit 985 -->

优先采用参数结构体。

<!-- Source EN PDF p.90; unit 986 -->

【定义】

<!-- Source EN PDF p.90; unit 987 -->

```text
 typedef struct Aec_uapi_advanced_attr_s {
     bool                          enable;
     uint8_t                       GridWeights[15 * 15];
     bool                          SetAeRangeEn;
     Aec_LinAeRange_t              SetLinAeRange;
     Aec_HdrAeRange_t              SetHdrAeRange;
 } Aec_uapi_advanced_attr_t;
 typedef Aec_uapi_advanced_attr_t Uapi_ExpSwAttr_AdvancedV2_t;
```

<!-- Source EN PDF p.90; unit 988 -->

【成员】

<!-- Source EN PDF p.90; unit 989 -->

| 成员名称 | 说明 |
|---|---|
| enable | 设为 1 时优先使用结构体中的参数。 |
| GridWeights | AE 权重，大小 15X15。 |
| SetAeRangeEn | 1：设置自动曝光分量范围；0：不设置，采用调试文件中的范围。 |
| SetLinAeRange | 线性曝光的自动曝光分量范围设置值，并非最终生效范围。 |
| SetHdrAeRange | HDR 自动曝光分量范围设置值，并非最终生效范围。 |

<!-- Source EN PDF p.90; unit 990 -->

【注意事项】

<!-- Source EN PDF p.90; unit 991 -->

Uapi_ExpSwAttrV2_t 结构体定义一组 15X15 AE 权重，算法按硬件实际权重数量展开。若需人脸等区域曝光，可使用 Uapi_ExpSwAttr_AdvancedV2_t 中另一组 15X15 AE 权重，算法按硬件实际配置数量压缩。要使用 Uapi_ExpSwAttr_Advanced_t 中的权重，必须将 enable 设为 1。原文末处类型名缺少 V2，按原文保留。

<!-- Source EN PDF p.90; unit 992 -->

通过 API 设置 AE 参数范围时，SetAeRangeEn 必须为 1，否则默认使用调试文件中的自动曝光范围。按模式分别用 SetLinAeRange 和 SetHdrAeRange；后者支持为每帧设置范围。最终有效的曝光时间和增益范围须查询 stAuto；这里保存的仅为设置范围，并非最终生效范围。

<!-- Source EN PDF p.91; unit 993 -->

6.7.1.1.1 Aec_AeRange_t

<!-- Source EN PDF p.91; unit 994 -->

【说明】定义 AE 参数范围。

<!-- Source EN PDF p.91; unit 995 -->

【定义】

<!-- Source EN PDF p.91; unit 996 -->

```text
 typedef struct Aec_AeRange_s {
     float                   Min;
     float                   Max;
 } Aec_AeRange_t;
```

<!-- Source EN PDF p.91; unit 997 -->

【成员】

<!-- Source EN PDF p.91; unit 998 -->

| 成员名称 | 说明 |
|---|---|
| Min | 下限值 |
| Max | 上限值 |

<!-- Source EN PDF p.91; unit 999 -->

6.7.1.1.2 Aec_LinAeRange_t

<!-- Source EN PDF p.91; unit 1000 -->

【说明】定义线性模式 AE 参数范围。

<!-- Source EN PDF p.91; unit 1001 -->

【定义】

<!-- Source EN PDF p.91; unit 1002 -->

```text
 typedef struct Aec_LinAeRange_s {
     Aec_AeRange_t      stExpTimeRange;
     Aec_AeRange_t      stGainRange;
     Aec_AeRange_t      stIspDGainRange;
     Aec_AeRange_t      stPIrisRange;
 } Aec_LinAeRange_t;
```

<!-- Source EN PDF p.91; unit 1003 -->

【成员】

<!-- Source EN PDF p.91; unit 1004 -->

| 成员名称 | 说明 |
|---|---|
| stExpTimeRange | 曝光时间范围，最大值和最小值以毫秒设置（原文单位）。 |
| stGainRange | Sensor 模拟增益范围，设置最大值和最小值。 |
| stIspDGainRange | ISP 数字增益范围，设置最大值和最小值。 |
| stPIrisRange | 光圈等效增益范围，仅支持 P-Iris 光圈大小控制。 |

<!-- Source EN PDF p.91; unit 1005 -->

【注意事项】

<!-- Source EN PDF p.91; unit 1006 -->

各曝光分量最大/最小值均为默认 0 时，所设置范围不生效，实际最大/最小值由 AecRoute 曝光分解路由节点决定。

<!-- Source EN PDF p.92; unit 1007 -->

各曝光分量最大/最小值非 0 时，设置范围生效。如果未超出 sensor 或 ISP 限制，实际边界以设置范围为准，同时修正 AecRoute 节点边界；若超出限制，则实际边界以 AecRoute 节点最大/最小值为准。

<!-- Source EN PDF p.92; unit 1008 -->

6.7.1.1.3 Aec_HdrAeRange_t

<!-- Source EN PDF p.92; unit 1009 -->

【说明】定义 HDR 模式 AE 参数范围。

<!-- Source EN PDF p.92; unit 1010 -->

【定义】

<!-- Source EN PDF p.92; unit 1011 -->

```text
 typedef struct Aec_HdrAeRange_s {
     Aec_AeRange_t      stExpTimeRange[3];
     Aec_AeRange_t      stGainRange[3];
     Aec_AeRange_t      stIspDGainRange[3];
     Aec_AeRange_t      stPIrisRange;
 } Aec_HdrAeRange_t;
```

<!-- Source EN PDF p.92; unit 1012 -->

【成员】

<!-- Source EN PDF p.92; unit 1013 -->

| 成员名称 | 说明 |
|---|---|
| stExpTimeRange | 曝光时间范围，最大/最小值单位为秒；数组 0/1/2 分别对应短、中、长帧。 |
| stGainRange | Sensor 模拟增益范围，设置最大/最小值；数组 0/1/2 对应短、中、长帧。 |
| stIspDGainRange | ISP 数字增益范围，设置最大/最小值；数组 0/1/2 对应短、中、长帧。 |
| stPIrisRange | 光圈等效增益范围，设置最大值和最小值。 |

<!-- Source EN PDF p.92; unit 1014 -->

【注意事项】

<!-- Source EN PDF p.92; unit 1015 -->

stExpTimeRange、stGainRange、stIspDGainRange 均为 3 成员数组。双帧 HDR 仅 0、1 有效，分别对应短、长帧；三帧 HDR 的 0–2 有效，分别对应短、中、长帧。

<!-- Source EN PDF p.92; unit 1016 -->

各曝光分量最大/最小值为默认 0 时，设置范围不生效，实际边界由算法修正后的曝光分解路由节点决定。

<!-- Source EN PDF p.92; unit 1017 -->

各曝光分量最大/最小值非 0 时，设置范围生效。未超出 sensor 或 ISP 限制时，实际边界按设置范围确定，并将曝光分解路由节点边界改为设置值；若超出 sensor 或 ISP 限制，

<!-- Source EN PDF p.93; unit 1018 -->

实际边界以曝光分解路由节点的最大/最小值为准。1106 平台目前不支持 isp dgain，因此 stIspDGainRange 暂无效。

<!-- Source EN PDF p.93; unit 1019 -->

6.7.1.2  Uapi_AeAttrV2_t

<!-- Source EN PDF p.93; unit 1020 -->

【说明】定义 AE 自动曝光属性。

<!-- Source EN PDF p.93; unit 1021 -->

【定义】

<!-- Source EN PDF p.93; unit 1022 -->

```text
 typedef struct Uapi_AeAttrV2_s {
     Uapi_AeSpeedV2_t           stAeSpeed;
     DelayFrmNum
     uint8_t                    BlackDelayFrame;
     uint8_t                    WhiteDelayFrame;
     Auto/Fixed fps
     Uapi_AeFpsAttrV2_t         stFrmRate;
     Uapi_AntiFlickerV2_t       stAntiFlicker;
     auto range
     Aec_LinAeRange_t           LinAeRange;//result LinAerange
     Aec_HdrAeRange_t           HdrAeRange;//result HdrAerange
 } Uapi_AeAttrV2_t;
```

<!-- Source EN PDF p.93; unit 1023 -->

【成员】

<!-- Source EN PDF p.93; unit 1024 -->

| 成员名称 | 说明 |
|---|---|
| stAeSpeed | 自动曝光调节速度 |
| BlackDelayFrame | 自动曝光延迟属性：图像亮度低于目标值持续超过 BlackDelayFrame 帧后，AE 开始调节。 |
| WhiteDelayFrame | 自动曝光延迟属性：图像亮度高于目标值持续超过 WhiteDelayFrame 帧后，AE 开始调节。 |
| stFrmRate | 自动曝光帧率模式结构体：固定帧率或自动降帧模式。 |
| stAntiFlicker | 抗工频闪烁参数 |
| LinAeRange | 线性模式 AE 范围结构体（最终有效范围）。 |
| HdrAeRange | HDR 模式 AE 范围结构体（最终有效范围）。 |

<!-- Source EN PDF p.93; unit 1025 -->

【注意事项】

<!-- Source EN PDF p.93; unit 1026 -->

LinAeRange/HdrAeRange 是算法内部校验修正后实际使用的参数范围。API 设置超出 sensor 限制时，采用 sensor 的限制范围。sensor 的限制可查原文所引 Rockchip_Tuning_Guide_ISP30_CN.pdf 中 AE 模块 sensorinfo 参数。

<!-- Source EN PDF p.94; unit 1027 -->

要设置自动曝光分量范围，通过 API 使用上述 Uapi_ExpSwAttr_AdvancedV2_t 参数，并将 SetAeRangeEn 设为 1；否则采用调试文件的默认范围。

<!-- Source EN PDF p.94; unit 1028 -->

6.7.1.2.1 Uapi_AeSpeedV2_t

<!-- Source EN PDF p.94; unit 1029 -->

【说明】定义 AE 调节速度属性。

<!-- Source EN PDF p.94; unit 1030 -->

【定义】

<!-- Source EN PDF p.94; unit 1031 -->

```text
 typedef struct CalibDb_AeSpeedV2_s {
     float                   DampOver;
     float                   DampUnder;
     float                   DampDark2Bright;
     float                   DampBright2Dark;
 } CalibDb_AeSpeedV2_t;
 typedef CalibDb_AeSpeedV2_t Uapi_AeSpeedV2_t;
```

<!-- Source EN PDF p.94; unit 1032 -->

【成员】

<!-- Source EN PDF p.94; unit 1033 -->

| 成员名 | 说明 |
|---|---|
| DampOver | 环境亮度稳定、图像亮度高于目标时的曝光调节速度，范围 [0,1]。 |
| DampUnder | 环境亮度稳定、图像亮度低于目标时的曝光调节速度，范围 [0,1]。 |
| DampDark2Bright | 环境亮度突变时，从暗到亮的曝光调节速度，范围 [0,1]。 |
| DampBright2Dark | 环境亮度突变时，从亮到暗的曝光调节速度，范围 [0,1]。 |

<!-- Source EN PDF p.94; unit 1034 -->

6.7.1.2.2 Uapi_AeFpsAttrV2_t

<!-- Source EN PDF p.94; unit 1035 -->

【说明】定义 AE 帧率属性。

<!-- Source EN PDF p.94; unit 1036 -->

【定义】

<!-- Source EN PDF p.94; unit 1037 -->

```text
 typedef struct CalibDb_AeFrmRateAttrV2_s {
     bool             isFpsFix;
     uint8_t          FpsValue;
 } CalibDb_AeFrmRateAttrV2_t;
 typedef CalibDb_AeFrmRateAttrV2_t Uapi_AeFpsAttrV2_t;
```

<!-- Source EN PDF p.94; unit 1038 -->

【成员】

<!-- Source EN PDF p.95; unit 1039 -->

| 成员名称 | 说明 |
|---|---|
| isFpsFix | 自动曝光固定帧率使能。默认 FALSE，即自动降帧；TRUE 表示固定帧率。 |
| FpsValue | 仅固定帧率时有效。默认 0 使用驱动默认帧率；非 0 使用所设置的帧率。 |

<!-- Source EN PDF p.95; unit 1040 -->

6.7.1.2.3 Uapi_AntiFlickerV2_t

<!-- Source EN PDF p.95; unit 1041 -->

【说明】定义抗闪烁属性。

<!-- Source EN PDF p.95; unit 1042 -->

【定义】

<!-- Source EN PDF p.95; unit 1043 -->

```text
 typedef struct CalibDb_AntiFlickerAttrV2_s {
     bool                           enable;
     CalibDb_FlickerFreq_t          Frequency;
     CalibDb_AntiFlickerMode_t      Mode;
 } CalibDb_AntiFlickerAttrV2_t;
 typedef CalibDb_AntiFlickerAttrV2_t Uapi_AntiFlickerV2_t;
```

<!-- Source EN PDF p.95; unit 1044 -->

【成员】

<!-- Source EN PDF p.95; unit 1045 -->

| 成员名称 | 说明 |
|---|---|
| enable | 抗工频闪烁功能使能：0 关闭，1 开启。 |
| Frequency | 抗闪烁频率属性包括三种值：AECV2_FLICKER_FREQUENCY_OFF（使能位为 0 时有效）、AECV2_FLICKER_FREQUENCY_50HZ、AECV2_FLICKER_FREQUENCY_60HZ；默认 AECV2_FLICKER_FREQUENCY_50HZ，即工频 50 Hz。 |
| Mode | 两种抗闪烁模式：AECV2_ANTIFLICKER_NORMAL_MODE（普通）和 AECV2_ANTIFLICKER_AUTO_MODE（自动）。 |

<!-- Source EN PDF p.95; unit 1046 -->

【注意事项】

<!-- Source EN PDF p.95; unit 1047 -->

关闭抗闪烁时将 enable 设为 0，算法自动配置 Frequency=AECV2_FLICKER_FREQUENCY_OFF。enable 为 1 时，若频率设为 OFF，该值无效，将使用默认 AECV2_FLICKER_FREQUENCY_50HZ。

<!-- Source EN PDF p.95; unit 1048 -->

AECV2_ANTIFLICKER_NORMAL_MODE 为普通抗闪烁模式，曝光时间随亮度调节，最短固定为 1/120 sec（60Hz）或 1/100 sec（50Hz），不受原文所谓“最小曝光时间”限制。

<!-- Source EN PDF p.95; unit 1049 -->

照明环境：曝光时间可匹配光源频率，防止画面闪烁。

<!-- Source EN PDF p.96; unit 1050 -->

高亮环境中，亮度越高，所需曝光越短。普通抗闪烁模式的最短曝光无法匹配光源频率时会过曝。自动模式 AECV2_ANTIFLICKER_AUTO_MODE 可随亮度调节，最短可达 sensor 的最短曝光。与普通模式的差异主要在高亮环境：可有效抑制过曝，但此时抗闪烁失效。

<!-- Source EN PDF p.96; unit 1051 -->

6.7.1.3  Uapi_MeAttrV2_t

<!-- Source EN PDF p.96; unit 1052 -->

【说明】

<!-- Source EN PDF p.96; unit 1053 -->

手动曝光参数按模式分为 LinearAE 与 HdrAE 两组。

<!-- Source EN PDF p.96; unit 1054 -->

【定义】

<!-- Source EN PDF p.96; unit 1055 -->

```text
 typedef struct Uapi_MeAttrV2_s {
     Uapi_LinMeAttrV2_t     stLinMe;
     Uapi_HdrMeAttrV2_t     stHdrMe;
 } Uapi_MeAttrV2_t;
```

<!-- Source EN PDF p.96; unit 1056 -->

【相关数据类型】

<!-- Source EN PDF p.96; unit 1057 -->

Uapi_LinMeAttrV2_t

<!-- Source EN PDF p.96; unit 1058 -->

Uapi_HdrMeAttrV2_t

<!-- Source EN PDF p.96; unit 1059 -->

6.7.1.3.1 Uapi_LinMeAttrV2_t

<!-- Source EN PDF p.96; unit 1060 -->

【说明】

<!-- Source EN PDF p.96; unit 1061 -->

LinearAE 手动曝光控制参数。

<!-- Source EN PDF p.96; unit 1062 -->

【定义】

<!-- Source EN PDF p.96; unit 1063 -->

```text
 typedef struct Uapi_LinMeAttrV2_s {
     bool                 ManualTimeEn;
     bool                 ManualGainEn;
     bool                 ManualIspDgainEn;
     float                TimeValue;
     float                GainValue;
     float                IspDGainValue;
 } Uapi_LinMeAttrV2_t;
```

<!-- Source EN PDF p.96; unit 1064 -->

【成员】

<!-- Source EN PDF p.97; unit 1065 -->

| 成员名 | 说明 |
|---|---|
| ManualTimeEn | 手动曝光时间使能，默认 1。 |
| ManualGainEn | 手动 sensor 增益使能，默认 1。 |
| ManualIspDgainEn | 手动 ISP 数字增益使能，默认 1。 |
| TimeValue | 手动曝光时间，单位 s，受 sensor 限制。 |
| GainValue | 手动 sensor 增益值，受 sensor 限制。 |
| IspDGainValue | 手动 ISP 数字增益值，受 ISP 限制。 |

<!-- Source EN PDF p.97; unit 1066 -->

【注意事项】

<!-- Source EN PDF p.97; unit 1067 -->

仅 AeOptype = MANUAL 时有效。ManualTimeEn、ManualGainEn、ManualIspDgainEn 均为 1 时是手动模式；任一未使能即为半自动。原文随后称“以上四项全为 0”等同自动模式并报错，数量表述矛盾保留。

<!-- Source EN PDF p.97; unit 1068 -->

手动/半手动模式的曝光时间和增益受自动模式最大/最小边界限制；超出时以自动模式对应边界代替。

<!-- Source EN PDF p.97; unit 1069 -->

RK356X 不支持 ISP 数字增益，ManualIspDgainEn 和 IspDGainValue 无效。

<!-- Source EN PDF p.97; unit 1070 -->

6.7.1.3.2 Uapi_HdrMeAttrV2_t

<!-- Source EN PDF p.97; unit 1071 -->

【说明】

<!-- Source EN PDF p.97; unit 1072 -->

HdrAE 手动曝光控制参数。

<!-- Source EN PDF p.97; unit 1073 -->

【定义】

<!-- Source EN PDF p.97; unit 1074 -->

```text
 typedef struct Uapi_HdrMeAttrV2_s {
     bool                    ManualTimeEn;
     bool                    ManualGainEn;
     bool                    ManualIspDgainEn;
     Cam3x1FloatMatrix_t     TimeValue;
     Cam3x1FloatMatrix_t     GainValue;
     Cam3x1FloatMatrix_t     IspDGainValue;
 } Uapi_HdrMeAttrV2_t;
```

<!-- Source EN PDF p.97; unit 1075 -->

【成员】

<!-- Source EN PDF p.97; unit 1076 -->

变量含义与 Uapi_LinMeAttrV2_t 相同。

<!-- Source EN PDF p.97; unit 1077 -->

【注意事项】

<!-- Source EN PDF p.97; unit 1078 -->

TimeValue/GainValue/IspDGainValue 为三成员数组。双帧 HDR 仅 [0-1] 有效，分别对应短、长帧；三帧 HDR [0-2] 有效，分别对应短、中、长帧。

<!-- Source EN PDF p.97; unit 1079 -->

手动/半手动模式的曝光时间和增益受自动模式最大/最小边界限制；超出时以自动模式对应边界代替。

<!-- Source EN PDF p.97; unit 1080 -->

RK356X 目前不支持 ISP 数字增益，ManualIspDgainEn、IspDGainValue 无效。

<!-- Source EN PDF p.98; unit 1081 -->

#### 6.7.2  Uapi_LinAeRouteAttr_t

<!-- Source EN PDF p.98; unit 1082 -->

【说明】定义线性 AE 曝光分解路径属性。

<!-- Source EN PDF p.98; unit 1083 -->

【定义】

<!-- Source EN PDF p.98; unit 1084 -->

```text
 typedef struct CalibDb_LinAeRoute_AttrV2_s {
     float* TimeDot;
     int TimeDot_len;
     float* GainDot;
     int GainDot_len;
     float* IspDGainDot;
     int IspDGainDot_len;
     int* PIrisDot;
     int PIrisDot_len;
 } CalibDb_LinAeRoute_AttrV2_t;
 typedef struct Uapi_LinAeRouteAttr_s {
   rk_aiq_uapi_sync_t            sync;
   CalibDb_LinAeRoute_AttrV2_t   Params;
 } Uapi_LinAeRouteAttr_t;
```

<!-- Source EN PDF p.98; unit 1085 -->

【成员】

<!-- Source EN PDF p.98; unit 1086 -->

| 成员名称 | 说明 |
|---|---|
| TimeDot | sensor 曝光时间节点，单位 s。 |
| GainDot | sensor 曝光增益节点。 |
| IspgainDot | ISP 数字增益节点 |
| PIrisGainDot | 光圈等效增益节点 |

<!-- Source EN PDF p.98; unit 1087 -->

【注意事项】

<!-- Source EN PDF p.98; unit 1088 -->

曝光分解曲线节点数不限，建议不少于 6 个。

<!-- Source EN PDF p.98; unit 1089 -->

节点曝光量是曝光时间、sensor 增益、ISP 数字增益、光圈等效增益等分量的乘积。节点曝光必须单调递增，即后一节点大于前一节点。原文随后写“第一个节点曝光最小，第二个节点曝光最大”，该表述与多节点描述的疑点保留。

<!-- Source EN PDF p.98; unit 1090 -->

节点曝光时间单位为秒，最小值允许为 0；代码内部按 sensor 限制修正实际最短曝光。

<!-- Source EN PDF p.98; unit 1091 -->

光圈分量仅支持 P-Iris，不支持 DC-Iris。P-iris 等效增益仅在启用 Airis 自动光圈后有效，否则光圈固定在初始大小。计算方法详见 AecIrisCtrl 模块。

<!-- Source EN PDF p.98; unit 1092 -->

设置的曝光分解节点不是最终路由。系统各最终曝光分量的实际最大/最小值，由路由节点与手动配置边界共同决定。首先对曝光分解节点边界进行第一次修正：

<!-- Source EN PDF p.99; unit 1093 -->

未超出 SENSOR/ISP 限制时节点边界不变，超出则按 SENSOR/ISP 限制修正。手动配置边界为 0 时，最终路由采用第一次修正结果；非 0 且未超限时进行第二次修正，以手动设置范围为准；手动边界超限时仍采用第一次修正结果。相邻节点曝光量增大时，应只增大一个曝光分量，其余固定。增大的分量决定该路由段的分配策略，例如仅增大增益时，该段为增益优先。

<!-- Source EN PDF p.99; unit 1094 -->

RK356X 目前不支持 ISP 数字增益，因此 IspgainDot 无效。

<!-- Source EN PDF p.99; unit 1095 -->

#### 6.7.3  Uapi_HdrAeRouteAttr_t

<!-- Source EN PDF p.99; unit 1096 -->

【说明】定义 HDR AE 曝光分解路径属性。

<!-- Source EN PDF p.99; unit 1097 -->

【定义】

<!-- Source EN PDF p.99; unit 1098 -->

```text
 typedef struct CalibDb_HdrAeRoute_AttrV2_s {
     float* Frm0TimeDot;
     int Frm0TimeDot_len;
     float* Frm0GainDot;
     int Frm0GainDot_len;
     float* Frm0IspDGainDot;
     int Frm0IspDGainDot_len;
     float* Frm1TimeDot;
     int Frm1TimeDot_len;
     float* Frm1GainDot;
     int Frm1GainDot_len;
     float* Frm1IspDGainDot;
     int Frm1IspDGainDot_len;
     float* Frm2TimeDot;
     int Frm2TimeDot_len;
     float* Frm2GainDot;
     int Frm2GainDot_len;
     float* Frm2IspDGainDot;
     int Frm2IspDGainDot_len;
     int* PIrisDot;
     int PIrisDot_len;
 } CalibDb_HdrAeRoute_AttV2r_t;
 typedef struct Uapi_HdrAeRouteAttr_s {
   rk_aiq_uapi_sync_t            sync;
   CalibDb_HdrAeRoute_AttrV2_t   Params;
 } Uapi_HdrAeRouteAttr_t;
```

<!-- Source EN PDF p.100; unit 1099 -->

【成员】

<!-- Source EN PDF p.100; unit 1100 -->

| 成员名 | 说明 |
|---|---|
| Frm0/1/2TimeDot | 曝光时间节点，单位秒。双帧 HDR 仅 Frm0/1TimeDot 有效；三帧 HDR 为 Frm0/1/2TimeDot。原文 FRM0~3 表示从短到长的帧序号，保留其编号表述。 |
| Frm0/1/2GainDot | Sensor 增益节点。双帧 HDR 为 Frm0/1GainDot；三帧为 Frm0/1/2GainDot，单位 1x。原文 FRM0~3 表示从短到长的帧序号。 |
| Frm0/1/2IspDGainDot | ISP 数字增益节点。双帧 HDR 为 Frm0/1IspDGainDot；三帧为 Frm0/1/2IspDGainDot，单位 1x。原文 FRM0~3 表示从短到长的帧序号。 |
| PIrisDot | 光圈等效增益节点，取值为以 1x 为单位的实际增益。 |

<!-- Source EN PDF p.100; unit 1101 -->

【注意事项】

<!-- Source EN PDF p.100; unit 1102 -->

节点数不限，建议至少 6 个，使曝光分解平滑。

<!-- Source EN PDF p.100; unit 1103 -->

双帧 HDR 只需设置 Frm0/1TimeDot、Frm0/1GainDot、Frm0/1IspDGainDot，分别对应短、长帧。三帧 HDR 使用 Frm0/1/2TimeDot、Frm0/1/2GainDot、Frm0/1/2IspDGainDot，对应短、中、长帧。必须合理分配各帧 sensor 曝光时间，各帧曝光时间之和不能超过该帧率允许的最大曝光时间！

<!-- Source EN PDF p.100; unit 1104 -->

节点曝光量是曝光时间、sensor 增益、ISP 数字增益、光圈等效增益等分量的乘积。节点曝光必须单调递增，即后一节点大于前一节点。原文随后写“第一个节点曝光最小，第二个节点曝光最大”，该表述与多节点描述的疑点保留。

<!-- Source EN PDF p.100; unit 1105 -->

节点曝光时间单位为秒，最小值允许为 0；代码内部按 sensor 限制修正实际最短曝光。

<!-- Source EN PDF p.100; unit 1106 -->

光圈分量仅支持 P-Iris，不支持 DC-Iris。P-iris 等效增益仅在启用 Airis 自动光圈后有效，否则光圈固定在初始大小。计算方法详见 AecIrisCtrl 模块。

<!-- Source EN PDF p.100; unit 1107 -->

所设节点不是最终曝光路由。实际分量边界由路由节点与手动配置边界共同决定。首先修正节点边界：未超出 SENSOR/ISP 限制则不变，超出则按硬件限制修正。手动边界为 0 时采用第一次修正结果；非 0 且未超限时，再对曝光路由进行

<!-- Source EN PDF p.101; unit 1108 -->

第二次修正，以手动范围为准；手动边界超限时采用第一次修正结果。相邻节点曝光递增时，只增大一个分量、固定其余。增大的分量决定该段分配策略；例如只增大增益时为增益优先。

<!-- Source EN PDF p.101; unit 1109 -->

356X 目前不支持 ISP 数字增益，Frm0/1/2ispDGainDot 无效。

<!-- Source EN PDF p.101; unit 1110 -->

#### 6.7.4  Uapi_LinExpAttrV2_t

<!-- Source EN PDF p.101; unit 1111 -->

【说明】

<!-- Source EN PDF p.101; unit 1112 -->

定义 AE 线性曝光调优参数。

<!-- Source EN PDF p.101; unit 1113 -->

【定义】

<!-- Source EN PDF p.101; unit 1114 -->

```text
 typedef struct CalibDb_LinearAE_AttrV2_s {
     uint8_t RawStatsEn;
     float ToleranceIn;
     float ToleranceOut;
     float Evbias;
     CalibDb_AeStrategyModeV2_t      StrategyMode;
     CalibDb_LinExpInitExpV2_t       InitExp;
     CalibDb_LinAeRoute_AttrV2_t     Route;
     CalibDb_AecDynamicSetpointV2_t  DySetpoint;
     CalibDb_AecBacklightV2_t        BackLightCtrl;
     CalibDb_AecOverExpCtrlV2_t OverExpCtrl;
 } CalibDb_LinearAE_AttrV2_t;
 typedef struct Uapi_LinExpAttrV2_s {
   rk_aiq_uapi_sync_t            sync;
   CalibDb_LinearAE_AttrV2_t     Params;
 } Uapi_LinExpAttrV2_t;
```

<!-- Source EN PDF p.101; unit 1115 -->

【成员】

<!-- Source EN PDF p.102; unit 1116 -->

| 成员名称 | 说明 |
|---|---|
| RawStatsEn | 线性曝光使能使用 Raw 域统计亮度。 |
| EvBias | 自动曝光调整时的曝光量百分比偏移，单位 %，参考范围 [-200, +200]。 |
| ToleranceIn/Out | 自动曝光画面亮度容差，单位 %，范围 [0,100]。 |
| StrategyMode | 自动曝光策略：高光优先或低照优先，目前暂不生效。 |
| DySetpoint | 自动曝光动态目标亮度属性，随曝光量变化。 |
| BackLightCtrl | 背光补偿功能参数 |
| OverExpCtrl | 强光抑制功能参数 |

<!-- Source EN PDF p.102; unit 1117 -->

【注意事项】

<!-- Source EN PDF p.102; unit 1118 -->

EvBias 用于特殊场景下微调目标亮度 SetPoint/IRSetPoint（固定或动态）。实际目标亮度为 (SetPoint)\*[1+abs(EvBias)/100]^[EvBias/abs(EvBias)]。EvBias=100 时为默认值两倍；EvBias=-100 时为默认值 1/2。

<!-- Source EN PDF p.102; unit 1119 -->

AE 画面亮度容差为 Tolerance。收敛时亮度 B 应位于 [实际目标亮度 X(1-Tolerance/100), 实际目标亮度 X(1+Tolerance/100)]。ToleranceIn/Out 过大会影响响应速度及 EvBias 效果；EvBias 调整间隔小于 ToleranceIn/Out 时，亮度调整可能不生效。

<!-- Source EN PDF p.102; unit 1120 -->

StrategyMode 当前无效。

<!-- Source EN PDF p.102; unit 1121 -->

【相关数据类型】

<!-- Source EN PDF p.102; unit 1122 -->

CalibDb_AecDynamicSetpointV2_t

<!-- Source EN PDF p.102; unit 1123 -->

CalibDb_AecBacklightV2_t

<!-- Source EN PDF p.102; unit 1124 -->

CalibDb_AecOverExpCtrlV2_t

<!-- Source EN PDF p.102; unit 1125 -->

6.7.4.1  CalibDb_AecDynamicSetpointV2_t

<!-- Source EN PDF p.102; unit 1126 -->

【说明】定义 AE 动态目标值。

<!-- Source EN PDF p.102; unit 1127 -->

【定义】

<!-- Source EN PDF p.102; unit 1128 -->

```text
 typedef struct CalibDb_AecDynamicSetpointV2_s {
     float* ExpLevel;
     int ExpLevel_len;
     float* DySetpoint;
     int DySetpoint_len;
 } CalibDb_AecDynamicSetpointV2_t;
```

<!-- Source EN PDF p.103; unit 1129 -->

【成员】

<!-- Source EN PDF p.103; unit 1130 -->

| 成员名 | 说明 |
|---|---|
| ExpLevel | 动态曝光节点属性：节点值为当前曝光量；节点数不限，建议至少 6 个，使曝光过渡平滑（原文末尾否定表述疑点见记录）。 |
| DySetpoint | 动态目标亮度节点随曝光量变化，曝光节点值越大，目标亮度越小，与曝光节点一一对应。节点数不限，但须等于 ExpLevel 数量，建议至少 6 个以平滑过渡。 |

<!-- Source EN PDF p.103; unit 1131 -->

#### 6.7.5  Uapi_HdrExpAttrV2_t

<!-- Source EN PDF p.103; unit 1132 -->

【说明】定义 AE HDR 曝光调试参数。

<!-- Source EN PDF p.103; unit 1133 -->

【定义】

<!-- Source EN PDF p.103; unit 1134 -->

```text
 typedef struct CalibDb_HdrAE_AttrV2_s {
     float ToleranceIn;
     float ToleranceOut;
     float Evbias;
     CalibDb_AeStrategyModeV2_t StrategyMode;
     float LumaDistTh; //used for area-growing
     CalibDb_HdrExpInitExpV2_t InitExp;
     CalibDb_HdrAeRoute_AttrV2_t Route;
     CalibDb_ExpRatioCtrlV2_t ExpRatioCtrl;
     CalibDb_LongFrmCtrlV2_t LongFrmMode;
     CalibDb_LfrmCtrlV2_t LframeCtrl;
     CalibDb_MfrmCtrlV2_t MframeCtrl;
     CalibDb_SfrmCtrlV2_t SframeCtrl;
 } CalibDb_HdrAE_AttrV2_t;
 typedef struct Uapi_HdrExpAttrV2_s {
   rk_aiq_uapi_sync_t            sync;
   CalibDb_HdrAE_AttrV2_t        Params;
 } Uapi_HdrExpAttrV2_t;
```

<!-- Source EN PDF p.103; unit 1135 -->

【成员】

<!-- Source EN PDF p.104; unit 1136 -->

| 成员名称 | 说明 |
|---|---|
| ToleranceIn/Out | 自动曝光画面亮度容差，单位 %，范围 [0,100]。 |
| LongfrmMode | 长帧模式参数 |
| StrategyMode | 自动曝光策略：低照优先/高光优先（AECV2_STRATEGY_MODE_LOWLIGHT_PRIOR/AECV2_STRATEGY_MODE_HIGHLIGHT_PRIOR）。 |
| Evbias | 自动曝光调整时的曝光量百分比偏移，单位 %，参考范围 [-200, +200]。 |
| ExpRatioCtrl | HdrAE 曝光比控制模块，仅 HDR 多帧合成时有效。 |
| LframeCtrl | 长帧控制参数 |
| MframeCtrl | 中帧控制参数，仅三帧 HDR 有效。 |
| SframeCtrl | 短帧控制参数 |

<!-- Source EN PDF p.104; unit 1137 -->

【相关数据类型】

<!-- Source EN PDF p.104; unit 1138 -->

CalibDb_LFrameCtrlV2_t

<!-- Source EN PDF p.104; unit 1139 -->

CalibDb_MFrameCtrlV2_t

<!-- Source EN PDF p.104; unit 1140 -->

CalibDb_SFrameCtrlV2_t

<!-- Source EN PDF p.104; unit 1141 -->

#### 6.7.6  Uapi_IrisAttrV2_t

<!-- Source EN PDF p.104; unit 1142 -->

【说明】

<!-- Source EN PDF p.104; unit 1143 -->

光圈控制参数。

<!-- Source EN PDF p.104; unit 1144 -->

【定义】

<!-- Source EN PDF p.104; unit 1145 -->

```text
 typedef struct CalibDb_AecIrisCtrlV2_s {
     uint8_t Enable;
     CalibDb_IrisTypeV2_t IrisType;
     RKAiqOPMode_t IrisOpType;
     CalibDb_MIris_AttrV2_t ManualAttr;
     CalibDb_PIris_AttrV2_t PIrisAttr;
     CalibDb_DCIris_AttrV2_t DCIrisAttr;
 } CalibDb_AecIrisCtrlV2_t;
 typedef struct Uapi_IrisAttrV2_s {
   rk_aiq_uapi_sync_t            sync;
   CalibDb_AecIrisCtrlV2_t       Params;
 } Uapi_IrisAttrV2_t;
```

<!-- Source EN PDF p.104; unit 1146 -->

【成员】

<!-- Source EN PDF p.105; unit 1147 -->

| 成员名 | 说明 |
|---|---|
| Enable | 自动光圈控制使能。 |
| IrisType | 光圈类型：P（P-iris）或 DC（DC-iris）。 |
| IrisOpType | 光圈控制模式：自动 RK_AIQ_OP_MODE_AUTO 或手动 RK_AIQ_OP_MODE_MANUAL。 |
| ManualAttr | 手动光圈参数 |
| PIrisAttr | P 光圈属性参数 |
| DCIrisAttr | DC 光圈属性参数 |

<!-- Source EN PDF p.105; unit 1148 -->

6.7.6.1  CalibDb_MIris_AttrV2_t

<!-- Source EN PDF p.105; unit 1149 -->

【说明】

<!-- Source EN PDF p.105; unit 1150 -->

手动光圈参数。

<!-- Source EN PDF p.105; unit 1151 -->

【定义】

<!-- Source EN PDF p.105; unit 1152 -->

```text
 typedef struct CalibDb_MIris_AttrV2_s {
     int PIrisGainValue;
     int DCIrisHoldValue;
 } CalibDb_MIris_AttrV2_t;
```

<!-- Source EN PDF p.105; unit 1153 -->

【成员】

<!-- Source EN PDF p.105; unit 1154 -->

| 成员名 | 说明 |
|---|---|
| PIrisGainValue | 手动 P 光圈等效增益，受 P 光圈器件限制，范围 [1,1024]。 |
| DCIrisHoldValue | DC 光圈 HoldValue，与器件相关，范围 [0,100]。 |

<!-- Source EN PDF p.105; unit 1155 -->

【注意事项】

<!-- Source EN PDF p.105; unit 1156 -->

IrisOpType = RK_AIQ_OP_MODE_MANUAL 时启用手动光圈。P 光圈仅 PirisGainValue 有效；DC 光圈仅 DCIrisHoldValue 有效。

<!-- Source EN PDF p.105; unit 1157 -->

DCIrisHoldValue 在手动模式直接设置电机 PWM 占空比，范围 [0,100]。设置为 AecIrisCtrl 的 ClosePwmDuty 至 OpenPwmDuty 区间内的 HoldValue 时，光圈保持当前大小；大于 OpenPwmDuty 时开启，值越大开启越快；小于 ClosePwmDuty 时关闭，值越小关闭越快。

<!-- Source EN PDF p.106; unit 1158 -->

6.7.6.2  CalibDb_PIris_AttrV2_t

<!-- Source EN PDF p.106; unit 1159 -->

【说明】

<!-- Source EN PDF p.106; unit 1160 -->

P 光圈属性参数。

<!-- Source EN PDF p.106; unit 1161 -->

【定义】

<!-- Source EN PDF p.106; unit 1162 -->

```text
 #define AEC_PIRIS_STAP_TABLE_MAX (1024)
 typedef struct CalibDb_PIris_AttrV2_s {
     uint16_t              TotalStep;
     uint16_t              EffcStep;
     bool                  ZeroIsMax;
     uint16_t              StepTable[AEC_PIRIS_STAP_TABLE_MAX];
 } CalibDb_PIris_AttrV2_t;
```

<!-- Source EN PDF p.106; unit 1163 -->

【成员】

<!-- Source EN PDF p.106; unit 1164 -->

| 成员名 | 说明 |
|---|---|
| TotalStep | P-iris 步进电机总步数，取决于具体镜头。 |
| EffcStep | P-iris 步进电机可用步数，取决于具体镜头。 |
| ZeroIsMax | step0 是否对应最大光圈，取决于镜头。0 表示 step0 为最小光圈，1 表示 step0 为最大光圈。 |
| StepTable | 步进电机位置到光圈等效增益的映射表，与 P-iris 镜头相关。 |

<!-- Source EN PDF p.106; unit 1165 -->

6.7.6.3  CalibDb_DCIris_AttrV2_t

<!-- Source EN PDF p.106; unit 1166 -->

【说明】

<!-- Source EN PDF p.106; unit 1167 -->

DC 光圈属性。

<!-- Source EN PDF p.106; unit 1168 -->

【定义】

<!-- Source EN PDF p.106; unit 1169 -->

```text
 typedef struct CalibDb_DCIris_AttrV2_s {
     float       Kp;
     float       Ki;
     float       Kd;
     int         MinPwmDuty;
     int         MaxPwmDuty;
     int         OpenPwmDuty;
     int         ClosePwmDuty;
 } CalibDb_DCIris_AttrV2_t;
```

<!-- Source EN PDF p.107; unit 1170 -->

【成员】

<!-- Source EN PDF p.107; unit 1171 -->

| 成员名 | 说明 |
|---|---|
| Kp | 限制光圈占空比剧烈变化的比例系数。原文称值越大，开闭占空比变化越慢；过大将提前制动，使调节时间过长；过小则制动滞后、超调增大。合理值与 DC-iris 镜头和电路有关。推荐 0.5，范围 [0,1]。 |
| Ki | 调节开闭速度的积分系数。原文称值越大，开闭越快；过大易超调振荡，过小则调节慢、环境亮度突变时易振荡。推荐 0.2，范围 [0,1]。 |
| Kd | 调节开闭速度的微分系数，越大速度越快。推荐 0.3，范围 [0,1]。 |
| MinPwmDuty | 最小 PWM 占空比，单位 %，与镜头和电路相关。值越小，支持的关闭速度越快，但易振荡。范围 [0,100]，默认 0。 |
| MaxPwmDuty | 最大 PWM 占空比，单位 %，与镜头和电路相关。值越大，开启越快；过小可能在未达最大光圈前退出控制。范围 [0,100]，默认 100。 |
| OpenPwmDuty | 开启阈值 OpenPwmDuty：PWM 严格大于此值时开启。具体值与 DC-iris 镜头相关，单位 %。 |
| ClosePwmDuty | 关闭阈值 ClosePwmDuty：PWM 严格小于此值时关闭。具体值与 DC-iris 镜头相关，单位 %。 |

<!-- Source EN PDF p.107; unit 1172 -->

【注意事项】

<!-- Source EN PDF p.107; unit 1173 -->

关闭自动光圈时，DC-iris 默认开到最大，P-iris 默认移动到最大光圈对应步进位置。可通过 AecInitValue 的 InitPIrisGainValue 和 InitDCIrisDutyValue 改变上述初始位置。

<!-- Source EN PDF p.107; unit 1174 -->

自动光圈 Airis 算法基本控制流程：

<!-- Source EN PDF p.107; unit 1175 -->

DC-iris 镜头由 Airis 按当前亮度与目标偏差控制。曝光达到最小且亮度仍超出目标容差时，退出 AE，固定曝光时间和增益，进入 AIRIS 控制。当前亮度稳定且 DC-iris 的 PWM 占空比

<!-- Source EN PDF p.108; unit 1176 -->

大于 OpenPwmDuty，则认为光圈已达最大，退出 Airis 并交还 AE 控制。

<!-- Source EN PDF p.108; unit 1177 -->

P-iris 通过 AecRoute 控制，将光圈大小转换为等效增益参与曝光分解。

<!-- Source EN PDF p.108; unit 1178 -->

StepTable 通常按镜头厂家提供的步进位置与孔径关系制作。AE 的 AecRoute 将孔径转换为等效增益，所以 P-iris 控制需良好线性。等效增益范围 [1,1024]：F1.0 对应 1024，F1.4 对应 512，依此类推，F32.0 对应 1。制表时将各步进位置孔径换算为等效增益，按 step0、step1……stepN 的位置递增顺序填入 StepTable。

<!-- Source EN PDF p.108; unit 1179 -->

TotalStep 为电机总步数，与镜头相关。EffcStep 为可用步数，通常小于 TotalStep。接近全闭端的位置，其等效增益误差较大，光圈调节易振荡，因此通常不用这些位置。

<!-- Source EN PDF p.108; unit 1180 -->

表 4-1 给出电机位置、孔径及等效增益，作为 StepTable 设置示例。第 1–2、4–5 列的位置与孔径面积关系由某镜头厂家提供。该镜头共 81 步，step0 为最大光圈，标称 F1.4，对应增益 512。以 step3 为例：面积 195.869，等效增益 = 512\* (195.869/201.062)=499（取整）。其余位置类推。原文随后引用“表 1-1”：接近全闭端时面积很小，与最大面积可差数千倍，等效增益误差大，建议不使用这些位置以免曝光振荡。按 step0、step1……stepN 顺序将等效增益填入 StepTable。表号交叉引用差异保留。

<!-- Source EN PDF p.108; unit 1181 -->

OpenPwmDuty、ClosePwmDuty 须实测，与 DC-iris 镜头相关。部分镜头 PWM 大于 OpenPwmDuty 时开启；原文接着写小于 OpenPwmDuty 时关闭，而后又规定 ClosePwmDuty &lt;= PWM &lt;= OpenPwmDuty 为保持区间 HoldValue，两种描述存在疑点，未擅改。有的镜头只有一个阈值：大于则开启、小于则关闭、等于则保持；此时可设 ClosePwmDuty = OpenPwmDuty = HoldValue。

<!-- Source EN PDF p.108; unit 1182 -->

手动光圈参数设置与手动曝光一致：AecOpType 设为手动，并使能 AecManualCtrl.ManualIrisEn。原文两次均写 IrisType 为 P-iris，分别说只有 PirisGainValue、只有 DCIrisValue 有效；这一互相冲突的类型条件保留，应用前需核对。

<!-- Source EN PDF p.109; unit 1183 -->

表 4-1 P-iris 步进位置、孔径面积与等效增益对应表

<!-- Source EN PDF p.110; unit 1184 -->

| 步进位置 | 孔径面积（mm2） | 等效增益 | 步进位置 | 孔径面积（mm2） | 等效增益 |
|---|---|---|---|---|---|
| 0 | 201.062 | 512 | 41 | 56.653 | 144 |
| 1 | 200.759 | 511 | 42 | 53.438 | 136 |
| 2 | 198.583 | 506 | 43 | 50.282 | 128 |
| 3 | 195.869 | 499 | 44 | 47.188 | 120 |
| 4 | 192.879 | 491 | 45 | 44.159 | 112 |
| 5 | 189.677 | 483 | 46 | 41.197 | 105 |
| 6 | 186.293 | 474 | 47 | 38.307 | 98 |
| 7 | 182.744 | 465 | 48 | 35.49 | 90 |
| 8 | 179.035 | 456 | 49 | 32.751 | 83 |
| 9 | 175.271 | 446 | 50 | 30.093 | 77 |
| 10 | 171.484 | 437 | 51 | 27.519 | 70 |
| 11 | 167.681 | 427 | 52 | 25.034 | 64 |
| 12 | 163.865 | 417 | 53 | 22.642 | 58 |
| 13 | 160.036 | 408 | 54 | 20.347 | 52 |
| 14 | 156.198 | 398 | 55 | 18.154 | 46 |
| 15 | 152.351 | 388 | 56 | 16.068 | 41 |
| 16 | 148.499 | 378 | 57 | 14.096 | 36 |
| 17 | 144.642 | 368 | 58 | 12.245 | 31 |
| 18 | 140.783 | 359 | 59 | 10.522 | 27 |
| 19 | 136.925 | 349 | 60 | 8.935 | 23 |
| 20 | 133.069 | 339 | 61 | 7.484 | 19 |
| 21 | 129.217 | 329 | 62 | 6.169 | 16 |
| 22 | 125.371 | 319 | 63 | 4.987 | 13 |
| 23 | 121.535 | 309 | 64 | 3.936 | 10 |
| 24 | 117.709 | 300 | 65 | 3.014 | 8 |
| 25 | 113.897 | 290 | 66 | 2.22 | 6 |
| 26 | 110.1 | 280 | 67 | 1.55 | 4 |
| 27 | 106.321 | 271 | 68 | 1.003 | 3 |
| 28 | 102.562 | 261 | 69 | 0.577 | 1 |

<!-- Source EN PDF p.111; unit 1185 -->

| 步进位置 | 孔径面积（mm2） | 等效增益 | 步进位置 | 孔径面积（mm2） | 等效增益 |
|---|---|---|---|---|---|
| 29 | 98.826 | 252 | 70 | 0.268 | 1 |
| 30 | 95.115 | 242 | 71 | 0.075 | 0 |
| 31 | 91.431 | 233 | 72 | 全闭 | 0 |
| 32 | 87.777 | 224 | 73 | 全闭 | 0 |
| 33 | 84.156 | 214 | 74 | 全闭 | 0 |
| 34 | 80.569 | 205 | 75 | 全闭 | 0 |
| 35 | 77.02 | 196 | 76 | 全闭 | 0 |
| 36 | 73.51 | 187 | 77 | 全闭 | 0 |
| 37 | 70.043 | 178 | 78 | 全闭 | 0 |
| 38 | 66.621 | 170 | 79 | 全闭 | 0 |
| 39 | 63.247 | 161 | 80 | 全闭 | 0 |
| 40 | 59.923 | 153 |  |  |  |

<!-- Source EN PDF p.111; unit 1186 -->

#### 6.7.7  Uapi_ExpWin_t

<!-- Source EN PDF p.111; unit 1187 -->

【说明】定义 AE 统计窗口属性。

<!-- Source EN PDF p.111; unit 1188 -->

【定义】

<!-- Source EN PDF p.111; unit 1189 -->

```text
 typedef struct window {
     uint16_t h_offs;
     uint16_t v_offs;
     uint16_t h_size;
     uint16_t v_size;
 } window_t;
 typedef struct Uapi_ExpWin_s {
   rk_aiq_uapi_sync_t            sync;
   window                        Params;
 } Uapi_ExpWin_t;
```

<!-- Source EN PDF p.111; unit 1190 -->

【成员】

<!-- Source EN PDF p.112; unit 1191 -->

| 成员名称 | 说明 |
|---|---|
| h_offs | 窗口左上角相对坐标原点的水平偏移；原点是 sensor 感光区域左上角。 |
| v_offs | 窗口左上角相对坐标原点的垂直偏移；原点是 sensor 感光区域左上角。 |
| h_size | 窗口水平尺寸 |
| v_size | 窗口垂直尺寸 |

<!-- Source EN PDF p.112; unit 1192 -->

#### 6.7.8  Uapi_ExpQueryInfo_t

<!-- Source EN PDF p.112; unit 1193 -->

【说明】定义 AE 曝光参数查询。

<!-- Source EN PDF p.112; unit 1194 -->

【定义】

<!-- Source EN PDF p.112; unit 1195 -->

```text
 typedef struct Uapi_ExpQueryInfo_s {
     bool              IsConverged;
     bool              IsExpMax;
     float             LumaDeviation;
     float             HdrLumaDeviation[3];
     float             MeanLuma;
     float             HdrMeanLuma[3];
     float             GlobalEnvLux;
     float             BlockEnvLux[ISP2_RAWAE_WINNUM_MAX];
     RKAiqAecExpInfo_t CurExpInfo;
     unsigned short    Piris;
     float             LinePeriodsPerField;
     float             PixelPeriodsPerLine;
     float             PixelClockFreqMHZ;
 } Uapi_ExpQueryInfo_t;
```

<!-- Source EN PDF p.112; unit 1196 -->

【成员】

<!-- Source EN PDF p.113; unit 1197 -->

| 成员名称 | 说明 |
|---|---|
| IsConverged | 自动曝光是否收敛 |
| IsExpMax | ISP 曝光是否已达最大 |
| LumaDeviation | 线性模式中 AEC 目标值与实际亮度的偏差：正值表示实际亮度高于目标，负值表示低于目标，0 表示处于目标容差内。 |
| HdrLumaDeviation | HDR 各帧实际亮度相对目标的偏差：正值高于目标，负值低于目标，0 在容差内。双帧 HDR 仅 0、1 有效，对应短、长帧；三帧 HDR 的 0–2 对应短、中、长帧。 |
| MeanLuma | 线性模式当前图像平均亮度。 |
| HdrMeanLuma | HDR 当前各帧平均亮度。双帧模式数组 0、1 为短、长帧；三帧模式全部成员为短、中、长帧。 |
| CurExpInfo | 当前曝光参数，包括 sensor 曝光时间和增益，按模式分为 LinearExp 和 HdrExp[3]。 |
| Piris | Aperture |
| LinePeriodsPerField | sensor VTS |
| PixelPeriodsPerLine | sensor HTS |
| PixelClockFreqMHZ | Sensor 像素时钟频率，单位 MHz。 |

<!-- Source EN PDF p.114; unit 1198 -->

### 6.8 常见问题定位与调试

<!-- Source EN PDF p.114; unit 1199 -->

出现亮度闪烁、超调或未达预期等问题时，建议抓取问题场景 AE LOG 分析，以快速定位并提高效率。

<!-- Source EN PDF p.114; unit 1200 -->

#### 6.8.1 曝光与统计同步测试

<!-- Source EN PDF p.114; unit 1201 -->

校准 ISP 前，驱动或调优人员须在 IQ XML 中填写 SensorInfo。该模块涉及曝光参数，错误设置可能导致曝光错误、闪烁等。建议配置后启用 SyncTest 自测；参数含义参见 Rockchip_Tuning_Guide_ISP30。

<!-- Source EN PDF p.114; unit 1202 -->

SyncTest 循环设置 N 组不同曝光值，检查 sensor 曝光时间、增益及 DCG 切换的生效帧数是否正确；还可测试曝光线性，确认曝光时间/增益寄存器换算公式和参数。

<!-- Source EN PDF p.114; unit 1203 -->

SyncTest 参数如下：

<!-- Source EN PDF p.114; unit 1204 -->

【说明】

<!-- Source EN PDF p.114; unit 1205 -->

曝光与统计同步测试按指定帧间隔循环设置 N 组曝光，验证曝光分量（时间、增益）的生效帧数及 sensor 曝光参数配置。

<!-- Source EN PDF p.114; unit 1206 -->

【成员】

<!-- Source EN PDF p.114; unit 1207 -->

| 成员名 | 说明 |
|---|---|
| Enable | 使能曝光与统计同步测试。 |
| IntervalFrm | 曝光切换间隔帧数 |
| AlterExp | 曝光切换参数 |

<!-- Source EN PDF p.114; unit 1208 -->

AlterExp

<!-- Source EN PDF p.114; unit 1209 -->

按模式分为 LinearAE 和 HdrAE 两组参数。

<!-- Source EN PDF p.115; unit 1210 -->

| 成员名 | 说明 |
|---|---|
| TimeValue | 曝光时间值 |
| GainValue | 曝光增益值 |
| IspDgainValue | ISP 数字增益值 |
| DcgMode | DCG 模式值 |
| PIrisGainValue | P-iris 等效增益 |

<!-- Source EN PDF p.115; unit 1211 -->

正确设置时，原文 LOG 示例只截取关键行。红框标记曝光切换位置；亮度匹配曝光值，无延迟、提前或线性异常时，可初步认为 sensorinfo 设置正确。

<!-- Source EN PDF p.115; unit 1212 -->

![英文原稿技术图 — PDF p.115](/docs/rockchip-isp30-development/assets/en-p115-X1039.png)

<!-- Source EN PDF p.115; unit 1213 -->

#### 6.8.2 曝光变化时闪烁

<!-- Source EN PDF p.115; unit 1214 -->

曝光变化时闪烁可能有以下原因：

<!-- Source EN PDF p.115; unit 1215 -->

（1）CISExpUpdate 的 gain、time 生效帧数错误。原文 LOG 仅截取每帧关键行。

<!-- Source EN PDF p.115; unit 1216 -->

![英文原稿技术图 — PDF p.115](/docs/rockchip-isp30-development/assets/en-p115-X1040.png)

<!-- Source EN PDF p.115; unit 1217 -->

红框标出亮度错误：曝光增减时，亮度变化方向却相反。亮度突变发生在曝光时间和增益都变化后的第二帧，且趋势跟随曝光时间，因此可判断 gain、time 生效帧数不对，二者未同步生效，导致亮度与曝光不匹配。修改 gain、time 帧数可解决。可用 AE syncTest

<!-- Source EN PDF p.116; unit 1218 -->

设置两组不同增益与时间的曝光并反复切换，从 LOG 检查是否复现。

<!-- Source EN PDF p.116; unit 1219 -->

（2）驱动错误造成亮度来回振荡、不能收敛，常见于高亮场景。原文 LOG 仅截取每帧关键行。

<!-- Source EN PDF p.116; unit 1220 -->

![英文原稿技术图 — PDF p.116](/docs/rockchip-isp30-development/assets/en-p116-X1044.png)

<!-- Source EN PDF p.116; unit 1221 -->

图中曝光在 59ms 与 44ms 间振荡；对应平均亮度之比与曝光之比相差很大，说明线性存在问题。先在 sensor 驱动打印曝光寄存器，核对与 LOG 曝光值是否一致。可用 syncTest 设置多组曝光（含问题值）反复切换，检查 LOG 中每帧亮度与曝光的对应关系是否线性。

<!-- Source EN PDF p.116; unit 1222 -->

![英文原稿技术图 — PDF p.116](/docs/rockchip-isp30-development/assets/en-p116-X1045.png)

<!-- Source EN PDF p.116; unit 1223 -->

（3）AE 后级模块引起闪烁。原文 LOG 只截取每帧关键行。

<!-- Source EN PDF p.116; unit 1224 -->

![英文原稿技术图 — PDF p.116](/docs/rockchip-isp30-development/assets/en-p116-X1046.png)

<!-- Source EN PDF p.117; unit 1225 -->

左侧 LOG 的 SMeanLuma、MMeanLuma 下降期间，TmoMeanluma 输出亮度发生变化；出现此情况应调试 TMO 模块。

<!-- Source EN PDF p.118; unit 1226 -->

## 7.   AWB

<!-- Source EN PDF p.118; unit 1227 -->

### 7.1 概述

<!-- Source EN PDF p.118; unit 1228 -->

AWB 通过改变摄像设备各色彩通道增益，统一补偿环境色温及设备固有通道增益偏差，使图像正确呈现物体真实颜色。

<!-- Source EN PDF p.118; unit 1229 -->

### 7.2 重要概念

<!-- Source EN PDF p.118; unit 1230 -->

色温：以绝对黑体定义；光源在可见区域的辐射与某绝对黑体完全相同时，该黑体温度就是光源色温。

<!-- Source EN PDF p.118; unit 1231 -->

白平衡：不同色温光源下，sensor 对白色的响应可能偏蓝或偏红；算法调节 R、G、B 三通道强度，使白色真实呈现。

<!-- Source EN PDF p.118; unit 1232 -->

### 7.3 功能说明

<!-- Source EN PDF p.118; unit 1233 -->

AWB 由 WB 信息统计与 AWB 策略控制算法两部分组成。

<!-- Source EN PDF p.118; unit 1234 -->

### 7.4 功能级 API 参考

<!-- Source EN PDF p.118; unit 1235 -->

#### 7.4.1  rk_aiq_uapi2_setWBMode

<!-- Source EN PDF p.118; unit 1236 -->

【说明】设置白平衡工作模式。

<!-- Source EN PDF p.118; unit 1237 -->

【语法】

<!-- Source EN PDF p.118; unit 1238 -->

```text
 XCamReturn rk_aiq_uapi2_setWBMode(const rk_aiq_sys_ctx_t* ctx, opMode_t mode);
```

<!-- Source EN PDF p.118; unit 1239 -->

【参数】

<!-- Source EN PDF p.118; unit 1240 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| mode | 白平衡工作模式 | 输入 |

<!-- Source EN PDF p.118; unit 1241 -->

【返回值】

<!-- Source EN PDF p.119; unit 1242 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.119; unit 1243 -->

【注意】

<!-- Source EN PDF p.119; unit 1244 -->

手动模式的白平衡增益由当前手动参数控制。若需切换手动模式同时设置具体增益，可用 rk_aiq_uapi2_setMWBGain。

<!-- Source EN PDF p.119; unit 1245 -->

【依赖】

<!-- Source EN PDF p.119; unit 1246 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.119; unit 1247 -->

库文件：librkaiq.so

<!-- Source EN PDF p.119; unit 1248 -->

【示例】

<!-- Source EN PDF p.119; unit 1249 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.119; unit 1250 -->

#### 7.4.2  rk_aiq_uapi2_getWBMode

<!-- Source EN PDF p.119; unit 1251 -->

【说明】获取白平衡工作模式。

<!-- Source EN PDF p.119; unit 1252 -->

【语法】

<!-- Source EN PDF p.119; unit 1253 -->

```text
 XCamReturn rk_aiq_uapi2_getWBMode(const rk_aiq_sys_ctx_t* ctx, opMode_t *mode);
```

<!-- Source EN PDF p.119; unit 1254 -->

【参数】

<!-- Source EN PDF p.119; unit 1255 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| mode | 白平衡工作模式 | 输出 |

<!-- Source EN PDF p.119; unit 1256 -->

【返回值】

<!-- Source EN PDF p.119; unit 1257 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.119; unit 1258 -->

【依赖】

<!-- Source EN PDF p.119; unit 1259 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.119; unit 1260 -->

库文件：librkaiq.so

<!-- Source EN PDF p.119; unit 1261 -->

【示例】

<!-- Source EN PDF p.119; unit 1262 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.120; unit 1263 -->

#### 7.4.3  rk_aiq_uapi2_lockAWB

<!-- Source EN PDF p.120; unit 1264 -->

【说明】锁定当前白平衡参数。

<!-- Source EN PDF p.120; unit 1265 -->

【语法】

<!-- Source EN PDF p.120; unit 1266 -->

```text
 XCamReturn rk_aiq_uapi2_lockAWB(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.120; unit 1267 -->

【参数】

<!-- Source EN PDF p.120; unit 1268 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |

<!-- Source EN PDF p.120; unit 1269 -->

【返回值】

<!-- Source EN PDF p.120; unit 1270 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.120; unit 1271 -->

【依赖】

<!-- Source EN PDF p.120; unit 1272 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.120; unit 1273 -->

库文件：librkaiq.so

<!-- Source EN PDF p.120; unit 1274 -->

【示例】

<!-- Source EN PDF p.120; unit 1275 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.120; unit 1276 -->

#### 7.4.4  rk_aiq_uapi2_unlockAWB

<!-- Source EN PDF p.120; unit 1277 -->

【说明】解锁已锁定的白平衡参数。

<!-- Source EN PDF p.120; unit 1278 -->

【语法】

<!-- Source EN PDF p.120; unit 1279 -->

```text
 XCamReturn rk_aiq_uapi2_unlockAWB(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.120; unit 1280 -->

【参数】

<!-- Source EN PDF p.120; unit 1281 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |

<!-- Source EN PDF p.120; unit 1282 -->

【返回值】

<!-- Source EN PDF p.121; unit 1283 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.121; unit 1284 -->

【依赖】

<!-- Source EN PDF p.121; unit 1285 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.121; unit 1286 -->

库文件：librkaiq.so

<!-- Source EN PDF p.121; unit 1287 -->

【示例】

<!-- Source EN PDF p.121; unit 1288 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.121; unit 1289 -->

#### 7.4.5  rk_aiq_uapi2_setMWBScene

<!-- Source EN PDF p.121; unit 1290 -->

【说明】设置白平衡场景。

<!-- Source EN PDF p.121; unit 1291 -->

【语法】

<!-- Source EN PDF p.121; unit 1292 -->

```text
 XCamReturn rk_aiq_uapi2_setMWBScene(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_wb_scene_t scene);
```

<!-- Source EN PDF p.121; unit 1293 -->

【参数】

<!-- Source EN PDF p.121; unit 1294 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| scene | 白平衡场景 | 输入 |

<!-- Source EN PDF p.121; unit 1295 -->

【返回值】

<!-- Source EN PDF p.121; unit 1296 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.121; unit 1297 -->

【依赖】

<!-- Source EN PDF p.121; unit 1298 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.121; unit 1299 -->

库文件：librkaiq.so

<!-- Source EN PDF p.121; unit 1300 -->

【示例】

<!-- Source EN PDF p.121; unit 1301 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.122; unit 1302 -->

#### 7.4.6  rk_aiq_uapi2_getMWBScene

<!-- Source EN PDF p.122; unit 1303 -->

【说明】获取白平衡场景。

<!-- Source EN PDF p.122; unit 1304 -->

【语法】

<!-- Source EN PDF p.122; unit 1305 -->

```text
 XCamReturn rk_aiq_uapi2_getMWBScene(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_wb_scene_t *scene);
```

<!-- Source EN PDF p.122; unit 1306 -->

【参数】

<!-- Source EN PDF p.122; unit 1307 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| scene | 白平衡场景 | 输出 |

<!-- Source EN PDF p.122; unit 1308 -->

【返回值】

<!-- Source EN PDF p.122; unit 1309 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.122; unit 1310 -->

【依赖】

<!-- Source EN PDF p.122; unit 1311 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.122; unit 1312 -->

库文件：librkaiq.so

<!-- Source EN PDF p.122; unit 1313 -->

【示例】

<!-- Source EN PDF p.122; unit 1314 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.122; unit 1315 -->

#### 7.4.7  rk_aiq_uapi2_setMWBGain

<!-- Source EN PDF p.122; unit 1316 -->

【说明】设置手动白平衡增益系数。

<!-- Source EN PDF p.122; unit 1317 -->

【语法】

<!-- Source EN PDF p.122; unit 1318 -->

```text
 XCamReturn rk_aiq_uapi2_setMWBGain(const rk_aiq_sys_ctx_t* ctx, rk_aiq_wb_gain_t
 *gain);
```

<!-- Source EN PDF p.122; unit 1319 -->

【参数】

<!-- Source EN PDF p.122; unit 1320 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| gain | 白平衡增益系数 | 输入 |

<!-- Source EN PDF p.123; unit 1321 -->

【返回值】

<!-- Source EN PDF p.123; unit 1322 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.123; unit 1323 -->

【依赖】

<!-- Source EN PDF p.123; unit 1324 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.123; unit 1325 -->

库文件：librkaiq.so

<!-- Source EN PDF p.123; unit 1326 -->

【示例】

<!-- Source EN PDF p.123; unit 1327 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.123; unit 1328 -->

#### 7.4.8  rk_aiq_uapi2_getWBGain

<!-- Source EN PDF p.123; unit 1329 -->

【说明】获取白平衡增益系数，适用于手动和自动白平衡。

<!-- Source EN PDF p.123; unit 1330 -->

【语法】

<!-- Source EN PDF p.123; unit 1331 -->

```text
 XCamReturn rk_aiq_uapi2_getWBGain(const rk_aiq_sys_ctx_t* ctx, rk_aiq_wb_gain_t
 *gain);
```

<!-- Source EN PDF p.123; unit 1332 -->

【参数】

<!-- Source EN PDF p.123; unit 1333 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| gain | 白平衡增益系数 | 输出 |

<!-- Source EN PDF p.123; unit 1334 -->

【返回值】

<!-- Source EN PDF p.123; unit 1335 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.123; unit 1336 -->

【依赖】

<!-- Source EN PDF p.123; unit 1337 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.123; unit 1338 -->

库文件：librkaiq.so

<!-- Source EN PDF p.123; unit 1339 -->

【示例】

<!-- Source EN PDF p.123; unit 1340 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.124; unit 1341 -->

#### 7.4.9  rk_aiq_uapi2_setMWBCT

<!-- Source EN PDF p.124; unit 1342 -->

【说明】设置手动白平衡色温参数。

<!-- Source EN PDF p.124; unit 1343 -->

【语法】

<!-- Source EN PDF p.124; unit 1344 -->

```text
 XCamReturn rk_aiq_uapi2_setMWBCT(const rk_aiq_sys_ctx_t* ctx, unsigned int ct);
```

<!-- Source EN PDF p.124; unit 1345 -->

【参数】

<!-- Source EN PDF p.124; unit 1346 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| ct | 白平衡色温参数 | 输入 |

<!-- Source EN PDF p.124; unit 1347 -->

【返回值】

<!-- Source EN PDF p.124; unit 1348 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.124; unit 1349 -->

【依赖】

<!-- Source EN PDF p.124; unit 1350 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.124; unit 1351 -->

库文件：librkaiq.so

<!-- Source EN PDF p.124; unit 1352 -->

【示例】

<!-- Source EN PDF p.124; unit 1353 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.124; unit 1354 -->

#### 7.4.10  rk_aiq_uapi2_getWBCT

<!-- Source EN PDF p.124; unit 1355 -->

【说明】获取白平衡色温，适用于自动与手动模式。

<!-- Source EN PDF p.124; unit 1356 -->

【语法】

<!-- Source EN PDF p.124; unit 1357 -->

```text
 XCamReturn rk_aiq_uapi2_getWBCT(const rk_aiq_sys_ctx_t* ctx, unsigned int *ct);
```

<!-- Source EN PDF p.124; unit 1358 -->

【参数】

<!-- Source EN PDF p.124; unit 1359 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| ct | 白平衡色温 | 输出 |

<!-- Source EN PDF p.124; unit 1360 -->

【返回值】

<!-- Source EN PDF p.125; unit 1361 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.125; unit 1362 -->

【依赖】

<!-- Source EN PDF p.125; unit 1363 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.125; unit 1364 -->

库文件：librkaiq.so

<!-- Source EN PDF p.125; unit 1365 -->

【示例】

<!-- Source EN PDF p.125; unit 1366 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.125; unit 1367 -->

#### 7.4.11  rk_aiq_uapi2_setAwbGainOffsetAttrib

<!-- Source EN PDF p.125; unit 1368 -->

【说明】设置自动白平衡增益偏移。

<!-- Source EN PDF p.125; unit 1369 -->

【语法】

<!-- Source EN PDF p.125; unit 1370 -->

```text
 XCamReturn rk_aiq_uapi2_setAwbGainOffsetAttrib(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_uapiV2_wb_awb_wbGainOffset_t attr);
```

<!-- Source EN PDF p.125; unit 1371 -->

【参数】

<!-- Source EN PDF p.125; unit 1372 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | wbgain 偏移参数 | 输入 |

<!-- Source EN PDF p.125; unit 1373 -->

【返回值】

<!-- Source EN PDF p.125; unit 1374 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.125; unit 1375 -->

【依赖】

<!-- Source EN PDF p.125; unit 1376 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.125; unit 1377 -->

库文件：librkaiq.so

<!-- Source EN PDF p.125; unit 1378 -->

【示例】

<!-- Source EN PDF p.125; unit 1379 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.126; unit 1380 -->

#### 7.4.12  rk_aiq_uapi2_getAwbGainOffsetAttrib

<!-- Source EN PDF p.126; unit 1381 -->

【说明】获取自动白平衡增益偏移。

<!-- Source EN PDF p.126; unit 1382 -->

【语法】

<!-- Source EN PDF p.126; unit 1383 -->

```text
 XCamReturn rk_aiq_uapi2_getAwbGainOffsetAttrib(const rk_aiq_sys_ctx_t* ctx,
 CalibDbV2_Awb_gain_offset_cfg_t *attr);
```

<!-- Source EN PDF p.126; unit 1384 -->

【参数】

<!-- Source EN PDF p.126; unit 1385 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | wbgain 偏移参数 | 输出 |

<!-- Source EN PDF p.126; unit 1386 -->

【返回值】

<!-- Source EN PDF p.126; unit 1387 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.126; unit 1388 -->

【依赖】

<!-- Source EN PDF p.126; unit 1389 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.126; unit 1390 -->

库文件：librkaiq.so

<!-- Source EN PDF p.126; unit 1391 -->

【示例】

<!-- Source EN PDF p.126; unit 1392 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.126; unit 1393 -->

#### 7.4.13  rk_aiq_uapi2_setAwbGainAdjustAttrib

<!-- Source EN PDF p.126; unit 1394 -->

【说明】设置自动白平衡模式的色调调整参数。

<!-- Source EN PDF p.126; unit 1395 -->

【语法】

<!-- Source EN PDF p.126; unit 1396 -->

```text
 XCamReturn rk_aiq_uapi2_setAwbGainAdjustAttrib(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_uapiV2_wb_awb_wbGainAdjust_t attr);
```

<!-- Source EN PDF p.126; unit 1397 -->

【参数】

<!-- Source EN PDF p.126; unit 1398 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 白平衡色调调整参数 | 输入 |

<!-- Source EN PDF p.127; unit 1399 -->

【返回值】

<!-- Source EN PDF p.127; unit 1400 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.127; unit 1401 -->

【依赖】

<!-- Source EN PDF p.127; unit 1402 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.127; unit 1403 -->

库文件：librkaiq.so

<!-- Source EN PDF p.127; unit 1404 -->

【示例】

<!-- Source EN PDF p.127; unit 1405 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.127; unit 1406 -->

#### 7.4.14  rk_aiq_uapi2_getAwbGainAdjustAttrib

<!-- Source EN PDF p.127; unit 1407 -->

【说明】获取自动白平衡模式的色调调整参数。

<!-- Source EN PDF p.127; unit 1408 -->

【语法】

<!-- Source EN PDF p.127; unit 1409 -->

```text
 XCamReturn rk_aiq_uapi2_getAwbGainAdjustAttrib(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_uapiV2_wb_awb_wbGainAdjust_t *attr);
```

<!-- Source EN PDF p.127; unit 1410 -->

【参数】

<!-- Source EN PDF p.127; unit 1411 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 白平衡色调调整参数 | 输出 |

<!-- Source EN PDF p.127; unit 1412 -->

【返回值】

<!-- Source EN PDF p.127; unit 1413 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.127; unit 1414 -->

【依赖】

<!-- Source EN PDF p.127; unit 1415 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.127; unit 1416 -->

库文件：librkaiq.so

<!-- Source EN PDF p.127; unit 1417 -->

【示例】

<!-- Source EN PDF p.127; unit 1418 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.128; unit 1419 -->

#### 7.4.15  rk_aiq_uapi2_setAwbV30AllAttrib

<!-- Source EN PDF p.128; unit 1420 -->

【说明】设置白平衡 API 支持的全部参数。

<!-- Source EN PDF p.128; unit 1421 -->

【语法】

<!-- Source EN PDF p.128; unit 1422 -->

```text
 XCamReturn rk_aiq_uapi2_setAwbV30AllAttrib(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_uapiV2_wbV30_attrib_t attr);
```

<!-- Source EN PDF p.128; unit 1423 -->

【参数】

<!-- Source EN PDF p.128; unit 1424 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 白平衡 API 支持的全部参数。 | 输入 |

<!-- Source EN PDF p.128; unit 1425 -->

【返回值】

<!-- Source EN PDF p.128; unit 1426 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，详见错误码表。 |

<!-- Source EN PDF p.128; unit 1427 -->

【依赖】

<!-- Source EN PDF p.128; unit 1428 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.128; unit 1429 -->

库文件：librkaiq.so

<!-- Source EN PDF p.128; unit 1430 -->

【示例】

<!-- Source EN PDF p.128; unit 1431 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.128; unit 1432 -->

#### 7.4.16  rk_aiq_uapi2_getAwbV30AllAttrib

<!-- Source EN PDF p.128; unit 1433 -->

【说明】获取白平衡 API 支持的全部参数。

<!-- Source EN PDF p.128; unit 1434 -->

【语法】

<!-- Source EN PDF p.128; unit 1435 -->

```text
 XCamReturn rk_aiq_uapi2_getAwbV30AllAttrib(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_uapiV2_wbV30_attrib_t *attr);
```

<!-- Source EN PDF p.128; unit 1436 -->

【参数】

<!-- Source EN PDF p.128; unit 1437 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | wbgain 偏移参数 | 输出 |

<!-- Source EN PDF p.129; unit 1438 -->

【返回值】

<!-- Source EN PDF p.129; unit 1439 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，详见错误码表。 |

<!-- Source EN PDF p.129; unit 1440 -->

【依赖】

<!-- Source EN PDF p.129; unit 1441 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.129; unit 1442 -->

库文件：librkaiq.so

<!-- Source EN PDF p.129; unit 1443 -->

【示例】

<!-- Source EN PDF p.129; unit 1444 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.129; unit 1445 -->

### 7.5 功能级 API 数据类型

<!-- Source EN PDF p.129; unit 1446 -->

#### 7.5.1  rk_aiq_wb_op_mode_t

<!-- Source EN PDF p.129; unit 1447 -->

【说明】定义白平衡工作模式。

<!-- Source EN PDF p.129; unit 1448 -->

【定义】

<!-- Source EN PDF p.129; unit 1449 -->

```text
 typedef enum rk_aiq_wb_op_mode_s {
     RK_AIQ_WB_MODE_INVALID        = 0,
     RK_AIQ_WB_MODE_MANUAL         = 1,
     RK_AIQ_WB_MODE_AUTO           = 2,
     RK_AIQ_WB_MODE_MAX
 } rk_aiq_wb_op_mode_t;
```

<!-- Source EN PDF p.129; unit 1450 -->

【成员】

<!-- Source EN PDF p.129; unit 1451 -->

| 成员名称 | 说明 |
|---|---|
| RK_AIQ_WB_MODE_MANUAL | 白平衡手动模式 |
| RK_AIQ_WB_MODE_AUTO | 白平衡自动模式 |

<!-- Source EN PDF p.129; unit 1452 -->

#### 7.5.2  rk_aiq_wb_mwb_mode_t

<!-- Source EN PDF p.129; unit 1453 -->

【说明】定义手动白平衡模式类型。

<!-- Source EN PDF p.129; unit 1454 -->

【定义】

<!-- Source EN PDF p.130; unit 1455 -->

```text
 typedef enum rk_aiq_wb_mwb_mode_e {
     RK_AIQ_MWB_MODE_INVAILD              = 0,
     RK_AIQ_MWB_MODE_CCT                  = 1,
     RK_AIQ_MWB_MODE_WBGAIN               = 2,
     RK_AIQ_MWB_MODE_SCENE                = 3,
 } rk_aiq_wb_mwb_mode_t;
```

<!-- Source EN PDF p.130; unit 1456 -->

【成员】

<!-- Source EN PDF p.130; unit 1457 -->

| 成员名称 | 说明 |
|---|---|
| RK_AIQ_MWB_MODE_CCT | 色温 |
| RK_AIQ_MWB_MODE_WBGAIN | 增益系数 |
| RK_AIQ_MWB_MODE_SCENE | 场景 |

<!-- Source EN PDF p.130; unit 1458 -->

#### 7.5.3  rk_aiq_wb_gain_t

<!-- Source EN PDF p.130; unit 1459 -->

【说明】定义白平衡增益参数。

<!-- Source EN PDF p.130; unit 1460 -->

【定义】

<!-- Source EN PDF p.130; unit 1461 -->

```text
 typedef struct rk_aiq_wb_gain_s {
     float rgain;
     float grgain;
     float gbgain;
     float bgain;
 } rk_aiq_wb_gain_t;
```

<!-- Source EN PDF p.130; unit 1462 -->

【成员】

<!-- Source EN PDF p.130; unit 1463 -->

| 成员名称 | 说明 |
|---|---|
| rgain | R 通道增益 |
| grgain | G 通道增益 |
| gbgain | GB 通道增益 |
| bgain | B 通道增益 |

<!-- Source EN PDF p.130; unit 1464 -->

#### 7.5.4  rk_aiq_wb_scene_t

<!-- Source EN PDF p.130; unit 1465 -->

【说明】定义白平衡增益参数。

<!-- Source EN PDF p.130; unit 1466 -->

【定义】

<!-- Source EN PDF p.131; unit 1467 -->

```text
 typedef enum rk_aiq_wb_scene_e {
     RK_AIQ_WBCT_INCANDESCENT = 0,
     RK_AIQ_WBCT_FLUORESCENT,
     RK_AIQ_WBCT_WARM_FLUORESCENT,
     RK_AIQ_WBCT_DAYLIGHT,
     RK_AIQ_WBCT_CLOUDY_DAYLIGHT,
     RK_AIQ_WBCT_TWILIGHT,
     RK_AIQ_WBCT_SHADE
 } rk_aiq_wb_scene_t;
```

<!-- Source EN PDF p.131; unit 1468 -->

【成员】

<!-- Source EN PDF p.131; unit 1469 -->

| 成员名称 | 说明 |
|---|---|
| RK_AIQ_WBCT_INCANDESCENT | 白炽灯 |
| RK_AIQ_WBCT_FLUORESCENT | 荧光灯 |
| RK_AIQ_WBCT_WARM_FLUORESCENT | 暖色荧光灯 |
| RK_AIQ_WBCT_DAYLIGHT | 日光 |
| RK_AIQ_WBCT_CLOUDY_DAYLIGHT | 阴天 |
| RK_AIQ_WBCT_TWILIGHT | 暮光 |
| RK_AIQ_WBCT_SHADE | 阴影 |

<!-- Source EN PDF p.131; unit 1470 -->

#### 7.5.5  rk_aiq_wb_cct_t

<!-- Source EN PDF p.131; unit 1471 -->

【说明】定义白平衡增益参数。

<!-- Source EN PDF p.131; unit 1472 -->

【定义】

<!-- Source EN PDF p.131; unit 1473 -->

```text
 typedef struct rk_aiq_wb_cct_s {
     float CCT;
     float CCRI;
 } rk_aiq_wb_cct_t;
```

<!-- Source EN PDF p.131; unit 1474 -->

【成员】

<!-- Source EN PDF p.131; unit 1475 -->

| 成员名称 | 说明 |
|---|---|
| CCT | 相关色温 |
| CCRI | 相关显色指数 |

<!-- Source EN PDF p.132; unit 1476 -->

#### 7.5.6  rk_aiq_wb_mwb_attrib_t

<!-- Source EN PDF p.132; unit 1477 -->

【说明】定义手动白平衡属性。

<!-- Source EN PDF p.132; unit 1478 -->

【定义】

<!-- Source EN PDF p.132; unit 1479 -->

```text
 typedef struct rk_aiq_wb_mwb_attrib_s {
     rk_aiq_wb_mwb_mode_t mode;
     union MWBPara_u {
         rk_aiq_wb_gain_t gain;
         rk_aiq_wb_scene_t scene;
         rk_aiq_wb_cct_t cct;
     } para;
 } rk_aiq_wb_mwb_attrib_t;
```

<!-- Source EN PDF p.132; unit 1480 -->

【成员】

<!-- Source EN PDF p.132; unit 1481 -->

| 成员名称 | 说明 |
|---|---|
| mode | 模式选择 |

<!-- Source EN PDF p.132; unit 1482 -->

#### 7.5.7  rk_aiq_uapiV2_wb_awb_wbGainOffset_t

<!-- Source EN PDF p.132; unit 1483 -->

【说明】定义自动白平衡增益偏移。

<!-- Source EN PDF p.132; unit 1484 -->

【定义】

<!-- Source EN PDF p.132; unit 1485 -->

```text
 typedef struct rk_aiq_uapiV2_wb_awb_wbGainOffset_s{
   rk_aiq_uapi_sync_t sync;
   CalibDbV2_Awb_gain_offset_cfg_t gainOffset;
 }rk_aiq_uapiV2_wb_awb_wbGainOffset_t;
```

<!-- Source EN PDF p.132; unit 1486 -->

【成员】

<!-- Source EN PDF p.132; unit 1487 -->

| 成员名 | 说明 |
|---|---|
| sync | rk_aiq_uapi_sync_t 定义参见“概述/API 说明”。 |
| gainOffset | 详见后面的 CalibDbV2_Awb_gain_offset_cfg_t 说明。 |

<!-- Source EN PDF p.132; unit 1488 -->

#### 7.5.8  CalibDbV2_Awb_gain_offset_cfg_t

<!-- Source EN PDF p.132; unit 1489 -->

【说明】定义自动白平衡增益偏移。

<!-- Source EN PDF p.132; unit 1490 -->

【定义】

<!-- Source EN PDF p.133; unit 1491 -->

```text
 typedef struct CalibDbV2_Awb_gain_offset_cfg_s{
   bool enable;
   float offset[4];
 }CalibDbV2_Awb_gain_offset_cfg_t;
```

<!-- Source EN PDF p.133; unit 1492 -->

【成员】

<!-- Source EN PDF p.133; unit 1493 -->

| 成员名 | 说明 |
|---|---|
| enable | 使能开关：0 不使能，1 使能。 |
| offset | wbgain 与 offset 相加，R GR GB B 各通道 offset 的范围须使相加结果处于 [0,8]（ISP21，原文平台标注）。 |

<!-- Source EN PDF p.133; unit 1494 -->

#### 7.5.9  rk_aiq_uapiV2_wb_awb_wbGainAdjust_t

<!-- Source EN PDF p.133; unit 1495 -->

【说明】定义自动白平衡色调调整参数。

<!-- Source EN PDF p.133; unit 1496 -->

【定义】

<!-- Source EN PDF p.133; unit 1497 -->

```text
 typedef struct rk_aiq_uapiV2_wb_awb_wbGainAdjustLut_s {
   float lumaValue;
   int ct_grid_num;
   int cri_grid_num;
   float ct_in_range[2];//min,max, equal distance sapmle
   float cri_in_range[2];//min,max
   float *ct_lut_out;//size is ct_grid_num*cri_grid_num
   float *cri_lut_out;
 } rk_aiq_uapiV2_wb_awb_wbGainAdjustLut_t;
 typedef struct rk_aiq_uapiV2_wb_awb_wbGainAdjust_s {
   rk_aiq_uapi_sync_t sync;
   bool enable;
   rk_aiq_uapiV2_wb_awb_wbGainAdjustLut_t *lutAll;
   int lutAll_len;
 } rk_aiq_uapiV2_wb_awb_wbGainAdjust_t;
```

<!-- Source EN PDF p.133; unit 1498 -->

【成员】

<!-- Source EN PDF p.134; unit 1499 -->

| 成员名 | 说明 |
|---|---|
| sync | rk_aiq_uapi_sync_t 定义参见“概述/API 说明”。 |
| enable | 色调调整使能，0 关闭、1 开启。 |
| lutAll | 可为不同环境亮度配置不同输出色温表。 |
| lutAll_len | 指定色温表数量。 |
| lutAll.ct_grid_num | 输入色温采样点数量不限。 |
| lutAll.ct_in_range | 输入色温范围不限。 |
| lutAll.cri_grid_num | 输入色温表显色指数采样点数量不限。 |
| lutAll.cri_in_range | 输入色温表的显色指数范围不限。 |
| lutAll.ct_out | 工具界面中 ct 由左向右递增，色调由冷到暖，CT 范围为 0-255000。 |
| lutAll.cri_out | 工具界面中 cri 由下向上递增、负数到正数，色调由紫到绿；CRI 取值范围不限。 |

<!-- Source EN PDF p.134; unit 1500 -->

更多说明参见 Rockchip_Color_Optimization_Guide 中 WBGain 色彩调整章节。

<!-- Source EN PDF p.134; unit 1501 -->

#### 7.5.10  rk_aiq_uapiV2_wbV30_awb_attrib_t

<!-- Source EN PDF p.134; unit 1502 -->

【说明】定义自动白平衡 API 参数。

<!-- Source EN PDF p.134; unit 1503 -->

【定义】

<!-- Source EN PDF p.134; unit 1504 -->

```text
 typedef struct rk_aiq_uapiV2_wbV30_awb_attrib_s {
     rk_aiq_uapiV2_wb_awb_wbGainAdjust_t wbGainAdjust;
     CalibDbV2_Awb_gain_offset_cfg_t wbGainOffset;
 } rk_aiq_uapiV2_wbV30_awb_attrib_t;
```

<!-- Source EN PDF p.134; unit 1505 -->

【成员】

<!-- Source EN PDF p.135; unit 1506 -->

| 成员名 | 说明 |
|---|---|
| wbGainAdjust | 参见 CalibDbV2_Awb_gain_offset_cfg_t。 |
| wbGainOffset | 参见 rk_aiq_uapiV2_wb_awb_wbGainAdjust_t。 |
| multiWindow | 参见 rk_aiq_uapiV2_wbV32_awb_mulWindow_t。 |

<!-- Source EN PDF p.135; unit 1507 -->

#### 7.5.11  rk_aiq_uapiV2_wbV32_attrib_t

<!-- Source EN PDF p.135; unit 1508 -->

【说明】定义白平衡 API 支持的全部参数。

<!-- Source EN PDF p.135; unit 1509 -->

【定义】

<!-- Source EN PDF p.135; unit 1510 -->

```text
 typedef struct rk_aiq_uapiV2_wbV30_attrib_s {
     rk_aiq_uapi_sync_t sync;
     bool byPass;
     rk_aiq_wb_op_mode_t mode;
     rk_aiq_wb_mwb_attrib_t stManual;
     rk_aiq_uapiV2_wbV30_awb_attrib_t stAuto;
 } rk_aiq_uapiV2_wbV30_attrib_t;
```

<!-- Source EN PDF p.135; unit 1511 -->

【成员】

<!-- Source EN PDF p.135; unit 1512 -->

| 成员名 | 说明 |
|---|---|
| sync | rk_aiq_uapi_sync_t 说明参见“概述/API 说明”。 |
| byPass | 取值 0 或 1。0 执行白平衡校正，增益由表末参数控制；1 不执行白平衡校正。 |
| mode | 自动/手动白平衡控制参数参见 rk_aiq_wb_op_mode_t。 |
| stManual | 手动白平衡参数参见 rk_aiq_wb_mwb_attrib_t。 |
| stAuto | 自动白平衡参数参见 rk_aiq_uapiV2_wbV21_awb_attrib_t。 |

<!-- Source EN PDF p.135; unit 1513 -->

### 7.6 模块级 API 参考

<!-- Source EN PDF p.135; unit 1514 -->

#### 7.6.1  rk_aiq_user_api2_awbV30_SetAllAttrib

<!-- Source EN PDF p.135; unit 1515 -->

【说明】设置白平衡 API 支持的全部参数。

<!-- Source EN PDF p.135; unit 1516 -->

【语法】

<!-- Source EN PDF p.136; unit 1517 -->

```text
 XCamReturn
 rk_aiq_user_api2_awbV30_SetAllAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wbV30_attrib_t attr);
```

<!-- Source EN PDF p.136; unit 1518 -->

【参数】

<!-- Source EN PDF p.136; unit 1519 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 白平衡 API 支持的全部参数 | 输出 |

<!-- Source EN PDF p.136; unit 1520 -->

【返回值】

<!-- Source EN PDF p.136; unit 1521 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.136; unit 1522 -->

【依赖】

<!-- Source EN PDF p.136; unit 1523 -->

头文件：rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.136; unit 1524 -->

库文件：librkaiq.so

<!-- Source EN PDF p.136; unit 1525 -->

【示例】

<!-- Source EN PDF p.136; unit 1526 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.136; unit 1527 -->

#### 7.6.2  rk_aiq_user_api2_awbV30_GetAllAttrib

<!-- Source EN PDF p.136; unit 1528 -->

【说明】获取白平衡 API 支持的全部参数。

<!-- Source EN PDF p.136; unit 1529 -->

【语法】

<!-- Source EN PDF p.136; unit 1530 -->

```text
 XCamReturn
 rk_aiq_user_api2_awbV30_GetAllAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wbV30_attrib_t *attr);
```

<!-- Source EN PDF p.136; unit 1531 -->

【参数】

<!-- Source EN PDF p.136; unit 1532 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 白平衡 API 支持的全部参数 | 输出 |

<!-- Source EN PDF p.136; unit 1533 -->

【返回值】

<!-- Source EN PDF p.137; unit 1534 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.137; unit 1535 -->

【依赖】

<!-- Source EN PDF p.137; unit 1536 -->

头文件：rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.137; unit 1537 -->

库文件：librkaiq.so

<!-- Source EN PDF p.137; unit 1538 -->

【示例】

<!-- Source EN PDF p.137; unit 1539 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.137; unit 1540 -->

#### 7.6.3  rk_aiq_user_api2_awb_GetCCT

<!-- Source EN PDF p.137; unit 1541 -->

【说明】获取白平衡色温，适用于自动与手动模式。

<!-- Source EN PDF p.137; unit 1542 -->

【语法】

<!-- Source EN PDF p.137; unit 1543 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_GetCCT(const rk_aiq_sys_ctx_t* sys_ctx, rk_aiq_wb_cct_t
 *cct);
```

<!-- Source EN PDF p.137; unit 1544 -->

【参数】

<!-- Source EN PDF p.137; unit 1545 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| cct | 白平衡色温参数 | 输出 |

<!-- Source EN PDF p.137; unit 1546 -->

【返回值】

<!-- Source EN PDF p.137; unit 1547 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.137; unit 1548 -->

【依赖】

<!-- Source EN PDF p.137; unit 1549 -->

头文件：rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.137; unit 1550 -->

库文件：librkaiq.so

<!-- Source EN PDF p.137; unit 1551 -->

【示例】

<!-- Source EN PDF p.137; unit 1552 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.138; unit 1553 -->

#### 7.6.4  rk_aiq_user_api2_awb_QueryWBInfo

<!-- Source EN PDF p.138; unit 1554 -->

【说明】获取白平衡增益系数与色温。

<!-- Source EN PDF p.138; unit 1555 -->

【语法】

<!-- Source EN PDF p.138; unit 1556 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_QueryWBInfo(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_wb_querry_info_t *wb_querry_info);
```

<!-- Source EN PDF p.138; unit 1557 -->

【参数】

<!-- Source EN PDF p.138; unit 1558 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| wb_querry_info | 色彩相关状态参数 | 输出 |

<!-- Source EN PDF p.138; unit 1559 -->

【返回值】

<!-- Source EN PDF p.138; unit 1560 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.138; unit 1561 -->

【依赖】

<!-- Source EN PDF p.138; unit 1562 -->

头文件：rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.138; unit 1563 -->

库文件：librkaiq.so

<!-- Source EN PDF p.138; unit 1564 -->

【示例】

<!-- Source EN PDF p.138; unit 1565 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.138; unit 1566 -->

#### 7.6.5  rk_aiq_user_api2_awb_Lock

<!-- Source EN PDF p.138; unit 1567 -->

【说明】锁定当前白平衡参数。

<!-- Source EN PDF p.138; unit 1568 -->

【语法】

<!-- Source EN PDF p.138; unit 1569 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_Lock(const rk_aiq_sys_ctx_t* sys_ctx);
```

<!-- Source EN PDF p.138; unit 1570 -->

【参数】

<!-- Source EN PDF p.138; unit 1571 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |

<!-- Source EN PDF p.139; unit 1572 -->

【返回值】

<!-- Source EN PDF p.139; unit 1573 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.139; unit 1574 -->

【依赖】

<!-- Source EN PDF p.139; unit 1575 -->

头文件：rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.139; unit 1576 -->

库文件：librkaiq.so

<!-- Source EN PDF p.139; unit 1577 -->

【示例】

<!-- Source EN PDF p.139; unit 1578 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.139; unit 1579 -->

#### 7.6.6  rk_aiq_user_api2_awb_Unlock

<!-- Source EN PDF p.139; unit 1580 -->

【说明】解锁已锁定的白平衡参数。

<!-- Source EN PDF p.139; unit 1581 -->

【语法】

<!-- Source EN PDF p.139; unit 1582 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_Lock(const rk_aiq_sys_ctx_t* sys_ctx);
```

<!-- Source EN PDF p.139; unit 1583 -->

【参数】

<!-- Source EN PDF p.139; unit 1584 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |

<!-- Source EN PDF p.139; unit 1585 -->

【返回值】

<!-- Source EN PDF p.139; unit 1586 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.139; unit 1587 -->

【依赖】

<!-- Source EN PDF p.139; unit 1588 -->

头文件：rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.139; unit 1589 -->

库文件：librkaiq.so

<!-- Source EN PDF p.139; unit 1590 -->

【示例】

<!-- Source EN PDF p.139; unit 1591 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.140; unit 1592 -->

#### 7.6.7  rk_aiq_user_api2_awb_SetWpModeAttrib

<!-- Source EN PDF p.140; unit 1593 -->

【说明】设置白平衡工作模式。

<!-- Source EN PDF p.140; unit 1594 -->

【语法】

<!-- Source EN PDF p.140; unit 1595 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_SetWpModeAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wb_opMode_t attr);
```

<!-- Source EN PDF p.140; unit 1596 -->

【参数】

<!-- Source EN PDF p.140; unit 1597 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 白平衡工作模式 | 输出 |

<!-- Source EN PDF p.140; unit 1598 -->

【返回值】

<!-- Source EN PDF p.140; unit 1599 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.140; unit 1600 -->

【依赖】

<!-- Source EN PDF p.140; unit 1601 -->

头文件：rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.140; unit 1602 -->

库文件：librkaiq.so

<!-- Source EN PDF p.140; unit 1603 -->

【示例】

<!-- Source EN PDF p.140; unit 1604 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.140; unit 1605 -->

#### 7.6.8  rk_aiq_user_api2_awb_GetWpModeAttrib

<!-- Source EN PDF p.140; unit 1606 -->

【说明】获取白平衡工作模式。

<!-- Source EN PDF p.140; unit 1607 -->

【语法】

<!-- Source EN PDF p.140; unit 1608 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_GetWpModeAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wb_opMode_t *attr);
```

<!-- Source EN PDF p.140; unit 1609 -->

【参数】

<!-- Source EN PDF p.141; unit 1610 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 白平衡工作模式 | 输出 |

<!-- Source EN PDF p.141; unit 1611 -->

【返回值】

<!-- Source EN PDF p.141; unit 1612 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.141; unit 1613 -->

【依赖】

<!-- Source EN PDF p.141; unit 1614 -->

头文件：rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.141; unit 1615 -->

库文件：librkaiq.so

<!-- Source EN PDF p.141; unit 1616 -->

【示例】

<!-- Source EN PDF p.141; unit 1617 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.141; unit 1618 -->

#### 7.6.9  rk_aiq_user_api2_awb_SetMwbAttrib

<!-- Source EN PDF p.141; unit 1619 -->

【说明】设置手动白平衡参数。

<!-- Source EN PDF p.141; unit 1620 -->

【语法】

<!-- Source EN PDF p.141; unit 1621 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_SetMwbAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_wb_mwb_attrib_t attr);
```

<!-- Source EN PDF p.141; unit 1622 -->

【参数】

<!-- Source EN PDF p.141; unit 1623 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 手动白平衡参数 | 输入 |

<!-- Source EN PDF p.141; unit 1624 -->

【返回值】

<!-- Source EN PDF p.141; unit 1625 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.141; unit 1626 -->

【依赖】

<!-- Source EN PDF p.141; unit 1627 -->

头文件：rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.142; unit 1628 -->

库文件：librkaiq.so

<!-- Source EN PDF p.142; unit 1629 -->

【示例】

<!-- Source EN PDF p.142; unit 1630 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.142; unit 1631 -->

#### 7.6.10  rk_aiq_user_api2_awb_GetMwbAttrib

<!-- Source EN PDF p.142; unit 1632 -->

【说明】设置手动白平衡参数。

<!-- Source EN PDF p.142; unit 1633 -->

【语法】

<!-- Source EN PDF p.142; unit 1634 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_SetMwbAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_wb_mwb_attrib_t attr);
```

<!-- Source EN PDF p.142; unit 1635 -->

【参数】

<!-- Source EN PDF p.142; unit 1636 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 手动白平衡参数 | 输入 |

<!-- Source EN PDF p.142; unit 1637 -->

【返回值】

<!-- Source EN PDF p.142; unit 1638 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.142; unit 1639 -->

【依赖】

<!-- Source EN PDF p.142; unit 1640 -->

头文件：rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.142; unit 1641 -->

库文件：librkaiq.so

<!-- Source EN PDF p.142; unit 1642 -->

【示例】

<!-- Source EN PDF p.142; unit 1643 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.142; unit 1644 -->

#### 7.6.11  rk_aiq_user_api2_awb_SetWbGainAdjustAttrib

<!-- Source EN PDF p.142; unit 1645 -->

【说明】设置自动白平衡模式的色调调整参数。

<!-- Source EN PDF p.142; unit 1646 -->

【语法】

<!-- Source EN PDF p.142; unit 1647 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_SetWbGainAdjustAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wb_awb_wbGainAdjust_t attr);
```

<!-- Source EN PDF p.143; unit 1648 -->

【参数】

<!-- Source EN PDF p.143; unit 1649 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 色调调整参数 | 输入 |

<!-- Source EN PDF p.143; unit 1650 -->

【返回值】

<!-- Source EN PDF p.143; unit 1651 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.143; unit 1652 -->

【依赖】

<!-- Source EN PDF p.143; unit 1653 -->

头文件：rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.143; unit 1654 -->

库文件：librkaiq.so

<!-- Source EN PDF p.143; unit 1655 -->

【示例】

<!-- Source EN PDF p.143; unit 1656 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.143; unit 1657 -->

#### 7.6.12  rk_aiq_user_api2_awb_GetWbGainAdjustAttrib

<!-- Source EN PDF p.143; unit 1658 -->

【说明】获取自动白平衡模式的色调调整参数。

<!-- Source EN PDF p.143; unit 1659 -->

【语法】

<!-- Source EN PDF p.143; unit 1660 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_GetWbGainAdjustAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wb_awb_wbGainAdjust_t *attr);
```

<!-- Source EN PDF p.143; unit 1661 -->

【参数】

<!-- Source EN PDF p.143; unit 1662 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 色调调整参数 | 输入 |

<!-- Source EN PDF p.143; unit 1663 -->

【返回值】

<!-- Source EN PDF p.143; unit 1664 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.143; unit 1665 -->

【依赖】

<!-- Source EN PDF p.144; unit 1666 -->

头文件：rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.144; unit 1667 -->

库文件：librkaiq.so

<!-- Source EN PDF p.144; unit 1668 -->

【示例】

<!-- Source EN PDF p.144; unit 1669 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.144; unit 1670 -->

#### 7.6.13  rk_aiq_user_api2_awb_SetWbGainOffsetAttrib

<!-- Source EN PDF p.144; unit 1671 -->

【说明】设置自动白平衡增益偏移。

<!-- Source EN PDF p.144; unit 1672 -->

【语法】

<!-- Source EN PDF p.144; unit 1673 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_SetWbGainOffsetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wb_awb_wbGainOffset_t attr);
```

<!-- Source EN PDF p.144; unit 1674 -->

【参数】

<!-- Source EN PDF p.144; unit 1675 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 色调调整参数 | 输入 |

<!-- Source EN PDF p.144; unit 1676 -->

【返回值】

<!-- Source EN PDF p.144; unit 1677 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.144; unit 1678 -->

【依赖】

<!-- Source EN PDF p.144; unit 1679 -->

头文件：rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.144; unit 1680 -->

库文件：librkaiq.so

<!-- Source EN PDF p.144; unit 1681 -->

【示例】

<!-- Source EN PDF p.144; unit 1682 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.144; unit 1683 -->

#### 7.6.14  rk_aiq_user_api2_awb_GetWbGainOffsetAttrib

<!-- Source EN PDF p.144; unit 1684 -->

【说明】获取自动白平衡增益偏移。

<!-- Source EN PDF p.144; unit 1685 -->

【语法】

<!-- Source EN PDF p.145; unit 1686 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_GetWbGainOffsetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wb_awb_wbGainOffset_t *attr);
```

<!-- Source EN PDF p.145; unit 1687 -->

【参数】

<!-- Source EN PDF p.145; unit 1688 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 色调调整参数 | 输入 |

<!-- Source EN PDF p.145; unit 1689 -->

【返回值】

<!-- Source EN PDF p.145; unit 1690 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.145; unit 1691 -->

【依赖】

<!-- Source EN PDF p.145; unit 1692 -->

头文件：rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.145; unit 1693 -->

库文件：librkaiq.so

<!-- Source EN PDF p.145; unit 1694 -->

【示例】

<!-- Source EN PDF p.145; unit 1695 -->

参见 sample_awb_module.cpp。

<!-- Source EN PDF p.145; unit 1696 -->

### 7.7 模块级 API 数据类型

<!-- Source EN PDF p.145; unit 1697 -->

#### 7.7.1  rk_aiq_wb_querry_info_t

<!-- Source EN PDF p.145; unit 1698 -->

【说明】定义白平衡查询信息。

<!-- Source EN PDF p.145; unit 1699 -->

【定义】

<!-- Source EN PDF p.145; unit 1700 -->

```text
 typedef struct rk_aiq_wb_querry_info_s {
     rk_aiq_wb_gain_t gain;
     rk_aiq_wb_cct_t cctGloabl;
     bool awbConverged;
     uint32_t LVValue;
 } rk_aiq_wb_querry_info_t;
```

<!-- Source EN PDF p.145; unit 1701 -->

【成员】

<!-- Source EN PDF p.146; unit 1702 -->

| 成员名称 | 说明 |
|---|---|
| gain | Gain |
| cctGloabl | 全局色温参数 |
| LVValue | 相关环境亮度 |

<!-- Source EN PDF p.146; unit 1703 -->

#### 7.7.2  rk_aiq_wb_op_mode_t

<!-- Source EN PDF p.146; unit 1704 -->

【说明】定义白平衡工作模式。

<!-- Source EN PDF p.146; unit 1705 -->

【定义】

<!-- Source EN PDF p.146; unit 1706 -->

```text
 typedef struct rk_aiq_uapiV2_wb_opMode_s {
   rk_aiq_uapi_sync_t sync;
   rk_aiq_wb_op_mode_t mode;
 } rk_aiq_uapiV2_wb_opMode_t;
```

<!-- Source EN PDF p.146; unit 1707 -->

【成员】

<!-- Source EN PDF p.146; unit 1708 -->

| 成员名称 | 说明 |
|---|---|
| sync | rk_aiq_uapi_sync_t 说明参见“概述/API 说明”。 |
| mode | 参见 rk_aiq_wb_op_mode_t 说明。 |

<!-- Source EN PDF p.146; unit 1709 -->

#### 7.7.3  rk_aiq_wb_mwb_attrib_t

<!-- Source EN PDF p.146; unit 1710 -->

【说明】定义手动白平衡属性。

<!-- Source EN PDF p.146; unit 1711 -->

【定义】

<!-- Source EN PDF p.146; unit 1712 -->

```text
 typedef struct rk_aiq_wb_mwb_attrib_s {
      rk_aiq_uapi_sync_t sync;
     rk_aiq_wb_mwb_mode_t mode;
     union MWBPara_u {
         rk_aiq_wb_gain_t gain;
         rk_aiq_wb_scene_t scene;
         rk_aiq_wb_cct_t cct;
     } para;
 } rk_aiq_wb_mwb_attrib_t;
```

<!-- Source EN PDF p.146; unit 1713 -->

【成员】

<!-- Source EN PDF p.147; unit 1714 -->

| 成员名称 | 说明 |
|---|---|
| sync | rk_aiq_uapi_sync_t 的定义参见“概述/API 说明”。 |
| mode | 模式选择 |
| para | 该模式的参数配置 |

<!-- Source EN PDF p.147; unit 1715 -->

## 8.   AF

<!-- Source EN PDF p.147; unit 1716 -->

### 8.1 概述

<!-- Source EN PDF p.147; unit 1717 -->

AF 模块调整摄像头镜头，使被摄物体成像清晰。

<!-- Source EN PDF p.147; unit 1718 -->

### 8.2 功能说明

<!-- Source EN PDF p.147; unit 1719 -->

AF 由统计和控制算法两部分组成，下图为 AF 信息统计模块框图。

<!-- Source EN PDF p.147; unit 1720 -->

![英文原稿技术图 — PDF p.147](/docs/rockchip-isp30-development/assets/en-p147-X1161.png)

<!-- Source EN PDF p.147; unit 1721 -->

ch0/ch1/ch2 分别对应 HDR 的 S/M/L 帧；debayer 为 HDR 合成帧。

<!-- Source EN PDF p.147; unit 1722 -->

windowA 输出主要包括 15\*15 的 V1/V2/H1/H2 FV、亮度及高光计数。

<!-- Source EN PDF p.147; unit 1723 -->

windowB 主要输出一个 FV、亮度及高光计数。

<!-- Source EN PDF p.148; unit 1724 -->

### 8.3 用户 AF 算法开发

<!-- Source EN PDF p.148; unit 1725 -->

![英文原稿技术图 — PDF p.148](/docs/rockchip-isp30-development/assets/en-p148-X1167.png)

<!-- Source EN PDF p.148; unit 1726 -->

参考代码位置：sdk: external/camera_engine_rkaiq/rkisp_demo/demo/af_algo_demo

<!-- Source EN PDF p.148; unit 1727 -->

### 8.4 功能级 API 参考

<!-- Source EN PDF p.148; unit 1728 -->

#### 8.4.1  rk_aiq_uapi2_setFocusMode

<!-- Source EN PDF p.148; unit 1729 -->

【说明】配置对焦模式。

<!-- Source EN PDF p.148; unit 1730 -->

【语法】

<!-- Source EN PDF p.148; unit 1731 -->

```text
 XCamReturn rk_aiq_uapi2_setFocusMode(const rk_aiq_sys_ctx_t* ctx, opMode_t mode);
```

<!-- Source EN PDF p.148; unit 1732 -->

【参数】

<!-- Source EN PDF p.148; unit 1733 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| mode | 对焦模式 | 输入 |

<!-- Source EN PDF p.148; unit 1734 -->

【返回值】

<!-- Source EN PDF p.148; unit 1735 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.148; unit 1736 -->

【依赖】

<!-- Source EN PDF p.148; unit 1737 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.148; unit 1738 -->

库文件：librkaiq.so

<!-- Source EN PDF p.149; unit 1739 -->

#### 8.4.2  rk_aiq_uapi2_getFocusMode

<!-- Source EN PDF p.149; unit 1740 -->

【说明】获取当前对焦模式。

<!-- Source EN PDF p.149; unit 1741 -->

【语法】

<!-- Source EN PDF p.149; unit 1742 -->

```text
 XCamReturn rk_aiq_uapi2_getFocusMode(const rk_aiq_sys_ctx_t* ctx, opMode_t
 *mode);
```

<!-- Source EN PDF p.149; unit 1743 -->

【参数】

<!-- Source EN PDF p.149; unit 1744 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| mode | 对焦模式 | 输出 |

<!-- Source EN PDF p.149; unit 1745 -->

【返回值】

<!-- Source EN PDF p.149; unit 1746 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.149; unit 1747 -->

【依赖】

<!-- Source EN PDF p.149; unit 1748 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.149; unit 1749 -->

库文件：librkaiq.so

<!-- Source EN PDF p.149; unit 1750 -->

#### 8.4.3  rk_aiq_uapi2_setFocusWin

<!-- Source EN PDF p.149; unit 1751 -->

【说明】设置自动对焦窗口。

<!-- Source EN PDF p.149; unit 1752 -->

【语法】

<!-- Source EN PDF p.149; unit 1753 -->

```text
 XCamReturn rk_aiq_uapi2_setFocusWin(const rk_aiq_sys_ctx_t* ctx, paRect_t *rect);
```

<!-- Source EN PDF p.149; unit 1754 -->

【参数】

<!-- Source EN PDF p.149; unit 1755 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| rect | 对焦窗口，范围由 sensor 输入尺寸决定。 | 输入 |

<!-- Source EN PDF p.149; unit 1756 -->

【返回值】

<!-- Source EN PDF p.150; unit 1757 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.150; unit 1758 -->

【依赖】

<!-- Source EN PDF p.150; unit 1759 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.150; unit 1760 -->

库文件：librkaiq.so

<!-- Source EN PDF p.150; unit 1761 -->

#### 8.4.4  rk_aiq_uapi2_getFocusWin

<!-- Source EN PDF p.150; unit 1762 -->

【说明】设置自动对焦窗口。

<!-- Source EN PDF p.150; unit 1763 -->

【语法】

<!-- Source EN PDF p.150; unit 1764 -->

```text
 XCamReturn rk_aiq_uapi2_getFocusWin(const rk_aiq_sys_ctx_t* ctx, paRect_t *rect);
```

<!-- Source EN PDF p.150; unit 1765 -->

【参数】

<!-- Source EN PDF p.150; unit 1766 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| rect | 对焦窗口 | 输出 |

<!-- Source EN PDF p.150; unit 1767 -->

【返回值】

<!-- Source EN PDF p.150; unit 1768 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.150; unit 1769 -->

【依赖】

<!-- Source EN PDF p.150; unit 1770 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.150; unit 1771 -->

库文件：librkaiq.so

<!-- Source EN PDF p.150; unit 1772 -->

#### 8.4.5  rk_aiq_uapi2_lockFocus

<!-- Source EN PDF p.150; unit 1773 -->

【说明】锁定自动对焦，暂停对焦动作。

<!-- Source EN PDF p.150; unit 1774 -->

【语法】

<!-- Source EN PDF p.150; unit 1775 -->

```text
 XCamReturn rk_aiq_uapi2_lockFocus(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.150; unit 1776 -->

【参数】

<!-- Source EN PDF p.151; unit 1777 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |

<!-- Source EN PDF p.151; unit 1778 -->

【返回值】

<!-- Source EN PDF p.151; unit 1779 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.151; unit 1780 -->

【依赖】

<!-- Source EN PDF p.151; unit 1781 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.151; unit 1782 -->

库文件：librkaiq.so

<!-- Source EN PDF p.151; unit 1783 -->

#### 8.4.6  rk_aiq_uapi2_unlockFocus

<!-- Source EN PDF p.151; unit 1784 -->

【说明】解锁自动对焦，继续对焦动作。

<!-- Source EN PDF p.151; unit 1785 -->

【语法】

<!-- Source EN PDF p.151; unit 1786 -->

```text
 XCamReturn rk_aiq_uapi2_unlockFocus(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.151; unit 1787 -->

【参数】

<!-- Source EN PDF p.151; unit 1788 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |

<!-- Source EN PDF p.151; unit 1789 -->

【返回值】

<!-- Source EN PDF p.151; unit 1790 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.151; unit 1791 -->

【依赖】

<!-- Source EN PDF p.151; unit 1792 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.151; unit 1793 -->

库文件：librkaiq.so

<!-- Source EN PDF p.151; unit 1794 -->

#### 8.4.7  rk_aiq_uapi2_oneshotFocus

<!-- Source EN PDF p.151; unit 1795 -->

【说明】触发一次对焦，完成后不再继续。

<!-- Source EN PDF p.151; unit 1796 -->

【语法】

<!-- Source EN PDF p.152; unit 1797 -->

```text
 XCamReturn rk_aiq_uapi2_oneshotFocus(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.152; unit 1798 -->

【参数】

<!-- Source EN PDF p.152; unit 1799 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |

<!-- Source EN PDF p.152; unit 1800 -->

【返回值】

<!-- Source EN PDF p.152; unit 1801 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.152; unit 1802 -->

【依赖】

<!-- Source EN PDF p.152; unit 1803 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.152; unit 1804 -->

库文件：librkaiq.so

<!-- Source EN PDF p.152; unit 1805 -->

#### 8.4.8  rk_aiq_uapi2_manualTrigerFocus

<!-- Source EN PDF p.152; unit 1806 -->

【说明】手动触发对焦；完成后持续监测清晰度，模糊时再次对焦。

<!-- Source EN PDF p.152; unit 1807 -->

【语法】

<!-- Source EN PDF p.152; unit 1808 -->

```text
 XCamReturn rk_aiq_uapi2_manualTrigerFocus(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.152; unit 1809 -->

【参数】

<!-- Source EN PDF p.152; unit 1810 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |

<!-- Source EN PDF p.152; unit 1811 -->

【返回值】

<!-- Source EN PDF p.152; unit 1812 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.152; unit 1813 -->

【依赖】

<!-- Source EN PDF p.152; unit 1814 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.152; unit 1815 -->

库文件：librkaiq.so

<!-- Source EN PDF p.153; unit 1816 -->

#### 8.4.9  rk_aiq_uapi2_trackingFocus

<!-- Source EN PDF p.153; unit 1817 -->

【说明】持续监测清晰度，模糊时再次对焦，通常在 rk_aiq_uapi2_oneshotFocus 后使用。

<!-- Source EN PDF p.153; unit 1818 -->

【语法】

<!-- Source EN PDF p.153; unit 1819 -->

```text
 XCamReturn rk_aiq_uapi2_trackingFocus(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.153; unit 1820 -->

【参数】

<!-- Source EN PDF p.153; unit 1821 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |

<!-- Source EN PDF p.153; unit 1822 -->

【返回值】

<!-- Source EN PDF p.153; unit 1823 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.153; unit 1824 -->

【依赖】

<!-- Source EN PDF p.153; unit 1825 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.153; unit 1826 -->

库文件：librkaiq.so

<!-- Source EN PDF p.153; unit 1827 -->

#### 8.4.10  rk_aiq_uapi2_getSearchResult

<!-- Source EN PDF p.153; unit 1828 -->

【说明】获取对焦结果。

<!-- Source EN PDF p.153; unit 1829 -->

【语法】

<!-- Source EN PDF p.153; unit 1830 -->

```text
 XCamReturn rk_aiq_uapi2_getSearchResult(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_af_result_t* result);
```

<!-- Source EN PDF p.153; unit 1831 -->

【参数】

<!-- Source EN PDF p.153; unit 1832 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| result | 对焦结果参见 rk_aiq_af_result_t 结构体。 | 输出 |

<!-- Source EN PDF p.153; unit 1833 -->

【返回值】

<!-- Source EN PDF p.154; unit 1834 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.154; unit 1835 -->

【依赖】

<!-- Source EN PDF p.154; unit 1836 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.154; unit 1837 -->

库文件：librkaiq.so

<!-- Source EN PDF p.154; unit 1838 -->

#### 8.4.11  rk_aiq_uapi2_getZoomRange

<!-- Source EN PDF p.154; unit 1839 -->

【说明】获取变焦范围，用于限制 rk_aiq_uapi_setOpZoomPosition 输入的变焦码值。

<!-- Source EN PDF p.154; unit 1840 -->

【语法】

<!-- Source EN PDF p.154; unit 1841 -->

```text
 XCamReturn rk_aiq_uapi2_getZoomRange(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_af_zoomrange* range);
```

<!-- Source EN PDF p.154; unit 1842 -->

【参数】

<!-- Source EN PDF p.154; unit 1843 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| range | 变焦可移动范围，参见 rk_aiq_af_zoomrange。 | 输出 |

<!-- Source EN PDF p.154; unit 1844 -->

【返回值】

<!-- Source EN PDF p.154; unit 1845 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.154; unit 1846 -->

【依赖】

<!-- Source EN PDF p.154; unit 1847 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.154; unit 1848 -->

库文件：librkaiq.so

<!-- Source EN PDF p.154; unit 1849 -->

#### 8.4.12  rk_aiq_uapi2_setOpZoomPosition

<!-- Source EN PDF p.154; unit 1850 -->

【说明】设置、修改变焦位置。

<!-- Source EN PDF p.154; unit 1851 -->

【语法】

<!-- Source EN PDF p.154; unit 1852 -->

```text
 XCamReturn rk_aiq_uapi2_setOpZoomPosition(const rk_aiq_sys_ctx_t* ctx, int pos);
```

<!-- Source EN PDF p.154; unit 1853 -->

【参数】

<!-- Source EN PDF p.155; unit 1854 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| pos | 变焦位置，范围由 rk_aiq_uapi2_getZoomRange 决定。 | 输入 |

<!-- Source EN PDF p.155; unit 1855 -->

【返回值】

<!-- Source EN PDF p.155; unit 1856 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.155; unit 1857 -->

【依赖】

<!-- Source EN PDF p.155; unit 1858 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.155; unit 1859 -->

库文件：librkaiq.so

<!-- Source EN PDF p.155; unit 1860 -->

#### 8.4.13  rk_aiq_uapi2_getOpZoomPosition

<!-- Source EN PDF p.155; unit 1861 -->

【说明】获取变焦位置。

<!-- Source EN PDF p.155; unit 1862 -->

【语法】

<!-- Source EN PDF p.155; unit 1863 -->

```text
 XCamReturn rk_aiq_uapi2_getOpZoomPosition(const rk_aiq_sys_ctx_t* ctx, int *pos);
```

<!-- Source EN PDF p.155; unit 1864 -->

【参数】

<!-- Source EN PDF p.155; unit 1865 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| pos | 变焦位置 | 输出 |

<!-- Source EN PDF p.155; unit 1866 -->

【返回值】

<!-- Source EN PDF p.155; unit 1867 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.155; unit 1868 -->

【依赖】

<!-- Source EN PDF p.155; unit 1869 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.155; unit 1870 -->

库文件：librkaiq.so

<!-- Source EN PDF p.156; unit 1871 -->

#### 8.4.14  rk_aiq_uapi2_endOpZoomChange

<!-- Source EN PDF p.156; unit 1872 -->

【说明】结束变焦设备位置设置。在 rk_aiq_uapi_setOpZoomPosition 后调用，随后执行对焦动作。

<!-- Source EN PDF p.156; unit 1873 -->

【语法】

<!-- Source EN PDF p.156; unit 1874 -->

```text
 XCamReturn rk_aiq_uapi2_endOpZoomChange(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.156; unit 1875 -->

【参数】

<!-- Source EN PDF p.156; unit 1876 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |

<!-- Source EN PDF p.156; unit 1877 -->

【返回值】

<!-- Source EN PDF p.156; unit 1878 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.156; unit 1879 -->

【依赖】

<!-- Source EN PDF p.156; unit 1880 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.156; unit 1881 -->

库文件：librkaiq.so

<!-- Source EN PDF p.156; unit 1882 -->

#### 8.4.15  rk_aiq_uapi2_getFocusRange

<!-- Source EN PDF p.156; unit 1883 -->

【说明】获取对焦范围，用于限制 rk_aiq_uapi_setFocusPosition 输入的对焦码值。

<!-- Source EN PDF p.156; unit 1884 -->

【语法】

<!-- Source EN PDF p.156; unit 1885 -->

```text
 XCamReturn rk_aiq_uapi2_getFocusRange(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_af_focusrange* range);
```

<!-- Source EN PDF p.156; unit 1886 -->

【参数】

<!-- Source EN PDF p.156; unit 1887 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| range | 对焦可移动范围，参见 rk_aiq_af_focusrange。 | 输出 |

<!-- Source EN PDF p.156; unit 1888 -->

【返回值】

<!-- Source EN PDF p.157; unit 1889 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.157; unit 1890 -->

【依赖】

<!-- Source EN PDF p.157; unit 1891 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.157; unit 1892 -->

库文件：librkaiq.so

<!-- Source EN PDF p.157; unit 1893 -->

#### 8.4.16  rk_aiq_uapi2_setFocusPosition

<!-- Source EN PDF p.157; unit 1894 -->

【说明】在手动模式下设置对焦位置。

<!-- Source EN PDF p.157; unit 1895 -->

【语法】

<!-- Source EN PDF p.157; unit 1896 -->

```text
 XCamReturn rk_aiq_uapi2_setFocusPosition(const rk_aiq_sys_ctx_t* ctx, unsigned
 short code);
```

<!-- Source EN PDF p.157; unit 1897 -->

【参数】

<!-- Source EN PDF p.157; unit 1898 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| code | 对焦码值，范围由 rk_aiq_uapi2_getFocusRange 决定。 | 输入 |

<!-- Source EN PDF p.157; unit 1899 -->

【返回值】

<!-- Source EN PDF p.157; unit 1900 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.157; unit 1901 -->

【依赖】

<!-- Source EN PDF p.157; unit 1902 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.157; unit 1903 -->

库文件：librkaiq.so

<!-- Source EN PDF p.157; unit 1904 -->

#### 8.4.17  rk_aiq_uapi2_getFocusPosition

<!-- Source EN PDF p.157; unit 1905 -->

【说明】获取当前对焦位置。

<!-- Source EN PDF p.157; unit 1906 -->

【语法】

<!-- Source EN PDF p.157; unit 1907 -->

```text
 XCamReturn rk_aiq_uapi2_getFocusPosition(const rk_aiq_sys_ctx_t* ctx, unsigned
 short *code);
```

<!-- Source EN PDF p.158; unit 1908 -->

【参数】

<!-- Source EN PDF p.158; unit 1909 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| code | 对焦码值 | 输出 |

<!-- Source EN PDF p.158; unit 1910 -->

【返回值】

<!-- Source EN PDF p.158; unit 1911 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.158; unit 1912 -->

【依赖】

<!-- Source EN PDF p.158; unit 1913 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.158; unit 1914 -->

库文件：librkaiq.so

<!-- Source EN PDF p.158; unit 1915 -->

#### 8.4.18  rk_aiq_uapi2_startZoomCalib

<!-- Source EN PDF p.158; unit 1916 -->

【说明】执行电动马达模组校正。

<!-- Source EN PDF p.158; unit 1917 -->

【语法】

<!-- Source EN PDF p.158; unit 1918 -->

```text
 XCamReturn rk_aiq_uapi2_startZoomCalib(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.158; unit 1919 -->

【参数】

<!-- Source EN PDF p.158; unit 1920 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |

<!-- Source EN PDF p.158; unit 1921 -->

【返回值】

<!-- Source EN PDF p.158; unit 1922 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.158; unit 1923 -->

【依赖】

<!-- Source EN PDF p.158; unit 1924 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.158; unit 1925 -->

库文件：librkaiq.so

<!-- Source EN PDF p.159; unit 1926 -->

#### 8.4.19  rk_aiq_uapi2_resetZoom

<!-- Source EN PDF p.159; unit 1927 -->

【说明】执行电动马达模组复位。

<!-- Source EN PDF p.159; unit 1928 -->

【语法】

<!-- Source EN PDF p.159; unit 1929 -->

```text
 XCamReturn rk_aiq_uapi2_resetZoom(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.159; unit 1930 -->

【参数】

<!-- Source EN PDF p.159; unit 1931 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |

<!-- Source EN PDF p.159; unit 1932 -->

【返回值】

<!-- Source EN PDF p.159; unit 1933 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.159; unit 1934 -->

【依赖】

<!-- Source EN PDF p.159; unit 1935 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.159; unit 1936 -->

库文件：librkaiq.so

<!-- Source EN PDF p.159; unit 1937 -->

### 8.5 功能级 API 数据类型

<!-- Source EN PDF p.159; unit 1938 -->

#### 8.5.1  opMode_t

<!-- Source EN PDF p.159; unit 1939 -->

【说明】定义 AF 信息统计工作模式。

<!-- Source EN PDF p.159; unit 1940 -->

【定义】

<!-- Source EN PDF p.159; unit 1941 -->

```text
 typedef enum opMode_e {
     OP_AUTO   = 0,
     OP_MANUAL = 1,
     OP_SEMI_AUTO = 2,
     OP_INVAL
 } opMode_t;
```

<!-- Source EN PDF p.159; unit 1942 -->

【成员】

<!-- Source EN PDF p.160; unit 1943 -->

| 成员名称 | 说明 |
|---|---|
| OP_AUTO | 自动对焦，运行内置 AF 算法。 |
| OP_MANUAL | 手动对焦，停止内置 AF 算法。 |
| OP_SEMI_AUTO | 半自动对焦，调用变焦位置 API 时执行一次自动对焦。 |

<!-- Source EN PDF p.160; unit 1944 -->

#### 8.5.2  rk_aiq_af_zoomrange

<!-- Source EN PDF p.160; unit 1945 -->

【说明】定义变焦值范围。

<!-- Source EN PDF p.160; unit 1946 -->

【定义】

<!-- Source EN PDF p.160; unit 1947 -->

```text
 typedef struct {
     int min_pos;
     int max_pos;
     float min_fl;
     float max_fl;
 } rk_aiq_af_zoomrange;
```

<!-- Source EN PDF p.160; unit 1948 -->

【成员】

<!-- Source EN PDF p.160; unit 1949 -->

| 成员名称 | 说明 |
|---|---|
| min_pos | 变焦最小值 |
| max_pos | zoommax |
| min_fl | 最小焦距 |
| max_fl | 最大焦距 |

<!-- Source EN PDF p.160; unit 1950 -->

#### 8.5.3  rk_aiq_af_focusrange

<!-- Source EN PDF p.160; unit 1951 -->

【说明】定义对焦值范围。

<!-- Source EN PDF p.160; unit 1952 -->

【定义】

<!-- Source EN PDF p.160; unit 1953 -->

```text
 typedef struct {
     int min_pos;
     int max_pos;
 } rk_aiq_af_focusrange;
```

<!-- Source EN PDF p.160; unit 1954 -->

【成员】

<!-- Source EN PDF p.160; unit 1955 -->

| 成员名称 | 说明 |
|---|---|
| min_pos | 对焦最小值 |
| max_pos | 对焦最大值 |

<!-- Source EN PDF p.161; unit 1956 -->

#### 8.5.4  rk_aiq_af_result_t

<!-- Source EN PDF p.161; unit 1957 -->

【说明】定义 AF 搜索结果。

<!-- Source EN PDF p.161; unit 1958 -->

【定义】

<!-- Source EN PDF p.161; unit 1959 -->

```text
 typedef enum rk_aiq_af_sec_stat_e
 {
     RK_AIQ_AF_SEARCH_INVAL   = 0,
     RK_AIQ_AF_SEARCH_RUNNING = 1,
     RK_AIQ_AF_SEARCH_END     = 2
 } rk_aiq_af_sec_stat_t;
 typedef struct {
     rk_aiq_af_sec_stat_t stat;
     int32_t final_pos;
 } rk_aiq_af_result_t;
```

<!-- Source EN PDF p.161; unit 1960 -->

【成员】

<!-- Source EN PDF p.161; unit 1961 -->

| 成员名称 | 说明 |
|---|---|
| stat | 对焦状态 |
| final_pos | 最终对焦位置 |

<!-- Source EN PDF p.161; unit 1962 -->

### 8.6 模块级 API 参考

<!-- Source EN PDF p.161; unit 1963 -->

#### 8.6.1  rk_aiq_user_api2_af_SetAttrib

<!-- Source EN PDF p.161; unit 1964 -->

【说明】设置对焦属性。

<!-- Source EN PDF p.161; unit 1965 -->

【语法】

<!-- Source EN PDF p.161; unit 1966 -->

```text
 XCamReturn
 rk_aiq_user_api2_af_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx, rk_aiq_af_attrib_t
 attr);
```

<!-- Source EN PDF p.161; unit 1967 -->

【参数】

<!-- Source EN PDF p.161; unit 1968 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 对焦的参数属性 | 输入 |

<!-- Source EN PDF p.161; unit 1969 -->

【返回值】

<!-- Source EN PDF p.162; unit 1970 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.162; unit 1971 -->

【依赖】

<!-- Source EN PDF p.162; unit 1972 -->

头文件：rk_aiq_user_api2_af.h

<!-- Source EN PDF p.162; unit 1973 -->

库文件：librkaiq.so

<!-- Source EN PDF p.162; unit 1974 -->

#### 8.6.2  rk_aiq_user_api2_af_GetAttrib

<!-- Source EN PDF p.162; unit 1975 -->

【说明】获取对焦属性。

<!-- Source EN PDF p.162; unit 1976 -->

【语法】

<!-- Source EN PDF p.162; unit 1977 -->

```text
 XCamReturn
 rk_aiq_user_api2_af_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx, rk_aiq_af_attrib_t
 *attr);
```

<!-- Source EN PDF p.162; unit 1978 -->

【参数】

<!-- Source EN PDF p.162; unit 1979 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 对焦的参数属性 | 输出 |

<!-- Source EN PDF p.162; unit 1980 -->

【返回值】

<!-- Source EN PDF p.162; unit 1981 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.162; unit 1982 -->

【依赖】

<!-- Source EN PDF p.162; unit 1983 -->

头文件：rk_aiq_user_api2_af.h

<!-- Source EN PDF p.162; unit 1984 -->

库文件：librkaiq.so

<!-- Source EN PDF p.163; unit 1985 -->

### 8.7 模块级 API 数据类型

<!-- Source EN PDF p.163; unit 1986 -->

#### 8.7.1  RKAIQ_AF_MODE

<!-- Source EN PDF p.163; unit 1987 -->

【说明】定义对焦工作模式。

<!-- Source EN PDF p.163; unit 1988 -->

【定义】

<!-- Source EN PDF p.163; unit 1989 -->

```text
 typedef enum _RKAIQ_AF_MODE
 {
     RKAIQ_AF_MODE_NOT_SET = -1,
     RKAIQ_AF_MODE_AUTO,
     RKAIQ_AF_MODE_MACRO,
     RKAIQ_AF_MODE_INFINITY,
     RKAIQ_AF_MODE_FIXED,
     RKAIQ_AF_MODE_EDOF,
     RKAIQ_AF_MODE_CONTINUOUS_VIDEO,
     RKAIQ_AF_MODE_CONTINUOUS_PICTURE,
     RKAIQ_AF_MODE_ONESHOT_AFTER_ZOOM,
 } RKAIQ_AF_MODE;
```

<!-- Source EN PDF p.163; unit 1990 -->

【成员】

<!-- Source EN PDF p.163; unit 1991 -->

| 成员名称 | 说明 |
|---|---|
| RKAIQ_AF_MODE_NOT_SET | 未设置对焦模式 |
| RKAIQ_AF_MODE_AUTO | 自动对焦模式 |
| RKAIQ_AF_MODE_MACRO | 微距对焦模式 |
| RKAIQ_AF_MODE_INFINITY | 远焦模式 |
| RKAIQ_AF_MODE_FIXED | 固定焦点模式 |
| RKAIQ_AF_MODE_EDOF | 景深对焦模式 |
| RKAIQ_AF_MODE_CONTINUOUS_VIDEO | 平滑连续对焦模式 |
| RKAIQ_AF_MODE_CONTINUOUS_PICTURE | 快速连续对焦模式 |
| RKAIQ_AF_MODE_ONESHOT_AFTER_ZOOM | 半自动对焦，调用变焦位置设置时自动触发一次对焦。 |

<!-- Source EN PDF p.163; unit 1992 -->

#### 8.7.2  RKAIQ_AF_HWVER

<!-- Source EN PDF p.163; unit 1993 -->

【说明】定义对焦工作模式。

<!-- Source EN PDF p.163; unit 1994 -->

【定义】

<!-- Source EN PDF p.164; unit 1995 -->

```text
 typedef enum _RKAIQ_AF_HWVER
 {
     RKAIQ_AF_HW_V20 = 0,
     RKAIQ_AF_HW_V30,
     RKAIQ_AF_HW_VMAX
 } RKAIQ_AF_HWVER;
```

<!-- Source EN PDF p.164; unit 1996 -->

【成员】

<!-- Source EN PDF p.164; unit 1997 -->

| 成员名称 | 说明 |
|---|---|
| RKAIQ_AF_HW_V20 | AF 硬件版本 2.0 |
| RKAIQ_AF_HW_V30 | AF 硬件版本 3.0 |

<!-- Source EN PDF p.164; unit 1998 -->

#### 8.7.3  rk_aiq_af_algo_meas_v30_t

<!-- Source EN PDF p.164; unit 1999 -->

【说明】定义 AF 信息统计工作模式。

<!-- Source EN PDF p.164; unit 2000 -->

【定义】

<!-- Source EN PDF p.164; unit 2001 -->

```text
 typedef struct {
     unsigned char af_en;
     unsigned char rawaf_sel;
     unsigned char gamma_en;
     unsigned char gaus_en;
     unsigned char v1_fir_sel;
     unsigned char hiir_en;
     unsigned char viir_en;
     unsigned char v1_fv_outmode;    // 0 square, 1 absolute
     unsigned char v2_fv_outmode;    // 0 square, 1 absolute
     unsigned char h1_fv_outmode;    // 0 square, 1 absolute
     unsigned char h2_fv_outmode;    // 0 square, 1 absolute
     unsigned char ldg_en;
     unsigned char accu_8bit_mode;   //fix to 1
     unsigned char ae_mode;
     unsigned char y_mode;           //fix to 0
     unsigned char line_en[RKAIQ_RAWAF_LINE_NUM];
     unsigned char line_num[RKAIQ_RAWAF_LINE_NUM];
     unsigned char window_num;
     unsigned short wina_h_offs;
     unsigned short wina_v_offs;
     unsigned short wina_h_size;
     unsigned short wina_v_size;
     unsigned short winb_h_offs;
     unsigned short winb_v_offs;
     unsigned short winb_h_size;
     unsigned short winb_v_size;
     unsigned short gamma_y[RKAIQ_RAWAF_GAMMA_NUM];
     // [old version param]
     unsigned short thres;
     unsigned char shift_sum_a;
     unsigned char shift_sum_b;
     unsigned char shift_y_a;
     unsigned char shift_y_b;
```

<!-- Source EN PDF p.165; unit 2002 -->

```text
     /**********[Vertical IIR (v1 & v2)]************/
     short v1_iir_coe[9];
     short v1_fir_coe[3];
     short v2_iir_coe[3];
     short v2_fir_coe[3];
     /**********[Horizontal IIR (h1 & h2)]************/
     short h1_iir1_coe[6];
     short h2_iir1_coe[6];
     short h1_iir2_coe[6];
     short h2_iir2_coe[6];
     /**********[Focus value statistic param]**********/
     // level depended gain
     // input8 lumi, output8bit gain
     unsigned char h_ldg_lumth[2];    //luminance thresh
     unsigned char h_ldg_gain[2];     //gain for [minLum,maxLum]
     unsigned short h_ldg_gslp[2];    //[slope_low,-slope_high]
     unsigned char v_ldg_lumth[2];
     unsigned char v_ldg_gain[2];
     unsigned short v_ldg_gslp[2];
     // coring
     unsigned short v_fv_thresh;
     unsigned short h_fv_thresh;
     // left shift, more needed if outmode=square
     unsigned char v1_fv_shift; //only for sel1
     unsigned char v2_fv_shift;
     unsigned char h1_fv_shift;
     unsigned char h2_fv_shift;
     /**********[High light]**********/
     unsigned short highlit_thresh;
 }  rk_aiq_af_algo_meas_v30_t;
```

<!-- Source EN PDF p.165; unit 2003 -->

【成员】

<!-- Source EN PDF p.166; unit 2004 -->

| 成员名称 | 说明 |
|---|---|
| af_en | AF 统计使能，0 关闭、1 开启。 |
| rawaf_sel | AF 统计通道，范围 0-3，对应 HDR 长/中/短/合成帧。AF 通常选择中帧；非 HDR 设 0，HDR 设 1（通道对应按原文保留）。 |
| Gamma_en | Gamma 使能，0 关闭、1 开启。 |
| gaus_en | 必须固定设为 1。 |
| v1_fir_sel | 必须固定设为 1。 |
| hiir_en | H1/H2 通道使能，0 关闭、1 开启。 |
| viir_en | V1/V2 通道使能，0 关闭、1 开启。启用 gamma_en 时，viir_en 必须为 1。 |
| v1_fv_outmode | V1 通道 FV 输出模式，0 平方，1 绝对值。 |
| v2_fv_outmode | V2 通道 FV 输出：0 平方模式，1 绝对值模式。 |
| ldg_en | LDG 使能，0 关闭、1 开启。 |
| accu_8bit_mode | 必须固定设为 1。 |
| ae_mode | ae_mode=1 时，RAWAF 复用 RAWAE_BIG 逻辑，开启 15x15 亮度平均统计。 |
| y_mode | 必须固定设为 0。 |
| sobel_sel | 必须固定设为 0。 |
| v_dnscl_mode | 宽带/窄带模式，按 AF 滤波系数生成工具的输出设置。 |
| from_awb | AF 统计输入取自 AWB。 |
| from_ynr | AF 统计输入取自 YNR。 |
| ae_config_use | 固定配置为 0。 |
| line_en | 当前不生效。 |
| line_num | 当前不生效。 |
| window_num | 有效窗口数量：window_num=1 时 WinA 主窗口生效；为 2 时 WinA 和 WinB 独立窗口均生效。 |
| wina_h_offs | WinA 左上角首像素水平坐标，必须 &gt;=2。 |
| wina_v_offs | WinA 左上角首像素垂直坐标，必须 &gt;=1。 |

<!-- Source EN PDF p.167; unit 2005 -->

| 成员名称 | 说明 |
|---|---|
| wina_h_size | WinA 宽度必须小于图像宽度 -2-wina_h_offs，并为 15 的倍数。 |
| wina_v_size | WinA 高度必须小于图像高度 -2-wina_v_offs，并为 15 的倍数。 |
| winb_h_offs | WinB 左上角首像素水平坐标，必须 &gt;=2。 |
| winb_v_offs | WinB 左上角首像素垂直坐标，必须 &gt;=1。 |
| winb_h_size | WinB 宽度须小于图像宽度 -2-wina_h_offs（原文引用 WinA 偏移，待核对）。 |
| winb_v_size | WinB 高度须小于图像高度 -2-wina_v_offs（原文引用 WinA 偏移，待核对）。 |
| gamma_y | Gamma 表 y 值范围 0-1023；x 坐标 0 至 1023 的分段为：16 16 16 16 32 32 32 32 64 64 64 128 128 128 128 128。 |
| thres | WinB 的 AF 阈值：FV 小于该值则置 0，抑制噪声；范围 0-0xFFFF。 |
| shift_sum_a | 当前不可用，固定设 0。 |
| shift_y_a | 当前不可用，固定设 0。 |
| v1_iir_coe[9] | V1 通道 3X3 IIR 系数，按 AF 工具输出设置。 |
| v1_fir_coe[3] | V1 通道 1x3 FIR 系数，按 AF 工具输出设置。 |
| v2_iir_coe[3] | V2 通道 1x3 IIR 系数，按 AF 工具输出设置。 |
| v2_fir_coe[3] | V2 通道 1x3 FIR 系数，按 AF 工具输出设置。 |
| h1_iir1_coe[6] | H1 通道 1X6 IIR1 系数，按 AF 工具输出设置。 |
| h2_iir1_coe[6] | H2 通道 1X6 IIR1 系数，按 AF 工具输出设置。 |
| h1_iir2_coe[6] | H1 通道 1X6 IIR2 系数，按 AF 工具输出设置。 |
| h2_iir2_coe[6] | H2 通道 1X6 IIR2 系数，按 AF 工具输出设置。 |

<!-- Source EN PDF p.168; unit 2006 -->

| 成员名称 | 说明 |
|---|---|
| h_ldg_lumth[2] | H1/H2 的 LDG 亮度阈值系数；0 为左侧暗区，1 为右侧亮区，范围 0~255。 |
| h_ldg_gain[2] | H1/H2 的 LDG 最小增益；0 暗区、1 亮区，范围 0~255。 |
| h_ldg_gslp[2] | H1/H2 的 LDG 斜率；0 暗区、1 亮区，范围 0~65535。 |
| v_ldg_lumth[2] | V1/V2 的 LDG 亮度阈值；0 暗区、1 亮区，范围 0~255。 |
| v_ldg_gain[2] | V1/V2 的 LDG 最小增益；0 暗区、1 亮区，范围 0~255。 |
| v_ldg_gslp[2] | V1/V2 的 LDG 最小增益；0 暗区、1 亮区，范围 0~255。 |
| v_fv_thresh | V1/V2 AF 阈值；FV 小于该值则置 0，抑制噪声；范围 0-0x0FFF。 |
| h_fv_thresh | H1/H2 AF 阈值；FV 小于该值则置 0，抑制噪声；范围 0-0x0FFF。 |
| v1_fv_shift | V1 FV 右移位数，防止溢出，范围 0-7；原文误写 shit bit。 |
| v2_fv_shift | V2 FV 右移位数，防止溢出，范围 0-7；原文误写 shit bit。 |
| h1_fv_shift | H1 FV 右移位数，防止溢出，范围 0-7；原文误写 shit bit。 |
| h2_fv_shift | H2 FV 右移位数，防止溢出，范围 0-7；原文误写 shit bit。 |
| highlit_thresh | 高光统计阈值：超过该值的像素计为高光，各区域仅累加高光数量；范围 0-0x0FFF。 |

<!-- Source EN PDF p.169; unit 2007 -->

#### 8.7.4  rk_aiq_af_attrib_t

<!-- Source EN PDF p.169; unit 2008 -->

【说明】对焦配置信息。

<!-- Source EN PDF p.169; unit 2009 -->

【定义】

<!-- Source EN PDF p.169; unit 2010 -->

```text
 typedef struct rk_aiq_af_attrib_s {
     rk_aiq_uapi_sync_t sync;
     RKAIQ_AF_MODE AfMode;
     RKAIQ_AF_HWVER AfHwVer;
     bool contrast_af;
     bool laser_af;
     bool pdaf;
     int h_offs;
     int v_offs;
     unsigned int h_size;
     unsigned int v_size;
     short fixedModeDefCode;
     short macroModeDefCode;
     short infinityModeDefCode;
     union {
         rk_aiq_af_algo_meas_v20_t manual_meascfg;
         rk_aiq_af_algo_meas_v30_t manual_meascfg_v30;
     };
 } rk_aiq_af_attrib_t;
```

<!-- Source EN PDF p.169; unit 2011 -->

【成员】

<!-- Source EN PDF p.170; unit 2012 -->

| 成员名称 | 说明 |
|---|---|
| sync | 同步/异步 API 参见“概述/API 说明”的 rk_aiq_uapi_sync_t 定义。 |
| AfMode | 对焦模式 |
| contrast_af | 使能对比度对焦 |
| laser_af | 使能激光对焦 |
| pdaf | 使能相位对焦 |
| h_offs | 对焦窗口起始水平坐标 |
| v_offs | 对焦窗口起始垂直坐标 |
| h_size | 对焦窗口宽度 |
| v_size | 对焦窗口高度 |
| fixedModeDefCode | 对焦码值 |
| macroModeDefCode | 微距模式停止码值，原文范围写作 0-value。 |
| infinityModeDefCode | 远焦模式起始码值，原文范围写作 -64。 |
| manual_meascfg | AF2.0 自定义对焦统计配置 |
| manual_meascfg_v30 | AF3.0 自定义对焦统计配置 |

<!-- Source EN PDF p.170; unit 2013 -->

### 8.8 补充说明

<!-- Source EN PDF p.170; unit 2014 -->

#### 8.8.1 VCM 马达模组驱动验证

<!-- Source EN PDF p.170; unit 2015 -->

1\. VCM 驱动起始电流与终止电流是否正确。

<!-- Source EN PDF p.170; unit 2016 -->

先向模组厂家获取起始、终止电流资料。

<!-- Source EN PDF p.170; unit 2017 -->

再选择若干模组确认资料，步骤如下：

<!-- Source EN PDF p.170; unit 2018 -->

在 DTS 将起始、终止电流设为 VCM 支持的最大范围。

<!-- Source EN PDF p.170; unit 2019 -->

切换为手动对焦，从位置 64 逐步调节；镜头开始移动且远处物体（超过 10 米）清晰时记录位置。

<!-- Source EN PDF p.170; unit 2020 -->

起始电流为 (vcm_max_mA - vcm_min_mA) \* (64 - curPos) / 64。

<!-- Source EN PDF p.170; unit 2021 -->

继续调节，近处物体（10cm 或 20cm）清晰时记录位置。

<!-- Source EN PDF p.170; unit 2022 -->

终止电流为 (vcm_max_mA - vcm_min_mA) \* (64 - curPos) / 64。

<!-- Source EN PDF p.170; unit 2023 -->

2\. VCM 从不同方向移动后，最终停留位置是否稳定。

<!-- Source EN PDF p.171; unit 2024 -->

手动模式选择一个位置，分别从 0 和 64 移到该位置，比较两图清晰度及 AF 统计是否接近。

<!-- Source EN PDF p.171; unit 2025 -->

3\. 镜头移动所需时间是否正确。

<!-- Source EN PDF p.171; unit 2026 -->

#### 8.8.2 电动马达模组驱动验证

<!-- Source EN PDF p.171; unit 2027 -->

1\. 多次单步与一次多步移动后，最终位置是否相同。

<!-- Source EN PDF p.171; unit 2028 -->

1\. 选择使图像最清晰的 zoom/focus 位置，记录电机位置并抓图 A。

<!-- Source EN PDF p.171; unit 2029 -->

2\. 电机后退若干步，再以单步方式前进至记录位置，抓图 B。

<!-- Source EN PDF p.171; unit 2030 -->

3\. 再后退相同若干步，一次移动回记录位置，抓图 C。

<!-- Source EN PDF p.171; unit 2031 -->

4\. 比较 A、B、C 的清晰度和视场是否一致。

<!-- Source EN PDF p.171; unit 2032 -->

2\. 随机移动后最终位置是否相同。

<!-- Source EN PDF p.171; unit 2033 -->

1\. 选择使图像最清晰的 zoom/focus 位置，记录电机位置并抓图 A。

<!-- Source EN PDF p.171; unit 2034 -->

2\. 通过脚本随机移动 zoom 或 focus 电机 400 至 500 次，回到原位置并抓图 B。

<!-- Source EN PDF p.171; unit 2035 -->

3\. 比较 A、B 的清晰度和视场是否一致。

<!-- Source EN PDF p.171; unit 2036 -->

3\. 电机同时移动后最终位置是否相同。

<!-- Source EN PDF p.171; unit 2037 -->

1\. 选择使图像最清晰的 zoom/focus 位置，记录电机位置并抓图 A。

<!-- Source EN PDF p.171; unit 2038 -->

2\. 通过脚本同时随机移动 zoom 与 focus 电机 400 至 500 次，回原位置抓图 B。

<!-- Source EN PDF p.171; unit 2039 -->

3\. 比较 A、B 的清晰度和视场是否一致。

<!-- Source EN PDF p.171; unit 2040 -->

## 9.   IMGPROC

<!-- Source EN PDF p.171; unit 2041 -->

### 9.1 概述

<!-- Source EN PDF p.171; unit 2042 -->

imgproc 指影响图像效果的模块。

<!-- Source EN PDF p.172; unit 2043 -->

### 9.2   Merge

<!-- Source EN PDF p.172; unit 2044 -->

#### 9.2.1 功能说明

<!-- Source EN PDF p.172; unit 2045 -->

Merge 将多帧图像合成为一帧。

<!-- Source EN PDF p.172; unit 2046 -->

#### 9.2.2 重要概念

<!-- Source EN PDF p.172; unit 2047 -->

仅 HDR 模式生效。

<!-- Source EN PDF p.172; unit 2048 -->

#### 9.2.3 功能级 API 参考

<!-- Source EN PDF p.172; unit 2049 -->

#### 9.2.4 模块级 API 参考

<!-- Source EN PDF p.172; unit 2050 -->

9.2.4.1  rk_aiq_user_api2_amerge_SetAttrib

<!-- Source EN PDF p.172; unit 2051 -->

【说明】设置 merge 属性。

<!-- Source EN PDF p.172; unit 2052 -->

【语法】

<!-- Source EN PDF p.172; unit 2053 -->

```text
 XCamReturn
 rk_aiq_user_api2_amerge_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 amerge_attrib_t attr);
```

<!-- Source EN PDF p.172; unit 2054 -->

【参数】

<!-- Source EN PDF p.172; unit 2055 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | merge 参数属性 | 输入 |

<!-- Source EN PDF p.172; unit 2056 -->

【返回值】

<!-- Source EN PDF p.172; unit 2057 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.172; unit 2058 -->

【依赖】

<!-- Source EN PDF p.172; unit 2059 -->

头文件：rk_aiq_user_api2_amerge.h

<!-- Source EN PDF p.172; unit 2060 -->

库文件：librkaiq.so

<!-- Source EN PDF p.173; unit 2061 -->

9.2.4.2  rk_aiq_user_api2_amerge_GetAttrib

<!-- Source EN PDF p.173; unit 2062 -->

【说明】获取 merge 属性。

<!-- Source EN PDF p.173; unit 2063 -->

【语法】

<!-- Source EN PDF p.173; unit 2064 -->

```text
 XCamReturn
 rk_aiq_user_api2_amerge_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 amerge_attrib_t* attr);
```

<!-- Source EN PDF p.173; unit 2065 -->

【参数】

<!-- Source EN PDF p.173; unit 2066 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | merge 参数属性 | 输出 |

<!-- Source EN PDF p.173; unit 2067 -->

【返回值】

<!-- Source EN PDF p.173; unit 2068 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.173; unit 2069 -->

【依赖】

<!-- Source EN PDF p.173; unit 2070 -->

头文件：rk_aiq_user_api2_amerge.h

<!-- Source EN PDF p.173; unit 2071 -->

库文件：librkaiq.so

<!-- Source EN PDF p.173; unit 2072 -->

#### 9.2.5 模块级 API 数据类型

<!-- Source EN PDF p.173; unit 2073 -->

9.2.5.1  merge_OpMode_t

<!-- Source EN PDF p.173; unit 2074 -->

【说明】定义 merge 工作模式。

<!-- Source EN PDF p.173; unit 2075 -->

【定义】

<!-- Source EN PDF p.173; unit 2076 -->

```text
 typedef enum merge_OpModeV21_e {
     MERGE_OPMODE_API_OFF = 0,
     MERGE_OPMODE_MANU    = 1,
 } merge_OpModeV21_t;
```

<!-- Source EN PDF p.173; unit 2077 -->

【成员】

<!-- Source EN PDF p.174; unit 2078 -->

| 成员名称 | 说明 |
|---|---|
| MERGE_OPMODE_API_OFF | API 关闭模式，算法处于 AUTO 并使用参数（原句未完）。 |
| MERGE_OPMODE_MANU | 手动模式 |

<!-- Source EN PDF p.174; unit 2079 -->

9.2.5.2  MergeBaseFrame_t

<!-- Source EN PDF p.174; unit 2080 -->

【说明】定义融合基准帧属性。

<!-- Source EN PDF p.174; unit 2081 -->

【定义】

<!-- Source EN PDF p.174; unit 2082 -->

```text
 typedef enum MergeBaseFrame_e {
     BASEFRAME_LONG  = 0,
     BASEFRAME_SHORT = 1,
 } MergeBaseFrame_t;
```

<!-- Source EN PDF p.174; unit 2083 -->

【成员】

<!-- Source EN PDF p.174; unit 2084 -->

| 成员名称 | 说明 |
|---|---|
| BASEFRAME_LONG | 融合以长帧为基准。 |
| BASEFRAME_SHORT | 融合以短帧为基准。 |

<!-- Source EN PDF p.174; unit 2085 -->

9.2.5.3  MergeCurrCtlData_t

<!-- Source EN PDF p.174; unit 2086 -->

【说明】定义 Merge 控制参数属性。

<!-- Source EN PDF p.174; unit 2087 -->

【定义】

<!-- Source EN PDF p.174; unit 2088 -->

```text
 typedef struct MergeCurrCtlData_s {
     float Envlv;
     float MoveCoef;
 } MergeCurrCtlData_t;
```

<!-- Source EN PDF p.174; unit 2089 -->

【成员】

<!-- Source EN PDF p.174; unit 2090 -->

| 成员名称 | 说明 |
|---|---|
| Envlv | 当前环境亮度，原文写作范围 0,1、精度 0.000001。 |
| MoveCoef | 当前运动系数，范围 [0,1]，精度 0.000001，目前固定值。 |

<!-- Source EN PDF p.175; unit 2091 -->

9.2.5.4  mMergeOECurveV21_t

<!-- Source EN PDF p.175; unit 2092 -->

【说明】定义手动 Merge 过曝曲线属性。

<!-- Source EN PDF p.175; unit 2093 -->

【定义】

<!-- Source EN PDF p.175; unit 2094 -->

```text
 typedef struct mMergeOECurveV21_s {
     float Smooth;
     float Offset;
 } mMergeOECurveV21_t;
```

<!-- Source EN PDF p.175; unit 2095 -->

【成员】

<!-- Source EN PDF p.175; unit 2096 -->

| 成员名称 | 说明 |
|---|---|
| Smooth | 过曝曲线斜率，范围 [0,1]，默认 0.4，精度 0.01。 |
| Offset | 过曝曲线偏移，范围 [108,280]，默认 210，精度 0.1。 |

<!-- Source EN PDF p.175; unit 2097 -->

9.2.5.5  mMergeMDCurveV21_t

<!-- Source EN PDF p.175; unit 2098 -->

【说明】定义长帧模式运动曲线属性。

<!-- Source EN PDF p.175; unit 2099 -->

【定义】

<!-- Source EN PDF p.175; unit 2100 -->

```text
 typedef struct mMergeMDCurveV21_s {
     float LM_smooth;
     float LM_offset;
     float MS_smooth;
     float MS_offset;
 } mMergeMDCurveV21_t;
```

<!-- Source EN PDF p.175; unit 2101 -->

【成员】

<!-- Source EN PDF p.176; unit 2102 -->

| 成员名 | 说明 |
|---|---|
| LM_smooth | 长、中帧运动曲线斜率，范围 [0,1]，默认 0.4，精度 0.01；RK356x 无效。 |
| LM_offset | 长、中帧运动曲线偏移，范围 [0.26,1]，默认 0.38，精度 0.01；RK356x 无效。 |
| MS_smooth | 中、短帧运动曲线斜率，范围 [0,1]，默认 0.4，精度 0.01。 |
| MS_offset | 中、短帧运动曲线偏移，范围 [0.26,1]，默认 0.38，精度 0.01。 |

<!-- Source EN PDF p.176; unit 2103 -->

9.2.5.6  mMergeAttrV21_t

<!-- Source EN PDF p.176; unit 2104 -->

【说明】定义 RK3588 手动 merge 属性。

<!-- Source EN PDF p.176; unit 2105 -->

【定义】

<!-- Source EN PDF p.176; unit 2106 -->

```text
 typedef struct mMergeAttrV21_s {
     mMergeOECurveV21_t OECurve;
     mMergeMDCurveV21_t MDCurve;
 } mMergeAttrV21_t;
```

<!-- Source EN PDF p.176; unit 2107 -->

【成员】

<!-- Source EN PDF p.176; unit 2108 -->

| 成员名称 | 说明 |
|---|---|
| OECurve | 过曝曲线参数 |
| MDCurve | 运动曲线参数 |

<!-- Source EN PDF p.176; unit 2109 -->

9.2.5.7  mergeAttrV21_t

<!-- Source EN PDF p.176; unit 2110 -->

【说明】配置 RK356x 的 merge 属性。

<!-- Source EN PDF p.176; unit 2111 -->

【定义】

<!-- Source EN PDF p.176; unit 2112 -->

```text
 typedef struct mergeAttrV21_s {
     merge_OpModeV21_t    opMode;
     mMergeAttrV21_t      stManual;
     MergeCurrCtlData_t   CtlInfo;
 } mergeAttrV21_t;
```

<!-- Source EN PDF p.176; unit 2113 -->

【成员】

<!-- Source EN PDF p.177; unit 2114 -->

| 成员名称 | 说明 |
|---|---|
| opMode | 模式选择 |
| stManual | 手动 merge 属性 |
| CtlInfo | 控制量参数 |

<!-- Source EN PDF p.177; unit 2115 -->

9.2.5.8  mLongFrameModeData_t

<!-- Source EN PDF p.177; unit 2116 -->

【说明】定义长帧模式控制参数属性。

<!-- Source EN PDF p.177; unit 2117 -->

【定义】

<!-- Source EN PDF p.177; unit 2118 -->

```text
 typedef struct mLongFrameModeData_s {
     mMergeOECurveV21_t OECurve;
     mMergeMDCurveV21_t MDCurve;
 } mLongFrameModeData_t;
```

<!-- Source EN PDF p.177; unit 2119 -->

【成员】

<!-- Source EN PDF p.177; unit 2120 -->

| 成员名 | 说明 |
|---|---|
| OECurve | 过曝曲线参数 |
| MDCurve | 运动曲线参数 |

<!-- Source EN PDF p.177; unit 2121 -->

9.2.5.9  mMergeMDCurveV30Short_t

<!-- Source EN PDF p.177; unit 2122 -->

【说明】定义短帧模式运动曲线属性。

<!-- Source EN PDF p.177; unit 2123 -->

【定义】

<!-- Source EN PDF p.177; unit 2124 -->

```text
 typedef struct mMergeMDCurveV30Short_s{
     float Coef;
     float ms_thd0;
     float lm_thd0;
 } mMergeMDCurveV30Short_t;
```

<!-- Source EN PDF p.177; unit 2125 -->

【成员】

<!-- Source EN PDF p.178; unit 2126 -->

| 成员名 | 说明 |
|---|---|
| Coef | 控制系数，范围 [0,1]，默认 0.05，精度 0.0001。 |
| ms_thd0 | 中、短帧控制系数，范围 [0,1]，默认 0.0，精度 0.1。 |
| lm_thd0 | 长、中帧控制系数，范围 [0,1]，默认 0.0，精度 0.1。 |

<!-- Source EN PDF p.178; unit 2127 -->

9.2.5.10  mShortFrameModeData_t

<!-- Source EN PDF p.178; unit 2128 -->

【说明】定义短帧模式控制参数属性。

<!-- Source EN PDF p.178; unit 2129 -->

【定义】

<!-- Source EN PDF p.178; unit 2130 -->

```text
 typedef struct mShortFrameModeData_s {
     mMergeOECurveV21_t      OECurve;
     mMergeMDCurveV30Short_t MDCurve;
 } mShortFrameModeData_t;
```

<!-- Source EN PDF p.178; unit 2131 -->

【成员】

<!-- Source EN PDF p.178; unit 2132 -->

| 成员名 | 说明 |
|---|---|
| OECurve | 过曝曲线参数 |
| MDCurve | 运动曲线参数 |

<!-- Source EN PDF p.178; unit 2133 -->

9.2.5.11  mMergeAttrV30_t

<!-- Source EN PDF p.178; unit 2134 -->

【说明】定义 RK3588 手动 merge 属性。

<!-- Source EN PDF p.178; unit 2135 -->

【定义】

<!-- Source EN PDF p.178; unit 2136 -->

```text
 typedef struct mMergeAttrV30_s {
     MergeBaseFrame_t      BaseFrm;
     mLongFrameModeData_t  LongFrmModeData;
     mShortFrameModeData_t ShortFrmModeData;
 } mMergeAttrV30_t;
```

<!-- Source EN PDF p.178; unit 2137 -->

【成员】

<!-- Source EN PDF p.178; unit 2138 -->

| 成员名称 | 说明 |
|---|---|
| BaseFrm | 融合基准帧 |
| LongFrmModeData | 基准为长帧时的控制数据（原文重复 data）。 |

<!-- Source EN PDF p.179; unit 2139 -->

9.2.5.12  MergeOECurveV10_t

<!-- Source EN PDF p.179; unit 2140 -->

【说明】定义自动 Merge 过曝曲线属性。

<!-- Source EN PDF p.179; unit 2141 -->

【定义】

<!-- Source EN PDF p.179; unit 2142 -->

```text
 typedef struct MergeOECurveV10_s {
     float EnvLv[MERGE_ENVLV_STEP_MAX];
     float Smooth[MERGE_ENVLV_STEP_MAX];
     float Offset[MERGE_ENVLV_STEP_MAX];
 } MergeOECurveV10_t;
```

<!-- Source EN PDF p.179; unit 2143 -->

【成员】

<!-- Source EN PDF p.179; unit 2144 -->

| 成员名 | 说明 |
|---|---|
| EnvLv | 环境亮度，范围 [0,1]：0 全黑、1 最亮。 |
| Smooth | 过曝曲线斜率，范围 [0,1]，默认 0.4，精度 0.01。 |
| Offset | 过曝曲线偏移，范围 [108,280]，默认 210，精度 0.1。 |

<!-- Source EN PDF p.179; unit 2145 -->

9.2.5.13  MergeMDCurveV10_t

<!-- Source EN PDF p.179; unit 2146 -->

【说明】定义长帧模式运动曲线属性。

<!-- Source EN PDF p.179; unit 2147 -->

【定义】

<!-- Source EN PDF p.179; unit 2148 -->

```text
 typedef struct MergeMDCurveV10_s {
     float MoveCoef[MERGE_ENVLV_STEP_MAX];
     float LM_smooth[MERGE_ENVLV_STEP_MAX];
     float LM_offset[MERGE_ENVLV_STEP_MAX];
     float MS_smooth[MERGE_ENVLV_STEP_MAX];
     float MS_offset[MERGE_ENVLV_STEP_MAX];
 } MergeMDCurveV10_t;
```

<!-- Source EN PDF p.179; unit 2149 -->

【成员】

<!-- Source EN PDF p.180; unit 2150 -->

| 成员名 | 说明 |
|---|---|
| MoveCoef | 画面运动程度，范围 [0,1]：0 完全静止，1 完全运动。 |
| LM_smooth | 长、中帧运动曲线斜率，范围 [0,1]，默认 0.4，HDR x2 不生效。 |
| LM_offset | 长、中帧运动曲线偏移，范围 [0.26,1]，默认 0.38，HDR x2 不生效。 |
| MS_smooth | 中、短帧运动曲线斜率，范围 [0,1]，默认 0.4。 |
| MS_offset | 中、短帧运动曲线偏移，范围 [0.26,1]，默认 0.38。 |

<!-- Source EN PDF p.180; unit 2151 -->

9.2.5.14  MergeEachChnCurveV12_t

<!-- Source EN PDF p.180; unit 2152 -->

【说明】定义长帧模式子通道检测曲线属性。

<!-- Source EN PDF p.180; unit 2153 -->

【定义】

<!-- Source EN PDF p.180; unit 2154 -->

```text
 typedef struct MergeEachChnCurveV12_s {
     float EnvLv[MERGE_ENVLV_STEP_MAX];
     float Smooth[MERGE_ENVLV_STEP_MAX];
     float Offset[MERGE_ENVLV_STEP_MAX];
 } MergeEachChnCurveV12_t;
```

<!-- Source EN PDF p.180; unit 2155 -->

【成员】

<!-- Source EN PDF p.180; unit 2156 -->

| 成员名称 | 说明 |
|---|---|
| EnvLv | 环境亮度，范围 [0,1]：0 全黑、1 最亮。 |
| Smooth | 子通道过曝曲线斜率，范围 [0,1]，默认 0.4，精度 0.01。 |
| Offset | 子通道过曝曲线偏移，范围 [0,1]，默认 0.38，精度 0.01。 |

<!-- Source EN PDF p.180; unit 2157 -->

9.2.5.15  LongFrameModeDataV12_t

<!-- Source EN PDF p.180; unit 2158 -->

【说明】定义长帧模式控制参数属性。

<!-- Source EN PDF p.180; unit 2159 -->

【定义】

<!-- Source EN PDF p.181; unit 2160 -->

```text
 typedef struct LongFrameModeDataV12_s {
     bool                   EnableEachChn;
     MergeOECurveV10_t      OECurve;
     MergeMDCurveV10_t      MDCurve;
     MergeEachChnCurveV12_t EachChnCurve;
     float                  OECurve_damp;
     float                  MDCurveLM_damp;
     float                  MDCurveMS_damp;
 } LongFrameModeDataV12_t;
```

<!-- Source EN PDF p.181; unit 2161 -->

【成员】

<!-- Source EN PDF p.181; unit 2162 -->

| 成员名 | 说明 |
|---|---|
| EnableEachChn | 分通道检测开关 |
| OECurve | 过曝曲线参数 |
| MDCurve | 运动曲线参数 |
| EachChnCurve | 分通道检测曲线参数 |
| MDCurveLM_damp | 长、中帧运动曲线变化平滑系数，即当前帧参数占比，范围 [0,1]，默认 0.9；HDR x2 无效。 |
| MDCurveMS_damp | 中、短帧运动曲线变化平滑系数，即当前帧参数占比，范围 [0,1]，默认 0.9。 |

<!-- Source EN PDF p.181; unit 2163 -->

9.2.5.16  MergeMDCurveV11Short_t

<!-- Source EN PDF p.181; unit 2164 -->

【说明】定义短帧模式运动曲线属性。

<!-- Source EN PDF p.181; unit 2165 -->

【定义】

<!-- Source EN PDF p.181; unit 2166 -->

```text
 typedef struct MergeMDCurveV11Short_s{
     float Coef;
     float ms_thd0;
     float lm_thd0;
 } MergeMDCurveV11Short_t;
```

<!-- Source EN PDF p.181; unit 2167 -->

【成员】

<!-- Source EN PDF p.182; unit 2168 -->

| 成员名 | 说明 |
|---|---|
| Coef | 控制系数，范围 [0,1]，默认 0.05，精度 0.0001。 |
| ms_thd0 | 中、短帧控制系数，范围 [0,1]，默认 0.0，精度 0.1。 |
| lm_thd0 | 长、中帧控制系数，范围 [0,1]，默认 0.0，精度 0.1。 |

<!-- Source EN PDF p.182; unit 2169 -->

9.2.5.17  ShortFrameModeData_t

<!-- Source EN PDF p.182; unit 2170 -->

【说明】定义短帧模式控制参数属性。

<!-- Source EN PDF p.182; unit 2171 -->

【定义】

<!-- Source EN PDF p.182; unit 2172 -->

```text
 typedef struct ShortFrameModeData_s {
     MergeOECurveV10_t      OECurve;
     MergeMDCurveV11Short_t MDCurve;
     float                  OECurve_damp;
     float                  MDCurve_damp;
 } ShortFrameModeData_t;
```

<!-- Source EN PDF p.182; unit 2173 -->

【成员】

<!-- Source EN PDF p.182; unit 2174 -->

| 成员名 | 说明 |
|---|---|
| OECurve | 过曝曲线参数 |
| MDCurve | 运动曲线参数 |
| OECurve_damp | 过曝曲线变化平滑系数，即当前帧参数占比，范围 [0,1]，默认 0.9。 |
| MDCurve_damp | 运动曲线变化平滑系数，即当前帧参数占比，范围 [0,1]，默认 0.9。 |

<!-- Source EN PDF p.182; unit 2175 -->

9.2.5.18  CalibDbV2_merge_V12_t

<!-- Source EN PDF p.182; unit 2176 -->

【说明】定义自动 merge 属性。

<!-- Source EN PDF p.182; unit 2177 -->

【定义】

<!-- Source EN PDF p.183; unit 2178 -->

```text
 typedef struct CalibDbV2_merge_V12_s {
     MergeBaseFrame_t       BaseFrm;
     float                  ByPassThr;
     LongFrameModeDataV12_t LongFrmModeData;
     ShortFrameModeData_t   ShortFrmModeData;
 } CalibDbV2_merge_V12_t;
```

<!-- Source EN PDF p.183; unit 2179 -->

【成员】

<!-- Source EN PDF p.183; unit 2180 -->

| 成员名称 | 说明 |
|---|---|
| BaseFrm | 融合基准帧 |
| ByPassThr | 当前模块旁路阈值，范围 [0,1]。当前与前帧环境亮度的百分比差小于 ByPassThr 时，不更新模块参数。 |
| LongFrmModeData | 基准为长帧时的控制数据（原文重复 data）。 |

<!-- Source EN PDF p.183; unit 2181 -->

9.2.5.19  MergeCurrCtlData_t

<!-- Source EN PDF p.183; unit 2182 -->

【说明】RK3588 的 merge 属性配置。

<!-- Source EN PDF p.183; unit 2183 -->

【定义】

<!-- Source EN PDF p.183; unit 2184 -->

```text
 typedef struct mergeAttrV30_s {
     merge_OpModeV21_t    opMode;
     mMergeAttrV30_t      stManual;
     MergeCurrCtlData_t   CtlInfo;
 } mergeAttrV30_t;
```

<!-- Source EN PDF p.183; unit 2185 -->

【成员】

<!-- Source EN PDF p.183; unit 2186 -->

| 成员名称 | 说明 |
|---|---|
| opMode | 模式选择 |
| stManual | 手动 merge 属性 |
| CtlInfo | 控制量参数 |

<!-- Source EN PDF p.183; unit 2187 -->

9.2.5.20  mergeAttr_t

<!-- Source EN PDF p.183; unit 2188 -->

【说明】配置 merge 属性。

<!-- Source EN PDF p.183; unit 2189 -->

【定义】

<!-- Source EN PDF p.184; unit 2190 -->

```text
 typedef struct mergeAttr_s {
     rk_aiq_uapi_sync_t  sync;
     mergeAttrV21_t      attrV21;
     mergeAttrV30_t      attrV30;
 } mergeAttr_t;
```

<!-- Source EN PDF p.184; unit 2191 -->

【成员】

<!-- Source EN PDF p.184; unit 2192 -->

| 成员名称 | 说明 |
|---|---|
| sync | rk_aiq_uapi_sync_t 的定义参见“概述/API 说明”。 |
| attrV21 | RK356x merge 属性在 RK3588 上无效。 |
| attrV30 | RK3588 merge 属性在 RK356x 上无效。 |

<!-- Source EN PDF p.184; unit 2193 -->

### 9.3   DRC

<!-- Source EN PDF p.184; unit 2194 -->

#### 9.3.1 功能说明

<!-- Source EN PDF p.184; unit 2195 -->

DRC（高动态范围压缩）将高位宽图像压缩为低位宽图像。

<!-- Source EN PDF p.184; unit 2196 -->

#### 9.3.2 重要概念

<!-- Source EN PDF p.184; unit 2197 -->

DRC 可用于线性或 HDR 模式。

<!-- Source EN PDF p.184; unit 2198 -->

#### 9.3.3 功能级 API 参考

<!-- Source EN PDF p.184; unit 2199 -->

9.3.3.1  rk_aiq_uapi2_setDrcGain

<!-- Source EN PDF p.184; unit 2200 -->

【说明】

<!-- Source EN PDF p.184; unit 2201 -->

快速设置 DrcGain 曲线参数。

<!-- Source EN PDF p.184; unit 2202 -->

【语法】

<!-- Source EN PDF p.184; unit 2203 -->

```text
 XCamReturn rk_aiq_uapi2_setDrcGain(const rk_aiq_sys_ctx_t* ctx, float Gain, float
 Alpha, float Clip);
```

此时 API 模式为 DRC_OPMODE_DRC_GAIN。调用后参数存入 stDrcGain，DrcGain 曲线的三个参数由 stDrcGain 决定，其余 DRC 参数仍由 JSON 中 DRC 模块参数决定。

<!-- Source EN PDF p.184; unit 2204 -->

【参数】

<!-- Source EN PDF p.185; unit 2205 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| Gain | Gain 范围：[1,8]。 | 输入 |
| alpha | Alpha 范围：[0,1]。 | 输入 |
| Clip | Clip 范围：[0,64]。 | 输入 |

<!-- Source EN PDF p.185; unit 2206 -->

【返回值】

<!-- Source EN PDF p.185; unit 2207 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.185; unit 2208 -->

【依赖】

<!-- Source EN PDF p.185; unit 2209 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.185; unit 2210 -->

库文件：librkaiq.so

<!-- Source EN PDF p.185; unit 2211 -->

9.3.3.2  rk_aiq_uapi2_getDrcGain

<!-- Source EN PDF p.185; unit 2212 -->

【说明】

<!-- Source EN PDF p.185; unit 2213 -->

获取快速 DrcGain 曲线参数。

<!-- Source EN PDF p.185; unit 2214 -->

API 返回 stDrcGain 中参数；仅 API 模式为 DRC_OPMODE_DRC_GAIN 时，它们才是当前实际使用的参数。

<!-- Source EN PDF p.185; unit 2215 -->

【语法】

<!-- Source EN PDF p.185; unit 2216 -->

```text
 XCamReturn rk_aiq_uapi2_getDrcGain(const rk_aiq_sys_ctx_t* ctx, float Gain, float
 Alpha, float Clip);
```

<!-- Source EN PDF p.185; unit 2217 -->

【参数】

<!-- Source EN PDF p.186; unit 2218 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| Gain | Gain 范围：[1,8]。 | 输出 |
| alpha | Alpha 范围：[0,1]。 | 输出 |
| Clip | Clip 范围：[0,64]。 | 输出 |

<!-- Source EN PDF p.186; unit 2219 -->

【返回值】

<!-- Source EN PDF p.186; unit 2220 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.186; unit 2221 -->

【依赖】

<!-- Source EN PDF p.186; unit 2222 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.186; unit 2223 -->

库文件：librkaiq.so

<!-- Source EN PDF p.186; unit 2224 -->

9.3.3.3  rk_aiq_uapi2_setDrcHiLit

<!-- Source EN PDF p.186; unit 2225 -->

【说明】

<!-- Source EN PDF p.186; unit 2226 -->

快速设置 DrcHiLit 参数。

<!-- Source EN PDF p.186; unit 2227 -->

此时 API 模式为 DRC_OPMODE_HILIT，调用后参数存入 stHiLit，HiLight 由其决定，DRC 其余参数仍使用 JSON 文件。

<!-- Source EN PDF p.186; unit 2228 -->

【语法】

<!-- Source EN PDF p.186; unit 2229 -->

```text
 XCamReturn rk_aiq_uapi2_setDrcHiLit(const rk_aiq_sys_ctx_t* ctx, float Strength);
```

<!-- Source EN PDF p.186; unit 2230 -->

【参数】

<!-- Source EN PDF p.186; unit 2231 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| Strength | Intensity 范围：[0,1]。 | 输入 |

<!-- Source EN PDF p.186; unit 2232 -->

【返回值】

<!-- Source EN PDF p.187; unit 2233 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.187; unit 2234 -->

【依赖】

<!-- Source EN PDF p.187; unit 2235 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.187; unit 2236 -->

库文件：librkaiq.so

<!-- Source EN PDF p.187; unit 2237 -->

9.3.3.4  rk_aiq_uapi2_getDrcHiLit

<!-- Source EN PDF p.187; unit 2238 -->

【说明】

<!-- Source EN PDF p.187; unit 2239 -->

获取快速 DrcHiLit 相关参数。

<!-- Source EN PDF p.187; unit 2240 -->

API 获取 stHiLit 中参数，仅 DRC_OPMODE_HILIT 时为当前实际使用参数。

<!-- Source EN PDF p.187; unit 2241 -->

【语法】

<!-- Source EN PDF p.187; unit 2242 -->

```text
 XCamReturn rk_aiq_uapi2_getDrcHiLit(const rk_aiq_sys_ctx_t* ctx, float Strength);
```

<!-- Source EN PDF p.187; unit 2243 -->

【参数】

<!-- Source EN PDF p.187; unit 2244 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| Strength | Intensity 范围：[0,1]。 | 输出 |

<!-- Source EN PDF p.187; unit 2245 -->

【返回值】

<!-- Source EN PDF p.187; unit 2246 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.187; unit 2247 -->

【依赖】

<!-- Source EN PDF p.187; unit 2248 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.187; unit 2249 -->

库文件：librkaiq.so

<!-- Source EN PDF p.187; unit 2250 -->

9.3.3.5  rk_aiq_uapi2_setDrcLocalData

<!-- Source EN PDF p.187; unit 2251 -->

【说明】

<!-- Source EN PDF p.187; unit 2252 -->

快速设置 DrcLocalData 参数。

<!-- Source EN PDF p.188; unit 2253 -->

API 模式为 DRC_OPMODE_LOCAL_TMO 时，参数存入 stLocalDataV30，LocalData 由其决定，其余 DRC 参数仍取自 JSON。

<!-- Source EN PDF p.188; unit 2254 -->

【语法】

<!-- Source EN PDF p.188; unit 2255 -->

```text
 XCamReturn rk_aiq_uapi2_setDrcLocalData(const rk_aiq_sys_ctx_t* ctx, float
 LocalWeit, float GlobalContrast, float LoLitContrast，int LocalAutoEnable, float
 LocalAutoWeit);
```

<!-- Source EN PDF p.188; unit 2256 -->

【参数】

<!-- Source EN PDF p.188; unit 2257 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| LocalWeit | LocalWeit 范围：[0,1]。 | 输入 |
| GlobalContrast | GlobalContrast 范围：[0,1]。 | 输入 |
| LoLitContrast | LoLitContrast 范围：[0,1]。 | 输入 |
| LocalAutoEnable | 自动 Local 开关，范围：[0,1]。 | 输入 |
| LocalAutoWeit | 自动 LocalWeit 范围：[0,1]。 | 输入 |

<!-- Source EN PDF p.188; unit 2258 -->

【返回值】

<!-- Source EN PDF p.188; unit 2259 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.188; unit 2260 -->

【依赖】

<!-- Source EN PDF p.188; unit 2261 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.188; unit 2262 -->

库文件：librkaiq.so

<!-- Source EN PDF p.188; unit 2263 -->

9.3.3.6  rk_aiq_uapi2_getDrcLocalData

<!-- Source EN PDF p.188; unit 2264 -->

【说明】

<!-- Source EN PDF p.188; unit 2265 -->

获取 DrcLocalData 参数。

<!-- Source EN PDF p.188; unit 2266 -->

API 获取 stLocalDataV30 中 LocalData 参数，仅 DRC_OPMODE_LOCAL_TMO 时使用。

<!-- Source EN PDF p.189; unit 2267 -->

【语法】

<!-- Source EN PDF p.189; unit 2268 -->

```text
 XCamReturn rk_aiq_uapi2_getDrcLocalData(const rk_aiq_sys_ctx_t* ctx, float*
 LocalWeit, float* GlobalContrast, float* LoLitContrast，int* LocalAutoEnable,
 float* LocalAutoWeit);
```

<!-- Source EN PDF p.189; unit 2269 -->

【参数】

<!-- Source EN PDF p.189; unit 2270 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| LocalWeit | LocalWeit 范围：[0,1]。 | 输出 |
| GlobalContrast | GlobalContrast 范围：[0,1]。 | 输出 |
| LoLitContrast | LoLitContrast 范围：[0,1]。 | 输出 |
| ocalAutoEnable | 自动 Local 开关，范围：[0,1]。 | 输出 |
| LocalAutoWeit | 自动 LocalWeit 范围：[0,1]。 | 输出 |

<!-- Source EN PDF p.189; unit 2271 -->

【返回值】

<!-- Source EN PDF p.189; unit 2272 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.189; unit 2273 -->

【依赖】

<!-- Source EN PDF p.189; unit 2274 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.189; unit 2275 -->

库文件：librkaiq.so

<!-- Source EN PDF p.189; unit 2276 -->

#### 9.3.4 模块级 API 参考

<!-- Source EN PDF p.189; unit 2277 -->

9.3.4.1  rk_aiq_user_api2_adrc_SetAttrib

<!-- Source EN PDF p.189; unit 2278 -->

【说明】设置 DRC 软件属性。

<!-- Source EN PDF p.189; unit 2279 -->

【语法】

<!-- Source EN PDF p.189; unit 2280 -->

```text
 XCamReturn
 rk_aiq_user_api2_adrc_SetAttrib(RkAiqAlgoContext* ctx,
                            drc_attrib_t attr);
```

<!-- Source EN PDF p.190; unit 2281 -->

【参数】

<!-- Source EN PDF p.190; unit 2282 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| attr | DRC 软件属性结构体 | 输入 |

<!-- Source EN PDF p.190; unit 2283 -->

【返回值】

<!-- Source EN PDF p.190; unit 2284 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.190; unit 2285 -->

【依赖】

<!-- Source EN PDF p.190; unit 2286 -->

头文件：rk_aiq_user_api2_adrc.h

<!-- Source EN PDF p.190; unit 2287 -->

库文件：librkaiq.so

<!-- Source EN PDF p.190; unit 2288 -->

【说明】

<!-- Source EN PDF p.190; unit 2289 -->

9.3.4.2  rk_aiq_user_api2_adrc_GetAttrib

<!-- Source EN PDF p.190; unit 2290 -->

【说明】获取 DRC 软件属性。

<!-- Source EN PDF p.190; unit 2291 -->

【语法】

<!-- Source EN PDF p.190; unit 2292 -->

```text
 XCamReturn
 rk_aiq_user_api2_adrc_GetAttrib(RkAiqAlgoContext* ctx,
                            drc_attrib_t* attr);
```

<!-- Source EN PDF p.190; unit 2293 -->

【参数】

<!-- Source EN PDF p.190; unit 2294 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| attr | DRC 软件属性结构体 | 输出 |

<!-- Source EN PDF p.190; unit 2295 -->

【返回值】

<!-- Source EN PDF p.190; unit 2296 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.190; unit 2297 -->

【依赖】

<!-- Source EN PDF p.190; unit 2298 -->

头文件：rk_aiq_user_api2_adrc.h

<!-- Source EN PDF p.191; unit 2299 -->

库文件：librkaiq.so

<!-- Source EN PDF p.191; unit 2300 -->

【说明】

<!-- Source EN PDF p.191; unit 2301 -->

#### 9.3.5 模块级 API 数据类型

<!-- Source EN PDF p.191; unit 2302 -->

9.3.5.1  AdrcVersion_t

<!-- Source EN PDF p.191; unit 2303 -->

【说明】定义 DRC 版本属性。

<!-- Source EN PDF p.191; unit 2304 -->

【定义】

<!-- Source EN PDF p.191; unit 2305 -->

```text
 typedef enum AdrcVersion_e {
     ADRC_VERSION_356X = 0,
     ADRC_VERSION_3588 = 1,
     ADRC_VERSION_MAX
 } AdrcVersion_t;
```

<!-- Source EN PDF p.191; unit 2306 -->

【成员】

<!-- Source EN PDF p.191; unit 2307 -->

| 成员名称 | 说明 |
|---|---|
| ADRC_VERSION_356X | RK356x |
| ADRC_VERSION_3588 | RK3588 |
| ADRC_VERSION_MAX | 最大版本模式 |

<!-- Source EN PDF p.191; unit 2308 -->

9.3.5.2  drc_OpMode_t

<!-- Source EN PDF p.191; unit 2309 -->

【说明】定义 DRC 工作模式。

<!-- Source EN PDF p.191; unit 2310 -->

【定义】

<!-- Source EN PDF p.191; unit 2311 -->

```text
 typedef enum drc_OpMode_e {
     DRC_OPMODE_API_OFF   = 0,
     DRC_OPMODE_MANU      = 1,
     DRC_OPMODE_DRC_GAIN  = 2,
     DRC_OPMODE_HILIT     = 3,
     DRC_OPMODE_LOCAL_TMO = 4,
 } drc_OpMode_t;
```

<!-- Source EN PDF p.191; unit 2312 -->

【成员】

<!-- Source EN PDF p.192; unit 2313 -->

| 成员名称 | 说明 |
|---|---|
| DRC_OPMODE_API_OFF | 自动模式，Drc 全部参数由 JSON 决定。 |
| DRC_OPMODE_MANU | 手动模式，Drc 全部参数由 stManualV30 决定。 |
| DRC_OPMODE_DRC_GAIN | DrcGain 模式，相关参数由 stDrcGain 决定，其余取自 JSON。 |
| DRC_OPMODE_HILIT | HiLit 模式，HiLight 相关参数由 stHiLit 决定，其余取自 JSON。 |
| DRC_OPMODE_LOCAL_TMO | LocalTMO 模式，LocalData 相关参数由 stLocalDataV30 决定，其余取自 JSON。 |

<!-- Source EN PDF p.192; unit 2314 -->

9.3.5.3  mDrcGain_t

<!-- Source EN PDF p.192; unit 2315 -->

【说明】定义手动 DrcGain 属性。

<!-- Source EN PDF p.192; unit 2316 -->

【定义】

<!-- Source EN PDF p.192; unit 2317 -->

```text
 typedef struct mDrcGain_s {
     float DrcGain;
     float Alpha;
     float Clip;
 } mDrcGain_t;
```

<!-- Source EN PDF p.192; unit 2318 -->

【成员】

<!-- Source EN PDF p.192; unit 2319 -->

| 成员名称 | 说明 |
|---|---|
| DrcGain | 手动 DrcGain，范围 [1,8]，默认 1，精度 0.01。 |
| alpha | 手动 alpha，范围 [0,1]，默认 0.2，精度 0.01。 |
| Clip | 手动 Clip，范围 [0,64]，默认 16，精度 0.01。 |

<!-- Source EN PDF p.192; unit 2320 -->

9.3.5.4  mDrcHiLit_t

<!-- Source EN PDF p.192; unit 2321 -->

【说明】定义手动 Drc HiLit 属性。

<!-- Source EN PDF p.192; unit 2322 -->

【定义】

<!-- Source EN PDF p.193; unit 2323 -->

```text
 typedef struct mDrcHiLit_s {
     float Strength;
 } mDrcHiLit_t;
```

<!-- Source EN PDF p.193; unit 2324 -->

【成员】

<!-- Source EN PDF p.193; unit 2325 -->

| 成员名称 | 说明 |
|---|---|
| Strength | 手动 Strength，范围 [0,1]，默认 0，精度 0.01。 |

<!-- Source EN PDF p.193; unit 2326 -->

9.3.5.5  mLocalDataV21_t

<!-- Source EN PDF p.193; unit 2327 -->

【说明】定义 RK356x 的 DRC Local 属性。

<!-- Source EN PDF p.193; unit 2328 -->

【定义】

<!-- Source EN PDF p.193; unit 2329 -->

```text
 typedef struct mLocalDataV21_s {
     float LocalWeit;
     float GlobalContrast;
     float LoLitContrast;
 } mLocalDataV21_t;
```

<!-- Source EN PDF p.193; unit 2330 -->

【成员】

<!-- Source EN PDF p.193; unit 2331 -->

| 成员名称 | 说明 |
|---|---|
| LocalWeit | 手动 LocalWeit，原文范围 0,1，默认 1，精度 0.01。 |
| GlobalContrast | 手动 GlobalContrast，原文范围 0,1，默认 0，精度 0.01。 |
| LoLitContrast | 手动 LoLitContrast，原文范围 0,1，默认 0，精度 0.01。 |

<!-- Source EN PDF p.193; unit 2332 -->

9.3.5.6  mLocalDataV30_t

<!-- Source EN PDF p.193; unit 2333 -->

【说明】定义 RK356x 的 DRC Local 属性。

<!-- Source EN PDF p.193; unit 2334 -->

【定义】

<!-- Source EN PDF p.194; unit 2335 -->

```text
 typedef struct mLocalDataV30_s {
     float         LocalWeit;
     int           LocalAutoEnable;
     float         LocalAutoWeit;
     float         GlobalContrast;
     float         LoLitContrast;
 } mLocalDataV30_t;
```

<!-- Source EN PDF p.194; unit 2336 -->

【成员】

<!-- Source EN PDF p.194; unit 2337 -->

| 成员名称 | 说明 |
|---|---|
| LocalWeit | 手动 LocalWeit，范围 [0,1]，默认 1，精度 0.01。 |
| LocalAutoEnable | 自动 LocalWeit 开关，范围 [0,1]，默认 1，精度 1。 |
| LocalAutoWeit | 自动 LocalWeit，范围 [0,1]，默认 0.4，精度 0.01。 |
| GlobalContrast | 手动 GlobalContrast，范围 [0,1]，默认 0，精度 0.01。 |
| LoLitContrast | 手动 LoLitContrast，范围 [0,1]，默认 0，精度 0.01。 |

<!-- Source EN PDF p.194; unit 2338 -->

9.3.5.7  mDrcLocalV21_t

<!-- Source EN PDF p.194; unit 2339 -->

【说明】定义 RK356x 的 DRC Local 属性。

<!-- Source EN PDF p.194; unit 2340 -->

【定义】

<!-- Source EN PDF p.194; unit 2341 -->

```text
 typedef struct mDrcLocalV21_s {
     mLocalDataV21_t LocalData;
     float           curPixWeit;
     float           preFrameWeit;
     float           Range_force_sgm;
     float           Range_sgm_cur;
     float           Range_sgm_pre;
     int             Space_sgm_cur;
     int             Space_sgm_pre;
 } mDrcLocalV21_t;
```

<!-- Source EN PDF p.194; unit 2342 -->

【成员】

<!-- Source EN PDF p.195; unit 2343 -->

| 成员名称 | 说明 |
|---|---|
| LocalData | 手动设置 LocalData（原句未完）。 |
| curPixWeit | 当前点双边权重，范围 [0,1]，默认 0.37，精度 0.001。 |
| preFrameWeit | 前帧双边权重，范围 [0,1]，默认 0.8，精度 0.001。 |
| Range_force_sgm | 双边值域 sigma 的倒数，范围 [0,1]，默认 0，精度 0.0001。 |
| Range_sgm_cur | 前帧双边空域 sigma 的倒数，原文范围 0,1，默认 0.2，精度 0.0001。 |
| Range_sgm_pre | 前帧双边空域 sigma 的倒数，范围 [0,1]，默认 0.2，精度 0.0001。 |
| Space_sgm_cur | 当前帧双边值域倒数，范围 [0,4095]，默认 4068，精度 1。 |
| Space_sgm_pre | 前帧双边值域 sigma 的倒数，范围 [0,4095]，默认 3068，精度 1。 |

<!-- Source EN PDF p.195; unit 2344 -->

9.3.5.8  mDrcLocalV30_t

<!-- Source EN PDF p.195; unit 2345 -->

【说明】定义 RK3588 的 DRC Local 属性。

<!-- Source EN PDF p.195; unit 2346 -->

【定义】

<!-- Source EN PDF p.195; unit 2347 -->

```text
 typedef struct mDrcLocalV30_s {
     mLocalDataV30_t LocalData;
     float           curPixWeit;
     float           preFrameWeit;
     float           Range_force_sgm;
     float           Range_sgm_cur;
     float           Range_sgm_pre;
     int             Space_sgm_cur;
     int             Space_sgm_pre;
 } mDrcLocalV30_t;
```

<!-- Source EN PDF p.195; unit 2348 -->

【成员】

<!-- Source EN PDF p.196; unit 2349 -->

| 成员名称 | 说明 |
|---|---|
| LocalData | 手动 LocalData 设置 |
| curPixWeit | 当前点双边权重，范围 [0,1]，默认 0.37，精度 0.001。 |
| preFrameWeit | 前帧双边权重，范围 [0,1]，默认 0.8，精度 0.001。 |
| Range_force_sgm | 双边值域 sigma 倒数，范围 [0,1]，默认 0，精度 0.0001。 |
| Range_sgm_cur | 前帧双边空域 sigma 倒数，范围 [0,1]，默认 0.2，精度 0.0001。 |
| Range_sgm_pre | 前帧双边空域 sigma 倒数，范围 [0,1]，默认 0.2，精度 0.0001。 |
| Space_sgm_cur | 当前帧双边值域 sigma 倒数，范围 [0,4095]，默认 4068，精度 1。 |
| Space_sgm_pre | 前帧双边值域 sigma 倒数，范围 [0,4095]，默认 3068，精度 1。 |

<!-- Source EN PDF p.196; unit 2350 -->

9.3.5.9  CompressMode_t

<!-- Source EN PDF p.196; unit 2351 -->

【说明】定义手动模式下 DrcCompress 曲线工作模式。

<!-- Source EN PDF p.196; unit 2352 -->

【定义】

<!-- Source EN PDF p.196; unit 2353 -->

```text
 typedef enum CompressMode_s {
     COMPRESS_AUTO   = 0,
     COMPRESS_MANUAL = 1,
 } CompressMode_t;
```

<!-- Source EN PDF p.196; unit 2354 -->

【成员】

<!-- Source EN PDF p.196; unit 2355 -->

| 成员名称 | 说明 |
|---|---|
| COMPRESS_AUTO | 手动模式，Compress 曲线自动。 |
| COMPRESS_MANUAL | 手动模式，Compress 曲线手动。 |

<!-- Source EN PDF p.196; unit 2356 -->

9.3.5.10  mDrcCompress_t

<!-- Source EN PDF p.196; unit 2357 -->

【说明】定义手动 DrcCompress 属性。

<!-- Source EN PDF p.196; unit 2358 -->

【定义】

<!-- Source EN PDF p.197; unit 2359 -->

```text
 typedef struct mDrcCompress_s {
     CompressMode_t Mode;
     uint16_t       Manual_curve[17];
 } mDrcCompress_t;
```

<!-- Source EN PDF p.197; unit 2360 -->

【成员】

<!-- Source EN PDF p.197; unit 2361 -->

| 成员名称 | 说明 |
|---|---|
| Mode | 开关功能 |
| Manual_curve | 手动模式下的手动 Compress 曲线。 |

<!-- Source EN PDF p.197; unit 2362 -->

9.3.5.11  mdrcAttr_V21_t

<!-- Source EN PDF p.197; unit 2363 -->

【说明】定义 RK356x 手动 DRC 属性。

<!-- Source EN PDF p.197; unit 2364 -->

【定义】

<!-- Source EN PDF p.197; unit 2365 -->

```text
 typedef struct mdrcAttr_V21_s {
     bool           Enable;
     mDrcGain_t     DrcGain;
     mDrcHiLit_t    HiLight;
     mDrcLocalV21_t LocalSetting;
     mDrcCompress_t CompressSetting;
     int            Scale_y[ADRC_Y_NUM];
     float          Edge_Weit;
     bool           OutPutLongFrame;
     int            IIR_frame;
 } mdrcAttr_V21_t;
```

<!-- Source EN PDF p.197; unit 2366 -->

【成员】

<!-- Source EN PDF p.198; unit 2367 -->

| 成员名称 | 说明 |
|---|---|
| Enable | 手动 DRC 开关 |
| DrcGain | 手动 DrcGain 设置 |
| HiLight | 手动 HiLit 设置 |
| LocalSetting | 手动 Local 设置 |
| CompressSetting | 压缩曲线设置 |
| Scale_y | 增益校正比例表，范围 [0,2048]，精度 1。 |
| Edge_Weit | 边缘响应比例，范围 [0,1]，默认 0.02，精度 0.01，用于减少高对比度边缘伪影。 |
| OutPutLongFrame | 仅输出长帧开关：0 关闭、1 开启。 |
| IIR_frame | IIR 滤波帧数，范围 [1,1000]，默认 2。 |

<!-- Source EN PDF p.198; unit 2368 -->

9.3.5.12  mdrcAttr_V30_t

<!-- Source EN PDF p.198; unit 2369 -->

【说明】定义 RK3588 手动 DRC 属性。

<!-- Source EN PDF p.198; unit 2370 -->

【定义】

<!-- Source EN PDF p.198; unit 2371 -->

```text
 typedef struct mdrcAttr_V30_s {
     bool           Enable;
     mDrcGain_t     DrcGain;
     mDrcHiLit_t    HiLight;
     mDrcLocalV30_t LocalSetting;
     mDrcCompress_t CompressSetting;
     int            Scale_y[ADRC_Y_NUM];
     float          Edge_Weit;
     bool           OutPutLongFrame;
     int            IIR_frame;
 } mdrcAttr_V30_t;
```

<!-- Source EN PDF p.198; unit 2372 -->

【成员】

<!-- Source EN PDF p.199; unit 2373 -->

| 成员名称 | 说明 |
|---|---|
| Enable | 手动 DRC 开关 |
| DrcGain | 手动 DrcGain 设置 |
| HiLight | 手动 HiLit 设置 |
| LocalSetting | 手动 Local 设置 |
| CompressSetting | 压缩曲线设置 |
| Scale_y | 增益校正比例表，范围 [0,2048]，精度 1。 |
| Edge_Weit | 边缘响应比例，范围 [0,1]，默认 0.02，精度 0.01，用于减少高对比度边缘伪影。 |
| OutPutLongFrame | 仅输出长帧开关：0 关闭、1 开启。 |
| IIR_frame | IIR 滤波帧数，范围 [1,1000]，默认 2。 |

<!-- Source EN PDF p.199; unit 2374 -->

9.3.5.13  DrcInfo_t

<!-- Source EN PDF p.199; unit 2375 -->

【说明】定义 DRC 控制参数。

<!-- Source EN PDF p.199; unit 2376 -->

【定义】

<!-- Source EN PDF p.199; unit 2377 -->

```text
 typedef struct DrcInfo_s {
     float EnvLv;
     float ISO;
 } DrcInfo_t;
```

<!-- Source EN PDF p.199; unit 2378 -->

【成员】

<!-- Source EN PDF p.199; unit 2379 -->

| 成员名称 | 说明 |
|---|---|
| EnvLv | 当前环境亮度 |
| ISO | 当前 ISO |

<!-- Source EN PDF p.199; unit 2380 -->

9.3.5.14  drcAttr_t

<!-- Source EN PDF p.199; unit 2381 -->

【说明】定义 DRC 属性。

<!-- Source EN PDF p.199; unit 2382 -->

【定义】

<!-- Source EN PDF p.200; unit 2383 -->

```text
 typedef struct drcAttr_s {
     rk_aiq_uapi_sync_t sync;
     AdrcVersion_t      Version;
     drc_OpMode_t       opMode;
     mdrcAttr_V21_t     stManualV21;
     mdrcAttr_V30_t     stManualV30;
     mDrcGain_t         stDrcGain;
     mDrcHiLit_t        stHiLit;
     mLocalDataV21_t    stLocalDataV21;
     mLocalDataV30_t    stLocalDataV30;
     DrcInfo_t          Info;
 } drcAttr_t;
```

<!-- Source EN PDF p.200; unit 2384 -->

【成员】

<!-- Source EN PDF p.200; unit 2385 -->

| 成员名称 | 说明 |
|---|---|
| sync | rk_aiq_uapi_sync_t 的定义参见“概述/API 说明”。 |
| 版本 | 版本信息 |
| opMode | API 模式 |
| stManualV21 | RK356x 芯片的手动 DRC 属性，opMode 为 DRC_OPMODE_MANU 时生效。 |
| stManualV30 | RK3588 芯片的手动 DRC 属性，opMode 为 DRC_OPMODE_MANU 时参数生效。 |
| stDrcGain | DrcGain 属性，opMode 为 DRC_OPMODE_DRC_GAIN 时生效。 |
| stHiLit | Hillitt 属性，Optmod 为 Dirk_Optmod_Hillit 时生效（标识符按原文保留）。 |
| stLocalDataV21 | RK356x 芯片的 LocalData 属性，opMode 为 DRC_OPMODE_LOCAL_TMO 时生效。 |
| stLocalDataV30 | RK3588 芯片的 LocalData 属性，opMode 设为 DRC_OPMODE_LOCAL_TMO 时生效。 |
| Info | 控制参数信息 |

<!-- Source EN PDF p.200; unit 2386 -->

### 9.4 降噪

<!-- Source EN PDF p.200; unit 2387 -->

#### 9.4.1 功能说明

<!-- Source EN PDF p.200; unit 2388 -->

图像噪声指图像数据中不必要或不希望出现的干扰信息。图像降噪是降低数字图像噪声的过程。

<!-- Source EN PDF p.201; unit 2389 -->

#### 9.4.2 功能级 API 参考

<!-- Source EN PDF p.201; unit 2390 -->

9.4.2.1  rk_aiq_uapi2_setNRMode

<!-- Source EN PDF p.201; unit 2391 -->

【说明】设置降噪模式。

<!-- Source EN PDF p.201; unit 2392 -->

【语法】

<!-- Source EN PDF p.201; unit 2393 -->

```text
 XCamReturn rk_aiq_uapi2_setNRMode(const rk_aiq_sys_ctx_t* ctx, opMode_t mode);
```

<!-- Source EN PDF p.201; unit 2394 -->

【参数】

<!-- Source EN PDF p.201; unit 2395 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| mode | 工作模式 | 输入 |

<!-- Source EN PDF p.201; unit 2396 -->

【返回值】

<!-- Source EN PDF p.201; unit 2397 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.201; unit 2398 -->

【依赖】

<!-- Source EN PDF p.201; unit 2399 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.201; unit 2400 -->

库文件：librkaiq.so

<!-- Source EN PDF p.201; unit 2401 -->

9.4.2.2  rk_aiq_uapi2_getNRMode

<!-- Source EN PDF p.201; unit 2402 -->

【说明】获取当前降噪模式。

<!-- Source EN PDF p.201; unit 2403 -->

【语法】

<!-- Source EN PDF p.201; unit 2404 -->

```text
 XCamReturn rk_aiq_uapi2_getNRMode(const rk_aiq_sys_ctx_t* ctx, opMode_t* mode);
```

<!-- Source EN PDF p.201; unit 2405 -->

【参数】

<!-- Source EN PDF p.201; unit 2406 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| mode | 工作模式 | 输出 |

<!-- Source EN PDF p.201; unit 2407 -->

【返回值】

<!-- Source EN PDF p.202; unit 2408 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.202; unit 2409 -->

【依赖】

<!-- Source EN PDF p.202; unit 2410 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.202; unit 2411 -->

库文件：librkaiq.so

<!-- Source EN PDF p.202; unit 2412 -->

9.4.2.3  rk_aiq_uapi2_setANRStrth

<!-- Source EN PDF p.202; unit 2413 -->

【说明】设置常规降噪强度。

<!-- Source EN PDF p.202; unit 2414 -->

【语法】

<!-- Source EN PDF p.202; unit 2415 -->

```text
 XCamReturn rk_aiq_uapi2_setANRStrth(const rk_aiq_sys_ctx_t* ctx, unsigned int
 level);
```

<!-- Source EN PDF p.202; unit 2416 -->

【参数】

<!-- Source EN PDF p.202; unit 2417 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| level | 降噪强度，范围 0.0–100.0，默认 50。 | 输入 |

<!-- Source EN PDF p.202; unit 2418 -->

【返回值】

<!-- Source EN PDF p.202; unit 2419 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.202; unit 2420 -->

【依赖】

<!-- Source EN PDF p.202; unit 2421 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.202; unit 2422 -->

库文件：librkaiq.so

<!-- Source EN PDF p.202; unit 2423 -->

9.4.2.4  rk_aiq_uapi2_getANRStrth

<!-- Source EN PDF p.202; unit 2424 -->

【说明】获取常规降噪强度。

<!-- Source EN PDF p.202; unit 2425 -->

【语法】

<!-- Source EN PDF p.202; unit 2426 -->

```text
 XCamReturn rk_aiq_uapi2_getANRStrth(const rk_aiq_sys_ctx_t* ctx, unsigned int*
 level);
```

<!-- Source EN PDF p.202; unit 2427 -->

【参数】

<!-- Source EN PDF p.203; unit 2428 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| level | 降噪强度，范围 0.0–100.0，默认 50。 | 输出 |

<!-- Source EN PDF p.203; unit 2429 -->

【返回值】

<!-- Source EN PDF p.203; unit 2430 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.203; unit 2431 -->

【依赖】

<!-- Source EN PDF p.203; unit 2432 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.203; unit 2433 -->

库文件：librkaiq.so

<!-- Source EN PDF p.203; unit 2434 -->

9.4.2.5  rk_aiq_uapi2_setMSpaNRStrth

<!-- Source EN PDF p.203; unit 2435 -->

【说明】设置空域降噪强度。

<!-- Source EN PDF p.203; unit 2436 -->

【语法】

<!-- Source EN PDF p.203; unit 2437 -->

```text
 XCamReturn rk_aiq_uapi2_setMSpaNRStrth(const rk_aiq_sys_ctx_t* ctx, bool on,
 unsigned int level);
```

<!-- Source EN PDF p.203; unit 2438 -->

【参数】

<!-- Source EN PDF p.203; unit 2439 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| on | 开关 | 输入 |
| level | 降噪强度，范围 0.0–100.0，默认 50。 | 输入 |

<!-- Source EN PDF p.203; unit 2440 -->

【返回值】

<!-- Source EN PDF p.203; unit 2441 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.203; unit 2442 -->

【依赖】

<!-- Source EN PDF p.203; unit 2443 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.203; unit 2444 -->

库文件：librkaiq.so

<!-- Source EN PDF p.204; unit 2445 -->

9.4.2.6  rk_aiq_uapi2_getMSpaNRStrth

<!-- Source EN PDF p.204; unit 2446 -->

【说明】获取空域降噪强度。

<!-- Source EN PDF p.204; unit 2447 -->

【语法】

<!-- Source EN PDF p.204; unit 2448 -->

```text
 XCamReturn rk_aiq_uapi2_getMSpaNRStrth(const rk_aiq_sys_ctx_t* ctx, bool *on,
 unsigned int *level);
```

<!-- Source EN PDF p.204; unit 2449 -->

【参数】

<!-- Source EN PDF p.204; unit 2450 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| on | 开关 | 输出 |
| level | 降噪强度，范围 0.0–100.0，默认 50。 | 输出 |

<!-- Source EN PDF p.204; unit 2451 -->

【返回值】

<!-- Source EN PDF p.204; unit 2452 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.204; unit 2453 -->

【依赖】

<!-- Source EN PDF p.204; unit 2454 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.204; unit 2455 -->

库文件：librkaiq.so

<!-- Source EN PDF p.204; unit 2456 -->

9.4.2.7  rk_aiq_uapi2_setMTNRStrth

<!-- Source EN PDF p.204; unit 2457 -->

【说明】设置时域降噪强度。

<!-- Source EN PDF p.204; unit 2458 -->

【语法】

<!-- Source EN PDF p.204; unit 2459 -->

```text
 XCamReturn rk_aiq_uapi2_setMTNRStrth(const rk_aiq_sys_ctx_t* ctx, bool on,
 unsigned int level);
```

<!-- Source EN PDF p.204; unit 2460 -->

【参数】

<!-- Source EN PDF p.204; unit 2461 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| on | 开关 | 输入 |
| level | 降噪强度，范围 0.0–100.0，默认 50。 | 输入 |

<!-- Source EN PDF p.204; unit 2462 -->

【返回值】

<!-- Source EN PDF p.205; unit 2463 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.205; unit 2464 -->

【依赖】

<!-- Source EN PDF p.205; unit 2465 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.205; unit 2466 -->

库文件：librkaiq.so

<!-- Source EN PDF p.205; unit 2467 -->

9.4.2.8  rk_aiq_uapi2_getMTNRStrth

<!-- Source EN PDF p.205; unit 2468 -->

【说明】获取时域降噪强度。

<!-- Source EN PDF p.205; unit 2469 -->

【语法】

<!-- Source EN PDF p.205; unit 2470 -->

```text
 XCamReturn rk_aiq_uapi2_getMTNRStrth(const rk_aiq_sys_ctx_t* ctx, bool *on，
 unsigned int *level);
```

<!-- Source EN PDF p.205; unit 2471 -->

【参数】

<!-- Source EN PDF p.205; unit 2472 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| on | 开关 | 输出 |
| level | 降噪强度，范围 0.0–100.0，默认 50。 | 输出 |

<!-- Source EN PDF p.205; unit 2473 -->

【返回值】

<!-- Source EN PDF p.205; unit 2474 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.205; unit 2475 -->

【依赖】

<!-- Source EN PDF p.205; unit 2476 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.205; unit 2477 -->

库文件：librkaiq.so

<!-- Source EN PDF p.206; unit 2478 -->

#### 9.4.3 模块级 API 参考

<!-- Source EN PDF p.206; unit 2479 -->

9.4.3.1  rk_aiq_user_api2_abayer2dnrV2_SetAttrib

<!-- Source EN PDF p.206; unit 2480 -->

【说明】设置降噪算法属性。

<!-- Source EN PDF p.206; unit 2481 -->

【语法】

<!-- Source EN PDF p.206; unit 2482 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayer2dnrV2_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayer2dnr_attrib_v2_t* attr);
```

<!-- Source EN PDF p.206; unit 2483 -->

【参数】

<!-- Source EN PDF p.206; unit 2484 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 降噪参数属性 | 输入 |

<!-- Source EN PDF p.206; unit 2485 -->

【返回值】

<!-- Source EN PDF p.206; unit 2486 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.206; unit 2487 -->

【依赖】

<!-- Source EN PDF p.206; unit 2488 -->

头文件：rk_aiq_user_api2_abayer2dnr_v2.h、RkAiqHandleIntV3x.h

<!-- Source EN PDF p.206; unit 2489 -->

库文件：librkaiq.so

<!-- Source EN PDF p.206; unit 2490 -->

9.4.3.2  rk_aiq_user_api2_abayer2dnrV2_GetAttrib

<!-- Source EN PDF p.206; unit 2491 -->

【说明】获取降噪算法属性。

<!-- Source EN PDF p.206; unit 2492 -->

【语法】

<!-- Source EN PDF p.206; unit 2493 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayer2dnrV2_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayer2dnr_attrib_v2_t* attr);
```

<!-- Source EN PDF p.206; unit 2494 -->

【参数】

<!-- Source EN PDF p.207; unit 2495 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 降噪参数属性 | 输入 |

<!-- Source EN PDF p.207; unit 2496 -->

【返回值】

<!-- Source EN PDF p.207; unit 2497 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.207; unit 2498 -->

【依赖】

<!-- Source EN PDF p.207; unit 2499 -->

头文件：rk_aiq_user_api2_abayer2dnr_v2.h、RkAiqHandleIntV3x.h

<!-- Source EN PDF p.207; unit 2500 -->

库文件：librkaiq.so

<!-- Source EN PDF p.207; unit 2501 -->

9.4.3.3  rk_aiq_user_api2_abayer2dnrV2_SetStrength

<!-- Source EN PDF p.207; unit 2502 -->

【说明】设置降噪强度。

<!-- Source EN PDF p.207; unit 2503 -->

【语法】

<!-- Source EN PDF p.207; unit 2504 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayer2dnrV2_SetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayer2dnr_strength_v2_t *pStrength)
```

<!-- Source EN PDF p.207; unit 2505 -->

【参数】

<!-- Source EN PDF p.207; unit 2506 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| pStrength | 降噪强度相关结构体，其中 percent 的范围为 0.0–1.0。 | 输入 |

<!-- Source EN PDF p.207; unit 2507 -->

【返回值】

<!-- Source EN PDF p.207; unit 2508 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.207; unit 2509 -->

【依赖】

<!-- Source EN PDF p.208; unit 2510 -->

头文件：rk_aiq_user_api2_abayer2dnr_v2.h、RkAiqHandleIntV3x.h

<!-- Source EN PDF p.208; unit 2511 -->

库文件：librkaiq.so

<!-- Source EN PDF p.208; unit 2512 -->

9.4.3.4  rk_aiq_user_api2_abayer2dnrV2_GetStrength

<!-- Source EN PDF p.208; unit 2513 -->

【说明】获取降噪强度。

<!-- Source EN PDF p.208; unit 2514 -->

【语法】

<!-- Source EN PDF p.208; unit 2515 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayer2dnrV2_GetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayer2dnr_strength_v2_t *pStrength);
```

<!-- Source EN PDF p.208; unit 2516 -->

【参数】

<!-- Source EN PDF p.208; unit 2517 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| pPercnt | 降噪强度结构体指针，其中 percentage 的范围为 0.0–1.0。 | 输入 |

<!-- Source EN PDF p.208; unit 2518 -->

【返回值】

<!-- Source EN PDF p.208; unit 2519 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.208; unit 2520 -->

【依赖】

<!-- Source EN PDF p.208; unit 2521 -->

头文件：rk_aiq_user_api2_abayer2dnr_v2.h、RkAiqHandleIntV3x.h

<!-- Source EN PDF p.208; unit 2522 -->

库文件：librkaiq.so

<!-- Source EN PDF p.208; unit 2523 -->

9.4.3.5  rk_aiq_user_api2_abayertnrV2_SetAttrib

<!-- Source EN PDF p.208; unit 2524 -->

【说明】设置降噪算法属性。

<!-- Source EN PDF p.208; unit 2525 -->

【语法】

<!-- Source EN PDF p.208; unit 2526 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayertnrV2_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayertnr_attrib_v2_t* attr);
```

<!-- Source EN PDF p.208; unit 2527 -->

【参数】

<!-- Source EN PDF p.209; unit 2528 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 降噪参数属性 | 输入 |

<!-- Source EN PDF p.209; unit 2529 -->

【返回值】

<!-- Source EN PDF p.209; unit 2530 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.209; unit 2531 -->

【依赖】

<!-- Source EN PDF p.209; unit 2532 -->

头文件：rk_aiq_user_api2_abayertnr_v2.h、RkAiqHandleIntV3x.h

<!-- Source EN PDF p.209; unit 2533 -->

库文件：librkaiq.so

<!-- Source EN PDF p.209; unit 2534 -->

9.4.3.6  rk_aiq_user_api2_abayertnrV2_GetAttrib

<!-- Source EN PDF p.209; unit 2535 -->

【说明】获取降噪算法属性。

<!-- Source EN PDF p.209; unit 2536 -->

【语法】

<!-- Source EN PDF p.209; unit 2537 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayertnrV2_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayertnr_attrib_v2_t* attr);
```

<!-- Source EN PDF p.209; unit 2538 -->

【参数】

<!-- Source EN PDF p.209; unit 2539 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 降噪参数属性 | 输入 |

<!-- Source EN PDF p.209; unit 2540 -->

【返回值】

<!-- Source EN PDF p.209; unit 2541 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.209; unit 2542 -->

【依赖】

<!-- Source EN PDF p.209; unit 2543 -->

头文件：rk_aiq_user_api2_abayertnr_v2.h、RkAiqHandleIntV3x.h

<!-- Source EN PDF p.209; unit 2544 -->

库文件：librkaiq.so

<!-- Source EN PDF p.210; unit 2545 -->

9.4.3.7  rk_aiq_user_api2_abayertnrV2_SetStrength

<!-- Source EN PDF p.210; unit 2546 -->

【说明】设置降噪强度。

<!-- Source EN PDF p.210; unit 2547 -->

【语法】

<!-- Source EN PDF p.210; unit 2548 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayertnrV2_SetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayertnr_strength_v2_t *pStrength);
```

<!-- Source EN PDF p.210; unit 2549 -->

【参数】

<!-- Source EN PDF p.210; unit 2550 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| pStrength | 降噪强度结构体指针，其中 percentage 的范围为 0.0–1.0。 | 输入 |

<!-- Source EN PDF p.210; unit 2551 -->

【返回值】

<!-- Source EN PDF p.210; unit 2552 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.210; unit 2553 -->

【依赖】

<!-- Source EN PDF p.210; unit 2554 -->

头文件：rk_aiq_user_api2_abayertnr_v2.h、RkAiqHandleIntV3x.h

<!-- Source EN PDF p.210; unit 2555 -->

库文件：librkaiq.so

<!-- Source EN PDF p.210; unit 2556 -->

9.4.3.8  rk_aiq_user_api2_abayertnrV2_GetStrength

<!-- Source EN PDF p.210; unit 2557 -->

【说明】获取降噪强度。

<!-- Source EN PDF p.210; unit 2558 -->

【语法】

<!-- Source EN PDF p.210; unit 2559 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayertnrV2_GetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayertnr_strength_v2_t *pStrength);
```

<!-- Source EN PDF p.210; unit 2560 -->

【参数】

<!-- Source EN PDF p.211; unit 2561 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| pStrength | 降噪强度结构体指针，其中 percentage 的范围为 0.0–1.0。 | 输入 |

<!-- Source EN PDF p.211; unit 2562 -->

【返回值】

<!-- Source EN PDF p.211; unit 2563 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.211; unit 2564 -->

【依赖】

<!-- Source EN PDF p.211; unit 2565 -->

头文件：rk_aiq_user_api2_abayertnr_v2.h、RkAiqHandleIntV3x.h

<!-- Source EN PDF p.211; unit 2566 -->

库文件：librkaiq.so

<!-- Source EN PDF p.211; unit 2567 -->

9.4.3.9  rk_aiq_user_api2_aynrV3_SetAttrib

<!-- Source EN PDF p.211; unit 2568 -->

【说明】设置降噪算法属性。

<!-- Source EN PDF p.211; unit 2569 -->

【语法】

<!-- Source EN PDF p.211; unit 2570 -->

```text
 XCamReturn
 rk_aiq_user_api2_aynrV3_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ynr_attrib_v3_t* attr);
```

<!-- Source EN PDF p.211; unit 2571 -->

【参数】

<!-- Source EN PDF p.211; unit 2572 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 降噪参数属性 | 输入 |

<!-- Source EN PDF p.211; unit 2573 -->

【返回值】

<!-- Source EN PDF p.211; unit 2574 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.211; unit 2575 -->

【依赖】

<!-- Source EN PDF p.211; unit 2576 -->

头文件：rk_aiq_user_api2_aynr_v3.h、RkAiqHandleIntV3x.h

<!-- Source EN PDF p.212; unit 2577 -->

库文件：librkaiq.so

<!-- Source EN PDF p.212; unit 2578 -->

9.4.3.10  rk_aiq_user_api2_aynrV3_GetAttrib

<!-- Source EN PDF p.212; unit 2579 -->

【说明】获取降噪算法属性。

<!-- Source EN PDF p.212; unit 2580 -->

【语法】

<!-- Source EN PDF p.212; unit 2581 -->

```text
 XCamReturn
 rk_aiq_user_api2_aynrV3_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ynr_attrib_v3_t* attr);
```

<!-- Source EN PDF p.212; unit 2582 -->

【参数】

<!-- Source EN PDF p.212; unit 2583 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 降噪参数属性 | 输入 |

<!-- Source EN PDF p.212; unit 2584 -->

【返回值】

<!-- Source EN PDF p.212; unit 2585 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.212; unit 2586 -->

【依赖】

<!-- Source EN PDF p.212; unit 2587 -->

头文件：rk_aiq_user_api2_aynr_v3.h、RkAiqHandleIntV3x.h

<!-- Source EN PDF p.212; unit 2588 -->

库文件：librkaiq.so

<!-- Source EN PDF p.212; unit 2589 -->

9.4.3.11  rk_aiq_user_api2_aynrV3_SetStrength

<!-- Source EN PDF p.212; unit 2590 -->

【说明】设置降噪强度。

<!-- Source EN PDF p.212; unit 2591 -->

【语法】

<!-- Source EN PDF p.212; unit 2592 -->

```text
 XCamReturn
 rk_aiq_user_api2_aynrV3_SetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ynr_strength_v3_t* pStrength);
```

<!-- Source EN PDF p.212; unit 2593 -->

【参数】

<!-- Source EN PDF p.213; unit 2594 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| pStrength | 降噪强度结构体指针，其中 percentage 的范围为 0.0–1.0。 | 输入 |

<!-- Source EN PDF p.213; unit 2595 -->

【返回值】

<!-- Source EN PDF p.213; unit 2596 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.213; unit 2597 -->

【依赖】

<!-- Source EN PDF p.213; unit 2598 -->

头文件：rk_aiq_user_api2_aynr_v3.h、RkAiqHandleIntV3x.h

<!-- Source EN PDF p.213; unit 2599 -->

库文件：librkaiq.so

<!-- Source EN PDF p.213; unit 2600 -->

9.4.3.12  rk_aiq_user_api2_aynrV3_GetStrength

<!-- Source EN PDF p.213; unit 2601 -->

【说明】获取降噪强度。

<!-- Source EN PDF p.213; unit 2602 -->

【语法】

<!-- Source EN PDF p.213; unit 2603 -->

```text
 XCamReturn
 rk_aiq_user_api2_aynrV3_GetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ynr_strength_v3_t* pStrength);
```

<!-- Source EN PDF p.213; unit 2604 -->

【参数】

<!-- Source EN PDF p.213; unit 2605 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| pStrength | 降噪强度结构体指针，其中 percentage 的范围为 0.0–1.0。 | 输入 |

<!-- Source EN PDF p.213; unit 2606 -->

【返回值】

<!-- Source EN PDF p.213; unit 2607 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.213; unit 2608 -->

【依赖】

<!-- Source EN PDF p.214; unit 2609 -->

头文件：rk_aiq_user_api2_aynr_v3.h、RkAiqHandleIntV3x.h

<!-- Source EN PDF p.214; unit 2610 -->

库文件：librkaiq.so

<!-- Source EN PDF p.214; unit 2611 -->

9.4.3.13  rk_aiq_user_api2_acnrV2_SetAttrib

<!-- Source EN PDF p.214; unit 2612 -->

【说明】设置降噪算法属性。

<!-- Source EN PDF p.214; unit 2613 -->

【语法】

<!-- Source EN PDF p.214; unit 2614 -->

```text
 XCamReturn
 rk_aiq_user_api2_acnrV2_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_cnr_attrib_v2_t* attr);
```

<!-- Source EN PDF p.214; unit 2615 -->

【参数】

<!-- Source EN PDF p.214; unit 2616 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 降噪参数属性 | 输入 |

<!-- Source EN PDF p.214; unit 2617 -->

【返回值】

<!-- Source EN PDF p.214; unit 2618 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.214; unit 2619 -->

【依赖】

<!-- Source EN PDF p.214; unit 2620 -->

头文件：rk_aiq_user_api2_acnr_v2.h、RkAiqHandleIntV3x.h

<!-- Source EN PDF p.214; unit 2621 -->

库文件：librkaiq.so

<!-- Source EN PDF p.214; unit 2622 -->

9.4.3.14  rk_aiq_user_api2_acnrV2_GetAttrib

<!-- Source EN PDF p.214; unit 2623 -->

【说明】获取降噪算法属性。

<!-- Source EN PDF p.214; unit 2624 -->

【语法】

<!-- Source EN PDF p.214; unit 2625 -->

```text
 XCamReturn
 rk_aiq_user_api2_acnrV2_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_cnr_attrib_v2_t* attr);
```

<!-- Source EN PDF p.214; unit 2626 -->

【参数】

<!-- Source EN PDF p.215; unit 2627 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 降噪参数属性 | 输入 |

<!-- Source EN PDF p.215; unit 2628 -->

【返回值】

<!-- Source EN PDF p.215; unit 2629 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.215; unit 2630 -->

【依赖】

<!-- Source EN PDF p.215; unit 2631 -->

头文件：rk_aiq_user_api2_acnr_v2.h、RkAiqHandleIntV3x.h

<!-- Source EN PDF p.215; unit 2632 -->

库文件：librkaiq.so

<!-- Source EN PDF p.215; unit 2633 -->

9.4.3.15  rk_aiq_user_api2_acnrV2_SetStrength

<!-- Source EN PDF p.215; unit 2634 -->

【说明】设置降噪强度。

<!-- Source EN PDF p.215; unit 2635 -->

【语法】

<!-- Source EN PDF p.215; unit 2636 -->

```text
 XCamReturn
 rk_aiq_user_api2_acnrV2_SetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_cnr_strength_v2_t *pStrength);
```

<!-- Source EN PDF p.215; unit 2637 -->

【参数】

<!-- Source EN PDF p.215; unit 2638 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| pStrength | 降噪强度结构体指针，其中 percentage 的范围为 0.0–1.0。 | 输入 |

<!-- Source EN PDF p.215; unit 2639 -->

【返回值】

<!-- Source EN PDF p.215; unit 2640 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.215; unit 2641 -->

【依赖】

<!-- Source EN PDF p.215; unit 2642 -->

头文件：rk_aiq_user_api2_acnr_v2.h、RkAiqHandleIntV3x.h

<!-- Source EN PDF p.216; unit 2643 -->

库文件：librkaiq.so

<!-- Source EN PDF p.216; unit 2644 -->

9.4.3.16  rk_aiq_user_api2_acnrV2_GetStrength

<!-- Source EN PDF p.216; unit 2645 -->

【说明】获取降噪强度。

<!-- Source EN PDF p.216; unit 2646 -->

【语法】

<!-- Source EN PDF p.216; unit 2647 -->

```text
 XCamReturn
 rk_aiq_user_api2_acnrV2_GetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_cnr_strength_v2_t *pStrength);
```

<!-- Source EN PDF p.216; unit 2648 -->

【参数】

<!-- Source EN PDF p.216; unit 2649 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| pStrength | 降噪强度结构体指针，其中 percentage 的范围为 0.0–1.0。 | 输入 |

<!-- Source EN PDF p.216; unit 2650 -->

【返回值】

<!-- Source EN PDF p.216; unit 2651 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.216; unit 2652 -->

【依赖】

<!-- Source EN PDF p.216; unit 2653 -->

头文件：rk_aiq_user_api2_acnr_v2.h、RkAiqHandleIntV3x.h

<!-- Source EN PDF p.216; unit 2654 -->

库文件：librkaiq.so

<!-- Source EN PDF p.216; unit 2655 -->

#### 9.4.4 模块级 API 数据类型

<!-- Source EN PDF p.216; unit 2656 -->

9.4.4.1  rk_aiq_bayer2dnr_attrib_v2_t

<!-- Source EN PDF p.216; unit 2657 -->

【说明】定义降噪模块参数。

<!-- Source EN PDF p.216; unit 2658 -->

【定义】

<!-- Source EN PDF p.217; unit 2659 -->

```text
 typedef struct rk_aiq_bayer2dnr_attrib_v2_s {
     rk_aiq_uapi_sync_t sync;
 Abayer2dnr_OPMode_V2_t eMode;
     Abayer2dnr_Auto_Attr_V2_t stAuto;
     Abayer2dnr_Manual_Attr_V2_t stManual;
 } rk_aiq_bayer2dnr_attrib_v2_t;
```

<!-- Source EN PDF p.217; unit 2660 -->

【成员】

<!-- Source EN PDF p.217; unit 2661 -->

| 成员名称 | 说明 |
|---|---|
| sync | 同步/异步模式选择，见概述/API 说明部分。 |
| eMode | Bayer2DNR 降噪模块模式 |
| stAuto | Bayer2DNR 降噪模块自动模式参数 |
| stManual | Bayer2DNR 降噪模块手动模式参数 |

<!-- Source EN PDF p.217; unit 2662 -->

9.4.4.2  Abayer2dnr_OPMode_V2_t

<!-- Source EN PDF p.217; unit 2663 -->

【说明】定义降噪模块模式。

<!-- Source EN PDF p.217; unit 2664 -->

【定义】

<!-- Source EN PDF p.217; unit 2665 -->

```text
 typedef enum Abayer2dnr_OPMode_V2_e {
     ABAYER2DNR_OP_MODE_INVALID           = 0,
     ABAYER2DNR_OP_MODE_AUTO              = 1,
     ABAYER2DNR_OP_MODE_MANUAL            = 2,
     ABAYER2DNR_OP_MODE_REG_MANUAL        = 3,
     ABAYER2DNR_OP_MODE_MAX
 } Abayer2dnr_OPMode_V2_t;
```

<!-- Source EN PDF p.217; unit 2666 -->

【成员】

<!-- Source EN PDF p.217; unit 2667 -->

| 成员名称 | 说明 |
|---|---|
| ABAYER2DNR_OP_MODE_INVALID | Bayer 域 2DNR 降噪模块无效模式 |
| ABAYER2DNR_OP_MODE_AUTO | Bayer 域 2DNR 降噪模块自动模式 |
| ABAYER2DNR_OP_MODE_MANUAL | Bayer 域 2DNR 降噪模块手动模式算法设置 |
| ABAYER2DNR_OP_MODE_REG_MANUAL | Bayer 域 2DNR 降噪模块手动模式寄存器设置 |
| ABAYER2DNR_OP_MODE_MAX | Bayer 域 2DNR 降噪模块模式最大值，为无效模式。 |

<!-- Source EN PDF p.218; unit 2668 -->

9.4.4.3  Abayer2dnr_Auto_Attr_V2_t

<!-- Source EN PDF p.218; unit 2669 -->

【说明】定义降噪模块自动属性。

<!-- Source EN PDF p.218; unit 2670 -->

【定义】

<!-- Source EN PDF p.218; unit 2671 -->

```text
 typedef struct Abayer2dnr_Auto_Attr_V2_s
 {
     RK_Bayer2dnr_Params_V2_t st2DParams;
     RK_Bayer2dnr_Params_V2_Select_t st2DSelect;
 } Abayer2dnr_Auto_Attr_V2_t;
```

<!-- Source EN PDF p.218; unit 2672 -->

【成员】

<!-- Source EN PDF p.218; unit 2673 -->

| 成员名称 | 说明 |
|---|---|
| st2DParams | Bayer2DNR 模块各 ISO 对应的算法属性参数 |
| st2DSelect | Bayer2DNR 模块计算后的属性参数 |

<!-- Source EN PDF p.218; unit 2674 -->

9.4.4.4  Abayer2dnr_Manual_Attr_V2_t

<!-- Source EN PDF p.218; unit 2675 -->

【说明】定义降噪模块手动属性。

<!-- Source EN PDF p.218; unit 2676 -->

【定义】

<!-- Source EN PDF p.218; unit 2677 -->

```text
 typedef struct Abayer2dnr_Manual_Attr_V2_s
 {
     RK_Bayer2dnr_Params_V2_Select_t st2DSelect;
     RK_Bayer2dnr_Fix_V2_t st2Dfix;
 } Abayer2dnr_Manual_Attr_V2_t;
```

<!-- Source EN PDF p.218; unit 2678 -->

【成员】

<!-- Source EN PDF p.218; unit 2679 -->

| 成员名称 | 说明 |
|---|---|
| st2DSelect | Bayer2DNR 算法参数值 |
| st2Dfix | 手动模式下 Bayer2DNR 寄存器值 |

<!-- Source EN PDF p.218; unit 2680 -->

9.4.4.5  RK_Bayer2dnr_Params_V2_t

<!-- Source EN PDF p.218; unit 2681 -->

【说明】定义降噪模块自动模式及各 ISO 对应的算法属性参数。

<!-- Source EN PDF p.218; unit 2682 -->

【定义】

<!-- Source EN PDF p.219; unit 2683 -->

```text
 typedef struct RK_Bayer2dnr_Params_V2_s
 {
     int enable;
     float iso[RK_BAYER2DNR_V2_MAX_ISO_NUM];
     int   lumapoint[16];
     int   sigma[RK_BAYER2DNR_V2_MAX_ISO_NUM][16];
     float filter_strength[RK_BAYER2DNR_V2_MAX_ISO_NUM];
     float edgesofts[RK_BAYER2DNR_V2_MAX_ISO_NUM];
     float ratio[RK_BAYER2DNR_V2_MAX_ISO_NUM];
     float weight[RK_BAYER2DNR_V2_MAX_ISO_NUM];
     int   gauss_guide[RK_BAYER2DNR_V2_MAX_ISO_NUM];
     int pix_diff[RK_BAYER2DNR_V2_MAX_ISO_NUM];
     int diff_thld[RK_BAYER2DNR_V2_MAX_ISO_NUM];
 } RK_Bayer2dnr_Params_V2_t;
```

<!-- Source EN PDF p.219; unit 2684 -->

【成员】

<!-- Source EN PDF p.220; unit 2685 -->

| 成员名称 | 参数类型 | 说明 |
|---|---|---|
| enable | 调试参数 | 模块使能开关：1 开启，0 关闭。 |
| ISO | 调试参数 | 不同 ISO 档位对应不同调试参数，目前仅支持 13 档。 |
| lumapoint | 标定数据 | 不同像素亮度对应的噪声 sigma 曲线点，共 16 点。 |
| sigma | 标定数据 | 不同像素亮度对应的噪声 sigma 曲线点，共 16 点。 |
| gauss_guide | 调试参数 | 是否启用高斯引导：1 启用，0 关闭。 |
| filter_strength | 调试参数 | 降噪强度参数，范围 [0, 16]，越大降噪越强。 |
| edgesofts | 调试参数 | 影响空域权重，范围 1–16，默认 1。 |
| ratio | 调试参数 | 软阈值权重，范围 0–1.0，越小降噪越强。 |
| weight | 调试参数 | 滤波输出权重越大，降噪越强。 |
| pix_diff | 调试参数 | 双边滤波 5x5 窗口像素差阈值，默认 0x3fff。 |
| diff_thld | 调试参数 | 双边滤波计算欧氏距离的平方差阈值为 0x3ff。 |

<!-- Source EN PDF p.220; unit 2686 -->

9.4.4.6  RK_Bayer2dnr_Params_V2_Select_t

<!-- Source EN PDF p.220; unit 2687 -->

【说明】定义降噪模块手动模式算法属性。

<!-- Source EN PDF p.220; unit 2688 -->

【定义】

<!-- Source EN PDF p.220; unit 2689 -->

```text
 typedef struct RK_Bayer2dnr_Params_V2_Select_s
 {
     int enable;
     int lumapoint[16];
     int sigma[16];
     float filter_strength;
     float edgesofts;
     float ratio;
     float weight;
     int gauss_guide;
     int pix_diff;
     int diff_thld;
 } RK_Bayer2dnr_Params_V2_Select_t;
```

<!-- Source EN PDF p.221; unit 2690 -->

【成员】

<!-- Source EN PDF p.221; unit 2691 -->

| 成员名 | 参数类型 | 说明 |
|---|---|---|
| enable | 调试参数 | 模块使能开关：1 开，0 关。 |
| lumapoint | 标定数据 | 不同像素亮度对应不同噪声 SIGMA 曲线点，共 16 点。 |
| sigma | 标定数据 | 不同像素亮度对应不同噪声 SIGMA 曲线点，共 16 点。 |
| gauss_guide | 调试参数 | 是否启用高斯引导：1 启用，0 关闭。 |
| filter_strength | 调试参数 | 降噪强度参数，范围 [0, 16]，越大降噪越强。 |
| edgesofts | 调试参数 | 影响空域权重，范围 [1, 16]，默认 1。 |
| ratio | 调试参数 | 软阈值权重，范围 [0, 1.0]，越小降噪越强。 |
| weight | 调试参数 | 滤波输出权重越大，降噪越强。 |
| pix_diff | 调试参数 | 双边滤波 5x5 窗口像素差阈值，默认 0x3fff。 |
| diff_thld | 调试参数 | 双边滤波计算欧氏距离的平方差阈值为 0x3ff。 |

<!-- Source EN PDF p.221; unit 2692 -->

9.4.4.7  RK_Bayer2dnr_Fix_V2_t

<!-- Source EN PDF p.221; unit 2693 -->

【说明】定义降噪模块手动模式寄存器配置。

<!-- Source EN PDF p.221; unit 2694 -->

【定义】

<!-- Source EN PDF p.221; unit 2695 -->

```text
 typedef struct RK_Bayer2dnr_Fix_V2_s {
     //ISP_BAYNR_3A00_CTRL
     uint8_t baynr_lg2_mode;
     uint8_t baynr_gauss_en;
     uint8_t baynr_log_bypass;
     uint8_t baynr_en;
     // ISP_BAYNR_3A00_DGAIN0-2
     uint16_t baynr_dgain[3];
     // ISP_BAYNR_3A00_PIXDIFF
     uint16_t baynr_pix_diff;
     // ISP_BAYNR_3A00_THLD
     uint16_t baynr_diff_thld;
     uint16_t baynr_softthld;
     // ISP_BAYNR_3A00_W1_STRENG
     uint16_t bltflt_streng;
     uint16_t baynr_reg_w1;
     // ISP_BAYNR_3A00_SIGMAX0-15
     uint16_t sigma_x[16];
     // ISP_BAYNR_3A00_SIGMAY0-15
     uint16_t sigma_y[16];
     // ISP_BAYNR_3A00_WRIT_D
     uint16_t weit_d[3];
     uint16_t lg2_lgoff;
     uint16_t lg2_off;
     uint32_t dat_max;
 } RK_Bayer2dnr_Fix_V2_t;
 } RK_Bayer2dnr_Fix_V23_t;
```

<!-- Source EN PDF p.222; unit 2696 -->

【成员】

<!-- Source EN PDF p.223; unit 2697 -->

| 参数 | 位宽 | 参数说明 |
|---|---|---|
| baynr_gauss_en | 1 | 高斯 3x3 引导滤波使能位：1 开启滤波，0 关闭；默认 0。 |
| baynr_log_bypass | 1 | log 变换控制位，HDR 硬件内部强制关闭；1 开启 log 旁路即关闭 log 变换，0 关闭旁路即开启变换；默认 0。 |
| baynr_en | 1 | Bayer 降噪使能位：1 开启，0 关闭；默认配置 0。 |
| baynr_dgain | 18 | HDR 模式三帧增益对应参数，小数 10bit。 |
| baynr_pix_diff | 14 | 双边滤波 5x5 窗口像素差阈值，默认 0x3fff。 |
| baynr_diff_thld | 10 | 双边滤波计算欧氏距离的平方差阈值，默认配置 0x3ff。 |
| baynr_softthld | 10 | 软阈值权重，越大则阈值越大、保留噪声越多；小数 10bit，默认 0xa。 |
| bltflt_streng | 12 | 双边滤波降噪强度；小数 8bit，默认 0xa3。 |
| baynr_reg_w1 | 10 | 滤波输出权重，越大越多使用滤波结果，越小越多使用原值；小数 10bit，默认 0x3ff。 |
| sigma_x | 16 | 噪声曲线的 16 个亮度等级，配置需保证相邻两个值的插值间距为 2 的幂。 |
| sigma_y | 16 | 噪声曲线的 16 个 sigma 等级，配置参数来自标定。 |
| weit_d | 10 | 空域权重表示不同位置的权重，小数 10bit；默认 0x178、0x249、0x31d。 |

<!-- Source EN PDF p.224; unit 2698 -->

9.4.4.8  rk_aiq_bayer2dnr_strength_v2_t

<!-- Source EN PDF p.224; unit 2699 -->

【说明】定义降噪模块降噪强度配置结构体。

<!-- Source EN PDF p.224; unit 2700 -->

【定义】

<!-- Source EN PDF p.224; unit 2701 -->

```text
 typedef struct rk_aiq_bayer2dnr_strength_v2_s {
     rk_aiq_uapi_sync_t sync;
     float percent;
 } rk_aiq_bayer2dnr_strength_v2_t;
```

<!-- Source EN PDF p.224; unit 2702 -->

【成员】

<!-- Source EN PDF p.224; unit 2703 -->

| 成员名称 | 说明 |
|---|---|
| sync | 同步/异步模式选择，见概述/API 说明部分。 |
| percent | 降噪强度，范围 0.0–1.0。 |

<!-- Source EN PDF p.224; unit 2704 -->

9.4.4.9  rk_aiq_bayertnr_attrib_v2_t

<!-- Source EN PDF p.224; unit 2705 -->

【说明】定义降噪模块参数。

<!-- Source EN PDF p.224; unit 2706 -->

【定义】

<!-- Source EN PDF p.224; unit 2707 -->

```text
 typedef struct rk_aiq_bayertnr_attrib_v2_s {
     rk_aiq_uapi_sync_t sync;
     Abayertnr_OPMode_V2_t eMode;
     Abayertnr_Auto_Attr_V2_t stAuto;
     Abayertnr_Manual_Attr_V2_t stManual;
 } rk_aiq_bayertnr_attrib_v2_t;
```

<!-- Source EN PDF p.224; unit 2708 -->

【成员】

<!-- Source EN PDF p.224; unit 2709 -->

| 成员名称 | 说明 |
|---|---|
| sync | 同步/异步模式选择，见概述/API 说明部分。 |
| eMode | BayerTNR 降噪模块模式 |
| stAuto | BayerTNR 降噪模块自动模式参数 |
| stManual | BayerTNR 降噪模块手动模式参数 |

<!-- Source EN PDF p.225; unit 2710 -->

9.4.4.10  Abayertnr_OPMode_V2_t

<!-- Source EN PDF p.225; unit 2711 -->

【说明】定义降噪模块模式。

<!-- Source EN PDF p.225; unit 2712 -->

【定义】

<!-- Source EN PDF p.225; unit 2713 -->

```text
 typedef enum Abayertnr_OPMode_V2_e {
     ABAYERTNRV2_OP_MODE_INVALID           = 0,
     ABAYERTNRV2_OP_MODE_AUTO              = 1,
     ABAYERTNRV2_OP_MODE_MANUAL            = 2,
     ABAYERTNRV2_OP_MODE_REG_MANUAL        = 3,
     ABAYERTNRV2_OP_MODE_MAX
 } Abayertnr_OPMode_V2_t;
```

<!-- Source EN PDF p.225; unit 2714 -->

【成员】

<!-- Source EN PDF p.225; unit 2715 -->

| 成员名称 | 说明 |
|---|---|
| ABAYERTNRV2_OP_MODE_INVALID | Bayer 域 TNR 降噪模块无效模式 |
| ABAYERTNRV2_OP_MODE_AUTO | Bayer 域 TNR 降噪模块自动模式 |
| ABAYERTNRV2_OP_MODE_MANUAL | Bayer 域 TNR 降噪模块手动模式算法设置 |
| ABAYERTNRV2_OP_MODE_MAX | Bayer 域 TNR 降噪模块模式最大值，为无效模式。 |

<!-- Source EN PDF p.225; unit 2716 -->

9.4.4.11  Abayertnr_Auto_Attr_V2_t

<!-- Source EN PDF p.225; unit 2717 -->

【说明】定义降噪模块自动属性。

<!-- Source EN PDF p.225; unit 2718 -->

【定义】

<!-- Source EN PDF p.225; unit 2719 -->

```text
 typedef struct Abayertnr_Auto_Attr_V2_s
 {
     int bayernr3DEn;
     RK_Bayertnr_Params_V2_t st3DParams;
     RK_Bayertnr_Params_V2_Select_t st3DSelect;
 } Abayertnr_Auto_Attr_V2_t;
```

<!-- Source EN PDF p.225; unit 2720 -->

【成员】

<!-- Source EN PDF p.226; unit 2721 -->

| 成员名称 | 说明 |
|---|---|
| bayernr3DEn | Bayer3DNR 模块使能开关 |
| st3DParams | Bayer3DNR 自动模式各 ISO 对应的算法属性参数 |
| st3DSelect | Bayer3DNR 模块计算后的属性参数 |

<!-- Source EN PDF p.226; unit 2722 -->

9.4.4.12  Abayertnr_Manual_Attr_V23_t

<!-- Source EN PDF p.226; unit 2723 -->

【说明】定义降噪模块手动属性。

<!-- Source EN PDF p.226; unit 2724 -->

【定义】

<!-- Source EN PDF p.226; unit 2725 -->

```text
 typedef struct Abayertnr_Manual_Attr_V2_s
 {
     int bayernr3DEn;
     RK_Bayertnr_Params_V2_Select_t st3DSelect;
     RK_Bayertnr_Fix_V2_t st3DFix;
 } Abayertnr_Manual_Attr_V2_t;
```

<!-- Source EN PDF p.226; unit 2726 -->

【成员】

<!-- Source EN PDF p.226; unit 2727 -->

| 成员名称 | 说明 |
|---|---|
| bayernr3DEn | Bayer3DNR 模块使能开关 |
| st3DSelect | Bayer3DNR 手动模式算法参数值 |
| st3Dfix | Bayer3DNR 手动模式寄存器值 |

<!-- Source EN PDF p.226; unit 2728 -->

9.4.4.13  RK_Bayertnr_Params_V2_t

<!-- Source EN PDF p.226; unit 2729 -->

【说明】定义降噪模块自动模式及各 ISO 对应的算法属性参数。

<!-- Source EN PDF p.226; unit 2730 -->

【定义】

<!-- Source EN PDF p.226; unit 2731 -->

```text
 typedef struct RK_Bayertnr_Params_V2_s
 {
     int enable;
     float iso[RK_BAYERNR_V2_MAX_ISO_NUM];
     //calib
     int   lumapoint[16];
     int   sigma[RK_BAYERNR_V2_MAX_ISO_NUM][16];
     int   lumapoint2[16];
     int   lo_sigma[RK_BAYERNR_V2_MAX_ISO_NUM][16];
     int   hi_sigma[RK_BAYERNR_V2_MAX_ISO_NUM][16];
     //tuning
     int   thumbds[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   lo_enable[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   hi_enable[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   lo_med_en[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   lo_gsbay_en[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   lo_gslum_en[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   hi_med_en[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   hi_gslum_en[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   global_pk_en[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   global_pksq[RK_BAYERNR_V2_MAX_ISO_NUM];
     float lo_filter_strength[RK_BAYERNR_V2_MAX_ISO_NUM];
     float hi_filter_strength[RK_BAYERNR_V2_MAX_ISO_NUM];
     float soft_threshold_ratio[RK_BAYERNR_V2_MAX_ISO_NUM];
     float hi_wgt_comp[RK_BAYERNR_V2_MAX_ISO_NUM];
     float clipwgt[RK_BAYERNR_V2_MAX_ISO_NUM];
     float hidif_th[RK_BAYERNR_V2_MAX_ISO_NUM];
 } RK_Bayertnr_Params_V2_t;
```

<!-- Source EN PDF p.227; unit 2732 -->

【成员】

<!-- Source EN PDF p.228; unit 2733 -->

| 成员名称 | 参数类型 | 说明 |
|---|---|---|
| Enable | 调试参数 | 模块使能开关 |
| iso | 调试参数 | 不同 ISO 档位对应不同调试参数，目前仅支持 13 档。 |
| lumapoint / sigma | 标定参数 | 不同亮度对应的噪声曲线值，共 16 点。lumapoint 对应像素亮度，sigma 对应噪声曲线值。 |
| lumapoint2 / lo_sigma | 标定参数 | 不同亮度对应的噪声曲线值，共 16 点。lumapoint2 对应像素亮度，lo_sigma 对应噪声曲线值。 |
| lumapoint2 / hi_sigma | 标定参数 | 不同亮度对应的噪声曲线值，共 16 点。lumapoint2 对应像素亮度，hi_sigma 对应噪声曲线值。 |
| thumbds | 调试参数 | 降采样比例 |
| lo_enable | 调试参数 | 是否开启低频运动判断：1 开，0 关，默认开启。 |
| hi_enable | 调试参数 | 是否开启高频运动判断：1 开，0 关，默认开启。 |
| lo_med_en | 调试参数 | 内部低频子模块开关：1 开，0 关，默认开启。 |
| lo_gsbay_en | 调试参数 | 内部低频子模块开关：1 开，0 关，默认开启。 |
| lo_gslum_en | 调试参数 | 内部低频子模块开关：1 开，0 关，默认开启。 |
| hi_med_en | 调试参数 | 内部高频子模块开关：1 开，0 关，默认开启。 |
| hi_gslum_en | 调试参数 | 内部高频子模块开关：1 开，0 关，默认开启。 |
| global_pk_en | 调试参数 | 时域降噪是否使用全局 PK：1 使用，0 不使用，目前只能设为 0。 |

<!-- Source EN PDF p.229; unit 2734 -->

| 成员名称 | 参数类型 | 说明 |
|---|---|---|
| global_pksq | 调试参数 | 全局 PK 的平方值，仅 global_pk_en 为 1 时使用。默认 1024，范围 [0, 268435455]。 |
| lo_filter_strength | 调试参数 | 高频运动判断强度，最终影响 hi_sigma，进而影响时域降噪强度。默认 1，范围 [0.0, 16.0]。 |
| hi_filter_strength | 调试参数 | 高频运动判断强度，最终影响 hi_sigma，进而影响时域降噪强度。默认 1，范围 [0.0, 16.0]。 |
| soft_threshold_ratio | 调试参数 | 软阈值权重，越大保留噪声越多，范围 [0.0 1.0]，默认 0。 |
| hi_wgt_comp | 调试参数 | 叠加权重补偿比例系数，仅开启高频时有效；默认 0.16，范围 [0.0, 1.0]。 |
| clipwgt | 调试参数 | 图像叠加权重限制值，默认 0.03215，范围 [0.0, 1.0]。 |
| hidif_th | 调试参数 | 高频差值阈值，默认 32767，范围 [0, 65535]。 |

<!-- Source EN PDF p.229; unit 2735 -->

9.4.4.14  RK_Bayertnr_Params_V2_Select_t

<!-- Source EN PDF p.229; unit 2736 -->

【说明】定义降噪模块手动模式算法属性结构体。

<!-- Source EN PDF p.229; unit 2737 -->

【定义】

<!-- Source EN PDF p.229; unit 2738 -->

```text
 typedef struct RK_Bayertnr_Params_V2_Select_s
 {
     int enable;
     //calib
     int lumapoint[16];
     int sigma[16];
     int lumapoint2[16];
     int lo_sigma[16];
     int hi_sigma[16];
     //tuning
     int thumbds;
     int lo_enable;
     int hi_enable;
     int lo_med_en;
     int lo_gsbay_en;
     int lo_gslum_en;
     int hi_med_en;
     int hi_gslum_en;
     int global_pk_en;
     int global_pksq;
     float lo_filter_strength;
     float hi_filter_strength;
     float soft_threshold_ratio;
     float clipwgt;
     float hi_wgt_comp;
     float hidif_th;
 } RK_Bayertnr_Params_V2_Select_t;
```

<!-- Source EN PDF p.230; unit 2739 -->

【成员】

<!-- Source EN PDF p.231; unit 2740 -->

| 成员名称 | 参数类型 | 说明 |
|---|---|---|
| Enable | 调试参数 | 模块使能开关 |
| lumapoint / sigma | 标定参数 | 不同亮度对应的噪声曲线值，共 16 点。lumapoint 对应像素亮度，sigma 对应噪声曲线值。 |
| lumapoint2 / lo_sigma | 标定参数 | 不同亮度对应的噪声曲线值，共 16 点。lumapoint2 对应像素亮度，lo_sigma 对应噪声曲线值。 |
| lumapoint2 / hi_sigma | 标定参数 | 不同亮度对应的噪声曲线值，共 16 点。lumapoint2 对应像素亮度，hi_sigma 对应噪声曲线值。 |
| thumbds | 调试参数 | 降采样比例 |
| lo_enable | 调试参数 | 是否开启低频运动判断：1 开，0 关，默认开启。 |
| hi_enable | 调试参数 | 是否开启高频运动判断：1 开，0 关，默认开启。 |
| lo_med_en | 调试参数 | 内部低频子模块开关：1 开，0 关，默认开启。 |
| lo_gsbay_en | 调试参数 | 内部低频子模块开关：1 开，0 关，默认开启。 |
| lo_gslum_en | 调试参数 | 内部低频子模块开关：1 开，0 关，默认开启。 |
| hi_med_en | 调试参数 | 内部高频子模块开关：1 开，0 关，默认开启。 |
| hi_gslum_en | 调试参数 | 内部高频子模块开关：1 开，0 关，默认开启。 |
| global_pk_en | 调试参数 | 时域降噪是否使用全局 PK：1 使用，0 不使用，目前只能设为 0。 |
| global_pksq | 调试参数 | 全局 PK 的平方值，仅 global_pk_en 为 1 时使用。默认 1024，范围 [0, 268435455]。 |

<!-- Source EN PDF p.232; unit 2741 -->

| 成员名称 | 参数类型 | 说明 |
|---|---|---|
| lo_filter_strength | 调试参数 | 高频运动判断强度，最终影响 hi_sigma，进而影响时域降噪强度。默认 1，范围 [0.0, 16.0]。 |
| hi_filter_strength | 调试参数 | 高频运动判断强度，最终影响 hi_sigma，进而影响时域降噪强度。默认 1，范围 [0.0, 16.0]。 |
| soft_threshold_ratio | 调试参数 | 软阈值权重，越大保留噪声越多，范围 [0.0 1.0]，默认 0。 |
| hi_wgt_comp | 调试参数 | 叠加权重补偿比例系数，仅开启高频时有效；默认 0.16，范围 [0.0, 1.0]。 |
| clipwgt | 调试参数 | 图像叠加权重限制值，默认 0.03215，范围 0.0–1.0。 |
| hidif_th | 调试参数 | 高频差值阈值，默认 32767，范围 0–65535。 |

<!-- Source EN PDF p.232; unit 2742 -->

9.4.4.15  RK_Bayertnr_Params_V23_Select_t

<!-- Source EN PDF p.232; unit 2743 -->

【说明】定义降噪模块手动模式算法属性结构体。

<!-- Source EN PDF p.232; unit 2744 -->

【定义】

<!-- Source EN PDF p.232; unit 2745 -->

```text
 typedef struct RK_Bayertnr_Params_V23_Select_s
 {
     int enable;
     //calib
     int lumapoint[16];
     int sigma[16];
     int lumapoint2[16];
     int lo_sigma[16];
     int hi_sigma[16];
     //tuning
     int thumbds_w;
     int thumbds_h;
     int lo_enable;
     int hi_enable;
     int lo_med_en;
     int lo_gsbay_en;
     int lo_gslum_en;
     int hi_med_en;
     int hi_gslum_en;
     int trans_en;
     int wgt_use_mode;
     int wgt_mge_mode;
     int hi_guass;
     int kl_guass;
     bool global_pk_en;
     int global_pksq;
     float lo_filter_strength;
     float hi_filter_strength;
     float soft_threshold_ratio;
     float lo_clipwgt;
     float hi_wgt_comp;
     int   hidif_th;
     float lo_filter_rat0;
     int   lo_filter_thed0;
     int hi_filter_abs_ctrl;
     int hi_filter_filt_bay;
     int hi_filter_filt_avg;
     int hi_filter_filt_mode;
     float hi_filter_rat0;
     int   hi_filter_thed0;
     float hi_filter_rat1;
     int   hi_filter_thed1;
```

<!-- Source EN PDF p.233; unit 2746 -->

```text
     int   guass_guide_coeff0;
     int   guass_guide_coeff1;
     int   guass_guide_coeff2;
     int   guass_guide_coeff3;
 } RK_Bayertnr_Params_V23_Select_t;
```

<!-- Source EN PDF p.233; unit 2747 -->

【成员】

<!-- Source EN PDF p.234; unit 2748 -->

| 成员名称 | 参数类型 | 说明 |
|---|---|---|
| Enable | 调试参数 | 模块使能开关 |
| lumapoint / sigma | 标定参数 | 不同亮度对应的噪声曲线值，共 16 点。LumaPoint 对应像素亮度，Sigma 对应噪声曲线值。 |
| lumapoint2 / lo_sigma | 标定参数 | 不同亮度对应的噪声曲线值，共 16 点。lumapoint2 对应像素亮度，lo_sigma 对应噪声曲线值。 |
| lumapoint2 / hi_sigma | 标定参数 | 不同亮度对应的噪声曲线值，共 16 点。lumapoint2 对应像素亮度，hi_sigma 对应噪声曲线值。 |
| thumbds_w thumbds_h | 调试参数 | 降采样比例目前仅支持 4x4、8x4、8x8 三种模式，默认 8x4。 |
| lo_enable | 调试参数 | 是否开启低频运动判断：1 开，0 关，默认开启。 |
| hi_enable | 调试参数 | 是否开启高频运动判断：1 开，0 关，默认开启。 |
| lo_med_en | 调试参数 | 内部低频子模块开关：1 开，0 关，默认开启。 |
| lo_gsbay_en | 调试参数 | 内部低频子模块开关：1 开，0 关，默认开启。 |
| lo_gslum_en | 调试参数 | 内部低频子模块开关：1 开，0 关，默认开启。 |
| hi_med_en | 调试参数 | 内部高频子模块开关：1 开，0 关，默认开启。 |
| hi_gslum_en | 调试参数 | 内部高频子模块开关：1 开，0 关，默认开启。 |
| global_pk_en | 调试参数 | 时域降噪是否使用全局 PK：1 使用，0 不使用，目前只能设为 0。 |
| global_pksq | 调试参数 | 全局 PK 的平方值，仅 global_pk_en 为 1 时使用。默认 1024，范围 [0, 268435455]。 |

<!-- Source EN PDF p.235; unit 2749 -->

| 成员名称 | 参数类型 | 说明 |
|---|---|---|
| lo_filter_strength | 调试参数 | 高频运动判断强度，最终影响 hi_sigma，进而影响时域降噪强度。默认 1，范围 [0.0, 16.0]。 |
| hi_filter_strength | 调试参数 | 高频运动判断强度，最终影响 hi_sigma，进而影响时域降噪强度。默认 1，范围 [0.0, 16.0]。 |
| soft_threshold_ratio | 调试参数 | 软阈值权重，越大保留噪声越多，范围 [0.0 1.0]，默认 0。 |
| hi_wgt_comp | 调试参数 | 叠加权重补偿比例系数，仅开启高频时有效；默认 0.16，范围 [0.0, 1.0]。 |
| lo_clipwgt | 调试参数 | 图像叠加权重限制值，默认 0.03215，范围 [0.0, 1.0]。 |
| hidif_th | 调试参数 | 高频差值阈值，默认 32767，范围 [0, 65535]。 |
| trans_en | 调试参数 | 是否启用带宽节省：0 不启用，1 启用。线性模式可设置，HDR 模式建议为 0。 |
| wgt_use_mode | 调试参数 | 权重融合时是否开启优化：0 不启用，1 启用。 |
| wgt_mge_mode | 调试参数 | 高频权重计算优化：0 不启用，1 启用。 |
| hi_guass | 调试参数 | 高频 SIGMA 使用滤波数据还是原始未滤波数据：0 原始，1 滤波。 |
| kl_guass | 调试参数 | PK sigma 查找使用滤波数据还是原始未滤波数据：0 原始，1 滤波。 |
| lo_filter_rat0 | 调试参数 | 计算低频运动判断权重时，差值需减去的数据比例参数。范围 [0.0, 16.0]，默认 1。 |
| lo_filter_thed0 | 调试参数 | 计算低频运动判断权重时，从差值中减去的数据偏移参数。范围 [0, 4095]，默认 0。 |

<!-- Source EN PDF p.236; unit 2750 -->

| 成员名称 | 参数类型 | 说明 |
|---|---|---|
| hi_filter_rat0 | 调试参数 | 计算高频运动第一权重时需减去的数据比例，范围 [0.0, 16.0]，默认 1。 |
| hi_filter_thed0 | 调试参数 | 计算高频运动判断第一权重时，从差值中减去的数据偏移，范围 [0, 4095]，默认 256。 |
| hi_filter_rat1 | 调试参数 | 计算高频运动判断第二权重时，从差值中减去的数据比例，范围 [0.0, 16.0]，默认 1。 |
| hi_filter_thed1 | 调试参数 | 计算高频运动判断第二权重时，从差值中减去的数据偏移，范围 [0, 4095]，默认 1024。 |
| hi_filter_abs_ctrl | 调试参数 | 高频权重计算中取绝对值的位置：0 差值→中值→高斯→abs；1 差值→中值→abs→高斯。默认 0。 |
| hi_filter_filt_bay | 调试参数 | 计算高频权重时，高斯滤波是否分别计算 Bayer 四通道：1 分开计算，各通道做 3x3 高斯；0 不分通道，做 5x7 高斯。默认 0。 |
| hi_filter_filt_avg | 调试参数 | 计算高频权重时是否启用 5x5 滤波：0 不开，1 开，默认 0。 |
| hi_filter_filt_mode | 调试参数 | 计算高频权重的滤波模式，范围 [0, 4]，默认 4。 |
| guass_guide_coeff0 | 调试参数 | 高斯滤波算子，范围 [0, 64]，默认 16,8,16,8。 |

<!-- Source EN PDF p.236; unit 2751 -->

9.4.4.16  RK_Bayertnr_Fix_V2_t

<!-- Source EN PDF p.236; unit 2752 -->

【说明】定义降噪模块手动模式寄存器配置。

<!-- Source EN PDF p.236; unit 2753 -->

【定义】

<!-- Source EN PDF p.237; unit 2754 -->

```text
 typedef struct RK_Bayertnr_Fix_V2_s {
     // BAY3D_BAY3D_CTRL 0x2c00
     uint8_t bay3d_exp_sel;
     uint8_t bay3d_soft_st;
     uint8_t bay3d_soft_mode;
     uint8_t bay3d_bwsaving_en;
     uint8_t bay3d_loswitch_protect;
     uint8_t bay3d_glbpk_en;
     uint8_t bay3d_logaus3_bypass_en;
     uint8_t bay3d_logaus5_bypass_en;
     uint8_t bay3d_lomed_bypass_en;
     uint8_t bay3d_hichnsplit_en;
     uint8_t bay3d_hiabs_pssel;
     uint8_t bay3d_higaus_bypass_en;
     uint8_t bay3d_himed_bypass_en;
     uint8_t bay3d_lobypass_en;
     uint8_t bay3d_hibypass_en;
     uint8_t bay3d_bypass_en;
     uint8_t bay3d_en_i;
     // BAY3D_BAY3D_KALRATIO 0x2c04
     uint16_t bay3d_softwgt;
     uint16_t bay3d_hidif_th;
     // BAY3D_BAY3D_GLBPK2 0x2c08
     uint32_t bay3d_glbpk2;
     // BAY3D_BAY3D_WGTLMT 0x2c10
     uint16_t bay3d_wgtlmt;
     uint16_t bay3d_wgtratio;
     // BAY3D_BAY3D_SIG_X0  0x2c14 - 0x2c30
     uint16_t bay3d_sig0_x[16];
     // BAY3D_BAY3D_SIG0_Y0 0x2c34 - 0x2c50
     uint16_t bay3d_sig0_y[16];
     // BAY3D_BAY3D_SIG_X0  0x2c54 - 0x2c70
     uint16_t bay3d_sig1_x[16];
     // BAY3D_BAY3D_SIG1_Y0 0x2c74 - 0x2c90
     uint16_t bay3d_sig1_y[16];
     // BAY3D_BAY3D_SIG2_Y0 0x2c94 - 0x2cb0
     uint16_t bay3d_sig2_y[16];
     //BAY3D_BAY3D_LODIF_STAT0 0x2cb4 -0x2cb8
     uint64_t ro_sum_lodif;
     //BAY3D_BAY3D_LODIF_STAT0 0x2cbc -0x2cc0
     uint64_t ro_sum_hidif0;
     //BAY3D_BAY3D_MI_ST 0x2CC8
     uint8_t sw_bay3dmi_st_linemode;
     uint8_t sw_bay3d_mi2cur_linecnt;
 } RK_Bayertnr_Fix_V2_t;
```

<!-- Source EN PDF p.238; unit 2755 -->

【成员】

<!-- Source EN PDF p.239; unit 2756 -->

| 参数 | 位宽 | 参数说明 |
|---|---|---|
| bay3d_soft_st | 1 | 软件模式启动脉冲位，启动时写 1。 |
| bay3d_soft_mode | 1 | 软件模式使能位：1 开，0 关，默认 0x0。 |
| bay3d_bwsaving_en | 1 | 带宽优化使能位，仅非 HDR 有效：1 开，0 关，默认 0x0。 |
| bay3d_loswitch_protect | 1 | 目前不支持。 |
| bay3d_glbpk_en | 1 | Bayer 时域降噪是否使用全局 PK：1 全局 PK，0 局部 PK，默认 1。 |
| bay3d_logaus3_bypass_en | 1 | 低频是否在后级亮度域做高斯滤波：1 不做，0 做，默认 0x0。 |
| bay3d_logaus5_bypass_en | 1 | 低频是否在前级 Bayer 域做高斯滤波：1 不做，0 做，默认 0x0。 |
| bay3d_lomed_bypass_en | 1 | 低频是否做中值滤波：1 不做，0 做，默认 0x0。 |
| bay3d_hichnsplit_en | 1 | 高频判断的高斯滤波域选择，仅开启高频运动判断时开启此位；1 Bayer 域，0 亮度域，默认 0x0。 |

<!-- Source EN PDF p.240; unit 2757 -->

| 参数 | 位宽 | 参数说明 |
|---|---|---|
| bay3d_hiabs_pssel | 1 | 高频判断中是否先取绝对值再做高斯滤波，仅开启高频运动判断时启用此位；1 做，0 不做，默认 0x0。 |
| bay3d_higaus_bypass_en | 1 | 高频是否做高斯滤波：1 不做，0 做，默认 0x0。 |
| bay3d_himed_bypass_en | 1 | 高频是否做中值滤波：1 不做，0 做，默认 0x0。 |
| bay3d_lobypass_en | 1 | 高频运动判断开关：1 关，0 开，默认 0x0。目前不支持动态修改，此位始终默认为 0。 |
| bay3d_hibypass_en | 1 | 高频运动判断开关：1 关，0 开，默认 0x0。 |
| bay3d_bypass_en | 1 | Bayer 时域降噪旁路使能：1 开旁路，等效 Bayer3D 不处理；0 关旁路。默认 0。 |
| bay3d_en_i | 1 | Bayer 时域降噪使能：1 开启，0 关闭，默认 0。 |
| bay3d_softwgt | 10 | 软阈值权重，越大阈值越大、保留噪声越多。小数 10bit，默认 0x100。 |
| bay3d_hidif_th | 16 | 统计高频差值数量的阈值，默认 0xffff。 |
| bay3d_glbpk2 | 28 | 全局 PK 平方值，仅 pk_en 为 0 时使用，默认 0x800。 |
| bay3d_wgtlmt | 10 | 图像叠加权重限制值，小数 10 位，默认 0x380。 |

<!-- Source EN PDF p.241; unit 2758 -->

| 参数 | 位宽 | 参数说明 |
|---|---|---|
| bay3d_wgtratio | 10 | 叠加权重补偿比例系数，仅开启高频时有效；小数 10 位，默认 0x0。 |
| bay3d_sig0_x0-15 | 16 | 噪声曲线 16 个亮度等级，配置应保证两值之差为 2 的幂。 |
| bay3d_sig0_y0-15 | 14 | 噪声曲线的 16 个 sigma 等级，配置参数来自标定。 |
| bay3d_sig1_x0-15 | 16 | 高低频噪声曲线 16 个亮度等级，配置应保证两值之差为 2 的幂。 |
| bay3d_sig1_y0-15 | 14 | 高频噪声曲线 16 个 SIGMA 等级，参数由标定获得。 |
| bay3d_sig2_y0-15 | 14 | 低频噪声曲线 16 个 sigma 等级，参数由标定获得。 |

<!-- Source EN PDF p.241; unit 2759 -->

9.4.4.17  rk_aiq_bayertnr_strength_v2_t

<!-- Source EN PDF p.241; unit 2760 -->

【说明】定义降噪模块降噪强度配置结构体。

<!-- Source EN PDF p.241; unit 2761 -->

【定义】

<!-- Source EN PDF p.241; unit 2762 -->

```text
 typedef struct rk_aiq_bayertnr_strength_v2_s {
     rk_aiq_uapi_sync_t sync;
     float percent;
 } rk_aiq_bayertnr_strength_v2_t;
```

<!-- Source EN PDF p.241; unit 2763 -->

【成员】

<!-- Source EN PDF p.241; unit 2764 -->

| 成员名称 | 说明 |
|---|---|
| sync | 同步/异步模式选择，见概述/API 说明部分。 |
| percent | 降噪强度，范围 0.0–1.0。 |

<!-- Source EN PDF p.241; unit 2765 -->

9.4.4.18  rk_aiq_ynr_attrib_v3_t

<!-- Source EN PDF p.241; unit 2766 -->

【说明】定义降噪模块参数。

<!-- Source EN PDF p.241; unit 2767 -->

【定义】

<!-- Source EN PDF p.242; unit 2768 -->

```text
 typedef struct rk_aiq_ynr_attrib_v3_s {
     rk_aiq_uapi_sync_t sync;
     Aynr_OPMode_V3_t eMode;
     Aynr_Auto_Attr_V3_t stAuto;
     Aynr_Manual_Attr_V3_t stManual;
 } rk_aiq_ynr_attrib_v3_t;
```

<!-- Source EN PDF p.242; unit 2769 -->

【成员】

<!-- Source EN PDF p.242; unit 2770 -->

| 成员名称 | 说明 |
|---|---|
| sync | 同步/异步模式选择，见概述/API 说明部分。 |
| eMode | YNR 降噪模块模式 |
| stAuto | YNR 降噪模块自动模式参数 |
| stManual | YNR 降噪模块手动模式参数 |

<!-- Source EN PDF p.242; unit 2771 -->

9.4.4.19  Aynr_OPMode_V3_t

<!-- Source EN PDF p.242; unit 2772 -->

【说明】定义降噪模块模式。

<!-- Source EN PDF p.242; unit 2773 -->

【定义】

<!-- Source EN PDF p.242; unit 2774 -->

```text
 typedef enum Aynr_OPMode_V3_e {
     AYNRV3_OP_MODE_INVALID           = 0,
     AYNRV3_OP_MODE_AUTO              = 1,
     AYNRV3_OP_MODE_MANUAL            = 2,
     AYNRV3_OP_MODE_REG_MANUAL        = 3,
     AYNRV3_OP_MODE_MAX
 } Aynr_OPMode_V3_t;
```

<!-- Source EN PDF p.242; unit 2775 -->

【成员】

<!-- Source EN PDF p.242; unit 2776 -->

| 成员名称 | 说明 |
|---|---|
| AYNRV3_OP_MODE_INVALID | Y 域 YNR 降噪模块无效模式 |
| AYNRV3_OP_MODE_AUTO | Y 域 YNR 降噪模块自动模式 |
| AYNRV3_OP_MODE_MANUAL | Y 域 YNR 降噪模块手动模式算法设置 |
| AYNRV3_OP_MODE_REG_MANUAL | Y 域 YNR 降噪模块手动模式寄存器设置 |
| AYNRV3_OP_MODE_MAX | Y 域 YNR 模块模式最大值，为无效模式。 |

<!-- Source EN PDF p.243; unit 2777 -->

9.4.4.20  Aynr_Auto_Attr_V3_t

<!-- Source EN PDF p.243; unit 2778 -->

【说明】定义降噪模块自动属性。

<!-- Source EN PDF p.243; unit 2779 -->

【定义】

<!-- Source EN PDF p.243; unit 2780 -->

```text
 typedef struct Aynr_Auto_Attr_V3_s
 {
     RK_YNR_Params_V3_t stParams;
     RK_YNR_Params_V3_Select_t stSelect;
 } Aynr_Auto_Attr_V3_t;
```

<!-- Source EN PDF p.243; unit 2781 -->

【成员】

<!-- Source EN PDF p.243; unit 2782 -->

| 成员名称 | 说明 |
|---|---|
| stParams | YNR 各 ISO 对应的算法属性参数 |
| stSelect | YNR 模块计算后的属性参数 |

<!-- Source EN PDF p.243; unit 2783 -->

9.4.4.21  Aynr_Manual_Attr_V3_t

<!-- Source EN PDF p.243; unit 2784 -->

【说明】定义降噪模块手动属性。

<!-- Source EN PDF p.243; unit 2785 -->

【定义】

<!-- Source EN PDF p.243; unit 2786 -->

```text
 typedef struct Aynr_Manual_Attr_V3_s
 {
     RK_YNR_Params_V3_Select_t stSelect;
     RK_YNR_Fix_V3_t stFix;
 } Aynr_Manual_Attr_V3_t;
```

<!-- Source EN PDF p.243; unit 2787 -->

【成员】

<!-- Source EN PDF p.243; unit 2788 -->

| 成员名称 | 说明 |
|---|---|
| stSelect | 算法参数值 |
| stFix | YNNR 寄存器值 |

<!-- Source EN PDF p.243; unit 2789 -->

9.4.4.22  RK_YNR_Params_V3_t

<!-- Source EN PDF p.243; unit 2790 -->

【说明】定义 YNR 自动模式各 ISO 对应的算法属性参数。

<!-- Source EN PDF p.243; unit 2791 -->

【定义】

<!-- Source EN PDF p.244; unit 2792 -->

```text
 typedef struct RK_YNR_Params_V3_s
 {
     int enable;
     char version[64];
     float iso[RK_YNR_V3_MAX_ISO_NUM];
     RK_YNR_Params_V3_Select_t arYnrParamsISO[RK_YNR_V3_MAX_ISO_NUM];
 } RK_YNR_Params_V3_t;
```

<!-- Source EN PDF p.244; unit 2793 -->

【成员】

<!-- Source EN PDF p.244; unit 2794 -->

| 成员名称 | 说明 |
|---|---|
| enable | YNR 模块使能开关 |
| 版本 | YNR 模块版本号 |
| iso | 不同 ISO 档位对应不同调试参数，目前只支持 13 档。 |
| RK_YNR_Params_V3_Select_t | YYNR 模块算法参数 |

<!-- Source EN PDF p.244; unit 2795 -->

9.4.4.23  RK_YNR_Params_V3_Select_t

<!-- Source EN PDF p.244; unit 2796 -->

【说明】定义降噪模块手动模式算法属性。

<!-- Source EN PDF p.244; unit 2797 -->

【定义】

<!-- Source EN PDF p.244; unit 2798 -->

```text
 typedef struct RK_YNR_Params_V3_Select_s
 {
     int enable;
     float lci;
     float hci;
     float sigma[YNR_V3_ISO_CURVE_POINT_NUM];
     short lumaPoint[YNR_V3_ISO_CURVE_POINT_NUM];
     float lo_lumaPoint[6];
     float lo_ratio[6];
     float hi_lumaPoint[6];
     float hi_ratio[6];
     // low frequency
     float rnr_strength[17];
     int ynr_bft3x3_bypass;
     int ynr_lbft5x5_bypass;
     int ynr_lgft3x3_bypass;
     int ynr_flt1x1_bypass;
     int ynr_sft5x5_bypass;
     float low_bf1;
     float low_bf2;
     float low_thred_adj;
     float low_peak_supress;
     float low_edge_adj_thresh;
     float low_lbf_weight_thresh;
     float low_center_weight;
     float low_dist_adj;
     float low_weight;
     float low_filt1_strength;
     float low_filt2_strength;
     float low_bi_weight;
```

<!-- Source EN PDF p.245; unit 2799 -->

```text
     // high frequency
     float base_filter_weight1;
     float base_filter_weight2;
     float base_filter_weight3;
     float high_thred_adj;
     float high_weight;
     float high_direction_weight[8];
     float hi_min_adj;
     float hi_edge_thed;
     //local gain control
     float ynr_global_gain_alpha;
     float ynr_global_gain;
     float ynr_adjust_thresh;
     float ynr_adjust_scale;
 } RK_YNR_Params_V3_Select_t;
```

<!-- Source EN PDF p.245; unit 2800 -->

【成员】

<!-- Source EN PDF p.246; unit 2801 -->

| 成员名称 | 参数类型 | 说明 |
|---|---|---|
| enable | 调试参数 | YNR 使能开关：1 开，0 关。 |
| lci | 标定数据 | 低频噪声 sigma 影响因子，越大则 sigma 越大、降噪越强。 |
| hci | 标定数据 | 高频噪声 sigma 影响因子，越大则 sigma 越大、降噪越强。 |
| sigma | 标定数据 | 噪声 sigma 曲线。 |
| lumaPoint | 标定数据 | 不同像素亮度对应不同噪声 SIGMA 曲线点，共 16 点。 |
| rnr_strength | 调试参数 | 以图像中心为圆心，沿半径 r 设置不同降噪强度，主要针对 LSC 噪声。范围 [0, 16.0]，默认 1。 |
| ynr_bft3x3_bypass | 调试参数 | 内部子模块旁路：0 功能启用，1 旁路。通常启用全部子模块，这些值均设为 0。 |
| ynr_lbft5x5_bypass | 调试参数 | 内部子模块旁路：0 功能启用，1 旁路。通常启用全部子模块，这些值均设为 0。 |
| ynr_lgft3x3_bypass | 调试参数 | 内部子模块旁路：0 功能启用，1 旁路。通常启用全部子模块，这些值均设为 0。 |
| ynr_flt1x1_bypass | 调试参数 | 内部子模块旁路：0 功能启用，1 旁路。通常启用全部子模块，这些值均设为 0。 |

<!-- Source EN PDF p.247; unit 2802 -->

| 成员名称 | 参数类型 | 说明 |
|---|---|---|
| ynr_sft5x5_bypass | 调试参数 | 内部子模块旁路：0 功能启用，1 旁路。通常启用全部子模块，这些值均设为 0。 |
| low_bf1 | 调试参数 | 原图 3x3 双边滤波强度，越大降噪越强。范围 [0.01, 32]，默认 1。 |
| low_bf2 | 调试参数 | 前帧小图 5x5 双边滤波强度，越大降噪越强。范围 [0.01, 32]，默认 1。 |
| low_thred_adj | 调试参数 | 低频软阈值越大，低频降噪越强。范围 [0, 31]，默认 0.5。 |
| low_peak_supress | 调试参数 | 孤立噪声去除强度，越小降噪越强。范围 [0, 1]，默认 0.5。 |
| low_edge_adj_thresh | 调试参数 | 小图边缘检测调整因子阈值，限制调整因子最大值。越小降噪越强、图像越模糊。整数范围 [0, 1023]，默认 7。 |
| low_lbf_weight_thresh | 调试参数 | 限制 5x5 双边滤波权重，越大低频降噪越弱。范围 [0.0, 1.0]，默认 0.25。 |
| low_center_weight | 调试参数 | 5x5 双边滤波中心点权重，越小降噪越强。范围 [0,1]，默认 0.5。 |
| low_dist_adj | 调试参数 | 双边滤波距离权重调整因子，越小降噪越强。范围 [0, 127.0]，默认 8.0。 |
| low_weight | 调试参数 | 低频降噪结果权重，越大低频降噪越强。范围 [0, 1]，默认 0.5。 |

<!-- Source EN PDF p.248; unit 2803 -->

| 成员名称 | 参数类型 | 说明 |
|---|---|---|
| low_filt1_strength | 调试参数 | 原图高斯滤波核权重，范围 [0,1.0]，默认 0.7。 |
| low_filt2_strength | 调试参数 | 双边滤波结果的高斯滤波核权重，范围 [0,1.0]，默认 0.85。 |
| low_bi_weight | 调试参数 | 软阈值处理使用的第一次双边滤波权重，越大降噪越强。范围 [0, 1]，默认 0.3。 |
| base_filter_weight1 | 调试参数 | 方向滤波器系数，通常很少需要调整。 |
| high_thred_adj | 调试参数 | 越大高频降噪越强。范围 0–31.0，默认 1.0。 |
| high_weight | 调试参数 | 高频降噪权重，表示保留高频分量比例，越小降噪越强。范围 0–1，默认 0.78。 |
| high_direction_weight | 调试参数 | 某方向值越大，沿该方向降噪越强。 |
| hi_min_adj | 调试参数 | 全部方差减去最小方差的比例，越大边缘越锐利。范围 0.0–1.0，默认 0.9。 |
| hi_edge_thed | 调试参数 | 阈值越小，高频降噪越强。整数范围为 0、255，默认值 100。 |
| ynr_global_gain_alpha | 调试参数 | YNR 降噪局部模式与全局模式的插值强度配置。通常使用默认值，无需配置，全部采用局部增益方式。范围 [0.0 1.0]，默认值 0。 |
| ynr_global_gain | 调试参数 | YNR 降噪局部模式与全局模式的插值强度配置。通常使用默认值，无需配置，全部采用局部增益方式。增益范围 [0.0 64.0]，默认值 1。 |

<!-- Source EN PDF p.249; unit 2804 -->

| 成员名称 | 参数类型 | 说明 |
|---|---|---|
| ynr_adjust_thresh | 调试参数 | 控制噪声大于 ynr_adjust_thresh 阈值时的降噪强度。运动区域噪声较大，设置适当阈值可增强运动区域的 YNR 降噪。范围 [0.0, 1.0]，默认值 1。 |
| ynr_adjust_scale | 调试参数 | 控制噪声大于 ynr_adjust_thresh 阈值时的降噪强度。运动区域噪声较大，设置适当阈值可增强运动区域的 YNR 降噪。范围 [0, 16.0]，默认值 1。 |
| lo_lumaPoint / lo_ratio | 调试参数 | 针对不同像素亮度，微调低频 Sigma。 |
| hi_lumaPoint / hi_ratio | 调试参数 | 针对不同像素亮度，微调高频 Sigma。 |

<!-- Source EN PDF p.249; unit 2805 -->

9.4.4.24  RK_YNR_Fix_V3_t

<!-- Source EN PDF p.249; unit 2806 -->

【说明】定义降噪模块手动模式寄存器配置。

<!-- Source EN PDF p.249; unit 2807 -->

【定义】

<!-- Source EN PDF p.249; unit 2808 -->

```text
 typedef struct RK_YNR_Fix_V3_s {
     // YNR_2700_GLOBAL_CTRL (0x0000)
     uint8_t ynr_rnr_en;
     uint8_t ynr_gate_dis;
     uint8_t ynr_thumb_mix_cur_en;
     uint8_t ynr_global_gain_alpha;
     uint16_t ynr_global_gain;
     uint8_t ynr_flt1x1_bypass_sel;
     uint8_t ynr_sft5x5_bypass;
     uint8_t ynr_flt1x1_bypass;
     uint8_t ynr_lgft3x3_bypass;
     uint8_t ynr_lbft5x5_bypass;
     uint8_t ynr_bft3x3_bypass;
     uint8_t ynr_en;
```

<!-- Source EN PDF p.249; unit 2809 -->

```text
     // YNR_2700_RNR_MAX_R  (0x0004)
     uint8_t ynr_local_gainscale;
     uint16_t ynr_rnr_max_r;
     // YNR_2700_RNR_MAX_R  (0x0008)
     uint16_t ynr_rnr_center_coorv;
     uint16_t ynr_rnr_center_coorh;
     // YNR_2700_RNR_MAX_R  (0x000c)
     uint8_t ynr_localgain_adj;
     uint16_t ynr_localgain_adj_thresh;
     // YNR_2700_LOWNR_CTRL0 (0x0010)
     uint16_t ynr_low_bf_inv[2];
     // YNR_2700_LOWNR_CTRL1  (0x0014)
     uint8_t ynr_low_peak_supress;
     uint16_t ynr_low_thred_adj;
     // YNR_2700_LOWNR_CTRL2 (0x0018)
     uint16_t ynr_low_dist_adj;
     uint16_t ynr_low_edge_adj_thresh;
     // YNR_2700_LOWNR_CTRL3 (0x001c)
     uint8_t ynr_low_bi_weight;
     uint8_t ynr_low_weight;
     uint16_t ynr_low_center_weight;
     // YNR_2700_HIGHNR_CTRL0 (0x0020)
     uint8_t ynr_hi_min_adj;
     uint16_t ynr_high_thred_adj;
     // YNR_2700_HIGHNR_CTRL1  (0x0024)
     uint8_t ynr_high_retain_weight;
     uint8_t ynr_hi_edge_thed;
     // YNR_2700_HIGHNR_BASE_FILTER_WEIGHT  (0x0028)
     uint8_t ynr_base_filter_weight[3];
     // YNR_2700_HIGHNR_BASE_FILTER_WEIGHT  (0x002c)
     uint32_t ynr_frame_full_size;
     uint16_t ynr_lbf_weight_thres;
     // YNR_2700_GAUSS1_COEFF  (0x0030)
     uint16_t ynr_low_gauss1_coeff[3];
     // YNR_2700_GAUSS2_COEFF  (0x0034)
     uint16_t ynr_low_gauss2_coeff[3];
     // YNR_2700_DIRECTION_W_0_3  (0x0038 - 0x003c)
     uint8_t ynr_direction_weight[8];
     // YNR_2700_SGM_DX_0_1 (0x0040 - 0x0060)
     uint16_t ynr_luma_points_x[17];
     // YNR_2700_LSGM_Y_0_1 (0x0070- 0x0090)
     uint16_t ynr_lsgm_y[17];
     // YNR_2700_HSGM_Y_0_1 (0x00a0- 0x00c0)
     uint16_t ynr_hsgm_y[17];
     // YNR_2700_RNR_STRENGTH03 (0x00d0- 0x00e0)
     uint16_t ynr_rnr_strength[17];
 } RK_YNR_Fix_V3_t;
```

<!-- Source EN PDF p.251; unit 2810 -->

【成员】

<!-- Source EN PDF p.252; unit 2811 -->

| 成员名称 | 位宽（整数位.小数位） | 说明 |
|---|---|---|
| ynr_low_bf_inv[0] | 5.9 | 控制降噪强度。注意配置的是该值的倒数，因此值越小，降噪越强。512 表示 1 倍降噪强度，256 表示 2 倍。范围 [1, 16383]。 |
| ynr_low_bf[1] | 5.9 | 控制降噪强度。注意该寄存器配置值取倒数，因此值越小，降噪越强。512 表示 1 倍降噪，256 表示 2 倍降噪。 |
| ynr_low_thred_adj | 5.6 | 低频软阈值的调整强度；值越大，低频降噪越强。范围 [0, 2047]。 |
| ynr_low_peak_supress | 1.7 | 控制大幅孤立噪声的去除强度；值越大，去除越强。范围 [0, 128]。 |
| ynr_low_edge_adj_thresh | 11.0 | 小图边缘检测调整因子的阈值，用于限制该因子的最大值。范围 [1, 1024]。 |
| ynr_low_center_weight | 1.10 | 5x5 双边滤波的中心点权重；值越小，降噪越强。范围 [1, 1024]。 |
| sw_ynr_lbf_weight_thres | 10.0 | 用于限制 5x5 双边滤波值的权重；值越大，低频降噪越弱。范围 [0, 1023]。 |
| ynr_low_dist_adj | 7.2 | 双边滤波距离权重调整因子。范围 [1, 511]。 |
| ynr_low_weight | 1.7 | 低频降噪结果的权重；值越大，低频降噪越强。范围 [0, 128]。 |
| ynr_low_gauss1_coeff[3] | 1.8 | 原图高斯滤波的滤波核权重，范围 [0, 256]。 |
| ynr_low_gauss2_coeff[3] | 1.8 | 对双边滤波结果进行高斯滤波时的高斯滤波核权重，范围 [0, 256]。 |

<!-- Source EN PDF p.253; unit 2812 -->

| 成员名称 | 位宽（整数位.小数位） | 说明 |
|---|---|---|
| ynr_low_bi_weight | 1.7 | 软阈值处理中第一次双边滤波的权重；值越大，降噪越强。范围 [0, 128]。 |
| ynr_base_filter_weight[3] | 1.6 | 方向滤波器系数。范围 [0, 64]。 |
| ynr_high_thred_adj | 5.6 | 值越大，高频降噪越强。范围 [0, 2047]。 |
| ynr_high_retain_weight | 1.7 | 高频降噪权重。注意该值表示保留的高频分量比例，因此值越大，降噪越弱。范围 [0, 128]。 |
| ynr_direction_weight[8] | 1.4 | 某方向的值越大，沿该方向的降噪越强。范围 [0,16]。 |
| ynr_hi_min_adj | 0.6 | 所有方差值减去最小方差值的比率；值越大，边缘越锐利。范围 [6,60]。 |
| ynr_hi_edge_thed | 10.0 | 阈值越小，高频降噪越强。范围 [0,1023]。 |
| ynr_rnr_max_r | 14.0 | 用于调整径向降噪强度，存储 1/((rows/2)^2+(cols/2)^2) 的值；前 9 位为尾数 M，后 5 位为指数 E。范围 [1, 16383]。 |
| ynr_rnr_strength[17] | 4.4 | 控制径向降噪强度，共 17 个数据点，分为 16 段，表示从图像中心到四角的降噪强度。范围 [0, 15]。 |
| ynr_global_gain | 6.4 | 外部配置的全局增益控制 YNR 整体降噪强度；值越大，降噪越强。范围 [0, 1023]。 |

<!-- Source EN PDF p.254; unit 2813 -->

| 成员名称 | 位宽（整数位.小数位） | 说明 |
|---|---|---|
| ynr_global_gain_alpha | 1.3 | 控制增益模块传入的增益与外部配置增益的比例；值越大，使用的外部全局增益越多。范围 [0, 8]。 |
| ynr_bft3x3_bypass | 1 | 设为 1 时关闭 3x3 双边滤波。取值 0 或 1。 |
| ynr_lbft5x5_bypass | 1 | 设为 1 时关闭 5x5 双边滤波。取值 0 或 1。 |
| ynr_lgft3x3_bypass | 1 | 为 1 时关闭 3x3 高斯滤波。 |
| ynr_flt1x1_bypass | 1 | 为 1 时关闭低频软阈值处理。取值 0 或 1。 |
| ynr_sft5x5_bypass | 1 | 为 5 时关闭 1x5 高频降噪；取值范围为 0 或 1（原文如此，条件值与范围矛盾）。 |

<!-- Source EN PDF p.254; unit 2814 -->

9.4.4.25  rk_aiq_ynr_strength_v3_t

<!-- Source EN PDF p.254; unit 2815 -->

【说明】定义降噪模块降噪强度配置结构体。

<!-- Source EN PDF p.254; unit 2816 -->

【定义】

<!-- Source EN PDF p.254; unit 2817 -->

```text
 typedef struct rk_aiq_ynr_strength_v3_s {
     rk_aiq_uapi_sync_t sync;
     float percent;
     bool strength_enable;
 } rk_aiq_ynr_strength_v3_t;
```

<!-- Source EN PDF p.254; unit 2818 -->

【成员】

<!-- Source EN PDF p.254; unit 2819 -->

| 成员名称 | 说明 |
|---|---|
| sync | 同步/异步模式选择，见概述/API 说明部分。 |
| percent | 降噪强度，范围 0.0–1.0。 |

<!-- Source EN PDF p.254; unit 2820 -->

9.4.4.26  rk_aiq_cnr_attrib_v2_t

<!-- Source EN PDF p.254; unit 2821 -->

【说明】定义降噪模块参数。

<!-- Source EN PDF p.254; unit 2822 -->

【定义】

<!-- Source EN PDF p.255; unit 2823 -->

```text
 typedef struct rk_aiq_cnr_attrib_v2_s {
     rk_aiq_uapi_sync_t sync;
     AcnrV2_OPMode_t eMode;
     Acnr_Auto_Attr_V2_t stAuto;
     Acnr_Manual_Attr_V2_t stManual;
 } rk_aiq_cnr_attrib_v2_t;
```

<!-- Source EN PDF p.255; unit 2824 -->

【成员】

<!-- Source EN PDF p.255; unit 2825 -->

| 成员名称 | 说明 |
|---|---|
| sync | 同步/异步模式选择，见概述/API 说明部分。 |
| eMode | CNR 降噪模块模式 |
| stAuto | CNR 降噪模块自动模式参数 |
| stManual | CNR 降噪模块手动模式参数 |

<!-- Source EN PDF p.255; unit 2826 -->

9.4.4.27  AcnrV2_OPMode_t

<!-- Source EN PDF p.255; unit 2827 -->

【说明】定义降噪模块的模式属性。

<!-- Source EN PDF p.255; unit 2828 -->

【定义】

<!-- Source EN PDF p.255; unit 2829 -->

```text
 typedef enum AcnrV2_OPMode_e {
     ACNRV2_OP_MODE_INVALID           = 0,
     ACNRV2_OP_MODE_AUTO              = 1,
     ACNRV2_OP_MODE_MANUAL            = 2,
     ACNRV2_OP_MODE_REG_MANUAL        = 3,
     ACNRV2_OP_MODE_MAX
 } AcnrV2_OPMode_t;
```

<!-- Source EN PDF p.255; unit 2830 -->

【成员】

<!-- Source EN PDF p.255; unit 2831 -->

| 成员名称 | 说明 |
|---|---|
| ACNRV2_OP_MODE_INVALID | UV 域 CNR 降噪模块无效模式 |
| ACNRV2_OP_MODE_AUTO | UV 域 CNR 降噪模块自动模式 |
| ACNRV2_OP_MODE_MANUAL | UV 域 CNR 降噪模块手动模式的算法设置 |
| ACNRV2_OP_MODE_REG_MANUAL | UV 域 CNR 降噪模块手动模式的寄存器设置 |
| ACNRV2_OP_MODE_MAX | UV 域 CNR 降噪模块模式最大值，为无效模式 |

<!-- Source EN PDF p.256; unit 2832 -->

9.4.4.28  Acnr_Auto_Attr_V2_t

<!-- Source EN PDF p.256; unit 2833 -->

【说明】定义降噪模块自动属性。

<!-- Source EN PDF p.256; unit 2834 -->

【定义】

<!-- Source EN PDF p.256; unit 2835 -->

```text
 typedef struct Acnr_Auto_Attr_V2_s
 {
     all ISO params and select param
 RK_CNR_Params_V2_t stParams;
     RK_CNR_Params_V2_Select_t stSelect;
 } Acnr_Auto_Attr_V2_t;
```

<!-- Source EN PDF p.256; unit 2836 -->

【成员】

<!-- Source EN PDF p.256; unit 2837 -->

| 成员名称 | 说明 |
|---|---|
| stParams | CNR 模块各 ISO 对应的算法属性参数 |
| stSelect | CNR 模块计算属性参数 |

<!-- Source EN PDF p.256; unit 2838 -->

9.4.4.29  Acnr_Manual_Attr_V2_t

<!-- Source EN PDF p.256; unit 2839 -->

【说明】定义降噪模块手动属性。

<!-- Source EN PDF p.256; unit 2840 -->

【定义】

<!-- Source EN PDF p.256; unit 2841 -->

```text
 typedef struct Acnr_Manual_Attr_V2_s
 {
     RK_CNR_Params_V2_Select_t stSelect;
 RK_CNR_Fix_V2_t stFix;
 } Acnr_Manual_Attr_V2_t;
```

<!-- Source EN PDF p.256; unit 2842 -->

【成员】

<!-- Source EN PDF p.256; unit 2843 -->

| 成员名称 | 说明 |
|---|---|
| stSelect | 算法参数值 |
| stSelect | 寄存器值 |

<!-- Source EN PDF p.257; unit 2844 -->

9.4.4.30  RK_CNR_Params_V2_t

<!-- Source EN PDF p.257; unit 2845 -->

【说明】定义降噪模块自动模式及各 ISO 对应的算法属性参数。

<!-- Source EN PDF p.257; unit 2846 -->

【定义】

<!-- Source EN PDF p.257; unit 2847 -->

```text
 typedef struct RK_CNR_Params_V2_s
 {
     int enable;
     float iso[RK_CNR_V2_MAX_ISO_NUM];
     int hf_bypass[RK_CNR_V2_MAX_ISO_NUM];
     int lf_bypass[RK_CNR_V2_MAX_ISO_NUM];
     // gain
     float global_gain[RK_CNR_V2_MAX_ISO_NUM];
     float global_gain_alpha[RK_CNR_V2_MAX_ISO_NUM];
     float local_gain_scale[RK_CNR_V2_MAX_ISO_NUM];
     // strength adj by gain
     int gain_adj_strength_ratio[RK_CNR_V2_MAX_ISO_NUM]
 [RKCNR_V2_SGM_ADJ_TABLE_LEN];
     //
     float color_sat_adj[RK_CNR_V2_MAX_ISO_NUM];
     float color_sat_adj_alpha[RK_CNR_V2_MAX_ISO_NUM];
     // step1
     // median filter
     float hf_spikes_reducion_strength[RK_CNR_V2_MAX_ISO_NUM];
     // bilateral filter
     float hf_denoise_strength[RK_CNR_V2_MAX_ISO_NUM];
     float hf_color_sat[RK_CNR_V2_MAX_ISO_NUM];
     float hf_denoise_alpha[RK_CNR_V2_MAX_ISO_NUM];
     int  hf_bf_wgt_clip[RK_CNR_V2_MAX_ISO_NUM];
```

<!-- Source EN PDF p.257; unit 2848 -->

```text
     // step2
     // median filter
     float thumb_spikes_reducion_strength[RK_CNR_V2_MAX_ISO_NUM];
     // bilateral filter
     float thumb_denoise_strength[RK_CNR_V2_MAX_ISO_NUM];
     float thumb_color_sat[RK_CNR_V2_MAX_ISO_NUM];
     // step3
     // bilateral filter
     float lf_denoise_strength[RK_CNR_V2_MAX_ISO_NUM];
     float lf_color_sat[RK_CNR_V2_MAX_ISO_NUM];
     float lf_denoise_alpha[RK_CNR_V2_MAX_ISO_NUM];
     // bilateral filter kernels
     float kernel_5x5[5];
 } RK_CNR_Params_V2_t;
```

<!-- Source EN PDF p.258; unit 2849 -->

【成员】

<!-- Source EN PDF p.259; unit 2850 -->

| 参数名称 | 参数类型 | 参数说明 |
|---|---|---|
| Enable | 调试参数 | 模块使能开关：1 开启，0 关闭。 |
| iso | 调试参数 | 不同 ISO 档位对应不同调试参数。目前仅支持 13 个档位。 |
| hf_bypass | 调试参数 | 高频降噪旁路。0：不旁路；1：旁路。 |
| lf_bypass | 调试参数 | 低频降噪旁路。0：不旁路；1：旁路。 |
| global_gain | 调试参数 | CNR 局部与全局降噪模式的插值强度配置。通常保留默认值，无需配置，采用局部增益方式。范围 0.0 至 64.0，默认值 1。 |
| global_gain_alpha | 调试参数 | CNR 局部与全局降噪模式的插值强度配置。通常保留默认值，无需配置，采用局部增益方式。范围 0.0 1.0，默认值 0。 |
| global_gain_scale | 调试参数 | 放大 CNR 降噪强度，通常使用默认值，不宜调整。范围 0、128，默认值 1。 |
| gain_adj_strength_ratio | 调试参数 | 根据局部增益调整滤波强度；值越小，去噪越强。范围 [1, 255]，默认值 255。 |
| color_sat_adj | 调试参数 | 基于梯度调整的双边滤波 UV 比例，1~255。值越小，色噪去除越好。范围 [1, 255]，默认值 40。 |
| color_sat_adj_alpha | 调试参数 | color_sat_adj 调整比例；值越大，色噪去除越好。范围 0、1.0，默认值 0.8。 |
| hf_spikes_reducion_strength | 调试参数 | 高频中值滤波强度；值越大，中值滤波越强。范围 0、1.0，默认值 0.5。 |

<!-- Source EN PDF p.260; unit 2851 -->

| 参数名称 | 参数类型 | 参数说明 |
|---|---|---|
| hf_denoise_strength | 调试参数 | 高频双边滤波强度；值越大，色噪去除越好。范围 [1, 1023]，默认值 10。 |
| hf_color_sat | 调试参数 | 高频双边滤波的 UV 缩放因子；值越小，色彩饱和度下降越多。范围 0.0、7.9，默认值 1.5。 |
| hf_denoise_alpha | 调试参数 | 高频双边滤波中心点权重。范围 0.0、1.0，默认值 0。 |
| hf_bf_wgt_clip | 调试参数 | 高频最小降噪强度；值越大，降噪越强。范围 0、255，默认值 0。 |
| thumb_spikes_reducion_strength | 调试参数 | 缩略图中值滤波强度；值越大，中值滤波越强。范围 0.0、1.0，默认值 0.5。 |
| thumb_denoise_strength | 调试参数 | 缩略图双边滤波强度；值越大，色噪去除越好。范围 [1, 1023]，默认值 8。 |
| thumb_color_sat | 调试参数 | 缩略图双边滤波的 UV 缩放因子，色彩饱和度下降更多（原文未说明增减方向）。范围 0.0、7.9，默认值 4。 |
| lf_denoise_strength | 调试参数 | 低频双边滤波强度；值越大，色噪去除越好。范围 [1, 1023]，默认值 8。 |
| lf_color_sat | 调试参数 | 低频双边滤波的 UV 比例因子；值越小，色彩饱和度下降越多。范围 0.0、7.9，默认值 4。 |
| lf_denoise_alpha | 调试参数 | 低频双边滤波中心点权重。范围 0.0、1.0，默认值 0.5。 |
| kernel_5x5 | 调试参数 | 5x5 双边滤波核。 |

<!-- Source EN PDF p.261; unit 2852 -->

9.4.4.31  RK_CNR_Params_V2_Select_t

<!-- Source EN PDF p.261; unit 2853 -->

【说明】定义降噪模块手动模式算法属性。

<!-- Source EN PDF p.261; unit 2854 -->

【定义】

<!-- Source EN PDF p.261; unit 2855 -->

```text
 typedef struct RK_CNR_Params_V2_Select_s
 {
     int enable;
     // bypass
     int hf_bypass;
     int lf_bypass;
     // gain
     // gain
     float global_gain;
     float global_gain_alpha;
     float local_gain_scale;
     // strength adj by gain
     int gain_adj_strength_ratio[RKCNR_V2_SGM_ADJ_TABLE_LEN];
     //
     float color_sat_adj;
     float color_sat_adj_alpha;
     // step1
     // median filter
     float hf_spikes_reducion_strength;
     // bilateral filter
     float hf_denoise_strength;
     float hf_color_sat;
     float hf_denoise_alpha;
     int hf_bf_wgt_clip;
     // step2
     // median filter
     float thumb_spikes_reducion_strength;
     // bilateral filter
     float thumb_denoise_strength;
     float thumb_color_sat;
     // step3
     // bilateral filter
     float lf_denoise_strength;
     float lf_color_sat;
     float lf_denoise_alpha;
     // bilateral filter kernels
     float kernel_5x5[5];
 } RK_CNR_Params_V2_Select_t;
```

<!-- Source EN PDF p.262; unit 2856 -->

【成员】

<!-- Source EN PDF p.263; unit 2857 -->

| 参数名称 | 参数类型 | 参数说明 |
|---|---|---|
| Enable | 调试参数 | 模块使能开关：1 开启，0 关闭。 |
| iso | 调试参数 | 不同 ISO 档位对应不同调试参数。目前仅支持 13 个档位。 |
| hf_bypass | 调试参数 | 高频降噪旁路。0：不旁路；1：旁路。 |
| lf_bypass | 调试参数 | 低频降噪旁路。0：不旁路；1：旁路。 |
| global_gain | 调试参数 | CNR 局部与全局降噪模式的插值强度配置。通常保留默认值，无需配置，采用局部增益方式。范围 0.0 至 64.0，默认值 1。 |
| global_gain_alpha | 调试参数 | CNR 局部与全局降噪模式的插值强度配置。通常保留默认值，无需配置，采用局部增益方式。范围 0.0 1.0，默认值 0。 |
| global_gain_scale | 调试参数 | 放大 CNR 降噪强度，通常使用默认值，不宜调整。范围 0、128，默认值 1。 |
| gain_adj_strength_ratio | 调试参数 | 根据局部增益调整滤波强度；值越小，去噪越强。范围 [1, 255]，默认值 255。 |
| color_sat_adj | 调试参数 | 基于梯度调整的双边滤波 UV 比例，1~255。值越小，色噪去除越好。范围 [1, 255]，默认值 40。 |
| color_sat_adj_alpha | 调试参数 | color_sat_adj 调整比例；值越大，色噪去除越好。范围 0、1.0，默认值 0.8。 |
| hf_spikes_reducion_strength | 调试参数 | 高频中值滤波强度；值越大，中值滤波越强。范围 0、1.0，默认值 0.5。 |

<!-- Source EN PDF p.264; unit 2858 -->

| 参数名称 | 参数类型 | 参数说明 |
|---|---|---|
| hf_denoise_strength | 调试参数 | 高频双边滤波强度；值越大，色噪去除越好。范围 [1, 1023]，默认值 10。 |
| hf_color_sat | 调试参数 | 高频双边滤波的 UV 缩放因子；值越小，色彩饱和度下降越多。范围 0.0、7.9，默认值 1.5。 |
| hf_denoise_alpha | 调试参数 | 高频双边滤波中心点权重。范围 0.0、1.0，默认值 0。 |
| hf_bf_wgt_clip | 调试参数 | 高频最小降噪强度；值越大，降噪越强。范围 0、255，默认值 0。 |
| thumb_spikes_reducion_strength | 调试参数 | 缩略图中值滤波强度；值越大，中值滤波越强。范围 0.0、1.0，默认值 0.5。 |
| thumb_denoise_strength | 调试参数 | 缩略图双边滤波强度；值越大，色噪去除越好。范围 [1, 1023]，默认值 8。 |
| thumb_color_sat | 调试参数 | 缩略图双边滤波的 UV 缩放因子，色彩饱和度下降更多（原文未说明增减方向）。范围 0.0、7.9，默认值 4。 |
| lf_denoise_strength | 调试参数 | 低频双边滤波强度；值越大，色噪去除越好。范围 [1, 1023]，默认值 8。 |
| lf_color_sat | 调试参数 | 低频双边滤波的 UV 比例因子；值越小，色彩饱和度下降越多。范围 0.0、7.9，默认值 4。 |
| lf_denoise_alpha | 调试参数 | 低频双边滤波中心点权重。范围 0.0、1.0，默认值 0.5。 |
| kernel_5x5 | 调试参数 | 5x5 双边滤波核。 |

<!-- Source EN PDF p.265; unit 2859 -->

9.4.4.32  RK_CNR_Fix_V2_t

<!-- Source EN PDF p.265; unit 2860 -->

【说明】定义降噪模块手动模式寄存器配置。

<!-- Source EN PDF p.265; unit 2861 -->

【定义】

<!-- Source EN PDF p.265; unit 2862 -->

```text
 typedef struct RK_CNR_Fix_V2_s {
     //ISP_CNR_2800_CTRL
     uint8_t cnr_thumb_mix_cur_en;
     uint8_t cnr_lq_bila_bypass;
     uint8_t cnr_hq_bila_bypass;
     uint8_t cnr_exgain_bypass;
     uint8_t cnr_en_i;
     // ISP_CNR_2800_EXGAIN
     uint8_t cnr_global_gain_alpha;
     uint16_t cnr_global_gain;
     // ISP_CNR_2800_GAIN_PARA
     uint8_t cnr_gain_iso;
     uint8_t cnr_gain_offset;
     uint8_t cnr_gain_1sigma;
     // ISP_CNR_2800_GAIN_UV_PARA
     uint8_t cnr_gain_uvgain1;
     uint8_t cnr_gain_uvgain0;
     // ISP_CNR_2800_LMED3
     uint8_t cnr_lmed3_alpha;
     // ISP_CNR_2800_LBF5_GAIN
     uint8_t cnr_lbf5_gain_y;
     uint8_t cnr_lbf5_gain_c;
     // ISP_CNR_2800_LBF5_WEITD0_4
     uint8_t cnr_lbf5_weit_d[5];
     // ISP_CNR_2800_HMED3
     uint8_t cnr_hmed3_alpha;
     // ISP_CNR_2800_HBF5
     uint8_t cnr_hbf5_weit_src;
     uint8_t cnr_hbf5_min_wgt;
     uint16_t cnr_hbf5_sigma;
     // ISP_CNR_2800_LBF3
     uint8_t cnr_lbf5_weit_src;
     uint16_t cnr_lbf3_sigma;
     //ISP_CNR_2800_SIGMA0-SIGMA3
     uint8_t cnr_sigma_y[13];
 } RK_CNR_Fix_V2_t;
```

<!-- Source EN PDF p.266; unit 2863 -->

【成员】

<!-- Source EN PDF p.267; unit 2864 -->

| 参数名称 | 参数说明 |
|---|---|
| cnr_thumb_mix_cur_en | 当前帧缩略图与前一图像混合的使能信号：1'b1：使能混合；1'b0：禁用混合。该项为读回的显示寄存器。 |
| cnr_lq_bila_bypass | 低频双边 3x3 滤波旁路使能：1'b1：使能旁路，此 3x3 滤波器的 out_data 等于 in_data；1'b0：禁用旁路。该项为读回的显示寄存器。 |
| cnr_hq_bila_bypass | 高频 5x5 双边滤波旁路信号：1：使能旁路，此 5x5 滤波器的 out_data 等于 in_data；0：禁用旁路。该项为读回的显示寄存器。 |
| cnr_exgain_bypass | sw_cnr_exgain_bypass 外部增益旁路使能：1：使能旁路，外部增益固定为 sw_cnr_egain_mux；0：禁用旁路，采用外部增益。当前版本不支持禁用旁路。该项为读回的显示寄存器。 |
| cnr_en_i | CNR 模块使能信号：1：使能；0：禁用。 |
| cnr_global_gain | CNR 局部与全局降噪模式的插值强度配置。通常保留默认值，无需配置，采用局部增益方式。范围 0.0 至 64.0，默认值 1。 |
| cnr_global_gain_alpha | CNR 局部与全局降噪模式的插值强度配置。通常保留默认值，无需配置，采用局部增益方式。范围 0.0 1.0，默认值 0。 |
| cnr_gain_iso | 放大外部增益，范围 0~128。 |
| cnr_gain_offset | 增益校准中低通滤波器的增益偏移，范围 0~16。 |
| cnr_gain_1sigma | 放大增益校准中高通滤波器的输出数据。 |
| cnr_gain_uvgain1 | uvgain 参数 1 |
| cnr_gain_uvgain0 | uvgain 参数 0 |
| cnr_lmed3_alpha | 低频中值滤波中 in_data 的权重，范围 0~16。 |
| cnr_lbf5_gain_y; | lbf5x5 双边滤波器的 Y 增益。 |
| cnr_lbf5_gain_c; | lbf5x5 双边滤波器的 UV 增益。 |
| cnr_lbf5_weit_d[0] | pix12 的空间权重，范围 1~128。 |

<!-- Source EN PDF p.268; unit 2865 -->

| 参数名称 | 参数说明 |
|---|---|
| cnr_lbf5_weit_d[1] | pix7,11,13,17 的空间权重，范围 0~128。 |
| cnr_lbf5_weit_d[2] | pix6,8,16,18 的空间权重，范围 0~128。 |
| cnr_lbf5_weit_d[3] | 距离为 4 或 5 时的空间权重，范围 0~128。 |
| cnr_lbf5_weit_d[4] | pix0,4,20,24 的空间权重，范围 0~128。 |
| cnr_hmed3_alpha | 高频中值滤波中 in_data 的权重，范围 0~16。 |
| cnr_hbf5_weit_src | hbf5x5 的 in_data 权重，范围 0~128。 |
| cnr_hbf5_min_wgt | hbf5x5 weit_r 下限。 |
| cnr_hbf5_sigma | hbf5x5 的 Sigma 值。 |
| cnr_lbf5_weit_src | lbf3x3 的 in_data 权重，范围 0~128。 |
| cnr_lbf3_sigma | lbf3x3 的 sigma 值。 |

<!-- Source EN PDF p.268; unit 2866 -->

9.4.4.33  rk_aiq_cnr_strength_v2_t

<!-- Source EN PDF p.268; unit 2867 -->

【说明】定义降噪模块降噪强度配置结构体。

<!-- Source EN PDF p.268; unit 2868 -->

【定义】

<!-- Source EN PDF p.268; unit 2869 -->

```text
 typedef struct rk_aiq_cnr_strength_v2_s {
     rk_aiq_uapi_sync_t sync;
     float percent;
 } rk_aiq_cnr_strength_v2_t;
```

<!-- Source EN PDF p.268; unit 2870 -->

【成员】

<!-- Source EN PDF p.268; unit 2871 -->

| 成员名称 | 说明 |
|---|---|
| sync | 同步/异步模式选择，见概述/API 说明部分。 |
| percent | 降噪强度，范围 0.0–1.0。 |

<!-- Source EN PDF p.268; unit 2872 -->

### 9.5   BLC

<!-- Source EN PDF p.268; unit 2873 -->

#### 9.5.1 功能说明

<!-- Source EN PDF p.268; unit 2874 -->

#### 9.5.2 功能级 API 参考

<!-- Source EN PDF p.268; unit 2875 -->

9.5.2.1  rk_aiq_user_api2_ablc_SetAttrib

<!-- Source EN PDF p.269; unit 2876 -->

【说明】设置 BLC 参数属性。

<!-- Source EN PDF p.269; unit 2877 -->

【语法】

<!-- Source EN PDF p.269; unit 2878 -->

```text
 XCamReturn
 rk_aiq_user_api2_ablc_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_blc_attrib_t *attr);
```

<!-- Source EN PDF p.269; unit 2879 -->

【参数】

<!-- Source EN PDF p.269; unit 2880 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | BLC 参数属性 | 输入 |

<!-- Source EN PDF p.269; unit 2881 -->

【返回值】

<!-- Source EN PDF p.269; unit 2882 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.269; unit 2883 -->

【依赖】

<!-- Source EN PDF p.269; unit 2884 -->

头文件：rk_aiq_user_api2_ablc.h, RkAiqHandleInt.h, rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.269; unit 2885 -->

库文件：librkaiq.so

<!-- Source EN PDF p.269; unit 2886 -->

9.5.2.2  rk_aiq_user_api2_ablc_GetAttrib

<!-- Source EN PDF p.269; unit 2887 -->

【说明】获取 BLC 参数属性。

<!-- Source EN PDF p.269; unit 2888 -->

【语法】

<!-- Source EN PDF p.269; unit 2889 -->

```text
 XCamReturn
 rk_aiq_user_api2_ablc_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_blc_attrib_t *attr);
```

<!-- Source EN PDF p.269; unit 2890 -->

【参数】

<!-- Source EN PDF p.269; unit 2891 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | BLC 参数属性 | 输入 |

<!-- Source EN PDF p.270; unit 2892 -->

【返回值】

<!-- Source EN PDF p.270; unit 2893 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.270; unit 2894 -->

【依赖】

<!-- Source EN PDF p.270; unit 2895 -->

头文件：rk_aiq_user_api2_ablc.h, RkAiqHandleInt.h, rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.270; unit 2896 -->

库文件：librkaiq.so

<!-- Source EN PDF p.270; unit 2897 -->

#### 9.5.3 模块级 API 数据类型

<!-- Source EN PDF p.270; unit 2898 -->

9.5.3.1  rk_aiq_blc_attrib_t

<!-- Source EN PDF p.270; unit 2899 -->

【说明】BLC 模块参数。

<!-- Source EN PDF p.270; unit 2900 -->

【定义】

<!-- Source EN PDF p.270; unit 2901 -->

```text
 typedef struct rk_aiq_blc_attrib_s {
     rk_aiq_uapi_sync_t sync;
     AblcOPMode_t eMode;
     AblcParams_t stBlc0Auto;
     AblcParams_t stBlc1Auto;
     AblcManualAttr_t stBlc0Manual;
     AblcManualAttr_t stBlc1Manual;
 } rk_aiq_blc_attrib_t;
```

<!-- Source EN PDF p.270; unit 2902 -->

【成员】

<!-- Source EN PDF p.270; unit 2903 -->

| 成员名称 | 说明 |
|---|---|
| sync | 同步/异步模式选择，见概述/API 说明部分。 |
| eMode | BLC 模块模式 |
| stBlc0Auto | blc0 自动模式参数 |
| stBlc0Manual | blc0 手动模式参数 |
| stBlc1Auto | blc1 自动模式参数 |
| stBlc1Manual | blc1 手动模式参数 |

<!-- Source EN PDF p.271; unit 2904 -->

9.5.3.2  AblcOPMode_t

<!-- Source EN PDF p.271; unit 2905 -->

【说明】定义降噪模块的模式属性。

<!-- Source EN PDF p.271; unit 2906 -->

【定义】

<!-- Source EN PDF p.271; unit 2907 -->

```text
 typedef enum AblcOPMode_e {
     ABLC_OP_MODE_OFF         = 0,
     ABLC_OP_MODE_AUTO             = 1,
     ABLC_OP_MODE_MANUAL           = 2,
     ABLC_OP_MODE_MAX
 } AblcOPMode_t;
```

<!-- Source EN PDF p.271; unit 2908 -->

【成员】

<!-- Source EN PDF p.271; unit 2909 -->

| 成员名称 | 说明 |
|---|---|
| ABLC_OP_MODE_OFF | BLC 模块无效模式 |
| ABLC_OP_MODE_AUTO | BLC 模块自动模式 |
| ABLC_OP_MODE_MANUAL | BLC 模块手动模式算法设置 |
| ABLC_OP_MODE_MAX | BLC 模块模式最大值，为无效模式。 |

<!-- Source EN PDF p.271; unit 2910 -->

9.5.3.3  AblcParams_t

<!-- Source EN PDF p.271; unit 2911 -->

【说明】BLC 模块自动模式参数。

<!-- Source EN PDF p.271; unit 2912 -->

【定义】

<!-- Source EN PDF p.271; unit 2913 -->

```text
 typedef struct AblcParams_s {
     bool enable;
     int len;
     float* iso;
     float* blc_r;
     float* blc_gr;
     float* blc_gb;
     float* blc_b;
 } AblcParams_t;
```

<!-- Source EN PDF p.271; unit 2914 -->

【成员】

<!-- Source EN PDF p.272; unit 2915 -->

| 成员名称 | 说明 |
|---|---|
| enable | 模块使能开关：1：使能；0：禁用。 |
| len | iso 对应的数组长度 |
| iso | ISO 档位 |
| blc_r | 不同 ISO 对应的 BLC 值，数组指针。 |
| blc_gr | 不同 ISO 对应的 BLC 值，数组指针。 |
| blc_gb | 不同 ISO 对应的 BLC 值，数组指针。 |
| blc_b | 不同 ISO 对应的 BLC 值，数组指针。 |

<!-- Source EN PDF p.272; unit 2916 -->

9.5.3.4  AblcManualAttr_t

<!-- Source EN PDF p.272; unit 2917 -->

【说明】BLC 模块手动模式参数。

<!-- Source EN PDF p.272; unit 2918 -->

【定义】

<!-- Source EN PDF p.272; unit 2919 -->

```text
 typedef struct AblcSelect_s {
     bool enable;
     short int blc_r;
     short int blc_gr;
     short int blc_gb;
     short int blc_b;
 } AblcSelect_t;
 typedef AblcSelect_t AblcManualAttr_t;
```

<!-- Source EN PDF p.272; unit 2920 -->

【成员】

<!-- Source EN PDF p.272; unit 2921 -->

| 成员名称 | 说明 |
|---|---|
| enable | 模块使能开关：1：使能；0：禁用。 |
| blc_r | BLC 模块 R 通道属性 |
| blc_gr | BLC 模块 gr 通道属性 |
| blc_gb | BLC 模块 GB 通道属性 |
| blc_b | BLC 模块 B 通道属性 |

<!-- Source EN PDF p.273; unit 2922 -->

### 9.6 去雾与增强

<!-- Source EN PDF p.273; unit 2923 -->

#### 9.6.1 功能说明

<!-- Source EN PDF p.273; unit 2924 -->

去雾与增强包含 2 种模式：

<!-- Source EN PDF p.273; unit 2925 -->

去雾通过动态改变图像对比度和亮度来增强图像。

<!-- Source EN PDF p.273; unit 2926 -->

增强图像局部区域的对比度。

<!-- Source EN PDF p.273; unit 2927 -->

去雾和增强互斥。

<!-- Source EN PDF p.273; unit 2928 -->

#### 9.6.2 功能级 API 参考

<!-- Source EN PDF p.273; unit 2929 -->

9.6.2.1  rk_aiq_uapi2_setDehazeModuleEnable

<!-- Source EN PDF p.273; unit 2930 -->

【说明】

<!-- Source EN PDF p.273; unit 2931 -->

设置去雾模块开关，控制 stAuto.DehazeTuningPara.Enable 或 stManual.Enable（根据当前 API 模式自动修改）。

<!-- Source EN PDF p.273; unit 2932 -->

【语法】

<!-- Source EN PDF p.273; unit 2933 -->

```text
 XCamReturn rk_aiq_uapi2_setDehazeModuleEnable(const rk_aiq_sys_ctx_t* ctx, bool
 on);
```

<!-- Source EN PDF p.273; unit 2934 -->

【参数】

<!-- Source EN PDF p.273; unit 2935 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| on | 开关功能。 | 输入 |

<!-- Source EN PDF p.273; unit 2936 -->

【返回值】

<!-- Source EN PDF p.273; unit 2937 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，详见错误码表。 |

<!-- Source EN PDF p.273; unit 2938 -->

【依赖】

<!-- Source EN PDF p.273; unit 2939 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.273; unit 2940 -->

库文件：librkaiq.so

<!-- Source EN PDF p.274; unit 2941 -->

9.6.2.2  rk_aiq_uapi2_setDehazeEnable

<!-- Source EN PDF p.274; unit 2942 -->

【说明】

<!-- Source EN PDF p.274; unit 2943 -->

设置去雾功能开关，控制 stAuto.DehazeTuningPara.dehaze_setting.en 或 stManual.dehaze_setting.en（根据当前 API 模式自动修改）。

<!-- Source EN PDF p.274; unit 2944 -->

【语法】

<!-- Source EN PDF p.274; unit 2945 -->

```text
 XCamReturn rk_aiq_uapi2_setDehazeEnable(const rk_aiq_sys_ctx_t* ctx, bool on);
```

<!-- Source EN PDF p.274; unit 2946 -->

【参数】

<!-- Source EN PDF p.274; unit 2947 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| on | 开关功能。 | 输入 |

<!-- Source EN PDF p.274; unit 2948 -->

【返回值】

<!-- Source EN PDF p.274; unit 2949 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，详见错误码表。 |

<!-- Source EN PDF p.274; unit 2950 -->

【依赖】

<!-- Source EN PDF p.274; unit 2951 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.274; unit 2952 -->

库文件：librkaiq.so

<!-- Source EN PDF p.274; unit 2953 -->

9.6.2.3  rk_aiq_uapi2_setMDehazeStrth

<!-- Source EN PDF p.274; unit 2954 -->

【说明】

<!-- Source EN PDF p.274; unit 2955 -->

设置手动去雾强度，以 50 为基准；大于 50 增强去雾，小于 50 减弱去雾。

<!-- Source EN PDF p.274; unit 2956 -->

DEHAZE_API_AUTO 和 DEHAZE_API_MANUAL 均设置为 API 模式。

<!-- Source EN PDF p.274; unit 2957 -->

使用此 API 前需确保去雾功能生效，或先调用 rk_aiq_uapi2_setDehazeModuleEnable 和 rk_aiq_uapi2_setDehazeEnable（流程见 sample_adehaze_module.cpp 的 Case 6）。

<!-- Source EN PDF p.274; unit 2958 -->

【语法】

<!-- Source EN PDF p.274; unit 2959 -->

```text
 XCamReturn rk_aiq_uapi2_setMDehazeStrth(const rk_aiq_sys_ctx_t* ctx, unsigned int
 level);
```

<!-- Source EN PDF p.274; unit 2960 -->

【参数】

<!-- Source EN PDF p.275; unit 2961 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| level | 等级，范围 [1,100]，默认值 50，精度 1。 | 输入 |

<!-- Source EN PDF p.275; unit 2962 -->

【返回值】

<!-- Source EN PDF p.275; unit 2963 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.275; unit 2964 -->

【依赖】

<!-- Source EN PDF p.275; unit 2965 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.275; unit 2966 -->

库文件：librkaiq.so

<!-- Source EN PDF p.275; unit 2967 -->

9.6.2.4  rk_aiq_uapi2_getMDehazeStrth

<!-- Source EN PDF p.275; unit 2968 -->

【说明】

<!-- Source EN PDF p.275; unit 2969 -->

获取手动去雾强度。

<!-- Source EN PDF p.275; unit 2970 -->

【语法】

<!-- Source EN PDF p.275; unit 2971 -->

```text
 XCamReturn rk_aiq_uapi2_getMDehazeStrth(const rk_aiq_sys_ctx_t* ctx, unsigned
 int* level);
```

<!-- Source EN PDF p.275; unit 2972 -->

【参数】

<!-- Source EN PDF p.275; unit 2973 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| level | 等级，范围 [1,100]，默认值 50，精度 1。 | 输出 |

<!-- Source EN PDF p.275; unit 2974 -->

【返回值】

<!-- Source EN PDF p.275; unit 2975 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.275; unit 2976 -->

【依赖】

<!-- Source EN PDF p.275; unit 2977 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.275; unit 2978 -->

库文件：librkaiq.so

<!-- Source EN PDF p.276; unit 2979 -->

9.6.2.5  rk_aiq_uapi2_setEnhanceEnable

<!-- Source EN PDF p.276; unit 2980 -->

【说明】

<!-- Source EN PDF p.276; unit 2981 -->

设置去雾功能开关，控制 stAuto.DehazeTuningPara.enhance_setting.en 或 stManual.enhance_setting.en（根据当前 API 模式自动修改；原文称 Dehaze）。

<!-- Source EN PDF p.276; unit 2982 -->

【语法】

<!-- Source EN PDF p.276; unit 2983 -->

```text
 XCamReturn rk_aiq_uapi2_setEnhanceEnable(const rk_aiq_sys_ctx_t* ctx, bool on);
```

<!-- Source EN PDF p.276; unit 2984 -->

【参数】

<!-- Source EN PDF p.276; unit 2985 -->

| 返回值 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| on | 开关功能。 | 输入 |

<!-- Source EN PDF p.276; unit 2986 -->

【返回值】

<!-- Source EN PDF p.276; unit 2987 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.276; unit 2988 -->

【依赖】

<!-- Source EN PDF p.276; unit 2989 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.276; unit 2990 -->

库文件：librkaiq.so

<!-- Source EN PDF p.276; unit 2991 -->

9.6.2.6  rk_aiq_uapi2_setMEnhanceStrth

<!-- Source EN PDF p.276; unit 2992 -->

【说明】

<!-- Source EN PDF p.276; unit 2993 -->

设置手动对比度增强强度，以 50 为基准；大于 50 增强对比度，小于 50 降低对比度。

<!-- Source EN PDF p.276; unit 2994 -->

DEHAZE_API_AUTO 和 DEHAZE_API_MANUAL 均设置为 API 模式。

<!-- Source EN PDF p.276; unit 2995 -->

使用此 API 前需确保增强功能生效，或先调用 rk_aiq_uapi2_setDehazeModuleEnable 和 rk_aiq_uapi2_setEnhanceEnable（流程见 sample_adehaze_module.cpp 的 Case 9）。

<!-- Source EN PDF p.276; unit 2996 -->

【语法】

<!-- Source EN PDF p.276; unit 2997 -->

```text
 XCamReturn rk_aiq_uapi2_setMEnhanceStrth(const rk_aiq_sys_ctx_t* ctx, unsigned
 int level);
```

<!-- Source EN PDF p.276; unit 2998 -->

【参数】

<!-- Source EN PDF p.277; unit 2999 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| level | 等级，范围 [1,100]，默认值 50，精度 1。 | 输入 |

<!-- Source EN PDF p.277; unit 3000 -->

【返回值】

<!-- Source EN PDF p.277; unit 3001 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.277; unit 3002 -->

【依赖】

<!-- Source EN PDF p.277; unit 3003 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.277; unit 3004 -->

库文件：librkaiq.so

<!-- Source EN PDF p.277; unit 3005 -->

9.6.2.7  rk_aiq_uapi2_getMEnhanceStrth

<!-- Source EN PDF p.277; unit 3006 -->

【说明】

<!-- Source EN PDF p.277; unit 3007 -->

获取手动对比度增强强度。

<!-- Source EN PDF p.277; unit 3008 -->

【语法】

<!-- Source EN PDF p.277; unit 3009 -->

```text
 XCamReturn rk_aiq_uapi2_getMEnhanceStrth(const rk_aiq_sys_ctx_t* ctx, unsigned
 int *level);
```

<!-- Source EN PDF p.277; unit 3010 -->

【参数】

<!-- Source EN PDF p.277; unit 3011 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| level | 等级，范围 [1,100]，默认值 50，精度 1。 | 输出 |

<!-- Source EN PDF p.277; unit 3012 -->

【返回值】

<!-- Source EN PDF p.277; unit 3013 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.277; unit 3014 -->

【依赖】

<!-- Source EN PDF p.277; unit 3015 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.277; unit 3016 -->

库文件：librkaiq.so

<!-- Source EN PDF p.278; unit 3017 -->

#### 9.6.3 模块级 API 参考

<!-- Source EN PDF p.278; unit 3018 -->

9.6.3.1  rk_aiq_user_api2_adehaze_v12_setSwAttrib

<!-- Source EN PDF p.278; unit 3019 -->

【说明】

<!-- Source EN PDF p.278; unit 3020 -->

设置去雾参数。

<!-- Source EN PDF p.278; unit 3021 -->

【语法】

<!-- Source EN PDF p.278; unit 3022 -->

```text
 XCamReturn  rk_aiq_user_api2_adehaze_setSwAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 const adehaze_sw_v2_t* attr);
```

<!-- Source EN PDF p.278; unit 3023 -->

【参数】

<!-- Source EN PDF p.278; unit 3024 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 去雾参数 | 输入 |

<!-- Source EN PDF p.278; unit 3025 -->

【返回值】

<!-- Source EN PDF p.278; unit 3026 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.278; unit 3027 -->

9.6.3.2  rk_aiq_user_api2_adehaze_getSwAttrib

<!-- Source EN PDF p.278; unit 3028 -->

【说明】

<!-- Source EN PDF p.278; unit 3029 -->

获取当前去雾参数。

<!-- Source EN PDF p.278; unit 3030 -->

【语法】

<!-- Source EN PDF p.278; unit 3031 -->

```text
 XCamReturn  rk_aiq_user_api2_adehaze_getSwAttrib(const rk_aiq_sys_ctx_t*
 sys_ctx,adehaze_sw_v2_t* attr);
```

<!-- Source EN PDF p.278; unit 3032 -->

【参数】

<!-- Source EN PDF p.278; unit 3033 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 去雾参数 | 输出 |

<!-- Source EN PDF p.278; unit 3034 -->

【返回值】

<!-- Source EN PDF p.279; unit 3035 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.279; unit 3036 -->

#### 9.6.4 模块级 API 数据类型

<!-- Source EN PDF p.279; unit 3037 -->

9.6.4.1  dehaze_api_mode_t

<!-- Source EN PDF p.279; unit 3038 -->

【说明】定义去雾模块工作模式。

<!-- Source EN PDF p.279; unit 3039 -->

【定义】

<!-- Source EN PDF p.279; unit 3040 -->

```text
 typedef enum dehaze_api_mode_e {
     DEHAZE_API_AUTO   = 0,
     DEHAZE_API_MANUAL = 1,
 } dehaze_api_mode_t;
```

<!-- Source EN PDF p.279; unit 3041 -->

【成员】

<!-- Source EN PDF p.279; unit 3042 -->

| 成员名称 | 说明 |
|---|---|
| DEHAZE_API_AUTO | 自动去雾模式 |
| DEHAZE_API_MANUAL | 手动去雾模式 |

<!-- Source EN PDF p.279; unit 3043 -->

9.6.4.2  DehazeDataV21_t

<!-- Source EN PDF p.279; unit 3044 -->

【说明】定义自动去雾调试参数属性。

<!-- Source EN PDF p.279; unit 3045 -->

【定义】

<!-- Source EN PDF p.279; unit 3046 -->

```text
 typedef struct DehazeDataV21_s{
     float* EnvLv;
     int    EnvLv_len;
     float* dc_min_th;
     int    dc_min_th_len;
     float* dc_max_th;
     int    dc_max_th_len;
     float* yhist_th;
     int    yhist_th_len;
     float* yblk_th;
     int    yblk_th_len;
     float* dark_th;
     int    dark_th_len;
     float* bright_min;
     int    bright_min_len;
     float* bright_max;
     int    bright_max_len;
     float* wt_max;
     int    wt_max_len;
     float* air_min;
     int    air_min_len;
     float* air_max;
     int    air_max_len;
     float* tmax_base;
     int    tmax_base_len;
     float* tmax_off;
     int    tmax_off_len;
     float* tmax_max;
     int    tmax_max_len;
     float* cfg_wt;
     int    cfg_wt_len;
     float* cfg_air;
     int    cfg_air_len;
     float* cfg_tmax;
     int    cfg_tmax_len;
     float* dc_weitcur;
     int    dc_weitcur_len;
     float* bf_weight;
     int    bf_weight_len;
     float* range_sigma;
     int    range_sigma_len;
     float* space_sigma_pre;
     int    space_sigma_pre_len;
     float* space_sigma_cur;
     int    space_sigma_cur_len;
 } DehazeDataV21_t;
```

<!-- Source EN PDF p.280; unit 3047 -->

【成员】

<!-- Source EN PDF p.281; unit 3048 -->

| 成员名 | 说明 |
|---|---|
| EnvLv | 环境亮度 |
| EnvLv_len | EnvLv 数组长度 |
| dc_min_th | WT 自适应统计范围为 [16, 120]，默认值 64。 |
| dc_min_th_len | dc_min_th 数组长度 |
| dc_max_th | WT 自适应高曝光区域统计范围为 [170, 255]，默认值 192。 |
| dc_max_th_len | dc_max_th 数组长度 |
| yhist_th | Y 分量高曝光区域统计范围为 [170, 255]，默认值 249。 |
| yhist_th_len | yhist_th 数组长度 |
| yblk_th | Y 分量块数量比例阈值为 0.002、0.01，默认值 0.002。 |
| yblk_th_len | yblk_th 数组长度 |
| dark_th | WT 自适应 Y 分量块的最小阈值，范围 [230, 250]，默认值 250。 |
| dark_th_len | dark_th 数组长度 |
| bright_min | AIR 自适应阈值的最小值，范围 160 至 200，默认值 180。 |
| bright_min_len | bright_min 数组长度 |
| bright_max | AIR 自适应阈值的最大值，范围 210 至 250，默认值 240。 |
| bright_max_len | bright_max 数组长度 |
| wt_max | WT 最大值为 0.75、0.9，默认值 0.9。 |
| wt_max_len | wt_max 数组长度 |
| air_min | AIR 自适应最小值，范围 200 至 220，默认值 200。 |
| air_min_len | air_min 数组长度 |
| air_max | AIR 自适应最大值为 230、250，默认值 250。 |
| air_max_len | air_max 数组长度 |
| tmax_base | tmax 默认值为 125，对应配置如下：200 (131)、210 (125)、220 (119)、230 (114)、240 (109)、250 (105)，推荐 131-105。 |

<!-- Source EN PDF p.282; unit 3049 -->

| 成员名 | 说明 |
|---|---|
| tmax_base_len | tmax_base 数组长度 |
| tmax_off | tmax 自适应固定值，范围 [0.1, 0.5]，默认值 0.1。 |
| tmax_off_len | tmax_off 数组长度 |
| tmax_max | tmax 最大值为 0.1、0.5，默认值 0.5。 |
| tmax_max_len | tmax_max 数组长度 |
| cfg_wt | 软件配置的 wt，即图像去雾强度，范围 [0, 1]，默认值 0.8。 |
| cfg_wt_len | cfg_wt 数组长度 |
| cfg_air | 软件配置的 air，即大气光系数，范围 [0, 255]，默认值 210。 |
| cfg_air_len | cfg_air 数组长度 |
| cfg_tmax | 软件配置的 tmax，即去雾最大值，范围 [0, 1]，默认值 0.2。 |
| cfg_tmax_len | cfg_tmax 数组长度 |
| bf_weight | 两个双边滤波器的合成权重，范围 [0, 1]，默认值 0.5。 |
| bf_weight_len | bf_weight 数组长度 |
| dc_weitcur | 暗通道部分权重，范围 [0, 1]；原文提到默认值但未给出数值。 |
| dc_weitcur_len | dc_weitcur 数组长度 |
| range_sigma | 双边滤波值域 sigma，范围 [0, 1]，默认值 0.4。 |
| range_sigma_len | range_sigma 数组长度 |
| space_sigma_pre | 以 IIR 数据为参考时的双边滤波空间域 sigma，范围 [0, 1]，默认值 0.4。 |
| space_sigma_pre_len | space_sigma_pre 数组长度 |
| space_sigma_cur | 以当前数据为参考时的双边滤波空间域 sigma，范围 [0, 1]，默认值 0.8。 |
| space_sigma_cur_len | space_sigma_cur 数组长度 |

<!-- Source EN PDF p.283; unit 3050 -->

9.6.4.3  Dehaze_Setting_V21_t

<!-- Source EN PDF p.283; unit 3051 -->

【说明】定义自动去雾功能参数。

<!-- Source EN PDF p.283; unit 3052 -->

【定义】

<!-- Source EN PDF p.283; unit 3053 -->

```text
 typedef struct Dehaze_Setting_V21_s{
     bool            en;
     bool            air_lc_en;
     float           stab_fnum;
     float           sigma;
     float           wt_sigma;
     float           air_sigma;
     float           tmax_sigma;
     float           pre_wet;
     DehazeDataV21_t DehazeData;
 } Dehaze_Setting_V21_t;
```

<!-- Source EN PDF p.283; unit 3054 -->

【成员】

<!-- Source EN PDF p.283; unit 3055 -->

| 成员名称 | 说明 |
|---|---|
| en | 开关功能 |
| air_lc_en | 是否使用 Airlight Base 在 Airlight 上切换最小值（原文表述不清）。 |
| stab_fnum | 帧稳定的最大值。 |
| sigma | IIR 控制的 sigma。 |
| wt_sigma | 帧间 WT 滤波系数。 |
| air_sigma | 帧间 AIR 滤波系数。 |
| tmax_sigma | 帧间 Tmax 滤波系数。 |
| pre_wet | 参考数据 IIR 滤波因子。 |
| DehazeData | 去雾调试参数。 |

<!-- Source EN PDF p.283; unit 3056 -->

9.6.4.4  EnhanceDataV21_t

<!-- Source EN PDF p.283; unit 3057 -->

【说明】定义自动增强调试参数属性。

<!-- Source EN PDF p.283; unit 3058 -->

【定义】

<!-- Source EN PDF p.284; unit 3059 -->

```text
 typedef struct EnhanceDataV21_s{
     float* EnvLv;
     int    EnvLv_len;
     float* enhance_value;
     int    enhance_value_len;
     float* enhance_chroma;
     int    enhance_chroma_len;
 } EnhanceDataV21_t;
```

<!-- Source EN PDF p.284; unit 3060 -->

【成员】

<!-- Source EN PDF p.284; unit 3061 -->

| 成员名称 | 说明 |
|---|---|
| EnvLv | 环境亮度 |
| EnvLv_len | 环境亮度数组长度。 |
| enhance_value | 通用对比度强度，范围 [0,16]，推荐范围 [1, 2]。 |
| enhance_value_len | enhance_value 数组长度 |
| enhance_chroma | 色度增强调整参数，范围 [0, 16]，推荐范围 [1, 2]。 |
| enhance_chroma_len | enhance_chroma 数组长度 |

<!-- Source EN PDF p.284; unit 3062 -->

9.6.4.5  Enhance_Setting_V21_t

<!-- Source EN PDF p.284; unit 3063 -->

【说明】定义自动增强功能参数属性。

<!-- Source EN PDF p.284; unit 3064 -->

【定义】

<!-- Source EN PDF p.284; unit 3065 -->

```text
 typedef struct Enhance_Setting_V21_s{
     bool             en;
     float            enhance_curve[CALIBDB_ADEHAZE_ENHANCE_CURVE_KNOTS_NUM];
     EnhanceDataV21_t EnhanceData;
 } Enhance_Setting_V21_t;
```

<!-- Source EN PDF p.284; unit 3066 -->

【成员】

<!-- Source EN PDF p.284; unit 3067 -->

| 成员名称 | 说明 |
|---|---|
| en | 增强功能开关。0：关闭；1：开启。 |
| enhance_curve | 低频曲线。 |
| EnhanceData | 增强调试参数。 |

<!-- Source EN PDF p.285; unit 3068 -->

9.6.4.6  Hist_setting_V21_t

<!-- Source EN PDF p.285; unit 3069 -->

【说明】定义自动 hist 调试参数属性。

<!-- Source EN PDF p.285; unit 3070 -->

【定义】

<!-- Source EN PDF p.285; unit 3071 -->

```text
 typedef struct HistDataV21_s{
     float* EnvLv;
     int    EnvLv_len;
     float* hist_gratio;
     int    hist_gratio_len;
     float* hist_th_off;
     int    hist_th_off_len;
     float* hist_k;
     int    hist_k_len;
     float* hist_min;
     int    hist_min_len;
     float* hist_scale;
     int    hist_scale_len;
     float* cfg_gratio;
     int    cfg_gratio_len;
 } HistDataV21_t;
```

<!-- Source EN PDF p.285; unit 3072 -->

【成员】

<!-- Source EN PDF p.286; unit 3073 -->

| 成员名称 | 说明 |
|---|---|
| EnvLv | 环境亮度 |
| EnvLv_len | EnvLv 数组长度 |
| hist_gratio | 直方图拉伸倍数、直方图均衡化控制系数，范围 [0, 32]。 |
| hist_gratio_len | hist_gratio 数组长度 |
| hist_th_off | 直方图统计阈值，范围 0 至 255，默认值 64。 |
| hist_th_off_len | hist_th_off 数组长度 |
| hist_k | 直方图自适应阈值放大倍数，范围 0 至 7，取值为 2。 |
| hist_k_len | hist_k 数组长度 |
| hist_min | 直方图统计阈值最小值，原文写范围为“0,2 to 0.016”，保留待核对。 |
| hist_min_len | hist_min 数组长度 |
| hist_scale | 直方图均衡化控制系数，范围 [0, 32]。 |
| hist_scale_len | hist_scale 数组长度 |
| cfg_gratio | 软件配置的直方图拉伸倍数、直方图均衡化控制系数，范围 [0, 32]。 |
| cfg_gratio_len | cfg_gratio 数组长度 |

<!-- Source EN PDF p.286; unit 3074 -->

9.6.4.7  Hist_setting_V21_t

<!-- Source EN PDF p.286; unit 3075 -->

【说明】定义自动 hist 功能参数属性。

<!-- Source EN PDF p.286; unit 3076 -->

【定义】

<!-- Source EN PDF p.286; unit 3077 -->

```text
 typedef struct Hist_setting_V21_s{
     bool          en;
     bool          hist_para_en;
     HistDataV21_t HistData;
 } Hist_setting_V21_t;
```

<!-- Source EN PDF p.286; unit 3078 -->

【成员】

<!-- Source EN PDF p.287; unit 3079 -->

| 成员名称 | 说明 |
|---|---|
| en | Hist 功能开关。 |
| hist_para_en | 直方图拉伸控制开关。 |
| HistData | hist 调试参数。 |

<!-- Source EN PDF p.287; unit 3080 -->

9.6.4.8  CalibDbDehazeV21_t

<!-- Source EN PDF p.287; unit 3081 -->

【说明】定义自动去雾模块调试参数属性。

<!-- Source EN PDF p.287; unit 3082 -->

【定义】

<!-- Source EN PDF p.287; unit 3083 -->

```text
 typedef struct CalibDbDehazeV21_s{
     bool                  Enable;
     float                 cfg_alpha;
     float                 ByPassThr;
     Dehaze_Setting_V21_t  dehaze_setting;
     Enhance_Setting_V21_t enhance_setting;
     Hist_setting_V21_t    hist_setting;
 } CalibDbDehazeV21_t;
```

<!-- Source EN PDF p.287; unit 3084 -->

【成员】

<!-- Source EN PDF p.287; unit 3085 -->

| 成员名称 | 说明 |
|---|---|
| Enable | 开关功能 |
| cfg_alpha | 手动软件配置比例，范围 0、1，默认值 1，精度 0.01。 |
| dehaze_setting | 自动去雾功能参数。 |
| enhance_setting | 自动增强功能参数。 |
| hist_setting | 自动 hist 功能参数 |

<!-- Source EN PDF p.287; unit 3086 -->

9.6.4.9  CalibDbV2_dehaze_v21_t

<!-- Source EN PDF p.287; unit 3087 -->

【说明】定义自动去雾模块属性。

<!-- Source EN PDF p.287; unit 3088 -->

【定义】

<!-- Source EN PDF p.287; unit 3089 -->

```text
 typedef struct CalibDbV2_dehaze_V21_s{
     CalibDbDehazeV21_t DehazeTuningPara;
 } CalibDbV2_dehaze_V21_t;
```

<!-- Source EN PDF p.287; unit 3090 -->

【成员】

<!-- Source EN PDF p.288; unit 3091 -->

| 成员名称 | 说明 |
|---|---|
| DehazeTuningPara | 自动去雾模块调试参数 |

<!-- Source EN PDF p.288; unit 3092 -->

9.6.4.10  mDehazeDataV21_t

<!-- Source EN PDF p.288; unit 3093 -->

【说明】定义手动 DehazeData 属性。

<!-- Source EN PDF p.288; unit 3094 -->

【定义】

<!-- Source EN PDF p.288; unit 3095 -->

```text
 typedef struct mDehazeDataV21_s {
     float dc_min_th;
     float dc_max_th;
     float yhist_th;
     float yblk_th;
     float dark_th;
     float bright_min;
     float bright_max;
     float wt_max;
     float air_min;
     float air_max;
     float tmax_base;
     float tmax_off;
     float tmax_max;
     float cfg_wt;
     float cfg_air;
     float cfg_tmax;
     float dc_weitcur;
     float bf_weight;
     float range_sigma;
     float space_sigma_pre;
     float space_sigma_cur;
 } mDehazeDataV21_t;
```

<!-- Source EN PDF p.288; unit 3096 -->

【成员】

<!-- Source EN PDF p.289; unit 3097 -->

| 成员名 | 说明 |
|---|---|
| dc_min_th | WT 自适应统计范围，取值 [16, 120]，默认值 64，精度 0.1。 |
| dc_max_th | WT 自适应高曝光区域统计范围，取值 [170, 255]，默认值 192，精度 0.1。 |
| yhist_th | Y 分量高曝光区域统计范围，取值 [170, 255]，默认值 249，精度 0.1。 |
| yblk_th | Y 分量块数量比例阈值，范围 [0.002, 0.01]，默认值 0.002，精度 0.1。 |
| dark_th | WT 自适应 Y 分量块最小阈值，范围 [230, 250]，默认值 250，精度 0.1。 |
| bright_min | AIR 自适应阈值最小值，范围 [160, 200]，默认值 180，精度 0.1。 |
| bright_max | AIR 自适应阈值最大值，范围 [210, 250]，默认值 240，精度 0.1。 |
| wt_max | wt 自适应最大值限制，范围 [0.75, 0.9]，默认值 0.9，精度 0.001。 |
| air_min | air 自适应最小值限制，范围 [200, 220]，默认值 200，精度 0.001。 |
| air_max | AIR 自适应最大值限制，范围 [230, 250]，默认值 250，精度 0.001。 |
| tmax_base | tmax 自适应基准值，默认 125；对应配置：200 (131)、210 (125)、220 (119)、230 (114)、240 (109)、250 (105)，推荐 131-105。 |
| tmax_off | Tmax 自适应固定值，范围 [0.1, 0.5]，默认值 0.1，精度 0.1。 |
| tmax_max | tmax 自适应最大值，范围 [0.1, 0.5]，默认值 0.5，精度 0.1。 |
| cfg_wt | 软件配置 wt（图像去雾强度），范围 [0, 1]，默认值 0.8，精度 0.001。 |
| cfg_air | 软件配置 air（大气光系数），范围 [0, 255]，默认值 210，精度 0.001。 |
| cfg_tmax | 软件配置 tmax（去雾最大值），范围 [0, 1]，默认值 0.2，精度 0.001。 |
| bf_weight | 两个双边滤波器的合成权重，范围 [0, 1]，默认值 0.5，精度 0.1。 |
| dc_weitcur | 暗通道部分的双边权重，范围 [0, 1]，默认值 1，精度 0.1。 |
| range_sigma | 双边滤波值域 sigma，范围 [0, 1]，默认值 0.4，精度 0.1。 |

<!-- Source EN PDF p.290; unit 3098 -->

| 成员名 | 说明 |
|---|---|
| space_sigma_pre | 以 IIR 数据为参考时的双边滤波空间域 sigma，范围 [0, 1]，默认值 0.4，精度 0.1。 |
| space_sigma_cur | 以当前数据为参考时的双边滤波空间域 sigma，范围 [0, 1]，默认值 0.8，精度 0.1。 |

<!-- Source EN PDF p.290; unit 3099 -->

9.6.4.11  mDehaze_setting_v21_t

<!-- Source EN PDF p.290; unit 3100 -->

【说明】定义手动去雾功能属性。

<!-- Source EN PDF p.290; unit 3101 -->

【定义】

<!-- Source EN PDF p.290; unit 3102 -->

```text
 typedef struct mDehaze_setting_v21_s {
     bool             en;
     bool             air_lc_en;
     float            stab_fnum;
     float            sigma;
     float            wt_sigma;
     float            air_sigma;
     float            tmax_sigma;
     float            pre_wet;
     mDehazeDataV21_t DehazeData;
 } mDehaze_setting_V21_t;
```

<!-- Source EN PDF p.290; unit 3103 -->

【成员】

<!-- Source EN PDF p.291; unit 3104 -->

| 成员名称 | 说明 |
|---|---|
| en | 开关功能 |
| air_lc_en | 是否使用 Airlight Base 进行最小值截断的开关。 |
| stab_fnum | 帧稳定最大值，范围 [0,31]，默认值 8，精度 0.01。 |
| sigma | IIR 控制的 sigma，范围 0,255，默认值 6，精度 1。 |
| wt_sigma | 帧间 wt 滤波系数，范围 [0,255]，默认值 8，精度 1。 |
| air_sigma | 帧间 air 滤波系数，范围 0,255，默认值 12，精度 1。 |
| tmax_sigma | 帧间 Tmax 滤波系数，范围 [0,1]，默认值 0.01，精度 0.0001。 |
| pre_wet | 参考数据 IIR 滤波系数，范围 [0,1]，默认值 0.01，精度 0.0001。 |
| DehazeData | 去雾调试参数 |

<!-- Source EN PDF p.291; unit 3105 -->

9.6.4.12  mEnhanceDataV21_t

<!-- Source EN PDF p.291; unit 3106 -->

【说明】定义手动 EnhanceData 属性。

<!-- Source EN PDF p.291; unit 3107 -->

【定义】

<!-- Source EN PDF p.291; unit 3108 -->

```text
 typedef struct mEnhanceDataV21_s {
     float enhance_value;
     float enhance_chroma;
 } mEnhanceDataV21_t;
```

<!-- Source EN PDF p.291; unit 3109 -->

【成员】

<!-- Source EN PDF p.291; unit 3110 -->

| 成员名称 | 说明 |
|---|---|
| enhance_value | 全局对比度强度，范围 [0,16]，默认值 1.0，精度 0.001。 |
| enhance_chroma | 色度增强调整参数，范围 [0,16]，默认值 1.0，精度 0.001。 |

<!-- Source EN PDF p.292; unit 3111 -->

9.6.4.13  mEnhance_setting_v21_t

<!-- Source EN PDF p.292; unit 3112 -->

【说明】定义手动增强功能属性。

<!-- Source EN PDF p.292; unit 3113 -->

【定义】

<!-- Source EN PDF p.292; unit 3114 -->

```text
 typedef struct mEnhance_Setting_V21_s {
     bool              en;
     float             enhance_curve[CALIBDB_ADEHAZE_ENHANCE_CURVE_KNOTS_NUM];
     mEnhanceDataV21_t EnhanceData;
 } mEnhance_Setting_V21_t;
```

<!-- Source EN PDF p.292; unit 3115 -->

【成员】

<!-- Source EN PDF p.292; unit 3116 -->

| 成员名称 | 说明 |
|---|---|
| en | 增强功能开关 |
| enhance_curve | 低频曲线 |
| EnhanceData | 增强调试参数 |

<!-- Source EN PDF p.292; unit 3117 -->

9.6.4.14  mHistDataV21_t

<!-- Source EN PDF p.292; unit 3118 -->

【说明】定义手动 HistData 属性。

<!-- Source EN PDF p.292; unit 3119 -->

【定义】

<!-- Source EN PDF p.292; unit 3120 -->

```text
 typedef struct mHistDataV21_s {
     float hist_gratio;
     float hist_th_off;
     float hist_k;
     float hist_min;
     float hist_scale;
     float cfg_gratio;
 } mHistDataV21_t;
```

<!-- Source EN PDF p.292; unit 3121 -->

【成员】

<!-- Source EN PDF p.293; unit 3122 -->

| 成员名称 | 说明 |
|---|---|
| hist_gratio | 直方图拉伸倍数、直方图均衡化控制系数，范围 [0, 32]，精度 0.01；原文未给出默认值。 |
| hist_th_off | 直方图统计阈值，范围 [0, 255]，默认值 64，精度 0.01。 |
| hist_k | 直方图自适应阈值放大倍数，范围 [0, 7)，默认值 2，精度 0.01。 |
| hist_min | 直方图统计阈值最小值，范围 [0,2)，默认值 0.016，精度 0.01。 |
| hist_scale | 直方图均衡化控制系数，范围 [0, 32]，默认值 0.9，精度 0.01。 |
| cfg_gratio | 软件配置的直方图拉伸倍数、直方图均衡化控制系数，范围 [0, 32)，默认值 1，精度 0.01。 |

<!-- Source EN PDF p.293; unit 3123 -->

9.6.4.15  mHist_setting_v21_t

<!-- Source EN PDF p.293; unit 3124 -->

【说明】定义手动 Hist 功能属性。

<!-- Source EN PDF p.293; unit 3125 -->

【定义】

<!-- Source EN PDF p.293; unit 3126 -->

```text
 typedef struct mHist_setting_V21_s {
     bool           en;
     bool           hist_para_en;
     mHistDataV21_t HistData;
 } mHist_setting_V21_t;
```

<!-- Source EN PDF p.293; unit 3127 -->

【成员】

<!-- Source EN PDF p.293; unit 3128 -->

| 成员名称 | 说明 |
|---|---|
| en | Hist 功能开关。 |
| hist_para_en | 直方图拉伸控制开关。 |
| HistData | Hist 调试参数。 |

<!-- Source EN PDF p.293; unit 3129 -->

9.6.4.16  mDehazeAttr_t

<!-- Source EN PDF p.293; unit 3130 -->

【说明】定义手动去雾模块属性。

<!-- Source EN PDF p.293; unit 3131 -->

【定义】

<!-- Source EN PDF p.294; unit 3132 -->

```text
 typedef struct mDehazeAttr_s {
     bool                   Enable;
     float                  cfg_alpha;
     mDehaze_Setting_V21_t  dehaze_setting;
     mEnhance_Setting_V21_t enhance_setting;
     mHist_setting_V21_t    hist_setting;
 } mDehazeAttr_t;
```

<!-- Source EN PDF p.294; unit 3133 -->

【成员】

<!-- Source EN PDF p.294; unit 3134 -->

| 成员名称 | 说明 |
|---|---|
| Enable | 开关功能。 |
| cfg_alpha | 手动软件配置比例，范围 [0,1]，默认值 1，精度 0.01。 |
| dehaze_setting | 手动去雾功能参数 |
| enhance_setting | 手动增强功能参数 |
| hist_setting | 手动 Hist 功能参数 |

<!-- Source EN PDF p.294; unit 3135 -->

9.6.4.17  adehaze_sw_v2_t

<!-- Source EN PDF p.294; unit 3136 -->

【说明】定义去雾属性。

<!-- Source EN PDF p.294; unit 3137 -->

【定义】

<!-- Source EN PDF p.294; unit 3138 -->

```text
 typedef struct adehaze_sw_V2_s {
     rk_aiq_uapi_sync_t     sync;
     dehaze_api_mode_t      mode;
     CalibDbV2_dehaze_V21_t stAuto;
     mDehazeAttr_t          stManual;
     DehazeManuAttr_t       stDehazeManu;
     EnhanceManuAttr_t      stEnhanceManu;
 } adehaze_sw_V2_t;
```

<!-- Source EN PDF p.294; unit 3139 -->

【成员】

<!-- Source EN PDF p.294; unit 3140 -->

| 成员名称 | 说明 |
|---|---|
| sync | rk_aiq_uapi_sync_t 定义参见“概述/API 说明”。 |
| mode | API 模式。 |
| stAuto | 自动去雾模块参数。 |
| stManual | 手动去雾模块参数。 |
| stDehazeManu | 去雾等级参数，请勿使用。 |
| stEnhanceManu | 对比度等级参数，请勿使用。 |

<!-- Source EN PDF p.295; unit 3141 -->

### 9.7   CPROC

<!-- Source EN PDF p.295; unit 3142 -->

#### 9.7.1 功能说明

<!-- Source EN PDF p.295; unit 3143 -->

CPRO（颜色处理）提供基本颜色调整功能，通过在一定范围内调整亮度、对比度、饱和度和色度，获得偏好的颜色效果。此模块作用于 YUV 域图像。

<!-- Source EN PDF p.295; unit 3144 -->

#### 9.7.2 功能级 API 参考

<!-- Source EN PDF p.295; unit 3145 -->

#### 9.7.3 模块级 API 参考

<!-- Source EN PDF p.295; unit 3146 -->

9.7.3.1  rk_aiq_user_api2_acp_SetAttrib

<!-- Source EN PDF p.295; unit 3147 -->

【说明】

<!-- Source EN PDF p.295; unit 3148 -->

设置 CPRO 模块属性。

<!-- Source EN PDF p.295; unit 3149 -->

【语法】

<!-- Source EN PDF p.295; unit 3150 -->

```text
 XCamReturn rk_aiq_user_api2_acp_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
```

<!-- Source EN PDF p.295; unit 3151 -->

【参数】

<!-- Source EN PDF p.295; unit 3152 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | CPROC 模块属性 | 输入 |

<!-- Source EN PDF p.295; unit 3153 -->

【返回值】

<!-- Source EN PDF p.295; unit 3154 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.295; unit 3155 -->

【依赖】

<!-- Source EN PDF p.295; unit 3156 -->

头文件：rk_aiq_user_api2_acp.h

<!-- Source EN PDF p.295; unit 3157 -->

库文件：librkaiq.so

<!-- Source EN PDF p.295; unit 3158 -->

9.7.3.2  rk_aiq_user_api2_acp_GetAttrib

<!-- Source EN PDF p.295; unit 3159 -->

【说明】

<!-- Source EN PDF p.295; unit 3160 -->

获取 CPRO 模块当前属性。

<!-- Source EN PDF p.296; unit 3161 -->

【语法】

<!-- Source EN PDF p.296; unit 3162 -->

```text
 XCamReturn rk_aiq_user_api2_acp_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
                                         acp_attrib_t* attr);
```

<!-- Source EN PDF p.296; unit 3163 -->

【参数】

<!-- Source EN PDF p.296; unit 3164 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | CPROC 模块属性 | 输出 |

<!-- Source EN PDF p.296; unit 3165 -->

【返回值】

<!-- Source EN PDF p.296; unit 3166 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.296; unit 3167 -->

【依赖】

<!-- Source EN PDF p.296; unit 3168 -->

头文件：rk_aiq_user_api2_acp.h

<!-- Source EN PDF p.296; unit 3169 -->

库文件：librkaiq.so

<!-- Source EN PDF p.296; unit 3170 -->

#### 9.7.4 模块级 API 数据类型

<!-- Source EN PDF p.296; unit 3171 -->

9.7.4.1  acp_attrib_t

<!-- Source EN PDF p.296; unit 3172 -->

【说明】定义 CPROC 模块参数。

<!-- Source EN PDF p.296; unit 3173 -->

【定义】

<!-- Source EN PDF p.296; unit 3174 -->

```text
    typedef struct acp_attrib_s {
        uint8_t brightness; /* 0 ~ 255 */
        uint8_t contrast; /* 0 ~ 255 */
        uint8_t saturation; /* 0 ~ 255 */
        uint8_t hue; /* 0 ~ 255 */
    } acp_attrib_t;
```

<!-- Source EN PDF p.296; unit 3175 -->

【成员】

<!-- Source EN PDF p.297; unit 3176 -->

| 成员名称 | 说明 |
|---|---|
| brightness | 亮度，范围 [0,255]，对应范围 [-128,127]，默认值 128。 |
| contrast | 对比度，范围 [0,255]，对应倍数 [0, 1.992]，默认值 128。 |
| saturation | 饱和度，范围 [0,255]，对应倍数 [0, 1.992]，默认值 128。 |
| hue | 色度，范围 [0,255]，对应角度 [-90,87.188]，默认值 128。 |

<!-- Source EN PDF p.297; unit 3177 -->

### 9.8   IE

<!-- Source EN PDF p.297; unit 3178 -->

#### 9.8.1 功能说明

<!-- Source EN PDF p.297; unit 3179 -->

IE（图像特效）提供图像特效设置，例如黑白效果。此模块作用于 YUV 域图像。

<!-- Source EN PDF p.297; unit 3180 -->

#### 9.8.2 功能级 API 参考

<!-- Source EN PDF p.297; unit 3181 -->

#### 9.8.3 模块级 API 参考

<!-- Source EN PDF p.297; unit 3182 -->

9.8.3.1  rk_aiq_user_api2_aie_SetAttrib

<!-- Source EN PDF p.297; unit 3183 -->

【说明】

<!-- Source EN PDF p.297; unit 3184 -->

设置 IE 模块属性。

<!-- Source EN PDF p.297; unit 3185 -->

【语法】

<!-- Source EN PDF p.297; unit 3186 -->

```text
 XCamReturn rk_aiq_user_api2_aie_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
                                         aie_attrib_t attr);
```

<!-- Source EN PDF p.297; unit 3187 -->

【参数】

<!-- Source EN PDF p.297; unit 3188 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | IE 模块属性 | 输入 |

<!-- Source EN PDF p.297; unit 3189 -->

【返回值】

<!-- Source EN PDF p.297; unit 3190 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.297; unit 3191 -->

【依赖】

<!-- Source EN PDF p.298; unit 3192 -->

头文件：rk_aiq_user_api2_aie.h

<!-- Source EN PDF p.298; unit 3193 -->

库文件：librkaiq.so

<!-- Source EN PDF p.298; unit 3194 -->

9.8.3.2  rk_aiq_user_api2_aie_GetAttrib

<!-- Source EN PDF p.298; unit 3195 -->

【说明】

<!-- Source EN PDF p.298; unit 3196 -->

获取 IE 模块当前属性。

<!-- Source EN PDF p.298; unit 3197 -->

【语法】

<!-- Source EN PDF p.298; unit 3198 -->

```text
 XCamReturn rk_aiq_user_api2_aie_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
                                         aie_attrib_t* attr);
```

<!-- Source EN PDF p.298; unit 3199 -->

【参数】

<!-- Source EN PDF p.298; unit 3200 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | IE 模块属性 | 输出 |

<!-- Source EN PDF p.298; unit 3201 -->

【返回值】

<!-- Source EN PDF p.298; unit 3202 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.298; unit 3203 -->

【依赖】

<!-- Source EN PDF p.298; unit 3204 -->

头文件：rk_aiq_user_api2_aie.h

<!-- Source EN PDF p.298; unit 3205 -->

库文件：librkaiq.so

<!-- Source EN PDF p.298; unit 3206 -->

#### 9.8.4 模块级 API 数据类型

<!-- Source EN PDF p.298; unit 3207 -->

9.8.4.1  aie_attrib_t

<!-- Source EN PDF p.298; unit 3208 -->

【说明】定义 IE 模块参数。

<!-- Source EN PDF p.298; unit 3209 -->

【定义】

<!-- Source EN PDF p.298; unit 3210 -->

```text
   typedef struct aie_attrib_s {
        rk_aiq_ie_effect_t mode;
   } aie_attrib_t;
```

<!-- Source EN PDF p.298; unit 3211 -->

【成员】

<!-- Source EN PDF p.299; unit 3212 -->

| 成员名称 | 说明 |
|---|---|
| mode | 特效类型 |

<!-- Source EN PDF p.299; unit 3213 -->

9.8.4.2  rk_aiq_ie_effect_t

<!-- Source EN PDF p.299; unit 3214 -->

【说明】定义 IE 特效类型。

<!-- Source EN PDF p.299; unit 3215 -->

【定义】

<!-- Source EN PDF p.299; unit 3216 -->

```text
    typedef enum rk_aiq_ie_effect_e {
        RK_AIQ_IE_EFFECT_NONE,
        RK_AIQ_IE_EFFECT_BW,
        RK_AIQ_IE_EFFECT_NEGATIVE,
        RK_AIQ_IE_EFFECT_SEPIA,
        RK_AIQ_IE_EFFECT_EMBOSS,
       RK_AIQ_IE_EFFECT_SKETCH,
        RK_AIQ_IE_EFFECT_SHARPEN, /*!< deprecated */
   } rk_aiq_ie_effect_t;
```

<!-- Source EN PDF p.299; unit 3217 -->

【成员】

<!-- Source EN PDF p.299; unit 3218 -->

| 成员名称 | 说明 |
|---|---|
| RK_AIQ_IE_EFFECT_NONE | 无特效 |
| RK_AIQ_IE_EFFECT_BW | 黑白效果 |
| RK_AIQ_IE_EFFECT_NEGATIVE | 负片效果，不支持 |
| RK_AIQ_IE_EFFECT_SEPIA | 深棕色效果 |
| RK_AIQ_IE_EFFECT_EMBOSS | 浮雕效果 |
| RK_AIQ_IE_EFFECT_SKETCH | 素描效果 |
| RK_AIQ_IE_EFFECT_SHARPEN | 不支持 |

<!-- Source EN PDF p.299; unit 3219 -->

### 9.9   CSM

<!-- Source EN PDF p.299; unit 3220 -->

#### 9.9.1 功能说明

<!-- Source EN PDF p.299; unit 3221 -->

CSM（颜色空间矩阵）可设置 RGB 转 YUV 过程中的参数。

<!-- Source EN PDF p.300; unit 3222 -->

#### 9.9.2 功能级 API 参考

<!-- Source EN PDF p.300; unit 3223 -->

#### 9.9.3 模块级 API 参考

<!-- Source EN PDF p.300; unit 3224 -->

9.9.3.1  rk_aiq_user_api2_acsm_SetAttrib

<!-- Source EN PDF p.300; unit 3225 -->

【说明】

<!-- Source EN PDF p.300; unit 3226 -->

设置 CSM 模块属性。

<!-- Source EN PDF p.300; unit 3227 -->

【语法】

<!-- Source EN PDF p.300; unit 3228 -->

```text
 XCamReturn rk_aiq_user_api2_acsm_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapi_acsm_attrib_t attr);
```

<!-- Source EN PDF p.300; unit 3229 -->

【参数】

<!-- Source EN PDF p.300; unit 3230 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | CSM 模块属性 | 输入 |

<!-- Source EN PDF p.300; unit 3231 -->

【返回值】

<!-- Source EN PDF p.300; unit 3232 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.300; unit 3233 -->

【依赖】

<!-- Source EN PDF p.300; unit 3234 -->

头文件：rk_aiq_user_api2_acsm.h

<!-- Source EN PDF p.300; unit 3235 -->

库文件：librkaiq.so

<!-- Source EN PDF p.300; unit 3236 -->

【注意事项】

<!-- Source EN PDF p.300; unit 3237 -->

attr.param.op_mode = RK_AIQ_OP_MODE_AUTO 时使用 AIQ 内置 CSM 默认参数；attr.param.op_mode = RK_AIQ_OP_MODE_MANUAL 时可配置 CSM 参数。

<!-- Source EN PDF p.300; unit 3238 -->

attr.param.full_range 只能配置为 TRUE；限幅范围可在 CGC 模块配置。

<!-- Source EN PDF p.300; unit 3239 -->

9.9.3.2  rk_aiq_user_api2_acsm_GetAttrib

<!-- Source EN PDF p.300; unit 3240 -->

【说明】

<!-- Source EN PDF p.300; unit 3241 -->

获取 CSM 模块当前属性。

<!-- Source EN PDF p.300; unit 3242 -->

【语法】

<!-- Source EN PDF p.301; unit 3243 -->

```text
 XCamReturn rk_aiq_user_api2_acsm_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapi_acsm_attrib_t* attr);
```

<!-- Source EN PDF p.301; unit 3244 -->

【参数】

<!-- Source EN PDF p.301; unit 3245 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | CSM 模块属性 | 输出 |

<!-- Source EN PDF p.301; unit 3246 -->

【返回值】

<!-- Source EN PDF p.301; unit 3247 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.301; unit 3248 -->

【依赖】

<!-- Source EN PDF p.301; unit 3249 -->

头文件：rk_aiq_user_api2_acsm.h

<!-- Source EN PDF p.301; unit 3250 -->

库文件：librkaiq.so

<!-- Source EN PDF p.301; unit 3251 -->

#### 9.9.4 模块级 API 数据类型

<!-- Source EN PDF p.301; unit 3252 -->

9.9.4.1 rk_aiq_uapi_acsm_attrib_t

<!-- Source EN PDF p.301; unit 3253 -->

【说明】定义 CSM 模块参数。

<!-- Source EN PDF p.301; unit 3254 -->

【定义】

<!-- Source EN PDF p.301; unit 3255 -->

```text
   typedef struct rk_aiq_uapi_acsm_attrib_s {
       rk_aiq_uapi_sync_t sync;
       rk_aiq_acsm_params_t param;
   } rk_aiq_uapi_acsm_attrib_t;
```

<!-- Source EN PDF p.301; unit 3256 -->

【成员】

<!-- Source EN PDF p.301; unit 3257 -->

| 成员名称 | 说明 |
|---|---|
| sync | rk_aiq_uapi_sync_t 的定义参见“概述/API 说明”。 |
| rk_aiq_acsm_params_t | CSM 参数。 |

<!-- Source EN PDF p.302; unit 3258 -->

9.9.4.2 rk_aiq_acsm_params_t

<!-- Source EN PDF p.302; unit 3259 -->

【说明】定义 CSM 模块参数。

<!-- Source EN PDF p.302; unit 3260 -->

【定义】

<!-- Source EN PDF p.302; unit 3261 -->

```text
 typedef struct __csm_param {
     RKAiqOPMode_t op_mode;
     bool full_range;
     uint8_t y_offset;
     uint8_t c_offset;
     float coeff[RK_AIQ_CSM_COEFF_NUM];
 } Csm_Param_t;
```

<!-- Source EN PDF p.302; unit 3262 -->

【成员】

<!-- Source EN PDF p.302; unit 3263 -->

| 成员名称 | 说明 |
|---|---|
| op_mode | 模式：RK_AIQ_OP_MODE_AUTO 或 RK_AIQ_OP_MODE_MANUAL。 |
| full_range | 是否输出完整范围，默认 TRUE。注意：ISP30 此属性只能为 TRUE；限制范围建议通过 CGC 模块 API 配置。 |
| y_offset | 亮度偏移，范围 [0,63]，默认 0。 |
| c_offset | 色度偏移，范围 [0,255]，默认 0。 |
| coeff | RGB 转 YUV 的 3×3 矩阵，范围 [-2,1.992]，默认 [0.299,0.587,0.114,-0.169,-0.331,0.5,0.5,-0.419,-0.081]。 |

<!-- Source EN PDF p.302; unit 3264 -->

### 9.10 锐化

<!-- Source EN PDF p.302; unit 3265 -->

#### 9.10.1 功能说明

<!-- Source EN PDF p.302; unit 3266 -->

Sharpen 模块增强图像清晰度，包括调整边缘锐化属性，以及增强图像细节和纹理。

<!-- Source EN PDF p.303; unit 3267 -->

#### 9.10.2 功能级 API 参考

<!-- Source EN PDF p.303; unit 3268 -->

9.10.2.1 rk_aiq_uapi2_setSharpness

<!-- Source EN PDF p.303; unit 3269 -->

【说明】

<!-- Source EN PDF p.303; unit 3270 -->

设置锐化等级。

<!-- Source EN PDF p.303; unit 3271 -->

【语法】

<!-- Source EN PDF p.303; unit 3272 -->

```text
 XCamReturn rk_aiq_uapi2_setSharpness(const rk_aiq_sys_ctx_t* ctx, unsigned int
 level);
```

<!-- Source EN PDF p.303; unit 3273 -->

【参数】

<!-- Source EN PDF p.303; unit 3274 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| level | 锐化等级范围 [0,100]，默认 50。 | 输入 |

<!-- Source EN PDF p.303; unit 3275 -->

【返回值】

<!-- Source EN PDF p.303; unit 3276 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.303; unit 3277 -->

【依赖】

<!-- Source EN PDF p.303; unit 3278 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.303; unit 3279 -->

库文件：librkaiq.so

<!-- Source EN PDF p.303; unit 3280 -->

9.10.2.2 rk_aiq_uapi2_getSharpness

<!-- Source EN PDF p.303; unit 3281 -->

【说明】

<!-- Source EN PDF p.303; unit 3282 -->

获取锐化等级。

<!-- Source EN PDF p.303; unit 3283 -->

【语法】

<!-- Source EN PDF p.303; unit 3284 -->

```text
 XCamReturn rk_aiq_uapi2_getSharpness(const rk_aiq_sys_ctx_t* ctx, unsigned int*
 level);
```

<!-- Source EN PDF p.303; unit 3285 -->

【参数】

<!-- Source EN PDF p.303; unit 3286 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| level | 锐化等级。 | 输出 |

<!-- Source EN PDF p.304; unit 3287 -->

【返回值】

<!-- Source EN PDF p.304; unit 3288 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.304; unit 3289 -->

【依赖】

<!-- Source EN PDF p.304; unit 3290 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.304; unit 3291 -->

库文件：librkaiq.so

<!-- Source EN PDF p.304; unit 3292 -->

#### 9.10.3 模块级 API 参考

<!-- Source EN PDF p.304; unit 3293 -->

9.10.3.1 rk_aiq_user_api2_asharpV4_SetAttrib

<!-- Source EN PDF p.304; unit 3294 -->

【说明】设置锐化算法属性。

<!-- Source EN PDF p.304; unit 3295 -->

【语法】

<!-- Source EN PDF p.304; unit 3296 -->

```text
 XCamReturn
 rk_aiq_user_api2_asharpV4_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_sharp_attrib_v4_t* attr);
```

<!-- Source EN PDF p.304; unit 3297 -->

【参数】

<!-- Source EN PDF p.304; unit 3298 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 降噪参数属性 | 输入 |

<!-- Source EN PDF p.304; unit 3299 -->

【返回值】

<!-- Source EN PDF p.304; unit 3300 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.304; unit 3301 -->

【依赖】

<!-- Source EN PDF p.304; unit 3302 -->

头文件：rk_aiq_user_api2_asharp_v4.h、RkAiqHandleIntV3x.h。

<!-- Source EN PDF p.304; unit 3303 -->

库文件：librkaiq.so

<!-- Source EN PDF p.305; unit 3304 -->

9.10.3.2 rk_aiq_user_api2_asharpV4_GetAttrib

<!-- Source EN PDF p.305; unit 3305 -->

【说明】获取锐化算法属性。

<!-- Source EN PDF p.305; unit 3306 -->

【语法】

<!-- Source EN PDF p.305; unit 3307 -->

```text
 XCamReturn
 rk_aiq_user_api2_asharpV4_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_sharp_attrib_v4_t* attr);
```

<!-- Source EN PDF p.305; unit 3308 -->

【参数】

<!-- Source EN PDF p.305; unit 3309 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 降噪参数属性 | 输入 |

<!-- Source EN PDF p.305; unit 3310 -->

【返回值】

<!-- Source EN PDF p.305; unit 3311 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.305; unit 3312 -->

【依赖】

<!-- Source EN PDF p.305; unit 3313 -->

头文件：rk_aiq_user_api2_asharp_v4.h、RkAiqHandleIntV3x.h。

<!-- Source EN PDF p.305; unit 3314 -->

库文件：librkaiq.so

<!-- Source EN PDF p.305; unit 3315 -->

9.10.3.3 rk_aiq_user_api2_asharpV4_SetStrength

<!-- Source EN PDF p.305; unit 3316 -->

【说明】设置锐化强度。

<!-- Source EN PDF p.305; unit 3317 -->

【语法】

<!-- Source EN PDF p.305; unit 3318 -->

```text
 XCamReturn
 rk_aiq_user_api2_asharpV4_SetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_sharp_strength_v4_t *pStrength);
```

<!-- Source EN PDF p.305; unit 3319 -->

【参数】

<!-- Source EN PDF p.305; unit 3320 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| pStrength | 锐化强度结构指针；结构内 percentage 范围 0.0-1.0。 | 输入 |

<!-- Source EN PDF p.306; unit 3321 -->

【返回值】

<!-- Source EN PDF p.306; unit 3322 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.306; unit 3323 -->

【依赖】

<!-- Source EN PDF p.306; unit 3324 -->

头文件：rk_aiq_user_api2_asharp_v4.h、RkAiqHandleIntV3x.h。

<!-- Source EN PDF p.306; unit 3325 -->

库文件：librkaiq.so

<!-- Source EN PDF p.306; unit 3326 -->

9.10.3.4 rk_aiq_user_api2_asharpV4_GetStrength

<!-- Source EN PDF p.306; unit 3327 -->

【说明】获取锐化强度。

<!-- Source EN PDF p.306; unit 3328 -->

【语法】

<!-- Source EN PDF p.306; unit 3329 -->

```text
 XCamReturn
 rk_aiq_user_api2_asharpV4_GetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_sharp_strength_v4_t *pStrength);
```

<!-- Source EN PDF p.306; unit 3330 -->

【参数】

<!-- Source EN PDF p.306; unit 3331 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| pStrength | 锐化强度结构指针；结构内 percentage 范围 0.0-1.0。 | 输入 |

<!-- Source EN PDF p.306; unit 3332 -->

【返回值】

<!-- Source EN PDF p.306; unit 3333 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.306; unit 3334 -->

【依赖】

<!-- Source EN PDF p.306; unit 3335 -->

头文件：rk_aiq_user_api2_asharp_v4.h、RkAiqHandleIntV3x.h。

<!-- Source EN PDF p.306; unit 3336 -->

库文件：librkaiq.so

<!-- Source EN PDF p.307; unit 3337 -->

#### 9.10.4 模块级 API 数据类型

<!-- Source EN PDF p.307; unit 3338 -->

9.10.4.1 rk_aiq_sharp_attrib_v4_t

<!-- Source EN PDF p.307; unit 3339 -->

【说明】定义锐化模块参数。

<!-- Source EN PDF p.307; unit 3340 -->

【定义】

<!-- Source EN PDF p.307; unit 3341 -->

```text
 typedef struct rk_aiq_sharp_attrib_v4_s {
     rk_aiq_uapi_sync_t sync;
     Asharp4_OPMode_t eMode;
     Asharp_Auto_Attr_V4_t stAuto;
     Asharp_Manual_Attr_V4_t stManual;
 } rk_aiq_sharp_attrib_v4_t;
```

<!-- Source EN PDF p.307; unit 3342 -->

【成员】

<!-- Source EN PDF p.307; unit 3343 -->

| 成员名称 | 说明 |
|---|---|
| sync | 同步/异步模式选择，见概述/API 说明部分。 |
| eMode | Sharpen 模块属性。 |
| stAuto | Sharpen 模块自动模式参数。 |

<!-- Source EN PDF p.307; unit 3344 -->

9.10.4.2 Asharp4_OPMode_t

<!-- Source EN PDF p.307; unit 3345 -->

【说明】

<!-- Source EN PDF p.307; unit 3346 -->

【定义】

<!-- Source EN PDF p.307; unit 3347 -->

```text
 typedef enum Asharp4_OPMode_e {
     ASHARP4_OP_MODE_INVALID           = 0,
     ASHARP4_OP_MODE_AUTO              = 1,
     ASHARP4_OP_MODE_MANUAL            = 2,
     ASHARP4_OP_MODE_REG_MANUAL        = 3,
     ASHARP4_OP_MODE_MAX
 } Asharp4_OPMode_t;
```

<!-- Source EN PDF p.307; unit 3348 -->

【成员】

<!-- Source EN PDF p.308; unit 3349 -->

| 成员名称 | 说明 |
|---|---|
| ASHARP4_OP_MODE_INVALID | Sharpen 模块无效模式。 |
| ASHARP4_OP_MODE_AUTO | Sharpen 模块自动模式。 |
| ASHARP4_OP_MODE_MANUAL | 锐化模块手动模式的算法设置。 |
| ASHARP4_OP_MODE_REG_MANUAL | 寄存器设置。 |
| ASHARP4_OP_MODE_MAX | Sharpen 模块模式最大值，为无效模式。 |

<!-- Source EN PDF p.308; unit 3350 -->

9.10.4.3 Asharp_Auto_Attr_V4_t

<!-- Source EN PDF p.308; unit 3351 -->

【说明】定义锐化模块自动模式中各 ISO 对应的算法属性参数。

<!-- Source EN PDF p.308; unit 3352 -->

【定义】

<!-- Source EN PDF p.308; unit 3353 -->

```text
 typedef struct Asharp_Auto_Attr_V4_s
 {
     RK_SHARP_Params_V4_t stParams;
     RK_SHARP_Params_V4_Select_t stSelect;
 } Asharp_Auto_Attr_V4_t;
```

<!-- Source EN PDF p.308; unit 3354 -->

【成员】

<!-- Source EN PDF p.308; unit 3355 -->

| 成员名称 | 说明 |
|---|---|
| stParams | SHARP 模块各 ISO 对应的算法属性参数。 |
| stSelect | Sharp 模块计算属性参数。 |

<!-- Source EN PDF p.308; unit 3356 -->

9.10.4.4 Asharp_Manual_Attr_V4_t

<!-- Source EN PDF p.308; unit 3357 -->

【说明】定义锐化模块手动属性。

<!-- Source EN PDF p.308; unit 3358 -->

【定义】

<!-- Source EN PDF p.309; unit 3359 -->

```text
 typedef struct Asharp_Manual_Attr_V4_s
 {
     RK_SHARP_Params_V4_Select_t stSelect;
     RK_SHARP_Fix_V4_t stFix;
 } Asharp_Manual_Attr_V4_t;
```

<!-- Source EN PDF p.309; unit 3360 -->

【成员】

<!-- Source EN PDF p.309; unit 3361 -->

| 成员名称 | 说明 |
|---|---|
| stSelect | Sharp 手动算法参数。 |
| stFix | Sharp 寄存器值。 |

<!-- Source EN PDF p.309; unit 3362 -->

9.10.4.5 RK_SHARP_Params_V4_t

<!-- Source EN PDF p.309; unit 3363 -->

【说明】定义锐化模块手动属性。

<!-- Source EN PDF p.309; unit 3364 -->

【定义】

<!-- Source EN PDF p.309; unit 3365 -->

```text
 typedef struct RK_SHARP_Params_V4_s
 {
     int enable;
     int iso[RK_SHARP_V4_MAX_ISO_NUM];
     short luma_point        [RK_SHARP_V4_LUMA_POINT_NUM];
     short luma_sigma        [RK_SHARP_V4_MAX_ISO_NUM]
 [RK_SHARP_V4_LUMA_POINT_NUM];
     float pbf_gain          [RK_SHARP_V4_MAX_ISO_NUM];
     float pbf_add           [RK_SHARP_V4_MAX_ISO_NUM];
     float pbf_ratio         [RK_SHARP_V4_MAX_ISO_NUM];
     float gaus_ratio        [RK_SHARP_V4_MAX_ISO_NUM];
     float sharp_ratio       [RK_SHARP_V4_MAX_ISO_NUM];
     short hf_clip        [RK_SHARP_V4_MAX_ISO_NUM][RK_SHARP_V4_LUMA_POINT_NUM];
     float bf_gain           [RK_SHARP_V4_MAX_ISO_NUM];
     float bf_add            [RK_SHARP_V4_MAX_ISO_NUM];
     float bf_ratio          [RK_SHARP_V4_MAX_ISO_NUM];
     short local_sharp_strength  [RK_SHARP_V4_MAX_ISO_NUM]
 [RK_SHARP_V4_LUMA_POINT_NUM];
     float prefilter_coeff[RK_SHARP_V4_MAX_ISO_NUM][RK_SHARP_V4_PBF_DIAM *
 RK_SHARP_V4_PBF_DIAM];
     float GaussianFilter_coeff   [RK_SHARP_V4_MAX_ISO_NUM][RK_SHARP_V4_RF_DIAM *
 RK_SHARP_V4_RF_DIAM];
     float hfBilateralFilter_coeff    [RK_SHARP_V4_MAX_ISO_NUM]
 [RK_SHARP_V4_BF_DIAM * RK_SHARP_V4_BF_DIAM];
 } RK_SHARP_Params_V4_t;
```

<!-- Source EN PDF p.310; unit 3366 -->

【成员】

<!-- Source EN PDF p.311; unit 3367 -->

| 参数名称 | 参数类型 | 简要说明。 |
|---|---|---|
| Enable | 调试参数 | Sharp 模块开关：1 开启，0 关闭。 |
| iso | 调试参数 | 不同 ISO 档对应不同调试参数，目前仅支持 13 档。 |
| pbf_gain | 调试参数 | 预滤波 sigma 的乘法比例。越大滤波越强、噪声与细节越少。范围 [0.0,2.0]，默认 1.0。 |
| pbf_add | 调试参数 | 预滤波 sigma 叠加偏移。越大滤波越强、噪声与细节越少。范围 [0,1023]，默认 0。 |
| pbf_ratio | 调试参数 | 预滤波融合权重。越大滤波越强、噪声与细节越少。范围 [0.0,1.0]，默认 0.5。 |
| gaus_ratio | 调试参数 | 高频双边滤波的引导图像为高斯滤波与原图的融合结果。值越大，高斯双边滤波的引导权重越大。范围 [0.0,1.0]，默认 0。 |
| sharp_ratio | 调试参数 | 锐化强度，值越大锐化越强。范围 [0.0,16]，默认 6。 |
| bf_gain | 调试参数 | 高频双边滤波 sigma 乘法比例。越大滤波越强、噪声与细节越少。范围 [0.0,2.0]，默认 1.0。 |
| bf_add | 调试参数 | 高频双边滤波 sigma 叠加偏移。越大滤波越强、噪声与细节越少。范围 [0,1023]，默认 0。 |
| bf_add | 调试参数 | 高频双边滤波融合权重。越大滤波越强、噪声与细节越少。范围 [0.0,1.0]，默认 0.5。 |

<!-- Source EN PDF p.312; unit 3368 -->

| 参数名称 | 参数类型 | 简要说明。 |
|---|---|---|
| luma_point / luma_sigma | 调试参数 | 不同像素亮度对应不同噪声 SIGMA 曲线。luma_point 为亮度值，范围 [0,1023]；luma_sigma 为噪声强度，范围 [0,1023]。 |
| luma_point / hf_clip | 调试参数 | 不同像素亮度的高频值裁剪范围。值越大，最大允许锐化强度越大。范围 [0,1023]，默认 256。 |
| luma_point / local_sharp_strength | 调试参数 | 不同像素亮度对应的高频叠加权重比例。值越大，允许叠加的高频越多，图像越锐利。范围 [0,1023]，默认 512。 |
| prefilter_coeff | 调试参数 | 预滤波算子。 |
| GaussianFilter_coeff | 调试参数 | 高斯滤波算子。 |
| hfBilateralFilter_coeff | 调试参数 | 高频双边滤波算子。 |

<!-- Source EN PDF p.312; unit 3369 -->

9.10.4.6 RK_SHARP_Params_V4_Select_t

<!-- Source EN PDF p.312; unit 3370 -->

【说明】定义锐化模块手动模式算法属性。

<!-- Source EN PDF p.312; unit 3371 -->

【定义】

<!-- Source EN PDF p.312; unit 3372 -->

```text
 typedef struct RK_SHARP_Params_V4_Select_s
 {
     int enable;
     short luma_point    [RK_SHARP_V4_LUMA_POINT_NUM];
     short luma_sigma    [RK_SHARP_V4_LUMA_POINT_NUM];
     float pbf_gain      ;
     float pbf_add       ;
     float pbf_ratio     ;
     float gaus_ratio    ;
     float sharp_ratio   ;
     short hf_clip       [RK_SHARP_V4_LUMA_POINT_NUM];
     float bf_gain       ;
     float bf_add        ;
     float bf_ratio      ;
     short local_sharp_strength        [RK_SHARP_V4_LUMA_POINT_NUM];
     float prefilter_coeff[RK_SHARP_V4_PBF_DIAM * RK_SHARP_V4_PBF_DIAM];
     float GaussianFilter_coeff   [RK_SHARP_V4_RF_DIAM * RK_SHARP_V4_RF_DIAM];
     float hfBilateralFilter_coeff    [RK_SHARP_V4_BF_DIAM * RK_SHARP_V4_BF_DIAM];
```

<!-- Source EN PDF p.313; unit 3373 -->

```text
 } RK_SHARP_Params_V4_Select_t;
```

<!-- Source EN PDF p.313; unit 3374 -->

【成员】

<!-- Source EN PDF p.314; unit 3375 -->

| 参数名称 | 参数类型 | 简要说明。 |
|---|---|---|
| Enable | 调试参数 | Sharp 模块开关：1 开启，0 关闭。 |
| iso | 调试参数 | 不同 ISO 档对应不同调试参数，目前仅支持 13 档。 |
| pbf_gain | 调试参数 | 预滤波 sigma 的乘法比例。越大滤波越强、噪声与细节越少。范围 [0.0,2.0]，默认 1.0。 |
| pbf_add | 调试参数 | 预滤波 sigma 叠加偏移。越大滤波越强、噪声与细节越少。范围 [0,1023]，默认 0。 |
| pbf_ratio | 调试参数 | 预滤波融合权重。越大滤波越强、噪声与细节越少。范围 [0.0,1.0]，默认 0.5。 |
| gaus_ratio | 调试参数 | 高频双边滤波的引导图像为高斯滤波与原图的融合结果。值越大，高斯双边滤波的引导权重越大。范围 [0.0,1.0]，默认 0。 |
| sharp_ratio | 调试参数 | 锐化强度，值越大锐化越强。范围 [0.0,16]，默认 6。 |
| bf_gain | 调试参数 | 高频双边滤波 sigma 乘法比例。越大滤波越强、噪声与细节越少。范围 [0.0,2.0]，默认 1.0。 |
| bf_add | 调试参数 | 高频双边滤波 sigma 叠加偏移。越大滤波越强、噪声与细节越少。范围 [0,1023]，默认 0。 |
| bf_add | 调试参数 | 高频双边滤波融合权重。越大滤波越强、噪声与细节越少。范围 [0.0,1.0]，默认 0.5。 |

<!-- Source EN PDF p.315; unit 3376 -->

| 参数名称 | 参数类型 | 简要说明。 |
|---|---|---|
| luma_point / luma_sigma | 调试参数 | 不同像素亮度对应不同噪声 SIGMA 曲线。luma_point 为亮度值，范围 [0,1023]；luma_sigma 为噪声强度，范围 [0,1023]。 |
| luma_point / hf_clip | 调试参数 | 不同像素亮度的高频值裁剪范围。值越大，最大允许锐化强度越大。范围 [0,1023]，默认 256。 |
| luma_point / local_sharp_strength | 调试参数 | 不同像素亮度对应的高频叠加权重比例。值越大，允许叠加的高频越多，图像越锐利。范围 [0,1023]，默认 512。 |
| prefilter_coeff | 调试参数 | 预滤波算子。 |
| GaussianFilter_coeff | 调试参数 | 高斯滤波算子。 |
| hfBilateralFilter_coeff | 调试参数 | 高频双边滤波算子。 |

<!-- Source EN PDF p.315; unit 3377 -->

9.10.4.7 RK_SHARP_Fix_V4_t

<!-- Source EN PDF p.315; unit 3378 -->

【说明】定义锐化模块手动模式寄存器配置。

<!-- Source EN PDF p.315; unit 3379 -->

【定义】

<!-- Source EN PDF p.315; unit 3380 -->

```text
 typedef struct RK_SHARP_Fix_V4_s
 {
     // SHARP_SHARP_EN (0x0000)
     uint8_t sharp_clk_dis;
     uint8_t sharp_exgain_bypass;
     uint8_t sharp_center_mode;
     uint8_t sharp_bypass;
     uint8_t sharp_en;
     // SHARP_SHARP_RATIO  (0x0004)
     uint8_t sharp_sharp_ratio;
     uint8_t sharp_bf_ratio;
     uint8_t sharp_gaus_ratio;
     uint8_t sharp_pbf_ratio;
     // SHARP_SHARP_LUMA_DX (0x0008)
     uint8_t sharp_luma_dx[7];
     // SHARP_SHARP_PBF_SIGMA_INV_0 (0x000c - 0x0014)
     uint16_t sharp_pbf_sigma_inv[8];
     // SHARP_SHARP_BF_SIGMA_INV_0 (0x0018 -  0x0020)
     uint16_t sharp_bf_sigma_inv[8];
     // SHARP_SHARP_SIGMA_SHIFT (0x00024)
     uint8_t sharp_bf_sigma_shift;
     uint8_t sharp_pbf_sigma_shift;
     // SHARP_SHARP_EHF_TH_0 (0x0028 -  0x0030)
     uint16_t sharp_ehf_th[8];
     // SHARP_SHARP_CLIP_HF_0 (0x0034 -  0x003c)
     uint16_t sharp_clip_hf[8];
     // SHARP_SHARP_PBF_COEF (0x00040)
     uint8_t sharp_pbf_coef[3];
     // SHARP_SHARP_BF_COEF (0x00044)
     uint8_t sharp_bf_coef[3];
     // SHARP_SHARP_GAUS_COEF (0x00048 - 0x0004c)
     uint8_t sharp_gaus_coef[6];
 } RK_SHARP_Fix_V4_t;
```

<!-- Source EN PDF p.316; unit 3381 -->

【成员】

<!-- Source EN PDF p.317; unit 3382 -->

| 参数名称 | 参数说明 |
|---|---|
| sharp_clk_dis | Sharp 时钟门控设置，目前不支持，默认 0。 |
| sharp_exgain_bypass | 是否旁路外部局部增益模块，目前不支持此设置，默认 0。 |
| sharp_center_mode | 是否以图像中心点为坐标进行锐化，目前不支持配置，默认 0。 |
| sharp_bypass | 锐化模块旁路：1 旁路，0 不旁路。 |
| sharp_en | Sharpen 模块使能：1 启用，0 禁用。 |
| sharp_sharp_ratio | sharp_ratio：锐化强度，0~15.9。 |
| sharp_bf_ratio | 双边滤波融合权重，0~1.0。 |
| sharp_gaus_ratio | gaus_ratio：高斯滤波融合权重，范围 [0.0,1.0]。 |
| sharp_pbf_ratio | 双边预滤波融合权重，范围 [0.0,1.0]，默认 0.5。 |
| sharp_luma_dx7 | 点 6 与点 7 的间距，实际距离为 2^sw_sharp_luma_dx7。 |
| sharp_luma_dx6 | 点 5 与点 6 的间距，实际距离为 2^sw_sharp_luma_dx6。 |
| sharp_luma_dx5 | 点 4 与点 5 的间距，实际距离为 2^sw_sharp_luma_dx5。 |
| sharp_luma_dx4 | 点 3 与点 4 的间距，实际距离为 2^sw_sharp_luma_dx4。 |
| sharp_luma_dx3 | 点 2 与点 3 的间距，实际距离为 2^sw_sharp_luma_dx3。 |
| sharp_luma_dx2 | 点 1 与点 2 的间距，实际距离为 2^sw_sharp_luma_dx2。 |
| sharp_luma_dx1 | 点 0 与点 1 的间距，实际距离为 2^sw_sharp_luma_dx1。注意总距离必须为 1024。 |
| sharp_pbf_sigma_inv | Sharp pbf sigma 的倒数。 |
| sharp_bf_sigma_inv | Sharp bf sigma 的倒数。 |
| sharp_pbf_coef | 锐化模块双边滤波核。 |
| sharp_bf_coef | 双边滤波核。 |
| sharp_gaus_coef | 高斯滤波核。 |

<!-- Source EN PDF p.318; unit 3383 -->

9.10.4.8 rk_aiq_sharp_strength_v4_t

<!-- Source EN PDF p.318; unit 3384 -->

【说明】定义锐化模块降噪强度配置结构。

<!-- Source EN PDF p.318; unit 3385 -->

【定义】

<!-- Source EN PDF p.318; unit 3386 -->

```text
 typedef struct rk_aiq_sharp_strength_v4_s {
     rk_aiq_uapi_sync_t sync;
     float percent;
 } rk_aiq_sharp_strength_v4_t;
```

<!-- Source EN PDF p.318; unit 3387 -->

【成员】

<!-- Source EN PDF p.318; unit 3388 -->

| 成员名称 | 说明 |
|---|---|
| sync | 同步/异步模式选择，见概述/API 说明部分。 |
| percent | 锐化强度，范围 0.0-1.0。 |

<!-- Source EN PDF p.318; unit 3389 -->

### 9.11 Gamma

<!-- Source EN PDF p.318; unit 3390 -->

#### 9.11.1 功能说明

<!-- Source EN PDF p.318; unit 3391 -->

Gamma 模块对图像亮度空间进行非线性转换，以适应输出设备。RK3588 支持 49 点对数域 gamma 曲线，其横坐标如下：

<!-- Source EN PDF p.318; unit 3392 -->

```text
 int X_isp30[49] = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32,
 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384, 448, 512, 640,
 768, 896, 1024, 1280, 1536, 1792, 2048, 2304, 2560, 2816, 3072, 3328, 3584, 3840,
 4095};
```

<!-- Source EN PDF p.318; unit 3393 -->

#### 9.11.2 功能级 API 参考

<!-- Source EN PDF p.318; unit 3394 -->

9.11.2.1 rk_aiq_uapi2_setGammaCoef

<!-- Source EN PDF p.318; unit 3395 -->

【说明】

<!-- Source EN PDF p.318; unit 3396 -->

通过 GammaCoef 和 SlopeAtZero 快速设置 gamma 曲线，生成方式如下：

<!-- Source EN PDF p.318; unit 3397 -->

```text
 for(int i = 0; i < 49; i++) {
     Y_isp30[i] = 4095 * pow(X_isp30[i] / 4095, 1 / GammaCoef + SlopeAtZero);
     Y_isp30[i] = LIMIT_VALUE(Y_isp30[i], 4095, 0);
  }
```

<!-- Source EN PDF p.318; unit 3398 -->

【语法】

<!-- Source EN PDF p.319; unit 3399 -->

```text
 XCamReturn rk_aiq_uapi2_setGammaCoef(const rk_aiq_sys_ctx_t* ctx, float
 GammaCoef, float SlopeAtZero);
```

<!-- Source EN PDF p.319; unit 3400 -->

【参数】

<!-- Source EN PDF p.319; unit 3401 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| GammaCoef | Gamma 系数，范围 [0,100]，默认 2.2，精度 0.01。 | 输入 |
| SlopeAtZero | 暗区斜率，范围 [-0.05,0.05]，默认 0，精度 0.001。 | 输入 |

<!-- Source EN PDF p.319; unit 3402 -->

【返回值】

<!-- Source EN PDF p.319; unit 3403 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.319; unit 3404 -->

【依赖】

<!-- Source EN PDF p.319; unit 3405 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.319; unit 3406 -->

库文件：librkaiq.so

<!-- Source EN PDF p.319; unit 3407 -->

【说明】

<!-- Source EN PDF p.319; unit 3408 -->

API 中 Gamma 曲线不随场景切换；场景变化时需再次通过 API 设置曲线。

<!-- Source EN PDF p.319; unit 3409 -->

#### 9.11.3 功能级 API 数据类型

<!-- Source EN PDF p.319; unit 3410 -->

#### 9.11.4 模块级 API 参考

<!-- Source EN PDF p.319; unit 3411 -->

9.11.4.1 rk_aiq_user_api2_agamma_SetAttrib

<!-- Source EN PDF p.319; unit 3412 -->

【说明】设置 gamma 软件属性。

<!-- Source EN PDF p.319; unit 3413 -->

【语法】

<!-- Source EN PDF p.319; unit 3414 -->

```text
 XCamReturn
 rk_aiq_user_api2_agamma_v11_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx, const
 rk_aiq_gamma_v11_attrib_t* attr);
```

<!-- Source EN PDF p.319; unit 3415 -->

【参数】

<!-- Source EN PDF p.320; unit 3416 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | Gamma 软件属性结构。 | 输入 |

<!-- Source EN PDF p.320; unit 3417 -->

【返回值】

<!-- Source EN PDF p.320; unit 3418 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.320; unit 3419 -->

【依赖】

<!-- Source EN PDF p.320; unit 3420 -->

头文件：rk_aiq_user_api2_agamma.h。

<!-- Source EN PDF p.320; unit 3421 -->

库文件：librkaiq.so

<!-- Source EN PDF p.320; unit 3422 -->

【说明】

<!-- Source EN PDF p.320; unit 3423 -->

API 中 Gamma 曲线不随场景切换；场景变化时需再次通过 API 设置曲线。

<!-- Source EN PDF p.320; unit 3424 -->

9.11.4.2 rk_aiq_user_api2_agamma_GetAttrib

<!-- Source EN PDF p.320; unit 3425 -->

【说明】获取 gamma 软件属性。

<!-- Source EN PDF p.320; unit 3426 -->

【语法】

<!-- Source EN PDF p.320; unit 3427 -->

```text
 XCamReturn
 rk_aiq_user_api2_agamma_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_gamma_attrib_t* attr);
```

<!-- Source EN PDF p.320; unit 3428 -->

【参数】

<!-- Source EN PDF p.320; unit 3429 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | Gamma 软件属性结构。 | 输出 |

<!-- Source EN PDF p.320; unit 3430 -->

【返回值】

<!-- Source EN PDF p.320; unit 3431 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.320; unit 3432 -->

【依赖】

<!-- Source EN PDF p.320; unit 3433 -->

头文件：rk_aiq_user_api2_agamma.h。

<!-- Source EN PDF p.321; unit 3434 -->

库文件：librkaiq.so

<!-- Source EN PDF p.321; unit 3435 -->

【说明】

<!-- Source EN PDF p.321; unit 3436 -->

#### 9.11.5 模块级 API 数据类型

<!-- Source EN PDF p.321; unit 3437 -->

9.11.5.1 rk_aiq_gamma_op_mode_t

<!-- Source EN PDF p.321; unit 3438 -->

【说明】定义 Gamma 工作模式。

<!-- Source EN PDF p.321; unit 3439 -->

【定义】

<!-- Source EN PDF p.321; unit 3440 -->

```text
 typedef enum rk_aiq_gamma_op_mode_s {
     RK_AIQ_GAMMA_MODE_OFF             = 0,
     RK_AIQ_GAMMA_MODE_MANUAL          = 1,
     RK_AIQ_GAMMA_MODE_FAST            = 2,
 } rk_aiq_gamma_op_mode_t;
```

<!-- Source EN PDF p.321; unit 3441 -->

【成员】

<!-- Source EN PDF p.321; unit 3442 -->

| 成员名称 | 说明 |
|---|---|
| RK_AIQ_GAMMA_MODE_OFF | API 关闭模式。 |
| RK_AIQ_GAMMA_MODE_MANUAL | API 手动模式。 |
| RK_AIQ_GAMMA_MODE_FAST | API 快速模式。 |

<!-- Source EN PDF p.321; unit 3443 -->

9.11.5.2 Agamma_api_Fast_t

<!-- Source EN PDF p.321; unit 3444 -->

【说明】定义快速模式 Gamma 属性。

<!-- Source EN PDF p.321; unit 3445 -->

通过 GammaBeef 和 SlopeAtZero 快速设置 gamma 曲线，生成方式如下（GammaBeef 为原文拼写）：

<!-- Source EN PDF p.321; unit 3446 -->

```text
 for(int i = 0; i < 49; i++) {
     Y_isp30[i] = 4095 * pow(X_isp30[i] / 4095, 1 / GammaCoef + SlopeAtZero);
     Y_isp30[i] = LIMIT_VALUE(Y_isp30[i], 4095, 0);
  }
```

<!-- Source EN PDF p.321; unit 3447 -->

【定义】

<!-- Source EN PDF p.321; unit 3448 -->

```text
 typedef struct Agamma_api_Fast_s {
     bool  en;
     float GammaCoef;
     float SlopeAtZero;
 } Agamma_api_Fast_t;
```

<!-- Source EN PDF p.321; unit 3449 -->

【成员】

<!-- Source EN PDF p.322; unit 3450 -->

| 成员名称 | 说明 |
|---|---|
| en | 开关功能 |
| GammaCoef | gamma 系数，原文范围写作 0, 100，默认 2.2，精度 0.01。 |
| SlopeAtZero | 暗区斜率，原文范围写作 0.05 和 0.05，默认 0，精度 0.001；需核对是否漏负号。 |

<!-- Source EN PDF p.322; unit 3451 -->

9.11.5.3 GammaType_t

<!-- Source EN PDF p.322; unit 3452 -->

【说明】定义 Gamma 曲线 X 轴间隔类型属性。

<!-- Source EN PDF p.322; unit 3453 -->

【定义】

<!-- Source EN PDF p.322; unit 3454 -->

```text
 typedef enum GammaType_e {
    GAMMATYPE_LOG = 0,
    GAMMATYPE_EQU = 1,
 } GammaType_t;
```

<!-- Source EN PDF p.322; unit 3455 -->

【成员】

<!-- Source EN PDF p.322; unit 3456 -->

| 成员名称 | 说明 |
|---|---|
| GAMMATYPE_LOG | 非等间距。 |
| GAMMATYPE_EQU | 等间距。 |

<!-- Source EN PDF p.322; unit 3457 -->

9.11.5.4 Agamma_api_manualV21_t

<!-- Source EN PDF p.322; unit 3458 -->

【说明】定义 RK356x 的手动 gamma 属性。

<!-- Source EN PDF p.322; unit 3459 -->

【定义】

<!-- Source EN PDF p.322; unit 3460 -->

```text
 typedef struct Agamma_api_manualV21_s {
    bool        Gamma_en;
    GammaType_t Gamma_out_segnum;
    uint16_t    Gamma_out_offset;
    uint16_t    Gamma_curve[CALIBDB_AGAMMA_KNOTS_NUM];
 } Agamma_api_manualV21_t;
```

<!-- Source EN PDF p.322; unit 3461 -->

【成员】

<!-- Source EN PDF p.323; unit 3462 -->

| 成员名称 | 说明 |
|---|---|
| Gamma_en | 开关功能 |
| Gamma_out_segnum | 手动 Gamma 曲线 X 轴间隔类型，默认 GAMMATYPE_LOG。 |
| Gamma_out_offset | 手动 Gamma 曲线校正系数，范围 [-2048,2048]，默认 0，精度 1。 |
| Gamma_curve | 手动 Gamma 曲线，范围 [0,4095]，精度 1。 |

<!-- Source EN PDF p.323; unit 3463 -->

9.11.5.5 Agamma_api_manualV30_t

<!-- Source EN PDF p.323; unit 3464 -->

【说明】定义 RK3588 的手动 gamma 属性。

<!-- Source EN PDF p.323; unit 3465 -->

【定义】

<!-- Source EN PDF p.323; unit 3466 -->

```text
 typedef struct Agamma_api_manualV30_s {
    bool     Gamma_en;
    uint16_t Gamma_out_offset;
    uint16_t Gamma_curve[CALIBDB_AGAMMA_KNOTS_NUM_V30];
 } Agamma_api_manualV30_t;
```

<!-- Source EN PDF p.323; unit 3467 -->

【成员】

<!-- Source EN PDF p.323; unit 3468 -->

| 成员名称 | 说明 |
|---|---|
| Gamma_en | 开关功能 |
| Gamma_out_offset | 手动 Gamma 曲线校正系数，范围 [-2048,2048]，默认 0，精度 1。 |
| Gamma_curve | 手动 Gamma 曲线，范围 [0,4095]，精度 1。 |

<!-- Source EN PDF p.323; unit 3469 -->

9.11.5.6 rk_aiq_gamma_attrV21_t

<!-- Source EN PDF p.323; unit 3470 -->

【说明】定义 RK356x 的 Gamma 属性。

<!-- Source EN PDF p.323; unit 3471 -->

【定义】

<!-- Source EN PDF p.323; unit 3472 -->

```text
 typedef struct rk_aiq_gamma_attrV21_s {
    rk_aiq_gamma_op_mode_t mode;
    Agamma_api_manualV21_t stManual;
    Agamma_api_Fast_t      stFast;
 } rk_aiq_gamma_attrV21_t;
```

<!-- Source EN PDF p.323; unit 3473 -->

【成员】

<!-- Source EN PDF p.324; unit 3474 -->

| 成员名称 | 说明 |
|---|---|
| mode | API 模式。 |
| stManual | 手动 Gamma 参数。 |
| stFast | 快速模式参数。 |

<!-- Source EN PDF p.324; unit 3475 -->

9.11.5.7 rk_aiq_gamma_attrV30_t

<!-- Source EN PDF p.324; unit 3476 -->

【说明】定义 RK3588 的 Gamma 属性。

<!-- Source EN PDF p.324; unit 3477 -->

【定义】

<!-- Source EN PDF p.324; unit 3478 -->

```text
 typedef struct rk_aiq_gamma_attrV30_s {
    rk_aiq_gamma_op_mode_t mode;
    Agamma_api_manualV30_t stManual;
    Agamma_api_Fast_t      stFast;
 } rk_aiq_gamma_attrV30_t;
```

<!-- Source EN PDF p.324; unit 3479 -->

【成员】

<!-- Source EN PDF p.324; unit 3480 -->

| 成员名称 | 说明 |
|---|---|
| mode | API 模式。 |
| stManual | 手动 Gamma 参数。 |
| stFast | 快速模式参数。 |

<!-- Source EN PDF p.324; unit 3481 -->

9.11.5.8 rk_aiq_gamma_attr_t

<!-- Source EN PDF p.324; unit 3482 -->

【说明】定义 Gamma 属性。

<!-- Source EN PDF p.324; unit 3483 -->

【定义】

<!-- Source EN PDF p.324; unit 3484 -->

```text
 typedef struct rk_aiq_gamma_attr_s {
     rk_aiq_uapi_sync_t     sync;
     rk_aiq_gamma_attrV21_t atrrV21;
     rk_aiq_gamma_attrV30_t atrrV30;
 } rk_aiq_gamma_attr_t;
```

<!-- Source EN PDF p.324; unit 3485 -->

【成员】

<!-- Source EN PDF p.325; unit 3486 -->

| 成员名称 | 说明 |
|---|---|
| sync | rk_aiq_uapi_sync_t 的定义参见“概述/API 说明”。 |
| atrrV21 | RK356x 芯片手动 gamma 属性。 |
| atrrV30 | RK3588 芯片手动 gamma 属性。 |

<!-- Source EN PDF p.325; unit 3487 -->

### 9.12 CCM

<!-- Source EN PDF p.325; unit 3488 -->

#### 9.12.1 功能说明

<!-- Source EN PDF p.325; unit 3489 -->

CCM（色彩校正矩阵）模块对图像进行色彩校正。

<!-- Source EN PDF p.325; unit 3490 -->

#### 9.12.2 功能级 API 参考

<!-- Source EN PDF p.325; unit 3491 -->

9.12.2.1 rk_aiq_uapi2_setCCMMode

<!-- Source EN PDF p.325; unit 3492 -->

【说明】设置 CCM 工作模式。

<!-- Source EN PDF p.325; unit 3493 -->

【语法】

<!-- Source EN PDF p.325; unit 3494 -->

```text
 XCamReturn rk_aiq_uapi2_setCCMMode(const rk_aiq_sys_ctx_t* ctx, opMode_t mode);
```

<!-- Source EN PDF p.325; unit 3495 -->

【参数】

<!-- Source EN PDF p.325; unit 3496 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| mode | 工作模式，取值 {OP_AUTO, OP_MANUAL}。 | 输入 |

<!-- Source EN PDF p.325; unit 3497 -->

【返回值】

<!-- Source EN PDF p.325; unit 3498 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.325; unit 3499 -->

【依赖】

<!-- Source EN PDF p.325; unit 3500 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.325; unit 3501 -->

库文件：librkaiq.so

<!-- Source EN PDF p.325; unit 3502 -->

【示例】

<!-- Source EN PDF p.326; unit 3503 -->

参见 sample_accm_module.cpp 的 sample_set_ccm_manual / sample_set_ccm_auto，设置手动/自动模式。

<!-- Source EN PDF p.326; unit 3504 -->

9.12.2.2 rk_aiq_uapi2_getCCMMode

<!-- Source EN PDF p.326; unit 3505 -->

【说明】获取 CCM 工作模式。

<!-- Source EN PDF p.326; unit 3506 -->

【语法】

<!-- Source EN PDF p.326; unit 3507 -->

```text
 XCamReturn rk_aiq_uapi2_getCCMMode(const rk_aiq_sys_ctx_t* ctx, opMode_t *mode);
```

<!-- Source EN PDF p.326; unit 3508 -->

【参数】

<!-- Source EN PDF p.326; unit 3509 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| mode | 工作模式，取值 {OP_AUTO, OP_MANUAL}。 | 输出 |

<!-- Source EN PDF p.326; unit 3510 -->

【返回值】

<!-- Source EN PDF p.326; unit 3511 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.326; unit 3512 -->

【依赖】

<!-- Source EN PDF p.326; unit 3513 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.326; unit 3514 -->

库文件：librkaiq.so

<!-- Source EN PDF p.326; unit 3515 -->

【示例】

<!-- Source EN PDF p.326; unit 3516 -->

获取工作模式参见 sample_accm_module.cpp 的 sample_get_ccm_mode。

<!-- Source EN PDF p.326; unit 3517 -->

9.12.2.3 rk_aiq_uapi2_setMCcCoef

<!-- Source EN PDF p.326; unit 3518 -->

【说明】设置手动模式 CCM 矩阵，包括色彩校正矩阵及 R/G/B 通道偏移。

<!-- Source EN PDF p.326; unit 3519 -->

【语法】

<!-- Source EN PDF p.326; unit 3520 -->

```text
 XCamReturn rk_aiq_uapi2_setMCcCoef(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_ccm_matrix_t *mccm);
```

<!-- Source EN PDF p.326; unit 3521 -->

【参数】

<!-- Source EN PDF p.327; unit 3522 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| mccm | 手动模式 CCM 矩阵，包括色彩校正矩阵及 R/G/B 通道偏移。 | 输入 |

<!-- Source EN PDF p.327; unit 3523 -->

【返回值】

<!-- Source EN PDF p.327; unit 3524 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.327; unit 3525 -->

【依赖】

<!-- Source EN PDF p.327; unit 3526 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.327; unit 3527 -->

库文件：librkaiq.so

<!-- Source EN PDF p.327; unit 3528 -->

【示例】

<!-- Source EN PDF p.327; unit 3529 -->

设置手动 CCM 矩阵参见 sample_accm_module.cpp 的 sample_set_ccm_manual_matrix。

<!-- Source EN PDF p.327; unit 3530 -->

9.12.2.4 rk_aiq_uapi2_getMCcCoef

<!-- Source EN PDF p.327; unit 3531 -->

【说明】获取 CCM 矩阵，包括色彩校正矩阵及 R/G/B 通道偏移。

<!-- Source EN PDF p.327; unit 3532 -->

【语法】

<!-- Source EN PDF p.327; unit 3533 -->

```text
 XCamReturn rk_aiq_uapi2_getMCcCoef(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_ccm_matrix_t *mccm);
```

<!-- Source EN PDF p.327; unit 3534 -->

【参数】

<!-- Source EN PDF p.327; unit 3535 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| mccm | CCM 矩阵，包括色彩校正矩阵及 R/G/B 通道偏移。 | 输出 |

<!-- Source EN PDF p.327; unit 3536 -->

【返回值】

<!-- Source EN PDF p.327; unit 3537 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.328; unit 3538 -->

【依赖】

<!-- Source EN PDF p.328; unit 3539 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.328; unit 3540 -->

库文件：librkaiq.so

<!-- Source EN PDF p.328; unit 3541 -->

【示例】

<!-- Source EN PDF p.328; unit 3542 -->

获取 CCM 矩阵参见 sample_accm_module.cpp 的 sample_get_ccm_manual_matrix。

<!-- Source EN PDF p.328; unit 3543 -->

9.12.2.5 rk_aiq_uapi2_getACcmSat

<!-- Source EN PDF p.328; unit 3544 -->

【说明】获取自动模式 CCM 饱和度。

<!-- Source EN PDF p.328; unit 3545 -->

【语法】

<!-- Source EN PDF p.328; unit 3546 -->

```text
 XCamReturn rk_aiq_uapi2_getACcmSat(const rk_aiq_sys_ctx_t* ctx,  float
 *finalsat);
```

<!-- Source EN PDF p.328; unit 3547 -->

【参数】

<!-- Source EN PDF p.328; unit 3548 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| finalsat | 饱和度，手动模式为 0。 | 输出 |

<!-- Source EN PDF p.328; unit 3549 -->

【返回值】

<!-- Source EN PDF p.328; unit 3550 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.328; unit 3551 -->

【依赖】

<!-- Source EN PDF p.328; unit 3552 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.328; unit 3553 -->

库文件：librkaiq.so

<!-- Source EN PDF p.328; unit 3554 -->

【示例】

<!-- Source EN PDF p.328; unit 3555 -->

自动模式 CCM 饱和度参见 sample_accm_module.cpp 的 sample_get_accm_sat。

<!-- Source EN PDF p.328; unit 3556 -->

9.12.2.6 rk_aiq_uapi2_getACcmMatrixName

<!-- Source EN PDF p.328; unit 3557 -->

【说明】获取自动模式 CCM 矩阵名称。

<!-- Source EN PDF p.328; unit 3558 -->

【语法】

<!-- Source EN PDF p.328; unit 3559 -->

```text
 XCamReturn rk_aiq_uapi2_getACcmMatrixName(const rk_aiq_sys_ctx_t* ctx, char
 **ccm_name);
```

<!-- Source EN PDF p.329; unit 3560 -->

【参数】

<!-- Source EN PDF p.329; unit 3561 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| ccm_name | CCM 矩阵名称。 | 输出 |

<!-- Source EN PDF p.329; unit 3562 -->

【返回值】

<!-- Source EN PDF p.329; unit 3563 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.329; unit 3564 -->

【依赖】

<!-- Source EN PDF p.329; unit 3565 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.329; unit 3566 -->

库文件：librkaiq.so

<!-- Source EN PDF p.329; unit 3567 -->

【示例】

<!-- Source EN PDF p.329; unit 3568 -->

原文称通过 sample_accm_module.cpp 的 sample_get_accm_matrix_name 获取自动模式 CCM 饱和度。

<!-- Source EN PDF p.329; unit 3569 -->

#### 9.12.3 功能级 API 数据类型

<!-- Source EN PDF p.329; unit 3570 -->

9.12.3.1 opMode_t

<!-- Source EN PDF p.329; unit 3571 -->

【说明】定义 CCM 工作模式。

<!-- Source EN PDF p.329; unit 3572 -->

【定义】

<!-- Source EN PDF p.329; unit 3573 -->

```text
 typedef enum opMode_e {
     OP_AUTO = 0,
     OP_MANUAL = 1,
     OP_INVAL
 } opMode_t;
```

<!-- Source EN PDF p.329; unit 3574 -->

【成员】

<!-- Source EN PDF p.329; unit 3575 -->

| 成员名称 | 说明 |
|---|---|
| OP_AUTO | 自动模式 |
| OP_MANUAL | 手动模式 |
| OP_INVAL | 无效值 |

<!-- Source EN PDF p.330; unit 3576 -->

9.12.3.2 rk_aiq_ccm_matrix_t

<!-- Source EN PDF p.330; unit 3577 -->

【说明】定义 CCM 矩阵。

<!-- Source EN PDF p.330; unit 3578 -->

【定义】

<!-- Source EN PDF p.330; unit 3579 -->

```text
 typedef struct rk_aiq_ccm_matrix_s {
     float  ccMatrix[9];
     float  ccOffsets[3];
 } rk_aiq_ccm_matrix_t;
```

<!-- Source EN PDF p.330; unit 3580 -->

【成员】

<!-- Source EN PDF p.330; unit 3581 -->

| 成员名称 | 说明 |
|---|---|
| ccMatrix | 手动模式色彩校正矩阵，范围 [-8,7.992]。 |
| ccOffsets | 手动模式 RGB 分量偏移，范围 [-4096,4095]。 |

<!-- Source EN PDF p.330; unit 3582 -->

#### 9.12.4 模块级 API 参考

<!-- Source EN PDF p.330; unit 3583 -->

9.12.4.1 rk_aiq_user_api2_accm_v2_SetAttrib

<!-- Source EN PDF p.330; unit 3584 -->

【说明】设置 CCM 属性。

<!-- Source EN PDF p.330; unit 3585 -->

【语法】

<!-- Source EN PDF p.330; unit 3586 -->

```text
 XCamReturn
 rk_aiq_user_api2_accm_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ccm_attrib_t attr);
```

<!-- Source EN PDF p.330; unit 3587 -->

【参数】

<!-- Source EN PDF p.330; unit 3588 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | CCM 属性参数。 | 输入 |

<!-- Source EN PDF p.330; unit 3589 -->

【返回值】

<!-- Source EN PDF p.330; unit 3590 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.331; unit 3591 -->

【依赖】

<!-- Source EN PDF p.331; unit 3592 -->

头文件：rk_aiq_user_api2_accm.h、rk_aiq_uapi_accm_int.h。

<!-- Source EN PDF p.331; unit 3593 -->

库文件：librkaiq.so

<!-- Source EN PDF p.331; unit 3594 -->

【示例】

<!-- Source EN PDF p.331; unit 3595 -->

设置 CCM 属性参见 sample_accm_module.cpp 的 sample_ccm_setCcmAttr。

<!-- Source EN PDF p.331; unit 3596 -->

9.12.4.2 rk_aiq_user_api2_accm_GetAttrib

<!-- Source EN PDF p.331; unit 3597 -->

【说明】获取 CCM 属性。

<!-- Source EN PDF p.331; unit 3598 -->

【语法】

<!-- Source EN PDF p.331; unit 3599 -->

```text
 XCamReturn
 rk_aiq_user_api2_accm_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ccm_attrib_t *attr);
```

<!-- Source EN PDF p.331; unit 3600 -->

【参数】

<!-- Source EN PDF p.331; unit 3601 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | CCM 参数属性。 | 输出 |

<!-- Source EN PDF p.331; unit 3602 -->

【返回值】

<!-- Source EN PDF p.331; unit 3603 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.331; unit 3604 -->

【依赖】

<!-- Source EN PDF p.331; unit 3605 -->

头文件：rk_aiq_user_api2_accm.h、rk_aiq_uapi_accm_int.h。

<!-- Source EN PDF p.331; unit 3606 -->

库文件：librkaiq.so

<!-- Source EN PDF p.331; unit 3607 -->

【示例】

<!-- Source EN PDF p.331; unit 3608 -->

获取 CCM 属性参见 sample_accm_module.cpp 的 sample_ccm_getCcmAttr。

<!-- Source EN PDF p.331; unit 3609 -->

9.12.4.3 rk_aiq_user_api2_accm_QueryCcmInfo

<!-- Source EN PDF p.331; unit 3610 -->

【说明】查询 CCM 信息。

<!-- Source EN PDF p.331; unit 3611 -->

【语法】

<!-- Source EN PDF p.332; unit 3612 -->

```text
 XCamReturn
 rk_aiq_user_api2_accm_QueryCcmInfo(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ccm_querry_info_t *ccm_querry_info);
```

<!-- Source EN PDF p.332; unit 3613 -->

【参数】

<!-- Source EN PDF p.332; unit 3614 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| ccm_querry_info | CCM 查询内容。 | 输出 |

<!-- Source EN PDF p.332; unit 3615 -->

【返回值】

<!-- Source EN PDF p.332; unit 3616 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.332; unit 3617 -->

【依赖】

<!-- Source EN PDF p.332; unit 3618 -->

头文件：rk_aiq_user_api2_accm.h、rk_aiq_uapi_accm_int.h。

<!-- Source EN PDF p.332; unit 3619 -->

库文件：librkaiq.so

<!-- Source EN PDF p.332; unit 3620 -->

【示例】

<!-- Source EN PDF p.332; unit 3621 -->

查询 CCM 信息参见 sample_accm_module.cpp 的 sample_query_ccm_info。

<!-- Source EN PDF p.332; unit 3622 -->

#### 9.12.5 模块级 API 数据类型

<!-- Source EN PDF p.332; unit 3623 -->

9.12.5.1 rk_aiq_ccm_op_mode_t

<!-- Source EN PDF p.332; unit 3624 -->

【说明】定义 CCM 工作模式。

<!-- Source EN PDF p.332; unit 3625 -->

【定义】

<!-- Source EN PDF p.332; unit 3626 -->

```text
 typedef enum rk_aiq_ccm_op_mode_s {
     RK_AIQ_CCM_MODE_INVALID                     = 0,
     RK_AIQ_CCM_MODE_MANUAL                      = 1,
     RK_AIQ_CCM_MODE_AUTO                        = 2,
     RK_AIQ_CCM_MODE_MAX
 } rk_aiq_ccm_op_mode_t;
```

<!-- Source EN PDF p.332; unit 3627 -->

【成员】

<!-- Source EN PDF p.333; unit 3628 -->

| 成员名称 | 说明 |
|---|---|
| RK_AIQ_CCM_MODE_INVALID | CCM 无效模式。 |
| RK_AIQ_CCM_MODE_MANUAL | CCM 手动模式。 |
| RK_AIQ_CCM_MODE_AUTO | CCM 自动模式。 |

<!-- Source EN PDF p.333; unit 3629 -->

9.12.5.2 rk_aiq_ccm_mccm_attrib_t

<!-- Source EN PDF p.333; unit 3630 -->

【说明】定义手动 CCM 属性。

<!-- Source EN PDF p.333; unit 3631 -->

【定义】

<!-- Source EN PDF p.333; unit 3632 -->

```text
 typedef struct rk_aiq_ccm_mccm_attrib_s {
     float  ccMatrix[9];
     float  ccOffsets[3];
     float  y_alpha_curve[17];
     float low_bound_pos_bit;
 } rk_aiq_ccm_mccm_attrib_t;
```

<!-- Source EN PDF p.333; unit 3633 -->

【成员】

<!-- Source EN PDF p.333; unit 3634 -->

| 成员名称 | 说明 |
|---|---|
| ccMatrix | 色彩校正矩阵，范围 [-8,7.992]。 |
| ccOffsets | RGB 分量偏移，范围 [-4096,4095]。 |
| y_alpha_curve | 与像素亮度（12bit）相关的色彩校正强度曲线配置。范围 [0x0,0x400]；0x400 表示 1 倍，0x0 不校正。 |
| low_bound_pos_bit | 像素亮度（12bit）调整曲线拐点亮度范围为 [0,2^low_bound_pos_bit] 和 [4095-2^low_bound_pos_bit,4095]。有效值 [0,10]。 |

<!-- Source EN PDF p.333; unit 3635 -->

9.12.5.3 rk_aiq_ccm_color_inhibition_t

<!-- Source EN PDF p.333; unit 3636 -->

【说明】定义 CCM 色彩抑制等级。

<!-- Source EN PDF p.333; unit 3637 -->

【定义】

<!-- Source EN PDF p.334; unit 3638 -->

```text
 typedef struct rk_aiq_ccm_color_inhibition_s {
     float sensorGain[RK_AIQ_ACCM_COLOR_GAIN_NUM];
     float level[RK_AIQ_ACCM_COLOR_GAIN_NUM];
 } rk_aiq_ccm_color_inhibition_t;
```

<!-- Source EN PDF p.334; unit 3639 -->

【成员】

<!-- Source EN PDF p.334; unit 3640 -->

| 成员名称 | 说明 |
|---|---|
| sensorGain | 曝光增益分量。 |
| level | 色彩抑制等级，范围 [0,100]，默认 0。 |

<!-- Source EN PDF p.334; unit 3641 -->

9.12.5.4 rk_aiq_ccm_color_saturation_t

<!-- Source EN PDF p.334; unit 3642 -->

【说明】定义自动 CCM 饱和度等级。

<!-- Source EN PDF p.334; unit 3643 -->

【定义】

<!-- Source EN PDF p.334; unit 3644 -->

```text
 typedef struct rk_aiq_ccm_color_saturation_s {
     float sensorGain[RK_AIQ_ACCM_COLOR_GAIN_NUM];
     float level[RK_AIQ_ACCM_COLOR_GAIN_NUM];
 } rk_aiq_ccm_color_saturation_t;
```

<!-- Source EN PDF p.334; unit 3645 -->

【成员】

<!-- Source EN PDF p.334; unit 3646 -->

| 成员名称 | 说明 |
|---|---|
| sensorGain | 曝光增益分量。 |
| level | 色彩饱和度等级，范围 [0,100]，默认 100。 |

<!-- Source EN PDF p.334; unit 3647 -->

9.12.5.5 rk_aiq_ccm_accm_attrib_t

<!-- Source EN PDF p.334; unit 3648 -->

【说明】定义自动 CCM 属性。

<!-- Source EN PDF p.334; unit 3649 -->

【定义】

<!-- Source EN PDF p.334; unit 3650 -->

```text
 typedef struct rk_aiq_ccm_accm_attrib_s {
     rk_aiq_ccm_color_inhibition_t color_inhibition;
     rk_aiq_ccm_color_saturation_t color_saturation;
 } rk_aiq_ccm_accm_attrib_t;
```

<!-- Source EN PDF p.334; unit 3651 -->

【成员】

<!-- Source EN PDF p.335; unit 3652 -->

| 成员名称 | 说明 |
|---|---|
| color_inhibition | CCM 色彩抑制等级。 |
| color_saturation | CCM 色彩饱和度等级。 |

<!-- Source EN PDF p.335; unit 3653 -->

9.12.5.6 rk_aiq_ccm_attrib_t

<!-- Source EN PDF p.335; unit 3654 -->

【说明】定义 CCM 属性。

<!-- Source EN PDF p.335; unit 3655 -->

【定义】

<!-- Source EN PDF p.335; unit 3656 -->

```text
 typedef struct rk_aiq_ccm_attrib_s {
     rk_aiq_uapi_sync_t sync;
     bool byPass;
     rk_aiq_ccm_op_mode_t mode;
     rk_aiq_ccm_mccm_attrib_t stManual;
     rk_aiq_ccm_accm_attrib_t stAuto;
     CalibDbV2_Ccm_Para_V2_t stTool;
 } rk_aiq_ccm_attrib_t;
```

<!-- Source EN PDF p.335; unit 3657 -->

【成员】

<!-- Source EN PDF p.335; unit 3658 -->

| 成员名称 | 说明 |
|---|---|
| sync | 同步/异步信号，参见 rk_aiq_uapi_sync_t 定义及“概述/API 说明”一节。 |
| byPass | 跳过模块处理：true 跳过 CCM，false 启用 CCM。 |
| mode | 工作模式 {RK_AIQ_CCM_MODE_MANUAL, RK_AIQ_CCM_MODE_AUTO}，分别为手动、自动。 |
| stManual | 手动模式属性参数配置。 |
| stAuto | 自动模式属性参数配置。 |
| stTool | 工具模式参数，无需配置。 |

<!-- Source EN PDF p.335; unit 3659 -->

9.12.5.7 rk_aiq_ccm_querry_info_t

<!-- Source EN PDF p.335; unit 3660 -->

【说明】定义 CCM 查询信息。

<!-- Source EN PDF p.335; unit 3661 -->

【定义】

<!-- Source EN PDF p.336; unit 3662 -->

```text
 typedef struct rk_aiq_ccm_querry_info_s {
     bool ccm_en;
     float  ccMatrix[9];
     float  ccOffsets[3];
     float  y_alpha_curve[CCM_CURVE_DOT_NUM];
     float low_bound_pos_bit;
     float color_inhibition_level;
     float color_saturation_level;
     float finalSat;
     char  ccmname1[25];
     char  ccmname2[25];
 } rk_aiq_ccm_querry_info_t;
```

<!-- Source EN PDF p.336; unit 3663 -->

【成员】

<!-- Source EN PDF p.336; unit 3664 -->

| 成员名称 | 说明 |
|---|---|
| ccm_en | CCM 使能：true 启用，false 禁用。 |
| ccMatrix | 生效的 CCM 校正矩阵，范围 [-8,7.992]。 |
| ccOffsets | 生效的 RGB 分量偏移，范围 [-4096,4095]。 |
| y_alpha_curve | 与像素亮度（12bit）相关的色彩校正强度曲线配置。范围 [0x0,0x400]，0x400 为 1 倍，0x0 不校正。 |
| low_bound_pos_bit | 像素亮度（12bit）调整曲线拐点亮度范围为 [0,2^low_bound_pos_bit] 和 [4095-2^low_bound_pos_bit,4095]。有效值 [0,10]。 |
| color_inhibition_level | CCM 色彩抑制等级（仅自动模式）。 |
| color_saturation_level | CCM 色彩饱和度等级（仅自动模式）。 |
| finalSat | 当前矩阵对应饱和度（仅支持自动模式）。 |
| ccmname1 | 用于插值计算当前矩阵的标定矩阵名称（仅自动模式）。 |
| ccmname2 | 用于插值计算当前矩阵的标定矩阵名称（仅自动模式）。 |

<!-- Source EN PDF p.337; unit 3665 -->

### 9.13 3DLUT

<!-- Source EN PDF p.337; unit 3666 -->

#### 9.13.1 功能说明

<!-- Source EN PDF p.337; unit 3667 -->

3DLUT（三维查找表）模块在 RGB 空间执行图像颜色映射。

<!-- Source EN PDF p.337; unit 3668 -->

#### 9.13.2 功能级 API 参考

<!-- Source EN PDF p.337; unit 3669 -->

9.13.2.1 rk_aiq_uapi2_setLut3dMode

<!-- Source EN PDF p.337; unit 3670 -->

【说明】设置 3DLUT 工作模式。

<!-- Source EN PDF p.337; unit 3671 -->

【语法】

<!-- Source EN PDF p.337; unit 3672 -->

```text
 XCamReturn rk_aiq_uapi2_setLut3dMode(const rk_aiq_sys_ctx_t* ctx, opMode_t mode);
```

<!-- Source EN PDF p.337; unit 3673 -->

【参数】

<!-- Source EN PDF p.337; unit 3674 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| mode | 工作模式，取值 {OP_AUTO, OP_MANUAL}。 | 输入 |

<!-- Source EN PDF p.337; unit 3675 -->

【返回值】

<!-- Source EN PDF p.337; unit 3676 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.337; unit 3677 -->

【依赖】

<!-- Source EN PDF p.337; unit 3678 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.337; unit 3679 -->

库文件：librkaiq.so

<!-- Source EN PDF p.337; unit 3680 -->

【示例】

<!-- Source EN PDF p.337; unit 3681 -->

设置手动/自动模式参见 sample_a3dlut_module.cpp 的 sample_set_a3dlut_manual / sample_set_a3dlut_auto。

<!-- Source EN PDF p.337; unit 3682 -->

9.13.2.2 rk_aiq_uapi2_getLut3dMode

<!-- Source EN PDF p.337; unit 3683 -->

【说明】获取 3DLUT 工作模式。

<!-- Source EN PDF p.337; unit 3684 -->

【语法】

<!-- Source EN PDF p.338; unit 3685 -->

```text
 XCamReturn rk_aiq_uapi2_getLut3dMode(const rk_aiq_sys_ctx_t* ctx, opMode_t
 *mode);
```

<!-- Source EN PDF p.338; unit 3686 -->

【参数】

<!-- Source EN PDF p.338; unit 3687 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| mode | 工作模式 | 输出 |

<!-- Source EN PDF p.338; unit 3688 -->

【返回值】

<!-- Source EN PDF p.338; unit 3689 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.338; unit 3690 -->

【依赖】

<!-- Source EN PDF p.338; unit 3691 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.338; unit 3692 -->

库文件：librkaiq.so

<!-- Source EN PDF p.338; unit 3693 -->

【示例】

<!-- Source EN PDF p.338; unit 3694 -->

原文称通过 sample_a3dlut_module.cpp 的 sample_get_a3dlut_mode 设置手动/自动模式。

<!-- Source EN PDF p.338; unit 3695 -->

9.13.2.3 rk_aiq_uapi2_setM3dLut

<!-- Source EN PDF p.338; unit 3696 -->

【说明】设置 3DLUT 手动三维查找表。

<!-- Source EN PDF p.338; unit 3697 -->

【语法】

<!-- Source EN PDF p.338; unit 3698 -->

```text
 XCamReturn rk_aiq_uapi2_setM3dLut(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_lut3d_table_t *mlut);
```

<!-- Source EN PDF p.338; unit 3699 -->

【参数】

<!-- Source EN PDF p.338; unit 3700 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| mlut | 三维查找表。 | 输入 |

<!-- Source EN PDF p.338; unit 3701 -->

【返回值】

<!-- Source EN PDF p.338; unit 3702 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.339; unit 3703 -->

【依赖】

<!-- Source EN PDF p.339; unit 3704 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.339; unit 3705 -->

库文件：librkaiq.so

<!-- Source EN PDF p.339; unit 3706 -->

【示例】

<!-- Source EN PDF p.339; unit 3707 -->

设置手动 3DLUT 查找表参见 sample_a3dlut_module.cpp 的 sample_set_a3dlut_manual_lut。

<!-- Source EN PDF p.339; unit 3708 -->

9.13.2.4 rk_aiq_uapi2_getM3dLut

<!-- Source EN PDF p.339; unit 3709 -->

【说明】获取 3DLUT 三维查找表。

<!-- Source EN PDF p.339; unit 3710 -->

【语法】

<!-- Source EN PDF p.339; unit 3711 -->

```text
 XCamReturn rk_aiq_uapi2_getM3dLut(const rk_aiq_sys_ctx_t* ctx,
  rk_aiq_lut3d_table_t *mlut);
```

<!-- Source EN PDF p.339; unit 3712 -->

【参数】

<!-- Source EN PDF p.339; unit 3713 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| mlut | 三维查找表。 | 输出 |

<!-- Source EN PDF p.339; unit 3714 -->

【返回值】

<!-- Source EN PDF p.339; unit 3715 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.339; unit 3716 -->

【依赖】

<!-- Source EN PDF p.339; unit 3717 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.339; unit 3718 -->

库文件：librkaiq.so

<!-- Source EN PDF p.339; unit 3719 -->

【示例】

<!-- Source EN PDF p.339; unit 3720 -->

获取 3DLUT 查找表参见 sample_a3dlut_module.cpp 的 sample_get_a3dlut_lut。

<!-- Source EN PDF p.339; unit 3721 -->

9.13.2.5 rk_aiq_uapi2_getA3dLutStrth

<!-- Source EN PDF p.339; unit 3722 -->

【说明】获取 3DLUT 调整强度。

<!-- Source EN PDF p.339; unit 3723 -->

【语法】

<!-- Source EN PDF p.339; unit 3724 -->

```text
 XCamReturn rk_aiq_uapi2_getA3dLutStrth(const rk_aiq_sys_ctx_t* ctx, float alpha);
```

<!-- Source EN PDF p.340; unit 3725 -->

【参数】

<!-- Source EN PDF p.340; unit 3726 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| alpha | 3DLUT 调整强度。 | 输出 |

<!-- Source EN PDF p.340; unit 3727 -->

【返回值】

<!-- Source EN PDF p.340; unit 3728 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.340; unit 3729 -->

【依赖】

<!-- Source EN PDF p.340; unit 3730 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.340; unit 3731 -->

库文件：librkaiq.so

<!-- Source EN PDF p.340; unit 3732 -->

【示例】

<!-- Source EN PDF p.340; unit 3733 -->

3DLUT 调整强度参见 sample_a3dlut_module.cpp 的 sample_get_a3dlut_strength。

<!-- Source EN PDF p.340; unit 3734 -->

9.13.2.6 rk_aiq_uapi2_getA3dLutName

<!-- Source EN PDF p.340; unit 3735 -->

【说明】获取自动模式 3DLUT 表名。

<!-- Source EN PDF p.340; unit 3736 -->

【语法】

<!-- Source EN PDF p.340; unit 3737 -->

```text
 XCamReturn rk_aiq_uapi2_getA3dLutName(const rk_aiq_sys_ctx_t* ctx, char *name);
```

<!-- Source EN PDF p.340; unit 3738 -->

【参数】

<!-- Source EN PDF p.340; unit 3739 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| name | 3DLUT 表名。 | 输出 |

<!-- Source EN PDF p.340; unit 3740 -->

【返回值】

<!-- Source EN PDF p.340; unit 3741 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.340; unit 3742 -->

【依赖】

<!-- Source EN PDF p.340; unit 3743 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.341; unit 3744 -->

库文件：librkaiq.so

<!-- Source EN PDF p.341; unit 3745 -->

【示例】

<!-- Source EN PDF p.341; unit 3746 -->

获取自动模式 3DLUT 表名参见 sample_a3dlut_module.cpp 的 sample_get_a3dlut_lutname。

<!-- Source EN PDF p.341; unit 3747 -->

#### 9.13.3 功能级 API 数据类型

<!-- Source EN PDF p.341; unit 3748 -->

9.13.3.1 opMode_t

<!-- Source EN PDF p.341; unit 3749 -->

【说明】定义 3DLUT 工作模式。

<!-- Source EN PDF p.341; unit 3750 -->

【定义】

<!-- Source EN PDF p.341; unit 3751 -->

```text
 typedef enum opMode_e {
     OP_AUTO = 0,
     OP_MANUALl = 1,
     OP_INVAL
 } opMode_t;
```

<!-- Source EN PDF p.341; unit 3752 -->

【成员】

<!-- Source EN PDF p.341; unit 3753 -->

| 成员名称 | 说明 |
|---|---|
| OP_AUTO | 自动模式 |
| OP_MANUALl | 手动模式 |
| OP_INVAL | 无效值 |

<!-- Source EN PDF p.341; unit 3754 -->

9.13.3.2 rk_aiq_lut3d_table_t

<!-- Source EN PDF p.341; unit 3755 -->

【说明】定义 3DLUT 三维查找表。

<!-- Source EN PDF p.341; unit 3756 -->

【定义】

<!-- Source EN PDF p.341; unit 3757 -->

```text
 typedef struct rk_aiq_lut3d_table_s{
     unsigned short look_up_table_r[729];
     unsigned short look_up_table_g[729];
     unsigned short look_up_table_b[729];
 } rk_aiq_lut3d_table_t;
```

<!-- Source EN PDF p.341; unit 3758 -->

【成员】

<!-- Source EN PDF p.342; unit 3759 -->

| 成员名称 | 说明 |
|---|---|
| look_up_table_r | 手动模式 R 通道查找表，范围 [0x0,0x3ff]。 |
| look_up_table_g | 手动模式 G 通道查找表，范围 [0x0,0xfff]。 |
| look_up_table_b | 手动模式 B 通道查找表，范围 [0x0,0x3ff]。 |

<!-- Source EN PDF p.342; unit 3760 -->

#### 9.13.4 模块级 API 参考

<!-- Source EN PDF p.342; unit 3761 -->

9.13.4.1 rk_aiq_user_api2_a3dlut_SetAttrib

<!-- Source EN PDF p.342; unit 3762 -->

【说明】设置 3DLUT 属性。

<!-- Source EN PDF p.342; unit 3763 -->

【语法】

<!-- Source EN PDF p.342; unit 3764 -->

```text
 XCamReturn rk_aiq_user_api2_a3dlut_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_lut3d_attrib_t attr);
```

<!-- Source EN PDF p.342; unit 3765 -->

【参数】

<!-- Source EN PDF p.342; unit 3766 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 3DLUT 参数属性。 | 输入 |

<!-- Source EN PDF p.342; unit 3767 -->

【返回值】

<!-- Source EN PDF p.342; unit 3768 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.342; unit 3769 -->

【依赖】

<!-- Source EN PDF p.342; unit 3770 -->

头文件：rk_aiq_user_api2_a3dlut.h、rk_aiq_uapi_a3dlut_int.h。

<!-- Source EN PDF p.342; unit 3771 -->

库文件：librkaiq.so

<!-- Source EN PDF p.342; unit 3772 -->

【示例】

<!-- Source EN PDF p.342; unit 3773 -->

设置 3DLUT 属性参见 sample_a3dlut_module.cpp 的 sample_3dlut_set3dlutAttr。

<!-- Source EN PDF p.343; unit 3774 -->

9.13.4.2 rk_aiq_user_api2_a3dlut_GetAttrib

<!-- Source EN PDF p.343; unit 3775 -->

【说明】获取 3DLUT 属性。

<!-- Source EN PDF p.343; unit 3776 -->

【语法】

<!-- Source EN PDF p.343; unit 3777 -->

```text
 XCamReturn
 rk_aiq_user_api2_a3dlut_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_lut3d_attrib_t *attr);
```

<!-- Source EN PDF p.343; unit 3778 -->

【参数】

<!-- Source EN PDF p.343; unit 3779 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 3DLUT 参数属性。 | 输出 |

<!-- Source EN PDF p.343; unit 3780 -->

【返回值】

<!-- Source EN PDF p.343; unit 3781 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.343; unit 3782 -->

【依赖】

<!-- Source EN PDF p.343; unit 3783 -->

头文件：rk_aiq_user_api2_a3dlut.h、rk_aiq_uapi_a3dlut_int.h。

<!-- Source EN PDF p.343; unit 3784 -->

库文件：librkaiq.so

<!-- Source EN PDF p.343; unit 3785 -->

【示例】

<!-- Source EN PDF p.343; unit 3786 -->

获取 3DLUT 属性参见 sample_a3dlut_module.cpp 的 sample_3dlut_get3dlutAttr 等。

<!-- Source EN PDF p.343; unit 3787 -->

9.13.4.3 rk_aiq_user_api2_a3dlut_Query3dlutInfo

<!-- Source EN PDF p.343; unit 3788 -->

【说明】查询 3DLUT 信息。

<!-- Source EN PDF p.343; unit 3789 -->

【语法】

<!-- Source EN PDF p.343; unit 3790 -->

```text
 XCamReturn
 rk_aiq_user_api2_a3dlut_Query3dlutInfo(const RkAiqAlgoContext *ctx,
 rk_aiq_lut3d_querry_info_t *lut3d_querry_info );
```

<!-- Source EN PDF p.343; unit 3791 -->

【参数】

<!-- Source EN PDF p.344; unit 3792 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| lut3d_querry_info | 3DLUT 查询内容。 | 输出 |

<!-- Source EN PDF p.344; unit 3793 -->

【返回值】

<!-- Source EN PDF p.344; unit 3794 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.344; unit 3795 -->

【依赖】

<!-- Source EN PDF p.344; unit 3796 -->

头文件：rk_aiq_user_api2_a3dlut.h、rk_aiq_uapi_a3dlut_int.h。

<!-- Source EN PDF p.344; unit 3797 -->

库文件：librkaiq.so

<!-- Source EN PDF p.344; unit 3798 -->

【示例】

<!-- Source EN PDF p.344; unit 3799 -->

3DLUT 信息参见 sample_a3dlut_module.cpp 的 sample_query_a3dlut_info。

<!-- Source EN PDF p.344; unit 3800 -->

#### 9.13.5 模块级 API 数据类型

<!-- Source EN PDF p.344; unit 3801 -->

9.13.5.1 rk_aiq_lut3d_op_mode_t

<!-- Source EN PDF p.344; unit 3802 -->

【说明】定义 3DLUT 工作模式。

<!-- Source EN PDF p.344; unit 3803 -->

【定义】

<!-- Source EN PDF p.344; unit 3804 -->

```text
 typedef enum rk_aiq_lut3d_op_mode_s {
     RK_AIQ_LUT3D_MODE_INVALID                     = 0,
     RK_AIQ_LUT3D_MODE_MANUAL                      = 1,
     RK_AIQ_LUT3D_MODE_AUTO                        = 2,
     RK_AIQ_LUT3D_MODE_MAX
 } rk_aiq_lut3d_op_mode_t;
```

<!-- Source EN PDF p.344; unit 3805 -->

【成员】

<!-- Source EN PDF p.344; unit 3806 -->

| 成员名称 | 说明 |
|---|---|
| RK_AIQ_LUT3D_MODE_INVALID | 3DLUT 无效模式。 |
| RK_AIQ_LUT3D_MODE_MANUAL | 3DLUT 手动模式。 |
| RK_AIQ_LUT3D_MODE_AUTO | 3DLUT 自动模式。 |

<!-- Source EN PDF p.345; unit 3807 -->

9.13.5.2 rk_aiq_lut3d_mlut3d_attrib_t

<!-- Source EN PDF p.345; unit 3808 -->

【说明】定义手动 3DLUT 属性。

<!-- Source EN PDF p.345; unit 3809 -->

【定义】

<!-- Source EN PDF p.345; unit 3810 -->

```text
 typedef struct rk_aiq_lut3d_mlut3d_attrib_s {
     unsigned short look_up_table_r[729];
     unsigned short look_up_table_g[729];
     unsigned short look_up_table_b[729];
 } rk_aiq_lut3d_mlut3d_attrib_t;
```

<!-- Source EN PDF p.345; unit 3811 -->

【成员】

<!-- Source EN PDF p.345; unit 3812 -->

| 成员名称 | 说明 |
|---|---|
| look_up_table_r | 手动模式 R 通道查找表，范围 [0x0,0x3ff]。 |
| look_up_table_g | 手动模式 G 通道查找表，范围 [0x0,0xfff]。 |
| look_up_table_b | 手动模式 B 通道查找表，范围 [0x0,0x3ff]。 |

<!-- Source EN PDF p.345; unit 3813 -->

9.13.5.3 rk_aiq_lut3d_attrib_t

<!-- Source EN PDF p.345; unit 3814 -->

【说明】定义 3DLUT 属性。

<!-- Source EN PDF p.345; unit 3815 -->

【定义】

<!-- Source EN PDF p.345; unit 3816 -->

```text
 typedef struct rk_aiq_lut3d_attrib_s {
     rk_aiq_uapi_sync_t sync;
     bool byPass;
     rk_aiq_lut3d_op_mode_t mode;
     rk_aiq_lut3d_mlut3d_attrib_t stManual;
 } rk_aiq_lut3d_attrib_t;
```

<!-- Source EN PDF p.345; unit 3817 -->

【成员】

<!-- Source EN PDF p.346; unit 3818 -->

| 成员名称 | 说明 |
|---|---|
| sync | 同步/异步信号，参见 rk_aiq_uapi_sync_t 定义及“概述/API 说明”一节。 |
| byPass | 跳过模块处理：true 跳过 3DLUT，false 启用。 |
| mode | 工作模式 {RK_AIQ_LUT3D_MODE_MANUAL, RK_AIQ_LUT3D_MODE_AUTO}，分别为手动、自动。 |
| stManual | 手动模式属性参数配置。 |

<!-- Source EN PDF p.346; unit 3819 -->

9.13.5.4 rk_aiq_lut3d_querry_info_t

<!-- Source EN PDF p.346; unit 3820 -->

【说明】定义 3DLUT 查询信息。

<!-- Source EN PDF p.346; unit 3821 -->

【定义】

<!-- Source EN PDF p.346; unit 3822 -->

```text
 typedef struct rk_aiq_lut3d_querry_info_s {
     bool lut3d_en;
     float alpha;
     char name[25];
     unsigned short look_up_table_r[729];
     unsigned short look_up_table_g[729];
     unsigned short look_up_table_b[729];
 } rk_aiq_lut3d_querry_info_t;
```

<!-- Source EN PDF p.346; unit 3823 -->

【成员】

<!-- Source EN PDF p.346; unit 3824 -->

| 成员名称 | 说明 |
|---|---|
| lut3d_en | 3DLUT 使能：true 启用，false 禁用。 |
| alpha | 3DLUT 调整强度，范围 [0,1.0]，越大强度越高；原文末尾值 1.0。 |
| name | 3DLUT 表名，仅支持自动模式。 |
| look_up_table_r | R 通道查找表，范围 [0x0,0x3ff]。 |
| look_up_table_g | G 通道查找表，范围 [0x0,0xfff]。 |
| look_up_table_b | B 通道查找表，范围 [0x0,0x3ff]。 |

<!-- Source EN PDF p.347; unit 3825 -->

### 9.14 LDCH

<!-- Source EN PDF p.347; unit 3826 -->

#### 9.14.1 功能说明

<!-- Source EN PDF p.347; unit 3827 -->

LDCH 恢复存在畸变的图像，仅校正水平方向畸变。

<!-- Source EN PDF p.347; unit 3828 -->

#### 9.14.2 功能级 API 参考

<!-- Source EN PDF p.347; unit 3829 -->

9.14.2.1 rk_aiq_uapi_setLdchEn

<!-- Source EN PDF p.347; unit 3830 -->

【说明】水平畸变校正开关。

<!-- Source EN PDF p.347; unit 3831 -->

【语法】

<!-- Source EN PDF p.347; unit 3832 -->

```text
 XCamReturn rk_aiq_uapi2_setLdchEn(const rk_aiq_sys_ctx_t* ctx, bool en);
```

<!-- Source EN PDF p.347; unit 3833 -->

【参数】

<!-- Source EN PDF p.347; unit 3834 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| en | 校正开关。 | 输入 |

<!-- Source EN PDF p.347; unit 3835 -->

【返回值】

<!-- Source EN PDF p.347; unit 3836 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.347; unit 3837 -->

【依赖】

<!-- Source EN PDF p.347; unit 3838 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.347; unit 3839 -->

库文件：librkaiq.so

<!-- Source EN PDF p.347; unit 3840 -->

9.14.2.2 rk_aiq_uapi2_setLdchCorrectLevel

<!-- Source EN PDF p.347; unit 3841 -->

【说明】设置水平畸变校正等级。

<!-- Source EN PDF p.347; unit 3842 -->

【语法】

<!-- Source EN PDF p.347; unit 3843 -->

```text
 XCamReturn rk_aiq_uapi2_setLdchCorrectLevel(const rk_aiq_sys_ctx_t* ctx, int
 correctLevel);
```

<!-- Source EN PDF p.347; unit 3844 -->

【参数】

<!-- Source EN PDF p.348; unit 3845 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| correctLevel | 校正等级，范围 [0~255]。 | 输入 |

<!-- Source EN PDF p.348; unit 3846 -->

【返回值】

<!-- Source EN PDF p.348; unit 3847 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.348; unit 3848 -->

【依赖】

<!-- Source EN PDF p.348; unit 3849 -->

头文件：rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.348; unit 3850 -->

库文件：librkaiq.so

<!-- Source EN PDF p.348; unit 3851 -->

#### 9.14.3 模块级 API 参考

<!-- Source EN PDF p.348; unit 3852 -->

9.14.3.1 rk_aiq_user_api2_aldch_SetAttrib

<!-- Source EN PDF p.348; unit 3853 -->

【说明】设置 FEC 属性（原文如此，本节为 LDCH）。

<!-- Source EN PDF p.348; unit 3854 -->

【语法】

<!-- Source EN PDF p.348; unit 3855 -->

```text
 XCamReturn
 rk_aiq_user_api2_aldch_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ldch_attrib_t attr);
```

<!-- Source EN PDF p.348; unit 3856 -->

【参数】

<!-- Source EN PDF p.348; unit 3857 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | LDCH 参数属性。 | 输入 |

<!-- Source EN PDF p.348; unit 3858 -->

【返回值】

<!-- Source EN PDF p.348; unit 3859 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.348; unit 3860 -->

【依赖】

<!-- Source EN PDF p.348; unit 3861 -->

头文件：rk_aiq_user_api2_aldch.h。

<!-- Source EN PDF p.348; unit 3862 -->

库文件：librkaiq.so

<!-- Source EN PDF p.349; unit 3863 -->

9.14.3.2 rk_aiq_user_api2_aldch_GetAttrib

<!-- Source EN PDF p.349; unit 3864 -->

【说明】获取 FEC 属性（原文如此）。

<!-- Source EN PDF p.349; unit 3865 -->

【语法】

<!-- Source EN PDF p.349; unit 3866 -->

```text
 XCamReturn
 rk_aiq_user_api2_aldch_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ldch_attrib_t attr);
```

<!-- Source EN PDF p.349; unit 3867 -->

【参数】

<!-- Source EN PDF p.349; unit 3868 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | LDCH 参数属性。 | 输入 |

<!-- Source EN PDF p.349; unit 3869 -->

【返回值】

<!-- Source EN PDF p.349; unit 3870 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.349; unit 3871 -->

【依赖】

<!-- Source EN PDF p.349; unit 3872 -->

头文件：rk_aiq_user_api2_aldch.h。

<!-- Source EN PDF p.349; unit 3873 -->

库文件：librkaiq.so

<!-- Source EN PDF p.349; unit 3874 -->

#### 9.14.4 模块级 API 数据类型

<!-- Source EN PDF p.349; unit 3875 -->

9.14.4.1 rk_aiq_ldch_attrib_t

<!-- Source EN PDF p.349; unit 3876 -->

【说明】LDCH 属性配置。

<!-- Source EN PDF p.349; unit 3877 -->

【定义】

<!-- Source EN PDF p.349; unit 3878 -->

```text
 typedef struct rk_aiq_ldch_cfg_s {
     rk_aiq_uapi_sync_t sync;
     unsigned int en;
     int correct_level;
 } rk_aiq_ldch_cfg_t;
```

<!-- Source EN PDF p.349; unit 3879 -->

【成员】

<!-- Source EN PDF p.350; unit 3880 -->

| 成员名称 | 说明 |
|---|---|
| sync | 接口同步/异步功能，参见 rk_aiq_uapi_sync_t 定义及“概述/API 说明”一节。 |
| en | 启用/禁用 LDCH。 |
| correct_level | 设置 LDCH 校正等级：[0~255]。 |

<!-- Source EN PDF p.350; unit 3881 -->

### 9.15 DeBayer

<!-- Source EN PDF p.350; unit 3882 -->

#### 9.15.1 功能说明

<!-- Source EN PDF p.350; unit 3883 -->

DeBayer 通过插值算法，将传感器采集的 CFA 图像恢复为具有完整像素信息的 RGB 图像。

<!-- Source EN PDF p.350; unit 3884 -->

模块支持 Bayer raw 的 RGGB、BGGR、GRBG、gbrg 四种排列。目前不支持 CCCB、RGB-IR 等其他 CFA 数据。

<!-- Source EN PDF p.350; unit 3885 -->

#### 9.15.2 模块级 API 参考

<!-- Source EN PDF p.350; unit 3886 -->

9.15.2.1 rk_aiq_user_api_adebayer_SetAttrib

<!-- Source EN PDF p.350; unit 3887 -->

【说明】设置去马赛克属性。

<!-- Source EN PDF p.350; unit 3888 -->

【语法】

<!-- Source EN PDF p.350; unit 3889 -->

```text
 XCamReturn
 rk_aiq_user_api2_adebayer_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 adebayer_attrib_t attr);
```

<!-- Source EN PDF p.350; unit 3890 -->

【参数】

<!-- Source EN PDF p.350; unit 3891 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 去马赛克属性。 | 输入 |

<!-- Source EN PDF p.350; unit 3892 -->

【返回值】

<!-- Source EN PDF p.350; unit 3893 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.350; unit 3894 -->

【依赖】

<!-- Source EN PDF p.351; unit 3895 -->

头文件：rk_aiq_user_api2_adebayer.h。

<!-- Source EN PDF p.351; unit 3896 -->

库文件：librkaiq.so

<!-- Source EN PDF p.351; unit 3897 -->

9.15.2.2 rk_aiq_user_api_adebayer_GetAttrib

<!-- Source EN PDF p.351; unit 3898 -->

【说明】获取去马赛克属性。

<!-- Source EN PDF p.351; unit 3899 -->

【语法】

<!-- Source EN PDF p.351; unit 3900 -->

```text
 XCamReturn
 rk_aiq_user_api2_adebayer_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 adebayer_attrib_t *attr);
```

<!-- Source EN PDF p.351; unit 3901 -->

【参数】

<!-- Source EN PDF p.351; unit 3902 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 去马赛克属性。 | 输出 |

<!-- Source EN PDF p.351; unit 3903 -->

【返回值】

<!-- Source EN PDF p.351; unit 3904 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.351; unit 3905 -->

【依赖】

<!-- Source EN PDF p.351; unit 3906 -->

头文件：rk_aiq_uapi2_adebayer_int.h。

<!-- Source EN PDF p.351; unit 3907 -->

库文件：librkaiq.so

<!-- Source EN PDF p.351; unit 3908 -->

#### 9.15.3 数据类型

<!-- Source EN PDF p.351; unit 3909 -->

9.15.3.1 rk_aiq_debayer_op_mode_t

<!-- Source EN PDF p.351; unit 3910 -->

【说明】定义 debayer 工作模式。

<!-- Source EN PDF p.351; unit 3911 -->

【定义】

<!-- Source EN PDF p.352; unit 3912 -->

```text
 typedef enum rk_aiq_debayer_op_mode_s {
     RK_AIQ_DEBAYER_MODE_INVALID                     = 0,        /**<
 initialization value */
     RK_AIQ_DEBAYER_MODE_MANUAL                      = 1,        /**< run manual
 lens shading correction */
     RK_AIQ_DEBAYER_MODE_AUTO                        = 2,        /**< run auto
 lens shading correction */
     RK_AIQ_DEBAYER_MODE_MAX
 } rk_aiq_debayer_op_mode_t;
```

<!-- Source EN PDF p.352; unit 3913 -->

【成员】

<!-- Source EN PDF p.352; unit 3914 -->

| 成员名称 | 说明 |
|---|---|
| RK_AIQ_DEBAYER_MODE_INVALID | Debayer 无效模式。 |
| RK_AIQ_DEBAYER_MODE_MANUAL | Debayer 手动模式。 |
| RK_AIQ_DEBAYER_MODE_AUTO | Debayer 自动模式。 |

<!-- Source EN PDF p.352; unit 3915 -->

9.15.3.2 adebayer_attrib_manual_t

<!-- Source EN PDF p.352; unit 3916 -->

【说明】定义 debayer 手动模式可配置属性。

<!-- Source EN PDF p.352; unit 3917 -->

【定义】

<!-- Source EN PDF p.352; unit 3918 -->

```text
 typedef struct adebayer_attrib_manual_s {
     int8_t      filter1[5];
     int8_t      filter2[5];
     uint8_t     gain_offset;
     uint8_t     sharp_strength;
     uint8_t     hf_offset;
     uint8_t     offset;
     uint8_t     clip_en;
     uint8_t     filter_g_en;
     uint8_t     filter_c_en;
     uint8_t     thed0;
     uint8_t     thed1;
     uint8_t     dist_scale;
     uint8_t     cnr_strength;
     uint8_t     shift_num;
 } adebayer_attrib_manual_t;
```

<!-- Source EN PDF p.352; unit 3919 -->

【成员】

<!-- Source EN PDF p.353; unit 3920 -->

| 成员名称 | 说明 |
|---|---|
| filter1 | 低频梯度滤波器，范围 [-8,7]。 |
| filter2 | 高频梯度滤波器，范围 [-8,7]。 |
| gain_offset | 计算 G 通道插值系数中锐化权重时的梯度偏移，范围 [0,15]。 |
| sharp_strength | G 通道插值锐化强度，越大越强。范围 [0,4]。 |
| hf_offset | 插值方向控制：较小时平坦区容易产生伪纹理，较大时边缘更易出现锯齿。范围 [0,4095]。 |
| offset | G 通道裁剪偏移，越大裁剪范围越大。范围 [0,65535]。 |
| clip_en | G 通道插值裁剪开关：0 关闭，1 开启。 |
| filter_g_en | G 通道散点去除开关：0 关闭，1 开启。 |
| filter_c_en | 伪色去除开关：0 关闭，1 开启。 |
| thed0 | 值越大，选择高频权重的概率越小。范围 [0,16]。 |
| thed1 | 控制高低频权重选择；值越大，选择低频权重的概率越小。范围 [0,16]。 |
| dist_scale | 值越大，选择高频权重的概率越小。范围 [0,16]。 |
| cnr_strength | 值越大强度越大，范围 [0,9]。 |
| shift_num | 值越小，色差裁剪范围越大。范围 [0,4]。 |

<!-- Source EN PDF p.353; unit 3921 -->

9.15.3.3 adebayer_attrib_auto_t

<!-- Source EN PDF p.353; unit 3922 -->

【说明】定义 debayer 自动模式可配置属性。

<!-- Source EN PDF p.353; unit 3923 -->

【定义】

<!-- Source EN PDF p.354; unit 3924 -->

```text
 typedef struct adebayer_attrib_auto_s {
     uint8_t     sharp_strength[9];
     uint8_t     low_freq_thresh;
     uint8_t     high_freq_thresh;
 } adebayer_attrib_auto_t;
```

<!-- Source EN PDF p.354; unit 3925 -->

【成员】

<!-- Source EN PDF p.354; unit 3926 -->

| 成员名称 | 说明 |
|---|---|
| enhance_strength[9] | 不同 ISO 的细节纹理增强：索引 0–8 分别对应 ISO 50、100、200、400、800、1600、3200、6400、12800。值越大，细节与清晰度越高，也会增强更多伪细节。范围 [0~7]。 |
| low_freq_thresh | 低频权重选择阈值，越大选择低频权重的概率越小。范围 [0~15]。 |
| high_freq_thresh | 高频权重选择阈值，越大选择高频权重的概率越小。范围 [0~15]。 |

<!-- Source EN PDF p.354; unit 3927 -->

9.15.3.4 adebayer_attrib_t

<!-- Source EN PDF p.354; unit 3928 -->

【说明】定义 debayer 可配置属性。

<!-- Source EN PDF p.354; unit 3929 -->

【定义】

<!-- Source EN PDF p.354; unit 3930 -->

```text
 typedef struct adebayer_attrib_s {
     rk_aiq_uapi_sync_t          sync;
     uint8_t                     enable;
     rk_aiq_debayer_op_mode_t    mode;
     adebayer_attrib_manual_t    stManual;
     adebayer_attrib_auto_t      stAuto;
 } adebayer_attrib_t;
```

<!-- Source EN PDF p.354; unit 3931 -->

【成员】

<!-- Source EN PDF p.355; unit 3932 -->

| 成员名称 | 说明 |
|---|---|
| sync | 同步/异步接口模式详见 rk_aiq_uapi_sync_t 及“概述/API 说明”。 |
| enable | debayer 模块开关：0 旁路，1 开启。 |
| mode | Debayer 工作模式。 |
| stManual | Debaye 手动控制模式配置属性（保留原拼写）。 |
| stAuto | debayer 自动控制模式配置属性。 |

<!-- Source EN PDF p.355; unit 3933 -->

### 9.16 DPCC

<!-- Source EN PDF p.355; unit 3934 -->

#### 9.16.1 功能说明

<!-- Source EN PDF p.355; unit 3935 -->

检测并消除图像坏点。详见 Rockchip_Tuning_Guide_ISP30 第 4.6 节 DPCC 的“功能说明”。

<!-- Source EN PDF p.355; unit 3936 -->

#### 9.16.2 模块级 API 参考

<!-- Source EN PDF p.355; unit 3937 -->

9.16.2.1 rk_aiq_user_api2_adpcc_SetAttrib

<!-- Source EN PDF p.355; unit 3938 -->

【说明】设置 DPCC 软件属性。

<!-- Source EN PDF p.355; unit 3939 -->

【语法】

<!-- Source EN PDF p.355; unit 3940 -->

```text
 XCamReturn
 rk_aiq_user_api2_adpcc_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_dpcc_attrib_V20_t *attr);
```

<!-- Source EN PDF p.355; unit 3941 -->

【参数】

<!-- Source EN PDF p.355; unit 3942 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | DPCC 软件属性结构。 | 输入 |

<!-- Source EN PDF p.355; unit 3943 -->

【返回值】

<!-- Source EN PDF p.355; unit 3944 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.356; unit 3945 -->

【依赖】

<!-- Source EN PDF p.356; unit 3946 -->

头文件：rk_aiq_user_api2_adpcc.h。

<!-- Source EN PDF p.356; unit 3947 -->

库文件：librkaiq.so

<!-- Source EN PDF p.356; unit 3948 -->

【说明】

<!-- Source EN PDF p.356; unit 3949 -->

9.16.2.2 rk_aiq_user_api2_adpcc_GetAttrib

<!-- Source EN PDF p.356; unit 3950 -->

【说明】获取 DPCC 软件属性。

<!-- Source EN PDF p.356; unit 3951 -->

【语法】

<!-- Source EN PDF p.356; unit 3952 -->

```text
 XCamReturn
 rk_aiq_user_api2_adpcc_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_dpcc_attrib_V20_t *attr);
```

<!-- Source EN PDF p.356; unit 3953 -->

【参数】

<!-- Source EN PDF p.356; unit 3954 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | DPCC 软件属性结构。 | 输出 |

<!-- Source EN PDF p.356; unit 3955 -->

【返回值】

<!-- Source EN PDF p.356; unit 3956 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.356; unit 3957 -->

【依赖】

<!-- Source EN PDF p.356; unit 3958 -->

头文件：rk_aiq_user_api2_adpcc.h。

<!-- Source EN PDF p.356; unit 3959 -->

库文件：librkaiq.so

<!-- Source EN PDF p.356; unit 3960 -->

【说明】

<!-- Source EN PDF p.356; unit 3961 -->

#### 9.16.3 数据类型

<!-- Source EN PDF p.356; unit 3962 -->

9.16.3.1 rk_aiq_dpcc_attrib_V20_t

<!-- Source EN PDF p.356; unit 3963 -->

【说明】定义坏点消除属性。

<!-- Source EN PDF p.356; unit 3964 -->

【定义】

<!-- Source EN PDF p.357; unit 3965 -->

```text
 typedef struct rk_aiq_dpcc_attrib_V20_s {
     AdpccOPMode_t eMode;
     Adpcc_Auto_Attr_t stAuto;
     Adpcc_Manual_Attr_t stManual;
     rk_aiq_uapi_sync_t sync;
 } rk_aiq_dpcc_attrib_V20_t;
```

<!-- Source EN PDF p.357; unit 3966 -->

【成员】

<!-- Source EN PDF p.357; unit 3967 -->

| 成员名称 | 说明 |
|---|---|
| eMode | 定义 DPCC 工作模式，详见 AdpccOPMode_t。 |
| stAuto | 自动模式参数设置。 |
| stManual | 手动模式参数设置。 |
| sync | 接口同步/异步功能，参见 rk_aiq_uapi_sync_t 定义及“概述/API 说明”。 |

<!-- Source EN PDF p.357; unit 3968 -->

9.16.3.2 AdpccOPMode_t

<!-- Source EN PDF p.357; unit 3969 -->

【说明】定义 DPCC 工作模式。

<!-- Source EN PDF p.357; unit 3970 -->

【定义】

<!-- Source EN PDF p.357; unit 3971 -->

```text
 typedef enum AdpccOPMode_e {
     ADPCC_OP_MODE_INVALID        = 0,
     ADPCC_OP_MODE_AUTO           = 1,
     ADPCC_OP_MODE_MANUAL         = 2,
     ADPCC_OP_MODE_TOOL           = 3,
     ADPCC_OP_MODE_MAX
 } AdpccOPMode_t;
```

<!-- Source EN PDF p.357; unit 3972 -->

【成员】

<!-- Source EN PDF p.357; unit 3973 -->

| 成员名称 | 说明 |
|---|---|
| ADPCC_OP_MODE_INVALID | 无效 API 模式。 |
| ADPCC_OP_MODE_AUTO | API 自动模式。 |
| ADPCC_OP_MODE_MANUAL | API 手动模式。 |
| ADPCC_OP_MODE_TOOL | API 工具模式。 |
| ADPCC_OP_MODE_MAX |  |

<!-- Source EN PDF p.358; unit 3974 -->

9.16.3.3 Adpcc_basic_params_select_t

<!-- Source EN PDF p.358; unit 3975 -->

【说明】定义 DPCC 基本参数属性。

<!-- Source EN PDF p.358; unit 3976 -->

【定义】

<!-- Source EN PDF p.358; unit 3977 -->

```text
 typedef struct Adpcc_basic_params_select_s
 {
     int           iso;
     unsigned char stage1_enable;
     unsigned char grayscale_mode;
     unsigned char enable;
     unsigned char sw_rk_out_sel;
     unsigned char sw_dpcc_output_sel;
     unsigned char stage1_rb_3x3;
     unsigned char stage1_g_3x3;
     unsigned char stage1_incl_rb_center;
     unsigned char stage1_incl_green_center;
     unsigned char stage1_use_fix_set;
     unsigned char stage1_use_set_3;
     unsigned char stage1_use_set_2;
     unsigned char stage1_use_set_1;
     unsigned char sw_rk_red_blue1_en;
     unsigned char rg_red_blue1_enable;
     unsigned char rnd_red_blue1_enable;
     unsigned char ro_red_blue1_enable;
     unsigned char lc_red_blue1_enable;
     unsigned char pg_red_blue1_enable;
     unsigned char sw_rk_green1_en;
     unsigned char rg_green1_enable;
     unsigned char rnd_green1_enable;
     unsigned char ro_green1_enable;
     unsigned char lc_green1_enable;
     unsigned char pg_green1_enable;
     unsigned char sw_rk_red_blue2_en;
     unsigned char rg_red_blue2_enable;
     unsigned char rnd_red_blue2_enable;
     unsigned char ro_red_blue2_enable;
     unsigned char lc_red_blue2_enable;
     unsigned char pg_red_blue2_enable;
     unsigned char sw_rk_green2_en;
     unsigned char rg_green2_enable;
     unsigned char rnd_green2_enable;
     unsigned char ro_green2_enable;
     unsigned char lc_green2_enable;
     unsigned char pg_green2_enable;
     unsigned char sw_rk_red_blue3_en;
     unsigned char rg_red_blue3_enable;
     unsigned char rnd_red_blue3_enable;
     unsigned char ro_red_blue3_enable;
     unsigned char lc_red_blue3_enable;
     unsigned char pg_red_blue3_enable;
     unsigned char sw_rk_green3_en;
     unsigned char rg_green3_enable;
     unsigned char rnd_green3_enable;
     unsigned char ro_green3_enable;
     unsigned char lc_green3_enable;
     unsigned char pg_green3_enable;
     unsigned char sw_mindis1_rb;
     unsigned char sw_mindis1_g;
     unsigned char line_thr_1_rb;
     unsigned char line_thr_1_g;
     unsigned char sw_dis_scale_min1;
     unsigned char sw_dis_scale_max1;
     unsigned char line_mad_fac_1_rb;
     unsigned char line_mad_fac_1_g;
     unsigned char pg_fac_1_rb;
     unsigned char pg_fac_1_g;
     unsigned char rnd_thr_1_rb;
     unsigned char rnd_thr_1_g;
     unsigned char rg_fac_1_rb;
     unsigned char rg_fac_1_g;
     unsigned char sw_mindis2_rb;
     unsigned char sw_mindis2_g;
     unsigned char line_thr_2_rb;
     unsigned char line_thr_2_g;
     unsigned char sw_dis_scale_min2;
     unsigned char sw_dis_scale_max2;
     unsigned char line_mad_fac_2_rb;
     unsigned char line_mad_fac_2_g;
     unsigned char pg_fac_2_rb;
     unsigned char pg_fac_2_g;
     unsigned char rnd_thr_2_rb;
     unsigned char rnd_thr_2_g;
     unsigned char rg_fac_2_rb;
     unsigned char rg_fac_2_g;
     unsigned char sw_mindis3_rb;
     unsigned char sw_mindis3_g;
     unsigned char line_thr_3_rb;
     unsigned char line_thr_3_g;
     unsigned char sw_dis_scale_min3;
     unsigned char sw_dis_scale_max3;
     unsigned char line_mad_fac_3_rb;
     unsigned char line_mad_fac_3_g;
     unsigned char pg_fac_3_rb;
     unsigned char pg_fac_3_g;
     unsigned char rnd_thr_3_rb;
     unsigned char rnd_thr_3_g;
     unsigned char rg_fac_3_rb;
     unsigned char rg_fac_3_g;
     unsigned char ro_lim_3_rb;
     unsigned char ro_lim_3_g;
     unsigned char ro_lim_2_rb;
     unsigned char ro_lim_2_g;
     unsigned char ro_lim_1_rb;
     unsigned char ro_lim_1_g;
     unsigned char rnd_offs_3_rb;
     unsigned char rnd_offs_3_g;
     unsigned char rnd_offs_2_rb;
     unsigned char rnd_offs_2_g;
     unsigned char rnd_offs_1_rb;
     unsigned char rnd_offs_1_g;
 } Adpcc_basic_params_select_t;
```

<!-- Source EN PDF p.360; unit 3978 -->

9.16.3.4 Adpcc_basic_params_t

<!-- Source EN PDF p.360; unit 3979 -->

【说明】定义 DPCC 基本参数属性。

<!-- Source EN PDF p.360; unit 3980 -->

【定义】

<!-- Source EN PDF p.360; unit 3981 -->

```text
 typedef struct Adpcc_basic_params_s
 {
     Adpcc_basic_params_select_t arBasic[DPCC_MAX_ISO_LEVEL];
 } Adpcc_basic_params_t;
```

<!-- Source EN PDF p.360; unit 3982 -->

【成员】

<!-- Source EN PDF p.360; unit 3983 -->

| 成员名称 | 说明 |
|---|---|
| arBasic | DPCC 基本参数。 |

<!-- Source EN PDF p.360; unit 3984 -->

9.16.3.5 Adpcc_bpt_params_t

<!-- Source EN PDF p.360; unit 3985 -->

【说明】定义自动 DPCC 属性。

<!-- Source EN PDF p.360; unit 3986 -->

【定义】

<!-- Source EN PDF p.360; unit 3987 -->

```text
 typedef struct Adpcc_bpt_params_s
 {
     unsigned char      bpt_rb_3x3;
     unsigned char      bpt_g_3x3;
     unsigned char      bpt_incl_rb_center;
     unsigned char      bpt_incl_green_center;
     unsigned char      bpt_use_fix_set;
     unsigned char      bpt_use_set_3;
     unsigned char      bpt_use_set_2;
     unsigned char      bpt_use_set_1;
     unsigned char      bpt_cor_en;
     unsigned char      bpt_det_en;
     unsigned short int bp_number;
     unsigned short int bp_table_addr;
     unsigned short int bpt_v_addr;
     unsigned short int bpt_h_addr;
     unsigned int       bp_cnt;
 } Adpcc_bpt_params_t;
```

<!-- Source EN PDF p.361; unit 3988 -->

9.16.3.6 dpcc_pdaf_point_t

<!-- Source EN PDF p.361; unit 3989 -->

【说明】

<!-- Source EN PDF p.361; unit 3990 -->

【定义】

<!-- Source EN PDF p.361; unit 3991 -->

```text
 typedef struct dpcc_pdaf_point_s
 {
     unsigned char y;
     unsigned char x;
 } dpcc_pdaf_point_t;
```

<!-- Source EN PDF p.361; unit 3992 -->

模块尚未实现。

<!-- Source EN PDF p.361; unit 3993 -->

9.16.3.7 Adpcc_pdaf_params_t

<!-- Source EN PDF p.361; unit 3994 -->

【说明】定义自动模式 PDAF 属性。

<!-- Source EN PDF p.361; unit 3995 -->

【定义】

<!-- Source EN PDF p.361; unit 3996 -->

```text
 typedef struct Adpcc_pdaf_params_s
 {
     unsigned char      sw_pdaf_en;
     unsigned char      pdaf_point_en[DPCC_PDAF_POINT_NUM];
     unsigned short int pdaf_offsety;
     unsigned short int pdaf_offsetx;
     unsigned char      pdaf_wrapy;
     unsigned char      pdaf_wrapx;
     unsigned short int pdaf_wrapy_num;
     unsigned short int pdaf_wrapx_num;
     dpcc_pdaf_point_t  point[DPCC_PDAF_POINT_NUM];
     unsigned char      pdaf_forward_med;
 } Adpcc_pdaf_params_t;
```

<!-- Source EN PDF p.361; unit 3997 -->

模块尚未实现。

<!-- Source EN PDF p.361; unit 3998 -->

9.16.3.8 CalibDb_Dpcc_Fast_Mode_t

<!-- Source EN PDF p.361; unit 3999 -->

【说明】定义自动模式中的 Fast 模式属性。

<!-- Source EN PDF p.361; unit 4000 -->

【定义】

<!-- Source EN PDF p.362; unit 4001 -->

```text
 typedef struct CalibDb_Dpcc_Fast_Mode_s
 {
     int fast_mode_en;
     int ISO[CALIBDB_DPCC_MAX_ISO_LEVEL];
     int fast_mode_single_en;
     int fast_mode_single_level[CALIBDB_DPCC_MAX_ISO_LEVEL];
     int fast_mode_double_en;
     int fast_mode_double_level[CALIBDB_DPCC_MAX_ISO_LEVEL];
     int fast_mode_triple_en;
     int fast_mode_triple_level[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_Fast_Mode_t;
```

<!-- Source EN PDF p.362; unit 4002 -->

【成员】

<!-- Source EN PDF p.362; unit 4003 -->

| 成员名 | 说明 |
|---|---|
| Fast_mode_enable | Fast_mode 开关：0 关闭，1 开启。 |
| ISO | 环境 ISO。 |
| fast_mode_single_en | 单坏点去除开关：0 关闭，1 开启。 |
| fast_mode_single_level | 单坏点去除强度，范围 [0,10]。 |
| fast_mode_double_en | 双坏点去除开关：0 关闭，1 开启。 |
| fast_mode_double_level | 双坏点去除强度，范围 [0,10]。 |
| fast_mode_triple_en | 多坏点去除开关：0 关闭，1 开启。 |
| fast_mode_triple_level | 多坏点去除强度，范围 [0,10]。 |

<!-- Source EN PDF p.362; unit 4004 -->

9.16.3.9 CalibDb_Dpcc_Sensor_t

<!-- Source EN PDF p.362; unit 4005 -->

【说明】定义自动模式中的 Fast 模式属性。

<!-- Source EN PDF p.362; unit 4006 -->

【定义】

<!-- Source EN PDF p.362; unit 4007 -->

```text
 typedef struct CalibDb_Dpcc_Sensor_s
 {
     float en;
     float max_level;
     float iso[CALIBDB_DPCC_MAX_ISO_LEVEL];
     float level_single[CALIBDB_DPCC_MAX_ISO_LEVEL];
     float level_multiple[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_Sensor_t;
```

<!-- Source EN PDF p.362; unit 4008 -->

【成员】

<!-- Source EN PDF p.363; unit 4009 -->

| 成员名 | 说明 |
|---|---|
| en | Sensor DPCC 开关：0 关闭，1 开启。 |
| max_level | 坏点去除最大强度。 |
| iso | 环境 ISO。 |
| level_single | 单坏点去除强度。 |
| level_multiple | 多坏点去除强度。 |

<!-- Source EN PDF p.363; unit 4010 -->

9.16.3.10 Adpcc_bpt_params_select_t

<!-- Source EN PDF p.363; unit 4011 -->

【说明】定义自动模式选中的 Fast 模式属性。

<!-- Source EN PDF p.363; unit 4012 -->

【定义】

<!-- Source EN PDF p.363; unit 4013 -->

```text
 typedef Adpcc_bpt_params_t Adpcc_bpt_params_select_t;
```

<!-- Source EN PDF p.363; unit 4014 -->

9.16.3.11 Adpcc_pdaf_params_select_t

<!-- Source EN PDF p.363; unit 4015 -->

【说明】定义自动模式选中的 PDAF 属性。

<!-- Source EN PDF p.363; unit 4016 -->

【定义】

<!-- Source EN PDF p.363; unit 4017 -->

```text
 typedef Adpcc_pdaf_params_t Adpcc_pdaf_params_select_t
```

<!-- Source EN PDF p.363; unit 4018 -->

9.16.3.12 Adpcc_Auto_Attr_t

<!-- Source EN PDF p.363; unit 4019 -->

【说明】定义自动 DPCC 属性。

<!-- Source EN PDF p.363; unit 4020 -->

【定义】

<!-- Source EN PDF p.363; unit 4021 -->

```text
 typedef struct Adpcc_Auto_Attr_s
 {
     Adpcc_basic_params_t        stBasicParams;
     Adpcc_bpt_params_t          stBptParams;
     Adpcc_pdaf_params_t         stPdafParams;
     CalibDb_Dpcc_Fast_Mode_t    stFastMode;
     CalibDb_Dpcc_Sensor_t       stSensorDpcc;
     Adpcc_basic_params_select_t stBasicSelect;
     Adpcc_bpt_params_select_t   stBptSelect;
     Adpcc_pdaf_params_select_t  stPdafSelect;
 } Adpcc_Auto_Attr_t;
```

<!-- Source EN PDF p.363; unit 4022 -->

【成员】

<!-- Source EN PDF p.364; unit 4023 -->

| 成员名称 | 说明 |
|---|---|
| stBasicParams | 自动模式基本参数。 |
| stBptParams | 自动模式坏点参数。 |
| stPdafParams | 自动模式 PDAF 参数。 |
| stFastMode | 自动模式快速模式参数。 |
| stSensorDpcc | 自动模式传感器坏点功能参数。 |
| stBasicSelect | 自动模式选中的基本参数。 |
| stBptSelect | 自动模式选中的坏点参数。 |
| stPdafSelect | 自动模式选中的 PDAF 参数。 |

<!-- Source EN PDF p.364; unit 4024 -->

9.16.3.13 Adpcc_fast_mode_attr_t

<!-- Source EN PDF p.364; unit 4025 -->

【说明】定义手动模式的快速模式属性。

<!-- Source EN PDF p.364; unit 4026 -->

【定义】

<!-- Source EN PDF p.364; unit 4027 -->

```text
 typedef struct Adpcc_fast_mode_attr_s
 {
     bool fast_mode_en;
     bool fast_mode_single_en;
     int  fast_mode_single_level;
     bool fast_mode_double_en;
     int  fast_mode_double_level;
     bool fast_mode_triple_en;
     int  fast_mode_triple_level;
 } Adpcc_fast_mode_attr_t;
```

<!-- Source EN PDF p.364; unit 4028 -->

【成员】

<!-- Source EN PDF p.364; unit 4029 -->

| 成员名 | 说明 |
|---|---|
| Fast_mode_en | Fast_mode 开关。 |
| fast_mode_single_en | 单坏点去除开关。 |
| fast_mode_single_level | 单坏点去除强度，范围 [0,10]。 |
| fast_mode_double_en | 双坏点去除开关。 |
| fast_mode_double_level | 双坏点去除强度，范围 [0,10]。 |
| fast_mode_triple_en | 多坏点去除开关。 |
| fast_mode_triple_level | 多坏点去除强度，范围 [0,10]。 |

<!-- Source EN PDF p.365; unit 4030 -->

9.16.3.14 Adpcc_sensor_dpcc_attr_t

<!-- Source EN PDF p.365; unit 4031 -->

【说明】定义手动模式传感器坏点功能属性。

<!-- Source EN PDF p.365; unit 4032 -->

【定义】

<!-- Source EN PDF p.365; unit 4033 -->

```text
 typedef struct Adpcc_sensor_dpcc_attr_s
 {
     bool en;
     int  max_level;
     int  single_level;
     int  double_level;
 } Adpcc_sensor_dpcc_attr_t;
```

<!-- Source EN PDF p.365; unit 4034 -->

【成员】

<!-- Source EN PDF p.365; unit 4035 -->

| 成员名 | 说明 |
|---|---|
| en | 传感器 DPCC 开关。 |
| max_level | 坏点去除最大强度。 |
| single_level | 单坏点去除强度。 |
| double_level | 多坏点去除强度。 |

<!-- Source EN PDF p.365; unit 4036 -->

9.16.3.15 Adpcc_Manual_Attr_t

<!-- Source EN PDF p.365; unit 4037 -->

【说明】定义手动 DPCC 属性。

<!-- Source EN PDF p.365; unit 4038 -->

【定义】

<!-- Source EN PDF p.365; unit 4039 -->

```text
 typedef struct Adpcc_Manual_Attr_s
 {
     unsigned char enable;
     Adpcc_onfly_cfg_t stOnfly;
     Adpcc_bpt_params_select_t   stBpt;
     Adpcc_pdaf_params_select_t  stPdaf;
     Adpcc_sensor_dpcc_attr_t    stSensorDpcc;
 } Adpcc_Manual_Attr_t;
```

<!-- Source EN PDF p.365; unit 4040 -->

【成员】

<!-- Source EN PDF p.366; unit 4041 -->

| 成员名称 | 说明 |
|---|---|
| enable | 手动模式 DPCC 开关。 |
| stOnfly | 手动模式 ISP DPCC 动态坏点检测与校正参数。 |
| stBptParams | 手动模式 ISP DPCC 静态坏点校正参数。 |
| stPdafParams | 手动模式 ISP DPCC PDAF SPC 功能参数。 |
| stSensorDpcc | 手动模式传感器侧 DPCC 坏点校正参数。 |

<!-- Source EN PDF p.366; unit 4042 -->

9.16.3.16 Adpcc_onfly_cfg_t

<!-- Source EN PDF p.366; unit 4043 -->

【说明】定义手动 DPCC 基本参数。

<!-- Source EN PDF p.366; unit 4044 -->

【定义】

<!-- Source EN PDF p.366; unit 4045 -->

```text
 typedef struct Adpcc_onfly_cfg_s {
    Adpcc_onfly_mode_t mode;
    Adpcc_fast_mode_attr_t fast_mode;
    Adpcc_basic_cfg_params_t expert_mode;
 } Adpcc_onfly_cfg_t;
```

<!-- Source EN PDF p.366; unit 4046 -->

【成员】

<!-- Source EN PDF p.366; unit 4047 -->

| 成员名称 | 说明 |
|---|---|
| mode | 快速模式或专家模式。 |
| fastmode | 手动模式的快速模式参数设置。 |
| expert_mode | 专家模式参数设置。 |

<!-- Source EN PDF p.366; unit 4048 -->

9.16.3.17 Adpcc_onfly_mode_t

<!-- Source EN PDF p.366; unit 4049 -->

【说明】定义手动 DPCC 基本参数。

<!-- Source EN PDF p.366; unit 4050 -->

【定义】

<!-- Source EN PDF p.366; unit 4051 -->

```text
 typedef enum Adpcc_onfly_mode_e {
     ADPCC_ONFLY_MODE_FAST        = 0,                   /**< dpcc manual fast
 mode */
     ADPCC_ONFLY_MODE_EXPERT      = 1,                   /**< dpcc manual expert
 mode */
     ADPCC_ONFLY_MODE_MAX                                /**< max */
 } Adpcc_onfly_mode_t;
```

<!-- Source EN PDF p.367; unit 4052 -->

【成员】

<!-- Source EN PDF p.367; unit 4053 -->

| 成员名称 | 说明 |
|---|---|
| ADPCC_ONFLY_MODE_FAST | 快速模式。 |
| ADPCC_ONFLY_MODE_EXPERT | 专家模式。 |
| ADPCC_ONFLY_MODE_MAX | 无效参数设置。 |

<!-- Source EN PDF p.367; unit 4054 -->

9.16.3.18 CalibDb_Dpcc_Pdaf_t

<!-- Source EN PDF p.367; unit 4055 -->

【说明】定义工具 PDAF SPC 功能属性参数。

<!-- Source EN PDF p.367; unit 4056 -->

【定义】

<!-- Source EN PDF p.367; unit 4057 -->

```text
 typedef struct CalibDb_Dpcc_Pdaf_s
 {
     unsigned char      en;
     unsigned char      point_en[16];
     unsigned short int offsetx;
     unsigned short int offsety;
     unsigned char      wrapx;
     unsigned char      wrapy;
     unsigned short int wrapx_num;
     unsigned short int wrapy_num;
     unsigned char      point_x[16];
     unsigned char      point_y[16];
     unsigned char      forward_med;
 } CalibDb_Dpcc_Pdaf_t;
```

<!-- Source EN PDF p.367; unit 4058 -->

9.16.3.19 CalibDb_Dpcc_set_RK_t

<!-- Source EN PDF p.367; unit 4059 -->

【说明】定义 RK 算法属性。

<!-- Source EN PDF p.367; unit 4060 -->

【定义】

<!-- Source EN PDF p.367; unit 4061 -->

```text
 typedef struct CalibDb_Dpcc_set_RK_s
 {
     unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_sw_mindis[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_sw_mindis[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char sw_dis_scale_min[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char sw_dis_scale_max[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_set_RK_t;
```

<!-- Source EN PDF p.367; unit 4062 -->

【成员】

<!-- Source EN PDF p.368; unit 4063 -->

| 成员名称 | 说明 |
|---|---|
| rb_enable | 红、蓝通道坏点检测开关。 |
| g_enable | 绿色通道坏点检测开关。 |
| rb_sw_mindis | 红、蓝通道坏点阈值 1。 |
| g_sw_mindis | 绿色通道坏点阈值 1。 |
| sw_dis_scale_min | 坏点阈值 2。 |
| sw_dis_scale_max | 坏点阈值 3。 |

<!-- Source EN PDF p.368; unit 4064 -->

9.16.3.20 CalibDb_Dpcc_set_LC_t

<!-- Source EN PDF p.368; unit 4065 -->

【说明】定义 LC 算法属性。

<!-- Source EN PDF p.368; unit 4066 -->

【定义】

<!-- Source EN PDF p.368; unit 4067 -->

```text
 typedef struct CalibDb_Dpcc_set_LC_s
 {
     unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_line_thr[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_line_thr[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_line_mad_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_line_mad_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_set_LC_t;
```

<!-- Source EN PDF p.368; unit 4068 -->

【成员】

<!-- Source EN PDF p.368; unit 4069 -->

| 成员名称 | 说明 |
|---|---|
| rb_enable | 红、蓝通道坏点检测开关。 |
| g_enable | 绿色通道坏点检测开关。 |
| rb_line_thr | 红、蓝通道坏点阈值 1。 |
| g_line_thr | 绿色通道坏点阈值 1。 |
| rb_line_mad_fac | 红、蓝通道坏点阈值 2。 |
| g_line_mad_fac | 绿色通道坏点阈值 2。 |

<!-- Source EN PDF p.368; unit 4070 -->

9.16.3.21 CalibDb_Dpcc_set_PG_t

<!-- Source EN PDF p.368; unit 4071 -->

【说明】定义 PG 算法属性。

<!-- Source EN PDF p.368; unit 4072 -->

【定义】

<!-- Source EN PDF p.369; unit 4073 -->

```text
 typedef struct CalibDb_Dpcc_set_PG_s
 {
     unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_pg_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_pg_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_set_PG_t;
```

<!-- Source EN PDF p.369; unit 4074 -->

【成员】

<!-- Source EN PDF p.369; unit 4075 -->

| 成员名称 | 说明 |
|---|---|
| rb_enable | 红、蓝通道坏点检测开关。 |
| g_enable | 绿色通道坏点检测开关。 |
| rb_pg_fac | 红、蓝通道坏点阈值。 |
| g_pg_fac | 绿色通道坏点阈值。 |

<!-- Source EN PDF p.369; unit 4076 -->

9.16.3.22 CalibDb_Dpcc_set_RND_t

<!-- Source EN PDF p.369; unit 4077 -->

【说明】定义 RND 算法属性。

<!-- Source EN PDF p.369; unit 4078 -->

【定义】

<!-- Source EN PDF p.369; unit 4079 -->

```text
 typedef struct CalibDb_Dpcc_set_RND_s
 {
     unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_rnd_thr[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_rnd_thr[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_rnd_offs[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_rnd_offs[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_set_RND_t;
```

<!-- Source EN PDF p.369; unit 4080 -->

【成员】

<!-- Source EN PDF p.369; unit 4081 -->

| 成员名称 | 说明 |
|---|---|
| rb_enable | 红、蓝通道坏点检测开关。 |
| g_enable | 绿色通道坏点检测开关。 |
| rb_rnd_thr | 红、蓝通道坏点阈值 1。 |
| g_rnd_thr | 绿色通道坏点阈值 1。 |
| rb_rnd_offs | 红、蓝通道坏点阈值 2。 |
| g_rnd_offs | 绿色通道坏点阈值 2。 |

<!-- Source EN PDF p.370; unit 4082 -->

9.16.3.23 CalibDb_Dpcc_set_RG_t

<!-- Source EN PDF p.370; unit 4083 -->

【说明】定义 RK 算法属性。

<!-- Source EN PDF p.370; unit 4084 -->

【定义】

<!-- Source EN PDF p.370; unit 4085 -->

```text
 typedef struct CalibDb_Dpcc_set_RG_s
 {
     unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_rg_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_rg_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_set_RG_t;
```

<!-- Source EN PDF p.370; unit 4086 -->

【成员】

<!-- Source EN PDF p.370; unit 4087 -->

| 成员名称 | 说明 |
|---|---|
| rb_enable | 红、蓝通道坏点检测开关。 |
| g_enable | 绿色通道坏点检测开关。 |
| rb_rg_fac | 红、蓝通道坏点阈值。 |
| g_rg_fac | 绿色通道坏点阈值。 |

<!-- Source EN PDF p.370; unit 4088 -->

9.16.3.24 CalibDb_Dpcc_set_RO_t

<!-- Source EN PDF p.370; unit 4089 -->

【说明】定义 RO 算法属性。

<!-- Source EN PDF p.370; unit 4090 -->

【定义】

<!-- Source EN PDF p.370; unit 4091 -->

```text
 typedef struct CalibDb_Dpcc_set_RO_s
 {
     unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_ro_lim[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_ro_lim[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_set_RO_t;
```

<!-- Source EN PDF p.370; unit 4092 -->

【成员】

<!-- Source EN PDF p.370; unit 4093 -->

| 成员名称 | 说明 |
|---|---|
| rb_enable | 红、蓝通道坏点检测开关。 |
| g_enable | 绿色通道坏点检测开关。 |
| rb_ro_lim | 红、蓝通道坏点阈值。 |
| g_ro_lim | 绿色通道坏点阈值。 |

<!-- Source EN PDF p.371; unit 4094 -->

9.16.3.25 CalibDb_Dpcc_set_t

<!-- Source EN PDF p.371; unit 4095 -->

【说明】定义坏点条件属性。

<!-- Source EN PDF p.371; unit 4096 -->

【定义】

<!-- Source EN PDF p.371; unit 4097 -->

```text
 typedef struct CalibDb_Dpcc_set_s
 {
     CalibDb_Dpcc_set_RK_t  rk;
     CalibDb_Dpcc_set_LC_t  lc;
     CalibDb_Dpcc_set_PG_t  pg;
     CalibDb_Dpcc_set_RND_t rnd;
     CalibDb_Dpcc_set_RG_t  rg;
     CalibDb_Dpcc_set_RO_t  ro;
 } CalibDb_Dpcc_set_t;
```

<!-- Source EN PDF p.371; unit 4098 -->

【成员】

<!-- Source EN PDF p.371; unit 4099 -->

| 成员名称 | 说明 |
|---|---|
| rk | RK 算法。 |
| lc | LC 算法。 |
| pg | PG 算法。 |
| rnd | RND 算法。 |
| rg | RG 算法。 |
| ro | RO 算法。 |

<!-- Source EN PDF p.371; unit 4100 -->

9.16.3.26 CalibDb_Dpcc_Expert_Mode_t

<!-- Source EN PDF p.371; unit 4101 -->

【说明】定义工具专家模式属性。

<!-- Source EN PDF p.371; unit 4102 -->

【定义】

<!-- Source EN PDF p.371; unit 4103 -->

```text
 typedef struct CalibDb_Dpcc_Expert_Mode_s
 {
     float              iso[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_Enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      grayscale_mode;
     unsigned char      rk_out_sel[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      dpcc_out_sel[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_rb_3x3[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_g_3x3[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_inc_rb_center[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_inc_g_center[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_use_fix_set[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_use_set3[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_use_set2[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_use_set1[CALIBDB_DPCC_MAX_ISO_LEVEL];
     CalibDb_Dpcc_set_t set[3];
 } CalibDb_Dpcc_Expert_Mode_t;
```

<!-- Source EN PDF p.372; unit 4104 -->

【成员】

<!-- Source EN PDF p.372; unit 4105 -->

| 成员名 | 说明 |
|---|---|
| iso | 环境 ISO。 |
| stage1_Enable | 默认值 1。 |
| grayscale_mode | 黑白模式开关：0 关闭，1 开启。 |
| rk_out_sel | RK 坏点判定模式：0 为模式 1，1 为模式 2，2 为模式 3。 |
| dpcc_out_sel | 坏点校正模式：0 中值，1 RK 模式。 |
| stage1_rb_3x3 | 默认值 0。 |
| stage1_g_3x3 | 默认值 0。 |
| stage1_inc_rb_center | 默认值 1。 |
| stage1_inc_g_center | 默认值 1。 |
| stage1_use_fix_set | 内置坏点条件开关：0 关闭，1 开启。 |
| stage1_use_set3 | set_cell 中第三组坏点判定条件开关：0 关闭，1 开启。 |
| stage1_use_set2 | set_cell 中第二组坏点判定条件开关：0 关闭，1 开启。 |
| stage1_use_set1 | set_cell 中第一组坏点判定条件开关：0 关闭，1 开启。 |

<!-- Source EN PDF p.372; unit 4106 -->

9.16.3.27 CalibDb_Dpcc_t

<!-- Source EN PDF p.372; unit 4107 -->

【说明】定义工具 DPCC 属性。

<!-- Source EN PDF p.372; unit 4108 -->

【定义】

<!-- Source EN PDF p.372; unit 4109 -->

```text
 typedef struct CalibDb_Dpcc_s
 {
     int                        enable;
     char                       version[64];
     CalibDb_Dpcc_Fast_Mode_t   fast;
     CalibDb_Dpcc_Expert_Mode_t expert;
     CalibDb_Dpcc_Pdaf_t        pdaf;
     CalibDb_Dpcc_Sensor_t      sensor_dpcc;
 } CalibDb_Dpcc_t;
```

<!-- Source EN PDF p.372; unit 4110 -->

【成员】

<!-- Source EN PDF p.373; unit 4111 -->

| 成员名称 | 说明 |
|---|---|
| enable | 开关功能 |
| 版本 | 版本 |
| fast | 快速模式。 |
| expert | 专家模式。 |
| pdaf | PADF SPC 功能模式的坏点条件（PADF 为原文拼写）。 |
| sensor_dpcc | 传感器侧 DPCC 坏点校正参数。 |

<!-- Source EN PDF p.373; unit 4112 -->

9.16.3.28 rk_aiq_dpcc_attrib_t

<!-- Source EN PDF p.373; unit 4113 -->

【说明】定义 DPCC 属性。

<!-- Source EN PDF p.373; unit 4114 -->

【定义】

<!-- Source EN PDF p.373; unit 4115 -->

```text
 typedef struct rk_aiq_dpcc_attrib_s
 {
     AdpccOPMode_t       eMode;
     Adpcc_Auto_Attr_t   stAuto;
     Adpcc_Manual_Attr_t stManual;
     CalibDb_Dpcc_t      stTool;
 } rk_aiq_dpcc_attrib_t;
```

<!-- Source EN PDF p.373; unit 4116 -->

【成员】

<!-- Source EN PDF p.373; unit 4117 -->

| 成员名称 | 说明 |
|---|---|
| eMode | API 模式 |
| stAuto | 自动 DPCC 模式。 |
| stManual | 手动 DPCC 模式。 |
| stTool | 工具 DPCC 模式。 |

<!-- Source EN PDF p.373; unit 4118 -->

### 9.17 LSC

<!-- Source EN PDF p.373; unit 4119 -->

#### 9.17.1 功能说明

<!-- Source EN PDF p.373; unit 4120 -->

镜头阴影校正解决镜头光学特性及折射不均匀引起的周边阴影。

<!-- Source EN PDF p.374; unit 4121 -->

#### 9.17.2 模块级 API 参考

<!-- Source EN PDF p.374; unit 4122 -->

9.17.2.1 rk_aiq_user_api2_alsc_SetAttrib

<!-- Source EN PDF p.374; unit 4123 -->

【说明】设置镜头阴影校正属性。

<!-- Source EN PDF p.374; unit 4124 -->

【语法】

<!-- Source EN PDF p.374; unit 4125 -->

```text
 XCamReturn
 rk_aiq_user_api2_alsc_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_lsc_attrib_t attr);
```

<!-- Source EN PDF p.374; unit 4126 -->

【参数】

<!-- Source EN PDF p.374; unit 4127 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 镜头阴影校正属性。 | 输入 |

<!-- Source EN PDF p.374; unit 4128 -->

【返回值】

<!-- Source EN PDF p.374; unit 4129 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.374; unit 4130 -->

【依赖】

<!-- Source EN PDF p.374; unit 4131 -->

头文件：rk_aiq_user_api2_alsc.h。

<!-- Source EN PDF p.374; unit 4132 -->

库文件：librkaiq.so

<!-- Source EN PDF p.374; unit 4133 -->

9.17.2.2 rk_aiq_user_api2_alsc_GetAttrib

<!-- Source EN PDF p.374; unit 4134 -->

【说明】获取镜头阴影校正属性。

<!-- Source EN PDF p.374; unit 4135 -->

【语法】

<!-- Source EN PDF p.374; unit 4136 -->

```text
 XCamReturn
 rk_aiq_user_api2_adebayer_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_lsc_attrib_t *attr);
```

<!-- Source EN PDF p.374; unit 4137 -->

【参数】

<!-- Source EN PDF p.375; unit 4138 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 镜头阴影校正属性。 | 输出 |

<!-- Source EN PDF p.375; unit 4139 -->

【返回值】

<!-- Source EN PDF p.375; unit 4140 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.375; unit 4141 -->

【依赖】

<!-- Source EN PDF p.375; unit 4142 -->

头文件：rk_aiq_user_api2_alsc.h。

<!-- Source EN PDF p.375; unit 4143 -->

库文件：librkaiq.so

<!-- Source EN PDF p.375; unit 4144 -->

#### 9.17.3 数据类型

<!-- Source EN PDF p.375; unit 4145 -->

9.17.3.1 rk_aiq_lsc_attrib_t

<!-- Source EN PDF p.375; unit 4146 -->

【说明】定义 ISP 镜头阴影校正属性。

<!-- Source EN PDF p.375; unit 4147 -->

【定义】

<!-- Source EN PDF p.375; unit 4148 -->

```text
 typedef struct rk_aiq_lsc_attrib_s {
     bool byPass;
     rk_aiq_lsc_op_mode_t mode;
     rk_aiq_lsc_mlsc_attrib_t stManual;
     rk_aiq_uapi_sync_t sync;
 } rk_aiq_lsc_attrib_t;
```

<!-- Source EN PDF p.375; unit 4149 -->

【成员】

<!-- Source EN PDF p.375; unit 4150 -->

| 成员名称 | 说明 |
|---|---|
| sync | 接口同步/异步功能，参见 rk_aiq_uapi_sync_t 定义及“概述/API 说明”一节。 |
| byPass | LSC 模块使能：1 关闭，0 启用。 |
| mode | 模式设置。 |
| stManual | 手动模式参数设置。 |

<!-- Source EN PDF p.376; unit 4151 -->

9.17.3.2 rk_aiq_lsc_op_mode_t

<!-- Source EN PDF p.376; unit 4152 -->

【说明】定义 ISP 镜头阴影校正工作模式。

<!-- Source EN PDF p.376; unit 4153 -->

【定义】

<!-- Source EN PDF p.376; unit 4154 -->

```text
 typedef enum rk_aiq_lsc_op_mode_s {
     RK_AIQ_LSC_MODE_INVALID                     = 0,        /**< initialization
 value */
     RK_AIQ_LSC_MODE_MANUAL                      = 1,        /**< run manual lens
 shading correction */
     RK_AIQ_LSC_MODE_AUTO                        = 2,        /**< run auto lens
 shading correction */
     RK_AIQ_LSC_MODE_MAX
 } rk_aiq_lsc_op_mode_t;
```

<!-- Source EN PDF p.376; unit 4155 -->

【成员】

<!-- Source EN PDF p.376; unit 4156 -->

| 成员名称 | 说明 |
|---|---|
| RK_AIQ_LSC_MODE_INVALID | 无效模式。 |
| RK_AIQ_LSC_MODE_MANUAL | 手动模式 |
| RK_AIQ_LSC_MODE_AUTO | 自动模式 |

<!-- Source EN PDF p.376; unit 4157 -->

9.17.3.3 rk_aiq_lsc_table_t

<!-- Source EN PDF p.376; unit 4158 -->

【说明】定义 ISP 镜头阴影校正表。

<!-- Source EN PDF p.376; unit 4159 -->

【定义】

<!-- Source EN PDF p.376; unit 4160 -->

```text
 typedef struct rk_aiq_lsc_table_s {
     unsigned short r_data_tbl[LSC_DATA_TBL_SIZE];
     unsigned short gr_data_tbl[LSC_DATA_TBL_SIZE];
     unsigned short gb_data_tbl[LSC_DATA_TBL_SIZE];
     unsigned short b_data_tbl[LSC_DATA_TBL_SIZE];
 } rk_aiq_lsc_table_t;
```

<!-- Source EN PDF p.376; unit 4161 -->

【成员】

<!-- Source EN PDF p.377; unit 4162 -->

| 成员名称 | 说明 |
|---|---|
| r_data_tbl | R 分量校正表，元素数量 [17×17]，范围 [1~7.99]；高 3 bit 为整数，低 8 bit 为小数。 |
| gr_data_tbl | GR 分量校正表，元素数量 [17×17]，范围 [1~7.99]；高 3 bit 为整数，低 8 bit 为小数。 |
| gb_data_tbl | GB 分量校正表，元素数量 [17×17]，范围 [1~7.99]；高 3 bit 为整数，低 8 bit 为小数。 |
| b_data_tbl | B 分量校正表，元素数量 [17×17]，范围 [1~7.99]；高 3 bit 为整数，低 8 bit 为小数。 |

<!-- Source EN PDF p.379; unit 4163 -->

### 9.18 GIC

<!-- Source EN PDF p.379; unit 4164 -->

#### 9.18.1 功能说明

<!-- Source EN PDF p.379; unit 4165 -->

GIC 校正 Gr、Gb 两通道失衡，改善部分场景的图像质量。

<!-- Source EN PDF p.379; unit 4166 -->

#### 9.18.2 模块级 API 参考

<!-- Source EN PDF p.379; unit 4167 -->

9.18.2.1 rk_aiq_user_api2_agic_v2_SetAttrib

<!-- Source EN PDF p.379; unit 4168 -->

【说明】设置 GIC 软件属性。

<!-- Source EN PDF p.379; unit 4169 -->

【语法】

<!-- Source EN PDF p.379; unit 4170 -->

```text
 XCamReturn rk_aiq_user_api2_agic_v2_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 const rkaiq_gic_v2_api_attr_t* attr);
```

<!-- Source EN PDF p.379; unit 4171 -->

【参数】

<!-- Source EN PDF p.379; unit 4172 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | GIC 软件属性结构。 | 输入 |

<!-- Source EN PDF p.379; unit 4173 -->

【返回值】

<!-- Source EN PDF p.379; unit 4174 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.379; unit 4175 -->

【依赖】

<!-- Source EN PDF p.379; unit 4176 -->

头文件：rk_aiq_user_api2_agic.h。

<!-- Source EN PDF p.379; unit 4177 -->

库文件：librkaiq.so

<!-- Source EN PDF p.379; unit 4178 -->

【说明】

<!-- Source EN PDF p.379; unit 4179 -->

Not.

<!-- Source EN PDF p.380; unit 4180 -->

9.18.2.2 rk_aiq_user_api2_agic_v2_GetAttrib

<!-- Source EN PDF p.380; unit 4181 -->

【说明】获取 gamma 软件属性。

<!-- Source EN PDF p.380; unit 4182 -->

【语法】

<!-- Source EN PDF p.380; unit 4183 -->

```text
 XCamReturn rk_aiq_user_api2_agic_v2_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rkaiq_gic_v2_api_attr_t* attr);
```

<!-- Source EN PDF p.380; unit 4184 -->

【参数】

<!-- Source EN PDF p.380; unit 4185 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | GIC 软件属性结构。 | 输出 |

<!-- Source EN PDF p.380; unit 4186 -->

【返回值】

<!-- Source EN PDF p.380; unit 4187 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.380; unit 4188 -->

【依赖】

<!-- Source EN PDF p.380; unit 4189 -->

头文件：rk_aiq_user_api2_agic.h。

<!-- Source EN PDF p.380; unit 4190 -->

库文件：librkaiq.so

<!-- Source EN PDF p.380; unit 4191 -->

【说明】

<!-- Source EN PDF p.380; unit 4192 -->

#### 9.18.3 模块级 API 数据类型

<!-- Source EN PDF p.380; unit 4193 -->

9.18.3.1 rkaiq_gic_api_op_mode_t

<!-- Source EN PDF p.380; unit 4194 -->

【说明】定义 GIC 工作模式。

<!-- Source EN PDF p.380; unit 4195 -->

【定义】

<!-- Source EN PDF p.380; unit 4196 -->

```text
   typedef enum rkaiq_gic_api_op_mode_e {
       RKAIQ_GIC_API_OPMODE_OFF    = 0,
       RKAIQ_GIC_API_OPMODE_AUTO   = 1,
       RKAIQ_GIC_API_OPMODE_MANUAL = 2,
   } rkaiq_gic_api_op_mode_t;
```

<!-- Source EN PDF p.380; unit 4197 -->

【成员】

<!-- Source EN PDF p.381; unit 4198 -->

| 成员名称 | 说明 |
|---|---|
| RKAIQ_GIC_API_OPMODE_OFF | GIC 关闭模式 |
| RKAIQ_GIC_API_OPMODE_AUTO | API 手动模式。 |
| RKAIQ_GIC_API_OPMODE_MANUAL | 手动模式 |

<!-- Source EN PDF p.381; unit 4199 -->

9.18.3.2  rkaiq_gic_v2_param_selected_t

<!-- Source EN PDF p.381; unit 4200 -->

【说明】定义 RK3588 下的自动/手动属性

<!-- Source EN PDF p.381; unit 4201 -->

【定义】

<!-- Source EN PDF p.381; unit 4202 -->

```text
   typedef struct rkaiq_gic_v2_param_selected_s {
       uint32_t iso;
       uint8_t bypass;
       uint8_t gr_ratio;
       uint16_t min_busy_thre;
       uint16_t min_grad_thr1;
       uint16_t min_grad_thr2;
       uint16_t k_grad1;
       uint16_t k_grad2;
       uint16_t gb_thre;
       uint16_t maxCorV;
       uint16_t maxCorVboth;
       uint16_t dark_thre;
       uint16_t dark_threHi;
       uint16_t k_grad1_dark;
       uint16_t k_grad2_dark;
       uint16_t min_grad_thr_dark1;
       uint16_t min_grad_thr_dark2;
       float NoiseScale;
       float NoiseBase;
       float noiseCurve_0;
       float noiseCurve_1;
       float globalStrength;
       uint16_t diff_clip;
   } rkaiq_gic_v2_param_selected_t;
```

<!-- Source EN PDF p.381; unit 4203 -->

【成员】

<!-- Source EN PDF p.382; unit 4204 -->

| 成员名称 | 说明 |
|---|---|
| iso | 环境 ISO |
| byPass | 保留，未使用 |
| gr_ratio | 保留，未使用 |
| min_busy_thre | 繁忙区域检测能力，范围 [0, 1023]，默认值 160 |
| min_grad_thr1 | 非边缘区域数量阈值 1，用于控制 GIC 强度，范围 [0, 1023]，默认值 32 |
| min_grad_thr2 | 非边缘区域数量阈值 2，用于控制 GIC 强度，范围 [0, 1023]，默认值 32 |
| k_grad1 | 边缘（水平和垂直梯度）响应阈值 1，范围 [0, 15]，默认值 5 |
| k_grad2 | 边缘（水平和垂直梯度）响应阈值 2，范围 [0, 15]，默认值 1 |
| gb_thre | 缩放系数，范围 [0, 15]，默认值 7 |
| maxCorV | 限制边缘区域 GB 最大补偿值，范围 [0, 1023]，默认值 40 |
| maxCorVboth | 限制平坦（非边缘）区域 GB 最大补偿值，范围 [0, 1023]，默认值 8 |
| dark_thre | 暗区阈值 1，范围 [0, 2047]，默认值 120 |
| dark_threHi | 暗区阈值 2，范围 [0, 2047]，默认值 240 |
| k_grad1_dark | 图像暗部边缘（水平和垂直梯度）响应阈值 1，范围 [0, 15]，默认值 6 |
| k_grad2_dark | 图像暗部边缘（水平和垂直梯度）响应程度阈值 2，范围 [0, 15]，默认值 1 |
| min_grad_thr_dark1 | 图像暗部非边缘区域数量阈值 1，范围 [0, 1023]，默认值 64 |
| min_grad_thr_dark2 | 图像暗部非边缘区域数量阈值 2，范围 [0, 1023]，默认值 32 |
| noiseCurve_0 | 噪声曲线参数 1 |
| noiseCurve_1 | 噪声曲线参数 2 |
| globalStrength | 全局调节 GB 补偿值强度，范围 [0, 2]，默认值 1 |

<!-- Source EN PDF p.383; unit 4205 -->

| 成员名称 | 说明 |
|---|---|
| NoiseScale | 根据噪声曲线取得当前点噪声标准差，以 noise_std *noise_scale 确定 GB 最大补偿值 |
| NoiseBase | 对图像边缘进行惩罚的调节阈值：在第一、第二梯度计算结果中加上 noise_offset 后比较；只要某一方向满足 gradx&gt;2*grady 就判为边缘，不作调节 |
| diff_clip | 限制 GB 最大补偿值 |

<!-- Source EN PDF p.383; unit 4206 -->

9.18.3.3  rkaiq_gic_v2_api_attr_t

<!-- Source EN PDF p.383; unit 4207 -->

【说明】定义 GIC 属性

<!-- Source EN PDF p.383; unit 4208 -->

【定义】

<!-- Source EN PDF p.383; unit 4209 -->

```text
   typedef struct rkaiq_gic_v2_api_attr_s {
       rk_aiq_uapi_sync_t sync;
       uint8_t gic_en;
       rkaiq_gic_api_op_mode_t op_mode;
       uint32_t iso_cnt;
       rkaiq_gic_v2_param_selected_t auto_params[RKAIQ_GIC_MAX_ISO_CNT];
       rkaiq_gic_v2_param_selected_t manual_param;
   } rkaiq_gic_v2_api_attr_t;
```

<!-- Source EN PDF p.383; unit 4210 -->

【成员】

<!-- Source EN PDF p.383; unit 4211 -->

| 成员名称 | 说明 |
|---|---|
| sync | rk_aiq_uapi_sync_t 的定义参见“概述/API 说明”。 |
| gic_en | 开关 |
| op_mode | 工作模式 |
| iso_cnt | 自动参数中的 ISO 数量 |
| auto_params | 自动参数，每个 ISO 一组，软件根据 ISO 插值自动计算 |
| manual_param | 手动参数，固定使用此组参数 |

<!-- Source EN PDF p.384; unit 4212 -->

### 9.19   CGC

<!-- Source EN PDF p.384; unit 4213 -->

#### 9.19.1 功能说明

<!-- Source EN PDF p.384; unit 4214 -->

CGC（Color Gamut Compression，色域压缩）用于设置色域压缩参数。

<!-- Source EN PDF p.384; unit 4215 -->

#### 9.19.2 功能级 API 参考

<!-- Source EN PDF p.384; unit 4216 -->

#### 9.19.3 模块级 API 参考

<!-- Source EN PDF p.384; unit 4217 -->

9.19.3.1  rk_aiq_user_api2_acgc_SetAttrib

<!-- Source EN PDF p.384; unit 4218 -->

【说明】

<!-- Source EN PDF p.384; unit 4219 -->

设置 CGC 模块属性

<!-- Source EN PDF p.384; unit 4220 -->

【语法】

<!-- Source EN PDF p.384; unit 4221 -->

```text
 XCamReturn rk_aiq_user_api2_acgc_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapi_acgc_attrib_t attr);
```

<!-- Source EN PDF p.384; unit 4222 -->

【参数】

<!-- Source EN PDF p.384; unit 4223 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | CGC 模块属性 | 输入 |

<!-- Source EN PDF p.384; unit 4224 -->

【返回值】

<!-- Source EN PDF p.384; unit 4225 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.384; unit 4226 -->

【依赖】

<!-- Source EN PDF p.384; unit 4227 -->

头文件：rk_aiq_user_api2_acgc.h

<!-- Source EN PDF p.384; unit 4228 -->

库文件：librkaiq.so

<!-- Source EN PDF p.384; unit 4229 -->

【注意事项】

<!-- Source EN PDF p.384; unit 4230 -->

attr.param.op_mode = RK_AIQ_OP_MODE_AUTO 时使用 AIQ 内置的 CGC 默认参数；attr.param.op_mode = RK_AIQ_OP_MODE_MANUAL 时可配置 CGC 参数。

<!-- Source EN PDF p.385; unit 4231 -->

9.19.3.2  rk_aiq_user_api2_acgc_GetAttrib

<!-- Source EN PDF p.385; unit 4232 -->

【说明】

<!-- Source EN PDF p.385; unit 4233 -->

获取 CGC 模块当前属性

<!-- Source EN PDF p.385; unit 4234 -->

【语法】

<!-- Source EN PDF p.385; unit 4235 -->

```text
 XCamReturn rk_aiq_user_api2_acgc_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapi_acgc_attrib_t* attr);
```

<!-- Source EN PDF p.385; unit 4236 -->

【参数】

<!-- Source EN PDF p.385; unit 4237 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | CGC 模块属性 | 输出 |

<!-- Source EN PDF p.385; unit 4238 -->

【返回值】

<!-- Source EN PDF p.385; unit 4239 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.385; unit 4240 -->

【依赖】

<!-- Source EN PDF p.385; unit 4241 -->

头文件：rk_aiq_user_api2_acgc.h

<!-- Source EN PDF p.385; unit 4242 -->

库文件：librkaiq.so

<!-- Source EN PDF p.385; unit 4243 -->

#### 9.19.4 模块级 API 数据类型

<!-- Source EN PDF p.385; unit 4244 -->

9.19.4.1  rk_aiq_uapi_acgc_attrib_t

<!-- Source EN PDF p.385; unit 4245 -->

【说明】定义 CGC 模块 API 参数

<!-- Source EN PDF p.385; unit 4246 -->

【定义】

<!-- Source EN PDF p.385; unit 4247 -->

```text
 typedef struct rk_aiq_uapi_acgc_attrib_s {
     rk_aiq_uapi_sync_t sync;
     rk_aiq_acgc_params_t param;
 } rk_aiq_uapi_acgc_attrib_t;
```

<!-- Source EN PDF p.385; unit 4248 -->

【成员】

<!-- Source EN PDF p.386; unit 4249 -->

| 成员名称 | 说明 |
|---|---|
| sync | rk_aiq_uapi_sync_t 的定义参见“概述/API 说明”。 |
| rk_aiq_acgc_params_t | cgc 参数 |

<!-- Source EN PDF p.386; unit 4250 -->

9.19.4.2  rk_aiq_acgc_params_t

<!-- Source EN PDF p.386; unit 4251 -->

【说明】定义 CGC 模块参数

<!-- Source EN PDF p.386; unit 4252 -->

【定义】

<!-- Source EN PDF p.386; unit 4253 -->

```text
 typedef struct __cgc_param {
     RKAiqOPMode_t op_mode;
     bool cgc_ratio_en;
     bool cgc_yuv_limit;
 } Cgc_Param_t;
 typedef Cgc_Param_t rk_aiq_acgc_params_t;
```

<!-- Source EN PDF p.386; unit 4254 -->

【成员】

<!-- Source EN PDF p.386; unit 4255 -->

| 成员名称 | 说明 |
|---|---|
| op_mode | 模式：RK_AIQ_OP_MODE_AUTO（使用 AIQ 内置参数）或 RK_AIQ_OP_MODE_MANUAL（使用用户可配置参数） |
| cgc_ratio_en | 是否启用色域压缩模式，默认值：FALSE |
| cgc_yuv_limit | 是否输出有限范围；cgc_yuv_limit = FALSE 时旁路 CGC，默认值：FALSE |

<!-- Source EN PDF p.386; unit 4256 -->

## 10.   Statistics

<!-- Source EN PDF p.386; unit 4257 -->

### 10.1 概述

<!-- Source EN PDF p.386; unit 4258 -->

ISP30 支持通过图像数据处理获得 AWB/AE/AF 3A 控制算法所需的相关统计信息，大致如下：

<!-- Source EN PDF p.387; unit 4259 -->

![英文原稿技术图 — PDF p.387](/docs/rockchip-isp30-development/assets/en-p387-X2034.jpg)

<!-- Source EN PDF p.387; unit 4260 -->

### 10.2 功能说明

<!-- Source EN PDF p.387; unit 4261 -->

#### 10.2.1 AE 统计

<!-- Source EN PDF p.387; unit 4262 -->

AE 硬件统计主要包括以下部分：

<!-- Source EN PDF p.387; unit 4263 -->

基于 RAW 域的 256 段加权直方图统计，以及分块 R/G/B/Y 均值统计；

<!-- Source EN PDF p.387; unit 4264 -->

10.2.1.1 基于 RAW 图像的 AE 统计

<!-- Source EN PDF p.387; unit 4265 -->

模块统计分为分块亮度统计和直方图统计。根据支持的块大小及是否具备独立子窗口统计，统计模式分为 big 和 lite。

<!-- Source EN PDF p.387; unit 4266 -->

big 模式：非独立子窗口分块最大支持 15X15，最小支持 1X1，每块输出 10bit R/B 通道亮度均值和 12bit G 通道均值，默认 15X15 分块；同时可设置 4 个独立子窗口，每个独立子窗口输出 29-bit R/B 通道亮度和及 32-bit G 通道和，软件需除以各独立子窗口的像素数才能得到亮度均值。此模式的加权直方图统计基于分块数量和相应权重，各亮度段有效像素计数为 28bit。

<!-- Source EN PDF p.387; unit 4267 -->

lite 模式：非独立子窗口分块最大支持 5X5，最小支持 1X1，每块输出 10bit R/B 通道亮度均值和 12bit G 通道均值，默认 5X5 分块；不支持设置独立子窗口。此模式的加权直方图统计基于分块数量和相应权重，各亮度段有效像素计数为 28bit。

<!-- Source EN PDF p.388; unit 4268 -->

3588 平台默认非 HDR 曝光模式使用 BIG（15X15 非独立子窗口）；HDR 2 帧模式使用 BIG（15X15 非独立子窗口）；HDR 3 帧模式的短帧和长帧使用 BIG（15X15 非独立子窗口），中帧使用 LITE（5X5 非独立子窗口）。

<!-- Source EN PDF p.388; unit 4269 -->

#### 10.2.2 AWB 统计

<!-- Source EN PDF p.388; unit 4270 -->

AWB 硬件统计的数据来源：

<!-- Source EN PDF p.388; unit 4271 -->

HDR 多帧模式下，支持从 L/M/S 三个通道中选择一个。

<!-- Source EN PDF p.388; unit 4272 -->

线性模式下只有一个数据通道。

<!-- Source EN PDF p.388; unit 4273 -->

对 Raw-BLC-LSC 之后的数据进行统计。

<!-- Source EN PDF p.388; unit 4274 -->

AWB 硬件统计包括白点统计和分块统计。

<!-- Source EN PDF p.388; unit 4275 -->

白点统计

<!-- Source EN PDF p.388; unit 4276 -->

记录主窗口内 7 种光源、2 种大小白区的 RGins 和 BGains 累加值及数量。

<!-- Source EN PDF p.388; unit 4277 -->

记录子窗口内 4 种光源、2 种大小白区的 RGins 和 BGains 累加值及数量。

<!-- Source EN PDF p.388; unit 4278 -->

累加 4 个 UV 或 XY 域附加框中的 RGin、BGain，并累加 RGins 数量（数量描述按原文保留）。

<!-- Source EN PDF p.388; unit 4279 -->

分块统计：图像划分为 15x15 块，各块统计全部点或白点的 R、G、B 均值。

<!-- Source EN PDF p.388; unit 4280 -->

#### 10.2.3 AF 统计

<!-- Source EN PDF p.388; unit 4281 -->

AFHW Stats 硬件统计：

<!-- Source EN PDF p.388; unit 4282 -->

HDR 多帧模式下，支持从 L/M/S 三个通道中选择一个，也支持以三通道合成后的数据作为输入。

<!-- Source EN PDF p.388; unit 4283 -->

线性模式下只有一个数据通道。

<!-- Source EN PDF p.388; unit 4284 -->

支持水平方向 2 个可配置频带的 FV 输出，以及垂直方向 2 个可配置频带的 FV 输出。

<!-- Source EN PDF p.388; unit 4285 -->

ISP30 AF 硬件统计模块框图

<!-- Source EN PDF p.388; unit 4286 -->

![英文原稿技术图 — PDF p.388](/docs/rockchip-isp30-development/assets/en-p388-X2040.jpg)

<!-- Source EN PDF p.389; unit 4287 -->

### 10.3 API 参考

<!-- Source EN PDF p.389; unit 4288 -->

#### 10.3.1  rk_aiq_uapi_sysctl_get3AStatsBlk

<!-- Source EN PDF p.389; unit 4289 -->

【说明】

<!-- Source EN PDF p.389; unit 4290 -->

同步获取 3A 统计信息。

<!-- Source EN PDF p.389; unit 4291 -->

【语法】

<!-- Source EN PDF p.389; unit 4292 -->

```text
 XCamReturn
 rk_aiq_uapi_sysctl_get3AStatsBlk(const rk_aiq_sys_ctx_t* ctx, rk_aiq_isp_stats_t
 **stats, int timeout_ms);
```

<!-- Source EN PDF p.389; unit 4293 -->

【参数】

<!-- Source EN PDF p.389; unit 4294 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| stats | 统计结构体指针 | 输出 |
| timeout_ms | 超时时间，-1 表示无限等待直到有统计信息 | 输入 |

<!-- Source EN PDF p.389; unit 4295 -->

【返回值】

<!-- Source EN PDF p.389; unit 4296 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.389; unit 4297 -->

【依赖】

<!-- Source EN PDF p.389; unit 4298 -->

头文件：rk_aiq_user_api_sysctl.h

<!-- Source EN PDF p.389; unit 4299 -->

库文件：librkaiq.so

<!-- Source EN PDF p.389; unit 4300 -->

#### 10.3.2  rk_aiq_uapi_sysctl_release3AStatsRef

<!-- Source EN PDF p.389; unit 4301 -->

【说明】

<!-- Source EN PDF p.389; unit 4302 -->

释放已获取的 3A 统计信息，与 rk_aiq_uapi_sysctl_get3AStatsBlk 配套使用。

<!-- Source EN PDF p.389; unit 4303 -->

【语法】

<!-- Source EN PDF p.389; unit 4304 -->

```text
 void
 rk_aiq_uapi_sysctl_release3AStatsRef(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_isp_stats_t *stats);
```

<!-- Source EN PDF p.390; unit 4305 -->

【参数】

<!-- Source EN PDF p.390; unit 4306 -->

| 参数名称 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| stats | 统计结构体指针 | 输入 |

<!-- Source EN PDF p.390; unit 4307 -->

【返回值】

<!-- Source EN PDF p.390; unit 4308 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.390; unit 4309 -->

【依赖】

<!-- Source EN PDF p.390; unit 4310 -->

头文件：rk_aiq_user_api_sysctl.h

<!-- Source EN PDF p.390; unit 4311 -->

库文件：librkaiq.so

<!-- Source EN PDF p.390; unit 4312 -->

参考代码

<!-- Source EN PDF p.390; unit 4313 -->

SDK 路径：external/camera_engine_rkaiq/rkisp_demo/demo/af_algo_demo

<!-- Source EN PDF p.390; unit 4314 -->

### 10.4 数据类型

<!-- Source EN PDF p.390; unit 4315 -->

#### 10.4.1  rk_aiq_isp_stats_t

<!-- Source EN PDF p.390; unit 4316 -->

【说明】AIQ 3A 统计

<!-- Source EN PDF p.390; unit 4317 -->

【定义】

<!-- Source EN PDF p.390; unit 4318 -->

```text
 typedef struct {
     rk_aiq_isp_aec_stats_t aec_stats;
     rk_aiq_isp_awb_stats2_v3x_t awb_stats_v3x;
     rk_aiq_isp_af_stats_t  af_stats;
 } rk_aiq_isp_stats_t;
```

<!-- Source EN PDF p.390; unit 4319 -->

【成员】

<!-- Source EN PDF p.390; unit 4320 -->

| 成员名称 | 说明 |
|---|---|
| aec_stats | AE 统计 |
| rk_aiq_isp_awb_stats2_v3x_t | AWB 统计 |
| af_stats | AF 统计 |

<!-- Source EN PDF p.391; unit 4321 -->

#### 10.4.2  RKAiqAecStats_t

<!-- Source EN PDF p.391; unit 4322 -->

【说明】定义 AE 数据信息，详见 AE 章节功能说明。

<!-- Source EN PDF p.391; unit 4323 -->

【定义】

<!-- Source EN PDF p.391; unit 4324 -->

```text
 typedef struct RKAiqAecStats_s {
     RkAiqAecHwStatsRes_t ae_data;
     RKAiqAecExpInfo_t ae_exp;
 } RKAiqAecStats_t;
```

<!-- Source EN PDF p.391; unit 4325 -->

【成员】

<!-- Source EN PDF p.391; unit 4326 -->

| 成员名称 | 说明 |
|---|---|
| ae_data | AE 模块硬件统计 |
| ae_exp | AE 模块 Sensor 曝光信息 |

<!-- Source EN PDF p.391; unit 4327 -->

10.4.2.1  RKAiqAecExpInfo_t

<!-- Source EN PDF p.391; unit 4328 -->

【说明】AE 模块曝光参数信息

<!-- Source EN PDF p.391; unit 4329 -->

【定义】

<!-- Source EN PDF p.391; unit 4330 -->

```text
 typedef struct RKAiqAecExpInfo_s {
     RkAiqExpParamComb_t LinearExp;
     RkAiqExpParamComb_t HdrExp[3];
     RkAiqIrisParamComb_t Iris;
     uint16_t line_length_pixels;
     uint32_t frame_length_lines;
     float pixel_clock_freq_mhz;
     CISFeature_t CISFeature;
     RKAiqExpI2cParam_t exp_i2c_params;
 } RKAiqAecExpInfo_t;
```

<!-- Source EN PDF p.391; unit 4331 -->

【成员】

<!-- Source EN PDF p.392; unit 4332 -->

| 成员名称 | 说明 |
|---|---|
| LinearExp | 非 HDR 模式曝光参数信息，包括实际曝光值和 RK 格式寄存器值 |
| HdrExp | HDR 模式曝光参数信息，包括实际曝光值和 RK 格式寄存器值，最多支持 3 帧曝光 |
| exp_i2c_params | 曝光参数的 Sensor 寄存器值，供第三方 AE 方案使用 |
| line_length_pixels | hts，其值由 Sensor 配置序列决定 |
| frame_length_lines | vts，其值由 Sensor 配置序列决定 |
| pixel_clock_freq_mhz | pclk，单位 MHz，其值由 Sensor 配置序列决定 |

<!-- Source EN PDF p.392; unit 4333 -->

【注意事项】

<!-- Source EN PDF p.392; unit 4334 -->

HdrExp 表示 HDR 模式曝光参数信息，最多支持 3TO1。HDR 2TO1：下标 0 为短帧曝光参数，下标 1 为长帧，下标 2 无效；HDR 3TO1：下标 0 为短帧，下标 1 为中帧，下标 2 为长帧。

<!-- Source EN PDF p.392; unit 4335 -->

10.4.2.1.1 RkAiqExpParamComb_t

<!-- Source EN PDF p.392; unit 4336 -->

【说明】AE 模块曝光参数详细信息

<!-- Source EN PDF p.392; unit 4337 -->

【成员】

<!-- Source EN PDF p.392; unit 4338 -->

```text
 typedef struct {
     RkAiqExpRealParam_t exp_real_params; real value
     RkAiqExpSensorParam_t exp_sensor_params;//RK reg value
 } RkAiqExpParamComb_t;
```

<!-- Source EN PDF p.392; unit 4339 -->

| 成员名称 | 说明 |
|---|---|
| exp_real_params | 曝光分量的实际物理值 |
| exp_sensor_params | 曝光分量的 Sensor 寄存器值，遵循 RK 曝光设置 |

<!-- Source EN PDF p.392; unit 4340 -->

```text
 typedef struct RkAiqExpRealParam_s {
     float integration_time;
     float analog_gain;
     float digital_gain;
     float isp_dgain;
     int   iso;
     int   dcg_mode;
 } RkAiqExpRealParam_t;
```

<!-- Source EN PDF p.393; unit 4341 -->

| 成员名称 | 说明 |
|---|---|
| integration_time | 曝光积分时间，单位秒（s） |
| analog_gain | Sensor 模拟增益/总增益，单位为倍数 |
| digital_gain | Sensor 数字增益，单位为倍数；当 Sensor 数字增益用于补偿模拟增益精度时，配置为 1x，并将整体增益值写入 analog_gain |
| isp_dgain | ISP 数字增益，单位为倍数，目前无效，默认值 1x |
| iso | 总增益值，ISO 表示系统增益，以常量 50 为倍率，ISO = Total gain * 50 |
| dcg_mode | 双转换增益 |

<!-- Source EN PDF p.393; unit 4342 -->

```text
 typedef struct RkAiqExpSensorParam_s {
     unsigned short fine_integration_time;
     unsigned short coarse_integration_time;
     unsigned short analog_gain_code_global;
     unsigned short digital_gain_global;
     unsigned short isp_digital_gain;
 } RkAiqExpSensorParam_t;
```

<!-- Source EN PDF p.393; unit 4343 -->

| 成员名称 | 说明 |
|---|---|
| fine_integration_time | Sensor 曝光积分时间的小数行寄存器值，仅在 Sensor 支持小数行时需要 |
| coarse_integration_time | Sensor 曝光积分时间对应的寄存器值，单位为行数 |
| analog_gain_code_global | Sensor 模拟增益对应的寄存器值 |
| digital_gain_global | Sensor 数字增益对应的寄存器值 |
| isp_digital_gain | ISP 数字增益寄存器值，暂时无效 |

<!-- Source EN PDF p.393; unit 4344 -->

【注意事项】

<!-- Source EN PDF p.393; unit 4345 -->

不同 Sensor 的数字增益作用不同，有的用于扩大感光度范围，有的用于补偿模拟增益精度。因此此处暂不单独列出数字增益，其大小和对应寄存器值均合并到模拟增益中。

<!-- Source EN PDF p.393; unit 4346 -->

双转换增益模式有三种状态：-1 表示 Sensor 不支持 DCG，0 表示 LCG，1 表示 HCG。

<!-- Source EN PDF p.393; unit 4347 -->

10.4.2.1.2 RKAiqExpI2cParam_t

<!-- Source EN PDF p.393; unit 4348 -->

【说明】AE 模块 I2c 曝光参数（一般供第三方 AE 使用）

<!-- Source EN PDF p.393; unit 4349 -->

【定义】

<!-- Source EN PDF p.394; unit 4350 -->

```text
 #define MAX_I2CDATA_LEN 64
 typedef struct RKAiqExpI2cParam_s {
     bool           bValid;
     unsigned int   nNumRegs;
     unsigned int   RegAddr[MAX_I2CDATA_LEN];
     unsigned int   AddrByteNum[MAX_I2CDATA_LEN];
     unsigned int   RegValue[MAX_I2CDATA_LEN];
     unsigned int   ValueByteNum[MAX_I2CDATA_LEN];
     unsigned int   DelayFrames[MAX_I2CDATA_LEN];
 } RKAiqExpI2cParam_t;
```

<!-- Source EN PDF p.394; unit 4351 -->

【成员】

<!-- Source EN PDF p.394; unit 4352 -->

| 成员名称 | 说明 |
|---|---|
| bValid | I2c 参数有效使能位。true：用 RKAiqExpI2cParam_t 设置寄存器值（一般用于第三方 AE）；false：用 RK 格式寄存器参数设置值 |
| nNumRegs | 要设置的寄存器值数量 |
| AddrByteNum | 寄存器地址位长，最多 64 个元素 |
| RegValue | 寄存器值数组，最多 64 个元素 |
| ValueByteNum | 寄存器值位长，最多 64 个元素 |
| DelayFrames | 寄存器值延迟帧数数组，最多 64 个元素 |

<!-- Source EN PDF p.394; unit 4353 -->

【注意事项】

<!-- Source EN PDF p.394; unit 4354 -->

仅当第三方 AE 应用为 true 且 bValid 为 true 时，该寄存器参数才有效；否则默认使用 RkAiqExpParamComb_t 中的 RK 格式寄存器参数。

<!-- Source EN PDF p.394; unit 4355 -->

最多可设置 64 个寄存器值。

<!-- Source EN PDF p.394; unit 4356 -->

10.4.2.1.3 RkAiqIrisParamComb_t

<!-- Source EN PDF p.394; unit 4357 -->

【说明】AE 模块光圈参数

<!-- Source EN PDF p.394; unit 4358 -->

【定义】

<!-- Source EN PDF p.394; unit 4359 -->

```text
 typedef struct {
     RkAiqPIrisParam_t   PIris;
     RkAiqDCIrisParam_t  DCIris;
 } RkAiqIrisParamComb_t;
 typedef struct {
     int            step;
     int            gain;
     bool           update;
 } RkAiqPIrisParam_t;
 typedef struct {
     int        pwmDuty; //percent value,range = 0-100
     bool       update;
 } RkAiqDCIrisParam_t;
```

<!-- Source EN PDF p.395; unit 4360 -->

【成员】

<!-- Source EN PDF p.395; unit 4361 -->

| 成员名称 | 子成员 | 说明 |
|---|---|---|
| PIris | 更新步进增益 | P 光圈参数：P 光圈步进寄存器值、步进等效增益值、步进更新标志 |
| DCIris | 更新 pwmDuty | DC 光圈参数：PWM 占空比值，范围 1~100；DC 光圈参数更新标志 |

<!-- Source EN PDF p.395; unit 4362 -->

10.4.2.2  RkAiqAecHwStatsRes_t

<!-- Source EN PDF p.395; unit 4363 -->

【说明】AE 模块硬件统计

<!-- Source EN PDF p.395; unit 4364 -->

【定义】

<!-- Source EN PDF p.395; unit 4365 -->

```text
 typedef struct RkAiqAecHwStatsRes_s {
     Aec_Stat_Res_t chn[3];
     Aec_Stat_Res_t extra;
     struct yuvae_stat yuvae;
     struct sihist_stat sihist;
 } RkAiqAecHwStatsRes_t;
```

<!-- Source EN PDF p.395; unit 4366 -->

【成员】

<!-- Source EN PDF p.395; unit 4367 -->

| 成员名称 | 说明 |
|---|---|
| chn[3] | AE 模块基于 RAW 图像（BLC、AWB 之后）的统计，兼容 HDR 和非 HDR，最多支持 HDR 3TO1 的 S/M/L 统计 |
| extra | AE 模块基于 RAW 图像（Debayer 之前）的统计，在 HDR 模式表示合成帧的统计 |
| yuvae | AE 模块基于 gamma 之前 RGB 图像的分块信息【3588 平台不支持】。 |
| sihist | AE 模块基于 gamma 之前 RGB 图像的直方图信息【3588 平台不支持】 |

<!-- Source EN PDF p.395; unit 4368 -->

【注意事项】

<!-- Source EN PDF p.395; unit 4369 -->

Aec_Stat_Res_t chn[3]：表示 HDR Merge 模块之前三路 RAW 数据路径的统计。非 HDR 时下标 0 有效，其他无效；HDR 2TO1 时下标 0 为短帧路径统计，1 为长帧，2 无效；HDR 3TO1 时下标 0 为短帧路径统计，1 为中帧，2 为长帧路径

<!-- Source EN PDF p.396; unit 4370 -->

的统计。RAW 图像统计模块之前有 BLC、AWB 模块，因此其统计受 BLC、AWB 增益影响。Aec_Stat_Res_t extra：HDR 模式下表示 HDR 合成后的 RAW 图像统计；其前有 BLC、AWB、HDRMERGE、TMO 等模块，因此统计受这些模块增益影响。此外，开启 AF 模块时这部分统计无效。

<!-- Source EN PDF p.396; unit 4371 -->

3588 平台不支持基于 gamma 之前 RGB 图像的分块和直方图信息。

<!-- Source EN PDF p.396; unit 4372 -->

10.4.2.2.1 Aec_Stat_Res_t

<!-- Source EN PDF p.396; unit 4373 -->

【说明】AE 模块基于 RAW 图像的统计

<!-- Source EN PDF p.396; unit 4374 -->

【定义】

<!-- Source EN PDF p.396; unit 4375 -->

```text
 typedef struct Aec_Stat_Res_s {
     //rawae
     struct rawaebig_stat rawae_big;
     struct rawaelite_stat rawae_lite;
     //rawhist
     struct rawhist_stat rawhist_big;
     struct rawhist_stat rawhist_lite;
 } Aec_Stat_Res_t;
```

<!-- Source EN PDF p.396; unit 4376 -->

【成员】

<!-- Source EN PDF p.396; unit 4377 -->

| 成员名称 | 说明 |
|---|---|
| rawae_big | 基于 RAW 图像的 BIG 模式分块统计 |
| rawae_lite | 基于 RAW 图像的 Lite 模式分块统计 |
| rawhist_big | 基于 RAW 图像的 BIG 模式直方图统计 |
| rawhist_lite | 基于 RAW 图像的 Lite 模式直方图统计 |

<!-- Source EN PDF p.396; unit 4378 -->

【注意事项】

<!-- Source EN PDF p.396; unit 4379 -->

RAW 图像统计的 BIG 和 LITE 区别详见功能说明。主要区别是亮度均值统计的分块数量，以及是否支持独立子窗口亮度均值统计。基于 RAW 的 BIG 和 LITE 直方图统计具有相同数据结构。

<!-- Source EN PDF p.396; unit 4380 -->

3588 平台默认非 HDR 配置 BIG（15X15 非独立子窗口）；HDR 2 帧时每帧均为 BIG（15X15 非独立子窗口）；HDR 3 帧时短帧、长帧为 BIG（15X15 非独立子窗口），中帧为 LITE（5X5 非独立子窗口）。

<!-- Source EN PDF p.397; unit 4381 -->

10.4.2.2.2 rawaebig_stat

<!-- Source EN PDF p.397; unit 4382 -->

【说明】基于 RAW 图像的 big 模式统计包括 15X15 个非独立子窗口的 R/G/B 亮度均值，以及 4 个独立子窗口的 R/G/B 亮度和

<!-- Source EN PDF p.397; unit 4383 -->

【定义】

<!-- Source EN PDF p.397; unit 4384 -->

```text
 struct rawaebig_stat {
     unsigned short channelr_xy[RAWAEBIG_WIN_NUM];
     unsigned short channelg_xy[RAWAEBIG_WIN_NUM];
     unsigned short channelb_xy[RAWAEBIG_WIN_NUM];
     unsigned int   channely_xy[RAWAEBIG_WIN_NUM]; //not HW!
     unsigned long int wndx_sumr[RAWAEBIG_SUBWIN_NUM];
     unsigned long int wndx_sumg[RAWAEBIG_SUBWIN_NUM];
     unsigned long int wndx_sumb[RAWAEBIG_SUBWIN_NUM];
     unsigned short wndx_channelr[RAWAEBIG_SUBWIN_NUM]; //not HW!
     unsigned short wndx_channelg[RAWAEBIG_SUBWIN_NUM]; //not HW!
     unsigned short wndx_channelb[RAWAEBIG_SUBWIN_NUM]; //not HW!
     unsigned char wndx_channely[RAWAEBIG_SUBWIN_NUM]; //not HW!
 };
 #define RAWAEBIG_WIN_NUM    225
 #define RAWAEBIG_SUBWIN_NUM  4
```

<!-- Source EN PDF p.397; unit 4385 -->

【成员】

<!-- Source EN PDF p.397; unit 4386 -->

| 成员名称 | 说明 |
|---|---|
| channelr_xy | BIG 模式非独立子窗口分块 R 通道亮度均值，有效位数 10bit。 |
| channelg_xy | BIG 模式非独立子窗口分块 G 通道亮度均值，有效位数 12bit。 |
| channelb_xy | BIG 模式非独立子窗口分块 B 通道亮度均值，有效位数 10bit。 |
| wndx_sumr | BIG 模式独立子窗口 R 通道亮度和，有效位数 29bit。 |
| wndx_sumg | BIG 模式独立子窗口 G 通道亮度和，有效位数 32bit。 |
| wndx_sumb | BIG 模式独立子窗口 B 通道亮度和，有效位数 29bit。 |

<!-- Source EN PDF p.397; unit 4387 -->

【注意事项】

<!-- Source EN PDF p.397; unit 4388 -->

基于 RAW 的 BIG 模式统计仅包含 R/G/B 三通道；如需 Y 通道统计，可在软件中增加代码，根据 R/G/B 统计值计算。

<!-- Source EN PDF p.397; unit 4389 -->

基于 RAW 的 BIG 模式包含 15X15 个非独立子窗口；非独立子窗口有最小尺寸限制，至少 16X4。

<!-- Source EN PDF p.398; unit 4390 -->

基于 RAW 的 BIG 模式包含 4 个独立子窗口，位置可重叠或不重叠；最大尺寸不得超过 2k x 1k。

<!-- Source EN PDF p.398; unit 4391 -->

结构体中的 channely_xy、wndx_channelr、wndx_channelg、wndx_channelb、wndx_channely 均为软件计算参数，需要在软件中增加代码，根据硬件统计值计算。

<!-- Source EN PDF p.398; unit 4392 -->

10.4.2.2.3 rawaelite_stat

<!-- Source EN PDF p.398; unit 4393 -->

【说明】基于 RAW 图像的 lite 模式统计包括 5X5 个非独立子窗口分块的 R/G/B 亮度均值

<!-- Source EN PDF p.398; unit 4394 -->

【定义】

<!-- Source EN PDF p.398; unit 4395 -->

```text
 struct rawaelite_stat {
     unsigned short channelr_xy[RAWAELITE_WIN_NUM];
     unsigned short channelg_xy[RAWAELITE_WIN_NUM];
     unsigned short channelb_xy[RAWAELITE_WIN_NUM];
     unsigned int   channely_xy[RAWAELITE_WIN_NUM]; not HW!
 };
 #define RAWAELITE_WIN_NUM  25
```

<!-- Source EN PDF p.398; unit 4396 -->

【成员】

<!-- Source EN PDF p.398; unit 4397 -->

| 成员名称 | 说明 |
|---|---|
| channelr_xy | Lite 模式非独立子窗口分块 R 通道亮度均值，有效位数 10bit。 |
| channelg_xy | Lite 模式非独立子窗口分块 G 通道亮度均值，有效位数 12bit。 |
| channelb_xy | Lite 模式非独立子窗口分块 B 通道亮度均值，有效位数 10bit。 |

<!-- Source EN PDF p.398; unit 4398 -->

【注意事项】

<!-- Source EN PDF p.398; unit 4399 -->

基于 RAW 的 lite 模式仅含 5X5 非独立子窗口 R/G/B 三通道统计；如需 Y，可增加代码根据 R/G/B 统计值计算。非独立子窗口最小尺寸为 16X4。

<!-- Source EN PDF p.398; unit 4400 -->

结构体中的 channely_xy 是软件计算参数，需要增加代码根据硬件统计值计算。

<!-- Source EN PDF p.398; unit 4401 -->

10.4.2.2.4 rawhist_stat

<!-- Source EN PDF p.398; unit 4402 -->

【说明】基于 RAW 图像的直方图统计

<!-- Source EN PDF p.398; unit 4403 -->

【定义】

<!-- Source EN PDF p.399; unit 4404 -->

```text
 struct rawhist_stat {
     unsigned int bins[RAWHIST_BIN_N_MAX];
 };
 #define RAWHIST_BIN_N_MAX  256
```

<!-- Source EN PDF p.399; unit 4405 -->

【成员】

<!-- Source EN PDF p.399; unit 4406 -->

| 成员名称 | 说明 |
|---|---|
| bins | 直方图共分 256 段，每段有效位数为 28bit |

<!-- Source EN PDF p.399; unit 4407 -->

#### 10.4.3  rk_aiq_isp_awb_stats2_v3x_t

<!-- Source EN PDF p.399; unit 4408 -->

【说明】定义白平衡硬件统计，主要包括白点统计和分块统计

<!-- Source EN PDF p.399; unit 4409 -->

白点统计

<!-- Source EN PDF p.399; unit 4410 -->

记录主窗口内 7 种光源、2 种大小白区的 RGins 和 BGain 累加值及数量；

<!-- Source EN PDF p.399; unit 4411 -->

记录子窗口内 4 种光源、2 种大小白区的 RGin 和 BGain 累加值及数量；

<!-- Source EN PDF p.399; unit 4412 -->

4 个 UV 或 XY 域附加框内的 RGin、BGain 累加值及数量；

<!-- Source EN PDF p.399; unit 4413 -->

白点亮度直方图；

<!-- Source EN PDF p.399; unit 4414 -->

分块统计：图像划分为 15x15 块（见 AWB 分块示意图），每块统计全部点或白点的 R、G、B 均值。

<!-- Source EN PDF p.399; unit 4415 -->

![英文原稿技术图 — PDF p.399](/docs/rockchip-isp30-development/assets/en-p399-X2080.png)

<!-- Source EN PDF p.399; unit 4416 -->

图：AWB 分块示意图

<!-- Source EN PDF p.399; unit 4417 -->

【定义】

<!-- Source EN PDF p.400; unit 4418 -->

```text
 typedef struct rk_aiq_isp_awb_stats2_v3x_s {
     //method1
     rk_aiq_awb_stat_wp_res_light_v201_t light[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM];
     int WpNo2[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM];
     //method2
     rk_aiq_awb_stat_blk_res_v201_t   blockResult[RK_AIQ_AWB_GRID_NUM_TOTAL];
     //window in pixel domain
     rk_aiq_awb_stat_wp_res_light_v201_t
 multiwindowLightResult[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM];
     //window in xy or uv domain
     rk_aiq_awb_stat_wp_res_v201_t
 excWpRangeResult[RK_AIQ_AWB_STAT_WP_RANGE_NUM_V201];
     //wpno histogram
     unsigned int WpNoHist[RK_AIQ_AWB_WP_HIST_BIN_NUM];
 } rk_aiq_isp_awb_stats2_v3x_t;
```

<!-- Source EN PDF p.400; unit 4419 -->

【成员】

<!-- Source EN PDF p.400; unit 4420 -->

| 成员名称 | 说明 |
|---|---|
| light | 主窗口中不同光源的白点统计结果，最多 RK_AIQ_AWB_MAX_WHITEREGIONS_NUM 种光源； |
| WpNo2 | 主窗口内不同光源的 XY 域与 UV 域交集中的白点数，无小数位。 |
| blockResult | 图像均匀分块后各块的 RGB 累加图，共 15x15（RK_AIQ_AWB_GRID_NUM_TOTAL）块，见 AWB 分块示意图 |
| multiwindowLightResult | 若干子窗口在不同光源下的白点统计（只记录前 4 种光源，全部光源可通过时分复用记录），最多 4 个子窗口 |
| excWpRangeResult | 落入 excludeWpRange 区域的点统计（只记录 excludeWpRange 前四个区域），最多 4 个区域 |
| WpNoHist | 白点直方图：各 bin 的白点数量，无小数位。统计 XY 大框还是 XY 内框的白点，由寄存器 xyRangeTypeForWpHist 决定。 |

<!-- Source EN PDF p.400; unit 4421 -->

【注意事项】

<!-- Source EN PDF p.400; unit 4422 -->

如需主窗口全局白点统计结果，可由所有光源下的白点统计结果方便地换算得到。

<!-- Source EN PDF p.401; unit 4423 -->

#### 10.4.4  rk_aiq_awb_stat_wp_res_light_v201_t

<!-- Source EN PDF p.401; unit 4424 -->

【说明】定义某光源下的白点统计结果。

<!-- Source EN PDF p.401; unit 4425 -->

【定义】

<!-- Source EN PDF p.401; unit 4426 -->

```text
 typedef struct rk_aiq_awb_stat_wp_res_light_v201_s {
     rk_aiq_awb_stat_wp_res_v201_t xYType[RK_AIQ_AWB_XY_TYPE_MAX_V201];
 } rk_aiq_awb_stat_wp_res_light_v201_t;
```

<!-- Source EN PDF p.401; unit 4427 -->

【成员】

<!-- Source EN PDF p.401; unit 4428 -->

| 成员名称 | 说明 |
|---|---|
| XYType | 某光源下不同大小 XY 框的白点统计，最多 RK_AIQ_AWB_XY_TYPE_MAX_V201 个，即 2 个框。 |

<!-- Source EN PDF p.401; unit 4429 -->

#### 10.4.5  rk_aiq_awb_stat_wp_res_v201_t

<!-- Source EN PDF p.401; unit 4430 -->

【说明】定义某光源指定尺寸 XY 框下的白点统计，以及非白点区域的非白点统计。

<!-- Source EN PDF p.401; unit 4431 -->

【定义】

<!-- Source EN PDF p.401; unit 4432 -->

```text
 typedef struct rk_aiq_awb_stat_wp_res_v201_s {
     long long WpNo;
     long long RgainValue;
     long long BgainValue;
 } rk_aiq_awb_stat_wp_res_v201_t;
```

<!-- Source EN PDF p.401; unit 4433 -->

【成员】

<!-- Source EN PDF p.401; unit 4434 -->

| 成员名称 | 说明 |
|---|---|
| WpNo | 白点数：22 位整数、10 位小数（原文 10ibit）。WpNo = ISP 硬件白点统计 / 2^10。 |
| RgainValue | 白点 R 通道累加和：22 位整数、10 位小数。 |
| BgainValue | 白点 G 通道累加和：22 位整数、10 位小数。 |

<!-- Source EN PDF p.402; unit 4435 -->

#### 10.4.6  rk_aiq_awb_stat_blk_res_v201_t

<!-- Source EN PDF p.402; unit 4436 -->

【说明】定义每个 block 的统计结果。

<!-- Source EN PDF p.402; unit 4437 -->

blkMeasureMode = =RK_AIQ_AWB_BLK_STAT_MODE_ALL_V201 时，记录 block 内所有点的累加和；原文双等号间空格保留于英文。

<!-- Source EN PDF p.402; unit 4438 -->

blkMeasureMode = =RK_AIQ_AWB_BLK_STAT_MODE_REALWP_V201 时，记录 block 内所有白点的累加和。

<!-- Source EN PDF p.402; unit 4439 -->

blkMeasureMode 是控制 block 统计内容的寄存器。

<!-- Source EN PDF p.402; unit 4440 -->

【定义】

<!-- Source EN PDF p.402; unit 4441 -->

```text
 typedef struct rk_aiq_awb_stat_blk_res_v201_s {
     long long WpNo;
     long long Rvalue;
     long long Gvalue;
     long long Bvalue;
 } rk_aiq_awb_stat_blk_res_v201_t;
```

<!-- Source EN PDF p.402; unit 4442 -->

【成员】

<!-- Source EN PDF p.402; unit 4443 -->

| 成员名称 | 说明 |
|---|---|
| WpNo | block 内点数 |
| Rvalue | block 内全部点 R 通道累加。 |
| Gvalue | block 内全部点 RG 通道累加（原文 RG 标注）。 |
| Bvalue | block 内全部点 RB 通道累加，原文结尾有 and。 |

<!-- Source EN PDF p.402; unit 4444 -->

#### 10.4.7  rk_aiq_af_algo_stat_v30_t

<!-- Source EN PDF p.402; unit 4445 -->

【说明】定义 AF 统计。

<!-- Source EN PDF p.402; unit 4446 -->

【定义】

<!-- Source EN PDF p.402; unit 4447 -->

```text
 typedef struct {
     unsigned int wndb_luma;
     unsigned int wndb_sharpness;
     unsigned int winb_highlit_cnt;
     unsigned int wnda_luma[RKAIQ_RAWAF_SUMDATA_NUM];
     unsigned int wnda_fv_v1[RKAIQ_RAWAF_SUMDATA_NUM];
     unsigned int wnda_fv_v2[RKAIQ_RAWAF_SUMDATA_NUM];
     unsigned int wnda_fv_h1[RKAIQ_RAWAF_SUMDATA_NUM];
     unsigned int wnda_fv_h2[RKAIQ_RAWAF_SUMDATA_NUM];
     unsigned int wina_highlit_cnt[RKAIQ_RAWAF_SUMDATA_NUM];
     unsigned int int_state;
     struct timeval focus_starttim;
     struct timeval focus_endtim;
     struct timeval zoom_starttim;
     struct timeval zoom_endtim;
     int64_t sof_tim;
     int focusCode;
     int zoomCode;
     bool focusCorrection;
     bool zoomCorrection;
     float angleZ;
 } rk_aiq_af_algo_stat_v30_t;
```

<!-- Source EN PDF p.403; unit 4448 -->

【成员】

<!-- Source EN PDF p.403; unit 4449 -->

| 成员名称 | 说明 |
|---|---|
| wndb_luma | 独立窗口亮度值。 |
| wndb_sharpness | 独立窗口清晰度值。 |
| winb_highlit_cnt | 独立窗口高光计数。 |
| wnda_luma | 主窗口 15*15 子窗亮度。 |
| wnda_fv_v1 | 主窗口 15*15 子窗 V1 清晰度。 |
| wnda_fv_v2 | 主窗口 15*15 子窗 V2 清晰度。 |
| wnda_fv_h1 | 主窗口 15*15 子窗 H1 清晰度。 |
| wnda_fv_h2 | 主窗口 15*15 子窗 H2 清晰度。 |
| wina_highlit_cnt | 主窗口 15*15 子窗高光计数。 |
| int_state | RK AF 算法内部使用，可忽略。 |
| focus_starttim | RK AF 算法内部使用，可忽略。 |
| focus_endtim | RK AF 算法内部使用，可忽略。 |
| zoom_starttim | RK AF 算法内部使用，可忽略。 |
| zoom_endtim | RK AF 算法内部使用，可忽略。 |
| sof_tim | 此数据帧的帧开始时间，单位 ns。 |
| focusCode | RK AF 算法内部使用，可忽略。 |
| zoomCode | RK AF 算法内部使用，可忽略。 |
| focusCorrection | RK AF 算法内部使用，可忽略。 |
| zoomCorrection | RK AF 算法内部使用，可忽略。 |
| angleZ | RK AF 算法内部使用，可忽略。 |

<!-- Source EN PDF p.404; unit 4450 -->

## 11. 调试与 FAQ

<!-- Source EN PDF p.404; unit 4451 -->

### 11.1 获取版本号

<!-- Source EN PDF p.404; unit 4452 -->

AIQ 提供版本发布日期、AIQ 版本、IQ parser 版本及 ISP 各算法模块版本。

<!-- Source EN PDF p.404; unit 4453 -->

11.1.0.1 获取简略版本信息

<!-- Source EN PDF p.404; unit 4454 -->

```text
 strings librkaiq.so | grep -w AIQ
 AIQ: v0.1.6
```

<!-- Source EN PDF p.404; unit 4455 -->

11.1.0.2 获取完整版本信息

<!-- Source EN PDF p.404; unit 4456 -->

1\. SDK 的 AIQ 库默认编译为 Release；需改为 Debug，重新编译并更新到设备。

<!-- Source EN PDF p.404; unit 4457 -->

```text
SDK/external/camera_engine_rkaiq/CMakeLists.txt:
```

<!-- Source EN PDF p.404; unit 4458 -->

```text
if(NOT CMAKE_BUILD_TYPE STREQUAL "Release")
add_definitions(-DBUILD_TYPE_DEBUG)
endif()
```

<!-- Source EN PDF p.404; unit 4459 -->

改为：

<!-- Source EN PDF p.404; unit 4460 -->

```text
#if(NOT CMAKE_BUILD_TYPE STREQUAL "Release")
add_definitions(-DBUILD_TYPE_DEBUG)
#endif()
```

<!-- Source EN PDF p.404; unit 4461 -->

2\. 默认日志级别不打印已加载运行的 AIQ 库信息，可设置 xcore 模块日志级别打印版本。

<!-- Source EN PDF p.404; unit 4462 -->

```text
 export persist_camera_engine_log=0x1000000ff2
```

<!-- Source EN PDF p.404; unit 4463 -->

3\. AIQ 启动时打印的版本信息如下：

<!-- Source EN PDF p.404; unit 4464 -->

```text
 ************************** VERSION INFOS **************************
 version release date: 2020-06-05
                  AIQ: v0.1.6
            IQ PARSER: v1.0.0
 RK INTEGRATED ALGO MODULES:
                  AWB: v0.0.9
                  AEC: v0.1.1
                   AF: v0.0.9
                 AHDR: v0.0.9
                  ANR: v0.0.9
               ASHARP: v0.0.9
              ADEHAZE: v0.0.9
               AGAMMA: v0.0.9
               A3DLUT: v0.0.9
                 ABLC: v0.0.9
                 ACCM: v0.0.9
                 ACGC: v0.0.9
                  ACP: v0.0.9
             ADEBAYER: v0.0.1
                ADPCC: v0.0.9
                 AGIC: v0.0.9
                  AIE: v0.0.1
                ALDCH: v0.0.9
                 ALSC: v0.0.9
                 AORB: v0.0.9
                 AR2Y: v0.0.9
                  ASD: v0.0.9
                 AWDR: v0.0.9
 ************************ VERSION INFOS END ************************
```

<!-- Source EN PDF p.405; unit 4465 -->

#### 11.1.1 版本匹配规则

<!-- Source EN PDF p.405; unit 4466 -->

AIQ、IQ Tool 与 ISP Driver 的匹配规则如下：

<!-- Source EN PDF p.405; unit 4467 -->

v A . B. C

<!-- Source EN PDF p.405; unit 4468 -->

B 为十六进制：bit[0:3] 标识 AIQ/IQ Tool 匹配版本，bit[4:7] 标识 AIQ/ISP driver 匹配版本。例如：

<!-- Source EN PDF p.405; unit 4469 -->

ISP driver：v 1. 0x3.0 匹配 AIQ:v1.0x30.0 与 AIQ:v1.0x40.0（原文示例原样）。

<!-- Source EN PDF p.405; unit 4470 -->

IQ tool：v 1. 0x3.0 匹配 AIQ:v1.0x33.0 与 AIQ:v1.0x30.0。AIQ 的 C 非 0 时可能存在不匹配；建议优先使用 C=0 的 AIQ 版本匹配 IQ Tool。

<!-- Source EN PDF p.405; unit 4471 -->

### 11.2 AIQ 日志

<!-- Source EN PDF p.405; unit 4472 -->

#### 11.2.1 概述

<!-- Source EN PDF p.405; unit 4473 -->

AIQ 用 64bits 表示所有模块的日志级别，各模块位图及说明如下：

<!-- Source EN PDF p.405; unit 4474 -->

```text
 bit: [63-39]   38      37       36    35   34     33    32    31
 mean:  [U]   [CAMHW][ANALYZER][XCORE][ASD][ACGC][AFEC][AORB][ASHARP]
 bit:  30   29   28     27     26       25      24   23       22
 mean:[AIE][ACP][ACSM][ALDCH][A3DLUT][ADEHAZE][AWDR][AGAMMA][ACCM]
 bit:      21     20    19   18    17    16     15   14  13   12
 mean:[ADEBAYER][AGIC][ALSC][ANR][AHDR][ADPCC][ABLC][AF][AWB][AEC]
 bit:    11-4        3-0
 mean:[sub modules][level]
     [U] means unused now.
     [level] : use 4 bits to define log levels.
     each module log has following ascending levels:
     0: error
     1: warning
     2: info
     3: debug
     4: verbose
     5: low1
     6-7: unused, now the same as debug
     [sub modules] : use bits 4-11 to define the sub modules of each module,
 thespecific meaning of each bit is decided by the module itself. These bitsis
 designed to implement the sub module's log switch.
     [modules] : AEC, AWB, AF ...
     set debug level example:
     eg. set module af log level to debug, and enable all sub modules of af:
     Android:
     setprop persist.vendor.rkisp.log 0x4ff4
     Linux:
     export persist_camera_engine_log=0x4ff4
     And if only want enable the sub module 1 log of af:
     Android:
     setprop persist.vendor.rkisp.log 0x4014
     Linux:
     export persist_camera_engine_log=0x4014
```

上方位图按原文保留：bit[63-39] 的 U 当前未使用；level 占 4 位，级别递增为 0 error、1 warning、2 info、3 debug、4 verbose、5 low1、6-7 未使用且当前等同 debug。sub modules 用 bit4-11，各位含义由模块决定，用于子模块日志开关；modules 包括 AEC、AWB、AF 等。原文示例先为 AF 开启全部子模块，再仅开启子模块 1，Android 使用 setprop，Linux 使用 export。注意原文将 0x4ff4 称为 debug 示例，但其低 4 位为 4，与上方 verbose 对应；保留原值，使用前核对 SDK。

<!-- Source EN PDF p.406; unit 4475 -->

Linux 中通过环境变量 persist_camera_engine_log 控制各模块日志开关与级别。

<!-- Source EN PDF p.407; unit 4476 -->

| 模块 | Debug 日志 | Verbose 日志 |
|---|---|---|
| AE | export persist_camera_engine_log=0x1ff3 | export persist_camera_engine_log=0x1ff4 |
| AWB | export persist_camera_engine_log=0x2ff3 | export persist_camera_engine_log=0x2ff4 |
| AF | export persist_camera_engine_log=0x4ff3 | export persist_camera_engine_log=0x4ff4 |
| HDR | export persist_camera_engine_log=0x20ff3 | export persist_camera_engine_log=0x20ff3 |
| NR | export persist_camera_engine_log=0x40ff3 | export persist_camera_engine_log=0x40ff4 |
| Dehaze | export persist_camera_engine_log=0x2000ff3 | export persist_camera_engine_log=0x2000ff3 |
| Sharp | export persist_camera_engine_log=0x80000ff3 | export persist_camera_engine_log=0x80000ff4 |
| CAMHW | export<br>persist_camera_engine_log=0x4000000ff3 | export<br>persist_camera_engine_log=0x4000000ff4 |
|  |  |  |
|  |  |  |
|  |  |  |

<!-- Source EN PDF p.407; unit 4477 -->

查看当前日志级别的命令：

<!-- Source EN PDF p.407; unit 4478 -->

```text
    [root@RV1126_RV1109:/]# echo $persist_camera_engine_log
    0x4014
```

<!-- Source EN PDF p.407; unit 4479 -->

#### 11.2.2  AE

<!-- Source EN PDF p.407; unit 4480 -->

11.2.2.1 配置指南

<!-- Source EN PDF p.407; unit 4481 -->

| 日志级别 | 说明与开启建议 |
|---|---|
| 错误（Error） | 默认开启，严重错误。 |
| 警告（Warning） | 默认关闭，警告错误；算法可能进行异常处理后继续运行。 |
| 信息（Info） | 默认关闭。基本调试信息，无逐帧输出；事件信息为算法运行状态和帧率，通常只在初始化、切换分辨率、修改配置时打印。用于了解运行状态和帧率。 |

<!-- Source EN PDF p.408; unit 4482 -->

| 日志级别 | 说明与开启建议 |
|---|---|
| 调试（Debug） | 默认关闭，相对 Info 增加逐帧帧号、匹配曝光、AE 统计亮度及曝光结果。适合连续分析亮度和曝光，以定位闪烁等问题。原文事件信息为空。 |
| 详细（Verbose） | 默认关闭，相对 Debug 增加算法运行结果的逐帧输出。通常不启用，仅在 Debug 无法判断问题时开启；原文事件信息为空。 |

<!-- Source EN PDF p.408; unit 4483 -->

| 子模块位 | 说明与开启建议 |
|---|---|
| bit[4] | AE 参数配置日志。读取 IQ 或 API 设置参数时，可据此核对配置。 |
| bit[5] | AE 信息处理日志：按 AE 统计计算环境和图像指标，用于读取统计亮度信息。 |
| bit[6] | AE 曝光计算日志，用于读取曝光结果。 |
| bit[7] | Airis 光圈算法日志，用于可变光圈问题。 |
| bit[8:11] | void |

<!-- Source EN PDF p.408; unit 4484 -->

11.2.2.2 日志解读

<!-- Source EN PDF p.408; unit 4485 -->

限于篇幅，原文仅解读 Debug 级别 0x1ff3，即 AE 全部子模块的 Debug 信息。

<!-- Source EN PDF p.408; unit 4486 -->

线性模式 AE LOG

<!-- Source EN PDF p.409; unit 4487 -->

![英文原稿技术图 — PDF p.409](/docs/rockchip-isp30-development/assets/en-p409-X2117.png)

<!-- Source EN PDF p.409; unit 4488 -->

图 3-1 线性模式 AE LOG

<!-- Source EN PDF p.409; unit 4489 -->

图 3-1 为线性 AE 日志示例。第 1 行：

<!-- Source EN PDF p.409; unit 4490 -->

```text
Cur-Exp: FrmId=270,gain=0x36a,time=0x576,envChange=0,dcg=-1,pirs=0
```

<!-- Source EN PDF p.409; unit 4491 -->

当前帧曝光参数。

<!-- Source EN PDF p.409; unit 4492 -->

| 成员名 | 说明 |
|---|---|
| FrmId | 当前帧帧号 |
| gain | 当前帧 sensor 曝光增益寄存器值。 |
| time | 当前帧 sensor 曝光时间寄存器值。 |
| envChange | 环境亮度是否突变：0 无突变，1 有突变。 |
| dcg | 当前帧 DCG：-1 表示 sensor 不支持或内部切换；0 为 LCG，1 为 HCG。 |
| pirs | 当前帧 P-iris 步进电机位置。Airis 关闭时无效，无实际含义。 |

<!-- Source EN PDF p.409; unit 4493 -->

行 2:

<!-- Source EN PDF p.409; unit 4494 -->

```text
Last-Res:FrmId=269,gain=0x356,time=0x576,pirs=0
```

<!-- Source EN PDF p.409; unit 4495 -->

上次 AE 运行设置的新曝光参数，部分与（1）相同不再重复。对比 Line1、Line2，可判断当前曝光是否与新曝光一致，即新曝光是否生效。第 3 行：

<!-- Source EN PDF p.409; unit 4496 -->

```text
================================= Linear-AE (enter)===============================
```

<!-- Source EN PDF p.409; unit 4497 -->

进入 AE 控制算法；Linear-AE 表示线性曝光模式。

<!-- Source EN PDF p.409; unit 4498 -->

行 4:

<!-- Source EN PDF p.409; unit 4499 -->

```text
Framenum=270
```

<!-- Source EN PDF p.409; unit 4500 -->

```text
Cur gain=6.826667,time=0.029987,pirisGain=0,RawMeanluma=29.564444,YuvMeanluma=34.875557,Is Converged=0
```

<!-- Source EN PDF p.410; unit 4501 -->

| 成员名 | 说明 |
|---|---|
| Framenum | 当前帧帧号 |
| gain | 当前帧 sensor 曝光增益。 |
| time | 当前帧 sensor 曝光时间。 |
| pirisGain | 当前帧 P-iris 等效增益；Airis 关闭时无效。 |
| RawMeanluma | Debayer 前 RAW 图像亮度，已减黑电平并乘 AWB Gain。 |
| YuvMeanluma | Gamma 前 RGB 图像亮度，用于判断 debayer 后模块对亮度的影响。 |
| IsConverged | 曝光是否收敛：0 未收敛，1 已收敛。 |

<!-- Source EN PDF p.410; unit 4502 -->

行 5:

<!-- Source EN PDF p.410; unit 4503 -->

```text
AecClmExecute: NewExposure(0.180993) SplitGain(6.033096) SplitIntegrationTime(0.030000) SplitPirisGain(0)
```

<!-- Source EN PDF p.410; unit 4504 -->

| 成员名 | 说明 |
|---|---|
| NewExposure | AE 控制算法计算出的新曝光量。 |
| SplitGain | 新 sensor 曝光增益。 |
| SplitIntegrationTime | 新 sensor 曝光时间。 |
| SplitPirisGain | 新 P-iris 等效增益；Airis 关闭时无效。 |

<!-- Source EN PDF p.410; unit 4505 -->

行 6:

<!-- Source EN PDF p.410; unit 4506 -->

```text
calc result:SetPoint=22.000000,gain=6.023529,time=0.029987,piris=0,reggain=854,regtime=1398
```

<!-- Source EN PDF p.410; unit 4507 -->

最终设置的新曝光。

<!-- Source EN PDF p.411; unit 4508 -->

| 成员名 | 说明 |
|---|---|
| SetPoint | 目标亮度值 |
| gain | 最终新曝光增益。 |
| time | 最终新曝光时间。 |
| piris | 最终新 P-iris 等效增益；Airis 关闭时无效。 |
| reggain | 最终新曝光增益对应的寄存器值。 |
| regtime | 最终新曝光时间对应的寄存器值。 |

<!-- Source EN PDF p.411; unit 4509 -->

可据此获取当前 RawMeanLuma 及对应目标 setpoint，比较当前亮度与目标后计算新曝光。以下为 HDR 模式 AE LOG：

<!-- Source EN PDF p.411; unit 4510 -->

![英文原稿技术图 — PDF p.411](/docs/rockchip-isp30-development/assets/en-p411-X2122.png)

<!-- Source EN PDF p.411; unit 4511 -->

图 3-2 HDR 模式 AE LOG

<!-- Source EN PDF p.411; unit 4512 -->

行 1:

<!-- Source EN PDF p.411; unit 4513 -->

```text
Cur-Exp: FrmId=22,S-gain=0x0,S-time=0x2b6,M-gain=0xb,M-time=0x1a5e,L-gain=0x0,L- time=0x0,envChange=1,dcg=-1--1--1,Piris=0
```

<!-- Source EN PDF p.411; unit 4514 -->

当前帧曝光参数。

<!-- Source EN PDF p.412; unit 4515 -->

| 成员名 | 说明 |
|---|---|
| FrmId | 当前帧帧号 |
| S/M/L-gain | HDR 各帧 sensor 曝光增益寄存器；双帧 S/M 有效，三帧 S/M/L 有效。 |
| S/M/L-time | HDR 各帧 sensor 曝光时间寄存器；双帧 S/M 有效，三帧 S/M/L 有效。 |
| envChange | 环境亮度是否突变：0 无突变，1 有突变。 |
| dcg | DCG 三值对应短、中、长帧。双帧时前两值对应短、长；三帧对应短、中、长。-1 不支持或内部切换，0 LCG、1 HCG。 |
| pirs | 当前帧 P-iris 步进电机位置。Airis 关闭时无效，无实际含义。 |

<!-- Source EN PDF p.412; unit 4516 -->

行 2:

<!-- Source EN PDF p.412; unit 4517 -->

```text
Last-Res:FrmId=20,S-gain=0x5,S-time=0x8ca,M-gain=0x11,M-time=0x1a5e,L-gain=0x0,L- time=0x0
```

<!-- Source EN PDF p.412; unit 4518 -->

上次 AE 设置的新曝光，部分字段与（1）相同；比较 Line1/Line2 可判断新曝光是否生效。

<!-- Source EN PDF p.412; unit 4519 -->

行 3:

<!-- Source EN PDF p.412; unit 4520 -->

```text
================================= HDR-AE (enter)===============================
```

<!-- Source EN PDF p.412; unit 4521 -->

进入 AE 控制算法，HDR-AE 表示 HDR 曝光模式。

<!-- Source EN PDF p.412; unit 4522 -->

行 4:

<!-- Source EN PDF p.412; unit 4523 -->

```text
AecRun: SMeanLuma=9.342692, MMeanLuma=37.698597,LMeanLuma=0.000000,TmoMeanluma=37.571430,Isconverged=0,Longfr m=0
```

<!-- Source EN PDF p.413; unit 4524 -->

| 成员名 | 说明 |
|---|---|
| S/M/LMeanLuma | HDR 各帧平均亮度；双帧 S/M，三帧 S/M/L 有效。 |
| TmoMeanluma | 当前帧 TMO 输出平均亮度。 |
| Isconverged | HDR 各帧曝光是否收敛：0 未收敛，1 已收敛。 |
| Longfrm | 长帧模式状态：0 关闭，1 开启。 |

<!-- Source EN PDF p.413; unit 4525 -->

行 5:

<!-- Source EN PDF p.413; unit 4526 -->

```text
Framenum=22 Cur Piris=0, Sgain=1.000000,Stime=0.002570,mgain=1.462177,mtime=0.025000,lgain=1.000000,ltime=0.000000
```

<!-- Source EN PDF p.413; unit 4527 -->

| 成员名 | 说明 |
|---|---|
| Framenum | 当前帧号。 |
| s/m/lgain | 当前帧 sensor 曝光增益；双帧 s/m，三帧 s/m/l 有效。 |
| s/m/ltime | 当前帧 sensor 曝光时间；双帧 s/m，三帧 s/m/l 有效。 |
| piris | 当前帧 P-iris 等效增益；Airis 关闭时无效。 |

<!-- Source EN PDF p.413; unit 4528 -->

行 6:

<!-- Source EN PDF p.413; unit 4529 -->

```text
S-HighLightLuma=197.250000,S-Target=100.000000,S-GlobalLuma=9.342692,S-Target=19.959433
```

<!-- Source EN PDF p.413; unit 4530 -->

短帧控制算法 LOG

<!-- Source EN PDF p.413; unit 4531 -->

| 成员名 | 说明 |
|---|---|
| S-HighLightLuma | 当前短帧高光区域亮度。 |
| S-Target | 当前短帧高光区域目标亮度。 |
| S-GlobalLuma | 当前短帧全局平均亮度。 |
| S-Target | 当前短帧全局目标亮度。 |

<!-- Source EN PDF p.413; unit 4532 -->

行 7:

<!-- Source EN PDF p.413; unit 4533 -->

```text
L-LowLightLuma=29.626642,L-Target=48.572094,L-GlobalLuma=37.698597,L-Target=77.620155
```

<!-- Source EN PDF p.413; unit 4534 -->

长帧控制算法 LOG

<!-- Source EN PDF p.414; unit 4535 -->

| 成员名 | 说明 |
|---|---|
| L-LowLightLuma | 当前长帧暗区亮度 |
| L-Target | 当前长帧暗区目标亮度。 |
| L-GlobalLuma | 当前长帧全局平均亮度。 |
| L-Target | 当前长帧全局目标亮度。 |

<!-- Source EN PDF p.414; unit 4536 -->

行 8:

<!-- Source EN PDF p.414; unit 4537 -->

```text
calc result:piris=0,sgain=1.000000,stime=0.005081,mgain=1.862087,mtime=0.025000,lgain=0.000000,lti me=0.000000
```

<!-- Source EN PDF p.414; unit 4538 -->

AE 控制算法输出曝光结果。

<!-- Source EN PDF p.414; unit 4539 -->

| 成员名 | 说明 |
|---|---|
| s/m/lgain | 最终新 sensor 曝光增益；双帧 s/m，三帧 s/m/l 有效。 |
| s/m/ltime | 最终新 sensor 曝光时间；双帧 s/m，三帧 s/m/l 有效。 |
| piris | 最终新 P-iris 等效增益；Airis 关闭时无效。 |

<!-- Source EN PDF p.414; unit 4540 -->

#### 11.2.3  AWB

<!-- Source EN PDF p.414; unit 4541 -->

11.2.3.1 配置指南

<!-- Source EN PDF p.414; unit 4542 -->

| 日志级别 | 说明与开启建议 |
|---|---|
| 错误（Error） | 默认开启，严重错误。 |
| 警告（Warning） | 默认开启：警告错误，内部可能已作异常处理。 |
| 信息（Info） | 默认关闭：基本调试信息，逐帧输出 wbgain 结果；原文事件和建议为空。 |

<!-- Source EN PDF p.415; unit 4543 -->

| 日志级别 | 说明与开启建议 |
|---|---|
| debug | 默认关闭，相对 Info 增加逐帧白平衡收敛状态、环境亮度、白点数、总色温及概率最高的前四光源等。调用原文所谓 AWS API 后打印属性信息（AWS 拼写保留）；限制日志大小时可用此级别获取关键调试信息。 |
| 详细（Verbose） | 默认关闭，相对 Debug 增加各光源的白点统计（白平衡增益、白点数）及策略中间结果。原文事件项为空；建议使用此级别抓完整调试日志。 |

<!-- Source EN PDF p.415; unit 4544 -->

| 子模块位 | 说明与开启建议 |
|---|---|
| bit[4:11] | void |

<!-- Source EN PDF p.415; unit 4545 -->

11.2.3.2 日志解读

<!-- Source EN PDF p.415; unit 4546 -->

参见《Rockchip_Color_Optimization_Guide_ISP2x_CN》（原文交叉引用）。

<!-- Source EN PDF p.415; unit 4547 -->

#### 11.2.4  AF

<!-- Source EN PDF p.415; unit 4548 -->

11.2.4.1 配置指南

<!-- Source EN PDF p.415; unit 4549 -->

| 日志级别 | 说明与开启建议 |
|---|---|
| 错误（Error） | 默认开启，严重错误。 |
| 警告（Warning） | 默认关闭：警告错误，内部可能已作异常处理。 |
| 信息（Info） | 默认关闭：基本调试信息，逐帧输出对焦搜索最终结果；事件与建议为空。 |

<!-- Source EN PDF p.416; unit 4550 -->

| 日志级别 | 说明与开启建议 |
|---|---|
| debug | 默认关闭，相对 Info 增加 FV、马达位置；事件包括对焦触发、清晰位置搜索、变焦、对焦跟随及对焦。建议抓完整调试日志时使用。 |
| 详细（Verbose） | 默认关闭，原文称相对 Debug 增加内容为 None；逐帧信息、事件及建议为空或 None。 |

<!-- Source EN PDF p.416; unit 4551 -->

| 子模块位 | 说明与开启建议 |
|---|---|
| bit[4:11] | void |

<!-- Source EN PDF p.416; unit 4552 -->

11.2.4.2 日志解读

<!-- Source EN PDF p.416; unit 4553 -->

#### 11.2.5  MERGE

<!-- Source EN PDF p.416; unit 4554 -->

11.2.5.1 配置指南

<!-- Source EN PDF p.416; unit 4555 -->

| 日志级别 | 说明与开启建议 |
|---|---|
| 信息（Info） | 默认关闭：逐帧与事件尚未使用，建议关闭。 |
| debug | 默认关闭：逐帧 Merge 调试信息，事件未用。画面亮度不达预期或 TMO 后对比度不足时开启。 |
| 详细（Verbose） | 默认关闭：原文称相对 Verbose 增加 Mrerge 曝光信息，事件未用。画面闪烁且 AE 日志确认 TMO 有闪烁时开启，供 RK 调试；Mrerge 为原文拼写。 |

<!-- Source EN PDF p.417; unit 4556 -->

| 子模块位 | 说明与开启建议 |
|---|---|
| bit[4:11] | void |

<!-- Source EN PDF p.417; unit 4557 -->

11.2.5.2 日志解读

<!-- Source EN PDF p.417; unit 4558 -->

线性模式的 merge 日志级别如下：

<!-- Source EN PDF p.417; unit 4559 -->

![英文原稿技术图 — PDF p.417](/docs/rockchip-isp30-development/assets/en-p417-X2143.png)

<!-- Source EN PDF p.417; unit 4560 -->

HDR、长帧为基准时，merge 日志级别为 10000000ff3。

<!-- Source EN PDF p.417; unit 4561 -->

![英文原稿技术图 — PDF p.417](/docs/rockchip-isp30-development/assets/en-p417-X2144.png)

<!-- Source EN PDF p.418; unit 4562 -->

| 名称 | 说明 |
|---|---|
| FrameID | 帧号 |
| HDRFrameNum | HDR 帧数 |
| LongFrmMode | 长帧模式开关：0 关闭，1 开启。 |
| MergeApiMode | API 模式 |
| EnvLv | 环境亮度 |
| MoveCoef | 运动变量 |
| byPass | 当前帧旁路开关：0 关闭，1 开启。 |
| BaseFrm | 基准帧模式：0 长帧，1 短帧。 |
| OECurve_smooth | 当前帧过曝曲线斜率，范围 [0,200]，由 JSON 参数以系数 200 反归一化。 |
| OECurve_offset | 当前帧过曝曲线偏移，范围 [108,280]。 |
| MDCurveMS_smooth | 当前帧中，原文所述“frame 与短帧”间运动曲线斜率，范围 [0,200]，JSON 参数乘系数 200 反归一化。 |
| MDCurveMS_offset | 上述“frame 与短帧”间运动曲线偏移，范围 [0.26,100]，JSON 参数以系数 100 反归一化。 |
| MDCurveLM_smooth | 当前长、中帧运动曲线斜率，范围 [0,200]，JSON 参数以系数 200 反归一化。 |
| MDCurveLM_offset | 当前长、中帧运动曲线偏移，范围 [0.26,100]，JSON 参数以系数 100 反归一化。 |

<!-- Source EN PDF p.418; unit 4563 -->

HDR、短帧为基准时，merge 日志级别为 10000000ff3。

<!-- Source EN PDF p.418; unit 4564 -->

![英文原稿技术图 — PDF p.418](/docs/rockchip-isp30-development/assets/en-p418-X2148.png)

<!-- Source EN PDF p.419; unit 4565 -->

| 名称 | 说明 |
|---|---|
| FrameID | 帧号 |
| HDRFrameNum | HDR 帧数 |
| LongFrmMode | 长帧模式开关：0 关闭，1 开启。 |
| MergeApiMode | API 模式 |
| EnvLv | 环境亮度 |
| MoveCoef | 运动变量 |
| byPass | 当前帧旁路开关：0 关闭，1 开启。 |
| BaseFrm | 基准帧模式：0 长帧，1 短帧。 |
| OECurve_smooth | 当前帧过曝曲线斜率，范围 [0,200]，由 JSON 参数以系数 200 反归一化。 |
| OECurve_offset | 当前帧过曝曲线偏移，范围 [108,280]。 |
| MDCurve_Coef | 当前帧控制系数，范围 [0,1]，默认 0.05，精度 0.0001。 |
| MDCurve_ms_thd0 | 当前短帧控制系数，范围 [0,1]，默认 0.0，精度 0.1。 |
| MDCurve_lm_thd0 | 当前长帧控制系数，范围 [0,1]，默认 0.0，精度 0.1。 |

<!-- Source EN PDF p.419; unit 4566 -->

#### 11.2.6  DRC

<!-- Source EN PDF p.419; unit 4567 -->

11.2.6.1 配置指南

<!-- Source EN PDF p.419; unit 4568 -->

| 日志级别 | 说明与开启建议 |
|---|---|
| 信息（Info） | 默认关闭：逐帧与事件尚未使用，建议关闭。 |
| debug | 默认关闭：逐帧 DRC 调试信息，事件未用；亮度不达预期或 TMO 后对比度不足时开启。 |

<!-- Source EN PDF p.420; unit 4569 -->

| 日志级别 | 说明与开启建议 |
|---|---|
| 详细（Verbose） | 默认关闭：原文称相对 Verbose 增加 DRC 曝光信息，事件未用；AE 日志确认闪烁来自 TMO 时开启供 RK 调试。 |

<!-- Source EN PDF p.420; unit 4570 -->

| 子模块位 | 说明与开启建议 |
|---|---|
| bit[4:11] | void |

<!-- Source EN PDF p.420; unit 4571 -->

11.2.6.2 日志解读

<!-- Source EN PDF p.420; unit 4572 -->

DRC 日志级别为 20ff3 时：

<!-- Source EN PDF p.420; unit 4573 -->

![英文原稿技术图 — PDF p.420](/docs/rockchip-isp30-development/assets/en-p420-X2155.png)

<!-- Source EN PDF p.421; unit 4574 -->

| 名称 | 说明 |
|---|---|
| FrameID | 帧号 |
| HDRFrameNum | HDR 帧数 |
| LongFrmMode | 长帧模式开关：0 关闭，1 开启。 |
| DRCApiMode | API 模式 |
| EnvLv | 环境亮度 |
| byPass | 当前帧旁路开关：0 关闭，1 开启。 |
| Enable | DRC 开关 |
| DrcGain | 当前帧 DRC 模块增益，范围 [1,8]。 |
| alpha | 当前 DrcGain Alpha，范围 [0,1]。 |
| Clip | 当前 DrcGain Clip，范围 [0,64]。 |
| Strength | 当前 HiLight 高光区域细节，范围 [0,1]。 |
| CompressMode | 当前 CompressSetting 模式。 |
| LocalWeit | 当前 Local 权重，范围 [0,1]：0 全局、1 全 Local，默认 0。 |
| LocalAutoEnable | 当前自动 LocalWeit 开关，范围 [0,1]，默认 1，精度 1。 |
| LocalAutoWeit | 当前自动 LocalWeit，范围 [0,1]，默认 0.4，精度 0.01。 |
| GlobalContrast | 当前全局对比度，范围 [0,1]，默认 0，精度 0.01。 |
| LoLitContrast | 当前低亮区域对比度（原文 low volume），范围 [0,1]，默认 0，精度 0.01。 |

<!-- Source EN PDF p.421; unit 4575 -->

#### 11.2.7 NR 与锐化

<!-- Source EN PDF p.421; unit 4576 -->

11.2.7.1 配置指南

<!-- Source EN PDF p.421; unit 4577 -->

| 日志级别 | 说明与开启建议 |
|---|---|
| error | 默认开启，逐帧打印可能导致软件崩溃的严重错误；事件未用，建议开启。 |

<!-- Source EN PDF p.422; unit 4578 -->

| 日志级别 | 说明与开启建议 |
|---|---|
| 信息（Info） | 默认关闭，输出所有函数调用但不打印寄存器，信息较多；事件未用。效果正常且无错误时不建议开启，通常用 io 命令打印寄存器。 |
| debug | 默认关闭，相对 Info 增加含寄存器值的所有调用信息，寄存器打印量较大；事件未用。效果严重异常时开启，供 RK 调试。 |

<!-- Source EN PDF p.422; unit 4579 -->

| 子模块位 | 说明与开启建议 |
|---|---|
| bit[4:11] | void |

<!-- Source EN PDF p.422; unit 4580 -->

11.2.7.2 日志解读

<!-- Source EN PDF p.422; unit 4581 -->

#### 11.2.8 Dhz&Ehz

<!-- Source EN PDF p.422; unit 4582 -->

11.2.8.1 配置指南

<!-- Source EN PDF p.422; unit 4583 -->

| 日志级别 | 说明与开启建议 |
|---|---|
| 信息（Info） | 默认关闭，逐帧与事件均未使用；建议为空。 |
| debug | 默认关闭，相对 Info 增加 DHZ &amp; Ehz 调试信息；事件与建议为空。 |

<!-- Source EN PDF p.423; unit 4584 -->

| 日志级别 | 说明与开启建议 |
|---|---|
| 详细（Verbose） | 默认关闭，原文称相对 Verbose 增加，但逐帧与事件均未使用，建议为空。 |

<!-- Source EN PDF p.423; unit 4585 -->

| 子模块位 | 说明与开启建议 |
|---|---|
| bit[4:11] | void |

<!-- Source EN PDF p.423; unit 4586 -->

11.2.8.2 日志解读

<!-- Source EN PDF p.423; unit 4587 -->

Enhance 开启时，Dehaze 日志级别为 2000ff3。

<!-- Source EN PDF p.423; unit 4588 -->

![英文原稿技术图 — PDF p.423](/docs/rockchip-isp30-development/assets/en-p423-X2168.png)

<!-- Source EN PDF p.423; unit 4589 -->

| 名称 | 说明 |
|---|---|
| FrameID | 帧号 |
| byPassProc | 当前帧旁路开关：0 关闭，1 开启。 |
| ISO | ISO |
| Dehaze 模块使能 | Dehaze 模块开关 |
| Dehaze 使能 | 去雾功能开关 |
| Enhance 使能 | 增强功能开关 |
| Hist 使能 | Hist 功能开关。 |
| EnvLv | 当前帧环境亮度。 |
| enhance_value | 当前帧整体对比强度，范围 [0,16]，建议 [1,2]。 |
| enhance_chroma | 当前帧色度增强调整参数，范围 [0,16]，建议 [1,2]。 |
| enhance_value_reg | 当前帧整体对比强度的 reg 值。 |
| enhance_chroma_reg | 当前帧色度增强参数的 REG 值。 |

<!-- Source EN PDF p.423; unit 4590 -->

Dehaze 开启且 cfg_alpha=0 时，日志级别为 2000ff3。

<!-- Source EN PDF p.424; unit 4591 -->

![英文原稿技术图 — PDF p.424](/docs/rockchip-isp30-development/assets/en-p424-X2172.png)

<!-- Source EN PDF p.424; unit 4592 -->

| 名称 | 说明 |
|---|---|
| FrameID | 帧号 |
| byPassProc | 当前帧旁路开关：0 关闭，1 开启。 |
| ISO | ISO |
| Dehaze 模块使能 | Dehaze 模块开关 |
| Dehaze 使能 | 去雾功能开关 |
| Enhance 使能 | 增强功能开关 |
| Hist 使能 | Hist 功能开关。 |
| cfg_alpha | 软件配置占比，范围 [0,1]，默认 1，精度 0.01。 |
| EnvLv | 当前帧环境亮度。 |
| air_max | 当前 AIR 自适应上限，范围 [230,250]，默认 250。 |
| air_min | 当前 AIR 自适应下限，原文范围 [230,250]、默认 200；默认值在所列范围之外的矛盾保留。 |
| tmax_base | 当前 tmax 自适应基准默认 125。对应配置为 200(131)、210(125)、220(119)、230(114)、240(109)、250(105)，建议 131-105。 |
| wt_max | wt 自适应上限，范围 [0.75,0.9]，默认 0.9。 |

<!-- Source EN PDF p.424; unit 4593 -->

Dehaze 开启且 cfg_alpha=1 时，日志级别为 2000ff3。

<!-- Source EN PDF p.424; unit 4594 -->

![英文原稿技术图 — PDF p.424](/docs/rockchip-isp30-development/assets/en-p424-X2173.png)

<!-- Source EN PDF p.425; unit 4595 -->

| 名称 | 说明 |
|---|---|
| FrameID | 帧号 |
| byPassProc | 当前帧旁路开关：0 关闭，1 开启。 |
| ISO | ISO |
| Dehaze 模块使能 | Dehaze 模块开关 |
| Dehaze 使能 | 去雾功能开关 |
| Enhance 使能 | 增强功能开关 |
| Hist 使能 | Hist 功能开关。 |
| cfg_alpha | 软件配置占比，范围 [0,1]，默认 1，精度 0.01。 |
| EnvLv | 当前帧环境亮度。 |
| cfg_air | 软件配置 air 大气光系数，范围 [0,255]，默认 210。 |
| cfg_tmax | 软件配置 tmax 去雾最大值，范围 [0,1]，默认 0.2。 |
| cfg_wt | 软件配置 wt 去雾强度，范围 [0,1]，默认 0.8。 |

<!-- Source EN PDF p.425; unit 4596 -->

Hist 开启时，Dehaze 日志级别为 2000ff3。

<!-- Source EN PDF p.425; unit 4597 -->

![英文原稿技术图 — PDF p.425](/docs/rockchip-isp30-development/assets/en-p425-X2176.png)

<!-- Source EN PDF p.426; unit 4598 -->

| 名称 | 说明 |
|---|---|
| FrameID | 帧号 |
| byPassProc | 当前帧旁路开关：0 关闭，1 开启。 |
| ISO | ISO |
| Dehaze 模块使能 | Dehaze 模块开关 |
| Dehaze 使能 | 去雾功能开关 |
| Enhance 使能 | 增强功能开关 |
| Hist 使能 | Hist 功能开关。 |
| cfg_alpha | 软件配置占比，范围 [0,1]，默认 1，精度 0.01。 |
| EnvLv | 当前帧环境亮度。 |
| hist_para_en | 当前帧直方图拉伸控制开关。 |
| hist_gratio | 直方图拉伸倍数、均衡化控制系数，范围 [0,32]。 |
| hist_th_off | 直方图统计阈值，范围 [0,255]，默认 64。 |
| hist_k | 直方图自适应阈值倍率，范围 [0,7)，默认 2。 |
| hist_min | 直方图统计阈值最小值，范围 [0,2]，默认 0.016。 |
| hist_scale | 直方图均衡化控制系数，范围 [0,32]。 |
| cfg_gratio | 软件配置直方图拉伸倍数及均衡化控制系数，范围 [0,32]。 |

<!-- Source EN PDF p.426; unit 4599 -->

#### 11.2.9  CamHW

<!-- Source EN PDF p.426; unit 4600 -->

11.2.9.1 配置指南

<!-- Source EN PDF p.426; unit 4601 -->

| 日志级别 | 说明与开启建议 |
|---|---|
| 错误（Error） | 默认开启，严重错误。 |
| 警告（Warning） | 默认关闭：警告错误，算法可能已作异常处理。 |

<!-- Source EN PDF p.427; unit 4602 -->

| 日志级别 | 说明与开启建议 |
|---|---|
| 信息（Info） | 默认关闭：基本调试信息，逐帧、事件及建议均为空。 |
| 调试（Debug） | 默认关闭，相对 Info 增加基本调试信息；逐帧、事件及建议为空。 |
| 详细（Verbose） | 默认关闭，相对 Debug 增加基本调试信息；逐帧与事件为空。存在单次大量输出，谨慎使用。 |
| Low1 | 默认关闭，相对 Debug 增加基本调试信息；逐帧项为空，事件为函数调用路径，建议为空。 |

<!-- Source EN PDF p.428; unit 4603 -->

| 子模块位 | 说明与开启建议 |
|---|---|
| bit[4] | 30 子模块日志开关，负责 HWI 流程控制，建议与下列子模块同时开启。 |
| bit[5] | Isp30Params、Isp30PollThread 日志，负责 ISP 参数、数据流、事件等。参数与视频帧不匹配、时序异常、回读离线模式断流等问题时使用。 |
| bit[6] | SensorHw 日志负责 sensor 相关部分，适于 CIS 曝光设置等疑点。 |
| bit[7] | FlashLight 日志负责补光控制，用于补光问题。 |
| bit[8] | LensHw 日志负责镜头电机控制，用于马达控制等问题。 |
| bit[9] | 30SpThread 子模块开关，内部模块预留。 |
| bit[10:11] | void |

<!-- Source EN PDF p.428; unit 4604 -->

11.2.9.2 日志解读

<!-- Source EN PDF p.428; unit 4605 -->

CamHwIsp20 子模块

<!-- Source EN PDF p.428; unit 4606 -->

![英文原稿技术图 — PDF p.428](/docs/rockchip-isp30-development/assets/en-p428-X2185.png)

<!-- Source EN PDF p.428; unit 4607 -->

该日志仅在 AIQ 库加载时打印一次，显示 sensor、ISP、ISPP 的连接关系。信息来自 media 拓扑解析，可用于确认 sensor 是否正常检测。

<!-- Source EN PDF p.428; unit 4608 -->

![英文原稿技术图 — PDF p.428](/docs/rockchip-isp30-development/assets/en-p428-X2186.png)

<!-- Source EN PDF p.429; unit 4609 -->

上图为 HWI 向 ISP 驱动配置新参数，当前基本逐帧配置，具体字段如下：

<!-- Source EN PDF p.429; unit 4610 -->

| 成员名 | 说明 |
|---|---|
| ispparam ens | 模块使能位，位定义参见 HWI/ISP20/rk_isp20_hw.H。 |
| en_up | 模块使能更新位，对应位为 1 表示需更新使能状态。 |
| cfg_up | 模块参数更新位，对应位为 1 表示需更新参数。 |
| device | ISP 参数模块对应的视频节点。 |

<!-- Source EN PDF p.429; unit 4611 -->

![英文原稿技术图 — PDF p.429](/docs/rockchip-isp30-development/assets/en-p429-X2190.png)

<!-- Source EN PDF p.429; unit 4612 -->

上图为 HWI 向 ISPP 驱动配置新参数，同样基本逐帧配置；字段含义参考前述 ISP 模块。

<!-- Source EN PDF p.429; unit 4613 -->

Isp20PollThread 子模块

<!-- Source EN PDF p.429; unit 4614 -->

![英文原稿技术图 — PDF p.429](/docs/rockchip-isp30-development/assets/en-p429-X2191.png)

<!-- Source EN PDF p.429; unit 4615 -->

回读模式每次开始一帧回读时输出该日志；正常工作期间逐帧打印，含义如下。

<!-- Source EN PDF p.429; unit 4616 -->

| 成员名 | 说明 |
|---|---|
| frame | RAW 帧 ID，从 0 开始。 |
| sof_ts | 帧 SOF 时间戳。 |
| frame_ts | 采集到 DDR 完成时的时间戳。 |
| readback | ISP 回读次数。 |

<!-- Source EN PDF p.429; unit 4617 -->

![英文原稿技术图 — PDF p.429](/docs/rockchip-isp30-development/assets/en-p429-X2192.png)

<!-- Source EN PDF p.429; unit 4618 -->

该图为回读模式 RAW buf 轮转过程，每帧打印，含义如下：

<!-- Source EN PDF p.430; unit 4619 -->

| 成员 | 说明 |
|---|---|
| handle_rx_buf | ISP 处理完一帧后，归还给 VICAP/isp_tx。 |
| dev_index | 长、中、短帧设备索引；handle_tx_buf 与 handle_rx_buf 的 dev_index 相同表示同一数据。 |
| sequence | 帧号，从 0 开始。 |

<!-- Source EN PDF p.430; unit 4620 -->

SensorHw 子模块

<!-- Source EN PDF p.430; unit 4621 -->

![英文原稿技术图 — PDF p.430](/docs/rockchip-isp30-development/assets/en-p430-X2195.png)

<!-- Source EN PDF p.430; unit 4622 -->

图示为线性模式向 sensor 驱动设置新曝光的流程，有新曝光时调用，字段含义如下：

<!-- Source EN PDF p.430; unit 4623 -->

| 成员 | 说明 |
|---|---|
| frameid | SOF 事件帧号。 |
| handle_sof | SOF 事件回调，每帧一次，在此处理曝光设置。 |
| exp_list 大小 | 曝光列表中尚未设置到驱动的新曝光时间数量。 |
| gain_list 大小 | 曝光列表中尚未设置到驱动的新增益数量。 |
| working_mode | 当前工作模式，0 为 normal。 |
| set_time | SOF 消息中是否有新曝光时间需设置到驱动。 |
| set_gain | SOF 消息中是否有新增益需设置到驱动。 |
| a-gain, time | 新曝光时间、增益寄存器值。 |

<!-- Source EN PDF p.430; unit 4624 -->

### 11.3 获取 Raw/YUV 图像

<!-- Source EN PDF p.430; unit 4625 -->

Raw 专指未经图像处理的 CIS 输出。Bayer raw sensor 的 Raw 为 8/12/14 bit Bayer RGB 数据。通常在下列情况需获取 CIS Raw：

<!-- Source EN PDF p.430; unit 4626 -->

1\. ISP 处理后的 YUV 输出异常时，可动态截取进入 ISP 的 Raw，以分析是否为 CIS 问题。

2\. 调试图像质量效果前，需要采集 CIS Raw，用于模块参数校准。

<!-- Source EN PDF p.431; unit 4627 -->

#### 11.3.1 Raw 数据存储格式

<!-- Source EN PDF p.431; unit 4628 -->

11.3.1.1 非紧凑存储格式

<!-- Source EN PDF p.431; unit 4629 -->

以 4 字节内存片段为例，raw12 内存排列如下：

<!-- Source EN PDF p.431; unit 4630 -->

![英文原稿技术图 — PDF p.431](/docs/rockchip-isp30-development/assets/en-p431-X2199.png)

原图的可编辑转录（原图已有中文标签）：

| 内存 word 位 | Pixel | 像素位 |
|---|---|---|
| 31:20 | Pixel 0 | 11:0 |
| 19:16 | Pixel 0 | - - - - |
| 15:4 | Pixel 1 | 11:0 |
| 3:0 | Pixel 1 | - - - - |

<!-- Source EN PDF p.431; unit 4631 -->

11.3.1.2 紧凑存储格式

<!-- Source EN PDF p.431; unit 4632 -->

以 4 字节内存片段为例，raw12 内存排列如下：

<!-- Source EN PDF p.431; unit 4633 -->

![英文原稿技术图 — PDF p.431](/docs/rockchip-isp30-development/assets/en-p431-X2200.png)

原图的可编辑转录（原图已有中文标签）：

| 内存 word 位 | Pixel | 像素位 |
|---|---|---|
| 31:24 | Pixel3 | 7:0 |
| 23:12 | Pixel2 | 11:0 |
| 11:0 | Pixel1 | 11:0 |

<!-- Source EN PDF p.431; unit 4634 -->

11.3.1.3 RK-RAW V1.0

<!-- Source EN PDF p.431; unit 4635 -->

![英文原稿技术图 — PDF p.431](/docs/rockchip-isp30-development/assets/en-p431-X2201.png)

原图的可编辑转录（原图已有中文标签）：

| 参数名称 | 数据类型 | 长度（Byte） | 说明 |
|---|---|---|---|
| Identifier | unsigned short | 2 | 固定 0x8080 |
| Header length | unsigned short | 2 | 固定 128 |
| Frame index | unsigned int | 4 | 帧索引号 |
| Width | unsigned short | 2 | 图像宽度 |
| Height | unsigned short | 2 | 图像高度 |
| Bit depth | unsigned char | 1 | 图像位宽 |
| Bayer format | unsigned char | 1 | 0: BGGR; 1: GBRG; 2: GRBG; 3: RGGB |
| Number of HDR Frame | unsigned char | 1 | 1: 线性模式，短帧；2: 双帧 HDR，长+短；3: 三帧 HDR，长+中+短 |
| Current Frame type | unsigned char | 1 | 1 短帧；2 中帧；3 长帧 |
| Storage type | unsigned char | 1 | 0 紧凑；1 非紧凑 |
| Line stride | unsigned short | 2 | 单位字节 |
| Effective line stride | unsigned short | 2 | 单位字节 |
| Reserved | unsigned char | 107 | 保留 |
| RAW DATA | RAW | W * H * BPP | RAW DATA |

<!-- Source EN PDF p.432; unit 4636 -->

11.3.1.4 RK-RAW V2.0

<!-- Source EN PDF p.432; unit 4637 -->

RK-RAW V2.0 由开始标识、数据块、结束标识组成。

<!-- Source EN PDF p.432; unit 4638 -->

格式块定义

<!-- Source EN PDF p.432; unit 4639 -->

数据块由标识 ID、块长度、块数据三部分组成，每个 ID 有唯一固定值。

<!-- Source EN PDF p.432; unit 4640 -->

![英文原稿技术图 — PDF p.432](/docs/rockchip-isp30-development/assets/en-p432-X2208.png)

原图的可编辑转录（原图已有中文标签）：

| 项目 | 数据类型 | 长度（Byte） | 默认值 | 说明 |
|---|---|---|---|---|
| 起始标识符 | u16 | 2 | 0xFF00 | 文件起始 |
| 块标识符 | u16 | 2 | 0xFF01 | Raw 信息 |
| 块长度 | u32 | 4 | - |  |
| 块数据 |  |  |  |  |
| 块标识符 | u16 | 2 | 0xFF02 | Normal 模式 Raw 数据 |
| 块长度 | u32 | 4 | - |  |
| 块数据 |  |  |  |  |
| 块标识符 | u16 | 2 | 0xFF03 | HDR2/HDR3 短帧 Raw |
| 块长度 | u32 | 4 | - |  |
| 块数据 |  |  |  |  |
| 块标识符 | u16 | 2 | 0xFF04 | HDR2 长帧/HDR3 中帧 Raw |
| 块长度 | u32 | 4 | - |  |
| 块数据 |  |  |  |  |
| 块标识符 | u16 | 2 | 0xFF05 | HDR3 长帧 Raw |
| 块长度 | u32 | 4 | - |  |
| 块数据 |  |  |  |  |
| 块标识符 | u16 | 2 | 0xFF06 | 帧统计信息 |
| 块长度 | u32 | 4 | - |  |
| 块数据 |  |  |  |  |
| 块标识符 | u16 | 2 | 0xFF07 | ISP 寄存器格式 |
| 块长度 | u32 | 4 | - |  |
| 块数据 |  |  |  |  |
| 块标识符 | u16 | 2 | 0xFF08 | ISP 寄存器 |
| 块长度 | u32 | 4 | - |  |
| 块数据 |  |  |  |  |
| 块标识符 | u16 | 2 | 0xFF09 | ISPP 寄存器格式 |
| 块长度 | u32 | 4 | - |  |
| 块数据 |  |  |  |  |
| 块标识符 | u16 | 2 | 0xFF0a | ISPP 寄存器 |
| 块长度 | u32 | 4 | - |  |
| 块数据 |  |  |  |  |
| 块标识符 | u16 | 2 | 0xFF0b | 平台信息 |
| 块长度 | u32 | 4 | - |  |
| 块数据 |  |  |  |  |
| ... |  |  |  |  |
| 结束标识符 | u16 | 2 | 0x00FF | 文件结尾 |

<!-- Source EN PDF p.432; unit 4641 -->

图中并非所有块都必需，可选择组合。例如原文称文件可仅含“Raw Blocks”“Raw Blocks”“Frame Statistics Blocks”，并建议至少包含这三块才有意义；重复块名按原文保留，不能猜测替换。

<!-- Source EN PDF p.432; unit 4642 -->

Raw 块定义

<!-- Source EN PDF p.432; unit 4643 -->

![英文原稿技术图 — PDF p.432](/docs/rockchip-isp30-development/assets/en-p432-X2209.png)

原图的可编辑转录（原图已有中文标签）：

| 项目 | 数据类型 | 长度（Byte） | 默认值 | 说明 |
|---|---|---|---|---|
| 版本号 | u16 | 2 | 0x0200 | 0x0200=v2.0 |
| Sensor 名 | string | 32 | - | Sensor 型号 |
| 场景/光源 | string | 32 | - | 采集场景/光源 |
| 帧号 | u32 | 4 | - | 帧号 |
| 宽度 | u16 | 2 | - | 图像宽度，像素 |
| 高度 | u16 | 2 | - | 图像高度，像素 |
| 位宽 | u8 | 1 | - | 图像位宽 |
| Bayer 格式 | u8 | 1 | - | 0 BGGR; 1 GBRG; 2 GRBG; 3 RGGB |
| HDR 合成帧数 | u8 | 1 | - | 1 线性；2 长+短；3 长+中+短 |
| 存储格式 | u8 | 1 | - | 0 紧凑；1 非紧凑 |
| 行长 | u16 | 2 | - | 字节 |
| 有效行长 | u16 | 2 | - | 字节 |
| 大小端 | u8 | 1 | - | 0 大端；1 小端 |

<!-- Source EN PDF p.432; unit 4644 -->

RAW 块定义

<!-- Source EN PDF p.433; unit 4645 -->

该段可存 Raw 图像数据，或指向数据的 buffer fd/虚拟地址。使用 API 时须通过参数指明块内数据类型，详见 rk_aiq_rawbuf_type_t。

<!-- Source EN PDF p.433; unit 4646 -->

![英文原稿技术图 — PDF p.433](/docs/rockchip-isp30-development/assets/en-p433-X2213.png)

原图的可编辑转录（原图已有中文标签）：

| 项目 | 数据类型 | 长度（Byte） | 说明 |
|---|---|---|---|
| Raw 数据 | - | 长*宽*N；非紧凑 N=2；紧凑 N=bpp/8 | Raw 数据，0xFF02–0xFF05 |

<!-- Source EN PDF p.433; unit 4647 -->

帧统计块定义

<!-- Source EN PDF p.433; unit 4648 -->

![英文原稿技术图 — PDF p.433](/docs/rockchip-isp30-development/assets/en-p433-X2214.png)

原图的可编辑转录（原图已有中文标签）：

| 项目 | 数据类型 | 长度（Byte） | 默认值 | 说明 |
|---|---|---|---|---|
| 版本号 | u16 | 2 | 0x0200 | Raw: 0x0200=v2.0 |
| 帧号 | u32 | 4 | - | 帧号 |
| Normal_Exp | float | 4 | - | 线性模式快门时间 |
| Normal_Gain | float | 4 | - | 线性曝光增益 |
| Normal_Exp_REG | u32 | 4 | - | 线性快门 SENSOR 寄存器 |
| Normal_Gain_REG | u32 | 4 | - | 线性增益 SENSOR 寄存器 |
| HDR_Exp_L | float | 4 | - | HDR3 长帧快门时间 |
| HDR_Gain_L | float | 4 | - | HDR3 长帧增益 |
| HDR_Exp_L_REG | u32 | 4 | - | HDR3 长帧快门 SENSOR 寄存器 |
| HDR_Gain_L_REG | u32 | 4 | - | HDR3 长帧增益 SENSOR 寄存器 |
| HDR_Exp_M | float | 4 | - | HDR3 中帧/HDR2 长帧快门时间 |
| HDR_Gain_M | float | 4 | - | HDR3 中帧/HDR2 长帧增益 |
| HDR_Exp_M_REG | u32 | 4 | - | HDR3 中帧/HDR2 长帧快门 SENSOR 寄存器 |
| HDR_Gain_M_REG | u32 | 4 | - | HDR3 中帧/HDR2 长帧快门 SENSOR 寄存器（原图如此，字段名为 Gain，待核对） |
| HDR_Exp_S | float | 4 | - | HDR3/HDR2 短帧快门时间 |
| HDR_Gain_S | float | 4 | - | HDR3/HDR2 短帧增益 |
| HDR_Exp_S_REG | u32 | 4 | - | HDR3/HDR2 短帧快门 SENSOR 寄存器 |
| HDR_Gain_S_REG | u32 | 4 | - | HDR3/HDR2 短帧快门 SENSOR 寄存器（原图如此，字段名为 Gain，待核对） |
| AWB_Rgain | float | 4 | - | 白平衡增益 |
| AWB_Bgain | float | 4 | - | 白平衡增益 |

<!-- Source EN PDF p.433; unit 4649 -->

寄存器格式块定义

<!-- Source EN PDF p.433; unit 4650 -->

![英文原稿技术图 — PDF p.433](/docs/rockchip-isp30-development/assets/en-p433-X2215.png)

原图的可编辑转录（原图已有中文标签）：

| 项目 | 数据类型 | 长度（Byte） | 默认值 | 说明 |
|---|---|---|---|---|
| 版本号 | u16 | 2 | 0x0200 | 0x0200=v2.0 |
| 帧号 | u32 | 4 | - | 寄存器基地址（原图如此） |
| 基地址 | u32 | 4 | - | 寄存器基地址 |
| 偏移地址 | u32 | 4 | - | 起始偏移地址 |
| 数目 | u32 | 4 | - | 寄存器数目 |

<!-- Source EN PDF p.433; unit 4651 -->

寄存器块定义

<!-- Source EN PDF p.433; unit 4652 -->

![英文原稿技术图 — PDF p.433](/docs/rockchip-isp30-development/assets/en-p433-X2216.png)

原图的可编辑转录（原图已有中文标签）：

| 项目 | 数据类型 | 长度（Byte） | 说明 |
|---|---|---|---|
| 寄存器数据 | - | - | 寄存器数据，0xFF08/0xFF0a |

<!-- Source EN PDF p.433; unit 4653 -->

平台信息块定义

<!-- Source EN PDF p.433; unit 4654 -->

![英文原稿技术图 — PDF p.433](/docs/rockchip-isp30-development/assets/en-p433-X2217.png)

原图的可编辑转录（原图已有中文标签）：

| 项目 | 数据类型 | 长度（Byte） | 说明 |
|---|---|---|---|
| 芯片型号 | string | 32 |  |
| ISP 版本 | string | 32 |  |
| AIQ 版本 | string | 32 |  |

<!-- Source EN PDF p.434; unit 4655 -->

#### 11.3.2 Raw/YUV 数据获取方法

<!-- Source EN PDF p.435; unit 4656 -->

## 12. 错误码

<!-- Source EN PDF p.435; unit 4657 -->

| 错误码 | 说明 |
|---|---|
| 0 | 成功 |
| -1 | 失败 |
| -2 | 参数无效 |
| -3 | 内存不足 |
| -4 | 文件操作失败 |
| -5 | 分析器模块错误 |
| -6 | ISP 模块错误 |
| -7 | sensor 驱动错误 |
| -8 | 线程操作错误 |
| -9 | IOCTL 操作错误 |
| -10 | 时序错误 |
| -20 | 超时 |
| -21 | 超出范围 |
| -255 | 未知错误 |

<!-- Source EN PDF p.436; unit 4658 -->

## 13.   Abbreviations

<!-- Source EN PDF p.436; unit 4659 -->

| 缩写 | 全称 |
|---|---|
| CIS | 摄像头图像传感器（Camera Image Sensor） |
| RkAiq | Rockchip 自动图像质量（Rockchip Automatical Image Quality，原文拼写） |
| ISP | 图像信号处理（Image Signal Process，原文全称） |
| IQ 调优 | 图像质量调优 |

{% endraw %}
