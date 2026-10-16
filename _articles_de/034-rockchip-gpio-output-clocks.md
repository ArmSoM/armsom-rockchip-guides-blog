---
title: "Rockchip-Taktausgabe über GPIO: Pinzuordnung, DTS und Testverfahren"
description: "Referenz zur Rockchip-GPIO-Taktausgabe: Pinmux, unterstützte Taktfrequenzen, DTS-Konfiguration und SoC-spezifische Testbeispiele."
translation_key: "034-rockchip-gpio-output-clocks"
slug: "034-rockchip-gpio-output-clocks"
lang: "de"
date: "2026-10-15"
author: "ArmSoM-Redaktion · Rockchip-Quelldokumentation"
category: "hardware"
products: ["Sige7", "Sige5", "CM5", "AIM7", "AIM5"]
tags: ["Rockchip", "GPIO", "clock output", "pinmux", "DTS"]
keywords: "ArmSoM Rockchip GPIO output clock pinmux RK3588 RK3576"
excerpt: "SoC-spezifische Pinzuordnung für GPIO-Taktausgänge, DTS-Muster und sichere Validierungsschritte."
---

# Rockchip-Taktausgabe über GPIO: Pinzuordnung, DTS und Testverfahren

Diese Referenz basiert auf *Rockchip Gpio Output Clocks*, V1.4.0 (2025-04-16). Sie dokumentiert RK3399, RK1808, RK3328, RK3308, RV1126, PX30, RK3566/RK3568, RK3588, RK3528, RK3576, RK2118 und RV1126B/RV1126B-P. Prüfen Sie vor dem Aktivieren eines Ausgangs Boardschaltplan, Anschlussrouting, IO-Spannungsdomäne, Pinbelegung, veröffentlichtes BSP und Ziel-SoC-TRM. Es liegen für diesen Artikel keine ArmSoM-Messungen zu Signalform, Signalintegrität oder Peripheriekompatibilität vor.

Die englische Quelle umfasst 29 Seiten und enthält keine separat extrahierbaren Abbildungen. Rechtliche Hinweise und Kontaktdaten vom Deckblatt, Zielgruppenabschnitt und Versionshistorie wurden weggelassen. [Redaktionelle Hinweise](/docs/rockchip-gpio-output-clocks/EDITORIAL-NOTES.md).

## 1. Zweck der GPIO-Taktausgabe

Ein SoC-IO kann einen internen Referenztakt ausgeben, um einen externen Oszillator zu ersetzen und Peripherieschaltungen zu vereinfachen. Dafür müssen drei Bedingungen erfüllt sein:

1. Das IOMUX des gewählten Pins unterstützt die gewünschte Taktausgabefunktion.
2. Taktquelle und Frequenz sind für den vorgesehenen Verbraucher konfiguriert.
3. IO-Treiberstärke und elektrischer Signalpfad auf dem Board ergeben eine geeignete Signalform.

Laut Quelle bietet der direkte 24-MHz-Quarzbypass die beste Signalqualität beim Ersatz eines 24-MHz-Quarzes. Ein PLL-Teilerausgang kann eine geringere Qualität aufweisen; seine Eignung hängt von den Referenztaktgrenzen der Peripherie ab. Bestimmen Sie die geeignete Treiberstärke durch Messungen auf dem tatsächlichen Board.

## 2. Hardwarezuordnung

| SoC | Taktname | GPIO | Unterstützte Frequenzen laut Quelle |
|---|---|---|---|
| RK3288 | `SCLK_TESTOUT` | GPIO0_C1 | 24 MHz, 32 kHz |
| RK3328 | `SCLK_TESTOUT` | GPIO1_A6 | 24 MHz, 32 kHz |
| PX30 | `SCLK_TEST_OUT` | GPIO1_D6 oder GPIO0_B5 | 24 MHz, 32 kHz |
| RK3308 | `SCLK_TESTOUT` | GPIO0_A4 | 24 MHz, 32 kHz |
| RV1108 | `SCLK_TESTOUT` | GPIO0_A6 | 24 MHz, 32 kHz |
| RV1126 | `SCLK_TESTOUT` | GPIO1_A4 | 24 MHz, 32 kHz |
| RK3368 | `SCLK_TESTOUT` | GPIO0_B0 | 24 MHz, 32 kHz |
| RK3399 | `SCLK_TESTOUT` | GPIO2_D1 oder GPIO0_B0 | 24 MHz, 32 kHz |
| RK3566/8 | `CLK_WIFI` | GPIO0_A0 | 24 MHz |
| RK3566/8 | `CLK_MAC0_OUT` | GPIO2_C1 | 24/25/50/125 MHz |
| RK3566/8 | `CLK_MAC1_OUT` | GPIO3_B0 oder GPIO4_B3 | 24/25/50/125 MHz |
| RK3566/8 | `CLK_CIF_OUT` | GPIO4_C0 | 24/27/37.125 MHz |
| RK3566/8 | `CLK_CAM0_OUT` | GPIO4_A7 | 24/27/37.125 MHz |
| RK3588 | `REFCLKOUT` | GPIO0_A0 | 24 MHz |
| RK3588 | `CLK_GMAC_50M` | GPIO4_C3 | 50/125 MHz |
| RK3588 | `REFCLK25M_ETH0` | GPIO4_B0 | 25/50 MHz |
| RK3588 | `CLK_DEEPSLOW` | GPIO2_C5 | 32 kHz |
| RK3588 | `CLK_MIPI_CAMARAOUT_M0..M4` | GPIO4_B1, GPIO1_B6/B7/D6/D7 | 24/27/37.125 MHz |
| RK3588 | `CLK_CIF_OUT` | GPIO4_B4 | 24/27/37.125 MHz |
| RK3588 | `REFCLK25M_ETH1` | GPIO3_A6 | 25/50 MHz |

| SoC | Takt/Ausgang | GPIO | Unterstützte Frequenzen laut Quelle |
|---|---|---|---|
| RK3528 | `CLK_REFOUT` | GPIO0_A1 oder GPIO3_C3 | 24 MHz |
| RK3528 | `CLK_DEEPSLOW` | GPIO3_C3 oder GPIO1_C3 | 32 kHz |
| RK3528 | `CLK_TESTOUT` | GPIO2_A5 | Abhängig von der Konfiguration |
| RK3576 | `REF_CLK0/1/2_OUT` | GPIO0_A0/B4/B5 | 12/24/27/37.125 MHz |
| RK3576 | `CLK_32K_OUT` | GPIO0_A2 | 32 kHz |
| RK3576 | `ETH_CLK0/1_25M_OUT` | GPIO3_A4/GPIO2_D7; GPIO2_D6/GPIO1_D5 | 25/27/50/125 MHz |
| RK3576 | `VI_CIF_CLKOUT` | GPIO3_A2 | 24/27/37.125 MHz |
| RK3576 | `CAM_CLK0/1/2_OUT` | GPIO3_D7/GPIO2_D2; GPIO4_A0/GPIO2_D6; GPIO4_A1/GPIO2_D7 | 24/25/26/27/37.125/50 MHz |
| RK3576 | `UFS_REFCLK` | GPIO4_D1 | 24/26 MHz |
| RK2118 | `REF_CLK0/1_OUT` | GPIO3_B1 / GPIO0_A3 | 24/24.576/40/49.152/50 MHz |
| RK2118 | `ETH_CLK_25M_OUT` | GPIO0_A2 | 25/50 MHz |
| RK2118 | `OSC_CLK_OUT` / `CLK_32K` | GPIO0_B3 / GPIO0_A4 | Quarzbypass / 32 kHz |
| RV1126B/P | `SAI0/1/2_MCLK` | GPIO7_A2/GPIO6_A4; GPIO1_B0/GPIO4_A3; GPIO3_B6/GPIO5_A3 | 12.288/24/24.576/49.152 MHz |
| RV1126B/P | `CAM_CLK0..3_OUT`, `VI_CIF_CLKOUT`, `ETH_CLK_25M_OUT` | Alternative Pins laut Quelle | 24/25/26/27/37.125/50 MHz |
| RV1126B/P | `CLK_32K_OUT` / `CLK_REFOUT` | GPIO0_A2 / GPIO0_A0 | 32 kHz / 24 MHz |

Dasselbe Pad kann in mehreren Zeilen erscheinen. Pinmux, Gehäuse und Boardrouting bestimmen die tatsächliche Funktion. Aktivieren Sie keine zwei alternativen Funktionen gleichzeitig.

## 3. DTS-Muster

Wählen Sie für die von der Quelle unterstützten programmierbaren Ausgänge pinctrl, binden Sie den vorgesehenen Takt ein, setzen Sie bei Bedarf einen Elternknoten und geben Sie die Frequenz an:

```dts
pinctrl-names = "default";
pinctrl-0 = <&test_clkout>;
assigned-clocks = <&cru SCLK_TESTOUT>;
assigned-clock-parents = <&xin24m>;
assigned-clock-rates = <24000000>;
clocks = <&cru SCLK_TESTOUT>;
clock-names = "soc_24M";
```

Die Kennung hängt vom SoC ab (`SCLK_TEST_OUT`, `SCLK_TESTCLKOUT1/2`, `CLK_WIFI`, `CLK_CIFOUT_OUT` oder ein Kamera-/Ethernet-Ausgang). Auch die pinctrl-Gruppe ist SoC- und boardspezifisch. Für RK3528 gilt besonders: `CLK_TESTOUT` ist für interne Selbsttests reserviert; `CLK_REFOUT` hat fest 24 MHz und lässt sich nur ein-/ausschalten; `CLK_DEEPSLOW` hat fest 32 kHz und unterstützt weder Ein-/Ausschalten noch Frequenzänderung. Dort ist nur pinctrl erforderlich.

## 4. Laufzeittestbeispiele

Verwenden Sie debugfs nur auf einem Entwicklungsimage und nach Prüfung des genannten Takts/Knotens und der Pinfunktion. Die Quellbeispiele sind SoC-spezifisch.

```sh
# RK3399: select 24 MHz and enable testout1, then pinmux GPIO2_D1
echo 24000000 > /sys/kernel/debug/clk/clk_testout1_pll_src/clk_rate
echo 24000000 > /sys/kernel/debug/clk/clk_testout1/clk_rate
echo 1 > /sys/kernel/debug/clk/clk_testout1/clk_enable_count
io -4 0xff77e004 0x000c0008

# RK3566/RK3568: 25 MHz MAC0 output
echo 25000000 > /sys/kernel/debug/clk/clk_mac0_out/clk_rate
echo 1 > /sys/kernel/debug/clk/clk_mac0_out/clk_enable_count
io -4 0xfdc60048 0x00070003

# RK3588: 50 MHz GMAC output, 6.1-style prepare-enable node
echo 50000000 > /sys/kernel/debug/clk/clk_gmac_50m/clk_rate
echo 1 > /sys/kernel/debug/clk/clk_gmac_50m/clk_prepare_enable
io -4 0xfd5f8090 0xf0001000

# RK3576: 50 MHz Ethernet reference output
echo 50000000 > /sys/kernel/debug/clk/refclko25m_gmac0_out/clk_rate
echo 1 > /sys/kernel/debug/clk/refclko25m_gmac0_out/clk_prepare_enable
io -4 0x26044064 0x000f0003
```

Weitere Quellbefehlsfolgen für RK3288, RK3328, PX30, RK3308, RV110X, RV1126, RK3368, RK3528, RK2118 und RV1126B/P verbleiben laut englischer Artikelvorlage im zugeordneten PDF-Bestand als SoC-spezifische Quellinformationen. Übernehmen Sie keinen `io -4`-Schreibzugriff auf einen anderen SoC: CRU-/GRF-Adressen, Schreibmasken und Feldaufteilung unterscheiden sich.

## 5. Hinweise zur BSP-Implementierung

Die Quelle ergänzt im jeweiligen Rockchip-Takttreiber eine Binding-ID, ein Array von Elternnamen und einen `GATE`-/`MUX`-/`COMPOSITE`-Zweig oder ein entsprechendes Konstrukt und referenziert den Takt anschließend in DTS. Ein beispielhaftes Muster lautet:

```c
PNAME(mux_sclk_testout_p) = { "xin24m", "armclk", /* SoC-specific parents */ };
COMPOSITE(SCLK_TESTOUT, "sclk_testout", mux_sclk_testout_p,
          CLK_SET_RATE_NO_REPARENT, /* target SoC registers and fields */);
```

Dieses Muster muss für den jeweiligen SoC vervollständigt werden. Verwenden Sie den genauen Patchabschnitt für die Ziel-Kernelgeneration samt Binding-Header und CRU-Treiber. Bei Unklarheiten zur DTS-Steuerung verweist die Quelle auf die pinctrl-Dokumentation. Ermitteln Sie bei RK3568-/RK3588-Designs mit vielen IOs zuerst die gültige Takt-IO-Zuordnung und folgen Sie dann dem SoC-Beispiel.

## 6. Prüfliste

1. Prüfen Sie, ob das Pad physisch herausgeführt ist, nicht von Boot-/Debug-/Speicherfunktionen verwendet wird und in einer passenden IO-Spannungsdomäne liegt.
2. Prüfen Sie, ob pinctrl die Taktfunktion und nicht die GPIO-Funktion desselben Pads auswählt.
3. Prüfen Sie vor der Messung Eltern, Frequenz und Aktivierungszustand in `clk_summary`.
4. Messen Sie Frequenz, Tastverhältnis, Amplitude und Startverhalten am Peripheriepin und zusätzlich bei Bedarf am SoC-Anschluss.
5. Prüfen Sie Toleranzen der nachgelagerten Peripherie sowie Suspend/Resume des Systems. Validieren Sie für Ethernet und Audio das Verhalten von Verbindung und Taktverriegelung unter Last.
