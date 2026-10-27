---
title: "Rockchip Android BOX显示框架配置"
description: "配置DRM显示模式与Baseparameter分区，涵盖帧缓冲、备份布局和调试方法。"
excerpt: "配置DRM显示模式与Baseparameter分区，涵盖帧缓冲、备份布局和调试方法。"
translation_key: "256-rockchip-android-box-display"
slug: "256-rockchip-android-box-display"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM","Rockchip","Android"]
---

{% raw %}


来源RK-SM-YF-504 V1.0.1中文稿。涵盖BOX用户分辨率、缩放、颜色、BCSH及框架Framebuffer分辨率、主副设备配置。原产品范围RK3328/RK3368/RK3229、Linux4.4/Linux4.19、Android8.1+。非ArmSoM实测或全部后续SDK支持确认；未执行原命令。六图均CN原图，无EN稿。

## 1 显示设置

### 1.1 显示设置流程

所述Android8.1+ RK平台使用DRM（Direct Rendering Manager）。上层配置参数，最终HWC通过libdrm下发。图示TVSetting→rkdisplay→HWC→libdrm→kernel。

![显示设置流程](/docs/rockchip-android-box-display/images/display-flow.png)

显示设置流程 - 原稿技术图；PDF页 5 (CN).

### 1.2 分辨率过滤

初始模式多且部分不需要，HWC按device/rockchip/common/resolution_white.xml过滤HDMI/DP等热插拔设备分辨率后上报。每个`<resolution>`块定义一个允许模式，时序项见原图。

| 字段 | 含义 |
| --- | --- |
| clock | 时钟 |
| hdisplay | 原表指向图2时序项 |
| hsync_start | 原表指向图2时序项 |
| hsync_end | 原表指向图2时序项 |
| htotal | 原表指向图2时序项 |
| hskew | 原表指向图2时序项 |
| vdisplay | 原表指向图2时序项 |
| vsync_start | 原表指向图2时序项 |
| vsync_end | 原表指向图2时序项 |
| vtotal | 原表指向图2时序项 |
| vscan | 原表指向图2时序项 |
| vrefresh | 显示帧率 |
| flags | 同步/隔行位见下 |
| vic | HDMI标准VIC，未定义为0 |

```c
DRM_MODE_FLAG_PHSYNC (1<<0)
DRM_MODE_FLAG_NHSYNC (1<<1)
DRM_MODE_FLAG_PVSYNC (1<<2)
DRM_MODE_FLAG_NVSYNC (1<<3)
DRM_MODE_FLAG_INTERLACE (1<<4)
```

![分辨率时序定义](/docs/rockchip-android-box-display/images/mode-timing.png)

分辨率时序定义 - 原稿技术图；PDF页 6 (CN).

## 2 Baseparameter分区

### 2.1 Baseparameter镜像

显示设置存于1MB Baseparameter分区，烧写baseparameter.img初始化。SDK默认device/rockchip/common/baseparameter/baseparameter_fb1080.img。可用saveBaseParameter制作新镜像，在BoardConfig.mk指定TARGET_BASE_PARAMETER_IMAGE，例如：

```make
TARGET_BASE_PARAMETER_IMAGE := device/rockchip/rk3328/baseparameter.img
```

### 2.2 saveBaseParameter工具

工具可查看、设置、导出分区，源码device/rockchip/common/baseparameter/saveBaseParameter，eng/userdebug默认编译，在设备运行。-h帮助、-p打印分区、-t `<path>`导出镜像，可pull到主机并烧写。原帮助其它选项如下：

| 选项 | 含义/示例 |
| --- | --- |
| -d | 显示0或1 |
| -f | 1920x1080@60 |
| -D | HDMI-A,TV |
| -c | RGB, YCbCr444-10bit |
| -u | 2自动分辨率；1固定 |
| -o | 缩放100,100,100,100 |
| -b | BCSH50,50,50,50 |
| -R | 1只重置用户设置；2含备份分区重置 |

![saveBaseParameter帮助](/docs/rockchip-android-box-display/images/tool-help.png)

saveBaseParameter帮助 - 原稿技术图；PDF页 7 (CN).

![分区数据示例](/docs/rockchip-android-box-display/images/partition-dump.png)

分区数据示例 - 原稿技术图；PDF页 8 (CN).

基本区写入用户设置，恢复出厂擦除基本区并从备份区恢复。两区各含主副屏：resolution分辨率、color颜色、fbinfo帧缓冲分辨率、device设备、bcsh亮度/对比度/饱和度/色调、overscan按left/top/right/bottom顺序缩放、feature特殊位。CLI缩放顺序不同于下方结构成员顺序。

### 2.3 分区数据结构

#### 2.3.1 分区结构

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

main在前8KB地址空间，aux偏移8KB。disp_info大小并非8KB，应分别读写并lseek8KB后访问aux。原图标注drm_display_mode52B、overscan12B、format4B、depth4B、feature4B、hwc_inital_info140B、bcsh8B、reserve512B、lut_data6KB+4。这是原图标注而非ABI验证：下方lut_data为16位size与三组1024个16位元素，需按实际SDK头文件核实对齐布局。

![主副屏分区结构](/docs/rockchip-android-box-display/images/partition-layout.png)

主副屏分区结构 - 原稿技术图；PDF页 9 (CN).

#### 2.3.2 disp_info字段

drm_display_mode保存分辨率时序，clock单位kHz；overscan保存缩放上限和各边值。

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

output_format选择颜色格式，属性Auto选output_ycbcr_high_subsampling，优先YCbCr444>YCbCr422>YCbCr420>RGB；low顺序相反。output_depth为色深，Auto选Automatic。

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

feature控制分辨率/颜色AUTO、HDCP1.x与分辨率白名单过滤。hwc_inital_info配置Framebuffer宽高、fps及主副屏挂载设备；device例HDMI-A,TV，fps可限帧率。

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

bcsh_info范围0–100，默认均50。reserve[128]预留以后使用。lut_data存RGB查找表，size为每表元素个数，最大1024。

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

#### 2.3.3 备份区

后半区自512KB开始，保存出厂初始值。图中main_backup与AUX_backup位于该半区前16KB，同样间隔8KB。

![备份区结构](/docs/rockchip-android-box-display/images/backup-layout.png)

备份区结构 - 原稿技术图；PDF页 11 (CN).

### 2.4 调试信息

| 只读属性 | 含义 |
| --- | --- |
| vendor.hwc.device.main | 当前主显输出接口 |
| vendor.hwc.device.aux | 当前副显输出接口 |

用<code>logcat &#124; grep BP</code>检查HWC开机读取Baseparameter是否正确。

```sh
logcat | grep BP
```

### 2.5 FAQ：1280×720帧缓冲

原步骤：a取root；b清分区；c写配置；d打印确认；e导出并pull。注意-R2会重置分区含备份，应用示例前先备份现有数据。以下仅文档命令，未执行。

```sh
su
saveBaseParameter -R 2
saveBaseParameter -d 0 -f 1280x720@60 -D "HDMI-A,TV" -c Auto -u 2 -o "100,100,100,100" -b "50,50,50,50"
saveBaseParameter -p
saveBaseParameter -t /sdcard/baseparameter.img
adb pull /sdcard/baseparameter.img
```

f烧写生成镜像、重启，用<code>logcat &#124; grep BP</code>确认HWC值；g放入SDK，如device/rockchip/rk3328/baseparameter.img，按下方修改BoardConfig并重新编译。原稿新增赋值分两印刷行，下方合并为一条Make赋值。

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
