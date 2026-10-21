---
title: "Rockchip SDMMC, SDIO und eMMC: Vollständiger Leitfaden zu DTS, Moduswechsel und Kompatibilität"
description: "Alle technischen Kapitel von V1.4.0: Schnittstellenkonfiguration, dynamische Takte, 52 mmc_test-Fälle, Versorgungs- und Signalanalyse, JTAG und Leckströme."
translation_key: "088-rockchip-sdmmc-sdio-emmc"
slug: "088-rockchip-sdmmc-sdio-emmc"
lang: "de"
date: "2026-10-21"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "SDMMC", "SDIO", "eMMC"]
keywords: "ArmSoM Rockchip SDMMC SDIO eMMC DTS mmc_test"
excerpt: "Alle technischen Kapitel von V1.4.0: Schnittstellenkonfiguration, dynamische Takte, 52 mmc_test-Fälle, Versorgungs- und Signalanalyse, JTAG und Leckströme."
---

{% raw %}

# Rockchip SDMMC, SDIO und eMMC: Vollständiger Leitfaden zu DTS, Moduswechsel und Kompatibilität

Plattformreferenz zur ArmSoM-Anpassung, keine Zusage sämtlicher Funktionen für jede Platine. Quellen: Rockchip_Developer_Guide_SDMMC_SDIO_eMMC_CN.pdf (22 Seiten) und die englische Ausgabe (25 Seiten), beide V1.4.0, RK-KF-YF-121. Chinesisch folgt dem chinesischen Original, Englisch dem englischen. Russisch und Deutsch übersetzen Englisch vollständig; Unterschiede werden vor Ort kenntlich gemacht. Chinesisch verwendet chinesische Originalabbildungen, die anderen Ausgaben diejenigen des englischen PDFs. Schon das englische PDF enthält chinesische Beschriftungen im Oszilloskopbild; diese werden nicht als übersetzte Grafik ausgegeben. Konkrete ArmSoM-Platine, SoC, SDK/BSP, Kernel, DTS, IO-Spannung, Speicherbaustein und WiFi-Verdrahtung prüfen. Keine Hardwarevalidierung; Protokolle, Frequenzen und Signalverläufe sind Quellenbeispiele, keine ArmSoM-Messungen.

> Sicherheit: Die Quellverfahren umfassen Zustandsänderungen, Treiberabbindung, Schreib-/Löschtests, Formatierung und fsck-Reparatur. Sie können Daten zerstören. Nur an einer eindeutig identifizierten, gesicherten und ausschließlich zum Testen verwendeten Karte bewerten, nicht ungeprüft am Systemdatenträger oder Produktivgerät. Während der Bearbeitung wurde keines dieser Verfahren ausgeführt.

| Chips | Kernelversion |
| --- | --- |
| Alle Serien (Quellenumfang, keine Zusage für alle ArmSoM-Platinen) | 4.4, 4.19, 5.10, 6.1 |

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel) · [EDITORIAL-NOTES](/docs/rockchip-sdmmc-sdio-emmc/EDITORIAL-NOTES.md)

<!-- Source EN PDF p.5; unit 0 -->

## 1. DTS-Konfiguration

<!-- Source EN PDF p.5; unit 1 -->

### 1.1 DTS-Konfiguration für SDMMC

<!-- Source EN PDF p.5; unit 2 -->

(1) `max-frequency = <150000000>;`

<!-- Source EN PDF p.5; unit 3 -->

Diese Einstellung legt die Betriebsfrequenz der SD-Karte fest. Trotz der Angabe 150MHz wird sie abhängig vom Kartenmodus angepasst. Darum muss sich der Benutzer nicht kümmern; die Software stellt den Zusammenhang zwischen Betriebsfrequenz und Modus her. Das Maximum überschreitet 150MHz nicht.

<!-- Source EN PDF p.5; unit 4 -->

(2) `supports-sd;`

<!-- Source EN PDF p.5; unit 5 -->

Diese erforderliche Einstellung kennzeichnet einen SD-Kartensteckplatz. Ohne sie lässt sich die Karte nicht initialisieren. Nach Kernel 4.19 wird sie nicht mehr verwendet: Die Kombination `no-sdio` und` no-mmc` kennzeichnet einen ausschließlich für SD vorgesehenen Steckplatz ohne SDIO- und MMC-Unterstützung.

<!-- Source EN PDF p.5; unit 6 -->

(3) `bus-width = <4>;`

<!-- Source EN PDF p.5; unit 7 -->

Die Einstellung legt die Busbreite der SD-Karte fest. Maximal werden 4 Leitungen unterstützt; ohne Einstellung wird 1 Leitung verwendet. Nur 1 und 4 sind zulässig. Andere Werte gelten als ungültig und erzwingen den Betrieb mit 1 Leitung.

<!-- Source EN PDF p.5; unit 8 -->

(4) `cap-mmc-highspeed; cap-sd-highspeed;`

<!-- Source EN PDF p.5; unit 9 -->

Diese Einstellungen kennzeichnen die Unterstützung von Highspeed-SD-Karten. Ohne sie werden solche Karten nicht im Highspeed-Modus unterstützt.

<!-- Source EN PDF p.5; unit 10 -->

(5) SD3.0 konfigurieren

<!-- Source EN PDF p.5; unit 11 -->

Zunächst sicherstellen, dass der Chip SD3.0 unterstützt. Die IO-Versorgung vqmmc des SDMMC-Controllers konfigurieren und folgende SD3.0-Geschwindigkeitsmodi ergänzen:

<!-- Source EN PDF p.5; unit 12 -->

| Modus | Maximale Frequenz (Quellwert) | Hinweis |
| --- | --- | --- |
| sd-uhs-sdr12 | 24M |  |
| sd-uhs-sdr25 | 50M |  |
| sd-uhs-sdr50 | 100M |  |
| sd-uhs-ddr50 | 50M | Abtastung an beiden Flanken |
| sd-uhs-sdr104 | 208M |  |

<!-- Source EN PDF p.5; unit 13 -->

(6) 3V3-Versorgung der SD-Karte konfigurieren

<!-- Source EN PDF p.5; unit 14 -->

Wird der standardmäßige Versorgungsschaltpin des SDMMC-Controllers `sdmmc_pwren` verwendet, genügt es, dessen Funktion in pinctrl festzulegen und ihn im default-pinctrl des sdmmc-Knotens zu referenzieren. Beispiel für RK312X:

<!-- Source EN PDF p.6; unit 15 -->

```text
sdmmc_pwren: sdmmc-pwren {
    rockchip,pins = <1 RK_PB6 1 &pcfg_pull_default>;
};
pinctrl-0 = <&sdmmc_pwr &sdmmc_clk &sdmmc_cmd &sdmmc_bus4>;
```

<!-- Source EN PDF p.6; unit 16 -->

Wird ein anderer GPIO zur Steuerung der 3V3-Kartenversorgung verwendet, diesen als Regulator definieren und in vmmc-supply des sdmmc-Knotens referenzieren, beispielsweise:

<!-- Source EN PDF p.6; unit 17 -->

```text
sdmmc_pwr: sdmmc-pwr {
    rockchip,pins = <7 11 RK_FUNC_GPIO &pcfg_pull_none>;
};
vcc_sd: sdmmc-regulator {
    compatible = "regulator-fixed";
    gpio = <&gpio7 11 GPIO_ACTIVE_LOW>;
    pinctrl-names = "default";
    pinctrl-0 = <&sdmmc_pwr>;
    regulator-name = "vcc_sd";
    regulator-min-microvolt = <3300000>;
    regulator-max-microvolt = <3300000>;
    startup-delay-us = <100000>;
    vin-supply = <&vcc_io>;
};
&sdmmc {
    vmmc-supply = <&vcc_sd>;
};
```

<!-- Source EN PDF p.6; unit 18 -->

(7) Erkennungspin für das Einstecken und Entfernen der SD-Karte konfigurieren

<!-- Source EN PDF p.6; unit 19 -->

Ist der Erkennungspin direkt mit `sdmmc_cd` des SDMMC-Controllers verbunden, seine entsprechende Funktion konfigurieren und ihn im default-pinctrl des sdmmc-Knotens referenzieren.

<!-- Source EN PDF p.6; unit 20 -->

Bei einem anderen GPIO cd-gpios im sdmmc-Knoten konfigurieren, beispielsweise:

<!-- Source EN PDF p.6; unit 21 -->

`cd-gpios = <&gpio4 24 GPIO_ACTIVE_LOW>;`

<!-- Source EN PDF p.6; unit 22 -->

Wird ein GPIO mit invertierter Erkennung benötigt, also hohem Pegel bei eingesteckter SD-Karte, Folgendes ergänzen:

<!-- Source EN PDF p.6; unit 23 -->

`cd-inverted;`

<!-- Source EN PDF p.6; unit 24 -->

### 1.2 DTS-Konfiguration für SDIO

<!-- Source EN PDF p.6; unit 25 -->

(1) `max-frequency = <150000000>;`

<!-- Source EN PDF p.6; unit 26 -->

Wie bei SD-Karten überschreitet die maximale Betriebsfrequenz 150MHz nicht. Bei SDIO2.0-Geräten wird automatisch auf maximal 50MHz begrenzt; SDIO3.0 unterstützt bis zu 150MHz.

<!-- Source EN PDF p.7; unit 27 -->

(2) `supports-SDIO;`

<!-- Source EN PDF p.7; unit 28 -->

Diese erforderliche Einstellung kennzeichnet die SDIO-Funktion des Steckplatzes. Ohne sie lässt sich das SDIO-Gerät nicht initialisieren. Nach Kernel 4.19 wird sie durch `no-sd` zusammen mit` no-mmc` ersetzt: Der Steckplatz unterstützt weder SDMMC noch MMC und ist ausschließlich für SDIO bestimmt.

<!-- Source EN PDF p.7; unit 29 -->

(3) `bus-width = <4>;`

<!-- Source EN PDF p.7; unit 30 -->

Entspricht der Einstellung für SD-Karten.

<!-- Source EN PDF p.7; unit 31 -->

(4) `cap-sd-highspeed;`

<!-- Source EN PDF p.7; unit 32 -->

Entspricht der Einstellung für SD-Karten; auch bei SDIO-Geräten wird nach Highspeed-Unterstützung unterschieden.

<!-- Source EN PDF p.7; unit 33 -->

(5) `cap-sdio-irq;`

<!-- Source EN PDF p.7; unit 34 -->

Die Einstellung kennzeichnet, ob das SDIO-Gerät, gewöhnlich WiFi, SDIO-Interrupts unterstützt. Bei einem OOB-Interrupt diesen Eintrag nicht ergänzen. Den unterstützten Interrupttyp beim WiFi-Hersteller erfragen.

<!-- Source EN PDF p.7; unit 35 -->

(6) `keep-power-in-suspend;`

<!-- Source EN PDF p.7; unit 36 -->

Die englische Quelle beschreibt die Einstellung als Unterstützung des Abschaltens im Schlafzustand und empfiehlt sie standardmäßig, da WiFi gewöhnlich ein Aufwecken aus tiefem Schlaf benötigt. Abgleichhinweis: Die chinesische Quelle, S. 6, spricht ausdrücklich vom Beibehalten der Versorgung im Schlaf; die englische Formulierung ist dazu widersprüchlich.

<!-- Source EN PDF p.7; unit 37 -->

(7) `mmc-pwrseq = <&sdio_pwrseq>;`

<!-- Source EN PDF p.7; unit 38 -->

Dies ist die erforderliche Versorgungssteuerung des SDIO-Geräts, gewöhnlich WiFi. Ohne sie kann WiFi nicht eingeschaltet werden und arbeiten. Im folgenden Beispiel Quarztakt und Reset-/Enable-GPIO entsprechend der tatsächlichen Platinenhardware wählen.

<!-- Source EN PDF p.7; unit 39 -->

```text
sdio_pwrseq:sdio-pwrseq {
        compatible ="mmc-pwrseq-simple";
        clocks = <&rk808 1>;
        clock-names ="ext_clock";
        pinctrl-names ="default";
        pinctrl-0 =<&wifi_enable_h>;
        /*
        * On the module itself this is one of these (depending
        * on the actual card populated):
        * - SDIO_RESET_L_WL_REG_ON
        * - PDN (power down when low)
        */
        reset-gpios = <&gpio0 10GPIO_ACTIVE_LOW>; /* GPIO0_B2 */
};
```

<!-- Source EN PDF p.7; unit 40 -->

(8) `non-removable;`

<!-- Source EN PDF p.7; unit 41 -->

Kennzeichnet ein nicht entfernbares Gerät im Steckplatz. Für SDIO ist dieser Eintrag erforderlich.

<!-- Source EN PDF p.7; unit 42 -->

(9) `num-slots = <4>;`

<!-- Source EN PDF p.7; unit 43 -->

Entspricht der Einstellung für SD-Karten.

<!-- Source EN PDF p.8; unit 44 -->

(10) `sd-uhs-sdr104;`

<!-- Source EN PDF p.8; unit 45 -->

Legt fest, ob das SDIO-Gerät SDIO3.0 unterstützt. Voraussetzung ist eine WiFi-IO-Spannung von 1.8v.

<!-- Source EN PDF p.8; unit 46 -->

### 1.3 DTS-Konfiguration für eMMC

<!-- Source EN PDF p.8; unit 47 -->

(1) `max-frequency = <150000000>;`

<!-- Source EN PDF p.8; unit 48 -->

Wie bei SD-Karten beträgt das Maximum 150MHz. Im eMMC-Highspeed-Modus wird automatisch auf 50MHz zurückgeschaltet; eMMC HS200 unterstützt bis zu 150MHz.

<!-- Source EN PDF p.8; unit 49 -->

(2) `supports-emmc;`

<!-- Source EN PDF p.8; unit 50 -->

Diese erforderliche Einstellung kennzeichnet einen eMMC-Steckplatz. Ohne sie lässt sich eMMC nicht initialisieren. Nach Kernel 4.19 wird stattdessen `no-sd` mit` no-sdio` kombiniert: Der Steckplatz unterstützt weder SDMMC noch SDIO und ist ausschließlich für eMMC vorgesehen.

<!-- Source EN PDF p.8; unit 51 -->

(3) `bus-width = <4>;`

<!-- Source EN PDF p.8; unit 52 -->

Entspricht der Einstellung für SD-Karten.

<!-- Source EN PDF p.8; unit 53 -->

(4) `mmc-ddr-1_8v;`

<!-- Source EN PDF p.8; unit 54 -->

Kennzeichnet die Unterstützung des Modus 50MDDR.

<!-- Source EN PDF p.8; unit 55 -->

(5) `mmc-hs200-1_8v;`

<!-- Source EN PDF p.8; unit 56 -->

Kennzeichnet die Unterstützung des Modus HS200.

<!-- Source EN PDF p.8; unit 57 -->

(6) `mmc-hs400-1_8v; mmc-hs400-enhanced-strobe`

<!-- Source EN PDF p.8; unit 58 -->

Diese beiden Einstellungen kennzeichnen die Unterstützung von HS400 und HS400ES. Die Unterstützung des jeweiligen Chips seiner Spezifikation entnehmen.

<!-- Source EN PDF p.8; unit 59 -->

(7) `non-removable;`

<!-- Source EN PDF p.8; unit 60 -->

Erforderliche Einstellung zur Kennzeichnung eines nicht entfernbaren Geräts im Steckplatz.

<!-- Source EN PDF p.8; unit 61 -->

## 2. Frequenz- und Moduswechsel

<!-- Source EN PDF p.8; unit 62 -->

(1) Der Modus lässt sich über die oben beschriebenen DTS-Einstellungen wechseln.

<!-- Source EN PDF p.8; unit 63 -->

(2) Soll die Firmware unverändert bleiben, kann dynamisch umgeschaltet werden.

<!-- Source EN PDF p.8-9; unit 64 -->

Laut Quelle enthält Kernel 6.1 diese Commits bereits; andere Plattformen benötigen deren Übernahme.

```text
commit 0c11160a3c03bcf41fd1217d5e44e68ff078c54b
Author: Shawn Lin <shawn.lin@rock-chips.com>
Date: Tue Nov 5 18:05:50 2024 +0800
    mmc: debugfs: Allow more host caps to be modified
    Change-Id: I2d5df7bc95eaa4a380b5107364aff8df3a759788
commit 478cdcd25cba8be5cfcf56b503b0e070f5aef245
Author: Vincent Whitchurch <vincent.whitchurch@axis.com>
Date: Fri Sep 29 09:45:09 2023 +0200
    UPSTREAM: mmc: debugfs: Allow host caps to be modified
    Change-Id: I6ea2fc093234785e05d05128556c60ef42da02a4
commit a5a3ea5e45d09cff84c04b515b5b71d4dd76524e
Author: Vincent Whitchurch <vincent.whitchurch@axis.com>
Date: Fri Sep 29 09:45:08 2023 +0200
    UPSTREAM: mmc: core: Always reselect card type
    Change-Id: Ie80514ade3b267901818f477d74d91cf7c13e103
```

<!-- Source EN PDF p.9; unit 66 -->

### 2.1 Dynamischer Wechsel bei SD/SDIO

<!-- Source EN PDF p.9; unit 67 -->

(1) DTS für den höchsten unterstützten Geschwindigkeitsmodus konfigurieren. Die MMC-Geräte-ID und Kartenadresse dem Protokoll entnehmen. Beispiel einer TF-Karte:

<!-- Source EN PDF p.9; unit 68 -->

```text
[ 5.739929] mmc_host mmc1: Bus speed (slot 0) = 400000Hz (slot req 400000Hz, actual 400000HZ div = 0)
[ 5.941037] mmc_host mmc1: Bus speed (slot 0) = 198000000Hz (slot req 200000000Hz, actual 198000000HZ div = 0)
[ 5.941682] dwmmc_rockchip 2a310000.mmc: Successfully tuned phase to 90
[ 5.941705] mmc1: new ultra high speed SDR104 SDHC card at address aaaa
[ 5.943229] mmcblk1: mmc1:aaaa SC32G 29.7 GiB
```

<!-- Source EN PDF p.9; unit 69 -->

Daraus lassen sich drei Informationen ablesen:

<!-- Source EN PDF p.9; unit 70 -->

Die MMC-Geräte-ID ist 1, also mmc1.

<!-- Source EN PDF p.9; unit 71 -->

Die Adresse der TF-Karte lautet aaaa; die kombinierte Gerätekennung lautet mmc1:aaaa.

<!-- Source EN PDF p.9; unit 72 -->

Aktueller Modus: sdr104; Frequenz: 198MHz.

<!-- Source EN PDF p.9; unit 73 -->

(2) Da das Gerät mmc1 ist, mit `cd /sys/kernel/debug/mmc1` in dessen Verzeichnis wechseln. Bei mmc0 entsprechend das Verzeichnis mmc0 verwenden.

<!-- Source EN PDF p.9; unit 74 -->

(3) Um im aktuellen Modus nur die Frequenz auf 100MHz zu ändern, `echo 100000000 > clock` ausführen. Andere Frequenzen entsprechend einstellen.

<!-- Source EN PDF p.9; unit 75 -->

```text
root@rk3576-buildroot:/sys/kernel/debug/mmc1# echo 100000000 > clock
[ 86.451685] mmc_host mmc1: Bus speed (slot 0) = 100000000Hz (slot req 100000000Hz, actual 100000000HZ div = 0)
```

<!-- Source EN PDF p.9; unit 76 -->

(4) In High speed mit standardmäßig 50MHz wechseln.

<!-- Source EN PDF p.10; unit 77 -->

```text
#Execute the following commands in the sys/kernel/debug/mmc1 directory:
echo $(($(cat caps) | (1 << 7))) > caps
echo on > /sys/bus/mmc/devices/mmc1\:aaaa/power/control
echo auto > /sys/bus/mmc/devices/mmc1\:aaaa/power/control
echo $(($(cat caps) & ~(1 << 19))) > caps
echo on > /sys/bus/mmc/devices/mmc1\:aaaa/power/control
#You can see the switch has occurred
[ 78.304578] mmc_host mmc1: Bus speed (slot 0) = 400000Hz (slot req 400000Hz, actual 400000HZ div = 0)
[ 78.501126] mmc_host mmc1: Bus speed (slot 0) = 50000000Hz (slot req 50000000Hz, actual 50000000HZ div = 0)
#Execute the following command to confirm the switch was successful
grep timing ios
timing spec: 2 (sd high-speed) #High speed mode now
```

<!-- Source EN PDF p.10; unit 78 -->

(5) In Default speed mit standardmäßig 25MHz wechseln.

<!-- Source EN PDF p.10; unit 79 -->

```text
#Execute the following commands in the sys/kernel/debug/mmc1 directory:
echo $(($(cat caps) | (1 << 7))) > caps
echo on > /sys/bus/mmc/devices/mmc1\:aaaa/power/control
echo auto > /sys/bus/mmc/devices/mmc1\:aaaa/power/control
echo $(($(cat caps) & ~(1 << 2))) > caps
echo on > /sys/bus/mmc/devices/mmc1\:aaaa/power/control
#You can see the switch has occurred
[ 287.590885] mmc_host mmc1: Bus speed (slot 0) = 400000Hz (slot req 400000Hz, actual 400000HZ div = 0)
[ 287.784531] mmc_host mmc1: Bus speed (slot 0) = 25000000Hz (slot req 25000000Hz, actual 25000000HZ div = 0)
#Execute the following command to confirm the switch was successful
grep timing ios
timing spec: 0 (legacy) #Default speed mode now
```

<!-- Source EN PDF p.10; unit 80 -->

### 2.2 Dynamischer Wechsel bei eMMC

<!-- Source EN PDF p.10; unit 81 -->

(1) DTS für den höchsten unterstützten Geschwindigkeitsmodus konfigurieren. Die MMC-Geräte-ID und Adresse dem Protokoll entnehmen. Beispiel für eMMC des RK3588:

<!-- Source EN PDF p.10; unit 82 -->

```text
[ 2.260445] mmc0: Command Queue Engine enabled
[ 2.260458] mmc0: new HS400 Enhanced strobe MMC card at address 0001
[ 2.260740] mmcblk0: mmc0:0001 BJTD4R 29.1 GiB
```

<!-- Source EN PDF p.10; unit 83 -->

Daraus lassen sich drei Informationen ablesen:

<!-- Source EN PDF p.10; unit 84 -->

Die MMC-Geräte-ID ist 0, also mmc0.

<!-- Source EN PDF p.10; unit 85 -->

Die eMMC-Adresse lautet 0001; die kombinierte Gerätekennung lautet mmc0:0001.

<!-- Source EN PDF p.11; unit 86 -->

Aktueller Modus: HS400; die standardmäßige eMMC-Frequenz dieser Plattform beträgt 198MHz.

<!-- Source EN PDF p.11; unit 87 -->

(2) Da das Gerät mmc0 ist, mit `cd /sys/kernel/debug/mmc0` in dessen Verzeichnis wechseln. Bei mmc1 entsprechend das Verzeichnis mmc1 verwenden.

<!-- Source EN PDF p.11; unit 88 -->

(3) Zum Frequenzwechsel im aktuellen Modus `echo 100000000 > clock` verwenden; andere Frequenzen entsprechend einstellen.

<!-- Source EN PDF p.11; unit 89 -->

```text
# First confirm the default frequency and mode
root@rk3588-buildroot:/sys/kernel/debug/mmc0# grep clock ios
clock: 200000000 Hz actual clock: 198000000 Hz #Default 198MHz
root@rk3588-buildroot:/sys/kernel/debug/mmc0# grep timing ios
timing spec: 10 (mmc HS400 enhanced strobe) #HS400es mode
# Begin frequency switching
root@rk3588-buildroot:/sys/kernel/debug/mmc0# echo 100000000 > clock
root@rk3588-buildroot:/sys/kernel/debug/mmc0# grep clock ios
clock: 100000000 Hz actual clock: 100000000 Hz #Switched to 100MHz
root@rk3588-buildroot:/sys/kernel/debug/mmc0# grep timing ios
timing spec: 10 (mmc HS400 enhanced strobe) #Still HS400es mode
```

<!-- Source EN PDF p.11; unit 90 -->

(4) In HS200 mit standardmäßig 198MHz wechseln.

<!-- Source EN PDF p.11; unit 91 -->

```text
# Execute the following commands in the sys/kernel/debug/mmc0 directory:
echo $(($(cat caps) | (1 << 7))) > caps
echo on > /sys/bus/mmc/devices/mmc0:0001/power/control
echo auto > /sys/bus/mmc/devices/mmc0:0001/power/control
echo $(($(cat caps2) & ~(1 << 15))) > caps2
echo on > /sys/bus/mmc/devices/mmc0:0001/power/control
# Execute the following command to confirm the switch was successful
grep timing ios
timing spec: 9 (mmc HS200) #HS200 mode now
```

<!-- Source EN PDF p.11; unit 92 -->

(5) In High speed mit standardmäßig 50MHz wechseln.

<!-- Source EN PDF p.11; unit 93 -->

```text
# Execute the following commands in the sys/kernel/debug/mmc0 directory:
echo $(($(cat caps) | (1 << 7))) > caps
echo on > /sys/bus/mmc/devices/mmc0:0001/power/control
echo auto > /sys/bus/mmc/devices/mmc0:0001/power/control
echo $(($(cat caps) & ~(1 << 1))) > caps
echo on > /sys/bus/mmc/devices/mmc0:0001/power/control
# Execute the following command to confirm the switch was successful
grep timing ios
timing spec: 1 (mmc high-speed) #High speed mode now
```

<!-- Source EN PDF p.12; unit 94 -->

### 2.3 Weitere Hinweise

<!-- Source EN PDF p.12; unit 95 -->

Neben Frequenz und Modus lassen sich die Busbreite sowie die Unterstützung von CMD23, CQE und DCMD umschalten. Eine Verringerung der Busbreite kann den Modus automatisch herabsetzen. Beispiel für mmc0:0001:

<!-- Source EN PDF p.12; unit 96 -->

```text
# Execute the following commands in sequence in the sys/kernel/debug/mmc0 directory:
echo $(($(cat caps) | (1 << 7))) > caps
echo on > /sys/bus/mmc/devices/mmc0\:0001/power/control
echo auto > /sys/bus/mmc/devices/mmc0\:0001/power/control
# Select the following switching configurations as needed
echo $(($(cat caps) & ~(1 << 6))) > caps # Remove 8-bit support
echo $(($(cat caps) | (1 << 6))) > caps # Add 8-bit support
echo $(($(cat caps) & ~(1 << 0))) > caps # Remove 4-bit support
echo $(($(cat caps) | (1 << 0))) > caps # Add 4-bit support
echo $(($(cat caps) & ~(1 << 30))) > caps # Remove cmd23 support
echo $(($(cat caps) | (1 << 30))) > caps # Add cmd23 support
echo $(($(cat caps) & ~(1 << 30))) > caps # Remove cmd23 support
echo $(($(cat caps) | (1 << 30))) > caps # Add cmd23 support
echo $(($(cat caps2) & ~(1 << 23))) > caps2 # Remove cqe support
echo $(($(cat caps2) | (1 << 23))) > caps2 # Add cqe support
echo $(($(cat caps2) & ~(1 << 24))) > caps2 # Remove cqe dcmd support
echo $(($(cat caps2) | (1 << 24))) > caps2 # Add cqe dcmd support
# Execute this again
echo on > /sys/bus/mmc/devices/mmc0\:0001/power/control
# Confirm ios information, check the output results
cat ios
```

<!-- Source EN PDF p.12; unit 97 -->

Die Bedeutung der Bits in caps und caps2 steht in der Kerneldatei `include/linux/mmc/host.h`. Derzeit werden folgende caps und caps2 unterstützt:

<!-- Source EN PDF p.12; unit 98 -->

| caps | caps2 |
| --- | --- |
| MMC_CAP_AGGRESSIVE_PM | MMC_CAP2_HS400_1_8V |
| MMC_CAP_SD_HIGHSPEED | MMC_CAP2_HS400_1_2V |
| MMC_CAP_MMC_HIGHSPEED | MMC_CAP2_HS400_ES |
| MMC_CAP_UHS | MMC_CAP2_HS200_1_8V_SDR |
| MMC_CAP_DDR | MMC_CAP2_HS200_1_2V_SDR |
| MMC_CAP_4_BIT_DATA | MMC_CAP2_CQE |
| MMC_CAP_8_BIT_DATA | MMC_CAP2_CQE_DCMD |
| MMC_CAP_CMD23 |  |

<!-- Source EN PDF p.13; unit 99 -->

Weitere für das Projekt benötigte Einstellungen lassen sich nach dem Vorbild des oben genannten Commits `0c11160a3c03bcf41fd1217d5e44e68ff078c54b` ergänzen.

<!-- Source EN PDF p.13; unit 100 -->

## 3. Kompatibilitätstests mit mmc_test

<!-- Source EN PDF p.13; unit 101 -->

Bei Produkten, die auf SD-Karten angewiesen sind, werden spezielle SD-Karten-Kompatibilitätstests empfohlen.

<!-- Source EN PDF p.13; unit 102 -->

### 3.1 Kernelkonfiguration prüfen

<!-- Source EN PDF p.13; unit 103 -->

Sicherstellen, dass `CONFIG_MMC_TEST=y` aktiviert ist:

```text
Device Drivers -->
   <*> MMC/SD/SDIO card support -->
   [*] MMC host test driver
```

Bei Modulkonfiguration nach dem Start `insmod mmc_test.ko` ausführen.

<!-- Source EN PDF p.13; unit 104 -->

### 3.2 Verwendung

<!-- Source EN PDF p.13; unit 105 -->

(1) Alle mmc-Geräte auflisten.

```text
ls /sys/bus/mmc/devices/
```

(2) Das Testgerät, etwa eine SD-Karte, identifizieren und seine kombinierte Kennung dem Protokoll entnehmen.

```text
mmc1:aaaa
```

(3) Die SD-Karte vom mmcblk-Treiber lösen.

```text
echo 'mmc1:aaaa' > /sys/bus/mmc/drivers/mmcblk/unbind
```

(4) Die SD-Karte an mmc_test binden.

```text
echo 'mmc1:aaaa' > /sys/bus/mmc/drivers/mmc_test/bind
```

(5) Nun sollte folgende Protokollmeldung erscheinen.

```text
mmc_test mmc1:aaaa: Card claimed for testing.
```

(6) Verfügbare Testfälle anzeigen.

```text
cat /sys/kernel/debug/mmc1/mmc1:aaaa/testlist
```

(7) Je nach Bedarf Testnummer N wählen; vollständige Beschreibungen folgen unten.

```text
echo N > /sys/kernel/debug/mmc1/mmc1:aaaa/test
```

<!-- Source EN PDF p.14; unit 106 -->

### 3.3 Ausgaben

<!-- Source EN PDF p.14; unit 107 -->

| Ausgabe | Bedeutung |
| --- | --- |
| mmc1: Result: OK | Test abgeschlossen |
| mmc1: Result: FAILED | Test fehlgeschlagen |
| mmc1: Result: UNSUPPORTED (by host) | Controllerkonfiguration nicht unterstützt |
| mmc1: Result: UNSUPPORTED (by card) | Karte nicht unterstützt |

<!-- Source EN PDF p.15; unit 108 -->

### 3.4 Testbeschreibung

<!-- Source EN PDF p.15; unit 109 -->

Die englischen Testnamen bleiben zum genauen Abgleich mit der testlist-Ausgabe erhalten.

| N | Originaltestname | Beschreibung |
| --- | --- | --- |
| 0 | Run all tests | Alle Tests ausführen |
| 1 | Basic write (no data verification) | Schreibtest ohne Datenprüfung |
| 2 | Basic read (no data verification) | Lesetest ohne Datenprüfung |
| 3 | Basic write (with data verification) | Schreibtest mit Datenprüfung |
| 4 | Basic read (with data verification) | Lesetest mit Datenprüfung |
| 5 | Multi-block write | Mehrblockschreiben |
| 6 | Multi-block read | Mehrblocklesen |
| 7 | Power of two block writes | Blockschreiben mit gerader Potenz (Quellenformulierung; der Testname nennt Zweierpotenzen) |
| 8 | Power of two block reads | Blocklesen mit gerader Potenz (Quellenformulierung; der Testname nennt Zweierpotenzen) |
| 9 | Weird sized block writes | Schreiben verschiedener ungewöhnlicher Blockgrößen |
| 10 | Weird sized block reads | Lesen verschiedener ungewöhnlicher Blockgrößen |
| 11 | Badly aligned write | Einzelblockschreiben mit nicht ausgerichteter Adresse |
| 12 | Badly aligned read | Einzelblocklesen mit nicht ausgerichteter Adresse |
| 13 | Badly aligned multi-block write | Mehrblockschreiben mit nicht ausgerichteter Adresse |
| 14 | Badly aligned multi-block read | Mehrblocklesen mit nicht ausgerichteter Adresse |
| 15 | Proper xfer_size at write (start failure) | Absichtlich falscher Übertragungstyp, beispielsweise Mehrblockschreiben mit einem Einzelblockbefehl |
| 16 | Proper xfer_size at read (start failure) | Absichtlich falscher Übertragungstyp, beispielsweise Mehrblocklesen mit einem Einzelblockbefehl |
| 17 | Proper xfer_size at write (midway failure) | Wie 15, jedoch Schreibfehler mitten in der Mehrblockübertragung einfügen |
| 18 | Proper xfer_size at read (midway failure) | Wie 16, jedoch Lesefehler mitten in der Mehrblockübertragung einfügen |
| 19 | Highmem write | Einzelblockschreiben mit einer High-memory-Seite |
| 20 | Highmem read | Einzelblocklesen mit einer High-memory-Seite |

<!-- Source EN PDF p.16; unit 110 -->

Die englischen Testnamen bleiben zum genauen Abgleich mit der testlist-Ausgabe erhalten.

| N | Originaltestname | Beschreibung |
| --- | --- | --- |
| 21 | Multi-block highmem write | Mehrblockschreiben mit einer High-memory-Seite |
| 22 | Multi-block highmem read | Mehrblocklesen mit einer High-memory-Seite |
| 23 | Best-case read performance | 512K sequenziell lesen, zusammenhängende Adressen, ohne sg |
| 24 | Best-case write performance | 512K sequenziell schreiben, zusammenhängende Adressen, ohne sg |
| 25 | Best-case read performance into scattered pages | 512K sequenziell mit sg lesen |
| 26 | Best-case write performance from scattered pages | 512K sequenziell mit sg schreiben; die chinesische Ausgabe, S. 14, beschreibt abweichend Lesen |
| 27 | Single read performance by transfer size | Einzelblock-Leseleistung |
| 28 | Single write performance by transfer size | Einzelblock-Schreibleistung |
| 29 | Single trim performance by transfer size | Einzelblock-Löschleistung |
| 30 | Consecutive read performance by transfer size | Kontinuierliche Leseleistung |
| 31 | Consecutive write performance by transfer size | Kontinuierliche Schreibleistung |
| 32 | Consecutive trim performance by transfer size | Kontinuierliche Löschleistung |
| 33 | Random read performance by transfer size | Zufällige Leseleistung |
| 34 | Random write performance by transfer size | Zufällige Schreibleistung |
| 35 | Large sequential read into scattered pages | Großer sequenzieller Lesetest mit sg |
| 36 | Large sequential write from scattered pages | Großer sequenzieller Schreibtest mit sg |
| 37 | Write performance with blocking req 4k to 4MB | Blockierende Schreibleistung bei Übertragungslängen von 4K bis 4MB |

<!-- Source EN PDF p.17; unit 111 -->

Die englischen Testnamen bleiben zum genauen Abgleich mit der testlist-Ausgabe erhalten.

| N | Originaltestname | Beschreibung |
| --- | --- | --- |
| 38 | Write performance with non-blocking req 4k to 4MB | Nicht blockierende Schreibleistung bei Übertragungslängen von 4K bis 4MB |
| 39 | Read performance with blocking req 4k to 4MB | Blockierende Leseleistung bei Übertragungslängen von 4K bis 4MB |
| 40 | Read performance with non-blocking req 4k to 4MB | Nicht blockierende Leseleistung bei Übertragungslängen von 4K bis 4MB |
| 41 | Write performance blocking req 1 to 512 sg elems | Blockierende Schreibleistung mit 1 bis 512 sg-Elementen |
| 42 | Write performance non-blocking req 1 to 512 sg elems | Nicht blockierende Schreibleistung mit 1 bis 512 sg-Elementen |
| 43 | Read performance blocking req 1 to 512 sg elems | Blockierende Leseleistung mit 1 bis 512 sg-Elementen |
| 44 | Read performance non-blocking req 1 to 512 sg elems | Nicht blockierende Leseleistung mit 1 bis 512 sg-Elementen; die chinesische Ausgabe, S. 15, beschreibt abweichend Schreiben |
| 45 | Reset test | Reset-Test |
| 46 | Commands during read - no Set Block Count (CMD23) | Verschiedene Befehle während des Lesens ohne CMD23 senden |
| 47 | Commands during write - no Set Block Count (CMD23) | Verschiedene Befehle während des Schreibens ohne CMD23 senden |
| 48 | Commands during read - use Set Block Count (CMD23) | Verschiedene Befehle während des Lesens mit CMD23 senden |
| 49 | Commands during write - use Set Block Count (CMD23) | Verschiedene Befehle während des Schreibens mit CMD23 senden |
| 50 | Commands during non-blocking read - use Set Block Count (CMD23) | Verschiedene Befehle während des nicht blockierenden Lesens mit CMD23 senden |
| 51 | Commands during non-blocking write - use Set Block Count (CMD23) | Verschiedene Befehle während des nicht blockierenden Schreibens mit CMD23 senden |

<!-- Source EN PDF p.18; unit 112 -->

## 4. Häufige Probleme untersuchen

<!-- Source EN PDF p.18; unit 113 -->

### 4.1 Hardwareprobleme analysieren

<!-- Source EN PDF p.18; unit 114 -->

(1) SD-Karte

<!-- Source EN PDF p.18; unit 115 -->

![Originalabbildung der SD-Kartenverdrahtung und Erkennungspins](/docs/rockchip-sdmmc-sdio-emmc/assets/en-p018-X101.png)

*Originalabbildung der SD-Kartenverdrahtung und Erkennungspins — Quelle der Originalabbildung: EN PDF p.18.*

<!-- Source EN PDF p.18; unit 116 -->

Von links nach rechts:

<!-- Source EN PDF p.18; unit 117 -->

DET ---- Erkennungspin

<!-- Source EN PDF p.18; unit 118 -->

DATA1 ---- Datenleitung

<!-- Source EN PDF p.18; unit 119 -->

DATA0

<!-- Source EN PDF p.18; unit 120 -->

GND

<!-- Source EN PDF p.18; unit 121 -->

CLK ---- Takt

<!-- Source EN PDF p.18; unit 122 -->

VCC_SD ---- Versorgung der SD-Karte

<!-- Source EN PDF p.18; unit 123 -->

VCCIO_SD ---- IO-Versorgung der Datenleitungen

<!-- Source EN PDF p.18; unit 124 -->

CMD ---- Befehlsleitung

<!-- Source EN PDF p.18; unit 125 -->

DATA3

<!-- Source EN PDF p.18; unit 126 -->

DATA2

<!-- Source EN PDF p.18; unit 127 -->

Abgesehen von DET/CLK/GND müssen DATA0-3/VCC_SD/VCCIO_SD/CMD bei ungefähr 3.3v liegen, mindestens jedoch bei 3v. DET ist bei eingesteckter Karte niedrig und bei entfernter Karte hoch. DATA0-3/CMD werden von VCCIO_SD versorgt und müssen daher dessen Spannung entsprechen. VCC_SD und VCCIO_SD müssen übereinstimmen. Quellenhinweis: Für SD 3.0 wird VCCIO_SD = 1.8v verlangt.

<!-- Source EN PDF p.18; unit 128 -->

Bei dauerhafter Versorgung von VCC_SD/VCCIO_SD sicherstellen, dass beide Spannungen beim Einstecken oder Entfernen der Karte nicht einbrechen.

<!-- Source EN PDF p.18; unit 129 -->

(2) SDIO

<!-- Source EN PDF p.19; unit 130 -->

![Originalschaltung der SDIO-Daten- und Befehlsleitungen](/docs/rockchip-sdmmc-sdio-emmc/assets/en-p019-X108.png)

*Originalschaltung der SDIO-Daten- und Befehlsleitungen — Quelle der Originalabbildung: EN PDF p.19.*

<!-- Source EN PDF p.19; unit 131 -->

![Originalschaltung der WiFi-IO-Versorgung und Steuerung](/docs/rockchip-sdmmc-sdio-emmc/assets/en-p019-X109.png)

*Originalschaltung der WiFi-IO-Versorgung und Steuerung — Quelle der Originalabbildung: EN PDF p.19.*

<!-- Source EN PDF p.19; unit 132 -->

![Originalschaltung des WiFi-Oszillators und seiner Versorgung](/docs/rockchip-sdmmc-sdio-emmc/assets/en-p019-X110.png)

*Originalschaltung des WiFi-Oszillators und seiner Versorgung — Quelle der Originalabbildung: EN PDF p.19.*

<!-- Source EN PDF p.19; unit 133 -->

Zunächst die Hardware betrachten: Die wesentlichen Teile liegen innerhalb des grünen Rechtecks.

<!-- Source EN PDF p.19; unit 134 -->

WIFI_D0~3: Datenleitungen, normalerweise hoher Pegel; die Spannung hängt von VCCIO_WL ab.

<!-- Source EN PDF p.19; unit 135 -->

WIFI_CMD: Befehlsleitung, normalerweise hoher Pegel; die Spannung hängt von VCCIO_WL ab.

<!-- Source EN PDF p.19; unit 136 -->

WIFI_CLK: Takt, normalerweise niedriger Pegel; die Spannung hängt von VCCIO_WL ab.

<!-- Source EN PDF p.19; unit 137 -->

VBAT_WL: Versorgung des WIFI-Moduls, dauerhaft hoher Pegel; die Quelle nennt 3.3v (unklare Originalformulierung: „print“).

<!-- Source EN PDF p.19-20; unit 138 -->

VCCIO_WL: IO-Versorgung für DATA/CMD/CLK, 3.3 oder 1.8v möglich; bei SDIO3.0 sind 1.8v erforderlich.

<!-- Source EN PDF p.20; unit 140 -->

WIFI_REG_ON: 3.3v im normalen Betrieb, 0v bei ausgeschaltetem WiFi.

<!-- Source EN PDF p.20; unit 141 -->

Zwei Quarzoszillatoren: 32K und 26M/37.4M; beide liefern im normalen Betrieb Ausgangssignale.

<!-- Source EN PDF p.20; unit 142 -->

(3) eMMC

<!-- Source EN PDF p.20; unit 143 -->

![Originalschaltung und Versorgung von eMMC](/docs/rockchip-sdmmc-sdio-emmc/assets/en-p020-X113.png)

*Originalschaltung und Versorgung von eMMC — Quelle der Originalabbildung: EN PDF p.20.*

<!-- Source EN PDF p.20; unit 144 -->

Zulässige eMMC-Spannungskombinationen:

<!-- Source EN PDF p.20; unit 145 -->

![Originaltabelle der eMMC-Spannungskombinationen](/docs/rockchip-sdmmc-sdio-emmc/assets/en-p020-X114.png)

*Originaltabelle der eMMC-Spannungskombinationen — Quelle der Originalabbildung: EN PDF p.20.*

| VCC / VCCQ | 1.1 V–1.3 V | 1.70 V–1.95 V | 2.7 V–3.6 V |
| --- | --- | --- | --- |
| 2.7 V–3.6 V | Gültig | Gültig | Gültig (1) |
| 1.7 V–1.95 V | Gültig | Gültig | UNGÜLTIG |

Hinweis 1: Der VCCQ-(I/O)-Bereich von 3.3 V wird weder bei HS200- noch bei HS400-Geräten unterstützt.

<!-- Source EN PDF p.20; unit 146 -->

VCC_FLASH entspricht VCC.

<!-- Source EN PDF p.20; unit 147 -->

VCC_IO entspricht VCCQ.

<!-- Source EN PDF p.20; unit 148 -->

Sicherstellen, dass eMMC_CMD/DATA0~7/VCC_IO dieselbe Spannung haben: 1.8 oder 3.3v.

<!-- Source EN PDF p.20; unit 149 -->

VCC_FLASH/VCC_IO müssen beim Einschalten, im Betrieb sowie beim Schlafen und Aufwachen stabil bleiben, ohne Einbrüche oder übermäßige Welligkeit.

<!-- Source EN PDF p.20; unit 150 -->

Wenn möglich, die Signalqualität von clk, cmd und data messen und einen normalen Signalverlauf sicherstellen.

<!-- Source EN PDF p.20; unit 151 -->

### 4.2 Signalanalyse

<!-- Source EN PDF p.20; unit 152 -->

Die folgende Zeitdarstellung zeigt die Erkennung einer SD-Karte; für sdio und emmc gilt Entsprechendes.

<!-- Source EN PDF p.21; unit 153 -->

Zur SD-Kartenerkennung: Der Controller sendet 48clk mit 48bit Daten an die Karte. Die Karte muss dem Controller mit 48clk und 48bit Daten antworten, wie nachstehend dargestellt.

<!-- Source EN PDF p.21; unit 154 -->

![Originaldiagramm von Befehlen und Antworten](/docs/rockchip-sdmmc-sdio-emmc/assets/en-p021-X118.png)

*Originaldiagramm von Befehlen und Antworten — Quelle der Originalabbildung: EN PDF p.21.*

<!-- Source EN PDF p.21; unit 155 -->

![Originaloszillogramm von Hostbefehl und Kartenantwort](/docs/rockchip-sdmmc-sdio-emmc/assets/en-p021-X119.png)

*Originaloszillogramm von Hostbefehl und Kartenantwort — Quelle der Originalabbildung: EN PDF p.21.*

<!-- Source EN PDF p.21; unit 156 -->

Grün: SDMMC_CLK.

<!-- Source EN PDF p.21; unit 157 -->

Gelb: SDMMC_CMD; im Ruhezustand bleibt SDMMC_CMD auf hohem Pegel.

<!-- Source EN PDF p.21; unit 158 -->

Controllersignal: Sind die ersten beiden Pegel einmal hoch und einmal niedrig, handelt es sich um den vom Controller gesendeten Befehl.

<!-- Source EN PDF p.21; unit 159 -->

SD-Kartenantwort: Zwei aufeinanderfolgende niedrige Pegel am Anfang zeigen die Antwort der Karte an.

<!-- Source EN PDF p.21; unit 160 -->

Befehl und Antwort enthalten gewöhnlich 48 Bit; 48 Takte bilden daher ein vollständiges Paket. Zu prüfen ist, ob die Karte nach dem Senden des Befehlspakets durch den Controller antwortet.

<!-- Source EN PDF p.21; unit 161 -->

### 4.3 Protokollanalyse

<!-- Source EN PDF p.21; unit 162 -->

(1) Protokoll einer korrekt erkannten SD-Karte

<!-- Source EN PDF p.22; unit 163 -->

```text
[ 293.194013] mmc1: new high speed SDXC card at address 59b4
[ 293.198185] mmcblk1: mmc1:59b4 00000 59.6 GiB
[ 293.204351] mmcblk1: p1
```

<!-- Source EN PDF p.22; unit 164 -->

Diese Kernelmeldungen zeigen, dass die SD-Karte korrekt erkannt wurde und eine nutzbare Partition p1 vorhanden ist.

<!-- Source EN PDF p.22; unit 165 -->

Ist die SD-Karte in der Benutzeroberfläche nicht sichtbar oder nicht nutzbar, den Datenträgerdienst im Userspace prüfen, beispielsweise vold.

<!-- Source EN PDF p.22; unit 166 -->

Zusätzlich lässt sich die Partition manuell auf Nutzbarkeit prüfen:

<!-- Source EN PDF p.22; unit 167 -->

```text
mount -t vfat /dev/block/mmcblk1p1 /mnt
```

<!-- Source EN PDF p.22; unit 168 -->

oder

<!-- Source EN PDF p.22; unit 169 -->

```text
mount -t vfat /dev/block/mmcblk1 /mnt
```

<!-- Source EN PDF p.22; unit 170 -->

Anschließend im Verzeichnis mnt prüfen, ob Dateien der SD-Karte vorhanden sind.

<!-- Source EN PDF p.22; unit 171 -->

(2) Beim Start wird die Karte nicht gelesen, nach erneutem Einstecken im Betrieb funktioniert sie: Wahrscheinlich liegt ein Versorgungsproblem vor.

<!-- Source EN PDF p.22; unit 172 -->

Beispielsweise alle Versorgungen trennen und prüfen, ob bei angeschlossenem HDMI ein Leckstrom nach VCC_SD auftritt. Alternativ mit einer externen Versorgung testen.

<!-- Source EN PDF p.22; unit 173 -->

(3) Einhängen fehlgeschlagen:

<!-- Source EN PDF p.22; unit 174 -->

Wenn das Protokoll aus (1) vorhanden ist, anschließend jedoch folgende Einhängefehler auftreten:

<!-- Source EN PDF p.22; unit 175 -->

```text
[ 2229.405694] FAT-fs (mmcblk1p1): bogus number of reserved sectors
[ 2229.405751] FAT-fs (mmcblk1p1): Can't find a valid FAT filesystem
```

<!-- Source EN PDF p.22; unit 176 -->

Die Quelle empfiehlt, die SD-Karte mit FAT32 zu formatieren.

<!-- Source EN PDF p.22; unit 177 -->

Alternativ für NTFS dessen Dateisystemunterstützung mit `make menuconfig` auswählen.

<!-- Source EN PDF p.22; unit 178 -->

(4) Gelegentlich fehlende Kartenerkennung:

<!-- Source EN PDF p.22; unit 179 -->

```text
mmc1: new high speed SD card at address b368
mmcblk1: mmc1:b368 SMI 486 MiB
[mmc1] Data transmission error !!!! MINTSTS: [0x00002000]
dwmmc_rockchip ff0c0000.rksdmmc: data FIFO error (status=00002000)
mmcblk1: error -110 sending status command, retrying
need_retune:0,brq->retune_retry_done:0.
```

<!-- Source EN PDF p.22; unit 180 -->

Frequenz senken und Kartenerkennungsverzögerung erhöhen, um die Versorgungsstabilität zu verbessern. Hilft die Frequenzsenkung, das Hardwarelayout prüfen.

<!-- Source EN PDF p.22; unit 181 -->

```text
&sdmmc {
    card-detect-delay = <1200>;
}
```

<!-- Source EN PDF p.23; unit 182 -->

(5) Die TF-Karte ist eingehängt, ihr Verzeichnis jedoch nicht zugänglich. Dies deutet auf ein Dateisystemproblem hin, obwohl die Karte unter Windows nutzbar ist.

<!-- Source EN PDF p.23; unit 183 -->

Versuchen, die TF-Karte mit fsck zu reparieren.

<!-- Source EN PDF p.23; unit 184 -->

(6) Hardwareproblem: ungewöhnliche IO-Spannung.

<!-- Source EN PDF p.23; unit 185 -->

```text
Workqueue: kmmcd mmc_rescan
[<c0013e24>] (unwind_backtrace+0x0/0xe0) from [<c001172c>] (show_stack+0x10/0x14)
[<c001172c>] (show_stack+0x10/0x14) from [<c04fa444>] (dw_mci_set_ios+0x9c/0x21c)
[<c04fa444>] (dw_mci_set_ios+0x9c/0x21c) from [<c04e7748>] (mmc_set_chip_select+0x18/0x1c)
[<c04e7748>] (mmc_set_chip_select+0x18/0x1c) from [<c04ebd5c>] (mmc_go_idle+0x94/0xc4)
[<c04ebd5c>] (mmc_go_idle+0x94/0xc4) from [<c0748d80>] (mmc_rescan_try_freq+0x54/0xd0)
[<c0748d80>] (mmc_rescan_try_freq+0x54/0xd0) from [<c04e85d0>] (mmc_rescan+0x2c4/0x390)
[<c04e85d0>] (mmc_rescan+0x2c4/0x390) from [<c004d738>] (process_one_work+0x29c/0x458)
[<c004d738>] (process_one_work+0x29c/0x458) from [<c004da88>] (worker_thread+0x194/0x2d4)
[<c004da88>] (worker_thread+0x194/0x2d4) from [<c0052fb4>] (kthread+0xa0/0xac)
[<c0052fb4>] (kthread+0xa0/0xac) from [<c000da98>] (ret_from_fork+0x14/0x3c)
1409..dw_mci_set_ios: wait for unbusy timeout....... STATUS = 0x306 [mmc1]
```

<!-- Source EN PDF p.23; unit 186 -->

Prüfen, ob CMD und DATA unbelastet hohen Pegel haben. Sicherstellen, dass die IO-Spannung nicht zu niedrig ist und zur Konfiguration der Versorgungsdomäne passt. Bei SDIO außerdem VCCIO_WL, VBAT_WL, WIFI_REG_ON und den Quarzoszillator prüfen. Untersuchen, ob zu lange Leiterbahnen die Signalqualität verschlechtern; mit verringerter Frequenz testen.

<!-- Source EN PDF p.23; unit 187 -->

### 4.4 Weitere Probleme

<!-- Source EN PDF p.23; unit 188 -->

(1) Die SD-Karte funktioniert mit 1 Leitung, meldet aber mit 4 Leitungen Fehler. Die chinesische Quelle, S. 20, nennt ausdrücklich u-boot als Kontext; dies fehlt in der englischen Überschrift.

<!-- Source EN PDF p.23; unit 189 -->

Bei den meisten SoCs teilen sich SD-Karte und JTAG die Leitungen. Ohne eingesteckte Karte schaltet der SoC die IOs automatisch auf JTAG.

<!-- Source EN PDF p.23; unit 190 -->

Die EVB-Referenzplatine verwendet entsprechend den SoC-Anforderungen einen niedrigen SD-DET-Pegel für eine eingesteckte Karte. Wird die Schaltung so geändert, dass eine Karte einen hohen SD-DET-Pegel erzeugt, kann der SoC den Zustand falsch erkennen und auf JTAG umschalten.

<!-- Source EN PDF p.23; unit 191 -->

Lösung: Die GRF-Registerdefinition des Chips nachschlagen und force_jtag auf Disable setzen, um die automatische JTAG-IO-Umschaltung zu deaktivieren.

<!-- Source EN PDF p.23; unit 192 -->

Referenzcode für RV1126:

<!-- Source EN PDF p.23-24; unit 193 -->

```text
diff --git a/arch/arm/mach-rockchip/rv1126/rv1126.c b/arch/arm/mach-rockchip/rv1126/rv1126.c
index 311310d3f2..29b694df9c 100644
--- a/arch/arm/mach-rockchip/rv1126/rv1126.c
+++ b/arch/arm/mach-rockchip/rv1126/rv1126.c
@@ -544,6 +544,9 @@ void board_debug_uart_init(void)
 #ifndef CONFIG_TPL_BUILD
 int arch_cpu_init(void)
 {
+ struct rv1126_grf * const grf = (void *)GRF_BASE;
+
+ writel(0x00100000, &grf->iofunc_con3);
        /*
         * CONFIG_DM_RAMDISK: for ramboot that without SPL.
         */
```

<!-- Source EN PDF p.24; unit 195 -->

(2) Leckstrom verursacht Fehlfunktionen der SD-Karte

<!-- Source EN PDF p.24; unit 196 -->

Ist die IO-Versorgung des SD-Moduls nicht steuerbar und wird eine Karte vor dem Einschalten ihrer 3V3-Versorgung eingesteckt, kann Strom über die IOs in die Karte zurückfließen. Dadurch entsteht ein Zwischenpegel an der 3V3-Versorgung. Bei manchen Karten führt dies zu gelegentlichen Fehlern und schlechter Plattformkompatibilität. Der Treiber schaltet deshalb beim Einstecken zunächst die SD-IOs auf Pull-down, baut die Leckversorgung ab und schaltet anschließend 3V3 ein. Danach werden die IOs auf SD-Funktion mit Pull-up zurückgestellt. Bei hohen Kompatibilitätsanforderungen prüfen, ob `drivers/mmc/host/dw_mmc.c` im SDK-Kernel den Commit "mmc: dw_mmc: Add normal and idle pinctrl control" enthält. Den eigenen DTS-Knoten nach folgendem Beispiel um einen pinctrl-idle-Modus ergänzen. Die benötigten clk-, cmd- und data-Leitungen entsprechend der tatsächlichen Platine wählen:

<!-- Source EN PDF p.24-25; unit 197 -->

```text
--- a/arch/arm/boot/dts/rv1126-evb-v10.dtsi
+++ b/arch/arm/boot/dts/rv1126-evb-v10.dtsi
    wireless_wlan: wireless-wlan {
@@ -104,9 +99,14 @@ sdmmc_pwren: sdmmc-pwren {
            rockchip,pins = <0 RK_PA1 RK_FUNC_GPIO &pcfg_pull_none>;
        };
+ sdmmc0_idle_pins: sdmmc-idle-pins {
+ rockchip,pins =
+ <3 RK_PA2 RK_FUNC_GPIO &pcfg_pull_down>,
+ <3 RK_PA3 RK_FUNC_GPIO &pcfg_pull_down>,
+ <3 RK_PA4 RK_FUNC_GPIO &pcfg_pull_down>,
+ <3 RK_PA5 RK_FUNC_GPIO &pcfg_pull_down>,
+ <3 RK_PA6 RK_FUNC_GPIO &pcfg_pull_down>,
+ <3 RK_PA7 RK_FUNC_GPIO &pcfg_pull_down>;
+ };
    };
@@ -140,21 +140,18 @@ &sdio {
 };
 &sdmmc {
    max-frequency = <200000000>;
    no-sdio;
    no-mmc;
    bus-width = <4>;
    cap-mmc-highspeed;
    cap-sd-highspeed;
    disable-wp;
- pinctrl-names = "default";
+ pinctrl-names = "normal", "idle";
    pinctrl-0 = <&sdmmc0_clk &sdmmc0_cmd &sdmmc0_det &sdmmc0_bus4>;
+ pinctrl-1 = <&sdmmc0_idle_gpios &sdmmc0_det>;
    vmmc-supply = <&vcc3v3_sd>;
    vqmmc-supply = <&vccio_sd>;
    status = "okay";
 };
```

{% endraw %}

