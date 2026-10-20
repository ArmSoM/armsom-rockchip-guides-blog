---
title: "Rockchip FLEXBUS FSPI: Anleitung für SPI-NOR-Flash, Kernel und DTS"
description: "Rockchip FLEXBUS FSPI für SPI-NOR-Flash, Kernel und DTS mit vollständigen technischen Abschnitten, Code, Parametern und Hinweisen zur Quelle."
translation_key: "061-rockchip-flexbus-fspi"
slug: "061-rockchip-flexbus-fspi"
lang: "de"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["Rockchip", "FLEXBUS"]
keywords: "ArmSoM Rockchip rockchip-flexbus-fspi"
excerpt: "Rockchip FLEXBUS FSPI für SPI-NOR-Flash, Kernel und DTS mit vollständigen technischen Abschnitten, Code, Parametern und Hinweisen zur Quelle."
---

{% raw %}

# Rockchip FLEXBUS FSPI: Anleitung für SPI-NOR-Flash, Kernel und DTS

Dieser vollständige, aus der Quelle aufbereitete technische Artikel dient als ArmSoM-Plattformreferenz. Geltungsbereich der Quelle: SoCs mit FLEXBUS-Unterstützung laut Quelle; die Board-Unterstützung ist noch zu prüfen, Linux-Kernel 6.1. Prüfen Sie vor der Nutzung das tatsächliche Board, den SoC, den SDK/BSP-Zweig, die Pins und die Peripherie. Es wurde keine Hardwareprüfung auf Board-Ebene durchgeführt; eine Unterstützung sämtlicher ArmSoM-Boards wird nicht behauptet. Ausgaben und Messungen sind Quellbeispiele, keine ArmSoM-Testergebnisse.

Chinesisch folgt der chinesischen Quelle, Englisch der englischen Quelle; Russisch und Deutsch übersetzen den englischen technischen Inhalt vollständig. Code, Kommentare und Befehlsausgaben bleiben in ihrer Quellsprache. Der technische Quelltext enthält keine eigenständigen technischen Abbildungen oder Tabellen; es wurden keine erfunden.

Beide Quellfassungen tragen die Version V1.0.0.

**Vorsicht bei der Ausführung:** Reservierter Speicher, DMA, Pin-Multiplexing und Schreibzugriffe auf Geräte wirken sich auf die Hardware aus. Die Befehle dienen der Dokumentation; es wurden keine Hardwareaktionen ausgeführt. Prüfen Sie Schaltplan, Versorgung, Timing und tatsächliches Gerät. Jedes xxx oder Auslassungszeichen im DTS ist ein Platzhalter der Quelle, keine vollständig nutzbare Konfiguration.

Quellen und Korrekturen: [Redaktionsprotokoll](/docs/rockchip-flexbus-fspi/EDITORIAL-NOTES.md). Offizielle Referenzen: [ArmSoM](https://docs.armsom.org/), [Rockchip Linux](https://github.com/rockchip-linux).

Produktversionstabelle der Quelle (PDF S.2; Geltungsbereich der Quelle, keine Prüfung auf Board-Ebene):

| Chipsatz | Kernel-Version |
| --- | --- |
| Alle SoCs mit FLEXBUS-Unterstützung | 6.1 |

<!-- Source EN PDF p.5, block 0 -->

## 1. FLEXBUS-FSPI-Modus

<!-- Source EN PDF p.5, block 1 -->

### 1.1 Überblick

<!-- Source EN PDF p.5, block 2 -->

Im FLEXBUS-FSPI-Modus werden entsprechende Funktionen durch Nachbildung von RK FSPI (Flexible Serial Peripheral Interface) mittels FLEXBUS umgesetzt, beispielsweise:

<!-- Source EN PDF p.5, block 3 -->

Ausgabe über eine Leitung und Eingabe über vier Leitungen, entsprechend der typischen Konfiguration des Linux-MTD-Treibers für Quad-SPI-Flash.

<!-- Source EN PDF p.5, block 4 -->

Wesentliches Merkmal:

<!-- Source EN PDF p.5, block 5 -->

Taktfrequenz bis 100MHz

<!-- Source EN PDF p.5, block 6 -->

### 1.2 Konfiguration

<!-- Source EN PDF p.5, block 7 -->

#### 1.2.1 Kernel-Konfiguration

<!-- Source EN PDF p.5, block 8 -->

Der FLEXBUS-FSPI-Modus wird durch einen Treiber des standardmäßigen SPI-Frameworks umgesetzt und implementiert ausschließlich die spi-mem-Struktur. Unterstützt werden externe SPI-Flash-Bausteine oder Peripheriegeräte mit spi-mem-Protokoll:

<!-- Source EN PDF p.5, block 9 -->

```text
CONFIG_SPI=y
CONFIG_SPI_ROCKCHIP_FLEXBUS_FSPI=y
```

<!-- Source EN PDF p.5, block 10 -->

#### 1.2.2 DTS-Konfiguration

<!-- Source EN PDF p.5, block 11 -->

Beispiel mit einem externen SPI-NOR-Flash-Untergerät:

<!-- Source EN PDF p.5, block 12 -->

```text
&flexbus {
    rockchip,flexbus0-opmode = <ROCKCHIP_FLEXBUS0_OPMODE_SPI>;
    rockchip,flexbus1-opmode = <ROCKCHIP_FLEXBUS1_OPMODE_NULL>;
    status = "okay";
};
&flexbus_fspi {
    pinctrl-names = "default";
    pinctrl-0 = <&flexbus0m1_pins &flexbus0_clk_pins
                 &flexbus0_d0_pins &flexbus0_d1_pins
                 &flexbus0_d2_pins &flexbus0_d3_pins>;
    status = "okay";
    flash@0 {
        compatible = "jedec,spi-nor";
        reg = <0>;
        spi-max-frequency = <100000000>;
        spi-rx-bus-width = <4>;
        spi-tx-bus-width = <1>;
    };
};
```

<!-- Source EN PDF p.6, block 14 -->

Erläuterung:

<!-- Source EN PDF p.6, block 15 -->

mode_bits ist SPI_RX_QUAD:

<!-- Source EN PDF p.6, block 16 -->

spi-rx-bus-width kann auf 4 konfiguriert werden.

<!-- Source EN PDF p.6, block 17 -->

Standardmäßig sind SPI-Modus 0 und MSB-Modus eingestellt. Die betreffenden DTS-Parameter sind nicht einstellbar; für die Weiterentwicklung ist das Controller-Handbuch heranzuziehen.

<!-- Source EN PDF p.6, block 18 -->

#### 1.2.3 Treiberdatei

<!-- Source EN PDF p.6, block 19 -->

Die Treiberdatei lautet drivers/spi/spi-rockchip-flexbus-fspi.c .

{% endraw %}
