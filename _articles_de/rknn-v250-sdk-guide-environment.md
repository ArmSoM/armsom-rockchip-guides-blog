---
title: "RKNN2 SDK V2.5.0 · Entwicklungsumgebung, Versionen und Board-Anbindung"
description: "RKNN2 SDK V2.5.0 · Entwicklungsumgebung, Versionen und Board-Anbindung · Vollständige Entwicklerhandbuchreihe"
excerpt: "Entwicklungsumgebung, Versionen und Board-Anbindung"
translation_key: "rknn-v250-sdk-guide-environment"
slug: "rknn-v250-sdk-guide-environment"
lang: "de"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "V2.5.0", "NPU"]
---

Plattformreferenz nach dem Rockchip RKNN2 SDK Development Guide V2.5.0. Erfasst werden nur die im Original genannten SoCs sowie Linux-/Android-Runtime- und Toolkit-Kombinationen. Funktionen gelten unter den jeweiligen Chip-, SDK-, Treiber- und Kernelbedingungen und nicht automatisch für jedes ArmSoM-Board. Prüfen Sie vor der Bereitstellung BSP, NPU-Treiber, Runtime und Modellversion des konkreten Boards. Es erfolgte keine ArmSoM-Hardwarevalidierung; Protokolle, Leistungswerte und Beispiele stammen aus dem Original.

Quellen und Prüfung: Chinesisch folgt der chinesischen V2.5.0 (182 Seiten); Englisch, Russisch und Deutsch folgen der englischen V2.5.0 (208 Seiten). Quellenspezifische technische Angaben bleiben erhalten; Inhalte älterer Versionen werden nicht als neue Fakten dargestellt. Chinesische Abbildungen stammen aus dem chinesischen PDF, EN/RU/DE-Abbildungen aus dem englischen PDF einschließlich separat extrahierter Vektorflussdiagramme. Abschnitts- und Formelnummern bleiben erhalten. Einige Querverweise verwenden alte Kapitelnummern; Dynamic-Shape-Beispiele enthalten „1224+140=264“, TP_NORM-Aussagen widersprechen sich, und init()/rknn.val_perf() weichen von späteren API-Beschreibungen ab. Diese Quellenprobleme bleiben dokumentiert und sind vor Ausführung anhand der tatsächlichen V2.5.0-Header und API-Referenzen zu prüfen. Code und Parameter bleiben erhalten; PDF-Umbrüche und Tabellenfortsetzungen wurden bereinigt.

[Rockchip RKNN2 SDK V2.5.0](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

**RKNN2 SDK V2.5.0 · 2/22**

[1. Softwarestack und Grundbegriffe](/de/articles/rknn-v250-sdk-guide-overview/)

**Entwicklungsumgebung, Versionen und Board-Anbindung**

[3. Entwicklungsablauf und Schnittstellenwahl](/de/articles/rknn-v250-sdk-guide-workflow/)

[4. Modellkonvertierung und ONNX-Bearbeitung](/de/articles/rknn-v250-sdk-guide-conversion/)

[5. Quantisierung, hybride Quantisierung und QAT](/de/articles/rknn-v250-sdk-guide-quantization/)

[6. Inferenz sowie Genauigkeits-, Leistungs- und Speicherbewertung](/de/articles/rknn-v250-sdk-guide-evaluation/)

[7. Runtime-Lebenszyklus, Layouts und Speicher](/de/articles/rknn-v250-sdk-guide-runtime-basics/)

[8. Zero-Copy-Schnittstellen und Ein-/Ausgabebedingungen](/de/articles/rknn-v250-sdk-guide-zero-copy/)

[9. C-API-Bereitstellung und Codegenerierung](/de/articles/rknn-v250-sdk-guide-c-deployment/)

[10. Python-Bereitstellung mit Toolkit Lite2](/de/articles/rknn-v250-sdk-guide-lite-deployment/)

[11. Matmul-API und Matrixlayouts](/de/articles/rknn-v250-sdk-guide-matmul/)

[12. NPU-Mehrkernkonfiguration und Leistung](/de/articles/rknn-v250-sdk-guide-multicore/)

[13. Modelle mit dynamischen Formen und Bereitstellung](/de/articles/rknn-v250-sdk-guide-dynamic-shape/)

[14. Inferenz mit mehreren Batches](/de/articles/rknn-v250-sdk-guide-multi-batch/)

[15. NPU-SRAM auf RK3588/RK3576](/de/articles/rknn-v250-sdk-guide-sram/)

[16. Cache-Kohärenz und Sparse-Inferenz](/de/articles/rknn-v250-sdk-guide-cache-sparsity/)

[17. Benutzerdefinierte Operatoren: Python und C API](/de/articles/rknn-v250-sdk-guide-custom-operators/)

[18. Bereitstellung verschlüsselter Modelle](/de/articles/rknn-v250-sdk-guide-encryption/)

[19. Diagnose von Genauigkeitsproblemen](/de/articles/rknn-v250-sdk-guide-accuracy/)

[20. Leistungsanalyse und Netzwerkoptimierung](/de/articles/rknn-v250-sdk-guide-performance/)

[21. Speicheranalyse, gemeinsame Nutzung und Wiederverwendung](/de/articles/rknn-v250-sdk-guide-memory/)

[22. FAQ, Fehlerbehandlung und Referenzen](/de/articles/rknn-v250-sdk-guide-faq/)

{% raw %}

## 1.2 Versionen und Entwicklungsumgebung

RKNN-Toolkit2 ist in zwei Versionen verfügbar: für x86 und für ARM64. Die Installation ist identisch, außer dass ARM64 Docker noch nicht unterstützt. Außerdem unterstützt ARM64 bei der Konvertierung nur Modelle aus onnx und pytorch; Modelle anderer Frameworks werden derzeit nicht unterstützt.

Unterschiede zwischen den x86- und ARM64-Versionen:

| Deep-Learning-Framework | x86 | ARM64 |
| --- | --- | --- |
| Caffe | ✔ | ✗ |
| TensorFlow | ✔ | ✗ |
| TF Lite | ✔ | ✗ |
| ONNX | ✔ | ✔ |
| DarkNet | ✔ | ✗ |
| PyTorch | ✔ | ✔ |

Unterschiede bei den Werkzeugen:

| Benötigte Werkzeuge | x86 | ARM64 |
| --- | --- | --- |
| adb | ✔ | ✗ |
| rknn_server | ✔ | ✗ |
| rknn runtime | ✔ | ✔ |

Unterschiede bei der Verwendung von x86 und ARM64:

Der wichtigste Unterschied betrifft Debugfunktionen wie Genauigkeitsanalyse und Inferenz. Die ARM64-Version wird unter ARM64 Linux installiert; für diese Funktionen muss lediglich librknnrt.so unter '/usr/lib64' liegen. Da ARM64 adb nicht unterstützt, funktioniert sie nur auf der aktuellen Platine. Bei x86 müssen hingegen rknn_server aktualisiert und verwendet sowie adb bereitgestellt werden, um diese Debugfunktionen zu nutzen und gegebenenfalls eine andere Platine anzuschließen.

Darüber hinaus kann sich die Leistung von x86 und ARM64 bei Genauigkeitsanalyse und Quantisierung unterscheiden.

Hinweis: Zur Vorbereitung der RK2118-Entwicklungsumgebung siehe 01_RKNN2_RK2118_QuickStart_V2.5.0.

### 1.2.1 RKNN-Toolkit2 installieren

Dieses Kapitel beschreibt zwei Installationsmethoden für RKNN-Toolkit2: Docker und Pip. Wählen Sie die für Sie geeignete Methode.

#### 1.2.1.1 Installation über Docker

##### 1.2.1.1.1 Docker installieren

Wenn Docker bereits installiert ist, können Sie diesen Schritt überspringen. Andernfalls installieren Sie es anhand der offiziellen Anleitung: https://docs.docker.com/install/linux/docker-ce/ubuntu/.

Hinweis: Nehmen Sie den Benutzer unbedingt in die Gruppe docker auf.

```text
# Create docker group
sudo groupadd docker
# Add the current user to the docker group
sudo usermod -aG docker $USER
# Update and activate the docker group
newgrp docker
# Verify that sudo is not needed to execute docker commands
docker run hello-world
```

Bei erfolgreicher Ausführung erscheint folgendes Ergebnis:

```text
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
719385e32844: Pull complete
Digest: sha256:88ec0acaa3ec199d3b7eaf73588f4518c25f9d34f58ce9a0df68429c5af48e8d
Status: Downloaded newer image for hello-world:latest
Hello from Docker!
```

##### 1.2.1.1.2 Image vorbereiten

Dieser Abschnitt beschreibt zwei Möglichkeiten zur Vorbereitung der RKNN-Toolkit2-Image-Umgebung. Beide sind frei wählbar.

**1 Image-Umgebung mit Dockerfile erstellen**

Im Verzeichnis docker/docker_file des Projekts RKNN-Toolkit2 stehen Dockerfiles zum Aufbau der Entwicklungsumgebung bereit. Das Image wird mit folgendem Docker-Befehl erstellt.

```text
# Note: xx and x.x.x below represent version numbers, please replace them with actual values
cd docker/docker_file/ubuntu_xx_xx_cpxx
docker build -f Dockerfile_ubuntu_xx_xx_for_cpxx -t rknn-toolkit2:x.x.x-cpxx .
```

**2. Docker-Image mit vorgepackter Entwicklungsumgebung laden**

Die Projektdatei der passenden RKNN-Toolkit2-Version herunterladen. Nach dem Entpacken liegt das Docker-Image mit vollständiger Entwicklungsumgebung in docker/docker_image.

Downloadlink zum Netzspeicher: https://console.zbox.filez.com/l/I00fc3. Zugriffscode: rknn.

Laden Sie die zur Python-Version passende Image-Datei mit folgendem Befehl:

```text
# Note: x.x.x represents the version number of RKNN-Toolkit2, and cpxx represents the Python version number
docker load --input rknn-toolkit2-x.x.x-cpxx-docker.tar.gz
```

##### 1.2.1.1.3 Image-Informationen abfragen

Prüfen Sie nach erfolgreicher Erstellung oder dem Laden die Informationen zum Docker-Image:

```text
docker images
```

Die entsprechenden RKNN-Toolkit2-Image-Informationen werden angezeigt:

```text
REPOSITORY TAG IMAGE ID CREATED SIZE
rknn-toolkit2 x.x.x-cpxx xxxxxxxxxxxx 1 hours ago 5.89GB
```

##### 1.2.1.1.4 Image ausführen

Führen Sie das Docker-Image mit folgendem Befehl aus. Anschließend befinden Sie sich in dessen Bash-Umgebung.

```text
docker run -t -i --privileged -v /dev/bus/usb:/dev/bus/usb rknn-toolkit2:x.x.x-cpxx /bin/bash
```

Mit dem zusätzlichen Parameter `-v &lt;host src folder&gt;: &lt;image dst folder&gt;` können Sie den Code im Ordner examples in die Docker-Umgebung einbinden.

```text
docker run -t -i --privileged -v /dev/bus/usb:/dev/bus/usb -v /your/rknn-toolkit2-x.x.x/examples:/examples rknn-
toolkit2:x.x.x-cpxx /bin/bash
```

##### 1.2.1.1.5 Demo ausführen

```text
cd examples/onnx/yolov5
python test.py
```

Nach erfolgreicher Ausführung des Skripts sollte folgendes Ergebnis erscheinen:

```text
class score xmin, ymin, xmax, ymax
--------------------------------------------------
person 0.884 [ 208, 244, 286, 506]
person 0.868 [ 478, 236, 559, 528]
person 0.825 [ 110, 238, 230, 534]
person 0.339 [ 79, 353, 122, 516]
bus 0.705 [ 92, 128, 554, 467]
```

#### 1.2.1.2 Installation über Pip

##### 1.2.1.2.1 Python-Umgebung installieren

Wenn die Python-Umgebung bereits installiert ist, können Sie diesen Schritt überspringen.

```text
sudo apt-get update
sudo apt-get install python3 python3-dev python3-pip
sudo apt-get install libxslt1-dev zlib1g zlib1g-dev libglib2.0-0 libsm6 libgl1-mesa-glx libprotobuf-dev gcc
```

Wenn Sie RKNN-Toolkit2 in der lokalen Umgebung statt in einer virtuellen Conda-Umgebung installieren möchten, fahren Sie nach erfolgreicher Python-Installation mit Schritt 2.1.2.4 fort.

##### 1.2.1.2.2 Conda installieren

Wenn mehrere Python-Versionen installiert sind, empfiehlt sich Conda zur Verwaltung der Python-Umgebung.

Prüfen Sie, ob Conda installiert ist und welche Version vorliegt. Ist Conda bereits installiert, können Sie diesen Schritt überspringen.

```text
conda -V
# Prompt conda: command not found means conda is not installed.
# Successful installation will display the version such as: conda X.X.X
# X.X.X means version number, such as 23.9.0.
```

Laden Sie das Conda-Installationspaket herunter:

```text
wget -c https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-x86_64.sh
```

Installieren Sie Conda:

```text
chmod 777 Miniforge3-Linux-x86_64.sh
bash Miniforge3-Linux-x86_64.sh
```

ARM64-Version:

Laden Sie das Conda-Installationspaket herunter:

```text
wget -c https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-aarch64.sh
```

Installieren Sie Conda:

```text
chmod 777 Miniforge3-Linux-aarch64.sh
bash Miniforge3-Linux-aarch64.sh
```

##### 1.2.1.2.3 Conda-Umgebung für RKNN-Toolkit2 erstellen

Aktivieren Sie die Conda-Basisumgebung:

```text
source ~/miniforge3/bin/activate # Miniforge install directory path
# (base) xxx@xxx-pc:~$
```

Erstellen Sie eine Conda-Umgebung namens RKNN-Toolkit2 mit der empfohlenen Python-Version 3.8:

```text
conda create -n RKNN-Toolkit2 python=3.8
```

Aktivieren Sie die Conda-Umgebung RKNN-Toolkit2:

```text
conda activate RKNN-Toolkit2
# (RKNN-Toolkit2) xxx@xxx-pc:~$
```

##### 1.2.1.2.4 RKNN-Toolkit2 installieren

Nach Aktivierung der Conda-Umgebung RKNN-Toolkit2 können Sie RKNN-Toolkit2 über die pip-Paketquelle oder ein lokales Wheel-Paket installieren: Installation über die pip-Paketquelle

```text
pip install rknn-toolkit2 -i https://pypi.org/simple

# If RKNN-Toolkit2 is already installed, you can upgrade it with the following command:
pip install rknn-toolkit2 -i https://pypi.org/simple --upgrade
```

Installation aus einem lokalen Wheel-Paket

```text
# Please choose the appropriate requirements file based on the Python version and processor architecture:
# where cpxx is the Python version
pip install -r /rknn-toolkit2/packages/x86_64/requirements_cpxx.txt
# pip install -r /rknn-toolkit2/packages/arm64/arm64_requirements_cpxx.txt

# Install RKNN-Toolkit2
# Please choose the appropriate wheel package file based on the Python version and processor architecture:
# where x.x.x is the RKNN-Toolkit2 version number, cpxx is the Python version
pip install /rknn-toolkit2/packages/x86_64/rknn_toolkit2-x.x.x-cpxx-cpxx-
manylinux_2_17_x86_64.manylinux2014_x86_64.whl
# pip install /rknn-toolkit2/packages/arm64/rknn_toolkit2-x.x.x-cpxx-cpxx-
manylinux_2_17_aarch64.manylinux2014_aarch64.whl
```

Wenn der folgende Befehl ohne Fehler ausgeführt wird, war die Installation erfolgreich.

```text
$ python
>>> from rknn.api import RKNN
```

### 1.2.2 NPU-Geräteumgebung einrichten

#### 1.2.2.1 NPU-Treiberversion prüfen

Abfragebefehle:

```text
dmesg | grep -i rknpu
# or
cat /sys/kernel/debug/rknpu/version
# or
cat /sys/kernel/debug/rknpu/driver_version
# or
cat /proc/debug/rknpu/driver_version
```

Abfrageergebnisse:

```text
RKNPU driver: vX.X.X
```

X.X.X steht für die Versionsnummer, beispielsweise 0.9.2.

In der Rockchip-Firmware ist der RKNPU-Treiber vorinstalliert. Wenn die obigen Befehle keine NPU-Treiberversion liefern, fehlt der Treiber möglicherweise in der Fremdfirmware. Aktivieren Sie CONFIG_ROCKCHIP_RKNPU=y in der Kernelkonfiguration, kompilieren Sie den Kerneltreiber neu und flashen Sie ihn. Empfohlen wird eine RKNPU-Treiberversion &gt;= 0.9.2.

#### 1.2.2.2 Verbindungsumgebung des NPU-Geräts prüfen

Für das Debuggen mit angeschlossener Platine benötigt RKNN-Toolkit2 den RKNN Server auf dem Gerät. Dieser Hintergrund-Proxy empfängt Befehle und Daten vom Computer über USB, führt die entsprechenden Schnittstellen aus und sendet Ergebnisse zurück. Prüfen Sie deshalb, ob der RKNN Server auf dem Gerät gestartet wurde.

Hinweis: ARM64 benötigt zum Debuggen keinen RKNN Server. Überspringen Sie diesen Schritt, wenn Sie RKNN Toolkit2 auf ARM64 verwenden.

Prüfen Sie, ob auf der Entwicklungsplatine ein RKNN-Server-Prozess läuft.

```text
adb shell
ps | grep rknn_server
```

Abfrageergebnisse:

```text
702 root 1192 S grep rknn_server
```

Wird eine Prozess-ID für RKNN Server angezeigt, läuft der Dienst ordnungsgemäß. Andernfalls starten Sie ihn mit folgendem Befehl manuell und wiederholen die Abfrage.

RKNN Server unter Android manuell starten:

```text
su
setenforce 0
nohup /vendor/bin/rknn_server >/dev/null&
```

RKNN Server unter Linux auf RK356X/RK3576/RK3588/RV1126B manuell starten:

```text
nohup /usr/bin/rknn_server >/dev/null&
```

RKNN Server unter Linux auf RV1103/RV1103B/RV1106/RV1106B manuell starten:

```text
nohup /oem/usr/bin/rknn_server >/dev/null&
```

Normalerweise ist RKNN Server in der Rockchip-Firmware integriert und startet automatisch beim Booten. Erfolgt kein automatischer Start oder fehlen die Dateien für den manuellen Start, installieren oder aktualisieren Sie RKNN Server manuell.

#### 1.2.2.3 RKNN Server installieren und aktualisieren

Für das Debugging eines angeschlossenen Boards benötigt RKNN-Toolkit2 eine installierte RKNPU2-Umgebung und einen gestarteten RKNN Server auf dem Board. Zwei grundlegende Begriffe:

1. RKNN Server: ein Hintergrund-Proxy auf dem Board. Er empfängt per USB Daten vom PC, führt die entsprechende Runtime-Schnittstelle auf dem Board aus und liefert die Ergebnisse zurück.

2 RKNPU2-Runtime-Bibliothek

librknnrt.so: Runtime-Bibliothek für RK3562 / RK3566 / RK3568 / RK3576 / RK3588 / RV1126B.

librknnmrt.so: Runtime-Bibliothek für RV1103 / RV1103B / RV1106 / RV1106B.

Fehlt RKNN Server oder die Runtime-Bibliothek beziehungsweise stimmen ihre Versionen nicht überein, müssen sie neu installiert oder aktualisiert werden.

Hinweis:

1. Für ein RKNN-Modell mit dynamischen Eingabedimensionen müssen RKNN Server und RKNPU2 Runtime Version &gt;= 1.5.0 haben.

2. Für Modelle über 2 GB ist rknn_server &gt;= 2.0.0b0 erforderlich.

3. Auf Plattformen mit wenig Speicher wie RV1103 / RV1103B / RV1106 / RV1106B wird rknn_server &gt;= 2.1.0 empfohlen.

4. RKNN Server, Runtime-Bibliothek und RKNN-Toolkit2 müssen übereinstimmende Versionen haben; die Quelle empfiehlt jeweils die neueste Version.

5. RKNN Server auf RK2118 dient nicht dem Board-Debugging mit RKNN-Toolkit2, sondern der Kommunikation zwischen DSP und MCU.

6. Die ARM64-Version benötigt keinen RKNN Server; Start oder Aktualisierung entfallen. Das Debugging hängt jedoch von der RKNPU2-Runtime-Bibliothek auf dem Board ab. Sie muss vorhanden und aktuell sein.

##### 1.2.2.3.1 Plattform RK356X/RK3576/RK3588/RV1126B

1 Android-System

Die Versionen von RKNN Server und librknnrt.so prüfen. Unterschiedliche Versionsnummern auf denselben Stand aktualisieren.

```text
# Query the rknn_server version
strings /vendor/bin/rknn_server | grep -i "rknn_server version"
# Display the rknn_server version as X.X.X
# rknn_server version: X.X.X

# Query the librknnrt.so library version
# 64-bit system
strings /vendor/lib64/librknnrt.so | grep -i "librknnrt version"
# 32-bit system
strings /vendor/lib/librknnrt.so | grep -i "librknnrt version"
# Display the librknnrt library version as X.X.X
# librknnrt version: X.X.X
```

RKNN Server und librknnrt.so aktualisieren.

```text
adb root
adb remount

# 64-bit system:
adb push runtime/Android/rknn_server/arm64/rknn_server /vendor/bin/
adb push runtime/Android/librknn_api/arm64-v8a/librknnrt.so /vendor/lib64

# 32-bit system:
adb push runtime/Android/rknn_server/arm/rknn_server /vendor/bin/
adb push runtime/Android/librknn_api/armeabi-v7a/librknnrt.so /vendor/lib

# Restart the RKNN Server:
adb shell
su
chmod +x /vendor/bin/rknn_server
nohup /vendor/bin/rknn_server >/dev/null&
sync
reboot
```

2 Linux-System

Die Versionen von RKNN Server und librknnrt.so prüfen und bei Abweichung auf denselben Stand aktualisieren.

```text
# Query the rknn_server version
strings /usr/bin/rknn_server | grep -i "rknn_server version"
# Display the rknn_server version as X.X.X
# rknn_server version: X.X.X

# Query the librknnrt.so library version
strings /usr/lib/librknnrt.so | grep -i "librknnrt version"
# Display the librknnrt library version as X.X.X
# librknnrt version: X.X.X
```

RKNN Server und librknnrt.so aktualisieren.

-Bit-System:

```text
adb push runtime/Linux/rknn_server/aarch64/usr/bin/* /usr/bin
adb push runtime/Linux/librknn_api/aarch64/librknnrt.so /usr/lib64
```

-Bit-System:

```text
adb push runtime/Linux/rknn_server/armhf/usr/bin/* /usr/bin
adb push runtime/Linux/librknn_api/armhf/librknnrt.so /usr/lib
```

Starten Sie RKNN Server neu:

```text
adb shell
chmod +x /usr/bin/rknn_server
nohup /usr/bin/rknn_server >/dev/null&
restart_rknn.sh
```

##### 1.2.2.3.2 Plattform RV1103/RV1103B/RV1106/RV1106B

Die Versionen von RKNN Server und librknnmrt.so prüfen und bei Abweichung auf denselben Stand aktualisieren.

```text
# Query the rknn_server version
strings /oem/usr/bin/rknn_server | grep -i "rknn_server version"
# Display the rknn_server version as X.X.X
# rknn_server version: X.X.X

# Query the librknnmrt.so library version
strings /oem/usr/lib/librknnmrt.so | grep -i "librknnmrt version"
# Display the librknnmrt library version as X.X.X
# librknnmrt version: X.X.X
```

RKNN Server und librknnmrt.so aktualisieren. RV1103 / RV1103B und RV1106 / RV1106B verwenden denselben RKNN Server und dieselbe librknnmrt.so.

```text
adb push runtime/Linux/rknn_server/armhf-uclibc/usr/bin/* /oem/usr/bin
adb push runtime/Linux/librknn_api/armhf-uclibc/librknnmrt.so /oem/usr/lib

# Restart the RKNN Server:
adb shell
chmod +x /oem/usr/bin/rknn_server
nohup /oem/usr/bin/rknn_server >/dev/null&
restart_rknn.sh
```

#### 1.2.2.4 Ausführliche RKNN-Server-Protokolle anzeigen

##### 1.2.2.4.1 Android-System

Öffnen Sie das Geräteterminal und legen Sie die Protokollstufe fest:

```text
adb shell
su
setenforce 0
setprop persist.vendor.rknn.server.log.level 5
```

Beenden Sie den aktuellen RKNN-Server-Dienstprozess:

```text
kill -9 `pgrep rknn_server`
```

Falls RKNN Server nicht automatisch neu startet, starten Sie ihn manuell und zeigen die ausführlichen Protokolle an:

```text
nohup /vendor/bin/rknn_server >/dev/null&
logcat
```

##### 1.2.2.4.2 Linux-System

Öffnen Sie das Geräteterminal und legen Sie die Protokollstufe fest:

```text
adb shell
export RKNN_SERVER_LOGLEVEL=5
```

Starten Sie RKNN Server neu, um ausführliche Protokolle anzuzeigen:

Führen Sie auf der Plattform RK356X / RK3576 / RK3588 / RV1126B folgenden Befehl aus:

```text
nohup /usr/bin/rknn_server >/dev/null&
```

Führen Sie auf der Plattform RV1103 / RV1103B / RV1106 / RV1106B folgende Befehle aus:

```text
nohup /oem/usr/bin/rknn_server >/dev/null&
```

### 1.2.3 Umgebung prüfen

Nach der Einrichtung empfiehlt sich folgende Prüfung aller Komponenten:

**1. Installation von RKNN-Toolkit2 prüfen**

```text
# Enter Python interactive mode and import the RKNN class
python
>>> from rknn.api import RKNN
# No error means the installation succeeded
```

**2. Geräteverbindung prüfen**

```text
# Query adb-connected devices on the PC
adb devices
# The connection is normal if device IDs are listed
```

Hinweis: Toolkit2 für ARM64 unterstützt adb nicht. Das Debugging erfolgt lokal auf dem Board; dieser Prüfschritt entfällt.

**3. Umgebung auf dem Board prüfen**

NPU-Treiberversion, Prozessstatus von RKNN Server und Runtime-Bibliothek prüfen. Prüf-, Installations- und Aktualisierungsschritte stehen in 1.2.2 zur Vorbereitung der geräteseitigen NPU-Umgebung.

**4. Komponentenversionen abfragen**

Zur Fehlerdiagnose lassen sich die Komponentenversionen wie folgt abfragen:

```text
# Query the RKNN-Toolkit2 version
pip list | grep rknn-toolkit2

# Query the on-board rknn_server version (paths subject to 1.2.2)
strings /usr/bin/rknn_server | grep -i "rknn_server version"

# Query the on-board Runtime library version (RK356X / RK3576 / RK3588 / RV1126B platforms, path subject to 1.2.2)
strings /usr/lib64/librknnrt.so | grep -i "librknnrt version"

# Query the on-board Runtime library version (RV1103 / RV1103B / RV1106 / RV1106B platforms)
strings /oem/usr/lib/librknnmrt.so | grep -i "librknnmrt version"
```

Hinweis: Die RKNN-Datei speichert die zur Konvertierung verwendete Toolkit2-Version. Bei fehlerhaftem Board-Betrieb diese mit der Runtime-Version auf dem Board vergleichen.

{% endraw %}
