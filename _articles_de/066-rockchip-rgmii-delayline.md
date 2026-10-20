---
title: "Rockchip-RGMII-Delayline: Scanfenster, rgmii-rxid und Signalintegrität"
description: "Vollständiges RGMII-Delayline-Verfahren mit Loopback-Befehlen, DTS, Vendor-Speicher, Oszilloskop-Timing und PHY-Auswahl."
translation_key: "066-rockchip-rgmii-delayline"
slug: "066-rockchip-rgmii-delayline"
lang: "de"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "RGMII"]
keywords: "ArmSoM Rockchip rockchip rgmii delayline"
excerpt: "Vollständiges RGMII-Delayline-Verfahren mit Loopback-Befehlen, DTS, Vendor-Speicher, Oszilloskop-Timing und PHY-Auswahl."
---

{% raw %}

# Rockchip-RGMII-Delayline: Scanfenster, rgmii-rxid und Signalintegrität

## Anwendbarkeit auf ArmSoM und Geltungsbereich der Quelle

Plattformreferenz zur Anpassung von ArmSoM-Systemen auf Grundlage der chinesischen und englischen V1.2.0. Hier wurde keine Kombination aus Platine, SDK/BSP, Kernel und Verdrahtung auf Hardware validiert. Der unten genannte Geltungsbereich der Quelle bedeutet nicht, dass jede ArmSoM-Platine oder jeder Kernel diese Funktionen unterstützt. Prüfen Sie den konkreten SoC, den Schaltplan der Platine, SDK/BSP, Kerneltreiber und Pinmux. Befehle, Patches, Protokolle und Messungen sind Beispiele aus der Quelle, keine ArmSoM-Testergebnisse.

Die chinesischen Abbildungen stammen aus der chinesischen PDF-Datei; die Abbildungen der englischen und russischen Fassung stammen aus der englischen PDF-Datei. Diese deutsche Fassung übernimmt die Abbildungen der englischen Artikelfassung.

| SoC laut Quelle | Kernel-Geltungsbereich laut Quelle |
| --- | --- |
| Alle Chipsätze | Alle Versionen |

Rockchip-Gigabit-Ethernet verwendet RGMII. Einstellbare TX-/RX-Verzögerungsleitungen kompensieren Unterschiede zwischen Hardwareentwürfen. Diese Anleitung erklärt, wie sich ein geeignetes Wertepaar für die Ethernet-Leistung ermitteln und die Hardware verbessern lässt, um das gültige Delayline-Fenster zu vergrößern.

[Redaktionelle Hinweise](/docs/rockchip-rgmii-delayline/EDITORIAL-NOTES.md) · [ArmSoM-Dokumentation](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source EN PDF p.5, unit 0 -->

## 1. Ermitteln der RGMII-Delayline

<!-- Source EN PDF p.5, unit 1 -->

Wenn Ihr Projekt Gigabit-Ethernet mit RGMII-Schnittstelle verwendet, muss die Delayline-Konfiguration bei jeder Hardwareabweichung neu eingestellt werden. Passt der konfigurierte Delayline-Wert nicht zur Hardware Ihres Projekts, beeinträchtigt dies die Gigabit-Ethernet-Leistung und möglicherweise sogar die grundlegenden Netzwerkfunktionen.

<!-- Source EN PDF p.5, unit 2 -->

### 1.1 Prüfen des Codes

<!-- Source EN PDF p.5, unit 3 -->

Die gesamte Implementierung befindet sich in der Datei drivers/net/ethernet/stmicro/stmmac/dwmac-rk-tool.c und lässt sich daher vergleichsweise einfach portieren. Fehlt dieser Code in Ihrem Projekt, fordern Sie über Redmine einen Patch an. Es gibt Versionen für kernel-4.4 und kernel-3.10; Kernelversionen nach kernel-4.4 sollten die Funktion bereits unterstützen.

<!-- Source EN PDF p.5, unit 4 -->

Patch für Kernel-4.4: Rockchip_RGMII_Delayline_Kernel4.4.tar.gz. Die Leistung von kernel-4.4 wurde optimiert; der Patch wurde auf Basis des aktuellen Codes erstellt. Falls die Kompilierung scheitert, wenden Sie zunächst kernel4.4_stmmac_optimize_output_performances_20191119.zip an.

<!-- Source EN PDF p.5, unit 5 -->

Patch für Kernel-3.10: Rockchip_RGMII_Delayline_Kernel3.10.tar.gz

<!-- Source EN PDF p.5, unit 6 -->

### 1.2 Prüfen der Knoten

<!-- Source EN PDF p.5, unit 7 -->

Nachdem der Code aus dem vorherigen Schritt geprüft und kompiliert wurde, werden mehrere sysfs-Knoten erzeugt. Werden sie nicht erzeugt, liegt ein Problem mit dem Patch vor. Am Beispiel des RK3399 befinden sich diese Knoten im Verzeichnis /sys/devices/platform/fe300000.ethernet :

<!-- Source EN PDF p.5, unit 8 -->

![RGMII-Delayline-sysfs-Knoten — englische Quell-PDF, S. 5](/docs/rockchip-rgmii-delayline/assets/en-p05-figure1.png)

*RGMII-Delayline-sysfs-Knoten — englische Quell-PDF, S. 5.*

Kopierbarer technischer Auszug aus dem Bild; abgeschnittener Randtext und grafische Scan-Zeilen werden nicht durch Vermutungen ergänzt. Das vollständige Quellbild bleibt oben erhalten.

```text
rk3399_all:/ # ls -l /sys/devices/platform/fe300000.ethernet/
total 0
lrwxrwxrwx 1 root root    0 2013-01-18 20:21 driver -> ../../../bus/platform/drivers/rk_gmac-dwmac
-rw-r--r-- 1 root root 4096 2013-01-18 20:21 driver_override
--w------- 1 root root 4096 2013-01-18 20:21 mac_lb
drwxr-xr-x 3 root root    0 2013-01-18 08:50 mdio_bus
-r--r--r-- 1 root root 4096 2013-01-18 20:21 modalias
drwxr-xr-x 3 root root    0 2013-01-18 08:50 net
lrwxrwxrwx 1 root root    0 2013-01-18 20:21 of_node -> ../../../firmware/devicetree/base/ethernet@fe300000
--w------- 1 root root 4096 2013-01-18 20:21 phy_lb
--w------- 1 root root 4096 2013-01-18 20:21 phy_lb_scan
drwxr-xr-x 2 root root    0 2013-01-18 08:50 power
-rw-r--r-- 1 root root 4096 2013-01-18 20:21 rgmii_delayline
lrwxrwxrwx 1 root root    0 2013-01-18 20:21 subsystem -> ../../../bus/platform
-rw-r--r-- 1 root root 4096 2013-01-18 08:50 uevent
```

<!-- Source EN PDF p.5, unit 9 -->

### 1.3 Verwendung

<!-- Source EN PDF p.5, unit 10 -->

Beachten Sie: Wenn Sie einen RTL8211E-PHY verwenden, müssen Sie vor dem Test das Netzwerkkabel entfernen.

<!-- Source EN PDF p.6, unit 11 -->

#### 1.3.1 Scannen des Delayline-Fensters

<!-- Source EN PDF p.6, unit 12 -->

Ein Scan über den Knoten phy_lb_scan liefert ein Fenster. Ermitteln Sie anschließend die Koordinaten in dessen Mitte. Der Scan muss mit der Gigabit-Geschwindigkeit 1000 ausgeführt werden.

<!-- Source EN PDF p.6, unit 13 -->

```text
echo 1000 > phy_lb_scan
```

<!-- Source EN PDF p.6, unit 14 -->

Die horizontale Achse stellt die Delayline in TX-Richtung dar (Koordinatenbereich `<0x00, 0x7f>`), die vertikale Achse die Delayline in RX-Richtung (ebenfalls `<0x00, 0x7f>`). Ein „O“ bedeutet, dass die Koordinaten des Punktes funktionieren; sämtliche übrigen Leerstellen zeigen einen fehlgeschlagenen Loopback an. Verwerfen Sie beispielsweise beim RK3399 nach dem Gigabit-Scan Zeilen oder Spalten mit dazwischenliegenden Leerstellen. Dadurch erhalten Sie ein rechteckiges Fenster und können dessen Mittelpunkt bestimmen. Die RX-Koordinaten der vertikalen Achse werden ausgegeben. Die Koordinaten der horizontalen Achse werden aufgrund der Bildschirmbreite nicht ausgegeben und müssen manuell gezählt werden, beginnend am Doppelpunkt von RX(0xXX):.

<!-- Source EN PDF p.6, unit 15 -->

![TX-/RX-Loopback-Scanfenster — englische Quell-PDF, S. 6](/docs/rockchip-rgmii-delayline/assets/en-p06-figure1.png)

*TX-/RX-Loopback-Scanfenster — englische Quell-PDF, S. 6.*

<!-- Source EN PDF p.6, unit 16 -->

Nach dem Scanfenster werden außerdem die Koordinaten des Mittelpunkts ausgegeben:

<!-- Source EN PDF p.6, unit 17 -->

![Mittelpunktkoordinaten des Delayline-Scans — englische Quell-PDF, S. 6](/docs/rockchip-rgmii-delayline/assets/en-p06-figure2.png)

*Mittelpunktkoordinaten des Delayline-Scans — englische Quell-PDF, S. 6.*

Kopierbarer technischer Auszug aus dem Bild; abgeschnittener Randtext und grafische Scan-Zeilen werden nicht durch Vermutungen ergänzt. Das vollständige Quellbild bleibt oben erhalten.

```text
[42055.560261] RX(0x7d):
[42055.711729] RX(0x7e):
[42055.857406] RX(0x7f):
[42056.002810]
[42056.002810] Find suitable tx_delay = 0x2e, rx_delay = 0x0f
```

<!-- Source EN PDF p.6, unit 18 -->

Die Signalqualität der in diesem Bild getesteten RK3399-Platine ist nicht besonders gut; daher ist das Fenster nicht sehr groß. Ebenso lässt sich für RGMII 100M ein Fenster ermitteln. Mit Echo 100 > phy_lb_scan zeigt sich ein sehr großes 100M-Fenster, das nahezu alle Koordinaten umfasst, weil 100M geringere Anforderungen an das Signal stellt als Gigabit.

<!-- Source EN PDF p.7, unit 19 -->

#### 1.3.2 Testen des Scanergebnisses

<!-- Source EN PDF p.7, unit 20 -->

Konfigurieren Sie anschließend den ermittelten Wert per Befehl im Knoten rgmii_delayline und prüfen Sie über den Knoten phy_lb, ob die TX-/RX-Datenübertragung mit dieser Konfiguration normal funktioniert. Mindestens dieser Test muss zunächst bestanden werden.

<!-- Source EN PDF p.7, unit 21 -->

```text
echo (tx delayline) (rx delayline) > rgmii_delayline
cat rgmii_delayline
echo 1000 > phy_lb
```

<!-- Source EN PDF p.7, unit 22 -->

![Konfigurierte Delayline und PHY-Loopback-Ergebnis — englische Quell-PDF, S. 7](/docs/rockchip-rgmii-delayline/assets/en-p07-figure1.png)

*Konfigurierte Delayline und PHY-Loopback-Ergebnis — englische Quell-PDF, S. 7.*

Kopierbarer technischer Auszug aus dem Bild; abgeschnittener Randtext und grafische Scan-Zeilen werden nicht durch Vermutungen ergänzt. Das vollständige Quellbild bleibt oben erhalten.

```text
[42265.031754] Set rgmii delayline tx: 0x2e, rx: 0xf
rk3399_all:/sys/devices/platform/fe300000.ethernet # cat rgmii_delayline
tx delayline: 0x2e, rx delayline: 0xf
rk3399_all:/sys/devices/platform/fe300000.ethernet # echo 1000 > phy_lb
[42270.042819] PHY loopback speed set to 1000
[42270.738739] PHY loopback: PASS
```

<!-- Source EN PDF p.7, unit 23 -->

Tragen Sie nach bestandenem Test die Delayline-Werte im DTS ein: tx_delay = `<0x2e>`; und rx_delay = `<0x0f>`;. Flashen Sie die Firmware erneut und führen Sie anschließend weitere Tests mit ping beziehungsweise Leistungstests mit iperf durch. Im Allgemeinen reicht ein Test bis zu diesem Schritt aus.

<!-- Source EN PDF p.7, unit 24 -->

```text
&gmac {
        phy-supply = <&vcc_lan>;
        clock_in_out = "output";
        assigned-clocks = <&cru SCLK_MAC>, <&cru SCLK_RMII_SRC>;
        assigned-clock-parents = <&cru PLL_NPLL>, <&cru SCLK_MAC>;
        assigned-clock-rates = <0>, <125000000>;
        phy-mode = "rgmii";
        pinctrl-names = "default";
        pinctrl-0 = <&rgmii_pins>;
        snps,reset-gpio = <&gpio3 RK_PB7 GPIO_ACTIVE_LOW>;
        snps,reset-active-low;
        snps,reset-delays-us = <0 10000 50000>;
        tx_delay = <0x2e>;
        rx_delay = <0x0f>;
        status = "okay";
};
```

<!-- Source EN PDF p.7, unit 25 -->

#### 1.3.3 Automatischer Scan

<!-- Source EN PDF p.7, unit 26 -->

Wenn ein Satz von Delayline-Werten nicht zu allen Hardwareexemplaren passt, können schlechte Hardware und ein kleines Fenster mit geringer Reserve die Ursache sein. Sie können die automatische Scanfunktion einschalten, indem Sie CONFIG_DWMAC_RK_AUTO_DELAYLINE in menuconfig aktivieren. Beachten Sie, dass das Aktivieren dieses Makros das Problem nicht vollständig löst, solange die Ursache des kleinen Fensters bestehen bleibt. Im Allgemeinen ist es nicht erforderlich, dieses Makro zu aktivieren.

<!-- Source EN PDF p.7, unit 27 -->

```text
Device Drivers →
    Network device support →
        Ethernet driver support →
            [*] Auto search rgmii delayline
```

<!-- Source EN PDF p.8, unit 28 -->

Diese Funktion führt die Ermittlung nur beim ersten Start durch und speichert danach den Delayline-Wert im Vendor-Speicher. Bei jedem folgenden Start wird der Wert direkt aus dem Vendor-Speicher gelesen und überschreibt die DTS-Konfiguration. Erst nach dem Löschen des Vendor-Speichers wird der Vorgang beim nächsten Start erneut einmal ausgeführt.

<!-- Source EN PDF p.8, unit 29 -->

Protokollausgabe beim ersten Start:

<!-- Source EN PDF p.8, unit 30 -->

```text
[ 23.532138] Find suitable tx_delay = 0x2f, rx_delay = 0x10
```

<!-- Source EN PDF p.8, unit 31 -->

Protokollausgabe bei späteren Starts:

<!-- Source EN PDF p.8, unit 32 -->

```text
[ 23.092358] damac rk read rgmii dl from vendor tx: 0x2f, rx: 0x10
```

<!-- Source EN PDF p.8, unit 33 -->

### 1.4 Modus rgmii-rxid

<!-- Source EN PDF p.8, unit 34 -->

Wenn die Hardware die RX-Verzögerung des PHY aktiviert, beispielsweise beim RTL8211F:

<!-- Source EN PDF p.8, unit 35 -->

![Auswahl der internen RX-/TX-Verzögerung des PHY — englische Quell-PDF, S. 8](/docs/rockchip-rgmii-delayline/assets/en-p08-figure1.png)

*Auswahl der internen RX-/TX-Verzögerung des PHY — englische Quell-PDF, S. 8.*

<!-- Source EN PDF p.8, unit 36 -->

muss die RX-Verzögerung des GMAC deaktiviert werden. Der im DTS konfigurierte Modus lautet dann „rgmii-rxid“, beispielsweise:

<!-- Source EN PDF p.8, unit 37 -->

```text
&gmac0 {
    /* Use rgmii-rxid mode to disable rx delay inside Soc */
    phy-mode = "rgmii-rxid";
    clock_in_out = "output";
    ......
}；
```

<!-- Source EN PDF p.8, unit 38 -->

Ein Scan mit dem oben beschriebenen Verfahren ergibt:

<!-- Source EN PDF p.8, unit 39 -->

![Reiner TX-Scan im Modus rgmii-rxid — englische Quell-PDF, S. 8](/docs/rockchip-rgmii-delayline/assets/en-p08-figure2.png)

*Reiner TX-Scan im Modus rgmii-rxid — englische Quell-PDF, S. 8.*

Kopierbarer technischer Auszug aus dem Bild; abgeschnittener Randtext und grafische Scan-Zeilen werden nicht durch Vermutungen ergänzt. Das vollständige Quellbild bleibt oben erhalten.

```text
# echo 1000 > phy_lb_scan
[ 429.089639] Delayline scan speed set to 1000
[ 429.560194] dwmac4: Master AXI performs any burst length
[ 429.859831] Find available tx_delay = 0x43, rx_delay = disable
[ 430.104205] dwmac4: Master AXI performs any burst length
[ 430.104254] rk_gmac-dwmac fe1b0000.ethernet eth1: No Safety Features support found
[ 430.104282] rk_gmac-dwmac fe1b0000.ethernet eth1: IEEE 1588-2008 Advanced Timestamp supported
[ 430.104718] rk_gmac-dwmac fe1b0000.ethernet eth1: registered PTP clock
[ 430.104758] rk_gmac-dwmac fe1b0000.ethernet eth1: configuring for phy/rgmii-rxid link mode
```

<!-- Source EN PDF p.8, unit 40 -->

Da die RX-Verzögerung nun durch die PHY-Hardware fest vorgegeben ist, üblicherweise mit 2ns, wird sie nicht gescannt. Nach dem Scan der TX-Verzögerung wird die am besten geeignete Verzögerung ermittelt. Tragen Sie diese in die Eigenschaft „tx_delay“ des gmac-Knotens im DTS ein und kommentieren Sie rx_delay aus, um es zu deaktivieren.

<!-- Source EN PDF p.9, unit 41 -->

```text
&gmac0 {
    /* Use rgmii-rxid mode to disable rx delay inside Soc */
    phy-mode = "rgmii-rxid";
    clock_in_out = "output";
    ......
    tx_delay = <0x43>;
    /* rx_delay = <0x42>; */
    phy-handle = <&rgmii_phy>;
    status = "okay";
}；
```

<!-- Source EN PDF p.9, unit 42 -->

## 2. Hardwareprüfung

<!-- Source EN PDF p.9, unit 43 -->

### 2.1 Prüfen der RGMII-Timinganforderungen

<!-- Source EN PDF p.9, unit 44 -->

Gemäß der in der Quelle als aktuell bezeichneten RGMII-Spezifikation müssen die folgenden Timinganforderungen eingehalten werden. Prüfen Sie Ihre Platine auf Konformität. Wenn Sie mit solchen Messungen nicht vertraut sind oder kein Oszilloskop zur Verfügung haben, stellen Sie eine Anfrage über Redmine.

<!-- Source EN PDF p.9, unit 45 -->

![RGMII-Timinganforderungen und Hinweise — englische Quell-PDF, S. 9](/docs/rockchip-rgmii-delayline/assets/en-p09-figure1.png)

*RGMII-Timinganforderungen und Hinweise — englische Quell-PDF, S. 9.*

| Symbol | Parameter | Min. | Typisch | Max. | Einheit |
| --- | --- | --- | --- | --- | --- |
| TskewT | Daten-Takt-Versatz am Senderausgang, Hinweis 1 | -500 | 0 | 500 | ps |
| TskewR | Daten-Takt-Versatz am Empfängereingang, Hinweis 1 | 1 | 1.8 | 2.6 | ns |
| TsetupT | Daten-Takt-Setupzeit am Senderausgang, integrierte Verzögerung, Hinweis 4 | 1.2 | 2.0 |  | ns |
| TholdT | Takt-Daten-Haltezeit am Senderausgang, integrierte Verzögerung, Hinweis 4 | 1.2 | 2.0 |  | ns |
| TsetupR | Daten-Takt-Setupzeit am Empfängereingang, integrierte Verzögerung, Hinweis 4 | 1.0 | 2.0 |  | ns |
| TholdR | Daten-Takt-Setupzeit am Empfängereingang, integrierte Verzögerung, Hinweis 4 (die Quelle wiederholt Setup) | 1.0 | 2.0 |  | ns |
| Tcyc | Taktperiodendauer, Hinweis 2 | 7.2 | 8 | 8.8 | ns |
| Duty_G | Gigabit-Tastgrad, Hinweis 3 | 45 | 50 | 55 | % |
| Duty_T | 10/100T-Tastgrad, Hinweis 3 | 40 | 50 | 60 | % |
| Tr / Tf | Anstiegs-/Abfallzeit (20–80%) |  |  | .75 | ns |

Hinweis 1: Vor RGMII 2.0 muss das Leiterplattenrouting dem jeweiligen Takt eine Verzögerung von mehr als 1.5 ns und weniger als 2.0 ns hinzufügen. Für 10/100 ist kein Maximum angegeben.

Hinweis 2: Bei 10 Mbps und 100 Mbps skaliert Tcyc auf 400 ns ±40 ns beziehungsweise 40 ns ±4 ns.

Hinweis 3: Der Tastgrad darf sich bei Geschwindigkeitsänderungen oder beim Übergang in die Taktdomäne des empfangenen Pakets verlängern beziehungsweise verkürzen, sofern das Minimum eingehalten wird und eine Verlängerung höchstens drei Tcyc der niedrigeren Geschwindigkeit dauert.

Hinweis 4: TsetupT/TholdT erlaubt eine interne TXC-/RXC-Verzögerung im Sender, bezeichnet als RGMII-ID. Geräte können diese optional aktivieren beziehungsweise deaktivieren und dabei konform bleiben. Die Beschreibung des Parameters TholdR wiederholt im Bild den Begriff Setup; dies wird nicht stillschweigend umgeschrieben.

<!-- Source EN PDF p.9, unit 46 -->

Um beispielsweise die CLK-Signalqualität bei Gigabit zu prüfen, messen Sie die Signalverläufe nahe am Empfänger. Messen Sie nicht am Sender: Dort sind Signalreflexionen stark ausgeprägt und der Verlauf bildet die tatsächliche Signalqualität nicht ab. Achten Sie bei MAC_CLK, TX_CLK und RX_CLK insbesondere auf Tastgrad, Amplitude sowie Anstiegs- und Abfallzeit. Die Bandbreite von Oszilloskop und Tastkopf muss mehr als das Fünffache von 125M betragen. Bei massebezogenen Tastköpfen sollte die Masseschleife möglichst kurz sein. Verwenden Sie nach Möglichkeit einen Differenztastkopf, um den Tastgrad im Bereich 45 % ~ 55% zu kontrollieren. Bei korrektem Messaufbau sollte das gemessene Signal rechteckig und nicht sinusförmig sein. Bei kundenseitigen Eigenmessungen erscheint häufig eine positive Sinuswelle mit 50% Tastgrad; eine solche Messung ist im Grunde nicht korrekt.

<!-- Source EN PDF p.10, unit 47 -->

#### 2.1.1 RX_CLK/MAC_CLK

<!-- Source EN PDF p.10, unit 48 -->

MAC_CLK beziehungsweise RXCLK wird vom PHY bereitgestellt. Weist das gemessene empfangene CLK-Signal Integritätsmängel auf, gibt es auf PHY-Seite im Allgemeinen kein Register zur Korrektur; möglicherweise lässt sich das Problem nur durch Hardwareanpassungen beheben. Eine in Reihe am Sender eingefügte Hochfrequenzinduktivität kann eine zu langsame Flanke verbessern. Ihre Bandbreite muss die Anforderungen erfüllen; gewöhnliche Induktivitäten sind hier daher ungeeignet. Durch eine widerstandsbasierte Spannungsanpassung am Sender lassen sich außerdem der Tastgrad beeinflussen und die Amplitude verringern.

<!-- Source EN PDF p.10, unit 49 -->

#### 2.1.2 TX_CLK

<!-- Source EN PDF p.10, unit 50 -->

Wenn TX_CLK eine zu langsame Flanke aufweist, lesen Sie das entsprechende Register per IO aus und prüfen Sie, ob die IO-Treiberstärke bereits auf das Maximum eingestellt ist. Schließen Sie ein Oszilloskop an und verändern Sie zugleich die Treiberstärke direkt per IO-Befehl, um die Änderung des Signalverlaufs zu beobachten. Verbessert die Treiberanpassung das Signal nicht wesentlich, können Sie eine Hochfrequenzinduktivität in Reihe einsetzen oder den 22ohm-Serienwiderstand ändern beziehungsweise vergrößern. Liegt der Tastgrad außerhalb der Spezifikation und wird TX_CLK direkt aus MAC_CLK durchgeschleift, lässt sich der TX_CLK-Tastgrad durch Teilen der MAC_CLK-Amplitude anpassen. Der Serienwert des Spannungsteilers beträgt 100 ohm; der Widerstand gegen Masse hängt vom Layout ab und unterscheidet sich zwischen Platinen. Erhöhen Sie ihn ausgehend von 100, bis das Oszilloskop einen spezifikationsgerechten Tastgrad zeigt. Falls diese Maßnahmen keine deutliche Wirkung haben und derzeit 3.3V-IO verwendet wird, können Sie bei Unterstützung von 1.8V-IO durch PHY und RK-Plattform die IO-Versorgung auf 1.8V ändern und erneut die Signalintegrität beobachten. Da die 1.8V-IO-Signaleigenschaften günstiger als bei 3.3V sind, wird 1.8V-IO empfohlen.

<!-- Source EN PDF p.10, unit 51 -->

## 3. Häufige Fragen

<!-- Source EN PDF p.10, unit 52 -->

### 3.1 Größe des Scanfensters

<!-- Source EN PDF p.10, unit 53 -->

Je größer das Fenster, desto besser: Es weist auf eine gute Hardware-Signalqualität und große Reserven hin. Lässt sich kein Fenster ermitteln oder ist das ermittelte Fenster zu klein, liegen im Allgemeinen Hardwareprobleme vor. Beachten Sie dazu den Abschnitt zur Hardware.

<!-- Source EN PDF p.10, unit 54 -->

### 3.2 PHY-Auswahl

<!-- Source EN PDF p.10, unit 55 -->

Für die PHY-Auswahl gibt es keine besonderen Anforderungen, solange der PHY RGMII-konform ist. Zwei Punkte sind jedoch zu beachten:

<!-- Source EN PDF p.10, unit 56 -->

Wenn Sie für Ihr Projekt den Gigabit-PHY RTL8211E einsetzen möchten, wird empfohlen, auf RTL8211F oder einen anderen PHY umzusteigen. Die Gründe werden im obigen Abschnitt 2.1 erläutert.

<!-- Source EN PDF p.10, unit 57 -->

Falls der verwendete PHY keine Loopback-Funktion hat, ermitteln Sie die Delayline mit dem folgenden Verfahren:

<!-- Source EN PDF p.11, unit 58 -->

Der PHY lässt sich anhand der mit dem Oszilloskop gemessenen Signale abstimmen. Verwenden Sie ein Oszilloskop mit einer Bandbreite von mehr als 125M und dem Fünffachen dieser Bandbreite, um die Phasendifferenz zwischen TXC und TXD nahe am PHY zu messen. Stellen Sie die Phase per IO-Befehl auf den Bereich

<!-- Source EN PDF p.11, unit 59 -->

1.5ns ~ 2ns ein. Die Spezifikation lautet 1 ~ 2.6 ns; es sollte eine gewisse Reserve verbleiben. Damit sollte TX funktionieren. Da RX jedoch innerhalb des SoC verzögert wird und kein Loopback verwendet wird, lässt es sich nur anhand des Durchsatzes beurteilen. Sobald das Register tx_delay festgelegt ist, setzen Sie rx_delay zunächst auf 0x10. Messen Sie nach der Änderung mit iperf den Downlink-Durchsatz. Das Ergebnis kann anfangs unbefriedigend sein. Ändern Sie das Register rxdelay weiter per IO-Befehl und erhöhen Sie es in Schritten von 5 im Bereich 0x10 ~ 0x7f. Wird nach dem Registerschreibzugriff ein Durchsatz von mehr als 900M gemessen, grenzen Sie den Bereich anschließend in Schritten von 2 ein, um das Registerintervall zu finden, das 900M erreicht. Übernehmen Sie schließlich dessen Mittelwert in das DTS.

<!-- Source EN PDF p.11, unit 60 -->

Signalverlauf der TXC-/TXD-Phase:

<!-- Source EN PDF p.11, unit 61 -->

![Signalverlauf der TXC-/TXD-Phasenmessung — englische Quell-PDF, S. 11](/docs/rockchip-rgmii-delayline/assets/en-p11-figure1.png)

*Signalverlauf der TXC-/TXD-Phasenmessung — englische Quell-PDF, S. 11.*

{% endraw %}

