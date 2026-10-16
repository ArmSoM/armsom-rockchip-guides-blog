---
title: "Rockchip RK628 For-All 完整移植指南：Display、HDMI IN、音频与调试"
description: "完整整理 RK628D/F/H For-All 驱动移植、DTS、信号调节、HDMI IN、音频、测试与常见问题。"
translation_key: "053-rockchip-rk628-porting"
slug: "053-rockchip-rk628-porting"
lang: "zh"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: ["RK628", "Display", "HDMI", "I2C", "V4L2"]
keywords: "ArmSoM Rockchip RK628 For-All Display HDMI IN V4L2"
excerpt: "完整整理 RK628D/F/H For-All 驱动移植、DTS、信号调节、HDMI IN、音频、测试与常见问题。"
---

{% raw %}

# Rockchip RK628 For-All 完整移植指南：Display、HDMI IN、音频与调试

## ArmSoM 适用说明

本文为 Rockchip 平台参考，不是 ArmSoM 硬件实测。RK628D/F/H 为外接桥接芯片，能否用于具体 ArmSoM 板卡，取决于信号引出、供电、I2C、GPIO、中断、时钟和目标 SDK/BSP。原文分别说明 Misc、Media 和 U-Boot 驱动，涉及 RK3399、RK356x、RK3588、RK3576、RK3562 等平台及不同内核分支；不能据此推断所有板卡均支持。应逐场景核对文中的平台和内核条件，尚未进行硬件验证。

按用户确认，以中文 V2.7（122 页）作为三语共同基准；英文 V2.3（117 页）用于章节比较及对应原图。英文旧版没有或不同的内容完整补译自中文，不静默混用。新增的驱动移植、信号调节/SSC、GVI lane swap 及 Media 配置均以中文为准。中文使用中文原图，英文和俄文使用已配对的英文原图；各图注标出源页。可复制截图转录以中文新版截图为证据。

> 安全与原文疑点：寄存器写入、chmod 0666 和 setenforce 0 均为原文调试示例，不应直接用于生产系统。源码节点名称、信号路径文字和平台范围存在个别矛盾，已保留并在校对记录列出，未猜测修正。原文从第 2 章开始（目录章已移除），保留原章节编号。

[校对记录](/docs/rockchip-rk628-porting/EDITORIAL-NOTES.md) · [ArmSoM 官方文档](https://docs.armsom.org/)

<!-- source: CN V2.7 p10; unit 0 -->

## 2.   前言

<!-- source: CN V2.7 p10; unit 1 -->

RK628 分为 Display 通路和 HDMI IN 通路，SDK 版本 Display 通路基于 DRM 框架，HDMI IN 通路基于 V4L2 框架，不同的框架或是不同的内核版本需要不同的驱动去适配，而且只适用于 RK 平台。为了适配别的平台，方便驱动移植，推出 For-All 版本驱动，当前驱动支持 RK628D 和 RK628F/H，驱动补丁版本管理参阅 sdk 补丁包的《rk628 驱动版本说明》。

<!-- source: CN V2.7 p10; unit 2 -->

For-All 版本驱动一样也分为 Display 通路和 HDMI IN 通路，Display 通路的驱动于drivers/misc/rk628/ 下，支持 RGB / BT1120 / HDMI 输入，RGB / BT1120 / LVDS / GVI / DSI / HDMI输出，HDMI IN 通路的驱动于 drivers/media/i2c/rk628/ 下，支持 HDMI 输入，CSI / BT1120 输出。下面我们介绍的 Misc 和 Media 分别代表这两套驱动，两套代码相互独立，都可单独编译运行。

<!-- source: CN V2.7 p10; unit 3 -->

### 2.1   RK628 芯片框图

<!-- source: CN V2.7 p10; unit 4 -->

![原始技术图 — CN V2.7, p10](/docs/rockchip-rk628-porting/assets/cn-p10-X209.png)

*原始技术图: CN V2.7, p10.*

<!-- source: CN V2.7 p11; unit 5 -->

### 2.2   RK628 典型设计硬件框图

<!-- source: CN V2.7 p11; unit 6 -->

![原始技术图 — CN V2.7, p11](/docs/rockchip-rk628-porting/assets/cn-p11-X215.png)

*原始技术图: CN V2.7, p11.*

<!-- source: CN V2.7 p11; unit 7 -->

### 2.3   RK628 主要规格

<!-- source: CN V2.7 p11; unit 8 -->

#### 2.3.1   RK628D 主要规格

<!-- source: CN V2.7 p11; unit 9 -->

| Video Iutput<br>Interface | Typical Resolution | Typical Format |
| --- | --- | --- |
| HDMI IN | 4K@30 | YUV420(4K@60) / YUV422 / YUV444 /<br>RGB888 |
| BT1120 IN | 1080P@60 | YUV422 8bit |
| RGB IN | 1080P@60 | RGB888 |
| VIDEO Output<br>Interface | Typical Resolution | Typical Format |
| GVI OUT | 4K@60 | RGB888 |
| MIPI CSI | 4K@30 | YUV422 8bit |
| MIPI DSI | 1080P@60 /<br>2.5K@60 | RGB888 |
| LVDS OUT | 720P@60 /<br>1080P@60 | RGB888 |
| BT1120 OUT | 1080P@60 | YUV422 8bit |
| RGB OUT | 1080P@60 | RGB888 |
| HDMI OUT | 1080P@60 | RGB888/YUV444 8bit |

<!-- source: CN V2.7 p12; unit 11 -->

#### 2.3.2   RK628F 主要规格

<!-- source: CN V2.7 p12; unit 12 -->

| Video Iutput<br>Interface | Typical<br>Resolution | Typical Format |
| --- | --- | --- |
| HDMI IN | 4K@60 | RGB888 / YUV422 8bit / YUV422 10bit<br>/ YUV420 8bit (> 4k@30Hz) / YUV420 10bit<br>(> 4k@30Hz) |
| BT1120 IN | 1080P@60 | YUV422 8bit |
| RGB IN | 1080P@60 | RGB888 |
| VIDEO Output<br>Interface | Typical<br>Resolution | Typical Format |
| GVI OUT | 4K@60 | RGB888 |
| MIPI CSI | 双 MIPI，4K@60 | YUV422 8bit |
| MIPI DSI | 1080P@60 /<br>2.5K@60 | RGB888 |
| LVDS OUT | 720P@60 /<br>1080P@60 | RGB888 |
| BT1120 OUT | 1080P@60 | YUV422 8bit |
| RGB OUT | 1080P@60 | RGB888 |
| HDMI OUT | 1080P@60 | RGB888 / YUV444 8bit |

<!-- source: CN V2.7 p12; unit 13 -->

#### 2.3.3   RK628H 主要规格

<!-- source: CN V2.7 p12; unit 14 -->

对比 RK628F，RK628H 没有 GVI 接口功能。

<!-- source: CN V2.7 p13; unit 15 -->

| Video Iutput<br>Interface | Typical<br>Resolution | Typical Format |
| --- | --- | --- |
| HDMI IN | 4K@60 | RGB888 / YUV422 8bit / YUV422 10bit<br>/ YUV420 8bit (> 4k@30Hz) / YUV420 10bit<br>(> 4k@30Hz) |
| BT1120 IN | 1080P@60 | YUV422 8bit |
| RGB IN | 1080P@60 | RGB888 |
| VIDEO Output<br>Interface | Typical<br>Resolution | Typical Format |
| MIPI CSI | 双 MIPI，4K@60 | YUV422 8bit |
| MIPI DSI | 1080P@60 /<br>2.5K@60 | RGB888 |
| LVDS OUT | 720P@60 /<br>1080P@60 | RGB888 |
| BT1120 OUT | 1080P@60 | YUV422 8bit |
| RGB OUT | 1080P@60 | RGB888 |
| HDMI OUT | 1080P@60 | RGB888 / YUV444 8bit |

<!-- source: CN V2.7 p14; unit 16 -->

### 2.4   RK628F/H 与 RK628D 改进及优化对比

<!-- source: CN V2.7 p14; unit 17 -->

| 功能模<br>块 | RK628D | RK628F/H |
| --- | --- | --- |
| HDMIRX | 最高支持到 4K@60 YUV420 TMDS<br>CLK 297M | 最高可以支持 4K@60 RGB/YUV444<br>TMDS CLK 594M |
| HDMIRX | 有频点限制，特定分辨率应用需要评<br>估，不一定能满足 | 支持 27M ~ 594M 任一频点， 满足多样<br>化的分辨率输入 |
| HDMIRX | 不支持 DVI MODE | 支持 DVI MODE |
| HDMIRX | 无法检测判断输入信号<br>yuv422/yuv420 视频格式 | 控制器可以判断输入信号的视频格式 |
| HDMIRX | 输入源的 clk lane 幅值低的情况，<br>RK628D rxphy 无法锁定 | 无该问题 |
| HDMIRX | hdmi rx 存在误码检测 | 无该问题 |
| MIPI<br>CSI | 单通道 4lanes | 双通道 8lanes |
| MIPI<br>CSI | 最大支持分辨率 4k@30 yuv422 8bit | 最大支持分辨率 4k@60 yuv422 8bit |
| GVI | 不同型号的屏存在点不亮和点屏异常 | 测试多款市面上存在型号的屏暂未发现异<br>常，指导说明见《输出模块配置》-《GVI<br>输出》-《RK628F GVI 测试型号列表》小<br>节 |
| GVI | 需要时钟同源 | 无需时钟同源 |
| audio | 无 audio 的 mclk，接 codec 方案，需<br>要主控提供 mclk | 可以提供 mclk |
| audio | hdmi 插拔时存在 I2S FIFO 溢出和声道<br>误切换 | 解决 FIFO 溢出时候，声道顺序不一致问<br>题 |
| csc | 不同输入输出接口，部分应用场景存在<br>色域空间转换或图像格式的上下采样，<br>图像色彩少量细节可能会有轻微偏差 | 无该问题 |
| hdmi tx | 需要时钟同源 | rgb2hdmi 场景需要同源<br>hdmi2hdmi 场景不需要同源 |
| 多显 | 支持 rgb/bt1120 和 hdmi tx 同时同分<br>辨率输出 | 支持 rgb/bt1120、hdmi tx 和<br>gvi/dsi/csi/lvds 同分辨率同时输出 |
| MCU | 没有内置 MCU | 内置 MCU |

<!-- source: CN V2.7 p15; unit 18 -->

## 3.   驱动移植说明

<!-- source: CN V2.7 p15; unit 19 -->

For-All 版本驱动分为 Display 通路和 HDMI IN 通路，Display 通路的 u-boot 驱动于drivers/video/drm/rk628/ 下、内核驱动于 drivers/misc/rk628/ 下，支持 RGB / BT1120 / HDMI 输入，RGB / BT1120 / LVDS / GVI / DSI / HDMI 输出，HDMI IN 通路的驱动于 drivers/media/i2c/rk628/下，支持 HDMI 输入，CSI / DSI / BT1120 输出。

<!-- source: CN V2.7 p15; unit 20 -->

可以根据需求，单独移植如下驱动：

<!-- source: CN V2.7 p15; unit 21 -->

### 3.1   Display 通路

<!-- source: CN V2.7 p15; unit 22 -->

#### 3.1.1   u-boot(drivers/video/drm/rk628)

<!-- source: CN V2.7 p15; unit 23 -->

在 RK 平台 u-boot 中，已经开发 RK628F/H 部分显示通路的驱动如下表，以支持 uboot 开机快速logo。

<!-- source: CN V2.7 p15; unit 24 -->

| IC | Display Route | 支持情况 |
| --- | --- | --- |
| RK628F/H | HDMI2(Dual)DSI | 支持 |
| RK628F/H | HDMI2(Dual)LVDS | 支持 |
| RK628F | HDMI2GVI | 支持 |
| RK628F/H | HDMI2BT1120/RGB | 支持 |
| RK628F/H | BT1120/RGB2(Dual)DSI | 支持 |
| RK628F/H | BT1120/RGB2(Dual)LVDS | 支持 |
| RK628F | BT1120/RGB2GVI | 支持 |

<!-- source: CN V2.7 p15; unit 25 -->

注：u-boot 开机 logo 驱动不对 RK628D 进行支持，因为 HDMIRX 不能工作在任意频点

<!-- source: CN V2.7 p15; unit 26 -->

若为首次添加 RK628 Misc 驱动或 drivers/video/drm 下不存在 RK628 驱动, 则把 u-boot 中 Misc 的RK628 驱动源码直接拷贝到 drivers/video/drm 下，并修改如下源文件：

<!-- source: CN V2.7 p15; unit 27 -->

```text
drivers/video/drm/rockchip_display.c
drivers/video/drm/Kconfig
drivers/video/drm/Makefile

configs/rk3568_defconfig //以rk3568平台为例
```

<!-- source: CN V2.7 p15; unit 28 -->

参考如下修改补丁：

<!-- source: CN V2.7 p15; unit 29 -->

```text
diff --git a/drivers/video/drm/rockchip_display.c b/drivers/video/drm/rockchip_display.c

index a1cb40a000e..041b8bdd84f 100644
--- a/drivers/video/drm/rockchip_display.c
+++ b/drivers/video/drm/rockchip_display.c
@@ -918,6 +918,23 @@ static int display_enable(struct display_state *state)
      if (state->enabled_at_spl == false)
           rockchip_connector_enable(state);

+#ifdef CONFIG_DRM_ROCKCHIP_RK628

+     /*
+     * trigger .probe helper of U_BOOT_DRIVER(rk628) in ./rk628/rk628.c
+     */
+     struct udevice * dev;
+     int phandle, ret;
+
+     phandle = ofnode_read_u32_default(state->node, "bridge", -1);
+     if (phandle < 0)
+          printf("%s failed to find bridge phandle\n",
ofnode_get_name(state->node));
+
+     ret = uclass_get_device_by_phandle_id(UCLASS_I2C_GENERIC, phandle, &dev);

+     if (ret && ret != -ENOENT)
+          printf("%s:%d failed to get rk628 device ret:%d\n", __func__,
__LINE__, ret);
+
+#endif
+
      if (crtc_state->soft_te)
           crtc_funcs->apply_soft_te(state);
diff --git a/drivers/video/drm/Kconfig b/drivers/video/drm/Kconfig
index ddc65818cba..c5073b9926b 100644
--- a/drivers/video/drm/Kconfig

+++ b/drivers/video/drm/Kconfig
@@ -191,6 +191,13 @@ config DRM_ROCKCHIP_RK618
       Choose this option to enable support for Rockchip RK618 display
       bridge chips driver. say Y to enable its driver.

+config DRM_ROCKCHIP_RK628
+     bool "Rockchip RK628 display bridge driver"
+     depends on DRM_ROCKCHIP
+     help
+      Choose this option to enable support for Rockchip RK628 display
+      bridge chips driver. say Y to enable its driver.
+
diff --git a/drivers/video/drm/Makefile b/drivers/video/drm/Makefile
index ea4219d9cf6..f11a8ff4885 100644

--- a/drivers/video/drm/Makefile
+++ b/drivers/video/drm/Makefile
@@ -36,6 +36,7 @@ obj-$(CONFIG_DRM_ROCKCHIP_RGB) += rockchip_rgb.o
 obj-$(CONFIG_DRM_ROCKCHIP_PANEL) += rockchip_panel.o
 obj-$(CONFIG_DRM_ROHM_BU18XL82) += rohm-bu18tl82.o rohm-bu18rl82.o
 obj-$(CONFIG_DRM_ROCKCHIP_RK618) += rk618.o rk618_lvds.o rk618_dsi.o
+obj-$(CONFIG_DRM_ROCKCHIP_RK628) += rk628/
 obj-$(CONFIG_DRM_ROCKCHIP_RK1000) += rk1000.o rk1000_tve.o
 obj-$(CONFIG_DRM_ROCKCHIP_SAMSUNG_MIPI_DCPHY) += samsung_mipi_dcphy.o
 obj-$(CONFIG_DRM_SII902X) += sii902x.o
diff --git a/configs/rk3568_defconfig b/configs/rk3568_defconfig
index acd1fb18169..94f1050eb4f 100644
--- a/configs/rk3568_defconfig

+++ b/configs/rk3568_defconfig
@@ -224,3 +224,4 @@ CONFIG_RK_AVB_LIBAVB_USER=y
 CONFIG_OPTEE_CLIENT=y
 CONFIG_OPTEE_V2=y
 CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION=y
+CONFIG_DRM_ROCKCHIP_RK628=y
```

<!-- source: CN V2.7 p16; unit 30 -->

<!-- source: CN V2.7 p16; unit 31 -->

<!-- source: CN V2.7 p16; unit 32 -->

<!-- source: CN V2.7 p17; unit 33 -->

<!-- source: CN V2.7 p17; unit 34 -->

最后，使能 u-boot 开机 logo 显示功能需要在 dts 中配置如下：

<!-- source: CN V2.7 p17; unit 35 -->

以 RGB 作为输入：

<!-- source: CN V2.7 p17; unit 36 -->

```text
 &route_rgb {
      status = "okay";

+
+     bridge = <&i2c2_rk628>;
 };
```

<!-- source: CN V2.7 p17; unit 37 -->

以 HDMI 作为输入：

<!-- source: CN V2.7 p17; unit 38 -->

```text
&route_hdmi {
      status = "okay";
+

+     bridge = <&i2c2_rk628>;
      force-bus-format = <MEDIA_BUS_FMT_RGB888_1X24>;
      force-output;
      force_timing{
```

<!-- source: CN V2.7 p17; unit 39 -->

为了保证 uboot logo 在跳转 kernel logo 时过渡没有闪烁，内核要确保导入如下提交信息的补丁：

<!-- source: CN V2.7 p17; unit 40 -->

```text
misc: rk628: add support uboot logo

Type: Function

Redmine ID: #496880 #491750
Associated modifications: NULL
Test: NULL

Change-Id: I311e2c9682f835b377ea9082e1d3a88688167172
Signed-off-by: Guochun Huang <hero.huang@rock-chips.com>
```

<!-- source: CN V2.7 p17; unit 41 -->

#### 3.1.2   kernel（drivers/misc/rk628）

<!-- source: CN V2.7 p17; unit 42 -->

在 RK 平台内核中，若为首次添加 RK628 Misc 驱动或 drivers/misc 下不存在 RK628 驱动，则把内核中Misc 的 RK628 驱动源码直接拷贝到 drivers/misc 下，并修改 drivers/misc/Kconfig、drivers/misc/Makefile、arch/arm64/configs/rockchip_defconfig，添加 rk628 的编译即可。参考如下补丁：

<!-- source: CN V2.7 p18; unit 43 -->

```text
diff --git a/drivers/misc/Kconfig b/drivers/misc/Kconfig
index 276c7c4fef15..8481b9613bc9 100644
--- a/drivers/misc/Kconfig

+++ b/drivers/misc/Kconfig
@@ -5,6 +5,8 @@

 menu "Misc devices"

+source "drivers/misc/rk628/Kconfig"
+
 config RK803
      tristate "RK803"
      default n
diff --git a/drivers/misc/Makefile b/drivers/misc/Makefile
index b296e760fd47..14642c54a2bc 100644

--- a/drivers/misc/Makefile
+++ b/drivers/misc/Makefile
@@ -3,6 +3,7 @@
 # Makefile for misc devices that really don't fit anywhere else.
 #

+obj-y                 += rk628/
 obj-$(CONFIG_RK803)   += rk803.o
 obj-y                 += rockchip/
 obj-$(CONFIG_LT7911D_FB_NOTIFIER) += lt7911d-fb-notifier.o
diff --git a/arch/arm64/configs/rockchip_defconfig b/arch/arm64/configs/rockchip_defconfig
index 28340b4bdfae..dbb7d9e55b62 100644

--- a/arch/arm64/configs/rockchip_defconfig
+++ b/arch/arm64/configs/rockchip_defconfig
@@ -294,6 +294,8 @@ CONFIG_BLK_DEV_LOOP_MIN_COUNT=16
 CONFIG_BLK_DEV_RAM=y
 CONFIG_BLK_DEV_RAM_SIZE=8192
 CONFIG_BLK_DEV_NVME=y
+CONFIG_RK628_MISC=y
+CONFIG_RK628_MISC_HDMITX=y
 CONFIG_LT7911D_FB_NOTIFIER=y
 CONFIG_SRAM=y
 CONFIG_UID_SYS_STATS=y
@@ -557,7 +559,6 @@ CONFIG_ROCKCHIP_THERMAL=y

 CONFIG_WATCHDOG=y
 CONFIG_DW_WATCHDOG=y
 CONFIG_MFD_RK618=y
-CONFIG_MFD_RK628=y
 CONFIG_MFD_RK630_I2C=y
 CONFIG_MFD_RK806_I2C=y
 CONFIG_MFD_RK806_SPI=y
@@ -640,7 +641,6 @@ CONFIG_ROCKCHIP_LVDS=y
 CONFIG_ROCKCHIP_RGB=y
 CONFIG_ROCKCHIP_DW_HDCP2=y
 CONFIG_DRM_ROCKCHIP_RK618=y
-CONFIG_DRM_ROCKCHIP_RK628=y
CONFIG_DRM_PANEL_SIMPLE=y
CONFIG_DRM_PANEL_MAXIM_MAX96752F=y
CONFIG_DRM_PANEL_MAXIM_MAX96772=y
```

<!-- source: CN V2.7 p18; unit 44 -->

<!-- source: CN V2.7 p18; unit 45 -->

<!-- source: CN V2.7 p19; unit 46 -->

<!-- source: CN V2.7 p19; unit 47 -->

需要注意：CONFIG_MFD_RK628 以及 CONFIG_DRM_ROCKCHIP_RK628 为旧版本的 RK628 驱动，在rockchip_defconfig 文件中需要将其删除。

<!-- source: CN V2.7 p19; unit 48 -->

Misc 的驱动默认都会编译，只需要通过配置 dts 选择运行对应的驱动。

<!-- source: CN V2.7 p19; unit 49 -->

### 3.2   HDMI IN 通路（drivers/media/i2c/rk628）

<!-- source: CN V2.7 p19; unit 50 -->

kernel-5.10 之前的版本，使用 rk628_for-all 的补丁包，kernel-5.10 的版本，使用kernel_5.10_rk628_media_patch 的补丁包。把 Media 相关的 rk628 驱动直接拷贝到drivers/media/i2c/rk628/ 下，并修改 drivers/media/i2c/Kconfig、drivers/media/i2c/Makefile、arch/arm64/configs/rockchip_defconfig，添加 rk628 的编译即可。参考如下补丁：

<!-- source: CN V2.7 p19; unit 51 -->

```text
diff --git a/drivers/media/i2c/Kconfig b/drivers/media/i2c/Kconfig
index f3273756c612..609bb5e3db07 100644
--- a/drivers/media/i2c/Kconfig

+++ b/drivers/media/i2c/Kconfig
@@ -414,6 +414,8 @@ config VIDEO_OTP_EEPROM
      help
       This driver supports OTP load from eeprom.

+source "drivers/media/i2c/rk628/Kconfig"
+
 config VIDEO_SAA7110
      tristate "Philips SAA7110 video decoder"
      depends on VIDEO_V4L2 && I2C
diff --git a/drivers/media/i2c/Makefile b/drivers/media/i2c/Makefile
index 26edd6f7590e..d6f4128b19a5 100644

--- a/drivers/media/i2c/Makefile
+++ b/drivers/media/i2c/Makefile
@@ -141,6 +141,7 @@ obj-$(CONFIG_VIDEO_ML86V7667) += ml86v7667.o
 obj-$(CONFIG_VIDEO_OV2659) += ov2659.o
 obj-$(CONFIG_VIDEO_TC358743) += tc358743.o
 obj-$(CONFIG_VIDEO_TC35874X) += tc35874x.o
+obj-$(CONFIG_VIDEO_RK628) += rk628/
 obj-$(CONFIG_VIDEO_AR0230) += ar0230.o
 obj-$(CONFIG_VIDEO_GC02M2) += gc02m2.o
 obj-$(CONFIG_VIDEO_GC08A3) += gc08a3.o
diff --git a/arch/arm64/configs/rockchip_defconfig b/arch/arm64/configs/rockchip_defconfig
index 95ad81b12a69..c66f67ecd0c2 100644

--- a/arch/arm64/configs/rockchip_defconfig
+++ b/arch/arm64/configs/rockchip_defconfig
@@ -567,6 +567,8 @@ CONFIG_VIDEO_ROCKCHIP_ISPP=y
 CONFIG_VIDEO_ROCKCHIP_HDMIRX=y
 CONFIG_VIDEO_LT6911UXC=y
 CONFIG_VIDEO_LT7911D=y
+CONFIG_VIDEO_RK628_CSI=y
+CONFIG_VIDEO_RK628_BT1120=y
 CONFIG_VIDEO_TC35874X=y
 CONFIG_VIDEO_GC0312=y
 CONFIG_VIDEO_GC2145=y
```

<!-- source: CN V2.7 p19; unit 52 -->

<!-- source: CN V2.7 p20; unit 53 -->

<!-- source: CN V2.7 p20; unit 54 -->

Media 的驱动默认都会编译，只需要通过配置 dts 选择运行对应的驱动。

<!-- source: CN V2.7 p20; unit 55 -->

## 4.   SOC 与 RK628 I2C 通信

<!-- source: CN V2.7 p20; unit 56 -->

SOC 使用 I2C 与 RK628 进行通信，RK628 典型的 7bit I2C 地址为 0x50，在同一个 I2C 总线下使用多片RK628 时，可通过 RK628 的 GPIO 改变 I2C 地址，参考如下：

<!-- source: CN V2.7 p20; unit 57 -->

![原始技术图 — CN V2.7, p20](/docs/rockchip-rk628-porting/assets/cn-p20-X250.png)

*原始技术图: CN V2.7, p20.*

图中文字：I2C 地址共 7 位，高 4 位为器件标识，设置为 4'b1010；低 3 位为器件地址。为适配不同场景，可通过 GPIO 编程从机地址。典型地址为 7'b1010000。

| Addr bit | Pad Name | GPIO Setting |
| --- | --- | --- |
| cfg_slvadr[2] | IO_GPIO0a1 | GPIO0A_OE[1]=1’b1 |
| cfg_slvadr[1] | IO_GPIO0a0 | GPIO0A_OE[0]=1’b1 |
| cfg_slvadr[0] | IO_GPIO3b3 | GPIO3B_OE[2]=1’b1 |

<!-- source: CN V2.7 p20; unit 58 -->

以从机地址 0x50 和 0x51 为例：

<!-- source: CN V2.7 p20; unit 59 -->

![原始技术图 — CN V2.7, p20](/docs/rockchip-rk628-porting/assets/cn-p20-X251.png)

*原始技术图: CN V2.7, p20.*

<!-- source: CN V2.7 p20; unit 60 -->

![原始技术图 — CN V2.7, p20](/docs/rockchip-rk628-porting/assets/cn-p20-X252.png)

*原始技术图: CN V2.7, p20.*

| I2C SEL | I2C ADDR |
| --- | --- |
| 0 | 7'b1010000 (0x50) |
| 1 | 7'b1010001 (0x51) |

<!-- source: CN V2.7 p20; unit 61 -->

GPIO0a0 和 GPIO0a1 保持低电平，GPIO3b3 拉高，则从机地址为 0x51 (7'b1010001)，GPIO3b3 拉低，则从机地址为 0x50 (7'b1010000)。

<!-- source: CN V2.7 p21; unit 62 -->

## 5.   Misc

<!-- source: CN V2.7 p21; unit 63 -->

### 5.1   MISC 驱动介绍

<!-- source: CN V2.7 p21; unit 64 -->

RK628 Misc 驱动为 RK628 Display 通路的驱动代码，使用 RK628 进行显示协议转换，支持以 RGB、BT1120 或 HDMI 作为输入，输出 LVDS、GVI、DSI、RGB、BT1120 或 HDMI。

<!-- source: CN V2.7 p21; unit 65 -->

#### 5.1.1   驱动移植说明

<!-- source: CN V2.7 p21; unit 66 -->

参考《驱动移植说明》-《Display 通路》章节

<!-- source: CN V2.7 p21; unit 67 -->

#### 5.1.2   u-boot 驱动目录结构

<!-- source: CN V2.7 p21; unit 68 -->

```text
drivers/video/drm/rk628/
├── Makefile

├── panel.c
├── panel.h
├── rk628.c
├── rk628_combtxphy.c
├── rk628_combtxphy.h
├── rk628_cru.c
├── rk628_cru.h
├── rk628_dsi.c
├── rk628_dsi.h
├── rk628_gvi.c
├── rk628_gvi.h
├── rk628.h

├── rk628_hdmirx.c
├── rk628_hdmirx.h
├── rk628_hdmitx.h
├── rk628_lvds.c
├── rk628_lvds.h
├── rk628_post_process.c
├── rk628_post_process.h
├── rk628_rgb.c
└── rk628_rgb.h
```

<!-- source: CN V2.7 p21; unit 69 -->

#### 5.1.3   kernel 驱动目录结构

<!-- source: CN V2.7 p21; unit 70 -->

```text
drivers/misc/rk628/
├── Kconfig
├── Makefile

├── panel.c
├── panel.h
├── rk628.c
├── rk628_combrxphy.c
├── rk628_combrxphy.h
├── rk628_combtxphy.c
├── rk628_combtxphy.h
├── rk628_config.c

├── rk628_config.h
├── rk628_cru.c
├── rk628_cru.h
├── rk628_csi.c
├── rk628_csi.h
├── rk628_dsi.c
├── rk628_dsi.h
├── rk628_efuse.c
├── rk628_efuse.h
├── rk628_gpio.h
├── rk628_grf.h
├── rk628_gvi.c

├── rk628_gvi.h
├── rk628.h
├── rk628_hdmirx.c
├── rk628_hdmirx.h
├── rk628_hdmitx.c
├── rk628_hdmitx.h
├── rk628_lvds.c
├── rk628_lvds.h
├── rk628_pinctrl.c
├── rk628_pinctrl.h
├── rk628_post_process.c
├── rk628_post_process.h
├── rk628_rgb.c

├── rk628_rgb.h
```

<!-- source: CN V2.7 p22; unit 71 -->

<!-- source: CN V2.7 p22; unit 72 -->

#### 5.1.4   驱动 DTS 配置总览

<!-- source: CN V2.7 p22; unit 73 -->

以 RGB -> DSI 通路为例

<!-- source: CN V2.7 p22; unit 74 -->

```text
&i2c2 {
   clock-frequency = <400000>;

   status = "okay";

   i2c2_rk628: rk628@50 {
      compatible = "rockchip,rk628";
      reg = <0x50>;
      interrupt-parent = <&gpio0>;
      interrupts = <20 IRQ_TYPE_LEVEL_HIGH>;
      enable-gpios = <&gpio0 RK_PC1 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio2 RK_PA2 GPIO_ACTIVE_LOW>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_reset>;
      status = "okay";
   };

};

&pinctrl {
   rk628 {
      rk628_reset: rk628-reset {
         rockchip,pins = <2 RK_PA2 RK_FUNC_GPIO &pcfg_pull_none>;
      };

   };
};

&i2c2_rk628 {
   /* soc_24M optional */
   pinctrl-names = "default";
   pinctrl-0 = <&rk628_reset &refclk_pins>;
   assigned-clocks = <&pmucru CLK_WIFI>;
   assigned-clock-rates = <24000000>;
   clocks = <&pmucru CLK_WIFI>;
   clock-names = "soc_24M";


   panel-backlight = <&backlight>;
   panel-power-supply = <&vcc3v3_lcd0_n>;
   panel-enable-gpios = <&gpio2 RK_PC6 GPIO_ACTIVE_HIGH>;

   panel-reset-delay-ms = <10>;
   panel-enable-delay-ms = <10>;
   panel-prepare-delay-ms = <60>;
   panel-unprepare-delay-ms = <10>;
   panel-disable-delay-ms = <60>;
   panel-init-delay-ms = <60>;

   rk628-rgb-in;
   rk628-dsi-out {

      dsi,eotp;
      dsi,video-mode;
      dsi,format = "rgb888";
      dsi,lanes = <4>;
      status = "okay";

      rk628-panel {
         panel-init-sequence = [
            05 78 01 11
            05 78 01 29
         ];


         panel-exit-sequence = [
            05 00 01 28
            05 00 01 10
         ];
      };
   };

   display-timings {
      src-timing {
         clock-frequency = <148500000>;
         hactive = <1920>;
         vactive = <1080>;
         hfront-porch = <88>;

         hsync-len = <44>;
         hback-porch = <148>;
         vfront-porch = <4>;
         vsync-len = <5>;
         vback-porch = <36>;
         hsync-active = <1>;

         vsync-active = <1>;
         de-active = <0>;
         pixelclk-active = <0>;
      };

      dst-timing {
         clock-frequency = <148500000>;
         hactive = <1920>;
         vactive = <1080>;
         hfront-porch = <88>;
         hsync-len = <44>;
         hback-porch = <148>;

         vfront-porch = <4>;
         vsync-len = <5>;
         vback-porch = <36>;
         hsync-active = <1>;
         vsync-active = <1>;
         de-active = <0>;
         pixelclk-active = <0>;
      };
   };
};
```

<!-- source: CN V2.7 p23; unit 75 -->

<!-- source: CN V2.7 p24; unit 76 -->

<!-- source: CN V2.7 p24; unit 77 -->

### 5.2   驱动核心配置

<!-- source: CN V2.7 p24; unit 78 -->

#### 5.2.1   RK628 节点配置

<!-- source: CN V2.7 p24; unit 79 -->

SOC 使用 I2C 与 RK628 进行通信，以 RK3568 为例，在 DTS 的 I2C 节点（i2c2）下添加 RK628 节点（i2c2_rk628: rk628@50）：

<!-- source: CN V2.7 p24; unit 80 -->

```text
&i2c2 {
   clock-frequency = <400000>;

   status = "okay";

   i2c2_rk628: rk628@50 {
      compatible = "rockchip,rk628";
      reg = <0x50>;
      enable-gpios = <&gpio0 RK_PC1 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio2 RK_PA2 GPIO_ACTIVE_LOW>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_reset>;
      status = "okay";
   };
};


&pinctrl {
   rk628 {
      rk628_reset: rk628-reset {
         rockchip,pins = <2 RK_PA2 RK_FUNC_GPIO &pcfg_pull_none>;
      };
   };
};
```

<!-- source: CN V2.7 p25; unit 81 -->

<!-- source: CN V2.7 p25; unit 82 -->

RK628 节点属性说明

<!-- source: CN V2.7 p25; unit 83 -->

| Property | Description | Option Value |
| --- | --- | --- |
| compatible | compatible | RK628 Misc 驱动的 compatible 需设置为<br>"rockchip,rk628" |
| reg | RK628 I2C 从机地址 | 0x50/0x51，根据硬件进行配置 |
| enable-gpios | RK628 使能 GPIO 引用 | 根据硬件进行配置 |
| reset-gpios | RK628 复位 GPIO 引用 | 根据硬件进行配置 |
| pinctrl-names | 设置 RK628 reset 引脚的复用功<br>能为 GPIO 功能 | 根据硬件进行配置 |
| pinctrl-0 | 设置 RK628 reset 引脚的复用功<br>能为 GPIO 功能 | 根据硬件进行配置 |

<!-- source: CN V2.7 p25; unit 84 -->

#### 5.2.2   24MHz 工作时钟配置

<!-- source: CN V2.7 p25; unit 85 -->

RK628 的 24MHz 工作时钟可以来自硬件上外接的 24M 晶振，也可以取自 SOC 的 24MHz CLK 引脚，使用外接 24M 晶振作为工作时钟可忽略以下配置。

<!-- source: CN V2.7 p25; unit 86 -->

需要注意的是，在 RK628D HDMI / GVI OUT 相应的通路场景以及 RK628F/H RGB ->HDMI 通路场景下，需要 SOC 输出的 24MHz CLK 引脚作为 RK628 的工作时钟实现时钟同源，接外接的 24M 晶振作为工作时钟可能会导致该场景显示异常。（RK628F/H 在同源问题上做了优化，以 HDMI RX 检测到的TMDS CLK 作为 CRU PLL 的基准时钟，所以在以 HDMI IN 的通路场景下不需要配置来自 SOC 的24MHz CLK 作为基准时钟）

<!-- source: CN V2.7 p25; unit 87 -->

以 RK3568 为例（更多 RK 平台配置参考《RK628 24M 晶振来自其他 SOC 的配置方式》章节），RK3568 能输出 24MHz 的引脚比较多，例如 REF_CLKOUT（clk_wifi / gpio0_a0）、CAM_CLKOUT1（clk_cam1_out / gpio4_b0）、ETH_REFCLK_25M_M0（clk_mac1_out / gpio3_b0），现以第一个为例介绍。

<!-- source: CN V2.7 p25; unit 88 -->

1\. 在 DTS 的 RK628 节点中引用以下配置

<!-- source: CN V2.7 p25; unit 89 -->

```text
&i2c2_rk628 {
   /* soc_24M optional */
   pinctrl-names = "default";

   pinctrl-0 = <&rk628_reset &refclk_pins>;
   assigned-clocks = <&pmucru CLK_WIFI>;
   assigned-clock-rates = <24000000>;
   clocks = <&pmucru CLK_WIFI>;
   clock-names = "soc_24M";
   ......
};
```

<!-- source: CN V2.7 p26; unit 90 -->

2\. 以下配置在 rk3568-pinctrl.dtsi 中自带

<!-- source: CN V2.7 p26; unit 91 -->

```text
&pinctrl {
   ......
   refclk {

      /omit-if-no-ref/
      refclk_pins: refclk-pins {
         rockchip,pins =
           /* refclk_ou */
           <0 RK_PA0 1 &pcfg_pull_none>;
      };
   };
   ......
};
```

<!-- source: CN V2.7 p26; unit 92 -->

24MHz CLK 属性说明

<!-- source: CN V2.7 p26; unit 93 -->

| Property | Description | Option Value |
| --- | --- | --- |
| pinctrl-names | 设置 refclk 引脚的复用功能 | 根据硬件进行配置<br>（因为是复写上述 RK628 节点属<br>性，<br>所以需要补充上 rk628_reset 引用） |
| pinctrl-0 | 设置 refclk 引脚的复用功能 | 根据硬件进行配置<br>（因为是复写上述 RK628 节点属<br>性，<br>所以需要补充上 rk628_reset 引用） |
| assigned-clocks | 为 RK628 分配的时钟引用 | 根据硬件进行配置 |
| assigned-clock-rates | 为 RK628 分配的时钟速率（Hz） | <24000000> |
| clocks | 引用时钟的 handle 列表 | 根据硬件进行配置 |
| clock-names | 为该时钟设置名称 | "soc_24M" |

<!-- source: CN V2.7 p26; unit 94 -->

#### 5.2.3   输入输出模块选择

<!-- source: CN V2.7 p26; unit 95 -->

在 DTS 的 RK628 节点中，根据输入输出模块需求，配置对应的模块属性（bool 类型）或节点，模块节点中配置模块相应的功能参数：

<!-- source: CN V2.7 p26; unit 96 -->

```text
&i2c2_rk628 {
   ......

   rk628-rgb-in;
   rk628-dsi-out {
      ......
   };
   ......
};
```

<!-- source: CN V2.7 p26; unit 97 -->

以 RGB -> DSI 通路为例，设置 “rk628-rgb-in;” 属性配置 RGB 模块作为输入，设置 “rk628-dsi-out” 节点配置 DSI 模块作为输出。目前 Misc 输入模块有 RGB IN、BT1120 IN 或 HDMI IN，输出模块有LVDS、GVI、DSI、或 HDMI。各个输入输出模块配置详见《输入模块配置》及《输出模块配置》章节。

<!-- source: CN V2.7 p27; unit 98 -->

#### 5.2.4   Panel 端配置

<!-- source: CN V2.7 p27; unit 99 -->

在 DTS 的 RK628 节点中，根据屏 Spec 配置屏相关的属性，包括背光、电源、复位引脚、屏上电时序、显示时序等（HDMITX 通路无需配置）：

<!-- source: CN V2.7 p27; unit 100 -->

```text
&i2c2_rk628 {
   ......

   panel-backlight = <&backlight>;
   panel-power-supply = <&vcc3v3_lcd0_n>;
   panel-enable-gpios = <&gpio2 RK_PC6 GPIO_ACTIVE_HIGH>;

   panel-reset-delay-ms = <10>;
   panel-enable-delay-ms = <10>;
   panel-prepare-delay-ms = <60>;
   panel-unprepare-delay-ms = <10>;
   panel-disable-delay-ms = <60>;
   panel-init-delay-ms = <60>;
   ......
   display-timings {
      src-timing {

         clock-frequency = <148500000>;
         hactive = <1920>;
         vactive = <1080>;
         hfront-porch = <88>;
         hsync-len = <44>;
         hback-porch = <148>;
         vfront-porch = <4>;
         vsync-len = <5>;
         vback-porch = <36>;
         hsync-active = <1>;
         vsync-active = <1>;
         de-active = <0>;

         pixelclk-active = <0>;
      };

      dst-timing {
         clock-frequency = <148500000>;
         hactive = <1920>;
         vactive = <1080>;
         hfront-porch = <88>;
         hsync-len = <44>;
         hback-porch = <148>;
         vfront-porch = <4>;
         vsync-len = <5>;
         vback-porch = <36>;

         hsync-active = <1>;
         vsync-active = <1>;
         de-active = <0>;
         pixelclk-active = <0>;
      };
   };
   ......
};
```

<!-- source: CN V2.7 p28; unit 101 -->

屏相关属性说明

<!-- source: CN V2.7 p28; unit 102 -->

| Property | Description | Option Value |
| --- | --- | --- |
| panel-enable-gpios | 屏使能 GPIO 引用 [option] | 根据硬件进行配置 |
| panel-reset-gpios | 屏复位 GPIO 引用 [option] | 根据硬件进行配置 |
| panel-backlight | 屏背光 [option] | 根据硬件进行配置 |
| panel-reset-delay-ms | 屏上电时序 | 参考屏规格书 |
| panel-enable-delay-ms | 屏上电时序 | 参考屏规格书 |
| panel-prepare-delay-ms | 屏上电时序 | 参考屏规格书 |
| panel-unprepare-delay-ms | 屏上电时序 | 参考屏规格书 |
| panel-disable-delay-ms | 屏上电时序 | 参考屏规格书 |
| panel-init-delay-ms | 屏上电时序 | 参考屏规格书 |
| src-timing | SOC 传输到 RK628 的显示时序节<br>点 | 与 dst-timing 按行列分别缩<br>放 |
| dst-timing | 屏端显示时序节点 | 参考屏规格书 |
| clock-frequency | 显示时序 | 参考屏规格书与实际 scaler |
| hactive | 显示时序 | 参考屏规格书与实际 scaler |
| vactive | 显示时序 | 参考屏规格书与实际 scaler |
| hfront-porch | 显示时序 | 参考屏规格书与实际 scaler |
| hback-porch | 显示时序 | 参考屏规格书与实际 scaler |
| hsync-len | 显示时序 | 参考屏规格书与实际 scaler |
| vfront-porch | 显示时序 | 参考屏规格书与实际 scaler |
| vback-porch | 显示时序 | 参考屏规格书与实际 scaler |
| vsync-len | 显示时序 | 参考屏规格书与实际 scaler |
| hsync-active | 显示时序 | 参考屏规格书与实际 scaler |
| vsync-active | 显示时序 | 参考屏规格书与实际 scaler |
| de-active | 显示时序 | 参考屏规格书与实际 scaler |
| pixelclk-active | 显示时序 | 参考屏规格书与实际 scaler |

<!-- source: CN V2.7 p28; unit 103 -->

如果 RK628 输入端与输出端的分辨率采用缩放方式，则将输入端的 timing 配置到 src-timing，将输出端 timing 配置到 dst-timing。缩放前后 timing 需要保证显示部分与消隐部分缩放比例一致：

<!-- source: CN V2.7 p29; unit 104 -->

```text
src: hactive / dst: hactive = src: hblanking / dst: hblanking
src: vactive / dst: vactive = src: vblanking / dst: vblanking
hblanking = hfront-porch + hback-porch + hsync-len

vblanking = vfront-porch + vback-porch + vsync-len
```

<!-- source: CN V2.7 p29; unit 105 -->

且缩放前后帧率需要保持一致

<!-- source: CN V2.7 p29; unit 106 -->

```text
src: clock-frequency / (htotal * vtotal) = dst: clock-frequency / (htotal *
vtotal)
htotal = hactive + hfront-porch + hback-porch + hsync-len

vtotal = vactive + vfront-porch + vback-porch + vsync-len
```

<!-- source: CN V2.7 p29; unit 107 -->

如果输入端与输出端分辨率一致，则 src-timing 和 dst-timing 配置相同的目标 timing。

<!-- source: CN V2.7 p29; unit 108 -->

如果用到两个同分辨率的 DSI 单屏或两个同分辨率的 LVDS 单屏，需要对 src-timing 和 dst-timing 中的clock-frequency、hactive、hfront-porch、hback-porch 和 hsync-len 在原有单屏配置基础上乘以 2。

<!-- source: CN V2.7 p29; unit 109 -->

#### 5.2.5   不同显示组合通路应用

<!-- source: CN V2.7 p29; unit 110 -->

参考如下 DTS，具体通路介绍详见《目前 DTS 支持的几种组合》章节。

<!-- source: CN V2.7 p29; unit 111 -->

```text
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2bt1120-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2dsi-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2dsi-dual-ddr4-v10.dts

arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2gvi-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2lvds-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2lvds-dual-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2dsi-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2gvi-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2hdmi-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2lvds-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2lvds-dual-ddr4-v10.dts
```

<!-- source: CN V2.7 p29; unit 112 -->

#### 5.2.6   输出信号调节

<!-- source: CN V2.7 p29; unit 113 -->

##### 5.2.6.1   GVI / LVDS / MIPI TX 信号调节

<!-- source: CN V2.7 p29; unit 114 -->

1\. comb_tx 电压和预加重调节寄存器支持 10 对 lane 独立调节（对应寄存器配置的 tx0 ~ tx9），这 10 对 lane 与接口的对应关系如下：

<!-- source: CN V2.7 p30; unit 116 -->

| COMB_TX | GVI | LVDS / MIPI |
| --- | --- | --- |
| TX0 P/N | GVI_TX0 P/N | L/M0_TX0 P/N |
| TX1 P/N | GVI_TX1 P/N | L/M0_TX1 P/N |
| TX2 P/N | / | L/M0_TXCLK P/N |
| TX3 P/N | GVI_TX2 P/N | L/M0_TX2 P/N |
| TX4 P/N | GVI_TX3 P/N | L/M0_TX3 P/N |
| TX5 P/N | GVI_TX4 P/N | L/M1_TX0 P/N |
| TX6 P/N | GVI_TX5 P/N | L/M1_TX1 P/N |
| TX7 P/N | / | L/M1_TXCLK P/N |
| TX8 P/N | GVI_TX6 P/N | L/M1_TX2 P/N |
| TX9 P/N | GVI_TX7 P/N | L/M1_TX3 P/N |

<!-- source: CN V2.7 p30; unit 117 -->

2\. 可以通过直接写寄存器来调节信号做测试（重启后配置不保存；需要固定配置，参考下方补丁修改）

<!-- source: CN V2.7 p30; unit 118 -->

```text
# 1. 电压缩放 N=0(75%), 1/2(100%), 3(125%) (通常无需调节)
# echo 0x90004 $val > /d/rk628/2-0050/registers/combtxphy

# $val:
#   tx0[Bit1:0], tx1[Bit3:2], tx2[Bit5:4], tx3[Bit7:6], tx4[Bit9:8]
#   tx5[Bit17:16], tx6[Bit19:18], tx7[Bit21:20], tx8[Bit23:22], tx9[Bit25:24]
# 以 1(100%) 为例:
echo 0x90004 0x01550155 > /d/rk628/2-0050/registers/combtxphy

# 2. 电压调节 N=0~7
# echo 0x90008 $val > /d/rk628/2-0050/registers/combtxphy
# $val:
#   tx0[Bit2:0], tx1[Bit5:3], tx2[Bit8:6], tx3[Bit11:9], tx4[Bit14:12]
#   tx5[Bit18:16], tx6[Bit21:19], tx7[Bit24:22], tx8[Bit27:25], tx9[Bit30:28]
# 以 3 档为例:
echo 0x90008 0x36db36db > /d/rk628/2-0050/registers/combtxphy


# 3. 预加重调节 N=0~9
# echo 0x9000c $val > /d/rk628/2-0050/registers/combtxphy
# $val: tx0[Bit3:0], tx1[Bit7:4], tx2[Bit11:8], tx3[Bit15:12], tx4[Bit19:16]
# echo 0x90010 $val > /d/rk628/2-0050/registers/combtxphy
# $val: tx5[Bit3:0], tx6[Bit7:4], tx7[Bit11:8], tx8[Bit15:12], tx9[Bit19:16]
# 以 5 档为例:
echo 0x9000c 0x55555 > /d/rk628/2-0050/registers/combtxphy
echo 0x90010 0x55555 > /d/rk628/2-0050/registers/combtxphy
```

<!-- source: CN V2.7 p30; unit 119 -->

3\. 输出信号调节补丁（以 GVI TX 为例，配置值参考上述说明）

<!-- source: CN V2.7 p30; unit 120 -->

```text
diff --git a/drivers/misc/rk628/rk628_combtxphy.c b/drivers/misc/rk628/rk628_combtxphy.c

index 3387d8bd73b9..70d7a5422a35 100644
--- a/drivers/misc/rk628/rk628_combtxphy.c
+++ b/drivers/misc/rk628/rk628_combtxphy.c
@@ -139,6 +139,14 @@ static void rk628_combtxphy_gvi_power_on(struct rk628
*rk628)
      usleep_range(100, 200);

      rk628_i2c_update_bits(rk628, COMBTXPHY_CON0,
                      SW_TX_IDLE_MASK, 0);
+
+     // amplitude scale
+     rk628_i2c_write(rk628, COMBTXPHY_CON1, 0x01550155);
+     // amplitude level
+     rk628_i2c_write(rk628, COMBTXPHY_CON2, 0x36db36db);
+     // emphasis level
+     rk628_i2c_write(rk628, COMBTXPHY_CON3, 0x00055555);
+     rk628_i2c_write(rk628, COMBTXPHY_CON4, 0x00055555);
 }


 void rk628_combtxphy_power_on(struct rk628 *rk628)
```

<!-- source: CN V2.7 p31; unit 121 -->

<!-- source: CN V2.7 p31; unit 122 -->

##### 5.2.6.2   HDMI TX 信号调节

<!-- source: CN V2.7 p31; unit 123 -->

1\. 可以通过直接写寄存器来调节信号做测试（重启后配置不保存；需要固定配置，参考下方补丁修改）

<!-- source: CN V2.7 p31; unit 124 -->

```text
# 1. 驱动强度调节
# echo 0x70388 $val > /d/rk628/2-0050/registers/hdmi

# $val: clk_driver_strength[Bit7:4], data_driver_strength[Bit3:0]
#      范围（强度从低到高）：0x0  ~ 0xF
# 以 0x8 为例:
echo 0x70388 0x88 > /d/rk628/2-0050/registers/hdmi

# 2. 预加重调节
# echo 0x7038c $val > /d/rk628/2-0050/registers/hdmi
# $val: pre_emphasis_strength[Bit6:4]
#      范围（强度从低到高）：0x0  ~ 0x7
#     clk_pre_driver_strength[Bit3:2], data_pre_driver_strength[Bit1:0]
#      范围（强度从低到高）：0x0  ~ 0x3
# 以 pre_emphasis_strength = 0x3, clk/data_pre_driver_strength = 0x3 为例:

echo 0x7038c 0x3f > /d/rk628/2-0050/registers/hdmi
```

<!-- source: CN V2.7 p31; unit 125 -->

2\. HDMI 输出信号调节补丁（将 (74.25M, 165M] 范围细分为 (74.25M, 148.5M] 以及 (148.5M , 165M] 两档调节为例）

<!-- source: CN V2.7 p31; unit 127 -->

{ 频段范围上限，预加重，驱动强度} 配置值参考上述说明

<!-- source: CN V2.7 p32; unit 128 -->

```text
diff --git a/drivers/misc/rk628/rk628_hdmitx.c b/drivers/misc/rk628/rk628_hdmitx.c
index f28b78a6b525..2120cf504ebe 100644

--- a/drivers/misc/rk628/rk628_hdmitx.c
+++ b/drivers/misc/rk628/rk628_hdmitx.c
@@ -231,6 +231,7 @@ static void rk628_hdmi_sys_power(struct rk628_hdmi *hdmi,
bool enable)
 static struct rk628_hdmi_phy_config rk628_hdmi_phy_config[] = {
      /* pixelclk pre-emp vlev */
      { 74250000, 0x3f, 0x88 },
+     { 148500000, 0x3f, 0x88 },
      { 165000000, 0x3f, 0x88 },
      { ~0UL,  0x00, 0x00 }
 };
```

<!-- source: CN V2.7 p32; unit 129 -->

##### 5.2.6.3   SSC（展频）

<!-- source: CN V2.7 p32; unit 130 -->

1\. 对 CPLL 全局展频来实现输出信号展频（GVI TX 场景下）

<!-- source: CN V2.7 p32; unit 131 -->

```text
# echo 0xc000c $((val | 0xffff0000)) > /d/rk628/2-0050/registers/cru
# $val:
#   ssmod_spread[Bit12:8](Spread amplitude / 0.1%)

#   ssmod_divval[Bit7:4](Divider required to set the modulation frequency)
#   参数说明⻅下方描述
# 例 ssmod_spread = 3, ssmod_divval = 6 (推荐值):
echo 0xc000c 0xffff0360 > /d/rk628/2-0050/registers/cru
```

<!-- source: CN V2.7 p32; unit 132 -->

（1）ssmod_spread [Bit12:8]：调制深度，一般不超过 5000ppm，但由于实际应用中的环境较为复杂，故需以实测为准，实测不能超过 0.3%，推荐设置为 0.3%，即 spread = 3；

<!-- source: CN V2.7 p32; unit 133 -->

（2）ssmod_divval [Bit7:4]：调制频率，调制频率表示频率变化的快慢，公式如下：

f_mod = f_CLKSSCG / (128 × divval)

f_CLKSSCG = f_PFD = f_REF / refdiv

<!-- source: CN V2.7 p32; unit 134 -->

其中，f_mod 为调制频率，应该在 30~33kHz 之间，f_REF 为参考时钟（即晶振时钟频率），refdiv 默认设置为 1，所以建议设置 divval = 6，此时 f_mod = 31.25KHz。

<!-- source: CN V2.7 p32; unit 135 -->

2\. SSC 补丁（以 GVI TX 为例，配置值参考上述说明）

<!-- source: CN V2.7 p32; unit 136 -->

```text
diff --git a/drivers/misc/rk628/rk628_combtxphy.c b/drivers/misc/rk628/rk628_combtxphy.c

index 3387d8bd73b9..70d7a5422a35 100644
--- a/drivers/misc/rk628/rk628_combtxphy.c
+++ b/drivers/misc/rk628/rk628_combtxphy.c
@@ -139,6 +139,9 @@ static void rk628_combtxphy_gvi_power_on(struct rk628 *rk628)
      usleep_range(100, 200);
      rk628_i2c_update_bits(rk628, COMBTXPHY_CON0,
                      SW_TX_IDLE_MASK, 0);
+
+     // ssmod
+     rk628_i2c_write(rk628, CRU_CPLL_CON3, 0xffff0360);
 }
void rk628_combtxphy_power_on(struct rk628 *rk628)
```

<!-- source: CN V2.7 p33; unit 137 -->

<!-- source: CN V2.7 p33; unit 138 -->

### 5.3   输入模块配置

<!-- source: CN V2.7 p33; unit 139 -->

#### 5.3.1   RGB 输入

<!-- source: CN V2.7 p33; unit 140 -->

##### 5.3.1.1   RGB 输入配置

<!-- source: CN V2.7 p33; unit 141 -->

1\. 在 DTS 的 RK628 节点中添加 “rk628-rgb-in;” bool 属性即可：

<!-- source: CN V2.7 p33; unit 142 -->

```text
&i2c2_rk628 {
   ......

   rk628-rgb-in;
   ......
};
```

<!-- source: CN V2.7 p33; unit 143 -->

需要注意的是，RGB IN / RGB OUT / BT1120 IN / BT1120 OUT 功能共用引脚，所以这四种功能不能同时存在。

<!-- source: CN V2.7 p33; unit 144 -->

2\. SOC 配置 RGB 输出，以 RK3568 为例，RGB 输出走 DRM 框架，将 RK628 虚拟作一块屏幕：

<!-- source: CN V2.7 p33; unit 145 -->

```text
/ {
   panel@0 {
      compatible = "simple-panel";


      disp_timings3: display-timings {
         native-mode = <&rgb2dsi_timing>;
         rgb2dsi_timing: timing0 {
           clock-frequency = <148500000>;
           hactive = <1920>;
           vactive = <1080>;
           hfront-porch = <88>;
           hsync-len = <44>;
           hback-porch = <148>;
           vfront-porch = <4>;
           vsync-len = <5>;
           vback-porch = <36>;

           hsync-active = <1>;
           vsync-active = <1>;
           de-active = <0>;
           pixelclk-active = <0>;
         };
      };

      port {
         panel_in_rgb: endpoint {
           remote-endpoint = <&rgb_out_panel>;
         };
      };

   };
};
&route_rgb {
   status = "okay";


   /* for u-boot logo display */
   bridge = <&i2c2_rk628>;
};

&rgb_in_vp2 {
   status = "okay";
};

&rgb {
   status = "okay";


   ports {
      port@1 {
         reg = <1>;

         rgb_out_panel: endpoint {
           remote-endpoint = <&panel_in_rgb>;
         };
      };
   };c
};
```

<!-- source: CN V2.7 p34; unit 146 -->

<!-- source: CN V2.7 p34; unit 147 -->

“panel@0/display-timings/timing0” 节点的时序需要与 “&i2c2_rk628/display-timings/src-timing” 节点的时序参数配置一致。

<!-- source: CN V2.7 p34; unit 148 -->

#### 5.3.2   BT1120 输入

<!-- source: CN V2.7 p34; unit 149 -->

##### 5.3.2.1   BT1120 输入配置

<!-- source: CN V2.7 p34; unit 150 -->

参考 “RGB 输入配置”，将 DTS 的 RK628 节点中的 “rk628-rgb-in;” bool 属性修改 “rk628-bt1120-in;” 为即可：

<!-- source: CN V2.7 p34; unit 151 -->

```text
&i2c2_rk628 {
   ......

   rk628-bt1120-in;
   // bt1120-dual-edge;
   // bt1120-yc-swap;
   // bt1120-uv-swap;
   ......
};
```

<!-- source: CN V2.7 p34; unit 152 -->

若需要配置 BT1120 为双边沿，则在 RK628 节点中添加 “bt1120-dual-edge;” bool 属性。

<!-- source: CN V2.7 p34; unit 153 -->

“bt1120-yc-swap” 属性及 “bt1120-uv-swap” 属性修改 RK628 解析 BT1120 信号在线缆上顺序，若画面显示图像正常但颜色异常时，可以尝试这两个属性。

<!-- source: CN V2.7 p34; unit 154 -->

需要注意的是，RGB IN / RGB OUT / BT1120 IN / BT1120 OUT 功能共用引脚，所以这四种功能不能同时存在。

<!-- source: CN V2.7 p35; unit 155 -->

#### 5.3.3   HDMI 输入

<!-- source: CN V2.7 p35; unit 156 -->

##### 5.3.3.1   HDMI 输入配置

<!-- source: CN V2.7 p35; unit 157 -->

目前 HDMI 输入有两种形态，一种是与 SOC 直连，一种是通过 HDMI 线缆连接。

<!-- source: CN V2.7 p35; unit 158 -->

##### 5.3.3.2   与 SOC 直连模式

<!-- source: CN V2.7 p35; unit 159 -->

在 DTS 的 RK628 节点中配置：

<!-- source: CN V2.7 p35; unit 160 -->

```text
&i2c2_rk628 {
   ......
   rk628-hdmi-in;

   // src-mode-4k-yuv420;
   ......
};
```

<!-- source: CN V2.7 p35; unit 161 -->

与 SOC 直连的模式，需要 HDMI 源默认输出，所以 RK628 不需要通过 io 引脚检测 HDMI 源端热插拔，且不支持分辨率切换。在该模式下，驱动采用轮询方式检测 HDMI 信号的输入。

<!-- source: CN V2.7 p35; unit 162 -->

若 HDMI 源输出 4K YUV420 （即 force-bus-format 属性设置为MEDIA_BUS_FMT_UYYVYY8_0_5X24，force_timing 设置为 4K 分辨率），则需要在 RK628 节点下配置“src-mode-4k-yuv420” bool 属性，因为 HDMIRX 无法提前判断 HDMI 源是否是 YUV420 输出。

<!-- source: CN V2.7 p35; unit 163 -->

SOC 指定输出特定分辨率的 HDMI 源：

<!-- source: CN V2.7 p35; unit 164 -->

SOC 配置 HDMI 输出，以 RK3568 为例，将 HDMI 配置为指定输出，可以指定输出源的 timing 及 bus-format：

<!-- source: CN V2.7 p35; unit 165 -->

```text
#include <dt-bindings/display/media-bus-format.h>

&hdmi {

   status = "okay";
   force-bus-format = <MEDIA_BUS_FMT_RGB888_1X24>;
   force-output;
   force_timing{
      clock-frequency = <594000000>;
      hactive = <3840>;
      vactive = <2160>;
      hback-porch = <296>;
      hfront-porch = <176>;
      vback-porch = <72>;
      vfront-porch = <8>;
      hsync-len = <88>;
      vsync-len = <10>;

      hsync-active = <1>;
      vsync-active = <1>;
      de-active = <0>;
      pixelclk-active = <0>;
   };
};

&hdmi_in_vp0 {
   status = "okay";
};


&hdmi_in_vp1 {
   status = "disabled";
};

&route_hdmi {
   status = "okay";

   /* for u-boot logo display */
   bridge = <&i2c2_rk628>;
   force-bus-format = <MEDIA_BUS_FMT_RGB888_1X24>;
   force-output;
   force_timing{

      clock-frequency = <594000000>;
      hactive = <3840>;
      vactive = <2160>;
      hback-porch = <296>;
      hfront-porch = <176>;
      vback-porch = <72>;
      vfront-porch = <8>;
      hsync-len = <88>;
      vsync-len = <10>;
      hsync-active = <1>;
      vsync-active = <1>;
      de-active = <0>;
      pixelclk-active = <0>;

   };
};
```

<!-- source: CN V2.7 p36; unit 166 -->

<!-- source: CN V2.7 p36; unit 167 -->

使能 “&route_hdmi” 节点是为了让 HDMIRX 通路可以显示开机的 kernel logo，“&route_hdmi” 节点下的 “force-output”、“force-bus-format”、 “force_timing” 需要与 “hdmi” 节点保持一致。

<!-- source: CN V2.7 p36; unit 168 -->

配置 force-bus-format 属性时，需要在该 dts 里添加头文件 <dt-bindings/display/media-bus-format.h>，该头文件包含各种显示数据格式。

<!-- source: CN V2.7 p36; unit 169 -->

SOC 强制输出 HDMI 补丁

<!-- source: CN V2.7 p36; unit 170 -->

在 RK SOC 平台上，配置 HDMI 强制输出指定分辨率需要打上如下相应的补丁（可以对照补丁内容与源码内容判断该补丁是否添加过）：

<!-- source: CN V2.7 p37; unit 171 -->

| 补丁列表 | commit message | 补丁说明 |
| --- | --- | --- |
| 0190-drm-bridge-dw-hdmi-qp-Support-hdmi-force-output-kernel-5-10.patch | drm/bridge: dw-hdmi-qp:<br>Support hdmi force<br>output | 在 rk 平台的kernel5.10版<br>本 hdmi tx 驱动没有该补丁<br>则需要导入 |
| 0190-drm-bridge-synopsys-Support-hdmi-force-output-kernel-5-10.patch | drm/bridge: synopsys:<br>Support hdmi force<br>output | 在 rk 平台的kernel5.10版<br>本 hdmi tx 驱动没有该补丁<br>则需要导入 |
| 0190-drm-bridge-synopsys-Support-hdmi-force-output-kernel-4-19.patch | drm/bridge: synopsys:<br>Support hdmi force<br>output | 在 rk 平台的kernel4.19版<br>本 hdmi tx 驱动没有该补丁<br>则需要导入 |
| 0190-drm-bridge-synopsys-Support-hdmi-force-output.patch | drm/bridge: synopsys:<br>Support hdmi force<br>output | 在 rk 平台的kernel4.4版本<br>hdmi tx 驱动没有该补丁则<br>需要导入 |
| 0189-drm-bridge-synopsys-dw-hdmi-Support-force-logo-displ.patch | drm/bridge: synopsys:<br>dw-hdmi: Support force<br>logo display | 在 rk 平台的kernel4.4版本<br>hdmi tx 驱动没有该补丁则<br>需要导入 |

<!-- source: CN V2.7 p37; unit 172 -->

##### 5.3.3.3   HDMI 线缆连接模式

<!-- source: CN V2.7 p37; unit 173 -->

在 DTS 的 RK628 节点中配置：

<!-- source: CN V2.7 p37; unit 174 -->

```text
&i2c2_rk628 {
   ......
   interrupt-parent = <&gpio0>;

   interrupts = <20 IRQ_TYPE_LEVEL_HIGH>;
   plugin-det-gpios = <&gpio2 RK_PA4 GPIO_ACTIVE_LOW>;
   // hpd-output-inverted;
   rk628-hdmi-in;
   ......
};
```

<!-- source: CN V2.7 p37; unit 175 -->

HDMI 线缆连接 RK628 需要通过 IO 检测 HDMI 源热插拔，同时也有分辨率 / 颜色格式切换的需求，所以该模式下需要在 RK628 节点下配置 “plugin-det-gpios” 属性，且需要配置 “interrupt-parent”、“interrupts”属性。此处的热拔插脚是 RK628 对 HDMI 源的热拔插检测，不是 HDMI 端对 RK628 的热拔插检测，通常两端都需要检测对方的热拔插情况。

<!-- source: CN V2.7 p37; unit 176 -->

“hpd-output-inverted” bool 属性：上述热插拔检测 IO 取反配置，若 HPD 输出电平在电路上做了取反，则需要使能此配置项，通常也可借助 GPIO 的GPIO_ACTIVE_LOW / GPIO_ACTIVE_HIGH 配置来进行软件取反。

<!-- source: CN V2.7 p37; unit 177 -->

HDMI 线缆连接模式下如果需要修改 HDMIRX 的分辨率，只需要将《Panel 端配置》章节中的 src-timing 修改为指定分辨率即可。

<!-- source: CN V2.7 p38; unit 178 -->

##### 5.3.3.4   音频配置

<!-- source: CN V2.7 p38; unit 179 -->

做为 HDMI 输入的时候，RK628 是输出音频的，I2S 作为 master 把音频数据从 I2S 输出，dts 声卡配置：

<!-- source: CN V2.7 p38; unit 180 -->

```text
rk628_dc: rk628-dc {
   compatible = "rockchip,dummy-codec";
   #sound-dai-cells = <0>;

};

&i2s0 {
   rockchip,capture-only;
   status = "okay";
};

/ {
   hdmiin-sound {
      compatible = "simple-audio-card";
      simple-audio-card,format = "i2s";
      simple-audio-card,name = "rockchip,hdmiin";

      simple-audio-card,bitclock-master = <&dailink0_master>;
      simple-audio-card,frame-master = <&dailink0_master>;
      status = "okay";
      simple-audio-card,cpu {
         sound-dai = <&i2s0>;
      };
      dailink0_master: simple-audio-card,codec {
         sound-dai = <&rk628_dc>;
      };
   };
};
```

<!-- source: CN V2.7 p38; unit 181 -->

SOC I2S 做从，在没有时钟信号的时候，驱动会一直等待，在 Android 系统中，等待太长容易出现crash，可以添加下面补丁修改超时：

<!-- source: CN V2.7 p38; unit 182 -->

```text
diff --git a/sound/soc/rockchip/rockchip_i2s.c b/sound/soc/rockchip/rockchip_i2s.c

index 9bc29fdd13c5..230c350c6765
--- a/sound/soc/rockchip/rockchip_i2s.c
+++ b/sound/soc/rockchip/rockchip_i2s.c
@@ -468,6 +468,9 @@ static int rockchip_i2s_trigger(struct snd_pcm_substream
*substream,
           ret = -EINVAL;
           break;
      }
+     if(substream->stream == SNDRV_PCM_STREAM_CAPTURE) {
+          substream->wait_time = msecs_to_jiffies(100);
+     }

      return ret;

 }
diff --git a/sound/soc/rockchip/rockchip_i2s_tdm.c b/sound/soc/rockchip/rockchip_i2s_tdm.c
index b0c4ce01e2be..0602df42c309
--- a/sound/soc/rockchip/rockchip_i2s_tdm.c
+++ b/sound/soc/rockchip/rockchip_i2s_tdm.c
@@ -1776,6 +1776,9 @@ static int rockchip_i2s_tdm_trigger(struct

snd_pcm_substream *substream,
           ret = -EINVAL;
           break;
      }
+     if(substream->stream == SNDRV_PCM_STREAM_CAPTURE) {
+          substream->wait_time = msecs_to_jiffies(100);
+     }

      return ret;
 }
```

<!-- source: CN V2.7 p39; unit 183 -->

<!-- source: CN V2.7 p39; unit 184 -->

### 5.4   输出模块配置

<!-- source: CN V2.7 p39; unit 185 -->

#### 5.4.1   RGB 输出

<!-- source: CN V2.7 p39; unit 186 -->

##### 5.4.1.1   RGB 输出配置

<!-- source: CN V2.7 p39; unit 187 -->

在 DTS 的 RK628 节点中添加 “rk628-rgb-out;” bool 属性即可：

<!-- source: CN V2.7 p39; unit 188 -->

```text
&i2c2_rk628 {
   ......
   rk628-rgb-out;

   ......
};
```

<!-- source: CN V2.7 p39; unit 189 -->

需要注意的是，RGB IN / RGB OUT / BT1120 IN / BT1120 OUT 功能共用引脚，所以这四种功能不能同时存在。

<!-- source: CN V2.7 p39; unit 190 -->

#### 5.4.2   BT1120 输出

<!-- source: CN V2.7 p39; unit 191 -->

##### 5.4.2.1   BT1120 输出配置

<!-- source: CN V2.7 p39; unit 192 -->

在 DTS 的 RK628 节点中添加 “rk628-bt1120-out;” bool 属性即可：

<!-- source: CN V2.7 p39; unit 193 -->

```text
&i2c2_rk628 {
   ......
   rk628-bt1120-out;

   // bt1120-dual-edge;
   ......
};
```

<!-- source: CN V2.7 p39; unit 194 -->

若需要配置 BT1120 为双边沿，则在 RK628 节点中添加 “bt1120-dual-edge;” bool 属性。需要注意的是，RGB IN / RGB OUT / BT1120 IN / BT1120 OUT 功能共用引脚，所以这四种功能不能同时存在。

<!-- source: CN V2.7 p40; unit 195 -->

#### 5.4.3   DSI 输出

<!-- source: CN V2.7 p40; unit 196 -->

##### 5.4.3.1   DSI 输出配置

<!-- source: CN V2.7 p40; unit 197 -->

在 DTS 的 RK628 节点中添加 “rk628-dsi-out” 节点：

<!-- source: CN V2.7 p40; unit 198 -->

```text
&i2c2_rk628 {
   ......
   rk628-dsi-out {

      // rockchip,lane-mbps = <1100>;
      // rockchip,dual-channel;
      dsi,eotp;
      dsi,video-mode;
      // dsi,clk-non-continuous;
      dsi,format = "rgb888";
      dsi,lanes = <4>;
      status = "okay";

      rk628-panel {
         panel-init-sequence = [
           ......

           05 78 01 11
           05 78 01 29
         ];

         panel-exit-sequence = [
           05 00 01 28
           05 00 01 10
         ];
      };
   };
   ......
};
```

<!-- source: CN V2.7 p40; unit 199 -->

“rk628-dsi-out” 节点配置属性说明

<!-- source: CN V2.7 p41; unit 200 -->

| Property | Description | Option Value |
| --- | --- | --- |
| rockchip,lane-mbps | 指定 MIPI 数据带宽<br>[option] |  |
| rockchip,dual-channel | 单双 MIPI [option] | 默认为单 MIPI，添加该属性配置为双<br>MIPI |
| dsi,eotp | EOT PACKET [option] |  |
| dsi,video-mode | Video 模式 / Command 模<br>式 [option] | 默认为 Command 模式，添加该属性配<br>置为 Video 模式 |
| dsi,clk-non-continuous | 连续 / 非连续时钟 [option] | 默认为连续时钟，添加该属性配置为非<br>连续时钟 |
| dsi,format | DSI 数据格式 | "rgb888" / "rgb666" / "rgb666-packed"<br>/ "rgb565" |
| dsi,lanes | DSI lanes | 双 MIPI 按单 MIPI lanes 配置 |
| panel-init-sequence | 屏 init 序列 | 第一列表示 data type，第二列表示<br>mdelays，<br>第三列表示发送每条命令的<br>payload_lenth，<br>后面几列都是表示每条命令的 payload |
| panel-exit-sequence | 屏 exit 序列 | 同上 |

<!-- source: CN V2.7 p41; unit 201 -->

常见数据类型

<!-- source: CN V2.7 p41; unit 202 -->

| data type | description | packet size |
| --- | --- | --- |
| 0x03 | Generic Short WRITE, no parameters | short |
| 0x13 | Generic Short WRITE, 1 parameters | short |
| 0x23 | Generic Short WRITE, 2 parameters | short |
| 0x29 | Generic long WRITE, | long |
| 0x05 | DCS Short WRITE, no parameters | short |
| 0x15 | DCS Short WRITE, 1 parameters | short |

<!-- source: CN V2.7 p41; unit 203 -->

##### 5.4.3.2   输出信号调节

<!-- source: CN V2.7 p41; unit 204 -->

信号调节参考 “驱动核心配置” -  “输出信号调节” - “GVI / LVDS / MIPI TX 信号调节” 章节。

<!-- source: CN V2.7 p42; unit 205 -->

#### 5.4.4   LVDS 输出

<!-- source: CN V2.7 p42; unit 206 -->

##### 5.4.4.1   LVDS 输出配置

<!-- source: CN V2.7 p42; unit 207 -->

在 DTS 的 RK628 节点中添加 “rk628-lvds-out” 节点：

<!-- source: CN V2.7 p42; unit 208 -->

```text
&i2c2_rk628 {
   ......
   rk628-lvds {

      bus-format = <MEDIA_BUS_FMT_RGB888_1X7X4_SPWG>;
      link-type = "single_link";
      status = "okay";
   };
   ......
};
```

<!-- source: CN V2.7 p42; unit 209 -->

“rk628-lvds-out” 节点配置属性说明

<!-- source: CN V2.7 p42; unit 210 -->

| Property | Description | Option Value |
| --- | --- | --- |
| bus-format | 总线格式 | <MEDIA_BUS_FMT_RGB666_1X7X3_SPWG> /<br><MEDIA_BUS_FMT_RGB888_1X7X4_SPWG> /<br><MEDIA_BUS_FMT_RGB888_1X7X4_JEIDA> |
| link-type | 通道类型 | "single_link" （单通道）<br>"dual_link_odd_even_pixels" （双通道，左右通道为奇偶通道）<br>"dual_link_even_odd_pixels" （双通道，左右通道为偶奇通道）<br>"dual_link_left_right_pixels" （双通道，左右通道为左右屏）<br>"dual_link_right_left_pixels" （双通道，左右通道为右左屏） |

<!-- source: CN V2.7 p42; unit 211 -->

##### 5.4.4.2   输出信号调节

<!-- source: CN V2.7 p42; unit 212 -->

信号调节参考 “驱动核心配置” -  “输出信号调节” - “GVI / LVDS / MIPI TX 信号调节” 章节。

<!-- source: CN V2.7 p42; unit 213 -->

#### 5.4.5   GVI 输出

<!-- source: CN V2.7 p42; unit 214 -->

##### 5.4.5.1   GVI 输出配置

<!-- source: CN V2.7 p42; unit 215 -->

在 DTS 的 RK628 节点中添加 “rk628-gvi-out” 节点：

<!-- source: CN V2.7 p43; unit 216 -->

```text
&i2c2_rk628 {
   ......
   rk628-gvi-out {

      bus-format = "rgb888";
      gvi,lanes = <8>;
      // rockchip,division-mode;
      // rockchip, gvi-frm-rst;
      status = "okay";
   };
   ......
};
```

<!-- source: CN V2.7 p43; unit 217 -->

“rk628-gvi-out” 节点配置属性说明

<!-- source: CN V2.7 p43; unit 218 -->

| Property | Description | Option Value |
| --- | --- | --- |
| bus-format | 总线格式 | "rgb666" / "rgb888" / "rgb101010" /<br>"yuyv8" / "yuyv10" |
| gvi,lanes | GVI lanes | 1、2、4、8 |
| rockchip,division-mode | one section / two section<br>[option] | 默认为 one section 模式，添加该属性<br>设置为 two section 模式 |
| rockchip, gvi-frm-rst | enable gvi rst when frame<br>start [option] | 默认 disabled，添加该属性设置为<br>enable |

<!-- source: CN V2.7 p43; unit 219 -->

##### 5.4.5.2   线序对调

<!-- source: CN V2.7 p43; unit 220 -->

若显示上发现相邻几个像素位置发生规律的对调现象，调如下寄存器修改 combtx lane 和 gvi_phy_datalane 的对应关系

<!-- source: CN V2.7 p43; unit 221 -->

```text
# echo 0x80004 $val > /d/rk628/2-0050/registers/combtxphy
# $val(combtx_lane_n):

#   lane0[Bit2:0], lane1[Bit6:4], lane2[Bit10:8], lane3[Bit14:12]
#   lane4[Bit18:16], lane5[Bit22:20], lane6[Bit26:24], lane7[Bit30:28]
# 显示异常时可以优先考虑如下常用   val 值：
# 0x01234567 0x76543210 0x10325476 0x67452301 0x45670123 0x32107654 0x54761023
0x23016745
# 例：
echo 0x80004 0x01234567 > /d/rk628/2-0050/registers/combtxphy
```

<!-- source: CN V2.7 p43; unit 222 -->

对应软件上的修改位置如下：

<!-- source: CN V2.7 p44; unit 223 -->

```text
diff --git a/drivers/misc/rk628/rk628_gvi.c b/drivers/misc/rk628/rk628_gvi.c
index fb41c2143bb5..ef47e58ad377 100644
--- a/drivers/misc/rk628/rk628_gvi.c

+++ b/drivers/misc/rk628/rk628_gvi.c
@@ -150,6 +150,8 @@ static void rk628_gvi_pre_enable(struct rk628 *rk628, struct
rk628_gvi *gvi)

      rk628_i2c_update_bits(rk628, GVI_SYS_CTRL1, SYS_CTRL1_COLOR_DEPTH_MASK,
                      SYS_CTRL1_COLOR_DEPTH(gvi->color_depth));
+
+     rk628_i2c_write(rk628, GVI_SYS_CTRL3, 0x01234567);
 }

 static void rk628_gvi_enable_color_bar(struct rk628 *rk628,
```

<!-- source: CN V2.7 p44; unit 224 -->

##### 5.4.5.3   输出信号调节和展频

<!-- source: CN V2.7 p44; unit 225 -->

信号调节参考 “驱动核心配置” -  “输出信号调节” - “GVI / LVDS / MIPI TX 信号调节” 章节。

<!-- source: CN V2.7 p44; unit 226 -->

SSC（展频）参考 “驱动核心配置” -  “输出信号调节” - “SSC（展频）” 章节。

<!-- source: CN V2.7 p45; unit 227 -->

##### 5.4.5.4   RK628F GVI 测试型号列表

<!-- source: CN V2.7 p46; unit 229 -->

| TCON | 型号 | 屏幕厂家 | 分辨率 |
| --- | --- | --- | --- |
| IN8205A | M280DGJ-L30 | 群创光电 | 3840*2160 |
| IN8205A | M315DJJ | 群创光电 |  |
| 前期是<br>IN8908A<br>(2021 年年底<br>改为 IN8210) | S500DJ2-KS5 | 群创光电 |  |
| 前期是<br>IN8908A<br>(2021 年年底<br>改为 IN8210) | V500DJ2-KS5 | 群创光电 |  |
| SW0894A | LC860EQY-FJA5 | 巡视 |  |
|  | LC550EGE | LGDisplay |  |
| Hi3231V530 | HV550QUB-N8D | BOE |  |
| SW0894A | MZ860004-07 | ACT |  |
| SW0894A | 86S13DCX |  |  |
| TLi2461MC | ACT-MZ750004-07 |  |  |
| LP71517 |  |  |  |
| SW08006A | 848.2 |  |  |
| TLi2380EP | ist-ITV-016 | FunTV |  |
| SW08008 |  |  |  |
| 10301 | L22650USWL1 | Lenove |  |
| 10302 | HV860QUB-E1D |  |  |
| CSQ12-B0S | SG8561D03-1 |  |  |
| CSTU01-A0H | H750D4-BA080AA |  |  |
| CSTU01-A0W | SL(LX)-23 |  |  |
| KV7636-VPP | ST7461D02-6 |  |  |
| KV7626 |  |  |  |
| AUO-12417 |  |  |  |
| AUO-12415 | ICB-VN65 | HiteVision |  |
| NT71120MFG-001 |  |  |  |
| EK76603E | V650DK-KS5 |  |  |
| iLITEK-2326 |  |  |  |
| IN8205A |  |  |  |
| MST6M60FV | TN2A1FV4LCZZ |  |  |
|  | HS-86AW-L09PA |  |  |
|  | HV650QUB-F70 |  |  |
|  | CEJZ650L07Q1 | 华星光电 |  |
|  | MT5461D01-1 | 华星光电 |  |
|  | BOEI650WQ1 |  |  |
|  | UV650QUB-N90 |  |  |
|  | LC650EQQ-SMA5 |  |  |

<!-- source: CN V2.7 p47; unit 239 -->

#### 5.4.6   HDMI 输出

<!-- source: CN V2.7 p47; unit 240 -->

考虑到 HDMI 需要支持切不同分辨率的需求，当前 Misc 的 RK628 作为 DRM 框架的 Bridge 实现：

<!-- source: CN V2.7 p47; unit 241 -->

![原始技术图 — CN V2.7, p47](/docs/rockchip-rk628-porting/assets/cn-p47-X363.png)

*原始技术图: CN V2.7, p47.*

<!-- source: CN V2.7 p47; unit 242 -->

##### 5.4.6.1   HDMI 输出配置

<!-- source: CN V2.7 p47; unit 243 -->

在 DTS 的 RK628 节点中添加 “rk628-hdmi-out” bool 属性，“&rgb” 节点与 RK628 节点通过 “remote-endpoint” 进行 binding：

<!-- source: CN V2.7 p47; unit 244 -->

```text
&i2c2_rk628 {
   pinctrl-names = "default";

   pinctrl-0 = <&rk628_reset &refclk_pins>;
   assigned-clocks = <&pmucru CLK_WIFI>;
   assigned-clock-rates = <24000000>;
   clock-names = "soc_24M";
   clocks = <&pmucru CLK_WIFI>;

   rk628-rgb-in;
   rk628-hdmi-out;
   // mode-sync-pol = <0>;
   status = "okay";

   port {

      rgb_in_hdmi: endpoint {
         remote-endpoint = <&rgb_out_hdmi>;
      };
   };
};
&route_rgb {
   status = "disabled";

};

&rgb_in_vp2 {
   status = "okay";
};

&rgb {
   status = "okay";

   ports {
      port@1 {
         reg = <1>;


         rgb_out_hdmi: endpoint {
           remote-endpoint = <&rgb_in_hdmi>;
         };
      };
   };
};
```

<!-- source: CN V2.7 p48; unit 245 -->

<!-- source: CN V2.7 p48; unit 246 -->

HDMITX 分辨率和极性随标准分辨率变化，所有没有配置屏相关参数，若为 RGB/BT1120 输入，则需要根据 RGB/BT1120 实际 hsync-active 和 vsync-active 配置 mode-sync-pol 属性，只有一个属性，所以hsync-active 和 vsync-active 需要保持一致。若没有配置，则默认极性为 1（正极性）。若画面显示花屏时可以尝试添加该属性。

<!-- source: CN V2.7 p48; unit 247 -->

需要注意的是，HDMITX 通路需要实现 CLK 同源，否则可能会导致该通路显示异常，具体 CLK 同源配置详见《驱动核心配置》章节的《24MHz 工作时钟配置》小节。

<!-- source: CN V2.7 p48; unit 248 -->

##### 5.4.6.2   输出信号调节

<!-- source: CN V2.7 p48; unit 249 -->

信号调节参考 “驱动核心配置” -  “输出信号调节” - “HDMI TX 信号调节” 章节。

<!-- source: CN V2.7 p48; unit 250 -->

##### 5.4.6.3   音频配置

<!-- source: CN V2.7 p48; unit 251 -->

```text
&i2s0 {
   rockchip,playback-only;

   status = "oaky";
};

/ {
   rk628_sound: rk628-sound {
      compatible = "simple-audio-card";
      simple-audio-card,format = "i2s";
      simple-audio-card,mclk-fs = <128>;
      simple-audio-card,name = "rockchip,hdmi-rk628";
      status = "oaky";
      simple-audio-card,cpu {
         sound-dai = <&i2s0>;
      };
      simple-audio-card,codec {
         sound-dai = <&i2c2_rk628>;
      };

   };
}
```

<!-- source: CN V2.7 p49; unit 252 -->

<!-- source: CN V2.7 p49; unit 253 -->

### 5.5   目前 DTS 支持的几种组合

<!-- source: CN V2.7 p49; unit 254 -->

#### 5.5.1   RGB -> DSI 转换

<!-- source: CN V2.7 p49; unit 255 -->

参考 DTS：

<!-- source: CN V2.7 p49; unit 256 -->

```text
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-ddr4-v10.dtsi
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2dsi-ddr4-v10.dts
```

<!-- source: CN V2.7 p49; unit 257 -->

以上 DTS 是基于 rk3568-evb.dtsi 增加 RK628 支持 RGB 转 MIPI DSI 的功能，具体差异请结合“输入模块介绍”及“输出模块介绍”章节自行对比代码。

<!-- source: CN V2.7 p49; unit 258 -->

SOC 配置输出指定 timing 的 RGB 参考 《输入模块配置》章节的《RGB 输入》小节。

<!-- source: CN V2.7 p49; unit 259 -->

#### 5.5.2   RGB -> LVDS 转换

<!-- source: CN V2.7 p49; unit 260 -->

参考 DTS：

<!-- source: CN V2.7 p49; unit 261 -->

```text
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-ddr4-v10.dtsi
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2lvds-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2lvds-dual-ddr4-v10.dts
```

<!-- source: CN V2.7 p49; unit 262 -->

以上 DTS 是基于 rk3568-evb.dtsi 增加 RK628 支持 RGB 转 MIPI DSI 的功能，其中 rk3568-evb-rk628-rgb2lvds-ddr4-v10.dts 为输出单通道 LVDS，rk3568-evb-rk628-rgb2lvds-dual-ddr4-v10.dts 为输出双通道 LVDS，具体差异请结合“输入模块介绍”及“输出模块介绍”章节自行对比代码。

<!-- source: CN V2.7 p49; unit 263 -->

SOC 配置输出指定 timing 的 RGB 参考 《输入模块配置》章节的《RGB 输入》小节。

<!-- source: CN V2.7 p49; unit 264 -->

#### 5.5.3   RGB -> GVI 转换

<!-- source: CN V2.7 p49; unit 265 -->

参考 DTS：

<!-- source: CN V2.7 p49; unit 266 -->

```text
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-ddr4-v10.dtsi
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2gvi-ddr4-v10.dts
```

<!-- source: CN V2.7 p49; unit 267 -->

以上 DTS 是基于 rk3568-evb.dtsi 增加 RK628 支持 RGB 转 GVI 的功能，具体差异请结合“输入模块介绍”及“输出模块介绍”章节自行对比代码。

<!-- source: CN V2.7 p49; unit 268 -->

SOC 配置输出指定 timing 的 RGB 参考 《输入模块配置》章节的《RGB 输入》小节。

<!-- source: CN V2.7 p50; unit 269 -->

#### 5.5.4   RGB -> HDMI 转换

<!-- source: CN V2.7 p50; unit 270 -->

参考 DTS：

<!-- source: CN V2.7 p50; unit 271 -->

```text
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-ddr4-v10.dtsi
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2hdmi-ddr4-v10.dts
```

<!-- source: CN V2.7 p50; unit 272 -->

以上 DTS 是基于 rk3568-evb.dtsi 增加 RK628 支持 RGB 转 HDMI 的功能，具体差异请结合“输入模块介绍”及“输出模块介绍”章节自行对比代码。

<!-- source: CN V2.7 p50; unit 273 -->

因为 HDMITX 需要检测屏端支持的分辨率作为目标分辨率，所以在 DTS 中没有配置 SOC 输出 RGB 的timing。

<!-- source: CN V2.7 p50; unit 274 -->

#### 5.5.5   HDMI -> DSI 转换

<!-- source: CN V2.7 p50; unit 275 -->

参考 DTS：

<!-- source: CN V2.7 p50; unit 276 -->

```text
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-ddr4-v10.dtsi
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2dsi-ddr4-v10.dts

arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2dsi-dual-ddr4-v10.dts
```

<!-- source: CN V2.7 p50; unit 277 -->

以上 DTS 是基于 rk3568-evb.dtsi 增加 RK628 支持 HDMI 转 DSI 的功能，使用与 SOC 直连的模式，其中 rk3568-evb-rk628-hdmi2dsi-ddr4-v10.dts 为输出单 MIPI DSI，rk3568-evb-rk628-hdmi2dsi-dual-ddr4-v10.dts 为输出双 MIPI DSI，具体差异请结合“输入模块介绍”及“输出模块介绍”章节自行对比代码。

<!-- source: CN V2.7 p50; unit 278 -->

SOC 配置输出指定 timing 的 RGB 参考 《输入模块配置》章节的《HDMI 输入》小节。

<!-- source: CN V2.7 p50; unit 279 -->

#### 5.5.6   HDMI -> LVDS 转换

<!-- source: CN V2.7 p50; unit 280 -->

参考 DTS：

<!-- source: CN V2.7 p50; unit 281 -->

```text
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-ddr4-v10.dtsi
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2lvds-ddr4-v10.dts

arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2lvds-dual-ddr4-v10.dts
```

<!-- source: CN V2.7 p50; unit 282 -->

以上 DTS 是基于 rk3568-evb.dtsi 增加 RK628 支持 HDMI 转 LVDS 的功能，使用与 SOC 直连的模式，其中 rk3568-evb-rk628-hdmi2lvds-ddr4-v10.dts 为输出单通道 LVDS，rk3568-evb-rk628-hdmi2lvds-dual-ddr4-v10.dts 为输出双通道 LVDS，具体差异请结合“输入模块介绍”及“输出模块介绍”章节自行对比代码。

<!-- source: CN V2.7 p50; unit 283 -->

SOC 配置输出指定 timing 的 RGB 参考 《输入模块配置》章节的《HDMI 输入》小节。

<!-- source: CN V2.7 p50; unit 284 -->

#### 5.5.7   HDMI -> GVI 转换

<!-- source: CN V2.7 p50; unit 285 -->

参考 DTS：

<!-- source: CN V2.7 p51; unit 286 -->

```text
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-ddr4-v10.dtsi
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2gvi-ddr4-v10.dts
```

<!-- source: CN V2.7 p51; unit 287 -->

以上 DTS 是基于 rk3568-evb.dtsi 增加 RK628 支持 HDMI 转 GVI 的功能，使用与 SOC 直连的模式，具体差异请结合“输入模块介绍”及“输出模块介绍”章节自行对比代码。

<!-- source: CN V2.7 p51; unit 288 -->

SOC 配置输出指定 timing 的 RGB 参考 《输入模块配置》章节的《HDMI 输入》小节。

<!-- source: CN V2.7 p51; unit 289 -->

### 5.6   基础调试命令

<!-- source: CN V2.7 p51; unit 290 -->

#### 5.6.1   寄存器调试节点

<!-- source: CN V2.7 p51; unit 291 -->

/sys/kernel/debug/regmap 节点下

<!-- source: CN V2.7 p51; unit 292 -->

```text
rk3568_t:/ # ls /sys/kernel/debug/regmap/
0-001c        2-0050-dsi1 2-0050-hdmirx 4-0050-gpio0
0-0020        2-0050-efuse 4-0050-adapter 4-0050-gpio1

0-0020-rk817-codec 2-0050-gpio0 4-0050-combrxphy 4-0050-gpio2
2-0050-adapter 2-0050-gpio1 4-0050-combtxphy 4-0050-gpio3
2-0050-combrxphy 2-0050-gpio2 4-0050-cru 4-0050-grf
2-0050-combtxphy 2-0050-gpio3 4-0050-csi 4-0050-gvi
2-0050-cru    2-0050-grf 4-0050-dsi0  4-0050-hdmi
2-0050-csi    2-0050-gvi 4-0050-dsi1  4-0050-hdmirx
2-0050-dsi0   2-0050-hdmi 4-0050-efuse ......
```

<!-- source: CN V2.7 p51; unit 293 -->

或 /sys/kernel/debug/rk628/x-xxxx/registers 节点下

<!-- source: CN V2.7 p51; unit 294 -->

```text
rk3568_t:/ # ls /sys/kernel/debug/rk628/2-0050/registers/
adapter combrxphy combtxphy cru csi dsi0 dsi1 efuse gpio0 gpio1 gpio2
gpio3 grf gvi hdmi hdmirx
```

<!-- source: CN V2.7 p51; unit 295 -->

其中，2 表示 I2C 总线号，0050 表示 RK628 SLAVE 地址。

<!-- source: CN V2.7 p51; unit 296 -->

1\. 读寄存器（以 GRF 寄存器为例）

<!-- source: CN V2.7 p51; unit 297 -->

/sys/kernel/debug/regmap 节点下

<!-- source: CN V2.7 p51; unit 298 -->

```text
rk3568_t:/ # cat /sys/kernel/debug/regmap/2-0050-grf/registers
000: 06000088
004: ffffffff

008: 00000000
00c: 00000000
010: 00000001
014: 00000000
018: 00050000
01c: 002c0898
020: 00c00840
......

rk3568_t:/ # cat /sys/kernel/debug/regmap/2-0050-grf/registers | grep 200:
200: 20230321
```

<!-- source: CN V2.7 p52; unit 299 -->

或 /sys/kernel/debug/rk628/x-xxxx/registers 节点下

<!-- source: CN V2.7 p52; unit 300 -->

```text
rk3568_t:/ # cat /sys/kernel/debug/rk628/2-0050/registers/grf
rk628_grf:


0x0000: 06000298 ffffffff 00000000 00000001
0x0010: 00000001 00000000 000404b6 002804ba
0x0020: 0046047e 000a079e 00140794 0046047e
0x0030: 00140794 00000004 00000000 00000000
0x0040: 04380004 80000000 00000000 00000000
0x0050: 80000000 00000000 10000000 00000000
0x0060: 000002ea 01f0ea00 00000000 01f00000
0x0070: 0000155c 00005602 00000000 00000000
0x0080: 00006000 00000000 00000000 00000000
......

rk3568_t:/ # cat /sys/kernel/debug/rk628/2-0050/registers/grf | grep 0200:

0x0200: 20230321 00000000 00000000 00000000
```

<!-- source: CN V2.7 p52; unit 301 -->

2\. 写寄存器（以 GRF 寄存器为例）

<!-- source: CN V2.7 p52; unit 302 -->

/sys/kernel/debug/regmap 节点下

<!-- source: CN V2.7 p52; unit 303 -->

```text
rk3568_t:/ # echo 0x010 0x02000200 > /sys/kernel/debug/regmap/2-0050-
grf/registers
```

<!-- source: CN V2.7 p52; unit 304 -->

或 /sys/kernel/debug/rk628/x-xxxx/registers 节点下

<!-- source: CN V2.7 p52; unit 305 -->

```text
rk3568_t:/ # echo 0x010 0x02000200 > /sys/kernel/debug/rk628/2-0050/registers/grf
```

<!-- source: CN V2.7 p52; unit 306 -->

#### 5.6.2   自测模式命令

<!-- source: CN V2.7 p52; unit 307 -->

当输出无法正常显示时，可以通过以下命令来判断问题出在 RK628 input 端还是 RK628 output 端（仅RK628F/H 可以使用） ：

<!-- source: CN V2.7 p52; unit 308 -->

```text
# Enable horizontal color bar
rk3568_t:/ # echo 1 > /sys/kernel/debug/rk628/2-0050/scaler_color_bar


# Enable vertical color bar
rk3568_t:/ # echo 2 > /sys/kernel/debug/rk628/2-0050/scaler_color_bar

# Disable color bar
rk3568_t:/ # echo 0 > /sys/kernel/debug/rk628/2-0050/scaler_color_bar
```

<!-- source: CN V2.7 p52; unit 309 -->

若 scaler colorbar 正常显示，则主要排查主控输出、RK628 input、RK628 Process 的配置；若无法正常显示，则先排查 RK628 output 的配置，并通过下列各个接口的 colorbar 判断输出模块的控制器、对应的 phy、屏端这条链路是否正常工作。下列的模块 colorbar 正常工作后，scaler color 仍然无法显示，则继续排查 RK628 input 的配置。

<!-- source: CN V2.7 p52; unit 310 -->

以下命令测试输出模块的控制器、对应的 phy、屏端这条链路是否正常工作：

<!-- source: CN V2.7 p52; unit 311 -->

1\. HDMITX color bar

<!-- source: CN V2.7 p53; unit 312 -->

```text
# Enable normal color bar
rk3568_t:/ # echo 1 > /sys/kernel/debug/rk628/2-0050/hdmitx_color_bar


# Enable special color bar
rk3568_t:/ # echo 2 > /sys/kernel/debug/rk628/2-0050/hdmitx_color_bar

# Enable black color bar
rk3568_t:/ # echo 3 > /sys/kernel/debug/rk628/2-0050/hdmitx_color_bar

# Disable color bar
rk3568_t:/ # echo 0 > /sys/kernel/debug/rk628/2-0050/hdmitx_color_bar
```

<!-- source: CN V2.7 p53; unit 313 -->

2\. DSI color bar

<!-- source: CN V2.7 p53; unit 314 -->

```text
# Enable dsi color bar
rk3568_t:/ # echo 1 > /sys/kernel/debug/rk628/2-0050/dsi_color_bar


# Disable dsi color bar
rk3568_t:/ # echo 0 > /sys/kernel/debug/rk628/2-0050/dsi_color_bar
```

<!-- source: CN V2.7 p53; unit 315 -->

3\. GVI color bar

<!-- source: CN V2.7 p53; unit 316 -->

```text
# Enable color bar
rk3568_t:/ # echo 1 > /sys/kernel/debug/rk628/2-0050/gvi_color_bar


# Disable color bar
rk3568_t:/ # echo 0 > /sys/kernel/debug/rk628/2-0050/gvi_color_bar
```

<!-- source: CN V2.7 p53; unit 317 -->

#### 5.6.3   RGB IN 调试命令（仅 RK628F/H 支持）

<!-- source: CN V2.7 p53; unit 318 -->

在 RK628F/H 的应用下，可以通过如下命令，查看 RGB IN 实际收到的分辨率，判断 RGB RX 是否正常

<!-- source: CN V2.7 p53; unit 319 -->

```text
rk3568_t:/ # cat /sys/kernel/debug/rk628/2-0050/rgb_resolution
1080x1920 pclk:131967000
```

<!-- source: CN V2.7 p53; unit 320 -->

### 5.7   显示常见问题处理

<!-- source: CN V2.7 p53; unit 321 -->

#### 5.7.1   没有生成 regmap 节点

<!-- source: CN V2.7 p53; unit 322 -->

如下 log，查看 RK628 相关是否存在 error 导致 RK628 无法正常完成 probe

<!-- source: CN V2.7 p53; unit 323 -->

```text
rk3568_t:/ # dmesg | grep rk628
[  0.294331] rk628 2-0050: the driver version is 0.1.0 of RK628-F/B/G

[  0.294426] rk628 2-0050: failed to request enable GPIO: -16
```

<!-- source: CN V2.7 p54; unit 324 -->

#### 5.7.2   I2C 通信异常

<!-- source: CN V2.7 p54; unit 325 -->

如下 log 表示 RK628 的 I2C 通信异常导致 RK628 的各个模块注册不上，需要检查 RK628 的上电时序以及 24MHz 的基准时钟（见常见需求处理章节），以及相关 pin 的 iomux。

<!-- source: CN V2.7 p54; unit 326 -->

```text
[  0.960609] rk628 1-0050: failed to access register: -6
```

<!-- source: CN V2.7 p54; unit 327 -->

#### 5.7.3   DSI 或 GVI 显示有内容但花屏

<!-- source: CN V2.7 p54; unit 328 -->

可以尝试修改 dts 中 src-timing 消隐的正负极性，方法对 DSI 和 GVI 均有效。

<!-- source: CN V2.7 p54; unit 329 -->

例如以下修改：

<!-- source: CN V2.7 p54; unit 330 -->

```text
--- a/arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2dsi-ddr4-v10.dts
+++ b/arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2dsi-ddr4-v10.dts
@@ -347,8 +347,8 @@ src-timing {

                       vfront-porch = <15>;
                       hsync-len = <2>;
                       vsync-len = <2>;
-                      hsync-active = <0>;
-                      vsync-active = <0>;
+                      hsync-active = <1>;
+                      vsync-active = <1>;
                       de-active = <0>;
                       pixelclk-active = <0>;
```

<!-- source: CN V2.7 p54; unit 331 -->

#### 5.7.4   提高 clock-frequency 后 DSI 无法显示

<!-- source: CN V2.7 p54; unit 332 -->

为了提高刷新率，一般会提高 clock-frequency，例如下面的修改：

<!-- source: CN V2.7 p54; unit 333 -->

```text
--- a/arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2dsi-ddr4-v10.dts
+++ b/arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2dsi-ddr4-v10.dts
@@ -338,7 +338,7 @@ rk628-panel {


           display-timings {
                 src-timing {
-                      clock-frequency = <132000000>;
+                      clock-frequency = <148500000>;
                       hactive = <1080>;
                       vactive = <1920>;
                       hback-porch = <30>;
@@ -354,7 +354,7 @@ src-timing {
                 };

                 dst-timing {

-                      clock-frequency = <132000000>;
+                      clock-frequency = <148500000>;
                       hactive = <1080>;
                       vactive = <1920>;
                       hback-porch = <30>;
```

<!-- source: CN V2.7 p55; unit 334 -->

但提高 CLK 可能导致屏幕闪屏或无法显示，如果出现这种情况，则可以尝试按如下方式调整 LANE 的速率解决此问题。

<!-- source: CN V2.7 p55; unit 335 -->

```text
--- a/arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2dsi-ddr4-v10.dts
+++ b/arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2dsi-ddr4-v10.dts
@@ -57,6 +57,7 @@ &i2c2_rk628 {


           rk628-rgb-in;
           rk628-dsi-out {
+                rockchip,lane-mbps = <1000>;
                 //rockchip,dual-channel;
                 dsi,eotp;
                 dsi,video-mode;
```

<!-- source: CN V2.7 p55; unit 336 -->

#### 5.7.5   显示有偏移问题

<!-- source: CN V2.7 p55; unit 337 -->

例如，HDMI 做为输入，后端显示有偏移，根据偏移方向，在对应的 DTS 中调整屏端的 timing 消隐（src-timing/dst-timing 中的行消隐 hfront-porch/hback-porch/hsync-len 和列消隐 vfront-porch/vback-porch/vsync-len）。同时，要确保后端输出的 clock-frequency 与 HDMI 输入保持相同，例如都是 148500000。

<!-- source: CN V2.7 p55; unit 338 -->

```text
--- a/arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2dsi-ddr4-v10.dts
+++ b/arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2dsi-ddr4-v10.dts
@@ -314,7 +314,7 @@ src-timing {

                 hfront-porch = <60>;
                 vback-porch = <10>;
                 vfront-porch = <10>;
-                hsync-len = <20>;
+                hsync-len = <40>;
                 vsync-len = <10>;
                 hsync-active = <1>;
                 vsync-active = <1>;
```

<!-- source: CN V2.7 p55; unit 339 -->

#### 5.7.6   如何操作 RK628 的 GPIO

<!-- source: CN V2.7 p55; unit 340 -->

在需要控制 GPIO 的位置直接调用 GPIO 接口即可（调用时需要包含头文件 rk628_pinctrl.h、rk628_gpio.h），该接口包括 IOMUX 设置，GPIO 方向设置和电平设置，例如以下操作将 I2S_D2_M0 接口设为 GPIO，并输出高电平。

<!-- source: CN V2.7 p55; unit 341 -->

```text
#include "rk628_pinctrl.h"
#include "rk628_gpio.h"


rk628_misc_gpio_direction_output(rk628, GPIO0_A6, 1);
```

<!-- source: CN V2.7 p55; unit 342 -->

若需要恢复则需要调用以下接口。

<!-- source: CN V2.7 p55; unit 343 -->

```text
rk628_misc_pinctrl_set_mux(rk628, GPIO0_A6, I2SM0D2);
```

<!-- source: CN V2.7 p56; unit 344 -->

## 6.   Media

<!-- source: CN V2.7 p56; unit 345 -->

### 6.1   驱动介绍

<!-- source: CN V2.7 p56; unit 346 -->

![原始技术图 — CN V2.7, p56](/docs/rockchip-rk628-porting/assets/cn-p56-X413.png)

*原始技术图: CN V2.7, p56.*

<!-- source: CN V2.7 p56; unit 347 -->

Media 为 RK628 HDMI IN 通路的驱动代码，将 RK628 作为类 camera 设备使用，实现如上功能。

<!-- source: CN V2.7 p56; unit 348 -->

#### 6.1.1   RK628F/H 对比 RK628D 改进

<!-- source: CN V2.7 p56; unit 349 -->

media 框架驱动主要应用在 HDMI2CSI、HDMI2DSI、HDMI2BT1120 对接 SOC 主控平台的场景，对比RK628D，RK628F/H 这部分主要改进如下：

<!-- source: CN V2.7 p56; unit 350 -->

```text
主要改进点
```

<!-- source: CN V2.7 p56; unit 351 -->

模块

<!-- source: CN V2.7 p56; unit 352 -->

支持 HDMI2.0支持 RGB 4K60 输入

<!-- source: CN V2.7 p56; unit 353 -->

HDMIRX 增加更多频点支持

<!-- source: CN V2.7 p56; unit 354 -->

支持 DVI mode锁定更快更稳定

<!-- source: CN V2.7 p56; unit 355 -->

```text
解决了不同图像格式输入，格式转换下采样引入的色偏问题
增加一路  MIPI-CSI，双 MIPI-CSI 支持 4K60 输出
```

<!-- source: CN V2.7 p56; unit 356 -->

MIPI-CSI

<!-- source: CN V2.7 p56; unit 357 -->

CSC 新增 matrix，可对图像色域做更灵活转换

<!-- source: CN V2.7 p56; unit 358 -->

#### 6.1.2   驱动目录结构

<!-- source: CN V2.7 p56; unit 359 -->

RK628 在 media 框架下的驱动代码需要需要根据内核版本进行区分。kernel-5.10 之前的版本，使用rk628_for-all 的补丁包，kernel-5.10 的版本，使用 kernel_5.10_rk628_media_patch 的补丁包。

<!-- source: CN V2.7 p56; unit 360 -->

如果是 kernel-5.10 之前的版本，驱动目录结构如下：

<!-- source: CN V2.7 p56; unit 361 -->

```text
drivers/media/i2c/rk628
├── Makefile

├── rk628_bt1120_v4l2.c
├── rk628.c
├── rk628_combrxphy.c
├── rk628_combrxphy.h
├── rk628_combtxphy.c
├── rk628_combtxphy.h
├── rk628_cru.c
├── rk628_cru.h
├── rk628_csi.c
├── rk628_csi.h
├── rk628_csi_v4l2.c
├── rk628_dsi.c

├── rk628_dsi.h
├── rk628_gpio.h
├── rk628_grf.h
├── rk628.h
├── rk628_hdmirx.c
├── rk628_hdmirx.h
├── rk628_mipi_dphy.c
├── rk628_mipi_dphy.h
├── rk628_pinctrl.c
├── rk628_pinctrl.h
├── rk628_post_process.c
├── rk628_post_process.h

└── rk628_v4l2_controls.h
```

<!-- source: CN V2.7 p57; unit 362 -->

<!-- source: CN V2.7 p57; unit 363 -->

如果是 kernel-5.10 的内核版本，驱动目录如下：

<!-- source: CN V2.7 p57; unit 364 -->

```text
drivers/media/i2c/rk628
├── Makefile

├── rk628_bt1120_v4l2.c
├── rk628.c
├── rk628_combrxphy.c
├── rk628_combrxphy.h
├── rk628_combtxphy.c
├── rk628_combtxphy.h
├── rk628_cru.c
├── rk628_cru.h
├── rk628_csi.c
├── rk628_csi.h
├── rk628_csi_v4l2.c
├── rk628_dsi.c
├── rk628_dsi.h

├── rk628.h
├── rk628_hdmirx.c
├── rk628_hdmirx.h
├── rk628_mipi_dphy.c
├── rk628_mipi_dphy.h
├── rk628_post_process.c
└── rk628_post_process.h
```

<!-- source: CN V2.7 p57; unit 365 -->

目前主要的几个驱动文件及所适用的场景如下：

<!-- source: CN V2.7 p57; unit 366 -->

rk628_csi.c:  HDMI2CSI 应用场景，适用于 CameraHal1 及第三方 SOC；

<!-- source: CN V2.7 p57; unit 367 -->

rk628_csi_v4l2.c: HDMI2CSI / HDMI2DSI 应用场景，适用于 CameraHal3/TV input 等基于 v4l2 框架的平台；

<!-- source: CN V2.7 p57; unit 368 -->

rk628_bt1120_v4l2.c: HDMI2BT1120 应用场景，适用于 CameraHal3 等基于 v4l2 框架的平台；

<!-- source: CN V2.7 p58; unit 369 -->

#### 6.1.3   驱动移植说明

<!-- source: CN V2.7 p58; unit 370 -->

参考《驱动移植说明》-《HDMI IN 通路（drivers/media/i2c/rk628）》章节

<!-- source: CN V2.7 p58; unit 371 -->

### 6.2   HDMI IN VIDEO 框架说明

<!-- source: CN V2.7 p58; unit 372 -->

HDMI IN video 部分的软件实现方案是将 RK628 模拟成一个 MIPI SOC camera 设备，通过 camera 框架或者 TV 框架接收 video 数据并在 APK 进行显示，同时基于 HDMI IN 的应用场景需要，增加 HDMIIN 热拔插和 HDMI IN 分辨率自适应支持。

<!-- source: CN V2.7 p58; unit 373 -->

Android9/10/11 基于 cameraHAL3 框架开发，可以参考 SDK 目录 RKDocs/common/camera/hdmi-in文档：《Rockchip_Developer_Guide_HDMI_IN_Based_On_CameraHal3_CN.pdf》

<!-- source: CN V2.7 p58; unit 374 -->

Android12/13 基于 cameraHAL3/TVinput 框架开发，可以参考 SDK 目录RKDocs/common/camera/hdmi-in 文档：

<!-- source: CN V2.7 p58; unit 375 -->

《Rockchip_Developer_Guide_Android12+_HDMI_IN_Bridge_CN》

<!-- source: CN V2.7 p58; unit 376 -->

#### 6.2.1   HDMI IN APK 工作流程

<!-- source: CN V2.7 p58; unit 377 -->

APK 大致工作流程如下图所示：

<!-- source: CN V2.7 p59; unit 378 -->

![原始技术图 — CN V2.7, p59](/docs/rockchip-rk628-porting/assets/cn-p59-X429.png)

*原始技术图: CN V2.7, p59.*

<!-- source: CN V2.7 p59; unit 379 -->

基于 kernel-4.19 或者 kernel-4.4 版本（安卓 9/10/11），可以直接使用 rkCamera2 打开预览。

<!-- source: CN V2.7 p59; unit 380 -->

基于 kernel-5.10 版本（安卓 12/13），需要区分是 camera 框架还是 TV 框架，详细请参考文档：

<!-- source: CN V2.7 p59; unit 381 -->

《Rockchip_Developer_Guide_Android12+_HDMI_IN_Bridge_CN》

<!-- source: CN V2.7 p60; unit 382 -->

#### 6.2.2   RK628 驱动架构

<!-- source: CN V2.7 p60; unit 383 -->

RK628 驱动需要重点关注的主要有三个部分：初始化、热拔插中断处理、分辨率切换中断处理。流程图参考如下：

<!-- source: CN V2.7 p60; unit 384 -->

![原始技术图 — CN V2.7, p60](/docs/rockchip-rk628-porting/assets/cn-p60-X433.png)

*原始技术图: CN V2.7, p60.*

<!-- source: CN V2.7 p60; unit 385 -->

![原始技术图 — CN V2.7, p60](/docs/rockchip-rk628-porting/assets/cn-p60-X432.png)

*原始技术图: CN V2.7, p60.*

<!-- source: CN V2.7 p61; unit 386 -->

![原始技术图 — CN V2.7, p61](/docs/rockchip-rk628-porting/assets/cn-p61-X437.png)

*原始技术图: CN V2.7, p61.*

<!-- source: CN V2.7 p61; unit 387 -->

### 6.3   dts 配置说明

<!-- source: CN V2.7 p61; unit 388 -->

#### 6.3.1   RK628 节点配置

<!-- source: CN V2.7 p61; unit 389 -->

```text
&i2c5 {
   status = "okay";


   rk628_csi: rk628_csi@50 {
      reg = <0x50>;
      compatible = "rockchip,rk628-csi-v4l2";
      status = "okay";
      power-domains = <&power RK3588_PD_VI>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_pin>;
      interrupt-parent = <&gpio2>;
      interrupts = <RK_PC4 IRQ_TYPE_LEVEL_HIGH>;
      enable-gpios = <&gpio1 RK_PA0 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio4 RK_PC6 GPIO_ACTIVE_HIGH>;
      plugin-det-gpios = <&gpio1 RK_PA1 GPIO_ACTIVE_LOW>;

      continues-clk = <1>;

      rockchip,camera-module-index = <0>;
      rockchip,camera-module-facing = "back";
      rockchip,camera-module-name = "HDMI-MIPI";
      rockchip,camera-module-lens-name = "RK628-CSI";

      multi-dev-info {
         dev-idx-l = <0>;
         dev-idx-r = <1>;
         combine-idx = <0>;
         pixel-offset = <0>;

         dev-num = <2>;
      };

      port {
         hdmiin_out0: endpoint {
           remote-endpoint = <&hdmi_mipi0_in>;
           data-lanes = <1 2 3 4>;
         };
      };
   };
};
```

<!-- source: CN V2.7 p62; unit 390 -->

<!-- source: CN V2.7 p62; unit 391 -->

reg：I2C 地址；RK628 典型的 7bit I2C 地址为 0x50，使用多片 RK628 时，可通过 RK628 的GPIO 改变 I2C 地址，具体参考《SOC 与 RK628 I2C 通信》章节；

<!-- source: CN V2.7 p62; unit 392 -->

compatible：

<!-- source: CN V2.7 p62; unit 393 -->

compatible = "rockchip,rk628-csi" 对应 rk628_csi.c；compatible = "rockchip,rk628-csi-v4l2" 对应 rk628_csi_v4l2.c；compatible = "rockchip,rk628-bt1120-v4l2" 对应 rk628_bt1120_v4l2.c；

<!-- source: CN V2.7 p62; unit 394 -->

interrupt-parent/ interrupts：连接 RK628 中断的 GPIO 引脚；

<!-- source: CN V2.7 p62; unit 395 -->

enable-gpios：RK628 供电控制 GPIO 引脚（若为常供电可不配置）；

<!-- source: CN V2.7 p62; unit 396 -->

reset-gpios：RK628 复位控制 GPIO 引脚；

<!-- source: CN V2.7 p62; unit 397 -->

hpd-output-inverted：HPD 输出取反配置，若 HPD 输出电平在电路上做了取反，则需要使能此配置项；

<!-- source: CN V2.7 p62; unit 398 -->

![原始技术图 — CN V2.7, p62](/docs/rockchip-rk628-porting/assets/cn-p62-X442.png)

*原始技术图: CN V2.7, p62.*

<!-- source: CN V2.7 p63; unit 399 -->

plugin-det-gpios：HDMI 插入检测 GPIO 引脚，注意电路上是否有对电平取反，有效电平需要配置正确；

<!-- source: CN V2.7 p63; unit 400 -->

![原始技术图 — CN V2.7, p63](/docs/rockchip-rk628-porting/assets/cn-p63-X446.png)

*原始技术图: CN V2.7, p63.*

<!-- source: CN V2.7 p63; unit 401 -->

power-gpios：RK 主控端 MIPI RX 电源域供电控制 GPIO 引脚（若为常供电可不配置）；

<!-- source: CN V2.7 p63; unit 402 -->

hdcp-enable: 使能 HDCP 功能；

<!-- source: CN V2.7 p63; unit 403 -->

continues-clk：选择 MIPI CSI 输出连续模式或者非连续模式的 CLK。

<!-- source: CN V2.7 p63; unit 404 -->

multi-dev-info：双 MIPI 支持 4K60 场景下需要该配置（仅 RK628F/H 支持），目前 SOC 仅RK3588/RK3562/RK3576，内核5.10以上版本 支持。

<!-- source: CN V2.7 p63; unit 405 -->

#### 6.3.2   图像接收链路组合

<!-- source: CN V2.7 p63; unit 406 -->

将 RK628 转换芯片作为类 camera 设备进行开发，与 camera sensor 一样需要实现基于 V4L2 框架的驱动，数据链路配置的方法与 MIPI SOC Sensor 一致。常见的链路组合有以下三种：

<!-- source: CN V2.7 p63; unit 407 -->

RK628 -> HDMI2CSI  -> SOC

<!-- source: CN V2.7 p63; unit 408 -->

RK628 -> HDMI2DSI -> SOC

<!-- source: CN V2.7 p63; unit 409 -->

RK628 -> HDMI2BT1120 -> SOC

<!-- source: CN V2.7 p63; unit 410 -->

#### 6.3.3   HDMI2CSI 链路

<!-- source: CN V2.7 p63; unit 411 -->

##### 6.3.3.1   RK628D

<!-- source: CN V2.7 p63; unit 412 -->

以 RK3288 + CSI_V4L2 为例，rk628 + isp1 链路配置

<!-- source: CN V2.7 p63; unit 413 -->

```text
&rk628_csi {
   status = "okay";
   /*

   * If the hpd output level is inverted on the circuit,
   * the following configuration needs to be enabled.
   */
   /* hpd-output-inverted; */
   plugin-det-gpios = <&gpio0 13 GPIO_ACTIVE_HIGH>;
   power-gpios = <&gpio0 17 GPIO_ACTIVE_HIGH>;
   rockchip,camera-module-index = <0>;
   rockchip,camera-module-facing = "back";
   rockchip,camera-module-name = "RK628-CSI";

   rockchip,camera-module-lens-name = "NC";

   port {
      hdmiin_out0: endpoint {
         remote-endpoint = <&mipi_in>;
         data-lanes = <1 2 3 4>;
      };
   };
};

&mipi_phy_rx0 {
   status = "okay";


   ports {
      #address-cells = <1>;
      #size-cells = <0>;

      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;

         mipi_in: endpoint@1 {
            reg = <1>;
            remote-endpoint = <&hdmiin_out0>;

            data-lanes = <1 2 3 4>;
         };
      };

      port@1 {
         reg = <1>;
         #address-cells = <1>;
         #size-cells = <0>;

         dphy_rx_out: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&isp_mipi_in>;

         };
      };
   };
};

&rkisp1 {
   status = "okay";
   port {
      #address-cells = <1>;
      #size-cells = <0>;

      isp_mipi_in: endpoint@0 {
         reg = <0>;

         remote-endpoint = <&dphy_rx_out>;
      };
   };
};

&isp_mmu {

   status = "okay";
};
```

<!-- source: CN V2.7 p64; unit 414 -->

<!-- source: CN V2.7 p65; unit 415 -->

<!-- source: CN V2.7 p65; unit 416 -->

以 RK3568 + CSI_V4L2 为例，rk628 + isp2 链路配置：

<!-- source: CN V2.7 p65; unit 417 -->

```text
&i2c2 {
   status = "okay";

   pinctrl-names = "default";
   pinctrl-0 = <&i2c2m1_xfer>;

   rk628_csi: rk628_csi@32 {
      compatible = "rockchip,rk628-csi-v4l2";
      reg = <0x50>;
      interrupt-parent = <&gpio4>;
      interrupts = <16 IRQ_TYPE_LEVEL_LOW>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_irq>;
      reset-gpios = <&gpio4 RK_PD2 GPIO_ACTIVE_LOW>;
      plugin-det-gpios = <&gpio0 RK_PD6 GPIO_ACTIVE_LOW>;
      rockchip,camera-module-index = <0>;

      rockchip,camera-module-facing = "back";
      rockchip,camera-module-name = "RK628-CSI";
      rockchip,camera-module-lens-name = "NC";
      port {
         rk628_out: endpoint {
           remote-endpoint = <&mipi_in>;
           data-lanes = <1 2 3 4>;
         };
      };
   };
};


&csi2_dphy_hw {
   status = "okay";
};

&csi2_dphy0 {
   status = "okay";

   ports {
      #address-cells = <1>;
      #size-cells = <0>;
      port@0 {
         reg = <0>;
         #address-cells = <1>;

         #size-cells = <0>;

         mipi_in: endpoint@0 {
           reg = <0>;
           remote-endpoint = <&rk628_out>;
           data-lanes = <1 2 3 4>;
         };
      };
      port@1 {
         reg = <1>;

         #address-cells = <1>;
         #size-cells = <0>;

         csidphy0_out: endpoint@0 {
           reg = <0>;
           remote-endpoint = <&isp0_in>;
         };
      };
   };
};

&rkisp {

   status = "okay";
};

&rkisp_mmu {
   status = "okay";
};

&rkisp_vir0 {
   status = "okay";

   port {
      #address-cells = <1>;
      #size-cells = <0>;


      isp0_in: endpoint@0 {
         reg = <0>;
         remote-endpoint = <&csidphy0_out>;
      };
   };
};
```

<!-- source: CN V2.7 p66; unit 418 -->

<!-- source: CN V2.7 p66; unit 419 -->

RK3568，rk628 + vicap 链路配置：

<!-- source: CN V2.7 p66; unit 420 -->

```text
&i2c2 {
   status = "okay";
   pinctrl-names = "default";

   pinctrl-0 = <&i2c2m1_xfer>;

   rk628_csi: rk628_csi@32 {
      compatible = "rockchip,rk628-csi-v4l2";
      reg = <0x50>;
      //clocks = <&ext_cam_clk>;
      //clock-names = "xvclk";

      interrupt-parent = <&gpio4>;
      interrupts = <16 IRQ_TYPE_LEVEL_LOW>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_irq>;

      //power-gpios = <&gpio0 RK_PD5 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio4 RK_PD2 GPIO_ACTIVE_LOW>;
      plugin-det-gpios = <&gpio0 RK_PD6 GPIO_ACTIVE_LOW>;
      rockchip,camera-module-index = <0>;
      rockchip,camera-module-facing = "back";

      rockchip,camera-module-name = "RK628-CSI";
      rockchip,camera-module-lens-name = "NC";
      port {
         rk628_out: endpoint {
            remote-endpoint = <&mipi_in>;
            data-lanes = <1 2 3 4>;
         };
      };
   };
};

&csi2_dphy_hw {

   status = "okay";
};

&csi2_dphy0 {
   status = "okay";

   ports {
      #address-cells = <1>;
      #size-cells = <0>;
      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;


         mipi_in: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&rk628_out>;
            data-lanes = <1 2 3 4>;
         };
      };
      port@1 {
         reg = <1>;
         #address-cells = <1>;
         #size-cells = <0>;


         csidphy0_out: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&mipi_csi2_input>;
            data-lanes = <1 2 3 4>;
         };
      };
   };
};

&mipi_csi2 {
   status = "okay";

   ports {

      #address-cells = <1>;
      #size-cells = <0>;
      port@0 {
         reg = <0>;
         #address-cells = <1>;

         #size-cells = <0>;

         mipi_csi2_input: endpoint@1 {
           reg = <1>;
           remote-endpoint = <&csidphy0_out>;
           data-lanes = <1 2 3 4>;
         };
      };

      port@1 {
         reg = <1>;
         #address-cells = <1>;

         #size-cells = <0>;

         mipi_csi2_output: endpoint@0 {
           reg = <0>;
           remote-endpoint = <&cif_mipi_in>;
           data-lanes = <1 2 3 4>;
         };
      };
   };
};

&rkcif {
   status = "okay";

};

&rkcif_mipi_lvds {
   status = "okay";

   port {
      cif_mipi_in: endpoint {
         remote-endpoint = <&mipi_csi2_output>;
         data-lanes = <1 2 3 4>;
      };
   };
};


&rkcif_mmu {
   status = "okay";
};
```

<!-- source: CN V2.7 p67; unit 421 -->

<!-- source: CN V2.7 p68; unit 422 -->

<!-- source: CN V2.7 p68; unit 423 -->

##### 6.3.3.2   RK628F/H

<!-- source: CN V2.7 p68; unit 424 -->

RK628F/H 对接 SOC DTS 配置与 RK628D 基本一致，可以参考 RK628D。

<!-- source: CN V2.7 p68; unit 425 -->

RK628F/H 支持双 MIPI 的配置，目前仅支持搭配 RK3588/RK3562 主控，下面以 RK3588 双 MIPI 为例，rk628F /H + vicap 链路配置，RK628F/H CSI0/CSI1 分别接入 RK3588 CSI0/CSI1

<!-- source: CN V2.7 p68; unit 426 -->

```text
&csi2_dphy0 {
   status = "okay";
   ports {
      #address-cells = <1>;

      #size-cells = <0>;
      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;

         hdmi_mipi2_in: endpoint@1 {
            reg = <1>;
            remote-endpoint = <&hdmiin_out1>;
            data-lanes = <1 2 3 4>;
         };
      };

      port@1 {
         reg = <1>;
         #address-cells = <1>;
         #size-cells = <0>;

         csidphy0_out: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&mipi2_csi2_input>;
         };
      };
   };
};


&csi2_dphy0_hw {
   status = "okay";
};

&csi2_dphy1_hw {
   status = "okay";
};

&i2c3 {
   status = "okay";
   clock-frequency = <400000>;


   rk628_csi: rk628_csi@50 {
      reg = <0x50>;
      compatible = "rockchip,rk628-csi-v4l2";
      status = "okay";
      power-domains = <&power RK3588_PD_VI>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_pin>;
      interrupt-parent = <&gpio1>;
      interrupts = <RK_PB2 IRQ_TYPE_LEVEL_HIGH>;
      enable-gpios = <&gpio1 RK_PA7 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio1 RK_PB1 GPIO_ACTIVE_HIGH>;
      plugin-det-gpios = <&gpio2 RK_PB6 GPIO_ACTIVE_LOW>;
      continues-clk = <1>;


      rockchip,camera-module-index = <0>;
      rockchip,camera-module-facing = "back";
      rockchip,camera-module-name = "HDMI-MIPI2";
      rockchip,camera-module-lens-name = "RK628-CSI";


      multi-dev-info {
         dev-idx-l = <2>;
         dev-idx-r = <4>;
         combine-idx = <2>;
         pixel-offset = <0>;
         dev-num = <2>;
      };

      port {
         hdmiin_out1: endpoint {
            remote-endpoint = <&hdmi_mipi2_in>;
            data-lanes = <1 2 3 4>;

         };
      };
   };
};

&mipi_dcphy0 {
   status = "okay";
};

&mipi_dcphy1 {
   status = "okay";
};


&mipi2_csi2 {
   status = "okay";

   ports {
      #address-cells = <1>;
      #size-cells = <0>;

      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;


         mipi2_csi2_input: endpoint@1 {
            reg = <1>;
            remote-endpoint = <&csidphy0_out>;
         };
      };

      port@1 {
         reg = <1>;
         #address-cells = <1>;
         #size-cells = <0>;

         mipi2_csi2_output: endpoint@0 {
            reg = <0>;

            remote-endpoint = <&cif_mipi_in2>;
         };
      };
   };
};


&rkcif {
   status = "okay";
};

&rkcif_mipi_lvds2 {
   status = "okay";

   port {
      cif_mipi_in2: endpoint {
         remote-endpoint = <&mipi2_csi2_output>;
      };
   };

};

&rkcif_mmu {
   status = "okay";
};
```

<!-- source: CN V2.7 p69; unit 427 -->

<!-- source: CN V2.7 p70; unit 428 -->

<!-- source: CN V2.7 p71; unit 429 -->

<!-- source: CN V2.7 p71; unit 430 -->

#### 6.3.4   HDMI2DSI 转换

<!-- source: CN V2.7 p71; unit 431 -->

##### 6.3.4.1   RK628D

<!-- source: CN V2.7 p71; unit 432 -->

RK628D 在 HDMI To MIPI CSI 应用场景存在色域空间转换或图像格式的上下采样，图像色彩少量细节可能会有轻微偏差，可以采用 HDMI To MIPI DSI 替代 HDMI To MIPI CSI 方案，主控直接接收 RGB888格式图像，应用层使用 rgb2yuv 算法库对其进行格式转换。需要注意的是：

<!-- source: CN V2.7 p71; unit 433 -->

最大支持分辨率 1080P60；

<!-- source: CN V2.7 p71; unit 434 -->

目前支持接收 MIPI DSI 的 AP：RK1109、RK1126、RK3566、RK3568、RK3588、RK3562、RK3576；

<!-- source: CN V2.7 p71; unit 435 -->

不支持接收 MIPI DSI 的 AP：RK3288、RK3326、RK3368、RK3399 等早期芯片。

<!-- source: CN V2.7 p71; unit 436 -->

CSI 与 DSI 代码兼容，只是 dts 的 compatible 做区分：

<!-- source: CN V2.7 p71; unit 437 -->

CSI 为 compatible = "rockchip,rk628-csi-v4l2";

<!-- source: CN V2.7 p71; unit 438 -->

DSI 为 compatible = "rockchip,rk628-dsi-v4l2"；

<!-- source: CN V2.7 p71; unit 439 -->

以 RK3568 为例

<!-- source: CN V2.7 p71; unit 440 -->

```text
&i2c2 {
   status = "okay";
   pinctrl-names = "default";

   pinctrl-0 = <&i2c2m1_xfer>;

   rk628_csi: rk628_csi@32 {
      compatible = "rockchip,rk628-dsi-v4l2";
      reg = <0x50>;

      interrupt-parent = <&gpio4>;
      interrupts = <16 IRQ_TYPE_LEVEL_LOW>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_irq>;
      //power-gpios = <&gpio0 RK_PD5 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio4 RK_PD2 GPIO_ACTIVE_LOW>;

      plugin-det-gpios = <&gpio0 RK_PD6 GPIO_ACTIVE_LOW>;
      rockchip,camera-module-index = <0>;
      rockchip,camera-module-facing = "back";
      rockchip,camera-module-name = "RK628-CSI";
      rockchip,camera-module-lens-name = "NC";
      port {
         rk628_out: endpoint {
            remote-endpoint = <&hdmi2mipi_in>;
            data-lanes = <1 2 3 4>;
         };
      };
   };

};

&mipi_csi2 {
   status = "okay";

   ports {
      #address-cells = <1>;
      #size-cells = <0>;

      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;


         mipi_csi2_input: endpoint@1 {
            reg = <1>;
            remote-endpoint = <&csidphy_out>;
            data-lanes = <1 2 3 4>;
         };
      };

      port@1 {
         reg = <1>;
         #address-cells = <1>;
         #size-cells = <0>;


         mipi_csi2_output: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&cif_mipi_in>;
            data-lanes = <1 2 3 4>;
         };
      };
   };
};

&rkcif {
   status = "okay";
};


&rkcif_mipi_lvds {
   status = "okay";
   port {
      cif_mipi_in: endpoint {

         remote-endpoint = <&mipi_csi2_output>;
         data-lanes = <1 2 3 4>;
      };
   };
};

&rkcif_mmu {
   status = "okay";
};

&csi2_dphy_hw {
   status = "okay";

};

&csi2_dphy0 {
   status = "okay";

   ports {
      #address-cells = <1>;
      #size-cells = <0>;
      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;


         hdmi2mipi_in: endpoint@0 {
           reg = <1>;
           remote-endpoint = <&rk628_out>;
           data-lanes = <1 2 3 4>;
         };
      };
      port@1 {
         reg = <1>;
         #address-cells = <1>;
         #size-cells = <0>;

         csidphy_out: endpoint@0 {

           reg = <0>;
           remote-endpoint = <&mipi_csi2_input>;
         };
      };
   };
};
```

<!-- source: CN V2.7 p72; unit 441 -->

<!-- source: CN V2.7 p73; unit 442 -->

<!-- source: CN V2.7 p73; unit 443 -->

若主控是 RK3568，代码版本比较旧的话，CIF 需要包含下面的提交来支持 RGB888 接收：

<!-- source: CN V2.7 p73; unit 444 -->

RK3588 kernel-5.10 驱动代码默认支持 RGB888。

<!-- source: CN V2.7 p73; unit 445 -->

```text
From e925e385a41a857e8e50020b5df9a2d41b166d83 Mon Sep 17 00:00:00 2001
From: Zefa Chen <zefa.chen@rock-chips.com>
Date: Thu, 02 Sep 2021 15:07:13 +0800

Subject: [PATCH] media: rockchip: cif fix errors in rgb24 data format
Signed-off-by: Zefa Chen <zefa.chen@rock-chips.com>
Change-Id: I0766997860f06dc25e604c2ea8425049a987fdc5

---

diff --git a/drivers/media/platform/rockchip/cif/capture.c b/drivers/media/platform/rockchip/cif/capture.c
index 6c0aa7d..36bd2c9 100644
--- a/drivers/media/platform/rockchip/cif/capture.c
+++ b/drivers/media/platform/rockchip/cif/capture.c
@@ -1785,13 +1785,11 @@
     * needs aligned with :ALIGN(bits_per_pixel * width * 2, 8), to optimize
reading and
     * writing of ddr, aliged with 256
     */

-   if (fmt->fmt_type == CIF_FMT_TYPE_RAW && stream->is_compact) {
+   if (fmt->fmt_type == CIF_FMT_TYPE_RAW && stream->is_compact &&
+      fmt->csi_fmt_val != CSI_WRDDR_TYPE_RGB888) {
       channel->virtual_width = ALIGN(channel->width * fmt->raw_bpp / 8, 256);
    } else {
-      if (fmt->fmt_type == CIF_FMT_TYPE_RAW && fmt->csi_fmt_val !=
CSI_WRDDR_TYPE_RAW8)
-         channel->virtual_width = ALIGN(channel->width * 2, 8);
-      else
-         channel->virtual_width = ALIGN(channel->width * fmt->bpp[0] / 8, 8);
+      channel->virtual_width = ALIGN(channel->width * fmt->bpp[0] / 8, 8);
    }


    if (channel->fmt_val == CSI_WRDDR_TYPE_RGB888)
@@ -3240,7 +3238,8 @@

       if (fmt->fmt_type == CIF_FMT_TYPE_RAW && stream->is_compact &&
          (dev->active_sensor->mbus.type == V4L2_MBUS_CSI2 ||
-         dev->active_sensor->mbus.type == V4L2_MBUS_CCP2)) {
+         dev->active_sensor->mbus.type == V4L2_MBUS_CCP2) &&
+         fmt->csi_fmt_val != CSI_WRDDR_TYPE_RGB888) {
          bpl = ALIGN(width * fmt->raw_bpp / 8, 256);
       } else {
          bpp = rkcif_align_bits_per_pixel(stream, fmt, i);
@@ -4659,13 +4658,11 @@

     * needs aligned with :ALIGN(bits_per_pixel * width * 2, 8), to optimize
reading and
     * writing of ddr, aliged with 256
     */
-   if (fmt->fmt_type == CIF_FMT_TYPE_RAW && stream->is_compact) {
+   if (fmt->fmt_type == CIF_FMT_TYPE_RAW && stream->is_compact &&
+      fmt->csi_fmt_val != CSI_WRDDR_TYPE_RGB888) {
       *crop_vwidth = ALIGN(raw_width * fmt->raw_bpp / 8, 256);
    } else {
-      if (fmt->fmt_type == CIF_FMT_TYPE_RAW)
-         *crop_vwidth = ALIGN(raw_width * 2, 8);
-      else
-         *crop_vwidth = ALIGN(raw_width * fmt->bpp[0] / 8, 8);

+      *crop_vwidth = ALIGN(raw_width * fmt->bpp[0] / 8, 8);
    }
if (channel->fmt_val == CSI_WRDDR_TYPE_RGB888)
```

<!-- source: CN V2.7 p74; unit 446 -->

<!-- source: CN V2.7 p75; unit 447 -->

<!-- source: CN V2.7 p75; unit 448 -->

rk628-dsi 输出默认是 command mode，cif 接收也需要使用 command mode，修改如下:

<!-- source: CN V2.7 p75; unit 449 -->

```text
diff --git a/drivers/media/platform/rockchip/cif/capture.c b/drivers/media/platform/rockchip/cif/capture.c

index 36bd2c99c707..fc4181daed2c 100644
--- a/drivers/media/platform/rockchip/cif/capture.c
+++ b/drivers/media/platform/rockchip/cif/capture.c
@@ -1753,7 +1753,7 @@ static int rkcif_csi_channel_init(struct rkcif_stream
*stream,

      channel->fmt_val = stream->cif_fmt_out->csi_fmt_val;

-     channel->cmd_mode_en = 0; /* default use DSI Video Mode */
+     channel->cmd_mode_en = 1; /* default use DSI Video Mode */

      if (stream->crop_enable) {
           channel->crop_en = 1;
```

<!-- source: CN V2.7 p75; unit 450 -->

对接 camera 框架

<!-- source: CN V2.7 p75; unit 451 -->

若主控是 RK356X 系列，只能对接 camera 框架，camera 框架不支持 RGB 直接送显示，因此需要加上rgb2yuv 算法库。

<!-- source: CN V2.7 p75; unit 452 -->

CameraHal 加上如下 rgb2yuv 算子库，若 SDK 代码版本是安卓 11-R9，则可以直接加上下面的补丁，具体见补丁 rk356x_HAL3_support_rgb2yuv_patch.rar

<!-- source: CN V2.7 p75; unit 453 -->

若代码版本是 R10 或者 R11 的，在 hardware/rockchip/camera 下先添加如下修改，再打上上述补丁

<!-- source: CN V2.7 p75; unit 454 -->

```text
diff --git a/psl/rkisp2/RKISP2GraphConfig.cpp b/psl/rkisp2/RKISP2GraphConfig.cpp
index 2a5fa5a..3d2409c 100755
--- a/psl/rkisp2/RKISP2GraphConfig.cpp

+++ b/psl/rkisp2/RKISP2GraphConfig.cpp
@@ -76,6 +76,7 @@ const string MEDIACTL_POSTVIEWNAME = "postview";

 const string MEDIACTL_STATNAME = "rkisp1-statistics";
 const string MEDIACTL_VIDEONAME_CIF = "stream_cif_dvp_id0";
+const string MEDIACTL_VIDEONAME_CIF_MIPI_ID0 = "stream_cif_mipi_id0";

 RKISP2GraphConfig::RKISP2GraphConfig() :
      mManager(nullptr),
@@ -2620,6 +2621,13 @@ status_t RKISP2GraphConfig::getImguMediaCtlConfig(int32_t
cameraId,
            addLinkParams("rkisp-isp-subdev", 2, "rkisp_mainpath", 0, 1,

MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
            addLinkParams("rkisp-isp-subdev", 2, "rkisp_selfpath", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
         }
+     } else if(mipName2.find("mipi") != std::string::npos) {
+        addLinkParams(mipName, mipSrcPad, mipName2, csiSinkPad, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
+        addLinkParams(mipName2, 1, "stream_cif_mipi_id0", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
+        addLinkParams(mipName2, 2, "stream_cif_mipi_id1", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
+        addLinkParams(mipName2, 3, "stream_cif_mipi_id2", 0, 1,

MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
+        addLinkParams(mipName2, 4, "stream_cif_mipi_id3", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
+        mSensorLinkedToCIF = true;
      } else {
         addLinkParams(mipName, mipSrcPad, csiName, csiSinkPad, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
         addLinkParams(csiName, csiSrcPad, IspName, ispSinkPad, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
@@ -2628,6 +2636,12 @@ status_t RKISP2GraphConfig::getImguMediaCtlConfig(int32_t
cameraId,
         addLinkParams(csiName, 5, "rkisp_rawwr3", 0, 1,

MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
      }
   }
+  if(mSensorLinkedToCIF){
+     addImguVideoNode(IMGU_NODE_VIDEO, MEDIACTL_VIDEONAME_CIF_MIPI_ID0,
mediaCtlConfig);
+     addFormatParams(MEDIACTL_VIDEONAME_CIF_MIPI_ID0, mCurSensorFormat.width,
mCurSensorFormat.height,
+           0, V4L2_PIX_FMT_NV12, 0, 0, mediaCtlConfig);
+     return OK;
+  }
   // isp input pad format and selection config
   addFormatParams(IspName, ispInWidth, ispInHeight, ispSinkPad, ispInFormat,

0, 0, mediaCtlConfig);
   addSelectionParams(IspName, ispInWidth, ispInHeight, 0, 0,
V4L2_SEL_TGT_CROP, ispSinkPad, mediaCtlConfig);
```

<!-- source: CN V2.7 p76; unit 455 -->

<!-- source: CN V2.7 p76; unit 456 -->

请注意，该补丁仅仅适用于 RK3568+ANDROID11 平台使用。

<!-- source: CN V2.7 p76; unit 457 -->

对接 TV 框架

<!-- source: CN V2.7 p76; unit 458 -->

如果 HDMI to DSI 的通路搭配的是 RK3588或者RK3576 使用的话，应用框架可以走 TV 框架，可以支持RGB888 格式直接送显示，不需要加上述 rgb2yuv 的算法库，具体在 APK 适配方法章节描述。

<!-- source: CN V2.7 p76; unit 459 -->

##### 6.3.4.2   RK628F/H

<!-- source: CN V2.7 p76; unit 460 -->

RK628F/H 解决了 RK628D 在不同图像格式输入时，格式转换下采样引入的色偏问题。

<!-- source: CN V2.7 p76; unit 461 -->

但在某些对画质要求比较高的场景，RK628F/H 可以通过 DSI 接口输出 RGB888 图像格式，RK3588 等主控接收 RGB888 格式图像之后，通过 TV 框架直接送显示，不需要经过颜色转换，保证画质没有丢失。RK628F/H 有两个 MIPI-DSI，同样支持双 MIPI 模式对接 RK3588 主控。

<!-- source: CN V2.7 p76; unit 462 -->

以 RK3588 + RK628F/H 双 MIPI 为例

<!-- source: CN V2.7 p76; unit 463 -->

只需要将 compatible 修改成 DSI 的即可。

<!-- source: CN V2.7 p76; unit 464 -->

```text
......
&i2c3 {

   status = "okay";
   clock-frequency = <400000>;
   rk628_csi: rk628_csi@50 {
      reg = <0x50>;

      compatible = "rockchip,rk628-dsi-v4l2";
      status = "okay";
      power-domains = <&power RK3588_PD_VI>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_pin>;
      interrupt-parent = <&gpio1>;
      interrupts = <RK_PB2 IRQ_TYPE_LEVEL_HIGH>;
      enable-gpios = <&gpio1 RK_PA7 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio1 RK_PB1 GPIO_ACTIVE_HIGH>;
      plugin-det-gpios = <&gpio2 RK_PB6 GPIO_ACTIVE_LOW>;

      rockchip,camera-module-index = <0>;

      rockchip,camera-module-facing = "back";
      rockchip,camera-module-name = "HDMI-MIPI2";
      rockchip,camera-module-lens-name = "RK628-CSI";

      multi-dev-info {
         dev-idx-l = <2>;
         dev-idx-r = <4>;
         combine-idx = <2>;
         pixel-offset = <0>;
         dev-num = <2>;
      };

      port {

         hdmiin_out1: endpoint {
           remote-endpoint = <&hdmi_mipi2_in>;
           data-lanes = <1 2 3 4>;
         };
      };
   };
};
......
```

<!-- source: CN V2.7 p77; unit 465 -->

<!-- source: CN V2.7 p77; unit 466 -->

#### 6.3.5   HDMI2BT1120 转换

<!-- source: CN V2.7 p77; unit 467 -->

HDMI2BT1120 链路配置上，RK628D 与 RK628F/H 基本一致，此处不再赘述。

<!-- source: CN V2.7 p77; unit 468 -->

以 RK3568 + BT1120_V4L2 为例

<!-- source: CN V2.7 p77; unit 469 -->

```text
&i2c4 {
   pinctrl-names = "default";
   pinctrl-0 = <&i2c4m1_xfer>;

   clock-frequency = <400000>;
   status = "okay";

   rk628_bt1120: rk628_bt1120@50 {
      compatible = "rockchip,rk628-bt1120-v4l2";
      reg = <0x50>;
      status = "disabled";
      pinctrl-names = "default";
      pinctrl-0 = <&cif_dvp_clk &cif_dvp_bus16 &cif_dvp_bus8>;
      interrupt-parent = <&gpio2>;
      interrupts = <15 IRQ_TYPE_LEVEL_HIGH>;

      enable-gpios = <&gpio2 RK_PC0 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio2 RK_PB0 GPIO_ACTIVE_LOW>;
      plugin-det-gpios = <&gpio1 RK_PA2 GPIO_ACTIVE_LOW>;
      rockchip,camera-module-index = <0>;
      rockchip,camera-module-facing = "back";
      rockchip,camera-module-name = "RK628-BT1120";
      rockchip,camera-module-lens-name = "NC";
      dual-edge = <1>;

      port {
         lt8619c_out: endpoint {
           remote-endpoint = <&cif_para_in>;

           bus-width = <16>;
           pclk-sample = <1>;
         };
      };
   };
};

&rkcif_dvp {
   status = "okay";

   port {
      /* Parallel bus endpoint */
      cif_para_in: endpoint {

         remote-endpoint = <&lt8619c_out>;
      };
   };
};

&rkcif {
   status = "okay";
};

&rkcif_mmu {
   status = "okay";
};
```

<!-- source: CN V2.7 p78; unit 470 -->

<!-- source: CN V2.7 p78; unit 471 -->

### 6.4   开启 HDCP 功能

<!-- source: CN V2.7 p78; unit 472 -->

RK628 HDMIRX 支持 HDCP1.4，HDCP 功能默认关闭，需要时打开：

<!-- source: CN V2.7 p78; unit 473 -->

1\. dtsRK628 节点使能 HDCP

<!-- source: CN V2.7 p78; unit 474 -->

```text
           reset-gpios = <&gpio7 RK_PB4 GPIO_ACTIVE_LOW>;
           plugin-det-gpios = <&gpio0 13 GPIO_ACTIVE_HIGH>;

           power-gpios = <&gpio0 17 GPIO_ACTIVE_HIGH>;
+          hdcp-enable = <1>;
```

<!-- source: CN V2.7 p79; unit 475 -->

2\. 烧录 HDCP RX Key

<!-- source: CN V2.7 p79; unit 476 -->

HDCP Key 需要从 HDCP 协会购买，RK 不提供 Key，请注意 HDCP 有区分 TX 和 RK Key，我们需要的是 RK Key；

<!-- source: CN V2.7 p79; unit 477 -->

拿到 Key 源文件之后，用 KeyConverter 工具拆分 Key，并转成 skf 后缀的烧录文件，具体请看工具使用说明；

<!-- source: CN V2.7 p79; unit 478 -->

转成.skf 文件之后，使用 RKDevInfoWriteTool 工具进行烧写，工具会对 Key 进行加密，具体请看工具使用说明；

<!-- source: CN V2.7 p79; unit 479 -->

### 6.5   开启 scaler 功能

<!-- source: CN V2.7 p79; unit 480 -->

有些平台不支持 MIPI 4K 接收，但是 RK628 HDMI IN 可以支持 4K 输入， 所以有客戶需求，无论什么分辨率输入，CSI 都按 1080P 输出，dts 只需要添加如下配置：

<!-- source: CN V2.7 p79; unit 481 -->

```text
           reset-gpios = <&gpio7 RK_PB4 GPIO_ACTIVE_LOW>;
           plugin-det-gpios = <&gpio0 13 GPIO_ACTIVE_HIGH>;
           power-gpios = <&gpio0 17 GPIO_ACTIVE_HIGH>;

+          scaler-en = <1>;
```

<!-- source: CN V2.7 p79; unit 482 -->

### 6.6   csi 支持 2 lanes

<!-- source: CN V2.7 p79; unit 483 -->

csi 默认配置是 4 lanes：

<!-- source: CN V2.7 p79; unit 484 -->

```text
csi->csi_lanes_in_use = USE_4_LANES;
```

<!-- source: CN V2.7 p79; unit 485 -->

如果需要配置成 2 lanes，那么把 csi->csi_lanes_in_use 配置成 2；

<!-- source: CN V2.7 p79; unit 486 -->

### 6.7   连续 MIPI 模式与非连续 MIPI

<!-- source: CN V2.7 p79; unit 487 -->

设置连续 MIPI 模式，可在 DTS 配置：

<!-- source: CN V2.7 p79; unit 488 -->

```text
continues-clk = <1>;
```

<!-- source: CN V2.7 p79; unit 489 -->

### 6.8   双 MIPI 模式配置（仅 RK628F/H 支持）

<!-- source: CN V2.7 p79; unit 490 -->

RK628F/H 受限于 MIPI DPHY 速率，一路 MIPI 最大只能支持 4K30，RK628F/H 有两路 MIPI-CSI，在对接 RK3588/RK3562 等有多路 MIPI-CSI 的主控平台时，4K60 的场景下，可以将 4K60 视频数据拆分成左右两半图像分别通过两路 4lane 的 MIPI-CSI 进行传输，由主控平台将图像进行合成为 4K60。

<!-- source: CN V2.7 p79; unit 491 -->

注：对接 RK3588 等 SOC 平台，图像拼接合成直接在 VI 驱动完成，不会额外增加延时以及负载。

<!-- source: CN V2.7 p80; unit 492 -->

#### 6.8.1   双 MIPI split 模式说明

<!-- source: CN V2.7 p80; unit 493 -->

RK628F/H 内部支持可以将 HDMIRX 接收的图像 split 分割成左右两半，分别给到两路 CSI 进行传输，如下图所示：

<!-- source: CN V2.7 p80; unit 494 -->

![原始技术图 — CN V2.7, p80](/docs/rockchip-rk628-porting/assets/cn-p80-X494.png)

*原始技术图: CN V2.7, p80.*

<!-- source: CN V2.7 p80; unit 495 -->

基于上述，在对接 RK3588 等有多路 MIPI 接口的 SOC 平台时，就可以采用双 MIPI 模式，接收下 4K60分辨率的图像数据，功能流程如下图所示。

<!-- source: CN V2.7 p80; unit 496 -->

![原始技术图 — CN V2.7, p80](/docs/rockchip-rk628-porting/assets/cn-p80-X495.png)

*原始技术图: CN V2.7, p80.*

<!-- source: CN V2.7 p80; unit 497 -->

#### 6.8.2   双 MIPI 模式配置

<!-- source: CN V2.7 p80; unit 498 -->

以下介绍一下 RK628F/H 双 MIPI 模式对接 RK3588 主控，实现 4K60 HDMI-IN 功能的配置。

<!-- source: CN V2.7 p80; unit 499 -->

关于双 MIPI mode 对接 RK SOC 调试细节，具体可参考文档（SDK 目录RKDocs/common/camera/HAL3）《Rockchip_RK3588_HDMI_To_CSI_Dual_Mipi_Developer_Guide》

<!-- source: CN V2.7 p80; unit 500 -->

##### 6.8.2.1   RK628F/H 配置

<!-- source: CN V2.7 p80; unit 501 -->

RK628F/H 驱动版本已经支持双 MIPI 模式，默认在 HDMI-IN 的分辨率为 4K60 时，采用两个 MIPI-CSI进行传输，DTS 配置 multi-dev-info 解析如下：

<!-- source: CN V2.7 p80; unit 502 -->

dev-idx-l：左半边图像对应的 mipi 接口编号

<!-- source: CN V2.7 p80; unit 503 -->

dev-idx-r：右半边图像对应的 mipi 接口编号

<!-- source: CN V2.7 p80; unit 504 -->

combine-idx：将左右两张图想合并到其中的一个 idx，dts 的链路以这个 idx 为准

<!-- source: CN V2.7 p81; unit 505 -->

pixel-offset：像素偏移，默认设置 0

<!-- source: CN V2.7 p81; unit 506 -->

dev-num：多少个 mipi 设备进行拼接

<!-- source: CN V2.7 p81; unit 507 -->

举例如下，以 RK628F/H CSI0/1 分别接入 RK3588 CSI0/1 RX 为例：

<!-- source: CN V2.7 p81; unit 508 -->

```text
&i2c3 {
   status = "okay";

   clock-frequency = <400000>;

   rk628_csi: rk628_csi@50 {
      reg = <0x50>;
      compatible = "rockchip,rk628-csi-v4l2";
      status = "okay";
      power-domains = <&power RK3588_PD_VI>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_pin>;
      interrupt-parent = <&gpio1>;
      interrupts = <RK_PB2 IRQ_TYPE_LEVEL_HIGH>;
      enable-gpios = <&gpio1 RK_PA7 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio1 RK_PB1 GPIO_ACTIVE_HIGH>;

      plugin-det-gpios = <&gpio2 RK_PB6 GPIO_ACTIVE_LOW>;
      continues-clk = <1>;

      rockchip,camera-module-index = <0>;
      rockchip,camera-module-facing = "back";
      rockchip,camera-module-name = "HDMI-MIPI2";
      rockchip,camera-module-lens-name = "RK628-CSI";

      multi-dev-info {
         dev-idx-l = <2>;
         dev-idx-r = <4>;
         combine-idx = <2>;

         pixel-offset = <0>;
         dev-num = <2>;
      };

      port {
         hdmiin_out1: endpoint {
           remote-endpoint = <&hdmi_mipi2_in>;
           data-lanes = <1 2 3 4>;
         };
      };
   };
};
```

<!-- source: CN V2.7 p81; unit 509 -->

##### 6.8.2.2   SOC 驱动代码版本要求

<!-- source: CN V2.7 p81; unit 510 -->

RK 平台的主控目前支持双 MIPI 模式的只有 RK3588/RK3562/RK3576，kernel-5.10 之后的版本才可支持，对 SOC 主控的代码版本有要求，建议将 SDK（安卓 12/13）代码更新到最新。如仅更新 kernel-

<!-- source: CN V2.7 p81; unit 511 -->

5.10 RK628 驱动代码，可能会导致编译不过，即 SDK 代码版本太旧不支持双 MIPI 导致，请更新 SDK代码版本或者 redmine 联系 RK 工程师解决。

<!-- source: CN V2.7 p82; unit 512 -->

### 6.9   不同芯片平台的接收能力

<!-- source: CN V2.7 p82; unit 513 -->

由于各个芯片平台 isp/vicap 的性能不同，对图像的最大接收能力也不同。可参考下表：

<!-- source: CN V2.7 p82; unit 514 -->

| 芯片平台 | 接收控制器 | 支持最大分辨率 |
| --- | --- | --- |
| RK3288/RK3326/RK3368 | isp | 1920x1080P60 |
| RK3399 | isp | 3840x2160P30（注：isp 需要超频） |
| RK3566/RK3568 | vicap/isp | 3840x2160P30（注：连接ISP最大1080P60） |
| RK3588/RK3562/RK3576 | vicap | 3840x2160P60（双 MIPI） |

<!-- source: CN V2.7 p82; unit 515 -->

#### 6.9.1   配置 isp 超频的方法

<!-- source: CN V2.7 p82; unit 516 -->

RK3399 配置 PLL_NPLL 为 650M：

<!-- source: CN V2.7 p82; unit 517 -->

```text
--- a/arch/arm64/boot/dts/rockchip/rk3399-vop-clk-set.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3399-vop-clk-set.dtsi
@@ -148,7 +148,7 @@

                  <50000000>, <100000000>,
                  <75000000>, <75000000>,
                  <816000000>, <816000000>,
-                 <600000000>, <200000000>,
+                 <650000000>, <200000000>,
                  <800000000>, <150000000>,
                  <75000000>, <37500000>,
                  <300000000>, <100000000>,
```

<!-- source: CN V2.7 p82; unit 518 -->

修改 rk3399 isp 最大支持频率为 650M：

<!-- source: CN V2.7 p82; unit 519 -->

```text
--- a/drivers/media/platform/rockchip/isp1/dev.c
+++ b/drivers/media/platform/rockchip/isp1/dev.c
@@ -757,7 +757,7 @@ static const unsigned int rk3368_isp_clk_rate[] = {


 /* isp clock adjustment table (MHz) */
 static const unsigned int rk3399_isp_clk_rate[] = {
-     300, 400, 600
+     300, 400, 650
 };

 static struct isp_irqs_data rk1808_isp_irqs[] = {
```

<!-- source: CN V2.7 p82; unit 520 -->

如果 rk3288 概率性 isp 报错，isp 也可以抬频尝试，一般只需留下最高频即可，该修改仅用于定位问题即可。

<!-- source: CN V2.7 p83; unit 521 -->

```text
--- a/drivers/media/platform/rockchip/isp1/dev.c
+++ b/drivers/media/platform/rockchip/isp1/dev.c
@@ -849,7 +849,7 @@ static const unsigned int rk1808_isp_clk_rate[] = {


 /* isp clock adjustment table (MHz) */
static const unsigned int rk3288_isp_clk_rate[] = {
-     150, 384, 500, 594
+     594
 };
```

<!-- source: CN V2.7 p83; unit 522 -->

转换芯片驱动中配置 isp 频率

<!-- source: CN V2.7 p83; unit 523 -->

```text
#define RK628_CSI_PIXEL_RATE_HIGH 600000000
...


static int rk628_csi_set_fmt(struct v4l2_subdev *sd,
           struct v4l2_subdev_pad_config *cfg,
           struct v4l2_subdev_format *format)
{
...
      if ((mode->width == 3840) && (mode->height == 2160)) {
           v4l2_dbg(1, debug, sd,
                 "%s res wxh:%dx%d, link freq:%llu, pixrate:%u\n",
                 __func__, mode->width, mode->height,
                 link_freq_menu_items[1], RK628_CSI_PIXEL_RATE_HIGH);
           __v4l2_ctrl_s_ctrl(csi->link_freq, 1);
           __v4l2_ctrl_s_ctrl_int64(csi->pixel_rate,

                 RK628_CSI_PIXEL_RATE_HIGH);
      }
...
}
```

<!-- source: CN V2.7 p83; unit 524 -->

isp 驱动中会对配置的频率再加 25% 的余量，所以在驱动中配置适当的频率RK628_CSI_PIXEL_RATE_HIGH 即可。

<!-- source: CN V2.7 p83; unit 525 -->

```text
drivers/media/platform/rockchip/isp1/dev.c

static int __isp_pipeline_s_isp_clk(struct rkisp1_pipeline *p)

{
...
      ctrl = v4l2_ctrl_find(sd->ctrl_handler, V4L2_CID_PIXEL_RATE);
      if (!ctrl) {
           v4l2_warn(sd, "No pixel rate control in subdev\n");
           return -EPIPE;
      }

      /* calculate data rate */
      data_rate = v4l2_ctrl_g_ctrl_int64(ctrl) *
              dev->isp_sdev.in_fmt.bus_width;
      data_rate >>= 3;
      do_div(data_rate, 1000 * 1000);


      /* increase 25% margin */
      data_rate += data_rate >> 2;
...
}
```

<!-- source: CN V2.7 p84; unit 526 -->

<!-- source: CN V2.7 p84; unit 527 -->

#### 6.9.2   配置 ISP 使用 CMA 内存的方法

<!-- source: CN V2.7 p84; unit 528 -->

部分平台 HDMI IN 接收图像数据时，根据实际系统负载，可能会存在带宽不足导致丢帧或 MIPI 接收异常等问题，参考异常 log 如下：

<!-- source: CN V2.7 p84; unit 529 -->

```text
[ 228.999567] rkisp1: MIPI mis error: 0x00800000
[ 228.999925] rkisp1: CIF_ISP_PIC_SIZE_ERROR (0x00000001)
[ 228.999976] rkisp1: CIF_ISP_PIC_SIZE_ERROR (0x00000001)rkisp1:

CIF_ISP_PIC_SIZE_ERROR (0x00000001)
[ 229.000081] rkisp1: CIF_ISP_PIC_SIZE_ERROR (0x00000001)rkisp1:
CIF_ISP_PIC_SIZE_ERROR (0x00000001)
[ 229.000187] rkisp1: CIF_ISP_PIC_SIZE_ERROR (0x00000001)rkisp1:
CIF_ISP_PIC_SIZE_ERROR (0x00000001)
[ 229.000294] rkisp1: CIF_ISP_PIC_SIZE_ERROR (0x00000001)rkisp1:
CIF_ISP_PIC_SIZE_ERROR (0x00000001)
```

<!-- source: CN V2.7 p84; unit 530 -->

此时需要提高 DDR 频率，若仍无改善，可给 ISP 预留使用 CMA 内存，以改善解决此问题：

<!-- source: CN V2.7 p84; unit 531 -->

在 rockchip_defconfig 配置预留 CMA 内存 128MB

<!-- source: CN V2.7 p84; unit 532 -->

```text
CONFIG_CMA=y
CONFIG_CMA_SIZE_MBYTES=128
```

<!-- source: CN V2.7 p84; unit 533 -->

在 dts 配置 ISP 关闭 IOMMU，使用 CMA 内存

<!-- source: CN V2.7 p84; unit 534 -->

```text
&isp_mmu {
      status = "disabled";

};
```

<!-- source: CN V2.7 p84; unit 535 -->

### 6.10   EDID 的配置方法

<!-- source: CN V2.7 p84; unit 536 -->

RK628 支持 EDID 配置，目前驱动代码中 EDID 支持的分辨率为：

<!-- source: CN V2.7 p84; unit 537 -->

3840x2160P60、3840x2160P30、1920x1080P60、1920x1080P30、1280x720P60、720x576P50、720x480P60 等常用分辨率，若需要修改分辨率支持，可直接在驱动代码中修改 EDID：

<!-- source: CN V2.7 p84; unit 538 -->

```text
static u8 rk628f_edid_init_data[] = {
   0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x00,
   0x24, 0xD0, 0x8F, 0x62, 0x01, 0x00, 0x00, 0x00,

   0x2D, 0x21, 0x01, 0x03, 0x80, 0x78, 0x44, 0x78,
   0x0A, 0xCF, 0x74, 0xA3, 0x57, 0x4C, 0xB0, 0x23,
   0x09, 0x48, 0x4C, 0x21, 0x08, 0x00, 0x61, 0x40,
   0x01, 0x01, 0x81, 0x00, 0x95, 0x00, 0xA9, 0xC0,
   0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x08, 0xE8,
   0x00, 0x30, 0xF2, 0x70, 0x5A, 0x80, 0xB0, 0x58,
   0x8A, 0x00, 0xC4, 0x8E, 0x21, 0x00, 0x00, 0x1E,
   0x02, 0x3A, 0x80, 0x18, 0x71, 0x38, 0x2D, 0x40,
   0x58, 0x2C, 0x45, 0x00, 0xB9, 0xA8, 0x42, 0x00,
   0x00, 0x1E, 0x00, 0x00, 0x00, 0xFC, 0x00, 0x49,
   0x46, 0x50, 0x20, 0x44, 0x69, 0x73, 0x70, 0x6C,

   0x61, 0x79, 0x0A, 0x20, 0x00, 0x00, 0x00, 0xFD,
   0x00, 0x3B, 0x46, 0x1F, 0x8C, 0x3C, 0x00, 0x0A,
   0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x01, 0xA8,

   0x02, 0x03, 0x39, 0xF2, 0x4D, 0x01, 0x03, 0x12,
   0x13, 0x84, 0x22, 0x1F, 0x90, 0x5D, 0x5E, 0x5F,
   0x60, 0x61, 0x23, 0x09, 0x07, 0x07, 0x83, 0x01,
   0x00, 0x00, 0x6D, 0x03, 0x0C, 0x00, 0x10, 0x00,
   0x00, 0x44, 0x20, 0x00, 0x60, 0x03, 0x02, 0x01,
   0x67, 0xD8, 0x5D, 0xC4, 0x01, 0x78, 0xC0, 0x00,
   0xE3, 0x05, 0x03, 0x01, 0xE4, 0x0F, 0x00, 0x18,
   0x00, 0x02, 0x3A, 0x80, 0x18, 0x71, 0x38, 0x2D,

   0x40, 0x58, 0x2C, 0x45, 0x00, 0xB9, 0xA8, 0x42,
   0x00, 0x00, 0x1E, 0x08, 0xE8, 0x00, 0x30, 0xF2,
   0x70, 0x5A, 0x80, 0xB0, 0x58, 0x8A, 0x00, 0xC4,
   0x8E, 0x21, 0x00, 0x00, 0x1E, 0x00, 0x00, 0x00,
   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x93,
};
```

<!-- source: CN V2.7 p85; unit 539 -->

<!-- source: CN V2.7 p85; unit 540 -->

推荐一个 EDID 编辑工具：http://www.quantumdata.com/support/downloads/980/release_5_05/R_980mgr_5.05_Win32.msi

<!-- source: CN V2.7 p85; unit 541 -->

### 6.11   camera3_profiles.xml 配置

<!-- source: CN V2.7 p85; unit 542 -->

走 camera 框架预览需要适配 camera3_profiles.xml，注册 camera 设备。

<!-- source: CN V2.7 p85; unit 543 -->

camera3_profiles.xml 文件对应 SDK 目录下具体芯片平台的文件：

<!-- source: CN V2.7 p85; unit 544 -->

```text
hardware/rockchip/camera/etc/camera/camera3_profiles_rk3xxx.xml
```

<!-- source: CN V2.7 p85; unit 545 -->

主要配置注意事项如下，详情可参考 SOC Sensor 的配置方法：

<!-- source: CN V2.7 p85; unit 546 -->

name：需要与驱动名称一致，有大小写区别；

<!-- source: CN V2.7 p85; unit 547 -->

moduleId：需要与驱动 dts 中配置的 index 一致；

<!-- source: CN V2.7 p85; unit 548 -->

![原始技术图 — CN V2.7, p85](/docs/rockchip-rk628-porting/assets/cn-p85-X514.png)

*原始技术图: CN V2.7, p85.*

以下为截图中完整可见文字的可复制转录；截图边缘被裁切的字符不猜测补全，片段不保证可独立执行。

```text
</Profiles>
<Profiles cameraId="0" name="rk628-csi" moduleId="m00">
    <Supported_hardware>
        <hwType value="SUPPORTED_HW_RKISP1"/>
```

<!-- source: CN V2.7 p86; unit 549 -->

![原始技术图 — CN V2.7, p86](/docs/rockchip-rk628-porting/assets/cn-p86-X520.png)

*原始技术图: CN V2.7, p86.*

以下为截图中完整可见文字的可复制转录；截图边缘被裁切的字符不猜测补全，片段不保证可独立执行。

```text
&rk628_csi {
    status = "okay";
    /*
     * If the hpd output level is inverted on the circuit,
     * the following configuration needs to be enabled.
     */
    /* hpd-output-inverted; */
    plugin-det-gpios = <&gpio0 13 GPIO_ACTIVE_HIGH>;
    power-gpios = <&gpio0 17 GPIO_ACTIVE_HIGH>;
    rockchip,camera-module-index = <0>;
    rockchip,camera-module-facing = "back";
    rockchip,camera-module-name = "RK628-CSI";
    rockchip,camera-module-lens-name = "NC";
```

<!-- source: CN V2.7 p86; unit 550 -->

scaler.availableStreamConfigurations/scaler.availableMinFrameDurations/scaler.availableStallDurations：需要正确配置驱动支持的分辨率和最小的帧间隔时间，若驱动中需要增加新的分辨率支持，在这里也要相应地增加配置；

<!-- source: CN V2.7 p86; unit 551 -->

![原始技术图 — CN V2.7, p86](/docs/rockchip-rk628-porting/assets/cn-p86-X521.png)

*原始技术图: CN V2.7, p86.*

以下为截图中完整可见文字的可复制转录；截图边缘被裁切的字符不猜测补全，片段不保证可独立执行。

```text
<scaler.availableStreamConfigurations value="BLOB,3840x2160,OUTPUT,
    BLOB,1920x1080,OUTPUT,
    BLOB,1280x720,OUTPUT,
    BLOB,720x576,OUTPUT,
    BLOB,720x480,OUTPUT,
    YCbCr_420_888,3840x2160,OUTPUT,
    YCbCr_420_888,1920x1080,OUTPUT,
    YCbCr_420_888,1280x720,OUTPUT,
    YCbCr_420_888,720x576,OUTPUT,
    YCbCr_420_888,720x480,OUTPUT,
    IMPLEMENTATION_DEFINED,3840x2160,OUTPUT,
    IMPLEMENTATION_DEFINED,1920x1080,OUTPUT,
    IMPLEMENTATION_DEFINED,1280x720,OUTPUT,
    IMPLEMENTATION_DEFINED,720x576,OUTPUT,
    IMPLEMENTATION_DEFINED,720x480,OUTPUT" />
<scaler.availableMinFrameDurations value="BLOB,3840x2160,33333333,
    BLOB,1920x1080,16666667,
    BLOB,1280x720,16666667,
    BLOB,720x576,20000000,
    BLOB,720x480,16666667,
    YCbCr_420_888,3840x2160,33333333,
    YCbCr_420_888,1920x1080,16666667,
    YCbCr_420_888,1280x720,16666667,
    YCbCr_420_888,720x576,20000000,
    YCbCr_420_888,720x480,16666667,
    IMPLEMENTATION_DEFINED,3840x2160,33333333,
    IMPLEMENTATION_DEFINED,1920x1080,16666667,
    IMPLEMENTATION_DEFINED,1280x720,16666667,
    IMPLEMENTATION_DEFINED,720x576,20000000,
    IMPLEMENTATION_DEFINED,720x480,16666667"/>
<scaler.availableStallDurations value="BLOB,3840x2160,33333333,
    BLOB,1920x1080,16666667,
    BLOB,1280x720,16666667,
    BLOB,720x576,20000000,
    BLOB,720x480,16666667"/>
```

<!-- source: CN V2.7 p87; unit 552 -->

sensor.orientation：图像旋转角度，支持 0、90、180、270；

<!-- source: CN V2.7 p87; unit 553 -->

![原始技术图 — CN V2.7, p87](/docs/rockchip-rk628-porting/assets/cn-p87-X524.png)

*原始技术图: CN V2.7, p87.*

以下为截图中完整可见文字的可复制转录；截图边缘被裁切的字符不猜测补全，片段不保证可独立执行。

```text
<sensor.maxAnalogSensitivity value="2400"/>
<sensor.orientation value="0"/>
<sensor.profileHueSatMapDimensions value="0,0,0"/>
```

<!-- source: CN V2.7 p87; unit 554 -->

### 6.12   HDMI IN APK 适配方法

<!-- source: CN V2.7 p87; unit 555 -->

#### 6.12.1   安卓 9/10/11 版本

<!-- source: CN V2.7 p87; unit 556 -->

安卓 9/10/11 版本，对应内核版本为 kernel-4.4/kernel-4.19，使用 for-all 代码补丁包，只能 走cameraHAL3 框架。

<!-- source: CN V2.7 p87; unit 557 -->

##### 6.12.1.1   获取和编译 APK 源码

<!-- source: CN V2.7 p87; unit 558 -->

APK 源码提供在 SDK 目录：

<!-- source: CN V2.7 p87; unit 559 -->

```text
RKDocs/common/hdmi-in/apk/rkCamera2_based_on_CameraHal3_V1.3.tar.gz
```

<!-- source: CN V2.7 p87; unit 560 -->

需要将源码拷贝并解压到目录：

<!-- source: CN V2.7 p87; unit 561 -->

```text
packages/apps/
```

<!-- source: CN V2.7 p87; unit 562 -->

以 RK3288 平台为例，在 device/rockchip/rk3288/ 目录参照如下修改，增加 rkCamera2 APK 编译：

<!-- source: CN V2.7 p87; unit 563 -->

```text
diff --git a/device.mk b/device.mk
index 6667b5c..96f08f1 100644

--- a/device.mk
+++ b/device.mk
@@ -17,7 +17,8 @@
 PRODUCT_PACKAGES += \
   memtrack.$(TARGET_BOARD_PLATFORM) \
   WallpaperPicker \
-  Launcher3
+  Launcher3 \
+  rkCamera2

 #$_rbox_$_modify_$_zhengyang: add displayd
 PRODUCT_PACKAGES += \
```

<!-- source: CN V2.7 p87; unit 564 -->

##### 6.12.1.2   APK 源码的适配

<!-- source: CN V2.7 p87; unit 565 -->

APK 通过 ioctl 的方式访问 RK628 设备节点，获取当前的连接状态和分辨率。RK628 设备节点在isp1/isp2/vicap 链路上可能会差异。需要根据实际情况修改 APK 源码，获取设备节点的方法可参考调试命令举例章节。

<!-- source: CN V2.7 p87; unit 566 -->

```text
rkCamera2/jni/native.cpp
```

<!-- source: CN V2.7 p88; unit 567 -->

![原始技术图 — CN V2.7, p88](/docs/rockchip-rk628-porting/assets/cn-p88-X533.png)

*原始技术图: CN V2.7, p88.*

以下为截图中完整可见文字的可复制转录；截图边缘被裁切的字符不猜测补全，片段不保证可独立执行。

```text
static void openDevice(JNIEnv *env, jobject thiz)
{
    (void)*env;
    (void)thiz;

    char video_name[64];
    memset(video_name, 0, sizeof(video_name));
    strcat(video_name, "/dev/v4l-subdev2");

    camFd = open(video_name, O_RDWR);
    if (camFd < 0) {
        LOGE("open %s failed,erro=%s",video_name,strerror(errno));
    } else {
        LOGD("open %s success,fd=%d",video_name,camFd);
    }
}
```

<!-- source: CN V2.7 p88; unit 568 -->

获取当前的连接状态和分辨率代码如下：

<!-- source: CN V2.7 p88; unit 569 -->

![原始技术图 — CN V2.7, p88](/docs/rockchip-rk628-porting/assets/cn-p88-X534.png)

*原始技术图: CN V2.7, p88.*

以下为截图中完整可见文字的可复制转录；截图边缘被裁切的字符不猜测补全，片段不保证可独立执行。

```text
static void getDeviceFormat(int *format)
{
    struct v4l2_control control;
    memset(&control, 0, sizeof(struct v4l2_control));
    control.id = V4L2_CID_DV_RX_POWER_PRESENT;
    int err = ioctl(camFd, VIDIOC_G_CTRL, &control);
    if (err < 0) {
        LOGV("Set POWER_PRESENT failed ,%d(%s)", errno, strerror(errno));
    }

    unsigned int noSignalAndSync = 0;
    ioctl(camFd, VIDIOC_G_INPUT, &noSignalAndSync);
    LOGV("noSignalAndSync ? %s",noSignalAndSync?"YES":"NO");

    struct v4l2_dv_timings dv_timings;
    memset(&dv_timings, 0 ,sizeof(struct v4l2_dv_timings));
    err = ioctl(camFd, VIDIOC_SUBDEV_QUERY_DV_TIMINGS, &dv_timings);
    if (err < 0) {
        LOGV("Set VIDIOC_SUBDEV_QUERY_DV_TIMINGS failed ,%d(%s)", errno, strerror(errno));
    }

    format[0] = dv_timings.bt.width;
    format[1] = dv_timings.bt.height;
    format[2] = control.value && !noSignalAndSync;
}
```

<!-- source: CN V2.7 p88; unit 570 -->

由于在 APK 访问了设备节点，所以需要确认是否关闭了 selinux，可通过 getenforce 命令查看：

<!-- source: CN V2.7 p88; unit 571 -->

![原始技术图 — CN V2.7, p88](/docs/rockchip-rk628-porting/assets/cn-p88-X535.png)

*原始技术图: CN V2.7, p88.*

以下为截图中完整可见文字的可复制转录；截图边缘被裁切的字符不猜测补全，片段不保证可独立执行。

```text
rk3288:/ # getenforce
Enforcing
rk3288:/ # setenforce 0
rk3288:/ #
rk3288:/ # getenforce
Permissive
```

<!-- source: CN V2.7 p89; unit 572 -->

##### 6.12.1.3   APK 调试前的准备

<!-- source: CN V2.7 p89; unit 573 -->

APK 调试前首先需要先将驱动调试完成，参考驱动调试方法章节。第二步需要确认 camera 设备是否正确注册到 CameraHal ，可通过以下命令查看，若未正确注册，则需要检查 camera3_profiles.xml 配置，参考camera3_profiles.xml 配置文件说明章节。

<!-- source: CN V2.7 p89; unit 574 -->

![原始技术图 — CN V2.7, p89](/docs/rockchip-rk628-porting/assets/cn-p89-X538.png)

*原始技术图: CN V2.7, p89.*

以下为截图中完整可见文字的可复制转录；截图边缘被裁切的字符不猜测补全，片段不保证可独立执行。

```text
rk3288:/ #
rk3288:/ # dumpsys media.camera

== Service global info: ==

Number of camera devices: 1
Number of normal camera devices: 1
    Device 0 maps to "0"
Active Camera Clients:
[]
Allowed user IDs: 0

== Camera service events log (most recent at top): ==
  04-08 11:08:31 : USER_SWITCH previous allowed user IDs: <None>, current allowed user IDs: 0
  01-18 08:50:15 : ADD device 0, reason: (Device status changed from 0 to 1)
  01-18 08:50:15 : ADD device 0, reason: (Device added)
```

<!-- source: CN V2.7 p89; unit 575 -->

#### 6.12.2   安卓 12+ 版本

<!-- source: CN V2.7 p89; unit 576 -->

安卓 12/13 的版本，对应内核版本为 kernel-5.10，驱动补丁使用 kernel-5.10 补丁包。应用框架分为camera 框架和 TV 框架（后 TIF 同）。具体可以参考文档《Rockchip_Android12+_HDMI_TO_MIPI_Developer_Guide》进行调试。

<!-- source: CN V2.7 p89; unit 577 -->

安卓14的版本，对应内核版本为kernel-6.1，驱动在SDK目录自带。应用框架推荐使用TV框架。

<!-- source: CN V2.7 p89; unit 578 -->

##### 6.12.2.1   APK 源码

<!-- source: CN V2.7 p89; unit 579 -->

packages/apps/TV/partner_support/samples ：提供 TV 源数据服务，通过 framework 与 HAL层、预览 APK 进行交互，由于是开机运行的隐藏服务，该 APK 在桌面上是隐藏图标的。

<!-- source: CN V2.7 p89; unit 580 -->

hardware/rockchip/tv_input ：TVHAL 层代码，开关流、热拔插和分辨率切换事件等与驱动进行命令交互。

<!-- source: CN V2.7 p89; unit 581 -->

hardware/rockchip/camera：cameraHAL 层代码，camera 框架取流、拍照等功能实现。

<!-- source: CN V2.7 p89; unit 582 -->

vendor/rockchip/hardware/interfaces/hdmi：走 camera 框架使用，负责监听分辨率变化与热拔插事件，与驱动以及 APK 交互。

<!-- source: CN V2.7 p89; unit 583 -->

packages/apps/rkCamera2 ：预览 apk，此应用有 2 个界面。默认的 MainActivity 界面使用 TIF方案进行预览，通过 framework 层与上述 TV 源数据服务进行交互；RockchipCamera2 界面使用Camera 方案进行预览，用标准的 Camera API，对 MIPI 的节点的 cameraid 进行 open 操作。APK 在桌面上图标名称为 HdmiIn ，通常客戶会二次开发替换为自己的预览 APK。

<!-- source: CN V2.7 p89; unit 584 -->

SDK 默认代码 HDMI IN 功能是关闭的，使能 HDMI IN 功能，需配置如下属性，开启后会编译含上述APK 在内的相关模块：

<!-- source: CN V2.7 p89; unit 585 -->

```text
vim device/rockchip/rk3588/BoardConfig.mk
BOARD_HDMI_IN_SUPPORT := true
```

<!-- source: CN V2.7 p89; unit 586 -->

走 camera 框架需要打开：

<!-- source: CN V2.7 p90; unit 587 -->

```text
vim device/rockchip/rk3588/BoardConfig.mk
CAMERA_SUPPORT_HDMI := true
```

<!-- source: CN V2.7 p90; unit 588 -->

只配置 CAMERA_SUPPORT_HDMI，而不配置 BOARD_HDMI_IN_SUPPORT 的情况下。如想要用rkCamera2 进行 camera 预览，需要将 rkCamera2 加入到编译并配置属性 persist.sys.hdmiinmode 值为 2。其他补充见文档：

<!-- source: CN V2.7 p90; unit 589 -->

《Rockchip_Developer_Guide_HDMI_RX_CN》

<!-- source: CN V2.7 p90; unit 590 -->

```text
PRODUCT_PACKAGES += \
   rkCamera2
```

<!-- source: CN V2.7 p90; unit 591 -->

##### 6.12.2.2   APK 预览说明

<!-- source: CN V2.7 p90; unit 592 -->

APK 支持 RK3588 HDMI RX 通路数据预览和 HDMI 转 MIPI-CSI 通路数据预览，使用时需要切换。

<!-- source: CN V2.7 p90; unit 593 -->

TIF 预览方式，需要设置 MIPI-CSI2 通路：

<!-- source: CN V2.7 p90; unit 594 -->

```text
setprop vendor.tvinput.hdmiin.type 1
```

<!-- source: CN V2.7 p90; unit 595 -->

camera 预览方式，需要打开 RockchipCamera2 界面，注意需要使能 CAMERA_SUPPORT_HDMI

<!-- source: CN V2.7 p90; unit 596 -->

```text
setprop persist.sys.hdmiinmode 2
```

<!-- source: CN V2.7 p90; unit 597 -->

##### 6.12.2.3   TIF 预览与 camera 预览差异

<!-- source: CN V2.7 p90; unit 598 -->

|  | TIF | Camera |
| --- | --- | --- |
| 优点 | 延迟低 | app 端能够拿到预览数据进行后处理 |
| 缺点 | 不支持屏幕旋转、分屏、画中画功能；<br>app 端拿不到预览 buffer 数据；<br>不支持 screencap 方式的截图命令 | 延迟高于 TIF |

<!-- source: CN V2.7 p90; unit 599 -->

### 6.13   常驱动调试方法

<!-- source: CN V2.7 p90; unit 600 -->

驱动调试方法与 SOC Sensor 的调试方法一致，更多信息请参考 redmine 文档：

<!-- source: CN V2.7 p90; unit 601 -->

https://redmine.rock-chips.com/documents/53

<!-- source: CN V2.7 p90; unit 602 -->

#### 6.13.1   调试工具获取

<!-- source: CN V2.7 p90; unit 603 -->

需要使用 media-ctl 和 v4l2-ctl 工具，目前 SDK 编译固件时会自动拷贝集成，具体是放置在 SDK 目录：

<!-- source: CN V2.7 p90; unit 604 -->

```text
hardware/rockchip/camera/etc/tools/
```

<!-- source: CN V2.7 p90; unit 605 -->

若 SDK 版本较老，可通过 redmine 获取：

<!-- source: CN V2.7 p91; unit 606 -->

https://redmine.rock-chips.com/documents/104

<!-- source: CN V2.7 p91; unit 607 -->

将 media-ctl 和 v4l2-ctl 用 adb push 到设备的 /vendor/bin/ 目录。

<!-- source: CN V2.7 p91; unit 608 -->

#### 6.13.2   调试命令举例

<!-- source: CN V2.7 p91; unit 609 -->

以 RK3288 + RK628 接收 1920x1080P 分辨率为例，具体调试时需要根据实际情况修改。请注意，以下调试命令需要从前往后逐条输入，否则有可能出现缺少配置导致无法工作的问题。

<!-- source: CN V2.7 p91; unit 610 -->

查看链路拓扑结构：

<!-- source: CN V2.7 p91; unit 611 -->

执行命令查看 media 节点的拓扑结构，根据不同芯片平台具体的链路连接，有可能是 /dev/media0 或/dev/media1。

<!-- source: CN V2.7 p91; unit 612 -->

```text
media-ctl -d /dev/media0 –p
```

<!-- source: CN V2.7 p91; unit 613 -->

截取 RK628 部分为例，可知 RK628 设备为：/dev/v4l-subdev2，识别到 HDMI IN 分辨率为：1920x1080。

<!-- source: CN V2.7 p91; unit 614 -->

```text
...
- entity 8: m00_b_rk628-csi rk628-csi (1 pad, 1 link)
         type V4L2 subdev subtype Sensor

         device node name /dev/v4l-subdev2
      pad0: Source
           [fmt:UYVY2X8/1920x1080]
           -> "rockchip-mipi-dphy-rx":0 [ENABLED]
...
```

<!-- source: CN V2.7 p91; unit 615 -->

配置链路连接：

<!-- source: CN V2.7 p91; unit 616 -->

设备复位启动后，链路默认是连接上的。用 HDMI IN APK 打开再退出时，链路会被断开，查看拓扑结构，没有 [ENABLED] 时才需要重新链接。

<!-- source: CN V2.7 p91; unit 617 -->

```text
media-ctl -d /dev/media0 -l \
'"m00_b_rk628-csi rk628-csi":0->"rockchip-mipi-dphy-rx":0 [1]'

media-ctl -d /dev/media0 -l \
'"rockchip-mipi-dphy-rx":1->"rkisp1-isp-subdev":0 [1]'
media-ctl -d /dev/media0 -l '"rkisp1-input-params":0->"rkisp1-isp-subdev":1 [1]'
media-ctl -d /dev/media0 -l '"rkisp1-isp-subdev":2->"rkisp1_mainpath":0 [1]'
media-ctl -d /dev/media0 -l '"rkisp1-isp-subdev":2->"rkisp1_selfpath":0 [1]'
media-ctl -d /dev/media0 -l '"rkisp1-isp-subdev":3->"rkisp1-statistics":0 [1]'
```

<!-- source: CN V2.7 p91; unit 618 -->

配置分辨率：

<!-- source: CN V2.7 p91; unit 619 -->

```text
media-ctl -d /dev/media0 \
--set-v4l2 '"rkisp1-isp-subdev":0[fmt:UYVY2X8/1920x1080]'
media-ctl -d /dev/media0 \

--set-v4l2 '"rkisp1-isp-subdev":0[crop:(0,0)/1920x1080]'
media-ctl -d /dev/media0 \
--set-v4l2 '"rkisp1-isp-subdev":2[fmt:UYVY2X8/1920x1080]'
media-ctl -d /dev/media0 \
--set-v4l2 '"rkisp1-isp-subdev":2[crop:(0,0)/1920x1080]'
```

<!-- source: CN V2.7 p92; unit 620 -->

获取图像数据流：

<!-- source: CN V2.7 p92; unit 621 -->

查看配置结果：

<!-- source: CN V2.7 p92; unit 622 -->

```text
media-ctl -d /dev/media0 –p
```

<!-- source: CN V2.7 p92; unit 623 -->

获取图像数据流：

<!-- source: CN V2.7 p92; unit 624 -->

```text
v4l2-ctl --verbose -d /dev/video0 --set-fmt-
video=width=1920,height=1080,pixelformat='NV12' --stream-mmap=4
```

<!-- source: CN V2.7 p92; unit 625 -->

抓取图像 yuv 文件，可 adb pull 上来用 7yuv 等工具查看：

<!-- source: CN V2.7 p92; unit 626 -->

```text
v4l2-ctl -d /dev/video0 --set-fmt-video=width=1920,height=1080,pixelformat='NV12'
--stream-mmap=3 --stream-skip=4 --stream-to=/data/1920x1080p60_nv12.yuv --stream-
count=5 --stream-poll
```

<!-- source: CN V2.7 p92; unit 627 -->

若一切正常，能接收到图像数据，会打出帧率，参考 log 如下：

<!-- source: CN V2.7 p92; unit 628 -->

```text
VIDIOC_QUERYCAP: ok
VIDIOC_G_FMT: ok
VIDIOC_S_FMT: ok

Format Video Capture Multiplanar:
      Width/Height : 1920/1080
      Pixel Format : 'NV12'
      Field        : None
      Number of planes : 1
      Flags        :
      Colorspace   : Default
      Transfer Function : Default
      YCbCr Encoding : Default
      Quantization : Full Range
      Plane 0      :
        Bytes per Line : 1920
        Size Image : 3110400

VIDIOC_G_SELECTION: ok
VIDIOC_S_SELECTION: ok
VIDIOC_REQBUFS: ok
VIDIOC_QUERYBUF: ok
VIDIOC_QUERYBUF: ok
VIDIOC_QBUF: ok
VIDIOC_QUERYBUF: ok
VIDIOC_QBUF: ok
VIDIOC_QUERYBUF: ok
VIDIOC_QBUF: ok
VIDIOC_QUERYBUF: ok
VIDIOC_QBUF: ok

VIDIOC_STREAMON: ok
idx: 0 seq: 0 bytesused: 3110400 ts: 131.560377
idx: 1 seq: 1 bytesused: 3110400 ts: 131.577023 delta: 16.646 ms
idx: 2 seq: 2 bytesused: 3110400 ts: 131.593697 delta: 16.674 ms
idx: 3 seq: 3 bytesused: 3110400 ts: 131.610363 delta: 16.666 ms
idx: 0 seq: 4 bytesused: 3110400 ts: 131.627033 delta: 16.670 ms fps: 60.01
idx: 1 seq: 5 bytesused: 3110400 ts: 131.643721 delta: 16.688 ms fps: 59.99
idx: 2 seq: 6 bytesused: 3110400 ts: 131.660390 delta: 16.669 ms fps: 59.99
idx: 3 seq: 7 bytesused: 3110400 ts: 131.677058 delta: 16.668 ms fps: 59.99
```

<!-- source: CN V2.7 p93; unit 629 -->

<!-- source: CN V2.7 p93; unit 630 -->

#### 6.13.3   打开 log 开关

<!-- source: CN V2.7 p93; unit 631 -->

可通过如下命令打开 RK628 的 log 开关，然后通过 demsg 命令获取 kernel log：

<!-- source: CN V2.7 p93; unit 632 -->

```text
echo 1 > /sys/kernel/debug/rk628/x-0050/debug //x为挂载的i2c总线，50为对应的i2c地址
echo 2 > /sys/module/rk628_csi/parameters/debug
echo 2 > /sys/module/rk628_csi_v4l2/parameters/debug //内核为linux4.4或者4.19

dmesg -n 8
```

<!-- source: CN V2.7 p93; unit 633 -->

若要抓取上电开机过程的 log，建议直接修改代码并重新编译烧写 kernel 相关部分：

<!-- source: CN V2.7 p93; unit 634 -->

```text
diff --git a/drivers/media/i2c/rk628_csi.c b/drivers/media/i2c/rk628_csi.c
index c763a9558169..bd7f3effb45a 100644
--- a/drivers/media/i2c/rk628_csi_v4l2.c

+++ b/drivers/media/i2c/rk628_csi_v4l2.c
@@ -34,7 +34,7 @@
 #include <video/videomode.h>
 #include "rk628_csi.h"

-static int debug;
+static int debug = 1;
 module_param(debug, int, 0644);
 MODULE_PARM_DESC(debug, "debug level (0-3)");

diff --git a/include/media/v4l2-common.h b/include/media/v4l2-common.h
index 1cc0c5ba16b3..e74f3a85f0b8 100644
--- a/include/media/v4l2-common.h

+++ b/include/media/v4l2-common.h
@@ -75,7 +75,7 @@
 #define v4l2_dbg(level, debug, dev, fmt, arg...)   \
      do {                                          \
           if (debug >= (level))                    \
-                v4l2_printk(KERN_DEBUG, dev, fmt , ## arg); \
+                v4l2_printk(KERN_INFO, dev, fmt , ## arg); \
      } while (0)
```

<!-- source: CN V2.7 p93; unit 635 -->

#### 6.13.4   寄存器读写

<!-- source: CN V2.7 p93; unit 636 -->

RK628 寄存器调试节点如下，当前示例 RK628 接在 I2C3，地址为 0x50：

<!-- source: CN V2.7 p93; unit 637 -->

```text
console:/ # ls /sys/kernel/debug/rk628/3-0050/registers/
adapter combtxphy csi dsi0 gpio0 gpio2 grf hdmirxphy

combrxphy cru   csi1 dsi1 gpio1 gpio3 hdmirx
```

<!-- source: CN V2.7 p93; unit 638 -->

寄存器节点可支持读写。

<!-- source: CN V2.7 p93; unit 639 -->

读寄存器：

<!-- source: CN V2.7 p94; unit 640 -->

```text
console:/ # cat /sys/kernel/debug/rk628/3-0050/registers/cru
rk628_cru:


0xc0000: 00001031 00000441 00800000 00000007
0xc0010: 00007f00
0xc0020: 00001028 00000441 00f5c28f 00000007
0xc0030: 00007f00
0xc0040: 00005019 00000541 0099735e 00000007
0xc0050: 00007f00
0xc0060: 00000015
0xc0080: 00008989 00000003 00000007 00004b80
0xc0090: 03355460 000080d7 00008004 0000003b
0xc00a0: 00002c00 00000000 00000000 00000000
0xc00b0: 00285f58 00010008 00010008 00000103
0xc00c0: 00000300 00000703 0000000b 00000008

0xc00d0: 0001000a 00000b07
0xc0180: 00000000 00000000 00000000 00000000
0xc0190: 00000000 00000000
0xc0200: 00000000 00000000 00000000 00000000
0xc0210: 00000000
```

<!-- source: CN V2.7 p94; unit 641 -->

写寄存器：

<!-- source: CN V2.7 p94; unit 642 -->

```text
rk3288:/ # echo 0x000 0xffffffff > /sys/kernel/debug/rk628/3-0050/registers/grf
```

<!-- source: CN V2.7 p94; unit 643 -->

#### 6.13.5   读取HDMI-RX状态信息

<!-- source: CN V2.7 p94; unit 644 -->

可通过如下指令读取HDMI-RX的信息，包括分辨率信息、锁定状态、拔插状态、颜色格式等等：

<!-- source: CN V2.7 p94; unit 645 -->

```text
console:/ # cat /sys/kernel/debug/rk628/3-0050/hdmirx/status
status: plugin

Clk-Ch:Lock Ch0:Lock   Ch1:Lock    Ch2:Lock
Color Format: RGB
Timing: 1920x1080p60 (2200x1125)   hfp:88 hs:45 hbp:147 vfp:4
vs:5 vbp:36
Pixel Clk: 148500000
Mode: HDMI
Color Depth: 8 bit
Color Range: Limited
Color Space: RGB
```

<!-- source: CN V2.7 p94; unit 646 -->

#### 6.13.6   设置pattern输出

<!-- source: CN V2.7 p94; unit 647 -->

RK628支持设置scaler color bar输出，具体使用命令如下：

<!-- source: CN V2.7 p94; unit 648 -->

```text
echo 1 > /sys/kernel/debug/rk628/3-0050/scaler_color_bar

//pattern 模式选择

echo 2 > /sys/kernel/debug/rk628/3-0050/scaler_color_bar
```

<!-- source: CN V2.7 p95; unit 649 -->

### 6.14   音频模块介绍

<!-- source: CN V2.7 p95; unit 650 -->

音频部分会根据使用 HDMIRX 或者 HDMITX 的使用场景，可以分别设置为输出与输入。在 HDMIRX 使用场景中，RK628 HDMI 接收的音频数据被解包出来后通过 I2S 接口输出；而 HDMITX 使用场景中，RK628D I2S 是作为数据输入端，接收音频数据，打包后通过 HDMITX 输出。下面是两种场景的配置方式：

<!-- source: CN V2.7 p95; unit 651 -->

#### 6.14.1   HDMIRX

<!-- source: CN V2.7 p95; unit 652 -->

HDMIRX 一般是在驱动加载的时候，就会去初始化音频模块，不再需要额外的配置了。HDMITX 播放音频数据时候，音频信号会通过 RK628 I2S 输出（RK628 必须是 master）。RK628 I2S 可以直接与支持I2S 接口的 DAC、SOC 连接。I2S 格式如下：

<!-- source: CN V2.7 p95; unit 653 -->

![原始技术图 — CN V2.7, p95](/docs/rockchip-rk628-porting/assets/cn-p95-X566.png)

*原始技术图: CN V2.7, p95.*

<!-- source: CN V2.7 p95; unit 654 -->

与 SOC 连接时候，RK628 I2S 不需要额外的配置，可以使用 dummy_codec 创建一个声卡设备，供系统使用：

<!-- source: CN V2.7 p95; unit 655 -->

```text
rk628_dc: rk628-dc {
      compatible = "rockchip,dummy-codec";
      #sound-dai-cells = <0>;

};

hdmiin-sound {
      compatible = "simple-audio-card";
      simple-audio-card,format = "i2s";
      simple-audio-card,name = "rockchip,hdmiin";
      simple-audio-card,bitclock-master = <&dailink0_master>;
      simple-audio-card,frame-master = <&dailink0_master>;
      status = "okay";
      simple-audio-card,cpu {
                 sound-dai = <&i2s0>;
      };

      dailink0_master: simple-audio-card,codec {
                 sound-dai = <&rk628_dc>;
      };
};
```

<!-- source: CN V2.7 p95; unit 656 -->

与 DAC 连接的时候，软件上面不要上面的配置了，DAC 直接就是能输出模拟信号。但是目前大部分的DAC 都是需要有提供一个 MCLK，RK628 设计的时候，没有预留 MCLK，目前使用一个兼容的方法，使用 RK628 GPIO1_A0 (H7)作为 TEST_CLKO，可以输出 128FS 的时钟。兼容目前大部分的 DAC，有验证过的包括：CS4344、ES7144。使能 GPIO1_A0 输出 MCLK 需要在初始化的时候，调用以下接口，修改如下（请注意自己项目用的是哪个驱动）：

<!-- source: CN V2.7 p95; unit 657 -->

```text
--- a/drivers/media/i2c/rk628/rk628_hdmirx.h
+++ b/drivers/media/i2c/rk628/rk628_hdmirx.h
@@ -392,5 +392,5 @@ bool rk628_audio_ctsnints_enabled(HAUDINFO info);
 void rk628_csi_isr_ctsn(HAUDINFO info, u32 pdec_ints);

 void rk628_csi_isr_fifoints(HAUDINFO info, u32 fifo_ints);
 int rk628_is_avi_ready(struct rk628 *rk628, bool avi_rcv_rdy);
+void rk628_hdmirx_audio_set_mclk_output(HAUDINFO info);

--- a/drivers/media/i2c/rk628/rk628_csi.c
+++ b/drivers/media/i2c/rk628/rk628_csi.c
@@ -957,6 +957,9 @@ static void rk628_csi_initial_setup(struct rk628_csi *csi)
 {
      struct v4l2_subdev_edid def_edid;

+     //enable rk628 mclk
+     rk628_hdmirx_audio_set_mclk_output(csi->audio_info);


--- a/drivers/media/i2c/rk628/rk628_csi_v4l2.c
+++ b/drivers/media/i2c/rk628/rk628_csi_v4l2.c
@@ -1096,6 +1096,9 @@ static void rk628_csi_initial_setup(struct v4l2_subdev *sd)
      struct rk628_csi *csi = to_csi(sd);
      struct v4l2_subdev_edid def_edid;

+     //enable rk628 mclk
+     rk628_hdmirx_audio_set_mclk_output(csi->audio_info);
```

<!-- source: CN V2.7 p96; unit 658 -->

<!-- source: CN V2.7 p96; unit 659 -->

对于 RK3288 EVB，使用的是 RK3288 I2S 与 RT5651 的 I2S2 ，RK628 I2S 与 RT5651 的 I2S2 连接。在使用过程中，通过切换 RT5651 内部的 route，达到切换不同通路录音，播放的功能，对应 dts 配置如下：

<!-- source: CN V2.7 p96; unit 660 -->

```text
hdmiin-sound {
      compatible = "rockchip,rockchip-rt5651-rk628-sound";
      rockchip,cpu = <&i2s>;

      rockchip,codec = <&rt5651>;
      status = "okay";
};
```

<!-- source: CN V2.7 p96; unit 661 -->

在默认情况下，i2s 只有在预览的时候，才会有输出，如果需要一直输出，DTS 需要添加 i2s-enable-default 配置

<!-- source: CN V2.7 p96; unit 662 -->

```text
&i2c4 {
      clock-frequency = <400000>;
      status = "okay";

      rk628_csi_v4l2: rk628_csi_v4l2@50 {
           reg = <0x50>;
           compatible = "rockchip,rk628-csi-v4l2";
           ....
           i2s-enable-default;
           ....
      };
};
```

<!-- source: CN V2.7 p97; unit 663 -->

#### 6.14.2   HDMITX

<!-- source: CN V2.7 p97; unit 664 -->

HDMITX 配置比较简单, 只需要配置好 HDMI 声卡就好了。如下，RK628 I2S 与 SOC 的 I2S0 连接：

<!-- source: CN V2.7 p97; unit 665 -->

```text
hdmi_sound: hdmi-sound {
      compatible = "simple-audio-card";
      simple-audio-card,format = "i2s";

      simple-audio-card,name = "hdmi-sound";
      status = "okay";
      simple-audio-card,cpu {
           sound-dai = <&i2s0>;
      };
      simple-audio-card,codec {
           sound-dai = <&rk628_hdmi>;
      };
};
```

<!-- source: CN V2.7 p97; unit 666 -->

#### 6.14.3   音频常见问题处理

<!-- source: CN V2.7 p97; unit 667 -->

##### 6.14.3.1   I2S 没有输出

<!-- source: CN V2.7 p97; unit 668 -->

```text
echo 0x000 0x6000220 > /sys/kernel/debug/regmap/0-0050-grf/registers //i2s 的
IOMUX

echo 0x70 0xfffff55c > /sys/kernel/debug/regmap/0-0050-grf/registers
echo 0x70 0x155c155c > /sys/kernel/debug/regmap/0-0050-grf/registers // 设置输出
```

<!-- source: CN V2.7 p97; unit 669 -->

##### 6.14.3.2   使能打印 v4l2_dbg

<!-- source: CN V2.7 p97; unit 670 -->

```text
diff --git a/drivers/media/i2c/rk628_csi.c b/drivers/media/i2c/rk628_csi.c
index 5e8e3710a82f..638ac2acc472 100644

--- a/drivers/media/i2c/rk628_csi.c
+++ b/drivers/media/i2c/rk628_csi.c
@@ -34,7 +34,7 @@
 #include <video/videomode.h>
 #include "rk628_csi.h"

-static int debug;
+static int debug = 3;
 module_param(debug, int, 0644);
 MODULE_PARM_DESC(debug, "debug level (0-3)");

diff --git a/include/media/v4l2-common.h b/include/media/v4l2-common.h
index cdc87ec61e54..f159118d4a6b 100644

--- a/include/media/v4l2-common.h
+++ b/include/media/v4l2-common.h
@@ -82,7 +82,7 @@
 #define v4l2_dbg(level, debug, dev, fmt, arg...)   \
      do {                                          \
           if (debug >= (level))                    \
-                v4l2_printk(KERN_DEBUG, dev, fmt , ## arg); \
+                v4l2_printk(KERN_INFO, dev, fmt , ## arg); \
      } while (0)


 /**
```

<!-- source: CN V2.7 p98; unit 671 -->

<!-- source: CN V2.7 p98; unit 672 -->

##### 6.14.3.3   关于应用录音数据杂音问题

<!-- source: CN V2.7 p98; unit 673 -->

这个可能是 HDMTX 采样率与 HAL 录音采样率不一致导致的

<!-- source: CN V2.7 p98; unit 674 -->

1\. 查看 HDMITX 采样率

<!-- source: CN V2.7 p98; unit 675 -->

打开内核 log: echo 3 > /sys/module/rk628_csi/parameters/debug

<!-- source: CN V2.7 p98; unit 676 -->

2\. 打开之后，从下面 log 看出 TX 的采样率

<!-- source: CN V2.7 p98; unit 677 -->

```text
m00_b_rk628-csi rk628-csi: rk628_hdmirx_audio_fs: clkrate:1500 tmdsclk:74250000,
n_decoded:6144, cts_decoded:74250, fs_audio:48000

m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_FILLSTS1:0xfe, single offset:0, total offset:-2
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_ISTS:0x4
m00_b_rk628-csi rk628-csi: rk628_hdmirx_audio_fs: clkrate:1500 tmdsclk:74250000,
n_decoded:6144, cts_decoded:74250, fs_audio:48000
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_FILLSTS1:0xfc, single offset:-2, total offset:-4
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_ISTS:0x4
m00_b_rk628-csi rk628-csi: rk628_hdmirx_audio_fs: clkrate:1500 tmdsclk:74250000,
n_decoded:6144, cts_decoded:74250, fs_audio:48000
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:

HDMI_RX_AUD_FIFO_FILLSTS1:0xfc, single offset:0, total offset:-4
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_ISTS:0x4
m00_b_rk628-csi rk628-csi: rk628_hdmirx_audio_fs: clkrate:1500 tmdsclk:74250000,
n_decoded:6144, cts_decoded:74250, fs_audio:48000
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_FILLSTS1:0xfc, single offset:0, total offset:-4
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_ISTS:0x4
m00_b_rk628-csi rk628-csi: rk628_hdmirx_audio_fs: clkrate:1500 tmdsclk:74250000,
n_decoded:6144, cts_decoded:74250, fs_audio:48000
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:

HDMI_RX_AUD_FIFO_FILLSTS1:0xfa, single offset:-2, total offset:-6
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_ISTS:0x4
m00_b_rk628-csi rk628-csi: rk628_hdmirx_audio_fs: clkrate:1500 tmdsclk:74250000,
n_decoded:6144, cts_decoded:74250, fs_audio:48000
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_FILLSTS1:0xfc, single offset:2, total offset:-4
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_ISTS:0x4
m00_b_rk628-csi rk628-csi: rk628_hdmirx_audio_fs: clkrate:1500 tmdsclk:74250000,
n_decoded:6144, cts_decoded:74250, fs_audio:48000
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_FILLSTS1:0xfa, single offset:-2, total offset:-6
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:

HDMI_RX_AUD_FIFO_ISTS:0x4
```

<!-- source: CN V2.7 p99; unit 678 -->

<!-- source: CN V2.7 p99; unit 679 -->

3\. HAL 录音的采样率：

<!-- source: CN V2.7 p99; unit 680 -->

```text
getprop vendor.hdmiin.audiorate
```

<!-- source: CN V2.7 p99; unit 681 -->

##### 6.14.3.4   直接设置 IOMUX

<!-- source: CN V2.7 p99; unit 682 -->

```text
 static void rk628_hdmirx_initial_setup(struct rk628_hdmirx *hdmirx)
 {
      struct v4l2_subdev_edid def_edid;

@@ -783,6 +937,8 @@ static void rk628_hdmirx_initial_setup(struct rk628_hdmirx
*hdmirx)

      // ddc and hpd pinctrl
      regmap_write(hdmirx->grf, GRF_GPIO1AB_SEL_CON, 0x07000700);
+     //i2s pinctrl
+     regmap_write(hdmirx->grf, GRF_GPIO0AB_SEL_CON, 0x155c155c);

      rk628_hdmirx_controller_reset(hdmirx);
```

<!-- source: CN V2.7 p99; unit 683 -->

##### 6.14.3.5   关于 tmdsclk 计算错误

<!-- source: CN V2.7 p99; unit 684 -->

1 bitmask 与时钟对齐

<!-- source: CN V2.7 p99; unit 685 -->

```text
git sholsh@rk-intel-1:~/rk-sdk/android11-rk3399/kernel$ git show
007131063748ea69facbf4bbe7aaee71c34fd921

commit 007131063748ea69facbf4bbe7aaee71c34fd921
Author: Shunhua Lan <lsh@rock-chips.com>
Date: Fri Apr 23 18:43:59 2021 +0800

   media: i2c: rk628csi: fix mask for clkrate and fs audio align to 100

   Signed-off-by: Shunhua Lan <lsh@rock-chips.com>
   Change-Id: I15b290319463f1b41e6908e54caa99ef9c6db4f4

diff --git a/drivers/media/i2c/rk628_csi.c b/drivers/media/i2c/rk628_csi.c
index 89c4a926a985..a970bc621e0e 100644
--- a/drivers/media/i2c/rk628_csi.c
+++ b/drivers/media/i2c/rk628_csi.c

@@ -1064,7 +1064,7 @@ static void rk628_csi_delayed_work_audio(struct work_struct
*work)

      /* fout=128*fs=ftmds*N/CTS */
      regmap_read(csi->hdmirx_regmap, HDMI_RX_HDMI_CKM_RESULT, &clkrate);
-     clkrate = clkrate & 0xfff;
+     clkrate = clkrate & 0xffff;
      /* tmdsclk = (clkrate/1000) * 49500000 */
      tmdsclk = clkrate * (49500000 / 1000);
      regmap_read(csi->hdmirx_regmap, HDMI_RX_PDEC_ACR_CTS, &cts_decoded);
@@ -1073,6 +1073,8 @@ static void rk628_csi_delayed_work_audio(struct work_struct

*work)
      if (cts_decoded != 0) {
           fs_audio = div_u64((tmdsclk * n_decoded), cts_decoded);
           fs_audio = div_u64(fs_audio, 128);
+          fs_audio = div_u64(fs_audio + 50, 100);
+          fs_audio *= 100;
      }
      v4l2_dbg(2, debug, sd,
           "%s: clkrate:%d tmdsclk:%llu, n_decoded:%d, cts_decoded:%d,
fs_audio:%llu\n",
```

<!-- source: CN V2.7 p100; unit 686 -->

<!-- source: CN V2.7 p100; unit 687 -->

问题 log 如下：

<!-- source: CN V2.7 p100; unit 688 -->

```text
[67.440094] m00_b_rk628-csi rk628-csi:rk628_csi_delayed_work_audio:clkrate:1904
tmdsclk:94248000,n_decoded:6144,cts_decoded:297000,fs_audio:15232
```

<!-- source: CN V2.7 p100; unit 689 -->

4K 屏，计算的 tmdsclk 频率应该是 297M

<!-- source: CN V2.7 p100; unit 690 -->

tmdsclk = clkrate * (49500000 / 1000);

<!-- source: CN V2.7 p100; unit 691 -->

1904 ---> 0x770

<!-- source: CN V2.7 p100; unit 692 -->

6000 ---> 0x1770

<!-- source: CN V2.7 p100; unit 693 -->

tmdsclk  6*49500000  = 297000000

<!-- source: CN V2.7 p100; unit 694 -->

##### 6.14.3.6   设置 GPIO 输出 test clk

<!-- source: CN V2.7 p100; unit 695 -->

快捷设置

<!-- source: CN V2.7 p100; unit 696 -->

```text
grf: gpio0 相关 iomux 切换，配置为 IO 口:
echo 0x70 0x0fff0000 > registers


gpio0 配置为输出口, 1-0051-rk628-pinctrl:
echo 0xd0008 0x00EC00EC > registers

grf，选择在哪一级拉出信号:
HDMI_RX:
echo 0x300 0x11 > registers
ASYNC_IN:
echo 0x300 0x14 > registers
ASYNC_OUT:
echo 0x300 0x15 > registers
SCALER：
echo 0x300 0x16 > registers
```

<!-- source: CN V2.7 p101; unit 697 -->

##### 6.14.3.7   rk356x 的 IOMUX 特殊处理

<!-- source: CN V2.7 p101; unit 698 -->

对于 RK356X 因为每路 I2S 可以复用多组 pin，需要额外在配置 GRF 寄存器 GRF_IOFUNC_SEL4：

<!-- source: CN V2.7 p101; unit 699 -->

| Bit | Attr | Reset Value | Description |
| --- | --- | --- | --- |
| 14 | RW | 0x0 | i2s3_iomux_sel I2S3 IO mux selection<br>1'b0:M0 mux solution<br>1'b1:M1 mux solution |
| 12 | RW | 0x0 | i2s2_iomux_sel I2S2 IO mux selection<br>1'b0:M0 mux solution<br>1'b1:M1 mux solution |
| 11:10 | RW | 0x0 | i2s1_iomux_sel I2S1 IO mux selection<br>2'b00:M0 mux solution<br>2'b01:M1 mux solution<br>2'b10:M2 mux solution<br>2'b11: Reserved |

<!-- source: CN V2.7 p101; unit 700 -->

pinctrl 驱动里面，会根据用戶选择的 mclk 来配置 GRF 对应的 bit，代码如下：

<!-- source: CN V2.7 p101; unit 701 -->

```text
static struct rockchip_mux_route_data rk3568_mux_route_data[] = {
   ....
   RK_MUXROUTE_GRF(1, RK_PA2, 1, 0x0310, WRITE_MASK_VAL(11, 10, 0)), /* I2S1 IO

mux M0 */
   RK_MUXROUTE_GRF(3, RK_PC6, 4, 0x0310, WRITE_MASK_VAL(11, 10, 1)), /* I2S1 IO
mux M1 */
   RK_MUXROUTE_GRF(2, RK_PD0, 5, 0x0310, WRITE_MASK_VAL(11, 10, 2)), /* I2S1 IO
mux M2 */
   RK_MUXROUTE_GRF(2, RK_PC1, 1, 0x0310, WRITE_MASK_VAL(12, 12, 0)), /* I2S2 IO
mux M0 */
   RK_MUXROUTE_GRF(4, RK_PB6, 5, 0x0310, WRITE_MASK_VAL(12, 12, 1)), /* I2S2 IO
mux M1 */
   RK_MUXROUTE_GRF(3, RK_PA4, 4, 0x0310, WRITE_MASK_VAL(14, 14, 0)), /* I2S3 IO
mux M0 */
   RK_MUXROUTE_GRF(4, RK_PC4, 5, 0x0310, WRITE_MASK_VAL(14, 14, 1)), /* I2S3 IO
mux M1 */

   ....
}
```

<!-- source: CN V2.7 p101; unit 702 -->

对于类似 rk628 这类不需要 mclk 应用，因为没有配置 mclk，所以边不会设置对应的 bit，这里需要手动添加下，一般 i2s 都会使用 sclk 的，这里把 sclk 加上去（后续新的 RK356X SDK 会增加此补丁）：

<!-- source: CN V2.7 p101; unit 703 -->

```text
diff --git a/drivers/pinctrl/pinctrl-rockchip.c b/drivers/pinctrl/pinctrl-
rockchip.c

index 871c49ef0c2a..3d10e6c2ed27 100644
--- a/drivers/pinctrl/pinctrl-rockchip.c
+++ b/drivers/pinctrl/pinctrl-rockchip.c
@@ -1046,13 +1046,26 @@ static struct rockchip_mux_route_data
rk3568_mux_route_data[] = {
      RK_MUXROUTE_GRF(2, RK_PB0, 3, 0x0310, WRITE_MASK_VAL(9, 8, 0)), /* UART9
IO mux M0 */
      RK_MUXROUTE_GRF(4, RK_PC5, 4, 0x0310, WRITE_MASK_VAL(9, 8, 1)), /* UART9
IO mux M1 */
      RK_MUXROUTE_GRF(4, RK_PA4, 4, 0x0310, WRITE_MASK_VAL(9, 8, 2)), /* UART9

IO mux M2 */
+
      RK_MUXROUTE_GRF(1, RK_PA2, 1, 0x0310, WRITE_MASK_VAL(11, 10, 0)), /* I2S1
IO mux M0 */
      RK_MUXROUTE_GRF(3, RK_PC6, 4, 0x0310, WRITE_MASK_VAL(11, 10, 1)), /* I2S1
IO mux M1 */
      RK_MUXROUTE_GRF(2, RK_PD0, 5, 0x0310, WRITE_MASK_VAL(11, 10, 2)), /* I2S1
IO mux M2 */
+     RK_MUXROUTE_GRF(1, RK_PA3, 1, 0x0310, WRITE_MASK_VAL(11, 10, 0)), /* I2S1
IO mux sclk tx M0 */
+     RK_MUXROUTE_GRF(1, RK_PA4, 1, 0x0310, WRITE_MASK_VAL(11, 10, 0)), /* I2S1
IO mux sclk rx M0 */

+     RK_MUXROUTE_GRF(3, RK_PC7, 4, 0x0310, WRITE_MASK_VAL(11, 10, 1)), /* I2S1
IO mux sclk tx M1 */
+     RK_MUXROUTE_GRF(4, RK_PA6, 5, 0x0310, WRITE_MASK_VAL(11, 10, 1)), /* I2S1
IO mux sclk rx M1 */
+     RK_MUXROUTE_GRF(2, RK_PD1, 5, 0x0310, WRITE_MASK_VAL(11, 10, 2)), /* I2S1
IO mux sclk tx M2 */
+     RK_MUXROUTE_GRF(3, RK_PC3, 5, 0x0310, WRITE_MASK_VAL(11, 10, 2)), /* I2S1
IO mux sclk rx M2 */
      RK_MUXROUTE_GRF(2, RK_PC1, 1, 0x0310, WRITE_MASK_VAL(12, 12, 0)), /* I2S2
IO mux M0 */
      RK_MUXROUTE_GRF(4, RK_PB6, 5, 0x0310, WRITE_MASK_VAL(12, 12, 1)), /* I2S2
IO mux M1 */
+     RK_MUXROUTE_GRF(2, RK_PC2, 1, 0x0310, WRITE_MASK_VAL(12, 12, 0)), /* I2S2

IO mux sclk tx M0 */
+     RK_MUXROUTE_GRF(2, RK_PB7, 1, 0x0310, WRITE_MASK_VAL(12, 12, 0)), /* I2S2
IO mux sclk rx M0 */
+     RK_MUXROUTE_GRF(4, RK_PB7, 4, 0x0310, WRITE_MASK_VAL(12, 12, 1)), /* I2S1
IO mux sclk tx M1 */
+     RK_MUXROUTE_GRF(4, RK_PC1, 5, 0x0310, WRITE_MASK_VAL(12, 12, 1)), /* I2S1
IO mux sclk rx M1 */
      RK_MUXROUTE_GRF(3, RK_PA2, 4, 0x0310, WRITE_MASK_VAL(14, 14, 0)), /* I2S3
IO mux M0 */
      RK_MUXROUTE_GRF(4, RK_PC2, 5, 0x0310, WRITE_MASK_VAL(14, 14, 1)), /* I2S3
IO mux M1 */
+     RK_MUXROUTE_GRF(3, RK_PA3, 4, 0x0310, WRITE_MASK_VAL(14, 14, 0)), /* I2S3

IO mux sclk M0 */
+     RK_MUXROUTE_GRF(4, RK_PC3, 5, 0x0310, WRITE_MASK_VAL(14, 14, 1)), /* I2S3
IO mux sclk M1 */
      RK_MUXROUTE_GRF(1, RK_PA4, 3, 0x0314, WRITE_MASK_VAL(1, 0, 0)), /* PDM IO
mux M0 */
      RK_MUXROUTE_GRF(1, RK_PA6, 3, 0x0314, WRITE_MASK_VAL(1, 0, 0)), /* PDM IO
mux M0 */
      RK_MUXROUTE_GRF(3, RK_PD6, 5, 0x0314, WRITE_MASK_VAL(1, 0, 1)), /* PDM IO
mux M1 */
```

<!-- source: CN V2.7 p102; unit 704 -->

<!-- source: CN V2.7 p103; unit 705 -->

##### 6.14.3.8   RK3399 的 LRCK 的特殊处理

<!-- source: CN V2.7 p103; unit 706 -->

如果方向配置错误可能导致声卡打开后收不到任何数据，LOG 大概如下（节点路径需要根据实际情况修改）：

<!-- source: CN V2.7 p103; unit 707 -->

```text
console:/ # cat /proc/asound/cards
 0 [rockchiphdmi ]: rockchip_hdmi - rockchip,hdmi
                rockchip,hdmi

 1 [rockchiphdmiin ]: rockchip_hdmiin - rockchip,hdmiin
                rockchip,hdmiin

console:/ # cat /proc/asound/card1/pcm0c/sub0/status
state: RUNNING
owner_pid : 1415
trigger_time: 1632716135.151992694
tstamp   : 0.000000000
delay    : 0
avail    : 0
avail_max : 0
-----

hw_ptr   : 0
appl_ptr : 0
```

<!-- source: CN V2.7 p103; unit 708 -->

正常情况应该类似下面的信息：

<!-- source: CN V2.7 p103; unit 709 -->

```text
console:/ # cat /proc/asound/card1/pcm0c/sub0/status
state: RUNNING
owner_pid : 1421

trigger_time: 1632892868.412331044
tstamp   : 1632892881.181113577
delay    : 232
avail    : 232
avail_max : 264
-----
hw_ptr   : 543736
appl_ptr : 543504
```

<!-- source: CN V2.7 p103; unit 710 -->

这是因为 RK628 做主，RK3399 当从设备，需要根据电路连接方式进行配置，如果 LRCK_TX 连接RK628，则“rockchip,clk-trcm”配置如下：

<!-- source: CN V2.7 p103; unit 711 -->

```text
+&i2s0 {
+     rockchip,clk-trcm = <1>;

+     status = "okay";
+};

console:/ # io -4 0xff880008
ff880008: 18071f1f
```

<!-- source: CN V2.7 p103; unit 712 -->

如果 LRCK_RX 连接 RK628，则“rockchip,clk-trcm”配置如下：

<!-- source: CN V2.7 p104; unit 713 -->

```text
+&i2s0 {
+     rockchip,clk-trcm = <2>;
+     status = "okay";

+};
正常寄存器如下：
console:/ # io -4 0xff880008
ff880008: 28071f1f
```

<!-- source: CN V2.7 p104; unit 714 -->

I2S_CKR 寄存器解释如下 bit29:28 解释如下：

<!-- source: CN V2.7 p104; unit 715 -->

```text
Tx and Rx Common Use
2'b00/2'b11:tx_lrck/rx_lrck are used as synchronous signal for TX
/RX respectively.

2'b01:only tx_lrck is used as synchronous signal for TX and RX.
2'b10:only rx_lrck is used as synchronous signal for TX and RX.
```

<!-- source: CN V2.7 p104; unit 716 -->

RK628 代码可以更新到 v15-210926 或更新，然后参考这个 DTS 的音频配置arch/arm64/boot/dts/rockchip/rk3399-evb-ind-lpddr4-rk628-hdmi2csi-v4l2-avb.dts

<!-- source: CN V2.7 p104; unit 717 -->

##### 6.14.3.9   HDMI-IN 声卡选择错误

<!-- source: CN V2.7 p104; unit 718 -->

APK 打开时会去根据声卡名称去匹配，早期代码可能存在名称匹配错误问题，从而导致 HDMI-IN 声卡无法打开的问题，错误信息如下：

<!-- source: CN V2.7 p104; unit 719 -->

```text
09-28 07:03:13.341 261 1386 D AudioHardwareTiny: card0 id:rockchiphdmi
09-28 07:03:13.341 261 1386 D AudioHardwareTiny: SPEAKER card, got
card=0,device=0

09-28 07:03:13.341 261 1386 D AudioHardwareTiny: HDMI card, got
card=0,device=0
09-28 07:03:13.341 261 1386 D AudioHardwareTiny: SPDIF card, got
card=0,device=0
09-28 07:03:13.341 261 1386 D AudioHardwareTiny: BT card, got card=0,device=0
09-28 07:03:13.342 261 1386 D AudioHardwareTiny: card1 id:rockchiphdmiin
09-28 07:03:13.342 261 1386 D AudioHardwareTiny: SPEAKER card, got
card=1,device=0
09-28 07:03:13.342 261 1386 D AudioHardwareTiny: HDMI card, got
card=1,device=0
09-28 07:03:13.342 261 1386 D AudioHardwareTiny: SPDIF card, got
card=1,device=0

09-28 07:03:13.342 261 1386 D AudioHardwareTiny: BT card, got card=1,device=0
09-28 07:03:13.342 261 1386 D AudioHardwareTiny: No exist
proc/asound/card2/id, break and finish parsing
09-28 07:03:13.343 261 1386 D AudioHardwareTiny: dump out device info
09-28 07:03:13.343 261 1386 D AudioHardwareTiny: dev_info SPEAKER card=1,
device:0
09-28 07:03:13.343 261 1386 D AudioHardwareTiny: dev_info HDMI card=1,
device:0
09-28 07:03:13.343 261 1386 D AudioHardwareTiny: dev_info SPDIF card=1,
device:0
09-28 07:03:13.343 261 1386 D AudioHardwareTiny: dev_info BT card=1, device:0
```

<!-- source: CN V2.7 p104; unit 720 -->

HDMI card, got card=1,device=0 信息与实际不符，因此声卡无法打开。

<!-- source: CN V2.7 p105; unit 721 -->

需要更新以下补丁解决或者将 RK628 代码更新到 V15-210926 或更新版本解决。

<!-- source: CN V2.7 p105; unit 722 -->

```text
hardware/rockchip/audio
commit 1b51a62fc62e9d63850e4e5a39f1e3cff0aa9b88 (HEAD)
Author: Shunhua Lan <lsh@rock-chips.com>

Date: Tue Sep 28 17:25:44 2021 +0800

   [audio hal] use levenshtein distance for sound card matching

   Signed-off-by: Shunhua Lan <lsh@rock-chips.com>
   Change-Id: I16f1692715d710a0693ae74875b0272669a04ba2
```

<!-- source: CN V2.7 p105; unit 723 -->

#### 6.14.4   其他音频文档补充

<!-- source: CN V2.7 p105; unit 724 -->

如果 RK628 直接连 SOC，可以参考文档“RK628-DIRECT-TO-SOC.pdf”。

<!-- source: CN V2.7 p105; unit 725 -->

如果 RK628 通过 AUDIO CODEC 再连 SOC，可以参考文档“RK628-RT5640-AUDIO-CONFIG.pdf”。

<!-- source: CN V2.7 p105; unit 726 -->

和 HDMI-IN APK 相关的音频问题，可以参考文档“RK628-HDMIIN-APP-AUDIO.pdf”。

<!-- source: CN V2.7 p105; unit 727 -->

若其他文档与这个文档有不符的地方或者冲突，以这个文档为准。

<!-- source: CN V2.7 p105; unit 728 -->

### 6.15   常见问题排查方法

<!-- source: CN V2.7 p105; unit 729 -->

#### 6.15.1   clk det 异常问题

<!-- source: CN V2.7 p105; unit 730 -->

##### 6.15.1.1   RK628D

<!-- source: CN V2.7 p105; unit 731 -->

COMBRXPHY 没有检测到信号，有可能是 HDMI 插入有效电平或是 HPD 有效电平配置出错，导致输入源 HDMI 信号没有正常输入。需要检查 rk628_csi 节点下 plugin-det-gpios 和 hpd-output-inverted 配置项，同时可以用万用表测试 HPD 电平状态。

<!-- source: CN V2.7 p105; unit 732 -->

注意异常时会进行 retry，最多到 retry 2。若 retry 后能够正常，则可认为信号正常。

<!-- source: CN V2.7 p105; unit 733 -->

```text
rk628-csi-v4l2 1-0051: clk det over cnt:10, reg_0x6654:0x403f0000
rk628-csi-v4l2 1-0051: |d2_p| level detection anomaly
rk628-csi-v4l2 1-0051: clock detected failed, cfg resistance manual!

rk628-csi-v4l2 1-0051: err, clk not stable, reg_0x6630:0x87000d,
reg_0x6608:0x110100
m00_b_rk628-csi 1-0051: hdmi rxphy power on failed
```

<!-- source: CN V2.7 p105; unit 734 -->

如上 log，可以看出是 data2_p 电压检测异常，可能是没信号或是电平幅值比较低。

<!-- source: CN V2.7 p105; unit 735 -->

```text
rk628-csi-v4l2 1-0051: clk det over cnt:10, reg_0x6654:0x403f0000
rk628-csi-v4l2 1-0051: Clock detection anomaly
rk628-csi-v4l2 1-0051: clock detected failed, cfg resistance manual!

rk628-csi-v4l2 1-0051: err, clk not stable, reg_0x6630:0x87000d,
reg_0x6608:0x110100
m00_b_rk628-csi 1-0051: hdmi rxphy power on failed
```

<!-- source: CN V2.7 p106; unit 736 -->

如上 log，表示频点检测异常，可能是频点不在 RK628D 的支持范围内，目前 HDMIRX 支持以下频点：

<!-- source: CN V2.7 p106; unit 737 -->

```text
25175, 27000, 33750, 40000, 59400, 65000, 68250, 74250,
75000, 83500, 85500, 88750, 928125, 101000, 102250, 108000,
118800, 119000, 135000, 148500, 150000, 162000, 165000, 297000
```

<!-- source: CN V2.7 p106; unit 738 -->

#### 6.15.2   HDMI RX 正常的判断方法

<!-- source: CN V2.7 p106; unit 739 -->

COMBRXPHY 正常锁定后，HDMI RX 控制器能正常解析到 Timing，Timing 是计算出来，可能会有一些小误差，一般可能会差 1。详细的 Timing 可参考 CEA 标准文档。

<!-- source: CN V2.7 p106; unit 740 -->

![原始技术图 — CN V2.7, p106](/docs/rockchip-rk628-porting/assets/cn-p106-X606.png)

*原始技术图: CN V2.7, p106.*

以下为截图中完整可见文字的可复制转录；截图边缘被裁切的字符不猜测补全，片段不保证可独立执行。

```text
m00_b_rk628-csi rk628-csi: cnt_num:1000, tmds_cnt:3000, hs_cnt:15, vs_cnt:3667, hofs:192
m00_b_rk628-csi rk628-csi: SCDC_REGS1:0xffff0f00, act:1920x1080, total:2200x1125, fps:60,
m00_b_rk628-csi rk628-csi: hfp:88, hs:45, hbp:147, vfp:4, vs:5, vbp:36, interlace:0
m00_b_rk628-csi rk628-csi: rk628_csi_s_dv_timings: 1920x1080p60.0 (2200x1125)
m00_b_rk628-csi rk628-csi: enable_stream: disable
```

<!-- source: CN V2.7 p106; unit 741 -->

#### 6.15.3   Open subdev 权限异常

<!-- source: CN V2.7 p106; unit 742 -->

![原始技术图 — CN V2.7, p106](/docs/rockchip-rk628-porting/assets/cn-p106-X607.png)

*原始技术图: CN V2.7, p106.*

以下为截图中完整可见文字的可复制转录；截图边缘被裁切的字符不猜测补全，片段不保证可独立执行。

```text
D JNI     : JNI CAMERA CALL init
I HdmiInput-native: JNI OnLoad
I HdmiInput-native: Apk Version: V1.2
E HdmiInput-native: openDevice(91): open /dev/v4l-subdev2 failed,erro=Permission denied
D RockchipCamera2: remove fake pic button
D RockchipCamera2: recreateTextureview
D RockchipCamera2: textureView remove
D RockchipCamera2: onResume
```

<!-- source: CN V2.7 p106; unit 743 -->

需要确认是否已经给 /dev/v4l-subdev* 提供 666 的权限，在设备命令行查询：

<!-- source: CN V2.7 p106; unit 744 -->

```text
rk3288:/ # cat /vendor/ueventd.rc | grep subdev
/dev/v4l-subdev*   0666 media   camera
```

<!-- source: CN V2.7 p106; unit 745 -->

目前 SDK 代码已经包含了本提交，若未包含，可在 device/rockchip/common/ 参考如下修改：

<!-- source: CN V2.7 p106; unit 746 -->

![原始技术图 — CN V2.7, p106](/docs/rockchip-rk628-porting/assets/cn-p106-X608.png)

*原始技术图: CN V2.7, p106.*

以下为截图中完整可见文字的可复制转录；截图边缘被裁切的字符不猜测补全，片段不保证可独立执行。

```text
wendingxian@ubuntu:~/rk3288_9.0_int/device/rockchip/common$ git show
commit 17112e1430b0f10a88b57c73ad19203e58f0eeff (HEAD -> mid_9.0, rk/rk/rk33/mid/9.0/develop)
Author: Dingxian Wen <shawn.wen@rock-chips.com>
Date:   Tue Apr 27 21:26:48 2021 +0800

    ueventd.rockchip.rc: modify the /dev/v4l-subdev* permission to 666

    Signed-off-by: Dingxian Wen <shawn.wen@rock-chips.com>
    Change-Id: Id4848209fd983f7e525761f19c7f0420b9fee747

diff --git a/ueventd.rockchip.rc b/ueventd.rockchip.rc
index 1914490b..52935d49 100755
--- a/ueventd.rockchip.rc
+++ b/ueventd.rockchip.rc
@@ -178,7 +178,7 @@
 /dev/ovr0                0664   system     system
 
 #for rk_isp1
-/dev/v4l-subdev*         0660   media      camera
+/dev/v4l-subdev*         0666   media      camera

 /dev/video0             0660   media      camera
 /dev/video1             0660   media      camera
```

<!-- source: CN V2.7 p107; unit 747 -->

#### 6.15.4   信号识别不到

<!-- source: CN V2.7 p107; unit 748 -->

步骤 1. 拔插 HDMI，串口没有 RK628 相关的 log 打印，说明 det 脚的 gpio 配置错误。

<!-- source: CN V2.7 p107; unit 749 -->

步骤 2. 拔出 HDMI 有 RK628 的 log 打印，而插入没有 RK628 的 log 打印，说明 plugin-det-gpios 脚极性设置反了，如果中间加了三极管反向那么要设置 GPIO_ACTIVE_LOW。 判断拔插状态是否吻合，可以把 rk628_csi_v4l2.c 里面，static int debug; 改成 static int debug =3;插入的时候会打印 tx_5v_power_present: 1 ，拔出的时候 tx_5v_power_present: 0 就算对了

<!-- source: CN V2.7 p107; unit 750 -->

步骤 3. 插入一直检测不到正常信号，可能有下面几种情况：

<!-- source: CN V2.7 p107; unit 751 -->

情况 1. hpd 脚反向问题，RK628 给 hdmiin 座子那边要有高电平，hdmi 才会有输出，如果加了反向器，那么 RK628 管脚需要输出低，反向之后到座子那边才会变高。那么 dts 要加上 hpd-output-inverted;

<!-- source: CN V2.7 p107; unit 752 -->

情况 2. phy 锁不住，请参考clk det 异常问题；

<!-- source: CN V2.7 p107; unit 753 -->

情况 3. 分辨率锁不住，可能是 HDMIRX 检测到码率超出规定范围；

<!-- source: CN V2.7 p107; unit 754 -->

情况 4. 分辨率能锁住。avi_rcv_rdy 在信号锁住后会设置为 1，但是如果报 avi 信号没有 ready，这种可能是中断脚没有配置。例如以下 LOG 一直打印 avi_rcv_rdy:0，表示能识别到正常分辨率，但是avi_rcv_rdy 为 0，信号没锁住，优先检查下中断脚配置是否正确。

<!-- source: CN V2.7 p107; unit 755 -->

```text
rk628d 1-0050: rk628_is_avi_ready PDEC_AVI_PB:0x10000840, avi_rcv_rdy:0
rk628d 1-0050: SCDC_REGS1:0x80000f00, act:1920x1080, total:2200x1125, fps:60,

pixclk:148500000
```

<!-- source: CN V2.7 p107; unit 756 -->

这种情况下去抓图，测试过 rk3288 抓图会概率性出现图像分割界面

<!-- source: CN V2.7 p107; unit 757 -->

#### 6.15.5   显示异常

<!-- source: CN V2.7 p107; unit 758 -->

1\. 确认输入源是否是 DVI Mode， RK628D 不支持 DVI，可以查看 log:

<!-- source: CN V2.7 p107; unit 759 -->

```text
rk628-csi-v4l2 1-0051: DVI mode detected
```

<!-- source: CN V2.7 p107; unit 760 -->

2\. 确认输入源是否有 HDCP 加密，如果有加密，需要打开 RK628 HDMIRX 的 HDCP 功能。

<!-- source: CN V2.7 p107; unit 761 -->

#### 6.15.6   显示只有一半画面

<!-- source: CN V2.7 p107; unit 762 -->

出现这个问题，最大的可能是测试场景 HDMI 的源输出是 4K60，但是对接的主控是旧的平台，如RK3399、RK3568、RK3288 等只能支持单 MIPI 的 SOC，这样 RK628F/H 会将 4K60 拆分成左右两半图像，因此主控收到的只有一半的图像。这种场景下，建议直接将 edid 修改为支持到 4K30，即直接使用RK628D 的 edid 即可：

<!-- source: CN V2.7 p108; unit 763 -->

```text
diff --git a/drivers/media/i2c/rk628/rk628_csi_v4l2.c b/drivers/media/i2c/rk628/rk628_csi_v4l2.c
index 32182d4433605..36568f5a081e0 100644

--- a/drivers/media/i2c/rk628/rk628_csi_v4l2.c
+++ b/drivers/media/i2c/rk628/rk628_csi_v4l2.c
@@ -1347,7 +1347,7 @@ static void rk628_csi_initial_setup(struct v4l2_subdev *sd)
      def_edid.start_block = 0;
      def_edid.blocks = 2;
      if (csi->rk628->version >= RK628F_VERSION)
-          def_edid.edid = rk628f_edid_init_data;
+          def_edid.edid = edid_init_data;
      else
           def_edid.edid = edid_init_data;
      rk628_csi_s_edid(sd, &def_edid);
```

<!-- source: CN V2.7 p108; unit 764 -->

#### 6.15.7   抓图失败

<!-- source: CN V2.7 p108; unit 765 -->

1\. Android9.0 之后及 linux 平台

<!-- source: CN V2.7 p108; unit 766 -->

RK 平台 Android9.0 之后或者 linux 可以通过 v4l2-ctl 抓图。先看 media-ctl -d /dev/mediaX -p  , media 节点编号根据各个平台不同而不同。如果不清楚，一般情况把 cif 控制器关掉，会是 media0，rk3399 如果接 phy1，可能就是 media1 等等,请了解平台 camera 配置.如果 media-ctl 拓扑下面有 rk628 的节点，如果没有应该就是 dts 配置有问题，自行检查，另外拓扑结构所有分辨率并不和你输入的分辨率匹配，那么也得通过 media-ctl 设置成一致。

<!-- source: CN V2.7 p108; unit 767 -->

然后执行

<!-- source: CN V2.7 p108; unit 768 -->

```text
v4l2-ctl -d /dev/video0 --set-fmt-
video=width=1920,height=1080,pixelformat=NV12 --stream-mmap=3`
```

<!-- source: CN V2.7 p108; unit 769 -->

如果一直打印<<<<<<<<<< 说明抓图正常，这种情况驱动一般已经正常。如果一直报错，或者概率报错：

<!-- source: CN V2.7 p108; unit 770 -->

```text
rkisp1: MIPI mis error:
```

<!-- source: CN V2.7 p108; unit 771 -->

一般可能跟硬件相关，检查硬件 hdmi 线有无分叉，阻抗匹配是否一致，另外比较多客戶喜欢hdmi 线上接电阻（默认原理图上不接），这种我们默认非必要情况下阻值为 0，如果不为 0，可能概率性出现报错情况。要具体分析，检查下 rk628 到主控这端的信号；

<!-- source: CN V2.7 p108; unit 772 -->

或者出现

<!-- source: CN V2.7 p108; unit 773 -->

```text
rkisp-vir0: MIPI error: overflow: 0x00000001
```

<!-- source: CN V2.7 p108; unit 774 -->

这个 log 是 rk356x rv11xx 容易在 isp 使用 4k 输入的时候出现的问题，这种情况建议走rk628+vicap 链路，请搜索本文档 vicap 配置方式说明

<!-- source: CN V2.7 p108; unit 775 -->

另外打印如下这种 SIZE_ERROR，有可能是输入 720p，却用 1080p 采集，这种分辨率不匹配的情况，要检查拓扑结构所有分辨率，以及 v4l2-ctl 采集分辨率是否对的问题，当然建议是刚开始先都用 1080p 去测试

<!-- source: CN V2.7 p108; unit 776 -->

```text
rkisp1 ff910000.rkisp1: CIF_ISP_PIC_SIZE_ERROR
```

<!-- source: CN V2.7 p109; unit 777 -->

另外系统默认用的是 /dev/v4l-subdev2 去判断分辨率，但是如果用 media-ctl -p 看的拓扑结构为/dev/v4l-subdev3，如下：

<!-- source: CN V2.7 p109; unit 778 -->

```text
 - entity 70: m00_b_rk628-csi rk628-csi (1 pad, 1 link)
       type V4L2 subdev subtype Sensor
       device node name /dev/v4l-subdev3

pad0: Source
   [fmt:UYVY2X8/1280x720]
   -> "rockchip-csi2-dphy0":0 []
```

<!-- source: CN V2.7 p109; unit 779 -->

这样就会识别不到分辨率，应用在判断分辨率会识别不到，也会打印 CIF_ISP_PIC_SIZE_ERROR，为了解决这个问题，需要将 android 的应用 jni/native.cpp 文件做如下修改：

<!-- source: CN V2.7 p109; unit 780 -->

```text
strcat(video_name, "/dev/v4l-subdev2");
```

<!-- source: CN V2.7 p109; unit 781 -->

改成

<!-- source: CN V2.7 p109; unit 782 -->

```text
strcat(video_name, "/dev/v4l-subdev3");
```

<!-- source: CN V2.7 p109; unit 783 -->

2\. 4K 分辨率不收图

<!-- source: CN V2.7 p109; unit 784 -->

4K 因为频率更高，也有可能是硬件信号质量不好的缘故，另外 3399 isp 需要超频，参考RK3399 配置isp 超频的方法

<!-- source: CN V2.7 p109; unit 785 -->

#### 6.15.8   APK 打开失败

<!-- source: CN V2.7 p109; unit 786 -->

发布的补丁会自带 rkCamera2 源码，请在系统里面编译(可以直接放在根目录下，然后 mmm apk 目录)。应用闪退可能是以下原因导致的：

<!-- source: CN V2.7 p109; unit 787 -->

1\. 依赖库问题

<!-- source: CN V2.7 p109; unit 788 -->

如果只将 apk 安装到系统，那么会报

<!-- source: CN V2.7 p109; unit 789 -->

```text
AndroidRuntime: java.lang.UnsatisfiedLinkError: dlopen failed: library
"/system/lib64/libhdmiinput_jni.so" needed or dlopened by

"/apex/com.android.runtime/lib64/libnativeloader.so" is not accessible for
the namespace "classloader-namespace"
```

<!-- source: CN V2.7 p109; unit 790 -->

这种情况建议直接在 SDK 编译并打包，依赖库会打包到 img 里面。

<!-- source: CN V2.7 p109; unit 791 -->

2\. 文件权限问题

<!-- source: CN V2.7 p109; unit 792 -->

APK 通过 ioctl 的方式访问 RK628 设备节点，比如：

<!-- source: CN V2.7 p109; unit 793 -->

```text
HdmiInput-navtive: openDevice(113): open /dev/v4l-subdev2
failed,erro=Permission denied
```

<!-- source: CN V2.7 p109; unit 794 -->

首先确定文件权限，补丁有设置成 666，由于在 APK 访问了设备节点，所以需要确认是否关闭了selinux，可通过 getenforce 命令查看。

<!-- source: CN V2.7 p109; unit 795 -->

3\. 上层配置问题

<!-- source: CN V2.7 p109; unit 796 -->

Android 9.0 之后配置 camera3_profiles.xml，Android 9.0 之前配置 cam_board.xml，可以通过dumpsys media.camera 查看，如果没有，可能就是没有配置：

<!-- source: CN V2.7 p110; unit 797 -->

```text
$ dumpsys media.camera

== Service global info: ==


Number of camera devices: 1
Number of normal camera devices: 1
```

<!-- source: CN V2.7 p110; unit 798 -->

4\. camera 库 crash

<!-- source: CN V2.7 p110; unit 799 -->

例如出现以下错误，可能是 camera 名称错误导致，因为 getDataFromXmlFile 获取到的名字和驱动的不吻合，导致 CRASH。

<!-- source: CN V2.7 p110; unit 800 -->

```text
09-29 04:43:30.673 405 405 W ServiceManagement: Waited one second for
android.hardware.camera.provider@2.4::ICameraProvider/legacy/0. Waiting

another...
09-29 04:43:31.673 405 405 W ServiceManagement: Waited one second for
android.hardware.camera.provider@2.4::ICameraProvider/legacy/0. Waiting
another...
...
09-29 04:43:31.904 1404 1404 F DEBUG : backtrace:
09-29 04:43:31.904 1404 1404 F DEBUG : #00 pc 0007214e
/vendor/lib/hw/camera.rk30board.so
(android::camera2::ChromeCameraProfiles::handleAndroidStaticMetadata(char const*,
char const**)+546)
09-29 04:43:31.904 1404 1404 F DEBUG : #01 pc 00007895 /system/lib/vndk-
28/libexpat.so (doContent+432)
09-29 04:43:31.905 1404 1404 F DEBUG : #02 pc 0000637b /system/lib/vndk-

28/libexpat.so (contentProcessor+40)
09-29 04:43:31.905 1404 1404 F DEBUG : #03 pc 00003825 /system/lib/vndk-
28/libexpat.so (XML_ParseBuffer+84)
09-29 04:43:31.905 1404 1404 F DEBUG : #04 pc 000711ad
/vendor/lib/hw/camera.rk30board.so
(android::camera2::CameraProfiles::getDataFromXmlFile()+148)
09-29 04:43:31.905 1404 1404 F DEBUG : #05 pc 00071e97
/vendor/lib/hw/camera.rk30board.so
(android::camera2::ChromeCameraProfiles::init()+86)
09-29 04:43:31.905 1404 1404 F DEBUG : #06 pc 000734c7
/vendor/lib/hw/camera.rk30board.so (android::camera2::PlatformData::init()+198)
09-29 04:43:31.905 1404 1404 F DEBUG : #07 pc 000cecb3

/vendor/lib/hw/camera.rk30board.so (initCameraHAL()+46)
...
```

<!-- source: CN V2.7 p110; unit 801 -->

对于需要 v4l2（android9.0 及以上）的需要将 camera3_profiles_rk3399.xml 里面的 name=“rk628-csi” 改名成 name=“rk628-csi-v4l2”，修改如下：

<!-- source: CN V2.7 p110; unit 802 -->

```text
hardware/rockchip/camera
--- a/etc/camera/camera3_profiles_rk3399.xml
+++ b/etc/camera/camera3_profiles_rk3399.xml

@@ -769,7 +769,7 @@

 <!-- ******************PSL specific section end
**************************************************************-->
   </Profiles>
-  <Profiles cameraId="0" name="rk628-csi" moduleId="m00">
+  <Profiles cameraId="0" name="rk628-csi-v4l2" moduleId="m00">
```

<!-- source: CN V2.7 p111; unit 803 -->

5\. APK 权限导致的闪退

<!-- source: CN V2.7 p111; unit 804 -->

出现该问题的 LOG 大概如下：

<!-- source: CN V2.7 p111; unit 805 -->

对于需要 v4l2（android9.0 及以上）的需要将“rk628-csi”改名成“rk628-csi-v4l2”

<!-- source: CN V2.7 p111; unit 806 -->

```text
09-24 10:21:20.154 1552 1570 E AndroidRuntime: FATAL EXCEPTION: Thread-2
09-24 10:21:20.154 1552 1570 E AndroidRuntime: Process:

com.android.rockchip.camera2, PID: 1552
09-24 10:21:20.154 1552 1570 E AndroidRuntime: java.lang.IllegalStateException:
startRecording() called on an uninitialized AudioRecord.
09-24 10:21:20.154 1552 1570 E AndroidRuntime: at
android.media.AudioRecord.startRecording(AudioRecord.java:983)
09-24 10:21:20.154 1552 1570 E AndroidRuntime: at
com.android.rockchip.camera2.AudioStream$recordSound.run(AudioStream.java:199)
09-24 10:21:20.154 1552 1570 E AndroidRuntime: at
java.lang.Thread.run(Thread.java:764)
09-24 10:21:20.164 464 820 W ActivityManager: Force finishing activity
com.android.rockchip.camera2/.RockchipCamera2
09-24 10:21:20.183 1552 1552 D RockchipCamera2: onPause
```

<!-- source: CN V2.7 p111; unit 807 -->

可以采用以下补丁解决

<!-- source: CN V2.7 p111; unit 808 -->

```text
packages/apps/rkCamera2
--- a/AndroidManifest.xml

+++ b/AndroidManifest.xml
@@ -4,7 +4,8 @@
   package="com.android.rockchip.camera2">

      <uses-permission android:name="android.permission.CAMERA" />
-     <uses-permission
android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
+     <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
/>
+     <uses-permission android:name="android.permission.RECORD_AUDIO" />
   <application
      android:allowBackup="true"
      android:icon="@mipmap/ic_launcher"

diff --git a/src/com/android/rockchip/camera2/RockchipCamera2.java b/src/com/android/rockchip/camera2/RockchipCamera2.java
index 9dc29b8..02ee104 100755
--- a/src/com/android/rockchip/camera2/RockchipCamera2.java
+++ b/src/com/android/rockchip/camera2/RockchipCamera2.java
@@ -100,9 +100,11 @@ public class RockchipCamera2 extends Activity {
      if (ActivityCompat.checkSelfPermission(this,
         Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED
         && ActivityCompat.checkSelfPermission(this,
-             Manifest.permission.WRITE_EXTERNAL_STORAGE) !=
PackageManager.PERMISSION_GRANTED) {
+             Manifest.permission.WRITE_EXTERNAL_STORAGE) !=

PackageManager.PERMISSION_GRANTED
+        && ActivityCompat.checkSelfPermission(this,
+             Manifest.permission.RECORD_AUDIO) !=
PackageManager.PERMISSION_GRANTED) {
         ActivityCompat.requestPermissions(RockchipCamera2.this,
-          new String[] { Manifest.permission.CAMERA,
Manifest.permission.WRITE_EXTERNAL_STORAGE },
+          new String[] { Manifest.permission.CAMERA,

Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.RECORD_AUDIO},
           REQUEST_CAMERA_PERMISSION);
         return;
      }
```

<!-- source: CN V2.7 p112; unit 809 -->

<!-- source: CN V2.7 p112; unit 810 -->

#### 6.15.9   dts 配置连接到 rkcif，apk 预览失败

<!-- source: CN V2.7 p112; unit 811 -->

RK356X，android11 代码版本是 R10/R11，dts 配置 RK628 连接到 rkcif，抓图正常，apk 打开预览失败，可能是 R10 和 R11 的代码 cameraHAL 部分不支持该 pipeline 链路造成的，R9 没有这个问题。排查方法和解决方法如下：

<!-- source: CN V2.7 p112; unit 812 -->

1\. 打开 cameraHAL 开关：

<!-- source: CN V2.7 p112; unit 813 -->

```text
setprop persist.vendor.camera.hal.debug 5
```

<!-- source: CN V2.7 p112; unit 814 -->

2\. 抓取打开 apk 出错的 logcat，log 关键信息如下：

<!-- source: CN V2.7 p112; unit 815 -->

![原始技术图 — CN V2.7, p112](/docs/rockchip-rk628-porting/assets/cn-p112-X629.png)

*原始技术图: CN V2.7, p112.*

以下为截图中完整可见文字的可复制转录；截图边缘被裁切的字符不猜测补全，片段不保证可独立执行。

```text
I RkCamera: <HAL> RKISP2GraphConfig: @addLinkParams, srcName:rockchip-csi2-dphy0, srcPad:1, sinkName:none, sinkPad:0, enable:1, flags:1
I RkCamera: <HAL> RKISP2GraphConfig: @addLinkParams, srcName:none, srcPad:1, sinkName:none, sinkPad:0, enable:1, flags:1
I RkCamera: <HAL> RKISP2GraphConfig: @addLinkParams, srcName:none, srcPad:2, sinkName:rkisp_rawwr0, sinkPad:0, enable:1, flags:1
I RkCamera: <HAL> RKISP2GraphConfig: @addLinkParams, srcName:none, srcPad:4, sinkName:rkisp_rawwr2, sinkPad:0, enable:1, flags:1
I RkCamera: <HAL> RKISP2GraphConfig: @addLinkParams, srcName:none, srcPad:5, sinkName:rkisp_rawwr3, sinkPad:0, enable:1, flags:1
I RkCamera: <HAL> RKISP2GraphConfig: @addFormatParams, entityName:none, width:1920, height:1080, pad:0, format:0x2006:V4L2_MBUS_FMT_UYVY8_2X8, field:0
I RkCamera: <HAL> RKISP2GraphConfig: @addSelectionParams, width:1920, height:1080, left:0, top:0, target:0, pad:0, entityName:none
I RkCamera: <HAL> RKISP2GraphConfig: @addSelectionParams, width:1920, height:1080, left:0, top:0, target:0, pad:2, entityName:none
I RkCamera: <HAL> RKISP2GraphConfig: @addFormatParams, entityName:none, width:1920, height:1080, pad:2, format:0x2008:V4L2_MBUS_FMT_YUYV8_2X8, field:0
I RkCamera: <HAL> RKISP2GraphConfig: @addLinkParams, srcName:none, srcPad:3, sinkName:none, sinkPad:0, enable:1, flags:1
I RkCamera: <HAL> RKISP2GraphConfig: @addLinkParams, srcName:none, srcPad:0, sinkName:none, sinkPad:1, enable:1, flags:1
D RkCamera: <HAL> RKISP2GraphConfig: @ isNeedPathCrop : stream ratios: 1.777778
D RkCamera: <HAL> RKISP2GraphConfig: @ isNeedPathCrop : mp_need_crop 1, sp_need_crop 0, sp_enabled 0
D RkCamera: <HAL> RKISP2GraphConfig: @ calc_crop : src_ratio:1.777778, dst_ratio:1.777778, src(1920x1080), dst(1920x1080)
I RkCamera: <HAL> RKISP2GraphConfig: @addSelectionVideoParams, width:1920, height:1080, left:0, top:0, target:0, type:1, flags:0 entityName:none
I RkCamera: <HAL> RKISP2GraphConfig: @addFormatParams, entityName:none, width:1920, height:1080, pad:0, format:0x3231564e:V4L2_PIX_FMT_NV12, field:0
I RkCamera: <HAL> RKISP2GraphConfig: @addLinkParams, srcName:none, srcPad:2, sinkName:none, sinkPad:0, enable:1, flags:1
I RkCamera: <HAL> RKISP2GraphConfig: @getImguMediaCtlConfig : No need for selfPath
```

<!-- source: CN V2.7 p112; unit 816 -->

如果看到上述 log，则是 ameraHAL 默认将对应的 pipeline 配置到 rkisp 了，而 dts 对应的是配置到rkcif

<!-- source: CN V2.7 p112; unit 817 -->

3\. 解决办法

<!-- source: CN V2.7 p112; unit 818 -->

hardware/rockchip/camera 目录下，添加如下修改：

<!-- source: CN V2.7 p112; unit 819 -->

```text
diff --git a/psl/rkisp2/RKISP2GraphConfig.cpp b/psl/rkisp2/RKISP2GraphConfig.cpp
index 2a5fa5a..3d2409c 100755
--- a/psl/rkisp2/RKISP2GraphConfig.cpp

+++ b/psl/rkisp2/RKISP2GraphConfig.cpp
@@ -76,6 +76,7 @@ const string MEDIACTL_POSTVIEWNAME = "postview";

 const string MEDIACTL_STATNAME = "rkisp1-statistics";
 const string MEDIACTL_VIDEONAME_CIF = "stream_cif_dvp_id0";
+const string MEDIACTL_VIDEONAME_CIF_MIPI_ID0 = "stream_cif_mipi_id0";

 RKISP2GraphConfig::RKISP2GraphConfig() :
      mManager(nullptr),
@@ -2620,6 +2621,13 @@ status_t RKISP2GraphConfig::getImguMediaCtlConfig(int32_t
cameraId,
            addLinkParams("rkisp-isp-subdev", 2, "rkisp_mainpath", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);

            addLinkParams("rkisp-isp-subdev", 2, "rkisp_selfpath", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
         }
+     } else if(mipName2.find("mipi") != std::string::npos) {
+        addLinkParams(mipName, mipSrcPad, mipName2, csiSinkPad, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);

+        addLinkParams(mipName2, 1, "stream_cif_mipi_id0", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
+        addLinkParams(mipName2, 2, "stream_cif_mipi_id1", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
+        addLinkParams(mipName2, 3, "stream_cif_mipi_id2", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
+        addLinkParams(mipName2, 4, "stream_cif_mipi_id3", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
+        mSensorLinkedToCIF = true;
      } else {
         addLinkParams(mipName, mipSrcPad, csiName, csiSinkPad, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);

         addLinkParams(csiName, csiSrcPad, IspName, ispSinkPad, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
@@ -2628,6 +2636,12 @@ status_t RKISP2GraphConfig::getImguMediaCtlConfig(int32_t
cameraId,
         addLinkParams(csiName, 5, "rkisp_rawwr3", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
      }
   }
+  if(mSensorLinkedToCIF){
+     addImguVideoNode(IMGU_NODE_VIDEO, MEDIACTL_VIDEONAME_CIF_MIPI_ID0,
mediaCtlConfig);
+     addFormatParams(MEDIACTL_VIDEONAME_CIF_MIPI_ID0, mCurSensorFormat.width,
mCurSensorFormat.height,

+           0, V4L2_PIX_FMT_NV12, 0, 0, mediaCtlConfig);
+     return OK;
+  }
   // isp input pad format and selection config
   addFormatParams(IspName, ispInWidth, ispInHeight, ispSinkPad, ispInFormat,
0, 0, mediaCtlConfig);
   addSelectionParams(IspName, ispInWidth, ispInHeight, 0, 0,
V4L2_SEL_TGT_CROP, ispSinkPad, mediaCtlConfig);
```

<!-- source: CN V2.7 p113; unit 820 -->

<!-- source: CN V2.7 p113; unit 821 -->

#### 6.15.10   如何操作 RK628 的 GPIO

<!-- source: CN V2.7 p113; unit 822 -->

在需要控制 GPIO 的位置直接调用 GPIO 接口即可，该接口包括 IOMUX 设置，GPIO 方向设置和电平设置，例如以下操作将 I2C_SDA_HDMI 和 I2C_SCL_HDMI 接口设为 GPIO。

<!-- source: CN V2.7 p113; unit 823 -->

```text
rk628_gpio_direction_output(rk628, GPIO1_B1, GPIO_REG_HIGH);
rk628_gpio_direction_output(rk628, GPIO1_B2, GPIO_REG_HIGH)；
```

<!-- source: CN V2.7 p113; unit 824 -->

若需要恢复则需要调用以下接口。

<!-- source: CN V2.7 p113; unit 825 -->

```text
rk628_pinctrl_set_mux(rk628, GPIO1_B1, DDCM0SDARX);
rk628_pinctrl_set_mux(rk628, GPIO1_B2, DDCM0SCLRX)；
```

<!-- source: CN V2.7 p114; unit 826 -->

#### 6.15.11   声卡注册失败

<!-- source: CN V2.7 p114; unit 827 -->

如下，系统启动后，找不到 hdmiin 声卡

<!-- source: CN V2.7 p114; unit 828 -->

```text
# cat /proc/asound/cards
 1 [rockchiphdmiin ]: rockchip_hdmiin - rockchip,hdmiin
                rockchip,hdmiin
```

<!-- source: CN V2.7 p114; unit 829 -->

那么首先要检查的是，声卡依赖的一个 soc dai、codec dai 设备是否有加载成功：

<!-- source: CN V2.7 p114; unit 830 -->

```text
rk3399:/ # cat /sys/kernel/debug/asoc/components
...
dummy-codec

ff8a0000.i2s
ff8a0000.i2s
ff880000.i2s
ff880000.i2s
...
rk3399:/ # cat /sys/kernel/debug/asoc/dais
...
ff8a0000.i2s
ff880000.i2s
dummy-codec
....
```

<!-- source: CN V2.7 p114; unit 831 -->

以上节点加载失败的话，可以检查 defconfig、dts

<!-- source: CN V2.7 p114; unit 832 -->

在 soc dai  codec dai 都注册成功的情况下，出现声卡注册不上，有可能是 dma 资源不够，尤其是rk3399 情况下出现比较多，在 4.19 以上内核，可以在 i2s 节点添加下面属性来解决：

<!-- source: CN V2.7 p114; unit 833 -->

```text
--- a/arch/arm64/boot/dts/rockchip/rk3399.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3399.dtsi

@@ -1788,6 +1788,7 @@
           clocks = <&cru SCLK_I2S2_8CH>, <&cru HCLK_I2S2_8CH>;
           resets = <&cru SRST_I2S2_8CH>, <&cru SRST_H_I2S2_8CH>;
           reset-names = "reset-m", "reset-h";
+          rockchip,capture-only;
           power-domains = <&power RK3399_PD_SDIOAUDIO>;
           status = "disabled";
```

<!-- source: CN V2.7 p114; unit 834 -->

## 7.   常见需求处理

<!-- source: CN V2.7 p114; unit 835 -->

### 7.1   RK628 24M 晶振来自其他 SOC 的配置方式

<!-- source: CN V2.7 p114; unit 836 -->

下面分别以几个 ROCKCHIP 的主控来提供配置方法，其中 DTS 的配置 CLK 都默认有在代码中使能，如果未使能开机后 24M CLK 会被关闭，从而导致 I2C 通信异常。

<!-- source: CN V2.7 p115; unit 837 -->

#### 7.1.1   RK3399 添加 24M 支持

<!-- source: CN V2.7 p115; unit 838 -->

1\. 在 rk628 dts 中引用以下配置

<!-- source: CN V2.7 p115; unit 839 -->

```text
pinctrl-names = "default";
pinctrl-0 = <&rk628_rst>, <&clk_testout2>;
assigned-clocks = <&cru SCLK_TESTCLKOUT2>;

assigned-clock-rates = <24000000>;
clocks = <&cru SCLK_TESTCLKOUT2>;
clock-names = "soc_24M";
```

<!-- source: CN V2.7 p115; unit 840 -->

2\. 根据实际硬件接法添加 IO 脚的 PINCTRL 配置

<!-- source: CN V2.7 p115; unit 841 -->

```text
&pinctrl {
      test {
           clk_testout2: clk_testout2 {

           rockchip,pins = <0 8 RK_FUNC_3 &pcfg_pull_none>;
      };
};
```

<!-- source: CN V2.7 p115; unit 842 -->

#### 7.1.2   RK3288 添加 24M 支持

<!-- source: CN V2.7 p115; unit 843 -->

1\. 在 rk628 dts 中引用以下配置

<!-- source: CN V2.7 p115; unit 844 -->

```text
pinctrl-names = "default";
pinctrl-0 = <&test_clkout>;
assigned-clocks = <&cru SCLK_TESTOUT_SRC>;

assigned-clock-parents = <&xin24m>;
clocks = <&cru SCLK_TESTOUT>;
clock-names = "soc_24M";
```

<!-- source: CN V2.7 p115; unit 845 -->

2\. 根据实际硬件接法添加 IO 脚的 PINCTRL 配置

<!-- source: CN V2.7 p115; unit 846 -->

```text
&pinctrl {
      test {
           test_clkout: test-clkout {

                 rockchip,pins = <0 17 RK_FUNC_1 &pcfg_pull_none>;
           };
      };
};
```

<!-- source: CN V2.7 p115; unit 847 -->

#### 7.1.3   RK356X 添加 24M 支持

<!-- source: CN V2.7 p115; unit 848 -->

RK356X 能输出 24MHZ 的引脚比较多，例如 REF_CLKOUT（clk_wifi/gpio0_a0）、CAM_CLKOUT1（clk_cam1_out/gpio4_b0）、ETH_REFCLK_25M_M0（clk_mac1_out/gpio3_b0）,现以 clk_wifi 为例介绍。

<!-- source: CN V2.7 p115; unit 849 -->

1\. 在 rk628 dts 中引用以下配置

<!-- source: CN V2.7 p115; unit 850 -->

```text

&i2c2_rk628 {
   pinctrl-names = "default";
   pinctrl-0 = <&rk628_reset &refclk_pins>;

   assigned-clocks = <&pmucru CLK_WIFI>;
   assigned-clock-rates = <24000000>;
   clocks = <&pmucru CLK_WIFI>;
   clock-names = "soc_24M";
};

&pinctrl {
   rk628 {
      rk628_reset: rk628-reset {
         rockchip,pins = <2 RK_PA2 RK_FUNC_GPIO &pcfg_pull_none>;
      };
   };

};
```

<!-- source: CN V2.7 p116; unit 851 -->

<!-- source: CN V2.7 p116; unit 852 -->

2\. 以下配置在 rk3568-pinctrl.dtsi 中自带

<!-- source: CN V2.7 p116; unit 853 -->

```text
&pinctrl {
   ......

   refclk {
      /omit-if-no-ref/
      refclk_pins: refclk-pins {
         rockchip,pins =
           /* refclk_ou */
           <0 RK_PA0 1 &pcfg_pull_none>;
      };
   };
   ......
};
```

<!-- source: CN V2.7 p116; unit 854 -->

其他未写的 RK 芯片，可以参考文档 “Rockchip_Develop_Guide_Gpio_Output_Clocks_CN.pdf” 进行24M 的处理。

<!-- source: CN V2.7 p116; unit 855 -->

### 7.2   双 RK628 支持

<!-- source: CN V2.7 p116; unit 856 -->

#### 7.2.1   HDMI2CSI+HDMI2CSI 支持

<!-- source: CN V2.7 p116; unit 857 -->

##### 7.2.1.1   注意事项

<!-- source: CN V2.7 p116; unit 858 -->

1\. 两路 RK628 实现类似 camera 双摄的做法，两路 RK628 能够同时工作，需要主控支持两个 isp 控

<!-- source: CN V2.7 p116; unit 859 -->

制器，同时处理两个输入数据，例如 RK3399 等。

<!-- source: CN V2.7 p116; unit 860 -->

2\. 在硬件设计上，两个 RK628 需要挂在不同的 I2C 下或者两路 RK628 挂在同一个 I2C 下但设计成不

<!-- source: CN V2.7 p116; unit 861 -->

同的 I2C 地址。

<!-- source: CN V2.7 p116; unit 862 -->

3\. 注意 dts 的配置需要跟硬件设计一致，具体的 rk628 硬件接到 mipi_phy_rx0 或者

<!-- source: CN V2.7 p116; unit 863 -->

mipi_phy_tx1rx1，在 dts 也需要对应的配置。

<!-- source: CN V2.7 p116; unit 864 -->

4\. 使用两路 rk628 实现 HDMI2CSI，两路 rk628 的 RESET、INT 控制 io 不能用一样的，否则会异

<!-- source: CN V2.7 p116; unit 865 -->

常。

<!-- source: CN V2.7 p117; unit 866 -->

##### 7.2.1.2   kernel dts 配置问题

<!-- source: CN V2.7 p117; unit 867 -->

现在以 RK3399 配置两路 RK628 为例介绍。

<!-- source: CN V2.7 p117; unit 868 -->

1\. rk628->mipi_dphy_rx0->rkisp1_0，第一路 index 为 0，facing 配置为 back

<!-- source: CN V2.7 p117; unit 869 -->

```text
&i2c1 {
   status = "okay";


   rk628_csi_v4l2: rk628_csi_v4l2@50 {
      compatible = "rockchip,rk628-csi-v4l2";
      reg = <0x50>;
      //clocks = <&ext_cam_clk>;
      //clock-names = "xvclk";

      interrupt-parent = <&gpio4>;
      interrupts = <16 IRQ_TYPE_LEVEL_LOW>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_irq>;
      //power-gpios = <&gpio0 RK_PD5 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio4 RK_PD2 GPIO_ACTIVE_LOW>;

      plugin-det-gpios = <&gpio0 RK_PD6 GPIO_ACTIVE_LOW>;
      rockchip,camera-module-index = <0>;
      rockchip,camera-module-facing = "back";
      rockchip,camera-module-name = "RK628-CSI";
      rockchip,camera-module-lens-name = "NC";
      port {
         rk628_out: endpoint {
           remote-endpoint = <&hdmi2mipi_in>;
           data-lanes = <1 2 3 4>;
         };
      };
   };

};

&mipi_dphy_rx0 {
   status = "okay";

   ports {
      #address-cells = <1>;
      #size-cells = <0>;

      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;


         hdmi2mipi_in: endpoint@1 {
           reg = <1>;
           remote-endpoint = <&rk628_out>;
           data-lanes = <1 2 3 4>;
         };
      };

      port@1 {
         reg = <1>;
         #address-cells = <1>;
         #size-cells = <0>;


         dphy_rx0_out: endpoint@0 {
           reg = <0>;
           remote-endpoint = <&isp0_mipi_in>;
         };
      };
   };
};

&rkisp1_0 {
   status = "okay";


   port {
      #address-cells = <1>;
      #size-cells = <0>;

      isp0_mipi_in: endpoint@0 {
         reg = <0>;
         remote-endpoint = <&dphy_rx0_out>;
      };
   };
};
```

<!-- source: CN V2.7 p118; unit 870 -->

<!-- source: CN V2.7 p118; unit 871 -->

2\. rk628->mipi_dphy_tx1rx1->rkisp1_1，第二路 index 为 1，facing 配置为 front

<!-- source: CN V2.7 p118; unit 872 -->

```text
&i2c4 {
   status = "okay";


   rk628_csi_v4l2_1: rk628_csi_v4l2_1@50 {
      compatible = "rockchip,rk628-csi-v4l2";
      reg = <0x50>;
      //clocks = <&ext_cam_clk>;
      //clock-names = "xvclk";

      interrupt-parent = <&gpio3>;
      interrupts = <12 IRQ_TYPE_LEVEL_LOW>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_irq1>;
      //power-gpios = <&gpio0 RK_PD5 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio4 RK_PD3 GPIO_ACTIVE_LOW>;

      plugin-det-gpios = <&gpio0 RK_PD7 GPIO_ACTIVE_LOW>;
      rockchip,camera-module-index = <1>;
      rockchip,camera-module-facing = "front";
      rockchip,camera-module-name = "RK628-CSI";
      rockchip,camera-module-lens-name = "NC";
      port {
         rk628_out1: endpoint {
           remote-endpoint = <&hdmi2mipi_in1>;
           data-lanes = <1 2 3 4>;
         };
      };
   };
};

&mipi_dphy_tx1rx1 {

   status = "okay";

   ports {
      #address-cells = <1>;
      #size-cells = <0>;

      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;

         hdmi2mipi_in1: endpoint@1 {

           reg = <1>;
           remote-endpoint = <&rk628_out1>;
           data-lanes = <1 2 3 4>;
         };
      };

      port@1 {
         reg = <1>;
         #address-cells = <1>;
         #size-cells = <0>;

         dphy_tx1rx1_out: endpoint@0 {
           reg = <0>;

           remote-endpoint = <&isp1_mipi_in>;
         };
      };
   };
};

&rkisp1_1 {
   status = "okay";

   port {
      #address-cells = <1>;
      #size-cells = <0>;


      isp1_mipi_in: endpoint@0 {
         reg = <0>;
         remote-endpoint = <&dphy_tx1rx1_out>;
      };
   };
};
```

<!-- source: CN V2.7 p119; unit 873 -->

<!-- source: CN V2.7 p119; unit 874 -->

##### 7.2.1.3   android 配置问题

<!-- source: CN V2.7 p119; unit 875 -->

1\. camera3_profiles.xml 文件配置注意事项：

<!-- source: CN V2.7 p119; unit 876 -->

moduleId：需要与 dts 中的 index 一致

<!-- source: CN V2.7 p119; unit 877 -->

第一路 rk628：

<!-- source: CN V2.7 p120; unit 878 -->

![原始技术图 — CN V2.7, p120](/docs/rockchip-rk628-porting/assets/cn-p120-X659.png)

*原始技术图: CN V2.7, p120.*

以下为截图中完整可见文字的可复制转录；截图边缘被裁切的字符不猜测补全，片段不保证可独立执行。

```text
</Profiles>
<Profiles cameraId="0" name="rk628-csi" moduleId="m00">
    <Supported_hardware>
        <hwType value="SUPPORTED_HW_RKISP1"/>
    </Supported_hardware>
```

<!-- source: CN V2.7 p120; unit 879 -->

第二路 rk628:

<!-- source: CN V2.7 p120; unit 880 -->

![原始技术图 — CN V2.7, p120](/docs/rockchip-rk628-porting/assets/cn-p120-X660.png)

*原始技术图: CN V2.7, p120.*

以下为截图中完整可见文字的可复制转录；截图边缘被裁切的字符不猜测补全，片段不保证可独立执行。

```text
</Profiles>
<Profiles cameraId="1" name="rk628-csi" moduleId="m01">
    <Supported_hardware>
        <hwType value="SUPPORTED_HW_RKISP1"/>
    </Supported_hardware>
```

<!-- source: CN V2.7 p120; unit 881 -->

2\. 两路 rk628 如果需要同时使用，cameraHAL 需要添加支持，在

<!-- source: CN V2.7 p120; unit 882 -->

SDK/hardware/rockchip/camera$目录下添加修改：

<!-- source: CN V2.7 p120; unit 883 -->

```text
diff --git a/common/platformdata/PlatformData.cpp b/common/platformdata/PlatformData.cpp

index 36d2ac9..d3fcb4b 100755
--- a/common/platformdata/PlatformData.cpp
+++ b/common/platformdata/PlatformData.cpp
@@ -1047,7 +1047,7 @@ CameraHWInfo::CameraHWInfo() :
   mProductName = "<not_set>";
   mManufacturerName = "<not set>";
   mCameraDeviceAPIVersion = CAMERA_DEVICE_API_VERSION_3_3;
-  mSupportDualVideo = false;
+  mSupportDualVideo = true;
   mSupportExtendedMakernote = false;
   mSupportFullColorRange = true;
   mSupportIPUAcceleration = false;
```

<!-- source: CN V2.7 p120; unit 884 -->

#### 7.2.2   HDMI2CSI+HDMI2DSI 支持

<!-- source: CN V2.7 p120; unit 885 -->

##### 7.2.2.1   kernel dts 配置

<!-- source: CN V2.7 p120; unit 886 -->

HDMI2CSI+HDMI2DSI 组合：一路 RK628 走 camera 框架，接到主控端，一路 RK628 接到屏幕。这里以 RK3399 为例

<!-- source: CN V2.7 p120; unit 887 -->

1\. HDMI2CSI 配置

<!-- source: CN V2.7 p120; unit 888 -->

rk628->mipi_phy_rx0->rkisp1_0 或者 rk628->mipi_dphy_tx1rx1->rkisp1_1，以接 rkisp1_0 为例

<!-- source: CN V2.7 p120; unit 889 -->

```text
&i2c1 {
   status = "okay";


   rk628_csi_v4l2: rk628_csi_v4l2@50 {
      compatible = "rockchip,rk628-csi-v4l2";
      reg = <0x50>;
      //clocks = <&ext_cam_clk>;
      //clock-names = "xvclk";

      interrupt-parent = <&gpio4>;
      interrupts = <16 IRQ_TYPE_LEVEL_LOW>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_irq>;
      //power-gpios = <&gpio0 RK_PD5 GPIO_ACTIVE_HIGH>;

      reset-gpios = <&gpio4 RK_PD2 GPIO_ACTIVE_LOW>;
      plugin-det-gpios = <&gpio0 RK_PD6 GPIO_ACTIVE_LOW>;
      rockchip,camera-module-index = <0>;
      rockchip,camera-module-facing = "back";
      rockchip,camera-module-name = "RK628-CSI";
      rockchip,camera-module-lens-name = "NC";
      port {
         rk628_out: endpoint {
            remote-endpoint = <&hdmi2mipi_in>;
            data-lanes = <1 2 3 4>;
         };
      };

   };
};

&mipi_dphy_rx0 {
   status = "okay";

   ports {
      #address-cells = <1>;
      #size-cells = <0>;

      port@0 {
         reg = <0>;
         #address-cells = <1>;

         #size-cells = <0>;

         hdmi2mipi_in: endpoint@1 {
            reg = <1>;
            remote-endpoint = <&rk628_out>;
            data-lanes = <1 2 3 4>;
         };
      };

      port@1 {
         reg = <1>;
         #address-cells = <1>;

         #size-cells = <0>;

         dphy_rx0_out: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&isp0_mipi_in>;
         };
      };
   };
};

&rkisp1_0 {
   status = "okay";


   port {
      #address-cells = <1>;
      #size-cells = <0>;
      isp0_mipi_in: endpoint@0 {
         reg = <0>;

         remote-endpoint = <&dphy_rx0_out>;
      };
   };
};
```

<!-- source: CN V2.7 p121; unit 890 -->

<!-- source: CN V2.7 p122; unit 891 -->

<!-- source: CN V2.7 p122; unit 892 -->

2\. HDMI2DSI 配置

<!-- source: CN V2.7 p122; unit 893 -->

直接参考 2.4.5 章节的 HDMI2DSI 转换即可。

<!-- source: CN V2.7 p122; unit 894 -->

##### 7.2.2.2   android 配置

<!-- source: CN V2.7 p122; unit 895 -->

1\. HDMI2CSI：参考一路 rk628 HDMI2CSI 即可，正确配置 camera3_profiles.xml 即可。

<!-- source: CN V2.7 p122; unit 896 -->

2\. HDMI2DSI: android 部分不需要做配置

{% endraw %}
