---
title: "Rockchip Linux UART: serielle Ports, Konsole, DMA und Flusssteuerung"
description: "Rockchip Linux UART: serielle Ports, Konsole, DMA und Flusssteuerung"
excerpt: "Rockchip Linux UART: serielle Ports, Konsole, DMA und Flusssteuerung"
translation_key: 155-rockchip-linux-uart
slug: 155-rockchip-linux-uart
lang: de
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: interfaces
products: []
tags: [ArmSoM, Rockchip, UART, Linux, DMA]
---

{% raw %}

# Rockchip Linux UART: serielle Ports, Konsole, DMA und Flusssteuerung

Vollständig gegen Chinesisch V1.5.0 und Englisch V1.5.1 abgeglichen. Die englische Revision ändert nur die Dokument-ID; keine zusätzlichen technischen Kapitel oder Befehlsparameter gefunden. Versionsunterschiede bleiben dokumentiert, ohne Ergänzungen zu erfinden. Geltungsbereich: Linux kernel 3.10, 4.4 und spätere Plattformen, mit Beispielen zu 4.19/RK3568.

Nur ArmSoM-Plattformreferenz: SoC, SDK/BSP, Kerneltreiber, DTS-Pinmux, Pegel und externe Schaltung prüfen. Keine pauschale Unterstützung aller Platinen. Keine separaten technischen Abbildungen; Code, Logs und Konfiguration bleiben kopierbar. Quelltests sind keine ArmSoM-Messungen. Keine Register-, Flash- oder anderen Hardwarebefehle ausgeführt.

> Direkte Registerzugriffe, Taktänderungen oder Abschalten der Konsole können Kommunikation, Debugzugriff und Booten verhindern. Mit dem konkreten TRM/BSP abgleichen; RK3568-Adressen nicht auf andere Chips übertragen.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. Funktionen

Rockchip UART (Universal Asynchronous Receiver/Transmitter) basiert auf dem Standard 16550A. Das vollständige Modul unterstützt 5, 6, 7 oder 8 Datenbits; 1, 1.5 oder 2 Stoppbits; gerade und ungerade Parität, aber keine Mark-/Space-Parität; Empfangs- und Sende-FIFOs mit gewöhnlich 32 oder 64 Byte; bis zu 4M Baud abhängig von der Taktteilung des Chips; Interrupt- und DMA-Übertragung sowie automatische Hardware-Flusssteuerung mit RTS+CTS. Maßgeblich sind die UART-Funktionen im Handbuch des konkreten Chips; einzelne UARTs können eingeschränkt sein.

## 2. Normaler serieller Port

### 2.1 Treiberpfade

Unter Linux kernel 3.10 werden folgende Treiberdateien verwendet:

```text
drivers/tty/serial/rk_serial.c
```

Linux kernel 4.4 und 4.19 verwenden den generischen 8250-Treiber. Hauptdateien:

```text
drivers/tty/serial/8250/8250_core.c     # 8250串口驱动核心
drivers/tty/serial/8250/8250_dw.c       # Synopsis DesignWare 8250串口驱动
drivers/tty/serial/8250/8250_dma.c      # 8250串口DMA驱动
drivers/tty/serial/8250/8250_port.c     # 8250串口端口操作
drivers/tty/serial/8250/8250_early.c    # 8250串口early console驱动
```

### 2.2 menuconfig-Konfiguration

In den verschiedenen Linux-Kernel-Versionen liegen die UART-Optionen in menuconfig unter folgendem Pfad. Die Optionen sind dort ausführlich beschrieben und werden hier nicht weiter erläutert:

```text
Device Drivers  --->
    Character devices  --->
        Serial drivers  --->
```

Empfohlen wird die UART-Standardkonfiguration des Rockchip SDK.

### 2.3 DTS-Konfiguration

Die UART-DTS-Konfiguration verschiedener Linux-Kernel-Versionen entspricht grundsätzlich folgendem Beispiel für RK3568 unter Linux kernel 4.19 in rk3568.dtsi:

```text
uart1: serial@fe650000 {
    compatible = "rockchip,rk3568-uart", "snps,dw-apb-uart";
    reg = <0x0 0xfe650000 0x0 0x100>;
    interrupts = <GIC_SPI 117 IRQ_TYPE_LEVEL_HIGH>;
    clocks = <&cru SCLK_UART1>, <&cru PCLK_UART1>;
    clock-names = "baudclk", "apb_pclk";
    reg-shift = <2>;
    reg-io-width = <4>;
    dmas = <&dmac0 2>, <&dmac0 3>;
    dma-names = "tx", "rx";
    pinctrl-names = "default";
    pinctrl-0 = <&uart1m0_xfer>;
    status = "disabled";
};
```

Im Board-DTS dürfen nur folgende UART-Parameter geändert werden. dma-names: "tx" aktiviert TX-DMA, "rx" RX-DMA, "!tx" deaktiviert TX-DMA und "!rx" RX-DMA. pinctrl-0: &uart1m0_xfer setzt TX/RX auf iomux group 0; &uart1m1_xfer auf group 1; &uart1m0_ctsn und &uart1m0_rtsn setzen CTS/RTS für die Hardware-Flusssteuerung auf group 0, &uart1m1_ctsn und &uart1m1_rtsn auf group 1. status: "okay" aktiviert, "disabled" deaktiviert. Beispiel: RK3568 UART1 und DMA aktivieren sowie TX, RX, CTS und RTS mit Hardware-Flusssteuerung auf group0 konfigurieren:

```text
&uart1 {
    dma-names = "tx", "rx";
    pinctrl-names = "default";
    pinctrl-0 = <&uart1m0_xfer &uart1m0_ctsn &uart1m0_rtsn>;
    status = "okay";
};
```

pinctrl-0 konfiguriert lediglich den IOMUX der CTS-/RTS-Pins. Die eigentliche Hardware-Flusssteuerung wird im UART-Treiber aktiviert. Wird sie nicht benötigt, können die CTS-/RTS-IOMUX-Einstellungen entfallen.

### 2.4 Baudrate

UART-Baudrate = Arbeitstaktquelle / interner Teiler / 16. Bei direkter Versorgung durch den 24M-Quarz stellt der interne Teiler die Baudrate ein. Liefert die CRU den Takt durch PLL-Teilung, beträgt die UART-Baudrate normalerweise 1/16 des Arbeitstakts. Zulässige Baudraten und Übertragungsstabilität hängen softwareseitig vor allem von der Taktteilungsstrategie ab. Der Treiber fordert automatisch die zur Baudrate passende Frequenz an. Abfrage des UART-Arbeitstakts:

```text
cat /sys/kernel/debug/clk/clk_summary | grep uart
```

Die Quelle nennt stabile Unterstützung gängiger Baudraten wie 115200, 460800, 921600, 1500000, 3000000 und 4000000. Für besondere Baudraten muss gegebenenfalls die Taktteilungsstrategie geändert werden.

### 2.5 DMA verwenden

DMA entlastet die CPU erst bei großen Datenmengen deutlich. Gegenüber Interrupt-Übertragung erhöht DMA die Geschwindigkeit nicht zwangsläufig: Moderne CPUs sind leistungsfähig, der Engpass liegt in der Peripherie. Außerdem kostet das Starten von DMA zusätzliche Ressourcen, und unbestimmte UART-Datenlängen mindern seine Effizienz. Daher wird normalerweise der Standard-Interruptmodus mit folgender Ausgabe empfohlen:

```text
failed to request DMA, use interrupt mode
```

Bei knappen DMA-Kanälen kann TX-DMA deaktiviert werden; folgende Ausgabe erscheint:

```text
got rx dma channels only
```

### 2.6 Automatische Hardware-Flusssteuerung

Für automatische Hardware-Flusssteuerung muss der UART-Treiber die Funktion aktivieren und der DTS den IOMUX von CTS/RTS umschalten. Bei hohen Baudraten ab 1.5M und großen Datenmengen wird Hardware-Flusssteuerung, also ein Vierdraht-UART, empfohlen.

### 2.7 Aufwecken über UART

Für UART-Wakeup bleibt der Port im Suspend geöffnet und sein Interrupt wird als Aufweckquelle eingerichtet. Folgende Parameter im DTS ergänzen:

```text
&uart1 {
    wakeup-source;
};
```

UART-Wakeup benötigt auch eine Änderung der trust-Firmware; hierfür ist Unterstützung von Rockchip erforderlich.

### 2.8 Geräteregistrierung

Nach Aktivierung im DTS bestätigt folgende Startausgabe die UART-Geräteregistrierung:

```text
fe650000.serial: ttyS1 at MMIO 0xfe650000 (irq = 67, base_baud = 1500000) is a
16550A
```

Normale UARTs werden anhand der DTS-aliases nummeriert und als ttySx registriert. Beispiel:

```text
aliases {
    serial0 = &uart0;
    serial1 = &uart1;
    serial2 = &uart2;
    serial3 = &uart3;
    ......
```

Um uart3 als ttyS1 zu registrieren, die Konfiguration wie folgt ändern:

```text
aliases {
    serial0 = &uart0;
    serial1 = &uart3;
    serial2 = &uart2;
    serial3 = &uart1;
    ......
```

## 3. Konsole

### 3.1 Treiberpfade

Als Konsole verwendet Rockchip UART den fiq_debugger. Das Rockchip SDK konfiguriert normalerweise uart2 als ttyFIQ0. Treiberdateien:

```text
drivers/staging/android/fiq_debugger/fiq_debugger.c # 驱动文件
drivers/soc/rockchip/rk_fiq_debugger.c              # kernel 4.4及之后的平台实现
arch/arm/mach-rockchip/rk_fiq_debugger.c            # kernel 3.10平台实现
```

### 3.2 menuconfig-Konfiguration

In den verschiedenen Linux-Kernel-Versionen liegen die fiq_debugger-Optionen in menuconfig unter folgendem Pfad:

```text
Device Drivers  --->
    [*] Staging drivers  --->
        Android  --->
```

Empfohlen wird die Standardkonfiguration des Rockchip SDK.

### 3.3 DTS-Konfiguration

Beispiel für den fiq_debugger-DTS-Knoten auf RK3568 mit Linux kernel 4.19. fiq_debugger und normaler UART schließen sich gegenseitig aus; nach Aktivierung von fiq_debugger muss der zugehörige normale uart-Knoten deaktiviert werden.

```text
chosen: chosen {
    bootargs = "earlycon=uart8250,mmio32,0xfe660000 console=ttyFIQ0";
};

fiq-debugger {
    compatible = "rockchip,fiq-debugger";
    rockchip,serial-id = <2>;
    rockchip,wake-irq = <0>;
    /* If enable uart uses irq instead of fiq */
    rockchip,irq-mode-enable = <1>;
    rockchip,baudrate = <1500000>;  /* Only 115200 and 1500000 */
    interrupts = <GIC_SPI 252 IRQ_TYPE_LEVEL_LOW>;
    pinctrl-names = "default";
    pinctrl-0 = <&uart2m0_xfer>;
    status = "okay";
};

&uart2 {
    status = "disabled";
};
```

Parameter: rockchip,serial-id ist die UART-Nummer. Auch bei Auswahl eines anderen UART registriert sich fiq_debugger als ttyFIQ0. rockchip,irq-mode-enable: 1 für IRQ, 0 für FIQ. interrupts ist der konfigurierte Hilfsinterrupt; den Standardwert beibehalten.

### 3.4 parameter.txt konfigurieren

Bei Linux kernel 3.10 und 4.4 muss parameter.txt folgende Konsolenangabe enthalten:

```text
CMDLINE: console=ttyFIQ0 androidboot.console=ttyFIQ0
```

## 4. Treiber-Debugging

Zum Debuggen stehen ts_uart.uart und die Testdateien send_0x55 und send_00_ff zur Verfügung, erhältlich über Rockchip FAE. Das Programm per adb in einen ausführbaren Pfad auf der Platine kopieren; hier wird data verwendet:

```text
adb root
adb remount
adb push ts_uart.uart /data
adb push send_0x55 /data
adb push send_00_ff /data
```

Programmberechtigungen auf der Platine ändern:

```text
su
chmod +x /data/ts_uart.uart
```

Programmhilfe mit folgendem Befehl anzeigen:

```text
console:/ # ./data/ts_uart.uart

 Use the following format to run the HS-UART TEST PROGRAM
 ts_uart v1.1
 For sending data:
 ./ts_uart <tx_rx(s/r)> <file_name> <baudrate> <flow_control(0/1)> <max_delay(0-
100)> <random_size(0/1)>
 tx_rx : send data from file (s) or receive data (r) to put in file
 file_name : file name to send data from or place data in
 baudrate : baud rate used for TX/RX
 flow_control : enables (1) or disables (0) Hardware flow control using RTS/CTS
lines
 max_delay : defines delay in seconds between each data burst when sending.
Choose 0 for continuous stream.
 random_size : enables (1) or disables (0) random size data bursts when sending.
Choose 0 for max size.
 max_delay and random_size are useful for sleep/wakeup over UART testing. ONLY
meaningful when sending data
 Examples:
 Sending data (no delays)
 ts_uart s init.rc 1500000 0 0 0 /dev/ttyS0
 loop back mode:
 ts_uart m init.rc 1500000 0 0 0 /dev/ttyS0
 receive, data must be 0x55
 ts_uart r init.rc 1500000 0 0 0 /dev/ttyS0
```

### 4.1 Senden testen

Befehle zum Sendetest; send_0x55 und send_00_ff sind die zu sendenden Dateien:

```text
./data/ts_uart.uart s ./data/send_0x55 1500000 0 0 0 /dev/ttyS1
./data/ts_uart.uart s ./data/send_00_ff 1500000 0 0 0 /dev/ttyS1
```

Die Übertragung lässt sich über einen USB-UART-Adapter mit einem seriellen Diagnoseprogramm am PC überprüfen.

### 4.2 Empfangen testen

Befehl zum Empfangstest; receive_0x55 ist die Empfangsdatei:

```text
./data/ts_uart.uart r ./data/receive_0x55 1500000 0 0 0 /dev/ttyS1
```

Daten mit dem seriellen PC-Programm senden. Der Test erkennt den korrekten Empfang von U (0x55) automatisch. Für andere Zeichen wird der hexadezimale ASCII-Wert ausgegeben, um die Empfangsdaten vergleichen zu können.

### 4.3 Internen Loopback testen

Befehl zum internen Loopback-Test:

```text
./data/ts_uart.uart m ./data/send_00_ff 1500000 0 0 0 /dev/ttyS1
```

Den Test mit Ctrl+C stoppen und gesendete sowie empfangene Daten im Abschlussprotokoll vergleichen:

```text
Sending data from file to port...
send:1172, receive:1172 total:1172 # 收发数据一致,测试成功
send:3441, receive:3537 total:3441 # 收发数据不一致,测试失败
```

Ein fehlgeschlagener Test deutet auf ein UART-Problem oder ein anderes Programm hin, das denselben Port verwendet. Folgender Befehl zeigt, welche Programme den Port geöffnet haben:

```text
lsof | grep ttyS1
```

### 4.4 Flusssteuerung testen

Zum CTS-Test den CTS-Pin manuell auf High setzen und Daten mit folgendem Befehl senden:

```text
./data/ts_uart.uart s ./data/send_0x55 1500000 1 0 0 /dev/ttyS1
```

Bei CTS=High blockiert das Senden. Wird CTS auf Low freigegeben, werden die blockierten Daten gesendet. RTS prüfen, indem gemessen wird, ob der Pin korrekt zwischen High und Low wechseln kann.

{% endraw %}
