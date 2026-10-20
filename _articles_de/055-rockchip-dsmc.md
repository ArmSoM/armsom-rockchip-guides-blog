---
title: "Rockchip-DSMC-Entwicklerhandbuch: DTS, PSRAM, Local Bus, Speicherzugriff und Fehlersuche"
description: "Vollständige Rockchip-DSMC-Referenz: Treiber und DTS, Kernel- und Benutzerraumzugriff, PSRAM-/Local-Bus-Adressräume, FIFO-/Registerkommunikation und Fehlersuche."
translation_key: "055-rockchip-dsmc"
slug: "055-rockchip-dsmc"
lang: "de"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["Rockchip", "DSMC"]
keywords: "ArmSoM Rockchip DSMC"
excerpt: "Vollständige Rockchip-DSMC-Referenz: Treiber und DTS, Kernel- und Benutzerraumzugriff, PSRAM-/Local-Bus-Adressräume, FIFO-/Registerkommunikation und Fehlersuche."
---

{% raw %}

# Rockchip-DSMC-Entwicklerhandbuch: DTS, PSRAM, Local Bus, Speicherzugriff und Fehlersuche

Diese vollständige technische Referenz folgt Rockchip V1.2.0. Der Geltungsbereich der Quelle umfasst RK3576 / RK3506 / RV1126B mit Kernel 6.10. Sie dient als ArmSoM-Plattformreferenz: Prüfen Sie die konkrete Platine, den SoC, den SDK-/BSP-Zweig, den Kernel und die Peripheriekonfiguration. Eine Hardwarevalidierung auf Platinenebene wurde nicht durchgeführt; eine Unterstützung auf jeder ArmSoM-Platine wird nicht vorausgesetzt.

Die chinesische Fassung folgt der 17-seitigen chinesischen PDF-Datei; die englische folgt der 19-seitigen englischen PDF-Datei, deren technischen Text die russische Fassung vollständig übersetzt. Auch die deutsche Fassung übersetzt den vollständigen englischen Artikel. Die chinesische Fassung verwendet Abbildungen aus der chinesischen Quelle; Englisch, Russisch und Deutsch verwenden Abbildungen aus der englischen PDF-Datei, einschließlich darin vorhandener chinesischer Oberflächenbeschriftungen. Widersprüche der Quelle und Extraktionskorrekturen sind in den [redaktionellen Hinweisen](/docs/rockchip-dsmc/EDITORIAL-NOTES.md) dokumentiert. Codekommentare und Ausgaben bleiben in ihrer Quellsprache.

**Betriebsrisiko:** DSMC-Abbildungen, direkte Speicherzugriffe und DMA können Busausnahmen, Datenverlust oder Startfehler verursachen. Adressen, Timings und Code bleiben als Quellenbeispiele erhalten; prüfen Sie den tatsächlichen Schaltplan, die Slave-Kapazität, die Einschalt-/Initialisierungsreihenfolge und das SDK. Die Kernelangabe 6.10 aus der Quelle wird nicht stillschweigend in eine andere Version geändert. Prüfbedürftige Codeprobleme sind in den redaktionellen Hinweisen dokumentiert. Es wurden keine Hardware-Lese- oder -Schreibzugriffe ausgeführt.

Offizielle Ressourcen: [ArmSoM](https://docs.armsom.org/), [Rockchip Linux](https://github.com/rockchip-linux).

| SoC | Kernel |
|---|---|
| RK3576 / RK3506 / RV1126B | kernel 6.10 |

<!-- Source EN PDF p.4, block 0 -->

## 1. Begriffe

<!-- Source EN PDF p.4, block 1 -->

DSMC: Double Data Rate Serial Memory Controller (serieller Speichercontroller mit doppelter Datenrate).

<!-- Source EN PDF p.4, block 2 -->

PSRAM: Pseudo static random access memory (pseudostatischer Speicher mit wahlfreiem Zugriff).

<!-- Source EN PDF p.4, block 3 -->

DPRAM: Dual Port Random Access Memory (Speicher mit zwei Zugriffsports).

<!-- Source EN PDF p.4, block 4 -->

## 2. Überblick

<!-- Source EN PDF p.4, block 5 -->

Der Double Data Rate Serial Memory Controller (DSMC) bietet hohe Bandbreite bei geringer Pinzahl, indem Befehls-, Adress- und Datenleitungen zeitlich multiplexiert werden. Daten werden sowohl an der steigenden als auch an der fallenden Flanke übertragen. Unterstützt werden Datenbreiten von x8 und x16 sowie bis zu 4 Chip-Selects. Die unterstützten Protokolle sind Hyperbus PSRAM, Xccela PSRAM und Local Bus. Bei Verwendung des Local-Bus-Protokolls muss das Slave-Gerät das von Rockchip entworfene Slave-Modell oder ein Gerät mit einem vergleichbaren Übertragungsprotokoll verwenden. Bei HYPERBUS-PSRAM- oder XCCELA-PSRAM-Protokollen werden PSRAM-Bausteine von Herstellern wie Winbond, AP Memory, Cypress und ISSI unterstützt.

<!-- Source EN PDF p.4, block 6 -->

## 3. DSMC-Treiber

<!-- Source EN PDF p.4, block 7 -->

### 3.1 Treiberdateien

<!-- Source EN PDF p.4, block 8 -->

Pfade der DSMC-Treiberdateien:

<!-- Source EN PDF p.4, block 9 -->

```text
drivers/memory/rockchip/dsmc-host.c /* Main driver program */
drivers/memory/rockchip/dsmc-controller.c /* The DSMC controller behavior configuration */
drivers/memory/rockchip/dsmc-lb-device.c /* The DSMC Local bus device */
```

<!-- Source EN PDF p.4, block 10 -->

### 3.2 DTS-Konfiguration

<!-- Source EN PDF p.4, block 11 -->

```text
    dsmc: dsmc@2a280000 {
        ...
        clock-frequency = <100000000>; /* DSMC interface frequency */
        ...
        /* Slave device properties */
        slave {
            rockchip,dqs-dll = <0x20 0x20 /* DQS0, DQS1 DLL delay for slave device cs0
*/
                   0x20 0x20 /* DQS0, DQS1 DLL delay for slave device cs1
*/
                   0x20 0x20 /* DQS0, DQS1 DLL delay for slave device cs2
*/
                   0x20 0x20>; /* DQS0, DQS1 DLL delay for slave device cs3
*/
            /*
             * rockchip,ranges: Base address and size of DSMC access to slave device memory;
             * If different CS have different memory space sizes, configure the largest.
             * rockchip,ranges = <0x0 0x10000000 0x0 0x2000000> means that if the slave is
             * PSRAM, allocate 0x2000000 memory size for each CS;
             * If the slave is Local Bus, allocate 0x2000000 memory size for each region
             */
            rockchip,ranges = <0x0 0x10000000 0x0 0x2000000>;
            rockchip,slave-dev = <&dsmc_slave>;
        };
    };
    dsmc_slave: dsmc_slave {
        compatible = "rockchip,dsmc-slave";
        rockchip,clk-mode = <0>; /* Clock mode, only for Local bus */
        status = "disabled";
        /*
         * Enable the corresponding slave device cs nodes when the slave
         * device is PSRAM (Hyperbus Psram or Xccela Psram).
         */
        psram {
            /*
             * When using PSRAM, there is no need to specify the bit width as
             * the driver automatically adapts it.
             */
            psram0 {
                status = "disabled"; /* If the slave device cs0 is PSRAM, change to "okay"
*/
            };
            psram1 {
                status = "disabled"; /* If the slave device cs1 is PSRAM, change to "okay"
*/
            };
            psram2 {
                status = "disabled"; /* If the slave device cs2 is PSRAM, change to "okay"
*/
            };
            psram3 {
                status = "disabled"; /* If the slave device cs3 is PSRAM, change to "okay"
*/
            };
        };
        /* Enable and configure the corresponding nodes if the slave is a Local bus device
*/
        lb-slave {
            rockchip,io-width = <16>; /* The data width of the local bus slave */
            dsmc_lb_slave0: lb-slave0 {
                rockchip,mtr-timing = <1 0 0 0 0 0 2 2>; /* The core timing, modifiable
according to slave design */
                rockchip,int-en = <0x0>; /* The current cs uses the interrupt sequence
number on the pin */
                status = "disabled";/* If the cs0 slave is a Local bus, change to "okay" */
                dsmc_p0_region: region {
                    dsmc_p0_region0: region0 {/* Attributes of this slave region0 */
                        rockchip,attribute = "Merged FIFO";/* The region0 is merged FIFO */
                        rockchip,ca-addr-width = <0>;/* CA transfer format, 0: 32bit, 1:
16bit */
                        rockchip,dummy-clk-num = <1>;/* Write transfer dummy clk cycle
number */
                        rockchip,cs0-be-ctrled = <0>;/* cs0 is controlled by cs1, cs2, cs3
*/
                        rockchip,cs0-ctrl = <0>; /* cs0 controls cs1, cs2, cs3 */
                        status = "disabled";
                    };
                    dsmc_p0_region1: region1 {/* Attributes of this slave region1 */
                        rockchip,attribute = "No-Merge FIFO";/* region1 is unmerged FIFO */
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p0_region2: region2 {/* Attributes of this slave region2 */
                        rockchip,attribute = "DPRA";/* region2 is DPRAM */
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p0_region3: region3 {/* Attributes of this slave region3 */
                        rockchip,attribute = "Register";/* region3 is register */
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                };
            };
            dsmc_lb_slave1: lb-slave1 {
                rockchip,mtr-timing = <1 0 0 0 0 0 2 2>; /* The core timing, modifiable
according to slave design */
                rockchip,int-en = <0x1>; /* The current cs uses the interrupt sequence
number on the pin */
                status = "disabled";/* If cs1 slave is a Local bus, change to "okay" */
                dsmc_p1_region: region {
                    dsmc_p1_region0: region0 {
                        rockchip,attribute = "Merged FIFO";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p1_region1: region1 {
                        rockchip,attribute = "No-Merge FIFO";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p1_region2: region2 {
                        rockchip,attribute = "DPRA";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p1_region3: region3 {
                        rockchip,attribute = "Register";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                };
            };
            dsmc_lb_slave2: lb-slave2 {
                rockchip,mtr-timing = <1 0 0 0 0 0 2 2>; /* The core timing, modifiable
according to slave design */
                rockchip,int-en = <0x2>; /* The current cs uses the interrupt sequence
number on the pin */
                status = "disabled";/* If cs2 slave is a Local bus, change to "okay" */
                dsmc_p2_region: region {
                    dsmc_p2_region0: region0 {
                        rockchip,attribute = "Merged FIFO";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p2_region1: region1 {
                        rockchip,attribute = "No-Merge FIFO";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p2_region2: region2 {
                        rockchip,attribute = "DPRA";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p2_region3: region3 {
                        rockchip,attribute = "Register";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                };
            };
            dsmc_lb_slave3: lb-slave3 {
                rockchip,mtr-timing = <1 0 0 0 0 0 2 2>; /* The core timing, modifiable
according to slave design */
                rockchip,int-en = <0x3>; /* The current cs uses the interrupt sequence
number on the pin */
                status = "disabled";/* If cs3 slave is a Local bus, change to "okay" */
                dsmc_p3_region: region {
                    dsmc_p3_region0: region0 {
                        rockchip,attribute = "Merged FIFO";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p3_region1: region1 {
                        rockchip,attribute = "No-Merge FIFO";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p3_region2: region2 {
                        rockchip,attribute = "DPRA";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p3_region3: region3 {
                        rockchip,attribute = "Register";
                    rockchip,ca-addr-width = <0>;
                    rockchip,dummy-clk-num = <1>;
                    rockchip,cs0-be-ctrled = <0>;
                    rockchip,cs0-ctrl = <0>;
                    status = "disabled";
                };
            };
        };
    };
};
```

<!-- Source EN PDF p.9, block 21 -->

Aktivieren Sie den zum tatsächlichen Slave-Gerätetyp passenden Knoten. Bei PSRAM-Geräten ist entsprechend der Nummer des auf der Leiterplatte angeschlossenen CS der zugehörige psramx-Knoten zu aktivieren. Ob Hyperbus- oder Xccela-PSRAM vorliegt, erkennt der Treiber automatisch. Ist das Slave-Gerät ein von RK entwickelter DSMC-Slave, aktivieren Sie entsprechend der angeschlossenen CS-Nummer den zugehörigen lb_slavex-Knoten. Zusätzlich muss die Konfiguration des zugehörigen Bereichs an die Eigenschaften des Slave-Geräts angepasst werden. Der Parameter clk-mode steuert die drei unterstützten Taktverhalten: clk-mode = 0 bedeutet, dass bei CS-High kein Takt und bei CS-Low ein Takt anliegt. clk-mode = 1 bedeutet, dass der Takt unabhängig von CS-Änderungen ständig anliegt, sodass das Slave-Gerät ihn als Referenztakt verwenden kann. In diesem Modus ist jedoch kein Hochfrequenzbetrieb möglich, und verschiedene einstellbare AC-Timingparameter stehen nicht zur Verfügung. clk-mode = 2 bedeutet, dass sowohl bei CS-High als auch bei CS-Low ein Takt anliegt, aber einige Taktzyklen vor und nach der CS-Umschaltflanke unterdrückt werden.

<!-- Source EN PDF p.9, block 22 -->

Für ein Local-Bus-Gerät ergibt sich folgender Speicherraum:

<!-- Source EN PDF p.9, block 23 -->

![Technische Originalabbildung — PDF S. 9](/docs/rockchip-dsmc/assets/en-p09-figure1.png)

Editierbare Übertragung der Abbildung:

| Bereich | CS0 | CS1 | CS2 | CS3 |
|---|---|---|---|---|
| 0 | FIFO (zusammengeführt) | FIFO (zusammengeführt) | FIFO (zusammengeführt) | FIFO (zusammengeführt) |
| 1 | FIFO (nicht zusammengeführt) | FIFO (nicht zusammengeführt) | FIFO (nicht zusammengeführt) | FIFO (nicht zusammengeführt) |
| 2 | DPRA | DPRA | DPRA | DPRA |
| 3 | Register | Register | Register | Register |

<!-- Source EN PDF p.9, block 24 -->

Der CS-Zugriffsraum jedes Slave-Geräts kann gleichmäßig in 1, 2 oder 4 Bereiche unterteilt werden. Dazu muss lediglich die entsprechende Eigenschaft „status“ des Bereichs in der Device-Tree-Source-Datei (DTS) aktiviert werden.

<!-- Source EN PDF p.9, block 25 -->

Die Eigenschaft rockchip,ranges, beispielsweise rockchip,ranges = `<0x0 0x10000000 0x0 0x2000000>`, konfiguriert Startadresse und Größe des Speicherraums im Slave-Gerät. Die Bedeutung der Werte hängt vom Peripherietyp ab.

<!-- Source EN PDF p.10, block 26 -->

Ist der Slave ein PSRAM, konfiguriert rockchip,ranges die Größe des maximalen CS-Speicherraums. Die Aufteilung für die einzelnen CS lautet:

<!-- Source EN PDF p.10, block 27 -->

![Technische Originalabbildung — PDF S. 10](/docs/rockchip-dsmc/assets/en-p10-figure1.png)

Editierbare Übertragung der Abbildung:

| CS | Anfangsgrenze | Nächste Grenze |
|---|---|---|
| cs0 | 0x10000000 | 0x12000000 |
| cs1 | 0x12000000 | 0x14000000 |
| cs2 | 0x14000000 | 0x16000000 |
| cs3 | 0x16000000 | 0x18000000 |

<!-- Source EN PDF p.10, block 28 -->

Ist der Slave ein Local-Bus-Gerät, konfiguriert rockchip,ranges die Größe des maximalen Bereichs. Wenn nur die beiden Bereiche Register und merged-FIFO aktiviert sind, ergibt sich für die Bereiche jedes CS folgende Aufteilung:

<!-- Source EN PDF p.10, block 29 -->

![Technische Originalabbildung — PDF S. 10](/docs/rockchip-dsmc/assets/en-p10-figure2.png)

Editierbare Übertragung der Abbildung:

| CS | Bereich | Anfangsgrenze | Nächste Grenze |
|---|---|---|---|
| cs0 | merged-FIFO | 0x10000000 | 0x12000000 |
| cs0 | Register | 0x12000000 | 0x14000000 |
| cs1 | merged-FIFO | 0x14000000 | 0x16000000 |
| cs1 | Register | 0x16000000 | 0x18000000 |
| cs2 | merged-FIFO | 0x18000000 | 0x1a000000 |
| cs2 | Register | 0x1a000000 | 0x1c000000 |
| cs3 | merged-FIFO | 0x1c000000 | 0x1e000000 |
| cs3 | Register | 0x1e000000 | 0x20000000 |

<!-- Source EN PDF p.11, block 30 -->

### 3.3 Kernelkonfiguration

<!-- Source EN PDF p.11, block 31 -->

```text
Symbol: ROCKCHIP_DSMC [=y]
       │
  │ Type : bool
       │
  │ Prompt: Rockchip DSMC(Double Data Rate Serial Memory Controller) driver
       │
  │ Depends on: MEMORY [=y]
       │
  │ Location:
       │
  │ -> Device Drivers
       │
  │ -> Memory Controller drivers (MEMORY [=y])
       │
  │ -> Rockchip DSMC(Double Data Rate Serial Memory Controller) driver (ROCKCHIP_DSMC
[=y])│
```

<!-- Source EN PDF p.11, block 32 -->

## 4. Zugriff auf DSMC im Kernelmodus

<!-- Source EN PDF p.11, block 33 -->

### 4.1 Aufruf der Treiberschnittstellen

<!-- Source EN PDF p.11, block 34 -->

Der DSMC-Treiber in drivers/memory/rockchip/dsmc-host.c implementiert folgende Zugriffsschnittstellen:

<!-- Source EN PDF p.11, block 35 -->

```text
struct rockchip_dsmc_device *rockchip_dsmc_find_dev(void);
static struct dsmc_ops rockchip_dsmc_ops = {
    .read = dsmc_read,
    .write = dsmc_write,
    .copy_from = dsmc_copy_from,
    .copy_from_state = dsmc_copy_from_state,
    .copy_to = dsmc_copy_to,
    .copy_to_state = dsmc_copy_to_state,
};
```

<!-- Source EN PDF p.12, block 36 -->

Durch Aufruf von rockchip_dsmc_find_device_by_compat() wird das DSMC-Gerät gesucht und dessen private Parameter werden ermittelt. CPU- und DMA-Zugriffe auf das DSMC-Slave-Gerät werden über dsmc_dev.ops umgesetzt. ops->read und ops->write dienen CPU-Lese- und -Schreibzugriffen auf den Speicherraum des DSMC-Slave-Geräts. ops->copy_from liest per DMA aus dem Slave-Speicher und schreibt in den Host-Speicher. ops->copy_to schreibt per DMA aus dem Host-Speicher in den Slave-Speicher.

<!-- Source EN PDF p.12, block 37 -->

```text
static void test(void)
{
    u32 cs;
    struct rockchip_dsmc_device *dsmc_dev;
    dsmc_dev = rockchip_dsmc_find_device_by_compat(rockchip_dsmc_get_compat(0));
    if (dsmc_dev == NULL){
        printk("error: can not find dsmc device\n");
        return 0;
    }
    for (cs = 0; cs < DSMC_MAX_SLAVE_NUM; cs++) {
        if (dsmc_dev->dsmc.cfg.cs_cfg[i].device_type == DSMC_UNKNOWN_DEVICE)
            continue;
        dsmc_dev->ops->write(dsmc_dev, cs, 0, test_addr, test_data);
        /* TODO */
    }
}
```

<!-- Source EN PDF p.12, block 38 -->

### 4.2 Direkter Zugriff

<!-- Source EN PDF p.12, block 39 -->

Die CPU oder der Master kann direkt auf den DSMC-Slave-Speicherraum zugreifen. Unterstützt werden wahlfreie Adresszugriffe für Byte, Halbwort und Wort sowie die Abbildungsarten cacheable, uncacheable und write-combine.

<!-- Source EN PDF p.12, block 40 -->

## 5. Zugriff auf DSMC im Benutzermodus

<!-- Source EN PDF p.12, block 41 -->

### 5.1 Zugriff über bestimmte Knoten

<!-- Source EN PDF p.12, block 42 -->

Bei aktiviertem Local Bus erstellt der DSMC-Treiber unter /dev/dsmc/ 4 CS-Knoten für Slave-Geräte. Unter jedem CS werden 4 Speicherbereiche angelegt, deren Eigenschaften den DTS-Beschreibungen entsprechen. Soll auf merged-FIFO zugegriffen werden, entspricht dies region0; hierzu muss der passende Bereichsknoten unter dem jeweiligen CS verwendet werden. Der Ablauf lautet:

<!-- Source EN PDF p.12, block 43 -->

1\. Öffnen Sie den entsprechenden Bereichs-Geräteknoten mit open() und ermitteln Sie den Dateideskriptor.

<!-- Source EN PDF p.12, block 44 -->

2\. Bilden Sie den genannten Gerätespeicherbereich mit dem Systemaufruf mmap() in den Prozessadressraum ab und ermitteln Sie die zugeordnete Adresse.

<!-- Source EN PDF p.12, block 45 -->

3\. Lesen und schreiben Sie den Gerätespeicher.

<!-- Source EN PDF p.12, block 46 -->

4\. Heben Sie die Speicherabbildung mit munmap() auf.

<!-- Source EN PDF p.13, block 47 -->

5\. Schließen Sie den Dateideskriptor mit close().

<!-- Source EN PDF p.13, block 48 -->

Das Codebeispiel lautet:

<!-- Source EN PDF p.13, block 49 -->

```text
device_name = "/dev/dsmc/cs0/region0"
wantbytes = 0x200000;
memfd = open(device_name, O_RDWR | O_SYNC);
if (memfd == -1) {
    fprintf(stderr, "failed to open %s for physical memory: %s\n",
        device_name, strerror(errno));
    exit(EXIT_FAILURE);
}
/*
 * Open the file with O_SYNC flag and MAP_LOCKED flag to make the
 * memory space uncached for mmap operation.
 */
buf = (void volatile *) mmap(0, wantbytes, PROT_READ | PROT_WRITE,
                                 MAP_SHARED | MAP_LOCKED, memfd,
                                 0x0);
if (buf == MAP_FAILED) {
        fprintf(stderr, "failed to mmap %s for physical memory: %s\n",
                device_name, strerror(errno));
        exit(EXIT_FAILURE);
}
bufsize = wantbytes;
halflen = bufsize / 2;
count = halflen / sizeof(u32);
bufa = (u32v *) buf;
bufb = (u32v *) ((size_t) buf + halflen);
test_dsmc(bufa, bufb, count);/* Read or write DSMC slave memory */
if (munmap((void*)buf, wantbytes) == -1) {
    perror("munmap");
    close(memfd);
    exit(EXIT_FAILURE);
}
close(memfd);
```

<!-- Source EN PDF p.13, block 50 -->

### 5.2 Direkter Zugriff

<!-- Source EN PDF p.13, block 51 -->

Die CPU kann direkt auf den durch dev/mem abgebildeten DSMC-Slave-Speicherraum zugreifen. Verwenden Sie beispielsweise auf RK3576 den io-Befehl, um auf region0 des DSMC-Slave-Speichers zuzugreifen: io -4 0x10000000.

<!-- Source EN PDF p.14, block 52 -->

## 6. Zuweisung des DSMC-Slave-Speichers

<!-- Source EN PDF p.14, block 53 -->

Die Zuweisung des Speicherraums für DSMC-Slaves wird durch die Eigenschaft rockchip,ranges gesteuert, die Startadresse und Größe des Gerätespeicherraums konfiguriert.

<!-- Source EN PDF p.14, block 54 -->

### 6.1 PSRAM

<!-- Source EN PDF p.14, block 55 -->

Wenn beispielsweise map, ranges = `<0x0 0x10000000 0x0 0x2000000>`; konfiguriert wird und der Slave ein PSRAM ist, bezeichnet map, ranges die Größe des maximalen CS-Speicherraums. Aus Sicht des DSMC-Controllers besitzt jeder Slave dieselbe Kapazität. Sind verschiedene Slaves mit PSRAM unterschiedlicher Kapazität bestückt, müssen beim Zugriff die jeweiligen Grenzen beachtet werden. Die Speicherraumzuweisung für die einzelnen Slaves lautet:

<!-- Source EN PDF p.14, block 56 -->

![Technische Originalabbildung — PDF S. 14](/docs/rockchip-dsmc/assets/en-p14-figure1.png)

Editierbare Übertragung der Abbildung:

| CS | Anfangsgrenze | Nächste Grenze |
|---|---|---|
| cs0 | 0x10000000 | 0x12000000 |
| cs1 | 0x12000000 | 0x14000000 |
| cs2 | 0x14000000 | 0x16000000 |
| cs3 | 0x16000000 | 0x18000000 |

<!-- Source EN PDF p.14, block 57 -->

Hinweis: Theoretisch unterstützt DSMC verschiedene Slaves mit PSRAM unterschiedlicher Hersteller und unterschiedlicher Kapazität. Die Bitbreite (x8 oder x16) muss jedoch bei allen Slaves gleich sein.

<!-- Source EN PDF p.14, block 58 -->

### 6.2 Local Bus

<!-- Source EN PDF p.14, block 59 -->

Auch bei Local Bus besitzt jeder Slave aus Sicht des DSMC-Controllers dieselbe Kapazität. Jeder Slave kann in 1, 2 oder 4 Bereiche mit Eigenschaften wie DPRAM, Register, merged FIFO und un-merged FIFO unterteilt werden. Unterscheiden sich die tatsächlichen Kapazitäten der Bereiche in den einzelnen Slaves, müssen beim Zugriff ihre Grenzen beachtet werden.

<!-- Source EN PDF p.15, block 60 -->

![Technische Originalabbildung — PDF S. 15](/docs/rockchip-dsmc/assets/en-p15-figure1.png)

Editierbare Übertragung der Abbildung:

| Bereich | CS0 | CS1 | CS2 | CS3 |
|---|---|---|---|---|
| 0 | FIFO (zusammengeführt) | FIFO (zusammengeführt) | FIFO (zusammengeführt) | FIFO (zusammengeführt) |
| 1 | FIFO (nicht zusammengeführt) | FIFO (nicht zusammengeführt) | FIFO (nicht zusammengeführt) | FIFO (nicht zusammengeführt) |
| 2 | DPRA | DPRA | DPRA | DPRA |
| 3 | Register | Register | Register | Register |

<!-- Source EN PDF p.15, block 61 -->

Bei Local Bus bezeichnet die Konfiguration map, ranges die Größe des maximalen Bereichs.

<!-- Source EN PDF p.15, block 62 -->

Sind beim Slave 2 Bereiche aktiviert, wird die Größe jedes Bereichs im DTS des DSMC-Knotens des Slave-Geräts durch map, ranges = 0x0 0x10000000 0x0 0x2000000 festgelegt. Die Speicherraumzuweisung der Bereiche innerhalb der einzelnen CS lautet:

<!-- Source EN PDF p.15, block 63 -->

![Technische Originalabbildung — PDF S. 15](/docs/rockchip-dsmc/assets/en-p15-figure2.png)

Editierbare Übertragung der Abbildung:

| CS | Bereich | Anfangsgrenze | Nächste Grenze |
|---|---|---|---|
| cs0 | merged-FIFO | 0x10000000 | 0x12000000 |
| cs0 | Register | 0x12000000 | 0x14000000 |
| cs1 | merged-FIFO | 0x14000000 | 0x16000000 |
| cs1 | Register | 0x16000000 | 0x18000000 |
| cs2 | merged-FIFO | 0x18000000 | 0x1a000000 |
| cs2 | Register | 0x1a000000 | 0x1c000000 |
| cs3 | merged-FIFO | 0x1c000000 | 0x1e000000 |
| cs3 | Register | 0x1e000000 | 0x20000000 |

<!-- Source EN PDF p.16, block 64 -->

## 7. Datenaustausch zwischen Host und Slave über DSMC Local Bus

<!-- Source EN PDF p.16, block 65 -->

### 7.1 FIFO

<!-- Source EN PDF p.16, block 66 -->

Wenn DSMC das Local-Bus-Protokoll verwendet und mit einem von Rockchip entwickelten Slave verbunden ist, besitzt der Slave einen FIFO. Beim Zugriff auf einen Bereich mit der Eigenschaft „merged-FIFO“ oder „un-merged FIFO“ durchlaufen die vom Host übertragenen Daten den FIFO und werden anschließend in den Slave-Speicher, etwa DDR oder SRAM, geschrieben. Dieser FIFO ist nicht sichtbar; für den DSMC-Host gilt der DDR- oder SRAM-Speicherraum des Slaves als dessen Speicherraum. Alle über DSMC geschriebenen Daten gelangen letztlich in den Slave-Speicher. Bei der Verwendung müssen der Slave-Speicherraum verwaltet und die Datenkonsistenz sichergestellt werden.

<!-- Source EN PDF p.16, block 67 -->

### 7.2 Register

<!-- Source EN PDF p.16, block 68 -->

Wenn DSMC das Local-Bus-Protokoll verwendet und mit einem von Rockchip entwickelten Slave verbunden ist, gibt es einen Registerbereich namens „SLAVE_CSR Register“. Ein Zugriff auf einen Bereich mit der Eigenschaft „Register“ bedeutet einen Zugriff auf diesen Abschnitt von SLAVE_CSR Register. Er ermöglicht einen schnellen Informationsaustausch zwischen Host und Slave.

<!-- Source EN PDF p.16, block 69 -->

Für den Informationsaustausch verfügbare Register:

<!-- Source EN PDF p.16, block 70 -->

![Technische Originalabbildung — PDF S. 16](/docs/rockchip-dsmc/assets/en-p16-figure1.png)

Editierbare Übertragung der Abbildung:

| APP_CONx | LBC_CONx |
|---|---|
| APP_CON0 | LBC_CON0 |
| APP_CON1 | LBC_CON1 |
| ... | ... |
| APP_CON14 | LBC_CON14 |
| APP_CON15 | LBC_CON15 |

<!-- Source EN PDF p.16, block 71 -->

Der Slave besitzt Lese- und Schreibrechte auf die APP_CONx-Register, der Host dagegen nur Leserechte. Auf die LBC_CONx-Register besitzt der Slave Leserechte, während der Host Lese- und Schreibrechte besitzt.

<!-- Source EN PDF p.16, block 72 -->

Schreibt der Host in die LBC_CONx-Register, löst dies einen host2slave-Interrupt an der Slave-CPU aus, der zur Verarbeitung der vom Host übertragenen Daten dient.

<!-- Source EN PDF p.16, block 73 -->

Schreibt der Slave in die APP_CONx-Register, löst dies über den INT-Pin einen slave2host-Interrupt aus, den der Host empfängt. Die Host-CPU kann darauf reagieren und die vom Slave übergebenen Daten abrufen. Nach Empfang des INT-Signals kann DSMC außerdem eine DMA-Hardwareanforderung auslösen, um die Datenübertragung zu starten. DMA muss zuvor konfiguriert werden.

<!-- Source EN PDF p.16, block 74 -->

Typisches Szenario 1

<!-- Source EN PDF p.16, block 75 -->

Der Host schreibt Informationen in die LBC_CONx-Register und löst einen host2slave-Interrupt aus. Der Slave liest die Informationen aus den LBC_CONx-Registern. Anschließend schreibt der Slave Informationen in die APP_CONx-Register und löst einen slave2host-Interrupt aus. Der Host liest die Informationen aus den APP_CONx-Registern.

<!-- Source EN PDF p.16, block 76 -->

Typisches Szenario 2

<!-- Source EN PDF p.17, block 77 -->

Nach der Konfiguration von DSMC und DMA auf der Hostseite benachrichtigt der Host den Slave durch Schreiben in die LBC_CONx-Register. Der Slave schreibt daraufhin in die APP_CONx-Register, um über den INT-Pin ein gültiges Signal an den Host zurückzugeben. Nach Empfang dieses Signals erzeugt der DSMC-Host eine DMA-Hardwareanforderung und startet damit die Datenübertragung.

<!-- Source EN PDF p.17, block 78 -->

Hinweis: APP_CON15 und LBC_CON15 werden bereits verwendet. Der DSMC-Treiber für DMA-Hardwareanforderungen ist implementiert. Nach Abschluss der DMA-Konfiguration schreibt der Host den ursprünglichen Wert von LBC_CON15 plus 1 in das Register LBC_CON15. Nach Empfang dieser Daten schreibt der Slave 1 in APP_CON15, um einen slave2host-Interrupt auszulösen. Der DSMC-Host erzeugt beim Empfang dieses Interrupts automatisch eine bestimmte Anzahl von DMA-Hardwareanforderungen und startet dadurch die Datenübertragung.

<!-- Source EN PDF p.17, block 79 -->

## 8. Hinweise

<!-- Source EN PDF p.17, block 80 -->

### 8.1 Schnittstellenfrequenz an den DSMC-IOs

<!-- Source EN PDF p.17, block 81 -->

1\. Sie wird durch den Parameter clock-frequency = `<100000000>`; im dsmc-Knoten des DTS konfiguriert. Aufgrund der Abhängigkeit vom PLL- oder Quarzoszillator-Ausgang der jeweiligen Plattform entspricht die tatsächliche Frequenz möglicherweise nicht exakt dem Sollwert. Eingestellt wird der nächstgelegene realisierbare Wert.

<!-- Source EN PDF p.17, block 82 -->

2\. Der DSMC-Controller besitzt einen fest eingebauten Teiler durch 2. Die von PLL oder Quarzoszillator an den DSMC-Controller gelieferte Frequenz ist somit doppelt so hoch wie die Frequenz an der DSMC-IO-Schnittstelle.

<!-- Source EN PDF p.17, block 83 -->

### 8.2 Hinweise zur DSMC-Bitbreite

<!-- Source EN PDF p.17, block 84 -->

1\. Die Bitbreite eines extern angeschlossenen DSMC-Slaves kann nicht automatisch erkannt werden. Standardmäßig geht der Code von x16 aus. Wird ein RK3506 als DSMC-Slave angeschlossen, der nur x8 unterstützt, muss die Bitbreite manuell korrigiert werden.

<!-- Source EN PDF p.17, block 85 -->

In der neuen Version kann io-width des Slaves im DTS geändert werden.

<!-- Source EN PDF p.17, block 86 -->

```text
&dsmc_slave {
    status = "okay";
    lb-slave {
        rockchip,io-width = <8>;
        ...
    };
};
```

<!-- Source EN PDF p.17, block 87 -->

In der alten Version muss die Änderung im Code erfolgen.

<!-- Source EN PDF p.18, block 88 -->

```text
diff --git a/drivers/memory/rockchip/dsmc-host.c b/drivers/memory/rockchip/dsmc-host.c
index 44182923acc9..5214c9128320 100644
--- a/drivers/memory/rockchip/dsmc-host.c
+++ b/drivers/memory/rockchip/dsmc-host.c
@@ -782,7 +782,7 @@ static void dsmc_data_init(struct rockchip_dsmc *dsmc)
                        cs_cfg->rd_bdr_xfer_en = 1;
                        cs_cfg->wr_bdr_xfer_en = 1;
                } else {
- cs_cfg->io_width = MCR_IOWIDTH_X16;
+ cs_cfg->io_width = MCR_IOWIDTH_X8;
                        cs_cfg->wrap_size = DSMC_BURST_WRAPSIZE_16CLK;
                        cs_cfg->wrap2incr_en = 1;
                        cs_cfg->acs = 1;
```

<!-- Source EN PDF p.18, block 89 -->

2\. Bei angeschlossenem PSRAM wird die Bitbreite automatisch erkannt und muss nicht manuell geändert werden. Unterstützt das PSRAM sowohl x8 als auch x16, wird standardmäßig x16 verwendet.

<!-- Source EN PDF p.18, block 90 -->

### 8.3 Systemstart schlägt nach Aktivierung von DSMC fehl

<!-- Source EN PDF p.18, block 91 -->

Nach der Aktivierung versucht DSMC, vom Slave zu lesen beziehungsweise auf ihn zu schreiben. Tritt ein Zugriffsfehler auf, etwa weil beim Lesen kein DQS-Signal zurückkommt, meldet DSMC dem Bus einen Fehler, wodurch das System in einen Ausnahmezustand gerät. Ein typisches Fehlerprotokoll lautet:

<!-- Source EN PDF p.18, block 92 -->

```text
...
[ 1.391589] dsmc 21ca0000.dsmc: init cs0 LB device # After being loaded, the DSMC driver
will access the slave.
[ 1.394238] 8<--- cut here ---
[ 1.394243] Unhandled fault: external abort on non-linefetch (0x1008) at 0xf0600100
[ 1.394250] [f0600100] *pgd=40b0f811, *pte=10000653, *ppte=10000453
[ 1.394267] Internal error: Oops - BUG: 1008 [#1] PREEMPT SMP THUMB2
...
```

<!-- Source EN PDF p.18, block 93 -->

Prüfen Sie bei diesem Problem die Hardwareverbindung zwischen DSMC-Master und -Slave.

<!-- Source EN PDF p.18, block 94 -->

Hinweis: Während der Initialisierung des DSMC-Masters muss der Slave bereits eingeschaltet und initialisiert sein; andernfalls können Zugriffsausnahmen auftreten.

<!-- Source EN PDF p.18, block 95 -->

### 8.4 Fehlerhafter DSMC-Selbstteststatus

<!-- Source EN PDF p.18, block 96 -->

Nach Abschluss der Initialisierung prüft der DSMC-Treiber die DSMC-Statusregister darauf, ob während der Initialisierung Unregelmäßigkeiten aufgetreten sind. Die folgenden Fehlermeldungen weisen auf eine Ausnahme während der Initialisierung hin.

<!-- Source EN PDF p.18, block 97 -->

```text
dsmc ff8b0000.dsmc: DSMC: csr status error(0x800)! #The specific status error value may vary
dsmc ff8b0000.dsmc: DSMC status error, please check hardware matched(io, slave etc.)
```

<!-- Source EN PDF p.18, block 98 -->

Prüfen Sie bei diesem Problem die Hardwareverbindung zwischen DSMC-Master und -Slave.

<!-- Source EN PDF p.19, block 99 -->

Hinweis: Während der Initialisierung des DSMC-Masters muss der Slave bereits eingeschaltet und initialisiert sein; andernfalls können Zugriffsausnahmen auftreten.

{% endraw %}


