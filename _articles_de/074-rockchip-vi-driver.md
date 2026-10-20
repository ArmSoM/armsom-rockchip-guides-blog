---
title: "Rockchip-VI-Treiber: ISP, VICAP, Sensoren und Kameradiagnose"
description: "Vollständige Plattformreferenz V1.0.7 für Linux-4.19-Kamerapipelines, CIS-/VCM-/Blitz-/Objektivtreiber, Speicher- und Latenzoptimierung, Diagnose und sämtliche fünf Anhänge."
translation_key: "074-rockchip-vi-driver"
slug: "074-rockchip-vi-driver"
lang: "de"
date: "2026-10-18"
author: "ArmSoM-Redaktion · Rockchip-Quelldokumentation"
category: "camera"
products: []
tags: ["Rockchip", "VI", "ISP", "VICAP", "Kamera", "Linux"]
keywords: "ArmSoM Rockchip VI ISP VICAP RK3568 RV1126 Linux Kamera"
excerpt: "Vollständige Plattformreferenz V1.0.7: Linux-4.19-Kamerapipelines, CIS-/VCM-/Blitz-/Objektivtreiber, Speicher- und Latenzoptimierung, Diagnose und alle fünf Anhänge."
---

{% raw %}

# Rockchip-VI-Treiber: ISP, VICAP, Sensoren und Kameradiagnose

## ArmSoM-Anwendbarkeit und Quellenumfang

Dies ist eine Rockchip-Plattformreferenz und kein Bericht über eine Hardwarevalidierung auf ArmSoM. Sie beschreibt das RKISP-Modul, den gesamten Kameraablauf und zugehörige APIs zur Kameratreiberdiagnose. Die bereitgestellte Quelle ist **Rockchip_Driver_Guide_VI_EN_v1.0.7.pdf**, V1.0.7, mit 133 Seiten. Ein entsprechendes chinesisches PDF wurde nicht bereitgestellt. Chinesisch, Russisch und Deutsch sind vollständige Übersetzungen dieser englischen Quelle; alle Fassungen verwenden deren englische Originalabbildungen.

Die Produkttabelle auf dem Titelblatt nennt RV1126/RV1109 mit Linux 4.19; die nachfolgende Anwendbarkeitstabelle enthält zusätzlich RK3566/RK3568. Beide bleiben unten erhalten. Daraus folgt keine Kompatibilität mit jedem ArmSoM-Board oder BSP. Prüfen Sie vor der Anpassung den genauen SoC, das Linux-4.19-Hersteller-SDK/BSP, die ISP-/ISPP-/VICAP-Topologie, Kameraanschluss, Lane-Führung, Stromversorgung und Takte von Sensor/VCM/Blitz sowie DTS- und IQ-/AIQ-Version. Es wurden keine boardspezifischen Hardwaretests durchgeführt. Sämtliche Messungen, Protokolle und Befehle unten stammen aus der Quelle und sind keine ArmSoM-Testergebnisse.

> Widersprüche der Quelle werden nicht stillschweigend korrigiert: Die Funktionstabellen auf PDF-Seiten 6 und 13 nennen unterschiedliche maximale RK356x-Auflösungen. Mehrere Absätze nennen RV1106, während der Produktumfang RV1109 angibt. Schreibweisen wie hsync-acitve, pclk-ative, hieght und /dev/medio0 sind gegen das Ziel-BSP zu prüfen. Beachten Sie vor Anwendung der Beispiele die Prüfnotizen. Das Deaktivieren der IOMMU und Erhöhen von Takten im Latenzabschnitt sind Optimierungsbeispiele der Quelle, keine pauschalen Empfehlungen für den Produktionseinsatz.

[Redaktionelle Prüfnotizen](/docs/rockchip-vi-driver/EDITORIAL-NOTES.md) · [Offizielle ArmSoM-Dokumentation](https://docs.armsom.org/) · [Linux-Media-Userspace-API](https://www.kernel.org/doc/html/latest/userspace-api/media/index.html)

### Ursprünglicher Produktumfang (PDF-Seite 1)

| Chipname | Kernelversion |
| --- | --- |
| RV1126/RV1109 | Linux 4.19 |

### Ursprüngliche Anwendbarkeitsmatrix (PDF-Seite 2)

| Plattform | Linux-Kernel 4.19 |
| --- | --- |
| RV1126 | Y |
| RV1109 | Y |
| RK3566 | Y |
| RK3568 | Y |


## Unterschiede der VI-Funktionen zwischen den Chips

<!-- Source: English PDF p6, table unit 1 -->

| SoC | VI-IP | VI-Schnittstelle | Maximale Bayer-CIS-<br>Auflösung | Merkmal |
| --- | --- | --- | --- | --- |
| RV1109 | ISP20 ( ISP +<br>ISPP): 1<br>VICAP Full: 1<br>VICAP Lite: 1 | MIPI DPHY:<br>2 x 4Lanes 2.5Gbps/Lane<br>LVDS:<br>2 x 4Lanes 1.0Gbps/Lane<br>DVP:<br>BT601 / BT656 / BT1120<br>pclk: 150MHz | 3072x2048 | HDR mit bis zu<br>3 Bildern |
| RK3566 | ISP21 Lite: 1<br>VICAP Full: 1 | MIPI DPHY:<br>2 x 2Lanes oder 1 x 4Lanes<br>2.5Gbps/Lane<br>DVP:<br>BT601 / BT656 / BT1120<br>pclk: 150MHz | 4096x2304 | Kein HDR |
| RK3568 | ISP21：1<br>VICAP Full: 1 | MIPI DPHY:<br>2 x 2Lanes oder 1 x 4Lanes<br>2.5Gbps/Lane<br>DVP:<br>BT601 / BT656 / BT1120<br>pclk: 150MHz | 4096x2304 | HDR mit bis zu<br>2 Bildern |
| RV1126 | ISP20 ( ISP +<br>ISPP): 1<br>VICAP Full: 1<br>VICAP Lite: 1 | MIPI DPHY:<br>2 x 4Lanes 2.5Gbps/Lane<br>LVDS:<br>2 x 4Lanes 1.0Gbps/Lane<br>DVP:<br>BT601 / BT656 / BT1120<br>pclk: 150MHz | 4416x3312 | HDR mit bis zu<br>3 Bildern |

## Verzeichnisübersicht der Kameratreibersoftware

Linux-Kernel 4.19

- `arch/arm/boot/dts` — DTS-Konfigurationsdatei

- `drivers/phy/rockchip`

- `drivers/phy/rockchip/phy-rockchip-mipi-rx.c` — MIPI-DPHY-Treiber

- `drivers/phy/rockchip/phy-rockchip-csi2-dphy-common.h`

- `drivers/phy/rockchip/phy-rockchip-csi2-dphy-hw.c`

- `drivers/phy/rockchip/phy-rockchip-csi2-dphy.c`

- `drivers/media`

- `drivers/media/platform/rockchip/cif`

- `drivers/media/platform/rockchip/isp`

- `drivers/media/platform/rockchip/isp/dev` — Geräteerkennung, asynchrone Registrierung, Takt, Pipeline, IOMMU und Media-/V4L2-Framework

- `drivers/media/platform/rockchip/isp/capture` — mp-/sp-/rawwr-Konfiguration, vb2 und Bildinterruptverarbeitung

- `drivers/media/platform/rockchip/isp/dmarx` — rawrd-Konfiguration, vb2 und Bildinterruptverarbeitung

- `drivers/media/platform/rockchip/isp/isp_params` — 3A-Parametereinstellungen

- `drivers/media/platform/rockchip/isp/isp_stats` — 3A-Statistiken

- `drivers/media/platform/rockchip/isp/isp_mipi_luma` — Helligkeitsstatistiken der MIPI-Daten

- `drivers/media/platform/rockchip/isp/regs` — Register-Lese- und Schreibzugriffe

- `drivers/media/platform/rockchip/isp/rkisp` — Registrierung von ISP-Subdevice und Entity

- `drivers/media/platform/rockchip/isp/csi` — CSI-Subdevice und MIPI-Konfiguration

- `drivers/media/platform/rockchip/isp/bridge` — Bridge-Subdevice zur Verbindung von ISP und ISPP

- `drivers/media/platform/rockchip/ispp`

- `drivers/media/platform/rockchip/ispp/dev` — Geräteerkennung, asynchrone Registrierung, Takt, Pipeline, IOMMU und Media-/V4L2-Framework

- `drivers/media/platform/rockchip/ispp/stream` — Konfiguration von 4 Videoausgängen, vb2 und Bildinterruptverarbeitung

- `drivers/media/platform/rockchip/ispp/rkispp` — Registrierung von ISPP-Subdevice und Entity

- `drivers/media/platform/rockchip/ispp/params` — TNR-/NR-/SHP-/FEC-/ORB-Parametereinstellung

- `drivers/media/platform/rockchip/ispp/stats` — ORB-Statistiken

- `drivers/media/i2c`

- `drivers/media/i2c/os04a10.c` — CIS-Treiber (CMOS-Bildsensor)

## Verknüpfung zwischen ISP und VICAP

Auf RV1126/RV1109 und RK356X sind VICAP und ISP unabhängige Bildverarbeitungs-IP-Blöcke. Sollen von VICAP erfasste Bilder im ISP verarbeitet werden, muss der Treiber ein V4L2-Subdevice für die entsprechende VICAP-Schnittstelle erzeugen und mit dem zugehörigen ISP-Knoten verknüpfen. Es stellt dem ISP-Treiber die benötigten Parameter bereit. Siehe die Abschnitte zu RKISP- und RKVICAP-Treibern. Das folgende Blockdiagramm zeigt die Verknüpfung der einzelnen VICAP-Schnittstellen mit dem ISP:

![Englische Originalabbildung 1, PDF-Seite 7](/docs/rockchip-vi-driver/assets/en-p7-X177.jpg)

*Englische Originalabbildung 1, PDF-Seite 7*

## RKISP-Treiber

### Kurze Frameworkbeschreibung

Der RKISP-Treiber basiert hauptsächlich auf dem V4L2-/Media-Framework. Er übernimmt Hardwarekonfiguration, Interruptverarbeitung, Pufferwechsel und das Ein-/Ausschalten von Subdevices wie MIPI DPHY und Sensor.

Das folgende Blockdiagramm beschreibt die Topologie des RKISP-Treibers:

![Englische Originalabbildung 2, PDF-Seite 8](/docs/rockchip-vi-driver/assets/en-p8-X184.jpg)

*Englische Originalabbildung 2, PDF-Seite 8*

<!-- Source: English PDF p9, table unit 41 -->

| Name | Typ | Beschreibung |
| --- | --- | --- |
| rkisp_mainpath | v4l2_vdevcapture | Formate: YUV, RAW Bayer; unterstützt Bildbeschnitt |
| rkisp_selfpath | v4l2_vdevcapture | Formate: YUV, RGB; unterstützt Bildbeschnitt |
| rkisp-isp-subdev | v4l2_subdev | Interne ISP-Blöcke; unterstützen Beschnitt an Source-/Sink-Pads.<br>Format und Größe am Sink-Pad entsprechen der Sensoreingabe.<br>Bei RAW-Bayer-Ausgabe muss das Source-Pad-Format dem Vdev-Ausgabeformat entsprechen,<br>andernfalls YUYV2X8. Die Größe darf die Sink-Pad-Größe nicht überschreiten. |
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
| rockchip-mipi-<br>dphy-rx | v4l2_subdev | MIPI-DPHY-Konfiguration |
| rkisp-bridge-ispp | v4l2_subdev | Überträgt YUV-Bilder vom ISP an ISPP |
| rkispp_input_image | v4l2_vdevoutput | Liest YUV-Bilder aus DDR in ISPP |
| rkisp-isp-subdev | v4l2_subdev | Format und Größe am Sink-Pad entsprechen der ISP-Ausgabe.<br>Maximale Größe: 4416x3312; minimale Größe: 66x258. |
| rkispp_m_bypass | v4l2_vdev<br>capture | Volle Auflösung und YUV-Format |
| rkispp_scale0 | v4l2_vdev<br>capture | Volle oder skalierte Auflösung, YUV-Format.<br>Skalierungsverhältnis: [1 8].<br>Maximale Breite: 3264 für yuv422, 2080 für yuv420. |
| rkispp_scale1 | v4l2_vdev<br>capture | Volle oder skalierte Auflösung, YUV-Format.<br>Skalierungsverhältnis: [2 8]; maximale Breite: 1280. |
| rkispp_scale2 | v4l2_vdev<br>capture | Volle oder skalierte Auflösung, YUV-Format.<br>Skalierungsverhältnis: [2 8]; maximale Breite: 1280. |

### ISP-HDR-Modus

RKISP2 unterstützt MIPI-Sensoren mit HDR-Ausgabe aus 3 oder 2 Bildern. Die Hardware erfasst die Daten über 3 beziehungsweise 2 dmatx in DDR und liest sie anschließend über 3 beziehungsweise 2 dmarx in den ISP. Dort werden die Bilder zusammengeführt. Treiberpipeline:

![Englische Originalabbildung 3, PDF-Seite 10](/docs/rockchip-vi-driver/assets/en-p10-X190.png)

*Englische Originalabbildung 3, PDF-Seite 10*

![Englische Originalabbildung 4, PDF-Seite 10](/docs/rockchip-vi-driver/assets/en-p10-X191.png)

*Englische Originalabbildung 4, PDF-Seite 10*

Das CSI-Subdevice ermittelt über get_fmt die Ausgabeinformationen des Sensortreibers in mehreren Pad-Formaten, die den Source-Pads von CSI entsprechen.

Zur konkreten Konfiguration des MIPI-Sensortreibers siehe die Schritte zur Treiberportierung.

<!-- Source: English PDF p11, table unit 50 -->

| Name | Name | Beschreibung |
| --- | --- | --- |
| rkisp-isp-<br>subdev | Sensor<br>pad0 | ISP erfasst Breite, Höhe und Format der Sensorausgabe auf vc0 (Standard),<br>üblicherweise für den linearen Modus. |
| rkisp_rawwr0 | Sensor<br>pad1 | Rawwr0 erfasst Breite, Höhe und Format der Sensorausgabe auf vcX |
| rkisp_rawwr1 | Sensor<br>pad2 | Rawwr1 erfasst Breite, Höhe und Format der Sensorausgabe auf vcX |
| rkisp_rawwr2 | Sensor<br>pad3 | Rawwr2 erfasst Breite, Höhe und Format der Sensorausgabe auf vcX |
| rkisp_rawwr3 | Sensor<br>pad4 | Rawwr3 erfasst Breite, Höhe und Format der Sensorausgabe auf vcX |

## RKVICAP-Treiber

### Frameworkbeschreibung

Der RKVICAP-Treiber basiert hauptsächlich auf dem V4L2-/Media-Framework. Er übernimmt Hardwarekonfiguration, Interruptverarbeitung, Pufferwechsel und das Ein-/Ausschalten von Subdevices wie MIPI DPHY und Sensor.

Bei RV1126/RV1109 besitzt VICAP zwei IP-Kerne: VICAP FULL und VICAP LITE. VICAP FULL verfügt über dvp/mipi/lvds. DVP kann gleichzeitig mit MIPI oder LVDS arbeiten, MIPI und LVDS jedoch nicht gleichzeitig. VICAP LITE besitzt nur eine LVDS-Schnittstelle und kann gleichzeitig mit VICAP FULL arbeiten. Die DVP-Schnittstelle von VICAP FULL entspricht rkvicap_dvp, dessen MIPI-/LVDS-Schnittstelle rkvicap_mipi_lvds und VICAP LITE rkvicap_lite_mipi_lvds. Jeder Knoten kann unabhängig erfassen.

Bei RK356X besitzt VICAP nur einen Kern mit DVP- und MIPI-Schnittstelle. DVP entspricht rkvicap_dvp und MIPI rkvicap_mipi_lvds, also demselben Namen wie VICAP FULL auf RV1126/RV1109. Jeder Knoten kann unabhängig erfassen.

Um die von VICAP erfassten Daten mit dem ISP-Treiber zu synchronisieren, muss der logische sditf-Knoten des VICAP-Treibers mit dem vom ISP erzeugten virtuellen Geräteknoten verknüpft werden. DVP entspricht rkvicap_dvp_sditf, die MIPI-/LVDS-Schnittstelle von VICAP FULL rkvicap_mipi_lvds_sditf und VICAP LITE rkvicap_lite_sditf.

Zur DTS-Verknüpfung der jeweiligen Schnittstelle siehe CIS-Geräteregistrierung (DTS).

Die folgende Abbildung beschreibt die Topologie des durch RKVICAP gesteuerten Geräts:

![Englische Originalabbildung 5, PDF-Seite 12](/docs/rockchip-vi-driver/assets/en-p12-X201.jpg)

*Englische Originalabbildung 5, PDF-Seite 12*

## Unterschiede zwischen Chipversionen

<!-- Source: English PDF p13, table unit 61 -->

| SoC | VI-IP | VI-Schnittstelle | Maximale Bayer-CIS-<br>Auflösung | Merkmal |
| --- | --- | --- | --- | --- |
| RV1109 | ISP20 ( ISP +<br>ISPP): 1<br>VICAP Full: 1<br>VICAP Lite: 1 | MIPI DPHY:<br>2 x 4Lanes 2.5Gbps/Lane<br>LVDS:<br>2 x 4Lanes 1.0Gbps/Lane<br>DVP:<br>BT601 / BT656 / BT1120<br>pclk: 150MHz | 3072x2048 | HDR mit bis zu<br>3 Bildern |
| RK3566 | ISP21 Lite: 1<br>VICAP Full: 1 | MIPI DPHY:<br>2 x 2Lanes oder 1 x 4Lanes<br>2.5Gbps/Lane<br>DVP:<br>BT601 / BT656 / BT1120<br>pclk: 150MHz | 4096x3072 | Kein HDR |
| RK3568 | ISP21：1<br>VICAP Full: 1 | MIPI DPHY:<br>2 x 2Lanes oder 1 x 4Lanes<br>2.5Gbps/Lane<br>DVP:<br>BT601 / BT656 / BT1120<br>pclk: 150MHz | 4096x3072 | HDR mit bis zu<br>2 Bildern |
| RV1126 | ISP20 ( ISP +<br>ISPP): 1<br>VICAP Full: 1<br>VICAP Lite: 1 | MIPI DPHY:<br>2 x 4Lanes 2.5Gbps/Lane<br>LVDS:<br>2 x 4Lanes 1.0Gbps/Lane<br>DVP:<br>BT601 / BT656 / BT1120<br>pclk: 150MHz | 4416x3312 | HDR mit bis zu<br>3 Bildern |

## CIS-Treiber (CMOS-Bildsensor)

### CIS-Geräteregistrierung (DTS)

#### Einzelregistrierung

##### MIPI-Schnittstelle

Auf RV1126 und RV1106 gibt es zwei unabhängige vollständige standardkonforme physische MIPI-CSI2-DPHYs. Sie entsprechen csi_dphy0 und csi_dphy1 im DTS; siehe RV1126.dtsi. Eigenschaften:

Höchstens 4 Daten-Lanes.

Maximale Datenrate 2.5Gbps/lane.

RK356X besitzt nur eine standardkonforme physische MIPI-CSI2-DPHY. Sie arbeitet im vollständigen oder aufgeteilten Modus und kann drei logische DPHYs bilden: csi2_dphy0/csi2_dphy1/csi2_dphy2; siehe rk3568.dtsi. Eigenschaften:

##### Vollständiger Modus

Nur csi2_dphy0 verwenden. csi2_dphy0 und csi2_dphy1/csi2_dphy2 schließen sich gegenseitig aus und dürfen nicht gleichzeitig verwendet werden.

Höchstens 4 Daten-Lanes.

Maximale Datenrate 2.5Gbps/lane.

##### Aufgeteilter Modus

Nur csi2_dphy1 und csi2_dphy2 verwenden; sie schließen die gleichzeitige Verwendung von csi2_dphy0 aus.

csi2_dphy1 und csi2_dphy2 können gleichzeitig verwendet werden.

csi2_dphy1 und csi2_dphy2 besitzen jeweils höchstens 2 Daten-Lanes.

csi2_dphy1 entspricht lane0/lane1 der physischen DPHY.

csi2_dphy2 entspricht lane2/lane3 der physischen DPHY.

Maximale Datenrate 2.5Gbps/lane.

Konkrete DTS-Anwendungsfälle zeigen die folgenden Beispiele.

##### Verknüpfung mit dem ISP

##### Plattform RV1126/RV1106

Nachfolgend dienen RV1126 ISP und os04a10 als Beispiel.

##### Verknüpfung: sensor->csi_dphy->isp->ispp

arch/arm/boot/dts/RV1126-evb-v10.dtsi

##### Wichtige Konfigurationspunkte

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

##### Plattform RK356X

Als Beispiel dienen rk3566 ISP und gc8034 mit 4 Lanes:

##### Verknüpfung: sensor->csi2_dphy0->isp; wichtige Konfigurationspunkte

data-lanes konfigurieren und den Knoten csi2_dphy_hw aktivieren.

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

##### Verknüpfung mit VICAP

##### Plattform RV1126/RV1109

Beispiel für die Verbindung des MIPI-os04a10 mit 4 Lanes zu VICAP:

##### Verknüpfung: sensor->csi dphy->mipi csi host->vicap; wichtige Konfigurationspunkte

data-lanes muss die verwendete Lane-Anzahl angeben, andernfalls wird MIPI nicht erkannt. Die DPHY muss mit dem CSI-Host-Knoten verknüpft sein.

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

##### Plattform RK356X

Beispiel für gc5025 mit 2 Lanes an lane2/lane3 der MIPI-CSI2-DPHY auf rk3566 evb2:

##### Verknüpfung: sensor->csi2 dphy->mipi csi host->vicap; wichtige Konfigurationspunkte

data-lanes muss die verwendete Lane-Anzahl angeben, andernfalls wird MIPI nicht erkannt. Die DPHY muss mit dem CSI-Host-Knoten verknüpft und der Knoten csi2 dphy hw aktiviert werden.

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

##### LVDS-Schnittstelle

##### Verknüpfung mit VICAP

##### Plattform RV1126/RV1109

Am Beispiel von imx327 mit 4 Lanes ergibt sich folgende Verknüpfung:

##### Verknüpfung: sensor->csi dphy->vicap; wichtige Konfigurationspunkte

Die DPHY darf nicht mit dem CSI-Host-Knoten verknüpft werden, sonst werden keine Daten empfangen. data-lanes muss die tatsächlich verwendete Lane-Anzahl angeben, sonst werden ebenfalls keine Daten empfangen. bus-type muss auf 3 gesetzt werden; andernfalls wird die Schnittstelle nicht als LVDS erkannt und die Verknüpfung scheitert.

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

##### DVP-Schnittstelle mit VICAP verknüpfen

Auf RV1126/RV1106/RK356X ist die DTS-Konfiguration der jeweiligen DVP-Schnittstellen gleich.

##### BT601

Am Beispiel von ar0230 BT601 ergibt sich folgende Verknüpfung:

##### Verknüpfung: sensor->vicap; wichtige Konfigurationspunkte

hsync-active/vsync-active müssen gesetzt sein, damit die asynchrone Registrierung des V4L2-Frameworks BT601 erkennt. Ohne diese Konfiguration wird BT656 erkannt. pclk-sample/bus-width sind optional. In g_mbus_config des Sensortreibers muss das Flag die gültige Polarität von hsync-acitve/vsync-active/pclk-ative des aktuellen Sensors angeben, andernfalls werden keine Daten empfangen. Die fehlerhaften Schreibweisen der Quelle bleiben erhalten. pinctrl muss referenziert werden, damit das entsprechende IOMUX für die BT601-GPIOs eingerichtet wird; andernfalls scheitert ebenfalls der Datenempfang.

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

##### BT656/BT1120

BT656 und BT1120 werden im DTS gleich verwendet.

Am Beispiel von ava fpga bt1120 ergibt sich folgende Verknüpfung:

##### Verknüpfung: sensor->vicap; wichtige Konfigurationspunkte

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

#### Mehrere Sensoren registrieren

Ein einzelner Hardware-ISP bildet mehrere virtuelle Geräte und verarbeitet RAW-Daten mehrerer Sensoren im Zeitmultiplex.

##### Plattform RV1126/RV1106: isp0->ispp0 und isp1->ispp1 sind in RV1126.dtsi festgelegt; MIPI- oder CIF-Eingang zum ISP ist wählbar.

Beispiel:

##### sensor0->csi_dphy0->csi2->vicap->isp0->ispp0 sensor1->csi_dphy1->isp1->ispp1

Referenz: arch/arm/boot/dts/RV1109-evb-ddr3-v12-facial-gate.dts mit gc2053->csi_dphy0->csi2->cif->isp1->ispp1 und ov2718->csi_dphy1->isp0->ispp0. Bei unterschiedlichen Auflösungen ist folgende Konfiguration besonders wichtig:

```dts
&rkispp { status = "okay"; /* the max input w h and fps of mulit sensor */ max-input = <2688 1520 30>;//Take the maximum width and height and frame rate of different sensors };
```

##### Plattform RK3566/RK3568

Beispiel:

ov5695->dphy1->isp_vir0

gc5025->dphy2->csi2->vicap->isp_vir1

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

### Beschreibung des CIS-Treibers

Der Kamerasensor kommuniziert über I2C mit dem Host. Sein Treiber ist derzeit als I2C-Gerätetreiber implementiert und verwendet zugleich die V4L2-Subdevice-Schnittstelle zur Kommunikation mit dem Hosttreiber.

#### Kurze Beschreibung der Datentypen

##### struct i2c_driver

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

<!-- Source: English PDF p36, table unit 176 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| @driver | Enthält im Gerätetreibermodell hauptsächlich Treibername und of_match_table<br>zum Abgleich mit dem im DTS registrierten Gerät. Stimmen die compatible-Felder<br>von of_match_table und DTS überein, wird .probe aufgerufen. |
| @id_table | Liste der unterstützten I2C-Geräte. Verwendet der Kernel nicht of_match_table<br>und DTS-Geräteregistrierung zum Abgleich, greift er auf diese Tabelle zurück. |
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

##### struct v4l2_subdev_ops

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

<!-- Source: English PDF p37, table unit 186 -->

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

##### struct v4l2_subdev_core_ops

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

<!-- Source: English PDF p38, table unit 195 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .s_power | Versetzt das Subdevice in den Energiesparmodus (on == 0)<br>oder Normalbetrieb (on == 1). |
| .ioctl | Wird am Ende der ioctl()-Systemaufrufbehandlung im V4L2-Kern aufgerufen<br>und unterstützt treiberspezifische private ioctls. |
| .compat_ioctl32 | Wird bei einer 32-Bit-Anwendung auf einem 64-Bit-Kernel aufgerufen,<br>um Daten beim Austausch mit dem Userspace anzupassen. |

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

##### Folgende private ioctls dienen derzeit zur Modulabfrage sowie zum Abfragen und Setzen von OTP-Informationen

<!-- Source: English PDF p39, table unit 199 -->

| Privates ioctl | Beschreibung |
| --- | --- |
| RKMODULE_GET_MODULE_INFO | Modulinformationen abrufen; siehe struct rkmodule_inf. |
| RKMODULE_AWB_CFG | AWB-Kompensation des Sensors umschalten. Ist im Modul kein Golden-AWB-Wert<br>gespeichert, kann er hier gesetzt werden. Siehe struct rkmodule awb_cfg;<br>die Schreibweise der Quelle bleibt erhalten. |
| RKMODULE_LSC_CFG | LSC-Kompensation des Sensors umschalten; siehe struct rkmodule_lsc_cfg. |
| PREISP_CMD_SET_HDRAE_EXP | HDR-Belichtung setzen; siehe struct preisp_hdrae_exp_s. |
| RKMODULE_SET_HDR_CFG | Zwischen normalem und HDR-Modus umschalten. Der Treiber muss<br>beide Konfigurationsgruppen unterstützen. Siehe struct rkmodule_hdr_cfg. |
| RKMODULE_GET_HDR_CFG | Aktuellen HDR-Modus abfragen; siehe struct rkmodule_hdr_cfg. |
| RKMODULE_SET_CONVERSION_GAIN | Konversionsverstärkung im linearen Modus setzen, z. B. für imx347<br>oder os04a10 mit entsprechender Funktion. Unterstützt der Sensor diese nicht,<br>kann die Implementierung entfallen. |

##### struct v4l2_subdev_video_ops

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

<!-- Source: English PDF p40, table unit 206 -->

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

##### struct v4l2_subdev_pad_ops

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

<!-- Source: English PDF p41, table unit 215 -->

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

##### struct v4l2_ctrl_ops

[Beschreibung]

Steuerungsoperationen, die der Treiber bereitstellen muss.

[Definition]

```text
  struct v4l2_ctrl_ops {
      int (*s_ctrl)(struct v4l2_ctrl *ctrl);
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p41, table unit 224 -->

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

##### struct xxxx_mode

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

<!-- Source: English PDF p42, table unit 235 -->

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
| .hdr_mode | Sensorbetriebsmodus: linear, HDR-Zusammenführung aus zwei<br>oder drei Bildern |
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

##### struct v4l2_mbus_framefmt

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

<!-- Source: English PDF p44, table unit 245 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| width | Bildbreite |
| height | Bildhöhe |
| code | Verweis auf die MEDIA_BUS_FMT-Tabelle |
| field | V4L2_FIELD_NONE: Vollbildausgabe; V4L2_FIELD_INTERLACED:<br>Halbbildausgabe |

[Beispiel]

##### struct rkmodule_base_inf

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

<!-- Source: English PDF p44, table unit 253 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| sensor | Sensorname aus dem Sensortreiber |
| module | Modulname aus der DTS-Konfiguration gemäß Moduldaten |
| lens | Objektivname aus der DTS-Konfiguration gemäß Moduldaten |

[Beispiel]

##### struct rkmodule_fac_inf

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

<!-- Source: English PDF p45, table unit 261 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| flag | Gültigkeit dieser Informationsgruppe |
| module | Modulname; die Kennnummer aus OTP wird in den Modulnamen umgesetzt |
| lens | Objektivname; die Kennnummer aus OTP wird in den Objektivnamen umgesetzt |
| year | Produktionsjahr, beispielsweise 12 für 2012 |
| month | Produktionsmonat |
| day | Produktionstag |

[Beispiel]

##### struct rkmodule_awb_inf

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

<!-- Source: English PDF p46, table unit 269 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| flag | Gültigkeit dieser Informationsgruppe |
| r_value | AWB-R-Messinformation des aktuellen Moduls |
| b_value | AWB-B-Messinformation des aktuellen Moduls |
| gr_value | AWB-GR-Messinformation des aktuellen Moduls |
| gb_value | AWB-GB-Messinformation des aktuellen Moduls |
| golden_r_value | AWB-R-Messinformation eines typischen Moduls;<br>falls nicht programmiert, auf 0 setzen |
| golden_b_value | AWB-B-Messinformation eines typischen Moduls;<br>falls nicht programmiert, auf 0 setzen |
| golden_gr_value | AWB-GR-Messinformation eines typischen Moduls;<br>falls nicht programmiert, auf 0 setzen |
| golden_gb_value | AWB-GB-Messinformation eines typischen Moduls;<br>falls nicht programmiert, auf 0 setzen |

[Beispiel]

##### struct rkmodule_lsc_inf

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

<!-- Source: English PDF p47, table unit 277 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| flag | Gültigkeit dieser Informationsgruppe |
| lsc_w | Tatsächliche Breite der LSC-Tabelle |
| lsc_h | Tatsächliche Höhe der LSC-Tabelle |
| decimal_bits | Anzahl der Nachkommastellen der LSC-Messinformation;<br>falls nicht verfügbar, auf 0 setzen |
| lsc_r | LSC-R-Messinformation |
| lsc_b | LSC-B-Messinformation |
| lsc_gr | LSC-GR-Messinformation |
| lsc_gb | LSC-GB-Messinformation |

[Beispiel]

##### struct rkmodule_af_inf

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

<!-- Source: English PDF p47, table unit 285 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| flag | Gültigkeit dieser Informationsgruppe |
| vcm_start | VCM-Anlaufstrom |
| vcm_end | VCM-Endstrom |
| vcm_dir | VCM-Bestimmungsrichtung |

[Beispiel]

##### struct rkmodule_inf

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

<!-- Source: English PDF p48, table unit 293 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| base | Grundlegende Modulinformationen |
| fac | OTP-Werksinformationen des Moduls |
| awb | AWB-Messinformationen aus dem Modul-OTP |
| lsc | LSC-Messinformationen aus dem Modul-OTP |
| af | AF-Messinformationen aus dem Modul-OTP |

[Beispiel]

##### struct rkmodule_awb_cfg

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

<!-- Source: English PDF p48, table unit 301 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| enable | Gibt an, ob die AWB-Korrektur aktiviert ist |
| golden_r_value | AWB-R-Messinformation eines typischen Moduls |
| golden_b_value | AWB-B-Messinformation eines typischen Moduls |
| golden_gr_value | AWB-GR-Messinformation eines typischen Moduls |
| golden_gb_value | AWB-GB-Messinformation eines typischen Moduls |

[Beispiel]

##### struct rkmodule_lsc_cfg

[Beschreibung]

LSC-Konfigurationsinformationen aus dem Modul-OTP.

[Definition]

```text
  struct rkmodule_lsc_cfg {
      __u32 enable;
  } __attribute__ ((packed));
```

[Wichtige Mitglieder]

<!-- Source: English PDF p49, table unit 309 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| enable | Gibt an, ob die LSC-Korrektur aktiviert ist |

[Beispiel]

##### struct rkmodule_hdr_cfg

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

<!-- Source: English PDF p50, table unit 317 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| hdr_mode | NO_HDR=0 // normaler Modus<br>HDR_X2=5 // HDR-Modus mit 2 Bildern<br>HDR_X3=6 // HDR-Modus mit 3 Bildern |
| struct rkmodule_hdr_esp | Besonderer HDR-Modus |
| enum hdr_esp_mode | HDR_NORMAL_VC=0 // normaler Modus mit virtuellen Kanälen<br>HDR_LINE_CNT=1 // Zeilenzählermodus (AR0239)<br>HDR_ID_CODE=2 // Identifikationscodemodus (IMX327) |

[Beispiel]

##### struct preisp_hdrae_exp_s

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

<!-- Source: English PDF p51, table unit 325 -->

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

#### Kurze API-Beschreibung

##### xxxx_set_fmt

[Beschreibung]

Sensorausgabeformat setzen.

[Syntax]

```text
  static int xxxx_set_fmt(struct v4l2_subdev *sd,
                          struct v4l2_subdev_pad_config *cfg,
                          struct v4l2_subdev_format *fmt)
```

[Parameter]

<!-- Source: English PDF p51, table unit 337 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *sd | Zeiger auf die V4L2-Subdevice-Struktur | Eingabe |
| *cfg | Zeiger auf die Informationsstruktur des Subdevice-Pads | Eingabe |
| *fmt | Zeiger auf die Media-Bus-Formatstruktur auf Pad-Ebene | Eingabe |

[Rückgabewert]

<!-- Source: English PDF p52, table unit 339 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

##### xxxx_get_fmt

[Beschreibung]

Sensorausgabeformat abfragen.

[Syntax]

```text
  static int xxxx_get_fmt(struct v4l2_subdev *sd,
                          struct v4l2_subdev_pad_config *cfg,
                          struct v4l2_subdev_format *fmt)
```

[Parameter]

<!-- Source: English PDF p52, table unit 346 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *sd | Zeiger auf die V4L2-Subdevice-Struktur | Eingabe |
| *cfg | Zeiger auf die Informationsstruktur des Subdevice-Pads | Eingabe |
| *fmt | Zeiger auf die Media-Bus-Formatstruktur auf Pad-Ebene | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p52, table unit 348 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

Siehe die MEDIA_BUS_FMT-Tabelle.

##### xxxx_enum_mbus_code

[Beschreibung]

Die vom Sensor ausgegebenen Busformate aufzählen.

[Syntax]

```text
  static int xxxx_enum_mbus_code(struct v4l2_subdev *sd,
                                 struct v4l2_subdev_pad_config *cfg,
                                 struct v4l2_subdev_mbus_code_enum *code)
```

[Parameter]

<!-- Source: English PDF p53, table unit 356 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *sd | Zeiger auf die V4L2-Subdevice-Struktur | Eingabe |
| *cfg | Zeiger auf die Informationsstruktur des Subdevice-Pads | Eingabe |
| *code | Zeiger auf die Struktur zur Aufzählung der Media-Bus-Formate | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p53, table unit 358 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

Die folgende Tabelle fasst die zu den verschiedenen Bildtypen gehörenden Formate zusammen; siehe MEDIA_BUS_FMT-Tabelle.

##### xxxx_enum_frame_sizes

[Beschreibung]

Sensorausgabegrößen aufzählen.

[Syntax]

```text
  static int xxxx_enum_frame_sizes(struct v4l2_subdev *sd,
                              struct v4l2_subdev_pad_config *cfg,
                              struct v4l2_subdev_frame_size_enum *fse)
```

[Parameter]

<!-- Source: English PDF p53, table unit 366 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *sd | Zeiger auf die V4L2-Subdevice-Struktur | Eingabe |
| *cfg | Zeiger auf die Informationsstruktur des Subdevice-Pads | Eingabe |
| *fse | Zeiger auf die Media-Bus-Bildgrößenstruktur | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p53, table unit 368 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

##### xxxx_g_frame_interval

[Beschreibung]

Ausgabebildrate des Sensors abfragen.

[Syntax]

```text
  static int xxxx_g_frame_interval(struct v4l2_subdev *sd,
                                   struct v4l2_subdev_frame_interval *fi)
```

[Parameter]

<!-- Source: English PDF p54, table unit 375 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *sd | Zeiger auf die V4L2-Subdevice-Struktur | Eingabe |
| *fi | Zeiger auf die Bildratenstruktur auf Pad-Ebene | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p54, table unit 377 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

##### xxxx_s_stream

[Beschreibung]

Stream-Ein- und Ausgabe einstellen.

[Syntax]

```text
  static int xxxx_s_stream(struct v4l2_subdev *sd, int on)
```

[Parameter]

<!-- Source: English PDF p54, table unit 384 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *sd | Zeiger auf die V4L2-Subdevice-Struktur | Eingabe |
| on | 1: Stream-Ausgabe starten; 0: Stream-Ausgabe stoppen | Eingabe |

[Rückgabewert]

<!-- Source: English PDF p54, table unit 386 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

##### xxxx_runtime_resume

[Beschreibung]

Callback beim Einschalten des Sensors.

[Syntax]

```text
  static int xxxx_runtime_resume(struct device *dev)
```

[Parameter]

<!-- Source: English PDF p55, table unit 393 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *dev | Zeiger auf die Gerätestruktur | Eingabe |

[Rückgabewert]

<!-- Source: English PDF p55, table unit 395 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

##### xxxx_runtime_suspend

[Beschreibung]

Callback beim Ausschalten des Sensors.

[Syntax]

```text
  static int xxxx_runtime_suspend(struct device *dev)
```

[Parameter]

<!-- Source: English PDF p55, table unit 402 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *dev | Zeiger auf die Gerätestruktur | Eingabe |

[Rückgabewert]

<!-- Source: English PDF p55, table unit 404 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

##### xxxx_set_ctrl

[Beschreibung]

Wert des jeweiligen Steuerelements setzen.

[Syntax]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[Parameter]

<!-- Source: English PDF p56, table unit 411 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *ctrl | Zeiger auf die Struktur v4l2_ctrl | Eingabe |

[Rückgabewert]

<!-- Source: English PDF p56, table unit 413 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

##### xxx_enum_frame_interval

[Beschreibung]

Die vom Sensor unterstützten Bildintervallparameter aufzählen.

[Syntax]

```text
  static int xxxx_enum_frame_interval(struct v4l2_subdev *sd,
                      struct v4l2_subdev_pad_config *cfg,
                      struct v4l2_subdev_frame_interval_enum *fie)
```

[Parameter]

<!-- Source: English PDF p56, table unit 420 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *sd | Subdevice-Instanz | Eingabe |
| *cfg | Pad-Konfigurationsparameter | Eingabe |
| *fie | Bildintervallparameter | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p56, table unit 422 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

##### xxxx_g_mbus_config

[Beschreibung]

Unterstützte Buskonfiguration abfragen. Unterstützt ein Sensor beispielsweise mehrere MIPI-Übertragungsmodi, können die Parameter entsprechend seinem aktuellen MIPI-Modus gemeldet werden.

[Syntax]

```text
  static int xxxx_g_mbus_config(struct v4l2_subdev *sd,
                  struct v4l2_mbus_config *config)
```

[Parameter]

<!-- Source: English PDF p57, table unit 429 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *config | Buskonfigurationsparameter | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p57, table unit 431 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

##### xxxx_get_selection

[Beschreibung]

Beschnittparameter konfigurieren. Die ISP-Eingangsbreite muss auf 16 und die Höhe auf 8 ausgerichtet sein. Entspricht die Sensorausgabe nicht dieser Ausrichtung oder keiner Standardauflösung, kann diese Funktion die Auflösung vor dem ISP-Eingang beschneiden.

[Syntax]

```text
  static int xxxx_get_selection(struct v4l2_subdev *sd,
  struct v4l2_subdev_pad_config *cfg,
  struct v4l2_subdev_selection *sel)
```

[Parameter]

<!-- Source: English PDF p57, table unit 438 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *sd | Subdevice-Instanz | Eingabe |
| *cfg | Pad-Konfigurationsparameter | Eingabe |
| *sel | Beschnittparameter | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p57, table unit 440 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

#### Schritte zur Treiberportierung

##### 1. Standardmäßigen I2C-Subdevice-Treiberteil implementieren

1.1 Folgende Mitglieder gemäß der Beschreibung von struct i2c_driver implementieren:

struct driver.name

struct driver.pm

struct driver. of_match_table

probe-Funktion

remove-Funktion

1.2 Einzelheiten zur Implementierung von probe: 1) Beim Erfassen der CIS-Geräteressourcen werden hauptsächlich die im DTS definierten Ressourcen ausgewertet; siehe CIS-Geräteregistrierung (DTS).

1.1) Private RK-Ressourcen verwenden die Benennung rockchip, camera-module- xxx. Der Treiber übermittelt diese Ressourcen an camera_engine im Userspace, damit passende IQ-Bildparameter bestimmt werden können.

1.2) CIS-Geräteressourcen umfassen in RK-Referenztreibern normalerweise Folgendes:

<!-- Source: English PDF p58, table unit 452 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| Betriebsreferenztakt<br>des CIS-Geräts | Bei einem unabhängigen externen Quarzoszillator muss diese Ressource nicht angefordert werden.<br>Das RK-Referenzdesign verwendet normalerweise einen AP-Ausgabetakt, der angefordert werden muss.<br>Üblicher Name: xvclk. |
| Steuer-GPIOs<br>des CIS-Geräts | Beispielsweise Reset-Pin, in der Quelle „Resst“, und Powerdown-Pin |
| Steuerbare Stromversorgung<br>des CIS-Geräts | Passende Software-Ressourcen zur Versorgungskontrolle gemäß Hardwaredesign anfordern,<br>beispielsweise GPIO oder Regulator. |

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

<!-- Source: English PDF p59, table unit 464 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| RKMODULE_GET_MODULE_INFO | Übermittelt im DTS definierte Modulinformationen wie den Modulnamen<br>an camera_engine. |
| RKMODULE_AWB_CFG | Bei aktivierten Modul-OTP-Informationen übermittelt camera_engine damit<br>den AWB-Kalibrierwert eines typischen Moduls. Der CIS-Treiber vergleicht ihn mit dem<br>AWB-Kalibrierwert des aktuellen Moduls, berechnet R/B Gain und setzt diese<br>im CIS-MWB-Modul. |
| RKMODULE_LSC_CFG | Bei aktivierten Modul-OTP-Informationen steuert camera_engine damit<br>die Aktivierung der LSC-Kalibrierwerte. |
| PREISP_CMD_SET_HDRAE_EXP | HDR-Belichtungseinstellungen; siehe struct preisp_hdrae_exp_s in diesem Dokument. |
| RKMODULE_SET_HDR_CFG | Zwischen HDR- und Normalmodus wechseln. Der Treiber muss beide<br>Konfigurationsgruppen unterstützen; siehe struct rkmodule_hdr_cfg. |
| RKMODULE_GET_HDR_CFG | Aktuellen HDR-Modus abfragen; siehe struct rkmodule_hdr_cfg. |
| RKMODULE_SET_CONVERSION_GAIN | Konversionsverstärkung im linearen Modus setzen, z. B. bei imx347 oder<br>os04a10. Hohe Konversionsverstärkung kann bei geringer Beleuchtung ein besseres<br>Signal-Rausch-Verhältnis liefern. Ohne Sensorunterstützung kann die Implementierung entfallen. |

2.2 Die Callbacks gemäß struct v4l2_subdev_video_ops implementieren, insbesondere:

<!-- Source: English PDF p60, table unit 466 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .s_stream | Datenstrom ein-/ausschalten. Bei kontinuierlichem MIPI-Takt muss der Datenstrom<br>in diesem Callback gestartet werden. Ein vorzeitiger Start verhindert die Erkennung<br>des MIPI-LP-Zustands. |
| .g_frame_interval | Bildintervallparameter beziehungsweise Bildrate abfragen |
| .g_mbus_config | Buskonfiguration abfragen. Unterstützt der MIPI-Sensortreiber verschiedene<br>Lane-Konfigurationen oder HDR, wird die MIPI-Konfiguration des aktuellen Betriebsmodus geliefert. |

2.3 Die Callbacks gemäß struct v4l2_subdev_pad_ops implementieren, insbesondere:

<!-- Source: English PDF p60, table unit 468 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .enum_mbus_code | Vom aktuellen CIS-Treiber unterstützte Datenformate aufzählen |
| .enum_frame_size | Vom aktuellen CIS-Treiber unterstützte Auflösungen aufzählen |
| .get_fmt | Der RKISP-Treiber fragt darüber das CIS-Ausgabeformat ab; zwingend zu implementieren.<br>Formate für Bayer-RAW-, SoC-YUV- und Schwarzweiß-RAW-Sensoren siehe MEDIA_BUS_FMT-Tabelle.<br>Zur Halbbildausgabe siehe struct v4l2_mbus_framefmt. |
| .set_fmt | Ausgabeformat und Auflösung des CIS-Treibers setzen; zwingend zu implementieren |
| .enum_frame_interval | Unterstützte Sensor-Bildintervalle einschließlich Auflösung aufzählen |
| .get_selection | Beschnittparameter konfigurieren. ISP-Eingangsbreite auf 16,<br>Eingangshöhe auf 8 ausrichten. |

2.4 Gemäß struct v4l2_ctrl_ops insbesondere folgende Callbacks implementieren:

<!-- Source: English PDF p60, table unit 470 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .s_ctrl | RKISP-Treiber und camera_engine steuern durch verschiedene Befehle die CIS-Belichtung. |

Implementieren Sie die einzelnen Steuer-IDs anhand der V4L2-Control-Liste des CIS-Treibers. Die folgenden IDs dienen der Informationsabfrage und werden als standardmäßige Integer-Menü-Steuerelemente implementiert:

<!-- Source: English PDF p61, table unit 472 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| V4L2_CID_LINK_FREQ | Siehe Standarddefinition in der V4L2-Control-Liste des CIS-Treibers.<br>Der RKISP-Treiber ermittelt damit derzeit die MIPI-Busfrequenz. |
| V4L2_CID_PIXEL_RATE | Für MIPI: pixel_rate = link_freq * 2 * nr_of_lanes / bits_per_sample |
| V4L2_CID_HBLANK | Siehe Standarddefinition in der V4L2-Control-Liste des CIS-Treibers |
| V4L2_CID_VBLANK | Siehe Standarddefinition in der V4L2-Control-Liste des CIS-Treibers |

RK camera_engine ermittelt mit diesen Befehlen die zur Belichtungsberechnung nötigen Informationen. Es gelten folgende Formeln:

##### Formeln

```text
line_time = HTS / PIXEL_RATE;
PIXEL_RATE = HTS * VTS * FPS
HTS = sensor_width_out + HBLANK;
VTS = sensor_height_out + VBLANK;
```

Die folgenden IDs dienen der Steuerung; darüber steuert RK camera_engine das CIS:

<!-- Source: English PDF p61, table unit 480 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| V4L2_CID_VBLANK | VBLANK und damit Bildrate sowie maximale Belichtungszeit anpassen |
| V4L2_CID_EXPOSURE | Belichtungszeit setzen; Einheit: Anzahl belichteter Zeilen |
| V4L2_CID_ANALOGUE_GAIN | Belichtungsverstärkung setzen; Gesamtverstärkung = analoge Verstärkung*digitaler Verstärkung.<br>Einheit: Verstärkungsregisterwert. |

##### 3. Der CIS-Treiber definiert keine Hardware-Datenschnittstelleninformationen. Die Verbindung zwischen CIS-Gerät und AP wird durch den Port des DTS-Geräteknotens beschrieben; siehe Port-Informationen unter CIS-Geräteregistrierung (DTS). 4. Liste der CIS-Referenztreiber

## VCM-Treiber

### VCM-Geräteregistrierung (DTS)

##### Private Parameter des RK-VCM-Treibers

<!-- Source: English PDF p62, table unit 485 -->

| Name | Beschreibung |
| --- | --- |
| Anlaufstrom | Strom, bei dem die VCM das Objektiv gerade vom nahen Ende seines mechanischen<br>Verfahrwegs aus bewegen kann; dieses entspricht dem Fernfokus des Moduls.<br>Der dabei vom VCM-Treiber-IC gelieferte Strom ist der Anlaufstrom. |
| Nennstrom | Strom, bei dem die VCM das Objektiv gerade bis zum fernen Ende seines mechanischen<br>Verfahrwegs bewegen kann; dieses entspricht dem Nahfokus des Moduls.<br>Der dabei vom VCM-Treiber-IC gelieferte Strom ist der Nennstrom. |
| VCM-Stromausgabemodus | Während der VCM-Bewegung treten Schwingungen auf. Änderungen des Treiberstroms<br>müssen deren Periode berücksichtigen, um sie zu minimieren. Der Ausgabemodus bestimmt<br>die Zeit bis zum Erreichen des Zielstroms. |

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

### Beschreibung des VCM-Treibers

#### Kurze Beschreibung der Datentypen

##### struct i2c_driver

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

<!-- Source: English PDF p63, table unit 495 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| @driver | Enthält im Gerätetreibermodell hauptsächlich Treibername und of_match_table<br>zum Abgleich mit dem im DTS registrierten Gerät. Stimmen die compatible-Felder<br>von of_match_table und DTS überein, wird .probe aufgerufen. |
| @id_table | Liste der unterstützten I2C-Geräte. Verwendet der Kernel nicht of_match_table<br>und DTS-Geräteregistrierung zum Abgleich, greift er auf diese Tabelle zurück. |
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

##### struct v4l2_subdev_core_ops

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

<!-- Source: English PDF p64, table unit 504 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .ioctl | Wird am Ende der ioctl()-Systemaufrufbehandlung im V4L2-Kern aufgerufen<br>und unterstützt treiberspezifische private ioctls. |
| .compat_ioctl32 | Wird bei einer 32-Bit-Anwendung auf einem 64-Bit-Kernel aufgerufen,<br>um Daten beim Austausch mit dem Userspace anzupassen. |

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

##### struct v4l2_ctrl_ops

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

<!-- Source: English PDF p65, table unit 515 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .g_volatile_ctrl | Neuen Steuerwert abfragen. Üblicherweise nur für volatile, meist schreibgeschützte<br>Steuerelemente relevant, beispielsweise eine fortlaufend veränderliche Signalstärke. |
| .s_ctrl | Neuen Steuerwert tatsächlich setzen; s_ctrl ist verpflichtend. Während des Aufrufs<br>wird ctrl-&gt;handler-&gt;lock gehalten, sodass niemand sonst auf die<br>Steuerelemente dieses Handlers zugreifen kann. |

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

#### Kurze API-Beschreibung

##### xxxx_get_ctrl

[Beschreibung]

Bewegungsposition des Motors abfragen.

[Syntax]

```text
  static int xxxx_get_ctrl(struct v4l2_ctrl *ctrl)
```

[Parameter]

<!-- Source: English PDF p65, table unit 527 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *ctrl | Zeiger auf die V4L2-Steuerstruktur | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p66, table unit 529 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

##### xxxx_set_ctrl

[Beschreibung]

Bewegungsposition des Motors setzen.

[Syntax]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[Parameter]

<!-- Source: English PDF p66, table unit 536 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *ctrl | Zeiger auf die V4L2-Steuerstruktur | Eingabe |

[Rückgabewert]

<!-- Source: English PDF p66, table unit 538 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

```text
xxxx_ioctl xxxx_compat_ioctl
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

<!-- Source: English PDF p66, table unit 546 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *sd | Zeiger auf die V4L2-Subdevice-Struktur | Eingabe |
| cmd | ioctl-Befehl | Eingabe |
| *arg/arg | Parameterzeiger | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p67, table unit 548 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

#### Schritte zur Treiberportierung

##### 1. Standardmäßigen I2C-Subdevice-Treiberteil implementieren

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

V4L2-Subdevice: v4l2_i2c_subdev_init. Der RK-VCM-Treiber verlangt einen eigenen Subdevice-Geräteknoten für camera_engine im Userspace; darüber wird die Fokussierung gesteuert.

Media-Entity: media_entity_init;

3\. Der RK-AF-Algorithmus definiert den gesamten Verfahrweg des Objektivs als Positionsbereich [0,64]. Dem entspricht der VCM-Strombereich [Anlaufstrom, Nennstrom]. Die Umrechnung zwischen beiden Bereichen sollte in einer Funktion implementiert werden.

##### 2. V4L2-Subdevice-Treiber implementieren, insbesondere die folgenden 2 Mitglieder

```text
  struct v4l2_subdev_core_ops
  struct v4l2_ctrl_ops
```

2.1 Gemäß v4l2_subdev_core_ops insbesondere folgende Callbacks implementieren:

```text
.ioctl.compat_ioctl32
```

Dieser Callback implementiert vor allem folgende private RK-Steuerbefehle:

<!-- Source: English PDF p68, table unit 572 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| RK_VIDIOC_VCM_TIMEINFO | camera_engine ermittelt damit die Dauer der Objektivbewegung und entscheidet,<br>wann das Objektiv stillsteht und ob sich die CIS-Belichtungszeit mit der Bewegung überschneidet.<br>Die Bewegungsdauer hängt von Weglänge und Stromausgabemodus des VCM-Treiber-IC ab. |

2.2 Gemäß v4l2_ctrl_ops insbesondere folgende Callbacks implementieren:

```text
.g_volatile_ctrl.s_ctrl
```

.g_volatile_ctrl und .s_ctrl implementieren folgende Befehle mit standardmäßigen V4L2-Steuerelementen:

<!-- Source: English PDF p68, table unit 576 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| V4L2_CID_FOCUS_ABSOLUTE | camera_engine setzt und liest damit die absolute Objektivposition.<br>Der RK-AF-Algorithmus definiert den gesamten Verfahrweg als [0,64]. |

## Blitzlichttreiber

### Blitzlicht-Geräteregistrierung (DTS)

##### DTS-Referenz für SGM378

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

##### DTS-Referenz für GPIO-/PWM-Steuerung

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

##### Hinweise

1\. Die Software muss je nach Aufhelllichttyp unterschiedliche Abläufe verwenden. Bei Infrarot-Aufhelllicht muss das DTS-Knotenlabel ir enthalten, um den Hardwaretyp zu kennzeichnen. Bei LED-Aufhelllicht kann das Feld ir entfallen.

2\. Bei dieser über einen einzelnen Pin gesteuerten Schaltung gibt es zwei Fälle: Feste Helligkeit wird direkt per GPIO gesteuert; regelbare Helligkeit per PWM über das Tastverhältnis. Wählen Sie im DTS entweder pwms oder enable-gpio.

### Beschreibung des Blitzlichttreibers

#### Kurze Beschreibung der Datentypen

##### struct i2c_driver

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

<!-- Source: English PDF p70, table unit 597 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| @driver | Enthält im Gerätetreibermodell hauptsächlich Treibername und of_match_table<br>zum Abgleich mit dem im DTS registrierten Gerät. Stimmen die compatible-Felder<br>von of_match_table und DTS überein, wird .probe aufgerufen. |
| @id_table | Liste der unterstützten I2C-Geräte. Verwendet der Kernel nicht of_match_table<br>und DTS-Geräteregistrierung zum Abgleich, greift er auf diese Tabelle zurück. |
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

##### struct v4l2_subdev_core_ops

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

<!-- Source: English PDF p71, table unit 607 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .ioctl | Wird am Ende der ioctl()-Systemaufrufbehandlung im V4L2-Kern aufgerufen<br>und unterstützt treiberspezifische private ioctls. |
| .compat_ioctl32 | Wird bei einer 32-Bit-Anwendung auf einem 64-Bit-Kernel aufgerufen,<br>um Daten beim Austausch mit dem Userspace anzupassen. |

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

##### struct v4l2_ctrl_ops

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

<!-- Source: English PDF p72, table unit 618 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .g_volatile_ctrl | Neuen Steuerwert abfragen. Üblicherweise nur für volatile, meist schreibgeschützte<br>Steuerelemente relevant, beispielsweise eine fortlaufend veränderliche Signalstärke. |
| .s_ctrl | Neuen Steuerwert tatsächlich setzen; s_ctrl ist verpflichtend. Während des Aufrufs<br>wird ctrl-&gt;handler-&gt;lock gehalten, sodass niemand sonst auf die<br>Steuerelemente dieses Handlers zugreifen kann. |

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

#### Kurze API-Beschreibung

##### xxxx_set_ctrl

[Beschreibung]

Blitzmodus, Strom und Blitzzeitbegrenzung einstellen.

[Syntax]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[Parameter]

<!-- Source: English PDF p72, table unit 628 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *ctrl | Zeiger auf die V4L2-Steuerstruktur | Eingabe |

[Rückgabewert]

<!-- Source: English PDF p72, table unit 630 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

##### xxxx_get_ctrl

[Beschreibung]

Fehlerstatus des Blitzlichts abfragen.

[Syntax]

```text
  static int xxxx_get_ctrl(struct v4l2_ctrl *ctrl)
```

[Parameter]

<!-- Source: English PDF p73, table unit 637 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *ctrl | Zeiger auf die V4L2-Steuerstruktur | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p73, table unit 639 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

```text
xxxx_ioctl xxxx_compat_ioctl
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

<!-- Source: English PDF p73, table unit 647 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *sd | Zeiger auf die V4L2-Subdevice-Struktur | Eingabe |
| cmd | ioctl-Befehl | Eingabe |
| *arg/arg | Parameterzeiger | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p73, table unit 649 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

#### Schritte zur Treiberportierung

Für direkt per GPIO gesteuerte LEDs siehe kernel/drivers/leds/leds-rgb13h.c und kernel/Documentation/devicetree/bindings/leds/leds-rgb13h.txt.

Der Treiber des Blitzlicht-IC kann wie folgt portiert werden:

##### 1. Standardmäßigen I2C-Subdevice-Treiberteil implementieren

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

##### 2. V4L2-Subdevice-Treiber implementieren, insbesondere die folgenden 2 Mitglieder

```text
  struct v4l2_subdev_core_ops
  struct v4l2_ctrl_ops
```

2.1 Gemäß v4l2_subdev_core_ops insbesondere folgende Callbacks implementieren:

```text
.ioctl.compat_ioctl32
```

Dieser Callback implementiert vor allem folgende private RK-Steuerbefehle:

<!-- Source: English PDF p75, table unit 676 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| RK_VIDIOC_FLASH_TIMEINFO | camera_engine ermittelt damit den LED-Einschaltzeitpunkt und prüft,<br>ob die CIS-Belichtungszeit nach dem Einschalten des Blitzlichts liegt. |

2.2 Gemäß v4l2_ctrl_ops insbesondere folgende Callbacks implementieren:

```text
.g_volatile_ctrl.s_ctrl
```

.g_volatile_ctrl und .s_ctrl implementieren folgende Befehle mit standardmäßigen V4L2-Steuerelementen:

<!-- Source: English PDF p75, table unit 680 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| V4L2_CID_FLASH_FAULT | Blitzlichtfehlerinformationen abfragen |
| V4L2_CID_FLASH_LED_MODE | LED-Modus einstellen:<br>V4L2_FLASH_LED_MODE_NONE<br>V4L2_FLASH_LED_MODE_TORCH<br>V4L2_FLASH_LED_MODE_FLASH |
| V4L2_CID_FLASH_STROBE | Blitzlicht einschalten |
| V4L2_CID_FLASH_STROBE_STOP | Blitzlicht ausschalten |
| V4L2_CID_FLASH_TIMEOUT | Maximale ununterbrochene Leuchtdauer im Blitzmodus einstellen |
| V4L2_CID_FLASH_INTENSITY | Strom im Blitzmodus einstellen |
| V4L2_CID_FLASH_TORCH_INTENSITY | Strom im Dauerlichtmodus einstellen |

## Treiber für FOCUS, ZOOM und P-IRIS

Dieser Treiber steuert Autofokus (FOCUS), Zoom (ZOOM) und automatische Blende (P-IRIS) über Schrittmotoren. Wegen der gleichen Motorsteuerung und des Hardwaredesigns sind die drei Funktionen in einem Treiber zusammengefasst. Je nach Treiberchip kann dieser beispielsweise als SPI-Subdevice eingebunden werden. Dieses Kapitel erläutert anhand der Chips MP6507 und MS41908 die erforderlichen Datenstrukturen, das Framework und wichtige Hinweise.

### MP6507-Geräteregistrierung (DTS)

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

##### Private RK-Definitionen

<!-- Source: English PDF p78, table unit 688 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| rockchip,<br>camera-<br>module-index | Kameranummer zur Zuordnung der Kamera |
| rockchip,<br>camera-<br>module-facing | Kameraausrichtung zur Zuordnung der Kamera |
| iris_en-gpios | GPIO zur IRIS-Aktivierung |
| focus_en-gpios | GPIO zur Fokusaktivierung |
| zoom_en-gpios | GPIO zur Zoomaktivierung |
| rockchip,iris-<br>step-max | Maximale Schrittzahl des P-IRIS-Schrittmotors |
| rockchip,focus-<br>step-max | Maximale Schrittzahl des Fokus-Schrittmotors |
| zoom-step-<br>max | Maximale Schrittzahl des Zoom-Schrittmotors |
| iris-start-up-<br>speed | Startgeschwindigkeit des IRIS-Schrittmotors |
| focus-start-up-<br>speed | Startgeschwindigkeit des Fokus-Schrittmotors |
| focus-max-<br>speed | Maximale Betriebsgeschwindigkeit des Fokus-Schrittmotors |
| zoom-start-up-<br>speed | Startgeschwindigkeit des Zoom-Schrittmotors |
| zoom-max-<br>speed | Maximale Betriebsgeschwindigkeit des Zoom-Schrittmotors |
| focus-first-<br>speed-step | Schrittzahl bei Fokus-Startgeschwindigkeit. In nachfolgenden Beschleunigungsstufen<br>wird sie proportional erhöht, damit die Laufzeiten aller Geschwindigkeitsstufen<br>möglichst gleich sind. |
| zoom-first-<br>speed-step | Schrittzahl bei Zoom-Startgeschwindigkeit. In nachfolgenden Beschleunigungsstufen<br>wird sie proportional erhöht, damit die Laufzeiten aller Geschwindigkeitsstufen<br>möglichst gleich sind. |
| focus-speed-<br>up-table | Fokus-Beschleunigungskurve als Nachschlagetabelle. Durch Parameteranpassung<br>eine trapezförmige oder S-förmige Kurve erzeugen und deren Daten konfigurieren.<br>Ohne Konfiguration oder mit nur einem Wert läuft der Motor konstant mit Startgeschwindigkeit.<br>Der kleinste Kurvenwert darf die maximale Anlaufgeschwindigkeit nicht überschreiten,<br>der größte nicht die maximale Betriebsgeschwindigkeit des Motors. |
| focus-speed-<br>down-table | Fokus-Verzögerungskurve. Ihr Maximum muss unter dem Maximum der<br>Beschleunigungskurve liegen. Ist die Beschleunigungskurve ungültig, gilt dies auch<br>für die Verzögerungskurve; der Motor läuft durchgehend mit Startgeschwindigkeit.<br>Ohne eigene Verzögerungskurve wird sie symmetrisch aus der Beschleunigungskurve abgeleitet. |
| zoom-speed-<br>up-table | Zoom-Beschleunigungskurve als Nachschlagetabelle. Durch Parameteranpassung<br>eine trapezförmige oder S-förmige Kurve erzeugen und deren Daten konfigurieren.<br>Ohne Konfiguration oder mit nur einem Wert läuft der Motor konstant mit Startgeschwindigkeit.<br>Der kleinste Kurvenwert darf die maximale Anlaufgeschwindigkeit nicht überschreiten,<br>der größte nicht die maximale Betriebsgeschwindigkeit des Motors. |
| zoom-speed-<br>down-table | Zoom-Verzögerungskurve. Ihr Maximum muss unter dem Maximum der<br>Beschleunigungskurve liegen. Ist die Beschleunigungskurve ungültig, gilt dies auch<br>für die Verzögerungskurve; der Motor läuft durchgehend mit Startgeschwindigkeit.<br>Ohne eigene Verzögerungskurve wird sie symmetrisch aus der Beschleunigungskurve abgeleitet. |

#### Kurze Beschreibung der Datentypen

##### struct platform_driver

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

<!-- Source: English PDF p80, table unit 698 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| @driver | struct device_driver enthält hauptsächlich Treibername und of_match_table<br>zum Abgleich mit DTS-Geräten. Stimmen die compatible-Felder von of_match_table<br>und DTS überein, wird .probe aufgerufen. |
| @id_table | Verwendet der Kernel nicht of_match_table und DTS-Geräte zum Abgleich,<br>verwendet er diese Tabelle. |
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

##### struct v4l2_subdev_core_ops

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

<!-- Source: English PDF p81, table unit 707 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .ioctl | Wird am Ende der ioctl()-Systemaufrufbehandlung im V4L2-Kern aufgerufen<br>und unterstützt treiberspezifische private ioctls. |
| .compat_ioctl32 | Wird bei einer 32-Bit-Anwendung auf einem 64-Bit-Kernel aufgerufen,<br>um Daten beim Austausch mit dem Userspace anzupassen. |

[Beispiel]

```text
  static const struct v4l2_subdev_core_ops motor_core_ops = {
      .ioctl = motor_ioctl,
  };
  static const struct v4l2_subdev_ops motor_subdev_ops = {
      .core   = &motor_core_ops,
  };
```

##### struct v4l2_ctrl_ops

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

<!-- Source: English PDF p81, table unit 716 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .g_volatile_ctrl | Neuen Steuerwert abfragen. Üblicherweise nur für volatile, meist schreibgeschützte<br>Steuerelemente relevant, beispielsweise eine fortlaufend veränderliche Signalstärke. |
| .s_ctrl | Neuen Steuerwert tatsächlich setzen; s_ctrl ist verpflichtend. Während des Aufrufs<br>wird ctrl-&gt;handler-&gt;lock gehalten, sodass niemand sonst auf die<br>Steuerelemente dieses Handlers zugreifen kann. |

[Beispiel]

```text
  static const struct v4l2_ctrl_ops motor_ctrl_ops = {
      .s_ctrl = motor_s_ctrl,
  };
```

#### Kurze API-Beschreibung

##### xxxx_set_ctrl

[Beschreibung]

Fokus-, Zoom- und P-Blendenposition über standardmäßiges v4l2_control setzen.

Folgende standardmäßige V4L2-Befehle sind implementiert:

<!-- Source: English PDF p82, table unit 724 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| V4L2_CID_FOCUS_ABSOLUTE | Fokus steuern. Laut Quelle bedeutet 0 die kleinste Brennweite<br>und eine scharfe Nahaufnahme. |
| V4L2_CID_ZOOM_ABSOLUTE | Zoomfaktor steuern. 0 bedeutet kleinster Zoomfaktor und größtes Sichtfeld. |
| V4L2_CID_IRIS_ABSOLUTE | Öffnung der P-Blende steuern. 0 bedeutet geschlossene Blende. |

[Syntax]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[Parameter]

<!-- Source: English PDF p82, table unit 728 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *ctrl | Zeiger auf die V4L2-Steuerstruktur | Eingabe |

[Rückgabewert]

<!-- Source: English PDF p82, table unit 730 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

##### xxxx_get_ctrl

[Beschreibung]

Aktuelle Fokus-, Zoom- und P-Blendenposition über standardmäßiges v4l2_control abfragen.

Folgende standardmäßige V4L2-Befehle sind implementiert:

<!-- Source: English PDF p82, table unit 735 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| V4L2_CID_FOCUS_ABSOLUTE | Fokus steuern. Laut Quelle bedeutet 0 die kleinste Brennweite<br>und eine scharfe Nahaufnahme. |
| V4L2_CID_ZOOM_ABSOLUTE | Zoomfaktor steuern. 0 bedeutet kleinster Zoomfaktor und größtes Sichtfeld. |
| V4L2_CID_IRIS_ABSOLUTE | Öffnung der P-Blende steuern. 0 bedeutet geschlossene Blende. |

[Syntax]

```text
  static int xxxx_get_ctrl(struct v4l2_ctrl *ctrl)
```

[Parameter]

<!-- Source: English PDF p83, table unit 739 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *ctrl | Zeiger auf die V4L2-Steuerstruktur | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p83, table unit 741 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

```text
xxxx_ioctl xxxx_compat_ioctl
```

[Beschreibung]

Das eigene ioctl ermittelt hauptsächlich Zeitinformationen für Fokus, Zoom und P-Blende, also Zeitstempel von Bewegungsbeginn und -ende. Da das verwendete Objektiv keine Positionserfassung besitzt, muss die Motorposition bei Bedarf zurückgesetzt werden.

##### Implementierte Erweiterungen

<!-- Source: English PDF p83, table unit 746 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| RK_VIDIOC_VCM_TIMEINFO | Fokussierungszeitinformationen zur Prüfung, ob das aktuelle Bild<br>nach Abschluss der Fokussierung gültig ist |
| RK_VIDIOC_ZOOM_TIMEINFO | Zoomzeitinformationen zur Prüfung, ob das aktuelle Bild<br>nach Abschluss des Zoomens gültig ist |
| RK_VIDIOC_IRIS_TIMEINFO | Blendenzeitinformationen zur Prüfung, ob das aktuelle Bild<br>nach Abschluss der Blendenanpassung gültig ist |
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

<!-- Source: English PDF p84, table unit 750 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *sd | Zeiger auf die V4L2-Subdevice-Struktur | Eingabe |
| cmd | ioctl-Befehl | Eingabe |
| *arg/arg | Parameterzeiger | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p84, table unit 752 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

#### Schritte zur Treiberportierung

Bei SPI-gesteuerten Treiberchips kann die Portierung auf dem SPI-Framework aufbauen. Der RK-Referenztreiber verwendet MP6507: PWM erzeugt direkt die Steuerwellenformen, MP6507 übernimmt die Leistungsverstärkung. Daher wird das Plattformframework direkt verwendet. Treiberreferenz: /kernel/drivers/media/i2c/mp6507.c

Portierungsschritte:

##### 1. Standardmäßigen Plattform-Subdevice-Treiberteil implementieren

1.1 Gemäß struct platform_driver insbesondere folgende Teile implementieren:

struct driver.name

struct driver. of_match_table

probe-Funktion

remove-Funktion

1.2 Einzelheiten zur Implementierung von probe:

1\. Geräteressourcen anfordern, hauptsächlich aus dem DTS; siehe MP6507-Geräteregistrierung (DTS).

1.1) Private RK-Ressourcen wie rockchip, camera-module-xxx stellen hauptsächlich Geräteparameter für die Zuordnung zum Kameragerät bereit.

1.2) PWM-Konfiguration abrufen. Die Motorsteuerung verlangt 90 Grad Phasenverschiebung zwischen A und B. Dies lässt sich durch mittenausgerichtete PWM der B-Phase erreichen. Setzen Sie center-aligned am DTS-PWM-Knoten; siehe MP6507-Geräteregistrierung (DTS).

![Englische Originalabbildung 6, PDF-Seite 85](/docs/rockchip-vi-driver/assets/en-p85-X457.png)

*Englische Originalabbildung 6, PDF-Seite 85*

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

##### 2. V4L2-Subdevice-Treiber implementieren, insbesondere die folgenden 2 Mitglieder

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

<!-- Source: English PDF p86, table unit 783 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| RK_VIDIOC_VCM_TIMEINFO | Fokussierungszeitinformationen zur Prüfung, ob das aktuelle Bild<br>nach Abschluss der Fokussierung gültig ist |
| RK_VIDIOC_ZOOM_TIMEINFO | Zoomzeitinformationen zur Prüfung, ob das aktuelle Bild<br>nach Abschluss des Zoomens gültig ist |
| RK_VIDIOC_IRIS_TIMEINFO | Blendenzeitinformationen zur Prüfung, ob das aktuelle Bild<br>nach Abschluss der Blendenanpassung gültig ist |
| RK_VIDIOC_FOCUS_CORRECTION | Fokusposition korrigieren beziehungsweise zurücksetzen |
| RK_VIDIOC_ZOOM_CORRECTION | Zoomposition korrigieren beziehungsweise zurücksetzen |
| RK_VIDIOC_IRIS_CORRECTION | Blendenposition korrigieren beziehungsweise zurücksetzen |

2.2 Gemäß v4l2_ctrl_ops insbesondere folgende Callbacks implementieren:

```text
.g_volatile_ctrl
.s_ctrl
```

.g_volatile_ctrl und .s_ctrl implementieren folgende Befehle mit standardmäßigen V4L2-Steuerelementen:

<!-- Source: English PDF p86, table unit 788 -->

| Parametername | Beschreibung |
| --- | --- |
| V4L2_CID_FOCUS_ABSOLUTE | Fokus steuern. Laut Quelle bedeutet 0 die kleinste Brennweite<br>und eine scharfe Nahaufnahme. |
| V4L2_CID_ZOOM_ABSOLUTE | Zoomfaktor steuern. 0 bedeutet kleinster Zoomfaktor und größtes Sichtfeld. |
| V4L2_CID_IRIS_ABSOLUTE | Öffnung der P-Blende steuern. 0 bedeutet geschlossene Blende. |

##### 3. Referenz für die Beschleunigungskurve des Schrittmotors

3.1 Trapezkurve: Wie abgebildet kann mit gleichen Intervallen und Geschwindigkeitsänderungen beschleunigt und verzögert werden.

![Englische Originalabbildung 7, PDF-Seite 86](/docs/rockchip-vi-driver/assets/en-p86-X460.png)

*Englische Originalabbildung 7, PDF-Seite 86*

3.2 S-Kurve

Liefert die trapezförmige Beschleunigung kein gutes Ergebnis, kann eine S-förmige verwendet werden. Referenzformel: Speed = Vmin + ((Vmax-Vmin) / (1 + exp(-fac * (i-Num) / Num))); dabei ist Vmin die Anlaufgeschwindigkeit, Vmax die Zielgeschwindigkeit und fac der Kurvenkoeffizient, üblicherweise 4~6. Größere Werte machen die Kurvenmitte steiler. i ist die Nummer der Geschwindigkeitsstufe; bei 32 Stufen liegt sie in 0~31. Num ist die halbe Stufenanzahl; bei 32 Stufen beträgt num 16.

![Englische Originalabbildung 8, PDF-Seite 87](/docs/rockchip-vi-driver/assets/en-p87-X463.png)

*Englische Originalabbildung 8, PDF-Seite 87*

### MS41908-Geräteregistrierung (DTS)

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

#### Grundlegende Beschreibung

<!-- Source: English PDF p88, table unit 800 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| pinctrl-0 | SPI-Pindefinition gemäß tatsächlicher Pinbelegung zur Zuordnung der SPI-Funktion.<br>Beispiel: pinctrl-0 = &lt;&amp;spi0m0_clk &amp;spi0m0_cs0n &amp;spi0m0_miso<br>&amp;spi0m0_mosi&gt;; |
| assigned-clocks<br>assigned-clock-<br>rates | SPI-Taktkonfiguration; empfohlen sind 100MHz. |
| reg | reg = &lt;0&gt;; verwendet cs0<br>reg = &lt;1&gt;; verwendet cs1 |
| rockchip,camera-<br>module-index | Kameranummer zur Zuordnung zur Kamera |
| rockchip,camera-<br>module-facing | Kameraausrichtung zur Zuordnung zur Kamera |
| reset-gpios | Reset-Pin von ms41908; bei festem Hardware-Pullup kann die Konfiguration entfallen. |
| vd_fz-period-us | Periode des Impulses zur Aktualisierung der Schrittmotortreiberregister.<br>Beide Motoren verwenden dasselbe Impulssignal. Überschreitet die Bewegung die vd-Periode,<br>gehen Schritte verloren. Der Treiber hält die Dauer einer Einzelbewegung innerhalb dieser Periode. |

#### FOCUS-Beschreibung

<!-- Source: English PDF p89, table unit 802 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| use-focus | Gibt an, ob die Fokusfunktion verwendet wird |
| focus-<br>used-pin | Jeder ms41908 steuert zwei Schrittmotoren über die Pingruppen „ab“ und „cd“.<br>Entsprechend der tatsächlichen Hardwareverdrahtung konfigurieren. |
| focus-<br>backlash | Durch Zahnradspiel verursachter Fehler: bei Richtungswechsel zu kompensierende<br>Schrittzahl, durch Tests am tatsächlichen Objektiv bestimmen. |
| focus-<br>start-up-<br>speed | Anlaufgeschwindigkeit des Schrittmotors in PPS |
| focus-<br>step-max | Effektiver Bewegungsbereich des Motors in Schritten |
| focus-<br>ppw | PWM-Tastverhältnis der ms41908-Ausgabe, 0-255. Größere Werte erhöhen<br>die Treiberleistung; entsprechend der Motorlast einstellen. |
| focus-<br>phmode | Phasenkorrektur der ms41908-PWM-Ausgabe; normalerweise nicht konfiguriert,<br>bei Bedarf einstellen. |
| focus-<br>micro | Mikroschritt-Unterteilung: 64, 128 oder 256; Standard: 256. |
| focus-<br>reback-<br>distance | Für genaue Positionen muss die Fokuskurve aus derselben Richtung angefahren werden.<br>Beispiel: Von Position 100 zu 90 zuerst bis 80 zurückfahren und anschließend 90 anfahren.<br>Der Parameter gibt die zusätzliche Rückfahr-Schrittzahl an. |
| focus-1-<br>2phase-<br>excitation | Standard ist 2-2-Phasen-Erregung; dieser Parameter wählt 1-2-Phasen-Erregung.<br>Beispiel: focus-1-2phase-excitation; |
| focus-dir-<br>opposite | Verläuft die Motorbewegung entgegengesetzt zur tatsächlichen Fokuskurve,<br>kehrt dieser Parameter die Richtung um. Beispiel: focus-dir-opposite; |

##### Optokopplerbeschreibung

<!-- Source: English PDF p90, table unit 804 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| focus-pic | C-Pin des Optokopplers zur Erkennung des Pegelwechsels.<br>Der Übergangspunkt ist der Ursprung des Optokopplers. |
| focus-<br>pia | A-Pin des Optokopplers zur Ansteuerung der Fotodiode. Bei Kalibrierung auf High,<br>im Normalbetrieb auf Low setzen; andernfalls beeinflusst die Fotodiode die Bildaufnahme. |
| focus-<br>pie | Kann hardwareseitig direkt an Masse liegen. Bei GPIO-Steuerung<br>muss der Pin auf Low gesetzt werden. |
| focus-<br>min-pos | Schrittzahlen links und rechts des Optokopplerursprungs messen und im DTS eintragen.<br>Die eingetragenen Werte dürfen größer als die tatsächlichen sein. |
| focus-<br>min-pos | Schrittzahlen links und rechts des Optokopplerursprungs messen und im DTS eintragen.<br>Die eingetragenen Werte dürfen größer als die tatsächlichen sein. |

Hinweis: Objektive ohne Optokoppler-Positionserfassung benötigen keine Optokopplerparameter.

#### ZOOM-Beschreibung

<!-- Source: English PDF p91, table unit 807 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| use-zoom | Gibt an, ob die Zoomfunktion verwendet wird |
| zoom-<br>used-pin | Jeder ms41908 steuert zwei Schrittmotoren über die Pingruppen „ab“ und „cd“.<br>Entsprechend der tatsächlichen Hardwareverdrahtung konfigurieren. |
| zoom-<br>backlash | Durch Zahnradspiel verursachter Fehler: bei Richtungswechsel zu kompensierende<br>Schrittzahl, durch Tests bestimmen. |
| zoom-<br>start-up-<br>speed | Anlaufgeschwindigkeit des Schrittmotors in PPS |
| zoom-<br>step-max | Effektiver Bewegungsbereich des Motors in Schritten |
| zoom-<br>ppw | PWM-Tastverhältnis der ms41908-Ausgabe, 0-255. Größere Werte erhöhen<br>die Treiberleistung; entsprechend der Motorlast einstellen. |
| zoom-<br>phmode | Phasenkorrektur der ms41908-PWM-Ausgabe; normalerweise nicht konfiguriert,<br>bei Bedarf einstellen. |
| zoom-<br>micro | Mikroschritt-Unterteilung: 64, 128 oder 256; Standard: 256. |
| zoom-1-<br>2phase-<br>excitation | Standard ist 2-2-Phasen-Erregung; dieser Parameter wählt 1-2-Phasen-Erregung.<br>Beispiel: zoom-1-2phase-excitation; |
| zoom-dir-<br>opposite | Verläuft die Motorbewegung entgegengesetzt zur tatsächlichen Fokuskurve,<br>kehrt dieser Parameter die Richtung um. Beispiel: zoom-dir-opposite; |

##### Optokopplerbeschreibung

<!-- Source: English PDF p91, table unit 809 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| zoom-<br>pic | C-Pin des Optokopplers zur Erkennung des Pegelwechsels.<br>Der Übergangspunkt ist der Ursprung des Optokopplers. |
| zoom-<br>min-pos | Schrittzahlen links und rechts des Optokopplerursprungs messen und im DTS eintragen.<br>Die eingetragenen Werte dürfen größer als die tatsächlichen sein. |
| zoom-<br>min-pos | Schrittzahlen links und rechts des Optokopplerursprungs messen und im DTS eintragen.<br>Die eingetragenen Werte dürfen größer als die tatsächlichen sein. |

Hinweis: Objektive ohne Optokoppler-Positionserfassung benötigen keine Optokopplerparameter.

#### ZOOM1-Beschreibung

<!-- Source: English PDF p92, table unit 812 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| use-<br>zoom1 | Gibt an, ob zoom1 verwendet wird; manche Objektive unterstützen zwei Zoomgruppen. |
| zoom1-<br>used-pin | Jeder ms41908 steuert zwei Schrittmotoren über die Pingruppen „ab“ und „cd“.<br>Entsprechend der tatsächlichen Hardwareverdrahtung konfigurieren. |
| zoom1-<br>backlash | Durch Zahnradspiel verursachter Fehler: bei Richtungswechsel zu kompensierende<br>Schrittzahl, durch Tests bestimmen. |
| zoom1-<br>start-up-<br>speed | Anlaufgeschwindigkeit des Schrittmotors in PPS |
| zoom1-<br>step-max | Effektiver Bewegungsbereich des Motors in Schritten |
| zoom1-<br>ppw | PWM-Tastverhältnis der ms41908-Ausgabe, 0-255. Größere Werte erhöhen<br>die Treiberleistung; entsprechend der Motorlast einstellen. |
| zoom1-<br>phmode | Phasenkorrektur der ms41908-PWM-Ausgabe; normalerweise nicht konfiguriert,<br>bei Bedarf einstellen. |
| zoom1-<br>micro | Mikroschritt-Unterteilung: 64, 128 oder 256; Standard: 256. |
| zoom1-1-<br>2phase-<br>excitation | Standard ist 2-2-Phasen-Erregung; dieser Parameter wählt 1-2-Phasen-Erregung.<br>Beispiel: zoom1-1-2phase-excitation; |
| zoom1-<br>dir-<br>opposite | Verläuft die Motorbewegung entgegengesetzt zur tatsächlichen Fokuskurve,<br>kehrt dieser Parameter die Richtung um. Beispiel: zoom1-dir-opposite; |

##### Optokopplerbeschreibung

<!-- Source: English PDF p93, table unit 814 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| zoom1-<br>pic | C-Pin des Optokopplers zur Erkennung des Pegelwechsels.<br>Der Übergangspunkt ist der Ursprung des Optokopplers. |
| zoom1-<br>pia | A-Pin des Optokopplers zur Ansteuerung der Fotodiode. Bei Kalibrierung auf High,<br>im Normalbetrieb auf Low setzen; andernfalls beeinflusst die Fotodiode die Bildaufnahme. |
| zoom1-<br>pie | Kann hardwareseitig direkt an Masse liegen. Bei GPIO-Steuerung<br>muss der Pin auf Low gesetzt werden. |
| zoom1-<br>min-pos | Schrittzahlen links und rechts des Optokopplerursprungs messen und im DTS eintragen.<br>Die eingetragenen Werte dürfen größer als die tatsächlichen sein. |
| zoom1-<br>min-pos | Schrittzahlen links und rechts des Optokopplerursprungs messen und im DTS eintragen.<br>Die eingetragenen Werte dürfen größer als die tatsächlichen sein. |

Hinweis: Objektive ohne Optokoppler-Positionserfassung benötigen keine Optokopplerparameter.

#### PIRIS-Beschreibung

<!-- Source: English PDF p94, table unit 817 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| use-p-iris | Gibt an, ob P-IRIS verwendet wird |
| piris-<br>used-pin | Jeder ms41908 steuert zwei Schrittmotoren über die Pingruppen „ab“ und „cd“.<br>Entsprechend der tatsächlichen Hardwareverdrahtung konfigurieren. |
| piris-<br>backlash | Durch Zahnradspiel verursachter Fehler: bei Richtungswechsel zu kompensierende<br>Schrittzahl, durch Tests am tatsächlichen Objektiv bestimmen. |
| piris-<br>start-up-<br>speed | Anlaufgeschwindigkeit des Schrittmotors in PPS |
| piris-<br>step-max | Effektiver Bewegungsbereich des Motors in Schritten |
| piris-ppw | PWM-Tastverhältnis der ms41908-Ausgabe, 0-255. Größere Werte erhöhen<br>die Treiberleistung; entsprechend der Motorlast einstellen. |
| piris-<br>phmode | Phasenkorrektur der ms41908-PWM-Ausgabe; normalerweise nicht konfiguriert,<br>bei Bedarf einstellen. |
| piris-<br>micro | Mikroschritt-Unterteilung: 64, 128 oder 256; Standard: 256. |
| piris-1-<br>2phase-<br>excitation | Standard ist 2-2-Phasen-Erregung; dieser Parameter wählt 1-2-Phasen-Erregung.<br>Beispiel: piris-1-2phase-excitation; |
| piris-dir-<br>opposite | Verläuft die Motorbewegung entgegengesetzt zur tatsächlichen Fokuskurve,<br>kehrt dieser Parameter die Richtung um. Beispiel: piris-dir-opposite; |

##### Optokopplerbeschreibung

<!-- Source: English PDF p95, table unit 819 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| piris-pic | C-Pin des Optokopplers zur Erkennung des Pegelwechsels.<br>Der Übergangspunkt ist der Ursprung des Optokopplers. |
| piris-pia | A-Pin des Optokopplers zur Ansteuerung der Fotodiode. Bei Kalibrierung auf High,<br>im Normalbetrieb auf Low setzen; andernfalls beeinflusst die Fotodiode die Bildaufnahme. |
| piris-pie | Kann hardwareseitig direkt an Masse liegen. Bei GPIO-Steuerung<br>muss der Pin auf Low gesetzt werden. |
| piris-<br>min-pos | Schrittzahlen links und rechts des Optokopplerursprungs messen und im DTS eintragen.<br>Die eingetragenen Werte dürfen größer als die tatsächlichen sein. |
| piris-<br>min-pos | Schrittzahlen links und rechts des Optokopplerursprungs messen und im DTS eintragen.<br>Die eingetragenen Werte dürfen größer als die tatsächlichen sein. |

Hinweis: Objektive ohne Optokoppler-Positionserfassung benötigen keine Optokopplerparameter.

#### DCIRIS-Beschreibung

<!-- Source: English PDF p95, table unit 822 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| use-dc-<br>iris | Gibt an, ob DC-IRIS verwendet wird |
| vd_iris-<br>gpios | Synchronimpulspin zur Übernahme der DC-Blendenregister |
| dc-iris-<br>reserved-<br>polarity | Polarität der DC-Blende. Bedeutet 0 vollständig geöffnet,<br>kann diese Property die Richtung umkehren. |
| dc-iris-<br>max-log | Zielwerte der DC-Blende: 0~1023. Der tatsächlich wirksame Bereich kann kleiner sein;<br>dieser Parameter begrenzt ihn. |

#### Kurze Beschreibung der Datentypen

##### struct spi_driver

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

<!-- Source: English PDF p96, table unit 830 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| @driver | struct device_driver enthält hauptsächlich Treibername und of_match_table<br>zum Abgleich mit DTS-Geräten. Stimmen die compatible-Felder von of_match_table<br>und DTS überein, wird .probe aufgerufen. |
| @id_table | Verwendet der Kernel nicht of_match_table und DTS-Geräte zum Abgleich,<br>verwendet er diese Tabelle. |
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

##### struct v4l2_subdev_core_ops

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

<!-- Source: English PDF p97, table unit 839 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .ioctl | Wird am Ende der ioctl()-Systemaufrufbehandlung im V4L2-Kern aufgerufen<br>und unterstützt treiberspezifische private ioctls. |
| .compat_ioctl32 | Wird bei einer 32-Bit-Anwendung auf einem 64-Bit-Kernel aufgerufen,<br>um Daten beim Austausch mit dem Userspace anzupassen. |

[Beispiel]

```text
  static const struct v4l2_subdev_core_ops motor_core_ops = {
      .ioctl = motor_ioctl,
  };
  static const struct v4l2_subdev_ops motor_subdev_ops = {
      .core   = &motor_core_ops,
  };
```

##### struct v4l2_ctrl_ops

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

<!-- Source: English PDF p97, table unit 848 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .g_volatile_ctrl | Neuen Steuerwert abfragen. Üblicherweise nur für volatile, meist schreibgeschützte<br>Steuerelemente relevant, beispielsweise eine fortlaufend veränderliche Signalstärke. |
| .s_ctrl | Neuen Steuerwert tatsächlich setzen; s_ctrl ist verpflichtend. Während des Aufrufs<br>wird ctrl-&gt;handler-&gt;lock gehalten, sodass niemand sonst auf die<br>Steuerelemente dieses Handlers zugreifen kann. |

[Beispiel]

```text
  static const struct v4l2_ctrl_ops motor_ctrl_ops = {
      .s_ctrl = motor_s_ctrl,
  };
```

#### Kurze API-Beschreibung

##### xxxx_set_ctrl

[Beschreibung]

Fokus-, Zoom- und P-Blendenposition über standardmäßiges v4l2_control setzen.

Der Treiber implementiert folgende standardmäßige V4L2-Befehle:

<!-- Source: English PDF p98, table unit 856 -->

| Parametername | Beschreibung |
| --- | --- |
| V4L2_CID_FOCUS_ABSOLUTE | Fokus steuern. Laut Quelle bedeutet 0 die kleinste Brennweite<br>und eine scharfe Nahaufnahme. |
| V4L2_CID_ZOOM_ABSOLUTE | Zoomfaktor steuern. 0 bedeutet kleinster Zoomfaktor und größtes Sichtfeld. |
| V4L2_CID_IRIS_ABSOLUTE | Blendenöffnung steuern. 0 bedeutet geschlossene Blende. |
| V4L2_CID_ZOOM_CONTINUOUS | Zoomfaktor von zoom1 steuern; bei mehreren Zoomgruppen verwendet. |

[Syntax]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[Parameter]

<!-- Source: English PDF p98, table unit 860 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *ctrl | Zeiger auf die V4L2-Steuerstruktur | Eingabe |

```text
xxxx_ioctl xxxx_compat_ioctl
```

[Beschreibung]

Das eigene ioctl ermittelt hauptsächlich Zeitinformationen für Fokus, Zoom und P-Blende, also Zeitstempel von Bewegungsbeginn und -ende. Da das verwendete Objektiv keine Positionserfassung besitzt, muss die Motorposition bei Bedarf zurückgesetzt werden.

##### Eigene Befehle des Treibers

<!-- Source: English PDF p99, table unit 865 -->

| Parametername | Beschreibung |
| --- | --- |
| RK_VIDIOC_VCM_TIMEINFO | Fokussierungszeitinformationen zur Prüfung, ob das aktuelle Bild<br>nach Abschluss der Fokussierung gültig ist |
| RK_VIDIOC_ZOOM_TIMEINFO | Zoomzeitinformationen zur Prüfung, ob das aktuelle Bild<br>nach Abschluss des Zoomens gültig ist |
| RK_VIDIOC_IRIS_TIMEINFO | Blendenzeitinformationen zur Prüfung, ob das aktuelle Bild<br>nach Abschluss der P-Blendenanpassung gültig ist |
| RK_VIDIOC_ZOOM1_TIMEINFO | Bei mehreren Zoomgruppen: Zeitinformationen von zoom1 zur Prüfung,<br>ob das aktuelle Bild nach Abschluss des Zoomens gültig ist |
| RK_VIDIOC_IRIS_CORRECTION | Blendenposition zurücksetzen; wirkt nur auf P-IRIS |
| RK_VIDIOC_FOCUS_CORRECTION | Fokusposition zurücksetzen |
| RK_VIDIOC_ZOOM_CORRECTION | Zoomposition zurücksetzen |
| RK_VIDIOC_ZOOM1_CORRECTION | Position der zweiten Zoomgruppe eines Doppelzoomobjektivs zurücksetzen |
| RK_VIDIOC_FOCUS_SET_POSITION | Fokusposition setzen |
| RK_VIDIOC_ZOOM_SET_POSITION | Fokusnachführung konfigurieren und anhand der Zoomkurve<br>mehrstufige gekoppelte Zoom-/Fokusbewegungen ausführen |

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

<!-- Source: English PDF p100, table unit 874 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *sd | Zeiger auf die V4L2-Subdevice-Struktur | Eingabe |
| cmd | ioctl-Befehl | Eingabe |
| *arg/arg | Parameterzeiger | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p100, table unit 876 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

#### Schritte zur Treiberportierung

Für SPI-gesteuerte Treiberchips lässt sich das SPI-Framework zur Portierung verwenden. Referenz ist MS41908: /kernel/drivers/media/spi/ms41908.c

Portierungsschritte:

##### 1. Standardmäßigen SPI-Subdevice-Treiberteil implementieren

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

##### 2. V4L2-Subdevice-Treiber implementieren, insbesondere die folgenden 2 Mitglieder

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

## DC-IRIS-Treiber

Anders als bei P-IRIS ist die genaue Blendenöffnung bei DC-IRIS nicht bekannt. Normalerweise bleibt die Blende zunächst vollständig geöffnet. Ist das Bild trotz minimaler Belichtung noch überbelichtet, beginnt die Blendenanpassung; ebenso bei Unterbelichtung trotz maximaler Belichtung. Der DC-IRIS-Motor ist ein Gleichstrommotor, dessen Verstellgeschwindigkeit durch negative Rückkopplung eines Hall-Elements gedämpft wird. Der Treiber steuert ihn mit einer PWM. Unter 20% Tastverhältnis schließt die Blende langsam vollständig; kleinere Werte beschleunigen das Schließen. Oberhalb 40% öffnet sie sich langsam; größere Werte beschleunigen das Öffnen. Im Bereich 20%~40% hält sie ihre Position. Die Grenzen 20% und 40% sind nicht fest, sondern hängen von PWM-Frequenz und Genauigkeit der Hardwarebauteile ab. Referenztreiber: /kernel/drivers/media/i2c/hall-dc-motor.c

### DC-IRIS-Geräteregistrierung (DTS)

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

#### Kurze Beschreibung der Datentypen

##### struct platform_driver

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

<!-- Source: English PDF p103, table unit 917 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| @driver | struct device_driver enthält hauptsächlich Treibername und of_match_table<br>zum Abgleich mit DTS-Geräten. Stimmen die compatible-Felder von of_match_table<br>und DTS überein, wird .probe aufgerufen. |
| @id_table | Verwendet der Kernel nicht of_match_table und DTS-Geräte zum Abgleich,<br>verwendet er diese Tabelle. |
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

##### struct v4l2_subdev_core_ops

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

<!-- Source: English PDF p104, table unit 926 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .ioctl | Wird am Ende der ioctl()-Systemaufrufbehandlung im V4L2-Kern aufgerufen<br>und unterstützt treiberspezifische private ioctls. |
| .compat_ioctl32 | Wird bei einer 32-Bit-Anwendung auf einem 64-Bit-Kernel aufgerufen,<br>um Daten beim Austausch mit dem Userspace anzupassen. |

[Beispiel]

```text
  static const struct v4l2_subdev_core_ops motor_core_ops = {
      .ioctl = motor_ioctl,
  };
  static const struct v4l2_subdev_ops motor_subdev_ops = {
      .core   = &motor_core_ops,
  };
```

##### struct v4l2_ctrl_ops

[Beschreibung]

Steuerungsoperationen, die der Treiber bereitstellen muss.

[Definition]

```text
  struct v4l2_ctrl_ops {
      int (*s_ctrl)(struct v4l2_ctrl *ctrl);
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p104, table unit 935 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .s_ctrl | Neuen Steuerwert tatsächlich setzen; s_ctrl ist verpflichtend. Während des Aufrufs<br>wird ctrl-&gt;handler-&gt;lock gehalten, sodass niemand sonst auf die<br>Steuerelemente dieses Handlers zugreifen kann. |

[Beispiel]

```text
  static const struct v4l2_ctrl_ops motor_ctrl_ops = {
      .s_ctrl = motor_s_ctrl,
  };
```

#### Kurze API-Beschreibung

##### xxxx_set_ctrl

[Beschreibung]

Die Blendenposition wird über standardmäßiges v4l2_control eingestellt. Da die genaue DC-Blendenposition nicht bekannt ist, bezeichnet der gesetzte Wert tatsächlich das PWM-Tastverhältnis.

Folgende standardmäßige V4L2-Befehle sind implementiert:

<!-- Source: English PDF p105, table unit 943 -->

| Parametername | Beschreibung |
| --- | --- |
| V4L2_CID_IRIS_ABSOLUTE | Tastverhältnis der blendensteuernden PWM setzen, Bereich 0~100 |

[Syntax]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[Parameter]

<!-- Source: English PDF p105, table unit 947 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *ctrl | Zeiger auf die V4L2-Steuerstruktur | Eingabe |

[Rückgabewert]

<!-- Source: English PDF p105, table unit 949 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

```text
xxxx_ioctl xxxx_compat_ioctl
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

<!-- Source: English PDF p105, table unit 956 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *sd | Zeiger auf die V4L2-Subdevice-Struktur | Eingabe |
| cmd | ioctl-Befehl | Eingabe |
| *arg/arg | Parameterzeiger | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p105, table unit 958 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

#### Schritte zur Treiberportierung

Treiberreferenz: /kernel/drivers/media/i2c/hall-dc-motor.c

Portierungsschritte:

##### 1. Standardmäßigen Plattform-Subdevice-Treiberteil implementieren

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

##### 2. V4L2-Subdevice-Treiber implementieren, insbesondere die folgenden 2 Mitglieder

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

<!-- Source: English PDF p107, table unit 985 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| V4L2_CID_IRIS_ABSOLUTE | Tastverhältnis der blendensteuernden PWM setzen, Bereich 0~100 |

## RK-IRCUT-Treiber

IRCUT wird über zwei Leitungen mit 3.5v~6v angesteuert. Durch Umpolen und Einhalten einer Einschaltdauer von 100ms±10% lässt sich der Filter umschalten. Der Treiber steuert die Stromrichtung des Motortreibers über zwei GPIOs, bezeichnet als open (rote Leitung) und close (schwarze Leitung). Strom von open nach close aktiviert den Infrarotsperrfilter für den Tagbetrieb; Strom von close nach open schaltet auf die weiße Glasscheibe für den Nachtbetrieb.

### RK-IRCUT-Geräteregistrierung (DTS)

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

#### Kurze Beschreibung der Datentypen

##### struct platform_driver

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

<!-- Source: English PDF p108, table unit 997 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| @driver | struct device_driver enthält hauptsächlich Treibername und of_match_table<br>zum Abgleich mit DTS-Geräten. Stimmen die compatible-Felder von of_match_table<br>und DTS überein, wird .probe aufgerufen. |
| @id_table | Verwendet der Kernel nicht of_match_table und DTS-Geräte zum Abgleich,<br>verwendet er diese Tabelle. |
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

##### struct v4l2_subdev_core_ops

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

<!-- Source: English PDF p109, table unit 1006 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .ioctl | Wird am Ende der ioctl()-Systemaufrufbehandlung im V4L2-Kern aufgerufen<br>und unterstützt treiberspezifische private ioctls. |
| .compat_ioctl32 | Wird bei einer 32-Bit-Anwendung auf einem 64-Bit-Kernel aufgerufen,<br>um Daten beim Austausch mit dem Userspace anzupassen. |

[Beispiel]

```text
  static const struct v4l2_subdev_core_ops ircut_core_ops = {
      .ioctl = ircut_ioctl,
  };
  static const struct v4l2_subdev_ops ircut_subdev_ops = {
      .core   = &ircut_core_ops,
  };
```

##### struct v4l2_ctrl_ops

[Beschreibung]

Steuerungsoperationen, die der Treiber bereitstellen muss.

[Definition]

```text
  struct v4l2_ctrl_ops {
      int (*s_ctrl)(struct v4l2_ctrl *ctrl);
  };
```

[Wichtige Mitglieder]

<!-- Source: English PDF p110, table unit 1015 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| .s_ctrl | Neuen Steuerwert tatsächlich setzen; s_ctrl ist verpflichtend. Während des Aufrufs<br>wird ctrl-&gt;handler-&gt;lock gehalten, sodass niemand sonst auf die<br>Steuerelemente dieses Handlers zugreifen kann. |

[Beispiel]

```text
  static const struct v4l2_ctrl_ops ircut_ctrl_ops = {
      .s_ctrl = ircut_s_ctrl,
  };
```

#### Kurze API-Beschreibung

##### xxxx_set_ctrl

[Beschreibung]

IRCUT über standardmäßiges v4l2_control umschalten.

Folgende standardmäßige V4L2-Befehle sind implementiert:

<!-- Source: English PDF p110, table unit 1023 -->

| Parametername | Beschreibung |
| --- | --- |
| V4L2_CID_BAND_STOP_FILTER | 0: CLOSE, Infrarotlicht kann eintreten;<br>3: OPEN, Infrarotlicht kann nicht eintreten. |

[Syntax]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[Parameter]

<!-- Source: English PDF p110, table unit 1027 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *ctrl | Zeiger auf die V4L2-Steuerstruktur | Eingabe |

[Rückgabewert]

<!-- Source: English PDF p110, table unit 1029 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

```text
xxxx_ioctl xxxx_compat_ioctl
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

<!-- Source: English PDF p111, table unit 1036 -->

| Parametername | Beschreibung | Eingabe und Ausgabe |
| --- | --- | --- |
| *sd | Zeiger auf die V4L2-Subdevice-Struktur | Eingabe |
| cmd | ioctl-Befehl | Eingabe |
| *arg/arg | Parameterzeiger | Ausgabe |

[Rückgabewert]

<!-- Source: English PDF p111, table unit 1038 -->

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich |
| Ungleich 0 | Fehlgeschlagen |

#### Schritte zur Treiberportierung

Treiberreferenz: /kernel/drivers/media/i2c/rk_ircut.c

Portierungsschritte:

##### 1. Standardmäßigen Plattform-Subdevice-Treiberteil implementieren

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

3\. Eine Arbeitswarteschlange anlegen und das Umschalten dort ausführen, um langes Blockieren zu vermeiden.

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

##### 2. V4L2-Subdevice-Treiber implementieren, insbesondere die folgenden 2 Mitglieder

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

<!-- Source: English PDF p112, table unit 1072 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| V4L2_CID_BAND_STOP_FILTER | 0: CLOSE, Infrarotlicht kann eintreten;<br>3: OPEN, Infrarotlicht kann nicht eintreten. |

## Werkzeuge media-ctl und v4l2-ctl

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

Hinweis: Trennen Sie den ISPP-Pfad, verknüpfen Sie main_path und erfassen Sie RAW-Bilder über main_path. Ohne -d verwendet media-ctl standardmäßig /dev/media0. Prüfen Sie, welchem Geräteknoten rkisp-isp-subdev zugeordnet ist; üblicherweise /dev/media1.

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

Hinweis: Der ISP-Treiber ruft die Steuerbefehle des Kamera-Subdevices auf. Deshalb lässt sich die Belichtung beispielsweise über video3 (main_path oder self_path) setzen. VICAP ruft diese Befehle nicht auf; Steuerbefehle direkt am Erfassungsknoten schlagen fehl. Ermitteln Sie stattdessen den Kameraknoten /dev/v4l-subdevX und konfigurieren Sie ihn direkt.

## Speicheroptimierung auf RV1109/RV1126

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

2\. DDR_2: ISP-FBC-YUV420- und Verstärkungsdaten werden in DDR geschrieben; ISPP liest sie zur Verarbeitung.

Speicherbedarf: buf_size * buf_cnt

```text
buf_size: ALIGN(width, 64) * ALIGN(height, 128) / 16 + ALIGN(width, 16) * ALIGN(hieght, 16) * 1.5625
```

buf_cnt: 4 Puffer im TNR-3to1-Modus, 3 im 2to1-Modus; der Modus wird im IQ-XML konfiguriert.

3\. DDR_3: ISPP-TNR-FBC-YUV420- und Verstärkungsdaten werden in DDR geschrieben; ISPP NR&Sharp liest sie erneut zur Verarbeitung.

Speicherbedarf: buf_size * buf_cnt

```text
buf_size: ALIGN(width, 64) * ALIGN(height, 128) / 16 + ALIGN(width, 16) * ALIGN(hieght, 16) * 1.5625
```

buf_cnt: 2, der kleinstmögliche Wert.

4\. DDR_4: ISPP-NR&Sharp-YUYV-Daten werden in DDR geschrieben und von ISPP FEC zur weiteren Verarbeitung gelesen.

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

## Latenzoptimierung auf RV1109/RV1126

##### 1. VICAP wait-line konfigurieren

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

##### 2. ISP wait-line konfigurieren

Setzen Sie wait-line am ISP-Knoten im DTS. Bei Bildhöhe 1520 und wait-line=760 wird nach Verarbeitung von Zeile 760 an ISPP ausgegeben. Passen Sie den Wert an die Verarbeitungszeiten von ISP und ISPP an.

```text
&rkisp_vir0 {
      wait-line = <760>;
};
```

Zur Diagnose kann auch /sys/module/video_rkisp/parameters/wait_line gesetzt werden, bevor das ISP-Videogerät geöffnet wird.

Hinweis: Ist wait-line zu klein und ISPP schneller als ISP, kann wegen des FBC-Kompressionsformats ein Haltezustand auftreten. Die Motion-Funktion und Mehrsensorbetrieb unterstützen dies nicht.

##### 3. ISPP wait-line für vier Ausgabestreams konfigurieren

Setzen Sie wait-line am ISPP-Knoten im DTS. Bei Bildhöhe 1520 und wait-line=896 wird nach Verarbeitung von Zeile 896 an die nachgelagerte Verarbeitung ausgegeben. Passen Sie den Wert an die ISPP-Verarbeitungszeit für NR oder FEC und die nachgelagerte Verarbeitungszeit an.

```text
&rkispp_vir0 {
     status = "okay";
     wait-line = <896>;
};
```

Zur Diagnose kann auch /sys/module/video_rkispp/parameters/wait_line gesetzt werden, bevor das ISPP-Videogerät geöffnet wird.

Hinweis: Ist wait-line zu klein und die nachgelagerte Verarbeitung schneller als ISPP, entstehen dort Bildverarbeitungsfehler. Mehrsensorbetrieb wird nicht unterstützt.

##### 4. Hardwareverarbeitung beschleunigen

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
   &rkisp_mmu {          status = "disabled";    };
  &rkisp {
        memory-region = <&isp_reserved>;
  };
  &rkispp_mmu {          status = "disabled";   };
  &rkispp {
        memory-region = <&isp_reserved>;
  };
```

## Häufig gestellte Fragen

### Treiberversion ermitteln

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

### Ladezustand des RKISP-Treibers prüfen

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

### Vom CIS ausgegebene RAW- und YUV-Daten erfassen

Nach Abschluss der Treiberentwicklung können CIS-Ausgabedaten direkt mit dem standardmäßigen v4l2-ctl erfasst werden. Anwendungshilfe: https://www.mankier.com/1/v4l2-ctl

##### Beispiel

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

#### Unterstützte Geräte

##### RV1109/RV1126

<!-- Source: English PDF p119, table unit 1185 -->

| Gerät | Schnittstelle | Format | Geräteknotenname | RAW-Ausgabe | YUV-Ausgabe |
| --- | --- | --- | --- | --- | --- |
| VICAP | DVP | RAW | video0~video3 | Nicht kompakt<br>RAW | Nein |
| VICAP | MIPI/LVDS | RAW | video0~video3 | Nicht kompakt<br>RAW<br>Kompakt RAW | Nein |
| VICAP | DVP / MIPI /<br>LVDS | YUV | video0~video3 | Nein | nv12<br>nv16 |
| ISP | DVP / MIPI /<br>LVDS | RAW | rkisp_rawwr0<br>rkisp_rawwr1<br>rkisp_rawwr2<br>rkisp_rawwr3 | Nicht kompakt<br>RAW<br>Kompakt RAW | Nein |
| ISP | MIPI / LVDS | YUV | rkisp_mainpath | Nicht kompakt<br>RAW | nv12<br>nv16 |
| ISPP | Nur DDR-Lesen | YUV | rkispp_m_bypass<br>rkispp_scale0<br>rkispp_scale1<br>rkispp_scale2 | Nein | nv12<br>nv16 |

##### RK356X

<!-- Source: English PDF p119, table unit 1187 -->

| Gerät | Schnittstelle | Format | Geräteknotenname | RAW-Ausgabe | YUV-Ausgabe |
| --- | --- | --- | --- | --- | --- |
| VICAP | DVP | RAW | video0~video3 | Nicht kompakt<br>RAW | Nein |
| VICAP | MIPI/LVDS | RAW | video0~video3 | Nicht kompakt<br>RAW<br>Kompakt RAW | Nein |
| VICAP | DVP / MIPI /<br>LVDS | YUV | video0~video3 | Nein | nv12<br>nv16 |
| ISP | DVP / MIPI /<br>LVDS | RAW | rkisp_rawwr0<br>rkisp_rawwr1<br>rkisp_rawwr2<br>rkisp_rawwr3 | Nicht kompakt<br>RAW<br>Kompakt RAW | Nein |
| ISP | MIPI / LVDS | YUV | rkisp_mainpath | Nicht kompakt<br>RAW | nv12<br>nv16 |

Hinweise:

1\. Geräteknoten mit media-ctl -p -d /dev/mediaX abfragen; X steht für 0, 1, 2, 3 usw.

#### RAW-Speicherformat

##### Nicht kompaktes RAW-Speicherformat

Im nicht kompakten Format werden raw10- und raw12-Sensordaten in 16 Bit gespeichert und an den höherwertigen Bits ausgerichtet. Die folgende Abbildung zeigt die RAW12-Anordnung am Beispiel eines 4-Byte-Speicherabschnitts:

![Englische Originalabbildung 9, PDF-Seite 120](/docs/rockchip-vi-driver/assets/en-p120-X579.png)

*Englische Originalabbildung 9, PDF-Seite 120*

##### Kompaktes RAW-Speicherformat

Die folgende Abbildung zeigt die RAW12-Anordnung am Beispiel eines 4-Byte-Speicherabschnitts:

![Englische Originalabbildung 10, PDF-Seite 120](/docs/rockchip-vi-driver/assets/en-p120-X580.png)

*Englische Originalabbildung 10, PDF-Seite 120*

##### Wichtiger Hinweis

Das ISP-mainpath-Gerät gibt bei Raw10- oder Raw12-Eingang einheitlich Raw12 im nicht kompakten RAW-Speicherformat aus.

#### Anwendungsbeispiele

##### RAW-Ausgabe über VICAP

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

##### Nicht kompakte RAW-Ausgabe über ISP-mainpath

1. Für Bilder aus mainpath muss die standardmäßige ISP-Ausgabeverknüpfung rkisp-bridge-ispp mit folgendem Befehl auf mainpath umgestellt werden:

```text
      media-ctl -l '"rkisp-isp-subdev":2->"rkisp-bridge-ispp":0[0]'
      media-ctl -l '"rkisp-isp-subdev":2->"rkisp_mainpath":0[1]'
```

Hinweis: Ohne -d wird standardmäßig media0 verwendet. Liegt rkisp-isp-subdev nicht dort, geben Sie mit -d das zugehörige Media-Gerät an.

Die 0 hinter „rkisp-bridge-ispp“ bezeichnet pad0, einen Sink-Pad. Einzelheiten enthält die V4L2-Dokumentation.

2\. Das ISP-Ausgabeformat ist standardmäßig YUYV8_2X8. Wechseln Sie mit folgendem Befehl auf Bayer RAW:

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

##### YUV-Ausgabe über VICAP

Die Eingangsdaten müssen YUV sein. Bei RAW-Eingabe kann VICAP kein YUV ausgeben.

```text
  v4l2-ctl -d /dev/video0  --set-fmt-video=width=1920,height=1080,pixelformat=NV12 --stream-mmap=4 --stream-count=1 --stream-to=/tmp/cap.raw  --stream-skip=2
```

##### YUV-Ausgabe über ISP

```text
  v4l2-ctl -d /dev/video5  --set-fmt-video=width=1920,height=1080,pixelformat=NV12 --stream-mmap=4 --stream-count=1 --stream-to=/tmp/cap.raw  --stream-skip=2
```

Hinweise:

1\. Beim ISP können mainpath oder selfpath erfasst werden; video5 ist nur ein Beispiel und muss an die tatsächlichen Parameter angepasst werden. 2. Bei RAW-Eingabe kann der ISP nach verschiedenen Bildverarbeitungsschritten YUV ausgeben. Dafür muss RK AIQ die ISP-Bildverarbeitungsmodule steuern. Die hier gezeigten Befehle richten nur den Datenfluss ein; die Module verwenden Treiberstandardparameter, wodurch die Bildwirkung normalerweise nicht korrekt ist.

##### YUV-Ausgabe über ISPP

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

<!-- Source: English PDF p122, table unit 1235 -->

| Knoten | Ausgabefähigkeit |
| --- | --- |
| rkispp_m_bypass | Volle Auflösung und YUV-Format |
| rkispp_scale0 | Volle oder skalierte Auflösung, YUV-Format.<br>Skalierungsverhältnis [1 8], maximale Breite 3264. |
| rkispp_scale1 | Volle oder skalierte Auflösung, YUV-Format.<br>Skalierungsverhältnis [2 8], maximale Breite 1280. |
| rkispp_scale2 | Volle oder skalierte Auflösung, YUV-Format.<br>Skalierungsverhältnis [2 8], maximale Breite 1280. |

### CIS-Ausgabeauflösung umschalten

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

### CIS-Belichtungsparameter einstellen

1. Ermitteln Sie mit media-ctl -p -d /dev/mediaX den Sensorknoten /dev/v4l-subdevX. Referenzbefehl:

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

### Schwarzweißkameras unterstützen

Der CIS-Treiber muss das Ausgabeformat des Schwarzweißsensors auf eines der folgenden drei Formate ändern:

```text
  MEDIA_BUS_FMT_Y8_1X8 (sensor 8bit output)
  MEDIA_BUS_FMT_Y10_1X10 (sensor 10bit output)
  MEDIA_BUS_FMT_Y12_1X12 (sensor 12bit output)
```

Dieses Format wird in xxxx_get_fmt und xxxx_enum_mbus_code zurückgegeben.

Der RKISP-Treiber nimmt für diese drei Formate besondere Einstellungen vor, um Schwarzweißbilder zu erfassen.

Benötigt die Anwendung Y8-Bilder, muss außerdem SP Path verwendet werden, da nur dieser Y8-Ausgabe unterstützt.

### Gerade und ungerade Halbbilder zusammenführen

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

##### Implementierung im Gerätetreiber

format.field muss V4L2_FIELD_INTERLACED sein, um gerade und ungerade Halbbilder als Ausgabe zu kennzeichnen. Dieser Wert ist in xxxx_get_fmt zurückzugeben. Referenz: driver/media/i2c/tc35874x.c.

### Diagnoseinformationen anzeigen

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

1\. Am Fehlerzustand: 1->2->4->3. 2. Zur Reproduktion: 3->Start->Reproduktion->1->2->4.

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
  Input      rkisp0 Format:FBC420 Size:2688x1520 (frame:26510 rate:32ms
  delay:13ms)
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

frame amount: Bildanzahl.

early: Im Wake-up-Modus wird der Puffer bereits nach Erfassung von wait_line Zeilen an den ISP übergeben. Standardmäßig geschieht dies erst nach dem vollständigen Bild. early bezeichnet den Zeitgewinn durch diese vorgezogene Übergabe. Konfiguration siehe Latenzoptimierung auf RV1109/RV1126.

single readout: Im HDR-Modus ist die Übertragungszeit eines Einzelbildes diejenige des langen Bildes.

total readout: Im HDR-Modus bezeichnet die Zeit zwischen Beginn der Übertragung des langen Bildes und Ende der Übertragung des kurzen Bildes die ursprüngliche Übertragungszeit eines zusammengeführten Bildes.

rate: Bildintervall.

fps: Bildrate.

irq statistics: Interruptinformationen.

total: Gesamtzahl der Interrupts einschließlich Bildende und Fehlern.

csi over flow: Anzahl der Überlaufinterrupts.

csi bandwidth lack: Anzahl der Interrupts wegen unzureichender Bandbreite.

frame dma end: Anzahl der Bildende-Interrupts; sie entspricht der Zahl der seit Streamstart vom Sensor ausgegebenen Bilder.

## Anhang A: V4L2-Control-Liste des CIS-Treibers

<!-- Source: English PDF p129, table unit 1327 -->

| CID | Beschreibung |
| --- | --- |
| V4L2_CID_VBLANK | Vertikale Austastung: Ruhephase nach jedem Bild ohne erzeugte Bilddaten.<br>Einheit ist eine Zeile. Deren Länge entspricht Bildbreite plus horizontaler Austastung<br>bei der durch V4L2_CID_PIXEL_RATE desselben Subdevices definierten Pixelrate. |
| V4L2_CID_HBLANK | Horizontale Austastung: Ruhephase nach jeder Bilddatenzeile ohne erzeugte<br>Bilddaten. Einheit ist Pixel. |
| V4L2_CID_EXPOSURE | Bestimmt die Belichtungszeit des Kamerasensors; diese ist durch das Bildintervall begrenzt. |
| V4L2_CID_ANALOGUE_GAIN | Analoge Verstärkung aller Farbkomponenten der Pixelmatrix.<br>Die Verstärkung erfolgt im analogen Bereich vor der A/D-Wandlung. |
| V4L2_CID_PIXEL_RATE | Pixelrate an den Source-Pads des Subdevices. Schreibgeschützt,<br>Einheit Pixel/Sekunde. Beispiel MIPI:<br>pixel_rate = link_freq * 2 * nr_of_lanes / bits_per_sample |
| V4L2_CID_LINK_FREQ | Datenbusfrequenz. Zusammen mit Media-Bus-Pixelcode und Bustyp<br>(Taktzyklen pro Abtastwert) bestimmt sie die Pixelrate V4L2_CID_PIXEL_RATE<br>im Pixelarray oder gegebenenfalls anderswo bei Geräten ohne Bildsensor.<br>Aus Pixeltakt, Bildbreite/-höhe und horizontaler/vertikaler Austastung lässt sich die Bildrate berechnen.<br>Die Pixelratensteuerung kann auch außerhalb des Subdevices mit dem Pixelarray definiert sein;<br>daraus allein ist jedoch keine Bildrate ableitbar. Nur im Pixelarray dürfen horizontale<br>und vertikale Austastinformationen als exakt gelten, da dort keine weitere Austastung zulässig ist.<br>Die Bildrate wird durch Auswahl der horizontalen und vertikalen Austastung eingestellt.<br>Einheit: Hz. |

## Anhang B: MEDIA_BUS_FMT-Tabelle

<!-- Source: English PDF p130, table unit 1329 -->

| CIS-Sensortyp | Sensorausgabeformat |
| --- | --- |
| Bayer RAW | MEDIA_BUS_FMT_SBGGR10_1X10<br>MEDIA_BUS_FMT_SRGGB10_1X10<br>MEDIA_BUS_FMT_SGBRG10_1X10<br>MEDIA_BUS_FMT_SGRBG10_1X10<br>MEDIA_BUS_FMT_SRGGB12_1X12<br>MEDIA_BUS_FMT_SBGGR12_1X12<br>MEDIA_BUS_FMT_SGBRG12_1X12<br>MEDIA_BUS_FMT_SGRBG12_1X12<br>MEDIA_BUS_FMT_SRGGB8_1X8<br>MEDIA_BUS_FMT_SBGGR8_1X8<br>MEDIA_BUS_FMT_SGBRG8_1X8<br>MEDIA_BUS_FMT_SGRBG8_1X8 |
| YUV | MEDIA_BUS_FMT_YUYV8_2X8<br>MEDIA_BUS_FMT_YVYU8_2X8<br>MEDIA_BUS_FMT_UYVY8_2X8<br>MEDIA_BUS_FMT_VYUY8_2X8<br>MEDIA_BUS_FMT_YUYV10_2X10<br>MEDIA_BUS_FMT_YVYU10_2X10<br>MEDIA_BUS_FMT_UYVY10_2X10<br>MEDIA_BUS_FMT_VYUY10_2X10<br>MEDIA_BUS_FMT_YUYV12_2X12<br>MEDIA_BUS_FMT_YVYU12_2X12<br>MEDIA_BUS_FMT_UYVY12_2X12<br>MEDIA_BUS_FMT_VYUY12_2X12 |
| Nur Y (Schwarzweiß), RAW-BW-Sensor | MEDIA_BUS_FMT_Y8_1X8<br>MEDIA_BUS_FMT_Y10_1X10<br>MEDIA_BUS_FMT_Y12_1X12 |

## Anhang C: Liste der CIS-Referenztreiber

<!-- Source: English PDF p131, table unit 1331 -->

| CIS-Datenschnittstelle | CIS-Ausgabedatentyp | Vollbild/Halbbild | Referenztreiber |
| --- | --- | --- | --- |
| MIPI | Bayer RAW | Vollbild | 0.3M<br>ov7750.c<br>gc0403.c<br>1.2M<br>ov9750.c<br>jx-h65.c<br>2M<br>ov2685.c<br>ov2680.c<br>ov2735.c<br>gc2385.c<br>gc2355.c<br>gc2053.c<br>sc2239.c<br>sc210iot.c<br>4M<br>gc4c33.c<br>5M<br>ov5695.c<br>ov5648.c<br>ov5670.c<br>gc5024.c<br>gc5025.c<br>gc5035.c<br>8M<br>ov8858.c<br>imx378.c<br>imx317.c<br>imx219.c<br>gc8034.c<br>13M<br>ov13850.c<br>imx258.c |
| MIPI | Bayer raw hdr | Vollbild | 2M<br>imx307.c<br>imx327.c<br>gc2093.c<br>ov02k10<br>ov2718.c<br>sc200ai.c<br>sc2310.c<br>jx-f37.c<br>4M<br>ov4689.c<br>os04a10.c<br>imx347.c<br>sc4238.c<br>5M<br>imx335.c<br>8M<br>imx334.c<br>imx415.c |
| MIPI | YUV | Vollbild | 2M<br>gc2145.c |
| MIPI | RAW BW | Vollbild | 0.3M<br>ov7251.c<br>1M<br>ov9281.c<br>1.3M<br>sc132gs.c |
| MIPI | YUV | Halbbild | tc35874x.c |
| ITU.BT601 | Bayer RAW |  | 2M<br>imx323.c<br>ar0230.c |
| ITU.BT601 | YUV |  | 0.3M<br>gc0329.c<br>gc0312.c<br>gc032a.c<br>2M<br>gc2145.c<br>gc2155.c<br>gc2035.c<br>bf3925.c |
| ITU.BT601 | RAW BW |  |  |
| ITU.BT656 | Bayer RAW |  | 2M<br>imx323 (Unterstützung möglich) |

## Anhang D: Referenztreiber für VCM-Treiber-ICs

##### Referenztreiber

vm149c.c

dw9714.c

fp5510.c

## Anhang E: Referenztreiber für Blitzlicht-Treiber-ICs

##### Referenztreiber

sgm3784.c

leds-rgb13h.c (GPIO-Steuerung)

{% endraw %}
