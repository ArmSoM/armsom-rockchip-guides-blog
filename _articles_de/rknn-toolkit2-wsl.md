---
title: "RKNN-Toolkit2 in WSL: Installation, Board-Verbindung und Fehlerbehebung"
description: "Vollständige Anleitung zu WSL, Ethernet/USB-Verbindungen, adbkit und libGL.so.1 mit Originalbefehlen."
excerpt: "Vollständige Anleitung zu WSL, Ethernet/USB-Verbindungen, adbkit und libGL.so.1 mit Originalbefehlen."
translation_key: "rknn-toolkit2-wsl"
slug: "rknn-toolkit2-wsl"
lang: "de"
date: "2026-10-28"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: ["CM7S", "Sige7S", "Sige7", "AIM7", "LM7", "W3", "Sige5", "CM5", "AIM5", "Sige3", "CM3", "AIM3"]
tags: ["Rockchip", "RKNN", "Toolkit2", "Linux"]
---

Plattformreferenz zur Evaluierung auf ArmSoM CM7S/Sige7S (RK3588S), Sige7/AIM7/LM7/W3 (RK3588), Sige5/CM5/AIM5 (RK3576) und entsprechenden RK3568-Plattformen. Board-Betriebssystem, NPU-Treiber, SDK, Runtime und Toolkit2 müssen zusammenpassen. Eine konkrete BSP-/Kernel-Kombination und ArmSoM-Hardware wurden hier nicht getestet. Prüfaussagen der Quelle gelten nur für deren ursprüngliche Umgebung.

Quelle: chinesische und englische WSL-Markdown-Dateien im lokalen Repository, ohne eigene Versionsnummer und ohne Abbildungen. Befehle und Platzhalter bleiben erhalten; Russisch und Deutsch folgen der englischen Quelle. Die Zeilen „1.“ und „2.“ im letzten Codeblock sind Schrittbeschriftungen, keine Befehle. Verfügbarkeit des adbkit-Befehls nach der Installation und des Pakets libgl1-mesa-glx für das eigene System prüfen.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

{% raw %}

# RKNN-Toolkit2 in WSL

## 1. WSL auf dem Windows-Host installieren
Installationsanleitung für WSL: https://learn.microsoft.com/en-us/windows/wsl/install

## 2. RKNN-Toolkit2 in WSL verwenden
1. Die RKNN-Toolkit2-Umgebung in WSL nach [Rockchip_RKNPU_Quick_Start](https://github.com/airockchip/rknn-toolkit2/blob/master/doc/) installieren.
2. Modellkonvertierung, Quantisierung und weitere Schritte in WSL nach [Rockchip_RKNPU_User_Guide](https://github.com/airockchip/rknn-toolkit2/blob/master/doc/) ausführen.

## 3. Board-Debugging mit RKNN-Toolkit2 in WSL
### 3.1 adb im WSL-Terminal installieren

```
sudo apt update
sudo apt install adb
```

### 3.2 Gerät in WSL verbinden
Das Gerät kann über Ethernet oder USB verbunden werden.
#### 3.2.1 Ethernet-Verbindung

```
# 1. Connect the device using Ethernet cable.

# 2. In WSL, use adb connect to connect to the device.
adb connect <IP address:port>
```

`IP address` bezeichnet die IP-Adresse des Boards.
#### 3.2.2 USB-Verbindung

```
# 1. Connect the device to Windows via USB.

# 2. Use the adbkit tool in Windows to convert USB to TCP.
npm install --save adbkit
adbkit usb-device-to-tcp <device_id> -p <port>

# Note: Configure WSL to access Windows network.

# 3. In WSL, use adb connect to connect to the device.
adb connect <IP address:port>
```

- `device_id` lässt sich mit `adb devices` unter Windows ermitteln; adb muss dort installiert sein.
- `IP address` bezeichnet die IP-Adresse des Windows-Hosts.

### 3.3 RKNN-Toolkit2 für Board-Debugging verwenden
Für Board-Inferenz, Genauigkeitsanalyse und weitere Vorgänge aus WSL siehe [Rockchip_RKNPU_User_Guide](https://github.com/airockchip/rknn-toolkit2/blob/master/doc/).

## Hinweise
1. Die Quelle empfiehlt WSL2 mit Ubuntu 22.04 und berichtet, diese Kombination geprüft zu haben. Andere Versionen sind theoretisch möglich, wurden aber nicht getestet.
2. Bei `ImportError: libGL.so.1: cannot open shared object file: No such file or directory` empfiehlt die Quelle, die Bibliothek zu installieren und die Umgebungsvariable wie folgt zu setzen:

```
1. Install the required library:
sudo apt update
sudo apt install libgl1-mesa-glx

2. Set the environment variable:
echo 'export LD_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu/mesa' >> ~/.bashrc
source ~/.bashrc
```

{% endraw %}
