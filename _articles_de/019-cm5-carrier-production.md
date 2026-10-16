---
title: "Carrier-Board-Design für ArmSoM CM5: Vom Raspberry-Pi-Prototyp zum Produkt"
description: "Eine Prüfliste für CM5-Carrier-Boards mit Signalqualität, Thermik, Stromversorgung und Revisionsverwaltung."
translation_key: "019-cm5-carrier-production"
slug: "cm5-carrier-production"
lang: de
date: 2026-10-14
author: "ArmSoM-Redaktion"
category: production
products: [CM5]
tags: [CM5, RK3576, carrier board, productization]
keywords: "ArmSoM CM5 carrier design, RK3576 productization"
---

# Carrier-Board-Design für ArmSoM CM5: Vom Raspberry-Pi-Prototyp zum Produkt

![Entwicklungspfad zum CM5-Produkt](../assets/019-cm5-production.svg)

CM5 ist ein 55 × 40 mm großes Rechenmodul mit RK3576. Es kann die Produktentwicklung verkürzen; das Carrier Board muss jedoch hinsichtlich Einschaltreihenfolge, Hochgeschwindigkeitsrouting, Steckerauswahl, Wärmeübertragung und Fertigungsprüfung sorgfältig ausgelegt werden.

## Reihenfolge der Inbetriebnahme

Beginnen Sie mit den Versorgungsspannungen und der seriellen Konsole. Fügen Sie Hochgeschwindigkeitsschnittstellen einzeln hinzu und prüfen Sie anschließend USB, PCIe, Kamera, Display und Ethernet unter Last. Versionieren Sie die Pintabelle. Übernehmen Sie einen Raspberry-Pi-Schaltplan nicht allein anhand übereinstimmender Signalnamen.

```bash
uname -a
cat /proc/device-tree/model
dmesg | grep -iE 'pcie|usb|dwc3|eth|drm'
```

ArmSoM weist auf ein Problem an Pin 21 des CM5 v1.2 hin, das in v1.3 behoben wurde. Legen Sie in der Produktionsdokumentation die Modulrevision fest und prüfen Sie das betroffene Netz.

## Anpassungsbedarf beim Austausch

Das Modul bietet die Rechenfunktionen des RK3576 sowie dokumentierte CSI-/PCIe-/USB-Ressourcen. Die tatsächlichen Anschlüsse und das elektrische Verhalten legt jedoch das eigene Carrier Board fest. Annahmen zu Jetson-Nano-Trägerplatinen, CUDA-Abhängigkeiten und Bootwerkzeugen lassen sich nicht direkt übertragen.

## Quellen

- [CM5-Produktvorstellung](https://docs.armsom.org/armsom-cm5)
- [CM5-IO-Erweiterungsplatine](https://docs.armsom.org/armsom-cm5-io)
- [RK3576-Übersicht](https://docs.armsom.org/blog/rk3576-sbc)

## Prüfung vor der Veröffentlichung

- [ ] Legen Sie Modulrevision und Pinbelegung verbindlich fest.
- [ ] Benennen Sie Verantwortliche für Signalqualität, thermische Prüfung und EMV-Validierung.
- [ ] Prüfen Sie Wiederherstellung und Programmierung in der Fertigung auf dem Carrier Board.
