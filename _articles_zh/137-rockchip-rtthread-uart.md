---
title: "Rockchip RT-Thread UART 开发指南：串口、termios 测试与控制台"
description: "Rockchip RT-Thread UART 开发指南：串口、termios 测试与控制台 — V1.2.0, lts-v3.1.x / lts-v4.1.x"
excerpt: "Rockchip RT-Thread UART 开发指南：串口、termios 测试与控制台"
translation_key: "137-rockchip-rtthread-uart"
slug: "137-rockchip-rtthread-uart"
lang: "zh"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, RT-Thread, UART, termios]
---

{% raw %}

# Rockchip RT-Thread UART 开发指南：串口、termios 测试与控制台

完整整理中文 RK-KF-YF-90 V1.2.0 第5–7页。原稿产品表标all，RT-Thread为lts-v3.1.x/master与lts-v4.1.x/master；示例驱动路径为rockchip-pisces，不能由all推断全部ArmSoM板卡已支持。作为平台参考，核对具体SoC/BSP、UART引脚、电压、时钟树与console占用；本篇不是Linux串口驱动说明。仅中文原稿，无独立技术图，四语保留全部代码。未运行串口或硬件测试。

> 原稿配置仅勾选UART0和UART2，但list_device例子列出uart0–uart7；它们是不同示例，不能据此保证同一配置下生成全部设备。最高4M/部分8M与1.5M以上需实测的说法同时保留，原稿未明确恰好1.5M的边界。

[ArmSoM Docs](https://docs.armsom.org/) · [RT-Thread](https://github.com/RT-Thread/rt-thread)

## 1. Rockchip UART 功能特点

UART (Universal Asynchronous Receiver/Transmitter)：

- 兼容16550A。
- 部分串口支持硬件自动流控，部分不支持，详见数据手册。
- 支持中断传输与DMA传输模式。
- 最高支持4M波特率，部分支持8M，详见数据手册。
- 部分芯片支持硬件RS485，详见数据手册。

## 2. 软件

### 2.1 代码路径

串口框架:

```text
components/drivers/include/drivers/serial.h
components/drivers/serial/serial.c 设备驱动
components/libc/termios/posix_termios.c 类似linux的tty配置
components/libc/termios/posix_termios.h
```

串口驱动适配层:

```text
bsp/rockchip-pisces/drivers/drv_uart.c
bsp/rockchip-pisces/drivers/drv_uart.h
```

串口测试命令,串口用户程序完全可以参照以下驱动:

```text
bsp/rockchip-common/tests/termios_test.c
```

### 2.2 配置

打开串口配置,同时会生成/dev/uart0..9设备。

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

执行命令可以看到已经生成的串口设备:

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

### 2.3 串口测试

使能串口测试程序:

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

串口测试命令:

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

### 2.4 波特率支持

1.5M以下的波特率都可以支持,1.5M以上的波特率需要实际测试看支不支持,因为这跟CLK 时钟树有关。

### 2.5 console配置

```text
RT-Thread Kernel  --->
    Kernel Device Object  --->
    [*] Using console for rt_kprintf
        (128) the buffer size for console log printf
        (uart2) the device name for console
```

{% endraw %}
