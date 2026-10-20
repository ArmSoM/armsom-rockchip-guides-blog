---
title: "Rockchip RK3399 MCU: Perilp M0, Mailbox, Firmware erstellen und debuggen"
description: "Vollständige MCU-Startadressen, SGRF-Abbildung, Takt/Reset, SWD, SCPI und Quellcode mit dokumentierten CN/EN-Branchabweichungen."
translation_key: "082-rockchip-rk3399-mcu"
slug: "082-rockchip-rk3399-mcu"
lang: "de"
date: "2026-10-20"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "RK3399", "MCU", "Cortex-M0"]
keywords: "ArmSoM Rockchip RK3399 MCU Cortex-M0 Mailbox"
excerpt: "Vollständige MCU-Startadressen, SGRF-Abbildung, Takt/Reset, SWD, SCPI und Quellcode mit dokumentierten CN/EN-Branchabweichungen."
---

{% raw %}

# Rockchip RK3399 MCU: Perilp M0, Mailbox, Firmware erstellen und debuggen

## ArmSoM-Anwendbarkeit und Quellenabweichungen

Plattformreferenz zur Anpassung an ArmSoM auf Basis von CN/EN RK3399 MCU V1.3.0. Die Quelle betrifft RK3399, Linux 4.4 und die ältere miniloader/ATF/U-Boot-SDK-Startkette, nicht RK3588/RK3576 oder jedes ArmSoM-Board. Board, SDK/BSP, Kerneltreiber, sichere DDR-Reservierung, Firmware und SWD-Verdrahtung müssen geprüft werden. Es fand keine Hardwareprüfung statt; Code, Register und Frequenzen sind Quellbeispiele, keine ArmSoM-Tests.

Nach Vorgabe des Nutzers verwenden alle vier Sprachen den chinesischen Branch rk3399-box-m0; im englischen Original steht rk3399-pmu-m0. Beide Angaben werden offengelegt. Beide PDFs tragen V1.3.0, jedoch unterschiedliche Kennungen und Seitenzahlen: CN RK-KF-YF-124/11 Seiten, EN RK-KF-YF-123/10 Seiten. Die Jlink-Ergänzung der englischen Quelle bleibt mit Herkunftshinweis erhalten. Die PDFs enthalten keine technischen Abbildungen; es werden keine erfunden.

[Redaktionelle Prüfnotizen](/docs/rockchip-rk3399-mcu/EDITORIAL-NOTES.md) · [ArmSoM Docs](https://docs.armsom.org/) · [Rockchip MCU](https://github.com/rockchip-linux/mcu)

| SoC der Quelle | Kernel der Quelle |
| --- | --- |
| RK3399 | 4.4 |

<!-- Source EN PDF p.3, unit 0 -->

## 1. Überblick über Rockchip-MCUs

<!-- Source EN PDF p.3, unit 1 -->

Die ARM® Cortex®-M-Prozessorfamilie bietet einfache Bedienung, hohe Effizienz und sehr niedrigen Energieverbrauch.

<!-- Source EN PDF p.3, unit 2 -->

Cortex-M ermöglicht mehr Funktionen bei geringeren Kosten. Vorteile bei der Wiederverwendung von Code und der Entwicklungseffizienz erklären den breiten Einsatz in eingebetteten Geräten. Nachfolgend wird Cortex-M0 kurz vorgestellt.

<!-- Source EN PDF p.3, unit 3 -->

Cortex-M0 verwendet ARMv6-M mit einem hoch integrierten, stromsparenden 32-Bit-Kern, Von-Neumann-Architektur und dem 16-Bit-Thumb-Befehlssatz einschließlich Thumb-2-Technik.

<!-- Source EN PDF p.3, unit 4 -->

Auf Grundlage dieser ARM® Cortex®-M-Eigenschaften werden die in Rockchip-SoCs integrierten MCUs nachfolgend beschrieben.

<!-- Source EN PDF p.3, unit 5 -->

RK3399 enthält zwei Cortex-M0: PMU M0 wird von ATF verwendet, Perilp M0 steht für eigene Entwicklungen zur Verfügung.

<!-- Source EN PDF p.3, unit 6 -->

## 2. Grundlagen der Entwicklung

<!-- Source EN PDF p.3, unit 7 -->

### 2.1 Konfiguration vor dem Start

<!-- Source EN PDF p.3, unit 8 -->

Die Grundlagen der Rockchip-MCU-Entwicklung werden am RK3399 Perilp M0 erläutert.

<!-- Source EN PDF p.3, unit 9 -->

#### 2.1.1 Startadresse

<!-- Source EN PDF p.3, unit 10 -->

Das Beispiel verwendet die übliche Startkette `miniloader + ATF + u-boot`.

<!-- Source EN PDF p.3, unit 11 -->

Dabei werden das MCU-BIN und das ATF-BIN normalerweise gemeinsam in `trust.img` gepackt. Dafür wird die folgende Paketkonfiguration in U-Boot ergänzt.

<!-- Source EN PDF p.3, unit 12 -->

```text
tools/rk_tools/RKTRUST/RK3399TRUST.ini
...
[BL30_OPTION]
SEC=1
PATH=tools/rk_tools/bin/rk33/rk3399bl30_v1.00.bin
ADDR=0x00080000
...
```

<!-- Source EN PDF p.4, unit 13 -->

`PATH` bezeichnet den Pfad der MCU-BIN-Datei, `ADDR` die Ladeadresse im DDR-Speicher beziehungsweise den Beginn des MCU-Adressraums. Dafür muss ein sicherer DDR-Bereich reserviert werden. Der miniloader erhält diese Adresse und lädt den MCU-Code aus dem ROM dorthin.

<!-- Source EN PDF p.4, unit 14 -->

Auch wenn U-Boot oder ein anderer Loader als erster Bootloader dient, kann die M0-Firmware entsprechend gepackt und geladen werden.

<!-- Source EN PDF p.4, unit 15 -->

Die Erstellung des MCU-BIN wird in Abschnitt 3.2.2 beschrieben.

<!-- Source EN PDF p.4, unit 16 -->

#### 2.1.2 Adressabbildung

<!-- Source EN PDF p.4, unit 17 -->

Cortex-M0/Cortex-M3 besitzen eine feste Speicheraufteilung, die Softwareportierungen erleichtert. Der Adressraum ist in Segmente unterteilt; siehe Cortex-M0 Devices Generic User Guide, 2.2 Memory model, und RK3399 TRM, 7.4.2. Üblicherweise wird nur die Abbildung des MCU-Bereichs `0x00000000-0x1FFFFFFF` konfiguriert.

<!-- Source EN PDF p.4, unit 18 -->

Die Adressabbildung des RK3399 M0 wird über SGRF eingestellt. Dies muss in einem Modul mit SGRF-Zugriff erfolgen, üblicherweise miniloader oder ATF. Für die Ladeadresse aus Abschnitt 2.1.1 gilt folgende Konfiguration.

<!-- Source EN PDF p.4, unit 19 -->

Konfiguration der Startadresse:

<!-- Source EN PDF p.4, unit 20 -->

```text
sgrf_perilp_m0_con7 = 0xf << (4 + 16) | (0x080000 >> 28) & 0x0f
sgrf_perilp_m0_con15 = 0xffff << 16 | (0x80000 >> 12) & 0xffff
```

<!-- Source EN PDF p.4, unit 21 -->

Konfiguration der Peripherieadressen:

<!-- Source EN PDF p.4, unit 22 -->

Die Abbildung der Peripherie im Bereich `0x40000000-0x5FFFFFFF` ist bei der Rockchip-MCU standardmäßig eingerichtet:

<!-- Source EN PDF p.4, unit 23 -->

`ADDR_MCU = ADDR_CA72 – 0xB8000000`

<!-- Source EN PDF p.4, unit 24 -->

Gemeint ist die Peripherie aus RK3399 TRM, Chapter 2 System Overview.

<!-- Source EN PDF p.4, unit 25 -->

#### 2.1.3 Taktkonfiguration

<!-- Source EN PDF p.4, unit 26 -->

Die MCU kann CPLL oder GPLL als Taktquelle verwenden. Laut RK3399 TRM, Chapter 3 CRU, erfolgt die Konfiguration über `CRU_CLKSEL_CON24 (0x0160)`:

<!-- Source EN PDF p.4, unit 27 -->

- `bit[15]`: Taktquelle wählen, `1’b0: CPLL`; `1’b1: GPLL`.
- `bit[12:8]`: Teiler für die MCU-Betriebsfrequenz.

<!-- Source EN PDF p.4, unit 28 -->

U-Boot-Quellbeispiel:

<!-- Source EN PDF p.5, unit 29 -->

```text
arch/arm/cpu/armv8/rk33xx/clock-rk3399.c
#ifdef CONFIG_PERILP_MCU
    /* peril m0 clk = 300MHz, select gpll as the source clock */
    clk_parent_hz = RKCLK_GPLL_FREQ_HZ;
    clk_child_hz = 300000000; /* HZ */
    div = rkclk_calc_clkdiv(clk_parent_hz, clk_child_hz, 1);

    div = div ? (div - 1) : 0;
    cru_writel((1 << 31) | (0x1F << 24) | (1 << 15) | (div << 8),
    CRU_CLKSELS_CON(24));
#endif
```

<!-- Source EN PDF p.5, unit 30 -->

#### 2.1.4 Reset aufheben

<!-- Source EN PDF p.5, unit 31 -->

Der letzte Schritt beim MCU-Start ist das Aufheben des Resets. Siehe RK3399 TRM, Chapter 3 CRU. Für RK3399 Perilp M0 nennt die Quelle folgenden Registereintrag:

<!-- Source EN PDF p.5, unit 32 -->

`PMUCRU_SOFTRST_CON0(0x0110)`

`PMUCRU_SOFTRST_CON0[5:0] = 4b’0000.`

<!-- Source EN PDF p.5, unit 33 -->

Quellbeispiel:

<!-- Source EN PDF p.5, unit 34 -->

```text
arch/arm/cpu/armv8/rk33xx/clock-rk3399.c
#ifdef CONFIG_PERILP_MCU
    /* perilp m0 dereset */
    cru_writel(0x00160000, CRU_SOFTRSTS_CON(11));
#endif
```

<!-- Source EN PDF p.5, unit 35 -->

Takt- und Resetkonfiguration können an der Stelle erfolgen, an der die MCU starten soll. Im beschriebenen Rockchip SDK sind sie in U-Boot untergebracht.

<!-- Source EN PDF p.5, unit 36 -->

### 2.2 Weitere Einstellungen

<!-- Source EN PDF p.5, unit 37 -->

#### 2.2.1 JTAG aktivieren

<!-- Source EN PDF p.5, unit 38 -->

JTAG dient zum Verfolgen, Debuggen und Beheben von MCU-Problemen. Die JTAG-Schnittstelle der Rockchip-MCU nutzt SWD mit zwei Leitungen; für die Verbindung muss JTAG iomux konfiguriert werden.

<!-- Source EN PDF p.5, unit 39 -->

Die iomux-Einstellungen des RK3399 Perilp M0 stehen in RK3399 TRM, Chapter 7.3. Die Quelle nennt zwei Registerzeilen, die jedoch identisch sind:

<!-- Source EN PDF p.5, unit 40 -->

```text
GRF_GPIO4B_IOMUX[9:8] = 2’b10
GRF_GPIO4B_IOMUX[9:8] = 2’b10
```

<!-- Source EN PDF p.6, unit 41 -->

### 2.3 Kommunikation zwischen MCU und Haupt-SoC

<!-- Source EN PDF p.6, unit 42 -->

#### 2.3.1 Mailbox

<!-- Source EN PDF p.6, unit 43 -->

Die Mailbox des Rockchip-SoC besitzt vier interruptgesteuerte Kanäle; Daten werden über gemeinsamen Speicher übertragen. Die MCU kann darüber mit dem Haupt-SoC kommunizieren. Für RK3399 siehe TRM Chapter 21 Mailbox, für RK3368 TRM Chapter 11 Mailbox.

<!-- Source EN PDF p.6, unit 44 -->

Unter Linux 4.4 verwendet die obere Schicht des Mailbox-Treibers ARM SCPI. Im Kernel müssen `CONFIG_RK3368_MBOX` und `CONFIG_RK3368_SCPI_PROTOCOL` aktiviert sein. Auch die MCU benötigt einen Mailbox-Treiber und SCPI-Unterstützung.

<!-- Source EN PDF p.6, unit 45 -->

Beispielkonfiguration im Kernel-DTS:

<!-- Source EN PDF p.6, unit 46 -->

```text
mailbox: mailbox@ff6b0000 {
    compatible = "rockchip,rk3368-mbox-legacy";
    reg = <0x0 0xff6b0000 0x0 0x1000>,
           <0x0 0xff8cf000 0x0 0x1000>; /* the end 4k of sram */
    interrupts = <GIC_SPI 146 IRQ_TYPE_LEVEL_HIGH>,
                   <GIC_SPI 147 IRQ_TYPE_LEVEL_HIGH>,
                   <GIC_SPI 148 IRQ_TYPE_LEVEL_HIGH>,
                   <GIC_SPI 149 IRQ_TYPE_LEVEL_HIGH>;
    clocks = <&cru PCLK_MAILBOX>;
    clock-names = "pclk_mailbox";
    #mbox-cells = <1>;
    status = "disabled";
};

mailbox_scpi: mailbox-scpi {
    compatible = "rockchip,rk3368-scpi-legacy";
    mboxes = <&mailbox 0>, <&mailbox 1>, <&mailbox 2>;
    chan-nums = <3>;
    status = "disabled";
};
```

<!-- Source EN PDF p.6, unit 47 -->

#### 2.3.2 Gemeinsamer Speicher

<!-- Source EN PDF p.6, unit 48 -->

Für die Kommunikation lässt sich in INTMEM (SRAM) ein Bereich reservieren, auf den sowohl der Haupt-SoC als auch die MCU zugreifen können. Dies ermöglicht den Austausch über gemeinsamen Speicher.

<!-- Source EN PDF p.6, unit 49 -->

Alternativ kann die MCU über UART oder andere Verfahren mit dem Haupt-SoC kommunizieren.

<!-- Source EN PDF p.7, unit 50 -->

## 3. Demoprogramm

<!-- Source EN PDF p.7, unit 51 -->

### 3.1 Quellcode beziehen

<!-- Source EN PDF p.7, unit 52 -->

Git-Repository:

<!-- Source EN PDF p.7, unit 53 -->

[Rockchip MCU](https://github.com/rockchip-linux/mcu)

<!-- Source EN PDF p.7, unit 54 -->

Nach Vorgabe des Nutzers wird der im chinesischen PDF genannte Branch `rk3399-box-m0` verwendet. Die englische Quelle nennt stattdessen `rk3399-pmu-m0`. Beide Angaben sind als Quellenabweichung dokumentiert, nicht als Bestätigung der Eignung für jedes Board.

<!-- Source EN PDF p.7, unit 55 -->

### 3.2 Quellcodeaufbau

<!-- Source EN PDF p.7, unit 56 -->

#### 3.2.1 Verzeichnisstruktur

<!-- Source EN PDF p.7, unit 57 -->

```text
rk-mcu>ls -R
.:
build include Makefile src

./build:
arm-gcc-link.ld RK3399M0

./build/RK3399M0:
bin obj

./build/RK3399M0/bin:
RK3399M0.bin RK3399M0.dump RK3399M0.elf RK3399M0.map

./build/RK3399M0/obj:
main.o startup.o

./include:
mcu.h rk3399.h

./src:
main.c startup.c
```

<!-- Source EN PDF p.7, unit 58 -->

`build`: erzeugte obj- und bin-Dateien.

<!-- Source EN PDF p.7, unit 59 -->

`include`: Headerdateien.

<!-- Source EN PDF p.7, unit 60 -->

`src`: Quelldateien.

<!-- Source EN PDF p.7, unit 61 -->

`startup.c` ist der M0-Einstieg mit Interruptvektortabelle und Handlern. `main.c` enthält die Hauptfunktion des M0-Programms.

<!-- Source EN PDF p.8, unit 62 -->

#### 3.2.2 Kompilieren

<!-- Source EN PDF p.8, unit 63 -->

Die Cross-Toolchain muss gcc-arm-none-eabi-v4.8 oder neuer sein. Vorgehen zum Kompilieren:

<!-- Source EN PDF p.8, unit 64 -->

```text
rk-mcu>make help
usage: make PLAT=<RK3399M0> <all|clean|distclean>

PLAT is used to specify which platform you wish to build.
If no platform is specified in first time, PLAT defaults to:

Supported Targets:
  all Build all the project
  clean Clean the current platform project
  distclean Clean the current project and delete .config

example: build the targets for the RK3399M0 project:
  make PLAT=RK3399M0
```

<!-- Source EN PDF p.8, unit 65 -->

Beim Kompilieren entsteht `build/RK3399M0/bin/RK3399M0.bin`. `RK3399M0.bin` nach `tools/rk_tools/bin/rk33/` in U-Boot kopieren und in `rk3399bl30_v1.00.bin` umbenennen. Anschließend Abschnitt 2.1.1 anwenden und U-Boot neu bauen, um das M0-BIN in `trust.img` aufzunehmen.

<!-- Source EN PDF p.8, unit 66 -->

#### 3.2.3 Interruptprogrammierung

<!-- Source EN PDF p.8, unit 67 -->

Die M0-Vektortabelle ist im Cortex-M0 Devices Generic User Guide, Chapter 2.3 Exception model, beschrieben.

<!-- Source EN PDF p.8, unit 68 -->

Beispiel aus `src/startup.c`:

<!-- Source EN PDF p.8,9, unit 69 -->

```text
/**
  * The minimal vector table for a Cortex M3. Note that the proper constructs
  * must be placed on this to ensure that it ends up at physical address
  * 0x00000000.
  */
__attribute__ ((used,section(".isr_vector")))
void (* const g_pfnVectors[])(void) =
{
    /* core Exceptions */
    (void *)&pstack[STACK_SIZE], /* the initial stack pointer */
    reset_handler,
    nmi_handler,
    hardware_fault_handler,
    0,0,0,0,0,0,0,
    svc_handler,
    0,0,
    pend_sv_handler,
    systick_handler,

    /* external exceptions */
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
};
```

<!-- Source EN PDF p.9, unit 71 -->

Cortex-M0 besitzt 16 interne Exceptions von `g_pfnVectors[0]` bis `g_pfnVectors[15]`. Die passenden Handler werden entsprechend der Anwendung registriert und implementiert.

<!-- Source EN PDF p.9, unit 72 -->

Die 32 externen Interrupts entsprechen `g_pfnVectors[16]` bis `g_pfnVectors[47]`.

<!-- Source EN PDF p.9, unit 73 -->

Der Interruptarbiter des RK3399 Perilp M0 erweitert 32 externe Interrupts auf 256. Siehe RK3399 TRM, 7.4.6 Interrupt Source Arbiter for PERILPM0. Zur Nutzung müssen die Maskenbits konfiguriert werden. Nach einem Interrupt ermittelt M0 die konkrete Quelle anhand der entsprechenden Bits.

<!-- Source EN PDF p.9, unit 74 -->

Die Arbiterschnittstelle befindet sich in `include/rk3399.h`:

<!-- Source EN PDF p.9, unit 75 -->

```text
M0_INT_ARB_SET_MASK() // Set interrupt mask
M0_INT_ARB_GET_FLAG() // Get interrupt bit
```

<!-- Source EN PDF p.9, unit 76 -->

Die unterstützten externen Interrupts stehen in RK3399 TRM, 2.4 System Interrupt Connection for Cortex-M0.

<!-- Source EN PDF p.9, unit 77 -->

## 4. MCU-Diagnose

<!-- Source EN PDF p.9, unit 78 -->

### 4.1 JTAG-Debugging

<!-- Source EN PDF p.9, unit 79 -->

iomux, tck und tms für JTAG im GRF gemäß Abschnitt 2.2.1 einstellen.

<!-- Source EN PDF p.9, unit 80 -->

Den JTAG- beziehungsweise tck/tms-Schalter des Entwicklungsboards auf MCU stellen.

<!-- Source EN PDF p.9, unit 81 -->

MCU zum Debuggen über DS-5, ICE oder Jlink verbinden. Die chinesische Quelle nennt DS-5 und ICE; die englische ergänzt Jlink.

<!-- Source EN PDF p.9, unit 82 -->

### 4.2 UART-Ausgaben

<!-- Source EN PDF p.9, unit 83 -->

M0 kann für Debugausgaben direkt auf UART-Register zugreifen.

<!-- Source EN PDF p.9, unit 84 -->

Verwenden MCU und Haupt-SoC denselben UART, sollten M0-Ausgaben im Normalbetrieb deaktiviert werden, damit konkurrierende UART-Zugriffe keine Systemstörung verursachen.

<!-- Source EN PDF p.9, unit 85 -->

### 4.3 Register lesen und schreiben

<!-- Source EN PDF p.9, unit 86 -->

Das System an der U-Boot- oder Kernel-Kommandozeile anhalten und die MCU-Statusregister über io auslesen.

<!-- Source EN PDF p.9, unit 87 -->

Alternativ den Zustand wichtiger MCU-Programmpunkte in freie GRF-Register schreiben und diese aus U-Boot oder der Kernel-Kommandozeile lesen, um den aktuellen MCU-Zustand zu bestimmen.

<!-- Source EN PDF p.10, unit 88 -->

## 5. Referenzdokumente

<!-- Source EN PDF p.10, unit 89 -->

Weiterführende Dokumente anderer Herausgeber:

<!-- Source EN PDF p.10, unit 90 -->

- Cortex-M0 Devices Generic User Guide
- Cortex-M0 Technical Reference Manual
- Rockchip RK3399 TRM V1.4

{% endraw %}
