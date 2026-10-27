---
title: "Rockchip Android BOX display framework configuration"
description: "Configure DRM display modes and the Baseparameter partition, including framebuffer settings, backup layout and diagnostics."
excerpt: "Configure DRM display modes and the Baseparameter partition, including framebuffer settings, backup layout and diagnostics."
translation_key: "256-rockchip-android-box-display"
slug: "256-rockchip-android-box-display"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM","Rockchip","Android"]
---

{% raw %}


Source:RK-SM-YF-504 V1.0.1,Chinese. This covers user resolution,scaling,color and BCSH settings plus framebuffer resolution and primary/secondary display configuration for the documented BOX SDK. Product scope:RK3328/RK3368/RK3229,Linux4.4/Linux4.19,Android8.1+. No ArmSoM validation or confirmation for every later SDK is implied;no source commands executed. All six figures are CN originals,no EN source supplied.

## 1 Display settings

### 1.1 Display settings flow

The documented Android8.1+ RK platform uses DRM (Direct Rendering Manager). Upper interfaces configure DRM parameters;HWC ultimately applies them through libdrm. The diagram shows TVSetting → rkdisplay → HWC → libdrm → kernel.

![Display settings flow](/docs/rockchip-android-box-display/images/display-flow.png)

Display settings flow - Original source figure; PDF page 5 (CN).

### 1.2 Resolution filtering

The initial list can contain many unwanted modes. HWC filters hot-pluggable HDMI/DP display modes with device/rockchip/common/resolution_white.xml before passing them upward. Each `<resolution>` block specifies one allowed mode. Timing items refer to the original diagram below.

| Field | Meaning |
| --- | --- |
| clock | Clock |
| hdisplay | Timing item referenced by source figure2 |
| hsync_start | Timing item referenced by source figure2 |
| hsync_end | Timing item referenced by source figure2 |
| htotal | Timing item referenced by source figure2 |
| hskew | Timing item referenced by source figure2 |
| vdisplay | Timing item referenced by source figure2 |
| vsync_start | Timing item referenced by source figure2 |
| vsync_end | Timing item referenced by source figure2 |
| vtotal | Timing item referenced by source figure2 |
| vscan | Timing item referenced by source figure2 |
| vrefresh | Display frame rate |
| flags | Sync/interlace bits below |
| vic | HDMI-standard VIC;0 if not defined |

```c
DRM_MODE_FLAG_PHSYNC (1<<0)
DRM_MODE_FLAG_NHSYNC (1<<1)
DRM_MODE_FLAG_PVSYNC (1<<2)
DRM_MODE_FLAG_NVSYNC (1<<3)
DRM_MODE_FLAG_INTERLACE (1<<4)
```

![Resolution timing definitions](/docs/rockchip-android-box-display/images/mode-timing.png)

Resolution timing definitions - Original source figure; PDF page 6 (CN).

## 2 Baseparameter partition

### 2.1 Baseparameter image

Display settings are stored in the1MB Baseparameter partition,initialized by flashing baseparameter.img. The SDK default is device/rockchip/common/baseparameter/baseparameter_fb1080.img. Generate a replacement using saveBaseParameter and set TARGET_BASE_PARAMETER_IMAGE in BoardConfig.mk,for example:

```make
TARGET_BASE_PARAMETER_IMAGE := device/rockchip/rk3328/baseparameter.img
```

### 2.2 saveBaseParameter

This tool inspects,sets and exports the partition. Source:device/rockchip/common/baseparameter/saveBaseParameter. eng/userdebug builds include it by default;run it on the device. -h prints help,-p prints partition data,-t `<path>` exports an image that can be pulled to the host and flashed. The original help lists these additional options:

| Option | Meaning / example |
| --- | --- |
| -d | Display0 or1 |
| -f | 1920x1080@60 |
| -D | HDMI-A,TV |
| -c | RGB, YCbCr444-10bit |
| -u | 2 automatic resolution;1 fixed resolution |
| -o | Overscan100,100,100,100 |
| -b | BCSH50,50,50,50 |
| -R | 1 reset user settings only;2 reset partition including backup |

![saveBaseParameter help](/docs/rockchip-android-box-display/images/tool-help.png)

saveBaseParameter help - Original source figure; PDF page 7 (CN).

![Partition data example](/docs/rockchip-android-box-display/images/partition-dump.png)

Partition data example - Original source figure; PDF page 8 (CN).

The basic area receives user settings. Factory reset erases that area and copies the backup area into it. Both areas contain primary and auxiliary display data:resolution,color,fbinfo (framebuffer resolution),device,bcsh (Brightness,Contrast,Saturation,Hue),overscan (left,top,right,bottom order) and feature (special flags). Note the CLI overscan order differs from the struct member order below.

### 2.3 Partition data structures

#### 2.3.1 Partition layout

```c
struct disp_info{
struct drm_display_mode resolution;
struct overscan scan;
enum output_format format;
enum output_depth depthc;
unsigned int feature;
struct hwc_inital_info hwc_info;
struct bcsh_info bcsh;
unsigned int reserve[128];
struct lut_data mlutdata;
};
```

```c
struct disp_info main;
struct disp_info aux;
```

main occupies the first8KB address range;aux starts at offset8KB. sizeof(disp_info) is not8KB,so read/write the records separately and seek8KB before auxiliary access. The diagram labels drm_display_mode52B,overscan12B,format4B,depth4B,feature4B,hwc_inital_info140B,bcsh8B,reserve512B,lut_data6KB+4. These are source-diagram labels,not a verified ABI:the shown lut_data has a16-bit size and three1024-entry16-bit arrays,so confirm alignment/layout against actual SDK headers.

![Main/aux partition layout](/docs/rockchip-android-box-display/images/partition-layout.png)

Main/aux partition layout - Original source figure; PDF page 9 (CN).

#### 2.3.2 disp_info fields

drm_display_mode stores resolution timing;clock is in kHz. overscan stores scaling limits and edge values.

```c
struct drm_display_mode {
/* Proposed mode values */
int clock; /* in kHz */
int hdisplay;
int hsync_start;
int hsync_end;
int htotal;
int vdisplay;
int vsync_start;
int vsync_end;
int vtotal;
int vrefresh;
int vscan;
unsigned int flags;
int picture_aspect_ratio;
};
```

```c
struct overscan {
unsigned int maxvalue;
unsigned short leftscale;
unsigned short rightscale;
unsigned short topscale;
unsigned short bottomscale;
};
```

output_format selects color format. Property string Auto selects output_ycbcr_high_subsampling. The high preference is YCbCr444 > YCbCr422 > YCbCr420 > RGB;low preference reverses that order. output_depth selects bit depth;Auto selects Automatic.

```c
enum output_format {
output_rgb=0,
output_ycbcr444=1,
output_ycbcr422=2,
output_ycbcr420=3,
output_ycbcr_high_subsampling=4, // (YCbCr444 > YCbCr422 > YCbCr420 > RGB)
output_ycbcr_low_subsampling=5 , // (RGB > YCbCr420 > YCbCr422 > YCbCr444)
invalid_output=6,
};
```

```c
enum output_depth{
Automatic=0,
depth_24bit=8,
depth_30bit=10,
};
```

feature controls automatic resolution/color,HDCP1.x and resolution whitelist filtering. hwc_inital_info configures framebuffer width/height,fps and attached primary/auxiliary devices. device example:HDMI-A,TV;fps can limit frame rate.

```c
#define RESOLUTION_AUTO (1<<0)
#define COLOR_AUTO (1<<1)
#define HDCP1X_EN (1<<2)
#define RESOLUTION_WHITE_EN (1<<3)
```

```c
struct hwc_inital_info{
char device[128];
unsigned int framebuffer_width;
unsigned int framebuffer_height;
float fps;
};
```

bcsh_info values range0–100,all default50. reserve[128] is reserved for future use. lut_data stores RGB lookup tables;size is the number of values in each table,maximum1024.

```c
struct bcsh_info {
unsigned short brightness;
unsigned short contrast;
unsigned short saturation;
unsigned short hue;
};
```

```c
unsigned int reserve[128];
```

```c
struct lut_data{
uint16_t size;
uint16_t lred[1024];
uint16_t lgreen[1024];
uint16_t lblue[1024];
};
```

#### 2.3.3 Backup area

The second half starts at512KB and preserves initial settings for factory reset. The diagram places main_backup and AUX_backup in the first16KB of that half,with the same8KB separation.

![Backup layout](/docs/rockchip-android-box-display/images/backup-layout.png)

Backup layout - Original source figure; PDF page 11 (CN).

### 2.4 Debug information

| Read-only property | Meaning |
| --- | --- |
| vendor.hwc.device.main | Current primary output interface |
| vendor.hwc.device.aux | Current auxiliary output interface |

Use <code>logcat &#124; grep BP</code> to check whether HWC read Baseparameter correctly at boot.

```sh
logcat | grep BP
```

### 2.5 FAQ:1280×720 framebuffer

Source procedure:a)get root;b)reset partition;c)write settings;d)print and confirm;e)export image and pull it to the host. Warning:-R2 resets the partition including backup;back up the existing data before applying this example. The following commands are documentary,not executed here.

```sh
su
saveBaseParameter -R 2
saveBaseParameter -d 0 -f 1280x720@60 -D "HDMI-A,TV" -c Auto -u 2 -o "100,100,100,100" -b "50,50,50,50"
saveBaseParameter -p
saveBaseParameter -t /sdcard/baseparameter.img
adb pull /sdcard/baseparameter.img
```

f)Flash the generated baseparameter.img,reboot and inspect <code>logcat &#124; grep BP</code> to confirm HWC values. g)Place the image in the SDK,for example device/rockchip/rk3328/baseparameter.img,apply the following BoardConfig change and rebuild. The source wrapped the added assignment over two printed lines;it is joined below as one Make assignment.

```diff
diff --git a/rk3328_box/BoardConfig.mk b/rk3328_box/BoardConfig.mk
index 3831ce8..f151fe7 100755
--- a/rk3328_box/BoardConfig.mk
+++ b/rk3328_box/BoardConfig.mk
@@ -16,6 +16,8 @@
TARGET_BOARD_PLATFORM_PRODUCT := box
+TARGET_BASE_PARAMETER_IMAGE := device/rockchip/rk3328/baseparameter.img
+
# Use the non-open-source parts, if they're present
-include vendor/rockchip/rk3328/BoardConfigVendor.mk
-include device/rockchip/common/BoardConfig.mk
```

{% endraw %}
