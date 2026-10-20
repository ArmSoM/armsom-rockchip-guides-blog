---
title: "Rockchip LVDS: Elektrische Eigenschaften, Ein-/Zweikanalkonfiguration und Fehlersuche"
description: "Vollständige technische LVDS-Referenz mit JEIDA/VESA-Timing, unterstützten Plattformen, fünf Anzeigeszenarien, DTS-Konfiguration und Spannungseinstellungen."
translation_key: "049-rockchip-lvds"
slug: "049-rockchip-lvds"
lang: "de"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: ["LVDS", "JEIDA", "VESA", "RK356X", "RK3288"]
keywords: "ArmSoM Rockchip LVDS Dual LVDS JEIDA VESA DTS"
excerpt: "Vollständige technische LVDS-Referenz mit JEIDA/VESA-Timing, unterstützten Plattformen, fünf Anzeigeszenarien, DTS-Konfiguration und Spannungseinstellungen."
---

{% raw %}
# Rockchip LVDS: Elektrische Eigenschaften, Ein-/Zweikanalkonfiguration und Fehlersuche

## Anwendbarkeit auf ArmSoM

Dies ist eine Rockchip-Plattformreferenz, kein Testbericht zu ArmSoM-Hardware. Die Produkttabelle der Quelle umfasst RK3126, RK3128 und RK3288 (Linux 4.4) sowie RK3326/PX30, RK3368 und RK356X (Linux 4.19 und neuer); die Unterstützungstabelle nennt zusätzlich RK3562. Zur Anpassung sind herausgeführte LVDS-Signale, PHY/VP-Zuordnung, Treiber des Ziel-SDK, Panel-Timing, Versorgung und Hintergrundbeleuchtung zu prüfen. Damit wird nicht behauptet, dass jedes ArmSoM-Board LVDS unterstützt. Es erfolgte keine Hardwareprüfung.

Die chinesischen und englischen PDFs tragen beide V1.2.0 und haben 22 beziehungsweise 24 Seiten. Chinesisch folgt der chinesischen Quelle, Englisch der englischen; Russisch und Deutsch übersetzen den vollständigen englischen Inhalt. Entsprechende technische Abschnitte und Quellunterschiede bleiben erhalten. Chinesisch verwendet chinesische Originalabbildungen, Englisch, Russisch und Deutsch die englischen Originalabbildungen.

[Redaktionelle Hinweise](/docs/rockchip-lvds/EDITORIAL-NOTES.md) · [ArmSoM-Dokumentation](https://docs.armsom.org/)

> Abweichungen der Quelle: Zeile 4 der Szenarientabelle nennt LVDS0 zweimal, während die spätere Abbildung und Konfiguration LVDS0/LVDS1 verwenden. Die ursprünglichen Tabellenwerte bleiben zur Prüfung erhalten. Im RK3288-vopl-Beispiel fehlt ein abschließendes Semikolon; es wurde nicht stillschweigend ergänzt.

## Produktversionen der Quelle

| SoC | Linux |
| --- | --- |
| RK3126 | 4.4 |
| RK3128 | 4.4 |
| RK3288 | 4.4 |
| RK3326/PX30 | 4.19 und neuer |
| RK3368 | 4.19 und neuer |
| RK356X | 4.19 und neuer |

## 1. Grundbegriffe

LVDS (Low Voltage Differential Signaling) ist eine Übertragungstechnik mit differentiellen Niederspannungssignalen für schnelle serielle Datenkommunikation. Sie wird häufig für Anzeigen, Bildübertragung und Datenkommunikation eingesetzt.

LVDS ist eine Signalübertragungstechnik der physikalischen Schicht, die elektrische Eigenschaften und Schnittstellenstandards definiert. Die Organisationen VESA und JEIDA legen die LVDS-Übertragungsverfahren auf der Datenverbindung fest. Nach Datenmenge und Übertragungsreihenfolge werden unter anderem JEIDA-18, JEIDA-24 und VESA-24 unterschieden.

Bei LVDS können in einem Taktzyklus 7 Datenbits übertragen werden. Im Folgenden werden die Timings gängiger LVDS-Formate kurz vorgestellt.

1\. JEIDA-18

```text
Slot     0    1     2     3     4     5    6
       __________                _________________
Clock         \_______________________/

       ______ ______ ______ ______ ______ ______ ______
DATA0 ><__G0__><__R5__><__R4__><__R3__><__R2__><__R1__><__R0__><
DATA1 ><__B1__><__B0__><__G5__><__G4__><__G3__><__G2__><__G1__><
DATA2 ><_CTL2_><_CTL1_><_CTL0_><__B5__><__B4__><__B3__><__B2__><
```

2\. JEIDA-24

```text
Slot     0    1     2     3     4     5    6
      ___________                _________________
Clock         \_______________________/

      ______ ______ ______ ______ ______ ______ ______
DATA0 ><__G2__><__R7__><__R6__><__R5__><__R4__><__R3__><__R2__><
DATA1 ><__B3__><__B2__><__G7__><__G6__><__G5__><__G4__><__G3__><
DATA2 ><_CTL2_><_CTL1_><_CTL0_><__B7__><__B6__><__B5__><__B4__><
DATA3 ><_CTL3_><__B1__><__B0__><__G1__><__G0__><__R1__><__R0__><
```

3\. VESA-24

```text
Slot     0    1     2     3     4     5    6
      ___________                _________________

Clock         \_______________________/
       ______ ______ ______ ______ ______ ______ ______
DATA0 ><__G0__><__R5__><__R4__><__R3__><__R2__><__R1__><__R0__><
DATA1 ><__B1__><__B0__><__G5__><__G4__><__G3__><__G2__><__G1__><
DATA2 ><_CTL2_><_CTL1_><_CTL0_><__B5__><__B4__><__B3__><__B2__><
DATA3 ><_CTL3_><__B7__><__B6__><__G7__><__G6__><__R7__><__R6__><
```

Dabei ist CTL2 das Freigabesignal DE, CTL1 das vertikale Synchronisationssignal VSYNC und CTL0 das horizontale Synchronisationssignal HSYNC. CTL3 ist für zusätzliche Zwecke reserviert und kann normalerweise ignoriert werden.

Im panel-Knoten des DTS lässt sich das LVDS-Format über das Attribut bus-format festlegen. Die Zuordnung lautet:

MEDIA_BUS_FMT_RGB666_1X7X3_SPWG :  jeida-18

MEDIA_BUS_FMT_RGB888_1X7X4_JEIDA :  jeida -24

MEDIA_BUS_FMT_RGB888_1X7X4_SPWG : vesa-24

## 2. Elektrische Eigenschaften

![LVDS-Treiberschaltung, Originalabbildung auf PDF-Seite 5](/docs/rockchip-lvds/assets/en-p5-X49.png)

Die obige Abbildung zeigt eine typische LVDS-Treiberschaltung. Im Kern handelt es sich um einen von einer Konstantstromquelle gespeisten Differenzverstärker.

Betrachten wir zunächst die Gleichspannungseigenschaften des Ausgangs. Für einen idealen Differenzverstärker lässt sich die Gleichtaktspannung Vcm wie folgt ausdrücken:

`V_cm = (U_a + U_b) / 2`

Dabei ist U_a die Gleichspannung von A gegen Masse und U_b die Gleichspannung von B gegen Masse in der Abbildung.

Für einen idealen Differenzverstärker gilt U_a = U_b. Am empfangsseitigen 100-Ω-Widerstand liegt somit keine Spannungsdifferenz an; dies entspricht einer Gleichspannungsentkopplung.

Betrachten wir anschließend die Wechselspannungseigenschaften. Das kleine Wechselspannungssignal u_ab zwischen A und B erzeugt einen Spannungsabfall am empfangsseitigen 100-Ω-Widerstand, wodurch Wechselspannung übertragen wird.

Häufig muss die LVDS-Treiberstärke angepasst werden. Zur Erhöhung gibt es verschiedene Möglichkeiten, etwa einen höheren Strom der Konstantstromquelle oder einen größeren Lastwiderstand.

Die vorstehende Betrachtung beruht auf einer Schaltungsanalyse. Praktisch bieten manche LVDS-PHYs zusätzliche Einstellungen dafür. Beispielsweise lässt sich die Treiberstärke durch Erhöhen der Differenzspannung u_ab steigern: Je größer die Spannungsdifferenz, desto größer der Strom.

In der Praxis sind auch die Auswirkungen der Übertragungsleitung zu berücksichtigen. Eine Optimierung, also Verringerung, von Kapazität und Widerstand auf der differentiellen Leitung kann die LVDS-Treiberstärke ebenfalls in gewissem Umfang verbessern.

## 3. Plattformunterstützung

| Plattform | LVDS0 unterstützt | LVDS1 unterstützt |
| --- | --- | --- |
| RK3568 | Y | Y |
| RK3567 | Y | Y |
| RK3566 | Y | N |
| RK3562 | Y | N |
| RK3368 | Y | N |
| RK3326 / PX30 | Y | N |
| RK3288 | Y | Y |
| RK3128 | Y | N |
| RK3126 | Y | N |

## 4. Überblick über Anwendungsszenarien

Die Nutzung von LVDS in unterschiedlichen Szenarien lässt sich wie folgt zusammenfassen:

| Nr. | Panels | LVDS-Schnittstellen | Video-Port-Zuordnung | Maximale Auflösung | Beschreibung | Referenzkonfiguration |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 1 | LVDS0 / LVDS1 | VP1 → LVDS0/1; VP2 → LVDS0/1 | 1280x800 | Einkanal-LVDS-Panel | rk3567-evb2-lp4x-v10-single-channel-lvds.dts<br>rk3568-evb1-ddr4-v10-single-channel-lvds.dts |
| 2 | 1 | LVDS0 + LVDS1 | VP1 → LVDS0 + LVDS1; VP2 → LVDS0 + LVDS1 | 1920x1080 | Dual LVDS, Zweikanal-LVDS | rk3567-evb2-lp4x-v10-dual-channel-lvds.dts |
| 3 | 2 | LVDS0 + LVDS1 | VP1 → LVDS0, VP2 → LVDS1; VP2 → LVDS0, VP1 → LVDS1 | 1280x800 je Panel | Zwei VPs, jeweils mit einem Einkanal-LVDS-Panel verbunden | rk3567-evb2-lp4x-v10-two-vp-two-separate-single-channel-lvds.dts<br>rk3568-evb1-ddr4-v10-two-vp-two-separate-single-channel-lvds.dts |
| 4 | 2 | LVDS0 + LVDS1 | VP1 → LVDS0, VP1 → LVDS0; VP2 → LVDS0, VP2 → LVDS0 | 1280x800 je Panel | Ein VP, zwei Einkanal-LVDS-Panels, die jeweils die Hälfte des VP-Inhalts anzeigen | rk3567-evb2-lp4x-v10-one-vp-two-single-channel-lvds.dts<br>rk3568-evb1-ddr4-v10-one-vp-two-single-channel-lvds.dts |
| 5 | 2 | LVDS0 + LVDS1 | VP1 → LVDS0 + LVDS1; VP2 → LVDS0 + LVDS1 | 1280x800 je Panel | Ein VP, zwei Einkanal-LVDS-Panels mit identischem Inhalt (Connector-Spiegelung) | Siehe entsprechenden Abschnitt dieses Artikels |

Die tatsächlichen Ergebnisse dieser 5 Szenarien zeigt die folgende Abbildung:

![Ergebnisse der fünf LVDS-Szenarien, PDF-Seite 9](/docs/rockchip-lvds/assets/en-p9-X66.jpg)

Für RK356X zeigt die folgende Abbildung die Zuordnung zwischen Video Port und LVDS:

![Zuordnung von Video Port und LVDS auf RK356X, PDF-Seite 10](/docs/rockchip-lvds/assets/en-p10-X69.jpg)

## 5. LVDS-Konfigurationsbeispiele für verschiedene Szenarien

Dieser Abschnitt stellt verschiedene LVDS-Konfigurationsbeispiele vor. Trotz der zahlreichen Kombinationen von LVDS-Ausgängen sind im Wesentlichen nur zwei Punkte zu beachten:

Ob Zweikanal-LVDS, also Dual LVDS, verwendet wird.

Welchem VP der jeweilige LVDS-Ausgang zugeordnet ist.

Bei Dual LVDS müssen zwei LVDS-Knoten aktiviert und dem LVDS0-Knoten das Attribut dual-channel hinzugefügt werden, um die Nutzung von Dual LVDS anzugeben.

```text
&lvds0 {
   status = "okay";

   dual-channel;
};
```

Zusätzlich muss geklärt werden, welchem VP LVDS zugeordnet ist. Bei Dual LVDS verwenden LVDS0 und LVDS1 gemeinsam VP1 oder gemeinsam VP2 als Ausgang. In den übrigen Fällen erfolgt die Konfiguration entsprechend dem jeweiligen Szenario:

```text
/*
 * Example 1: Two VPs are respectively connected to a single-channel LVDS panel

 * VP1 -> LVDS0, VP2 -> LVDS1
 */
&lvds0_in_vp1 {
   status = "okay";
};

&lvds1_in_vp2 {
   status = "okay";
};

/*
 * Example 2: Two VPs are respectively connected to a single-channel LVDS panel (in reverse
order)

 * VP2 -> LVDS0, VP1 -> LVDS1
 */
&lvds0_in_vp2 {
   status = "okay";
};

&lvds1_in_vp1 {
   status = "okay";
};
```

### 5.1 Einkanal-LVDS konfigurieren

Für die Konfiguration von Einkanal-LVDS müssen folgende Parameter feststehen:

Panel-Timing, Ausgabeformat, zugehöriger Enable-Pin und PWM-Pin der Hintergrundbeleuchtung.

Ob die Ausgabe über LVDS0 oder LVDS1 erfolgt.

Ob VP1 oder VP2 an LVDS ausgibt.

Für Einkanal-LVDS auf RK356X existieren 4 Zuordnungen zwischen LVDS und VP, wie die folgende Abbildung zeigt:

![Vier Zuordnungen für Einkanal-LVDS, PDF-Seite 12](/docs/rockchip-lvds/assets/en-p12-X81.png)

Am Beispiel der Ausgabe von VP1 über LVDS0 wird nachfolgend die DTS-Konfiguration kurz erläutert:

1\. Panel-Knoten einrichten, Panel-Timing, Ausgabeformat, Enable- und Hintergrundbeleuchtungs-Pins konfigurieren und das Panel mit dem LVDS-Knoten verknüpfen:

```text
panel {
   compatible = "simple-panel";

   backlight = <&backlight>;
   power-supply = <&vcc3v3_lcd0_n>;
   enable-delay-ms = <20>;
   prepare-delay-ms = <20>;
   unprepare-delay-ms = <20>;
   disable-delay-ms = <20>;
   bus-format = <MEDIA_BUS_FMT_RGB666_1X7X3_SPWG>;
   width-mm = <217>;
   height-mm = <136>;

   display-timings {
      native-mode = <&timing0>;
      timing0: timing0 {

         clock-frequency = <67000000>;
         hactive = <800>;
         vactive = <1280>;
         hback-porch = <60>;
         hfront-porch = <60>;

         vback-porch = <4>;
         vfront-porch = <2>;
         hsync-len = <8>;
         vsync-len = <8>;
         hsync-active = <0>;
         vsync-active = <0>;
         de-active = <0>;
         pixelclk-active = <0>;
      };
   };

   ports {

      #address-cells = <1>;
      #size-cells = <0>;
      port@0 {
         reg = <0>;
         panel_in_lvds0: endpoint {
           remote-endpoint = <&lvds0_out_panel>;
         };
      };
   };
};
```

2\. Entsprechenden LVDS-Knoten aktivieren und mit dem Panel-Knoten verknüpfen:

```text
&lvds0 {
   status = "okay";
   ports {

      port@1 {
         reg = <1>;
         lvds0_out_panel: endpoint {
           remote-endpoint = <&panel_in_lvds0>;
         };
      };
   };
};
```

3\. Festlegen, über welchen VP LVDS ausgegeben wird:

```text
&lvds0_in_vp1 {
   status = "okay";

 };
```

### 5.2 Dual LVDS (Zweikanal-LVDS) konfigurieren

Die Konfiguration dieses Abschnitts gilt für RK356X.

1\. Dem lvds-Knoten von LVDS0 das Attribut dual-channel hinzufügen, um Dual LVDS anzugeben.

```text
&lvds0 {
   status = "okay";
   dual-channel;


   ports {
      port@1 {
         reg = <1>;
         lvds0_out_panel: endpoint {
           remote-endpoint = <&panel_in_lvds0>;
         };
      };
   };
};
```

2\. Video-Port-Zuordnung festlegen. Bei Dual LVDS auf RK356X kann die Ausgabe über VP1 oder VP2 erfolgen. Die folgende Abbildung zeigt sämtliche möglichen Zuordnungen.

![Video-Port-Zuordnungen für Dual LVDS, PDF-Seite 14](/docs/rockchip-lvds/assets/en-p14-X88.png)

Das folgende Beispiel verwendet VP1, also Methode 1 der Abbildung:

```text
&lvds0_in_vp1 {
   status = "okay";
};


&lvds1_in_vp1 {
   status = "okay";
};

&lvds1_in_vp2 {
   status = "disabled";
};
```

3\. Ausgabereihenfolge der LVDS-Kanäle festlegen:

```text
panel {
   /* ... Relevant panel parameters are filled in here */


   ports {
      #address-cells = <1>;
      #size-cells = <0>;
      port@0 {
         reg = <0>;
         dual-lvds-odd-pixels; /* Output odd pixels */
         panel_in_lvds0: endpoint {
           remote-endpoint = <&lvds0_out_panel>;
         };
      };
      port@1 {
         reg = <1>;
         dual-lvds-even-pixels; /* Output even pixels */

         panel_in_lvds1: endpoint {
           remote-endpoint = <&lvds1_out_panel>;
         };
      };
   };
};
```

In diesem Beispiel gibt LVDS0 dual-lvds-odd-pixels aus, also ungerade Pixel; LVDS1 gibt dual-lvds-even-pixels aus, also gerade Pixel. Die Reihenfolge lässt sich bei Bedarf vertauschen.

### 5.3 Dual LVDS (Zweikanal-LVDS) für RK3288 konfigurieren

Dieser Abschnitt gilt für RK3288.

1\. Dem lvds-Knoten das Attribut dual-channel hinzufügen, um Dual LVDS anzugeben.

```text
&lvds {
   status = "okay";
   dual-channel;


   ports {
      port@1 {
         reg = <1>;
         lvds0_out_panel: endpoint {
           remote-endpoint = <&panel_in_lvds0>;
         };
      };
   };
};
```

2\. Festlegen, über welchen VOP LVDS ausgegeben wird: vopb oder vopl.

```text
/* Output on vopb */
&lvds_in_vopb {

   status = "okay";
};

/* Or, output on vopl */
&lvds_in_vopl {
   status = "okay";
}
```

3\. Ausgabereihenfolge der LVDS-Kanäle festlegen. Bei RK3288 kann das Attribut rockchip,data-swap zum lvds-Knoten hinzugefügt werden, um die Reihenfolge zu vertauschen:

```text
&lvds {
   rockchip,data-swap;

};
```

### 5.4 Zwei VPs mit jeweils einem unabhängigen Einkanal-LVDS-Panel konfigurieren

In diesem Fall muss jeder Einkanal-LVDS-Ausgang lediglich entsprechend der Einkanal-LVDS-Konfiguration eingerichtet werden.

Setzen Sie in diesem Fall nicht das Attribut dual-channel, da die Konfiguration sonst als Dual LVDS erkannt wird.

Für den praktischen Einsatz muss die Video-Port-Zuordnung festgelegt werden. Es gibt 2 mögliche Zuordnungen, wie folgende Abbildung zeigt:

![Zwei VPs mit unabhängigen Einkanal-Panels, PDF-Seite 17](/docs/rockchip-lvds/assets/en-p17-X100.png)

Die folgenden DTS-Beispiele entsprechen Methode 1 beziehungsweise Methode 2 der Abbildung:

```text
/*
 * VP1 -> LVDS0, VP2 -> LVDS1

 */
&lvds0_in_vp1 {
   status = "okay";
};

&lvds1_in_vp2 {
   status = "okay";
};

/*
 * Or, VP2 -> LVDS0, VP1 -> LVDS1
 */
&lvds0_in_vp2 {

   status = "okay";
};

&lvds1_in_vp1 {
   status = "okay";
};
```

### 5.5 Einen VP mit zwei Einkanal-LVDS-Panels konfigurieren

In diesem Szenario ist ein VP mit zwei Einkanal-LVDS-Panels verbunden; jedes Panel zeigt die Hälfte des VP-Inhalts.

Zu beachten ist, dass dieser Fall derzeit als Erweiterung von Dual LVDS umgesetzt ist. Die Konfiguration ähnelt daher der von Dual LVDS:

1\. Dem lvds-Knoten von LVDS0 das Attribut dual-channel hinzufügen.

```text
&lvds0 {
   status = "okay";
   dual-channel;


   ports {
      port@1 {
         reg = <1>;
         lvds0_out_panel: endpoint {
           remote-endpoint = <&panel_in_lvds0>;
         };
      };
   };
};
```

2\. Video-Port-Zuordnung festlegen. Bei einem VP mit zwei Einkanal-LVDS-Panels auf RK356X kann die Ausgabe über VP1 oder VP2 erfolgen. Die möglichen Zuordnungen zeigt folgende Abbildung.

![Ein VP mit zwei Panels für geteilte Inhalte, PDF-Seite 19](/docs/rockchip-lvds/assets/en-p19-X106.png)

Das folgende Beispiel verwendet VP1, also Methode 1 der Abbildung:

```text
&lvds0_in_vp1 {
   status = "okay";

};

&lvds1_in_vp1 {
   status = "okay";
};

&lvds1_in_vp2 {
   status = "disabled";
};
```

3\. Ausgabereihenfolge der LVDS-Kanäle festlegen:

```text
panel {
   /*... Relevant panel parameters are filled in here */


   ports {
      #address-cells = <1>;
      #size-cells = <0>;
      port@0 {
         reg = <0>;
         dual-lvds-left-pixels; /* Output the left-half content */
         panel_in_lvds0: endpoint {

           remote-endpoint = <&lvds0_out_panel>;
         };
      };
      port@1 {
         reg = <1>;
         dual-lvds-right-pixels; /* Output the right-half content */
         panel_in_lvds1: endpoint {
           remote-endpoint = <&lvds1_out_panel>;
         };
      };
   };
};
```

In der aktuellen Umsetzung sind zusätzlich die Attribute dual-lvds-left-pixels und dual-lvds-right-pixels definiert, um die Ausgabereihenfolge zu unterscheiden. Diese lässt sich im praktischen Einsatz nach Bedarf ändern.

### 5.6 Einen VP mit zwei Einkanal-LVDS-Panels konfigurieren (Connector-Spiegelung)

Hier ist ein VP mit zwei Einkanal-LVDS-Panels verbunden; beide Panels verwenden dieselben Timing-Parameter und zeigen exakt denselben Inhalt.

Für das Timing jedes Panels kann die Einkanal-LVDS-Konfiguration herangezogen werden.

Bei der Zuordnung zwischen Video Port und LVDS kann die Ausgabe entweder über VP1 oder VP2 festgelegt werden:

![Video-Port-Zuordnung für Connector-Spiegelung, PDF-Seite 21](/docs/rockchip-lvds/assets/en-p21-X112.png)

```text
/* Output using VP1 */
&lvds0_in_vp1 {
   status = "okay";

};

&lvds1_in_vp1 {
   status = "okay";
};

/* Or, output using VP2 */
&lvds0_in_vp2 {
   status = "okay";
};

&lvds1_in_vp2 {

   status = "okay";
};
```

## 6. LVDS-Fehlersuche

Mithilfe des summary-Knotens von VOP lassen sich die aktuellen Informationen zum LVDS-Connector anzeigen:

```text
cat /sys/kernel/debug/dri/0/summary
```

Wenn Dual LVDS aktiviert und der Treiber erfolgreich geladen wurde, erscheint der Connector-Knoten mit dem Namen LVDS-DUAL:

![LVDS-DUAL im VOP-Status, PDF-Seite 22](/docs/rockchip-lvds/assets/en-p22-X115.jpg)

Beachten Sie: Auch bei einem VP mit zwei Einkanal-LVDS-Panels, die jeweils die Hälfte des VP-Inhalts zeigen, wird LVDS-DUAL angezeigt.

Bei zwei Einkanal-LVDS-Panels sind unterschiedliche LVDS-Connector-Knoten sichtbar:

![Getrennte LVDS-Connector-Knoten, PDF-Seite 23](/docs/rockchip-lvds/assets/en-p23-X120.jpg)

Welchem VP der LVDS-Connector dann zugeordnet ist, hängt von der konkreten Konfiguration ab.

## 7. Häufige Fragen

### 7.1 Keine Ausgabe auf LVDS1

Prüfen Sie zunächst die Ausgabe von VOP summary, um sicherzustellen, dass LVDS1 korrekt aktiviert ist. Wenn weiterhin keine Ausgabe erfolgt, versuchen Sie den Loader zu aktualisieren.

### 7.2 Unscharfe oder gezackte Dual-LVDS-Ausgabe

Möglicherweise sind die Ausgaben von LVDS0 und LVDS1 vertauscht. Versuchen Sie, die Positionen der Attribute dual-lvds-odd-pixels und dual-lvds-even-pixels in der DTS-Konfiguration zu tauschen.

### 7.3 Schwarzer oder weißer Anzeigeinhalt

Prüfen Sie die Hardwareverbindung sowie die korrekten Ausgaben des Hintergrundbeleuchtungs- und Enable-Pins.

### 7.4 LVDS-Gleichtakt- und Differenzspannung ändern

Ändern Sie bei RK356X die DTS-Attribute des betreffenden PHY:

Dabei bezeichnet inno,lvds-vcom die Gleichtaktspannung und inno,lvds-vod die Differenzspannung.

Für RK356X stehen folgende Gleichtaktspannungen zur Verfügung:

1000 mV

950 mV (Standardwert)

900 mV

850 mV

Für RK356X stehen folgende Differenzspannungen zur Verfügung:

400 mV

350 mV (Standardwert)

300 mV

250 mV

```text
&video_phy0 {
      inno,lvds-vcom = <1000>; /* 1000mV */
      inno,lvds-vod = <400>; /* 400mV */

};
```

{% endraw %}
