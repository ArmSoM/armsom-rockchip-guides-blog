---
title: "RKNN auf RV1103/RV1106, Teil 3: Host-Umgebung und Mini Runtime"
description: "RKNN auf RV1103/RV1106, Teil 3: Host-Umgebung und Mini Runtime · RKNN2 V2.5.0"
excerpt: "RKNN auf RV1103/RV1106, Teil 3: Host-Umgebung und Mini Runtime"
translation_key: "rknn-v250-rv1106-host-runtime"
slug: "rknn-v250-rv1106-host-runtime"
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

**RKNN auf RV1103/RV1106, Teil 3: Host-Umgebung und Mini Runtime**

[RKNN auf RV1103/RV1106, Teil 4: YOLOv5, Python und C-Bereitstellung](/de/articles/rknn-v250-rv1106-yolov5/)

[RKNN auf RV1103/RV1106, Teil 5: Docker, Startprobleme und Referenzen](/de/articles/rknn-v250-rv1106-docker-faq/)

{% raw %}

## 3. Host- und Board-Umgebung vorbereiten

Dieses Kapitel bereitet RKNN-Toolkit2, RKNPU2 und die Build-Werkzeuge für den ersten Lauf vor. Der Hauptablauf verwendet eine direkte Installation auf dem Computer. Für Docker siehe Kapitel 5.

### 3.1 RKNN-Toolkit2 installieren

#### 3.1.1 Python-Umgebung installieren

Falls das empfohlene Python 3.8 fehlt oder mehrere Python-Umgebungen vorhanden sind, empfiehlt sich eine unabhängige Python-3.8-Umgebung mit Miniforge.

Schritt 1: Miniforge installieren

Zunächst prüfen, ob Miniforge bereits installiert ist. Falls ja, diesen Schritt überspringen.

```text
conda -V
# Reference output: conda 23.3.1, indicating that the Miniforge conda version is 23.3.1
# If 'conda: command not found' is displayed, Miniforge is not installed
```

Falls Miniforge fehlt, das Installationsprogramm herunterladen:

```text
wget -c https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-x86_64.sh
```

Anschließend ausführen:

```text
chmod +x Miniforge3-Linux-x86_64.sh
bash Miniforge3-Linux-x86_64.sh
```

Schritt 2: Python-Umgebung erstellen

In die Miniforge-Basisumgebung wechseln:

```text
source ~/miniforge3/bin/activate
# Upon successful activation, the command prompt changes to:
# (base) xxx@xxx:~$
```

Eine Python-3.8-Umgebung namens toolkit2 erstellen:

```text
conda create -n toolkit2 python=3.8
```

Die Umgebung toolkit2 aktivieren:

```text
conda activate toolkit2
# Upon successful activation, the command prompt changes to:
# (toolkit2) xxx@xxx:~$
```

Hinweis: Alle folgenden Python-Befehle werden in der Umgebung toolkit2 ausgeführt.

#### 3.1.2 RKNN-Toolkit2 installieren

Nach Aktivierung von toolkit2 lässt sich RKNN-Toolkit2 aus der pip-Paketquelle oder einem lokalen Wheel-Paket installieren.

Methode 1: Installation aus der pip-Paketquelle

```text
pip install rknn-toolkit2 -i https://pypi.org/simple

# If RKNN-Toolkit2 is already installed, upgrade it using:
pip install rknn-toolkit2 -i https://pypi.org/simple --upgrade
```

Methode 2: Installation aus einem lokalen Wheel-Paket

```text
# Switch to the rknn-toolkit2 directory
cd Projects/rknn-toolkit2/rknn-toolkit2

# Select the requirements file according to the Python version and processor architecture
# cpxx is the Python version number
pip install -r packages/x86_64/requirements_cpxx.txt
# pip install -r packages/arm64/arm64_requirements_cpxx.txt

# Install RKNN-Toolkit2
# x.x.x is the RKNN-Toolkit2 version number, and cpxx is the Python version number
pip install packages/x86_64/rknn_toolkit2-x.x.x-cpxx-cpxx-manylinux_2_17_x86_64.manylinux2014_x86_64.whl
# pip install packages/arm64/rknn_toolkit2-x.x.x-cpxx-cpxx-manylinux_2_17_aarch64.manylinux2014_aarch64.whl
```

### 3.2 Toolkit-Installation prüfen

Die Umgebung toolkit2 aktiviert lassen und Python interaktiv starten:

```text
python
```

Anschließend die Klasse RKNN importieren:

```text
from rknn.api import RKNN
```

Wenn der Import ohne Fehler erfolgt, ist die grundlegende Installationsprüfung von RKNN-Toolkit2 bestanden.

Bei Installationsfehlern siehe die Abschnitte zur RKNN-Toolkit2-Installation und Fehlerbehebung in RKNN2_SDK_Development_Guide.

### 3.3 Boardseitige RKNPU2-Umgebung installieren oder prüfen

Im Folgenden wird das Evaluierungsboard kurz als Board bezeichnet.

Für das Board-Debugging mit RKNN-Toolkit2 müssen die RKNPU2-Umgebung auf dem Board installiert und rknn_server gestartet sein.

| Komponente | Beschreibung |
| --- | --- |
| RKNN Server (rknn_server) | Hintergrund-Proxy-Dienst auf dem Board. Verarbeitet Daten des Computers über USB und ruft die Mini Runtime auf dem Board zur Inferenz auf |
| RKNPU2 Mini Runtime (librknnmrt.so) | Lädt RKNN-Modelle im System und ruft die NPU zur Inferenz auf |

#### 3.3.1 RKNPU2-Treiberversion prüfen

Auf dem Board mit folgendem Befehl die RKNPU2-Treiberversion abfragen:

```text
dmesg | grep -i rknpu
```

Die folgende Abbildung zeigt die RKNPU2-Treiberversion 0.8.5 im Quellbeispiel:

![Abbildung der englischen Quelle · PDF 16](/assets/images/rknn-v250/rv1106/en/p016-figure-01.png)

*Abbildung der englischen Quelle · PDF 16*

Abbildung 3-1. RKNPU2-Treiberversion

Offizielle Rockchip-Board-Firmware enthält den RKNPU2-Treiber. Liefert der Befehl keine NPU-Treiberversion, wird möglicherweise Fremdfirmware ohne NPU-Treiber verwendet. Bei vorhandenem Firmwarequellcode CONFIG_ROCKCHIP_RKNPU in der Kernelkonfiguration auf y setzen, den Kerneltreiber neu bauen und flashen.

Empfehlung der Quelle: RKNPU2-Treiberversion >= 0.9.2.

#### 3.3.2 RKNPU2 Mini Runtime und Server prüfen

Falls RKNN Server oder Mini Runtime auf dem Board fehlen oder ihre Versionen nicht übereinstimmen, die RKNPU2-Umgebung erneut installieren.

Hinweise:

1. Für RKNN-Modelle mit dynamischen Eingabedimensionen müssen RKNN Server und Mini Runtime mindestens Version 1.5.0 haben.

2. Die Versionen von rknn_server, Mini Runtime und RKNN-Toolkit2 sollen übereinstimmen. Die Quelle empfiehlt Komponenten aus derselben neuesten Veröffentlichung.

Schritt 1: Start von rknn_server prüfen

```text
# Switch to the board
adb shell

# Start rknn_server
restart_rknn.sh
```

Eine ähnliche Ausgabe wie unten zeigt den erfolgreichen Start von rknn_server:

```text
start rknn server, version: x.x.x
```

Schritt 2: Server- und Mini-Runtime-Versionen prüfen

```text
# Query the rknn_server version
strings /oem/usr/bin/rknn_server | grep -i "rknn_server version"

# Query the librknnmrt.so version
strings /oem/usr/lib/librknnmrt.so | grep -i "librknnmrt version"
```

Referenzausgabe:

```text
rknn_server version: x.x.x
librknnmrt version: x.x.x
```

#### 3.3.3 RKNPU2-Umgebung installieren oder aktualisieren

Ist bereits eine RKNPU2-Umgebung mit passenden Versionen installiert, diesen Abschnitt überspringen.

In rknpu2 wechseln, die passenden rknn_server und librknnmrt.so per ADB auf das Board übertragen und rknn_server starten:

```text
# Switch to the rknpu2 directory
cd Projects/rknn-toolkit2/rknpu2

# Push rknn_server to the board
adb push runtime/Linux/rknn_server/armhf-uclibc/usr/bin/* /oem/usr/bin

# Push librknnmrt.so
adb push runtime/Linux/librknn_api/armhf-uclibc/librknnmrt.so /oem/usr/lib

# Switch to the board
adb shell

# Grant executable permissions
chmod +x /oem/usr/bin/rknn_server
chmod +x /oem/usr/bin/start_rknn.sh
chmod +x /oem/usr/bin/restart_rknn.sh

# Restart the rknn_server service
restart_rknn.sh
```

### 3.4 Build-Werkzeuge installieren

#### 3.4.1 CMake installieren

Folgende Befehle im Terminal des Computers ausführen:

```text
# Update package list
sudo apt update

# Install cmake
sudo apt install cmake
```

#### 3.4.2 Compiler installieren

##### 3.4.2.1 Systemarchitektur des Boards feststellen

Auf dem Computer ausführen:

```text
adb shell uname -a
```

Die Referenzausgabe folgt unten. armv7l bezeichnet ARMv7 und gehört zur armhf-Architektur. Diese Architektur wird später für den Build von RKNN C Demo benötigt.

```text
Linux Rockchip 5.10.160 #1 Tue Oct 24 18:52:11 CST 2023 armv7l GNU/Linux
```

##### 3.4.2.2 GCC-Cross-Compiler installieren

GCC-Download: https://console.zbox.filez.com/l/c1cKaR (Zugangscode: rknn).

Das heruntergeladene Paket entpacken. Empfohlen wird das Verzeichnis Projects:

```text
Projects
├── rknn-toolkit2
├── rknn_model_zoo
└── arm-rockchip831-linux-uclibcgnueabihf
```

Die folgenden Beispiele verwenden diesen GCC-Compilerpfad:

```text
Projects/arm-rockchip831-linux-uclibcgnueabihf/bin/arm-rockchip831-linux-uclibcgnueabihf
```

### 3.5 Laufzeitumgebung vorab prüfen

Vor der Modellkonvertierung werden folgende Prüfungen empfohlen:

| Prüfpunkt | Befehl oder Ort | Erwartetes Ergebnis |
| --- | --- | --- |
| Toolkit | Python gemäß Abschnitt 3.2 öffnen und from rknn.api import RKNN ausführen | Kein Fehler |
| Model Zoo | Projects/rknn_model_zoo/examples/yolov5 | Beispielverzeichnis vorhanden |
| ADB | adb devices | Board-Status ist device |
| RKNPU2-Treiber | adb shell "dmesg &#124; grep -i rknpu" | RKNPU2-Treiberinformationen lassen sich abfragen |
| RKNN Server | adb shell restart_rknn.sh | rknn_server startet normal |
| Mini-Runtime-Version | Versionen von rknn_server und librknnmrt.so abfragen | Versionen stimmen überein |
| CMake | cmake --version | Version wird korrekt angezeigt |
| GCC | Projects/arm-rockchip831-linux-uclibcgnueabihf prüfen | Cross-Compiler-Verzeichnis vorhanden |

Nach erfolgreichen Prüfungen mit dem ersten Modell fortfahren.

{% endraw %}
