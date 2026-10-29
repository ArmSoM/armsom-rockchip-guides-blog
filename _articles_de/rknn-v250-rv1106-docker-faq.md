---
title: "RKNN auf RV1103/RV1106, Teil 5: Docker, Startprobleme und Referenzen"
description: "RKNN auf RV1103/RV1106, Teil 5: Docker, Startprobleme und Referenzen · RKNN2 V2.5.0"
excerpt: "RKNN auf RV1103/RV1106, Teil 5: Docker, Startprobleme und Referenzen"
translation_key: "rknn-v250-rv1106-docker-faq"
slug: "rknn-v250-rv1106-docker-faq"
lang: "de"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "RV1103", "RV1106", "Mini Runtime"]
---

Plattformreferenz zum RKNN2-V2.5.0-Einstieg für RV1103/RV1103B/RV1106/RV1106B mit passendem Board-SDK, RKNPU2-Treiber und librknnmrt.so. Ein entsprechendes ArmSoM-Board ist nicht bestätigt. Das Linux-5.10.160-Protokoll und Inferenzausgaben sind Quellenbeispiele, keine ArmSoM-Hardwaretests. Versorgung, Anschlüsse und Treiber mit dem tatsächlichen Board-BSP abgleichen.

Quelle: lokale chinesische und englische V2.5.0-PDFs. Chinesisch verwendet chinesischen Text und Abbildungen, Englisch, Russisch und Deutsch die englische Quelle. Alle technischen Kapitel, Befehle und Tabellen bleiben erhalten; PDF-Zeilenumbrüche und Verzeichniseinrückungen wurden wiederhergestellt. Ein alter Treiber im Beispielprotokoll ist nicht die empfohlene Version; die Empfehlung steht im Text. Downloads und pip-Installationen ohne Versionsbindung mit dem SDK abgleichen.

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

[RKNN auf RV1103/RV1106, Teil 1: Ablauf, Plattformen und Repositorys](/de/articles/rknn-v250-rv1106-deployment-flow/)

[RKNN auf RV1103/RV1106, Teil 2: Hardwareanschluss und Geräteprüfung](/de/articles/rknn-v250-rv1106-hardware/)

[RKNN auf RV1103/RV1106, Teil 3: Host-Umgebung und Mini Runtime](/de/articles/rknn-v250-rv1106-host-runtime/)

[RKNN auf RV1103/RV1106, Teil 4: YOLOv5, Python und C-Bereitstellung](/de/articles/rknn-v250-rv1106-yolov5/)

**RKNN auf RV1103/RV1106, Teil 5: Docker, Startprobleme und Referenzen**

{% raw %}

## 5. RKNN Python Demo in Docker ausführen (optional)

Statt RKNN-Toolkit2 direkt auf dem Computer zu installieren, lässt sich RKNN Python Demo in einem Docker-Image mit dieser Umgebung ausführen.

Das Image dieses Kapitels enthält nur RKNN-Toolkit2 und dient hauptsächlich Python Demo. Die boardseitige RKNPU2-Umgebung muss weiterhin nach Abschnitt 3.3 vorbereitet werden.

### 5.1 Docker installieren

Bei vorhandener Docker-Installation diesen Abschnitt überspringen. Andernfalls die offizielle Anleitung verwenden: https://docs.docker.com/install/linux/docker-ce/ubuntu/.

Nach der Installation den aktuellen Benutzer zur Gruppe docker hinzufügen:

```text
# Create the docker group
sudo groupadd docker

# Add the current user to the docker group
sudo usermod -aG docker $USER

# Activate the docker group
newgrp docker

# Verify that docker commands can be executed without sudo
docker run hello-world
```

Bei Erfolg erscheint eine ähnliche Ausgabe:

```text
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
719385e32844: Pull complete
Digest: sha256:88ec0acaa3ec199d3b7eaf73588f4518c25f9d34f58ce9a0df68429c5af48e8d
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
```

### 5.2 RKNN-Toolkit2-Docker-Image vorbereiten

Das Image kann aus einer Dockerfile gebaut oder aus einer vorbereiteten Datei geladen werden.

#### 5.2.1 Image aus Dockerfile bauen

Dockerfiles liegen unter docker/docker_file im RKNN-Toolkit2-Projekt:

```text
# xx and x.x.x represent version numbers. Replace them with the actual values
cd Projects/rknn-toolkit2/rknn-toolkit2/docker/docker_file/ubuntu_xx_xx_cpxx

docker build -f Dockerfile_ubuntu_xx_xx_for_cpxx -t rknn-toolkit2:x.x.x-cpxx .
```

#### 5.2.2 Vorbereitetes Image laden

Docker-Image: https://console.zbox.filez.com/l/I00fc3 (Zugangscode: rknn).

Ausführen:

```text
# x.x.x is the RKNN-Toolkit2 version, and cpxx is the Python version

docker load --input rknn-toolkit2-x.x.x-cpxx-docker.tar.gz
```

#### 5.2.3 Image prüfen

```text
docker images
```

Referenzausgabe:

```text
REPOSITORY TAG IMAGE ID CREATED SIZE
rknn-toolkit2 x.x.x-cpxx xxxxxxxxxxxx 1 hours ago 5.89GB
```

### 5.3 RKNN Python Demo im Container ausführen

RKNN Model Zoo lokal nach Abschnitt 1.5 vorbereiten, dann Verzeichnis und USB-Gerät in den Container einbinden:

```text
# -v <host src folder>:<image dst folder> maps a local directory into the container

docker run -t -i --privileged \
    -v /dev/bus/usb:/dev/bus/usb \
    -v "$HOME/Projects/rknn_model_zoo:/rknn_model_zoo" \
    rknn-toolkit2:x.x.x-cpxx \
    /bin/bash
```

Im Container das Modell vorbereiten:

```text
cd /rknn_model_zoo/examples/yolov5/model
./download_model.sh
```

Das Modell konvertieren:

```text
cd /rknn_model_zoo/examples/yolov5/python
python convert.py ../model/yolov5s_relu.onnx rv1106 i8 ../model/yolov5s_relu.rknn
```

RKNN Python Demo ausführen:

```text
python yolov5.py --model_path ../model/yolov5s_relu.rknn --target rv1106
```

Nach erfolgreichem Skriptlauf ähnelt die Ausgabe dem Beispiel: class ist die vorhergesagte Klasse, score der Konfidenzwert, (xmin, ymin) die linke obere und (xmax, ymax) die rechte untere Ecke der Erkennungsbox.

```text
# class @ (xmin, ymin, xmax, ymax) score
person @ (209 243 286 510) 0.880
person @ (479 238 560 527) 0.871
person @ (109 238 231 534) 0.840
bus @ (91 129 555 464) 0.692
```

## 6. Häufige Startprobleme und nächste Schritte

Dieses Kapitel behandelt nur häufige Verbindungs-, Server- und Speicherprobleme beim ersten Lauf. Werkzeuginstallation, Modellkonvertierung und systematische Fehlerbehebung beschreibt RKNN2_SDK_Development_Guide. Für API-Fragen je nach Schnittstelle RKNN2_Toolkit_Python_API_Reference, RKNN2_Toolkit_Lite_Python_API_Reference oder RKNN2_Runtime_C_API_Reference verwenden.

### 6.1 Gerät wird nicht erkannt

Falls adb devices kein Gerät anzeigt, der Reihe nach prüfen:

1. Kabelanschluss prüfen und erneut verbinden.

2. Einen anderen USB-Port des Computers verwenden.

3. Das Datenkabel austauschen.

4. Bei USB-Verbindung sicherstellen, dass zwischen lokalem Computer und Docker nur ein ADB Server läuft. Für eine Verbindung aus Docker zuerst auf dem lokalen Computer ausführen:

```text
adb kill-server
```

Die folgende Fehlermeldung bedeutet, dass ADB nicht installiert ist:

```text
command 'adb' not found, but can be installed with:
sudo apt install adb
```

ADB installieren:

```text
sudo apt install adb
```

### 6.2 rknn_server startet nicht korrekt

Für RKNN-Toolkit2-Board-Debugging sind RKNPU2 und ein korrekt laufender rknn_server erforderlich. Manche Board-Systeme starten rknn_server nicht automatisch. RKNN Python Demo kann dann Folgendes melden:

```text
E init_runtime: The rknn_server on the concected device is abnormal.
```

Manuell starten:

```text
adb shell
restart_rknn.sh
```

Bleibt das Problem bestehen, Komponenten und Versionen nach Abschnitt 3.3.2 erneut prüfen.

### 6.3 Modellladen scheitert wegen Speichermangel

RV1103/RV1103B/RV1106/RV1106B haben begrenzten Speicher. Läuft rkipc bereits, kann das Modellladen mit folgendem Fehler scheitern:

```text
E init_runtime: Exception: RKNN init failed. error code: RKNN_ERR_MODEL_INVALID
```

Auf das Board wechseln und rkipc beenden:

```text
adb shell

# View the currently running processes and find the PID corresponding to rkipc
top

# Terminate the rkipc process
kill -9 PID
```

### 6.4 Dokumentation für die nächsten Schritte

Nach dem ersten Lauf das jeweilige Hauptdokument für weitere Entwicklungsaufgaben verwenden. Vollständige Abläufe, APIs und erweiterte Einstellungen gehören nicht in diesen Quickstart.

| Suchbedarf / Lernziel | Empfohlene Referenz |
| --- | --- |
| RK3588 und weitere Plattformen: erste RKNN2-SDK-Einrichtung, Modellkonvertierung und Bereitstellungsprüfung | RKNN2_SDK_QuickStart |
| RK2118: erste RKNN2-SDK-Einrichtung, Modellkonvertierung und Bereitstellungsprüfung | RKNN2_RK2118_QuickStart |
| Gesamter Entwicklungsablauf: RKNN2-Softwarearchitektur, Modellkonvertierung und Quantisierung, Genauigkeits-/Leistungsanalyse, vollständige Bereitstellung und Fehlerbehebung | RKNN2_SDK_Development_Guide |
| Modellkonvertierung und Analyse am PC: Methoden, Parameter und Rückgabewerte der RKNN-Toolkit2-Python-API | RKNN2_Toolkit_Python_API_Reference |
| Leichtgewichtige Python-Bereitstellung auf dem Board: Methoden, Parameter und Rückgabewerte der RKNN-Toolkit-Lite2-Python-API | RKNN2_Toolkit_Lite_Python_API_Reference |
| C/C++-Bereitstellung auf dem Board: C-APIs, Strukturen, Enumerationen, Fehlercodes und Mini-Runtime-Schnittstellen | RKNN2_Runtime_C_API_Reference |
| Modellkompatibilität bewerten: unterstützte RKNN-Operatoren und ihre Einschränkungen | RKNN2_Supported_Operators_and_Constraints_Reference |

Dieser Leitfaden gilt für RV1103/RV1103B/RV1106/RV1106B und verwendet durchgehend RKNPU2 Mini Runtime (librknnmrt.so). RKNN2_Runtime_C_API_Reference ist der Name der Runtime-C-API-Referenz. Dort die zur Plattform und SDK-Version passenden Schnittstellen auswählen.

{% endraw %}
