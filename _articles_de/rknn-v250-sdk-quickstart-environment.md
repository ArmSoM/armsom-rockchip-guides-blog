---
title: "RKNN2 V2.5.0, Teil 3: Toolkit, Android/Linux-Runtime und Compiler"
description: "RKNN2 V2.5.0, Teil 3: Toolkit, Android/Linux-Runtime und Compiler · RKNN2 V2.5.0"
excerpt: "RKNN2 V2.5.0, Teil 3: Toolkit, Android/Linux-Runtime und Compiler"
translation_key: "rknn-v250-sdk-quickstart-environment"
slug: "rknn-v250-sdk-quickstart-environment"
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

**RKNN2 V2.5.0, Teil 3: Toolkit, Android/Linux-Runtime und Compiler**

[RKNN2 V2.5.0, Teil 4: MobileNet konvertieren und bereitstellen](/de/articles/rknn-v250-sdk-quickstart-mobilenet/)

[RKNN2 V2.5.0, Teil 5: YOLOv5-Erkennung und Genauigkeitsbewertung](/de/articles/rknn-v250-sdk-quickstart-yolov5/)

[RKNN2 V2.5.0, Teil 6: Docker, Startprobleme und Referenzen](/de/articles/rknn-v250-sdk-quickstart-docker-faq/)

{% raw %}

## 3. Host- und Board-Umgebung vorbereiten

### 3.1 RKNN-Toolkit2 installieren

Hier wird nur der empfohlene Installationsweg Conda + pip behandelt. Die Docker-Installation steht in Kapitel 5.

#### 3.1.1 Python-Umgebung installieren

Wenn Python 3.8 (empfohlene Version) fehlt oder mehrere Python-Versionen installiert sind, mit Miniforge Conda eine neue Python-3.8-Umgebung erstellen.

Schritt 1: Miniforge Conda installieren

Mit folgendem Befehl im Computerterminal prüfen, ob Miniforge Conda installiert ist. Bei vorhandener Installation kann dieser Schritt entfallen.

```text
conda -V
# Reference output: conda 23.3.1, indicating that the Miniforge Conda version is 23.3.1
# If it shows 'conda: command not found', it means Miniforge Conda is not installed.
```

Falls Miniforge Conda fehlt, den Installer hier herunterladen: https://github.com/conda-forge/miniforge/releases/download/25.3.0-1/Miniforge3-25.3.0-1-Linux-x86_64.sh

Anschließend Miniforge Conda mit folgenden Befehlen installieren:

```text
# Copy to the user directory
cp /path/to/Miniforge3-25.3.0-1-Linux-x86_64.sh ~

# Grant executable permissions
chmod 777 Miniforge3-25.3.0-1-Linux-x86_64.sh

# Run the installation script
bash Miniforge3-25.3.0-1-Linux-x86_64.sh
```

Schritt 2: Python-Umgebung erstellen

Nach der Installation im Computerterminal mit folgendem Befehl zur Conda-Basisumgebung wechseln:

```text
source ~/miniforge3/bin/activate # The installation directory of Miniforge
# Upon success, the command prompt will change to the following form:
# (base) xxx@xxx:~$
```

Eine Python-3.8-Umgebung namens toolkit2 erstellen:

```text
conda create -n toolkit2 python=3.8
```

toolkit2 aktivieren. RKNN-Toolkit2 wird in dieser Umgebung installiert:

```text
conda activate toolkit2
# Upon success, the command prompt will change to the following form:
# (toolkit2) xxx@xxx:~$
```

Hinweis: Die folgenden Python-Befehle werden standardmäßig in der Umgebung toolkit2 ausgeführt.

#### 3.1.2 RKNN-Toolkit2 installieren

Nach Aktivierung von toolkit2 RKNN-Toolkit2 über die pip-Paketquelle oder ein lokales Wheel-Paket installieren.

Methode 1: Installation über die pip-Paketquelle

```text
pip install rknn-toolkit2 -i https://pypi.org/simple

# If RKNN-Toolkit2 is already installed, you can upgrade it with the following command
pip install rknn-toolkit2 -i https://pypi.org/simple --upgrade
```

Methode 2: Installation eines lokalen Wheel-Pakets

```text
# Switch to the rknn-toolkit2 directory
cd Projects/rknn-toolkit2/rknn-toolkit2

# Please choose the appropriate requirements file based on the Python version and processor architecture:
# where cpxx is the Python version
pip install -r packages/x86_64/requirements_cpxx.txt
# pip install -r packages/arm64/arm64_requirements_cpxx.txt

# Install RKNN-Toolkit2
# Please choose the appropriate wheel package file based on the Python version and processor architecture:
# where x.x.x is the RKNN-Toolkit2 version number, cpxx is the Python version
pip install packages/x86_64/rknn_toolkit2-x.x.x-cpxx-cpxx-manylinux_2_17_x86_64.manylinux2014_x86_64.whl
# pip install packages/arm64/rknn_toolkit2-x.x.x-cpxx-cpxx-manylinux_2_17_aarch64.manylinux2014_aarch64.whl
```

### 3.2 Toolkit-Installation prüfen

Bei weiterhin aktivierter toolkit2-Umgebung ausführen:

```text
python -c "from rknn.api import RKNN; print('RKNN-Toolkit2 import OK')"
```

Wenn folgende Ausgabe erscheint:

```text
RKNN-Toolkit2 import OK
```

ist die grundlegende Toolkit-Importprüfung bestanden.

Bei Installationsfehlern Abschnitt 5.4.2 „RKNN-Toolkit2 Installation Issue“ im RKNN2 SDK Development Guide lesen; dort stehen ausführliche Lösungen für Fehler bei der Umgebungseinrichtung.

### 3.3 RKNPU2-Umgebung auf dem Board installieren oder prüfen

Vor dem Demo-Lauf prüfen, ob NPU-Treiber, rknn_server-Dienst und Runtime-Bibliothek korrekt installiert sind.

#### 3.3.1 NPU-Treiberversion feststellen

Die Version des RKNPU2-Treibers kann mit folgendem Befehl auf dem Board abgefragt werden:

```text
dmesg | grep -i rknpu
```

Die folgende Abbildung zeigt das Quellbeispiel mit RKNPU2-Treiberversion 0.8.8.

![Abbildung der englischen Quelle · PDF 16](/assets/images/rknn-v250/sdkquick/en/p016-figure-01.png)

*Abbildung der englischen Quelle · PDF 16*

Abbildung 3-1. RKNPU2-Treiberversion

Offizielle Rockchip-Board-Firmwares enthalten den RKNPU2-Treiber. Liefert der Befehl keine NPU-Treiberversion, wird möglicherweise eine Drittanbieter-Firmware ohne Treiber verwendet. Bei vorhandenem Firmware-Quellcode CONFIG_ROCKCHIP_RKNPU in der Kernel-Konfiguration auf 'y' setzen, anschließend den Kerneltreiber neu kompilieren und flashen. Empfohlen wird RKNPU2-Treiberversion >= 0.9.8.

#### 3.3.2 rknn_server und Runtime-Bibliothek prüfen

Das Debugging mit angeschlossenem Board in RKNN-Toolkit2 benötigt eine installierte RKNPU2-Umgebung und einen laufenden rknn_server-Dienst. Fehlen rknn_server oder Runtime, oder passen ihre Versionen nicht zusammen, die RKNPU2-Umgebung neu installieren.

Meist ist auf dem Board bereits eine RKNPU2-Umgebung mit zusammenpassenden Versionen vorhanden. Mit den folgenden Befehlen prüfen. Fehlt sie oder unterscheiden sich die Versionen, gemäß Abschnitt 3.3.3 installieren/aktualisieren.

1. Board mit Android-System

RKNPU2-Installation prüfen: Lässt sich der rknn_server-Dienst starten, ist die RKNPU2-Umgebung auf dem Board installiert.

```text
# Switch to the board
adb shell

# Start rknn_server
su
setenforce 0
/vendor/bin/rknn_server &
```

Die folgende Ausgabe zeigt den erfolgreichen Start von rknn_server und damit die installierte RKNPU2-Umgebung an.

```text
start rknn server, version: x.x.x
```

Übereinstimmung der Versionen prüfen:

```text
# Query rknn_server version
strings /vendor/bin/rknn_server | grep -i "rknn_server version"

# Query librknnrt.so library version
# For 64-bit systems
strings /vendor/lib64/librknnrt.so | grep -i "librknnrt version"
# For 32-bit systems
strings /vendor/lib/librknnrt.so | grep -i "librknnrt version"
```

In der folgenden Ausgabe ist die Version von rknn_server x.x.x und die von librknnrt.so ebenfalls x.x.x.

```text
rknn_server version: x.x.x
librknnrt version: x.x.x
```

2. Board mit Linux-System

RKNPU2-Installation prüfen: Lässt sich der rknn_server-Dienst starten, ist die RKNPU2-Umgebung auf dem Board installiert.

```text
# Switch to the board
adb shell

# Start rknn_server
restart_rknn.sh
```

Die folgende Ausgabe zeigt den erfolgreichen Start von rknn_server und damit die installierte RKNPU2-Umgebung an.

```text
start rknn server, version: x.x.x
```

Übereinstimmung der Versionen prüfen:

```text
# Query rknn_server version
strings /usr/bin/rknn_server | grep -i "rknn_server version"

# Query librknnrt.so library version
strings /usr/lib/librknnrt.so | grep -i "librknnrt version"
```

In der folgenden Ausgabe ist die Version von rknn_server x.x.x und die von librknnrt.so ebenfalls x.x.x.

```text
rknn_server version: x.x.x
librknnrt version: x.x.x
```

#### 3.3.3 RKNPU2-Umgebung installieren/aktualisieren

Unterschiedliche Board-Systeme benötigen unterschiedliche RKNPU2-Umgebungen. Nachfolgend werden die Installationsmethoden je System erläutert.

Hinweis: Ist bereits eine RKNPU2-Umgebung mit abgestimmten Versionen installiert, kann dieser Abschnitt entfallen.

1. Board mit Android-System

In das Verzeichnis rknpu2 wechseln, mit adb die passenden Dateien rknn_server und librknnrt.so auf das Board übertragen und anschließend rknn_server starten. Beispielbefehle:

```text
# Switch to the rknpu2 directory
cd Projects/rknn-toolkit2/rknpu2

# Switch to root user permissions
adb root

# Remount the file system as read-write
adb remount

# Push the rknn_server executable
# Note: In a 64-bit Android system, BOARD_ARCH corresponds to the arm64 directory; in 32-bit systems, it corresponds to the arm directory.
adb push runtime/Android/rknn_server/${BOARD_ARCH}/rknn_server /vendor/bin/

# Push the librknnrt.so library
# For 64-bit systems
adb push runtime/Android/librknn_api/arm64-v8a/librknnrt.so /vendor/lib64/
# For 32-bit systems
adb push runtime/Android/librknn_api/armeabi-v7a/librknnrt.so /vendor/lib/

# Switch to the board
adb shell

# Grant executable permissions
chmod +x /vendor/bin/rknn_server

# Restart the rknn_server service
su
setenforce 0
/vendor/bin/rknn_server &
```

2. Board mit Linux-System

In das Verzeichnis rknpu2 wechseln, mit adb die passenden Dateien rknn_server und librknnrt.so auf das Board übertragen und anschließend rknn_server starten. Beispielbefehle:

```text
# Switch to the rknpu2 directory
cd Projects/rknn-toolkit2/rknpu2

# Push rknn_server to the board
# Note: In 64-bit Linux systems, BOARD_ARCH corresponds to the aarch64 directory; in 32-bit systems, it corresponds to the armhf directory.
adb push runtime/Linux/rknn_server/${BOARD_ARCH}/usr/bin/* /usr/bin

# Push librknnrt.so
adb push runtime/Linux/librknn_api/${BOARD_ARCH}/librknnrt.so /usr/lib

# Switch to the board
adb shell

# Grant executable permissions
chmod +x /usr/bin/rknn_server
chmod +x /usr/bin/start_rknn.sh
chmod +x /usr/bin/restart_rknn.sh

# Restart the rknn_server service
restart_rknn.sh
```

### 3.4 Build-Werkzeuge installieren

#### 3.4.1 CMake installieren

Im Computerterminal folgenden Befehl ausführen:

```text
# Update package list
sudo apt update

# Install cmake
sudo apt install cmake
```

#### 3.4.2 Compiler installieren

##### 3.4.2.1 Systemtyp und Architektur des Boards feststellen

Im Folgenden bezeichnet „Board“ der Einfachheit halber die Entwicklungsboard-Seite.

Schritt 1: Systemtyp des Boards feststellen

Im Computerterminal folgenden Befehl ausführen:

```text
adb shell getprop ro.build.version.release
```

Ist die Ausgabe eine Zahl (Android-Systemversion), läuft auf dem Board Android.

```text
12
```

Andernfalls läuft auf dem Board Linux.

```text
/bin/sh: getprop: not_found
```

Schritt 2: Systemarchitektur des Boards feststellen

Für ein Board mit Android die Systemarchitektur mit folgendem Befehl am Computer abfragen:

```text
adb shell getprop ro.product.cpu.abi
```

Beispielausgabe des Befehls: arm64-v8a bezeichnet die ARM-64-Bit-Architektur mit ABI-Version 8.

```text
arm64-v8a
```

Für ein Board mit Linux die Systemarchitektur mit folgendem Befehl am Computer abfragen:

```text
adb shell uname -a
```

Beispielausgabe des Befehls: aarch64 bezeichnet die ARM-64-Bit-Architektur.

```text
Linux Rockchip 5.10.160 #183 SMP Tue Oct 24 18:52:11 CST 2023 aarch64 GNU/Linux
```

##### 3.4.2.2 NDK für das Android-Board installieren

Geltungsbereich: Boards mit Android. Bei einem Linux-Board diesen Abschnitt überspringen.

NDK-Download (r19c wird empfohlen): https://dl.google.com/android/repository/android-ndk-r19c-linux-x86_64.zip

Softwarepaket entpacken

Das NDK-Paket vorzugsweise nach Projects entpacken. Speicherort:

```text
Projects
├── rknn-toolkit2
├── rknn_model_zoo
└── android-ndk-r19c # This path will be used when compiling the RKNN C Demo
```

Damit lautet der Pfad zum NDK-Compiler Projects/android-ndk-r19c.

##### 3.4.2.3 GCC-Cross-Compiler für das Linux-Board installieren

Geltungsbereich: Boards mit Linux. Bei einem Android-Board diesen Abschnitt überspringen.

GCC-Downloadadresse

64-Bit-Board-System: https://developer.arm.com/-/cdn-downloads/permalink/legacy-linaro-gnu-toolchains/6.3-2017.05/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu.tar.xz

32-Bit-Board-System: https://developer.arm.com/-/cdn-downloads/permalink/legacy-linaro-gnu-toolchains/6.3-2017.05/gcc-linaro-6.3.1-2017.05-x86_64_arm-linux-gnueabihf.tar.xz

Softwarepaket entpacken

Das GCC-Paket vorzugsweise nach Projects entpacken. Beispiel für das Paket eines 64-Bit-Systems:

```text
Projects
├── rknn-toolkit2
├── rknn_model_zoo
└── gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu # This path will be used when compiling the RKNN C Demo
```

Damit lautet der Pfad zum GCC-Compiler Projects/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu.

### 3.5 Umgebung vorab prüfen

Vor der Modellkonvertierung möglichst alle folgenden Prüfungen durchführen:

```text
# Toolkit
conda activate toolkit2
python -c "from rknn.api import RKNN; print('Toolkit OK')"

# Compilation tools
cmake --version

# Devices
adb devices
```

Für die RKNN C Demo zusätzlich den Compilerpfad passend zum Board-System prüfen:

Android-Board: NDK-Pfad prüfen, etwa Projects/android-ndk-r19c;

Linux-Board: GCC-Compilerpfad prüfen, etwa Projects/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu.

{% endraw %}
