---
title: "ArmSoM Rockchip Audio: Vollständiger Leitfaden zu Treibern, Konfiguration und Fehlersuche"
description: "Vollständiger Rockchip-Audio-Leitfaden für ArmSoM: SAI, I2S, PDM, ASRC, ALSA, Device Tree, Aufnahme- und Wiedergabebefehle sowie XRUN-Fehlersuche."
translation_key: "023-rockchip-audio"
slug: "023-rockchip-audio"
lang: "de"
date: "2026-10-15"
author: "ArmSoM-Redaktion · Rockchip-Quelldokumentation"
category: "media"
products: ["Sige7", "Sige5", "CM5", "AIM7", "AIM5"]
tags: ["Audio", "ALSA", "ASoC", "I2S", "SAI", "ACodec"]
keywords: "ArmSoM Rockchip Audio, Treiber, Konfiguration, Fehlersuche, Linux, Rockchip, ALSA, ASoC"
excerpt: "Vollständiger Rockchip-Audio-Leitfaden für ArmSoM: SAI, I2S, PDM, ASRC, ALSA, Device Tree, Aufnahme- und Wiedergabebefehle sowie XRUN-Fehlersuche."
---

{% raw %}
# ArmSoM Rockchip Audio: Vollständiger Leitfaden zu Treibern, Konfiguration und Fehlersuche

<style>.article-content img{aspect-ratio:auto;width:auto;max-width:100%;margin:24px auto}.article-content table{font-size:14px}.article-content th{min-width:90px}</style>

Dieser Leitfaden behandelt die Audioentwicklung auf ArmSoM-Rockchip-Plattformen, darunter Sige7 / AIM7 (RK3588) und Sige5 / CM5 / AIM5 (RK3576). Wählen Sie die passenden Abschnitte für Ihren SoC, den Codec auf Modul oder Trägerplatine, die Verdrahtung und das SDK/BSP. Die Fähigkeit eines Controllers bedeutet nicht, dass jedes Board die betreffende Schnittstelle herausführt. Die Quelle behandelt Linux 4.4, 4.19, 5.10 und 6.1; prüfen Sie Treiber und Device-Tree-Eigenschaften anhand des passenden BSP. Messungen und Beispiele stammen von Rockchip und sind keine ArmSoM-Hardwaretests.

Quelle: Rockchip_Developer_Guide_Audio_EN.pdf, V2.4.0. Die technischen Kapitel bleiben erhalten; Deckblatterklärungen, Zielgruppenabschnitt und Versionshistorie wurden weggelassen. Korrekturen und offene Fragen stehen in den [redaktionellen Hinweisen](/docs/rockchip-audio/EDITORIAL-NOTES.md).

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://docs.armsom.org/armsom-sige7) · [Sige5](https://docs.armsom.org/armsom-sige5) · [CM5](https://docs.armsom.org/armsom-cm5)

<!-- source-page: 8; block: en-0000 -->

## 1. Überblick

<!-- source-page: 8; block: en-0001 -->

### 1.1 Audiofunktionen von Rockchip

<!-- source-page: 8; block: en-0002 -->

Dieser Abschnitt beschreibt die Audiofunktionen der RK-Plattform.

<!-- source-page: 9; block: en-0003 -->

|  | Funktion | Eigenschaft | Beschreibung |
| --- | --- | --- | --- |
| DAI | I2S | 8 CH IN / OUT | Inter IC Sound |
|  | TDM | 16 CH IN / OUT | Time Division Multiplexing |
|  | PCM | 2 CH IN / OUT | Pulse Code Modulation |
|  | PDM | 8 CH IN | Pulse Density Modulation |
|  | DSM | 2 CH OUT | Delta Sigma Modulation |
|  | DCODEC | 4 CH IN / 2 CH OUT | Digitale Codec-Schnittstelle |
|  | SPDIF | 2 CH IN / OUT / 7.1 BITSTREAM | Sony/Philips Digital Interface |
|  | SAI | 128 CH IN / OUT | Serielle Audioschnittstelle |
|  | ASRC | 8 CH IN / OUT | Asynchroner Abtastratenwandler |
| COMBO DAI | I2S + I2S | 16 CH IN / OUT | z. B. Soundbar |
|  | I2S + PDM | 16 CH IN / OUT | z. B. Smart-Home-Produkt |
|  | TDM + TDM | 32 CH IN / 32 CH OUT |  |
|  | TDM + PDM | 24 CH IN / 16 CH OUT |  |
|  | SAI + SAI | 256 CH IN / OUT oder mehr | z. B. Mikrofonarray |
|  | ASRC + ASRC | 40 CH | z. B. rk2118 32 CH IN / 8 CH OUT |
|  | ... | ... | ... |
| COMBO CODEC | DMIC ARRAY + ANALOG LOOPBACK | Zur akustischen Echokompensation | z. B. Smart-Home-Produkt |
|  | HDMI + ANALOG OUTPUT | Für mehrere Audioströme | z. B. OTT-Produkt |
|  | CARD + VAD | Zur automatischen Spracherkennung | z. B. Smart-Home-Produkt |
| DIGITALE AUSGABE | HDMI OUT | 7.1 LPCM Mehrkanal / Bitstream | z. B. verlustfreier Dolby-/DTS-Bitstream |
|  | DP | 7.1 LPCM Mehrkanal | z. B. verlustfreier Dolby-/DTS-Bitstream |
|  | OPTICAL | 2 CH LPCM / 7.1 Bitstream | z. B. 7.1 DD+ Bitstream |
|  | DCODEC | Verbindung mit externem Analogteil | z. B. RK812 |
|  | DSM | Differenzieller Stereoausgang | z. B. Musikwiedergabe über DSM auf RV1126 |
| DIGITALE EINGABE | HDMI IN | HDMI INPUT | z. B. mit externem IC wie TC358749 |
|  | HDMI ARC | Audio Return Channel | z. B. RK3308 |
|  | PDM DMICS | DMIC-Array | z. B. 8 omnidirektionale PDM-Mikrofone |
|  | I2S DMICS | DMIC-Array | z. B. 8 omnidirektionale I2S-Mikrofone |
|  | DCODEC | Verbindung mit externem Analogteil | z. B. RK812 |
|  | VAD | Sprachaktivitätserkennung | System bei Erreichen des Schallschwellwerts aufwecken |
|  | SPDIF IN | 2 CH LPCM | z. B. ARC auf RK3308 |
| ANALOGE E/A | INTERNE CODECS | 2 CH IN / OUT oder mehr | 8CH IN auf RK3308 |
|  | EXTERNE CODECS | 2 CH IN / OUT oder mehr | z. B. RK817 |
| WEITERE | ACC | Audiotaktkompensation (SW / HW) | z. B. UAC-Taktdrift und -kompensation |
|  | DLP | Digitales Loopback (SW / HW) | z. B. 2 Mikrofonkanäle mit digitalem Loopback |
|  | AUPLL-IO-IN | Audio-PLL mit Takterhaltung | z. B. rk2116 mit externer Fahrzeugendstufe |

<!-- source-page: 10; block: en-0005 -->

Abbildung 1-1: Audiofunktionen von Rockchip

<!-- source-page: 10; block: en-0006 -->

### 1.2 DAI

<!-- source-page: 10; block: en-0007 -->

Dieses Kapitel beschreibt hauptsächlich die Unterstützung digitaler Audioschnittstellen auf der RK-Plattform.

<!-- source-page: 10; block: en-0008 -->

#### 1.2.1 SAI

<!-- source-page: 10; block: en-0009 -->

##### 1.2.1.1 Funktionen des SAI-Controllers

<!-- source-page: 10; block: en-0010 -->

Unterstützt flexible Protokolle, darunter gängige I2S/DSP/TDM-Varianten.

<!-- source-page: 10; block: en-0011 -->

Unterstützt die Erkennung von FSYNC ERR / LOST

<!-- source-page: 10; block: en-0012 -->

Unterstützt FSYNC/SCLK INV

<!-- source-page: 10; block: en-0013 -->

Unterstützt FSYNC-Formate mit beliebigem Tastverhältnis

<!-- source-page: 10; block: en-0014 -->

Unterstützt flexible Anpassung des DATA-Timings; die SFT-Schrittweite beträgt einen halben SCLK

<!-- source-page: 10; block: en-0015 -->

Unterstützt Mono: RX erlaubt die Slot-Auswahl, TX das Kopieren von Mono auf alle Slots

<!-- source-page: 10; block: en-0016 -->

Unterstützt Master-/Slave-Modus; der Modus gilt gleichzeitig für TX/RX

<!-- source-page: 10; block: en-0017 -->

Unterstützt 128 Slots pro Leitung, abhängig von den Taktgrenzen, beispielsweise 50M: TDM 32 Slots @ 48k 32 Bits

<!-- source-page: 10; block: en-0018 -->

Unterstützt konfigurierbare Slot-Bitbreiten von 8 ~ 32 Bits

<!-- source-page: 10; block: en-0019 -->

Unterstützt Slot-Maskierung

<!-- source-page: 10; block: en-0020 -->

Unterstützt vollständige Datenleitungszuordnung; die Beziehung zwischen Datenleitung und Pfad kann neu zugeordnet werden

<!-- source-page: 10; block: en-0021 -->

Unterstützt TX Auto Stop Mode

<!-- source-page: 10; block: en-0022 -->

Unterstützt TX-&gt;RX-Loopback

<!-- source-page: 10; block: en-0023 -->

Unterstützt Multi SAI Combined (MSC)

<!-- source-page: 10; block: en-0024 -->

##### 1.2.1.2 SAI-Unterstützung der RK-Chipserien

<!-- source-page: 10; block: en-0025 -->

Die folgende Tabelle zeigt die für Peripherie verfügbaren SAI-Schnittstellen:

<!-- source-page: 11; block: en-0026 -->

| SAIx | RX-Leitungen | TX-Leitungen | Version | Hinweis |
| --- | --- | --- | --- | --- |
| RK1820 SAI-M0 | 4* | 4* | V4 | SDI0~3 und SDO3~0 multiplexiert |
| RK1820 SAI-M1/M2 | 4 | 4 | V4 |  |
| RK2116 SAI0-RMIO | 4 | 4 | V5 | Vollständig multiplexierte Matrix-IO |
| RK2116 SAI1/2/3-RMIO | 2 | 2 | V5 |  |
| RK2116 SAI4/5/6/7-RMIO | 1 | 1 | V5 |  |
| RK2118 SAI0/4-RMIO | 4 | 4 | V2 |  |
| RK2118 SAI1/2/3/5/6/7- RMIO | 2 | 2 | V2 |  |
| RK3528 SAI0 | 1 | 1 | V1 |  |
| RK3528 SAI1 | 4 | 4 | V1 |  |
| RK3506 SAI0-M0/RMIO | 4 | 1 | V2 |  |
| RK3506 SAI1-M0/RMIO | 1 | 4 | V2 |  |
| RK3506 SAI2-M0/M1 | 1 | 1 | V2 |  |
| RK3506 SAI3-M0 | 1 | 1 | V2 |  |
| RK3562 SAI0-M0 | 4* | 4* | V1 | SDI1~3 und SDO3~1 multiplexiert |
| RK3562 SAI0-M1 | 4 | 4 | V1 |  |
| RK3562 SAI1-M0 | 4 | 4 | V1 |  |
| RK3562 SAI1-M1 | 4* | 4* | V1 | SDI1~3 und SDO3~1 multiplexiert |
| RK3562 SAI2 | 1 | 1 | V1 |  |
| RK3576 SAI0-M0 | 4 | 4 | V1 |  |
| RK3576 SAI0-M1/M2 | 4* | 4* | V1 | SDI1~3 und SDO3~1 multiplexiert |
| RK3576 SAI1-M0 | 4* | 4* | V1 | SDI1~3 und SDO3~1 multiplexiert |
| RK3576 SAI1-M1 | 4 | 4 | V1 |  |
| RK3576 SAI2-M0/M1/M2 | 1 | 1 | V1 |  |
| RK3576 SAI3-M0/M1/M2/M3 | 1 | 1 | V1 |  |
| RK3576 SAI4-M0/M1/M2/M3 | 1 | 1 | V1 |  |
| RV1103B SAI | 1 | 1 | V3 |  |
| RV1126B SAI0-M0/M1 | 4* | 4* | V4 | SDI1~3 und SDO3~1 multiplexiert |
| RV1126B SAI1-M0/M1/M2 | 1 | 1 | V4 |  |
| RV1126B SAI2-M0/M1 | 3 | 1 | V4 |  |

<!-- source-page: 12; block: en-0028 -->

Tabelle 1-2: SAI-Unterstützung der RK-Chipserien

<!-- source-page: 12; block: en-0029 -->

###### 1.2.1.2.1 Beschreibung der SAI-Versionen

<!-- source-page: 12; block: en-0030 -->

| Version | Beschreibung |
| --- | --- |
| V1 | 1, Erste Version |
| V2 | 1, Frame Sync xN (FSXN) 2, Erkennung von Frame-Sync-Fehlern (FSE) 3, Erkennung verlorener Frame-Sync-Signale (FSLOST) 4, SAI-Verkettung 5, automatisches Gating beim Senden 6, Timing-Verschiebung nach links für TX |
| V3 | 1, L/R-Auswahl für Loopback (z. B. L:MIC R:LP) |
| V4 | 1, Robustere Frame-Integrität 2, Konfiguration der FIFO-Verschachtelung 3, Daten-Debugging |
| V5 | 1, MSC V2 2, Phasensynchronisation des Fsync-Takts mit MAC.pps 3, Taktsynchronisation mit USB oder MAC über ACC 4, Daten-Debugging nach Kanal-ID |

<!-- source-page: 12; block: en-0031 -->

Tabelle 1-3: Beschreibung der SAI-Versionen

<!-- source-page: 12; block: en-0032 -->

#### 1.2.2 ASRC

<!-- source-page: 12; block: en-0033 -->

##### 1.2.2.1 Funktionen des ASRC-Controllers

<!-- source-page: 12; block: en-0034 -->

Unterstützt Abtastratenkonvertierung von 8k ~ 384k

<!-- source-page: 12; block: en-0035 -->

Unterstützt ein Verhältnis von Eingangs- zu Ausgangsabtastrate zwischen 1:8 und 8:1.

<!-- source-page: 12; block: en-0036 -->

Unterstützt die Synchronisierung asynchroner Taktquellen.

<!-- source-page: 13; block: en-0037 -->

Unterstützt THD +N -120dB ~ -140dB @ 24bits

<!-- source-page: 13; block: en-0038 -->

Unterstützt Echtzeitmodus

<!-- source-page: 13; block: en-0039 -->

Unterstützt Dateimodus

<!-- source-page: 13; block: en-0040 -->

Unterstützt geringe Latenz

<!-- source-page: 13; block: en-0041 -->

Unterstützt Multi ASRC Combined

<!-- source-page: 13; block: en-0042 -->

##### 1.2.2.2 THD+N

<!-- source-page: 13; block: en-0043 -->

Testumgebung: AP -&gt; SAI -&gt; ASRC -&gt; SAI -&gt; AP

<!-- source-page: 13; block: en-0044 -->

###### 1.2.2.2.1 16bits

<!-- source-page: 13; block: en-0045 -->

Die folgende Tabelle zeigt THD+N(dB) bei 16 Bits. Anders als bei 24 Bits ist bei ganzzahligen Vielfachen kein deutliches Leistungsoptimum erkennbar; die Unterschiede sind insgesamt gering.

<!-- source-page: 13; block: en-0046 -->

| SR\RSR | 8k | 11.025k | 12K | 16K | 22.05K | 24K | 32K | 44.1K | 48K | 64K |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 8K | -96.2 | -96.0 | -95.9 | -96.0 | -95.7 | -95.8 | -95.7 | -95.6 | -95.7 | -95.6 |
| 11.025K | -96.6 | -95.9 | -95.8 | -95.8 | -95.6 | -95.6 | -95.5 | -95.5 | -95.5 | -95.5 |
| 12K | -96.7 | -96.0 | -96.1 | -95.5 | -95.7 | -95.5 | -95.5 | -95.5 | -95.5 | -95.5 |
| 16K | -97.2 | -96.5 | -96.3 | -95.6 | -95.5 | -95.5 | -95.5 | -95.4 | -95.4 | -95.4 |
| 22.05K | -97.7 | -97.0 | -96.8 | -96.2 | -95.4 | -95.5 | -95.4 | -95.3 | -95.3 | -95.3 |
| 24K | -97.7 | -97.1 | -96.9 | -96.3 | -95.6 | -95.5 | -95.5 | -95.3 | -95.3 | -95.3 |
| 32K | -97.8 | -97.4 | -97.3 | -96.7 | -96.2 | -96.0 | -95.4 | -95.3 | -95.3 | -95.3 |
| 44.1K | -98.3 | -97.7 | -97.7 | -97.1 | -96.6 | -96.5 | -96.0 | -95.2 | -95.2 | -95.2 |
| 48K | -98.3 | -97.7 | -97.7 | -97.2 | -96.7 | -96.6 | -96.1 | -95.5 | -95.2 | -95.3 |
| 64K | -98.2 | -98.0 | -98.0 | -97.5 | -97.1 | -96.9 | -96.5 | -96.0 | -95.8 | -95.3 |

<!-- source-page: 13; block: en-0047 -->

Tabelle 1-4: THD+N (dB) bei 16 Bits

<!-- source-page: 13; block: en-0048 -->

###### 1.2.2.2.2 24bits

<!-- source-page: 13; block: en-0049 -->

Die folgende Tabelle zeigt THD+N(dB) bei 24 Bits. Die Konvertierung mit ganzzahligem Verhältnis liefert die besten Ergebnisse.

<!-- source-page: 14; block: en-0050 -->

| SR\RSR | 8k | 11.025k | 12K | 16K | 22.05K | 24K | 32K | 44.1K | 48K | 64K |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 8K | -141.3 | -132.4 | -133.6 | -139.8 | 132.4 | -135.0 | -137.1 | -132.1 | -133.7 | -133.1 |
| 11.025K | -131.8 | -140.8 | -134.0 | -133.0 | -137.3 | -131.3 | -133.0 | -138.2 | -131.1 | -132.2 |
| 12K | -138.4 | -131.0 | -140.9 | -131.5 | -131.4 | -129.5 | -132.4 | -131.1 | -131.6 | -131.1 |
| 16K | -143.0 | -130.0 | -138.1 | -140.0 | -133.3 | -134.0 | -140.7 | -133.0 | -135.0 | -133.6 |
| 22.05K | -129.8 | -142.9 | -132.0 | -131.5 | -140.5 | -129.5 | -128.7 | -140.3 | -129.4 | -129.8 |
| 24K | -144.0 | -127.3 | -142.8 | -136.3 | -130.5 | -140.7 | -132.7 | -129.8 | -140.1 | -132.6 |
| 32K | -142.0 | -136.5 | -141.7 | -141.8 | -127.7 | -133.8 | -140.5 | -132.6 | -134.5 | -131.7 |
| 44.1K | -139.8 | -144.7 | -139.3 | -128.6 | -142.8 | -132.3 | -132.2 | -140.5 | -129.0 | -129.2 |
| 48K | -142.6 | -122.5 | -144.4 | -143.3 | -126.1 | -142.7 | -138.8 | -130.2 | -140.5 | -137.3 |
| 64K | -142.8 | -141.9 | -142.2 | -143.0 | -139.0 | -139.2 | -142.5 | -128.5 | -134.9 | -140.4 |

<!-- source-page: 14; block: en-0051 -->

Tabelle 1-5: THD+N (dB) bei 24 Bits

<!-- source-page: 14; block: en-0052 -->

##### 1.2.2.3 Latenz

<!-- source-page: 14; block: en-0053 -->

Latenz = Phasenverzögerung + FIFO-Verzögerung.

<!-- source-page: 14; block: en-0054 -->

###### 1.2.2.3.1 Phasenverzögerung

<!-- source-page: 14; block: en-0055 -->

RATIO = Abtastrate (Ausgang) / Abtastrate (Eingang)

<!-- source-page: 14; block: en-0056 -->

| RATIO | Phasenverzögerung |
| --- | --- |
| RATIO &lt;= 1 | 32 Samples @ SR(input) |
| RATIO &gt; 1 | 32 * ratio Samples @ SR(input) |

<!-- source-page: 14; block: en-0057 -->

###### 1.2.2.3.2 FIFO-Verzögerung

<!-- source-page: 14; block: en-0058 -->

FIFO-Verzögerung = ASRC_IN_THRESH + ASRC_OUT_THRESH.

<!-- source-page: 14; block: en-0059 -->

Dieser Parameter ist konfigurierbar. Die aktuelle Softwarekonfiguration ist in der Tabelle dargestellt:

<!-- source-page: 14; block: en-0060 -->

| Schwellwert | Wert |
| --- | --- |
| ASRC_IN_THRESH | 2 |
| ASRC_OUT_THRESH | 24 |

<!-- source-page: 15; block: en-0061 -->

###### 1.2.2.3.3 Beispiel

<!-- source-page: 15; block: en-0062 -->

| Fall | Latenz |
| --- | --- |
| 48k -&gt; 16k | Latenz = 32 + 2 + 24 = 58 Samples @ 48k, 1.2ms |
| 48k -&gt; 48k | Latenz = 32 + 2 + 24 = 58 Samples @ 48k, 1.2ms |
| 48k -&gt; 96k | Latenz = 32 * (96 / 48) + 2 + 24 = 90 Samples @ 48k, 1.9ms |

<!-- source-page: 15; block: en-0063 -->

Hinweis: Passen Sie zur Latenzoptimierung die FIFO-Verzögerung an.

<!-- source-page: 15; block: en-0064 -->

##### 1.2.2.4 ASRC-Unterstützung der RK-Chipserien

<!-- source-page: 15; block: en-0065 -->

| Chip | ASRC | Maximale Kapazität | Version |
| --- | --- | --- | --- |
| RK2118 | ASRC_8CH x 2, ASRC_4CH x 6 | 40 CH | V1 |
| RK3506 | ASRC_4CH x 2 | 8 CH | V1 |
| RK3576 | ASRC_4CH x 2, ASRC_2CH x 2 | 12 CH | V1 |
| RV1126B | ASRC_2CH x 2 | 4 CH | V1 |

<!-- source-page: 15; block: en-0066 -->

#### 1.2.3 I2S

<!-- source-page: 15; block: en-0067 -->

Die RK-Plattform besitzt zwei I2S-Controllertypen: I2S und I2S-TDM. I2S unterstützt I2S und PCM; I2S-TDM unterstützt I2S, PCM und TDM.

<!-- source-page: 15; block: en-0068 -->

##### 1.2.3.1 Funktionen des I2S-Controllers

<!-- source-page: 15; block: en-0069 -->

Unterstützt das 8-Kanal-I2S-Protokoll: Standard, linksbündig und rechtsbündig

<!-- source-page: 15; block: en-0070 -->

Unterstützt Stereo-PCM: early, late 1, late 2, late 3

<!-- source-page: 15; block: en-0071 -->

Unterstützt Master-/Slave-Modus; der Modus gilt gleichzeitig für TX/RX

<!-- source-page: 15; block: en-0072 -->

Unterstützt Abtastraten von 8k ~ 192k sowie 384k

<!-- source-page: 15; block: en-0073 -->

Unterstützt Bitbreiten von 16 ~ 32 Bits

<!-- source-page: 15; block: en-0074 -->

Unterstützt MSB-/LSB-Modus

<!-- source-page: 15; block: en-0075 -->

Unterstützt Taktphasenanpassung

<!-- source-page: 15; block: en-0076 -->

Unterstützt Taktkompensation

<!-- source-page: 15; block: en-0077 -->

Hinweis:

<!-- source-page: 15; block: en-0078 -->

Die Abtastrate 384k erfordert einen hochpräzisen clk. Dieser kann extern über den MCLK-PIN zugeführt werden; alternativ kann der Slave-Modus verwendet werden.

<!-- source-page: 15; block: en-0079 -->

Mono-PCM wird nicht unterstützt. Verwenden Sie bei Bedarf Stereo-PCM zur Übertragung von Mono-PCM und legen Sie die gültigen Daten in Slot 0 ab.

<!-- source-page: 16; block: en-0080 -->

Taktkompensation gleicht unterschiedliche Taktquellen aus, beispielsweise bei UAC. Sie unterliegt jedoch Einsatzbedingungen; siehe Kapitel zur Audiotaktkompensation.

<!-- source-page: 16; block: en-0081 -->

##### 1.2.3.2 Funktionen des I2S-TDM-Controllers

<!-- source-page: 16; block: en-0082 -->

Zusätzlich zu den Funktionen des I2S-Controllers unterstützt I2S-TDM:

<!-- source-page: 16; block: en-0083 -->

TDM-PCM mit 8 Slots: normal, left shift mode[0~3]

<!-- source-page: 16; block: en-0084 -->

TDM-I2S mit 8 Slots: normal, linksbündig, rechtsbündig

<!-- source-page: 16; block: en-0085 -->

Konfigurierbare Slot-Bitbreite: 16 ~ 32 Bits

<!-- source-page: 16; block: en-0086 -->

Vollständige Datenleitungszuordnung; die Beziehung zwischen Datenleitung und Pfad kann neu zugeordnet werden

<!-- source-page: 16; block: en-0087 -->

Asynchroner TX/RX-Modus mit unabhängigen Takten, Abtastraten, Bitbreiten und Protokollen

<!-- source-page: 16; block: en-0088 -->

Synchroner TX/RX-Modus mit gemeinsamem Takt

<!-- source-page: 16; block: en-0089 -->

Konfigurierbare PCM-FSYNC-Breite: [1~7] sclk-Zyklen oder ein Kanalblock

<!-- source-page: 16; block: en-0090 -->

Konfigurierbare I2S-FSYNC-Breite: halber oder ganzer Frame

<!-- source-page: 16; block: en-0091 -->

Hinweis:

<!-- source-page: 16; block: en-0092 -->

Es sind nur gerade Slot-Anzahlen möglich.

<!-- source-page: 16; block: en-0093 -->

Im TDM-I2S-Langframe-Modus sind 16 Übertragungskanäle möglich.

<!-- source-page: 16; block: en-0094 -->

Das TDM-Protokoll verwendet nur path-0. Passt der physische PIN nicht zum Kanal, ordnen Sie die Datenleitung deshalb path-0 zu.

<!-- source-page: 17; block: en-0095 -->

##### 1.2.3.3 I2S-Unterstützung der RK-Chipserien

<!-- source-page: 17; block: en-0096 -->

| Chip | I2S | I2S-TDM |
| --- | --- | --- |
| PX30/RK3326 | I2S1_2CH, I2S2_2CH | I2S0_8CH |
| RK1808 | I2S1 | I2S0 |
| RK3036 | I2S0 |  |
| RK3066 | I2S0, I2S1, I2S2 |  |
| RK312X | I2S_8CH, I2S_2CH |  |
| RK3188 | I2S0 |  |
| RK3288 | I2S0 |  |
| RK322X | I2S0, I2S1, I2S2 |  |
| RK3308 | I2S_2CH_0, I2S_2CH_1 | I2S_8CH_0, I2S_8CH_1, I2S_8CH_2, I2S_8CH_3 |
| RK3328 | I2S0, I2S1, I2S2 |  |
| RK3368 | I2S_8CH, I2S_2CH |  |
| RK3399 | I2S0, I2S1, I2S2 |  |
| RK3568/RK3566 |  | I2S0_8CH, I2S1_8CH, I2S2_2CH, I2S3_2CH |
| RK3588 | I2S2_2CH, I2S3_2CH | I2S0_8CH, I2S1_8CH |
| RV1108 | I2S0, I2S1, I2S2 |  |
| RV1126/RV1109 | I2S1_2CH, I2S2_2CH | I2S0_8CH |

<!-- source-page: 17; block: en-0097 -->

Tabelle 1-6: I2S-Unterstützung der RK-Chipserien

<!-- source-page: 17; block: en-0098 -->

#### 1.2.4 PDM

<!-- source-page: 17; block: en-0099 -->

Die RK-Plattform unterstützt digitale Mikrofone und ADCs mit PDM-Protokoll. Die Eigenschaften sind:

<!-- source-page: 17; block: en-0100 -->

##### 1.2.4.1 Funktionen des PDM-Controllers

<!-- source-page: 17; block: en-0101 -->

Unterstützt ausschließlich Master-Modus

<!-- source-page: 17; block: en-0102 -->

Unterstützt Mikrofonarrays mit bis zu 8 Mikrofonen

<!-- source-page: 17; block: en-0103 -->

Unterstützt Bitbreiten von 16 ~ 24 Bits

<!-- source-page: 17; block: en-0104 -->

Unterstützt Abtastraten von 8 ~ 48k

<!-- source-page: 17; block: en-0105 -->

Unterstützt Kanaltausch

<!-- source-page: 17; block: en-0106 -->

Unterstützt Hochpassfilter: 3.79 Hz, 60 Hz, 243 Hz, 493 Hz

<!-- source-page: 18; block: en-0107 -->

Unterstützt links- und rechtsbündige Speicherung

<!-- source-page: 18; block: en-0108 -->

Unterstützt vollständige Datenleitungszuordnung

<!-- source-page: 18; block: en-0109 -->

Unterstützt Taktphasenanpassung

<!-- source-page: 18; block: en-0110 -->

Unterstützt Taktkompensation

<!-- source-page: 18; block: en-0111 -->

Hinweis:

<!-- source-page: 18; block: en-0112 -->

Die Speicherausrichtung gilt nur für Formate mit mehr als 16 Bits. Diese werden wortweise gespeichert; die unteren Bits werden standardmäßig mit 0 aufgefüllt.

<!-- source-page: 18; block: en-0113 -->

Taktkompensation gleicht unterschiedliche Taktquellen aus, beispielsweise bei UAC. Sie unterliegt jedoch Einsatzbedingungen; siehe Kapitel zur Audiotaktkompensation.

<!-- source-page: 18; block: en-0114 -->

Die vollständige Datenleitungszuordnung wird erst ab RV1126 unterstützt: RV1126/RV1109, RK3568/RK3566 usw.

<!-- source-page: 18; block: en-0115 -->

##### 1.2.4.2 PDM-Unterstützung der RK-Chipserien

<!-- source-page: 18; block: en-0116 -->

| Chip | Name | Maximale Kanalzahl | Version |
| --- | --- | --- | --- |
| PX30/RK3326 | PDM | 8 | V2 |
| RK1808 | PDM | 8 | V2 |
| RK2108 | PDM | 4 | V3 |
| RK3308 | PDM_8CH | 8 | V2 |
| RK3328 | PDM | 8 | V1 |
| RK3568/RK3566 | PDM | 8 | V3 |
| RV1126/RV1109 | PDM | 8 | V3 |

<!-- source-page: 18; block: en-0117 -->

Tabelle 1-7: PDM-Unterstützung der RK-Chipserien

<!-- source-page: 18; block: en-0118 -->

Versionsbeschreibung

<!-- source-page: 19; block: en-0119 -->

| Version | Beschreibung |
| --- | --- |
| V1 | 1. Standardmodus mit den Takten 2.048/2.822/3.072 MHz. |
| V2 | 1. Fractional-Teilung ergänzt. 2. Speicherausrichtungsmodus ergänzt. |
| V3 | Fehlerkorrekturen: 1. Vorzeichenbit-Überlauf bei Eingangsamplituden nahe 0 db und aktiviertem HPF behoben. 2. Uneinheitliche Durchlassbandwelligkeit behoben; die neue Version erreicht weniger als 0.1 db. 3. Aliasing-Problem behoben. Funktionen: 1. Energiesparmodus mit 1.024/1.411/1.536 MHz ergänzt. 2. Hochleistungsmodus mit 4.096/5.644/6.144 MHz ergänzt. |

<!-- source-page: 19; block: en-0120 -->

Tabelle 1-8: Beschreibung der PDM-Versionen

<!-- source-page: 19; block: en-0121 -->

#### 1.2.5 DCODEC

<!-- source-page: 19; block: en-0122 -->

Die RK-Plattform unterstützt die digitale CODEC-Schnittstelle. Zusammen mit einem passenden analogen CODEC wie RK812 bildet sie einen vollständigen CODEC.

<!-- source-page: 19; block: en-0123 -->

Im DSM-Modus kann der Controller außerdem eine externe Endstufe (PA) direkt ansteuern und so bei Produkten mit gewöhnlichen Klanganforderungen Kosten senken.

<!-- source-page: 19; block: en-0124 -->

Unterstützt 3-Kanal-ADC

<!-- source-page: 19; block: en-0125 -->

Unterstützt Stereo-DAC

<!-- source-page: 19; block: en-0126 -->

Unterstützt asynchronen Modus: Wiedergabe und Aufnahme können unterschiedliche Abtastraten verwenden.

<!-- source-page: 19; block: en-0127 -->

Unterstützt synchronen Modus: Wiedergabe und Aufnahme müssen dieselbe Abtastrate verwenden.

<!-- source-page: 19; block: en-0128 -->

Unterstützt PGA / ALC

<!-- source-page: 19; block: en-0129 -->

Unterstützt DSM-Ausgang zur direkten PA-Ansteuerung

<!-- source-page: 19; block: en-0130 -->

Unterstützt Hochpassfilter

<!-- source-page: 19; block: en-0131 -->

#### 1.2.6 VAD

<!-- source-page: 19; block: en-0132 -->

Voice Activity Detection (VAD) empfängt DAI-Daten, wertet sie statistisch aus und löst bei Erreichen eines vorgegebenen Schwellwerts einen Interrupt zum Aufwecken des Systems aus. Abbildung 1-1 zeigt den vereinfachten Datenfluss:

<!-- source-page: 20; block: en-0133 -->

![Technische Originalabbildung: 1.2.6 VAD (Seite 20)](/docs/rockchip-audio/assets/en-p020-fig01.png)

<!-- source-page: 20; block: en-0134 -->

Abbildung 1-1: RK-VAD-Datenfluss

<!-- source-page: 20; block: en-0135 -->

1. Im Suspend-Zustand bleibt DAI -&gt; VAD -&gt; SRAM aktiv. VAD empfängt kontinuierlich Daten, filtert und lernt das Rauschen selbstständig und speichert Audiodaten im SRAM-Ringpuffer.

<!-- source-page: 20; block: en-0136 -->

2. Überschreitet das erkannte Schallsignal den Schwellwert, erzeugt VAD einen Interrupt zum Aufwecken der CPU. Die CPU deaktiviert VAD. Dadurch wechselt der Datenfluss automatisch zum DMAC-Pfad, also zum Standard-Aufnahmepfad: DAI -&gt; DMAC -&gt; DDR -&gt; CPU.

<!-- source-page: 20; block: en-0137 -->

3. Die CPU übernimmt die SRAM-Daten nahtlos in den Aufnahmepuffer. Diese Verarbeitung bleibt für den Benutzerraum transparent.

<!-- source-page: 20; block: en-0138 -->

4. Nach dem Aufwachen analysiert das ASR-Programm die aufgenommenen Daten, beispielsweise zur Schlüsselworterkennung.

<!-- source-page: 20; block: en-0139 -->

#### 1.2.7 SPDIF

<!-- source-page: 20; block: en-0140 -->

Die RK-Plattform unterstützt das SPDIF-Transmitter-Protokoll. RK3308 unterstützt zusätzlich SPDIF Receiver.

<!-- source-page: 20; block: en-0141 -->

Unterstützt Bitbreiten von 16 ~ 24 Bits

<!-- source-page: 20; block: en-0142 -->

Unterstützt Abtastrate 192k

<!-- source-page: 20; block: en-0143 -->

Unterstützt unkomprimiertes Stereo-Audio (LPCM)

<!-- source-page: 21; block: en-0144 -->

Unterstützt komprimiertes 5.1-/7.1-Audio, beispielsweise DD und DD+

<!-- source-page: 21; block: en-0145 -->

Unterstützt optische und koaxiale Übertragung

<!-- source-page: 21; block: en-0146 -->

Hinweis:

<!-- source-page: 21; block: en-0147 -->

Für eine optische Ausgabe mit Abtastrate 192k werden Komponenten mit 192k-Unterstützung benötigt.

<!-- source-page: 21; block: en-0148 -->

### 1.3 Combo DAI

<!-- source-page: 21; block: en-0149 -->

Die RK-Plattform kann beliebige DAI-Schnittstellen zu einem Combo DAI zusammenfassen, wie Abbildung 1-2 zeigt:

<!-- source-page: 21; block: en-0150 -->

![Technische Originalabbildung: 1.3 Combo DAI (Seite 21)](/docs/rockchip-audio/assets/en-p021-fig01.png)

<!-- source-page: 21; block: en-0151 -->

Abbildung 1-2: Combo DAI

<!-- source-page: 21; block: en-0152 -->

## 2. Entwicklung von Audiotreibern

<!-- source-page: 21; block: en-0153 -->

Dieses Kapitel beschreibt Audiounterstützung, Treiberentwicklung und Fehlersuche auf der RK-Plattform.

<!-- source-page: 21; block: en-0154 -->

### 2.1 Grundaufbau einer Soundkarte

<!-- source-page: 21; block: en-0155 -->

Dieser Abschnitt erläutert den Grundaufbau einer Soundkarte gemäß Abbildung 2-1:

<!-- source-page: 22; block: en-0156 -->

![Technische Originalabbildung: 2.1 Grundaufbau einer Soundkarte (Seite 22)](/docs/rockchip-audio/assets/en-p022-fig01.png)

<!-- source-page: 22; block: en-0157 -->

Abbildung 2-1: Aufbau einer ALSA-Soundkarte

<!-- source-page: 22; block: en-0158 -->

DAI: digitale Audioschnittstelle.

<!-- source-page: 22; block: en-0159 -->

MACHINE: Verbindet dai und codec zu einer neuen Soundkarte.

<!-- source-page: 22; block: en-0160 -->

DMAENGINE: Überträgt Daten zwischen Arbeitsspeicher und FIFO der dai.

<!-- source-page: 22; block: en-0161 -->

Beim Ergänzen einer Soundkarte auf Grundlage des veröffentlichten SDK muss normalerweise nur ein Codec-Treiber portiert oder geschrieben werden. In manchen Fällen ist zusätzlich ein Machine-Treiber nötig. Siehe Kapitel zur Entwicklung von Machine-Treibern.

<!-- source-page: 22; block: en-0162 -->

### 2.2 Treiberübersicht

<!-- source-page: 22; block: en-0163 -->

Treiber und Beschreibungen:

<!-- source-page: 22; block: en-0164 -->

```text
kernel/sound/soc/rockchip$ tree -I "*.o|*.h"
.
├── rockchip_asrc.c                             # asynchronous sample rate converter
├── rockchip_dlp.c                              # digital audio loopback
├── rockchip_dlp_pcm.c                          # for single dai dlp
├── rockchip_dummy_dai.c                        # used for multi-dais as channel map
├── rockchip_hdmi_analog.c                      # hdmi and codec share the same i2s
├── rockchip_hdmi.c                             # hdmi with jack det
├── rockchip_hdmi_dp.c                          # hdmi and dp share the same i2s
├── rockchip_i2s.c                              # old i2s which support i2s/pcm
├── rockchip_i2s_tdm.c                          # new i2s-tdm which support i2s/pcm/tdm
├── rockchip_multicodecs.c                      # support multi-streaming
├── rockchip_multi_dais.c                       # support combo-dais
├── rockchip_multi_dais_pcm.c                   # co-work with combo-dais
├── rockchip_pdm.c                              # pdm dai driver
├── rockchip_pdm_v2.c                           # pdmv2 dai driver
├── rockchip_sai.c                              # sai dai driver
├── rockchip_spdif.c                            # spdif tx dai driver
├── rockchip_spdifrx.c                          # spdif rx dai driver
├── rockchip_trcm.c                             # used for i2s-tdm
├── rockchip_utils.c                            # common utils
kernel/sound/soc/codecs$ tree -P "rk*.c|h*.c|d*.c"
.
├── dmic.c                                      # dmic, e.g. i2s dmics, pdm dmics
├── dummy-codec.c                               # dummy codec
├── hdmi-codec.c                                # hdmi codec driver
├── rk312x_codec.c                              # internal codec
├── rk3228_codec.c                              # internal codec
├── rk3308_codec.c                              # internal codec 8ch adc
├── rk3328_codec.c                              # internal codec
├── rk3506_codec.c                              # internal codec
├── rk3528_codec.c                              # internal codec
├── rk730.c                                     # rk730 audio codec
├── rk817_codec.c                               # codec in rk817 pmic ic
└── rk_dsm.c                                    # audio dsm
```

<!-- source-page: 23; block: en-0166 -->

### 2.3 Entwicklung von DAI-Treibern

<!-- source-page: 23; block: en-0167 -->

Die DAI-Treiber des veröffentlichten SDK sind bereits implementiert. Entwickler müssen lediglich die Eigenschaften entsprechend dem Anwendungsfall konfigurieren, um die gewünschten Funktionen zu aktivieren.

<!-- source-page: 23; block: en-0168 -->

#### 2.3.1 SAI

<!-- source-page: 23; block: en-0169 -->

##### 2.3.1.1 Protokollformat einstellen

<!-- source-page: 23; block: en-0170 -->

SAI unterstützt flexible Protokollzeitabläufe, wie die Abbildung zeigt:

<!-- source-page: 23; block: en-0171 -->

Unterstützt FSYNC-Formate mit beliebigem Tastverhältnis

<!-- source-page: 23; block: en-0172 -->

Unterstützt Datenübertragung mit beliebiger Verschiebung in Einheiten eines halben SCLK (SFT)

<!-- source-page: 23; block: en-0173 -->

Unterstützt FSYNC/SCLK INV

<!-- source-page: 23; block: en-0174 -->

Beispiel 1: FSYNC = 1 x SCLK, SFT = 2 x 0.5 SCLK; Empfang an der steigenden, Senden an der fallenden Flanke

<!-- source-page: 23; block: en-0175 -->

![Technische Originalabbildung: 2.3.1.1 Protokollformat einstellen (Seite 23)](/docs/rockchip-audio/assets/en-p023-vector04.png)

<!-- source-page: 23; block: en-0176 -->

Abbildung 2-2: Timing-Erzeugung

<!-- source-page: 23; block: en-0177 -->

Beispiel 2: FSYNC = 1 x SCLK, SFT = 2 x 0.5 SCLK; Empfang an der fallenden, Senden an der steigenden Flanke

<!-- source-page: 24; block: en-0178 -->

![Technische Originalabbildung: 2.3.1.1 Protokollformat einstellen (Seite 24)](/docs/rockchip-audio/assets/en-p024-vector01.png)

<!-- source-page: 24; block: en-0179 -->

Abbildung 2-3: Timing-Erzeugung mit SCLK INV

<!-- source-page: 24; block: en-0180 -->

Die nachfolgend aufgeführten gängigen Formate werden aus den oben gezeigten Zeitabläufen gebildet.

<!-- source-page: 24; block: en-0181 -->

###### 2.3.1.1.1 AUDIO_FMT_I2S

<!-- source-page: 24; block: en-0182 -->

![Technische Originalabbildung: 2.3.1.1.1 AUDIO_FMT_I2S (Seite 24)](/docs/rockchip-audio/assets/en-p024-vector02.png)

<!-- source-page: 24; block: en-0183 -->

###### 2.3.1.1.2 AUDIO_FMT_LEFT_J

<!-- source-page: 24; block: en-0184 -->

![Technische Originalabbildung: 2.3.1.1.2 AUDIO_FMT_LEFT_J (Seite 24)](/docs/rockchip-audio/assets/en-p024-vector03.png)

<!-- source-page: 25; block: en-0185 -->

###### 2.3.1.1.3 AUDIO_FMT_RIGHT_J

<!-- source-page: 25; block: en-0186 -->

![Technische Originalabbildung: 2.3.1.1.3 AUDIO_FMT_RIGHT_J (Seite 25)](/docs/rockchip-audio/assets/en-p025-vector01.png)

<!-- source-page: 25; block: en-0187 -->

###### 2.3.1.1.4 AUDIO_FMT_DSP_A

<!-- source-page: 25; block: en-0188 -->

![Technische Originalabbildung: 2.3.1.1.4 AUDIO_FMT_DSP_A (Seite 25)](/docs/rockchip-audio/assets/en-p025-vector02.png)

<!-- source-page: 25; block: en-0189 -->

###### 2.3.1.1.5 AUDIO_FMT_DSP_B

<!-- source-page: 25; block: en-0190 -->

![Technische Originalabbildung: 2.3.1.1.5 AUDIO_FMT_DSP_B (Seite 25)](/docs/rockchip-audio/assets/en-p025-vector03.png)

<!-- source-page: 25; block: en-0191 -->

###### 2.3.1.1.6 AUDIO_FMT_TDM_I2S

<!-- source-page: 25; block: en-0192 -->

![Technische Originalabbildung: 2.3.1.1.6 AUDIO_FMT_TDM_I2S (Seite 25)](/docs/rockchip-audio/assets/en-p025-vector04.png)

<!-- source-page: 26; block: en-0193 -->

###### 2.3.1.1.7 AUDIO_FMT_TDM_I2S_INV

<!-- source-page: 26; block: en-0194 -->

![Technische Originalabbildung: 2.3.1.1.7 AUDIO_FMT_TDM_I2S_INV (Seite 26)](/docs/rockchip-audio/assets/en-p026-vector01.png)

<!-- source-page: 26; block: en-0195 -->

###### 2.3.1.1.8 AUDIO_FMT_TDM_LEFT_J

<!-- source-page: 26; block: en-0196 -->

![Technische Originalabbildung: 2.3.1.1.8 AUDIO_FMT_TDM_LEFT_J (Seite 26)](/docs/rockchip-audio/assets/en-p026-vector02.png)

<!-- source-page: 26; block: en-0197 -->

###### 2.3.1.1.9 AUDIO_FMT_TDM_DSP_A

<!-- source-page: 26; block: en-0198 -->

![Technische Originalabbildung: 2.3.1.1.9 AUDIO_FMT_TDM_DSP_A (Seite 26)](/docs/rockchip-audio/assets/en-p026-vector03.png)

<!-- source-page: 26; block: en-0199 -->

###### 2.3.1.1.10 AUDIO_FMT_TDM_DSP_B

<!-- source-page: 26; block: en-0200 -->

![Technische Originalabbildung: 2.3.1.1.10 AUDIO_FMT_TDM_DSP_B (Seite 26)](/docs/rockchip-audio/assets/en-p026-vector04.png)

<!-- source-page: 27; block: en-0201 -->

##### 2.3.1.2 Mehrere Datenleitungen

<!-- source-page: 27; block: en-0202 -->

Bei mehreren Datenleitungen sind die Kanäle in Einheiten von jeweils 2 Kanälen verschachtelt. Gibt die Gegenstelle bei mehr als 2 Leitungen die Daten in Leitungsreihenfolge aus, ist eine Entflechtung erforderlich. Dazu kann die entsprechende API direkt aufgerufen werden.

<!-- source-page: 27; block: en-0203 -->

Die Kanalzuordnung mehrerer Leitungen wird nachfolgend anhand von TDM16 erläutert. Andere Formate verhalten sich entsprechend.

<!-- source-page: 27; block: en-0204 -->

###### 2.3.1.2.1 TDM16 x 1

<!-- source-page: 27; block: en-0205 -->

![Technische Originalabbildung: 2.3.1.2.1 TDM16 x 1 (Seite 27)](/docs/rockchip-audio/assets/en-p027-vector01.png)

<!-- source-page: 27; block: en-0206 -->

###### 2.3.1.2.2 TDM16 x 2

<!-- source-page: 27; block: en-0207 -->

![Technische Originalabbildung: 2.3.1.2.2 TDM16 x 2 (Seite 27)](/docs/rockchip-audio/assets/en-p027-vector02.png)

<!-- source-page: 27; block: en-0209 -->

###### 2.3.1.2.3 TDM16 x 3

<!-- source-page: 27; block: en-0210 -->

![Technische Originalabbildung: 2.3.1.2.3 TDM16 x 3 (Seite 27)](/docs/rockchip-audio/assets/en-p027-vector05.png)

<!-- source-page: 28; block: en-0212 -->

###### 2.3.1.2.4 TDM16 x 4

<!-- source-page: 28; block: en-0213 -->

![Technische Originalabbildung: 2.3.1.2.4 TDM16 x 4 (Seite 28)](/docs/rockchip-audio/assets/en-p028-vector01.png)

<!-- source-page: 28; block: en-0215 -->

###### 2.3.1.2.5 Geordnete und verschachtelte Anordnung

<!-- source-page: 28; block: en-0216 -->

Die Zuordnung zu einem geordneten Format wird anhand von TDM16 x 2 erklärt. Für andere Konfigurationen gilt dasselbe.

<!-- source-page: 28; block: en-0217 -->

Die Gegenstelle überträgt das Signal wie dargestellt in fortlaufender Reihenfolge auf der Leitung. SAI empfängt es verschachtelt. Für eine geordnete Ausgabe müssen die empfangenen Daten daher entsprechend der Abbildung entflochten werden.

<!-- source-page: 28; block: en-0218 -->

![Technische Originalabbildung: 2.3.1.2.5 Geordnete und verschachtelte Anordnung (Seite 28)](/docs/rockchip-audio/assets/en-p028-vector06.png)

<!-- source-page: 28; block: en-0220 -->

Abbildung 2-4: Geordnete und verschachtelte Anordnung

<!-- source-page: 28; block: en-0221 -->

| CH0 | CH1 | CH2 | CH3 | CH4 | CH5 | CH6 | CH7 | CH8 | CH9 | CH10 | CH11 | CH12 | CH13 | CH14 | CH15 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CH16 | CH17 | CH18 | CH19 | CH20 | CH21 | CH22 | CH23 | CH24 | CH25 | CH26 | CH27 | CH28 | CH29 | CH30 | CH31 |

<!-- source-page: 28; block: en-0222 -->

![Technische Originalabbildung: 2.3.1.2.5 Geordnete und verschachtelte Anordnung (Seite 28)](/docs/rockchip-audio/assets/en-p028-vector11.png)

<!-- source-page: 28; block: en-0223 -->

| CH0 | CH1 | CH16 | CH17 | CH2 | CH3 | CH18 | CH19 | CH4 | CH5 | CH20 | CH21 | CH6 | CH7 | CH22 | CH23 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CH8 | CH9 | CH24 | CH25 | CH10 | CH11 | CH26 | CH27 | CH12 | CH13 | CH28 | CH29 | CH14 | CH15 | CH30 | CH31 |

<!-- source-page: 28; block: en-0224 -->

Abbildung 2-5: Entflochtene Daten

<!-- source-page: 29; block: en-0225 -->

##### 2.3.1.3 Mehrere SAI kombinieren

<!-- source-page: 29; block: en-0226 -->

Mehrere SAIs können zu einer SAI zusammengefasst werden, um die Anzahl der Datenleitungen zu erweitern.

<!-- source-page: 29; block: en-0227 -->

Das Verfahren verwendet einen Master mit mehreren Slaves; der SoC verteilt das Taktsignal intern.

<!-- source-page: 29; block: en-0228 -->

Nur die Master-SAI liefert den Schnittstellentakt. Berücksichtigen Sie dies beim Hardwarelayout.

<!-- source-page: 29; block: en-0229 -->

SAI V5 unterstützt das Zusammenführen von Audioströmen; frühere Versionen erledigen dies über DMA.

<!-- source-page: 29; block: en-0230 -->

Beispiel: SAI0 + SAI1 + SAI2 bilden I2S 8TX

<!-- source-page: 29; block: en-0231 -->

![Technische Originalabbildung: 2.3.1.3 Mehrere SAI kombinieren (Seite 29)](/docs/rockchip-audio/assets/en-p029-vector04.png)

<!-- source-page: 29; block: en-0232 -->

##### 2.3.1.4 Slot-Maske

<!-- source-page: 29; block: en-0233 -->

SAI unterstützt Slot-Maskierung. Durch Setzen der Maskenbits lassen sich die Daten der entsprechenden Slots ignorieren.

<!-- source-page: 29; block: en-0234 -->

Beispiel 1: TDM16 x 1, letzte 2 Slots maskiert

<!-- source-page: 29; block: en-0235 -->

![Technische Originalabbildung: 2.3.1.4 Slot-Maske (Seite 29)](/docs/rockchip-audio/assets/en-p029-vector05.png)

<!-- source-page: 29; block: en-0236 -->

Beispiel 2: TDM16 x 2, letzte 2 Slots maskiert

<!-- source-page: 29; block: en-0237 -->

![Technische Originalabbildung: 2.3.1.4 Slot-Maske (Seite 29)](/docs/rockchip-audio/assets/en-p029-vector06.png)

<!-- source-page: 29; block: en-0238 -->

Hinweis:

<!-- source-page: 29; block: en-0239 -->

Die Slot-Maske wirkt gleichzeitig auf alle Leitungen. Beachten Sie dies bei mehreren Datenleitungen.

<!-- source-page: 30; block: en-0240 -->

##### 2.3.1.5 Slot-Breite einstellen

<!-- source-page: 30; block: en-0241 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| rockchip,slot-width | int | Standard-Slot-Breite: 32bit |

<!-- source-page: 30; block: en-0242 -->

Beispiel: Slot-Breite 16 Bits, typisch für BT-Anwendungen; entspricht der I2S-Eigenschaft bclk-fs.

<!-- source-page: 30; block: en-0243 -->

```text
&sai0 {
        rockchip,slot-width = <16>;
};
```

<!-- source-page: 30; block: en-0244 -->

##### 2.3.1.6 Vollständige Datenleitungszuordnung einstellen

<!-- source-page: 30; block: en-0245 -->

Die Hardware kann eine beliebige Datenleitung verwenden. Konfigurieren Sie die entsprechenden Eigenschaften, um die Kanalreihenfolge zu korrigieren, oder wählen und prüfen Sie die Zuordnung über path sel.

<!-- source-page: 30; block: en-0246 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| rockchip,sai-tx-route |  | Standardreihenfolge: SDO0 &#124; SDO1 &#124; SDO2 &#124; SDO3 |
| rockchip,sai-rx-route |  | Standardreihenfolge: SDI0&#124; SDI1 &#124; SDI2 &#124; SDI3 |

<!-- source-page: 30; block: en-0247 -->

Beispiel: Wiedergabekanalreihenfolge "SDO3 &#124; SDO2 &#124; SDO1 &#124; SDO0"

<!-- source-page: 30; block: en-0248 -->

```text
&sai0 {
        rockchip,sai-tx-route = <3 2 1 0>;
};
```

<!-- source-page: 30; block: en-0249 -->

##### 2.3.1.7 Mehrere Datenleitungen einstellen

<!-- source-page: 30; block: en-0250 -->

Diese Eigenschaft dient hauptsächlich TDM mit mehreren Leitungen. Auswahl und Prüfung sind auch über lanes sel möglich.

<!-- source-page: 30; block: en-0251 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| rockchip,tdm-tx-lanes | int | Standard: 1 Leitung |
| rockchip,tdm-rx-lanes | int | Standard: 1 Leitung |

<!-- source-page: 30; block: en-0252 -->

Beispiel: tdm-tx x 4, tdm-rx x 2

<!-- source-page: 30; block: en-0253 -->

```text
&sai0 {
        rockchip,tdm-tx-lanes = <4>;
        rockchip,tdm-rx-lanes = <2>;
};
```

<!-- source-page: 31; block: en-0254 -->

##### 2.3.1.8 Wartezeit

<!-- source-page: 31; block: en-0255 -->

Diese Eigenschaft steuert vor allem den Timeout im Slave-Modus. Fällt der Peripherietakt aus, kehrt das ASoC-Framework standardmäßig nach 10s zurück. Eine kürzere Wartezeit kann das Verhalten verbessern. Empfohlen wird ein Wert mindestens in Höhe der Pufferzeit.

<!-- source-page: 31; block: en-0256 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| rockchip,sai-tx-wait-time-ms | int | Standard: 10s |
| rockchip,sai-rx-wait-time-ms | int | Standard: 10s |

<!-- source-page: 31; block: en-0257 -->

Beispiel: Pufferzeit 40ms, Wartezeit 50ms

<!-- source-page: 31; block: en-0258 -->

```text
&sai0 {
        rockchip,sai-tx-wait-time-ms = <50>;
        rockchip,sai-rx-wait-time-ms = <50>;
};
```

<!-- source-page: 31; block: en-0259 -->

##### 2.3.1.9 mclkout / mclkin

<!-- source-page: 31; block: en-0260 -->

mclk unterstützt mclkout und mclkin über gemeinsam verwendete Pins. Die Einsatzfälle ergeben sich zusammen mit dem Master-/Slave-Modus von sai. Benötigt die Peripherie keinen mclk, kann die Verbindung entfallen.

<!-- source-page: 31; block: en-0261 -->

| sai | mclk | Beschreibung |
| --- | --- | --- |
| master | out | SoC liefert den Takt an die Peripherie |
| master | in | sai verwendet externen mclkin; typischer Einsatz: gemeinsame Audiotaktquelle |
| slave | out | Peripherie arbeitet als Master, SoC liefert mclk |
| slave | in | Kein Anwendungsfall |

<!-- source-page: 31; block: en-0262 -->

Beispiel: mclkout

<!-- source-page: 31; block: en-0263 -->

```text
rk817_codec: codec {
        #sound-dai-cells = <0>;
        compatible = "rockchip,rk817-codec";
        clocks = <&mclkout_sai0>;
        clock-names = "mclk";
        assigned-clocks = <&mclkout_sai0>;
        assigned-clock-rates = <12288000>;
        pinctrl-names = "default";
        pinctrl-0 = <&i2s0m0_mclk>;
        hp-volume = <20>;
        spk-volume = <3>;
        mic-in-differential;
        status = "okay";
};
```

<!-- source-page: 32; block: en-0265 -->

Beispiel: mclkin

<!-- source-page: 32; block: en-0266 -->

```text
&sai0 {
        assigned-clocks = <&cru CLK_SAI0>;
        assigned-clock-parents = <&mclkin_i2s0>;
        pinctrl-0 = <&sai0_sdi
                     &sai0_sdo
                     &sai0_lrck
                     &sai0_sclk
                     &sai0_mclk>;
};
&mclkin_sai0 {
        clock-frequency = <24576000>;
        status = "okay";
};
```

<!-- source-page: 32; block: en-0267 -->

##### 2.3.1.10 Bedienelemente

<!-- source-page: 32; block: en-0268 -->

Modi, Protokolle und Funktionen lassen sich mit amixer oder tinymix einfach anzeigen und einstellen.

<!-- source-page: 32; block: en-0269 -->

```text
# amixer  -c 0 controls
numid=34,iface=MIXER,name='SAI2 Clk Auto Switch'
numid=5,iface=MIXER,name='SAI2 Receive Mono Slot Select'
numid=6,iface=MIXER,name='SAI2 Receive Mono Switch'
numid=29,iface=MIXER,name='SAI2 Receive PATH0 Source Select'
numid=28,iface=MIXER,name='SAI2 Receive PATH1 Source Select'
numid=27,iface=MIXER,name='SAI2 Receive PATH2 Source Select'
numid=26,iface=MIXER,name='SAI2 Receive PATH3 Source Select'
numid=4,iface=MIXER,name='SAI2 Receive SDIx Select'
numid=2,iface=MIXER,name='SAI2 Receive Start Mode Sel'
numid=11,iface=MIXER,name='SAI2 SDI0 Loopback I2S LR Channel Sel'
numid=15,iface=MIXER,name='SAI2 SDI0 Loopback I2S LR Switch'
numid=19,iface=MIXER,name='SAI2 SDI0 Loopback Src Select'
numid=23,iface=MIXER,name='SAI2 SDI0 Loopback Switch'
numid=10,iface=MIXER,name='SAI2 SDI1 Loopback I2S LR Channel Sel'
numid=14,iface=MIXER,name='SAI2 SDI1 Loopback I2S LR Switch'
numid=18,iface=MIXER,name='SAI2 SDI1 Loopback Src Select'
numid=22,iface=MIXER,name='SAI2 SDI1 Loopback Switch'
numid=9,iface=MIXER,name='SAI2 SDI2 Loopback I2S LR Channel Sel'
numid=13,iface=MIXER,name='SAI2 SDI2 Loopback I2S LR Switch'
numid=17,iface=MIXER,name='SAI2 SDI2 Loopback Src Select'
numid=21,iface=MIXER,name='SAI2 SDI2 Loopback Switch'
numid=8,iface=MIXER,name='SAI2 SDI3 Loopback I2S LR Channel Sel'
numid=12,iface=MIXER,name='SAI2 SDI3 Loopback I2S LR Switch'
numid=16,iface=MIXER,name='SAI2 SDI3 Loopback Src Select'
numid=20,iface=MIXER,name='SAI2 SDI3 Loopback Switch'
numid=25,iface=MIXER,name='SAI2 Sync In Switch'
numid=24,iface=MIXER,name='SAI2 Sync Out Switch'
numid=7,iface=MIXER,name='SAI2 Transmit Mono Switch'
numid=33,iface=MIXER,name='SAI2 Transmit SDO0 Source Select'
numid=32,iface=MIXER,name='SAI2 Transmit SDO1 Source Select'
numid=31,iface=MIXER,name='SAI2 Transmit SDO2 Source Select'
numid=30,iface=MIXER,name='SAI2 Transmit SDO3 Source Select'
numid=3,iface=MIXER,name='SAI2 Transmit SDOx Select'
numid=1,iface=MIXER,name='SAI2 Transmit Start Mode Sel'
numid=35,iface=PCM,name='SAI2 PCM Read Wait Time MS'
numid=36,iface=PCM,name='SAI2 PCM Write Wait Time MS'
```

<!-- source-page: 33; block: en-0271 -->

###### 2.3.1.10.1 path sel

<!-- source-page: 33; block: en-0272 -->

sai überträgt Daten in der Reihenfolge PATH0~3: Bei 1 aktivierten Leitung wird PATH0 verwendet, bei 2 Leitungen PATH0/1 usw.

<!-- source-page: 33; block: en-0273 -->

PATHx und SDx lassen sich vollständig zuordnen. Durch Auswahl von SDIx / SDOx können Daten flexibel geführt und Hardwareverbindungen angepasst werden.

<!-- source-page: 33; block: en-0274 -->

```text
numid=29,iface=MIXER,name='SAI2 Receive PATH0 Source Select'
numid=28,iface=MIXER,name='SAI2 Receive PATH1 Source Select'
numid=27,iface=MIXER,name='SAI2 Receive PATH2 Source Select'
numid=26,iface=MIXER,name='SAI2 Receive PATH3 Source Select'
numid=33,iface=MIXER,name='SAI2 Transmit SDO0 Source Select'
numid=32,iface=MIXER,name='SAI2 Transmit SDO1 Source Select'
numid=31,iface=MIXER,name='SAI2 Transmit SDO2 Source Select'
numid=30,iface=MIXER,name='SAI2 Transmit SDO3 Source Select'
```

<!-- source-page: 33; block: en-0275 -->

Beispiel: SAI2 gibt 4CH-I2S-Daten über SDO2/3 aus

<!-- source-page: 33; block: en-0276 -->

```text
# amixer cset iface=MIXER,name='SAI2 Transmit SDO2 Source Select' "From PATH0"
numid=31,iface=MIXER,name='SAI2 Transmit SDO2 Source Select'
  ; type=ENUMERATED,access=rw------,values=1,items=4
  ; Item #0 'From PATH0'
  ; Item #1 'From PATH1'
  ; Item #2 'From PATH2'
  ; Item #3 'From PATH3'
  : values=0
# amixer cset iface=MIXER,name='SAI2 Transmit SDO3 Source Select' "From PATH1"
numid=30,iface=MIXER,name='SAI2 Transmit SDO3 Source Select'
  ; type=ENUMERATED,access=rw------,values=1,items=4
  ; Item #0 'From PATH0'
  ; Item #1 'From PATH1'
  ; Item #2 'From PATH2'
  ; Item #3 'From PATH3'
  : values=1
```

<!-- source-page: 33; block: en-0277 -->

Beispiel: SAI2 empfängt 2CH-I2S-Daten über SDI3

<!-- source-page: 34; block: en-0278 -->

```text
# amixer cset iface=MIXER,name='SAI2 Receive PATH0 Source Select' "From SDI3"
numid=29,iface=MIXER,name='SAI2 Receive PATH0 Source Select'
  ; type=ENUMERATED,access=rw------,values=1,items=4
  ; Item #0 'From SDI0'
  ; Item #1 'From SDI1'
  ; Item #2 'From SDI2'
  ; Item #3 'From SDI3'
  : values=3
```

<!-- source-page: 34; block: en-0279 -->

###### 2.3.1.10.2 lanes sel

<!-- source-page: 34; block: en-0280 -->

Wählen Sie die Anzahl N der zu verwendenden SDO- und SDI-Leitungen. Standard ist "Auto". Im I2S-Format werden Leitungen automatisch mit 2ch pro Leitung aktiviert; im TDM-Modus verwendet "Auto" nur 1 Leitung. Für TDM mit mehreren Leitungen muss N vor dem Controllerstart konfiguriert werden.

<!-- source-page: 34; block: en-0281 -->

```text
numid=4,iface=MIXER,name='SAI2 Receive SDIx Select'
numid=3,iface=MIXER,name='SAI2 Transmit SDOx Select'
```

<!-- source-page: 34; block: en-0282 -->

Beispiel: TDM-TX: 2 Leitungen; TDM-RX: 4 Leitungen

<!-- source-page: 34; block: en-0283 -->

```text
# amixer -c 0 cset iface=MIXER,name='SAI2 Transmit SDOx Select' "SDOx2"
numid=3,iface=MIXER,name='SAI2 Transmit SDOx Select'
  ; type=ENUMERATED,access=rw------,values=1,items=5
  ; Item #0 'Auto'
  ; Item #1 'SDOx1'
  ; Item #2 'SDOx2'
  ; Item #3 'SDOx3'
  ; Item #4 'SDOx4'
  : values=2
# amixer -c 0 cset iface=MIXER,name='SAI2 Receive SDIx Select' "SDIx4"
numid=4,iface=MIXER,name='SAI2 Receive SDIx Select'
  ; type=ENUMERATED,access=rw------,values=1,items=5
  ; Item #0 'Auto'
  ; Item #1 'SDIx1'
  ; Item #2 'SDIx2'
  ; Item #3 'SDIx3'
  ; Item #4 'SDIx4'
  : values=4
```

<!-- source-page: 34; block: en-0284 -->

###### 2.3.1.10.3 loopback sel

<!-- source-page: 34; block: en-0285 -->

Digitales Loopback wird auf Leitungsebene unterstützt. Wählen Sie SDOx als Quelle von SDIx. Eine Hardwareverbindung ist nicht erforderlich.

<!-- source-page: 35; block: en-0286 -->

```text
numid=19,iface=MIXER,name='SAI2 SDI0 Loopback Src Select'
numid=23,iface=MIXER,name='SAI2 SDI0 Loopback Switch'
numid=18,iface=MIXER,name='SAI2 SDI1 Loopback Src Select'
numid=22,iface=MIXER,name='SAI2 SDI1 Loopback Switch'
numid=17,iface=MIXER,name='SAI2 SDI2 Loopback Src Select'
numid=21,iface=MIXER,name='SAI2 SDI2 Loopback Switch'
numid=16,iface=MIXER,name='SAI2 SDI3 Loopback Src Select'
numid=20,iface=MIXER,name='SAI2 SDI3 Loopback Switch'
```

<!-- source-page: 35; block: en-0287 -->

Beispiel: Das Loopback-Signal für SDI1 stammt von SDO3

<!-- source-page: 35; block: en-0288 -->

```text
# amixer -c 0 cset iface=MIXER,name='SAI2 SDI0 Loopback Src Select' "From SDO3"
numid=19,iface=MIXER,name='SAI2 SDI0 Loopback Src Select'
  ; type=ENUMERATED,access=rw------,values=1,items=4
  ; Item #0 'From SDO0'
  ; Item #1 'From SDO1'
  ; Item #2 'From SDO2'
  ; Item #3 'From SDO3'
  : values=3
```

<!-- source-page: 35; block: en-0289 -->

Ab SAI-V3 wird die I2S-Loopback-Kombination 1mic + 1lp unterstützt. Die Chipunterstützung steht in der SAI-Übersicht.

<!-- source-page: 35; block: en-0290 -->

```text
numid=11,iface=MIXER,name='SAI2 SDI0 Loopback I2S LR Channel Sel'
numid=15,iface=MIXER,name='SAI2 SDI0 Loopback I2S LR Switch'
numid=10,iface=MIXER,name='SAI2 SDI1 Loopback I2S LR Channel Sel'
numid=14,iface=MIXER,name='SAI2 SDI1 Loopback I2S LR Switch'
numid=9,iface=MIXER,name='SAI2 SDI2 Loopback I2S LR Channel Sel'
numid=13,iface=MIXER,name='SAI2 SDI2 Loopback I2S LR Switch'
numid=8,iface=MIXER,name='SAI2 SDI3 Loopback I2S LR Channel Sel'
numid=12,iface=MIXER,name='SAI2 SDI3 Loopback I2S LR Switch'
```

<!-- source-page: 35; block: en-0291 -->

Beispiel: I2S, linker Kanal MIC-Daten + rechter Kanal Loopback-Daten

<!-- source-page: 35; block: en-0292 -->

```text
# amixer -c 0 cset iface=MIXER,name='SAI2 SDI0 Loopback I2S LR Channel Sel' "L:M IC R:LP"
numid=11,iface=MIXER,name='SAI2 SDI0 Loopback I2S LR Channel Sel'
  ; type=ENUMERATED,access=rw------,values=1,items=2
  ; Item #0 'L:MIC R:LP'
  ; Item #1 'L:LP R:MIC'
  : values=0
```

<!-- source-page: 35; block: en-0293 -->

#### 2.3.2 ASRC

<!-- source-page: 35; block: en-0294 -->

Derzeit bindet der multicodec-Treiber ASRC in den Audiostrom ein.

<!-- source-page: 36; block: en-0295 -->

##### 2.3.2.1 Soundkarte konfigurieren

<!-- source-page: 36; block: en-0296 -->

1. CONFIG aktivieren

<!-- source-page: 36; block: en-0297 -->

```text
CONFIG_SND_SOC_ROCKCHIP_ASRC=y
```

<!-- source-page: 36; block: en-0298 -->

2. Nach erfolgreicher Soundkartenkonfiguration werden zwei Geräte erzeugt. Beispiel Soundkarte 0:

<!-- source-page: 36; block: en-0299 -->

| Soundkartengerät | Beschreibung |
| --- | --- |
| hw:0,0 | ohne asrc |
| hw:0,1 | mit asrc |

<!-- source-page: 36; block: en-0300 -->

Beispiel 1: SAI(Slave) -&gt; ASRC -&gt; MEM

<!-- source-page: 36; block: en-0301 -->

```text
sai0-asrc-sound {
    compatible = "rockchip,multicodecs-card";
    rockchip,card-name = "rockchip,sai0-asrc";
    rockchip,mclk-fs = <256>;
    rockchip,format = "i2s";
    rockchip,cpu = <&sai0>;
    rockchip,asrc = <&asrc0>;
    rockchip,codec = <&dummy_codec>;
    rockchip,bitclock-master = <&dummy_codec>;
    rockchip,frame-master = <&dummy_codec>;
    rockchip,audio-routing =
        "Dummy Playback", "SAI0 Playback",
        "SAI0 Capture", "Dummy Capture",
        "SAI0 Playback", "ASRC0 Playback",
        "ASRC0 Capture", "SAI0 Capture";
};
```

<!-- source-page: 36; block: en-0302 -->

Beispiel 2: SPDIFRX -&gt; ASRC -&gt; MEM

<!-- source-page: 36; block: en-0303 -->

```text
spdifrx0-asrc-sound {
    compatible = "rockchip,multicodecs-card";
    rockchip,card-name = "spdifrx0-asrc";
    rockchip,cpu = <&spdif_rx0>;
    rockchip,asrc = <&asrc0>;
    rockchip,codec = <&dummy_codec>;
    rockchip,audio-routing =
        "Dummy Capture", "Dummy Capture",
        "ASRC0 Capture", "SPDIF_RX0 Capture";
};
```

<!-- source-page: 37; block: en-0304 -->

##### 2.3.2.2 Resampling einstellen

<!-- source-page: 37; block: en-0305 -->

Resampling-Takt wie folgt auf 48K einstellen:

<!-- source-page: 37; block: en-0306 -->

```text
amixer -c 0 sset 'ASRC0 SET RESAMPLE RATE' 48000
```

<!-- source-page: 37; block: en-0307 -->

##### 2.3.2.3 Taktquellen einstellen

<!-- source-page: 37; block: en-0308 -->

Legen Sie die SRC-/DST-Tracking-Taktquellen für ASRC fest. SRC/DST können lokale und externe Takte beliebig kombinieren.

<!-- source-page: 37; block: en-0309 -->

Beispiel 1: Der SRC-Takt von ASRC stammt von SAI0, der DST-Takt von ASRC. ASRC gleicht die Asynchronität zwischen SAI0 und lokalem Takt aus.

<!-- source-page: 37; block: en-0310 -->

```text
amixer -c 0 sset 'ASRC0 RX LINK DAI Select' 'sai0'
amixer -c 0 sset 'ASRC0 TX LINK DAI Select' 'asrc0'
```

<!-- source-page: 37; block: en-0311 -->

Beispiel 2: Der SRC-Takt von ASRC stammt von SAI0, der DST-Takt von SAI2. ASRC gleicht die Asynchronität zwischen SAI0 und SAI2 aus.

<!-- source-page: 37; block: en-0312 -->

```text
amixer -c 0 sset 'ASRC0 RX LINK DAI Select' 'sai0'
amixer -c 0 sset 'ASRC0 TX LINK DAI Select' 'sai2'
```

<!-- source-page: 37; block: en-0313 -->

##### 2.3.2.4 Aufnahme

<!-- source-page: 37; block: en-0314 -->

```text
amixer -c 0 sset 'ASRC0 SET RESAMPLE RATE' 48000
amixer -c 0 sset 'ASRC0 RX LINK DAI Select' 'sai0'
amixer -c 0 sset 'ASRC0 TX LINK DAI Select' 'asrc0'
arecord -D hw:0,1 --period-size=1024 --buffer-size=4096 -r 48000 -c 2 -f s16_le r.wav
```

<!-- source-page: 37; block: en-0315 -->

##### 2.3.2.5 Wiedergabe

<!-- source-page: 37; block: en-0316 -->

```text
amixer -c 0 sset 'ASRC0 SET RESAMPLE RATE' 48000
amixer -c 0 sset 'ASRC0 RX LINK DAI Select' 'asrc0'
amixer -c 0 sset 'ASRC0 TX LINK DAI Select' 'sai0'
aplay -D hw:0,1 --period-size=1024 --buffer-size=4096 r.wav
```

<!-- source-page: 38; block: en-0317 -->

#### 2.3.3 I2S

<!-- source-page: 38; block: en-0318 -->

##### 2.3.3.1 Protokollformat konfigurieren

<!-- source-page: 38; block: en-0319 -->

Der Machine-Treiber liest das DTS und ruft set_fmt auf, um das Protokollformat des Controllers einzustellen. Für Simple Card siehe den entsprechenden Abschnitt.

<!-- source-page: 38; block: en-0320 -->

##### 2.3.3.2 Master-/Slave-Modus konfigurieren

<!-- source-page: 38; block: en-0321 -->

Der Machine-Treiber liest das DTS und ruft set_fmt auf, um den Master-/Slave-Modus des Controllers einzustellen. Für Simple Card siehe den entsprechenden Abschnitt.

<!-- source-page: 38; block: en-0322 -->

##### 2.3.3.3 Taktphaseninvertierung konfigurieren

<!-- source-page: 38; block: en-0323 -->

Der Machine-Treiber liest das DTS und ruft set_fmt auf, um die Taktphaseninvertierung des Controllers einzustellen. Für Simple Card siehe den entsprechenden Abschnitt.

<!-- source-page: 38; block: en-0324 -->

##### 2.3.3.4 bclk-fs konfigurieren

<!-- source-page: 38; block: en-0325 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| rockchip,bclk-fs | int | Standardmäßig beträgt bclk das 64-Fache der Abtastrate |

<!-- source-page: 38; block: en-0326 -->

Beispiel: bclk beträgt das 32-Fache der Abtastrate

<!-- source-page: 38; block: en-0327 -->

```text
&i2s0 {
        rockchip,bclk-fs = <32>;
};
```

<!-- source-page: 38; block: en-0328 -->

##### 2.3.3.5 Hochpräzisen Takt konfigurieren

<!-- source-page: 38; block: en-0329 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| rockchip,mclk-calibrate | boolean | Unterstützt hochpräzisen Takt und Taktkompensation; siehe Audiotaktkompensation |

<!-- source-page: 39; block: en-0330 -->

##### 2.3.3.6 Wartezeit

<!-- source-page: 39; block: en-0331 -->

Diese Eigenschaft steuert vor allem den Timeout im Slave-Modus. Fällt der Peripherietakt aus, kehrt das ASoC-Framework standardmäßig nach 10s zurück. Eine kürzere Wartezeit kann das Verhalten verbessern. Empfohlen wird ein Wert mindestens in Höhe der Pufferzeit.

<!-- source-page: 39; block: en-0332 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| rockchip,i2s-tx-wait-time-ms | int | Standard: 10s |
| rockchip,i2s-rx-wait-time-ms | int | Standard: 10s |

<!-- source-page: 39; block: en-0333 -->

Beispiel: Pufferzeit 40ms, Wartezeit 50ms

<!-- source-page: 39; block: en-0334 -->

```text
&i2s0 {
        rockchip,i2s-tx-wait-time-ms = <50>;
        rockchip,i2s-rx-wait-time-ms = <50>;
};
```

<!-- source-page: 39; block: en-0335 -->

##### 2.3.3.7 Weitere Einstellungen

<!-- source-page: 39; block: en-0336 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| rockchip,no-dmaengine | boolean | Für Multi-DAI; siehe Combo-DAI-Treiber |
| rockchip,playback-only | boolean | Unterstützt nur Wiedergabe |
| rockchip,capture-only | boolean | Unterstützt nur Aufnahme |

<!-- source-page: 39; block: en-0337 -->

##### 2.3.3.8 mclkout / mclkin

<!-- source-page: 39; block: en-0338 -->

mclk unterstützt mclkout und mclkin über gemeinsam verwendete Pins. Die Einsatzfälle ergeben sich zusammen mit dem Master-/Slave-Modus von i2s. Benötigt die Peripherie keinen mclk, kann die Verbindung entfallen.

<!-- source-page: 39; block: en-0339 -->

| i2s | mclk | Beschreibung |
| --- | --- | --- |
| master | out | SoC liefert den Takt an die Peripherie |
| master | in | i2s verwendet externen mclkin; typischer Einsatz: gemeinsame Audiotaktquelle |
| slave | out | Peripherie arbeitet als Master, SoC liefert mclk |
| slave | in | Kein Anwendungsfall |

<!-- source-page: 39; block: en-0340 -->

Beispiel: mclkout

<!-- source-page: 39; block: en-0341 -->

```text
rk817_codec: codec {
        #sound-dai-cells = <0>;
        compatible = "rockchip,rk817-codec";
        clocks = <&mclkout_i2s0>;
        clock-names = "mclk";
        assigned-clocks = <&mclkout_i2s0>;
        assigned-clock-rates = <12288000>;
        pinctrl-names = "default";
        pinctrl-0 = <&i2s0m0_mclk>;
        hp-volume = <20>;
        spk-volume = <3>;
        mic-in-differential;
        status = "okay";
};
```

<!-- source-page: 40; block: en-0343 -->

Beispiel: mclkin

<!-- source-page: 40; block: en-0344 -->

```text
&i2s3_2ch {
        assigned-clocks = <&cru CLK_I2S3_2CH>;
        assigned-clock-parents = <&mclkin_i2s3>;
        pinctrl-0 = <&i2s3_sdi
                     &i2s3_sdo
                     &i2s3_lrck
                     &i2s3_sclk
                     &i2s3_mclk>;
};
&mclkin_i2s3 {
        clock-frequency = <24576000>;
        status = "okay";
};
```

<!-- source-page: 40; block: en-0345 -->

Weitere Einzelheiten: kernel/Documentation/devicetree/bindings/sound/rockchip-i2s.txt

<!-- source-page: 40; block: en-0346 -->

#### 2.3.4 I2S-TDM

<!-- source-page: 40; block: en-0347 -->

Zusätzlich zu den Funktionen des I2S-Controllers unterstützt I2S-TDM die folgenden Eigenschaften:

<!-- source-page: 41; block: en-0348 -->

##### 2.3.4.1 Gemeinsamen TX/RX-Takt konfigurieren

<!-- source-page: 41; block: en-0349 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| rockchip,clk-trcm | 0 | TX/RX sind logisch unabhängig und verwenden eigene Takte; zwei Taktsätze liegen an den IOs an |
| rockchip,clk-trcm | 1 | TX/RX sind logisch synchronisiert und teilen den TX-Takt; an den IOs liegt nur der TX-Takt an |
| rockchip,clk-trcm | 2 | TX/RX sind logisch synchronisiert und teilen den RX-Takt; an den IOs liegt nur der RX-Takt an |

<!-- source-page: 41; block: en-0350 -->

Beispiel: Modus mit gemeinsamem TX-Takt einstellen.

<!-- source-page: 41; block: en-0351 -->

```text
&i2s0 {
        rockchip,clk-trcm = <1>;
};
```

<!-- source-page: 41; block: en-0352 -->

##### 2.3.4.2 Datenleitungen neu zuordnen

<!-- source-page: 41; block: en-0353 -->

Die Hardware kann beliebige SDOx/SDIx verwenden. Die Software kann die Zuordnung zwischen PATHx und SDOx/SDIx ändern.

<!-- source-page: 41; block: en-0354 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| rockchip,i2s-tx-route | &lt;int int int int&gt; | Standardreihenfolge: SDO0 &#124; SDO1 &#124; SDO2 &#124; SDO3 |
| rockchip,i2s-rx-route | &lt;int int int int&gt; | Standardreihenfolge: SDI0&#124; SDI1 &#124; SDI2 &#124; SDI3 |

<!-- source-page: 41; block: en-0355 -->

Beispiel: Wiedergabekanalreihenfolge "SDO3 &#124; SDO2 &#124; SDO1 &#124; SDO0".

<!-- source-page: 41; block: en-0356 -->

```text
&i2s0 {
        rockchip,i2s-tx-route = <3 2 1 0>;
};
```

<!-- source-page: 41; block: en-0357 -->

##### 2.3.4.3 TDM-Halbframe-Modus konfigurieren

<!-- source-page: 41; block: en-0358 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| rockchip,tdm-fsync-half-frame | boolean | Im TDM-I2S-Modus unterstützt der Frametakt Halbframe- und Langframe-Formate; Standard ist Langframe. |

<!-- source-page: 41; block: en-0359 -->

Beispiel: Halbframe-Format

<!-- source-page: 42; block: en-0360 -->

```text
&i2s0 {
        rockchip,tdm-fsync-half-frame;
};
```

<!-- source-page: 42; block: en-0361 -->

##### 2.3.4.4 TDM-Slots konfigurieren

<!-- source-page: 42; block: en-0362 -->

Der Treiber implementiert set_tdm_slot . Der Machine-Treiber liest die DTS-Eigenschaften und ruft diese API auf, um die Slots des Controllers einzustellen. Für Simple Card siehe den entsprechenden Abschnitt.

<!-- source-page: 42; block: en-0363 -->

##### 2.3.4.5 mclkout / mclkin

<!-- source-page: 42; block: en-0364 -->

mclk unterstützt mclkout und mclkin über gemeinsam verwendete Pins. Die Einsatzfälle ergeben sich zusammen mit dem Master-/Slave-Modus von i2stdm. Benötigt die Peripherie keinen mclk, kann die Verbindung entfallen.

<!-- source-page: 42; block: en-0365 -->

| i2stdm | mclk | Beschreibung |
| --- | --- | --- |
| master | out | SoC liefert den Takt an die Peripherie |
| master | in | i2stdm verwendet externen mclkin; typischer Einsatz: gemeinsame Audiotaktquelle |
| slave | out | Peripherie arbeitet als Master, SoC liefert mclk |
| slave | in | Kein Anwendungsfall |

<!-- source-page: 42; block: en-0366 -->

Beispiel: mclkout

<!-- source-page: 42; block: en-0367 -->

```text
rk817_codec: codec {
        #sound-dai-cells = <0>;
        compatible = "rockchip,rk817-codec";
        clocks = <&mclkout_i2s0>;
        clock-names = "mclk";
        assigned-clocks = <&mclkout_i2s0>;
        assigned-clock-rates = <12288000>;
        pinctrl-names = "default";
        pinctrl-0 = <&i2s0m0_mclk>;
        hp-volume = <20>;
        spk-volume = <3>;
        mic-in-differential;
        status = "okay";
};
```

<!-- source-page: 42; block: en-0368 -->

Beispiel: mclkin

<!-- source-page: 42; block: en-0369 -->

```text
&i2s0_8ch {
        assigned-clocks = <&cru CLK_I2S0_8CH_TX>, <&cru CLK_I2S0_8CH_RX>;
        assigned-clock-parents = <&mclkin_i2s0>, <&mclkin_i2s0>;
        pinctrl-0 = <&i2s0_sdi0
                     &i2s0_sdo0
                     &i2s0_lrck
                     &i2s0_sclk
                     &i2s0_mclk>;
};
&mclkin_i2s0 {
        clock-frequency = <24576000>;
        status = "okay";
};
```

<!-- source-page: 43; block: en-0371 -->

Weitere Einzelheiten: kernel/Documentation/devicetree/bindings/sound/rockchip,i2s-tdm.txt

<!-- source-page: 43; block: en-0372 -->

#### 2.3.5 PDM

<!-- source-page: 43; block: en-0373 -->

##### 2.3.5.1 Datenleitungen neu zuordnen

<!-- source-page: 43; block: en-0374 -->

Die Hardware kann beliebige SDIx verwenden. Die Software kann die Zuordnung zwischen PATHx und SDIx ändern.

<!-- source-page: 43; block: en-0375 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| rockchip,path-map | &lt;int int int int&gt; | Standardreihenfolge: SDI0 &#124; SDI1 &#124; SDI2 &#124; SDI3 |

<!-- source-page: 43; block: en-0376 -->

Beispiel: Aufnahmekanalreihenfolge "SDI3 &#124; SDI2 &#124; SDI1 &#124; SDI0"

<!-- source-page: 43; block: en-0377 -->

```text
&pdm_8ch {
        rockchip,path-map = <3 2 1 0>;
};
```

<!-- source-page: 43; block: en-0378 -->

##### 2.3.5.2 Hochpräzisen Takt konfigurieren

<!-- source-page: 43; block: en-0379 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| rockchip,mclk-calibrate | boolean | Unterstützt hochpräzisen Takt und Taktkompensation; siehe Audiotaktkompensation |

<!-- source-page: 43; block: en-0380 -->

##### 2.3.5.3 Weitere Einstellungen

<!-- source-page: 43; block: en-0381 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| rockchip,no-dmaengine | boolean | Für Multi-DAI; siehe Combo-DAI-Treiber |

<!-- source-page: 43; block: en-0382 -->

Weitere Einzelheiten: kernel/Documentation/devicetree/bindings/sound/rockchip,pdm.txt

<!-- source-page: 44; block: en-0383 -->

#### 2.3.6 DCODEC

<!-- source-page: 44; block: en-0384 -->

##### 2.3.6.1 Taktsynchronisationsmodus

<!-- source-page: 44; block: en-0385 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| rockchip,clk-sync-mode | boolean | Standardmäßig asynchroner Betrieb mit unabhängigen ADC-/DAC-Takten. |

<!-- source-page: 44; block: en-0386 -->

Beispiel: Taktsynchronisation mit gemeinsamem ADC-Takt einstellen

<!-- source-page: 44; block: en-0387 -->

```text
&dig_acodec {
        rockchip,clk-sync-mode;
};
```

<!-- source-page: 44; block: en-0388 -->

##### 2.3.6.2 DSM-Ausgabemodus

<!-- source-page: 44; block: en-0389 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| rockchip,pwm-output-mode | boolean | PA direkt über eine RC-Schaltung ansteuern |

<!-- source-page: 44; block: en-0390 -->

Beispiel: DSM-PWM-Ausgabe einstellen und IOMUX auf differenzielle PWM-Ausgabe umschalten

<!-- source-page: 44; block: en-0391 -->

```text
&dig_acodec {
        rockchip,pwm-output-mode;
        pinctrl-names = "default";
        pinctrl-0 = <&audiopwmoutdiff_pins>;
};
```

<!-- source-page: 44; block: en-0392 -->

Die Referenzschaltung ist in Abbildung 2-2 dargestellt:

<!-- source-page: 44; block: en-0393 -->

![Technische Originalabbildung: 2.3.6.2 DSM-Ausgabemodus (Seite 44)](/docs/rockchip-audio/assets/en-p044-fig01.png)

<!-- source-page: 44; block: en-0394 -->

Abbildung 2-6: Referenz für DSM PWM OUT

<!-- source-page: 45; block: en-0395 -->

Weitere Einzelheiten:

<!-- source-page: 45; block: en-0396 -->

kernel/Documentation/devicetree/bindings/sound/rockchip,codec-digital.txt

<!-- source-page: 45; block: en-0397 -->

#### 2.3.7 VAD

<!-- source-page: 45; block: en-0398 -->

##### 2.3.7.1 Audioquelle konfigurieren

<!-- source-page: 45; block: en-0399 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| rockchip,audio-src | phandle | Audioquelle zur Spracherkennung festlegen |

<!-- source-page: 45; block: en-0400 -->

Die Audioquelle zur Spracherkennung stammt von DAI. Die unterstützten Quellen unterscheiden sich je nach Chip, wie die folgende Tabelle zeigt:

<!-- source-page: 45; block: en-0401 -->

| SoC | Audioquelle |
| --- | --- |
| RK1808 | I2S0, I2S1, PDM |
| RK3308 | I2S_8CH_0, I2S_8CH_1, I2S_8CH_2, I2S_8CH_3, PDM_8CH |
| RK3568/RK3566 | I2S1_8CH, I2S2_2CH, I2S3_2CH |

<!-- source-page: 45; block: en-0402 -->

Beispiel: VAD verwendet PDM_8CH als Audioquelle auf RK3308

<!-- source-page: 45; block: en-0403 -->

```text
&vad {
        rockchip,audio-src = <&pdm_8ch>;
};
```

<!-- source-page: 45; block: en-0404 -->

##### 2.3.7.2 Erkennungskanal konfigurieren

<!-- source-page: 45; block: en-0405 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| rockchip,det-channel | int | Erkennungskanal festlegen; Standard ist Kanal 0 |

<!-- source-page: 45; block: en-0406 -->

Beispiel: VAD verwendet Kanal 2 zur Erkennung auf RK3308

<!-- source-page: 45; block: en-0407 -->

```text
&vad {
        rockchip,det-channel = <2>;
};
```

<!-- source-page: 46; block: en-0408 -->

##### 2.3.7.3 Datenspeichermodus konfigurieren

<!-- source-page: 46; block: en-0409 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| rockchip,mode | 0 | Audiodaten erst nach Erkennung eines Sprachsignals durch VAD puffern. |
| rockchip,mode | 1 | Audiodaten unmittelbar nach Aktivierung von VAD puffern. |
| rockchip,mode | 2 | Keine Audiodaten puffern. |

<!-- source-page: 46; block: en-0410 -->

Beispiel: VAD verwendet Modus 1 auf RK3308

<!-- source-page: 46; block: en-0411 -->

```text
&vad {
        rockchip,mode = <1>;
};
```

<!-- source-page: 46; block: en-0412 -->

Hinweis:

<!-- source-page: 46; block: en-0413 -->

Damit die nachgelagerte ASR-Anwendung vollständige Audiodaten erhält, wird Modus 1 empfohlen. Die gepufferten Daten liegen im SRAM-Ringpuffer. Nach dem Aufwecken durch VAD werden sie in den Audiostrom eingefügt. Diese Verarbeitung bleibt für die Anwendung transparent.

<!-- source-page: 46; block: en-0414 -->

##### 2.3.7.4 Puffergröße konfigurieren

<!-- source-page: 46; block: en-0415 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| rockchip,buffer-time-ms | int | VAD-Puffergröße festlegen: Abtastrate * Bitbreite * Kanalzahl * Zeit. |

<!-- source-page: 46; block: en-0416 -->

Beispiel: Pufferzeit 100ms; die Quelle nennt hierfür 204800 Bytes bei 16k 16bits 8ch.

<!-- source-page: 46; block: en-0417 -->

```text
&vad {
        rockchip,buffer-time-ms = <100>;
};
```

<!-- source-page: 46; block: en-0418 -->

Hinweis: Ein größerer Puffer erhöht auch die Latenz der ASR-Anwendung. Da SRAM begrenzt ist, muss die Größe sorgfältig gewählt werden. Ziel ist die Datenvollständigkeit: Der Puffer muss die Zeit von „Aufwachen -&gt; Übernahme durch die Anwendung“ abdecken. Dauert dieser Übergang zu lange, sollte er optimiert werden.

<!-- source-page: 46; block: en-0419 -->

Weitere Einzelheiten: kernel/Documentation/devicetree/bindings/sound/rockchip,vad.txt

<!-- source-page: 47; block: en-0420 -->

### 2.4 Entwicklung des Combo-DAI-Treibers

<!-- source-page: 47; block: en-0421 -->

#### 2.4.1 Untergeordnete DAI konfigurieren

<!-- source-page: 47; block: en-0422 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| dais | &lt;phandle&gt;... | Sub-DAIs werden zu einem Combo DAI kombiniert. "rockchip,no-dmaengine" entfernt die zugehörige DMA-Engine einer Sub-DAI; Registrierung und Bindung übernimmt anschließend einheitlich das Combo-DAI-Framework. |

<!-- source-page: 47; block: en-0423 -->

Beispiel: i2s_8ch_2 und pdm_8ch zu einem Combo DAI kombinieren

<!-- source-page: 47; block: en-0424 -->

```text
&i2s_8ch_2 {
        status = "okay";
        rockchip,no-dmaengine;
};
&pdm_8ch {
        status = "okay";
        rockchip,no-dmaengine;
};
&multi-dais {
        dais = <&i2s_8ch_2>, <&pdm_8ch>;
};
```

<!-- source-page: 47; block: en-0425 -->

#### 2.4.2 Kanalzuordnung konfigurieren

<!-- source-page: 47; block: en-0426 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| capture,channel-mapping | &lt;int ...&gt; | Anzahl der Aufnahmekanäle jeder beteiligten Sub-DAI |
| playback,channel-mapping | &lt;int ...&gt; | Anzahl der Wiedergabekanäle jeder beteiligten Sub-DAI |

<!-- source-page: 47; block: en-0427 -->

Beispiel: Stereo-Wiedergabe und 8-Kanal-Aufnahme (6 Mikrofonkanäle + 2 Loopback-Kanäle).

<!-- source-page: 47; block: en-0428 -->

```text
&multi-dais {
        dais = <&i2s_8ch_2>, <&pdm_8ch>;
        playback,channel-mapping = <2 0>;
        capture,channel-mapping = <2 6>;
};
```

<!-- source-page: 48; block: en-0429 -->

#### 2.4.3 Master-/Slave-Modus konfigurieren

<!-- source-page: 48; block: en-0430 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| bitclock-master | &lt;int ...&gt; | Gerät auswählen, das den Bittakt liefert; 1 kennzeichnet den Taktgeber (Master). |
| frame-master | &lt;int ...&gt; | Gerät auswählen, das den Frametakt liefert; 1 kennzeichnet den Taktgeber (Master). |

<!-- source-page: 48; block: en-0431 -->

Beispiel 1: i2s_8ch_2 und pdm_8ch bilden eine Soundkarte mit 8 Aufnahmekanälen (Loopback + Mikrofonarray). i2s_8ch_2 kann Master oder Slave sein und ist hier Master; pdm unterstützt nur Master-Modus.

<!-- source-page: 48; block: en-0432 -->

```text
&multi-dais {
        dais = <&i2s_8ch_2>, <&pdm_8ch>;
        capture,channel-mapping = <2 6>;
        playback,channel-mapping = <2 0>;
        bitclock-master = <1 1>;
        frame-master = <1 1>;
};
```

<!-- source-page: 48; block: en-0433 -->

Beispiel 2: Zwei I2S bilden 16 Kanäle, eines als Master und eines als Slave. Die externe Hardware muss den Takt der Master-DAI mit jeder Slave-DAI verbinden.

<!-- source-page: 48; block: en-0434 -->

```text
&multi-dais {
        dais = <&i2s_8ch_0>, <&i2s_8ch_1>;
        capture,channel-mapping = <8 8>;
        playback,channel-mapping = <8 8>;
        bitclock-master = <1 0>;
        frame-master = <1 0>;
};
```

<!-- source-page: 48; block: en-0435 -->

Beispiel 3: Zwei I2S-Schnittstellen bilden 16 Kanäle und arbeiten beide als Slave. Der Codec liefert als Master den Takt.

<!-- source-page: 48; block: en-0436 -->

```text
&multi-dais {
        dais = <&i2s_8ch_0>, <&i2s_8ch_1>;
        capture,channel-mapping = <8 8>;
        playback,channel-mapping = <8 8>;
        bitclock-master = <0 0>;
        frame-master = <0 0>;
};
```

<!-- source-page: 49; block: en-0437 -->

#### 2.4.4 Taktphaseninvertierung konfigurieren

<!-- source-page: 49; block: en-0438 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| bitclock-inversion | &lt;int ...&gt; | 1 bedeutet invertierter Bittakt |
| frame-inversion | &lt;int ...&gt; | 1 bedeutet invertierter Frametakt |

<!-- source-page: 49; block: en-0439 -->

Beispiel: Takte aller untergeordneten DAIs invertieren.

<!-- source-page: 49; block: en-0440 -->

```text
&multi-dais {
        dais = <&i2s_8ch_0>, <&i2s_8ch_1>;
        bitclock-inversion = <1 1>;
        frame-inversion = <1 1>;
};
```

<!-- source-page: 49; block: en-0441 -->

#### 2.4.5 Beispiele

<!-- source-page: 49; block: en-0442 -->

Beispiel 1: RK3308 PDM-Mikrofonarray + Stereo-Aufnahme + Stereo-Wiedergabe + VAD-Spracherkennung

<!-- source-page: 49; block: en-0443 -->

```text
multi_dais: multi-dais {
        status = "okay";
        compatible = "rockchip,multi-dais";
        dais = <&i2s_8ch_2>, <&pdm_8ch>;
        capture,channel-mapping = <2 6>;
        playback,channel-mapping = <2 0>;
        bitclock-master = <1 1>;
        frame-master = <1 1>;
        bitclock-inversion = <0 0>;
        frame-inversion = <0 0>;
        rockchip,grf = <&grf>;
};
&i2s_8ch_2 {
        status = "okay";
        rockchip,no-dmaengine;
};
&pdm_8ch {
        status = "okay";
        rockchip,no-dmaengine;
};
vad-sound {
        status = "okay";
        compatible = "rockchip,multicodecs-card";
        rockchip,card-name = "rockchip,rk3308-vad";
        rockchip,cpu = <&multi_dais>;
        rockchip,codec = <&acodec>, <&vad>;
};
```

<!-- source-page: 50; block: en-0445 -->

Beispiel 2: RK3308-Soundbar mit I2S_8CH_0 + I2S_8CH_1 für 16 Ausgabekanäle

<!-- source-page: 50; block: en-0446 -->

```text
&i2s_8ch_0 {
        #sound-dai-cells = <0>;
        rockchip,no-dmaengine;
};
&i2s_8ch_1 {
        #sound-dai-cells = <0>;
        rockchip,no-dmaengine;
        pinctrl-names = "default";
        pinctrl-0 = <&i2s_8ch_1_m0_sdo0
                     &i2s_8ch_1_m0_sdo1_sdi3
                     &i2s_8ch_1_m0_sdo2_sdi2
                     &i2s_8ch_1_m0_sdo3_sdi1
                     &i2s_8ch_1_m0_sdi0>;
};
i2s_16ch_dais: i2s-16ch-dais {
        compatible = "rockchip,rk3308-multi-dais", "rockchip,multi-dais";
        dais = <&i2s_8ch_0>, <&i2s_8ch_1>;
        capture,channel-mapping = <8 8>;
        playback,channel-mapping = <8 8>;
        bitclock-master = <1 0>;
        frame-master = <1 0>;
        rockchip,grf = <&grf>;
};
```

<!-- source-page: 50; block: en-0447 -->

Weitere Einzelheiten: kernel/Documentation/devicetree/bindings/sound/rockchip,multidais.txt

<!-- source-page: 50; block: en-0448 -->

### 2.5 Entwicklung von CODEC-Treibern

<!-- source-page: 50; block: en-0449 -->

Siehe: Linux Sound Subsystem Documentation

<!-- source-page: 50; block: en-0450 -->

### 2.6 Entwicklung von Machine-Treibern

<!-- source-page: 50; block: en-0451 -->

Dieser Abschnitt erläutert anhand praktischer Beispiele die Schritte zum Hinzufügen einer Soundkarte.

<!-- source-page: 50; block: en-0452 -->

#### 2.6.1 Simple-Card-Treiber

<!-- source-page: 50; block: en-0453 -->

Simple Card ist ein allgemeiner Machine-Treiber für ASoC, der für die meisten Standardsoundkarten geeignet ist.

<!-- source-page: 51; block: en-0454 -->

##### 2.6.1.1 Protokollformat konfigurieren

<!-- source-page: 51; block: en-0455 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| simple-audio-card,format | string | Protokollformat einstellen |

<!-- source-page: 51; block: en-0456 -->

| Format | Beschreibung |
| --- | --- |
| i2s | I2S-Standardformat |
| right_j | Rechtsbündiges I2S-Format |
| left_j | Linksbündiges I2S-Format |
| dsp_a | PCM mit 1 Bit Verzögerung |
| dsp_b | PCM ohne Verzögerung |
| pdm | PDM-Format |

<!-- source-page: 51; block: en-0457 -->

Beispiel: linksbündiges I2S-Format einstellen

<!-- source-page: 51; block: en-0458 -->

```text
audiopwmout_diff: audiopwmout-diff {
        compatible = "simple-audio-card";
        ....
        simple-audio-card,format = "left_j";
        simple-audio-card,cpu {
                sound-dai = <&i2s3_2ch>;
        };
        master: simple-audio-card,codec {
                sound-dai = <&dig_acodec>;
        };
};
```

<!-- source-page: 51; block: en-0459 -->

##### 2.6.1.2 mclk-fs konfigurieren

<!-- source-page: 51; block: en-0460 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| simple-audio-card,mclk-fs | int | Standardmäßig beträgt mclk das 256-Fache der Abtastrate |

<!-- source-page: 51; block: en-0461 -->

Beispiel: mclk beträgt das 512-Fache der Abtastrate.

<!-- source-page: 52; block: en-0462 -->

```text
audiopwmout_diff: audiopwmout-diff {
        compatible = "simple-audio-card";
        ....
        simple-audio-card,mclk-fs = <512>;
        simple-audio-card,cpu {
                sound-dai = <&i2s3_2ch>;
        };
        master: simple-audio-card,codec {
                sound-dai = <&dig_acodec>;
        };
};
```

<!-- source-page: 52; block: en-0463 -->

##### 2.6.1.3 Master-/Slave-Modus konfigurieren

<!-- source-page: 52; block: en-0464 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| simple-audio-card,bitclock-master | phandle | Bittaktgeber festlegen; standardmäßig liefert DAI den Takt |
| simple-audio-card,frame-master | phandle | Frametaktgeber festlegen; standardmäßig liefert DAI den Takt |

<!-- source-page: 52; block: en-0465 -->

Beispiel: DAI als Slave, CODEC als Master

<!-- source-page: 52; block: en-0466 -->

```text
audiopwmout_diff: audiopwmout-diff {
        compatible = "simple-audio-card";
        ....
        simple-audio-card,bitclock-master = <&master>;
        simple-audio-card,frame-master = <&master>;
        simple-audio-card,cpu {
                sound-dai = <&i2s3_2ch>;
        };
        master: simple-audio-card,codec {
                sound-dai = <&dig_acodec>;
        };
};
```

<!-- source-page: 52; block: en-0467 -->

##### 2.6.1.4 Taktphaseninvertierung konfigurieren

<!-- source-page: 52; block: en-0468 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| simple-audio-card,bitclock-inversion | boolean | Invertierter Bittakt |
| simple-audio-card,frame-inversion | boolean | Invertierter Frametakt |

<!-- source-page: 52; block: en-0469 -->

Beispiel: bclk und lrck invertieren.

<!-- source-page: 53; block: en-0470 -->

```text
audiopwmout_diff: audiopwmout-diff {
        compatible = "simple-audio-card";
        ...
        simple-audio-card,bitclock-inversion;
        simple-audio-card,frame-inversion;
        simple-audio-card,cpu {
                sound-dai = <&i2s3_2ch>;
        };
        simple-audio-card,codec {
                sound-dai = <&dig_acodec>;
        };
};
```

<!-- source-page: 53; block: en-0471 -->

##### 2.6.1.5 TDM-Slots konfigurieren

<!-- source-page: 53; block: en-0472 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| dai-tdm-slot-num | int | Slot-Anzahl festlegen |
| dai-tdm-slot-width | int | Slot-Bitbreite festlegen |

<!-- source-page: 53; block: en-0473 -->

Beispiel: Slot-Bitbreite 32 Bits, 8 Slots

<!-- source-page: 53; block: en-0474 -->

```text
i2s-dmic-array {
        compatible = "simple-audio-card";
        ...
        simple-audio-card,mclk-fs = <256>;
        simple-audio-card,cpu {
                sound-dai = <&i2s_8ch_0>;
                dai-tdm-slot-num = <8>;
                dai-tdm-slot-width = <32>;
        };
        simple-audio-card,codec {
                sound-dai = <&dummy_codec>;
        };
};
```

<!-- source-page: 53; block: en-0475 -->

Hinweis: mclk-fs entspricht [ slot num ] * [ slot-width ] oder einem geradzahligen Vielfachen davon.

<!-- source-page: 53; block: en-0476 -->

Weitere Einzelheiten: kernel/Documentation/devicetree/bindings/sound/simple-card.txt

<!-- source-page: 53; block: en-0477 -->

##### 2.6.1.6 Beispiel: Soundkarte hinzufügen

<!-- source-page: 53; block: en-0478 -->

1. Codec-Treiber portieren oder schreiben.

<!-- source-page: 53; block: en-0479 -->

```text
sound/soc/codecs/Kconfig
sound/soc/codecs/Makefile
sound/soc/codecs/tas571x.c
sound/soc/codecs/tas571x.h
```

<!-- source-page: 54; block: en-0480 -->

2. CONFIG aktivieren

<!-- source-page: 54; block: en-0481 -->

```text
CONFIG_SND_SIMPLE_CARD
CONFIG_SND_SOC_ROCKCHIP_I2S
CONFIG_SND_SOC_ROCKCHIP_I2S_TDM
CONFIG_SND_SOC_TAS571X
```

<!-- source-page: 54; block: en-0482 -->

3. DTS-Knoten für die Soundkarte hinzufügen

<!-- source-page: 54; block: en-0483 -->

Den zur Hardwareverdrahtung passenden i2s-Knoten aktivieren

<!-- source-page: 54; block: en-0484 -->

```text
&i2s_8ch_1 {
        status = "okay";
        #sound-dai-cells = <0>;
        pinctrl-names = "default";
        pinctrl-0 = <&i2s_8ch_1_m0_sclktx
                     &i2s_8ch_1_m0_lrcktx
                     &i2s_8ch_1_m0_sdo0
                     &i2s_8ch_1_m0_mclk>;
};
```

<!-- source-page: 54; block: en-0485 -->

Den Codec-Knoten entsprechend der Hardwareverdrahtung unter dem passenden I2C- oder SPI-Knoten hinzufügen.

<!-- source-page: 54; block: en-0486 -->

```text
&i2c1 {
        clock-frequency = <400000>;
        status = "okay";
        tas5731: tas5731@1a {
                #sound-dai-cells = <0>;
                compatible = "ti,tas5731";
                reg = <0x1a>;
                clocks = <&cru SCLK_I2S1_8CH_TX_OUT>;
                clock-names = "mclk";
                pinctrl-names = "default";
                pinctrl-0 = <&i2s_8ch_1_m0_mclk>;
                pdn-gpios = <&gpio0 RK_PA5 GPIO_ACTIVE_LOW>;
                reset-gpios = <&gpio1 RK_PA1 GPIO_ACTIVE_LOW>;
        };
};
```

<!-- source-page: 54; block: en-0487 -->

Soundkartenknoten hinzufügen und aktivieren

<!-- source-page: 55; block: en-0488 -->

```text
tas5731_sound: tas5731-sound {
        status = "okay";
        compatible = "simple-audio-card";
        simple-audio-card,format = "i2s";
        simple-audio-card,name = "rockchip,tas5731";
        simple-audio-card,mclk-fs = <256>;
        simple-audio-card,cpu {
                sound-dai = <&i2s_8ch_1>;
        };
        simple-audio-card,codec {
                sound-dai = <&tas5731>;
        };
};
```

<!-- source-page: 55; block: en-0489 -->

Prüfen, ob die Soundkarte erfolgreich angelegt wurde

<!-- source-page: 55; block: en-0490 -->

```text
# cat /proc/asound/cards
 0 [rockchiptas5731]: rockchip_tas5731 - rockchip,tas5731
```

<!-- source-page: 55; block: en-0491 -->

Hinweis:

<!-- source-page: 55; block: en-0492 -->

Für mclk gilt: Wer den Takt verwendet, fordert ihn an. Benötigt der Codec einen externen mclk, muss sein Treiber diesen anfordern und verwalten. Im Beispiel stammt der Codec-mclk von SCLK_I2S1_8CH_TX_OUT des RK3308.

<!-- source-page: 55; block: en-0493 -->

#### 2.6.2 Multi-Codecs-Machine-Treiber

<!-- source-page: 55; block: en-0494 -->

Reicht Simple Card nicht aus, muss ein passender Machine-Treiber geschrieben werden. Dieser Abschnitt beschreibt den Multi-Codecs-Machine-Treiber von RK für eine DAI mit mehreren CODECs oder einen Combo DAI mit mehreren CODECs, wie Abbildung 2-3 zeigt:

<!-- source-page: 55; block: en-0495 -->

![Technische Originalabbildung: 2.6.2 Multi-Codecs-Machine-Treiber (Seite 55)](/docs/rockchip-audio/assets/en-p055-fig01.png)

<!-- source-page: 55; block: en-0496 -->

Abbildung 2-3: Multi-Codecs-Machine-Treiber

<!-- source-page: 56; block: en-0497 -->

##### 2.6.2.1 dai / codec konfigurieren

<!-- source-page: 56; block: en-0498 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| rockchip,cpu | phandle | dai-Gerät festlegen |
| rockchip,codec | phandle... | Zugehörige Codecs festlegen |

<!-- source-page: 56; block: en-0499 -->

Beispiel: i2s0_8ch wird sowohl für codec als auch für vad verwendet

<!-- source-page: 56; block: en-0500 -->

```text
&sound {
        compatible = "rockchip,multicodecs-card";
        rockchip,cpu = <&i2s0_8ch>;
        rockchip,codec = <&codec>, <&vad>;
};
```

<!-- source-page: 56; block: en-0501 -->

##### 2.6.2.2 Protokollformat konfigurieren

<!-- source-page: 56; block: en-0502 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| rockchip,format | string | Protokollformat einstellen |

<!-- source-page: 56; block: en-0503 -->

| Format | Beschreibung |
| --- | --- |
| i2s | I2S-Standardformat |
| right_j | Rechtsbündiges I2S-Format |
| left_j | Linksbündiges I2S-Format |
| dsp_a | PCM mit 1 Bit Verzögerung |
| dsp_b | PCM ohne Verzögerung |
| pdm | pdm |

<!-- source-page: 56; block: en-0504 -->

Beispiel: linksbündiges I2S-Format einstellen

<!-- source-page: 56; block: en-0505 -->

```text
&sound {
        rockchip,format = "left_j";
};
```

<!-- source-page: 56; block: en-0506 -->

##### 2.6.2.3 mclk-fs konfigurieren

<!-- source-page: 56; block: en-0507 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| rockchip,mclk-fs | int | Standardmäßig beträgt mclk das 256-Fache der Abtastrate |

<!-- source-page: 57; block: en-0508 -->

Beispiel: mclk beträgt das 512-Fache der Abtastrate

<!-- source-page: 57; block: en-0509 -->

```text
&sound {
        rockchip,mclk-fs = <512>;
};
```

<!-- source-page: 57; block: en-0510 -->

##### 2.6.2.4 Master-/Slave-Modus konfigurieren

<!-- source-page: 57; block: en-0511 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| rockchip,frame-master | phandle | Bittaktgeber festlegen; standardmäßig liefert DAI den Takt |
| rockchip,bitclock-master | phandle | Frametaktgeber festlegen; standardmäßig liefert DAI den Takt |

<!-- source-page: 57; block: en-0512 -->

Beispiel: DAI als Slave, CODEC als Master

<!-- source-page: 57; block: en-0513 -->

```text
&sound {
        compatible = "rockchip,multicodecs-card";
        rockchip,frame-master = <&codec>;
        rockchip,bitclock-master = <&codec>;
        rockchip,cpu = <&i2s0_8ch>;
        rockchip,codec = <&codec>, <&vad>;
};
```

<!-- source-page: 57; block: en-0514 -->

##### 2.6.2.5 Taktphaseninvertierung konfigurieren

<!-- source-page: 57; block: en-0515 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| rockchip,bitclock-inversion | boolean | Invertierter Bittakt |
| rockchip,frame-inversion | boolean | Invertierter Frametakt |

<!-- source-page: 57; block: en-0516 -->

Beispiel: bclk und lrck invertieren

<!-- source-page: 57; block: en-0517 -->

```text
&sound {
        compatible = "rockchip,multicodecs-card";
        rockchip,bitclock-inversion;
        rockchip,frame-inversion;
        rockchip,cpu = <&i2s0_8ch>;
        rockchip,codec = <&codec>, <&vad>;
};
```

<!-- source-page: 58; block: en-0518 -->

##### 2.6.2.6 wait-card-locked konfigurieren

<!-- source-page: 58; block: en-0519 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| rockchip,wait-card-locked | int | Vor der eigenen Registrierung auf die angegebene Soundkarten-ID warten, damit die aktuelle Karte eine nachfolgende ID erhält |

<!-- source-page: 58; block: en-0520 -->

Beispiel: bluetooth-sound soll als card1 registriert werden; daher muss card0 zuvor registriert sein.

<!-- source-page: 58; block: en-0521 -->

```text
bluetooth_sound: bluetooth-sound {
    status = "disabled";
    compatible = "rockchip,multicodecs-card";
    rockchip,card-name = "rockchip,rk3308-pcm";
    rockchip,mclk-fs = <128>;
    rockchip,cpu = <&i2s_2ch_0>;
    rockchip,codec = <&dummy_codec>;
    rockchip,format = "dsp_b";
    rockchip,bitclock-inversion = <0>;
    rockchip,wait-card-locked = <0>;
};
```

<!-- source-page: 58; block: en-0522 -->

##### 2.6.2.7 Weitere Einstellungen

<!-- source-page: 58; block: en-0523 -->

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| hp-det-gpio | phandle | Pin zur Kopfhörererkennung |
| spk-con-gpio | phandle | Steuerpin der Lautsprecherendstufe |
| hp-con-gpio | phandle | Kopfhörer-Steuerpin |
| io-channels | phandle | ADC-Erkennungskanal zur Unterscheidung von 3-/4-poligen Kopfhörern |
| poll-interval | int | ADC-Abfrageintervall; Standard 100 ms |
| keyup-threshold-microvolt | int | ADC-Tastenspannung |
| play-pause-key | phandle | Wiedergabe-/Pausetaste |
| rockchip,audio-routing | string | Soundkartenrouting |

<!-- source-page: 58; block: en-0524 -->

Beispiel:

<!-- source-page: 58; block: en-0525 -->

ADC3 unterscheidet 3-/4-polige Kopfhörer und erfasst die Wiedergabe-/Pausetasten am Kopfhörerkabel.

<!-- source-page: 58; block: en-0526 -->

Headphone entspricht LROUT1 des es8388 und wird durch Headphone Power gpio1_d2 gesteuert.

<!-- source-page: 58; block: en-0527 -->

Speaker entspricht LROUT2 des es8388 und wird durch Speaker Power gpio1_d3 gesteuert.

<!-- source-page: 58; block: en-0528 -->

LINPUT entspricht Main Mic des es8388, RINPUT entspricht Headset Mic.

<!-- source-page: 59; block: en-0529 -->

```text
es8388_sound: es8388-sound {
    status = "okay";
    compatible = "rockchip,multicodecs-card";
    rockchip,card-name = "rockchip-es8388";
    hp-det-gpio = <&gpio1 RK_PD5 GPIO_ACTIVE_LOW>;
    io-channels = <&saradc 3>;
    io-channel-names = "adc-detect";
    keyup-threshold-microvolt = <1800000>;
    poll-interval = <100>;
    spk-con-gpio = <&gpio1 RK_PD3 GPIO_ACTIVE_HIGH>;
    hp-con-gpio = <&gpio1 RK_PD2 GPIO_ACTIVE_HIGH>;
    rockchip,format = "i2s";
    rockchip,mclk-fs = <256>;
    rockchip,cpu = <&i2s0_8ch>;
    rockchip,codec = <&es8388>;
    rockchip,audio-routing =
        "Headphone", "LOUT1",
        "Headphone", "ROUT1",
        "Speaker", "LOUT2",
        "Speaker", "ROUT2",
        "Headphone", "Headphone Power",
        "Headphone", "Headphone Power",
        "Speaker", "Speaker Power",
        "Speaker", "Speaker Power",
        "LINPUT1", "Main Mic",
        "LINPUT2", "Main Mic",
        "RINPUT1", "Headset Mic",
        "RINPUT2", "Headset Mic";
    pinctrl-names = "default";
    pinctrl-0 = <&hp_det>;
    play-pause-key {
        label = "playpause";
        linux,code = <KEY_PLAYPAUSE>;
        press-threshold-microvolt = <2000>;
    };
};
```

<!-- source-page: 59; block: en-0530 -->

Weitere Einzelheiten: kernel/Documentation/devicetree/bindings/sound/rockchip,multicodecs.txt

<!-- source-page: 59; block: en-0531 -->

#### 2.6.3 HDMI Audio

<!-- source-page: 59; block: en-0532 -->

HDMI im RK-Kernel 4.4 besitzt zwei Frameworks: RK HDMI und DRM. Entsprechend gibt es zwei Audioimplementierungen.

<!-- source-page: 59; block: en-0533 -->

Ab RK-Kernel 4.19 wird ausschließlich das Standard-DRM-Framework verwendet.

<!-- source-page: 59; block: en-0534 -->

Beispiel 1: Audiokonfiguration für das RK-HDMI-Framework auf RK3399

<!-- source-page: 59; block: en-0535 -->

```text
dw_hdmi_audio: dw-hdmi-audio {
        compatible = "rockchip,dw-hdmi-audio";
        #sound-dai-cells = <0>;
};
hdmi_sound: hdmi-sound {
        compatible = "simple-audio-card";
        simple-audio-card,format = "i2s";
        simple-audio-card,mclk-fs = <128>;
        simple-audio-card,name = "rockchip,hdmi";
        simple-audio-card,cpu {
                sound-dai = <&i2s2>;
        };
        simple-audio-card,codec {
                sound-dai = <&dw_hdmi_audio>;
        };
};
```

<!-- source-page: 60; block: en-0537 -->

Beispiel 2: Audiokonfiguration für das DRM-HDMI-Framework auf RK3399

<!-- source-page: 60; block: en-0538 -->

```text
hdmi: hdmi@ff940000 {
        compatible = "rockchip,rk3399-dw-hdmi";
        ......
        #address-cells = <1>;
        #size-cells = <0>;
        #sound-dai-cells = <0>;
};
hdmi_sound: hdmi-sound {
        compatible = "simple-audio-card";
        simple-audio-card,format = "i2s";
        simple-audio-card,mclk-fs = <128>;
        simple-audio-card,name = "rockchip,hdmi";
        simple-audio-card,cpu {
                sound-dai = <&i2s2>;
        };
        simple-audio-card,codec {
                sound-dai = <&hdmi>;
        };
};
```

<!-- source-page: 60; block: en-0539 -->

### 2.7 Audiotaktkompensation

<!-- source-page: 60; block: en-0540 -->

Die RK-Plattform bietet eine Feinabstimmung des Audiotakts, um asynchrone Audiosysteme wie UAC, HDMI IN und BT-Sprachübertragung auszugleichen. Der Einstellbereich beträgt ± 1000 ppm (parts per million).

<!-- source-page: 60; block: en-0541 -->

1. CONFIG aktivieren

<!-- source-page: 60; block: en-0542 -->

```text
CONFIG_ROCKCHIP_CLK_COMPENSATION
```

<!-- source-page: 60; block: en-0543 -->

2. PLL-Frequenz im Fractional-Modus ergänzen. Die Taktfeinkompensation funktioniert nur im Fractional-Modus; die PLL-Frequenz muss ein geradzahliges Vielfaches von mclk sein. Es werden zwei Chipkonzepte unterschieden:

<!-- source-page: 61; block: en-0544 -->

Bei Chips mit unabhängiger Audio-PLL genügt die Regel des geradzahligen Vielfachen. Beispielsweise wird beim RK3308 VPLL0 auf 1179648000 Hz und VPLL1 auf 903168000 Hz gesetzt.

<!-- source-page: 61; block: en-0545 -->

Teilen Audio und andere Module eine PLL, müssen die Auswirkungen der Feinabstimmung auf die anderen Module bewertet werden:

<!-- source-page: 61; block: en-0546 -->

a. Prüfen Sie, ob ± 1000 ppm die Modulfunktion beeinflussen. Ethernet benötigt beispielsweise einen genauen Takt, während der Videoencoder keine entsprechende Genauigkeitsanforderung hat.

<!-- source-page: 61; block: en-0547 -->

b. Ist Bedingung a erfüllt, wählen Sie eine geeignete Fractional-PLL-Frequenz. Beim RV1126 sollen beispielsweise ein Videoencoder mit ungefähr 500 MHz und Audiowiedergabe mit 48k gleichzeitig unterstützt werden. Dafür eignet sich eine Fractional-Frequenz nahe 500 MHz, etwa 491520000 Hz.

<!-- source-page: 61; block: en-0548 -->

Beispiel: CPLL-Frequenz des RV1126 auf eine Fractional-Frequenz ändern.

<!-- source-page: 61; block: en-0549 -->

```text
diff --git a/drivers/clk/rockchip/clk-rv1126.c b/drivers/clk/rockchip/clk-rv1126.c
index 9ba0bff..1b95aed 100644
--- a/drivers/clk/rockchip/clk-rv1126.c
+++ b/drivers/clk/rockchip/clk-rv1126.c
@@ -74,6 +74,8 @@ static struct rockchip_pll_rate_table rv1126_pll_rates[] = {
        RK3036_PLL_RATE(594000000, 1, 99, 4, 1, 1, 0),
        RK3036_PLL_RATE(504000000, 1, 84, 4, 1, 1, 0),
        RK3036_PLL_RATE(500000000, 1, 125, 6, 1, 1, 0),
+       RK3036_PLL_RATE(496742400, 1, 124, 6, 1, 0, 3113851),
+       RK3036_PLL_RATE(491520000, 1, 40, 2, 1, 0, 16106127),
```

<!-- source-page: 61; block: en-0550 -->

DTS-Konfiguration: Nur 491520000 Hz konfigurieren; unterstützt werden 8k, 16k, 24k, 48k, 96k und 192k.

<!-- source-page: 61; block: en-0551 -->

```text
&cru {
        assigned-clocks =
                <&pmucru CLK_RTC32K>, <&pmucru PLL_GPLL>,
                <&pmucru PCLK_PDPMU>, <&cru PLL_CPLL>,
                <&cru PLL_HPLL>, <&cru ARMCLK>,
                <&cru ACLK_PDBUS>, <&cru HCLK_PDBUS>,
                <&cru PCLK_PDBUS>, <&cru ACLK_PDPHP>,
                <&cru HCLK_PDPHP>, <&cru HCLK_PDAUDIO>,
                <&cru HCLK_PDCORE_NIU>;
        assigned-clock-rates =
                <32768>, <1188000000>,
                <100000000>, <491520000>,
                <1400000000>, <600000000>,
                <500000000>, <200000000>,
                <100000000>, <300000000>,
                <200000000>, <150000000>,
                <200000000>;
};
```

<!-- source-page: 61; block: en-0552 -->

3. DAI-Taktkompensation aktivieren und root pll konfigurieren

<!-- source-page: 61; block: en-0553 -->

I2S-Controller

<!-- source-page: 62; block: en-0554 -->

```text
&i2s1_2ch {
        clocks = <&cru MCLK_I2S1>, <&cru HCLK_I2S1>, <&cru PLL_CPLL>;
        clock-names = "i2s_clk", "i2s_hclk", "i2s_clk_root";
        rockchip,mclk-calibrate;
};
```

<!-- source-page: 62; block: en-0555 -->

I2S-TDM-Controller

<!-- source-page: 62; block: en-0556 -->

```text
&i2s0_8ch {
        clocks = <&cru MCLK_I2S0_TX>, <&cru MCLK_I2S0_RX>, <&cru HCLK_I2S0>,
                 <&cru MCLK_I2S0_TX_DIV>, <&cru MCLK_I2S0_RX_DIV>,
                 <&cru PLL_CPLL>, <&cru PLL_CPLL>;
        clock-names = "mclk_tx", "mclk_rx", "hclk",
                      "mclk_tx_src", "mclk_rx_src",
                      "mclk_root0", "mclk_root1";
        rockchip,mclk-calibrate;
};
```

<!-- source-page: 62; block: en-0557 -->

PDM-Controller

<!-- source-page: 62; block: en-0558 -->

```text
&pdm {
        status = "okay";
        clocks = <&cru MCLK_PDM>, <&cru HCLK_PDM>, <&cru PLL_CPLL>;
        clock-names = "pdm_clk", "pdm_hclk", "pdm_clk_root";
        rockchip,mclk-calibrate;
};
```

<!-- source-page: 62; block: en-0559 -->

4. Funktion prüfen

<!-- source-page: 62; block: en-0560 -->

Nach dem Aktivieren lässt sich der Takt mit amixer fein einstellen.

<!-- source-page: 62; block: en-0561 -->

Beispiel: Audiofrequenz der rk809-Soundkarte auf RV1126 fein einstellen

<!-- source-page: 62; block: en-0562 -->

```text
# cat /proc/asound/cards
 0 [rockchiprk809co]: rockchip_rk809- - rockchip,rk809-codec
                      rockchip,rk809-codec
# aplay -D hw:0,0 --period-size=1024 --buffer-size=4096 -f dat /dev/zero &
Playing raw data '/dev/zero' : Signed 16 bit Little Endian, Rate 48000 Hz, Stereo
# cat /sys/kernel/debug/clk/clk_summary | egrep "i2s0|cpll"
pll_cpll                          1        1        0   491519999
  cpll                            6       11        0   491519999
    mclk_i2s0_rx_div              1        1        0    12288000
      mclk_i2s0_rx_mux            1        1        0    12288000
        mclk_i2s0_rx              1        1        0    12288000
      mclk_i2s0_rx_fracdiv        0        0        0    12288000
    mclk_i2s0_tx_div              1        1        0    12288000
      mclk_i2s0_tx_mux            1        1        0    12288000
        mclk_i2s0_tx              2        2        0    12288000
          mclk_i2s0_tx_out2io     2        2        0    12288000
      mclk_i2s0_tx_fracdiv        0        0        0    12288000
# amixer contents
...
numid=3,iface=PCM,name='PCM Clk Compensation In PPM'
  ; type=INTEGER,access=rw------,values=1,min=-1000,max=1000,step=1
  : values=0
# amixer -- cset numid=3 10
numid=3,iface=PCM,name='PCM Clk Compensation In PPM'
  ; type=INTEGER,access=rw------,values=1,min=-1000,max=1000,step=1
  : values=10
# cat /sys/kernel/debug/clk/clk_summary | egrep "i2s0|cpll"
pll_cpll                          1        1        0   491524892
  cpll                            6       11        0   491524892
    mclk_i2s0_rx_div              1        1        0    12288123
      mclk_i2s0_rx_mux            1        1        0    12288123
        mclk_i2s0_rx              1        1        0    12288123
      mclk_i2s0_rx_fracdiv        0        0        0    12288123
    mclk_i2s0_tx_div              1        1        0    12288123
      mclk_i2s0_tx_mux            1        1        0    12288123
        mclk_i2s0_tx              2        2        0    12288123
          mclk_i2s0_tx_out2io     2        2        0    12288123
      mclk_i2s0_tx_fracdiv        0        0        0    12288123
# amixer -- cset numid=3 -10
numid=3,iface=PCM,name='PCM Clk Compensation In PPM'
  ; type=INTEGER,access=rw------,values=1,min=-1000,max=1000,step=1
  : values=-10
pll_cpll                          1        1        0   491515106
  cpll                            6       11        0   491515106
    mclk_i2s0_rx_div              1        1        0    12287878
      mclk_i2s0_rx_mux            1        1        0    12287878
        mclk_i2s0_rx              1        1        0    12287878
      mclk_i2s0_rx_fracdiv        0        0        0    12287878
    mclk_i2s0_tx_div              1        1        0    12287878
      mclk_i2s0_tx_mux            1        1        0    12287878
        mclk_i2s0_tx              2        2        0    12287878
          mclk_i2s0_tx_out2io     2        2        0    12287878
      mclk_i2s0_tx_fracdiv        0        0        0    12287878
```

<!-- source-page: 63; block: en-0564 -->

### 2.8 DLP

<!-- source-page: 63; block: en-0565 -->

Unterstützt digitales Audio-Loopback bei einzelnen und mehreren DAIs mit I2S-/I2STDM-/SAI-Controllern.

<!-- source-page: 64; block: en-0566 -->

#### 2.8.1 Loopback-Modus

<!-- source-page: 64; block: en-0567 -->

Derzeit werden folgende erweiterbare Loopback-Modi unterstützt.

<!-- source-page: 64; block: en-0568 -->

```text
Mode List:
# amixer contents
numid=2,iface=MIXER,name='Software Digital Loopback Mode'
  ; type=ENUMERATED,access=rw------,values=1,items=7
  ; Item #0 'Disabled'
  ; Item #1 '2CH: 1 Loopback + 1 Mic'
  ; Item #2 '2CH: 1 Mic + 1 Loopback'
  ; Item #3 '2CH: 1 Mic + 1 Loopback-mixed'
  ; Item #4 '2CH: 2 Loopbacks'
  ; Item #5 '4CH: 2 Mics + 2 Loopbacks'
  ; Item #6 '4CH: 2 Mics + 1 Loopback-mixed'
  ; Item #7 "4CH: 4 Loopbacks",
  ; Item #8 "6CH: 4 Mics + 2 Loopbacks",
  ; Item #9 "6CH: 4 Mics + 1 Loopback-mixed",
  ; Item #10 "6CH: 6 Loopbacks",
  ; Item #11 "8CH: 6 Mics + 2 Loopbacks",
  ; Item #12 "8CH: 6 Mics + 1 Loopback-mixed",
  ; Item #13 "8CH: 8 Loopbacks",
  ; Item #14 "10CH: 8 Mics + 2 Loopbacks",
  ; Item #15 "10CH: 8 Mics + 1 Loopback-mixed",
  ; Item #16 "16CH: 8 Mics + 8 Loopbacks",
  : values=0
```

<!-- source-page: 64; block: en-0569 -->

Beispiel: digitales Loopback für i2s aktivieren

<!-- source-page: 64; block: en-0570 -->

```text
Enable:
CONFIG_SND_SOC_ROCKCHIP_DLP
&i2s {
    rockchip,digital-loopback;
};
```

<!-- source-page: 64; block: en-0571 -->

### 2.9 Dynamischer DMA-Kanal

<!-- source-page: 64; block: en-0572 -->

Die RK-Plattform unterstützt PL330 und RKDMA. PL330 kann nur 8 Kanäle gleichzeitig betreiben; RKDMA hat diese Beschränkung nicht.

<!-- source-page: 64; block: en-0573 -->

ASoC im Kernel verwendet statisch angeforderte DMA-Kanäle. Bei PL330 können diese deshalb nicht zeitlich zwischen weiteren Peripheriegeräten geteilt werden. Dafür wird das dynamische Anfordern und Freigeben von Audio-DMA-Kanälen bereitgestellt.

<!-- source-page: 64; block: en-0574 -->

```text
CONFIG_SND_SOC_DYNAMIC_DMA_CHAN
```

<!-- source-page: 65; block: en-0575 -->

### 2.10 PATTERN DEBUG

<!-- source-page: 65; block: en-0576 -->

PATTERN-Daten erleichtern die Analyse von Timing-Problemen. Nach Aktivierung werden Wiedergabedaten durch eine feste Folge ersetzt, die unter anderem MSB-Bitprüfung und Kanal-ID enthält.

<!-- source-page: 65; block: en-0577 -->

```text
commit 0083e5a0ce9fe6654e586c9021b7b3cf90b5bf3c
Author: Sugar Zhang <sugar.zhang@rock-chips.com>
Date:   Tue Aug 13 22:09:29 2024 +0800
    ALSA: pcm: Add support for pcm pattern playback
    CONFIG_SND_PCM_PATTERN_DEBUG
    * MSB check
    * channel id
    * as much as more 0/1 stress
    PATTERN8(x)     (0xa0 | (x))
    PATTERN16(x)    (0xab00 | (x))
    PATTERN32(x)    (0xabcabc00 | (x))
    e.g. 16bit 4ch pattern:
    0xab01 0xab02 0xab03 0xab04 0xab01 ...
    This pattern is only used for IOCTL_READ/WRITE, not
    suitable for MMAP.
```

<!-- source-page: 65; block: en-0578 -->

## 3. Fehlersuche

<!-- source-page: 65; block: en-0579 -->

Einführung und Anwendung gängiger Debugging-Werkzeuge.

<!-- source-page: 65; block: en-0580 -->

### 3.1 Hardwaremessgeräte

<!-- source-page: 65; block: en-0581 -->

#### 3.1.1 Multimeter

<!-- source-page: 65; block: en-0582 -->

Messen Sie die Hardwareversorgung und prüfen Sie die Betriebsspannung anhand des Chiphandbuchs. Auf SoC-Seite muss die Spannung der IO-Domäne zur Softwarekonfiguration passen; auf CODEC-Seite müssen die Versorgungen sämtlicher Pfade die Handbuchanforderungen erfüllen.

<!-- source-page: 65; block: en-0583 -->

Beispiel RV1126 EVB: RK817 ist mit I2S0 verbunden, der CODEC arbeitet mit 1.8V. Das Multimeter misst 1.8V, wie Abbildung 3-2 zeigt.

<!-- source-page: 66; block: en-0584 -->

![Technische Originalabbildung: 3.1.1 Multimeter (Seite 66)](/docs/rockchip-audio/assets/en-p066-fig01.png)

<!-- source-page: 66; block: en-0585 -->

Abbildung 3-1: I2S-IO-Versorgung

<!-- source-page: 66; block: en-0586 -->

Die zugehörige Versorgungsdomäne wird im DTS wie folgt auf 1.8v eingestellt:

<!-- source-page: 66; block: en-0587 -->

```text
&pmu_io_domains {
        status = "okay";
        ...
        vccio7-supply = <&vcc_1v8>;
};
```

<!-- source-page: 66; block: en-0588 -->

Warnung: Stimmen Hardwareversorgung und Softwarekonfiguration nicht überein, können Fehlfunktionen, Chipschäden und weitere Probleme entstehen.

<!-- source-page: 66; block: en-0589 -->

#### 3.1.2 Oszilloskop

<!-- source-page: 66; block: en-0590 -->

Ein Oszilloskop ist wichtig, um Takt- und Datensignale zu prüfen. Messen Sie Taktfrequenz, Amplitude, Tastverhältnis und Jitter und vergleichen Sie diese mit der Protokollspezifikation. Bei 3.3V Betriebsspannung, aber nur 2V Taktsignal, kommen beispielsweise ein herunterziehendes externes Gerät, ein Kurzschluss gegen Masse oder eine falsche Spannungskonfiguration infrage. Erfassen Sie Takt- und Datensignale mit bekannten Datenmustern, um ihre Korrektheit zu prüfen; dafür eignet sich auch ein Logikanalysator. Mit Triggern lassen sich Fehlerereignisse erfassen, etwa Jitter oder Störimpulse im CLK-Signal bei Audioaussetzern.

<!-- source-page: 66; block: en-0591 -->

#### 3.1.3 Signalgenerator

<!-- source-page: 66; block: en-0592 -->

Signalgeneratoren erzeugen beispielsweise Rechteck-, Dreieck- und Sinussignale. Zur ADC-Prüfung speisen Sie ein bekanntes Signal wie einen Sinus ein und vergleichen den ADC-Ausgang mit dem Eingang, um Verzerrungen und Genauigkeit zu bewerten.

<!-- source-page: 67; block: en-0593 -->

#### 3.1.4 AP-Analysator

<!-- source-page: 67; block: en-0594 -->

Ein CODEC-Leistungsanalysator prüft die Parameter der Analog-Digital- und Digital-Analog-Wandler (ADC/DAC) eines CODEC-Systems. Er untersucht digitale Schnittstellensignale und misst analoge Kennwerte wie Signal-Rausch-Abstand (SNR), Gesamtklirrfaktor (THD) und Dynamikbereich. Damit können Entwickler Leistungsprobleme erkennen und das System entsprechend optimieren.

<!-- source-page: 67; block: en-0595 -->

### 3.2 Debug-Befehle

<!-- source-page: 67; block: en-0596 -->

#### 3.2.1 procfs

<!-- source-page: 67; block: en-0597 -->

Prüfen Sie im /proc-Dateisystem, ob die Soundkarte erfolgreich registriert wurde.

<!-- source-page: 67; block: en-0598 -->

Die Datei cards unter /proc/asound enthält alle registrierten Soundkarten des Systems.

<!-- source-page: 67; block: en-0599 -->

Zeigen Sie cards mit folgendem Befehl an:

<!-- source-page: 67; block: en-0600 -->

```text
# cat /proc/asound/cards
 0 [rockchiprk809co]: rockchip_rk809- - rockchip,rk809-codec
                      rockchip,rk809-codec
 7 [Loopback       ]: Loopback - Loopback
                      Loopback 1
# ls /dev/snd/
by-path    controlC7  pcmC0D0p  pcmC7D0p  pcmC7D1p
controlC0  pcmC0D0c   pcmC7D0c  pcmC7D1c  timer
```

<!-- source-page: 67; block: en-0601 -->

Bei erfolgreicher Registrierung erscheinen Name und Nummer der Soundkarte in der Ausgabe.

<!-- source-page: 67; block: en-0602 -->

#### 3.2.2 Taktübersicht (clk summary)

<!-- source-page: 67; block: en-0603 -->

Prüfen Sie den Audiotakt auf korrekte Einstellung.

<!-- source-page: 67; block: en-0604 -->

Beispiel: Frequenz von i2s0 mclk und der zugehörigen PLL abfragen. Ergebnis: mclk = 12288000 Hz, Quelle cpll.

<!-- source-page: 68; block: en-0605 -->

```text
# cat /sys/kernel/debug/clk/clk_summary | egrep "i2s0|pll"
pll_cpll                          1        1        0   500000000
  cpll                            5       10        0   500000000
    mclk_i2s0_rx_div              0        0        0   500000000
      mclk_i2s0_rx_fracdiv        0        0        0    12288000
        mclk_i2s0_rx_mux          0        0        0    12288000
          mclk_i2s0_rx            0        0        0    12288000
    mclk_i2s0_tx_div              1        1        0   500000000
      mclk_i2s0_tx_fracdiv        1        1        0    12288000
        mclk_i2s0_tx_mux          1        1        0    12288000
          mclk_i2s0_tx            1        1        0    12288000
            mclk_i2s0_tx_out2io   2        2        0    12288000
```

<!-- source-page: 68; block: en-0606 -->

#### 3.2.3 Register

<!-- source-page: 68; block: en-0607 -->

##### 3.2.3.1 Befehl io

<!-- source-page: 68; block: en-0608 -->

Mit "io" lassen sich Register lesen und ändern, insbesondere SoC-Register. Prüfen Sie Konfiguration und Betriebszustand anhand des Chiphandbuchs.

<!-- source-page: 68; block: en-0609 -->

```text
# cat /proc/iomem | grep i2s
ff800000-ff800fff : i2s@ff800000
#
# io -4 -l 0x40 0xff800000
ff800000:  7200000f 004e000f 10003f3f 00000010
ff800010:  000f0110 01f00000 00000000 00000003
ff800020:  00000000 00000000 00000000 0000001f
ff800030:  00003eff 00003eff 00000303 20150001
```

<!-- source-page: 68; block: en-0610 -->

##### 3.2.3.2 regmap

<!-- source-page: 68; block: en-0611 -->

Register über den regmap-Knoten anzeigen (nur lesend).

<!-- source-page: 68; block: en-0612 -->

```text
# ls /sys/kernel/debug/regmap/
0-0020-rk817-codec
ff800000.i2s
...
# cat /sys/kernel/debug/regmap/0-0020-rk817-codec/registers
12: 03
13: f4
14: 00
15: ff
16: 00
17: 40
18: 48
19: 00
1a: 00
1b: ff
1c: 00
1d: 00
1e: 02
1f: 00
...
```

<!-- source-page: 69; block: en-0614 -->

Hinweis: regmap verwendet einen Cache. Direkte Registeränderungen durch io erscheinen dort nicht, sofern der Treiber das Register nicht als volatile kennzeichnet oder den regmap-Cache deaktiviert.

<!-- source-page: 69; block: en-0615 -->

Beispiel: regmap-Cache deaktivieren und den tatsächlichen Registerwert lesen.

<!-- source-page: 69; block: en-0616 -->

```text
# cd /sys/kernel/debug/regmap/ff800000.i2s/
# cat registers /* dump register by regmap */
00: 7200000f
04: 004e000f
08: 10003f3f
0c: XXXXXXXX
10: 000f0010
14: 01f00000
18: XXXXXXXX
1c: 00000000
20: XXXXXXXX
24: XXXXXXXX
2c: XXXXXXXX
30: 00003eff
34: 00003eff
38: 00000303
# io -4 0xff800000 0x0  /* set 0xff800000 to 0 */
# io -4 -l 0x40 0xff800000  /* dump to check value of 0xff800000, now it's 0 */
ff800000:  00000000 004e000f 10003f3f 00000000
ff800010:  000f0010 01f00000 00000000 00000000
ff800020:  00000000 00000000 00000000 00000000
ff800030:  00003eff 00003eff 00000303 20150001
# cat registers /* dump register by regmap */
00: 7200000f    /* it's still old value */04: 004e000f
08: 10003f3f
0c: XXXXXXXX
10: 000f0010
14: 01f00000
18: XXXXXXXX
1c: 00000000
20: XXXXXXXX
24: XXXXXXXX
2c: XXXXXXXX
30: 00003eff
34: 00003eff
38: 00000303
# echo N > cache_only
[148833.374641] rockchip-i2s-tdm ff800000.i2s: debugfs cache_only=N forced: syncing cache
# echo Y > cache_bypass
[148834.760274] rockchip-i2s-tdm ff800000.i2s: debugfs cache_bypass=Y forced
# cat registers /* dump again, now it's correct */
00: 00000000
04: 004e000f
08: 10003f3f
0c: 00000000
10: 000f0010
14: 01f00000
18: 00000000
1c: 00000000
20: 00000000
24: 00000000
2c: 00000000
30: 00003eff
34: 00003eff
38: 00000303
```

<!-- source-page: 70; block: en-0618 -->

##### 3.2.3.3 i2c-tools

<!-- source-page: 70; block: en-0619 -->

Mit i2c-tools lassen sich Codec-Register lesen und ändern, sofern der Codec über I2C angebunden ist. Prüfen Sie Konfiguration und Betriebszustand anhand des Codec-Handbuchs.

<!-- source-page: 70; block: en-0620 -->

###### 3.2.3.3.1 i2cdetect

<!-- source-page: 70; block: en-0621 -->

Geräte auf dem I2C-Bus erkennen

<!-- source-page: 70; block: en-0622 -->

```text
Usage: i2cdetect [-y] [-a] [-q|-r] I2CBUS [FIRST LAST]
       i2cdetect -F I2CBUS
       i2cdetect -l
  I2CBUS is an integer or an I2C bus name
  If provided, FIRST and LAST limit the probing range.
```

<!-- source-page: 70; block: en-0623 -->

Beispiel: Geräte auf i2c0 abfragen

<!-- source-page: 70; block: en-0624 -->

```text
# i2cdetect -y 0
     0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
00:          -- -- -- -- -- -- -- -- -- -- -- -- --10: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --20: UU -- -- -- -- -- -- -- -- -- -- -- -- -- -- --30: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --40: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --50: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --60: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --70: -- -- -- -- -- -- -- --
```

<!-- source-page: 71; block: en-0625 -->

###### 3.2.3.3.2 i2cdump

<!-- source-page: 71; block: en-0626 -->

Alle Register des Geräts ausgeben

<!-- source-page: 71; block: en-0627 -->

```text
Usage: i2cdump [-f] [-y] [-r first-last] I2CBUS ADDRESS [MODE [BANK [BANKREG]]]
  I2CBUS is an integer or an I2C bus name
  ADDRESS is an integer (0x03 - 0x77)
  MODE is one of:
    b (byte, default)
    w (word)
    W (word on even register addresses)
    s (SMBus block)
    i (I2C block)
    c (consecutive byte)
    Append p for SMBus PEC
```

<!-- source-page: 71; block: en-0628 -->

Beispiel: Register des rk817 (Geräteadresse 0x20) am Bus i2c0 abfragen. 0x12 ~ 0x4f sind Codec-Register.

<!-- source-page: 71; block: en-0629 -->

```text
# i2cdump -f -y 0 0x20 b
     0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
00: 03 35 18 10 08 17 04 00 00 00 01 01 00 80 02 00
10: 00 00 03 f4 00 ff 00 40 48 00 00 ff 00 00 02 00
20: 00 00 00 00 ff 00 00 1f 00 99 00 00 00 00 00 03
30: 04 03 03 00 a5 02 00 00 11 03 03 00 00 e0 0f 09
40: a5 7f 04 58 2d 0c a5 00 00 00 00 0f 20 00 0f 88
50: 8c 00 01 00 01 b0 44 1e 00 60 16 6a 16 6a ff f8
60: ff f8 00 00 00 00 00 00 00 00 00 16 66 01 d7 00
70: 00 00 00 00 ff ed d6 58 16 6a ff f9 00 00 00 00
80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
90: 60 81 d5 7f fb df ca 81 d2 ff 00 00 00 00 00 00
a0: 00 00 00 00 b8 00 00 00 00 00 00 00 00 00 00 00
b0: 00 0f 0f 0f 0f ad 0e ff ff 00 64 18 18 64 12 18
c0: 64 00 00 64 62 62 64 ff ff ff ff ff 08 08 30 30
d0: 08 08 30 30 30 30 18 14 58 58 6c 6c 6c 6c 0b 33
e0: 00 00 00 55 a2 c8 c5 40 00 ff 22 03 0a 80 94 0b
f0: c0 8c a0 40 18 10 00 86 00 dc 00 ff 00 ff 60 00
```

<!-- source-page: 71; block: en-0630 -->

###### 3.2.3.3.3 i2cset

<!-- source-page: 71; block: en-0631 -->

Einzelnen Registerwert ändern

<!-- source-page: 71; block: en-0632 -->

```text
Usage: i2cset [-f] [-y] [-m MASK] [-r] I2CBUS CHIP-ADDRESS DATA-ADDRESS [VALUE] ... [MODE]
  I2CBUS is an integer or an I2C bus name
  ADDRESS is an integer (0x03 - 0x77)
  MODE is one of:
    c (byte, no value)
    b (byte data, default)
    w (word data)
    i (I2C block data)
    s (SMBus block data)
    Append p for SMBus PEC
```

<!-- source-page: 72; block: en-0633 -->

Beispiel: Register 0x12 auf 0 setzen

<!-- source-page: 72; block: en-0634 -->

```text
# i2cset -f -y -r 0 0x20 0x12 0x0 b
Value 0x00 written, readback matched
```

<!-- source-page: 72; block: en-0635 -->

###### 3.2.3.3.4 i2cget

<!-- source-page: 72; block: en-0636 -->

Einzelnen Registerwert abfragen

<!-- source-page: 72; block: en-0637 -->

```text
Usage: i2cget [-f] [-y] I2CBUS CHIP-ADDRESS [DATA-ADDRESS [MODE]]
  I2CBUS is an integer or an I2C bus name
  ADDRESS is an integer (0x03 - 0x77)
  MODE is one of:
    b (read byte data, default)
    w (read word data)
    c (write byte/read byte)
    Append p for SMBus PEC
```

<!-- source-page: 72; block: en-0638 -->

Beispiel: Wert von Register 0x12 lesen

<!-- source-page: 72; block: en-0639 -->

```text
# i2cget -f -y 0 0x20 0x12 b
0x00
```

<!-- source-page: 72; block: en-0640 -->

Weitere Einzelheiten: i2c-tools

<!-- source-page: 72; block: en-0641 -->

#### 3.2.4 alsa-utils

<!-- source-page: 72; block: en-0642 -->

Das RK Linux SDK enthält standardmäßig alsa-utils.

<!-- source-page: 72; block: en-0643 -->

##### 3.2.4.1 aplay

<!-- source-page: 72; block: en-0644 -->

```text
Usage: aplay [OPTION]... [FILE]...
-h, --help              help
    --version           print current version
-l, --list-devices      list all soundcards and digital audio devices
-L, --list-pcms         list device names
-D, --device=NAME       select PCM by name
-q, --quiet             quiet mode
-t, --file-type TYPE    file type (voc, wav, raw or au)
-c, --channels=#        channels
-f, --format=FORMAT     sample format (case insensitive)
-r, --rate=#            sample rate
-d, --duration=#        interrupt after # seconds
-s, --samples=#         interrupt after # samples per channel
-M, --mmap              mmap stream
-N, --nonblock          nonblocking mode
-F, --period-time=#     distance between interrupts is # microseconds
-B, --buffer-time=#     buffer duration is # microseconds
    --period-size=#     distance between interrupts is # frames
    --buffer-size=#     buffer duration is # frames
-A, --avail-min=#       min available space for wakeup is # microseconds
-R, --start-delay=#     delay for automatic PCM start is # microseconds
                        (relative to buffer size if <= 0)
-T, --stop-delay=#      delay for automatic PCM stop is # microseconds from xrun
-v, --verbose           show PCM structure and setup (accumulative)
-V, --vumeter=TYPE      enable VU meter (TYPE: mono or stereo)
-I, --separate-channels one file for each channel
-i, --interactive       allow interactive operation from stdin
-m, --chmap=ch1,ch2,..  Give the channel map to override or follow
    --disable-resample  disable automatic rate resample
    --disable-channels  disable automatic channel conversions
    --disable-format    disable automatic format conversions
    --disable-softvol   disable software volume control (softvol)
    --test-position     test ring buffer position
    --test-coef=#       test coefficient for ring buffer position (default 8)
                        expression for validation is: coef * (buffer_size / 2)
    --test-nowait       do not wait for ring buffer - eats whole CPU
    --max-file-time=#   start another output file when the old file has recorded
                        for this many seconds
    --process-id-file   write the process ID here
    --use-strftime      apply the strftime facility to the output file name
    --dump-hw-params    dump hw_params of the device
    --fatal-errors      treat all errors as fatal
```

<!-- source-page: 73; block: en-0646 -->

Beispiel: Stille mit 48kHz, 2 Kanälen und 16 Bits über Soundkarte 0 wiedergeben

<!-- source-page: 73; block: en-0647 -->

```text
# aplay -D hw:0,0 --period-size=1024 --buffer-size=4096 -r 48000 -c 2 -f s16_le /dev/zero
```

<!-- source-page: 73; block: en-0648 -->

##### 3.2.4.2 arecord

<!-- source-page: 73; block: en-0649 -->

```text
Usage: arecord [OPTION]... [FILE]...
-h, --help              help
    --version           print current version
-l, --list-devices      list all soundcards and digital audio devices
-L, --list-pcms         list device names
-D, --device=NAME       select PCM by name
-q, --quiet             quiet mode
-t, --file-type TYPE    file type (voc, wav, raw or au)
-c, --channels=#        channels
-f, --format=FORMAT     sample format (case insensitive)
-r, --rate=#            sample rate
-d, --duration=#        interrupt after # seconds
-s, --samples=#         interrupt after # samples per channel
-M, --mmap              mmap stream
-N, --nonblock          nonblocking mode
-F, --period-time=#     distance between interrupts is # microseconds
-B, --buffer-time=#     buffer duration is # microseconds
    --period-size=#     distance between interrupts is # frames
    --buffer-size=#     buffer duration is # frames
-A, --avail-min=#       min available space for wakeup is # microseconds
-R, --start-delay=#     delay for automatic PCM start is # microseconds
                        (relative to buffer size if <= 0)
-T, --stop-delay=#      delay for automatic PCM stop is # microseconds from xrun
-v, --verbose           show PCM structure and setup (accumulative)
-V, --vumeter=TYPE      enable VU meter (TYPE: mono or stereo)
-I, --separate-channels one file for each channel
-i, --interactive       allow interactive operation from stdin
-m, --chmap=ch1,ch2,..  Give the channel map to override or follow
    --disable-resample  disable automatic rate resample
    --disable-channels  disable automatic channel conversions
    --disable-format    disable automatic format conversions
    --disable-softvol   disable software volume control (softvol)
    --test-position     test ring buffer position
    --test-coef=#       test coefficient for ring buffer position (default 8)
                        expression for validation is: coef * (buffer_size / 2)
    --test-nowait       do not wait for ring buffer - eats whole CPU
    --max-file-time=#   start another output file when the old file has recorded
                        for this many seconds
    --process-id-file   write the process ID here
    --use-strftime      apply the strftime facility to the output file name
    --dump-hw-params    dump hw_params of the device
    --fatal-errors      treat all errors as fatal
```

<!-- source-page: 74; block: en-0651 -->

Beispiel: Audio mit 16kHz, 8 Kanälen und 32 Bits über Soundkarte 0 aufnehmen

<!-- source-page: 74; block: en-0652 -->

```text
# arecord -D hw:0,0 --period-size=1024 --buffer-size=4096 -r 16000 -c 8 -f s32_le r.wav
```

<!-- source-page: 74; block: en-0653 -->

##### 3.2.4.3 arecord | aplay

<!-- source-page: 74; block: en-0654 -->

Beide Werkzeuge können über eine Pipe zu einem Loopback verbunden werden. Dies erleichtert Treiberdebugging und Messungen.

<!-- source-page: 74; block: en-0655 -->

Beispiel: Aufnahme über Soundkarte 0 -&gt; Wiedergabe über Soundkarte 1

<!-- source-page: 74; block: en-0656 -->

```text
# arecord -D hw:0,0 --period-size=1024 --buffer-size=4096 -r 48000 -c 2 -f s16_le -t raw |
aplay -D hw:1,0 --period-size=1024 --buffer-size=4096 -r 48000 -c 2 -f s16_le -t raw
```

<!-- source-page: 74; block: en-0657 -->

##### 3.2.4.4 amixer

<!-- source-page: 74; block: en-0658 -->

Steuert interne Codec-Pfadschalter, Audiorouting und Lautstärke. Verwenden Sie dazu das Audiotopologiediagramm des Codec-Handbuchs, beispielsweise Abbildung 3-2 für RK3308.

<!-- source-page: 75; block: en-0659 -->

![Technische Originalabbildung: 3.2.4.4 amixer (Seite 75)](/docs/rockchip-audio/assets/en-p075-fig01.png)

<!-- source-page: 75; block: en-0660 -->

Abbildung 3-2: RK3308-Codec

<!-- source-page: 75; block: en-0661 -->

```text
Usage: amixer <options> [command]
Available options:
  -h,--help       this help
  -c,--card N     select the card
  -D,--device N   select the device, default 'default'
  -d,--debug      debug mode
  -n,--nocheck    do not perform range checking
  -v,--version    print version of this program
  -q,--quiet      be quiet
  -i,--inactive   show also inactive controls
  -a,--abstract L select abstraction level (none or basic)
  -s,--stdin      Read and execute commands from stdin sequentially
  -R,--raw-volume Use the raw value (default)
  -M,--mapped-volume Use the mapped volume
Available commands:
  scontrols       show all mixer simple controls
  scontents       show contents of all mixer simple controls (default command)
  sset sID P      set contents for one mixer simple control
  sget sID        get contents for one mixer simple control
  controls        show all controls for given card
  contents        show contents of all controls for given card
  cset cID P      set control contents for one control
  cget cID        get control contents for one control
```

<!-- source-page: 76; block: en-0663 -->

Beispiel: Soundkarten-Controls abfragen und Wiedergabepfad auf SPK umschalten.

<!-- source-page: 76; block: en-0664 -->

```text
# amixer -c 0 contents
numid=1,iface=MIXER,name='Playback Path'
  ; type=ENUMERATED,access=rw------,values=1,items=11
  ; Item #0 'OFF'
  ; Item #1 'RCV'
  ; Item #2 'SPK'
  ; Item #3 'HP'
  ; Item #4 'HP_NO_MIC'
  ; Item #5 'BT'
  ; Item #6 'SPK_HP'
  ; Item #7 'RING_SPK'
  ; Item #8 'RING_HP'
  ; Item #9 'RING_HP_NO_MIC'
  ; Item #10 'RING_SPK_HP'
  : values=0
...
# amixer -c 0 cset numid=1 2
numid=1,iface=MIXER,name='Playback Path'
  ; type=ENUMERATED,access=rw------,values=1,items=11
  ; Item #0 'OFF'
  ; Item #1 'RCV'
  ; Item #2 'SPK'
  ; Item #3 'HP'
  ; Item #4 'HP_NO_MIC'
  ; Item #5 'BT'
  ; Item #6 'SPK_HP'
  ; Item #7 'RING_SPK'
  ; Item #8 'RING_HP'
  ; Item #9 'RING_HP_NO_MIC'
  ; Item #10 'RING_SPK_HP'
  : values=2
```

<!-- source-page: 76; block: en-0665 -->

##### 3.2.4.5 alsaloop

<!-- source-page: 76; block: en-0666 -->

Unterstützt Routing zwischen beliebigen Soundkarten

<!-- source-page: 76; block: en-0667 -->

Unterstützt adaptive Taktsynchronisation

<!-- source-page: 76; block: en-0668 -->

Unterstützt adaptives Resampling

<!-- source-page: 76; block: en-0669 -->

Unterstützt Umleitung von Mixer-Controls

<!-- source-page: 76; block: en-0670 -->

```text
Usage: alsaloop [OPTION]...
-h,--help      help
-g,--config    configuration file (one line = one job specified)
-d,--daemonize daemonize the main process and use syslog for errors
-P,--pdevice   playback device
-C,--cdevice   capture device
-X,--pctl      playback ctl device
-Y,--cctl      capture ctl device
-l,--latency   requested latency in frames
-t,--tlatency  requested latency in usec (1/1000000sec)
-f,--format    sample format
-c,--channels  channels
-r,--rate      rate
-n,--resample  resample in alsa-lib
-A,--samplerate use converter (0=sincbest,1=sincmedium,2=sincfastest,
                               3=zerohold,4=linear)
-B,--buffer    buffer size in frames
-E,--period    period size in frames
-s,--seconds   duration of loop in seconds
-b,--nblock    non-block mode (very early process wakeup)
-S,--sync      sync mode(0=none,1=simple,2=captshift,3=playshift,4=samplerate,
                         5=auto)
-a,--slave     stream parameters slave mode (0=auto, 1=on, 2=off)
-T,--thread    thread number (-1 = create unique)
-m,--mixer  redirect mixer, argument is:
            SRC_SLAVE_ID(PLAYBACK)[@DST_SLAVE_ID(CAPTURE)]
-O,--ossmixer   rescan and redirect oss mixer, argument is:
            ALSA_ID@OSS_ID  (for example: "Master@VOLUME")
-e,--effect    apply an effect (bandpass filter sweep)
-v,--verbose   verbose mode (more -v means more verbose)
-w,--workaround use workaround (serialopen)
-U,--xrun      xrun profiling
-W,--wake      process wake timeout in ms
-z,--syslog    use syslog for errors
Recognized sample formats are: S8 U8 S16_LE S16_BE U16_LE U16_BE S24_LE S24_BE U24_LE U24_BE
S32_LE S32_BE U32_LE U32_BE FLOAT_LE FLOAT_BE FLOAT64_LE FLOAT64_BE IEC958_SUBFRAME_LE
IEC958_SUBFRAME_BE MU_LAW A_LAW IMA_ADPCM MPEG GSM SPECIAL S24_3LE S24_3BE U24_3LE U24_3BE
S20_3LE S20_3BE U20_3LE U20_3BE S18_3LE S18_3BE U18_3LE U18_3BE G723_24 G723_24_1B G723_40
G723_40_1B DSD_U8 DSD_U16_LE DSD_U32_LE DSD_U16_BE
Tip #1 (usable 500ms latency, good CPU usage, superb xrun prevention):
  alsaloop -t 500000
Tip #2 (superb 1ms latency, but heavy CPU usage):
  alsaloop -t 1000
Sync mode specification for capture to playback stream:
 0 or none       - do not touch the stream
 1 or simple     - add or remove samples to keep
                   both streams synchronized
 2 or captshift  - use driver for the capture device
                   (if supported) to compensate
                   the rate shift
 3 or playshift  - use driver for the playback device
                   (if supported) to compensate
                   the rate shift
 4 or samplerate - use samplerate library to do rate resampling
 5 or auto       - automatically selects the best method
                   in this order: captshift, playshift,
                   samplerate, simple
```

<!-- source-page: 78; block: en-0673 -->

Beispiel: Mit Soundkarte 0 aufgenommenes Audio wird über Soundkarte 1 wiedergegeben. Synchronisationsstrategie 1 fügt Samples hinzu oder entfernt sie.

<!-- source-page: 78; block: en-0674 -->

```text
# alsaloop -C hw:0,0 -P hw:1,0 -t 10000  -A 3 -S 1 -b -v
```

<!-- source-page: 78; block: en-0675 -->

Hinweis:

<!-- source-page: 78; block: en-0676 -->

Verwenden Soundkarte 0 und 1 dieselbe Taktquelle, etwa denselben OSC, entsteht kein kumulativer Asynchronitätsfehler. Ist Soundkarte 0 ein UAC mit PC-Takt und Soundkarte 1 eine lokale Karte mit Gerätetakt, entstehen wegen der unterschiedlichen Quellen im Laufe der Zeit unvermeidlich kumulative Fehler und Audioaussetzer. Dann ist Softwarekompensation, etwa Einfügen oder Entfernen von Samples, oder Hardwarekompensation, etwa Audiotaktkompensation, erforderlich.

<!-- source-page: 78; block: en-0677 -->

#### 3.2.5 tiny-alsa

<!-- source-page: 78; block: en-0678 -->

Das RK Android SDK enthält standardmäßig tiny-alsa.

<!-- source-page: 78; block: en-0679 -->

##### 3.2.5.1 tinypcminfo

<!-- source-page: 78; block: en-0680 -->

Unterstützte Abtastraten, Formate, Kanalzahlen usw. der Soundkarte abfragen.

<!-- source-page: 78; block: en-0681 -->

```text
Usage: tinypcminfo [-D card] [-d device]
```

<!-- source-page: 78; block: en-0682 -->

Beispiel:

<!-- source-page: 78; block: en-0683 -->

```text
# tinypcminfo -D 0
Info for card 0, device 0:
PCM out:
Access: 0x000009
Format0: 0x000044
Format1: 0x000010
Format Name: S16_LE, S24_LE, S32_LE
Subformat: 0x000001
Rate: min=16000Hz max=48000Hz
Channels: min=2 max=2
Sample bits: min=16 max=32
Period size: min=4 max=65536
Period count: min=2 max=4096
PCM in:
Access: 0x000009
Format0: 0x000044
Format1: 0x000010
Format Name: S16_LE, S24_LE, S32_LE
Subformat: 0x000001
Rate: min=16000Hz max=48000Hz
Channels: min=2 max=2
Sample bits: min=16 max=32
Period size: min=4 max=65536
Period count: min=2 max=4096
```

<!-- source-page: 79; block: en-0685 -->

##### 3.2.5.2 tinyplay

<!-- source-page: 79; block: en-0686 -->

```text
Usage: tinyplay file.wav [-D card] [-d device] [-p period_size] [-n n_periods]
```

<!-- source-page: 79; block: en-0687 -->

Beispiel: Audiodatei 1k0 wiedergeben

<!-- source-page: 79; block: en-0688 -->

```text
# tinyplay /sdcard/1k0.wav -D 0 -d 0 -p 1024 -n 3
Playing sample: 2 ch, 44100 hz, 32 bit
```

<!-- source-page: 79; block: en-0689 -->

##### 3.2.5.3 tinycap

<!-- source-page: 79; block: en-0690 -->

```text
Usage: tinycap file.wav [-D card] [-d device] [-c channels] [-r rate] [-b bits] [-p
period_size] [-n n_periods]
```

<!-- source-page: 79; block: en-0691 -->

Beispiel: Audio mit Abtastrate 44.1k aufnehmen

<!-- source-page: 79; block: en-0692 -->

```text
# tinycap /sdcard/rec.wav -D 0 -d 0 –c 2 –r 44100 –b 16 –p 1024 –n 3
```

<!-- source-page: 79; block: en-0693 -->

##### 3.2.5.4 tinymix

<!-- source-page: 79; block: en-0694 -->

Steuert interne Codec-Pfadschalter, Lautstärke usw.; entspricht funktional amixer.

<!-- source-page: 79; block: en-0695 -->

```text
usage: tinymix [-D card]
```

<!-- source-page: 79; block: en-0696 -->

Beispiel: Mono-Pfad einschalten

<!-- source-page: 80; block: en-0697 -->

```text
# tinymix
Mixer name: 'rockchip,rt5640-codec'
Number of controls: 123
ctl     type    num    name                                    value
0       BOOL    1      Mono Playback Switch                    Off
1       INT     2      Mono DAC Playback Volume                175 175
2       BOOL    2      Speaker Channel Switch                  Off Off
3       INT     2      Speaker Playback Volume                 31 31
4       BOOL    2      HP Channel Switch                       Off Off
...
# tinymix "Mono Playback Switch" 1
Mono Playback Switch: On
```

<!-- source-page: 80; block: en-0698 -->

#### 3.2.6 XRUN-Analyse

<!-- source-page: 80; block: en-0699 -->

Ein xrun ist bei der Audioverarbeitung ein Fehlerzustand, bei dem der Datenfluss unterbrochen oder gestört wird und die Synchronisation von Ein- und Ausgabe verloren geht. Man unterscheidet underrun und overrun.

<!-- source-page: 80; block: en-0700 -->

Ein underrun entsteht, wenn der Audiopuffer nicht rechtzeitig für die Wiedergabe gefüllt wird; die Ausgabe enthält dann eine Lücke oder Stille. Ein overrun entsteht, wenn der Aufnahmepuffer nicht rechtzeitig ausgelesen wird und eingehende Daten verworfen werden müssen.

<!-- source-page: 80; block: en-0701 -->

Im Linux-Kernel unterstützt ALSA (Advanced Linux Sound Architecture) die Behandlung von xruns. Seine Pufferverwaltung soll einen kontinuierlichen Datenfluss sicherstellen und xruns vermeiden. Die Quelle beschreibt bei einem xrun eine Interruptbenachrichtigung des Gerätetreibers über einen leeren oder vollen Puffer, damit dieser nachgefüllt oder geleert werden kann.

<!-- source-page: 80; block: en-0702 -->

Für wirksame xrun-Behandlung sollten Audiotreiber Echtzeitverarbeitung mit geringer Latenz und hohem Durchsatz unterstützen. Effiziente Puffertechniken wie Vorabladen und Doppelpufferung halten Daten für Aufnahme und Wiedergabe bereit. Außerdem sollten Übertragungslatenzen minimiert und Fehlerbehandlungsroutinen zur schnellen Erholung von xruns implementiert werden.

<!-- source-page: 80; block: en-0703 -->

##### 3.2.6.1 xrun kmsg

<!-- source-page: 80; block: en-0704 -->

1. XRUN CONFIG aktivieren

<!-- source-page: 80; block: en-0705 -->

```text
CONFIG_SND_DEBUG
CONFIG_SND_PCM_XRUN_DEBUG
CONFIG_SND_VERBOSE_PROCFS
```

<!-- source-page: 80; block: en-0706 -->

Tabelle 3-1 zeigt die xrun-Debug-Schalter. Um alle zu aktivieren, addieren Sie ihre Werte.

<!-- source-page: 81; block: en-0707 -->

| Bitwert | Beschreibung |
| --- | --- |
| 1 | Grundlegendes Debugging: xruns über ksyslog anzeigen |
| 2 | Stack-Ausgabe für grundlegendes Debugging |
| 4 | Jiffies-Prüfung: Position mit jiffies (monotone Kernelzeitbasis) vergleichen und Änderungen bei aktiviertem grundlegenden Debugging anzeigen |

<!-- source-page: 81; block: en-0708 -->

Tabelle 3-1: xrun-Debug-Schalter

<!-- source-page: 81; block: en-0709 -->

2. Alle xrun-Debug-Schalter für Wiedergabegeräte der Soundkarte 0 aktivieren

<!-- source-page: 81; block: en-0710 -->

```text
# echo 7 > /proc/asound/card0/pcm0p/xrun_debug
```

<!-- source-page: 81; block: en-0711 -->

3. Bei einem underrun des DMA-Wiedergaberingpuffers erscheinen beispielsweise folgende Meldungen:

<!-- source-page: 81; block: en-0712 -->

```text
asoc-simple-card rk809-sound: XRUN: pcmC0D0p:0
CPU: 3 PID: 657 Comm: sh Not tainted 4.19.161 #509
Hardware name: Generic DT based system
[<b010f47c>] (unwind_backtrace) from [<b010b9a8>] (show_stack+0x10/0x14)
[<b010b9a8>] (show_stack) from [<b0850b58>] (dump_stack+0x90/0xa4)
[<b0850b58>] (dump_stack) from [<b06a39c4>] (__snd_pcm_xrun+0xa0/0x114)
[<b06a39c4>] (__snd_pcm_xrun) from [<b069dac4>] (snd_pcm_stop_xrun+0x64/0x68)
[<b069dac4>] (snd_pcm_stop_xrun) from [<b0695c4c>](snd_info_text_entry_release+0x34/0x7c)
[<b0695c4c>] (snd_info_text_entry_release) from [<b02694a4>] (close_pdeo+0x54/0x100)
[<b02694a4>] (close_pdeo) from [<b02695c0>] (proc_reg_release+0x70/0x78)
[<b02695c0>] (proc_reg_release) from [<b0210ac8>] (__fput+0x88/0x1c4)
[<b0210ac8>] (__fput) from [<b01412d4>] (task_work_run+0x94/0xb4)
[<b01412d4>] (task_work_run) from [<b010b48c>] (do_work_pending+0xc8/0xd0)
[<b010b48c>] (do_work_pending) from [<b0101064>] (slow_work_pending+0xc/0x20)
```

<!-- source-page: 81; block: en-0713 -->

##### 3.2.6.2 xrun ftrace

<!-- source-page: 81; block: en-0714 -->

Zusätzlich zu Kernelmeldungen liefern xrun-Trace-Ereignisse detaillierte Informationen wie hwptr und applptr. Dafür muss Kernel-Trace-Debugging aktiviert sein. Tabelle 3-2 zeigt die von ALSA unterstützten Kernel-Trace-Ereignisse.

<!-- source-page: 81; block: en-0715 -->

| Trace-Ereignis | Beschreibung |
| --- | --- |
| snd_pcm:applptr | APP-Zeiger aktualisieren |
| snd_pcm:hw_ptr_error | DMA-Zeigerfehler |
| snd_pcm:xrun | xrun |
| snd_pcm:hwptr | DMA-Zeiger aktualisieren |

<!-- source-page: 81; block: en-0716 -->

1. FTRACE CONFIG aktivieren

<!-- source-page: 82; block: en-0717 -->

```text
CONFIG_FUNCTION_TRACER
CONFIG_FUNCTION_GRAPH_TRACER
CONFIG_STACK_TRACER
CONFIG_DYNAMIC_FTRACE
```

<!-- source-page: 82; block: en-0718 -->

2. Audio im Hintergrund wiedergeben

<!-- source-page: 82; block: en-0719 -->

```text
# aplay -D hw:0,0 --period-size=128 --buffer-size=256 -r 48000 -f dat /dev/zero &
```

<!-- source-page: 82; block: en-0720 -->

3. Audio-Trace-Ereignisse aktivieren. Sie zeigen detaillierte Lese- und Schreibzugriffe der Pufferproduzenten und -verbraucher und erleichtern die Fehlersuche.

<!-- source-page: 82; block: en-0721 -->

```text
# cd /sys/kernel/debug/tracing
# echo "snd_pcm:applptr" >> set_event
# echo "snd_pcm:hwptr" >> set_event
# echo "snd_pcm:xrun" >> set_event
# cat trace | head -20
...
178.109942: applptr: pcmC0D0p/sub0: prev=0, curr=128, avail=128, period=128, buf=256
178.109981: applptr: pcmC0D0p/sub0: prev=128, curr=256, avail=0, period=128, buf=256
178.110224: hwptr:   pcmC0D0p/sub0: POS: pos=24, old=0, base=0, period=128, buf=256
178.110234: applptr: pcmC0D0p/sub0: prev=256, curr=280, avail=0, period=128, buf=256
178.112441: hwptr:   pcmC0D0p/sub0: IRQ: pos=128, old=24, base=0, period=128, buf=256
178.112510: applptr: pcmC0D0p/sub0: prev=280, curr=384, avail=0, period=128, buf=256
178.112553: hwptr:   pcmC0D0p/sub0: POS: pos=136, old=128, base=0, period=128, buf=256
178.112556: applptr: pcmC0D0p/sub0: prev=384, curr=392, avail=0, period=128, buf=256
178.115176: hwptr:   pcmC0D0p/sub0: IRQ: pos=0, old=136, base=0, period=128, buf=256
178.115270: applptr: pcmC0D0p/sub0: prev=392, curr=512, avail=0, period=128, buf=256
178.115321: hwptr:   pcmC0D0p/sub0: POS: pos=8, old=256, base=256, period=128, buf=256
178.115327: applptr: pcmC0D0p/sub0: prev=512, curr=520, avail=0, period=128, buf=256
```

<!-- source-page: 82; block: en-0722 -->

Weitere Einzelheiten: kernel/Documentation/trace/*

<!-- source-page: 82; block: en-0723 -->

##### 3.2.6.3 trace-cmd

<!-- source-page: 82; block: en-0724 -->

trace-cmd ist das Frontend von ftrace und vereinfacht dessen Bedienung, wie das folgende Beispiel zeigt:

<!-- source-page: 82; block: en-0725 -->

```text
# trace-cmd record -e snd_pcm:hwptr -e snd_pcm:applptr -e snd_pcm:xrun
# trace-cmd report
```

<!-- source-page: 82; block: en-0726 -->

Weitere Einzelheiten: trace-cmd

<!-- source-page: 83; block: en-0727 -->

##### 3.2.6.4 KernelShark

<!-- source-page: 83; block: en-0728 -->

KernelShark ist das grafische Frontend von trace-cmd und stellt dessen Daten visuell dar. Siehe: KernelShark

<!-- source-page: 83; block: en-0729 -->

### 3.3 PC-Werkzeuge

<!-- source-page: 83; block: en-0730 -->

Audacity und Audition sind Werkzeuge zur Audioanalyse und -bearbeitung auf dem PC. Sie eignen sich zur Untersuchung von Aussetzern, Rauschen, Verzerrungen und Störungen mit konstanter Frequenz.

<!-- source-page: 83; block: en-0731 -->

## 4. FAQ

<!-- source-page: 83; block: en-0732 -->

### 4.1 Unterstützte Audioschnittstellen

<!-- source-page: 83; block: en-0733 -->

Siehe Audiofunktionen von Rockchip und das Chipdatenblatt.

<!-- source-page: 83; block: en-0734 -->

### 4.2 Soundkartenregistrierung fehlgeschlagen

<!-- source-page: 83; block: en-0735 -->

Prüfen Sie anhand des Beispiels zum Hinzufügen einer Soundkarte, ob die Soundkartentreiberkonfiguration in das System einkompiliert wurde.

<!-- source-page: 83; block: en-0736 -->

Grenzen Sie den Fehler mit kmsg auf DAI, CODEC oder Machine ein. Die folgende Meldung zeigt beispielsweise eine nicht registrierte DAI:

<!-- source-page: 83; block: en-0737 -->

[ 0.584114] rk-multicodecs vad-sound: ASoC: CPU DAI (null) not registered

<!-- source-page: 83; block: en-0738 -->

DAI-Fehler prüfen: Bei unzureichenden DMA-Kanalressourcen schlägt die DAI-Registrierung fehl. Deaktivieren Sie andere DMA-Nutzer und prüfen Sie erneut.

<!-- source-page: 83; block: en-0739 -->

CODEC-Fehler prüfen: Messen Sie Spannung und Takt mit Multimeter und Oszilloskop und prüfen Sie gleichzeitig die I2C-Kommunikation mit i2c-tools.

<!-- source-page: 83; block: en-0740 -->

### 4.3 Wiedergabe ohne Ton

<!-- source-page: 83; block: en-0741 -->

Prüfen Sie, ob die Quelldatei überhaupt Audiodaten und nicht nur Stille enthält.

<!-- source-page: 83; block: en-0742 -->

Geben Sie mit aplay oder tinyplay wieder, um den Fehler auf Benutzerraum oder Kernel einzugrenzen.

<!-- source-page: 83; block: en-0743 -->

Warten Sie bei der Wiedergabe länger als 10 Sekunden, um einen Timeout mit I/O-Fehler zu erkennen.

<!-- source-page: 83; block: en-0744 -->

Prüfen Sie mit amixer oder tinymix, ob der interne DAC-Pfad des CODEC aktiviert und die Lautstärke nicht stummgeschaltet ist.

<!-- source-page: 83; block: en-0745 -->

Prüfen Sie die Registerkonfiguration von IOMUX, DAI und CODEC anhand des Chip- oder Codec-Handbuchs.

<!-- source-page: 84; block: en-0746 -->

Messen Sie mit Multimeter und Oszilloskop Spannung, Takt und Daten. Prüfen Sie korrekte Spannung und Takte sowie Aktivität auf der Datenleitung. Messen Sie das analoge Ausgangssignal unmittelbar am CODEC und den Pegel des PA-Enable-GPIO, um den Fehler schrittweise einzugrenzen.

<!-- source-page: 84; block: en-0747 -->

### 4.4 Verzerrte Wiedergabe

<!-- source-page: 84; block: en-0748 -->

Geben Sie eine Audiodatei 1k0 mit aplay oder tinyplay wieder.

<!-- source-page: 84; block: en-0749 -->

Ändern Sie die Lautstärke, um eine Abhängigkeit der Verzerrung vom Pegel festzustellen.

<!-- source-page: 84; block: en-0750 -->

Prüfen Sie den CODEC-Ausgang mit dem Oszilloskop auf Clipping und andere Verzerrungen. Kontrollieren Sie die Stabilität des CODEC- oder Eingangstakts.

<!-- source-page: 84; block: en-0751 -->

Prüfen Sie die Versorgung mit dem Multimeter gegen die Anforderungen des Chiphandbuchs.

<!-- source-page: 84; block: en-0752 -->

Ändern Sie Periodenanzahl und Größe des DMA-Puffers und prüfen Sie, ob sich das Verhalten verbessert.

<!-- source-page: 84; block: en-0753 -->

Untersuchen Sie schrittweise alle Stellen, die zur Verzerrung beitragen könnten.

<!-- source-page: 84; block: en-0754 -->

### 4.5 Aufnahme ohne Ton

<!-- source-page: 84; block: en-0755 -->

Erzeugen Sie mit dem Signalgenerator ein 1kHz-Signal und speisen Sie es in den CODEC ein.

<!-- source-page: 84; block: en-0756 -->

Nehmen Sie mit arecord oder tinycap auf, um den Fehler auf Benutzerraum oder Kernel einzugrenzen.

<!-- source-page: 84; block: en-0757 -->

Warten Sie bei der Aufnahme länger als 10 Sekunden, um einen Timeout mit I/O-Fehler zu erkennen.

<!-- source-page: 84; block: en-0758 -->

Prüfen Sie mit amixer oder tinymix, ob der interne ADC-Pfad des CODEC aktiviert und die Lautstärke nicht stummgeschaltet ist.

<!-- source-page: 84; block: en-0759 -->

Prüfen Sie die Registerkonfiguration von IOMUX, DAI und CODEC anhand des Chip- oder Codec-Handbuchs.

<!-- source-page: 84; block: en-0760 -->

Messen Sie mit Multimeter und Oszilloskop Spannung, Takt und Daten. Prüfen Sie korrekte Spannung und Takte sowie Aktivität auf der Datenleitung. Messen Sie das analoge Eingangssignal unmittelbar am CODEC und grenzen Sie den Fehler stufenweise ein.

<!-- source-page: 84; block: en-0761 -->

### 4.6 Verzerrte Aufnahme

<!-- source-page: 84; block: en-0762 -->

Erzeugen Sie mit dem Signalgenerator ein 1kHz-Signal und speisen Sie es in den CODEC ein.

<!-- source-page: 84; block: en-0763 -->

Nehmen Sie mit arecord oder tinycap auf und geben Sie die Daten per Loopback aus. Messen Sie mit dem Oszilloskop oder analysieren Sie mit PC-Werkzeugen.

<!-- source-page: 84; block: en-0764 -->

Ändern Sie die digitale oder analoge Verstärkung, beobachten Sie die Loopback-Wellenform und vergleichen Sie Mess- und Testdaten auf Übereinstimmung.

<!-- source-page: 84; block: en-0765 -->

Untersuchen Sie schrittweise alle Stellen, die zur Verzerrung beitragen könnten.

<!-- source-page: 85; block: en-0766 -->

### 4.7 Wiedergabe zu schnell oder zu langsam

<!-- source-page: 85; block: en-0767 -->

Prüfen Sie mit clk summary die Genauigkeit von MCLK, BCLK und LRCK.

<!-- source-page: 85; block: en-0768 -->

Prüfen Sie das Taktsignal mit dem Oszilloskop.

<!-- source-page: 85; block: en-0769 -->

Nehmen Sie das Ausgangssignal mit einem PC-Werkzeug auf und prüfen Sie auf fehlende oder zusätzliche Daten.

<!-- source-page: 85; block: en-0770 -->

Erfassen Sie die Chip-Ausgangsdaten mit dem Logikanalysator und prüfen Sie auf fehlende oder zusätzliche Daten.

<!-- source-page: 85; block: en-0771 -->

### 4.8 Regelmäßige Aussetzer

<!-- source-page: 85; block: en-0772 -->

Regelmäßige Aussetzer treten häufig in heterogenen Systemen auf, beispielsweise bei UAC, BT-Sprachübertragung oder Netzwerk-Audiostreaming.

<!-- source-page: 85; block: en-0773 -->

Die grundlegende Ursache sind asynchrone Takte, deren Abweichungen sich mit der Zeit summieren. Audiotaktkompensation kann dieses Problem beheben.

<!-- source-page: 85; block: en-0774 -->

Auch fehlerhafte Behandlung von Puffergrenzen kann regelmäßige Aussetzer und Störgeräusche verursachen. Dies lässt sich durch xrun-Analyse untersuchen.

<!-- source-page: 85; block: en-0775 -->

### 4.9 Störgeräusche

<!-- source-page: 85; block: en-0776 -->

Störgeräusche haben viele mögliche Ursachen. Gängige Verfahren zur Eingrenzung sind:

<!-- source-page: 85; block: en-0777 -->

Prüfen Sie Taktgenauigkeit und Jitter. Bei HDA-Audio sollte der Jitter beispielsweise kleiner als 0.5 ns sein.

<!-- source-page: 85; block: en-0778 -->

Prüfen Sie das Taktsignal auf Störimpulse, besonders im Schwellwertbereich der Flanken. Solche Impulse können als Takt erkannt werden und Timing-Fehler auslösen. RK-IOs unterstützen teilweise Schmitt-Trigger, beispielsweise RV1126; prüfen Sie die Unterstützung im Chiphandbuch. Diese können Störimpulse filtern und die dadurch verursachten Geräusche beseitigen.

<!-- source-page: 85; block: en-0779 -->

Prüfen Sie Versorgung und Masse des CODEC. Eingekoppeltes Rauschen verschlechtert seine Leistung, erhöht den Rauschpegel und verursacht Störgeräusche.

<!-- source-page: 85; block: en-0780 -->

Verwenden Sie differenzielle Schaltungen zur Unterdrückung von Gleichtaktstörungen.

<!-- source-page: 85; block: en-0781 -->

Prüfen Sie das Leiterplattenlayout und ermitteln Sie die Störquelle.

<!-- source-page: 85; block: en-0782 -->

### 4.10 XRUN

<!-- source-page: 85; block: en-0783 -->

Zur Kernel-xrun-Analyse siehe den entsprechenden Abschnitt. Weitere Prüfpunkte:

<!-- source-page: 85; block: en-0784 -->

Trennen Sie in der Anwendung Lese-/Schreibthreads von Audioverarbeitungsthreads, damit der Datenaustausch mit dem Kernel nicht unterbrochen wird.

<!-- source-page: 85; block: en-0785 -->

Scheduling-Probleme lassen sich mit systrace oder ftrace untersuchen.

<!-- source-page: 85; block: en-0786 -->

Blockierende Speicher-E/A kann Datenlesezugriffe aufhalten. Die Wiedergabe aus einer RAM-Gerätedatei wie /dev/zero

<!-- source-page: 86; block: en-0787 -->

hilft bei der Eingrenzung. Prüfen Sie auch die Taktgenauigkeit, da ein falscher Takt zu übermäßigem Datenverbrauch führen kann. Siehe „Wiedergabe zu schnell oder zu langsam“ und „Regelmäßige Aussetzer“.

<!-- source-page: 86; block: en-0788 -->

### 4.11 I/O-Fehler

<!-- source-page: 86; block: en-0789 -->

Bleibt Aufnahme oder Wiedergabe länger als 10 Sekunden ohne Reaktion, erscheint im Kernelprotokoll: playback/capture write error (DMA or IRQ trouble?) .

<!-- source-page: 86; block: en-0790 -->

Prüfen Sie das FIFO-COUNT-Register des DAI-Controllers wie im Registerabschnitt beschrieben darauf, ob der Zähler stehen geblieben ist.

<!-- source-page: 86; block: en-0791 -->

Prüfen Sie über procfs, ob der DMA-Interrupt aktualisiert wird: cat /proc/interrupts &#124; grep dma .

<!-- source-page: 86; block: en-0792 -->

Prüfen Sie wie im Registerabschnitt beschrieben, ob das DMA-Kanalstatusregister (Offset 0x100) einen unerwarteten Stopp zeigt.

<!-- source-page: 86; block: en-0793 -->

Arbeitet DAI als Slave, muss der externe Gerätetakt während des gesamten DAI-Lebenszyklus kontinuierlich anliegen. Lässt sich dies nicht anderweitig garantieren, lassen Sie ihn dauerhaft eingeschaltet.

{% endraw %}
