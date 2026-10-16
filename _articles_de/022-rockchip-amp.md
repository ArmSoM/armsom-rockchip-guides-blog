---
title: "ArmSoM Rockchip AMP: Vollständiger Entwicklerleitfaden"
description: "Vollständiger AMP-Leitfaden für ArmSoM RK3588 und RK3576: Linux, RT-Thread, RK HAL, RPMsg sowie Speicher- und Interruptkonfiguration."
translation_key: "022-rockchip-amp"
slug: "022-rockchip-amp"
lang: "de"
date: "2026-10-14"
author: "ArmSoM-Redaktion · Rockchip-Quelldokumentation"
category: "linux"
products: ["Sige7", "AIM7", "Sige5", "CM5", "AIM5"]
tags: ["AMP", "RK3588", "RK3576", "RT-Thread", "RK HAL", "RPMsg"]
keywords: "ArmSoM, Rockchip AMP, RK3588, RK3576, RT-Thread, RPMsg"
excerpt: "Vollständiger AMP-Leitfaden für ArmSoM RK3588 und RK3576: Linux, RT-Thread, RK HAL, RPMsg sowie Speicher- und Interruptkonfiguration."
---

{% raw %}
# ArmSoM Rockchip AMP: Vollständiger Entwicklerleitfaden

<style>.article-content img{aspect-ratio:auto;width:auto;max-width:100%;margin:24px auto}.article-content th{min-width:100px}.article-content h3,.article-content h4{overflow-wrap:anywhere}</style>

Dieser Leitfaden unterstützt die AMP-Anpassung auf ArmSoM-Plattformen mit den entsprechenden Rockchip-SoCs, darunter Sige7 / AIM7 (RK3588) und Sige5 / CM5 / AIM5 (RK3576). Verwenden Sie zueinander passende Projekte für AMP SDK, U-Boot, Kernel, Device Tree und RT-Thread / RK HAL. Passen Sie die Konfiguration an den Schaltplan, die tatsächliche DDR-Speicheraufteilung und die Zuordnung der Peripherie an. Alle 11 Kapitel der Quelle, Konfigurationsbeispiele, ursprünglichen Benchmarkdaten und Abbildungen bleiben erhalten. Die Benchmarkwerte stammen von Rockchip und wurden nicht auf ArmSoM gemessen.

Redaktioneller Hinweis: Die neueste chinesische Datei bildet die technische Grundlage; die englische Fassung wurde mit dem offiziellen Dokument derselben Version abgeglichen. Tabellen und Codeeinrückungen wurden rekonstruiert. Die Angaben zur 32/64-Bit-Unterstützung des RK3588 unterscheiden sich zwischen Vorwort und Abschnitt 1.2.1; beide Originalangaben bleiben erhalten. Prüfen Sie die MCU-Adressübersetzung und den Zusammenhang zwischen GPIO0 und GPIO1_IRQn anhand des tatsächlichen BSP/TRM. Hardwarekonstanten wurden nicht geraten. Korrekturen stehen in [EDITORIAL-NOTES.md](/docs/rockchip-amp/EDITORIAL-NOTES.md).

[Sige7](https://docs.armsom.org/armsom-sige7) · [Sige5](https://docs.armsom.org/armsom-sige5) · [CM5](https://docs.armsom.org/armsom-cm5) · [AIM7](https://docs.armsom.org/armsom-aim7) · [AIM5](https://docs.armsom.org/armsom-aim5)

### Rockchip AMP-Entwicklerleitfaden

ID: RK-KF-YF-160

Ausgabeversion: V1.2.0

Vorwort

Überblick

Dieses Dokument unterstützt Entwickler bei Projekten auf Grundlage von Rockchip-AMP-Systemen (Asymmetric Multiprocessing).

Unterstützte Plattformen

| Chipmodell | Prozessorkern | Linux | RTOS | Bare-metal |
| --- | --- | --- | --- | --- |
| RK3588 | 4 x ARM Cortex-A76 | Kernel 5.10 | N/A | N/A |
| RK3588 | 4 x ARM Cortex-A55 | Kernel 5.10 | RTT 3.1-32<br>RTT 4.1-64 | HAL-32<br>HAL-64 |
| RK3588 | 1 x ARM Cortex-M0 | N/A | RTT 3.1<br>RTT 4.1 | HAL |
| RK3576 | 4 x ARM Cortex-A72 | Kernel 6.1 | N/A | N/A |
| RK3576 | 4 x ARM Cortex-A53 | Kernel 6.1 | RTT 4.1-32 | HAL-32 |
| RK3576 | 1 x ARM Cortex-M0 | N/A | RTT 4.1 | HAL |
| RK3568 | 4 x ARM Cortex-A55 | Kernel 4.19<br>Kernel 5.10 | RTT 3.1-32 | HAL-32 |
| RK3568 | 1 x RISC-V | N/A | RTT 3.1 | HAL |
| RK3562 | 4 x ARM Cortex-A53 | Kernel 5.10 | RTT 4.1-32 | HAL-32 |
| RK3562 | 1 x ARM Cortex-M0 | N/A | RTT 4.1 | HAL |
| RK3358 | 4 x ARM Cortex-A35 | N/A | RTT 3.1-32 | HAL-32 |
| RK3308 | 4 x ARM Cortex-A35 | Kernel 5.10 | RTT 3.1-32<br>RTT 4.1-32 | HAL-32 |

## 1. Kapitel 1: Heterogene Mehrkernsysteme

### 1.1 Überblick

#### 1.1.1 Einführung in heterogene Mehrkernsysteme

Heterogene Mehrkernsysteme sind Rechensysteme, in denen unterschiedliche Plattformen unabhängig auf verschiedenen Prozessorkernen desselben SoC laufen. Sie unterstützen sowohl SMP (Symmetric Multi-Processing) für symmetrische als auch AMP (Asymmetric Multi-Processing) für asymmetrische Mehrprozessorsysteme.

In heterogenen Mehrkernsystemen werden die beiden Systeme herkömmlicher Plattformen zusammengeführt. Bei herkömmlichen Plattformen sind Linux und Echtzeitsystem normalerweise vollständig getrennt und benötigen zwei vollständige Prozessoren mit jeweils eigener Peripheriebeschaltung. Durch geeignete Zuweisung von Prozessorkernen, Peripherie und anderen Ressourcen können Linux und Echtzeitsystem dagegen unabhängig auf demselben SoC laufen. So lassen sich umfangreiche Systemsoftware und Hardwareperipherie mit den Echtzeitanforderungen des Systems verbinden.

![Rockchip-AMP-Originalabbildung: 1.1.1 Einführung in heterogene Mehrkernsysteme — Seite 9](/docs/rockchip-amp/assets/en-p009-fig01.png)

Heterogene Mehrkernsysteme ermöglichen auch den gleichzeitigen unabhängigen Betrieb mehrerer Echtzeitsysteme auf demselben SoC.

![Rockchip-AMP-Originalabbildung: 1.1.1 Einführung in heterogene Mehrkernsysteme — Seite 10](/docs/rockchip-amp/assets/en-p010-fig01.png)

Darüber hinaus unterstützen heterogene Mehrkernsysteme den gemeinsamen Betrieb von SMP und AMP auf demselben SoC.

![Rockchip-AMP-Originalabbildung: 1.1.1 Einführung in heterogene Mehrkernsysteme — Seite 10](/docs/rockchip-amp/assets/en-p010-fig02.png)

Beim Produktentwurf bieten heterogene Mehrkernsysteme erhebliche Vorteile bei Kosten und Baugröße. Sie werden bereits breit in Energieversorgung, Industrieautomatisierung, Unterhaltungselektronik und Fahrzeugelektronik eingesetzt.

#### 1.1.2 Heterogenes Mehrkernsystem von Rockchip

Das heterogene Mehrkernsystem von Rockchip ist eine universelle Lösung für heterogene Mehrkernverarbeitung. Es erweitert das vorhandene symmetrische SMP-System um asymmetrische AMP-Verarbeitung. Dieses Dokument beschreibt hauptsächlich die AMP-Lösung mit ihrem Boot- und Kommunikationskonzept. Die Implementierungsprinzipien werden in den jeweiligen Abschnitten erläutert.

Als Betriebsplattform stellt Linux einen Standard-Linux-Kernel bereit, RTOS das quelloffene RT-Thread und Bare-metal eine Entwicklungsbibliothek auf Grundlage der Hardwareabstraktionsschicht RK HAL. Darüber hinaus können Anwender weitere Betriebsplattformen selbst anpassen, beispielsweise ein bestimmtes RTOS auf Grundlage von RK HAL.

![Rockchip-AMP-Originalabbildung: 1.1.2 Heterogenes Mehrkernsystem von Rockchip — Seite 11](/docs/rockchip-amp/assets/en-p011-fig01.png)

Auf Prozessorebene unterstützt das heterogene Mehrkernsystem von Rockchip den unabhängigen Betrieb jedes gleichartigen ARM-Cortex-A-Kerns im SoC. Auch heterogene ARM-Cortex-M- oder RISC-V-Kerne können unabhängig laufen. Durch geeignete Aufteilung der Kernressourcen werden Aufgaben dem jeweils passendsten Kern zugewiesen, was Leistung und Energieeffizienz des SoC verbessert.

![Rockchip-AMP-Originalabbildung: 1.1.2 Heterogenes Mehrkernsystem von Rockchip — Seite 11](/docs/rockchip-amp/assets/en-p011-fig02.png)

Derzeit verwendet das heterogene Mehrkernsystem von Rockchip hauptsächlich ein AMP-Konzept ohne übergeordneten Supervisor. Es verzichtet auf Virtualisierungsverwaltung und erreicht dadurch bei Echtzeitsystemen schnellere Interruptreaktionen, um die strengen Anforderungen harter Echtzeit beispielsweise in Energieversorgung und Industrieautomatisierung zu erfüllen.

Als künftige Erweiterung beschreibt die Quelle eine optionale Virtualisierungsverwaltung. Auf Grundlage von RPMsg und RemoteProc soll OpenAMP unterstützt werden. Für die Industrieautomatisierung ist Unterstützung des Typ-1-Hypervisors Jailhouse vorgesehen. Künftige Rockchip-SoCs sollen zusätzliche Hardware-Ressourcenisolation bieten, um Flexibilität und Zuverlässigkeit des heterogenen Mehrkernsystems zu erhöhen.

### 1.2 Plattformunterstützung

#### 1.2.1 RK3588

##### 1.2.1.1 Prozessorkerne

| Prozessortyp | Prozessorkerne |
| --- | --- |
| AP | 4 x ARM Cortex-A76 + 4 x ARM Cortex-A55 |
| MCU | 1 x ARM Cortex-M0 |

##### 1.2.1.2 Unterstützte Betriebsplattformen

| Prozessorkerne | ARM Cortex-A76 | ARM Cortex-A55 | ARM Cortex-M0 |
| --- | --- | --- | --- |
| Linux-Unterstützung | Kernel 5.10 | Kernel 5.10 | N/A |
| RTOS-Unterstützung | N/A | RT-Thread 3.1-32<br>RT-Thread 4.1-32 | RT-Thread 3.1<br>RT-Thread 4.1 |
| Bare-metal-Unterstützung | N/A | HAL-32 | HAL |

#### 1.2.2 RK3576

##### 1.2.2.1 Prozessorkerne

```text
Processor Cores
```

| Prozessortyp | Prozessorkerne |
| --- | --- |
| AP | 4 x ARM Cortex-A72 + 4 x ARM Cortex-A53 |
| MCU | 1 x ARM Cortex-M0 |

```text
1 x ARM Cortex-M0
```

##### 1.2.2.2 Unterstützte Betriebsplattformen

| Prozessorkern | ARM Cortex-A72 | ARM Cortex-A53 | ARM Cortex-M0 |
| --- | --- | --- | --- |
| Linux-Unterstützung | Kernel 6.1 | Kernel 6.1 | N/A |
| RTOS-Unterstützung | N/A | RTT 4.1-32 | RTT 4.1 |
| Bare-metal-Unterstützung | N/A | HAL-32 | HAL |

#### 1.2.3 RK3568

##### 1.2.3.1 Prozessorkerne

| Prozessortyp | Kernkonfiguration |
| --- | --- |
| AP | 4 x ARM Cortex-A55 |
| MCU | 1 x RISC-V |

##### 1.2.3.2 Unterstützte Betriebsplattformen

```text
Processor Cores
```

| Prozessorkerne | ARM Cortex-A55 | RISC-V |
| --- | --- | --- |
| Linux-Unterstützung | Kernel 4.19<br>Kernel 5.10 | N/A |
| RTOS-Unterstützung | RTT 3.1-32 | RTT 3.1 |
| Bare-metal-Unterstützung | HAL-32 | HAL |

#### 1.2.4 RK3562

##### 1.2.4.1 Prozessorkerne

```text
Processor Type
```

| Prozessortyp | Prozessorkerne |
| --- | --- |
| AP | 4 x ARM Cortex-A53 |
| MCU | 1 x ARM Cortex-M0 |

```text
MCU
```

##### 1.2.4.2 Unterstützte Betriebsplattformen

| Prozessorkerne | ARM Cortex-A53 | ARM Cortex-M0 |
| --- | --- | --- |
| Linux-Unterstützung | Kernel 5.10 | N/A |
| RTOS-Unterstützung | RTT 4.1-32 | RTT 4.1 |
| Bare-metal-Unterstützung | HAL-32 | HAL |

#### 1.2.5 RK3358

##### 1.2.5.1 Prozessorkerne

| Prozessortyp | Prozessorkerne |
| --- | --- |
| AP | 4 x ARM Cortex-A35 |

##### 1.2.5.2 Unterstützte Betriebsplattformen

| Prozessorkerne | ARM Cortex-A35 |
| --- | --- |
| Linux-Unterstützung | N/A |
| RTOS-Unterstützung | RTT 3.1-32 |
| Bare-metal-Unterstützung | HAL-32 |

#### 1.2.6 RK3308

##### 1.2.6.1 Prozessorkerne

| Prozessortyp | Prozessorkerne |
| --- | --- |
| AP | 4 x ARM Cortex-A35 |

##### 1.2.6.2 Unterstützte Betriebsplattformen

| Prozessorkern | ARM Cortex-A35 |
| --- | --- |
| Linux-Unterstützung | Kernel 5.10 |
| RTOS-Unterstützung | RTT 3.1-32<br>RTT 4.1-32 |
| Bare-metal-Unterstützung | HAL-32 |

### 1.3 Produktbeispiele

#### 1.3.1 AP + AP: Schutzrelaisgerät für die Energieversorgung

Schutzrelaisgeräte benötigen Echtzeitfähigkeit für die Erfassung und Auswertung elektrischer Größen sowie die Reaktion auf Schutzsteuersignale. Zugleich sind umfangreiche Softwarefunktionen und Hardwareperipherie wie Anzeigen, USB- und Ethernet-Geräte erforderlich. Das heterogene Mehrkernsystem von Rockchip führt die beiden Systeme einer herkömmlichen Plattform zusammen: Eine einzelne Platine kann Linux und Echtzeitsystem gleichzeitig unabhängig betreiben und alle genannten Funktionen bereitstellen.

![Rockchip-AMP-Originalabbildung: 1.3.1 AP + AP: Schutzrelaisgerät für die Energieversorgung — Seite 15](/docs/rockchip-amp/assets/en-p015-fig01.png)

Die hohe AP-Leistung ermöglicht außerdem eine effizientere Verarbeitung und höhere Rechenleistung für Echtzeitaufgaben.

#### 1.3.2 AP + MCU: Saugroboter

Saugroboter benötigen Linux und komplexe Peripherie wie WiFi, Kamera und Audio für Netzwerkverbindungen, Kartenspeicherung und Algorithmen. Zusätzlich benötigen sie ein Echtzeitsystem mit einfacher Peripherie wie PWM, SPI, UART, ADC und GPIO für Umgebungserfassung, Bewegungssteuerung und Zustandsüberwachung. Das heterogene Mehrkernsystem von Rockchip führt diese beiden Systeme zusammen und ermöglicht alle genannten Funktionen ohne externe MCU.

![Rockchip-AMP-Originalabbildung: 1.3.2 AP + MCU: Saugroboter — Seite 16](/docs/rockchip-amp/assets/en-p016-fig01.png)

Wird die interne MCU des SoC als Echtzeit- oder Koprozessor verwendet, kann Linux seine Rechenleistung zudem umfassender nutzen.

## 2. Kapitel 2: AMP SDK

### 2.1 Verzeichnisstruktur

Die Quellcodestruktur des AMP SDK für das heterogene Mehrkernsystem von Rockchip ist nachfolgend dargestellt. Mit * markierte Kommentare kennzeichnen die Hauptverzeichnisse des AMP SDK.

```text
.
├── app        # Linux system user interface example
├── buildroot  # Buildroot system compilation directory
├── debian     # Debian system compilation directory
├── device     # * AMP SDK compilation scripts and configuration files
├── docs       # * AMP SDK documentation
├── external   # Supplementary applications for Buildroot system
├── hal        # * Bare-metal system compilation directory
├── kernel-*   # * Compilation directories for different versions of the Linux Kernel
├── prebuilts  # * Pre-installed compilation toolchains
├── rkbin      # * Binary files used by the AMP SDK
├── rtos       # * RTOS system compilation directory
├── tools      # Tool set used by the AMP SDK
├── u-boot     # * U-Boot compilation directory
├── uefi       # UEFI compilation directory
└── yocto      # Yocto system compilation directory
```

### 2.2 Verzeichnis device

Das Verzeichnis device enthält Build-Skripte und Standardkonfigurationen des AMP SDK. Am Beispiel RK3562 sind die wichtigsten Dateien:

```text
device/rockchip
├── common
│   ├── build.sh                       # Common compilation script for AMP SDK
│   └── scripts
│       └── mk-amp.sh                  # Common compilation script for RTOS / Bare-metal
└── rk3562
    ├── amp.its                        # Firmware packaging configuration file for RTOS + Bare-metal
    ├── amp_linux.its                  # Firmware packaging configuration file for Linux +
RTOS / Bare-metal
    ├── amp_mcu.its                    # Firmware packaging configuration file for Linux +
RTOS / Bare-metal MCU
    └── rockchip_rk3562_xxx_defconfig  # Board-level compilation configuration file
```

Verwandte Abschnitte:

Kapitel 3: Build-Konfiguration

### 2.3 Verzeichnis kernel

Das Verzeichnis kernel enthält den Linux-Quellcode. Das AMP SDK stellt einen Standard-Linux-Kernel bereit.

Die Unterstützung der einzelnen SoC-Plattformen ist nachfolgend aufgeführt:

| SOC | Kernel 4.19 | Kernel 5.10 | Kernel 6.1 |
| --- | --- | --- | --- |
| RK3588 |  | ✔ |  |
| RK3576 |  |  | ✔ |
| RK3568 | ✔ | ✔ |  |
| RK3562 |  | ✔ |  |
| RK3308 |  | ✔ |  |

Am Beispiel RK3562 sind die wichtigsten Dateien:

```text
kernel
├── arch/arm64/boot/dts/rockchip
│   ├── rk3562-amp.dtsi                # AMP dtsi file
│   └── rk3562-xxx-amp.dts             # AMP dts board-level configuration file
├── drivers
│   ├── mailbox                        # Mailbox inter-core communication solution
│   ├── rpmsg                          # RPMsg inter-core communication solution
│   ├── soc/rockchip
│   │   └── rockchip_amp.c             # Resource partitioning, lifecycle management of the
slave core, etc.
└── include
```

Im Betriebsmodus Linux + RTOS / Bare-metal muss der Linux-Kern als Hauptkern arbeiten. Er übernimmt die Ressourcenaufteilung und Verwaltung des untergeordneten Kerns (Remote Core) im gesamten heterogenen Mehrkernsystem.

Verwandte Abschnitte:

Kapitel 3: Build-Konfiguration

Kapitel 4: Ressourcenaufteilung

Kapitel 5: Boot-Konzept

Kapitel 6: Kommunikationskonzept

### 2.4 Verzeichnis hal

Das Verzeichnis hal enthält den Quellcode für Bare-metal-Systeme. Das AMP SDK stellt eine Bare-metal-Entwicklungsbibliothek auf Grundlage der Hardwareabstraktionsschicht RK HAL bereit.

RK HAL ist eine Hardwareabstraktionsschicht auf Grundlage von ARM CMSIS (Cortex Microcontroller Software Interface Standard). Anwender können RK HAL direkt für Bare-metal-Systeme verwenden oder für ein bestimmtes RTOS anpassen.

Die Unterstützung der einzelnen SoC-Plattformen ist nachfolgend aufgeführt:

| SOC | AP HAL-32 | MCU HAL |
| --- | --- | --- |
| RK3588 | ✔ | ✔ |
| RK3576 | ✔ | ✔ |
| RK3568 | ✔ | ✔ |
| RK3562 | ✔ | ✔ |
| RK3358 | ✔ | N/A |
| RK3308 | ✔ | N/A |

Am Beispiel RK3562 sind die wichtigsten Dateien:

```text
├── doc
│   └── Rockchip_User_Guide_HAL_CN.md    # RK HAL Development Documentation
├── lib
│   ├── bsp                              # Board Support Package
│   ├── CMSIS                            # ARM Microcontroller Software Interface Standard Library
│   ├── Core                             # MCU Related Files
│   ├── Core_A                           # AP 32-bit Related Files
│   ├── Core_A_64                        # AP 64-bit Related Files
│   ├── Device/RK3562
│   │   ├── Include
│   │   │   ├── rk3562.h                 # RK3562 Register Definition
│   │   │   ├── soc.h                    # RK3562 SOC Related Definition
│   │   │   └── system_rk3562.h
│   │   └── Source/Templates
│   │       ├── GCC                      # Using GCC Cross-Compilation Toolchain
│   │       │   ├── gcc_arm.ld           # Linker Script Example
│   │       │   ├── start_m0.S           # MCU Startup File
│   │       │   └── startup_rk3562.c     # AP Startup File
│   │       ├── mmu_rk3562.c             # AP MMU Map Configuration File
│   │       ├── system_rk3562.c
│   │       └── system_rk3562_mcu.c
│   ├── DSP                              # DSP Related Files
│   └── RISCV                            # RISC-V Related Files
│   └── hal
│       ├── inc                          # Module Driver Header Files
│       └── src                          # Module Driver Files
├── middleware                           # Bare-metal System Middleware
│   ├── benchmark                        # Performance Testing
│   ├── rpmsg-lite                       # RPMsg Inter-Processor Communication Solution
│   └── simple_console                   # Console
├── project                              # Bare-metal System Project Examples
│   ├── common
│   │   └── GCC
│   │       ├── Cortex-A.mk              # AP Common Compilation File
│   │       ├── Cortex-M.mk              # MCU Common Compilation File
│   │       └── riscv.mk                 # RISC-V Common Compilation File
│   ├── rk3562
│   │   ├── GCC
│   │   │   ├── build.sh                 # AP Compilation Script
│   │   │   ├── gcc_arm.ld.S             # AP Linker Script
│   │   │   └── Makefile                 # AP Compilation File
│   │   ├── Image
│   │   │   ├── amp.img                  # Packaged Bare-metal System Firmware
│   │   │   ├── amp.its                  # RTOS + Bare-metal Firmware Packaging Configuration File
│   │   │   ├── amp_linux.its            # Linux + RTOS / Bare-metal Firmware Packaging Configuration File
│   │   │   ├── halx.bin
│   │   │   ├── halx.elf
│   │   │   └── parameter.txt            # Partition Table Configuration File
│   │   ├── mkimage.sh                   # AP Firmware Packaging Script
│   │   └── src
│   │       ├── hal_conf.h               # RK HAL Configuration File
│   │       ├── main.c                   # Bare-metal System Example
│   │       └── test_demo.c              # Bare-metal System Module and Function Example
│   └── rk3562-mcu
│       ├── GCC
│       │   ├── gcc_bus_m0.ld            # MCU Linker Script
│       │   └── Makefile                 # MCU Compilation File
│       ├── Image
│       │   ├── amp.img                  # Packaged Bare-metal System Firmware
│       │   ├── amp_mcu.its              # Linux + RTOS / Bare-metal MCU Firmware Packaging Configuration File
│       │   ├── mcu.bin
│       │   ├── mcu.elf
│       │   └── parameter.txt            # Partition Table Configuration File
│       ├── mkimage.sh                   # MCU Firmware Packaging Script
│       └── src
│           ├── hal_conf.h               # RK HAL Configuration File
│           ├── main.c                   # Bare-metal System Example
│           └── test_demo.c              # Bare-metal System Module and Function Example
├── test                                 # Bare-metal System Module Test Files
└── tools                                # Bare-metal System Tool Set
```

Verwandte Abschnitte:

Kapitel 3: Build-Konfiguration

Kapitel 4: Ressourcenaufteilung

Kapitel 5: Boot-Konzept

Kapitel 6: Kommunikationskonzept

### 2.5 Verzeichnis rtos

Das Verzeichnis rtos enthält den Quellcode des RTOS. Das AMP SDK stellt das quelloffene RT-Thread bereit.

RT-Thread ist ein ausgereiftes, stabiles und in China unabhängig entwickeltes quelloffenes RTOS, das laut Quelle die größte installierte Basis im Land besitzt. Die Plattform vereint Echtzeitbetriebssystemkern, Middleware-Komponenten und eine offene Entwicklergemeinschaft. Die technische Onlinedokumentation finden Sie im RT-Thread-Dokumentationszentrum.

Das im heterogenen Mehrkernsystem von Rockchip bereitgestellte RT-Thread wurde auf Grundlage von RK HAL angepasst. Die RK-HAL-Dateien liegen unter bsp/rockchip/common/hal/lib . Die RTOS-Gerätetreiber liegen unter bsp/rockchip/common/drivers .

Die Unterstützung der einzelnen SoC-Plattformen ist nachfolgend aufgeführt:

| SOC | AP RTT 3.1-32 | AP RTT 4.1-32 | AP RTT 4.1-64 | MCU RTT 3.1 | MCU RTT 4.1 |
| --- | --- | --- | --- | --- | --- |
| RK3588 | ✔ |  | ✔ | ✔ | ✔ |
| RK3576 |  |  | ✔ |  | ✔ |
| RK3568 | ✔ |  |  | ✔ |  |
| RK3562 |  | ✔ |  |  | ✔ |
| RK3358 | ✔ |  |  | N/A | N/A |
| RK3308 | ✔ | ✔ |  | N/A | N/A |

Am Beispiel RK3562 gehören zu RT-Thread V4.1 folgende wichtige Dateien:

```text
├── applications                         # Common application files
├── bsp/rockchip                         # Board Support Package
│   ├── common                           # Common modules and feature-related files
│   │   ├── drivers                      # RTOS Device Driver files
│   │   ├── fwmgr                        # Firmware management related files
│   │   ├── hal                          # RK HAL files
│   │   └── test                         # Module and feature test files
│   ├── rk3562-32                        # RK3562 AP 32-bit
│   │   ├── applications                 # Application files
│   │   ├── board                        # Board configuration files
│   │   ├── driver                       # Driver files
│   │   ├── Image
│   │   │   ├── amp.img                  # Packaged RTOS / Bare-metal firmware
│   │   │   ├── amp.its                  # RTOS + Bare-metal firmware packaging configuration file
│   │   │   ├── amp_linux.its            # Linux + RTOS / Bare-metal firmware packaging configuration file
│   │   │   ├── rttx.bin
│   │   │   ├── rttx.elf
│   │   │   ├── parameter.txt            # Partition table configuration file
│   │   │   └── smp.its                  # RTOS SMP firmware packaging configuration file
│   │   ├── test                         # Test files
│   │   ├── build.sh                     # AP compilation script
│   │   ├── gcc_arm.ld.S                 # AP linking script
│   │   ├── hal_conf.h                   # RK HAL configuration file
│   │   ├── Kconfig
│   │   ├── mkimage.sh                   # AP firmware packaging script
│   │   ├── rtconfig.h
│   │   ├── rtconfig.py
│   │   ├── SConscript
│   │   └── SConstruct
│   ├── rk3562-mcu                       # RK3562 MCU
│   │   ├── applications                 # Application files
│   │   ├── board                        # Board configuration files
│   │   ├── driver                       # Driver files
│   │   ├── Image
│   │   │   ├── amp.img                  # Packaged RTOS system firmware
│   │   │   ├── amp_mcu.its              # Linux + RTOS / Bare-metal MCU firmware packaging configuration file
│   │   │   ├── mcu.bin
│   │   │   └── mcu.elf
│   │   ├── gcc_arm.ld.S                 # MCU linking script
│   │   ├── hal_conf.h                   # RK HAL configuration file
│   │   ├── Kconfig
│   │   ├── mkimage.sh                   # MCU firmware packaging script
│   │   ├── rtconfig.h
│   │   ├── rtconfig.py
│   │   ├── SConscript
│   │   └── SConstruct
│   └── tools                            # Toolset
├── components
├── examples
├── include
├── libcpu
├── src
├── third_party
└── tools
```

Verwandte Abschnitte:

Kapitel 3: Build-Konfiguration

Kapitel 4: Ressourcenaufteilung

Kapitel 5: Boot-Konzept

Kapitel 6: Kommunikationskonzept

### 2.6 Verzeichnis u-boot

Das Verzeichnis u-boot enthält den U-Boot-Quellcode. Für das AMP SDK muss rk-amp.config hinzugefügt werden, um folgende Konfigurationen zu aktivieren:

```text
CONFIG_AMP=y
CONFIG_ROCKCHIP_AMP=y
```

Am Beispiel RK3562 gehören zum AMP SDK folgende wichtige Dateien:

```text
arch/arm/mach-rockchip/rk3562/rk3562.c   # SOC initialization file
drivers/cpu/rockchip_amp.c               # AMP startup solution
include/configs/rk3562_common.h          # Common chip configuration file
```

Verwandte Abschnitte:

Kapitel 3: Build-Konfiguration

Kapitel 5: Boot-Konzept

### 2.7 Verzeichnis rkbin

Das Verzeichnis rkbin enthält die vom AMP SDK verwendeten Binärdateien und muss mit dem zugehörigen Verzeichnis verwendet werden.

Am Beispiel RK3562 gehören zum AMP SDK folgende wichtige Dateien:

```text
bin/rk35/rk3562_bl31_xxx.elf             # Common bl31 file
bin/rk35/rk3562_bl31_cpu3_xxx.elf        # bl31 file for pre-level running on CPU3
RKTRUST/RK3562TRUST.ini                  # Common configuration file
RKTRUST/RK3562TRUST_CPU3.ini             # Configuration file for pre-level running on CPU3
```

Verwandte Abschnitte:

Kapitel 3: Build-Konfiguration

Kapitel 5: Boot-Konzept

## 3. Kapitel 3: Build-Konfiguration

### 3.1 Konfigurationsdatei

Wählen und bearbeiten Sie vor dem Übersetzen des AMP SDK zunächst die erforderlichen Konfigurationsdateien.

#### 3.1.1 Allgemeine Build-Konfigurationsdatei

Die Build-Konfiguration des AMP SDK informiert das Build-Skript hauptsächlich über die Projektpfade von RTOS und Bare-metal sowie die konkreten Einstellungen der zugehörigen Projekte. Die Standardkonfiguration liegt unter &lt;AMP_SDK&gt;/device/rockchip/.chip/rockchip_xxx_defconfig und enthält folgende Einstellungen:

```text
RK_AMP=y                                          # Support for AMP RTOS / Bare-metal
RK_AMP_ARCH="arm"                                 # 32-bit is used for RTOS / Bare-metal
                                                  # Use "arm64" for 64-bit
RK_AMP_HAL_TARGET="rk3562"                        # The project directory name corresponding to AP Bare-metal
RK_AMP_RTT_TARGET="rk3562-32"                     # The project directory name corresponding to AP RTOS
RK_AMP_MCU_HAL_TARGET="rk3562-mcu"                # The project directory name corresponding to MCU Bare-metal
RK_AMP_MCU_RTT_TARGET="rk3562-mcu"                # The project directory name corresponding to MCU RTOS
RK_AMP_CFG is not set                             # Auxiliary configuration file
RK_AMP_FIT_ITS="amp_linux.its"                    # Configuration file for AMP firmware packaging
RK_UBOOT_CFG_FRAGMENTS="rk-amp"                   # Add configuration file for AMP U-Boot config
RK_UBOOT_TRUST_INI is not set                     # Configuration file required when using a special rkbin
RK_PARAMETER="parameter.txt"                      # Partition table configuration file
```

Für die Konfiguration des AMP SDK wird make menuconfig empfohlen. Dieses Verfahren ordnet Abhängigkeiten zwischen Build-Makros automatisch zu und verhindert ungültige Build-Konfigurationen.

![Rockchip-AMP-Originalabbildung: 3.1.1 Allgemeine Build-Konfigurationsdatei — Seite 25](/docs/rockchip-amp/assets/en-p025-fig01.png)

#### 3.1.2 Konfigurationsdatei für das AMP-Firmwarepaket

Die AMP-Firmware wird im standardisierten FIT-Format verpackt, das U-Boot nativ unterstützt und ausdrücklich empfiehlt. Durch Anpassen der ITS-Konfiguration sind unterschiedliche Einstellungen für jeden AMP-Prozessorkern mit RTOS oder Bare-metal möglich. RK3562 bietet beispielsweise drei Standardkonfigurationen:

amp_linux.its : Gemischter Betrieb von Linux + RTOS / Bare-metal.

amp.its : Gemischter Betrieb von RTOS + Bare-metal.

amp_mcu.its : Gemischter Betrieb von Linux + MCU RTOS / Bare-metal.

##### 3.1.2.1 amp_linux.its

Gemischter Betrieb von Linux + RTOS / Bare-metal. Im folgenden Beispiel führt CPU3 des RK3562 unabhängig RTOS aus; die übrigen Kerne führen Linux SMP aus.

```text
/dts-v1/;
/ {
    description = "FIT source file for Rockchip AMP";
    #address-cells = <1>;
    images {
        // amp3 node configures CPU3, other processor cores are similar.
        amp3 {
            description  = "RTOS core3";          // Firmware description information
            data         = /incbin/("rtt3.bin"); // Specifies the firmware location to be
packaged (with path)
            type         = "firmware";           // AP is set to firmware
            compression  = "none";               // Keep the default none
            arch         = "arm";                // Specifies the processor architecture
            cpu          = <0x3>;                // Specifies the processor's hardware ID
            thumb        = <0>;                  // Specifies the processor's instruction set
            hyp          = <0>;                  // Specifies whether the processor runs the Hypervisor
            load         = <0x01800000>;         // Specifies the firmware load and run address
            compile {                            // Configuration at compile time, automatically cleared after compilation
                size     = <0x00800000>;         // Running memory size
                sys      = "rtt";                // RTOS (rtt) or Bare-metal (hal)
                core     = "ap";                 // Processor core type: ap or mcu
                rtt_config   = "board/rk3562_evb1_lp4x/amp_defconfig";
            };
            udelay       = <10000>;              // Delay to start the next processor core
            hash {
                algo = "sha256";                 // Specifies the algorithm for firmware integrity check
            };
        };
    };
    share {                                           // Shared memory configuration at
compile time, automatically cleared after compilation
        shm_base         = <0x07800000>;          // Shared memory start address
        shm_size         = <0x00400000>;          // Shared memory size
        rpmsg_base       = <0x07c00000>;          // RPMsg shared memory start address
        rpmsg_size       = <0x00500000>;          // RPMsg shared memory size
    };
    configurations {
        default = "conf";
        conf {
            description = "Rockchip AMP images";
            rollback-index = <0x0>;
            loadables = "amp3";                   // Specifies the firmware to be loaded, as well as the loading and startup order
            signature {
                algo = "sha256,rsa2048";
                padding = "pss";
                key-name-hint = "dev";
                sign-images = "loadables";
            };
            /* - run linux on cpu0 * - it is brought up by amp(that run on U-Boot) * - it is boot entry depends on U-Boot */
            linux {                               // Supports Linux hybrid deployment
                description  = "linux-os";
                arch         = "arm64";
                cpu          = <0x000>;
                thumb        = <0>;
                hyp          = <0>;
                udelay       = <0>;
                // If the AMP firmware load location conflicts with the Linux Kernel load location, it needs to be adjusted
                load         = <0x2000000>;        // Linux Kernel load location
                load_c       = <0x4880000>;        // Compressed Linux Kernel load location
            };
        };
    };
};
```

##### 3.1.2.2 amp.its

Gemischter Betrieb von RTOS + Bare-metal. Im folgenden Beispiel führt CPU1 des RK3562 unabhängig RTOS aus; die übrigen Kerne führen drei unabhängige Bare-metal-Instanzen aus.

```text
/dts-v1/;
/ {
    description = "FIT source file for Rockchip AMPAK";
    #address-cells = <1>;
    images {
        amp0 {
            description  = "Bare-metal-core0";
            data         = /incbin/("rtt0.bin");
            type         = "firmware";
            compression  = "none";
            arch         = "arm";
            cpu          = <0x0>;
            thumb        = <0>;
            hyp          = <0>;
            load         = <0x02000000>;
            udelay       = <10000>;
            compile {
                size    = <0x00800000>;
                sys     = "hal";
            };
            hash {
                algo = "sha256";
            };
        };
        amp1 {
            description  = "RTOS-core1";
            data         = /incbin/("rtt1.bin");
            type         = "firmware";
            compression  = "none";
            arch         = "arm";
            cpu          = <0x1>;
            thumb        = <0>;
            hyp          = <0>;
            load         = <0x00800000>;
            udelay       = <10000>;
            compile {
                size    = <0x00800000>;
                sys     = "rtos";
            };
            hash {
                algo = "sha256";
            };
        };
        amp2 {
            description  = "Bare-metal-core2";
            data         = /incbin/("rtt2.bin");
            type         = "firmware";
            compression  = "none";
            arch         = "arm";
            cpu          = <0x2>;
            thumb        = <0>;
            hyp          = <0>;
            load         = <0x01000000>;
            udelay       = <10000>;
            compile {
                size    = <0x00800000>;
                sys     = "hal";
            };
            hash {
                algo = "sha256";
            };
        };
        amp3 {
            description  = "Bare-metal-core3";
            data         = /incbin/("rtt3.bin");
            type         = "firmware";
            compression  = "none";
            arch         = "arm";
            cpu          = <0x3>;
            thumb        = <0>;
            hyp          = <0>;
            load         = <0x01800000>;
            udelay       = <10000>;
            compile {
                size    = <0x00800000>;
                sys     = "hal";
            };
            hash {
                algo = "sha256";
            };
        };
    }
    share {
        shm_base         = <0x07800000>;
        shm_size         = <0x00400000>;
    };
    configurations {
        default = "conf";
        conf {
            description = "Rockchip AMPAK images";
            rollback-index = <0x0>;
            loadables = "amp0", "amp1", "amp2", "amp3";
            signature {
                algo = "sha256,rsa2048";
                padding = "pss";
                key-name-hint = "dev";
                sign-images = "loadables";
            };
        };
    };
};
```

##### 3.1.2.3 amp_mcu.its

Gemischter Betrieb von Linux + MCU RTOS / Bare-metal. Im folgenden Beispiel führt der AP des RK3562 Linux SMP aus; die MCU führt unabhängig Bare-metal AMP aus.

```text
/dts-v1/;
/ {
    description = "Rockchip AMP FIT Image";
    #address-cells = <1>;
    images {
        mcu {
            description  = "mcu";
            data         = /incbin/("./rtt.bin");
            type         = "standalone";          // MCU is set to standalone
            compression  = "none";
            arch         = "arm";
            load         = <0x08200000>;
            udelay       = <1000000>;
            compile {
                size     = <0x00800000>;
                sys      = "hal";
                core     = "mcu";                 // Processor core type: ap or mcu
            };
            hash {
                algo = "sha256";
            };
        };
    };
    share {
        shm_base         = <0x07800000>;
        shm_size         = <0x00400000>;
        rpmsg_base       = <0x07c00000>;
        rpmsg_size       = <0x00500000>;
    };
    configurations {
        default = "conf";
        conf {
            description = "Rockchip AMP images";
            rollback-index = <0x0>;
            loadables = "mcu";
            signature {
                algo = "sha256,rsa2048";
                padding = "pss";
                key-name-hint = "dev";
                sign-images = "loadables";
            };
        };
    };
};
```

Hinweis: Planen Sie Laufzeitspeicher und gemeinsam genutzten Speicher im heterogenen Mehrkernsystem von Rockchip sorgfältig, um Konflikte zu vermeiden.

Verwandte Abschnitte:

Kapitel 4: Ressourcenaufteilung

#### 3.1.3 Ergänzende Konfigurationsdatei

Einige SoC-Plattformen benötigen zusätzlich die Konfigurationsdatei &lt;AMP_SDK&gt;/device/rockchip/.chip/$RK_AMP_CFG . Ihre Parameter werden direkt als Umgebungsvariablen exportiert und unterstützen den Build.

Für die gemeinsame LOG-Funktion auf RK3308 ist beispielsweise folgende Konfiguration erforderlich:

```text
## Chapter-3 RTT config
## Chapter-3 Share Memory config
RTT_SHLOG0_SIZE=0x00001000
RTT_SHLOG1_SIZE=0x00001000
RTT_SHLOG2_SIZE=0x00001000
RTT_SHLOG3_SIZE=0x00001000
## Chapter-3 HAL config
## Chapter-3 Share Memory config same as RTT
SHLOG0_SIZE=$RTT_SHLOG0_SIZE
SHLOG1_SIZE=$RTT_SHLOG1_SIZE
SHLOG2_SIZE=$RTT_SHLOG2_SIZE
SHLOG3_SIZE=$RTT_SHLOG3_SIZE
```

#### 3.1.4 Konfigurationsdatei der Partitionstabelle

Passen Sie während der Entwicklung die Partitionstabelle an die tatsächliche Kapazität des Speichermediums und die Größe der AMP-Firmware an.

Bearbeiten Sie die Partitionstabellendatei parameter.txt manuell. Sie liegt unter &lt;AMP_SDK&gt;/device/rockchip/.chip/$RK_PARAMETER . Das Format zum Hinzufügen einer Partition lautet size@start(part_name) ; die Einheit ist ein Sektor (512 Bytes). Beispiel für eine 2M große amp-Partition:

```text
CMDLINE:
mtdparts=:0x00002000@0x00004000(uboot),0x00002000@0x00006000(misc),0x00020000@0x00008000(boot),0x00001000@0x00028000(amp),0x00040000@0x00029000(recovery),0x00010000@0x00069000(backup),0x01c00000@0x00079000(rootfs),0x00040000@0x01c79000(oem),-@0x01cb9000(userdata:grow)
```

Fügen Sie die neue amp-Partition mithilfe des Skripts ein:

```text
./build.sh list-parts
==========================================
          Partition table
==========================================
1:        uboot at 0x00004000 size=0x00002000(4M)
2:         misc at 0x00006000 size=0x00002000(4M)
3:         boot at 0x00008000 size=0x00020000(64M)
4:     recovery at 0x00028000 size=0x00040000(128M)
5:       backup at 0x00068000 size=0x00010000(32M)
6:       rootfs at 0x00078000 size=0x01c00000(14G)
7:          oem at 0x01c78000 size=0x00040000(128M)
8:     userdata at 0x01cb8000 size=-(grow)
./build.sh insert-part:4:amp:2M
./build.sh list-parts
==========================================
          Partition table
==========================================
1:        uboot at 0x00004000 size=0x00002000(4M)
2:         misc at 0x00006000 size=0x00002000(4M)
3:         boot at 0x00008000 size=0x00020000(64M)
4:          amp at 0x00028000 size=0x00001000(2M)
5:     recovery at 0x00029000 size=0x00040000(128M)
6:       backup at 0x00069000 size=0x00010000(32M)
7:       rootfs at 0x00079000 size=0x01c00000(14G)
8:          oem at 0x01c79000 size=0x00040000(128M)
9:     userdata at 0x01cb9000 size=-(grow)
```

### 3.2 Build-Befehle

#### 3.2.1 Allgemeiner Build-Befehl

Der allgemeine Build-Befehl des AMP SDK unterstützt das Übersetzen und Verpacken in einem Schritt:

```text
./build.sh chip         # Select the SoC platform
./build.sh lunch        # Select the default configuration file
./build.sh              # One-click compilation and packaging
./build.sh uboot        # Compile U-Boot separately
./build.sh kernel       # Compile the Linux Kernel separately
./build.sh amp          # Compile RTOS / Bare-metal separately
./build.sh cleanall     # Clean all
./build.sh help         # Get help
```

./build.sh amp liest die Paketkonfiguration der AMP-Firmware und erstellt und verpackt amp.img automatisch.

#### 3.2.2 Separate Build-Befehle

Die separaten Build-Befehle der einzelnen Komponenten stehen in build_info.txt der mit dem AMP SDK gelieferten Basisfirmware.

##### 3.2.2.1 Build-Befehle für den Linux-Kernel

Für das separate Übersetzen des Linux-Kernels dienen am Beispiel des RK3562-AP folgende Befehle als Referenz:

```text
cd <AMP_SDK>/kernel
export ARCH=arm64                              # Specify the architecture of the processor
export CROSS_COMPILE="path to compiler"        # Specify the cross-compilation toolchain
## Chapter-3 For example:
export CROSS_COMPILE=../prebuilts/gcc/linux-x86/aarch64/gcc-arm-10.3-2021.07-x86_64-aarch64-none-linux-gnu/bin/aarch64-none-linux-gnu-
make rockchip_linux_defconfig                  # Specify the compilation configuration
make rk3562-evb1-lp4x-v10-linux-amp.img -j8    # Compile the specified dts board-level configuration
```

##### 3.2.2.2 Build-Befehl für RT-Thread

Für das separate Übersetzen von RT-Thread dient am Beispiel des RK3562-AP folgender Befehl als Referenz:

```text
cd <AMP_SDK>/rtos/bsp/rockchip/rk3562-32/
./build.sh <cpu_id 0~3 or all>
./mkimage.sh
scons -j8
scons -c
```

##### 3.2.2.3 Build-Befehl für RK HAL

Für das separate Übersetzen von RK HAL dient am Beispiel des RK3562-AP folgender Befehl als Referenz:

```text
cd <AMP_SDK>/hal/project/rk3562/GCC
./build.sh <cpu_id 0~3 or all>
cd ..
./mkimage.sh
make -j8
make clean
```

##### 3.2.2.4 Build-Befehl für U-Boot

Für das separate Übersetzen von U-Boot dient am Beispiel RK3562 folgender Befehl als Referenz:

```text
cd <AMP_SDK>/u-boot/
make rk3562_defconfig rk-amp.config
./make.sh
```

Falls ein spezielles rkbin benötigt wird, etwa eines, das in der vorherigen Bootphase auf CPU3 läuft, lautet der Referenzbefehl:

```text
cd <AMP_SDK>/u-boot/
make rk3562_defconfig rk-amp.config
./make.sh ../rkbin/RKTRUST/RK3562TRUST_CPU3.ini
```

Verwandte Abschnitte:

Kapitel 5: Boot-Konzept

## 4. Kapitel 4: Ressourcenaufteilung

### 4.1 Systemarchitektur

#### 4.1.1 Systemarchitektur AP + AP

Im heterogenen Mehrkernsystem von Rockchip gibt es zwei AP-+-AP-Architekturen: Linux + RTOS / Bare-metal und RTOS + Bare-metal. Bei Linux + RTOS / Bare-metal ist der Linux-Prozessorkern der Hauptkern (Master Core), während der RTOS-/Bare-metal-Kern der untergeordnete Kern (Remote Core) ist. Bei RTOS + Bare-metal ist der zuerst gestartete Prozessorkern der Hauptkern; alle weiteren sind Remote Cores. Der Hauptkern teilt die gemeinsamen Ressourcen des gesamten heterogenen Mehrkernsystems auf, verwaltet sie und führt das Dienstprogramm der Hauptstation aus.

![Rockchip-AMP-Originalabbildung: 4.1.1 Systemarchitektur AP + AP — Seite 34](/docs/rockchip-amp/assets/en-p034-fig01.png)

![Rockchip-AMP-Originalabbildung: 4.1.1 Systemarchitektur AP + AP — Seite 35](/docs/rockchip-amp/assets/en-p035-fig01.png)

#### 4.1.2 Systemarchitektur AP + MCU

Die AP-+-MCU-Architektur des heterogenen Mehrkernsystems von Rockchip verwendet Linux + MCU RTOS / Bare-metal. Der AP-Kern mit Linux ist der Hauptkern; der MCU-Kern mit RTOS / Bare-metal ist der Remote Core. Der Hauptkern übernimmt Aufteilung und Verwaltung der gemeinsamen Ressourcen des gesamten Systems und führt das Dienstprogramm der Hauptstation aus.

![Rockchip-AMP-Originalabbildung: 4.1.2 Systemarchitektur AP + MCU — Seite 36](/docs/rockchip-amp/assets/en-p036-fig01.png)

### 4.2 Ressourcenkonfiguration des Linux-Kernels

#### 4.2.1 Konfigurationsdateien des Linux-Kernels

##### 4.2.1.1 Zugehörige DTS-Dateien

Die Ressourcen des Linux-Kernels werden in DTS-Dateien konfiguriert. Die DTS-Dateien des heterogenen Mehrkernsystems von Rockchip heißen rkxxxx-evbxxxxx-amp.dts und binden rkxxxx-amp.dtsi ein, beispielsweise:

```text
arch/arm64/boot/dts/rockchip/rk3562-amp.dtsi
arch/arm64/boot/dts/rockchip/rk3562-evb1-lp4x-v10-linux-amp.dts
```

rk3562-amp.dtsi dient dem Linux-Kernel zur zentralen Verwaltung der gemeinsam genutzten Ressourcen des heterogenen Mehrkernsystems.

```text
/ {
        rockchip_amp: rockchip-amp {
                compatible = "rockchip,amp";
                /* Clock resources used by AMP */
                clocks = <&cru FCLK_BUS_CM0_CORE>, <&cru CLK_BUS_CM0_RTC>,
                        <&cru PCLK_MAILBOX>, <&cru PCLK_INTC>,
                        <&cru SCLK_UART7>, <&cru PCLK_UART7>,
                        <&cru PCLK_TIMER>, <&cru CLK_TIMER4>, <&cru CLK_TIMER5>;
                /* Pin resources used by AMP */
                pinctrl-names = "default";
                pinctrl-0 = <&uart7m1_xfer>;
                /* Interrupt resources used by AMP */
                amp-cpu-aff-maskbits = /bits/ 64 <0x0 0x1 0x1 0x2 0x2 0x4 0x3 0x8>;
                amp-irqs = /bits/ 64 <GIC_AMP_IRQ_CFG_ROUTE(147, 0xd0, CPU_GET_AFFINITY(3, 0))>;
                status = "okay";
        };
};
```

##### 4.2.1.2 Zugehörige AMP-Treiberdateien

AMP-Treiberdatei: &lt;AMP_SDK&gt;/kernel/drivers/soc/rockchip/rockchip_amp.c

```text
// ...
// Centralized management of AMP's interrupt resources, called by the GIC driver
static void amp_gic_get_irqs_config(struct device_node *np, struct amp_gic_ctrl_s *amp_ctrl)
{
    // ....
}
static int rockchip_amp_probe(struct platform_device *pdev)
{
    // ...
    // Centralized management of AMP's clock resources
    rkamp_dev->num_clks = devm_clk_bulk_get_all(&pdev->dev, &rkamp_dev->clks);
    // Centralized management of AMP's power supply resources
    rkamp_dev->num_pds =
        of_count_phandle_with_args(pdev->dev.of_node, "power-domains",
                                   "#power-domain-cells");
    // Centralized management of AMP's core resources, lifecycle management of the core, such as open, close, restart, etc.
    cpus_node = of_get_child_by_name(pdev->dev.of_node, "amp-cpus");
    // ...
}
// Pin resources, processed by the pinctrl driver before calling rockchip_amp_probe.
static const struct of_device_id rockchip_amp_match[] = {
    { .compatible = "rockchip,amp" }, // Corresponds to the property in the DTS file
    // ...
};
```

#### 4.2.2 Konfiguration der Linux-Kerne

Kerne, auf denen HAL/RTOS läuft, müssen vor Linux verborgen werden; daher sind die zugehörigen Knoten aus dem DTS zu entfernen. Die Kerne jeder Plattform sind bereits in 'rkxxxx.dtsi' definiert. Binden Sie die konfigurierte DTSI-Datei in den AMP-DTS ein und löschen Sie die zu verwendenden Kerne daraus. Beispiel: Core3 der A55-Kerne des RK3588 wird für HAL/RTOS verwendet:

```text
/ {
    model = "Rockchip RK3588 EVB1 LP4 V10 Board";
    compatible = "rockchip,rk3588-evb1-lp4-v10", "rockchip,rk3588";
    cpus {
        cpu-map {
            cluster0 {
                /delete-node/ core3;
            };
        };
    };
    reserved-memory {
        #address-cells = <2>;
        #size-cells = <2>;
        ranges;
        amp_reserved: amp@800000 {
            reg = <0x0 0x00800000 0x0 0x01800000>;
            no-map;
        };
    };
};
&arm_pmu {
    interrupt-affinity = <&cpu_l0>, <&cpu_l1>, <&cpu_l2>,
                 <&cpu_b0>, <&cpu_b1>, <&cpu_b2>, <&cpu_b3>;
};
/delete-node/ &cpu_l3;
```

Core3 der A76-Kerne des RK3588 für HAL/RTOS verwenden:

```text
/ {
    model = "Rockchip RK3588 EVB1 LP4 V10 Board";
    compatible = "rockchip,rk3588-evb1-lp4-v10", "rockchip,rk3588";
    cpus {
        cpu-map {
            cluster2 {
                /delete-node/ core1;
            };
        };
    };
    reserved-memory {
        #address-cells = <2>;
        #size-cells = <2>;
        ranges;
        amp_reserved: amp@800000 {
            reg = <0x0 0x00800000 0x0 0x01800000>;
            no-map;
        };
    };
};
&arm_pmu {
    interrupt-affinity = <&cpu_l0>, <&cpu_l1>, <&cpu_l2>, <&cpu_l3>,
                 <&cpu_b0>, <&cpu_b1>, <&cpu_b2>;
};
/delete-node/ &cpu_b3;
```

#### 4.2.3 Speicherressourcen des Linux-Kernels

##### 4.2.3.1 Konfiguration des Laufzeitspeichers

DRAM ist der private Laufzeitspeicher des Systems. Standardmäßig verwendet der Linux-Kernel sämtliche DDR-Ressourcen als DRAM. Deshalb muss im DTS des Linux-Kernels der DRAM-Bereich anderer Systeme im heterogenen Mehrkernsystem reserviert werden.

Beispiel RK3562:

```text
/ {
    reserved-memory {
        /* rk3588-amp.dtsi */
        /* MCU address */
        mcu_reserved: mcu@8200000 {
            reg = <0x0 0x8200000 0x0 0x100000>;
            no-map;
        };
        /* rk3588-evb1-lp4-v10-linux-amp.dts */
        /* AP address */
        amp_reserved: amp@800000 {
            reg = <0x0 0x01800000 0x0 0x00800000>;
            no-map;
        };
    };
};
```

##### 4.2.3.2 Konfiguration des gemeinsam genutzten Speichers

Der gemeinsam genutzte Speicher (Share Memory) dient dem Informationsaustausch zwischen mehreren Systemen. Standardmäßig verwendet der Linux-Kernel sämtliche DDR-Ressourcen als DRAM. Deshalb muss der gemeinsame Speicher im DTS des Linux-Kernels reserviert werden.

Die Reservierung erfolgt wie bei der DRAM-Konfiguration des Linux-Kernels; lediglich die Namen müssen unterschiedlich sein.

Beispiel RK3562:

```text
/ {
    reserved-memory {
        /* rk3588-amp.dtsi */
        rpmsg_reserved: rpmsg@7c00000 {
            reg = <0x0 0x07c00000 0x0 0x400000>;
            no-map;
        };
    };
};
```

#### 4.2.4 Peripherieressourcen des Linux-Kernels

Der Linux-Kernel definiert standardmäßig sämtliche SoC-Ressourcen im Device Tree Source (DTS). Wenn AMP Peripherie außerhalb des Linux-Kernels verwendet, müssen die entsprechenden Module im DTS deaktiviert werden, damit andere AMP-Systeme diese Ressourcen nutzen können.

Das folgende Beispiel übergibt die I2C1-Ressource des RK3562 EVB1 vom Linux-Kernel an RTOS:

Suchen Sie zunächst die I2C1-Definition in rk3562.dtsi .

```text
i2c1: i2c@ffa00000 {                                                 /* Module Name */
        compatible = "rockchip,rk3562-i2c", "rockchip,rk3399-i2c";
        reg = <0x0 0xffa00000 0x0 0x1000>;
        clocks = <&cru CLK_I2C1>, <&cru PCLK_I2C1>;                  /* Clock References */
        clock-names = "i2c", "pclk";
        interrupts = <GIC_SPI 13 IRQ_TYPE_LEVEL_HIGH>;               /* Interrupt Reference */
        pinctrl-names = "default";
        pinctrl-0 = <&i2c1m0_xfer>;                                  /* Pin Reference */
        #address-cells = <1>;
        #size-cells = <0>;
        status = "disabled";
};
```

Laut DTS-Ressourcenkonfiguration benötigt I2C1 folgende Ressourcen:

Interruptressourcen

Pin-Ressourcen

Taktressourcen

Deaktivieren Sie zunächst die I2C1-Ressourcen im DTS:

```text
&i2c1 {
       status = "disabled";
};
```

##### 4.2.4.1 Interruptkonfiguration

Fügen Sie die Interruptressource von I2C1 dem Knoten amp-irqs unter rockchip-amp hinzu:

```text
/ {
        rockchip_amp: rockchip-amp {
                compatible = "rockchip,amp";
                // ......
                /* Interrupt resources used by AMP */
-               amp-irqs = /bits/ 64 <GIC_AMP_IRQ_CFG_ROUTE(147, 0xd0, CPU_GET_AFFINITY(3, 0))>;
+               amp-irqs = /bits/ 64 <GIC_AMP_IRQ_CFG_ROUTE(147, 0xd0, CPU_GET_AFFINITY(3, 0))
+                                     GIC_AMP_IRQ_CFG_ROUTE(45, 0xd0, CPU_GET_AFFINITY(3, 0))>;
                                      // Add I2C1: 45 = I2C1 interrupt 13 + fixed offset 32
                // ......
        };
};
```

Hinweis: Zwischen der Modul-Interruptnummer und der in amp-irqs referenzierten Interruptnummer besteht ein fester Offset von 32.

##### 4.2.4.2 Pin-Konfiguration

Fügen Sie die Pin-Ressourcen von I2C1 dem Knoten rockchip-amp hinzu:

```text
/ {
        rockchip_amp: rockchip-amp {
                compatible = "rockchip,amp";
                // ......
                /* Pin resources used by AMP */
                pinctrl-names = "default";
-               pinctrl-0 = <&uart7m1_xfer>;
+               pinctrl-0 = <&uart7m1_xfer>, <&i2c1m0_xfer>;
                // ......
        };
};
```

Hinweis: Das Modul kann mehrere Pin-Gruppen verwenden. Fügen Sie die tatsächlich verwendete Gruppe hinzu.

##### 4.2.4.3 Taktkonfiguration

Fügen Sie die Taktressourcen von I2C1 dem Knoten rockchip-amp hinzu:

```text
/ {
        rockchip_amp: rockchip-amp {
                compatible = "rockchip,amp";
                // ......
                /* Clock resources used by AMP */
                clocks = <&cru FCLK_BUS_CM0_CORE>, <&cru CLK_BUS_CM0_RTC>,
                        <&cru PCLK_MAILBOX>, <&cru PCLK_INTC>,
                        <&cru SCLK_UART7>, <&cru PCLK_UART7>,
-                       <&cru PCLK_TIMER>, <&cru CLK_TIMER4>, <&cru CLK_TIMER5>;
+                       <&cru PCLK_TIMER>, <&cru CLK_TIMER4>, <&cru CLK_TIMER5>,
+                       <&cru CLK_I2C1>, <&cru PCLK_I2C1>;
                // ......
        };
};
```

### 4.3 RTOS-Ressourcenkonfiguration

#### 4.3.1 RT-Thread-Konfigurationsdatei

SoC-Projekte enthalten normalerweise mehrere vordefinierte Board-Konfigurationen. Ändern Sie CONFIG_RT_BOARD_NAME mit scons --menuconfig , um dasselbe Projekt an verschiedene Boards anzupassen.

Die RT-Thread-Konfiguration umfasst daher:

```text
<AMP_SDK>/internal/rk3588/rtos/bsp/rockchip/rk3562-32/
├── applications
├── board
│   ├── common                  # Common configuration
│   ├── Kconfig
│   ├── rk3562_evb1_lp4x        # Board-level configuration
│   └── SConscript
├── build.sh                    # Build script, containing some build configurations
└── ...
```

Allgemeine Konfiguration: Grundkonfiguration des Chips; dieser obligatorische Projektcode wird von allen Board-Projekten verwendet.

Board-Konfiguration: Konfiguriert Funktionen eines bestimmten Boards, beispielsweise GPIO, UART und I2C.

Build-Befehl: Ermöglicht die Übergabe von Systemparametern beim Übersetzen und damit flexible Build-Anweisungen. Falls ein build.sh-Skript vorhanden ist, können die Parameter dort direkt definiert werden. Alternativ lassen sich bestimmte Build-Parameter mit export setzen und anschließend mit scons übersetzen.

##### 4.3.1.1 Boardbezogene Dateien

Die Ressourcenkonfiguration des RT-Thread-Projekts umfasst allgemeine und boardspezifische Einstellungen.

Zu den allgemeinen Konfigurationsdateien gehören:

```text
## Chapter-4 General Configuration
<AMP_SDK>/rtos/bsp/rockchip/rk3562-32/board/common/board_base.c
<AMP_SDK>/rtos/bsp/rockchip/rk3562-32/board/common/iomux_base.c
```

Die allgemeine Konfiguration legt die Initialisierungsreihenfolge beim Hardwarestart und die Standardressourcen fest. Zahlreiche RT_WEAK-Definitionen ermöglichen es, diese in der Board-Konfiguration einfach zu ersetzen.

```text
RT_WEAK const struct clk_init clk_inits[];            // Weak definition of structure, can
be redefined in board-level configuration
RT_WEAK  void rt_hw_iomux_config(void);               // Weak definition of function, can be
redefined in board-level configuration
// ...                                                // Weak definition resources vary with different SoCs, not listed one by one
void rt_hw_board_init(void)
{
    // ... Initialization sequence, do not modify
}
```

Zu den Board-Konfigurationsdateien gehören:

```text
## Chapter-4 Board-Level Configuration
<AMP_SDK>/rtos/bsp/rockchip/rk3562-32/board/rk3562_evb1_lp4x/board.c
<AMP_SDK>/rtos/bsp/rockchip/rk3562-32/board/rk3562_evb1_lp4x/iomux.c
```

In der Board-Konfiguration müssen die RT_WEAK-Ressourcen neu definiert werden.

```text
// <AMP_SDK>/rtos/bsp/rockchip/rk3562-32/board/rk3562_evb1_lp4x/iomux.c
void rt_hw_iomux_config(void)
{
    // ...
}
```

##### 4.3.1.2 Build-Dateien

RT-Thread verwendet SCONS für den Build. Folgende Dateien sind daran beteiligt:

```text
cd <AMP_SDK>/rtos/bsp/rockchip/rk3562-32/
rk3562-32/rtconfig.h               # Configuration file used for compilation
rtconfig.py                        # Compilation script, determining the location of the
compilation chain, and the input parameters of the compilation command, etc.
SConscript                         # SCONS link file
SConstruct                         # SCONS link file
build.sh                           # RT-Thread AP Core quick compilation script, MCU Core does not have this script
```

Der AP-Kern wird mit dem Skript ./build.sh übersetzt, der MCU-Kern mit make .

#### 4.3.2 Speicherressourcen von RT-Thread

Die Speicheraufteilung von RT-Thread erfolgt über die beim Build verwendeten Linkerskripte.

```text
<AMP_SDK>/rtos/bsp/rockchip/rk3562-32/gcc_arm.ld.S
<AMP_SDK>/rtos/bsp/rockchip/rk3562-mcu/gcc_link.ld.S
```

##### 4.3.2.1 AP-Laufzeitspeicher

```text
/* cat <AMP_SDK>/rtos/bsp/rockchip/rk3562-32/gcc_arm.ld.S */
MEMORY
{
    SRAM  (rxw) : ORIGIN = 0xfe480000, LENGTH = 64K            /* SYSTEM SRAM */
    DRAM  (rxw) : ORIGIN = FIRMWARE_BASE, LENGTH = DRAM_SIZE   /* DRAM */
    SHMEM (rxw) : ORIGIN = SHMEM_BASE, LENGTH = SHMEM_SIZE     /* shared memory for all cpu */
    LINUX_RPMSG (rxw) : ORIGIN = LINUX_RPMSG_BASE, LENGTH = LINUX_RPMSG_SIZE
}
## Chapter-4 cat <AMP_SDK>/rtos/bsp/rockchip/rk3562-32/rtconfig.py
## Chapter-4 variable conversion, connecting the build.sh script and gcc_arm.ld.S file
CFLAGS += ' -DFIRMWARE_BASE={a} -DDRAM_SIZE={b} -DSHMEM_BASE={c} -DSHMEM_SIZE={d} -DLINUX_RPMSG_BASE={e} -DLINUX_RPMSG_SIZE={f}'.format(a=PRMEM_BASE, b=PRMEM_SIZE, c=SHMEM_BASE, d=SHMEM_SIZE, e=LINUX_RPMSG_BASE, f=LINUX_RPMSG_SIZE)
## Chapter-4 cat <AMP_SDK>/rtos/bsp/rockchip/rk3562-32/build.sh
export RTT_PRMEM_BASE=$(eval echo \$CPU$1_MEM_BASE)            /* DRAM start location */
export RTT_PRMEM_SIZE=$(eval echo \$CPU$1_MEM_SIZE)            /* DRAM capacity size */
export RTT_SHMEM_BASE=0x07800000                               /* shared memory start location */
export RTT_SHMEM_SIZE=0x00400000                               /* shared memory capacity size */
export LINUX_RPMSG_BASE=0x07c00000                             /* rpmsg start location */
export LINUX_RPMSG_SIZE=0x00500000                             /* rpmsg capacity size */
```

Die Speicherkonfiguration des RT-Thread-AP-Kerns liegt in gcc_arm.ld.S . Für eine einfachere Build-Konfiguration werden einige Parameter über rtconfig.py nach build.sh übertragen.

Die im AP-Kern konfigurierten Adressen entsprechen den tatsächlichen physischen DDR-Adressen.

DRAM kann über die Parameter in build.sh konfiguriert werden:

```text
CPU3_MEM_BASE=0x01800000
CPU3_MEM_SIZE=0x00800000
export RTT_PRMEM_BASE=$(eval echo \$CPU$1_MEM_BASE)             /* DRAM start location */
export RTT_PRMEM_SIZE=$(eval echo \$CPU$1_MEM_SIZE)             /* DRAM capacity size */
```

Die unterschiedlichen Variablennamen werden über rtconfig.py umgesetzt.

##### 4.3.2.2 Gemeinsam genutzter AP-Speicher

Für den gemeinsam genutzten Speicher LINUX_RPMSG muss beispielsweise Folgendes in gcc_arm.ld.S definiert werden:

```text
MEMORY {
    LINUX_RPMSG (rxw) : ORIGIN = LINUX_RPMSG_BASE, LENGTH = LINUX_RPMSG_SIZE
}
.linux_share_rpmsg (NOLOAD):
{
    PROVIDE(__linux_share_rpmsg_start__ = .);
    . += LINUX_RPMSG_SIZE;
    PROVIDE(__linux_share_rpmsg_end__ = .);
} > LINUX_RPMSG
```

Der Zeiger auf die physische Adresse von LINUX_RPMSG lässt sich direkt im Code ermitteln:

```text
/* [AMP_SDK]/rtos/bsp/rockchip/rk3562-32/board/common/rpmsg_base.h */
/* RPMSG shared memory information */
extern uint32_t __share_rpmsg_start__[];
extern uint32_t __share_rpmsg_end__[];
#define RPMSG_MEM_BASE      ((uint32_t)&__share_rpmsg_start__)
#define RPMSG_MEM_END       ((uint32_t)&__share_rpmsg_end__)
```

##### 4.3.2.3 MCU-Laufzeitspeicher

```text
/* cat <AMP_SDK>/rtos/bsp/rockchip/rk3562-mcu/gcc_link.ld.S */
MEMORY
{
    DDR   (rxw) : ORIGIN = 0x00000000, LENGTH = 512K               /* DRAM */
}
/* cat <AMP_SDK>/rtos/bsp/rockchip/rk3562-mcu/Image/amp.its */
/ {
    images {
        mcu {
            //...
            load         = <0x08200000>;
            //...
        };
    };
};
```

Die Speicherkonfiguration des RT-Thread-MCU-Kerns erfolgt gemeinsam über gcc_link.ld.S und amp.its .

Im Unterschied zum AP-Kern startet der MCU-Kern an seiner eigenen Adresse 0. Zwischen der aus Sicht der MCU sichtbaren Adresse und der tatsächlichen physischen Adresse besteht deshalb ein fester Offset.

```text
/* cat <AMP_SDK>/rtos/bsp/rockchip/rk3562-mcu/gcc_link.ld.S */
MEMORY
{
    DDR   (rxw) : ORIGIN = 0x00000000, LENGTH = 512K               /* DRAM */
}
/* cat <AMP_SDK>/rtos/bsp/rockchip/rk3562-mcu/Image/amp.its */
/ {
    images {
        mcu {
            //...
            load         = <0x08200000>;
            //...
        };
    };
};
```

Im obigen Beispiel liegt das DRAM von RT-Thread auf der MCU an der physischen Adresse 0x08200000 und besitzt eine Kapazität von 512K.

##### 4.3.2.4 Gemeinsam genutzter MCU-Speicher

Um beispielsweise LINUX_RPMSG als gemeinsamen Speicher zur RT-Thread-MCU des RK3562 hinzuzufügen, muss Folgendes in gcc_arm.ld.S definiert werden:

```text
/* cat <AMP_SDK>/rtos/bsp/rockchip/rk3562-mcu/gcc_link.ld.S */
MEMORY {
    // ...
    LINUX_RPMSG (rxw) : ORIGIN = 0x00100000, LENGTH = 0x00500000
}
//...
.linux_share_rpmsg (NOLOAD):
{
    PROVIDE(__linux_share_rpmsg_start__ = .);
    . += LINUX_RPMSG_SIZE;
    PROVIDE(__linux_share_rpmsg_end__ = .);
} > LINUX_RPMSG
/* cat <AMP_SDK>/rtos/bsp/rockchip/rk3562-mcu/Image/amp.its */
/ {
    images {
        mcu {
            //...
            load         = <0x08200000>;
            //...
        };
    };
};
0x08300000 = 0x08200000 + 0x00100000
```

In diesem Beispiel lautet die physische Adresse von LINUX_RPMSG 0x08300000 = 0x08200000 + 0x00100000. Die aus MCU-Sicht relative Adresse ist 0x00100000. Die Größe beträgt 0x00500000 Bytes (5 MiB).

Auch im Code lassen sich die Informationen zu LINUX_RPMSG abrufen. Beachten Sie, dass alle Adressangaben der MCU relativ zu ihrer eigenen Ladeadresse versetzt sind.

```text
/* RPMSG share memory information */
extern uint32_t __share_rpmsg_start__[];
extern uint32_t __share_rpmsg_end__[];
#define RPMSG_MEM_BASE      ((uint32_t)&__share_rpmsg_start__)      /* 0x00100000 */
#define RPMSG_MEM_END       ((uint32_t)&__share_rpmsg_end__)        /* 0x00500000 */
```

#### 4.3.3 Peripherieressourcen von RT-Thread

Dieser Abschnitt erläutert das Hinzufügen eines Peripheriemoduls zu RT-Thread am Beispiel der I2C1-Ressource des RK3562.

##### 4.3.3.1 AP-Interruptkonfiguration

Überspringen Sie diesen Abschnitt bei Verwendung des MCU-Kerns. Die MCU verwendet einen eigenen NVIC-Controller und benötigt diese Konfiguration nicht.

Geben Sie in irqsConfig an, dass I2C1-Interrupts bearbeitet werden müssen.

```text
// <AMP_SDK>/rtos/bsp/rockchip/rk3562-32/board/common/board_base.c
// The system runs on CPU3, so CPU3 needs to respond to I2C1 interrupts.
#define CUR_CPU       3
static struct GIC_AMP_IRQ_INIT_CFG irqsConfig[] =
{
    // ...
    GIC_AMP_IRQ_CFG_ROUTE(I2C1_IRQn, 0xd0, CPU_GET_AFFINITY(CUR_CPU, 0)),
    // ...
}
```

##### 4.3.3.2 MCU-Interruptkonfiguration

Direkt mit der MCU verbundene Interrupts werden über NVIC geführt; alle anderen müssen die INTMUX-Schnittstelle verwenden.

```text
<AMP_SDK>/hal/project/rk3562/src/test_demo.c
// NVIC interface example
/************************************************/
/*                                              */
/*                SOFTIRQ_TEST                  */
/*                                              */
/************************************************/
#ifdef SOFTIRQ_TEST
static void soft_isr(void)
{
    printf("softirq_test: enter isr\n");
}
static void softirq_test(void)
{
    printf("softirq_test start\n");
    HAL_NVIC_SetIRQHandler(RSVD0_MCU_IRQn, soft_isr);
    HAL_NVIC_EnableIRQ(RSVD0_MCU_IRQn);
    HAL_DelayMs(4000);
    HAL_NVIC_SetPendingIRQ(RSVD0_MCU_IRQn);
}
#endif
// INTMUX interface example
/************************************************/
/*                                              */
/*                  GPIO_TEST                   */
/*                                              */
/************************************************/
#ifdef GPIO_TEST
    //......
static void gpio_test(void)
{
    //......
    /* Test GPIO interrupt */
    HAL_GPIO_SetPinDirection(GPIO1, GPIO_PIN_B7, GPIO_IN);
    HAL_INTMUX_SetIRQHandler(GPIO1_IRQn, gpio1_isr, NULL);
    HAL_IRQ_HANDLER_SetGpioIRQHandler(GPIO_BANK1, GPIO_PIN_B7, b7_call_back, NULL);
    HAL_INTMUX_EnableIRQ(GPIO1_IRQn);
    HAL_GPIO_SetIntType(GPIO1, GPIO_PIN_B7, GPIO_INT_TYPE_EDGE_BOTH);
    HAL_GPIO_EnableIRQ(GPIO1, GPIO_PIN_B7);
    printf("test_gpio interrupt ready\n");
}
#endif
```

##### 4.3.3.3 Pin-Konfiguration

Initialisieren Sie die Pin-Konfiguration für I2C1 in rt_hw_iomux_config .

```text
// <AMP_SDK>/rtos/bsp/rockchip/rk3562-32/board/rk3562_evb1_lp4x/iomux.c
void i2c1_m0_iomux_config(void)
{
    HAL_PINCTRL_SetIOMUX(GPIO_BANK0,
                         GPIO_PIN_B3 | GPIO_PIN_B4,
                         PIN_CONFIG_MUX_FUNC1);
}
void rt_hw_iomux_config(void)
{
    // ...
    i2c1_m0_iomux_config();
    // ...
}
```

##### 4.3.3.4 Taktkonfiguration

RT-Thread enthält ein CRU-Modul, sodass keine zusätzliche Konfiguration zum Ein- und Ausschalten des Taktes erforderlich ist.

Anschließend können Sie I2C1 über die I2C-Schnittstelle von RT-Thread ansprechen.

### 4.4 Ressourcenaufteilung für Bare-metal

#### 4.4.1 RK-HAL-Konfigurationsdatei

##### 4.4.1.1 Boardbezogene Dateien

Alle RK-HAL-Ressourcen werden direkt in main.c definiert. Anwender können die Art der Aufteilung selbst festlegen.

##### 4.4.1.2 Build-Dateien

Folgende Dateien sind am RK-HAL-Build beteiligt:

```text
cd <AMP_SDK>/hal/project/rk3562/GCC
Makefile                           # Configuration file used for compilation
build.sh                           # Quick compilation script for RT-Thread AP Core, MCU Core does not have this script
```

Der AP-Kern wird mit ./build.sh übersetzt, der MCU-Kern mit make .

#### 4.4.2 RK_HAL-Speicherressourcen

Die HAL-Speicheraufteilung erfolgt über das beim Build verwendete Linkerskript.

```text
<AMP_SDK>/hal/project/rk3562/GCC/gcc_arm.ld.S
<AMP_SDK>/hal/project/rk3562-mcu/GCC/gcc_bus_m0.ld
```

##### 4.4.2.1 AP-Laufzeitspeicher

```text
/* cat <AMP_SDK>/hal/project/rk3562/GCC/gcc_arm.ld.S */
MEMORY
{
    SRAM  (rxw) : ORIGIN = SRAM_BASE, LENGTH = SRAM_SIZE            /* SYSTEM SRAM */
    DRAM  (rxw) : ORIGIN = FIRMWARE_BASE, LENGTH = DRAM_SIZE   /* DRAM */
    SHMEM (rxw) : ORIGIN = SHMEM_BASE, LENGTH = SHMEM_SIZE     /* shared memory for all cpu */
    LINUX_RPMSG (rxw) : ORIGIN = LINUX_RPMSG_BASE, LENGTH = LINUX_RPMSG_SIZE
}
## Chapter-4 cat <AMP_SDK>/hal/lib/CMSIS/Device/RK3562/Source/Templates/mmu_rk3562.c
## Chapter-4 Memory mapping, connect build.sh script and gcc_arm.ld.S file
## Chapter-4 if defined(NC_MEM_BASE) && defined(NC_MEM_SIZE)
    MMU_TTSection(MMUTable, FIRMWARE_BASE, (DRAM_SIZE - NC_MEM_SIZE) >> 20, Sect_Normal);
    MMU_TTSection(MMUTable, NC_MEM_BASE, NC_MEM_SIZE >> 20, Sect_Normal_NC);
#else
    MMU_TTSection(MMUTable, FIRMWARE_BASE, DRAM_SIZE >> 20, Sect_Normal);
#endif
    MMU_TTSection(MMUTable, SHMEM_BASE, SHMEM_SIZE >> 20, Sect_Normal_SH);
//    MMU_TTSection(MMUTable, SHMEM_BASE, SHMEM_SIZE >> 20, Sect_Normal_NC_SH);
#ifdef LINUX_RPMSG_BASE
    MMU_TTSection(MMUTable, LINUX_RPMSG_BASE, LINUX_RPMSG_SIZE >> 20, Sect_Normal_NC_SH);
#endif
## Chapter-4 cat <AMP_SDK>/hal/project/rk3562/GCC/build.sh
export FIRMWARE_CPU_BASE=$(eval echo \$CPU$1_MEM_BASE)            /* DRAM start position */
export DRAM_SIZE=$(eval echo \$CPU$1_MEM_SIZE)                    /* DRAM capacity size */
export SHMEM_BASE=0x07800000                                      /* shared memory start position */
export SHMEM_SIZE=0x00400000                                   /* shared memory capacity size */
export LINUX_RPMSG_BASE=0x07c00000                             /* rpmsg start position */
export LINUX_RPMSG_SIZE=0x00500000                             /* rpmsg capacity size */
```

Die Speicherkonfiguration des HAL-AP-Kerns liegt in gcc_arm.ld.S . Einige Parameter werden über mmu_rk3562.c in build.sh umgesetzt, damit die Build-Konfiguration einfacher geändert werden kann.

Die im AP-Kern konfigurierten Adressen entsprechen den tatsächlichen physischen DDR-Adressen.

DRAM kann über die Parameter in build.sh konfiguriert werden:

```text
CPU3_MEM_BASE=0x01800000
CPU3_MEM_SIZE=0x00800000
export FIRMWARE_CPU_BASE=$(eval echo \$CPU$1_MEM_BASE)             /* DRAM start position */
export DRAM_SIZE=$(eval echo \$CPU$1_MEM_SIZE)                     /* DRAM capacity size */
```

Die obigen Variablen entsprechen dem DRAM-Bereich in gcc_arm.ld.S :

```text
DRAM  (rxw) : ORIGIN = FIRMWARE_BASE, LENGTH = DRAM_SIZE    /* DRAM */
```

Die unterschiedlichen Variablennamen werden in mmu_rk3562.c umgesetzt.

##### 4.4.2.2 Gemeinsam genutzter AP-Speicher

Für den gemeinsam genutzten Speicher LINUX_RPMSG muss beispielsweise Folgendes in gcc_arm.ld.S definiert werden:

```text
MEMORY {
    LINUX_RPMSG (rxw) : ORIGIN = LINUX_RPMSG_BASE, LENGTH = LINUX_RPMSG_SIZE
}
.linux_share_rpmsg (NOLOAD):
{
    PROVIDE(__linux_share_rpmsg_start__ = .);
    . += LINUX_RPMSG_SIZE;
    PROVIDE(__linux_share_rpmsg_end__ = .);
} > LINUX_RPMSG
```

Der Zeiger auf die physische Adresse von LINUX_RPMSG lässt sich direkt im Code ermitteln:

```text
/* <AMP_SDK>/hal/project/rk3562/src/test_demo.c */
extern uint32_t __linux_share_rpmsg_start__[];
extern uint32_t __linux_share_rpmsg_end__[];
#define RPMSG_LINUX_MEM_BASE ((uint32_t)&__linux_share_rpmsg_start__)
#define RPMSG_LINUX_MEM_END  ((uint32_t)&__linux_share_rpmsg_end__)
#define RPMSG_LINUX_MEM_SIZE (2UL * RL_VRING_OVERHEAD)
```

##### 4.4.2.3 MCU-Laufzeitspeicher

```text
/* cat <AMP_SDK>/hal/project/rk3562-mcu/GCC/gcc_bus_m0.ld */
MEMORY
{
    DDR   (rxw) : ORIGIN = 0x00000000, LENGTH = 512K               /* DRAM */
}
/* cat <AMP_SDK>/hal/project/rk3562-mcu/Image/amp.its */
/ {
    images {
        mcu {
            //...
            load         = <0x08200000>;
            //...
        };
    };
};
```

Die Speicherkonfiguration des HAL-MCU-Kerns wird gemeinsam durch gcc_bus_m0.ld und amp.its festgelegt.

Im Unterschied zum AP-Kern startet der MCU-Kern an seiner eigenen Adresse 0. Zwischen den aus MCU-Sicht sichtbaren Adressen und den tatsächlichen physischen Adressen besteht daher ein fester Offset.

##### 4.4.2.4 Gemeinsam genutzter MCU-Speicher

Um beispielsweise LINUX_RPMSG als gemeinsamen Speicher zur HAL-MCU des RK3562 hinzuzufügen, muss Folgendes in gcc_bus_m0.ld definiert werden:

```text
/* cat <AMP_SDK>/hal/project/rk3562-mcu/GCC/gcc_bus_m0.ld */
MEMORY {
    // ...
    LINUX_RPMSG (rxw) : ORIGIN = 0x00100000, LENGTH = 0x00500000
}
//...
.linux_share_rpmsg (NOLOAD):
{
    PROVIDE(__linux_share_rpmsg_start__ = .);
    . += LINUX_RPMSG_SIZE;
    PROVIDE(__linux_share_rpmsg_end__ = .);
} > LINUX_RPMSG
/* cat <AMP_SDK>/hal/project/rk3562-mcu/Image/amp.its */
/ {
    images {
        mcu {
            //...
            load         = <0x08200000>;
            //...
        };
    };
};
0x08300000 = 0x08200000 + 0x00100000
```

In diesem Beispiel lautet die physische Adresse von LINUX_RPMSG 0x08300000 = 0x08200000 + 0x00100000. Die aus MCU-Sicht relative Adresse ist 0x00100000. Die Größe beträgt 0x00500000 Bytes (5 MiB).

Auch im Code lassen sich die Informationen zu LINUX_RPMSG abrufen. Beachten Sie, dass alle MCU-Adressen relativ zur eigenen Ladeadresse versetzt sind.

#### 4.4.3 RK-HAL-Peripherieressourcen

##### 4.4.3.1 AP-Interruptkonfiguration

Alle RK-HAL-Ressourcen werden direkt in main.c definiert. Das Beispiel ergänzt die I2C1-Ressource des RK3562 und zeigt damit, wie ein Peripheriemodul zu RK HAL hinzugefügt wird.

```text
/* ------------------ I2C1 Interrupt Configuration --------------------*/
/* RK HAL bare CORE*/
static struct GIC_AMP_IRQ_INIT_CFG irqsConfig[] = {
    GIC_AMP_IRQ_CFG_ROUTE(I2C1_IRQn, 0xd0, CPU_GET_AFFINITY(3, 0)),
    GIC_AMP_IRQ_CFG_ROUTE(0, 0, CPU_GET_AFFINITY(1, 0)), /* sentinel */
};
static struct GIC_IRQ_AMP_CTRL irqConfig = {
    .cpuAff = CPU_GET_AFFINITY(1, 0),
    .defPrio = 0xd0,
    .defRouteAff = CPU_GET_AFFINITY(1, 0),
    .irqsCfg = &irqsConfig[0],
};
/* ------------------ I2C1 Pin Resources --------------------*/
static void HAL_IOMUX_I2C1M0_Config(void)
{
    HAL_PINCTRL_SetIOMUX(GPIO_BANK0,
                         GPIO_PIN_B3 | GPIO_PIN_B4,
                         PIN_CONFIG_MUX_FUNC1);
}
void main(void)
{
    uint32_t freq;
    struct I2C_HANDLE instance;
    /* HAL BASE Init */
    HAL_Init();
    /* BSP Init */
    BSP_Init();
    /* Interrupt Init */
    HAL_GIC_Init(&irqConfig);
    HAL_IOMUX_I2C1M0_Config();
    freq = HAL_CRU_ClkGetFreq(g_i2c1dev.clkID);
    HAL_I2C_Init(&instance, g_i2c1dev.pReg, freq, I2C_100K);
    // i2c operations ...
    while (1);
}
```

##### 4.4.3.2 MCU-Interruptkonfiguration

Alle RK-HAL-Ressourcen werden direkt in main.c definiert. Das Hinzufügen der I2C1-Ressource zur MCU des RK3562 zeigt, wie ein Peripheriemodul in RK HAL ergänzt wird.

```text
/* ------------------ I2C1 Pin Resources --------------------*/
static void HAL_IOMUX_I2C1M0_Config(void)
{
    HAL_PINCTRL_SetIOMUX(GPIO_BANK0,
                         GPIO_PIN_B3 | GPIO_PIN_B4,
                         PIN_CONFIG_MUX_FUNC1);
}
void main(void)
{
    uint32_t freq;
    struct I2C_HANDLE instance;
    /* HAL BASE Init, MCU Core uses NVIC controller, HAL_Init completes NVIC initialization */
    HAL_Init();
    /* BSP Init */
    BSP_Init();
    HAL_IOMUX_I2C1M0_Config();
    freq = HAL_CRU_ClkGetFreq(g_i2c1dev.clkID);
    HAL_I2C_Init(&instance, g_i2c1dev.pReg, freq, I2C_100K);
    // i2c operations ...
    while (1);
}
```

##### 4.4.3.3 Pin-Konfiguration

Die I2C1-Pin-Konfiguration ist auf MCU und AP identisch. Die benötigte Pin-Funktion wird mit HAL_PINCTRL_SetIOMUX eingestellt.

```text
/* ------------------ I2C1 Pin Resources --------------------*/
static void HAL_IOMUX_I2C1M0_Config(void)
{
    HAL_PINCTRL_SetIOMUX(GPIO_BANK0,
                         GPIO_PIN_B3 | GPIO_PIN_B4,
                         PIN_CONFIG_MUX_FUNC1);
}
void main(void)
{
    //......
    HAL_IOMUX_I2C1M0_Config();
    //......
}
```

##### 4.4.3.4 Taktkonfiguration

Die I2C1-Taktkonfiguration ist auf MCU und AP identisch. HAL_CRU_ClkGetFreq und HAL_I2C_Init ermitteln die Taktfrequenz und initialisieren das I2C-Gerät.

```text
void main(void)
{
   uint32_t freq;
   struct I2C_HANDLE instance;
   //......
   HAL_CRU_ClkGetFreq(g_i2c1dev.clkID);
   HAL_I2C_Init(&instance, g_i2c1dev.pReg, freq, I2C_100K);
   //......
}
```

### 4.5 Cache-Kohärenz

#### 4.5.1 Drei Verfahren zur Sicherstellung der Cache-Kohärenz

Für Cache-Kohärenz stehen drei Verfahren zur Verfügung:

1. Das Deaktivieren des Caches ist am einfachsten, kann die CPU-Leistung aber erheblich verringern.

2. Softwareverwaltete Kohärenz ist die herkömmliche Lösung für gemeinsam genutzte Daten. Software schreibt geänderte Cache-Daten zurück und invalidiert veraltete Daten. Häufige Aufrufe dieser Schnittstellen beanspruchen jedoch Systemressourcen.

3. Hardwareverwaltete Kohärenz vereinfacht die Software. Als „shared“ markierte Cache-Daten werden von der Hardware automatisch aktuell gehalten. Alle Prozessoren im gemeinsamen Bereich sowie Peripheriegeräte am Hardware-Kohärenzbus des CPU-Caches, beispielsweise ACP, sehen dieselben Daten.

#### 4.5.2 Zwischen AP- und MCU-Kernen

Zwischen AP- und MCU-Kernen gibt es keine hardwareverwaltete Kohärenz. Hier sind nur Verfahren 1 und 2 möglich.

#### 4.5.3 Zwischen AP-Kernen

ARM-Cortex-A-Prozessoren unterstützen als AP-Kerne weitgehend hardwareverwaltete Cache-Kohärenz; prüfen Sie dies im jeweiligen Handbuch. Alle drei Verfahren sind möglich.

Innerhalb eines Clusters stellt bei DynamIQ die DSU (DynamIQ System Unit), bei big.LITTLE die SCU (Snoop Control Unit) die Hardware-Cache-Kohärenz zwischen den Kernen sicher. Zwischen Clustern übernimmt dies die CCI (Cache Coherent Interconnect). Dabei werden die Protokolle MOESI/MESI verwendet.

Bei hardwareverwalteter Cache-Kohärenz muss die Software lediglich die Attribute shareable und cacheable in den MMU-Seitentabelleneinträgen der gemeinsam genutzten Speicheradressen konfigurieren. Weitere Einstellungen sind nicht erforderlich.

Zusammenfassung der Auswirkungen von shareable und cacheable auf die Cache-Kohärenz:

|  | non-shareable | inner-shareable | outer-shareable |
| --- | --- | --- | --- |
| non-<br>cacheable | Daten werden nicht<br>gecacht | Daten werden nicht gecacht | Daten werden nicht gecacht |
| write-back<br>cacheable | Hardware stellt keine<br>Cache-Kohärenz<br>sicher | Hardware stellt Cache-Kohärenz<br>zwischen Kernen desselben<br>Clusters sicher | Hardware stellt Cache-Kohärenz<br>zwischen verschiedenen<br>Clustern sicher |
| write-through<br>cacheable | Wie oben | Wie oben | Wie oben |

## 5. Kapitel 5: Boot-Konzept

### 5.1 Prozessorarchitektur der Rockchip-SoCs

Im heterogenen Mehrkernsystem von Rockchip lässt sich die Prozessorarchitektur des SoC wie in der folgenden Abbildung abstrahieren.

AP-Kerne (Application Processor): normalerweise ARM-Cortex-A-Prozessorkerne.

MCU-Kern (Micro Controller Unit): normalerweise ARM-Cortex-M- oder RISC-V-Prozessorkerne.

![Rockchip-AMP-Originalabbildung: 5.1 Prozessorarchitektur der Rockchip-SoCs — Seite 58](/docs/rockchip-amp/assets/en-p058-fig01.png)

### 5.2 Boot-Konzept für zwei AP-Systeme

Der RK3562 besitzt beispielsweise vier ARM-Cortex-A53-Kerne, hier als CPU0, CPU1, CPU2 und CPU3 bezeichnet. Das heterogene Mehrkernsystem von Rockchip unterstützt verschiedene Kombinationen von Betriebsmodi.

#### 5.2.1 Linux + RTOS oder Bare-metal

##### 5.2.1.1 Beispielfirmware: Kernel + RT-Thread / HAL

Beim Boot-Konzept Kernel + RT-Thread / HAL läuft RTOS standardmäßig auf CPU3. Der Bootloader startet auf CPU0 und lädt zunächst U-Boot. U-Boot liest und startet die AMP-Firmware für CPU3. Anschließend lädt und startet U-Boot auf CPU0 den Linux-Kernel, der wiederum CPU1 und CPU2 startet. Das Ablaufdiagramm lautet:

![Rockchip-AMP-Originalabbildung: 5.2.1.1 Beispielfirmware: Kernel + RT-Thread / HAL — Seite 59](/docs/rockchip-amp/assets/en-p059-fig01.png)

Die Paketdatei amp_linux.its für Kernel + RT-Thread / HAL wird wie folgt konfiguriert:

```text
/dts-v1/;
/ {
    description = "FIT source file for Rockchip AMP";
    #address-cells = <1>;
    images {
        amp3 {
            description  = "bare-metal-core3";
            data         = /incbin/("cpu3.bin");
            type         = "firmware";
            compression  = "none";
            arch         = "arm";         // arm or arm64, it is arm by default
            cpu          = <0x3>;         // CPU ID
            thumb        = <0>;
            hyp          = <0>;
            load         = <0x01800000>;  // DRAM start address
            // Compilation configuration, automatically cleared by the compilation script after compilation
            compile {
                size         = <0x00800000>; // DRAM size
                srambase     = <0xfe480000>; // SRAM start address
                sramsize     = <0x00010000>; // SRAM size
                sys          = "rtt"; // CPU running system: HAL or RT-Thread
                // RT-Thread compilation configuration file
                rtt_config   = "board/rk3562_evb1_lp4x/defconfig";
            };
            udelay       = <10000>; // CPU startup delay, the delay time when multiple CPUs start in sequence
            hash {
                algo = "sha256";
            };
        };
        // An images can contain multiple sub-nodes, SDK will traverse all nodes under images and compile and package automatically according to node information
    };
    // Shared memory information, compilation configuration, automatically cleared by the compilation script after compilation
    share {
        shm_base         = <0x07800000>; // Multi-core CPU shared SDRAM memory start address
        shm_size         = <0x00400000>; // Multi-core CPU shared SDRAM memory allocation size
        rpmsg_base       = <0x07C00000>; // RPMSG shared memory start address
        rpmsg_size       = <0x00500000>; // RPMSG shared memory allocation size
        // Main system core ID, when multiple AMPs contain multiple systems, this parameter sets the CPU ID of the main system
        // In pure RTOS AMP, it defaults to "0x01"
        // When an AMP system includes linux, the linux cpu0 is configured as the main core by default
        primary = <0x0>;
    };
    configurations {
        default = "conf";
        conf {
            description = "Rockchip AMP images";
            rollback-index = <0x0>;
            loadables = "amp3"; // Loadable image, only "amp3" in this example
            signature {
                algo = "sha256,rsa2048";
                padding = "pss";
                key-name-hint = "dev";
                sign-images = "loadables";
            };
            /* - run linux on cpu0 * - it is brought up by amp (that run on U-Boot) * - it is boot entry depends on U-Boot */
            linux {
                description  = "linux-os";
                arch         = "arm64";
                cpu          = <0x000>;
                thumb        = <0>;
                hyp          = <0>;
                udelay       = <0>;
                // If the AMP system conflicts with the Kernel loading position, adjust the Kernel loading position
                load         = <0x2000000>; // Kernel loading position
                load_c       = <0x4880000>; // Compressed Kernel loading position
            };
        };
    };
};
```

##### 5.2.1.2 Beispielfirmware: Kernel + 3 HAL

Beim Boot-Konzept Kernel + 3 * HAL läuft Linux standardmäßig auf CPU0. Dort startet der Bootloader und lädt zunächst U-Boot. U-Boot liest amp.img , lädt die Bare-metal-Firmware in der Reihenfolge loadables = "amp1", "amp2", "amp3"; und startet die zugehörigen Kerne CPU1, CPU2 und CPU3. Anschließend lädt U-Boot auf CPU0 den Linux-Kernel. Das Ablaufdiagramm lautet:

![Rockchip-AMP-Originalabbildung: 5.2.1.2 Beispielfirmware: Kernel + 3 HAL — Seite 61](/docs/rockchip-amp/assets/en-p061-fig01.png)

Die Paketdatei amp_linux.its für Kernel + 3 * HAL / RT-Thread wird wie folgt konfiguriert:

```text
description = "FIT source file for Rockchip AMP";
#address-cells = <1>;
images {
    amp1 {
    // ......
    }
    amp2 {
    // ......
    }
    amp3 {
        description  = "bare-metal-core3";
        data         = /incbin/("cpu3.bin");
        type         = "firmware";
        compression  = "none";
        arch         = "arm";         // arm or arm64, default arm
        cpu          = <0x3>;         // CPU ID
        thumb        = <0>;
        hyp          = <0>;
        load         = <0x01800000>;  // DRAM start address
        // Compile configuration, automatically cleared by the compile script after compilation
        compile {
            size         = <0x00800000>; // DRAM size
            srambase     = <0xfe480000>; // SRAM start address
            sramsize     = <0x00010000>; // SRAM size
            sys          = "hal"; // CPU running system: HAL or RT-Thread
            // RT-Thread compilation configuration file
            rtt_config   = "board/rk3562_evb1_lp4x/defconfig";
        };
        udelay       = <10000>; // CPU startup delay, delay time when multiple CPUs start in sequence
        hash {
            algo = "sha256";
        };
    };
    // An images can contain multiple sub-nodes, and the SDK will traverse all nodes under images, automatically compiling and packaging based on node information
};
## Chapter-5 Shared memory information, compile configuration, automatically cleared by the
compile script after compilation
share {
    shm_base         = <0x07800000>; // Multi-core CPU shared SDRAM memory start address
    shm_size         = <0x00400000>; // Multi-core CPU shared SDRAM memory allocation size
    rpmsg_base       = <0x07C00000>; // RPMSG shared memory start address
    rpmsg_size       = <0x00500000>; // RPMSG shared memory allocation size
    // Master system core ID, when multiple AMPs contain multiple systems, this parameter sets the CPU ID of the main system
    // In pure RTOS AMP, it is default to "0x01"
    // When the AMP system contains Linux, the Linux cpu0 is configured as the main core by default
    primary = <0x0>;
};
configurations {
    default = "conf";
    conf {
        description = "Rockchip AMP images";
        rollback-index = <0x0>;
        // Image load list: When there are multiple amp images,
        // For example: loadables = "amp0", "amp1", "amp2", "amp3"...
        // When CPU0 is the boot core, the actual loading order is: amp1-->amp2-->amp3->...-
>amp0
        // And so on, the boot core is occupied during the boot phase and will be the last to start
        // Load the image, in this example, there are "amp1", "amp2", "amp3"
        loadables = "amp1", "amp2", "amp3";
        signature {
            algo = "sha256,rsa2048";
            padding = "pss";
            key-name-hint = "dev";
            sign-images = "loadables";
        };
        /* - run linux on cpu0 * - it is brought up by amp(that run on U-Boot) * - it is boot entry depends on U-Boot */
        linux {
            description  = "linux-os";
            arch         = "arm64";
            cpu          = <0x000>;
            thumb        = <0>;
            hyp          = <0>;
            udelay       = <0>;
            // If the AMP system conflicts with the Kernel loading position, adjust the Kernel loading position
            load         = <0x2000000>; // Kernel loading position
            load_c       = <0x4880000>; // Compressed Kernel loading position
        };
    };
};
```

#### 5.2.2 RTOS + Bare-metal

##### 5.2.2.1 Beispielfirmware: HAL + HAL

Beim Boot-Konzept HAL + HAL startet der primäre Bootloader auf CPU0 und lädt zunächst U-Boot. Dieses liest amp.img , lädt die Bare-metal-Firmwares cpu1.bin, cpu2.bin und cpu3.bin und startet die zugehörigen Kerne CPU1, CPU2 und CPU3. U-Boot läuft auf CPU0 weiter und lädt die verbleibende Bare-metal-Firmware cpu0.bin. Das Ablaufdiagramm lautet:

![Rockchip-AMP-Originalabbildung: 5.2.2.1 Beispielfirmware: HAL + HAL — Seite 63](/docs/rockchip-amp/assets/en-p063-fig01.png)

Die Paketdatei amp_linux.its für HAL + HAL wird wie folgt konfiguriert:

```text
description = "FIT source file for Rockchip AMP";
        #address-cells = <1>;
        images {
                amp0 {
                // ......
                }
                amp1 {
                        description  = "Bare-metal core3";
                        data         = /incbin/("cpu1.bin");
                        type         = "firmware";
                        compression  = "none";
                        arch         = "arm";         // arm or arm64, default arm
                        cpu          = <0x1>;         // CPU ID
                        thumb        = <0>;
                        hyp          = <0>;
                        load         = <0x00800000>;  // DRAM start address
                        // Compilation configuration, automatically cleared by the compilation script after Compilation
                        compile {
                                size         = <0x00800000>; // DRAM size
                                srambase     = <0xfe480000>; // SRAM start address
                                sramsize     = <0x00010000>; // SRAM size
                                sys          = "hal"; // CPU running system: HAL or RT-Thread
                                // RT-Thread compilation configuration file
                                rtt_config   = "board/rk3562_evb1_lp4x/defconfig";
                        };
                        udelay       = <10000>; // CPU startup delay, delay time when multiple CPUs start in sequence
                        hash {
                                algo = "sha256";
                        };
                }
                amp2 {
                // ......
                }
                amp3 {
                // ......
                };
                // Multiple sub-nodes can be included under one images, SDK will traverse all nodes under images, and automatically compile and package according to the node information
        };
        // Shared memory information, compilation configuration, automatically cleared by the compilation script after compilation
        share {
                shm_base         = <0x07800000>; // Multi-core CPU shared SDRAM memory start address
                shm_size         = <0x00400000>; // Multi-core CPU shared SDRAM memory allocation size
                rpmsg_base       = <0x07C00000>; // RPMSG shared memory start address
                rpmsg_size       = <0x00500000>; // RPMSG shared memory allocation size
                // Master system core ID, when multiple AMPs contain multiple systems, this parameter sets the CPU ID of the primary system
                // In pure RTOS AMP, it is defaulted to "0x01"
                // When the AMP system contains Linux, the Linux cpu0 is configured as the primary core by default
                primary = <0x0>;
        };
        configurations {
                default = "conf";
                conf {
                        description = "Rockchip AMP images";
                        rollback-index = <0x0>;
                        // Image load list: when there are multiple amp images,
                        // For example: loadables = "amp0", "amp1", "amp2", "amp3"...
                        // When CPU0 is the boot core, the actual loading order is: amp1--
>amp2-->amp3-->...-->amp0
                        // And so on, the boot core is occupied during the boot phase and will be the last to start in the AMP
                        // Load image, in this example there are "amp1", "amp2", "amp3"
                        loadables = "amp0", "amp1", "amp2", "amp3";
                        signature {
                                algo = "sha256,rsa2048";
                                padding = "pss";
                                key-name-hint = "dev";
                                sign-images = "loadables";
                        };
                };
        };
```

##### 5.2.2.2 Beispielfirmware: RT-Thread + HAL

Beim Boot-Konzept RTOS + Bare-metal startet der vorgelagerte Bootloader auf CPU0 und lädt zunächst U-Boot. Dieses liest amp.img , lädt cpu1.bin (RTOS-Firmware) sowie die beiden Bare-metal-Firmwares cpu2.bin und cpu3.bin und startet CPU1, CPU2 und CPU3. U-Boot läuft auf CPU0 weiter und lädt und startet dort die Bare-metal-Firmware cpu0.bin. Das Ablaufdiagramm lautet:

![Rockchip-AMP-Originalabbildung: 5.2.2.2 Beispielfirmware: RT-Thread + HAL — Seite 66](/docs/rockchip-amp/assets/en-p066-fig01.png)

Die Paketdatei amp_linux.its für RT-Thread + HAL wird wie folgt konfiguriert:

```text
description = "FIT source file for Rockchip AMP";
        #address-cells = <1>;
        images {
                amp0 {
                // ......
                }
                amp1 {
                        description  = "Bare-metal core3";
                        data         = /incbin/("cpu1.bin");
                        type         = "firmware";
                        compression  = "none";
                        arch         = "arm";         // arm or arm64, default arm
                        cpu          = <0x1>;         // CPU ID
                        thumb        = <0>;
                        hyp          = <0>;
                        load         = <0x00800000>;  // DRAM start address
                        // Compilation configuration, automatically cleared by the compilation script after compilation
                        compile {
                                size         = <0x00800000>; // DRAM size
                                srambase     = <0xfe480000>; // SRAM start address
                                sramsize     = <0x00010000>; // SRAM size
                                sys          = "rtt"; // CPU running system: HAL or RT-Thread
                                // RT-Thread compilation configuration file
                                rtt_config   = "board/rk3562_evb1_lp4x/defconfig";
                        };
                        udelay       = <10000>; // CPU startup delay, delay time when multiple CPUs start in sequence
                        hash {
                                algo = "sha256";
                        };
                }
                amp2 {
                // ......
                }
                amp3 {
                // ......
                };
                // Under one images, multiple sub-nodes can be included, and the SDK will traverse all nodes under images, automatically compiling and packaging based on node information
        };
        // Shared memory information, compilation configuration, automatically cleared by the compilation script after compilation
        share {
                shm_base         = <0x07800000>; // Multi-core CPU shared SDRAM memory start address
                shm_size         = <0x00400000>; // Multi-core CPU shared SDRAM memory allocation size
                rpmsg_base       = <0x07C00000>; // RPMSG shared memory start address
                rpmsg_size       = <0x00500000>; // RPMSG shared memory allocation size
                // Master system core ID, when multiple AMPs contain multiple systems, this parameter sets the CPU ID of the main system
                // In pure RTOS AMP, it is defaulted to "0x01"
                // When the AMP system contains Linux, the Linux cpu0 is configured as the main core by default
                primary = <0x0>;
        };
        configurations {
                default = "conf";
                conf {
                        description = "Rockchip AMP images";
                        rollback-index = <0x0>;
                        // Image load list: when there are multiple amp images,
                        // For example: loadables = "amp0", "amp1", "amp2", "amp3"...
                        // When CPU0 is the boot core, the actual load order is: amp1-->amp2-
->amp3-->...-->amp0
                        // And so on, the boot core is occupied during the boot phase and will be the last to start in the AMP
                        // Load image, this example has "amp1", "amp2", "amp3"
                        loadables = "amp0", "amp1", "amp2", "amp3";
                        signature {
                                algo = "sha256,rsa2048";
                                padding = "pss";
                                key-name-hint = "dev";
                                sign-images = "loadables";
                        };
                };
        };
```

### 5.3 Boot-Konzept AP + MCU

#### 5.3.1 Linux + MCU RTOS oder Bare-metal

##### 5.3.1.1 Beispielfirmware: Kernel + MCU RT-Thread oder HAL

Beim Boot-Konzept Linux + 1 MCU startet der Bootloader auf CPU0 und lädt zunächst U-Boot. U-Boot liest und startet die AMP-Firmware der MCU. Anschließend lädt und startet es auf CPU0 den Linux-Kernel, der CPU1, CPU2 und CPU3 startet. Das Ablaufdiagramm lautet:

![Rockchip-AMP-Originalabbildung: 5.3.1.1 Beispielfirmware: Kernel + MCU RT-Thread oder HAL — Seite 68](/docs/rockchip-amp/assets/en-p068-fig01.png)

Die Paketdatei amp_linux.its für Kernel + MCU RT-Thread / HAL wird wie folgt konfiguriert:

```text
/dts-v1/;
/ {
        description = "Rockchip AMP FIT Image";
        #address-cells = <1>;
        images {
                mcu {
                        description  = "mcu"; // The firmware compiled from the hal, rtt
system is unified as mcu.bin
                        data         = /incbin/("./mcu.bin");
                        type         = "standalone"; // must be "standalone"
                        compression  = "none";
                        arch         = "arm"; // "arm64" or "arm", the same as U-Boot state
                        load         = <0x08200000>; // MCU program RAM start address
                        udelay       = <1000000>; // Boot delay time
                        hash {
                                algo = "sha256";
                        };
                };
        };
        configurations {
                default = "conf";
                conf {
                        description = "Rockchip AMP images";
                        rollback-index = <0x0>;
                        // Load image, only "mcu" in this example
                        loadables = "mcu";
                        signature {
                                algo = "sha256,rsa2048";
                                padding = "pss";
                                key-name-hint = "dev";
                                sign-images = "loadables";
                        };
                };
        };
};
```

### 5.4 Boot-Konzepte für verschiedene Speichermedien

Das SDK unterstützt das Booten von verschiedenen Speichermedien wie eMMC, Flash und SD-Karten. Entwickler können deren jeweilige Vorteile nutzen und die passende Lösung nach den Projektanforderungen auswählen.

#### 5.4.1 Booten von eMMC / Flash

Rockchip-Lösungen verwenden normalerweise eMMC / Flash als primäres Bootmedium. Dort liegen Bootloader und Betriebssystemkernel. Der grundsätzliche Ablauf ist:

1. Start nach dem Einschalten:

Nach dem Einschalten führt der Chip seinen internen Boot-ROM-Code aus.

Das Boot-ROM lädt den Bootloader in den Arbeitsspeicher.

2. Bootloader:

Der Bootloader ist ein spezieller Codeabschnitt in der Bootpartition des eMMC-/Flash-Speichers.

Normalerweise wird U-Boot oder ein angepasster Rockchip-Bootloader verwendet.

Der Bootloader initialisiert die Hardware, lädt Kernel und Dateisystem und übergibt die Kontrolle an den Kernel.

3. Laden des Kernels:

Der Bootloader lädt das Linux-Kernel-Image aus der Bootpartition von eMMC / Flash in den Arbeitsspeicher.

Er kann auch den Device Tree Blob (DTB) und weitere erforderliche Dateien laden.

4. Kernelstart:

Das geladene Kernel-Image wird im Arbeitsspeicher entpackt und ausgeführt.

Der Kernel initialisiert die Hardware, richtet Interrupts ein, startet den Scheduler usw.

Er erkennt und konfiguriert Hardwaregeräte anhand des Device Tree Blob (DTB).

Während des Starts bindet der Kernel das Root-Dateisystem ein.

5. Einbinden des Dateisystems:

Der Kernel bindet das Root-Dateisystem von eMMC / Flash gemäß den Angaben im Device Tree Blob (DTB) ein.

Das Root-Dateisystem kann beispielsweise ext4 oder FAT verwenden.

Nach dem Einbinden kann das System auf Dateien und Verzeichnisse zugreifen.

6. Initialisierung des Benutzerraums:

Initialisierungsskripte oder Systemdienste starten Prozesse und Dienste des Benutzerraums.

Diese können nach Bedarf Anwendungen, Netzwerkdienste und weitere Komponenten starten.

Details und Konfigurationen finden Sie im Abschnitt Storage von "Rockchip_Developer_Guide_UBoot_Nextdev_CN.pdf".

### 5.5 Schnellstartanleitung

#### 5.5.1 Booten von SD-Karte

RK-Werkzeuge ermöglichen den direkten Start von SD-Karte. Dadurch lässt sich die Boot-Firmware aktualisieren, ohne den internen Gerätespeicher erneut zu flashen. Schreiben Sie dazu die Firmware auf die SD-Karte und verwenden Sie diese als primären Speicher. Beim Start von SD-Karte liegen sowohl Firmware als auch temporäre Dateien darauf. Der Betrieb ist somit unabhängig davon möglich, ob lokaler primärer Speicher vorhanden ist.

Den genauen Startablauf und weitere Einzelheiten beschreiben die Abschnitte zum SD-Karten-Boot in "Rockchip_Developer_Guide_UBoot_Nextdev_CN.pdf" und "Rockchip_Developer_Guide_SD_Boot_CN.pdf".

### 5.6 Schnellstartkonzept

Das SDK unterstützt einen schnellen Systemstart. Eine leistungsfähige integrierte MCU übernimmt während der Bootphase einfache Thread-Aufgaben für den AP, damit Betriebsaufgaben frühzeitig ausgeführt werden können.

#### 5.6.1 Boot-Konzept mit SPL

Bei der SPL-Lösung wird die MCU-Firmware bereits in der SPL-Phase geladen und zur Ausführung freigegeben. Dadurch verkürzt sich die Zeit zwischen Einschalten und Laden der MCU-Firmware.

Am Beispiel RK3562 nennt die Quelle bis zu 200mS vom Einschalten bis zum Abschluss der ersten MCU-Steuerungsaufgabe.

Die SPL-Boot-Konfiguration lautet im Einzelnen:

Für den Start in der SPL-Phase muss die MCU in RKTRUST/RK3562TRUST.ini des rkbin-Repositorys aktiviert werden. Die Standardfirmware läuft an Adresse 0x08200000.

```text
MCU=bin/rk35/rk3562_mcu_v1.00.bin,0x08200000,okay
```

Übersetzen Sie im uboot-Repository mit folgendem Befehl:

```text
./make.sh rk3562 --spl-new
```

Die MCU-Firmware wird in uboot.img verpackt; SPL lädt sie und gibt sie zur Ausführung frei.

#### 5.6.2 Boot-Konzept mit zwei Speichermedien

Die Dual-Storage-Lösung kombiniert NOR mit eMMC. Die MCU-Firmware liegt in einem kleinen Flash-Speicher, die AP-Firmware in eMMC. Da Flash nach dem Einschalten wesentlich schneller initialisiert ist als eMMC, kann die MCU-Firmware früher geladen werden.

Die genaue Konfiguration beschreibt Rockchip Developer Guide Dual Storage CN.pdf.

## 6. Kapitel 6: Kommunikationskonzept

### 6.1 Auslösen von Interprozessor-Interrupts

Das AMP-Kommunikationskonzept von Rockchip kombiniert Interrupts mit gemeinsam genutztem Speicher. Nachdem der Sender Daten im gemeinsamen Speicher aktualisiert hat, löst er einen Interrupt aus, damit der Empfänger sie verarbeitet. Derzeit gibt es drei Verfahren: Mailbox-Interrupts, Software-Interrupts und SGI. Zusätzlich bietet das heterogene Mehrkernsystem Hardware-Spinlocks für zuverlässige atomare Operationen.

#### 6.1.1 Auslösen von Mailbox-Interrupts

Das RK-Mailbox-Modul ermöglicht die Kommunikation zwischen Kernen. Beim Auslösen eines Mailbox-Interrupts können gleichzeitig ein 32-Bit-Command-Registerwert und ein 32-Bit-Data-Registerwert übertragen werden.

```text
#ifdef PRIMARY_CPU
// Master interrupt handling, the function will be callback here
static void mbox_master_isr(int vector, void *param)
{
    HAL_MBOX_IrqHandler(vector, pMBox);
    HAL_GIC_EndOfInterrupt(vector);
}
//  Interrupt Callback in the Mailbox
static void mbox_master_cb(struct MBOX_CMD_DAT *msg, void *args)
{
    uint32_t cpu_id;
    struct MBOX_CMD_DAT rx_msg = *msg;
    cpu_id = HAL_CPU_TOPOLOGY_GetCurrentCpuId();
    // Process the received 32-bit Command data and a 32-bit Data
    printf("mbox master: receive cpu-%ld cmd=0x%lx data=0x%lx\n", cpu_id, rx_msg.CMD, rx_msg.DATA);
}
#else
// Remote interrupt handling, the function will be callback here
static void mbox_remote_isr(int vector, void *param)
{
    HAL_MBOX_IrqHandler(vector, pMBox);
    HAL_GIC_EndOfInterrupt(vector);
}
static void mbox_remote_cb(struct MBOX_CMD_DAT *msg, void *args)
{
    uint32_t cpu_id;
    struct MBOX_CMD_DAT rx_msg = *msg;
    cpu_id = HAL_CPU_TOPOLOGY_GetCurrentCpuId();
    // Process the received 32-bit Command data and a 32-bit Data
    printf("mbox remote: receive cpu-%ld cmd=0x%lx data=0x%lx\n", cpu_id, rx_msg.CMD, rx_msg.DATA);
}
#endif
#ifdef PRIMARY_CPU
// Master side channel registration
static struct MBOX_CLIENT mbox_client2_m = { "mbox-cl2m", MBOX0_CH2_B2A_IRQn,
mbox_master_cb, (void *)MBOX_CH_2 };
static void mbox_master_test(void)
{
    struct MBOX_CLIENT *mbox_cl2m;
    struct MBOX_CMD_DAT tx_msg;
    uint32_t cpu_id;
    int ret = 0;
    cpu_id = HAL_CPU_TOPOLOGY_GetCurrentCpuId();
    mbox_cl2m = &mbox_client2_m;
    tx_msg.CMD = cpu_id & 0xFU;
    tx_msg.DATA = 0x12345678;
    /* Master core uses MBOX_A2B and remote core uses MBOX_B2A */
    HAL_MBOX_Init(pMBox, MBOX_A2B);
    ret = HAL_MBOX_RegisterClient(pMBox, MBOX_CH_2, mbox_cl2m);
    if (ret) {
        printf("mbox_cl2m register failed, ret=%d\n", ret);
    }
    HAL_IRQ_HANDLER_SetIRQHandler(MBOX0_CH2_B2A_IRQn, mbox_master_isr, NULL);
    HAL_GIC_Enable(MBOX0_CH2_B2A_IRQn);
    HAL_DelayMs(4000);
    printf("mbox master: send cmd=0x%lx data=0x%lx\n", tx_msg.CMD, tx_msg.DATA);
    // Send data, 32-bit Command data and a 32-bit Data
    HAL_MBOX_SendMsg(pMBox, MBOX_CH_2, &tx_msg);
}
#endif
#ifdef CPU2
// Remote side channel registration
static struct MBOX_CLIENT mbox_client2_r = { "mbox-cl2r", MBOX0_CH2_A2B_IRQn,
mbox_remote_cb, (void *)MBOX_CH_2 };
static void mbox_remote_test(void)
{
    struct MBOX_CLIENT *mbox_cl2r;
    struct MBOX_CMD_DAT tx_msg;
    uint32_t cpu_id;
    int ret = 0;
    cpu_id = HAL_CPU_TOPOLOGY_GetCurrentCpuId();
    mbox_cl2r = &mbox_client2_r;
    tx_msg.CMD = cpu_id & 0xFU;
    tx_msg.DATA = 0x98765432;
    /* Master core uses MBOX_A2B and remote core uses MBOX_B2A */
    HAL_MBOX_Init(pMBox, MBOX_B2A);
    ret = HAL_MBOX_RegisterClient(pMBox, MBOX_CH_2, mbox_cl2r);
    if (ret) {
        printf("mbox_cl2r register failed, ret=%d\n", ret);
    }
    HAL_IRQ_HANDLER_SetIRQHandler(MBOX0_CH2_A2B_IRQn, mbox_remote_isr, NULL);
    HAL_GIC_Enable(MBOX0_CH2_A2B_IRQn);
    HAL_DelayMs(2000);
    printf("mbox remote: send cmd=0x%lx data=0x%lx\n", tx_msg.CMD, tx_msg.DATA);
    // Send data, 32-bit Command data and a 32-bit Data
    HAL_MBOX_SendMsg(pMBox, MBOX_CH_2, &tx_msg);
}
#endif
```

#### 6.1.2 Auslösen von Software-Interrupts

Hierzu wird ein reservierter IRQ der GIC-SPI-Interrupts (Shared Peripheral Interrupts) verwendet und aktiv auf Pending gesetzt.

```text
static void soft_isr(int vector, void *param)
{
    printf("soft_isr, vector = %d\n", vector);
    HAL_GIC_EndOfInterrupt(vector);
}
static void softirq_test(void)
{
    HAL_IRQ_HANDLER_SetIRQHandler(RSVD0_IRQn, soft_isr, NULL);
    HAL_GIC_Enable(RSVD0_IRQn);
    // Trigger the software interrupt
    HAL_GIC_SetPending(RSVD0_IRQn);
}
```

#### 6.1.3 Auslösen von SGI

Dieses Verfahren verwendet GIC SGI, also softwaregenerierte Interrupts. Linux SMP belegt 8 nicht sichere SGI-Interruptnummern; die anderen 8 sicheren SGI-Nummern erfordern eine besondere Beantragung. SGI wird daher meist zur Synchronisierung mehrerer untergeordneter Kerne eingesetzt.

```text
#define IPI_CPU0               0x01
#define IPI_CPU1               0x02
#define IPI_CPU2               0x04
#define IPI_CPU3               0x08
#define IPI_TO_TARGETLIST      0
#define IPI_TO_ALL_EXCEPT_SELF 1
static void ipi_sgi_isr(int vector, void *param)
{
    uint32_t cpu_id;
    cpu_id = HAL_CPU_TOPOLOGY_GetCurrentCpuId();
    if (cpu_id == 2) {
        HAL_DelayMs(1000);
    } else if (cpu_id == 3) {
        HAL_DelayMs(2000);
    }
    printf("ipi sgi: cpu_id=%ld vector = %d\n", cpu_id, vector);
    HAL_GIC_EndOfInterrupt(vector);
}
static void ipi_sgi_test(void)
{
    uint32_t cpu_id;
    cpu_id = HAL_CPU_TOPOLOGY_GetCurrentCpuId();
    HAL_IRQ_HANDLER_SetIRQHandler(IPI_SGI7, ipi_sgi_isr, NULL);
    HAL_GIC_Enable(IPI_SGI7);
    if (cpu_id == 1) {
        printf("ipi sgi: cpu_id=%ld test start\n", cpu_id);
        HAL_DelayMs(2000);
        // Trigger CPU0 SGI7 interrupt
        HAL_GIC_SendSGI(IPI_SGI7, 0, IPI_TO_ALL_EXCEPT_SELF);
        HAL_DelayMs(4000);
        HAL_GIC_SendSGI(IPI_SGI7, IPI_CPU3, IPI_TO_TARGETLIST);
        HAL_DelayMs(4000);
        HAL_GIC_SendSGI(IPI_SGI7, IPI_CPU3 | IPI_CPU2, IPI_TO_TARGETLIST);
        HAL_DelayMs(4000);
        HAL_GIC_SendSGI(IPI_SGI7, IPI_CPU3 | IPI_CPU2 | IPI_CPU0, IPI_TO_TARGETLIST);
    }
}
```

### 6.2 Lösung mit Low-Level-Schnittstellen

Rockchip stellt die Treiberschnittstellen für Inter-Core-Interrupts und gemeinsamen Speicher offen bereit. Anwender bestehender heterogener Mehrkernsysteme können die passenden Low-Level-Treiberschnittstellen ersetzen, um ihre Plattform zu portieren.

RK AMP unterstützt derzeit Inter-Core-Interrupts unter anderem über Mailbox und Software-Interrupts. Unter Linux wird gemeinsamer Speicher nur ohne Cache unterstützt; die übrigen Systeme unterstützen standardmäßig cachefähigen Speicher.

Mailbox-Interrupts unter Linux: siehe drivers/rpmsg/rockchip_rpmsg_mbox.c

Software-Interrupts unter Linux: siehe drivers/rpmsg/rockchip_rpmsg_softirq.c

RPMsg-Lite unter Bare-metal: siehe hal/middleware/rpmsg-lite/lib/rpmsg_lite/porting/platform/RKXX/rpmsg_platform.c

RPMsg-Lite unter RTOS: siehe rtos/rockchip/common/drivers/rpmsg-lite/lib/rpmsg_lite/porting/platform/RKXX/rpmsg_platform.c

### 6.3 Lösung mit dem RPMsg-Protokoll

#### 6.3.1 Standard-Framework

Rockchip stellt ein Standard-Framework für das RPMsg-Protokoll in heterogenen Mehrkernsystemen bereit. Der Linux-Kernel verwendet RPMsg, RTOS und Bare-metal verwenden RPMsg-Lite. Es definiert die binäre Standardschnittstelle für die Kommunikation zwischen den Kernen eines AMP-Systems.

RPMsg ist ein Nachrichtenmechanismus auf Grundlage von VirtIO, einer allgemeinen Architektur für virtualisierte E/A, wie sie auch virtuelle Netzwerkkarten und Festplatten verwenden. VirtIO-Ring überträgt und empfängt Daten über gemeinsamen Speicher. Ein vring ist unidirektional: Einer sendet Daten an den Remote Core, der andere empfängt Daten von ihm.

Das RPMsg-Framework besteht somit aus Inter-Core-Interrupts zwischen Hauptkern und Remote Core sowie drei gemeinsamen Speicherbereichen: vring0, vring1 und vdev buffer.

![Rockchip-AMP-Originalabbildung: 6.3.1 Standard-Framework — Seite 76](/docs/rockchip-amp/assets/en-p076-fig01.png)

#### 6.3.2 Kommunikationsablauf

Hauptkern und Remote Core kommunizieren bei RPMsg über Interrupts und gemeinsamen Speicher. Der Hauptkern verwaltet den Speicher. Pro Übertragungsrichtung gibt es zwei Puffer, USED und AVAIL. Sie lassen sich entsprechend dem RPMsg-Nachrichtenformat in Blöcke unterteilen und zu einem Ring verknüpfen.

![Rockchip-AMP-Originalabbildung: 6.3.2 Kommunikationsablauf — Seite 77](/docs/rockchip-amp/assets/en-p077-fig01.png)

Bei der Kommunikation zwischen Hauptkern und Remote Core gilt:

1. Zum Senden holt sich der Hauptkern einen Puffer aus vring0(USED) und füllt ihn gemäß dem RPMsg-Protokoll.

2. Der bearbeitete Speicherpuffer wird in vring1(AVAIL) eingehängt.

3. Ein Interrupt informiert den Remote Core über die zu verarbeitenden Daten.

![Rockchip-AMP-Originalabbildung: 6.3.2 Kommunikationsablauf — Seite 77](/docs/rockchip-amp/assets/en-p077-fig02.png)

Wenn der Remote Core mit dem Hauptkern kommunizieren möchte, gilt entsprechend:

1. Der Remote Core entnimmt gemäß der Warteschlange einen Puffer aus vring1(AVAIL) und füllt die Nachricht nach dem RPMsg-Protokoll.

2. Der bearbeitete Speicherpuffer wird in vring0(USED) eingehängt.

3. Ein Interrupt informiert den Hauptkern über die zu verarbeitenden Daten.

![Rockchip-AMP-Originalabbildung: 6.3.2 Kommunikationsablauf — Seite 78](/docs/rockchip-amp/assets/en-p078-fig01.png)

Nach der Nachrichtenübertragung wird der verwendete Puffer freigegeben und steht für die nächsten Daten bereit. Der Sendeablauf des Remote Core ist die Umkehrung des Sendeablaufs des Hauptkerns. Die gemeinsam genutzten Nutzdaten liegen im vdev buffer.

Die maximal pro RPMsg-Übertragung mögliche Datenlänge hängt von der Payload-Länge ab, die im SDK standardmäßig 512 Bytes beträgt. Da RPMsg einen 16-Byte-Header benötigt, können maximal 496 Bytes Nutzdaten auf einmal übertragen werden. Einzelheiten stehen in drivers/rpmsg/virtio_rpmsg_bus.c.

![Rockchip-AMP-Originalabbildung: 6.3.2 Kommunikationsablauf — Seite 78](/docs/rockchip-amp/assets/en-p078-fig02.png)

#### 6.3.3 RPMsg-Anpassung

##### 6.3.3.1 RPMsg-Anpassung im Linux-Kernel

Der Linux-Kernel-RPMsg-Code ist im Wesentlichen wie folgt aufgebaut:

![Rockchip-AMP-Originalabbildung: 6.3.3.1 RPMsg-Anpassung im Linux-Kernel — Seite 79](/docs/rockchip-amp/assets/en-p079-fig01.png)

kernel/drivers/rpmsg/rockchip_rpmsg_mbox.c ist ein am Platform Bus registrierter Treiber, der zugleich ein Gerät am VirtIO Bus registriert. Er implementiert die physische Schicht auf Grundlage von Mailbox-Inter-Core-Interrupts und den Treiberschnittstellen für gemeinsamen Speicher.

kernel/drivers/rpmsg/rockchip_rpmsg_softirq.c ist ebenfalls am Platform Bus registriert und registriert ein Gerät am VirtIO Bus. Er implementiert die physische Schicht über softirq-Inter-Core-Interrupts und die Treiberschnittstellen für gemeinsamen Speicher.

kernel/drivers/rpmsg/virtio_rpmsg_bus.c ist ein am VirtIO Bus registrierter Treiber, der ein Gerät am RPMsg Bus registriert. VirtIO und Virtqueue bilden die gewählte MAC-Schicht des allgemeinen RPMsg-Protokolls.

kernel/drivers/rpmsg/rpmsg_core.c erstellt den RPMsg Bus und stellt die Schnittstelle der Transportschicht bereit.

kernel/drivers/rpmsg/rockchip_rpmsg_test.c zeigt ein einfaches Beispiel für das Erstellen eines Inter-Core-Kommunikationskanals sowie das Senden und Empfangen von Daten.

RPMsg-TTY-Unterstützung

Der Linux-Kernel kann RPMsg auch als TTY-Gerät einbinden. Prinzip und Softwarestruktur entsprechen der zuvor beschriebenen Linux-Implementierung. Die Linux-Seite übernimmt normalerweise die Master-Rolle. Zur Verbindung mit Remote wird ein Endpoint erstellt. Ein Kanal kann mehrere Endpoints enthalten, die anhand der übertragenen Dienstnamen unterschieden werden. Stimmt der lokale Dienstname auf Linux (Master) mit dem vom Remote gesendeten Namen überein, entstehen an beiden Kanalenden miteinander kommunizierende Endpoints.

Beispiel aus kernel/drivers/rpmsg/rockchip_rpmsg_test.c:

```text
static struct rpmsg_device_id rockchip_rpmsg_test_id_table[] = {
    { .name = "rpmsg-ap3-ch0" },
    { .name = "rpmsg-mcu0-test" },
    { .name = "rpmsg-perf-bw-test" },
    { .name = "rpmsg-perf-pingpong-bw-test" },
    { .name = "rpmsg-latency-test" },
    { /* sentinel */ },
};
```

In kernel/drivers/rpmsg/rockchip_rpmsg_test.c sind die obigen Dienstnamen deklariert. Nach dem Verbinden der Remote-Seite lässt sich durch Senden des passenden Namens eine Verbindung erstellen. Bei Namensübereinstimmung wird probe aufgerufen.

RPMsg TTY funktioniert nach demselben Prinzip. Nach Aktivierung der Konfiguration sendet Remote den passenden Dienstnamen. Linux RPMsg ruft bei dessen Empfang probe auf und registriert RPMsg zugleich als TTY-Gerät. Nach erfolgreicher Registrierung ist der Knoten /dev/ttyRPMSG vorhanden.

Beispiel zum Erstellen eines TTY:

Nach dem Erstellen des Endpoints sendet Remote den Dienstnamen "rpmsg-tty" mit rpmsg_ns_announce:

```text
ept = rpmsg_lite_create_ept(instance, RPMSG_HAL_REMOTE_TEST3_EPT, remote_ept_cb, info);
rpmsg_ns_announce(instance, ept, "rpmsg-tty", RL_NS_CREATE);
```

kernel/drivers/tty/rpmsg_tty.c

```text
static struct rpmsg_device_id rpmsg_driver_tty_id_table[] = {
    { .name = "rpmsg-tty" },
    { },
};
```

##### 6.3.3.2 RPMsg-Lite-Anpassung

RPMsg-Lite ist eine quelloffene Drittanbieterlösung mit einer ähnlichen Struktur wie Linux RPMsg.

Der RPMsg-Lite-Code ist im Wesentlichen wie folgt aufgebaut:

![Rockchip-AMP-Originalabbildung: 6.3.3.2 RPMsg-Lite-Anpassung — Seite 81](/docs/rockchip-amp/assets/en-p081-fig01.png)

RPMsg-Lite besteht aus drei Komponenten, von denen zwei optional sind. Die Kernkomponente liegt in rpmsg_lite.c. Die optionalen Komponenten implementieren die blockierende Empfangs-API in rpmsg_queue.c und den Name-Service-Endpoint zum Erstellen und Bekanntgeben von Endpoints in rpmsg_ns.c.

Der eigentliche Speicherzugriff erfolgt in virtqueue.c. Dort werden hauptsächlich die Verwaltungsstrukturen für gemeinsamen Speicher wie vring und virtqueue definiert.

Die Portierung umfasst zwei Schichten: environment und platform. Für jede Umgebung gibt es eine eigene environment-Implementierung, beispielsweise rpmsg_env_bm.c für Bare-metal und rpmsg_env_rt_thread.c für RT-Thread. Auf dieser Grundlage können Entwickler weitere RTOS unterstützen. Die platform-Schicht liegt in rpmsg_platform.c und übernimmt hauptsächlich Interruptkonfiguration und -auslösung. Dabei sind wie zuvor beschrieben unterschiedliche Interrupts wie MailBox oder Software-Interrupts möglich. Falls Caches oder Adressoffsets des gemeinsamen Speichers zu berücksichtigen sind, erfolgt dies ebenfalls in platform. Siehe die folgende RPMsg-Lite-Darstellung:

![Rockchip-AMP-Originalabbildung: 6.3.3.2 RPMsg-Lite-Anpassung — Seite 82](/docs/rockchip-amp/assets/en-p082-fig01.png)

##### 6.3.3.3 RPMsg-Lite-Anpassung für die MCU

Auch MCUs verwenden RPMsg-Lite. Wegen ihrer Speicherabbildung müssen uboot und rpmsg_platform.c neu konfiguriert werden, wenn die Adresse des gemeinsamen Speichers geändert wird. Der RPMsg-Speicher wird derzeit vollständig ohne Cache verwendet; Cache-Aktualisierungen zur Datenkonsistenz sind daher nicht erforderlich. Bei MCU-Plattformen ist die Abbildung der gemeinsamen Speicheradresse zu beachten, die normalerweise in Uboot initialisiert wird.

Die Startadresse des MCU-RAM wird über ITS übergeben und ist gegenüber der tatsächlichen physischen Adresse versetzt. Entsprechend besteht auch beim gemeinsamen Speicher ein Offset zwischen MCU-Sicht und physischer Adresse. Zur Vereinfachung späterer Operationen empfiehlt die Quelle, den gemeinsamen Speicher hinter dem MCU-Speicherbereich anzuordnen.

Die Registerbeschreibung für RK3562 finden Sie im TRM. Im aktuellen SDK liegt der gemeinsame Speicher bei 0x07C00000 mit der Größe 0x500000. Die MCU-RAM-Startadresse wird über ITS an Uboot übergeben und auf 0x7b00000 gesetzt. In u-boot/arch/arm/mach- rockchip/rk3562/rk3562.c gilt daher:

```text
int fit_standalone_release(char *id, uintptr_t entry_point)
{
    /* bus m0 configuration: */
    /* open hclk_dcache / hclk_icache / clk_bus m0 rtc / fclk_bus_m0_core */
    writel(0x03180000, TOP_CRU_BASE + TOP_CRU_GATE_CON23);
    /* open bus m0 sclk / bus m0 hclk / bus m0 dclk */
    writel(0x00070000, TOP_CRU_BASE + TOP_CRU_CM0_GATEMASK);
    /* * mcu_cache_peripheral_addr * The uncache area ranges from 0x7c00000 to 0xffb400000 * and contains rpmsg shared memory */
    /* Here, 0x07c00000 to 0xffb40000 are all set to uncache to ensure shared memory is in uncache */
    writel(0x07c00000, SYS_GRF_BASE + SYS_GRF_SOC_CON5);
    writel(0xffb40000, SYS_GRF_BASE + SYS_GRF_SOC_CON6);
    /* Configure the starting address of MCU RAM */
    sip_smc_mcu_config(ROCKCHIP_SIP_CONFIG_BUSMCU_0_ID,
               ROCKCHIP_SIP_CONFIG_MCU_CODE_START_ADDR,
               0xffff0000 | (entry_point >> 16));
    /* release dcache / icache / bus m0 jtag / bus m0 */
    writel(0x03280000, TOP_CRU_BASE + TOP_CRU_SOFTRST_CON23);
    /* release pmu m0 jtag / pmu m0 */
    /* writel(0x00050000, PMU1_CRU_BASE + PMU1_CRU_SOFTRST_CON02); */
    return 0;
}
```

In amp.its der MCU:

```text
/* * Copyright (C) 2023 Rockchip Electronics Co., Ltd * * SPDX-License-Identifier: GPL-2.0 */
/dts-v1/;
/ {
    description = "Rockchip AMP FIT Image";
    #address-cells = <1>;
    images {
        mcu {
            description  = "mcu";
            data         = /incbin/("./mcu.bin");
            type         = "standalone";    // must be "standalone"
            compression  = "none";
            arch         = "arm";        // "arm64" or "arm", the same as U-Boot state
            load         = <0x07b00000>; //MCU RAM starting address
            udelay       = <1000000>;
            hash {
                algo = "sha256";
            };
        };
    };
    configurations {
        default = "conf";
        conf {
            description = "Rockchip AMP images";
            rollback-index = <0x0>;
            loadables = "mcu";
            signature {
                algo = "sha256,rsa2048";
                padding = "pss";
                key-name-hint = "dev";
                sign-images = "loadables";
            };
        };
    };
};
```

In gcc_bus_m0.ld ist zu erkennen, dass die gemeinsame Speicheradresse als Offset angegeben wird:

```text
/* SPDX-License-Identifier: BSD-3-Clause */
/* * Copyright (c) 2023 Rockchip Electronics Co., Ltd. */
MEMORY
{
    # RAM starting address, actual physical address 0x07b00000
    RAM(rxw) : ORIGIN = 0x00000000, LENGTH = 0x100000
    # RPMsg shared memory address, actual physical address 0x07c00000
    LINUX_RPMSG (rxw) : ORIGIN = 0x00100000, LENGTH = 0x00500000
}
```

Der Master verwaltet den Speicher, die MCU ist Remote. Die aus dem vring gelesene Pufferadresse ist eine tatsächliche physische Adresse; beim Senden und Empfangen muss deshalb der Offset berücksichtigt werden. Siehe rpmsg_platform.c.

```text
#ifdef HAL_MCU_CORE
/* MCU offset address */
#ifdef HAL_CACHE_DECODED_ADDR_BASE
#define RL_PHY_MCU_OFFSET HAL_CACHE_DECODED_ADDR_BASE
#else
#define RL_PHY_MCU_OFFSET (0U)
#endif
#endif
/** * platform_patova * * Dummy implementation * */
void *platform_patova(uint32_t addr)
{
#ifdef HAL_MCU_CORE
    addr -= RL_PHY_MCU_OFFSET;
#endif
    return ((void *)(char *)addr);
}
```

### 6.4 RPMsg-Build-Konfiguration

#### 6.4.1 Kernel + RT-Thread

Kernelkonfiguration:

```text
## Chapter-6 Enable MailBox support
CONFIG_MAILBOX=y
CONFIG_ROCKCHIP_MBOX=y
## Chapter-6 MailBox interrupt triggering
CONFIG_RPMSG_ROCKCHIP_MBOX=y
CONFIG_RPMSG_VIRTIO=y
```

TTY-Unterstützung aktivieren:

```text
CONFIG_RPMSG_TTY=y
```

RT-Thread-Konfiguration: scons --menuconfig ausführen

```text
## Chapter-6 Enable RPMsg-Lite support
CONFIG_RT_USING_RPMSG_LITE=y
## Chapter-6 Enable Linux+RTT RPMsg
CONFIG_RT_USING_LINUX_RPMSG=y
```

#### 6.4.2 Kernel + HAL

Kernelkonfiguration:

```text
## Chapter-6 Enable MailBox support
CONFIG_MAILBOX=y
CONFIG_ROCKCHIP_MBOX=y
## Chapter-6 MailBox interrupt trigger
CONFIG_RPMSG_ROCKCHIP_MBOX=y
CONFIG_RPMSG_VIRTIO=y
```

HAL-Konfiguration: RPMSG ist in HAL standardmäßig aktiviert. Wie das Testdemo aktiviert wird, beschreibt der Abschnitt mit den RPMsg-Testbeispielen.

```text
// Enable in test_demo.c
#define RPMSG_LINUX_TEST
```

#### 6.4.3 RT-Thread + HAL

RT-Thread-Konfiguration: scons --menuconfig ausführen

```text
## Chapter-6 Enable RPMsg-Lite support
CONFIG_RT_USING_RPMSG_LITE=y
```

### 6.5 RPMsg-Testbeispiele

#### 6.5.1 Kernel + RT-Thread

Das Interprozessor-Kommunikationsframework RPMSG des Kernels verwendet auf der unteren Ebene VirtIO. Die wichtigsten Codepfade sind:

```text
kernel/drivers/rpmsg/rpmsg_core.c
kernel/drivers/rpmsg/virtio_rpmsg_bus.c
kernel/drivers/rpmsg/rockchip_rpmsg_softirq.c
kernel/include/linux/rpmsg/rockchip_rpmsg.h
```

##### 6.5.1.1 Gemeinsam genutzter Speicher

Im SDK-Demo werden beispielsweise 5M gemeinsamer Speicher für RPMSG reserviert: 4M für VRING BUFFER und 1M für VDEV BUFFER.

Da der aktuelle Kernel-rpmsg-Code gemeinsamen Speicher standardmäßig als nicht cachefähig konfiguriert, wird er an beiden Enden standardmäßig ohne Cache verwendet.

Kernelpfad: SDK/kernel/arch/arm64/boot/dts/rockchip/rkxxxx-amp.dtsi

```text
reserved-memory {
    #address-cells = <2>;
    #size-cells = <2>;
    ranges;
    /* remote amp core address */
    amp_reserved: amp@2e00000 {
        reg = <0x0 0x2e00000 0x0 0x1200000>;
        no-map;
    };
    rpmsg_reserved: rpmsg@7c00000 {
        reg = <0x0 0x07c00000 0x0 0x400000>;
        no-map;
    };
    rpmsg_dma_reserved: rpmsg-dma@8000000 {
        compatible = "shared-dma-pool";
        reg = <0x0 0x08000000 0x0 0x100000>;
        no-map;
    };
};
```

RTT-Pfad: SDK/rtos/bsp/rockchip/rk3308-32/board/common/board_base.c

```text
1.MMU is mapped as unCache
    {LINUX_SHMEM_BASE, LINUX_SHMEM_BASE + LINUX_SHMEM_SIZE - 1, LINUX_SHMEM_BASE,
UNCACHED_MEM},
```

Bei höheren Anforderungen an die rpmsg-Datenrate kann gemeinsamer Speicher cachefähig konfiguriert werden. Die Quelle nennt für rk3576 mit allen CPUs bei 1416 MHz und DDR bei 2112 MHz eine gemessene Bandbreite vom sendenden Kernel zum empfangenden RTT von 77 MB/s ohne Cache und 1880 MB/s mit Cache.

Verwenden Sie vorzugsweise gleiche Cache-Attribute an beiden Enden. Nutzt Linux Cache, RTT dagegen nicht, muss Linux seine geschriebenen Daten bereinigen, bevor RTT sie liest. Vor dem Lesen von RTT-Daten muss Linux veraltete Cache-Zeilen invalidieren. Stimmen Sie diese Operationen mit dem Pufferbesitz und der tatsächlichen SDK-Implementierung ab.

Für cachefähigen gemeinsamen Speicher muss der Framework-Code des rpmsg-Treibers geändert werden.

Kernelpfad: SDK/kernel/drivers/rpmsg/virtio_rpmsg_bus.c

Ersetzen Sie dma_alloc_coherent durch ioremap_cache. Dabei ist addr die Adresse von rpmsg_dma_reserved.

```text
--- a/drivers/rpmsg/virtio_rpmsg_bus.c
+++ b/drivers/rpmsg/virtio_rpmsg_bus.c
@@ -913,9 +913,7 @@ static int rpmsg_probe(struct virtio_device *vdev)
        total_buf_space = vrp->num_bufs * vrp->buf_size;
        /* allocate coherent memory for the buffers */
-       bufs_va = dma_alloc_coherent(vdev->dev.parent,
-                                    total_buf_space, &vrp->bufs_dma,
-                                    GFP_KERNEL);
+       bufs_va = ioremap_cache(addr, total_buf_space);
```

RTT-Pfad: SDK/rtos/bsp/rockchip/rkxxxx/board/common/board_base.c

```text
struct mem_desc platform_mem_desc[] =
{
#if (defined(LINUX_RPMSG_VRING_BASE) && defined(LINUX_RPMSG_BUFF_BASE))
    {LINUX_RPMSG_VRING_BASE, LINUX_RPMSG_VRING_BASE + LINUX_RPMSG_VRING_SIZE,
LINUX_RPMSG_VRING_BASE, NORMAL_NOCACHE_MEM},
    {LINUX_RPMSG_BUFF_BASE, LINUX_RPMSG_BUFF_BASE + LINUX_RPMSG_BUFF_SIZE,
LINUX_RPMSG_BUFF_BASE, NORMAL_MEM},
#endif
}
```

Der gemeinsame rpmsg-Speicher besteht aus vring und buff_pool. buff_pool enthält die eigentlichen Datenpakete; vring enthält deren Adressen zur Verwaltung. Datenzugriffe erfolgen hauptsächlich in buff_pool, daher wird hier nur dieser Bereich cachefähig konfiguriert. Im Code entspricht LINUX_RPMSG_VRING_BASE der Adresse rpmsg_reserved des Device-Tree-Knotens, also vring. LINUX_RPMSG_BUFF_BASE entspricht rpmsg_dma_reserved, also buff_pool.

##### 6.5.1.2 Testdemo

###### 6.5.1.2.1 Kernel-Demo

Bearbeiten Sie im Kernelprojekt die Konfiguration kernel/arch/arm64/configs/xxxx_defconfig .

```text
CONFIG_RPMSG_ROCKCHIP_TEST
```

Alternativ konfigurieren Sie über menuconfig:

```text
## Chapter-6 Open the configuration interface
make ARCH=arm64 rkxxxx_linux_defconfig
make ARCH=arm64 menuconfig
    # Enable the following macro switch
    CONFIG_RPMSG_ROCKCHIP_TEST
## Chapter-6 Save the configuration
make ARCH=arm64 savedefconfig
cp defconfig arch/arm64/configs/rkxxxx_linux_defconfig
```

Pfad des Kernel-Demos: kernel/drivers/rpmsg/rockchip_rpmsg_test.c

```text
1. Main process of the demo
static struct rpmsg_driver rockchip_rpmsg_test = {
    .drv.name   = KBUILD_MODNAME,
    .drv.owner  = THIS_MODULE,
    .id_table   = rockchip_rpmsg_test_id_table,
    .probe      = rockchip_rpmsg_test_probe,
    .callback   = rockchip_rpmsg_test_cb,
    .remove     = rockchip_rpmsg_test_remove,
};
2. rockchip_rpmsg_test_id_table
/* Wait for remote core announce a new ept name from the master core, and if it matches the name in the following list, enter the probe function */
static struct rpmsg_device_id rockchip_rpmsg_test_id_table[] = {
    { .name = "rpmsg-ap3-ch0" },
    { .name = "rpmsg-mcu0-test" },
    { /* sentinel */ },
};
3. rockchip_rpmsg_test_probe
static int rockchip_rpmsg_test_probe(struct rpmsg_device *rp)
{
    int ret, size;
    uint32_t master_ept_id, remote_ept_id;
    struct instance_data *idata;
    master_ept_id = rp->src;
    remote_ept_id = rp->dst;
    dev_info(&rp->dev, "new channel: 0x%x -> 0x%x!\n", master_ept_id,
             remote_ept_id);
    /* probe send a message to the remote to let it know the master ept id */
    ret = rpmsg_send(rp->ept, LINUX_TEST_MSG_1, strlen(LINUX_TEST_MSG_1));
    if (ret) {
        dev_err(&rp->dev, "rpmsg_send failed: %d\n", ret);
        return ret;
    }
    /* Run the test */
    ret = rpmsg_sendto(rp->ept, LINUX_TEST_MSG_2, strlen(LINUX_TEST_MSG_2),
                       remote_ept_id);
    if (ret) {
        dev_err(&rp->dev, "rpmsg_send failed: %d\n", ret);
        return ret;
    }
    return 0;
}
4. rockchip_rpmsg_test_cb
static int rockchip_rpmsg_test_cb(struct rpmsg_device *rp, void *payload,
                                  int payload_len, void *priv, u32 src)
{
    int ret, size;
    uint32_t remote_ept_id;
    struct instance_data *idata = dev_get_drvdata(&rp->dev);
    /* After the master sends a message to the remote, the remote will also send a message back */
    remote_ept_id = src;
    dev_info(&rp->dev, "rx msg %s rx_count %d(remote_ept_id: 0x%x)\n",
            (char *)payload, ++idata->rx_count, remote_ept_id);
    /* Test to stop after receiving and sending 10000 messages */
    if (idata->rx_count >= MSG_LIMIT) {
        dev_info(&rp->dev, "Rockchip rpmsg test exit!\n");
        return 0;
    }
    /* After receiving data, send another message to the remote */
    ret = rpmsg_sendto(rp->ept, LINUX_TEST_MSG_2, strlen(LINUX_TEST_MSG_2),
                       remote_ept_id);
    if (ret)
        dev_err(&rp->dev, "rpmsg_send failed: %d\n", ret);
        return ret;
    }
```

Ausführliche Beschreibung der Schnittstellenfunktionen:

| Funktion | Beschreibung |
| --- | --- |
| rpmsg_send() | Nachricht an den entfernten Prozessor senden |
| rpmsg_sendto() | Nachricht an den entfernten Prozessor mit der angegebenen Remote-ept-ID senden |

src bezeichnet den lokalen Endpoint, dst den entfernten. Beim Master ist src der Master-Endpoint und dst der Remote-Endpoint; bei Remote sind die Rollen umgekehrt.

###### 6.5.1.2.2 RTT-Demo

Menükonfiguration: scons --menuconfig

```text
CONFIG_RT_USING_RPMSG_LITE=y
CONFIG_RT_USING_LINUX_RPMSG=y
CONFIG_RT_USING_COMMON_TEST_LINUX_RPMSG_LITE=y
```

Pfad des RTT-Demos: rtos/bsp/rockchip/common/tests/rpmsg_test.c

```text
static void rpmsg_linux_test(void)
{
    int j;
    uint32_t master_id, remote_id;
    struct rpmsg_info_t *info;
    struct rpmsg_block_t *block;
    rpmsg_queue_handle remote_queue;
    char *rx_msg = (char *)rt_malloc(RL_BUFFER_PAYLOAD_SIZE);
    uint32_t master_ept_id;
    uint32_t ept_flags;
    void *ns_cb_data;
    rpmsg_share_mem_check();
    master_id = MASTER_ID;
    remote_id = HAL_CPU_TOPOLOGY_GetCurrentCpuId();
    rt_kprintf("rpmsg remote: remote core cpu_id-%ld\n", remote_id);
    rt_kprintf("rpmsg remote: shmem_base-0x%lx shmem_end-%lx\n",
    RPMSG_LINUX_MEM_BASE, RPMSG_LINUX_MEM_END);
    info = malloc(sizeof(struct rpmsg_info_t));
    if (info == NULL) {
        rt_kprintf("info malloc error!\n");
        while (1) {
            ;
        }
    }
    info->private = malloc(sizeof(struct rpmsg_block_t));
    if (info->private == NULL) {
        rt_kprintf("info malloc error!\n");
        while (1) {
            ;
        }
    }
    /* Initialize rpmsg endpoint */
    info->instance = rpmsg_lite_remote_init((void *)RPMSG_LINUX_MEM_BASE,
    RL_PLATFORM_SET_LINK_ID(master_id, remote_id), RL_NO_FLAGS);
    rpmsg_lite_wait_for_link_up(info->instance);
    rt_kprintf("rpmsg remote: link up! link_id-0x%lx\n",
               info->instance->link_id);
    rpmsg_ns_bind(info->instance, rpmsg_ns_cb, &ns_cb_data);
    remote_queue  = rpmsg_queue_create(info->instance);
    info->ept = rpmsg_lite_create_ept(info->instance,
    RPMSG_RTT_REMOTE_TEST3_EPT_ID, rpmsg_queue_rx_cb, remote_queue);
    /* The remote core announce a new ept name corresponding to the master end */
    ept_flags = RL_NS_CREATE;
    rpmsg_ns_announce(info->instance, info->ept,
    RPMSG_RTT_REMOTE_TEST_EPT3_NAME, ept_flags);
    /****************** rpmsg test run **************/
    for (j = 0; j < 100; j++)
    {
        rpmsg_queue_recv(info->instance, remote_queue,
                         (uint32_t *)&master_ept_id, rx_msg,
                         RL_BUFFER_PAYLOAD_SIZE, RL_NULL, RL_BLOCK);
    //    rpmsg_queue_recv_nocopy(remote_rpmsg, remote_queue, (uint32_t *)&src,
                                  (char **)&rx_msg, RL_NULL, RL_BLOCK);
        rt_kprintf("rpmsg remote: master_ept_id-0x%lx rx_msg: %s\n",
                   master_ept_id, rx_msg);
        rpmsg_lite_send(info->instance, info->ept, master_ept_id,
        RPMSG_RTT_TEST_MSG, strlen(RPMSG_RTT_TEST_MSG), RL_BLOCK);
    }
}
```

Ausführliche Beschreibung der Schnittstellenfunktionen:

| Funktion | Beschreibung |
| --- | --- |
| rpmsg_lite_remote_init() | Remote-Seite von RPMsg-lite initialisieren. |
| rpmsg_queue_create() | Warteschlange in RPMsg-lite erstellen. |
| rpmsg_lite_create_ept() | Endpoint erstellen. |
| rpmsg_queue_recv() | Empfangene Daten werden automatisch in den Puffer kopiert. |
| rpmsg_ns_bind() | An den Name-Service-ept binden (ept-ID 0x35 ist für den Name Service<br>zur Übermittlung neuer Kanalnamen vorgesehen). |
| rpmsg_ns_announce() | Neuen Remote-ept-Namen bekanntgeben. |
| rpmsg_lite_send() | Nachricht senden. |

###### 6.5.1.2.3 Protokoll eines erfolgreichen Tests

Nach erfolgreichem Einbinden von RPMSG auf dem Linux-Hauptkern erscheinen folgende Ausgaben:

```text
[    1.105178] rockchip-rpmsg 7c00000.rpmsg: Rockchip RPMSG platform probe.
[    1.105228] rockchip-rpmsg 7c00000.rpmsg: assigned reserved memory node rpmsg_dma@8000000
[    1.105239] rockchip-rpmsg 7c00000.rpmsg: rpdev vdev0: vring0 0x7c00000, vring1 0x7c08000
[    1.105720] virtio_rpmsg_bus virtio0: RPMSG host is online
```

Nachdem der Remote Core die Name-Service-Ankündigung gesendet hat, erscheinen auf dem Linux-Hauptkern folgende Ausgaben:

```text
[    1.105808] virtio_rpmsg_bus virtio0: creating channel rpmsg-ap3-ch0 addr 0xc3
[    1.105980] rockchip_rpmsg_test virtio0.rpmsg-ap3-ch0.-1.195: RPMSG master: new channel:
0x400 -> 0xc3!
```

Dabei ist rpmsg-ap3-ch0 der ept-Name, 0x400 die Master-ept-ID und 0xc3 die Remote-ept-ID.

Der RT-Thread-Test zeigt folgende Boot-Protokollinformationen:

```text
[(3)0.101.712] rpmsg remote: remote core cpu_id-3
[(3)0.101.890] rpmsg remote: shmem_base-0x7c00000 shmem_end-8100000
[(3)0.506.840] rpmsg remote: link up! link_id-0x3
```

Die RPMSG-FLAG-Definitionen lauten:

```text
/* RPMSG flag bit definition * bit 0: Set 1 to indicate remote processor is ready * bit 1: Set 1 to use reserved memory region as shared DMA pool * bit 2: Set 1 to use cached share memory as vring buffer */
#define RPMSG_REMOTE_IS_READY            BIT(0)
#define RPMSG_SHARED_DMA_POOL            BIT(1)
#define RPMSG_CACHED_VRING                BIT(2)
```

#### 6.5.2 RT-Thread + HAL

Die RPMsg-lite-Inter-Core-Kommunikation unter RTOS beruht auf Inter-Core-Interrupts und gemeinsamem Speicher. Ein standardisiertes Framework ermöglicht die Kommunikation mehrerer Kerne. Standardmäßig ist CPU 1 Master, die übrigen CPUs sind Remotes.

##### 6.5.2.1 Gemeinsam genutzter Speicher

Startadresse und Größe des gemeinsamen RT-Thread-Speichers

Detaillierte Aufteilung des gemeinsamen Speicherbereichs

Pfad: rtos/bsp/rockchip/rkxxxx-32/gcc_arm.ld.S

```text
.share_lock (NOLOAD):
    {
        . = ALIGN(64);
        PROVIDE(__spinlock_mem_start__ = .);
        . += __SPINLOCK_MEM_SIZE;
        PROVIDE(__spinlock_mem_end__ = .);
        . = ALIGN(64);
    } > SHMEM
   .share_rpmsg (NOLOAD):
    {
        . = ALIGN(0x1000);
        PROVIDE(__share_rpmsg_start__ = .);
        . += __SHARE_RPMSG_SIZE;
        PROVIDE(__share_rpmsg_end__ = .);
        . = ALIGN(0x1000);
    } > SHMEM
    .share_data :
    {
        . = ALIGN(64);
        PROVIDE(__share_data_start__ = .);
        KEEP(*(.share_data))
        PROVIDE(__share_data_end__ = .);
        . = ALIGN(64);
    } > SHMEM AT > DRAM
```

Startadresse und Größe des gemeinsamen HAL-Speichers:

Detaillierte Aufteilung des gemeinsamen Speicherbereichs

Pfad: hal/project/rkxxxx/GCC/gcc_arm.ld.S

```text
.share_lock (NOLOAD) :
     {
         . = ALIGN(64);
         PROVIDE(__spinlock_mem_start__ = .);
         . += __SPINLOCK_MEM_SIZE;
         PROVIDE(__spinlock_mem_end__ = .);
         . = ALIGN(64);
     } > SHMEM
     .share_rpmsg (NOLOAD):
     {
         . = ALIGN(0x1000);
         PROVIDE(__share_rpmsg_start__ = .);
         . += SHRPMSG_SIZE; // Assuming SHRPMSG_SIZE is a typo and should be
__SHARE_RPMSG_SIZE
         PROVIDE(__share_rpmsg_end__ = .);
         . = ALIGN(0x1000);
     } > SHMEM
     .share_ramfs (NOLOAD):
     {
         . = ALIGN(0x1000);
         PROVIDE(__share_ramfs_start__ = .);
         . += SHRAMFS_SIZE;
         PROVIDE(__share_ramfs_end__ = .);
         . = ALIGN(0x1000);
     } > SHMEM
     .share_log (NOLOAD):
     {
         . = ALIGN(64);
         PROVIDE(__share_log0_start__ = .);
         . += SHLOG0_SIZE;
         PROVIDE(__share_log0_end__ = .);
         . = ALIGN(64);
         PROVIDE(__share_log1_start__ = .);
         . += SHLOG1_SIZE;
         PROVIDE(__share_log1_end__ = .);
         . = ALIGN(64);
         PROVIDE(__share_log2_start__ = .);
         . += SHLOG2_SIZE;
         PROVIDE(__share_log2_end__ = .);
         . = ALIGN(64);
         PROVIDE(__share_log3_start__ = .);
         . += SHLOG3_SIZE;
         PROVIDE(__share_log4_end__ = .); // Assuming there was a typo and the correct
symbol should be __share_log4_end__
         . = ALIGN(64);
     } > SHMEM
```

##### 6.5.2.2 Testdemo

###### 6.5.2.2.1 RTT-Demo

Pfad: SDK/rtos/bsp/rockchip/rkxxxx-32

Menükonfiguration: scons --menuconfig

```text
CONFIG_RT_USING_RPMSG_LITE=y
CONFIG_RT_USING_COMMON_TEST_RPMSG_LITE=y
```

Pfad des RTT-Demos: rtos/bsp/rockchip/common/tests/rpmsg_test.c

Der Kerncode von RPMsg-lite liegt unter rtos/bsp/rockchip/common/drivers/rpmsg-lite. Die Schnittstellenfunktionen sind nachfolgend beschrieben:

| Funktion | Beschreibung |
| --- | --- |
| rpmsg_lite_master_init() | Master-Seite von RPMsg-lite initialisieren |
| rpmsg_lite_remote_init() | Remote-Seite von RPMsg-lite initialisieren |
| rpmsg_lite_wait_for_link_up() | Remote-Seite von RPMsg-lite wartet auf den erfolgreichen<br>Verbindungsaufbau |
| rpmsg_queue_create() | Warteschlange für RPMsg-lite erstellen |
| rpmsg_lite_create_ept() | Endpoint erstellen |
| rpmsg_queue_recv() | Empfangene Daten in den lokalen Puffer kopieren |
| rpmsg_queue_recv_nocopy() | Zeiger auf empfangene Daten direkt übergeben |
| rpmsg_lite_send() | Nachricht senden |

```text
Send a message
```

###### 6.5.2.2.2 HAL-Demo

Datei: SDK/hal/project/rkxxxx/src/main.c

```text
#define TEST_DEMO
#define TEST_USE_RPMSG_INIT
```

Datei: SDK/hal/project/rkxxxx/src/test_demo.c

```text
#define RPMSG_TEST
```

Pfad des HAL-Demos: hal/project/rkxxxx/src/test_demo.c

Der Kerncode von RPMsg-lite liegt unter hal/middleware/rpmsg-lite/. Die Schnittstellenfunktionen sind nachfolgend beschrieben:

| Funktion | Beschreibung |
| --- | --- |
| rpmsg_lite_master_init() | Master-Seite von RPMsg-lite initialisieren |
| rpmsg_lite_remote_init() | Remote-Seite von RPMsg-lite initialisieren |
| rpmsg_lite_wait_for_link_up() | Remote-Seite von RPMsg-lite wartet auf den erfolgreichen Verbindungsaufbau |
| rpmsg_lite_create_ept() | Endpoint erstellen |
| rpmsg_lite_send() | Nachricht senden |

###### 6.5.2.2.3 Testergebnisse

Geben Sie den seriellen Befehl im Terminal ein, um die Protokollinformationen anzuzeigen.

```text
## Chapter-6 RPMSG Test Command
msh >rpmsg_master_test
## Chapter-6 Test Results
[(1)21.952.622] rpmsg probe remote cpu(0) ept(0x80008000) success!
[(1)22.031.235] rpmsg probe remote cpu(2) ept(0x80008002) success!
[(1)22.086.368] rpmsg probe remote cpu(3) ept(0x80008003) success!
[(1)22.086.410] rpmsg_master_send: master[1]-->remote[0], remote ept addr = 0x80008000
[(0)22.152.780]rpmsg_remote_recv: remote[0]<--master[1], master ept addr = 0x80000000
[(0)22.152.959]rpmsg_remote_send: remote[0]-->master[1], master ept addr = 0x80000000
[(1)22.153.616] rpmsg_master_recv: master[1]<--remote[0], remote ept addr = 0x80008000
[(1)22.154.272] rpmsg_master_send: master[1]-->remote[2], remote ept addr = 0x80008002
[(2)22.231.397]rpmsg_remote_recv: remote[2]<--master[1], master ept addr = 0x80000002
[(2)22.231.580]rpmsg_remote_send: remote[2]-->master[1], master ept addr = 0x80000002
[(1)22.232.237] rpmsg_master_recv: master[1]<--remote[2], remote ept addr = 0x80008002
[(1)22.232.893] rpmsg_master_send: master[1]-->remote[3], remote ept addr = 0x80008003
[(3)22.286.525]rpmsg_remote_recv: remote[3]<--master[1], master ept addr = 0x80000003
[(3)22.286.706]rpmsg_remote_send: remote[3]-->master[1], master ept addr = 0x80000003
[(1)22.287.363] rpmsg_master_recv: master[1]<--remote[3], remote ept addr = 0x80008003
[(1)22.288.017] rpmsg test OK!
```

## 7. Kapitel 7: Interrupts

### 7.1 Cortex-A GIC

Der Cortex-A GIC (Generic Interrupt Controller) verarbeitet Interruptanforderungen. Er verwaltet und verteilt verschiedene Interrupttypen und leitet sie an den Prozessorkern weiter, der die jeweilige Interrupt-Service-Routine ausführt.

Es gibt die Versionen GICv2 und GICv3. Gängige Chipplattformen unterstützen sie wie folgt:

```text
SoC
```

| SoC | GICv2 | GICv3 |
| --- | --- | --- |
| RK3588 |  | ✔ |
| Rk3576 | ✔ |  |
| RK3568 |  | ✔ |
| RK3562 | ✔ |  |
| RK3358 | ✔ |  |
| RK3308 | ✔ |  |

```text
RK3308
```

Der GIC kennt drei Interrupttypen:

1. SGI: Interruptnummern 0-15; softwaregenerierte Interrupts, privat für jede CPU.

2. PPI: Interruptnummern 16-31; private Peripherieinterrupts, privat für jede CPU.

3. SPI: Interruptnummern ab 32; gemeinsame Peripherieinterrupts für alle CPUs.

Die Kombination dieser drei Typen ermöglicht vielfältige Anwendungen. In den Konfigurationsdateien besitzen die unterschiedlichen Interruptgruppen jeweils eigene Gruppenoffsets.

Die Verwendung von Interrupts umfasst folgende Schritte:

1. GIC-Interruptkonfiguration: Priorität der angegebenen Interruptnummer und die CPU festlegen, welche die Service-Routine ausführen soll.

2. GIC-Service-Routine registrieren: Der angegebenen Interruptnummer eine Service-Routine zuordnen.

3. GIC-Interrupt aktivieren: Den Interrupt freigeben, damit das System ihn empfangen und bearbeiten kann.

4. Den Interrupt des Peripheriemoduls konfigurieren, damit das Modul Interrupts erzeugen kann.

Die Konfiguration wird nachfolgend am Beispiel von GPIO-Interrupts auf RK3562 unter Bare-metal und RTOS erläutert.

#### 7.1.1 GIC-Interruptkonfiguration

Suchen Sie die Definition der Struktur irqsConfig in Bare-metal und RTOS:

RTOS: &lt;AMP_SDK&gt;/rtos/bsp/rockchip/rk3562/board/common/board_base.c

Bare-metal: &lt;AMP_SDK&gt;/hal/project/rk3562/src/main.c oder &lt;AMP_SDK&gt;/hal/project/rk3308/src/main.c ; je nach Build-Makro werden unterschiedliche Konfigurationen verwendet.

Der Code ist wie folgt aufgebaut:

```text
#define DEFAULT_IRQ_CPU 1 /* Points to the core of main system, modify according to actual situation */
struct GIC_AMP_IRQ_INIT_CFG irqsConfig[] = {
    GIC_AMP_IRQ_CFG_ROUTE(GPIO0_IRQn, 0xd0, CPU_GET_AFFINITY(0, 0)), /* Add a path for CPU0 to respond to CPU0 interrupts */
    GIC_AMP_IRQ_CFG_ROUTE(0, 0, CPU_GET_AFFINITY(DEFAULT_IRQ_CPU, 0)),   /* sentinel */
};
struct GIC_IRQ_AMP_CTRL irqConfig = {
    .cpuAff = CPU_GET_AFFINITY(DEFAULT_IRQ_CPU, 0),
    .defPrio = 0xd0,
    .defRouteAff = CPU_GET_AFFINITY(DEFAULT_IRQ_CPU, 0),
    .irqsCfg = &irqsConfig[0],
};
int main()
{
    HAL_GIC_Init(&irqConfig);
    // ......
}
```

Bei einer Mehrsystemkonfiguration aus Bare-metal und RTOS verwenden alle Systeme diese Tabelle gemeinsam.

Vom Anwender änderbare Stellen:

DEFAULT_IRQ_CPU: CPU, die standardmäßig alle Interrupts bearbeitet. Nicht in irqsConfig konfigurierte Interrupts werden sämtlich von DEFAULT_IRQ_CPU bearbeitet.

Parameterbeschreibung für GIC_AMP_IRQ_CFG_ROUTE(irqNum, Priority, CPU_GET_AFFINITY(cpuID, cpuCluster)):

```text
Description
```

| Parameter | Beschreibung |
| --- | --- |
| irqNum | Interruptnummer |
| Priority | Priorität (Standardwert verwenden, keine Änderung erforderlich) |
| cpuID | Nummer der CPU, die den Interrupt bearbeitet |
| cpuCluster | CPU-Cluster, üblich bei big.LITTLE-Systemen. Beim RK3562 immer 0 |

#### 7.1.2 GIC-Interrupt-Service-Routine

##### 7.1.2.1 GIC-Service-Routine unter Bare-metal

Das folgende Beispiel zeigt einen GPIO-Interrupt an der steigenden Flanke von Pin C4 des GPIO0.

```text
// Main entry point for GPIO0 interrupt service routine
static void gpio_isr(int vector, void *param)
{
    // ......
    HAL_GPIO_IRQHandler(GPIO0, GPIO_BANK0);
    // ......
}
// Interrupt callback function for GPIO0 C4 pin
static HAL_Status c4_call_back(eGPIO_bankId bank, uint32_t pin, void *args)
{
    // ......
    return HAL_OK;
}
// Example of using GPIO interrupts
static void gpio_test(void)
{
    // ......
    /* Step 1: GIC Configuration */
    /* Set the GIC (GPIO0) interrupt service routine, enable the interrupt, and allow the system to receive module interrupts */
    HAL_IRQ_HANDLER_SetIRQHandler(GPIO0_IRQn, gpio_isr, NULL);
    HAL_GIC_Enable(GPIO0_IRQn);
    /* Step 2: Module Configuration */
    /* Set GPIO0 C4 as an input pin */
    HAL_GPIO_SetPinDirection(GPIO0, GPIO_PIN_C4, GPIO_IN);
    /* Set the interrupt type and callback function for GPIO0 C4, and enable the IO interrupt for GPIO0 C4 */
    HAL_IRQ_HANDLER_SetGpioIRQHandler(GPIO_BANK0, GPIO_PIN_C4, c4_call_back, NULL);
    HAL_GPIO_SetIntType(GPIO0, GPIO_PIN_C4, GPIO_INT_TYPE_EDGE_RISING);
    /* Enable the GPIO interrupt to allow the module to generate an interrupt */
    HAL_GPIO_EnableIRQ(GPIO0, GPIO_PIN_C4);
}
```

Die Interruptkonfiguration besteht im Beispiel aus zwei Teilen:

GIC-Konfiguration: Die Interruptfunktion gpio_isr festlegen und den Empfang von Interrupts im System aktivieren. Dieser Teil gilt für alle Interrupts und verwendet eine einheitliche Schnittstelle.

Modulkonfiguration: Den Modulinterrupt so einstellen, dass das Modul ein Interruptsignal an den GIC sendet. Dieser Teil richtet sich nach den Regeln des jeweiligen Moduls und unterscheidet sich entsprechend. Ziehen Sie beim Programmieren dessen Dokumentation heran.

Da 32 GPIO-Pins ein einziges GPIO-Interruptsignal teilen, ruft die Service-Routine HAL_GPIO_IRQHandler auf, um die Callback-Funktion des betreffenden Pins auszuführen.

##### 7.1.2.2 GIC-Service-Routine unter RTOS

Unter RTOS kann die Bare-metal-Schnittstelle wie im Beispiel zur Registrierung einer GIC-Service-Routine verwendet werden. Alternativ steht die offizielle, von RTOS gekapselte Schnittstelle zur Verfügung. Für einen Interrupt an der steigenden Flanke von GPIO0 C4 lautet die RTOS-Konfiguration:

```text
// Example of using GPIO pin interrupts
void irq_callback(void *args)
{
    // .......
}
static void gpio_test(void)
{
    struct rt_device_pin_mode   pin_mode;
    rt_device_t pin_dev = rt_device_find("pin");
    rt_device_open(pin_dev, RT_DEVICE_FLAG_RDWR);
    pin_mode.pin = BANK_PIN(0, GPIO_PIN_C4); /* GPIO0_C4 */
    pin_mode.mode = PIN_MODE_INPUT;
    rt_device_control(pin_dev, 0, &pin_mode);
    rt_pin_attach_irq(pin_mode.pin, PIN_IRQ_MODE_RISING, irq_callback, RT_NULL);
    rt_pin_irq_enable(pin_mode.pin, PIN_IRQ_ENABLE);
}
```

Die Module können sich stark unterscheiden. Weitere Einzelheiten finden Sie in der offiziellen RT-Thread-Dokumentation.

### 7.2 Cortex-M NVIC

Der Cortex-M NVIC (Nested Vectored Interrupt Controller) ist eine zentrale Prozessorkomponente zur Interruptverwaltung. Er verwaltet und verteilt externe und interne Anforderungen und leitet sie zur Bearbeitung an den passenden Prozessorkern weiter.

Unterstützte Plattformen: RK3588, RK3576 und RK3562; der betreffende Prozessorkern gehört zur Cortex-M0-Serie.

Die Cortex-M0-Serie unterstützt bis zu 32 Interrupts. Weitere Interrupts benötigen daher eine zweite Abfrageebene. Der INTMUX-Mechanismus erweitert die Anzahl unterstützter Interrupts und erleichtert die Softwareentwicklung.

Die Verwendung von NVIC-Interrupts umfasst folgende Schritte:

1. NVIC initialisieren: Interruptvektortabelle und NVIC-Controller initialisieren.

2. NVIC-Service-Routine registrieren: Der angegebenen Interruptnummer eine Service-Routine zuordnen.

3. NVIC-Interrupt aktivieren: Den Interrupt freigeben, damit das System ihn empfangen und bearbeiten kann.

4. Den Interrupt des Peripheriemoduls konfigurieren, damit das Modul Interrupts erzeugen kann.

Die Konfiguration wird am Beispiel von GPIO-Interrupts auf der RK3562-MCU unter Bare-metal und RTOS erläutert.

#### 7.2.1 NVIC-Interruptinitialisierung

Unter Bare-metal und RTOS ist die NVIC-Initialisierung bereits in HAL_Init(); enthalten. Sie können HAL_Init direkt aufrufen oder die NVIC-Operationen separat ausführen.

```text
/* <AMP_SDK>/hal/lib/hal/src/hal_base.c */
HAL_Status HAL_Init(void)
{
#ifdef __CORTEX_M
#ifdef HAL_NVIC_MODULE_ENABLED
    /* Set Interrupt Group Priority */
    HAL_NVIC_Init();
    /* Set Interrupt Group Priority */
    HAL_NVIC_SetPriorityGrouping(NVIC_PRIORITYGROUP_DEFAULT);
#endif
#endif
    // .......
    return HAL_OK;
}
```

#### 7.2.2 NVIC-Interrupt-Service-Routine

##### 7.2.2.1 GIC-Service-Routine unter Bare-metal

Das folgende Beispiel erläutert einen GPIO-Interrupt an der steigenden Flanke von GPIO0 C4.

```text
// Main entry point for the GPIO0 interrupt service routine
static void gpio_isr(int vector, void *param)
{
    // ......
    HAL_GPIO_IRQHandler(GPIO0, GPIO_BANK0);
    // ......
}
// Interrupt callback function for the GPIO0 C4 pin
static HAL_Status c4_call_back(eGPIO_bankId bank, uint32_t pin, void *args)
{
    // ......
    return HAL_OK;
}
// Example of using GPIO pin interrupts
static void gpio_test(void)
{
    // ......
    /* Step 1: GIC Configuration */
    /* Set the NVIC (GPIO0) interrupt service routine and enable the interrupt to allow the system to receive module interrupts */
    HAL_INTMUX_SetIRQHandler(GPIO1_IRQn, gpio_isr, NULL);
    HAL_INTMUX_EnableIRQ(GPIO1_IRQn);
    /* Step 2: Module Configuration */
    /* Set GPIO0 C4 as an input pin */
    HAL_GPIO_SetPinDirection(GPIO0, GPIO_PIN_C4, GPIO_IN);
    /* Set the interrupt type and callback function for GPIO0 C4, and enable the IO interrupt for GPIO0 C4 */
    HAL_IRQ_HANDLER_SetGpioIRQHandler(GPIO_BANK0, GPIO_PIN_C4, c4_call_back, NULL);
    HAL_GPIO_SetIntType(GPIO0, GPIO_PIN_C4, GPIO_INT_TYPE_EDGE_RISING);
    /* Enable the GPIO interrupt to allow the module to generate an interrupt */
    HAL_GPIO_EnableIRQ(GPIO0, GPIO_PIN_C4);
}
```

Die Interruptkonfiguration besteht im Beispiel aus zwei Teilen:

NVIC-Konfiguration: Die Interruptfunktion gpio_isr festlegen und den systemweiten Interruptempfang aktivieren. Dieser gemeinsame Teil verwendet eine einheitliche Schnittstelle. Wegen INTMUX ist die ursprüngliche NVIC-Schnittstelle hier durch HAL_INTMUX*** gekapselt; die Verwendung entspricht der ursprünglichen NVIC-Funktion.

Modulkonfiguration: Den Modulinterrupt so einstellen, dass das Modul ein Interruptsignal an NVIC sendet. Die Konfiguration richtet sich nach den jeweiligen Modulregeln und unterscheidet sich erheblich. Ziehen Sie die Moduldokumentation heran.

Da 32 GPIO-Pins ein einziges GPIO-Interruptsignal teilen, wird HAL_GPIO_IRQHandler in der Service-Routine verwendet, um die Callback-Funktion des betreffenden Pins aufzurufen.

##### 7.2.2.2 NVIC-Service-Routine unter RTOS

Siehe GIC-Service-Routine unter RTOS.

### 7.3 RISC-V-Interruptcontroller

Der RISC-V IPIC (Integrated Programmable Interrupt Controller) ist eine zentrale Prozessorkomponente zur Interruptverwaltung. Er verwaltet und verteilt externe und interne Anforderungen und leitet sie zur Bearbeitung an den passenden Prozessorkern weiter.

Unterstützte Plattform: RK3568; der betreffende Prozessorkern gehört zur RISC-V-Serie.

Die hier beschriebene RISC-V-Serie verarbeitet maximal 32 Interrupts. Weitere Interrupts erfordern eine zweite Abfrageebene. INTMUX erweitert die Anzahl unterstützter Interrupts und erleichtert die Softwareentwicklung.

Die Verwendung von IPIC-Interrupts umfasst folgende Schritte:

1. IPIC initialisieren: Interruptvektortabelle und IPIC-Controller initialisieren.

2. IPIC-Service-Routine registrieren: Der angegebenen Interruptnummer eine Service-Routine zuordnen.

3. IPIC-Interrupt aktivieren: Den Interrupt freigeben, damit das System ihn empfangen und bearbeiten kann.

4. Den Interrupt des Peripheriemoduls konfigurieren, damit das Modul Interrupts erzeugen kann.

Die Konfiguration wird am Beispiel von GPIO-Interrupts auf RK3568 RISC-V unter Bare-metal und RTOS erläutert.

#### 7.3.1 IPIC-Interruptinitialisierung

Unter Bare-metal und RTOS ist die IPIC-Initialisierung bereits in HAL_INTMUX_Init() enthalten. Sie können HAL_INTMUX_Init() direkt aufrufen oder die IPIC-Operationen separat ausführen.

```text
/* <AMP_SDK>/hal/lib/hal/src/hal_intmux.c */
HAL_Status HAL_INTMUX_Init(void)
{
    // .......
#ifdef HAL_RISCVIC_MODULE_ENABLED
    HAL_RISCVIC_Init();
#endif
    // .......
    return HAL_OK;
}
```

#### 7.3.2 IPIC-Interrupt-Service-Routine

##### 7.3.2.1 GIC-Service-Routine unter Bare-metal

Das folgende Beispiel erläutert einen GPIO-Interrupt an der steigenden Flanke von GPIO4 C5.

```text
// The main entry for the GPIO0 interrupt service routine
static void gpio_isr(int vector, void *param)
{
    // ......
    HAL_GPIO_IRQHandler(GPIO4, GPIO_BANK4);
    // ......
}
// The interrupt callback function for the GPIO0 C4 pin
static HAL_Status c5_call_back(eGPIO_bankId bank, uint32_t pin, void *args)
{
    // ......
    return HAL_OK;
}
// Example of using GPIO interrupts
static void gpio_test(void)
{
    // ......
    /* Step 1: GIC Configuration */
    /* Set the interrupt service routine for IPIC (GPIO4), enable the interrupt, and allow the system to receive module interrupts */
    HAL_INTMUX_SetIRQHandler(GPIO4_IRQn, gpio_isr, NULL);
    HAL_INTMUX_EnableIRQ(GPIO4_IRQn);
    /* Step 2: Module Configuration */
    /* Set GPIO4 C5 as an input */
    HAL_GPIO_SetPinDirection(GPIO4, GPIO_PIN_C5, GPIO_IN);
    /* Set the interrupt type and callback function for GPIO4 C5, and enable the IO interrupt for GPIO4 C5 */
    HAL_IRQ_HANDLER_SetGpioIRQHandler(GPIO_BANK4, GPIO_PIN_C5, c5_call_back, NULL);
    HAL_GPIO_SetIntType(GPIO4, GPIO_PIN_C5, GPIO_INT_TYPE_EDGE_RISING);
    /* Enable the GPIO interrupt, allowing the module to generate an interrupt */
    HAL_GPIO_EnableIRQ(GPIO4, GPIO_PIN_C5);
}
```

Die Interruptkonfiguration besteht im Beispiel aus zwei Teilen:

IPIC-Konfiguration: Die Interruptfunktion gpio_isr festlegen und den systemweiten Interruptempfang aktivieren. Dieser Teil ist für alle Interrupts gleich und verwendet eine einheitliche Schnittstelle. Die ursprüngliche IPIC-Schnittstelle ist hier durch HAL_INTMUX_Init gekapselt und wird wie die ursprüngliche IPIC-Funktion verwendet.

Modulkonfiguration: Den Modulinterrupt so einstellen, dass das Modul ein Interruptsignal an IPIC sendet. Dieser Teil folgt den jeweiligen Modulregeln; ziehen Sie zum Programmieren die Moduldokumentation heran.

Da 32 GPIO-Pins ein einziges GPIO-Interruptsignal teilen, wird HAL_GPIO_IRQHandler in der Service-Routine verwendet, um die Callback-Funktion des betreffenden Pins aufzurufen.

##### 7.3.2.2 IPIC-Service-Routine unter RTOS

Siehe GIC-Service-Routine unter RTOS.

## 8. Kapitel 8: Module

### 8.1 eMMC

#### 8.1.1 HAL

Je nach Hardwarecontroller verwendet der eMMC-Treiber SDIO oder SDHCI. Der Quellcode liegt unter hal/lib/src/ und hal/middleware/sdhci/ . HAL stellt grundlegende Lese- und Schreibschnittstellen bereit. Beispiel RK3568:

```text
#include "mmc_api.h"
#define TestSector   8
#define maxTestSector (TestSector * 4)
static int pWriteBuf[maxTestSector * 128];
static int pReadBuf[maxTestSector * 128];
static int userCapSize;
static int SdhciInit(void)
{
    int ioctlParam[5] = {0, 0, 0, 0, 0};
    int ret;
    sdmmc_init((void *)0xFE310000);
    ret = sdmmc_ioctrl(SDM_IOCTRL_REGISTER_CARD, ioctlParam);
    if (ret) {
        printf("eMMC init error!\n");
        return -1;
    }
    ret = sdmmc_ioctrl(SDM_IOCTR_GET_CAPABILITY, ioctlParam);
    if (ret) {
        printf("eMMC get capability error!\n");
        return -1;
    }
    userCapSize = ioctlParam[1];
}
static int SdhciTest(void)
{
    int i, j, loop = 0;
    int testEndLBA;
    int testLBA = 0;
    int testSecCount = 1;
    int printFlag;
    testEndLBA = userCapSize / 32;
    for (i = 0; i < (maxTestSector * 128); i++)
        pWriteBuf[i] = i;
    for (loop = 0; loop < 2; loop++) {
        HAL_DBG("---------Test loop = %d---------\n", loop);
        HAL_DBG("---------Test ftl write [Start]---------\n", "");
        testSecCount = 1;
        HAL_DBG("testEndLBA = %x\n", testEndLBA);
        HAL_DBG("testLBA = %x\n", testLBA);
        for (testLBA = 0x10000 + loop; (testLBA + testSecCount) < testEndLBA;) {
            sdmmc_write(testLBA, testSecCount, pWriteBuf);
            sdmmc_read(testLBA, testSecCount, pReadBuf);
            printFlag = testLBA & 0x1FF;
            if (printFlag < testSecCount)
                HAL_DBG("testLBA = %x\n", testLBA);
            for (j = 0; j < testSecCount * 128; j++) {
                if (pWriteBuf[j] != pReadBuf[j]) {
                    printf("write not match:row=%x, num=%x, write=%x, read=%x\n", testLBA, j, pWriteBuf[j], pReadBuf[j]);
                    while (1);
                }
            }
            testLBA += testSecCount;
            testSecCount++;
            if (testSecCount > maxTestSector)
                testSecCount = 1;
        }
        HAL_DBG("---------Test ftl check [Start]---------%s\n", "");
        testSecCount = 1;
        for (testLBA = 0x10000 + loop; (testLBA + testSecCount) < testEndLBA;) {
            sdmmc_read(testLBA, testSecCount, pReadBuf);
            printFlag = testLBA & 0x7FF;
            if (printFlag < testSecCount)
                HAL_DBG("testLBA = %x\n", testLBA);
            for (j = 0; j < testSecCount * 128; j++) {
                if (pWriteBuf[j] != pReadBuf[j]) {
                    printf("check not match:row=%x, num=%x, write=%x, read=%x\n", testLBA, j, pWriteBuf[j], pReadBuf[j]);
                    while (1);
                }
            }
            testLBA += testSecCount;
            testSecCount++;
            if (testSecCount > maxTestSector)
                testSecCount = 1;
        }
    }
    HAL_DBG("---------Test end---[End]------\n", "");
    return 0;
}
```

#### 8.1.2 RT-Thread

RT-Thread bietet Dateisystemunterstützung für den SDIO-Treiber; SDHCI stellt grundlegende blockweise Lese- und Schreibschnittstellen bereit.

SDIO-Konfiguration: Eintrag in menuconfig:

```text
RT-Thread Components  -->
    Device Drivers  -->
    [*] Using SD/MMC device drivers
RT_USING_SDIO=y
RT_USING_SDIO0=y
RT_USING_DMA=y
RT_USING_DMA_PL330=y
RT_USING_DMA0=y
```

SDHCI-Konfiguration:

```text
RT_USING_SDHCI=y
```

Unterstützung des elm-fat-Dateisystems in RT-Thread: Eintrag in menuconfig:

```text
RT-Thread Components -->
    Device virtual file system  -->
    [*] Using device virtual file system
    [*]   Using mount table for file system /* Implement the corresponding registration partition table to enable automatic mounting of partitions on power-up */
    [*]   Enable elm-chan fatfs /* FAT file system */
      elm-chan's FatFs, Generic FAT Filesystem Module  -->
      (4096) Maximum sector size to be handled. /* Must be changed to 4096 for products with SPI Nor */
RT_USING_DFS=y
RT_SDCARD_MOUNT_POINT="/"
DFS_FILESYSTEMS_MAX=4
DFS_FILESYSTEM_TYPES_MAX=4
RT_USING_DFS_MNTTABLE=y
RT_USING_DFS_ELMFAT=y
RT_DFS_ELM_MAX_SECTOR_SIZE=4096
```

RT-Thread bindet das Dateisystem im Speicher anhand von mount_table ein. Ist das automatische Einbinden partitionierter Dateisysteme aktiviert, können Sie die Partitionsregistrierung in mnt.c ergänzen. Beispiel: die Partition "root" unter "/" einbinden:

```text
const struct dfs_mount_tbl mount_table[] =
{
    {"root", "/", "elm", 0, 0},
    {0}
};
```

Für einen eigenen Mount-Ablauf können Sie das Dateisystem auch mit folgendem Code einbinden:

```text
dfs_mount("root", "/", "elm", 0, 0)
```

Ist kein passendes Dateisystem auf eMMC vorhanden, können Sie es formatieren und anschließend einbinden:

```text
mkfs -t elm sd0      # Format sd0 as an elm-FAT file system
mount sd0 / elm      # Mount sd0 as elm-FAT in the / directory
```

Nach erfolgreichem Einbinden können Sie das Dateisystem über serielle Befehle bedienen und seine Funktion prüfen:

```text
## Chapter-8 Create a file in the root directory
echo "This is a test!" /test.txt
## Chapter-8 Check the directory
ls
Directory /:
test.txt
## Chapter-8 Check the file content
cat test.txt
This is a test!
```

#### 8.1.3 Kernel

Die Verwendung von eMMC im Kernel beschreibt "Rockchip_Developer_Guide_SDMMC_SDIO_eMMC_EN.pdf".

### 8.2 UART

#### 8.2.1 UART-Konfiguration in HAL

Die UART-Konfiguration in HAL umfasst im Wesentlichen:

1. IOMUX konfigurieren

2. UART-Interrupt in der Interrupttabelle konfigurieren

3. Initialisierungsschnittstelle aufrufen

Beispiel RK3562:

```text
static void HAL_IOMUX_Uart7M1Config(void)
{
    HAL_PINCTRL_SetIOMUX(GPIO_BANK1,
                         GPIO_PIN_B3,
                         PIN_CONFIG_MUX_FUNC3);
    HAL_PINCTRL_SetIOMUX(GPIO_BANK1,
                         GPIO_PIN_B4,
                         PIN_CONFIG_MUX_FUNC3);
}
static struct GIC_AMP_IRQ_INIT_CFG irqsConfig[] = {
/* TODO: Config the irqs here. * GIC version: GICv2 */
    GIC_AMP_IRQ_CFG_ROUTE(UART7_IRQn, 0xd0, CPU_GET_AFFINITY(1, 0)),
    GIC_AMP_IRQ_CFG_ROUTE(0, 0, CPU_GET_AFFINITY(1, 0)),   /* sentinel */
};
void main(void)
{
    struct HAL_UART_CONFIG hal_uart_config = {
        .baudRate = UART_BR_1500000,
        .dataBit = UART_DATA_8B,
        .stopBit = UART_ONE_STOPBIT,
        .parity = UART_PARITY_DISABLE,
    };
    HAL_IOMUX_Uart7M1Config();
    HAL_UART_Init(&g_uart7Dev, &hal_uart_config);
}
```

#### 8.2.2 UART-Konfiguration in RT-Thread

Die UART-Konfiguration in RT-Thread umfasst im Wesentlichen:

1. UART-Unterstützung mit scons --menuconfig aktivieren

2. Zugehörigen IOMUX konfigurieren

3. g_uart_board einschließlich Baudrate und weiterer Angaben konfigurieren

4. UART-Interrupt in der Interrupttabelle konfigurieren

Einige UARTs in RT-Thread sind bereits vollständig wie oben beschrieben konfiguriert und können direkt mit scons --menuconfig aktiviert werden. Beispiel RK3562:

Eintrag in menuconfig:

```text
RT-Thread rockchip RK3562 drivers  -->
    Enable UART  -->
    [*] Enable UART
    [*]   Enable UART0
## Chapter-8 UART0
RT_CONSOLE_DEVICE_NAME="uart0"
RT_USING_UART=y
RT_USING_UART0=y
## Chapter-8 UART7
RT_CONSOLE_DEVICE_NAME="uart7"
RT_USING_UART=y
RT_USING_UART7=y
/* Configure the corresponding IOMUX */
#ifdef RT_USING_UART0
RT_WEAK void uart0_m0_iomux_config(void)
{
    HAL_PINCTRL_SetIOMUX(GPIO_BANK0,
                         GPIO_PIN_D0 |
                         GPIO_PIN_D1,
                         PIN_CONFIG_MUX_FUNC1);
}
#endif
#ifdef RT_USING_UART7
RT_WEAK void uart7_m1_iomux_config(void)
{
    HAL_PINCTRL_SetIOMUX(GPIO_BANK1,
                         GPIO_PIN_B3 |
                         GPIO_PIN_B4,
                         PIN_CONFIG_MUX_FUNC3);
}
#endif
/* Call IOMUX */
void rt_hw_iomux_config(void)
{
    rt_hw_iodomain_config();
#ifdef RT_USING_UART0
    uart0_m0_iomux_config();
#endif
#ifdef RT_USING_UART7
    uart7_m1_iomux_config();
#endif
#ifdef RT_USING_GMAC
#ifdef RT_USING_GMAC0
    gmac0_m0_iomux_config();
#endif
#endif
/* Configure `g_uart_board` information */
#if defined(RT_USING_UART0)
RT_WEAK const struct uart_board g_uart0_board =
{
    .baud_rate = UART_BR_1500000,
    .dev_flag = ROCKCHIP_UART_SUPPORT_FLAG_DEFAULT,
    .bufer_size = RT_SERIAL_RB_BUFSZ,
    .name = "uart0",
};
#endif /* RT_USING_UART0 */
/* Configure UART interrupt in the interrupt table */
static struct GIC_AMP_IRQ_INIT_CFG irqsConfig[] =
{
    /* Config the irqs here. */
    // todo...
    GIC_AMP_IRQ_CFG_ROUTE(UART0_IRQn, 0xd0, CPU_GET_AFFINITY(3, 0)),
    GIC_AMP_IRQ_CFG_ROUTE(0, 0, CPU_GET_AFFINITY(1, 0)),   /* sentinel */
};
```

#### 8.2.3 Kernel

Die zur SoC-Plattform gehörende Kernel-DTS-Datei kernel/arch/arm64/boot/dts/rockchip/rkxxxx.dtsi enthält alle UART-Konfigurationen, die nach Bedarf aktiviert werden können. Einzelheiten beschreibt "Rockchip_Developer_Guide_UART_CN.pdf".

Um Peripheriekonflikte im AMP-System zu vermeiden, müssen Ressourcen anderer Systeme einschließlich UART im Kernel-DTS isoliert und deaktiviert werden. In rkxxxx-amp.dtsi sind die betreffenden UARTs auszunehmen und ihre Interrupts der jeweils verwendenden CPU zuzuordnen.

```text
/* In the DTS, route the UART7 interrupt (69) to CPU3, and declare the clock for UART7. If other DTSs use the clock, an error will be reported, to achieve resource isolation */
/ {
    rockchip_amp: rockchip-amp {
        compatible = "rockchip,amp";
        clocks = <&cru FCLK_BUS_CM0_CORE>, <&cru CLK_BUS_CM0_RTC>,
            <&cru PCLK_MAILBOX>, <&cru PCLK_INTC>,
            <&cru SCLK_UART7>, <&cru PCLK_UART7>,
            <&cru PCLK_TIMER>, <&cru CLK_TIMER4>, <&cru CLK_TIMER5>;
        pinctrl-names = "default";
        pinctrl-0 = <&uart7m1_xfer>;
        amp-cpu-aff-maskbits = /bits/ 64 <0x0 0x1 0x1 0x2 0x2 0x4 0x3 0x8>;
        amp-irqs = /bits/ 64 <GIC_AMP_IRQ_CFG_ROUTE(147, 0xd0, CPU_GET_AFFINITY(3, 0))
                            GIC_AMP_IRQ_CFG_ROUTE(69, 0xd0, CPU_GET_AFFINITY(3, 0))>;
        status = "okay";
    };
    /* Disable UART7 in the DTS */
    &uart7 {
        status = "disabled";
    }
}
```

### 8.3 SPI FLASH

Die Verwendung von SPI FLASH beschreibt "Rockchip_Developer_Guide_RT-Thread_SPIFLASH_EN.pdf".

Auf Rockchip-Plattformen stehen die SPI-Flash-Controller FSPI, SFC und SPI zur Verfügung.

FSPI (Flexible Serial Peripheral Interface) ist ein flexibler serieller Controller mit folgenden Haupteigenschaften:

Unterstützt SPI Nor, SPI Nand sowie Psram und SRAM mit SPI-Protokoll

Unterstützt Standard SPI (eine Leitung), Dual SPI und Quad SPI; einige Versionen unterstützen Octal SPI

Unterstützt SDR (Übertragung an einer Flanke); einige Versionen unterstützen DTR (Übertragung an beiden Flanken)

XIP-Technik

DMA-Übertragung (integrierter DMA)

SFC (Serial Flash Controller) ist ein serieller Controller mit folgenden Haupteigenschaften:

Unterstützt SPI Nor, SPI Nand sowie Psram und SRAM mit SPI-Protokoll

Unterstützt Standard SPI (eine Leitung), Dual SPI und Quad SPI

Unterstützt SDR (Übertragung an einer Flanke)

DMA-Übertragung (integrierter DMA)

SPI (Serial Peripheral Interface) ist ein allgemeiner serieller Controller mit folgenden Haupteigenschaften:

Unterstützt SPI Nor, SPI Nand und Psram mit SPI-Protokoll

Unterstützt Standard SPI (eine Leitung)

Unterstützt SDR (Übertragung an einer Flanke)

DMA-Übertragung (externer DMA)

#### 8.3.1 Hardwareabstraktionsschicht (HAL)

RK HAL stellt die Protokollschicht HAL_SNOR auf Grundlage des SPI-Nor-Übertragungsprotokolls bereit. Der HAL-Quellcode liegt unter hal/lib/hal/src/ . Unter hal/test/hal/ gibt es ein Demo zur Schnittstellennutzung, das als Referenz für das Lesen und Schreiben von SPI FLASH dient.

Wegen der Vielzahl von SPI-FLASH-Modellen identifiziert die Software die Chips über Flash-IDs. Unterstützte Chips lassen sich wie folgt im Quellcode prüfen:

```text
HAL_SECTION_SRAM_CODE static const struct FLASH_INFO s_spiFlashbl[] = {
    /* GD25LQ16E */
    { 0xc86015, 128, 8, 0x03, 0x02, 0x6B, 0x32, 0x20, 0xD8, 0x0D, 12, 9, 0 },
    /* GD25Q32B */
    { 0xc84016, 128, 8, 0x03, 0x02, 0x6B, 0x32, 0x20, 0xD8, 0x0D, 13, 9, 0 },
    /* GD25Q64B */
    { 0xc84017, 128, 8, 0x03, 0x02, 0x6B, 0x32, 0x20, 0xD8, 0x0D, 14, 9, 0 },
    /* GD25Q127C and GD25Q128C */
    { 0xc84018, 128, 8, 0x03, 0x02, 0x6B, 0x32, 0x20, 0xD8, 0x0C, 15, 9, 0 },
    /* GD25Q256B/C/D */
    { 0xc84019, 128, 8, 0x13, 0x12, 0x6C, 0x3E, 0x21, 0xDC, 0x1C, 16, 6, 0 },
    /* GD55LT01GE */
    { 0xc8661b, 128, 8, 0x13, 0x12, 0x6B, 0x32, 0x20, 0xD8, 0x3C, 18, 0, 0 },
    /* GD25LQ64C */
    { 0xc86017, 128, 8, 0x03, 0x02, 0x6B, 0x32, 0x20, 0xD8, 0x0D, 14, 9, 0 },
    /* GD25LQ32E */
    { 0xc86016, 128, 8, 0x03, 0x02, 0x6B, 0x32, 0x20, 0xD8, 0x0D, 13, 9, 0 },
    /* GD25LX256E */
    { 0xc86819, 128, 8, 0x13, 0x12, 0x00, 0x00, 0x21, 0xDC, 0x10, 16, 0, 0x0D },
}
```

Konfigurationsbeschreibung:

```text
#define HAL_SNOR_MODULE_ENABLED    /* SNOR support */
#define HAL_SFC_MODULE_ENABLED     /* SFC controller support */
#define HAL_SNOR_SFC_HOST          /* SFC controller support */
```

#### 8.3.2 RT-Thread

Grundkonfiguration: Eintrag in menuconfig:

```text
RT-Thread rockchip common drivers  --->
    [*] Enable ROCKCHIP SPI NOR Flash
    (80000000) Reset the speed of SPI Nor flash in Hz
    [ ]   Set SPI Host DUAL IO Lines /* If the FSPI master only reserves IO0~1, Dual mode should be used */
            Choose SPI Nor Flash Adapter (Attach FSPI controller to SNOR) --->
```

Konfigurationsbeschreibung:

```text
RT_USING_MTD_NOR=y
RT_USING_SNOR=y
RT_SNOR_SPEED=80000000 /* I/O interface speed */
## Chapter-8 RT_SNOR_DUAL_IO=n /* It is not configured by Default, Quad SPI is limited to Duad SPI usage */
## Chapter-8 RT_SNOR_XIP_DATA_BEGIN=0 /* It is not configured by Default, XIP read interface implementation starting address, refer to "Nor Flash XIP Technology" for details */
RT_USING_SNOR_FSPI_HOST=y /* FSPI controller solution */
## Chapter-8 RT_USING_SNOR_SFC_HOST=y /* SFC controller solution */
## Chapter-8 RT_USING_SNOR_SPI_HOST=y /* SPI controller solution */
## Chapter-8 RT_SNOR_SPI_DEVICE_NAME="spi2_0" /* SPI controller solution, specify the target controller */
```

Unterstützung des elm-fat-Dateisystems in RT-Thread

```text
RT-Thread Components --->
    Device virtual file system  --->
    [*] Using device virtual file system
    [*]   Using mount table for file system /* Implement the corresponding registration partition table to enable automatic mounting of partitions at power-up */
    [*]   Enable elm-chan fatfs /* FAT file system */
        elm-chan's FatFs, Generic FAT Filesystem Module  --->
        (4096) Maximum sector size to be handled. /* Must be changed to 4096 for SPI Nor products */
```

Ist das automatische Einbinden partitionierter Dateisysteme aktiviert, können Sie die Registrierung in mnt.c ergänzen. Beispiel: Partition "root" unter "/" einbinden:

```text
const struct dfs_mount_tbl mount_table[] =
{
    {"root", "/", "elm", 0, 0},
    {0}
};
```

Für einen eigenen Mount-Ablauf können Sie das Dateisystem auch mit folgendem Code einbinden:

```text
dfs_mount("root", "/", "elm", 0, 0)
```

Mit folgendem Befehl prüfen Sie, ob die entsprechende Partition erfolgreich registriert wurde:

```text
msh />list_device
device          type         ref count
------- -------------------- ----------
root     Block Device         1            /* Partition name is root, partition type is block device, Nor flash supports setting.ini to modify the setting to MTD device */
snor     MTD Device           0            /* SPI Nor root storage device, partition read and write ultimately access this node to complete read, write, and erase */
```

#### 8.3.3 Kernel

Die Verwendung von SPI FLASH im Kernel beschreibt "Rockchip_Developer_Guide_Linux_Flash_Open_Source_Solution_EN.pdf".

### 8.4 GMAC

#### 8.4.1 HAL

RK HAL stellt grundlegende GMAC-Treiber sowie Lese- und Schreiboperationen für standardisierte PHY-Register bereit. Der Treiberquellcode liegt unter hal/lib/hal/src/gmac .

Konfiguration: Beachten Sie die GMAC-Konfiguration des jeweiligen SoC im TRM.

```text
#define HAL_GMAC_MODULE_ENABLED        /* GMAC driver support*/
#define HAL_GMAC1000_MODULE_ENABLED    /* GMAC1000 driver support*/
```

Ein Beispiel zur Schnittstellennutzung steht in hal/test/hal/test_gmac.c .

Die GMAC-Konfiguration in HAL umfasst im Wesentlichen:

1. IOMUX konfigurieren

2. Tabelle GMAC_ETH_CONFIG konfigurieren

3. Interrupt GMAC0_IRQn in der Interrupttabelle konfigurieren

Beispiel RK3562:

```text
/* Configure IOMUX */
static void GMAC_Iomux_Config(uint8_t id)
{
    /* GMAC0 iomux */
    HAL_PINCTRL_SetIOMUX(GPIO_BANK3,
                         GPIO_PIN_A0 | /* RGMII_RSTn */
                         GPIO_PIN_A1 , /* RGMII_INT/PMEB_M0 */
                         PIN_CONFIG_MUX_FUNC0);
    HAL_GPIO_SetPinDirection(GPIO3, GPIO_PIN_A1, GPIO_IN);
    HAL_GPIO_SetPinDirection(GPIO3, GPIO_PIN_A0, GPIO_OUT);
    HAL_GPIO_SetPinLevel(GPIO3, GPIO_PIN_A0, GPIO_HIGH);
    HAL_PINCTRL_SetIOMUX(GPIO_BANK3,
                         GPIO_PIN_D4 | /* RGMII_TXD2_M0 */
                         GPIO_PIN_D5 | /* RGMII_TXD3_M0 */
                         GPIO_PIN_D6 | /* RGMII_TXCLK_M0 */
                         GPIO_PIN_D7 , /* RGMII_RXD2_M0 */
                         PIN_CONFIG_MUX_FUNC2);
    HAL_PINCTRL_SetIOMUX(GPIO_BANK4,
                         GPIO_PIN_A0 | /* RGMII_RXD3_M0 */
                         GPIO_PIN_A1 | /* RGMII_RXCLK_M0 */
                         GPIO_PIN_A2 | /* RGMII_TXD0_M0 */
                         GPIO_PIN_A3 | /* RGMII_TXD1_M0 */
                         GPIO_PIN_A4 | /* RGMII_TXEN_M0 */
                         GPIO_PIN_A5 | /* RGMII_RXD0_M0 */
                         GPIO_PIN_A6 | /* RGMII_RXD1_M0 */
                         GPIO_PIN_A7 | /* RGMII_RXDV_M0 */
                         GPIO_PIN_B1 | /* ETH_CLK_25M_OUT_M0 */
                         GPIO_PIN_B2 | /* RGMII_MDC_M0 */
                         GPIO_PIN_B3 | /* RGMII_MDIO_M0 */
                         GPIO_PIN_B7 , /* RGMII_CLK_M0 */
                         PIN_CONFIG_MUX_FUNC2);
}
/* Configure the GMAC_ETH_CONFIG table */
static struct GMAC_ETH_CONFIG ethConfigTable[] =
{
    {
        .halDev = &g_gmac0Dev,
        .mode = PHY_INTERFACE_MODE_RGMII,
        .maxSpeed = 1000,
        .phyAddr = 0,                        /* PHY address */
        .extClk = false,                     /* true if clock input is provided by PHY */
        .resetGpioBank = GPIO3,              /* PHY reset pin */
        .resetGpioNum = GPIO_PIN_A0,
        .resetDelayMs = { 0, 20, 100 },      /* PHY reset timing */
        .txDelay = 0x3C,
        .rxDelay = 0,
    },
};
/* Configure the GMAC0_IRQn interrupt in the interrupt table */
static struct GIC_AMP_IRQ_INIT_CFG irqsConfig[] = {
/* TODO: Config the irqs here. * GIC version: GICv2 * The priority higher than 0x80 is non-secure interrupt. */
    GIC_AMP_IRQ_CFG_ROUTE(GMAC0_IRQn, 0xd0, CPU_GET_AFFINITY(0, 0)),
};
```

#### 8.4.2 RT-Thread

Konfiguration: Eintrag in menuconfig:

```text
RT-Thread rockchip RK3562 drivers  --->
    Enable GMAC  --->
    [*] Enable GMAC
    [*]   Enable GMAC0
RT_USING_GMAC=y          /* Enable GMAC configuration */
RT_USING_GMAC0=y         /* Enable GMAC0 configuration */
```

Die GMAC-Konfiguration in RT-Thread umfasst im Wesentlichen:

1. IOMUX konfigurieren

2. Tabelle rockchip_eth_config konfigurieren

3. Interrupt GMAC0_IRQn in der Interrupttabelle konfigurieren (bei SMP-Systemen nicht erforderlich)

Beispiel RK3562:

```text
/* Configure IOMUX */
RT_WEAK void gmac0_m0_iomux_config(void)
{
    /* GMAC0 iomux */
    HAL_PINCTRL_SetIOMUX(GPIO_BANK3,
                         GPIO_PIN_A0 | /* RGMII_RSTn */
                         GPIO_PIN_A1,  /* RGMII_INT/PMEB_M0 */
                         PIN_CONFIG_MUX_FUNC0);
    HAL_GPIO_SetPinDirection(GPIO3, GPIO_PIN_A1, GPIO_IN);
    HAL_GPIO_SetPinDirection(GPIO3, GPIO_PIN_A0, GPIO_OUT);
    HAL_GPIO_SetPinLevel(GPIO3, GPIO_PIN_A0, GPIO_HIGH);
    HAL_PINCTRL_SetIOMUX(GPIO_BANK3,
                         GPIO_PIN_D4 | /* RGMII_TXD2_M0 */
                         GPIO_PIN_D5 | /* RGMII_TXD3_M0 */
                         GPIO_PIN_D6 | /* RGMII_TXCLK_M0 */
                         GPIO_PIN_D7,  /* RGMII_RXD2_M0 */
                         PIN_CONFIG_MUX_FUNC2);
    HAL_PINCTRL_SetIOMUX(GPIO_BANK4,
                         GPIO_PIN_A0 | /* RGMII_RXD3_M0 */
                         GPIO_PIN_A1 | /* RGMII_RXCLK_M0 */
                         GPIO_PIN_A2 | /* RGMII_TXD0_M0 */
                         GPIO_PIN_A3 | /* RGMII_TXD1_M0 */
                         GPIO_PIN_A4 | /* RGMII_TXEN_M0 */
                         GPIO_PIN_A5 | /* RGMII_RXD0_M0 */
                         GPIO_PIN_A6 | /* RGMII_RXD1_M0 */
                         GPIO_PIN_A7 | /* RGMII_RXDV_M0 */
                         GPIO_PIN_B1 | /* ETH_CLK_25M_OUT_M0 */
                         GPIO_PIN_B2 | /* RGMII_MDC_M0 */
                         GPIO_PIN_B3 | /* RGMII_MDIO_M0 */
                         GPIO_PIN_B7,  /* RGMII_CLK_M0 */
                         PIN_CONFIG_MUX_FUNC2);
}
/* Configure the rockchip_eth_config table */
const struct rockchip_eth_config rockchip_eth_config_table[] =
{
    {
        .halDev = &g_gmac0Dev,
        .mode = PHY_INTERFACE_MODE_RGMII,
        .maxSpeed = 1000,
        .phyAddr = 0,                        /* PHY address */
        .extClk = false,                     /* true if clock input is provided by PHY */
        .resetGpioBank = GPIO3,              /* PHY reset pin */
        .resetGpioNum = GPIO_PIN_A0,
        .resetDelayMs = { 0, 20, 100 },      /* PHY reset timing */
        .txDelay = 0x3C,
        .rxDelay = 0,
    },
};
```

RT-Thread unterstützt LWIP. Aktivieren Sie die entsprechenden Funktionen über scons --menuconfig .

Eintrag in menuconfig:

```text
RT-Thread Components  --->
    Network  --->
    [*] LwIP: light weight TCP/IP stack  --->
    --- LwIP: light weight TCP/IP stack
    [ ]   Use LwIP local version only (NEW)
    LwIP version (LwIP v2.0.3)  --->
    [ ]   IPV6 protocol (NEW)
    (4)   Memory alignment (NEW)
    [*]   IGMP protocol (NEW)
    -*-   ICMP protocol
    [ ]   SNMP protocol (NEW)
    [*]   Enable DNS for name resolution (NEW)
    [*]   Enable alloc IP address through DHCP (NEW)
    (1)     SOF broadcast (NEW)
    (1)     SOF broadcast recv (NEW)
    Static IPv4 Address  --->
NETDEV_USING_PING=y
RT_USING_LWIP=y
RT_USING_LWIP203=y
RT_USING_LWIP_VER_NUM=0x20003
RT_LWIP_MEM_ALIGNMENT=4
RT_LWIP_IGMP=y
RT_LWIP_ICMP=y
RT_LWIP_DNS=y
#Enable DHCP, static IP does not need to be configured
RT_LWIP_DHCP=y
IP_SOF_BROADCAST=1
IP_SOF_BROADCAST_RECV=1
/* Static IPv4 Address */
RT_LWIP_IPADDR="XXX.XXX.XXX.XXX"
RT_LWIP_GWADDR="XXX.XXX.XXX.XXX"
RT_LWIP_MSKADDR="XXX.XXX.XXX.XXX"
RT_LWIP_UDP=y
RT_LWIP_TCP=y
RT_LWIP_RAW=y
RT_MEMP_NUM_NETCONN=8
RT_LWIP_PBUF_NUM=16
RT_LWIP_RAW_PCB_NUM=4
RT_LWIP_UDP_PCB_NUM=4
RT_LWIP_TCP_PCB_NUM=4
RT_LWIP_TCP_SEG_NUM=40
RT_LWIP_TCP_SND_BUF=8196
RT_LWIP_TCP_WND=8196
RT_LWIP_TCPTHREAD_PRIORITY=10
RT_LWIP_TCPTHREAD_MBOX_SIZE=8
RT_LWIP_TCPTHREAD_STACKSIZE=1024
RT_LWIP_ETHTHREAD_PRIORITY=12
RT_LWIP_ETHTHREAD_STACKSIZE=1024
RT_LWIP_ETHTHREAD_MBOX_SIZE=8
LWIP_NETIF_STATUS_CALLBACK=1
LWIP_NETIF_LINK_CALLBACK=1
SO_REUSE=1
LWIP_SO_RCVTIMEO=1
LWIP_SO_SNDTIMEO=1
LWIP_SO_RCVBUF=1
LWIP_SO_LINGER=0
LWIP_NETIF_LOOPBACK=0
RT_LWIP_USING_PING=y
```

Nach Aktivieren von ping prüfen Sie zunächst den Anschluss des Netzwerkkabels und testen anschließend die Verbindung mit "ping":

```text
## Chapter-8 Successful network connection log information
[(1)3.357.573] e0: 100M
[(1)3.357.592] e0: full duplex
[(1)3.357.610] e0: flow control off
[(1)3.357.811] e0: link up.
## Chapter-8 Sending ping packets to the gateway and execution results
msh >ping 192.168.31.1
[(1)52.351.270] 60 bytes from 192.168.31.1 icmp_seq=0 ttl=64 time=0 ms
[(1)53.355.786] 60 bytes from 192.168.31.1 icmp_seq=1 ttl=64 time=0 ms
[(1)54.361.215] 60 bytes from 192.168.31.1 icmp_seq=2 ttl=64 time=0 ms
[(1)55.366.645] 60 bytes from 192.168.31.1 icmp_seq=3 ttl=64 time=0 ms
```

#### 8.4.3 Kernel

Die Verwendung von GMAC im Kernel beschreibt "Rockchip_Developer_Guide_Linux_GMAC_Mode_Configuration_CN.pdf".

Wird bei Linux + RT_Thread GMAC unter RT_Thread verwendet, muss der Kernel den betreffenden GMAC im DTS deaktivieren und dessen Takte deklarieren. Beispiel RK3562:

```text
/ {
       rockchip_amp: rockchip-amp {
           compatible = "rockchip,amp";
           clocks = <&cru FCLK_BUS_CM0_CORE>, <&cru CLK_BUS_CM0_RTC>,
           # GMAC clock declaration
           <&cru PCLK_GMAC>, <&cru ACLK_GMAC>, <&cru CLK_GMAC_125M_CRU_I>,
           <&cru CLK_GMAC_50M_CRU_I>, <&cru CLK_GMAC_ETH_OUT2IO>,
           <&cru SCLK_UART7>, <&cru PCLK_UART7>, <&cru PCLK_TIMER>,
           <&cru CLK_TIMER4>, <&cru CLK_TIMER5>;
           pinctrl-names = "default";
           pinctrl-0 = <&uart7m1_xfer>;
           amp-cpu-aff-maskbits = /bits/ 64 <0x0 0x1 0x1 0x2 0x2 0x4 0x3 0x8>;
           amp-irqs = /bits/ 64 <GIC_AMP_IRQ_CFG_ROUTE(147, 0xd0, CPU_GET_AFFINITY(3, 0))
                             # GMAC interrupt configuration
                             GIC_AMP_IRQ_CFG_ROUTE(105, 0xd0, CPU_GET_AFFINITY(3, 0))>;
           status = "okay";
        };
&gmac0 {
       status = "disabled";
};
```

### 8.5 PCIE

Unter Bare-metal oder RT_Thread werden nur folgende Grundfunktionen unterstützt:

Zugriff auf Controllerregister

CPU-Zugriff auf Peripherie, hauptsächlich Bar- und CFG-Bereiche

uDMA-Übertragung

Legacy-Interrupts INTx

#### 8.5.1 HAL / RT-Thread

Der Testcode liegt unter hal/test/hal/test_pcie.c

Eine ausführliche Beschreibung finden Sie in hal/doc/guides/Rockchip_User_Guide_HAL_PCIe_CN.md .

### 8.6 CPU Cache ECC

RK3568 unterstützt Cache ECC: Einzelbitfehler können erkannt und korrigiert werden; Doppelbitfehler können erkannt und protokolliert, aber nicht korrigiert werden. Zur Funktionsprüfung lassen sich Fehler manuell einspeisen.

#### 8.6.1 RT-Thread

Cache-ECC-Operationen müssen in einer sicheren Umgebung stattfinden und erfordern eine Bewertung durch den Anwender. Bedienung und Konfiguration beschreibt "Rockchip_Developer_Guide_RT-Thread_CacheECC_EN.pdf".

### 8.7 DDR ECC

RK3568 unterstützt DDR ECC (Sideband ECC) zur Fehlererkennung und -korrektur von DDR-Daten mit SEC/DED ECC. Einzelbitfehler werden erkannt und korrigiert, Doppelbitfehler erkannt und protokolliert, aber nicht korrigiert. Zur Funktionsprüfung lassen sich Fehler manuell einspeisen.

#### 8.7.1 HAL

Bedienung und Konfiguration unter HAL beschreibt "Rockchip_Developer_Guide_HAL_DDR_ECC_EN.pdf".

#### 8.7.2 Kernel

Bedienung und Konfiguration unter Linux beschreibt Rockchip-Developer- Guide-DDR-CN.pdf.

## 9. Kapitel 9: Fehlersuche

### 9.1 Debugging über die serielle Schnittstelle

Die Standardkonfiguration der seriellen Debug-Schnittstelle des heterogenen Mehrkernsystems von Rockchip lautet:

| Baudrate | Datenbits | Stoppbits | Parität | Flusssteuerung |
| --- | --- | --- | --- | --- |
| 1500000 | 8 | 1 | keine | keine |

Verwandter Abschnitt: Kapitel 8, Build-Konfiguration

#### 9.1.1 Boot-Ausgabe von U-Boot

Beim Start des heterogenen Mehrkernsystems auf RK3562 wird die Firmware für CPU3 beispielsweise an RAM-Adresse 0x01800000 geladen:

```text
AMP: Brought up cpu[3] with state 0x10, entry 0x01800000 ...OK
```

#### 9.1.2 Boot-Ausgabe von RK HAL

```text
*****************************************
  Hello RK3562 Bare-metal using RK_HAL!
       Rockchip Electronics Co.Ltd
              CPI_ID(3)
*****************************************
[(3)0.671.983] CPU(3) Initial OK!
```

#### 9.1.3 Boot-Ausgabe von RT-Thread

```text
 \ | /
- RT -     Thread Operating System
 / | \     4.1.1 build Apr 12 2024 20:28:35
 2006 - 2022 Copyright by RT-Thread team
```

### 9.2 AP-Debugging mit OpenOCD

Der AP unterstützt Debugging mit OpenOCD. Als Hardware dient eine von Rockchip entwickelte JTAG-Miniplatine. Unterstützt werden Einzelschritte, Haltepunkte, Datenüberwachung sowie Register- und Speicherabbilder. Einzelheiten stehen im Abschnitt zur Entwicklung und Fehlersuche über JTAG und SWD.

#### 9.2.1 Windows-Umgebung einrichten

##### 9.2.1.1 Softwareinstallation

1. OpenOCD-Entwicklungsumgebung installieren

Das OpenOCD-Entwicklungspaket heißt openocd_eclipse-2020-09.zip . Entpacken Sie es in das gewünschte Verzeichnis. Verzeichnis des RK-Pakets:

```text
.
├── eclipse-workspace        # Workspace directory, Eclipse has set the workspace directory to this folder by default
├── OpenOCD                  # OpenOCD related files
│   ├── bat                  # Windows batch files, double-click to connect to the SoC directly
│   ├── bin                  # Contains openocd.exe and *gdb.exe
│   ├── doc                  # Driver installation documentation and usage documentation
│   └── tcl                  # Script files
└── SVD                      # Mainly used to view SoC registers
```

2. Für Eclipse erforderliche JRE installieren

Die JRE liegt im heruntergeladenen Materialpaket unter /Environment Setup Software/jdk_8.0.1310.11_64.exe . Installations- und Konfigurationsschritte beschreibt Rockchip_Developer_Guide_GNU_MCU_Eclipse_OpenOCD_CN.pdf aus diesem Paket.

3. JTAG-Treiber installieren

Der JTAG-Treiber liegt im Materialpaket unter /Environment Setup Software/zadig-2.7.exe . Installations- und Konfigurationsschritte beschreibt Rockchip_Developer_Guide_FT232H_USB2JTAG.pdf aus diesem Paket.

##### 9.2.1.2 Hardwareanschluss

FT232H ist ein SoC von "Future Technology Devices International Ltd". Er kommuniziert über USB mit dem Computer und stellt JTAG- und SWD-Funktionen bereit.

![Rockchip-AMP-Originalabbildung: 9.2.1.2 Hardwareanschluss — Seite 125](/docs/rockchip-amp/assets/en-p125-fig01.png)

Die FT232H-Miniplatine ist oben abgebildet:

LED-Anzeigen: LED1 zeigt die Versorgung an; LED2 aus bedeutet nicht verbunden, blinkend bedeutet verbunden; LED3 ist derzeit nicht definiert.

ARM-20PIN-JTAG-Schnittstelle

USB-Schnittstelle: zwei Varianten, TYPEC und Mini-USB

DIP-Schalter

Im SWD-Modus: 1, 3, 5 aus; 2, 4, 6 ein

Im JTAG-Modus: 1, 3, 5 ein; 2, 4, 6 aus

Stiftleiste VCC, TCS, TCK, GND: Verbindung zum Board über einzelne Leitungen möglich

Stiftleiste 3.3V, VCCIO, 1.8V: VCCIO muss mit einem Jumper an 3.3V oder 1.8V angeschlossen werden; ohne diese Verbindung funktioniert JTAG nicht.

#### 9.2.2 Anwendungsbeispiel

OpenOCD-Entwicklungsumgebung am Beispiel RK3562 einrichten:

1. Erstellen Sie gemäß "Rockchip_Developer_Guide_GNU_MCU_Eclipse_OpenOCD_CN.pdf" eine Konfiguration für den Ziel-SoC.

2. Starten Sie eclipse.exe, öffnen Sie "Debug Configurations" und den Reiter "Debugger". Ergänzen Sie unter "Config options":

```text
-c "set SMPMASK 0x8"                   # 0x8 represents CPU3, configure CPU3 to run
RT_Thread
-r rk3562                              # Specify the SoC
-c "cpu3 configure -rtos RT_Thread"    # Specify CPU3 to run RT_Thread
-c "adapter speed 15000"               # JTAG TCK rate, unit KHz
```

![Rockchip-AMP-Originalabbildung: 9.2.2 Anwendungsbeispiel — Seite 126](/docs/rockchip-amp/assets/en-p126-fig01.png)

3. Öffnen Sie in "Debug Configurations" den Reiter Source und bearbeiten Sie "Path Mapping: New Mapping". Ergänzen oder ändern Sie den Projektpfad des RK356x AMP SDK:

```text
<AMP_SDK>/hal/         # Project path for GCC compilation
D:<AMP_SDK>\hal        # Project path for source code debugging tracking under Windows
```

![Rockchip-AMP-Originalabbildung: 9.2.2 Anwendungsbeispiel — Seite 126](/docs/rockchip-amp/assets/en-p126-fig02.png)

Die beiden Pfade verweisen tatsächlich auf dasselbe Verzeichnis. &lt;AMP_SDK&gt;/rk3562/hal/ ist die für die Symboltabellenauflösung benötigte Pfadangabe. D:&lt;AMP_SDK&gt;\hal\ ist der Pfad zum Laden des Quellcodes unter Windows. Stellen Sie außerdem sicher, dass die Firmware auf dem Entwicklungsboard mit dem Debug-Code übereinstimmt.

4. Klicken Sie nach der Konfiguration in "Debug Configurations" auf "Debug". Die Debug-Ausgaben erscheinen im Fenster "Debugger Console":

![Rockchip-AMP-Originalabbildung: 9.2.2 Anwendungsbeispiel — Seite 127](/docs/rockchip-amp/assets/en-p127-fig01.png)

Fügen Sie im Console-Fenster mit folgenden Befehlen die *.elf-Dateien der 4 CPUs hinzu:

```text
    # ......
    For help, type "help".
    Type "apropos word" to search for commands related to "word".
    # ......
    add-symbol-file D:/rk3562/hal/project/rk3562/GCC/0_TestDemo.elf
    add-symbol-file D:/rk3562/hal/project/rk3562/GCC/1_TestDemo.elf
    add-symbol-file D:/rk3562/hal/project/rk3562/GCC/2_TestDemo.elf
    add-symbol-file D:/rk3562/hal/project/rk3562/GCC/3_TestDemo.elf
```

### 9.3 MCU-Debugging mit Ozone

#### 9.3.1 Windows-Umgebung einrichten

Ozone ist ein verbreitetes Embedded-Debugging-Werkzeug mit grafischer Oberfläche. Zusammen mit J-Link-Hardware ermöglicht es Echtzeit-Codeverfolgung, Einzelschritte und mehrere Haltepunkte. Offizielle Website: Ozone – The Performance Analyzer (segger.com). Der Anbieter unterscheidet kommerzielle und nicht kommerzielle Lizenzen. Wählen Sie die zur tatsächlichen Verwendung passende Lizenz.

![Rockchip-AMP-Originalabbildung: 9.3.1 Windows-Umgebung einrichten — Seite 128](/docs/rockchip-amp/assets/en-p128-fig01.png)

Beispiel RK3562:

1. Verbinden Sie J-Link mit dem Entwicklungsboard und öffnen Sie Ozone. Die Projektkonfiguration erscheint standardmäßig; alternativ wählen Sie File->New->New Project Wizard.

![Rockchip-AMP-Originalabbildung: 9.3.1 Windows-Umgebung einrichten — Seite 129](/docs/rockchip-amp/assets/en-p129-fig01.png)

![Rockchip-AMP-Originalabbildung: 9.3.1 Windows-Umgebung einrichten — Seite 130](/docs/rockchip-amp/assets/en-p130-fig01.png)

Wählen Sie das angeschlossene J-Link-Gerät im roten Rahmen.

![Rockchip-AMP-Originalabbildung: 9.3.1 Windows-Umgebung einrichten — Seite 131](/docs/rockchip-amp/assets/en-p131-fig01.png)

![Rockchip-AMP-Originalabbildung: 9.3.1 Windows-Umgebung einrichten — Seite 132](/docs/rockchip-amp/assets/en-p132-fig01.png)

2. Zieldatei laden: Laden Sie mit Ozone die Zieldatei, normalerweise das erzeugte ausführbare Programm, in den Debugger. Liegt das RK-HAL-Repository unter Linux und Ozone unter Windows, binden Sie zunächst den Linux-Pfad als Netzlaufwerk ein, beispielsweise "/home/xxx" als "Z:". Ordnen Sie dann über die Befehlszeile links unten in Ozone den Projektpfad mit folgendem Befehl zu. "/home/xxx" ist der unter Windows eingebundene Linux-Pfad und "Z:" der zugehörige Windows-Pfad.

```text
Project.AddPathSubstitute "/home/xxx" "Z:"
```

Nach diesen Schritten erscheint die folgende Ozone-Oberfläche.

![Rockchip-AMP-Originalabbildung: 9.3.1 Windows-Umgebung einrichten — Seite 133](/docs/rockchip-amp/assets/en-p133-fig01.png)

Die Schaltflächen im roten Rahmen steuern das Debugging und ermöglichen Einzelschritte. Haltepunkte können direkt im Codefenster gesetzt werden.

## 10. Kapitel 10: Demos

### 10.1 Leistungstests

#### 10.1.1 Ganzzahlleistung

CoreMark ist ein Benchmark zur Bewertung der CPU-Leistung, insbesondere der Ganzzahlverarbeitung. Er liefert einen einzelnen Zahlenwert zum schnellen Vergleich verschiedener Prozessoren und dient der Bewertung von MCUs und CPUs in eingebetteten Systemen. Die folgende Tabelle enthält die Coremark-Testdaten der Quelle für verschiedene Plattformen:

| Prozessor | RK3568 AP HAL | RK3562 AP HAL | RK3562 MCU | RK3576 MCU |
| --- | --- | --- | --- | --- |
| Taktfrequenz | 816MHZ | 816MHZ |  |  |
| Betriebsmodus | DDR4<br>1560MHZ | DDR4<br>1332MHZ |  |  |
| Cache | Aktiviert | Aktiviert |  |  |
| TCM | Keine | Keine |  |  |
| Coremark | 3273 | 2387 |  |  |
| Coremark<br>/MHz | 4.0 | 2.92 |  |  |

Testverfahren unter Bare-metal:

Aktivieren Sie den Testcode mit folgenden Makros.

Codepfad: hal/project/rkxxx/src/main.c

```text
-//#define TEST_DEMO
+#define TEST_DEMO
```

Codepfad: hal/project/rkxxx/src/test_demo.c

```text
-//#define PERF_TEST
+#define PERF_TEST
```

Codepfad: /hal/middleware/benchmark/benchmark

```text
INCLUDES += -I"$(BENCHMARK_PATH)" -I"$(BENCHMARK_PATH)/coremark" -
I"$(BENCHMARK_PATH)/coremark/barebones" SRC_DIRS += $(BENCHMARK_PATH)
$(BENCHMARK_PATH)/coremark $(BENCHMARK_PATH)/coremark/barebones
```

Codepfad: /hal/middleware/benchmark/benchmark.h

```text
#define HAL_BENCHMARK_COREMARK
//#define HAL_BENCHMARK_LINPACK
//#define HAL_BENCHMARK_TINYMEMBENCH
```

#### 10.1.2 Gleitkommaleistung

Linpack prüft die Gleitkommaleistung. Die wichtigste Messgröße ist FLOPS, also die Anzahl der Gleitkommaoperationen pro Sekunde. Üblich ist die Angabe in MFLOPS (Millionen Gleitkommaoperationen pro Sekunde). Die folgende Tabelle enthält die Linpack-Testdaten der Quelle für verschiedene Plattformen:

| Prozessor | RK3568 AP HAL | RK3562 AP HAL | RK3562 MCU | RK3576 MCU |
| --- | --- | --- | --- | --- |
| Taktfrequenz | 816MHZ | 816MHZ |  |  |
| Betriebsmodus | DDR4<br>1560MHZ | DDR4<br>1332MHZ |  |  |
| Cache | Aktiviert | Aktiviert |  |  |
| TCM | Keine | Keine |  |  |
| Linpack<br>MFLOPS | 154.7 | 79.38 |  |  |

Testverfahren unter Bare-metal:

Aktivieren Sie den Testcode mit folgenden Makros.

Codepfad: hal/project/rkxxx/src/main.c

```text
-//#define TEST_DEMO
+#define TEST_DEMO
```

Codepfad: hal/project/rkxxx/src/test_demo.c

```text
-//#define PERF_TEST
+#define PERF_TEST
```

Codepfad: /hal/middleware/benchmark/benchmark.mk

```text
INCLUDES += -I"$(BENCHMARK_PATH)" -I"$(BENCHMARK_PATH)/linpack" SRC_DIRS +=
$(BENCHMARK_PATH) $(BENCHMARK_PATH)/linpack
```

Codepfad: /hal/middleware/benchmark/benchmark.h

```text
//#define HAL_BENCHMARK_COREMARK
#define HAL_BENCHMARK_LINPACK
//#define HAL_BENCHMARK_TINYMEMBENCH
```

#### 10.1.3 Speichertests

RTOS / Bare-metal verwendet tinymembench zur Prüfung der Speicherleistung. Dieses einfache Benchmarkwerkzeug bewertet unter anderem Speicherbandbreite, Latenz und zufällige Zugriffe. Die folgende Tabelle enthält die tinymembench-Testdaten der Quelle für verschiedene Plattformen:

| Prozessor | RK3568 AP HAL | RK3562 AP<br>HAL | RK3562<br>MCU | RK3576<br>MCU |
| --- | --- | --- | --- | --- |
| Taktfrequenz | 816MHZ | 816MHZ |  |  |
| Betriebsmodus | DDR4<br>1560MHZ | DDR4<br>1332MHZ |  |  |
| Cache | Aktiviert | Aktiviert |  |  |
| TCM | Keine | Keine |  |  |
| Speicherbandbreiten-<br>test | Detaildaten<br>siehe unten | Keine |  |  |
| Speicherlatenztest | Detaildaten<br>siehe unten | Keine |  |  |

RK3568-AP-HAL-Daten

```text
==========================================================================
== Memory bandwidth tests                                               ==
==                                                                      ==
== Note 1: 1MB = 1000000 bytes                                          ==
== Note 2: Results for 'copy' tests show how many bytes can be          ==
==         copied per second (adding together read and written           == ==         bytes would have provided twice higher numbers)              ==
== Note 3: 2-pass copy means that we are using a small temporary buffer ==
==         to first fetch data into it, and only then write it to the   ==
==         destination (source -> L1 cache, L1 cache -> destination)    ==
== Note 4: If sample standard deviation exceeds 0.1%, it is shown in    ==
==         brackets                                                     ==
==========================================================================
 C copy backwards                                     :   1673.8 MB/s
 C copy backwards (32 byte blocks)                    :   1687.0 MB/s
 C copy backwards (64 byte blocks)                    :   1673.8 MB/s
 C copy                                               :   1920.2 MB/s
 C copy prefetched (32 bytes step)                    :   1563.7 MB/s
 C copy prefetched (64 bytes step)                    :   1941.1 MB/s (0.1%)
 C 2-pass copy                                        :    995.7 MB/s
 C 2-pass copy prefetched (32 bytes step)             :   1036.3 MB/s
 C 2-pass copy prefetched (64 bytes step)             :   1007.0 MB/s
 C fill                                               :   3297.4 MB/s
 C fill (shuffle within 16 byte blocks)               :   3297.4 MB/s
 C fill (shuffle within 32 byte blocks)               :   3297.4 MB/s
 C fill (shuffle within 64 byte blocks)               :   3292.3 MB/s
 ---
 standard memcpy                                      :   1165.1 MB/s
 standard memset                                      :   3322.9 MB/s
 ---
 ARM fill (STM with 8 registers)                      :   3343.7 MB/s
 ARM fill (STM with 4 registers)                      :   3322.9 MB/s
==========================================================================
== Memory latency test                                                  ==
==                                                                      ==
== Average time is measured for random memory accesses in the buffers   ==
== of different sizes. The larger is the buffer, the more significant   ==
== are relative contributions of TLB, L1/L2 cache misses and SDRAM      ==
== accesses. For extremely large buffer sizes we are expecting to see   ==
== page table walk with several requests to SDRAM for almost every      ==
== memory access (though 64MiB is not nearly large enough to experience == == this effect to its fullest).                                         ==
==                                                                      ==
== Note 1: All the numbers are representing extra time, which needs to  ==
==         be added to L1 cache latency. The cycle timings for L1 cache ==
==         latency can be usually found in the processor documentation. ==
== Note 2: Dual random read means that we are simultaneously performing ==
==         two independent memory accesses at a time. In the case if    ==
==         the memory subsystem can't handle multiple outstanding       ==
==         requests, dual random read has the same timings as two       ==
==         single reads performed one after another.                    ==
==========================================================================
block size : single random read / dual random read
      1024 :    0.0 ns          /     0.0 ns
      2048 :    0.0 ns          /     0.0 ns
      4096 :    0.0 ns          /     0.0 ns
      8192 :    0.0 ns          /     0.0 ns
     16384 :    0.0 ns          /     0.0 ns
     32768 :   11.2 ns          /     0.3 ns
     65536 :   22.4 ns          /    32.7 ns
    131072 :   33.3 ns          /    43.9 ns
    262144 :   39.4 ns          /    47.2 ns
    524288 :   48.8 ns          /    56.1 ns
   1048576 :  176.3 ns          /   253.8 ns
   2097152 :  240.5 ns          /   317.2 ns
   4194304 :  272.0 ns          /   339.1 ns
   8388608 :  285.9 ns          /   328.5 ns
```

Testverfahren unter Bare-metal:

Aktivieren Sie den Testcode mit folgenden Makros.

Codepfad: hal/project/rkxxx/src/main.c

```text
-//#define TEST_DEMO
+#define TEST_DEMO
```

Codepfad: hal/project/rkxxx/src/test_demo.c

```text
-//#define PERF_TEST
+#define PERF_TEST
```

Codepfad: /hal/middleware/benchmark/benchmark.mk

```text
INCLUDES += -I"$(BENCHMARK_PATH)" -I"$(BENCHMARK_PATH)/tinymembench" SRC_DIRS +=
$(BENCHMARK_PATH) $(BENCHMARK_PATH)/tinymembench
```

Codepfad: /hal/middleware/benchmark/benchmark.h

```text
//#define HAL_BENCHMARK_COREMARK
//#define HAL_BENCHMARK_LINPACK
#define HAL_BENCHMARK_TINYMEMBENCH
```

#### 10.1.4 Interruptreaktionszeit

Verwenden Sie das in HAL integrierte Testdemo für Interruptlatenz. Die Interruptreaktionslatenz ist die Zeit vom Auftreten eines Interrupts bis zum Beginn seiner Verarbeitung. Sie bewertet damit die Interruptverarbeitungsleistung des Systems. Die folgende Tabelle enthält die Testdaten der Quelle für verschiedene Plattformen:

| Prozessor | RK3568 AP HAL | RK3562 AP HAL | RK3562 MCU | RK3576 MCU |
| --- | --- | --- | --- | --- |
| Taktfrequenz | 816MHZ | 816MHZ |  |  |
| Betriebsmodus | DDR4<br>1560MHZ | DDR4<br>1332MHZ |  |  |
| Cache | Aktiviert | Aktiviert |  |  |
| TCM | Keine | Keine |  |  |
| IRQ-Latenztest | avg = 3.42 us<br>max = 4.13 us<br>min = 3.21 us | avg = 1.543296 us<br>max = 2.916667 us<br>min = 0.875000 us |  |  |

Testverfahren unter Bare-metal:

Aktivieren Sie folgende Makros, um die Interruptreaktionslatenz im Bare-metal-System zu messen.

hal/project/rkxxx/src/main.c

```text
-//#define TEST_DEMO
+#define TEST_DEMO
```

hal/project/rkxxx/src/test_demo.c

```text
-//#define IRQ_LATENCY_TEST
+#define IRQ_LATENCY_TEST
```

### 10.2 Demo zur Echtzeitleistung

Dieses Demo zeigt am Beispiel RK3568 die Echtzeitleistung von Linux und RTOS in der AMP-Lösung. Es veranschaulicht deren Möglichkeiten zur Echtzeitdatenverarbeitung sowie die zugehörigen Funktionen und Werkzeuge.

#### 10.2.1 Testverfahren

Unter Linux ermittelt cyclictest Reaktionszeit und Latenz. Das Werkzeug kann aus den Paketquellen der Linux-Distribution oder von der offiziellen cyclictest-Website bezogen werden.

Unter RTOS werden Reaktionszeit und Latenz anhand von Interruptlatenztests bewertet. Beispielcode: hal/project/rk3568/src/test_demo.c

#### 10.2.2 Testprinzip

Ein oder mehrere Echtzeitthreads laufen mit einer festen Zykluszeit. Jeder Thread erfasst pro Zyklus die Zeit und berechnet die tatsächliche Zyklusdauer und Abweichung. Damit lassen sich Reaktionszeit und Latenz des Systems messen.

#### 10.2.3 Testergebnisse

Die Testausgabe enthält unter anderem die aktuelle und maximale Verzögerung pro Zyklus. Die Ergebnisse zeigt die folgende Abbildung:

![Rockchip-AMP-Originalabbildung: 10.2.3 Testergebnisse — Seite 140](/docs/rockchip-amp/assets/en-p140-fig01.png)

Die Ausgabe enthält beispielsweise folgende Kennzahlen:

Min: kleinste gemessene Zykluszeit.

Avg: mittlere gemessene Zykluszeit.

Max: größte gemessene Zykluszeit.

Now: aktuell erfasster Zeitwert.

Occurrence: Häufigkeit des jeweiligen Latenzintervalls.

Latency in us: Latenzintervall

Diese Kennzahlen bewerten die Echtzeitleistung des Systems. Je kleiner die maximale Verzögerung, desto besser die Echtzeitleistung.

## 11. Kapitel 11: Anhang

### 11.1 Begriffe und Erläuterungen

```text
Definition
```

| Abkürzung | Vollständiger Name | Definition |
| --- | --- | --- |
| OpenAMP | Open Asymmetric<br>Multi-Processing | Quelloffenes System für asymmetrische Mehrprozessorverarbeitung |
| AMP | Asymmetric Multi-<br>Processing | System für asymmetrische Mehrprozessorverarbeitung |
| HAL | Hardware<br>Abstraction Layer | Hardwareabstraktionsschicht |
| Bare-metal | Bare-metal | Entwicklungsbibliothek auf Grundlage der Hardwareabstraktionsschicht<br>für Bare-metal-Entwicklung. |
| MailBox | MailBox | Einfaches APB-Peripheriemodul zur Kommunikation zwischen CPUs und MCU-Kernen<br>über Interrupts, die durch Schreiboperationen erzeugt werden. |
| RPMsg | Remote Processor<br>Messaging | Protokoll zur Kommunikation zwischen Kernen eines<br>Mehrkernprozessors. |
| RTOS | Real-time Operating<br>System | Betriebssystem für Echtzeitanwendungen, die eine rechtzeitige<br>Reaktion auf Ereignisse verlangen. |
| RTT | RT-Thread | Quelloffenes Echtzeitbetriebssystem, hauptsächlich von der<br>chinesischen Open-Source-Gemeinschaft entwickelt. |
| SDK | Software<br>Development Kit | Sammlung von Entwicklungswerkzeugen zum Erstellen<br>von Anwendungen für ein bestimmtes Softwarepaket. |
| Linux | Linux | Freies, quelloffenes Unix-ähnliches Betriebssystem. |
| Kernel | Linux Kernel | Kern des Linux-Betriebssystems; verwaltet die Hardwareressourcen<br>des Rechners und stellt grundlegende Systemdienste bereit. |
| Hypervisor | Virtual Machine<br>Monitor | Software, Firmware oder Hardware zum Erstellen und Ausführen virtueller<br>Maschinen, die physische Hardwareressourcen gemeinsam nutzen. |
| Jailhouse | Jailhouse | Kleiner Hypervisor für die Entwicklung industrietauglicher<br>Anwendungen. |

### 11.2 Dokumentenverzeichnis

```text
Reference Document
```

| Referenzdokument | Beschreibung | Dokumentpfad |
| --- | --- | --- |
| Rockchip_Developer_Guide_FT232H_USB2JTAG.pdf | Einführung in die FHT232-<br>Miniplatine | openocd_eclipse-2020-<br>09\RK\OpenOCD\doc |
| Rockchip_Developer_Guide_GNU_MCU_Eclipse_OpenOCD_CN.pdf | OpenOCD-Bedienungsanleitung | openocd_eclipse-2020-<br>09\RK\OpenOCD\doc |
| Rockchip_Developer_Guide_UBoot_Nextdev_CN.pdf | U-Boot-Entwicklungs-<br>dokumentation | docs\cn\Common\UBOOT |
| Rockchip_Developer_Guide_Linux_AB_System_CN.pdf | Beschreibung der AB-Doppelpartition | docs\cn\Common\UBOOT |
| Rockchip_Developer_Guide_SDMMC_SDIO_eMMC_CN.pdf | eMMC-Bedienungsanleitung | docs\cn\Common\MMC |
| Rockchip_Developer_Guide_UART_CN.pdf | UART-Bedienungsanleitung | docs\cn\Common\UART |
| Rockchip_Developer_Guide_RT-Thread_SPIFLASH_CN.pdf | SPI-FLASH-Bedienungsanleitung | docs\cn\Common\NVM |

{% endraw %}
