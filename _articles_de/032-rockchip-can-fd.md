---
title: "Rockchip CAN FD: DTS, SocketCAN, BRS und TDC"
description: "Vollständiger Rockchip-CAN-FD-Leitfaden: RK3576-Treiber, Device Tree, SocketCAN-FD-Befehle, Fehlersuche, Bit-Timing und TDC-Einstellung anhand der Schleifenverzögerung."
translation_key: "032-rockchip-can-fd"
slug: "032-rockchip-can-fd"
lang: "de"
date: "2026-10-15"
author: "ArmSoM-Redaktion · Rockchip-Quelldokumentation"
category: "linux"
products: ["Sige5", "CM5", "AIM5"]
tags: ["CAN FD", "SocketCAN", "RK3576", "BRS", "TDC"]
keywords: "ArmSoM Rockchip CAN FD RK3576 SocketCAN BRS TDC"
excerpt: "Referenz zu RK3576-CAN-FD-Treiber, DTS, SocketCAN, BRS und TDC nach dem Rockchip CAN FD Developer Guide V1.3.0."
---

{% raw %}
# Rockchip CAN FD: DTS, SocketCAN, BRS und TDC

Diese Plattformreferenz gilt für die in der Quelle unterstützte Familie RK3576/RK3506/RV1126B. Bei ArmSoM kann sie für Sige5, CM5 und AIM5 (RK3576) relevant sein. Eine CAN-FD-Schnittstelle auf Boardebene muss jedoch gesondert nachgewiesen werden. Prüfen Sie Schaltplan, Transceiver, Pinmux, Abschlusswiderstände, Takt und das veröffentlichte BSP 6.1. Es wurden keine ArmSoM-Hardwaretests durchgeführt.

Quellgrundlage: *Rockchip CAN FD Developer Guide*, RK-KF-YF-162, V1.3.0, 2025-04-08. Die chinesische Quelle umfasst 9, die englische 11 Seiten; die englische Versionshistorie belegt eine separate Seite. Die technischen Inhalte sind aufeinander abgestimmt. Beide Dateien enthalten keine eigenständigen technischen Abbildungen. Deckblatt, rechtliche Hinweise, Zielgruppenabschnitt und Versionshistorie wurden weggelassen. [Redaktionelle Hinweise](/docs/rockchip-can-fd/EDITORIAL-NOTES.md).

## 1. CAN-FD-Treiber

### 1.1 Treiberdatei und DTS

```text
drivers/net/can/rockchip/rk3576_canfd.c
```

```dts
interrupts = <GIC_SPI 121 IRQ_TYPE_LEVEL_HIGH>;
clocks = <&cru CLK_CAN0>, <&cru HCLK_CAN0>;
clock-names = "baudclk", "apb_pclk";
resets = <&cru SRST_CAN0>, <&cru SRST_H_CAN0>;
reset-names = "can", "can-apb";

&can0 {
    assigned-clocks = <&cru CLK_CAN0>;
    assigned-clock-rates = <200000000>;
    pinctrl-names = "default";
    pinctrl-0 = <&can0m0_pins>;
    status = "okay";
};
```

Laut Quelle folgt der Interrupt auf den Abschluss der Konvertierung. Die Clock-Eigenschaften steuern die Takte; die Reset-Eigenschaften setzen den Bus zurück. Stellen Sie das CAN-H-/CAN-L-IOMUX auf CAN ein.

```dts
&can0 { rockchip,rx-max-data = <4>; };
&can0 { rockchip,auto-retx-cnt = <100>; };
&can0 {
    dmas = <&dmac0 20>;
    dma-names = "rx";
};
```

Bei klassischen CAN-Frames ermöglicht `<4>` eine RX-Byte-Unterstützung von 8 und 64 RX-FIFO-Einträge. CAN-FD-Frames können `<18>` verwenden (RX-Byte-Unterstützung 64) und erhalten 14 FIFO-Frames. Ohne Angabe sind TX-Wiederholungen unbegrenzt; `1` bis `0xffff` begrenzt sie. RX-DMA ist optional; entfernen Sie zum Deaktivieren beide DMA-Eigenschaften.

### 1.2 Kernel und Testwerkzeuge

```text
+CONFIG_CAN=y
+CONFIG_CANFD_RK3576=y
BR2_PACKAGE_CAN_UTILS=y
BR2_PACKAGE_IPROUTE2=y
```

`canutils` enthält `canconfig`, `candump`, `canecho`, `cansend` und `cansequence`. Verwenden Sie das vollständige `iproute2` statt BusyBox-`ip`.

### 1.3 Konfigurieren, senden und empfangen

```sh
ifconfig -a
ip link set can0 down
ip link set can0 type can bitrate 1000000 dbitrate 3000000 fd on
ip -details link show can0
ip link set can0 up

# CAN FD standard and extended data frames
cansend can0 123##1DEADBEEF
cansend can0 00000123##1DEADBEEF
candump can0 &
```

Die erste Bitrate gilt für die Arbitrierungsphase (hier 1 Mbit/s); `dbitrate` gilt für die Datenphase (hier 3 Mbit/s).

### 1.4 Gebräuchliche CAN-/CAN-FD-Befehle

```sh
ip link set can0 down
ip link set can0 type can bitrate 500000 sample-point 0.8 dbitrate 2000000 dsample-point 0.8 fd on
ip -details -statistics link show can0
ip link set can0 up
echo 4096 > /sys/class/net/can0/tx_queue_len
candump can0 &

# Classic CAN: extended, standard, remote-standard, remote-extended
cangen can0 -g 1 -e -I i -L i -D r
cangen can0 -g 1 -I i -L i -D r
cangen can0 -g 1 -R -I i -L i -D r
cangen can0 -g 1 -e -R -I i -L i -D r

# CAN FD without bitrate switching: extended then standard
cangen can0 -g 1 -e -f -I i -L i -D i
cangen can0 -g 1 -e -f -I r -L i -D r
cangen can0 -g 1 -f -I i -L i -D i
cangen can0 -g 1 -f -I r -L i -D r

# CAN FD BRS: extended then standard
cangen can0 -g 1 -e -f -b -I i -L i -D i
cangen can0 -g 1 -e -f -b -I r -L i -D r
cangen can0 -g 1 -f -b -I i -L i -D i
cangen can0 -g 1 -f -b -I r -L i -D r
```

## 2. Fehlersuche

### 2.1 Senden oder Empfangen nicht möglich

```sh
ip link set can0 down
ip link set can0 type can bitrate 500000 sample-point 0.8 dbitrate 2000000 dsample-point 0.8 fd on loopback on
ip -details -statistics link show can0
ip link set can0 up
echo 4096 > /sys/class/net/can0/tx_queue_len
candump can0 &
```

Kann `candump` im Loopback einen gesendeten Frame empfangen, prüfen Sie IOMUX, Verkabelung, 120-Ohm-Abschluss und Transceiver. Prüfen Sie bei sporadischen Ausfällen mit `ip -details -statistics link show can0` die tatsächliche Bitrate und verwenden Sie im gesamten Netz übereinstimmende Abtastpunkte.

## 3. Bitrate und Abtastpunkt

```c
/* Use CiA recommended sample points */
if (bt->sample_point) {
    sample_point_nominal = bt->sample_point;
} else {
    if (bt->bitrate > 800000)
        sample_point_nominal = 750;
    else if (bt->bitrate > 500000)
        sample_point_nominal = 800;
    else
        sample_point_nominal = 875;
}
```

```text
BitRate = clk_can / (2 *(brq + 1) / ((tseg2 + 1) + (tseg1 + 1) + 1)
Sample = (1 + (tseg1 + 1)) / (1 + (tseg1 + 1) + (tseg2 + 1))
```

`brq`, `tseg1` und `tseg2` stehen im CAN-Register `BITTIMING` des Zielsystems. Prüfen Sie sämtliche Feldgrenzen im zugehörigen TRM/BSP.

## 4. Bitratenumschaltung und TDC

Die Quelle warnt vor möglicher Instabilität oberhalb von 5 Mbit/s. Messen Sie vor der TDC-Konfiguration die Schleifenverzögerung:

```sh
io -4 0x2ac00108 0x80
cansend 001#aaaaaaaa
io -4 0x2ac00110
```

Der aus `0x2ac00110` gelesene Wert ist die Schleifenverzögerung. Konfigurieren Sie anschließend TDC:

```sh
io -4 0x2ac00108 0x19
```

Setzen Sie `tdc_offset` auf die Hälfte der gemessenen Schleifenverzögerung und aktivieren Sie `tdc_enable`. Prüfen Sie das CANFD-Register `RKCAN_FD_TDC` im Ziel-TRM und übernehmen Sie den endgültigen Wert in die `tdc`-Konfiguration von `rk3576_canfd_set_bittiming()`. Halten Sie die Abtastpunkte in einem CAN-FD-Netz mit Bitratenumschaltung konsistent, da sonst der Empfang des BRS-Bits scheitern kann.

```sh
ip link set can0 type can bitrate 500000 sample-point 0.8 dbitrate 2000000 dsample-point 0.8 fd on
```
{% endraw %}
