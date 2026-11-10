---
title: "RK3528-Architektur: Speicher, 4K-Video und gemeinsame PHYs"
description: "CPU, DDR, Codecs und Schnittstellen des RK3528 V1.0 mit Grenzen für Sige1-Projekte."
excerpt: "CPU, DDR, Codecs und Schnittstellen des RK3528 V1.0 mit Grenzen für Sige1-Projekte."
translation_key: "rk3528-architecture-memory-media"
slug: "rk3528-architecture-memory-media"
lang: "de"
date: "2026-11-10"
author: "ArmSoM Editorial"
category: "production"
products: ["Sige1"]
tags: ["RK3528", "datasheet", "hardware design", "ArmSoM"]
image: "/assets/datasheet-series-20261110/rk3528-datasheet-p14.png"
---

Dieser Artikel basiert auf der angegebenen Datenblattrevision. Die Werte sind Herstellerspezifikationen und keine ArmSoM-Messungen; neue Hardwaretests wurden nicht durchgeführt. Prüfen Sie Siliziumrevision, Schaltplan, SDK/BSP, Kernel und Treiber. Erläuterungen und editierbare Tabellen helfen beim Lesen; die vollständige Spezifikation und hier nicht vertiefte Bitdefinitionen stehen im Original-PDF.

**RK3528 · Rockchip RK3528 Datasheet V1.0-20230522.pdf · PDF 6–14.**


[![RK3528-Architektur: Speicher, 4K-Video und gemeinsame PHYs](/assets/datasheet-series-20261110/rk3528-datasheet-p14.png)](/assets/datasheet-series-20261110/rk3528-datasheet-p14.png)

*Englische Originalabbildung, PDF S. 14.*


## Rechen- und Boot-Ressourcen

RK3528 ist auf Multimedia und Konnektivität ausgerichtet. Diese Revision nennt keine dedizierte NPU; AI-Daten anderer Chips dürfen nicht übernommen werden.

| Merkmal | Spezifikation / Quellenhinweis |
|---|---|
| CPU | 4 × Cortex-A53 · Armv8-A · NEON/FPU · TrustZone |
| GPU | Mali-450 · OpenGL ES 1.1/2.0 · OpenVG 1.1 |
| SRAM | 64 KB + PMU 8 KB |
| MCU | Cortex-M0 · 8 KB TCM |
| Boot | SPI / eMMC / SDMMC; USB download |
| Takte | 24 MHz reference · 5 PLL |
| Spannungsdomänen | ARM / GPU / LOGIC / PMU |
| DMA | 3 DMAC; 8 channels / 32 requests / 2 interrupt outputs each |
| Sicherheit | SHA-1/224/256, MD5, SM3, HMAC, AES-128/192/256, DES/TDES, SM4; PKA ≤4096 bit; 16 DDR regions |



## Arbeits- und Massenspeicher

32 Bit und maximal 4 GB beschreiben den Controller, nicht jede Sige1-Bestückung. DDR-Typen sind Alternativen. Bootunterstützung, Busspannung und Firmware müssen zur Platine passen.

| Merkmal | Spezifikation / Quellenhinweis |
|---|---|
| DDR | 32 bit · ≤4 GB · DDR3/DDR3L/LPDDR3/DDR4/LPDDR4/LPDDR4X |
| eMMC | 5.1 · HS400 · command queue · 1/4/8 bit |
| SDMMC | SD 3.0 / MMC 4.51 · 4 bit |
| FSPI | 1/2/4 bit |



## Video, Grafik und Display

Decoder-, Encoder- und Displaygrenzen sind getrennt. Codec, Farbtiefe, Bildrate, Bandbreite und Ausgang sind gemeinsam zu prüfen; 4K-Decoding belegt nicht jede parallele Kombination.

| Merkmal | Spezifikation / Quellenhinweis |
|---|---|
| 4K-Decoding | H.264 BP/MP/HP L5.1 + MVC; H.265 Main/Main10 L5.1 High Tier; AVS2 · 4K×2K @60 |
| Weitere Decoder | MPEG-1/2/4, AVS/AVS+, VC-1 · 1080p60; H.263 · 576p60 |
| Video-Encoding | H.264 HP L4.2 / H.265 Main L4.1 High Tier · 1080p60 |
| JPEG | 48×48–8176×8176 · 76 Mpixel/s · ROI · 400/420/422/440/411/444 |
| 2D | Input ≤8192×8192; output ≤4096×4096; rotation 0/90/180/270°, mirror, alpha |
| VDPP | YUV420/422 input; YUV444 output also listed; deinterlace width ≤1920; DMSR / ZME |
| HDMI | 2.0b · 4K 10-bit @60 · HDR10 / HLG / HDR Vivid |
| CVBS | 480i / 576i |
| Displayebenen | 1 cluster + 4 smart layers |



## Gemeinsame PHYs und Steuerschnittstellen

Genannt sind USB 2.0 Host + USB 2.0 OTG + PCIe oder USB 2.0 Host + USB 3. USB 3 und PCIe dürfen nicht über diese Varianten hinweg addiert werden. Trotz Verweisen auf PCIe 2.1 und Base Specification 3.0 sind nur 2,5/5,0 Gbit/s, eine Lane und RC explizit angegeben; Gen3-Geschwindigkeit ist nicht belegt.

| Merkmal | Spezifikation / Quellenhinweis |
|---|---|
| Ethernet | 1 × 10/100/1000 MAC (RGMII/RMII) + 1 × 10/100 MAC/PHY |
| PCIe | x1 RC · 2.5 / 5.0 Gbit/s |
| UART | 8 · ≤4 Mbit/s |
| I2C | 8 · 100/400 kbit/s · 7/10-bit address |
| SPI | 2 |
| PWM | 8 × 32 bit; IR: PWM3/PWM7 |
| SARADC | 10 bit · 4 single-ended inputs · ≤1 MS/s |
| TS | 2 inputs; 2 PTI, each 96 PID / 32 PES-ES / 16 PCR / 96 section filters; 1 PVR |
| ISO7816 | T0 / T1 |



## Audiorouting und Quellenfragen

SAI0/1 nutzen GPIO, SAI2 ist der interne Codec-Sendepfad, SAI3 der HDMI-Sendepfad; vier Blöcke sind keine vier externen Ports. CAN×4 steht ohne passende Funktionsbeschreibung im Blockbild. Die Einheit 10.2bps im HDMI-Text ist unvollständig. Auch die Temperaturauflösung unterscheidet sich; siehe Elektrikartikel. Daraus werden keine stillschweigend korrigierten Spezifikationen abgeleitet.

| Merkmal | Spezifikation / Quellenhinweis |
|---|---|
| SAI0/2 | 2 channels; SAI2 TX only |
| SAI1/3 | 8 channels; SAI3 TX only |
| SAI | 16–32 bit · ≤192 kHz |
| PDM | 8 channels · 16–24 bit · ≤192 kHz |
| SPDIF | HDMI / GPIO |
| DAC | 24 bit · 8/12/16/24/32/44.1/48/96 kHz |



## ArmSoM-Produkte und Einsatzgrenzen

Sige1 ist die RK3528-Plattform. Nicht jede Chipfunktion ist auf der Platine zugänglich; Anschlüsse, Spannungen, Images und Pinbelegung sind anhand der Sige1-Dokumentation zu prüfen.

- [Sige1](https://www.armsom.org/sige1) · [Docs](https://docs.armsom.org/armsom-sige1)

## Datenblattserie und Original-PDF

- [RK3528 Übersicht](/de/articles/rk3528-datasheet-v10/)
- [RK3528-Architektur: Speicher, 4K-Video und gemeinsame PHYs](/de/articles/rk3528-architecture-memory-media/)
- [RK3528: Gehäuse und vollständige Tabelle der 401 Balls](/de/articles/rk3528-package-pin-reference/)
- [RK3528: Versorgung, I/O und Wärmewiderstand](/de/articles/rk3528-electrical-power-thermal/)
- [Vollständiges Original-PDF herunterladen](/assets/datasheet-series-20261110/Rockchip-RK3528-Datasheet-V1.0-20230522.pdf)
