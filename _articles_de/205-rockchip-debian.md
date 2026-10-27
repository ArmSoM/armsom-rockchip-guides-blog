---
title: "Rockchip Debian: Entwicklerhandbuch"
description: "Rockchip Debian: Entwicklerhandbuch — V1.8.0"
excerpt: "Rockchip Debian: Entwicklerhandbuch"
translation_key: "205-rockchip-debian"
slug: "205-rockchip-debian"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "system"
products: []
tags: [ArmSoM, Rockchip, Debian, Linux]
---

{% raw %}

# Rockchip Debian: Entwicklerhandbuch

Grundlage sind die chinesischen und englischen Rockchip-Debian-Dokumente V1.8.0 vom 2024-09-20. Alle 11 technischen Kapitel, Befehle, Konfigurationen, Tabellen und Originalabbildungen bleiben erhalten. Wartungsstatus, Roadmap, Leistungswerte und Standardkonten sind historische Quellangaben, keine aktuellen Angaben oder ArmSoM-Testergebnisse. Prüfen Sie vor der Verwendung Platine, SoC, SDK/BSP, Kernel und Peripherie. Es wurden weder Quellbefehle noch Hardwaretests ausgeführt.

Im englischen PDF stehen mehrere FAQ-Überschriften und Erläuterungen irrtümlich in Codekästen; Shell-Escapes und einzelne Argumente fehlen. Codegrenzen und Nummerierung 9.1–9.30 samt Unterabschnitten wurden anhand des chinesischen Originals wiederhergestellt; die letzten englischen Nummern 0.19/0.20/1/2 wurden zu 9.29/9.30/10/11. Quellschreibweisen `-no-sandbox` / `--no-sandbox`, `vvp8enc`, unterschiedliche Padding-Reihenfolgen und Versionswerte bleiben erhalten. Schwache Standardpasswörter, passwortloses root und deaktivierte Sandbox beschreiben die ursprüngliche Entwicklungsumgebung und sind keine Produktionsempfehlungen.

| Debian-Version | Plattform | Laut Quelle validierte SoCs |
| --- | --- | --- |
| 12 | ARM | RK3588, RK3576, RK3568, RK3566, RK3562 |
| 11 | ARM | RK3588, RK3568, RK3566, RK3562, RK3399, RK3288 |
| 10 | ARM | RK3399PRO, PX30, RK3326, RK3288, RK3328, RK3126C |

<!-- source:en p6 unit:0 -->

## 1. Einführung in Debian

<!-- source:en p6 unit:1 -->

### 1.1 Was ist Debian?

<!-- source:en p6 unit:2 -->

Debian ist ein vollständig freies Linux-Betriebssystem mit offenem Quellcode, das auf vielen Geräten eingesetzt wird. Gründe für Debian: freie Software. Debian besteht aus freier Open-Source-Software und bleibt zu 100% frei. Jeder darf sie verwenden, verändern und verbreiten. Auf Rockchip lässt sich ein Debian-System für die Weiterentwicklung aufbauen. Debian ist ein stabiles und sicheres Linux-basiertes Betriebssystem. Es wird auf Laptops, Desktop-Rechnern und Servern eingesetzt. Seit 1993 schätzen Nutzer seine Stabilität und Zuverlässigkeit. Für jedes Paket werden sinnvolle Standardkonfigurationen bereitgestellt. Debian-Entwickler bemühen sich während des gesamten Lebenszyklus um Sicherheitsupdates für alle Pakete. Debian unterstützt vielfältige Hardware. Der Linux-Kernel unterstützt den Großteil; reicht freie Software nicht aus, können proprietäre Hardwaretreiber verwendet werden. Unter anderem sind Rockchip RK3588/RK3576/RK356X/RK3399/RK3288 angepasst und unterstützt. Debian ermöglicht reibungslose Updates. Innerhalb des Veröffentlichungszyklus und beim Wechsel zur nächsten Hauptversion sind Aktualisierungen einfach. Rockchip ist bereits von Debian Stretch (9) zu Debian Buster (10), Bullseye (11) und Bookworm (12) übergegangen. Debian bildet die Grundlage vieler weiterer Distributionen.

<!-- source:en p7 unit:3 -->

Viele bekannte Linux-Distributionen wie Ubuntu, Knoppix, PureOS, SteamOS und Tails verwenden Debian als Softwarebasis. Debian stellt Werkzeuge bereit, mit denen jeder die Pakete im Debian-Archiv um Pakete für eigene Anforderungen erweitern kann. Das Debian-Projekt ist eine Gemeinschaft. Debian ist mehr als ein Linux-Betriebssystem: Hunderte Freiwillige weltweit erstellen die Software. Auch ohne Programmier- oder Systemadministrationskenntnisse kann man Teil der Debian-Gemeinschaft werden.

<!-- source:en p7 unit:4 -->

### 1.2 Unterstützte Debian-Versionen

<!-- source:en p7 unit:5 -->

| Version | Unterstützte Architekturen | (Voraussichtliches) Supportende | Aktueller Status |
| --- | --- | --- | --- |
| Debian 9 „Stretch“ | armhf und arm64 | 2022-06 | Wartung beendet |
| Debian 10 „Buster“ | armhf und arm64 | 2024-06 | In Wartung |
| Debian 11 „Bullseye“ | armhf und arm64 | 2026-06 | In Wartung |
| Debian 12 „Bookworm“ | armhf und arm64 | 2028-06 | In Entwicklung |

<!-- source:en p7 unit:6 -->

Weitere Informationen zur langfristigen Unterstützung von Debian-Versionen stehen auf der offiziellen Website.

<!-- source:en p7 unit:7 -->

## 2. Schnelleinstieg in Debian

<!-- source:en p7 unit:8 -->

### 2.1 Umgebung einrichten

<!-- source:en p7 unit:9 -->

Für die Kompilierung wird Ubuntu 22.04 empfohlen. Bei anderen Linux-Versionen müssen die Softwarepakete gegebenenfalls angepasst werden. Zusätzlich zum Betriebssystem bestehen Hardware- und Softwareanforderungen. Hardware: 64-Bit-System und mehr als 40G Speicherplatz; mehrere Projekte benötigen mehr Platz. Software: Ubuntu 22.04. Es folgen die Installationsbefehle für die von der SDK-Buildumgebung benötigten Pakete:

<!-- source:en p7 unit:10 -->

```text
sudo apt-get update && sudo apt-get install git ssh make gcc libssl-dev liblz4-
tool expect expect-dev g++ patchelf chrpath gawk texinfo chrpath diffstat binfmt-
support qemu-user-static live-build bison flex fakeroot cmake gcc-multilib g++-
multilib unzip device-tree-compiler ncurses-dev libgucharmap-2-90-dev bzip2 expat
gpgv2 cpp-aarch64-linux-gnu libgmp-dev libmpc-dev bc python-is-python3 python2
```

<!-- source:en p8 unit:11 -->

Für die Entwicklung wird Ubuntu22.04 oder höher empfohlen. Bei Buildfehlern die entsprechenden Pakete anhand der Fehlermeldungen installieren.

<!-- source:en p8 unit:12 -->

### 2.2 Quellcode beziehen

<!-- source:en p8 unit:13 -->

Der Quellcode befindet sich im Projektverzeichnis &lt;SDK&gt;/debian des vom Rockchip-Codeserver bereitgestellten SDK.

<!-- source:en p8 unit:14 -->

### 2.3 Kompilierung

<!-- source:en p8 unit:15 -->

Für die Debian-Kompilierung benötigte Pakete

<!-- source:en p8 unit:16 -->

```text
sudo dpkg -i debian/ubuntu-build-service/packages/*
sudo apt-get install -f

Note: The live-build_*.deb is sourced from
https://mirrors.ustc.edu.cn/debian/pool/main/l/live-build/
The debootstrap_*.deb is sourced from
https://mirrors.ustc.edu.cn/debian/pool/main/d/debootstrap/

Alternatively, you can install the dependency environment by:
sudo apt-get remove live-build
git clone https://salsa.debian.org/live-team/live-build.git --depth 1 -b
debian/1%20230131
cd live-build
rm -rf manpages/po/
sudo make install -j8
```

<!-- source:en p8 unit:17 -->

Debian kompilieren: In das SDK-Projekt wechseln und direkt kompilieren.

<!-- source:en p8 unit:18 -->

```text
./build.sh debian
```

<!-- source:en p8 unit:19 -->

Alternativ in das Verzeichnis Debian/ wechseln:

<!-- source:en p8 unit:20 -->

```text
cd debian/
```

<!-- source:en p8 unit:21 -->

Siehe readme.md im aktuellen Verzeichnis.

<!-- source:en p9 unit:22 -->

## 3. Debian-Verzeichnisstruktur

<!-- source:en p9 unit:23 -->

```text
debian
├── mk-base-debian.sh ##Retrieve Debian base packages and compile
├── mk-image.sh ##Package to generate ext4 firmware
├── mk-rootfs-<debian-version>.sh ##Adapt for Rockchip hardware acceleration
packages
├── mk-rootfs.sh  ##Point to specific Rootfs version, currently Bullseye and
Bookworm versions are available.
├── overlay ##Common configuration files for Rockchip platform adaptation
├── overlay-debug ##System frequently used debugging tools
├── overlay-firmware ##Storage for some device firmware, such as npu/dp, etc.
├── packages ##Contains precompiled packages for armhf/arm64 system adaptation
with hardware acceleration
├── packages-patches ##Precompiled packages with patches based on official
versions
├── readme.md ##Documentation guide
└── ubuntu-build-service ##Obtain Debian distribution from official sources, can
depend on packages and customize installation of related packages.
```

<!-- source:en p9 unit:24 -->

Die gesamte Verzeichnisstruktur verwendet Shell-Skripte, um Debian Linux mit angepassten Rockchip-Hardwarebeschleunigungspaketen zu beziehen, aufzubauen, zu kompilieren und zu installieren.

<!-- source:en p9 unit:25 -->

## 4. Anleitung zu Debian live-build

<!-- source:en p9 unit:26 -->

live build ist eine Skriptsammlung zum Erstellen von Live-Systemabbildern. Die Idee ist ein Werkzeugsatz, der über ein Konfigurationsverzeichnis sämtliche Aspekte des Imagebaus vollständig automatisiert und anpassbar macht. Weitere Hinweise stehen im offiziellen Live manual. Debian-Paketquellrepository (VCS: Git): live-build-git. Im Browser einsehbares Paketquellrepository: live-build.

<!-- source:en p9 unit:27 -->

### 4.1 Zugehörige Befehle

<!-- source:en p9 unit:28 -->

 lb config erzeugt im aktuellen Verzeichnis auto, config und zugehörige Konfigurationsdateien und führt auto/config aus. lb clean führt auto/clean aus.

<!-- source:en p10 unit:29 -->

 lb build erstellt das Systemabbild anhand der Konfigurationsskripte im Verzeichnis config.

<!-- source:en p10 unit:30 -->

### 4.2 Paketquellen konfigurieren

<!-- source:en p10 unit:31 -->

Methode 1

<!-- source:en p10 unit:32 -->

```text
lb config --mirror-bootstrap http://mirrors.ustc.edu.cn/debian --mirror-chroot-
security http://mirrors.ustc.edu.cn/debian-security/ --mirror-chroot-backports
http://mirrors.ustc.edu.cn/debian-backports/
```

<!-- source:en p10 unit:33 -->

chroot-Mirror: --mirror-chroot verwendet standardmäßig den Wert von --mirror-bootstrap. Alternativ config/archives/your-repository.list.chroot mit der Repositoryadresse erstellen. Die Quelle wird dem Verzeichnis /etc/apt/sources.list.d/ des Live-Systems hinzugefügt. Methode 2:

<!-- source:en p10 unit:34 -->

```text
lb config --mirror-binary http://mirrors.ustc.edu.cn/debian --mirror-binary-
security http://mirrors.ustc.edu.cn/debian-security/
```

<!-- source:en p10 unit:35 -->

Alternativ config/archives/your-repository.list.binary mit der Repositoryadresse erstellen.

<!-- source:en p10 unit:36 -->

### 4.3 Systempakete anpassen

<!-- source:en p10 unit:37 -->

Methode 1: Die benötigte Paketliste unter customization/package-lists als XXX.list.chroot oder XXX.list.binary ablegen. Methode 2: Mit --package-lists "XXX" die Paketliste unter /usr/share/live/build/package-lists/ angeben. lb config erzeugt anhand der Skriptparameter vier Konfigurationsdateien unter config: binary, bootstrap, chroot und common. lb build liest diese Dateien; ihre Parameter können nach lb config gezielt geändert werden. auto/config enthält beispielsweise folgende Konfigurationsparameter:

<!-- source:en p11 unit:38 -->

```text
set -e

echo "I: create configuration"
export LB_BOOTSTRAP_INCLUDE="apt-transport-https gnupg"
lb config  --mirror-bootstrap "http://mirrors.ustc.edu.cn/debian"  --mirror-
chroot "http://mirrors.ustc.edu.cn/debian"  --mirror-chroot-security
"http://mirrors.ustc.edu.cn/debian-security"  --mirror-binary
"http://mirrors.ustc.edu.cn/debian"  --mirror-binary-security
"http://mirrors.ustc.edu.cn/debian-security"  --apt-indices false  --apt-
recommends false  --apt-secure false  --architectures arm64  --archive-areas
'main contrib non-free'  --backports false  --binary-filesystem ext4  --binary-
images tar  --bootappend-live "hostname=linaro-alip username=linaro"  --
bootloader "syslinux"  --bootstrap-qemu-arch arm64  --bootstrap-qemu-static
/usr/bin/qemu-aarch64-static  --cache false  --chroot-filesystem none  --
compression gzip  --debootstrap-options "--variant=minbase --include=apt-
transport-https,gnupg"  --distribution bullseye  --gzip-options '-9 --rsyncable'
--iso-publisher 'Linaro; http://www.linaro.org/; linaro-dev@lists.linaro.org'  --
iso-volume 'Linaro Bullseye $(date +%Y%m%d-%H:%M)'  --linux-flavours none  --
linux-packages none  --mode debian  --security true  --system normal  --updates
true
```

<!-- source:en p11 unit:39 -->

#### 4.3.1 Benutzerdefiniertes Verzeichnis

<!-- source:en p11 unit:40 -->

Eigene Verzeichnisse und Dateien im jeweiligen include-Verzeichnis unter config/ ablegen: config/binary_local-includes, bezogen auf das Wurzelverzeichnis des erzeugten Abbilds; config/chroot_local-includes, bezogen auf das Wurzelverzeichnis des Zielsystems.

<!-- source:en p11 unit:41 -->

#### 4.3.2 HOOKS

<!-- source:en p11 unit:42 -->

Nach jeder live-build-Phase werden die Skripte der entsprechenden Hooks unter config/ ausgeführt: config/binary_local-hooks und config/chroot_local-hooks. Neuere live-build-Versionen beziehen Patches aus den Verzeichnissen live/normal.

<!-- source:en p11 unit:43 -->

```text
customization/hooks/live/
├── 0001-setup_user_linaro.binary
├── 0002-add_linaro_to_groups.binary
├── 0003-check_sudoers_for_admin.binary
├── 0021-silence-systemd.binary
├── 0022-disable-systemd-services.binary
├── 0023-lightdm-autologin.binary
└── 0098-resolvconf.binary
```

<!-- source:en p12 unit:44 -->

## 5. Übersicht vorkompilierter Debian-Pakete

<!-- source:en p12 unit:45 -->

```text
packages/
├── arm64/armhf
│   ├── blueman
│   ├── cheese
│   ├── chromium
│   ├── glmark2
│   ├── gst-plugins-bad1.0
│   ├── gst-plugins-base1.0
│   ├── gst-plugins-good1.0
│   ├── gst-plugins-ugly1.0
│   ├── gstreamer
│   ├── gst-rkmpp
│   ├── libdrm
│   ├── libdrm-cursor
│   ├── libmali
│   ├── libv4l
│   ├── mpp
│   ├── openbox
│   ├── pcmanfm
│   ├── pipewire
│   ├── rga
│   ├── rga2
│   ├── rkaiq
│   ├── rkisp
│   ├── rknpu2
│   ├── rktoolkit
│   ├── rkwifibt
│   ├── wayland
│   ├── weston
│   ├── wireplumber
│   └── xserver
```

<!-- source:en p12 unit:46 -->

### 5.1 Blueman

<!-- source:en p12 unit:47 -->

Blueman ist ein GTK+-Bluetooth-Manager. Er verwaltet die BlueZ-API effizient und vereinfacht Einwahlverbindungen für 3G/EDGE/GPRS, Verbindung und Erstellung von Bluetooth-Netzen, Anschluss von Eingabe- und Audiogeräten, Dateiversand/-empfang und Durchsuchen über OBEX (Object Exchange) sowie Pairing. Vorkompilierte Pakete:

<!-- source:en p13 unit:48 -->

```text
blueman/
├── blueman_2.3.5-2_arm64.deb
└── blueman-dbgsym_2.3.5-2_arm64.deb

packages-patches/blueman/
├── 0001-Blueman-Fix-DisplayPasskey-for-Keyboard.patch
└── 0002-Don-t-turn-off-the-bt-power.patch
```

<!-- source:en p13 unit:49 -->

Rockchip aktualisierte Blueman hauptsächlich zur Behebung von Problemen bei Schlafmodus und Aufwachen von Bluetooth-Geräten wie Tastaturen und Lautsprechern. Viele Drittprogramme für Bluetooth und Wi-Fi versuchen außerdem, die Stromversorgung der Module über /dev/rfkill zu steuern. Die Rockchip-Plattform verwendet jedoch nicht standardisierte Herstellertreiber, die besondere Initialisierungsschritte benötigen und nach erneutem Einschalten möglicherweise nicht korrekt funktionieren. SDK-Skripte verwalten deshalb Stromversorgung und Initialisierung der Wi-Fi-/Bluetooth-Module unabhängig, um Eingriffe durch Drittsoftware zu vermeiden.

<!-- source:en p13 unit:50 -->

### 5.2 Media Process Platform (MPP)

<!-- source:en p13 unit:51 -->

Rockchip bietet mit Media Process Platform (MPP) eine allgemeine Medienverarbeitungsplattform für seine Chipfamilie. Sie verbirgt die Komplexität chipbezogener Verarbeitung auf niedriger Ebene vor Anwendungen, gleicht Chipunterschiede aus und stellt eine einheitliche Media Process Interface (MPI) bereit. MPP bietet Decodierung von H.265 / H.264 / H.263 / VP9 / VP8 / MPEG-4 / MPEG-2 / MPEG-1 / VC1 / MJPEG / AV1; Codierung von H.265 / H.264 / VP8 / MJPEG; Videoverarbeitung durch Kopieren, Skalieren, Farbraumumwandlung und Deinterlacing. Für die Fehlersuche lassen sich folgende Schalter für detailliertere Protokolle aktivieren:

<!-- source:en p13 unit:52 -->

```text
export mpi_debug=1
export mpp_debug=1
export h264d_debug=1
export mpp_buffer_debug=2
```

<!-- source:en p13 unit:53 -->

Standardmäßig werden MPP-Protokolle nicht direkt im Terminal ausgegeben. Für die Terminalausgabe Folgendes setzen:

<!-- source:en p13 unit:54 -->

```text
export mpp_syslog_perror=1
```

<!-- source:en p13 unit:55 -->

Die Schalter für Debugprotokolle hängen von der Kernel-Version ab. Für 4.19/5.10/6.1 (Linux 4.19 und höher):

<!-- source:en p14 unit:56 -->

```text
echo 0x100 > /sys/module/rk_vcodec/parameters/mpp_dev_debug
cat /proc/kmsg
```

<!-- source:en p14 unit:57 -->

Für Kernel 4.4 (Linux 4.4):

<!-- source:en p14 unit:58 -->

```text
echo 0x100 > /sys/module/rk_vcodec/parameters/debug
cat /proc/kmsg
```

<!-- source:en p14 unit:59 -->

Nach diesen Befehlen wird die kernel-seitige Codier- und Decodierzeit pro Frame sichtbar. Das hilft bei Leistungsbewertung und Analyse von Ruckeln oder flüssiger Wiedergabe. Beispielausgabe:

<!-- source:en p14 unit:60 -->

```text
rk_vcodec: fdf80200.rkvdec:0 session 2269:34 time: 14870 us hw 5430 us
rk_vcodec: fdf80200.rkvdec:0 session 2269:34 time: 13157 us hw 4132 us
rk_vcodec: fdf80200.rkvdec:0 session 2269:34 time: 12976 us hw 4098 us
rk_vcodec: fdf80200.rkvdec:0 session 2269:34 time: 11295 us hw 4070 us
...
```

<!-- source:en p14 unit:61 -->

Weitere Informationen enthält die MPP-Entwicklungsdokumentation unter &lt;SDK&gt;/docs/Linux/Multimedia. Debian integriert folgende vorkompilierte Pakete:

<!-- source:en p14 unit:62 -->

```text
mpp/
├── librockchip-mpp-dev_1.5.0-1_arm64.deb
├── librockchip-mpp1-dbgsym_1.5.0-1_arm64.deb
├── librockchip-mpp1_1.5.0-1_arm64.deb
├── librockchip-vpu0-dbgsym_1.5.0-1_arm64.deb
├── librockchip-vpu0_1.5.0-1_arm64.deb
├── rockchip-mpp-demos-dbgsym_1.5.0-1_arm64.deb
└── rockchip-mpp-demos_1.5.0-1_arm64.deb
```

<!-- source:en p14 unit:63 -->

Unter Debian lässt sich MPP mit Rockchips eigenem Rockit-Framework und Drittanbieter-Multimediaframeworks wie GStreamer für leistungsfähige Medienverarbeitung integrieren. Hinweis: Aufgrund urheberrechtlicher und kommerzieller Lizenzbeschränkungen unterstützt das offizielle Linux-SDK FFmpeg nicht.

<!-- source:en p14 unit:64 -->

### 5.3 libv4l

<!-- source:en p14 unit:65 -->

Ein v4l2-Plugin verbindet Chromium mit mpp für Hardwaredecodierung. Vorkompilierte Pakete:

<!-- source:en p14 unit:66 -->

```text
libv4l/
...
├── libv4l-0_1.22.1-5_arm64.deb
├── libv4l-0-dbgsym_1.22.1-5_arm64.deb
├── libv4l2rds0_1.22.1-5_arm64.deb
├── libv4l2rds0-dbgsym_1.22.1-5_arm64.deb
├── libv4lconvert0_1.22.1-5_arm64.deb
```

<!-- source:en p15 unit:67 -->

```text
├── libv4lconvert0-dbgsym_1.22.1-5_arm64.deb
├── libv4l-dev_1.22.1-5_arm64.deb
├── libv4l-rkmpp_1.5.1-1.1_arm64.deb
├── libv4l-rkmpp-dbgsym_1.5.1-1.1_arm64.deb
├── v4l-utils_1.22.1-5_arm64.deb
└── v4l-utils-dbgsym_1.22.1-5_arm64.deb
```

<!-- source:en p15 unit:68 -->

Das Drittanbieterpaket v4l-utils benötigt folgende Patches:

<!-- source:en p15 unit:69 -->

```text
├── 0001-libv4l2-Support-mmap-to-libv4l-plugin.patch
├── 0002-libv4l-mplane-Filter-out-multiplane-formats.patch
├── 0003-libv4l-add-V4L2_MEMORY_DMABUF-memory-support.patch
├── 0004-libv4l-mplane-plugin-add-exbuf_ioctl-for-dmabuf.patch
├── 0005-video-max-frame-change-from-32-to-64.patch
├── 0006-Support-builtin-v4l-plugins.patch
├── 0007-libv4l-Disallow-conversion-by-default.patch
```

<!-- source:en p15 unit:70 -->

Anschließend libv4l-rkmpp kompilieren, das Plugin zur Verbindung von libv4l mit mpp.

<!-- source:en p15 unit:71 -->

### 5.4 Chromium

<!-- source:en p15 unit:72 -->

Der in Debian integrierte Chromium-Browser wird auf Yocto-Basis kompiliert.

<!-- source:en p15 unit:73 -->

```text
chromium/
└── chromium-x11_126.0.6478.126_arm64/armhf.deb
```

<!-- source:en p15 unit:74 -->

Chromium unterstützt H264, VP8, VP9, AV1 und weitere Videoformate; ab Version 105 kommt H265 hinzu. Unter Debian erfolgt Hardwaredecodierung über angepasstes Chromium, ein V4L2-Plugin und MPP. Hauptänderungen: v4l2 vda in Chromium samt zugehörigen Patches aktivieren und das v4l2-mpp-Plugin hinzufügen. Nachteile: a) Decodierung nur für vp8, h264, h265, vp9, av1; b) Codierung nur für vp8 und h264; c) angepasste Chromium-Kompilierung einschließlich Yocto-Buildprozess erforderlich. Chromium-wayland-Patches für Yocto, buildroot und andere Systeme werden bereitgestellt. Chromium-Version: root@linaro-alip:~# chromium --version; Ausgabe: Chromium 126.0.6478.126 stable.

```text
root@linaro-alip:~# chromium --version
Chromium 126.0.6478.126 stable
```

<!-- source:en p16 unit:75 -->

### 5.5 glmark2

<!-- source:en p16 unit:76 -->

```text
glmark2/
├── glmark2-data_2023.01+dfsg-1_all.deb
├── glmark2-drm-dbgsym_2023.01+dfsg-1_arm64.deb
├── glmark2-drm_2023.01+dfsg-1_arm64.deb
├── glmark2-es2-drm-dbgsym_2023.01+dfsg-1_arm64.deb
├── glmark2-es2-drm_2023.01+dfsg-1_arm64.deb
├── glmark2-es2-wayland-dbgsym_2023.01+dfsg-1_arm64.deb
├── glmark2-es2-wayland_2023.01+dfsg-1_arm64.deb
├── glmark2-es2-x11-dbgsym_2023.01+dfsg-1_arm64.deb
├── glmark2-es2-x11_2023.01+dfsg-1_arm64.deb
├── glmark2-wayland-dbgsym_2023.01+dfsg-1_arm64.deb
├── glmark2-wayland_2023.01+dfsg-1_arm64.deb
├── glmark2-x11-dbgsym_2023.01+dfsg-1_arm64.deb
└── glmark2-x11_2023.01+dfsg-1_arm64.deb
```

<!-- source:en p16 unit:77 -->

Glmark2 ist ein Open-Source-Benchmark für OpenGL 2.0 und ES 2.0, meist zur GPU-Bewertung. Der offene Glmark2-Code ist für entsprechende Tests in Debian integriert.

<!-- source:en p16 unit:78 -->

```text
usr/local/bin/test_glmark2_*.sh
├── test_glmark2_fullscreen.sh  ### Full screen test
├── test_glmark2_normal.sh ### Default display resolution test at 800x600
├── test_glmark2_offscreen.sh ### Screenless test

root@linaro-alip:~# test_glmark2_normal.sh
arm_release_ver: g24p0-00eac0, rk_so_ver: 3
=======================================================
    glmark2 2023.01
=======================================================
    OpenGL Information
    GL_VENDOR:      ARM
    GL_RENDERER:    Mali-G610
    GL_VERSION:     OpenGL ES 3.2 v1.g24p0-
00eac0.98fbd14bd397c6bd1b57c689f07cf638
    Surface Config: buf=24 r=8 g=8 b=8 a=0 depth=24 stencil=0 samples=0
    Surface Size:   1080x1920 fullscreen
=======================================================
[build] use-vbo=false:
---
```

<!-- source:en p16 unit:79 -->

Weitere Nutzungsmöglichkeiten stehen in der Hilfe.

<!-- source:en p16 unit:80 -->

```text
root@linaro-alip:~# glmark2-es2 --help
A benchmark for Open GL (ES) 2.0

Options:
  -b, --benchmark BENCH  A benchmark or options to run: '(scene)?(:opt1=val1)*'
                         (the option can be used multiple times)
  -f, --benchmark-file F Load benchmarks to run from a file containing a
                         list of benchmark descriptions (one per line)
```

<!-- source:en p17 unit:81 -->

```text
(the option can be used multiple times)
    --validate         Run a quick output validation test instead of
                       running the benchmarks
    --data-path PATH   Path to glmark2 models, shaders and textures
                       Default: /usr/share/glmark2
    --frame-end METHOD How to end a frame [default,none,swap,finish,readpixels]
    --off-screen       Render to an off-screen surface
    --visual-config C  The visual configuration to use for the rendering
                       target: 'red=R:green=G:blue=B:alpha=A:buffer=BUF'.
                       The parameters may be defined in any order, and any
                       omitted parameters assume a default value of '1'
    --reuse-context    Use a single context for all scenes
                       (by default, each scene gets its own context)
-s, --size WxH         Size of the output window (default: 800x600)
    --fullscreen       Run in fullscreen mode (equivalent to --size -1x-1)
-l, --list-scenes      Display information about the available scenes
                       and their options
    --show-all-options Show all scene option values used for benchmarks
                       (only explicitly set options are shown by default)
    --run-forever      Run indefinitely, looping from the last benchmark
                       back to the first
    --annotate         Annotate the benchmarks with on-screen information
                       (same as -b :show-fps=true:title=#info#)
-d, --debug            Display debug messages
-h, --help             Display help
```

<!-- source:en p17 unit:82 -->

### 5.6 gst-rkmpp

<!-- source:en p17 unit:83 -->

GStreamer-Rockchip ist eine auf Rockchip angepasste GStreamer-Middleware zur Audio-/Videocodierung und -decodierung, hauptsächlich über die mpp-Schnittstelle. Vorkompilierte GStreamer-Rockchip-Pakete:

<!-- source:en p17 unit:84 -->

```text
gst-rkmpp/
├── gstreamer1.0-rockchip1-dbgsym_1.14-4_arm64.deb
└── gstreamer1.0-rockchip1_1.14-4_arm64.deb
```

<!-- source:en p17 unit:85 -->

### 5.7 GStreamer

<!-- source:en p17 unit:86 -->

GStreamer enthält das Kernframework und Kernkomponenten. Der Patch für GStreamer 1.22.0 fügt DMABUF als Teil des Systemspeichers hinzu, macht Speicheroperationen flexibler und effizienter und behebt Hänger bei Videowiedergabe in Schleife. Zugehörige Patches:

<!-- source:en p17 unit:87 -->

```text
├── 0001-filesrc-Fix-stopping-race-in-pull-mode.patch
├── 0002-HACK-gstpad-Add-1-sec-timeout-for-activation.patch
├── 0003-HACK-caps-Consider-dmabuf-subset-of-system-memory.patch
├── 0004-gst-launch-Fix-random-hang-when-EOS.patch
```

<!-- source:en p18 unit:88 -->

### 5.8 gst-plugins-base1.0

<!-- source:en p18 unit:89 -->

gst1-plugins-base gehört zu GStreamer und stellt grundlegende Medienverarbeitungsplugins bereit. Auf Basis des offiziellen gst-plugins-base werden Leistung, Kompatibilität und Funktionen bei Decodierung, Wiedergabe, Videorendering, Oberflächenverwaltung und Dateiformaten verbessert. Hauptänderungen: Beschränkung bestimmter Decoder auf drained-Signale nur im obersten Container aufgehoben; playbin/playbin2 bei Endsignalen, Vermeidung der Pufferleerung beim ersten Ende, Deadlocks und Videozustandswechseln verbessert; DMABUF-Rendering insbesondere in xvimagesink ergänzt; Rockchip-RGA-2D-Beschleunigung im video-converter unterstützt; direkter DMABUF-Import im gl-Plugin auch ohne EGLImage; DirectDmabufExternal im OpenGL-Uploader bevorzugt; NV12_10LE40 unterstützt; Fensterdekoration in xvimagesink abschaltbar; Position des obersten Fensters angewendet; expose-Neuzeichnen vor Videobereitschaft ignoriert; bevorzugte Audio-/Videoempfänger unterstützt; ADPCM-Bitratenberechnung in RIFF korrigiert; QoS standardmäßig deaktivierbar; NV16_10LE40 hinzugefügt. Patches für gst-plugins-base1.0-1.22.0:

<!-- source:en p18 unit:90 -->

```text
gst1-plugins-base
├── 0001-Revert-decodebin-only-emit-drained-signal-when-top-c.patch
├── 0002-playbin2-send-one-about-to-finish-per-group.patch
├── 0003-playbin-do-not-drain-on-first-EOS.patch
├── 0004-playbin2-Fix-deadlock-when-hooking-about-to-finish-s.patch
├── 0005-playbin3-Fix-Qt-videoplayer-cannot-change-video-stat.patch
├── 0006-playbin2-Add-preferred-audio-video-sink.patch
├── 0007-HACK-xvimagesink-Support-dma-buffer-rendering.patch
├── 0008-video-converter-Support-rockchip-RGA-2D-accel.patch
├── 0009-HACK-gl-egl-allow-direct-dmabuf-import-when-unable-t.patch
├── 0010-glupload-dmabuf-prefer-DirectDmabufExternal-uploader.patch
├── 0011-videoconvert-Support-preferred-formats.patch
├── 0012-glupload-Support-NV12_10LE40-and-NV12-NV12_10LE40-NV.patch
├── 0013-xvimagesink-Defer-prepare-window-when-getting-zero-w.patch
├── 0014-riff-Fix-bps-caculation-error-for-ADPCM.patch
├── 0015-xvimagesink-Allow-disabling-decorations.patch
├── 0016-xvimagesink-Apply-toplevel-window-s-position.patch
├── 0017-xvimagesink-Ignore-expose-redraw-when-video-not-read.patch
```

<!-- source:en p19 unit:91 -->

```text
├── 0018-gl-x11-Honor-render-rectangle-for-toplevel-window.patch
├── 0019-gl-wayland-Honor-render-rectangle-for-toplevel-windo.patch
├── 0020-gl-x11-Allow-disabling-decorations-for-toplevel-wind.patch
├── 0021-gst-libs-Support-NV16_10LE40.patch
├── 0022-videodecoder-Allow-disabling-QoS-by-default.patch
```

<!-- source:en p19 unit:92 -->

### 5.9 gst-plugins-bad1.0

<!-- source:en p19 unit:93 -->

Die Patches unter gst1-plugins-bad1.0 verbessern GStreamers erweiterten Pluginsatz hinsichtlich Video/Audio, Fensterverwaltung, Leistung und Kompatibilität. Änderungen: VUI-Lesefehler im H.265-Parser korrigiert; mögliches VC1-Speicherleck unter bestimmten Bedingungen behoben; MPEG-Video in einzelne Frames aufteilbar; Wayland und KMS einschließlich Fensterposition, Hierarchie, Transparenz, Füll- und Synchronisationsmodus verbessert; Fehler bei Vorbereitung, Anzeige und Vollbild von Wayland-Fenstern behoben; MPEG-TS-Demultiplexer für PCR-Gruppen mit großen Lücken optimiert; mögliches doppeltes Schließen geteilter KMS-Ressourcenhandles behoben; NV12_10LE40, NV16_10LE40 und weitere Formate ergänzt; beschädigte PCR-Streams ignorierbar; Rockchip-Treiber, HDR und Plattformoptimierungen hinzugefügt; KMS vermeidet unverbundene Anschlüsse und unterstützt Skalierung/Vollbild bei der Moduseinstellung; JPEG-Parser bei automatischem Einfügen durch parsebin erlaubt; DMABUF in Wayland, transparentes Video und Touch-Zeiger unterstützt. Auf Basis des offiziellen gst-plugins-bad sind kmssink, waylandsink sowie Rockchip-Anpassungen und Fehlerkorrekturen ergänzt. Patches für gst-plugins-bad1.0-1.22.0:

<!-- source:en p19 unit:94 -->

```text
gst1-plugins-bad
├── 0001-h265parser-Fix-read-vui-error.patch
├── 0002-interim-fix-vc1-stream-may-memory-leak-when-pending.patch
├── 0003-waylandsink-release-frame-callback-when-finalizing.patch
├── 0004-kmssink-Support-render-rectangle-for-plane.patch
├── 0005-kmssink-Request-window-handle.patch
├── 0006-waylandsink-Support-place-below-above.patch
├── 0007-waylandsink-Enable-changing-window-handle.patch
```

<!-- source:en p20 unit:95 -->

```text
├── 0008-kmssink-Support-setting-plane-zpos.patch
├── 0009-waylandsink-Support-setting-toplevel-window-position.patch
├── 0010-HACK-gstmpegvideoparse-Split-every-picture.patch
├── 0011-mpegtsdemux-Create-new-PCR-group-for-big-gap.patch
├── 0012-gstjpegparse-Allow-parsebin-to-use-it-for-autopluggi.patch
├── 0013-waylandsink-Drop-frame-when-window-not-ready.patch
├── 0014-waylandsink-Fix-random-crash.patch
├── 0015-camerabin2-Support-setting-default-filters.patch
├── 0016-waylandsink-Defer-prepare-window-when-getting-zero-w.patch
├── 0017-mpegts-Support-ignoring-broken-PCR-streams-by-defaul.patch
├── 0018-waylandsink-Fix-crash-when-setting-fullscreen-proper.patch
├── 0019-waylandsink-Support-window-layer-property.patch
├── 0020-waylandsink-Support-window-alpha-property.patch
├── 0021-waylandsink-Support-window-fill-mode-property.patch
├── 0022-HACK-kmssink-Open-drm-devnode-directly.patch
├── 0023-waylandsink-Use-create_immed-to-create-dmabuf.patch
├── 0024-waylandsink-Support-frame-sync-mode.patch
├── 0025-kmssink-Support-NV12_10LE40-and-NV12-NV12_10LE40-NV1.patch
├── 0026-waylandsink-Support-NV12_10LE40-and-NV12-NV12_10LE40.patch
├── 0027-waylandsink-Use-the-correct-video-info-to-access-all.patch
├── 0028-waylandsink-Prefer-to-use-waylandsink.patch
├── 0029-kmssink-Avoid-double-closing-shared-gem-handle.patch
├── 0030-kmssink-Support-ignoring-aspect-ratio.patch
├── 0031-kmssink-Support-setting-prefered-frame-syncing-mode.patch
├── 0032-waylandsink-Support-pointer-and-touch.patch
├── 0033-waylandsink-Parse-video-size-in-propose_allocation.patch
├── 0034-waylandsink-Wait-10s-for-toplevel-window-s-configure.patch
├── 0035-waylandsink-Fix-buffer-size-error-when-video-cropped.patch
├── 0036-HACK-waylandsink-Set-size-in-wl_subsurface_set_posit.patch
├── 0037-waylandsink-Support-transparent-video.patch
├── 0038-kmssink-Improve-monitor-and-plane-selection.patch
├── 0039-kmssink-Support-scaling-in-modesetting.patch
├── 0040-kmssink-Support-fullscreen-prop.patch
├── 0041-av1parser-Don-t-consider-unknown-metadata-OBUs-a-bit.patch
├── 0042-kmssink-Avoid-src-size-overflow.patch
├── 0043-waylandsink-Support-force-trying-dmabuf.patch
├── 0044-kmssink-Support-NV16_10LE40.patch
```

<!-- source:en p20 unit:96 -->

### 5.10 gst-plugins-good1.0

<!-- source:en p20 unit:97 -->

Die Patches unter gst1-plugins-good1.0 passen den „good“-Pluginsatz, insbesondere v4l2 und rga, an Rockchip-Funktionen und Fehlerkorrekturen an. Ergänzt wurden Rockchip-RGA-2D-Beschleunigung für Videospiegelung, Standardvideogerät, Filterung nicht verfügbarer Rockchip-Quellen, maximale Aufnahmeauflösung, ein höheres VIDEO_MAX_FRAME-Limit für mehr Framepuffer, minimale V4L2-Pufferanzahl sowie konfigurierbare gemeinsame Puffernutzung.

<!-- source:en p21 unit:98 -->

Das Überspringen der Puffercache-Bereinigung erhöht die Leistung der V4L2-Quelle. Patches für gst-plugins-good1.0-1.22.0:

<!-- source:en p21 unit:99 -->

```text
gst1-plugins-good/
├── 0001-qtdemux-don-t-skip-the-stream-duration-longer-than-3.patch
├── 0002-HACK-flacparse-Handle-metadata-127.patch
├── 0003-autodetect-Add-preferred-for-autovideosink-autoaudio.patch
├── 0004-v4l2-Support-preferred-formats.patch
├── 0005-video-flip-Support-Rockchip-RGA-2D-accel.patch
├── 0006-v4l2src-Support-setting-default-device.patch
├── 0007-v4l2src-Filter-out-unavailable-RK-sources.patch
├── 0008-v4l2src-Support-setting-max-resolution.patch
├── 0009-matroska-demux-parse-Disable-QoS-lace-skipping-by-de.patch
├── 0010-v4l2-Increase-VIDEO_MAX_FRAME-to-64.patch
├── 0011-v4l2-Support-setting-v4l2-min-buffers.patch
├── 0012-v4l2-Support-disabling-buffer-sharing.patch
```

<!-- source:en p21 unit:100 -->

### 5.11 libdrm

<!-- source:en p21 unit:101 -->

Änderungen gegenüber der offiziellen LIBDRM: Standardmäßig wird das Rockchip-DRM-Gerät geöffnet; DRM-Authentifizierungs-APIs wie drmGetBusid, drmSetBusid, drmGetMagic, drmAuthMagic, drmSetInterfaceVersion, drmSetMaster und drmDropMaster werden standardmäßig umgangen. LIBDRM ist eine treiberübergreifende Middleware, über die Userspace-Anwendungen wie Mesa und 2D-Treiber mittels DRI-Protokoll mit dem Kernel kommunizieren. Die folgende Abbildung zeigt die DRM-Struktur:

<!-- source:en p22 unit:102 -->

![libdrm](/docs/rockchip-debian/assets/en-p022-figure-01.png)

<!-- source:en p22 unit:103 -->

Vorkompilierte libdrm-Pakete:

<!-- source:en p22 unit:104 -->

```text
libdrm
├── libdrm2_2.4.114-1_arm64.deb
├── libdrm2-dbgsym_2.4.114-1_arm64.deb
├── libdrm-common_2.4.114-1_all.deb
├── libdrm-dev_2.4.114-1_arm64.deb
├── libdrm-tests_2.4.114-1_arm64.deb
└── libdrm-tests-dbgsym_2.4.114-1_arm64.deb
```

<!-- source:en p22 unit:105 -->

Patches:

<!-- source:en p22 unit:106 -->

```text
├── 0001-tests-meson.build-disable-nouveau-tests-for-static-b.patch
├── 0002-modetest-Speed-up-dumping-info.patch
├── 0003-HACK-Open-Rockchip-drm-device-by-default.patch
├── 0004-HACK-Bypass-auth-APIs-by-default.patch
```

<!-- source:en p22 unit:107 -->

### 5.12 libdrm-cursor

<!-- source:en p22 unit:108 -->

Dieses Paket behandelt Probleme der RK3566/RK3568 mit ausschließlich AFBC-Ebenen. Drei Hauptfunktionen: Da VOP keine Mausebene besitzt, dient eine Overlay-Ebene als Cursor; Overlay-Anzeige im AFBC-Format; Behandlung von Grenzüberschreitungen des Mauszeigers.

<!-- source:en p23 unit:109 -->

Konfigurationsmöglichkeiten von drm-cursor:

<!-- source:en p23 unit:110 -->

```text
$cat /etc/drm-cursor.conf

# Configure file for libdrm-cursor.
#
#debug=
# log-file=
# hide=1 # hide cursors
# atomic=0 # disable atomic drm API
# max-fps=60
# allow-overlay=1 # allowing overlay planes
# prefer-afbc=0 # prefer plane with AFBC modifier supported
# num-surfaces=8 # num of egl surfaces to avoid edge moving corruption
# prefer-plane=65
# prefer-planes=61,65
# crtc-blocklist=64,83
```

<!-- source:en p23 unit:111 -->

Standardprotokoll: /var/log/drm-cursor.log. Vorkompilierte libdrm-cursor-Pakete:

<!-- source:en p23 unit:112 -->

```text
libdrm-cursor/
├── libdrm-cursor-dbgsym_1.4.1-1_arm64.deb
├── libdrm-cursor-dev_1.4.1-1_arm64.deb
└── libdrm-cursor_1.4.1-1_arm64.deb
```

<!-- source:en p23 unit:113 -->

### 5.13 libmali

<!-- source:en p23 unit:114 -->

libmali ist das SDK für ARM-Mali-GPUs. Rockchip stellt vorkompilierte libmali-Debian-Pakete zur Vereinfachung der Entwicklung bereit. Mali ist eine auf offenen Standards beruhende Plattform für 2D-/3D-Rendering und allgemeine GPU-Berechnungen (GPGPU). Rockchip Linux unterstützt OpenGL ES 1.1, 2.0, 3.2; Vulkan 1.0, 1.1; OpenCL 2.0. OpenGL-ES-Unterstützung bedeutet nicht Unterstützung der vollständigen OpenGL-API. Paketnamen folgen dem Muster GPU-Modell - Softwareversion - Hardwareversion (falls unterschieden, etwa r1p0 für RK3288/RK3288w) - Kompilierungsoptionen. Die Version ohne Suffix ist x11-gbm. GBM ist eine DRM-basierte Speicherverwaltung für EGLFS ohne Abhängigkeit von X11- oder Wayland-Diensten. Wayland und Wayland-gbm dienen der Wayland-Anzeigeumgebung.

<!-- source:en p24 unit:115 -->

Die dummy-Version dient hauptsächlich der rockit-Multimediaentwicklung. Unterstützte API-Typen unterscheiden sich je nach Chip; Einzelheiten stehen im jeweiligen Chiphandbuch.

<!-- source:en p24 unit:116 -->

```text
libmali/
├── libmali-valhall-g610-g13p0-dummy-dbgsym_1.9-1_arm64.deb
├── libmali-valhall-g610-g13p0-dummy_1.9-1_arm64.deb
├── libmali-valhall-g610-g13p0-gbm-dbgsym_1.9-1_arm64.deb
├── libmali-valhall-g610-g13p0-gbm_1.9-1_arm64.deb
├── libmali-valhall-g610-g13p0-wayland-gbm-dbgsym_1.9-1_arm64.deb
├── libmali-valhall-g610-g13p0-wayland-gbm_1.9-1_arm64.deb
├── libmali-valhall-g610-g13p0-x11-gbm-dbgsym_1.9-1_arm64.deb
├── libmali-valhall-g610-g13p0-x11-gbm_1.9-1_arm64.deb
...
```

<!-- source:en p24 unit:117 -->

### 5.14 RGA

<!-- source:en p24 unit:118 -->

Rockchip RGA ist eine unabhängige 2D-Rasterbeschleunigungseinheit für Punkte/Linien, Skalierung, Drehung, Bitmaps, Bildkomposition und weitere 2D-Operationen. Vorkompilierte Pakete folgen. RGA eignet sich für RK-Kernel 4.4 und ältere Versionen und entspricht hauptsächlich dem im2d-Zweig des linux-rga-Repositories. RGA2 eignet sich für RK-Kernel 4.19, 5.10, 6.1 und neuere Versionen, hauptsächlich dem Zweig multi_rga_im2d_api von linux-rga.

<!-- source:en p24 unit:119 -->

```text
rga/
├── librga-dev_2.1.0-1_arm64.deb
├── librga2-deb
└── librga2_2.1.0-1_arm64.deb

rga2
├── librga2_2.2.0-1_arm64.deb
├── librga2-dbgsym_2.2.0-1_arm64.deb
└── librga-dev_2.2.0-1_arm64.deb
```

<!-- source:en p24 unit:120 -->

### 5.15 Openbox

<!-- source:en p24 unit:121 -->

Openbox ist ein schlanker X11-Fenstermanager. Die offizielle Version wurde um Umrissverschiebung und Begrenzung des Verschiebungsintervalls erweitert.

<!-- source:en p25 unit:122 -->

```text
Modify /home/linaro/.config/openbox/lxde-rc.xml to wireframe, change the
drawContents content:
<drawContents>yes</drawContents> to <drawContents>no</drawContents>

Set moveInterval to limit the interval of window movement:
<moveInterval>50</moveInterval>
```

<!-- source:en p25 unit:123 -->

Weitere Informationen unter Openbox. Vorkompiliertes Paket:

<!-- source:en p25 unit:124 -->

```text
openbox/
└── openbox_3.6.1-10_arm64.deb
```

<!-- source:en p25 unit:125 -->

### 5.16 pcmanfm

<!-- source:en p25 unit:126 -->

Ein schlanker Dateimanager für leichte Desktopumgebungen wie LXDE (Lightweight X11 Desktop Environment). Gegenüber der offiziellen Version wurde Umrissunterstützung ergänzt. Vorkompilierte Pakete:

<!-- source:en p25 unit:127 -->

```text
pcmanfm/
├── pcmanfm_1.3.2-1_arm64.deb
└── pcmanfm-dbgsym_1.3.2-1_arm64.deb
```

<!-- source:en p25 unit:128 -->

### 5.17 Pipewire

<!-- source:en p25 unit:129 -->

Pipewire ist ein offenes Multimedia-Serviceframework für flexible Audio-/Videopipelines mit niedriger Latenz unter modernem Linux. Es soll ältere Frameworks wie PulseAudio und JACK Audio Connection Kit durch eine modernere, effizientere Lösung ersetzen. Das pipewire-Paket wurde hauptsächlich wegen Aufnahmerauschen im offiziellen Debian 12 aktualisiert; Einzelheiten im offiziellen Fehlerbericht. Vorkompilierte Pakete:

<!-- source:en p25 unit:130 -->

```text
pipewire/
└── libspa-0.2-modules_0.3.65-3+deb12u1_arm64.deb
```

<!-- source:en p25 unit:131 -->

### 5.18 wireplumber

<!-- source:en p25 unit:132 -->

WirePlumber ist ein offenes Audio-/Video-Routingwerkzeug auf PipeWire-Basis mit flexiblen Pipelines zur Streamverarbeitung. Die Änderungen der offiziellen Version passen hauptsächlich die automatische Audioumschaltung an. Vorkompilierte Pakete:

<!-- source:en p26 unit:133 -->

```text
wireplumber/
├── gir1.2-wp-0.4_0.4.13-1_arm64.deb
├── libwireplumber-0.4-0_0.4.13-1_arm64.deb
├── libwireplumber-0.4-0-dbgsym_0.4.13-1_arm64.deb
├── libwireplumber-0.4-dev_0.4.13-1_arm64.deb
├── wireplumber_0.4.13-1_arm64.deb
├── wireplumber-dbgsym_0.4.13-1_arm64.deb
└── wireplumber-doc_0.4.13-1_all.deb
```

<!-- source:en p26 unit:134 -->

### 5.19 Rockchip Automatic Image Quality

<!-- source:en p26 unit:135 -->

Ausgeschrieben Rockchip Automatic Image Quality: automatische Anpassung des Bildsignalprozessors. Realisiert hauptsächlich Camera-3A-Funktionen für ISP2.x-Chips wie RK3588, RK3576, RK356X und weitere. Vorkompilierte Pakete:

<!-- source:en p26 unit:136 -->

```text
rkaiq/
├── camera_engine_rkaiq_rk3562_arm64.deb ##Suitable for RK3562 series chips
├── camera_engine_rkaiq_rk3568_arm64.deb ##Suitable for RK3566/RK3568 series
chips
├── camera_engine_rkaiq_rk3576_arm64.deb ##Suitable for RK3576 series chips
└── camera_engine_rkaiq_rk3588_arm64.deb ##Suitable for RK3588 series chips
```

<!-- source:en p26 unit:137 -->

### 5.20  rkisp

<!-- source:en p26 unit:138 -->

Ausgeschrieben Rockchip Image Signal Processor, ein Bildsignalprozessor. Realisiert hauptsächlich Camera-3A-Funktionen für ISP1.X-Chips wie RK3288, RK3399, RK3326 und PX30. Vorkompiliertes Paket:

<!-- source:en p26 unit:139 -->

```text
rkisp/
└──  camera_engine_rkisp_v2.3.0_arm64.deb
```

<!-- source:en p26 unit:140 -->

### 5.21  rknpu2

<!-- source:en p26 unit:141 -->

Ausgeschrieben Rockchip Neural Processing Unit, eine Verarbeitungseinheit für neuronale Netze. Für RKNPU zuerst das trainierte Modell mit RKNN-Toolkit2 auf dem Rechner in RKNN umwandeln, anschließend über RKNN C API oder Python API auf der Entwicklungsplatine bereitstellen. Der RKNN-Stack erleichtert KI-Modellbereitstellung auf Rockchip, etwa RK356X, RK3576 und RK3588. Integrationspaket:

<!-- source:en p26 unit:142 -->

```text
rknpu2/
└── rknpu2.tar
```

<!-- source:en p27 unit:143 -->

### 5.22  rkwifibt

<!-- source:en p27 unit:144 -->

Für Rockchip erprobte Wi-Fi-/Bluetooth-Module einschließlich Firmware, Werkzeugen und Konfigurationsdateien. Vorkompilierte Pakete:

<!-- source:en p27 unit:145 -->

```text
rkwifibt/
├── rkwifibt-broadcom-firmware_1.0.0-1_arm64.deb
├── rkwifibt-dev-tools-dbgsym_1.0.0-1_arm64.deb
└── rkwifibt-dev-tools_1.0.0-1_arm64.deb
```

<!-- source:en p27 unit:146 -->

### 5.23  rktoolkit

<!-- source:en p27 unit:147 -->

Der Rockchip-Werkzeugsatz rktoolkit umfasst io/update/vendor_storage/modetest/stressapptest/memtester/vendor_storage und weitere Werkzeuge. Vorkompilierte Pakete:

<!-- source:en p27 unit:148 -->

```text
rktoolkit/
├── rktoolkit_1.0.0-1_arm64.deb
└── rktoolkit-dbgsym_1.0.0-1_arm64.deb
```

<!-- source:en p27 unit:149 -->

### 5.24 X-Server

<!-- source:en p27 unit:150 -->

X-Server bezeichnet den Server der grafischen Oberfläche unter Linux. Desktopumgebungen wie XFCE, KDE und GNOME werden vom X-Server unterstützt. Debian verwendet die schlanke LXDE/XFCE-Umgebung. Es folgt ein Vergleich verfügbarer Linux-Desktopumgebungen und Fenstermanager:

<!-- source:en p28 unit:151 -->

| Desktopumgebung/Fenstermanager | Speicherverbrauch | CPU-Auslastung | Typ |
| --- | --- | --- | --- |
| KDE 4.6 | 363MB | 4% | Desktopumgebung |
| Unity | 271MB | 14% | Desktopumgebung |
| GNOME 3 | 193MB | 10% | Desktopumgebung |
| GNOME 2.x | 191MB | 1% | Desktopumgebung |
| XFCE 4.8 | 144MB | 10% | Desktopumgebung |
| LXDE | 85MB | 10% | Desktopumgebung |
| IceWM | 85MB | 2% | Desktopumgebung |
| Enlightenment (E17 Standard) | 72MB | 1% | Fenstermanager |
| Fluxbox | 69MB | 1% | Fenstermanager |
| OpenBox | 60MB | 1% | Fenstermanager |
| JWM | 58MB | 1% | Fenstermanager |

<!-- source:en p28 unit:152 -->

Rockchip erweitert den X-Server folgendermaßen. Grafikkartenauswahl: Eine dedizierte oder integrierte Grafik lässt sich manuell festlegen. Im Abschnitt OutputClass werden Geräte mit dem Treiber "rockchip" als primäre GPU bestimmt, um Anzeigefehler durch automatische Aufzählung zu vermeiden. Hardwarebeschleunigung: glamor und exa sind unterstützt. Glamor komponiert mit der GPU, exa mit Rockchip RGA 2D; exa ist standardmäßig auskommentiert und muss zur Nutzung aktiviert werden. Die Einstellungen liegen gewöhnlich unter /etc/X11/xorg.conf.d/20-modesetting.conf. Tearing-Vermeidung: FlipFB="always" aktiviert sie dauerhaft, kann aber bis zu 50% Leistung kosten. Optimierung: Die auskommentierte Option MaxFlipRate begrenzt Bildwiederholrate und Frameauslassungen, um Verluste zu mindern. EDID deaktivieren:

<!-- source:en p29 unit:153 -->

NoEDID="true" deaktiviert EDID, normalerweise bei fehlerhaften EDID-Daten des Monitors. Gammakorrektur: UseGammaLUT aktiviert eine Gamma-Lookup-Tabelle (LUT) zur Verbesserung der Farbdarstellung. Virtuelle Bildschirmgröße: Die auskommentierte Option VirtualSize legt die virtuelle Größe fest, die durch die VOP-Hardware skaliert wird. Ränder des physischen Bildschirms: Die auskommentierte Option Padding legt die leeren Bereiche an den Bildschirmrändern fest. Bildschirm- und Monitoreinstellungen: Ein Standardbildschirm und -monitor werden den zuvor definierten Geräten zugeordnet; die Standarddrehung ist "normal". Mit Rotate lassen sich normal, left, right und weitere Drehungen einstellen. Die Konfigurationsdatei folgt:

<!-- source:en p29 unit:154 -->

```text
### Use Rockchip DRM driver
Section "OutputClass"
    Identifier  "RockchipDRM"
    MatchDriver "rockchip"
    Option      "PrimaryGPU"     "yes"
EndSection

Section "Device"
    Identifier  "Rockchip Graphics"
    Driver      "modesetting"

### Use Rockchip RGA 2D HW accel
#    Option      "AccelMethod"    "exa"

### Use GPU HW accel
    Option      "AccelMethod"    "glamor"

    Option      "DRI"            "2"

### Set to "always" to avoid tearing, could lead to up 50% performance loss
    Option      "FlipFB"         "always"

### Limit flip rate and drop frames for "FlipFB" to reduce performance lost
#    Option      "MaxFlipRate"    "60"

    Option      "NoEDID"         "true"
    Option      "UseGammaLUT"    "true"

### Set virtual screen size (scaled by VOP hardware)
#    Option "VirtualSize" "DSI-1:600x1080"
```

<!-- source:en p30 unit:155 -->

```text
### Set physical display paddings <top,bottom,left,right>
#    Option "Padding" "DSI-1:180,300,300,540"

EndSection

Section "Screen"
    Identifier  "Default Screen"
    Device      "Rockchip Graphics"
    Monitor     "Default Monitor"
EndSection

### Valid values for rotation are "normal", "left", "right"
Section "Monitor"
    Identifier  "Default Monitor"
    Option      "Rotate"         "normal"
EndSection
```

<!-- source:en p30 unit:156 -->

Vorkompilierte Pakete:

<!-- source:en p30 unit:157 -->

```text
Debian10 xserver/
├── xserver-common_1.20.4-1+deb10u3_all.deb
├── xserver-xorg-core-dbgsym_1.20.4-1+deb10u3_arm64.deb
├── xserver-xorg-core_1.20.4-1+deb10u3_arm64.deb
├── xserver-xorg-dev_1.20.4-1+deb10u3_arm64.deb
├── xserver-xorg-legacy-dbgsym_1.20.4-1+deb10u3_arm64.deb
└── xserver-xorg-legacy_1.20.4-1+deb10u3_arm64.deb

Debian11 xserver/
├── xserver-common_1.20.11-1_all.deb
├── xserver-xorg-core-dbgsym_1.20.11-1_arm64.deb
├── xserver-xorg-core_1.20.11-1_arm64.deb
├── xserver-xorg-dev_1.20.11-1_arm64.deb
├── xserver-xorg-legacy-dbgsym_1.20.11-1_arm64.deb
└── xserver-xorg-legacy_1.20.11-1_arm64.deb

Debian12 xserver/
├── xserver-common_21.1.7-3_all.deb
├── xserver-xorg-core-dbgsym_21.1.7-3_arm64.deb
├── xserver-xorg-core_21.1.7-3_arm64.deb
├── xserver-xorg-dev_21.1.7-3_arm64.deb
├── xserver-xorg-legacy-dbgsym_21.1.7-3_arm64.deb
└── xserver-xorg-legacy_21.1.7-3_arm64.deb
```

<!-- source:en p30 unit:158 -->

Das Startprotokoll liegt unter /var/log/Xorg*. Die genaue Xserver-Version lässt sich wie folgt prüfen:

<!-- source:en p30 unit:159 -->

```text
root@linaro-alip:~# cat /var/log/Xorg.0.log |grep "X.Org X Server"
X.Org X Server 1.20.11
```

<!-- source:en p30 unit:160 -->

Die entsprechenden Änderungen von Rockchip lassen sich wie folgt prüfen:

<!-- source:en p31 unit:161 -->

```text
root@linaro-alip:~# cat /var/log/Xorg.0.log |grep xorg-server
[    26.786] xorg-server f805fe554 modesetting: Filter out invalid format
modifiers (https://www.debian.org/support)
```

<!-- source:en p31 unit:162 -->

### 5.25 Weston

<!-- source:en p31 unit:163 -->

Weston ist ein quelloffener Displayserver und eine Referenzimplementierung des Wayland-Protokolls. Änderungen gegenüber der offiziellen Version: dynamische Bildschirmzustandsverwaltung (Auflösung, Drehung, Ein/Aus, Einfrieren, Position); einstellbare Mauszeigergröße, da der ursprüngliche Zeiger bei hohen Auflösungen zu klein ist; Desktopsymbole; effiziente VNC-Bildschirmfreigabe; Spiegelmodus; virtuelle VTs auf Benutzerebene; beschnittene Bildschirme; Startanimation. Vorkompilierte Pakete:

<!-- source:en p31 unit:164 -->

```text
weston/
├── libweston-10-0_10.0.1-1_arm64.deb
├── libweston-10-0-dbgsym_10.0.1-1_arm64.deb
├── libweston-10-dev_10.0.1-1_arm64.deb
├── weston_10.0.1-1_arm64.deb
└── weston-dbgsym_10.0.1-1_arm64.deb
```

<!-- source:en p31 unit:165 -->

### 5.26 Wayland

<!-- source:en p31 unit:166 -->

Wayland ist ein neues offenes Anzeigeprotokoll und eine moderne Alternative zum traditionellen X Window System (X11). Auf Grundlage der neuesten offiziellen Version wurden wesentliche Erweiterungen umgesetzt: Unterstützung für wayland-egl und das Warten auf Sockets in Wayland-Clients. Vorkompilierte Pakete:

<!-- source:en p31 unit:167 -->

```text
wayland
├── libwayland-bin_1.21.0-1_arm64.deb
├── libwayland-client0_1.21.0-1_arm64.deb
├── libwayland-cursor0_1.21.0-1_arm64.deb
├── libwayland-dev_1.21.0-1_arm64.deb
├── libwayland-egl1_1.21.0-1_arm64.deb
├── libwayland-egl-backend-dev_1.21.0-1_arm64.deb
└── libwayland-server0_1.21.0-1_arm64.deb
```

<!-- source:en p32 unit:168 -->

## 6. Grundlagen der Debian-Entwicklung

<!-- source:en p32 unit:169 -->

### 6.1 Debian-Pakete neu erstellen

<!-- source:en p32 unit:170 -->

Ändern und Neupacken von Debian-Fremdpaketen: apt-get build-dep &lt;pkg&gt; installiert die Build-Abhängigkeiten; apt source &lt;pkg&gt; lädt den Quellcode des Pakets &lt;pkg&gt;; anschließend git anlegen und Patches anwenden; dpkg-buildpackage -b -uc -us -d erstellt und paketiert erneut. Das folgende Beispiel ändert das Xserver-Paket und erstellt die deb-Datei neu. Prüfen Sie, dass deb-src in /etc/apt/sources.list aktiviert ist, und aktualisieren Sie die Quellen mit apt update.

<!-- source:en p32 unit:171 -->

```text
- Install build dependencies
`apt-get build-dep xorg-server-source`

- Download Xorg-xserver source code
`apt source xorg-server-source`

- Create git and apply patches
$ cd xorg-server_*
$ git init && git add .
$ git commit -s "xxxxx"

- Start compiling and packaging deb
dpkg-buildpackage -b -uc -us -d
```

<!-- source:en p32 unit:172 -->

### 6.2 Debian-Build mit Docker

<!-- source:en p32 unit:173 -->

Der zugehörige Quellcode kann in Docker auf einem PC gebaut und zur einfachen Systemintegration als deb paketiert werden. Siehe &lt;SDK&gt;/docs/en/Linux/Docker/Rockchip_Developer_Guide_Debian_Docker_EN.pdf.

<!-- source:en p32 unit:174 -->

### 6.3 Partitionsverwaltung unter Debian

<!-- source:en p32 unit:175 -->

Debian unterstützt beim Start das Prüfen, Vergrößern und Einhängen von rootfs/oem/userdata. Die ergänzte resize-all.service ermöglicht die Größenanpassung von Partitionen verschiedener Formate.

<!-- source:en p33 unit:176 -->

Die Dienstdatei liegt unter /lib/systemd/system/resize-all.service, die wichtigsten Programme unter /usr/bin/resize-helper und /usr/bin/disk-helper. Das Debugprotokoll liegt unter /var/log/resize-all.log, beispielsweise:

<!-- source:en p33 unit:177 -->

```text
root@linaro-alip:~# cat /var/log/resize-all.log
Start resizing all internal mounted partitions
Log saved to /var/log/resize-all.log
[19]: Handling /dev/sda8 /userdata ext4 rw,relatime,stripe=128
[18]: Handling /dev/sda7 /oem ext4 rw,relatime
[0]: Handling /dev/sda6 / ext4 rw,relatime
[19]: Already resized /dev/sda8(ext4)
[18]: Already resized /dev/sda7(ext4)
[0]: Already resized /dev/sda6(ext4)
```

<!-- source:en p33 unit:178 -->

Beim normalen Einhängen bestimmt root=PARTUUID=614e0000-0000 in der Kernel-Kommandozeile die rootfs-Wurzelpartition. oem/userdata werden in /etc/fstab eingetragen und beim Start von systemd eingehängt.

<!-- source:en p33 unit:179 -->

```text
root@linaro-alip:/# cat /etc/fstab
/* <file system> <mount point>   <type>  <options>       <dump>  <pass> */
proc    /proc   proc    defaults        0 0
devtmpfs        /dev    devtmpfs        defaults        0 0
devpts  /dev/pts        devpts  mode=0620,ptmxmode=0666,gid=5   0 0
tmpfs   /dev/shm        tmpfs   nosuid,nodev,noexec     0 0
sysfs   /sys    sysfs   defaults        0 0
debugfs /sys/kernel/debug       debugfs defaults        0 0
pstore  /sys/fs/pstore  pstore  defaults      0 0
PARTLABEL=oem   /oem    ext4    defaults      0 2
PARTLABEL=userdata      /userdata       ext4  defaults  0 2

File system: Device name or UUID, or the path of a network file system (NFS).
Mount point: The mount point of the file system, such as / or /mnt/mydrive.
File system type: Such as ext4, ntfs, swap, etc.
Mount options: Options used when mounting, such as defaults, ro (read-only),
noatime, etc. Multiple options are separated by commas.
dump: This field is used for the dump command, usually set to 0, indicating no
backup is needed.
pass: This field is used for the fsck command, the number indicates the order of
fsck checking. The root file system is usually 1, other file systems are 2, set
to 0 means no check.
```

<!-- source:en p33 unit:180 -->

### 6.4 Anpassung der Debian-Grafik

<!-- source:en p33 unit:181 -->

Die Anzeige unterstützt derzeit hauptsächlich X11 und Wayland. Die wichtigsten Kombinationen sind nachfolgend aufgeführt. Standardkombination für X11:

<!-- source:en p33 unit:182 -->

```text
xfce4/lxde + xserver + lightdm
```

<!-- source:en p33 unit:183 -->

Standardkombination für WAYLAND:

<!-- source:en p34 unit:184 -->

```text
Weston+Wayland or gnome + Wayland + gdm3
```

<!-- source:en p34 unit:185 -->

#### 6.4.1 Anpassung der Anzeigearchitektur

<!-- source:en p34 unit:186 -->

X11/Xserver wird mit schlanken Desktopumgebungen wie LXDE/XFCE und dem Displaymanager lightdm kombiniert. GNOME arbeitet hauptsächlich mit dem WAYLAND-Anzeigeprotokoll und wird über gdm3 konfiguriert. Zum Testen von WAYLAND-Demos kann auf Weston umgeschaltet werden; dies entspricht dem über Buildroot oder Yocto im SDK erstellten Desktopsystem.

<!-- source:en p34 unit:187 -->

#### 6.4.2 Anpassung der Fensterverwaltung

<!-- source:en p34 unit:188 -->

Openbox ist ein schneller, schlanker, stark erweiterbarer und standardkonformer Fenstermanager. Openbox 3 wurde neu geschrieben und übernimmt keinen Code älterer vergleichbarer Software, obwohl es Blackbox ähnelt; Openbox 2 basierte auf Blackbox 0.65.0. Openbox kann eigenständig laufen oder den Standardfenstermanager von KDE/Gnome ersetzen. KWin ist ein X-Window-Fenstermanager und Teil der K Desktop Environment (KDE), kann aber auch eigenständig oder mit anderen Desktops verwendet werden. KDE 4 ergänzte Compositing und OpenGL. Xfwm4 ist der native Fenstermanager von Xfce4. Seine einfache, flexible pixelbasierte Theme-Engine nutzt .xpm-Bilder; weitere Optionen werden per Textdatei konfiguriert. Auch gtk-Themefarben sind auswählbar.

<!-- source:en p34 unit:189 -->

#### 6.4.3 Anpassung der Desktopumgebung

<!-- source:en p34 unit:190 -->

GNOME 3 unterscheidet sich erheblich von GNOME 2.x. Es ist relativ intuitiv: Über „Aktivitäten“ oben links oder eine Wischgeste werden Anwendungen, Arbeitsflächen usw. angezeigt. In den beschriebenen Distributionen, beispielsweise Debian, ist GNOME 3 der Standarddesktop. KDE bietet ein Windows-ähnliches Startmenü und eine aufwendige Oberfläche. Distributionen wie OpenSUSE, PCLinuxOS und Mandriva verwenden KDE als Standarddesktop.

<!-- source:en p35 unit:191 -->

XFCE benötigt weniger Ressourcen als GNOME und KDE, eignet sich für schlanke Desktops und ähnelt der Windows-Oberfläche. LXDE ist ebenfalls eine der vier großen Desktopumgebungen und besonders ressourcensparend.

<!-- source:en p35 unit:192 -->

#### 6.4.4 Anpassung von Chromium

<!-- source:en p35 unit:193 -->

Chromium unterstützt H264, VP8, VP9, AV1 und weitere Videoformate; seit Version 105 auch H265. Unter Debian wurde Hardwaredekodierung mittels angepasstem Chromium, V4L2-Plugin und MPP integriert. Hauptänderungen: v4l2 vda und zugehörige Patches aktivieren; v4l2-mpp-Plugin ergänzen. Einschränkungen: a) Dekodierung nur für vp8, h264, h265, vp9, av1; b) Kodierung nur für vp8 und h264; c) angepasster Chromium-Build erforderlich, vollständiger Build über Yocto. Chromium-Wayland-Patches für Yocto und Buildroot werden bereitgestellt. Ablauf: V4L2 VDA/VEA in Chromium aktivieren, beim Start einen virtuellen v4l2-Knoten erzeugen; v4l-utils fängt Chromiums Gerätezugriffe ab, leitet sie an v4l-rkmpp weiter und wandelt sie in mpp-Aufrufe um.

<!-- source:en p35 unit:194 -->

##### 6.4.4.1 Version

<!-- source:en p35 unit:195 -->

```text
root@linaro-alip:~# chromium --version
Chromium 126.0.6478.126 stable
```

<!-- source:en p35 unit:196 -->

##### 6.4.4.2 Testen

<!-- source:en p35 unit:197 -->

Führen Sie den Test mit folgendem Befehl aus:

<!-- source:en p35 unit:198 -->

```text
chromium --no-sandbox file:///usr/local/test.mp4
```

<!-- source:en p35 unit:199 -->

Das Testskript liegt unter /rockchip-test/chromium/test_chromium_with_video.sh.

<!-- source:en p36 unit:200 -->

```text
root@linaro-alip:~# /rockchip-test/chromium/test_chromium_with_video.sh
mpp[3048]: mpp_info: mpp version: 48962a10 author: Hongjin Li    2024-09-19
fix[avsd]: Fix attach dev error issue
[   73.431901] rk_vcodec: 27b00100.rkvdec:0 session 3129:1 time: 2893 us hw 2681
us
[   73.434160] rk_vcodec: 27b00100.rkvdec:0 session 3129:1 time: 2169 us hw 1935
us
[   73.437078] rk_vcodec: 27b00100.rkvdec:0 session 3129:1 time: 1500 us hw 1400
us
[   73.440013] rk_vcodec: 27b00100.rkvdec:0 session 3129:1 time: 1526 us hw 1497
us
[   73.441579] rk_vcodec: 27b00100.rkvdec:0 session 3129:1 time: 1345 us hw 1314
us
...
```

<!-- source:en p36 unit:201 -->

Unter Linux4.19/5.10/6.1+ lässt sich der Einsatz der Hardwaredekodierung mit folgendem Befehl prüfen:

<!-- source:en p36 unit:202 -->

```text
export mpp_syslog_perror=1
echo 0x100 > /sys/module/rk_vcodec/parameters/mpp_dev_debug
```

<!-- source:en p36 unit:203 -->

Unter Linux4.4 lässt sich der Einsatz der Hardwaredekodierung mit folgendem Befehl prüfen:

<!-- source:en p36 unit:204 -->

```text
export mpp_syslog_perror=1
echo 0x4 > /sys/module/rk_vcodec/parameters/debug
```

<!-- source:en p36 unit:205 -->

##### 6.4.4.3 Fehlersuche

<!-- source:en p36 unit:206 -->

Aktivieren Sie bei Problemen die folgenden Schalter, um zusätzliche Debugprotokolle zu erhalten.

<!-- source:en p36 unit:207 -->

```text
export mpi_debug=1
export mpp_debug=1
export h264d_debug=1
```

<!-- source:en p36 unit:208 -->

Ob Hardwarebeschleunigung verwendet wird, lässt sich anhand der GPU-Auslastung prüfen:

<!-- source:en p36 unit:209 -->

```text
cat /sys/devices/platform/*gpu/utilisation
```

<!-- source:en p36 unit:210 -->

Wenn Beschleunigung oder Hardwaredekodierung nicht genutzt werden, untersuchen Sie die Ursache genauer, etwa GPU-Probleme, libv4l-Anpassungen oder Berechtigungen. Erzeugen Sie beispielsweise die betreffenden Geräteknoten in /etc/init.d/rockchip.sh.

<!-- source:en p37 unit:211 -->

```text
/* Create dummy video node for chromium V4L2 VDA/VEA with rkmpp plugin */
echo dec > /dev/video-dec0
echo enc > /dev/video-enc0
chmod 660 /dev/video-*
chown root.video /dev/video-*

/* The chromium using fixed pathes for libv4l2.so */
ln -rsf /usr/lib/*/libv4l2.so /usr/lib/
[ -e /usr/lib/aarch64-linux-gnu/ ] && ln -Tsf lib /usr/lib64
```

<!-- source:en p37 unit:212 -->

Passen Sie außerdem die Berechtigungen der zugehörigen Kernelknoten in /etc/udev/rules.d/99-rockchip-permissions.rules an, beispielsweise:

<!-- source:en p37 unit:213 -->

```text
ACTION=="remove", GOTO="permissions_end"

/* VPU devices */
KERNEL=="avsd", MODE="0660", GROUP="video"
KERNEL=="vepu", MODE="0660", GROUP="video"
KERNEL=="h265e", MODE="0660", GROUP="video"
KERNEL=="rkvdec", MODE="0660", GROUP="video"
KERNEL=="rkvenc", MODE="0660", GROUP="video"
KERNEL=="mpp_service", MODE="0660", GROUP="video"
KERNEL=="vpu[_-]service", MODE="0660", GROUP="video"
KERNEL=="hevc[_-]service", MODE="0660", GROUP="video"

/* RGA device */
KERNEL=="rga", MODE="0660", GROUP="video"

/* MALI devices (/dev/mali for mali400) */
KERNEL=="mali*", MODE="0660", GROUP="video"
```

<!-- source:en p37 unit:214 -->

##### 6.4.4.4 Leistungstests

<!-- source:en p37 unit:215 -->

Standardmäßig wird die Anzeige per GPU beschleunigt. Für die Hardwarevideodekodierung aktiviert Chromium V4L2 VDA/VEA; beim Start wird ein virtueller V4L2-Knoten erzeugt. v4l-utils fängt die Gerätezugriffe ab und leitet sie an v4l-rkmpp weiter, das die mpp-Schnittstelle aufruft. Übliche Browsertests: ARES-6 misst die Ausführungszeit neuer JavaScript-Funktionen; schnell startende und flüssig laufende Browser haben Vorteile. Basemark Web 3.0 prüft umfassend die Ausführung von Webanwendungen, misst reale Clientleistung und erkennt Engpässe. JetStream 2:

<!-- source:en p38 unit:216 -->

JetStream 2 ist eine JavaScript- und WebAssembly-Testsuite für moderne Webanwendungen; schneller Start, schnelle Codeausführung und flüssiger Betrieb werden höher bewertet. MotionMark 1.2 misst, ob komplexe Szenen mit der Zielbildrate animiert werden können. Octane ist ein veralteter allgemeiner JavaScript-Benchmark. Er misst zwar die JS-Engine-Leistung, bildet deren Optimierung für moderne Webanwendungen jedoch ungenau ab. Octane-Optimierungen helfen realen Webseiten oft nicht und können sie sogar verlangsamen. Speedometer 2.1 misst die Reaktionsfähigkeit von Webanwendungen und simuliert Benutzeraktionen wie das Hinzufügen von Aufgaben. Gegenüber Octane bildet er die JS-Engine-Optimierung für moderne Anwendungen genauer ab.

<!-- source:en p38 unit:217 -->

##### 6.4.4.5 Weitere Informationen

<!-- source:en p38 unit:218 -->

Weitere Chromium-Informationen finden Sie unter chrome://about.

<!-- source:en p38 unit:219 -->

```text
List of Chrome URLs
chrome://about
...
chrome://flags
chrome://gcm-internals
chrome://gpu
chrome://help
chrome://histograms
chrome://history
chrome://indexeddb-internals
chrome://inspect
chrome://interstitials
chrome://invalidations
chrome://settings
chrome://version
chrome://webrtc-internals
chrome://webrtc-logs
List of chrome://internals pages
chrome://internals/web-app

For Debug
The following pages are for debugging purposes only. Because they crash or hang
the renderer, they're not linked directly; you can type them into the address bar
if you need them.

chrome://badcastcrash/
chrome://memory-exhaust/
```

<!-- source:en p39 unit:220 -->

```text
chrome://memory-pressure-critical/
chrome://memory-pressure-moderate/
...
chrome://quit/
chrome://restart/
```

<!-- source:en p39 unit:221 -->

#### 6.4.5 Panfrost-Anpassung für Debian

<!-- source:en p39 unit:222 -->

Siehe die offiziellen Debian-Informationen zur Panfrost-Anpassung.

<!-- source:en p39 unit:223 -->

### 6.5 Audio-/Videoanpassung unter Debian

<!-- source:en p39 unit:224 -->

Allgemeiner Ablauf der Videokodierung und -dekodierung auf Rockchip

<!-- source:en p39 unit:225 -->

```text
vpu_service  -->  mpp --> GStreamer/rockit --> app
vpu_service: Driver
mpp: The video encoding and decoding middleware on the Rockchip platform, refer
to the mpp documentation for details
GStreamer/rockit: Interface with app and other components
```

<!-- source:en p39 unit:226 -->

Unter Debian verbindet hauptsächlich GStreamer die Anwendungen mit den Kodier-/Dekodierkomponenten. Die Funktionen können auch direkt über mpp-Testschnittstellen wie mpi_dec_test und mpi_enc_test geprüft werden. mpp-Quellcode: &lt;SDK&gt;/external/mpp/; Testdemos: &lt;SDK&gt;/external/mpp/test. Siehe Rockchip_Developer_Guide_MPP_CN.pdf im SDK.

<!-- source:en p39 unit:227 -->

#### 6.5.1 Anpassung des PulseAudio-Audiopfads

<!-- source:en p39 unit:228 -->

Standardmäßig wird pulseaudio verwendet; normalerweise genügt die Konfiguration von /etc/pulse/default.pa. Das SDK unterstützt die Codecs ES8388 und RK809.

<!-- source:en p39 unit:229 -->

```text
+set-default-source alsa_input.platform-es8388-
sound.HiFi__hw_rockchipes8388__source
+set-default-sink alsa_output.platform-es8388-sound.HiFi__hw_rockchipes8388__sink
+set-default-source alsa_input.platform-rk809-
sound.HiFi__hw_rockchiprk809__source
+set-default-sink alsa_output.platform-rk809-sound.HiFi__hw_rockchiprk809__sink
```

<!-- source:en p39 unit:230 -->

Ermitteln Sie zum Ergänzen weiterer Codecs die erforderlichen Informationen mit folgenden Befehlen:

<!-- source:en p39 unit:231 -->

```text
pactl list sinks short
pactl list sources short
```

<!-- source:en p40 unit:232 -->

Einzelheiten: offizielle Debian-Dokumentation zu PulseAudio und &lt;SDK&gt;/docs/Common/AUDIO/Rockchip_Developer_Guide_PulseAudio_EN.pdf.

<!-- source:en p40 unit:233 -->

#### 6.5.2 Anpassung von MPP und VPU

<!-- source:en p40 unit:234 -->

Standardmäßig wird MPP als deb vorkompiliert und integriert in:

<!-- source:en p40 unit:235 -->

```text
/usr/lib/aarch64-linux-gnu/librockchip_mpp.so
/usr/lib/aarch64-linux-gnu/librockchip_mpp.so.0
/usr/lib/aarch64-linux-gnu/librockchip_mpp.so.1
```

<!-- source:en p40 unit:236 -->

Prüfen Sie außerdem, dass der Kernel die entsprechenden /dev/mpp_service-Knoten bereitstellt. Siehe &lt;SDK&gt;/docs/Linux/Multimedia/Rockchip_Developer_Guide_MPP_EN.pdf.

<!-- source:en p40 unit:237 -->

#### 6.5.3 Anpassung von GStreamer

<!-- source:en p40 unit:238 -->

Siehe &lt;SDK&gt;/docs/Linux/Multimedia/Rockchip_User_Guide_Linux_Gstreamer_EN.pdf.

<!-- source:en p40 unit:239 -->

#### 6.5.4 Anpassung von Rockit

<!-- source:en p40 unit:240 -->

Siehe &lt;SDK&gt;/docs/Linux/Multimedia/Rockchip_User_Guide_Linux_Rockit_EN.pdf.

<!-- source:en p40 unit:241 -->

### 6.6 Netzwerkanpassung unter Debian

<!-- source:en p40 unit:242 -->

#### 6.6.1 Anpassung von RKWIFIBT

<!-- source:en p40 unit:243 -->

Siehe &lt;SDK&gt;/docs/Linux/Wifibt/Rockchip_Developer_Guide_Linux_WIFI_BT_EN.pdf.

<!-- source:en p40 unit:244 -->

### 6.7 Webcam-Anpassung unter Debian

<!-- source:en p40 unit:245 -->

Die Standard-Webcamanwendung ist cheese. Sie nutzt GStreamer->mpp->vpu zur Kodierung und Dekodierung auf Rockchip. Ohne cheese kann der integrierte GStreamer USB-Kameras direkt ansprechen und Rockchips 3A für MIPI/CSI-Kameras nutzen. Beispiel eines Testskripts:

<!-- source:en p40 unit:246 -->

```text
/rockchip-test$ tree -L 1 camera/
camera/
├── camera_rkaiq_test.sh
├── camera_rkisp_test.sh
├── camera_stresstest.sh
├── camera_test.sh
└── camera_usb_test.sh
```

<!-- source:en p41 unit:247 -->

#### 6.7.1 Anpassung von Cheese

<!-- source:en p41 unit:248 -->

Cheese ist eine Kameraanwendung für Debian mit Echtzeiteffekten, Fotoaufnahme und Videoaufzeichnung. Fast alle gängigen eingebauten und USB-Kameras werden unterstützt. Funktionen: Echtzeiteffekte wie Schwarzweiß, Comic, Fischauge und Ölmalerei; Foto- und Videoaufnahme mit verschiedenen Auflösungen und Formaten; automatisches Speichern sowie manuelle Wahl von Speicherort und Dateiname; Echtzeitvorschau vor der Aufnahme; Kompatibilität mit den meisten eingebauten und USB-Kameras. Bei der Cheese-Anpassung sind die folgenden Probleme zu beheben.

<!-- source:en p41 unit:249 -->

##### 6.7.1.1 Cheese findet keinen gültigen Geräteknoten

<!-- source:en p41 unit:250 -->

Cheese sucht standardmäßig gültige Geräte mit Namen wie video*. Die tatsächlichen Rockchip-ISP-Gerätenamen umfassen rkisp_mainpath, rkisp_selfpath usw.:

<!-- source:en p41 unit:251 -->

```text
root@rk3568:~# grep '' /sys/class/video4linux/video*/name
/sys/class/video4linux/video0/name:rkisp_mainpath
/sys/class/video4linux/video1/name:rkisp_selfpath
/sys/class/video4linux/video2/name:rkisp_rawwr0
/sys/class/video4linux/video3/name:rkisp_rawwr2
/sys/class/video4linux/video4/name:rkisp_rawwr3
/sys/class/video4linux/video5/name:rkisp_rawrd0_m
/sys/class/video4linux/video6/name:rkisp_rawrd2_s
/sys/class/video4linux/video7/name:rkisp-statistics
/sys/class/video4linux/video8/name:rkisp-input-param
```

<!-- source:en p41 unit:252 -->

Die Lösung erfolgt derzeit durch Filterung im GStreamer-v4l2-Plugin. Setzen Sie die entsprechenden Umgebungsvariablen in /etc/profile.d/gst.sh:

<!-- source:en p41 unit:253 -->

```text
# Default device for v4l2src
export GST_V4L2SRC_DEFAULT_DEVICE=/dev/video-camera0

# Available RK devices for v4l2src
export GST_V4L2SRC_RK_DEVICES=_mainpath_selfpath:_bypass:_scale
```

<!-- source:en p42 unit:254 -->

##### 6.7.1.2 Bildverluste bei hochauflösenden Kameras in Cheese

<!-- source:en p42 unit:255 -->

Beim Öffnen des imx415 in Cheese verliert der MIPI-Sensor Bilder; folgende Symptome treten auf:

<!-- source:en p42 unit:256 -->

```text
root@linaro-alip:/# cheese -d rkisp_mainpath

[  488.510646] rkisp0-vir0: MIPI drop frame
[  488.544222] rkisp0-vir0: MIPI drop frame
[  488.577718] rkisp0-vir0: MIPI drop frame
[  488.611408] rkisp0-vir0: MIPI drop frame
[  488.644975] rkisp0-vir0: MIPI drop frame
[  488.678581] rkisp0-vir0: MIPI drop frame

Output     rkisp_mainpath Format:UYVY Size:4672x3504
```

<!-- source:en p42 unit:257 -->

Die vom Gerät gemeldete Größe 4672x3504 überschreitet die Hardwaregrenzen. Die maximale ISP-mp-Ausgabe wird derzeit durch das GStreamer-v4l2-Plugin auf 3840x2160 begrenzt. Setzen Sie die Umgebungsvariablen in /etc/profile.d/gst.sh:

<!-- source:en p42 unit:258 -->

```text
# Max resolution for v4l2src
export GST_V4L2SRC_MAX_RESOLUTION=3840x2160
```

<!-- source:en p42 unit:259 -->

##### 6.7.1.3 Fehlerhafte Aufnahmeformate in Cheese

<!-- source:en p42 unit:260 -->

Der ISP-Treiber unterstützt manche Formate möglicherweise nicht, obwohl der Kernel-ISP-Treiber sie als unterstützt meldet. Beispiel:

<!-- source:en p42 unit:261 -->

```text
root@linaro-alip:~# v4l2-ctl --list-formats-ext -d /dev/video8
ioctl: VIDIOC_ENUM_FMT
        Type: Video Capture Multiplanar

        [0]: 'UYVY' (UYVY 4:2:2)
                Size: Stepwise 32x16 - 4672x3504 with step 8/8
        [1]: '422P' (Planar YUV 4:2:2)
                Size: Stepwise 32x16 - 4672x3504 with step 8/8
        [2]: 'NV16' (Y/CbCr 4:2:2)
                Size: Stepwise 32x16 - 4672x3504 with step 8/8
...
```

<!-- source:en p42 unit:262 -->

NV12 und NV16 funktionierten bei den beschriebenen Tests, während I420 falsch dargestellt wurde; weitere Formate können ununterstützt sein. Ältere Windows-Anwendungen bevorzugen häufig RGB. Meldet der ISP-Treiber RGB-Unterstützung, ohne sie tatsächlich bereitzustellen, funktionieren viele Anwendungen nicht korrekt.

<!-- source:en p43 unit:263 -->

Lösung: Bevorzugte Formate über die GStreamer-v4l2-Umgebungsvariablen in /etc/profile.d/gst.sh auswählen:

<!-- source:en p43 unit:264 -->

```text
# Preferred formats for videoconvert
export GST_VIDEO_CONVERT_PREFERRED_FORMAT=NV12:NV16:I420:YUY2
```

<!-- source:en p43 unit:265 -->

##### 6.7.1.4 Hängende Aufzeichnung in Cheese

<!-- source:en p43 unit:266 -->

Cheese verwendet fest kodiert den Softwareencoder vp8enc, der das ursprüngliche PulseAudio stören und blockieren kann. Lösung: vp8enc-Softwarekodierung über GStreamer ergänzen und PulseAudio aktualisieren. Setzen Sie die Umgebungsvariablen in /etc/profile.d/gst.sh:

<!-- source:en p43 unit:267 -->

```text
export GST_MPP_VP8ENC_FAKE_VP8ENC=1
```

<!-- source:en p43 unit:268 -->

##### 6.7.1.5 mpp-Kodierung für Cheese-Videoaufnahmen

<!-- source:en p43 unit:269 -->

Cheese verwendet standardmäßig den langsamen Softwareencoder vvp8enc. Die Standardanpassung erzwingt den Hardwareencoder mppvp8enc aus Rockchip mpp.

<!-- source:en p43 unit:270 -->

```text
--- a/libcheese/cheese-camera.c
+++ b/libcheese/cheese-camera.c
@@ -442,7 +442,7 @@ cheese_camera_set_video_recording (CheeseCamera *camera,
GError **error)
   gboolean res;
   /* Check if we can use global preset for vp8enc. */
-  video_enc = gst_element_factory_make ("vp8enc", "vp8enc");
+  video_enc = gst_element_factory_make ("mppvp8enc", "vp8enc");
   video_preset = (gchar *) &CHEESE_VIDEO_ENC_PRESET;
   res = gst_preset_load_preset (GST_PRESET (video_enc), video_preset);
```

<!-- source:en p43 unit:271 -->

Dies lässt sich wie folgt prüfen:

<!-- source:en p43 unit:272 -->

```text
root@linaro-alip:/# gst-inspect-1.0 |grep vp8
vpx:  vp8dec: On2 VP8 Decoder
vpx:  vp8enc: On2 VP8 Encoder
rtp:  rtpvp8depay: RTP VP8 depayloader
rtp:  rtpvp8pay: RTP VP8 payloader
rockchipmpp:  mppvp8enc: Rockchip Mpp VP8 Encoder
```

<!-- source:en p43 unit:273 -->

Nachfolgend sind die Kodierfähigkeiten der Rockchip-Chips aufgeführt. Spezifikationstabelle:

<!-- source:en p44 unit:274 -->

| Chip | H264 | H265 | VP8 |
| --- | --- | --- | --- |
| RK3588 | 7680x4320@30f | 7680x4320@30f | 1920x1088@30f |
| RK3566/RK3568 | 1920x1088@60f | 1920x1088@60f | Nicht verfügbar |
| RK3562 | 1920x1088@60f | Nicht verfügbar | Nicht verfügbar |
| RK3399 | 1920x1088@30f | Nicht verfügbar | 1920x1088@30f |
| RK3328 | 1920x1088@30f | 1920x1088@30f | 1920x1088@30f |
| RK3288 | 1920x1088@30f | Nicht verfügbar | 1920x1088@30f |
| RK3326 | 1920x1088@30f | Nicht verfügbar | 1920x1088@30f |
| PX30 | 1920x1088@30f | Nicht verfügbar | 1920x1088@30f |
| RK312X | 1920x1088@30f | Nicht verfügbar | 1920x1088@30f |

<!-- source:en p44 unit:275 -->

##### 6.7.1.6 Speicherpfad für Cheese-Bilder und -Videos ändern

<!-- source:en p44 unit:276 -->

Bilder und Videos werden standardmäßig unter ~/.gnome2/cheese gespeichert. Ändern Sie den Pfad wie folgt:

<!-- source:en p44 unit:277 -->

```text
cat << EOF >~/.config/user-dirs.dirs
> #!/bin/bash
> XDG_DESKTOP_DIR="$HOME/Desktop"
> XDG_DOWNLOAD_DIR="$HOME/Downloads"
> XDG_TEMPLATES_DIR="$HOME/Templates"
> XDG_PUBLICSHARE_DIR="$HOME/Public"
> XDG_DOCUMENTS_DIR="$HOME/Documents"
> XDG_MUSIC_DIR="$HOME/Music"
> XDG_PICTURES_DIR="$HOME/Pictures"
> XDG_VIDEOS_DIR="$HOME/Videos"
> EOF
```

<!-- source:en p44 unit:278 -->

XDG_VIDEOS_DIR bezeichnet den Videopfad, XDG_PICTURES_DIR den Bildpfad.

<!-- source:en p44 unit:279 -->

#### 6.7.2 Anpassung von RKISP

<!-- source:en p44 unit:280 -->

Unterstützt ISP1.X, hauptsächlich für RK3399/RK3288/PX30/RK3326.

<!-- source:en p44 unit:281 -->

```text
rkisp/
└── camera_engine_rkisp-v2.2.0_arm64.deb
```

<!-- source:en p45 unit:282 -->

#### 6.7.3 Anpassung von RKAIQ

<!-- source:en p45 unit:283 -->

Unterstützt ISP21/30/32-Lite, hauptsächlich für RK3566/RK3568/RK3588/RK3562 und weitere Chips.

<!-- source:en p45 unit:284 -->

```text
rkaiq/
├── camera_engine_rkaiq_rk3562_arm64.deb
├── camera_engine_rkaiq_rk3568_arm64.deb
└── camera_engine_rkaiq_rk3588_arm64.deb
```

<!-- source:en p45 unit:285 -->

##### 6.7.3.1 RKAIQ-Fehlersuche

<!-- source:en p45 unit:286 -->

rkaiq-Version und zugehörige Protokolle prüfen

<!-- source:en p45 unit:287 -->

```text
root@linaro-alip:/# cat /var/log/syslog |grep rkaiq
...
Jun 18 17:37:50 linaro-alip rkaiq: ************************** VERSION INFOS
**************************
Jun 18 17:37:50 linaro-alip rkaiq: version release date: 2023-10-07
Jun 18 17:37:50 linaro-alip rkaiq:          AIQ:       AIQ v5.0x4.0
Jun 18 17:37:50 linaro-alip rkaiq:    IQ PARSER:       Calib
v1.4.8,magicCode:1170944
Jun 18 17:37:50 linaro-alip rkaiq: ************************ VERSION INFOS END
************************
```

<!-- source:en p45 unit:288 -->

Prüfen Sie den rkaiq-Dienst: root@linaro-alip:/# ps aux &#124;grep rkaiq; Beispielausgabe: root 2339 0.0 0.4 163020 8076 ? Sl 17:37 0:00 /usr/bin/rkaiq_3A_server; root 2340 0.0 0.0 8508 1240 ? S 17:37 0:00 logger -t rkaiq; root 2699 0.0 0.0 6264 604 ttyFIQ0 S+ 17:42 0:00 grep rkaiq. Kernel-ISP-Debugprotokolle: echo 3 > /sys/module/video_rkisp/parameters/debug; echo 3 > /sys/module/video_rkcif/parameters/debug. rkaiq-Protokolle: AE — echo 0x1ff4 > /tmp/.rkaiq_log; AWB — echo 0x2ff4 > /tmp/.rkaiq_log; AF — echo 0x4ff4 > /tmp/.rkaiq_log; HDR — echo 0x20ff3 > /tmp/.rkaiq_log; NR — echo 0x40ff4 > /tmp/.rkaiq_log.

```text
root@linaro-alip:/# ps aux |grep rkaiq
root 2339 0.0 0.4 163020 8076 ? Sl 17:37 0:00 /usr/bin/rkaiq_3A_server
root 2340 0.0 0.0 8508 1240 ? S 17:37 0:00 logger -t rkaiq
root 2699 0.0 0.0 6264 604 ttyFIQ0 S+ 17:42 0:00 grep rkaiq
echo 3 > /sys/module/video_rkisp/parameters/debug
echo 3 > /sys/module/video_rkcif/parameters/debug
# AE
echo 0x1ff4 > /tmp/.rkaiq_log
# AWB
echo 0x2ff4 > /tmp/.rkaiq_log
# AF
echo 0x4ff4 > /tmp/.rkaiq_log
# HDR
echo 0x20ff3 > /tmp/.rkaiq_log
# NR
echo 0x40ff4 > /tmp/.rkaiq_log
```

<!-- source:en p46 unit:289 -->

Dehaze-Protokoll: echo 0x2000ff3 > /tmp/.rkaiq_log; Sharp: echo 0x80000ff4 > /tmp/.rkaiq_log; CAMHW: echo 0x4000000ff4 > /tmp/.rkaiq_log. Informationen zu Geräteknoten prüfen:

```text
# Dehaze
echo 0x2000ff3 > /tmp/.rkaiq_log
# Sharp
echo 0x80000ff4 > /tmp/.rkaiq_log
# CAMHW
echo 0x4000000ff4 > /tmp/.rkaiq_log
```

<!-- source:en p46 unit:290 -->

```text
root@linaro-alip:/# grep '' /sys/class/video4linux/video*/name
/sys/class/video4linux/video0/name:stream_cif_mipi_id0
/sys/class/video4linux/video1/name:stream_cif_mipi_id1
/sys/class/video4linux/video2/name:stream_cif_mipi_id2
/sys/class/video4linux/video3/name:stream_cif_mipi_id3
/sys/class/video4linux/video4/name:rkcif_scale_ch0
/sys/class/video4linux/video5/name:rkcif_scale_ch1
/sys/class/video4linux/video6/name:rkcif_scale_ch2
/sys/class/video4linux/video7/name:rkcif_scale_ch3
/sys/class/video4linux/video8/name:rkcif_tools_id0
/sys/class/video4linux/video9/name:rkcif_tools_id1
/sys/class/video4linux/video10/name:rkcif_tools_id2
...
```

<!-- source:en p46 unit:291 -->

### 6.8 Anpassung der Debian-Energieverwaltung

<!-- source:en p46 unit:292 -->

#### 6.8.1 Anpassung der Energieverwaltung

<!-- source:en p46 unit:293 -->

Die Debian-Energieverwaltung ist komplex und bietet mehrere Standby-Pfade. Das ergänzte Tastenskript power-key.sh verwendet pm-utils oder schreibt direkt in Knoten; pm-utils schreibt nach Ausführung der Hook-Skripte in die Knoten. Automatischer Standby in xfce4, mate, gnome usw. bevorzugt normalerweise systemd, anschließend consolekit oder pm-utils; systemd schreibt direkt in Knoten. Hier wird einheitlich systemd so priorisiert, dass es standardmäßig pm-utils für Standby und Aufwachen verwendet. Die Konfiguration ist bereits in Debians overlay/etc/Powermanager integriert.

<!-- source:en p46 unit:294 -->

```text
├── 01npu
├── 02npu
├── 03wifibt
├── 04wifibt
├── power-key.conf
├── power-key.sh
├── triggerhappy
└── triggerhappy.service
```

<!-- source:en p46 unit:295 -->

etc/init.d/rockchip.sh enthält Sonderbehandlungen für die Energieverwaltung, insbesondere für NPU und RKWIFIBT, sowie die Behandlung der Einschalttaste.

<!-- source:en p46 unit:296 -->

```text
# support power management
```

<!-- source:en p47 unit:297 -->

```text
if [ -e "/usr/sbin/pm-suspend" -a -e /etc/Powermanager ] ;
then
    mv /etc/Powermanager/power-key.sh /usr/bin/
    mv /etc/Powermanager/power-key.conf /etc/triggerhappy/triggers.d/
    if [[ "$CHIPNAME" == "rk3399pro" ]];
    then
        mv /etc/Powermanager/01npu /usr/lib/pm-utils/sleep.d/
        mv /etc/Powermanager/02npu /lib/systemd/system-sleep/
    fi
    mv /etc/Powermanager/03wifibt /usr/lib/pm-utils/sleep.d/
    mv /etc/Powermanager/04wifibt /lib/systemd/system-sleep/
    mv /etc/Powermanager/triggerhappy /etc/init.d/triggerhappy

    rm /etc/Powermanager -rf
    service triggerhappy restart
fi
```

<!-- source:en p47 unit:298 -->

Besondere Aufwachbehandlungen weiterer Module können in den folgenden beiden Konfigurationsverzeichnissen abgelegt werden.

<!-- source:en p47 unit:299 -->

```text
/usr/lib/pm-utils/sleep.d/ and  /lib/systemd/system-sleep/
```

<!-- source:en p47 unit:300 -->

Standby-/Aufwachtest: /rockchip-test/suspend_resume/suspend_resume.sh. Zur chipbezogenen Behandlung siehe &lt;SDK&gt;/docs/en/Common/TRUST/Rockchip_RK3588_Developer_Guide_System_Suspend_EN.pdf.

<!-- source:en p47 unit:301 -->

#### 6.8.2 Konfiguration der Energieverwaltung

<!-- source:en p47 unit:302 -->

Dieser Abschnitt beschreibt die Energieverwaltung von xfce4, insbesondere DPMS und Standby. Die Konfiguration folgt:

<!-- source:en p47 unit:303 -->

```text
#/etc/xdg/xfce4/xfconf/xfce-perchannel-xml/xfce4-power-manager.xml

<channel name="xfce4-power-manager" version="1.0">
  <property name="xfce4-power-manager" type="empty">
    <!-- Let other power manager(e.g. trigger-happy) handle power key -->
    <property name="power-button-action" type="uint" value="0"/>

    <!-- Disable DPMS(auto screen-off) by default -->
    <property name="dpms-enabled" type="bool" value="false"/>
    <property name="blank-on-ac" type="int" value="0"/>

    <!-- Disable Screen lock by default -->
    <property name="lock-screen-suspend-hibernate" type="bool" value="false"/>
  </property>
</channel>
```

<!-- source:en p48 unit:304 -->

### 6.9 KI-Anpassung unter Debian

<!-- source:en p48 unit:305 -->

NPU-Anpassung für Rockchip: RKNPU dient hauptsächlich zur Modellkonvertierung, Inferenz und Bewertung der Modellleistung.

<!-- source:en p48 unit:306 -->

#### 6.9.1 Anpassung von RKNPU

<!-- source:en p48 unit:307 -->

Hauptsächlich für RK3568/RK3566/RK3588.

<!-- source:en p48 unit:308 -->

```text
rknpu2/
└── rknpu2.tar
```

<!-- source:en p48 unit:309 -->

#### 6.9.2 RKNN-Tests

<!-- source:en p48 unit:310 -->

Umfasst hauptsächlich NPU-Frequenzwechsel-, Belastungs- und Demotests.

<!-- source:en p48 unit:311 -->

```text
/rockchip-test/npu2/
├── npu_freq_scaling.sh
├── npu_stress_test.sh
├── npu_test.sh
├── rknn_demo.sh
└── rknn_stress_test
```

<!-- source:en p48 unit:312 -->

### 6.10 Debian-Firmwareaktualisierung

<!-- source:en p48 unit:313 -->

Debian-Firmware wird hauptsächlich per USB, durch Start von SD-Karte/USB-Stick, per Programmiergerät oder OTA aktualisiert. OTA umfasst Recovery-Updates (Loader, Parameter, sonstige und kundenspezifische Partitionen), A/B-Partitionsupdates und differenzielle Updates. Siehe &lt;SDK&gt;/docs/en/Linux/Recovery/Rockchip_Developer_Guide_Linux_Upgrade_EN.pdf.

<!-- source:en p49 unit:314 -->

### 6.11 Sicherer Debian-Start

<!-- source:en p49 unit:315 -->

#### 6.11.1 Secure Boot

<!-- source:en p49 unit:316 -->

Die wichtigsten Secure-Boot-Verfahren sind AVB und FIT; die Chipunterstützung ist nachfolgend aufgeführt:

<!-- source:en p49 unit:317 -->

| Chip | Kernel-Prüfverfahren | Kernelversion | Speichermedium |
| --- | --- | --- | --- |
| RK3399/RK3288 | AVB | 4.4 | eFuse |
| RK3308/RK3328/RK3326/PX30/RK3358 | AVB | 4.4 | OTP |
| RK3588/RK3562/RK3566/RK3568 | FIT | 5.10 | OTP |

<!-- source:en p49 unit:318 -->

Siehe &lt;SDK&gt;/docs/en/Linux/Security/Rockchip_Developer_Guide_Linux_Secure_Boot_EN.pdf.

<!-- source:en p49 unit:319 -->

### 6.12 Touch-Anpassung unter Debian

<!-- source:en p49 unit:320 -->

Konfigurieren Sie die Matrixparameter von X server oder testen Sie sie über die Kommandozeile.

<!-- source:en p49 unit:321 -->

### 6.13 USB-Geräteanpassung unter Debian

<!-- source:en p49 unit:322 -->

usbdevice-Dienste unterstützen usb adb/acm/hid/mtp/ntb/rndis/uac1/uac2/ums/uvc. Die Dienstdatei liegt unter /lib/systemd/system/usbdevice.service, das Hauptprogramm unter /usr/bin/usbdevice. USB-Funktionen werden in /etc/profile.d/usbdevice.sh konfiguriert, beispielsweise:

<!-- source:en p49 unit:323 -->

```text
#!/bin/sh

# The env variables below can be overridden

# option: adb acm hid mtp ntb rndis uac1 uac2 ums uvc
export USB_FUNCS="adb"

export UMS_FILE=/userdata/ums_shared.img
export UMS_SIZE=256M
export UMS_FSTYPE=vfat
export UMS_MOUNT=0
export UMS_MOUNTPOINT=/mnt/ums
export UMS_RO=0
```

<!-- source:en p50 unit:324 -->

Das Debugprotokoll liegt unter /tmp/usbdevice.log. Unterstützte USB-Funktionen lassen sich in /tmp/.usbdevice prüfen.

<!-- source:en p50 unit:325 -->

### 6.14 Sensoranpassung unter Debian

<!-- source:en p50 unit:326 -->

gsensor/lsensor. Das Paket lm-sensors installieren.

<!-- source:en p50 unit:327 -->

```text
sudo apt-get install lm-sensors
```

<!-- source:en p50 unit:328 -->

Sensoren im System erkennen

<!-- source:en p50 unit:329 -->

```text
sudo sensors-detect
```

<!-- source:en p50 unit:330 -->

Das System wird nach Sensoren durchsucht; anschließend wird die Aktivierung jedes Sensortyps angeboten. Den Anweisungen für die gewünschten Sensoren folgen. Installation testen:

<!-- source:en p50 unit:331 -->

```text
sensors
```

<!-- source:en p50 unit:332 -->

### 6.15 Debian-Systeminformationen

<!-- source:en p50 unit:333 -->

#### 6.15.1 Genaue Debian-Versionsnummer

<!-- source:en p50 unit:334 -->

```text
root@linaro-alip:~# cat /etc/debian_version
11.8
```

<!-- source:en p50 unit:335 -->

#### 6.15.2 Debian-Versionsinformationen

<!-- source:en p50 unit:336 -->

```text
root@linaro-alip:~# cat /etc/os-release
PRETTY_NAME="Debian GNU/Linux 11 (bullseye)"
NAME="Debian GNU/Linux"
VERSION_ID="11"
VERSION="11 (bullseye)"
VERSION_CODENAME=bullseye
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"
BUILD_INFO="root@pc April 27, 2022 Wednesday 11:49:33 CST"
```

<!-- source:en p51 unit:337 -->

#### 6.15.3 Hardwareinformationen des Debian-Systems

<!-- source:en p51 unit:338 -->

```text
root@linaro-alip:~# hardinfo  -r
Computer
 Summary
 Operating System
 Kernel Modules
 Boots
 Languages
 Filesystems
 Display
 Environment Variables
 Development
 Users
 Groups
...
```

<!-- source:en p51 unit:339 -->

#### 6.15.4 Debian-Systemprotokolle

<!-- source:en p51 unit:340 -->

```text
/info/
├── clk_summary -> /sys/kernel/debug/clk/clk_summary
├── cmdline -> /proc/cmdline
├── cpuinfo -> /proc/cpuinfo
├── device-tree -> /proc/device-tree
├── diskstats -> /proc/diskstats
├── dma_buf -> /sys/kernel/debug/dma_buf
├── dri -> /sys/kernel/debug/dri
├── fstab -> /etc/fstab
├── gpio -> /sys/kernel/debug/gpio
├── interrupts -> /proc/interrupts
├── iomem -> /proc/iomem
├── kallsyms -> /proc/kallsyms
├── log -> /var/log
├── meminfo -> /proc/meminfo
├── mountall.log -> /tmp/mountall.log
├── os-release -> /etc/os-release
├── partitions -> /proc/partitions
├── pinctrl -> /sys/kernel/debug/pinctrl/
├── rkcif-mipi-lvds -> /proc/rkcif-mipi-lvds
├── rk_dmabuf -> /proc/rk_dmabuf
├── rkisp0-vir0 -> /proc/rkisp0-vir0
├── slabinfo -> /proc/slabinfo
├── softirqs -> /proc/softirqs
├── version -> /proc/version
└── wakeup_sources -> /sys/kernel/debug/wakeup_sources

...
```

<!-- source:en p52 unit:341 -->

### 6.16 Debian verkleinern

<!-- source:en p52 unit:342 -->

Mit neuen Funktionen jeder Version steigt Debians Platzbedarf. Hier geht es um die Reduzierung von Desktopkomponenten auf Rockchip ARM. Zur Verkleinerung des Images lassen sich grundlegende Firmwarepakete entfernen, beispielsweise:

<!-- source:en p52 unit:343 -->

```text
debian/ubuntu-build-service/bullseye-desktop-arm64/customization/package-
lists/linaro.list.chroot
```

<!-- source:en p52 unit:344 -->

Vom rockchip-Shellskript hinzugefügte Pakete

<!-- source:en p52 unit:345 -->

```text
mk-rootfs-buster.sh
```

<!-- source:en p52 unit:346 -->

Zusätzlich lässt sich Folgendes reduzieren: Im mesa-Paket libgl1-mesa-dri unter /usr/lib/*/dri/ nur kms_swrast_dri.so und swrast_dri.so behalten, da die anderen nicht verwendet werden; bei linux-firmware, falls vorhanden, unter /usr/lib/firmware nur benötigte Firmware behalten (Kunden benötigen sie gewöhnlich nicht); unter packages nur die zum Chip passenden x11-mali-Pakete behalten; var/cache. Beim Imagebau lässt sich außerdem die Größe der dd-Imagedatei in mk-image.sh ändern, beispielsweise:

<!-- source:en p52 unit:347 -->

```text
truncate -s 2500M rootfs.img
mkfs.ext4 -d binary rootfs.img
```

<!-- source:en p52 unit:348 -->

Wesentliche Speicherplatzbelegung:

<!-- source:en p52 unit:349 -->

```text
root@pc:/# du -sh */
120M    bin/
22M boot/
12K dev/
10M etc/
20K home/
1.6G    lib/
4.0K    media/
4.0K    mnt/
4.0K    opt/
4.0K    proc/
36M rockchip-test/
28K root/
44K run/
26M sbin/
4.0K    srv/
4.0K    sys/
18M system/
```

<!-- source:en p53 unit:350 -->

```text
4.0K    tmp/
1.3G    usr/
73M var/
8.0K    vendor/
```

<!-- source:en p53 unit:351 -->

Die Größe installierter Pakete lässt sich auch folgendermaßen anzeigen:

<!-- source:en p53 unit:352 -->

```text
dpkg-query -Wf '${Installed-size}K\t${Package}\t${Status}\n' | grep -w installed
| column -t|sort -h
```

<!-- source:en p53 unit:353 -->

### 6.17 Debian testen

<!-- source:en p53 unit:354 -->

Integration des Rockchip-Stresstestskripts: rockchip_test vereint Funktions-, Belastungs- und Leistungstests.

<!-- source:en p53 unit:355 -->

```text
root@linaro-alip:~# /rockchip-test/rockchip_test.sh

cpu test:             1 (cpufreq stresstest)
ddr test:             2 (memtester & stressapptest)
gpu test:             3 (use glmark2)
npu test:             4 (npu2:rk3588)
auto reboot test:     5 (reboot tests)
suspend_resume test:  6 (suspend & resume)
nand power lost test: 7 (S5 stress tests)
flash stress test:    8 (flash tests)
audio test:           9 (audio tests)
recovery test:        10 (default wipe all)
bluetooth test:       11 (bluetooth on&off test)
wifi test:            12 (wifi on&off test)
ethernet test:        13 (ethernet tests)
camera test:          14 (use rkaiq_demo)
video test:           15 (use gstreamer-wayland and app_demo)
chromium test:        16 (chromium with video hardware acceleration)
hardware information:  17 (to get the hardware information)

*****************************************************
please input your test module:
```

<!-- source:en p53 unit:356 -->

### 6.18 Debian-Debugwerkzeuge

<!-- source:en p53 unit:357 -->

#### 6.18.1 ADB-Werkzeuge

<!-- source:en p53 unit:358 -->

##### 6.18.1.1 ADB-Übersicht

<!-- source:en p53 unit:359 -->

Geräte-Shell ausführen; Portzuordnungen für Emulatoren oder Geräte verwalten; Dateien zwischen Rechner und Gerät hoch- und herunterladen.

<!-- source:en p54 unit:360 -->

Lokale Software auf Debian-Geräten installieren. ADB arbeitet als Client-Server-Programm: Client ist meist der PC, Server die physische oder virtuelle Debian-Gerätemaschine. Je nach Verbindung unterscheidet man Netzwerk-ADB über kabelgebundenes/drahtloses Netzwerk zur STB im selben LAN und USB-ADB über USB-Kabel.

<!-- source:en p54 unit:361 -->

##### 6.18.1.2 USB-ADB verwenden

<!-- source:en p54 unit:362 -->

USB-ADB-Einschränkungen: nur USB-OTG-Ports; keine gleichzeitige Nutzung durch mehrere Clients; pro Host nur ein Gerät, keine Mehrgeräteverbindung. Zur Verbindungsprüfung "adb devices" ausführen. Wird die Seriennummer angezeigt, ist die Verbindung erfolgreich.

<!-- source:en p54 unit:363 -->

#### 6.18.2 Startleistung mit systemd-analyze analysieren

<!-- source:en p54 unit:364 -->

systemd-analyze untersucht die Bootleistung und die Startdauer von Diensten. Dauer jedes Initialisierungsschritts anzeigen:

<!-- source:en p54 unit:365 -->

```text
root@linaro-alip:/# systemd-analyze time
Startup finished in 1.523s (kernel) + 3.833s (userspace) = 5.357s
graphical.target reached after 3.810s in userspace
```

<!-- source:en p54 unit:366 -->

Initialisierungsdauer aller Units auflisten

<!-- source:en p54 unit:367 -->

```text
root@linaro-alip:/# systemd-analyze blame

1.680s rkwifibt.service
1.368s keyboard-setup.service
1.148s console-setup.service
 588ms blueman-mechanism.service
 557ms dev-mmcblk0p6.device
 495ms usbdevice.service
 319ms udisks2.service
 287ms resize-all.service
 283ms systemd-udev-trigger.service
 246ms systemd-journal-flush.service
 203ms user@0.service
 198ms user@1000.service
 196ms NetworkManager.service
 185ms nginx.service
 185ms systemd-rfkill.service
```

<!-- source:en p55 unit:368 -->

```text
184ms systemd-journald.service
...
```

<!-- source:en p55 unit:369 -->

#### 6.18.3 Werkzeug zur Leistungsoptimierung

<!-- source:en p55 unit:370 -->

Das Leistungswerkzeug perf; Einführung in die Verwendung:

<!-- source:en p55 unit:371 -->

```text
apt install -fy linux-perf-5.10

root@linaro-alip:/# perf

 usage: perf [--version] [--help] [OPTIONS] COMMAND [ARGS]

 The most commonly used perf commands are:
   annotate        Read perf.data (created by perf record) and display annotated
code
   archive         Create archive with object files with build-ids found in
perf.data file
   bench           General framework for benchmark suites
   buildid-cache   Manage build-id cache.
   buildid-list    List the buildids in a perf.data file
   c2c             Shared Data C2C/HITM Analyzer.
   config          Get and set variables in a configuration file.
   data            Data file related processing
   diff            Read perf.data files and display the differential profile
   evlist          List the event names in a perf.data file
   ftrace          simple wrapper for kernel's ftrace functionality
   inject          Filter to augment the events stream with additional
information
   kallsyms        Searches running kernel for symbols
   kmem            Tool to trace/measure kernel memory properties
   kvm             Tool to trace/measure kvm guest os
   list            List all symbolic event types
   lock            Analyze lock events
   mem             Profile memory accesses
   record          Run a command and record its profile into perf.data
   report          Read perf.data (created by perf record) and display the
profile
   sched           Tool to trace/measure scheduler properties (latencies)
   script          Read perf.data (created by perf record) and display trace
output
   stat            Run a command and gather performance counter statistics
   test            Runs sanity tests.
   timechart       Tool to visualize total system behavior during a workload
   top             System profiling tool.
   version         display the version of perf binary
   probe           Define new dynamic tracepoints
   trace           strace inspired tool
```

<!-- source:en p56 unit:372 -->

## 7. Debian-Sicherheitsupdates

<!-- source:en p56 unit:373 -->

Referenz zu Sicherheitsupdates: Debian-security. Aktuelle Updates lassen sich bequem über APT beziehen. Damit Debian sie erhält, folgende Zeile in /etc/apt/sources.list eintragen:

<!-- source:en p56 unit:374 -->

```text
deb http://security.debian.org/debian-security bookworm-security main contrib
non-free non-free-firmware
```

<!-- source:en p56 unit:375 -->

Änderungen speichern und folgende zwei Befehle zum Herunterladen und Installieren der Sicherheitsupdates ausführen:

<!-- source:en p56 unit:376 -->

```text
apt-get update && apt-get upgrade
```

<!-- source:en p56 unit:377 -->

Sicherheitsprobleme in eigenen oder fremden Paketen an team@security.debian.org melden. Das Sicherheitsteam verfolgt Probleme, unterstützt Paketbetreuer bei Korrekturen oder behebt sie selbst, veröffentlicht Hinweise und betreut security.debian.org. Neueste Meldungen: Die folgende Seite enthält ein kurzes Archiv der auf debian-security-announce veröffentlichten Sicherheitshinweise.

<!-- source:en p56 unit:378 -->

```text
[2023/08/07] DSA-5471-1 libhtmlcleaner-java security update
[2023/08/06] DSA-5470-1 python-werkzeug security update
[2023/08/05] DSA-5469-1 thunderbird security update
[2023/08/05] DSA-5468-1 webkit2gtk security update
[2023/08/04] DSA-5467-1 chromium security update
[2023/08/04] DSA-5466-1 ntpsec security update
[2023/08/03] DSA-5465-1 python-django security update
[2023/08/03] DSA-5464-1 firefox-esr security update
[2023/07/30] DSA-5463-1 thunderbird security update
[2023/07/30] DSA-5462-1 linux security update
[2023/07/30] DSA-5461-1 linux security update
[2023/07/26] DSA-5460-1 curl security update
[2023/07/25] DSA-5459-1 amd64-microcode security update
[2023/07/25] DSA-5458-1 openjdk-17 security update
[2023/07/22] DSA-5457-1 webkit2gtk security update
[2023/07/20] DSA-5456-1 chromium security update
[2023/07/17] DSA-5455-1 iperf3 security update
[2023/07/16] DSA-5454-1 kanboard security update
[2023/07/16] DSA-5453-1 linux security update
[2023/07/14] DSA-5452-1 gpac security update
[2023/07/09] DSA-5451-1 thunderbird security update
```

<!-- source:en p57 unit:379 -->

## 8. Debian-Roadmap

<!-- source:en p57 unit:380 -->

Laut Quelle unterstützt RK die offiziellen Versionen von stretch (9) bis bookworm (12); der Wartungsschwerpunkt liegt auf bullseye (11).

<!-- source:en p57 unit:381 -->

| Version | Debian-Veröffentlichung | SDK-Veröffentlichung | LTS-Ende |
| --- | --- | --- | --- |
| Stretch (9) | 2017-06-17 | 2018-06-20 | 2022-07-01 |
| Buster (10) | 2019-07-06 | 2020-12-11 | 2024-06-30 |
| Bullseye (11) | 2021-08-14 | 2022-01-15 | ~ 2026 |
| Bookworm (12) | 2023-06-10 | 2023 Q4 | ~ 2028 |

<!-- source:en p57 unit:382 -->

Debian-LTS-Versionen werden alle zwei Jahre aktualisiert. Einzelheiten stehen in den offiziellen Veröffentlichungsinformationen Debian-Release.

<!-- source:en p57 unit:383 -->

## 9. Debian-FAQ

<!-- source:en p57 unit:384 -->

Dieser Abschnitt behandelt häufige Fragen zu Debian GNU/Linux auf Rockchip. Weitere Informationen stehen in der offiziellen Debian-FAQ.

<!-- source:en p57 unit:385 -->

### 9.1 Probleme mit "noexec or nodev"

<!-- source:en p57 unit:386 -->

```text
noexec or nodev issue /usr/share/debootstrap/functions: line 1450:
..../rootfs/ubuntu-build-service/buster-desktop-arm64/chroot/test-dev-null:
Permission denied E: Cannot install into target '/rootfs/ubuntu-build-
service/buster-desktop-arm64/chroot' mounted with noexec or nodev
```

<!-- source:en p57 unit:387 -->

Lösung:

<!-- source:en p57 unit:388 -->

```text
mount -o remount,exec,dev xxx
```

<!-- source:en p57 unit:389 -->

Dabei ist xxx der Pfad des Projektverzeichnisses; anschließend erneut bauen.

<!-- source:en p57 unit:390 -->

Bei weiteren Buildfehlern zunächst den Dateisystemtyp ext2/ext4 als möglichen Faktor prüfen.

<!-- source:en p57 unit:391 -->

### 9.2 Downloadprobleme bei "Base Debian"

<!-- source:en p57 unit:392 -->

Für Base Debian werden ausländische Websites benötigt, deren Downloads aus China häufig fehlschlagen. Debian verwendet live build; die Spiegelquelle lässt sich folgendermaßen auf eine chinesische Quelle umstellen:

<!-- source:en p58 unit:393 -->

```text
32位系统：

+++ b/ubuntu-build-service/{buster/bullseye}-desktop-armhf/configure
@@ -11,6 +11,11 @@ set -e
 echo "I: create configuration"
 export LB_BOOTSTRAP_INCLUDE="apt-transport-https gnupg"
 lb config \
+ --mirror-bootstrap "http://mirrors.ustc.edu.cn/debian" \
+ --mirror-chroot "http://mirrors.ustc.edu.cn/debian" \
+ --mirror-chroot-security "http://mirrors.ustc.edu.cn/debian-security" \
+ --mirror-binary "http://mirrors.ustc.edu.cn/debian" \
+ --mirror-binary-security "http://mirrors.ustc.edu.cn/debian-security" \
  --apt-indices false \
  --apt-recommends false \
  --apt-secure false \

  64位系统：
  --- a/ubuntu-build-service/{buster/bullseye}-desktop-arm64/configure
+++ b/ubuntu-build-service/{buster/bullseye}-desktop-arm64/configure
@@ -11,6 +11,11 @@ set -e
 echo "I: create configuration"
 export LB_BOOTSTRAP_INCLUDE="apt-transport-https gnupg"
 lb config \
+ --mirror-bootstrap "http://mirrors.ustc.edu.cn/debian" \
+ --mirror-chroot "http://mirrors.ustc.edu.cn/debian" \
+ --mirror-chroot-security "http://mirrors.ustc.edu.cn/debian-security" \
+ --mirror-binary "http://mirrors.ustc.edu.cn/debian" \
+ --mirror-binary-security "http://mirrors.ustc.edu.cn/debian-security" \
  --apt-indices false \
```

<!-- source:en p58 unit:394 -->

```text
--apt-recommends false \
--apt-secure false \
```

<!-- source:en p58 unit:395 -->

Falls andere Netzwerkprobleme das Herunterladen verhindern, stehen vorkompilierte Pakete auf [Baidu Cloud Disk](https://eyun.baidu.com/s/3bqwrvo7) bereit. Legen Sie sie im aktuellen Verzeichnis ab und fahren Sie direkt mit dem nächsten Schritt fort.

<!-- source:en p58 unit:396 -->

### 9.3 Fehler beim Einhängen von /dev nach abnormalen Vorgängen

<!-- source:en p58 unit:397 -->

Beispielsweise tritt „askpass command or cannot use one“ auf.

<!-- source:en p58 unit:398 -->

Häufige irreguläre Build-Abbrüche (CTRL+C) können die Ursache sein. Behebung:

<!-- source:en p58 unit:399 -->

```text
sudo -S umount /dev
```

<!-- source:en p58 unit:400 -->

### 9.4 /dev-Fehler durch mehrfaches Einhängen

<!-- source:en p58 unit:401 -->

Beispielsweise erscheint <code>sudo: unable to allocate pty: No such device</code>.

<!-- source:en p58 unit:402 -->

Die Ursache kann mehrfaches Einhängen während des Builds sein. Behebung:

<!-- source:en p58 unit:403 -->

```text
ssh <⽤⼾名>@<IP地址> -T sudo -S umount /dev -l
```

<!-- source:en p59 unit:404 -->

### 9.5 Systeminformationen anzeigen

<!-- source:en p59 unit:405 -->

#### 9.5.1 Debian-Version prüfen

<!-- source:en p59 unit:406 -->

```text
root@linaro-alip:~# cat /etc/debian_version
11.1
```

<!-- source:en p59 unit:407 -->

#### 9.5.2 X11 oder Wayland feststellen

<!-- source:en p59 unit:408 -->

Auf einem X11-System:

<!-- source:en p59 unit:409 -->

```text
$ echo $XDG_SESSION_TYPE
x11
```

<!-- source:en p59 unit:410 -->

Auf einem Wayland-System:

<!-- source:en p59 unit:411 -->

```text
$ echo $XDG_SESSION_TYPE
wayland
```

<!-- source:en p59 unit:412 -->

#### 9.5.3 Systempartitionen prüfen

<!-- source:en p59 unit:413 -->

```text
root@linaro-alip:~# parted -l

Model: MMC BJTD4R (sd/mmc)
Disk /dev/mmcblk0: 31.3GB
Sector size (logical/physical): 512B/512B
Partition Table: gpt
Disk Flags:

Number  Start   End     Size    File system  Name      Flags
 1      8389kB  12.6MB  4194kB               uboot
 2      12.6MB  16.8MB  4194kB               misc
 3      16.8MB  83.9MB  67.1MB               boot
 4      83.9MB  218MB   134MB                recovery
 5      218MB   252MB   33.6MB               backup
 6      252MB   15.3GB  15.0GB  ext4         rootfs
 7      15.3GB  15.4GB  134MB   ext2         oem
 8      15.6GB  31.3GB  15.6GB  ext2         userdata
```

<!-- source:en p59 unit:414 -->

#### 9.5.4 Störung des SSH-Dienstes

<!-- source:en p59 unit:415 -->

Dieses Problem tritt unter Debian10 und älter auf. Ergänzen Sie /etc/rc.local wie folgt:

<!-- source:en p60 unit:416 -->

```text
#!/bin/sh -e
#
# rc.local
#
# This script is executed at the end of each multiuser runlevel.
# Make sure that the script will "exit 0" on success or any other
# value on error.
#
# In order to enable or disable this script just change the execution
# bits.
#
# By default this script does nothing.
# Generate the SSH keys if non-existent
if [ ! -f /etc/ssh/ssh_host_rsa_key ]
then
    # else ssh service start in dpkg-reconfigure will fail
    systemctl stop ssh.socket||true
    dpkg-reconfigure openssh-server
fi

exit 0
```

<!-- source:en p60 unit:417 -->

### 9.6 Debian11-Basispaket lässt sich nicht bauen

<!-- source:en p60 unit:418 -->

Beispiel für die auftretende Fehlermeldung:

<!-- source:en p60 unit:419 -->

```text
W: Failure trying to run:  /sbin/ldconfig
W: See //debootstrap/debootstrap.log for details
```

<!-- source:en p60 unit:420 -->

Hauptanforderung ist PC-Kernel 5.10+ wegen eines Fehlers älterer QEMU-Versionen. Zwei Lösungswege: PC-Kernel auf mindestens 5.10 bringen; Kernel-Version prüfen:

<!-- source:en p60 unit:421 -->

```text
cat /proc/version
Linux version 5.13.0-39-generic
```

<!-- source:en p60 unit:422 -->

Alternativ QEMU im System aktualisieren; siehe QEMU.

<!-- source:en p61 unit:423 -->

### 9.7 Debian-deb-Pakete entpacken, ändern und neu packen

<!-- source:en p61 unit:424 -->

Zum Ändern und Neupacken eines vorhandenen deb-Pakets folgende Schritte durchführen:

<!-- source:en p61 unit:425 -->

```text
# Extract the package files into the extract directory
dpkg -X xxx.deb extract/

# Extract the package control information into extract/DEBIAN/
dpkg -e xxx.deb extract/DEBIAN/

# Modify the file XXX

# Repackage the modified content to generate a deb package
dpkg-deb -b extract/ .
```

<!-- source:en p61 unit:426 -->

### 9.8 Swap in Debian hinzufügen

<!-- source:en p61 unit:427 -->

Bei knappem physischem Speicher lässt sich Swap für laufende Programme hinzufügen. Beispiel: 2G virtueller Speicher. Swap-Datei erstellen:

<!-- source:en p61 unit:428 -->

```text
cd /opt
mkdir swap
dd if=/dev/zero of=swapfile bs=1024 count=2000000
# count represents the size, which is 2G here.
```

<!-- source:en p61 unit:429 -->

Datei in eine Swap-Datei umwandeln

<!-- source:en p61 unit:430 -->

```text
sudo mkswap swapfile
```

<!-- source:en p61 unit:431 -->

Swap-Datei aktivieren

<!-- source:en p61 unit:432 -->

```text
swapon /opt/swapfile

To deactivate:
swapoff /opt/swapfile
```

<!-- source:en p61 unit:433 -->

Zum automatischen Einbinden nach dem Start beispielsweise /opt/swapfile swap swap defaults 0 0 in /etc/fstab eintragen. Wirkung prüfen:

<!-- source:en p62 unit:434 -->

```text
root@linaro-alip:/opt# free -h
               total        used        free      shared  buff/cache   available
Memory:      1.9Gi       390Mi        91Mi        75Mi       1.5Gi       1.4Gi
Swap:       1.9Gi          0B       1.9Gi
```

<!-- source:en p62 unit:435 -->

### 9.9 Erstes Debian-Systemupdate kann den Anzeigedienst neu starten

<!-- source:en p62 unit:436 -->

Das allgemeine Debian-System installiert beim ersten Ausführen von /etc/init.d/rockchip.sh chipabhängige Pakete wie libmali und isp für die Unterstützung verschiedener Chips. Danach startet der Anzeigedienst neu. Bei einem Einzelprojekt lassen sich diese Unterschiede bereits beim Imagebau berücksichtigen.

<!-- source:en p62 unit:437 -->

### 9.10 Probleme beim libGL-bezogenen dri.so-Aufruf

<!-- source:en p62 unit:438 -->

Erklärung: EGL ist eine OpenGL-Erweiterung für ARM und das X-Fenstersystem, funktional entsprechend glx auf x86. Xorg verwendet modesetting, das standardmäßig libglx.so lädt. Deaktiviertes glx kann Programme am Start hindern, die eine GLX-Umgebung prüfen. libglx.so sucht DRI-Implementierungsbibliotheken; Xorgs 2D-Beschleunigung basiert hier jedoch direkt auf DRM ohne DRI-Bibliothek. Deshalb meldet libglx.so beim Start folgenden Fehler.

<!-- source:en p62 unit:439 -->

```text
AIGLX error: dlopen of /usr/lib/aarch64-linux-gnu/dri/rockchip_dri.so failed
```

<!-- source:en p62 unit:440 -->

Dies beeinflusst den Systembetrieb nicht und muss nicht behandelt werden. Aus demselben Grund können Anwendungen beim Start folgende Fehler melden, die ebenfalls ohne Auswirkung bleiben und keine Behandlung benötigen.

<!-- source:en p62 unit:441 -->

```text
libGL error: unable to load driver: rockchip_dri.so
libGL error: driver pointer missing
libGL error: failed to load driver: rockchip
```

<!-- source:en p62 unit:442 -->

### 9.11 Aktiven Hardware-Mauszeiger-Layer unter Debian prüfen

<!-- source:en p62 unit:443 -->

Kernel-DTS-Konfiguration ist gesetzt. Beispielprotokoll:

<!-- source:en p63 unit:444 -->

```text
root@linaro-alip:~# dmesg |grep cursor
[    2.062561] rockchip-vop2 fe040000.vop: [drm:vop2_bind] Cluster1-win0 as
cursor plane for vp0
[    2.062669] rockchip-vop2 fe040000.vop: [drm:vop2_bind] Cluster0-win0 as
cursor plane for vp1
```

<!-- source:en p63 unit:445 -->

Mit modetest prüfen, ob die Ebene gemeldet wird

<!-- source:en p63 unit:446 -->

```text
102     0       0       0,0             0,0     0               0x00000002
  formats: XR30 AR30 XB30 AB30 XR24 AR24 XB24 AB24 RG24 BG24 RG16 BG16 YU08 YU10
YUYV Y210
  props:
        8 type:
                flags: immutable enum
                enums: Overlay=0 Primary=1 Cursor=2
                value: 2
```

<!-- source:en p63 unit:447 -->

In summary die Nutzung der Hardware-Cursorebene prüfen: root@linaro-alip:~# cat /sys/kernel/debug/dri/0/summary &#124;grep 64 x 64. Sind Schritte 1/2 bestätigt und bestehen weiterhin Probleme, /var/log/drm-cursor.log auf Auffälligkeiten prüfen.

<!-- source:en p63 unit:448 -->

### 9.12 Größe der Debian-Protokolle

<!-- source:en p63 unit:449 -->

Debian stellt logrotate zur vereinfachten Verwaltung vieler Protokolldateien bereit. Es rotiert, komprimiert und löscht automatisch und versendet protokollbezogene E-Mails. Die Ausführung kann täglich, wöchentlich, monatlich oder bei einer bestimmten Dateigröße erfolgen. Üblich ist ein täglicher cron-Job.

<!-- source:en p63 unit:450 -->

```text
apt install -fy logrotate cron
```

<!-- source:en p63 unit:451 -->

### 9.13 multi-user target unter Debian einrichten

<!-- source:en p63 unit:452 -->

Beim Start versucht systemd, /lib/systemd/system/default.target zu starten, bei grafischen Systemen meist ein symbolischer Link auf "graphical.target". Den Zustand zeigt folgender Befehl:

<!-- source:en p63 unit:453 -->

```text
systemctl get-default
graphical.target
```

<!-- source:en p63 unit:454 -->

Mehrbenutzermodus mit Kommandozeile einrichten

<!-- source:en p63 unit:455 -->

```text
systemctl set-default multi-user.target
```

<!-- source:en p63 unit:456 -->

Nach dem Neustart bleibt die Anzeige beim Logo; das System scheint nicht zugänglich.

<!-- source:en p64 unit:457 -->

Die normale Startfolge lautet sysinit->multi-user->graphic. Bei multi-user.target wird die grafische Oberfläche nicht gestartet. Dafür VT2 mit Terminalinteraktion aktivieren; im Kernel sind folgende zwei Makros nötig:

<!-- source:en p64 unit:458 -->

```text
CONFIG_FRAMEBUFFER_CONSOLE=y
CONFIG_VT=y
```

<!-- source:en p64 unit:459 -->

### 9.14 Debian-Benutzername und -Passwort

<!-- source:en p64 unit:460 -->

Im beschriebenen System lauten Standardbenutzername und Passwort jeweils <code>linaro</code>. Das Konto <code>root</code> erlaubt die Anmeldung ohne Passwort; mit <code>sudo su</code> kann dorthin gewechselt werden.

<!-- source:en p64 unit:461 -->

### 9.15 Fehler beim Doppelklick auf XFCE-Desktopsymbole in Debian

<!-- source:en p64 unit:462 -->

Ein ursprünglicher XFCE-Fehler lässt sich unter <code>Settings---&gt;Desktop---&gt;Icons</code> mit <code>Single-click to activate items</code> umgehen.

<!-- source:en p64 unit:463 -->

### 9.16 Chromium-Kommandozeilenparameter --no-sandbox

<!-- source:en p64 unit:464 -->

Ausgenommen ist die unveränderte offizielle Browserversion ohne Hardwarebeschleunigung. Angepasste Versionen werden mit <code>-no-sandbox</code> gestartet: Die Sandbox regelt Dateizugriffsrechte; ihre Deaktivierung ermöglicht den Zugriff auf Hardwareknoten für die Beschleunigung.

<!-- source:en p64 unit:465 -->

### 9.17 DRI2-Erweiterung unter Debian X11 einrichten

<!-- source:en p64 unit:466 -->

glmark2-es2 im SDK und die Mali-GPU-Bibliothek geben über dri2 aus.

<!-- source:en p64 unit:467 -->

Implementierungsdetails finden Sie im xserver-Code: ./hw/xfree86/drivers/modesetting/dri2.c, ms_dri2_get_msc und ms_dri2_schedule_wait_msc.

<!-- source:en p64 unit:468 -->

Die DRI2-Unterstützung von Xserver lässt sich anhand des folgenden Protokolls prüfen:

<!-- source:en p64 unit:469 -->

```text
root@linaro-alip:/# grep -i dri2 /var/log/Xorg.0.log
[    47.696] (II) modeset(0): [DRI2] Setup complete
[    47.699] (II) modeset(0): [DRI2]   DRI driver: rockchip
[    47.712] (II) modeset(0): [DRI2]   VDPAU driver: rockchip
[    48.502] (II) Initializing extension DRI2
```

<!-- source:en p64 unit:470 -->

Nachfolgend steht der DRI2-Test dri2-test.c.

<!-- source:en p64 unit:471 -->

```text
#include <stdlib.h>
#include <stdio.h>
```

<!-- source:en p65 unit:472 -->

```text
#include <xcb/xcb.h>
#include <xcb/dri2.h>
#include <X11/Xlib.h>
#include <X11/Xlib-xcb.h>

int main(void)
{
    xcb_connection_t *c;
    xcb_dri2_connect_cookie_t cookie;
    xcb_dri2_connect_reply_t *reply;
    Display *display = XOpenDisplay(NULL);
    Window window = DefaultRootWindow(display);
    c = XGetXCBConnection(display);
    cookie = xcb_dri2_connect(c, window, XCB_DRI2_DRIVER_TYPE_DRI);
    reply = xcb_dri2_connect_reply(c, cookie, 0);
    printf("%s[%d] device(%s)\n", __func__, __LINE__,
xcb_dri2_connect_device_name (reply));
    c = xcb_connect(NULL, NULL);
    xcb_screen_t *screen = xcb_setup_roots_iterator(xcb_get_setup(c)).data;
    cookie = xcb_dri2_connect(c, screen->root, XCB_DRI2_DRIVER_TYPE_DRI);
    reply = xcb_dri2_connect_reply(c, cookie, 0);
    printf("%s[%d] device(%s)\n", __func__, __LINE__,
xcb_dri2_connect_device_name (reply));
    return 0;
}
```

<!-- source:en p65 unit:473 -->

Kompilieren und testen:

<!-- source:en p65 unit:474 -->

```text
$ gcc dri2-test.c -lxcb -lxcb-dri2 -lX11 -lX11-xcb -o dri2-test
$ ./dri2-test
main[21] device(/dev/dri/card0)
main[27] device(/dev/dri/card0)
```

<!-- source:en p65 unit:475 -->

### 9.18 GCC-Werkzeugkette unter Debian installieren

<!-- source:en p65 unit:476 -->

Folgende Installationsbefehle ausführen:

<!-- source:en p65 unit:477 -->

```text
apt update && apt install -y build-essential manpages-dev
```

<!-- source:en p65 unit:478 -->

Nach der Installation die GCC-Version prüfen:

<!-- source:en p66 unit:479 -->

```text
root@linaro-alip:/# gcc -v
Using built-in specs.
COLLECT_GCC=gcc
COLLECT_LTO_WRAPPER=/usr/lib/gcc/aarch64-linux-gnu/10/lto-wrapper
Target: aarch64-linux-gnu
Configured with: ../src/configure -v --with-pkgversion='Debian 10.2.1-6' --with-
bugurl=file:///usr/share/doc/gcc-10/README.Bugs --enable-
languages=c,ada,c++,go,d,fortranx
Thread model: posix
Supported LTO compression algorithms: zlib zstd
gcc version 10.2.1 20210110 (Debian 10.2.1-6)
```

<!-- source:en p66 unit:480 -->

### 9.19 Keine Autovervollständigung bei der Debian-Paketinstallation

<!-- source:en p66 unit:481 -->

Dies ist unter Linux üblich: Die großen Distributionen erfordern eine manuelle Installation von bash-completion. Für Einzelheiten verweist die Quelle auf Baidu; üblicherweise sind folgende Schritte nötig:

<!-- source:en p66 unit:482 -->

```text
sudo apt-get install bash-completion
source /etc/bash_completion
```

<!-- source:en p66 unit:483 -->

### 9.20 DRI3-Erweiterung in Debian X11 unterstützen

<!-- source:en p66 unit:484 -->

DRI3 ist eine X11-Erweiterung für verbessertes direktes Rendering, unter Debian gewöhnlich standardmäßig aktiv. Als Low-Level-Protokoll läuft sie nicht direkt ohne externe Aufrufe. Für Anwendungen die Dokumentation lesen und entsprechende Schnittstellen aufrufen, etwa DRI3 aus XCB (X protocol C-language Binding). Installation und Einsicht: Die XCB-DRI3-Entwicklungsbibliothek libxcb-dri3 mit folgendem Befehl installieren:

<!-- source:en p66 unit:485 -->

```text
sudo apt-get install libxcb-dri3-dev
```

<!-- source:en p66 unit:486 -->

Damit werden Bibliotheken und Header für DRI3-Funktionen in Anwendungen installiert. DRI3-Schnittstellen ansehen:

<!-- source:en p67 unit:487 -->

Definitionen und verfügbare Funktionen stehen in der Headerdatei dri3.h:

<!-- source:en p67 unit:488 -->

```text
vi /usr/include/xcb/dri3.h
```

<!-- source:en p67 unit:489 -->

Die Datei enthält die DRI3-Schnittstellendetails und hilft beim Verständnis ihrer Anwendung. Nach diesen Schritten lässt sich DRI3 zur Entwicklung oder Verbesserung grafischer Debian-Anwendungen nutzen. Beim Programmieren die offizielle XCB-/DRI3-Dokumentation für korrekte, effiziente Nutzung berücksichtigen.

<!-- source:en p67 unit:490 -->

### 9.21 Systemstart im Kommandozeilenmodus einrichten

<!-- source:en p67 unit:491 -->

Allgemeines Vorgehen: xserver deinstallieren; im Kernel CONFIG_FRAMEBUFFER_CONSOLE, CONFIG_DRM_FBDEV_EMULATION, CONFIG_VT und CONFIG_VT_CONSOLE aktivieren.

<!-- source:en p67 unit:492 -->

### 9.22 Bildschirmdrehung konfigurieren

<!-- source:en p67 unit:493 -->

Siehe /etc/X11/xorg.conf.d/20-modesetting.conf.

<!-- source:en p67 unit:494 -->

```text
...
Section "Screen"
    Identifier  "Default Screen"
    Device      "Rockchip Graphics"
    Monitor     "Default Monitor"
    DefaultDepth        24
    SubSection "Display"
            Depth       24
            Modes       "1024x600"
    EndSubSection
EndSection

### Valid values for rotation are "normal", "left", "right"
Section "Monitor"
    Identifier  "HDMI-A-1"
    Option      "Rotate" "inverted"
    Option      "Position" "0x0"
EndSection
Section "Monitor"
    Identifier  "DSI-1"
    Option      "Rotate" "left"
    Option      "Position" "0x0"
```

<!-- source:en p68 unit:495 -->

```text
EndSection
```

<!-- source:en p68 unit:496 -->

### 9.23 Schwarzbildphase in Debian vermeiden

<!-- source:en p68 unit:497 -->

Zwischen Start des X-Dienstes und Anzeige der Desktopanwendungen bleibt der Bildschirm schwarz; die Zeit entsteht in den Anwendungen selbst. Soll das Logo sichtbar bleiben, vor Xorg.wrap in /usr/bin/X Folgendes ergänzen:

<!-- source:en p68 unit:498 -->

```text
export XSERVER_FREEZE_DISPLAY=/.freeze_xserver
touch $XSERVER_FREEZE_DISPLAY
$(sleep 6; rm $XSERVER_FREEZE_DISPLAY)&
```

<!-- source:en p68 unit:499 -->

Das Bild bleibt 6 Sekunden eingefroren, danach erscheint der Desktop. Die Dauer kann passend zu den Produktanforderungen angepasst werden.

<!-- source:en p68 unit:500 -->

```text
{
        export XSERVER_FREEZE_DISPLAY=/.freeze_xserver
        touch $XSERVER_FREEZE_DISPLAY
        while sleep .5; do
                pgrep panel && break # Wait for the status bar service
        done
        sleep 2 # Wait for the status bar to be drawn
        rm $XSERVER_FREEZE_DISPLAY
}&
```

<!-- source:en p68 unit:501 -->

### 9.24 Mauszeiger auf dem Debian-Desktop entfernen

<!-- source:en p68 unit:502 -->

Der Standardmechanismus dient Anwendungen ohne Touch-Unterstützung: Xserver wandelt das erste Touch-Ereignis zwangsweise in ein Mausereignis um. Drei mögliche Umgehungen: transparentes Cursorthema verwenden (Einzelheiten separat recherchieren); in hw/xfree86/drivers/modesetting/drmmode_display.c drmModeSetCursor- und drmModeMoveCursor-Aufrufe entfernen; bei enthaltenem drm-cursor in /etc/drm-cursor.conf hide=1 ergänzen.

<!-- source:en p69 unit:503 -->

### 9.25 rkaiq/rkisp-Repository für Debian bauen und portieren

<!-- source:en p69 unit:504 -->

Wie werden unter Buildroot erprobte rkaiq/rkisp-Funktionen korrekt auf Debian übertragen?

<!-- source:en p69 unit:505 -->

#### 9.25.1 Schrittübersicht

<!-- source:en p69 unit:506 -->

Beispielsweise kann RK3588 mit älterem GCC und GLIBC für ein Drittsystem gebaut werden. Schritt 1: Buildroot-Konfiguration für GCC 8 anpassen.

<!-- source:en p69 unit:507 -->

```text
diff --git a/configs/rockchip/chips/rk3588.config
b/configs/rockchip/chips/rk3588.config
index f806813a6e..affb5e71ad 100644
--- a/configs/rockchip/chips/rk3588.config
+++ b/configs/rockchip/chips/rk3588.config
@@ -1,4 +1,4 @@
-BR2_cortex_a76_a55=y
+BR2_cortex_a72_a53=y
 BR2_PACKAGE_RK3588=y
 BR2_ROOTFS_OVERLAY+="board/rockchip/rk3588/fs-overlay/"
 BR2_TARGET_GENERIC_HOSTNAME="rk3588"
diff --git a/package/gcc/Config.in.host b/package/gcc/Config.in.host
index 7556e1ece6..c917823f57 100644
--- a/package/gcc/Config.in.host
+++ b/package/gcc/Config.in.host
@@ -17,7 +17,6 @@ config BR2_GCC_VERSION_ARC
 config BR2_GCC_VERSION_8_X
    bool "gcc 8.x"
-   depends on !BR2_ARCH_NEEDS_GCC_AT_LEAST_9
    # ARC HS48 rel 31 only supported by gcc arc fork.
    depends on !BR2_archs4x_rel31
    select BR2_TOOLCHAIN_GCC_AT_LEAST_8
```

<!-- source:en p69 unit:508 -->

Schritt 2: GCC 8 und GLIBC 2.28 als Buildroot-Standard für die Kompilierung einstellen.

<!-- source:en p69 unit:509 -->

```text
buildroot#cat configs/rockchip_rk3588_glibc2.28_defconfig

#include "../rockchip_rk3588_defconfig"
BR2_GCC_VERSION_8_X=y
BR2_PACKAGE_GLIBC_2_28=y
```

<!-- source:en p69 unit:510 -->

Schritt 3: Buildroot mit der passenden Konfiguration bauen. Die Umgebung einrichten und camera-engine-rkaiq kompilieren.

<!-- source:en p70 unit:511 -->

```text
<SDK>#source buildroot/envsetup.sh rockchip_rk3588_glibc2.28
<SDK>## cd buildroot
buildroot# make camera-engine-rkaiq
```

<!-- source:en p70 unit:512 -->

Übertragen Sie nach dem Build die erzeugten Dateien, beispielsweise <code>output/rockchip_rk3588_glibc2.28/build/camera-engine-rkaiq-1.0/camera-engine-rkaiq-1.0.tar</code>, auf das Debian-System.

<!-- source:en p70 unit:513 -->

### 9.26 deb-Pakete für die Offlineinstallation herunterladen

<!-- source:en p70 unit:514 -->

```text
root@linaro-alip:/# apt-get download <package name>
```

<!-- source:en p70 unit:515 -->

### 9.27 glibc-Version unter Debian prüfen

<!-- source:en p70 unit:516 -->

```text
root@linaro-alip:/# ldd --version
ldd (Debian GLIBC 2.31-13+deb11u7) 2.31

# /lib/libc.so.6
GNU C Library (GNU libc) stable release version 2.35.
```

<!-- source:en p70 unit:517 -->

### 9.28 Physisch beschnittene Bildschirme unter Debian

<!-- source:en p70 unit:518 -->

Der Kundenbildschirm ist physisch von 3840x2160 auf 3840x720 beschnitten. Zum Aktivieren muss die Ausgabe weiterhin 3840x2160 betragen, sichtbar sind jedoch nur 720 Zeilen. Der Mauszeiger kann in den unteren unsichtbaren Bereich mit 1440 Zeilen gelangen.

<!-- source:en p70 unit:519 -->

Die neue xserver-Version unterstützt Padding.

<!-- source:en p70 unit:520 -->

Konfiguration:

<!-- source:en p70 unit:521 -->

```text
+++ b/overlay/etc/X11/xorg.conf.d/20-modesetting.conf
@ -2,6 +2,9 @ Section "Device"
Identifier "Rockchip Graphics"
Driver "modesetting"

+ Option "VirtualSize" "LVDS-1:3840x720"
+ Option "Padding" "LVDS-1:0,1440,0,0"
```

<!-- source:en p71 unit:522 -->

/etc/X11/xorg.conf.d/20-modesetting.conf wie beschrieben ändern. VirtualSize ist die von der Anwendung gesehene Auflösung; Padding gibt abgeschnittene Pixel in der Reihenfolge oben, unten, links, rechts an. Bei unscharfer Schrift kann die Reihenfolge zu left right top bottom wechseln: Option "VirtualSize" "DSI-1:1920x316"; Option "Padding" "DSI-1:0,0,0,764". Die Maus bewegt sich relativ und benötigt normalerweise keine Anpassung. Bei Skalierungs- oder Positionsabweichung einen Softwarecursor versuchen: Cursorebene aus Kernel-DTS entfernen oder SWcursor in der modesetting-conf setzen. Im Kernel-DTS nach cursor suchen und löschen, beispielsweise:

<!-- source:en p71 unit:523 -->

```text
kernel/arch/arm64/boot/dts/rockchip# ag cursor
rk3566-evb2-lp4x-v10-linux.dts
12:     cursor-win-id = <ROCKCHIP_VOP2_CLUSTER0>;
```

<!-- source:en p71 unit:524 -->

Oder:

<!-- source:en p71 unit:525 -->

```text
--- a/overlay/etc/X11/xorg.conf.d/20-modesetting.conf
+++ b/overlay/etc/X11/xorg.conf.d/20-modesetting.conf
@@ -2,6 +2,8 @@ Section "Device"
     Identifier  "Rockchip Graphics"
     Driver      "modesetting"

+    Option      "SWcursor"       "TRUE"
```

<!-- source:en p71 unit:526 -->

### 9.29 XFCE4-Bildschirmsperre unter Debian funktioniert nicht

<!-- source:en p71 unit:527 -->

Die Bildschirmsperre rechts oben im XFCE-Desktop benötigt das Paket light-locker.

<!-- source:en p71 unit:528 -->

```text
sudo apt install -y light-locker
```

<!-- source:en p71 unit:529 -->

### 9.30 Debian-Buildprobleme auf einem PC mit Ubuntu 24.04

<!-- source:en p71 unit:530 -->

Startet /sbin/ldconfig nicht, kann eine fehlerhafte QEMU-Umgebung die Ursache sein. Die QEMU-Datei unter device/rockchip/common/tools/x86_64/qemu-aarch64-static im SDK ersetzen und das System neu starten. Vor dem Austausch sicherstellen, dass

<!-- source:en p72 unit:531 -->

die betroffenen Dateien gesichert sind. Laut Quellenstand haben QEMU-Versionen nach V8.1.1 Kompatibilitätsprobleme mit älterem ldconfig; siehe offiziellen Fehlerbericht #2072564.

<!-- source:en p72 unit:532 -->

## 10. Debian: quelloffene Fremdsoftware und Lizenzen

<!-- source:en p72 unit:533 -->

Informationen zu Debians Open-Source-Software stehen im offiziellen Bereich legal.

<!-- source:en p72 unit:534 -->

## 11. Debian-Referenzen

<!-- source:en p72 unit:535 -->

Offizielle Debian-Dokumentation: debian-docs. Offizielle stabile Debian-Pakete: packages.

### Links aus dem Quelldokument

- [https://wiki.debian.org/LTS](https://wiki.debian.org/LTS)

- [https://salsa.debian.org/live-team/live-build](https://salsa.debian.org/live-team/live-build)

- [https://live-team.pages.debian.net/live-manual/](https://live-team.pages.debian.net/live-manual/)

- [https://packages.debian.org/buster/git-core](https://packages.debian.org/buster/git-core)

- [https://salsa.debian.org/live-team/live-build.git](https://salsa.debian.org/live-team/live-build.git)

- [https://salsa.debian.org/games-team/glmark2](https://salsa.debian.org/games-team/glmark2)

- [https://openbox.org/help/Contents#rc.xml](https://openbox.org/help/Contents#rc.xml)

- [https://gitlab.freedesktop.org/pipewire/pipewire/-/issues/3463](https://gitlab.freedesktop.org/pipewire/pipewire/-/issues/3463)

- [https://salsa.debian.org/public](https://salsa.debian.org/public)

- [https://baike.baidu.com/item/%E7%AA%97%E5%8F%A3%E7%AE%A1%E7%90%86%E5%99%A8](https://baike.baidu.com/item/%E7%AA%97%E5%8F%A3%E7%AE%A1%E7%90%86%E5%99%A8)

- [https://baike.baidu.com/item/X%20Window](https://baike.baidu.com/item/X%20Window)

- [https://baike.baidu.com/item/%E6%A1%8C%E9%9D%A2%E7%8E%AF%E5%A2%83](https://baike.baidu.com/item/%E6%A1%8C%E9%9D%A2%E7%8E%AF%E5%A2%83)

- [https://baike.baidu.com/item/KDE](https://baike.baidu.com/item/KDE)

- [https://baike.baidu.com/item/OpenGL](https://baike.baidu.com/item/OpenGL)

- [https://browserbench.org/ARES-6/](https://browserbench.org/ARES-6/)

- [https://web.basemark.com/](https://web.basemark.com/)

- [https://browserbench.org/JetStream/](https://browserbench.org/JetStream/)

- [https://browserbench.org/MotionMark1.2/](https://browserbench.org/MotionMark1.2/)

- [https://chromium.github.io/octane/](https://chromium.github.io/octane/)

- [https://browserbench.org/Speedometer2.1/](https://browserbench.org/Speedometer2.1/)

- [https://wiki.debian.org/PanfrostLima](https://wiki.debian.org/PanfrostLima)

- [https://wiki.debian.org/PulseAudio/](https://wiki.debian.org/PulseAudio/)

- [https://www.debian.org/security/](https://www.debian.org/security/)

- [https://wiki.debian.org/DebianReleases](https://wiki.debian.org/DebianReleases)

- [https://www.debian.org/doc/manuals/debian-faq/index.en.html](https://www.debian.org/doc/manuals/debian-faq/index.en.html)

- [https://launchpad.net/~canonical-server/+archive/ubuntu/server-backports](https://launchpad.net/~canonical-server/+archive/ubuntu/server-backports)

- [https://bugs.launchpad.net/ubuntu/+source/qemu/+bug/2072564](https://bugs.launchpad.net/ubuntu/+source/qemu/+bug/2072564)

- [https://www.debian.org/legal/](https://www.debian.org/legal/)

- [https://www.debian.org/doc/devel-manuals#debmake-doc](https://www.debian.org/doc/devel-manuals#debmake-doc)

- [https://packages.debian.org/stable/allpackages](https://packages.debian.org/stable/allpackages)

{% endraw %}
