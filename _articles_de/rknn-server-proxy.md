---
title: "RKNN-Board-Proxy: Einrichtung, Bereitstellung und mini-runtime"
description: "RKNN-Board-Proxy: Einrichtung, Bereitstellung und mini-runtime"
excerpt: "RKNN-Board-Proxy: Einrichtung, Bereitstellung und mini-runtime"
translation_key: "rknn-server-proxy"
slug: "rknn-server-proxy"
lang: "de"
date: "2026-10-28"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: ["CM7S", "Sige7S", "Sige7", "AIM7", "LM7", "W3", "Sige5", "CM5", "AIM5", "Sige3", "CM3", "AIM3"]
tags: ["Rockchip", "RKNN", "Toolkit2", "Linux"]
---

Plattformreferenz zur Evaluierung auf ArmSoM CM7S/Sige7S (RK3588S), Sige7/AIM7/LM7/W3 (RK3588), Sige5/CM5/AIM5 (RK3576) und entsprechenden RK3568-Plattformen. Board-Betriebssystem, NPU-Treiber, SDK, Runtime und Toolkit2 müssen zusammenpassen. Eine konkrete BSP-/Kernel-Kombination und ArmSoM-Hardware wurden hier nicht getestet. Prüfaussagen der Quelle gelten nur für deren ursprüngliche Umgebung.

Quelle ist die lokale chinesische Datei rknn_server_proxy.md; kein englisches Original und keine Abbildungen vorhanden. Englisch, Russisch und Deutsch sind vollständige Übersetzungen. Abschnitt 1 widerspricht Abschnitt 4 bei der Zuordnung von librknnrt.so. FAQ 4 verwendet /usr/bin, Abschnitt 4.3 dagegen /oem/usr/bin; tatsächlichen Installationspfad prüfen. Überschriftenebene 4.4 und fehlerhafte Codeblock-Markierung beim Dump-Reset wurden korrigiert, Befehle blieben unverändert. Runtime/adbd-Austausch, Dienststopps, Neustart und deaktivierte SELinux-Durchsetzung sind in einer isolierten Entwicklungsumgebung zu prüfen, nicht als Produktionskonfiguration zu übernehmen.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip source](https://github.com/airockchip/rknn-toolkit2/blob/master/doc/CN/rknn_server_proxy.md)


<div class="series-navigation" aria-label="Serie zum Board-Debugging" markdown="1">

Serie zum Board-Debugging · 1/3

**RKNN-Board-Proxy: Einrichtung, Bereitstellung und mini-runtime**

[RKNN-Debugging: Protokolle aktivieren, prüfen und zurücksetzen](/de/articles/rknn-server-logging/)

[RKNN-Fehlerbehebung: Verbindung, Speicher und Berechtigungen](/de/articles/rknn-server-troubleshooting/)

</div>

{% raw %}

## 1. Einführung in das Board-Debugging
Für Board-Debugging mit RKNN Toolkit2 müssen normalerweise rknn_server und librknnrt.so/librknnmrt.so auf dem Board aktualisiert und rknn_server manuell gestartet werden.
Der Hintergrunddienst rknn_server empfängt das vom PC über USB gesendete Protokoll, ruft die entsprechenden Runtime-Schnittstellen auf dem Board auf und sendet Ergebnisse an den PC zurück.

- librknnrt.so: RKNPU-Runtime-Bibliothek auf dem Board. Die chinesische Quelle sagt wörtlich „nicht für Plattformen außer RV1103/RV1106/RV1103B geeignet“; dies widerspricht den späteren Installationsschritten. Der Widerspruch bleibt zur Prüfung am tatsächlichen SDK dokumentiert.
- librknnmrt.so: RKNPU-Runtime-Bibliothek speziell für RV1103/RV1106/RV1103B/RV1126B.

Nach dem Booten mit ps prüfen, ob rknn_server bereits läuft. Falls ja, ist kein manueller Start nötig; andernfalls manuell starten.

## 2. Anforderungen
### 2.1 Hardware
Die Quelle behandelt RV1103, RV1103B, RV1106, RV1126B, RK3562 sowie die Familien RK3566, RK3568, RK3576 und RK3588.

### 2.2 Software
- RKNN-Modelle mit dynamischen Eingabeformen benötigen rknn_server und RKNPU Runtime >=1.5.0.
- Modelle über 2GB benötigen rknn_server >=2.0.0b0.
- Für Plattformen mit wenig Speicher wie RV1103/RV1106/RV1103B wird rknn_server >=2.1.0 empfohlen.

## 3. Speicherorte von rknn_server
rknn_server liegt unter runtime. Die zur Board-OS und zum Chip passende Version auswählen.
### 3.1 Android

| System | Pfad |
| --- | --- |
| 32-bit Android | runtime/Android/rknn_server/arm/rknn_server |
| 64-bit Android | runtime/Android/rknn_server/arm64/rknn_server |

### 3.2 Linux

| Chip | System | Pfad |
| --- | --- | --- |
| RV1103/RV1106/RV1103B | 32-bit Linux | runtime/Linux/rknn_server/armhf-uclibc/usr/bin/rknn_server |
| Andere Chips | 32-bit Linux | runtime/Linux/rknn_server/armhf/usr/bin/rknn_server |
| Andere Chips | 64-bit Linux | runtime/Linux/rknn_server/aarch64/usr/bin/rknn_server |

## 4. Start
### 4.1 Android
Im Stammverzeichnis des rknpu2-Projekts die folgenden Befehle auf dem PC ausführen.
1. Die Systempartition erneut mit Schreibzugriff einhängen.

```
adb root && adb remount
```

2. Proxy-Programm aktualisieren.

```
// 64-bit Android系统
adb push runtime/Android/rknn_server/arm64/rknn_server /vendor/bin/
// 32-bit Android系统
adb push runtime/Android/rknn_server/arm/rknn_server /vendor/bin/
```

3. RKNPU-Runtime-Bibliothek aktualisieren.

```
// 64-bit Android系统
adb push runtime/Android/librknn_api/arm64-v8a/librknnrt.so /vendor/lib64
// 32-bit Android系统
adb push runtime/Android/librknn_api/armeabi-v7a/librknnrt.so /vendor/lib
```

4. Ausführungsrechte des Proxy-Programms anpassen.

```
adb shell chmod +x /vendor/bin/rknn_server
```

5. Proxy-Dienst starten.

```
adb shell "killall rknn_server"
adb shell "nohup /vendor/bin/rknn_server >/dev/null"&
```

6. Erfolgreichen Start des Proxy-Dienstes prüfen.

```
adb shell ps -ef|grep rknn_server
```

Prüfen, ob eine Prozess-ID für `rknn_server` vorhanden ist. Sie zeigt den erfolgreichen Start an. Andernfalls mit `adb shell` die Board-Shell öffnen und den Dienst wie folgt manuell starten.

```
nohup /vendor/bin/rknn_server > /dev/null&
```

### 4.2 Linux, außer RV1103/RV1106/RV1103B
1. Proxy-Programm aktualisieren.

```
// 64-bit Linux系统
adb push runtime/Linux/rknn_server/aarch64/usr/bin/rknn_server /usr/bin/
// 32-bit Linux系统
adb push runtime/Linux/rknn_server/armhf/usr/bin/rknn_server /usr/bin/
```

2. RKNPU-Runtime-Bibliothek aktualisieren.

```
// 64-bit Linux系统
adb push runtime/Linux/librknn_api/aarch64/librknnrt.so /usr/lib
// 32-bit Linux系统
adb push runtime/Linux/librknn_api/armhf/librknnrt.so /usr/lib
```

3. Ausführungsrechte des Proxy-Programms anpassen.

```
adb shell chmod +x /usr/bin/rknn_server
```

4. Proxy-Dienst starten.

```
adb shell "killall rknn_server"
adb shell "nohup /usr/bin/rknn_server >/dev/null"&
```

5. Erfolgreichen Start des Proxy-Dienstes prüfen.

```
adb shell ps -ef|grep rknn_server
```

Prüfen, ob eine Prozess-ID für `rknn_server` vorhanden ist. Sie zeigt den erfolgreichen Start an. Andernfalls mit `adb shell` die Board-Shell öffnen und den Dienst wie folgt manuell starten.

```
nohup /usr/bin/rknn_server > /dev/null&
```

### 4.3 Linux auf RV1103/RV1106/RV1103B
Diese Plattformen verwenden librknnmrt.so und rknn_server aus armhf-uclibc.
1. Proxy-Programm aktualisieren.

```
adb push runtime/Linux/rknn_server/armhf-uclibc/usr/bin/rknn_server /oem/usr/bin
```

2. RKNPU-Runtime-Bibliothek aktualisieren.

```
adb push runtime/Linux/librknn_api/armhf-uclibc/librknnmrt.so /oem/usr/lib
```

3. Ausführungsrechte des Proxy-Programms anpassen.

```
adb shell chmod +x /oem/usr/bin/rknn_server
```

4. Proxy-Dienst starten.

```
adb shell "killall rknn_server"
adb shell "nohup /oem/usr/bin/rknn_server >/dev/null"&
```

5. Erfolgreichen Start des Proxy-Dienstes prüfen.

```
adb shell ps |grep rknn_server
```

Prüfen, ob eine Prozess-ID für `rknn_server` vorhanden ist. Sie zeigt den erfolgreichen Start an. Andernfalls mit `adb shell` die Board-Shell öffnen und den Dienst wie folgt manuell starten.

```
nohup /oem/usr/bin/rknn_server > /dev/null&
```

### 4.4 mini-runtime verwenden
Die Quelle sieht mini-runtime auch für RV1126B vor. Dafür beim Konvertieren des Modells mini-rknn in rknn-toolkit2 aktivieren:

```python
rknn.config(target_platform=_target_platform, mini_rknn=True)
```

librknnmrt.so auf das Board übertragen:

```shell
// 64-bit Linux系统
adb push runtime/Linux/librknn_api/aarch64/librknnmrt.so /oem/usr/lib
// 32-bit Linux系统
adb push runtime/Linux/librknn_api/armhf/librknnmrt.so /oem/usr/lib
```

Den passenden rknn_server wie oben übertragen und starten, um Board-Debugging zu ermöglichen. Bei Verbindungsfehlern adbd aktualisieren; siehe FAQ.

{% endraw %}
