---
title: "ArmSoM-Migrationsbewertung: Sige5, Sige7, CM5 und Forge1"
description: "Eine an Anforderungen ausgerichtete Bewertung zum Ersatz von Raspberry Pi oder Jetson Nano mit Schnittstellen, Leistung, Softwaremigration und thermischem Aufwand."
translation_key: "021-migration-scorecard-armsom"
slug: "migration-scorecard-armsom"
lang: de
date: 2026-10-14
author: "ArmSoM-Redaktion"
category: migration
products: [Sige5, Sige7, CM5, Forge1]
tags: [migration, Sige5, Sige7, CM5, Forge1, Jetson Nano, Raspberry Pi]
keywords: "ArmSoM Raspberry Pi alternative, Jetson Nano alternative, board selection"
---

# ArmSoM-Migrationsbewertung: Sige5, Sige7, CM5 und Forge1

![Bewertungsschema für die ArmSoM-Migration](../assets/021-migration-cost.svg)

Der beste Ersatz minimiert das gesamte Entwicklungsrisiko. Beginnen Sie mit Schnittstellen und Software und verwenden Sie CPU-/GPU-/NPU-Kennzahlen anschließend als Randbedingungen. Die tatsächliche Anwendungsleistung muss gemessen werden.

## Vier Plattformprofile

- **Sige5 / RK3576:** vollständiger Einplatinencomputer, zweimal Gigabit Ethernet, INT8-NPU mit 6 TOPS, Medienfunktionen der 4K-Klasse, Eingang 5–23 V.
- **Sige7 / RK3588:** größere CPU-/Medienreserven, bis zu 32 GB Arbeitsspeicher, Codec-Funktionen der 8K-Klasse, höhere Anforderungen an die thermische Validierung.
- **CM5 / RK3576:** 55 × 40 mm großes Modul für ein eigenes Carrier Board; dessen Entwicklung wird zum wesentlichen Risikofaktor.
- **Forge1 / RK3506J:** industrielle Steuerung und HMI, 512 MB DDR3L, zweimal 100-Mbit/s-Ethernet, RS485/CAN, -40 °C bis 85 °C.

Verwenden Sie dieses Bewertungsschema vor der Bestellung von Seriengeräten:

```text
interface fit = connectors + voltage + timing + driver evidence
software delta = BSP + device tree + AI runtime + update/recovery
field cost = thermal + EMC + test fixtures + service plan
```

Raspberry-Pi-Zubehör kann den mechanischen Aufwand verringern; BCM-Nummerierung und libcamera-Annahmen müssen dennoch angepasst werden. Jetson-CUDA-/TensorRT-Anwendungen erfordern eine geplante Migration zu Rockchip/RKNN und eine erneute Prüfung von Genauigkeit und Latenz.

## Quellen

- [Sige5](https://docs.armsom.org/armsom-sige5)
- [Sige7](https://docs.armsom.org/armsom-sige7)
- [CM5](https://docs.armsom.org/armsom-cm5)
- [Forge1](https://docs.armsom.org/zh/armsom-forge1)

## Prüfung vor der Veröffentlichung

- [ ] Füllen Sie das Bewertungsschema mit Messnachweisen zu Schnittstellen und Arbeitslasten aus.
- [ ] Kalkulieren Sie neben Stücklistenkosten auch Softwaremigration und Wiederherstellung im Feldeinsatz.
- [ ] Unterscheiden Sie die Aussagen „kompatibel“, „portierbar“ und „ohne Anpassung austauschbar“.
