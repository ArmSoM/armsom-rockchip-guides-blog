---
title: "Rockchip DRM Direct Show: Kernel Display APIs and Kernel Logo"
description: "Complete Rockchip DRM Direct Show reference covering kernel display APIs, buffer fields, automated tests and kernel logo configuration."
translation_key: "043-rockchip-drm-direct-show"
slug: "043-rockchip-drm-direct-show"
lang: "en"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["DRM", "Direct Show", "Kernel Logo", "RK356X", "RK3588"]
keywords: "ArmSoM Rockchip DRM Direct Show kernel logo RK356X RK3588"
excerpt: "Complete Rockchip DRM Direct Show reference covering kernel display APIs, buffer fields, automated tests and kernel logo configuration."
---

{% raw %}
# Rockchip DRM Direct Show: Kernel Display APIs and Kernel Logo

## ArmSoM applicability

This is a vendor platform reference, not an ArmSoM hardware test report. The source covers RK356X/RK3588 with the corresponding Rockchip BSP using Linux kernel 5.10 or later. Verify the target board's SoC, SDK branch, DRM Direct Show APIs, display output and plane names. A sufficiently recent kernel alone does not imply support in any mainline kernel or on every ArmSoM board. No hardware validation was performed.

Source: the Chinese *Rockchip DRM Direct Show Developer Guide*, V1.0.0, 8 pages. No English PDF was supplied. The complete technical body was translated from Chinese into English and Russian; all three versions use the original figure from the Chinese PDF. Nontechnical cover material, intended audience and revision history were removed. [Editorial notes](/docs/rockchip-drm-direct-show/EDITORIAL-NOTES.md). Check board adaptation against the [official ArmSoM documentation](https://docs.armsom.org/).

## Preface and product version

This guide describes the kernel-space display-submission interfaces provided by the Rockchip DRM display-driver framework. Typical uses include fast image display, kernel logo display and automated testing.

| Chip | Kernel version |
| --- | --- |
| RK356X/RK3588 | Linux kernel 5.10 or later |

## 1. Direct Show APIs and usage

### 1.1 API descriptions

#### 1.1.1 Obtain the DRM device

```c
struct drm_device *rockchip_drm_get_dev(void);
```

Obtains the DRM device. Subsequent buffer allocation and release, acquisition of crtc and plane, and display submission all require this device.

#### 1.1.2 Allocate memory

```c
int rockchip_drm_direct_show_alloc_buffer(struct drm_device *drm,
                                         struct rockchip_drm_direct_show_buffer *buffer)
```

buffer inputs:

| Variable | Description |
| --- | --- |
| width | Buffer width in pixels |
| height | Buffer height in pixels |
| pixel_format | Buffer format; see the definitions in `include/uapi/drm/drm_fourcc.h` |
| flag | Specifies the buffer type. The default value 0 selects scattered, noncontiguous memory; `ROCKCHIP_BO_CONTIG` selects contiguous memory |

buffer outputs:

| Variable | Description |
| --- | --- |
| bpp | Number of bits per pixel derived from `buffer->pixel_format` |
| pitch[3] | The buffer's virtual width derived from `buffer->width`, `buffer->pixel_format` and alignment rules |
| vir_addr[3] | Kernel-space virtual address of the allocated buffer |
| phy_addr[3] | Physical address of the allocated buffer |
| rk_gem_obj | Abstraction used by the rockchip drm gem driver to manage this buffer |
| fb | Abstraction of this buffer for drm plane display |
| dmabuf_fd | dmabuf_fd exported from this buffer, potentially used by other modules |

For `buffer->pitch[3]`, `buffer->vir_addr[3]` and `buffer->phy_addr[3]`, take `buffer->pitch[3]` as an example: RGB uses `buffer->pitch[0]` by default; NV12 has 2 planes and uses `buffer->pitch[0]` and `buffer->pitch[1]`; a format with 3 planes uses `buffer->pitch[0]`, `buffer->pitch[1]` and `buffer->pitch[2]`.

#### 1.1.3 Obtain the crtc

```c
struct drm_crtc *rockchip_drm_direct_show_get_crtc(struct drm_device *drm)
```

Obtains the crtc currently in use.

#### 1.1.4 Obtain the plane

```c
struct drm_plane *rockchip_drm_direct_show_get_plane(struct drm_device *drm,
                                                  char *name)
```

Obtains the plane corresponding to name for display. For example, obtain Esmart0-win0:

```c
plane = rockchip_drm_direct_show_get_plane(drm_dev, "Esmart0-win0")
```

#### 1.1.5 Submit for display

```c
int rockchip_drm_direct_show_commit(struct drm_device *drm,
                                    struct rockchip_drm_direct_show_commit_info *commit_info)
```

| commit_info variable | Description |
| --- | --- |
| crtc | Specifies the crtc to submit to |
| plane | Specifies the plane to submit |
| buffer | Buffer submitted for display |
| top_zpos | false: use the default configuration; true: place at the top |
| src_x/src_y/src_w/src_h | Offset and size of the buffer region used for display; see the figure below |
| dst_x/dst_y/dst_w/dst_h | Position and size of the current plane on the screen; see the figure below |

![Original Chinese-PDF figure: source framebuffer region and destination screen offsets and dimensions](/docs/rockchip-drm-direct-show/assets/cn-p6-X55.png)

#### 1.1.6 Disable the plane

```c
int rockchip_drm_direct_show_disable_plane(struct drm_device *drm,
                                         struct drm_plane *plane)
```

When the current plane no longer needs to be displayed, this interface disables its display.

#### 1.1.7 Release memory

```c
void rockchip_drm_direct_show_free_buffer(struct drm_device *drm,
                                        struct rockchip_drm_direct_show_buffer *buffer)
```

After disabling the plane, use this interface to release and reclaim its buffer memory if the buffer is no longer needed.

### 1.2 Usage sequence

Rockchip DRM Direct Show is disabled by default. Enable it in `rockchip_defconfig` when required:

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

The basic usage sequence consists of these 7 steps:

1. Obtain the drm device.
2. Allocate a buffer with the required format and dimensions.
3. Draw the required image into the allocated buffer.
4. Obtain the crtc and plane.
5. Submit for display.
6. Disable the plane when display is no longer required.
7. Release and reclaim the memory.

## 2. Automated test case

A Rockchip DRM automated test program is implemented using Rockchip DRM Direct Show. Developers can use it as a reference or as an automated test program for the Rockchip DRM driver. This feature is disabled by default; enable it in `rockchip_defconfig`:

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

## 3. Kernel logo display

Some products do not use Rockchip's official U-Boot, or cannot enable U-Boot logo display for another reason, but still require a kernel logo. Modify the Direct Show automated test program to implement this:

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

Here, `kernel_logo_img.h` stores the data generated by converting a BMP file with bmp2hex or a similar tool. Adjust the `BUFFER_WIDTH`, `BUFFER_HEIGHT` and `BUFFER_FORMAT` macros to match the actual image.

If a suitable bmp2hex tool is unavailable, search for bmp2hex at the [Rockchip Redmine document entry specified by the source](https://redmine.rock-chips.com/documents/97). Account access may be required.

> Editorial note: the diff blocks are excerpts from the source. Their original hunk counts and context are retained; they are not guaranteed to apply as complete patches. API examples retain the source's presence or absence of semicolons. Check the matching BSP; see the editorial notes.

{% endraw %}
