---
title: "Stromversorgung für ArmSoM Sige5 und Sige7 dimensionieren"
description: "Ein wiederholbares Verfahren zur Prüfung von Eingangsspannung, Spitzenstrom, Kühlung und Kabelspannungsabfall beim Umstieg von Raspberry Pi oder Jetson Nano."
translation_key: "014-power-budget-sige5-sige7"
slug: "power-budget-sige5-sige7"
lang: de
date: 2026-10-14
author: "ArmSoM-Redaktion"
category: power
products: [Sige5, Sige7, CM5]
tags: [power, thermal, Sige5, Sige7, RK3576, RK3588]
keywords: "ArmSoM power consumption, Sige5 power, Sige7 thermal"
---

# Stromversorgung für ArmSoM Sige5 und Sige7 dimensionieren

![Prüfablauf für die Stromversorgung](../assets/014-power-budget.svg)

ArmSoM dokumentiert für Sige5 und Sige7 einen Eingangsspannungsbereich von 5–23 V; das CM5-Modul verwendet eine 5-V-Versorgung. Diese Angabe beschreibt den zulässigen Eingang, nicht die Stromspitzen von SSD, Kamera, USB-Gerät oder Lüfter.

## Das vollständige System messen

Verwenden Sie ein eingeschleiftes Messgerät oder ein Oszilloskop am Boardanschluss. Prüfen Sie Kaltstart, CPU- und NPU-Last, Display, Netzwerkverkehr und Speicher auch in Kombination. Protokollieren Sie die Spannung direkt am Board und zusätzlich am Netzteil.

```bash
for z in /sys/class/thermal/thermal_zone*/temp; do
  printf '%s ' "$z"; cat "$z"; done
cat /sys/devices/system/cpu/cpufreq/policy*/scaling_cur_freq
```

Wählen Sie ein Netzteil mit Reserven für Kabelwiderstand und kurzzeitige Lastspitzen. Eine am Prüfstand funktionierende PD-Aushandlung kann mit einem langen Kabel oder beim gleichzeitigen Start eines Gehäuselüfters scheitern.

## Grenzen bei der Migration

Annahmen zur Stromversorgung von Raspberry-Pi-HATs oder zum Hohlstecker des Jetson Nano lassen sich nicht auf ArmSoM-Anschlüsse übertragen. Prüfen Sie Anschlussbelegung, PD-Profil, thermische Anbindung und Gehäuseluftstrom als eigenständige Entwurfsanforderungen.

## Quellen

- [Sige5-Dokumentation](https://docs.armsom.org/armsom-sige5)
- [Sige7-Dokumentation](https://docs.armsom.org/armsom-sige7)
- [Hinweise zur Stromversorgung der Sige-Familie](https://docs.armsom.org/sige-family-started)

## Prüfung vor der Veröffentlichung

- [ ] Geben Sie Netzteil, Kabel, Peripherielast und Umgebungsbedingungen an.
- [ ] Testen Sie die ungünstigste Kombination der vorgesehenen Arbeitslasten.
- [ ] Leiten Sie aus dem Eingangsspannungsbereich keine Aussage zum Stromverbrauch ab.
