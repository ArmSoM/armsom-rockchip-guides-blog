---
title: "RKNN-Debugging: Protokolle aktivieren, prüfen und zurücksetzen"
description: "RKNN-Debugging: Protokolle aktivieren, prüfen und zurücksetzen"
excerpt: "RKNN-Debugging: Protokolle aktivieren, prüfen und zurücksetzen"
translation_key: "rknn-server-logging"
slug: "rknn-server-logging"
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

Serie zum Board-Debugging · 2/3

[RKNN-Board-Proxy: Einrichtung, Bereitstellung und mini-runtime](/de/articles/rknn-server-proxy/)

**RKNN-Debugging: Protokolle aktivieren, prüfen und zurücksetzen**

[RKNN-Fehlerbehebung: Verbindung, Speicher und Berechtigungen](/de/articles/rknn-server-troubleshooting/)

</div>

{% raw %}

## 5. Ausführliche rknn_server-Protokolle
Ausführliche Protokollierung ist standardmäßig deaktiviert. Zur Diagnose von Verbindungsfehlern das Verfahren für die eigene Plattform verwenden.
### 5.1 Android
1. Ausführliche Protokollierung konfigurieren und Proxy starten:

```
adb logcat -c
adb shell "killall rknn_server"
adb shell "setprop persist.vendor.rknn.server.log.level 5 && nohup /vendor/bin/rknn_server >/dev/null"&
```

2. Erfolgreichen Start des Proxy-Dienstes prüfen.

```
adb shell ps -ef|grep rknn_server
```

3. Python-Inferenzprogramm auf dem PC ausführen.
4. Laufzeitprotokoll anzeigen.

```
adb logcat
```

5. Ausführliche Protokollierung verlangsamt die Inferenz. Standardstufe wiederherstellen:

```sh
adb shell "killall rknn_server"
adb shell "setprop persist.vendor.rknn.server.log.level 0 && nohup /vendor/bin/rknn_server >/dev/null"&
```

### 5.2 Linux (außer RV1103/RV1106/RV1103B)
1. Verzeichnis für ausführliche Proxy-Protokolle anlegen.

```
adb shell mkdir -p /userdata
```

2. Logging-Umgebung setzen und Proxy mit ausführlicher Protokollierung starten.

```
adb shell "killall rknn_server"
adb shell "export RKNN_SERVER_LOGLEVEL=5 && nohup /usr/bin/rknn_server >/userdata/server.log"&
```

3. Erfolgreichen Start des Proxy-Dienstes prüfen.

```
adb shell ps -ef|grep rknn_server
```

Prüfen, ob eine Prozess-ID für `rknn_server` vorhanden ist. Sie zeigt den erfolgreichen Start an. Andernfalls mit `adb shell` die Board-Shell öffnen und den Dienst wie folgt manuell starten.

```
export RKNN_SERVER_LOGLEVEL=5
nohup /usr/bin/rknn_server >/userdata/server.log&
exit
```

4. Python-Inferenzprogramm auf dem PC ausführen.
5. Protokoll anzeigen.

```
adb shell cat /userdata/server.log
```

6. Ausführliche Protokollierung verlangsamt die Inferenz. Standardstufe wiederherstellen:

```sh
   adb shell "killall rknn_server"
   adb shell "export RKNN_SERVER_LOGLEVEL=0 && nohup /usr/bin/rknn_server >/userdata/server.log"&
```

### 5.3 Linux (RV1103/RV1106/RV1103B)
1. Verzeichnis für ausführliche Proxy-Protokolle anlegen.

```
adb shell mkdir -p /userdata
```

2. Logging-Umgebung setzen und Proxy mit ausführlicher Protokollierung starten.

```
adb shell "killall rknn_server"
adb shell "export RKNN_SERVER_LOGLEVEL=5 && nohup  /oem/usr/bin/rknn_server >/userdata/server.log"&
```

3. Erfolgreichen Start des Proxy-Dienstes prüfen.

```
adb shell ps|grep rknn_server
```

Prüfen, ob eine Prozess-ID für `rknn_server` vorhanden ist. Sie zeigt den erfolgreichen Start an. Andernfalls mit `adb shell` die Board-Shell öffnen und den Dienst wie folgt manuell starten.

```
export RKNN_SERVER_LOGLEVEL=5
nohup /oem/usr/bin/rknn_server >/userdata/server.log&
exit
```

4. Python-Inferenzprogramm auf dem PC ausführen.
5. Protokoll anzeigen.

```
adb shell cat /userdata/server.log
```

6. Ausführliche Protokollierung verlangsamt die Inferenz. Standardstufe wiederherstellen:

```sh
adb shell "killall rknn_server"
adb shell "export RKNN_SERVER_LOGLEVEL=0 && nohup  /oem/usr/bin/rknn_server >/userdata/server.log"&
```

{% endraw %}
