---
title: "RK3588-Vsync-Anpassung: VOP, DSC, DSI und eDP-VRR"
description: "Vollständige RK3588-Abtasttimings, VFP-/HFP-/dclk-Verfahren, 120/60fps-Beispiele und DPCD-/EDID-VRR-Einschränkungen."
translation_key: "054-rockchip-vsync-adjust"
slug: "054-rockchip-vsync-adjust"
lang: "de"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: ["RK3588", "Vsync", "VRR", "DSI", "eDP", "DSC"]
keywords: "ArmSoM Rockchip RK3588 Vsync VRR DSI eDP"
excerpt: "Vollständige RK3588-Abtasttimings, VFP-/HFP-/dclk-Verfahren, 120/60fps-Beispiele und DPCD-/EDID-VRR-Einschränkungen."
---

{% raw %}

# RK3588-Vsync-Anpassung: VOP, DSC, DSI und eDP-VRR

Dies ist eine Plattformreferenz für Rockchip RK3588 mit Linux-Kernel 5.10 gemäß der Quelle. Prüfen Sie für ein ArmSoM-Projekt den SoC der Platine, die herausgeführte Displayschnittstelle, die VRR-Fähigkeiten von Panel und Bridge sowie die SDK-/BSP-Patches. Daraus lässt sich keine Unterstützung durch jede ArmSoM-Platine ableiten. Eine Validierung auf ArmSoM-Hardware wurde nicht durchgeführt; Protokolle, Signalverläufe, Fotos und Testbeschreibungen sind Beispiele aus der Quelle.

Quelle: Rockchip_RK3588_Developer_Guide_Vsync_Adjust_CN.pdf, V1.2.0, 11 Seiten. Es wurde nur das chinesische Original bereitgestellt. Die drei bisherigen Sprachfassungen verwenden dessen Originalabbildungen; Englisch und Russisch übersetzen den vollständigen Text und lokalisieren Bildunterschriften und Alternativtexte, während die ursprünglichen Beschriftungen innerhalb der Bilder erhalten bleiben. Auch diese deutsche Fassung verwendet dieselben Originalabbildungen.

[Redaktionelle Hinweise](/docs/rockchip-vsync-adjust/EDITORIAL-NOTES.md) · [ArmSoM-Dokumentation](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

## 1. Abtasttiming

Ein Bild wird normalerweise mit dem nachfolgend dargestellten Abtasttiming an den Bildschirm gesendet:

![Abtasttiming und aktiver Anzeigebereich](/docs/rockchip-vsync-adjust/assets/cn-p4-1.png)

*Abtasttiming und aktiver Anzeigebereich*

Jede Zeile besteht aus hsync, hback porch, hactive und hfront porch. Jedes Bild besteht aus vsync, vback porch, vactive und vfront porch.

htotal ist wie folgt definiert:

```text
htotal = hsync + hbackporch + hactive + hfrontporch
```

vtotal ist wie folgt definiert:

```text
vtotal = vsync + vbackporch + vactive + vfrontporch
```

Für die Abtastausgabe mit dem Pixeltakt pixel_clk und der Bildwiederholrate fps muss folgende Beziehung gelten:

```text
pixel_clk = htotal * vtotal * fps
```

Das Abtastdiagramm zeigt, dass eine Vsync-Periode 1/fps entspricht. Eine Änderung der Vsync-Periode bedeutet somit eine Änderung von fps, die durch eine Änderung des Pixeltakts, von htotal oder von vtotal erreicht werden kann. Bei einer festen Auflösung

bleiben hactive und vactive unverändert. Innerhalb von htotal lässt sich nur hbank (hsync + hback porch + hfront porch) anpassen; innerhalb von vtotal nur vbank (vsync + vback porch + vfront porch).

Bei den in der Quelle betrachteten Panels bedeutet eine hbank-Anpassung in der Regel eine Anpassung von HFP (hfront porch), eine vbank-Anpassung dagegen eine Anpassung von VFP (vfront porch). Beim RK3588 entspricht die Pixeltaktanpassung einer Anpassung der dclk-Frequenz.

Die folgende Erläuterung zur Anpassung der Vsync-Periode behandelt ausschließlich VFP, HFP und die dclk-Frequenz.

## 2. Anzeigepfade

Die Anzeigepfade des RK3588 sind nachfolgend dargestellt:

![RK3588-Anzeigepfade und optionale DSC-Kompression](/docs/rockchip-vsync-adjust/assets/cn-p5-1.png)

*RK3588-Anzeigepfade und optionale DSC-Kompression*

HDMI-, DSI-, DP- und eDP-Ausgänge werden unterstützt. Die HDMI- und DSI-Ausgabe kann DSC verwenden. Bei der Bewertung einer Vsync-Periodenanpassung für DSI und HDMI sind der Betrieb mit aktiviertem und mit deaktiviertem DSC getrennt zu betrachten.

## 3. VOP-Anpassung

Die VOP-Register des RK3588 ermöglichen die Anpassung von VFP, HFP oder der dclk-Frequenz. VFP-Änderungen lassen sich so konfigurieren, dass sie sofort oder an einer Bildgrenze wirksam werden. Änderungen von HFP und der dclk-Frequenz können nur an einer Bildgrenze wirksam werden.

Für die Änderung der Vsync-Periode über die dclk-Frequenz gelten folgende Einschränkungen:

1\. Nur VP0 und VP2 können die Vsync-Periode durch Umschalten der dclk-Quelle ändern.

2\. VP0 kann zwischen dclk0 und dclk1 umschalten; VP2 zwischen dclk2 und dclk1.

![Umschalten der dclk-Quelle für VP0/VP2](/docs/rockchip-vsync-adjust/assets/cn-p5-2.png)

*Umschalten der dclk-Quelle für VP0/VP2*

Beispielsweise kann eine an VP2 angeschlossene DSI-Schnittstelle dynamisch zwischen 120/60fps umschalten. Die Auflösungsinformationen lauten:

```text
console:/ # cat /sys/kernel/debug/dri/0/summary
Video Port0: DISABLED
Video Port1: DISABLED

Video Port2: ACTIVE
   Connector: DSI-1
      bus_format[1018]: RGB101010_1X30
      overlay_mode[0] output_mode[f] color_space[0], eotf:0
   Display mode: 3024x2016p120
      clk[1187744] real_clk[1187744] type[48] flag[a]
      H: 3024 4416 4432 4532
      V: 2016 2042 2044 2184
   Variable refresh rate info:
      Min refresh rate: 60
      Max refresh rate: 120
      Current refresh rate: 60

      Type: DCLK
      Current pixel clock:593872
   Cluster1-win0: ACTIVE
      win_id: 2
      format: AB24 little-endian (0x34324241)[AFBC] SDR[0] color_space[0]
glb_alpha[0xff]
      rotate: xmirror: 0 ymirror: 0 rotate_90: 0 rotate_270: 0
      csc: y2r[0] r2y[0] csc mode[0]
      zpos: 0
      src: pos[0, 0] rect[3024 x 2016]
      dst: pos[0, 0] rect[3024 x 2016]
      buf[0]: addr: 0x00000000ef7b9000 pitch: 12096 offset: 0
Video Port3: DISABLED
```

Verbinden Sie für die 120/60fps-Umschaltung sowohl dclk1 als auch dclk2 mit v0pll. Ihre Frequenzen unterscheiden sich um den Faktor zwei. Dadurch ist eine exakte Teilung möglich, während die übergeordnete PLL stabil bleibt. Die Taktbeziehungen lauten:

```text
cat /sys/kernel/debug/clk/clk_summary

...

   pll_v0pll          1  1  0 1187743988 0 0  50000
     v0pll            2  2  0 1187743988 0 0  50000
       dclk_vop2_src  1  2  0  296935997 0 0  50000
         dclk_vop2    1  2  0  296935997 0 0  50000
       dclk_vop1_src  1  2  0  148467999 0 0  50000
         dclk_vop1    1  2  0  148467999 0 0  50000
...
```

## 4. DSC-Anpassung

DSC unterstützt die Anpassung von VFP und HFP, allerdings werden beide ausschließlich sofort wirksam. Der DSC-Modus akzeptiert auch das von VOP nach einer dclk-Anpassung bereitgestellte Timing.

## 5. DSI-Anpassung

Änderungen der DSI-Register werden sofort wirksam, sowohl bei VFP als auch bei HFP. DSI bietet die Modi Manual und Auto-Calculation. Im Modus Auto-Calculation entnimmt der Controller alle benötigten Informationen und Timingparameter den IPI- und PPI-Schnittstellen, um das Bildtiming im Videomodus einzuhalten. IPI-Bilder können sich dynamisch ändern; der Controller passt seine Ausgabebilder entsprechend an. DSI kann daher die PHY-Ausgabe automatisch an das empfangene VOP-Timing anpassen, ohne dass die DSI-Register neu konfiguriert werden müssen. Die unterstützten Anpassungsverfahren unterscheiden sich je nach Modus.

### 5.1 VFP-Anpassung

DSI kann seine Vsync-Periode durch Anpassung von VFP ändern.

Ändern Sie im Modus Manual beim Eintreffen des Vsync-Interrupts die VFP-Register von VOP, DSC (falls aktiviert) und DSI gemeinsam mit sofortiger Wirkung. Dadurch ändert sich VFP für das aktuelle Bild. Aufgrund der DSI-Registerbeschränkungen ist VFP auf maximal 1023 begrenzt.

Um einen größeren VFP-Wert zu erreichen, können nur die VFP-Register von VOP und DSC (bei Verwendung der DSC-Kompression) geändert werden. Bleibt DSI VFP jedoch unverändert, beeinflusst dies die Paketübertragung während VFP, wie nachfolgend dargestellt:

![Signalverlauf aus der Quelle: fehlende Synchronisationspakete bei unverändertem DSI VFP](/docs/rockchip-vsync-adjust/assets/cn-p7-1.png)

*Signalverlauf aus der Quelle: fehlende Synchronisationspakete bei unverändertem DSI VFP*

Synchronisationspakete fehlen. Akzeptiert das Panel diesen Signalverlauf nicht, können Darstellungsfehler auftreten. Es wird daher nicht empfohlen, DSI VFP unkonfiguriert zu lassen.

Im Modus Auto-Calculation müssen beim Eintreffen des Vsync-Interrupts nur VOP und DSC (falls aktiviert) gemeinsam mit sofortiger Wirkung geändert werden. DSI VFP bleibt auf 1023 begrenzt.

### 5.2 HFP-Anpassung

Risiken bei der Umsetzung dynamischer Bildraten durch Konfiguration des DSC-HFP-Registers:

DSC-Timingregister werden sofort wirksam, anders als der an Bildgrenzen gebundene Mechanismus von VOP. Änderungen der DSC-Register am Ende eines Bildes stören das Timing des aktuellen Bildes und verursachen einen Fehler in der Bilddauer. Im DSC-Videomodus müssen die Abtasttimings von VOP und DSC möglichst genau übereinstimmen; andernfalls läuft der interne DSC-Puffer über.

Der folgende fehlerhafte MIPI-DPHY-Signalverlauf zeigt einen DSC-Fehler, bei dem keine Daten übertragen werden:

![Keine MIPI-DPHY-Datenübertragung nach einem DSC-Fehler](/docs/rockchip-vsync-adjust/assets/cn-p8-1.png)

*Keine MIPI-DPHY-Datenübertragung nach einem DSC-Fehler*

Im Modus Manual unterstützt RK3588 DSI derzeit keine Vsync-Änderung über HFP. Der lokale Test der Quelle im DSC-Modus verursachte den nachfolgend gezeigten Darstellungsfehler; dies ist kein ArmSoM-Test.

![Originalfoto eines Darstellungsfehlers nach HFP-Anpassung im DSC-Modus](/docs/rockchip-vsync-adjust/assets/cn-p8-2.png)

*Originalfoto eines Darstellungsfehlers nach HFP-Anpassung im DSC-Modus*

Im Modus Auto-Calculation ohne DSC muss nur VOP HFP geändert werden; DSI unterstützt dieses Verfahren. Bei aktiviertem DSC müssen sowohl die VOP- als auch die DSC-Register geändert werden. Es ist jedoch nicht gewährleistet, dass die HFP-Änderungen in derselben Zeile wirksam werden. Die HFP-Anpassung wird in diesem Fall daher nicht unterstützt.

### 5.3 Anpassung der dclk-Frequenz

Im Modus Manual wird die Änderung der Vsync-Periode durch Anpassung der VOP-dclk-Frequenz nicht unterstützt.

Der Modus Auto-Calculation unterstützt die Anpassung der Vsync-Periode über die dclk-Frequenz unabhängig davon, ob DSC aktiviert ist. Der DSI-Controller passt seine Ausgabe automatisch an.

Die beiden 120/60fps-Timingsätze A/B im roten Rechteck unten veranschaulichen die Bildratenumschaltung:

![Zwei 120/60fps-Timingsätze; rotes Rechteck: 10 bit 3.75x A/B](/docs/rockchip-vsync-adjust/assets/cn-p9-1.png)

*Zwei 120/60fps-Timingsätze; rotes Rechteck: 10 bit 3.75x A/B*

| Parameter | Einheit | 10 bit 3x A | 10 bit 3x B | 10 bit 3.75x A | 10 bit 3.75x B |
| --- | --- | --- | --- | --- | --- |
| Timing | 120(FPP)+60(Finger) | A | B | A | B |
| Bildrate | Hz | 120 | 60 | 120 | 60 |
| VSA | Zeile | 2 | 2 | 2 | 2 |
| VBP | Zeile | 140 | 140 | 140 | 140 |
| Vadr | Zeile | 2016 | 2016 | 2016 | 2016 |
| VFP | Zeile | 26 | 26 | 26 | 26 |
| HAS | Pixel | 10 | 10 | 10 | 10 |
| HBP | Pixel | 20 | 306 | 38 | 332 |
| Hadr | Pixel | 3024 | 3024 | 3024 | 3024 |
| HFP | Pixel | 30 | 308 | 38 | 334 |
| MIPI-Geschwindigkeit | Mbps | 1108 | 1108 | 928 | 928 |
| Schnittstelle | MIPI | Dphy 2port 8lane+DSC | Dphy 2port 8lane+DSC | Dphy 2port 8lane+DSC | Dphy 2port 8lane+DSC |

#### 5.3.1 Einzelheiten der Bildratenumschaltung über die dclk-Frequenz

In der folgenden Abbildung stellt das rote Signal die im Panel-IC dekodierten HSYNC-Informationen dar. Eine dclk-basierte Bildratenänderung wird an einer Bildgrenze wirksam. Beim Übergang erwartet das Panel nach dem Zählen von 26 VFP-Zeilen des vorherigen Bildes VSYNC, gefolgt von 140+2 Zeilen VBP+VSA vor DATA. Der Panel-IC verwendet die durchschnittliche Breite der ersten 4 Zeilen nach VSYNC und den Übergangszeitpunkt, um die Bildratenumschaltung zu bestimmen.

![Originalsignalverlauf 60→120fps. Grüne Beschriftungen kennzeichnen internes HSYNC, einen Pegelwechsel je hsync, 26 Zeilen des vorherigen Bildes, 142 Zeilen vor DATA und die mittlere Zeilenbreite über vier Zeilen.](/docs/rockchip-vsync-adjust/assets/cn-p9-2.png)

*Originalsignalverlauf 60→120fps. Grüne Beschriftungen kennzeichnen internes HSYNC, einen Pegelwechsel je hsync, 26 Zeilen des vorherigen Bildes, 142 Zeilen vor DATA und die mittlere Zeilenbreite über vier Zeilen.*

#### 5.3.2 Von 120fps auf 60fps

![120→60fps: tatsächliche Umschaltung der externen Frequenz und vom internen IC erkannte Umschaltung](/docs/rockchip-vsync-adjust/assets/cn-p10-1.png)

*120→60fps: tatsächliche Umschaltung der externen Frequenz und vom internen IC erkannte Umschaltung*

#### 5.3.3 Von 60fps auf 120fps

![60→120fps: tatsächliche Umschaltung der externen Frequenz und vom internen IC erkannte Umschaltung](/docs/rockchip-vsync-adjust/assets/cn-p10-2.png)

*60→120fps: tatsächliche Umschaltung der externen Frequenz und vom internen IC erkannte Umschaltung*

## 6. eDP-/DP-Anpassung

VRR über eDP und DP erfordert sowohl die Unterstützung des Controllers als auch die entsprechenden DPCD-/EDID-Beschreibungen. Die VRR-Unterstützung über eDP/DP wird auch Adaptive-Sync genannt.

### 6.1 VRR-Unterstützung über DPCD

MSA-Pakete enthalten Timinginformationen, anhand derer der Empfänger (Sink) das Timing des Videodatenstroms rekonstruiert. Diese Timingparameter sind für statisches Videotiming vorgesehen. Ändert sich das Timing des Datenstroms dynamisch, kann der Empfänger die MSA-Timinginformationen nicht verwenden. Der Sender (Source) liest MSA_TIMING_PAR_IGNORED in DOWN_STREAM_PORT_COUNT (DPCD-Adresse 00006h, bit6), um festzustellen, ob der Empfänger nahtlose Timingänderungen (VRR) unterstützt. Wenn dies unterstützt wird und

der Sender diese Funktion benötigt, verweist der Quelltext auf MSA_TIMING_PAR_IGNORE_EN in DOWNSPREAD_CTRL (DPCD-Adresse 00107h, bit7); der Empfänger ignoriert die nachfolgend gezeigten MSA-Parameter. Der Originalsatz lässt den genauen Schreibvorgang beziehungsweise Wert aus; dieser wird hier nicht durch Vermutungen ergänzt.

![Originaltabelle der MSA-Timingparameter, die ignoriert werden können](/docs/rockchip-vsync-adjust/assets/cn-p11-1.png)

*Originaltabelle der MSA-Timingparameter, die ignoriert werden können*

| HTotal[15:0] | HStart[15:0] | HSyncPolarity (HSP) | HSyncWidth[14:0] (HSW) |
| --- | --- | --- | --- |
| VTotal[15:0] | VStart[15:0] | VSyncPolarity (VSP) | VSyncWidth[14:0] (VSW) |

### 6.2 VRR-Unterstützung über EDID

EDID definiert den Display Range Limit Descriptor zur Beschreibung der VRR-Unterstützung, wie nachfolgend dargestellt:

![Originalauszug des Display-Range-Limits-Deskriptors; spätere Bytes sind am unteren Rand des Quellbildes nicht vollständig sichtbar](/docs/rockchip-vsync-adjust/assets/cn-p11-2.png)

*Originalauszug des Display-Range-Limits-Deskriptors; spätere Bytes sind am unteren Rand des Quellbildes nicht vollständig sichtbar*

| Byte | Wert / Bits | Beschreibung |
| --- | --- | --- |
| 0, 1 | (00 00)h | Kennzeichnet diesen 18-Byte-Deskriptor als Display Descriptor. |
| 2 | 00h | Reserviert: bei Verwendung als Display Descriptor auf 00h setzen. |
| 3 | FDh | Kennung des Display Range Limits Descriptor. |
| 4 | bits 7 6 5 4 3 2 1 0 | Offset-Flags für den Anzeigebereich. |
| 4 | 0000 --00 | Die Offsets der Vertikalfrequenz sind null. |
| 4 | 0000 --10 | Maximale Vertikalfrequenz +255 Hz; Minimum unverändert. |
| 4 | 0000 --11 | Maximale und minimale Vertikalfrequenz +255 Hz. |
| 4 | 0000 00-- | Die Offsets der Horizontalfrequenz sind null. |
| 4 | 0000 10-- | Maximale Horizontalfrequenz +255 kHz; Minimum unverändert. |
| 4 | 0000 11-- | Maximale und minimale Horizontalfrequenz +255 kHz. |
| 4 | 01h, 04h → 07h, 09h, 0Dh, 10h → FFh | Reserviert; nicht verwenden. Im Original fehlt ein Trennzeichen zwischen 0Dh und 10h; die Werte bleiben erhalten. |
| 5 | 01h → FFh | Minimale Vertikalfrequenz (Halbbildrate bei Zeilensprungverfahren) |
| 5 | Byte 4, bits 1, 0 ≠ 11 | Ganzzahlig binär codierte Frequenz, Bereich 1 Hz ~ 255 Hz |
| 5 | Byte 4, bits 1, 0 = 11 | Ganzzahlig binär codierte Frequenz, Bereich 256 Hz ~ 510 Hz |
| 5 | 00h | Reserviert; nicht verwenden. |
| 6 | 01h → FFh | Maximale Vertikalfrequenz (Halbbildrate bei Zeilensprungverfahren) |
| 6 | Byte 4, bits 1 ≠ 1 | Ganzzahlig binär codierte Frequenz, Bereich 1 Hz ~ 255 Hz |
| 6 | Byte 4, bits 1 = 1 | Ganzzahlig binär codierte Frequenz, Bereich 256 Hz ~ 510 Hz |
| 6 | Hinweis | Die minimale Frequenz muss kleiner oder gleich der maximalen Frequenz sein. |
| 6 | 00h | Reserviert; nicht verwenden. |
| 7 | 01h → FFh | Minimale Horizontalfrequenz |
| 7 | Byte 4, bits 3, 2 ≠ 11 | Ganzzahlig binär codierte Frequenz, Bereich 1 kHz ~ 255 kHz |
| 7 | Byte 4, bits 3, 2 = 11 | Ganzzahlig binär codierte Frequenz, Bereich 256 kHz ~ 510 kHz |
| 7 | 00h | Reserviert; nicht verwenden. |
| 8 | 01h → FFh | Maximale Horizontalfrequenz |
| 8 | Byte 4, bits 3 ≠ 1 | Ganzzahlig binär codierte Frequenz, Bereich 1 kHz ~ 255 kHz |
| 8 | Byte 4, bits 3 = 1 | Ganzzahlig binär codierte Frequenz, Bereich 256 kHz ~ 510 kHz |
| 8 | Hinweis | Die minimale Frequenz muss kleiner oder gleich der maximalen Frequenz sein. |
| 8 | 00h | Reserviert; nicht verwenden. |

Dieser Deskriptor legt den unterstützten VRR-Bereich fest.

Laut Quelle verwenden die EDID-Timingdefinitionen minimale Werte für vblank und hblank. Gibt EDID beispielsweise einen VRR-Bereich von 30 ~ 100 Hz an, unterstützt ein Timing mit einer Bildrate von 60Hz

VRR von 30 ~ 60Hz, während ein Timing mit 24 Hz kein VRR unterstützt. Um innerhalb des angegebenen VRR-Bereichs niedrigere Bildraten zu erreichen, verlängern Sie vbank.

### 6.3 eDP-VRR-Anpassung

eDP unterstützt die Vsync-Anpassung über VFP. Nur VOP VFP muss geändert werden; konfigurieren Sie analogix,force-stream-valid im eDP-DTS, damit eDP sich automatisch an das von VOP gesendete Timing anpasst.

Ein eDP-Panel unterstützt möglicherweise kein EDID. Definieren Sie in diesem Fall den unterstützten VRR-Bereich im DTS.

{% endraw %}

