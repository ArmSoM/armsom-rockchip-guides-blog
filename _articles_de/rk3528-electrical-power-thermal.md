---
title: "RK3528: Versorgung, I/O und Wärmewiderstand"
description: "Grenzwerte von Betriebsbedingungen trennen; TBD und Prüfbedingungen für Versorgung, USB, PLL und Thermik bleiben erhalten."
excerpt: "Grenzwerte von Betriebsbedingungen trennen; TBD und Prüfbedingungen für Versorgung, USB, PLL und Thermik bleiben erhalten."
translation_key: "rk3528-electrical-power-thermal"
slug: "rk3528-electrical-power-thermal"
lang: "de"
date: "2026-11-10"
author: "ArmSoM Editorial"
category: "production"
products: ["Sige1"]
tags: ["RK3528", "datasheet", "hardware design", "ArmSoM"]
image: "/assets/datasheet-series-20261110/rk3528-datasheet-p14.png"
---

Dieser Artikel basiert auf der angegebenen Datenblattrevision. Die Werte sind Herstellerspezifikationen und keine ArmSoM-Messungen; neue Hardwaretests wurden nicht durchgeführt. Prüfen Sie Siliziumrevision, Schaltplan, SDK/BSP, Kernel und Treiber. Erläuterungen und editierbare Tabellen helfen beim Lesen; die vollständige Spezifikation und hier nicht vertiefte Bitdefinitionen stehen im Original-PDF.

**RK3528 · Rockchip RK3528 Datasheet V1.0-20230522.pdf · PDF 23–28.**


[![RK3528: Versorgung, I/O und Wärmewiderstand](/assets/datasheet-series-20261110/rk3528-datasheet-p14.png)](/assets/datasheet-series-20261110/rk3528-datasheet-p14.png)

*Englische Originalabbildung, PDF S. 14.*


## Grenzwerte und Betriebspunkte

Absolute Maxima sind keine Reglersollwerte. Min/Typ/Max ersetzen weder Sequenzierung noch Transientenanalyse oder Spannungs-/Frequenztabellen. Messen Sie am Chip bei Start, Leerlauf und Lastwechseln, nicht nur am Regler.

## Empfohlene Versorgung und Takte


### PDF 23


| Versorgung / Takt | Min | Typ | Max | Einheit |
|---|---|---|---|---|
| CPU_DVDD | 0.81 | 0.90 | TBD | V |
| GPU_DVDD | 0.81 | 0.90 | TBD | V |
| LOGIC_DVDD | 0.81 | 0.90 | 0.99 | V |
| PMU_LOGIC_DVDD | 0.81 | 0.90 | 0.99 | V |
| PMU_PLL_AVDD1V8<br>DDR_PLL_AVDD1V8 | 1.62 | 1.8 | TBD | V |
| VCCIOi(i=0~4) | 1.62<br>3.0 | 1.8<br>3.3 | 1.98<br>3.465 | V |
| PMUIO_VCC3V3 | 3.0 | 3.3 | 3.465 | V |
| HDMI_TX_AVDD1V8 | 1.62 | 1.8 | 1.98 | V |
| USB20_AVDD1V8 | 1.62 | 1.8 | 1.98 | V |
| USB20_AVDD3V3 | 3.0 | 3.3 | 3.6 | V |
| FEPHY_AVDD1V8 | 1.62 | 1.8 | 1.98 | V |
| FEPHY_AVDD3V3 | 2.97 | 3.3 | 3.63 | V |
| OTP_VCC1V8 | 1.62 | 1.8 | 1.98 | V |
| VDAC_AVDD1V8 | 1.62 | 1.8 | 1.98 | V |
| ACODEC_AVDD1V8 | 1.62 | 1.8 | 1.98 | V |


### PDF 24


| Versorgung / Takt | Min | Typ | Max | Einheit |
|---|---|---|---|---|
| PCIE20_USB30_AVDD1V8 | 1.62 | 1.8 | 1.98 | V |
| SARADC_AVDD1V8 | 1.62 | 1.8 | 1.98 | V |
| DDR3 / DDR_VDDQ | 1.425 | 1.5 | 1.575 | V |
| DDR3L / DDR_VDDQ | 1.283 | 1.35 | 1.417 | V |
| LPDDR3 / DDR_VDDQ | 1.14 | 1.2 | 1.3 | V |
| DDR4 / DDR_VDDQ | 1.14 | 1.2 | 1.3 | V |
| LPDDR4 / DDR_VDDQ | 1.06 | 1.1 | 1.17 | V |
| LPDDR4X / DDR_VDDQL | 0.54 | 0.6 | 0.66 | V |
| CPU | NA | NA | TBD | GHz |
| GPU | NA | NA | TBD | MHz |
| TA | 0 | NA | 80 | ℃ |



## GPIO-Pegel und interne Widerstände



| Merkmal | Spezifikation / Quellenhinweis |
|---|---|
| 3.3 V I/O: VIL | −0.3…0.8 V |
| 3.3 V I/O: VIH | 2.0…VDDO+0.3 V |
| 3.3 V I/O: VOL | −0.3…0.4 V |
| 3.3 V I/O: VOH | 2.4…VDDO+0.3 V |
| 1.8 V I/O: VIL max | 0.35 × VDDO |
| 1.8 V I/O: VIH min | 0.65 × VDDO |
| 1.8 V I/O: VOH min | 1.4 V |
| Interne Pulls | 16 / 26 / 43 kΩ (Min/Typ/Max) |



## PLL- und USB-Parameter



| Merkmal | Spezifikation / Quellenhinweis |
|---|---|
| PLL integer: Fin / Fvco / Fout | 10–800 / 475–1900 / 9–1900 MHz |
| PLL integer: lock | 1000 typ / 1500 max input-clock cycles |
| PLL fractional: Fin / Fvco / Fout | 1–1200 / 950–3800 / 19–3800 MHz |
| PLL fractional: lock | 250 typ / 500 max input-clock cycles |
| USB output resistance | 40.5 / 45 / 49.5 Ω |
| USB HS high | 360 / 400 / 440 mV |
| USB HS low | −40 / 0 / 40 mV |
| USB disconnect | 570 / 600 / 664 mV |
| USB squelch | 100 / NA / 150 mV |



## Temperatur- und Kühlungsgrenzen

Der Wärmewiderstand stammt aus einer Herstellersimulation auf definierter PCB, nicht aus einer ArmSoM-Messung. Gehäuse, Kupferfläche, Luftstrom, Kühlkörper und Leistungsverteilung beeinflussen die Erwärmung. Sensorbereich ist nicht Umgebungstemperaturbereich.

| Merkmal | Spezifikation / Quellenhinweis |
|---|---|
| θJA / θJB / θJC | 22.8 / 9.3 / 6.87 °C/W |
| Thermisches Modell | 4-layer PCB · 114.3 × 101.6 mm |
| Tj | Laut Quelle unter 125 °C |
| Ta | 0…80 °C |
| SARADC | 10 bit · ≤1 MS/s |
| TSADC | −40…125 °C · ±3 °C accuracy · 0.6 °C resolution |



## Offene Quellenfragen

Viele RK3528-Grenzwerte, CPU/GPU-Maximalspannungen und -frequenzen sowie die PLL-Maximalversorgung bleiben TBD. Keine Fremdchipwerte einsetzen. Die Funktionsbeschreibung nennt 5 °C Auflösung, die elektrische Tabelle 0,6 °C bei ±3 °C Genauigkeit. Thermisch ist Tj unter 125 °C gefordert, während die absolute Temperaturzeile NA enthält. Klären Sie diese Unterschiede mit dem Lieferanten.

93 dB SNR und −84 dB THD des DAC gelten unter Quellenbedingungen wie 1 kHz, 48-kHz-Abtastung und 600-Ω-Last, nicht bei jeder Last.

## ArmSoM-Produkte und Einsatzgrenzen

Sige1 ist die RK3528-Plattform. Nicht jede Chipfunktion ist auf der Platine zugänglich; Anschlüsse, Spannungen, Images und Pinbelegung sind anhand der Sige1-Dokumentation zu prüfen.

- [Sige1](https://www.armsom.org/sige1) · [Docs](https://docs.armsom.org/armsom-sige1)

## Datenblattserie und Original-PDF

- [RK3528 Übersicht](/de/articles/rk3528-datasheet-v10/)
- [RK3528-Architektur: Speicher, 4K-Video und gemeinsame PHYs](/de/articles/rk3528-architecture-memory-media/)
- [RK3528: Gehäuse und vollständige Tabelle der 401 Balls](/de/articles/rk3528-package-pin-reference/)
- [RK3528: Versorgung, I/O und Wärmewiderstand](/de/articles/rk3528-electrical-power-thermal/)
- [Vollständiges Original-PDF herunterladen](/assets/datasheet-series-20261110/Rockchip-RK3528-Datasheet-V1.0-20230522.pdf)
