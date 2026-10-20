---
title: "Rockchip Linux GMAC: vollständiger Leitfaden zu PHY, MAC-Adresse, PTP und TX/RX-Debugging"
description: "Vollständige Referenz zu GMAC-/PHY-Treibern, DTS, Registern, MAC-Adressen, Loopback, RGMII, LEDs, WOL, Jumbo Frames, PTP und Fehleranalyse."
translation_key: "063-rockchip-linux-gmac"
slug: "063-rockchip-linux-gmac"
lang: "de"
date: "2026-10-18"
author: "ArmSoM-Redaktion · Rockchip-Quelldokumentation"
category: "storage"
products: []
tags: ["Rockchip", "GMAC", "Ethernet", "Linux"]
keywords: "ArmSoM Rockchip GMAC Ethernet RGMII RMII PHY"
excerpt: "Vollständige Referenz zu GMAC-/PHY-Treibern, DTS, Registern, MAC-Adressen, Loopback, RGMII, LEDs, WOL, Jumbo Frames, PTP und Fehleranalyse."
---

{% raw %}

# Rockchip Linux GMAC: vollständiger Leitfaden zu PHY, MAC-Adresse, PTP und TX/RX-Debugging

## Anwendbarkeit auf ArmSoM

Dies ist eine Rockchip-Plattformreferenz, kein ArmSoM-Hardwaretestbericht. Für eine Anpassung müssen Ethernet-Schnittstelle, PHY, Stromversorgung, Reset, IOMUX, Referenztakte und Ziel-SDK/BSP des jeweiligen Boards geprüft werden. Daraus folgt keine Unterstützung auf jedem ArmSoM-Board. Eine Hardwareprüfung wurde nicht durchgeführt. Alle Protokolle, Durchsatzwerte und Zeitmessungen sind Beispiele aus der Quelle und keine ArmSoM-Messungen.

Die Quelle behandelt Rockchip-Chips mit Linux 3.10 / 4.4 / 4.19. Beide PDFs haben Version V1.0.0 und 12 Seiten. Die chinesische Fassung folgt dem chinesischen Original, die englische dem englischen Original; Russisch und diese deutsche Fassung übersetzen den vollständigen englischen Text. Der nur im chinesischen Original vorhandene Abschnitt zu Hardware-Signaltests wird als eindeutig gekennzeichnete Ergänzung aufgenommen. Keine der Quellen enthält technische Abbildungen.

> Hinweise zur Quelle: Mehrere Kapitelverweise zu Takt/RGMII sind widersprüchlich; im Linux-3.10-Pfad steht driver/net statt drivers/net. Das Verhältnis zwischen MTU 9000 und ping -s 9000 muss geprüft werden. Die Link-Diagnose ist bezüglich des Trennens von MDC/MDIO und der direkten Verbindung mit einem PC mehrdeutig formuliert: Verbinden Sie auf dieser Grundlage keinesfalls MDC-/MDIO-Pins mit einem PC-Ethernet-Port. Die Originalangaben bleiben zur Überprüfung erhalten.

[Redaktionelle Hinweise](/docs/rockchip-linux-gmac/EDITORIAL-NOTES.md) · [ArmSoM-Dokumentation](https://docs.armsom.org/)

## Produktgeltungsbereich der Quelle

| Chipsatz | Kernel-Version |
| --- | --- |
| Rockchip | 3.10 / 4.4 / 4.19 |

<!-- source: EN PDF p3; unit 0 -->

## 1.   Codepfade

<!-- source: EN PDF p3; unit 1 -->

Der hardwarebezogene Treibercode des Ethernet-Moduls umfasst hauptsächlich GMAC und PHY. Üblicherweise wird ein generischer PHY-Treiber verwendet. Müssen spezielle Register geändert werden, verwenden Sie den passenden PHY-Treiber; dessen Code liegt in drivers/net/phy. Außerdem besitzen RK322x/RK3328 einen integrierten 100M-PHY.

<!-- source: EN PDF p3; unit 2 -->

GMAC-Treibercode für Linux 3.10: driver/net/ethernet/rockchip/gmac/*

<!-- source: EN PDF p3; unit 3 -->

Bei anderen Kernel-Versionen neuer als 3.10 liegt der GMAC-Treibercode unter:

<!-- source: EN PDF p3; unit 4 -->

drivers/net/ethernet/stmicro/stmmac/*

<!-- source: EN PDF p3; unit 5 -->

Treibercode des internen RK-EPHY: drivers/net/phy/rockchip.c

<!-- source: EN PDF p3; unit 6 -->

## 2.   DTS

<!-- source: EN PDF p3; unit 7 -->

Referenz für die DTS-Konfiguration:

<!-- source: EN PDF p3; unit 8 -->

Documentation/devicetree/bindings/net/rockchip-dwmac.txt

<!-- source: EN PDF p4; unit 9 -->

```text
gmac: ethernet@ff290000 {
      compatible = "rockchip,rk3288-gmac";
      reg = <0xff290000 0x10000>;

      interrupts = <GIC_SPI 27 IRQ_TYPE_LEVEL_HIGH>;
      interrupt-names = "macirq";
      rockchip,grf = <&grf>;
      clocks = <&cru SCLK_MAC>,
           <&cru SCLK_MAC_RX>, <&cru SCLK_MAC_TX>,
           <&cru SCLK_MACREF>, <&cru SCLK_MACREF_OUT>,
           <&cru ACLK_GMAC>, <&cru PCLK_GMAC>;
      clock-names = "stmmaceth",
           "mac_clk_rx", "mac_clk_tx",
           "clk_mac_ref", "clk_mac_refout",
           "aclk_mac", "pclk_mac";
      phy-mode = "rgmii";

      pinctrl-names = "default";
      pinctrl-0 = <&rgmii_pins /*&rmii_pins*/>;

      clock_in_out = "input";
      snps,reset-gpio = <&gpio4 7 0>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 10000 1000000>;

      assigned-clocks = <&cru SCLK_MAC>;
      assigned-clock-parents = <&ext_gmac>;
      tx_delay = <0x30>;
      rx_delay = <0x10>;


      status = "ok";
};
```

<!-- source: EN PDF p4; unit 10 -->

Bei der boardspezifischen Konfiguration sind folgende Punkte zu beachten:

<!-- source: EN PDF p4; unit 11 -->

phy-mode: Hauptsächlich wird zwischen RMII- und RGMII-Modus unterschieden.

<!-- source: EN PDF p4; unit 12 -->

snps,reset-gpio: Hardware-Reset-Pin des PHY.

<!-- source: EN PDF p4; unit 13 -->

snps,reset-delays-us: Reset-Timing des PHY. Die drei Zeitwerte entsprechen verschiedenen Reset-Phasen und unterscheiden sich je nach PHY. Bei Verwendung von snps,reset-active-low stehen sie für die Zeiten, während derer der Reset-Pin zunächst High, dann Low und anschließend wieder High ist. Bei snps,reset-active-high gilt die umgekehrte Pegelfolge.

<!-- source: EN PDF p4; unit 14 -->

phy-supply: Bei einer ständig anliegenden PHY-Versorgung ist keine Konfiguration nötig; andernfalls muss der entsprechende Regler konfiguriert werden.

<!-- source: EN PDF p4; unit 15 -->

Taktkonfiguration: Siehe Kapitel 3 dieses Dokuments.

<!-- source: EN PDF p4; unit 16 -->

pinctrl: Die Konfiguration unterscheidet sich zwischen RGMII und RMII. Auch bei Taktmodi ist die Treiberstärke eines Pins normalerweise unterschiedlich, wenn dieser als Taktausgang dient. Beispielsweise wird im RMII-Modus eine höhere Treiberstärke eingestellt, wenn ref_clock den Takt ausgibt.

<!-- source: EN PDF p4; unit 17 -->

tx_delay/rx_delay: Diese Eigenschaft muss im RGMII-Modus konfiguriert werden; siehe den Quellverweis auf Kapitel 8 zu RGMII Delayline.

<!-- source: EN PDF p5; unit 18 -->

Wegen der unterschiedlichen Konfigurationen je nach Chip und Betriebsmodus siehe auch Rockchip_Developer_Guide_Linux_GMAC_Mode_Configuration_EN.pdf.

<!-- source: EN PDF p5; unit 19 -->

## 3.   Debugging durch Lesen und Schreiben von PHY-Registern

<!-- source: EN PDF p5; unit 20 -->

Der Treiber stellt Schnittstellen zum Lesen und Schreiben von Registern bereit. Je nach Kernel-Version gibt es zwei Schnittstellensätze. Pfad: /sys/bus/mdio_bus/devices/stmmac-0:00; stmmac-0:00 bedeutet dabei PHY-Adresse 0.

<!-- source: EN PDF p5; unit 21 -->

### 3.1   Linux 3.10

<!-- source: EN PDF p5; unit 22 -->

```text
/sys/bus/mdio_bus/devices/stmmac-0:00/phy_reg
/sys/bus/mdio_bus/devices/stmmac-0:00/phy_regValue
```

<!-- source: EN PDF p5; unit 23 -->

Schreiben

<!-- source: EN PDF p5; unit 24 -->

Beispielsweise zum Schreiben von 0xabcd in Reg0:

<!-- source: EN PDF p5; unit 25 -->

```text
echo 0x00 > /sys/bus/mdio_bus/devices/stmmac-0:00/phy_reg
echo 0xabcd > /sys/bus/mdio_bus/devices/stmmac-0:00/phy_regValue
```

<!-- source: EN PDF p5; unit 26 -->

Lesen

<!-- source: EN PDF p5; unit 27 -->

Beispielsweise zum Lesen des Werts von Reg0:

<!-- source: EN PDF p5; unit 28 -->

```text
echo 0x00 > /sys/bus/mdio_bus/devices/stmmac-0:00/phy_reg
cat /sys/bus/mdio_bus/devices/stmmac-0:00/phy_regValue
```

<!-- source: EN PDF p5; unit 29 -->

### 3.2   Andere Versionen

<!-- source: EN PDF p5; unit 30 -->

```text
/sys/bus/mdio_bus/devices/stmmac-0:00/phy_registers
```

<!-- source: EN PDF p5; unit 31 -->

Schreiben

<!-- source: EN PDF p5; unit 32 -->

Beispielsweise zum Schreiben von 0xabcd in Reg0:

<!-- source: EN PDF p5; unit 33 -->

```text
echo 0x00 0xabcd > /sys/bus/mdio_bus/devices/stmmac-0:00/phy_registers
```

<!-- source: EN PDF p5; unit 34 -->

Lesen

<!-- source: EN PDF p5; unit 35 -->

```text
cat /sys/bus/mdio_bus/devices/stmmac-0:00/phy_registers
```

<!-- source: EN PDF p5; unit 36 -->

Dieser Befehl liest alle Register von 0 bis 31, sodass die entsprechenden Registerwerte geprüft werden können.

<!-- source: EN PDF p6; unit 37 -->

## 4.   MAC-Adresse

<!-- source: EN PDF p6; unit 38 -->

Die beschriebene Strategie zum Lesen von MAC-Adressen priorisiert die MAC-Adresse im DTB, in das auch uboot schreibt, gefolgt von der im IDB gespeicherten MAC-Adresse. Entspricht diese den Vorgaben, wird sie verwendet; ist sie ungültig oder nicht gespeichert, wird eine zufällig erzeugte Adresse verwendet, die sich beim Neustart ändert. Bei RK3399, RK3328/RK3228H und späteren Versionen wurde die Strategie verbessert: Vorrang hat die im IDB oder Vendor Storage gespeicherte Adresse. Ist sie gültig, wird sie verwendet; andernfalls wird eine zufällige MAC-Adresse erzeugt, in der Vendor-Partition gespeichert und verwendet. Sie bleibt dadurch auch bei Neustart oder Zurücksetzen auf Werkseinstellungen erhalten.

<!-- source: EN PDF p6; unit 39 -->

Referenz zum Werkzeug für das Schreiben der MAC-Adresse: Rockchip_User_Guide_RKDevInfoWriteTool_EN.pdf.

<!-- source: EN PDF p6; unit 40 -->

## 5.   Loopback-Tests

<!-- source: EN PDF p6; unit 41 -->

Loopback-Tests umfassen hauptsächlich MAC- und PHY-Loopback. Details enthält „Rockchip_Developer_Guide_Linux_GMAC_RGMII_Delayline_EN.pdf“ mit Erläuterungen zu den Knoten phy_lb und mac_lb.

<!-- source: EN PDF p6; unit 42 -->

## 6.   RGMII Delayline

<!-- source: EN PDF p6; unit 43 -->

Die RGMII-Schnittstelle stellt tx- und rx-Verzögerungsleitungen zur Anpassung des RGMII-Timings bereit. Zur Ermittlung einer geeigneten RGMII-Verzögerung siehe „Rockchip_Developer_Guide_Linux_GMAC_RGMII_Delayline_CN.pdf“.

<!-- source: EN PDF p6; unit 44 -->

## 7.   LED-Anzeigen

<!-- source: EN PDF p6; unit 45 -->

Der PHY besitzt eine eigene LED-Steuerung. Nachfolgend stehen die macphy-/LED-Konfigurationen für RK3228 und RK3328. Bei anderen externen PHYs sind die jeweiligen Datenblätter maßgeblich:

<!-- source: EN PDF p6; unit 46 -->

RK3228: Der Patch kernel_4.4_rk322x_phy_led_control.patch muss angewendet werden.

<!-- source: EN PDF p6; unit 47 -->

RK3328: Konfigurieren Sie iomux in DTS, beispielsweise für die LED-Steuerung über rx und link, und stellen Sie das entsprechende pinctrl ein.

<!-- source: EN PDF p7; unit 48 -->

```text
phy: phy@0 {
      compatible = "ethernet-phy-id1234.d400", "ethernet-phy-ieee802.3-c22";
      reg = <0>;

      clocks = <&cru SCLK_MAC2PHY_OUT>;
      resets = <&cru SRST_MACPHY>;
      pinctrl-names = "default";
      pinctrl-0 = <&fephyled_rxm1 &fephyled_linkm1>;
      phy-is-integrated;
};
```

<!-- source: EN PDF p7; unit 49 -->

## 8.   WOL

<!-- source: EN PDF p7; unit 50 -->

Die Konfigurationsregister für Wake On Lan unterscheiden sich je nach PHY. Die in der Quelle enthaltenen Patches umfassen RTL8211E/F und RTL8201F.

<!-- source: EN PDF p7; unit 51 -->

## 9.   Direkte MAC-to-MAC-Verbindung

<!-- source: EN PDF p7; unit 52 -->

Siehe „Rockchip_Developer_Guide_Linux_MAC_TO_MAC_EN.pdf“.

<!-- source: EN PDF p7; unit 53 -->

## 10.   Jumbo Frame

<!-- source: EN PDF p7; unit 54 -->

Ab RV1126/1109 sind Jumbo Frames mit 9K verfügbar; dazu muss die MTU des Testnetzwerks auf 9000 gesetzt werden. Es folgen die Testergebnisse aus der Quelle:

<!-- source: EN PDF p7; unit 55 -->

```text
<pre>[root@Puma:/]# ping -s 9000 192.168.1.100
PING 192.168.1.100 (192.168.1.100) 9000(9028) bytes of data.

9008 bytes from 192.168.1.100: icmp_seq=1 ttl=64 time=0.784 ms
9008 bytes from 192.168.1.100: icmp_seq=2 ttl=64 time=0.675 ms
9008 bytes from 192.168.1.100: icmp_seq=3 ttl=64 time=0.666 ms
9008 bytes from 192.168.1.100: icmp_seq=4 ttl=64 time=0.656 ms
9008 bytes from 192.168.1.100: icmp_seq=5 ttl=64 time=0.677 ms
9008 bytes from 192.168.1.100: icmp_seq=6 ttl=64 time=0.637 ms
9008 bytes from 192.168.1.100: icmp_seq=7 ttl=64 time=0.641 ms
9008 bytes from 192.168.1.100: icmp_seq=8 ttl=64 time=0.692 ms
9008 bytes from 192.168.1.100: icmp_seq=9 ttl=64 time=0.656 ms
```

<!-- source: EN PDF p8; unit 56 -->

## 11.   PTP1588

<!-- source: EN PDF p8; unit 57 -->

Ab RV1126/1109 wird PTP1588 unterstützt. Es folgen die Testergebnisse aus der Quelle:

<!-- source: EN PDF p8; unit 58 -->

### 11.1   PC als Master und RK als Slave

<!-- source: EN PDF p8; unit 59 -->

```text
ubuntu@thinkpad: sudo ptp4l -i enp0s31f6 -m -H
ptp4l[1790161.443]: selected /dev/ptp0 as PTP clock

ptp4l[1790161.443]: port 1: INITIALIZING to LISTENING on INIT_COMPLETE
ptp4l[1790161.443]: port 0: INITIALIZING to LISTENING on INIT_COMPLETE
ptp4l[1790168.489]: port 1: LISTENING to MASTER on ANNOUNCE_RECEIPT_TIMEOUT_EXPIRES
ptp4l[1790168.489]: selected local clock 54e1ad.fffe.dfa454 as best master
ptp4l[1790168.490]: assuming the grand master role
```

<!-- source: EN PDF p8; unit 60 -->

```text
[root@Puma:/]# ptp4l -i eth0 -m -H -s
ptp4l[39.868]: selected /dev/ptp0 as PTP clock

[  39.871092] rk_gmac-dwmac ffc40000.ethernet eth0: stmmac_hwtstamp_set config flags:0x0,
tx_type:0x1, rx_filter:0xc
[  39.872029] stmmac_hwtstamp_set, value: 0x17e03
ptp4l[39.870]: port 1: INITIALIZING to LISTENING on INIT_COMPLETE
ptp4l[39.871]: port 0: INITIALIZING to LISTENING on INIT_COMPLETE
ptp4l[41.251]: port 1: new foreign master 54e1ad.fffe.dfa454-1
[  43.817340] rk_gmac-dwmac ffc40000.ethernet eth0: stmmac_hwtstamp_set config flags:0x0,
tx_type:0x1, rx_filter:0xc
[  43.818262] stmmac_hwtstamp_set, value: 0x17e03
ptp4l[45.251]: selected best master clock 54e1ad.fffe.dfa454
ptp4l[45.251]: port 1: LISTENING to UNCALIBRATED on RS_SLAVE
ptp4l[49.251]: master offset -1608 s0 freq +0 path delay 5691
ptp4l[50.251]: master offset -5579 s0 freq +0 path delay 9435

ptp4l[51.251]: master offset -4831 s2 freq +748 path delay 9435
ptp4l[51.251]: port 1: UNCALIBRATED to SLAVE on MASTER_CLOCK_SELECTED
ptp4l[52.251]: master offset 12189 s2 freq +12937 path delay 7563
ptp4l[53.251]: master offset 14413 s2 freq +18818 path delay 8287
ptp4l[54.251]: master offset 10712 s2 freq +19441 path delay 8861
ptp4l[55.251]: master offset 7185 s2 freq +19127 path delay 8861
ptp4l[56.251]: master offset 3234 s2 freq +17332 path delay 9435
ptp4l[57.251]: master offset 1787 s2 freq +16855 path delay 9454
ptp4l[58.251]: master offset 785 s2 freq +16389 path delay 9454
ptp4l[59.251]: master offset 89 s2 freq +15928 path delay 9473
ptp4l[60.251]: master offset 31 s2 freq +15897 path delay 9454
ptp4l[61.251]: master offset -71 s2 freq +15804 path delay 9454

ptp4l[62.251]: master offset -100 s2 freq +15754 path delay 9406
ptp4l[63.251]: master offset -27 s2 freq +15797 path delay 9406
ptp4l[64.251]: master offset -69 s2 freq +15747 path delay 9395
ptp4l[65.251]: master offset 29 s2 freq +15824 path delay 9395
ptp4l[66.251]: master offset -73 s2 freq +15731 path delay 9395
ptp4l[67.251]: master offset 32 s2 freq +15814 path delay 9388
ptp4l[68.251]: master offset -20 s2 freq +15772 path delay 9388
ptp4l[69.251]: master offset -104 s2 freq +15682 path delay 9395
ptp4l[70.251]: master offset -56 s2 freq +15699 path delay 9395
ptp4l[71.251]: master offset 24 s2 freq +15762 path delay 9388
ptp4l[72.251]: master offset 11 s2 freq +15756 path delay 9395
```

<!-- source: EN PDF p9; unit 61 -->

<!-- source: EN PDF p9; unit 62 -->

### 11.2   RK als Master und PC als Slave

<!-- source: EN PDF p9; unit 63 -->

```text
[root@Puma:/]# ptp4l -i eth0 -m -H
ptp4l[15.668]: selected /dev/ptp0 as PTP clock
ptp4l[15.670]: port 1: INITIALIZING to LISTENING on INIT_COMPLETE

ptp4l[15.670]: port 0: INITIALIZING to LISTENING on INIT_COMPLETE
ptp4l[22.120]: port 1: LISTENING to MASTER on ANNOUNCE_RECEIPT_TIMEOUT_EXPIRES
ptp4l[22.120]: selected local clock aadc46.fffe.5da6d9 as best master
ptp4l[22.121]: assuming the grand master role
```

<!-- source: EN PDF p9; unit 64 -->

```text
ubuntu@thinkpad: sudo ptp4l -i enp0s31f6 -m -H -s
ptp4l[1879661.603]: selected /dev/ptp0 as PTP clock

ptp4l[1879661.603]: port 1: INITIALIZING to LISTENING on INIT_COMPLETE
ptp4l[1879661.603]: port 0: INITIALIZING to LISTENING on INIT_COMPLETE
ptp4l[1879662.249]: port 1: new foreign master aadc46.fffe.5da6d9-1
ptp4l[1879665.849]: selected best master clock aadc46.fffe.5da6d9
ptp4l[1879665.849]: port 1: LISTENING to UNCALIBRATED on RS_SLAVE
ptp4l[1879667.649]: master offset 49 s0 freq -9515 path delay 9364
ptp4l[1879668.549]: master offset 128 s2 freq -9436 path delay 9338
ptp4l[1879668.549]: port 1: UNCALIBRATED to SLAVE on MASTER_CLOCK_SELECTED
ptp4l[1879669.449]: master offset 256 s2 freq -9180 path delay 9338
ptp4l[1879670.349]: master offset -230 s2 freq -9589 path delay 9338
ptp4l[1879671.249]: master offset -399 s2 freq -9827 path delay 9360
ptp4l[1879672.149]: master offset 142 s2 freq -9406 path delay 9360
ptp4l[1879673.049]: master offset 232 s2 freq -9273 path delay 9347

ptp4l[1879673.949]: master offset -303 s2 freq -9739 path delay 9347
ptp4l[1879674.849]: master offset -267 s2 freq -9794 path delay 9338
ptp4l[1879675.749]: master offset 327 s2 freq -9280 path delay 9335
ptp4l[1879676.649]: master offset 405 s2 freq -9104 path delay 9335
ptp4l[1879677.549]: master offset -156 s2 freq -9543 path delay 9335
ptp4l[1879678.449]: master offset -178 s2 freq -9612 path delay 9335
ptp4l[1879679.349]: master offset -100 s2 freq -9587 path delay 9335
ptp4l[1879680.249]: master offset -73 s2 freq -9590 path delay 9335
ptp4l[1879681.149]: master offset -79 s2 freq -9618 path delay 9344
ptp4l[1879682.049]: master offset -76 s2 freq -9639 path delay 9344
ptp4l[1879682.949]: master offset -59 s2 freq -9645 path delay 9329
ptp4l[1879683.849]: master offset -31 s2 freq -9634 path delay 9329
ptp4l[1879684.750]: master offset 22 s2 freq -9591 path delay 9329

ptp4l[1879685.650]: master offset -9 s2 freq -9615 path delay 9337
ptp4l[1879686.550]: master offset -31 s2 freq -9640 path delay 9337
ptp4l[1879687.450]: master offset -3 s2 freq -9621 path delay 9337
ptp4l[1879688.350]: master offset -15 s2 freq -9634 path delay 9351
```

## Ergänzung aus der chinesischen Quelle: Hardware-Signaltests

Dieser Abschnitt steht in der chinesischen V1.0.0 auf S.9, Kapitel 12, fehlt jedoch in der englischen Ausgabe. Siehe die von Rockchips Hardwareentwicklung herausgegebenen Dokumente zu RMII-/RGMII-Signaltests und PHY-Augendiagrammtests: `瑞芯硬件部100base-t测试指南-V1.1.doc` und `瑞芯硬件部1000base-t测试指南_V1.0.doc`. Zur Nachverfolgbarkeit bleiben die Originaldateinamen erhalten. Das folgende Kapitel behält die ursprüngliche englische Nummer 12 bei; es entspricht Kapitel 13 der chinesischen Ausgabe.

<!-- source: EN PDF p10; unit 65 -->

## 12.   Fehleranalyse

<!-- source: EN PDF p10; unit 66 -->

### 12.1   DMA-Initialisierung fehlgeschlagen

<!-- source: EN PDF p10; unit 67 -->

Zeigt das Startprotokoll des GMAC-Treibers „DMA engine initialization failed“, ist ein Problem mit dem GMAC-Betriebstakt anzunehmen. Messen Sie zunächst, ob am Taktpin ein Takt vorhanden ist und ob Frequenz und Amplitude korrekt sind. Insbesondere sind folgende Punkte zu prüfen:

<!-- source: EN PDF p10; unit 68 -->

IOMUX-Fehler: Prüfen Sie den Registerwert des Taktpins.

<!-- source: EN PDF p10; unit 69 -->

Taktrichtung und Konfiguration passen nicht zur Hardware; siehe den Quellverweis auf die Takteinstellungen in Kapitel 4.

<!-- source: EN PDF p10; unit 70 -->

Prüfen Sie Taktbaum und CRU-Register, um Taktfrequenz und Taktaktivierung zu bestätigen.

<!-- source: EN PDF p10; unit 71 -->

### 12.2   PHY-Initialisierung fehlgeschlagen

<!-- source: EN PDF p10; unit 72 -->

Meldungen wie „No PHY found“ oder „Cannot attach to PHY“ im GMAC-Startprotokoll zeigen, dass kein PHY erkannt wurde. Der Treiber liest zuerst dessen ID über MDIO. Die MDC- und MDIO-Signalverläufe können gemessen werden, um ihre Korrektheit zu prüfen. Dieser Bus ähnelt I2C; die MDC-Frequenz muss unter 2.5M liegen. Mögliche Ursachen eines nicht gefundenen PHY sind:

<!-- source: EN PDF p10; unit 73 -->

Prüfen Sie die MDC-/MDIO-IOMUX-Registerwerte.

<!-- source: EN PDF p10; unit 74 -->

Prüfen Sie die Stromversorgung des PHY.

<!-- source: EN PDF p10; unit 75 -->

Falsche Reset-IO-Konfiguration.

<!-- source: EN PDF p10; unit 76 -->

Das Reset-IO-Timing erfüllt nicht die Anforderungen des PHY-Datenblatts. Diese unterscheiden sich je nach PHY. Zur Konfiguration siehe den DTS-Abschnitt dieses Dokuments.

<!-- source: EN PDF p10; unit 77 -->

Prüfen Sie die MDIO-/MDC-Signalverläufe auf Abweichungen; die MDC-Taktfrequenz muss kleiner sein als

<!-- source: EN PDF p10; unit 78 -->

2.5M.

<!-- source: EN PDF p10; unit 79 -->

### 12.3   Verbindungsprobleme

<!-- source: EN PDF p10; unit 80 -->

Bei Verbindungsproblemen beschreibt die Quelle ein Ausschlussverfahren: MDC/MDIO vom Hauptcontroller trennen und eine direkte Verbindung zum Computer herstellen, um zu prüfen, ob das Problem dort ebenfalls auftritt und Softwareeinflüsse auszuschließen. Die Formulierung ist mehrdeutig; beachten Sie ausdrücklich die Sicherheitswarnung am Artikelanfang und verbinden Sie keine MDC-/MDIO-Pins mit einem PC-Ethernet-Port. Das Verfahren soll die Untersuchung auf Hardwareeinflüsse eingrenzen. Prüfen Sie zunächst, ob TXN/P und RXN/P Link-Signalverläufe aufweisen.

<!-- source: EN PDF p10; unit 81 -->

Bei ständigem Wechsel zwischen Link up und Link down könnte der PHY fehlerhafte Daten empfangen:

<!-- source: EN PDF p10; unit 82 -->

Im EEE-Modus kann die bei falscher Verzögerungskonfiguration gesendete Wellenform ständige Link-up-/Link-down-Wechsel auslösen.

<!-- source: EN PDF p10; unit 83 -->

Auch ein falscher PHY-Versorgungstakt kann dieses Problem verursachen.

<!-- source: EN PDF p11; unit 84 -->

### 12.4   Fehlerhafte Datenübertragung

<!-- source: EN PDF p11; unit 85 -->

Prüfen Sie zuerst, ob TX, RX oder beide Richtungen betroffen sind.

<!-- source: EN PDF p11; unit 86 -->

#### 12.4.1   TX

<!-- source: EN PDF p11; unit 87 -->

Prüfen Sie mit ifconfig -a, ob der TX-Paketzähler von eth0 kontinuierlich steigt. Ein Wert von 0 kann auf eine fehlende Kabelverbindung hinweisen. Über den Knoten lässt sich die Verbindung prüfen: carrier 1 bedeutet Link up, 0 bedeutet Link down. Beispiel RK3328:

<!-- source: EN PDF p11; unit 88 -->

```text
console:/ # cat /sys/devices/platform/ff550000.ethernet/net/eth0/carrier
1
```

<!-- source: EN PDF p11; unit 89 -->

```text
eth0   Link encap:Ethernet HWaddr 16:21:8d:d9:67:0b Driver rk_gmac-dwmac
       inet6 addr: fe80::c43d:3e5d:533:b7ea/64 Scope: Link

       UP BROADCAST RUNNING MULTICAST MTU:1500 Metric:1
       RX packets:0 errors:0 dropped:0 overruns:0 frame:0
       TX packets:19 errors:0 dropped:0 overruns:0 carrier:0
       collisions:0 txqueuelen:1000
       RX bytes:0 TX bytes:2848
       Interrupt:45
```

<!-- source: EN PDF p11; unit 90 -->

Steigt der TX-Paketzähler kontinuierlich, sendet der GMAC TX-Daten.

<!-- source: EN PDF p11; unit 91 -->

Verbinden Sie Board und PC mit demselben lokalen Netzwerk. Pingen Sie den PC vom Board aus an und zeichnen Sie gleichzeitig auf dem PC Pakete auf, etwa mit Wireshark. Werden Daten des Boards erfasst, gelangen TX-Daten durch die Verbindung. Andernfalls muss die fehlerhafte Stelle im TX-Pfad ermittelt werden. Messen Sie TX Clock und TX Data des GMAC, um zwischen MAC- und PHY-Problemen zu unterscheiden. Beim MAC sind folgende Punkte zu prüfen:

<!-- source: EN PDF p11; unit 92 -->

iomux von TX Clock/TX Data prüfen.

<!-- source: EN PDF p11; unit 93 -->

Ist der TXC-Takt korrekt?

<!-- source: EN PDF p11; unit 94 -->

Ist im RGMII-Modus die Tx-Delayline-Konfiguration korrekt?

<!-- source: EN PDF p11; unit 95 -->

Auf der PHY-Seite können TXN/P-Signale gemessen werden, um die Datenausgabe des PHY zu bestätigen. Die Konfiguration unterscheidet sich je nach PHY; ziehen Sie dessen Datenblatt heran.

<!-- source: EN PDF p11; unit 96 -->

#### 12.4.2   RX

<!-- source: EN PDF p11; unit 97 -->

Wenn die obigen Prüfungen ein TX-Problem ausschließen, untersuchen Sie RX. Verbinden Sie das Netzwerkkabel und prüfen Sie mit ifconfig - a, ob der RX-Paketzähler von eth0 kontinuierlich steigt. Bei 0 hat GMAC RX keine Daten empfangen.

<!-- source: EN PDF p12; unit 98 -->

```text
eth0   Link encap:Ethernet HWaddr 16:21:8d:d9:67:0b Driver rk_gmac-dwmac
       inet6 addr: fe80::c43d:3e5d:533:b7ea/64 Scope: Link
       UP BROADCAST RUNNING MULTICAST MTU:1500 Metric:1

       RX packets:341 errors:0 dropped:0 overruns:0 frame:0
       TX packets:26 errors:0 dropped:0 overruns:0 carrier:0
       collisions:0 txqueuelen:1000
       RX bytes:48928 TX bytes:3741
       Interrupt:355
```

<!-- source: EN PDF p12; unit 99 -->

Ebenso können RXN/P des PHY und RX Clock/RX Data des GMAC gemessen werden, um zwischen einem MAC- und PHY-Problem zu unterscheiden. Prüfen Sie beim MAC:

<!-- source: EN PDF p12; unit 100 -->

iomux von RX Clock/RX Data.

<!-- source: EN PDF p12; unit 101 -->

Ist der RXC-Takt korrekt?

<!-- source: EN PDF p12; unit 102 -->

Ist die RGMII-Tx-Delayline-Konfiguration korrekt?

<!-- source: EN PDF p12; unit 103 -->

Ist im RGMII-Modus die Rx-Delayline-Konfiguration korrekt?

<!-- source: EN PDF p12; unit 104 -->

Steigt der TX-Paketzähler kontinuierlich, funktioniert die Ethernet-Kommunikation aber weiterhin nicht normal, kommen folgende Ursachen infrage:

<!-- source: EN PDF p12; unit 105 -->

Im RMII-Modus verwenden MAC und PHY nicht denselben Referenztakt.

<!-- source: EN PDF p12; unit 106 -->

Der PHY-Modus ist falsch konfiguriert, beispielsweise ist die Hardware auf MII eingestellt.

<!-- source: EN PDF p12; unit 107 -->

### 12.5   Zeitüberschreitung bei TX queue0

<!-- source: EN PDF p12; unit 108 -->

Dies deutet darauf hin, dass TX nicht senden kann, üblicherweise aufgrund einer Controller-Störung. Dafür kommen folgende Ursachen infrage:

<!-- source: EN PDF p12; unit 109 -->

Taktprobleme: Prüfen Sie die Taktkonfiguration; siehe den Quellverweis auf Kapitel 3 dieses Dokuments.

<!-- source: EN PDF p12; unit 110 -->

PHY-Timingprobleme: Ein falsches Reset-Timing führt zu einem falschen vom PHY bereitgestellten Takt.

<!-- source: EN PDF p12; unit 111 -->

PHY-Hardwareprobleme: Eine Kollisionserkennung verhindert die Datenübertragung.

<!-- source: EN PDF p12; unit 112 -->

Die Logikspannung ist zu niedrig.

{% endraw %}
