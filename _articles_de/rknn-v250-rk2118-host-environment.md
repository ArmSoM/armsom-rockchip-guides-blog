---
title: "RK2118 NPU, Teil 2: Host-Umgebung und Toolkit2-Installation"
description: "RK2118 NPU, Teil 2: Host-Umgebung und Toolkit2-Installation · RKNN2 V2.5.0"
excerpt: "RK2118 NPU, Teil 2: Host-Umgebung und Toolkit2-Installation"
translation_key: "rknn-v250-rk2118-host-environment"
slug: "rknn-v250-rk2118-host-environment"
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

**RK2118-Einstiegsserie · 2/5**

[RK2118 NPU, Teil 1: Hardware, Anschluss und serielle Konsole](/de/articles/rknn-v250-rk2118-hardware/)

**RK2118 NPU, Teil 2: Host-Umgebung und Toolkit2-Installation**

[RK2118 NPU, Teil 3: RT-Thread und DSP-Firmware](/de/articles/rknn-v250-rk2118-firmware/)

[RK2118 NPU, Teil 4: Modellkonvertierung, USB-Eingaben und Inferenzergebnisse](/de/articles/rknn-v250-rk2118-model-demo/)

[RK2118 NPU, Teil 5: Docker, häufige Fragen und Referenzen](/de/articles/rknn-v250-rk2118-docker-faq/)

<!-- rk2118-series:end -->

{% raw %}

## 3. Entwicklungsumgebung vorbereiten

Dieses Kapitel beschreibt die direkte Installation auf dem Computer. Auch die folgenden Beispiele gehen von dieser Installation aus. Für die Ausführung in Docker die Umgebung nach Kapitel 5 vorbereiten.

Das Kapitel besteht aus drei Teilen:

- RKNN-Repositories herunterladen

- RKNN-Toolkit2 auf dem Computer installieren

- RK2118 SDK vorbereiten

### 3.1 RKNN-Repositories herunterladen

Für die RKNN-Repositories wird ein eigenes Verzeichnis empfohlen, beispielsweise Projects. Das RKNN-Toolkit2-Repository dort ablegen. Beispielbefehle:

```text
# Create the 'Projects' folder
mkdir Projects

# Switch to this directory
cd Projects

# Download the RKNN-Toolkit2 repository
git clone https://github.com/airockchip/rknn-toolkit2.git --depth 1

# Notice:
# 1. Parameter --depth 1 means to clone only the latest commit
# 2. If the 'git clone' command fails, you can also download the compressed file directly from GitHub and unzip it locally in this directory.
```

Gesamte Verzeichnisstruktur:

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
```

### 3.2 RKNN-Toolkit2 auf dem Computer installieren

#### 3.2.1 Python installieren

Wenn Python 3.8 nicht installiert ist oder mehrere Python-Versionen vorhanden sind, empfiehlt die Quelle, mit Miniforge eine neue Python-3.8-Umgebung anzulegen.

##### 3.2.1.1 miniforge installieren

Im Terminal mit folgendem Befehl prüfen, ob miniforge installiert ist. Bei vorhandener Installation kann dieser Schritt entfallen.

```text
conda -V
# Reference output: conda 24.3.0, indicating that Miniforge Conda version is 24.3.0
# If it shows 'conda: command not found', it means Miniforge Conda is not installed.
```

Falls Miniforge fehlt, das Installationsprogramm über folgenden Link herunterladen:

```text
https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-x86_64.sh
```

Anschließend miniforge mit diesen Befehlen installieren:

```text
chmod 777 Miniforge3-Linux-x86_64.sh
bash Miniforge3-Linux-x86_64.sh
```

##### 3.2.1.2 Python-Umgebung mit miniforge erstellen

Im Terminal mit folgendem Befehl in die conda-Basisumgebung wechseln:

```text
source /opt/miniforge3/bin/activate
# Upon successful activation, the command prompt will change to the following form:
# (base) xxx@xxx:~$
```

Eine Python-3.8-Umgebung namens toolkit2 erstellen:

```text
conda create -n toolkit2 python=3.8
```

Die Umgebung toolkit2 aktivieren. RKNN-Toolkit2 wird anschließend in dieser Umgebung installiert.

```text
conda activate toolkit2
# (toolkit2) xxx@xxx:~$
```

#### 3.2.2 RKNN-Toolkit2 installieren

Nach Aktivierung von toolkit2 lässt sich RKNN-Toolkit2 aus der pip-Paketquelle oder aus einem lokalen Wheel-Paket installieren. Installation über pip:

```text
pip install rknn-toolkit2 -i https://pypi.org/simple

# If RKNN-Toolkit2 is already installed, you can upgrade it with the following command:
pip install rknn-toolkit2 -i https://pypi.org/simple --upgrade
```

- Installation aus einem lokalen Wheel-Paket:

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

#### 3.2.3 Installation von RKNN-Toolkit2 prüfen

Die folgenden Befehle ausführen. Wenn keine Fehler auftreten, wurde die RKNN-Toolkit2-Umgebung erfolgreich installiert.

```text
# Switch to Python interactive mode
python

# Import the RKNN class
from rknn.api import RKNN
```

Bei Installationsfehlern siehe Abschnitt 5.4.2 „RKNN-Toolkit2 Installation Issues“ in RKNN2_SDK_Development_Guide_V2.5.0.pdf. Dort werden Lösungen für Fehler bei der Installation ausführlich erläutert.

{% endraw %}
