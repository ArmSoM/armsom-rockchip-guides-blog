---
title: "Vollständige RK818/RK816-Protokollerläuterung: Ladegerät, OTG und Akkuzustände"
description: "Vollständige RK818/RK816-Protokollerläuterung: Ladegerät, OTG und Akkuzustände — V1.1.0"
excerpt: "Vollständige RK818/RK816-Protokollerläuterung: Ladegerät, OTG und Akkuzustände — V1.1.0"
translation_key: 126-rockchip-rk818-rk816-fuel-gauge-log
slug: 126-rockchip-rk818-rk816-fuel-gauge-log
lang: de
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: linux
products: []
tags: [ArmSoM, Rockchip, PMIC, DTS, battery]
---

{% raw %}

# Vollständige RK818/RK816-Protokollerläuterung: Ladegerät, OTG und Akkuzustände

Chinesische Quelle V1.1.0; Kernelbereich 4.4 / 4.19. Der technische Vorwortumfang umfasst Modulkonzepte, Funktionen, Konfiguration und Fehlersuche. Kein englisches PDF liegt vor: Alle vier Sprachen basieren vollständig auf der chinesischen Quelle und nutzen vorhandene technische Originalbilder daraus. Nur ArmSoM-Plattformreferenz: PMIC, SoC, SDK/BSP, Kernel, Versorgungsbaum und Akkuspezifikation der konkreten Platine prüfen. Keine Hardwaretests oder pauschale Platinenunterstützung.

> Code, Parameter und Logs sind Herstellerbeispiele, keine ArmSoM-Messungen. Änderungen an Versorgung, Ladestrom, Spannung oder Temperaturregelung können Abschaltung, Schäden oder Akkurisiken verursachen. Beispiele nicht ungeprüft übernehmen; thermischen Schutz im Normalbetrieb niemals deaktivieren. Quellenwidersprüche bleiben ohne erratene Konstanten erhalten; siehe Prüfnotizen. Logs sind Quellenbeispiele; Phasenwerte belegen weder einen durchgehenden Test noch den tatsächlichen Akkuzustand.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

Technisches Vorwort: RK818/RK816 implementieren Ladezustandsmessung und Ladeverwaltung ähnlich. RK818 erläutert wichtige Phasenlogs; für RK816 gelten dieselben Erklärungen.

## 1. Ladegerät-/OTG-Erkennung

### 1.1 Treiberdateien

```text
drivers/power/rk818_charger.c
```

Dieser Treiber erkennt Anschluss/Trennung von Ladegeräten und OTG und konfiguriert den Ladestrom. Meldungen beginnen mit "rk818-charger: ". "ac", "usb", "dc", "otg" kennzeichnen Geräte: 1 bedeutet verbunden, 0 getrennt. Der PMIC selbst erkennt keine Anschlussereignisse von Ladegeräten/OTG; die Ladegerättyp-Erkennung beruht auf der USB-Benachrichtigungskette.

### 1.2 probe Phase

Registrierung des DC-Ladegeräts:

```text
rk818-charger: support dc
rk818-charger: not support dc
```

Registrierung der Type-C-Ladegerät-Benachrichtigungskette:

```text
rk818-charger: register typec extcon evt notifier
```

Registrierung der Benachrichtigungskette für herkömmliche USB-Ladegeräte:

```text
rk818-charger: register bc evt notifier
```

Geräteverbindungen am Ende von probe:

```text
rk818-charger: ac=1, usb=0, dc=0, otg=0
```

Treiberversion:

```text
rk818-charger: driver version: 2.0
```

### 1.3 running Phase

Anschluss-/Trennmeldungen für Ladegerät/OTG aus der USB-Benachrichtigungskette:

```text
rk818-charger: receive bc notifier event: DISCNT    // 充电器拔出
rk818-charger: receive bc notifier event: USB       // 电脑充电插⼊
rk818-charger: receive bc notifier event: AC        // 标准充电器插⼊
rk818-charger: receive bc notifier event: CDP1.5A   // CDP类型充电器插⼊
rk818-charger: receive bc notifier event: UNKNOWN   // 不识别的充电器插⼊
rk818-charger: receive bc notifier event: OTG ON    // OTG插⼊
rk818-charger: receive bc notifier event: OTG OFF   // OTG拔出
rk818-charger: detect dc charger in                 // DC插⼊
rk818-charger: detect dc charger out                // DC拔出
```

Der PMIC kann den Ladegerättyp nicht bestimmen, erkennt aber angeschlossene Ladeausrüstung:

```text
rk818-charger: pmic: plug out
rk818-charger: pmic: plug in
```

Änderungen der 5V-Versorgung beim Anschluss/Trennen von OTG-Geräten:

```text
rk818-charger: disable otg5v
rk818-charger: enable otg5v
```

Nach jedem Anschluss/Trennen von Ladegerät/OTG werden Geräte- und Strominformationen aktualisiert:

```text
rk818-charger: ac=1 usb=0 dc=0 otg=0 v=4200 chrg=1000 input=1800 virt=0
```

### 1.4 suspend Phase

Änderungen der OTG-5V-Versorgung bei suspend:

```text
rk818-charger: suspend: otg 5v on
rk818-charger: suspend: otg 5v off
```

### 1.5 shutdown Phase

Aktuelle Geräteverbindungen bei shutdown:

```text
rk818-charger: shutdown: ac=1 usb=0 dc=0 otg=0
```

## 2. Akkuladungserkennung

### 2.1 Treiberdateien

```text
drivers/power/rk818_battery.c
drivers/power/rk818_battery.h
```

Dieser Treiber implementiert die Ladezustandsmessung und erfasst die Batterieladung. Zur Erkennung tragen Meldungen den Präfix "rk818-bat: ".

### 2.2 probe Phase

Beim ersten Einschalten nach Anschluss einer Batterie erscheint "first on":

```text
rk818-bat: first on: dsoc=24, rsoc=24 cap=960, fcc=4000, ov=3840
```

Führt ein ungewöhnliches Abschalten, etwa weiterer Verbrauch nach einem Absturz, zu einem falschen Coulomb-Zählerzustand, erfolgt beim nächsten Start eine erzwungene Korrektur:

```text
rk818-bat: system halt last time... cap: pre=2400, now=120
```

Hat U-Boot die Ladezustandsmessung bereits initialisiert, kann der Kerneltreiber Teile der Initialisierung überspringen, um Wiederholungen zu vermeiden:

```text
rk818-bat: initialized yet..
```

Initialzustand des Coulomb-Zählers während probe:

```text
rk818-bat: dsoc=32 cap=1000 v=3780 ov=3900 rv=3890 min=25 psoc=32 pcap=1000
```

Version der Ladezustandsmessung:

```text
rk818-bat: driver version 7.1
```

### 2.3 running Phase

Bei jeder Ladungsänderung und Meldung an das Framework erscheinen folgende Ausgaben. Die erste enthält aktuelle Parameterzustände; die zweite die bei der Boot-Initialisierung erfassten Zustände, hauptsächlich zur Fehlersuche.

```text
rk818-bat: changed: dsoc=22, rsoc=24, v=3820, ov=3770 c=1018, cap=960, f=4000,
st=cc cv, hotdie=0
rk818-bat: dl=10, rl=12, v=3670, halt=0, halt_n=0, max=0, init=0, sw=0, calib=0,
below0=0, force=0
```

### 2.4 suspend Phase

Nach Eintritt in den Tiefschlaf kann lange Bereitschaft die Batteriespannung unter die Abschaltschwelle senken. Der PMIC erzeugt dann einen Aufweckinterrupt; anschließend wird abgeschaltet:

```text
rk818-bat: lower power yet, power off system! v=3350, c=-125, dsoc=0
```

### 2.5 shutdown Phase

Wichtige Informationen bei shutdown:

```text
rk818-bat: shutdown: dl=0 rl=2 c=-1220 v=3460 cap=88 f=4000 ch=1 n=0 mode=1
rest=128
```

Bedeutung in Reihenfolge: `<angezeigter SOC>` `<tatsächlicher SOC>` `<Strom>` `<Spannung>` `<Restkapazität>` `<Vollladekapazität>` `<Ladegerät vorhanden?>` `<übrige Felder ignorieren…>`.

## 3. Zur RK816-Ladezustandsmessung

Die RK816-Ladezustandsmessung ähnelt weitgehend RK818. Ladegeräterkennung und Änderungen der Ladezustandsmessung sind zusammengefasst in:

```text
drivers/power/rk816_battery.c
```

Der Meldungsinhalt ähnelt RK818 stark; der Präfix "rk816-bat:" dient zur Kennzeichnung. Für RK816 gelten die obigen Erläuterungen zu RK818.

{% endraw %}
