---
title: "RKNN-Fehlerbehebung: Verbindung, Speicher und Berechtigungen"
description: "RKNN-Fehlerbehebung: Verbindung, Speicher und Berechtigungen"
excerpt: "RKNN-Fehlerbehebung: Verbindung, Speicher und Berechtigungen"
translation_key: "rknn-server-troubleshooting"
slug: "rknn-server-troubleshooting"
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

Serie zum Board-Debugging · 3/3

[RKNN-Board-Proxy: Einrichtung, Bereitstellung und mini-runtime](/de/articles/rknn-server-proxy/)

[RKNN-Debugging: Protokolle aktivieren, prüfen und zurücksetzen](/de/articles/rknn-server-logging/)

**RKNN-Fehlerbehebung: Verbindung, Speicher und Berechtigungen**

</div>

{% raw %}

## 6. FAQ
### Problem 1
Unter Debian läuft rknn_server bereits im Hintergrund, aber die Board-Inferenz meldet weiterhin:

```
D NPUTransfer: ERROR: socket read fd = 4, n = -1: Connection reset by peer
D NPUTransfer: Transfer client closed, fd = 4
E RKNNAPI: rknn_init,  server connect fail!  ret = -9(ERROR_PIPE)!
E build_graph: The rknn_server on the concected device is abnormal, please start the rknn_server on the device according to:
               https://github.com/airockchip/rknn-toolkit2/blob/master/doc/rknn_server_proxy.md
```

**Lösung laut Quelle:** Meist lauscht adbd in der Debian-Firmware nicht auf Port 5037. Auf dem Board prüfen:

```
netstat -n -t -u -a
```

Fehlt Port 5037, adbd mit den folgenden Befehlen herunterladen und aktualisieren, danach das Board neu starten. Andernfalls diese Schritte überspringen.

```
wget -O adbd.zip https://ftzr.zbox.filez.com/v2/delivery/data/7f0ac30dfa474892841fcb2cd29ad924/adbd.zip
unzip adbd.zip
adb push adbd/linux-aarch64/adbd /usr/bin/adbd
```

Über die Geräte-Shell das Ausführungsrecht für adbd setzen:

```sh
adb shell "chmod +x /usr/bin/adbd"
adb reboot
```

Nach dem Neustart rknn_server gemäß Startanleitung starten und die Board-Inferenz erneut versuchen.
### Problem 2
Auf RV1103/RV1106/RV1103B tritt `E RKNN: failed to allocate fd, ret: -1, errno: 12` oder OOM auf.
**Lösung:** RkLunch-stop.sh auf dem Gerät ausführen, andere speicherbelegende Anwendungen stoppen und rknn_server auf >=2.1.0 aktualisieren. Danach die Board-Inferenz erneut versuchen.
### Problem 3
Die Python-Schnittstelle init_runtime liefert auf RV1103/RV1106/RV1103B keine Laufzeiten je Schicht.
Grund: Diese Plattformen **unterstützen perf_debug=True nicht**.
### Problem 4
Auf RV1103/RV1106/RV1103B scheitert accuracy_analysis, weil das Modell für den freien Board-Speicher zu groß ist.
**Lösung:** Den Speicher auf dem Gerät mit df -h prüfen. Beispielausgabe:

```sh
Filesystem                Size      Used Available Use% Mounted on
ubi0:rootfs              17.0M     14.1M      2.9M  83% /
devtmpfs                 27.4M         0     27.4M   0% /dev
tmpfs                    27.5M         0     27.5M   0% /dev/shm
tmpfs                    27.5M      8.0K     27.5M   0% /tmp
tmpfs                    27.5M     84.0K     27.4M   0% /run
/dev/ubi5_0              20.6M     14.5M      6.1M  70% /oem
/dev/ubi6_0              52.8M     24.5M     28.2M  46% /userdata

```

Im Beispiel hat /userdata/ den meisten freien Platz. Dieses Verzeichnis für Zwischenergebnisse der Genauigkeitsanalyse verwenden und rknn_server neu starten. Auf dem PC ausführen:

```
adb shell "killall rknn_server"
adb shell "export RKNN_DUMP_DIR=/userdata/dumps && nohup /usr/bin/rknn_server >/dev/null"&
```

Auf RV1103/RV1106/RV1103B werden Zwischenergebnisse standardmäßig in /tmp/dumps gespeichert. Standardpfad wiederherstellen:

```
adb shell "killall rknn_server"
adb shell "unset RKNN_DUMP_DIR && nohup /usr/bin/rknn_server >/dev/null"&
```

Reicht der Gerätespeicher nicht aus und unterstützt die RV1103/RV1106/RV1103B-Firmware NFS, das Dump-Verzeichnis vor der Genauigkeitsanalyse über NFS einhängen. Für Server-IP 192.168.1.1 und Serververzeichnis /data0/nfs_shared auf dem Gerät unter /userdata/dumps einhängen:

```
# 以241为例
mkdir -p /userdata/dumps
mount -t nfs -o nolock 192.168.1.1:/data0/nfs_shared /userdata/dumps
```

### Problem 5
Eine Aktualisierung der Runtime-Bibliothek über adb bleibt wirkungslos.
**Lösung:** rknn_server nach dem Bibliotheksupdate neu starten; die nächste Board-Inferenz verwendet dann das Update. Auf RV1103/RV1106/RV1103B muss librknnmrt.so in /oem/usr/lib liegen. Existiert eine gleichnamige Bibliothek in /usr/lib/, schreibt die Quelle vor, /usr/lib/librknnmrt.so zu entfernen und rknn_server neu zu starten.
### Problem 6
Beim Start des Proxy-Dienstes unter Android treten Berechtigungsprobleme auf.
**Lösung laut Quelle:** `adb shell setenforce 0` deaktiviert die Durchsetzung von SELinux.

{% endraw %}
