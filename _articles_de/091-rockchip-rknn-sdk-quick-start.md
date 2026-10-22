---
title: "Rockchip RKNN SDK: Schnellstart für Modellkonvertierung, Board und Docker"
description: "Vollständige V2.3.2-Anleitung zu Board-Anschluss, Miniforge, Toolkit2, RKNPU2, YOLOv5 in Python/C, Genauigkeitsbewertung und Docker."
translation_key: "091-rockchip-rknn-sdk-quick-start"
slug: "091-rockchip-rknn-sdk-quick-start"
lang: "de"
date: "2026-10-22"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
tags: ["Rockchip", "RKNN", "RK3588", "RK3576", "Toolkit2", "NPU"]
keywords: "ArmSoM Rockchip RKNN SDK Toolkit2 RKNPU2 YOLOv5"
excerpt: "Vollständige V2.3.2-Anleitung zu Board-Anschluss, Miniforge, Toolkit2, RKNPU2, YOLOv5 in Python/C, Genauigkeitsbewertung und Docker."
---

{% raw %}

# Rockchip RKNN SDK: Schnellstart für Modellkonvertierung, Board und Docker

## Anwendbarkeit auf ArmSoM und Quelle

Dies ist eine Rockchip-Plattformreferenz, kein ArmSoM-Testbericht. Quellen: RK-JC-YF-416, RKNN SDK V2.3.2, 27 chinesische und 29 englische Seiten. Chinesisch folgt dem chinesischen, Englisch dem englischen Original; Russisch und Deutsch übersetzen Englisch vollständig. Chinesisch verwendet alle 16 chinesischen Abbildungen, die anderen Sprachen die 16 englischen Originale. Gezeigte Rockchip-Referenzboards, Anschlüsse und Netzteile sind keine ArmSoM-Spezifikation: 12V-2A/12V-3A nicht ungeprüft auf ArmSoM-Hardware übertragen. Die Quelle nennt RK3562, RK3566/3568/3576/3588-Serien und RV1126B, aber keine SDK/BSP-, Firmware- oder Kernelkombination eines konkreten ArmSoM-Boards. Stromversorgung, OTG/adb, NPU-Treiber und Toolkit2/Server/Runtime-Kompatibilität prüfen. Linux 5.10.160, Treiber 0.8.8, Erkennungen und Protokolle sind Quellbeispiele. Installations-/Debugbefehle sowie Hardware-/Leistungstests wurden nicht ausgeführt. V2.3.2 bezeichnet den Quellstand, nicht die aktuell neueste Version.

> Sicherheits- und Redaktionshinweis: Die Quelle enthält root, adb remount, setenforce 0, docker-Gruppenmitgliedschaft und --privileged. Dies beeinflusst Sicherheitsgrenzen von Gerät und Host; es sind beibehaltene Quellbeispiele, keine für Produktion validierten Anweisungen. Versions-, Pfad- und Nummerierungsunterschiede sowie Fehlermeldungen im Protokollbild sind in den redaktionellen Hinweisen erfasst. Riskante Optionen wurden nicht stillschweigend geändert.

[EDITORIAL-NOTES](/docs/rockchip-rknn-sdk-quick-start/EDITORIAL-NOTES.md) · [ArmSoM Docs](https://docs.armsom.org/)


<!-- source: EN PDF p3; unit 0 -->

## 1 Einführung

<!-- source: EN PDF p3; unit 1 -->

Diese Anleitung erläutert Einsteigern ausführlich, wie Modelle am Computer mit RKNN-Toolkit2 konvertiert und über RKNPU2 auf einem Rockchip-Entwicklungsboard bereitgestellt werden. Die Beispiele sind im RKNN Model Zoo enthalten.

<!-- source: EN PDF p3; unit 2 -->

Laut Quelle unterstützte Plattformen: RK3562, RK3566-, RK3568-, RK3576- und RK3588-Serie sowie RV1126B.

<!-- source: EN PDF p3; unit 3 -->

## 2 Entwicklungsboard vorbereiten

<!-- source: EN PDF p3; unit 4 -->

Dieses Kapitel behandelt den Anschluss des Entwicklungsboards an den Computer in zwei Teilen:

<!-- source: EN PDF p3; unit 5 -->

Entwicklungsboard und Anschlussmittel kennenlernen

<!-- source: EN PDF p3; unit 6 -->

Entwicklungsboard an den Computer anschließen

<!-- source: EN PDF p3; unit 7 -->

### 2.1 Entwicklungsboard und Anschlussmittel

<!-- source: EN PDF p3; unit 8 -->

1\. Entwicklungsboard

<!-- source: EN PDF p4; unit 9 -->

![Technikabbildung aus dem englischen Original, Seite 4](/docs/rockchip-rknn-sdk-quick-start/assets/en-p004-figure-01.png)

<!-- source: EN PDF p4; unit 10 -->

Abbildung 2-1: RK3562-Entwicklungsboard

<!-- source: EN PDF p4; unit 11 -->

![Technikabbildung aus dem englischen Original, Seite 4](/docs/rockchip-rknn-sdk-quick-start/assets/en-p004-figure-02.png)

<!-- source: EN PDF p4; unit 12 -->

Abbildung 2-2: RK3566-Entwicklungsboard

<!-- source: EN PDF p5; unit 13 -->

![Technikabbildung aus dem englischen Original, Seite 5](/docs/rockchip-rknn-sdk-quick-start/assets/en-p005-figure-01.png)

<!-- source: EN PDF p5; unit 14 -->

Abbildung 2-3: RK3568-Entwicklungsboard

<!-- source: EN PDF p5; unit 15 -->

![Technikabbildung aus dem englischen Original, Seite 5](/docs/rockchip-rknn-sdk-quick-start/assets/en-p005-figure-02.png)

<!-- source: EN PDF p5; unit 16 -->

Abbildung 2-4: RK3588-Entwicklungsboard

<!-- source: EN PDF p6; unit 17 -->

![Technikabbildung aus dem englischen Original, Seite 6](/docs/rockchip-rknn-sdk-quick-start/assets/en-p006-figure-01.png)

<!-- source: EN PDF p6; unit 18 -->

Abbildung 2-5: RK3576-Entwicklungsboard

<!-- source: EN PDF p6; unit 19 -->

![Technikabbildung aus dem englischen Original, Seite 6](/docs/rockchip-rknn-sdk-quick-start/assets/en-p006-figure-02.png)

<!-- source: EN PDF p6; unit 20 -->

Abbildung 2-6: RV1126B-Entwicklungsboard

<!-- source: EN PDF p7; unit 21 -->

![Technikabbildung aus dem englischen Original, Seite 7](/docs/rockchip-rknn-sdk-quick-start/assets/en-p007-figure-01.png)

<!-- source: EN PDF p7; unit 22 -->

Abbildung 2-7: RV1126B-Entwicklungsboard, Seitenansicht

<!-- source: EN PDF p7; unit 23 -->

2\. Datenkabel zwischen Entwicklungsboard und Computer

<!-- source: EN PDF p7; unit 24 -->

![Technikabbildung aus dem englischen Original, Seite 7](/docs/rockchip-rknn-sdk-quick-start/assets/en-p007-figure-02.png)

<!-- source: EN PDF p7; unit 25 -->

Abbildung 2-8: USB-A-Datenkabel für das RK3562/RK3568-Entwicklungsboard

<!-- source: EN PDF p7; unit 26 -->

![Technikabbildung aus dem englischen Original, Seite 7](/docs/rockchip-rknn-sdk-quick-start/assets/en-p007-figure-03.png)

<!-- source: EN PDF p7; unit 27 -->

Abbildung 2-9: Micro USB-Datenkabel für das RK3566-Entwicklungsboard

<!-- source: EN PDF p8; unit 28 -->

![Technikabbildung aus dem englischen Original, Seite 8](/docs/rockchip-rknn-sdk-quick-start/assets/en-p008-figure-01.png)

<!-- source: EN PDF p8; unit 29 -->

Abbildung 2-10: USB-C-Datenkabel für das RK3576/RK3588-Entwicklungsboard

<!-- source: EN PDF p8; unit 30 -->

3\. Netzteil

<!-- source: EN PDF p8; unit 31 -->

![Technikabbildung aus dem englischen Original, Seite 8](/docs/rockchip-rknn-sdk-quick-start/assets/en-p008-figure-02.png)

<!-- source: EN PDF p8; unit 32 -->

Abbildung 2-11: Netzteil mit 12V-2A-Ausgang für das RK3562/RK3566/RK3568-Entwicklungsboard

<!-- source: EN PDF p8; unit 33 -->

![Technikabbildung aus dem englischen Original, Seite 8](/docs/rockchip-rknn-sdk-quick-start/assets/en-p008-figure-03.png)

<!-- source: EN PDF p8; unit 34 -->

Abbildung 2-12: Netzteil mit 12V-3A-Ausgang für das RK3576/RK3588-Entwicklungsboard

<!-- source: EN PDF p8; unit 35 -->

### 2.2 Entwicklungsboard an den Computer anschließen

<!-- source: EN PDF p8; unit 36 -->

Der Anschluss an den Computer wird am Beispiel von RK3568 erläutert:

<!-- source: EN PDF p8; unit 37 -->

1\. Einen Computer mit Ubuntu18.04 / Ubuntu20.04 / Ubuntu22.04 vorbereiten.

<!-- source: EN PDF p8; unit 38 -->

2\. Den Stromanschluss in der Abbildung finden und das Netzteil des Entwicklungsboards anschließen.

<!-- source: EN PDF p9; unit 39 -->

3\. Entwicklungsboard und Computer mit dem Datenkabel verbinden. Je nach Fertigungscharge können Anschlusstyp und Position abweichen. Üblicherweise kennzeichnet die Aufschrift OTG am Board den Datenanschluss.

<!-- source: EN PDF p9; unit 40 -->

4\. Den Netzschalter einschalten und warten, bis das System des Entwicklungsboards vollständig gestartet ist.

<!-- source: EN PDF p9; unit 41 -->

![Technikabbildung aus dem englischen Original, Seite 9](/docs/rockchip-rknn-sdk-quick-start/assets/en-p009-figure-01.png)

<!-- source: EN PDF p9; unit 42 -->

Abbildung 2-13: RK3568-Entwicklungsboard

<!-- source: EN PDF p9; unit 43 -->

1\. Prüfen, ob das Entwicklungsboard mit dem Computer verbunden ist. Die Schrittnummer 1 folgt dem englischen Original; im chinesischen Original steht hier Schritt 5.

<!-- source: EN PDF p9; unit 44 -->

Im Terminal des Computers (Befehlszeile) folgenden Befehl ausführen:

<!-- source: EN PDF p9; unit 45 -->

```text
# If adb has not been installed, please install it first using 'sudo apt install adb'
adb devices
```

<!-- source: EN PDF p9; unit 46 -->

Bei erfolgreicher Verbindung erscheint folgende Ausgabe; 13af7b28115662cd ist die Geräte-ID des RK3568. Wird kein Gerät angezeigt, Abschnitt 6.1 zur Fehlersuche heranziehen.

<!-- source: EN PDF p9; unit 47 -->

```text
$ adb devices
List of devices attached
13af7b28115662cd device
```

<!-- source: EN PDF p9; unit 48 -->

## 3 Entwicklungsumgebung vorbereiten

<!-- source: EN PDF p9; unit 49 -->

Dieses Kapitel beschreibt die direkte Installation der Entwicklungsumgebung auf dem Computer. Auch die anschließenden Beispiele gehen von dieser Installation aus. Für die Ausführung in Docker die Umgebung gemäß Kapitel 5 vorbereiten.

<!-- source: EN PDF p9; unit 50 -->

Das Kapitel besteht aus vier Teilen:

<!-- source: EN PDF p9; unit 51 -->

RKNN-Repositories herunterladen

<!-- source: EN PDF p9; unit 52 -->

RKNN-Toolkit2 auf dem Computer installieren

<!-- source: EN PDF p10; unit 53 -->

Kompilierwerkzeuge auf dem Computer installieren

<!-- source: EN PDF p10; unit 54 -->

RKNPU2-Umgebung auf dem Board installieren

<!-- source: EN PDF p10; unit 55 -->

### 3.1 RKNN-Repositories herunterladen

<!-- source: EN PDF p10; unit 56 -->

Für die RKNN-Repositories wird ein eigener Ordner empfohlen, beispielsweise Projects. Darin RKNN-Toolkit2 und RKNN Model Zoo ablegen. Beispielbefehle:

<!-- source: EN PDF p10; unit 57 -->

```text
# Create the 'Projects' folder
mkdir Projects

# Switch to this directory
cd Projects

# Download the RKNN-Toolkit2 repository
git clone https://github.com/airockchip/rknn-toolkit2.git --depth 1

# Download the RKNN Model Zoo repository
git clone https://github.com/airockchip/rknn_model_zoo.git --depth 1

# Notice:
# 1. Parameter --depth 1 means to clone only the latest commit
# 2. If the 'git clone' command fails, you can also download the compressed file directly from GitHub and unzip it locally in this directory.
```

<!-- source: EN PDF p10; unit 58 -->

Gesamte Verzeichnisstruktur:

<!-- source: EN PDF p10; unit 59 -->

```text
Projects
├── rknn-toolkit2
│ ├── doc
│ ├── rknn-toolkit2
│ │ ├── packages
│ │ ├── docker
│ │ └── ...
│ ├── rknpu2
│ │ ├── runtime
│ │ └── ...
│ └── ...
└── rknn_model_zoo
  ├── datasets
  ├── examples
  └── ...
```

<!-- source: EN PDF p10; unit 60 -->

### 3.2 RKNN-Toolkit2 auf dem Computer installieren

<!-- source: EN PDF p10; unit 61 -->

#### 3.2.1 Python installieren

<!-- source: EN PDF p10; unit 62 -->

Ist Python 3.8 nicht installiert oder bestehen mehrere Python-Umgebungen, wird eine neue Python-3.8-Umgebung mit Miniforge Conda empfohlen.

<!-- source: EN PDF p11; unit 63 -->

##### 3.2.1.1 Miniforge Conda installieren

<!-- source: EN PDF p11; unit 64 -->

Mit folgendem Befehl im Computerterminal prüfen, ob Miniforge Conda installiert ist. Bei vorhandener Installation kann dieser Schritt entfallen.

<!-- source: EN PDF p11; unit 65 -->

```text
conda -V
# Reference output: conda 23.9.0, indicating that Miniforge Conda version is 23.9.0
# If it shows 'conda: command not found', it means Miniforge Conda is not installed.
```

<!-- source: EN PDF p11; unit 66 -->

Ist Miniforge Conda nicht installiert, den Installer über folgenden Verweis herunterladen:

<!-- source: EN PDF p11; unit 67 -->

```text
wget -c https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-x86_64.sh
```

<!-- source: EN PDF p11; unit 68 -->

Anschließend Miniforge Conda mit folgenden Befehlen installieren:

<!-- source: EN PDF p11; unit 69 -->

```text
chmod 777 Miniforge3-Linux-x86_64.sh
bash Miniforge3-Linux-x86_64.sh
```

<!-- source: EN PDF p11; unit 70 -->

##### 3.2.1.2 Python-Umgebung mit Miniforge Conda erstellen

<!-- source: EN PDF p11; unit 71 -->

Im Computerterminal mit folgendem Befehl in die Basisumgebung von Miniforge conda wechseln:

<!-- source: EN PDF p11; unit 72 -->

```text
source ~/miniforge3/bin/activate
# Upon successful activation, the command prompt will change to the following form:
# (base) xxx@xxx:~$
```

<!-- source: EN PDF p11; unit 73 -->

Mit folgendem Befehl eine Python-3.8-Umgebung namens toolkit2 erstellen:

<!-- source: EN PDF p11; unit 74 -->

```text
conda create -n toolkit2 python=3.8
```

<!-- source: EN PDF p11; unit 75 -->

Die Umgebung toolkit2 aktivieren; die anschließende Installation von RKNN-Toolkit2 erfolgt in dieser Umgebung.

<!-- source: EN PDF p11; unit 76 -->

```text
conda activate toolkit2
# Upon successful activation, the command prompt will change to the following form:
# (toolkit2) xxx@xxx:~$
```

<!-- source: EN PDF p11; unit 77 -->

#### 3.2.2 RKNN-Toolkit2 installieren

<!-- source: EN PDF p11; unit 78 -->

Nach Aktivierung von toolkit2 lässt sich RKNN-Toolkit2 über die pip-Paketquelle oder ein lokales Wheel-Paket installieren:

<!-- source: EN PDF p11; unit 79 -->

Installation über die pip-Paketquelle

<!-- source: EN PDF p11; unit 80 -->

```text
pip install rknn-toolkit2 -i https://pypi.org/simple

# If RKNN-Toolkit2 is already installed, you can upgrade it with the following command:
pip install rknn-toolkit2 -i https://pypi.org/simple --upgrade
```

<!-- source: EN PDF p11; unit 81 -->

Installation über ein lokales Wheel-Paket

<!-- source: EN PDF p12; unit 82 -->

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

<!-- source: EN PDF p12; unit 83 -->

#### 3.2.3 Installation der RKNN-Toolkit2-Umgebung prüfen

<!-- source: EN PDF p12; unit 84 -->

Folgenden Befehl ausführen. Erscheinen keine Fehler, wurde die RKNN-Toolkit2-Umgebung erfolgreich installiert.

<!-- source: EN PDF p12; unit 85 -->

```text
# Switch to Python interactive mode
python

# Import the RKNN class
from rknn.api import RKNN
```

<!-- source: EN PDF p12; unit 86 -->

Bei Installationsfehlern Abschnitt 10.2 „RKNN-Toolkit2 Installation Issue“ in Rockchip_RKNPU_User_Guide_RKNN_SDK_EN.pdf heranziehen. Er enthält ausführliche Lösungen für Installationsprobleme der RKNN-Toolkit2-Umgebung.

<!-- source: EN PDF p12; unit 87 -->

### 3.3 Kompilierwerkzeuge auf dem Computer installieren

<!-- source: EN PDF p12; unit 88 -->

#### 3.3.1 CMake installieren

<!-- source: EN PDF p12; unit 89 -->

Im Computerterminal folgende Befehle ausführen:

<!-- source: EN PDF p12; unit 90 -->

```text
# Update package list
sudo apt update

# Install cmake
sudo apt install cmake
```

<!-- source: EN PDF p12; unit 91 -->

#### 3.3.2 Compiler installieren

<!-- source: EN PDF p12; unit 92 -->

##### 3.3.2.1 Systemtyp und Architektur des Entwicklungsboards bestimmen

<!-- source: EN PDF p12; unit 93 -->

Im Folgenden wird das Entwicklungsboard der Kürze halber als „Board“ bezeichnet.

<!-- source: EN PDF p12; unit 94 -->

1\. Den Systemtyp des Boards bestimmen.

<!-- source: EN PDF p12; unit 95 -->

Im Computerterminal folgenden Befehl ausführen:

<!-- source: EN PDF p12; unit 96 -->

```text
adb shell getprop ro.build.version.release
```

<!-- source: EN PDF p12; unit 97 -->

Ist die Ausgabe eine Zahl (Android-Systemversion), läuft auf dem Board Android.

<!-- source: EN PDF p13; unit 98 -->

```text
$ adb shell getprop ro.build.version.release
12
```

<!-- source: EN PDF p13; unit 99 -->

Andernfalls läuft auf dem Board Linux.

<!-- source: EN PDF p13; unit 100 -->

```text
$ adb shell getprop ro.build.version.release
/bin/sh: getprop: not_found
```

<!-- source: EN PDF p13; unit 101 -->

1\. Die Systemarchitektur des Boards bestimmen. Die wiederholte Nummer folgt dem Original.

<!-- source: EN PDF p13; unit 102 -->

Für ein Board mit Android die Systemarchitektur mit folgendem Befehl am Computer abfragen:

<!-- source: EN PDF p13; unit 103 -->

```text
adb shell getprop ro.product.cpu.abi
```

<!-- source: EN PDF p13; unit 104 -->

Die folgende Referenzausgabe zeigt arm64-v8a: 64-Bit-ARM-Architektur mit ABI-Version 8.

<!-- source: EN PDF p13; unit 105 -->

```text
$ adb shell getprop ro.product.cpu.abi
arm64-v8a
```

<!-- source: EN PDF p13; unit 106 -->

Für ein Board mit Linux die Systemarchitektur mit folgendem Befehl am Computer abfragen:

<!-- source: EN PDF p13; unit 107 -->

```text
adb shell uname -a
```

<!-- source: EN PDF p13; unit 108 -->

In der folgenden Referenzausgabe bezeichnet aarch64 die 64-Bit-ARM-Architektur.

<!-- source: EN PDF p13; unit 109 -->

```text
$ adb shell uname -a
Linux Rockchip 5.10.160 #183 SMP Tue Oct 24 18:52:11 CST 2023 aarch64 GNU/Linux
```

<!-- source: EN PDF p13; unit 110 -->

##### 3.3.2.2 NDK für ein Board mit Android installieren

<!-- source: EN PDF p13; unit 111 -->

Hinweis: Dieser Abschnitt gilt für Boards mit Android. Bei einem Board mit Linux diesen Abschnitt überspringen.

<!-- source: EN PDF p13; unit 112 -->

NDK-Downloadadresse (die Quelle empfiehlt r19c): [https://dl.google.com/android/repository/android-ndk-r19c-linux-x86_64.zip](https://dl.google.com/android/repository/android-ndk-r19c-linux-x86_64.zip)

<!-- source: EN PDF p13; unit 113 -->

Softwarepaket entpacken

<!-- source: EN PDF p13; unit 114 -->

Das NDK-Paket vorzugsweise im Ordner Projects entpacken. Die Position ist dann wie folgt:

<!-- source: EN PDF p13; unit 115 -->

```text
Projects
├── rknn-toolkit2
├── rknn_model_zoo
└── android-ndk-r19c # This path will be used when compiling RKNN C Demo
```

<!-- source: EN PDF p13; unit 116 -->

Damit lautet der Pfad zum NDK-Compiler Projects/android-ndk-r19c.

<!-- source: EN PDF p14; unit 117 -->

##### 3.3.2.3 GCC-Cross-Compiler für ein Board mit Linux installieren

<!-- source: EN PDF p14; unit 118 -->

Hinweis: Dieser Abschnitt gilt für Boards mit Linux. Bei einem Board mit Android diesen Abschnitt überspringen.

<!-- source: EN PDF p14; unit 119 -->

GCC-Downloadadresse

<!-- source: EN PDF p14; unit 120 -->

Für ein Board mit 64-Bit-System: [https://releases.linaro.org/components/toolchain/binaries/6.3-2017.05/aarch64-linux-gnu/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu.tar.xz](https://releases.linaro.org/components/toolchain/binaries/6.3-2017.05/aarch64-linux-gnu/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu.tar.xz)

<!-- source: EN PDF p14; unit 121 -->

Für ein Board mit 32-Bit-System: [https://releases.linaro.org/components/toolchain/binaries/6.3-2017.05/arm-linux-gnueabihf/gcc-linaro-6.3.1-2017.05-x86_64_arm-linux-gnueabihf.tar.xz](https://releases.linaro.org/components/toolchain/binaries/6.3-2017.05/arm-linux-gnueabihf/gcc-linaro-6.3.1-2017.05-x86_64_arm-linux-gnueabihf.tar.xz)

<!-- source: EN PDF p14; unit 122 -->

Softwarepaket entpacken

<!-- source: EN PDF p14; unit 123 -->

Das GCC-Paket vorzugsweise im Ordner Projects entpacken. Beispielposition des GCC-Pakets für ein 64-Bit-System:

<!-- source: EN PDF p14; unit 124 -->

```text
  Projects
  ├── rknn-toolkit2
  ├── rknn_model_zoo
  └── gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu # This path will be used when compiling the RKNN C Demo
```

<!-- source: EN PDF p14; unit 125 -->

Damit lautet der Pfad zum GCC-Compiler Projects/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu.

<!-- source: EN PDF p14; unit 126 -->

### 3.4 RKNPU2-Umgebung auf dem Board installieren

<!-- source: EN PDF p14; unit 127 -->

#### 3.4.1 RKNPU2-Treiberversion prüfen

<!-- source: EN PDF p14; unit 128 -->

Die Version des RKNPU2-Treibers kann mit folgendem Befehl auf dem Board abgefragt werden:

<!-- source: EN PDF p14; unit 129 -->

```text
dmesg | grep -i rknpu
```

<!-- source: EN PDF p14; unit 130 -->

Die folgende Abbildung zeigt das Quellbeispiel mit RKNPU2-Treiberversion 0.8.8.

<!-- source: EN PDF p14; unit 131 -->

![Technikabbildung aus dem englischen Original, Seite 14](/docs/rockchip-rknn-sdk-quick-start/assets/en-p014-figure-01.png)

Kopierbare Quellprotokoll-Transkription (einschließlich Quellfehlermeldungen; kein ArmSoM-Test):

```text
rk3588_s_evb7:/ $ dmesg | grep -i rknpu
[    2.919448] [    T1] RKNPU fdab0000.npu: Adding to iommu group 0
[    2.919608] [    T1] RKNPU fdab0000.npu: RKNPU: rknpu iommu is enabled, using iommu mode
[    2.920935] [    T1] RKNPU fdab0000.npu: can't request region for resource [mem 0xfdab0000-0xfdabffff]
[    2.920959] [    T1] RKNPU fdab0000.npu: can't request region for resource [mem 0xfdac0000-0xfdacffff]
[    2.920973] [    T1] RKNPU fdab0000.npu: can't request region for resource [mem 0xfdad0000-0xfdadffff]
[    2.921339] [    T1] [drm] Initialized rknpu 0.8.8 20230428 for fdab0000.npu on minor 1
[    2.924082] [    T1] RKNPU fdab0000.npu: RKNPU: bin=0
[    2.924994] [    T1] RKNPU fdab0000.npu: leakage=10
[    2.925052] [    T1] debugfs: Directory 'fdab0000.npu-rknpu' with parent 'vdd_npu_s0' already present!
[    2.931816] [    T1] RKNPU fdab0000.npu: pvtm=866
[    2.936313] [    T1] RKNPU fdab0000.npu: pvtm-volt-sel=3
[    2.937408] [    T1] RKNPU fdab0000.npu: avs=0
[    2.937608] [    T1] RKNPU fdab0000.npu: l=10000 h=85000 hyst=5000 l_limit=0 h_limit=800000000 h_table=0
[    2.948777] [    T1] RKNPU fdab0000.npu: failed to find power_model node
[    2.948814] [    T1] RKNPU fdab0000.npu: RKNPU: failed to initialize power model
[    2.948826] [    T1] RKNPU fdab0000.npu: RKNPU: failed to get dynamic-coefficient
```

<!-- source: EN PDF p14; unit 132 -->

Abbildung 3-1: Versionsinformationen des RKNPU2-Treibers

<!-- source: EN PDF p14; unit 133 -->

Laut Quelle ist der RKNPU2-Treiber in offiziellen Rockchip-Board-Firmwares enthalten. Kann der obige Befehl keine NPU-Treiberversion abfragen, wird möglicherweise Drittanbieter-Firmware ohne diesen Treiber verwendet. Bei vorhandenen Firmwarequellen CONFIG_ROCKCHIP_RKNPU in der Kernelkonfiguration auf y setzen, anschließend den Kerneltreiber neu kompilieren und flashen. Empfohlen wird RKNPU2-Treiberversion >= 0.9.2.

<!-- source: EN PDF p15; unit 135 -->

#### 3.4.2 Installation der RKNPU2-Umgebung prüfen

<!-- source: EN PDF p15; unit 136 -->

Für die Board-gebundene Debugfunktion von RKNN-Toolkit2 müssen die RKNPU2-Umgebung auf dem Board installiert und der Dienst rknn_server gestartet sein. Zwei grundlegende Begriffe dieser Umgebung:

<!-- source: EN PDF p15; unit 137 -->

RKNN Server ist ein Hintergrund-Proxydienst auf dem Entwicklungsboard. Er ruft die passenden Schnittstellen der Board-Runtime auf, verarbeitet die per USB vom Computer übertragenen Daten und liefert die Ergebnisse an den Computer zurück.

<!-- source: EN PDF p15; unit 138 -->

Die RKNPU2-Runtime-Bibliothek (librknnrt.so) lädt das RKNN-Modell im System und führt die Modellinferenz über die spezialisierte Neural Processing Unit (NPU) aus.

<!-- source: EN PDF p15; unit 139 -->

Sind RKNN Server und Runtime-Bibliothek nicht installiert oder ihre Versionen nicht aufeinander abgestimmt, die RKNPU2-Umgebung neu installieren. Hinweise der Quelle: 1. RKNN-Modelle mit dynamischen Eingabedimensionen benötigen RKNN Server und Runtime-Bibliothek in Version >= 1.5.0. 2. RKNN Server, Runtime und RKNN-Toolkit2 müssen aufeinander abgestimmt sein; die Quelle empfiehlt die neuesten Versionen. Diese Empfehlung beschreibt den Dokumentstand, keine Prüfung heutiger Pakete.

<!-- source: EN PDF p15; unit 140 -->

In der Regel ist auf dem Board bereits eine RKNPU2-Umgebung mit abgestimmten Versionen vorinstalliert. Dies mit folgendem Befehl prüfen. Fehlt die Umgebung oder stimmen die Versionen nicht überein, sie gemäß dem nächsten Abschnitt installieren bzw. aktualisieren.

<!-- source: EN PDF p15; unit 141 -->

1\. Auf dem Board läuft Android

<!-- source: EN PDF p15; unit 142 -->

Installation der RKNPU2-Umgebung prüfen

<!-- source: EN PDF p15; unit 143 -->

Lässt sich der Dienst rknn_server starten, ist die RKNPU2-Umgebung auf dem Board bereits installiert.

<!-- source: EN PDF p15; unit 144 -->

```text
# Switch to the board
adb shell

# Start rknn_server
su
setenforce 0
/vendor/bin/rknn_server &
```

<!-- source: EN PDF p15; unit 145 -->

Die folgende Ausgabe zeigt einen erfolgreichen Start von rknn_server und damit eine installierte RKNPU2-Umgebung:

<!-- source: EN PDF p15; unit 146 -->

```text
start rknn server, version: x.x.x
```

<!-- source: EN PDF p15; unit 147 -->

Abstimmung der Versionen prüfen

<!-- source: EN PDF p15; unit 148 -->

```text
# Query rknn_server version
strings /vendor/bin/rknn_server | grep -i "rknn_server version"

# Query librknnrt.so library version
# For 64-bit systems
strings /vendor/lib64/librknnrt.so | grep -i "librknnrt version"

# For 32-bit systems
strings /vendor/lib/librknnrt.so | grep -i "librknnrt version"
```

<!-- source: EN PDF p16; unit 149 -->

In der folgenden Ausgabe ist die Version von rknn_server x.x.x und die von librknnrt.so ebenfalls x.x.x.

<!-- source: EN PDF p16; unit 150 -->

```text
rknn_server version: x.x.x
librknnrt version: x.x.x
```

<!-- source: EN PDF p16; unit 151 -->

1\. Auf dem Board läuft Linux. Die wiederholte Nummer folgt dem Original.

<!-- source: EN PDF p16; unit 152 -->

Installation der RKNPU2-Umgebung prüfen

<!-- source: EN PDF p16; unit 153 -->

Lässt sich der Dienst rknn_server starten, ist die RKNPU2-Umgebung auf dem Board bereits installiert.

<!-- source: EN PDF p16; unit 154 -->

```text
# Switch to the board
adb shell

# Start rknn_server
restart_rknn.sh
```

<!-- source: EN PDF p16; unit 155 -->

Die folgende Ausgabe zeigt einen erfolgreichen Start von rknn_server und damit eine installierte RKNPU2-Umgebung:

<!-- source: EN PDF p16; unit 156 -->

```text
start rknn server, version: x.x.x
```

<!-- source: EN PDF p16; unit 157 -->

Abstimmung der Versionen prüfen

<!-- source: EN PDF p16; unit 158 -->

```text
# Query rknn_server version
strings /usr/bin/rknn_server | grep -i "rknn_server version"

# Query librknnrt.so library version
strings /usr/lib/librknnrt.so | grep -i "librknnrt version"
```

<!-- source: EN PDF p16; unit 159 -->

In der folgenden Ausgabe ist die Version von rknn_server x.x.x und die von librknnrt.so ebenfalls x.x.x.

<!-- source: EN PDF p16; unit 160 -->

```text
rknn_server version: x.x.x
librknnrt version: x.x.x
```

<!-- source: EN PDF p16; unit 161 -->

#### 3.4.3 RKNPU2-Umgebung installieren bzw. aktualisieren

<!-- source: EN PDF p16; unit 162 -->

Unterschiedliche Board-Systeme benötigen unterschiedliche RKNPU2-Umgebungen. Nachfolgend werden die Installationsmethoden je System erläutert.

<!-- source: EN PDF p16; unit 163 -->

Hinweis: Ist bereits eine RKNPU2-Umgebung mit abgestimmten Versionen installiert, kann dieser Abschnitt entfallen.

<!-- source: EN PDF p16; unit 164 -->

1\. Auf dem Board läuft Android

<!-- source: EN PDF p16; unit 165 -->

In das Verzeichnis rknpu2 wechseln, mit adb die passenden Dateien rknn_server und librknnrt.so auf das Board übertragen und anschließend rknn_server starten. Beispielbefehle:

<!-- source: EN PDF p16; unit 166 -->

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

<!-- source: EN PDF p17; unit 168 -->

1\. Auf dem Board läuft Linux. Die wiederholte Nummer folgt dem Original.

<!-- source: EN PDF p17; unit 169 -->

In das Verzeichnis rknpu2 wechseln, mit adb die passenden Dateien rknn_server und librknnrt.so auf das Board übertragen und anschließend rknn_server starten. Beispielbefehle:

<!-- source: EN PDF p17; unit 170 -->

```text
# Switch to the rknpu2 directory
cd Projects/rknn-toolkit2/rknpu2

# Push rknn_server to the board
# Note: In 64-bit Linux systems, BOARD_ARCH corresponds to the aarch64 directory. in 32-bit systems, it corresponds to the armhf directory.
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

<!-- source: EN PDF p18; unit 171 -->

## 4 Beispielprogramme ausführen

<!-- source: EN PDF p18; unit 172 -->

Dieses Kapitel erläutert den schnellen Start der Beispielprogramme auf dem Board in drei Teilen:

<!-- source: EN PDF p18; unit 173 -->

Einführung in RKNN Model Zoo

<!-- source: EN PDF p18; unit 174 -->

RKNN Python Demo ausführen

<!-- source: EN PDF p18; unit 175 -->

RKNN C Demo ausführen

<!-- source: EN PDF p18; unit 176 -->

### 4.1 Einführung in RKNN Model Zoo

<!-- source: EN PDF p18; unit 177 -->

RKNN Model Zoo stellt Beispielcode bereit, mit dem verbreitete Modelle rasch auf Rockchip-Entwicklungsboards ausgeführt werden können. Projektstruktur:

<!-- source: EN PDF p18; unit 178 -->

```text
rknn_model_zoo
├── 3rdparty # Third-party libraries
├── datasets # Datasets
├── examples # Example code
├── utils # Commonly used methods
├── build-android.sh # Compilation script for Android system board
├── build-linux.sh # Compilation script for Linux system board
└── ...
```

<!-- source: EN PDF p18; unit 179 -->

Unter examples befinden sich verbreitete Modelle wie MobileNet und YOLO. Für jedes Modell liegen Python- und C/C++-Beispiele vor, im Folgenden RKNN Python Demo und RKNN C Demo genannt. Beispielstruktur für das YOLOv5-Modell:

<!-- source: EN PDF p18; unit 180 -->

```text
rknn_model_zoo
├── examples
│ └── yolov5
│ ├── cpp # C/C++ version of the sample code
│ ├── model # Models, test images, and other files
│ ├── python # Python version of the sample code
│ └── README.md
└── ...
```

<!-- source: EN PDF p18; unit 181 -->

### 4.2 RKNN Python Demo ausführen

<!-- source: EN PDF p18; unit 182 -->

Die Verwendung von RKNN Python Demo wird am Beispiel von YOLOv5 erläutert.

<!-- source: EN PDF p18; unit 183 -->

Hinweis: Unterschiedliche RKNN Python Demos können sich in der Verwendung unterscheiden. Den Anweisungen in der jeweiligen README.md folgen.

<!-- source: EN PDF p18; unit 184 -->

#### 4.2.1 Modell vorbereiten

<!-- source: EN PDF p18; unit 185 -->

Nach rknn_model_zoo/examples/yolov5/model wechseln und download_model.sh ausführen. Das Skript lädt ein verfügbares YOLOv5-ONNX-Modell und speichert es im aktuellen model-Verzeichnis. Beispielbefehle:

<!-- source: EN PDF p19; unit 186 -->

```text
# Switch to the rknn_model_zoo/examples/yolov5/model directory
cd Projects/rknn_model_zoo/examples/yolov5/model

# Run the download_model.sh script to download the yolov5 ONNX model
# For example, the downloaded ONNX model is stored at model/yolov5s_relu.onnx
./download_model.sh
```

<!-- source: EN PDF p19; unit 187 -->

#### 4.2.2 Modell konvertieren

<!-- source: EN PDF p19; unit 188 -->

Nach rknn_model_zoo/examples/yolov5/python wechseln und convert.py ausführen. Das Skript konvertiert das ursprüngliche ONNX-Modell in ein RKNN-Modell. Beispielbefehle:

<!-- source: EN PDF p19; unit 189 -->

```text
# Switch to the rknn_model_zoo/examples/yolov5/python directory
cd Projects/rknn_model_zoo/examples/yolov5/python

# Run the convert.py script to convert the original ONNX model to RKNN format
# Usage: python convert.py model_path [rk3566|rk3588|rk3562] [i8/fp] [output_path]
python convert.py ../model/yolov5s_relu.onnx rk3588 i8 ../model/yolov5s_relu.rknn
```

<!-- source: EN PDF p19; unit 190 -->

#### 4.2.3 RKNN Python Demo ausführen

<!-- source: EN PDF p19; unit 191 -->

Nach rknn_model_zoo/examples/yolov5/python wechseln und yolov5.py ausführen. Das YOLOv5-Modell läuft über die Board-gebundene Debugfunktion auf dem Entwicklungsboard. Beispielbefehl:

<!-- source: EN PDF p19; unit 192 -->

```text
# Switch to the Projects/rknn_model_zoo/examples/yolov5/python directory
cd Projects/rknn_model_zoo/examples/yolov5/python

# Run the yolov5.py script to execute YOLOv5 model on the edge device
# Usage: python yolov5.py --model_path {rknn_model} --target {target_platform} --img_show

# If the --img_show parameter is included, the result image will be displayed
# Note: Here, the example is for the rk3588 platform. if using a different board, modify the platform type in the command accordingly
python yolov5.py --model_path ../model/yolov5s_relu.rknn --target rk3588 --img_show

# If you want to run the original onnx model on the computer first, you can use the following command
# Usage: python yolov5.py --model_path {onnx_model} --img_show
python yolov5.py --model_path ../model/yolov5s_relu.onnx --img_show
```

<!-- source: EN PDF p19; unit 193 -->

Das voreingestellte Eingabebild ist model/bus.jpg; das Ausgabebild ist nachfolgend dargestellt:

<!-- source: EN PDF p20; unit 194 -->

![Technikabbildung aus dem englischen Original, Seite 20](/docs/rockchip-rknn-sdk-quick-start/assets/en-p020-figure-01.png)

<!-- source: EN PDF p20; unit 195 -->

Abbildung 4-1: Ausgabebild von RKNN Python Demo

<!-- source: EN PDF p20; unit 196 -->

#### 4.2.4 Genauigkeit bewerten (optional)

<!-- source: EN PDF p20; unit 197 -->

Unter rknn_model_zoo/datasets liegen Datensätze zur Genauigkeitsbewertung. Diese müssen zunächst heruntergeladen und dort gespeichert werden. Für YOLOv5 wird beispielsweise COCO benötigt. In rknn_model_zoo/datasets/COCO download_eval_dataset.py ausführen; es lädt val2017 in das aktuelle COCO-Verzeichnis. Beispielbefehle:

<!-- source: EN PDF p20; unit 198 -->

```text
# Switch to the rknn_model_zoo/datasets/COCO directory
cd Projects/rknn_model_zoo/datasets/COCO

# Run the download_eval_dataset.py script to download the COCO dataset
python download_eval_dataset.py
```

<!-- source: EN PDF p20; unit 199 -->

Zur Genauigkeitsbewertung --coco_map_test und den Datensatzpfad über --img_folder angeben. Beispielbefehle; der visuelle Umbruch im Namen --img_folder wurde zusammengefügt:

<!-- source: EN PDF p21; unit 200 -->

```text
# Please install pycocotools first
pip install pycocotools

# Switch to the rknn_model_zoo/examples/yolov5/python directory
cd Projects/rknn_model_zoo/examples/yolov5/python

# Run the yolov5.py script
python yolov5.py \
  --model_path ../model/yolov5s_relu.rknn \
  --target rk3588 \
  --img_folder ../../../datasets/COCO/val2017 \
  --coco_map_test
```

<!-- source: EN PDF p21; unit 201 -->

### 4.3 RKNN C Demo ausführen

<!-- source: EN PDF p21; unit 202 -->

Die Verwendung von RKNN C Demo wird am Beispiel von YOLOv5 erläutert.

<!-- source: EN PDF p21; unit 203 -->

Hinweis: Unterschiedliche RKNN C Demos können sich in der Verwendung unterscheiden. Den Anweisungen in der jeweiligen README.md folgen.

<!-- source: EN PDF p21; unit 204 -->

#### 4.3.1 Modell vorbereiten

<!-- source: EN PDF p21; unit 205 -->

Nach rknn_model_zoo/examples/yolov5/model wechseln und download_model.sh ausführen. Das Skript lädt ein verfügbares YOLOv5-ONNX-Modell und speichert es im aktuellen model-Verzeichnis. Beispielbefehle:

<!-- source: EN PDF p21; unit 206 -->

```text
# Switch to the rknn_model_zoo/examples/yolov5/model directory
cd Projects/rknn_model_zoo/examples/yolov5/model

# Run the download_model.sh script to download the yolov5 ONNX model
# For example, the downloaded ONNX model is stored at model/yolov5s_relu.onnx
./download_model.sh
```

<!-- source: EN PDF p21; unit 207 -->

#### 4.3.2 Modell konvertieren

<!-- source: EN PDF p21; unit 208 -->

Nach rknn_model_zoo/examples/yolov5/python wechseln und convert.py ausführen. Das Skript konvertiert das ursprüngliche ONNX-Modell in ein RKNN-Modell. Beispielbefehle:

<!-- source: EN PDF p21; unit 209 -->

```text
# Switch to the rknn_model_zoo/examples/yolov5/python directory
cd Projects/rknn_model_zoo/examples/yolov5/python

# Run the convert.py script to convert the original ONNX model to RKNN format
# Usage: python convert.py model_path [rk3566|rk3588|rk3562] [i8/fp] [output_path]
python convert.py ../model/yolov5s_relu.onnx rk3588 i8 ../model/yolov5s_relu.rknn
```

<!-- source: EN PDF p21; unit 210 -->

#### 4.3.3 RKNN C Demo ausführen

<!-- source: EN PDF p21; unit 211 -->

Für RKNN C Demo zunächst den C/C++-Quellcode in eine ausführbare Datei kompilieren. Danach diese Datei, Modelle, Eingabebilder und weitere benötigte Dateien auf das Board übertragen und dort die ausführbare Datei starten.

<!-- source: EN PDF p21; unit 212 -->

Die Ausführung unterscheidet sich je nach Board-System. Nachfolgend wird sie anhand von RK3588 mit Android und RK356x mit Linux erläutert.

<!-- source: EN PDF p22; unit 213 -->

##### 4.3.3.1 Kompilierung

<!-- source: EN PDF p22; unit 214 -->

Auf dem Board läuft Android

<!-- source: EN PDF p22; unit 215 -->

Für RK3588 mit Android und arm64-v8a-Architektur wird build-android.sh aus rknn_model_zoo verwendet. Vor dem Aufruf ANDROID_NDK_PATH auf den lokalen NDK-Compilerpfad setzen. Dazu folgende Zeile in build-android.sh einfügen:

<!-- source: EN PDF p22; unit 216 -->

```text
# Add the following line to the beginning of the 'build-android.sh' script
ANDROID_NDK_PATH=Projects/android-ndk-r19c
```

<!-- source: EN PDF p22; unit 217 -->

Anschließend build-android.sh im Verzeichnis rknn_model_zoo mit folgendem Befehl ausführen:

<!-- source: EN PDF p22; unit 218 -->

```text
# Switch to the rknn_model_zoo directory
cd Projects/rknn_model_zoo

# Run the build-android.sh script
# Usage: ./build-android.sh -t <target> -a <arch> -d <build_demo_name> [-b <build_type>] [-m]
# -t : target (rk356x/rk3588) # Platform type
# -a : arch (arm64-v8a/armeabi-v7a) # Edge device system architecture
# -d : demo name # Corresponding to the name of the subfolders under the examples directory, such as yolov5, MobileNet
# -b : build_type (Debug/Release)
# -m : enable address sanitizer, build_type needs to be set to Debug
./build-android.sh -t rk3588 -a arm64-v8a -d yolov5
```

<!-- source: EN PDF p22; unit 219 -->

Auf dem Board läuft Linux

<!-- source: EN PDF p22; unit 220 -->

Für RK356x mit Linux und aarch64-Architektur wird build-linux.sh aus rknn_model_zoo verwendet. Vor dem Aufruf GCC_COMPILER auf den lokalen GCC-Compilerpfad setzen. Dazu folgende Zeile in build-linux.sh einfügen:

<!-- source: EN PDF p22; unit 221 -->

```text
# Add the following line to the beginning of the 'build-linux.sh' script
GCC_COMPILER=Projects/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu
```

<!-- source: EN PDF p22; unit 222 -->

Anschließend build-linux.sh im Verzeichnis rknn_model_zoo mit folgendem Befehl ausführen:

<!-- source: EN PDF p22; unit 223 -->

```text
# Switch to the rknn_model_zoo directory
cd Projects/rknn_model_zoo

# Run the build-linux.sh script
# Usage: ./build-linux.sh -t <target> -a <arch> -d <build_demo_name> [-b <build_type>] [-m]
# -t : target (rk356x/rk3588) # Platform type, rk3568/rk3566 are both unified as rk356x
# -a : arch (aarch64/armhf) # Edge device system architecture
# -d : demo name # Corresponding to the name of the subfolders under the examples directory, such as yolov5, MobileNet
# -b : build_type(Debug/Release)
# -m : enable address sanitizer, build_type needs to be set to Debug
./build-linux.sh -t rk356x -a aarch64 -d yolov5
```

<!-- source: EN PDF p23; unit 224 -->

##### 4.3.3.2 Dateien auf das Board übertragen

<!-- source: EN PDF p23; unit 225 -->

Nach der Kompilierung entsteht unter rknn_model_zoo ein install-Verzeichnis. Es enthält die ausführbare Datei und zugehörige Dateien wie Eingabebilder. Verzeichnisstruktur:

<!-- source: EN PDF p23; unit 226 -->

```text
install
├── rk356x_linux_aarch64 # rk356x platform
└── rk3588_android_arm64-v8a # rk3588 platform
 └── rknn_yolov5_demo
   ├── lib # Dependency library
   ├── model # Store models, test images and other files
   └── rknn_yolov5_demo # Executable file
```

<!-- source: EN PDF p23; unit 227 -->

Die Dateiübertragung auf das Board unterscheidet sich je nach Systemtyp.

<!-- source: EN PDF p23; unit 228 -->

Auf dem Board läuft Android

<!-- source: EN PDF p23; unit 229 -->

Für RK3588 mit Android:

<!-- source: EN PDF p23; unit 230 -->

```text
# Switch to the rknn_model_zoo directory
cd Projects/rknn_model_zoo

# Switch to root user permissions
adb root

# Push the entire rknn_yolov5_demo folder to the board
# Note: The rknn_yolov5_demo folder contains an executable file with the same name, rknn_yolov5_demo
# Note: When using different models and platforms, it is recommended to find the corresponding path directly under the 'install' directory
adb push install/rk3588_android_arm64-v8a/rknn_yolov5_demo/ /data/
```

<!-- source: EN PDF p23; unit 231 -->

Auf dem Board läuft Linux

<!-- source: EN PDF p23; unit 232 -->

Für RK356x mit Linux:

<!-- source: EN PDF p23; unit 233 -->

```text
# Switch to the rknn_model_zoo directory
cd Projects/rknn_model_zoo

# Push the entire rknn_yolov5_demo folder to the board
# Note: The rknn_yolov5_demo folder contains an executable file with the same name, rknn_yolov5_demo
# Note: When using different models and platforms, it is recommended to find the corresponding path directly under the 'install' directory
adb push install/rk356x_linux_aarch64/rknn_yolov5_demo /data/
```

<!-- source: EN PDF p23; unit 234 -->

##### 4.3.3.3 Demo auf dem Entwicklungsboard starten

<!-- source: EN PDF p23; unit 235 -->

Mit folgenden Befehlen die ausführbare Datei auf dem Board starten:

<!-- source: EN PDF p24; unit 236 -->

```text
# Switch to the board
adb shell

# Switch to the rknn_yolov5_demo directory
cd /data/rknn_yolov5_demo/

# Set the library dependency environment
export LD_LIBRARY_PATH=./lib

# Run the executable file
# Usage: ./rknn_yolov5_demo <model_path> <input_path>
./rknn_yolov5_demo model/yolov5s_relu.rknn model/bus.jpg
```

<!-- source: EN PDF p24; unit 237 -->

##### 4.3.3.4 Ergebnisse anzeigen

<!-- source: EN PDF p24; unit 238 -->

Das Ausgabebild wird standardmäßig unter rknn_yolov5_demo/out.png gespeichert. Mit adb vom Board auf den Computer übertragen. Dazu im lokalen Computerterminal folgenden Befehl ausführen:

<!-- source: EN PDF p24; unit 239 -->

```text
# Pull to the local current directory
adb pull /data/rknn_yolov5_demo/out.png .
```

<!-- source: EN PDF p24; unit 240 -->

Ausgabebild:

<!-- source: EN PDF p25; unit 241 -->

![Technikabbildung aus dem englischen Original, Seite 25](/docs/rockchip-rknn-sdk-quick-start/assets/en-p025-figure-01.png)

<!-- source: EN PDF p25; unit 242 -->

Abbildung 4-2: Ausgabebild von RKNN C Demo

<!-- source: EN PDF p25; unit 243 -->

## 5 RKNN Python Demo in Docker ausführen (optional)

<!-- source: EN PDF p25; unit 244 -->

Für die Ausführung von RKNN Python Demo in Docker die Entwicklungsumgebung gemäß diesem Kapitel vorbereiten.

<!-- source: EN PDF p25; unit 245 -->

Das bereitgestellte Docker-Image enthält die RKNN-Toolkit2-Umgebung, sodass RKNN Python Demo ohne eigene Installation der Umgebung gestartet werden kann. Es enthält jedoch ausschließlich eine saubere RKNN-Toolkit2-Umgebung und ist speziell für RKNN Python Demo vorgesehen.

<!-- source: EN PDF p25; unit 246 -->

Das Kapitel besteht aus drei Teilen:

<!-- source: EN PDF p25; unit 247 -->

Docker installieren

<!-- source: EN PDF p25; unit 248 -->

RKNN-Toolkit2-Umgebung in Docker installieren

<!-- source: EN PDF p25; unit 249 -->

RKNN Python Demo ausführen

<!-- source: EN PDF p26; unit 250 -->

### 5.1 Docker installieren

<!-- source: EN PDF p26; unit 251 -->

Ist Docker bereits installiert, kann dieser Schritt entfallen. Andernfalls der offiziellen Installationsdokumentation folgen.

<!-- source: EN PDF p26; unit 252 -->

Offizielle Docker-Installationsanleitung: [https://docs.docker.com/install/linux/docker-ce/ubuntu/](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

<!-- source: EN PDF p26; unit 253 -->

Hinweis: Der Benutzer muss der Gruppe docker hinzugefügt werden.

<!-- source: EN PDF p26; unit 254 -->

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

<!-- source: EN PDF p26; unit 255 -->

Referenzausgabe nach erfolgreicher Installation:

<!-- source: EN PDF p26; unit 256 -->

```text
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
719385e32844: Pull complete
Digest: sha256:88ec0acaa3ec199d3b7eaf73588f4518c25f9d34f58ce9a0df68429c5af48e8d
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
```

<!-- source: EN PDF p26; unit 257 -->

### 5.2 RKNN-Toolkit2-Umgebung in Docker installieren

<!-- source: EN PDF p26; unit 258 -->

#### 5.2.1 RKNN-Toolkit2-Image vorbereiten

<!-- source: EN PDF p26; unit 259 -->

Nachfolgend werden zwei Wege zum Erstellen der RKNN-Toolkit2-Image-Umgebung beschrieben. Einer davon kann gewählt werden.

<!-- source: EN PDF p26; unit 260 -->

1\. RKNN-Toolkit2-Image mit einer Dockerfile erstellen

<!-- source: EN PDF p26; unit 261 -->

Im RKNN-Toolkit2-Projekt enthält docker/docker_file eine Dockerfile zum Erstellen der Entwicklungsumgebung. Das Image wie folgt mit docker build erstellen:

<!-- source: EN PDF p26; unit 262 -->

```text
# Note: Replace 'xx' and 'x.x.x' with the actual version numbers
cd Projects/rknn-toolkit2/rknn-toolkit2/docker/docker_file/ubuntu_xx_xx_cpxx

docker build -f Dockerfile_ubuntu_xx_xx_for_cpxx -t rknn-toolkit2:x.x.x-cpxx .
```

<!-- source: EN PDF p26; unit 263 -->

2\. RKNN-Toolkit2-Image aus einer vorgefertigten Docker-Image-Datei laden

<!-- source: EN PDF p26; unit 264 -->

Die Projektdateien der passenden RKNN-Toolkit2-Version über folgenden Link herunterladen und entpacken. Unter docker/docker_image befindet sich ein vorgefertigtes Docker-Image mit der gesamten Entwicklungsumgebung.

<!-- source: EN PDF p27; unit 265 -->

Cloud-Downloadlink: [https://console.zbox.filez.com/l/I00fc3](https://console.zbox.filez.com/l/I00fc3) (Abrufcode: rknn).

<!-- source: EN PDF p27; unit 266 -->

Mit folgendem Befehl die Image-Datei der passenden Python-Version laden.

<!-- source: EN PDF p27; unit 267 -->

```text
# Note: Replace 'x.x.x' with the actual version number of RKNN-Toolkit2, and 'cpxx' with the Python version

docker load --input rknn-toolkit2-x.x.x-cpxx-docker.tar.gz
```

<!-- source: EN PDF p27; unit 268 -->

#### 5.2.2 Image-Informationen abfragen

<!-- source: EN PDF p27; unit 269 -->

Nach erfolgreichem Erstellen oder Laden eines Images dessen Informationen mit folgendem Befehl anzeigen:

<!-- source: EN PDF p27; unit 270 -->

```text
docker images
```

<!-- source: EN PDF p27; unit 271 -->

Beispielinformationen zum RKNN-Toolkit2-Image:

<!-- source: EN PDF p27; unit 272 -->

```text
REPOSITORY TAG IMAGE ID CREATED SIZE
rknn-toolkit2 x.x.x-cpxx xxxxxxxxxxxx 1 hours ago 5.89GB
```

<!-- source: EN PDF p27; unit 273 -->

### 5.3 RKNN Python Demo ausführen

<!-- source: EN PDF p27; unit 274 -->

Hinweis: Sicherstellen, dass die RKNPU2-Umgebung auf dem Board installiert ist. Andernfalls zur Installation Abschnitt 3.4 heranziehen.

<!-- source: EN PDF p27; unit 276 -->

Dateien einbinden und Container starten

<!-- source: EN PDF p27; unit 277 -->

Das RKNN-Model-Zoo-Projekt gemäß Abschnitt 3.1 lokal herunterladen. Anschließend in den Container einbinden und diesen mit docker run starten. Danach wird in die bash-Umgebung des Containers gewechselt. Beispielbefehle:

<!-- source: EN PDF p27; unit 278 -->

```text
# Use the docker run command to create and run the RKNN Toolkit2 container
# Map local files into the container by attaching the -v <host src folder>:<image dst folder> parameter
docker run -t -i --privileged \
  -v /dev/bus/usb:/dev/bus/usb \
  -v /Projects/rknn_model_zoo:/rknn_model_zoo \
  rknn-toolkit2:x.x.x-cpxx \
  /bin/bash
```

<!-- source: EN PDF p27; unit 279 -->

Modell vorbereiten

<!-- source: EN PDF p27; unit 280 -->

Nach rknn_model_zoo/examples/yolov5/model wechseln und download_model.sh ausführen. Das Skript lädt ein verfügbares YOLOv5-ONNX-Modell und speichert es im aktuellen model-Verzeichnis. Beispielbefehle:

<!-- source: EN PDF p27; unit 281 -->

```text
# Switch to the rknn_model_zoo/examples/yolov5/model directory
cd rknn_model_zoo/examples/yolov5/model

# Run the download_model.sh script to download the yolov5 onnx model
./download_model.sh

# For example, the downloaded onnx model will be stored at model/yolov5s_relu.onnx
```

<!-- source: EN PDF p28; unit 282 -->

Modell konvertieren

<!-- source: EN PDF p28; unit 283 -->

Nach rknn_model_zoo/examples/yolov5/python wechseln und convert.py ausführen. Das Skript konvertiert das ursprüngliche ONNX-Modell in ein RKNN-Modell. Beispielbefehle:

<!-- source: EN PDF p28; unit 284 -->

```text
# Switch to the rknn_model_zoo/examples/yolov5/python directory
cd Projects/rknn_model_zoo/examples/yolov5/python

# Run the convert.py script to convert the original ONNX model to RKNN format
# Usage: python convert.py model_path [rk3566|rk3588|rk3562] [i8/fp] [output_path]

python convert.py ../model/yolov5s_relu.onnx rk3588 i8 ../model/yolov5s_relu.rknn
```

<!-- source: EN PDF p28; unit 285 -->

RKNN Python Demo ausführen

<!-- source: EN PDF p28; unit 286 -->

Nach rknn_model_zoo/examples/yolov5/python wechseln und yolov5.py ausführen. Das YOLOv5-Modell läuft über die Board-gebundene Debugfunktion auf dem Entwicklungsboard. Beispielbefehl:

<!-- source: EN PDF p28; unit 287 -->

```text
# Switch to the rknn_model_zoo/examples/yolov5/python directory
cd rknn_model_zoo/examples/yolov5/python

# Run the yolov5.py script to run the yolov5 model on the board
# Usage: python yolov5.py --model_path {rknn_model} --target {target_platform}
# Note: Here, we use rk3588 as an example platform. If using a different board, modify the platform type in the command accordingly.
python yolov5.py --model_path ../model/yolov5s_relu.rknn --target rk3588
```

<!-- source: EN PDF p28; unit 288 -->

Nach erfolgreicher Skriptausführung erscheint folgende Ausgabe. class bezeichnet die vorhergesagte Kategorie, score den Konfidenzwert; (xmin, ymin) sind die Koordinaten der linken oberen, (xmax, ymax) der rechten unteren Ecke des Erkennungsrahmens.

<!-- source: EN PDF p28; unit 289 -->

```text
# class @ （xmin, ymin, xmax, ymax）score
person @ (209 244 286 506) 0.884
person @ (478 238 559 526) 0.868
person @ (110 238 230 534) 0.825
bus @ (94 129 553 468) 0.705
person @ (79 354 122 516) 0.339
```

<!-- source: EN PDF p28; unit 290 -->

## 6 Häufig gestellte Fragen

<!-- source: EN PDF p28; unit 291 -->

### 6.1 adb devices zeigt kein Gerät an

<!-- source: EN PDF p28; unit 292 -->

Folgende Maßnahmen können zur Behebung versucht werden:

<!-- source: EN PDF p28; unit 293 -->

1\. Die Verbindung prüfen, das Datenkabel erneut anschließen und einen anderen USB-Port am Computer oder ein anderes Datenkabel versuchen.

<!-- source: EN PDF p28; unit 294 -->

2\. Beim USB-Anschluss des Entwicklungsboards darf gleichzeitig nur ein adb server auf Computer und Docker-Container aktiv sein. Soll das Board beispielsweise im Container verbunden werden, mit adb kill-server im Computerterminal den lokalen adb server beenden.

<!-- source: EN PDF p29; unit 295 -->

3\. Die folgende Fehlermeldung bedeutet, dass adb nicht installiert ist. Zur Installation sudo apt install adb ausführen.

<!-- source: EN PDF p29; unit 296 -->

```text
command 'adb' not found, but can be installed with:
sudo apt install adb
```

<!-- source: EN PDF p29; unit 297 -->

### 6.2 Dienst rknn_server manuell starten

<!-- source: EN PDF p29; unit 298 -->

Für die Board-gebundene Debugfunktion von RKNN-Toolkit2 müssen die RKNPU2-Umgebung auf dem Board installiert und der Dienst rknn_server gestartet sein.

<!-- source: EN PDF p29; unit 299 -->

Auf manchen Boards startet rknn_server nach dem Einschalten oder Neustart nicht automatisch. RKNN Python Demo kann dann etwa E init_runtime: The rknn_server on the connected device is abnormal melden. In diesem Fall auf das Board wechseln und den Dienst gemäß Abschnitt 3.4.2 „Installation der RKNPU2-Umgebung prüfen“ manuell starten.

<!-- source: EN PDF p29; unit 300 -->

## 7 Referenzdokumentation

<!-- source: EN PDF p29; unit 301 -->

Ausführliche Hinweise zur Verwendung und zu den Schnittstellen von RKNN-Toolkit2 und RKNPU2 stehen in Rockchip_RKNPU_User_Guide_RKNN_SDK_EN.pdf.

{% endraw %}
