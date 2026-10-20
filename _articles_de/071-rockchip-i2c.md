---
title: "Rockchip I2C: Controller-Ablauf, Timing, DTS und NACK-/Timeout-Fehlersuche"
description: "Vollständige Konfiguration von i2c-rk3x/i2c-rockchip, I2C-Werkzeuge, GPIO-Nachbildung und detaillierte Analyse von Busfehlern."
translation_key: "071-rockchip-i2c"
slug: "071-rockchip-i2c"
lang: "de"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "I2C"]
keywords: "ArmSoM Rockchip rockchip i2c"
excerpt: "Vollständige Konfiguration von i2c-rk3x/i2c-rockchip, I2C-Werkzeuge, GPIO-Nachbildung und detaillierte Analyse von Busfehlern."
---

{% raw %}

# Rockchip I2C: Controller-Ablauf, Timing, DTS und NACK-/Timeout-Fehlersuche

## Anwendbarkeit auf ArmSoM und Geltungsbereich der Quelle

Plattformreferenz zur Anpassung von ArmSoM-Systemen auf Grundlage der chinesischen/englischen V2.2.0. Keine Kombination aus Board, SDK/BSP, Kernel oder Verdrahtung wurde hier auf Hardware geprüft. Der nachstehende Geltungsbereich bedeutet nicht, dass jedes ArmSoM-Board oder jeder Kernel diese Funktionen unterstützt. Prüfen Sie den genauen SoC, Board-Schaltplan, SDK/BSP, Kernel-Treiber und Pinmux. Befehle, Patches, Protokolle und Messungen sind Quellbeispiele, keine ArmSoM-Testergebnisse.

Die chinesischen Abbildungen stammen aus dem chinesischen PDF; die englischen, russischen und deutschen Abbildungen aus dem englischen PDF.

| SoC laut Quelle | Kernel-Geltungsbereich laut Quelle |
| --- | --- |
| Alle Chips | Alle Versionen |

Rockchip I2C überträgt Daten zwischen externen Geräten über SDA und SCL. Jedes Gerät hat eine eindeutige Adresse und kann je nach Funktion senden oder empfangen; dazu gehören MCU-, LCD-, Speicher- und Tastaturschnittstellen. Der Controller unterstützt I2C/SMBus, ausschließlich Master-Modus, programmierbare Datenraten bis 400kbps (bei manchen Chips 1000kbps), 7-/10-Bit-Adressierung sowie bis zu 32 Byte je Interrupt- oder Polling-Vorgang. Der Bus benötigt Pull-up-Widerstände, deren Werte die Pull-up-Stärke bestimmen. Je nach SoC und Kernel kommt i2c-rk3x.c oder i2c-rockchip.c zum Einsatz, letzterer unter Kernel 3.10. Die Quelle nennt eine typische Höchstfrequenz von 1000K; prüfen Sie den tatsächlichen SoC und das elektrische Timing.

[Redaktionelle Hinweise](/docs/rockchip-i2c/EDITORIAL-NOTES.md) · [ArmSoM-Dokumentation](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

![I2C-Pull-up-Beschaltung für SDA/SCL — englisches Quell-PDF S.2](/docs/rockchip-i2c/assets/en-p02-bus.png)

*I2C-Pull-up-Beschaltung für SDA/SCL — englisches Quell-PDF S.2.*

<!-- Source EN PDF p.5, unit 0 -->

## 1. I2C-Ablauf

<!-- Source EN PDF p.5, unit 1 -->

Der I2C-Ablauf ist bei den beiden Treibern für Kernel 4.4 und 3.10 weitgehend gleich. Schreiben erfolgt im einfachen TX-Modus (I2C_CON[1:0] = 2'b00), Lesen üblicherweise im TRX-Modus (I2C_CON[1:0] = 2'b01). Die folgenden Ablaufdiagramme zeigen, wie Software den I2C-Controller über seine Register konfiguriert und Aufgaben ausführt. Beschrieben werden 3 Teile: Sende-, Misch- und Empfangsmodus.

<!-- Source EN PDF p.6, unit 2 -->

### 1.1 Reiner Sendemodus (I2C_CON[1:0]=2’b00)

<!-- Source EN PDF p.6, unit 3 -->

![Controller-Ablauf im reinen I2C-Sendemodus — englisches Quell-PDF S.6](/docs/rockchip-i2c/assets/en-p06-figure1.png)

*Controller-Ablauf im reinen I2C-Sendemodus — englisches Quell-PDF S.6.*

<!-- Source EN PDF p.7, unit 4 -->

### 1.2 Mischmodus (I2C_CON[1:0]=2’b01 oder I2C_CON[1:0]=2’b11)

<!-- Source EN PDF p.7, unit 5 -->

![Controller-Ablauf im I2C-Mischmodus — englisches Quell-PDF S.7](/docs/rockchip-i2c/assets/en-p07-figure1.png)

*Controller-Ablauf im I2C-Mischmodus — englisches Quell-PDF S.7.*

<!-- Source EN PDF p.8, unit 6 -->

### 1.3 Reiner Empfangsmodus (I2C_CON[1:0]=2’b10)

<!-- Source EN PDF p.8, unit 7 -->

![Controller-Ablauf im reinen I2C-Empfangsmodus — englisches Quell-PDF S.8](/docs/rockchip-i2c/assets/en-p08-figure1.png)

*Controller-Ablauf im reinen I2C-Empfangsmodus — englisches Quell-PDF S.8.*

<!-- Source EN PDF p.8, unit 8 -->

Dies ist der grundlegende I2C-Ablauf. Einzelheiten der Umsetzung finden Sie im Treibercode.

<!-- Source EN PDF p.9, unit 9 -->

## 2. I2C-Treiberparameter konfigurieren

<!-- Source EN PDF p.9, unit 10 -->

Im Mittelpunkt steht die I2C-Frequenz. Die nutzbare Frequenz hängt nicht nur vom Chip, sondern auch von den Anstiegszeiten von SCL und SDA ab: Der I2C-Standard legt Anforderungen für steigende und fallende Flanken fest, insbesondere für die Anstiegszeit. Wird der vorgeschriebene Höchstwert überschritten, kann die Kommunikation scheitern. Die folgende Abbildung zeigt die vorgeschriebenen Minimal- und Maximalwerte und ihren Zusammenhang:

<!-- Source EN PDF p.9, unit 11 -->

![I2C-Frequenz und Grenzen der Anstiegs-/Abfallzeiten — englisches Quell-PDF S.9](/docs/rockchip-i2c/assets/en-p09-figure1.png)

*I2C-Frequenz und Grenzen der Anstiegs-/Abfallzeiten — englisches Quell-PDF S.9.*

| Symbol | Parameter | Standard min. | Standard max. | Fast min. | Fast max. | Fast Plus min. | Fast Plus max. | Einheit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| fSCL | SCL-Taktfrequenz |  | 100 |  | 400 |  | 1000 | KHZ |
| Tr | SDA/SCL-Anstiegszeit |  | 1000 | 20 | 300 |  | 120 | ns |
| Tf | SDA/SCL-Abfallzeit |  | 300 | 20×(VDD/5.5V | 300 | 20×(VDD/5.5V | 300 | ns |

In der Abbildung fehlen schließende Klammern in den Formeln für das Tf-Minimum; der Quelltext bleibt wörtlich erhalten. Leere Zellen sind auch im Original leer und bedeuten nicht null.

<!-- Source EN PDF p.9, unit 12 -->

Die Anstiegszeit Tr und die Abfallzeit Tf müssen mit einem Oszilloskop gemessen werden; siehe folgende Darstellung:

<!-- Source EN PDF p.9, unit 13 -->

![Oszilloskopmessung der I2C-Anstiegs-/Abfallzeit — englisches Quell-PDF S.9](/docs/rockchip-i2c/assets/en-p09-figure2.png)

*Oszilloskopmessung der I2C-Anstiegs-/Abfallzeit — englisches Quell-PDF S.9.*

<!-- Source EN PDF p.9, unit 14 -->

Die I2C-Treiber i2c-rk3x.c und i2c-rockchip.c unterscheiden sich wie folgt:

<!-- Source EN PDF p.9, unit 15 -->

### 2.1 Treiber i2c-rk3x.c konfigurieren

<!-- Source EN PDF p.9, unit 16 -->

Die Konfiguration des Treibers i2c-rk3x.c erfolgt im DTS; Referenz ist Documentation/devicetree/bindings/i2c/i2c-rk3x.txt. Hier stehen die Einstellungen i2c-scl-rising-time-ns und i2c-scl-falling-time-ns im Mittelpunkt:

<!-- Source EN PDF p.9, unit 17 -->

clock-frequency: Die Standardfrequenz beträgt 100k und kann unverändert bleiben; andere Frequenzen müssen konfiguriert werden. Die maximal konfigurierbare Frequenz hängt von i2c-scl-rising-time-ns ab. Für 400k setzen Sie beispielsweise clock-frequency= `<400000>`; im DTS.

<!-- Source EN PDF p.9, unit 18 -->

i2c-scl-rising-time-ns: Die SCL-Anstiegszeit wird durch die Hardware bestimmt und lässt sich durch Änderung des Pull-up-Widerstands beeinflussen. Sie muss wie oben gezeigt mit dem Oszilloskop gemessen werden. Beträgt sie beispielsweise 265ns, setzen Sie i2c-scl-rising-time-ns= `<265>`; im DTS. Die Standardanstiegszeit kann beibehalten werden, doch die tatsächliche Anstiegszeit muss unter dem vom I2C-Standard für die gewählte Frequenz zugelassenen Höchstwert liegen.

<!-- Source EN PDF p.9, unit 19 -->

i2c-scl-falling-time-ns: Die SCL-Abfallzeit ändert sich üblicherweise nicht und entspricht i2c-sda-falling-time-ns. Auch hierfür ist normalerweise keine Konfiguration erforderlich.

<!-- Source EN PDF p.10, unit 20 -->

```text
&i2c1 {
    status = "okay";
    i2c-scl-rising-time-ns = <265>;
    i2c-scl-falling-time-ns = <11>;
    clock-frequency = <400000>;
    es8316: es8316@10 {
        #sound-dai-cells = <0>;
        compatible = "everest,es8316";
        reg = <0x10>;
        clocks = <&cru SCLK_I2S_8CH_OUT>;
        clock-names = "mclk";
        spk-con-gpio = <&gpio0 11 GPIO_ACTIVE_HIGH>;
        hp-det-gpio = <&gpio4 28 GPIO_ACTIVE_LOW>;
    };
};
```

<!-- Source EN PDF p.10, unit 21 -->

### 2.2 Treiber i2c-rockchip.c konfigurieren

<!-- Source EN PDF p.10, unit 22 -->

Auch i2c-rockchip.c beachtet die Beziehung zwischen I2C-Frequenz und SCL-Anstiegszeit. Ob eine höhere Frequenz möglich ist, hängt von i2c-scl-rising-time-ns ab. Die I2C-Frequenz wird direkt im Code über das Feld scl_rate der Struktur i2c_msg eingestellt. Standardmäßig bleibt sie bei 100k; folgende Konfiguration zeigt 200K:

<!-- Source EN PDF p.10, unit 23 -->

```text
struct i2c_msg xfer_msg;
xfer_msg[0].addr = client->addr;
xfer_msg[0].len = num;
xfer_msg[0].flags = client->flags;
xfer_msg[0].buf = buf;
xfer_msg[0].scl_rate = 200 * 1000; /* 200K i2c clock frequency */
```

<!-- Source EN PDF p.10, unit 24 -->

## 3. I2C verwenden

<!-- Source EN PDF p.10, unit 25 -->

Weitere Hinweise zur I2C-Nutzung stehen in Documentation/i2c/\*. Die folgenden Abschnitte konzentrieren sich auf Lesen und Schreiben:

<!-- Source EN PDF p.10, unit 26 -->

### 3.1 Kernel-Space

<!-- Source EN PDF p.10, unit 27 -->

Die Rockchip-I2C-Sende- und Empfangskommunikation verwendet die Linux-Standardschnittstelle. Hinweise zum Senden und Empfangen finden Sie unter Documentation/i2c/writing-clients im Kernel.

<!-- Source EN PDF p.11, unit 28 -->

### 3.2 User-Space

<!-- Source EN PDF p.11, unit 29 -->

I2C-Geräte werden normalerweise durch einen Kernel-Treiber gesteuert. Über /dev/i2c-%d lassen sich jedoch auch sämtliche Geräte am Bus aus dem Benutzermodus erreichen. Weitere Beschreibungen und Beispiele enthält Documentation/i2c/dev-interface im Kernel.

<!-- Source EN PDF p.11, unit 30 -->

## 4. I2C-Werkzeuge

<!-- Source EN PDF p.11, unit 31 -->

I2C-Tools sind quelloffene Werkzeuge, die sich herunterladen und cross-kompilieren lassen. Quellcode: https://www.kernel.org/pub/software/utils/i2c-tools/ oder `<git clone git://git.kernel.org/pub/scm/utils/i2c-tools/i2c-tools.git>`

<!-- Source EN PDF p.11, unit 32 -->

Nach der Kompilierung entstehen Werkzeuge wie i2cdetect, i2cdump, i2cset, i2cget und i2ctransfer, die direkt auf der Befehlszeile verwendbar sind. Alle I2C-Werkzeuge sind quelloffen. Hinweise zu Kompilierung und Verwendung stehen in README und Hilfe.

Ergänzung aus dem chinesischen PDF S.11: `i2cdetect` listet I2C-Busse und scannt deren Geräte; `i2cdump` liest alle Registerwerte eines I2C-Geräts; `i2cget` liest ein Register; `i2cset` schreibt ein Register.

<!-- Source EN PDF p.11, unit 33 -->

## 5. I2C mit GPIO nachbilden

<!-- Source EN PDF p.11, unit 34 -->

Die Nachbildung von I2C über GPIO ist im Kernel bereits umgesetzt. Siehe Documentation/devicetree/bindings/i2c/i2c-gpio.txt.

<!-- Source EN PDF p.11, unit 35 -->

Es folgt ein Beispiel für I2C-Knoten im DTS.

<!-- Source EN PDF p.11, unit 36 -->

```text
i2c@4 {
        compatible = "i2c-gpio";
        gpios = <&gpio5 9 GPIO_ACTIVE_HIGH>, /* sda */
                <&gpio5 8 GPIO_ACTIVE_HIGH>; /* scl */
        i2c-gpio,delay-us = <2>; /* ~100 kHz */
        #address-cells = <1>;
        #size-cells = <0>;
        pinctrl-names = "default";
        pinctrl-0 = <&i2c4_gpio>;
        status = "okay";
        gt9xx: gt9xx@14 {
                compatible = "goodix,gt9xx";
                reg = <0x14>;
                touch-gpio = <&gpio5 11 IRQ_TYPE_LEVEL_LOW>;
                reset-gpio = <&gpio5 10 GPIO_ACTIVE_HIGH>;
                max-x = <1200>;
                max-y = <1900>;
                tp-size = <911>;
                tp-supply = <&vcc_tp>;
                status = "okay";
        };
};
```

<!-- Source EN PDF p.12, unit 38 -->

Wegen der geringen Effizienz wird die GPIO-Methode normalerweise nicht empfohlen.

<!-- Source EN PDF p.12, unit 39 -->

## 6. Häufige I2C-Fragen

<!-- Source EN PDF p.12, unit 40 -->

Da zwei I2C-Treiber vorhanden sind, besteht auch dieses Kapitel aus zwei Teilen:

<!-- Source EN PDF p.12, unit 41 -->

### 6.1 Treiber i2c-rk3x.c

<!-- Source EN PDF p.12, unit 42 -->

#### 6.1.1 NACK-Fehler

<!-- Source EN PDF p.12, unit 43 -->

Gibt die I2C-Übertragungsschnittstelle -6 (-ENXIO) zurück, handelt es sich um einen NACK-Fehler: Das Slave-Gerät antwortet nicht. Die Ursache liegt üblicherweise bei der Peripherie. Häufige Fälle:

<!-- Source EN PDF p.12, unit 44 -->

Die I2C-Adresse ist falsch;

<!-- Source EN PDF p.12, unit 45 -->

das I2C-Slave-Gerät befindet sich in einem fehlerhaften Betriebszustand, etwa ohne Versorgung, mit falscher Einschaltreihenfolge oder mit einem Gerätefehler;

<!-- Source EN PDF p.12, unit 46 -->

das I2C-Timing erfüllt die Anforderungen des Slave-Geräts nicht, was ebenfalls NACK auslöst. Erwartet das Gerät beispielsweise ein Stop-Signal, empfängt aber einen wiederholten Start, entsteht NACK;

<!-- Source EN PDF p.12, unit 47 -->

eine durch externe Signale verursachte I2C-Busstörung ist bei Messung mit dem Oszilloskop erkennbar.

<!-- Source EN PDF p.12, unit 48 -->

#### 6.1.2 Timeout-Fehler

<!-- Source EN PDF p.12, unit 49 -->

##### 6.1.2.1 Fall 1

<!-- Source EN PDF p.12, unit 50 -->

Erscheint im I2C-Protokoll timeout, ipd: 0x00, state: 1, arbeitet der Controller fehlerhaft, erzeugt keinen Interruptstatus und kann die Startsequenz nicht senden. Mögliche Ursachen:

<!-- Source EN PDF p.12, unit 51 -->

falscher IO-MUX für den I2C-SCL- oder SDA-Pin;

<!-- Source EN PDF p.12, unit 52 -->

falsche I2C-Pull-up-Spannung, etwa zu geringe Spannung oder fehlende Pull-up-Versorgung;

<!-- Source EN PDF p.12, unit 53 -->

die Peripheriehardware hält den I2C-Pin auf einem falschen Spannungspegel;

<!-- Source EN PDF p.12, unit 54 -->

Der I2C-Takt ist nicht aktiviert oder die Taktquellenfrequenz ist zu niedrig;

<!-- Source EN PDF p.12, unit 55 -->

CON_START und CON_STOP sind gleichzeitig konfiguriert.

<!-- Source EN PDF p.13, unit 56 -->

##### 6.1.2.2 Fall 2

<!-- Source EN PDF p.13, unit 57 -->

Bei timeout, ipd: 0x10, state: 1 arbeitet der I2C-Controller korrekt, aber die CPU reagiert nicht auf seinen Interrupt. Möglicherweise ist cpu0 blockiert; der I2C-Interrupt liegt normalerweise auf cpu0, prüfbar mit dem Quellbefehl cat /proc/interrups. Oder die I2C-Interruptquelle ist abgeschaltet, sodass IRQ keine CPU-Behandlung auslösen kann.

<!-- Source EN PDF p.13, unit 58 -->

##### 6.1.2.3 Fall 3

<!-- Source EN PDF p.13, unit 59 -->

Bei timeout, ipd: 0x80, state: 1 bedeutet ipd=0x80, dass ein Slave SCL festhält. Bei mehreren Slaves muss das betreffende Gerät ermittelt werden:

<!-- Source EN PDF p.13, unit 60 -->

Die erste Methode ist das Ausschlussverfahren. Es eignet sich bei wenigen Peripheriegeräten und hoher Wiederholwahrscheinlichkeit.

<!-- Source EN PDF p.13, unit 61 -->

Die zweite Methode erfordert einen Hardwareumbau: Schalten Sie einen Widerstand in Reihe zur SCL-Leitung. Anhand des Spannungsabfalls darüber lässt sich feststellen, dass das Gerät auf der Seite mit niedrigerer Spannung die Leitung herunterzieht. Der Widerstand darf die I2C-Übertragung nicht beeinträchtigen, muss aber einen messbaren Spannungsabfall erzeugen. Üblich sind 1/20 des Pull-up-Widerstands oder mehr. Auch wenn der Host die Leitung herunterzieht, ist eine Spannungsdifferenz sichtbar. Anschaulicher ist zusätzlich eine Oszilloskopaufnahme: Vergleichen Sie die Low-Pegel verschiedener Slaves und des Hosts und suchen Sie den Pegel, der beim Fehler auftritt. Das Slave-Gerät beziehungsweise der Host mit diesem Low-Pegel verursacht das Herunterziehen des Busses.

<!-- Source EN PDF p.13, unit 62 -->

Häufig wird SDA heruntergezogen. Um den Verursacher nachzuweisen, verwenden Sie ebenfalls das oben für SCL beschriebene Verfahren.

<!-- Source EN PDF p.13, unit 63 -->

### 6.2 Treiber i2c-rockchip.c

<!-- Source EN PDF p.13, unit 64 -->

#### 6.2.1 NACK-Fehler

<!-- Source EN PDF p.13, unit 65 -->

Gibt die I2C-Übertragungsschnittstelle -11(-EAGAIN) zurück, handelt es sich um einen NACK-Fehler: Das Gegenüber antwortet nicht. Die Ursache liegt üblicherweise bei den Slave-Geräten. Häufige Fälle:

<!-- Source EN PDF p.13, unit 66 -->

Die I2C-Adresse ist falsch;

<!-- Source EN PDF p.13, unit 67 -->

das I2C-Slave-Gerät befindet sich in einem fehlerhaften Betriebszustand, etwa ohne Versorgung, mit falscher Einschaltreihenfolge oder mit einem Gerätefehler;

<!-- Source EN PDF p.13, unit 68 -->

das I2C-Timing erfüllt die Anforderungen des Slave-Geräts nicht und löst NACK aus. Erwartet das Gerät beispielsweise ein Stop-Signal, empfängt aber einen wiederholten Start, entsteht NACK;

<!-- Source EN PDF p.13, unit 69 -->

eine durch externe Signale verursachte I2C-Busstörung ist bei Messung mit dem Oszilloskop erkennbar.

<!-- Source EN PDF p.14, unit 70 -->

#### 6.2.2 Timeout-Fehler

<!-- Source EN PDF p.14, unit 71 -->

##### 6.2.2.1 Fall 1

<!-- Source EN PDF p.14, unit 72 -->

Erscheint im I2C-Protokoll timeout, ipd: 0x00, state: 1, arbeitet der Controller fehlerhaft, erzeugt keinen Interruptstatus und kann die Startsequenz nicht senden. Mögliche Ursachen:

<!-- Source EN PDF p.14, unit 73 -->

falscher IO-MUX für den I2C-SCL- oder SDA-Pin;

<!-- Source EN PDF p.14, unit 74 -->

falsche I2C-Pull-up-Spannung, etwa zu geringe Spannung oder fehlende Pull-up-Versorgung;

<!-- Source EN PDF p.14, unit 75 -->

die Peripheriehardware hält den I2C-Pin auf einem falschen Spannungspegel.

<!-- Source EN PDF p.14, unit 76 -->

Der I2C-Takt ist nicht aktiviert oder die Taktquellenfrequenz ist zu niedrig;

<!-- Source EN PDF p.14, unit 77 -->

CON_START und CON_STOP sind gleichzeitig konfiguriert.

<!-- Source EN PDF p.14, unit 78 -->

##### 6.2.2.2 Fall 2

<!-- Source EN PDF p.14, unit 79 -->

Bei timeout, ipd: 0x10, state: 1 arbeitet der I2C-Controller korrekt, aber die CPU reagiert nicht auf seinen Interrupt. Möglicherweise ist cpu0 blockiert; der I2C-Interrupt liegt normalerweise auf cpu0, prüfbar mit dem Quellbefehl cat /proc/interrups. Oder die I2C-Interruptquelle ist abgeschaltet, sodass IRQ keine CPU-Behandlung auslösen kann.

<!-- Source EN PDF p.14, unit 80 -->

##### 6.2.2.3 Fall 3

<!-- Source EN PDF p.14, unit 81 -->

Bei timeout, ipd: 0x80, state: 1 oder der Meldung scl was hold by slave bedeutet ipd=0x80, dass ein Slave SCL festhält. Bei mehreren Slaves muss das betreffende Gerät ermittelt werden:

<!-- Source EN PDF p.14, unit 82 -->

Die erste Methode ist das Ausschlussverfahren. Es eignet sich bei wenigen Peripheriegeräten und hoher Wiederholwahrscheinlichkeit.

<!-- Source EN PDF p.14, unit 83 -->

Die zweite Methode erfordert einen Hardwareumbau: Schalten Sie einen Widerstand in Reihe zur SCL-Leitung. Anhand des Spannungsabfalls darüber lässt sich feststellen, dass das Gerät auf der Seite mit niedrigerer Spannung die Leitung herunterzieht. Der Widerstand darf die I2C-Übertragung nicht beeinträchtigen, muss aber einen messbaren Spannungsabfall erzeugen. Üblich sind 1/20 des Pull-up-Widerstands oder mehr. Auch wenn der Host die Leitung herunterzieht, ist eine Spannungsdifferenz sichtbar. Anschaulicher ist zusätzlich eine Oszilloskopaufnahme: Vergleichen Sie die Low-Pegel verschiedener Slaves und des Hosts und suchen Sie den Pegel, der beim Fehler auftritt. Das Slave-Gerät beziehungsweise der Host mit diesem Low-Pegel verursacht das Herunterziehen des Busses.

<!-- Source EN PDF p.14, unit 84 -->

Häufig wird SDA heruntergezogen. Um den Verursacher nachzuweisen, verwenden Sie ebenfalls das oben für SCL beschriebene Verfahren.

<!-- Source EN PDF p.14, unit 85 -->

Die Meldung i2c is not in idle (state =x) bedeutet, dass mindestens eine I2C-Leitung Low ist. Zur Behebung siehe oben:

<!-- Source EN PDF p.14, unit 86 -->

„state=1“ bedeutet SDA Low;

<!-- Source EN PDF p.15, unit 87 -->

„state=2“ bedeutet SCL Low;

<!-- Source EN PDF p.15, unit 88 -->

„state=3“ bedeutet SCL und SDA Low.

<!-- Source EN PDF p.15, unit 89 -->

### 6.3 I2C-Wellenform

<!-- Source EN PDF p.15, unit 90 -->

Wird Ihr I2C-Problem hier nicht beschrieben, zeichnen Sie am besten die Wellenform beim Auftreten des Fehlers auf und analysieren sie. I2C-Wellenformen sind sehr hilfreich und ermöglichen die Aufklärung der meisten Probleme. Sie können beim Fehler die aktuelle I2C-Aufgabe anhalten, etwa mit while(1), sodass die zuletzt vom Oszilloskop erfasste Wellenform die des Fehlers ist. Zum Filtern lassen sich weitere Bedingungen hinzufügen, beispielsweise die I2C-Adresse des Geräts.

{% endraw %}
