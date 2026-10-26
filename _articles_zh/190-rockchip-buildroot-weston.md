---
title: "Rockchip Buildroot Weston 显示与输入配置"
description: "Rockchip Buildroot Weston 显示与输入配置 — V1.4.5"
excerpt: "Rockchip Buildroot Weston 显示与输入配置"
translation_key: "190-rockchip-buildroot-weston"
slug: "190-rockchip-buildroot-weston"
lang: "zh"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: [ArmSoM, Rockchip, Linux]
---

{% raw %}

# Rockchip Buildroot Weston 显示与输入配置

ArmSoM 平台参考，依据对应中英文 Rockchip 原稿；具体板卡、SoC、SDK/BSP、内核及外设需逐项匹配，不代表所有 ArmSoM 板卡支持。原稿示例和测试结果不是 ArmSoM 实测，未执行命令或硬件验证。

对应 Rockchip Buildroot SDK 定制 Weston，不保证上游 Weston 支持这些扩展变量。

中英原稿均 V1.4.5，保留§1–§2.16全部配置。无独立技术配图。只修复长命令、矩阵数值和注释的PDF排版断行；不更改参数。代码中多行同名 export 是不同可选示例，不应不加选择整段执行；包含省略号的函数不是完整脚本。

中英差异：§2.16 中文使用 `>> /tmp/.weston_drm.conf`（追加），英文使用 `> /tmp/.weston_drm.conf`（覆盖）；各自保留，俄德按英文。应按实际SDK动态配置解析逻辑确认。

## 1. 简介

### 1.1 相关介绍

Weston是Wayland开源显示协议的官方参考实现,Rockchip Buildroot SDK的显示服务默认使用Weston drm后端。最新定制weston代码可从GitHub获取:https://github.com/JeffyCN/weston

### 1.2 配置方式

Buildroot SDK中Weston的配置方式有以下几种:a、启动参数即启动Weston时命令所带参数,如weston --tty=2,位于/etc/init.d/S49weston,对应SDK代码中位置为:buildroot/package/weston/S49westonb、weston.ini配置文件位于/etc/xdg/weston/weston.ini及/etc/xdg/weston/weston.ini.d/下的.ini文件,对应SDK代码中位置如:buildroot/board/rockchip/common/base/etc/xdg/weston/weston.ini参考:https://fossies.org/linux/weston/man/weston.ini.manc、特殊环境变量此类环境变量一般设置在/etc/profile.d/weston.sh,对应SDK代码中位置为:buildroot/package/weston/weston.sh.d、动态配置文件对于drm后端显示功能,Buildroot SDK中的Weston提供一些动态配置支持,默认路径为/tmp/.weston_drm.conf,可以通过环境变量WESTON_DRM_CONFIG指定。e、udev rulesWeston中输入设备的部分配置需要通过udev rules。

## 2. 具体配置

### 2.1 屏幕区分

Weston使用output(head) name区分屏幕设备。具体信息获取可以通过Weston启动log:

```text
# weston&
[02:11:29.746] DRM: head 'DSI-1' found ...
```

### 2.2 鼠标样式及大小

Weston支持在weston.ini配置文件的shell段设置鼠标样式和大小,如

```text
    # /etc/xdg/weston/weston.ini

    [shell]
    cursor-theme=whiteglass # Buildroot SDK⽀持comix/obsidian/xcursor/xcursor-transparent⿏标主题包
    cursor-size=24
```

### 2.3 状态栏相关配置

Weston支持在weston.ini配置文件的shell段设置状态栏的背景色、位置、缩放,以及在launcher段设置快捷启动程序,如:

```text
# /etc/xdg/weston/weston.ini

[shell]
panel-color=0x90ff0000
# 颜⾊格式为ARGB8888

panel-position=bottom
# top|bottom|left|right|none，none为禁⽌

panel-scale=4
# 缩放为4倍

[launcher]
icon=/usr/share/icons/gnome/24x24/apps/utilities-terminal.png
# 图标路径

path=/usr/bin/gnome-terminal
# 快捷启动命令
```

### 2.4 背景配置

Weston支持在weston.ini配置文件的shell段设置背景图案、颜色,以及在desktop-launcher段设置快捷启动程序,如

```text
# /etc/xdg/weston/weston.ini

[shell]
background-image=/usr/share/backgrounds/gnome/Aqua.jpg
# 背景图案（壁纸）绝对路径
background-type=tile
# scale|scale-crop|tile

background-color=0xff002244
# 颜⾊格式为ARGB8888，未设置背景图案时⽣效

[desktop-launcher]
icon=/usr/share/icons/hicolor/256x256/apps/chromium.png
# 图标路径

path=/usr/bin/chromium www.baidu.com
# 快捷启动命令

displayname=chromium
# 显⽰名称
```

### 2.5 待机及锁屏配置

Weston的超时待机时⻓可以在启动参数中配置,也可以在weston.ini的core段配置,如:

```text
# /etc/init.d/S49weston
start_weston()
{
  /usr/bin/weston --idle-time=0&  # 0为禁⽌待机，单位为秒
}
```

或者

```text
# /etc/xdg/weston/weston.ini

[core]
idle-time=10
```

Weston的锁屏可以在weston.ini的shell段配置,如:

```text
# /etc/xdg/weston/weston.ini

[shell]
locking=false
# 禁⽌锁屏

lockscreen-icon=/usr/share/icons/gnome/256x256/actions/lock.png
# 解锁按钮图案

lockscreen=/usr/share/backgrounds/gnome/Garden.jpg
# 锁屏界⾯背景
```

### 2.6 显示颜色格式配置

Buildroot SDK内Weston目前默认显示格式为ARGB8888,对于某些低性能平台,可以在weston.ini的core段配置为RGB565,如:

```text
# /etc/xdg/weston/weston.ini

[core]
gbm-format=rgb565
# xrgb8888|argb8888|rgb565|xrgb2101010
```

也可以在weston.ini的output段单独配置每个屏幕的显示格式,如:

```text
# /etc/xdg/weston/weston.ini

[output]
name=LVDS-1

gbm-format=rgb565
# xrgb8888|argb8888|rgb565|xrgb2101010
```

### 2.7 屏幕方向配置

Weston的屏幕显示方向可以在weston.ini的output段配置,如

```text
    # /etc/xdg/weston/weston.ini

    [output]
    name=LVDS-1

    transform=rotate-90
    # normal|rotate-90|rotate-180|rotate-270|flipped|flipped-90|flipped-180|flipped-270
```

如果需要动态配置屏幕方向,可以通过动态配置文件,如:

```text
echo "output:all:rotate90" > /tmp/.weston_drm.conf # 所有屏幕旋转90度
echo "output:eDP-1:rotate180" > /tmp/.weston_drm.conf # eDP-1旋转180度
```

### 2.8 分辨率及缩放配置

Weston的屏幕分辨率及缩放可以在weston.ini的output段配置,如:

```text
# /etc/xdg/weston/weston.ini

[output]
name=LVDS-1

mode=1280x800
# 需为屏幕⽀持的有效分辨率

scale=2
# 需为整数倍数，⽀持应⽤内部实现缩放
```

如需要缩放到特定分辨率(物理分辨率不变),可以通过WESTON_DRM_VIRTUAL_SIZE环境变量配置所有屏幕的大小,如:

```text
# /etc/profile.d/weston.sh
export WESTON_DRM_VIRTUAL_SIZE=1024x768
```

如果需要动态配置分辨率及缩放,可以通过动态配置文件,如:

```text
    echo "output:HDMI-A-1:mode=800x600" > /tmp/.weston_drm.conf # 修改HDMI-A-1分辨率为800x600
    echo "output:eDP-1:rect=<10,20,410,620>" > /tmp/.weston_drm.conf # eDP-1显⽰到(10,20)位置，⼤⼩缩放为400x600
    echo "output:HDMI-A-1:size=1920x1080" > /tmp/.weston_drm.conf # 缩放HDMI-A-1到1080p，物理分辨率不变
```

以上缩放时,如果硬件VOP显示模块不支持缩放,则需要依赖RGA处理。

### 2.9 冻结屏幕

在启动Weston时,开机logo到UI显示之间存在短暂切换黑屏。如需要防止黑屏,可以通过以下方式短暂冻结Weston屏幕内容:使用定制--warm-up运行参数在UI启动后开始显示

```text
# /etc/init.d/S49weston
start_weston()
{
  /usr/bin/weston --warm-up&
}
```

或者

```text
# /etc/init.d/S49weston
start_weston()
{
  export WESTON_FREEZE_DISPLAY=/tmp/.weston_freeze # 设置特殊配置⽂件路径
  touch /tmp/.weston_freeze # 冻结显⽰
  /usr/bin/weston&
  sleep 1 && rm /tmp/.weston_freeze& # 1秒后解冻
}
```

又或者

```text
# /etc/init.d/S49weston
start_weston()
{
  echo "output:all:freeze" > /tmp/.weston_drm.conf # 冻结显⽰
  /usr/bin/weston&
  ...
  sleep 1 && \
  echo "output:all:unfreeze" > /tmp/.weston_drm.conf& # 1秒后解冻
}
```

### 2.10 屏幕状态配置

DRM框架支持强制配置屏幕状态:

```text
echo on > /sys/class/drm/card0-HDMI-A-1/status # 强制HDMI-A-1为接⼊状态
#on|off|detect，detect为热拔插
```

如果需要更具体的动态屏幕状态配置,可以通过动态配置文件,如:

```text
    echo "output:DSI-1:off" > /tmp/.weston_drm.conf #关闭屏幕（⾮移除）
    echo "output:HDMI-A-1:freeze" > /tmp/.weston_drm.conf #冻结屏幕
    echo "output:eDP-1:on" > /tmp/.weston_drm.conf #开启屏幕
    echo "output:HDMI-A-1:state=on" > /tmp/.weston_drm.conf #强制接⼊（需要weston.ini配置屏幕模式）
    echo "output:DSI-1:state=off" > /tmp/.weston_drm.conf #强制移除
    echo "output:DSI-1:state=detect" > /tmp/.weston_drm.conf #热拔插检测
    echo "compositor:state:off" > /tmp/.weston_drm.conf #显⽰休眠
    echo "compositor:state:sleep" > /tmp/.weston_drm.conf #显⽰休眠，触屏唤醒
    echo "compositor:state:freeze" > /tmp/.weston_drm.conf #冻结显⽰
    echo "compositor:state:on" > /tmp/.weston_drm.conf #显⽰唤醒
```

### 2.11 多屏管理

Buildroot SDK的Weston支持多屏镜像同显、多屏异显、屏幕位置配置及热拔插等功能。镜像模式缩放或旋转时,如果硬件VOP显示模块不支持,则需要依赖RGA处理。相关配置通过环境变量设置,如:

```text
# /etc/profile.d/weston.sh
export WESTON_DRM_PRIMARY=HDMI-A-1 # 指定主显为HDMI-A-1
export WESTON_DRM_SINGLE_HEAD=1 # 强制单显
export WESTON_DRM_MIRROR=1 # 使⽤镜像模式（多屏同显），不设置此环境变量即为异显
export WESTON_DRM_KEEP_RATIO=1 # 镜像模式下缩放保持纵横⽐，不设置此变量即为强制全屏
export WESTON_DRM_HEAD_MODE=primary # 只使能主显
export WESTON_DRM_HEAD_MODE=internal # 只使能内置显⽰器
export WESTON_DRM_HEAD_MODE=external # 只使能外置显⽰器
export WESTON_DRM_HEAD_MODE=external-dual # 使能所有显⽰器，优先外置显⽰器
export WESTON_DRM_HEAD_FALLBACK=1 # 未匹配到显⽰器时，使能任意⼀个有效显⽰器
export WESTON_DRM_MASTER=1 # 允许关闭未使⽤的屏幕

export WESTON_OUTPUT_FLOW=horizontal # 默认⽔平排列
export WESTON_OUTPUT_FLOW=vertical # 默认垂直排列
export WESTON_OUTPUT_FLOW=same-as # 所有显⽰器默认位置(0,0)
```

也支持在weston.ini的output段单独禁用指定屏幕:

```text
# /etc/xdg/weston/weston.ini

[output]
name=LVDS-1

mode=off
# off|current|preferred|<WIDTHxHEIGHT@RATE>
```

也可以通过动态配置文件,如:

```text
echo "output:HDMI-A-1:pos=100,200" > /tmp/.weston_drm.conf # 设置HDMI显⽰位置
echo "output:HDMI-A-1:prefer" > /tmp/.weston_drm.conf # 设置应⽤默认显⽰HDMI上
echo "output:HDMI-A-1:primary" > /tmp/.weston_drm.conf # 设置主显为HDMI
echo "output:HDMI-A-1:pin" > /tmp/.weston_drm.conf # 尝试绑定应⽤到指定显⽰
```

### 2.12 输入设备配置

Weston服务默认需要至少一个输入设备,如无输入设备,则需要在weston.ini中的core段特殊设置:

```text
# /etc/xdg/weston/weston.ini

[core]
require-input=false
```

Weston中如存在多个屏幕,需求绑定把输入设备和屏幕,则可通过udev规则配置WL_OUTPUT,如:

```text
# /lib/udev/rules.d/99-goodix-ts.rules
ATTRS{name}=="goodix-ts", ENV{WL_OUTPUT}="HDMI-A-1"
```

或者配置WL_SEAT:

```text
# /lib/udev/rules.d/99-goodix-ts.rules
ATTRS{name}=="goodix-ts", ENV{WL_SEAT}="seat1"
```

```text
# /etc/xdg/weston/weston.ini

[output]
name=LVDS-1

seat=seat1
```

或者通过动态配置文件,如:

```text
echo "output:HDMI-A-1:input=*" > /tmp/.weston_drm.conf # 匹配所有设备
echo "output:HDMI-A-1:input=" > /tmp/.weston_drm.conf # 禁⽤输⼊
echo "output:HDMI-A-1:input=event6" > /tmp/.weston_drm.conf
echo "output:HDMI-A-1:input=goodix*" > /tmp/.weston_drm.conf
echo "output:HDMI-A-1:input=goodix-ts" > /tmp/.weston_drm.conf
```

输入设备的vendor id、product id及设备名可通过evtest工具查询,如:

```text
# evtest /dev/input/event8 | head -3
Input driver version is 1.0.1
Input device ID: bus 0x18 vendor 0xdead product 0xbeef version 0x28bb
Input device name: "goodix-ts"
```

### 2.13 触屏校准

Weston如果需要校准触屏,可以通过WESTON_TOUCH_CALIBRATION环境变量,如:

```text
    # /etc/profile.d/weston.sh
    export WESTON_TOUCH_CALIBRATION="1.013788 0.0 -0.061495 0.0 1.332709 -0.276154"
```

或者通过udev规则配置,如:

```text
    # /lib/udev/rules.d/99-goodix-ts.rules
    ATTRS{name}=="goodix-ts", ENV{LIBINPUT_CALIBRATION_MATRIX}="1.013788 0.0 -0.061495 0.0 1.332709 -0.276154"
```

或者通过动态配置文件,如:

```text
echo "calibration:event9:-1 0 1 0 -1 1" > /tmp/.weston_drm.conf
echo "calibration:goodix-ts:1 0 0 0 -1 1" > /tmp/.weston_drm.conf
echo "calibration:event9:restore" > /tmp/.weston_drm.conf # 恢复原校准数据
echo "calibration:goodix-ts:clear" > /tmp/.weston_drm.conf # 删除所有校准
```

校准参数的获取可以使用Weston校准工具: weston-calibrator,工具运行后会生成若干随机点,依次点击后输出校准参数,如:Final calibration values: 1.013788 0.0 -0.061495 0.0 1.332709 -0.276154也可以直接使用Weston提供的另一个校准工具:weston-touch-calibrator,需要配置:

```text
# /etc/xdg/weston/weston.ini

[libinput]
touchscreen_calibrator=true
calibration_helper=/bin/weston-calibration-helper.sh
```

### 2.14 无GPU平台配置

SDK中的Weston默认使用GPU进行渲染合成加速,对于无GPU或GPU性能不足的平台,也可以选用RGA替代进行加速。具体配置需要Buildroot SDK开启BR2_PACKAGE_LINUX_RGA以及BR2_PACKAGE_WESTON_DEFAULT_PIXMAN。

### 2.15 ARM AFBC modifier配置

当芯片支持AFBC时,SDK中的Weston支持使用基于GPU的AFBC压缩格式进行显示。具体配置:

```text
# /etc/profile.d/weston.sh
# export WESTON_DISABLE_ATOMIC=1
export WESTON_ALLOW_GBM_MODIFIERS=1
```

### 2.16 降低UI分辨率

当UI性能或DDR带宽不足时,可以降低UI的分辨率。具体配置:

```text
echo "output:HDMI-A-1:down-scale=0.5" >> /tmp/.weston_drm.conf # UI缩放0.5倍
```

## 相关原稿链接

[ArmSoM Docs](https://docs.armsom.org/)

[https://github.com/JeffyCN/weston](https://github.com/JeffyCN/weston)

[https://fossies.org/linux/weston/man/weston.ini.man](https://fossies.org/linux/weston/man/weston.ini.man)

{% endraw %}
