---
title: "Rockchip HDMI RX: RK3588-Erfassung, TIF/Camera, HDCP und Fehlersuche"
description: "RK3588 HDMI RX mit reserviertem Speicher, Audio, EDID, HDCP, CEC und TIF/Camera konfigurieren; Signal- und Neustartfehler anhand vollständiger Befehle, Protokolle und Patches untersuchen."
translation_key: "070-rockchip-hdmi-rx"
slug: "070-rockchip-hdmi-rx"
lang: "de"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "camera"
products: []
tags: ["Rockchip", "HDMI IN", "HDMI RX", "Android", "Linux"]
keywords: "ArmSoM Rockchip HDMI IN RK3588 HDMI RX HDCP"
excerpt: "RK3588 HDMI RX mit reserviertem Speicher, Audio, EDID, HDCP, CEC und TIF/Camera konfigurieren; Signal- und Neustartfehler anhand vollständiger Befehle, Protokolle und Patches untersuchen."
---

{% raw %}

# Rockchip HDMI RX: RK3588-Erfassung, TIF/Camera, HDCP und Fehlersuche

Dies ist eine Rockchip-Plattformreferenz, keine auf ArmSoM-Hardware geprüfte Anleitung. Beispiele, Protokolle, Latenzwerte und Aussagen zur Unterstützung stammen aus dem Originaldokument. Prüfen Sie vor einer ArmSoM-Anpassung den genauen SoC, die HDMI-Eingangsführung der Platine, Bridge-Chip/Verdrahtung, Takte und Versorgung, SDK/BSP, Kernel und Android-HAL. Daraus darf keine Unterstützung aller Boards abgeleitet werden. Es wurde ausschließlich ein chinesisches PDF bereitgestellt. Englisch und Russisch übersetzen dessen technischen Inhalt vollständig; Deutsch folgt der geprüften englischen Aufbereitung. Alle Artikel verwenden die chinesischen Originalabbildungen; Text innerhalb der Bilder wird nicht als englisch ausgegeben. Code und Kommentare in der Quellsprache bleiben erhalten. Es wurden keine Flash-, Register-, Berechtigungs- oder SELinux-Befehle ausgeführt.

Technische Quellversion: V1.1.7. Der native HDMI RX von RK3588 umfasst 4K60/4K30/1080P60/720P60, Hotplug, Aufzeichnung, EDID, HDCP 1.4/2.3 und CEC. RK3588S besitzt diesen Block nicht. HDMI-zu-MIPI-Beispiele für RK3576 bedeuten keine native HDMI-RX-Unterstützung.

| Chipplattform | Kernel | Android |
| --- | --- | --- |
| RK3588 (RK3588S besitzt keinen HDMI RX) | Linux 5.10 | 12.0 |

[Redaktionelle Hinweise](/docs/rockchip-hdmi-rx/EDITORIAL-NOTES.md) · [ArmSoM-Dokumentation](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

## 1. Überblick über HDMI IN

### 1.1 HDMI-RX-Funktionen

HDMI 1.4b/2.0 RX: bis 4K@60fps

Unterstützte Formate: RGB888/YUV420/YUV422/YUV444, 8 Bit

Pixeltakt: bis 600MHz

HDCP1.4/2.3

CEC-Hardware-Engine

E-EDID-Konfiguration

S/PDIF: 2-Kanal-Ausgabe

I2S: 2-/4-/6-/8-Kanal-Ausgabe

Hinweis: RK3588S enthält kein HDMI-RX-Modul.

### 1.2 HDMI-IN-Blockdiagramm

![HDMI-RX-Architektur — chinesisches PDF S. 5](/docs/rockchip-hdmi-rx/assets/cn-p5-1.png)

HDMI-RX-Architektur — chinesisches PDF S. 5

Je nach Anwendung lässt sich HDMI RX in das TIF- oder Camera-Framework integrieren. TIF bietet geringere Latenz bei der Bildübertragung; Camera stellt standardisierte Camera-APIs bereit und erleichtert damit Aufzeichnung sowie Einbindung nachgelagerter Bildverarbeitungsalgorithmen.

## 2. HDMI-RX-Treibercode und DTS-Konfiguration

### 2.1 Anforderungen an die SDK-Version

Die HDMI-IN-Unterstützung kann weiterentwickelt werden. Die Quelle empfiehlt ein Update auf die neueste passende SDK-Version. Fragen Sie die SDK-Version wie folgt ab:

```text
rk3588_s:/ # getprop | grep rksdk
[ro.rksdk.version]: [ANDROID12_RKR9]
```

### 2.2 Treibercode und Kernel-Konfiguration

Treibercode:

```text
drivers/media/platform/rockchip/hdmirx/
```

Kernel-Konfiguration:

```text
CONFIG_VIDEO_ROCKCHIP_HDMIRX=y
```

### 2.3 DTS-Konfiguration

Orientieren Sie sich an der RK3588-EVB1-DTS-Konfiguration im SDK:

```text
arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
```

#### 2.3.1 HDMI-RX-Controller

```text
/* Should work with at least 128MB cma reserved above. */
&hdmirx_ctrler {
   status = "okay";


   /* Effective level used to trigger HPD: 0-low, 1-high */
   hpd-trigger-level = <1>;
   hdmirx-det-gpios = <&gpio2 RK_PB5 GPIO_ACTIVE_LOW>;
   pinctrl-names = "default";
   pinctrl-0 = <&hdmim1_rx &hdmirx_det>;
};

hdmi {
   hdmirx_det: hdmirx-det {
      rockchip,pins = <2 RK_PB5 RK_FUNC_GPIO &pcfg_pull_up>;
   };

};
```

Die Board-Einstellungen müssen der tatsächlichen Beschaltung entsprechen:

hpd-trigger-level: Aktiver Pegel zur HPD-Auslösung. `<1>` bedeutet, dass RK3588-Steuerpin und HPD des HDMI-Anschlusses denselben Pegel haben; `<0>` bedeutet entgegengesetzte Pegel.

![HPD-Steuerschaltung — chinesisches PDF S. 7](/docs/rockchip-hdmi-rx/assets/cn-p7-1.png)

HPD-Steuerschaltung — chinesisches PDF S. 7

hdmirx-det-gpios: Pin zur Erkennung des HDMI-Steckers. GPIO und aktiven Pegel gemäß Hardware konfigurieren. Bei aktivem Low-Pegel einen internen Pull-up in pinctrl einstellen.

![Schaltung zur HDMI-Steckererkennung — chinesisches PDF S. 7](/docs/rockchip-hdmi-rx/assets/cn-p7-2.png)

Schaltung zur HDMI-Steckererkennung — chinesisches PDF S. 7

#### 2.3.2 Reservierter Speicher

RK3588 HDMI RX kann ausschließlich physisch zusammenhängenden Speicher verwenden. Reservieren Sie mindestens 128 MB CMA-Speicher; für eine Vergrößerung ändern Sie die reserved-memory-Größe im DTS:

Hinweis: Diese Berechnung geht von 3840x2160, RGB888 und vier umlaufenden Puffern aus.

```text
/* If hdmirx node is disabled, delete the reserved-memory node here. */
reserved-memory {
   #address-cells = <2>;

   #size-cells = <2>;
   ranges;

   /* Reserve 128MB memory for hdmirx-controller@fdee0000 */
   cma {
      compatible = "shared-dma-pool";
      reusable;
      /* Start address: 256 * 0x100000, Length: 128 * 0x100000 */
      reg = <0x0 (256 * 0x100000) 0x0 (128 * 0x100000)>;
      linux,cma-default;
   };
};
```

#### 2.3.3 Audiokonfiguration

Ergänzen Sie die Soundkartenkonfiguration im DTS:

```text
diff --git a/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
b/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
index 4aa6a8ce9364..84c9c51d3b7f 100644

--- a/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
@@ -47,6 +47,26 @@ play-pause-key {
           };
      };
+     hdmiin_dc: hdmiin-dc {
+          compatible = "rockchip,dummy-codec";
+          #sound-dai-cells = <0>;
+     };
+
+     hdmiin-sound {
+          compatible = "simple-audio-card";

+          simple-audio-card,format = "i2s";
+          simple-audio-card,name = "rockchip,hdmiin";
+          simple-audio-card,bitclock-master = <&dailink0_master>;
+          simple-audio-card,frame-master = <&dailink0_master>;
+          status = "okay";
+          simple-audio-card,cpu {
+                sound-dai = <&i2s7_8ch>;
+          };
+          dailink0_master: simple-audio-card,codec {
+                sound-dai = <&hdmiin_dc>;
+          };
+     };
+

      pcie20_avdd0v85: pcie20-avdd0v85 {
           compatible = "regulator-fixed";
           regulator-name = "pcie20_avdd0v85";
@@ -460,6 +480,10 @@ &i2s6_8ch {
      status = "okay";
 };
+&i2s7_8ch {
+     status = "okay";
+};
+
```

Tragen Sie die HDMIIN-Soundkarteninformationen in der HAL ein:

```text
diff --git a/tinyalsa_hal/audio_hw.c b/tinyalsa_hal/audio_hw.c
index ea97bee..509d140 100644

--- a/tinyalsa_hal/audio_hw.c
+++ b/tinyalsa_hal/audio_hw.c
@@ -362,6 +362,7 @@ struct dev_proc_info HDMI_IN_NAME[] =
 {
   {"realtekrt5651co", "tc358749x-audio"},
+  {"rockchiphdmiin", NULL},
   {NULL, NULL}, /* Note! Must end with NULL, else will cause crash */
 };
```

Das in der Quelle beschriebene Standard-SDK enthält diese Einstellungen bereits. Wird der Soundkartenname geändert, ergänzen Sie die entsprechenden Angaben im HDMI_IN_NAME-Array der HAL.

#### 2.3.4 HDCP-Konfiguration

RK3588 besitzt zwei HDCP2.3-Controller, hdcp0 und hdcp1. Laut Quelle hat jeder drei Ports; folgende Zuordnungen werden genannt:

hdcp0: DPTX0 und DPTX1

hdcp1: HDMIRX, HDMITX0 und HDMITX1

Aktivieren Sie hdcp1, wenn HDMIRX HDCP2.3 benötigt.

Ausschließliche HDCP1.4-Unterstützung:

```text
&hdmirx_ctrler {
   status = "okay";

   hdcp1x-enable;
};
```

Aktivieren Sie HDCP2.3 wie folgt. Dabei wird standardmäßig auch HDCP1.4-Kompatibilität bereitgestellt:

```text
&hdcp1 {
   status = "okay";
};


&hdmirx_ctrler {
   status = "okay";
   hdcp2x-enable;
};
```

#### 2.3.5 CEC-Konfiguration

```text
&hdmirx_ctrler {
   status = "okay";
   cec-enable;

};
```

### 2.4 EDID-Konfiguration

RK3588 unterstützt konfigurierbare EDID. Die EDID des Quelltreibers enthält folgende Auflösungen:

```text
3840x2160P60、3840x2160P50、3840x2160P30、3840x2160P25、3840x2160P24、
1920x1080P60、1920x1080P50、1920x1080P30、1920x1080i60、1920x1080i50、
1600x900P60、1440x900P60、1280x800P60、

1280x720P60、1280x720P50、1024x768P60、
720x576P50、720x480P60、720x576i50、720x480i60、
800x600P60、640x480P60
```

Unterstützte Eingangsformate sind:

```text
RGB888、YUV420、YUV422、YUV444
```

Die Quelle bietet zwei EDID-Gruppen, zwischen denen höhere Anwendungsschichten wählen können:

edid_init_data_340M: Auflösungen mit Pixeltakt unter 340M, hauptsächlich HDMI1.4-Auflösungen einschließlich 4K60 YUV420.

edid_init_data_600M: Auflösungen mit Pixeltakt 594M, unterstützt 4K60 YUV422/YUV444/RGB888.

Für eigene EDID-Anforderungen bearbeiten Sie das entsprechende Array direkt im Treiber:

drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c

```text
static u8 edid_init_data_340M[] = {
   0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x00,
   0x49, 0x70, 0x88, 0x35, 0x01, 0x00, 0x00, 0x00,

   0x2D, 0x1F, 0x01, 0x03, 0x80, 0x78, 0x44, 0x78,
   ...
};

static u8 edid_init_data_600M[] = {
   0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x00,
   0x49, 0x70, 0x88, 0x35, 0x01, 0x00, 0x00, 0x00,
   0x2D, 0x1F, 0x01, 0x03, 0x80, 0x78, 0x44, 0x78,
   ...
};
```

Alternativ lässt sich EDID dynamisch über die ioctl-Schnittstelle des Videoknotens konfigurieren:

```text
static const struct v4l2_ioctl_ops hdmirx_v4l2_ioctl_ops = {
   ...

   .vidioc_g_edid = hdmirx_get_edid,
   .vidioc_s_edid = hdmirx_set_edid,
   ...
};
```

EDID kann mit einem EDID-Editor bearbeitet und anschließend in den Treiber übernommen werden. Die Quelle schlägt vor, einen grafischen EDID-Editor separat zu beschaffen.

## 3. HDMI-IN-Videoarchitektur

### 3.1 HDMI-IN-Videoablauf

![APK-Ablauf beim Öffnen und Schließen — chinesisches PDF S. 12](/docs/rockchip-hdmi-rx/assets/cn-p12-1.png)

APK-Ablauf beim Öffnen und Schließen — chinesisches PDF S. 12

### 3.2 Grundarchitektur des HDMI-RX-Treibers

Beachten Sie insbesondere folgende Interrupts und delayed_work-Handler:

hdmirx_5v_det_irq_handler: Interrupt zur 5-V-Erkennung, ausgelöst durch GPIO HDMIIRX_DET_L; erkennt Einstecken und Abziehen von HDMI.

hdmirx_hdmi_irq_handler: Interrupt des HDMI-RX-Controllers, hauptsächlich für Initialisierung/Konfiguration und Überwachung von HDMI-Signaländerungen.

hdmirx_dma_irq_handler: HDMI-RX-DMA-Interrupt, hauptsächlich zum Pufferwechsel während der Bildvorschau.

hdmirx_delayed_work_hotplug: delayed_work zum Interrupt der 5-V-Erkennung; konfiguriert HDMI RX bei Hotplug-Ereignissen.

hdmirx_delayed_work_res_change: Konfiguriert den Controller neu und wartet auf Signaleinrastung, wenn der HDMI-RX-Controller einen Signaländerungsinterrupt erkennt.

Ablauf bei Auflösungsänderung:

![Ablauf bei Auflösungsänderung — chinesisches PDF S. 13](/docs/rockchip-hdmi-rx/assets/cn-p13-1.png)

Ablauf bei Auflösungsänderung — chinesisches PDF S. 13

Hotplug-Ablauf:

![Hotplug-Ablauf — chinesisches PDF S. 14](/docs/rockchip-hdmi-rx/assets/cn-p14-1.png)

Hotplug-Ablauf — chinesisches PDF S. 14

### 3.3 Bildpufferwechsel

![Bildpufferwechsel — chinesisches PDF S. 15](/docs/rockchip-hdmi-rx/assets/cn-p15-1.png)

Bildpufferwechsel — chinesisches PDF S. 15

QBuf / DQBuf: Nutzer übergeben freie Puffer über QBuf und holen mit Bilddaten gefüllte Puffer über DQBuf ab.

Line flag irq: Nach einer konfigurierten Zeilenanzahl, in der Quelle als width/2 beziehungsweise halber Frame bezeichnet, wird ein Interrupt ausgelöst. Der Handler aktualisiert den Puffer. Eine in HDMI RX geschriebene physische Pufferadresse wird erst beim nächsten vsync wirksam. Da vblank kurz ist, könnte eine Aktualisierung darin zu spät erfolgen und der nächste Frame den vorherigen überschreiben; deshalb wird der Puffer vorab aktualisiert. Die Quellangabe width/2 bleibt zur Prüfung erhalten.

DMA idle irq: Der DMA-Idle-Interrupt entspricht einem Frame-Ende-Interrupt. Er tritt nach Übertragung eines Frames auf; der Puffer wird in vb_done list aufgenommen und wartet auf Abholung über DQBuf.

Stream on: Startet das Streaming, zunächst mit curr_buf.

Stream off: Nach einer Stream-off-Anforderung wartet der Treiber vor dem Stoppen auf einen Interrupt und gibt anschließend alle Puffer zurück.

### 3.4 Latenz der Bildübertragung

Die Quelle nennt etwa 20–30 ms Latenz mit TIF und beschleunigter Anzeige. Dies ist keine ArmSoM-Messung.

Die Quelle nennt etwa 100–120 ms Anzeigelatenz mit dem Camera-Framework. Dies ist keine ArmSoM-Messung.

## 4. HDMI-IN-HDCP

HDCP1.4- und HDCP2.3-Schlüssel müssen separat über den offiziellen HDCP-Lizenzierungskanal erworben werden; laut Quelle enthält RK3588 keine eingebauten HDCP-Schlüssel.

### 4.1 HDCP1.4

#### 4.1.1 DTS-Konfiguration

Siehe HDCP-Konfigurationsabschnitt; setzen Sie hdcp1x-enable;.

#### 4.1.2 Schlüssel programmieren

Das Werkzeug zum Aufteilen und Umwandeln der Schlüssel befindet sich im SDK:

```text
RKTools/windows/Rockchip_HdcpKey_Writer_V1.0.1.7z 工具包下面有 KeyConvertor key 的拆
分和转换工具，更新到   KeyConvertor-V2.0.5 可以拆分成一个bin文件只有一个key.
```

Das Werkzeug zum Programmieren der Schlüssel befindet sich im SDK:

```text
RKTools/windows/Rockchip_HdcpKey_Writer_V1.0.1.7z
```

Extrahieren Sie zunächst die benötigten Schlüssel mit dem Aufteilungs-/Konvertierungswerkzeug aus der ursprünglichen Schlüsseldatei und wandeln Sie sie anschließend in eine .skf-Programmierdatei um.

Wenn Sie nicht das Rockchip-Programmierwerkzeug verwenden, teilen Sie die Schlüssel so auf, dass jede Datei genau einen Schlüssel enthält. Tragen Sie im Feld für Schlüssel je Datei 1 ein und extrahieren Sie die Dateien; die Umwandlung in .skf entfällt.

![Werkzeug zur HDCP-Schlüsselkonvertierung — chinesisches PDF S. 16](/docs/rockchip-hdmi-rx/assets/cn-p16-1.png)

Werkzeug zur HDCP-Schlüsselkonvertierung — chinesisches PDF S. 16

Versetzen Sie das Gerät in den Loader-Modus. Wählen Sie im Programmierwerkzeug hdcp1.4Hdmirx und RK3588. RK3588 ergänzt AES-Verschlüsselung für HDCP1.4-Schlüssel, daher ist Do AES optional: Ohne diese Option wird nur SEED verwendet; mit ihr wird zusätzlich zu SEED AES angewendet. Die Quelle beschreibt dies als sicherer. Importieren Sie die .skf-Datei und klicken Sie zum Programmieren auf Write.

Hinweis: Nach dem Programmieren eines Schlüssels wechselt das Werkzeug automatisch zum nächsten.

![HDCP-1.4-Programmierkonfiguration — chinesisches PDF S. 17](/docs/rockchip-hdmi-rx/assets/cn-p17-1.png)

HDCP-1.4-Programmierkonfiguration — chinesisches PDF S. 17

Struktur des HDCP1.4-Schlüssels:

```text
一个HDCP 1.4 KEY有308 Bytes，分别如下：
8 Bytes KSV: 5 Bytes KSV + 3 Bytes 0x0组成;
280 Bytes DPK;

20 Bytes SHA.
```

#### 4.1.3 HDCP1.4-Status prüfen

```text
cat /sys/class/misc/hdmirx_hdcp/status


HDCP Disable: hdcp1.4 没使能
HDCP1.4: Authenticated start: 认证过程中
HDCP1.4: Authenticated success: 认证成功
HDCP1.4: Authenticated failed: 认证失败
HDCP1.4: Unknown status: 未知状态
```

### 4.2 HDCP2.3

Das Werkzeug zum Verpacken der HDCP2.3-Firmware wird im Quellablauf separat bereitgestellt. Beschaffen Sie zunächst das HDCP2.3-Werkzeugpaket über Redmine.

#### 4.2.1 DTS-Konfiguration

Siehe HDCP-Konfigurationsabschnitt; setzen Sie hdcp2x-enable;.

#### 4.2.2 Firmware verpacken und Dienst starten

Entpacken Sie WC_HDCP2_BASE_ESM_Firmware unter Linux. Kopieren Sie hdcp_receivers.bin in dessen Stammverzeichnis und in tools/. Wird auch HDMITX benötigt, kopieren Sie hdcp_transmitter.bin in dieselben Verzeichnisse.

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_receivers.bin .

cp ../hdcp_receivers.bin tools/
```

Führen Sie build_rockchip_fw.sh aus, um Firmware und RX-Schlüssel zu verpacken:

```text
DWC_HDCP2_BASE_ESM_Firmware$ ./build_rockchip_fw.sh
```

Der Verpackungsvorgang fragt folgende Eingaben ab:

(1) Firmwaretyp wählen: 1 -build firmware for both HDMIRX and HDMITX. Die Quelle nennt die erzeugte Datei hier ./firmware/hdpc2_hdmi.fw; später verwendet sie hdcp2_hdmi.fw. Prüfen Sie diese Abweichung des Dateinamens.

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP

Choose the fw type: 1
```

(2) Anzahl der zu erzeugenden RX-Schlüssel angeben, etwa 10 oder 100. Einzelne Schlüssel entstehen als fw_hdcp_receivers_*.bin unter ./rxkeys/hdcpkeys?-?/. Bei einem eigenen Programmierwerkzeug können diese .bin-Dateien direkt programmiert werden.

```text
Create Rx Key Number:
10
......

Create 10 keys to tools/rxkeys/hdcpkeys1-10/
```

(3) Für das Rockchip-Programmierwerkzeug die Schlüssel in eine .skf-Datei unter ./rxkeys/hdcpkeys?-?/ verpacken. Andernfalls mit n antworten.

```text
Do want to pack these keys to .skf file? [y/n]:
y


10 file packed to ./rxkeys/hdcpkeys1-10/hdcprxkeys1-10.skf
```

HDCP2.3-RX-Schlüssel programmieren:

(1) hdcp2_hdmi.fw unter device/rockchip/rk3588/ ablegen. Beim Build wird die Datei nach vendor/firmware/hdcp2_hdmi.fw kopiert.

(2) In RKDevInfoTool.exe HDCP2X_HDMIRX wählen und die erzeugte hdcprxkeys1-10.skf importieren. Im Loader-Modus programmieren. Nach jedem Schlüssel wechselt das Werkzeug automatisch zum nächsten und wartet.

(3) HDCP2.3-Schlüssel benötigen in diesem Ablauf keine AES-Verschlüsselung. Wählen Sie nur RK3588 und hdcp2x hdmirx.

![HDCP-2.3-Programmierkonfiguration — chinesisches PDF S. 19](/docs/rockchip-hdmi-rx/assets/cn-p19-1.png)

HDCP-2.3-Programmierkonfiguration — chinesisches PDF S. 19

Dienst hdcp2_rx_tx

Der Dienst wird beim Start automatisch geladen. Prüfen Sie bei fehlgeschlagener Authentifizierung die Protokolle mit `logcat | grep HDCP2`.

#### 4.2.3 HDCP2.3-Status prüfen

```text
cat /sys/class/misc/hdmirx_hdcp/status

HDCP Disable: HDCP没使能

HDCP2.3: Authenticated success: 认证成功
HDCP2.3: Authenticated failed: 认证失败
HDCP2.3: No dectypted: 源端没有开启HDCP2.x
```

### 4.3 HDCP-Schlüssel programmieren

(1) Verwenden Sie die Rockchip-Programmierwerkzeuge aus RKTools/windows/ im SDK.

(2) Alternativ entwickeln Sie mit Rockchips libhdcp.so eine Anwendung zur Schlüsselprogrammierung. Sie ruft deren Schnittstellen auf, um Schlüssel zu verschlüsseln und in den Vendor-Speicher zu schreiben. Die Bibliothek ist im beschriebenen Standard-SDK nicht enthalten; fordern Sie sie über Redmine an.

libhdcp.so bietet folgende Schnittstellen:

```text
enum HDCP_KEY_ID {
   HDCP1X_KEY_HDMITX_RK33 = 0,
   HDCP1X_KEY_HDMITX_RK3588,

   HDCP1X_KEY_HDMIRX_RK3588,
   HDCP1X_KEY_HDMIRX_RK628,
   HDCP1X_KEY_DP_RK3588,
   HDCP2X_KEY_HDMIRX_RK3588,
};
/*
 * Encrypt the key, but is not written to vendor

 *
 * id: HDCP KEY type
 * keyin: HDCP1.x 308 Byte raw Key, HDCP2.x 1000 Byte Key
 * keyin_size: HDCP1.x 308, HDCP2.x 1000
 * keyout: The encrypted key
 * keyout_size: HDCP1.x 314, HDCP2.x 1000
 */
int hdcp_key_process(enum HDCP_KEY_ID id, uint8_t *keyin, int keyin_size, uint8_t
*keyout, int keyout_size);

/*
 * Encrypt key and write it to vendor

 *
 * id: HDCP KEY type
 * keyin: HDCP1.x 308 Byte raw Key, HDCP2.x 1000 Byte Key
 * keyin_size: HDCP1.x 308, HDCP2.x 1000
 */
int hdcp_key_process_and_write(enum HDCP_KEY_ID id, uint8_t *keyin, int
keyin_size);

/*
 * Write key to vendor
 *
 * id: HDCP KEY type
 * key: HDCP1.x 308 Byte raw Key, HDCP2.x 1000 Byte Key

 * size: key size
 */
int hdcp_key_write(enum HDCP_KEY_ID id, uint8_t *key, int size);

/*
 * Read key from vendor
 *
 * id: HDCP KEY type
 * key: HDCP1.x 308 Byte raw Key, HDCP2.x 1000 Byte Key
 * len: key length
 */
int hdcp_key_read(enum HDCP_KEY_ID id, uint8_t *key, int *len);
```

## 5. HDMI-IN-CEC

Nehmen Sie unter device/rockchip/common folgende Änderungen vor:

TX: ro.hdmi.device_type=4 (Wiedergabegerät; die Quelle schreibt Playerback).

RX: ro.hdmi.device_type=0 (TV).

```text
diff --git a/device.mk b/device.mk
index d600bf1..a5e9ae3 100644
--- a/device.mk
+++ b/device.mk
@@ -699,10 +699,10 @@ endif
 endif


 # hdmi cec
-ifneq ($(filter atv box, $(strip $(TARGET_BOARD_PLATFORM_PRODUCT))), )
+ifneq ($(filter atv box tablet, $(strip $(TARGET_BOARD_PLATFORM_PRODUCT))), )
 PRODUCT_COPY_FILES += \

frameworks/native/data/etc/android.hardware.hdmi.cec.xml:$(TARGET_COPY_OUT_VENDOR
)/etc/permissions/android.hardware.hdmi.cec.xml
-PRODUCT_PROPERTY_OVERRIDES += ro.hdmi.device_type=4
+PRODUCT_PROPERTY_OVERRIDES += ro.hdmi.device_type=0
 PRODUCT_PACKAGES += \
      hdmi_cec.$(TARGET_BOARD_PLATFORM)


+DEVICE_MANIFEST_FILE +=
device/rockchip/common/manifests/android.hardware.tv.cec@1.0-service.xml
 # HDMI CEC HAL
 PRODUCT_PACKAGES += \
diff --git a/manifests/android.hardware.tv.cec@1.0-service.xml
b/manifests/android.hardware.tv.cec@1.0-service.xml
new file mode 100644
index 00000000..5afa59d7
--- /dev/null
+++ b/manifests/android.hardware.tv.cec@1.0-service.xml
@@ -0,0 +1,11 @@
+<manifest version="1.0" type="device">

+  <hal format="hidl">
+     <name>android.hardware.tv.cec</name>
+     <transport>hwbinder</transport>
+     <version>1.0</version>
+     <interface>
+        <name>IHdmiCec</name>
+        <instance>default</instance>
+     </interface>
+  </hal>
+</manifest>
```

## 6. HDMI-IN-APK anpassen

### 6.1 APK-Quellpfade

packages/apps/TV/partner_support/samples: Stellt den TV-Quelldatendienst bereit und kommuniziert über das Framework mit HAL und Vorschau-APK. Läuft beim Start als verborgener Dienst ohne Launcher-Symbol.

packages/apps/rkCamera2: Vorschau-APK, die über das Framework mit dem TV-Quelldienst kommuniziert. Ihr Launcher-Name lautet HdmiIn. Produktentwickler ersetzen sie häufig durch eine eigene Vorschau-APK.

hardware/rockchip/tv_input: HAL-Code für den Befehlsaustausch mit dem Treiber zu Stream on/off, Hotplug und Auflösungsänderungen.

Im beschriebenen Standard-SDK ist HDMI IN deaktiviert. Setzen Sie folgende Eigenschaft, um die Funktion zu aktivieren und die zugehörigen Module einschließlich der genannten APKs zu bauen:

```text
vim device/rockchip/rk3588/BoardConfig.mk
BOARD_HDMI_IN_SUPPORT := true
```

Die Aktivierung von BOARD_HDMI_IN_SUPPORT konfiguriert standardmäßig vendor.hwc.enable_sideband_stream_2_mode. Die Quelle zeigt den Wert als l (kleines L); prüfen Sie den beabsichtigten Wert anhand der Build-Konfiguration. Kontrollieren Sie nach dem Start mit getprop, dass die Einstellung gesetzt ist.

### 6.2 HdmiIn-Vorschau-APK

MainActivity nutzt TIF-Vorschau, verwendet Teile des Android TV Input Framework wieder und unterstützt HDMI-zu-MIPI sowie HDMI RX. Eine eigene Vorschau-APK muss das Standard-Widget TvView verwenden. Zur HDMI-zu-MIPI-Treiberkonfiguration siehe den in der Quelle genannten Android 12+ HDMIIN Bridge Chip Developer Guide.

```text
String INPUT_ID =
"com.example.partnersupportsampletvinput/.SampleTvInputService/HW0";
Uri channelUri = TvContract.buildChannelUriForPassthroughInput(INPUT_ID);

//tvinput.hdmiin.type取值0为HDMI RX，1为HDMI TO MIPI。需在tune之前设置，不设置默认为HDMI
RX
//SystemProperties.set("tvinput.hdmiin.type", "1");
tvView.tune(INPUT_ID, channelUri);
```

Wichtig: Produkte mit HDMI-zu-MIPI, aber ohne HDMI RX, etwa RK3576 oder RK3588 mit im DTS deaktiviertem HDMI RX, müssen tvinput.hdmiin.type konfigurieren. Andernfalls bleibt TIF schwarz und kann keine HDMI-zu-MIPI-Vorschau anzeigen. Beispiel RK3576:

```text
device/rockchip/rk3576/device.mk
PRODUCT_PROPERTY_OVERRIDES += \

   tvinput.hdmiin.type=1
```

Aktivieren Sie für TIF-Vorschau vtunnel und vendor.hwc.enable_sideband_stream_2_mode. Das folgende DTS aktiviert vtunnel auf dem Standard-RK3588-EVB1; passen Sie das DTS für andere Produkte an.

```text
diff --git a/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
b/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
index a10dad37f9cf..b3dd3a8bbb19 100644

--- a/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
@@ -275,6 +275,10 @@ &dp1_in_vp2 {
      status = "okay";
 };

+&rkvtunnel {
+     status = "okay";
+};
+
 /*
 * mipi_dcphy0 needs to be enabled

 * when dsi0 is enabled
diff --git a/arch/arm64/boot/dts/rockchip/rk3588.dtsi
b/arch/arm64/boot/dts/rockchip/rk3588.dtsi
index fa4a7e35099e..e3acf575aefd 100644

--- a/arch/arm64/boot/dts/rockchip/rk3588.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588.dtsi
@@ -8,6 +8,10 @@
 #include "rk3588-vccio3-pinctrl.dtsi"

 / {
+     rkvtunnel: rkvtunnel {
+           compatible = "rockchip,video-tunnel";
+           status = "disabled";
+     };
      aliases {
           dp0 = &dp0;

           dp1 = &dp1;
diff --git a/arch/arm64/configs/rockchip_defconfig
b/arch/arm64/configs/rockchip_defconfig
index c742a4cc4fe5..039173d51bbe 100644
--- a/arch/arm64/configs/rockchip_defconfig
+++ b/arch/arm64/configs/rockchip_defconfig
@@ -684,6 +684,7 @@ CONFIG_ROCKCHIP_MPP_IEP2=y
 CONFIG_ROCKCHIP_MPP_JPGDEC=y
 CONFIG_ROCKCHIP_MPP_AV1DEC=y
 CONFIG_ROCKCHIP_MPP_VDPP=y
+CONFIG_ROCKCHIP_VIDEO_TUNNEL=y
 CONFIG_SOUND=y
 CONFIG_SND=y

 CONFIG_SND_DYNAMIC_MINORS=y
```

Wichtig: TIF benötigt fünf umlaufende Puffer. Für 3840x2160 BGR888, RGB888 oder NV24 beträgt die theoretische CMA-Größe 3840 * 2160 * 3 * 5 = 121500KB ≈ 119M. Da auch das System CMA nutzen kann und Fragmentierung möglich ist, reservieren Sie mehr, beispielsweise 256M. Zur Vergrößerung siehe Abschnitt 2.3.2.

Im folgenden Beispiel meldet logcat cma: Out of memory; beim Auslesen der zugewiesenen CMA-Puffer sind weniger als fünf vorhanden. Das weist auf unzureichend reservierten CMA-Speicher hin.

```text
rk3588_u:/ # cat /d/dma_buf/bufinfo | grep cma
24883200   00000002   00080007    00000002    cma  00000416

   cma
24883200   00000002   00080007    00000002    cma  00000415
   cma
24883200   00000002   00080007    00000002    cma  00000414
   cma
24883200   00000002   00080007    00000002    cma  00000413
   cma
rk3588_u:/ #

W tv_input_Sideband: dequeueBuffer 259 do allocateBuffer
I android.hardware.graphics.allocator-V1-service: alloc_format: FMT:0x113,MOD:0
I android.hardware.graphics.allocator-V1-service: mali_gralloc_adjust_dimensions:
alloc_format=FMT:0x113,MOD:0 usage=0x11000000a0000833 alloc_width=3840,

alloc_height=2160
D cma  : __cma_alloc(cma 00000000a43238b2, count 6075, align 8)
E cma  : __cma_alloc: cma: alloc failed, req-size: 6075 pages, ret: -12
I cma  : number of available pages:
1@543+1@575+4@588+2@598+2@606+2@638+2@1694+2@1726+2@1758+2@1766+2@1774+2@1782+2@1
790+2@1798+2@1806+2@1814+2@1822+2@1830+2@1838+2@1846+2@1854+2@1862+2@1870+2@1878+

2@1886+2@1894+2@1902+2@1910+2@1918+2@1926+2@1934+2@1942+2@1950+2@1958+2@1966+2@19
74+2@1982+2@1990+2@1998+2@2006+2@2014+2@2022+2@2030+2@2038+2@2046+2@2054+2@2062+2
@2070+2@2078+2@2086+2@2094+2@2102+2@2110+2@2118+2@2126+2@2134+2@2142+2@2150+2@215
8+2@2166+2@2174+2@2182+114@2190+69@8379+69@14523+69@20667+5957@26811=> 6402 free
of 32768 total pages
D cma  : __cma_alloc(): returned 0000000000000000
E DMABUFHEAPS: Unable to allocate from DMA-BUF heap: cma: Out of memory
E DMABUFHEAPS: No ion heap of name cma exists
E DMABUFHEAPS: No ion heap of name cma exists
E android.hardware.graphics.allocator-V1-service: libdmabufheap allocation failed
for cma heap
E android.hardware.graphics.allocator-V1-service: buffer allocation failed: Out

of memory
E android.hardware.graphics.allocator-V1-service: buffer allocation failed: Out
of memory
E GraphicBufferAllocator: Failed to allocate (3840 x 2160) layerCount 1 format 40
usage 11000000a0000833: 1
```

RockchipCamera2 verwendet Camera-Vorschau und unterstützt HDMI-zu-MIPI sowie HDMI RX. Normalerweise startet ein Tippen auf das App-Symbol MainActivity. Für die Camera-Pipeline aktivieren Sie zunächst die HDMI-IN-Kameraunterstützung mit folgender Eigenschaft:

```text
vim device/rockchip/rk3588/BoardConfig.mk
CAMERA_SUPPORT_HDMI := true
```

Setzen Sie außerdem persist.sys.hdmiinmode auf 2. Ein Tippen auf HdmiIn startet dann RockchipCamera2 für Camera-basierte Vorschau. Auch die System-Kamera-App kann verwendet werden.

### 6.3 TIF- und Camera-Vorschau im Vergleich

|  | TIF | Camera |
| --- | --- | --- |
| Vorteile | Geringe Latenz | Die App kann Vorschaudaten zur Nachverarbeitung abrufen |
| Nachteile | Keine Bildschirmdrehung, Bildschirmteilung, Bild-in-Bild oder unabhängigen Anzeigen; App erhält keine Vorschaupuffer; keine screencap-Screenshots | Höhere Latenz als TIF |

(1) TIF unterstützt kein Bild-in-Bild. Wechseln Sie dafür zu Camera. Tippen Sie im MainActivity-TIF-Beispiel auf eine beliebige Stelle und wählen Sie im Dialog PIP, um zu Camera-Bild-in-Bild zu wechseln. CAMERA_SUPPORT_HDMI := true muss den Camera-Vorschaupfad bereits aktiviert haben.

(2) TIF unterstützt Aufzeichnung und Screenshots über virtuelle Displays, die mit Googles standardmäßigem MediaProjectionManager erstellt werden. Auch der Befehl screenrecord wird unterstützt.

Für diese Aufzeichnungs-/Screenshot-Funktionen oder die Spiegelung auf einen PC über ADB konfigurieren Sie folgende Eigenschaft:

```text
vim device/rockchip/rk3588/device.mk
PRODUCT_PROPERTY_OVERRIDES += debug.sf.enable_hwc_vds=true
```

Wurde das Produktverzeichnis unter device überschrieben, setzen Sie die Einstellung im betreffenden Produktverzeichnis. Führen Sie nach dem Start über ADB `getprop debug.sf.enable_hwc_vds` aus und prüfen Sie, dass true zurückgegeben wird. (3) TIF unterstützt keine Screenshots über ADB screencap, einschließlich der Tastenkombination Lautstärke plus Ein/Aus. Verwenden Sie das unter (2) beschriebene virtuelle Display über MediaProjectionManager.

## 7. Treiberfehlersuche

### 7.1 Debugging-Werkzeuge beschaffen

Zur Fehlersuche wird v4l2-ctl benötigt. Das beschriebene SDK fügt es beim Firmware-Build automatisch hinzu; sein SDK-Verzeichnis lautet:

```text
hardware/rockchip/camera/etc/tools/
```

### 7.2 Beispiele für Debugging-Befehle

Aktivieren Sie zur Diagnose die Debug-Protokollierung; siehe entsprechenden Abschnitt.

#### 7.2.1 HDMIRX-Videoknoten auflisten

```text
grep -H hdmirx /sys/class/video4linux/video*/name
```

#### 7.2.2 rk_hdmirx-Gerät finden

Wählen Sie mit v4l2-ctl -d einen Videoknoten und zeigen Sie mit -D dessen Informationen an. Identifizieren Sie rk_hdmirx anhand von Driver name.

```text
rk3588_s:/ # v4l2-ctl -d /dev/video17 -D
Driver Info:

      Driver name : rk_hdmirx
      Card type   : rk_hdmirx
      Bus info    : fdee0000.hdmirx-controller
      Driver version : 5.10.66
      Capabilities : 0x84201000
           Video Capture Multiplanar
           Streaming
           Extended Pix Format
           Device Capabilities
      Device Caps : 0x04201000
           Video Capture Multiplanar
           Streaming
Extended Pix Format
```

#### 7.2.3 Gespeicherte Treiber-Timings abrufen

Rufen Sie die beim Einrasten auf das Signal gespeicherten Timings ab:

```text
rk3588_s:/ # v4l2-ctl -d /dev/video17 --get-dv-timings
DV timings:

      Active width: 3840
      Active height: 2160
      Total width: 4400
      Total height: 2250
      Frame format: progressive
      Polarities: -vsync -hsync
      Pixelclock: 594024000 Hz (60.00 frames per second)
      Horizontal frontporch: 172
      Horizontal sync: 92
      Horizontal backporch: 296
      Vertical frontporch: 8
      Vertical sync: 10
      Vertical backporch: 72

      Standards:
      Flags:
```

#### 7.2.4 Timings in Echtzeit abfragen

Lesen Sie die Timings direkt aus den HDMI-RX-Registern:

```text
rk3588_s:/ # v4l2-ctl -d /dev/video17 --query-dv-timings
      Active width: 3840
      Active height: 2160

      Total width: 4400
      Total height: 2250
      Frame format: progressive
      Polarities: -vsync -hsync
      Pixelclock: 594024000 Hz (60.00 frames per second)
      Horizontal frontporch: 172
      Horizontal sync: 92
      Horizontal backporch: 296
      Vertical frontporch: 8
      Vertical sync: 10
      Vertical backporch: 72
      Standards:

      Flags:
```

Wird query-dv-timings mit Debug-Level 2 ausgeführt, zeigt dmesg detaillierte Timings, Pixelformat, Farbtiefe und TMDS-Taktinformationen wie im folgenden Beispiel:

```text
[16750.029542][ T2247] fdee0000.hdmirx-controller: hdmirx_get_pix_fmt: pix_fmt:
YUV422
[16750.029581][ T2247] fdee0000.hdmirx-controller: hdmirx_get_colordepth:

color_depth: 24, reg_val:4
[16750.029592][ T2247] fdee0000.hdmirx-controller: get timings from dma
[16750.029602][ T2247] fdee0000.hdmirx-controller: act:3840x2160,
total:4400x2250, fps:60, pixclk:594024000
[16750.029610][ T2247] fdee0000.hdmirx-controller: hfp:172, hs:92, hbp:296,
vfp:8, vs:10, vbp:72
[16750.029618][ T2247] fdee0000.hdmirx-controller: tmds_clk:594024000
[16750.029626][ T2247] fdee0000.hdmirx-controller: interlace:0, fmt:1, vic:127,
color:24, mode:hdmi
[16750.029633][ T2247] fdee0000.hdmirx-controller: deframer_st:0x11
[16750.029643][ T2247] fdee0000.hdmirx-controller: query_dv_timings:
3840x2160p60.00 (4400x2250)
```

#### 7.2.5 Auflösung und Bildformat abfragen

Fragen Sie die aktuelle Auflösung und das Bildformat ab:

```text
rk3588_s:/ # v4l2-ctl -d /dev/video17 --get-fmt-video
Format Video Capture Multiplanar:

      Width/Height : 3840/2160
      Pixel Format : 'NV16'
      Field        : None
      Number of planes : 1
      Flags        : premultiplied-alpha, 000000fe
      Colorspace   : Unknown (1025fcdc)
      Transfer Function : Unknown (00000020)
      YCbCr Encoding : Unknown (000000ff)
      Quantization : Default
      Plane 0      :
        Bytes per Line : 3840
        Size Image : 16588800
```

#### 7.2.6 Bildstream starten

Starten Sie den Stream mit passendem Videoknoten, Auflösung und pixelformat für den tatsächlichen Aufbau:

```text
v4l2-ctl --verbose -d /dev/video17 \
--set-fmt-video=width=3840,height=2160,pixelformat='NV16' \
--stream-mmap=4
```

Formatzuordnung: RGB888 -&gt; 'RGB3', YUV422 -&gt; 'NV16', YUV420 -&gt; 'NV12', YUV444 -&gt; 'NV24'.

#### 7.2.7 Bilddatei erfassen

Speichern Sie eine Bilddatei auf dem Gerät, übertragen Sie sie mit adb pull auf einen PC und untersuchen Sie sie beispielsweise mit 7yuv oder YUView:

```text
v4l2-ctl --verbose -d /dev/video17 \
--set-fmt-video=width=3840,height=2160,pixelformat='NV16' \
--stream-mmap=4 --stream-skip=3 \

--stream-to=/data/4k60_nv16.yuv \
--stream-count=5 --stream-poll
```

#### 7.2.8 Normales Streaming-Protokoll

Bei normalem Empfang meldet das Protokoll die Bildrate. Quellbeispiel:

```text
VIDIOC_QUERYCAP: ok
VIDIOC_G_FMT: ok
VIDIOC_S_FMT: ok

Format Video Capture Multiplanar:
      Width/Height : 3840/2160
      Pixel Format : 'NV16'
      Field        : None
      Number of planes : 1
      Flags        : premultiplied-alpha, 000000fe
      Colorspace   : Unknown (1025fcdc)
      Transfer Function : Unknown (00000020)
      YCbCr Encoding : Unknown (000000ff)
      Quantization : Default
      Plane 0      :
        Bytes per Line : 3840
        Size Image : 16588800

VIDIOC_REQBUFS: ok
VIDIOC_QUERYBUF: ok
VIDIOC_QUERYBUF: ok
VIDIOC_QBUF: ok
VIDIOC_QUERYBUF: ok
VIDIOC_QBUF: ok
VIDIOC_QUERYBUF: ok
VIDIOC_QBUF: ok
VIDIOC_QUERYBUF: ok
VIDIOC_QBUF: ok
VIDIOC_STREAMON: ok
idx: 0 seq: 0 bytesused: 16588800 ts: 103.172405

idx: 1 seq: 1 bytesused: 16588800 ts: 103.189072 delta: 16.667 ms
idx: 2 seq: 2 bytesused: 16588800 ts: 103.205738 delta: 16.666 ms
idx: 3 seq: 3 bytesused: 16588800 ts: 103.222404 delta: 16.666 ms
idx: 0 seq: 4 bytesused: 16588800 ts: 103.239070 delta: 16.666 ms fps: 60.00
idx: 1 seq: 5 bytesused: 16588800 ts: 103.255736 delta: 16.666 ms fps: 60.00
idx: 2 seq: 6 bytesused: 16588800 ts: 103.272402 delta: 16.666 ms fps: 60.00
```

## 8. Fehlerbehebung

### 8.1 Protokollierung aktivieren

Setzen Sie den Debug-Level des HDMI-RX-Treibers mit folgendem Befehl auf einen Wert von 0 bis 3:

```text
echo 2 > /sys/module/rockchip_hdmirx/parameters/debug
dmesg -n 8
```

Für Protokolle ab dem Einschalten und Systemstart empfiehlt die Quelle eine Codeänderung und den Neubau beziehungsweise das Flashen der betreffenden Kernel-Komponenten. Referenzpatch:

```text
diff --git a/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
b/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
index c763a9558169..bd7f3effb45a 100644

--- a/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
+++ b/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
@@ -34,7 +34,7 @@
 #include "rk_hdmirx_cec.h"

static struct class *hdmirx_class;
-static int debug;
+static int debug = 2;
 module_param(debug, int, 0644);
 MODULE_PARM_DESC(debug, "debug level (0-3)");

diff --git a/include/media/v4l2-common.h b/include/media/v4l2-common.h
index 1cc0c5ba16b3..e74f3a85f0b8 100644

--- a/include/media/v4l2-common.h
+++ b/include/media/v4l2-common.h
@@ -75,7 +75,7 @@
 #define v4l2_dbg(level, debug, dev, fmt, arg...)   \
      do {                                          \
           if (debug >= (level))                    \
-                v4l2_printk(KERN_DEBUG, dev, fmt , ## arg); \
+                v4l2_printk(KERN_INFO, dev, fmt , ## arg); \
      } while (0)
```

Hinweis: Von Debug-Level 3 wird normalerweise wegen der großen Ausgabemenge abgeraten.

### 8.2 Register mit io lesen und schreiben

Das Werkzeug io kann auf HDMI-RX-Register zugreifen. Aktivieren Sie folgende Kernel-Konfiguration:

```text
CONFIG_DEVMEM=y
```

Beispiel einer Registerabfrage mit io:

```text
// 通过以下命令可查看io使用帮忙：
io -h


rk3588_s:/ # io -4 -l 0xc 0xfdee0594
fdee0594: 0000000f 80008000 00008000
```

### 8.3 HDMI-RX-Status abfragen

Fragen Sie den aktuellen HDMI-RX-Status einschließlich Signaleinrastung, Bildformat, Timings und Pixeltakt ab:

```text
rk3588_s:/ # cat /d/hdmirx/status
status: plugin

Clk-Ch:Lock Ch0:Lock   Ch1:Lock    Ch2:Lock
Ch0-Err:0  Ch1-Err:0   Ch2-Err:0
Color Format: YUV422         Store Format: YUV422 (8 bit)
Mode: 3840x2160p60 (4400x2250) hfp:172 hs:92 hbp:296 vfp:8 vs:10
vbp:72
Pixel Clk: 594024000
```

HDMI-RX-Controllerregister abfragen:

```text
rk3588_s:/ # cat /d/hdmirx/ctrl

--------------------hdmirx ctrl--------------------

00000000: 48515258 30313130 6c753031 01000310
00000010: Reserved 31353138 30333039 32303231
00000020: WO...... 00211f01 198b7b25
00000040: WO...... 00001001 00000000
00000050: 00000001
...
---------------------------------------------------
```

HDMI-RX-PHY-Register abfragen:

```text
rk3588_s:/ # cat /d/hdmirx/phy

--------------------hdmirx phy---------------------

0000004f: 01000000
0000100f: 01000000
0000110f: 01000000
0000120f: 01000000
0000130f: 01000000
0000104a: 01002600
...
---------------------------------------------------
```

Informationen zur Anzeigeebene abfragen:

```text
rk3588_s:/ # cat /d/dri/0/summary
Video Port0: DISABLED
Video Port1: DISABLED
Video Port2: DISABLED
Video Port3: ACTIVE
   Connector: DSI-1

      bus_format[100a]: RGB888_1X24
      overlay_mode[0] output_mode[0] color_space[0], eotf:0
   Display mode: 1080x1920p60
      clk[132000] real_clk[132000] type[48] flag[a]
      H: 1080 1095 1099 1129
      V: 1920 1935 1937 1952
   Esmart3-win0: ACTIVE //HDMI-IN预览图层
      win_id: 11
      format: RG24 little-endian (0x34324752) SDR[0] color_space[0]
glb_alpha[0xff]
      rotate: xmirror: 0 ymirror: 0 rotate_90: 0 rotate_270: 0
      csc: y2r[0] r2y[0] csc mode[0]

      zpos: 0
      src: pos[0, 0] rect[1920 x 1080]
      dst: pos[0, 0] rect[1080 x 1920]
      buf[0]: addr: 0x00000000f070a000 pitch: 5760 offset: 0
   Cluster3-win0: ACTIVE
      win_id: 6
      format: AB24 little-endian (0x34324241)[AFBC] SDR[0] color_space[0]
glb_alpha[0xff]
      rotate: xmirror: 0 ymirror: 0 rotate_90: 0 rotate_270: 0
      csc: y2r[0] r2y[0] csc mode[0]
      zpos: 1
      src: pos[0, 0] rect[1080 x 1920]
      dst: pos[0, 0] rect[1080 x 1920]

      buf[0]: addr: 0x00000000ef903000 pitch: 4352 offset: 0
```

### 8.4 HDMI-IN-Signal rastet nicht ein

Beispielprotokoll bei fehlgeschlagener HDMI-IN-Signaleinrastung:

```text
[ 285.949990][ T191] fdee0000.hdmirx-controller:
hdmirx_wait_lock_and_get_timing signal not lock, tmds_clk_ratio:0
```

Diagnoseschritte:

Messen Sie HDMIIRX_DET_L und prüfen Sie, ob der Pegel dem Schaltungsentwurf entspricht und sich beim Einstecken oder Abziehen von HDMI ändert.

Prüfen Sie am HDMI-Anschluss, ob HDMI_RX_HPD_PORT beim Einstecken High und beim Abziehen Low wird.

Prüfen Sie bei verbundenem HDMI mit einem Oszilloskop, ob die TMDS-Ausgabe normal ist.

Prüfen Sie im Protokoll, ob die SCDC-Kommunikation erfolgreich ist. Laut Quelle muss tmds_clk_ratio bei einem Pixeltakt über 340M den Wert 1 haben. Gibt die Quelle 4K60 mit Pixeltakt 594M aus, während das Protokoll tmds_clk_ratio:0 zeigt, ist SCDC fehlgeschlagen. Prüfen Sie die HDMI-DDC-Kommunikation oder ziehen Sie den Stecker ab und stecken ihn erneut ein.

Registerstatus abfragen:

```text
console:/ # io -4 0xfdee0050
fdee0150: 00000001 // bit0：1表示HPD拉高，0表示HPD拉低


// 0x0594：bit[3:0]表示scdc_ch2locked、scdc_ch1locked、scdc_ch0locked、
scdc_clockdetected；
// 0x0598：bit[31]:scdc_err_det1_valid，bit[15]:scdc_err_det0_valid，低bit为误码数量
统计；
// 0x059c：bit[31]:scdc_erdet_lane0_valid，bit[15]:scdc_err_det2_valid，低bit为误码
数量统计；
console:/ # io -4 -l 0xc 0xfdee0594
fdee0594: 0000000f 80008000 00008000 // 正常锁定时的值
```

Rastet das Signal nach Hotplug nur gelegentlich ein, verlängern Sie versuchsweise das Zeitlimit für die Signaleinrastung, um zu prüfen, ob sie abgeschlossen werden kann.

```text
diff --git a/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
b/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
index 39e4e15a6e17..a612fe30bda4 100644

--- a/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
+++ b/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
@@ -1264,7 +1264,7 @@ static int hdmirx_wait_lock_and_get_timing(struct
rk_hdmirx_dev *hdmirx_dev)
      u32 mu_status, scdc_status, dma_st10, cmu_st;
      struct v4l2_device *v4l2_dev = &hdmirx_dev->v4l2_dev;

-     for (i = 0; i < 300; i++) {
+     for (i = 0; i < 600; i++) {
           mu_status = hdmirx_readl(hdmirx_dev, MAINUNIT_STATUS);
           scdc_status = hdmirx_readl(hdmirx_dev, SCDC_REGBANK_STATUS3);
           dma_st10 = hdmirx_readl(hdmirx_dev, DMA_STATUS10);
@@ -1283,7 +1283,7 @@ static int hdmirx_wait_lock_and_get_timing(struct

rk_hdmirx_dev *hdmirx_dev)
           hdmirx_tmds_clk_ratio_config(hdmirx_dev);
      }

-     if (i == 300) {
+     if (i == 600) {
           v4l2_err(v4l2_dev, "%s signal not lock, tmds_clk_ratio:%d\n",
                       __func__, hdmirx_dev->tmds_clk_ratio);
           v4l2_err(v4l2_dev, "%s mu_st:%#x, scdc_st:%#x, dma_st10:%#x\n",
```

Scheitert das Einrasten häufig nach Auflösungsänderungen, fügen Sie versuchsweise vor dem Anheben von HPD eine Verzögerung hinzu und prüfen deren Wirkung.

```text
diff --git a/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
b/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
index 8183485a6e4c..27b900e90501 100644

--- a/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
+++ b/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
@@ -2768,6 +2768,7 @@ static void hdmirx_delayed_work_res_change(struct
work_struct *work)
           hdmirx_submodule_init(hdmirx_dev);
           hdmirx_update_bits(hdmirx_dev, SCDC_CONFIG, POWERPROVIDED,
                             POWERPROVIDED);
+          msleep(300);
           hdmirx_hpd_ctrl(hdmirx_dev, true);
           hdmirx_phy_config(hdmirx_dev);
           hdmirx_audio_setup(hdmirx_dev);
```

Manche Signalgeneratoren oder Quellen liefern schlechte Signalqualität. HDMI RX erkennt dann hohe Fehlerzahlen auf einzelnen Kanälen und kann nicht einrasten. Prüfen Sie die Register 0xfdee0594–0xfdee059c auf Fehler:

```text
rk3588_s:/ # io -4 -l 0xc 0xfdee0594
fdee0594: 0000000f 80008000 00008000 //正常数值


rk3588_s:/ # io -4 -l 0xc 0xfdee0594
fdee0594: 0000000f 804c8001 00008aff //检测到误码，分别对应ch1、ch0、ch2统计的误
码总数
```

Verhindern Fehler auf einem Kanal das Einrasten, nennt die Quelle folgendes Verfahren zum Deaktivieren der internen Treiberfehlerprüfung zur besseren Kompatibilität. Dies ist ein diagnostischer Workaround, kein Nachweis für die Einhaltung der Signalspezifikation.

```text
diff --git a/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
b/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c

index 606a08cd00505..6236196991c2a 100755
--- a/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
+++ b/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
@@ -1416,11 +1416,7 @@ static void hdmirx_controller_init(struct rk_hdmirx_dev
*hdmirx_dev)
                   CED_GBCHECKEN_QST |
                   CED_CTRLCHECKEN_QST |
                   CED_CHLOCKMAXER_QST_MASK,
-                  CED_VIDDATACHECKEN_QST|
-                  // CED_DATAISCHECKEN_QST |
-                  CED_GBCHECKEN_QST |
-                  CED_CTRLCHECKEN_QST |

-                  CED_CHLOCKMAXER_QST(0x10));
+                  0);
 }

 static void hdmirx_format_change(struct rk_hdmirx_dev *hdmirx_dev)
```

### 8.5 Kein Bild oder schwarzer Bildschirm

HDMI-IN-Probleme ohne Bild fallen in zwei Kategorien: Treiberfehler und Fehler höherer Schichten beziehungsweise Anwendungen. Nachfolgend ein grundlegender Diagnoseablauf.

Treiberprüfungen:

(1) Kernel-Protokoll auf Signaleinrastung und richtige Auflösung prüfen. Bei Verwendung eines Switches prüfen, ob auch dieser einrastet und normal ausgibt. Siehe Hotplug-Protokollbeispiel.

(2) Prüfen, ob alle Kanäle eingerastet sind und die Auflösung der Quelle entspricht: `cat /d/hdmirx/status`.

(3) Stream-on anhand von Protokollen oder Registern prüfen. Die Quelle bezeichnet bit1 des mit `io -4 0xfdee4414` gelesenen Werts als Hinweis auf normales Stream-on; prüfen Sie die genaue Bitbedingung im Treiber.

(4) Protokollstufe 3 setzen und auf Frame-Daten prüfen; pro halbem Frame wird ein Eintrag ausgegeben.

Prüfungen höherer Schichten:

(1) date ausführen, um den ungefähren Fehlerzeitpunkt festzuhalten.

(2) Anzeigeebenen mit `cat /d/dri/0/summary` untersuchen.

(3) `dumpsys SurfaceFlinger` ausführen.

(4) logcat-Ausgabe sichern.

(5) Nach Bestätigung des Streamings und der Anzeigeebene aus Schritt (2) mit folgendem Befehl ein Bild erfassen:

```text
android12：
rm -rf data/system/dumpimage

mkdir data/system/dumpimage
chmod 777 data/system/dumpimage
setprop vendor.hdmiin.debug.dump 1
setprop vendor.hdmiin.debug.dumpnum 5
1s后立⻢
setprop vendor.hdmiin.debug.dumpnum 0
2s后立⻢
setprop vendor.hdmiin.debug.dump 0

android13：
rm -rf data/system/dumpimage
mkdir data/system/dumpimage
chmod 777 data/system/dumpimage

setprop vendor.tvinput.debug.dump 1
setprop vendor.tvinput.debug.dumpnum 10
半s后立⻢
setprop vendor.tvinput.debug.dumpnum 0
等个2s后
setprop vendor.tvinput.debug.dump 0
```

Suchen Sie nach Dateien unter data/system/dumpimage, archivieren Sie dieses Verzeichnis und stellen Sie das Archiv zur Diagnose bereit. Erscheinen keine Dateien, kann SELinux verantwortlich sein. Die Quelle schlägt setenforce 0 und eine Wiederholung des Befehls vor; solche Tests im permissiven Modus gehören ausschließlich in eine kontrollierte Debugging-Umgebung, nicht in eine produktive Sicherheitskonfiguration.

(6) Fehlerzustand bewahren, andere Aktionen vermeiden und die genannten Informationen bereitstellen. Ist Support nicht zeitnah erreichbar und kann das Gerät nicht im Fehlerzustand verbleiben, erfasst der folgende Notfallbefehl 10 Sekunden an Informationen. Führen Sie ihn erst aus, nachdem die bisherigen Informationen, insbesondere logcat, gesichert wurden: Er führt logcat -c aus und löscht frühere Protokolle. Die Quelle rät, diesen Schritt nur bei Bedarf und nach vorherigem Kontakt zum Support zu verwenden.

```text
setprop vendor.tvinput.debug.level 3
logcat -c
logcat

抓10s
setprop vendor.tvinput.debug.level 0
```

Sonderfall: Streaming und erfasste Bilder sind normal, die Anzeige bleibt jedoch schwarz. AVMUTE kann aktiv sein. Diagnose mit folgenden Befehlen:

(1) AVMUTE-Statusbit prüfen:

```text
io -4 0xfdee4458 //bit25 avmute statue
io -4 0xfdee1030 //bit 0 GCP Set_AVMUTE bit4 GCP Clear_AVMUTE
```

(2) AVMUTE-Farbe zur Überprüfung ändern; standardmäßig ist sie schwarz:

```text
io -4 0xfdee0430 0xff00 //设置RGB格式avmute为红色,yuv格式为其他颜色，若变色说明是
avmute导致。
```

Manche Webseiten oder Werbeanzeigen verwenden HDCP-Verschlüsselung. Ist HDCP auf der Senke nicht aktiviert, kann dies AVMUTE auslösen.

### 8.6 Instabiles Signal und Verlust der Einrastung

Bei manchen Quellen wird die Vorschau zeitweise schwarz, oder Protokolle zeigen wiederholte Einrast-/Auflösungsversuche mit anschließendem Streaming-Fehler. Die Quelle berichtet dies für Signalgeneratoren, TV-Boxen und DVD-Player. Mögliche Ursachen folgen; siehe Protokollbeispiel zum Verlust der Einrastung.

Die Quelle verschlüsselt mit HDCP, während die Senke HDCP nicht aktiviert hat; dadurch ist keine Einrastung möglich.

Häufige HDCP-verschlüsselte Quellen sind Apple-Computer, DVD-Player und TV-Boxen.

Schlechte oder zu lange Kabel sowie lockere Steckverbindungen können dazu führen, dass das HDMI-Signal am SoC nicht spezifikationskonform ist.

Tauschen Sie das Kabel aus und prüfen Sie die Stabilität, um festzustellen, ob nur bestimmte Kabel betroffen sind.

Zu hohe Treiberstärke oder Spannungshub eines vorgeschalteten Switches können Reflexionen auf Leiterbahnen verursachen.

Passen Sie Treiberstärke, Spannungshub und Terminierung in Abstimmung mit dem Switch-Hersteller an.

Zu empfindliche Interrupt-Einstellungen können bei erkannten Signaländerungen Trennung und erneute Verbindung auslösen.

Schließen Sie die Vorschau, ermitteln Sie den ausgelösten Interrupt und prüfen Sie, ob dessen Deaktivierung das Verhalten ändert. Die Quelle empfiehlt abgestimmte Fehlersuche über Redmine.

Die Quellausgabe kann zunächst für eine gewisse Zeit instabil sein.

Fügen Sie eine Verzögerung hinzu und melden Sie die Auflösung erst nach Stabilisierung des Signals.

```text
diff --git a/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
b/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
index a69f8f6bd577..ede8d91f06dc 100644

--- a/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
+++ b/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
@@ -1674,7 +1675,7 @@ static int hdmirx_wait_lock_and_get_timing(struct
rk_hdmirx_dev *hdmirx_dev)
      }

      hdmirx_reset_dma(hdmirx_dev);
-     usleep_range(200*1000, 200*1010);
+     usleep_range(500*1000, 500*1010);
      hdmirx_format_change(hdmirx_dev);

      return 0;
```

### 8.7 Auflösungsänderung der Quelle scheitert

Die Quelle berichtet dies für Apple-Computer, NVIDIA-Grafikkarten und manche Laptops mit chinesischen Betriebssystemen. Bei einer Auflösungsänderung senkt der Treiber HPD normalerweise ab und hebt es zum Neuverbinden wieder an. Das Quellgerät kann dies als Entfernen der Senke interpretieren und die Änderung abbrechen. Konfigurieren Sie HPD als GPIO, sodass es während der gesamten Auflösungsänderung High bleibt.

Fordern Sie den entsprechenden Patch über Redmine an: rk3588_hdmirx_config_hpd_as_gpio_config_scdc_pwr_asap_230513.patch.

### 8.8 Fehlerhafte TMDSCLK-Messung

Häufig gemeldet bei 4K@60-RGB-Eingang: Die Quelle liefert TMDSCLK mit 594M, der Treiber misst jedoch 148.5M, wodurch Bild- und Audioabtastraten falsch werden. Siehe TMDSCLK-Fehlerprotokoll.

Fordern Sie den Patch über Redmine an: rk3588_a12_hdmirx_patch_fps_err_0714.patch.

### 8.9 Kurze Schwarzbilder in besonderen Quellszenarien

Das Öffnen bestimmter Webseiten wie Youku oder des in der Quelle als blibli geschriebenen Angebots sowie Größenänderungen von Fenstern können das Signal ändern oder Fehler erhöhen und indirekt Interrupts beziehungsweise Einrastverlust verursachen.

(1) Ein Interrupt löst die Neuverbindung aus: Vorschau schließen, den Interrupt im Protokoll identifizieren und prüfen, ob dessen Deaktivierung hilft. Die Quelle empfiehlt eine Redmine-Meldung.

(2) Erhöhte Fehlerzahlen verursachen Einrastverlust: Fehlerprüfung gemäß dem Abschnitt zur fehlgeschlagenen Signaleinrastung deaktivieren.

## 9. Typische Protokolle

Setzen Sie normalerweise Debug-Level 2 für die relevante dmesg-Ausgabe oder ändern Sie den Code wie im Protokollierungsabschnitt beschrieben.

### 9.1 Hotplug-Protokoll

```text
// 检测到拔出动作
[29830.165185][ T2655] fdee0000.hdmirx-controller: hdmirx_delayed_work_hotplug:
plugin:0

// 关闭中断
[29830.165203][ T2655] fdee0000.hdmirx-controller: hdmirx_interrupts_setup:
disable
// 拉低HPD
[29830.165211][ T2655] fdee0000.hdmirx-controller: hdmirx_hpd_ctrl: disable,
hpd_trigger_level:1
[29830.177109][ T598] fdee0000.hdmirx-controller: hdmirx_query_dv_timings port
has no link!
...
// 检测到插入动作
[29843.128833][ T2655] fdee0000.hdmirx-controller: hdmirx_delayed_work_hotplug:
plugin:1

// 拉高hpd
[29843.139653][ T2655] fdee0000.hdmirx-controller: hdmirx_hpd_ctrl: enable,
hpd_trigger_level:1
...
[29843.247796][ T2655] fdee0000.hdmirx-controller: wait_reg_bit_status: i:0,
time: 10ms
[29843.286353][ T2655] fdee0000.hdmirx-controller: wait_reg_bit_status: i:38,
time: 50ms
[29843.286373][ T2655] rk_hdmirx fdee0000.hdmirx-controller:
hdmirx_audio_interrupts_setup: 1
// HDMI信号锁定
[29843.703996][ T2655] fdee0000.hdmirx-controller:
hdmirx_wait_lock_and_get_timing signal lock ok, i:54!

...
// 图像格式
[30098.978794][ T2655] fdee0000.hdmirx-controller: hdmirx_get_pix_fmt: pix_fmt:
YUV422
[30098.978803][ T2655] fdee0000.hdmirx-controller: hdmirx_get_colordepth:
color_depth: 24, reg_val:4
// 详细分辨率timing
[30098.978813][ T2655] fdee0000.hdmirx-controller: get timings from ctrl
[30098.978819][ T2655] fdee0000.hdmirx-controller: act:1920x1080,
total:2200x1125, fps:60, pixclk:148500000
[30098.978825][ T2655] fdee0000.hdmirx-controller: hfp:84, hs:48, hbp:148, vfp:4,
vs:5, vbp:36

// TMDS CLK
[30098.978829][ T2655] fdee0000.hdmirx-controller: tmds_clk:148500000
[30098.978835][ T2655] fdee0000.hdmirx-controller: interlace:0, fmt:1, vic:127,
color:24, mode:hdmi
[30098.978840][ T2655] fdee0000.hdmirx-controller: deframer_st:0x11
...
// 上报分辨率变化事件
[30099.023034][ T2655] fdee0000.hdmirx-controller: hdmirx_format_change: New
format: 1920x1080p60.00 (2200x1125)
[30099.023039][ T2655] fdee0000.hdmirx-controller: hdmirx_format_change: queue
res_chg_event
```

### 9.2 Protokoll einer Auflösungsänderung

```text
// 信号变化，检测到数据误码中断
[ 312.662740][ C4] fdee0000.hdmirx-controller: avpunit_0_int_handler:
avp0_st:0x700000

[ 312.662750][ C4] fdee0000.hdmirx-controller: mu2_st:0x2
// TMDS信号变化中断
[ 312.662756][ C4] fdee0000.hdmirx-controller: mainunit_2_int_handler:
TMDSVALID_STABLE_CHG
[ 312.662760][ C4] fdee0000.hdmirx-controller: hdmirx_hdmi_irq_handler:
en_fiq
[ 312.688916][ T196] fdee0000.hdmirx-controller: hdmirx_delayed_work_audio: no
supported fs(0), cur_state 0
[ 312.688928][ T196] rk_hdmirx fdee0000.hdmirx-controller: audio off
// 进入切换分辨率流程，当前HDMI状态为插入
[ 312.723309][ T196] fdee0000.hdmirx-controller:
hdmirx_delayed_work_res_change: plugin:1

[ 312.723316][ T196] fdee0000.hdmirx-controller: hdmirx_interrupts_setup:
disable
[ 312.724986][ C4] fdee0000.hdmirx-controller: mu0_st:0x4000000
[ 312.724991][ C4] fdee0000.hdmirx-controller: hdmirx_hdmi_irq_handler:
en_fiq
// 相关配置完成后拉高HPD
[ 312.725000][ T196] fdee0000.hdmirx-controller: hdmirx_hpd_ctrl: enable,
hpd_trigger_level:1
...
// 信号锁定
fdee0000.hdmirx-controller: hdmirx_wait_lock_and_get_timing signal lock ok, i:2!
...
// 获取新的分辨率，图像格式等

[ 312.849040][ T196] fdee0000.hdmirx-controller: hdmirx_get_pix_fmt: pix_fmt:
YUV420
[ 312.849049][ T196] fdee0000.hdmirx-controller: hdmirx_get_colordepth:
color_depth: 24, reg_val:4
[ 312.849056][ T196] fdee0000.hdmirx-controller: get timings from ctrl
[ 312.849060][ T196] fdee0000.hdmirx-controller: act:3840x2160,
total:4400x2250, fps:60, pixclk:296996000
[ 312.849064][ T196] fdee0000.hdmirx-controller: hfp:84, hs:48, hbp:148, vfp:8,
vs:10, vbp:72
[ 312.849067][ T196] fdee0000.hdmirx-controller: tmds_clk:296996000
[ 312.849070][ T196] fdee0000.hdmirx-controller: interlace:0, fmt:3, vic:127,
color:24, mode:hdmi
```

### 9.3 Fehlerprotokoll bei nicht eingerastetem Signal

```text
// 信号未锁定
[ 285.949990][ T191] fdee0000.hdmirx-controller:
hdmirx_wait_lock_and_get_timing signal not lock, tmds_clk_ratio:0

[ 285.950011][ T191] fdee0000.hdmirx-controller:
hdmirx_wait_lock_and_get_timing mu_st:0x0, scdc_st:0x0, dma_st10:0x10
...
// 读取到错误的分辨率
[ 257.222739][ T193] fdee0000.hdmirx-controller: get timings from dma
[ 257.222744][ T193] fdee0000.hdmirx-controller: act:39024x0, total:17732x1,
fps:8375, pixclk:148500000
[ 257.222749][ T193] fdee0000.hdmirx-controller: hfp:4294904560, hs:184,
hbp:41260, vfp:1, vs:0, vbp:0
[ 257.222753][ T193] fdee0000.hdmirx-controller: tmds_clk:148500000
[ 257.222758][ T193] fdee0000.hdmirx-controller: interlace:0, fmt:0, vic:127,
color:24, mode:dvi

// 连续读取到错误分辨率
[ 257.254994][ T193] fdee0000.hdmirx-controller: hdmirx_try_to_get_timings: res
not stable!
```

### 9.4 Treiberprotokoll für Stream-on/off

```text
// 开流使能dma，获取到30帧数据打印
[ 2360.096789][ T473] fdee0000.hdmirx-controller: hdmirx_start_streaming:
start_stream cur_buf y_addr:0x10700000, uv_addr:0x10700000

[ 2360.096813][ T473] fdee0000.hdmirx-controller: hdmirx_start_streaming: enable
dma
[ 2360.689582][ T205] fdee0000.hdmirx-controller: rcv frames
...
// 关流
[ 2475.818301][ T473] fdee0000.hdmirx-controller: stream start stopping
[ 2475.818575][ T205] fdee0000.hdmirx-controller: hdmirx_dma_irq_handler: stop
stream!
[ 2475.818613][ T473] fdee0000.hdmirx-controller: stream stopping finished
```

### 9.5 HDMI-IN-Streamausgabe

```text
// 查看数据流打印需要将log等级开到3，每隔半帧打印一句log，打印如下：
[ 2778.207227][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x80, st13:1080

[ 2778.215891][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x100, st13:540
[ 2778.223889][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x80, st13:1080
[ 2778.232559][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x100, st13:540
[ 2778.240557][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x80, st13:1080
[ 2778.249222][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x100, st13:540
[ 2778.257226][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x80, st13:1080
[ 2778.265887][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x100, st13:540
[ 2778.273887][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x80, st13:1080
[ 2778.282557][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x100, st13:540
```

### 9.6 Fehlerprotokoll bei nicht eingerastetem Signal

```text
// 信号未锁定
[ 285.949990][ T191] fdee0000.hdmirx-controller:
hdmirx_wait_lock_and_get_timing signal not lock, tmds_clk_ratio:0

[ 285.950011][ T191] fdee0000.hdmirx-controller:
hdmirx_wait_lock_and_get_timing mu_st:0x0, scdc_st:0x0, dma_st10:0x10
...
// 读取到错误的分辨率
[ 257.222739][ T193] fdee0000.hdmirx-controller: get timings from dma
[ 257.222744][ T193] fdee0000.hdmirx-controller: act:39024x0, total:17732x1,
fps:8375, pixclk:148500000
[ 257.222749][ T193] fdee0000.hdmirx-controller: hfp:4294904560, hs:184,
hbp:41260, vfp:1, vs:0, vbp:0
[ 257.222753][ T193] fdee0000.hdmirx-controller: tmds_clk:148500000
[ 257.222758][ T193] fdee0000.hdmirx-controller: interlace:0, fmt:0, vic:127,
color:24, mode:dvi

// 连续读取到错误分辨率
[ 257.254994][ T193] fdee0000.hdmirx-controller: hdmirx_try_to_get_timings: res
not stable!
```

### 9.7 Einrastverlust nach erfolgreichem Einrasten

```text
// 驱动开流
[140.628993][ T1525] fdee0000.hdmirx-controller: hdmirx_start_streaming:
start_stream cur_buf y_addr:0x10b00000, uv_addr:0x10b00000

[140.629009][ T1525] fdee0000.hdmirx-controller: hdmirx_start_streaming: enable
dma
[140.632067][ T198] fdee0000.hdmirx-controller: line_flag_int_handler: last have
no dma_idle_irq
[141.223426][ T198] fdee0000.hdmirx-controller: rcv frames
// 预览3s后检测到信号变化
[144.955132][ C4] fdee0000.hdmirx-controller: mu0_st:0xc0000000
[144.955142][ C4] fdee0000.hdmirx-controller: mu2_st:0x2
[144.955173][ C4] fdee0000.hdmirx-controller: mainunit_2_int_handler:
TMDSVALID_STABLE_CHG
[144.955179][ C4] fdee0000.hdmirx-controller: hdmirx_hdmi_irq_handler: en_fiq
[144.958942][ T1525] fdee0000.hdmirx-controller: stream start stopping
...

// 锁定后报TMDSVALID_STABLE_CHG、TMDSQPCLK_LOCKED_CHG、TMDSQPCLK_OFF_CHG、AVP1中断
[ 176.865529][ T55] fdee0000.hdmirx-controller: hdmirx_format_change: New
format: 1920x1200p59.99 (2592x1242)
[ 176.873290][ T55] fdee0000.hdmirx-controller: hdmirx_format_change: queue
res_chg_event
[ 176.873311][ T55] fdee0000.hdmirx-controller: hdmirx_set_ddr_store_fmt:
pix_fmt: RGB888, DMA_CONFIG1:0x12000001
[ 176.873317][ T55] fdee0000.hdmirx-controller: hdmirx_interrupts_setup:
enable
[ 176.873355][ C4] fdee0000.hdmirx-controller: hdmirx_hdmi_irq_handler: hdmi
irq not handled!
[ 176.873358][ C4] fdee0000.hdmirx-controller: avp0:0x0, avp1:0x0, mu0:0x0,
mu2:0x0, pk0:0x800, pk2:0x0, scdc:0x0
[ 177.389362][ C4] fdee0000.hdmirx-controller: avpunit_0_int_handler:

avp0_st:0x200000
[ 177.389378][ C4] fdee0000.hdmirx-controller: mu2_st:0x2
[ 177.389397][ C4] fdee0000.hdmirx-controller: mainunit_2_int_handler:
TMDSVALID_STABLE_CHG
[ 177.389403][ C4] fdee0000.hdmirx-controller: hdmirx_hdmi_irq_handler:
en_fiq
[ 177.390164][ C4] fdee0000.hdmirx-controller: mu0_st:0x10
[ 177.390185][ C4] fdee0000.hdmirx-controller: mainunit_0_int_handler:
TMDSQPCLK_LOCKED_CHG
[ 177.390189][ C4] fdee0000.hdmirx-controller: hdmirx_hdmi_irq_handler:
en_fiq
[ 177.392165][ C4] fdee0000.hdmirx-controller: mu0_st:0x10

[ 177.392185][ C4] fdee0000.hdmirx-controller: mainunit_0_int_handler:
TMDSQPCLK_OFF_CHG
[ 177.392190][ C4] fdee0000.hdmirx-controller: hdmirx_hdmi_irq_handler:
en_fiq
[ 177.393391][ C4] fdee0000.hdmirx-controller: mu2_st:0x2
[ 177.393410][ C4] fdee0000.hdmirx-controller: mainunit_2_int_handler:
TMDSVALID_STABLE_CHG
[ 177.393415][ C4] fdee0000.hdmirx-controller: hdmirx_hdmi_irq_handler:
en_fiq
[ 177.397433][ C4] fdee0000.hdmirx-controller: avpunit_1_int_handler:
avp1_st:0x40000000
[ 177.397445][ C4] fdee0000.hdmirx-controller: hdmirx_hdmi_irq_handler:
en_fiq

[ 177.397994][ C4] fdee0000.hdmirx-controller: avpunit_1_int_handler:
avp1_st:0x80000000
[ 177.398002][ C4] fdee0000.hdmirx-controller: hdmirx_hdmi_irq_handler:
en_fiq
```

### 9.8 TMDSCLK-Messfehler

```text
// 源端实际输入4k@60 实际tmdsclk为594M
[147.366197][ T192] fdee0000.hdmirx-controller: get timings from ctrl
[147.366201][ T192] fdee0000.hdmirx-controller: act:3840x2160, total:4400x2250,

fps:16, pixclk:153864000
[147.366206][ T192] fdee0000.hdmirx-controller: hfp:176, hs:88, hbp:296, vfp:8,
vs:10, vbp:72
[147.366210][ T192] fdee0000.hdmirx-controller: tmds_clk:153864000,
pix_clk:153864000
[147.366214][ T192] fdee0000.hdmirx-controller: interlace:0, fmt:0, vic:0,
color:24, mode:hdmi
...
// 由于tmdsclk统计错误导致音频采样率错误
[152.555134][ T187] rk_hdmirx fdee0000.hdmirx-controller:
hdmirx_delayed_work_audio: audio underflow and overflow 0x3000000, with fs
invalid 12400
[152.555191][ T187] rk_hdmirx fdee0000.hdmirx-controller: hdmirx_audio_fifo_init
[152.758428][ T192] rk_hdmirx fdee0000.hdmirx-controller:
hdmirx_delayed_work_audio: audio underflow and overflow 0x3000000, with fs
invalid 12400

[152.758458][ T192] rk_hdmirx fdee0000.hdmirx-controller: hdmirx_audio_fifo_init
[152.965070][ T192] rk_hdmirx fdee0000.hdmirx-controller:
hdmirx_delayed_work_audio: audio underflow and overflow 0x3000000, with fs
invalid 12400
[152.965093][ T192] rk_hdmirx fdee0000.hdmirx-controller: hdmirx_audio_fifo_init
```

### 9.9 Neustarts bei Hotplug oder Auflösungsänderung

Nullzeigerfehler und Neustart nach dem Abziehen:

```text
[ 453.482730][ T819] fdee0000.hdmirx-controller: hdmirx_set_fmt: req(3840,
2160), out(3840, 2160), fmt:0x33524742

[ 453.482745][ T819] fdee0000.hdmirx-controller: hdmirx_get_content_type:
Graphics
[ 453.482752][ T819] fdee0000.hdmirx-controller: hdmirx_get_pix_fmt: pix_fmt:
RGB888
[ 453.987489][ T819] fdee0000.hdmirx-controller: C-Plane 0 size: 24883200,
Total imagesize: 24883200
[ 453.987524][ T819] fdee0000.hdmirx-controller: hdmirx_set_fmt: req(3840,
2160), out(3840, 2160), fmt:0x33524742
[ 453.987539][ T819] fdee0000.hdmirx-controller: hdmirx_get_content_type:
Graphics
[ 453.987545][ T819] fdee0000.hdmirx-controller: hdmirx_get_pix_fmt: pix_fmt:
RGB888
[ 454.111292][ C3] hrtimer: interrupt took 15194002 ns

[ 454.144120][ T3686] Unable to handle kernel paging request at virtual address
ffffffc0c684007d
DDR 73dffea49e typ 23/09/20-14:18:32,fwver: v1.14
LPDDR4X, 2112MHz
channel[0] BW=16 Col=10 Bk=8 CS0 Row=16 CS1 Row=16 CS=2 Die BW=16 Size=2048MB
channel[1] BW=16 Col=10 Bk=8 CS0 Row=16 CS1 Row=16 CS=2 Die BW=16 Size=2048MB
channel[2] BW=16 Col=10 Bk=8 CS0 Row=16 CS1 Row=16 CS=2 Die BW=16 Size=2048MB

[ 4088.362084][T31719] Unable to handle kernel paging request at virtual address
0000000200000077
[ 4088.364060][ T268] dw-hdcp fde70000.hdcp: hdcp reset
[ 4088.366597][T31719] Mem abort info:

[ 4088.366599][T31719] ESR = 0x96000005
[ 4088.366601][T31719] EC = 0x25: DABT (current EL), IL = 32 bits
[ 4088.366602][T31719] SET = 0, FnV = 0
[ 4088.366604][T31719] EA = 0, S1PTW = 0
[ 4088.366604][T31719] Data abort info:
[ 4088.366606][T31719] ISV = 0, ISS = 0x00000005
[ 4088.366607][T31719] CM = 0, WnR = 0
[ 4088.366609][T31719] user pgtable: 4k pages, 39-bit VAs, pgdp=000000010318c000
[ 4088.366614][T31719] [0000000200000077] pgd=0000000000000000
[ 4088.367094][ T580] Unable to handle kernel write to read-only memory at
virtual address ffffffc008105928
[ 4088.367373][T31719] , p4d=0000000000000000
[ 4088.367375][ C1] ------------[ cut here ]------------
[ 4088.367386][ C1] WARNING: CPU: 1 PID: 0 at kernel/workqueue.c:1660
queue_delayed_work_on+0xb4/0x114
```

HDMIRX-bezogener Interrupt mit anschließendem Neustart nach dem Abziehen:

```text
[ 417.412262][ T827] fdee0000.hdmirx-controller: C-Plane 0 size: 24883200,
Total imagesize: 24883200

[ 417.412293][ T827] fdee0000.hdmirx-controller: hdmirx_set_fmt: req(3840,
2160), out(3840, 2160), fmt:0x33524742
[ 417.412308][ T827] fdee0000.hdmirx-controller: hdmirx_get_content_type:
Graphics
[ 417.412314][ T827] fdee0000.hdmirx-controller: hdmirx_get_pix_fmt: pix_fmt:
RGB888
[ 417.666427][ C4] fdee0000.hdmirx-controller: mu0_st:0xc0000000
[ 417.666443][ C4] fdee0000.hdmirx-controller: hdmirx_interrupts_setup:
disable
[ 417.666468][ C4] fdee0000.hdmirx-controller: mainunit_2_int_handler:
TMDSVALID_STABLE_CHG
[ 417.666581][ T3437] ------------[ cut here ]------------
DDR 73dffea49e typ 23/09/20-14:18:32,fwver: v1.14

LPDDR4X, 2112MHz
channel[0] BW=16 Col=10 Bk=8 CS0 Row=16 CS1 Row=16 CS=2 Die BW=16 Size=2048MB
channel[1] BW=16 Col=10 Bk=8 CS0 Row=16 CS1 Row=16 CS=2 Die BW=16 Size=2048MB
channel[2] BW=16 Col=10 Bk=8 CS0 Row=16 CS1 Row=16 CS=2 Die BW=16 Size=2048MB
```

Neustart beim Streaming-Beginn nach dem Einstecken:

```text
[  31.300604][ T556] fdee0000.hdmirx-controller: hdmirx_get_color_range:
color_range: limit
[  31.300662][ T556] fdee0000.hdmirx-controller: hdmirx_get_color_space: video

standard: xvYCC601
[  31.316905][ T556] fdee0000.hdmirx-controller: hdmirx_start_streaming:
start_stream cur_buf y_addr:0x10900000, uv_addr:0x10900000
[  31.316924][ T556] fdee0000.hdmirx-controller: hdmirx_start_streaming: enable
dma
[ 417.666581][ T3437] ------------[ cut here ]------------
DDR 73dffea49e typ 23/09/20-14:18:32,fwver: v1.14
LPDDR4X, 2112MHz
channel[0] BW=16 Col=10 Bk=8 CS0 Row=16 CS1 Row=16 CS=2 Die BW=16 Size=2048MB
channel[1] BW=16 Col=10 Bk=8 CS0 Row=16 CS1 Row=16 CS=2 Die BW=16 Size=2048MB
```

Schwarzes oder grünes Bild nach dem Einstecken; erneutes Einstecken oder Wechseln der Quelle stellt das Bild nicht wieder her.

Laut Quelle verursachen manche Eingänge einen HDMIRX-Fehler ohne Busfehler. DMA überträgt dann keine Daten, wodurch ein schwarzes Bild entsteht. Setzen Sie Protokollstufe 3 und prüfen Sie, ob DMA-bezogene Interrupts normal abwechseln. Auch fehlendes dma_idle_irq weist auf dieses Problem hin.

Normales Protokoll:

```text
[ 2778.207227][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x80, st13:1080
[ 2778.215891][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x100, st13:540
[ 2778.223889][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x80, st13:1080

[ 2778.232559][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x100, st13:540
[ 2778.240557][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x80, st13:1080
[ 2778.249222][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x100, st13:540
```

Fehlerhaftes Protokoll:

```text
[ 2778.215891][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x100, st13:540
[ 2778.232559][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x100, st13:540

[ 2778.249222][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x100, st13:540
[ 2778.265887][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x100, st13:540
[ 2778.282557][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x100, st13:540
```

## 10. Patches für Neustartprobleme

Laut Quelle kann ein SDK-Update die Wahrscheinlichkeit HDMIRX-bezogener Neustarts verringern; ihre vollständige Beseitigung wird nicht zugesagt. Der eingereichte Code ist in folgenden Versionen enthalten:

| SDK-Version | Kernel |
| --- | --- |
| android-12.0-mid-rkr14 | 5.10 |
| android-13.0-mid-rkr6 | 5.10 |
| android-14.0-mid-rkr1 | 6.1 |
| linux-5.10-gen-rkr5 | 5.10 |

Hinweis: NVR-sdk-v1.7 enthält die beschriebenen neuesten Neustart-Patches nicht; sie müssen separat bereitgestellt werden.

Ist das SDK nicht auf eine der genannten Versionen aktualisiert, verwenden Sie die von der Quelle referenzierten separaten Patches: https://redmine.rock-chips.com/documents/130.

kernel-5.10

Methode 1: Eigene Änderungen sichern, die entsprechenden Patches mit git am anwenden und anschließend die eigenen Änderungen manuell wiederherstellen.

Methode 2: Die Treiberquellen unter ../hdmirx/ ersetzen, Patches 0009, 0010 und 0022 anwenden und anschließend eigene Änderungen wiederherstellen. Dies ist das Updateverfahren der Quelle, keine bei der Artikelerstellung ausgeführte Aktion.

rkbin

Die Quelle nennt rk3588_bl31_v1.41.elf, verlangt eine Version mindestens nach v1.39 und nennt danach rk3588_bl31_v1.39.elf als Grundlage. Die Formulierung zur Ein- beziehungsweise Ausschließlichkeit ist widersprüchlich; prüfen Sie die erforderliche BL31-Version für das tatsächliche SDK, statt zu raten.

Prüfen Sie die Version in: `vim rkbin/RKTRUST/RK3588TRUST.ini`.

Die Quelle empfiehlt üblicherweise v1.42, das auch weitere DDR-Probleme adressiert; Patchhinweis: https://redmine.rock-chips.com/issues/441328.

Aktualisieren Sie zusammen mit BL31 die passende ddr_bin-Version.

Prüfen Sie nach dem BL31-Update und Flashen von U-Boot das Startprotokoll, um den Austausch zu bestätigen. Für v1.42 nennt die Quelle folgenden Build-Zeitstempel:

```text
INFO: Preloader serial: 2
NOTICE: BL31: v2.3():v2.3-639-g87bcc5dfe:derrick.huang
NOTICE: BL31: Built : 18:06:16, Sep 9 2023
```

Prüfen Sie nach Anwendung der Patches, ob folgende wichtige Funktionen übereinstimmen:

Interrupt-Konfiguration:

```text
static void hdmirx_interrupts_setup(struct rk_hdmirx_dev *hdmirx_dev, bool en)
{

   struct v4l2_bt_timings *bt = &hdmirx_dev->timings.bt;

   v4l2_dbg(1, debug, &hdmirx_dev->v4l2_dev, "%s: %sable\n",
         __func__, en ? "en" : "dis");

   if (en && bt->pixelclock > 590000000 && hdmirx_dev->pix_fmt != HDMIRX_YUV420)
{
      hdmirx_update_bits(hdmirx_dev, VMON_CONTROL,
              VMON_IRQ_THR_MASK, VMON_IRQ_THR_MASK);
      hdmirx_update_bits(hdmirx_dev, VMON_CONTROL2,
              VMON_IRQ_VERTICAL_MASK |
              VMON_IRQ_HORIZONAL_MASK,
              VMON_IRQ_VERTICAL_SEL(0x1f) |

              VMON_IRQ_HORIZONAL_SEL(0x1f));
      hdmirx_update_bits(hdmirx_dev, DEFRAMER_CONFIG0,
              VS_REMAPFILTER_EN_QST |
              VS_FILTER_ORDER_QST_MASK |
              HS_FILTER_ORDER_QST_MASK,
              VS_REMAPFILTER_EN_QST |
              VS_FILTER_ORDER_QST(0x3) |
              HS_FILTER_ORDER_QST(0x0));
   } else {
      hdmirx_update_bits(hdmirx_dev, VMON_CONTROL,
              VMON_IRQ_THR_MASK, 0);
      hdmirx_update_bits(hdmirx_dev, VMON_CONTROL2,

              VMON_IRQ_VERTICAL_MASK |
              VMON_IRQ_HORIZONAL_MASK,
              VMON_IRQ_VERTICAL_SEL(0x1f) |
              VMON_IRQ_HORIZONAL_SEL(0x0));
      hdmirx_update_bits(hdmirx_dev, DEFRAMER_CONFIG0,
              HS_FILTER_ORDER_QST_MASK,
              HS_FILTER_ORDER_QST(0x3));
   }
```

Stream-on:

```text
static int hdmirx_start_streaming(struct vb2_queue *queue, unsigned int count)
{
   ...

   touch_flag = (hdmirx_dev->bound_cpu << 1) | 0x1;
   sip_hdmirx_config(HDMIRX_AUTO_TOUCH_EN, 0, touch_flag, 100);
   ...
   sip_hdmirx_config(HDMIRX_INFO_NOTIFY, 0, DMA_CONFIG6, HDMIRX_DMA_EN);
   ...
}
```

Besondere Änderungen

Manche Kunden meldeten eine erhöhte Neustartwahrscheinlichkeit bei Signalwegen über Switches oder Bridges wie DP-zu-HDMI. Für die Analyse muss der Bridge-Hersteller einbezogen werden. Die Quelle nennt Lontium LT8641 (Switch) und LT8711 (DP2HDMI) mit Optimierungen für RK3588-Hotplug-Szenarien; fragen Sie den Hersteller nach der passenden Firmware und testen Sie diese. Dies sind Quellberichte, keine ArmSoM-Validierungsergebnisse.

{% endraw %}
