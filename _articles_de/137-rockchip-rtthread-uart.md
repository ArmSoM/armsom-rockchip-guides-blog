---
title: "Rockchip RT-Thread UART: serielle Ports, termios-Tests und Konsole"
description: "Rockchip RT-Thread UART: serielle Ports, termios-Tests und Konsole — V1.2.0, lts-v3.1.x / lts-v4.1.x"
excerpt: "Rockchip RT-Thread UART: serielle Ports, termios-Tests und Konsole"
translation_key: "137-rockchip-rtthread-uart"
slug: "137-rockchip-rtthread-uart"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, RT-Thread, UART, termios]
---

{% raw %}

# Rockchip RT-Thread UART: serielle Ports, termios-Tests und Konsole

Vollständiger Text des chinesischen RK-KF-YF-90 V1.2.0, Seiten 5–7. Die Produkttabelle nennt all mit RT-Thread lts-v3.1.x/master und lts-v4.1.x/master; Beispielpfade verwenden rockchip-pisces. Daraus folgt keine bestätigte Unterstützung aller ArmSoM-Boards. Plattformreferenz: SoC/BSP, UART-Pins, Spannung, Taktbaum und Konsolenbelegung prüfen. Kein Linux-Treiberleitfaden. Nur chinesische Quelle ohne eigenständige Abbildungen; sämtlicher Code bleibt in vier Sprachen erhalten. Keine seriellen oder Hardwaretests ausgeführt.

> Die Konfiguration wählt UART0 und UART2, list_device zeigt jedoch uart0–uart7. Es handelt sich um getrennte Beispiele, nicht um einen Nachweis aller Geräte bei einer Konfiguration. Sowohl 4M/teilweise 8M als auch die Testpflicht oberhalb 1.5M bleiben erhalten; die exakte Grenze 1.5M ist nicht erläutert.

[ArmSoM Docs](https://docs.armsom.org/) · [RT-Thread](https://github.com/RT-Thread/rt-thread)

## 1. Rockchip-UART-Funktionen

UART (Universal Asynchronous Receiver/Transmitter):

- 16550A-kompatibel.
- Einige Ports unterstützen automatische Hardware-Flusskontrolle, andere nicht; Datenblatt prüfen.
- Interrupt- und DMA-Übertragungsmodi.
- Bis 4M Baud, teilweise 8M; Datenblatt prüfen.
- Manche Chips unterstützen Hardware-RS485; Datenblatt prüfen.

## 2. Software

### 2.1 Quellpfade

Serielles Framework: serial.c ist der Gerätetreiber; posix_termios.c bietet eine Konfiguration ähnlich Linux tty.

```text
components/drivers/include/drivers/serial.h
components/drivers/serial/serial.c 设备驱动
components/libc/termios/posix_termios.c 类似linux的tty配置
components/libc/termios/posix_termios.h
```

Anpassungsschicht des seriellen Treibers:

```text
bsp/rockchip-pisces/drivers/drv_uart.c
bsp/rockchip-pisces/drivers/drv_uart.h
```

Serielle Testbefehle: Benutzeranwendungen können sich an diesem Treiberbeispiel orientieren.

```text
bsp/rockchip-common/tests/termios_test.c
```

### 2.2 Konfiguration

Die serielle Konfiguration aktivieren; Geräte /dev/uart0..9 werden erzeugt.

```text
RT-Thread rockchip RKxxxx drivers  --->
    [*] Enable UART
    [*]   Enable UART0
    [ ]   Enable UART1
    [*]   Enable UART2
    [ ]   Enable UART3
    [ ]   Enable UART4
    [ ]   Enable UART5
    [ ]   Enable UART6
    [ ]   Enable UART7
    [ ]   Enable UART8
    [ ]   Enable UART9
```

Erzeugte serielle Geräte anzeigen:

```text
msh >list_device
device         type         ref count
------ -------------------- ----------
uart7  Character Device     0
uart6  Character Device     0
uart5  Character Device     0
uart4  Character Device     2
uart3  Character Device     0
uart2  Character Device     0
uart1  Character Device     0
uart0  Character Device     0
```

### 2.3 Serielle Tests

Serielles Testprogramm aktivieren:

```text
lts-v3.1.x:
RT-Thread Components  --->
    Device virtual file system  --->
        [*] Using device virtual file system
        -*- Using devfs for device objects
    POSIX layer and C standard library  --->
        [*] Enable termios feature

RT-Thread bsp test case  --->
    RT-Thread Common Test case  --->
        [*] Enable BSP Common TEST
            [*]   Enable BSP Common UART TEST

lts-v4.1.x:
RT-Thread Components  --->
    [*] DFS: device virtual file system  --->
        [*]   Using devfs for device objects
    C/C++ and POSIX layer  --->
        POSIX (Portable Operating System Interface) layer  --->
           [*] Enable POSIX file system and I/O
               [*]   Enable I/O Multiplexing select() <sys/select.h>
               [*]   Enable Terminal I/O <termios.h>

RT-Thread bsp test case  --->
    RT-Thread Common Test case  --->
        [*] Enable BSP Common TEST
            [*]   Enable BSP Common UART TEST
```

Testbefehle für Empfang, Senden, Empfang mit anschließendem Senden und externen Loopback:

```text
receive data:
termtest r /dev/uart4 115200
send data:
termtest s /dev/uart4 115200
receive then send:
termtest t /dev/uart4 115200
externel loopback:
termtest l /dev/uart4 115200
```

### 2.4 Baudratenunterstützung

Laut Quelle werden Baudraten unter 1.5M unterstützt. Oberhalb 1.5M ist ein praktischer Test erforderlich, da die Unterstützung vom CLK-Taktbaum abhängt.

### 2.5 Konsolenkonfiguration

```text
RT-Thread Kernel  --->
    Kernel Device Object  --->
    [*] Using console for rt_kprintf
        (128) the buffer size for console log printf
        (uart2) the device name for console
```

{% endraw %}
