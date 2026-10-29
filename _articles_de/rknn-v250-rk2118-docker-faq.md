---
title: "RK2118 NPU, Teil 5: Docker, häufige Fragen und Referenzen"
description: "RK2118 NPU, Teil 5: Docker, häufige Fragen und Referenzen · RKNN2 V2.5.0"
excerpt: "RK2118 NPU, Teil 5: Docker, häufige Fragen und Referenzen"
translation_key: "rknn-v250-rk2118-docker-faq"
slug: "rknn-v250-rk2118-docker-faq"
lang: "de"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RK2118", "RKNN", "Toolkit2", "RT-Thread"]
---

Plattformreferenz für RK_EVB1_RK2118G_V20 (RK2118) und das passende RT-Thread SDK. Ein entsprechendes ArmSoM-Board ist nicht bestätigt; die Anleitung nicht direkt auf andere SoCs übertragen. Es werden weder ein geprüfter BSP noch ein Linux-Kernel festgelegt; ArmSoM-Hardwaretests fanden nicht statt.

Quelle: lokale chinesische und englische RKNN2 RK2118 QuickStart V2.5.0; ursprüngliche Abschnittsnummern bleiben erhalten. Chinesisch folgt seiner Quelle, die übrigen Sprachen der englischen. PDF-Zeilenumbrüche in Dateinamen, URLs, Kommentaren und Befehlen wurden zusammengeführt. Abschnitt 5.3 verweist für den RT-Thread-Download auf 3.1; die Schritte stehen tatsächlich in 3.3.1. Docker bindet /rt-thread ein, der spätere Befehl verwendet jedoch den relativen Pfad rt-thread/...; das Arbeitsverzeichnis des Containers prüfen. Diese Abweichung wurde nicht stillschweigend geändert. Protokolle, 45ms und Referenzausgaben stammen aus der Quelle, nicht aus ArmSoM-Tests. Installationsbefehle mit latest oder ohne feste Version garantieren nicht V2.5.0; mit dem tatsächlichen SDK abgleichen.

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

<!-- rk2118-series:start -->

**RK2118-Einstiegsserie · 5/5**

[RK2118 NPU, Teil 1: Hardware, Anschluss und serielle Konsole](/de/articles/rknn-v250-rk2118-hardware/)

[RK2118 NPU, Teil 2: Host-Umgebung und Toolkit2-Installation](/de/articles/rknn-v250-rk2118-host-environment/)

[RK2118 NPU, Teil 3: RT-Thread und DSP-Firmware](/de/articles/rknn-v250-rk2118-firmware/)

[RK2118 NPU, Teil 4: Modellkonvertierung, USB-Eingaben und Inferenzergebnisse](/de/articles/rknn-v250-rk2118-model-demo/)

**RK2118 NPU, Teil 5: Docker, häufige Fragen und Referenzen**

<!-- rk2118-series:end -->

{% raw %}

## 5. RKNN-Modellkonvertierung in Docker (optional)

Für RKNN Python Demo in Docker die Umgebung nach diesem Kapitel vorbereiten.

Die Quelle stellt ein Docker-Image mit der RKNN-Toolkit2-Umgebung bereit, damit RKNN Python Demo ohne eigene Umgebungsinstallation ausgeführt werden kann. Dieses Image enthält jedoch nur eine reine RKNN-Toolkit2-Umgebung und ist speziell für RKNN Python Demo vorgesehen.

Das Kapitel besteht aus drei Teilen:

- Docker installieren

- RKNN-Toolkit2-Umgebung in Docker installieren

- RKNN Python Demo ausführen

### 5.1 Docker installieren

Bei vorhandener Docker-Installation diesen Schritt überspringen. Andernfalls Docker nach der offiziellen Dokumentation installieren.

Offizielle Docker-Installationsanleitung: https://docs.docker.com/install/linux/docker-ce/ubuntu/

Hinweis: Der Benutzer muss der Gruppe docker hinzugefügt werden.

```text
# Create the docker group
sudo groupadd docker
# Add the current user to the docker group
sudo usermod -aG docker $USER
# Update to activate the docker group
newgrp docker

# Verify that docker commands can be executed without sudo
docker run hello-world
```

Referenzausgabe nach erfolgreicher Installation:

```text
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
719385e32844: Pull complete
Digest: sha256:88ec0acaa3ec199d3b7eaf73588f4518c25f9d34f58ce9a0df68429c5af48e8d
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
```

### 5.2 RKNN-Toolkit2-Umgebung in Docker installieren

#### 5.2.1 RKNN-Toolkit2-Image vorbereiten

Für die Erstellung der RKNN-Toolkit2-Image-Umgebung stehen zwei Methoden zur Auswahl.

**1. RKNN-Toolkit2-Image mit einer Dockerfile erstellen**

Im Projekt RKNN-Toolkit2 enthält docker/docker_file eine Dockerfile zum Aufbau der Entwicklungsumgebung. Das Image mit docker build erstellen:

```text
# Note: Replace 'xx' and 'x.x.x' with the actual version numbers
cd Projects/rknn-toolkit2/rknn-toolkit2/docker/docker_file/ubuntu_xx_xx_cpxx
docker build -f Dockerfile_ubuntu_xx_xx_for_cpxx -t rknn-toolkit2:x.x.x-cpxx .
```

**2. RKNN-Toolkit2-Image aus einer vorbereiteten Docker-Image-Datei laden**

Die Projektdateien der passenden RKNN-Toolkit2-Version über folgenden Link herunterladen. Nach dem Entpacken enthält docker/docker_image ein vorbereitetes Docker-Image mit der vollständigen Entwicklungsumgebung.

Cloud-Download: https://console.zbox.filez.com/l/I00fc3 (Zugangscode: rknn).

Mit folgendem Befehl die Image-Datei für die passende Python-Version laden:

```text
# Note: Replace 'x.x.x' with the actual version number of RKNN-Toolkit2, and 'cpxx' with the Python version
docker load --input rknn-toolkit2-x.x.x-cpxx-docker.tar.gz
```

#### 5.2.2 Image-Informationen abfragen

Nach erfolgreichem Erstellen oder Laden lassen sich die Docker-Image-Informationen mit folgendem Befehl anzeigen:

```text
docker images
```

Beispiel der zugehörigen RKNN-Toolkit2-Image-Informationen:

```text
REPOSITORY TAG IMAGE ID CREATED SIZE
rknn-toolkit2 x.x.x-cpxx xxxxxxxxxxxx 1 hours ago 5.89GB
```

### 5.3 Modellkonvertierung

- Dateien einbinden und Container starten

Die Quelle verweist für den lokalen Download von rt-thread auf Kapitel 3.1. Das lokale Projekt in den Container einbinden und diesen mit docker run starten. Anschließend befindet man sich in dessen Bash-Umgebung. Beispielbefehle:

```text
# Use the docker run command to create and run the RKNN Toolkit2 container
# Map local files into the container by attaching the -v <host src folder>:<image dst folder> parameter
docker run -t -i --privileged \
    -v /dev/bus/usb:/dev/bus/usb \
    -v /Projects/rt-thread:/rt-thread \
    rknn-toolkit2:x.x.x-cpxx \
    /bin/bash
```

- Modellkonvertierung

In rt-thread/components/rknpu/examples/rknn_benchmark/res wechseln und convert.py ausführen.

```text
cd rt-thread/components/rknpu/examples/rknn_benchmark/res
python convert.py
```

## 6. Häufige Fragen

### 6.1 Kein adb-Gerät sichtbar

RK2118 unterstützt derzeit kein Debugging über adb. Deshalb zeigt dieser Befehl keine adb-Geräte an.

### 6.2 Aufgabe von rknn_demo_server

rknn_demo_server dient auf RK2118 nicht dem Board-Debugging mit RKNN-Toolkit2, sondern der Kommunikation zwischen DSP und MCU.

## 7. Referenzdokumente

- Ausführlichere Hinweise zur Verwendung und zu Schnittstellen von RKNN-Toolkit2 und RKNPU2 stehen in RKNN2_SDK_Development_Guide_V2.5.0.pdf.

- Die RK2118-Dokumentation ist in Rockchip_Developer_Guide_RK2118_CN.pdf zu finden.

Hinweis: Für Begleitdokumente ohne festgelegten Dateinamen in diesem Leitfaden gelten die tatsächlichen Namen im aktuellen SDK-Paket.

{% endraw %}
