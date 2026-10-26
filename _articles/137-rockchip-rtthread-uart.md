---
title: "Rockchip RT-Thread UART: Serial Ports, termios Tests and Console"
description: "Rockchip RT-Thread UART: Serial Ports, termios Tests and Console — V1.2.0, lts-v3.1.x / lts-v4.1.x"
excerpt: "Rockchip RT-Thread UART: Serial Ports, termios Tests and Console"
translation_key: "137-rockchip-rtthread-uart"
slug: "137-rockchip-rtthread-uart"
lang: "en"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, RT-Thread, UART, termios]
---

{% raw %}

# Rockchip RT-Thread UART: Serial Ports, termios Tests and Console

Complete technical text from Chinese RK-KF-YF-90 V1.2.0, pages 5–7. The source product table says all, with RT-Thread lts-v3.1.x/master and lts-v4.1.x/master; example paths use rockchip-pisces. “All” does not confirm support for every ArmSoM board. Platform reference: verify SoC/BSP, UART pins, voltage, clock tree and console ownership. This is not a Linux serial-driver guide. Only a Chinese source exists, with no standalone figures; all code is retained in four languages. No serial or hardware tests were run.

> The source configuration selects UART0 and UART2, while list_device lists uart0–uart7. These are separate examples, not proof that one configuration creates every device. Both the 4M/optional 8M limit and the need to test above 1.5M are retained; the source does not specify the exact 1.5M boundary.

[ArmSoM Docs](https://docs.armsom.org/) · [RT-Thread](https://github.com/RT-Thread/rt-thread)

## 1. Rockchip UART features

UART (Universal Asynchronous Receiver/Transmitter):

- Compatible with 16550A.
- Some ports support automatic hardware flow control; others do not. Consult the datasheet.
- Interrupt and DMA transfer modes.
- Up to 4M baud; some support 8M. Consult the datasheet.
- Some chips support hardware RS485; consult the datasheet.

## 2. Software

### 2.1 Source paths

Serial framework: serial.c is the device driver; posix_termios.c provides configuration similar to Linux tty.

```text
components/drivers/include/drivers/serial.h
components/drivers/serial/serial.c 设备驱动
components/libc/termios/posix_termios.c 类似linux的tty配置
components/libc/termios/posix_termios.h
```

Serial-driver adaptation layer:

```text
bsp/rockchip-pisces/drivers/drv_uart.c
bsp/rockchip-pisces/drivers/drv_uart.h
```

Serial test commands: user applications can follow this driver example.

```text
bsp/rockchip-common/tests/termios_test.c
```

### 2.2 Configuration

Enable the serial-port configuration; /dev/uart0..9 devices are generated.

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

List the generated serial devices with:

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

### 2.3 Serial-port tests

Enable the serial test program:

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

Test commands for receiving, sending, receiving then sending, and external loopback:

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

### 2.4 Baud-rate support

The source states that rates below 1.5M are supported. Rates above 1.5M require actual testing because support depends on the CLK clock tree.

### 2.5 Console configuration

```text
RT-Thread Kernel  --->
    Kernel Device Object  --->
    [*] Using console for rt_kprintf
        (128) the buffer size for console log printf
        (uart2) the device name for console
```

{% endraw %}
