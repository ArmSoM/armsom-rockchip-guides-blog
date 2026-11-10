---
title: "RK730-Start und -Stopp: Versorgung, ADC-Aufnahme und DAC-Wiedergabe"
description: "Alle sechs Quellensequenzen mit Adressen und Bitwerten, ADC-Nummerierungsfehler und Prüfungen zur Treiberintegration."
excerpt: "Alle sechs Quellensequenzen mit Adressen und Bitwerten, ADC-Nummerierungsfehler und Prüfungen zur Treiberintegration."
translation_key: "rk730-power-adc-dac-sequences"
slug: "rk730-power-adc-dac-sequences"
lang: "de"
date: "2026-11-10"
author: "ArmSoM Editorial"
category: "production"
products: ["CM1", "Forge1"]
tags: ["RK730", "datasheet", "hardware design", "ArmSoM"]
image: "/assets/datasheet-series-20261110/rk730-datasheet-p10.png"
---

Dieser Artikel basiert auf der angegebenen Datenblattrevision. Die Werte sind Herstellerspezifikationen und keine ArmSoM-Messungen; neue Hardwaretests wurden nicht durchgeführt. Prüfen Sie Siliziumrevision, Schaltplan, SDK/BSP, Kernel und Treiber. Erläuterungen und editierbare Tabellen helfen beim Lesen; die vollständige Spezifikation und hier nicht vertiefte Bitdefinitionen stehen im Original-PDF.

**RK730 · Rockchip RK730 Datasheet V1.0-20241118.pdf · PDF 44–46.**


[![RK730-Start und -Stopp: Versorgung, ADC-Aufnahme und DAC-Wiedergabe](/assets/datasheet-series-20261110/rk730-datasheet-p10.png)](/assets/datasheet-series-20261110/rk730-datasheet-p10.png)

*Englische Originalabbildung, PDF S. 10.*


## Dies sind Referenzsequenzen, kein ausführbares Skript

Die Tabellen folgen S. 44–46 von oben nach unten. Eine Feldzuweisung ändert nur die genannten Bits, nicht das gesamte Register; andere Bits, Treibersperren und Energiemanagement bleiben zu beachten. Nicht angegebene Wartezeiten werden nicht erfunden. Treiber, Takte, Kanalzuordnung und Analogschaltung vorher prüfen.

## Sechs vollständige Sequenzen


### System einschalten


| Lesereihenfolge | Originalnummer | Bitfeldzuweisung | Aktion / Gruppe |
|---|---|---|---|
| 1 | 0 | — | Analog- und Digitalversorgung anlegen |
| 2 | 1 | `0x1F[7]=1'b1` | LDO VMID aktivieren |
| 3 | 2 | `0x10[7:0]=8'b00000000` | System-PLL-Steuerung |


### System ausschalten


| Lesereihenfolge | Originalnummer | Bitfeldzuweisung | Aktion / Gruppe |
|---|---|---|---|
| 1 | 0 | — | Versorgung beibehalten; zuerst DAC und ADC deaktivieren |
| 2 | 1 | `0x10[7:0]=8'b11111111` | System-PLL abschalten |
| 3 | 2 | `0x1F[7]=1'b0` | LDO VMID deaktivieren |
| 4 | 3 | — | Analog- und Digitalversorgung abschalten |


### ADC aktivieren


| Lesereihenfolge | Originalnummer | Bitfeldzuweisung | Aktion / Gruppe |
|---|---|---|---|
| 1 | 0 | — | System einschalten |
| 2 | 1 | `0x01[7]=1'b0` | HK_TOP_1 |
| 3 | 2 | `0x0A[0]=1'b0` | MIC_BOOST_0 |
| 4 | 3 | `0x0B[0]=1'b0` | MIC_BOOST_1 |
| 5 | 4 | `0x0C[0]=1'b0` | MIC_BOOST_2 |
| 6 | 5 | `0x0D[0]=1'b0; 0x0D[7:6]=2'b01` | MIC_BOOST_3 |
| 7 | 6 | `0x0E[0]=1'b0` | ADC_PGA_BLOCK_0 |
| 8 | 7 | `0x0F[0]=1'b0; 0x0F[7:6]=2'b01` | ADC_PGA_BLOCK_1 |
| 9 | 8 | `0x04[1:0]=2'b00` | ADC_0 |
| 10 | 9 | `0x06[4]=1'b1; 0x06[3]=1'b1` | ADC_2 |
| 11 | 10 | `0x07[5:4]=2'b01` | ADC_3 |
| 12 | 11 | `0x41[2:0]=3'b010` | SRT |
| 13 | 12 | `0x44[7]=1'b1` | VUCTL |
| 14 | 13 | `0x69[0]=1'b0` | I2S_CKM |
| 15 | 14 | `0x6F[6]=1'b0` | I2S_TXCR1 |
| 16 | 15 | `0x71[7:0]=8'b10001000` | I2S_TXCMD |
| 17 | 16 | `0x40[7:6]=2'b11` | DIGEN |
| 18 | 17 | `0x40[5:4]=2'b11` | DIGEN |
| 19 | 18 | — | Aufnahme starten |


### ADC deaktivieren (Originalschrittnummern erhalten)


| Lesereihenfolge | Originalnummer | Bitfeldzuweisung | Aktion / Gruppe |
|---|---|---|---|
| 1 | 0 | — | Aufnahme stoppen, Kanäle vorerst beibehalten |
| 2 | 1 | `0x40[5:4]=2'b00` | DIGEN |
| 3 | 2 | `0x40[7:6]=2'b00` | DIGEN |
| 4 | 3 | `0x71[7:0]=8'b00000000` | I2S_TXCMD |
| 5 | 8 | `0x04[1:0]=2'b11` | ADC_0 |
| 6 | 7 | `0x0F[0]=1'b1; 0x0E[0]=1'b1` | ADC_PGA_BLOCK_1 / ADC_PGA_BLOCK_0 |
| 7 | 6 | `0x0D[0]=1'b1` | MIC_BOOST_3 |
| 8 | 4 | `0x0C[0]=1'b1` | MIC_BOOST_2 |
| 9 | 3 | `0x0B[0]=1'b1` | MIC_BOOST_1 |
| 10 | 2 | `0x0A[0]=1'b1` | MIC_BOOST_0 |
| 11 | 1 | `0x01[7]=1'b1` | HK_TOP_1 |


### DAC aktivieren


| Lesereihenfolge | Originalnummer | Bitfeldzuweisung | Aktion / Gruppe |
|---|---|---|---|
| 1 | 0 | — | System einschalten |
| 2 | 1 | `0x01[7:6]=2'b00` | HK_TOP_1 |
| 3 | 2 | `0x41[6:4]=3'b010` | SRT |
| 4 | 3 | `0x44[6]=1'b1` | VUCTL |
| 5 | 4 | `0x69[7:0]=8'b00111010` | I2S_CKM |
| 6 | 5 | `0x40[7:4]=4'b0101` | DIGEN |
| 7 | 6 | `0x40[7:4]=4'b0000` | DIGEN |
| 8 | 7 | `0x69[7:0]=8'b00000000` | I2S_CKM |
| 9 | 8 | `0x6E[7]=1'b1` | I2S_RXCMD |
| 10 | 9 | `0x40[3:0]=4'b0101` | DIGEN |
| 11 | 10 | `0x40[3:0]=4'b1111` | DIGEN |
| 12 | 11 | `0x4F[7:4]=4'b0000` | DDAC_FILTER |
| 13 | 12 | `0x08[2:0]=3'b000` | DAC_0 |
| 14 | 13 | `0x09[6:4]=3'b000` | DAC_1 |
| 15 | 14 | `0x21[7:0]=8'b10000000` | HP_0 |
| 16 | 15 | `0x24[7:0]=8'b10000000` | SPK_0 |
| 17 | 16 | — | Wiedergabe starten |


### DAC deaktivieren


| Lesereihenfolge | Originalnummer | Bitfeldzuweisung | Aktion / Gruppe |
|---|---|---|---|
| 1 | 0 | — | Zuerst stummschalten |
| 2 | 1 | `0x24[3:2]=2'b11` | SPK_0 |
| 3 | 2 | `0x21[3:2]=2'b11` | HP_0 |
| 4 | 3 | `0x09[6:4]=3'b111` | DAC_1 |
| 5 | 4 | `0x08[2:0]=3'b111` | DAC_0 |
| 6 | 5 | `0x40[3:0]=4'b0101` | DIGEN |
| 7 | 6 | `0x40[3:0]=4'b0000` | DIGEN |
| 8 | 7 | `0x6E[7]=1'b0` | I2S_RXCMD |
| 9 | 8 | `0x01[7:6]=2'b11` | HK_TOP_1 |



## Nummerierungskonflikte und Seitenfortsetzung

ADC-Abschaltnummern lauten 0,1,2,3,8,7,6,4,3,2,1 mit Wiederholungen und Rückwärtsfolge. Originalnummern bleiben neben der Lesereihenfolge erhalten und werden nicht sortiert. ADC-Schritt 9 geht über die Seite; 0x06[4] und 0x06[3] sind beide enthalten. Auch der DIGEN-Übergang 0101 → 0000 beim DAC-Start bleibt erhalten; Zwischenschritte dürfen nicht wegen gleicher Endwerte entfallen.

## Was beim Boardtest zu dokumentieren ist

Dokumentieren Sie Versorgung, MCLK/BCLK/LRCLK, Treiberversion, Abtastparameter und Registeränderungen. ADC mit bekanntem Eingangspegel, DAC mit definierter Last prüfen; Mute, Rauschen, Knacken und Wiederherstellung beobachten. Vor dem Abschalten externer Versorgung Audiopfade deaktivieren. Dies sind Prüfempfehlungen, keine Behauptung abgeschlossener ArmSoM-Tests.

## ArmSoM-Produkte und Einsatzgrenzen

CM1 und Forge1 dienen als Plattformreferenzen für Audioperipherie. Ein eingebauter RK730 oder geprüfte sofortige Treiberunterstützung werden hier nicht behauptet. Prüfen Sie zuerst die verfügbaren I2S-/I2C-Signale, Takte und Spannungspegel.

- [CM1](https://www.armsom.org/cm1) · [Docs](https://docs.armsom.org/armsom-cm1)
- [Forge1](https://www.armsom.org/forge1) · [Docs](https://docs.armsom.org/armsom-forge1)

## Datenblattserie und Original-PDF

- [RK730 Übersicht](/de/articles/rk730-audio-codec-design/)
- [RK730: QFN28-Gehäuse, Pinbelegung und Versorgung](/de/articles/rk730-package-power-pinout/)
- [RK730-Takte und Audiopfade: PLL, I2S, Sidetone und I2C](/de/articles/rk730-clocks-audio-i2c/)
- [RK730-Registerreferenz: 65 Adressen, Resetwerte und Steuergruppen](/de/articles/rk730-register-map-reference/)
- [RK730-Start und -Stopp: Versorgung, ADC-Aufnahme und DAC-Wiedergabe](/de/articles/rk730-power-adc-dac-sequences/)
- [Vollständiges Original-PDF herunterladen](/assets/datasheet-series-20261110/Rockchip-RK730-Datasheet-V1.0-20241118.pdf)
