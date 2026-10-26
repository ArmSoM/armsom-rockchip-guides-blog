---
title: "Rockchip Buildroot Weston: Anzeige- und Eingabekonfiguration"
description: "Rockchip Buildroot Weston: Anzeige- und Eingabekonfiguration — V1.4.5"
excerpt: "Rockchip Buildroot Weston: Anzeige- und Eingabekonfiguration"
translation_key: "190-rockchip-buildroot-weston"
slug: "190-rockchip-buildroot-weston"
lang: "de"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: [ArmSoM, Rockchip, Linux]
---

{% raw %}

# Rockchip Buildroot Weston: Anzeige- und Eingabekonfiguration

ArmSoM-Plattformreferenz anhand der bereitgestellten chinesischen und englischen Rockchip-Quellen. Konkrete Platine, SoC, SDK/BSP, Kernel und Peripherie einzeln abgleichen; keine allgemeine Unterstützung aller ArmSoM-Platinen. Quellbeispiele und Messwerte sind keine ArmSoM-Tests. Keine Befehle oder Hardwaretests ausgeführt.

Gilt für angepasstes Weston im Rockchip Buildroot SDK; Upstream-Weston unterstützt diese Erweiterungsvariablen nicht zwingend.

Beide Originale V1.4.5; alle Einstellungen bis §2.16 erhalten. Keine separaten Abbildungen. Nur PDF-Umbrüche in Befehlen, Matrizen und Kommentaren repariert; Werte unverändert. Wiederholte exports derselben Variable zeigen Alternativen, kein ungeprüft komplett ausführbares Skript. Funktionen mit Auslassungen sind unvollständig.

CN/EN-Unterschied: §2.16 verwendet chinesisch `>> /tmp/.weston_drm.conf` (Anhängen), englisch `> /tmp/.weston_drm.conf` (Überschreiben). Beides bleibt erhalten; RU/DE folgen Englisch. Den dynamischen Konfigurationsparser des SDK prüfen.

## 1. Einführung

### 1.1 Überblick

Weston ist die Referenzimplementierung des offenen Anzeigeprotokolls Wayland. Rockchip Buildroot SDK verwendet standardmäßig den DRM-Backend von Weston. Die Quelle nennt dieses Repository der angepassten Weston-Version: https://github.com/JeffyCN/weston

### 1.2 Konfigurationsmöglichkeiten

Rockchip Buildroot SDK Weston lässt sich auf mehreren Wegen konfigurieren:

a. Startoptionen der Befehlszeile, etwa `weston --tty=2`. Skript: /etc/init.d/S49weston; im SDK: buildroot/package/weston/S49weston.

b. weston.ini: /etc/xdg/weston/weston.ini und /etc/xdg/weston/weston.ini.d/; im SDK: buildroot/board/rockchip/common/base/etc/xdg/weston/weston.ini. Referenz: https://fossies.org/linux/weston/man/weston.ini.man.

c. Besondere Umgebungsvariablen, üblicherweise in /etc/profile.d/weston.sh; im SDK: buildroot/package/weston/weston.sh.

d. Dynamische DRM-Backend-Konfiguration: standardmäßig /tmp/.weston_drm.conf, mit WESTON_DRM_CONFIG umstellbar.

e. udev-Regeln: Einige Weston-Eingabegeräteeinstellungen erfolgen über udev.

## 2. Einstellungen

### 2.1 Bildschirme identifizieren

Weston identifiziert Bildschirme über den Namen von output(head). Die Namen stehen im Weston-Startprotokoll:

```text
# weston&
[02:11:29.746] DRM: head 'DSI-1' found ...
```

### 2.2 Mauszeiger

Thema und Größe des Mauszeigers werden im shell-Abschnitt der weston.ini gesetzt, beispielsweise:

```text
    # /etc/xdg/weston/weston.ini

    [shell]
    cursor-theme=whiteglass # Buildroot SDK supports comix/obsidian/xcursor/xcursor-transparent cursor theme packages.
    cursor-size=24
```

### 2.3 Statusleiste

Hintergrundfarbe, Position und Skalierung der Statusleiste werden unter shell, Schnellstartprogramme unter launcher in weston.ini gesetzt:

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

### 2.4 Hintergrund

Hintergrundbild und -farbe werden unter shell, Schnellstartprogramme unter desktop-launcher in weston.ini eingestellt:

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

### 2.5 Leerlauf und Bildschirmsperre

Westons Leerlaufzeit wird per Startoption oder im core-Abschnitt der weston.ini festgelegt:

```text
# /etc/init.d/S49weston
start_weston()
{
  /usr/bin/weston --idle-time=0&  # 0 means idle mode is disabled, in seconds
}
```

Oder:

```text
# /etc/xdg/weston/weston.ini

[core]
idle-time=10
```

Die Weston-Bildschirmsperre wird im shell-Abschnitt der weston.ini konfiguriert:

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

### 2.6 Farbformat

Weston im Buildroot SDK verwendet standardmäßig ARGB8888. Auf leistungsschwächeren Plattformen kann RGB565 unter core in weston.ini gewählt werden:

```text
# /etc/xdg/weston/weston.ini

[core]
gbm-format=rgb565
# xrgb8888|argb8888|rgb565|xrgb2101010
```

Das Format jedes Bildschirms lässt sich separat unter output in weston.ini festlegen:

```text
# /etc/xdg/weston/weston.ini

[output]
name=LVDS-1

gbm-format=rgb565
# xrgb8888|argb8888|rgb565|xrgb2101010
```

### 2.7 Bildschirmausrichtung

Die Ausrichtung wird unter output in weston.ini gesetzt:

```text
    # /etc/xdg/weston/weston.ini

    [output]
    name=LVDS-1

    transform=rotate-90
    # normal|rotate-90|rotate-180|rotate-270|flipped|flipped-90|flipped-180|flipped-270
```

Für dynamische Ausrichtungsänderungen die dynamische Konfigurationsdatei verwenden:

```text
    echo "output:all:rotate90" > /tmp/.weston_drm.conf # All screens rotate 90 degrees
    echo "output:eDP-1:rotate180" > /tmp/.weston_drm.conf # eDP-1 rotates 180 degrees
```

### 2.8 Auflösung und Skalierung

Auflösung und Skalierung werden unter output in weston.ini eingestellt:

```text
# /etc/xdg/weston/weston.ini

[output]
name=LVDS-1

mode=1280x800
# should be an effective resolution supported by the screen

scale=2
# value must be an integer, support application level scaling
```

Um alle Bildschirme ohne Änderung der physischen Auflösung auf eine bestimmte Größe zu skalieren, WESTON_DRM_VIRTUAL_SIZE setzen:

```text
# /etc/profile.d/weston.sh
export WESTON_DRM_VIRTUAL_SIZE=1024x768
```

Für dynamische Auflösungs- und Skalierungsänderungen die dynamische Konfiguration verwenden:

```text
    echo "output:HDMI-A-1:mode=800x600" > /tmp/.weston_drm.conf # change the resolution of HDMI-A-1 to 800x600
    echo "output:eDP-1:rect=<10,20,410,620>" > /tmp/.weston_drm.conf # eDP-1 display to the position of (10,20), the size is scaled to 400x600
    echo "output:HDMI-A-1:size=1920x1080" > /tmp/.weston_drm.conf # HDMI-A-1 scale to 1080p, the physical resolution is unchanged.
```

Wenn VOP keine Hardware-Skalierung unterstützt, benötigen diese Skalierungsarten Rockchips RGA-2D-Beschleunigung.

### 2.9 Bildschirminhalt einfrieren

Beim Weston-Start erscheint zwischen Bootlogo und Oberfläche kurz ein schwarzer Bildschirm. Vorübergehendes Einfrieren des Weston-Inhalts kann dies auf folgende Weise vermeiden. --warm-up zu den Startoptionen hinzufügen:

```text
# /etc/init.d/S49weston
start_weston()
{
  /usr/bin/weston --warm-up&
}
```

Oder:

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

Oder:

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

### 2.10 Bildschirmstatus

DRM unterstützt das Erzwingen des Bildschirmstatus:

```text
echo on > /sys/class/drm/card0-HDMI-A-1/status # Force HDMI-A-1 connected
#on|off|detect, detect means hot-plug
```

Detailliertere Einstellungen erfolgen über die dynamische Datei:

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

### 2.11 Mehrere Bildschirme

Weston im Buildroot SDK unterstützt Spiegelung, erweiterten Desktop, Bildschirmpositionierung und Hotplug. Beim Spiegeln wird RGA 2D verwendet, wenn VOP Skalierung oder Rotation nicht unterstützt. Die Einstellungen erfolgen über Umgebungsvariablen:

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

Ein einzelner Bildschirm lässt sich unter output in weston.ini deaktivieren:

```text
# /etc/xdg/weston/weston.ini

[output]
name=LVDS-1

mode=off
# off|current|preferred|<WIDTHxHEIGHT@RATE>
```

Auch dynamische Konfiguration ist möglich:

```text
    echo "output:HDMI-A-1:pos=100,200" > /tmp/.weston_drm.conf # Set HDMI's position
    echo "output:HDMI-A-1:prefer" > /tmp/.weston_drm.conf # Show apps on HDMI by default
    echo "output:HDMI-A-1:primary" > /tmp/.weston_drm.conf # Specify HDMI as primary
    echo "output:HDMI-A-1:pin" > /tmp/.weston_drm.conf # Try to pin later views to the screen
```

### 2.12 Eingabegeräte

Weston benötigt standardmäßig mindestens ein Eingabegerät. Fehlt dieses, ist eine besondere Einstellung unter core in weston.ini nötig:

```text
# /etc/xdg/weston/weston.ini

[core]
require-input=false
```

Bei mehreren Bildschirmen lässt sich ein Eingabegerät über WL_OUTPUT in einer udev-Regel einem Bildschirm zuweisen:

```text
# /lib/udev/rules.d/99-goodix-ts.rules
ATTRS{name}=="goodix-ts", ENV{WL_OUTPUT}="HDMI-A-1"
```

Oder über WL_SEAT:

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

Oder über die dynamische Konfiguration:

```text
echo "output:HDMI-A-1:input=*" > /tmp/.weston_drm.conf # Match all devices
echo "output:HDMI-A-1:input=" > /tmp/.weston_drm.conf # Disallow all devices
echo "output:HDMI-A-1:input=event6" > /tmp/.weston_drm.conf
echo "output:HDMI-A-1:input=goodix*" > /tmp/.weston_drm.conf
echo "output:HDMI-A-1:input=goodix-ts" > /tmp/.weston_drm.conf
```

Vendor ID, Product ID und Gerätename lassen sich mit evtest ermitteln:

```text
# evtest /dev/input/event8 | head -3
Input driver version is 1.0.1
Input device ID: bus 0x18 vendor 0xdead product 0xbeef version 0x28bb
Input device name: "goodix-ts"
```

### 2.13 Eingabegeräte kalibrieren

Zur Touchscreen-Kalibrierung WESTON_TOUCH_CALIBRATION verwenden:

```text
    # /etc/profile.d/weston.sh
    export WESTON_TOUCH_CALIBRATION="1.013788 0.0 -0.061495 0.0 1.332709 -0.276154"
```

Alternativ eine udev-Regel:

```text
    # /lib/udev/rules.d/99-goodix-ts.rules
    ATTRS{name}=="goodix-ts", ENV{LIBINPUT_CALIBRATION_MATRIX}="1.013788 0.0 -0.061495 0.0 1.332709 -0.276154"
```

Alternativ die dynamische Konfiguration:

```text
    echo "calibration:event9:-1 0 1 0 -1 1" > /tmp/.weston_drm.conf
    echo "calibration:goodix-ts:1 0 0 0 -1 1" > /tmp/.weston_drm.conf
    echo "calibration:event9:restore" > /tmp/.weston_drm.conf # Restore the previous setting
    echo "calibration:goodix-ts:clear" > /tmp/.weston_drm.conf # Clear all settings
```

Die Parameter liefert weston-calibrator: Das Werkzeug zeigt zufällige Punkte, die nacheinander berührt werden. Beispielausgabe: `Final calibration values: 1.013788 0.0 -0.061495 0.0 1.332709 -0.276154`.

Alternativ kann der neue weston-touch-calibrator verwendet werden; dafür wird Folgendes benötigt:

```text
# /etc/xdg/weston/weston.ini

[libinput]
touchscreen_calibrator=true
calibration_helper=/bin/weston-calibration-helper.sh
```

### 2.14 Plattform ohne GPU

Weston im SDK beschleunigt das Rendering standardmäßig per GPU. Fehlt eine GPU oder ist sie zu langsam, kann Rockchip RGA 2D eingesetzt werden. Dazu BR2_PACKAGE_LINUX_RGA und BR2_PACKAGE_WESTON_DEFAULT_PIXMAN im Buildroot SDK aktivieren.

### 2.15 ARM-AFBC-Modifier

Auf AFBC-fähigen Chips unterstützt Weston im SDK die Anzeige im GPU-basierten komprimierten ARM-AFBC-Format.

```text
# /etc/profile.d/weston.sh
# export WESTON_DISABLE_ATOMIC=1
export WESTON_ALLOW_GBM_MODIFIERS=1
```

### 2.16 UI-Auflösung verringern

Bei Problemen mit UI-Leistung oder DDR-Bandbreite lässt sich die UI-Auflösung verringern:

```text
echo "output:HDMI-A-1:down-scale=0.5" > /tmp/.weston_drm.conf
```

## Quellverweise

[ArmSoM Docs](https://docs.armsom.org/)

[https://github.com/JeffyCN/weston](https://github.com/JeffyCN/weston)

[https://fossies.org/linux/weston/man/weston.ini.man](https://fossies.org/linux/weston/man/weston.ini.man)

{% endraw %}
