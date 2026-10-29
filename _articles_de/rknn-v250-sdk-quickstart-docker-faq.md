---
title: "RKNN2 V2.5.0, Teil 6: Docker, Startprobleme und Referenzen"
description: "RKNN2 V2.5.0, Teil 6: Docker, Startprobleme und Referenzen · RKNN2 V2.5.0"
excerpt: "RKNN2 V2.5.0, Teil 6: Docker, Startprobleme und Referenzen"
translation_key: "rknn-v250-sdk-quickstart-docker-faq"
slug: "rknn-v250-sdk-quickstart-docker-faq"
lang: "de"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "RK3588", "RK3576", "V2.5.0"]
---

Geltungsbereich: RKNN2-V2.5.0-Plattformreferenz für RK3562, die Serien RK3566/3568/3576/3588 und RV1126B. Auch ein ArmSoM-Board mit demselben SoC benötigt passende BSP-, NPU-Treiber- und Runtime-Versionen. Versorgung, USB und Firmware des Rockchip-EVB nicht ungeprüft übernehmen. Host- und Treiberanforderungen stehen im Text. Keine ArmSoM-Hardwarevalidierung durchgeführt.

Nach den lokalen chinesischen und englischen V2.5.0-Quellen mit ursprünglicher Abschnittsnummerierung. Chinesisch verwendet chinesische Abbildungen, die übrigen Sprachen die der englischen Quelle. PDF-Umbrüche, fortgesetzte Tabellen und Codeeinrückungen wurden wiederhergestellt. Beispielausgaben sind keine ArmSoM-Tests.

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

[RKNN2 V2.5.0, Teil 1: Bereitstellung, Plattformen und SDK-Repositorys](/de/articles/rknn-v250-sdk-quickstart-deployment-flow/)

[RKNN2 V2.5.0, Teil 2: Hardwareanschluss und ADB-Prüfung](/de/articles/rknn-v250-sdk-quickstart-hardware/)

[RKNN2 V2.5.0, Teil 3: Toolkit, Android/Linux-Runtime und Compiler](/de/articles/rknn-v250-sdk-quickstart-environment/)

[RKNN2 V2.5.0, Teil 4: MobileNet konvertieren und bereitstellen](/de/articles/rknn-v250-sdk-quickstart-mobilenet/)

[RKNN2 V2.5.0, Teil 5: YOLOv5-Erkennung und Genauigkeitsbewertung](/de/articles/rknn-v250-sdk-quickstart-yolov5/)

**RKNN2 V2.5.0, Teil 6: Docker, Startprobleme und Referenzen**

{% raw %}

## 5. RKNN Python Demo in Docker ausführen (optional)

Für RKNN Python Demo in Docker die Umgebung nach diesem Kapitel vorbereiten.

Das bereitgestellte Docker-Image enthält die RKNN-Toolkit2-Umgebung und erlaubt die direkte Ausführung der RKNN Python Demo ohne eigene Umgebungseinrichtung. Es enthält jedoch nur eine saubere RKNN-Toolkit2-Umgebung und ist speziell für die RKNN Python Demo vorgesehen.

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

### 5.2 RKNN-Toolkit2-Image vorbereiten

Für die Erstellung der RKNN-Toolkit2-Image-Umgebung stehen zwei Methoden zur Auswahl.

1. RKNN-Toolkit2-Image mit Dockerfile erstellen

Im RKNN-Toolkit2-Projekt enthält docker/docker_file ein Dockerfile für die Entwicklungsumgebung. Das Image mit docker build erstellen:

```text
# Note: Replace 'xx' and 'x.x.x' with the actual version numbers
cd Projects/rknn-toolkit2/rknn-toolkit2/docker/docker_file/ubuntu_xx_xx_cpxx
docker build -f Dockerfile_ubuntu_xx_xx_for_cpxx -t rknn-toolkit2:x.x.x-cpxx .
```

2. RKNN-Toolkit2-Image aus einer vorgepackten Docker-Image-Datei laden

Die RKNN-Toolkit2-Projektdateien der passenden Version über den folgenden Link herunterladen. Nach dem Entpacken liegt unter docker/docker_image ein vorgepacktes Image mit allen Entwicklungsumgebungen.

Cloud-Download des Docker-Images: https://console.zbox.filez.com/l/I00fc3 (Zugangscode: rknn)

Mit folgendem Befehl die Image-Datei der passenden Python-Version laden.

```text
# Note: Replace 'x.x.x' with the actual version number of RKNN-Toolkit2, and 'cpxx' with the Python version
docker load --input rknn-toolkit2-x.x.x-cpxx-docker.tar.gz
```

Nach erfolgreicher Erstellung oder Ladung die Docker-Image-Informationen mit folgendem Befehl anzeigen:

```text
docker images
```

Informationen zum entsprechenden RKNN-Toolkit2-Image:

```text
REPOSITORY TAG IMAGE ID CREATED SIZE
rknn-toolkit2 x.x.x-cpxx xxxxxxxxxxxx 1 hours ago 5.89GB
```

### 5.3 RKNN Python Demo in Docker ausführen

Hinweis: Auf dem Board muss die RKNPU2-Umgebung installiert sein. Andernfalls gemäß Abschnitt 3.3 installieren.

1. Dateien einbinden und Container starten

RKNN Model Zoo gemäß Abschnitt 1.5 lokal herunterladen. Das Verzeichnis in den Container einbinden und docker run ausführen. Danach öffnet sich die Bash-Umgebung des Containers. Befehle:

```text
# Use the docker run command to create and run the RKNN-Toolkit2 container
# Map local files into the container by attaching the -v <host src folder>:<image dst folder> parameter
docker run -t -i --privileged \
    -v /dev/bus/usb:/dev/bus/usb \
    -v /Projects/rknn_model_zoo:/rknn_model_zoo \
    rknn-toolkit2:x.x.x-cpxx \
    /bin/bash
```

2. Modell im Container vorbereiten und konvertieren

Im Container YOLOv5 gemäß Abschnitt 4.2.1 herunterladen und konvertieren.

3. RKNN Python Demo im Container ausführen

Die RKNN Python Demo gemäß Abschnitt 4.2.2 starten. Befehl:

```text
# Switch to the rknn_model_zoo/examples/yolov5/python directory
cd rknn_model_zoo/examples/yolov5/python

# Run the yolov5.py script to run the yolov5 model on the board
# Usage: python yolov5.py --model_path {rknn_model} --target {target_platform}
# Note: Here, we use rk3588 as an example platform. If using a different board, modify the platform type in the command accordingly.
python yolov5.py --model_path ../model/yolov5s_relu.rknn --target rk3588
```

Hinweis: Bei USB-Verbindung darf gleichzeitig nur ein adb server auf Host und Docker-Container laufen. Für den Board-Zugriff aus Docker den lokalen adb server mit adb kill-server im Computerterminal beenden.

## 6. Startprobleme und nächste Schritte

Dieses Kapitel behandelt Probleme beim ersten Lauf und ihre Diagnose. Vollständige FAQ sowie Konvertierungs-, Genauigkeits-, Leistungs- und Speicherprobleme stehen in Kapitel 10 „FAQ“ des RKNN2 SDK Development Guide.

### 6.1 adb devices zeigt kein Gerät

Folgende Maßnahmen können zur Behebung versucht werden:

1. Die Verbindung prüfen, das Datenkabel erneut anschließen und einen anderen USB-Port am Computer oder ein anderes Datenkabel versuchen.

2. Bei USB-Verbindung darf gleichzeitig nur ein adb server auf Computer und Docker-Container laufen. Für den Board-Zugriff aus Docker etwa adb kill-server im Computerterminal ausführen, um den lokalen adb server zu beenden.

3. Die folgende Fehlermeldung bedeutet, dass adb nicht installiert ist. Zur Installation sudo apt install adb ausführen.

```text
command 'adb' not found, but can be installed with:
sudo apt install adb
```

### 6.2 Dienst rknn_server manuell starten

Für das Debugging mit angeschlossenem Board benötigt RKNN-Toolkit2 eine installierte RKNPU2-Umgebung und einen laufenden rknn_server.

Auf manchen Boards startet rknn_server nach Einschalten oder Neustart nicht automatisch. Die RKNN Python Demo kann dann E init_runtime: The rknn_server on the connected device is abnormal melden. Den manuellen Dienststart beschreibt Abschnitt 3.3.2.

### 6.3 Dokumentnavigation

Nach dem ersten Lauf das zur Aufgabe passende Hauptdokument verwenden; vollständige APIs und erweiterte Konfigurationen stehen nicht in dieser Kurzanleitung.

| Weiterführender Inhalt | Hauptdokument / Einstieg |
| --- | --- |
| Vollständige RKNN-Toolkit2-Installation, Modellkonvertierung und Quantisierungskonfiguration | RKNN2 SDK Development Guide |
| Toolkit-Methoden, Parameter und Rückgabewerte (Python API) | RKNN2 SDK Development Guide |
| Runtime-C-API-Referenz | RKNN2 Runtime C API Reference |
| FAQ zu Werkzeuginstallation, NPU-Umgebung, Modellkonvertierung und Modellbewertung | RKNN2 SDK Development Guide |
| Modellgenauigkeitsanalyse (accuracy_analysis) | RKNN2 SDK Development Guide |
| RKNN-Toolkit2-Installation mit Docker | RKNN2 SDK Development Guide |
| Verwendung der Modellbeispiele im RKNN Model Zoo | rknn_model_zoo/examples/&lt;model_name&gt;/README.md |

{% endraw %}
