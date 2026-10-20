---
title: "Rockchip-FLEXBUS-Anleitung: Betriebsarten, Kernel- und DTS-Konfiguration"
description: "Rockchip-FLEXBUS-Anleitung zu Betriebsarten sowie Kernel- und DTS-Konfiguration mit vollständigen technischen Abschnitten, Code, Parametern und Quellenhinweisen."
translation_key: "059-rockchip-flexbus"
slug: "059-rockchip-flexbus"
lang: "de"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["Rockchip", "FLEXBUS"]
keywords: "ArmSoM Rockchip rockchip-flexbus"
excerpt: "Rockchip-FLEXBUS-Anleitung zu Betriebsarten sowie Kernel- und DTS-Konfiguration mit vollständigen technischen Abschnitten, Code, Parametern und Quellenhinweisen."
---

{% raw %}

# Rockchip-FLEXBUS-Anleitung: Betriebsarten, Kernel- und DTS-Konfiguration

Dieser vollständige, quellenbasierte technische Artikel ist eine ArmSoM-Plattformreferenz. Geltungsbereich der Quelle: RK3576, Linux-Kernel 6.1. Prüfen Sie vor der Verwendung die konkrete Platine, den SoC, den SDK-/BSP-Zweig, die Pins und die Peripherie. Eine Hardwarevalidierung auf Platinenebene wurde nicht durchgeführt; eine Unterstützung auf allen ArmSoM-Platinen wird nicht vorausgesetzt. Ausgaben und Messungen sind Beispiele aus der Quelle, keine ArmSoM-Testergebnisse.

Die chinesische Fassung folgt der chinesischen Quelle, die englische der englischen Quelle; die russische Fassung übersetzt deren vollständigen technischen Haupttext. Auch die deutsche Fassung folgt vollständig dem englischen Artikel. Code, Kommentare und Befehlsausgaben bleiben in ihrer Quellsprache. Der technische Haupttext der Quelle enthält keine eigenständigen technischen Abbildungen oder Tabellen; solche wurden nicht erfunden.

Beide Quellversionen sind V1.0.0.

**Vorsicht bei der Anwendung:** Reservierter Speicher, DMA, Pin-Multiplexing und Geräteschreibzugriffe beeinflussen die Hardware. Die Befehle werden zum Nachlesen bereitgestellt; es wurden keine Hardwareoperationen ausgeführt. Prüfen Sie Schaltplan, Stromversorgung, Timing und das konkrete Gerät. xxx oder Auslassungspunkte im DTS sind Platzhalter der Quelle, keine vollständige einsatzfähige Konfiguration.

Quellen und Korrekturen: [EDITORIAL-NOTES](/docs/rockchip-flexbus/EDITORIAL-NOTES.md). Offizielle Referenzen: [ArmSoM](https://docs.armsom.org/), [Rockchip Linux](https://github.com/rockchip-linux).

Produktversionstabelle der Quelle (PDF S. 2; Geltungsbereich der Quelle, keine Validierung auf Platinenebene):

| Chipsatz | Kernelversion |
| --- | --- |
| RK3576 | 6.1 |

<!-- Source EN PDF p.5, block 0 -->

## 1. Überblick über FLEXBUS

<!-- Source EN PDF p.5, block 1 -->

Das FLEXBUS-Modul besteht aus zwei Teilen: FLEXBUS0 und FLEXBUS1. FLEXBUS0 unterstützt TX; in einigen Betriebsarten wird auch TX mit anschließendem RX unterstützt. FLEXBUS1 unterstützt ausschließlich RX. FLEXBUS0 und FLEXBUS1 können jeweils nur ein Peripheriegerät anschließen. Sie können beide zusammen oder nur FLEXBUS0 beziehungsweise nur FLEXBUS1 verwenden.

<!-- Source EN PDF p.5, block 2 -->

FLEXBUS0 unterstützt folgende Betriebsarten:

<!-- Source EN PDF p.5, block 3 -->

1\. Schneller paralleler DAC (kurz DAC)

<!-- Source EN PDF p.5, block 4 -->

2\. Emulation des SPI-Protokolls, hauptsächlich für Single-/Quad-SPI-Übertragung; unterstützt externen SPI-Flash und QSPI-Displays

<!-- Source EN PDF p.5, block 5 -->

FLEXBUS1 unterstützt folgende Betriebsarten:

<!-- Source EN PDF p.5, block 6 -->

1\. Schneller paralleler ADC (kurz ADC)

<!-- Source EN PDF p.5, block 7 -->

2\. DVP

<!-- Source EN PDF p.5, block 8 -->

FLEXBUS0 und FLEXBUS1 besitzen jeweils 1 CLK-Pin, 1 CSn-Pin und 16 Datenpins. Welche Pins tatsächlich verwendet werden können, hängt von den Einschränkungen der Plattform und der IOMUX-Konfiguration ab.

<!-- Source EN PDF p.5, block 9 -->

## 2. Verwendung von FLEXBUS

<!-- Source EN PDF p.5, block 10 -->

### 2.1 Kernelkonfiguration

<!-- Source EN PDF p.5, block 11 -->

`Device Drivers -> Multifunction device drivers -> Rockchip Flexbus`

<!-- Source EN PDF p.5, block 12 -->

### 2.2 dtsi-Konfiguration

<!-- Source EN PDF p.5, block 13 -->

Als Beispiel dienen die RK3576-Plattform und die Platine RK3576 TEST1, mit FLEXBUS0 für DAC und FLEXBUS1 für ADC.

<!-- Source EN PDF p.5, block 14 -->

In rk3576.dtsi:

<!-- Source EN PDF p.5, block 15 -->

```text
flexbus: flexbus@2a2f0000 {
    compatible = "rockchip,rk3576-flexbus";
    reg = <0x0 0x2a2f0000 0x0 0x200>;
    interrupts = <GIC_SPI 369 IRQ_TYPE_LEVEL_HIGH>;
    clocks = <&cru CLK_HSGPIO_TX>, <&cru CLK_HSGPIO_RX>,
    <&cru ACLK_HSGPIO>, <&cru HCLK_HSGPIO>;
    clock-names = "tx_clk_flexbus", "rx_clk_flexbus",
    "aclk_flexbus", "hclk_flexbus";
    rockchip,grf = <&ioc_grf>; // GRF needs to be configured for FLEXBUS
    status = "disabled";
    flexbus_adc: adc {
        ......
    };
    flexbus_dac: dac {
        ......
    };
};
```

<!-- Source EN PDF p.6, block 17 -->

Passen Sie die Konfiguration der untergeordneten Knoten (beispielsweise flexbus_adc und flexbus_dac) an die benötigte Betriebsart an. Einzelheiten finden Sie in den Dokumenten zur jeweiligen Betriebsart. Andere Konfigurationen müssen normalerweise nicht geändert werden.

<!-- Source EN PDF p.6, block 18 -->

In arch/arm64/boot/dts/rockchip/rk3576-test1.dtsi:

<!-- Source EN PDF p.6, block 19 -->

```text
&flexbus {
    rockchip,flexbus0-opmode = <ROCKCHIP_FLEXBUS0_OPMODE_DAC>; // FLEXBUS0 selects DAC mode
    rockchip,flexbus1-opmode = <ROCKCHIP_FLEXBUS1_OPMODE_ADC>; // FLEXBUS1 selects ADC mode
    status = "okay"; // Enable FLEXBUS
};
&flexbus_adc {
    pinctrl-names = "default";
    pinctrl-0 = <&flexbus1m4_csn &flexbus1_clk
             &flexbus1_d0 &flexbus1_d1 &flexbus1_d2 &flexbus1_d3
             &flexbus1_d4 &flexbus1_d5 &flexbus1_d6 &flexbus1_d7
             &flexbus1_d8 &flexbus1_d9 &flexbus1_d10 &flexbus1_d11
             &flexbus1m1_d12 &flexbus1m1_d13 &flexbus1m1_d14 &flexbus1m1_d15>;
// Configure IOMUX for FLEXBUS1 ADC mode
    status = "okay"; // Enable ADC mode
};
&flexbus_dac {
    pinctrl-names = "default";
    pinctrl-0 = <&flexbus0m4_csn &flexbus0_clk
             &flexbus0_d0 &flexbus0_d1 &flexbus0_d2 &flexbus0_d3
             &flexbus0_d4 &flexbus0_d5 &flexbus0_d6 &flexbus0_d7
             &flexbus0_d8 &flexbus0_d9 &flexbus0_d10 &flexbus0_d11
             &flexbus0_d12 &flexbus0m0_d13 &flexbus0m0_d14 &flexbus0m0_d15>;
// Configure IOMUX for FLEXBUS0 DAC mode
    status = "okay"; // Enable DAC mode
};
```

<!-- Source EN PDF p.6, block 20 -->

Setzen Sie „rockchip,flexbus0-opmode“ und „rockchip,flexbus1-opmode“ auf die tatsächlich von FLEXBUS0 beziehungsweise FLEXBUS1 verwendeten Betriebsarten. Diese sind in include/dt-bindings/mfd/rockchip-flexbus.h definiert. Bei Nichtverwendung setzen Sie sie auf ROCKCHIP_FLEXBUS0_OPMODE_NULL beziehungsweise ROCKCHIP_FLEXBUS1_OPMODE_NULL.

<!-- Source EN PDF p.7, block 21 -->

### 2.3 Treiberdatei

<!-- Source EN PDF p.7, block 22 -->

Die Treiberdatei ist drivers/mfd/rockchip-flexbus.c. Sie enthält nur grundlegende Operationen wie Registerlesen/-schreiben und Initialisierung. Der Code für die einzelnen Betriebsarten befindet sich in den zugehörigen Frameworks. Beachten Sie die entsprechende Dokumentation zur jeweiligen Betriebsart.

{% endraw %}

