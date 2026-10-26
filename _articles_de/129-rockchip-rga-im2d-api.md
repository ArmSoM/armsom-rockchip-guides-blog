---
title: "Rockchip RGA IM2D API: Hardwarefähigkeiten, Schnittstellen und Beispiele"
description: "Rockchip RGA IM2D API: Hardwarefähigkeiten, Schnittstellen und Beispiele — V2.2.7."
translation_key: "129-rockchip-rga-im2d-api"
slug: "129-rockchip-rga-im2d-api"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: [ArmSoM, Rockchip, RGA, IM2D, librga]
excerpt: "Rockchip RGA IM2D API: Hardwarefähigkeiten, Schnittstellen und Beispiele — V2.2.7."
---

{% raw %}

Vollständige technische Kapitel von Rockchip RGA IM2D API V2.2.7 (82 chinesische und 79 englische Seiten). Für ArmSoM müssen RGA-Version des Board-SoC, SDK/BSP, passende librga-/Kerneltreiber und Speicher-/Formatgrenzen geprüft werden. Unterstützung aller Funktionen auf allen Boards wird nicht behauptet. Keine einheitliche Kernelversion ist angegeben; Kapitel 2 enthält Treiberkompatibilität. Keine ArmSoM-Hardwarevalidierung wurde durchgeführt. Leistungswerte sind theoretische Herstellerangaben; Beispiele und Logs keine ArmSoM-Messungen.

> Quellunklarheiten bleiben erhalten: impyramind/impyramid und imfilp/imflip; imcvtcolorTask wird als Verschiebung beschrieben; §5.3.12 nennt IM_ALPHA_BLEND_DST, §3.15 SRC_OVER. Die OSD-Tabelle ordnet interne/externe Steuerung EXTERNAL/INTERNAL zu, offenbar entgegen den Namen. Schreibweisen bule, RK_FORMA_A8, RK1103B, RK1108 erfordern SDK-Prüfung. Die Hardwaretabelle ist rechts abgeschnitten: sichtbares 3 (by pa… für RGA3 bleibt ohne erratene Ergänzung erhalten.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip librga](https://github.com/airockchip/librga)

## 1. Übersicht

RGA (Raster Graphic Acceleration Unit) ist ein unabhängiger 2D-Hardwarebeschleuniger für Punkt-/Linienzeichnung, Skalierung, Rotation, bitBlt und Alpha-Blending.

### 1.1 Auslegungsspezifikationen

| Version | Codename | Chip | Quelle min | Quelle max | Ziel min | Ziel max | Funktion | Pixels/Cycle |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RGA1 | Pagani | RK3066 | 2x2 | 8192x8192 | 2x2 | 2048x2048 | 90/180/270-Drehung<br>X/Y-Spiegelung<br>Zuschnitt<br>1/2~8 Skalierung<br>Alpha-Mischung<br>Farbschlüssel<br>Farbfüllung<br>ROP<br>IOMMU(32bit) | 1 |
| RGA1 | Jaguar<br>Plus | RK3188 | 2x2 | 8192x8192 | 2x2 | 2048x2048 | 90/180/270-Drehung<br>X/Y-Spiegelung<br>Zuschnitt<br>1/2~8 Skalierung<br>Alpha-Mischung<br>Farbschlüssel<br>Farbfüllung<br>ROP<br>IOMMU(32bit) | 1 |
| RGA1 | Beetles | RK2926/2928 | 2x2 | 8192x8192 | 2x2 | 2048x2048 | 90/180/270-Drehung<br>X/Y-Spiegelung<br>Zuschnitt<br>1/2~8 Skalierung<br>Alpha-Mischung<br>Farbschlüssel<br>Farbfüllung<br>ROP<br>IOMMU(32bit) | 1 |
| RGA1 | Beetles<br>Plus | RK3026/3028 | 2x2 | 8192x8192 | 2x2 | 2048x2048 | 90/180/270-Drehung<br>X/Y-Spiegelung<br>Zuschnitt<br>1/2~8 Skalierung<br>Alpha-Mischung<br>Farbschlüssel<br>Farbfüllung<br>ROP<br>IOMMU(32bit) | 1 |
| RGA1_plus | Audi | RK3128 | 2x2 | 8192x8192 | 2x2 | 2048x2048 | 90/180/270-Drehung<br>X/Y-Spiegelung<br>Zuschnitt<br>1/2~8 Skalierung<br>Alpha-Mischung<br>Farbschlüssel<br>Farbfüllung<br>Farbpalette<br>IOMMU(32bit) | 1 |
| RGA1_plus | Granite | Sofia 3gr | 2x2 | 8192x8192 | 2x2 | 2048x2048 | 90/180/270-Drehung<br>X/Y-Spiegelung<br>Zuschnitt<br>1/2~8 Skalierung<br>Alpha-Mischung<br>Farbschlüssel<br>Farbfüllung<br>Farbpalette<br>IOMMU(32bit) | 1 |
| RGA2 | Lincoln | RK3288/3288w | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270-Drehung<br>X/Y-Spiegelung<br>Zuschnitt<br>1/16~16 Skalierung<br>Vergrößerung(bilinear/bikubisch)<br>Verkleinerung(Mittelwert)<br>Alpha-Mischung<br>Farbschlüssel<br>Farbfüllung<br>Farbpalette<br>ROP<br>IOMMU(32bit) | 2 |
| RGA2 | Capricorn | RK3190 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270-Drehung<br>X/Y-Spiegelung<br>Zuschnitt<br>1/16~16 Skalierung<br>Vergrößerung(bilinear/bikubisch)<br>Verkleinerung(Mittelwert)<br>Alpha-Mischung<br>Farbschlüssel<br>Farbfüllung<br>Farbpalette<br>ROP<br>IOMMU(32bit) | 2 |
| RGA2-<br>Lite0 | Maybach | RK3368 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270-Drehung<br>X/Y-Spiegelung<br>Zuschnitt<br>1/8~8 Skalierung<br>Vergrößerung(bilinear/bikubisch)<br>Verkleinerung(Mittelwert)<br>Alpha-Mischung<br>Farbschlüssel<br>Farbfüllung<br>Farbpalette<br>ROP<br>IOMMU(32bit) | 2 |
| RGA2-<br>Lite0 | BMW | RK3366 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270-Drehung<br>X/Y-Spiegelung<br>Zuschnitt<br>1/8~8 Skalierung<br>Vergrößerung(bilinear/bikubisch)<br>Verkleinerung(Mittelwert)<br>Alpha-Mischung<br>Farbschlüssel<br>Farbfüllung<br>Farbpalette<br>ROP<br>IOMMU(32bit) | 2 |

| Version | Codename | Chip | Quelle min | Quelle max | Ziel min | Ziel max | Funktion | Pixels/Cycle |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RGA2-<br>Lite1 | Benz | RK3228 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270-Drehung<br>X/Y-Spiegelung<br>Zuschnitt<br>1/8~8 Skalierung<br>Vergrößerung(bilinear/bikubisch)<br>Verkleinerung(Mittelwert)<br>Alpha-Mischung<br>Farbschlüssel<br>Farbfüllung<br>Farbpalette<br>IOMMU(32bit) | 2 |
| RGA2-<br>Lite1 | Infiniti | RK3228H | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270-Drehung<br>X/Y-Spiegelung<br>Zuschnitt<br>1/8~8 Skalierung<br>Vergrößerung(bilinear/bikubisch)<br>Verkleinerung(Mittelwert)<br>Alpha-Mischung<br>Farbschlüssel<br>Farbfüllung<br>Farbpalette<br>IOMMU(32bit) | 2 |
| RGA2-<br>Lite1 | Gemini | RK3326 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270-Drehung<br>X/Y-Spiegelung<br>Zuschnitt<br>1/8~8 Skalierung<br>Vergrößerung(bilinear/bikubisch)<br>Verkleinerung(Mittelwert)<br>Alpha-Mischung<br>Farbschlüssel<br>Farbfüllung<br>Farbpalette<br>IOMMU(32bit) | 2 |
| RGA2-<br>Lite1 | Lion | RK1808 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270-Drehung<br>X/Y-Spiegelung<br>Zuschnitt<br>1/8~8 Skalierung<br>Vergrößerung(bilinear/bikubisch)<br>Verkleinerung(Mittelwert)<br>Alpha-Mischung<br>Farbschlüssel<br>Farbfüllung<br>Farbpalette<br>IOMMU(32bit) | 2 |
| RGA2-<br>Lite2 | Libra | RK3506 | 2x2 | 1280x8192 | 2x2 | 1280x4096 | 90/180/270-Drehung<br>X/Y-Spiegelung<br>Zuschnitt<br>1/16~16 Skalierung<br>Vergrößerung(bilinear/bikubisch)<br>Verkleinerung(Mittelwert)<br>Alpha-Mischung<br>Farbschlüssel<br>Farbfüllung<br>Farbpalette<br>Guassion-Unschärfe (Quellschreibweise)<br>alpha-8bit | 2 |
| RGA2-<br>Lite3 | Pather | RK1103B | 2x2 | 2880x8192 | 2x2 | 2880x8192 | 90/180/270-Drehung<br>X/Y-Spiegelung<br>Zuschnitt<br>1/16~16 Skalierung<br>Vergrößerung(bilinear)<br>Verkleinerung(bilinear/Mittelwert)<br>Farbfüllung | 2 |
| RGA2-<br>Enhance | Mclaren | RK3399 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270-Drehung<br>X/Y-Spiegelung<br>Zuschnitt<br>1/16~16 Skalierung<br>Vergrößerung(bilinear/bikubisch)<br>Verkleinerung(Mittelwert)<br>Alpha-Mischung<br>Farbschlüssel<br>Farbfüllung<br>Farbpalette<br>ROP(nicht verfügbar für<br>RV1108/RV1109/RK3566)<br>NN-Quantisierung(nicht verfügbar für<br>RK3399/RV1108)<br>osd (nur<br>RV1106/RV1103/RK3562/RK3528)<br>Mosaik(nur<br>RV1106/RV1103/RK3562/RK3528)<br>IOMMU(32bit, RK3528/RK3562ist<br>40bit,nicht verfügbar für RV1106/1103) | 2 |
| RGA2-<br>Enhance | Mercury | RK1108 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270-Drehung<br>X/Y-Spiegelung<br>Zuschnitt<br>1/16~16 Skalierung<br>Vergrößerung(bilinear/bikubisch)<br>Verkleinerung(Mittelwert)<br>Alpha-Mischung<br>Farbschlüssel<br>Farbfüllung<br>Farbpalette<br>ROP(nicht verfügbar für<br>RV1108/RV1109/RK3566)<br>NN-Quantisierung(nicht verfügbar für<br>RK3399/RV1108)<br>osd (nur<br>RV1106/RV1103/RK3562/RK3528)<br>Mosaik(nur<br>RV1106/RV1103/RK3562/RK3528)<br>IOMMU(32bit, RK3528/RK3562ist<br>40bit,nicht verfügbar für RV1106/1103) | 2 |
| RGA2-<br>Enhance | Puma | RV1126/RV1109 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270-Drehung<br>X/Y-Spiegelung<br>Zuschnitt<br>1/16~16 Skalierung<br>Vergrößerung(bilinear/bikubisch)<br>Verkleinerung(Mittelwert)<br>Alpha-Mischung<br>Farbschlüssel<br>Farbfüllung<br>Farbpalette<br>ROP(nicht verfügbar für<br>RV1108/RV1109/RK3566)<br>NN-Quantisierung(nicht verfügbar für<br>RK3399/RV1108)<br>osd (nur<br>RV1106/RV1103/RK3562/RK3528)<br>Mosaik(nur<br>RV1106/RV1103/RK3562/RK3528)<br>IOMMU(32bit, RK3528/RK3562ist<br>40bit,nicht verfügbar für RV1106/1103) | 2 |
| RGA2-<br>Enhance | skylarkV2 | RK3566/RK3568 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270-Drehung<br>X/Y-Spiegelung<br>Zuschnitt<br>1/16~16 Skalierung<br>Vergrößerung(bilinear/bikubisch)<br>Verkleinerung(Mittelwert)<br>Alpha-Mischung<br>Farbschlüssel<br>Farbfüllung<br>Farbpalette<br>ROP(nicht verfügbar für<br>RV1108/RV1109/RK3566)<br>NN-Quantisierung(nicht verfügbar für<br>RK3399/RV1108)<br>osd (nur<br>RV1106/RV1103/RK3562/RK3528)<br>Mosaik(nur<br>RV1106/RV1103/RK3562/RK3528)<br>IOMMU(32bit, RK3528/RK3562ist<br>40bit,nicht verfügbar für RV1106/1103) | 2 |
| RGA2-<br>Enhance | Orion | RK3588 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270-Drehung<br>X/Y-Spiegelung<br>Zuschnitt<br>1/16~16 Skalierung<br>Vergrößerung(bilinear/bikubisch)<br>Verkleinerung(Mittelwert)<br>Alpha-Mischung<br>Farbschlüssel<br>Farbfüllung<br>Farbpalette<br>ROP(nicht verfügbar für<br>RV1108/RV1109/RK3566)<br>NN-Quantisierung(nicht verfügbar für<br>RK3399/RV1108)<br>osd (nur<br>RV1106/RV1103/RK3562/RK3528)<br>Mosaik(nur<br>RV1106/RV1103/RK3562/RK3528)<br>IOMMU(32bit, RK3528/RK3562ist<br>40bit,nicht verfügbar für RV1106/1103) | 2 |
| RGA2-<br>Enhance | Otter | RV1106/1103 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270-Drehung<br>X/Y-Spiegelung<br>Zuschnitt<br>1/16~16 Skalierung<br>Vergrößerung(bilinear/bikubisch)<br>Verkleinerung(Mittelwert)<br>Alpha-Mischung<br>Farbschlüssel<br>Farbfüllung<br>Farbpalette<br>ROP(nicht verfügbar für<br>RV1108/RV1109/RK3566)<br>NN-Quantisierung(nicht verfügbar für<br>RK3399/RV1108)<br>osd (nur<br>RV1106/RV1103/RK3562/RK3528)<br>Mosaik(nur<br>RV1106/RV1103/RK3562/RK3528)<br>IOMMU(32bit, RK3528/RK3562ist<br>40bit,nicht verfügbar für RV1106/1103) | 2 |
| RGA2-<br>Enhance | Bull | RK3528 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270-Drehung<br>X/Y-Spiegelung<br>Zuschnitt<br>1/16~16 Skalierung<br>Vergrößerung(bilinear/bikubisch)<br>Verkleinerung(Mittelwert)<br>Alpha-Mischung<br>Farbschlüssel<br>Farbfüllung<br>Farbpalette<br>ROP(nicht verfügbar für<br>RV1108/RV1109/RK3566)<br>NN-Quantisierung(nicht verfügbar für<br>RK3399/RV1108)<br>osd (nur<br>RV1106/RV1103/RK3562/RK3528)<br>Mosaik(nur<br>RV1106/RV1103/RK3562/RK3528)<br>IOMMU(32bit, RK3528/RK3562ist<br>40bit,nicht verfügbar für RV1106/1103) | 2 |
| RGA2-<br>Enhance | Snipe | RK3562 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270-Drehung<br>X/Y-Spiegelung<br>Zuschnitt<br>1/16~16 Skalierung<br>Vergrößerung(bilinear/bikubisch)<br>Verkleinerung(Mittelwert)<br>Alpha-Mischung<br>Farbschlüssel<br>Farbfüllung<br>Farbpalette<br>ROP(nicht verfügbar für<br>RV1108/RV1109/RK3566)<br>NN-Quantisierung(nicht verfügbar für<br>RK3399/RV1108)<br>osd (nur<br>RV1106/RV1103/RK3562/RK3528)<br>Mosaik(nur<br>RV1106/RV1103/RK3562/RK3528)<br>IOMMU(32bit, RK3528/RK3562ist<br>40bit,nicht verfügbar für RV1106/1103) | 2 |

| Version | Codename | Chip | Quelle min | Quelle max | Ziel min | Ziel max | Funktion | Pixels/Cycle |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RGA2-Pro | Heron | RK3576 | 2x2 | 8192x8192 | 2x2 | 8192x8192 | 90/180/270-Drehung<br>X/Y-Spiegelung<br>Zuschnitt<br>1/16~16 Skalierung<br>Vergrößerung(bilinear/bikubisch)<br>Verkleinerung(bilinear/Mittelwert)<br>Alpha-Mischung<br>Farbschlüssel<br>Farbfüllung<br>Farbpalette<br>ROP<br>osd<br>Mosaik(nur RK3576)<br>ARGB5551-Alpha-Bitmap<br>rkfbc64x4 Eingang(nur RK3576)<br>afbc32x8 Eingang(Splitmodus, nur<br>RK3576)<br>tile4x4(RV1126B nur Eingang)<br>IOMMU(40bit) | 2 |
| RGA2-Pro | Swan | RV1126B | 2x2 | 8192x8192 | 2x2 | 8192x8192 | 90/180/270-Drehung<br>X/Y-Spiegelung<br>Zuschnitt<br>1/16~16 Skalierung<br>Vergrößerung(bilinear/bikubisch)<br>Verkleinerung(bilinear/Mittelwert)<br>Alpha-Mischung<br>Farbschlüssel<br>Farbfüllung<br>Farbpalette<br>ROP<br>osd<br>Mosaik(nur RK3576)<br>ARGB5551-Alpha-Bitmap<br>rkfbc64x4 Eingang(nur RK3576)<br>afbc32x8 Eingang(Splitmodus, nur<br>RK3576)<br>tile4x4(RV1126B nur Eingang)<br>IOMMU(40bit) | 2 |
| RGA3 | Orion | RK3588 | 68x2 | 8176x8176 | 68x2 | 8128x8128 | 90/180/270-Drehung<br>X/Y-Spiegelung<br>Zuschnitt<br>1/8~8 Skalierung<br>Vergrößerung(bikubisch)<br>Verkleinerung(Mittelwert)<br>Alpha-Mischung<br>Farbschlüssel<br>afbc16x16<br>IOMMU(40bit) | 3 (by pa…; 2 (scale) |

Hinweis:

1) Die Pixelanzahl pro Takt ist theoretisch. Die tatsächliche Leistung hängt von Bandbreite, Hardwaretakt und weiteren Faktoren ab; die Tabelle dient nur als Referenz.

2) Zusätzlich zur minimalen Eingangsauflösung müssen x, y, width und height des tatsächlichen Operationsrechtecks jedes Kanals mindestens 2 sein.

3) Der adressierbare Speicher hängt von der IOMMU-Breite ab. Beispielsweise kann RGA mit 32-Bit-IOMMU nur physischen Speicher im Bereich 0–4G adressieren.

### 1.2 Unterstützte Bildformate

Pixelformatkonvertierung: BT.601/BT.709/BT.2020 (BT.2020 nur mit RGA3). Dithering.

| Version | Codename | Chip | Eingangsdatenformat | Ausgangsdatenformat |
| --- | --- | --- | --- | --- |
| RGA1 | Pagani | RK3066 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_BPP1<br>RK_FORMAT_BPP2<br>RK_FORMAT_BPP4<br>RK_FORMAT_BPP8 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP (nur für<br>Unschärfe/Schärfe)<br>RK_FORMAT_YCrCb_420_SP (nur für<br>Unschärfe/Schärfe)<br>RK_FORMAT_YCbCr_422_SP (nur für<br>Unschärfe/Schärfe)<br>RK_FORMAT_YCrCb_422_SP (nur für<br>Unschärfe/Schärfe)<br>RK_FORMAT_YCbCr_420_P (nur für<br>Unschärfe/Schärfe)<br>RK_FORMAT_YCrCb_420_P (nur für<br>Unschärfe/Schärfe)<br>RK_FORMAT_YCbCr_422_P (nur für<br>Unschärfe/Schärfe)<br>RK_FORMAT_YCrCb_422_P (nur für<br>Unschärfe/Schärfe) |
|  | Jaguar<br>Plus | RK3188 |  |  |
|  | Beetles | RK2926/2928 |  |  |
|  | Beetles<br>Plus | RK3026/3028 |  |  |

| Version | Codename | Chip | Eingangsdatenformat | Ausgangsdatenformat |
| --- | --- | --- | --- | --- |
| RGA1_plus | Audi | RK3128 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_BPP1<br>RK_FORMAT_BPP2<br>RK_FORMAT_BPP4<br>RK_FORMAT_BPP8 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP (nur für<br>normales Bitblt ohne Alpha)<br>RK_FORMAT_YCrCb_420_SP (nur für<br>normales Bitblt ohne Alpha)<br>RK_FORMAT_YCbCr_422_SP (nur für<br>normales Bitblt ohne Alpha)<br>RK_FORMAT_YCrCb_422_SP (nur für<br>normales Bitblt ohne Alpha)<br>RK_FORMAT_YCbCr_420_P (nur für<br>normales Bitblt ohne Alpha)<br>RK_FORMAT_YCrCb_420_P (nur für<br>normales Bitblt ohne Alpha)<br>RK_FORMAT_YCbCr_422_P (nur für<br>normales Bitblt ohne Alpha)<br>RK_FORMAT_YCrCb_422_P (nur für<br>normales Bitblt ohne Alpha) |
|  | Granite | Sofia 3gr |  |  |

| Version | Codename | Chip | Eingangsdatenformat | Ausgangsdatenformat |
| --- | --- | --- | --- | --- |
| RGA2 | Lincoln | RK3288/3288w | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_BPP1 (nur für<br>Farbpalette)<br>RK_FORMAT_BPP2 (nur für<br>Farbpalette)<br>RK_FORMAT_BPP4 (nur für<br>Farbpalette)<br>RK_FORMAT_BPP8 (nur für<br>Farbpalette) | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P |
|  | Capricorn | RK3190 |  |  |

| Version | Codename | Chip | Eingangsdatenformat | Ausgangsdatenformat |
| --- | --- | --- | --- | --- |
| RGA2-Lite0 | Maybach | RK3368 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_BPP1 (nur für<br>Farbpalette)<br>RK_FORMAT_BPP2 (nur für<br>Farbpalette)<br>RK_FORMAT_BPP4 (nur für<br>Farbpalette)<br>RK_FORMAT_BPP8 (nur für<br>Farbpalette) | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P |
|  | BMW | RK3366 |  |  |

| Version | Codename | Chip | Eingangsdatenformat | Ausgangsdatenformat |
| --- | --- | --- | --- | --- |
| RGA2-Lite1 | Benz | RK3228 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_RGBA_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YCbCr_420_SP_10B<br>RK_FORMAT_YCrCb_420_SP_10B<br>RK_FORMAT_YCbCr_422_SP_10B<br>RK_FORMAT_YCrCb_422_SP_10B<br>RK_FORMAT_BPP1 (nur für<br>Farbpalette)<br>RK_FORMAT_BPP2 (nur für<br>Farbpalette)<br>RK_FORMAT_BPP4 (nur für<br>Farbpalette)<br>RK_FORMAT_BPP8 (nur für<br>Farbpalette) | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P |
|  | Infiniti | RK3228H |  |  |
|  | Gemini | RK3326 |  |  |
|  | Lion | RK1808 |  |  |

| Version | Codename | Chip | Eingangsdatenformat | Ausgangsdatenformat |
| --- | --- | --- | --- | --- |
| RGA2-Lite2 | Libra | RK3506 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_400<br>RK_FORMAT_YCbCr_420_SP_10B<br>RK_FORMAT_YCrCb_420_SP_10B<br>RK_FORMAT_YCbCr_422_SP_10B<br>RK_FORMAT_YCrCb_422_SP_10B<br>RK_FORMAT_A8<br>RK_FORMAT_BPP1 (nur für<br>Farbpalette)<br>RK_FORMAT_BPP2 (nur für<br>Farbpalette)<br>RK_FORMAT_BPP4 (nur für<br>Farbpalette)<br>RK_FORMAT_BPP8 (nur für<br>Farbpalette) | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_400<br>RK_FORMAT_Y4 |

| Version | Codename | Chip | Eingangsdatenformat | Ausgangsdatenformat |
| --- | --- | --- | --- | --- |
| RGA2-Lite2 | Pather | RV1103B | RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_400 | RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_400 |

| Version | Codename | Chip | Eingangsdatenformat | Ausgangsdatenformat |
| --- | --- | --- | --- | --- |
| RGA2-<br>Enhance | Mclaren | RK3399 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YCbCr_420_SP_10B<br>RK_FORMAT_YCrCb_420_SP_10B<br>RK_FORMAT_YCbCr_422_SP_10B<br>RK_FORMAT_YCrCb_422_SP_10B<br>RK_FORMAT_BPP1 (nur für<br>Farbpalette)<br>RK_FORMAT_BPP2 (nur für<br>Farbpalette)<br>RK_FORMAT_BPP4 (nur für<br>Farbpalette)<br>RK_FORMAT_BPP8 (nur für<br>Farbpalette) | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422 |
|  | Mercury | RK1108 |  |  |

| Version | Codename | Chip | Eingangsdatenformat | Ausgangsdatenformat |
| --- | --- | --- | --- | --- |
|  | Puma | RV1126/<br>RV1109 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_400<br>RK_FORMAT_YCbCr_420_SP_10B<br>RK_FORMAT_YCrCb_420_SP_10B<br>RK_FORMAT_YCbCr_422_SP_10B<br>RK_FORMAT_YCrCb_422_SP_10B<br>RK_FORMAT_BPP1 (nur für<br>Farbpalette)<br>RK_FORMAT_BPP2 (nur für<br>Farbpalette)<br>RK_FORMAT_BPP4 (nur für<br>Farbpalette)<br>RK_FORMAT_BPP8 (nur für<br>Farbpalette) | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_400<br>RK_FORMAT_Y4 |
|  | skylarkV2 | RK3566/RK3568 |  |  |
|  | Orion | RK3588 |  |  |
|  |  |  |  |  |
|  | Otter | RV1106/1103 |  |  |
|  | Bull | RK3528 |  |  |
|  | Snipe | RK3562 |  |  |

| Version | Codename | Chip | Eingangsdatenformat | Ausgangsdatenformat |
| --- | --- | --- | --- | --- |
| RGA2-Pro | Heron | RK3576 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_444_SP<br>RK_FORMAT_YCrCb_444_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_400<br>RK_FORMAT_YCbCr_420_SP_10B<br>RK_FORMAT_YCrCb_420_SP_10B<br>RK_FORMAT_YCbCr_422_SP_10B<br>RK_FORMAT_YCrCb_422_SP_10B<br>RK_FORMA_A8 (nur src für<br>Alpha-Mischung)<br>RK_FORMAT_BPP1 (nur für<br>Farbpalette)<br>RK_FORMAT_BPP2 (nur für<br>Farbpalette)<br>RK_FORMAT_BPP4 (nur für<br>Farbpalette)<br>RK_FORMAT_BPP8 (nur für<br>Farbpalette) | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_444_SP<br>RK_FORMAT_YCrCb_444_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_400<br>RK_FORMAT_Y4 (nur RK3576)<br>RK_FORMAT_Y8 (nur RK3576) |
|  | Swan | RV1126B |  |  |

| Version | Codename | Chip | Eingangsdatenformat | Ausgangsdatenformat |
| --- | --- | --- | --- | --- |
| RGA3 | Orion | RK3588 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_420_SP_10B<br>RK_FORMAT_YCrCb_420_SP_10B<br>RK_FORMAT_YCbCr_422_SP_10B<br>RK_FORMAT_YCrCb_422_SP_10B | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_420_SP_10B<br>RK_FORMAT_YCrCb_420_SP_10B<br>RK_FORMAT_YCbCr_422_SP_10B<br>RK_FORMAT_YCrCb_422_SP_10B |

Hinweis:

1) RK_FORMAT_YCbCr_400 verwendet nur den Y-Kanal von YUV, meist für 256 (2^8) Graustufen. Bei RGB/YUV-Konvertierung ist die Farbraumeinstellung zu beachten. Für alle 256 Graustufen bei der Konvertierung full range konfigurieren.

2) RK_FORMAT_Y4 verwendet nur den Y-Kanal von YUV und dithert auf 4 Bit, meist für 16 (2^4) Graustufen. Es gelten dieselben Farbraumhinweise wie für RK_FORMAT_YCbCr_400. RK_FORMAT_Y8 ähnelt RK_FORMAT_Y4 und hat ebenfalls nur 4 gültige Bits: die oberen vier enthalten gültige Daten, die unteren vier nicht.

### 1.3 Bildformatausrichtung

| Version | Byte_stride | Format | Ausrichtung |
| --- | --- | --- | --- |
| RGA1<br>RGA1-Plus | 4 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888 | Keine Ausrichtungsanforderung für width stride. |
|  |  | RK_FORMAT_RGBA_4444<br>RK_FORMAT_BGRA_4444<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_RGBA_5551<br>RK_FORMAT_BGRA_5551<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565 | width stride muss auf 2 ausgerichtet sein. |
|  |  | RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888 | width stride muss auf 4 ausgerichtet sein. |
|  |  | RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P | width stride muss auf 4 ausgerichtet sein; x_offset, y_offset, width, height, height stride muss auf 2 ausgerichtet sein. |

| RGA2<br>RGA2-Lite0<br>RGA2-Lite1<br>RGA2-Lite2<br>RGA2-Lite3<br>RGA2-<br>Enhance<br>RGA2-Pro | 4 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888 | Keine Ausrichtungsanforderung für width stride. |
| --- | --- | --- | --- |
|  |  | RK_FORMAT_RGBA_4444<br>RK_FORMAT_BGRA_4444<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_RGBA_5551<br>RK_FORMAT_BGRA_5551<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565 | width stride muss auf 2 ausgerichtet sein. |
|  |  | RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YUYV_420<br>RK_FORMAT_YVYU_420<br>RK_FORMAT_UYVY_420<br>RK_FORMAT_VYUY_420 | width stride muss auf 2 ausgerichtet sein; x_offset, y_offset, width, height, height stride muss auf 2 ausgerichtet sein. |
|  |  | RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_A8 | width stride muss auf 4 ausgerichtet sein. |
|  |  | RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_444_SP<br>RK_FORMAT_YCrCb_444_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YCbCr_400<br>RK_FORMAT_Y4<br>RK_FORMAT_Y8 | width stride muss auf 4 ausgerichtet sein; x_offset, y_offset, width, height, height stride muss auf 2 ausgerichtet sein. |
|  |  | RK_FORMAT_YCbCr_420_SP_10B<br>RK_FORMAT_YCrCb_420_SP_10B<br>RK_FORMAT_YCbCr_422_SP_10B<br>RK_FORMAT_YCrCb_422_SP_10B | width stride muss auf 16 ausgerichtet sein; x_offset, y_offset muss auf 64 ausgerichtet sein; width, height, height stride muss auf 2 ausgerichtet sein. |

| RGA3 | 16 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888 | width stride muss auf 4 ausgerichtet sein. |
| --- | --- | --- | --- |
|  |  | RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565 | width stride muss auf 8 ausgerichtet sein. |
|  |  | RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422 | width stride muss auf 8 ausgerichtet sein; x_offset, y_offset, width, height, height stride muss auf 2 ausgerichtet sein. |
|  |  | RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888 | width stride muss auf 16 ausgerichtet sein. |
|  |  | RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP | width stride muss auf 16 ausgerichtet sein; x_offset, y_offset, width, height, height stride muss auf 2 ausgerichtet sein. |
|  |  | RK_FORMAT_YCbCr_420_SP_10B<br>RK_FORMAT_YCrCb_420_SP_10B<br>RK_FORMAT_YCbCr_422_SP_10B<br>RK_FORMAT_YCrCb_422_SP_10B | width stride muss auf 64 ausgerichtet sein; x_offset, y_offset muss auf 4 ausgerichtet sein; width, height, height stride muss auf 2 ausgerichtet sein. |
|  |  | FBC mode | Zusätzlich zur obigen Formatausrichtung: width stride, height stride muss auf 16 ausgerichtet sein. |
|  |  | TILE8*8 mode | Zusätzlich zur obigen Formatausrichtung: width, height muss auf 8 ausgerichtet sein; Eingangskanal width stride, height stride muss auf 16 ausgerichtet sein. |

Hinweis:

1) Ausrichtungsformel: lcm(bpp, byte_stride * 8) / pixel_stride.

2) Enthält eine Plattform mehrere Hardwareversionen, setzt librga die strengsten Ausrichtungsanforderungen durch, um die Hardwareauslastung zu gewährleisten.

## 2. Versionen

Die RGA-Bibliothek librga.so aktualisiert ihre Version nach Regeln für neue Funktionen, Kompatibilität und Fehlerkorrekturen. Mehrere Abfragemethoden helfen bei der Entscheidung, ob die Bibliothek zur Umgebung passt. Einzelheiten zu Änderungen stehen in CHANGLOG.md im Quellwurzelverzeichnis.

### 2.1 librga-API-Version

#### 2.1.1 Versionsformat und Erhöhungsregeln

##### 2.1.1.1 Versionsformat

```text
major.minor.revision_[build]
```

Beispiel:

1.0.0_[0]

##### 2.1.1.2 Erhöhungsregeln

| Name | Regel |
| --- | --- |
| major | Hauptversion: nicht abwärtskompatible Releases. |
| minor | Nebenversion: abwärtskompatible funktionale API-Erweiterungen. |
| revision | Revision: abwärtskompatible Funktionsergänzungen oder kritische Fehlerkorrekturen. |
| build | Buildversion: abwärtskompatible Fehlerkorrekturen. |

#### 2.1.2 Version abfragen

##### 2.1.2.1 Abfrage mit strings

Beispiel für 64-Bit-Android R:

```text
:/# strings vendor/lib64/librga.so |grep rga_api |grep version
rga_api version 1.0.0_[0]
```

##### 2.1.2.2 Logausgabe

Beim ersten RGA-API-Aufruf jedes Prozesses wird die Version protokolliert.

```text
rockchiprga: rga_api version 1.0.0_[0]
```

##### 2.1.2.3 API-Abfrage

Die folgende API fragt Code-, Build- und RGA-Hardwareversion ab. Details stehen im Abschnitt zu Anwendungsschnittstellen.

```text
querystring(RGA_VERSION);
```

Zeichenfolgenformat:

```text
RGA_api version : v1.0.0_[0]
RGA version : RGA_2_Enhance
```

##### 2.1.2.4 Eigenschaftsabfrage

Eigenschaftsabfragen werden nur unter Android unterstützt und sind erst wirksam, nachdem ein Prozess RGA aufgerufen und die Eigenschaft gesetzt hat.

```text
:/# getprop |grep rga
[vendor.rga_api.version]: [1.0.0_[0]]
```

### 2.2 Treiberversion

librga greift über den Treiber auf RGA zu. Die Treiberversion muss von der verwendeten librga-Version unterstützt werden.

#### 2.2.1 Versionsformat und Erhöhungsregeln

##### 2.2.1.1 Versionsformat

```text
<driver_name>: v major.minor.revision
```

Beispiele:

```text
RGA2 Device Driver: v2.1.0
RGA multicore Device Driver: v1.2.23
```

##### 2.2.1.2 Erhöhungsregeln

| Name | Regel |
| --- | --- |
| major | Hauptversion: nicht abwärtskompatible Releases. |
| minor | Nebenversion: abwärtskompatible funktionale API-Erweiterungen. |
| revision | Revision: abwärtskompatible Funktionsergänzungen oder kritische Fehlerkorrekturen. |

#### 2.2.2 Version abfragen

##### 2.2.2.1 Bootlog-Abfrage

Nach dem Start die RGA-Treiberinitialisierung mit folgendem Befehl abfragen. Manche älteren Treiber geben keine Version aus; die Methode funktioniert daher nicht mit allen Versionen.

```text
dmesg |grep rga
```

Beispiel:

```text
[ 2.382393] rga3_core0 fdb60000.rga: Adding to iommu group 2
[ 2.382651] rga: rga3_core0, irq = 33, match scheduler
[ 2.383058] rga: rga3_core0 hardware loaded successfully, hw_version:3.0.76831.
[ 2.383121] rga: rga3_core0 probe successfully
[ 2.383687] rga3_core1 fdb70000.rga: Adding to iommu group 3
[ 2.383917] rga: rga3_core1, irq = 34, match scheduler
[ 2.384313] rga: rga3_core1 hardware loaded successfully, hw_version:3.0.76831.
[ 2.384412] rga: rga3_core1 probe successfully
[ 2.384893] rga: rga2, irq = 35, match scheduler
[ 2.385238] rga: rga2 hardware loaded successfully, hw_version:3.2.63318.
[ 2.385257] rga: rga2 probe successfully
[ 2.385455] rga_iommu: IOMMU binding successfully, default mapping core[0x1]
[ 2.385586] rga: Module initialized. v1.2.23
```

Hier ist v1.2.23 die Treiberversion.

##### 2.2.2.2 Debugknoten-Abfrage

Die Version lässt sich über Debug-Knoten des Treibers abfragen. Fehlen die folgenden Knoten, unterstützt der laufende Treiber diese Abfrage nicht. Für einen Kernel mit der normalerweise aktivierten Option CONFIG_ROCKCHIP_RGA_DEBUG_FS:

```text
cat /sys/kernel/debug/rkrga/driver_version
```

Für einen Kernel mit aktivierter ROCKCHIP_RGA_PROC_FS:

```text
cat /proc/rkrga/driver_version
```

```text
cat /sys/kernel/debug/rkrga/driver_version
RGA multicore Device Driver: v1.2.23
```

RGA multicore Device Driver bezeichnet den Treibernamen, v1.2.23 die Version 1.2.23. Es läuft somit RGA multicore Device Driver Version 1.2.23 (meist multi_rga driver genannt).

```text
cat /sys/kernel/debug/rkrga/driver_version
RGA2 Device Driver: v2.1.0
```

RGA2 Device Driver bezeichnet den Treibernamen, v2.1.0 die Version 2.1.0. Es läuft somit RGA2 Device Driver Version 2.1.0 (meist rga2 driver genannt).

### 2.3 Versionsbeziehungen

Vor der Verwendung von RGA die Kompatibilität der Laufzeitumgebung prüfen. Die folgende Tabelle zeigt gängige Zuordnungen von librga- und Treiberversionen.

| librga-Version | Zugehöriger Treiber | Hardwareunterstützung |
| --- | --- | --- |
| Ohne Versionsnummer | Treiber im zugehörigen SDK | RGA1、RGA2 |
| 1.0.0 ~ 1.3.2 | RGA Device Driver(kernel - 4.4 oder neuer)<br>RGA2 Device Driver(ohne Versionsnummer oder v2.1.0) | RGA1、RGA2 |
| &gt; 1.4.0 | RGA multicore Device Driver(v1.2.0 oder neuer) | RGA2、RGA3 |
| &gt; 1.9.0 | RGA Device Driver(kernel-4.4 oder neuer)<br>RGA2 Device Driver(ohne Versionsnummer und v2.1.0)<br>RGA multicore Device Driver(v1.2.0 oder neuer) | RGA1、RGA2、RGA3 |

## 3. Anwendungsschnittstellen

Die RGA-Unterstützungsbibliothek heißt librga.so. Sie konfiguriert struct rga_info für 2D-Operationen und kapselt häufige Funktionen in einer benutzerfreundlicheren API. Die Definitionen orientieren sich an OpenCV/MATLAB, um den Lernaufwand zu verringern. RGA query liefert Hardwareversion, maximale Ein-/Ausgabeauflösungen und Formate zur Behandlung von Kompatibilitätsunterschieden. Vor der Verarbeitung befüllt wrapbuffer_T struct rga_buffer_t mit Pufferinformationen einschließlich Auflösung und Format. improcess führt kombinierte Operationen anhand vordefinierter usage-Flags aus. Nicht in einem Durchlauf ausführbare Operationen können als RGA-Job zusammengefasst und gemeinsam zur sequenziellen Treiberausführung eingereicht werden.

### 3.1 Übersicht

Diese Bibliothek stellt folgende APIs bereit. Asynchroner Modus wird nur von der C++-Implementierung unterstützt.

- `querystring`: Hardwareversion und unterstützte Funktionen des RGA im aktuellen SoC als String abfragen.
- `imcheckHeader`: Unterschiede zwischen aktueller Header- und librga-Version prüfen.
- `importbuffer_T`: Externen Speicher (dma_fd, virtuelle oder physische Adresse) in den RGA-Treiber importieren, damit Hardware schnell auf physisch zusammenhängenden oder nicht zusammenhängenden Speicher zugreifen kann.
- `releasebuffer_handle`: Treiberreferenzen und Abbildungen externer Puffer aufheben.
- `wrapbuffer_handle`: Einen Bildpuffer schnell in rga_buffer_t kapseln.
- `imbeginJob`: Einen RGA-Bildverarbeitungsjob erstellen.
- `imendJob`: Einen RGA-Job übermitteln und ausführen.
- `imcancelJob`: Einen RGA-Job abbrechen und löschen.
- `imcopy`: RGA für schnelle Bildkopie aufrufen.
- `imcopyTask`: Schnelle Bildkopie zu einem RGA-Bildjob hinzufügen.
- `imresize`: RGA für schnelle Bildskalierung aufrufen.
- `imresizeTask`: Schnelle Bildskalierung zu einem RGA-Bildjob hinzufügen.
- `impyramind`: RGA für schnelle Bildpyramidenverarbeitung (Quellschreibweise) aufrufen.
- `imcrop`: RGA für schnelle Bildzuschnitt aufrufen.
- `imcropTask`: Schnelle Bildzuschnitt zu einem RGA-Bildjob hinzufügen.
- `imtranslate`: RGA für schnelle Bildverschiebung aufrufen.
- `imtranslateTask`: Schnelle Bildverschiebung zu einem RGA-Bildjob hinzufügen.
- `imcvtcolor`: RGA für schnelle Bildformatkonvertierung aufrufen.
- `imcvtcolorTask`: Schnelle Bildformatkonvertierung zu einem RGA-Bildjob hinzufügen.
- `imrotate`: RGA für schnelle Bildrotation aufrufen.
- `imrotateTask`: Schnelle Bildrotation zu einem RGA-Bildjob hinzufügen.
- `imflip`: RGA für schnelle Bildspiegelung aufrufen.
- `imflipTask`: Schnelle Bildspiegelung zu einem RGA-Bildjob hinzufügen.
- `imblend`: RGA für schnelle Zweikanalkomposition aufrufen.
- `imblendTask`: Schnelle Zweikanalkomposition zu einem RGA-Bildjob hinzufügen.
- `imcomposite`: RGA für schnelle Dreikanalkomposition aufrufen.
- `imcompositeTask`: Schnelle Dreikanalkomposition zu einem RGA-Bildjob hinzufügen.

- `imcolorkey`: RGA für schnelle Farbschlüsselverarbeitung aufrufen.
- `imcolorkeyTask`: Schnelle Farbschlüsselverarbeitung zu einem RGA-Bildjob hinzufügen.
- `imosd`: RGA für schnelle OSD-Textüberlagerung aufrufen.
- `imosdTask`: Schnelle OSD-Textüberlagerung zu einem RGA-Bildjob hinzufügen.
- `imquantize`: RGA für schnelle NN-Vorverarbeitung (Quantisierung) aufrufen.
- `imquantizeTask`: Schnelle NN-Vorverarbeitung (Quantisierung) zu einem RGA-Bildjob hinzufügen.
- `imrop`: RGA für schnelle Rasteroperationen aufrufen.
- `imropTask`: Schnelle Rasteroperationen zu einem RGA-Bildjob hinzufügen.
- `imfill`: RGA für schnelle Bildfüllung aufrufen.
- `imfillTask`: Schnelle Bildfüllung zu einem RGA-Bildjob hinzufügen.
- `imfillArray`: RGA für schnelle mehrfache Bildfüllung aufrufen.
- `imfillTaskArray`: Schnelle mehrfache Bildfüllung zu einem RGA-Bildjob hinzufügen.
- `imrectangle`: RGA für schnelle gleichmäßige Rechteckrahmen aufrufen.
- `imrectangleTask`: Schnelle gleichmäßige Rechteckrahmen zu einem RGA-Bildjob hinzufügen.
- `imrectangleArray`: RGA für schnelle mehrere gleichmäßige Rechteckrahmen aufrufen.
- `imrectangleTaskArray`: Schnelle mehrere gleichmäßige Rechteckrahmen zu einem RGA-Bildjob hinzufügen.
- `immakeBorder`: RGA für schnelle Rechteckrahmen aufrufen.
- `immosaic`: RGA für schnelle Mosaikmaskierung aufrufen.
- `immosaicTask`: Schnelle Mosaikmaskierung zu einem RGA-Bildjob hinzufügen.
- `immosaicArray`: RGA für schnelle Mosaikmaskierung aufrufen.
- `immosaicTaskArray`: Schnelle Mosaikmaskierung zu einem RGA-Bildjob hinzufügen.
- `improcess`: RGA für schnelle kombinierte Bildverarbeitung aufrufen.
- `improcessTask`: Schnelle kombinierte Bildverarbeitung zu einem RGA-Bildjob hinzufügen.
- `imcheck`: Parametergültigkeit und Hardwareunterstützung prüfen.
- `imsync`: Abschluss im asynchronen Modus synchronisieren.
- `imconfig`: Standardeinstellungen zum aktuellen Threadkontext hinzufügen.

Die API-Unterstützung in unterschiedlichen Umgebungen folgt:

| Eintrag | API | Unterstützte Sprachen | Unterstützte Systeme | librga | RGA2<br>Treiber | Multi_RGA<br>Treiber |
| --- | --- | --- | --- | --- | --- | --- |
| allgemeine<br>API | querystring | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | / | / |
|  | imcheckHeader | C++ | Android / Linux<br>/ QNX / RT-<br>thread | ≥1.9.0 | / | / |
|  | imcheck | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imStrError | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | / | / |
|  | imsync | C++/C | Android / Linux | ≥1.6.0 | × | √ |
|  | imconfig | C++/C | Android / Linux | ≥1.6.0 | × | √ |
| Puffer-API | importbuffer_virtualaddr | C++/C | Android / Linux | ≥1.7.2 | × | √ |
|  | importbuffer_physicaladdr | C++/C | Android / Linux | ≥1.7.2 | × | √ |
|  | importbuffer_fd | C++/C | Android / Linux | ≥1.7.2 | × | √ |
|  | releasebuffer_handle | C++/C | Android / Linux | ≥1.7.2 | × | √ |
|  | wrapbuffer_handle | C++/C | Android / Linux | ≥1.7.2 | / | / |
|  | wrapbuffer_virtualaddr | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | / | / |
|  | wrapbuffer_physicaladdr | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | / | / |
|  | wrapbuffer_fd | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | / | / |

| Eintrag | API | Unterstützte Sprachen | Unterstützte Systeme | librga | RGA2<br>Treiber | Multi_RGA<br>Treiber |
| --- | --- | --- | --- | --- | --- | --- |
|  | imcopy | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imresize | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | impyramind | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imcrop | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imtranslate | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imcvtcolor | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imrotate | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imflip | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imblend | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imcomposite | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imcolorkey | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imosd | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | ≥1.8.0 | × | √ |
|  | imquantize | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imrop | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imfill | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imfillArray | C++/C | Android / Linux | ≥1.9.0 | × | √ |
|  | imrectangle | C++/C | Android / Linux | ≥1.9.0 | × | √ |

| Eintrag | API | Unterstützte Sprachen | Unterstützte Systeme | librga | RGA2<br>Treiber | Multi_RGA<br>Treiber |
| --- | --- | --- | --- | --- | --- | --- |
|  | imrectangleArray | C++/C | Android / Linux | ≥1.9.0 | × | √ |
|  | immakeBorder | C++/C | Android / Linux | ≥1.9.0 | × | √ |
|  | imMosaik | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | ≥1.8.0 | × | √ |
|  | imMosaikArray | C++/C | Android / Linux | ≥1.9.0 | × | √ |
|  | improcess | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
| Taskverarbeitungs-<br>API | imbeginJob | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imendJob | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imcancelJob | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imcopyTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imresizeTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imcropTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imtranslateTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imcvtcolorTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imrotateTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imflipTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imblendTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imcompositeTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imcolorkeyTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imosdTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imquantizeTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imropTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imfillTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imfillTaskArray | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imrectangleTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imrectangleTaskArray | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imMosaikTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imMosaikTaskArray | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imMosaikTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | improcessTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |

| Eintrag | API | Unterstützte Sprachen | Unterstützte Systeme | librga | RGA2<br>Treiber | Multi_RGA<br>Treiber |
| --- | --- | --- | --- | --- | --- | --- |
| erweiterte API | importbuffer_GraphicBuffer | C++ | Android | √ | / | / |
|  | importbuffer_GraphicBuffer_handle | C++ | Android | √ | / | / |
|  | importbuffer_AHardwareBuffer | C++ | Android | √ | / | / |
|  | wrapbuffer_GraphicBuffer | C++ | Android | √ | / | / |
|  | wrapbuffer_handle(GraphicBuffer<br>handle) | C++ | Android | √ | / | / |
|  | wrapbuffer_AHardwareBuffer | C++ | Android | √ | / | / |

Legende: √ unterstützt; × nicht unterstützt; / nicht zutreffend.

### 3.2 RGA-Version und Unterstützung abfragen

#### 3.2.1 querystring

```text
const char* querystring(int name);
```

RGA-Grundinformationen sowie unterstützte Auflösungen und Formate abfragen.

| Parameter | Beschreibung |
| --- | --- |
| name | RGA_VENDOR - Herstellerinformationen<br>RGA_VERSION - Versionsinformationen<br>RGA_MAX_INPUT - maximale Eingangsauflösung<br>RGA_MAX_OUTPUT - maximale Ausgangsauflösung<br>RGA_BYTE_STRIDE - unterstützte Stride-Ausrichtung<br>RGA_SCALE_LIMIT - unterstützte Skalierungsfaktoren<br>RGA_INPUT_FORMAT - unterstützte Eingangsformate<br>RGA_OUTPUT_FORMAT - unterstützte Ausgangsformate<br>RGA_EXPECTED - erwartete Leistung<br>RGA_ALL - sämtliche Informationen ausgeben |

Gibt einen String mit RGA-Eigenschaften zurück.

### 3.3 Headerversion prüfen

#### 3.3.1 imcheckHeader

```text
IM_API IM_STATUS imcheckHeader(im_api_version_t header_version = RGA_CURRENT_API_HEADER_VERSION);
```

Unterschiede zwischen verwendeter Header- und librga-Version prüfen.

| Parameter | Beschreibung |
| --- | --- |
| header_version | Headerversion; normalerweise RGA_CURRENT_API_HEADER_VERSION verwenden. |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

### 3.4 Bildpuffervorverarbeitung

#### 3.4.1 importbuffer_T

Für von RGA zu verarbeitenden externen Speicher bildet importbuffer_T die physischen Pufferadressen im Treiber ab und ermittelt die zugehörigen Adressinformationen für spätere stabile und schnelle RGA-Aufrufe.

| Parameter(T) | Datentyp | Beschreibung |
| --- | --- | --- |
| virtuelle Adresse | void * | Virtuelle Bildpufferadresse |
| physische Adresse | uint64_t | Zusammenhängende physische Bildpufferadresse |
| fd | int | DMA-Bildpuffer-Dateideskriptor |
| GraphicBuffer<br>handle | buffer_handle_t | Bildpufferhandle mit Adresse, Dateideskriptor, Auflösung und Format |
| GraphicBuffer | GraphicBuffer | Android-Grafikpuffer |
| AHardwareBuffer | AHardwareBuffer | Speicherblöcke, auf die verschiedene Hardwarekomponenten im<br>System zugreifen können. https://developer.android.com/ndk/reference/group/a-hardware-buffer |

Die Leistung hängt vom Puffertyp ab: physical address &gt; fd &gt; virtual address. Im Allgemeinen wird fd empfohlen.

```text
IM_API rga_buffer_handle_t importbuffer_fd(int fd, int size);
IM_API rga_buffer_handle_t importbuffer_virtualaddr(void *va, int size);
IM_API rga_buffer_handle_t importbuffer_physicaladdr(uint64_t pa, int size);
```

| Parameter | Beschreibung |
| --- | --- |
| fd/va/pa | [erforderlich] externer Puffer |
| size | [erforderlich] Speichergröße |

```text
IM_API rga_buffer_handle_t importbuffer_fd(int fd, int width, int height, int format);
IM_API rga_buffer_handle_t importbuffer_virtualaddr(void *va, int width, int height, int format);
IM_API rga_buffer_handle_t importbuffer_physicaladdr(uint64_t pa, int width, int height, int format);
```

| Parameter | Beschreibung |
| --- | --- |
| fd/va/pa | [erforderlich] externer Puffer |
| width | [erforderlich] Pixelbreiten-Stride des Bildpuffers |
| height | [erforderlich] Pixelhöhen-Stride des Bildpuffers |
| format | [erforderlich] Pixelformat des Bildpuffers |

```text
IM_API rga_buffer_handle_t importbuffer_fd(int fd, im_handle_param_t *param);
IM_API rga_buffer_handle_t importbuffer_virtualaddr(void *va, im_handle_param_t *param);
IM_API rga_buffer_handle_t importbuffer_physicaladdr(uint64_t pa, im_handle_param_t *param);
```

| Parameter | Beschreibung |
| --- | --- |
| fd/va/pa | [erforderlich] externer Puffer |
| param | [erforderlich] PufferParameter konfigurieren |

```text
IM_API rga_buffer_handle_t importbuffer_GraphicBuffer_handle(buffer_handle_t hnd);
IM_API rga_buffer_handle_t importbuffer_GraphicBuffer(sp<GraphicBuffer> buf);
IM_API rga_buffer_handle_t importbuffer_AHardwareBuffer(AHardwareBuffer *buf);
```

| Parameter | Beschreibung |
| --- | --- |
| hnd/buf | [erforderlich] externer Puffer |

Gibt ein Speicherhandle rga_buffer_handle_t zurück.

#### 3.4.2 releasebuffer_handle

Nach der RGA-Verarbeitung externen Speichers releasebuffer_handle mit dessen handle aufrufen, um Pufferzuordnung und -bindung sowie die entsprechenden Treiberressourcen freizugeben.

```text
IM_API IM_STATUS releasebuffer_handle(rga_buffer_handle_t handle);
```

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

#### 3.4.3 wrapbuffer_handle

IM2D-Parameter für Quell- und Zielbilder unterstützen mehrere Typen und beschreiben Speicher, Format, Breite und Höhe. Vor der Bildoperation wandelt wrapbuffer_handle diese Angaben in die gemeinsame Struktur rga_buffer_t für die Benutzer-API um.

```text
rga_buffer_t wrapbuffer_handle(rga_buffer_handle_t handle,
                               int width,
                               int height,
                               int format,
                               int wstride = width,
                               int hstride = height);
```

| Parameter | Beschreibung |
| --- | --- |
| handle | [erforderlich] RGA-Pufferhandle |
| width | [erforderlich] Pixelbreite des zu verarbeitenden Bildes |
| height | [erforderlich] Pixelhöhe des zu verarbeitenden Bildes |
| format | [erforderlich] Pixelformat |
| wtride | [optional] Pixelbreiten-Stride des Bildes |
| hstride | [optional] Pixelbreiten-Stride des Bildes |

Gibt rga_buffer_t zur Bildbeschreibung zurück.

### 3.5 Bildjob erstellen

#### 3.5.1 imbeginJob

```text
IM_API im_job_handle_t imbeginJob(uint64_t flags = 0);
```

Einen RGA-Bildverarbeitungsjob erstellen und dessen Handle zurückgeben. job_handle dient zum Hinzufügen/Entfernen von Operationen und zum Einreichen/Ausführen des Jobs.

| Parameter | Beschreibung |
| --- | --- |
| flags | [optional] Jobflags |

Gibt ein Jobhandle im_job_handle_t zurück.

### 3.6 Bildjob übermitteln

#### 3.6.1 imendJob

```text
IM_API IM_STATUS imendJob(im_job_handle_t job_handle,
                          int sync_mode = IM_SYNC,
                          int acquire_fence_fd = 0,
                          int *release_fence_fd = NULL);
```

Einen erstellten RGA-Bildverarbeitungsjob einreichen und ausführen. Nach Abschluss werden seine Ressourcen automatisch gelöscht.

| Parameter | Beschreibung |
| --- | --- |
| job_handle | [erforderlich] Jobhandle |
| sync_mode | [optional] auf Operationsabschluss warten |
| acquire_fence_fd | [optional] im asynchronen Modus den Job nach Warten auf das acquire_fence-Signal ausführen |
| release_fence_fd | [optional] im asynchronen Modus als Parameter von imsync() verwendet |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

### 3.7 Bildjob abbrechen

#### 3.7.1 imcancelJob

```text
IM_API IM_STATUS imcancelJob(im_job_handle_t job_handle);
```

Einen erstellten RGA-Bildverarbeitungsjob abbrechen und löschen.

| Parameter | Beschreibung |
| --- | --- |
| job_handle | [erforderlich] Jobhandle |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

### 3.8 Bildkopie

#### 3.8.1 imcopy

```text
IM_STATUS imcopy(const rga_buffer_t src,
                 rga_buffer_t dst,
                 int sync = 1,
                 int *release_fence_fd = NULL);
```

Ein Bild einmalig schnell vom src-Kanalpuffer in den dst-Kanalpuffer kopieren.

| Parameter | Beschreibung |
| --- | --- |
| src | [erforderlich] Eingangsbild |
| dst | [erforderlich] Ausgabebild |
| sync | [optional] auf Operationsabschluss warten |
| release_fence_fd | [optional]im asynchronen Modus als Parameter von imsync() verwendet |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

#### 3.8.2 imcopyTask

```text
IM_API IM_STATUS imcopyTask(im_job_handle_t job_handle,
                            const rga_buffer_t src,
                            rga_buffer_t dst);
```

Über job_handle eine Operation für Bildkopie zum angegebenen Job hinzufügen. Verwendung wie bei imcopy.

| Parameter | Beschreibung |
| --- | --- |
| job_handle | [erforderlich] Jobhandle |
| src | [erforderlich] Eingangsbild |
| dst | [erforderlich] Ausgabebild |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

### 3.9 Skalierung und Bildpyramiden

#### 3.9.1 imresize

```text
IM_STATUS imresize(const rga_buffer_t src,
                   rga_buffer_t dst,
                   double fx = 0,
                   double fy = 0,
                   int interpolation = INTER_LINEAR,
                   int sync = 1,
                   int *release_fence_fd = NULL);
```

Die Zielabmessungen über dst oder das gewünschte Verhältnis über fx/fy festlegen. Werden beide konfiguriert, haben die aus fx/fy berechneten Abmessungen Vorrang.

Nur RGA1/RGA1 plus unterstützen eine konfigurierbare interpolation; bei anderer Hardware den Skalierungsalgorithmus im TRM nachsehen. Mit fx/fy werden Abmessungen von Formaten mit Ausrichtungsanforderungen, etwa YUV, nach unten ausgerichtet. Das kann das erwartete Skalierungsergebnis verändern.

| Parameter | Beschreibung |
| --- | --- |
| src | [erforderlich] Eingangsbild |
| dst | [erforderlich] Ausgabebild; Größe dsize (falls nicht null), sonst aus src.size(), fx<br>und fy berechnet; dst hat denselben Typ wie src. |
| fx | [optional] horizontaler Skalierungsfaktor; bei 0 berechnet als:<br>fx = (double) dst.width / src.width |
| fy | [optional] vertikaler Skalierungsfaktor; bei 0 berechnet als:<br>fy = (double) dst.height / src.height |
| interpolation | [optional] Interpolationsmethode:<br>INTER_NEAREST - Nächster-Nachbar-Interpolation<br>INTER_LINEAR - bilineare Interpolation (Standard)<br>INTER_CUBIC - bikubische Interpolation über eine 4x4-Pixel-Nachbarschaft |
| sync | [optional] auf Operationsabschluss warten |
| release_fence_fd | [optional]im asynchronen Modus als Parameter von imsync() verwendet |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

#### 3.9.2 impyramid

```text
IM_STATUS impyramid (const rga_buffer_t src,
                     rga_buffer_t dst，
                     IM_SCALE direction)
```

Pyramidenskalierung: abhängig von direction Breite und Höhe gemeinsam halbieren oder verdoppeln.

| Parameter | Beschreibung |
| --- | --- |
| src | [erforderlich] Eingangsbild |
| dst | [erforderlich] Ausgabebild; |
| direction | [erforderlich] Skalierungsmodus<br>IM_UP_SCALE —— Vergrößern<br>IM_DOWN_SCALE —— Verkleinern |
| release_fence_fd | [optional]im asynchronen Modus als Parameter von imsync() verwendet |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

#### 3.9.3 imresizeTask

```text
IM_API IM_STATUS imresizeTask(im_job_handle_t job_handle,
                              const rga_buffer_t src,
                              rga_buffer_t dst,
                              double fx = 0,
                              double fy = 0,
                              int interpolation = 0);
```

Über job_handle eine Operation für Bildskalierung zum angegebenen Job hinzufügen. Verwendung wie bei imresize.

| Parameter | Beschreibung |
| --- | --- |
| job_handle | [erforderlich] Jobhandle |
| src | [erforderlich] Eingangsbild |
| dst | [erforderlich] Ausgabebild; Größe dsize (falls nicht null), sonst aus src.size(), fx<br>und fy berechnet; dst hat denselben Typ wie src. |
| fx | [optional] horizontaler Skalierungsfaktor; bei 0 berechnet als:<br>fx = (double) dst.width / src.width |
| fy | [optional] vertikaler Skalierungsfaktor; bei 0 berechnet als:<br>fy = (double) dst.height / src.height |
| interpolation | [optional] Interpolationsmethode:<br>INTER_NEAREST - Nächster-Nachbar-Interpolation<br>INTER_LINEAR - bilineare Interpolation (Standard)<br>INTER_CUBIC - bikubische Interpolation über eine 4x4-Pixel-Nachbarschaft |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

### 3.10 Bildzuschnitt

#### 3.10.1 imcrop

```text
IM_STATUS imcrop(const rga_buffer_t src,
                 rga_buffer_t dst,
                 im_rect rect,
                 int sync = 1,
                 int *release_fence_fd = NULL);
```

Das Bild auf den durch Rect angegebenen Bereich und dessen Größe zuschneiden.

| Parameter | Beschreibung |
| --- | --- |
| src | [erforderlich] Eingangsbild |
| dst | [erforderlich] Ausgabebild |
| rect | [erforderlich] Zuschnittbereich<br>x - x-Koordinate links oben<br>y - y-Koordinate links oben<br>width - Bereichsbreite<br>height - Bereichshöhe |
| sync | [optional] auf Operationsabschluss warten |
| release_fence_fd | [optional]im asynchronen Modus als Parameter von imsync() verwendet |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

#### 3.10.2 imcropTask

```text
IM_API IM_STATUS imcropTask(im_job_handle_t job_handle,
                            const rga_buffer_t src,
                            rga_buffer_t dst,
                            im_rect rect);
```

Über job_handle eine Operation für Bildzuschnitt zum angegebenen Job hinzufügen. Verwendung wie bei imcrop.

| Parameter | Beschreibung |
| --- | --- |
| job_handle | [erforderlich] Jobhandle |
| src | [erforderlich] Eingangsbild |
| dst | [erforderlich] Ausgabebild |
| rect | [erforderlich] Zuschnittbereich<br>x - x-Koordinate links oben<br>y - y-Koordinate links oben<br>width - Bereichsbreite<br>height - Bereichshöhe |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

### 3.11 Bildverschiebung

#### 3.11.1 imtranslate

```text
IM_STATUS imtranslate(const rga_buffer_t src,
                      rga_buffer_t dst,
                      int x,
                      int y,
                      int sync = 1,
                      int *release_fence_fd = NULL);
```

Das Bild zu (x, y) verschieben. src und dst müssen gleiche Breite und Höhe besitzen; überstehende Teile werden abgeschnitten.

| Parameter | Beschreibung |
| --- | --- |
| src | [erforderlich]Eingangsbild |
| dst | [erforderlich] Ausgabebild |
| x | [erforderlich] horizontale Verschiebung |
| y | [erforderlich] vertikale Verschiebung |
| sync | [optional] auf Operationsabschluss warten |
| release_fence_fd | [optional]im asynchronen Modus als Parameter von imsync() verwendet |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

#### 3.11.2 imtranslateTask

```text
IM_API IM_STATUS imtranslateTask(im_job_handle_t job_handle,
                                 const rga_buffer_t src,
                                 rga_buffer_t dst,
                                 int x,
                                 int y);
```

Über job_handle eine Operation für Bildverschiebung zum angegebenen Job hinzufügen. Verwendung wie bei imtranslate.

| Parameter | Beschreibung |
| --- | --- |
| job_handle | [erforderlich] Jobhandle |
| src | [erforderlich]Eingangsbild |
| dst | [erforderlich] Ausgabebild |
| x | [erforderlich] horizontale Verschiebung |
| y | [erforderlich] vertikale Verschiebung |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

### 3.12 Bildformatkonvertierung

#### 3.12.1 imcvtcolor

```text
IM_STATUS imcvtcolor(rga_buffer_t src,
                     rga_buffer_t dst,
                     int sfmt,
                     int dfmt,
                     int mode = IM_COLOR_SPACE_DEFAULT,
                     int sync = 1,
                     int *release_fence_fd = NULL);
```

Das Bildformat konvertieren. Die Unterstützung hängt vom SoC ab; siehe Formatübersicht. Formate über rga_buffer_t oder getrennt über sfmt/dfmt festlegen. Bei YUV/RGB-Farbraumkonvertierung wählt mode den Farbraum; Standard ist BT.601 limited range.

| Parameter | Beschreibung |
| --- | --- |
| src | [erforderlich] Eingangsbild |
| dst | [erforderlich] Ausgabebild |
| sfmt | [optional] Quellbildformat |
| dfmt | [optional] Zielbildformat |
| Mode | [optional] Farbraummodus:<br>IM_YUV_TO_RGB_BT601_LIMIT<br>IM_YUV_TO_RGB_BT601_FULL<br>IM_YUV_TO_RGB_BT709_LIMIT<br>IM_RGB_TO_YUV_BT601_LIMIT<br>IM_RGB_TO_YUV_BT601_FULL<br>IM_RGB_TO_YUV_BT709_LIMIT |
| sync | [optional] auf Operationsabschluss warten |
| release_fence_fd | [optional]im asynchronen Modus als Parameter von imsync() verwendet |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

#### 3.12.2 imcvtcolorTask

```text
IM_API IM_STATUS imcvtcolorTask(im_job_handle_t job_handle,
                                rga_buffer_t src,
                                rga_buffer_t dst,
                                int sfmt,
                                int dfmt,
                                int mode = IM_COLOR_SPACE_DEFAULT);
```

Über job_handle eine Operation für Bildverschiebung (Quellwortlaut) zum angegebenen Job hinzufügen. Verwendung wie bei imcvtcolor.

| Parameter | Beschreibung |
| --- | --- |
| job_handle | [erforderlich] Jobhandle |
| src | [erforderlich] Eingangsbild |
| dst | [erforderlich] Ausgabebild |
| sfmt | [optional] Quellbildformat |
| dfmt | [optional] Zielbildformat |
| Mode | [optional] Farbraummodus:<br>IM_YUV_TO_RGB_BT601_LIMIT<br>IM_YUV_TO_RGB_BT601_FULL<br>IM_YUV_TO_RGB_BT709_LIMIT<br>IM_RGB_TO_YUV_BT601_LIMIT<br>IM_RGB_TO_YUV_BT601_FULL<br>IM_RGB_TO_YUV_BT709_LIMIT |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

### 3.13 Bildrotation

#### 3.13.1 imrotate

```text
IM_STATUS imrotate(const rga_buffer_t src,
                   rga_buffer_t dst,
                   int rotation,
                   int sync = 1,
                   int *release_fence_fd = NULL);
```

Bilder um 90, 180 oder 270 Grad drehen.

| Parameter | Beschreibung |
| --- | --- |
| src | [erforderlich] Eingangsbild |
| dst | [erforderlich] Ausgabebild |
| rotation | [erforderlich] Drehwinkel:<br>IM_HAL_TRANSFORM_ROT_90<br>IM_HAL_TRANSFORM_ROT_180<br>IM_HAL_TRANSFORM_ROT_270 |
| sync | [optional] auf Operationsabschluss warten |
| release_fence_fd | [optional]im asynchronen Modus als Parameter von imsync() verwendet |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

#### 3.13.2 imrotateTask

```text
IM_API IM_STATUS imrotateTask(im_job_handle_t job_handle,
                              const rga_buffer_t src,
                              rga_buffer_t dst,
                              int rotation);
```

Über job_handle eine Operation für Bildrotation zum angegebenen Job hinzufügen. Verwendung wie bei imrotate.

| Parameter | Beschreibung |
| --- | --- |
| job_handle | [erforderlich] Jobhandle |
| src | [erforderlich] Eingangsbild |
| dst | [erforderlich] Ausgabebild |
| rotation | [erforderlich] Drehwinkel:<br>IM_HAL_TRANSFORM_ROT_90<br>IM_HAL_TRANSFORM_ROT_180<br>IM_HAL_TRANSFORM_ROT_270 |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

### 3.14 Bildspiegelung

#### 3.14.1 imfilp

```text
IM_STATUS imflip (const rga_buffer_t src,
                  rga_buffer_t dst,
                  int mode,
                  int sync = 1,
                  int *release_fence_fd = NULL);
```

Bilder horizontal oder vertikal spiegeln.

| Parameter | Beschreibung |
| --- | --- |
| src | [erforderlich] Eingangsbild |
| dst | [erforderlich] Ausgabebild |
| mode | [erforderlich] Spiegelmodus:<br>IM_HAL_TRANSFORM_FLIP_H_V<br>IM_HAL_TRANSFORM_FLIP_H<br>IM_HAL_TRANSFORM_FLIP_V |
| sync | [optional] auf Operationsabschluss warten |
| release_fence_fd | [optional]im asynchronen Modus als Parameter von imsync() verwendet |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

#### 3.14.2 imflipTask

```text
IM_API IM_STATUS imflipTask(im_job_handle_t job_handle,
                            const rga_buffer_t src,
                            rga_buffer_t dst,
                            int mode);
```

Über job_handle eine Operation für Bildspiegelung zum angegebenen Job hinzufügen. Verwendung wie bei imflip.

| Parameter | Beschreibung |
| --- | --- |
| job_handle | [erforderlich] Jobhandle |
| src | [erforderlich] Eingangsbild |
| dst | [erforderlich] Ausgabebild |
| mode | [erforderlich] Spiegelmodus:<br>IM_HAL_TRANSFORM_FLIP_H_V<br>IM_HAL_TRANSFORM_FLIP_H<br>IM_HAL_TRANSFORM_FLIP_V |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

### 3.15 Bildkomposition

#### 3.15.1 imblend/imcomposite

```text
IM_STATUS imblend(const rga_buffer_t fg_image,
                  rga_buffer_t bg_image,
                  int mode = IM_ALPHA_BLEND_SRC_OVER,
                  int sync = 1,
                  int *release_fence_fd = NULL);
```

Die Zweikanalkomposition verwendet A+B -&gt; B: Vordergrund srcA und Hintergrund dst werden nach dem eingestellten Alpha-Modell gemischt, das Ergebnis geht an dst. Ohne Konfiguration gilt src-over.

```text
IM_STATUS imcomposite(const rga_buffer_t fg_image,
                      const rga_buffer_t bg_image,
                      rga_buffer_t output_image,
                      int mode = IM_ALPHA_BLEND_SRC_OVER,
                      int sync = 1,
                      int *release_fence_fd = NULL);
```

Die RGA-Dreikanalkomposition verwendet A+B -&gt; C: Vordergrund srcA und Hintergrund srcB werden nach dem konfigurierten Modell alphagemischt, das Ergebnis wird in dst geschrieben. Standard ist src-over. In beiden Kompositionsarten wählt mode das Porter-Duff-Modell. Definitionen:

- S: Quell-/Vordergrundbild.
- D: Ziel-/Hintergrundbild.
- R: Ergebnis.
- c: RGB-Farbkomponenten von RGBA. Porter-Duff verwendet vormultiplizierte Farben: Originalfarbe mal Alpha. Falls noch nicht vormultipliziert, Xc = Xc * Xa ausführen.
- a: Alpha-/Transparenzkomponente von RGBA.
- f: Faktor für Farbe oder Alpha.

Die Kernformeln berechnen Ergebnisfarbe = Quellfarbe × Quellfaktor + Zielfarbe × Zielfaktor; Ergebnisalpha wird entsprechend berechnet. RGA unterstützt folgende Modelle:

```text
Rc = Sc * Sf + Dc * Df;
Ra = Sa * Sf + Da * Df;

SRC:
Sf = 1, Df = 0;
[Rc,Ra] = [Sc,Sa];
DST:
Sf = 0, Df = 1;
[Rc,Ra] = [Dc,Da];
SRC_OVER:
Sf = 1, Df = (1 - Sa);
[Rc,Ra] = [ Sc + (1 - Sa) * Dc, Sa + (1 - Sa) * Da ];
DST_OVER:
Sf = (1 - Da), Df = 1;
```

```text
[Rc,Ra] = [ Sc * (1 - Da) + Dc, Sa * (1 - Da) + Da ] ;
```

Komposition zwischen YUV-Bildern wird nicht unterstützt. dst bei imblend und srcB bei imcomposite dürfen kein YUV verwenden.

| Parameter | Beschreibung |
| --- | --- |
| fg_image | [erforderlich] Vordergrundbild |
| bg_image | [erforderlich] Hintergrundbild; bei A+B-&gt;B zugleich Ausgabebild. |
| output_image | [erforderlich] Ausgabezielbild. |
| mode | [optional] Mischmodus:<br>IM_ALPHA_BLEND_SRC —— SRC-Modus<br>IM_ALPHA_BLEND_DST —— DST-Modus<br>IM_ALPHA_BLEND_SRC_OVER —— SRC-OVER-Modus<br>IM_ALPHA_BLEND_DST_OVER —— DST-OVER-Modus<br>IM_ALPHA_BLEND_PRE_MUL —— Vormultiplikation aktivieren: dieses Flag mit den anderen Modusflags per OR verknüpfen und mode zuweisen. |
| sync | [optional] auf Operationsabschluss warten |
| release_fence_fd | [optional]im asynchronen Modus als Parameter von imsync() verwendet |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

#### 3.15.2 imblendTask/imcompositeTask

```text
IM_API IM_STATUS imblendTask(im_job_handle_t job_handle,
                             const rga_buffer_t fg_image,
                             rga_buffer_t bg_image,
                             int mode = IM_ALPHA_BLEND_SRC_OVER);
```

Über job_handle eine A+B -&gt; B-Komposition zum Job hinzufügen. Verwendung wie imblend; Standardmischmodus ist src-over.

```text
IM_API IM_STATUS imcompositeTask(im_job_handle_t job_handle,
                                 const rga_buffer_t fg_image,
                                 const rga_buffer_t bg_image,
                                 rga_buffer_t output_image,
                                 int mode = IM_ALPHA_BLEND_SRC_OVER);
```

Über job_handle eine A+B -&gt; C-Komposition hinzufügen. Verwendung wie imcomposite; Standard ist src-over. YUV-zu-YUV-Komposition wird nicht unterstützt: dst bei imblend und srcB bei imcomposite dürfen kein YUV verwenden.

| Parameter | Beschreibung |
| --- | --- |
| job_handle | [erforderlich] Jobhandle |
| fg_image | [erforderlich] Vordergrundbild |
| bg_image | [erforderlich] Hintergrundbild; bei A+B-&gt;B zugleich Ausgabebild. |
| output_image | [erforderlich] Ausgabezielbild. |
| mode | [optional] Mischmodus:<br>IM_ALPHA_BLEND_SRC —— SRC-Modus<br>IM_ALPHA_BLEND_DST —— DST-Modus<br>IM_ALPHA_BLEND_SRC_OVER —— SRC-OVER-Modus<br>IM_ALPHA_BLEND_DST_OVER —— DST-OVER-Modus<br>IM_ALPHA_BLEND_PRE_MUL —— Vormultiplikation aktivieren: dieses Flag mit den anderen Modusflags per OR verknüpfen und mode zuweisen. |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

### 3.16 Farbschlüssel

#### 3.16.1 imcolorkey

```text
IM_STATUS imcolorkey(const rga_buffer_t src,
                     rga_buffer_t dst,
                     im_colorkey_range range,
                     int mode = IM_ALPHA_COLORKEY_NORMAL,
                     int sync = 1,
                     int *release_fence_fd = NULL);
```

Color Key setzt bei der Vorverarbeitung die Alpha-Komponente der Quellpixel auf null, deren nichttransparente Farbwerte die Schlüsselbedingung erfüllen. Anschließend wird die Quelle mit dem Ziel alphagemischt. Die Filterung gilt nur für den festgelegten Farbbereich in src; das Ergebnis wird auf dst gelegt. IM_ALPHA_COLORKEY_NORMAL löscht Alpha innerhalb des Bereichs, IM_ALPHA_COLORKEY_INVERTED außerhalb. Standard ist IM_ALPHA_COLORKEY_NORMAL.

| Parameter | Bereich | Beschreibung |
| --- | --- | --- |
| max | 0x0 ~ 0xFFFFFFFF | Maximaler zu entfernender Schlüsselfarbwert in ABGR-Reihenfolge |
| min | 0x0 ~ 0xFFFFFFFF | Minimaler zu entfernender Schlüsselfarbwert in ABGR-Reihenfolge |

| Parameter | Beschreibung |
| --- | --- |
| src | [erforderlich] Eingangsbild |
| dst | [erforderlich] Ausgabebild |
| range | [erforderlich] Zielfarbbereich<br>typedef struct im_colorkey_range {<br>int max;<br>int min;<br>} im_colorkey_value; |
| Mode | [erforderlich] Farbschlüsselmodus:<br>IM_ALPHA_COLORKEY_NORMAL<br>IM_ALPHA_COLORKEY_INVERTED |
| sync | [optional] auf Operationsabschluss warten |
| release_fence_fd | [optional]im asynchronen Modus als Parameter von imsync() verwendet |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

#### 3.16.2 imcolorkeyTask

```text
IM_API IM_STATUS imcolorkeyTask(im_job_handle_t job_handle,
                                const rga_buffer_t fg_image,
                                rga_buffer_t bg_image,
                                im_colorkey_range range,
                                int mode = IM_ALPHA_COLORKEY_NORMAL);
```

Über job_handle Color Key zum Job hinzufügen. Verwendung wie imcolorkey; Standardmodus ist IM_ALPHA_COLORKEY_NORMAL.

| Parameter | Bereich | Beschreibung |
| --- | --- | --- |
| max | 0x0 ~ 0xFFFFFFFF | Maximaler zu entfernender Schlüsselfarbwert in ABGR-Reihenfolge |
| min | 0x0 ~ 0xFFFFFFFF | Minimaler zu entfernender Schlüsselfarbwert in ABGR-Reihenfolge |

| Parameter | Beschreibung |
| --- | --- |
| job_handle | [erforderlich] Jobhandle |
| src | [erforderlich] Eingangsbild |
| dst | [erforderlich] Ausgabebild |
| range | [erforderlich] Zielfarbbereich<br>typedef struct im_colorkey_range {<br>int max;<br>int min;<br>} im_colorkey_value; |
| Mode | [erforderlich] Farbschlüsselmodus:<br>IM_ALPHA_COLORKEY_NORMAL<br>IM_ALPHA_COLORKEY_INVERTED |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

### 3.17 OSD-Textüberlagerung

#### 3.17.1 imosd

```text
IM_API IM_STATUS imosd(const rga_buffer_t osd,
                       const rga_buffer_t bg_image,
                       const im_rect osd_rect,
                       im_osd_t *osd_config,
                       int sync = 1,
                       int *release_fence_fd = NULL);
```

OSD (On-Screen Display) legt Text über Videobilder und unterstützt Helligkeitsstatistik des Textes sowie automatische Farbinvertierung.

| Parameter | Beschreibung |
| --- | --- |
| OSD | [erforderlich] OSD-Blockbild |
| bg_image | [erforderlich] Ausgabebild |
| osd_rect | [erforderlich] Bildbereich für OSD |
| osd_config | [erforderlich] OSD-Funktionskonfiguration |
| sync | [optional] auf Operationsabschluss warten |
| release_fence_fd | [optional]im asynchronen Modus als Parameter von imsync() verwendet |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

#### 3.17.2 imosdTask

```text
IM_API IM_STATUS imosdTask(im_job_handle_t job_handle,
                           const rga_buffer_t osd,
                           const rga_buffer_t bg_image,
                           const im_rect osd_rect,
                           im_osd_t *osd_config);
```

Über job_handle OSD-Verarbeitung zum angegebenen Job hinzufügen. Verwendung wie imosd.

| Parameter | Beschreibung |
| --- | --- |
| job_handle | [erforderlich] Jobhandle |
| OSD | [erforderlich] OSD-Blockbild |
| dst | [erforderlich] Ausgabebild |
| osd_rect | [erforderlich] Bildbereich für OSD |
| osd_config | [erforderlich] OSD-Funktionskonfiguration |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

### 3.18 NN-Vorverarbeitung (Quantisierung)

#### 3.18.1 imquantize

```text
IM_STATUS imquantize(const rga_buffer_t src,
                     rga_buffer_t dst,
                     rga_nn_t nn_info,
                     int sync = 1,
                     int *release_fence_fd = NULL);
```

Derzeit nur auf RV1126 / RV1109 unterstützt. Bei der NN-Vorverarbeitung können offset und scale für jeden der drei RGB-Kanäle getrennt eingestellt werden. Formel:

```text
dst = 【(src + offset) * scale 】
```

Parameterbereiche:

| Parameter | Bereich | Beschreibung |
| --- | --- | --- |
| scale | 0 ~ 3.99 | 10 Bit: die oberen 2 Bit bilden den Ganzzahlteil, die unteren 8 den Bruchteil. |
| offset | -255 ~ 255 | 9 Bit: das höchste Bit ist das Vorzeichen; die unteren codieren einen Offset von 0–255. |

| Parameter | Beschreibung |
| --- | --- |
| src | [erforderlich] Eingangsbild |
| dst | [erforderlich] Ausgabebild |
| nn_info | [erforderlich] rga_nn_t konfiguriert offset und Skalierung getrennt für jeden RGB-Kanal<br>typedef struct rga_nn {<br>int nn_flag;<br>int Skalierung_r;<br>int Skalierung_g;<br>int Skalierung_b;<br>int offset_r;<br>int offset_g;<br>int offset_b;<br>} rga_nn_t; |
| sync | [optional] auf Operationsabschluss warten |
| release_fence_fd | [optional]im asynchronen Modus als Parameter von imsync() verwendet |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

#### 3.18.2 imquantizeTask

```text
IM_API IM_STATUS imquantizeTask(im_job_handle_t job_handle,
                                const rga_buffer_t src,
                                rga_buffer_t dst,
                                im_nn_t nn_info);
```

Über job_handle Bildquantisierung zum angegebenen Job hinzufügen. Verwendung wie imquantize.

| Parameter | Beschreibung |
| --- | --- |
| job_handle | [erforderlich] Jobhandle |
| src | [erforderlich] Eingangsbild |
| dst | [erforderlich] Ausgabebild |
| nn_info | [erforderlich] rga_nn_t konfiguriert offset und Skalierung getrennt für jeden RGB-Kanal<br>typedef struct rga_nn {<br>int nn_flag;<br>int Skalierung_r;<br>int Skalierung_g;<br>int Skalierung_b;<br>int offset_r;<br>int offset_g;<br>int offset_b;<br>} rga_nn_t; |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

### 3.19 Rasteroperationen (ROP)

#### 3.19.1 imrop

```text
IM_STATUS imrop(const rga_buffer_t src,
                rga_buffer_t dst,
                int rop_code,
                int sync = 1,
                int *release_fence_fd = NULL);
```

Eine ROP-Operation auf zwei Bildern ausführen.

| Parameter | Beschreibung |
| --- | --- |
| src | [erforderlich] Eingangsbild |
| dst | [erforderlich] Ausgabebild |
| rop_code | [erforderlich] ROP-Codemodus<br>IM_ROP_AND : dst = dst AND src;<br>IM_ROP_OR : dst = dst OR src<br>IM_ROP_NOT_DST : dst = NOT dst<br>IM_ROP_NOT_SRC : dst = NOT src<br>IM_ROP_XOR : dst = dst XOR src<br>IM_ROP_NOT_XOR : dst = NOT (dst XOR src) |
| sync | [optional] auf Operationsabschluss warten |
| release_fence_fd | [optional]im asynchronen Modus als Parameter von imsync() verwendet |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

#### 3.19.2 imropTask

```text
IM_API IM_STATUS imropTask(im_job_handle_t job_handle,
                           const rga_buffer_t src,
                           rga_buffer_t dst,
                           int rop_code);
```

Über job_handle ROP-Bildverarbeitung zum angegebenen Job hinzufügen. Verwendung wie imrop.

| Parameter | Beschreibung |
| --- | --- |
| job_handle | [erforderlich] Jobhandle |
| src | [erforderlich] Eingangsbild |
| dst | [erforderlich] Ausgabebild |
| rop_code | [erforderlich] ROP-Codemodus<br>IM_ROP_AND : dst = dst AND src;<br>IM_ROP_OR : dst = dst OR src<br>IM_ROP_NOT_DST : dst = NOT dst<br>IM_ROP_NOT_SRC : dst = NOT src<br>IM_ROP_XOR : dst = dst XOR src<br>IM_ROP_NOT_XOR : dst = NOT (dst XOR src) |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

### 3.20 Farbfüllung und Rahmenzeichnung

#### 3.20.1 imfill

```text
IM_STATUS imfill(rga_buffer_t dst,
                 im_rect rect,
                 int color,
                 int sync = 1,
                 int *release_fence_fd = NULL);
```

Den angegebenen Bereich rect mit Farbe füllen. color gibt RGBA an, von hohen zu niedrigen Bits A, B, G, R; beispielsweise Rot: color = 0x000000ff. Breite und Höhe von rect müssen jeweils mindestens 2 sein.

| Parameter | Beschreibung |
| --- | --- |
| dst | [erforderlich] Zielbild |
| rect | [erforderlich] mit angegebener Farbe zu füllender Bildbereich<br>Breite und Höhe von rect müssen mindestens 2 sein |
| color | [erforderlich] Füllfarbe |
| sync | [optional] auf Operationsabschluss warten |
| release_fence_fd | [optional]im asynchronen Modus als Parameter von imsync() verwendet |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

#### 3.20.2 imfillArray

```text
IM_API IM_STATUS imfillArray(rga_buffer_t dst,
                             im_rect *rect_array,
                             int array_size,
                             uint32_t color,
                             int sync = 1,
                             int *release_fence_fd = NULL);
```

Mehrere Bildbereiche nacheinander mit Farbe füllen. color gibt RGBA an, von hohen zu niedrigen Bits A, B, G, R; beispielsweise Rot: color = 0x000000ff. Breite und Höhe von rect müssen jeweils mindestens 2 sein.

| Parameter | Beschreibung |
| --- | --- |
| dst | [erforderlich] Zielbild |
| rect_array | [erforderlich] array_ptr der mit angegebener Farbe zu füllenden Bereiche<br>Breite und Höhe von rect müssen mindestens 2 sein |
| array_size | [erforderlich] Größe der Bereichsarrays. |
| color | [erforderlich] Füllfarbe |
| sync | [optional] auf Operationsabschluss warten |
| release_fence_fd | [optional]im asynchronen Modus als Parameter von imsync() verwendet |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

#### 3.20.3 imfillTask

```text
IM_API IM_STATUS imfillTask(im_job_handle_t job_handle,
                            rga_buffer_t dst,
                            im_rect rect,
                            uint32_t color);
```

Über job_handle Bildfüllung zum Job hinzufügen. Verwendung wie imfill. Breite und Höhe von rect müssen jeweils mindestens 2 sein.

| Parameter | Beschreibung |
| --- | --- |
| job_handle | [erforderlich] Jobhandle |
| dst | [erforderlich] Zielbild |
| rect | [erforderlich] mit angegebener Farbe zu füllender Bildbereich<br>Breite und Höhe von rect müssen mindestens 2 sein |
| color | [erforderlich] Füllfarbe |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

#### 3.20.4 imfillTaskArray

```text
IM_API IM_STATUS imfillTaskArray(im_job_handle_t job_handle,
                                 rga_buffer_t dst,
                                 im_rect *rect_array,
                                 int array_size,
                                 uint32_t color);
```

Über job_handle Farbfüllung mehrerer Bereiche zum Job hinzufügen. Verwendung wie imfillArray. Breite und Höhe von rect müssen jeweils mindestens 2 sein.

| Parameter | Beschreibung |
| --- | --- |
| job_handle | [erforderlich] Jobhandle |
| dst | [erforderlich] Zielbild |
| rect_array | [erforderlich] array_ptr der mit angegebener Farbe zu füllenden Bereiche<br>Breite und Höhe von rect müssen mindestens 2 sein |
| array_size | [erforderlich] Größe der Bereichsarrays. |
| color | [erforderlich] Füllfarbe |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

#### 3.20.5 imrectangle

```text
IM_API IM_STATUS imrectangle(rga_buffer_t dst,
                             im_rect rect,
                             uint32_t color,
                             int thickness,
                             int sync = 1,
                             int *release_fence_fd = NULL);
```

Mit color einen Rahmen der Stärke thickness um rect zeichnen, das den äußeren Rand angibt. Bei negativem thickness wird ein ausgefülltes Rechteck erzeugt. color gibt RGBA an, von hohen zu niedrigen Bits A, B, G, R; beispielsweise Rot: color = 0x000000ff. Breite und Höhe von rect müssen jeweils mindestens 2 sein.

| Parameter | Beschreibung |
| --- | --- |
| dst | [erforderlich] Zielbild |
| rect | [erforderlich] mit angegebener Farbe zu füllender Bildbereich<br>Breite und Höhe von rect müssen mindestens 2 sein |
| color | [erforderlich] Füllfarbe |
| thickness | [erforderlich] Linienstärke des Rechtecks.<br>Negative Werte wie -1 bedeuten, dass ein ausgefülltes Rechteck gezeichnet wird. |
| sync | [optional] auf Operationsabschluss warten |
| release_fence_fd | [optional]im asynchronen Modus als Parameter von imsync() verwendet |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

#### 3.20.6 imrectangleArray

```text
IM_API IM_STATUS imrectangleArray(rga_buffer_t dst,
                                  im_rect *rect_array,
                                  int array_size,
                                  uint32_t color,
                                  int thickness,
                                  int sync = 1,
                                  int *release_fence_fd = NULL);
```

Nacheinander mit color Rahmen der Stärke thickness um mehrere rect-Bereiche zeichnen, die die äußeren Ränder angeben. Bei negativem thickness werden ausgefüllte Rechtecke erzeugt. color gibt RGBA an, von hohen zu niedrigen Bits A, B, G, R; beispielsweise Rot: color = 0x000000ff. Breite und Höhe von rect müssen jeweils mindestens 2 sein.

| Parameter | Beschreibung |
| --- | --- |
| dst | [erforderlich] Zielbild |
| rect_array | [erforderlich] array_ptr der mit angegebener Farbe zu füllenden Bereiche<br>Breite und Höhe von rect müssen mindestens 2 sein |
| array_size | [erforderlich] Größe der Bereichsarrays. |
| color | [erforderlich] Füllfarbe |
| thickness | [erforderlich] Linienstärke des Rechtecks.<br>Negative Werte wie -1 bedeuten, dass ein ausgefülltes Rechteck gezeichnet wird. |
| sync | [optional] auf Operationsabschluss warten |
| release_fence_fd | [optional]im asynchronen Modus als Parameter von imsync() verwendet |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

#### 3.20.7 imrectangleTask

```text
IM_API IM_STATUS imrectangleTask(im_job_handle_t job_handle,
                                 rga_buffer_t dst,
                                 im_rect rect,
                                 uint32_t color,
                                 int thickness);
```

Über job_handle rechteckige Bildrahmen zum Job hinzufügen. Verwendung wie imrectangle. Breite und Höhe von rect müssen jeweils mindestens 2 sein.

| Parameter | Beschreibung |
| --- | --- |
| job_handle | [erforderlich] Jobhandle |
| dst | [erforderlich] Zielbild |
| rect | [erforderlich] mit angegebener Farbe zu füllender Bildbereich<br>Breite und Höhe von rect müssen mindestens 2 sein |
| color | [erforderlich] Füllfarbe |
| thickness | [erforderlich] Linienstärke des Rechtecks.<br>Negative Werte wie -1 bedeuten, dass ein ausgefülltes Rechteck gezeichnet wird. |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

#### 3.20.8 imrectangleTaskArray

```text
IM_API IM_STATUS imrectangleTaskArray(im_job_handle_t job_handle,
                                      rga_buffer_t dst,
                                      im_rect *rect_array,
                                      int array_size,
                                      uint32_t color,
                                      int thickness);
```

Über job_handle mehrere rechteckige Bildrahmen zum Job hinzufügen. Verwendung wie imrectangleArray. Breite und Höhe von rect müssen jeweils mindestens 2 sein.

| Parameter | Beschreibung |
| --- | --- |
| job_handle | [erforderlich] Jobhandle |
| dst | [erforderlich] Zielbild |
| rect_array | [erforderlich] array_ptr der mit angegebener Farbe zu füllenden Bereiche<br>Breite und Höhe von rect müssen mindestens 2 sein |
| array_size | [erforderlich] Größe der Bereichsarrays. |
| color | [erforderlich] Füllfarbe |
| thickness | [erforderlich] Linienstärke des Rechtecks.<br>Negative Werte wie -1 bedeuten, dass ein ausgefülltes Rechteck gezeichnet wird. |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

#### 3.20.9 immakeBorder

```text
IM_API IM_STATUS immakeBorder(rga_buffer_t src,
                              rga_buffer_t dst,
                              int top,
                              int bottom,
                              int left,
                              int right,
                              int border_type,
                              int value = 0,
                              int sync = 1,
                              int acquir_fence_fd = -1,
                              int *release_fence_fd = NULL);
```

Dem Eingangsbild Ränder mit top/bottom/left/right Pixeln hinzufügen und das Ergebnis in den Zielpuffer schreiben. Jeder Wert top/bottom/left/right muss mindestens 2 betragen.

| Parameter | Beschreibung |
| --- | --- |
| src | [erforderlich] Eingangsquellbild |
| dst | [erforderlich] Ausgabezielbild |
| top | [erforderlich] Anzahl oberer Pixel |
| bottom | [erforderlich] Anzahl unterer Pixel |
| left | [erforderlich] Anzahl linker Pixel |
| right | [erforderlich] Anzahl rechter Pixel |
| border_type | [erforderlich] Rahmentyp<br>IM_BORDER_CONSTANT // iiiiii abcdefgh iiiiiii mit angegebenem Wert 'i'<br>IM_BORDER_REFLECT //fedcba abcdefgh hgfedcb<br>IM_BORDER_WRAP //cdefgh abcdefgh abcdefg |
| value | [optional] Pixelfüllwert des Rahmens |
| sync | [optional] auf Operationsabschluss warten |
| acquire_fence_fd | [erforderlich] im asynchronen Modus den Job nach Warten auf das acquire_fence-Signal ausführen |
| release_fence_fd | [erforderlich] im asynchronen Modus als Parameter von imsync() verwendet |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

### 3.21 Bildmosaik

#### 3.21.1 immosaic

```text
IM_API IM_STATUS immosaic(const rga_buffer_t image,
                          im_rect rect,
                          int mosaic_mode,
                          int sync = 1,
                          int *release_fence_fd = NULL);
```

Den angegebenen Bildbereich mit einer Mosaikmaske abdecken.

| Parameter | Beschreibung |
| --- | --- |
| image | [erforderlich] Zielbild |
| rect | [erforderlich] Bildbereich für Mosaik |
| Mosaik_mode | [erforderlich] Mosaikmodus einstellen<br>IM_MOSAIC_8<br>IM_MOSAIC_16<br>IM_MOSAIC_32<br>IM_MOSAIC_64<br>IM_MOSAIC_128 |
| sync | [optional] auf Operationsabschluss warten |
| release_fence_fd | [optional]im asynchronen Modus als Parameter von imsync() verwendet |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

#### 3.21.2 immosaicArray

```text
IM_API IM_STATUS immosaicArray(const rga_buffer_t image,
                               im_rect *rect_array,
                               int array_size,
                               int mosaic_mode,
                               int sync = 1,
                               int *release_fence_fd = NULL);
```

Mehrere Bildbereiche nacheinander mit Mosaikmasken abdecken.

| Parameter | Beschreibung |
| --- | --- |
| image | [erforderlich] Zielbild |
| rect_array | [erforderlich] array_ptr der Mosaikbereiche |
| array_size | [erforderlich] Größe der Bereichsarrays. |
| Mosaik_mode | [erforderlich] Mosaikmodus einstellen<br>IM_MOSAIC_8<br>IM_MOSAIC_16<br>IM_MOSAIC_32<br>IM_MOSAIC_64<br>IM_MOSAIC_128 |
| sync | [optional] auf Operationsabschluss warten |
| release_fence_fd | [optional]im asynchronen Modus als Parameter von imsync() verwendet |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

#### 3.21.3 immosaicTask

```text
IM_API IM_STATUS immosaicTask(im_job_handle_t job_handle,
                              const rga_buffer_t image,
                              im_rect rect,
                              int mosaic_mode);
```

Über job_handle Mosaikmaskierung zum angegebenen Job hinzufügen. Verwendung wie immosaic.

| Parameter | Beschreibung |
| --- | --- |
| job_handle | [erforderlich] Jobhandle |
| image | [erforderlich] Zielbild |
| rect | [erforderlich] Bildbereich für Mosaik |
| Mosaik_mode | [erforderlich] Mosaikmodus einstellen<br>IM_MOSAIC_8<br>IM_MOSAIC_16<br>IM_MOSAIC_32<br>IM_MOSAIC_64<br>IM_MOSAIC_128 |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

#### 3.21.4 immosaicTaskArray

```text
IM_API IM_STATUS immosaicTaskArray(im_job_handle_t job_handle,
                                   const rga_buffer_t image,
                                   im_rect *rect_array,
                                   int array_size,
                                   int mosaic_mode);
```

Über job_handle Mosaikmaskierung mehrerer Bildbereiche zum angegebenen Job hinzufügen. Verwendung wie immosaicArray.

| Parameter | Beschreibung |
| --- | --- |
| job_handle | [erforderlich] Jobhandle |
| image | [erforderlich] Zielbild |
| rect_array | [erforderlich] array_ptr der Mosaikbereiche |
| array_size | [erforderlich] Größe der Bereichsarrays. |
| Mosaik_mode | [erforderlich] Mosaikmodus einstellen<br>IM_MOSAIC_8<br>IM_MOSAIC_16<br>IM_MOSAIC_32<br>IM_MOSAIC_64<br>IM_MOSAIC_128 |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

### 3.22 Bildverarbeitung

#### 3.22.1 improcess

```text
IM_STATUS improcess(rga_buffer_t src,
                    rga_buffer_t dst,
                    rga_buffer_t pat,
                    im_rect srect,
                    im_rect drect,
                    im_rect prect,
                    int acquire_fence_fd,
                    int *release_fence_fd,
                    im_opt_t *opt,
                    int usage);
```

Funktion für kombinierte RGA-Bildoperationen. Die anderen APIs bauen darauf auf; improcess ermöglicht komplexere Kombinationen. Bildoperationen werden über usage konfiguriert, das wie folgt definiert ist:

```text
typedef enum {
    /* Rotation */
    IM_HAL_TRANSFORM_ROT_90     = 1 << 0,
    IM_HAL_TRANSFORM_ROT_180    = 1 << 1,
    IM_HAL_TRANSFORM_ROT_270    = 1 << 2,
    IM_HAL_TRANSFORM_FLIP_H     = 1 << 3,
    IM_HAL_TRANSFORM_FLIP_V     = 1 << 4,
    IM_HAL_TRANSFORM_FLIP_H_V   = 1 << 5,
    IM_HAL_TRANSFORM_MASK       = 0x3f,
    /*
     * Blend
     * Additional blend usage, can be used with both source and target configs.
     * If none of the below is set, the default "SRC over DST" is applied.
     */
    IM_ALPHA_BLEND_SRC_OVER     = 1 << 6,     /* Default, Porter-Duff "SRC over DST" */
    IM_ALPHA_BLEND_SRC          = 1 << 7,     /* Porter-Duff "SRC" */
    IM_ALPHA_BLEND_DST          = 1 << 8,     /* Porter-Duff "DST" */
    IM_ALPHA_BLEND_SRC_IN       = 1 << 9,     /* Porter-Duff "SRC in DST" */
    IM_ALPHA_BLEND_DST_IN       = 1 << 10,    /* Porter-Duff "DST in SRC" */
    IM_ALPHA_BLEND_SRC_OUT      = 1 << 11,    /* Porter-Duff "SRC out DST" */
    IM_ALPHA_BLEND_DST_OUT      = 1 << 12,    /* Porter-Duff "DST out SRC" */
    IM_ALPHA_BLEND_DST_OVER     = 1 << 13,    /* Porter-Duff "DST over SRC" */
    IM_ALPHA_BLEND_SRC_ATOP     = 1 << 14,    /* Porter-Duff "SRC ATOP" */
    IM_ALPHA_BLEND_DST_ATOP     = 1 << 15,    /* Porter-Duff "DST ATOP" */
    IM_ALPHA_BLEND_XOR          = 1 << 16,    /* Xor */
    IM_ALPHA_BLEND_MASK         = 0x1ffc0,

    IM_ALPHA_COLORKEY_NORMAL    = 1 << 17,
    IM_ALPHA_COLORKEY_INVERTED  = 1 << 18,
    IM_ALPHA_COLORKEY_MASK      = 0x60000,

    IM_SYNC                     = 1 << 19,
    IM_ASYNC                    = 1 << 26,
    IM_CROP                     = 1 << 20,    /* Unused */
    IM_COLOR_FILL               = 1 << 21,
    IM_COLOR_PALETTE            = 1 << 22,
    IM_NN_QUANTIZE              = 1 << 23,
    IM_ROP                      = 1 << 24,
    IM_ALPHA_BLEND_PRE_MUL      = 1 << 25,
} IM_USAGE;
```

| Parameter | Beschreibung |
| --- | --- |
| src | [erforderlich] Eingangsbild A |
| dst | [erforderlich] Ausgabebild |
| pat | [erforderlich] Eingangsbild B |
| srect | [erforderlich] src-Zuschnittbereich |
| drect | [erforderlich] dst-Zuschnittbereich |
| prect | [erforderlich] pat-Zuschnittbereich |
| acquire_fence_fd | [erforderlich] im asynchronen Modus den Job nach Warten auf das acquire_fence-Signal ausführen |
| release_fence_fd | [erforderlich] im asynchronen Modus als Parameter von imsync() verwendet |
| opt | [erforderlich] Operationsoptionen<br>typedef struct im_opt {<br>int color;<br>im_colorkey_range colorkey_range;<br>im_nn_t nn;<br>int rop_code;<br>int priority;<br>int core;<br>} im_opt_t; |
| usage | [erforderlich] Bildoperationsverwendung |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

#### 3.22.2 improcessTask

```text
IM_API IM_STATUS improcessTask(im_job_handle_t job_handle,
                               rga_buffer_t src,
                               rga_buffer_t dst,
                               rga_buffer_t pat,
                               im_rect srect,
                               im_rect drect,
                               im_rect prect,
                               im_opt_t *opt_ptr,
                               int usage);
```

Über job_handle kombinierte Bildverarbeitung zum angegebenen Job hinzufügen. Verwendung wie improcess.

| Parameter | Beschreibung |
| --- | --- |
| job_handle | [erforderlich] Jobhandle |
| src | [erforderlich] Eingangsbild A |
| dst | [erforderlich] Ausgabebild |
| pat | [erforderlich] Eingangsbild B |
| srect | [erforderlich] src-Zuschnittbereich |
| drect | [erforderlich] dst-Zuschnittbereich |
| prect | [erforderlich] pat-Zuschnittbereich |
| acquire_fence_fd | [erforderlich] im asynchronen Modus den Job nach Warten auf das acquire_fence-Signal ausführen |
| release_fence_fd | [erforderlich] im asynchronen Modus als Parameter von imsync() verwendet |
| opt | [erforderlich] Operationsoptionen<br>typedef struct im_opt {<br>int color;<br>im_colorkey_range colorkey_range;<br>im_nn_t nn;<br>int rop_code;<br>int priority;<br>int core;<br>} im_opt_t; |
| usage | [erforderlich] Bildoperationsverwendung |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

### 3.23 Parameterprüfung

#### 3.23.1 imcheck

```text
IM_API IM_STATUS imcheck(const rga_buffer_t src, const rga_buffer_t dst,
                         const im_rect src_rect, const im_rect dst_rect,
                         const int mode_usage);
IM_API IM_STATUS imcheck_composite(const rga_buffer_t src, const rga_buffer_t dst, const rga_buffer_t pat,
                                   const im_rect src_rect, const im_rect dst_rect, const im_rect pat_rect,
                                   const int mode_usage);
```

Nach der Konfiguration der RGA-Jobparameter prüft diese Schnittstelle deren Gültigkeit und Unterstützung durch die aktuelle Hardware.

Diese Schnittstelle nur während Entwicklung und Fehlersuche verwenden, um Leistungseinbußen durch wiederholte Prüfungen zu vermeiden.

| Parameter | Beschreibung |
| --- | --- |
| src | [erforderlich] Eingangsbild A |
| dst | [erforderlich] Ausgabebild |
| pat | [optional] Eingangsbild B |
| srect | [erforderlich] src-Zuschnittbereich |
| drect | [erforderlich] dst-Zuschnittbereich |
| prect | [optional] pat-Zuschnittbereich |
| usage | [optional] Bildoperationsverwendung |

Gibt bei Erfolg IM_STATUS_NOERROR zurück, andernfalls einen negativen Fehlercode.

### 3.24 Synchronisierung

#### 3.24.1 imsync

```text
IM_STATUS imsync(int fence_fd);
```

Im asynchronen Modus diese Schnittstelle mit dem zurückgegebenen release_fence_fd aufrufen, um auf den Abschluss zu warten. sync = 0 aktiviert bei anderen APIs asynchrone Aufrufe, ähnlich OpenGL glFlush. Ein anschließendes imsync entspricht der Wirkung von glFinish.

| Parameter | Beschreibung |
| --- | --- |
| fence_fd | [erforderlich] fence_fd zum Warten |

Gibt bei Erfolg IM_STATUS_SUCCESS zurück, andernfalls einen negativen Fehlercode.

### 3.25 Threadkontext-Konfiguration

#### 3.25.1 imconfig

```text
IM_STATUS  imconfig(IM_CONFIG_NAME name, uint64_t value);
```

Den Kontext des aktuellen Threads über verschiedene Konfigurationsnamen einstellen. Er liefert die Thread-Standardwerte und hat niedrigere Priorität als Schnittstellenargumente. Ohne explizite Parameterkonfiguration gelten die Kontextwerte; andernfalls hat für diesen Aufruf das übergebene Argument Vorrang.

| Parameter | Beschreibung |
| --- | --- |
| name | [erforderlich] Kontextkonfigurationsname:<br>IM_CONFIG_SCHEDULER_CORE —— Taskverarbeitungskern wählen<br>IM_CONFIG_PRIORITY —— Taskpriorität<br>IM_CHECK_CONFIG —— Validierung aktivieren |
| value | [erforderlich] Konfigurationswert<br>IM_CONFIG_SCHEDULER_CORE :<br>IM_SCHEDULER_RGA3_CORE0<br>IM_SCHEDULER_RGA3_CORE1<br>IM_SCHEDULER_RGA2_CORE0<br>IM_SCHEDULER_RGA3_DEFAULT<br>IM_SCHEDULER_RGA2_DEFAULT<br>IM_CONFIG_PRIORITY:<br>0 ~ 6<br>IM_CHECK_CONFIG:<br>TRUE<br>FALSE |

priority und core sind Einstellungen mit sehr weitreichenden Rechten. Fehlbedienung kann Systemabstürze oder Deadlocks verursachen. Nur zur Entwicklung und Fehlersuche verwenden; von einer Konfiguration im Produktbetrieb wird dringend abgeraten. Bei Erfolg wird IM_STATUS_SUCCESS zurückgegeben, sonst ein negativer Fehlercode.

## 4. Datenstrukturen

Dieses Kapitel beschreibt die Datenstrukturen der Anwendungsschnittstellen im Detail.

### 4.1 Übersicht

| Datenstruktur | Beschreibung |
| --- | --- |
| rga_buffer_t | Bildpufferinformationen |
| im_rect | Tatsächlicher Bildoperationsbereich |
| im_opt_t | Bildoperationsoptionen |
| im_job_handle_t | RGA-Jobhandle |
| rga_buffer_handle_t | Bildpufferhandle des RGA-Treibers |
| im_handle_param_t | Eigenschaften des zu importierenden Bildpuffers |
| im_context_t | Standardkontext des aktuellen Threads |
| im_nn_t | NN-Vorverarbeitungsparameter |
| im_colorkey_range | Farbschlüsselbereich |

### 4.2 Detailbeschreibungen

#### 4.2.1 rga_buffer_t

Bildpufferinformationen eines Kanals.

Pfad: `im2d_api/im2d_type.h`. Definition:

```text
typedef struct {
    void* vir_addr;                     /* virtual address */
    void* phy_addr;                     /* physical address */
    int fd;                             /* shared fd */
    rga_buffer_handle_t handle;         /* buffer handle */

    int width;                          /* width */
    int height;                         /* height */
    int wstride;                        /* wstride */
    int hstride;                        /* hstride */
    int format;                         /* format */

    int color_space_mode;               /* color_space_mode */
    int global_alpha;                   /* global_alpha */
    int rd_mode;
} rga_buffer_t;
```

| Memberparameter | Beschreibung |
| --- | --- |
| vir_addr | Virtuelle Bildpufferadresse. |
| phy_addr | Zusammenhängende physische Bildpufferadresse. |
| fd | DMA-Bildpuffer-Dateideskriptor. |
| handle | Speicherhandle des in RGA importierten Bildpuffers. |
| width | Breite des tatsächlichen Operationsbereichs in Pixeln. |
| height | Höhe des tatsächlichen Operationsbereichs in Pixeln. |
| wstride | Bildbreiten-Stride in Pixeln. |
| hstride | Bildhöhen-Stride in Pixeln. |
| format | Bildformat. |
| color_space_mode | Bildfarbraum. |
| global_alpha | Globales Alpha. |
| rd_mode | Lesemodus des aktuellen Kanals. |

Hinweise: Zur Bildpufferbeschreibung nur eines von vir_addr, phy_addr, fd oder handle wählen. Bei mehreren Zuweisungen wird genau eines nach Standardpriorität verwendet: handle &gt; phy_addr &gt; fd &gt; vir_addr.

#### 4.2.2 im_rect

Tatsächlicher Operationsbereich eines Kanals.

Pfad: `im2d_api/im2d_type.h`. Definition:

```text
typedef struct {
    int x;        /* upper-left x */
    int y;        /* upper-left y */
    int width;    /* width */
    int height;   /* height */
} im_rect;
```

| Memberparameter | Beschreibung |
| --- | --- |
| x | Anfangskoordinate x des tatsächlichen Operationsbereichs in Pixeln. |
| y | Anfangskoordinate y des tatsächlichen Operationsbereichs in Pixeln. |
| width | Breite des tatsächlichen Operationsbereichs in Pixeln. |
| height | Höhe des tatsächlichen Operationsbereichs in Pixeln. |

Der Operationsbereich darf die Bildgröße nicht überschreiten: (x + width) &lt;= wstride und (y + height) &lt;= hstride.

#### 4.2.3 im_opt_t

Bildoperationsoptionen des aktuellen Tasks.

Pfad: `im2d_api/im2d_type.h`. Definition:

```text
typedef struct im_opt {
    im_api_version_t version DEFAULT_INITIALIZER(RGA_CURRENT_API_HEADER_VERSION);
    int color;                          /* color, used by color fill */
    im_colorkey_range colorkey_range;   /* range value of color key */
    im_nn_t nn;
    int rop_code;
    int priority;
    int core;
    int mosaic_mode;
    im_osd_t osd_config;
    im_intr_config_t intr_config;
    char reserve[128];
} im_opt_t;
```

| Memberparameter | Beschreibung |
| --- | --- |
| version | Aktuelle Headerversion |
| color | Bildfüllfarbe. |
| colorkey_range | Farbschlüsselbereichskonfiguration. |
| nn | NN-Vorverarbeitung (Quantisierung). |
| rop_code | ROP-Opcode-Konfiguration. |
| priority | Priorität des aktuellen Tasks. |
| core | Hardwarekern des aktuellen Tasks. |
| Mosaik_mode | Mosaikmodus. |
| osd_config | Invertierungs-/Statistikkonfiguration der OSD-Textüberlagerung. |
| intr_config | Frühinterruptmodus. |
| reserve | Reserviert. |

priority und core sind Einstellungen mit sehr weitreichenden Rechten. Fehlbedienung kann Systemabstürze oder Deadlocks verursachen. Nur zur Entwicklung und Fehlersuche verwenden; von einer Konfiguration im Produktbetrieb wird dringend abgeraten.

#### 4.2.4 im_job_handle_t

RGA-Jobhandle zur Identifikation des aktuell konfigurierten Jobs.

Pfad: `im2d_api/im2d_type.h`. Definition:

```text
typedef uint32_t im_job_handle_t;
```

Schlägt die Konfiguration fehl, das aktuelle Jobhandle mit imcancelJob freigeben, um Speicherlecks zu vermeiden.

#### 4.2.5 rga_buffer_handle_t

Bildpufferhandle des RGA-Treibers.

Pfad: `im2d_api/im2d_type.h`. Definition:

```text
typedef int rga_buffer_handle_t;
```

Nach der Speichernutzung mit releasebuffer_handle freigeben, um Speicherlecks zu vermeiden.

#### 4.2.6 im_handle_param_t

Beschreibungsparameter des zu importierenden Bildpuffers.

Pfad: `im2d_api/im2d_type.h`. Definition:

```text
typedef struct im_handle_param {
    uint32_t width;
    uint32_t height;
    uint32_t format;
} im_handle_param_t;
```

| Memberparameter | Beschreibung |
| --- | --- |
| width_stride | Horizontaler Stride des importierten Puffers in Pixeln. |
| height_stride | Vertikaler Stride des importierten Puffers in Pixeln. |
| format | Format des zu importierenden Bildpuffers. |

Diese Struktur beschreibt die Größe des zugewiesenen Puffers. Ist die tatsächliche Zuweisung kleiner als konfiguriert, schlägt importbuffer_T fehl.

#### 4.2.7 im_nn_t

Parameter der NN-Vorverarbeitung (Quantisierung).

Pfad: `im2d_api/im2d_type.h`. Definition:

```text
typedef struct im_nn {
    int scale_r;                /* scaling factor on R channal */
    int scale_g;                /* scaling factor on G channal */
    int scale_b;                /* scaling factor on B channal */
    int offset_r;               /* offset on R channal */
    int offset_g;               /* offset on G channal */
    int offset_b;               /* offset on B channal */
} im_nn_t;
```

| Memberparameter | Beschreibung |
| --- | --- |
| scale_r | Skalierungsfaktor des roten Kanals. |
| scale_g | Skalierungsfaktor des grünen Kanals. |
| scale_b | Skalierungsfaktor des blauen Kanals. |
| offset_r | Offset des roten Kanals. |
| offset_g | Offset des grünen Kanals. |
| offset_b | Offset des blauen Kanals. |

Hinweise: keine.

#### 4.2.8 im_colorkey_range

Farbschlüsselbereich.

Pfad: `im2d_api/im2d_type.h`. Definition:

```text
typedef struct {
    int max;                    /* The Maximum value of the color key */
    int min;                    /* The minimum value of the color key */
} im_colorkey_range;
```

| Memberparameter | Beschreibung |
| --- | --- |
| max | Maximaler Farbschlüsselwert. |
| min | Minimaler Farbschlüsselwert. |

Hinweise: keine.

#### 4.2.9 im_osd_block_t

OSD-Textblock-Beschreibungskonfiguration.

Pfad: `im2d_api/im2d_type.h`. Definition:

```text
typedef struct im_osd_block {
    int width_mode;                 // normal or different
                                    //   IM_OSD_BLOCK_MODE_NORMAL
                                    //   IM_OSD_BLOCK_MODE_DIFFERENT
    union {
        int width;                  // normal_mode block width
        int width_index;            // different_mode block width index in RAM
    };

    int block_count;                // block count

    int background_config;          // background config is bright or dark
                                    //   IM_OSD_BACKGROUND_DEFAULT_BRIGHT
                                    //   IM_OSD_BACKGROUND_DEFAULT_DARK

    int direction;                  // osd block direction
                                    //   IM_OSD_MODE_HORIZONTAL
                                    //   IM_OSD_MODE_VERTICAL

    int color_mode;                 // using src1 color or config color
                                    //   IM_OSD_COLOR_PIXEL
                                    //   IM_OSD_COLOR_EXTERNAL
    im_color_t normal_color;        // config color: normal
    im_color_t invert_color;        // config color: invert
} im_osd_block_t;
```

| Memberparameter | Beschreibung |
| --- | --- |
| width_mode | Blockbreitenmodus:<br>Gleiche Breiten: IM_OSD_BLOCK_MODE_NORMAL.<br>Unterschiedliche: IM_OSD_BLOCK_MODE_DIFFERENT. |
| width/width_index | width: gibt im Modus gleicher Blockbreiten die OSD-Blockbreite des aktuellen Tasks an.<br>width_index: bezeichnet im Modus unterschiedlicher Blockbreiten den Index der verwendeten Breitentabelle im internen RAM. |
| block_count | Anzahl Textblöcke |
| background_config | Texthintergrundhelligkeit:<br>Schwarz auf Weiß: IM_OSD_BACKGROUND_DEFAULT_BRIGHT.<br>Weiß auf Schwarz: IM_OSD_BACKGROUND_DEFAULT_DARK. |
| direction | OSD-Richtung:<br>Vertikal: IM_OSD_MODE_VERTICAL.<br>Horizontal: IM_OSD_MODE_HORIZONTAL. |
| color_mode | OSD-Blockfarbmodus:<br>Pixelfarbe: IM_OSD_COLOR_PIXEL.<br>Externe Farbe: IM_OSD_COLOR_EXTERNAL. |
| normal_color | Extern vorgegebene Textblockfarbe im normalen, nicht invertierten Zustand. |
| invert_color | Extern vorgegebene Textblockfarbe bei Invertierung. |

Hinweise: keine.

#### 4.2.10 im_osd_invert_factor_t

Konfiguration der OSD-Farbinvertierungsformel.

Pfad: `im2d_api/im2d_type.h`. Definition:

```text
typedef struct im_osd_invert_factor {
    uint8_t alpha_max;
    uint8_t alpha_min;
    uint8_t yg_max;
    uint8_t yg_min;
    uint8_t crb_max;
    uint8_t crb_min;
} im_osd_invert_factor_t;
```

Formel: `MAX(channel_min_factor, channel_max_factor - channel_value)`. Hinweise: keine.

#### 4.2.11 im_osd_invert_t

OSD-Farbinvertierungskonfiguration.

Pfad: `im2d_api/im2d_type.h`. Definition:

```text
typedef struct im_osd_invert {
    int invert_channel;         // invert channel config:
                                //   IM_OSD_INVERT_CHANNEL_NONE
                                //   IM_OSD_INVERT_CHANNEL_Y_G
                                //   IM_OSD_INVERT_CHANNEL_C_RB
                                //   IM_OSD_INVERT_CHANNEL_ALPHA
                                //   IM_OSD_INVERT_CHANNEL_COLOR
                                //   IM_OSD_INVERT_CHANNEL_BOTH
    int flags_mode;             // use external or inertnal RAM invert flags
                                //   IM_OSD_FLAGS_EXTERNAL
                                //   IM_OSD_FLAGS_INTERNAL
    int flags_index;            // flags index when using internal RAM invert flags

    uint64_t invert_flags;      // external invert flags
    uint64_t current_flags;     // current flags

    int invert_mode;            // invert use swap or factor
                                //   IM_OSD_INVERT_USE_FACTOR
                                //   IM_OSD_INVERT_USE_SWAP
    im_osd_invert_factor_t factor;

    int threash;
} im_osd_invert_t;
```

| Memberparameter | Beschreibung |
| --- | --- |
| invert_channel | Invertierte Kanäle:<br>Standardmäßig keiner: IM_OSD_INVERT_CHANNEL_NONE.<br>Y/G: IM_OSD_INVERT_CHANNEL_Y_G.<br>C(UV)/RB: IM_OSD_INVERT_CHANNEL_C_RB.<br>Alpha: IM_OSD_INVERT_CHANNEL_ALPHA.<br>Farbe: IM_OSD_INVERT_CHANNEL_COLOR, also (IM_OSD_INVERT_CHANNEL_Y_G &#124; IM_OSD_INVERT_CHANNEL_C_RB).<br>Alle: IM_OSD_INVERT_CHANNEL_BOTH, also (IM_OSD_INVERT_CHANNEL_COLOR &#124; IM_OSD_INVERT_CHANNEL_ALPHA). |
| flags_mode | Invertierungssteuerung (Zuordnung der Quelle):<br>Intern: IM_OSD_FLAGS_EXTERNAL, mit im internen RAM ermittelten Flags.<br>Extern: IM_OSD_FLAGS_INTERNAL, mit externer Vorgabe. |
| flags_index | Index der aktuell verwendeten Invertierungssteuerflag-Tabelle im internen RAM. |
| invert_flags | Extern vorgegebene 64-Bit-Invertierungstabelle. |
| current_flags | Vom aktuellen Task ermittelte 64-Bit-Invertierungstabelle; nach Taskabschluss lesen. |
| invert_mode | Invertierungsmodus:<br>Eigene Formel: IM_OSD_INVERT_USE_FACTOR.<br>Standard: IM_OSD_INVERT_USE_SWAP; U und V bei YUV bzw. R und B bei RGB vertauschen. |
| factor | Farbinvertierungsformel. |
| threash | Invertierungsschwelle. |

Hinweise: keine.

#### 4.2.12 im_osd_bpp2_t

Konfiguration der OSD-BPP2-zu-RGB-Formatabbildung.

Pfad: `im2d_api/im2d_type.h`. Definition:

```text
typedef struct im_osd_bpp2 {
    uint8_t  ac_swap;       // ac swap flag
                            // 0: CA
                            // 1: AC
    uint8_t  endian_swap;   // rgba2bpp endian swap
                            // 0: Big endian
                            // 1: Little endian
    im_color_t color0;
    im_color_t color1;
} im_osd_bpp2_t;
```

| Memberparameter | Beschreibung |
| --- | --- |
| ac_swap | AC-Anordnungsmodus. |
| endian_swap | Byte-Reihenfolge. |
| color0 | Zugeordnete Farbe für color = 0. |
| color1 | Zugeordnete Farbe für color = 1. |

Hinweise: keine.

#### 4.2.13 im_osd_t

OSD-Funktionskonfiguration.

Pfad: `im2d_api/im2d_type.h`. Definition:

```text
typedef struct im_osd {

  int osd_mode;                 // osd mode: statistics or auto_invert
  im_osd_block_t block_parm;    // osd block info config
  im_osd_invert_t invert_config;
  im_osd_bpp2_t bpp2_info;
} im_osd_t;
```

| Memberparameter | Beschreibung |
| --- | --- |
| osd_mode | OSD-Modus:<br>Statistik: IM_OSD_MODE_STATISTICS.<br>Invertierung: IM_OSD_MODE_AUTO_INVERT. |
| block_parm | OSD-Blockparameter. |
| invert_config | Farbinvertierungskonfiguration. |
| bpp2_info | bpp2-rgb-Formatkonfiguration. |

Hinweise: keine.

## 5. Testfälle und Fehlersuche

Das Ausführen des Demos und die Analyse seines Quellcodes erleichtern das schnelle Verständnis und die Nutzung der oben beschriebenen Schnittstellen.

### 5.1 Testdateien

Die binären Ein-/Ausgabedateien vorab vorbereiten. Die RGBA8888-Quellbilder unter /sample/sample_file können direkt verwendet werden. Auf Android-Geräten die Quellen unter /data/, auf Linux-Geräten unter /usr/data ablegen. Dateinamensregeln:

```text
in%dw%d-h%d-%s.bin
out%dw%d-h%d-%s.bin

⽰例：
1280×720 RGBA8888的输⼊图像： in0w1280-h720-rgba8888.bin
1280×720 RGBA8888的输出图像： out0w1280-h720-rgba8888.bin
```

Parameterbedeutung: Eingabedateien verwenden in, Ausgabedateien out. Das erste %d ist der Dateiindex, normalerweise 0, zur Unterscheidung gleicher Formate und Abmessungen. Das zweite %d ist die Breite, normalerweise die virtuelle Breite, das dritte die Höhe, normalerweise die virtuelle Höhe. Das vierte %s ist der Formatname. Häufige vordefinierte Testformate folgen; weitere Formatstrings stehen in rgaUtils.cpp.

| format(Android) | format(Linux) | name |
| --- | --- | --- |
| HAL_PIXEL_FORMAT_RGB_565 | RK_FORMAT_RGB_565 | "rgb565" |
| HAL_PIXEL_FORMAT_RGB_888 | RK_FORMAT_RGB_888 | "rgb888" |
| HAL_PIXEL_FORMAT_RGBA_8888 | RK_FORMAT_RGBA_8888 | "rgba8888" |
| HAL_PIXEL_FORMAT_RGBX_8888 | RK_FORMAT_RGBX_8888 | "rgbx8888" |
| HAL_PIXEL_FORMAT_BGRA_8888 | RK_FORMAT_BGRA_8888 | "bgra8888" |
| HAL_PIXEL_FORMAT_YCrCb_420_SP | RK_FORMAT_YCrCb_420_SP | "crcb420sp" |
| HAL_PIXEL_FORMAT_YCrCb_NV12 | RK_FORMAT_YCbCr_420_SP | "nv12" |
| HAL_PIXEL_FORMAT_YCrCb_NV12_VIDEO | / | "nv12" |
| HAL_PIXEL_FORMAT_YCrCb_NV12_10 | RK_FORMAT_YCbCr_420_SP_10B | "nv12_10" |

Die Standardeingabe ist 1280x720 RGBA8888. in0w1280-h720-rgba8888.bin unter /data oder /usr/data vorbereiten. Für Komposition wird dort zusätzlich in1w1280-h720-rgba8888.bin benötigt.

### 5.2 Fehlersuche

Das Demo gibt folgende Logs aus (Bildkopiebeispiel). Android-Log:

```text
# rgaImDemo --copy

librga:RGA_GET_VERSION:3.02,3.020000                    //RGA版本
ctx=0x7ba35c1520,ctx->rgaFd=3                           //RGA上下⽂
Start selecting mode
im2d copy ..                                            //RGA运⾏模式
GraphicBuffer check ok
GraphicBuffer check ok
lock buffer ok
open file ok                                            //src⽂件的状态，如果/data/⽬录下没有对应⽂件这⾥会报错
unlock buffer ok
lock buffer ok
unlock buffer ok
copying .... successfully                               //标志运⾏成功
open /data/out0w1280-h720-rgba8888.bin and write ok     //输出⽂件名以及⽬录
```

Linux-Log:

```text
# rgaImDemo --copy

librga:RGA_GET_VERSION:3.02,3.020000                    //RGA版本
ctx=0x2b070,ctx->rgaFd=3                                //RGA上下⽂
Rga built version:version:1.00
Start selecting mode
im2d copy ..                                            //RGA运⾏模式
open file                                               //src⽂件的状态，如果/usr/data/⽬录下没有对应⽂件这⾥会报错
copying .... Run successfully                           //标志运⾏成功
open /usr/data/out0w1280-h720-rgba8888.bin and write ok //输出⽂件名以及⽬录
```

Für ausführlichere RGA-Logs unter Android die Konfigurationsausgabe über vendor.rga.log aktivieren (sys.rga.log unter Android 8 und älter):

```text
setprop vendor.rga.log 1        打开RGA log打印
logcat -s librga                开启并过滤log打印
setprop vendor.rga.log 0        关闭RGA log打印
```

Unter Linux __DEBUG in core/NormalRgaContext.h auf 1 setzen und neu kompilieren.

```text
#ifdef LINUX

-#define __DEBUG 0
+#define __DEBUG 1
```

Typische Logs folgen. Sie können zur Analyse durch zuständige RK-Ingenieure in RedMine hochgeladen werden. Android-Log:

```text
D librga  : <<<<-------- print rgaLog -------->>>>
D librga  : src->hnd = 0x0 , dst->hnd = 0x0
D librga  : srcFd = 11 , phyAddr = 0x0 , virAddr = 0x0
D librga  : dstFd = 15 , phyAddr = 0x0 , virAddr = 0x0
D librga  : srcBuf = 0x0 , dstBuf = 0x0
D librga  : blend = 0 , perpixelAlpha = 1
D librga  : scaleMode = 0 , stretch = 0;
D librga  : rgaVersion = 3.020000  , ditherEn =0
D librga  : srcMmuFlag = 1 , dstMmuFlag = 1 , rotateMode = 0
D librga  : <<<<-------- rgaReg -------->>>>
D librga  : render_mode=0 rotate_mode=0
D librga  : src:[b,0,e1000],x-y[0,0],w-h[1280,720],vw-vh[1280,720],f=0
D librga  : dst:[f,0,e1000],x-y[0,0],w-h[1280,720],vw-vh[1280,720],f=0
D librga  : pat:[0,0,0],x-y[0,0],w-h[0,0],vw-vh[0,0],f=0
D librga  : ROP:[0,0,0],LUT[0]
D librga  : color:[0,0,0,0,0]
D librga  : MMU:[1,0,80000521]
D librga  : mode[0,0,0,0]
```

Linux-Log:

```text
render_mode=0 rotate_mode=0
src:[0,a681a008,a68fb008],x-y[0,0],w-h[1280,720],vw-vh[1280,720],f=0
dst:[0,a6495008,a6576008],x-y[0,0],w-h[1280,720],vw-vh[1280,720],f=0
pat:[0,0,0],x-y[0,0],w-h[0,0],vw-vh[0,0],f=0
ROP:[0,0,0],LUT[0]
color:[0,0,0,0,0]
MMU:[1,0,80000521]
mode[0,0,0,0,0]
gr_color_x [0, 0, 0]
gr_color_x [0, 0, 0]
```

### 5.3 Testfälle

Die Tests liegen unter sample/im2d_api_demo im librga-Quellbaum. Die Demo-Konfiguration kann angepasst werden; beim ersten Lauf die Standardwerte verwenden. Die Kompilierung ist plattformabhängig: Android unterstützt mm; unter Linux entsteht beim CMake-Build von librga.so im selben Verzeichnis die Testdatei. Das kompilierte Programm per adb übertragen, Ausführungsrechte setzen, ausführen und die Logs prüfen. Kontrollieren, ob die Ausgabedatei den Erwartungen entspricht.

#### 5.3.1 Bildpuffer zuweisen

Das Demo stellt Graphicbuffer und AHardwareBuffer für die RGA-Komposition bereit; die Auswahl erfolgt über USE_AHARDWAREBUFFER.

```text
⽬录：librga/samples/im2d_api_demo/Android.mk
（line +15）

ifeq (1,$(strip $(shell expr $(PLATFORM_SDK_VERSION) \> 25)))
/*USE_AHARDWAREBUFFER为1则使⽤AHardwareBuffer，为0使⽤Graphicbuffer*/
LOCAL_CFLAGS += -DUSE_AHARDWAREBUFFER=1
endif
```

##### 5.3.1.1 Graphicbuffer

Drei Funktionen initialisieren hauptsächlich Graphicbuffer, füllen/leeren den Puffer und befüllen rga_buffer_t.

```text
/*传⼊src/dst的宽、⾼、图像格式，初始化Graphicbuffer*/
src_buf = GraphicBuffer_Init(SRC_WIDTH, SRC_HEIGHT, SRC_FORMAT);
dst_buf = GraphicBuffer_Init(DST_WIDTH, DST_HEIGHT, DST_FORMAT);

/*通过枚举值FILL_BUFF/EMPTY_BUFF，执⾏填充/清空Graphicbuffer*/
GraphicBuffer_Fill(src_buf, FILL_BUFF, 0);
if(MODE == MODE_BLEND)
    GraphicBuffer_Fill(dst_buf, FILL_BUFF, 1);
else
    GraphicBuffer_Fill(dst_buf, EMPTY_BUFF, 1);

/*填充rga_buffer_t结构体:src、dst*/
src = wrapbuffer_GraphicBuffer(src_buf);
dst = wrapbuffer_GraphicBuffer(dst_buf);
```

##### 5.3.1.2 AHardwareBuffer

Drei Funktionen initialisieren hauptsächlich AHardwareBuffer, füllen/leeren den Puffer und befüllen rga_buffer_t.

```text
/*传⼊src/dst的宽、⾼、图像格式，初始化AHardwareBuffer*/
AHardwareBuffer_Init(SRC_WIDTH, SRC_HEIGHT, SRC_FORMAT, &src_buf);
AHardwareBuffer_Init(DST_WIDTH, DST_HEIGHT, DST_FORMAT, &dst_buf);

/*通过枚举值FILL_BUFF/EMPTY_BUFF，执⾏填充/清空AHardwareBuffer*/
AHardwareBuffer_Fill(&src_buf, FILL_BUFF, 0);
if(MODE == MODE_BLEND)
    AHardwareBuffer_Fill(&dst_buf, FILL_BUFF, 1);
else
    AHardwareBuffer_Fill(&dst_buf, EMPTY_BUFF, 1);

/*填充rga_buffer_t结构体:src、dst*/
src = wrapbuffer_AHardwareBuffer(src_buf);
dst = wrapbuffer_AHardwareBuffer(dst_buf);
```

#### 5.3.2 Hilfe anzeigen

Mit folgendem Befehl die Testhilfe abrufen.

```text
rgaImDemo -h
rgaImDemo --help
rgaImDemo
```

Nach erfolgreicher Ausführung das Demo entsprechend der angezeigten Hilfe verwenden:

```text
rk3399_Android10:/ # rgaImDemo
librga:RGA_GET_VERSION:3.02,3.020000
ctx=0x7864d7c520,ctx->rgaFd=3

=============================================================================================
   usage: rgaImDemo [--help/-h] [--while/-w=(time)] [--querystring/--querystring=<options>]
                    [--copy] [--resize=<up/down>] [--crop] [--rotate=90/180/270]
                    [--flip=H/V] [--translate] [--blend] [--cvtcolor]
                    [--fill=blue/green/red]
         --help/-h     Call help
         --while/w     Set the loop mode. Users can set the number of cycles by themselves.
         --querystring You can print the version or support information corresponding to the current version
of RGA according to the options.
                       If there is no input options, all versions and support information of the current
version of RGA will be printed.
                       <options>:
                       vendor           Print vendor information.
                       version          Print RGA version, and librga/im2d_api version.
                       maxinput         Print max input resolution.
                       maxoutput        Print max output resolution.
                       scalelimit       Print scale limit.
                       inputformat      Print supported input formats.
                       outputformat     Print supported output formats.
                       expected         Print expected performance.
                       all              Print all information.
         --copy        Copy the image by RGA.The default is 720p to 720p.
         --resize      resize the image by RGA.You can choose to up(720p->1080p) or down(720p->480p).
         --crop        Crop the image by RGA.By default, a picture of 300*300 size is cropped from (100,100).
         --rotate      Rotate the image by RGA.You can choose to rotate 90/180/270 degrees.

         --flip        Flip the image by RGA.You can choice of horizontal flip or vertical flip.
         --translate   Translate the image by RGA.Default translation (300,300).
         --blend       Blend the image by RGA.Default, Porter-Duff 'SRC over DST'.
         --cvtcolor    Modify the image format and color space by RGA.The default is RGBA8888 to NV12.
         --fill        Fill the image by RGA to blue, green, red, when you set the option to the corresponding
color.
=============================================================================================
```

Die gesamte Argumentverarbeitung befindet sich in /librga/demo/im2d_api_demo/args.cpp.

#### 5.3.3 Demo wiederholt ausführen

Mit folgendem Befehl das Demo wiederholt ausführen. Die Schleifenanweisung muss vor allen Argumenten stehen. Die Wiederholungszahl ist int; das Standardintervall beträgt 200ms.

```text
rgaImDemo -w6 --copy
rgaImDemo --while=6 --copy
```

#### 5.3.4 RGA-Version und Unterstützung abfragen

Mit folgendem Befehl Versions- und Unterstützungsinformationen abrufen:

```text
rgaImDemo --querystring
rgaImDemo --querystring=<options>
```

Dieser Befehl akzeptiert Optionen; ohne Optionen gilt =all. Verfügbare Optionen:

```text
options：
    =vendor             打印⼚商信息
    =version            打印版本信息
    =maxinput           打印⽀持的最⼤输⼊分辨率
    =maxoutput          打印⽀持的最⼤输出分辨率
    =scalelimit         打印⽀持的缩放倍数
    =inputformat        打印⽀持的输⼊格式
    =outputformat       打印⽀持的输出格式
    =expected           打印预期性能
    =all                打印所有信息
```

##### 5.3.4.1 Codeanalyse

Die Argumente von main() bestimmen die ausgegebenen Informationen.

```text
/*将main()传参转化为QUERYSTRING_INFO枚举值*/
IM_INFO = (QUERYSTRING_INFO)parm_data[MODE_QUERYSTRING];
/*打印querystring()返回的字符串，即所需要的信息*/
printf("\n%s\n", querystring(IM_INFO));
```

#### 5.3.5 Bildskalierung

Mit folgendem Befehl Bildskalierung testen.

```text
rgaImDemo --resize=up
rgaImDemo --resize=down
```

Diese Funktion benötigt eine Option. Verfügbare Optionen:

```text
options：
    =up                 图像分辨率放⼤⾄1920x1080
    =down               图像分辨率缩⼩⾄720x480
```

##### 5.3.5.1 Codeanalyse

Das Argument up/down von main() wählt Vergrößerung oder Verkleinerung. Den Puffer dafür neu initialisieren und leeren, rga_buffer_t befüllen und die endgültigen src-/dst-Bildbeschreibungen an imresize() übergeben.

```text
switch(parm_data[MODE_RESIZE])
{
    /*放⼤图像*/
    case IM_UP_SCALE :
        /*重新初始化Graphicbuffer为分辨率1920x1080对应⼤⼩*/
        dst_buf = GraphicBuffer_Init(1920, 1080, DST_FORMAT);
        /*清空buffer*/
        GraphicBuffer_Fill(dst_buf, EMPTY_BUFF, 1);
        /*重新填充存储dst数据的rga_buffer_t结构体*/
        dst = wrapbuffer_GraphicBuffer(dst_buf);
        break;

    case IM_DOWN_SCALE :
        /*重新初始化Graphicbuffer为分辨率1920x1080对应⼤⼩*/
        dst_buf = GraphicBuffer_Init(720, 480, DST_FORMAT);
        /*清空buffer*/
        GraphicBuffer_Fill(dst_buf, EMPTY_BUFF, 1);
        /*重新填充存储dst数据的rga_buffer_t结构体*/
        dst = wrapbuffer_GraphicBuffer(dst_buf);
        break;
}
/*将rga_buffer_t格式的结构体src、dst传⼊imresize()*/
STATUS = imresize(src, dst);
/*根据返回的IM_STATUS枚举值打印运⾏状态*/
printf("resizing .... %s\n", imStrError(STATUS));
```

#### 5.3.6 Bildzuschnitt

Mit folgendem Befehl Bildzuschnitt testen.

```text
rgaImDemo --crop
```

Keine Optionen verfügbar. Standardmäßig wird der Bereich LT(100,100), RT(400,100), LB(100,400), RB(400,400) zugeschnitten.

##### 5.3.6.1 Codeanalyse

Die Zuschnittmaße im im_rect für das src-Rechteck setzen und die rga_buffer_t-Strukturen für src und dst an imcrop() übergeben.

```text
/*这⾥通过x、y确定裁剪顶点的坐标，width、height确定裁剪区域⼤⼩*/
src_rect.x      = 100;
src_rect.y      = 100;
src_rect.width  = 300;
src_rect.height = 300;

/*将im_rect格式的结构体src_rect与rga_buffer_t格式的结构体src、dst传⼊imcrop()*/
STATUS = imcrop(src, dst, src_rect);
/*根据返回的IM_STATUS枚举值打印运⾏状态*/
printf("cropping .... %s\n", imStrError(STATUS));
```

#### 5.3.7 Bildrotation

Mit folgendem Befehl Bildrotation testen.

```text
rgaImDemo --rotate=90
rgaImDemo --rotate=180
rgaImDemo --rotate=270
```

Diese Funktion benötigt eine Option. Verfügbare Optionen:

```text
options：
    =90                 图像旋转90° ，输出图像分辨率宽⾼交换
    =180                图像旋转180°，输出图像分辨率不变
    =270                图像旋转270°，输出图像分辨率宽⾼交换
```

##### 5.3.7.1 Codeanalyse

Das main()-Argument 90/180/270 wählt den Drehwinkel. In einen IM_USAGE-Enumerationswert umwandeln und zusammen mit den rga_buffer_t-Strukturen für src und dst an imrotate() übergeben.

```text
/*将main()传参转化为IM_USAGE枚举值*/
ROTATE = (IM_USAGE)parm_data[MODE_ROTATE];

/*将标识旋转⻆度的IM_USAGE枚举值与rga_buffer_t格式的结构体src、dst⼀同传⼊imrotate()*/
STATUS = imrotate(src, dst, ROTATE);
/*根据返回的IM_STATUS枚举值打印运⾏状态*/
printf("rotating .... %s\n", imStrError(STATUS));
```

#### 5.3.8 Bildspiegelung

Mit folgendem Befehl Bildspiegelung testen.

```text
rgaImDemo --flip=H
rgaImDemo --flip=V
```

Diese Funktion benötigt eine Option. Verfügbare Optionen:

```text
options：
    =H                  图像⽔平镜像翻转
    =V                  图像垂直镜像翻转
```

##### 5.3.8.1 Codeanalyse

Das main()-Argument H/V wählt die Spiegelrichtung. In einen IM_USAGE-Wert umwandeln und zusammen mit den rga_buffer_t-Strukturen für src und dst an imflip() übergeben.

```text
/*将main()传参转化为IM_USAGE枚举值*/
FLIP = (IM_USAGE)parm_data[MODE_FLIP];

/*将标识镜像反转⽅向的IM_USAGE枚举值与rga_buffer_t格式的结构体src、dst⼀同传⼊imflip()*/
STATUS = imflip(src, dst, FLIP);
/*根据返回的IM_STATUS枚举值打印运⾏状态*/
printf("flipping .... %s\n", imStrError(STATUS));
```

#### 5.3.9 Farbfüllung

Mit folgendem Befehl Farbfüllung testen.

```text
rgaImDemo --fill=blue
rgaImDemo --fill=green
rgaImDemo --fill=red
```

Eine Option ist erforderlich. Der Standardfüllbereich ist LT(100,100), RT(400,100), LB(100,400), RB(400,400). Verfügbare Optionen:

```text
options：
    =blue               图像颜⾊填充为蓝⾊
    =green              图像颜⾊填充为绿⾊
    =red                图像颜⾊填充为红⾊
```

##### 5.3.9.1 Codeanalyse

Das main()-Argument (bule/green/red, Schreibweise der Quelle) wählt die Füllfarbe. Die Füllmaße im im_rect für dst setzen, das Argument in einen hexadezimalen Farbwert umwandeln und zusammen mit der dst-Struktur rga_buffer_t an imfill() übergeben.

```text
/*将main()传参转化为对应颜⾊的16进制数*/
COLOR = parm_data[MODE_FILL];

/*这⾥通过x、y确定裁剪顶点的坐标，width、height确定填充颜⾊区域⼤⼩*/
dst_rect.x      = 100;
dst_rect.y      = 100;
dst_rect.width  = 300;
dst_rect.height = 300;

/*将im_rect格式的结构体dst_rect、对应颜⾊的16进制数与rga_buffer_t格式的结构体src、dst⼀同传⼊imfill()*/
STATUS = imfill(dst, dst_rect, COLOR);
/*根据返回的IM_STATUS枚举值打印运⾏状态*/
printf("filling .... %s\n", imStrError(STATUS));
```

#### 5.3.10 Bildverschiebung

Mit folgendem Befehl Bildverschiebung testen.

```text
rgaImDemo --translate
```

Keine Optionen verfügbar. Der linke obere Eckpunkt wird standardmäßig nach (300,300) verschoben: 300 Pixel nach rechts und 300 nach unten.

##### 5.3.10.1 Codeanalyse

Die Verschiebungswerte im im_rect für das src-Rechteck setzen und die rga_buffer_t-Strukturen für src und dst an imtranslate() übergeben.

```text
/*这⾥通过x、y确定平移后图像的顶点的坐标*/
src_rect.x = 300;
src_rect.y = 300;

/*将im_rect格式的结构体src_rect与rga_buffer_t格式的结构体src、dst⼀同传⼊imtranslate()*/
STATUS = imtranslate(src, dst, src_rect.x, src_rect.y);
/*根据返回的IM_STATUS枚举值打印运⾏状态*/
printf("translating .... %s\n", imStrError(STATUS));
```

#### 5.3.11 Bildkopie

Mit folgendem Befehl Bildkopie testen.

```text
rgaImDemo --copy
```

Keine Optionen verfügbar. Standardmäßig wird ein 1280x720-RGBA8888-Bild kopiert.

##### 5.3.11.1 Codeanalyse

Die rga_buffer_t-Strukturen mit den Bilddaten von src und dst an imcopy() übergeben.

```text
/*rga_buffer_t格式的结构体src、dst传⼊imcopy()*/
STATUS = imcopy(src, dst);
/*根据返回的IM_STATUS枚举值打印运⾏状态*/
printf("copying .... %s\n", imStrError(STATUS));
```

#### 5.3.12 Bildkomposition

Mit folgendem Befehl Bildkomposition testen.

```text
rgaImDemo --blend
```

Keine Optionen verfügbar. Die Quelle nennt IM_ALPHA_BLEND_DST als Standardkompositionsmodus.

##### 5.3.12.1 Codeanalyse

Die rga_buffer_t-Strukturen mit den Bilddaten von src und dst an imblend() übergeben.

```text
/*rga_buffer_t格式的结构体src、dst传⼊imblend()*/
STATUS = imblend(src, dst);
/*根据返回的IM_STATUS枚举值打印运⾏状态*/
printf("blending .... %s\n", imStrError(STATUS));
```

#### 5.3.13 Bildformatkonvertierung

Mit folgendem Befehl Bildformatkonvertierung testen.

```text
rgaImDemo --cvtcolor
```

Keine Optionen verfügbar. Standardmäßig wird ein 1280x720-Bild von RGBA8888 nach NV12 konvertiert.

##### 5.3.13.1 Codeanalyse

Die benötigten Formate in den format-Feldern von rga_buffer_t setzen und die src-/dst-Bildstrukturen an imcvtcolor() übergeben.

```text
/*将转换前后的格式赋值给对应的rga_buffer_t结构体的成员变量format*/
src.format = HAL_PIXEL_FORMAT_RGBA_8888;
dst.format = HAL_PIXEL_FORMAT_YCrCb_NV12;

/*将需要转换的格式与rga_buffer_t格式的结构体src、dst⼀同传⼊imcvtcolor()*/
STATUS = imcvtcolor(src, dst, src.format, dst.format);
/*根据返回的IM_STATUS枚举值打印运⾏状态*/
printf("cvtcolor .... %s\n", imStrError(STATUS));
```

## Quellenvergleich: ebenfalls als V2.2.7 bezeichnetes englisches Original

Die folgenden abweichenden Definitionen der englischen Quelle dienen der Nachvollziehbarkeit, nicht dem Vermischen mit vorherigem Code. Mit tatsächlichen SDK-Headern, librga und Treiberversionen abgleichen. Die englische Quelle enthält weder die fünf OSD-Strukturen der chinesischen §§4.2.9–4.2.13 noch die erweiterten im_opt_t-Felder; diese sind oben vollständig ergänzt.

§3.20.1 imfill: Englisch verwendet buf, Standardfarbe 0x00000000 und kein release_fence_fd; Chinesisch dst, obligatorisches color und zusätzliches release_fence_fd.

```text
IM_STATUS imfill(rga_buffer_t buf,
                 im_rect rect,
                 int color = 0x00000000,
                 int sync = 1);
```

§4.2.3 im_opt_t: die kürzere englische Struktur enthält die chinesischen Felder version, mosaic_mode, osd_config, intr_config und reserve nicht.

```text
typedef struct im_opt {
    int color;                          /* color, used by color fill */
    im_colorkey_range colorkey_range;   /* range value of color key */
    im_nn_t nn;
    int rop_code;

    int priority;
    int core;
} im_opt_t;
```

§4.2.6 im_handle_param_t: Englisch verwendet rga_memory_parm mit width_stride/height_stride, Chinesisch im_handle_param mit width/height. Die englische Parametertabelle verwendet ebenfalls width_stride/height_stride. Keine ABI-Gleichheit unterstellen.

```text
typedef struct rga_memory_parm im_handle_param_t;

struct rga_memory_parm {
    uint32_t width_stride;
    uint32_t height_stride;
    uint32_t format;
};
```

§3.8.1 imcopy: das englische Original enthält eine zusätzliche schließende Klammer nach sync = 1. Unten bleibt dies als Quellproblem erhalten; oben steht die chinesische Signatur.

```text
IM_STATUS imcopy(const rga_buffer_t src,
                 rga_buffer_t dst,
                 int sync = 1),
                 int *release_fence_fd = NULL);
```

§3.15.1 imblend: Englisches srcA/dst entspricht chinesischem fg_image/bg_image; die Parameternamen unterscheiden sich.

```text
IM_STATUS imblend(const rga_buffer_t srcA,
                  rga_buffer_t dst,
                  int mode = IM_ALPHA_BLEND_SRC_OVER,
                  int sync = 1,
                  int *release_fence_fd = NULL);
```

§3.15.1 imcomposite: Englisches srcA/srcB/dst entspricht chinesischem fg_image/bg_image/output_image.

```text
IM_STATUS imcomposite(const rga_buffer_t srcA,
                      const rga_buffer_t srcB,
                      rga_buffer_t dst,
                      int mode = IM_ALPHA_BLEND_SRC_OVER,
                      int sync = 1,
                      int *release_fence_fd = NULL);
```

{% endraw %}
