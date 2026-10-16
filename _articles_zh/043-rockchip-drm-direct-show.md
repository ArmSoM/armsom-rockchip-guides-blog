---
title: "Rockchip DRM Direct Show：内核态显示接口与 Kernel Logo"
description: "完整解读 Rockchip DRM Direct Show 内核显示 API、buffer 字段、自动测试与 Kernel Logo 配置，保留原始代码和图示。"
translation_key: "043-rockchip-drm-direct-show"
slug: "043-rockchip-drm-direct-show"
lang: "zh"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["DRM", "Direct Show", "Kernel Logo", "RK356X", "RK3588"]
keywords: "ArmSoM Rockchip DRM Direct Show kernel logo RK356X RK3588"
excerpt: "完整解读 Rockchip DRM Direct Show 内核显示 API、buffer 字段、自动测试与 Kernel Logo 配置，保留原始代码和图示。"
---

{% raw %}
# Rockchip DRM Direct Show：内核态显示接口与 Kernel Logo

## ArmSoM 适用说明

本文为原厂平台参考，不是 ArmSoM 硬件实测报告。原文适用范围为 RK356X/RK3588、Linux kernel 5.10 及以上的配套 Rockchip BSP。必须确认目标板卡的 SoC、SDK 分支、DRM Direct Show API、显示输出和图层名称；仅内核版本满足要求不代表任意主线内核或所有 ArmSoM 板卡均支持。未进行硬件验证。

来源：中文《Rockchip DRM Direct Show 开发指南》，V1.0.0，8 页。未提供英文 PDF，英文和俄文由中文技术正文完整翻译，三语沿用中文 PDF 的同一原图。封面非技术信息、读者对象和修订记录已移除。[校对记录](/docs/rockchip-drm-direct-show/EDITORIAL-NOTES.md)。板卡适配请核对 [ArmSoM 官方文档](https://docs.armsom.org/)。

## 前言与产品版本

本文介绍基于 Rockchip DRM 显示驱动框架提供的内核态送显示接口，主要用于快速影像显示、kernel logo 显示及自动测试等场景。

| 芯片名称 | 内核版本 |
| --- | --- |
| RK356X/RK3588 | Linux kernel 5.10 及以上内核 |

## 1. Direct Show API 及使用说明

### 1.1 API 说明

#### 1.1.1 获取 DRM 设备

```c
struct drm_device *rockchip_drm_get_dev(void);
```

用于获取 DRM 设备。后面的内存申请和释放、crtc 和 plane 的获取、提交显示等流程都需要用到 DRM 设备。

#### 1.1.2 申请内存

```c
int rockchip_drm_direct_show_alloc_buffer(struct drm_device *drm,
                                         struct rockchip_drm_direct_show_buffer *buffer)
```

buffer 输入：

| 变量 | 说明 |
| --- | --- |
| width | buffer 的宽，单位为 Pixel |
| height | buffer 的高，单位为 Pixel |
| pixel_format | buffer 的格式，具体定义参考：`include/uapi/drm/drm_fourcc.h` |
| flag | 指定 buffer 类型，默认值 0 为离散非连续内存，`ROCKCHIP_BO_CONTIG` 为连续内存 |

buffer 输出：

| 变量 | 说明 |
| --- | --- |
| bpp | 根据 `buffer->pixel_format` 获取的每个 Pixel 的 bit 数量 |
| pitch[3] | 根据 `buffer->width`、`buffer->pixel_format` 及对齐规则获取当前 buffer 的虚宽 |
| vir_addr[3] | 当前申请 buffer 的内核态虚拟地址 |
| phy_addr[3] | 当前申请 buffer 的物理地址 |
| rk_gem_obj | rockchip drm gem 驱动用于管理当前 buffer 的抽象 |
| fb | drm plane 显示中对当前 buffer 的抽象 |
| dmabuf_fd | 当前 buffer export 出来的 dmabuf_fd，可能由其他模块使用 |

关于 `buffer->pitch[3]`、`buffer->vir_addr[3]`、`buffer->phy_addr[3]`：以 `buffer->pitch[3]` 为例，RGB 格式默认使用 `buffer->pitch[0]`；NV12 格式有 2 个 plane，使用 `buffer->pitch[0]` 和 `buffer->pitch[1]`；有 3 个 plane 时，使用 `buffer->pitch[0]`、`buffer->pitch[1]` 和 `buffer->pitch[2]`。

#### 1.1.3 获取 crtc

```c
struct drm_crtc *rockchip_drm_direct_show_get_crtc(struct drm_device *drm)
```

用于获取当前正在使用的 crtc。

#### 1.1.4 获取 plane

```c
struct drm_plane *rockchip_drm_direct_show_get_plane(struct drm_device *drm,
                                                  char *name)
```

根据 name 获取对应的 plane，用于显示。例如获取 Esmart0-win0：

```c
plane = rockchip_drm_direct_show_get_plane(drm_dev, "Esmart0-win0")
```

#### 1.1.5 提交显示

```c
int rockchip_drm_direct_show_commit(struct drm_device *drm,
                                    struct rockchip_drm_direct_show_commit_info *commit_info)
```

| commit_info 变量 | 说明 |
| --- | --- |
| crtc | 指定提交的 crtc |
| plane | 指定提交的 plane |
| buffer | 提交用于显示的 buffer |
| top_zpos | false：按默认配置；true：设定为最顶层 |
| src_x/src_y/src_w/src_h | buffer 中用于显示部分的偏移和大小，参见下图 |
| dst_x/dst_y/dst_w/dst_h | 当前图层在屏幕上的位置和大小，参见下图 |

![中文 PDF 原图：帧缓冲源区域与屏幕目标区域的偏移和尺寸](/docs/rockchip-drm-direct-show/assets/cn-p6-X55.png)

#### 1.1.6 关闭图层

```c
int rockchip_drm_direct_show_disable_plane(struct drm_device *drm,
                                         struct drm_plane *plane)
```

不需要继续显示当前图层时，可以通过该接口关闭图层显示。

#### 1.1.7 释放内存

```c
void rockchip_drm_direct_show_free_buffer(struct drm_device *drm,
                                        struct rockchip_drm_direct_show_buffer *buffer)
```

图层关闭后，如果 buffer 无需继续使用，可通过该接口释放并回收内存。

### 1.2 使用流程

Rockchip DRM Direct Show 默认关闭。需要使用时，在 `rockchip_defconfig` 中打开：

```diff
diff --git a/arch/arm64/configs/rockchip_defconfig b/arch/arm64/configs/rockchip_defconfig
index b1c92060c6f9..2e3091f8631f 100644
--- a/arch/arm64/configs/rockchip_defconfig
+++ b/arch/arm64/configs/rockchip_defconfig
@@ -588,6 +588,8 @@ CONFIG_DRM_IGNORE_IOTCL_PERMIT=y
 CONFIG_DRM_DP_AUX_CHARDEV=y
 CONFIG_DRM_LOAD_EDID_FIRMWARE=y
 CONFIG_DRM_ROCKCHIP=y
+CONFIG_ROCKCHIP_DRM_DIRECT_SHOW=y
```

使用流程基本按照以下 7 个步骤进行：

1. 获取 drm 设备。
2. 根据需要申请对应格式和大小的 buffer。
3. 向申请的 buffer 绘制所需图像。
4. 获取 crtc 和 plane。
5. 提交显示。
6. 不需要继续显示时，关闭图层。
7. 释放和回收内存。

## 2. 自动测试用例说明

基于 Rockchip DRM Direct Show 实现了 Rockchip DRM 自动测试程序，既可供开发者参考，也可作为 Rockchip DRM 驱动的自动测试程序。此功能默认关闭，可在 `rockchip_defconfig` 中打开：

```diff
diff --git a/arch/arm64/configs/rockchip_defconfig b/arch/arm64/configs/rockchip_defconfig
index b1c92060c6f9..2e3091f8631f 100644
--- a/arch/arm64/configs/rockchip_defconfig
+++ b/arch/arm64/configs/rockchip_defconfig
@@ -588,6 +588,8 @@ CONFIG_DRM_IGNORE_IOTCL_PERMIT=y
 CONFIG_DRM_DP_AUX_CHARDEV=y
 CONFIG_DRM_LOAD_EDID_FIRMWARE=y
 CONFIG_DRM_ROCKCHIP=y
 CONFIG_ROCKCHIP_DRM_DIRECT_SHOW=y
+CONFIG_ROCKCHIP_DRM_SELF_TEST=y
```

## 3. Kernel Logo 显示说明

部分产品未使用 Rockchip 官方 U-Boot，或由于某种原因无法打开 U-Boot logo 显示，但仍需要 kernel logo 显示。此时可以修改 Direct Show 自动测试程序实现：

```diff
diff --git a/drivers/gpu/drm/rockchip/rockchip_drm_self_test.c b/drivers/gpu/drm/rockchip/rockchip_drm_self_test.c
index 74c395441e96..355632125914 100644
--- a/drivers/gpu/drm/rockchip/rockchip_drm_self_test.c
+++ b/drivers/gpu/drm/rockchip/rockchip_drm_self_test.c
@@ -20,7 +20,7 @@
 #include "kernel_logo_img.h"
 
-#define USE_BUFFER_NUM 2
+#define USE_BUFFER_NUM 1
 #define BUFFER_WIDTH 652
 #define BUFFER_HEIGHT 268
 #define BUFFER_FORMAT DRM_FORMAT_RGB565 /* DRM_FORMAT_RGB565/DRM_FORMAT_XRGB8888/DRM_FORMAT_NV12 */
@@ -159,7 +159,7 @@ static void rockchip_drm_self_test_commit(struct work_struct *work)
             goto free_buffer;
        }
 
-#if 1 /* for self test pattern */
+#if 0 /* for self test pattern */
        /* commit to display */
        do {
             u32 i = 0;
```

其中，`kernel_logo_img.h` 是使用 bmp2hex 等工具将 BMP 文件转换为对应数据后保存的文件。应根据实际图片修改 `BUFFER_WIDTH`、`BUFFER_HEIGHT` 和 `BUFFER_FORMAT` 宏定义。

若找不到合适的 bmp2hex 工具，可到 Rockchip Redmine [原文给出的文档入口](https://redmine.rock-chips.com/documents/97)搜索 bmp2hex；该入口可能需要账号权限。

> 校对提示：以上 diff 是原文片段，保留原始 hunk 行数和上下文，不保证可直接作为完整补丁应用。API 示例亦保留原文是否带分号的写法。请在对应 BSP 中核对，详见校对记录。

{% endraw %}
