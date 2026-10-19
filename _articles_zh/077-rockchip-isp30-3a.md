---
title: "Rockchip ISP30 自定义 3A 开发完整指南：AE、AWB、AF 接口与统计"
description: "完整整理 RK3588 Linux 5.10 的自定义 3A 注册、AE/AWB 回调和数据结构、AF 统计与滤波配置及全部示例。"
translation_key: "077-rockchip-isp30-3a"
slug: "077-rockchip-isp30-3a"
lang: "zh"
date: "2026-10-19"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "camera"
products: []
tags: ["Rockchip", "ISP30", "RK3588", "3A", "AE", "AWB", "AF"]
keywords: "ArmSoM Rockchip ISP30 RK3588 3A AE AWB AF"
excerpt: "完整整理 RK3588 Linux 5.10 的自定义 3A 注册、AE/AWB 回调和数据结构、AF 统计与滤波配置及全部示例。"
---

{% raw %}

# Rockchip ISP30 自定义 3A 开发完整指南：AE、AWB、AF 接口与统计

本文完整整理 46 页英文 V1.1.0 原稿的技术正文（PDF p.5–46），并制作完整中文和俄文译文。没有对应中文 PDF，三语均使用英文 PDF 的 14 张独立原图，原图已有中文界面/标签如实保留。代码、注释、API、参数、寄存器值及示例常量保持来源文本，图注和自然语言说明本地化。

原文产品范围及系统支持状态见下表；这些是原文记录，不是当前所有版本的兼容性结论。本篇仅作 ArmSoM 平台参考，须核对实际板卡、RK3588、Sensor/VCM、ISP30、SDK/BSP、AIQ 及内核版本；未进行 ArmSoM 硬件验证。不能将 RK 库与定制库混合运行说明扩展到未经核实的版本。曝光、增益、对焦和马达控制可能改变采集效果或硬件状态；未执行任何代码、设备配置或马达操作。

**原文疑点**：部分接口描述和标题重复、`uapi` 与 `uapi2` 名称混用、ISP32 交叉引用、两项表格说明乱码以及若干窗口参数冲突均保留并注明；代码是原稿示例，不保证可直接编译。详见校对记录。

| SoC | 内核 |
|---|---|
| RK3588 | Linux 5.10 |

| SoC | BuildRoot | Debian | Yocto | Android |
|---|---|---|---|---|
| RK3588 | Y | N | N | Y |

原文与适配疑点见
[EDITORIAL-NOTES](/docs/rockchip-isp30-3a/EDITORIAL-NOTES.md). [ArmSoM](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source EN PDF p.5, block 0 -->

## 1 概述

<!-- Source EN PDF p.5, block 1 -->

本文主要介绍 3A 库的实现，指导用户实现定制的 3A 算法库。

<!-- Source EN PDF p.5, block 2 -->

3A 算法库依赖 AIQ。AIQ 已包含 RK 的 3A 算法库，并默认启用。用户可按需要依据本文实现定制的 3A 库。

<!-- Source EN PDF p.5, block 3 -->

### 1.1 设计思路

<!-- Source EN PDF p.5, block 4 -->

基本设计思路如下图：

<!-- Source EN PDF p.5, block 5 -->

![英文原稿技术图, PDF p.5](/docs/rockchip-isp30-3a/assets/en-p05-figure1.png)

*英文原稿技术图, PDF p.5.*

<!-- Source EN PDF p.5, block 6 -->

通过注册将 3A 库注册到 ISP 库。注意，RK 的 3A 库已隐式注册，用户无需显式注册。

<!-- Source EN PDF p.5, block 7 -->

3A 库注册到 ISP 库后，ISP 库从驱动取得 3A 统计数据，再回调 3A 库接口获得新的 3A 参数，最后由 ISP 库将新参数设置到驱动。

<!-- Source EN PDF p.5, block 8 -->

### 1.2 文件组织

<!-- Source EN PDF p.5, block 9 -->

文件组织如下图：

<!-- Source EN PDF p.6, block 10 -->

![英文原稿技术图, PDF p.6](/docs/rockchip-isp30-3a/assets/en-p06-figure1.png)

*英文原稿技术图, PDF p.6.*

<!-- Source EN PDF p.6, block 11 -->

ISP 固件分为应用层 librkaiq.so 和驱动层。驱动层包括 ISP 驱动以及 Sensor、VCM、Flashlight 等外设驱动。

<!-- Source EN PDF p.6, block 12 -->

librkaiq.so 包含 3A、HDR 等多个算法库。这些算法库以静态库形式存在，最终链接成 librkaiq.so。除了不提供源码的 librkaiq_ae/awb/af.a 3A 库，其他基础库源码均开放。

<!-- Source EN PDF p.6, block 13 -->

框架支持的所有模块算法库均可使用客户算法；但通常除需要定制的 3A 库外，其他基础库可使用 RK 提供的默认库。

<!-- Source EN PDF p.6, block 14 -->

### 1.3 开发模式

<!-- Source EN PDF p.6, block 15 -->

支持以下三种开发模式：

<!-- Source EN PDF p.6, block 16 -->

3A 库使用 RK 库。此时可使用 RK 的 3A 库 API，包括 rk_aiq_user_api2_ae.h、rk_aiq_user_api2_af.h 和 rk_aiq_user_api2_awb.h。

<!-- Source EN PDF p.6, block 17 -->

3A 库一部分使用 RK 库，另一部分使用自定义库。例如 AE 使用自定义库，AWB 使用 RK 库。

<!-- Source EN PDF p.6, block 18 -->

自定义 3A 库与 RK 库同时使用。例如 AE 自定义库与 RK 库同时运行时，先运行 RK AE 库，再运行自定义 AE 库；自定义库结果覆盖 RK AE 库结果。该模式用于简化自定义库开发：自定义库不必输出 AIQ 框架所需的全部结果，部分结果可由 RK AE 库提供。

<!-- Source EN PDF p.7, block 19 -->

### 1.4 软件流程

<!-- Source EN PDF p.7, block 20 -->

#### 1.4.1 基本流程

<!-- Source EN PDF p.7, block 21 -->

RK 3A 算法已在 AIQ 框架内部隐式注册，用户无需显式注册。下面以自定义 AE 算法注册为例，给出伪代码：

<!-- Source EN PDF p.7, block 22 -->

```text
// Initialize the usage scenario, not required, defaults to normal, day, which is used to select scene parameters in the JSON IQ file
if (work_mode == RK_AIQ_WORKING_MODE_NORMAL)
        ret = rk_aiq_uapi2_sysctl_preInit_scene(sns_entity_name, "normal",
"day");
  else
        ret = rk_aiq_uapi2_sysctl_preInit_scene(sns_entity_name, "hdr", "day");
// Depending on whether the usage pattern is surround view or single camera, initialize Group Ctx or AIQ ctx
   if (!group_mode)
        ctx->aiq_ctx = rk_aiq_uapi2_sysctl_init(sns_entity_name, ctx->iqpath,
NULL, NULL);
  else {
       rk_aiq_camgroup_instance_cfg_t camgroup_cfg;
       memset(&camgroup_cfg, 0, sizeof(camgroup_cfg));
       camgroup_cfg.sns_num = 1;
       camgroup_cfg.sns_num++;
       camgroup_cfg.sns_ent_nm_array[0] = sns_entity_name;
       camgroup_cfg.sns_ent_nm_array[1] = sns_entity_name2;
       camgroup_cfg.config_file_dir = ctx->iqpath;
       camgroup_cfg.overlap_map_file = "srcOverlapMap.bin";
       ctx->camgroup_ctx = rk_aiq_uapi2_camgroup_create(&camgroup_cfg);
  }
// If you need to register a custom AE algorithm, register a custom AE callback
  rk_aiq_customeAe_cbs_t cbs = {
                           .pfn_ae_init = custom_ae_init,
                           .pfn_ae_run = custom_ae_run,
                           .pfn_ae_ctrl = custom_ae_ctrl,
                           .pfn_ae_exit = custom_ae_exit,
                       };
  rk_aiq_uapi2_customAE_register((const rk_aiq_sys_ctx_t*)(ctx->camgroup_ctx),
&cbs);
// If you need to run a third-party AE algorithm, enable the custom AE algorithm. Third-party AE library registration interface, single camera and surround view shared.
//In the current AIQ version, both the default RK algorithm and the third-party algorithm will run, and if necessary, you can call rk_aiq_uapi2_sysctl_enableAxlib to force off RK AE.
  rk_aiq_uapi2_customAE_enable((const rk_aiq_sys_ctx_t*)(ctx->camgroup_ctx),
true);
// Prepare the ISP pipeline and configure initialization parameters such as ISP and Sensor
// If necessary, you can call the module API before prepare to modify the module initialization parameters, otherwise the initialization parameters are specified by the IQ file, or are specified by hard code in AIQ, or the chip reset value
 if (!group_mode) {
      rk_aiq_uapi2_sysctl_prepare(ctx->aiq_ctx, ctx->width, ctx->height,
work_mode);
      rk_aiq_uapi2_sysctl_start(ctx->aiq_ctx );
 } else {
      rk_aiq_uapi2_camgroup_prepare(ctx->camgroup_ctx, work_mode);
      ret = rk_aiq_uapi2_camgroup_start(ctx->camgroup_ctx);
 }
// Turn on the VI data flow and note that no AIQ library interfaces are called in this section.
start_capturing(ctx);
......
// AIQ internal thread loop work: obtain 3A statistics from the driver, call each algorithm library to calculate new ISP parameters, sensor parameters, etc., and issue new parameters to ISP drivers and sensor drivers.
// This procedure calls the API to set parameters for each algorithm module
......
// Stop the data flow first on exit
stop_capturing(ctx);
// Stop AIQ ctx or Group ctx
 if (!group_mode)
       rk_aiq_uapi2_sysctl_stop(ctx->aiq_ctx, false);
else
       rk_aiq_uapi2_camgroup_stop(ctx->camgroup_ctx);
// Anti-register third-party AEs
 rk_aiq_uapi2_customAE_unRegister(ctx->aiq_ctx);
// Deinitialize AIQ ctx or Group ctx
 if (!group_mode)
        rk_aiq_uapi2_sysctl_deinit(ctx->aiq_ctx);
else
       rk_aiq_uapi2_camgroup_destroy(ctx->camgroup_ctx);
```

<!-- Source EN PDF p.8, block 24 -->

#### 1.4.2 内部运行流程

<!-- Source EN PDF p.8, block 25 -->

AIQ 内部运行如下图：

<!-- Source EN PDF p.9, block 26 -->

![英文原稿技术图, PDF p.9](/docs/rockchip-isp30-3a/assets/en-p09-figure1.png)

*英文原稿技术图, PDF p.9.*

<!-- Source EN PDF p.9, block 27 -->

获取统计线程：持续从 ISP 驱动取得 3A 统计数据，并发送给 3A 计算线程。

<!-- Source EN PDF p.9, block 28 -->

3A 计算线程：收到统计数据后，开始调用模块算法（包括 第三方算法回调），计算新参数，再将新参数发送给 ISP 参数设置线程和 SOF 线程。

<!-- Source EN PDF p.9, block 30 -->

ISP 参数设置线程：收到新的 ISP 参数设置请求后，在适当时机将请求发送到 ISP 驱动。

<!-- Source EN PDF p.9, block 31 -->

SOF 线程：这是 Sensor 帧头事件的响应函数，接收新的曝光设置请求，从队列取出新的曝光参数设置并交给 Sensor 驱动。

<!-- Source EN PDF p.10, block 32 -->

## 2 开发指南

<!-- Source EN PDF p.10, block 33 -->

### 2.1 AE 算法注册

<!-- Source EN PDF p.10, block 34 -->

AE 算法注册流程包括注册、使能和注销：调用 rk_aiq_uapi_customAE_register 注册，调用 rk_aiq_uapi_customAE_enable 使能，调用 rk_aiq_uapi_customAE_unRegister 注销（本段接口名按原文保留，后文原型带 uapi2）。

<!-- Source EN PDF p.10, block 35 -->

#### 2.1.1 rk_aiq_uapi2_customAE_register

<!-- Source EN PDF p.10, block 36 -->

【说明】注册 AE 算法库。

<!-- Source EN PDF p.10, block 37 -->

【语法】

<!-- Source EN PDF p.10, block 38 -->

```text
XCamReturn
rk_aiq_uapi2_customAE_register(const rk_aiq_sys_ctx_t* ctx,
rk_aiq_customeAe_cbs_t* cbs)
```

<!-- Source EN PDF p.10, block 39 -->

【参数】

<!-- Source EN PDF p.10, block 40 -->

| 参数名 | 说明 | 输入/输出 |
|---|---|---|
| ctx | 单摄与环视应用的 AIQ 上下文指针 | 输入 |
| cbs | 回调函数指针 |  |

<!-- Source EN PDF p.10, block 41 -->

【返回值】

<!-- Source EN PDF p.10, block 42 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.11, block 43 -->

#### 2.1.2 rk_aiq_uapi2_customAE_enable

<!-- Source EN PDF p.11, block 44 -->

【说明】注册 AE 算法库。

<!-- Source EN PDF p.11, block 45 -->

【语法】

<!-- Source EN PDF p.11, block 46 -->

```text
XCamReturn
rk_aiq_uapi2_customAE_enable(const rk_aiq_sys_ctx_t* ctx, bool enable);
```

<!-- Source EN PDF p.11, block 47 -->

【参数】

<!-- Source EN PDF p.11, block 48 -->

| 参数名 | 说明 | 输入/输出 |
|---|---|---|
| ctx | 单摄与环视应用的 AIQ 上下文指针 | 输入 |
| enable | AE 算法使能位 | 输入 |

<!-- Source EN PDF p.11, block 49 -->

【返回值】

<!-- Source EN PDF p.11, block 50 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.11, block 51 -->

#### 2.1.3 rk_aiq_uapi2_customAE_unRegister

<!-- Source EN PDF p.11, block 52 -->

【说明】注册 AE 算法库。

<!-- Source EN PDF p.11, block 53 -->

【语法】

<!-- Source EN PDF p.11, block 54 -->

```text
XCamReturn
rk_aiq_uapi2_customAE_unRegister(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.11, block 55 -->

【参数】

<!-- Source EN PDF p.11, block 56 -->

| 参数名 | 说明 | 输入/输出 |
|---|---|---|
| ctx | 单摄与环视应用的 AIQ 上下文指针 | 输入 |

<!-- Source EN PDF p.11, block 57 -->

【返回值】

<!-- Source EN PDF p.12, block 58 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.12, block 59 -->

#### 2.1.4 回调函数与数据类型

<!-- Source EN PDF p.12, block 60 -->

用户需要在自行开发的自定义 AE 库中实现以下回调函数：

<!-- Source EN PDF p.12, block 61 -->

```text
rk_aiq_customeAe_cbs_t cbs = {
.pfn_ae_init = custom_ae_init,
.pfn_ae_run = custom_ae_run,
.pfn_ae_ctrl = custom_ae_ctrl,
.pfn_ae_exit = custom_ae_exit,
};
```

<!-- Source EN PDF p.12, block 62 -->

| 成员名 | 说明 |
|---|---|
| pfn_ae_init | 初始化 AE 的回调函数指针 |
| pfn_ae_run | 运行 AE 的回调函数指针 |
| pfn_ae_ctrl | 控制 AE 内部状态的回调函数指针（此参数暂时无效） |
| pfn_ae_exit | 销毁 AE 的回调函数指针 |

<!-- Source EN PDF p.12, block 63 -->

##### 2.1.4.1 custom_ae_init

<!-- Source EN PDF p.12, block 64 -->

【说明】初始化 AE 算法库。

<!-- Source EN PDF p.12, block 65 -->

【语法】

<!-- Source EN PDF p.12, block 66 -->

```text
int32_t custom_ae_init(void* ctx);
```

<!-- Source EN PDF p.12, block 67 -->

【参数】

<!-- Source EN PDF p.12, block 68 -->

| 参数名 | 说明 | 输入/输出 |
|---|---|---|
| ctx | 单摄与环视应用的 AIQ 上下文指针 | 输入 |

<!-- Source EN PDF p.12, block 69 -->

【返回值】

<!-- Source EN PDF p.13, block 70 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.13, block 71 -->

##### 2.1.4.2 custom_ae_run

<!-- Source EN PDF p.13, block 72 -->

【说明】运行 AE 算法库，计算 Sensor 曝光时间和增益、ISP 数字增益，并更新硬件配置参数。

<!-- Source EN PDF p.13, block 73 -->

【语法】

<!-- Source EN PDF p.13, block 74 -->

```text
int32_t custom_ae_run(void* ctx, const rk_aiq_customAe_stats_t* pstAeInfo,
                      rk_aiq_customeAe_results_t* pstAeResult);
```

<!-- Source EN PDF p.13, block 75 -->

【参数】

<!-- Source EN PDF p.13, block 76 -->

| 参数名 | 说明 | 输入/输出 |
|---|---|---|
| ctx | 单摄与环视应用的 AIQ 上下文指针 | 输入 |
| pstAeInfo | 输入数据参数指针，包含 AE 硬件统计及与其同步的曝光信息；输入 |  |
| pstAeResult | 输出算法结果指针，包含 Sensor 曝光结果参数及更新的硬件配置参数 | 输出 |

<!-- Source EN PDF p.13, block 77 -->

【返回值】

<!-- Source EN PDF p.13, block 78 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.13, block 79 -->

##### 2.1.4.3 custom_ae_ctrl

<!-- Source EN PDF p.13, block 80 -->

【说明】改变算法库内部状态，暂不可用。

<!-- Source EN PDF p.13, block 81 -->

【语法】

<!-- Source EN PDF p.13, block 82 -->

```text
int32_t custom_ae_ctrl(void* ctx, uint32_t u32Cmd, void *pValue);
```

<!-- Source EN PDF p.13, block 83 -->

【参数】

<!-- Source EN PDF p.14, block 84 -->

| 参数名 | 说明 | 输入/输出 |
|---|---|---|
| ctx | 单摄与环视应用的 AIQ 上下文指针 | 输入 |

<!-- Source EN PDF p.14, block 85 -->

【返回值】

<!-- Source EN PDF p.14, block 86 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.14, block 87 -->

##### 2.1.4.4 custom_ae_exit

<!-- Source EN PDF p.14, block 88 -->

【说明】注销 AE 算法库。

<!-- Source EN PDF p.14, block 89 -->

【语法】

<!-- Source EN PDF p.14, block 90 -->

```text
int32_t custom_ae_exit(void* ctx)；
```

<!-- Source EN PDF p.14, block 91 -->

【参数】

<!-- Source EN PDF p.14, block 92 -->

| 参数名 | 说明 | 输入/输出 |
|---|---|---|
| ctx | 单摄与环视应用的 AIQ 上下文指针 | 输入 |

<!-- Source EN PDF p.14, block 93 -->

【返回值】

<!-- Source EN PDF p.14, block 94 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.14, block 95 -->

#### 2.1.5 输入数据参数

<!-- Source EN PDF p.14, block 96 -->

【说明】

<!-- Source EN PDF p.14, block 97 -->

第三方 AE 输入数据包括图像亮度统计及对应曝光参数值，兼容单摄与环视应用。【定义】

<!-- Source EN PDF p.15, block 98 -->

```text
#define RK_AIQ_MAX_HDR_FRAME (3)
typedef struct rk_aiq_customAe_stats_s
{
    //hw stats
    Aec_Stat_Res_t rawae_stat[RK_AIQ_MAX_HDR_FRAME]; // before awb gain
    Aec_Stat_Res_t extra; // after awb gain, lsc, TMO
    //exposure
    RkAiqExpParamComb_t linear_exp;
    RkAiqExpParamComb_t hdr_exp[RK_AIQ_MAX_HDR_FRAME];
    struct rk_aiq_customAe_stats_s* next; // for surround view(multiple cams)
} rk_aiq_customAe_stats_t;
```

<!-- Source EN PDF p.15, block 99 -->

【成员】

<!-- Source EN PDF p.15, block 100 -->

| 成员名 | 说明 |
|---|---|
| rawae_stat[RK_AIQ_MAX_HDR_FRAME] | 基于 RAW 图像的前级硬件统计，最多统计 3 帧。线性曝光仅 rawae_stat[0] 有效；HDR 模式下 rawae_stat[0-2] 分别表示短、中、长帧统计。 |
| extra | 基于 RAW 的后级硬件统计；HDR 模式表示合成帧统计。 |
| linear_exp | 线性模式曝光参数，与硬件统计同步。 |
| hdr_exp[RK_AIQ_MAX_HDR_FRAME] | HDR 曝光参数，与硬件统计同步；0~2 分别为短、中、长帧曝光参数。 |
| next | 仅环视多摄有效；指向下一摄像头输入数据，各摄像头对应输入成员相同。 |

<!-- Source EN PDF p.15, block 101 -->

【说明】

<!-- Source EN PDF p.15, block 102 -->

输入数据参数分为图像硬件统计数据和该图像对应的曝光参数两类。

<!-- Source EN PDF p.15, block 103 -->

输入参数兼容单摄与环视多摄应用，可通过 next 指针获取多摄数据。

<!-- Source EN PDF p.15, block 104 -->

图像硬件统计数据类型为 Aec_Stat_Res_t，曝光信息类型为 RkAiqExpParamComb_t，详细类型说明见 Rockchip_Development_Guide_ISP30。

<!-- Source EN PDF p.15, block 105 -->

RK_AIQ_MAX_HDR_FRAME 表示 RK 最多支持 3 帧 HDR。

<!-- Source EN PDF p.16, block 106 -->

#### 2.1.6 输出算法结果参数

<!-- Source EN PDF p.16, block 107 -->

【说明】

<!-- Source EN PDF p.16, block 108 -->

第三方 AE 输出包括曝光参数、硬件参数等，兼容单摄与环视应用。

<!-- Source EN PDF p.16, block 109 -->

【定义】

<!-- Source EN PDF p.16, block 110 -->

```text
#define RK_AIQ_MAX_HDR_FRAME (3)
typedef struct rk_aiq_i2c_data_s {
    bool bValid;
    unsigned int nNumRegs;
    unsigned int* pRegAddr;
    unsigned int* pRegValue;
    unsigned int* pDelayFrames;
} rk_aiq_i2c_data_t;
typedef struct rk_aiq_customeAe_results_singel_s
{
    //exposure result (including:reg value & real value)
    RkAiqExpParamComb_t linear_exp;
    RkAiqExpParamComb_t hdr_exp[RK_AIQ_MAX_HDR_FRAME];
    rk_aiq_i2c_data_t exp_i2c_params;
    //hw result
    struct window meas_win;
    unsigned char meas_weight[15 * 15];
    struct rk_aiq_customeAe_results_singel_s* next; // for surround view(multiple
cams)
} rk_aiq_customeAe_results_single_t;
typedef struct rk_aiq_customeAe_results_s
{
    //exposure result (including:reg value & real value)
    RkAiqExpParamComb_t linear_exp;
    RkAiqExpParamComb_t hdr_exp[RK_AIQ_MAX_HDR_FRAME];
    rk_aiq_i2c_data_t exp_i2c_params;
    //hw result
    struct window meas_win;
    unsigned char meas_weight[15 * 15];
    RkAiqIrisParamComb_t Iris;
    uint32_t frame_length_lines;
    bool is_longfrm_mode;
    struct rk_aiq_customeAe_results_singel_s* next; // for surround view(multiple
cams)
} rk_aiq_customeAe_results_t;
```

<!-- Source EN PDF p.16, block 111 -->

【成员】

<!-- Source EN PDF p.17, block 112 -->

| 成员名 | 子成员 | 说明 |
|---|---|---|
| linear_exp | exp_real_params<br>exp_sensor_params | 线性曝光参数，包括实际曝光值 exp_real_params 和 RK 格式寄存器值 exp_sensor_params。 |
| hdr_exp[RK_AIQ_MAX_HDR_FRAME] | exp_real_params<br>exp_sensor_params | HDR 曝光参数，包括实际值 exp_real_params 与 RK 格式寄存器值 exp_sensor_params。0~2 分别为短、中、长帧；HDR2 合成时 0、1 有效，HDR3 时 0–2 有效。 |
| exp_i2c_params | bValid nNumRegs<br>pRegAddr<br>pRegValue<br>pDelayFrames | bValid 为 true 时使用 exp_i2c_params 设置 I2C 寄存器值；false 时使用上述 linear_exp 或 hdr_exp 中的 RK 格式寄存器参数。 |
| frame_length_lines |  | Sensor 的 VTS 值，与帧率设置相关。 |
| is_longfrm_mode |  | 长帧模式使能位：true 启用，false 关闭；仅 HDR 模式有效。 |
| Iris | PIris DCIris | 光圈设置参数，包括 P 光圈与 DC 光圈。 |
| meas_win | h_offs<br>v_offs<br>h_size<br>v_size | 硬件统计窗口区域。h/v_offs 为窗口左上角相对感光区域左上角的水平/垂直偏移；h/v_size 为窗口水平/垂直尺寸。 |
| meas_weight |  | 硬件统计权重，包含 15X15 个参数，范围 0~32。 |
| next |  | 非环视时指针应为空。环视各摄像头使用相同结果时也为空，仅设置 rk_aiq_customeAe_results_t，所有摄像头采用该结果；使用不同结果时，为 next 分配内存并添加下一摄像头算法结果。 |

<!-- Source EN PDF p.18, block 114 -->

【注意事项】

<!-- Source EN PDF p.18, block 115 -->

输出算法结果兼容单摄与环视多摄应用；环视应用既可使用一组算法结果，也可使用多组结果。

<!-- Source EN PDF p.18, block 116 -->

meas_win 为 AE 硬件统计的窗口区域参数；分块亮度、直方图等统计按该区域展开。HDR 多帧曝光应用中，默认各帧采用相同统计窗口。

<!-- Source EN PDF p.18, block 117 -->

meas_weight 为加权直方图统计所需的权重参数，通常与计算分块亮度加权均值时使用的软件权重一致。

<!-- Source EN PDF p.18, block 118 -->

设置曝光时，应同时配置实际曝光值及相应寄存器值。供其他算法模块使用的实际值包括曝光时间（秒）、曝光增益（倍数）、DCG 状态（0:LCG，1:HCG）。曝光寄存器值对接 Sensor，支持 RK 格式与第三方格式。

<!-- Source EN PDF p.18, block 119 -->

RK 格式的曝光寄存器值不需要客户设置，内部会按实际曝光值转换；exp_i2c_params 中 bValid 应为 false。第三方格式需用户设置所需寄存器值及对应地址，bValid 应为 true。

<!-- Source EN PDF p.18, block 120 -->

环视应用中，如果所有摄像头使用相同曝光与硬件值，只设置 rk_aiq_customeAe_results_t，next 为空；如果各摄像头需要不同曝光和硬件配置，则按顺序设置结果，并分配内存，使 next 指向下一摄像头的结果。注意 rk_aiq_customeAe_results_t 与 rk_aiq_customeAe_results_single_t 参数不同：前者多出个别结果参数，作为公共参数，默认所有摄像头设置为相同值。

<!-- Source EN PDF p.19, block 121 -->

图像硬件统计类型为 Aec_Stat_Res_t，RK 曝光信息类型为 RkAiqExpParamComb_t，RK 光圈参数类型为 RkAiqIrisParamComb_t。详见 Rockchip_Development_Guide_ISP30。

<!-- Source EN PDF p.19, block 122 -->

### 2.2 AWB 算法注册

<!-- Source EN PDF p.19, block 123 -->

RK AWB 算法提供 rk_aiq_uapi_customAWB_register 注册函数。用户调用它将自定义 AWB 注册到 ISP，示例与 AE 算法库注册类似；通过 rk_aiq_uapi_customAWB_enable 启用自定义 AWB。

<!-- Source EN PDF p.19, block 124 -->

注意：为顺利移植，建议先阅读：

<!-- Source EN PDF p.19, block 125 -->

(1) Rockchip_Color_Optimization_Guide 的下列内容：

<!-- Source EN PDF p.19, block 126 -->

(a) “2 AWB/2.1 功能说明”及 AWB 流程图。

<!-- Source EN PDF p.19, block 127 -->

(b) “2 AWB/2.2 关键参数/硬件白点检测流程”中的 AWB 白点检测流程图。

<!-- Source EN PDF p.19, block 128 -->

(2) Rockchip_Development_Guide_ISP30 的“统计数据/数据类型/rk_aiq_isp_awb_stats2_v3x_t”章节。

<!-- Source EN PDF p.19, block 129 -->

#### 2.2.1 API

<!-- Source EN PDF p.19, block 130 -->

##### 2.2.1.1 rk_aiq_uapi_customAWB_register

<!-- Source EN PDF p.19, block 131 -->

【说明】注册自定义 AWB 算法。

<!-- Source EN PDF p.19, block 132 -->

【语法】

<!-- Source EN PDF p.19, block 133 -->

```text
XCamReturn
rk_aiq_uapi_customAWB_register(const rk_aiq_sys_ctx_t* ctx,
rk_aiq_customeAwb_cbs_t* cbs);
```

<!-- Source EN PDF p.19, block 134 -->

【参数】

<!-- Source EN PDF p.19, block 135 -->

| 参数名 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| cbs | 自定义 AWB 向 ISP 库注册的回调函数，见下文 rk_aiq_customeAwb_cbs_t；输入。 |  |

<!-- Source EN PDF p.19, block 136 -->

【返回值】

<!-- Source EN PDF p.20, block 137 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.20, block 138 -->

【注意】

<!-- Source EN PDF p.20, block 139 -->

必须先调用 rk_aiq_uapi_sysctl_init 初始化 AIQ 上下文指针 ctx。

<!-- Source EN PDF p.20, block 140 -->

【要求】

<!-- Source EN PDF p.20, block 141 -->

头文件：rk_aiq_user_api_custom_awb.h

<!-- Source EN PDF p.20, block 142 -->

库文件：librkaiq.so

<!-- Source EN PDF p.20, block 143 -->

##### 2.2.1.2 rk_aiq_uapi_customAWB_enable

<!-- Source EN PDF p.20, block 144 -->

【说明】启用自定义 AWB 算法。

<!-- Source EN PDF p.20, block 145 -->

【语法】

<!-- Source EN PDF p.20, block 146 -->

```text
XCamReturn
rk_aiq_uapi_customAWB_enable(const rk_aiq_sys_ctx_t* ctx, bool enable);
```

<!-- Source EN PDF p.20, block 147 -->

【参数】

<!-- Source EN PDF p.20, block 148 -->

| 参数名 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |
| enable | 自定义 AWB 使能开关；取值 true / false；默认 false。 | 输入 |

<!-- Source EN PDF p.20, block 149 -->

【返回值】

<!-- Source EN PDF p.20, block 150 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.20, block 151 -->

【注意】

<!-- Source EN PDF p.20, block 152 -->

在 rk_aiq_uapi_customAWB_register 完成自定义 AWB 注册后调用。

<!-- Source EN PDF p.20, block 153 -->

【要求】

<!-- Source EN PDF p.20, block 154 -->

头文件：rk_aiq_user_api_custom_awb.h

<!-- Source EN PDF p.20, block 155 -->

库文件：librkaiq.so

<!-- Source EN PDF p.21, block 156 -->

##### 2.2.1.3 rk_aiq_uapi_customAWB_unRegister

<!-- Source EN PDF p.21, block 157 -->

【说明】注销自定义 AWB 算法。

<!-- Source EN PDF p.21, block 158 -->

【语法】

<!-- Source EN PDF p.21, block 159 -->

```text
XCamReturn
rk_aiq_uapi_customAWB_unRegister(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.21, block 160 -->

【参数】

<!-- Source EN PDF p.21, block 161 -->

| 参数名 | 说明 | 输入/输出 |
|---|---|---|
| ctx | AIQ 上下文指针 | 输入 |

<!-- Source EN PDF p.21, block 162 -->

【返回值】

<!-- Source EN PDF p.21, block 163 -->

| 返回值 | 说明 |
|---|---|
| 0 | 成功 |
| 非 0 | 失败，见错误码表 |

<!-- Source EN PDF p.21, block 164 -->

【注意】

<!-- Source EN PDF p.21, block 165 -->

在 rk_aiq_uapi_customAWB_register 完成自定义 AWB 注册后调用。

<!-- Source EN PDF p.21, block 166 -->

【要求】

<!-- Source EN PDF p.21, block 167 -->

头文件：rk_aiq_user_api_custom_awb.h

<!-- Source EN PDF p.21, block 168 -->

库文件：librkaiq.so

<!-- Source EN PDF p.21, block 169 -->

#### 2.2.2 数据类型

<!-- Source EN PDF p.21, block 170 -->

##### 2.2.2.1 向 ISP 库注册的回调函数

<!-- Source EN PDF p.21, block 171 -->

###### 2.2.2.1.1 rk_aiq_customeAwb_cbs_t

<!-- Source EN PDF p.21, block 172 -->

【说明】定义自定义 AWB 算法向 ISP 库注册的回调函数。

<!-- Source EN PDF p.21, block 173 -->

【定义】

<!-- Source EN PDF p.22, block 174 -->

```text
typedef struct rk_aiq_customeAwb_cbs_s
{
    int32_t (*pfn_awb_init)(void* ctx);
    int32_t (*pfn_awb_run)(void* ctx, const rk_aiq_customAwb_stats_t* pstAwbInfo,
rk_aiq_customeAwb_results_t* pstAwbResult);
    int32_t (*pfn_awb_run)(void* ctx, uint32_t u32Cmd, void *pValue);
    int32_t (*pfn_awb_exit)(void* ctx);
} rk_aiq_customeAwb_cbs_t;
```

<!-- Source EN PDF p.22, block 175 -->

【成员】

<!-- Source EN PDF p.22, block 176 -->

| 成员名 | 说明 |
|---|---|
| pfn_awb_init | 初始化；首次初始化由 AwbDemoPrepare 调用。 |
| pfn_awb_ctrl | 控制自定义 AWB 内部状态的回调，目前不支持。 |
| pfn_awb_run | 运行自定义 AWB 的回调，参见下文 rk_aiq_customAwb_stats_t 与 rk_aiq_customeAwb_results_t。原文称 pstAwbResult==nullptr 表示初始化，用于初始化配置 pstAwbResult；否则按统计 pstAwbInfo 计算 pstAwbResult。环视各摄像头参数相同时按上述实现；不同时配置 pstAwbResult->next（第 1 摄像头）、pstAwbResult->next->next（第 2 摄像头）等；pstAwbResult 对应第 0 摄像头。 |
| pfn_awb_exit | 释放申请的内存等，由 AwbDemoDestroyCtx 调用。 |

<!-- Source EN PDF p.22, block 177 -->

【注意】

<!-- Source EN PDF p.22, block 178 -->

用户需要在自定义 AWB 库中实现以上回调函数。

<!-- Source EN PDF p.22, block 179 -->

pfn_awb_run 的实现可参考 third_party_awb_algo.cpp 中 custom_awb_run 函数的伪代码。

<!-- Source EN PDF p.22, block 180 -->

##### 2.2.2.2 统计数据

<!-- Source EN PDF p.22, block 181 -->

###### 2.2.2.2.1 rk_aiq_customAwb_stats_t

<!-- Source EN PDF p.22, block 182 -->

【说明】定义自定义 AWB 获取的白平衡硬件统计数据。

<!-- Source EN PDF p.22, block 183 -->

【定义】

<!-- Source EN PDF p.23, block 184 -->

```text
typedef struct rk_aiq_customAwb_stats_s
{
    rk_aiq_awb_stat_wp_res_light_v201_t light[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM];
    int WpNo2[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM];
    rk_aiq_awb_stat_blk_res_v201_t blockResult[RK_AIQ_AWB_GRID_NUM_TOTAL];
    rk_aiq_awb_stat_wp_res_light_v201_t multiwindowLightResult[4];
    rk_aiq_awb_stat_wp_res_v201_t
excWpRangeResult[RK_AIQ_AWB_STAT_WP_RANGE_NUM_V201];
    unsigned int WpNoHist[RK_AIQ_AWB_WP_HIST_BIN_NUM];
    struct rk_aiq_customAwb_stats_s* next;
} rk_aiq_customAwb_stats_t;
```

<!-- Source EN PDF p.23, block 185 -->

【成员】

<!-- Source EN PDF p.23, block 186 -->

| 成员名 | 说明 |
|---|---|
| light | 主窗口各光源白点统计，最多 RK_AIQ_AWB_MAX_WHITEREGIONS_NUM 个光源。 |
| WpNo2 | 主窗口各光源下 XY 域与 UV 域交集内的白点数，无小数位。 |
| blockResult | 各块 RGB 累加值；图像均匀划为 15x15（RK_AIQ_AWB_GRID_NUM_TOTAL）块。 |
| multiwindowLightResult | 若干子窗口各光源白点统计，只记录前 4 个光源；可通过时分复用记录全部光源；最多 4 个子窗口。 |
| excWpRangeResult | 落入 excludeWpRange 的点统计，只记录前 4 个区域，最多 4 区域。 |
| WpNoHist | 白点直方图各 bin 的白点数，无小数位；统计 XY 域哪种框内白点由 xyRangeTypeForWpHist 决定（原文对框类型的描述重复，未猜改）。 |
| next | 仅环视多摄有效，指向下一摄像头白平衡硬件统计。 |

<!-- Source EN PDF p.23, block 187 -->

【注意】

<!-- Source EN PDF p.23, block 188 -->

各成员详情见 Rockchip_Development_Guide_ISP30 的“统计数据/数据类型”章节中 rk_aiq_isp_awb_stats2_v3x_t 结构体成员定义。

<!-- Source EN PDF p.24, block 189 -->

##### 2.2.2.3 运算结果

<!-- Source EN PDF p.24, block 190 -->

###### 2.2.2.3.1 rk_aiq_customeAwb_results_t

<!-- Source EN PDF p.24, block 191 -->

【说明】定义自定义 AWB 的配置参数与计算结果。

<!-- Source EN PDF p.24, block 192 -->

【定义】

<!-- Source EN PDF p.24, block 193 -->

```text
typedef struct rk_aiq_customeAwb_results_s
{
    bool IsConverged; true: converged; false: not converged
    rk_aiq_wb_gain_t awb_gain_algo;
    float awb_smooth_factor;
    rk_aiq_customAwb_hw_cfg_t awbHwConfig;
    rk_aiq_customeAwb_single_results_t *next;//defalut vaue is nullptr,which means all cameras with the same cfg;
} rk_aiq_customeAwb_results_t;
```

<!-- Source EN PDF p.24, block 194 -->

【成员】

<!-- Source EN PDF p.25, block 195 -->

| 成员名 | 说明 |
|---|---|
| IsConverged | 当前 AWBgain 是否收敛：true 收敛，false 未收敛；默认 false；必须配置。 |
| awb_gain_algo | 自定义 AWB 得到的 R、GR、GB、B 通道增益；默认 {1.0, 1.0, 1.0, 1.0}，即不校正白平衡；必须配置。 |
| awb_smooth_factor | 提供给 CCM 和 LSC 的帧间平滑因子，越大则当前帧权重越小；范围 [0,1]，默认 0.5；可不配置。 |
| awbHwConfig | 自定义 AWB 硬件配置；大部分及模组相关参数须正确配置，其他参数已有默认值，可不更新。详见下文 rk_aiq_customAwb_hw_cfg_t。 |
| next | 非环视无需关注。多摄使用相同结果时指针为空，所有摄像头采用 rk_aiq_customeAwb_results_t；使用不同 rk_aiq_customeAwb_single_results_t 成员结果时，为 next 分配内存并加入下一摄像头结果，其对应成员覆盖 rk_aiq_customeAwb_results_t 中的值。该类型定义见下文。 |

<!-- Source EN PDF p.25, block 196 -->

###### 2.2.2.3.2 rk_aiq_customeAwb_single_results_t

<!-- Source EN PDF p.25, block 197 -->

【说明】定义自定义 AWB 环视模式下各摄像头的配置参数及计算结果；非环视模式无需关注。

<!-- Source EN PDF p.25, block 198 -->

【定义】

<!-- Source EN PDF p.25, block 199 -->

```text
typedef struct rk_aiq_customeAwb_single_results_s
{
    rk_aiq_wb_gain_t awb_gain_algo;//for each camera
    rk_aiq_customAwb_single_hw_cfg_t awbHwConfig;//for each camera
    struct rk_aiq_customeAwb_single_results_s *next;
} rk_aiq_customeAwb_single_results_t;
```

<!-- Source EN PDF p.25, block 200 -->

【成员】

<!-- Source EN PDF p.26, block 201 -->

| 成员名 | 说明 |
|---|---|
| awb_gain_algo | 含义同 rk_aiq_customeAwb_results_s 的 awb_gain_algo。 |
| awbHwConfig | 含义同 rk_aiq_customeAwb_results_s 内 awbHwConfig 结构的同名成员。 |
| next | 原文写“Useless”，并指向 rk_aiq_customeAwb_results_s 的 next（原文写 anext）成员含义，存在歧义。 |

<!-- Source EN PDF p.26, block 202 -->

###### 2.2.2.3.3 rk_aiq_wb_gain_t

<!-- Source EN PDF p.26, block 203 -->

见 Rockchip_Development_Guide_ISP32 的“AWB/功能级 API/数据类型”中 rk_aiq_wb_gain_t 结构体定义（原文引用 ISP32）。

<!-- Source EN PDF p.26, block 204 -->

###### 2.2.2.3.4 rk_aiq_customAwb_hw_cfg_t

<!-- Source EN PDF p.26, block 205 -->

【说明】定义自定义 AWB 的硬件配置，包括主窗口、多窗口配置及统计帧选择等。

<!-- Source EN PDF p.26, block 206 -->

【定义】

<!-- Source EN PDF p.26, block 207 -->

```text
typedef struct rk_aiq_customAwb_hw_cfg_s {
    bool awbEnable;
    bool lscBypEnable;
    uint8_t frameChoose;
    unsigned short windowSet[4];
    unsigned char lightNum;
    unsigned short maxR;
    unsigned short minR;
    unsigned short maxG;
    unsigned short minG;
    unsigned short maxB;
    unsigned short minB;
    unsigned short maxY;
    unsigned short minY;
    bool uvDetectionEnable;
    rk_aiq_awb_uv_range_para_t uvRange_param[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM];
    bool xyDetectionEnable;
    rk_aiq_rgb2xy_para_t rgb2xy_param;
    rk_aiq_awb_xy_range_para_t xyRange_param[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM];
    bool threeDyuvEnable;
    unsigned short threeDyuvIllu[RK_AIQ_AWB_YUV_LS_PARA_NUM];
    short icrgb2RYuv_matrix[12];
    rk_aiq_awb_rt3dyuv_range_para_t
ic3Dyuv2Range_param[RK_AIQ_AWB_YUV_LS_PARA_NUM];
    bool multiwindow_en;
    unsigned short multiwindow[RK_AIQ_AWB_MULTIWINDOW_NUM_V201][4];
} rk_aiq_customAwb_hw_cfg_t;
```

<!-- Source EN PDF p.26, block 208 -->

【成员】

<!-- Source EN PDF p.27, block 209 -->

| 成员名 | 说明 |
|---|---|
| awbEnable | AWB 统计使能；true 开启，false 关闭；默认 true。 |
| lscBypEnable | AWB 统计通路的 LSC 旁路：true 旁路（不经过 LSC），false 不旁路（经过 LSC）；默认 false。 |
| frameChoose | AWB 硬件统计输入帧，{0,1,2} 分别为短、中、长帧；线性模式默认 0，宽动态模式默认 1。 |
| windowSet | AWB 主统计窗口：windowSet=[h_offset,v_offset,h_size,v_size]，h 水平、v 垂直；范围 [0x0, 0xfff]；h_size* v_size 必须小于 5120*2880；默认 {0, 0, RawWidth, RawHeight} 为全窗口，不改变窗口时无需配置。 |
| lightNum | 统计光源数，范围 [0, 7]，默认 7。应按校准所用光源数设置，由校准工具输出。 |
| maxR | RGB 域白点统计时，R 通道检测上限；范围 [0x0, 0xff]；默认 230。 |
| minR | RGB 域白点统计时，R 通道检测下限；范围 [0x0, 0xff]；默认 3。 |
| maxG | RGB 域白点统计时，G 通道检测上限；范围 [0x0, 0xff]；默认 230。 |
| minG | RGB 域白点统计时，G 通道检测下限；范围 [0x0, 0xff]；默认 3。 |
| maxB | RGB 域白点统计时，B 通道检测上限；范围 [0x0, 0xff]；默认 230。 |
| minB | RGB 域白点统计时，B 通道检测下限；范围 [0x0, 0xff]；默认 3。 |
| maxY | RGB 域白点统计时，Y 通道检测上限；范围 [0x0, 0xff]；默认 230。 |
| minY | RGB 域白点统计时，Y 通道检测下限；范围 [0x0, 0xff]；默认 3。 |
| uvDetectionEnable | UV 白点检测开关：true 时范围内的点为白点；false 时所有点为白点；默认 true。 |
| uvRange_param | UV 四边形白点区域限制，最多 7 光源。与模组相关；uvDetectionEnable=ture（原文拼写）时必须正确配置，未定点参数可由校准工具取得；见 rk_aiq_awb_uv_range_para_t。 |
| xyDetectionEnable | XY 白点检测开关：true 时区间内的点为白点；false 时所有点为白点；默认 true。 |
| rgb2xy_param | RGB 到 XY 转换参数，与模组相关；xyDetectionEnable=true 时须正确配置。校准工具可提供未定点参数，见 rk_aiq_rgb2xy_para_t。 |
| xyRange_param | XY 四边形白点区域限制，最多 7 光源；与模组相关，xyDetectionEnable=true 时须正确配置。未定点参数由校准工具取得，见 rk_aiq_awb_xy_range_para_t。 |
| threeDyuvEnable | YUV 白点检测使能：true 开启，false 关闭；默认 true。 |
| threeDyuvIllu | 范围 [0, 7]；7 表示关闭 YUV 白点检测（所有点为白点），其他数字启用对应光源；默认 {7, 7, 7, 7}。 |
| icrgb2RYuv_matrix | RGB 到 YUV 旋转矩阵，与模组相关；原文条件写为“threeDyuvEnable and turethreeDyuvIllu is not 7”，须结合 API 核实。最后一列范围 [-2^12,2^12-1]，其他为 [-2^9,2^9-1]；未定点参数可由校准工具得到。 |
| ic3Dyuv2Range_param | YUV 白点限制参数，与模组相关；原文条件同上，未定点参数可由校准工具取得。详见 rk_aiq_awb_rt3dyuv_range_para_t。 |
| multiwindow_en | AWB 多窗口统计开关：true 开启，false 关闭；默认 false。 |
| multiwindow | AWB 多窗口配置，最多 4 窗口；multiwindow[i]=[h_offset,v_offset,h_size,v_size]，h 水平、v 垂直；范围 [0x0, 0xfff]。 |
| excludeWpRange | 在 UV 或 XY 域最多配置 7 个白点/非白点区间，前 4 个可作附加白点区间；与模组相关。见 rk_aiq_awb_exc_range_v201_t。 |
| wpDiffWeiEnable | 白点亮度权重调整使能：true 开启，false 关闭；默认 false。 |
| wpDiffwei_y | 白点亮度直方图区间共 9 个端点，范围 [0x0, 0xff]；wpDiffwei_y 相邻间隔必须为 2 的幂。 |
| wpDiffwei_w | wpDiffwei_y 各端点权重，范围 [0, 31]，5 位小数，默认 31。 |
| xyRangeTypeForWpHist | 白点亮度直方图选择中框或大框：RK_AIQ_AWB_XY_TYPE_NORMAL_V201 对应中框，RK_AIQ_AWB_XY_TYPE_BIG_V201 对应大框；默认 RK_AIQ_AWB_XY_TYPE_NORMAL_V201。 |
| blkWeightEn | 分块权重配置开关；原文“rue enabled”，false 关闭；默认 false（拼写疑点保留）。 |
| blkWeight | 分块权重，范围 [0,63]，6 位小数。 |
| blkMeasureMode | 选择块内全部点或仅白点参与统计：RK_AIQ_AWB_BLK_STAT_MODE_ALL_V201 为全部点，RK_AIQ_AWB_BLK_STAT_MODE_REALWP_V201 为白点；默认 RK_AIQ_AWB_BLK_STAT_MODE_ALL_V201。 |
| xyRangeTypeForBlkStatistics | 仅 blkMeasureMode=RK_AIQ_AWB_BLK_STAT_MODE_REALWP_V201 时有效。选择中框或大框白点，分别为 RK_AIQ_AWB_XY_TYPE_NORMAL_V201、RK_AIQ_AWB_XY_TYPE_BIG_V201；默认 RK_AIQ_AWB_XY_TYPE_NORMAL_V201。 |
| illIdxForBlkStatistics | 选择统计哪个光源的白点，仅 blkMeasureMode=RK_AIQ_AWB_BLK_STAT_MODE_REALWP_V201 时有效。可取 {RK_AIQ_AWB_BLK_STAT_REALWP_ILL0, RK_AIQ_AWB_BLK_STAT_REALWP_ILL1, RK_AIQ_AWB_BLK_STAT_REALWP_ILL2, RK_AIQ_AWB_BLK_STAT_REALWP_ILL3, RK_AIQ_AWB_BLK_STAT_REALWP_ILL4, RK_AIQ_AWB_BLK_STAT_REALWP_ILL5, RK_AIQ_AWB_BLK_STAT_REALWP_ILL6, RK_AIQ_AWB_BLK_STAT_REALWP_ALL}。 |

<!-- Source EN PDF p.29, block 212 -->

【注意】

<!-- Source EN PDF p.29, block 213 -->

注意，原文标为黑色的参数可配置默认值（该颜色标记表述按原文保留；应结合各参数说明核对）。

<!-- Source EN PDF p.29, block 214 -->

若需深入理解这些参数，请参考 Rockchip_Color_Optimization_Guide 中的下列内容：

<!-- Source EN PDF p.29, block 215 -->

(a) “2 AWB/2.1 功能说明”及 AWB 流程图。

<!-- Source EN PDF p.29, block 216 -->

(b) “2 AWB/2.2 关键参数/硬件白点检测流程”中的 AWB 白点检测流程图。

<!-- Source EN PDF p.29, block 217 -->

###### 2.2.2.3.5 rk_aiq_customAwb_hw_cfg_t

<!-- Source EN PDF p.29, block 218 -->

【说明】定义环视模式下各摄像头的差异化硬件配置；非环视模式无需关注（本节标题重复上一结构名，代码定义以原文为准）。

<!-- Source EN PDF p.29, block 219 -->

【定义】

<!-- Source EN PDF p.29, block 220 -->

```text
typedef struct rk_aiq_customAwb_single_hw_cfg_t {
    unsigned short windowSet[4];
    bool multiwindow_en;
    unsigned short multiwindow[RK_AIQ_AWB_MULTIWINDOW_NUM_V201][4];
    bool blkWeightEnable;
    unsigned char blkWeight[RK_AIQ_AWB_GRID_NUM_TOTAL];
} rk_aiq_customAwb_single_hw_cfg_t;
```

<!-- Source EN PDF p.29, block 221 -->

【成员】

<!-- Source EN PDF p.29, block 222 -->

| 成员名 | 说明 |
|---|---|
| windowSet | 含义同 rk_aiq_customAwb_hw_cfg_t 中的 windowSet。 |
| multiwindow_en | 含义同 rk_aiq_customAwb_hw_cfg_t 中的 multiwindow_en。 |
| multiwindow | 含义同 rk_aiq_customAwb_hw_cfg_t 中的 multiwindow。 |
| blkWeightEnable | 原文为“Tongke_Ike_Kustomab_Hall_Cob_T-Bulkwertnabul meaning”，无法可靠还原，保留待核对。 |
| blkWeight | 原文为“Tongke_Ike_Coustomab_Hall_Cove_Tur in Burkwaite meaning”，无法可靠还原，保留待核对。 |

<!-- Source EN PDF p.30, block 223 -->

###### 2.2.2.3.6 rk_aiq_awb_uv_range_para_t

<!-- Source EN PDF p.30, block 224 -->

【说明】定义自定义 AWB 在 UV 域的四边形白点区域限制参数。

<!-- Source EN PDF p.30, block 225 -->

![英文原稿技术图, PDF p.30](/docs/rockchip-isp30-3a/assets/en-p30-figure1.png)

*英文原稿技术图, PDF p.30.*

<!-- Source EN PDF p.30, block 226 -->

【定义】

<!-- Source EN PDF p.30, block 227 -->

```text
typedef struct rk_aiq_awb_uv_range_para_s {
    unsigned short pu_region[5];
    unsigned short pv_region[5];
    int slope_inv[4];
} rk_aiq_awb_uv_range_para_t;
```

<!-- Source EN PDF p.30, block 228 -->

【成员】

<!-- Source EN PDF p.30, block 229 -->

| 成员名 | 说明 |
|---|---|
| pu_region | UV 白点区域的 U 坐标组成闭环，如 [u0,u1,u2,u3,u0]；范围 [0x0, 0x1ff]，1 位小数。 |
| pv_region | UV 白点区域的 V 坐标组成闭环，如 [v0,v1,v2,v3,v0]；范围 [0x0, 0x1ff]，1 位小数。 |
| slope_inv | UV 白点区域四条边斜率的倒数，可取 10 位小数。 |

<!-- Source EN PDF p.30, block 230 -->

【注意】

<!-- Source EN PDF p.30, block 231 -->

依据 Rockchip_Color_Optimization_Guide_ISP30 的“AWB/UV 域白点检测”章节进行定点化或转换；参数由校准工具得到。

<!-- Source EN PDF p.30, block 232 -->

参数与模组相关；uvDetectionEnable 为 ture（原文拼写）时必须正确配置。

<!-- Source EN PDF p.30, block 233 -->

###### 2.2.2.3.7 rk_aiq_rgb2xy_para_t

<!-- Source EN PDF p.30, block 234 -->

【说明】定义自定义 AWB 的 RGB 域到 XY 域转换参数。

<!-- Source EN PDF p.30, block 235 -->

【定义】

<!-- Source EN PDF p.31, block 236 -->

```text
typedef struct rk_aiq_rgb2xy_para_s {
    unsigned short pseudoLuminanceWeight[3];
    short rotationMat[9];
} rk_aiq_rgb2xy_para_t;
```

<!-- Source EN PDF p.31, block 237 -->

【成员】

<!-- Source EN PDF p.31, block 238 -->

| 成员名 | 说明 |
|---|---|
| pseudoLuminanceWeight | RGB 到 XY 转换参数：[0, 2^12-1]，12 位小数。 |
| rotationMat | RGB 到 XY 转换参数：[-2^14, 2^14-1]，12 位小数。 |

<!-- Source EN PDF p.31, block 239 -->

【注意】

<!-- Source EN PDF p.31, block 240 -->

依据 Rockchip_Color_Optimization_Guide_ISP30 的“AWB/RGB2XY”章节对参数定点化；参数由校准工具得到。

<!-- Source EN PDF p.31, block 241 -->

参数与模组相关；xyDetectionEnable 为 ture（原文拼写）时必须正确配置。

<!-- Source EN PDF p.31, block 242 -->

###### 2.2.2.3.8 rk_aiq_awb_xy_range_para_t

<!-- Source EN PDF p.31, block 243 -->

【说明】定义自定义 AWB 在 XY 域的四边形白点区域限制参数。

<!-- Source EN PDF p.31, block 244 -->

![英文原稿技术图, PDF p.31](/docs/rockchip-isp30-3a/assets/en-p31-figure1.png)

*英文原稿技术图, PDF p.31.*

<!-- Source EN PDF p.31, block 245 -->

【定义】

<!-- Source EN PDF p.31, block 246 -->

```text
typedef struct rk_aiq_awb_xy_range_para_s {
    int NorrangeX[2];
    int NorrangeY[2];
    int SperangeX[2];
    int SperangeY[2];
    int SmalrangeX[2];
    int SmalrangeY[2];
} rk_aiq_awb_xy_range_para_t;
```

<!-- Source EN PDF p.31, block 247 -->

【成员】

<!-- Source EN PDF p.32, block 248 -->

| 成员名 | 说明 |
|---|---|
| NorrangeX | XY 白点区间水平起止坐标 [x0,x1]，范围 [-2^13, 2^13-1]，10 位小数。 |
| NorrangeY | XY 白点区间垂直起止坐标 [y0,y1]，范围 [-2^13, 2^13-1]，10 位小数。 |
| SperangeX | XY 白点区间水平起止坐标 [x0,x1]，范围 [-2^13, 2^13-1]，10 位小数。 |
| SperangeY | XY 白点区间垂直起止坐标 [y0,y1]，范围 [-2^13, 2^13-1]，10 位小数。 |
| SmalrangeX | XY 小框水平起止坐标 [x0,x1]；当前版本不支持；范围 [-2^13, 2^13-1]，10 位小数。 |
| SmalrangeY | XY 小框垂直起止坐标 [y0,y1]；当前版本不支持；范围 [-2^13, 2^13-1]，10 位小数。 |

<!-- Source EN PDF p.32, block 249 -->

【注意】

<!-- Source EN PDF p.32, block 250 -->

依据 Rockchip_Color_Optimization_Guide_ISP30 的“AWB/XY 域白点检测”章节对参数定点化；参数由校准工具得到。

<!-- Source EN PDF p.32, block 251 -->

参数与模组相关；xyDetectionEnable 为 ture（原文拼写）时必须正确配置。

<!-- Source EN PDF p.32, block 252 -->

###### 2.2.2.3.9 rk_aiq_awb_rt3dyuv_range_para_t

<!-- Source EN PDF p.32, block 253 -->

【说明】定义自定义 AWB 在 YUV 域的白点限制参数。

<!-- Source EN PDF p.32, block 254 -->

【定义】

<!-- Source EN PDF p.32, block 255 -->

```text
typedef struct rk_aiq_awb_rt3dyuv_range_para_s {
    unsigned char thcurve_u[6];
    unsigned short thcure_th[6];
    unsigned short lineP1[3];
    short vP1P2[3];
    unsigned char disP1P2;
} rk_aiq_awb_rt3dyuv_range_para_t;
```

<!-- Source EN PDF p.32, block 256 -->

【成员】

<!-- Source EN PDF p.33, block 257 -->

| 成员名 | 说明 |
|---|---|
| thcurve_u | u-th 折线的 u 分量；范围 [0x0, 0xff]；相邻两个 u 分量之差必须为 2 的幂。 |
| thcure_th | u-th 折线的 th 分量；范围 [0x0, 0xfff]，4 位小数；折线必须单调递增。 |
| lineP1 | 计算理论白点 (y',u0,v0) 所需的 YUV 域 p1 坐标；各分量范围 [0x0, 0xfff]，4 位小数。 |
| vP1P2 | 计算理论白点 (y',u0,v0) 所需的 YUV 域 p1 到 p2 向量；各分量范围 [-2^12, 2^12-1]，4 位小数。 |
| disP1P2 | p1 与 p2 欧氏距离为 2^disP1P2；范围 [0,5]。 |

<!-- Source EN PDF p.33, block 258 -->

【注意】

<!-- Source EN PDF p.33, block 259 -->

![英文原稿技术图, PDF p.33](/docs/rockchip-isp30-3a/assets/en-p33-figure1.png)

*英文原稿技术图, PDF p.33.*

<!-- Source EN PDF p.33, block 260 -->

依据 Rockchip_Color_Optimization_Guide_ISP30 的“AWB/YUV 域白点检测”章节进行定点化或转换；参数由校准工具得到。

<!-- Source EN PDF p.33, block 261 -->

参数与模组相关；threeDyuvEnable 为 ture（原文拼写）且 threeDyuvIllu 不为 7 时必须正确配置。

<!-- Source EN PDF p.33, block 262 -->

###### 2.2.2.3.10 rk_aiq_awb_exc_range_v201_t

<!-- Source EN PDF p.33, block 263 -->

【说明】定义自定义 AWB 在 UV 或 XY 域的白点排除/附加区域限制参数。

<!-- Source EN PDF p.33, block 264 -->

【定义】

<!-- Source EN PDF p.34, block 265 -->

```text
typedef struct rk_aiq_awb_exc_range_v201_s {
    rk_aiq_awb_exc_range_domain_t domain;
    bool excludeEnable[RK_AIQ_AWB_XY_TYPE_MAX_V201];
    bool measureEnable;
    int xu[2];
    int yv[2];
} rk_aiq_awb_exc_range_v201_t;
```

<!-- Source EN PDF p.34, block 266 -->

【成员】

<!-- Source EN PDF p.34, block 267 -->

| 成员名 | 说明 |
|---|---|
| rk_aiq_awb_exc_range_domain_t | 选择在 UV 或 XY 域排除/附加白点区间；RK_AIQ_AWB_EXC_RANGE_DOMAIN_UV 和 RK_AIQ_AWB_EXC_RANGE_DOMAIN_XY 分别代表 UV 与 XY 域。 |
| excludeEnable | 排除区域开关：true 开启，false 关闭；默认 true。 |
| measureEnable | 是否统计排除/附加区域的 RGain、BGain 通道和；true 统计，false 不统计；默认 false。 |
| xu | UV 或 XY 白点排除/附加区域水平起止坐标 xu={x0,x1}；范围 -2^13, 2^13-1。 |
| yv | UV 或 XY 白点排除/附加区域垂直起止坐标 yv={y0,y1}；范围 -2^13, 2^13-1。 |

<!-- Source EN PDF p.34, block 268 -->

【注意】

<!-- Source EN PDF p.34, block 269 -->

最多可配置 7 个窗口，但只有前 4 个的 measureEnable 可设为 true。

<!-- Source EN PDF p.34, block 270 -->

### 2.3 开发用户 AF 算法

<!-- Source EN PDF p.34, block 271 -->

不使用 RK AF 算法库时，用户可依据 3A 统计值开发 AF 算法，实现变焦对焦等功能。

<!-- Source EN PDF p.34, block 272 -->

实现 AF 算法时：

<!-- Source EN PDF p.34, block 273 -->

1\. 首先调用 rk_aiq_user_api2_af_SetAttrib 配置 AF 统计。

<!-- Source EN PDF p.34, block 274 -->

2\. 使用 rk_aiq_uapi_sysctl_get3AStatsBlk 获取 3A 统计值。此 API 阻塞等待，生成新统计值后立即返回。

<!-- Source EN PDF p.35, block 275 -->

3\. 用户 AF 算法按 3A 统计值计算，并驱动变焦与对焦马达运动。

<!-- Source EN PDF p.35, block 276 -->

4\. 最后调用 rk_aiq_uapi_sysctl_release3AStatsRef 释放取得的 3A 统计值。

<!-- Source EN PDF p.35, block 277 -->

算法整体流程如下图。

<!-- Source EN PDF p.35, block 278 -->

![英文原稿技术图, PDF p.35](/docs/rockchip-isp30-3a/assets/en-p35-figure1.png)

*英文原稿技术图, PDF p.35.*

<!-- Source EN PDF p.35, block 279 -->

#### 2.3.1 AF 统计模块

<!-- Source EN PDF p.35, block 280 -->

![英文原稿技术图, PDF p.35](/docs/rockchip-isp30-3a/assets/en-p35-figure2.png)

*英文原稿技术图, PDF p.35.*

<!-- Source EN PDF p.35, block 281 -->

Sensor 输入 HDR 图像时，AF 模块可选择 HDR 短/中/长曝光输出图像或 HDR 合成图像数据作为统计输入。

<!-- Source EN PDF p.35, block 282 -->

Sensor 输入 Normal 图像时，可选择 Sensor 输入图像或 debayer 后图像作为 AF 统计输入。

<!-- Source EN PDF p.35, block 283 -->

共支持两个窗口：主窗口 A 与独立窗口 B。

<!-- Source EN PDF p.35, block 284 -->

主窗口 A 包含 15\*15 子窗口，可配置 V1/V2/H1/H2 四个滤波器，输出相应的四组 FV 值以及亮度值和高亮统计值。

<!-- Source EN PDF p.35, block 285 -->

独立窗口 B 使用固定算子计算 FV，可输出一个 FV 值、亮度值与高亮统计值。

<!-- Source EN PDF p.36, block 286 -->

#### 2.3.2 AF 统计窗口配置

<!-- Source EN PDF p.36, block 287 -->

主窗口 A 与独立窗口 B 均支持矩形配置，可配置左上角坐标以及宽度和高度。

<!-- Source EN PDF p.36, block 288 -->

![英文原稿技术图, PDF p.36](/docs/rockchip-isp30-3a/assets/en-p36-figure1.png)

*英文原稿技术图, PDF p.36.*

<!-- Source EN PDF p.36, block 289 -->

#### 2.3.3 Gamma

<!-- Source EN PDF p.36, block 290 -->

Gamma 将 Sensor 输入的 RAW 图像转换为人眼感知自然亮度的形式。x 坐标为 0 至 1023，分段如下：16 16 16 16 32 32 32 32 64 64 64 128 128 128 128 128。y 坐标范围为 0 至 1023。

<!-- Source EN PDF p.36, block 291 -->

![英文原稿技术图, PDF p.36](/docs/rockchip-isp30-3a/assets/en-p36-figure2.png)

*英文原稿技术图, PDF p.36.*

<!-- Source EN PDF p.36, block 292 -->

#### 2.3.4 对焦滤波器

<!-- Source EN PDF p.36, block 293 -->

主窗口 A 提供可设置的 V1/V2/H1/H2 四个滤波器；独立窗口 B 使用固定算子计算。

<!-- Source EN PDF p.37, block 294 -->

V1/V2/H1/H2 滤波器频段可调整，滤波器寄存器值由滤波器设计工具生成。

<!-- Source EN PDF p.37, block 295 -->

![英文原稿技术图, PDF p.37](/docs/rockchip-isp30-3a/assets/en-p37-figure1.png)

*英文原稿技术图, PDF p.37.*

<!-- Source EN PDF p.37, block 296 -->

#### 2.3.5 亮度/高亮

<!-- Source EN PDF p.37, block 297 -->

主窗口 A 提供亮度统计与高亮计数统计。

<!-- Source EN PDF p.37, block 298 -->

FV 容易受光源影响。失焦时光晕扩散，使图像低频分量增加，出现图像模糊但 FV 增大的现象。

<!-- Source EN PDF p.37, block 299 -->

一般使用高亮计数器处理：失焦时光晕扩展，高亮点数量增加；对焦清晰时高亮点数量最少。

<!-- Source EN PDF p.37, block 300 -->

#### 2.3.6 亮度依赖增益（LDG）

<!-- Source EN PDF p.37, block 301 -->

也可使用 LDG 按像素亮度衰减 FV，降低过亮与过暗点的 FV，以消除光源影响。

<!-- Source EN PDF p.38, block 302 -->

![英文原稿技术图, PDF p.38](/docs/rockchip-isp30-3a/assets/en-p38-figure1.png)

*英文原稿技术图, PDF p.38.*

<!-- Source EN PDF p.38, block 303 -->

亮度在 [ldg_xl, ldg_xh] 时，输出 Gain 为 1，FV 不衰减。

<!-- Source EN PDF p.38, block 304 -->

亮度在 [0, ldg_xl] 时，Gain 按斜率 ldg_kl 衰减，最小为 ldg_yl。

<!-- Source EN PDF p.38, block 305 -->

`gain = 256 - ldg_kl*(ldg_xl - x)/256; gain = max(gain, ldg_yl);`

<!-- Source EN PDF p.38, block 306 -->

亮度在 [ldg_xh, 255] 时，Gain 按斜率 ldg_kh 衰减，最小为 ldg_yh。

<!-- Source EN PDF p.38, block 307 -->

`gain = 256 - ldg_kh*(x-ldg_xh)/256; gain = max(gain, ldg_yh);`

<!-- Source EN PDF p.38, block 308 -->

水平 H1/H2 共用一条 LDG 曲线，垂直 V1/V2 共用一条 LDG 曲线。

<!-- Source EN PDF p.38, block 309 -->

#### 2.3.7 FV 阈值

<!-- Source EN PDF p.38, block 310 -->

计算 FV 时，低于 FV 阈值的值不计入最终输出，以降低噪声影响。

<!-- Source EN PDF p.39, block 311 -->

![英文原稿技术图, PDF p.39](/docs/rockchip-isp30-3a/assets/en-p39-figure1.png)

*英文原稿技术图, PDF p.39.*

<!-- Source EN PDF p.39, block 312 -->

FV 阈值作用于滤波结果经过 LDG 后的输出值。

<!-- Source EN PDF p.39, block 313 -->

#### 2.3.8 FV 计算

<!-- Source EN PDF p.39, block 314 -->

FV 支持绝对值与平方模式。平方模式对 FV 求平方，可增加清晰位置 FV 的占比。

<!-- Source EN PDF p.39, block 315 -->

为防止最终 FV 溢出，可设置主窗口 v1/v2/h1/h2 的四个右移值，以及独立窗口 fv/luma 的两个右移值。

<!-- Source EN PDF p.39, block 316 -->

#### 2.3.9 FV 输出

<!-- Source EN PDF p.39, block 317 -->

主窗口 A 输出包含 1515 的 v1/v2/h1/h2 FV 信息，以及 1515 的 luma/highlight 信息（原文如此连写，结合前文和下图为 15×15 网格）。

<!-- Source EN PDF p.39, block 319 -->

主窗口 A 输出在图像上的分布如下图。

<!-- Source EN PDF p.39, block 320 -->

独立窗口 B 输出包含一个 FV、一个亮度值和一个高亮统计值。

<!-- Source EN PDF p.40, block 321 -->

![英文原稿技术图, PDF p.40](/docs/rockchip-isp30-3a/assets/en-p40-figure1.png)

*英文原稿技术图, PDF p.40.*

原图 FV 分块网格的可编辑转录：

|  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 2 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 3 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 4 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 5 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 6 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 7 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 8 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 9 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 10 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 11 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 12 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 13 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 14 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 15 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |

<!-- Source EN PDF p.40, block 322 -->

#### 2.3.10 最终 FV 值计算

<!-- Source EN PDF p.40, block 323 -->

H1 与 V1 可配置为低通频段用于粗搜，H2 与 V2 配置为高通频段用于细搜。

<!-- Source EN PDF p.40, block 324 -->

水平滤波输出 H 与垂直滤波输出 V 可按指定权重加权。

<!-- Source EN PDF p.40, block 325 -->

`FV = FvH * weight + FvV * (1-weight)`

<!-- Source EN PDF p.40, block 326 -->

各分块 FV 也可按需要进行加权。

<!-- Source EN PDF p.40, block 327 -->

#### 2.3.11 AF 统计配置

<!-- Source EN PDF p.40, block 328 -->

使用 rk_aiq_user_api2_af_SetAttrib 配置。

<!-- Source EN PDF p.40, block 329 -->

```text
XCamReturn
rk_aiq_user_api2_af_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx, rk_aiq_af_attrib_t
attr);
```

<!-- Source EN PDF p.40, block 330 -->

| 参数名 | 说明 | 输入/输出 |
|---|---|---|
| sys_ctx | AIQ 上下文指针 | 输入 |
| attr | 对焦的参数属性 | 输入 |

<!-- Source EN PDF p.40, block 331 -->

参数 rk_aiq_af_attrib_t 中的 rk_aiq_af_algo_meas_v30_t 定义如下：

<!-- Source EN PDF p.40, block 332 -->

```text
typedef struct {
    unsigned char af_en;
    unsigned char rawaf_sel;
    unsigned char gamma_en;
    unsigned char gaus_en;
    unsigned char v1_fir_sel;
    unsigned char hiir_en;
    unsigned char viir_en;
unsigned char v1_fv_outmode; // 0 square, 1 absolute
unsigned char v2_fv_outmode; // 0 square, 1 absolute
unsigned char h1_fv_outmode; // 0 square, 1 absolute
unsigned char h2_fv_outmode; // 0 square, 1 absolute
unsigned char ldg_en;
unsigned char accu_8bit_mode; // fix to 1
unsigned char ae_mode;
unsigned char y_mode; // fix to 0
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
unsigned char h_ldg_lumth[2]; //luminance thresh
unsigned char h_ldg_gain[2]; //gain for [minLum,maxLum]
unsigned short h_ldg_gslp[2]; //[slope_low,-slope_high]
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
} rk_aiq_af_algo_meas_v30_t;
```

<!-- Source EN PDF p.43, block 336 -->

| 成员名 | 说明 |
|---|---|
| af_en | AF 信息统计使能，0 关闭，1 开启。 |
| rawaf_sel | AF 统计输入通道，范围 0–3，对应 HDR 长/中/短/合成帧；通常选择中帧。非 HDR 设 0，HDR 设 1（通道顺序按原文保留）。 |
| gamma_en | Gamma 使能，0 关闭，1 开启。 |
| gaus_en | 必须固定设为 1。 |
| v1_fir_sel | 必须固定设为 1。 |
| hiir_en | H1/H2 通道使能，0 关闭，1 开启。 |
| viir_en | V1/V2 通道使能，0 关闭，1 开启。gamma_en 开启时 viir_en 必须设为 1。 |
| v1_fv_outmode | V1 通道 FV 输出模式，0 平方，1 绝对值。 |
| v2_fv_outmode | V2 通道 FV 输出模式，0 平方，1 绝对值。 |
| h1_fv_outmode | H1 通道 FV 输出模式，0 平方，1 绝对值。 |
| h2_fv_outmode | H2 通道 FV 输出模式，0 平方，1 绝对值。 |
| ldg_en | LDG 功能使能，0 关闭，1 开启。 |
| accu_8bit_mode | 必须固定设为 1。 |
| ae_mode | ae_mode=1 时 RAWAF 启用 15x15 亮度均值统计，复用 RAWAE_BIG 模块逻辑。 |
| y_mode | 必须固定设为 0。 |
| line_en | 尚未生效。 |
| line_num | 尚未生效。 |
| window_num | 有效窗口数：window_num=1 时仅 WinA 主窗口生效；window_num=2 时 WinA 与独立窗口 WinB 均生效。 |
| wina_h_offs | WinA 左上角第一个像素的水平坐标，必须大于或等于 2。 |
| wina_v_offs | WinA 左上角第一个像素的垂直坐标，必须大于或等于 1。 |
| wina_h_size | WinA 宽度，必须小于图像宽度 -2-wina_h_offs，且是 15 的倍数。 |
| wina_v_size | 原文称 WinA“宽度”，须小于图像“宽度” -2-wina_v_offs，且是 15 的倍数；字段名为垂直尺寸，此矛盾保留待核对。 |
| winb_h_offs | WinB 左上角第一个像素的水平坐标，必须大于或等于 2。 |
| winb_v_offs | WinB 左上角第一个像素的垂直坐标，必须大于或等于 1。 |
| winb_h_size | WinB 宽度，必须小于图像宽度 -2-wina_h_offs（原文这里引用 wina，未改为 winb）。 |
| winb_v_size | WinB 高度，必须小于图像高度 -2-wina_v_offs（原文引用 wina，未改）。 |
| gamma_y | Gamma 表 y 值范围 0–1023；x 坐标为 0 至 1023，分段：16 16 16 16 32 32 32 32 64 64 64 128 128 128 128 128。 |
| thres | 计算的 FV 小于此值时置 0，以降低噪声影响；范围 0–0xFFFF。 |
| shift_sum_a | 当前不可用，可固定设 0。 |
| shift_sum_b | WinB FV 右移位数，用于避免 FV 溢出；范围 0–7（原文“shit bit”按位移语义翻译）。 |
| shift_y_a | 当前不可用，可固定设 0。 |
| shift_y_b | WinB luma 右移位数，用于避免亮度值溢出；范围 0–7。 |
| v1_iir_coe[9] | V1 通道 3X3 IIR 系数，按 AF 滤波器系数生成工具输出设置。 |
| v1_fir_coe[3] | V1 通道 1x3 FIR 系数，按 AF 滤波器系数生成工具输出设置。 |
| v2_iir_coe[3] | V2 通道 1x3 IIR 系数，按 AF 滤波器系数生成工具输出设置。 |
| v2_fir_coe[3] | V2 通道 1x3 FIR 系数，按 AF 滤波器系数生成工具输出设置。 |
| h1_iir1_coe[6] | H1 通道 1X6 IIR1 系数，按 AF 滤波器系数生成工具输出设置。 |
| h2_iir1_coe[6] | H2 通道 1X6 IIR1 系数，按 AF 滤波器系数生成工具输出设置。 |
| h1_iir2_coe[6] | H1 通道 1X6 IIR2 系数，按 AF 滤波器系数生成工具输出设置。 |
| h2_iir2_coe[6] | H2 通道 1X6 IIR2 系数，按 AF 滤波器系数生成工具输出设置。 |
| h_ldg_lumth[2] | H1/H2 通道 LDG 的亮度阈值系数；0 为左侧暗区，1 为右侧亮区；范围 0~255。 |
| h_ldg_gain[2] | H1/H2 通道 LDG 的最小增益系数；0 为左侧暗区，1 为右侧亮区；范围 0~255。 |
| h_ldg_gslp[2] | H1/H2 通道 LDG 的斜率系数；0 为左侧暗区，1 为右侧亮区；范围 0~65535。 |
| v_ldg_lumth[2] | V1/V2 通道 LDG 的亮度阈值系数；0 为左侧暗区，1 为右侧亮区；范围 0~255。 |
| v_ldg_gain[2] | V1/V2 通道 LDG 的最小增益系数；0 为左侧暗区，1 为右侧亮区；范围 0~255。 |
| v_ldg_gslp[2] | V1/V2 通道 LDG 的最小增益系数；0 为左侧暗区，1 为右侧亮区；范围 0~255。 |
| v_fv_thresh | V1/V2 的 AF 统计阈值，FV 小于阈值时置 0 以降低噪声；范围 0–0x0FFF。 |
| h_fv_thresh | H1/H2 的 AF 统计阈值，FV 小于阈值时置 0 以降低噪声；范围 0–0x0FFF。 |
| v1_fv_shift | V1 的 FV 右移位数，避免 FV 输出溢出；范围 0–7。 |
| v2_fv_shift | V2 的 FV 右移位数，避免 FV 输出溢出；范围 0–7。 |
| h1_fv_shift | H1 的 FV 右移位数，避免 FV 输出溢出；范围 0–7。 |
| h2_fv_shift | H2 的 FV 右移位数，避免 FV 输出溢出；范围 0–7。 |
| highlit_thresh | 高亮统计阈值，像素高于此值视为高亮并参与计数，仅累加各区域高亮点数量；范围 0–0x0FFF。 |

<!-- Source EN PDF p.45, block 339 -->

#### 2.3.12 获取 AF 统计值

<!-- Source EN PDF p.45, block 340 -->

详见 Rockchip_Development_Guide_ISP30 的“统计数据”章节。

<!-- Source EN PDF p.45, block 341 -->

`rk_aiq_uapi_sysctl_get3AStatsBlk () / rk_aiq_uapi_sysctl_release3AStatsRef()`

<!-- Source EN PDF p.46, block 342 -->

AF 统计结果对应结构体为 rk_aiq_af_algo_stat_v30_t。

<!-- Source EN PDF p.46, block 343 -->

#### 2.3.13 滤波器设计工具的使用

<!-- Source EN PDF p.46, block 344 -->

请参考 Filter Design Tool 文档。

<!-- Source EN PDF p.46, block 345 -->

### 2.4 参考代码示例

<!-- Source EN PDF p.46, block 346 -->

客户实现 3A 算法时可参考以下代码示例：

<!-- Source EN PDF p.46, block 347 -->

目录：AIQ 根目录/rkisp_demo/demo/

<!-- Source EN PDF p.46, block 348 -->

`|-------ae_algo_demo`：AE 算法参考代码。

<!-- Source EN PDF p.46, block 349 -->

`|-------awb_algo_demo`：AWB 算法参考代码。

<!-- Source EN PDF p.46, block 350 -->

`|-------af_algo_demo`：AF 算法参考代码。

{% endraw %}
