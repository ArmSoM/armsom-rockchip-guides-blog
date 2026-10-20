---
title: "Rockchip-SLAVE-DSMC-Anleitung: Local Bus, reservierter Speicher und Interrupts"
description: "Rockchip-SLAVE-DSMC-Anleitung zu Local Bus, reserviertem Speicher und Interrupts mit vollständigen technischen Abschnitten, Code, Parametern und Quellenhinweisen."
translation_key: "056-rockchip-slave-dsmc"
slug: "056-rockchip-slave-dsmc"
lang: "de"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["Rockchip", "DSMC"]
keywords: "ArmSoM Rockchip rockchip-slave-dsmc"
excerpt: "Rockchip-SLAVE-DSMC-Anleitung zu Local Bus, reserviertem Speicher und Interrupts mit vollständigen technischen Abschnitten, Code, Parametern und Quellenhinweisen."
---

{% raw %}

# Rockchip-SLAVE-DSMC-Anleitung: Local Bus, reservierter Speicher und Interrupts

Dieser vollständige, quellenbasierte technische Artikel ist eine ArmSoM-Plattformreferenz. Geltungsbereich der Quelle: RK3506, Linux-Kernel 6.1. Prüfen Sie vor der Verwendung die konkrete Platine, den SoC, den SDK-/BSP-Zweig, die Pins und die Peripherie. Eine Hardwarevalidierung auf Platinenebene wurde nicht durchgeführt; eine Unterstützung auf allen ArmSoM-Platinen wird nicht vorausgesetzt. Ausgaben und Messungen sind Beispiele aus der Quelle, keine ArmSoM-Testergebnisse.

Die chinesische Fassung folgt der chinesischen Quelle, die englische der englischen Quelle; die russische Fassung übersetzt deren vollständigen technischen Haupttext. Auch die deutsche Fassung folgt vollständig dem englischen Artikel. Code, Kommentare und Befehlsausgaben bleiben in ihrer Quellsprache. Die chinesische Fassung verwendet Abbildungen aus der chinesischen PDF-Datei; Englisch, Russisch und Deutsch verwenden die Abbildungen der englischen PDF-Datei.

Versionen: Chinesisch V1.0.0 und Englisch V1.0.1; die englische Änderungshistorie vermerkt Korrekturen chinesischer Schriftzeichen. Die technischen Inhalte entsprechen einander; der Interrupt-Abschnitt trägt in der chinesischen Fassung die Nummer 2.4, in der englischen und russischen Fassung die Nummer 3. Die deutsche Fassung übernimmt die englische Nummerierung. Originalnummerierung und Codebezeichner bleiben erhalten.

**Vorsicht bei der Anwendung:** Reservierter Speicher, DMA, Pin-Multiplexing und Geräteschreibzugriffe beeinflussen die Hardware. Die Befehle werden zum Nachlesen bereitgestellt; es wurden keine Hardwareoperationen ausgeführt. Prüfen Sie Schaltplan, Stromversorgung, Timing und das konkrete Gerät. xxx oder Auslassungspunkte im DTS sind Platzhalter der Quelle, keine vollständige einsatzfähige Konfiguration.

Quellen und Korrekturen: [EDITORIAL-NOTES](/docs/rockchip-slave-dsmc/EDITORIAL-NOTES.md). Offizielle Referenzen: [ArmSoM](https://docs.armsom.org/), [Rockchip Linux](https://github.com/rockchip-linux).

Produktversionstabelle der Quelle (PDF S. 2; Geltungsbereich der Quelle, keine Validierung auf Platinenebene):

| Chipsatz | Kernelversion |
| --- | --- |
| RK3506 | kernel 6.1 |

<!-- Source EN PDF p.4, block 0 -->

## 1. Überblick

<!-- Source EN PDF p.4, block 1 -->

Der Slave Double Data Rate Serial Memory Controller (SLAVE DSMC) arbeitet als Slave des DSMC und unterstützt ausschließlich das Local-Bus-Protokoll. Er muss zusammen mit dem von RK entwickelten DSMC-Hostcontroller oder einem Controller mit demselben Übertragungsprotokoll verwendet werden. Beispielsweise lassen sich zwei RK3506-EVBs verbinden: Ein EVB arbeitet als DSMC-Host, das andere als DSMC-Local-Bus-Slave. Die Verbindung ist in der folgenden Abbildung dargestellt:

<!-- Source EN PDF p.4, block 2 -->

![Verbindungsbeispiel der Quelle mit zwei RK3506-EVBs](/docs/rockchip-slave-dsmc/assets/en-p04-figure1.png)

<!-- Source EN PDF p.4, block 3 -->

## 2. SLAVE-DSMC-Treiber

<!-- Source EN PDF p.4, block 4 -->

### 2.1 Treiberdateien

<!-- Source EN PDF p.4, block 5 -->

Die Treiberdateien für SLAVE DSMC befinden sich unter folgenden Pfaden:

<!-- Source EN PDF p.4, block 6 -->

```text
drivers/memory/rockchip/dsmc-lb-slave.c /* DSMC local bus slave driver */
```

<!-- Source EN PDF p.4, block 7 -->

### 2.2 DTS-Konfiguration

<!-- Source EN PDF p.4, block 8 -->

```text
&dsmc_lb_slave {
    memory-region = <&dsmc_lb_slave_mem>; /* Memory region for dsmc local bus
slave */
    status = "okay"; /* Enable dsmc local bus slave */
};
&reserved_memory {
    /*
     * Memory region for dsmc local bus slave, generally occupying a continuous
space in DDR
     */
    dsmc_lb_slave_mem: dsmc-lb-slave-mem@6000000 {
        compatible = "rockchip,dsmc-lb-slave-mem";
        /* Define the start address and size of the memory space for dsmc local
bus slave */
        reg = <0x6000000 0x2000000>;
    };
};
```

<!-- Source EN PDF p.5, block 10 -->

Standardmäßig dient der dem DSMC-Local-Bus-Slave zugewiesene Speicherbereich als Merged-FIFO-Speicher des DSMC-Hosts. Daher muss der Speicherbereich des DSMC-Local-Bus-Slaves mit der Konfiguration der Eigenschaft rockchip,ranges auf der DSMC-Hostseite übereinstimmen.

<!-- Source EN PDF p.5, block 11 -->

### 2.3 Kernelkonfiguration

<!-- Source EN PDF p.5, block 12 -->

```text
Symbol: ROCKCHIP_DSMC_SLAVE [=y]
                             │
  │ Type : tristate
                             │
  │ Prompt: Rockchip Double Data Rate Serial Memory Controller(DSMC) slave
driver
                                 │
  │ Depends on: MEMORY [=y] && ARCH_ROCKCHIP
                             │
  │ Location:
                           │
  │ -> Device Drivers
                           │
  │ -> Memory Controller drivers (MEMORY [=y])
                             │
  │ -> Rockchip Double Data Rate Serial Memory Controller(DSMC) slave
driver (ROCKCHIP_DSMC_SLAVE [=y])
                    │
```

<!-- Source EN PDF p.6, block 13 -->

## 3. Interrupts

<!-- Source EN PDF p.6, block 14 -->

Der DSMC-Slave-Treiber registriert eine Interrupt-Service-Routine. Schreibt der DSMC-Host in das Register LBC_CONx des DSMC-Slaves, wird der Interrupt SLAVE_DSMC ausgelöst (host2slave-Interrupt). Nachdem die DSMC-Slave-CPU den Interrupt empfangen hat, führt sie die Interrupt-Service-Routine rockchip_dsmc_lb_slave_irq aus. Wird ein Wert ungleich null in LBC_CON15 geschrieben, löst diese durch Schreiben in APP_CON15 den slave2host-Interrupt aus. Nach Empfang des Interrupts erzeugt der DSMC-Host automatisch eine bestimmte Anzahl von DMA-Hardwareanforderungen und löst damit die DMA-Übertragung aus.

{% endraw %}

