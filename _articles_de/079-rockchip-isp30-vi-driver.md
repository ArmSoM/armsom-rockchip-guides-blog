---
title: "Rockchip ISP30 VI-Treiber V1.1.5: Sensoren, VICAP und Kameradiagnose"
description: "Vollständige V1.1.5-Referenz für RK3588-Mehrkamerapipelines, CIS- und Objektivtreiber, RAW-Speicherung, VICAP-Reset, Belichtungsdiagnose und alle fünf Anhänge."
translation_key: "079-rockchip-isp30-vi-driver"
slug: "079-rockchip-isp30-vi-driver"
lang: "de"
date: "2026-10-19"
author: "ArmSoM-Redaktion · Rockchip-Quelldokumentation"
category: "camera"
products: []
tags: ["Rockchip", "ISP30", "VI", "VICAP", "Kamera", "Linux"]
keywords: "ArmSoM Rockchip ISP30 VI RK3588 VICAP Kameratreiber"
excerpt: "Vollständige Referenz V1.1.5: RK3588-Mehrkamerapipelines, CIS- und Objektivtreiber, RAW-Speicherung, VICAP-Reset, Belichtungsdiagnose und sämtliche fünf Anhänge."
---

{% raw %}

# Rockchip ISP30 VI-Treiber V1.1.5: Sensoren, VICAP und Kameradiagnose

## ArmSoM-Anwendbarkeit und Quellenumfang

Dies ist eine Rockchip-Plattformreferenz und kein ArmSoM-Hardwaretestbericht. Die Quelle ist **Rockchip_Driver_Guide_VI_EN_v1.1.5.pdf**, V1.1.5, mit 230 PDF-Seiten; die letzte Seite ist leer. Ein chinesisches PDF wurde nicht bereitgestellt. Chinesisch, Russisch und Deutsch übersetzen diese englische Quelle vollständig und verwenden deren englische Originalabbildungen. Alle Messungen, Befehle und Protokolle sind Quellbeispiele; es wurde keine boardspezifische Hardwarevalidierung durchgeführt.

Die Produkttabelle und Anwendbarkeitsmatrix der Quelle unterscheiden sich im Umfang. Der Haupttext behandelt zusätzlich RK3588/RK3588S und RV1106. ArmSoM Sige7 ist offiziell als RK3588-Board mit Kameranutzung dokumentiert; dies bestätigt jedoch keine Kompatibilität mit dem älteren SDK, den Kerneltreibern oder APIs dieser Quelle. Prüfen Sie vor der Anpassung genaues Board und SoC, Hersteller-SDK/BSP und Kernel gemäß Angabe 4.19 oder 5.10, Sensor, Lane-Führung, Stromversorgung, Takt, DTS, ISP-/VICAP-Topologie sowie IQ-/AIQ-Versionen.

Diese Ausgabe V1.1.5 ist vom bestehenden Artikel zu V1.0.7 getrennt. Sowohl das neuere CIS-Kapitel 8 als auch das wiederholte CIS-Kapitel 10 bleiben einschließlich ihrer Unterschiede erhalten. Widersprüche bei RK356x-Grenzen, Knotenschreibweisen, Reset-Beschreibungen und Belichtungsformeln werden dokumentiert statt stillschweigend korrigiert. Optimierungsbeispiele zu Speicher, IOMMU und Takten müssen auf dem Zielsystem validiert werden.

[Redaktionelle Prüfnotizen](/docs/rockchip-isp30-vi-driver/EDITORIAL-NOTES.md) · [Vorherige Referenz V1.0.7](/de/articles/074-rockchip-vi-driver/) · [ArmSoM Sige7](https://docs.armsom.org/armsom-sige7) · [Offizielle Einrichtung der Sige-Familie](https://docs.armsom.org/sige-family-started)

### Ursprünglicher technischer Geltungsbereich (PDF-Seite 2)

| Chip | Kernel |
| --- | --- |
| RV1126/RV1109 | Linux 4.19 |

| Chip | Softwaresystem | Unterstützung |
| --- | --- | --- |
| RV1126 | Linux Kernel-4.19 / Kernel-5.10 | Y |
| RV1109 | Linux Kernel-4.19 / Kernel-5.10 | Y |
| RK3566 | Linux Kernel-5.10 | Y |
| RK3568 | Linux Kernel-5.10 | Y |
| RK3562 | Linux Kernel-5.10 | Y |

## 1. Unterschiede der VI-Funktionen zwischen den Chips

<!-- Source: English PDF p8, table unit 1 -->

| SoC | VI-IP | VI-Schnittstelle | Maximale Bayer-CIS-<br>Auflösung | Merkmal |
| --- | --- | --- | --- | --- |
| RV1109 | ISP20 ( ISP +<br>ISPP): 1<br>VICAP Full: 1<br>VICAP Lite: 1 | MIPI DPHY:<br>2 x 4Lanes 2.5Gbps/Lane<br>LVDS:<br>2 x 4Lanes 1.0Gbps/Lane<br>DVP:<br>BT601 / BT656 / BT1120<br>pclk: 150MHz | 3072x2048 | HDR mit bis zu<br>3 Bildern |
| RK3566 | ISP21 Lite: 1<br>VICAP Full: 1 | MIPI DPHY:<br>2 x 2Lanes oder 1 x 4Lanes<br>2.5Gbps/Lane<br>DVP:<br>BT601 / BT656 / BT1120<br>pclk: 150MHz | 4096x2304 | Kein HDR |
| RK3568 | ISP21：1<br>VICAP Full: 1 | MIPI DPHY:<br>2 x 2Lanes oder 1 x 4Lanes<br>2.5Gbps/Lane<br>DVP:<br>BT601 / BT656 / BT1120<br>pclk: 150MHz | 4096x2304 | HDR mit bis zu<br>2 Bildern |
| RV1126 | ISP20 ( ISP +<br>ISPP): 1<br>VICAP Full: 1<br>VICAP Lite: 1 | MIPI DPHY:<br>2 x 4Lanes 2.5Gbps/Lane<br>LVDS:<br>2 x 4Lanes 1.0Gbps/Lane<br>DVP:<br>BT601 / BT656 / BT1120<br>pclk: 150MHz | 4416x3312 | HDR mit bis zu<br>3 Bildern |
| RK3588 | VICAP：1 ISP30：2 FEC：2 | MIPI DPHY: 4 x 2Lanes oder 2 x 4Lanes 2.5Gbps/Lane MIPI DCPHY： 2 x 4Lanes dphy or 2 x 3Lanes cphy 2.5Gbps/Lane DVP: BT601 / BT656 / BT1120 pclk: 150MHz | 4672x3504 einzelner ISP 8192x6144 Zusammenführung durch zwei ISP | HDR mit bis zu<br>3 Bildern |

<!-- Source: English PDF p9, table unit 2 -->

| SoC | VI-IP | VI-Schnittstelle | Maximale Bayer-CIS-<br>Auflösung | Merkmal |
| --- | --- | --- | --- | --- |
| RK3588S | VICAP：1 ISP30：2 FEC：2 | MIPI DPHY: 2 x 2Lanes or 1 x 4Lanes 2.5Gbps/Lane MIPI DCPHY： 2 x 4Lanes dphy or 2 x 3Lanes cphy 2.5Gbps/Lane DVP: BT601 / BT656 / BT1120 pclk: 150MHz | 4672x3504 einzelner ISP 8192x6144 Zusammenführung durch zwei ISP | HDR mit bis zu<br>3 Bildern |
| RV1106 | VICAP：1 ISP32：1 | MIPI DPHY:<br>2 x 2Lanes oder 1 x 4Lanes<br>2.5Gbps/Lane<br>DVP:<br>BT601 / BT656 / BT1120<br>pclk: 150MHz | 3072x1728 | HDR mit bis zu<br>2 Bildern |
| RK3562 | VICAP：1 ISP32_LITE：1 | MIPI DPHY:<br>2 x 2Lanes oder 1 x 4Lanes<br>2.5Gbps/Lane<br>DVP:<br>BT601 / BT656 / BT1120<br>pclk: 150MHz | 4224x3136 | HDR mit bis zu<br>2 Bildern |

## 2. Verzeichnisübersicht der Kameratreibersoftware

Linux-Kernel 4.19

<p style="white-space:pre-wrap">|-- arch/arm/boot/dts DTS-Konfigurationsdatei</p>

<p style="white-space:pre-wrap">|-- drivers/phy/rockchip</p>

<p style="white-space:pre-wrap">|-- phy-rockchip-mipi-rx.c MIPI-DPHY-Treiber</p>

<p style="white-space:pre-wrap">|-- phy-rockchip-csi2-dphy-common.h</p>

<p style="white-space:pre-wrap">|-- phy-rockchip-csi2-dphy-hw.c</p>

<p style="white-space:pre-wrap">|-- phy-rockchip-csi2-dphy.c</p>

<p style="white-space:pre-wrap">|-- drivers/media</p>

<p style="white-space:pre-wrap">|-- platform/rockchip/cif</p>

<p style="white-space:pre-wrap">|-- platform/rockchip/isp</p>

<p style="white-space:pre-wrap">|-- dev Geräteerkennung, asynchrone Registrierung, Takt, Pipeline, IOMMU und Media-/V4L2-Framework</p>

<p style="white-space:pre-wrap">|-- capture mp-/sp-/rawwr-Konfiguration, vb2 und Bildinterruptverarbeitung</p>

<p style="white-space:pre-wrap">|-- dmarx rawrd-Konfiguration, vb2 und Bildinterruptverarbeitung</p>

<p style="white-space:pre-wrap">|-- isp_params 3A-Parametereinstellungen</p>

<p style="white-space:pre-wrap">|-- isp_stats 3A-Statistiken</p>

<p style="white-space:pre-wrap">|-- isp_mipi_luma Helligkeitsstatistiken der MIPI-Daten</p>

<p style="white-space:pre-wrap">|-- regs Register-Lese- und Schreibzugriffe</p>

<p style="white-space:pre-wrap">|-- rkisp Registrierung von ISP-Subdevice und Entity</p>

<p style="white-space:pre-wrap">|-- csi CSI-Subdevice und MIPI-Konfiguration</p>

<p style="white-space:pre-wrap">|-- bridge Bridge-Subdevice zur Verbindung von ISP und ISPP</p>

<p style="white-space:pre-wrap">|-- platform/rockchip/ispp</p>

<p style="white-space:pre-wrap">|-- dev Geräteerkennung, asynchrone Registrierung, Takt, Pipeline, IOMMU und Media-/V4L2-Framework</p>

<p style="white-space:pre-wrap">|-- stream Konfiguration von 4 Videoausgängen, vb2 und Bildinterruptverarbeitung</p>

<p style="white-space:pre-wrap">|-- rkispp Registrierung von ISPP-Subdevice und Entity</p>

<p style="white-space:pre-wrap">|-- params TNR-/NR-/SHP-/FEC-/ORB-Parametereinstellung</p>

<p style="white-space:pre-wrap">|-- stats ORB-Statistiken</p>

<p style="white-space:pre-wrap">|-- i2c</p>

<p style="white-space:pre-wrap">|-- os04a10.c CIS-Treiber (CMOS-Bildsensor)</p>

## 3. Verknüpfung zwischen ISP und VICAP

Auf RV1126/RV1109 und RK356X sind VICAP und ISP unabhängige Bildverarbeitungs-IP-Blöcke. Sollen von VICAP erfasste Bilder im ISP verarbeitet werden, muss der Treiber ein V4L2-Subdevice für die entsprechende VICAP-Schnittstelle erzeugen und mit dem zugehörigen ISP-Knoten verknüpfen. Es stellt dem ISP-Treiber die benötigten Parameter bereit. Siehe die Abschnitte zu RKISP- und RKVICAP-Treibern. Das folgende Blockdiagramm zeigt die Verknüpfung der einzelnen VICAP-Schnittstellen mit dem ISP:

![Verbindungstopologie von ISP und VICAP — englische Originalabbildung, PDF-Seite 10](/docs/rockchip-isp30-vi-driver/assets/en-p10-X243.jpg)

*Verbindungstopologie von ISP und VICAP — englische Originalabbildung, PDF-Seite 10*

## 4. RKISP-Treiber

### 4.1 Kurze Frameworkbeschreibung

Der RKISP-Treiber basiert hauptsächlich auf dem V4L2-/Media-Framework. Er übernimmt Hardwarekonfiguration, Interruptverarbeitung, Pufferwechsel und das Ein-/Ausschalten von Subdevices wie MIPI DPHY und Sensor.

Das folgende Blockdiagramm beschreibt die Topologie des RKISP-Treibers:

![Topologie des RKISP-Treibers — englische Originalabbildung, PDF-Seite 11](/docs/rockchip-isp30-vi-driver/assets/en-p11-X249.jpg)

*Topologie des RKISP-Treibers — englische Originalabbildung, PDF-Seite 11*

<!-- Source: English PDF p12, table unit 40 -->

| Name | Typ | Beschreibung |
| --- | --- | --- |
| rkisp_mainpath | v4l2_vdevcapture | Formate: YUV, RAW Bayer; Beschnitt und Skalierung unterstützt, Skalierung nicht für RAW. |
| rkisp_selfpath | v4l2_vdevcapture | Formate: YUV, RGB; Beschnitt und Skalierung unterstützt, Skalierung nicht für RAW. |
| rkisp-isp-subdev | v4l2_subdev | Interne ISP-Blöcke; unterstützen Beschnitt an Source-/Sink-Pads. Format und Größe am Sink-Pad entsprechen der Sensoreingabe. Bei RAW-Bayer-Ausgabe muss das Source-Pad-Format dem Vdev-Ausgabeformat entsprechen, andernfalls YUYV2X8. Die Größe darf die Sink-Pad-Größe nicht überschreiten. |
| rkisp-mipi-luma | v42_vdevcapture | Liefert die Helligkeit des RAW-Bildes |
| rkisp-statistics | v4l2_vdevcapture | Liefert Farbstatistiken des Bildes |
| rkisp-input-params | v4l2_vdevoutput | Empfängt Parameter für Bildverbesserungsblöcke wie AWB, BLC usw. |
| rkisp_rawrd0_m | v4l2_vdevoutput | Liest RAW-Bilder aus DDR in den ISP, üblicherweise das mittlere HDR-Bild |
| rkisp_rawrd1_l | v4l2_vdevoutput | Liest RAW-Bilder aus DDR in den ISP, üblicherweise das lange HDR-Bild |
| rkisp_rawrd2_s | v4l2_vdevoutput | Liest RAW-Bilder aus DDR in den ISP, üblicherweise das kurze HDR-Bild |
| rkisp-csi-subdev | v4l2_subdev | MIPI-CSI-Konfiguration |
| rkisp_rawwr0 | v4l2_vdevcapture | Schreibt Sensor-RAW-Bilder in DDR, üblicherweise das mittlere HDR-Bild |
| rkisp_rawwr1 | v4l2_vdevcapture | Schreibt Sensor-RAW-Bilder in DDR, üblicherweise das lange HDR-Bild |
| rkisp_rawwr2 | v4l2_vdevcapture | Schreibt Sensor-RAW-Bilder in DDR, üblicherweise das kurze HDR-Bild |
| rkisp_rawwr3 | v4l2_vdevcapture | Schreibt Sensor-RAW-Bilder in DDR |
| rockchip-mipi- dphy-rx | v4l2_subdev | MIPI-DPHY-Konfiguration |
| rkisp-bridge-ispp | v4l2_subdev | Überträgt YUV-Bilder vom ISP an ISPP |
| rkispp_input_image | v4l2_vdevoutput | Liest YUV-Bilder aus DDR in ISPP |
| rkisp-isp-subdev | v4l2_subdev | Format und Größe am Sink-Pad entsprechen der ISP-Ausgabe. Maximale Größe: 4416x3312; minimale Größe: 66x258. |
| rkispp_m_bypass | v4l2_vdev capture | Volle Auflösung und YUV-Format |

<!-- Source: English PDF p13, table unit 41 -->

| Name | Typ | Beschreibung |
| --- | --- | --- |
| rkispp_scale0 | v4l2_vdev capture | Volle oder skalierte Auflösung, YUV-Format. Skalierungsverhältnis [1 8]. Maximale Breite 3264 für yuv422, 2080 für yuv420; nur für rv1126. |
| rkispp_scale1 | v4l2_vdev capture | Volle oder skalierte Auflösung, YUV-Format. Skalierungsverhältnis [2 8], maximale Breite 1280; nur für rv1126. |
| rkispp_scale2 | v4l2_vdev capture | Volle oder skalierte Auflösung, YUV-Format. Skalierungsverhältnis [2 8], maximale Breite 1280; nur für rv1126. |

### 4.2 ISP-HDR-Modus

RKISP2 unterstützt MIPI-Sensoren mit HDR-Ausgabe aus 3 oder 2 Bildern. Die Hardware erfasst die Daten über 3 beziehungsweise 2 dmatx in DDR und liest sie anschließend über 3 beziehungsweise 2 dmarx in den ISP. Dort werden die Bilder zusammengeführt. Treiberpipeline:

![HDR-Pfad für drei Bilder — englische Originalabbildung, PDF-Seite 13](/docs/rockchip-isp30-vi-driver/assets/en-p13-X256.png)

*HDR-Pfad für drei Bilder — englische Originalabbildung, PDF-Seite 13*

![HDR-Pfad für zwei Bilder — englische Originalabbildung, PDF-Seite 13](/docs/rockchip-isp30-vi-driver/assets/en-p13-X257.png)

*HDR-Pfad für zwei Bilder — englische Originalabbildung, PDF-Seite 13*

Das CSI-Subdevice ermittelt über get_fmt die Ausgabeinformationen des Sensortreibers in mehreren Pad-Formaten, die den Source-Pads von CSI entsprechen.

Zur konkreten Konfiguration des MIPI-Sensortreibers siehe die Schritte zur Treiberportierung.

<!-- Source: English PDF p14, table unit 48 -->

| Name | Name | Beschreibung |
| --- | --- | --- |
| rkisp-isp- subdev | Sensor pad0 | ISP erfasst Breite, Höhe und Format der Sensorausgabe auf vc0 (Standard), üblicherweise für den linearen Modus. |
| rkisp_rawwr0 | Sensor pad1 | Rawwr0 erfasst Breite, Höhe und Format der Sensorausgabe auf vcX |
| rkisp_rawwr1 | Sensor pad2 | Rawwr1 erfasst Breite, Höhe und Format der Sensorausgabe auf vcX |
| rkisp_rawwr2 | Sensor pad3 | Rawwr2 erfasst Breite, Höhe und Format der Sensorausgabe auf vcX |
| rkisp_rawwr3 | Sensor pad4 | Rawwr3 erfasst Breite, Höhe und Format der Sensorausgabe auf vcX |

## 5. RKVICAP-Treiber

### 5.1 Frameworkbeschreibung

Der RKVICAP-Treiber basiert hauptsächlich auf dem V4L2-/Media-Framework. Er übernimmt Hardwarekonfiguration, Interruptverarbeitung, Pufferwechsel und das Ein-/Ausschalten von Subdevices wie MIPI DPHY und Sensor.

Bei RV1126/RV1109 besitzt VICAP zwei IP-Kerne: VICAP FULL und VICAP LITE. VICAP FULL verfügt über dvp/mipi/lvds. DVP kann gleichzeitig mit MIPI oder LVDS arbeiten, MIPI und LVDS jedoch nicht gleichzeitig. VICAP LITE besitzt nur eine LVDS-Schnittstelle und kann gleichzeitig mit VICAP FULL arbeiten. Die DVP-Schnittstelle von VICAP FULL entspricht rkvicap_dvp, dessen MIPI-/LVDS-Schnittstelle rkvicap_mipi_lvds und VICAP LITE rkvicap_lite_mipi_lvds. Jeder Knoten kann unabhängig erfassen.

Bei RK356X besitzt VICAP nur einen Kern mit DVP- und MIPI-Schnittstelle. DVP entspricht rkvicap_dvp und MIPI rkvicap_mipi_lvds, also demselben Namen wie VICAP FULL auf RV1126/RV1109. Jeder Knoten kann unabhängig erfassen.

Um die von VICAP erfassten Daten mit dem ISP-Treiber zu synchronisieren, muss der logische sditf-Knoten des VICAP-Treibers mit dem vom ISP erzeugten virtuellen Geräteknoten verknüpft werden. DVP entspricht rkvicap_dvp_sditf, die MIPI-/LVDS-Schnittstelle von VICAP FULL rkvicap_mipi_lvds_sditf und VICAP LITE rkvicap_lite_sditf.

Zur DTS-Verknüpfung der jeweiligen Schnittstelle siehe CIS-Geräteregistrierung (DTS).

Die folgende Abbildung beschreibt die Topologie des durch RKVICAP gesteuerten Geräts:

![Topologie der VICAP-Schnittstellen — englische Originalabbildung, PDF-Seite 15](/docs/rockchip-isp30-vi-driver/assets/en-p15-X267.jpg)

*Topologie der VICAP-Schnittstellen — englische Originalabbildung, PDF-Seite 15*

## 6. RK3588-VI-Struktur

## 7. Hardwareblöcke

![VI-Hardwareblöcke des RK3588 — englische Originalabbildung, PDF-Seite 16](/docs/rockchip-isp30-vi-driver/assets/en-p16-X270.png)

*VI-Hardwareblöcke des RK3588 — englische Originalabbildung, PDF-Seite 16*

### 7.1 Unterstützung mehrerer Sensoren

Ein Hardware-ISP unterstützt höchstens vier Multiplexkanäle. Dabei gelten folgende Auflösungen:

Zweifach-Multiplex: maximal 3840x2160; im DTS werden entsprechend zwei rkisp_vir-Geräte konfiguriert.

Drei- oder Vierfach-Multiplex: maximal 2560x1536; im DTS werden entsprechend drei oder vier rkisp_vir-Geräte konfiguriert.

Die Hardware erfasst bis zu 7 Sensoren: 6MIPI + 1DVP. Die Softwarepfade für mehrere Sensoren sind nachfolgend dargestellt:

![Mehrsensor-Pfade des RK3588 — englische Originalabbildung, PDF-Seite 16](/docs/rockchip-isp30-vi-driver/assets/en-p16-X271.png)

*Mehrsensor-Pfade des RK3588 — englische Originalabbildung, PDF-Seite 16*

Erläuterung des Blockdiagramms:

1\. RK3588 unterstützt zwei DCPHYs mit den Knotennamen csi2_dcphy0/csi2_dcphy1. Jede unterstützt gleichzeitig RX und TX; RX dient dem Kameraeingang. DPHY- und CPHY-Protokoll werden alternativ unterstützt. TX und RX derselben DCPHY müssen jedoch gleichzeitig beide DPHY oder beide CPHY verwenden. Weitere Parameter enthält das RK3588-Datenblatt. 2. RK3588 unterstützt zwei DPHY-Hardwareblöcke, hier dphy0_hw/dphy1_hw genannt; beide besitzen vollständigen und aufgeteilten Modus. 1) dphy0_hw: Im vollständigen Modus heißt der Knoten csi2_dphy0 und unterstützt bis zu 4 Lanes. Im aufgeteilten Modus entstehen csi2_dphy1 mit Lane 0/1 und csi2_dphy2 mit Lane 2/3, jeweils bis zu 2 Lanes. Für den vollständigen Modus wird die Verknüpfung wie für csi2_dphy1 konfiguriert, der Knotenname jedoch in csi2_dphy0 geändert; die Software erkennt den Modus an der PHY-Nummer. 2) dphy1_hw: Im vollständigen Modus heißt der Knoten csi2_dphy3 und unterstützt bis zu 4 Lanes. Aufgeteilt entstehen csi2_dphy4 mit Lane 0/1 und csi2_dphy5 mit Lane 2/3, jeweils bis zu 2 Lanes. Für den vollständigen Modus wird die Verknüpfung wie für csi2_dphy4 konfiguriert, aber der Name in csi2_dphy3 geändert. Wieder bestimmt die PHY-Nummer den Modus. 3. Zur Verwendung dieser MIPI-PHY-Knoten müssen die entsprechenden physischen Knoten csi2_dcphy0_hw/csi2_dcphy1_hw/csi2_dphy0_hw/csi2_dphy1_hw konfiguriert werden. 4. Jede MIPI-PHY benötigt ein CSI2-Modul zum Auswerten des MIPI-Protokolls; die Knoten heißen mipi0_csi2~mipi5_csi2. 5. Alle Kameradaten von RK3588 gelangen über VICAP zum ISP. Der einzige VICAP-Hardwareblock unterstützt gleichzeitig 6 MIPI-PHY-Eingänge und einen DVP-Eingang. Er wird daher in 7 Knoten wie rkcif_mipi_lvds~rkcif_mipi_lvds5 und rkcif_dvp aufgeteilt. Die Zuordnung muss exakt den Knotennummern im Blockdiagramm folgen. 6. Die Verknüpfung jedes VICAP-Knotens mit dem ISP erfolgt über das entsprechende virtuelle XXX_sditf. 7. RK3588 besitzt 2 ISP-Hardwareblöcke, die jeweils mehrere virtuelle Knoten bereitstellen können. Die Software liest die Bilder nacheinander aus DDR zur ISP-Verarbeitung. Bei mehreren Kameras sollten die Datenströme gleichmäßig auf beide ISPs verteilt werden. 8. Direktdurchleitung und Rücklesen: 1) Bei Direktdurchleitung erfasst VICAP die Daten und sendet sie ohne DDR-Zwischenspeicherung direkt an den ISP. Bei HDR gilt dies tatsächlich nur für kurze Bilder; lange Bilder werden in DDR gespeichert und vom ISP zurückgelesen. 2) Beim Rücklesen erfasst VICAP die Daten in DDR. Die Anwendung erhält sie und übermittelt die Pufferadresse an den ISP, der sie aus DDR liest. 3) Wird im DTS für einen ISP nur ein virtueller Knoten konfiguriert, ist Direktdurchleitung Standard; bei mehreren virtuellen Knoten ist Rücklesen Standard.

### 7.2 Zwei ISPs für 8K-Auflösung kombinieren

VICAP erfasst die 8K-Sensordaten und übergibt linke und rechte Bildhälfte an zwei ISPs. Nach deren Verarbeitung werden die Daten in DDR ausgegeben. Ablauf:

![8K-Zusammenführung mit zwei ISP — englische Originalabbildung, PDF-Seite 18](/docs/rockchip-isp30-vi-driver/assets/en-p18-X281.png)

*8K-Zusammenführung mit zwei ISP — englische Originalabbildung, PDF-Seite 18*

Oberhalb von 16M (4672x3504) müssen zwei ISPs gemeinsam ein Bild verarbeiten; es wird nur eine einzelne Kamera unterstützt.

1\. In rk3588s.dtsi finden sich rkisp0, rkisp1 und rkisp_unite. Für Auflösungen oberhalb 16M müssen rkisp0 und rkisp1 deaktiviert, rkisp_unite aktiviert und der entsprechende IOMMU-Knoten angepasst werden.

2\. Auch rkisp_unite kann mehrere virtuelle Knoten bereitstellen. Unabhängig von der Auflösung wird dann jedes Bild links/rechts aufgeteilt, von 2 ISPs verarbeitet und wieder zu einer Ausgabe zusammengeführt.

3\. DTS-Konfigurationsreferenz: In der Quelle steht „待链接“, also noch zu verlinken.

### 7.3 Acht MIPI-Sensoren unterstützen

RK3588 unterstützt hardwareseitig bis zu 6 MIPI-Sensoren. RK1608 kann diese Zahl durch Zusammenführung erweitern. Er unterstützt 4 MIPI-Eingänge und 2 MIPI-Ausgänge, jeweils mit 1, 2 oder 4 Lanes. Drei über RK1608 zusammengeführte Sensoren plus 5 ursprüngliche MIPI-Sensoren ermöglichen insgesamt 8 Eingänge. Hardwareverbindung:

![RK1608-Anschluss von acht MIPI-Sensoren — englische Originalabbildung, PDF-Seite 18](/docs/rockchip-isp30-vi-driver/assets/en-p18-X282.png)

*RK1608-Anschluss von acht MIPI-Sensoren — englische Originalabbildung, PDF-Seite 18*

Aktivieren Sie softwareseitig den RK1608-Treiber in der Kernel-defconfig:

```text
  CONFIG_VIDEO_ROCKCHIP_PREISP=y
  CONFIG_VIDEO_PREISP_DUMMY_SENSOR=y
```

Im DTS wird die RK1608-DPHY als Knoten abstrahiert und als virtueller Sensor preisp_dmy eingebunden. Wie ein normaler Sensor ist sie mit RK3588-DCPHY verbunden und bildet die Kette RK1608-&gt;dcphy-&gt;csi-&gt;cif lvds. Die physisch am RK1608 angeschlossenen Sensoren sind im DTS direkt mit port0 von rkcif_mipi_lvdsx_sditf, rkcif_mipi_lvdsx_sditf_vir1, rkcif_mipi_lvdsx_sditf_vir2 und rkcif_mipi_lvdsx_sditf_vir3 als SDITF-Eingänge verbunden.

Der SDITF-Ausgang entspricht dem ursprünglichen Pfad und führt zum jeweiligen ISP-Knoten. DTS-Verknüpfung:

![DTS-Verbindungstopologie des RK1608 — englische Originalabbildung, PDF-Seite 19](/docs/rockchip-isp30-vi-driver/assets/en-p19-X288.png)

*DTS-Verbindungstopologie des RK1608 — englische Originalabbildung, PDF-Seite 19*

Die DTS-Konfiguration von RK1608 erfolgt hauptsächlich am Geräteknoten rk1608-dpy und umfasst Ein-/Ausgabekanäle sowie Auflösung:

```text
  #define LINK_FREQ               700000000
      mipidphy0: mipidphy0 {
      compatible =  "rockchip,rk1608-dphy";
          status = "okay";
          //rockchip,grf = <&grf>;
          id = <0>;  //RK1608 internal ID (0-2, spliced sequentially by ID)
          cam_nums = <1>;
          in_mipi = <1>;         //Input MIPI channel of the first sensor (0-3)
          out_mipi = <0>;        //Output MIPI channel (0-1)
          link-freqs = /bits/ 64 <LINK_FREQ>; //MIPI rate
          sensor_i2c_bus = <5>;     //The 8-mesh pattern is invalid
          sensor_i2c_addr = <0x1a>; //The 8-mesh pattern is invalid
          sensor-name = "IMX464";
          rockchip,camera-module-index = <9>; //Same as ordinary sensor
          rockchip,camera-module-facing = "back";
          rockchip,camera-module-name = "TongJu";
          rockchip,camera-module-lens-name = "CHT842-MD";
          /* virtual-sensor mode */
          virtual-sub-sensor-config-0 {  //Configuration information for the second
  sensor
              id = <1>;  //RK1608 internal ID (0-2, spliced by ID)
              in_mipi = <2>;
              out_mipi = <1>;
          };
          virtual-sub-sensor-config-1 { //Configuration information for the third
  sensor
              id = <2>;  //RK1608 internal ID (0-2, spliced by ID)
              in_mipi = <3>;
              out_mipi = <1>;
          };
          /* multi-sensor mode end */
          format-config-0 {
              data_type = <0x2b>;
              mipi_lane = <2>;     //The number of lanes connected to the sensor
              mipi_lane_out = <4>; //The number of lanes output by RK1608
              field = <1>;      //The following is the same as the normal sensor
  configuration
              colorspace = <8>;
              code = <MEDIA_BUS_FMT_SRGGB10_1X10>;
              width = <2712>;  //Sensor output resolution
              height= <1538>;
              hactive = <2712>; //RK1608 output resolution, the same width, height
  is n*sensor
              vactive = <4614>;
              htotal = <3616>; //After increasing the width and height of blank,
  30% of the blank is generally required
              vtotal = <4710>;
              inch0-info = <2712 1538 0x2b 0x2b 1>; //Sensor output resolution
              outch0-info = <2712 4614 0x2b 0x2b 1>; //RK1608 output resolution
              hcrop = <2560>; //Single resolution after cropping
              vcrop = <1520>;
          };
          ...
```

DTS-Konfigurationsreferenz des Sensors:

```text
  &rkcif_mipi_lvds_sditf {
      #address-cells = <1>;
      #size-cells = <0>;
      status = "okay";
      rockchip,combine-index = <0>; //Order in RK1608 stitching diagram
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_lvds_sditf_in: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&imx464_out7>;
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_lvds_sditf: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&isp0_vir0>;
              };
          };
      };
  };
```

## 8. CIS-Treiber (CMOS-Bildsensor)

### 8.1 CIS-Geräteregistrierung (DTS)

#### 8.1.1 MIPI-Schnittstelle

RV1126 und RV1106 besitzen zwei unabhängige vollständige standardkonforme physische MIPI-CSI2-DPHYs. Sie entsprechen csi_dphy0 und csi_dphy1 im DTS; siehe RV1126.DTSI. Eigenschaften:

Höchstens 4 Daten-Lanes.

Maximale Datenrate 2.5Gbps/lane.

RK356X besitzt eine standardkonforme physische MIPI-CSI2-DPHY mit vollständigem und aufgeteiltem Modus. Daraus entstehen die drei logischen DPHYs csi2_dphy0/csi2_dphy1/csi2_dphy2; siehe rk3568.dtsi. Eigenschaften:

**Vollständiger Modus**

Nur csi2_dphy0 verwenden; csi2_dphy0 und csi2_dphy1/csi2_dphy2 schließen sich gegenseitig aus.

Höchstens 4 Daten-Lanes.

Maximale Datenrate 2.5Gbps/lane.

**Aufgeteilter Modus**

Nur csi2_dphy1 und csi2_dphy2 verwenden; sie dürfen nicht gleichzeitig mit csi2_dphy0 verwendet werden.

csi2_dphy1 und csi2_dphy2 können gleichzeitig verwendet werden.

csi2_dphy1 und csi2_dphy2 unterstützen jeweils höchstens 2 Daten-Lanes.

csi2_dphy1 entspricht lane0/lane1 der physischen DPHY.

csi2_dphy2 entspricht Lane2/LANE3 der physischen DPHY.

Maximale Datenrate 2.5Gbps/lane.

Konkrete DTS-Anwendungsfälle zeigen die folgenden Beispiele.

##### 8.1.1.1 Verknüpfung mit dem ISP

###### 8.1.1.1.1 RV1126/RV1106

Nachfolgend dienen RV1126 ISP und OS04A10 als Beispiel.

**Verknüpfung: sensor-&gt;csi_dphy-&gt;isp-&gt;ispp**

arch/arm/boot/dts/rv1126-evb-v10.dtsi

**Wichtige Konfigurationspunkte**

Data-lanes muss die verwendete Lane-Anzahl angeben; andernfalls wird MIPI nicht erkannt.

```text
  cam_ircut0: cam_ircut {
      status = "okay";
      compatible = "rockchip,ircut";
      ircut-open-gpios = <&gpio2 RK_PA7 GPIO_ACTIVE_HIGH>;
      ircut-close-gpios = <&gpio2 RK_PA6 GPIO_ACTIVE_HIGH>;
      rockchip,camera-module-index = <1>;
      rockchip,camera-module-facing = "front";
  };
  os04a10: os04a10@36 {
      compatible = "ovti,os04a10";// It needs to match the matching string in the
  driver
      reg = <0x36>;// sensor I2C device address, 7 bits
      clocks = <&cru CLK_MIPICSI_OUT>;// Sensor clickin configuration
      clock-names = "xvclk";
      power-domains = <&power RV1126_PD_VI>;
      pinctrl-names = "rockchip,camera_default";
      pinctrl-0 = <&mipi_csi_clk0>;// PINCTL settings
      //power supply
      avdd-supply = <&vcc_avdd>;
      dovdd-supply = <&vcc_dovdd>;
      dvdd-supply = <&vcc_dvdd>;
      // Power pin assignment and active level
      pwdn-gpios = <&gpio1 RK_PD4 GPIO_ACTIVE_HIGH>;
      // Module number, which should not be repeated
      rockchip,camera-module-index = <1>;
      // Module orientation, with "back" and "front"
      rockchip,camera-module-facing = "front";
      // Module name
      rockchip,camera-module-name = "CMK-OT1607-FV1";
      // Lens name
      rockchip,camera-module-lens-name = "M12-4IR-4MP-F16";
      //IR CUT equipment
      ir-cut = <&cam_ircut0>;
      port {
          ucam_out0: endpoint {
              // The port name on the mipi dphy side
              remote-endpoint = <&mipi_in_ucam0>;
              // MIPI lanes number, 1 lane is <1>,
              4lane is <1 2 3 4 >
              data-lanes = <1 2 3 4>;
          };
      };
   };
  &csi_dphy0 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_in_ucam0: endpoint@1 {
                  reg = <1>;
                  // The port name on the sensor side
                  remote-endpoint = <&ucam_out0>;
                  // MIPI lanes number, 1 lane is <1>, 4lane is
  <1 2 3 4 >,data-lanes = <1 2 3 4>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              csidphy0_out: endpoint@0 {
                  reg = <0>;
                  // The port name on the ISP side
                  remote-endpoint = <&isp_in>;
              };
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  // The port name on the mipi dphy side
                  remote-endpoint = <&csidphy0_out>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp0_out: endpoint@1 {
                  reg = <1>;
                  // ISP port name, ISP output to ISP
                  remote-endpoint = <&ispp0_in>;
              };
          };
      };
  };
  &rkispp {
      status = "okay";
  };
  &rkispp_vir0 {
      status = "okay";
      port {
          #address-cells = <1>;
          #size-cells = <0>;
          Ispp0_in: endpoint@0 {
              reg = <0>;
              // ISP port name, ISPP input
              remote-endpoint = <&isp0_out>;
          };
      };
  };
```

###### 8.1.1.1.2 RK356X

Nachfolgend dienen RK3566 ISP und GC8034 mit 4 Lanes als Beispiel:

**Verknüpfung: sensor-&gt;csi2_dphy0-&gt;isp; wichtige Konfigurationspunkte**

Data-lanes muss konfiguriert werden.

Der Knoten csi2_dphy_hw muss aktiviert werden.

```text
   /* full mode: lane0-3 */
      gc8034: gc8034@37 {
          // It needs to match the matching string in the driver
          compatible = "galaxycore,gc8034";
          status = "okay";
          // sensor I2C device address, 7 bits
          reg = <0x37>;
          // Sensor mclk source configuration
          clocks = <&cru CLK_CIF_OUT>;
          clock-names = "xvclk";
          //The sensor dependent power domain is enabled
          power-domains = <&power RK3568_PD_VI>;
          //Sensor McLk pinctl settings
          pinctrl-names = "default";
          pinctrl-0 = <&cif_clk>;
          // Reset pin assignment and active level
          reset-gpios = <&gpio3 RK_PA6 GPIO_ACTIVE_LOW>;
          // Powerdown pin assignment and active level
          pwdn-gpios = <&gpio4 RK_PB2 GPIO_ACTIVE_LOW>;
          // Module number, which should not be repeated
          rockchip,camera-module-index = <0>;
          // Module orientation, with "back" and "front"
          rockchip,camera-module-facing = "back";
          // Module name
          rockchip,camera-module-name = "RK-CMK-8M-2-v1";
          // Lens name
          rockchip,camera-module-lens-name = "CK8401";
          port {
              gc8034_out: endpoint {
                  // The port name of the CSI2 dphy end
                  remote-endpoint = <&dphy0_in>;
                  // CSI2 dphy lane number, 1lane is <1>,
                  4lane is <1 2 3 4>, data-lanes = <1 2 3 4>;
              };
          };
      };
      &csi2_dphy_hw {
         status = "okay";
      };
      &csi2_dphy0 {
          //csi2_dphy0 is not used at the same time as
          csi2_dphy1/csi2_dphy2, mutually exclusive
          status = "okay";
          /*
           * dphy0 only used for full mode,
           * full mode and split mode are mutually exclusive
           */
          ports {
              #address-cells = <1>;
              #size-cells = <0>;
              port@0 {
                  reg = <0>;
                  #address-cells = <1>;
                  #size-cells = <0>;
                  dphy0_in: endpoint@1 {
                      reg = <1>;
                      // The port name on the sensor side
                      remote-endpoint = <&gc8034_out>;
                      // CSI2 dphy lanes, 1 lane is <1 >, 4 lanes is <1 2 3 4 >,
  which needs to be consistent with the sensor side
                          data-lanes = <1 2 3 4>;
                  };
              };
              port@1 {
                  reg = <1>;
                  #address-cells = <1>;
                  #size-cells = <0>;
                  dphy0_out: endpoint@1 {
                      reg = <1>;
                      // The port name on the ISP side
                      remote-endpoint = <&isp0_in>;
                  };
              };
          };
      };
  &rkisp {
      status = "okay";
  };
  &rkisp_mmu {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      port {
          #address-cells = <1>;
          #size-cells = <0>;
          isp0_in: endpoint@0 {
              reg = <0>;
              // The port name of the CSI2 dphy side
              remote-endpoint = <&dphy0_out>;
          };
      };
  };
```

##### 8.1.1.2 Verknüpfung mit VICAP

###### 8.1.1.2.1 RV1126/RV1109

Beispiel für MIPI OS04A10 mit 4 Lanes an VICAP:

**Verknüpfung: sensor-&gt;csi dphy-&gt;mipi csi host-&gt;vicap; wichtige Konfigurationspunkte**

Data-lanes muss die verwendete Lane-Anzahl angeben; andernfalls wird MIPI nicht erkannt.

Die DPHY muss mit dem CSI-Host-Knoten verknüpft werden.

```text
  os04a10: os04a10@36 {
          // It needs to match the matching string in the driver
          compatible = "ovti,os04a10";
          // sensor I2C device address, 7 bits
          reg = <0x36>;
          // Sensor mclk source configuration
          clocks = <&cru CLK_MIPICSI_OUT>;
          clock-names = "xvclk";
          //The sensor dependent power domain is enabled
          power-domains = <&power RV1126_PD_VI>;
          avdd-supply = <&vcc_avdd>;
          dovdd-supply = <&vcc_dovdd>;
          dvdd-supply = <&vcc_dvdd>;
          //Sensor McLk pinctl settings
          pinctrl-names = "rockchip,camera_default";
          pinctrl-0 = <&mipicsi_clk0>;
          // Powerdown pin assignment and active level
          pwdn-gpios = <&gpio1 RK_PD4 GPIO_ACTIVE_HIGH>;
          // Module number, which should not be repeated
          rockchip,camera-module-index = <1>;
          // Module orientation, with "back" and "front"
          rockchip,camera-module-facing = "front";
          // Module name
          rockchip,camera-module-name = "CMK-OT1607-FV1";
          // Lens name
          rockchip,camera-module-lens-name = "M12-40IRC-4MP-F16";
          // Ircut name
          ir-cut = <&cam_ircut0>;
          port {
              ucam_out0: endpoint {
                  // The port name of the CSI2 dphy end
                  remote-endpoint = <&mipi_in_ucam0>;
                  // CSI2 dphy lanes number, 1lane is <1>, 4lane is <1 2 3 4 >
                  data-lanes = <1 2 3 4>;
              };
          };
      };
  &csi_dphy0 {
      //csi2_dphy0 is not used at the same time as csi2_dphy1/csi2_dphy2, mutually exclusive
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_in_ucam0: endpoint@1 {
                  reg = <1>;
                  // The port name on the sensor side
                  remote-endpoint = <&ucam_out0>;
                  // CSI2 dphy lanes, 1 lane is <1 >, 4 lanes is <1 2 3 4 >, which
  needs to be consistent with the sensor side
                  data-lanes = <1 2 3 4>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              csidphy0_out: endpoint@0 {
                  reg = <0>;
                  // The port name of the CSI2 host
                  remote-endpoint = <&mipi_csi2_input>;
              };
          };
      };
  };
  &mipi_csi2 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_input: endpoint@1 {
                  reg = <1>;
                  // The port name of the CSI2 host
                  remote-endpoint = <&csidphy0_out>;
                  // CSI2 host lanes, 1 lane is <1>,
                  4lane is <1 2 3 4 >, which needs to be
                  consistent with the sensor side
                  data-lanes = <1 2 3 4>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_output: endpoint@0 {
                  reg = <0>;
                  // The port name on the vicap side
                  remote-endpoint = <&cif_mipi_in>;
                  // CSI2 host lanes, 1 lane is <1>,
                  4lane is <1 2 3 4 >, which needs to be
                  consistent with the sensor side
                  data-lanes = <1 2 3 4>;
              };
          };
      };
  };
  &rkcif_mipi_lvds {
      status = "okay";
      port {
          /* MIPI CSI-2 endpoint */
          cif_mipi_in: endpoint {
              // The port name of the CSI2 host
              remote-endpoint = <&mipi_csi2_output>;
              // The number of lanes on the vicap side,
              1 lane is <1 >, 4lane is < 1 2 3 4 >,
              which needs to be consistent with the sensor side
              data-lanes = <1 2 3 4>;
          };
      };
  };
  &rkcif_mipi_lvds_sditf {
      status = "okay";
      port {
          /* sditf endpoint */
          mipi_lvds_sditf: endpoint {
              //ISP virtual device port name
              remote-endpoint = <&isp_in>;
              //The number of lanes of MIPI CSI2 dphy,
              consistent with the sensor
              data-lanes = <1 2 3 4>;
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  //The endpoint name of the Vicap SDITF
                  remote-endpoint = <&mipi_lvds_sditf>;
              };
          };
      };
  };
```

###### 8.1.1.2.2 RK356X

Beispiel für GC5025 mit 2 Lanes an lane2/lane3 der MIPI-CSI2-DPHY auf rk3566 EVB2:

**Verknüpfung: sensor-&gt;csi2 dphy-&gt;mipi CSI host-&gt;vicap; wichtige Konfigurationspunkte**

Data-lanes muss die verwendete Lane-Anzahl angeben; andernfalls wird MIPI nicht erkannt.

Die DPHY muss mit dem CSI-Host-Knoten verknüpft werden.

Der CSI2-DPHY-Hardwareknoten muss aktiviert werden.

```text
  /* split mode: lane:2/3 */
  gc5025: gc5025@37 {
          status = "okay";
          // It needs to match the matching string in the driver
          compatible = "galaxycore,gc5025";
          // sensor I2C device address, 7 bits
          reg = <0x37>;
          // Sensor mclk source configuration
          clocks = <&pmucru CLK_WIFI>;
          clock-names = "xvclk";
          //Sensor McLk pinctl settings
          pinctrl-names = "default";
          pinctrl-0 = <&refclk_pins>;
          // Reset pin assignment and active level
          reset-gpios = <&gpio3 RK_PA5 GPIO_ACTIVE_LOW>;
          // Powerdown pin assignment and active level
          pwdn-gpios = <&gpio3 RK_PB0 GPIO_ACTIVE_LOW>;
          // The sensor dependent power domain is enabled
          power-domains = <&power RK3568_PD_VI>;
          /*power-gpios = <&gpio0 RK_PC1 GPIO_ACTIVE_HIGH>;*/
          // Module number, which should not be repeated
          rockchip,camera-module-index = <1>;
          // Module orientation, with "back" and "front"
          rockchip,camera-module-facing = "front";
          // Module name
          rockchip,camera-module-name = "TongJu";
          // Lens name
          rockchip,camera-module-lens-name = "CHT842-MD";
          port {
              gc5025_out: endpoint {
                  // The port name of the CSI2 dphy end
                  remote-endpoint = <&dphy2_in>;
                  // CSI2 dphy lanes number, 2lanes are <1 2>, 4lanes are <1 2 3 4
  >
                  data-lanes = <1 2>;
              };
          };
  };
   &csi2_dphy_hw {
           status = "okay";
   };
  &csi2_dphy2 {
      //csi2_dphy2 is not used at the same time as csi2_dphy0, mutually exclusive;
  Can be used in parallel with csi2_dphy1
      status = "okay";
      /*
       * dphy2 only used for split mode,
       * can be used  concurrently  with dphy1
       * full mode and split mode are mutually exclusive
       */
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy2_in: endpoint@1 {
                  reg = <1>;
                  // The port name on the sensor side
                  remote-endpoint = <&gc5025_out>;
                  // CSI2 dphy lanes, 2lane is <1 2>, 4lane is <1 2 3 4 >, which
  needs to be consistent with the sensor side
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy2_out: endpoint@1 {
                  reg = <1>;
                  // The port name of the CSI2 host
                  remote-endpoint = <&mipi_csi2_input>;
              };
          };
      };
  };
  &mipi_csi2 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_input: endpoint@1 {
                  reg = <1>;
                  // The port name on the CSI2 dphy side
                  remote-endpoint = <&dphy2_out>;
                  // CSI2 host lanes, 2 lanes are <1 2>, 4lanes are <1 2 3 4 >,
  which need to be consistent with the sensor side
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_output: endpoint@0 {
                  reg = <0>;
                  // The port name on the vicap side
                  remote-endpoint = <&cif_mipi_in>;
                  // CSI2 host lanes, 1 lane is <1>, 4lane is <1 2 3 4 >, which
  needs to be consistent with the sensor side
                  data-lanes = <1 2>;
              };
          };
      };
  };
  &rkcif_mipi_lvds {
      status = "okay";
      port {
          cif_mipi_in: endpoint {
              // The port name of the CSI2 host
              remote-endpoint = <&mipi_csi2_output>;
              // The number of lanes on the vicap side, 2lane is <1 2>, 4lane is <1
  2 3 4 >, which needs to be consistent with the sensor side
              data-lanes = <1 2>;
          };
      };
  };
  &rkcif_mipi_lvds_sditf {
      status = "okay";
      port {
          /* MIPI CSI-2 endpoint */
          mipi_lvds_sditf: endpoint {
              //ISP virtual device port name
              remote-endpoint = <&isp_in>;
              //The number of lanes of MIPI CSI2 dphy, consistent with the sensor
              data-lanes = <1 2>;
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  //The endpoint name of Vicap Mipi SDITF
                  remote-endpoint = <&mipi_lvds_sditf>;
              };
          };
      };
  };
```

###### 8.1.1.2.3 RK3588

Beispiel für IMX464 an DPY1; die Schreibweise DPY1 stammt aus der Quelle.

Data-lanes muss die verwendete Lane-Anzahl angeben; andernfalls wird MIPI nicht erkannt.

Die DPHY muss mit dem CSI-Host-Knoten verknüpft werden; csi2_dphy3 verwendet mipi4_csi2.

csi2_dphy3 ist nur ein logischer Knoten und benötigt den physischen Knoten csi2_dphy1_hw.

rkcif_mipi_lvds4 ist ein logischer VICAP-Knoten; der physische Knoten rkcif und die entsprechende IOMMU müssen konfiguriert werden.

rkcif_mipi_lvds4_sditf ist ein virtueller Unterknoten von rkcif_mipi_lvds4 zur Verknüpfung mit ISPs.

Sensortreiber steuern normalerweise drei Versorgungen: AVDD/DVDD/DOVDD. Vom in der Quelle „RAK809“ genannten Baustein bereitgestellte Versorgungen können direkt am Sensorknoten konfiguriert werden. Bei externen LDOs mit GPIO-Freigabe kann nach dem Beispiel vcc_mipicsi1 ein Versorgungsknoten eingerichtet werden. Referenzzählung ermöglicht gemeinsames Ein-/Ausschalten für mehrere Geräte. Für mehrere Kameras empfiehlt die Quelle eine getrennte „DVD“-Versorgung, während AVDD/DOVDD gemeinsam verwendet werden können. Bei gemeinsamem „DVD“ und hoher Last kann kurzzeitig Unterversorgung auftreten, die Spannung einbrechen und Bildqualität oder Bildausgabe beeinträchtigen. Die Schreibweisen RAK809 und DVD bleiben als Quellenangaben erhalten und sind zu prüfen.

```text
      / {
          vcc_mipicsi1: vcc-mipicsi1-regulator {
              compatible = "regulator-fixed";
              gpio = <&gpio4 RK_PA6 GPIO_ACTIVE_HIGH>;
              pinctrl-names = "default";
              pinctrl-0 = <&mipicsi1_pwr>;
              regulator-name = "vcc_mipicsi1";
              enable-active-high;
          };
      };
      &csi2_dphy1_hw {
          status = "okay";
      };
      &csi2_dphy3 {
          status = "okay";
          ports {
              #address-cells = <1>;
              #size-cells = <0>;
              port@0 {
                  reg = <0>;
                  #address-cells = <1>;
                  #size-cells = <0>;
                  mipi_in_ucam: endpoint@1 {
                      reg = <1>;
                      remote-endpoint = <&imx464_out>;
                      data-lanes = <1 2 3 4>;
                  };
              };
              port@1 {
                  reg = <1>;
                  #address-cells = <1>;
                  #size-cells = <0>;
                  csidphy3_out: endpoint@0 {
                      reg = <0>;
                      remote-endpoint = <&mipi4_csi2_input>;
                  };
              };
          };
      };
      &i2c4 {
          status = "okay";
          pinctrl-0 = <&i2c4m3_xfer>;
          imx464: imx464@36 {
              compatible = "sony,imx464";
              status = "okay";
              reg = <0x36>;
              clocks = <&cru CLK_MIPI_CAMARAOUT_M4>;
              clock-names = "xvclk";
              pinctrl-names = "default";
              pinctrl-0 = <&mipim0_camera4_clk>;
              avdd-supply = <&vcc_mipicsi1>;
              reset-gpios = <&gpio1 RK_PD6 GPIO_ACTIVE_HIGH>;
              pwdn-gpios = <&gpio3 RK_PC1 GPIO_ACTIVE_HIGH>;
              rockchip,camera-module-index = <0>;
              rockchip,camera-module-facing = "back";
              rockchip,camera-module-name = "CMK-OT1980-PX1";
              rockchip,camera-module-lens-name = "SHG102";
              port {
                  imx464_out: endpoint {
                      remote-endpoint = <&mipi_in_ucam>;
                      data-lanes = <1 2 3 4>;
                  };
              };
          };
      };
      &mipi4_csi2 {
          status = "okay";
          ports {
              #address-cells = <1>;
              #size-cells = <0>;
              port@0 {
                  reg = <0>;
                  #address-cells = <1>;
                  #size-cells = <0>;
                  mipi4_csi2_input: endpoint@1 {
                      reg = <1>;
                      remote-endpoint = <&csidphy3_out>;
                  };
              };
              port@1 {
                  reg = <1>;
                  #address-cells = <1>;
                  #size-cells = <0>;
                  mipi4_csi2_output: endpoint@0 {
                      reg = <0>;
                      remote-endpoint = <&cif_mipi_in4>;
                  };
              };
          };
      };
      &pinctrl {
          cam {
              mipicsi1_pwr: mipicsi1-pwr {
                  rockchip,pins =
                      /* camera power en */
                      <4 RK_PA6 RK_FUNC_GPIO &pcfg_pull_none>;
              };
          };
      };
      &rkcif {
          status = "okay";
      };
      &rkcif_mipi_lvds4 {
          status = "okay";
          port {
              cif_mipi_in4: endpoint {
                  remote-endpoint = <&mipi4_csi2_output>;
              };
          };
      };
      &rkcif_mipi_lvds4_sditf {
          status = "okay";
          port {
              mipi4_lvds_sditf: endpoint {
                  remote-endpoint = <&isp0_vir0>;
              };
          };
      };
      &rkcif_mmu {
          status = "okay";
      };
      #if 1
      &rkisp0 {
          status = "okay";
          /* the max input w h and fps of mulit sensor */
          //max-input = <2688 1520 30>;多摄sensor分辨率不一样，需要配置
      };
      &isp0_mmu {
          status = "okay";
      };
      #else //sensor分辨率大于16M(4672x3504)需要2个isp合成处理
      /* dual isp case need width 32 align， height 8 align */
      &rkisp_unite_mmu {
          status = "okay";
      };
      &rkisp_unite {
             status = "okay";
      };
      &rkisp0_vir0 {
             status = "okay";
             rockchip,hw = <&rkisp_unite>;
      };
      #endif
      &rkisp0_vir0 {
          status = "okay";
          port {
              #address-cells = <1>;
              #size-cells = <0>;
              isp0_vir0: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&mipi4_lvds_sditf>;
              };
          };
      };
```

###### 8.1.1.2.4 RV1106

DTS-Referenz: arch/arm/boot/dts/rv1106-evb-cam.dtsi

###### 8.1.1.2.5 RK3562

DTS-Referenz: arch/arm64/boot/dts/rockchip/rk3562-evb1-cam.dtsi

#### 8.1.2 LVDS-Schnittstelle

##### 8.1.2.1 Verknüpfung mit VICAP

###### 8.1.2.1.1 RV1126/RV1109

Am Beispiel von IMX327 mit 4 Lanes ergibt sich folgende Verknüpfung:

**Verknüpfung: sensor-&gt;csi dphy-&gt;vicap; wichtige Konfigurationspunkte**

Die DPHY darf nicht mit dem CSI-Host-Knoten verknüpft werden; andernfalls werden keine Daten empfangen.

Data-lanes muss die verwendete Lane-Anzahl angeben; andernfalls werden keine Daten empfangen.

bus-type muss 3 sein; andernfalls wird LVDS nicht erkannt und der Verbindungsaufbau scheitert.

```text
  imx327: imx327@1a {
          // It needs to match the matching string in the driver
          compatible = "sony,imx327";
          // sensor I2C device address, 7 bits
          reg = <0x1a>;
          // Sensor mclk source configuration
          clocks = <&cru CLK_MIPICSI_OUT>;
          clock-names = "xvclk";
          //The sensor dependent power domain is enabled
          power-domains = <&power RV1126_PD_VI>;
          avdd-supply = <&vcc_avdd>;
          dovdd-supply = <&vcc_dovdd>;
          dvdd-supply = <&vcc_dvdd>;
          //Sensor McLk pinctl settings
          pinctrl-names = "default";
          pinctrl-0 = <&mipicsi_clk0>;
          // Powerdown pin assignment and active level
          pwdn-gpios = <&gpio3 RK_PA6 GPIO_ACTIVE_HIGH>;
          // Reset pin assignment and active level
          reset-gpios = <&gpio1 RK_PD5 GPIO_ACTIVE_HIGH>;
          // Module number, which should not be repeated
          rockchip,camera-module-index = <1>;
          // Module orientation, with "back" and "front"
          rockchip,camera-module-facing = "front";
          // Module name
          rockchip,camera-module-name = "CMK-OT1607-FV1";
          // Lens name
          rockchip,camera-module-lens-name = "M12-4IR-4MP-F16";
          // Ircut name
          ir-cut = <&cam_ircut0>;
          port {
              ucam_out0: endpoint {
                  // The port name of the CSI2 dphy end
                  remote-endpoint = <&mipi_in_ucam0>;
                  //CSI2 dphy lvds number of lanes, 1 lane is <1>, 4lane is <4 >,
  must be specified
                  data-lanes = <4>;
                  //The type of LVDS interface, which must be specified
                  bus-type = <3>;
              };
          };
  };
  &csi_dphy0 {
      //csi2_dphy0 is not used at the same time as csi2_dphy1/csi2_dphy2, mutually exclusive
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_in_ucam0: endpoint@1 {
                  reg = <1>;
                  // The port name on the sensor side
                  remote-endpoint = <&ucam_out0>;
                  //CSI2 dphy lvds number of lanes, 1 lane is <1>, 4lane is <4 >,
  must be specified
                  data-lanes = <4>;
                  //The type of LVDS interface, which must be specified
                  bus-type = <3>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              csidphy0_out: endpoint@0 {
                  reg = <0>;
                  // The port name of the vicap lite side
                  remote-endpoint = <&cif_lite_lvds_in>;
                  // CSI2 dphy lvds number of lanes, 1 lane is <1>, 4lane is <4 >,
  must be specified
                  data-lanes = <4>;
                  // The type of LVDS interface, which must be specified
                  bus-type = <3>;
              };
          };
      };
  };
  &rkcif_lite_mipi_lvds {
      status = "okay";
      port {
          /* lvds endpoint */
          cif_lite_lvds_in: endpoint {
              // The port name of the CSI2 dphy end
              remote-endpoint = <&csidphy0_out>;
              // CSI2 dphy lvds number of lanes, 1 lane is <1>, 4lane is <4 >, must
  be specified
              data-lanes = <4>;
              //The type of LVDS interface, which must be specified
              bus-type = <3>;
          };
      };
  };
  &rkcif_lite_sditf {
      status = "okay";
      port {
          /* lvds endpoint */
          lite_sditf: endpoint {
              //ISP virtual device port name
              remote-endpoint = <&isp_in>;
              //CSI2 dphy has the number of lanes, which is the same as the sensor
              data-lanes = <4>;
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &isp0_mmu {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  //The endpoint name of the lite vicap lvds sditf
                  remote-endpoint = <&lite_sditf>;
              };
          };
      };
  };
```

Für Verarbeitung durch zwei ISPs kann folgende Änderung vorgenommen werden:

```text
  &rkisp {
      status = "disabled";
  };
  &isp0_mmu {
      status = "disabled";
  };
  &rkisp_unite {
      status = "okay";
  };
  &rkisp_unite_mmu {
      status = "okay";
  };
  &rkisp0_vir0 {
      status = "okay";
      /* hw is referenced as a unite node*/
      rockchip,hw = <&rkisp_unite>;
      port {
          #address-cells = <1>;
          #size-cells = <0>;
          isp0_vir0: endpoint@0 {
              reg = <0>;
              remote-endpoint = <&mipi4_lvds_sditf>;
          };
      };
  };
```

#### 8.1.3 DVP-Schnittstelle

##### 8.1.3.1 Verknüpfung mit VICAP

Auf RV1126/RV1109/RK356X/RK3588 ist die DTS-Konfiguration der jeweiligen DVP-Schnittstellen gleich.

###### 8.1.3.1.1 BT601

Am Beispiel von AR0230 BT601 ergibt sich folgende Verknüpfung:

**Verknüpfung: sensor-&gt;vicap; wichtige Konfigurationspunkte**

hsync-active/vsync-active müssen gesetzt sein, damit die asynchrone V4L2-Registrierung BT601 erkennt. Ohne diese Konfiguration wird BT656 erkannt.

pclk-sample/bus-width sind optional.

In g_mbus_config des Sensortreibers muss flag die gültige Polarität von hsync-acitve/vsync-active/pclk-ative angeben; andernfalls werden keine Daten empfangen. Die Schreibweisen der Quelle bleiben erhalten.

Pinctrl muss referenziert werden, damit das entsprechende IOMUX für BT601-GPIOs eingerichtet wird; andernfalls scheitert der Datenempfang.

Beispielcode für g_mbus_config:

```text
  static int ar0230_g_mbus_config(struct v4l2_subdev *sd,
                  struct v4l2_mbus_config *config)
  {
      config->type = V4L2_MBUS_PARALLEL;
      config->flags = V4L2_MBUS_HSYNC_ACTIVE_HIGH |
              V4L2_MBUS_VSYNC_ACTIVE_HIGH |
              V4L2_MBUS_PCLK_SAMPLE_FALLING;
      return 0;
  }
```

DTS-Konfigurationsbeispiel:

```text
  ar0230: ar0230@10 {
          // It needs to match the matching string in the driver
          compatible = "aptina,ar0230";
          // sensor I2C device address, 7 bits
          reg = <0x10>;
          // Sensor mclk source configuration
          clocks = <&cru CLK_CIF_OUT>;
          clock-names = "xvclk";
          //The sensor dependent power domain is enabled
          avdd-supply = <&vcc_avdd>;
          dovdd-supply = <&vcc_dovdd>;
          dvdd-supply = <&vcc_dvdd>;
          power-domains = <&power RV1126_PD_VI>;
          // Powerdown pin assignment and active level
          pwdn-gpios = <&gpio2 RK_PA6 GPIO_ACTIVE_HIGH>;
          /*reset-gpios = <&gpio2 RK_PC5 GPIO_ACTIVE_HIGH>;*/
          //Configure the DVP-related data pins and clock pins
          pinctrl-names = "default";
          pinctrl-0 = <&cifm0_dvp_ctl>;
          // Module number, which should not be repeated
          rockchip,camera-module-index = <0>;
          // Module orientation, with "back" and "front"
          rockchip,camera-module-facing = "back";
          // Module name
          rockchip,camera-module-name = "CMK-OT0836-PT2";
          // Lens name
          rockchip,camera-module-lens-name = "YT-2929";
          port {
              cam_para_out1: endpoint {
                  remote-endpoint = <&cif_para_in>;
              };
          };
  };
  &rkcif_dvp {
      status = "okay";
      port {
          /* Parallel bus endpoint */
          cif_para_in: endpoint {
              //The name of the sensor endpoint
              remote-endpoint = <&cam_para_out1>;
              //Relevant configuration parameters on the sensor side
              bus-width = <12>;
              hsync-active = <1>;
              vsync-active = <1>;
              pclk-sample = <0>;
          };
      };
  };
  &rkcif_dvp_sditf {
      status = "okay";
      port {
          /* parallel endpoint */
          dvp_sditf: endpoint {
              //ISP virtual device port name
              remote-endpoint = <&isp_in>;
              //Relevant configuration parameters on the sensor side
              bus-width = <12>;
              hsync-active = <1>;
              vsync-active = <1>;
              pclk-sample = <0>;
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  //The endpoint name of the DVD SDITF
                  remote-endpoint = <&dvp_sditf>;
              };
          };
      };
  };
```

###### 8.1.3.1.2 BT656/BT1120

BT656 und BT1120 werden im DTS gleich verwendet.

Am Beispiel von Ava FPGA BT1120 ergibt sich folgende Verknüpfung:

Verknüpfung: sensor-&gt;vicap

Wichtige Konfigurationspunkte

hsync-active/vsync-active nicht konfigurieren; andernfalls erkennt die asynchrone V4L2-Registrierung BT601.

pclk-sample/bus-width sind optional.

Die Variable flag in g_mbus_config des Sensortreibers muss die gültige Polarität von pclk-ative angeben; andernfalls werden keine Daten empfangen. Die Schreibweise der Quelle bleibt erhalten.

querystd in v4l2_subdev_video_ops muss implementiert werden und ATSC als aktuelle Schnittstelle melden; andernfalls werden keine Daten empfangen.

RKMODULE_GET_BT656_MBUS_INFO muss implementiert sein. BT656 und BT1120 verwenden beide dieses ioctl mit kompatibler Schnittstelle. Referenz: drivers/media/i2c/nvp6158_drv/nvp6158_v4l2.c

Pinctrl muss referenziert werden, um das IOMUX für BT656-/BT1120-GPIOs einzurichten; andernfalls scheitert der Datenempfang.

Beispielcode für g_mbus_config:

```text
  static int avafpga_g_mbus_config(struct v4l2_subdev *sd,
                  struct v4l2_mbus_config *config)
  {
      config->type = V4L2_MBUS_BT656;
      config->flags = V4L2_MBUS_PCLK_SAMPLE_RISING;
      return 0;
  }
```

Beispiel für querystd:

```text
  static int avafpga_querystd(struct v4l2_subdev *sd, v4l2_std_id *std)
  {
      *std = V4L2_STD_ATSC;
      return 0;
  }
```

DTS-Konfigurationsbeispiel:

```text
  avafpga: avafpga@70 {
      // It needs to match the matching string in the driver
      compatible = "ava,fpga";
      // sensor I2C device address, 7 bits
      reg = <0x10>;
      // Sensor mclk source configuration
      clocks = <&cru CLK_CIF_OUT>;
      clock-names = "xvclk";
      //The sensor dependent power domain is enabled
      avdd-supply = <&vcc_avdd>;
      dovdd-supply = <&vcc_dovdd>;
      dvdd-supply = <&vcc_dvdd>;
      // Powerdown pin assignment and active level
      power-domains = <&power RV1126_PD_VI>;
      pwdn-gpios = <&gpio2 RK_PA6 GPIO_ACTIVE_HIGH>;
      /*reset-gpios = <&gpio2 RK_PC5 GPIO_ACTIVE_HIGH>;*/
      //Configure the DVP-related data pins and clock pins
      pinctrl-names = "default";
      pinctrl-0 = <&cifm0_dvp_ctl>;
      // Module number, which should not be repeated
      rockchip,camera-module-index = <0>;
      // Module orientation, with "back" and "front"
      rockchip,camera-module-facing = "back";
      // Module name
      rockchip,camera-module-name = "CMK-OT0836-PT2";
      // Lens name
      rockchip,camera-module-lens-name = "YT-2929";
      port {
          cam_para_out2: endpoint {
              remote-endpoint = <&cif_para_in>;
          };
      };
  };
  &rkcif_dvp {
      status = "okay";
      port {
          /* Parallel bus endpoint */
          cif_para_in: endpoint {
              //The name of the sensor endpoint
              remote-endpoint = <&cam_para_out2>;
              //Sensor-side related configuration parameters, optional
              bus-width = <16>;
              pclk-sample = <1>;
          };
      };
  };
  &rkcif_dvp_sditf {
      status = "okay";
      port {
          /* parallel endpoint */
          dvp_sditf: endpoint {
              //ISP virtual device port name
              remote-endpoint = <&isp_in>;
              bus-width = <16>;
              pclk-sample = <1>;
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  //The endpoint name of the DVD SDITF
                  remote-endpoint = <&dvp_sditf>;
              };
          };
      };
  };
```

###### 8.1.3.1.3 Hinweise zum DVP-DTS von RV1106

Die vorherige Konfiguration gilt im Wesentlichen unverändert. Konfigurieren Sie MCLK und andere Hardwareressourcen gemäß tatsächlicher Verdrahtung.

RV1106 unterstützt zwei DVP-Pinbelegungen. Referenzieren Sie im DTS die tatsächlich verwendete PINCTRL-Konfiguration. M0:

Unterstützt BT1120 mit 16 Bit, BT656 mit 8 Bit und BT601 mit 8/10/12 Bit Daten. Diese Pins sind mit MIPI DPHY multiplexiert. Die MIPI-DPHY muss im TTL-Modus arbeiten; deshalb muss rkcif_dvp den MIPI-DPHY-Knoten referenzieren:

```text
  &rkcif_dvp {
      status = "okay";
      rockchip,dphy_hw = <&csi2_dphy_hw>;
          ......
```

}；

M1: Unterstützt BT656 mit 8 Bit und BT601 mit 8/10 Bit Daten; kann gleichzeitig mit MIPI verwendet werden.

Hinweis: Die in der Quelle als „DVD“ bezeichneten Daten der RK-Plattform sind an den höherwertigen Bits ausgerichtet. Lesen Sie bei der Hardwareentwicklung den RK-Hardwareleitfaden genau, damit eine falsche Verdrahtung die Erfassung nicht verhindert.

#### 8.1.4 Mehrere Sensoren registrieren

Ein Hardware-ISP verarbeitet die RAW-Daten mehrerer Sensoren im Zeitmultiplex über mehrere virtuelle Geräte.

VICAP auf RV1109/RV1126/RK356X speichert DVP-RAW-Daten nur nicht kompakt. Der ISP erwartet standardmäßig kompakte RAW-Daten. Hinweise zur Verarbeitung siehe „ISP-/VICAP-RAW-Speicherformat konfigurieren“; die Quelle markiert den Link noch als ausstehend.

##### 8.1.4.1 RV1126/RV1109

**Die Verknüpfungen isp0-&gt;ispp0 und isp1-&gt;ispp1 sind in rv1126.dtsi festgelegt.**

RV1109/RV1126 ISP/ISPP unterstützt bei ausreichender Bandbreite bis zu vier Multiplexkanäle. Sie lassen sich über rkisp_vir0~rkisp_vir4/rkispp_vir0~rkispp_vir4 in RV1126.DTSI ergänzen. Die Bereichsangabe der Quelle bleibt erhalten.

**MIPI- oder CIF-Eingang zum ISP ist wählbar.**

RV1109/RV1126 besitzt 2 PHY-Schnittstellen, jeweils als MIPI oder LVDS multiplexierbar und mit bis zu 4 Lanes.

RV1109/RV1126 besitzt eine DVP-Schnittstelle für BT601/BT656/BT1120.

Der ISP unterstützt MIPI- oder DVP-Eingang, jedoch nur einen von beiden gleichzeitig.

VICAP unterstützt MIPI/LVDS/DVP. MIPI und LVDS teilen sich Ressourcen und sind nicht gleichzeitig nutzbar; DVP kann parallel dazu arbeiten.

VICAP Lite unterstützt nur LVDS.

Aus dieser Hardwarekonfiguration ergibt sich derzeit Unterstützung für bis zu 3 RAW-Sensoreingänge zur ISP-Verarbeitung auf RV1109/RV1126.

###### 8.1.4.1.1 ISP-Verarbeitung zweier Eingänge: sensor0（mipi）-&gt;csi_dphy0-&gt;csi2-&gt;vicap-&gt;isp0-&gt;ispp0 sensor1（mipi）-&gt;csi_dphy1-&gt;isp1-&gt;ispp1

Referenz: arch/arm/boot/dts/rv1109-evb-ddr3-v12-facial-gate.dts mit gc2053-&gt;csi_dphy0-&gt;csi2-&gt;cif-&gt;isp1-&gt;ispp1 und ov2718-&gt;csi_dphy1-&gt;isp0-&gt;ispp0. Bei unterschiedlichen Auflösungen ist folgende Konfiguration wichtig:

```dts
&rkispp {
         status = "okay";
         /* the max input w h and fps of mulit sensor */
         max-input = <2688 1520 30>;// Maximum width and height and frame rate for different sensors
};
```

###### 8.1.4.1.2 ISP-Verarbeitung dreier Eingänge: sensor0（mipi）-&gt;csi_dphy0-&gt;csi2-&gt;vicap-&gt;isp0-&gt;ispp0 sensor1（mipi）-&gt;csi_dphy1-&gt;isp1-&gt;ispp1 sensor2（DVP）-&gt;vicap-&gt;isp2-&gt;ispp2

oder

sensor0（mipi）-&gt;csi_dphy0-&gt;csi2-&gt;vicap-&gt;isp0-&gt;ispp0 sensor1（lvds）-&gt;csi_dphy1-&gt;vicap lite-&gt;isp1-&gt;ispp1 sensor2（DVP）-&gt;vicap-&gt;isp2-&gt;ispp2

Referenzbeispiel:

bf2253-0(mipi)-&gt;dphy0-&gt;csi2-&gt;vicap(mipi)-&gt;isp0-&gt;ispp0 bf2253-1(mipi)-&gt;dphy1-&gt;isp1-&gt;ispp1 gc1054(dvp)-&gt;vicap(dvp)-&gt;isp2-&gt;ispp2

```text
  &i2c1 {
      status = "okay";
       clock-frequency = <400000>;
      gc1054: gc1054@21 {
                 compatible = "galaxycore,gc1054";
              reg = <0x21>;
                 clocks = <&cru CLK_CIF_OUT>;
              clock-names = "xvclk";
              power-domains = <&power RV1126_PD_VI>;
              pwdn-gpios  = <&gpio3 RK_PA5 GPIO_ACTIVE_HIGH>;
              reset-gpios = <&gpio3 RK_PA6 GPIO_ACTIVE_LOW>;
              rockchip,grf = <&grf>;
              pinctrl-names = "default";
              pinctrl-0 = <&cifm0_dvp_ctl>;
              rockchip,camera-module-index = <0>;
              rockchip,camera-module-facing = "back";
              rockchip,camera-module-name = "GC1054_B";
              rockchip,camera-module-lens-name = "GC1054_LEN";
                 port {
                      cam_para_out1: endpoint {
                      remote-endpoint = <&cif_para_in>;
                          bus-width = <10>;
                          hsync-active = <1>;
                          vsync-active = <1>;
              };
          };
      };
      bf2253_isp0: bf2253_isp0@6d {
            compatible = "ovti,bf2253_isp0";
            reg = <0x6d>;
            clocks = <&cru CLK_MIPICSI_OUT>;
            clock-names = "xvclk";
            power-domains = <&power RV1126_PD_VI>;
            pinctrl-names = "rockchip,camera_default";
            pinctrl-0   = <&mipicsi_clk0>;
            power-gpios = <&gpio3 RK_PA6 GPIO_ACTIVE_HIGH>;
            pwdn-gpios  = <&gpio1 RK_PD4 GPIO_ACTIVE_LOW>;
            reset-gpios = <&gpio1 RK_PD5 GPIO_ACTIVE_HIGH>;
            avdd-supply  = <&vcc_3v3>;
            dovdd-supply = <&vcc_1v8>;
            dvdd-supply  = <&vcc_1v8>;
            rockchip,camera-module-index = <1>;
            rockchip,camera-module-facing = "front";
            rockchip,camera-module-name = "LA6110PA";
            rockchip,camera-module-lens-name = "YM6011P";
            port {
                cam_out1: endpoint {
                      remote-endpoint = <&mipi_in_ucam>;
                      data-lanes = <1>;
                  };
            };
       };
  };
  &i2c3 {
      status = "okay";
      clock-frequency = <400000>;
      pinctrl-names = "default";
      pinctrl-0 = <&i2c3m2_xfer>;
      bf2253_isp1: bf2253_isp1@6d {
            compatible = "ovti,bf2253_isp1";
            reg = <0x6d>;
            clocks = <&cru CLK_MIPICSI_OUT>;
            clock-names = "xvclk";
            power-domains = <&power RV1126_PD_VI>;
            pinctrl-names = "rockchip,camera_default";
            //pinctrl-names = "rockchip,camera_sleep";
            pinctrl-0 = <&mipicsi_clk1>;
            power-gpios = <&gpio3 RK_PA6 GPIO_ACTIVE_HIGH>;
            pwdn-gpios  = <&gpio3 RK_PA4 GPIO_ACTIVE_LOW>;
            reset-gpios = <&gpio2 RK_PA0 GPIO_ACTIVE_HIGH>;
            avdd-supply  = <&vcc_3v3>;
            dovdd-supply = <&vcc_1v8>;
            dvdd-supply  = <&vcc_1v8>;
            rockchip,camera-module-index = <2>;
            rockchip,camera-module-facing = "front";
            rockchip,camera-module-name = "LA6110PA";
            rockchip,camera-module-lens-name = "YM6011P";
            port {
                 cam_out0: endpoint {
                     remote-endpoint = <&csi_dphy1_input>;
                     data-lanes = <1>;
                 };
            };
       };
  };
  &csi_dphy0 {
      status = "okay";
      ports {
          port@0 {
              mipi_in_ucam: endpoint@1 {
                  remote-endpoint = <&cam_out1>;
                  data-lanes = <1>;
              };
          };
          port@1 {
              csi_dphy0_out: endpoint@0 {
                  remote-endpoint = <&mipi_csi2_input>;
                  data-lanes = <1>;
              };
          };
      };
  };
  &csi_dphy1 {
      status = "okay";
      ports {
          port@0 {
              csi_dphy1_input: endpoint@1 {
                  remote-endpoint = <&cam_out0>;
                  data-lanes = <1>;
              };
          };
          port@1 {
              csi_dphy1_output: endpoint@0 {
                  remote-endpoint = <&isp_in1>;
                  data-lanes = <1>;
              };
          };
      };
  };
  &mipi_csi2 {
      status = "okay";
      ports {
          port@0 {
              mipi_csi2_input: endpoint@1 {
                  remote-endpoint = <&csi_dphy0_out>;
                  data-lanes = <1>;
              };
          };
          port@1 {
              mipi_csi2_output: endpoint@0 {
                  remote-endpoint = <&cif_mipi_in>;
                  data-lanes = <1>;
              };
          };
      };
  };
  &rkcif_mipi_lvds {
      status = "okay";
      port {
          cif_mipi_in: endpoint {
              remote-endpoint = <&mipi_csi2_output>;
              data-lanes = <1>;
          };
      };
  };
  &rkcif_mipi_lvds_sditf {
      status = "okay";
      port {
          lvds_sditf: endpoint {
              remote-endpoint = <&isp_in0>;
              data-lanes = <1>;
          };
      };
  };
  &rkcif_dvp {
          status = "okay";
          //iommus = <&rkcif_mmu>;
          ///delete-property/ memory-region;
          port {
                  /* Parallel bus endpoint */
                  cif_para_in: endpoint {
                          remote-endpoint = <&cam_para_out1>;
                          bus-width = <8>;
                          hsync-active = <1>;
                          vsync-active = <1>;
                  };
          };
  };
  &rkcif_dvp_sditf {
          status = "okay";
          port {
                  /* Parallel bus endpoint */
          dvp_sditf: endpoint {
                          remote-endpoint = <&isp_in2>;
                  };
          };
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in0: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&lvds_sditf>;
              };
          };
      };
  };
  &rkisp_vir1 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in1: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&csi_dphy1_output>;
              };
          };
      };
  };
  &rkisp_vir2 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in2: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&dvp_sditf>;
              };
          };
      };
  };
  &rkispp_vir0 {
      status = "okay";
  };
  &rkispp_vir1 {
      status = "okay";
  };
  &rkispp_vir2 {
          status = "okay";
  };
  &rkcif {
          status = "okay";
  };
  rkisp: rkisp@ffb50000 {
      status = "okay";
  };
  &rkispp {
      status = "okay";
      max-input = <1600 1200 30>;
      memory-region = <&isp_reserved>;
      /* the max input w h and fps of mulit sensor */
  };
   rkcif_mmu: iommu@ffae0800{
      status = "disabled";
  };
   rkisp_mmu: iommu@ffb51a00 {
      status = "disabled";
  };
  &rkispp_mmu {
      status = "disabled";
  };
```

##### 8.1.4.2 RK3566/RK3568

RK356X ISP unterstützt bei ausreichender Bandbreite bis zu vier Multiplexkanäle, ergänzbar über rkisp_vir0~rkisp_vir4 in RK3568.DTSI. Die Bereichsangabe der Quelle bleibt erhalten.

**MIPI- oder CIF-Eingang zum ISP ist wählbar.**

RK356X besitzt eine PHY mit 4 Lanes, die sich in zwei PHYs mit je 2 Lanes aufteilen lässt, sowie eine in der Quelle „DVD“ genannte Schnittstelle für BT601/BT656/BT1120. Der ISP unterstützt MIPI oder DVP, jedoch nicht gleichzeitig. VICAP unterstützt MIPI und DVP gleichzeitig. Damit können derzeit bis zu 3 RAW-Sensoren in die ISP-Verarbeitung eingehen.

###### 8.1.4.2.1 ISP-Verarbeitung zweier Eingänge

Referenzbeispiele:

ov5695-&gt;dphy1-&gt;isp_vir0 gc5025-&gt;dphy2-&gt;csi2-&gt;vicap-&gt;isp_vir1

```text
  ov5695: ov5695@36 {
          status = "okay";
          ...
          port {
              ov5695_out: endpoint {
                  remote-endpoint = <&dphy1_in>;
                  data-lanes = <1 2>;
              };
          };
  };
  gc5025: gc5025@37 {
          status = "okay";
          ...
          port {
              gc5025_out: endpoint {
                  remote-endpoint = <&dphy2_in>;
                  data-lanes = <1 2>;
              };
          };
  };
   &csi2_dphy_hw {
           status = "okay";
   };
  &csi2_dphy1 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy1_in: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&ov5695_out>;
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy1_out: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&isp0_in>;
              };
          };
      };
  };
  &csi2_dphy2 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy2_in: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&gc5025_out>;
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy2_out: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&mipi_csi2_input>;
              };
          };
      };
  };
  &mipi_csi2 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_input: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&dphy2_out>;
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_output: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&cif_mipi_in>;
                  data-lanes = <1 2>;
              };
          };
      };
  };
  &rkcif_mipi_lvds {
      status = "okay";
      port {
          cif_mipi_in: endpoint {
              remote-endpoint = <&mipi_csi2_output>;
              data-lanes = <1 2>;
          };
      };
  };
  &rkcif_mipi_lvds_sditf {
      status = "okay";
      port {
          mipi_lvds_sditf: endpoint {
              remote-endpoint = <&isp1_in>;
              data-lanes = <1 2>;
          };
      };
  };
  &rkisp {
      status = "okay";
      /* the max input w h and fps of mulit sensor */
      max-input = <2592 1944 30>;
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp0_in: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&dphy1_out>;
              };
          };
      };
  };
  &rkisp_vir1 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp1_in: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&mipi_lvds_sditf>;
              };
          };
      };
  };
```

###### 8.1.4.2.2 ISP-Verarbeitung dreier Eingänge

Referenzbeispiele:

gc2053(mipi)-&gt;dphy1-&gt;isp0 sc1330(dvp)-&gt;vicap(dvp)-&gt;isp1 ov5695(mipi)-&gt;dphy2-&gt;csi2-&gt;vicap(mipi)-&gt;isp2

```text
  &i2c2 {
      status = "okay";
      pinctrl-0 = <&i2c2m1_xfer>;
      /* split mode: lane0/1 */
      gc2053: gc2053@37 {
          status = "okay";
          compatible = "galaxycore,gc2053";
          reg = <0x37>;
          clocks = <&cru CLK_CAM0_OUT>;
          clock-names = "xvclk";
          /* Set pinctl of xvclk in &pinctl */
          power-domains = <&power RK3568_PD_VI>;
          reset-gpios = <&gpio4 RK_PB1 GPIO_ACTIVE_LOW>;
          pwdn-gpios = <&gpio3 RK_PD0 GPIO_ACTIVE_LOW>;
          /*power-gpios = <&gpio0 RK_PC1 GPIO_ACTIVE_HIGH>;*/
          rockchip,camera-module-index = <0>;
          rockchip,camera-module-facing = "front";
          rockchip,camera-module-name = "rgbd";
          rockchip,camera-module-lens-name = "Optics";
          port {
              gc2053_out: endpoint {
                  remote-endpoint = <&dphy1_in>;
                  data-lanes = <1 2>;
              };
          };
      };
  };
  &i2c3 {
      status = "okay";
      pinctrl-0 = <&i2c3m0_xfer>;
      sc1330: sc1330@32 {
          status = "okay";
          compatible = "smartsens,sc1330";
          reg = <0x32>;
          clocks = <&cru CLK_CIF_OUT>;
          clock-names = "xvclk";
          power-domains = <&power RK3568_PD_VI>;
          pinctrl-names = "default";
          /* conflict with gmac1m1_rgmii_pins & cif_clk*/
          pinctrl-0 = <&cif_clk &cif_dvp_clk &cif_dvp_bus10>;
          /*avdd-supply = <&vcc2v8_dvp>;*/
          /*dovdd-supply = <&vcc1v8_dvp>;*/
          /*dvdd-supply = <&vcc1v8_dvp>;*/
          reset-gpios = <&gpio4 RK_PA6 GPIO_ACTIVE_LOW>;
          pwdn-gpios = <&gpio3 RK_PC7 GPIO_ACTIVE_LOW>;
          rockchip,camera-module-index = <2>;
          rockchip,camera-module-facing = "back";
          rockchip,camera-module-name = "default";
          rockchip,camera-module-lens-name = "default";
          port {
              sc1330_out: endpoint {
                  remote-endpoint = <&dvp_in_bcam>;
              };
          };
      };
  };
  &i2c4 {
      status = "okay";
      pinctrl-0 = <&i2c4m0_xfer>;
      clock-frequency = <1000000>;
      /* split mode: lane:2/3 */
      ov5695: ov5695@36 {
                  status = "okay";
                  compatible = "ovti,ov5695";
                  reg = <0x36>;
                  clocks = <&cru CLK_CAM0_OUT>;
                  clock-names = "xvclk";
                  power-domains = <&power RK3568_PD_VI>;
                  pinctrl-names = "default";
                  pinctrl-0 = <&cif_clk>;
                  reset-gpios = <&gpio3 RK_PB0 GPIO_ACTIVE_HIGH>;
                  pwdn-gpios = <&gpio4 RK_PC6 GPIO_ACTIVE_HIGH>;
                  rockchip,camera-module-index = <1>;
                  rockchip,camera-module-facing = "front";
                  rockchip,camera-module-name = "TongJu";
                  rockchip,camera-module-lens-name = "CHT842-MD";
                  port {
                          ov5695_out: endpoint {
                                  remote-endpoint = <&dphy2_in>;
                                  data-lanes = <1 2>;
                          };
                  };
      };
  };
  &csi2_dphy_hw {
      status = "okay";
  };
  &csi2_dphy1 {
      status = "okay";
      /*
       * dphy1 only used for split mode,
       * can be used  concurrently  with dphy2
       * full mode and split mode are mutually exclusive
       */
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy1_in: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&gc2053_out>;
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy1_out: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&isp0_in>;
              };
          };
      };
  };
  &csi2_dphy2 {
      status = "okay";
      /*
       * dphy2 only used for split mode,
       * can be used  concurrently  with dphy1
       * full mode and split mode are mutually exclusive
       */
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy2_in: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&ov5695_out>;
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy2_out: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&mipi_csi2_input>;
              };
          };
      };
  };
  &mipi_csi2 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_input: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&dphy2_out>;
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_output: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&cif_mipi_in>;
                  data-lanes = <1 2>;
              };
          };
      };
  };
  &rkcif {
      status = "okay";
  };
  &rkcif_mmu {
      status = "okay";
  };
  &rkcif_mipi_lvds {
      status = "okay";
      /* csi2 link to rkcif, using rkcif to capture stream */
      port {
          cif_mipi_in: endpoint {
              remote-endpoint = <&mipi_csi2_output>;
              data-lanes = <1 2>;
          };
      };
  };
  &rkcif_mipi_lvds_sditf {
      status = "okay";
      port {
          mipi_lvds_sditf: endpoint {
              remote-endpoint = <&isp2_in>;
          };
      };
  };
  &rkcif_dvp {
      status = "okay";
      port {
          dvp_in_bcam: endpoint {
              remote-endpoint = <&sc1330_out>;
              bus-width = <10>;
              vsync-active = <0>;
              hsync-active = <1>;
          };
      };
  };
  &rkcif_dvp_sditf {
      status = "okay";
      /* parallel endpoint */
      port {
          dvp_sditf: endpoint {
              remote-endpoint = <&isp1_in>;
              bus-width = <10>;
              pclk-sample = <1>;
          };
      };
  };
  &rkisp {
      status = "okay";
      /* the max input w h and fps of mulit sensor */
      max-input = <1920 1080 30>;
  };
  &rkisp_mmu {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      port {
          #address-cells = <1>;
          #size-cells = <0>;
          isp0_in: endpoint@0 {
              reg = <0>;
              remote-endpoint = <&dphy1_out>;
          };
      };
  };
  &rkisp_vir1 {
      status = "okay";
      port {
          #address-cells = <1>;
          #size-cells = <0>;
          isp1_in: endpoint@0 {
              reg = <0>;
              remote-endpoint = <&dvp_sditf>;
          };
      };
  };
  &rkisp_vir2 {
      status = "okay";
      port {
          #address-cells = <1>;
          #size-cells = <0>;
          isp2_in: endpoint@0 {
              reg = <0>;
              remote-endpoint = <&mipi_lvds_sditf>;
          };
      };
  };
```

##### 8.1.4.3 RK3588

1\. Siehe Unterstützung mehrerer Sensoren auf RK3588; der Quellenverweis ist noch als ausstehend markiert.

2\. Siehe arch/arm64/boot/dts/rockchip/rk3588-evb1-cam-6x.dtsi.

3\. Für den Dual-ISP-Unite-Modus:

1) Zwei Kameras mit maximaler Auflösung 7424x2160 werden unterstützt.

2) 3/4 Kameras mit maximaler Auflösung 4864x1536 werden unterstützt.

Verwenden Sie die oben beschriebene Einzelkamera-DTS-Konfiguration des Unite-Modus und konfigurieren Sie anschließend die ISP-Knoten wie folgt:

```text
&rkisp0_vir1 {
     status = "okay";
     rockchip,hw = <&rkisp_unite>;
   //Other omissions
};
&rkisp0_vir2 {
     status = "okay";
     rockchip,hw = <&rkisp_unite>;
   //Other omissions
};
```

##### 8.1.4.4 RV1106

DTS-Referenz: arch/arm/boot/dts/rv1106-evb-dual-cam.dtsi

Der Hardware-ISP unterstützt zwei Kameras mit maximal 1080p. Bei höherer Auflösung muss ein Bild in zwei Rücklesedurchläufen verarbeitet werden. Dies benötigt mehr ISP-Durchsatz und Bandbreite und verringert die Ausgabebildrate.

##### 8.1.4.5 RK3562

DTS-Referenz: arch/arm64/boot/dts/rockchip/rk3562-evb2-ddr4-v10-dual-camera.dts

Zwei Kameras: maximale Auflösung 3840x2160.

Drei Kameras: maximale Auflösungen 3840x2160, 2688x1536 und 2688x1536.

Vier Kameras: maximale Auflösung 2688x1536.

### 8.2 Beschreibung des CIS-Treibers

Der Kamerasensor kommuniziert über I2C mit dem Hauptcontroller. Der Sensortreiber ist als I2C-Gerätetreiber implementiert und verwendet außerdem V4L2-Subdevices zur Kommunikation mit dem Hosttreiber.

#### 8.2.1 Kurze Beschreibung der Datentypen

##### 8.2.1.1 struct i2c_driver

[Beschreibung]

Definiert Informationen des I2C-Gerätetreibers.

[Definition]

```text
  struct i2c_driver {
      ……
      /* Standard driver model interfaces */
      int (*probe)(struct i2c_client *, const struct i2c_device_id *);
      int (*remove)(struct i2c_client *);
      ……
      struct device_driver driver;
      const struct i2c_device_id *id_table;
      ……
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p63, table unit 302 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| @driver | Enthält im Gerätetreibermodell hauptsächlich Treibername und of_match_table zum Abgleich mit dem im DTS registrierten Gerät. Stimmen die compatible-Felder von of_match_table und DTS überein, wird .probe aufgerufen. |
| @id_table | Liste unterstützter I2C-Geräte. Verwendet der Kernel nicht of_match_table und DTS-Geräteregistrierung zum Abgleich, verwendet er diese Tabelle. |
| @probe | Callback zur Gerätebindung |
| @remove | Callback zum Aufheben der Gerätebindung |

[Beispiel]

```text
  #if IS_ENABLED(CONFIG_OF)
  static const struct of_device_id os04a10_of_match[] = {
      { .compatible = "ovti,os04a10" },
      {},
  };
  MODULE_DEVICE_TABLE(of, os04a10_of_match);
  #endif
  static const struct i2c_device_id os04a10_match_id[] = {
      { "ovti,os04a10", 0 },
      { },
  };
  static struct i2c_driver os04a10_i2c_driver = {
      .driver = {
          .name = OS04A10_NAME,
          .pm = &os04a10_pm_ops,
          .of_match_table = of_match_ptr(os04a10_of_match),
      },
      .probe        = &os04a10_probe,
      .remove        = &os04a10_remove,
      .id_table    = os04a10_match_id,
  };
  static int __init sensor_mod_init(void)
  {
      return i2c_add_driver(&os04a10_i2c_driver);
  }
  static void __exit sensor_mod_exit(void)
  {
      i2c_del_driver(&os04a10_i2c_driver);
  }
  device_initcall_sync(sensor_mod_init);
  module_exit(sensor_mod_exit);
```

##### 8.2.1.2 struct v4l2_subdev_ops

[Beschreibung]

Definiert die Operations-Callbacks für Subdevices.

[Definition]

```text
  struct v4l2_subdev_ops {
      const struct v4l2_subdev_core_ops    *core;
      ……
      const struct v4l2_subdev_video_ops    *video;
      ……
      const struct v4l2_subdev_pad_ops    *pad;
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p64, table unit 312 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .core | Definiert die Core-Operations-Callbacks für Subdevices |
| .video | Callbacks bei Öffnung des V4L-Geräts im Videomodus |
| .pad | Operationen auf Pad-Ebene eines V4L2-Subdevices |

[Beispiel]

```text
  static const struct v4l2_subdev_ops os04a10_subdev_ops = {
      .core    = &os04a10_core_ops,
      .video    = &os04a10_video_ops,
      .pad    = &os04a10_pad_ops,
  };
```

##### 8.2.1.3 struct v4l2_subdev_core_ops

[Beschreibung]

Definiert die Core-Operations-Callbacks für Subdevices.

[Definition]

```text
  struct v4l2_subdev_core_ops {
      ……
      int (*s_power)(struct v4l2_subdev *sd, int on);
      long (*ioctl)(struct v4l2_subdev *sd, unsigned int cmd, void *arg);
  #ifdef CONFIG_COMPAT
      long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd,
          unsigned long arg);
  #endif
      ……
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p65, table unit 321 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .s_power | Versetzt das Subdevice in den Energiesparmodus (on == 0) oder Normalbetrieb (on == 1). |
| .ioctl | Wird am Ende der ioctl()-Systemaufrufbehandlung im V4L2-Kern aufgerufen und unterstützt treiberspezifische private ioctls. |
| .compat_ioctl32 | Wird bei einer 32-Bit-Anwendung auf einem 64-Bit-Kernel aufgerufen, um Daten beim Austausch mit dem Userspace anzupassen. |

[Beispiel]

```text
  static const struct v4l2_subdev_core_ops os04a10_core_ops = {
      .s_power = os04a10_s_power,
      .ioctl = os04a10_ioctl,
  #ifdef CONFIG_COMPAT
      .compat_ioctl32 = os04a10_compat_ioctl32,
  #endif
  };
```

Folgende private ioctls dienen derzeit zur Abfrage von Modulinformationen sowie zum Setzen von OTP-Informationen.

<!-- Source: English PDF p66, table unit 325 -->

| Privates ioctl | Beschreibung |
| --- | --- |
| RKMODULE_GET_MODULE_INFO | Modulinformationen; siehe struct rkmodule_inf. |
| RKMODULE_AWB_CFG | AWB-Kompensation des Sensors umschalten. Ist im Modul kein Golden-AWB-Wert programmiert, kann er hier gesetzt werden. Siehe struct rkmodule_awb_cfg. |
| RKMODULE_LSC_CFG | LSC-Kompensation des Sensors umschalten; siehe struct rkmodule_lsc_cfg. |
| PREISP_CMD_SET_HDRAE_EXP | HDR-Belichtung setzen; siehe struct preisp_hdrae_exp_s. |
| RKMODULE_SET_HDR_CFG | Zwischen Normal- und HDR-Modus umschalten. Der Treiber muss beide Konfigurationsgruppen unterstützen; siehe struct rkmodule_hdr_cfg. |
| RKMODULE_GET_HDR_CFG | Aktuellen HDR-Modus abfragen; siehe struct rkmodule_hdr_cfg. |
| RKMODULE_SET_CONVERSION_GAIN | Konversionsverstärkung im linearen Modus setzen, etwa für IMX347 oder OS04A10. Ohne Sensorunterstützung kann die Implementierung entfallen. |

##### 8.2.1.4 struct v4l2_subdev_video_ops

[Beschreibung]

Callbacks bei Öffnung des V4L-Geräts im Videomodus.

[Definition]

```text
  struct v4l2_subdev_video_ops {
      ……
      int (*s_stream)(struct v4l2_subdev *sd, int enable);
      ……
      int (*g_frame_interval)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_frame_interval *interval);
      int (*g_mbus_config)(struct v4l2_subdev *sd,
                 struct v4l2_mbus_config *cfg);
   ……
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p67, table unit 332 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .g_frame_interval | Callback der ioctl-Behandlung VIDIOC_SUBDEV_G_FRAME_INTERVAL |
| .s_stream | Meldet dem Treiber den bevorstehenden Start oder erfolgten Stopp eines Videostreams |
| .g_mbus_config | Unterstützte Media-Bus-Konfigurationen abfragen |

[Beispiel]

```text
  static const struct v4l2_subdev_video_ops os04a10_video_ops = {
      .s_stream = os04a10_s_stream,
      .g_frame_interval = os04a10_g_frame_interval,
      .g_mbus_config = os04a10_g_mbus_config,
  };
```

##### 8.2.1.5 struct v4l2_subdev_pad_ops

[Beschreibung]

Operationen auf Pad-Ebene eines V4L2-Subdevices.

[Definition]

```text
  struct v4l2_subdev_pad_ops {
      ……
      int (*enum_mbus_code)(struct v4l2_subdev *sd,
                 struct v4l2_subdev_pad_config *cfg,
                 struct v4l2_subdev_mbus_code_enum *code);
      int (*enum_frame_size)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_pad_config *cfg,
                  struct v4l2_subdev_frame_size_enum *fse);
      int (*get_fmt)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_pad_config *cfg,
                  struct v4l2_subdev_format *format);
      int (*set_fmt)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_pad_config *cfg,
                  struct v4l2_subdev_format *format);
      int (*enum_frame_interval)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_pad_config *cfg,
                  struct v4l2_subdev_frame_interval_enum *fie);
      int (*get_selection)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_pad_config *cfg,
                  struct v4l2_subdev_selection *sel);
      ……
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p68, table unit 341 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| . enum_mbus_code | Callback der ioctl-Behandlung VIDIOC_SUBDEV_ENUM_MBUS_CODE |
| . enum_frame_size | Callback der ioctl-Behandlung VIDIOC_SUBDEV_ENUM_FRAME_SIZE |
| .s_fmt | Callback der ioctl-Behandlung VIDIOC_SUBDEV_S_FMT |
| .g_fmt | Callback der ioctl-Behandlung VIDIOC_SUBDEV_G_FMT |
| .enum_frame_interval | Callback der ioctl-Behandlung VIDIOC_SUBDEV_ENUM_FRAME_INTERVAL() |
| .get_selection | Callback der ioctl-Behandlung VIDIOC_SUBDEV_G_SELECTION() |

[Beispiel]

```text
  static const struct v4l2_subdev_pad_ops os04a10_pad_ops = {
      .enum_mbus_code = os04a10_enum_mbus_code,
      .enum_frame_size = os04a10_enum_frame_sizes,
      .enum_frame_interval = os04a10_enum_frame_interval,
      .get_fmt = os04a10_get_fmt,
      .set_fmt = os04a10_set_fmt,
  };
```

##### 8.2.1.6 struct v4l2_ctrl_ops

[Beschreibung]

Steuerungsoperationen, die der Treiber bereitstellen muss.

[Definition]

```text
  struct v4l2_ctrl_ops {
      int (*s_ctrl)(struct v4l2_ctrl *ctrl);
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p68, table unit 350 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .s_ctrl | Setzt den neuen Steuerwert tatsächlich. |

[Beispiel]

```text
  static const struct v4l2_ctrl_ops os04a10_ctrl_ops = {
      .s_ctrl = os04a10_set_ctrl,
  };
```

Der RKISP-Treiber verlangt die Benutzer-Steuerelemente des Frameworks. Der Sensortreiber muss die folgenden Steuerfunktionen implementieren; siehe Liste 1 der V4L2-Controls des CIS-Treibers. Der Quellenverweis ist noch als ausstehend markiert.

##### 8.2.1.7 struct xxxx_mode

[Beschreibung]

Informationen zu den einzelnen vom Sensor unterstützten Modi.

Diese Struktur ist in Sensortreibern üblich, obwohl der V4L2-Standard sie nicht verlangt. Mit zusätzlichen Funktionen können nach Bedarf weitere Variablen ergänzt werden.

[Definition]

```text
  struct xxxx_mode {
      u32 bus_fmt;
      u32 width;
      u32 height;
      struct v4l2_fract max_fps;
      u32 hts_def;
      u32 vts_def;
      u32 exp_def;
      const struct regval *reg_list;
      u32 hdr_mode;
      u32 vc[PAD_MAX];
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p69, table unit 361 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .bus_fmt | Sensorausgabeformat; siehe MEDIA_BUS_FMT-Tabelle. Der Quellenverweis ist noch als ausstehend markiert. |
| .width | Aktive Bildbreite; muss der aktuell konfigurierten Sensorausgabe entsprechen |
| .height | Aktive Bildhöhe; muss der aktuell konfigurierten Sensorausgabe entsprechen |
| .max_fps | Bildrate; denominator/numerator ergibt fps |
| hts_def | Standard-HTS: aktive Bildbreite + HBLANK |
| vts_def | Standard-VTS: aktive Bildhöhe + VBLANK |
| exp_def | Standardbelichtungszeit |
| *reg_list | Registerliste |
| .hdr_mode | Sensorbetriebsmodus: linear, HDR aus zwei oder HDR aus drei Bildern |
| .vc[PAD_MAX] | MIPI-VC-Kanal konfigurieren |

[Beispiel]

```text
   enum os04a10_max_pad {
      PAD0, /* link to isp */
      PAD1, /* link to csi rawwr0 | hdr x2:L x3:M */
      PAD2, /* link to csi rawwr1 | hdr    x3:L */
      PAD3, /* link to csi rawwr2 | hdr x2:M x3:S */
      PAD_MAX,
  };
  static const struct os04a10_mode supported_modes[] = {
      {
          .bus_fmt = MEDIA_BUS_FMT_SBGGR12_1X12,
          .width = 2688,
          .height = 1520,
          .max_fps = {
              .numerator = 10000,
              .denominator = 300372,
          },
          .exp_def = 0x0240,
          .hts_def = 0x05c4 * 2,
          .vts_def = 0x0984,
          .reg_list = os04a10_linear12bit_2688x1520_regs,
          .hdr_mode = NO_HDR,
          .vc[PAD0] = V4L2_MBUS_CSI2_CHANNEL_0,
      }, {
          .bus_fmt = MEDIA_BUS_FMT_SBGGR12_1X12,
          .width = 2688,
          .height = 1520,
          .max_fps = {
              .numerator = 10000,
              .denominator = 225000,
          },
          .exp_def = 0x0240,
          .hts_def = 0x05c4 * 2,
          .vts_def = 0x0658,
          .reg_list = os04a10_hdr12bit_2688x1520_regs,
          .hdr_mode = HDR_X2,
          .vc[PAD0] = V4L2_MBUS_CSI2_CHANNEL_1,
          .vc[PAD1] = V4L2_MBUS_CSI2_CHANNEL_0,//L->csi wr0
          .vc[PAD2] = V4L2_MBUS_CSI2_CHANNEL_1,
          .vc[PAD3] = V4L2_MBUS_CSI2_CHANNEL_1,//M->csi wr2
      },
  };
```

##### 8.2.1.8 struct v4l2_mbus_framefmt

[Beschreibung]

Bildformat auf dem Media-Bus.

[Definition]

```text
  struct v4l2_mbus_framefmt {
      __u32            width;
      __u32            height;
      __u32            code;
      __u32            field;
      __u32            colorspace;
      __u16            ycbcr_enc;
      __u16            quantization;
      __u16            xfer_func;
      __u16            reserved[11];
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p71, table unit 371 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| width | Bildbreite |
| height | Bildhöhe |
| code | Siehe MEDIA_BUS_FMT-Tabelle |
| field | V4L2_FIELD_NONE: Vollbildausgabe; V4L2_FIELD_INTERLACED: Halbbildausgabe |

[Beispiel]

##### 8.2.1.9 struct rkmodule_base_inf

[Beschreibung]

Grundlegende Modulinformationen, anhand derer die höhere Schicht die passende IQ-Konfiguration auswählt.

[Definition]

```text
  struct rkmodule_base_inf {
      char sensor[RKMODULE_NAME_LEN];
      char module[RKMODULE_NAME_LEN];
      char lens[RKMODULE_NAME_LEN];
  } __attribute__ ((packed));
```

[Wichtige Mitglieder]

<!-- Source: English PDF p71, table unit 379 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| sensor | Sensorname aus dem Sensortreiber |
| module | Modulname aus dem DTS; maßgeblich sind die tatsächlichen Modulinformationen |
| lens | Objektivname aus dem DTS gemäß Moduldaten |

[Beispiel]

##### 8.2.1.10 struct rkmodule_fac_inf

[Beschreibung]

OTP-Werksinformationen des Moduls.

[Definition]

```text
  struct rkmodule_fac_inf {
      __u32 flag;
      char module[RKMODULE_NAME_LEN];
      char lens[RKMODULE_NAME_LEN];
      __u32 year;
      __u32 month;
      __u32 day;
  } __attribute__ ((packed));
```

[Wichtige Mitglieder]

<!-- Source: English PDF p72, table unit 387 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| flag | Gültigkeitskennzeichen dieser Informationsgruppe |
| module | Modulname; OTP-Kennnummer lesen und daraus den Modulnamen bestimmen |
| lens | Objektivname; OTP-Kennnummer lesen und daraus den Objektivnamen bestimmen |
| year | Produktionsjahr, beispielsweise 12 für 2012 |
| month | Produktionsmonat |
| day | Produktionstag |

[Beispiel]

##### 8.2.1.11 struct rkmodule_awb_inf

[Beschreibung]

AWB-Messinformationen aus dem Modul-OTP.

[Definition]

```text
  struct rkmodule_awb_inf {
      __u32 flag;
      __u32 r_value;
      __u32 b_value;
      __u32 gr_value;
      __u32 gb_value;
      __u32 golden_r_value;
      __u32 golden_b_value;
      __u32 golden_gr_value;
      __u32 golden_gb_value;
  } __attribute__ ((packed));
```

[Wichtige Mitglieder]

<!-- Source: English PDF p73, table unit 395 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| flag | Gültigkeitskennzeichen dieser Informationsgruppe |
| r_value | AWB-R-Messinformation des aktuellen Moduls |
| b_value | AWB-B-Messinformation des aktuellen Moduls |
| gr_value | AWB-GR-Messinformation des aktuellen Moduls |
| gb_value | AWB-GB-Messinformation des aktuellen Moduls |
| golden_r_value | AWB-R-Messinformation eines typischen Moduls; falls nicht programmiert, 0 setzen |
| golden_b_value | AWB-B-Messinformation eines typischen Moduls; falls nicht programmiert, 0 setzen |
| golden_gr_value | AWB-GR-Messinformation eines typischen Moduls; falls nicht programmiert, 0 setzen |
| golden_gb_value | AWB-GB-Messinformation eines typischen Moduls; falls nicht programmiert, 0 setzen |

[Beispiel]

##### 8.2.1.12 struct rkmodule_lsc_inf

[Beschreibung]

LSC-Messinformationen aus dem Modul-OTP.

[Definition]

```text
  struct rkmodule_lsc_inf {
      __u32 flag;
      __u16 lsc_w;
      __u16 lsc_h;
      __u16 decimal_bits;
      __u16 lsc_r[RKMODULE_LSCDATA_LEN];
      __u16 lsc_b[RKMODULE_LSCDATA_LEN];
      __u16 lsc_gr[RKMODULE_LSCDATA_LEN];
      __u16 lsc_gb[RKMODULE_LSCDATA_LEN];
  } __attribute__ ((packed));
```

[Wichtige Mitglieder]

<!-- Source: English PDF p74, table unit 403 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| flag | Gültigkeitskennzeichen dieser Informationsgruppe |
| lsc_w | Tatsächliche Breite der LSC-Tabelle |
| lsc_h | Tatsächliche Höhe der LSC-Tabelle |
| decimal_bits | Anzahl der Nachkommastellen der LSC-Messinformation; falls nicht verfügbar, 0 setzen |
| lsc_r | LSC-R-Messinformation |
| lsc_b | LSC-B-Messinformation |
| lsc_gr | LSC-GR-Messinformation |
| lsc_gb | LSC-GB-Messinformation |

[Beispiel]

##### 8.2.1.13 struct rkmodule_af_inf

[Beschreibung]

AF-Messinformationen aus dem Modul-OTP.

[Definition]

```text
  struct rkmodule_af_inf {
      __u32 flag; // The identity of whether the group information is valid
      __u32 vcm_start; // VCM start-up current
      __u32 vcm_end; // VCM terminates the current
      __u32 vcm_dir; // VCM determination direction
  } __attribute__ ((packed));
```

[Wichtige Mitglieder]

<!-- Source: English PDF p74, table unit 411 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| flag | Gültigkeitskennzeichen dieser Informationsgruppe |
| vcm_start | VCM-Anlaufstrom |
| vcm_end | VCM-Endstrom |
| vcm_dir | VCM-Bestimmungsrichtung |

[Beispiel]

##### 8.2.1.14 struct rkmodule_inf

[Beschreibung]

Modulinformationen.

[Definition]

```text
  struct rkmodule_inf {
      struct rkmodule_base_inf base;
      struct rkmodule_fac_inf fac;
      struct rkmodule_awb_inf awb;
      struct rkmodule_lsc_inf lsc;
      struct rkmodule_af_inf af;
  } __attribute__ ((packed));
```

[Wichtige Mitglieder]

<!-- Source: English PDF p75, table unit 419 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| base | Grundlegende Modulinformationen |
| fac | OTP-Werksinformationen des Moduls |
| awb | AWB-Messinformationen aus dem Modul-OTP |
| lsc | LSC-Messinformationen aus dem Modul-OTP |
| af | AF-Messinformationen aus dem Modul-OTP |

[Beispiel]

##### 8.2.1.15 struct rkmodule_awb_cfg

[Beschreibung]

AWB-Konfigurationsinformationen aus dem Modul-OTP.

[Definition]

```text
  struct rkmodule_awb_cfg {
      __u32 enable;
      __u32 golden_r_value;
      __u32 golden_b_value;
      __u32 golden_gr_value;
      __u32 golden_gb_value;
  } __attribute__ ((packed));
```

[Wichtige Mitglieder]

<!-- Source: English PDF p76, table unit 427 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| enable | Gibt an, ob AWB-Korrektur aktiviert ist |
| golden_r_value | AWB-R-Messinformation eines typischen Moduls |
| golden_b_value | AWB-B-Messinformation eines typischen Moduls |
| golden_gr_value | AWB-GR-Messinformation eines typischen Moduls |
| golden_gb_value | AWB-GB-Messinformation eines typischen Moduls |

[Beispiel]

##### 8.2.1.16 struct rkmodule_lsc_cfg

[Beschreibung]

[Definition]

[Wichtige Mitglieder]

[Beispiel]

[Beschreibung]

[Definition]

[Wichtige Mitglieder]

[Beispiel]

## 9. Unterschiede zwischen Chipversionen

<!-- Source: English PDF p77, table unit 439 -->

| SoC | VI-IP | VI-Schnittstelle | Maximale Bayer-CIS-<br>Auflösung | Merkmal |
| --- | --- | --- | --- | --- |
| RV1109 | ISP20 ( ISP +<br>ISPP): 1<br>VICAP Full: 1<br>VICAP Lite: 1 | MIPI DPHY:<br>2 x 4Lanes 2.5Gbps/Lane<br>LVDS:<br>2 x 4Lanes 1.0Gbps/Lane<br>DVP:<br>BT601 / BT656 / BT1120<br>pclk: 150MHz | 3072x2048 | HDR mit bis zu<br>3 Bildern |
| RK3566 | ISP21 Lite: 1<br>VICAP Full: 1 | MIPI DPHY:<br>2 x 2Lanes oder 1 x 4Lanes<br>2.5Gbps/Lane<br>DVP:<br>BT601 / BT656 / BT1120<br>pclk: 150MHz | 4096x3072 | Kein HDR |
| RK3568 | ISP21：1<br>VICAP Full: 1 | MIPI DPHY:<br>2 x 2Lanes oder 1 x 4Lanes<br>2.5Gbps/Lane<br>DVP:<br>BT601 / BT656 / BT1120<br>pclk: 150MHz | 4096x3072 | HDR mit bis zu<br>2 Bildern |
| RV1126 | ISP20 ( ISP +<br>ISPP): 1<br>VICAP Full: 1<br>VICAP Lite: 1 | MIPI DPHY:<br>2 x 4Lanes 2.5Gbps/Lane<br>LVDS:<br>2 x 4Lanes 1.0Gbps/Lane<br>DVP:<br>BT601 / BT656 / BT1120<br>pclk: 150MHz | 4416x3312 | HDR mit bis zu<br>3 Bildern |

## 10. CIS-Treiber (CMOS-Bildsensor)

### 10.1 CIS-Geräteregistrierung (DTS)

#### 10.1.1 Einzelregistrierung

##### 10.1.1.1 MIPI-Schnittstelle

Auf RV1126 und RV1106 gibt es zwei unabhängige vollständige standardkonforme physische MIPI-CSI2-DPHYs. Sie entsprechen csi_dphy0 und csi_dphy1 im DTS; siehe RV1126.dtsi. Eigenschaften:

Höchstens 4 Daten-Lanes.

Maximale Datenrate 2.5Gbps/lane.

RK356X besitzt nur eine standardkonforme physische MIPI-CSI2-DPHY. Sie arbeitet im vollständigen oder aufgeteilten Modus und kann drei logische DPHYs bilden: csi2_dphy0/csi2_dphy1/csi2_dphy2; siehe rk3568.dtsi. Eigenschaften:

**Vollständiger Modus**

Nur csi2_dphy0 verwenden. csi2_dphy0 und csi2_dphy1/csi2_dphy2 schließen sich gegenseitig aus und dürfen nicht gleichzeitig verwendet werden.

Höchstens 4 Daten-Lanes.

Maximale Datenrate 2.5Gbps/lane.

**Aufgeteilter Modus**

Nur csi2_dphy1 und csi2_dphy2 verwenden; sie schließen die gleichzeitige Verwendung von csi2_dphy0 aus.

csi2_dphy1 und csi2_dphy2 können gleichzeitig verwendet werden.

csi2_dphy1 und csi2_dphy2 besitzen jeweils höchstens 2 Daten-Lanes.

csi2_dphy1 entspricht lane0/lane1 der physischen DPHY.

csi2_dphy2 entspricht lane2/lane3 der physischen DPHY.

Maximale Datenrate 2.5Gbps/lane.

Konkrete DTS-Anwendungsfälle zeigen die folgenden Beispiele.

###### 10.1.1.1.1 Verknüpfung mit dem ISP

**Plattform RV1126/RV1106**

Nachfolgend dienen RV1126 ISP und os04a10 als Beispiel.

**Verknüpfung: sensor-&gt;csi_dphy-&gt;isp-&gt;ispp**

arch/arm/boot/dts/RV1126-evb-v10.dtsi

**Wichtige Konfigurationspunkte**

data-lanes muss die Anzahl verwendeter Lanes angeben; andernfalls wird die Schnittstelle nicht als MIPI erkannt.

```text
  cam_ircut0: cam_ircut {
      status = "okay";
      compatible = "rockchip,ircut";
      ircut-open-gpios = <&gpio2 RK_PA7 GPIO_ACTIVE_HIGH>;
      ircut-close-gpios = <&gpio2 RK_PA6 GPIO_ACTIVE_HIGH>;
      rockchip,camera-module-index = <1>;
      rockchip,camera-module-facing = "front";
  };
  os04a10: os04a10@36 {
      // Need to be consistent with the matching string in the driver
      compatible = "ovti,os04a10";
      reg = <0x36>;// sensor I2CDevice address, 7 bits
      clocks = <&cru CLK_MIPICSI_OUT>;// sensor clickinConfiguration
      clock-names = "xvclk";
      power-domains = <&power RV1126_PD_VI>;
      pinctrl-names = "rockchip,camera_default";
      pinctrl-0 = <&mipi_csi_clk0>;// pinctl Set up
      //power supply
      avdd-supply = <&vcc_avdd>;
      dovdd-supply = <&vcc_dovdd>;
      dvdd-supply = <&vcc_dvdd>;
      // power Pin assignment and effective level
      pwdn-gpios = <&gpio1 RK_PD4 GPIO_ACTIVE_HIGH>;
      // Module number, this number should not be repeated
      rockchip,camera-module-index = <1>;
      // Module orientation which are "back" and "front"
      rockchip,camera-module-facing = "front";
      // name of moudle
      rockchip,camera-module-name = "CMK-OT1607-FV1";
      // lens name
      rockchip,camera-module-lens-name = "M12-4IR-4MP-F16";
      //ir cut device
      ir-cut = <&cam_ircut0>;
      port {
          ucam_out0: endpoint {
              // mipi dphy port
              remote-endpoint = <&mipi_in_ucam0>;
              // number of mipi lane，1lane is <1>, 4lanei s <1 2 3 4>
              data-lanes = <1 2 3 4>;
          };
      };
   };
  &csi_dphy0 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_in_ucam0: endpoint@1 {
                  reg = <1>;
                  // The port name of the sensor
                  remote-endpoint = <&ucam_out0>;
                  // mipi lane number，1lane is <1>, 4lane is <1 2 3 4>
                  data-lanes = <1 2 3 4>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              csidphy0_out: endpoint@0 {
                  reg = <0>;
                  // name of isp port
                  remote-endpoint = <&isp_in>;
              };
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  // name of mipi dphy port
                  remote-endpoint = <&csidphy0_out>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp0_out: endpoint@1 {
                  reg = <1>;
                  // ispp port name, isp output to ispp
                  remote-endpoint = <&ispp0_in>;
              };
          };
      };
  };
  &rkispp {
      status = "okay";
  };
  &rkispp_vir0 {
      status = "okay";
      port {
          #address-cells = <1>;
          #size-cells = <0>;
          Ispp0_in: endpoint@0 {
              reg = <0>;
              // isp port name, ispp input
              remote-endpoint = <&isp0_out>;
          };
      };
  };
```

**Plattform RK356X**

Als Beispiel dienen rk3566 ISP und gc8034 mit 4 Lanes:

**Verknüpfung: sensor-&gt;csi2_dphy0-&gt;isp; wichtige Konfigurationspunkte**

data-lanes muss konfiguriert werden.

Der Knoten csi2_dphy_hw muss aktiviert werden.

```text
      /* full mode: lane0-3 */
      gc8034: gc8034@37 {
          //Need to be consistent with the matching string in the driver
          compatible = "galaxycore,gc8034";
          status = "okay";
          // sensor I2C device address, 7 bits
          reg = <0x37>;
          // sensor mclk Source configuration
          clocks = <&cru CLK_CIF_OUT>;
          clock-names = "xvclk";
          //sensor Related power domain enable
          power-domains = <&power RK3568_PD_VI>;
          //sensor mclk pinctl set up
          pinctrl-names = "default";
          pinctrl-0 = <&cif_clk>;
          // resetPin assignment and effective level
          reset-gpios = <&gpio3 RK_PA6 GPIO_ACTIVE_LOW>;
          // powerdownPin assignment and effective level
          pwdn-gpios = <&gpio4 RK_PB2 GPIO_ACTIVE_LOW>;
          // Module number, this number should not be repeated
          rockchip,camera-module-index = <0>;
          // Module orientation, there are "back" and "front"
          rockchip,camera-module-facing = "back";
          // moudle name
          rockchip,camera-module-name = "RK-CMK-8M-2-v1";
          // lens name
          rockchip,camera-module-lens-name = "CK8401";
          port {
              gc8034_out: endpoint {
                  // csi2 dphy port name
                  remote-endpoint = <&dphy0_in>;
                  // csi2 dphy lane number，1lane is <1>, 4lane is <1 2 3 4>
                  data-lanes = <1 2 3 4>;
              };
          };
      };
      &csi2_dphy_hw {
         status = "okay";
      };
      &csi2_dphy0 {
          //csi2_dphy0 is not used simultaneously with csi2_dphy1/csi2_dphy2, mutually exclusive
          status = "okay";
          /*
           * dphy0 only used for full mode,
           * full mode and split mode are mutually exclusive
           */
          ports {
              #address-cells = <1>;
              #size-cells = <0>;
              port@0 {
                  reg = <0>;
                  #address-cells = <1>;
                  #size-cells = <0>;
                  dphy0_in: endpoint@1 {
                      reg = <1>;
                      // The port name of the sensor
                      remote-endpoint = <&gc8034_out>;
                      // csi2 dphy lane number
                      data-lanes = <1 2 3 4>;
                  };
              };
              port@1 {
                  reg = <1>;
                  #address-cells = <1>;
                  #size-cells = <0>;
                  dphy0_out: endpoint@1 {
                      reg = <1>;
                      // The port name of the isp
                      remote-endpoint = <&isp0_in>;
                  };
              };
          };
      };
  &rkisp {
      status = "okay";
  };
  &rkisp_mmu {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      port {
          #address-cells = <1>;
          #size-cells = <0>;
          isp0_in: endpoint@0 {
              reg = <0>;
              // The port name of csi2 dphy
              remote-endpoint = <&dphy0_out>;
          };
      };
  };
```

###### 10.1.1.1.2 Verknüpfung mit VICAP

**Plattform RV1126/RV1109**

Beispiel für die Verbindung des MIPI-os04a10 mit 4 Lanes zu VICAP:

**Verknüpfung: sensor-&gt;csi dphy-&gt;mipi csi host-&gt;vicap; wichtige Konfigurationspunkte**

data-lanes muss die Anzahl verwendeter Lanes angeben; andernfalls wird die Schnittstelle nicht als MIPI erkannt.

Die DPHY muss mit dem CSI-Host-Knoten verknüpft werden.

```text
  os04a10: os04a10@36 {
          // Need to be consistent with the matching string in the driver
          compatible = "ovti,os04a10";
          // sensor I2C device address, 7 bits
          reg = <0x36>;
          // sensor mclkSource configuration
          clocks = <&cru CLK_MIPICSI_OUT>;
          clock-names = "xvclk";
          //sensor Related power domain enable
          power-domains = <&power RV1126_PD_VI>;
          avdd-supply = <&vcc_avdd>;
          dovdd-supply = <&vcc_dovdd>;
          dvdd-supply = <&vcc_dvdd>;
          //sensor mclk pinctlset up
          pinctrl-names = "rockchip,camera_default";
          pinctrl-0 = <&mipicsi_clk0>;
          // powerdownPin assignment and effective level
          pwdn-gpios = <&gpio1 RK_PD4 GPIO_ACTIVE_HIGH>;
          // Module number, this number should not be repeated
          rockchip,camera-module-index = <1>;
          // Module orientation, there are "back" and "front"
          rockchip,camera-module-facing = "front";
          // module name
          rockchip,camera-module-name = "CMK-OT1607-FV1";
          // lens name
          rockchip,camera-module-lens-name = "M12-40IRC-4MP-F16";
          // ircut name
          ir-cut = <&cam_ircut0>;
          port {
              ucam_out0: endpoint {
                  // csi2 dphy port name
                  remote-endpoint = <&mipi_in_ucam0>;
                  // csi2 dphy lane number，1lane is <1>, 4lane is  <1 2 3 4>
                  data-lanes = <1 2 3 4>;
              };
          };
      };
  &csi_dphy0 {
      //csi2_dphy0 is not simultaneous use with csi2_dphy1/csi2_dphy2 , mutually exclusive
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_in_ucam0: endpoint@1 {
                  reg = <1>;
                  // The port name of the sensor
                  remote-endpoint = <&ucam_out0>;
                  // csi2 dphy lane number
                  data-lanes = <1 2 3 4>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              csidphy0_out: endpoint@0 {
                  reg = <0>;
                  // csi2 host port name
                  remote-endpoint = <&mipi_csi2_input>;
              };
          };
      };
  };
  &mipi_csi2 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_input: endpoint@1 {
                  reg = <1>;
                  // csi2 dphy port name
                  remote-endpoint = <&csidphy0_out>;
                  // csi2 host lane number
                  data-lanes = <1 2 3 4>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_output: endpoint@0 {
                  reg = <0>;
                  // Port name on the vicap side
                  remote-endpoint = <&cif_mipi_in>;
                  // csi2 host lane number
                  data-lanes = <1 2 3 4>;
              };
          };
      };
  };
  &rkcif_mipi_lvds {
      status = "okay";
      port {
          /* MIPI CSI-2 endpoint */
          cif_mipi_in: endpoint {
              // csi2 hostport name
              remote-endpoint = <&mipi_csi2_output>;
              // vicap lane number
              data-lanes = <1 2 3 4>;
          };
      };
  };
  &rkcif_mipi_lvds_sditf {
      status = "okay";
      port {
          /* sditf endpoint */
          mipi_lvds_sditf: endpoint {
              //isp Virtual device port name
              remote-endpoint = <&isp_in>;
              //mipi csi2 dphy lane number, consistent with sensor
              data-lanes = <1 2 3 4>;
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  //Endpoint name of vicap sditf
                  remote-endpoint = <&mipi_lvds_sditf>;
              };
          };
      };
  };
```

**Plattform RK356X**

Beispiel für gc5025 mit 2 Lanes an lane2/lane3 der MIPI-CSI2-DPHY auf rk3566 evb2:

**Verknüpfung: sensor-&gt;csi2 dphy-&gt;mipi csi host-&gt;vicap; wichtige Konfigurationspunkte**

data-lanes muss die Anzahl verwendeter Lanes angeben; andernfalls wird die Schnittstelle nicht als MIPI erkannt.

Die DPHY muss mit dem CSI-Host-Knoten verknüpft werden.

Der Knoten csi2 dphy hw muss aktiviert werden.

```text
  /* split mode: lane:2/3 */
  gc5025: gc5025@37 {
          status = "okay";
          // Need to be consistent with the matching string in the driver
          compatible = "galaxycore,gc5025";
          // sensor I2C device address, 7 bits
          reg = <0x37>;
          // sensor mclkSource configuration
          clocks = <&pmucru CLK_WIFI>;
          clock-names = "xvclk";
          //sensor mclk pinctlset up
          pinctrl-names = "default";
          pinctrl-0 = <&refclk_pins>;
          // resetPin assignment and effective level
          reset-gpios = <&gpio3 RK_PA5 GPIO_ACTIVE_LOW>;
          // powerdownPin assignment and effective level
          pwdn-gpios = <&gpio3 RK_PB0 GPIO_ACTIVE_LOW>;
          //sensor Related power domain enable
          power-domains = <&power RK3568_PD_VI>;
          /*power-gpios = <&gpio0 RK_PC1 GPIO_ACTIVE_HIGH>;*/
          // Module number, this number should not be repeated
          rockchip,camera-module-index = <1>;
          // Module orientation, there are "back" and "front"
          rockchip,camera-module-facing = "front";
          // module name
          rockchip,camera-module-name = "TongJu";
          // lens name
          rockchip,camera-module-lens-name = "CHT842-MD";
          port {
              gc5025_out: endpoint {
                  // csi2 dphy port name
                  remote-endpoint = <&dphy2_in>;
                  // csi2 dphy lane name，2lane is <1 2>, 4lane is <1 2 3 4>
                  data-lanes = <1 2>;
              };
          };
  };
   &csi2_dphy_hw {
          status = "okay";
   };
  &csi2_dphy2 {
      //csi2_dphy0 is not used simultaneously with csi2_dphy1/csi2_dphy2, mutually
  exclusivee;can be used in parallel with csi2_dphy1
      status = "okay";
      /*
       * dphy2 only used for split mode,
       * can be used  concurrently  with dphy1
       * full mode and split mode are mutually exclusive
       */
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy2_in: endpoint@1 {
                  reg = <1>;
                  // The port name of the sensor
                  remote-endpoint = <&gc5025_out>;
                  // csi2 dphy lane name
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy2_out: endpoint@1 {
                  reg = <1>;
                  // csi2 host port name
                  remote-endpoint = <&mipi_csi2_input>;
              };
          };
      };
  };
  &mipi_csi2 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_input: endpoint@1 {
                  reg = <1>;
                  // csi2 dphy port name
                  remote-endpoint = <&dphy2_out>;
                  // csi2 host lane number
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_output: endpoint@0 {
                  reg = <0>;
                  // vicapport name
                  remote-endpoint = <&cif_mipi_in>;
                  // csi2 host lane number
                  data-lanes = <1 2>;
              };
          };
      };
  };
  &rkcif_mipi_lvds {
      status = "okay";
      port {
          cif_mipi_in: endpoint {
              // csi2 hostport name
              remote-endpoint = <&mipi_csi2_output>;
              // vicap lane number
              data-lanes = <1 2>;
          };
      };
  };
  &rkcif_mipi_lvds_sditf {
      status = "okay";
      port {
          /* MIPI CSI-2 endpoint */
          mipi_lvds_sditf: endpoint {
              //isp Virtual device port name
              remote-endpoint = <&isp_in>;
              //mipi csi2 dphy lane number，consistent with sensor
              data-lanes = <1 2>;
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  //vicap mipi sditf port name
                  remote-endpoint = <&mipi_lvds_sditf>;
              };
          };
      };
  };
```

##### 10.1.1.2 LVDS-Schnittstelle

###### 10.1.1.2.1 Verknüpfung mit VICAP

**Plattform RV1126/RV1109**

Am Beispiel von imx327 mit 4 Lanes ergibt sich folgende Verknüpfung:

**Verknüpfung: sensor-&gt;csi dphy-&gt;vicap; wichtige Konfigurationspunkte**

Die DPHY darf nicht mit dem CSI-Host-Knoten verknüpft werden; andernfalls werden keine Daten empfangen.

data-lanes muss die tatsächlich verwendete Lane-Anzahl angeben; andernfalls werden keine Daten empfangen.

bus-type muss 3 sein; andernfalls wird LVDS nicht erkannt und die Verknüpfung scheitert.

```text
  imx327: imx327@1a {
          // Need to be consistent with the matching string in the driver
          compatible = "sony,imx327";
          // sensor I2C device address, 7 bits
          reg = <0x1a>;
          // sensor mclkSource configuration
          clocks = <&cru CLK_MIPICSI_OUT>;
          clock-names = "xvclk";
          //sensor Related power domain enable
          power-domains = <&power RV1126_PD_VI>;
          avdd-supply = <&vcc_avdd>;
          dovdd-supply = <&vcc_dovdd>;
          dvdd-supply = <&vcc_dvdd>;
          //sensor mclk pinctlset up
          pinctrl-names = "default";
          pinctrl-0 = <&mipicsi_clk0>;
          // powerdownPin assignment and effective level
          pwdn-gpios = <&gpio3 RK_PA6 GPIO_ACTIVE_HIGH>;
          // resetPin assignment and effective level
          reset-gpios = <&gpio1 RK_PD5 GPIO_ACTIVE_HIGH>;
          // Module number, this number should not be repeated
          rockchip,camera-module-index = <1>;
          // Module orientation, there are "back" and "front"
          rockchip,camera-module-facing = "front";
          // module name
          rockchip,camera-module-name = "CMK-OT1607-FV1";
          // lens name
          rockchip,camera-module-lens-name = "M12-4IR-4MP-F16";
          // ircut name
          ir-cut = <&cam_ircut0>;
          port {
              ucam_out0: endpoint {
                  // csi2 dphy port name
                  remote-endpoint = <&mipi_in_ucam0>;
                  // lvds lane number，1lane is <1>, 4lane is <4>，must be specified
                  data-lanes = <4>;
                  // Type of lvds interface, must be specified
                  bus-type = <3>;
              };
          };
  };
  &csi_dphy0 {
      //csi2_dphy0 is not simultaneous use with csi2_dphy1/csi2_dphy2, mutually exclusive
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_in_ucam0: endpoint@1 {
                  reg = <1>;
                  // The port name of the sensor
                  remote-endpoint = <&ucam_out0>;
                  // lvds lane number，1lane is <1>, 4lane is <4>，must be specified
                  data-lanes = <4>;
                  // Type of lvds interface, must be specified
                  bus-type = <3>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              csidphy0_out: endpoint@0 {
                  reg = <0>;
                  // vicap liteport name
                  remote-endpoint = <&cif_lite_lvds_in>;
                  // lvds lane number，1lane is <1>, 4lane is <4>，must be specified
                  data-lanes = <4>;
                  // Type of lvds interface, must be specified
                  bus-type = <3>;
              };
          };
      };
  };
  &rkcif_lite_mipi_lvds {
      status = "okay";
      port {
          /* lvds endpoint */
          cif_lite_lvds_in: endpoint {
              // csi2 dphy port name
              remote-endpoint = <&csidphy0_out>;
              //csi2 dphy lvds lane name，1lane is <1>, 4lane is <4>，must be specified
              data-lanes = <4>;
              //Type of lvds interface, must be specified
              bus-type = <3>;
          };
      };
  };
  &rkcif_lite_sditf {
      status = "okay";
      port {
          /* lvds endpoint */
          lite_sditf: endpoint {
              //isp Virtual device port name
              remote-endpoint = <&isp_in>;
              //csi2 dphy lane number， consistent with sensor
              data-lanes = <4>;
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  //lite vicap lvds sditf port name
                  remote-endpoint = <&lite_sditf>;
              };
          };
      };
  };
```

##### 10.1.1.3 DVP-Schnittstelle

###### 10.1.1.3.1 Verknüpfung mit VICAP

Auf RV1126/RV1106/RK356X ist die DTS-Konfiguration der jeweiligen DVP-Schnittstellen gleich.

**BT601**

Am Beispiel von ar0230 BT601 ergibt sich folgende Verknüpfung:

**Verknüpfung: sensor-&gt;vicap; wichtige Konfigurationspunkte**

hsync-active/vsync-active müssen gesetzt sein, damit die asynchrone V4L2-Registrierung BT601 erkennt. Ohne diese Konfiguration wird BT656 erkannt.

pclk-sample/bus-width sind optional.

In g_mbus_config des Sensortreibers muss flag die gültige Polarität von hsync-acitve/vsync-active/pclk-ative angeben; andernfalls werden keine Daten empfangen. Die Schreibweisen der Quelle bleiben erhalten.

pinctrl muss referenziert werden, um das IOMUX für BT601-GPIOs einzurichten; andernfalls scheitert der Datenempfang.

Beispielcode für g_mbus_config:

```text
  static int ar0230_g_mbus_config(struct v4l2_subdev *sd,
                  struct v4l2_mbus_config *config)
  {
      config->type = V4L2_MBUS_PARALLEL;
      config->flags = V4L2_MBUS_HSYNC_ACTIVE_HIGH |
              V4L2_MBUS_VSYNC_ACTIVE_HIGH |
              V4L2_MBUS_PCLK_SAMPLE_FALLING;
      return 0;
  }
```

DTS-Konfigurationsbeispiel:

```text
  ar0230: ar0230@10 {
          // Need to be consistent with the matching string in the driver
          compatible = "aptina,ar0230";
          // sensor I2C device address, 7 bits
          reg = <0x10>;
          // sensor mclkSource configuration
          clocks = <&cru CLK_CIF_OUT>;
          clock-names = "xvclk";
          //sensor Related power domain enable
          avdd-supply = <&vcc_avdd>;
          dovdd-supply = <&vcc_dovdd>;
          dvdd-supply = <&vcc_dvdd>;
          power-domains = <&power RV1126_PD_VI>;
          // powerdownPin assignment and effective level
          pwdn-gpios = <&gpio2 RK_PA6 GPIO_ACTIVE_HIGH>;
          /*reset-gpios = <&gpio2 RK_PC5 GPIO_ACTIVE_HIGH>;*/
          //Configure dvp related data pins and clock pins
          pinctrl-names = "default";
          pinctrl-0 = <&cifm0_dvp_ctl>;
          // Module number, this number should not be repeated
          rockchip,camera-module-index = <0>;
          // Module orientation, there are "back" and "front"
          rockchip,camera-module-facing = "back";
          // module name
          rockchip,camera-module-name = "CMK-OT0836-PT2";
          // lens name
          rockchip,camera-module-lens-name = "YT-2929";
          port {
              cam_para_out1: endpoint {
                  remote-endpoint = <&cif_para_in>;
              };
          };
  };
  &rkcif_dvp {
      status = "okay";
      port {
          /* Parallel bus endpoint */
          cif_para_in: endpoint {
              //sensor port endpoint name
              remote-endpoint = <&cam_para_out1>;
              //Sensor configuration parameters
              bus-width = <12>;
              hsync-active = <1>;
              vsync-active = <1>;
              pclk-sample = <0>;
          };
      };
  };
  &rkcif_dvp_sditf {
      status = "okay";
      port {
          /* parallel endpoint */
          dvp_sditf: endpoint {
              //isp Virtual device port name
              remote-endpoint = <&isp_in>;
              //Sensor configuration parameters
              bus-width = <12>;
              hsync-active = <1>;
              vsync-active = <1>;
              pclk-sample = <0>;
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  //dvp sditf port name
                  remote-endpoint = <&dvp_sditf>;
              };
          };
      };
  };
```

**BT656/BT1120**

BT656 und BT1120 werden im DTS gleich verwendet.

Am Beispiel von ava fpga bt1120 ergibt sich folgende Verknüpfung:

**Verknüpfung: sensor-&gt;vicap; wichtige Konfigurationspunkte**

hsync-active/vsync-active nicht konfigurieren; andernfalls erkennt das V4L2-Framework die Schnittstelle bei der asynchronen Registrierung als BT601.

pclk-sample/bus-width sind optional.

In g_mbus_config des Sensortreibers muss das Flag die gültige Polarität von pclk-ative des aktuellen Sensors angeben, andernfalls werden keine Daten empfangen. Die Schreibweise der Quelle bleibt erhalten.

querystd in v4l2_subdev_video_ops muss implementiert sein und die aktuelle Schnittstelle als ATSC kennzeichnen; andernfalls werden keine Daten empfangen.

pinctrl muss referenziert werden, um das entsprechende IOMUX für die BT656-/BT1120-GPIOs einzurichten; andernfalls scheitert der Datenempfang.

Beispielcode für g_mbus_config:

```text
  static int avafpga_g_mbus_config(struct v4l2_subdev *sd,
                  struct v4l2_mbus_config *config)
  {
      config->type = V4L2_MBUS_BT656;
      config->flags = V4L2_MBUS_PCLK_SAMPLE_RISING;
      return 0;
  }
```

Beispiel für querystd:

```text
  static int avafpga_querystd(struct v4l2_subdev *sd, v4l2_std_id *std)
  {
      *std = V4L2_STD_ATSC;
      return 0;
  }
```

DTS-Konfigurationsbeispiel:

```text
  avafpga: avafpga@70 {
      // Need to be consistent with the matching string in the driver
      compatible = "ava,fpga";
      // sensor I2C device address, 7 bits
      reg = <0x10>;
      // sensor mclkSource configuration
      clocks = <&cru CLK_CIF_OUT>;
      clock-names = "xvclk";
      //sensor Related power domain enable
      avdd-supply = <&vcc_avdd>;
      dovdd-supply = <&vcc_dovdd>;
      dvdd-supply = <&vcc_dvdd>;
      // powerdownPin assignment and effective level
      power-domains = <&power RV1126_PD_VI>;
      pwdn-gpios = <&gpio2 RK_PA6 GPIO_ACTIVE_HIGH>;
      /*reset-gpios = <&gpio2 RK_PC5 GPIO_ACTIVE_HIGH>;*/
      //Configure dvp related data pins and clock pins
      pinctrl-names = "default";
      pinctrl-0 = <&cifm0_dvp_ctl>;
      // Module number, this number should not be repeated
      rockchip,camera-module-index = <0>;
      // Module orientation, there are "back" and "front"
      rockchip,camera-module-facing = "back";
      // module name
      rockchip,camera-module-name = "CMK-OT0836-PT2";
      // lens name
      rockchip,camera-module-lens-name = "YT-2929";
      port {
          cam_para_out2: endpoint {
              remote-endpoint = <&cif_para_in>;
          };
      };
  };
  &rkcif_dvp {
      status = "okay";
      port {
          /* Parallel bus endpoint */
          cif_para_in: endpoint {
              //sensor port endpoint name
              remote-endpoint = <&cam_para_out2>;
              //Sensor configuration parameters，Optional
              bus-width = <16>;
              pclk-sample = <1>;
          };
      };
  };
  &rkcif_dvp_sditf {
      status = "okay";
      port {
          /* parallel endpoint */
          dvp_sditf: endpoint {
              //isp Virtual device port name
              remote-endpoint = <&isp_in>;
              bus-width = <16>;
              pclk-sample = <1>;
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  //dvp sditf port name
                  remote-endpoint = <&dvp_sditf>;
              };
          };
      };
  };
```

#### 10.1.2 Mehrere Sensoren registrieren

Ein einzelner Hardware-ISP bildet mehrere virtuelle Geräte und verarbeitet RAW-Daten mehrerer Sensoren im Zeitmultiplex.

VICAP auf rv1109/rv1126/rk356x speichert DVP-RAW-Daten nur nicht kompakt, während der ISP standardmäßig kompakte RAW-Daten erwartet. Hinweise siehe „ISP-/VICAP-RAW-Speicherformat konfigurieren“.

#### 10.1.3 RV1126/RV1109

**Die Verknüpfungen isp0-&gt;ispp0 und isp1-&gt;ispp1 sind in RV1126.dtsi festgelegt.**

rv1109/rv1126 ISP/ISPP unterstützt bei ausreichender Bandbreite bis zu vier Multiplexkanäle. Ergänzen Sie dazu rkisp_vir0~rkisp_vir4/rkispp_vir0~rkispp_vir4 in rv1126.dtsi; die Bereichsangabe der Quelle bleibt erhalten.

**MIPI- oder CIF-Eingang zum ISP ist wählbar.**

rv1109/rv1126 unterstützt 2 PHY-Schnittstellen, jeweils als MIPI oder LVDS mit bis zu 4 Lanes, sowie eine DVP-Schnittstelle für BT601/BT656/BT1120. Der ISP verwendet MIPI oder DVP, nicht beides gleichzeitig. VICAP unterstützt MIPI/LVDS/DVP; MIPI und LVDS sind gegenseitig exklusiv, DVP kann parallel dazu arbeiten. VICAP Lite unterstützt nur LVDS. Damit unterstützt rv1109/rv1126 derzeit bis zu 3 RAW-Sensoren zur ISP-Verarbeitung.

##### 10.1.3.1 Zwei Kameras zur ISP-Verarbeitung

**sensor0(mipi)-&gt;csi_dphy0-&gt;csi2-&gt;vicap-&gt;isp0-&gt;ispp0 sensor1(mipi)-&gt;csi_dphy1-&gt;isp1-&gt;ispp1**

Referenz: arch/arm/boot/dts/RV1109-evb-ddr3-v12-facial-gate.dts mit gc2053-&gt;csi_dphy0-&gt;csi2-&gt;cif-&gt;isp1-&gt;ispp1 und ov2718-&gt;csi_dphy1-&gt;isp0-&gt;ispp0. Bei unterschiedlichen Auflösungen ist folgende Konfiguration besonders wichtig:

```dts
&rkispp {
     status = "okay";
     /* the max input w h and fps of mulit sensor */
     max-input = <2688 1520 30>;//Take the maximum width and height and frame rate of different sensors
};
```

##### 10.1.3.2 Drei Kameras zur ISP-Verarbeitung

sensor0（mipi）-&gt;csi_dphy0-&gt;csi2-&gt;vicap-&gt;isp0-&gt;ispp0 sensor1（mipi）-&gt;csi_dphy1-&gt;isp1-&gt;ispp1 sensor2（DVP）-&gt;vicap-&gt;isp2-&gt;ispp2

oder

sensor0（mipi）-&gt;csi_dphy0-&gt;csi2-&gt;vicap-&gt;isp0-&gt;ispp0 sensor1（lvds）-&gt;csi_dphy1-&gt;vicap lite-&gt;isp1-&gt;ispp1 sensor2（DVP）-&gt;vicap-&gt;isp2-&gt;ispp2

Beispiel: bf2253-0(mipi)-&gt;dphy0-&gt;csi2-&gt;vicap(mipi)-&gt;isp0-&gt;ispp0 bf2253-1(mipi)-&gt;dphy1-&gt;isp1-&gt;ispp1 gc1054(dvp)-&gt;vicap(dvp)-&gt;isp2-&gt;ispp2

```text
  &i2c1 {
      status = "okay";
      clock-frequency = <400000>;
      gc1054: gc1054@21 {
              compatible = "galaxycore,gc1054";
              reg = <0x21>;
              clocks = <&cru CLK_CIF_OUT>;
              clock-names = "xvclk";
              power-domains = <&power RV1126_PD_VI>;
              pwdn-gpios  = <&gpio3 RK_PA5 GPIO_ACTIVE_HIGH>;
              reset-gpios = <&gpio3 RK_PA6 GPIO_ACTIVE_LOW>;
              rockchip,grf = <&grf>;
              pinctrl-names = "default";
              pinctrl-0 = <&cifm0_dvp_ctl>;
              rockchip,camera-module-index = <0>;
              rockchip,camera-module-facing = "back";
              rockchip,camera-module-name = "GC1054_B";
              rockchip,camera-module-lens-name = "GC1054_LEN";
              port {
                      cam_para_out1: endpoint {
                      remote-endpoint = <&cif_para_in>;
                          bus-width = <10>;
                          hsync-active = <1>;
                          vsync-active = <1>;
              };
          };
      };
      bf2253_isp0: bf2253_isp0@6d {
            compatible = "ovti,bf2253_isp0";
            reg = <0x6d>;
            clocks = <&cru CLK_MIPICSI_OUT>;
            clock-names = "xvclk";
            power-domains = <&power RV1126_PD_VI>;
            pinctrl-names = "rockchip,camera_default";
            pinctrl-0   = <&mipicsi_clk0>;
            power-gpios = <&gpio3 RK_PA6 GPIO_ACTIVE_HIGH>;
            pwdn-gpios  = <&gpio1 RK_PD4 GPIO_ACTIVE_LOW>;
            reset-gpios = <&gpio1 RK_PD5 GPIO_ACTIVE_HIGH>;
            avdd-supply  = <&vcc_3v3>;
            dovdd-supply = <&vcc_1v8>;
            dvdd-supply  = <&vcc_1v8>;
            rockchip,camera-module-index = <1>;
            rockchip,camera-module-facing = "front";
            rockchip,camera-module-name = "LA6110PA";
            rockchip,camera-module-lens-name = "YM6011P";
            port {
                cam_out1: endpoint {
                      remote-endpoint = <&mipi_in_ucam>;
                      data-lanes = <1>;
                  };
            };
       };
  };
  &i2c3 {
      status = "okay";
      clock-frequency = <400000>;
      pinctrl-names = "default";
      pinctrl-0 = <&i2c3m2_xfer>;
      bf2253_isp1: bf2253_isp1@6d {
            compatible = "ovti,bf2253_isp1";
            reg = <0x6d>;
            clocks = <&cru CLK_MIPICSI_OUT>;
            clock-names = "xvclk";
            power-domains = <&power RV1126_PD_VI>;
            pinctrl-names = "rockchip,camera_default";
            //pinctrl-names = "rockchip,camera_sleep";
            pinctrl-0 = <&mipicsi_clk1>;
            power-gpios = <&gpio3 RK_PA6 GPIO_ACTIVE_HIGH>;
            pwdn-gpios  = <&gpio3 RK_PA4 GPIO_ACTIVE_LOW>;
            reset-gpios = <&gpio2 RK_PA0 GPIO_ACTIVE_HIGH>;
            avdd-supply  = <&vcc_3v3>;
            dovdd-supply = <&vcc_1v8>;
            dvdd-supply  = <&vcc_1v8>;
            rockchip,camera-module-index = <2>;
            rockchip,camera-module-facing = "front";
            rockchip,camera-module-name = "LA6110PA";
            rockchip,camera-module-lens-name = "YM6011P";
            port {
                 cam_out0: endpoint {
                     remote-endpoint = <&csi_dphy1_input>;
                     data-lanes = <1>;
                 };
            };
       };
  };
  &csi_dphy0 {
      status = "okay";
      ports {
          port@0 {
              mipi_in_ucam: endpoint@1 {
                  remote-endpoint = <&cam_out1>;
                  data-lanes = <1>;
              };
          };
          port@1 {
              csi_dphy0_out: endpoint@0 {
                  remote-endpoint = <&mipi_csi2_input>;
                  data-lanes = <1>;
              };
          };
      };
  };
  &csi_dphy1 {
      status = "okay";
      ports {
          port@0 {
              csi_dphy1_input: endpoint@1 {
                  remote-endpoint = <&cam_out0>;
                  data-lanes = <1>;
              };
          };
          port@1 {
              csi_dphy1_output: endpoint@0 {
                  remote-endpoint = <&isp_in1>;
                  data-lanes = <1>;
              };
          };
      };
  };
  &mipi_csi2 {
      status = "okay";
      ports {
          port@0 {
              mipi_csi2_input: endpoint@1 {
                  remote-endpoint = <&csi_dphy0_out>;
                  data-lanes = <1>;
              };
          };
          port@1 {
              mipi_csi2_output: endpoint@0 {
                  remote-endpoint = <&cif_mipi_in>;
                  data-lanes = <1>;
              };
          };
      };
  };
  &rkcif_mipi_lvds {
      status = "okay";
      port {
          cif_mipi_in: endpoint {
              remote-endpoint = <&mipi_csi2_output>;
              data-lanes = <1>;
          };
      };
  };
  &rkcif_mipi_lvds_sditf {
      status = "okay";
      port {
          lvds_sditf: endpoint {
              remote-endpoint = <&isp_in0>;
              data-lanes = <1>;
          };
      };
  };
  &rkcif_dvp {
          status = "okay";
          //iommus = <&rkcif_mmu>;
          ///delete-property/ memory-region;
          port {
                  /* Parallel bus endpoint */
                  cif_para_in: endpoint {
                          remote-endpoint = <&cam_para_out1>;
                          bus-width = <8>;
                          hsync-active = <1>;
                          vsync-active = <1>;
                  };
          };
  };
  &rkcif_dvp_sditf {
          status = "okay";
          port {
                  /* Parallel bus endpoint */
          dvp_sditf: endpoint {
                          remote-endpoint = <&isp_in2>;
                  };
          };
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in0: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&lvds_sditf>;
              };
          };
      };
  };
  &rkisp_vir1 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in1: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&csi_dphy1_output>;
              };
          };
      };
  };
  &rkisp_vir2 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in2: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&dvp_sditf>;
              };
          };
      };
  };
  &rkispp_vir0 {
      status = "okay";
  };
  &rkispp_vir1 {
      status = "okay";
  };
  &rkispp_vir2 {
          status = "okay";
  };
  &rkcif {
          status = "okay";
  };
  rkisp: rkisp@ffb50000 {
      status = "okay";
  };
  &rkispp {
      status = "okay";
      max-input = <1600 1200 30>;
      memory-region = <&isp_reserved>;
      /* the max input w h and fps of mulit sensor */
  };
   rkcif_mmu: iommu@ffae0800{
      status = "disabled";
  };
   rkisp_mmu: iommu@ffb51a00 {
      status = "disabled";
  };
  &rkispp_mmu {
      status = "disabled";
  };
```

#### 10.1.4 RK3566/RK3568

rk356x ISP unterstützt bei ausreichender Bandbreite bis zu vier Multiplexkanäle; ergänzen Sie rkisp_vir0~rkisp_vir4 in rk3568.dtsi. Die Bereichsangabe der Quelle bleibt erhalten.

**MIPI- oder CIF-Eingang zum ISP ist wählbar.**

rk356x besitzt eine PHY mit 4 Lanes, aufteilbar in zwei PHYs mit je 2 Lanes, sowie eine DVP-Schnittstelle für BT601/BT656/BT1120. Der ISP unterstützt MIPI oder DVP, jedoch nicht gleichzeitig. VICAP unterstützt beide gleichzeitig. Damit unterstützt rk356x derzeit bis zu 3 RAW-Sensoren zur ISP-Verarbeitung.

##### 10.1.4.1 Zwei Kameras zur ISP-Verarbeitung

Beispiel:

ov5695-&gt;dphy1-&gt;isp_vir0

gc5025-&gt;dphy2-&gt;csi2-&gt;vicap-&gt;isp_vir1

```text
  ov5695: ov5695@36 {
          status = "okay";
          ...
          port {
              ov5695_out: endpoint {
                  remote-endpoint = <&dphy1_in>;
                  data-lanes = <1 2>;
              };
          };
  };
  gc5025: gc5025@37 {
          status = "okay";
          ...
          port {
              gc5025_out: endpoint {
                  remote-endpoint = <&dphy2_in>;
                  data-lanes = <1 2>;
              };
          };
  };
   &csi2_dphy_hw {
          status = "okay";
   };
  &csi2_dphy1 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy1_in: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&ov5695_out>;
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy1_out: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&isp0_in>;
              };
          };
      };
  };
  &csi2_dphy2 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy2_in: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&gc5025_out>;
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy2_out: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&mipi_csi2_input>;
              };
          };
      };
  };
  &mipi_csi2 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_input: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&dphy2_out>;
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_output: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&cif_mipi_in>;
                  data-lanes = <1 2>;
              };
          };
      };
  };
  &rkcif_mipi_lvds {
      status = "okay";
      port {
          cif_mipi_in: endpoint {
              remote-endpoint = <&mipi_csi2_output>;
              data-lanes = <1 2>;
          };
      };
  };
  &rkcif_mipi_lvds_sditf {
      status = "okay";
      port {
          mipi_lvds_sditf: endpoint {
              remote-endpoint = <&isp1_in>;
              data-lanes = <1 2>;
          };
      };
  };
  &rkisp {
      status = "okay";
      /* the max input w h and fps of mulit sensor */
      max-input = <2592 1944 30>;
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp0_in: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&dphy1_out>;
              };
          };
      };
  };
  &rkisp_vir1 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp1_in: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&mipi_lvds_sditf>;
              };
          };
      };
  };
```

##### 10.1.4.2 Drei Kameras zur ISP-Verarbeitung

Beispiel: gc2053(mipi)-&gt;dphy1-&gt;isp0 sc1330(dvp)-&gt;vicap(dvp)-&gt;isp1 ov5695(mipi)-&gt;dphy2-&gt;csi2-&gt;vicap(mipi)-&gt;isp2

```text
  &i2c2 {
      status = "okay";
      pinctrl-0 = <&i2c2m1_xfer>;
      /* split mode: lane0/1 */
      gc2053: gc2053@37 {
          status = "okay";
          compatible = "galaxycore,gc2053";
          reg = <0x37>;
          clocks = <&cru CLK_CAM0_OUT>;
          clock-names = "xvclk";
          /* Set pinctl of xvclk in &pinctl */
          power-domains = <&power RK3568_PD_VI>;
          reset-gpios = <&gpio4 RK_PB1 GPIO_ACTIVE_LOW>;
          pwdn-gpios = <&gpio3 RK_PD0 GPIO_ACTIVE_LOW>;
          /*power-gpios = <&gpio0 RK_PC1 GPIO_ACTIVE_HIGH>;*/
          rockchip,camera-module-index = <0>;
          rockchip,camera-module-facing = "front";
          rockchip,camera-module-name = "rgbd";
          rockchip,camera-module-lens-name = "Optics";
          port {
              gc2053_out: endpoint {
                  remote-endpoint = <&dphy1_in>;
                  data-lanes = <1 2>;
              };
          };
      };
  };
  &i2c3 {
      status = "okay";
      pinctrl-0 = <&i2c3m0_xfer>;
      sc1330: sc1330@32 {
          status = "okay";
          compatible = "smartsens,sc1330";
          reg = <0x32>;
          clocks = <&cru CLK_CIF_OUT>;
          clock-names = "xvclk";
          power-domains = <&power RK3568_PD_VI>;
          pinctrl-names = "default";
          /* conflict with gmac1m1_rgmii_pins & cif_clk*/
          pinctrl-0 = <&cif_clk &cif_dvp_clk &cif_dvp_bus10>;
          /*avdd-supply = <&vcc2v8_dvp>;*/
          /*dovdd-supply = <&vcc1v8_dvp>;*/
          /*dvdd-supply = <&vcc1v8_dvp>;*/
          reset-gpios = <&gpio4 RK_PA6 GPIO_ACTIVE_LOW>;
          pwdn-gpios = <&gpio3 RK_PC7 GPIO_ACTIVE_LOW>;
          rockchip,camera-module-index = <2>;
          rockchip,camera-module-facing = "back";
          rockchip,camera-module-name = "default";
          rockchip,camera-module-lens-name = "default";
          port {
              sc1330_out: endpoint {
                  remote-endpoint = <&dvp_in_bcam>;
              };
          };
      };
  };
  &i2c4 {
      status = "okay";
      pinctrl-0 = <&i2c4m0_xfer>;
      clock-frequency = <1000000>;
      /* split mode: lane:2/3 */
      ov5695: ov5695@36 {
                  status = "okay";
                  compatible = "ovti,ov5695";
                  reg = <0x36>;
                  clocks = <&cru CLK_CAM0_OUT>;
                  clock-names = "xvclk";
                  power-domains = <&power RK3568_PD_VI>;
                  pinctrl-names = "default";
                  pinctrl-0 = <&cif_clk>;
                  reset-gpios = <&gpio3 RK_PB0 GPIO_ACTIVE_HIGH>;
                  pwdn-gpios = <&gpio4 RK_PC6 GPIO_ACTIVE_HIGH>;
                  rockchip,camera-module-index = <1>;
                  rockchip,camera-module-facing = "front";
                  rockchip,camera-module-name = "TongJu";
                  rockchip,camera-module-lens-name = "CHT842-MD";
                  port {
                          ov5695_out: endpoint {
                                  remote-endpoint = <&dphy2_in>;
                                  data-lanes = <1 2>;
                          };
                  };
      };
  };
  &csi2_dphy_hw {
      status = "okay";
  };
  &csi2_dphy1 {
      status = "okay";
      /*
       * dphy1 only used for split mode,
       * can be used  concurrently  with dphy2
       * full mode and split mode are mutually exclusive
       */
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy1_in: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&gc2053_out>;
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy1_out: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&isp0_in>;
              };
          };
      };
  };
  &csi2_dphy2 {
      status = "okay";
      /*
       * dphy2 only used for split mode,
       * can be used  concurrently  with dphy1
       * full mode and split mode are mutually exclusive
       */
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy2_in: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&ov5695_out>;
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy2_out: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&mipi_csi2_input>;
              };
          };
      };
  };
  &mipi_csi2 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_input: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&dphy2_out>;
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_output: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&cif_mipi_in>;
                  data-lanes = <1 2>;
              };
          };
      };
  };
  &rkcif {
      status = "okay";
  };
  &rkcif_mmu {
      status = "okay";
  };
  &rkcif_mipi_lvds {
      status = "okay";
      /* csi2 link to rkcif, using rkcif to capture stream */
      port {
          cif_mipi_in: endpoint {
              remote-endpoint = <&mipi_csi2_output>;
              data-lanes = <1 2>;
          };
      };
  };
  &rkcif_mipi_lvds_sditf {
      status = "okay";
      port {
          mipi_lvds_sditf: endpoint {
              remote-endpoint = <&isp2_in>;
          };
      };
  };
  &rkcif_dvp {
      status = "okay";
      port {
          dvp_in_bcam: endpoint {
              remote-endpoint = <&sc1330_out>;
              bus-width = <10>;
              vsync-active = <0>;
              hsync-active = <1>;
          };
      };
  };
  &rkcif_dvp_sditf {
      status = "okay";
      /* parallel endpoint */
      port {
          dvp_sditf: endpoint {
              remote-endpoint = <&isp1_in>;
              bus-width = <10>;
              pclk-sample = <1>;
          };
      };
  };
  &rkisp {
      status = "okay";
      /* the max input w h and fps of mulit sensor */
      max-input = <1920 1080 30>;
  };
  &rkisp_mmu {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      port {
          #address-cells = <1>;
          #size-cells = <0>;
          isp0_in: endpoint@0 {
              reg = <0>;
              remote-endpoint = <&dphy1_out>;
          };
      };
  };
  &rkisp_vir1 {
      status = "okay";
      port {
          #address-cells = <1>;
          #size-cells = <0>;
          isp1_in: endpoint@0 {
              reg = <0>;
              remote-endpoint = <&dvp_sditf>;
          };
      };
  };
  &rkisp_vir2 {
      status = "okay";
      port {
          #address-cells = <1>;
          #size-cells = <0>;
          isp2_in: endpoint@0 {
              reg = <0>;
              remote-endpoint = <&mipi_lvds_sditf>;
          };
      };
  };
```

### 10.2 Beschreibung des CIS-Treibers

Der Kamerasensor kommuniziert über I2C mit dem Host. Sein Treiber ist derzeit als I2C-Gerätetreiber implementiert und verwendet zugleich die V4L2-Subdevice-Schnittstelle zur Kommunikation mit dem Hosttreiber.

#### 10.2.1 Kurze Beschreibung der Datentypen

##### 10.2.1.1 struct i2c_driver

[Beschreibung]

Definiert Informationen des I2C-Gerätetreibers.

[Definition]

```text
  struct i2c_driver {
      ……
      /* Standard driver model interfaces */
      int (*probe)(struct i2c_client *, const struct i2c_device_id *);
      int (*remove)(struct i2c_client *);
      ……
      struct device_driver driver;
      const struct i2c_device_id *id_table;
      ……
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p113, table unit 594 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| @driver | Enthält im Gerätetreibermodell hauptsächlich Treibername und of_match_table zum Abgleich mit dem im DTS registrierten Gerät. Stimmen die compatible-Felder von of_match_table und DTS überein, wird .probe aufgerufen. |
| @id_table | Liste der unterstützten I2C-Geräte. Verwendet der Kernel nicht of_match_table und DTS-Geräteregistrierung zum Abgleich, greift er auf diese Tabelle zurück. |
| @probe | Callback zur Gerätebindung |
| @remove | Callback zum Aufheben der Gerätebindung |

[Beispiel]

```text
  #if IS_ENABLED(CONFIG_OF)
  static const struct of_device_id os04a10_of_match[] = {
      { .compatible = "ovti,os04a10" },
      {},
  };
  MODULE_DEVICE_TABLE(of, os04a10_of_match);
  #endif
  static const struct i2c_device_id os04a10_match_id[] = {
      { "ovti,os04a10", 0 },
      { },
  };
  static struct i2c_driver os04a10_i2c_driver = {
      .driver = {
          .name = OS04A10_NAME,
          .pm = &os04a10_pm_ops,
          .of_match_table = of_match_ptr(os04a10_of_match),
      },
      .probe      = &os04a10_probe,
      .remove     = &os04a10_remove,
      .id_table   = os04a10_match_id,
  };
  static int __init sensor_mod_init(void)
  {
      return i2c_add_driver(&os04a10_i2c_driver);
  }
  static void __exit sensor_mod_exit(void)
  {
      i2c_del_driver(&os04a10_i2c_driver);
  }
  device_initcall_sync(sensor_mod_init);
  module_exit(sensor_mod_exit);
```

##### 10.2.1.2 struct v4l2_subdev_ops

[Beschreibung]

Definiert die Operations-Callbacks für Subdevices.

[Definition]

```text
  struct v4l2_subdev_ops {
      const struct v4l2_subdev_core_ops   *core;
      ……
      const struct v4l2_subdev_video_ops  *video;
      ……
      const struct v4l2_subdev_pad_ops    *pad;
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p114, table unit 604 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .core | Definiert die Core-Operations-Callbacks für Subdevices |
| .video | Callbacks bei Öffnung des V4L-Geräts im Videomodus |
| .pad | Operationen auf Pad-Ebene eines V4L2-Subdevices |

[Beispiel]

```text
  static const struct v4l2_subdev_ops os04a10_subdev_ops = {
      .core   = &os04a10_core_ops,
      .video  = &os04a10_video_ops,
      .pad    = &os04a10_pad_ops,
  };
```

##### 10.2.1.3 struct v4l2_subdev_core_ops

[Beschreibung]

Definiert die Core-Operations-Callbacks für Subdevices.

[Definition]

```text
  struct v4l2_subdev_core_ops {
      ……
      int (*s_power)(struct v4l2_subdev *sd, int on);
      long (*ioctl)(struct v4l2_subdev *sd, unsigned int cmd, void *arg);
  #ifdef CONFIG_COMPAT
      long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd,
          unsigned long arg);
  #endif
      ……
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p115, table unit 613 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .s_power | Versetzt das Subdevice in den Energiesparmodus (on == 0) oder Normalbetrieb (on == 1). |
| .ioctl | Wird am Ende der ioctl()-Systemaufrufbehandlung im V4L2-Kern aufgerufen und unterstützt treiberspezifische private ioctls. |
| .compat_ioctl32 | Wird bei einer 32-Bit-Anwendung auf einem 64-Bit-Kernel aufgerufen, um Daten beim Austausch mit dem Userspace anzupassen. |

[Beispiel]

```text
  static const struct v4l2_subdev_core_ops os04a10_core_ops = {
      .s_power = os04a10_s_power,
      .ioctl = os04a10_ioctl,
  #ifdef CONFIG_COMPAT
      .compat_ioctl32 = os04a10_compat_ioctl32,
  #endif
  };
```

Folgende private ioctls dienen derzeit zur Abfrage von Modulinformationen sowie zum Abfragen und Setzen von OTP-Informationen.

<!-- Source: English PDF p116, table unit 617 -->

| Privates ioctl | Beschreibung |
| --- | --- |
| RKMODULE_GET_MODULE_INFO | Modulinformationen abrufen; siehe struct rkmodule_inf. |
| RKMODULE_AWB_CFG | AWB-Kompensation des Sensors umschalten. Ist im Modul kein Golden-AWB-Wert gespeichert, kann er hier gesetzt werden. Siehe struct rkmodule awb_cfg; die Schreibweise der Quelle bleibt erhalten. |
| RKMODULE_LSC_CFG | LSC-Kompensation des Sensors umschalten; siehe struct rkmodule_lsc_cfg. |
| PREISP_CMD_SET_HDRAE_EXP | HDR-Belichtung setzen; siehe struct preisp_hdrae_exp_s. |
| RKMODULE_SET_HDR_CFG | Zwischen normalem und HDR-Modus umschalten. Der Treiber muss beide Konfigurationsgruppen unterstützen. Siehe struct rkmodule_hdr_cfg. |
| RKMODULE_GET_HDR_CFG | Aktuellen HDR-Modus abfragen; siehe struct rkmodule_hdr_cfg. |
| RKMODULE_SET_CONVERSION_GAIN | Konversionsverstärkung im linearen Modus setzen, z. B. für imx347 oder os04a10 mit entsprechender Funktion. Unterstützt der Sensor diese nicht, kann die Implementierung entfallen. |

##### 10.2.1.4 struct v4l2_subdev_video_ops

[Beschreibung]

Callbacks bei Öffnung des V4L-Geräts im Videomodus.

[Definition]

```text
  struct v4l2_subdev_video_ops {
      ……
      int (*s_stream)(struct v4l2_subdev *sd, int enable);
      ……
      int (*g_frame_interval)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_frame_interval *interval);
      int (*g_mbus_config)(struct v4l2_subdev *sd,
                 struct v4l2_mbus_config *cfg);
   ……
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p117, table unit 624 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .g_frame_interval | Callback der ioctl-Behandlung VIDIOC_SUBDEV_G_FRAME_INTERVAL |
| .s_stream | Meldet dem Treiber den bevorstehenden Start oder erfolgten Stopp eines Videostreams |
| .g_mbus_config | Unterstützte Media-Bus-Konfigurationen abfragen |

[Beispiel]

```text
  static const struct v4l2_subdev_video_ops os04a10_video_ops = {
      .s_stream = os04a10_s_stream,
      .g_frame_interval = os04a10_g_frame_interval,
      .g_mbus_config = os04a10_g_mbus_config,
  };
```

##### 10.2.1.5 struct v4l2_subdev_pad_ops

[Beschreibung]

Operationen auf Pad-Ebene eines V4L2-Subdevices.

[Definition]

```text
  struct v4l2_subdev_pad_ops {
      ……
      int (*enum_mbus_code)(struct v4l2_subdev *sd,
                 struct v4l2_subdev_pad_config *cfg,
                 struct v4l2_subdev_mbus_code_enum *code);
      int (*enum_frame_size)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_pad_config *cfg,
                  struct v4l2_subdev_frame_size_enum *fse);
      int (*get_fmt)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_pad_config *cfg,
                  struct v4l2_subdev_format *format);
      int (*set_fmt)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_pad_config *cfg,
                  struct v4l2_subdev_format *format);
      int (*enum_frame_interval)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_pad_config *cfg,
                  struct v4l2_subdev_frame_interval_enum *fie);
      int (*get_selection)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_pad_config *cfg,
                  struct v4l2_subdev_selection *sel);
      ……
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p118, table unit 633 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| . enum_mbus_code | Callback der ioctl-Behandlung VIDIOC_SUBDEV_ENUM_MBUS_CODE |
| . enum_frame_size | Callback der ioctl-Behandlung VIDIOC_SUBDEV_ENUM_FRAME_SIZE |
| .s_fmt | Callback der ioctl-Behandlung VIDIOC_SUBDEV_S_FMT |
| .g_fmt | Callback der ioctl-Behandlung VIDIOC_SUBDEV_G_FMT |
| .enum_frame_interval | Callback der ioctl-Behandlung VIDIOC_SUBDEV_ENUM_FRAME_INTERVAL() |
| .get_selection | Callback der ioctl-Behandlung VIDIOC_SUBDEV_G_SELECTION() |

[Beispiel]

```text
  static const struct v4l2_subdev_pad_ops os04a10_pad_ops = {
      .enum_mbus_code = os04a10_enum_mbus_code,
      .enum_frame_size = os04a10_enum_frame_sizes,
      .enum_frame_interval = os04a10_enum_frame_interval,
      .get_fmt = os04a10_get_fmt,
      .set_fmt = os04a10_set_fmt,
  };
```

##### 10.2.1.6 struct v4l2_ctrl_ops

[Beschreibung]

Steuerungsoperationen, die der Treiber bereitstellen muss.

[Definition]

```text
  struct v4l2_ctrl_ops {
      int (*s_ctrl)(struct v4l2_ctrl *ctrl);
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p118, table unit 642 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .s_ctrl | Setzt den neuen Steuerwert tatsächlich. |

[Beispiel]

```text
  static const struct v4l2_ctrl_ops os04a10_ctrl_ops = {
      .s_ctrl = os04a10_set_ctrl,
  };
```

Der RKISP-Treiber verlangt die vom Framework bereitgestellten Benutzer-Steuerelemente. Der Kamerasensortreiber muss die folgenden Steuerfunktionen implementieren; siehe Liste 1 der V4L2-Controls des CIS-Treibers.

##### 10.2.1.7 struct xxxx_mode

[Beschreibung]

Informationen zu den einzelnen vom Sensor unterstützten Modi.

Diese Struktur findet sich häufig in Sensortreibern, obwohl der V4L2-Standard sie nicht vorschreibt.

[Definition]

```text
  struct xxxx_mode {
      u32 bus_fmt;
      u32 width;
      u32 height;
      struct v4l2_fract max_fps;
      u32 hts_def;
      u32 vts_def;
      u32 exp_def;
      const struct regval *reg_list;
      u32 hdr_mode;
      u32 vc[PAD_MAX];
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p119, table unit 653 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .bus_fmt | Sensorausgabeformat; siehe MEDIA_BUS_FMT-Tabelle |
| .width | Aktive Bildbreite; muss der Ausgabe des aktuell konfigurierten Sensors entsprechen |
| .height | Aktive Bildhöhe; muss der Ausgabe des aktuell konfigurierten Sensors entsprechen |
| .max_fps | Bildrate; denominator/numerator ergibt fps |
| hts_def | Standard-HTS: aktive Bildbreite + HBLANK |
| vts_def | Standard-VTS: aktive Bildhöhe + VBLANK |
| exp_def | Standardbelichtungszeit |
| *reg_list | Registerliste |
| .hdr_mode | Sensorbetriebsmodus: linear, HDR-Zusammenführung aus zwei oder drei Bildern |
| .vc[PAD_MAX] | MIPI-VC-Kanal konfigurieren |

[Beispiel]

```text
   enum os04a10_max_pad {
      PAD0, /* link to isp */
      PAD1, /* link to csi rawwr0 | hdr x2:L x3:M */
      PAD2, /* link to csi rawwr1 | hdr    x3:L */
      PAD3, /* link to csi rawwr2 | hdr x2:M x3:S */
      PAD_MAX,
  };
  static const struct os04a10_mode supported_modes[] = {
      {
          .bus_fmt = MEDIA_BUS_FMT_SBGGR12_1X12,
          .width = 2688,
          .height = 1520,
          .max_fps = {
              .numerator = 10000,
              .denominator = 300372,
          },
          .exp_def = 0x0240,
          .hts_def = 0x05c4 * 2,
          .vts_def = 0x0984,
          .reg_list = os04a10_linear12bit_2688x1520_regs,
          .hdr_mode = NO_HDR,
          .vc[PAD0] = V4L2_MBUS_CSI2_CHANNEL_0,
      }, {
          .bus_fmt = MEDIA_BUS_FMT_SBGGR12_1X12,
          .width = 2688,
          .height = 1520,
          .max_fps = {
              .numerator = 10000,
              .denominator = 225000,
          },
          .exp_def = 0x0240,
          .hts_def = 0x05c4 * 2,
          .vts_def = 0x0658,
          .reg_list = os04a10_hdr12bit_2688x1520_regs,
          .hdr_mode = HDR_X2,
          .vc[PAD0] = V4L2_MBUS_CSI2_CHANNEL_1,
          .vc[PAD1] = V4L2_MBUS_CSI2_CHANNEL_0,//L->csi wr0
          .vc[PAD2] = V4L2_MBUS_CSI2_CHANNEL_1,
          .vc[PAD3] = V4L2_MBUS_CSI2_CHANNEL_1,//M->csi wr2
      },
  };
```

##### 10.2.1.8 struct v4l2_mbus_framefmt

[Beschreibung]

Bildformat auf dem Media-Bus.

[Definition]

```text
  struct v4l2_mbus_framefmt {
      __u32           width;
      __u32           height;
      __u32           code;
      __u32           field;
      __u32           colorspace;
      __u16           ycbcr_enc;
      __u16           quantization;
      __u16           xfer_func;
      __u16           reserved[11];
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p121, table unit 663 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| width | Bildbreite |
| height | Bildhöhe |
| code | Verweis auf die MEDIA_BUS_FMT-Tabelle |
| field | V4L2_FIELD_NONE: Vollbildausgabe; V4L2_FIELD_INTERLACED: Halbbildausgabe |

[Beispiel]

##### 10.2.1.9 struct rkmodule_base_inf

[Beschreibung]

Grundlegende Modulinformationen, anhand derer die höhere Schicht die passende IQ-Konfiguration auswählt.

[Definition]

```text
  struct rkmodule_base_inf {
      char sensor[RKMODULE_NAME_LEN];
      char module[RKMODULE_NAME_LEN];
      char lens[RKMODULE_NAME_LEN];
  } __attribute__ ((packed));
```

[Wichtige Mitglieder]

<!-- Source: English PDF p121, table unit 671 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| sensor | Sensorname aus dem Sensortreiber |
| module | Modulname aus der DTS-Konfiguration gemäß Moduldaten |
| lens | Objektivname aus der DTS-Konfiguration gemäß Moduldaten |

[Beispiel]

##### 10.2.1.10 struct rkmodule_fac_inf

[Beschreibung]

OTP-Werksinformationen des Moduls.

[Definition]

```text
  struct rkmodule_fac_inf {
      __u32 flag;
      char module[RKMODULE_NAME_LEN];
      char lens[RKMODULE_NAME_LEN];
      __u32 year;
      __u32 month;
      __u32 day;
  } __attribute__ ((packed));
```

[Wichtige Mitglieder]

<!-- Source: English PDF p122, table unit 679 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| flag | Gültigkeit dieser Informationsgruppe |
| module | Modulname; die Kennnummer aus OTP wird in den Modulnamen umgesetzt |
| lens | Objektivname; die Kennnummer aus OTP wird in den Objektivnamen umgesetzt |
| year | Produktionsjahr, beispielsweise 12 für 2012 |
| month | Produktionsmonat |
| day | Produktionstag |

[Beispiel]

##### 10.2.1.11 struct rkmodule_awb_inf

[Beschreibung]

AWB-Messinformationen aus dem Modul-OTP.

[Definition]

```text
  struct rkmodule_awb_inf {
      __u32 flag;
      __u32 r_value;
      __u32 b_value;
      __u32 gr_value;
      __u32 gb_value;
      __u32 golden_r_value;
      __u32 golden_b_value;
      __u32 golden_gr_value;
      __u32 golden_gb_value;
  } __attribute__ ((packed));
```

[Wichtige Mitglieder]

<!-- Source: English PDF p123, table unit 687 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| flag | Gültigkeit dieser Informationsgruppe |
| r_value | AWB-R-Messinformation des aktuellen Moduls |
| b_value | AWB-B-Messinformation des aktuellen Moduls |
| gr_value | AWB-GR-Messinformation des aktuellen Moduls |
| gb_value | AWB-GB-Messinformation des aktuellen Moduls |
| golden_r_value | AWB-R-Messinformation eines typischen Moduls; falls nicht programmiert, auf 0 setzen |
| golden_b_value | AWB-B-Messinformation eines typischen Moduls; falls nicht programmiert, auf 0 setzen |
| golden_gr_value | AWB-GR-Messinformation eines typischen Moduls; falls nicht programmiert, auf 0 setzen |
| golden_gb_value | AWB-GB-Messinformation eines typischen Moduls; falls nicht programmiert, auf 0 setzen |

[Beispiel]

##### 10.2.1.12 struct rkmodule_lsc_inf

[Beschreibung]

LSC-Messinformationen aus dem Modul-OTP.

[Definition]

```text
  struct rkmodule_lsc_inf {
      __u32 flag;
      __u16 lsc_w;
      __u16 lsc_h;
      __u16 decimal_bits;
      __u16 lsc_r[RKMODULE_LSCDATA_LEN];
      __u16 lsc_b[RKMODULE_LSCDATA_LEN];
      __u16 lsc_gr[RKMODULE_LSCDATA_LEN];
      __u16 lsc_gb[RKMODULE_LSCDATA_LEN];
  } __attribute__ ((packed));
```

[Wichtige Mitglieder]

<!-- Source: English PDF p124, table unit 695 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| flag | Gültigkeit dieser Informationsgruppe |
| lsc_w | Tatsächliche Breite der LSC-Tabelle |
| lsc_h | Tatsächliche Höhe der LSC-Tabelle |
| decimal_bits | Anzahl der Nachkommastellen der LSC-Messinformation; falls nicht verfügbar, auf 0 setzen |
| lsc_r | LSC-R-Messinformation |
| lsc_b | LSC-B-Messinformation |
| lsc_gr | LSC-GR-Messinformation |
| lsc_gb | LSC-GB-Messinformation |

[Beispiel]

##### 10.2.1.13 struct rkmodule_af_inf

[Beschreibung]

AF-Messinformationen aus dem Modul-OTP.

[Definition]

```text
  struct rkmodule_af_inf {
      __u32 flag; // Whether this group of information is a valid flag
      __u32 vcm_start; // vcm start current
      __u32 vcm_end; // vcm termination current
      __u32 vcm_dir; // vcm measurement direction
  } __attribute__ ((packed));
```

[Wichtige Mitglieder]

<!-- Source: English PDF p124, table unit 703 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| flag | Gültigkeit dieser Informationsgruppe |
| vcm_start | VCM-Anlaufstrom |
| vcm_end | VCM-Endstrom |
| vcm_dir | VCM-Bestimmungsrichtung |

[Beispiel]

##### 10.2.1.14 struct rkmodule_inf

[Beschreibung]

Modulinformationen.

[Definition]

```text
  struct rkmodule_inf {
      struct rkmodule_base_inf base;
      struct rkmodule_fac_inf fac;
      struct rkmodule_awb_inf awb;
      struct rkmodule_lsc_inf lsc;
      struct rkmodule_af_inf af;
  } __attribute__ ((packed));
```

[Wichtige Mitglieder]

<!-- Source: English PDF p125, table unit 711 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| base | Grundlegende Modulinformationen |
| fac | OTP-Werksinformationen des Moduls |
| awb | AWB-Messinformationen aus dem Modul-OTP |
| lsc | LSC-Messinformationen aus dem Modul-OTP |
| af | AF-Messinformationen aus dem Modul-OTP |

[Beispiel]

##### 10.2.1.15 struct rkmodule_awb_cfg

[Beschreibung]

AWB-Konfigurationsinformationen aus dem Modul-OTP.

[Definition]

```text
  struct rkmodule_awb_cfg {
      __u32 enable;
      __u32 golden_r_value;
      __u32 golden_b_value;
      __u32 golden_gr_value;
      __u32 golden_gb_value;
  } __attribute__ ((packed));
```

[Wichtige Mitglieder]

<!-- Source: English PDF p126, table unit 719 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| enable | Gibt an, ob die AWB-Korrektur aktiviert ist |
| golden_r_value | AWB-R-Messinformation eines typischen Moduls |
| golden_b_value | AWB-B-Messinformation eines typischen Moduls |
| golden_gr_value | AWB-GR-Messinformation eines typischen Moduls |
| golden_gb_value | AWB-GB-Messinformation eines typischen Moduls |

[Beispiel]

##### 10.2.1.16 struct rkmodule_lsc_cfg

[Beschreibung]

LSC-Konfigurationsinformationen aus dem Modul-OTP.

[Definition]

```text
  struct rkmodule_lsc_cfg {
      __u32 enable;
  } __attribute__ ((packed));
```

[Wichtige Mitglieder]

<!-- Source: English PDF p126, table unit 727 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| enable | Gibt an, ob die LSC-Korrektur aktiviert ist |

[Beispiel]

##### 10.2.1.17 struct rkmodule_hdr_cfg

[Beschreibung]

HDR-Konfigurationsinformationen.

[Definition]

```text
  struct rkmodule_hdr_cfg {
      __u32 hdr_mode;
      struct rkmodule_hdr_esp esp;
  } __attribute__ ((packed));
  struct rkmodule_hdr_esp {
      enum hdr_esp_mode mode;
      union {
          struct {
              __u32 padnum;
              __u32 padpix;
          } lcnt;
          struct {
              __u32 efpix;
              __u32 obpix;
          } idcd;
      } val;
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p127, table unit 736 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| hdr_mode | NO_HDR=0 // normaler Modus HDR_X2=5 // HDR-Modus mit 2 Bildern HDR_X3=6 // HDR-Modus mit 3 Bildern |
| struct rkmodule_hdr_esp | Besonderer HDR-Modus |
| enum hdr_esp_mode | HDR_NORMAL_VC=0 // normaler Modus mit virtuellen Kanälen HDR_LINE_CNT=1 // Zeilenzählermodus (AR0239) HDR_ID_CODE=2 // Identifikationscodemodus (IMX327) |

[Beispiel]

##### 10.2.1.18 struct preisp_hdrae_exp_s

[Beschreibung]

HDR-Belichtungsparameter.

[Definition]

```text
  struct preisp_hdrae_exp_s {
      unsigned int long_exp_reg;
      unsigned int long_gain_reg;
      unsigned int middle_exp_reg;
      unsigned int middle_gain_reg;
      unsigned int short_exp_reg;
      unsigned int short_gain_reg;
      unsigned int long_exp_val;
      unsigned int long_gain_val;
      unsigned int middle_exp_val;
      unsigned int middle_gain_val;
      unsigned int short_exp_val;
      unsigned int short_gain_val;
      unsigned char long_cg_mode;
      unsigned char middle_cg_mode;
      unsigned char short_cg_mode;
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p128, table unit 744 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| long_exp_reg | Belichtungsregisterwert des langen Bildes |
| long_gain_reg | Verstärkungsregisterwert des langen Bildes |
| middle_exp_reg | Belichtungsregisterwert des mittleren Bildes |
| middle_gain_reg; | Verstärkungsregisterwert des mittleren Bildes |
| short_exp_reg | Belichtungsregisterwert des kurzen Bildes |
| short_gain_reg | Verstärkungsregisterwert des kurzen Bildes |
| long_cg_mode | Konversionsverstärkung des langen Bildes: 0 LCG, 1 HCG |
| middle_cg_mode | Konversionsverstärkung des mittleren Bildes: 0 LCG, 1 HCG |
| short_cg_mode | Konversionsverstärkung des kurzen Bildes: 0 LCG, 1 HCG |

[Beschreibung]

Bei preisp_hdrae_exp_s sind nur die unter „Wichtige Mitglieder“ beschriebenen Parameter zu beachten. Die Formeln zur Umrechnung von Belichtung und Verstärkung in Registerwerte stehen im IQ-XML; Einzelheiten enthält dessen Formatbeschreibung. Konversionsverstärkung muss vom Sensor selbst unterstützt werden. Ist dies nicht der Fall, sind die entsprechenden Parameter nicht relevant. Für HDR2X sind die übergebenen Parameter des mittleren und kurzen Bildes in die Belichtungsregister der beiden Sensorausgabebilder einzutragen.

[Beispiel]

#### 10.2.2 Kurze API-Beschreibung

##### 10.2.2.1 xxxx_set_fmt

[Beschreibung]

Sensorausgabeformat setzen.

[Syntax]

```text
  static int xxxx_set_fmt(struct v4l2_subdev *sd,
                          struct v4l2_subdev_pad_config *cfg,
                          struct v4l2_subdev_format *fmt)
```

[Parameter]

<!-- Source: English PDF p128, table unit 756 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *sd | Zeiger auf die V4L2-Subdevice-Struktur | Eingabe |
| *cfg | Zeiger auf die Informationsstruktur des Subdevice-Pads | Eingabe |
| *fmt | Zeiger auf die Media-Bus-Formatstruktur auf Pad-Ebene | Eingabe |

[Rückgabewert]

<!-- Source: English PDF p129, table unit 758 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

##### 10.2.2.2 xxxx_get_fmt

[Beschreibung]

Sensorausgabeformat abfragen.

[Syntax]

```text
  static int xxxx_get_fmt(struct v4l2_subdev *sd,
                          struct v4l2_subdev_pad_config *cfg,
                          struct v4l2_subdev_format *fmt)
```

[Parameter]

<!-- Source: English PDF p129, table unit 765 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *sd | Zeiger auf die V4L2-Subdevice-Struktur | Eingabe |
| *cfg | Zeiger auf die Informationsstruktur des Subdevice-Pads | Eingabe |
| *fmt | Zeiger auf die Media-Bus-Formatstruktur auf Pad-Ebene | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p129, table unit 767 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

Siehe die MEDIA_BUS_FMT-Tabelle.

##### 10.2.2.3 xxxx_enum_mbus_code

[Beschreibung]

Die vom Sensor ausgegebenen Busformate aufzählen.

[Syntax]

```text
  static int xxxx_enum_mbus_code(struct v4l2_subdev *sd,
                                 struct v4l2_subdev_pad_config *cfg,
                                 struct v4l2_subdev_mbus_code_enum *code)
```

[Parameter]

<!-- Source: English PDF p130, table unit 775 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *sd | Zeiger auf die V4L2-Subdevice-Struktur | Eingabe |
| *cfg | Zeiger auf die Informationsstruktur des Subdevice-Pads | Eingabe |
| *code | Zeiger auf die Struktur zur Aufzählung der Media-Bus-Formate | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p130, table unit 777 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

Die folgende Tabelle fasst die zu den verschiedenen Bildtypen gehörenden Formate zusammen; siehe MEDIA_BUS_FMT-Tabelle.

##### 10.2.2.4 xxxx_enum_frame_sizes

[Beschreibung]

Sensorausgabegrößen aufzählen.

[Syntax]

```text
  static int xxxx_enum_frame_sizes(struct v4l2_subdev *sd,
                              struct v4l2_subdev_pad_config *cfg,
                              struct v4l2_subdev_frame_size_enum *fse)
```

[Parameter]

<!-- Source: English PDF p130, table unit 785 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *sd | Zeiger auf die V4L2-Subdevice-Struktur | Eingabe |
| *cfg | Zeiger auf die Informationsstruktur des Subdevice-Pads | Eingabe |
| *fse | Zeiger auf die Media-Bus-Bildgrößenstruktur | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p130, table unit 787 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

##### 10.2.2.5 xxxx_g_frame_interval

[Beschreibung]

Ausgabebildrate des Sensors abfragen.

[Syntax]

```text
  static int xxxx_g_frame_interval(struct v4l2_subdev *sd,
                                   struct v4l2_subdev_frame_interval *fi)
```

[Parameter]

<!-- Source: English PDF p131, table unit 794 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *sd | Zeiger auf die V4L2-Subdevice-Struktur | Eingabe |
| *fi | Zeiger auf die Bildratenstruktur auf Pad-Ebene | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p131, table unit 796 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

##### 10.2.2.6 xxxx_s_stream

[Beschreibung]

Stream-Ein- und Ausgabe einstellen.

[Syntax]

```text
  static int xxxx_s_stream(struct v4l2_subdev *sd, int on)
```

[Parameter]

<!-- Source: English PDF p131, table unit 803 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *sd | Zeiger auf die V4L2-Subdevice-Struktur | Eingabe |
| on | 1: Stream-Ausgabe starten; 0: Stream-Ausgabe stoppen | Eingabe |

[Rückgabewert]

<!-- Source: English PDF p131, table unit 805 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

##### 10.2.2.7 xxxx_runtime_resume

[Beschreibung]

Callback beim Einschalten des Sensors.

[Syntax]

```text
  static int xxxx_runtime_resume(struct device *dev)
```

[Parameter]

<!-- Source: English PDF p132, table unit 812 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *dev | Zeiger auf die Gerätestruktur | Eingabe |

[Rückgabewert]

<!-- Source: English PDF p132, table unit 814 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

##### 10.2.2.8 xxxx_runtime_suspend

[Beschreibung]

Callback beim Ausschalten des Sensors.

[Syntax]

```text
  static int xxxx_runtime_suspend(struct device *dev)
```

[Parameter]

<!-- Source: English PDF p132, table unit 821 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *dev | Zeiger auf die Gerätestruktur | Eingabe |

[Rückgabewert]

<!-- Source: English PDF p132, table unit 823 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

##### 10.2.2.9 xxxx_set_ctrl

[Beschreibung]

Wert des jeweiligen Steuerelements setzen.

[Syntax]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[Parameter]

<!-- Source: English PDF p133, table unit 830 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *ctrl | Zeiger auf die Struktur v4l2_ctrl | Eingabe |

[Rückgabewert]

<!-- Source: English PDF p133, table unit 832 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

##### 10.2.2.10 xxx_enum_frame_interval

[Beschreibung]

Die vom Sensor unterstützten Bildintervallparameter aufzählen.

[Syntax]

```text
  static int xxxx_enum_frame_interval(struct v4l2_subdev *sd,
                      struct v4l2_subdev_pad_config *cfg,
                      struct v4l2_subdev_frame_interval_enum *fie)
```

[Parameter]

<!-- Source: English PDF p133, table unit 839 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *sd | Subdevice-Instanz | Eingabe |
| *cfg | Pad-Konfigurationsparameter | Eingabe |
| *fie | Bildintervallparameter | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p133, table unit 841 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

##### 10.2.2.11 xxxx_g_mbus_config

[Beschreibung]

Unterstützte Buskonfiguration abfragen. Unterstützt ein Sensor beispielsweise mehrere MIPI-Übertragungsmodi, können die Parameter entsprechend seinem aktuellen MIPI-Modus gemeldet werden.

[Syntax]

```text
  static int xxxx_g_mbus_config(struct v4l2_subdev *sd,
                  struct v4l2_mbus_config *config)
```

[Parameter]

<!-- Source: English PDF p134, table unit 848 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *config | Buskonfigurationsparameter | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p134, table unit 850 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

##### 10.2.2.12 xxxx_get_selection

[Beschreibung]

Beschnittparameter konfigurieren. Die ISP-Eingangsbreite muss auf 16 und die Höhe auf 8 ausgerichtet sein. Entspricht die Sensorausgabe nicht dieser Ausrichtung oder keiner Standardauflösung, kann diese Funktion die Auflösung vor dem ISP-Eingang beschneiden.

[Syntax]

```text
  static int xxxx_get_selection(struct v4l2_subdev *sd,
  struct v4l2_subdev_pad_config *cfg,
  struct v4l2_subdev_selection *sel)
```

[Parameter]

<!-- Source: English PDF p134, table unit 857 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *sd | Subdevice-Instanz | Eingabe |
| *cfg | Pad-Konfigurationsparameter | Eingabe |
| *sel | Beschnittparameter | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p135, table unit 859 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

#### 10.2.3 Schritte zur Treiberportierung

**1. Den standardmäßigen I2C-Subdevice-Treiberteil implementieren.**

1.1 Folgende Mitglieder gemäß der Beschreibung von struct i2c_driver implementieren:

struct driver.name

struct driver.pm

struct driver. of_match_table

probe-Funktion

remove-Funktion

1.2 Einzelheiten zur Implementierung von probe: 1) Beim Erfassen der CIS-Geräteressourcen werden hauptsächlich die im DTS definierten Ressourcen ausgewertet; siehe CIS-Geräteregistrierung (DTS).

1.1) RK-spezifische Ressourcendefinitionen verwenden das Namensschema rockchip, camera-module-xxx. Der Treiber übermittelt diese Ressourcen an camera_engine im Benutzermodus, damit die passenden IQ-Bildqualitätsparameter ausgewählt werden können;

1.2) CIS-Geräteressourcen umfassen in RK-Referenztreibern normalerweise Folgendes:

<!-- Source: English PDF p135, table unit 871 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| Betriebsreferenztakt des CIS-Geräts | Bei einem unabhängigen externen Quarzoszillator muss diese Ressource nicht angefordert werden. Das RK-Referenzdesign verwendet normalerweise einen AP-Ausgabetakt, der angefordert werden muss. Üblicher Name: xvclk. |
| Steuer-GPIOs des CIS-Geräts | Beispielsweise Reset-Pin, in der Quelle „Resst“, und Powerdown-Pin |
| Steuerbare Stromversorgung des CIS-Geräts | Passende Software-Ressourcen zur Versorgungskontrolle gemäß Hardwaredesign anfordern, beispielsweise GPIO oder Regulator. |

1.3) CIS-Geräte-ID prüfen. Nach dem Anfordern der nötigen Ressourcen sollte der Treiber die Geräte-ID lesen, um die Hardware zu überprüfen. Dieser Schritt ist jedoch nicht zwingend.

1.4) CIS-V4L2-Gerät und Media-Entities initialisieren.

V4L2-Subdevice: v4l2_i2c_subdev_init. Der RK-CIS-Treiber verlangt einen eigenen Geräteknoten des Subdevices für den Zugriff durch rk_aiq im Userspace; darüber wird die Belichtung gesteuert.

Media-Entity: media_entity_init

2\. Den V4L2-Subdevice-Treiber anhand von struct v4l2_subdev_ops implementieren, insbesondere die folgenden 3 Mitglieder:

```text
  struct v4l2_subdev_core_ops
  struct v4l2_subdev_video_ops
  struct v4l2_subdev_pad_ops
```

2.1 Die Callbacks gemäß struct v4l2_subdev_core_ops implementieren, insbesondere:

```text
.s_power.ioctl
.compat_ioctl32
```

Die über ioctl implementierten privaten RK-Steuerbefehle umfassen:

<!-- Source: English PDF p136, table unit 883 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| RKMODULE_GET_MODULE_INFO | Übermittelt im DTS definierte Modulinformationen wie den Modulnamen an camera_engine. |
| RKMODULE_AWB_CFG | Bei aktivierten Modul-OTP-Informationen übermittelt camera_engine damit den AWB-Kalibrierwert eines typischen Moduls. Der CIS-Treiber vergleicht ihn mit dem AWB-Kalibrierwert des aktuellen Moduls, berechnet R/B Gain und setzt diese im CIS-MWB-Modul. |
| RKMODULE_LSC_CFG | Bei aktivierten Modul-OTP-Informationen steuert camera_engine damit die Aktivierung der LSC-Kalibrierwerte. |
| PREISP_CMD_SET_HDRAE_EXP | HDR-Belichtungseinstellungen; siehe struct preisp_hdrae_exp_s in diesem Dokument. |
| RKMODULE_SET_HDR_CFG | Zwischen HDR- und Normalmodus wechseln. Der Treiber muss beide Konfigurationsgruppen unterstützen; siehe struct rkmodule_hdr_cfg. |
| RKMODULE_GET_HDR_CFG | Aktuellen HDR-Modus abfragen; siehe struct rkmodule_hdr_cfg. |
| RKMODULE_SET_CONVERSION_GAIN | Konversionsverstärkung im linearen Modus setzen, z. B. bei imx347 oder os04a10. Hohe Konversionsverstärkung kann bei geringer Beleuchtung ein besseres Signal-Rausch-Verhältnis liefern. Ohne Sensorunterstützung kann die Implementierung entfallen. |

2.2 Die Callbacks gemäß struct v4l2_subdev_video_ops implementieren, insbesondere:

<!-- Source: English PDF p137, table unit 885 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .s_stream | Datenstrom ein-/ausschalten. Bei kontinuierlichem MIPI-Takt muss der Datenstrom in diesem Callback gestartet werden. Ein vorzeitiger Start verhindert die Erkennung des MIPI-LP-Zustands. |
| .g_frame_interval | Bildintervallparameter beziehungsweise Bildrate abfragen |
| .g_mbus_config | Buskonfiguration abfragen. Unterstützt der MIPI-Sensortreiber verschiedene Lane-Konfigurationen oder HDR, wird die MIPI-Konfiguration des aktuellen Betriebsmodus geliefert. |

2.3 Die Callbacks gemäß struct v4l2_subdev_pad_ops implementieren, insbesondere:

<!-- Source: English PDF p137, table unit 887 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .enum_mbus_code | Vom aktuellen CIS-Treiber unterstützte Datenformate aufzählen |
| .enum_frame_size | Vom aktuellen CIS-Treiber unterstützte Auflösungen aufzählen |
| .get_fmt | Der RKISP-Treiber fragt darüber das CIS-Ausgabeformat ab; zwingend zu implementieren. Formate für Bayer-RAW-, SoC-YUV- und Schwarzweiß-RAW-Sensoren siehe MEDIA_BUS_FMT-Tabelle. Zur Halbbildausgabe siehe struct v4l2_mbus_framefmt. |
| .set_fmt | Ausgabeformat und Auflösung des CIS-Treibers setzen; zwingend zu implementieren |
| .enum_frame_interval | Unterstützte Sensor-Bildintervalle einschließlich Auflösung aufzählen |
| .get_selection | Beschnittparameter konfigurieren. ISP-Eingangsbreite auf 16, Eingangshöhe auf 8 ausrichten. |

2.4 Gemäß struct v4l2_ctrl_ops insbesondere folgende Callbacks implementieren:

<!-- Source: English PDF p137, table unit 889 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .s_ctrl | RKISP-Treiber und camera_engine steuern durch verschiedene Befehle die CIS-Belichtung. |

Implementieren Sie die einzelnen Steuer-IDs anhand der V4L2-Control-Liste des CIS-Treibers. Die folgenden IDs dienen der Informationsabfrage und werden als standardmäßige Integer-Menü-Steuerelemente implementiert:

<!-- Source: English PDF p138, table unit 891 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| V4L2_CID_LINK_FREQ | Siehe Standarddefinition in der V4L2-Control-Liste des CIS-Treibers. Der RKISP-Treiber ermittelt damit derzeit die MIPI-Busfrequenz. |
| V4L2_CID_PIXEL_RATE | Für MIPI: pixel_rate = link_freq * 2 * nr_of_lanes / bits_per_sample |
| V4L2_CID_HBLANK | Siehe Standarddefinition in der V4L2-Control-Liste des CIS-Treibers |
| V4L2_CID_VBLANK | Siehe Standarddefinition in der V4L2-Control-Liste des CIS-Treibers |

RK camera_engine ermittelt mit diesen Befehlen die zur Belichtungsberechnung nötigen Informationen. Es gelten folgende Formeln:

| Formel |
| --- |
| `line_time = HTS / PIXEL_RATE;` |
| `PIXEL_RATE = HTS * VTS * FPS` |
| `HTS = sensor_width_out + HBLANK;` |
| `VTS = sensor_height_out + VBLANK;` |

Die folgenden IDs dienen der Steuerung; darüber steuert RK camera_engine das CIS:

<!-- Source: English PDF p138, table unit 899 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| V4L2_CID_VBLANK | VBLANK und damit Bildrate sowie maximale Belichtungszeit anpassen |
| V4L2_CID_EXPOSURE | Belichtungszeit setzen; Einheit: Anzahl belichteter Zeilen |
| V4L2_CID_ANALOGUE_GAIN | Belichtungsverstärkung setzen; Gesamtverstärkung = analoge Verstärkung*digitaler Verstärkung. Einheit: Verstärkungsregisterwert. |

3\. Der CIS-Treiber definiert keine Informationen zur Hardware-Datenschnittstelle. Die Verbindung zwischen CIS-Gerät und AP wird über den Port des DTS-Geräteknotens dargestellt. Siehe die Beschreibung der Port-Informationen im Abschnitt zur CIS-Geräteregistrierung (DTS). 4. Liste der CIS-Referenztreiber

## 11. VCM-Treiber

### 11.1 VCM-Geräteregistrierung (DTS)

**Beschreibung der RK-spezifischen VCM-Treiberparameter:**

<!-- Source: English PDF p139, table unit 904 -->

| Name | Beschreibung |
| --- | --- |
| Anlaufstrom | Strom, bei dem die VCM das Objektiv gerade vom nahen Ende seines mechanischen Verfahrwegs aus bewegen kann; dieses entspricht dem Fernfokus des Moduls. Der dabei vom VCM-Treiber-IC gelieferte Strom ist der Anlaufstrom. |
| Nennstrom | Strom, bei dem die VCM das Objektiv gerade bis zum fernen Ende seines mechanischen Verfahrwegs bewegen kann; dieses entspricht dem Nahfokus des Moduls. Der dabei vom VCM-Treiber-IC gelieferte Strom ist der Nennstrom. |
| VCM-Stromausgabemodus | Während der VCM-Bewegung treten Schwingungen auf. Änderungen des Treiberstroms müssen deren Periode berücksichtigen, um sie zu minimieren. Der Ausgabemodus bestimmt die Zeit bis zum Erreichen des Zielstroms. |

```text
  vm149c: vm149c@0c { // vcm driver configuration, this set up is required when supporting AF
      compatible = "silicon touch,vm149c";
      status = "okay";
      reg = <0x0c>;
      rockchip,vcm-start-current = <0>;// Starting current of the motor
      rockchip,vcm-rated-current = <100>; // Motor rated current
      rockchip,vcm-step-mode = <4>; // Current output mode of motor drive IC
      rockchip,camera-module-index = <0>; // Module number
      rockchip,camera-module-facing = "back"; // Module orientation, there are "back" and "front"
  };
  ov13850: ov13850@10 {
      ......
      lens-focus = <&vm149c>; // vcm driver set up, need to have this set up when supporting AF
      ......
  };
```

### 11.2 Beschreibung des VCM-Treibers

#### 11.2.1 Kurze Beschreibung der Datentypen

##### 11.2.1.1 struct i2c_driver

[Beschreibung]

Definiert Informationen des I2C-Gerätetreibers.

[Definition]

```text
  struct i2c_driver {
      ……
      /* Standard driver model interfaces */
      int (*probe)(struct i2c_client *, const struct i2c_device_id *);
      int (*remove)(struct i2c_client *);
      ……
      struct device_driver driver;
      const struct i2c_device_id *id_table;
      ……
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p140, table unit 914 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| @driver | Enthält im Gerätetreibermodell hauptsächlich Treibername und of_match_table zum Abgleich mit dem im DTS registrierten Gerät. Stimmen die compatible-Felder von of_match_table und DTS überein, wird .probe aufgerufen. |
| @id_table | Liste der unterstützten I2C-Geräte. Verwendet der Kernel nicht of_match_table und DTS-Geräteregistrierung zum Abgleich, greift er auf diese Tabelle zurück. |
| @probe | Callback zur Gerätebindung |
| @remove | Callback zum Aufheben der Gerätebindung |

[Beispiel]

```text
  static const struct i2c_device_id vm149c_id_table[] = {
      { VM149C_NAME, 0 },
      { { 0 } }
  };
  MODULE_DEVICE_TABLE(i2c, vm149c_id_table);
  static const struct of_device_id vm149c_of_table[] = {
      { .compatible = "silicon touch,vm149c" },
      { { 0 } }
  };
  MODULE_DEVICE_TABLE(of, vm149c_of_table);
  static const struct dev_pm_ops vm149c_pm_ops = {
      SET_SYSTEM_SLEEP_PM_OPS(vm149c_vcm_suspend, vm149c_vcm_resume)
      SET_RUNTIME_PM_OPS(vm149c_vcm_suspend, vm149c_vcm_resume, NULL)
  };
  static struct i2c_driver vm149c_i2c_driver = {
      .driver = {
          .name = VM149C_NAME,
          .pm = &vm149c_pm_ops,
          .of_match_table = vm149c_of_table,
      },
      .probe = &vm149c_probe,
      .remove = &vm149c_remove,
      .id_table = vm149c_id_table,
  };
  module_i2c_driver(vm149c_i2c_driver);
```

##### 11.2.1.2 struct v4l2_subdev_core_ops

[Beschreibung]

Definiert die Core-Operations-Callbacks für Subdevices.

[Definition]

```text
  struct v4l2_subdev_core_ops {
      ……
      long (*ioctl)(struct v4l2_subdev *sd, unsigned int cmd, void *arg);
  #ifdef CONFIG_COMPAT
      long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd,
                             unsigned long arg);
  #endif
      ……
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p141, table unit 923 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .ioctl | Wird am Ende der ioctl()-Systemaufrufbehandlung im V4L2-Kern aufgerufen und unterstützt treiberspezifische private ioctls. |
| .compat_ioctl32 | Wird bei einer 32-Bit-Anwendung auf einem 64-Bit-Kernel aufgerufen, um Daten beim Austausch mit dem Userspace anzupassen. |

[Beispiel]

```text
  static const struct v4l2_subdev_core_ops vm149c_core_ops = {
      .ioctl = vm149c_ioctl,
  #ifdef CONFIG_COMPAT
      .compat_ioctl32 = vm149c_compat_ioctl32
  #endif
  };
```

Das folgende private ioctl dient derzeit zur Abfrage von Zeitinformationen der Motorbewegung.

```text
RK_VIDIOC_VCM_TIMEINFO
```

##### 11.2.1.3 struct v4l2_ctrl_ops

[Beschreibung]

Steuerungsoperationen, die der Treiber bereitstellen muss.

[Definition]

```text
  struct v4l2_ctrl_ops {
     int (*g_volatile_ctrl)(struct v4l2_ctrl *ctrl);
     int (*try_ctrl)(struct v4l2_ctrl *ctrl);
     int (*s_ctrl)(struct v4l2_ctrl *ctrl);
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p142, table unit 934 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .g_volatile_ctrl | Einen neuen Wert dieses Controls abfragen. Dies betrifft im Allgemeinen nur flüchtige und meist schreibgeschützte Controls, etwa eines zur Rückgabe der sich ständig ändernden aktuellen Signalstärke. |
| .s_ctrl | Neuen Steuerwert tatsächlich setzen; s_ctrl ist verpflichtend. Während des Aufrufs wird ctrl-&gt;handler-&gt;lock gehalten, sodass niemand sonst auf die Steuerelemente dieses Handlers zugreifen kann. |

[Beispiel]

```text
  static const struct v4l2_ctrl_ops vm149c_vcm_ctrl_ops = {
      .g_volatile_ctrl = vm149c_get_ctrl,
      .s_ctrl = vm149c_set_ctrl,
  };
```

vm149c_get_ctrl und vm149c_set_ctrl unterstützen folgende Steuerelemente:

```text
V4L2_CID_FOCUS_ABSOLUTE
```

#### 11.2.2 Kurze API-Beschreibung

##### 11.2.2.1 xxxx_get_ctrl

[Beschreibung]

Bewegungsposition des Motors abfragen.

[Syntax]

```text
  static int xxxx_get_ctrl(struct v4l2_ctrl *ctrl)
```

[Parameter]

<!-- Source: English PDF p142, table unit 946 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *ctrl | Zeiger auf die V4L2-Steuerstruktur | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p143, table unit 948 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

##### 11.2.2.2 xxxx_set_ctrl

[Beschreibung]

Bewegungsposition des Motors setzen.

[Syntax]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[Parameter]

<!-- Source: English PDF p143, table unit 955 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *ctrl | Zeiger auf die V4L2-Steuerstruktur | Eingabe |

[Rückgabewert]

<!-- Source: English PDF p143, table unit 957 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

```text
11.2.2.3   xxxx_ioctl xxxx_compat_ioctl
```

[Beschreibung]

Die Implementierung des eigenen ioctl umfasst insbesondere die Abfrage von Zeitinformationen der Motorbewegung.

Ein eigenes RK_VIDIOC_COMPAT_VCM_TIMEINFO ist implementiert.

[Syntax]

```text
  static int xxxx_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
  static long xxxx_compat_ioctl32(struct v4l2_subdev *sd, unsigned int cmd,
  unsigned long arg)
```

[Parameter]

<!-- Source: English PDF p144, table unit 965 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *sd | Zeiger auf die V4L2-Subdevice-Struktur | Eingabe |
| cmd | ioctl-Befehl | Eingabe |
| *arg/arg | Parameterzeiger | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p144, table unit 967 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

#### 11.2.3 Schritte zur Treiberportierung

**1. Den standardmäßigen I2C-Subdevice-Treiberteil implementieren.**

1.1 Gemäß struct i2c_driver insbesondere folgende Teile implementieren:

struct driver.name

struct driver.pm

struct driver. of_match_table

probe-Funktion

remove-Funktion

1.2 Einzelheiten zur Implementierung von probe:

1\. VCM-Geräteressourcen anfordern, hauptsächlich aus dem DTS; siehe VCM-Geräteregistrierung (DTS).

1.1) Private RK-Ressourcen wie rockchip, camera-module-xxx stellen hauptsächlich Geräteparameter für die Zuordnung zum Kameragerät bereit.

1.2) VCM-Parameter wie rockchip, vcm-xxx betreffen vor allem Anlaufstrom, Nennstrom und Bewegungsmodus. Sie hängen mit Bewegungsbereich und -geschwindigkeit des Motors zusammen.

2\. VCM-V4L2-Gerät und Media-Entity initialisieren.

V4L2-Subdevice: v4l2_i2c_subdev_init. Der RK-VCM-Treiber verlangt einen eigenen Geräteknoten des Subdevices, auf den camera_engine im Benutzermodus zugreifen und darüber die Fokussierung steuern kann;

Media-Entity: media_entity_init;

3\. Der RK-AF-Algorithmus definiert den gesamten Verfahrweg des Objektivs als Positionsbereich [0,64]. Dem entspricht der VCM-Strombereich [Anlaufstrom, Nennstrom]. Die Umrechnung zwischen beiden Bereichen sollte in einer Funktion implementiert werden.

**2. Den V4L2-Subdevice-Treiber implementieren; dabei sind hauptsächlich die folgenden 2 Mitglieder umzusetzen:**

```text
  struct v4l2_subdev_core_ops
  struct v4l2_ctrl_ops
```

2.1 Gemäß v4l2_subdev_core_ops insbesondere folgende Callbacks implementieren:

```text
.ioctl.compat_ioctl32
```

Dieser Callback implementiert vor allem folgende private RK-Steuerbefehle:

<!-- Source: English PDF p145, table unit 991 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| RK_VIDIOC_VCM_TIMEINFO | camera_engine ermittelt damit die Dauer der Objektivbewegung und entscheidet, wann das Objektiv stillsteht und ob sich die CIS-Belichtungszeit mit der Bewegung überschneidet. Die Bewegungsdauer hängt von Weglänge und Stromausgabemodus des VCM-Treiber-IC ab. |

2.2 Gemäß v4l2_ctrl_ops insbesondere folgende Callbacks implementieren:

```text
.g_volatile_ctrl.s_ctrl
```

.g_volatile_ctrl und .s_ctrl implementieren folgende Befehle mit standardmäßigen V4L2-Steuerelementen:

<!-- Source: English PDF p145, table unit 995 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| V4L2_CID_FOCUS_ABSOLUTE | camera_engine setzt und liest damit die absolute Objektivposition. Der RK-AF-Algorithmus definiert den gesamten Verfahrweg als [0,64]. |

## 12. Blitzlichttreiber

### 12.1 Blitzlicht-Geräteregistrierung (DTS)

**SGM378-DTS-Referenz:**

```text
  &i2c1 {
      ...
      sgm3784: sgm3784@30 {//Flash equipment
          #address-cells = <1>;
          #size-cells = <0>;
          compatible = "sgmicro,gsm3784";
          reg = <0x30>;
          rockchip,camera-module-index = <0>;//The flash corresponds to the camera module number
          rockchip,camera-module-facing = "back";//The flash corresponds to the orientation of the camera module
          enable-gpio = <&gpio2 RK_PB4 GPIO_ACTIVE_HIGH>;//enable gpio
          strobe-gpio = <&gpio1 RK_PA3 GPIO_ACTIVE_HIGH>;//flash trigger gpio
          status = "okay";
          sgm3784_led0: led@0 {//led0 device information
              reg = <0x0>;//index
              led-max-microamp = <299200>;//Torch mode maximum current
              flash-max-microamp = <1122000>;//flash mode maximum current
              flash-max-timeout-us = <1600000>;//maximum flash time
          };
          sgm3784_led1: led@1 {//led1 device information
              reg = <0x1>;//index
              led-max-microamp = <299200>;//Torch mode maximum current
              flash-max-microamp = <1122000>;//flash mode maximum current
              flash-max-timeout-us = <1600000>;//maximum flash time
          };
      };
      ...
      ov13850: ov13850@10 {
          ...
          flash-leds = <&sgm3784_led0 &sgm3784_led1>;//The flash device is hooked to the camera
          ...
      };
      ...
  }
```

**DTS-Referenz für GPIO- und PWM-Steuerung:**

```text
  flash_ir: flash-ir {
          status = "okay";
          compatible = "led,rgb13h";
          label = "pwm-flash-ir";
          led-max-microamp = <20000>;
          flash-max-microamp = <20000>;
          flash-max-timeout-us = <1000000>;
          pwms=<&pwm3 0 25000 0>;
          //enable-gpio = <&gpio0 RK_PA1 GPIO_ACTIVE_HIGH>;
          rockchip,camera-module-index = <1>;
          rockchip,camera-module-facing = "front";
  };
  &i2c1 {
      imx415: imx415@1a {
          ...
          flash-leds = <&flash_ir>;
          ...
      }
  }
```

**Hinweis:**

1\. Die Software muss je nach Aufhelllichttyp unterschiedliche Abläufe verwenden. Bei Infrarot-Aufhelllicht muss das DTS-Knotenlabel ir enthalten, um den Hardwaretyp zu kennzeichnen. Bei LED-Aufhelllicht kann das Feld ir entfallen.

2\. Bei dieser über einen einzelnen Pin gesteuerten Schaltung gibt es zwei Fälle: Feste Helligkeit wird direkt per GPIO gesteuert; regelbare Helligkeit per PWM über das Tastverhältnis. Wählen Sie im DTS entweder pwms oder enable-gpio.

### 12.2 Beschreibung des Blitzlichttreibers

#### 12.2.1 Kurze Beschreibung der Datentypen

##### 12.2.1.1 struct i2c_driver

[Beschreibung]

Definiert Informationen des I2C-Gerätetreibers.

[Definition]

```text
  struct i2c_driver {
      ……
      /* Standard driver model interfaces */
      int (*probe)(struct i2c_client *, const struct i2c_device_id *);
      int (*remove)(struct i2c_client *);
      ……
      struct device_driver driver;
      const struct i2c_device_id *id_table;
      ……
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p147, table unit 1016 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| @driver | Enthält im Gerätetreibermodell hauptsächlich Treibername und of_match_table zum Abgleich mit dem im DTS registrierten Gerät. Stimmen die compatible-Felder von of_match_table und DTS überein, wird .probe aufgerufen. |
| @id_table | Liste der unterstützten I2C-Geräte. Verwendet der Kernel nicht of_match_table und DTS-Geräteregistrierung zum Abgleich, greift er auf diese Tabelle zurück. |
| @probe | Callback zur Gerätebindung |
| @remove | Callback zum Aufheben der Gerätebindung |

[Beispiel]

```text
  static const struct i2c_device_id sgm3784_id_table[] = {
      { SGM3784_NAME, 0 },
      { { 0 } }
  };
  MODULE_DEVICE_TABLE(i2c, sgm3784_id_table);
  static const struct of_device_id sgm3784_of_table[] = {
      { .compatible = "sgmicro,sgm3784" },
      { { 0 } }
  };
  MODULE_DEVICE_TABLE(of, sgm3784_of_table);
  static const struct dev_pm_ops sgm3784_pm_ops = {
      SET_RUNTIME_PM_OPS(sgm3784_runtime_suspend, sgm3784_runtime_resume, NULL)
  };
  static struct i2c_driver sgm3784_i2c_driver = {
      .driver = {
          .name = sgm3784_NAME,
          .pm = &sgm3784_pm_ops,
          .of_match_table = sgm3784_of_table,
      },
      .probe = &sgm3784_probe,
      .remove = &sgm3784_remove,
      .id_table = sgm3784_id_table,
  };
  module_i2c_driver(vm149c_i2c_driver);
```

##### 12.2.1.2 struct v4l2_subdev_core_ops

[Beschreibung]

Definiert die Core-Operations-Callbacks für Subdevices.

[Definition]

```text
  struct v4l2_subdev_core_ops {
      ……
      long (*ioctl)(struct v4l2_subdev *sd, unsigned int cmd, void *arg);
  #ifdef CONFIG_COMPAT
      long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd,
               unsigned long arg);
  #endif
      ……
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p148, table unit 1026 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .ioctl | Wird am Ende der ioctl()-Systemaufrufbehandlung im V4L2-Kern aufgerufen und unterstützt treiberspezifische private ioctls. |
| .compat_ioctl32 | Wird bei einer 32-Bit-Anwendung auf einem 64-Bit-Kernel aufgerufen, um Daten beim Austausch mit dem Userspace anzupassen. |

[Beispiel]

```text
  static const struct v4l2_subdev_core_ops sgm3784_core_ops = {
      .ioctl = sgm3784_ioctl,
  #ifdef CONFIG_COMPAT
      .compat_ioctl32 = sgm3784_compat_ioctl32
  #endif
  };
```

Das folgende private ioctl dient derzeit zur Abfrage der Einschaltzeitinformationen des Blitzlichts.

```text
RK_VIDIOC_FLASH_TIMEINFO
```

##### 12.2.1.3 struct v4l2_ctrl_ops

[Beschreibung]

Steuerungsoperationen, die der Treiber bereitstellen muss.

[Definition]

```text
  struct v4l2_ctrl_ops {
      int (*g_volatile_ctrl)(struct v4l2_ctrl *ctrl);
      int (*s_ctrl)(struct v4l2_ctrl *ctrl);
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p149, table unit 1037 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .g_volatile_ctrl | Einen neuen Wert dieses Controls abfragen. Dies betrifft im Allgemeinen nur flüchtige und meist schreibgeschützte Controls, etwa eines zur Rückgabe der sich ständig ändernden aktuellen Signalstärke. |
| .s_ctrl | Neuen Steuerwert tatsächlich setzen; s_ctrl ist verpflichtend. Während des Aufrufs wird ctrl-&gt;handler-&gt;lock gehalten, sodass niemand sonst auf die Steuerelemente dieses Handlers zugreifen kann. |

[Beispiel]

```text
  static const struct v4l2_ctrl_ops sgm3784_ctrl_ops[LED_MAX] = {
      [LED0] = {
          .g_volatile_ctrl = sgm3784_led0_get_ctrl,
          .s_ctrl = sgm3784_led0_set_ctrl,
      },
      [LED1] = {
          .g_volatile_ctrl = sgm3784_led1_get_ctrl,
          .s_ctrl = sgm3784_led1_set_ctrl,
      }
  };
```

#### 12.2.2 Kurze API-Beschreibung

##### 12.2.2.1 xxxx_set_ctrl

[Beschreibung]

Blitzmodus, Strom und Blitzzeitbegrenzung einstellen.

[Syntax]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[Parameter]

<!-- Source: English PDF p150, table unit 1047 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *ctrl | Zeiger auf die V4L2-Steuerstruktur | Eingabe |

[Rückgabewert]

<!-- Source: English PDF p150, table unit 1049 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

##### 12.2.2.2 xxxx_get_ctrl

[Beschreibung]

Fehlerstatus des Blitzlichts abfragen.

[Syntax]

```text
  static int xxxx_get_ctrl(struct v4l2_ctrl *ctrl)
```

[Parameter]

<!-- Source: English PDF p150, table unit 1056 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *ctrl | Zeiger auf die V4L2-Steuerstruktur | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p150, table unit 1058 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

```text
12.2.2.3   xxxx_ioctl xxxx_compat_ioctl
```

[Beschreibung]

Die Implementierung des eigenen ioctl umfasst insbesondere die Abfrage von Zeitinformationen des Blitzlichts.

Ein eigenes RK_VIDIOC_COMPAT_FLASH_TIMEINFO ist implementiert.

[Syntax]

```text
  static int xxxx_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
  static long xxxx_compat_ioctl32(struct v4l2_subdev *sd, unsigned int cmd,
  unsigned long arg)
```

[Parameter]

<!-- Source: English PDF p151, table unit 1066 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *sd | Zeiger auf die V4L2-Subdevice-Struktur | Eingabe |
| cmd | ioctl-Befehl | Eingabe |
| *arg/arg | Parameterzeiger | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p151, table unit 1068 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

#### 12.2.3 Schritte zur Treiberportierung

Für direkt per GPIO gesteuerte LEDs siehe kernel/drivers/leds/leds-rgb13h.c und kernel/Documentation/devicetree/bindings/leds/leds-rgb13h.txt.

Der Treiber des Blitzlicht-IC kann wie folgt portiert werden:

**1. Den standardmäßigen I2C-Subdevice-Treiberteil implementieren.**

1.1 Gemäß struct i2c_driver insbesondere folgende Teile implementieren:

struct driver.name

struct driver.pm

struct driver. of_match_table

probe-Funktion

remove-Funktion

1.2 Einzelheiten zur Implementierung von probe:

1\. Blitzlicht-Geräteressourcen anfordern, hauptsächlich aus dem DTS; siehe Blitzlicht-Geräteregistrierung (DTS).

1.1) Private RK-Ressourcen wie rockchip, camera-module-xxx stellen hauptsächlich Geräteparameter für die Zuordnung zum Kameragerät bereit.

2\. Name des Blitzlichtgeräts:

Bei zwei Blitz-LEDs werden die Gerätenamen led0 und led1 zur Unterscheidung verwendet.

```text
  /* NOTE: to distinguish between two led
   * name: led0 meet the main led
   * name: led1 meet the secondary led
   */
  snprintf(sd->name, sizeof(sd->name),
           "m%02d_%s_%s_led%d %s",
           flash->module_index, facing,
           SGM3784_NAME, i, dev_name(sd->dev));
```

3\. Blitzlicht-V4L2-Gerät und Media-Entity initialisieren.

V4L2-Subdevice: v4l2_i2c_subdev_init. Der RK-Blitzlichttreiber verlangt einen eigenen Subdevice-Geräteknoten für camera_engine im Userspace; darüber werden die LEDs gesteuert.

Media-Entity: media_entity_init;

**2. Den V4L2-Subdevice-Treiber implementieren; dabei sind hauptsächlich die folgenden 2 Mitglieder umzusetzen:**

```text
  struct v4l2_subdev_core_ops
  struct v4l2_ctrl_ops
```

2.1 Gemäß v4l2_subdev_core_ops insbesondere folgende Callbacks implementieren:

```text
.ioctl.compat_ioctl32
```

Dieser Callback implementiert vor allem folgende private RK-Steuerbefehle:

<!-- Source: English PDF p152, table unit 1095 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| RK_VIDIOC_FLASH_TIMEINFO | camera_engine ermittelt damit den LED-Einschaltzeitpunkt und prüft, ob die CIS-Belichtungszeit nach dem Einschalten des Blitzlichts liegt. |

2.2 Gemäß v4l2_ctrl_ops insbesondere folgende Callbacks implementieren:

```text
.g_volatile_ctrl.s_ctrl
```

.g_volatile_ctrl und .s_ctrl implementieren folgende Befehle mit standardmäßigen V4L2-Steuerelementen:

<!-- Source: English PDF p153, table unit 1099 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| V4L2_CID_FLASH_FAULT | Blitzlichtfehlerinformationen abfragen |
| V4L2_CID_FLASH_LED_MODE | LED-Modus einstellen: V4L2_FLASH_LED_MODE_NONE V4L2_FLASH_LED_MODE_TORCH V4L2_FLASH_LED_MODE_FLASH |
| V4L2_CID_FLASH_STROBE | Blitzlicht einschalten |
| V4L2_CID_FLASH_STROBE_STOP | Blitzlicht ausschalten |
| V4L2_CID_FLASH_TIMEOUT | Maximale ununterbrochene Leuchtdauer im Blitzmodus einstellen |
| V4L2_CID_FLASH_INTENSITY | Strom im Blitzmodus einstellen |
| V4L2_CID_FLASH_TORCH_INTENSITY | Strom im Dauerlichtmodus einstellen |

## 13. Treiber für FOCUS, ZOOM und P-IRIS

Dieser Treiber steuert Autofokus (FOCUS), Zoom (ZOOM) und automatische Blende (P-IRIS) über Schrittmotoren. Wegen der gleichen Motorsteuerung und des Hardwaredesigns sind die drei Funktionen in einem Treiber zusammengefasst. Je nach Treiberchip kann dieser beispielsweise als SPI-Subdevice eingebunden werden. Dieses Kapitel erläutert anhand der Chips MP6507 und MS41908 die erforderlichen Datenstrukturen, das Framework und wichtige Hinweise.

### 13.1 MP6507-Geräteregistrierung (DTS)

```text
  mp6507: mp6507 {
      status = "okay";
      compatible = "monolithicpower,mp6507";
      #pwm-cells = <3>;
      pwms = <&pwm6 0 25000 0>,
             <&pwm10 0 25000 0>,
             <&pwm9 0 25000 0>,
             <&pwm8 0 25000 0>;
      pwm-names = "ain1","ain2","bin1","bin2";
      rockchip,camera-module-index = <1>;
      rockchip,camera-module-facing = "front";
      iris_en-gpios  = <&gpio0 RK_PC2 GPIO_ACTIVE_HIGH>;
      focus_en-gpios  = <&gpio0 RK_PC3 GPIO_ACTIVE_HIGH>;
      zoom_en-gpios  = <&gpio0 RK_PC0 GPIO_ACTIVE_HIGH>;
      iris-step-max = <80>;
      focus-step-max = <7500>;
      zoom-step-max = <7500>;
      iris-start-up-speed = <1200>;
      focus-start-up-speed = <1200>;
      focus-max-speed = <2500>;
      zoom-start-up-speed = <1200>;
      zoom-max-speed = <2500>;
      focus-first-speed-step = <8>;
      zoom-first-speed-step = <8>;
      focus-speed-up-table = < 1176 1181 1188 1196
                               1206 1217 1231 1246
                               1265 1286 1309 1336
                               1365 1396 1429 1464
                               1500 1535 1570 1603
                               1634 1663 1690 1713
                               1734 1753 1768 1782
                               1793 1803 1811 1818>;
      focus-speed-down-table = < 1796 1788 1779 1768
                                 1756 1743 1728 1712
                                 1694 1674 1653 1630
                                 1605 1580 1554 1527
                                 1500 1472 1445 1419
                                 1394 1369 1346 1325
                                 1305 1287 1271 1256
                                 1243 1231 1220 1211
                                 1203 1195 1189 1184
                                 1179 1175>;
      zoom-speed-up-table = < 1198 1205 1212 1220
                              1228 1238 1249 1260
                              1272 1285 1299 1313
                              1328 1343 1359 1375
                              1390 1406 1421 1436
                              1450 1464 1477 1489
                              1500 1511 1521 1529
                              1537 1544 1551>;
      zoom-speed-down-table = < 1547 1540 1531 1522
                                1511 1499 1487 1473
                                1458 1443 1426 1409
                                1392 1375 1357 1340
                                1323 1306 1291 1276
                                1262 1250 1238 1227
                                1218 1209 1202 1195
                                1189 1184 1179 1175
                                1171 1168>;
  };
  &i2c1 {
      imx334: imx334@1a {
          ...
          lens-focus = <&mp6507>;
          ...
      }
  }
  &pwm6 {
      status = "okay";
      pinctrl-names = "active";
      pinctrl-0 = <&pwm6m1_pins_pull_up>;
  };
  &pwm8 {
      status = "okay";
      pinctrl-names = "active";
      pinctrl-0 = <&pwm8m1_pins_pull_down>;
      center-aligned;
  };
  &pwm9 {
      status = "okay";
      pinctrl-names = "active";
      pinctrl-0 = <&pwm9m1_pins_pull_down>;
      center-aligned;
  };
  &pwm10 {
      status = "okay";
      pinctrl-names = "active";
      pinctrl-0 = <&pwm10m1_pins_pull_down>;
  };
```

**Beschreibung der RK-spezifischen Definitionen:**

<!-- Source: English PDF p156, table unit 1107 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| rockchip, camera-module- index | Kameranummer zur Zuordnung der Kamera |
| rockchip, camera-module- facing | Kameraausrichtung zur Zuordnung der Kamera |
| iris_en-gpios | GPIO zur IRIS-Aktivierung |
| focus_en-gpios | GPIO zur Fokusaktivierung |
| zoom_en-gpios | GPIO zur Zoomaktivierung |
| rockchip,iris- step-max | Maximale Schrittzahl des P-IRIS-Schrittmotors |
| rockchip,focus- step-max | Maximale Schrittzahl des Fokus-Schrittmotors |
| zoom-step-max | Maximale Schrittzahl des Zoom-Schrittmotors |
| iris-start-up- speed | Startgeschwindigkeit des IRIS-Schrittmotors |
| focus-start-up- speed | Startgeschwindigkeit des Fokus-Schrittmotors |
| focus-max-speed | Maximale Betriebsgeschwindigkeit des Fokus-Schrittmotors |
| zoom-start-up- speed | Startgeschwindigkeit des Zoom-Schrittmotors |
| zoom-max-speed | Maximale Betriebsgeschwindigkeit des Zoom-Schrittmotors |
| focus-first-speed- step | Schrittzahl bei Fokus-Startgeschwindigkeit. In nachfolgenden Beschleunigungsstufen<br>wird sie proportional erhöht, damit die Laufzeiten aller Geschwindigkeitsstufen<br>möglichst gleich sind. |
| zoom-first-speed- step | Schrittzahl bei Zoom-Startgeschwindigkeit. In nachfolgenden Beschleunigungsstufen<br>wird sie proportional erhöht, damit die Laufzeiten aller Geschwindigkeitsstufen<br>möglichst gleich sind. |
| focus-speed-up- table | Fokus-Beschleunigungskurve als Nachschlagetabelle. Durch Parameteranpassung<br>eine trapezförmige oder S-förmige Kurve erzeugen und deren Daten konfigurieren.<br>Ohne Konfiguration oder mit nur einem Wert läuft der Motor konstant mit Startgeschwindigkeit.<br>Der kleinste Kurvenwert darf die maximale Anlaufgeschwindigkeit nicht überschreiten,<br>der größte nicht die maximale Betriebsgeschwindigkeit des Motors. |

<!-- Source: English PDF p157, table unit 1108 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| focus-speed- down-table | Fokus-Verzögerungskurve. Ihr Maximum muss unter dem Maximum der Beschleunigungskurve liegen. Ist die Beschleunigungskurve ungültig, gilt dies auch für die Verzögerungskurve; der Motor läuft durchgehend mit Startgeschwindigkeit. Ohne eigene Verzögerungskurve wird sie symmetrisch aus der Beschleunigungskurve abgeleitet. |
| zoom-speed-up- table | Die Zoom-Beschleunigungskurve wird über eine Nachschlagetabelle realisiert. Durch Parameteranpassung wird eine Beschleunigungskurve erzeugt; anschließend wird die Datentabelle der erzeugten trapezförmigen oder S-förmigen Kurve konfiguriert. Ohne Konfiguration oder bei nur einem Datenwert läuft der Motor mit konstanter Startgeschwindigkeit. Der Minimalwert der Beschleunigungskurve darf die maximale Startgeschwindigkeit des Motors nicht überschreiten, der Maximalwert nicht die maximale Betriebsgeschwindigkeit des Schrittmotors. |
| zoom-speed- down-table | Zoom-Verzögerungskurve. Ihr Maximum muss unter dem Maximum der Beschleunigungskurve liegen. Ist die Beschleunigungskurve ungültig, gilt dies auch für die Verzögerungskurve; der Motor läuft durchgehend mit Startgeschwindigkeit. Ohne eigene Verzögerungskurve wird sie symmetrisch aus der Beschleunigungskurve abgeleitet. |

#### 13.1.1 Kurze Beschreibung der Datentypen

##### 13.1.1.1 struct platform_driver

[Beschreibung]

Definiert Informationen des Plattformgerätetreibers.

[Definition]

```text
  struct platform_driver {
          int (*probe)(struct platform_device *);
          int (*remove)(struct platform_device *);
          void (*shutdown)(struct platform_device *);
          int (*suspend)(struct platform_device *, pm_message_t state);
          int (*resume)(struct platform_device *);
          struct device_driver driver;
          const struct platform_device_id *id_table;
          bool prevent_deferred_probe;
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p158, table unit 1116 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| @driver | struct device_driver enthält hauptsächlich Treibername und of_match_table zum Abgleich mit DTS-Geräten. Stimmen die compatible-Felder von of_match_table und DTS überein, wird .probe aufgerufen. |
| @id_table | Verwendet der Kernel nicht of_match_table und DTS-Geräte zum Abgleich, verwendet er diese Tabelle. |
| @probe | Callback zur Gerätebindung |
| @remove | Callback zum Aufheben der Gerätebindung |

[Beispiel]

```text
  #if defined(CONFIG_OF)
  static const struct of_device_id motor_dev_of_match[] = {
      { .compatible = "monolithicpower,mp6507", },
      {},
  };
  #endif
  static struct platform_driver motor_dev_driver = {
      .driver = {
          .name = DRIVER_NAME,
          .owner = THIS_MODULE,
          .of_match_table = of_match_ptr(motor_dev_of_match),
      },
      .probe = motor_dev_probe,
      .remove = motor_dev_remove,
  };
  module_platform_driver(motor_dev_driver);
```

##### 13.1.1.2 struct v4l2_subdev_core_ops

[Beschreibung]

Definiert die Core-Operations-Callbacks für Subdevices.

[Definition]

```text
  struct v4l2_subdev_core_ops {
      ……
      long (*ioctl)(struct v4l2_subdev *sd, unsigned int cmd, void *arg);
  #ifdef CONFIG_COMPAT
      long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd,
               unsigned long arg);
  #endif
      ……
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p159, table unit 1125 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .ioctl | Wird am Ende der ioctl()-Systemaufrufbehandlung im V4L2-Kern aufgerufen und unterstützt treiberspezifische private ioctls. |
| .compat_ioctl32 | Wird bei einer 32-Bit-Anwendung auf einem 64-Bit-Kernel aufgerufen, um Daten beim Austausch mit dem Userspace anzupassen. |

[Beispiel]

```text
  static const struct v4l2_subdev_core_ops motor_core_ops = {
      .ioctl = motor_ioctl,
  };
  static const struct v4l2_subdev_ops motor_subdev_ops = {
      .core   = &motor_core_ops,
  };
```

##### 13.1.1.3 struct v4l2_ctrl_ops

[Beschreibung]

Steuerungsoperationen, die der Treiber bereitstellen muss.

[Definition]

```text
  struct v4l2_ctrl_ops {
      int (*g_volatile_ctrl)(struct v4l2_ctrl *ctrl);
      int (*s_ctrl)(struct v4l2_ctrl *ctrl);
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p159, table unit 1134 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .g_volatile_ctrl | Einen neuen Wert dieses Controls abfragen. Dies betrifft im Allgemeinen nur flüchtige und meist schreibgeschützte Controls, etwa eines zur Rückgabe der sich ständig ändernden aktuellen Signalstärke. |
| .s_ctrl | Neuen Steuerwert tatsächlich setzen; s_ctrl ist verpflichtend. Während des Aufrufs wird ctrl-&gt;handler-&gt;lock gehalten, sodass niemand sonst auf die Steuerelemente dieses Handlers zugreifen kann. |

[Beispiel]

```text
  static const struct v4l2_ctrl_ops motor_ctrl_ops = {
      .s_ctrl = motor_s_ctrl,
  };
```

#### 13.1.2 Kurze API-Beschreibung

##### 13.1.2.1 xxxx_set_ctrl

[Beschreibung]

Fokus-, Zoom- und P-Blendenposition über standardmäßiges v4l2_control setzen.

Folgende standardmäßige V4L2-Befehle sind implementiert:

<!-- Source: English PDF p160, table unit 1142 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| V4L2_CID_FOCUS_ABSOLUTE | Fokus steuern. Laut Quelle bedeutet 0 die kleinste Brennweite und eine scharfe Nahaufnahme. |
| V4L2_CID_ZOOM_ABSOLUTE | Zoomfaktor steuern. 0 bedeutet kleinster Zoomfaktor und größtes Sichtfeld. |
| V4L2_CID_IRIS_ABSOLUTE | Öffnung der P-Blende steuern. 0 bedeutet geschlossene Blende. |

[Syntax]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[Parameter]

<!-- Source: English PDF p160, table unit 1146 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *ctrl | Zeiger auf die V4L2-Steuerstruktur | Eingabe |

[Rückgabewert]

<!-- Source: English PDF p160, table unit 1148 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

##### 13.1.2.2 xxxx_get_ctrl

[Beschreibung]

Aktuelle Fokus-, Zoom- und P-Blendenposition über standardmäßiges v4l2_control abfragen.

Folgende standardmäßige V4L2-Befehle sind implementiert:

<!-- Source: English PDF p161, table unit 1153 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| V4L2_CID_FOCUS_ABSOLUTE | Fokus steuern. Laut Quelle bedeutet 0 die kleinste Brennweite und eine scharfe Nahaufnahme. |
| V4L2_CID_ZOOM_ABSOLUTE | Zoomfaktor steuern. 0 bedeutet kleinster Zoomfaktor und größtes Sichtfeld. |
| V4L2_CID_IRIS_ABSOLUTE | Öffnung der P-Blende steuern. 0 bedeutet geschlossene Blende. |

[Syntax]

```text
  static int xxxx_get_ctrl(struct v4l2_ctrl *ctrl)
```

[Parameter]

<!-- Source: English PDF p161, table unit 1157 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *ctrl | Zeiger auf die V4L2-Steuerstruktur | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p161, table unit 1159 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

```text
13.1.2.3   xxxx_ioctl xxxx_compat_ioctl
```

[Beschreibung]

Das eigene ioctl ermittelt hauptsächlich Zeitinformationen für Fokus, Zoom und P-Blende, also Zeitstempel von Bewegungsbeginn und -ende. Da das verwendete Objektiv keine Positionserfassung besitzt, muss die Motorposition bei Bedarf zurückgesetzt werden.

**Implementierte Anpassungen:**

<!-- Source: English PDF p162, table unit 1164 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| RK_VIDIOC_VCM_TIMEINFO | Fokussierungszeitinformationen zur Prüfung, ob das aktuelle Bild nach Abschluss der Fokussierung gültig ist |
| RK_VIDIOC_ZOOM_TIMEINFO | Zoomzeitinformationen zur Prüfung, ob das aktuelle Bild nach Abschluss des Zoomens gültig ist |
| RK_VIDIOC_IRIS_TIMEINFO | Blendenzeitinformationen zur Prüfung, ob das aktuelle Bild nach Abschluss der Blendenanpassung gültig ist |
| RK_VIDIOC_FOCUS_CORRECTION | Fokusposition korrigieren beziehungsweise zurücksetzen |
| RK_VIDIOC_ZOOM_CORRECTION | Zoomposition korrigieren beziehungsweise zurücksetzen |
| RK_VIDIOC_IRIS_CORRECTION | Blendenposition korrigieren beziehungsweise zurücksetzen |

[Syntax]

```text
  static int xxxx_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
  static long xxxx_compat_ioctl32(struct v4l2_subdev *sd, unsigned int cmd,
  unsigned long arg)
```

[Parameter]

<!-- Source: English PDF p162, table unit 1168 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *sd | Zeiger auf die V4L2-Subdevice-Struktur | Eingabe |
| cmd | ioctl-Befehl | Eingabe |
| *arg/arg | Parameterzeiger | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p162, table unit 1170 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

#### 13.1.3 Schritte zur Treiberportierung

Bei SPI-gesteuerten Treiberchips kann die Portierung auf dem SPI-Framework aufbauen. Der RK-Referenztreiber verwendet MP6507: PWM erzeugt direkt die Steuerwellenformen, MP6507 übernimmt die Leistungsverstärkung. Daher wird das Plattformframework direkt verwendet. Treiberreferenz: /kernel/drivers/media/i2c/mp6507.c

Portierungsschritte:

**1. Den standardmäßigen Plattform-Subdevice-Treiberteil implementieren.**

1.1 Gemäß struct platform_driver insbesondere folgende Teile implementieren:

struct driver.name

struct driver. of_match_table

probe-Funktion

remove-Funktion

1.2 Einzelheiten zur Implementierung von probe:

1\. Geräteressourcen anfordern, hauptsächlich aus dem DTS; siehe MP6507-Geräteregistrierung (DTS).

1.1) Private RK-Ressourcen wie rockchip, camera-module-xxx stellen hauptsächlich Geräteparameter für die Zuordnung zum Kameragerät bereit.

1.2) PWM-Konfiguration abrufen. Die Motorsteuerung verlangt 90 Grad Phasenverschiebung zwischen A und B. Dies lässt sich durch mittenausgerichtete PWM der B-Phase erreichen. Setzen Sie center-aligned am DTS-PWM-Knoten; siehe MP6507-Geräteregistrierung (DTS).

![Erregungsfolge und Wicklungsanschlüsse des Motors — englische Originalabbildung, PDF-Seite 163](/docs/rockchip-isp30-vi-driver/assets/en-p163-X756.png)

*Erregungsfolge und Wicklungsanschlüsse des Motors — englische Originalabbildung, PDF-Seite 163*

Erregungsfolge; Drehung der Ausgangswelle im Uhrzeigersinn (CW).

| Phase / Schritt | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- |
| A | + | + | − | − |
| A̅ | − | − | + | + |
| B | − | + | + | − |
| B̅ | + | − | − | + |

1.3) Freigabepin anfordern. MP6507 benötigt 4 PWMs für die Schrittmotor-Steuerwellenformen. Da Hardware-PWMs begrenzt sind und Fokus, Zoom und P-Blende jeweils einen MP6507 verwenden, wird der jeweilige Treiber per GPIO aktiviert, um PWM im Zeitmultiplex gemeinsam zu nutzen. Nachteil: Nur ein Motor kann gleichzeitig laufen; die anderen beiden müssen warten. 1.4) Hardwaregrenzen und Ressourcen jedes Motors erfassen, etwa maximale Schrittzahl, maximale Anlauf- und Betriebsgeschwindigkeit sowie Beschleunigungskurvendaten.

2\. Timer mit hrtimer_init initialisieren. PWM läuft kontinuierlich und benötigt einen Timer: Nach der vorgegebenen Anzahl von PWM-Perioden schaltet der Timerinterrupt PWM ab. Auch beim Beschleunigen ändert ein Timerinterrupt nach einer bestimmten Periodenzahl die PWM-Frequenz und beschleunigt so den Motor.

3\. Synchronisation mittels init_completion einrichten. Die nächste Motoroperation darf erst beginnen, wenn die vorherige Bewegung abgeschlossen ist.

4\. V4L2-Gerät und Media-Entity initialisieren.

V4L2-Subdevice: v4l2_i2c_subdev_init. Der Treiber verlangt einen eigenen Subdevice-Geräteknoten für rkaiq im Userspace; darüber wird der Motor gesteuert.

Media-Entity: media_entity_init;

5\. Name des Blitzlichtgeräts; diese Bezeichnung steht so im Motorabschnitt der Quelle:

```text
  snprintf(sd->name, sizeof(sd->name), "m%02d_%s_%s",
           motor->module_index, facing,
           DRIVER_NAME);
```

**2. Den V4L2-Subdevice-Treiber implementieren; dabei sind hauptsächlich die folgenden 2 Mitglieder umzusetzen:**

```text
  struct v4l2_subdev_core_ops
  struct v4l2_ctrl_ops
```

2.1 Gemäß v4l2_subdev_core_ops insbesondere folgende Callbacks implementieren:

```text
  .ioctl
  .compat_ioctl32
```

Dieser Callback implementiert vor allem folgende private RK-Steuerbefehle:

<!-- Source: English PDF p164, table unit 1201 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| RK_VIDIOC_VCM_TIMEINFO | Fokussierungszeitinformationen zur Prüfung, ob das aktuelle Bild nach Abschluss der Fokussierung gültig ist |
| RK_VIDIOC_ZOOM_TIMEINFO | Zoomzeitinformationen zur Prüfung, ob das aktuelle Bild nach Abschluss des Zoomens gültig ist |
| RK_VIDIOC_IRIS_TIMEINFO | Blendenzeitinformationen zur Prüfung, ob das aktuelle Bild nach Abschluss der Blendenanpassung gültig ist |
| RK_VIDIOC_FOCUS_CORRECTION | Fokusposition korrigieren beziehungsweise zurücksetzen |
| RK_VIDIOC_ZOOM_CORRECTION | Zoomposition korrigieren beziehungsweise zurücksetzen |
| RK_VIDIOC_IRIS_CORRECTION | Blendenposition korrigieren beziehungsweise zurücksetzen |

2.2 Gemäß v4l2_ctrl_ops insbesondere folgende Callbacks implementieren:

```text
.g_volatile_ctrl
.s_ctrl
```

.g_volatile_ctrl und .s_ctrl implementieren folgende Befehle mit standardmäßigen V4L2-Steuerelementen:

<!-- Source: English PDF p164, table unit 1206 -->

| Parametername | Beschreibung |
| --- | --- |
| V4L2_CID_FOCUS_ABSOLUTE | Fokus steuern. Laut Quelle bedeutet 0 die kleinste Brennweite und eine scharfe Nahaufnahme. |
| V4L2_CID_ZOOM_ABSOLUTE | Zoomfaktor steuern. 0 bedeutet kleinster Zoomfaktor und größtes Sichtfeld. |
| V4L2_CID_IRIS_ABSOLUTE | Öffnung der P-Blende steuern. 0 bedeutet geschlossene Blende. |

**3. Referenz für die Beschleunigungskurve des Schrittmotors:**

3.1 Trapezkurve: Wie abgebildet kann mit gleichen Intervallen und Geschwindigkeitsänderungen beschleunigt und verzögert werden.

![Trapezförmige Motorbeschleunigung — englische Originalabbildung, PDF-Seite 165](/docs/rockchip-isp30-vi-driver/assets/en-p165-X763.png)

*Trapezförmige Motorbeschleunigung — englische Originalabbildung, PDF-Seite 165*

3.2 S-Kurve: Ist die trapezförmige Beschleunigung nicht geeignet, kann eine S-förmige Beschleunigung verwendet werden. Referenzformel: Speed = Vmin + ((Vmax-Vmin) / (1 + exp(-fac * (i-Num) / Num)));

Dabei gilt:

Vmin bezeichnet die Startgeschwindigkeit des Motors, Vmax seine Zielgeschwindigkeit. fac ist der Kurvenkoeffizient, normalerweise im Bereich 4~6; je größer der Wert, desto steiler die Kurve in der Mitte. i ist die Nummer des Geschwindigkeitssegments; bei einer Beschleunigung in 32 Segmenten liegt der Wert bei 0~31. Num ist die halbe Anzahl der Geschwindigkeitssegmente; bei 32 Segmenten beträgt num 16.

![S-förmige Motorbeschleunigung — englische Originalabbildung, PDF-Seite 165](/docs/rockchip-isp30-vi-driver/assets/en-p165-X764.png)

*S-förmige Motorbeschleunigung — englische Originalabbildung, PDF-Seite 165*

### 13.2 MS41908-Geräteregistrierung (DTS)

Manche Objektive unterstützen PIRIS, FOCUS, ZOOM und ZOOM1 oder die Kombination DC-IRIS, FOCUS und ZOOM. Deshalb sind diese Funktionen beim MS41908 konfigurierbar. Der Treiber kann mehrfach geladen werden, um mehrere Treiberchips zu kombinieren. Dies macht das DTS komplexer; lesen Sie jede Parameterbeschreibung sorgfältig.

```text
  &spi0 {
      status = "okay";
      pinctrl-names = "default";
      pinctrl-0 = <&spi0m0_clk &spi0m0_cs0n &spi0m0_miso &spi0m0_mosi>;
      //If pinctrl is not configured, confirm whether the default pinctrl is the actual pin group
      assigned-clocks = <&pmucru CLK_SPI0>;
      assigned-clock-rates = <100000000>;
      ms41908: ms41908@00 {
          status = "okay";
          compatible = "relmon,ms41908";
          reg = <0>;
          pinctrl-names = "default";
          focus-start-up-speed = <800>;
          zoom-start-up-speed = <800>;
          focus-step-max = <3160>;
          zoom-step-max = <1520>;
          focus-backlash = <18>;
          vd_fz-period-us = <10000>;
          vd_fz-gpios = <&gpio3 RK_PC6 GPIO_ACTIVE_HIGH>;
          rockchip,camera-module-index = <1>;
          rockchip,camera-module-facing = "front";
          use-focus;
          use-zoom;
          focus-used-pin = "cd";
          zoom-used-pin = "ab";
      };
  };
  &i2c1 {
      imx335: imx335@1a{
          ...
          lens-focus = <&ms41908>;
          //Multiple device registration，lens-focus = <&ms41908_0 &ms41908_1>;
          ...
      };
  };
```

#### 13.2.1 Grundlegende Beschreibung

<!-- Source: English PDF p167, table unit 1219 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| pinctrl-0 | SPI-Pindefinition gemäß tatsächlicher Pinbelegung zur Zuordnung der SPI-Funktion. Beispiel: pinctrl-0 = &lt;&amp;spi0m0_clk &amp;spi0m0_cs0n &amp;spi0m0_miso &amp;spi0m0_mosi&gt;; |
| assigned-clocks assigned-clock-rates | SPI-Taktkonfiguration; empfohlen sind 100MHz. |
| reg | reg = &lt;0&gt;; verwendet cs0 reg = &lt;1&gt;; verwendet cs1 |
| rockchip,camera- module-index | Kameranummer zur Zuordnung zur Kamera |
| rockchip,camera- module-facing | Kameraausrichtung zur Zuordnung zur Kamera |
| reset-gpios | Reset-Pin von ms41908; bei festem Hardware-Pullup kann die Konfiguration entfallen. |
| vd_fz-period-us | Periode des Impulses zur Aktualisierung der Schrittmotortreiberregister. Beide Motoren verwenden dasselbe Impulssignal. Überschreitet die Bewegung die vd-Periode, gehen Schritte verloren. Der Treiber hält die Dauer einer Einzelbewegung innerhalb dieser Periode. |

#### 13.2.2 FOCUS-Beschreibung

<!-- Source: English PDF p168, table unit 1221 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| use-focus | Gibt an, ob die Fokusfunktion verwendet wird |
| focus-used-pin | Jeder ms41908 steuert zwei Schrittmotoren über die Pingruppen „ab“ und „cd“.<br>Entsprechend der tatsächlichen Hardwareverdrahtung konfigurieren. |
| focus-backlash | Durch Zahnradspiel verursachter Fehler: bei Richtungswechsel zu kompensierende<br>Schrittzahl, durch Tests am tatsächlichen Objektiv bestimmen. |
| focus-start-up- speed | Anlaufgeschwindigkeit des Schrittmotors in PPS |
| focus-step-max | Effektiver Bewegungsbereich des Motors in Schritten |
| focus-ppw | PWM-Tastverhältnis der ms41908-Ausgabe, 0-255. Größere Werte erhöhen<br>die Treiberleistung; entsprechend der Motorlast einstellen. |
| focus-phmode | Phasenkorrektur der ms41908-PWM-Ausgabe; normalerweise nicht konfiguriert,<br>bei Bedarf einstellen. |
| focus-micro | Mikroschritt-Unterteilung: 64, 128 oder 256; Standard: 256. |
| focus-reback- distance | Für genaue Positionen muss die Fokuskurve aus derselben Richtung angefahren werden.<br>Beispiel: Von Position 100 zu 90 zuerst bis 80 zurückfahren und anschließend 90 anfahren.<br>Der Parameter gibt die zusätzliche Rückfahr-Schrittzahl an. |
| focus-1- 2phase- excitation | Standard ist 2-2-Phasen-Erregung; dieser Parameter wählt 1-2-Phasen-Erregung. Beispiel: focus-1-2phase-excitation; |
| focus-dir- opposite | Verläuft die Motorbewegung entgegengesetzt zur tatsächlichen Fokuskurve, kehrt dieser Parameter die Richtung um. Beispiel: focus-dir-opposite; |

**Beschreibung des Optokopplers:**

<!-- Source: English PDF p169, table unit 1223 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| focus-pic | C-Pin des Optokopplers zur Erkennung des Pegelwechsels. Der Übergangspunkt ist der Ursprung des Optokopplers. |
| focus-pia | A-Pin des Optokopplers zur Ansteuerung der Fotodiode. Bei Kalibrierung auf High,<br>im Normalbetrieb auf Low setzen; andernfalls beeinflusst die Fotodiode die Bildaufnahme. |
| focus-pie | Kann hardwareseitig direkt an Masse liegen. Bei GPIO-Steuerung<br>muss der Pin auf Low gesetzt werden. |
| focus-min- pos | Schrittzahlen links und rechts des Optokopplerursprungs messen und im DTS eintragen.<br>Die eingetragenen Werte dürfen größer als die tatsächlichen sein. |
| focus-min- pos | Schrittzahlen links und rechts des Optokopplerursprungs messen und im DTS eintragen.<br>Die eingetragenen Werte dürfen größer als die tatsächlichen sein. |

Hinweis: Objektive ohne Optokoppler-Positionserfassung benötigen keine Optokopplerparameter.

#### 13.2.3 ZOOM-Beschreibung

<!-- Source: English PDF p170, table unit 1226 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| use-zoom | Gibt an, ob die Zoomfunktion verwendet wird |
| zoom-used-pin | Jeder ms41908 steuert zwei Schrittmotoren über die Pingruppen „ab“ und „cd“.<br>Entsprechend der tatsächlichen Hardwareverdrahtung konfigurieren. |
| zoom-backlash | Durch Zahnradspiel verursachter Fehler: bei Richtungswechsel zu kompensierende<br>Schrittzahl, durch Tests bestimmen. |
| zoom-start-up- speed | Anlaufgeschwindigkeit des Schrittmotors in PPS |
| zoom-step-max | Effektiver Bewegungsbereich des Motors in Schritten |
| zoom-ppw | PWM-Tastverhältnis der ms41908-Ausgabe, 0-255. Größere Werte erhöhen<br>die Treiberleistung; entsprechend der Motorlast einstellen. |
| zoom-phmode | Phasenkorrektur der ms41908-PWM-Ausgabe; normalerweise nicht konfiguriert,<br>bei Bedarf einstellen. |
| zoom-micro | Mikroschritt-Unterteilung: 64, 128 oder 256; Standard: 256. |
| zoom-1-2phase- excitation | Standard ist 2-2-Phasen-Erregung; dieser Parameter wählt 1-2-Phasen-Erregung.<br>Beispiel: zoom-1-2phase-excitation; |
| zoom-dir- opposite | Verläuft die Motorbewegung entgegengesetzt zur tatsächlichen Fokuskurve, kehrt dieser Parameter die Richtung um. Beispiel: zoom-dir-opposite; |

**Beschreibung des Optokopplers:**

<!-- Source: English PDF p170, table unit 1228 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| zoom-pic | C-Pin des Optokopplers zur Erkennung des Pegelwechsels.<br>Der Übergangspunkt ist der Ursprung des Optokopplers. |
| zoom-min- pos | Schrittzahlen links und rechts des Optokopplerursprungs messen und im DTS eintragen.<br>Die eingetragenen Werte dürfen größer als die tatsächlichen sein. |
| zoom-min- pos | Schrittzahlen links und rechts des Optokopplerursprungs messen und im DTS eintragen.<br>Die eingetragenen Werte dürfen größer als die tatsächlichen sein. |

Hinweis: Objektive ohne Optokoppler-Positionserfassung benötigen keine Optokopplerparameter.

#### 13.2.4 ZOOM1-Beschreibung

<!-- Source: English PDF p171, table unit 1231 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| use-zoom1 | Gibt an, ob zoom1 verwendet wird; manche Objektive unterstützen zwei Zoomgruppen. |
| zoom1-used-pin | Jeder ms41908 steuert zwei Schrittmotoren über die Pingruppen „ab“ und „cd“.<br>Entsprechend der tatsächlichen Hardwareverdrahtung konfigurieren. |
| zoom1-backlash | Durch Zahnradspiel verursachter Fehler: bei Richtungswechsel zu kompensierende<br>Schrittzahl, durch Tests bestimmen. |
| zoom1-start-up- speed | Anlaufgeschwindigkeit des Schrittmotors in PPS |
| zoom1-step-max | Effektiver Bewegungsbereich des Motors in Schritten |
| zoom1-ppw | PWM-Tastverhältnis der ms41908-Ausgabe, 0-255. Größere Werte erhöhen<br>die Treiberleistung; entsprechend der Motorlast einstellen. |
| zoom1-phmode | Phasenkorrektur der ms41908-PWM-Ausgabe; normalerweise nicht konfiguriert,<br>bei Bedarf einstellen. |
| zoom1-micro | Mikroschritt-Unterteilung: 64, 128 oder 256; Standard: 256. |
| zoom1-1-2phase- excitation | Standard ist 2-2-Phasen-Erregung; dieser Parameter wählt 1-2-Phasen-Erregung.<br>Beispiel: zoom1-1-2phase-excitation; |
| zoom1-dir- opposite | Verläuft die Motorbewegung entgegengesetzt zur tatsächlichen Fokuskurve,<br>kehrt dieser Parameter die Richtung um. Beispiel: zoom1-dir-opposite; |

**Beschreibung des Optokopplers:**

<!-- Source: English PDF p171, table unit 1233 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| zoom1-pic | C-Pin des Optokopplers zur Erkennung des Pegelwechsels.<br>Der Übergangspunkt ist der Ursprung des Optokopplers. |
| zoom1-pia | A-Pin des Optokopplers zur Ansteuerung der Fotodiode. Bei Kalibrierung auf High,<br>im Normalbetrieb auf Low setzen; andernfalls beeinflusst die Fotodiode die Bildaufnahme. |
| zoom1-pie | Kann hardwareseitig direkt an Masse liegen. Bei GPIO-Steuerung<br>muss der Pin auf Low gesetzt werden. |
| zoom1- min-pos | Schrittzahlen links und rechts des Optokopplerursprungs messen und im DTS eintragen. Die eingetragenen Werte dürfen größer als die tatsächlichen sein. |
| zoom1- min-pos | Schrittzahlen links und rechts des Optokopplerursprungs messen und im DTS eintragen. Die eingetragenen Werte dürfen größer als die tatsächlichen sein. |

Hinweis: Objektive ohne Optokoppler-Positionserfassung benötigen keine Optokopplerparameter.

#### 13.2.5 PIRIS-Beschreibung

<!-- Source: English PDF p172, table unit 1236 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| use-p-iris | Gibt an, ob P-IRIS verwendet wird |
| piris-used-pin | Jeder ms41908 steuert zwei Schrittmotoren über die Pingruppen „ab“ und „cd“.<br>Entsprechend der tatsächlichen Hardwareverdrahtung konfigurieren. |
| piris-backlash | Durch Zahnradspiel verursachter Fehler: bei Richtungswechsel zu kompensierende<br>Schrittzahl, durch Tests am tatsächlichen Objektiv bestimmen. |
| piris-start-up- speed | Anlaufgeschwindigkeit des Schrittmotors in PPS |
| piris-step-max | Effektiver Bewegungsbereich des Motors in Schritten |
| piris-ppw | PWM-Tastverhältnis der ms41908-Ausgabe, 0-255. Größere Werte erhöhen die Treiberleistung; entsprechend der Motorlast einstellen. |
| piris-phmode | Phasenkorrektur der ms41908-PWM-Ausgabe; normalerweise nicht konfiguriert,<br>bei Bedarf einstellen. |
| piris-micro | Mikroschritt-Unterteilung: 64, 128 oder 256; Standard: 256. |
| piris-1-2phase- excitation | Standard ist 2-2-Phasen-Erregung; dieser Parameter wählt 1-2-Phasen-Erregung.<br>Beispiel: piris-1-2phase-excitation; |
| piris-dir- opposite | Verläuft die Motorbewegung entgegengesetzt zur tatsächlichen Fokuskurve, kehrt dieser Parameter die Richtung um. Beispiel: piris-dir-opposite; |

**Beschreibung des Optokopplers:**

<!-- Source: English PDF p173, table unit 1238 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| piris-pic | C-Pin des Optokopplers zur Erkennung des Pegelwechsels. Der Übergangspunkt ist der Ursprung des Optokopplers. |
| piris-pia | A-Pin des Optokopplers zur Ansteuerung der Fotodiode. Bei Kalibrierung auf High, im Normalbetrieb auf Low setzen; andernfalls beeinflusst die Fotodiode die Bildaufnahme. |
| piris-pie | Kann hardwareseitig direkt an Masse liegen. Bei GPIO-Steuerung muss der Pin auf Low gesetzt werden. |
| piris-min- pos | Schrittzahlen links und rechts des Optokopplerursprungs messen und im DTS eintragen.<br>Die eingetragenen Werte dürfen größer als die tatsächlichen sein. |
| piris-min- pos | Schrittzahlen links und rechts des Optokopplerursprungs messen und im DTS eintragen.<br>Die eingetragenen Werte dürfen größer als die tatsächlichen sein. |

Hinweis: Objektive ohne Optokoppler-Positionserfassung benötigen keine Optokopplerparameter.

#### 13.2.6 DCIRIS-Beschreibung

<!-- Source: English PDF p173, table unit 1241 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| use-dc-iris | Gibt an, ob DC-IRIS verwendet wird |
| vd_iris-gpios | Synchronimpulspin zur Übernahme der DC-Blendenregister |
| dc-iris-reserved- polarity | Polarität der DC-Blende. Bedeutet 0 vollständig geöffnet,<br>kann diese Property die Richtung umkehren. |
| dc-iris-max-log | Zielwerte der DC-Blende: 0~1023. Der tatsächlich wirksame Bereich kann kleiner sein;<br>dieser Parameter begrenzt ihn. |

#### 13.2.7 Kurze Beschreibung der Datentypen

##### 13.2.7.1 struct spi_driver

[Beschreibung]

Definiert Informationen des Plattformgerätetreibers.

[Definition]

```text
  struct spi_driver {
          int (*probe)(struct spi_device *spi);
          int (*remove)(struct spi_device *spi);
          struct device_driver driver;
          const struct spi_device_id *id_table;
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p174, table unit 1249 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| @driver | struct device_driver enthält hauptsächlich Treibername und of_match_table zum Abgleich mit DTS-Geräten. Stimmen die compatible-Felder von of_match_table und DTS überein, wird .probe aufgerufen. |
| @id_table | Verwendet der Kernel nicht of_match_table und DTS-Geräte zum Abgleich, verwendet er diese Tabelle. |
| @probe | Callback zur Gerätebindung |
| @remove | Callback zum Aufheben der Gerätebindung |

[Beispiel]

```text
  static const struct spi_device_id motor_match_id[] = {
      {"relmon,ms41908", 0 },
      { }
  };
  static struct spi_driver motor_dev_driver = {
      .driver = {
          .name = DRIVER_NAME,
          .of_match_table = of_match_ptr(motor_dev_of_match),
      },
      .probe      = &motor_dev_probe,
      .remove     = &motor_dev_remove,
      .id_table   = motor_match_id,
  };
```

##### 13.2.7.2 struct v4l2_subdev_core_ops

[Beschreibung]

Definiert die Core-Operations-Callbacks für Subdevices.

[Definition]

```text
  struct v4l2_subdev_core_ops {
      ……
      long (*ioctl)(struct v4l2_subdev *sd, unsigned int cmd, void *arg);
  #ifdef CONFIG_COMPAT
      long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd,
               unsigned long arg);
  #endif
      ……
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p175, table unit 1258 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .ioctl | Wird am Ende der ioctl()-Systemaufrufbehandlung im V4L2-Kern aufgerufen und unterstützt treiberspezifische private ioctls. |
| .compat_ioctl32 | Wird bei einer 32-Bit-Anwendung auf einem 64-Bit-Kernel aufgerufen, um Daten beim Austausch mit dem Userspace anzupassen. |

[Beispiel]

```text
  static const struct v4l2_subdev_core_ops motor_core_ops = {
      .ioctl = motor_ioctl,
  };
  static const struct v4l2_subdev_ops motor_subdev_ops = {
      .core   = &motor_core_ops,
  };
```

##### 13.2.7.3 struct v4l2_ctrl_ops

[Beschreibung]

Steuerungsoperationen, die der Treiber bereitstellen muss.

[Definition]

```text
  struct v4l2_ctrl_ops {
      int (*g_volatile_ctrl)(struct v4l2_ctrl *ctrl);
      int (*s_ctrl)(struct v4l2_ctrl *ctrl);
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p176, table unit 1267 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .g_volatile_ctrl | Einen neuen Wert dieses Controls abfragen. Dies betrifft im Allgemeinen nur flüchtige und meist schreibgeschützte Controls, etwa eines zur Rückgabe der sich ständig ändernden aktuellen Signalstärke. |
| .s_ctrl | Neuen Steuerwert tatsächlich setzen; s_ctrl ist verpflichtend. Während des Aufrufs wird ctrl-&gt;handler-&gt;lock gehalten, sodass niemand sonst auf die Steuerelemente dieses Handlers zugreifen kann. |

[Beispiel]

```text
  static const struct v4l2_ctrl_ops motor_ctrl_ops = {
      .s_ctrl = motor_s_ctrl,
  };
```

#### 13.2.8 Kurze API-Beschreibung

##### 13.2.8.1 xxxx_set_ctrl

[Beschreibung]

Fokus-, Zoom- und P-Blendenposition über standardmäßiges v4l2_control setzen.

Der Treiber implementiert folgende standardmäßige V4L2-Befehle:

<!-- Source: English PDF p176, table unit 1275 -->

| Parametername | Beschreibung |
| --- | --- |
| V4L2_CID_FOCUS_ABSOLUTE | Fokus steuern. Laut Quelle bedeutet 0 die kleinste Brennweite und eine scharfe Nahaufnahme. |
| V4L2_CID_ZOOM_ABSOLUTE | Zoomfaktor steuern. 0 bedeutet kleinster Zoomfaktor und größtes Sichtfeld. |
| V4L2_CID_IRIS_ABSOLUTE | Blendenöffnung steuern. 0 bedeutet geschlossene Blende. |
| V4L2_CID_ZOOM_CONTINUOUS | Zoomfaktor von zoom1 steuern; bei mehreren Zoomgruppen verwendet. |

[Syntax]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[Parameter]

<!-- Source: English PDF p176, table unit 1279 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *ctrl | Zeiger auf die V4L2-Steuerstruktur | Eingabe |

```text
13.2.8.2   xxxx_ioctl xxxx_compat_ioctl
```

[Beschreibung]

Das eigene ioctl ermittelt hauptsächlich Zeitinformationen für Fokus, Zoom und P-Blende, also Zeitstempel von Bewegungsbeginn und -ende. Da das verwendete Objektiv keine Positionserfassung besitzt, muss die Motorposition bei Bedarf zurückgesetzt werden.

**Der Treiber implementiert benutzerdefinierte Befehle:**

<!-- Source: English PDF p177, table unit 1284 -->

| Parametername | Beschreibung |
| --- | --- |
| RK_VIDIOC_VCM_TIMEINFO | Fokussierungszeitinformationen zur Prüfung, ob das aktuelle Bild nach Abschluss der Fokussierung gültig ist |
| RK_VIDIOC_ZOOM_TIMEINFO | Zoomzeitinformationen zur Prüfung, ob das aktuelle Bild nach Abschluss des Zoomens gültig ist |
| RK_VIDIOC_IRIS_TIMEINFO | Blendenzeitinformationen zur Prüfung, ob das aktuelle Bild nach Abschluss der P-Blendenanpassung gültig ist |
| RK_VIDIOC_ZOOM1_TIMEINFO | Bei mehreren Zoomgruppen: Zeitinformationen von zoom1 zur Prüfung, ob das aktuelle Bild nach Abschluss des Zoomens gültig ist |
| RK_VIDIOC_IRIS_CORRECTION | Blendenposition zurücksetzen; wirkt nur auf P-IRIS |
| RK_VIDIOC_FOCUS_CORRECTION | Fokusposition zurücksetzen |
| RK_VIDIOC_ZOOM_CORRECTION | Zoomposition zurücksetzen |
| RK_VIDIOC_ZOOM1_CORRECTION | Position der zweiten Zoomgruppe eines Doppelzoomobjektivs zurücksetzen |
| RK_VIDIOC_FOCUS_SET_POSITION | Fokusposition setzen |
| RK_VIDIOC_ZOOM_SET_POSITION | Fokusnachführung konfigurieren und anhand der Zoomkurve mehrstufige gekoppelte Zoom-/Fokusbewegungen ausführen |

Hinweise:

1\. Zahnradspiel beeinträchtigt die absolute Motorposition. Eine Bewegungsrichtung wird als positiv, die andere als negativ festgelegt; anfangs liegt das Zahnrad an der positiven Flanke an. Bei negativer Bewegung fährt es zunächst zusätzlich um n Schritte, wobei n größer als das Zahnradspiel ist, und dann n Schritte positiv zurück. So liegt es wieder an der positiven Flanke an. Dieses Rückfahren gewährleistet Positionsgenauigkeit. Bei wiederholten negativen Bewegungen während manueller oder automatischer Fokussierung würden solche Rückfahrten jedoch sichtbar ruckeln. Daher darf nicht jede negative Bewegung automatisch zurückfahren. Bei den neuen Schnittstellen RK_VIDIOC_FOCUS_SET_POSITION und RK_VIDIOC_ZOOM_SET_POSITION entscheidet der AF-Algorithmus darüber. Die Standardbefehle V4L2_CID_FOCUS_ABSOLUTE und V4L2_CID_ZOOM_ABSOLUTE führen keine Rückfahrt aus und sind nur für den manuellen Modus vorgesehen. RK_VIDIOC_ZOOM_SET_POSITION enthält Fokus- und Zoomparameter; beim Zoomen wird der Fokus synchron angepasst, um natürliche Bildübergänge zu erzielen.

2\. Früher wurde Zahnradspiel über focus-backlash kompensiert, indem bei negativer Bewegung zusätzliche Schritte ausgeführt wurden. Individuelle Unterschiede zwischen Objektiven verursachen jedoch Kalibrierfehler und hohen Kalibrieraufwand. Deshalb wurde dieser Parameter verworfen. Der Treiber behält seine Implementierung bei; bei geringen Genauigkeitsanforderungen kann er weiterhin verwendet werden.

[Syntax]

```text
  static int xxxx_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
  static long xxxx_compat_ioctl32(struct v4l2_subdev *sd, unsigned int cmd,
  unsigned long arg)
```

[Parameter]

<!-- Source: English PDF p178, table unit 1294 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *sd | Zeiger auf die V4L2-Subdevice-Struktur | Eingabe |
| cmd | ioctl-Befehl | Eingabe |
| *arg/arg | Parameterzeiger | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p178, table unit 1296 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

#### 13.2.9 Schritte zur Treiberportierung

Für SPI-gesteuerte Treiberchips lässt sich das SPI-Framework zur Portierung verwenden. Referenz ist MS41908: /kernel/drivers/media/spi/ms41908.c

Portierungsschritte:

**1. Den standardmäßigen SPI-Subdevice-Treiberteil implementieren.**

1.1 Gemäß struct spi_driver insbesondere folgende Teile implementieren:

struct driver.name

struct driver. of_match_table

probe-Funktion

remove-Funktion

1.2 Einzelheiten zur Implementierung von probe:

1) Geräteressourcen anfordern, hauptsächlich aus dem DTS; siehe MS41908-Geräteregistrierung (DTS).

1.1) Private RK-Ressourcen wie rockchip, camera-module-xxx stellen hauptsächlich Geräteparameter für die Zuordnung zum Kameragerät bereit.

1.2) Motorbezogene Konfigurationsparameter abrufen. Diese richten sich nach den Funktionsanforderungen des Chips; Bewegungsparameter sollten möglichst konfigurierbar sein.

2\. Timer mit hrtimer_init initialisieren. ms41908 verwendet vd als Triggersignal. Der Timer legt zur einfachen Steuerung eine feste vd-Periode fest. Register werden nach dem vd-Signal wirksam; Änderungen können jeweils vorher vorgenommen werden. Die durch Geschwindigkeit und Schrittzahl bestimmte Bewegung muss innerhalb einer vd-Periode liegen. Schritte außerhalb dieser Periode gehen verloren.

3) Synchronisation mittels init_completion einrichten. Beim selben Motor darf die nächste Operation erst nach Abschluss der vorherigen beginnen.

4\. V4L2-Gerät und Media-Entity initialisieren.

V4L2-Subdevice: v4l2_i2c_subdev_init. Der Treiber verlangt einen eigenen Subdevice-Geräteknoten für rkaiq im Userspace; darüber wird der Motor gesteuert.

Media-Entity: media_entity_init;

5\. Gerätename:

```text
  snprintf(sd->name, sizeof(sd->name), "m%02d_%s_%s",
           motor->module_index, facing,
           DRIVER_NAME);
```

**2. Den V4L2-Subdevice-Treiber implementieren; dabei sind hauptsächlich die folgenden 2 Mitglieder umzusetzen:**

```text
  struct v4l2_subdev_core_ops
  struct v4l2_ctrl_ops
```

2.1 Gemäß v4l2_subdev_core_ops insbesondere folgende Callbacks implementieren:

```text
  .ioctl
  .compat_ioctl32
```

2.2 Gemäß v4l2_ctrl_ops insbesondere folgende Callbacks implementieren:

```text
.g_volatile_ctrl
.s_ctrl
```

## 14. DC-IRIS-Treiber

Im Gegensatz zu P-IRIS lässt sich bei DC-IRIS die Größe der Blendenöffnung nicht genau bestimmen. Normalerweise ist sie zunächst vollständig geöffnet. Bleibt das Bild bei minimaler Belichtung überbelichtet, wird die Blende angepasst. Bleibt es bei maximaler Belichtung unterbelichtet, wird ebenfalls die Blende angepasst. Der DC-IRIS-Motor ist ein Gleichstrommotor; die Gegenkopplung des Hall-Bauteils dämpft seine Stellgeschwindigkeit. Der Treiber steuert den Motor lediglich per PWM: Bei einem Tastgrad unter 20% schließt sich die Blende langsam bis zum vollständigen Schließen; je kleiner der Tastgrad, desto schneller schließt sie. Bei einem Tastgrad über 40% öffnet sie sich langsam; je größer der Tastgrad, desto schneller öffnet sie sich. Im Bereich 20%~40% hält sie ihre Position. Die Werte 20% und 40% sind nicht fest vorgegeben, sondern hängen von der PWM-Frequenz und der Genauigkeit der tatsächlichen Hardware ab. Referenztreiber: /kernel/drivers/media/i2c/hall-dc-motor.c

### 14.1 DC-IRIS-Geräteregistrierung (DTS)

```text
  hal_dc_motor: hal_dc_motor{
          status = "okay";
          compatible = "rockchip,hall-dc";
          pwms = <&pwm6 0 2500 0>;
          rockchip,camera-module-index = <1>;
          rockchip,camera-module-facing = "front";
  };
  &pwm6 {
          status = "okay";
          pinctrl-names = "active";
          pinctrl-0 = <&pwm6m0_pins_pull_down>;
  };
  &i2c1 {
      imx334: imx334@1a {
          ...
          lens-focus = <&hal_dc_motor>;
          ...
      }
  }
```

#### 14.1.1 Kurze Beschreibung der Datentypen

##### 14.1.1.1 struct platform_driver

[Beschreibung]

Definiert Informationen des Plattformgerätetreibers.

[Definition]

```text
  struct platform_driver {
          int (*probe)(struct platform_device *);
          int (*remove)(struct platform_device *);
          void (*shutdown)(struct platform_device *);
          int (*suspend)(struct platform_device *, pm_message_t state);
          int (*resume)(struct platform_device *);
          struct device_driver driver;
          const struct platform_device_id *id_table;
          bool prevent_deferred_probe;
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p181, table unit 1336 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| @driver | struct device_driver enthält hauptsächlich Treibername und of_match_table zum Abgleich mit DTS-Geräten. Stimmen die compatible-Felder von of_match_table und DTS überein, wird .probe aufgerufen. |
| @id_table | Verwendet der Kernel nicht of_match_table und DTS-Geräte zum Abgleich, verwendet er diese Tabelle. |
| @probe | Callback zur Gerätebindung |
| @remove | Callback zum Aufheben der Gerätebindung |

[Beispiel]

```text
  #if defined(CONFIG_OF)
  static const struct of_device_id motor_dev_of_match[] = {
      { .compatible = "rockchip,hall-dc", },
      {},
  };
  #endif
  static struct platform_driver motor_dev_driver = {
      .driver = {
          .name = DRIVER_NAME,
          .owner = THIS_MODULE,
          .of_match_table = of_match_ptr(motor_dev_of_match),
      },
      .probe = motor_dev_probe,
      .remove = motor_dev_remove,
  };
  module_platform_driver(motor_dev_driver);
```

##### 14.1.1.2 struct v4l2_subdev_core_ops

[Beschreibung]

Definiert die Core-Operations-Callbacks für Subdevices.

[Definition]

```text
  struct v4l2_subdev_core_ops {
      ……
      long (*ioctl)(struct v4l2_subdev *sd, unsigned int cmd, void *arg);
  #ifdef CONFIG_COMPAT
      long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd,
               unsigned long arg);
  #endif
      ……
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p182, table unit 1345 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .ioctl | Wird am Ende der ioctl()-Systemaufrufbehandlung im V4L2-Kern aufgerufen und unterstützt treiberspezifische private ioctls. |
| .compat_ioctl32 | Wird bei einer 32-Bit-Anwendung auf einem 64-Bit-Kernel aufgerufen, um Daten beim Austausch mit dem Userspace anzupassen. |

[Beispiel]

```text
  static const struct v4l2_subdev_core_ops motor_core_ops = {
      .ioctl = motor_ioctl,
  };
  static const struct v4l2_subdev_ops motor_subdev_ops = {
      .core   = &motor_core_ops,
  };
```

##### 14.1.1.3 struct v4l2_ctrl_ops

[Beschreibung]

Steuerungsoperationen, die der Treiber bereitstellen muss.

[Definition]

```text
  struct v4l2_ctrl_ops {
      int (*s_ctrl)(struct v4l2_ctrl *ctrl);
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p182, table unit 1354 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .s_ctrl | Neuen Steuerwert tatsächlich setzen; s_ctrl ist verpflichtend. Während des Aufrufs wird ctrl-&gt;handler-&gt;lock gehalten, sodass niemand sonst auf die Steuerelemente dieses Handlers zugreifen kann. |

[Beispiel]

```text
  static const struct v4l2_ctrl_ops motor_ctrl_ops = {
      .s_ctrl = motor_s_ctrl,
  };
```

#### 14.1.2 Kurze API-Beschreibung

##### 14.1.2.1 xxxx_set_ctrl

[Beschreibung]

Die Blendenposition wird über standardmäßiges v4l2_control eingestellt. Da die genaue DC-Blendenposition nicht bekannt ist, bezeichnet der gesetzte Wert tatsächlich das PWM-Tastverhältnis.

Folgende standardmäßige V4L2-Befehle sind implementiert:

<!-- Source: English PDF p183, table unit 1362 -->

| Parametername | Beschreibung |
| --- | --- |
| V4L2_CID_IRIS_ABSOLUTE | Tastverhältnis der blendensteuernden PWM setzen, Bereich 0~100 |

[Syntax]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[Parameter]

<!-- Source: English PDF p183, table unit 1366 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *ctrl | Zeiger auf die V4L2-Steuerstruktur | Eingabe |

[Rückgabewert]

<!-- Source: English PDF p183, table unit 1368 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

```text
14.1.2.2   xxxx_ioctl xxxx_compat_ioctl
```

[Beschreibung]

Derzeit sind keine privaten Definitionen zu implementieren. Für die Registrierung im V4L2-Framework werden leere Funktionen benötigt.

[Syntax]

```text
  static int xxxx_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
  static long xxxx_compat_ioctl32(struct v4l2_subdev *sd, unsigned int cmd,
  unsigned long arg)
```

[Parameter]

<!-- Source: English PDF p184, table unit 1375 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *sd | Zeiger auf die V4L2-Subdevice-Struktur | Eingabe |
| cmd | ioctl-Befehl | Eingabe |
| *arg/arg | Parameterzeiger | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p184, table unit 1377 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

#### 14.1.3 Schritte zur Treiberportierung

Treiberreferenz: /kernel/drivers/media/i2c/hall-dc-motor.c

Portierungsschritte:

**1. Den standardmäßigen Plattform-Subdevice-Treiberteil implementieren.**

1.1 Gemäß struct platform_driver insbesondere folgende Teile implementieren:

struct driver.name

struct driver. of_match_table

probe-Funktion

remove-Funktion

1.2 Einzelheiten zur Implementierung von probe:

1\. Geräteressourcen anfordern, hauptsächlich aus dem DTS; siehe DC-IRIS-Geräteregistrierung (DTS).

1.1) Private RK-Ressourcen wie rockchip, camera-module-xxx dienen vor allem der Zuordnung von Geräteparametern zur Kamera. 1.2) PWM-Ressourcen anfordern und prüfen, ob der PWM-Knoten aktiviert ist.

2\. V4L2-Gerät und Media-Entity initialisieren.

V4L2-Subdevice: v4l2_i2c_subdev_init. Der Treiber verlangt einen eigenen Subdevice-Geräteknoten für rkaiq im Userspace; darüber wird der Motor gesteuert.

Media-Entity: media_entity_init;

3\. Name des Blitzlichtgeräts; diese Bezeichnung steht so im Blendenabschnitt der Quelle:

```text
  snprintf(sd->name, sizeof(sd->name), "m%02d_%s_%s",
           motor->module_index, facing,
           DRIVER_NAME);
```

**2. Den V4L2-Subdevice-Treiber implementieren; dabei sind hauptsächlich die folgenden 2 Mitglieder umzusetzen:**

```text
  struct v4l2_subdev_core_ops
  struct v4l2_ctrl_ops
```

2.1 Gemäß v4l2_subdev_core_ops insbesondere folgende Callbacks implementieren:

```text
  ioctl
  .compat_ioctl32
```

Dieser Callback muss derzeit keine konkreten Befehle implementieren. Als V4L2-Subdevice benötigt er jedoch eine Operationsfunktion; daher wird eine leere Funktion implementiert.

2.2 Gemäß v4l2_ctrl_ops insbesondere folgende Callbacks implementieren:

```text
.g_volatile_ctrl.s_ctrl
```

.g_volatile_ctrl und .s_ctrl implementieren folgende Befehle mit standardmäßigen V4L2-Steuerelementen:

<!-- Source: English PDF p185, table unit 1403 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| V4L2_CID_IRIS_ABSOLUTE | Tastverhältnis der blendensteuernden PWM setzen, Bereich 0~100 |

## 15. RK-IRCUT-Treiber

IRCUT wird über zwei Leitungen mit 3.5v~6v angesteuert. Durch Umpolen und Einhalten einer Einschaltdauer von 100ms±10% lässt sich der Filter umschalten. Der Treiber steuert die Stromrichtung des Motortreibers über zwei GPIOs, bezeichnet als open (rote Leitung) und close (schwarze Leitung). Strom von open nach close aktiviert den Infrarotsperrfilter für den Tagbetrieb; Strom von close nach open schaltet auf die weiße Glasscheibe für den Nachtbetrieb.

### 15.1 RK-IRCUT-Geräteregistrierung (DTS)

```text
  cam_ircut0: cam_ircut {
          status = "okay";
          compatible = "rockchip,ircut";
          ircut-open-gpios = <&gpio2 RK_PA7 GPIO_ACTIVE_HIGH>;
          ircut-close-gpios  = <&gpio2 RK_PA6 GPIO_ACTIVE_HIGH>;
          rockchip,camera-module-index = <1>;
          rockchip,camera-module-facing = "front";
  };
  &i2c1 {
      imx334: imx334@1a {
          ...
          ir-cut = <&cam_ircut0>;
          ...
      }
  }
```

#### 15.1.1 Kurze Beschreibung der Datentypen

##### 15.1.1.1 struct platform_driver

[Beschreibung]

Definiert Informationen des Plattformgerätetreibers.

[Definition]

```text
  struct platform_driver {
          int (*probe)(struct platform_device *);
          int (*remove)(struct platform_device *);
          void (*shutdown)(struct platform_device *);
          int (*suspend)(struct platform_device *, pm_message_t state);
          int (*resume)(struct platform_device *);
          struct device_driver driver;
          const struct platform_device_id *id_table;
          bool prevent_deferred_probe;
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p187, table unit 1415 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| @driver | struct device_driver enthält hauptsächlich Treibername und of_match_table zum Abgleich mit DTS-Geräten. Stimmen die compatible-Felder von of_match_table und DTS überein, wird .probe aufgerufen. |
| @id_table | Verwendet der Kernel nicht of_match_table und DTS-Geräte zum Abgleich, verwendet er diese Tabelle. |
| @probe | Callback zur Gerätebindung |
| @remove | Callback zum Aufheben der Gerätebindung |

[Beispiel]

```text
  #if defined(CONFIG_OF)
  static const struct of_device_id ircut_of_match[] = {
      { .compatible = "rockchip,ircut", },
      {},
  };
  #endif
  static struct platform_driver ircut_driver = {
      .driver = {
          .name = RK_IRCUT_NAME,
          .of_match_table = of_match_ptr(ircut_of_match),
      },
      .probe = ircut_probe,
      .remove = ircut_drv_remove,
  };
  module_platform_driver(ircut_driver);
```

##### 15.1.1.2 struct v4l2_subdev_core_ops

[Beschreibung]

Definiert die Core-Operations-Callbacks für Subdevices.

[Definition]

```text
  struct v4l2_subdev_core_ops {
      ……
      long (*ioctl)(struct v4l2_subdev *sd, unsigned int cmd, void *arg);
  #ifdef CONFIG_COMPAT
      long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd,
               unsigned long arg);
  #endif
      ……
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p188, table unit 1424 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .ioctl | Wird am Ende der ioctl()-Systemaufrufbehandlung im V4L2-Kern aufgerufen und unterstützt treiberspezifische private ioctls. |
| .compat_ioctl32 | Wird bei einer 32-Bit-Anwendung auf einem 64-Bit-Kernel aufgerufen, um Daten beim Austausch mit dem Userspace anzupassen. |

[Beispiel]

```text
  static const struct v4l2_subdev_core_ops ircut_core_ops = {
      .ioctl = ircut_ioctl,
  };
  static const struct v4l2_subdev_ops ircut_subdev_ops = {
      .core   = &ircut_core_ops,
  };
```

##### 15.1.1.3 struct v4l2_ctrl_ops

[Beschreibung]

Steuerungsoperationen, die der Treiber bereitstellen muss.

[Definition]

```text
  struct v4l2_ctrl_ops {
      int (*s_ctrl)(struct v4l2_ctrl *ctrl);
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p188, table unit 1433 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .s_ctrl | Neuen Steuerwert tatsächlich setzen; s_ctrl ist verpflichtend. Während des Aufrufs wird ctrl-&gt;handler-&gt;lock gehalten, sodass niemand sonst auf die Steuerelemente dieses Handlers zugreifen kann. |

[Beispiel]

```text
  static const struct v4l2_ctrl_ops ircut_ctrl_ops = {
      .s_ctrl = ircut_s_ctrl,
  };
```

#### 15.1.2 Kurze API-Beschreibung

##### 15.1.2.1 xxxx_set_ctrl

[Beschreibung]

IRCUT über standardmäßiges v4l2_control umschalten.

Folgende standardmäßige V4L2-Befehle sind implementiert:

<!-- Source: English PDF p189, table unit 1441 -->

| Parametername | Beschreibung |
| --- | --- |
| V4L2_CID_BAND_STOP_FILTER | 0: CLOSE, Infrarotlicht kann eintreten; 3: OPEN, Infrarotlicht kann nicht eintreten. |

[Syntax]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[Parameter]

<!-- Source: English PDF p189, table unit 1445 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *ctrl | Zeiger auf die V4L2-Steuerstruktur | Eingabe |

[Rückgabewert]

<!-- Source: English PDF p189, table unit 1447 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

```text
15.1.2.2   xxxx_ioctl xxxx_compat_ioctl
```

[Beschreibung]

Derzeit sind keine privaten Definitionen zu implementieren. Für die Registrierung im V4L2-Framework werden leere Funktionen benötigt.

[Syntax]

```text
  static int xxxx_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
  static long xxxx_compat_ioctl32(struct v4l2_subdev *sd, unsigned int cmd,
  unsigned long arg)
```

[Parameter]

<!-- Source: English PDF p190, table unit 1454 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *sd | Zeiger auf die V4L2-Subdevice-Struktur | Eingabe |
| cmd | ioctl-Befehl | Eingabe |
| *arg/arg | Parameterzeiger | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p190, table unit 1456 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

#### 15.1.3 Schritte zur Treiberportierung

Treiberreferenz: /kernel/drivers/media/i2c/rk_ircut.c

Portierungsschritte:

**1. Den standardmäßigen Plattform-Subdevice-Treiberteil implementieren.**

1.1 Gemäß struct platform_driver insbesondere folgende Teile implementieren:

struct driver.name

struct driver. of_match_table

probe-Funktion

remove-Funktion

1.2 Einzelheiten zur Implementierung von probe:

1\. Geräteressourcen anfordern, hauptsächlich aus dem DTS; siehe RK-IRCUT-Geräteregistrierung (DTS).

1.1) Private RK-Ressourcen wie rockchip, camera-module-xxx stellen hauptsächlich Geräteparameter für die Zuordnung zum Kameragerät bereit.

1.2) GPIO-Ressourcen open und close anfordern.

2\. Mit init_completion synchronisieren. Das Umschalten von IRCUT dauert etwa 100ms; die Completion stellt sicher, dass es abgeschlossen ist, bevor die nächste Operation beginnt.

3\. Eine Arbeitswarteschlange erstellen und den Schaltvorgang darin ausführen, um längerfristiges Blockieren zu vermeiden;

4\. V4L2-Gerät und Media-Entity initialisieren.

V4L2-Subdevice: v4l2_i2c_subdev_init. Der Treiber verlangt einen eigenen Subdevice-Geräteknoten für rkaiq im Userspace; darüber wird IRCUT gesteuert.

Media-Entity: media_entity_init;

```text
  sd->entity.function = MEDIA_ENT_F_LENS;
  sd->entity.flags = 1;//flag is fixed to 1, used to distinguish other sub-devices of MEDIA_ENT_F_LENS type
```

5\. Gerätename:

```text
  snprintf(sd->name, sizeof(sd->name), "m%02d_%s_%s",
           ircut->module_index, facing,
           RK_IRCUT_NAME);
```

**2. Den V4L2-Subdevice-Treiber implementieren; dabei sind hauptsächlich die folgenden 2 Mitglieder umzusetzen:**

```text
  struct v4l2_subdev_core_ops
  struct v4l2_ctrl_ops
```

2.1 Gemäß v4l2_subdev_core_ops insbesondere folgende Callbacks implementieren:

```text
  .ioctl
  .compat_ioctl32
```

Dieser Callback benötigt derzeit keine privaten Befehle, ist für die V4L2-Registrierung jedoch erforderlich. Deshalb wird eine leere Funktion implementiert, die später nach Bedarf ergänzt werden kann.

2.2 Gemäß v4l2_ctrl_ops insbesondere folgende Callbacks implementieren:

```text
.s_ctrl
```

.s_ctrl implementiert folgende Befehle mit standardmäßigen V4L2-Steuerelementen:

<!-- Source: English PDF p191, table unit 1488 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| V4L2_CID_BAND_STOP_FILTER | 0: CLOSE, Infrarotlicht kann eintreten; 3: OPEN, Infrarotlicht kann nicht eintreten. |

## 16. Werkzeuge media-ctl und v4l2-ctl

media-ctl arbeitet über Media-Geräte wie /dev/medio0; diese Schreibweise der Quelle ist zu prüfen. Es verwaltet Format, Größe und Verknüpfungen der Knoten in der Media-Topologie.

v4l2-ctl arbeitet mit Videogeräten wie /dev/video0 und /dev/video1. Es führt Operationen wie set_fmt, reqbuf, qbuf, dqbuf, stream_on und stream_off aus.

Zur genauen Verwendung siehe die Hilfe des jeweiligen Befehls. Einige häufige Anwendungen folgen.

1\. Topologie ausgeben

```text
  media-ctl -p -d /dev/media0
```

Hinweis: ISP2 besitzt zahlreiche Geräteknoten; media0/media1/media2 können vorhanden sein. Listen Sie die Geräte einzeln auf und prüfen Sie ihre Informationen.

2\. Verknüpfen

```text
  media-ctl -l'"rkisp-isp-subdev":2->"rkisp-bridge-ispp":0[0]'
  media-ctl -l'"rkisp-isp-subdev":2->"rkisp_mainpath":0[1]'
```

Hinweis: Den ISPP-Pfad trennen, main_path verbinden und das RAW-Bild über main_path erfassen. Ohne -d zur Geräteauswahl verwendet media-ctl standardmäßig /dev/media0. Prüfen, welchem Geräteknoten rkisp-isp-subdev zugeordnet ist; normalerweise ist dies /dev/media1.

3\. fmt/size ändern

```text
  media-ctl -d /dev/media0 \
  --set-v4l2'"ov5695 7-0036":0[fmt:SBGGR10_1X10/640x480]'
```

Hinweis: Prüfen Sie, welchem Media-Gerät der Kameraknoten ov5695 7-0036 zugeordnet ist.

4\. fmt setzen und Bilder erfassen

```text
  v4l2-ctl -d /dev/video0 \
  --set-fmt-video=width=720,height=480,pixelformat=NV12 \
  --stream-mmap=3 \
  --stream-skip=3 \
  --stream-to=/tmp/cif.out \
  --stream-count=1 \
  --stream-poll
```

5\. Belichtung, Verstärkung und weitere Steuerelemente setzen

```text
  v4l2-ctl -d /dev/video3 --set-ctrl'exposure=1216,analogue_gain=10'
```

Hinweis: Der ISP-Treiber ruft die Steuerbefehle des Kamera-Subdevices auf. Daher lässt sich die Belichtung über das angegebene Gerät, etwa video3 (main_path oder self_path), einstellen. VICAP ruft diese Steuerbefehle nicht auf; eine direkte Steuerung über den Erfassungsknoten schlägt fehl. Stattdessen den Kamerageräteknoten /dev/v4l-subdevX ermitteln und diesen Endknoten unmittelbar konfigurieren.

## 17. Speicheroptimierung auf RV1109/RV1126

```text
MIPI -> DDR_1 -> ISP -> DDR_2 -> ISPP(TNR) -> DDR_3 -> ISPP(NR&Sharp) -> DDR_4 -> ISPP(FEC) -> DDR_5
```

1\. DDR_1: VICAP-RAW-Daten oder ISP-MIPI-RAW-Daten werden in DDR geschrieben; der ISP liest sie zur Verarbeitung wieder aus DDR.

Speicherbedarf: buf_cnt * buf_size * N, mit N = 1 im linearen Modus, 2 im HDR2-Modus und 3 im HDR3-Modus.

buf_size: ALIGN(width * bpp / 8, 256) * height; // bpp ist die Bitbreite: raw8, raw10 oder raw12.

buf_cnt: Standard 4, mindestens 3; definiert im AIQ-Bibliothekscode hwi/isp20/CamHwIsp20.h.

```text
#define ISP_TX_BUF_NUM 4
#define VIPCAP_TX_BUF_NUM 4
```

ROCKCHIP_CIF_USE_NONE_DUMMY_BUF für das VICAP-Gerät konfigurieren, um einen internen Puffer einzusparen.

2\. DDR_2: ISP-FBC-YUV420- und Verstärkungsdaten werden in DDR geschrieben; ISPP liest sie zur Verarbeitung.

Speicherbedarf: buf_size * buf_cnt

```text
buf_size: ALIGN(width, 64) * ALIGN(height, 128) / 16 + ALIGN(width, 16) * ALIGN(hieght, 16) * 1.5625
```

buf_cnt: 4 Puffer im TNR-3to1-Modus, 3 im 2to1-Modus; der Modus wird im IQ-XML konfiguriert.

Bei aktivierter Bewegungserkennung wird ein skalierter Ausgang verwendet. Das mxn-Downsampling unterstützt die IQ-XML-Konfigurationsoptionen 4x8 und 8x8.

buf_size：ALIGN(width / m, 16) * (height / n) * 1.5

buf_cnt: standardmäßig 6; abhängig von den über AIQ für das self_path-Videogerät angeforderten Puffern.

3\. DDR_3: ISPP-TNR schreibt FBC-YUV420- und Gain-Daten in DDR; ISPP-NR&amp;Sharp liest sie erneut aus DDR und verarbeitet sie.

Speicherbedarf: buf_size * buf_cnt

```text
buf_size: ALIGN(width, 64) * ALIGN(height, 128) / 16 + ALIGN(width, 16) * ALIGN(hieght, 16) * 1.5625
```

buf_cnt: 2, der kleinstmögliche Wert.

4\. DDR_4: ISPP-NR&amp;Sharp schreibt YUYV-Daten in DDR; ISPP-FEC liest sie zur Verarbeitung aus DDR.

Speicherbedarf: buf_size * buf_cnt; bei deaktivierter FEC-Funktion wird kein Speicher belegt.

```text
buf_size: width * height * 2
```

buf_cnt: 2, der kleinstmögliche Wert.

5\. DDR_5: Bildpuffer der vier ISPP-Ausgabekanäle. Die Größe berechnet sich aus benutzerseitig eingestellter Auflösung, Format und buf_cnt.

Die obigen buf_cnt-Werte bieten Ansatzpunkte zur Speicheroptimierung.

Für reservierten ISP-CMA-Speicher kann zunächst mehr Speicher vorgesehen werden. Nach dem Start der Kameraanwendung lässt sich die tatsächlich benötigte Größe ermitteln.

```text
  isp_reserved: isp {
      compatible = "shared-dma-pool";
      inactive;
      reusable;
      size = <0x10000000>;//256M and need 4M align
  };
  enable cma debug
  +++ b/arch/arm/configs/rv1126_defconfig
  @@ -62,6 +62,8 @@ CONFIG_IOSCHED_BFQ=y
   CONFIG_KSM=y
   CONFIG_DEFAULT_MMAP_MIN_ADDR=32768
   CONFIG_CMA=y
  +CONFIG_CMA_DEBUG=y
  +CONFIG_CMA_DEBUGFS=y
  one page is 4K, 26091 page is 104364K and need 4M align, so config 104M to
  isp_reserved
  [root@RV1126_RV1109:/sys/kernel/debug/cma/cma-isp@0]# ls
  alloc  base_pfn  bitmap  count free  maxchunk order_per_bit  used
  [root@RV1126_RV1109:/sys/kernel/debug/cma/cma-isp@0]# cat used
  26091
```

## 18. Latenzoptimierung auf RV1109/RV1126

**1、VICAP wait-line konfigurieren**

Setzen Sie wait-line am VICAP-Knoten im DTS. Bei Bildhöhe 1520 und wait-line=760 wird der Puffer bereits nach Erfassung der halben Bildhöhe an den ISP ausgegeben. Passen Sie wait-line an die Lesegeschwindigkeit des ISP an.

```text
&rkcif_mipi_lvds {
wait-line = <760>;
};
```

Die folgende Befehlsvariante unterstützt auch dynamische Konfiguration:

```text
  echo 1000 > /sys/devices/platform/rkcif_mipi_lvds/wait_line
```

Hinweis: Bei zu kleinem wait-line greift der ISP zu früh auf den Puffer zu. Noch nicht erfasste Bereiche enthalten Daten des vorherigen Bildes. Bei starken Bildänderungen entstehen dadurch Fehler oder eine sichtbare Teilung am Bildende. Bestimmen Sie einen geeigneten Wert durch tatsächliche Tests.

**2、ISP wait-line konfigurieren**

Setzen Sie wait-line am ISP-Knoten im DTS. Bei Bildhöhe 1520 und wait-line=760 wird nach Verarbeitung von Zeile 760 an ISPP ausgegeben. Passen Sie den Wert an die Verarbeitungszeiten von ISP und ISPP an.

```text
&rkisp_vir0 {
wait-line = <760>;
};
```

Zur Diagnose kann auch /sys/module/video_rkisp/parameters/wait_line gesetzt werden, bevor das ISP-Videogerät geöffnet wird.

Hinweis: Ist wait-line zu klein und ISPP schneller als ISP, kann wegen des FBC-Kompressionsformats ein Haltezustand auftreten. Die Motion-Funktion und Mehrsensorbetrieb unterstützen dies nicht.

**3、ISPP wait-line für die Ausgabe von vier Streams konfigurieren**

Setzen Sie wait-line am ISPP-Knoten im DTS. Bei Bildhöhe 1520 und wait-line=896 wird nach Verarbeitung von Zeile 896 an die nachgelagerte Verarbeitung ausgegeben. Passen Sie den Wert an die ISPP-Verarbeitungszeit für NR oder FEC und die nachgelagerte Verarbeitungszeit an.

```text
&rkispp_vir0 {
     status = "okay";
     wait-line = <896>;
};
```

Zur Diagnose kann auch /sys/module/video_rkispp/parameters/wait_line gesetzt werden, bevor das ISPP-Videogerät geöffnet wird.

Hinweis: Ist wait-line zu klein und arbeitet die nachgelagerte Verarbeitung schneller als ISPP, treten Fehler in der nachgelagerten Bildverarbeitung auf. Mehrere Sensoren werden nicht unterstützt.

**4、Hardware-Verarbeitungsgeschwindigkeit erhöhen**

1) ISP-/ISPP-Takt erhöhen

drivers/media/platform/rockchip/isp/hw.c

```text
static const struct isp_clk_info rv1126_isp_clk_rate[] = {
{
.clk_rate = 20,
.refer_data = 0,
}, {
.clk_rate = 600,
.refer_data = 1920, //width
}, {
.clk_rate = 600,
.refer_data = 2688,
}, {
.clk_rate = 600,
.refer_data = 3072,
}, {
.clk_rate = 600,
.refer_data = 3840,
}
};
```

drivers/media/platform/rockchip/ispp/hw.c

```text
static const struct ispp_clk_info rv1126_ispp_clk_rate[] = {
{
.clk_rate = 150,
.refer_data = 0,
}, {
.clk_rate = 500,
.refer_data = 1920 //width
}, {
.clk_rate = 500,
.refer_data = 2688,
}, {
.clk_rate = 500,
.refer_data = 3072,
}, {
.clk_rate = 500,
.refer_data = 3840,
}
};
```

2) IOMMU deaktivieren und reservierten Speicher verwenden

```text
&rkisp_mmu {
status = "disabled";
};
  &rkisp {
        memory-region = <&isp_reserved>;
  };
&rkispp_mmu {
status = "disabled";   };
  &rkispp {
        memory-region = <&isp_reserved>;
  };
```

## 19. Häufig gestellte Fragen

### 19.1 Treiberversion separat aktualisieren

1. Patches des neuen SDK-Kernels erzeugen.

```text
git format-patch A..B drivers/media/common drivers/media/v4l2-core drivers/media/platform/rockchip drivers/media/i2c include/uapi/linux/rkisp2-config.h include/uapi/linux/rkisp21-config.h include/uapi/linux/rkispp-config.h include/uapi/linux/rkcif-config.h include/uapi/linux/rk-camera-module.h include/uapi/linux/rk_vcm_head.h include/uapi/linux/videodev2.h include/uapi/linux/media-bus-format.h -o tmp_patch
```

2. Die Patches auf den alten SDK-Kernel anwenden.

```text
git am tmp_patch/*
```

HINWEIS: A ist die Commit-ID des alten Kernels, B die des neuen Kernels; tmp_patch enthält die ausgegebenen Patches.

### 19.2 Treiberversion ermitteln

Aus dem Kernel-Startprotokoll ablesen:

```text
  rkisp ffb50000.rkisp: rkisp driver version: v00.01.00
  rkispp ffb60000.rkispp: rkispp driver version: v00.01.00
```

Alternativ abrufen mit:

```text
  cat /sys/module/video_rkisp/parameters/version
  cat /sys/module/video_rkispp/parameters/version
```

### 19.3 Ladezustand des RKISP-Treibers prüfen

Nach erfolgreichem Laden des RKISP-Treibers sind Video- und Media-Geräte unter /dev/ vorhanden. Es kann mehrere /dev/video-Geräte geben. Über /sys lassen sich die von RKISP registrierten Videoknoten bestimmen.

```text
  localhost ~ # grep'' /sys/class/video4linux/video*/name
```

Auch media-ctl kann die Topologie ausgeben, um die Pipeline zu prüfen.

Zur Prüfung des Kameratreibers: Sobald alle Kameras registriert sind, gibt der Kernel folgendes Protokoll aus.

```text
  localhost ~ # dmesg | grep Async
  [0.682982] RKISP: Async subdev notifier completed
```

Fehlt die Zeile Async subdev notifier completed, prüfen Sie zuerst Sensorfehlermeldungen und die erfolgreiche I2C-Kommunikation.

### 19.4 RAW-Speicherformat für ISP/VICAP konfigurieren

isp：

**rv1109/rv1126:**

Drei Modi:

0: raw12/raw10/raw8 kompakt im 8bit-Speicher

1: raw12/raw10, ein Pixel pro 16bit-Speichereinheit, Big Endian

```text
|15|14|13|12|11|10| 9| 8| 7| 6| 5| 4| 3| 2| 1| 0|
| 3| 2| 1| 0| -| -| -| -|11|10| 9| 8| 7| 6| 5| 4|
```



2: raw12/raw10, ein Pixel pro 16bit-Speichereinheit, an den höherwertigen Bits ausgerichtet

```text
|15|14|13|12|11|10| 9| 8| 7| 6| 5| 4| 3| 2| 1| 0|
|11|10| 9| 8| 7| 6| 5| 4| 3| 2| 1| 0| -| -| -| -|
```



**rk356x:**

Drei Modi:

0: raw12/raw10/raw8 kompakt im 8bit-Speicher

1: raw12/raw10, ein Pixel pro 16bit-Speichereinheit, an den niederwertigen Bits ausgerichtet

```text
|15|14|13|12|11|10| 9| 8| 7| 6| 5| 4| 3| 2| 1| 0|
| -| -| -| -|11|10| 9| 8| 7| 6| 5| 4| 3| 2| 1| 0|
```



2: raw12/raw10, ein Pixel pro 16bit-Speichereinheit, an den höherwertigen Bits ausgerichtet

```text
|15|14|13|12|11|10| 9| 8| 7| 6| 5| 4| 3| 2| 1| 0|
|11|10| 9| 8| 7| 6| 5| 4| 3| 2| 1| 0| -| -| -| -|
```



Steuerung:

AIQ erweitert die Steuerung um den Speichermodus. Beim Start des AIQ-Programms wird der unterstützte Speichermodus entsprechend dem Sensormodell konfiguriert.

rv1109/rv1126: unterstützt ab AIQ-Version v0x1.0x71.1; rk356x: unterstützt ab AIQ-Version v2.60.01.

Benutzer können das Speicherformat auch über ioctl am Streaming-Gerät steuern. Die zugehörigen Definitionen stehen in include/uapi/linux/rkisp2-config.h:

```text
  #define RKISP_CMD_GET_CSI_MEMORY_MODE \
      _IOR('V', BASE_VIDIOC_PRIVATE + 100, int)
  #define RKISP_CMD_SET_CSI_MEMORY_MODE \
      _IOW('V', BASE_VIDIOC_PRIVATE + 101, int)
  enum isp_csi_memory {
      CSI_MEM_COMPACT = 0,
      CSI_MEM_WORD_BIG_END = 1,
      CSI_MEM_WORD_LITTLE_ALIGN = 1,
      CSI_MEM_WORD_BIG_ALIGN = 2,
  };
```

vicap：

**rv1109/rv1126/rk356x:**

Drei Modi:

0: raw12/raw10/raw8 kompakt im 8bit-Speicher

1: raw12/raw10, ein Pixel pro 16bit-Speichereinheit, an den niederwertigen Bits ausgerichtet für rv1126/rv1109/rk356x

```text
|15|14|13|12|11|10| 9| 8| 7| 6| 5| 4| 3| 2| 1| 0|
| -| -| -| -|11|10| 9| 8| 7| 6| 5| 4| 3| 2| 1| 0|
```



2: raw12/raw10, ein Pixel pro 16bit-Speichereinheit, an den höherwertigen Bits ausgerichtet für rv1126/rv1109/rk356x

```text
|15|14|13|12|11|10| 9| 8| 7| 6| 5| 4| 3| 2| 1| 0|
|11|10| 9| 8| 7| 6| 5| 4| 3| 2| 1| 0| -| -| -| -|
```



Hinweis: DVP auf rv1109/rv1126/rk356x unterstützt nur den nicht kompakten Modus; dabei ist die Ausrichtung an den niederwertigen oder höherwertigen Bits wählbar.

Steuerung:

AIQ erweitert die Steuerung um den Speichermodus. Beim Start des AIQ-Programms wird der unterstützte Speichermodus entsprechend dem Sensormodell konfiguriert.

rv1109/rv1126: unterstützt ab AIQ-Version v0x1.0x71.1; rk356x: unterstützt ab AIQ-Version v2.60.01.

Benutzer können das Speicherformat auch über ioctl am Streaming-Gerät steuern. Die zugehörigen Definitionen stehen in include/uapi/linux/rkcif-config.h:

```text
  #define RKCIF_CMD_GET_CSI_MEMORY_MODE \
      _IOR('V', BASE_VIDIOC_PRIVATE + 0, int)
  #define RKCIF_CMD_SET_CSI_MEMORY_MODE \
      _IOW('V', BASE_VIDIOC_PRIVATE + 1, int)
  enum cif_csi_lvds_memory {
      CSI_LVDS_MEM_COMPACT = 0,
      CSI_LVDS_MEM_WORD_LOW_ALIGN = 1,
      CSI_LVDS_MEM_WORD_HIGH_ALIGN = 2,
  };
```

Für VICAP lässt sich dies mit dem folgenden Befehl konfigurieren; dieser dient jedoch ausschließlich dem Debugging.

Als nicht kompakt konfigurieren; jede Zahl entspricht einem Kanal.

```text
  echo 0 0 0 0 > /sys/devices/platform/rkcif_mipi_lvds/compact_test
```

Ausrichtung an den niederwertigen Bits konfigurieren.

```text
  echo 0 0 0 0 > /sys/devices/platform/rkcif_mipi_lvds/is_high_align
```

Ausrichtung an den höherwertigen Bits konfigurieren.

```text
  echo 0 0 0 0 > /sys/devices/platform/rkcif_mipi_lvds/is_high_align
```

### 19.5 VICAP-Reset bei Fehlern konfigurieren

Der VICAP-Treiber besitzt einen Reset-Mechanismus, der bei einem Fehlerzustand einen CRU-Reset von VICAP ausführt. Die Verwendung wird nachfolgend beschrieben:

**Konfiguration für kernel-4.19:**

Zum Aktivieren des Reset-Mechanismus müssen die rockchip- und cif-monitor-Parameter am zugehörigen CIF-Schnittstellen-Geräteknoten im DTS ergänzt werden. Ohne diesen Parameter im DTS ist der Reset-Mechanismus standardmäßig deaktiviert.

```text
  &rkcif_mipi_lvds {
      status = "okay";
      /* rockchip,cif-monitor = <index0 index1 index2 index3 index4>; */
      rockchip,cif-monitor = <2 2 5 1000 5>;
      port {
          /* MIPI CSI-2 endpoint */
          cif_mipi_in: endpoint {
              remote-endpoint = <&mipi_csi2_output>;
              data-lanes = <1 2 3 4>;
          };
      };
  };
```

index0 beschreibt den Reset-Modus. Gegenwärtig gibt es vier Hauptmodi:

<!-- Source: English PDF p201, table unit 1632 -->

| Modus | Beschreibung |
| --- | --- |
| Idle | Überwachung nicht verwenden. |
| Continue | VICAP kontinuierlich in Echtzeit auf MIPI-Fehler und Stream-Unterbrechungen überwachen. Bei Fehler oder Unterbrechung wird VICAP zurückgesetzt. Sobald die durch index1 festgelegte Bildanzahl erreicht ist, wird der Überwachungs-Timer am Bildende initialisiert und die Überwachung gestartet. Im Original steht anschließend, dass die Überwachung beim Erreichen der entsprechenden Bildanzahl nicht ausgelöst werden könne; diese widersprüchliche Aussage bleibt zur Nachprüfung kenntlich. Der Timer führt Abtastung und Prüfung mit der durch index2 festgelegten Periode aus. |
| Trigger | Ein Reset wird nur ausgelöst, wenn in VICAP ein MIPI-Fehler auf CSI2-Protokollebene auftritt. index4 legt die Anzahl der MIPI-Fehlermeldungen fest. Bei Erreichen dieses Wertes wird der Überwachungs-Timer im Bildende-Interrupt initialisiert. Nach Ablauf der durch index2 festgelegten Periode erfolgt ein VICAP-Reset. |
| Hotplug | Der Hotplug-Modus richtet sich vor allem an Adapterchips für Fahrzeugsysteme wie n4/tp6188 und behebt fragmentierte oder unterbrochene Bilder beim Ein- und Ausstecken. Er umfasst die Funktion des Continue-Modus: VICAP wird kontinuierlich in Echtzeit auf MIPI-Fehler und Unterbrechungen überwacht und bei deren Auftreten zurückgesetzt. Nach Erreichen der durch index1 festgelegten Bildanzahl wird der Überwachungs-Timer am Bildende initialisiert und die Überwachung gestartet; vorher lässt sie sich nicht auslösen. Der Timer prüft mit der durch index2 festgelegten Periode. Im Unterschied zu Continue wird auch dann ein Reset ausgelöst, wenn MIPI keinen Fehler meldet und der Stream weiterläuft, aber der von VICAP erfasste Sensor seine Reset-Information über RKMODULE_SET_VICAP_RST_INFO aktiviert hat: VICAP erhält diese Information über RKMODULE_GET_VICAP_RST_INFO und führt den Reset aus. |

index1: Im Modus Continue oder Hotplug wird der Überwachungs-Timer nach Erfassung von index1 Bildern gestartet;

Index2: Periode des Überwachungs-Timers in Bildern; das Überwachungsintervall beträgt index2 Bilder;

Index3: Zeitparameter für den verzögerten Reset. Nach Erkennung eines VICAP-CSI2-Fehlers wird innerhalb dieser Zeit weiter überwacht. Steigt die Fehleranzahl nicht mehr, erfolgt der Reset. Nach Ablauf der festgelegten Zeit erfolgt der Reset unmittelbar, unabhängig davon, ob die Fehleranzahl weiter steigt. Einheit: ms;

Index4: Anzahl der MIPI-CSI-Fehler, nach deren Erreichen ein Reset ausgelöst wird;

Zur Unterstützung der Fehlererkennung sowohl für MIPI als auch für DVP wurde der Mechanismus geändert. Dafür sind die folgenden Commits einzubeziehen:

```text
  media: rockchip: rkcif reset all dev when trigger reset event
      move monitor param to rkcif node
      ag &rkcif {
          status = "okay";
          rockchip,cif-monitor = <3 200 1000 5 0>;
          /*
           * index 0: monitor mode
           *     val: 0 idle
           *          1 Continue mode, detect cut of stream or csi2 err
           *          2 trigger mode, detect csi2 err
           *          3 Hotplug, detect hot plug or cut off stream or csi2 err
           * index 1: monitor cycle
           *     val: timer of monitor cycle, unit ms
           * index 2: error interval
           *     val: time of error keeping, such as 1000,
           *          mean atfer one second error still occur,force reset dev,
           *          the max timer to wait error stop
           * index 3: err_ref_cnt:
           *     val: timer error ref val for reset
           * index 4: reset_by_user
           *     val: set val 1 to control reset by user
           */
      };
      Signed-off-by: Zefa Chen <zefa.chen@rock-chips.com>
      Change-Id: If4da872c7ee3c5140f94e5cf331cab84005361d2
```

Details: 1) Die Konfiguration „rockchip, cif monitor“ wurde von rkcif_ mipi_lvds zum rkcif-Knoten verschoben. 2) index1 entfällt; stattdessen beginnt die Erkennung nach dem Stream-Start. 3) Der Parameter reset_by_user wurde ergänzt. Der Wert 1 bedeutet, dass der Treiber nicht selbst zurücksetzt, sondern auf die Anwendung wartet. Diese fragt regelmäßig über das ioctl „RKCIF_CMD_ET_RESET_INFO“ des Videoknotens den Reset-Status ab. Der Wert 1 signalisiert einen erforderlichen Reset. Die Anwendung kann zu einem geeigneten Zeitpunkt „RKCIF_CMD_SET_RESET“ aufrufen, um ihn auszuführen. Die Schreibweise RKCIF_CMD_ET_RESET_INFO stammt aus der Vorlage.

**Konfiguration für kernel-5.10:**

drivers/media/rockchip/cif/Kconfig ergänzt die Konfiguration zur Fehlererkennung. Die Standardwerte können direkt geändert oder durch Einträge in defconfig überschrieben werden. Die Parameter sind:

<!-- Source: English PDF p203, table unit 1643 -->

| ROCKCHIP_CIF_USE_MONITOR | Aktivierung der Fehlerüberwachung. Sie muss vom Kunden aktiviert werden und ist standardmäßig ausgeschaltet. |
| --- | --- |
| ROCKCHIP_CIF_MONITOR_MODE | Modus der Fehlerüberwachung; definiert wie in Kernel 4.19. |
| ROCKCHIP_CIF_MONITOR_START_FRAME | Bild, ab dem die Erkennung beginnt; empfohlen wird 0. |
| ROCKCHIP_CIF_MONITOR_CYCLE | Erkennungsintervall in Bildintervallen. Bei 25fps und dem Wert 4 beträgt es 40ms * 4. Nach projektspezifischer Bewertung wird ein Intervall von etwa 400ms empfohlen. |
| ROCKCHIP_CIF_MONITOR_KEEP_TIME | Zeitparameter für den verzögerten Reset. Nach einem VICAP-CSI2-Fehler wird innerhalb der festgelegten Zeit kontinuierlich weiter überwacht. Sobald die Fehleranzahl nicht mehr steigt, erfolgt der Reset. Nach Ablauf dieser Zeit erfolgt er unmittelbar, unabhängig davon, ob die Fehleranzahl weiter steigt. Einheit: ms. |
| ROCKCHIP_CIF_MONITOR_ERR_CNT | Bezieht sich normalerweise auf die MIPI-Fehlerstatistik. Der Standardwert 5 bedeutet, dass nach 5 * 2 Fehlern ein Reset ausgelöst wird. |
| ROCKCHIP_CIF_RESET_BY_USER | Bei 1 werden Fehler nur erkannt, ohne selbstständig zurückzusetzen; die Anwendung wird benachrichtigt und soll zu einem geeigneten Zeitpunkt zurücksetzen. |

Bei einem anwendungsgesteuerten Reset sind zwei Punkte zu beachten: 1) Das Reset-Ereignis wird über den MIPI-CSI2-Knoten übermittelt. Den passenden Knoten mit media-ctl -p -d /dev/mediaX ermitteln (X = 0, 1, 2, 3 usw.) und dort auf das Ereignis warten. 2) Einen Videoknoten öffnen. Beliebig einer der Knoten stream_cif_mipi_id0~3 kann gewählt werden, da sie derselben Hardware angehören; normalerweise wird stream_cif_mipi_id0 verwendet. Dort das Reset-ioctl ausführen.

Demonstrationsbeispiel:

```text
  #include <stdio.h>
  #include <stdlib.h>
  #include <getopt.h>
  #include <fcntl.h>
  #include <unistd.h>
  #include <sys/ioctl.h>
  #include <linux/videodev2.h>
  #include "rkcif-config.h"
  int subscribe_event(int fd, int event)
  {
      int ret = 0;
      struct v4l2_event_subscription sub;
      if (fd < 0) {
          printf("fd is err\n");
          return -1;
      }
      sub.type = event;
      sub.id = 0;
      ret = ioctl(fd, VIDIOC_SUBSCRIBE_EVENT, &sub);
      if (ret < 0) {
          printf("VIDIOC_SUBSCRIBE_EVENT fail\n");
          return -1;
      }
      return 0;
  }
  int unsubscribe_event(int fd, int event)
  {
      int ret = 0;
      struct v4l2_event_subscription sub;
      if (fd < 0) {
          printf("fd is err\n");
          return -1;
      }
      sub.type = event;
      sub.id = 0;
      ret = ioctl(fd, VIDIOC_UNSUBSCRIBE_EVENT, &sub);
      if (ret < 0) {
          printf("VIDIOC_SUBSCRIBE_EVENT fail\n");
          return -1;
      }
      return 0;
  }
  int main(int argc, char **argv)
  {
      char *dev;
      int ret;
      int fd = -1;
      int fd_cif = -1;
      int i = 0;
      struct v4l2_event event;
      char *dev_cif;
      if (argc != 3) {
          printf("invalid input\n");
          for (i = 0; i < argc; i++)
              printf("argv[%d]:%s\n", i, argv[i]);
          return -1;
      }
      dev = argv[1];
      fd = open(dev, O_RDWR, 0);
      if (fd < 0) {
          printf("open dev:%s fail\n", dev);
          return -1;
      }
      dev_cif = argv[2];
      fd_cif = open(dev_cif, O_RDWR, 0);
      if (fd_cif < 0) {
          printf("open dev:%s fail\n", dev_cif);
          return -1;
      }
      ret = subscribe_event(fd, V4L2_EVENT_RESET_DEV);
      if (ret < 0)
          goto end;
      while (1) {
              printf("VIDIOC_DQEVENT ready %d\n", ret);
          ret = ioctl(fd, VIDIOC_DQEVENT, &event);
              if (ret) {
                      printf("VIDIOC_DQEVENT err %d\n", ret);
                      goto end;
                 }
          printf("VIDIOC_DQEVENT event %x, %d\n", event.type, event.reserved[0]);
          if (event.type == V4L2_EVENT_RESET_DEV) {
              ret = ioctl(fd_cif, RKCIF_CMD_SET_RESET, &event.reserved[0]);
              if (ret) {
                          printf("RKCIF_CMD_SET_RESET err %d\n", ret);
                          goto end;
              }
                 }
      }
  end:
      ret = unsubscribe_event(fd, V4L2_EVENT_RESET_DEV);
      close(fd);
      close(fd_cif);
      return 0;
  }
```

### 19.6 Vom CIS ausgegebene RAW- und YUV-Daten erfassen

Nach Abschluss der Treiberentwicklung lassen sich die CIS-Ausgabedaten unmittelbar über den standardmäßigen Befehl v4l2-ctl erfassen. Die Verwendung beschreibt die Hilfe zu v4l2-ctl: https://www.mankier.com/1/v4l2-ctl

**Beispiel:**

```text
  v4l2-ctl -d /dev/video0  --set-fmt-video=width=1920,height=1080,pixelformat=RG10 --stream-mmap=4 --stream-count=1 --stream-to=/tmp/cap.raw  --stream-skip=2
```

-d: Gerätenamen angeben.

--set-fmt-video: Auflösung einstellen; sie muss der Sensorausgabe entsprechen. Die aktuelle Sensorauflösung lässt sich mit media-ctl -p -d /dev/mediaX prüfen.

pixelformat: Ausgabedatenformat, beispielsweise BG12 oder NV12.

--stream-mmap: Anzahl der mmap-Puffer.

--stream-count: Anzahl zu erfassender Bilder; mehrere Bilder werden in derselben Datei gespeichert.

--stream-to: Speicherpfad angeben.

--stream-skip: Anzahl zu überspringender Bilder.

#### 19.6.1 Unterstützte Geräte

##### 19.6.1.1 RV1109/RV1126

<!-- Source: English PDF p206, table unit 1662 -->

| Gerät | Schnittstelle | Format | Geräteknotenname | RAW-Ausgabe | YUV-Ausgabe |
| --- | --- | --- | --- | --- | --- |
| VICAP | DVP | RAW | video0~video3 | Nicht kompakt RAW | Nein |
| VICAP | MIPI/LVDS | RAW | video0~video3 | Nicht kompakt RAW Kompakt RAW | Nein |
| VICAP | DVP / MIPI / LVDS | YUV | video0~video3 | Nein | nv12 nv16 |
| ISP | DVP / MIPI / LVDS | RAW | rkisp_rawwr0 rkisp_rawwr1 rkisp_rawwr2 rkisp_rawwr3 | Nicht kompakt RAW Kompakt RAW | Nein |
| ISP | MIPI / LVDS | YUV | rkisp_mainpath | Nicht kompakt RAW | nv12 nv16 |
| ISPP | Nur DDR-Lesen | YUV | rkispp_m_bypass rkispp_scale0 rkispp_scale1 rkispp_scale2 | Nein | nv12 nv16 |

##### 19.6.1.2 RK356X

<!-- Source: English PDF p207, table unit 1664 -->

| Gerät | Schnittstelle | Format | Geräteknotenname | RAW-Ausgabe | YUV-Ausgabe |
| --- | --- | --- | --- | --- | --- |
| VICAP | DVP | RAW | video0~video3 | Nicht kompakt RAW | Nein |
| VICAP | MIPI/LVDS | RAW | video0~video3 | Nicht kompakt RAW Kompakt RAW | Nein |
| VICAP | DVP / MIPI / LVDS | YUV | video0~video3 | Nein | nv12 nv16 |
| ISP | DVP / MIPI / LVDS | RAW | rkisp_rawwr0 rkisp_rawwr1 rkisp_rawwr2 rkisp_rawwr3 | Nicht kompakt RAW Kompakt RAW | Nein |
| ISP | MIPI / LVDS | YUV | rkisp_mainpath | Nicht kompakt RAW | nv12 nv16 |

Hinweise:

1\. Geräteknoten mit media-ctl -p -d /dev/mediaX abfragen; X steht für 0, 1, 2, 3 usw.

#### 19.6.2 RAW-Speicherformat

##### 19.6.2.1 Nicht kompaktes RAW-Speicherformat

Im nicht kompakten Format werden raw10- und raw12-Sensordaten in 16 Bit gespeichert und an den höherwertigen Bits ausgerichtet. Die folgende Abbildung zeigt die RAW12-Anordnung am Beispiel eines 4-Byte-Speicherabschnitts:

![Nicht kompaktes RAW-Speicherlayout — englische Originalabbildung, PDF-Seite 207](/docs/rockchip-isp30-vi-driver/assets/en-p207-X900.png)

*Nicht kompaktes RAW-Speicherlayout — englische Originalabbildung, PDF-Seite 207*

##### 19.6.2.2 Kompaktes RAW-Speicherformat

Die folgende Abbildung zeigt die RAW12-Anordnung am Beispiel eines 4-Byte-Speicherabschnitts:

![Kompaktes RAW-Speicherlayout — englische Originalabbildung, PDF-Seite 207](/docs/rockchip-isp30-vi-driver/assets/en-p207-X901.png)

*Kompaktes RAW-Speicherlayout — englische Originalabbildung, PDF-Seite 207*

**Wichtiger Hinweis:**

Beim ISP-mainpath-Gerät wird für Eingangsdaten in Raw10 oder Raw12 einheitlich Raw12 im nicht kompakten RAW-Speicherformat ausgegeben.

#### 19.6.3 Anwendungsbeispiele

##### 19.6.3.1 RAW-Ausgabe über VICAP

1. Standard ist das kompakte Format. Mit folgenden Befehlen lässt sich zwischen kompakt und nicht kompakt wechseln:

```text
      echo 0 > /sys/devices/platform/rkcif_mipi_lvds/compact_test
```

0 bedeutet nicht kompakt, 1 kompakt. Für mehrere gleichzeitig verwendete Kanäle kann der Befehl wie folgt angepasst werden:

```text
      echo 0 0 0 0 > /sys/devices/platform/rkcif_mipi_lvds/compact_test
```

Die Zahlen nach echo bestimmen nacheinander die Speicherformate von vc0, vc1, vc2 und vc3.

2. video0~3 entsprechen vc0~vc3.

3. v4l2-ctl-Befehl

```text
  v4l2-ctl -d /dev/video0  --set-fmt-video=width=1920,height=1080,pixelformat=RG10 --stream-mmap=4 --stream-count=1 --stream-to=/tmp/cap.raw  --stream-skip=2
```

##### 19.6.3.2 Nicht kompakte RAW-Ausgabe über ISP-mainpath

1、Das Bild muss über mainpath erfasst werden. Die standardmäßige ISP-Ausgabeverbindung ist rkisp-bridge-ispp. Mit folgendem Befehl auf mainpath umschalten:

```text
      media-ctl -l '"rkisp-isp-subdev":2->"rkisp-bridge-ispp":0[0]'
      media-ctl -l '"rkisp-isp-subdev":2->"rkisp_mainpath":0[1]'
```

Hinweis: Ohne -d wird standardmäßig media0 verwendet. Liegt rkisp-isp-subdev nicht dort, geben Sie mit -d das zugehörige Media-Gerät an.

Die 0 hinter „rkisp-bridge-ispp“ bezeichnet pad0, einen Sink-Pad. Einzelheiten enthält die V4L2-Dokumentation.

2、Das ISP-Ausgabeformat ist standardmäßig YUYV8_2X8. Mit folgendem Befehl zum Bayer-RAW-Format wechseln:

```text
      media-ctl -d /dev/media0 --set-v4l2 '"rkisp-isp-subdev":2[fmt:SBGGR12_1X12/2688x1520]'
```

Hinweis: rkisp-isp-subdev liegt nicht zwingend in media0. Ermitteln Sie das zugehörige Media-Gerät und geben Sie es mit -d an.

Die 2 hinter „rkisp-isp-subdev“ bezeichnet pad2, einen Source-Pad. Einzelheiten enthält die V4L2-Dokumentation.

Prüfen Sie anschließend mit media-ctl -p -d /dev/mediaX (X=0,1,2,...), ob die Änderung wirksam ist. Erst danach erfasste RAW-Daten entsprechen den ursprünglichen RAW-Daten.

3. v4l2-ctl-Befehl

```text
  v4l2-ctl -d /dev/video0  --set-fmt-video=width=1920,height=1080,pixelformat=RG10 --stream-mmap=4 --stream-count=1 --stream-to=/tmp/cap.raw  --stream-skip=2
```

##### 19.6.3.3 YUV-Ausgabe über VICAP

Die Eingangsdaten müssen YUV sein. Bei RAW-Eingabe kann VICAP kein YUV ausgeben.

```text
  v4l2-ctl -d /dev/video0  --set-fmt-video=width=1920,height=1080,pixelformat=NV12 --stream-mmap=4 --stream-count=1 --stream-to=/tmp/cap.raw  --stream-skip=2
```

##### 19.6.3.4 YUV-Ausgabe über ISP

```text
  v4l2-ctl -d /dev/video5  --set-fmt-video=width=1920,height=1080,pixelformat=NV12 --stream-mmap=4 --stream-count=1 --stream-to=/tmp/cap.raw  --stream-skip=2
```

Hinweise:

1\. Beim ISP können mainpath oder selfpath erfasst werden; video5 ist nur ein Beispiel und muss an die tatsächlichen Parameter angepasst werden. 2. Bei RAW-Eingabe kann der ISP nach verschiedenen Bildverarbeitungsschritten YUV ausgeben. Dafür muss RK AIQ die ISP-Bildverarbeitungsmodule steuern. Die hier gezeigten Befehle richten nur den Datenfluss ein; die Module verwenden Treiberstandardparameter, wodurch die Bildwirkung normalerweise nicht korrekt ist.

##### 19.6.3.5 YUV-Ausgabe über ISPP

ISPP-Eingangsdatenquelle: rkisp-bridge-ispp.

Die Verknüpfungen von rkisp_mainpath, rkisp_selfpath und rkispp_input_image müssen deaktiviert sein.

Das Source-Format von rkisp-isp-subdev pad2 muss fmt:YUYV8_2X8 sein.

ISP ist standardmäßig mit ISPP verknüpft. Referenzbefehle:

```text
  media-ctl -l '"rkisp-isp-subdev":2->"rkisp_mainpath":0[0]'
  media-ctl -l '"rkisp-isp-subdev":2->"rkisp_selfpath":0[0]'
  media-ctl -l '"rkisp-isp-subdev":2->"rkisp-bridge-ispp":0[1]'
  media-ctl -d /dev/media1 -l '"rkispp_input_image":0->"rkispp-subdev":0[1]'
  v4l2-ctl -d /dev/video13 \
  --set-fmt-video=width=2688,height=1520,pixelformat=NV12 \
  --stream-mmap=3 --stream-to=/tmp/nv12.out --stream-count=20 --stram-poll
```

Hinweis: Wählen Sie für -d je nach Erfassungsanforderung einen der folgenden Knoten. Die tatsächlichen Namen liefert media-ctl -p -d /dev/mediaX.

<!-- Source: English PDF p210, table unit 1718 -->

| rkispp_m_bypass | Volle Auflösung und YUV-Format |
| --- | --- |
| rkispp_scale0 | Volle oder skalierte Auflösung, YUV-Format. Skalierungsverhältnis [1 8], maximale Breite 3264. |
| rkispp_scale1 | Volle oder skalierte Auflösung, YUV-Format. Skalierungsverhältnis [2 8], maximale Breite 1280. |
| rkispp_scale2 | Volle oder skalierte Auflösung, YUV-Format. Skalierungsverhältnis [2 8], maximale Breite 1280. |

### 19.7 CIS-Ausgabeauflösung umschalten

1. Unterstützt der Sensortreiber mehrere Auflösungen, lässt sich für RAW-Aufnahmen einer anderen Auflösung die aktuelle Sensorauflösung mit folgendem Befehl umschalten:

```text
  media-ctl -d /dev/media0 --set-v4l2 '"m01_f_os04a10 1-0036-1":0[fmt:SBGGR12_1X12/2688x1520]'
```

Hinweis: m01_f_os04a10 1-0036-1 ist der Sensorknotenname; danach folgt das gewünschte Format. Der Sensortreiber muss diese Formatkonfiguration unterstützen.

2. Bei VICAP genügt die Einstellung des Sensorknotens. Beim ISP müssen zusätzlich dessen Ein- und Ausgabeformat gesetzt werden. Referenzbefehle:

```text
  media-ctl -d /dev/media0 --set-v4l2 '"rkisp-isp-subdev":0[fmt:SBGGR12_1X12/2688x1520]'
  media-ctl -d /dev/media0 --set-v4l2 '"rkisp-isp-subdev":0[crop:(0,0)/2688x1520]'
  media-ctl -d /dev/media0 --set-v4l2 '"rkisp-isp-subdev":2[fmt:SBGGR12_1X12/2688x1520]'
  media-ctl -d /dev/media0 --set-v4l2 '"rkisp-isp-subdev":2[crop:(0,0)/2688x1520]'
```

### 19.8 CIS-Belichtungsparameter einstellen

1、Den Sensorknotennamen über media-ctl -p -d /dev/mediaX ermitteln. Der Geräteknoten hat das Format /dev/v4l-subdevX. Referenzbefehl:

```text
  v4l2-ctl -d /dev/v4l-subdev4 --set-ctrl 'exposure=1216,analogue_gain=10'
```

Die Werte können auch einzeln gesetzt werden:

```text
  v4l2-ctl -d /dev/v4l-subdev4 --set-ctrl exposure=1216
  v4l2-ctl -d /dev/v4l-subdev4 --set-ctrl analogue_gain=10
```

2. Die maximale Belichtung ist durch Sensor-VTS begrenzt, beispielsweise auf vts-4 oder vts-10; maßgeblich ist das jeweilige Sensorhandbuch. Bei 30fps beträgt die maximale Belichtungszeit beispielsweise 33.3ms. Für 40ms muss VTS erhöht werden. Proportionale Umrechnung: vts_30fps * 30fps = vts_25fps * 25fps. Daraus ergibt sich VTS für 25fps; vblank ist (vts-height). Setzen Sie den berechneten vblank-Wert im Sensortreiber, um längere Belichtung zu erlauben. Referenzbefehl:

vts ist die Bildlänge einschließlich aktiver Zeilen und Austastzeilen.

```text
  v4l2-ctl -d /dev/v4l-subdev4 --set-ctrl vertical_blanking=200
```

### 19.9 Schwarzweißkameras unterstützen

Der CIS-Treiber muss das Ausgabeformat des Schwarzweißsensors auf eines der folgenden drei Formate ändern:

```text
  MEDIA_BUS_FMT_Y8_1X8 (sensor 8bit output)
  MEDIA_BUS_FMT_Y10_1X10 (sensor 10bit output)
  MEDIA_BUS_FMT_Y12_1X12 (sensor 12bit output)
```

Dieses Format wird in xxxx_get_fmt und xxxx_enum_mbus_code zurückgegeben.

Der RKISP-Treiber nimmt für diese drei Formate besondere Einstellungen vor, um Schwarzweißbilder zu erfassen.

Benötigt die Anwendung Y8-Bilder, muss außerdem SP Path verwendet werden, da nur dieser Y8-Ausgabe unterstützt.

### 19.10 Gerade und ungerade Halbbilder zusammenführen

Der RKISP-Treiber unterstützt die Zusammenführung gerader und ungerader Halbbilder unter folgenden Voraussetzungen:

1\. MIPI muss die Bildnummer aus den Frame-Start-/Frame-End-Kurzpaketen ausgeben. Daraus bestimmt RKISP die Parität des aktuellen Halbbildes.

2\. BT656 muss standardmäßiges SAV/EAV mit der Halbbildparität in bit6 ausgeben. Daraus bestimmt RKISP die Parität.

3\. Nur der Videogeräteknoten RKISP1_selfpath besitzt diese Funktion. Verwendet die Anwendung versehentlich einen anderen Knoten, meldet der Treiber:

```text
"Only selfpath support interlaced"
```

RKISP_selfpath-Informationen lassen sich mit media-ctl -p anzeigen:

```text
  entity 3: rkisp_selfpath (1 pad, 1 link)
       type Node subtype V4L flags 0
        device node name /dev/video1
      pad0: Sink
         <- "rkisp-isp-subdev":2 [ENABLED]
```

**Der Gerätetreiber wird wie folgt implementiert:**

format.field muss V4L2_FIELD_INTERLACED sein, um gerade und ungerade Halbbilder als Ausgabe zu kennzeichnen. Dieser Wert ist in xxxx_get_fmt zurückzugeben. Referenz: driver/media/i2c/tc35874x.c.

### 19.11 Diagnoseinformationen anzeigen

1\. Media-Pipeline-Informationen prüfen; sie entsprechen der Kamerakonfiguration im DTS.

```text
  media-ctl -p -d /dev/mediaX (X = 0, 1, 2 ..)
```

2\. proc-Informationen anzeigen: aktueller ISP-/ISPP-Zustand sowie Bildein-/ausgabeinformationen. cat kann mehrfach aufgerufen werden.

```text
  cat /proc/rkisp*
```

3\. Treiber-Diagnoseinformationen anzeigen: Debugstufe an ISP- und ISPP-Knoten setzen. Höhere Werte liefern mehr Informationen.

```text
  echo n> /sys/module/video_rkisp/parameters/debug (n = 0, 1, 2, 3; 0 is off)
  echo n> /sys/module/video_rkispp/parameters/debug
  echo 8 > /proc/sys/kernel/printk
```

4\. Registerinformationen prüfen und die Datei reg auslesen.

Für RV1109/RV1126:

```text
      io -4 -l 0x10000 0xffb50000> /tmp/isp.reg
      io -4 -l 0x1000 0xffb60000> /tmp/ispp.reg
```

Für RK3566/RK3568:

```text
      io -4 -l 0x10000 0xfdff0000> /tmp/isp.reg
```

5\. Schritte zur Bereitstellung von Diagnoseinformationen:

1\. Zustand beim Fehler: 1-&gt;2-&gt;4-&gt;3

2\. Fehler reproduzieren: 3-&gt;Start-&gt;Reproduktion-&gt;1-&gt;2-&gt;4

6. Beschreibung der proc-Informationen

```text
  [root@RV1126_RV1109:/]# cat /proc/rkisp*
  rkisp-vir0 Version:v01.06.00
  clk_isp    400000000
  aclk_isp   500000000
  hclk_isp   250000000
  Interrupt  Cnt:7521 ErrCnt:0
  Input      rkcif_mipi_lvds Format:SBGGR10_1X10 Size:2688x1520@30fps Offset(0,0)
  Isp Read   mode:frame2 (frame:1522 rate:33ms idle time:10ms) cnt(total:1522
  X1:1503 X2:18 X3:-1)
  Output     rkispp0 Format:FBC420 Size:2688x1520 (frame:1522 rate:32ms)
  DPCC0      ON(0x5)
  DPCC1      ON(0x5)
  DPCC2      ON(0x5)
  BLS        ON(0x1)
  SDG        OFF(0x80446197)
  LSC        ON(0x1)
  AWBGAIN    ON(0x80446197) (gain: 0x01110111, 0x028a0202)
  DEBAYER    ON(0x7000111)
  CCM        ON(0x80000001)
  GAMMA_OUT  ON(0x80000001)
  CPROC      ON(0xf)
  IE         OFF(0x0) (effect: BLACKWHITE)
  WDR        OFF(0x30cf0)
  HDRTMO     ON(0xa4f05a27)
  HDRMGE     ON(0x80000005)
  RAWNR      ON(0x80100001)
  GIC        OFF(0x0)
  DHAZ       ON(0x80101119)
  3DLUT      OFF(0x2)
  GAIN       ON(0x80010111)
  LDCH       OFF(0x0)
  CSM        FULL(0x80446197)
  SIAF       OFF(0x0)
  SIAWB      OFF(0x0)
  YUVAE      ON(0x400100f3)
  SIHST      ON(0x38000107)
  RAWAF      ON(0x7)
  RAWAWB     ON(0x776887)
  RAWAE0     ON(0x40000003)
  RAWAE1     ON(0x400000f5)
  RAWAE2     ON(0x400000f5)
  RAWAE3     ON(0x400000f5)
  RAWHIST0   ON(0x40000501)
  RAWHIST1   ON(0x60000501)
  RAWHIST2   ON(0x60000501)
  RAWHIST3   ON(0x60000501)
  Monitor    OFF Cnt:0
```

clk_isp: ISP-Taktfrequenz.

Interrupt: MIPI-Interrupt sowie Interrupts der einzelnen ISP-Module. Steigende Zähler zeigen Dateneingang zum ISP an. ErrCnt zählt Fehlerinterrupts.

Input: Eingangsquelle, Eingabeformat, Auflösung und Beschnittinformationen.

Isp read: mode ist one oder hdr2/3; frame ist die Sequenznummer; rate das Bildintervall; idle/working der ISP-Betriebszustand; time die Hardwareverarbeitungszeit des ISP. cnt zählt Rücklesevorgänge insgesamt sowie mit einem, zwei oder drei Durchläufen.

Output: Ausgabeziel, Ausgabeformat, Auflösung; frame ist die Sequenznummer, rate das Bildintervall.

Other: Aktivierungszustand der einzelnen ISP-Module.

Monitor: Fehlererkennung und Rücksetzen.

```text
  [root@RV1126_RV1109:/]# cat /proc/rkisp*
  rkispp-vir0 Version:v01.06.00
  clk_ispp   350000000
  aclk_ispp  500000000
  hclk_ispp  250000000
  Interrupt  Cnt:79532 ErrCnt:0
  Input      rkisp0 Format:FBC420 Size:2688x1520 (frame:26510 rate:32ms delay:13ms)
  Output     rkispp_m_bypass Format:NV12 Size:2688x1520 (frame:26509 rate:32ms
  delay:30ms)
  TNR        ON(0xf00000f) (mode: 3to1) (global gain: disable) (frame:26510
  time:8ms idle) CNT:0x0 STATE:0x1e000000
  NR         ON(0x57) (external gain: enable) (frame:26510 time:6ms working)
  0x5f0:0x19 0x5f4:0x780f
  SHARP      ON(0x19) (YNR input filter: ON) (local ratio: OFF) 0x630:0x19
  FEC        OFF(0x2) (frame:0 time:0ms idle) 0xc90:0x0
  ORB        OFF(0x0)
  Monitor    ON Cnt:0
```

clk_ispp: ISPP-Taktfrequenz.

Interrupt: Verarbeitungsinterrupts von ISPP. Steigende Zähler zeigen Dateneingang an; ErrCnt zählt Fehlerinterrupts.

Input: Eingangsquelle, Eingabeformat, Auflösung; frame ist die Sequenznummer, rate das Bildintervall, delay die Differenz zwischen Eingangsbildzeit und MIPI-Bildzeit.

Output: Ausgabeziel, Ausgabeformat, Auflösung; frame ist die Sequenznummer, rate das Bildintervall, delay die Differenz zwischen Ausgabe- und MIPI-Bildzeit. Letztere hängt auch vom Ausgabebildpuffer ab.

Other: Aktivierungszustand der einzelnen ISPP-Module; frame ist die Sequenznummer, time die Hardwareverarbeitungszeit des Moduls, idle/working dessen Betriebszustand.

Monitor: Fehlererkennung und Rücksetzen.

```text
  [root@RV1126_RV1109:/]# cat /proc/rkcif_mipi_lvds
  Driver Version:v00.01.0a
  Work Mode:ping pong
  Monitor Mode:idle
  aclk_cif:500000000
  hclk_cif:250000000
  dclk_cif:297000000
  Input Info:
          src subdev:m01_f_os04a10 1-0036-1
          interface:mipi csi2
          lanes:4
          vc channel: 0 1
          hdr mode: hdr_x2
          format:SBGGR10_1X10/2688x1520@30
          crop.bounds:(0, 0)/2688x1520
  Output Info:
          format:BG10/2688x1520(0,0)
          compact:enable
          frame amount:264
          early:10 ms
          single readout:30 ms
          total readout:30 ms
          rate:33 ms
          fps:30
          irq statistics:
                          total:515
                          csi over flow:0
                          csi bandwidth lack:0
                          all err count:0
                          frame dma end:515
```

Work Mode: Nach RV1109 wird standardmäßig Ping-Pong verwendet; dieser Modus wird empfohlen.

Monitor Mode: Überwachungsmodus. Ist er aktiviert und erkennt MIPI einen Fehler, wird VICAP zurückgesetzt.

Input Info: Zusammenfassung der Eingangsinformationen.

src subdev: Eingabegerät, üblicherweise der Sensor. Enthält Kameraausrichtung, Index, Gerätename, I2C-Bus, 7-Bit-Slave-Adresse und weitere Informationen.

interface: Physische Datenschnittstelle, etwa MIPI, LVDS oder DVP.

vc channel: Tatsächlich verwendeter virtueller Kanal der Mehrkanalübertragung im MIPI-Protokoll.

hdr mode: Sensorbetriebsmodus normal, hdr_x2 oder hdr_x3.

format: Eingabedatentyp.

crop.bounds: Beschnittparameter lassen sich in .get_selection des Sensortreibers konfigurieren, um die Eingangsdaten passend zu beschneiden.

Output Info: Zusammenfassung der Ausgabeinformationen.

format: Ausgabedatentyp.

compact: Standardmäßig kompakte Ausgabe. Definitionen siehe „Vom CIS ausgegebene RAW- und YUV-Daten erfassen“.

**Bildzeitangaben (frame amount):**

early: Im Wake-up-Modus wird der Puffer bereits nach Erfassung von wait_line Zeilen vorzeitig zur Verarbeitung an den ISP übergeben. Standardmäßig geschieht dies erst nach Erfassung des vollständigen Bildes. early bezeichnet die dadurch vor Abschluss des vollständigen Bildes gewonnene Zeit. Die Konfiguration des Wake-up-Modus beschreibt der RV1109/RV1126-Leitfaden zur Latenzoptimierung.

single readout: Im HDR-Modus ist die Übertragungszeit eines Einzelbildes diejenige des langen Bildes.

total readout: Im HDR-Modus bezeichnet die Zeit zwischen Beginn der Übertragung des langen Bildes und Ende der Übertragung des kurzen Bildes die ursprüngliche Übertragungszeit eines zusammengeführten Bildes.

rate: Bildintervall.

fps: Bildrate.

irq statistics: Interruptinformationen.

total: Gesamtzahl der Interrupts einschließlich Bildende und Fehlern.

csi over flow: Anzahl der Überlaufinterrupts.

csi bandwidth lack: Anzahl der Interrupts wegen unzureichender Bandbreite.

frame dma end: Anzahl der Bildende-Interrupts; sie entspricht der Zahl der seit Streamstart vom Sensor ausgegebenen Bilder.

### 19.12 Flimmerprobleme untersuchen

Zur Untersuchung von Flimmern zunächst dessen Ursprung bestimmen. Dafür kann das AE-Protokoll ausgewertet werden.

Die Ausgabe des AE-Protokolls wird wie folgt aktiviert:

1、Im Terminal (serielle Konsole oder adb shell) ausführen: export persist_camera_engine_log=0x1ff3

2、librkaiq.so im selben Terminal wie in Schritt 1 über Programme wie rkisp_demo oder RkLunch.sh ausführen.

3、Wird nach Schritt 1 und 2 weiterhin kein AE-Protokoll ausgegeben, wurde die Protokollierung möglicherweise bei der Standardkompilierung nicht eingebunden. Dann folgende Änderung berücksichtigen:

```text
  czf@ISP:~/rk356x_sdk/external/camera_engine_rkaiq$ git diff
  diff --git a/CMakeLists.txt b/CMakeLists.txt
  index 46fba20..f5ea67f 100755
  --- a/CMakeLists.txt
  +++ b/CMakeLists.txt
  @ -6,9 +6,9 @ if(NOT CMAKE_BUILD_TYPE)
  FORCE)
  endif()
  -if(NOT CMAKE_BUILD_TYPE STREQUAL "Release")
  #if(NOT CMAKE_BUILD_TYPE STREQUAL "Release")
  add_definitions(-DBUILD_TYPE_DEBUG)
  -endif()
  #endif()
```

Das AE-Protokoll enthält unter anderem MeanLuma (Helligkeitsstatistik), TmoMeanLuma (Helligkeitsstatistik nach TMO) und Belichtungsparameter. Anhand dieser Angaben lässt sich die Flimmerursache vorläufig untersuchen.

![Beispiel eines AE-Belichtungsprotokolls — englische Originalabbildung, PDF-Seite 217](/docs/rockchip-isp30-vi-driver/assets/en-p217-X940.png)

*Beispiel eines AE-Belichtungsprotokolls — englische Originalabbildung, PDF-Seite 217*

Editierbare Transkription des Screenshots (Mittelpunkte stellen angezeigte Leerzeichen dar).

```text
[AEC]:XCAM·DEBUG·rk_aiq_ae_algo.cpp:7028:==================================HDR-AE·(enter)===============================
[AEC]:XCAM·DEBUG·rk_aiq_ae_algo.cpp:7049:·AecRun:·SMeanLuma=0.280734,·MMeanLuma=4.009174,LMeanLuma=0.000000,TmoMeanLuma=6.188991,Isconverged=0,Longfrm=0
[AEC]:XCAM·DEBUG·rk_aiq_ae_algo.cpp:7058:·>>>·Framenum=5·Cur·Piris=128,·sgain=1.000000,Stime=0.000505,mgain=1.000000,mtime=0.003005,lgain=1.000000,ltime=0.003000
[AEC]:XCAM·DEBUG·rk_aiq_ae_algo.cpp:3887:·S-HighLightLuma=16.500000,S-Target=110.000000,S-GlobalLuma=0.280734,S-Target=15.662778
[AEC]:XCAM·DEBUG·rk_aiq_ae_algo.cpp:4264:·T-LowLightLuma=3.848156,T-Target=50.000000,L-GlobalLuma=4.009174,L-Target=75.000000
[AEC]:XCAM·DEBUG·rk_aiq_ae_algo.cpp:5725:·AecHdrClmExecute:·sgain=1.000000,stime=0.002510,mgain=2.148907,mtime=0.020000,lgain=0.000000,ltime=0.000000
[AEC]:XCAM·DEBUG·rk_aiq_ae_algo.cpp:7162:·calc·result:·piris=128,sgain=1.000000,stime=0.002514,mgain=2.137962,mtime=0.020000,lgain=0.000000,ltime=0.000000
[AEC]:XCAM·DEBUG·rk_aiq_ae_algo.cpp:7166:==================================(exit)===============================
```

Analyse des Flimmerns:

1\. Durch die TMO-Zusammenführung verursachtes Flimmern zeigt die folgende Abbildung. Nach Filterung des Protokolls ist erkennbar, dass die Statistikwerte des kurzen und mittleren Bildes stabil bleiben; im Zwei-Bild-Modus entspricht der Statistikwert des mittleren Bildes dem des langen Bildes. Der Statistikwert nach TMO springt hingegen. Dies weist darauf hin, dass die betreffenden TMO-Parameter für bestimmte Szenarien ungeeignet sind. Die Parameter anhand des Tuning-Leitfadens anpassen. Bleibt das Problem bestehen, Unterstützung durch einen RK-IQ-Ingenieur anfordern.

![Protokollbeispiel für einen TMO-Helligkeitssprung — englische Originalabbildung, PDF-Seite 217](/docs/rockchip-isp30-vi-driver/assets/en-p217-X941.png)

*Protokollbeispiel für einen TMO-Helligkeitssprung — englische Originalabbildung, PDF-Seite 217*

Editierbare Transkription des Screenshots (Mittelpunkte stellen angezeigte Leerzeichen dar).

```text
AecRun: SMeanLuma=3.642202, MMeanLuma=59.557796,LMeanLuma=0.000000,TmoMeanLuma=46.662384,Isconverged=1,Longfrm=0
AecRun: SMeanLuma=3.638532, MMeanLuma=59.590824,LMeanLuma=0.000000,TmoMeanLuma=46.708256,Isconverged=1,Longfrm=0
AecRun: SMeanLuma=3.644037, MMeanLuma=59.631191,LMeanLuma=0.000000,TmoMeanLuma=46.691742,Isconverged=1,Longfrm=0
AecRun: SMeanLuma=3.642202, MMeanLuma=59.647705,LMeanLuma=0.000000,TmoMeanLuma=46.713760,Isconverged=1,Longfrm=0
AecRun: SMeanLuma=3.638532, MMeanLuma=59.598164,LMeanLuma=0.000000,TmoMeanLuma=64.000000,Isconverged=1,Longfrm=0
AecRun: SMeanLuma=3.640367, MMeanLuma=59.543118,LMeanLuma=0.000000,TmoMeanLuma=46.702751,Isconverged=1,Longfrm=0
AecRun: SMeanLuma=3.644037, MMeanLuma=59.620182,LMeanLuma=0.000000,TmoMeanLuma=46.719265,Isconverged=1,Longfrm=0
AecRun: SMeanLuma=3.631193, MMeanLuma=59.620182,LMeanLuma=0.000000,TmoMeanLuma=46.746788,Isconverged=1,Longfrm=0
```

2\. Sind sowohl die RAW-Statistikwerte als auch die Werte nach TMO sehr stabil, während auf dem Bildschirm weiterhin Flimmern sichtbar ist, liegt die Ursache in nachfolgenden ISP-Modulen. Nach dieser Eingrenzung einen RK-Ingenieur um weitere Analyse bitten.

3\. Tritt Flimmern auf, wenn sich Belichtungszeit und Verstärkung gleichzeitig ändern, kann die Konfiguration ihres Wirksamkeitszeitpunkts falsch sein. Die Belichtungszeit eines Sensors wird normalerweise bei n+2 wirksam; bei der Verstärkung sind n+2 und n+1 häufig. Sind diese Wirksamkeitsbilder bekannt, die entsprechenden Parameter in der IQ-Datei zum Test eintragen. Nachfolgend ist die XML-Version beschrieben. Der Wert 2 bedeutet Wirksamkeit bei n+2; n bezeichnet das Bild, an dessen Anfang die Belichtungsparameter gesetzt werden. Die Parameter der JSON-Version sind ähnlich und müssen anhand der Dokumentation konfiguriert werden.

```text
  <EXP_DELAY index="1" type="struct" size="[1 1]">
         <Normal index="1" type="struct" size="[1 1]">
              <time_delay index="1" type="double" size="[1 1]">
              [2 ]
          </time_delay>
              <gain_delay index="1" type="double" size="[1 1]">
              [2 ]
          </gain_delay>
              <dcg_delay index="1" type="double" size="[1 1]">
              [1 ]
          </dcg_delay>
        </Normal>
        <Hdr index="1" type="struct" size="[1 1]">
           <time_delay index="1" type="double" size="[1 1]">
              [2]
           </time_delay>
           <gain_delay index="1" type="double" size="[1 1]">
              [2]
           </gain_delay>
           <dcg_delay index="1" type="double" size="[1 1]">
              [1]
           </dcg_delay>
        </Hdr>
  </EXP_DELAY>
```

Ist das Wirksamkeitsbild unbekannt, kann der Knoten AecSyncTest im AE-Modul der IQ-Datei für einen Test verwendet werden. Das Modul wechselt nach einer festgelegten Bildanzahl zwischen zwei Sätzen von Belichtungsparametern. Für beide Sätze dieselbe Belichtungszeit, aber unterschiedliche Verstärkungen einstellen. Anschließend die MeanLuma-Statistikwerte des AE-Protokolls zusammen mit den zugehörigen Zeit- und Verstärkungswerten auswerten.

4\. Bleibt beim Flimmern die Belichtungszeit stabil, während der Verstärkungswert zurückgeregelt wird, kann ein Problem mit der Umrechnungsformel der Verstärkung oder eine schlechte Linearität des Sensors selbst vorliegen.

4.1 Die Umrechnungsformel hängt von den Umrechnungsvorgaben des Sensors und der Treiberimplementierung ab. Einzelheiten stehen im Leitfaden zum Ausfüllen der Sensorinformationen. Die Zeit- und Verstärkungswerte des AE-Protokolls selbst in Registerwerte umrechnen und mit den vom Treiber ausgegebenen Werten vergleichen. Stimmen die selbst berechneten und programmseitig ermittelten Registerwerte nicht überein, Umrechnungsformel und Treiber auf Fehler prüfen.

4.2 Zur Prüfung der Linearität RAW-Bilder erfassen und mit einem Bildbetrachter deren Statistikwerte ermitteln.

4.2.1 Linearität der Belichtungszeit testen:

a. Mit Mattglas abdecken; ersatzweise kann dünnes Papiertuch verwendet werden. Es soll das gesamte Bild im linearen Bereich gleichmäßig beleuchten. Die Verstärkung auf 1 fixieren und RAW-Bilder mit 10ms, 20ms und 30ms erfassen. Die Statistikwerte ermitteln und tabellarisch festhalten; übliche Software liefert 8bit-Werte im Bereich 0~255.

b. Das Objektiv vollständig abdunkeln und ein RAW-Bild erfassen. Dessen Statistikwert ist der Schwarzwert. Da hier keine hohe Genauigkeit verlangt wird, sind Belichtungszeit und Verstärkung nicht streng vorgegeben; extreme Unterschiede sind jedoch zu vermeiden. Beispielsweise würde ein Test bei 1x Verstärkung und eine Schwarzwertaufnahme bei 1000x die Statistikwerte beeinflussen und ist daher ungeeignet.

c. In der Tabelle den Schwarzwert aus Schritt b von den Statistikwerten aus Schritt a abziehen. Die korrigierten Statistikwerte gegen die Belichtungszeit als Liniendiagramm darstellen. Ergibt sich eine Gerade oder annähernd eine Gerade, kann die Linearität als gut gelten.

Hinweis:

1\. Der Treiber enthält supported_modes. In der Konfigurationstabelle stehen vts_def (Bildlänge in der Standardkonfiguration einschließlich vertikaler Austastung) und die Bildrate. Damit lässt sich die Belichtungszeit einfach umrechnen. Bei 30fps und vts_def = 1200 beträgt das Bildintervall 1s/30fps=33.333ms. Für 10ms ergeben sich 10/33.333*1200=360 Belichtungszeilen. Die Einstellung der Belichtungsparameter beschreibt der Abschnitt zur Einstellung der CIS-Belichtungsparameter.

2\. Der Statistikwert des in Schritt a erfassten RAW-Bildes muss größer als der Schwarzwert und kleiner als 180 sein.

4.2.2 Linearität der Verstärkung

a. Mit Mattglas abdecken und die Belichtungszeit auf 10ms fixieren. RAW-Bilder bei Verstärkungen wie 1x, 2x, 4x und 8x erfassen, ihre Statistikwerte ermitteln und tabellarisch festhalten. Übliche Software liefert 8bit-Werte im Bereich 0~255. Liegen die Statistikwerte bei bestimmten Verstärkungen nicht unter 180, die Belichtungszeit anpassen und den Test abschnittsweise durchführen.

b. Das Objektiv vollständig abdunkeln und ein RAW-Bild erfassen. Dessen Statistikwert ist der Schwarzwert. Da hier keine hohe Genauigkeit verlangt wird, sind Belichtungszeit und Verstärkung nicht streng vorgegeben; extreme Unterschiede sind jedoch zu vermeiden. Beispielsweise würde ein Test bei 1x Verstärkung und eine Schwarzwertaufnahme bei 1000x die Statistikwerte beeinflussen und ist daher ungeeignet.

Wert. [Isoliertes Wort in der Vorlage.]

c. In der Tabelle den Schwarzwert aus Schritt b von den Statistikwerten aus Schritt a abziehen. Die korrigierten Statistikwerte gegen die Belichtungszeit als Liniendiagramm darstellen. Ergibt sich eine Gerade oder annähernd eine Gerade, kann die Linearität als gut gelten.

Ein Liniendiagramm der um den Schwarzwert korrigierten Statistikwerte gegen die Verstärkung erstellen. Eine Gerade oder annähernde Gerade bedeutet gute Linearität. [Die Vorlage nennt im vorherigen Absatz noch die Belichtungszeit und präzisiert hier die Verstärkung.]

Hinweis:

1\. Der Statistikwert des in Schritt a erfassten RAW-Bildes muss größer als der Schwarzwert und kleiner als 180 sein.

2\. Wird bei einem bestimmten Verstärkungswert ein Linearitätsproblem vermutet, kann dieser Bereich separat getestet werden; ein Test des gesamten Verstärkungsbereichs ist nicht erforderlich.

5\. In sehr heller Umgebung, etwa bei starker Sonneneinstrahlung im Freien, kann Flimmern durch ein Problem bei der Umrechnung des Belichtungswerts in Registerwerte entstehen. Erwartet die Anwendung beispielsweise 5 Zeilen, während nach der Registerumrechnung tatsächlich nur 4 Zeilen wirksam sind, entsteht eine Helligkeitsabweichung von einer Zeile. Bei starkem Außenlicht genügt dies leicht für sichtbares Flimmern. Die Treiberimplementierung sorgfältig mit der Beschreibung der Belichtungsberechnung im Sensorhandbuch abgleichen.

### 19.13 Violette Überstrahlung an Lichtquellen untersuchen

1\. Linearer Modus

Erscheint eine Lichtquelle im linearen Modus violett, kann ein unzulässiger Sensor-Verstärkungswert das Bild verfälschen. Prüfen, ob der vom Treiber umgerechnete Verstärkungsregisterwert die im Sensorhandbuch beschriebenen Einschränkungen erfüllt.

2\. HDR-Modus

Im HDR-Modus gibt es hauptsächlich die folgenden zwei Ursachen:

2.1 Ein Versatz des kurzen Bildes führt zu einer fehlerhaften Ausrichtung bei der HDR-Zusammenführung. Zunächst das Kernel-Protokoll auf MIPI-Fehler prüfen. Falls keine vorhanden sind, die an den Sensor übergebenen Belichtungsparameter prüfen. HDR-Sensoren haben üblicherweise zusätzliche Einschränkungen für lange und kurze Belichtungen; siehe den Leitfaden zum Ausfüllen der Sensorinformationen. Die vom Treiber in den Sensor geschriebenen Registerwerte ausgeben und mit den Einschränkungen im Sensorhandbuch vergleichen.

2.2 Das Verhältnis der Belichtungsparameter von langem und kurzem Bild stimmt nicht mit dem tatsächlich wirksamen Verhältnis überein. Wie unter 2.1 die Parameterumrechnung prüfen. Häufig begrenzt der Sensor die maximale Belichtung des kurzen Bildes. Angenommen, sie beträgt 2ms, aber in den Sensorinformationen und AEC-Parametern der IQ-Datei fehlt diese Begrenzung oder sie ist höher als die Treibergrenze eingestellt. AEC kann dann beispielsweise eine kurze Belichtung von 3ms berechnen. Der Treiber setzt tatsächlich höchstens 2ms, meldet AEC jedoch keinen Fehler. AEC hält 3ms für erfolgreich eingestellt und übergibt diese Parameter an TMO. Das führt zu einem falschen Verhältnis und einer falschen Helligkeit des zusammengeführten Bildes. Kurze Bilder werden normalerweise in überbelichteten Bereichen verwendet, weshalb das Problem häufig an Lichtquellen als violette Verfärbung sichtbar wird.

Bei violetten Lichtquellen ist daher vor allem zu prüfen, ob die von AEC berechneten Belichtungsparameter von den tatsächlich im Sensor eingestellten Parametern abweichen.

### 19.14 Leitfaden zum Ausfüllen der Sensorinformationen

Beispiel imx290:

```text
[imx290]
CISAgainRange=1 31.6
CISDgainRange=1 125.89
```

Reicht die Helligkeit bei alleiniger analoger Verstärkung (again) nicht aus, wird üblicherweise digitale Verstärkung (dgain) zur Kompensation verwendet. RK übermittelt normalerweise dgain und again gemeinsam. Der Treiber trennt beide anschließend und schreibt sie in die entsprechenden Sensorregister;

Das Imx290-Handbuch beschreibt die Aufteilung der Verstärkungswerte wie folgt:

0dB bis 30 dB: analoge Verstärkung 30 dB, Schrittweite 0.3dB

30.3 dB bis 72 dB: analoge Verstärkung 30dB + digitale Verstärkung 0.3 bis 42dB, Schrittweite 0.3dB

Also again 30dB und dgain 42dB.

Nach der Formel:

```text
db = 20 * log10(gain multiple format)
reg_gain = 20 * log10(gain multiple forma) * 10 / 3
```

Als Verstärkungsfaktor berechnet: again = 10^(30db/20)=31.6 x

```text
        Dgain = 10^(42db/20) = 125.89 x
CISExtraAgainRange=2 63.2
```

CISExtraAgainRange ist der Wertebereich von again * dcg ratio. Einige Sensoren unterstützen HCG/LCG. HCG ermöglicht in dunkler Umgebung ein besseres Signal-Rausch-Verhältnis. Wenn der Treiber die zugehörigen Funktionen implementiert, ist hier der entsprechende Umwandlungsverstärkungswert einzutragen. Im Imx290-Handbuch beträgt das typische Verhältnis der Umwandlungseffizienzen 2: Bei 2x again und aktiviertem HCG ergibt sich tatsächlich 4x Verstärkung. Somit gilt CISExtraAgainRange=2*[1 31.6]. Implementiert der Treiber HCG/LCG nicht, standardmäßig [1 1] eintragen.

```text
CISIspDgainRange=1 1
```

ISP dgain: derzeit nicht verwendet; den Standardwert beibehalten.

```text
CISMinFps=10
```

Minimal zulässige Bildrate: Soll die Bildrate auf 5fps abgesenkt werden und unterstützt der Sensor dies, muss auch dieser Wert auf 5 geändert werden, bevor die Absenkung über IQ-Konfiguration oder API möglich ist.

```text
CISTimeRegMin=1
```

Kleinste Belichtungszeileneinheit im linearen Modus; Einzelheiten stehen im Sensorhandbuch.

```text
CISLinTimeRegMaxFac=1.00 2.00
```

Maximale Belichtungszeilenzahl im linearen Modus; Einzelheiten stehen im Sensorhandbuch.

```text
CISTimeRegOdevity=1 0
```

Gerade/ungerade Schrittweite der Belichtungszeilen im linearen Modus: Laut Sensorhandbuch kann shs1 um eins erhöht werden; entsprechend kann auch die Belichtungszeilenzahl um eins steigen.

Das Imx290-Handbuch beschreibt: Integrationszeit = 1 Bildperiode - (SHS1 + 1) X(1H-Periode).

Das RK-Framework übermittelt die Belichtung von AIQ an den Treiber derzeit in Zeilenzeiteinheiten. Verwendet ein Sensor halbe Zeilen als Einheit, muss in ganze Zeileneinheiten umgerechnet werden. Die Imx290-Formel verwendet ganze Zeilen. Für Belichtungszeilen lautet sie: time_lines = vts -shs1 - 1

Laut Sensorhandbuch ist shs1 auf 1~(Zeilenzahl pro Bild - 2), also 1~（vts-2）, beschränkt.

Damit gilt CISTimeRegMin = vts -shs1 - 1 = vts -（vts-2）- 1 = 1.

```text
CISLinTimeRegMaxFac = vts - shs1 - 1 = vts - 1 - 1 = vts - 2
```

Vts ist die Gesamtzahl der Zeilen eines Bildes einschließlich vertikaler Austastung. Die Handbücher verwenden leicht unterschiedliche Begriffe: „1 frame period“ und „Number of lines per frame“ beschreiben beide vts.

```text
CISHdrTimeRegMin=1
```

Minimale HDR-Belichtungszeilenzahl; Einzelheiten stehen im Sensorhandbuch.

```text
CISHdrTimeRegMax=8 0 0
```

Maximale HDR-Belichtungszeilenzahl. Dieser Parameter wurde ergänzt, weil manche Sensoren die Belichtungszeilenzahl kurzer Bilder begrenzen. Sie lässt sich dann weder durch Verkürzen der langen Belichtung noch durch Senken der Bildrate erhöhen. Imx290 ist ein solcher Sensor. Nach Sonys Standardkonfiguration beträgt die maximale kurze Belichtung 8 Zeilen. Das Imx307-DOL-Dokument beschreibt einen Modus mit verringertem Belichtungsverhältnis; dessen Konfiguration erlaubt höchstens 222 kurze Belichtungszeilen. Im Imx290-DOL-Dokument wurde keine entsprechende Beschreibung gefunden. Einzelheiten sind mit Sony zu klären.

```text
CISHdrTimeRegOdevity=1.00 0.00
CISHdrTimeRegSumFac=1.00 6.00
```

Das Sony-DOL-Dokument enthält folgende Angaben:

![DOL-Einstellungen für zwei Bilder und Belichtungsformeln — englische Originalabbildung, PDF-Seite 222](/docs/rockchip-isp30-vi-driver/assets/en-p222-X957.png)

*DOL-Einstellungen für zwei Bilder und Belichtungsformeln — englische Originalabbildung, PDF-Seite 222*

| Eintrag | Symbol | Einstellregister | Einstellwert / Bedingung |
| --- | --- | --- | --- |
| Anzahl der Bilder im Satz | FSC | VMAX | VMAX × 2 |
| Verschlusszeitpunkt von SEF1 | SHS1 | SHS1 | mindestens 2 und höchstens RHS1 - 2 |
| Auslesezeitpunkt von SEF1 | RHS1 | RHS1 | 2n+5 (n = 0, 1, 2 …) und RHS1 ≤ FSC - BRL × 2 - 21 |
| Verschlusszeitpunkt von LEF | SHS2 | SHS2 | mindestens RHS1 + 2 und höchstens FSC - 2 |

| Eintrag | Symbol | Formel | Einheit | Anmerkungen |
| --- | --- | --- | --- | --- |
| LEF-Belichtungszeit | t_LEF | FSC - (SHS2 + 1) | H | - |
| SEF1-Belichtungszeit | t_SEF1 | RHS1 - (SHS1 + 1) | H | - |
| Belichtungsverhältnis | - | t_LEF / t_SEF1 | - | Zusammenführung von 2 Bildern |

CISHdrTimeRegMin：

Die minimale lange Belichtung lässt sich anhand der Tabelle berechnen:

Lange Belichtung = FSC-SHS2-1=FSC-(FSC-2)-1=1

Kurze Belichtung = RHS1-SHS1-1=RHS1-(SHS1-2)-1=1

Damit beträgt die minimale HDR-Belichtungszeilenzahl 1.

CISHdrTimeRegOdevity: Die Tabelle nennt für shs1 und shs2 keine Einschränkungen wie 2n oder 2n+1; daher kann die entsprechende Belichtungszeilenzahl jeweils um 1 erhöht werden.

CISHdrTimeRegSumFac：

Summe der langen und kurzen Belichtung =（FSC-SHS2-1）+ （RHS1-SHS1-1）

SHS2 und SHS1 nehmen gleichzeitig ihre Minimalwerte an, um sowohl die lange als auch die kurze Belichtung zu maximieren.

Summe der langen und kurzen Belichtung =（FSC-（RHS1+2）-1）+ （RHS1-2-1）=FSC-6

Bei DOL-HDR mit 2 Bildern gilt FSC=2vts; somit beträgt die maximale Summe aus langer und kurzer Belichtung 2vts-6.

Daraus ergibt sich CISHdrTimeRegSumFac=[2 6]. Zur einfacheren Berechnung übermittelt Sonys DOL-HDR-Treiber jedoch FSC als vts an AEC. Das übermittelte vts ist damit bereits verdoppelt, sodass CISHdrTimeRegSumFac= [1 6] gilt.

```text
CISTimeRegUnEqualEn=1
```

Gibt an, ob lange und kurze Belichtungszeit gleich sein dürfen. Wegen der Begrenzung der kurzen Belichtung beim imx290 dürfen sie in keinem Fall gleich sein.

```text
CISHdrGainIndSetEn=1
```

Gibt an, ob die Verstärkung von langem und kurzem Bild identisch sein muss. 1 erlaubt unterschiedliche Werte; 0 verlangt gleiche Werte. Einzelheiten stehen im Sensorhandbuch. Einige Sensoren teilen einen Registersatz für beide Bilder. Andere besitzen getrennte Verstärkungsregister, deren Werte aus Konstruktionsgründen dennoch gleich sein müssen. Für eine korrekte Belichtungszerlegung muss dieser Parameter genau ausgefüllt werden.

Hinweise:

Beim imx290 auf die Einstellung von FPGC PFGC_1 achten; das DOL-Dokument enthält die genaue Beschreibung.

```text
FullResolution=1920x1080
GainRange=1 2 20 20 1 0 20 2 4 10 0 1 20 40 4 8 5 -20 1 40 60 8 16 2.5 -40 1 60 80 16 32 1.25 -60 1 80 100 32 64 0.625 -80 1 100 120 64 128 0.3125 -100 1 120 140 128 256 0.15625 -120 1 140 160 256 512 0.078125 -140 1 160 180 512 1024 0.0390625 -160 1 180 200
IsLinear=0
```

Die RK-Plattform unterstützt Verstärkungsangaben als Faktor und im Sony-dB-Modus. 0 wählt dB. Beim imx290 kann der dB-Modus direkt oder die oben genannte GainRange-Zerlegungsformel verwendet werden. Letztere erzeugt einen kleinen Fehler, da eine nichtlineare Kurve durch mehrere lineare Abschnitte angenähert wird.

```text
NonLinear=DB_MODE
PatternMode=RGGB
TimeFactor=0 0 1 0.5
```

Formel zur Zerlegung der Belichtungszeit: Es wird empfohlen, diese Formel beizubehalten. Passt die Berechnung nicht dazu, soll der Sensortreiber die Umrechnung vornehmen.

```text
hdr_dcg_ratio=2
normal_dcg_ratio=2
```

Dcg ratio wurde bereits oben beschrieben.

```text
SensorFlip=0
```

Standardzustand für Spiegelung und Umkehrung: bit0 mirror, bit1 flip.

## 20. Anhang A: V4L2-Control-Liste des CIS-Treibers

<!-- Source: English PDF p224, table unit 1960 -->

| CID | Beschreibung |
| --- | --- |
| V4L2_CID_VBLANK | Vertikale Austastung: Ruhephase nach jedem Bild ohne erzeugte Bilddaten. Einheit ist eine Zeile. Deren Länge entspricht Bildbreite plus horizontaler Austastung bei der durch V4L2_CID_PIXEL_RATE desselben Subdevices definierten Pixelrate. |
| V4L2_CID_HBLANK | Horizontale Austastung: Ruhephase nach jeder Bilddatenzeile ohne erzeugte Bilddaten. Einheit ist Pixel. |
| V4L2_CID_EXPOSURE | Bestimmt die Belichtungszeit des Kamerasensors; diese ist durch das Bildintervall begrenzt. |
| V4L2_CID_ANALOGUE_GAIN | Analoge Verstärkung aller Farbkomponenten der Pixelmatrix. Die Verstärkung erfolgt im analogen Bereich vor der A/D-Wandlung. |
| V4L2_CID_PIXEL_RATE | Pixelrate an den Source-Pads des Subdevices. Dieses Control ist schreibgeschützt; Einheit: Pixel / Sekunde. Beispiel MIPI-Bus: pixel_rate = link_freq * 2 * nr_of_lanes / bits_per_sample |
| V4L2_CID_LINK_FREQ | Datenbusfrequenz. Zusammen mit Media-Bus-Pixelcode und Bustyp (Taktzyklen pro Abtastwert) bestimmt sie die Pixelrate V4L2_CID_PIXEL_RATE im Pixelarray oder gegebenenfalls anderswo bei Geräten ohne Bildsensor. Aus Pixeltakt, Bildbreite/-höhe und horizontaler/vertikaler Austastung lässt sich die Bildrate berechnen. Die Pixelratensteuerung kann auch außerhalb des Subdevices mit dem Pixelarray definiert sein; daraus allein ist jedoch keine Bildrate ableitbar. Nur im Pixelarray dürfen horizontale und vertikale Austastinformationen als exakt gelten, da dort keine weitere Austastung zulässig ist. Die Bildrate wird durch Auswahl der horizontalen und vertikalen Austastung eingestellt. Einheit: Hz. |

## 21. Anhang B: MEDIA_BUS_FMT-Tabelle

<!-- Source: English PDF p225, table unit 1962 -->

| CIS-Sensortyp | Sensorausgabeformat |
| --- | --- |
| Bayer RAW | MEDIA_BUS_FMT_SBGGR10_1X10 MEDIA_BUS_FMT_SRGGB10_1X10 MEDIA_BUS_FMT_SGBRG10_1X10 MEDIA_BUS_FMT_SGRBG10_1X10 MEDIA_BUS_FMT_SRGGB12_1X12 MEDIA_BUS_FMT_SBGGR12_1X12 MEDIA_BUS_FMT_SGBRG12_1X12 MEDIA_BUS_FMT_SGRBG12_1X12 MEDIA_BUS_FMT_SRGGB8_1X8 MEDIA_BUS_FMT_SBGGR8_1X8 MEDIA_BUS_FMT_SGBRG8_1X8 MEDIA_BUS_FMT_SGRBG8_1X8 |
| YUV | MEDIA_BUS_FMT_YUYV8_2X8 MEDIA_BUS_FMT_YVYU8_2X8 MEDIA_BUS_FMT_UYVY8_2X8 MEDIA_BUS_FMT_VYUY8_2X8 MEDIA_BUS_FMT_YUYV10_2X10 MEDIA_BUS_FMT_YVYU10_2X10 MEDIA_BUS_FMT_UYVY10_2X10 MEDIA_BUS_FMT_VYUY10_2X10 MEDIA_BUS_FMT_YUYV12_2X12 MEDIA_BUS_FMT_YVYU12_2X12 MEDIA_BUS_FMT_UYVY12_2X12 MEDIA_BUS_FMT_VYUY12_2X12 |
| Nur Y (Schwarzweiß), RAW-BW-Sensor | MEDIA_BUS_FMT_Y8_1X8 MEDIA_BUS_FMT_Y10_1X10 MEDIA_BUS_FMT_Y12_1X12 |

## 22. Anhang C: Liste der CIS-Referenztreiber

<!-- English PDF p226; continuation p227 follows. -->

| CIS-Schnittstelle | Ausgabetyp | Vollbild / Halbbild | Referenztreiber |
| --- | --- | --- | --- |
| MIPI | Bayer RAW | Vollbild | 0.3M: ov7750.c, gc0403.c<br>0.9M jx_h62.c<br>1.2M ov9750.c jx-h65.c<br>2M ov2685.c ov2680.c ov2735.c ov02g10.c ov02b10.c gc2385.c gc2355.c gc2053.c sc2232.c sc2239.c sc223a sc210iot.c sp250a.c<br>4M gc4c33.c jx_k04.c os04c10.c sc401ai.c<br>5M ov5695.c ov5648.c ov5670.c gc5024.c gc5025.c gc5035.c hm5040.c sc5239.c hynix_hi556.c<br>8M ov8858.c |

<!-- Source: English PDF p227, table unit 1973 -->

| CIS-Datenschnittstelle | CIS-Ausgabedatentyp | Vollbild/Halbbild | Referenztreiber |
| --- | --- | --- | --- |
|  |  |  | os08a10.c os08a20.c sc8220 imx378.c imx317.c imx219.c gc8034.c hynix_hi846.c s5kgm1sp.c s5k4h7yx.c 13M ov13850.c ov13b10.c imx258.c ov12d2q.c |
| MIPI | Bayer raw hdr | Vollbild | 2M imx307.c imx327.c imx462.c gc2093.c ov02k10 ov2718.c sc200ai.c sc2310.c jx-f37.c 4M ov4689.c os04a10.c imx347.c imx464.c sc4238.c 5M imx335.c os05a20.c sc500ai.c 8M imx334.c imx415.c |
| MIPI | YUV | Vollbild | 2M<br>gc2145.c |

<!-- Source: English PDF p228, table unit 1974 -->

| CIS-Datenschnittstelle | CIS-Ausgabedatentyp | Vollbild/Halbbild | Referenztreiber |
| --- | --- | --- | --- |
| MIPI | RAW BW | Vollbild | 0.3M<br>ov7251.c<br>1M<br>ov9281.c<br>1.3M<br>sc132gs.c |
| MIPI | YUV | Halbbild | tc35874x.c |
| ITU.BT601 | Bayer RAW |  | 2M imx323.c ar0230.c |
| ITU.BT601 | YUV |  | 0.3M gc0329.c gc0312.c gc032a.c 2M gc2145.c gc2155.c gc2035.c bf3925.c |
| ITU.BT601 | RAW BW |  | 0.3M sc031gs.c 1.3M sc032gs.c |
| ITU.BT656 | Bayer RAW |  | 2M imx323 (Unterstützung möglich) |

## 23. Anhang D: Referenztreiber für VCM-Treiber-ICs

| Referenztreiber |
| --- |
| vm149c.c |
| dw9714.c |
| dw9718.c |
| fp5510.c |
| gt9760s.c |
| fp5501.c (Schrittmotor) |
| mp6507.c (Schrittmotor) |
| ms41908.c (Schrittmotor) |

## 24. Anhang E: Referenztreiber für Blitzlicht-Treiber-ICs

| Referenztreiber |
| --- |
| sgm3784.c |
| leds-rgb13h.c (GPIO-Steuerung) |

{% endraw %}
