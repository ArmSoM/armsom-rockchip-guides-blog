---
title: "Rockchip Debian-Cross-Compilation mit Docker"
description: "Rockchip Debian-Cross-Compilation mit Docker — V1.2.1"
excerpt: "Rockchip Debian-Cross-Compilation mit Docker"
translation_key: "187-rockchip-debian-docker"
slug: "187-rockchip-debian-docker"
lang: "de"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, Linux]
---

{% raw %}

# Rockchip Debian-Cross-Compilation mit Docker

ArmSoM-Plattformreferenz anhand der bereitgestellten chinesischen und englischen Rockchip-Quellen. Konkrete Platine, SoC, SDK/BSP, Kernel und Peripherie einzeln abgleichen; keine allgemeine Unterstützung aller ArmSoM-Platinen. Quellbeispiele und Messwerte sind keine ArmSoM-Tests. Keine Befehle oder Hardwaretests ausgeführt.

Debian-deb-Pakete für mehrere Architekturen auf einem Ubuntu-PC bauen; die Tabelle behält historische Quellversionen bei.

Beide Originale V1.2.1; sämtliche technischen Kapitel bleiben erhalten, separate Abbildungen gibt es nicht. Chinesische Platzhalter `<package_dir>`/`<pkg_dev>` unterscheiden sich von englischen `<package dir>`/`<package-name>`; RU/DE folgen Englisch. Ein Platzhalter mit Leerzeichen ist kein ausführbarer Pfad. Das chinesische Beispiel enthält weiterhin `rockchip 。` und einen vollbreiten Prompt-Doppelpunkt; Lauffähigkeit wird nicht behauptet. Nur Layoutumbrüche wie in `dpkg-buildpackage` wurden verbunden. Alte Ubuntu-Versionen, Paketnamen und „neueste“ beziehen sich auf den Quellenzeitpunkt. Portabilität hängt von Architektur, Kernel und Geräten ab.

| Paket | Version | OS |
| --- | --- | --- |
| glmark2 | 2021.02 | Debian |
| gst-plugins-base | 1.14.4/1.18.5 | Debian |
| gstreamer-rockchip | 1.14.4 | Debian |
| libdrm | 2.4.97/2.4.104 | Debian |
| libdrm-cursor | 1.4.0 | Debian |
| libmali | 1.9.0 | Debian |
| mpp | 1.5.0 | Debian |
| libv4l-rkmpp | 1.5.0 | Debian |
| openbox | 3.6.1 | Debian |
| pcmanfm | 1.2.5 | Debian |
| rga | 2.1.0/2.2.0 | Debian |
| rkisp | 2.2.0 | Debian |
| rkaiq | 5.0 | Debian |
| xserver | 1.20.4/1.20.11 | Debian |
| wifibt | 1.0.0 | Debian |
| rktoolkit | 1.0.0 | Debian |

## 1. Rockchip Docker

Docker vereinfacht das Erstellen, Bereitstellen und Ausführen von Anwendungen in Containern. Entwickler bündeln Anwendungen mit Bibliotheken und weiteren Abhängigkeiten. Die Quelle beschreibt dies als Möglichkeit, sie trotz unterschiedlicher Einstellungen auf anderen Linux-Rechnern auszuführen. Docker ähnelt insofern einer virtuellen Maschine, erzeugt jedoch kein vollständiges virtuelles Betriebssystem: Anwendungen teilen den Linux-Kernel des Hosts, und nur dort noch nicht vorhandene Komponenten müssen mitgeliefert werden. Laut Quelle erhöht das die Leistung und verkleinert die Anwendung. Docker ist quelloffen; jeder kann beitragen und zusätzliche benötigte Funktionen ergänzen. Für Rockchip Docker verweist die Quelle auf das externe Projekt docker-rockchip.

## 2. Betriebssystemanforderungen

Die Quelle nennt folgende 64-Bit-Ubuntu-Versionen:

- Jammy 22.04 (LTS)
- Focal 20.04 (LTS)
- Bionic 18.04 (LTS)
- Xenial 16.04 (LTS)
- Trusty 14.04 (LTS)

Die dockerfile ist standardmäßig für ARM64 bestimmt. Für 32-Bit-SoCs `dockerfile-32` nach `dockerfile` kopieren: `cp dockerfile-32 dockerfile`.

### 2.1 Docker installieren

Installationsbefehl der Quelle; unter Ubuntu 14.04 soll laut Quelle docker durch docker.io ersetzt werden:

```text
sudo apt-get install docker qemu-user-static binfmt-support
```

Docker-Dienst starten:

```text
sudo service docker start
```

Docker-Image anhand der dockerfile erstellen:

```text
sudo docker build -t rockchip .
```

Dadurch entsteht das Image rockchip mit einer Debian-Cross-Compile-Umgebung für mehrere Architekturen.

### 2.2 Anwendung bauen

Container-Shell öffnen:

```text
sudo docker run -it -v <package dir>:/home/rk/packages rockchip /bin/bash
```

Build starten. Für 32-Bit-ARM-SoCs:

```text
cd /home/rk/packages/<package-name>
DEB_BUILD_OPTIONS=nocheck dpkg-buildpackage -rfakeroot -b -d -uc -us -aarmhf
ls ../ | grep *.deb
```

Für 64-Bit-ARM-SoCs:

```text
cd /home/rk/packages/<package-name>
DEB_BUILD_OPTIONS=nocheck dpkg-buildpackage -rfakeroot -b -d -uc -us -aarm64
ls ../ | grep *.deb
```

### 2.3 Image ändern

Zum Ändern des Docker-Images mit folgendem Befehl eine Shell öffnen:

```text
sudo docker run -it rockchip /bin/bash
```

Nach Verlassen des Containers die Änderungen mit folgendem Befehl speichern:

```text
sudo docker commit  <container_id> rockchip
```

## 3. Weitere Informationen

Weitere Docker-Dokumentation: https://docs.docker.com

## 4. Beispiel

libmali-bifrost-g52-g2p0-x11_1.9-1_arm64.deb im Projekt libmali erzeugen:

```text
~/work/docker/docker-rockchip$sudo service docker start
~/work/docker/docker-rockchip$sudo docker build -t rockchip .
~/work/docker/docker-rockchip$sudo docker run -it -v /home/wxt/work:/home/rk/packages rockchip /bin/bash
rk@2888134f9c12:/$ cd /home/rk/packages/docker/libmali
rk@2888134f9c12:~/packages/docker/libmali$ DEB_BUILD_OPTIONS=nocheck dpkg-buildpackage -rfakeroot -b -d -uc -us -aarm64
```

Die deb-Pakete liegen anschließend unter ~/packages/docker/. Die Quelle nennt folgende Projekte zum Erzeugen von deb-Paketen:

- glmark2
- libmali
- mpp
- rga
- rkwifbt
- gstreamer-rockchip

## Quellverweise

[ArmSoM Docs](https://docs.armsom.org/)

[https://github.com/docker/docker](https://github.com/docker/docker)

[https://opensource.com/resources/what-open-source](https://opensource.com/resources/what-open-source)

[https://github.com/Fruit-Pi/docker-rockchip](https://github.com/Fruit-Pi/docker-rockchip)

[https://docs.docker.com/](https://docs.docker.com/)

[https://salsa.debian.org/games-team/glmark2](https://salsa.debian.org/games-team/glmark2)

[https://github.com/Fruit-Pi/libmali](https://github.com/Fruit-Pi/libmali)

[https://github.com/Fruit-Pi/mpp](https://github.com/Fruit-Pi/mpp)

[https://github.com/Fruit-Pi/linux-rga](https://github.com/Fruit-Pi/linux-rga)

[https://github.com/Fruit-Pi/rkwifibt](https://github.com/Fruit-Pi/rkwifibt)

[https://github.com/Fruit-Pi/gstreamer-rockchip](https://github.com/Fruit-Pi/gstreamer-rockchip)

{% endraw %}
