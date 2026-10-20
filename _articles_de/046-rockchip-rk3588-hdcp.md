---
title: "RK3588-HDCP-Entwicklerhandbuch: Schlüssel, Firmware, HDMI-/DP-Konfiguration und Fehlersuche"
description: "Vollständige RK3588-HDCP-1.4/2.3-Referenz zu Werkzeugen, libhdcp-APIs, Schlüssel- und Firmware-Paketierung, HDMIRX/HDMITX/DPTX, Status und Fehlersuche."
translation_key: "046-rockchip-rk3588-hdcp"
slug: "046-rockchip-rk3588-hdcp"
lang: "de"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: ["Rockchip", "HDCP"]
keywords: "ArmSoM Rockchip HDCP"
excerpt: "Vollständige RK3588-HDCP-1.4/2.3-Referenz zu Werkzeugen, libhdcp-APIs, Schlüssel- und Firmware-Paketierung, HDMIRX/HDMITX/DPTX, Status und Fehlersuche."
---

{% raw %}

# RK3588-HDCP-Entwicklerhandbuch: Schlüssel, Firmware, HDMI-/DP-Konfiguration und Fehlersuche

Diese vollständige technische Referenz folgt Rockchip V1.0.0. Der Geltungsbereich der Quelle umfasst RK3588, Linux 5.10 und Android12/Android13. Sie dient als ArmSoM-Plattformreferenz: Prüfen Sie die konkrete Platine, den SoC, den SDK-/BSP-Zweig, den Kernel und die Peripheriekonfiguration. Eine Hardwarevalidierung auf Platinenebene wurde nicht durchgeführt; eine Unterstützung auf jeder ArmSoM-Platine wird nicht vorausgesetzt.

Die chinesische Fassung folgt der 19-seitigen chinesischen PDF-Datei; die englische folgt der 21-seitigen englischen PDF-Datei, deren technischen Text die russische Fassung vollständig übersetzt. Auch die deutsche Fassung übersetzt den vollständigen englischen Artikel. Die chinesische Fassung verwendet Abbildungen aus der chinesischen Quelle; Englisch, Russisch und Deutsch verwenden Abbildungen aus der englischen PDF-Datei, einschließlich darin vorhandener chinesischer Oberflächenbeschriftungen. Widersprüche der Quelle und Extraktionskorrekturen sind in den [redaktionellen Hinweisen](/docs/rockchip-rk3588-hdcp/EDITORIAL-NOTES.md) dokumentiert. Codekommentare und Ausgaben bleiben in ihrer Quellsprache.

**Betriebsrisiko:** Das Programmieren von Schlüsseln/Firmware verändert den Gerätespeicher und den Authentifizierungszustand. Hexadezimale Schlüssel sind Beispiele aus der Quelle, keine Produktionsschlüssel; beschaffen Sie rechtmäßige HDCP-Schlüssel gemäß den geltenden Lizenzbedingungen. Es wurden keine Programmier-, OTP-, Authentifizierungs- oder Wiedergabetests durchgeführt, und es sind keine privaten Schlüssel enthalten. Die Verschlüsselungsbeschreibungen der Quelle ersetzen keine SDK-spezifischen Anforderungen oder Lizenzbedingungen.

Offizielle Ressourcen: [ArmSoM](https://docs.armsom.org/), [Rockchip Linux](https://github.com/rockchip-linux).

| SoC | Kernel | Android |
|---|---|---|
| RK3588 | Linux 5.10 | Android12 / Android13 |

<!-- Source EN PDF p.4, block 0 -->

## 1. Überblick über HDCP

<!-- Source EN PDF p.4, block 1 -->

Die RK3588-Plattform unterstützt HDCP1.4 und HDCP2.3 jeweils für HDMITX, HDMIRX und DPTX.

<!-- Source EN PDF p.4, block 2 -->

Die RK3588-Plattform besitzt zwei unabhängige HDCP2.3-Controller (hdcp0 und hdcp1), die jeweils 3 Ports besitzen:

<!-- Source EN PDF p.4, block 3 -->

hdcp0: DPTX0 und DPTX1

<!-- Source EN PDF p.4, block 4 -->

hdcp1: HDMIRX, HDMITX0 und HDMITX1

<!-- Source EN PDF p.4, block 5 -->

![Technische Originalabbildung — PDF S. 4](/docs/rockchip-rk3588-hdcp/assets/en-p04-figure1.png)

Editierbare Übertragung der Abbildung:

| Controller | Port | Schnittstelle |
|---|---|---|
| HDCP0 | Port0 | DPTX0 |
| HDCP0 | Port1 | DPTX1 |
| HDCP1 | Port0 | HDMIRX |
| HDCP1 | Port1 | HDMITX0 |
| HDCP1 | Port2 | HDMITX1 |

<!-- Source EN PDF p.4, block 6 -->

HDCP1.4- beziehungsweise HDCP2.3-Schlüssel müssen Kunden direkt über die offizielle HDCP-Website erwerben. RK3588 besitzt keine integrierten HDCP-Schlüssel.

<!-- Source EN PDF p.4, block 7 -->

## 2. Anleitung zu den HDCP-Werkzeugen

<!-- Source EN PDF p.4, block 8 -->

### 2.1 HDCP-Unterstützung für unterschiedliche Programmierverfahren

<!-- Source EN PDF p.4, block 9 -->

1\. RK stellt entsprechende Werkzeuge zur Schlüsselkonvertierung und Programmierung bereit, die aus dem SDK bezogen werden können:

<!-- Source EN PDF p.4, block 10 -->

Werkzeug zum Aufteilen und Konvertieren von Schlüsseln:

<!-- Source EN PDF p.4, block 11 -->

Das Paket RKTools/windows/Rockchip_HdcpKey_Writer_V1.0.1.7z enthält Werkzeuge zum Aufteilen und Konvertieren
von Schlüsseln mit KeyConvertor. Nach einem Update auf KeyConvertor-V2.0.5 lassen sich einzelne
bin-Dateien mit jeweils einem Schlüssel erzeugen.

<!-- Source EN PDF p.5, block 12 -->

Werkzeug zur Schlüsselprogrammierung:

<!-- Source EN PDF p.5, block 13 -->

```text
RKTools/windows/Rockchip_HdcpKey_Writer_V1.0.1.7z
```

<!-- Source EN PDF p.5, block 14 -->

2\. RK stellt die Bibliothek libhdcp.so zur verschlüsselten Programmierung bereit. Kunden können darauf aufbauend eigene Programmierwerkzeuge entsprechend ihren Anforderungen entwickeln. libhdcp.so kann über Redmine bezogen werden.

<!-- Source EN PDF p.5, block 15 -->

### 2.2 Unterschiede zwischen den beiden HDCP-Programmierverfahren

<!-- Source EN PDF p.5, block 16 -->

1\. Das von RK bereitgestellte Programmierwerkzeug wendet zusätzlich zur SEED-Verschlüsselung des Schlüssels eine AES-Verschlüsselung an und schreibt ihn anschließend in den Vendor-Speicher.

<!-- Source EN PDF p.5, block 17 -->

2\. Die Bibliothek libhdcp.so zur verschlüsselten Programmierung unterstützt ausschließlich SEED-Verschlüsselung.

<!-- Source EN PDF p.5, block 18 -->

### 2.3 Schnittstelle der Bibliothek libhdcp.so zur verschlüsselten Programmierung

<!-- Source EN PDF p.5, block 19 -->

```text
enum HDCP_KEY_ID {
    HDCP1X_KEY_HDMITX_RK33 = 0,
    HDCP1X_KEY_HDMITX_RK3588,
    HDCP1X_KEY_HDMIRX_RK3588,
    HDCP1X_KEY_HDMIRX_RK628,
    HDCP1X_KEY_DP_RK3588,
    HDCP2X_KEY_HDMIRX_RK3588,
    HDCP2X_KEY_RKIV_RK3588,
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
int hdcp_key_process(enum HDCP_KEY_ID id, uint8_t *keyin, int keyin_size, uint8_t *keyout,
int keyout_size);
/*
 * Encrypt key and write it to vendor
 *
 * id: HDCP KEY type
 * keyin: HDCP1.x 308 Byte raw Key, HDCP2.x 1000 Byte Key
 * keyin_size: HDCP1.x 308, HDCP2.x 1000
 */
int hdcp_key_process_and_write(enum HDCP_KEY_ID id, uint8_t *keyin, int keyin_size);
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
 * key: HDCP1.x 314 Byte Key, HDCP2.x 1000 Byte Key
 * len: key length
 */
int hdcp_key_read(enum HDCP_KEY_ID id, uint8_t *key, int *len);
/*
 * Write rkiv to vendor
 *
 * rkiv: rkiv
 * len: must be 16
 */
int hdcp_rkiv_write(uint8_t *rkiv, int len);
```

<!-- Source EN PDF p.6, block 21 -->

### 2.4 Verschlüsselung von HDCP-1.4-Schlüsseln

<!-- Source EN PDF p.6, block 22 -->

Ein HDCP-1.4-Schlüssel besteht aus 308 Bytes, wie folgt:
8 Bytes KSV: 5 Bytes KSV + 3 Bytes 0x0;
280 Bytes DPK;
20 Bytes SHA.

<!-- Source EN PDF p.6, block 23 -->

Die SEED-Verschlüsselung verschlüsselt ausschließlich die 280 Bytes DPK.

<!-- Source EN PDF p.6, block 24 -->

### 2.5 Anleitung zur Paketierung der HDCP-2.3-Firmware

<!-- Source EN PDF p.6, block 25 -->

Das Paketierungswerkzeug DWC_HDCP2_BASE_ESM_Firmware ist nicht im SDK enthalten und muss über Redmine oder per E-Mail bei RK angefordert werden.

<!-- Source EN PDF p.6, block 26 -->

1\. Separate HDMIRX-Firmware und Schlüssel

<!-- Source EN PDF p.6, block 27 -->

Legen Sie den RX-Schlüssel im Stammverzeichnis des Paketierungswerkzeugs und im Verzeichnis tools ab:

<!-- Source EN PDF p.6, block 28 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_receivers.bin .
cp ../hdcp_receivers.bin tools/
```

<!-- Source EN PDF p.7, block 29 -->

Führen Sie das Skript build_rockchip_fw.sh aus und wählen Sie Option 1 - build firmware for both HDMIRX and HDMITX, um die Firmware ./firmware/hdpc2_hdmi.fw zu erzeugen:

<!-- Source EN PDF p.7, block 30 -->

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP
Choose the fw type: 1
```

<!-- Source EN PDF p.7, block 31 -->

2\. HDMIRX- + HDMITX-Firmware und Schlüssel

<!-- Source EN PDF p.7, block 32 -->

Legen Sie die RX- und TX-Schlüssel im Stammverzeichnis des Paketierungswerkzeugs und im Verzeichnis tools ab:

<!-- Source EN PDF p.7, block 33 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_receivers.bin .
cp ../hdcp_receivers.bin tools/
cp ../hdcp_transmitter.bin .
cp ../hdcp_transmitter.bin tools/
```

<!-- Source EN PDF p.7, block 34 -->

Führen Sie das Skript build_rockchip_fw.sh aus und wählen Sie 1 - build firmware for both HDMIRX and HDMITX, um die Firmware ./firmware/hdpc2_dp.fw zu erzeugen:

<!-- Source EN PDF p.7, block 35 -->

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP
Choose the fw type: 1
```

<!-- Source EN PDF p.7, block 36 -->

3\. HDMITX-Firmware

<!-- Source EN PDF p.7, block 37 -->

Legen Sie den TX-Schlüssel im Stammverzeichnis des Paketierungswerkzeugs und im Verzeichnis tools ab:

<!-- Source EN PDF p.7, block 38 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_transmitter.bin .
cp ../hdcp_transmitter.bin tools/
```

<!-- Source EN PDF p.7, block 39 -->

Führen Sie das Skript build_rockchip_fw.sh aus und wählen Sie 2 - build firmware for HDMITX only, um die Firmware ./firmware/hdpc2_hdmi.fw zu erzeugen:

<!-- Source EN PDF p.7, block 40 -->

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP
Choose the fw type: 2
```

<!-- Source EN PDF p.7, block 41 -->

4\. DPTX-Firmware

<!-- Source EN PDF p.7, block 42 -->

Legen Sie den TX-Schlüssel im Stammverzeichnis des Paketierungswerkzeugs und im Verzeichnis tools ab:

<!-- Source EN PDF p.7, block 43 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_transmitter.bin .
cp ../hdcp_transmitter.bin tools/
```

<!-- Source EN PDF p.8, block 44 -->

Führen Sie das Skript build_rockchip_fw.sh aus und wählen Sie 3 - build firmware for DP, um die Firmware ./firmware/hdpc2_hdmi.fw zu erzeugen:

<!-- Source EN PDF p.8, block 45 -->

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP
Choose the fw type: 3
```

<!-- Source EN PDF p.8, block 46 -->

### 2.6 Verschlüsselung von Firmware und RX-Schlüssel (optional, nicht zwingend)

<!-- Source EN PDF p.8, block 47 -->

Firmware und RX-Schlüssel werden standardmäßig mit PKf/ DUK verschlüsselt. Nachdem der HDCP-Controller Firmware und RX-Schlüssel geladen hat, werden sie mit PKf/ DUK entschlüsselt. PKf/ DUK wird während der Chipproduktion in den OTP-Speicher programmiert.

<!-- Source EN PDF p.8, block 48 -->

Um Firmware und RX-Schlüssel für jeden Kunden eindeutig zu gestalten, können sie bei der Paketierung zusätzlich mit einer AES-Schicht unter Verwendung des Schlüssels RKIV verschlüsselt werden. Nachdem der HDCP2-Dienst Firmware und RX-Schlüssel geladen hat, führt er zuerst die AES-Entschlüsselung aus und übergibt die Daten anschließend dem HDCP-Controller zur Kf/ DUK-Entschlüsselung. Die konkrete Konfiguration lautet:

<!-- Source EN PDF p.8, block 49 -->

1\. Konfiguration des 16-Byte-RKIV in firmware.aic.nouart: RKIV dient als Verschlüsselungsschlüssel und kann vom Benutzer festgelegt werden, muss jedoch exakt 16 Bytes lang sein:

<!-- Source EN PDF p.8, block 50 -->

```text
--- a/DWC_HDCP2_BASE_ESM_Firmware/firmware/firmware.aic.nouart
+++ b/DWC_HDCP2_BASE_ESM_Firmware/firmware/firmware.aic.nouart
@@ -2,6 +2,7 @@ PKf = 0x00112233445566778899aabbccddeeff
 DUK = 0xffeeddccbbaa99887766554433221100
 IK = 0xffeeddccbbaa99887766554433221100
 IVc = 0xdeadbeeffedcba9876543210
+RKIV = 0x00112233445566778899aabbccddeeff
 BBRcode = 6144
 BBRdwb = 3072
 CLL = 64
```

<!-- Source EN PDF p.8, block 51 -->

2\. Rufen Sie die Schnittstelle von libhdcp.so auf, um RKIV in den Vendor-Speicher zu programmieren:

<!-- Source EN PDF p.8, block 52 -->

```text
int main(void)
{
    uint8_t rkiv[] = {0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77,
                      0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff};
    hdcp_rkiv_write(rkiv, 16);
    return 0;
}
```

<!-- Source EN PDF p.8, block 53 -->

3\. Nach dem Programmieren des HDCP2x-RX-Schlüssels muss RKIV erneut programmiert werden.

<!-- Source EN PDF p.8, block 54 -->

4\. hdcp2_tx_rx muss auf Version 3.4 oder höher aktualisiert werden.

<!-- Source EN PDF p.9, block 55 -->

```text
rk3588_t:/ # logcat | grep HDCP2
03-16 07:36:03.988 347 347 D HDCP2 : hdcp2 version v3.4
03-16 07:36:03.988 347 347 D HDCP2 : HDCP Port: 1
03-16 07:36:03.991 347 347 D HDCP2 : Firmware: [1]
```

<!-- Source EN PDF p.9, block 56 -->

## 3. HDCP1.4: Konfiguration und Beschreibung

<!-- Source EN PDF p.9, block 57 -->

### 3.1 HDMIRX

<!-- Source EN PDF p.9, block 58 -->

#### 3.1.1 dts-Konfiguration

<!-- Source EN PDF p.9, block 59 -->

Ausschließlich HDCP 1.4 unterstützen:

<!-- Source EN PDF p.9, block 60 -->

```text
&hdmirx_ctrler {
    status = "okay";
    hdcp1x-enable;
};
```

<!-- Source EN PDF p.9, block 61 -->

Beim Aktivieren von HDCP2.3 wird standardmäßig auch HDCP1.4 aktiviert:

<!-- Source EN PDF p.9, block 62 -->

```text
&hdmirx_ctrler {
    status = "okay";
    hdcp2x-enable;
};
```

<!-- Source EN PDF p.9, block 63 -->

#### 3.1.2 Schlüsselprogrammierung

<!-- Source EN PDF p.9, block 64 -->

##### 3.1.2.1 Programmierung mit RK-Werkzeugen

<!-- Source EN PDF p.9, block 65 -->

Werkzeug zum Aufteilen und Konvertieren von Schlüsseln aus dem SDK:

<!-- Source EN PDF p.9, block 66 -->

Das Paket RKTools/windows/Rockchip_HdcpKey_Writer_V1.0.1.7z enthält Werkzeuge zum Aufteilen und Konvertieren
von Schlüsseln mit KeyConvertor. Nach einem Update auf KeyConvertor-V2.0.5 lassen sich einzelne
bin-Dateien mit jeweils einem Schlüssel erzeugen.

<!-- Source EN PDF p.9, block 67 -->

Werkzeug zur Schlüsselprogrammierung aus dem SDK:

<!-- Source EN PDF p.9, block 68 -->

```text
RKTools/windows/Rockchip_HdcpKey_Writer_V1.0.1.7z
```

<!-- Source EN PDF p.9, block 69 -->

Extrahieren Sie zunächst mit dem Werkzeug zum Aufteilen und Konvertieren die gewünschten Schlüssel aus der ursprünglichen Schlüsseldatei. Konvertieren Sie diese anschließend in einen Programmierschlüssel mit der Endung .skf.

<!-- Source EN PDF p.10, block 70 -->

Werden zum Programmieren/Schreiben nicht die RK-Werkzeuge verwendet, müssen die Schlüssel in einzelne Dateien mit jeweils einem Schlüssel aufgeteilt werden. Tragen Sie dazu beim Extrahieren im Feld „Number of Keys per file“ den Wert 1 ein und klicken Sie auf Extract, um einzelne Schlüsseldateien zu erzeugen. Eine Konvertierung in das Format .skf ist nicht erforderlich.

<!-- Source EN PDF p.10, block 71 -->

![Technische Originalabbildung — PDF S. 10](/docs/rockchip-rk3588-hdcp/assets/en-p10-figure1.png)

<!-- Source EN PDF p.10, block 72 -->

Versetzen Sie das Gerät in den Loader-Modus und wählen Sie im Programmierwerkzeug „hdcp1.4Hdmirx“ und „RK3588“. Beim RK3588-HDCP1.4-Schlüssel wurde AES-Verschlüsselung ergänzt; „Do AES“ ist deshalb optional. Ohne Auswahl wird nur SEED-Verschlüsselung angewendet. Bei Auswahl kommt zur höheren Sicherheit AES zusätzlich zu SEED hinzu. Importieren Sie anschließend die obige .skf-Datei und klicken Sie auf write, um die Schlüsselprogrammierung abzuschließen.

<!-- Source EN PDF p.10, block 73 -->

Hinweis: Nach Abschluss eines Schlüssels springt das Werkzeug automatisch zum nächsten Schlüssel.

<!-- Source EN PDF p.11, block 74 -->

![Technische Originalabbildung — PDF S. 11](/docs/rockchip-rk3588-hdcp/assets/en-p11-figure1.png)

<!-- Source EN PDF p.11, block 75 -->

##### 3.1.2.2 Programmierung mit kundeneigenen Werkzeugen

<!-- Source EN PDF p.11, block 76 -->

Sie können eine eigene Anwendung entwickeln, die die Schnittstelle von libhdcp.so aufruft, den Schlüssel verschlüsselt und ihn in den Vendor-Speicher programmiert.

<!-- Source EN PDF p.11, block 77 -->

### 3.2 HDMITX

<!-- Source EN PDF p.11, block 78 -->

HDMI TX HDCP 1.4 benötigt keine besondere DTS-Konfiguration; der Treiber wird standardmäßig registriert.

<!-- Source EN PDF p.11, block 79 -->

Für den normalen Betrieb muss der Schlüssel zunächst aufgeteilt und konvertiert werden. Werkzeuge und Verfahren entsprechen denen für HDMIRX; siehe Abschnitt 3.1.2.1.

<!-- Source EN PDF p.12, block 80 -->

![Technische Originalabbildung — PDF S. 12](/docs/rockchip-rk3588-hdcp/assets/en-p12-figure1.png)

<!-- Source EN PDF p.12, block 81 -->

Zur Schlüsselprogrammierung wird dasselbe Werkzeug wie für RX verwendet. Versetzen Sie das Gerät in den Loader-Modus, klicken Sie im Programmierwerkzeug auf „Settings“ und aktivieren Sie „hdcp1.4 Hdmitx“, „RK3588“, „Force Write“ und „Single Write“. Importieren Sie anschließend die konvertierte .skf-Datei und klicken Sie auf „Write“, um die Schlüsselprogrammierung abzuschließen.

<!-- Source EN PDF p.12, block 82 -->

Hinweis: Nach Abschluss eines Schlüssels springt das Werkzeug automatisch zum nächsten Schlüssel.

<!-- Source EN PDF p.12, block 83 -->

### 3.3 DPTX

<!-- Source EN PDF p.12, block 84 -->

#### 3.3.1 dts-Konfiguration

<!-- Source EN PDF p.12, block 85 -->

Der DPTX-Treiber unterstützt HDCP1.4 von Haus aus; eine zusätzliche DTS-Konfiguration ist nicht erforderlich.

<!-- Source EN PDF p.12, block 86 -->

#### 3.3.2 Schlüsselprogrammierung

<!-- Source EN PDF p.12, block 87 -->

Das Werkzeug zum Aufteilen und Konvertieren entspricht dem für HDMI RX; siehe Abschnitt 3.1.2.1.

<!-- Source EN PDF p.12, block 88 -->

Die zur Schlüsselprogrammierung verwendeten Werkzeuge sind dieselben wie für HDMI RX. Versetzen Sie das Gerät in den Loader-Modus. Klicken Sie im Programmierwerkzeug auf Settings und wählen Sie „hdcp1.4 dp“, „RK3588“, „Force Write“ und „Single Write“. Importieren Sie anschließend die konvertierte .skf-Schlüsseldatei und klicken Sie auf Write, um die Programmierung abzuschließen. Wie beim RK3588-HDCP1.4-Schlüssel wurde zusätzlich AES-Verschlüsselung ergänzt; die Option „Do AES“ ist daher optional. Ohne Auswahl wird ausschließlich SEED-Verschlüsselung angewendet; bei Auswahl AES zusätzlich zu SEED.

<!-- Source EN PDF p.13, block 89 -->

![Technische Originalabbildung — PDF S. 13](/docs/rockchip-rk3588-hdcp/assets/en-p13-figure1.png)

<!-- Source EN PDF p.13, block 90 -->

## 4. HDCP2.3: Konfiguration und Beschreibung

<!-- Source EN PDF p.13, block 91 -->

### 4.1 HDMIRX

<!-- Source EN PDF p.13, block 92 -->

#### 4.1.1 dts-Konfiguration

<!-- Source EN PDF p.13, block 93 -->

Beim Aktivieren von HDCP2.3 wird standardmäßig auch HDCP1.4 aktiviert:

<!-- Source EN PDF p.13, block 94 -->

```text
&hdcp1 {
    status = "okay";
};
&hdmirx_ctrler {
    status = "okay";
    hdcp2x-enable;
};
```

<!-- Source EN PDF p.14, block 95 -->

#### 4.1.2 Firmware-Paketierung und Startdienste

<!-- Source EN PDF p.14, block 96 -->

Entpacken Sie DWC_HDCP2_BASE_ESM_Firmware in einer Linux-Umgebung. Kopieren Sie anschließend hdcp_receivers.bin in das Stammverzeichnis und in tools/. Wird auch HDMI TX benötigt, kann hdcp_transmitter.bin ebenfalls in diese Verzeichnisse kopiert werden.

<!-- Source EN PDF p.14, block 97 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_receivers.bin .
cp ../hdcp_receivers.bin tools/
```

<!-- Source EN PDF p.14, block 98 -->

Paketieren Sie Firmware und RX-Schlüssel und führen Sie das Skript build_rockchip_fw.sh aus.

<!-- Source EN PDF p.14, block 99 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$ ./build_rockchip_fw.sh
```

<!-- Source EN PDF p.14, block 100 -->

Der Paketierungsvorgang fordert in mehreren Schritten Eingaben an:

<!-- Source EN PDF p.14, block 101 -->

1\. Wählen Sie als Firmwaretyp: 1 -build firmware for both HDMIRX and HDMITX. Dadurch wird die Firmware ./firmware/hdpc2_hdmi.fw erzeugt.

<!-- Source EN PDF p.14, block 102 -->

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP
Choose the fw type: 1
```

<!-- Source EN PDF p.14, block 103 -->

2\. Legen Sie die Anzahl zu erzeugender RX-Schlüssel entsprechend dem Bedarf fest, beispielsweise 10 oder 100. Erzeugen Sie einzelne Schlüssel und speichern Sie diese als fw_hdcp_receivers_\*.bin im Verzeichnis ./rxkeys/hdcpkeys?-?/. Bei Verwendung kundeneigener Programmierwerkzeuge kann fw_hdcp_receivers_\*.bin direkt programmiert werden.

<!-- Source EN PDF p.14, block 104 -->

```text
Create Rx Key Number:
10
......
Create 10 keys to tools/rxkeys/hdcpkeys1-10/
```

<!-- Source EN PDF p.14, block 105 -->

3\. Werden RK-Werkzeuge zum Programmieren der Schlüssel verwendet, müssen die Dateien in das Format .skf paketiert und im Verzeichnis ./rxkeys/hdcpkeys?-?/ gespeichert werden. Wird kein RK-Programmierwerkzeug benötigt, können Sie hier 'n' wählen.

<!-- Source EN PDF p.14, block 106 -->

```text
Do want to pack these keys to .skf file? [y/n]:
y
10 file packed to ./rxkeys/hdcpkeys1-10/hdcprxkeys1-10.skf
```

<!-- Source EN PDF p.14, block 107 -->

Programmierung des HDCP2.3-Empfängerschlüssels

<!-- Source EN PDF p.14, block 108 -->

1\. Legen Sie hdcp2_hdmi.fw im Projektverzeichnis device/rockchip/rk3588/ ab. Beim Kompilieren wird die Datei nach vendor/firmware/hdcp2_hdmi.fw kopiert.

<!-- Source EN PDF p.15, block 109 -->

2\. Verwenden Sie RKDevInfoTool.exe, wählen Sie HDCP2X_HDMIRX zum Importieren der erzeugten hdcprxkeys1-10.skf und wechseln Sie zum Programmieren in den Loader-Modus. Nach einem programmierten Schlüssel geht das Werkzeug automatisch zum nächsten zur Programmierung anstehenden Schlüssel weiter.

<!-- Source EN PDF p.15, block 110 -->

3\. Der HDCP2.3-Schlüssel benötigt keine AES-Verschlüsselung; hier müssen daher nur „RK3588“ und „hdcp2x hdmirx“ ausgewählt werden.

<!-- Source EN PDF p.15, block 111 -->

![Technische Originalabbildung — PDF S. 15](/docs/rockchip-rk3588-hdcp/assets/en-p15-figure1.png)

<!-- Source EN PDF p.15, block 112 -->

Dienst hdcp2_rx_tx

<!-- Source EN PDF p.15, block 113 -->

Die Dienste werden beim Start automatisch geladen. Bei Authentifizierungsfehlern können Sie die zugehörigen Protokolle mit logcat \| grep HDCP2 anzeigen.

<!-- Source EN PDF p.15, block 114 -->

### 4.2 HDMITX

<!-- Source EN PDF p.15, block 115 -->

#### 4.2.1 dts-Konfiguration

<!-- Source EN PDF p.15, block 116 -->

HDMITX und HDMIRX teilen sich ein HDCP-Modul. Beim Aktivieren von HDCP 2.3 wird standardmäßig auch HDCP 1.4 aktiviert:

<!-- Source EN PDF p.15, block 117 -->

```text
&hdcp1 {
    status = "okay";
};
```

<!-- Source EN PDF p.15, block 118 -->

Zum Aktivieren von HDMI siehe 《Rockchip_Developer_Guide_HDMI_CN》.

<!-- Source EN PDF p.16, block 119 -->

#### 4.2.2 Firmware-Paketierung und Startdienste

<!-- Source EN PDF p.16, block 120 -->

Entpacken Sie DWC_HDCP2_BASE_ESM_Firmware in einer Linux-Umgebung. Kopieren Sie anschließend hdcp_transmitter.bin in das Stammverzeichnis und in tools/. Wird auch HDMI RX benötigt, muss hdcp_receivers.bin ebenfalls in diese Verzeichnisse kopiert werden.

<!-- Source EN PDF p.16, block 121 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_receivers.bin .
cp ../hdcp_receivers.bin tools/
```

<!-- Source EN PDF p.16, block 122 -->

Paketieren Sie Firmware und TX-Schlüssel und führen Sie das Skript build_rockchip_fw.sh aus.

<!-- Source EN PDF p.16, block 123 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$ ./build_rockchip_fw.sh
```

<!-- Source EN PDF p.16, block 124 -->

Der Paketierungsvorgang fordert in mehreren Schritten Eingaben an:

<!-- Source EN PDF p.16, block 125 -->

Wählen Sie den zu paketierenden Firmwaretyp. Für HDMI TX/RX wählen Sie: 1 -build firmware for both HDMIRX and HDMITX. Für ausschließlich HDMITX wählen Sie: 2 -build firmware for HDMITX only. Die erzeugte Firmware lautet ./firmware/hdpc2_hdmi.fw.

<!-- Source EN PDF p.16, block 126 -->

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP
Choose the fw type: 2
```

<!-- Source EN PDF p.16, block 127 -->

Dienst hdcp2_rx_tx

<!-- Source EN PDF p.16, block 128 -->

Die Dienste werden beim Start automatisch geladen. Bei Authentifizierungsfehlern können Sie die zugehörigen Protokolle mit logcat \| grep HDCP2 anzeigen.

<!-- Source EN PDF p.16, block 129 -->

### 4.3 DPTX

<!-- Source EN PDF p.16, block 130 -->

#### 4.3.1 dts-Konfiguration

<!-- Source EN PDF p.16, block 131 -->

DPTX verwendet das Modul HDCP0 zum Aktivieren der HDCP2.3-Funktion:

<!-- Source EN PDF p.16, block 132 -->

```text
&hdcp0 {
    status = "okay";
};
```

<!-- Source EN PDF p.16, block 133 -->

Beim Aktivieren von HDCP2.3 wird standardmäßig auch HDCP1.4 aktiviert.

<!-- Source EN PDF p.17, block 134 -->

#### 4.3.2 Firmware-Paketierung und Startdienste

<!-- Source EN PDF p.17, block 135 -->

Entpacken Sie DWC_HDCP2_BASE_ESM_Firmware in einer Linux-Umgebung. Kopieren Sie anschließend hdcp_transmitter.bin in das Stammverzeichnis und in tools/.

<!-- Source EN PDF p.17, block 136 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_receivers.bin .
cp ../hdcp_receivers.bin tools/
```

<!-- Source EN PDF p.17, block 137 -->

Paketieren Sie Firmware und TX-Schlüssel und führen Sie das Skript build_rockchip_fw.sh aus.

<!-- Source EN PDF p.17, block 138 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$ ./build_rockchip_fw.sh
```

<!-- Source EN PDF p.17, block 139 -->

Der Paketierungsvorgang fordert Eingaben an:

<!-- Source EN PDF p.17, block 140 -->

Wählen Sie den Firmware-Paketierungstyp: 3 - build firmware for DP, um die Firmware ./firmware/hdpc2_dp.fw zu erzeugen.

<!-- Source EN PDF p.17, block 141 -->

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP
Choose the fw type: 3
```

<!-- Source EN PDF p.17, block 142 -->

Um hdcp2_dp.fw unter Android nach /vendor/firmware/hdcp2_dp.fw zu kopieren, kann unter hardware/rockchip/hdcp2 folgender Patch ergänzt werden:

<!-- Source EN PDF p.17, block 143 -->

```text
diff --git a/device.mk b/device.mk
index 6d6c328..d7ba0a2 100644
--- a/device.mk
+++ b/device.mk
@@ -82,6 +82,12 @@ ifeq ($(strip $(USE_PRODUCT_HDCP2_HDMI_FW)), true)
         $(LOCAL_PATH)/hdcp2_hdmi.fw:vendor/firmware/hdcp2_hdmi.fw
 endif
+USE_PRODUCT_HDCP2_DP_FW := $(shell test -f $(LOCAL_PATH)/hdcp2_dp.fw && echo true)
+ifeq ($(strip $(USE_PRODUCT_HDCP2_DP_FW)), true)
+ PRODUCT_COPY_FILES += \
+ $(LOCAL_PATH)/hdcp2_dp.fw:vendor/firmware/hdcp2_dp.fw
+endif
+
 #
 # add Rockchip properties here
 #
```

<!-- Source EN PDF p.17, block 144 -->

Legen Sie hdcp2_dp.fw im Projektverzeichnis device/rockchip/rk3588/ ab. Beim Kompilieren wird die Datei nach /vendor/firmware/hdcp2_dp.fw kopiert.

<!-- Source EN PDF p.17, block 145 -->

Kopieren Sie hdcp2_dp.fw unter Linux nach /system/etc/firmware/hdcp2_dp.fw.

<!-- Source EN PDF p.17, block 146 -->

Dienst hdcp2_rx_tx

<!-- Source EN PDF p.18, block 147 -->

Unter Android müssen folgende Patches unter hardware/rockchip/hdcp2 ergänzt werden:

<!-- Source EN PDF p.18, block 148 -->

```text
diff --git a/init.hdcp2-host.rc b/init.hdcp2-host.rc
index 5a9bee8..57eef7e 100644
--- a/init.hdcp2-host.rc
+++ b/init.hdcp2-host.rc
@@ -1,7 +1,14 @@
 #on early-boot
 on post-fs
+ start hdcp2_dp
     start hdcp2_hdmi
+service hdcp2_dp /vendor/bin/hdcp2_tx_rx 0
+ class core
+ oneshot
+ disabled
+ group root system net_admin net_bt
+ capabilities DAC_OVERRIDE
 service hdcp2_hdmi /vendor/bin/hdcp2_tx_rx 1
     class core
```

<!-- Source EN PDF p.18, block 149 -->

Der Dienst kann beim Systemstart automatisch geladen werden. Bei Authentifizierungsproblemen können Sie die zugehörigen Protokolle mit logcat \| grep HDCP2 anzeigen.

<!-- Source EN PDF p.18, block 150 -->

## 5. Prüfen des HDCP-Status

<!-- Source EN PDF p.18, block 151 -->

### 5.1 HDMIRX

<!-- Source EN PDF p.18, block 152 -->

```text
cat /sys/class/misc/hdmirx_hdcp/status
```

<!-- Source EN PDF p.18, block 153 -->

```text
HDCP Disable: HDCP is not enabled
HDCP1.4: Authenticated start: during authentication process
HDCP1.4: Authentication success: Authentication successful
HDCP1.4: Authentication failed: Authentication failed
HDCP1.4: Unknown status: Unknown status
```

<!-- Source EN PDF p.18, block 154 -->

```text
HDCP Disable: HDCP is not enabled
HDCP2.3: Authentication success: Authentication successful
HDCP2.3: Authenticated failed: Authentication failed
HDCP2.3: No dectypted: Source end did not enable HDCP2.x
```

<!-- Source EN PDF p.18, block 155 -->

Die Signalquelle hat keine HDCP-Verschlüsselung aktiviert oder es ist keine Signalquelle angeschlossen:

<!-- Source EN PDF p.19, block 156 -->

```text
HDCP2.3: No dectypted
HDCP1.4: Unknown status
```

<!-- Source EN PDF p.19, block 157 -->

### 5.2 HDMITX

<!-- Source EN PDF p.19, block 158 -->

Der HDMITX-Status muss über DRM PROPERTY geprüft werden. Ein Beispiel zur Anzeige der Eigenschaften mit dem

<!-- Source EN PDF p.19, block 159 -->

Befehl modetest -c:

<!-- Source EN PDF p.19, block 160 -->

```text
---------------------------------------------------------------------
Content Protection:
                flags: enum
                enums: Undesired=0 Desired=1 Enabled=2
                value: 2
Undesired: Disable HDCP.
Desired: Enable HDCP.
Enabled: HDCP has been enabled and authenticated successfully.
---------------------------------------------------------------------
HDCP Content Type:
                flags: enum
                enums: HDCP Type0=0 HDCP Type1=1
                value: 0
HDCP Type0: If either HDCP 1.4 or HDCP 2.3 authentication succeeds at any level, normal
video output is permitted.
HDCP Type1: Must be successfully authenticated with HDCP2.3 to output a normal display.
Note: The current version of the driver does not actually support this feature. By default,
any level of successful authentication can output normally, so no configuration is required.
---------------------------------------------------------------------
hdcp_encrypted:
                flags: range
                values: 0 2
                value: 2
HDCP Authentication Level:
    0: HDCP unauthorized.
    1: hdcp1.4.
    2: hdcp2.3.
---------------------------------------------------------------------
```

<!-- Source EN PDF p.19, block 161 -->

### 5.3 DPTX

<!-- Source EN PDF p.19, block 162 -->

Das Anzeigeverfahren entspricht dem für HDMITX.

<!-- Source EN PDF p.20, block 163 -->

## 6. Analyse häufiger Probleme

<!-- Source EN PDF p.20, block 164 -->

### 6.1 Initialisierung von hdcp2_tx_rx schlägt fehl

<!-- Source EN PDF p.20, block 165 -->

Protokoll anzeigen:

<!-- Source EN PDF p.20, block 166 -->

```text
logcat | grep HDCP
```

<!-- Source EN PDF p.20, block 167 -->

```text
Failed to open firmware file [vendor/firmware/hdcp2_hdmi.fw] // indicating the firmware was
not imported
```

<!-- Source EN PDF p.20, block 168 -->

```text
Failed to open firmware driver /dev/hl_dev1 // indicating the hdcp driver is not loaded. The
DTS needs to enable the corresponding hdcp1 node.
```

<!-- Source EN PDF p.20, block 169 -->

```text
07-14 10:53:17.033 2042 2042 D HDCP2 : hdcp2 version v3.0
07-14 10:53:17.033 2042 2042 D HDCP2 : HDCP Port: 1
07-14 10:53:17.034 2042 2042 D HDCP2 : Firmware: [1]
07-14 10:53:17.034 2042 2042 D HDCP2 : 223664 bytes
07-14 10:53:17.034 2042 2042 D HDCP2 : check rx key ok
07-14 10:53:17.034 2042 2042 D HDCP2 : rxkey read from vendor success, rxkey_len = 1000
07-14 10:53:17.034 2042 2042 D HDCP2 : Host Library version V0201
07-14 10:53:17.035 2042 2042 D HDCP2 : Exiting with err=1
```

<!-- Source EN PDF p.20, block 170 -->

Wenn das Programm ohne Fehlermeldung unmittelbar beendet wird, können Sie es manuell ausführen, um den zugehörigen Fehler zu prüfen:

<!-- Source EN PDF p.20, block 171 -->

```text
console:/ # ./vendor/bin/hdcp2_tx_rx 1 &
[1] 2799
console:/ # device name = /dev/hl_dev1
<INFO> [external/hdcp/host_library/core_lib/host_lib_core.c:1199] [PID:2799] hlInst->driver->instance [0xee2401d0]
<INFO> [external/hdcp/host_library/core_lib/host_lib_core.c:1200] [PID:2799] hlInst->driver
[0xff8088f0:223664]
<WARN> [external/hdcp/host_library/core_lib/host_lib_core.c:1206] [PID:2799] Error in
file:external/hdcp/host_library/core_lib/host_lib_core.c, functio]
<ERROR> [external/hdcp/host_library/core_lib/host_lib_core.c:137] [PID:2799]
hostlib_init_mem failed
Failed HLC_Initialize, error -6
The logs of this type are caused by firmware packaging issues, which may be due to incorrect
KEY, improper DUK/PKf configuration, or incorrect packaging method. Refer to [HDCP 2.3
Firmware Packaging Instruction].
```

<!-- Source EN PDF p.20, block 172 -->

```text
HLC_HDCPRX_LoadRxDwb failed // Indicates RX KEY is incorrect
```

<!-- Source EN PDF p.21, block 173 -->

### 6.2 HDMIRX zeigt nach Abziehen und erneutem Einstecken dauerhaft ein schwarzes oder grünes Bild

<!-- Source EN PDF p.21, block 175 -->

Prüfen Sie zuerst, ob hdcp2x-enable im DTS aktiviert ist. Lesen Sie mit cat /sys/class/misc/hdmirx_hdcp/enable den Wert aus und prüfen Sie, ob er auf 2 gesetzt ist.

<!-- Source EN PDF p.21, block 176 -->

Ist hdcp2x-enable aktiviert, muss der Dienst hdcp2_tx_rx geladen werden; andernfalls kann ein schwarzes oder grünes Bild entstehen. Prüfen Sie dies durch Ausführen von logcat \| grep HDCP2.

<!-- Source EN PDF p.21, block 177 -->

Wurde hdcp2_tx_rx bereits geladen, prüfen Sie, ob der Dienst unerwartet beendet wurde. Verwenden Sie auch hierfür logcat \| grep HDCP2.

<!-- Source EN PDF p.21, block 178 -->

Wenn echo 0 > /sys/class/misc/hdmirx_hdcp/enable danach den normalen Betrieb wiederherstellt, bestätigt dies das oben beschriebene Problem.

<!-- Source EN PDF p.21, block 179 -->

### 6.3 Bei gleichzeitig aktiviertem HDCP2.3 für HDMITX + HDMIRX zeigt TX beim Abziehen von RX kurz ein verzerrtes Bild

<!-- Source EN PDF p.21, block 180 -->

Da HDMIRX und HDMITX den HDCP2.3-Controller gemeinsam verwenden, wird dieser beim Abziehen von RX während der Vorschau zurückgesetzt. Dies führt zu einem Fehlerzustand des HDCP2.3-Controllers. Erkennt hdcp2_tx_rx diesen Zustand, initialisiert es den Controller neu und authentifiziert erneut, wodurch kurz ein Bildartefakt entsteht. Es wird empfohlen, HDCP2.3 nicht gleichzeitig für TX und RX zu aktivieren.

{% endraw %}


