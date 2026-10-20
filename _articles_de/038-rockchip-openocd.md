---
title: "Rockchip GNU MCU Eclipse OpenOCD: Vollständige Anleitung für JTAG-, Linux- und Bare-Metal-Debugging"
description: "Vollständige Anleitung aus der Quelldokumentation zu OpenOCD-Einrichtung, Verbindungen, grundlegender und erweiterter Fehlersuche, CPU-Hängern, RT-Thread, Linux-Einzelschritten, Bare Metal und KGDB."
translation_key: "038-rockchip-openocd"
slug: "038-rockchip-openocd"
lang: "de"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["Rockchip", "OpenOCD", "JTAG", "GDB", "KGDB", "Linux"]
keywords: "ArmSoM Rockchip OpenOCD Eclipse JTAG SWD GDB KGDB Linux bare metal"
excerpt: "Vollständige Anleitung aus der Quelldokumentation zu OpenOCD-Einrichtung, Verbindungen, grundlegender und erweiterter Fehlersuche, CPU-Hängern, RT-Thread, Linux-Einzelschritten, Bare Metal und KGDB."
---

# Rockchip GNU MCU Eclipse OpenOCD: Vollständige Anleitung für JTAG-, Linux- und Bare-Metal-Debugging

Diese vollständige Aufbereitung von GNU MCU Eclipse OpenOCD V2.0.0 (RK-KF-YF-91) bewahrt alle sechs technischen Kapitel, Befehle, Protokolle, Beispiele und 53 technischen Bildschirmaufnahmen. Es liegt ausschließlich das chinesische PDF mit 41 Seiten vor. Englisch und Russisch sind vollständige Übersetzungen; die deutsche Fassung übersetzt die geprüfte englische Aufbereitung vollständig. Alle Sprachfassungen verwenden die Originalabbildungen des chinesischen PDFs mit lokalisierten Bildunterschriften und Alternativtexten. Kommentare in Quellcode, Befehlen und Protokollen bleiben erhalten. Es wird nicht behauptet, dass englische Originalabbildungen vorliegen.

Dies ist eine Plattformreferenz für ein älteres, von Rockchip angepasstes Debugging-Werkzeug. Die Quelle nennt RK3588, RK3568, RK3566, RK3399, RK3288, RK3368, RK3326, PX30, RK3308, RV1108, RV1126/RV1109/RV1106, RK2108, RK2206 und RISCV, lässt die Spalte zur Kernel-Version jedoch leer. Daraus folgt keine Kompatibilität mit jedem aktuellen BSP oder ArmSoM-Board. Auch für RK3588 auf ArmSoM [Sige7](https://docs.armsom.org/armsom-sige7) sind JTAG/SWD-Leitungsführung, IOMUX, Spannungspegel, Adapter, Chip-Skripte, Symbole, SDK/BSP und Kernel-Version zu prüfen. Eine Prüfung auf ArmSoM-Hardware wurde nicht durchgeführt.

Produktversionstabelle der Quelle; leere Kernel-Versionsangaben bleiben erhalten:

| Chip | Kernel-Version |
|---|---|
| RK3588 | |
| RK3568 | |
| RK3566 | |
| RK3399 | |
| RK3288 | |
| RK3368 | |
| RK3326 | |
| PX30 | |
| RK3308 | |
| RV1108 | |
| RV1126/RV1109/RV1106 | |
| RK2108 | |
| RK2206 | |
| RISCV | |

Hinweis: Die nachstehenden Softwareversionen, Paketquellen und Pfade gehören zur ursprünglichen Umgebung und sind keine aktuellen Installationsempfehlungen. Debugging kann CPUs anhalten, Speicher verändern und KGDB auslösen. Verwenden Sie ausschließlich autorisierte Testgeräte, die sich wiederherstellen lassen. Für diesen Artikel wurde keiner dieser Befehle ausgeführt; Zeitangaben, Protokolle und Fehler aus der Quelle sind keine ArmSoM-Messungen.

## 1. Überblick

Die Debugging-Architektur lautet `Eclipse CDT + GNU MCU Eclipse OpenOCD + Eclipse + GDB + OpenOCD + ftdi/jlink + SoC`. CDT steht für C/C++ Development Tooling. GNU MCU Eclipse OpenOCD ist ein quelloffenes Plugin, das CDT mit GDB und OpenOCD verbindet. Eclipse integriert Plugins; auch ARM DS-5 basiert auf Eclipse. GDB ist der GNU-Debugger. OpenOCD unterstützt SWD/JTAG-Adapter sowie unter anderem die Architekturen ARM und RISCV. Die Quelle verwendet einen FT232H-USB-zu-SWD/JTAG-Adapter und beschreibt ihn als schnell und stabil.

## 2. Betriebssystemumgebung

### 2.1 Windows

#### 2.1.1 Paket openocd_eclipse.zip

Entpacken Sie das Archiv, wechseln Sie in dessen Stammverzeichnis und starten Sie `Eclipse_for_OpenOCD V1.0.exe`. Im Verzeichnis RK ist `eclipse-workspace` der vorkonfigurierte Arbeitsbereich; `example` enthält Beispiele; `tools` enthält GDB, JDK und zugehörige Werkzeuge; `实战视频` enthält Einstiegsvideos; `OpenOCD` enthält OpenOCD-Dateien; `SVD` (CMSIS System View Description) unterstützt die Registeranzeige; `doc` enthält Hilfedokumente.

#### 2.1.2 JRE installieren

Eclipse benötigt JRE; das Installationsprogramm der Quelle lautet `RK\tools\jdk_8.0.1310.11_64.exe`.

#### 2.1.3 Windows-Telnet aktivieren

Telnet ermöglicht den Zugriff auf den OpenOCD-Befehlsmodus. Die Einstellung befindet sich je nach Windows-Version an anderer Stelle; die Bildschirmaufnahmen der Quelle zeigen Windows 10.

![Windows-10-Telnet-Client aktivieren](/docs/rockchip-openocd/assets/cn-p07-figure1.png)

![Windows-10-Telnet-Client aktivieren](/docs/rockchip-openocd/assets/cn-p07-figure2.png)

### 2.2 Ubuntu mit 64 Bit

#### 2.2.1 Paket openocd_eclipse.tar.gz

```text
 tar -xzvf openocd_eclipse.tar.gz
```

Wechseln Sie in das entpackte Stammverzeichnis und führen Sie `eclipse` aus. RK enthält den standardmäßigen `eclipse-workspace`, `example`, `OpenOCD`, Registerbeschreibungen in `SVD`, Werkzeuge wie GDB in `tools`, Hilfe in `doc` und Einstiegsvideos in `实战视频`.

#### 2.2.2 Abhängigkeiten installieren

Eclipse benötigt JRE; laut Quelle ist Version 8 nicht zwingend erforderlich:

```text
 sudo add-apt-repository ppa:openjdk-r/ppa
 sudo apt-get update
 sudo apt-get install openjdk-8-jre 这⾥不⼀定要8
```

OpenOCD benötigt libusb und libftdi:

```text
 sudo apt-get install libusb-1.0-0-dev
 sudo apt-get install libftdi-dev
```

Kopieren Sie die USB-Geräteregeln:

```text
 sudo cp RK/OpenOCD/drivers/99-openocd.rules /etc/udev/rules.d/
 sudo cp RK/OpenOCD/drivers/60-openocd.rules /etc/udev/rules.d/
```

Installieren Sie das quelloffene Disassemblierungswerkzeug Capstone. Die Quelle berichtet von erfolgreichen Tests unter Ubuntu 16.04 und 18.04; dies sind keine Tests eines aktuellen Systems oder von ArmSoM-Hardware.

```text
 sudo apt-get install libcapstone-dev
```

## 3. Schnelleinstieg

Die Oberflächen unter Ubuntu und Windows sind weitgehend identisch; die Quelle demonstriert hauptsächlich Windows.

### 3.1 Hardwareverbindungen

#### 3.1.1 ARM-Standard-JTAG-Anschluss mit 20 Pins

![ARM-JTAG-Verbindung mit 20 Pins](/docs/rockchip-openocd/assets/cn-p09-figure1.png)

#### 3.1.2 TF-zu-JTAG-Adapterplatine

![TF-zu-JTAG-Verbindung](/docs/rockchip-openocd/assets/cn-p10-figure1.png)

Das Verdrahtungsbild der Quelle beschriftet TMS, TCK und GND und nennt SWD für Chips mit RK-Architektur sowie JTAG für RISC-V-Chips. Dies beschreibt den abgebildeten Werkzeug-/Chip-Aufbau und ersetzt nicht die Prüfung des Schaltplans der Zielplatine.

#### 3.1.3 UART2/JTAG-Multiplexing

![Multiplex-Verbindung für UART2/JTAG](/docs/rockchip-openocd/assets/cn-p10-figure2.png)

### 3.2 Softwareverbindung

#### 3.2.1 Startprogramm ausführen

Führen Sie `Eclipse_for_OpenOCD V1.0.exe` aus.

![Eclipse-Start und Arbeitsbereich](/docs/rockchip-openocd/assets/cn-p11-figure1.png)

#### 3.2.2 Chip-Konfigurationen importieren (optional)

Das normale Paket enthält bereits Chip-Konfigurationen. Importieren Sie diese wie gezeigt, wenn Konfigurationen aktualisiert, geändert oder hinzugefügt werden.

![Einstieg zum Import von Chip-Konfigurationen](/docs/rockchip-openocd/assets/cn-p11-figure2.png)

![Chip-Konfigurationen auswählen und importieren](/docs/rockchip-openocd/assets/cn-p12-figure1.png)

![Chip-Konfigurationen auswählen und importieren](/docs/rockchip-openocd/assets/cn-p12-figure2.png)

#### 3.2.3 Zielchip auswählen

![Chip für den Verbindungsaufbau auswählen](/docs/rockchip-openocd/assets/cn-p13-figure1.png)

![Chip in Debug Configurations auswählen und verbinden](/docs/rockchip-openocd/assets/cn-p13-figure2.png)

#### 3.2.4 Erfolgreiche Verbindung

Nachfolgend wird eine erfolgreiche Verbindung nach dem Anhalten der CPU gezeigt.

![Vollständige Debug-Ansicht nach Verbindung und CPU-Stopp](/docs/rockchip-openocd/assets/cn-p14-figure1.png)

#### 3.2.5 Verbindungsfehler

##### 3.2.5.1 JTAG-Adapter nicht erkannt

Prüfen Sie Adaptertreiber und Hardware. Siehe `Rockchip_Developer_Guide_FT232H_USB2JTAG.pdf`. Die OpenOCD-Version der Quelle erkennt FT232H-, FT2232H- und J-Link-Adapter automatisch.

![Protokoll einer fehlgeschlagenen JTAG-Adaptererkennung](/docs/rockchip-openocd/assets/cn-p14-figure2.png)

##### 3.2.5.2 Chip nicht erkannt

Prüfen Sie den Kontakt der Pins und ob JTAG-IOMUX aktiviert ist; reduzieren Sie gegebenenfalls TCK. Die folgende Meldung bedeutet, dass die Hardware-/JTAG-Erkennung funktioniert, der Chipzustand jedoch fehlerhaft ist und die Fehlersuche nicht fortgesetzt werden kann.

```text
the connection is ok, but the cpu is in incorrect state
```

Diese beiden Meldungen weisen auf ein Problem mit Verdrahtung, IOMUX oder Pin-Kontakt hin:

```text
please check hardware, make sure swd/jtag iomux is correct, and the pins connection is ok
please check hardware, the swdio(tms) pin is low level
```

![Verbindungsfehler oder falscher SWDIO/TMS-Pegel](/docs/rockchip-openocd/assets/cn-p15-figure1.png)

Wenn das folgende Protokoll erscheint, reduzieren Sie die JTAG-Taktrate und versuchen Sie es erneut.

```text
Please, adapter speed 1000 set clk 1MHz to try again
```

## 4. Grundlegende Fehlersuche

### 4.1 SWD/JTAG-Geschwindigkeit einstellen

Wenn Hardwarebeschränkungen die Kommunikation verhindern, reduzieren Sie TCK, beispielsweise auf 1000 KHz. Die Quelle nennt als Maximum 30000 KHz und empfiehlt 15000 KHz oder 7500 KHz; die tatsächliche Eignung hängt von der Verbindung zur Platine und vom Adapter ab.

![SWD/JTAG-Geschwindigkeit konfigurieren](/docs/rockchip-openocd/assets/cn-p15-figure2.png)

### 4.2 Symbole statisch laden

Konfigurieren Sie dies vor dem Verbindungsaufbau; statisch lässt sich nur eine Symboltabelle laden.

![Statische Symboltabelle konfigurieren](/docs/rockchip-openocd/assets/cn-p16-figure1.png)

### 4.3 Symbole dynamisch laden

Die Debugger Console nimmt GDB-Befehle entgegen. Laden Sie mit `add-symbol-file` mehrere Symboltabellen. Die folgenden Befehle laden der Reihe nach Linux, BL31, TPL, SPL und U-Boot. Ersetzen Sie Windows-Rückwärtsschrägstriche durch normale Schrägstriche. Führen Sie nach dem Laden einen Einzelschritt aus, bevor der Aufrufstapel angezeigt wird.

```text
 加载linux符号表：add-symbol-file G:/vmlinux
 加载bl31符号表：add-symbol-file T:/work/uboot/u-boot/bl31.elf

 加载tpl符号表：add-symbol-file T:/work/uboot/u-boot/tpl/u-boot-tpl
 加载spl符号表：add-symbol-file T:/work/uboot/u-boot/spl/u-boot-spl
 加载uboot符号表：add-symbol-file T:/work/uboot/u-boot/u-boot
```

![Symbole in der Debugger Console laden](/docs/rockchip-openocd/assets/cn-p16-figure2.png)

### 4.4 Quelltextpfade einstellen

Methode 1 verwendet die Oberfläche zur Quelltextsuche, Methode 2 die Debug Configurations, wie die beiden Bildschirmaufnahmen der Quelle zeigen.

![Zwei Methoden zum Einstellen der Quelltextpfade](/docs/rockchip-openocd/assets/cn-p17-figure1.png)

![Zwei Methoden zum Einstellen der Quelltextpfade](/docs/rockchip-openocd/assets/cn-p17-figure2.png)

### 4.5 Disassemblierung anzeigen

Disassemblieren Sie eine Funktion aus dem Aufrufstapel, eine ausgewählte Adresse oder eine benannte Funktion. Für die Funktionssuche müssen Symbole importiert sein.

![Disassemblierung nach Adresse oder Funktion](/docs/rockchip-openocd/assets/cn-p18-figure1.png)

![Disassemblierung nach Adresse oder Funktion](/docs/rockchip-openocd/assets/cn-p18-figure2.png)

### 4.6 Lokale Variablen anzeigen

![Lokale Variablen einer Funktion im Aufrufstapel](/docs/rockchip-openocd/assets/cn-p19-figure1.png)

### 4.7 Globale Variablen anzeigen

Wählen Sie unter Expressions den Eintrag Add new expression und geben Sie den Namen einer globalen Variablen ein. Auch Zeigerausdrücke sind zulässig.

![Ausdruck für eine globale Variable hinzufügen](/docs/rockchip-openocd/assets/cn-p19-figure2.png)

![Daten über Variablen- oder Zeigerausdrücke anzeigen](/docs/rockchip-openocd/assets/cn-p20-figure1.png)

![Daten über Variablen- oder Zeigerausdrücke anzeigen](/docs/rockchip-openocd/assets/cn-p20-figure2.png)

### 4.8 Einzelschritte

![Werkzeugleiste und Steuerelemente für Einzelschritte](/docs/rockchip-openocd/assets/cn-p21-figure1.png)

### 4.9 Haltepunkte setzen

Setzen Sie Haltepunkte im Quelltextfenster oder im Fenster Disassembly.

![Haltepunkt im Quelltext setzen](/docs/rockchip-openocd/assets/cn-p21-figure2.png)

![Haltepunkt in Disassembly setzen](/docs/rockchip-openocd/assets/cn-p22-figure1.png)

### 4.10 Speicher anzeigen

Der Memory Browser der Quelle arbeitet nur mit 32-Bit-Adressen korrekt und hat Probleme mit 64-Bit-Adressen. Verwenden Sie für 64-Bit-Adressen den OpenOCD-Befehlsmodus mit `mdw`, `mww`, `smdw`, `smww`, `io` und verwandten Befehlen.

![Speicher im Memory Browser anzeigen](/docs/rockchip-openocd/assets/cn-p22-figure2.png)

## 5. Erweiterte Fehlersuche

### 5.1 Registergruppen

Durch Gruppierung lassen sich große Registerbestände leichter untersuchen.

![Registergruppen konfigurieren und anzeigen](/docs/rockchip-openocd/assets/cn-p23-figure1.png)

![Registergruppen konfigurieren und anzeigen](/docs/rockchip-openocd/assets/cn-p23-figure2.png)

### 5.2 CPU auswählen

![Ziel-CPU auswählen](/docs/rockchip-openocd/assets/cn-p24-figure1.png)

### 5.3 Sicheres Debugging

Wenn ein Produkt eine Sicherheitsrichtlinie aktiviert, ist für JTAG-Debugging ein autorisierter Schlüssel erforderlich. Beschrieben wird der Einstiegspunkt zur Authentifizierung, keine Umgehung der Sicherheitsrichtlinie.

![Schlüssel für sicheres Debugging konfigurieren](/docs/rockchip-openocd/assets/cn-p24-figure2.png)

### 5.4 OpenOCD im Befehlsterminal

Öffnen Sie OpenOCD in cmd, um die Hilfe anzuzeigen. Weitere Befehle finden Sie im [OpenOCD-Benutzerhandbuch](https://openocd.org/doc/html/General-Commands.html#General-Commands). In der Version der Quelle stellt `openocd.exe -r` die Verbindung zum Chip her.

![OpenOCD-Befehlszeilenhilfe](/docs/rockchip-openocd/assets/cn-p25-figure1.png)

```text
  http://openocd.org/doc/html/General-Commands.html#General-Commands
```

Öffnen Sie ein weiteres cmd-Fenster und führen Sie `telnet localhost 4444` aus. Alternativ stellen Sie wie gezeigt eine Telnet-Sitzung mit SecureCRT her.

![Lokale Telnet-Verbindung über cmd](/docs/rockchip-openocd/assets/cn-p26-figure1.png)

![Lokale Telnet-Verbindung über cmd](/docs/rockchip-openocd/assets/cn-p26-figure2.png)

![Telnet-Verbindung mit SecureCRT](/docs/rockchip-openocd/assets/cn-p27-figure1.png)

![Telnet-Verbindung mit SecureCRT](/docs/rockchip-openocd/assets/cn-p27-figure2.png)

![CPUs in SecureCRT untersuchen und wechseln](/docs/rockchip-openocd/assets/cn-p28-figure1.png)

### 5.5 OpenOCD-Befehlsmodus in Eclipse

Für Informationen oder Aktionen, die über die Oberfläche nicht bequem erreichbar sind, öffnen Sie ein lokales Terminal und geben `telnet localhost 4444` ein. Ist der Befehl nicht verfügbar, aktivieren Sie Windows-Telnet wie in §2.1.3.

![Lokales Eclipse-Terminal und OpenOCD-Befehlsmodus](/docs/rockchip-openocd/assets/cn-p28-figure2.png)

![OpenOCD-Befehlsausgabe im Eclipse-Terminal](/docs/rockchip-openocd/assets/cn-p29-figure1.png)

### 5.6 Grafische Ansicht der Peripherieregister

Wählen Sie vor dem Verbindungsaufbau eine SVD-Datei und untersuchen Sie anschließend die Register wie gezeigt.

![SVD-Datei und grafische Ansicht der Peripherieregister](/docs/rockchip-openocd/assets/cn-p29-figure2.png)

![SVD-Datei und grafische Ansicht der Peripherieregister](/docs/rockchip-openocd/assets/cn-p29-figure3.png)

### 5.7 Grafische Ansicht der Systemsteuerregister

Wählen Sie auch für diese Ansicht die SVD-Datei vor dem Verbindungsaufbau.

![SVD-Datei und Ansicht der Systemsteuerregister](/docs/rockchip-openocd/assets/cn-p30-figure1.png)

![SVD-Datei und Ansicht der Systemsteuerregister](/docs/rockchip-openocd/assets/cn-p30-figure2.png)

### 5.8 Speicher in eine Datei exportieren

Es folgen Syntax und Quellbeispiele für virtuelle und physische Adressen; `p:` kennzeichnet eine physische Adresse. Die Übertragungsraten sind Beispiele aus der Quelle.

```text
dump_image filename [p:]address size
```

```text
 dump_image filename [p:]address size
 虚拟地址访问：

 > dump_image dd.bin 0xffffff8009a63c80 65536
 dumped 65536 bytes in 0.113187s (565.436 KiB/s)
 物理地址访问：
 > dump_image dd.bin p:0x01c63c80 65536
 dumped 65536 bytes in 0.094566s (676.776 KiB/s)
```

### 5.9 Datei in den Speicher importieren

```text
load_image filename [p:]address ['bin'|'ihex'|'elf'|'s19'] [min_address] [max_length]
```

```text
 load_image filename [p:]address ['bin'|'ihex'|'elf'|'s19'] [min_address]
 [max_length]
 虚拟地址访问：

 > load_image dd.bin 0xffffff8009a63c80 bin
 65536 bytes written at address 0xffffff8009a63c80
 downloaded 65536 bytes in 0.055928s (1144.328 KiB/s)
 物理地址访问：
 > load_image dd.bin p:0x01c63c80 bin
 65536 bytes written at address 0x01c63c80
 downloaded 65536 bytes in 0.056400s (1134.752 KiB/s)
```

### 5.10 Datei mit dem Speicher vergleichen

`verify_image` unterstützt ausschließlich den Zugriff über virtuelle Adressen.

```text
verify_image filename [offset [type]]
```

```text
 verify_image filename [offset [type]]
 只⽀持虚拟地址访问：
 > verify_image dd.bin 0xffffff8009a63c80

 verified 65536 bytes in 0.066775s (958.443 KiB/s)
```

Diese drei Befehle betreffen virtuelle und physische Adressen. Die Quelle behandelt sie in maskrom, TPL, SPL, U-Boot und ATF als identisch, sodass dort der virtuelle Zugriff genügt. Unter Linux unterscheiden sie sich; stellen Sie physischen Adressen `p:` voran. Ein relativer Dateiname wie `dd.bin` wird im Arbeitsverzeichnis von OpenOCD aufgelöst. Die tatsächlichen Zuordnungen hängen weiterhin vom Laufzeitzustand des Zielsystems ab.

## 6. Praktische Einsatzfälle

### 6.1 CPU-Hänger untersuchen

Eine eingefrorene Anzeige, ein schwarzer Bildschirm, eine nicht reagierende serielle Konsole oder Kernel-Fehler können darauf hinweisen, dass eine CPU an einer oder mehreren Anweisungen hängt. Das Quellbeispiel zeigt einen RK3399-Hänger beim Start: Die Protokollausgabe endet, die serielle Konsole reagiert nicht und die Anzeige wird nicht aktualisiert. Es folgen die vollständigen Quellprotokolle.

```text
 [  7.441882] type=1400 audit(1501952314.540:9): avc: denied { setattr } for
 pid=1 comm="init" name="mmcblk1p13" dev="tmpfs" ino=15288 scontext=u:r:init:s0
 tcontext=u:object_r:block_device:s0 tclass=lnk_file permissive=1

 [  7.455950] init: Service 'exec 2 (/system/bin/vdc)' (pid 252) exited with
 status 0
 rk3399_all:/ $ [ 7.589883] random: nonblocking pool is initialized
 [  8.078474] init: Starting service 'bootanim'...
 [  8.261358] read channel() error: -110
 [  15.245727] BUG: spinlock lockup suspected on CPU#2, adbd/251
```

```text
 $ ./src/openocd.exe -r rk3399
 Open On-Chip Debugger 0.10.0+dev-01555-g6ad367fa3-dirty (2021-08-04-17:44)

 Licensed under GNU GPL v2
 For bug reports, read
       http://openocd.org/doc/doxygen/bugs.html
 中间省掉很多log
 Info : clock speed 2000 kHz
 Info : SWD DPIDR 0x5ba02477
 Info : cpu0: hardware has 6 breakpoints, 4 watchpoints
 Info : cpu1: hardware has 6 breakpoints, 4 watchpoints
 Info : cpu2: hardware has 6 breakpoints, 4 watchpoints
 Info : cpu3: hardware has 6 breakpoints, 4 watchpoints
 Info : cpu4: hardware has 6 breakpoints, 4 watchpoints
 Info : cpu5: hardware has 6 breakpoints, 4 watchpoints

 Info : starting gdb server for cpu0 on 3333
 Info : Listening on port 3333 for gdb connections
 Info : starting gdb server for cpu1 on 3334
 Info : Listening on port 3334 for gdb connections
 Info : starting gdb server for cpu2 on 3335
 Info : Listening on port 3335 for gdb connections
 Info : starting gdb server for cpu3 on 3336
 Info : Listening on port 3336 for gdb connections
 Info : starting gdb server for cpu4 on 3337
 Info : Listening on port 3337 for gdb connections
 Info : starting gdb server for cpu5 on 3338
 Info : Listening on port 3338 for gdb connections
```

Öffnen Sie ein weiteres Terminal und führen Sie `telnet localhost 4444` aus. `cpu_block` listet passende Befehle auf; `l` zeigt den CPU-Zustand, `dump_pc` tastet die PCs wiederholt ab, `halt` versucht eine CPU anzuhalten und bei einem Fehlschlag wird `fhalt` versucht. Untersuchen Sie nach erfolgreichem erzwungenem Anhalten `core_reg64`/`core_reg32`; die Quelle warnt, dass in diesem Zustand kein Speicherzugriff möglich ist.

```text
 另外再打开⼀个cmd窗⼝，输⼊telnet localhost 4444 进⼊命令⾏调试


 Open On-Chip Debugger
 > cpu_block 查看针对cpu卡死问题，有哪些命令可以⽤
 l 查看cpu状态
 dump_pc 多次打印pc指针
 halt 停住cpu
 if halt fail, try fhalt 强制cpu进⼊debug 状态
 if fhalt success, try core_reg64 or core_reg32, but you can't access memory
 > l
    TargetName    Type    Endian TapName    State
 -- ------------------ ---------- ------ ------------------ ------------
  0 ahb           mem_ap  little RK3399.cpu running
  1 apb           mem_ap  little RK3399.cpu running
  2* cpu0         aarch64 little RK3399.cpu running

  3 cpu1          aarch64 little RK3399.cpu running
  4 cpu2          aarch64 little RK3399.cpu running
  5 cpu3          aarch64 little RK3399.cpu running
  6 cpu4          aarch64 little RK3399.cpu running
  7 cpu5          aarch64 little RK3399.cpu running

 > dump_pc
 1
 cpu0 pc:0xffffff8008143a88
 cpu1 pc:0xffffff8008143a5c
 cpu2 pc:0xffffff8008081078
 cpu3 pc:0xffffff8008081078
 cpu4 pc:0xffffff80081133c8
 cpu5 pc:0xffffff800808248c
 2
 cpu0 pc:0xffffff8008143a88
 cpu1 pc:0xffffff8008143a5c
 cpu2 pc:0xffffff8008081078

 cpu3 pc:0xffffff8008081078
 cpu4 pc:0xffffff80081133c8
 cpu5 pc:0xffffff800808248c
 3
 cpu0 pc:0xffffff8008143a88
 cpu1 pc:0xffffff8008143a5c
 cpu2 pc:0xffffff8008081078
 cpu3 pc:0xffffff8008081078
 cpu4 pc:0xffffff80081133c8
 cpu5 pc:0xffffff800808248c
 4
 cpu0 pc:0xffffff8008143a88
 cpu1 pc:0xffffff8008143a5c

 cpu2 pc:0xffffff8008081078
 cpu3 pc:0xffffff8008081078
 cpu4 pc:0xffffff80081133c8
 cpu5 pc:0xffffff800808248c
 5
 cpu0 pc:0xffffff8008143a88
 cpu1 pc:0xffffff8008143a5c
 cpu2 pc:0xffffff8008081078
 cpu3 pc:0xffffff8008081078
 cpu4 pc:0xffffff80081133c8
 cpu5 pc:0xffffff800808248c 经过5次打印，发现6个cpu的pc指针都没变，那么很可能是卡死了


 > halt
 Timeout waiting for target cpu0 halt 第⼀次尝试停cpu0失败

 > fhalt
 cpu0 fail to force entry to debug state; prsr:00000001 第⼆次尝试停cpu0失败，这时只能
 根据打印出来的pc指针来查问题了

 > l cpu1

 > halt
 Timeout waiting for target cpu1 halt

 > fhalt

 cpu1 fail to force entry to debug state; prsr:00000001
 > l cpu2
 > halt
 Timeout waiting for target cpu2 halt

 > fhalt

 cpu2 success to force entry to debug state; prsr:00000011 终于可以停住cpu2

 > core_reg64 可以打印cpu通⽤寄存器，以便进⼀步分析
 x0 (/64): 0xffffffc00a3d7e00
 x1 (/64): 0xffffff8008081028
 x2 (/64): 0x0000000000000000
 x3 (/64): 0x00000040edbb6000
 x4 (/64): 0x0100000000000000
 x5 (/64): 0x000000000d8031bf
 x6 (/64): 0x000000000000126a
 x7 (/64): 0xffffff8008141ee0
 x8 (/64): 0x0000000000000000

 x9 (/64): 0x0000000000000000
 x10 (/64): 0x00000000000012b0
 x11 (/64): 0x000000000000000f
 x12 (/64): 0x0000000100000000
 x13 (/64): 0x0000000000000001
 x14 (/64): 0x0000000000000000
 x15 (/64): 0x0000000000000000
 x16 (/64): 0xffffff80080b8b28
 x17 (/64): 0x0000007cf3aeee00
 x18 (/64): 0x0000000000000000
 x19 (/64): 0x000000000000001e
 x20 (/64): 0x0000008000000000
 x21 (/64): 0xffffff80094e7990

 x22 (/64): 0xffffff8009357ea0
 x23 (/64): 0xffffffc00a3d7e00
 x24 (/64): 0x0000000000000001
 x25 (/64): 0xffffffc0f6ed4060
 x26 (/64): 0xffffffc0f6ed8050
 x27 (/64): 0x0000000000ed9234
 x28 (/64): 0xffffffc00a3cad00
 x29 (/64): 0xffffffc0f6ed8000
 x30 (/64): 0xffffff8008083230
 sp (/64): 0xffffffc0f6ed8000
 pc (/64): 0xffffff800808107c


 > mrs SCTLR_EL1 也可以读system control寄存器
 Cannot reach EL 0, SPSR corrupted?
 SCTLR_EL1:0x34d5d91d

 > mrs SCTLR_EL2
 Cannot reach EL 0, SPSR corrupted?
 SCTLR_EL2:0x30c50830

 > mrs SCTLR_EL3
 Cannot reach EL 0, SPSR corrupted?
 SCTLR_EL3:0x00cd383f
```

Im Beispiel bleiben die PCs aller sechs CPUs über fünf Abtastungen unverändert, was einen Hänger nahelegt. Erzwungenes Anhalten scheitert bei CPU0/CPU1 und gelingt bei CPU2. `core_reg64` gibt die Allzweckregister aus, `mrs SCTLR_EL1/EL2/EL3` liest Systemsteuerregister. Mit `objdump.exe -d vmlinux | less` finden Sie die Funktion und Anweisung am PC. Die Quelle markiert CPU2 bei `dsb sy`, Adresse `0xffffff800808107c`.

```text
 执⾏objdump.exe -d vmlinux | less，反汇编查看pc指针所处的函数和指令

 ffffff8008081028 <gic_handle_irq>:
 ffffff8008081028: a9bc7bfd   stp   x29, x30, [sp, #-64]!
 ffffff800808102c: 910003fd   mov   x29, sp
 ffffff8008081030: a9025bf5   stp   x21, x22, [sp, #32]

 ffffff8008081034: d00096b6   adrp  x22, ffffff8009357000
 <event_hash+0x288>
 ffffff8008081038: a90363f7   stp   x23, x24, [sp, #48]
 ffffff800808103c: d000a335   adrp  x21, ffffff80094e7000
 <event_class_drv_config+0x40>
 ffffff8008081040: aa0003f7   mov   x23, x0
 ffffff8008081044: 913a82d6   add   x22, x22, #0xea0
 ffffff8008081048: 912642b5   add   x21, x21, #0x990
 ffffff800808104c: a90153f3   stp   x19, x20, [sp, #16]
 ffffff8008081050: 52800038   mov   w24, #0x1
 // #1
 ffffff8008081054: d503201f   nop

 ffffff8008081058: 14000008   b     ffffff8008081078
 <gic_handle_irq+0x50>
 ffffff800808105c: 71003e7f   cmp   w19, #0xf
 ffffff8008081060: 540007e8   b.hi  ffffff800808115c
 <gic_handle_irq+0x134> // b.pmore
 ffffff8008081064: 92407e60   and   x0, x19, #0xffffffff
 ffffff8008081068: d518cc20   msr   s3_0_c12_c12_1, x0
 ffffff800808106c: d5033fdf   isb
 ffffff8008081070: d503201f   nop
 ffffff8008081074: 14000035   b     ffffff8008081148
 <gic_handle_irq+0x120>
 ffffff8008081078: d538cc13   mrs   x19, s3_0_c12_c12_0
 *ffffff800808107c: d5033f9f   dsb  sy   cpu2卡死在这个位置

 ffffff8008081080: 51004260   sub   w0, w19, #0x10
 ffffff8008081084: 2a1303f4   mov   w20, w19
 ffffff8008081088: 710fac1f   cmp   w0, #0x3eb
 ffffff800808108c: 54000089   b.ls  ffffff800808109c
 <gic_handle_irq+0x74> // b.plast
 ffffff8008081090: 5283ffe0   mov   w0, #0x1fff
 // #8191
 ffffff8008081094: 6b00027f   cmp   w19, w0
 ffffff8008081098: 54fffe29   b.ls  ffffff800808105c
 <gic_handle_irq+0x34> // b.plast
```

Bleibt die Ursache unklar, empfiehlt die Quelle, diese Befehlsprotokolle Rockchip-Ingenieuren zur Analyse bereitzustellen.

### 6.2 RT-Thread-Debugging

Standardmäßig wird nur ein Thread angezeigt. Ergänzen Sie Folgendes, um mehrere Threads anzuzeigen:

```text
 -c "cpu0 configure -rtos RT_Thread"
```

![Konfiguration für RT-Thread-Debugging mit mehreren Threads](/docs/rockchip-openocd/assets/cn-p36-figure1.png)

### 6.3 Linux im Einzelschritt ausführen

Wenn beim Kernel-Start nach Ausschluss serieller Probleme keine Protokolle erscheinen, untersuchen Sie einen Fehler in der frühen Startphase. Die folgenden Änderungen fügen eine Endlosschleife ein, um die Ausführung anzuhalten. Sie blockieren den Start absichtlich und dürfen nicht in Produktionsabbildern verbleiben.

#### 6.3.1 Einkernphase des Kernels

Ändern Sie `linux5.10/init/main.c`. Klicken Sie mit der rechten Maustaste auf die Anweisung nach `b .`, wählen Sie Move To line zum Überspringen der Schleife und führen Sie anschließend Einzelschritte aus.

```text
 linux5.10/init/main.c
 asmlinkage __visible void __init __no_sanitize_address start_kernel(void)

 {
    char *command_line;
    char *after_dashes;
    asm volatile("b .");
  ...
  }
```

![Schleife b . überspringen und Einzelschritte ausführen](/docs/rockchip-openocd/assets/cn-p37-figure1.png)

#### 6.3.2 Mehrkernphase des Kernels

Ändern Sie `linux5.10/kernel/cpu.c`:

```text
 linux5.10/kernel/cpu.c
 void bringup_nonboot_cpus(unsigned int setup_max_cpus)

 {
    unsigned int cpu;

    for_each_present_cpu(cpu) {
       if (num_online_cpus() >= setup_max_cpus)
          break;
       if (!cpu_online(cpu))
          cpu_up(cpu, CPUHP_ONLINE);
    }
    asm volatile("b .");
 }
```

![Mehrkern-Startphase im Einzelschritt ausführen](/docs/rockchip-openocd/assets/cn-p37-figure2.png)

### 6.4 Bare-Metal-Debugging

#### 6.4.1 Projekt erstellen

Erstellen Sie ein Projekt nach dem üblichen Eclipse-Ablauf und konfigurieren Sie anschließend Compileroptionen und Cross-Compiler.

![Compiler und Cross-Compiler für ein Bare-Metal-Projekt einrichten](/docs/rockchip-openocd/assets/cn-p38-figure1.png)

#### 6.4.2 Firmware laden und ausführen

Kopieren Sie zunächst die Konfiguration des Zielchips und passen Sie danach die Kopie für das Debugging an.

![Chip-Debug-Konfiguration vor der Bearbeitung kopieren](/docs/rockchip-openocd/assets/cn-p38-figure2.png)

![Chip-Konfiguration kopieren und Firmware-Ladevorgang einstellen](/docs/rockchip-openocd/assets/cn-p39-figure1.png)

### 6.5 KGDB verwenden

#### 6.5.1 Zweck

Verwenden Sie KGDB zur Treiberfehlersuche und für vollständige Aufrufstapel nach Fehlern durch ungültige Zeiger. Die Kommunikation erfolgt seriell statt über JTAG.

#### 6.5.2 KGDB aktivieren

Übernehmen Sie die menuconfig-Einstellungen der Quelle. Setzen Sie `panic timeout` auf `0`, damit ein die-Ereignis KGDB öffnet, statt neu zu starten. Alternativ verwenden Sie `echo 0 > /sys/module/kernel/parameters/panic`.

```text
 Device Drivers --->
   Character devices --->
     [*]  Virtual terminal

         [*]   Enable character translations in console (NEW)
         [*]   Support for console on virtual terminal (NEW)
 -> Kernel hacking
  -> Generic Kernel Debugging Instruments
    [*] KGDB: kernel debugger --->
     --- KGDB: kernel debugger
     [*]  KGDB: use kprobe blocklist to prohibit unsafe breakpoints (NEW)
     <*>  KGDB: use kgdb over the serial console (NEW)

 Kernel hacking --->
   Debug Oops, Lockups and Hangs --->
    (0) panic timeout 这个要配成0，出现die时才会进⼊kgdb

  或者echo 0 > /sys/module/kernel/parameters/panic 将panic timeout时间设为0，即
 不reboot
```

Das Kernel-Konfigurationsbeispiel steht in `arch/arm64/boot/dts/rockchip/rk3588-android.dtsi`:

```text
 arch/arm64/boot/dts/rockchip/rk3588-android.dtsi
 chosen {
    bootargs = "kgdboc_earlycon kgdboc=ttyFIQ0,1500000";

 };
```

Die Quelle prüft die Aktivierung mit `echo g > /proc/sysrq-trigger`; das Protokoll endet mit dem Warten auf einen entfernten Debugger:

```text
 echo g > /proc/sysrq-trigger

 [  1.385017][ T0] kgdboc: No suitable earlycon yet, will try later

 [  1.385069][ T0] earlycon: uart8250 at MMIO32 0x00000000feb50000
 (options '')
 [  1.390726][ T0] printk: bootconsole [uart8250] enabled
 [  2.956193][ T0] kgdboc: Going to register kgdb with earlycon 'uart'
 [  2.956196][ T0] KGDB: Registered I/O driver kgdboc_earlycon
 [  3.092139][ T1] Unable to handle kernel NULL pointer dereference at
 virtual address 000000000000007f
 [  3.093010][ T1] Mem abort info:
 [  3.093329][ T1] ESR = 0x96000005
 [  3.093672][ T1] EC = 0x25: DABT (current EL), IL = 32 bits
 [  3.094219][ T1] SET = 0, FnV = 0
 [  3.094561][ T1] EA = 0, S1PTW = 0
 [  3.094912][ T1] Data abort info:

 [  3.095238][ T1] ISV = 0, ISS = 0x00000005
 [  3.095651][ T1] CM = 0, WnR = 0
 [  3.095987][ T1] [000000000000007f] user address but active_mm is
 swapper
 [  3.096633][ T1] Internal error: Oops: 96000005 [#1] PREEMPT SMP
 [  3.097206][ T1] KGDB: Waiting for remote debugger
```

#### 6.5.3 KGDB-Konfiguration

![Verbindungseinstellungen für KGDB-Ferndebugging](/docs/rockchip-openocd/assets/cn-p40-figure1.png)

### 6.6 AArch64 im 32-Bit-Modus debuggen

```text
-c "cpu0 aarch64_32 "
```

![Option für AArch64 im 32-Bit-Modus](/docs/rockchip-openocd/assets/cn-p41-figure1.png)

## Redaktionelle Hinweise und Umgebungsbedingungen

Das Versionsdatum auf dem Deckblatt weicht von manchen Protokollzeitstempeln ab; die Chipliste legt keine Softwareversionen fest. Befehle wie `-r`, `cpu_block`, `fhalt`, `core_reg64` und `aarch64_32` können Rockchips angepasstes OpenOCD voraussetzen und sind in Upstream-Versionen nicht garantiert. JRE 8, Verweise auf alte Ubuntu-Versionen/PPAs und Pfade bleiben historische Beispiele, keine Zusagen zur heutigen Installierbarkeit. Alle Quellabbildungen bleiben erhalten; zusätzliche Oberflächenparameter darin beziehen sich auf das ältere Werkzeug. Lizenzen, erforderliche Zuschreibungen und Originalkommentare in Protokollen/Code wurden nicht zusammen mit Deckblatthinweisen entfernt. [Vollständiges Redaktionsprotokoll](/docs/rockchip-openocd/EDITORIAL-NOTES.md).
