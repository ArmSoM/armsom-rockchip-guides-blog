---
title: "RK3528 / RK3528A DDR: Topologie, Versorgung, Pin-Swaps und PCB"
description: "RK3528 / RK3528A DDR: Topologie, Versorgung, Pin-Swaps und PCB. Beide V1.0-Handbücher nach Aufgaben lesen: Boot, Versorgung, DDR, Schnittstellen, PCB, Thermik und Fertigung."
excerpt: "RK3528 / RK3528A DDR: Topologie, Versorgung, Pin-Swaps und PCB. Beide V1.0-Handbücher nach Aufgaben lesen: Boot, Versorgung, DDR, Schnittstellen, PCB, Thermik und Fertigung."
translation_key: "rk3528-rk3528a-ddr-circuit-routing"
slug: "rk3528-rk3528a-ddr-circuit-routing"
lang: "de"
date: "2026-11-10"
author: "ArmSoM Editorial"
category: "production"
products: ["Sige1"]
tags: ["RK3528", "RK3528A", "hardware design"]
image: "/assets/rk3528-hardware-series/rk3528-p27.png"
---

# RK3528 / RK3528A DDR: Topologie, Versorgung, Pin-Swaps und PCB

Dieses Entwicklungsthema basiert auf den chinesischen Hardwarehandbüchern RK3528 V1.0 (2023-05-25) und RK3528A V1.0 (2023-07-12), nicht auf einer vollständigen wörtlichen PDF-Übersetzung. Ähnliche Kapitel belegen keine direkte Austauschbarkeit der Chips. Die offizielle [Sige1-Dokumentation](https://docs.armsom.org/armsom-sige1) nennt RK3528 für ArmSoM [Sige1](https://www.armsom.org/sige1), das zur Bewertung entsprechender Anwendungen dienen kann. Daraus folgt weder, dass Sige1 RK3528A verwendet, noch dass beide Chips austauschbar sind. SoC-Referenzschaltungen sind nicht der Sige1-Schaltplan; Pins, Gehäuse, BSP/SDK, Kernel und Boardrevision am tatsächlichen Produkt prüfen. Werte stammen aus den Quellen, nicht aus ArmSoM-Hardwaremessungen.

**§2.1.6; §3.3.3; PDF 23–32, 127–141**

## Bei der Speicherauswahl die Topologie festlegen

Der Controller unterstützt DDR3/DDR3L/LPDDR3/DDR4/LPDDR4/LPDDR4X, insgesamt 32bit Busbreite, zwei Ranks und bis zu 4GB Adressraum. Zwei 16bit-Hälften bilden einen 32bit-Kanal; die Quelle nennt asymmetrische 1GB+2GB. Vier DDR3/DDR4-Bausteine verwenden T-Topologie für DQ und Fly-by+T für CA; zwei 16bit-Bausteine nutzen Punkt-zu-Punkt-DQ und Fly-by-CA. Ein einzelner LPDDR-Baustein benötigt seine passende Vorlage. Kapazitäts- und Bestückungsänderungen betreffen auch Terminierung und Training.

## Swap- und ZQ-Regeln nicht von anderen SoCs übernehmen

DDR3/DDR3L/DDR4 erlauben ganze Byte-Swaps und DQ-Swaps innerhalb eines Bytes, jedoch keine CA-Swaps. 16bit- und 16/32bit-kompatible Designs benötigen die Herstellervorlage. Bei LPDDR3 bleiben D0–D7 und zugehörige DQS/DM fest; andere Bytes folgen den angegebenen Regeln. LPDDR4/4X erlauben weder DQ- noch CA-Swaps. SoC-DDR_RZQ beträgt 120Ω, 1%: gegen Masse bei DDR3/3L/4/LPDDR3, gegen DDRPHY_VDDQ bei LPDDR4/4X. Speicher-ZQ verwendet dagegen 240Ω, 1%, je nach Typ gegen Masse, VCC_DDR oder VCC0V6_DDR.

## Versorgungs- und Matchingregeln nach Speichertyp trennen

LPDDR4 nutzt 1.1V für DDRPHY_VDDQ und VDDQL; LPDDR4X nutzt 1.1V/0.6V. R3004 und R3012 sind gegenseitig ausschließende Bestückungsoptionen. DDR3/DDR3L verwenden 1.5V/1.35V, DDR4 1.2V. Für LPDDR3 nennt die Quelle nominal 1.2V und tatsächlich 1.25V zur Kompatibilitätsverbesserung; Bauteilgrenzen prüfen. Die LPDDR4X-PCB-Tabelle verlangt 50Ω single-ended und 100Ω differentiell, jeweils ±10%; DQ/DM zu DQS im Byte ≤600mil, innerhalb DQS/CLK ≤12mil und DQS zu CLK ≤1700mil. Andere Speichertypen besitzen eigene Tabellen.

## Referenzparameter

| Punkt | Quellenwert |
| --- | --- |
| Gesamtbus / Adressraum | 32bit / 4GB |
| SoC-RZQ | 120Ω ±1% |
| Speicher-ZQ | 240Ω ±1% |
| LPDDR4X VDDQ / VDDQL | 1.1V / 0.6V |

## Vollständige DDR-PHY-Signalzuordnung

PDF-Seiten 24–26 enthalten 74 Zeilen, die in beiden extrahierten Tabellen identisch sind. Bezeichner einschließlich der mutmaßlichen Quellfehler `DDR33_A15` und `DDR33_ODT1` bleiben erhalten; anhand PinOut/TRM klären, keine neuen Netznamen erzeugen. `------` bedeutet keine Zuordnung in der Quelle. Die Tabelle hebt die Swap-Beschränkungen nicht auf.

| DDRPHY | DDR4 | LPDDR4 / LPDDR4X | DDR3 | LPDDR3 |
| --- | --- | --- | --- | --- |
| DDRPHY_A_DQ0 | DDR4_DQL6_A | LPDDR4_DQ0_A | DDR3_D4 | LPDDR3_D0 |
| DDRPHY_A_DQ1 | DDR4_DQL2_A | LPDDR4_DQ1_A | DDR3_D0 | LPDDR3_D1 |
| DDRPHY_A_DQ2 | DDR4_DQL0_A | LPDDR4_DQ2_A | DDR3_D2 | LPDDR3_D2 |
| DDRPHY_A_DQ3 | DDR4_DQL1_A | LPDDR4_DQ3_A | DDR3_D1 | LPDDR3_D3 |
| DDRPHY_A_DQ4 | DDR4_DQL4_A | LPDDR4_DQ4_A | DDR3_D6 | LPDDR3_D4 |
| DDRPHY_A_DQ5 | DDR4_DQL5_A | LPDDR4_DQ5_A | DDR3_D7 | LPDDR3_D5 |
| DDRPHY_A_DQ6 | DDR4_DQL7_A | LPDDR4_DQ6_A | DDR3_D5 | LPDDR3_D6 |
| DDRPHY_A_DQ7 | DDR4_DQL3_A | LPDDR4_DQ7_A | DDR3_D3 | LPDDR3_D7 |
| DDRPHY_A_DM0 | DDR4_DML_A | LPDDR4_DM0_A | DDR3_DM0 | LPDDR3_DM0 |
| DDRPHY_A_DQS0 | DDR4_DQSL_P_A | LPDDR4_DQS0P_A | DDR3_DQS0P | LPDDR3_DQS0P |
| DDRPHY_A_DQSB0 | DDR4_DQSL_N_A | LPDDR4_DQS0N_A | DDR3_DQS0N | LPDDR3_DQS0N |
| DDRPHY_A_DQ8 | DDR4_DQU1_A | LPDDR4_DQ8_A | DDR3_D12 | LPDDR3_D19 |
| DDRPHY_A_DQ9 | DDR4_DQU5_A | LPDDR4_DQ9_A | DDR3_D14 | LPDDR3_D16 |
| DDRPHY_A_DQ10 | DDR4_DQU0_A | LPDDR4_DQ10_A | DDR3_D15 | LPDDR3_D21 |
| DDRPHY_A_DQ11 | DDR4_DQU2_A | LPDDR4_DQ11_A | DDR3_D9 | LPDDR3_D17 |
| DDRPHY_A_DQ12 | DDR4_DQU7_A | LPDDR4_DQ12_A | DDR3_D10 | LPDDR3_D20 |
| DDRPHY_A_DQ13 | DDR4_DQU3_A | LPDDR4_DQ13_A | DDR3_D8 | LPDDR3_D23 |
| DDRPHY_A_DQ14 | DDR4_DQU4_A | LPDDR4_DQ14_A | DDR3_D13 | LPDDR3_D22 |
| DDRPHY_A_DQ15 | DDR4_DQU6_A | LPDDR4_DQ15_A | DDR3_D11 | LPDDR3_D18 |
| DDRPHY_A_DM1 | DDR4_DMU_A | LPDDR4_DM1_A | DDR3_DM1 | LPDDR3_DM2 |
| DDRPHY_A_DQS1 | DDR4_DQSU_P_A | LPDDR4_DQS1P_A | DDR3_DQS1P | LPDDR3_DQS2P |
| DDRPHY_A_DQSB1 | DDR4_DQSU_N_A | LPDDR4_DQS1N_A | DDR3_DQS1N | LPDDR3_DQS2N |
| DDRPHY_B_DQ0 | DDR4_DQU4_B | LPDDR4_DQ0_B | DDR3_D29 | LPDDR3_D14 |
| DDRPHY_B_DQ1 | DDR4_DQU0_B | LPDDR4_DQ1_B | DDR3_D31 | LPDDR3_D12 |
| DDRPHY_B_DQ2 | DDR4_DQU1_B | LPDDR4_DQ2_B | DDR3_D28 | LPDDR3_D13 |
| DDRPHY_B_DQ3 | DDR4_DQU5_B | LPDDR4_DQ3_B | DDR3_D30 | LPDDR3_D8 |
| DDRPHY_B_DQ4 | DDR4_DQU7_B | LPDDR4_DQ4_B | DDR3_D26 | LPDDR3_D9 |
| DDRPHY_B_DQ5 | DDR4_DQU3_B | LPDDR4_DQ5_B | DDR3_D24 | LPDDR3_D15 |
| DDRPHY_B_DQ6 | DDR4_DQU6_B | LPDDR4_DQ6_B | DDR3_D27 | LPDDR3_D10 |
| DDRPHY_B_DQ7 | DDR4_DQU2_B | LPDDR4_DQ7_B | DDR3_D25 | LPDDR3_D11 |
| DDRPHY_B_DM0 | DDR4_DMU_B | LPDDR4_DM0_B | DDR3_DM3 | LPDDR3_DM1 |
| DDRPHY_B_DQS0 | DDR4_DQSU_P_B | LPDDR4_DQS0P_B | DDR3_DQS3P | LPDDR3_DQS1P |
| DDRPHY_B_DQSB0 | DDR4_DQSU_N_B | LPDDR4_DQS0N_B | DDR3_DQS3N | LPDDR3_DQS1N |
| DDRPHY_B_DQ8 | DDR4_DQL1_B | LPDDR4_DQ8_B | DDR3_D17 | LPDDR3_D27 |
| DDRPHY_B_DQ9 | DDR4_DQL3_B | LPDDR4_DQ9_B | DDR3_D19 | LPDDR3_D26 |
| DDRPHY_B_DQ10 | DDR4_DQL4_B | LPDDR4_DQ10_B | DDR3_D18 | LPDDR3_D30 |
| DDRPHY_B_DQ11 | DDR4_DQL6_B | LPDDR4_DQ11_B | DDR3_D22 | LPDDR3_D31 |
| DDRPHY_B_DQ12 | DDR4_DQL0_B | LPDDR4_DQ12_B | DDR3_D16 | LPDDR3_D28 |
| DDRPHY_B_DQ13 | DDR4_DQL2_B | LPDDR4_DQ13_B | DDR3_D20 | LPDDR3_D24 |
| DDRPHY_B_DQ14 | DDR4_DQL7_B | LPDDR4_DQ14_B | DDR3_D21 | LPDDR3_D25 |
| DDRPHY_B_DQ15 | DDR4_DQL5_B | LPDDR4_DQ15_B | DDR3_D23 | LPDDR3_D29 |
| DDRPHY_B_DM1 | DDR4_DML_B | LPDDR4_DM1_B | DDR3_DM2 | LPDDR3_DM3 |
| DDRPHY_B_DQS1 | DDR4_DQSL_P_B | LPDDR4_DQS1P_B | DDR3_DQS2P | LPDDR3_DQS3P |
| DDRPHY_B_DQSB1 | DDR4_DQSL_N_B | LPDDR4_DQS1N_B | DDR3_DQS2N | LPDDR3_DQS3N |
| DDRPHY_A0 | DDR4_A0 | LPDDR4_ODT1_CA_B | DDR3_A9 | LPDDR3_ODT2 |
| DDRPHY_A1 | DDR4_A1 | LPDDR4_CKE1_A | DDR3_A14 | ------ |
| DDRPHY_A2 | DDR4_A2 | LPDDR4_ODT0_CA_B | DDR3_A13 | LPDDR3_ODT3 |
| DDRPHY_A3 | DDR4_A3 | LPDDR4_CKE0_A | DDR3_A1 | ------ |
| DDRPHY_A4 | DDR4_A4 | LPDDR4_A0_B | DDR3_A2 | LPDDR3_A5 |
| DDRPHY_A5 | DDR4_A5 | LPDDR4_A1_A | DDR3_A4 | ------ |
| DDRPHY_A6 | DDR4_A6 | LPDDR4_CS1N_B | DDR3_A3 | LPDDR3_CSN2 |
| DDRPHY_A7 | DDR4_A7 | LPDDR4_A4_A | DDR3_A6 | ------ |
| DDRPHY_A8 | DDR4_A8 | LPDDR4_A4_B | DDR3_A5 | LPDDR3_A6 |
| DDRPHY_A9 | DDR4_A9 | LPDDR4_CLKP_A | DDR3_A11 | LPDDR3_A2 |
| DDRPHY_A10 | DDR4_A10 | LPDDR4_A1_B | DDR3_A0 | ------ |
| DDRPHY_A11 | DDR4_A11 | LPDDR4_A5_B | DDR3_A7 | LPDDR3_A7 |
| DDRPHY_A12 | DDR4_A12 | LPDDR4_A2_A | DDR3_A10 | LPDDR3_A4 |
| DDRPHY_A13 | DDR4_A13 | LPDDR4_CLKN_A | DDR3_A8 | LPDDR3_A3 |
| DDRPHY_A14 | DDR4_WEN/A14 | LPDDR4_CS0N_B | DDR3_ODT0 | LPDDR3_CSN3 |
| DDRPHY_A15 | DDR4_CASN/A15 | LPDDR4_A3_A | DDR3_BA1 | LPDDR3_A0 |
| DDRPHY_A16 | DDR4_RASN/A16 | LPDDR4_A0_A | DDR3_CKE0 | ------ |
| DDRPHY_ACTN | DDR4_ACTN | LPDDR4_A2_B | DDR3_CSN0 | LPDDR3_A9 |
| DDRPHY_BA0 | DDR4_BA0 | LPDDR4_CKE0_B | DDR3_BA2 | LPDDR3_CKE0 |
| DDRPHY_BA1 | DDR4_BA1 | LPDDR4_A5_A | DDR3_A12 | LPDDR3_A1 |
| DDRPHY_BG0 | DDR4_BG0 | LPDDR4_A3_B | DDR3_BA0 | LPDDR3_A8 |
| DDRPHY_BG1 | DDR4_BG1 | ------ | DDR33_A15 | ------ |
| DDRPHY_CKE | DDR4_CKE | LPDDR4_CKE1_B | DDR3_RASN | ------ |
| DDRPHY_CK | DDR4_CLKP | LPDDR4_CLKP_B | DDR3_CLKP | LPDDR3_CLKP |
| DDRPHY_CKB | DDR4_CLKN | LPDDR4_CLKN_B | DDR3_CLKN | LPDDR3_CLKN |
| DDRPHY_CSB0 | DDR4_CSN0 | LPDDR4_CS1N_A | DDR3_CASN | LPDDR3_CSN1 |
| DDRPHY_CSB1 | DDR4_CSN1 | LPDDR4_CS0N_A | DDR3_CSN1 | LPDDR3_CSN0 |
| DDRPHY_ODT0 | DDR4_ODT0 | LPDDR4_ODT1_CA_A | DDR3_WEN | LPDDR3_ODT0 |
| DDRPHY_ODT1 | DDR4_ODT1 | LPDDR4_ODT0_CA_A | DDR33_ODT1 | LPDDR3_ODT1 |
| DDRPHY_RESETN | DDR4_RESETN | LPDDR4_RESETN | DDR3_RESETN | ------ |


## Quellenabbildungen und Seiten

Es liegen keine entsprechenden englischen Originale vor. Alle vier Sprachen nutzen chinesische PDF-Abbildungen mit Chip- und physischer Seitenangabe; RK3528-Bilder werden nicht als RK3528A-Bilder ausgegeben.

[![RK3528 · RK3528 / RK3528A DDR: Topologie, Versorgung, Pin-Swaps und PCB · PDF 27](/assets/rk3528-hardware-series/rk3528-p27.png)](/assets/rk3528-hardware-series/rk3528-p27.png)

RK3528 · CN · PDF 27

[![RK3528 · RK3528 / RK3528A DDR: Topologie, Versorgung, Pin-Swaps und PCB · PDF 30](/assets/rk3528-hardware-series/rk3528-p30.png)](/assets/rk3528-hardware-series/rk3528-p30.png)

RK3528 · CN · PDF 30

[![RK3528 · RK3528 / RK3528A DDR: Topologie, Versorgung, Pin-Swaps und PCB · PDF 28](/assets/rk3528-hardware-series/rk3528-p28.png)](/assets/rk3528-hardware-series/rk3528-p28.png)

RK3528 · CN · PDF 28

[![RK3528 · RK3528 / RK3528A DDR: Topologie, Versorgung, Pin-Swaps und PCB · PDF 31](/assets/rk3528-hardware-series/rk3528-p31.png)](/assets/rk3528-hardware-series/rk3528-p31.png)

RK3528 · CN · PDF 31

[![RK3528 · RK3528 / RK3528A DDR: Topologie, Versorgung, Pin-Swaps und PCB · PDF 32](/assets/rk3528-hardware-series/rk3528-p32.png)](/assets/rk3528-hardware-series/rk3528-p32.png)

RK3528 · CN · PDF 32

[![RK3528A · RK3528 / RK3528A DDR: Topologie, Versorgung, Pin-Swaps und PCB · PDF 27](/assets/rk3528-hardware-series/rk3528a-p27.png)](/assets/rk3528-hardware-series/rk3528a-p27.png)

RK3528A · CN · PDF 27

[![RK3528A · RK3528 / RK3528A DDR: Topologie, Versorgung, Pin-Swaps und PCB · PDF 30](/assets/rk3528-hardware-series/rk3528a-p30.png)](/assets/rk3528-hardware-series/rk3528a-p30.png)

RK3528A · CN · PDF 30

[![RK3528A · RK3528 / RK3528A DDR: Topologie, Versorgung, Pin-Swaps und PCB · PDF 28](/assets/rk3528-hardware-series/rk3528a-p28.png)](/assets/rk3528-hardware-series/rk3528a-p28.png)

RK3528A · CN · PDF 28

[![RK3528A · RK3528 / RK3528A DDR: Topologie, Versorgung, Pin-Swaps und PCB · PDF 31](/assets/rk3528-hardware-series/rk3528a-p31.png)](/assets/rk3528-hardware-series/rk3528a-p31.png)

RK3528A · CN · PDF 31

[![RK3528A · RK3528 / RK3528A DDR: Topologie, Versorgung, Pin-Swaps und PCB · PDF 32](/assets/rk3528-hardware-series/rk3528a-p32.png)](/assets/rk3528-hardware-series/rk3528a-p32.png)

RK3528A · CN · PDF 32

## Entwicklung und Dokumentation

ArmSoM-Produkte anhand ihrer eigenen Dokumentation wählen; die Serie behauptet kein ArmSoM-Board mit RK3528/RK3528A. Schnittstellen- und Softwareerfahrung anderer Boards hilft methodisch, macht Spannungen, Pins oder PCB-Regeln aber nicht austauschbar.

- [ArmSoM](https://www.armsom.org/) · [ArmSoM Docs](https://docs.armsom.org/)
- [RK3528 / RK3528A: neun Hardware-Entwicklungsthemen](/de/articles/rk3528-rk3528a-hardware-design-series/)
- [RK3528 / RK3528A: diskrete Versorgung, Sequenzierung und Lastprüfung](/de/articles/rk3528-rk3528a-power-sequencing/)
- [RK3528 / RK3528A: eMMC, FSPI, SDMMC und SDIO](/de/articles/rk3528-rk3528a-storage-sdio-design/)
