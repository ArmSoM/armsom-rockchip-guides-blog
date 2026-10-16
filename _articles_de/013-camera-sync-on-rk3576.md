---
title: "Mehrere Kameras auf RK3576 synchronisieren: CSI-Bandbreite vor KI-Leistung prüfen"
description: "Ein praxisnahes Verfahren zur Kamerainbetriebnahme auf ArmSoM Sige5 und CM5, das CSI-Verdrahtung, V4L2-Zeitstempel und Modelldurchsatz getrennt betrachtet."
translation_key: "013-camera-sync-on-rk3576"
slug: "camera-sync-on-rk3576"
lang: de
date: 2026-10-14
author: "ArmSoM-Redaktion"
category: camera
products: [Sige5, CM5]
tags: [RK3576, CSI, V4L2, Sige5, CM5]
keywords: "RK3576 CSI camera, ArmSoM Sige5 camera, CM5 V4L2"
---

# Mehrere Kameras auf RK3576 synchronisieren: CSI-Bandbreite vor KI-Leistung prüfen

![Pipeline zur Synchronisierung von CSI-Kameras](../assets/013-camera-sync.svg)

Für ArmSoM Sige5 sind zwei MIPI-CSI-Eingänge mit jeweils vier Lanes angegeben; CM5 bietet einen Eingang mit vier und einen mit zwei Lanes. Diese Schnittstellenangaben garantieren weder die Synchronisierung beliebiger Sensoren noch den dauerhaften Betrieb einer KI-Pipeline mit voller Bildrate.

## Ablauf der Inbetriebnahme

Beginnen Sie mit einem Sensor und dem dokumentierten Device-Tree-Endpunkt. Prüfen Sie Medientopologie, Pixelformat und Zeitstempel, bevor Sie den zweiten Sensor hinzufügen.

```bash
v4l2-ctl --list-devices
media-ctl -p
v4l2-ctl -d /dev/video0 --stream-mmap --stream-count=300 \
  --stream-to=/tmp/capture.raw --verbose
```

Messen Sie verlorene Frames und Zeitstempeldifferenzen. Wenn zwei Sensoren Hardware-Synchronisierung benötigen, berücksichtigen Sie Trigger- und Taktanforderungen auf dem Carrier Board. Eine softwareseitige Zeitstempelausrichtung entspricht keiner gemeinsamen Belichtungsflanke.

## Unterschiede zu Raspberry Pi und Jetson Nano

Kamerabibliotheken, ISP-Abstimmungsdateien und GStreamer-Elemente sind plattformspezifisch. Eine Raspberry-Pi-libcamera-Pipeline oder Jetson-Argus-Anwendung läuft auf RK3576 erst nach entsprechender Anpassung. Planen Sie die V4L2-/Media-Controller-Konfiguration, Rockchip-ISP-Unterstützung und einen Synchronisierungstest auf Anwendungsebene ein.

## Quellen

- [Sige5-Hardwarespezifikation](https://docs.armsom.org/armsom-sige5)
- [CM5-Hardwarespezifikation](https://docs.armsom.org/armsom-cm5)
- [ArmSoM-Kameraressourcen](https://docs.armsom.org/)

## Prüfung vor der Veröffentlichung

- [ ] Dokumentieren Sie Sensormodus, Lane-Anzahl, Verbindungsfrequenz und Pixelformat.
- [ ] Fügen Sie Nachweise zu Zeitstempeln und verlorenen Frames bei.
- [ ] Geben Sie den KI-Durchsatz mehrerer Kameras nur für eine tatsächlich gemessene Arbeitslast an.
