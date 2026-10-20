---
title: "Rockchip-DP-Signaltests: USBDP-PHY-Register und Abstimmung für RK3576/RK3588"
description: "Vollständige quellenbasierte Referenz zu DP-PHY-Amplitude, Entzerrung, Flankensteilheit, SSC, AUX und Treiberkonfiguration mit Originalregistertabellen und dokumentierten Quellenwidersprüchen."
translation_key: "041-rockchip-dp-si-test"
slug: "041-rockchip-dp-si-test"
lang: "de"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: ["Sige5", "Sige7"]
tags: ["Rockchip", "DisplayPort", "RK3576", "RK3588", "USBDP PHY"]
keywords: "ArmSoM Rockchip 瑞芯微 RK3576 RK3588 DP PHY SSC AUX signal integrity"
excerpt: "Vollständige quellenbasierte Referenz zu DP-PHY-Amplitude, Entzerrung, Flankensteilheit, SSC, AUX und Treiberkonfiguration mit Originalregistertabellen und dokumentierten Quellenwidersprüchen."
---

# Rockchip-DP-Signaltests: USBDP-PHY-Register und Abstimmung für RK3576/RK3588

Diese vollständige Referenz basiert auf dem Rockchip DP Signal Test Guide V1.0.0 (RK-KF-YF-C13) und behandelt RK3576/RK3588 mit dem Rockchip-BSP unter Linux 5.10/6.1. Die offizielle Dokumentation nennt RK3576 für ArmSoM [Sige5](https://docs.armsom.org/armsom-sige5) und RK3588 für [Sige7](https://docs.armsom.org/armsom-sige7). Dies bleibt eine Plattformreferenz: Prüfen Sie vor der Verwendung das Leiterplattenrouting, die PHY-Instanz, die DP-/Type-C-Schnittstelle, den SDK-/BSP-Commit sowie die Kernel- und Treiberversionen. Es wurde keine Validierung auf ArmSoM-Hardware durchgeführt.

Es wurde nur die chinesische PDF-Datei bereitgestellt (13 Seiten); Englisch und Russisch sind vollständige Übersetzungen dieser Quelle. Die deutsche Fassung übersetzt die vollständige englische Artikelfassung. Die Quelle enthält keine eigenständigen technischen Abbildungen. Sämtliche Registertabellen sind editierbar; es werden keine englischen Originalabbildungen behauptet. Die vorgegebenen Deckblatthinweise, Kontaktdaten, Zielgruppenbeschreibung und Änderungshistorie wurden weggelassen; die technische Versionsangabe und der vollständige technische Haupttext bleiben erhalten.

**Vor der Anwendung überprüfen:** Die Beispiele mit `io -4` schreiben direkt in Hardwareregister; sie sind keine universell gültigen Platinenkonfigurationen. Die Quelle enthält Befehle mit fehlenden Leerzeichen sowie widersprüchliche Bitbreiten, Offsets und Überschriften. Diese bleiben zur Nachverfolgbarkeit erhalten. Führen Sie strittige Zeilen nicht durch bloßes Kopieren aus. Lesen Sie zunächst die nachfolgenden redaktionellen Hinweise und prüfen Sie die Angaben anhand des TRM/BSP.

## 1. Überblick über den DP PHY

Bei RK3576 und RK3588 teilen sich DP und USB den USBDP PHY. Diese Anleitung beschreibt die Signalabstimmung bei Verwendung des PHY für DP. Die Basisadressen sind unten aufgeführt; jede Registeradresse ergibt sich aus der Basisadresse des gewählten PHY plus dem Registeroffset.

<!-- Source PDF page 4 -->

| USBDP PHY | USBDP-PHY-Basisadresse |
|---|---|
| RK3588 USBDP PHY0 | 0xfed88000 |
| RK3588 USBDP PHY1 | 0xfed98000 |
| RK3576 USBDP PHY | 0x2b018000 |

## 2. Abstimmung des DP-Signals

Die IO-Befehle der Quelle verwenden Lane0 von RK3588 PHY0. Für andere Lanes sind andere Offsets erforderlich; RK3588 PHY1 und RK3576 benötigen andere Basisadressen (die Quelle schreibt Letzteren hier als RK3756; siehe Hinweise). Register erfüllen gewöhnlich mehrere Funktionen. Lesen Sie vor dem Kombinieren von Anpassungen den aktuellen Wert, wenden Sie die neuen Abstimmungsbits wie in der Quelle beschrieben mit einer ODER-Verknüpfung an und schreiben Sie den Wert anschließend zurück; andernfalls können frühere Einstellungen überschrieben werden.

### 2.1 Steuerung der DP-Amplitude

#### 2.1.1 Hauptabgriffpegel des DP-TX-Treibers

Die Quelle empfiehlt, bei der Spannungsabstimmung zuerst dieses Register anzupassen. Die Offsets sind unten dargestellt; bit5 aktiviert die Einstellung, der Standardwert ist `0x0f`.

```text
lane0: 0x0810[5:0]
lane1: 0x1010[5:0]
lane2: 0x1810[5:0]
lane3: 0x2010[5:0]
```

Die nachfolgenden Einstellbereiche und Befehle gelten für Lane0. Die Adresse von Lane1 lautet beispielsweise `0xfed89010` (`0xfed88810 + 0x800`).

<!-- Source PDF page 5 -->

| Amplitude | Befehl [ Registeroffset 0x0810, bit 5:0] |
|---|---|
| 4'b1010 : 1200mv (max) | io -4 0xfed88810 0x2a |
| 4'b1001: | io -4 0xfed88810 0x29 |
| 4'b1000: | io -4 0xfed888100x28 |
| 4'b0111: | io -4 0xfed88810 0x27 |
| 4'b0110 : | io -4 0xfed88810 0x26 |
| 4'b0101: | io -4 0xfed88810 0x25 |
| 4'b0100: | io -4 0xfed88810 0x24 |
| 4'b0011: | io -4 0xfed88810 0x23 |
| 4'b0010 : | io -4 0xfed88810 0x22 |
| 4'b0001: | io -4 0xfed88810 0x21 |
| 4'b0000: 400mv (min) | io -4 0xfed88810 0x20 |

#### 2.1.2 DP-TX-PMOS-Stromsteuerung

Passen Sie das Stromregister an, wenn die Spannungsanpassung nicht ausreicht. Die Aktivierungsbits sind bit[1:0], die Standardwerte `{0x1, 0xe7}`. Die Tabelle führt den Einstellbereich auf.

```text
lane0: enable: 0x0818[1:0]; control: 0x081c[7:5]={3'b000 ~ 3'b111}
lane1: enable: 0x1018[1:0]; control: 0x101c[7:5]
lane2: enable: 0x1818[1:0]; control: 0x181c[7:5]
lane3: enable: 0x2018[1:0]; control: 0x201c[7:5]
```

<!-- Source PDF page 6 -->

| Amplitude | Befehl [ Registeroffset 0x081c, bit 7:5] |
|---|---|
| 3'b111: | io -4 0xfed88818 0x03<br>io -4 0xfed8881c 0xe5 |
| 3'b110: | io -4 0xfed88818 0x03<br>io -4 0xfed8881c 0xc5 |
| 3'b101: | io -4 0xfed88818 0x03<br>io -4 0xfed8881c 0xa5 |
| 3'b100: | io -4 0xfed88818 0x03<br>io -4 0xfed8881c 0x85 |
| 3'b011 : | io -4 0xfed88818 0x03<br>io -4 0xfed8881c 0x65 |
| 3'b010 : | io -4 0xfed88818 0x03<br>io -4 0xfed8881c 0x45 |
| 4'b001: | io -4 0xfed88818 0x03<br>io -4 0xfed8881c 0x25 |
| 4'b000: | io -4 0xfed88818 0x03<br>io -4 0xfed8881c 0x05 |

### 2.2 DP-Entzerrung

#### 2.2.1 DP-TX-Deemphasis

Die Offsets sind unten dargestellt. Bit4 ist das Aktivierungsbit; der Standardwert ist `0x0`, entsprechend 0 dB. Es folgen die Pegel und Empfehlungen der Quelle.

```text
lane0: 0x0814[4:0]
lane1: 0x1014[4:0]
lane2: 0x1814[4:0]
lane3: 0x2014[4:0]
```

<!-- Source PDF page 6 -->

| Pegel | Befehl [ Registeroffset 0x0814, bit 4:0] |
|---|---|
| 5'b10000: 0 dB | io -4 0xfed88814 0x10 |
| 5'b11011: -5 dB (Für Geschwindigkeiten über 5 Gbps empfohlen) | io -4 0xfed88814 0x1b |
| 5'b10101: -2.8 dB (Für Geschwindigkeiten über 10 Gbps empfohlen) | io -4 0xfed88814 0x15 |
| 5'b11001: -6.9 dB (Verwendung nicht empfohlen) | io -4 0xfed88814 0x19 |

#### 2.2.2 DP-TX-Preshoot-Pegel

Bit6 aktiviert die Einstellung; der Standardwert ist `0x0`. Dieses Register wird gemeinsam mit der TX-PMOS-Stromsteuerung verwendet. Die Befehle gelten für Lane0; passen Sie für andere Lanes die Offsets an, beispielsweise auf `0xfed89018` für Lane1 (`0xfed88818 + 0x800`).

```text
lane0: 0x0818[6:2]
lane1: 0x1018[6:2]
lane2: 0x1818[6:2]
lane3: 0x2018[6:2]
```

<!-- Source PDF page 7 -->

| Pegel | Befehl [ Registeroffset 0x0818, bit 6:2] |
|---|---|
| 5'b1000000: 0 dB (Standard, Für Geschwindigkeiten über 5 Gbps empfohlen) | io -4 0xfed88818 0x40 |
| 5'b1011000: -1.6 dB (Für Geschwindigkeiten über 10 Gbps empfohlen) | io -4 0xfed88818 0x58 |
| 5'b11001: -6.9 dB (Verwendung nicht empfohlen) | io -4 0xfed88818 0x64 |

### 2.3 DP-TX-Flankensteilheit

#### 2.3.1 Steuerung einer schnelleren Flanke

Die Standardwerte sind `{0xe7, 0x60}`. Es folgen die Registeroffsets zum Aktivieren der Einstellung und zur Steuerung der Treiberstärke.

```text
lane0: enable: 0x081c[1:0]={2'b11}; strength: 0x0820[5:3]={3'b111 ~ 3'b000}
lane1: enable: 0x101c[1:0]; strength: 0x1020[5:3]
lane2: enable: 0x181c[1:0]; strength: 0x1820[5:3]
lane3: enable: 0x201c[1:0]; strength: 0x2020[5:3]
```

Der folgende Einstellbereich und die IO-Befehle gelten für Lane0. Andere Lanes benötigen andere Offsets, beispielsweise `0xfed8901c` für Lane1 (`0xfed8881c + 0x800`).

<!-- Source PDF page 8 -->

| Amplitude | Befehl [ Registeroffset 0x081c, bit 7:5] |
|---|---|
| 3'b111: | io -4 0xfed8881c 0xe7<br>io -4 0xfed88820 0x78 |
| 3'b110: | io -4 0xfed8881c 0xe7<br>io -4 0xfed888200x70 |
| 3'b101: | io -4 0xfed8881c 0xe7<br>io -4 0xfed88820 0x68 |
| 3'b100: | io -4 0xfed8881c 0xe7<br>io -4 0xfed88820 0x60 |
| 3'b011 : | io -4 0xfed8881c 0xe7<br>io -4 0xfed88820 0x58 |
| 3'b010 : | io -4 0xfed8881c 0xe7<br>io -4 0xfed88820 0x50 |
| 4'b001: | io -4 0xfed8881c 0xe7<br>io -4 0xfed88820 0x48 |
| 4'b000: | io -4 0xfed8881c 0xe7<br>io -4 0xfed88820 0x40 |

#### 2.3.2 Steuerung einer langsameren Flanke

Die Standardwerte sind `{0xe7, 0x60}`. Es folgen die Registeroffsets zum Aktivieren der Einstellung und zur Steuerung der Treiberstärke.

```text
lane0: enable: 0x081c[1:0]={2'b10}; strength: 0x0820[5:3]={3'b111 ~ 3'b000}
lane1: enable: 0x101c[1:0]; strength: 0x1020[5:3]
lane2: enable: 0x181c[1:0]; strength: 0x1820[5:3]
lane3: enable: 0x201c[1:0]; strength: 0x2020[5:3]
```

Der folgende Einstellbereich und die IO-Befehle gelten für Lane0. Andere Lanes benötigen andere Offsets, beispielsweise `0xfed8901c` für Lane1 (`0xfed8881c + 0x800`).

Hinweis: Dieses Register wird gemeinsam mit der TX-PMOS-Stromsteuerung verwendet.

<!-- Source PDF page 9 -->

| Amplitude | Befehl [ Registeroffset 0x081c, bit 7:5] |
|---|---|
| 3'b111: | io -4 0xfed8881c 0xe6<br>io -4 0xfed88820 0x78 |
| 3'b110: | io -4 0xfed8881c 0xe6<br>io -4 0xfed88820 0x70 |
| 3'b101: | io -4 0xfed8881c 0xe6<br>io -4 0xfed88820 0x68 |
| 3'b100: | io -4 0xfed8881c 0xe6<br>io -4 0xfed88820 0x60 |
| 3'b011 : | io -4 0xfed8881c 0xe6<br>io -4 0xfed88820 0x58 |
| 3'b010 : | io -4 0xfed8881c 0xe6<br>io -4 0xfed88820 0x50 |
| 4'b001: | io -4 0xfed8881c 0xe6<br>io -4 0xfed88820 0x48 |
| 4'b000: | io -4 0xfed8881c 0xe6<br>io -4 0xfed88820 0x40 |

### 2.4 DP-TX-SSC-Steuerung

#### 2.4.1 PLL-SSC-Modulationshub

Der Standardwert ist `0x19`; es folgen die Offsets für die einzelnen Datenraten und der Einstellbereich.

```text
RBR: 0x03F0[5:0]
HBR: 0x03F4[5:0]
HBR2: 0x03F8[5:0]
HBR3: 0x03FC[5:0]
```

<!-- Source PDF page 9 -->

| Pegel | Befehl [ Registeroffset 0x03F0, bit5:0] |
|---|---|
| 6'b000000: | io -4 0xfed883f0 0x00 |
| 6'b000001: | io -4 0xfed883f0 0x01 |
| ... | ... |
| 4'b111110: | io -4 0xfed883f0 0x3e |
| 4'b111111: | io -4 0xfed883f0 0x3f |

#### 2.4.2 PLL-SSC-Modulationsfrequenz

Der Standardwert ist `0x0f`, bei HBR3 dagegen `0x3c`. HBR3 erfordert eine Linksverschiebung um zwei Bits. Die Offsetliste der Quelle weicht von der Befehlstabelle ab; beide sind nachfolgend beibehalten und müssen vor der Verwendung überprüft werden.

```text
RBR: 0x0404[4:0]
HBR: 0x0408[4:0]
HBR2: 0x040c[4:0]
HBR3: 0x0410[6:2] (default=0x3c)
```

<!-- Source PDF page 10 -->

| Pegel | Befehl [ Registeroffset 0x0400, bit4:0] |
|---|---|
| 5'b00000: | io -4 0xfed88400 0x00 (HBR3:io -4 0xfed88410 0x00) |
| 5'b00001: | io -4 0xfed88400 0x01 (HBR3:io -4 0xfed88410 0x04) |
| ... | ... |
| 5'b11110: | io -4 0xfed88400 0x1e (HBR3:io -4 0xfed88410 0x38) |
| 5'b11111: | io -4 0xfed88400 0x1f (HBR3:io -4 0xfed88410 0x3c) |

### 2.5 DP-TX-AUX-Amplitudensteuerung

Der Standardwert ist `0x36`; der Einstellbereich folgt.

```text
aux swing: 0x0024[6:3]
```

<!-- Source PDF page 11 -->

| Pegel | Befehl [ Registeroffset 0x0024, bit6:3] (bit[2:0] = 0x6(Standard)) |
|---|---|
| 4'b0000: 0 mVpp | io -4 0xfed88024 0x06 |
| 4'b0001: | io -4 0xfed88024 0x0e |
| 4'b0010: | io -4 0xfed88024 0x16 |
| 4'b0011: | io -4 0xfed88024 0x1e |
| 4'b0100: | io -4 0xfed88024 0x26 |
| 4'b0101: | io -4 0xfed88024 0x2e |
| 4'b0110: | io -4 0xfed88024 0x36 |
| 4'b0111: 390 mVpp | io -4 0xfed88024 0x3e |
| 4'b1000: | io -4 0xfed88024 0x46 |
| 4'b1001: | io -4 0xfed88024 0x4e |
| 4'b1010: | io -4 0xfed88024 0x56 |
| 4'b1011: | io -4 0xfed88024 0x5e |
| 4'b1100: | io -4 0xfed88024 0x66 |
| 4'b1101: | io -4 0xfed88024 0x6e |
| 4'b1110: | io -4 0xfed88024 0x76 |
| 4'b1111: 880 mVpp | io -4 0xfed88024 0x7e |

## 3. Anpassen der Treiberkonfigurationsparameter

Kerneltreiber: `drivers/phy/rockchip/phy-rockchip-usbdp.c`. U-Boot-Treiber: `drivers/phy/phy-rockchip-usbdp.c`. Die Register zur Steuerung von Spannungshub und Preemphasis werden wie folgt dargestellt:

```text
struct dp_tx_drv_ctrl {
    u32 trsv_reg0204;
    u32 trsv_reg0205;
    u32 trsv_reg0206;
    u32 trsv_reg0207;
};
```

Es folgen die Registeroffsets für jede Lane. Die Quelle wiederholt `trsv_reg0206` in den letzten beiden Überschriften; dies bleibt erhalten und ist in den Hinweisen dokumentiert.

<!-- Source PDF page 12 -->

|  | trsv_reg0204 | trsv_reg0205 | trsv_reg0206 | trsv_reg0206 |
|---|---|---|---|---|
| lane0 | 0x0810 | 0x0814 | 0x0818 | 0x081C |
| lane1 | 0x1010 | 0x1014 | 0x1018 | 0x101C |
| lane2 | 0x1810 | 0x1814 | 0x1818 | 0x181C |
| lane3 | 0x2010 | 0x2014 | 0x2018 | 0x201C |

DP-Verbindungsraten haben vier Stufen: RBR, HBR, HBR2 und HBR3. Die folgenden Arrays konfigurieren Spannungshub und Preemphasis. Für einen Standard-DP-Anschluss:

<!-- Source PDF page 12 -->

|  | RK3576 Konfiguration | RK3588 Konfiguration |
|---|---|---|
| RBR | rk3588_dp_tx_drv_ctrl_rbr_hbr_typec | rk3588_dp_tx_drv_ctrl_rbr_hbr |
| HBR | rk3588_dp_tx_drv_ctrl_rbr_hbr_typec | rk3588_dp_tx_drv_ctrl_rbr_hbr |
| HBR2 | rk3588_dp_tx_drv_ctrl_hbr2 | rk3588_dp_tx_drv_ctrl_hbr2 |
| HBR3 | rk3588_dp_tx_drv_ctrl_hbr3 | rk3588_dp_tx_drv_ctrl_hbr3 |

Für die Type-C-Ausgabe:

<!-- Source PDF page 12 -->

|  | RK3576 Konfiguration | RK3588 Konfiguration |
|---|---|---|
| RBR | rk3588_dp_tx_drv_ctrl_rbr_hbr_typec | rk3588_dp_tx_drv_ctrl_rbr_hbr_typec |
| HBR | rk3588_dp_tx_drv_ctrl_rbr_hbr_typec | rk3588_dp_tx_drv_ctrl_rbr_hbr_typec |
| HBR2 | rk3588_dp_tx_drv_ctrl_hbr2 | rk3588_dp_tx_drv_ctrl_hbr2 |
| HBR3 | rk3588_dp_tx_drv_ctrl_hbr3 | rk3588_dp_tx_drv_ctrl_hbr3 |

Jedes Array hat die Größe 4×4 und speichert Registereinstellungen für Kombinationen von Spannungshub- und Preemphasis-Stufen. SSC wird hier konfiguriert:

```text
static const struct reg_sequence rk3588_udphy_24m_refclk_cfg[] = {
    ......
    {0x03f0, 0x0a}, {0x03f4, 0x07},
    {0x03f8, 0x07}, {0x03fc, 0x0c},
    {0x0404, 0x12}, {0x0408, 0x1a},
    {0x040c, 0x1a}, {0x0410, 0x3f},
    ......
};
```

Die AUX-Amplitude wird hier konfiguriert:

```text
static const struct reg_sequence rk3588_udphy_init_sequence[] = {
    ......
    {0x0024, 0x6e},
};
```

## Redaktionelle Hinweise und Nutzungseinschränkungen

Die Quelle schreibt in §2 `RK3756`, obwohl sie an anderen Stellen RK3576 nennt. Bitbreitenangaben wie `4'b001`, `4'b111110` und `5'b1000000` sowie die Zuordnung zwischen Preshoot-Pegeln und Registerwerten bleiben bis zur Überprüfung wie gedruckt erhalten. Die Überschriften der Flankensteilheitstabellen nennen `0x081c, bit 7:5`, während der Text `0x0820[5:3]` aufführt. Für die SSC-Modulationsfrequenz ist der RBR-Offset als `0x0404` angegeben, die Befehle verwenden jedoch `0xfed88400`; auch die oberen HBR3-Werte erscheinen mit der Anweisung zur Verschiebung um zwei Bits unvereinbar. Korrekturen dürfen nicht geraten werden.

Die Sichtprüfung bestätigt, dass auf Seite 5 `io -4 0xfed888100x28` und auf Seite 8 `io -4 0xfed888200x70` ohne argumenttrennende Leerzeichen gedruckt sind. Dies sind Fehler der Quelle, keine Extraktionsfehler. Sie bleiben erhalten, werden aber nicht als ausführbare Befehle dargestellt. Registerschreibzugriffe können den aktiven DP-/USB-Betrieb beeinflussen; prüfen Sie Masken, gemeinsam verwendete Bits und den Treiberzustand in einer Testumgebung, die sich wiederherstellen lässt. [Detailliertes redaktionelles Protokoll](/docs/rockchip-dp-si-test/EDITORIAL-NOTES.md).

