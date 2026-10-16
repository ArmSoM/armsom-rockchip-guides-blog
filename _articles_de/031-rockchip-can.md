---
title: "Rockchip CAN: Treiber, Device Tree und SocketCAN"
description: "Vollständiger Rockchip-CAN-Leitfaden: Treiberauswahl, DTS-Eigenschaften, Kernelkonfiguration, SocketCAN-Befehle, Fehlersuche und Bit-Timing-Formeln."
translation_key: "031-rockchip-can"
slug: "031-rockchip-can"
lang: "de"
date: "2026-10-15"
author: "ArmSoM-Redaktion · Rockchip-Quelldokumentation"
category: "linux"
products: ["Sige7", "Sige5", "CM5", "AIM7", "AIM5"]
tags: ["CAN", "SocketCAN", "Device Tree", "Rockchip", "RK3576"]
keywords: "ArmSoM Rockchip CAN SocketCAN RK3576 RK3588 device tree"
excerpt: "Referenz zu Treiber, Device Tree, SocketCAN-Tests und Bit-Timing nach dem Rockchip CAN Developer Guide V1.3.0."
---

{% raw %}
# Rockchip CAN: Treiber, Device Tree und SocketCAN

Diese Plattformreferenz setzt voraus, dass CAN-Anschluss und Transceiver für das konkrete ArmSoM-Board geprüft werden. Sige7/AIM7 verwenden RK3588; Sige5/CM5/AIM5 verwenden RK3576. Gleichen Sie Schaltplan, Pinmux, Versorgungs- und Standbybeschaltung des Transceivers sowie das veröffentlichte BSP ab. Die Quelle nennt Kernel 5.10 für RK3588 und 6.1 für RK3576; eine bestimmte ArmSoM-Imageversion wird damit nicht zertifiziert. Es wurden keine ArmSoM-Hardwaretests durchgeführt.

Quellgrundlage: *Rockchip CAN Developer Guide*, RK-KF-YF-C44, V1.3.0, 2025-10-09. Die chinesische und englische Datei umfassen jeweils 9 Seiten und enthalten keine eigenständigen technischen Abbildungen; daher wurden keine Abbildungen extrahiert. Deckblatt, rechtliche Hinweise, Zielgruppenabschnitt und Versionshistorie wurden weggelassen. [Redaktionelle Hinweise](/docs/rockchip-can/EDITORIAL-NOTES.md).

## 1. CAN-Treiber

### 1.1 Treiberdateien

| SoC | Treiberdatei |
| --- | --- |
| RV1126/RV1109 | `drivers/net/can/rockchip/rockchip_can.c` |
| RK3568/RK3588 | `drivers/net/can/rockchip/rk3568_can.c` |
| RK3562 | `drivers/net/can/rockchip/rk3562_can.c` |
| RK3576/RK3506/RV1126B | `drivers/net/can/rockchip/rk3576_can.c` |

### 1.2 Konfiguration des DTS-Knotens

```dts
interrupts = <GIC_SPI 100 IRQ_TYPE_LEVEL_HIGH>;

assigned-clocks = <&cru CLK_CAN>;
assigned-clock-rates = <200000000>;
clocks = <&cru CLK_CAN>, <&cru PCLK_CAN>;
clock-names = "baudclk", "apb_pclk";

&can {
    pinctrl-names = "default";
    pinctrl-0 = <&canm0_pins>;
    status = "okay";
};
```

Der Interrupt wird laut Quelle nach Abschluss der Konvertierung ausgelöst. Für 1 Mbit/s empfiehlt die Quelle einen CAN-Takt von 300 MHz zur Verbesserung der Signalstabilität; unterhalb von 1 Mbit/s sind 200 MHz ausreichend. Wählen Sie nach Möglichkeit ein geradzahliges Vielfaches der Zielbitrate, damit sich diese genau durch Teilung erzeugen lässt.

Die Compatible-Zeichenfolgen lauten `"rockchip,can-1.0"` für RV1126/RV1109, `"rockchip,rk3568-can-2.0"` für RK3568, `"rockchip,can-2.0"` für RK3588, `"rockchip,rk3562-can"` für RK3562, `"rockchip,rk3576-can"` für RK3576/RK3506 und `"rockchip,rv1126b-can"` für RV1126B.

```dts
&can0 { rockchip,rx-max-data = <4>; };
&can0 { rockchip,auto-retx-cnt = <100>; };
&can0 {
    dmas = <&dmac0 20>;
    dma-names = "rx";
};
```

`rx-max-data = <4>` eignet sich für klassisches CAN (das RX-Byte-Feld unterstützt 8) und ergibt eine RX-FIFO-Tiefe von 64. Für CAN-FD-Frames verwendet die Quelle 18 (RX-Byte-Unterstützung 64), wodurch 14 FIFO-Frames verfügbar sind. Ohne `auto-retx-cnt` wird unbegrenzt wiederholt; `1` bis `0xffff` beendet die Wiederholung beim konfigurierten Grenzwert. RX-DMA ist optional: Entfernen Sie die DMA-Eigenschaften, wenn es nicht verwendet werden soll. RV1126B unterstützt DMA. Stellen Sie das CAN-H-/CAN-L-IOMUX auf die CAN-Funktion ein.

### 1.3 Kernelkonfiguration

Aktivieren Sie den Rockchip-CAN-Controller unter **Networking support → CAN bus subsystem support → CAN Device Drivers → Platform CAN drivers with Netlink support**. Die Quelle nennt:

```text
CONFIG_CAN_RK3562=y
CONFIG_CAN_RK3576=y
```

Die relevanten Kconfig-Abhängigkeiten lauten `NET=y && CAN=y && CAN_DEV=y && ARCH_ROCKCHIP=y`.

## 2. Testwerkzeuge für CAN-Kommunikation

`canutils` enthält `canconfig` (Schnittstellenbitrate/-modus), `candump` (Frames empfangen und hexadezimal ausgeben), `canecho` (empfangene Frames erneut senden), `cansend` (einen Frame senden) und `cansequence` (aufsteigende Werte senden und prüfen). Verwenden Sie das vollständige `ip` aus `iproute2`; BusyBox-`ip` unterstützt diese CAN-Operationen nicht. Aktivieren Sie für Buildroot:

```text
BR2_PACKAGE_CAN_UTILS=y
BR2_PACKAGE_IPROUTE2=y
```

## 3. Gebräuchliche Befehle

```sh
# List devices
ifconfig -a

# Stop, configure 500 kbit/s, inspect, then start
ip link set can0 down
ip link set can0 type can bitrate 500000
ip -details -statistics link show can0
ip link set can0 up

# Standard data / remote frames
cansend can0 123#DEADBEEF
cansend can0 123#R

# Extended data / remote frames
cansend can0 00000123#12345678
cansend can0 00000123#R

# Receive
candump can0
```

## 4. Fehlersuche

### 4.1 Senden oder Empfangen nicht möglich

Aktivieren Sie nach dem Start von CAN den Controller-Loopback und verwenden Sie die tatsächliche CAN-Basisadresse aus DTS.

```sh
io -4 0xfe580000 0x8415
```

Empfängt `candump` im Loopback einen anschließend mit `cansend` gesendeten Frame, arbeitet der Controller. Prüfen Sie danach IOMUX, Verkabelung, den 120-Ohm-Abschlusswiderstand und den Transceiver.

### 4.2 Sporadische Ausfälle

Prüfen Sie die tatsächlich berechnete Bitrate und passen Sie bei Abweichungen den Eingangstakt an:

```sh
ip -details -statistics link show can0
```

Verwenden Sie innerhalb desselben CAN-Netzes übereinstimmende Abtastpunkte, um die Stabilität zu verbessern.

## 5. Berechnung von Bitrate und Abtastpunkt

Der Treiber berechnet die Werte aus Eingangstakt und gewünschter Bitrate. Die Quelle verwendet folgende CiA-Empfehlung:

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

Die Felder `brq`, `tseg1` und `tseg2` stehen im CAN-Register `BITTIMING` des Ziel-SoC-TRM. Prüfen Sie vor BSP-Änderungen Formeln und Feldbreiten anhand des passenden Kernels und TRM.
{% endraw %}
