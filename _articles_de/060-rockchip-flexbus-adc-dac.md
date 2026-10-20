---
title: "Rockchip-FLEXBUS-ADC/DAC-Anleitung: parallele Wandler, DMA und IIO"
description: "Rockchip-FLEXBUS-ADC/DAC-Anleitung zu parallelen Wandlern, DMA und IIO mit vollständigen technischen Abschnitten, Code, Parametern und Quellenhinweisen."
translation_key: "060-rockchip-flexbus-adc-dac"
slug: "060-rockchip-flexbus-adc-dac"
lang: "de"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["Rockchip", "FLEXBUS"]
keywords: "ArmSoM Rockchip rockchip-flexbus-adc-dac"
excerpt: "Rockchip-FLEXBUS-ADC/DAC-Anleitung zu parallelen Wandlern, DMA und IIO mit vollständigen technischen Abschnitten, Code, Parametern und Quellenhinweisen."
---

{% raw %}

# Rockchip-FLEXBUS-ADC/DAC-Anleitung: parallele Wandler, DMA und IIO

Dieser vollständige, quellenbasierte technische Artikel ist eine ArmSoM-Plattformreferenz. Geltungsbereich der Quelle: RK3576, Linux-Kernel 6.1. Prüfen Sie vor der Verwendung die konkrete Platine, den SoC, den SDK-/BSP-Zweig, die Pins und die Peripherie. Eine Hardwarevalidierung auf Platinenebene wurde nicht durchgeführt; eine Unterstützung auf allen ArmSoM-Platinen wird nicht vorausgesetzt. Ausgaben und Messungen sind Beispiele aus der Quelle, keine ArmSoM-Testergebnisse.

Die chinesische Fassung folgt der chinesischen Quelle, die englische der englischen Quelle; die russische Fassung übersetzt deren vollständigen technischen Haupttext. Auch die deutsche Fassung folgt vollständig dem englischen Artikel. Code, Kommentare und Befehlsausgaben bleiben in ihrer Quellsprache. Der technische Haupttext der Quelle enthält keine eigenständigen technischen Abbildungen oder Tabellen; solche wurden nicht erfunden.

Beide Quellversionen sind V1.0.0.

**Vorsicht bei der Anwendung:** Reservierter Speicher, DMA, Pin-Multiplexing und Geräteschreibzugriffe beeinflussen die Hardware. Die Befehle werden zum Nachlesen bereitgestellt; es wurden keine Hardwareoperationen ausgeführt. Prüfen Sie Schaltplan, Stromversorgung, Timing und das konkrete Gerät. xxx oder Auslassungspunkte im DTS sind Platzhalter der Quelle, keine vollständige einsatzfähige Konfiguration.

**Unstimmigkeiten in der Quelle:** Der englische §2.3.1 nennt iio:device1, während sein Befehl und die chinesische Erläuterung iio:device2 verwenden. In beiden Quellen wechselt §2.3.2 zu device0, der anschließende Prompt zeigt jedoch device2. Diese ursprünglichen Werte bleiben erhalten. Identifizieren Sie den DAC vor Schreibzugriffen anhand seiner Datei name; übernehmen Sie Gerätenummern nicht ungeprüft.

Quellen und Korrekturen: [EDITORIAL-NOTES](/docs/rockchip-flexbus-adc-dac/EDITORIAL-NOTES.md). Offizielle Referenzen: [ArmSoM](https://docs.armsom.org/), [Rockchip Linux](https://github.com/rockchip-linux).

Produktversionstabelle der Quelle (PDF S. 2; Geltungsbereich der Quelle, keine Validierung auf Platinenebene):

| Chipsatz | Kernelversion |
| --- | --- |
| RK3576 | 6.1 |

<!-- Source EN PDF p.5, block 0 -->

## 1. FLEXBUS-ADC-Modus

<!-- Source EN PDF p.5, block 1 -->

### 1.1 Überblick

<!-- Source EN PDF p.5, block 2 -->

Im FLEXBUS-ADC-Modus verbindet FLEXBUS1 schnelle parallele ADC-Bausteine wie TI ADS6144 (https://www.ti.com/product/ADS6144) und ADI LTC2207 (https://www.analog.com/en/products/ltc2207.html). ADC-Bausteine mit Schnittstellen wie SPI und I2C werden nicht unterstützt.

<!-- Source EN PDF p.5, block 3 -->

Taktfrequenz bis 100MHz

<!-- Source EN PDF p.5, block 4 -->

Auflösung bis 16-Bit

<!-- Source EN PDF p.5, block 5 -->

### 1.2 Konfiguration

<!-- Source EN PDF p.5, block 6 -->

#### 1.2.1 Hardwarekonfiguration

<!-- Source EN PDF p.5, block 7 -->

Das LSB des ADC-Bausteins muss mit FLEXBUS1_D0 verbunden werden: beispielsweise ein 10-Bit-ADC mit FLEXBUS1_D[9:0] und ein 16-Bit-ADC mit FLEXBUS1_D[15:0].

<!-- Source EN PDF p.5, block 8 -->

Im Slave-Modus liefert der Baustein CLK an FLEXBUS1; im Master-Modus liefert FLEXBUS1 CLK an den Baustein.

<!-- Source EN PDF p.5, block 9 -->

#### 1.2.2 Kernelkonfiguration

<!-- Source EN PDF p.5, block 10 -->

Der FLEXBUS-ADC-Modus verwendet das Framework iio/adc.

<!-- Source EN PDF p.5, block 11 -->

`Device Drivers -> Multifunction device drivers -> Rockchip Flexbus`

<!-- Source EN PDF p.5, block 12 -->

`Device Drivers -> Industrial I/O support -> Analog to digital converters -> Rockchip Flexbus ADC opmode driver`

<!-- Source EN PDF p.5, block 13 -->

#### 1.2.3 dtsi-Konfiguration

<!-- Source EN PDF p.5, block 14 -->

Als Beispiel dienen die RK3576-Plattform und die Platine RK3576 TEST1 mit FLEXBUS1 für ADC.

<!-- Source EN PDF p.5, block 15 -->

In rk3576.dtsi:

<!-- Source EN PDF p.5, block 16 -->

```text
flexbus: flexbus@2a2f0000 {
    ......
    flexbus_adc: adc {
        compatible = "rockchip,flexbus-adc";
        #io-channel-cells = <0>;
        rockchip,slave-mode; // Configuring this is the slave mode, not configuring this is the master mode
        rockchip,free-sclk; // Configuring this is clock keeps output, not configuring this is clock follows data
        rockchip,auto-pad; // Default configuration
        rockchip,cpol; // Configuring this is CPOL = 1, not configuring this is 0
        rockchip,cpha; // Configuring this is CPHA = 1, not configuring this is 0
        rockchip,dfs = <16>; // data frames
        status = "disabled";
    };
    flexbus_dac: dac {
        ......
    };
};
```

<!-- Source EN PDF p.6, block 18 -->

rockchip,slave-mode: Ist diese Eigenschaft konfiguriert, gilt der Slave-Modus und der Baustein liefert CLK an FLEXBUS1. Ohne diese Eigenschaft gilt der Master-Modus und FLEXBUS1 liefert CLK an den Baustein.

<!-- Source EN PDF p.6, block 19 -->

rockchip,free-sclk: Ist diese Eigenschaft konfiguriert, wird der Takt kontinuierlich ausgegeben. Andernfalls folgt der Takt den Daten. Diese Konfiguration gilt nur im Master-Modus.

<!-- Source EN PDF p.6, block 20 -->

rockchip,cpol, rockchip,cpha: Entsprechen den Definitionen des SPI-Protokolls; konfigurieren Sie sie gemäß dem Timingdiagramm im Datenblatt des Bausteins.

<!-- Source EN PDF p.6, block 21 -->

rockchip,dfs: Datenrahmenbreite; unterstützt werden nur 4, 8 und 16. Beträgt die Auflösung des Bausteins nicht 4, 8 oder 16, muss aufgerundet werden. Bei ADC-Bausteinen mit 14-Bit-Auflösung muss rockchip,dfs beispielsweise auf 16 gesetzt werden; beim Empfang werden durch Softwareverarbeitung nur die 14bit-Daten extrahiert.

<!-- Source EN PDF p.6, block 22 -->

In arch/arm64/boot/dts/rockchip/rk3576-test1.dtsi:

<!-- Source EN PDF p.6, block 23 -->

```text
&flexbus {
    rockchip,flexbus0-opmode = <ROCKCHIP_FLEXBUS0_OPMODE_xxx>;
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
```

<!-- Source EN PDF p.7, block 24 -->

#### 1.2.4 Treiberdatei

<!-- Source EN PDF p.7, block 25 -->

Die Treiberdatei ist drivers/iio/adc/rockchip-flexbus-adc.c.

<!-- Source EN PDF p.7, block 26 -->

rockchip_flexbus_adc_read_block() liest Daten vom ADC-Baustein. Die wichtigsten Operationen sind:

<!-- Source EN PDF p.7, block 27 -->

(1) `rockchip_flexbus_writel(rkfb, FLEXBUS_RX_NUM, num_of_dfs);`

<!-- Source EN PDF p.7, block 28 -->

Konfiguriert die RX-Anzahl in dfs-Einheiten (rockchip,dfs im dtsi).

<!-- Source EN PDF p.7, block 29 -->

(2) `rockchip_flexbus_writel(rkfb, FLEXBUS_DMA_DST_ADDR0, (ulong)dst_phys >> 2);`

<!-- Source EN PDF p.7, block 30 -->

Konfiguriert die physische Adresse des dst-Puffers.

<!-- Source EN PDF p.7, block 31 -->

(3) `rockchip_flexbus_writel(rkfb, FLEXBUS_DMA_DST_LEN0, dst_len);`

<!-- Source EN PDF p.7, block 32 -->

Konfiguriert die Länge des dst-Puffers.

<!-- Source EN PDF p.7, block 33 -->

(4) `rockchip_flexbus_writel(rkfb, FLEXBUS_ENR, FLEXBUS_RX_ENR);`

<!-- Source EN PDF p.7, block 34 -->

Aktiviert die RX-Übertragung.

<!-- Source EN PDF p.7, block 35 -->

(5) `wait_for_completion_timeout(&rkfb_adc->completion, FLEXBUS_ADC_TIMEOUT)`

<!-- Source EN PDF p.7, block 36 -->

Wartet auf den Abschluss der RX-Übertragung und die Erzeugung eines Interrupts; der Interrupt-Handler ist rockchip_flexbus_adc_isr().

<!-- Source EN PDF p.7, block 37 -->

(6) `rockchip_flexbus_writel(rkfb, FLEXBUS_ENR, FLEXBUS_RX_DIS);`

<!-- Source EN PDF p.7, block 38 -->

Deaktiviert die RX-Übertragung.

<!-- Source EN PDF p.7, block 39 -->

### 1.3 Gängige Schnittstellen

<!-- Source EN PDF p.7, block 40 -->

#### 1.3.1 Ermitteln des zu FLEXBUS ADC gehörenden Geräts

<!-- Source EN PDF p.7, block 41 -->

Beispielsweise:

<!-- Source EN PDF p.7, block 42 -->

```text
root@rk3576-buildroot:/# cat /sys/bus/iio/devices/iio\:device0/name
2a2f0000.flexbus:adc
```

<!-- Source EN PDF p.7, block 43 -->

FLEXBUS ADC entspricht iio:device0.

<!-- Source EN PDF p.7, block 44 -->

#### 1.3.2 Auslesen des ADC-Werts

<!-- Source EN PDF p.7, block 45 -->

```text
root@rk3576-buildroot:/# cd /sys/bus/iio/devices/iio\:device0
root@rk3576-buildroot:/sys/bus/iio/devices/iio:device0# cat in_voltage_raw
33004
```

<!-- Source EN PDF p.8, block 46 -->

#### 1.3.3 Auslesen und Ändern der Taktfrequenz

<!-- Source EN PDF p.8, block 47 -->

Taktfrequenz auslesen:

<!-- Source EN PDF p.8, block 48 -->

```text
root@rk3576-buildroot:/# cd /sys/bus/iio/devices/iio\:device0
root@rk3576-buildroot:/sys/bus/iio/devices/iio:device0# cat in_voltage_sampling_frequency
99000000
```

<!-- Source EN PDF p.8, block 49 -->

Die aktuelle Taktfrequenz beträgt 99MHz.

<!-- Source EN PDF p.8, block 50 -->

Taktfrequenz ändern:

<!-- Source EN PDF p.8, block 51 -->

```text
root@rk3576-buildroot:/sys/bus/iio/devices/iio:device0# echo 25000000 > in_voltage_sampling_frequency
```

<!-- Source EN PDF p.8, block 52 -->

Die Taktfrequenz wird auf 25MHz geändert.

<!-- Source EN PDF p.8, block 53 -->

Hinweis:

<!-- Source EN PDF p.8, block 54 -->

Nur der Master-Modus unterstützt das Auslesen und Ändern der Taktfrequenz. Im Slave-Modus stammt CLK vom ADC-Baustein.

<!-- Source EN PDF p.8, block 55 -->

Taktfrequenz bis 100MHz

<!-- Source EN PDF p.8, block 56 -->

## 2. FLEXBUS-DAC-Modus

<!-- Source EN PDF p.8, block 57 -->

### 2.1 Überblick

<!-- Source EN PDF p.8, block 58 -->

Im FLEXBUS-DAC-Modus verbindet FLEXBUS0 schnelle parallele DAC-Bausteine wie ADI max5885 (https://www.analog.com/en/products/max5885.html) und ADI AD9744 (https://www.analog.com/en/products/ad9744.html). DAC-Bausteine mit Schnittstellen wie SPI und I2C werden nicht unterstützt.

<!-- Source EN PDF p.8, block 59 -->

Taktfrequenz bis 100MHz

<!-- Source EN PDF p.8, block 60 -->

Auflösung bis 16-Bit

<!-- Source EN PDF p.8, block 61 -->

### 2.2 Konfiguration

<!-- Source EN PDF p.8, block 62 -->

#### 2.2.1 Hardwarekonfiguration

<!-- Source EN PDF p.8, block 63 -->

Das LSB des DAC-Bausteins muss mit FLEXBUS0_D0 verbunden werden: beispielsweise ein 10-Bit-DAC mit FLEXBUS0_D[9:0] und ein 16-Bit-DAC mit FLEXBUS0_D[15:0].

<!-- Source EN PDF p.9, block 64 -->

#### 2.2.2 Kernelkonfiguration

<!-- Source EN PDF p.9, block 65 -->

Der FLEXBUS-DAC-Modus verwendet das Framework iio/dac.

<!-- Source EN PDF p.9, block 66 -->

`Device Drivers -> Multifunction device drivers -> Rockchip Flexbus`

<!-- Source EN PDF p.9, block 67 -->

`Device Drivers -> Industrial I/O support -> Digital to analog converters -> Rockchip Flexbus DAC opmode driver`

<!-- Source EN PDF p.9, block 68 -->

#### 2.2.3 dtsi-Konfiguration

<!-- Source EN PDF p.9, block 69 -->

Als Beispiel dienen die RK3576-Plattform und die Platine RK3576 TEST1 mit FLEXBUS0 für DAC.

<!-- Source EN PDF p.9, block 70 -->

In rk3576.dtsi:

<!-- Source EN PDF p.9, block 71 -->

```text
flexbus: flexbus@2a2f0000 {
    ......
    flexbus_adc: adc {
        ......
    };
    flexbus_dac: dac {
        compatible = "rockchip,flexbus-dac";
        #io-channel-cells = <0>;
        rockchip,free-sclk; // Configuring this is clock keeps output, not configuring this is clock follows data
        rockchip,cpol; // Configuring this is CPOL = 1, not configuring this is 0
        rockchip,cpha; // Configuring this is CPHA = 1, not configuring this is 0
        rockchip,dfs = <16>; // data frames
        status = "disabled";
    };
};
```

<!-- Source EN PDF p.9, block 72 -->

rockchip,free-sclk: Ist diese Eigenschaft konfiguriert, wird der Takt kontinuierlich ausgegeben. Andernfalls folgt der Takt den Daten.

<!-- Source EN PDF p.9, block 73 -->

rockchip,cpol, rockchip,cpha: Entsprechen den Definitionen des SPI-Protokolls; konfigurieren Sie sie gemäß dem Timingdiagramm im Datenblatt des Bausteins.

<!-- Source EN PDF p.9, block 74 -->

rockchip,dfs: Datenrahmenbreite; unterstützt werden nur 4, 8 und 16. Beträgt die Auflösung des Bausteins nicht 4, 8 oder 16, muss aufgerundet werden. Bei DAC-Bausteinen mit 14-Bit-Auflösung muss rockchip,dfs beispielsweise auf 16 gesetzt werden; bit15 und bit14 der gesendeten Daten werden durch 0 ersetzt.

<!-- Source EN PDF p.9, block 75 -->

In arch/arm64/boot/dts/rockchip/rk3576-test1.dtsi:

<!-- Source EN PDF p.9, block 76 -->

```text
&flexbus {
    rockchip,flexbus0-opmode = <ROCKCHIP_FLEXBUS0_OPMODE_DAC>; // FLEXBUS0 selects DAC mode
    rockchip,flexbus1-opmode = <ROCKCHIP_FLEXBUS1_OPMODE_xxx>;
    status = "okay"; // Enable FLEXBUS
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

<!-- Source EN PDF p.10, block 78 -->

#### 2.2.4 Treiberdatei

<!-- Source EN PDF p.10, block 79 -->

Die Treiberdatei ist drivers/iio/dac/rockchip-flexbus-dac.c.

<!-- Source EN PDF p.10, block 80 -->

rockchip_flexbus_dac_write_block() sendet Daten an den DAC-Baustein. Die wichtigsten Operationen sind:

<!-- Source EN PDF p.10, block 81 -->

(1) `rockchip_flexbus_writel(rkfb, FLEXBUS_TX_NUM, num_of_dfs);`

<!-- Source EN PDF p.10, block 82 -->

Konfiguriert die TX-Anzahl in dfs-Einheiten (rockchip,dfs im dtsi).

<!-- Source EN PDF p.10, block 83 -->

(2) `rockchip_flexbus_writel(rkfb, FLEXBUS_TXWAT_START, val);`

<!-- Source EN PDF p.10, block 84 -->

Konfiguriert den Füllstandsschwellwert.

<!-- Source EN PDF p.10, block 85 -->

(3) `rockchip_flexbus_writel(rkfb, FLEXBUS_DMA_SRC_ADDR0, (ulong)src_phys >> 2);`

<!-- Source EN PDF p.10, block 86 -->

Konfiguriert die physische Adresse des src-Puffers.

<!-- Source EN PDF p.10, block 87 -->

(4) `rockchip_flexbus_writel(rkfb, FLEXBUS_DMA_SRC_LEN0, src_len);`

<!-- Source EN PDF p.10, block 88 -->

Konfiguriert die Länge des src-Puffers.

<!-- Source EN PDF p.10, block 89 -->

(5) `rockchip_flexbus_writel(rkfb, FLEXBUS_ENR, FLEXBUS_TX_ENR);`

<!-- Source EN PDF p.10, block 90 -->

Aktiviert die TX-Übertragung.

<!-- Source EN PDF p.10, block 91 -->

(6) `wait_for_completion_timeout(&rkfb_dac->completion, FLEXBUS_DAC_TIMEOUT)`

<!-- Source EN PDF p.10, block 92 -->

Wartet auf den Abschluss der TX-Übertragung und die Erzeugung eines Interrupts; der Interrupt-Handler ist rockchip_flexbus_dac_isr().

<!-- Source EN PDF p.10, block 93 -->

(7) `rockchip_flexbus_writel(rkfb, FLEXBUS_ENR, FLEXBUS_TX_DIS);`

<!-- Source EN PDF p.10, block 94 -->

Deaktiviert die TX-Übertragung.

<!-- Source EN PDF p.10, block 95 -->

### 2.3 Gängige Schnittstellen

<!-- Source EN PDF p.10, block 96 -->

#### 2.3.1 Ermitteln des zu FLEXBUS DAC gehörenden Geräts

<!-- Source EN PDF p.10, block 97 -->

Beispielsweise:

<!-- Source EN PDF p.10, block 98 -->

```text
root@rk3576-buildroot:/# cat /sys/bus/iio/devices/iio\:device2/name
2a2f0000.flexbus:dac
```

<!-- Source EN PDF p.11, block 99 -->

FLEXBUS DAC entspricht iio:device1.

<!-- Source EN PDF p.11, block 100 -->

#### 2.3.2 Senden von Daten an den DAC

<!-- Source EN PDF p.11, block 101 -->

```text
root@rk3576-buildroot:/# cd /sys/bus/iio/devices/iio\:device0
root@rk3576-buildroot:/sys/bus/iio/devices/iio:device2# echo 16383 > out_voltage_raw
```

<!-- Source EN PDF p.11, block 102 -->

#### 2.3.3 Auslesen und Ändern der Taktfrequenz

<!-- Source EN PDF p.11, block 103 -->

Taktfrequenz auslesen:

<!-- Source EN PDF p.11, block 104 -->

```text
root@rk3576-buildroot:/# cd /sys/bus/iio/devices/iio\:device2
root@rk3576-buildroot:/sys/bus/iio/devices/iio:device2# cat out_voltage_sampling_frequency
99000000
```

<!-- Source EN PDF p.11, block 105 -->

Die aktuelle Taktfrequenz beträgt 99MHz.

<!-- Source EN PDF p.11, block 106 -->

Taktfrequenz ändern:

<!-- Source EN PDF p.11, block 107 -->

```text
root@rk3576-buildroot:/sys/bus/iio/devices/iio:device2# echo 25000000 > out_voltage_sampling_frequency
```

<!-- Source EN PDF p.11, block 108 -->

Die Taktfrequenz wird auf 25MHz geändert.

<!-- Source EN PDF p.11, block 109 -->

Hinweis:

<!-- Source EN PDF p.11, block 110 -->

Taktfrequenz bis 100MHz

{% endraw %}

