---
title: "Rockchip Buildroot Weston Display and Input Configuration"
description: "Rockchip Buildroot Weston Display and Input Configuration — V1.4.5"
excerpt: "Rockchip Buildroot Weston Display and Input Configuration"
translation_key: "190-rockchip-buildroot-weston"
slug: "190-rockchip-buildroot-weston"
lang: "en"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: [ArmSoM, Rockchip, Linux]
---

{% raw %}

# Rockchip Buildroot Weston Display and Input Configuration

ArmSoM platform reference based on the supplied Chinese and English Rockchip sources. Match the actual board, SoC, SDK/BSP, kernel and peripherals individually; this does not claim support for every ArmSoM board. Source examples and measurements are not ArmSoM tests. No commands or hardware tests were executed.

Applies to customized Weston in Rockchip Buildroot SDK; these extension variables are not guaranteed in upstream Weston.

Both originals V1.4.5; all configurations through §2.16 retained. No standalone technical figures. Only PDF wrapping in commands, matrices and comments is repaired; parameter values unchanged. Repeated exports of the same variable demonstrate alternatives, not an unqualified script to run wholesale. Functions containing ellipses are incomplete examples.

CN/EN difference: §2.16 uses `>> /tmp/.weston_drm.conf` (append) in Chinese and `> /tmp/.weston_drm.conf` (overwrite) in English. Each is retained; RU/DE follow English. Check the actual SDK dynamic-configuration parser.

## 1. Introduction

### 1.1 Overview

Weston is the official implementation reference of Wayland open source display protocol, and Weston drm back-end is used in Rockchip Buildroot SDK by default. The latest custom Weston code can be obtained from GitHub: https://github.com/JeffyCN/weston

### 1.2 Configuration Methods

There are multiple ways to configure Rockchip Buildroot SDK Weston: a. Command line options That is, the options of the command when starting Weston, such as weston --tty=2. It's located in /etc/init.d/S49weston, corresponding to the location of SDK code: buildroot/package/weston/S49weston. b. weston.ini configuration file It's located in /etc/xdg/weston/weston.ini and /etc/xdg/weston/weston.ini.d/, corresponding to the location of SDK code: buildroot/board/rockchip/common/base/etc/xdg/weston/weston.ini. Please refer to: https://fossies.org/linux/weston/man/weston.ini.man. c. Special environment variables Generally, these environment variables are set in /etc/profile.d/weston.sh, corresponding to the location of SDK code: buildroot/package/weston/weston.sh. d. Dynamic configuration file For drm back-end, Buildroot SDK Weston provides some dynamic configuration support, the default path is /tmp/.weston_drm.conf, which can be specified by the environment variable WESTON_DRM_CONFIG. e. udev rules Part of the configurations of input devices in Weston should be set by udev rules .

## 2. Configuration

### 2.1 Identify screens

The Weston is using output(head)'s name to identify screens. The names can be found through Weston's startup log:

```text
# weston&
[02:11:29.746] DRM: head 'DSI-1' found ...
```

### 2.2 Cursor Configuration

Weston supports setting the theme and size of cursor in the shell section of weston.ini configuration file, for example:

```text
    # /etc/xdg/weston/weston.ini

    [shell]
    cursor-theme=whiteglass # Buildroot SDK supports comix/obsidian/xcursor/xcursor-transparent cursor theme packages.
    cursor-size=24
```

### 2.3 Status Bar Configuration

Weston supports setting the background color, position and scale of status bar in the shell section of weston.ini configuration file, and setting the quick start program in the launcher section, for example:

```text
# /etc/xdg/weston/weston.ini

[shell]
panel-color=0x90ff0000
# the color format is ARGB8888

panel-position=bottom
# top|bottom|left|right|none,none is disable

panel-scale=4
# scale up by 4

[launcher]
icon=/usr/share/icons/gnome/24x24/apps/utilities-terminal.png
# icon path

path=/usr/bin/gnome-terminal
# quick start command
```

### 2.4 Background Configuration

Weston supports setting the background pattern and color in the shell section of the weston.ini configuration file, and setting the quick start program in the desktop-launcher section, such as

```text
# /etc/xdg/weston/weston.ini

[shell]
background-image=/usr/share/backgrounds/gnome/Aqua.jpg
# Background pattern (wallpaper) absolute path

background-type=tile
# scale|scale-crop|tile

background-color=0xff002244
# The color format is ARGB8888, effective when no background pattern is set

[desktop-launcher]
icon=/usr/share/icons/hicolor/256x256/apps/chromium.png
# icon path

path=/usr/bin/chromium www.baidu.com
# quick start command

displayname=chromium
# display name
```

### 2.5 Idle Time and Lock Screen Configuration

The idle timeout of Weston can be configured in the command options or in the core section of weston.ini, such as:

```text
# /etc/init.d/S49weston
start_weston()
{
  /usr/bin/weston --idle-time=0&  # 0 means idle mode is disabled, in seconds
}
```

Or

```text
# /etc/xdg/weston/weston.ini

[core]
idle-time=10
```

Lock screen of Weston can be configured in the shell section of weston.ini, such as:

```text
# /etc/xdg/weston/weston.ini

[shell]
locking=false
# lock screen is disabled

lockscreen-icon=/usr/share/icons/gnome/256x256/actions/lock.png
# unlock button icon

lockscreen=/usr/share/backgrounds/gnome/Garden.jpg
# background of lock screen
```

### 2.6 Color Format Configuration

The default display format of Weston in the Buildroot SDK is ARGB8888. For some low- performance platforms, you can configure RGB565 in the core section in the weston.ini, such as:

```text
# /etc/xdg/weston/weston.ini

[core]
gbm-format=rgb565
# xrgb8888|argb8888|rgb565|xrgb2101010
```

You can also configure the display format of each screen individually in the output section of weston.ini, such as:

```text
# /etc/xdg/weston/weston.ini

[output]
name=LVDS-1

gbm-format=rgb565
# xrgb8888|argb8888|rgb565|xrgb2101010
```

### 2.7 Display Orientation Configuration

Display orientation of screens can be configured in the output section of weston.ini, such as

```text
    # /etc/xdg/weston/weston.ini

    [output]
    name=LVDS-1

    transform=rotate-90
    # normal|rotate-90|rotate-180|rotate-270|flipped|flipped-90|flipped-180|flipped-270
```

If you want to configure the orientation dynamically, the dynamic configuration file can be used, such as:

```text
    echo "output:all:rotate90" > /tmp/.weston_drm.conf # All screens rotate 90 degrees
    echo "output:eDP-1:rotate180" > /tmp/.weston_drm.conf # eDP-1 rotates 180 degrees
```

### 2.8 Resolution and Scale Configuration

Screen's resolution and scale of Weston can be configured in the output section of weston.ini, such as:

```text
# /etc/xdg/weston/weston.ini

[output]
name=LVDS-1

mode=1280x800
# should be an effective resolution supported by the screen

scale=2
# value must be an integer, support application level scaling
```

If you want to scale to a specific resolution(without changing the physical resolution), you can configure it for all screens through WESTON_DRM_VIRTUAL_SIZE environment variable, such as:

```text
# /etc/profile.d/weston.sh
export WESTON_DRM_VIRTUAL_SIZE=1024x768
```

If you want to configure resolution and scaling dynamically, the dynamic configuration file can be used, for example:

```text
    echo "output:HDMI-A-1:mode=800x600" > /tmp/.weston_drm.conf # change the resolution of HDMI-A-1 to 800x600
    echo "output:eDP-1:rect=<10,20,410,620>" > /tmp/.weston_drm.conf # eDP-1 display to the position of (10,20), the size is scaled to 400x600
    echo "output:HDMI-A-1:size=1920x1080" > /tmp/.weston_drm.conf # HDMI-A-1 scale to 1080p, the physical resolution is unchanged.
```

When the VOP hardware doesn't support scaling, these kinds of scale requires Rockchip's RGA 2D acceleration.

### 2.9 Freeze the Screen

When Weston is started, there will be a black screen that switches between boot logo and UI display temporarily. If you want to prevent this black screen, you can freeze the Weston screen content temporarily through the following ways: Add --warm-up to Weston's command options

```text
# /etc/init.d/S49weston
start_weston()
{
  /usr/bin/weston --warm-up&
}
```

Or

```text
    # /etc/init.d/S49weston
    start_weston()
    {
      export WESTON_FREEZE_DISPLAY=/tmp/.weston_freeze # Set a special configuration file path
      touch /tmp/.weston_freeze # Freeze the display
      /usr/bin/weston&
      sleep 1 && rm /tmp/.weston_freeze& # unfreeze after 1 second
    }
```

Or

```text
    # /etc/init.d/S49weston
    start_weston()
    {
      echo "output:all:freeze" > /tmp/.weston_drm.conf # Freeze the display
      /usr/bin/weston&
      ...
      sleep 1 && \
      echo "output:all:unfreeze" > /tmp/.weston_drm.conf& # unfreeze  after 1 second
    }
```

### 2.10 Screen Status Configuration

The DRM framework supports setting force status for screens:

```text
echo on > /sys/class/drm/card0-HDMI-A-1/status # Force HDMI-A-1 connected
#on|off|detect, detect means hot-plug
```

For more specific screen status configuration, the dynamic configuration file can be used, for example:

```text
    echo "output:DSI-1:off" > /tmp/.weston_drm.conf # Turn off screen
    echo "output:HDMI-A-1:freeze" > /tmp/.weston_drm.conf # Freeze screen
    echo "output:eDP-1:on" > /tmp/.weston_drm.conf # Turn on screen
    echo "output:HDMI-A-1:state=on" > /tmp/.weston_drm.conf #Force connected(should set screen mode on in weston.ini)
    echo "output:DSI-1:state=off" > /tmp/.weston_drm.conf #Force disconnected
    echo "output:DSI-1:state=detect" > /tmp/.weston_drm.conf #Use hot-plug
    echo "compositor:state:off" > /tmp/.weston_drm.conf # Turn off display
    echo "compositor:state:freeze" > /tmp/.weston_drm.conf # Freeze display
    echo "compositor:state:sleep" > /tmp/.weston_drm.conf # Turn off display and touch to wake
    echo "compositor:state:on" > /tmp/.weston_drm.conf # Turn on display
```

### 2.11 Multi-screen Configuration

The Buildroot SDK Weston supports mirror displays, extend displays, screen position configuration and hot plug functions. For mirrored display, it would try to use Rockchip's RGA 2D acceleration when the VOP hardware doesn't support scaling or rotating. Those configurations can be set by environment variables, for example:

```text
    # /etc/profile.d/weston.sh
    export WESTON_DRM_PRIMARY=HDMI-A-1 # Specify HDMI-A-1 as primary monitor
    export WESTON_DRM_SINGLE_HEAD=1 # Force using single monitor
    export WESTON_DRM_MIRROR=1 # In mirror mode (multi-screen with the same display), without setting this environment variable will be with different display
    export WESTON_DRM_KEEP_RATIO=1 # In mirror mode, scaling maintains the aspect ratio, without setting this variable will be full screen by force
    export WESTON_DRM_HEAD_MODE=primary # Only enable primary monitor
    export WESTON_DRM_HEAD_MODE=internal # Only enable internal monitors
    export WESTON_DRM_HEAD_MODE=external # Only enable external monitors
    export WESTON_DRM_HEAD_MODE=external-dual # Enable all monitors, and prefer the external ones
    export WESTON_DRM_HEAD_FALLBACK=1 # Fallback to any available monitor when none matched
    export WESTON_DRM_MASTER=1 # Allow disabling unused monitors

    export WESTON_OUTPUT_FLOW=horizontal # Laying outputs horizontally by default
    export WESTON_OUTPUT_FLOW=vertical # Laying outputs vertically by default
    export WESTON_OUTPUT_FLOW=same-as # Laying outputs at (0,0) by default
```

It also supports disabling the specified screen individually in the output section of weston.ini:

```text
# /etc/xdg/weston/weston.ini

[output]
name=LVDS-1

mode=off
# off|current|preferred|<WIDTHxHEIGHT@RATE>
```

The dynamic configuration file can be used, for example:

```text
    echo "output:HDMI-A-1:pos=100,200" > /tmp/.weston_drm.conf # Set HDMI's position
    echo "output:HDMI-A-1:prefer" > /tmp/.weston_drm.conf # Show apps on HDMI by default
    echo "output:HDMI-A-1:primary" > /tmp/.weston_drm.conf # Specify HDMI as primary
    echo "output:HDMI-A-1:pin" > /tmp/.weston_drm.conf # Try to pin later views to the screen
```

### 2.12 Configuration of Input Devices

The Weston service requires at least one input device by default. If there is no input device, the special settings in the core section of weston.ini is needed:

```text
# /etc/xdg/weston/weston.ini

[core]
require-input=false
```

If there are multiple screens in Weston, you can bind input devices to screens through udev rules's WL_OUTPUT env, such as:

```text
# /lib/udev/rules.d/99-goodix-ts.rules
ATTRS{name}=="goodix-ts", ENV{WL_OUTPUT}="HDMI-A-1"
```

Or WL_SEAT env, such as:

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

Or use the dynamic configuration file, for example:

```text
echo "output:HDMI-A-1:input=*" > /tmp/.weston_drm.conf # Match all devices
echo "output:HDMI-A-1:input=" > /tmp/.weston_drm.conf # Disallow all devices
echo "output:HDMI-A-1:input=event6" > /tmp/.weston_drm.conf
echo "output:HDMI-A-1:input=goodix*" > /tmp/.weston_drm.conf
echo "output:HDMI-A-1:input=goodix-ts" > /tmp/.weston_drm.conf
```

The input device's vendor ID, product ID and device name can be obtained by evtest tool:

```text
# evtest /dev/input/event8 | head -3
Input driver version is 1.0.1
Input device ID: bus 0x18 vendor 0xdead product 0xbeef version 0x28bb
Input device name: "goodix-ts"
```

### 2.13 Calibration of Input Devices

If you need to calibrate the touch screen, you can use WESTON_TOUCH_CALIBRATION environment, such as:

```text
    # /etc/profile.d/weston.sh
    export WESTON_TOUCH_CALIBRATION="1.013788 0.0 -0.061495 0.0 1.332709 -0.276154"
```

Or set in udev rules, such as:

```text
    # /lib/udev/rules.d/99-goodix-ts.rules
    ATTRS{name}=="goodix-ts", ENV{LIBINPUT_CALIBRATION_MATRIX}="1.013788 0.0 -0.061495 0.0 1.332709 -0.276154"
```

Or use the dynamic configuration file, for example:

```text
    echo "calibration:event9:-1 0 1 0 -1 1" > /tmp/.weston_drm.conf
    echo "calibration:goodix-ts:1 0 0 0 -1 1" > /tmp/.weston_drm.conf
    echo "calibration:event9:restore" > /tmp/.weston_drm.conf # Restore the previous setting
    echo "calibration:goodix-ts:clear" > /tmp/.weston_drm.conf # Clear all settings
```

The calibration parameters can be obtained by Weston calibration tool: weston-calibrator. After running this tool, a number of random points will be generated, and then click them in sequence to output the calibration parameters, such as: Final calibration values: 1.013788 0.0 -0.061495 0.0 1.332709 -0.276154

Or you can use the new Weston touch calibrator: weston-touch-calibrator, which needs:

```text
# /etc/xdg/weston/weston.ini

[libinput]
touchscreen_calibrator=true
calibration_helper=/bin/weston-calibration-helper.sh
```

### 2.14 Configuration on the Platform without GPU

The Weston in the SDK uses GPU for render acceleration by default. For platforms without GPUs or GPU is not powerful enough, Rockchip RGA 2D acceleration can also be used instead. The detailed configuration requires to enable BR2_PACKAGE_LINUX_RGA and BR2_PACKAGE_WESTON_DEFAULT_PIXMAN in the Buildroot SDK.

### 2.15 ARM AFBC modifier

For chips which support AFBC, the Weston in the SDK support using GPU based ARM AFBC compressed format for displaying.

```text
# /etc/profile.d/weston.sh
# export WESTON_DISABLE_ATOMIC=1
export WESTON_ALLOW_GBM_MODIFIERS=1
```

### 2.16 Lower UI resolution

When having UI performance or DDR baudrate issues, it's possible to lower UI resolution:

```text
echo "output:HDMI-A-1:down-scale=0.5" > /tmp/.weston_drm.conf
```

## Source reference links

[ArmSoM Docs](https://docs.armsom.org/)

[https://github.com/JeffyCN/weston](https://github.com/JeffyCN/weston)

[https://fossies.org/linux/weston/man/weston.ini.man](https://fossies.org/linux/weston/man/weston.ini.man)

{% endraw %}
