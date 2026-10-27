---
title: "Rockchip Buildroot: Entwicklerhandbuch"
description: "Rockchip Buildroot: Entwicklerhandbuch — V1.0.0"
excerpt: "Rockchip Buildroot: Entwicklerhandbuch"
translation_key: "204-rockchip-buildroot"
slug: "204-rockchip-buildroot"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, Buildroot, Linux]
---

{% raw %}

# Rockchip Buildroot: Entwicklerhandbuch

ArmSoM-Plattformreferenz, Quelle V1.0.0. Beschrieben wird das angepasste Rockchip Buildroot SDK, keine allgemeine Unterstützung derselben Erweiterungen in Upstream-Buildroot/Weston oder auf allen ArmSoM-Platinen. SoC, Platine, SDK/BSP, Kernel, Anzeige und Eingabe abgleichen; eine Kernelversion fehlt in der Quelle. Keine ArmSoM-Messwerte; Befehle und Hardwaretests wurden nicht ausgeführt.

Beide Quellen sind V1.0.0; alle 16 Kapitel bleiben erhalten. ZH verwendet drei chinesische, EN/RU/DE drei englische Abbildungen. SDK-Daten und Buildroot-Jahre in der Tabelle erscheinen widersprüchlich und bleiben unverändert. Die uClibc-Beschränkung in §4.1 ist eine historische Quellaussage; das SDK prüfen. Im export-Beispiel aus §6 fehlt das Zuweisungszeichen: eine dokumentierte Quellauffälligkeit, kein direkt ausführbarer Befehl. §8 nennt sowohl foo-barboo als auch foo-bar_boo, §14.7 output:eDP-1::rotate180 mit doppeltem Doppelpunkt; den tatsächlichen Parser prüfen.

Buildroot automatisiert das Cross-Kompilieren vollständiger Embedded-Linux-Systeme. Rockchip integriert Chip-BSP-Einstellungen, Hardwarebeschleunigung und angepasste Drittanbieterpakete für weitere Entwicklungen. Die Tabelle zeigt den Quellenstand, keine ArmSoM-Supportzusage.

| Buildroot-Version | SDK-Datum (Quelle) | Laut Quelle geprüfte Chips |
| --- | --- | --- |
| 2021.11 | 2018-06-20 | RK3588, RK356X, RK3399, RK3326/PX30/RK3358, RK3308, RK3399, RK3288, RK312X, RK3036 |
| 2018.02 | 2022-01-15 | RK356X, RK3399, RK3326/PX30/RK3358, RK3308, RK3399, RK3288, RK312X, RK3036, RK3399PRO, RK1808, RK1806, RV1126/RV1109, RK3328 |

## 1. Downloadmechanismus für Buildroot-Drittanbieterpakete

Das SDK integriert einen Downloadmechanismus für Buildroot-Drittanbieterpakete. Die flexiblere Variante ergänzt das ursprüngliche dl um ein archives-Verzeichnis mit vorab gespeicherten Paketen. Ist Google nicht erreichbar, wird auf den chinesischen kgithub-Spiegel umgeschaltet. Vorrang hat die im mk-Skript angegebene Quelle, danach folgen die Spiegel aus mk und defconfig und schließlich die offizielle Ersatzquelle. Im offiziellen Baum werden die meisten Quellen mit wget bezogen; ein kleinerer Teil stammt aus den jeweiligen git-, mercurial- oder svn-Repositories.

## 2. Umgebungsvariablen

Im SDK-Verzeichnis:

```text
source buildroot/envsetup.sh <config_name>
```

Mit source buildroot/envsetup.sh lassen sich die config_name-Werte zur Auswahl der Zielplattform auflisten.

## 3. Module und System bauen

Nach Auswahl der Plattform lassen sich einzelne Pakete bauen. Die drei wesentlichen Schritte sind config, build und install. In das buildroot-Verzeichnis wechseln. make &lt;package&gt; baut und installiert das Paket samt Abhängigkeiten. Für Buildroot-Pakete stehen zahlreiche separat aufrufbare make-Ziele bereit:

```text
make <package>-<target>
```

| Befehl/Ziel | Beschreibung |
| --- | --- |
| source | Quellen beziehen: Archiv, Repository-Klon usw. |
| depends | Alle Paketabhängigkeiten bauen und installieren |
| extract | Quellen im Build-Verzeichnis ablegen: Archiv entpacken, Code kopieren usw. |
| patch | Vorhandene Patches anwenden |
| configure | Vorhandenen configure-Befehl ausführen |
| build | Build ausführen |
| install-staging | Zielpaket: erforderliche Installation unter staging durchführen |
| install | Zielpaket: die beiden vorherigen Installationsbefehle ausführen. Hostpaket: unter host installieren. |

Zusätzlich gibt es folgende nützliche Ziele:

| Befehl/Ziel | Beschreibung |
| --- | --- |
| show-depends | Build-Abhängigkeiten anzeigen |
| clean | Paket bereinigen; gegebenenfalls aus target und staging entfernen. Nicht für alle Pakete implementiert. |
| dirclean | Gesamtes Paket-Build-Verzeichnis löschen |
| rebuild | Kompilierung wiederholen |
| reconfigure | Konfiguration wiederholen |

Beispiel zum Konfigurieren, Bauen, Installieren und erneuten Bauen des geänderten Pakets rockchip-test:

```text
### Compile package
buildroot$ make rockchip-test-configure
buildroot$ make rockchip-test-build
buildroot$ make rockchip-test-install

### Rebuild package
buildroot$ make rockchip-test-reconfigure
buildroot$ make rockchip-test-rebuild
buildroot$ make rockchip-test-reinstall

### Clean package
buildroot$ make rockchip-test-dirclean
```

Zum Ändern der Konfiguration make menuconfig aufrufen:

```text
buildroot$ make menuconfig
```

Die Hilfe im Konfigurationswerkzeug erläutert die Menüpunkte. Nach Abschluss entsteht die Datei .config mit der Konfiguration. Das Makefile verwendet sie für die erforderlichen Aufgaben. Danach make ausführen. Zum Bauen des gesamten Buildroot-Systems genügt make.

```text
buildroot$ make
```

Rootfs-Konfiguration speichern: `buildroot$ make update-defconfig`.

Die Build-Ergebnisse liegen unter output mit folgenden Unterverzeichnissen:

- images: sämtliche Dateisystemabbilder, etwa ext2/4, squashfs und cpio.
- build: alle Komponenten werden hier gebaut, sowohl Buildroot-Hostwerkzeuge als auch Zielpakete. Jede Komponente besitzt ein Unterverzeichnis.
- staging: eine rootfs-ähnliche Struktur mit installiertem Cross-Compiler und ausgewählten Userspace-Paketen. Sie ist nicht als Ziel-rootfs gedacht: Entwicklungsdateien, nicht gestripte Binärdateien und Bibliotheken benötigen viel Platz. Die Entwicklungsdateien stellen Bibliotheken und Abhängigkeiten zum Kompilieren bereit.
- target: nahezu vollständige Ziel-rootfs; Buildroot läuft jedoch nicht als root und soll dies auch nicht, weshalb bestimmte Objekte fehlen. Auch die Berechtigungen sind nicht endgültig, beispielsweise setuid für busybox. Dieses Verzeichnis nicht direkt für das Ziel verwenden, sondern ein Abbild aus images/. Für ein externes NFS-Abbild beschreibt die Quelle das Erzeugen des Abbilds in images/ als root. Anders als staging/ enthält target/ nur Laufzeitdateien und Bibliotheken, keine Entwicklungsheader; Binärdateien sind gestrippt.
- host: installierte Hostwerkzeuge für die korrekte Buildroot-Ausführung einschließlich Cross-Compiler.

## 4. Cross-Toolchain

Buildroot bietet verschiedene Ansätze für die Cross-Toolchain:

- Internes Backend, in der Konfiguration als Buildroot toolchain bezeichnet.

- Externes Backend, in der Konfiguration als external toolchain bezeichnet.

```text
$ make menuconfig
  -> Toolchain
  │       -> Toolchain type (<choice> [=y])
```

Das SDK verwendet standardmäßig das interne Backend.

### 4.1 Internes Toolchain-Backend

Das eingebaute Backend erstellt zuerst eine Cross-Toolchain für Userspace-Anwendungen und Bibliotheken des eingebetteten Zielsystems. Es handelt sich um das historische Buildroot-Backend. Die Quelle beschränkt es auf die C-Bibliothek uClibc, schließt glibc/eglibc aus und verweist dafür auf das externe sowie das cross-ystem-Backend. Diese Quellaussage muss mit der tatsächlichen Buildroot-Version abgeglichen werden.

Vorteile:

- Gute Buildroot-Kompatibilität.
- Schnell, da nur Erforderliches gebaut wird.

Nachteile:

- Nach einer Bereinigung muss die Toolchain erneut gebaut werden; zur Zeitersparnis eine externe Toolchain erwägen.
- Laut ursprünglicher Beschreibung auf uClibc beschränkt.

### 4.2 Externes Toolchain-Backend

Damit lassen sich bereits gebaute Cross-Toolchains verwenden. Buildroot erkennt verbreitete Varianten wie ARM Linaro, ARM Sourcery CodeBench, x86, x86-64, PowerPC, MIPS, SuperH, ADI Blackfin und Xilinx Microblaze. Sie können automatisch heruntergeladen oder als eigene herunterladbare bzw. lokal installierte Toolchain angegeben werden.

Vorteile:

- Bekannte und gut getestete Cross-Compiler nutzbar.
- Spart die Toolchain-Bauzeit, die bei Embedded-Linux-Builds erheblich sein kann.
- Nicht auf uClibc beschränkt: glibc und eglibc werden unterstützt.

Nachteil: Fehler einer vorgefertigten externen Toolchain lassen sich ohne eigenes Bauen möglicherweise nur mit Hilfe des Anbieters beheben. Das SDK enthält fertige Cross-Compiler unter prebuilts; bei externer Toolchain werden folgende Pfade verwendet:

| Verzeichnis | Beschreibung |
| --- | --- |
| prebuilts/gcc/linux-x86/aarch64/gcc-arm-10.3-2021.07-x86_64-aarch64-none-linux-gnu | gcc arm 10.3.1, 64-Bit-Toolchain |
| prebuilts/gcc/linux-x86/arm/gcc-arm-10.3-2021.07-x86_64-arm-none-linux-gnueabihf | gcc arm 10.3.1, 32-Bit-Toolchain |

Die Toolchain ist auch über den in der Quelle angegebenen Baidu-Cloud-Link verfügbar. Für einzelne SDK-Module oder Drittanbieteranwendungen muss die Cross-Compile-Umgebung konfiguriert werden. Die RK3562-Werkzeuge liegen beispielsweise unter buildroot/output/rockchip_rk3562/host/usr. bin/ und aarch64-buildroot-linux-gnu/bin/ müssen in die Umgebung aufgenommen werden. Das Skript im SDK-Hauptverzeichnis erledigt dies automatisch:

```text
source buildroot/envsetup.sh rockchip_rk3562
```

Mit folgendem Befehl prüfen:

```text
cd buildroot/output/rockchip_rk3562/host/usr/bin
./aarch64-linux-gcc --version
```

Ausgabe:

```text
aarch64-linux-gcc.br_real (Buildroot) 12.3.0
```

Für die im SDK enthaltene externe Toolchain die passenden Konfigurationen aus configs/rockchip/toolchain/* einbinden.

## 5. ccache in Buildroot

Beim Buildroot-Build ist ccache im SDK standardmäßig aktiviert. Der Compiler-Cache liegt unter $HOME/.buildroot-ccache. Zum Löschen des Caches nennt die Quelle das Entfernen dieses Verzeichnisses; hier wurde nichts gelöscht. make ccache-stats zeigt Größe, Treffer, Fehlzugriffe und weitere Statistiken.

## 6. Downloadverzeichnis für Pakete

Buildroot-Archive liegen in BR2_DL_DIR, standardmäßig dl. Ein vorgefülltes dl beschleunigt Builds und hilft bei fehlgeschlagenen Drittanbieterdownloads. Der SDK-Downloadpfad lässt sich über BUILDROOT_DL_DIR festlegen.

```text
$ export BUILDROOT_DL_DIR <shared download location>
```

Die Zeile zur Umgebungskonfiguration in ~/.bashrc aufnehmen.

Der Pfad lässt sich auch mit BR2_DL_DIR in .config festlegen. BUILDROOT_DL_DIR überschreibt diesen Wert.

## 7. Neue Buildroot-Pakete hinzufügen

Für neue Userspace-Bibliotheken und Anwendungen die Pakete unter buildroot/package/rockchip/* als Vorbild nutzen.

### 7.1 Programmverzeichnis unter package

Beispielsweise package/rockchip.

### 7.2 Config.in-Datei

Eine Config.in-Datei mit den vom Konfigurator verwendeten und angezeigten rockchip-Optionen erstellen. Grundlegender Inhalt:

```text
menuconfig BR2_PACKAGE_ROCKCHIP
        bool "Rockchip Platform"

if BR2_PACKAGE_ROCKCHIP

config BR2_PACKAGE_ROCKCHIP_HAS_ISP1
        bool
        help
         Has Rockchip ISP1
```

### 7.3 .mk-Dateien

Dies ist der anspruchsvollste Teil. rockchip.mk beschreibt Download, Konfiguration, Build und Installation. Der Aufbau hängt von Pakettyp und Infrastruktur ab.

- Allgemeine Pakete ohne autotools oder CMake: Die Infrastruktur ähnelt der für autotools, erfordert aber mehr Entwicklungsarbeit. Konfiguration, Kompilierung, Installation und Bereinigung werden beschrieben. Sie wird verwendet

für Pakete ohne autotools; künftig können spezielle Infrastrukturen für weitere Build-Systeme entstehen.

- autotools-Pakete (autoconf, automake usw.): Wegen der weiten Verbreitung existiert eine eigene Infrastruktur. Neue auf autotools basierende Pakete müssen sie verwenden.
- CMake-Pakete: Für dieses zunehmend verbreitete Build-System mit standardisiertem Verhalten gibt es eine eigene Infrastruktur, die neue CMake-Pakete verwenden müssen.

## 8. Paketnamen, Konfigurationsnamen und Makefile-Variablen

Paketverzeichnis und *.mk-Datei, Config.in-Optionsname sowie Makefile-Variablenpräfix hängen zusammen. Konsistenzregeln:

- Verzeichnis und *.mk tragen den Paketnamen, z. B. package/foo-bar_boo/foo-bar_boo.mk.
- Das Ziel trägt ebenfalls den Paketnamen; die Quelle nennt foo-barboo, abweichend vom vorigen Beispiel.
- Für die Konfigurationsoption wird der Paketname großgeschrieben, Bindestriche werden durch Unterstriche ersetzt und BR2_PACKAGE_ vorangestellt: BR2_PACKAGE_FOO_BAR_BOO. In der englischen Beschreibung fehlt der Unterstrich; das Beispiel bleibt erhalten.
- .mk-Variablen erhalten den großgeschriebenen Paketnamen mit Unterstrichen statt Bindestrichen als Präfix: FOO_BAR_BOO_VERSION.

## 9. Paket aus GitHub

Bei GitHub-Paketen liegt häufig kein separater Release-Archivlink vor; ein Paket lässt sich jedoch direkt aus dem Repository laden:

```text
FOO_VERSION = v1.0 # tag or (abbreviated) commit ID
FOO_SITE = http://github.com/<user>/<package>/tarball/$(FOO_VERSION)
```

Hinweise:

- FOO_VERSION kann ein Tag oder eine Commit-ID sein.

- GitHub-Archivnamen entsprechen dem Buildroot-Standard, etwa foo-1234567.tar.gz; eine Angabe in .mk ist daher nicht erforderlich.

- Bei einer Commit-ID genügen gewöhnlich die ersten 7 SHA1-Zeichen.

## 10. Eigene Module entwickeln

Zur Anpassung einzelner Module die Schalter unter &lt;SDK&gt;/buildroot/configs/rockchip* verwenden.

```text
buildroot$ tree -L 2 configs/rockchip/
configs/rockchip/
├── base  # General base packages
│   ├── base.config
│   ├── common.config
│   ├── kernel.config
│   ├── recovery.config
│   └── tiny.config
├── benchmark.config # Benchmark scoring test tools
├── chips # Chip-related configurations
│   ├── rk3036_arm.config
│   ├── rk3036.config
│   ├── rk312x_arm.config
│   ├── rk312x.config
│   ├── rk3288_arm.config
│   ├── rk3288.config
│   ├── rk3308_aarch64.config
│   ├── rk3308_arm.config
│   ├── rk3308.config
│   ├── rk3326_aarch64.config
│   ├── rk3326_arm.config
│   ├── rk3326.config
│   ├── rk3399_aarch64.config
│   ├── rk3399_arm.config
│   ├── rk3399.config
│   ├── rk3399pro_aarch64.config
│   ├── rk3399pro_arm.config
│   ├── rk3399pro.config
│   ├── rk3399pro_npu_aarch64.config
│   ├── rk3399pro_npu_arm.config
│   ├── rk3399pro_npu.config
│   ├── rk3528_aarch64.config
│   ├── rk3528.config
│   ├── rk3562_aarch64.config
│   ├── rk3562_arm.config
│   ├── rk3562.config
│   ├── rk3566_rk3568_aarch64.config
│   ├── rk3566_rk3568_arm.config
│   ├── rk3566_rk3568.config
│   ├── rk3588_aarch64.config
│   ├── rk3588_arm.config
│   └── rk3588.config
├── chromium.config # Chromium browser
├── debug.config # Debug tool configuration
├── electric.config # Electric power configuration
├── font # Font configuration
│   ├── chinese.config
│   └── font.config
├── fs # File system format configuration
│   ├── e2fs.config
│   ├── exfat.config
│   ├── ntfs.config
│   ├── ubifs.config
│   └── vfat.config
├── gdb.config # GDB debugging
├── gpu # GPU configuration
│   └── gpu.config
├── libcamera.config # libcamera configuration
├── locale
│   ├── chinese.config
│   └── locale.config
├── multimedia # Multimedia configuration
│   ├── audio.config
│   ├── camera.config
│   ├── gst
│   ├── mpp.config
│   └── rockit.config
├── npu2.config # NPU configuration
├── powermanager.config # Power management configuration
├── rknn_demo.conf
├── tee_aarch64_v2.config
├── test.config
├── toolchain # Toolchain configuration
│   ├── arm_10_aarch64.config
│   ├── arm_10_armhf.config
│   └── arm_8_armhf.config
├── weston.config # Weston configuration
├── wifibt # RKWIFIBT network configuration
│   ├── bt.config
│   ├── network.config
│   └── wireless.config
└── x11.config # X11 configuration
...
```

## 11. Desktop-Anwendungen

Buildroot verwendet standardmäßig Weston DRM auf Basis des Wayland-Protokolls als Anzeige-Backend:

![Technische Abbildung der englischen Quelle](/docs/rockchip-buildroot/assets/en-p013-figure-01.png)

Diese Weston-Anwendungen bieten grundlegende Einstellungen für Panel und Hintergrund sowie Chromium, Terminal, Launcher, Kameravorschau, Mehrkanalvideo, GPU-, Maus- und weitere Demos. Zusätzliche Demos lassen sich über /etc/xdg/weston/weston.ini.d/* einbinden. Parameter und Bedienung beschreibt der Weston-Abschnitt.

Quellhinweis: UI-Frameworks von Drittanbietern können kommerzielle Berechtigungen erfordern. Für Buildroot QT/Enlightenment/Minigui/LVGL und andere Frameworks auf Rockchip sind Berechtigungen und Support gesondert zu prüfen; laut Quelle bietet Rockchip hierfür keinen technischen Support oder Wartung. Dies ist der erhaltene Quellhinweis, keine eigenständige Lizenzbewertung.

### 11.1 Weston-Anwendungen

Weston-Client-Anwendungen für Wayland:

```text
/usr/bin/#
├── weston-calibrator
├── weston-clickdot
├── weston-cliptest
├── weston-confine
├── weston-content_protection
├── weston-debug
├── weston-dnd
├── weston-editor
├── weston-eventdemo
├── weston-flower
├── weston-fullscreen
├── weston-image
├── weston-multi-resource
├── weston-presentation-shm
├── weston-resizor
├── weston-scaler
├── weston-screenshooter
├── weston-simple-damage
├── weston-simple-dmabuf-egl
├── weston-simple-dmabuf-v4l
├── weston-simple-egl
├── weston-simple-shm
├── weston-simple-touch
├── weston-smoke
├── weston-stacking
├── weston-subsurfaces
├── weston-tablet
├── weston-terminal
├── weston-touch-calibrator
├── weston-transformed
```

### 11.2 Enlightenment-Desktop

Folgende Konfigurationen aktivieren:

```text
BR2_PACKAGE_EFL=y
BR2_PACKAGE_LUAJIT=y
BR2_PACKAGE_EFL_GSTREAMER1=y
BR2_PACKAGE_ENLIGHTENMENT=y
BR2_PACKAGE_EFL_WAYLAND=y
```

Die laufende Oberfläche:

![Technische Abbildung der englischen Quelle](/docs/rockchip-buildroot/assets/en-p014-figure-01.png)

### 11.3 LVGL-Desktop

Die entsprechenden Optionen aktivieren:

```text
BR2_PACKAGE_LVGL=y
BR2_PACKAGE_LVGL_COLOR_DEPTH=32
BR2_PACKAGE_LV_DRIVERS=y
BR2_PACKAGE_LV_DRIVERS_USE_DRM=y
BR2_PACKAGE_LVGL_DEMO=y
BR2_PACKAGE_RK_DEMO=y
BR2_PACKAGE_LVGL_DEMO_USE_DRM=y
BR2_PACKAGE_FREETYPE=y
```

![Technische Abbildung der englischen Quelle](/docs/rockchip-buildroot/assets/en-p015-figure-01.png)

## 12. Benutzer und Passwort

Benutzer: root. Passwort: rockchip. Dies sind SDK-Beispielwerte, keine Empfehlung für ein gemeinsames Passwort im produktiven Betrieb.

## 13. Weston-Entwicklung

Weston ist die offizielle Referenzimplementierung des offenen Wayland-Anzeigeprotokolls. Der Anzeigedienst des Rockchip Buildroot SDK nutzt standardmäßig das Weston-drm-Backend.

### 13.1 Konfigurationswege

Das Buildroot SDK bietet mehrere Wege.

a. Startparameter: Argumente des Weston-Aufrufs, etwa weston --tty=2. /etc/init.d/S49weston entspricht buildroot/package/weston/S49weston im SDK.

b. weston.ini-Konfigurationsdateien:

Die .ini-Dateien liegen in /etc/xdg/weston/weston.ini und /etc/xdg/weston/weston.ini.d/. Ein entsprechender SDK-Pfad ist buildroot/board/rockchip/common/base/etc/xdg/weston/weston.ini. Referenz: https://fossies.org/linux/weston/man/weston.ini.man.

c. Spezielle Umgebungsvariablen: gewöhnlich in /etc/profile.d/weston.sh gesetzt; SDK-Datei buildroot/package/weston/weston.sh.

d. Dynamische Konfigurationsdatei: Das drm-Backend des Buildroot-SDK-Weston unterstützt dynamische Einstellungen. Der Standardpfad /tmp/.weston_drm.conf lässt sich mit WESTON_DRM_CONFIG ändern.

e. udev-Regeln: für bestimmte Weston-Eingabegeräteeinstellungen erforderlich.

## 14. Einzelne Einstellungen

### 14.1 Bildschirmidentifikation

Weston unterscheidet Bildschirme anhand des output-(head-)Namens. Er ist im Startprotokoll sichtbar:

```text
# weston&
[02:11:29.746] DRM: head 'DSI-1' found ...
```

### 14.2 Cursor-Stil und -Größe

Cursor-Stil und -Größe werden im Abschnitt shell der weston.ini gesetzt:

```text
# /etc/xdg/weston/weston.ini

[shell]
cursor-theme=whiteglass # Buildroot SDK supports comix/obsidian/xcursor/xcursor-transparent mouse theme packages
cursor-size=24
```

### 14.3 Statusleiste

Unter shell in weston.ini lassen sich Hintergrundfarbe, Position und Skalierung der Leiste einstellen; launcher legt Schnellstartprogramme fest:

```text
# /etc/xdg/weston/weston.ini

[shell]
panel-color=0x90ff0000
# Color format is ARGB8888

panel-position=bottom
# top|bottom|left|right|none, none means disabled

panel-scale=4
# 4x scaling

[launcher]
icon=/usr/share/icons/gnome/24x24/apps/utilities-terminal.png
# Icon path

path=/usr/bin/gnome-terminal
# Shortcut launch command
```

### 14.4 Hintergrund

Unter shell in weston.ini werden Hintergrundbild und -farbe gesetzt, unter desktop-launcher die Programmstarter:

```text
# /etc/xdg/weston/weston.ini

[shell]
background-image=/usr/share/backgrounds/gnome/Aqua.jpg
# Absolute path of the background pattern (wallpaper)

background-type=tile
# scale|scale-crop|tile

background-color=0xff002244
# Color format is ARGB8888, takes effect when no background pattern is set

[desktop-launcher]
icon=/usr/share/icons/hicolor/256x256/apps/chromium.png
# Icon path

path=/usr/bin/chromium www.baidu.com
# Shortcut launch command
displayname=chromium
# Display name
```

### 14.5 Bereitschaft und Bildschirmsperre

Die Weston-Leerlaufzeit lässt sich als Startparameter oder unter core in weston.ini setzen:

```text
# /etc/init.d/S49weston
start_weston()
{
  /usr/bin/weston --idle-time=0&  # 0 means no standby, unit is seconds
}
```

Oder:

```text
# /etc/xdg/weston/weston.ini

[core]
idle-time=10
```

Die Bildschirmsperre wird unter shell in weston.ini konfiguriert:

```text
# /etc/xdg/weston/weston.ini

[shell]
locking=false
# Disable lock screen

lockscreen-icon=/usr/share/icons/gnome/256x256/actions/lock.png
# Unlock button image

lockscreen=/usr/share/backgrounds/gnome/Garden.jpg
# Lock screen background
```

### 14.6 Farbformat

Weston im Buildroot SDK verwendet standardmäßig ARGB8888. Für schwächere Plattformen lässt sich unter core in weston.ini RGB565 einstellen:

```text
# /etc/xdg/weston/weston.ini

[core]
gbm-format=rgb565
# xrgb8888|argb8888|rgb565|xrgb2101010
```

Das Format einzelner Bildschirme lässt sich unter output separat konfigurieren:

```text
# /etc/xdg/weston/weston.ini

[output]
name=LVDS-1

gbm-format=rgb565
# xrgb8888|argb8888|rgb565|xrgb2101010
```

### 14.7 Bildschirmausrichtung

Die Ausrichtung wird unter output in weston.ini konfiguriert:

```text
# /etc/xdg/weston/weston.ini

[output]
name=LVDS-1

transform=rotate-90
# normal|rotate-90|rotate-180|rotate-270|flipped|flipped-90|flipped-180|flipped-270
```

Für eine dynamische Ausrichtungsänderung dient die dynamische Konfigurationsdatei:

```text
echo "output:all:rotate90" > /tmp/.weston_drm.conf # Rotate all screens by 90 degrees
echo "output:eDP-1::rotate180" > /tmp/.weston_drm.conf # Rotate eDP-1 by 180 degrees
```

### 14.8 Auflösung und Skalierung

Auflösung und Skalierung werden unter output in weston.ini gesetzt:

```text
# /etc/xdg/weston/weston.ini

[output]
name=LVDS-1

mode=1280x800
# Must be a valid resolution supported by the screen

scale=2
# Must be an integer multiple, support applications to achieve scaling
```

Zum Skalieren auf eine bestimmte Größe bei unveränderter physischer Auflösung wird die Größe aller Bildschirme mit WESTON_DRM_VIRTUAL_SIZE gesetzt:

```text
# /etc/profile.d/weston.sh
export WESTON_DRM_VIRTUAL_SIZE=1024x768
```

Dynamische Auflösungs- und Skalierungskonfiguration:

```text
echo "output:HDMI-A-1:mode=800x600" > /tmp/.weston_drm.conf # Change the resolution of HDMI-A-1 to 800x600
echo "output:eDP-1:rect=<10,20,410,620>" > /tmp/.weston_drm.conf # Display eDP-1 at position (10,20), scaled to a size of 400x600
echo "output:HDMI-A-1:size=1920x1080" > /tmp/.weston_drm.conf # Scale HDMI-A-1 to 1080p, with the physical resolution unchanged
```

Unterstützt das VOP-Anzeigemodul keine Skalierung, muss RGA die Verarbeitung übernehmen.

### 14.9 Anzeige einfrieren

Beim Weston-Start kann zwischen Boot-Logo und UI kurz ein schwarzer Bildschirm erscheinen. Dies lässt sich durch kurzes Einfrieren verhindern. Der angepasste Parameter --warm-up beginnt die Anzeige erst nach dem UI-Start:

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
  export WESTON_FREEZE_DISPLAY=/tmp/.weston_freeze # Set special configuration file path
  touch /tmp/.weston_freeze # Freeze display
  /usr/bin/weston&
  sleep 1 && rm /tmp/.weston_freeze& # Unfreeze after 1 second
}
```

Oder:

```text
# /etc/init.d/S49weston
start_weston()
{
  echo "output:all:freeze" > /tmp/.weston_drm.conf # Freeze display
  /usr/bin/weston&
  ...
  sleep 1 && echo "output:all:unfreeze" > /tmp/.weston_drm.conf& # Unfreeze after 1 second
}
```

### 14.10 Bildschirmzustand

DRM unterstützt das Erzwingen eines Bildschirmzustands:

```text
echo on > /sys/class/drm/card0-HDMI-A-1/status # Force HDMI-A-1 to be in the connected state
# on|off|detect, detect for hot-plug
```

Weitere dynamische Zustände werden über die dynamische Datei eingestellt:

```text
echo "output:DSI-1:off" > /tmp/.weston_drm.conf # Turn off DSI (without unplugging)
echo "output:HDMI-A-1:freeze" > /tmp/.weston_drm.conf # Freeze HDMI-A-1
echo "output:eDP-1:on" > /tmp/.weston_drm.conf # Turn on eDP
echo "compositor:state:off" > /tmp/.weston_drm.conf # Suspend display
echo "compositor:state:sleep" > /tmp/.weston_drm.conf # Suspend display, wake up with touch screen
echo "compositor:state:freeze" > /tmp/.weston_drm.conf # Freeze display
echo "compositor:state:on" > /tmp/.weston_drm.conf # Wake up display
```

### 14.11 Mehrbildschirmverwaltung

Weston im Buildroot SDK unterstützt Spiegeln, erweiterten Desktop, Bildschirmpositionen und Hotplug. Beim Spiegeln wird RGA zur Skalierung versucht, wenn VOP dies nicht unterstützt. Einstellungen erfolgen über Umgebungsvariablen:

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

Einzelne Bildschirme lassen sich unter output in weston.ini deaktivieren:

```text
# /etc/xdg/weston/weston.ini

[output]
name=LVDS-1

mode=off
# off|current|preferred|<WIDTHxHEIGHT@RATE>
```

Alternativ die dynamische Datei verwenden:

```text
echo "output:HDMI-A-1:pos=100,200" > /tmp/.weston_drm.conf # Set HDMI display position
echo "output:HDMI-A-1:prefer" > /tmp/.weston_drm.conf # Set applications to default display on HDMI
echo "output:HDMI-A-1:primary" > /tmp/.weston_drm.conf # Set HDMI as the primary display
```

### 14.12 Eingabegeräte

Weston benötigt standardmäßig mindestens ein Eingabegerät. Ohne Eingabegerät ist eine spezielle core-Einstellung erforderlich:

```text
# /etc/xdg/weston/weston.ini

[core]
require-input=false
```

Bei mehreren Bildschirmen bindet WL_OUTPUT in udev-Regeln Eingabegeräte an einen Bildschirm:

```text
# /lib/udev/rules.d/99-goodix-ts.rules
ATTRS{name}=="goodix-ts", ENV{WL_OUTPUT}="HDMI-A-1"
```

Oder WL_SEAT konfigurieren:

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

Oder die dynamische Konfigurationsdatei verwenden:

```text
echo "output:HDMI-A-1:input=*" > /tmp/.weston_drm.conf # Match all devices
echo "output:HDMI-A-1:input=" > /tmp/.weston_drm.conf # Disable input
echo "output:HDMI-A-1:input=event6" > /tmp/.weston_drm.conf
echo "output:HDMI-A-1:input=goodix*" > /tmp/.weston_drm.conf
echo "output:HDMI-A-1:input=goodix-ts" > /tmp/.weston_drm.conf
```

evtest zeigt Hersteller-ID, Produkt-ID und Gerätenamen des Eingabegeräts:

```text
# evtest /dev/input/event8 | head -3
Input driver version is 1.0.1
Input device ID: bus 0x18 vendor 0xdead product 0xbeef version 0x28bb
Input device name: "goodix-ts"
```

### 14.13 Touchscreen-Kalibrierung

Zur Kalibrierung kann WESTON_TOUCH_CALIBRATION gesetzt werden:

```text
# /etc/profile.d/weston.sh
export WESTON_TOUCH_CALIBRATION="1.013788 0.0 -0.061495 0.0 1.332709 -0.276154"
```

Alternativ eine udev-Regel verwenden:

```text
# /lib/udev/rules.d/99-goodix-ts.rules
ATTRS{name}=="goodix-ts", ENV{LIBINPUT_CALIBRATION_MATRIX}="1.013788 0.0 -0.061495 0.0 1.332709 -0.276154"
```

Die Parameter liefert weston-calibrator. Das Werkzeug erzeugt zufällige Punkte; nach nacheinander erfolgtem Anklicken gibt es Final calibration values: 1.013788 0.0 -0.061495 0.0 1.332709 -0.276154 aus.

Das alternative Weston-Werkzeug weston-touch-calibrator benötigt folgende Konfiguration:

```text
# /etc/xdg/weston/weston.ini

[libinput]
touchscreen_calibrator=true
calibration_helper=/bin/weston-calibration-helper.sh
```

### 14.14 Plattform ohne GPU

SDK-Weston beschleunigt das Rendering standardmäßig mit der GPU. Fehlt sie oder ist sie zu schwach, kann Rockchip RGA als 2D-Beschleuniger dienen. Im Buildroot SDK BR2_PACKAGE_LINUX_RGA und BR2_PACKAGE_WESTON_DEFAULT_PIXMAN aktivieren.

### 14.15 ARM AFBC Modifier

Bei AFBC-fähigen Chips kann SDK-Weston das GPU-basierte AFBC-Kompressionsformat anzeigen. Konfiguration:

```text
# /etc/profile.d/weston.sh
# export WESTON_DISABLE_ATOMIC=1
export WESTON_ALLOW_GBM_MODIFIERS=1
```

### 14.16 UI-Auflösung reduzieren

Bei unzureichender UI-Leistung oder DDR-Bandbreite lässt sich die UI-Auflösung reduzieren:

```text
echo "output:HDMI-A-1:down-scale=0.5" >> /tmp/.weston_drm.conf # UI scaling by 0.5x
```

Weitere Informationen: &lt;SDK&gt;/docs/cn/Linux/Graphics/Rockchip_Developer_Guide_Buildroot_Weston_CN.pdf.

## 15. Screenshot-Funktion

```text
buildroot:/# killall weston
buildroot:/# weston --debug&
buildroot:/# weston-screenshooter
```

Die Befehle erfassen den aktuellen Bildschirm.

## 16. Chinesische Textdarstellung

Weston-Konfiguration:

```text
$ cat /etc/xdg/weston/weston.ini
[terminal]
font=Source Han Sans CN Medium
font-size=14
term=xterm-256color
```

chinese.config aus Buildroot configs/rockchip/locale/ einbinden oder folgende Optionen aktivieren:

```text
BR2_TOOLCHAIN_GLIBC_GCONV_LIBS_COPY=y
BR2_PACKAGE_BUSYBOX_UNICODE=y
# BR2_ENABLE_LOCALE_PURGE is not set
BR2_GENERATE_LOCALE="zh_CN.UTF-8"
```

Buildroot-Umgebung:

```text
root@rk3588:/# cat /etc/profile.d/lang.sh
export LANG=zh_CN.utf8
```

Zugehörige Buildroot-Commits:

```text
buildroot$ git log --oneline
c476944fee configs: locale.config: Disable BR2_ENABLE_LOCALE_PURGE
f9654d67c8 localedef: Sync with 2018 SDK
2cbb75a54c coreutils: Support bypassing Unicode when printing
15340338dc busybox: Support bypassing Unicode when printing
5e9b8ba00c configs: rockchip: Add locale.config
863eed048e busybox: Support enabling unicode

device/rockchip$ git log --oneline
5c42211 post-rootfs.sh: Support setting LANG environment
```

## Quellenunterschiede und Ergänzungen

Der chinesische §3 nennt ausdrücklich fehlende `/dev/`-Gerätedateien in target/; Englisch lässt dies aus. Chinesisch beschreibt build/ als alle Komponenten außer der Cross-Toolchain, Englisch als alle Komponenten. Beide Aussagen bleiben dokumentiert, ohne ihre Gültigkeit für ein konkretes SDK zu unterstellen. Im chinesischen §7 steht `builroot/package/rockchip/*`, im englischen `buildroot/package/rockchip/*`. In der englischen §8-Erklärung fehlt der Unterstrich als Ersatzzeichen; Chinesisch und Beispiel verwenden `_`. Das tatsächliche SDK prüfen.

[Toolchain / 工具链 / Toolchain / Toolchain](https://eyun.baidu.com/s/3smN9fml)

[ArmSoM Docs](https://docs.armsom.org/)

[Weston source reference](https://fossies.org/linux/weston/man/weston.ini.man)

{% endraw %}
