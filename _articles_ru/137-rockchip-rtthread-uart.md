---
title: "Rockchip RT-Thread UART: порты, тесты termios и консоль"
description: "Rockchip RT-Thread UART: порты, тесты termios и консоль — V1.2.0, lts-v3.1.x / lts-v4.1.x"
excerpt: "Rockchip RT-Thread UART: порты, тесты termios и консоль"
translation_key: "137-rockchip-rtthread-uart"
slug: "137-rockchip-rtthread-uart"
lang: "ru"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, RT-Thread, UART, termios]
---

{% raw %}

# Rockchip RT-Thread UART: порты, тесты termios и консоль

Полный текст китайского RK-KF-YF-90 V1.2.0, стр.5–7. В таблице продуктов указано all, RT-Thread lts-v3.1.x/master и lts-v4.1.x/master; пути примеров — rockchip-pisces. Это не подтверждение всех плат ArmSoM. Платформенный справочник: проверьте SoC/BSP, выводы UART, напряжение, тактирование и использование порта консолью. Это не руководство драйвера Linux. Только китайский источник, без отдельных рисунков; весь код сохранён в четырёх языках. Проверки порта и оборудования не выполнялись.

> В конфигурации выбраны UART0 и UART2, а list_device показывает uart0–uart7. Это разные примеры, не гарантия всех устройств при одной настройке. Сохранены предел 4M/частично 8M и требование проверки выше 1.5M; точная граница 1.5M источником не уточнена.

[ArmSoM Docs](https://docs.armsom.org/) · [RT-Thread](https://github.com/RT-Thread/rt-thread)

## 1. Возможности UART Rockchip

UART (Universal Asynchronous Receiver/Transmitter):

- Совместимость с 16550A.
- Часть портов поддерживает автоматическое аппаратное управление потоком, часть нет; см. документацию чипа.
- Передача по прерываниям и DMA.
- До 4M бод, у некоторых 8M; см. документацию.
- Некоторые чипы поддерживают аппаратный RS485; см. документацию.

## 2. Программное обеспечение

### 2.1 Пути исходников

Фреймворк последовательного порта: serial.c — драйвер устройства; posix_termios.c обеспечивает настройку, подобную Linux tty.

```text
components/drivers/include/drivers/serial.h
components/drivers/serial/serial.c 设备驱动
components/libc/termios/posix_termios.c 类似linux的tty配置
components/libc/termios/posix_termios.h
```

Уровень адаптации драйвера:

```text
bsp/rockchip-pisces/drivers/drv_uart.c
bsp/rockchip-pisces/drivers/drv_uart.h
```

Тестовые команды: пользовательские программы могут использовать этот драйвер как пример.

```text
bsp/rockchip-common/tests/termios_test.c
```

### 2.2 Конфигурация

Включите конфигурацию портов; создаются устройства /dev/uart0..9.

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

Просмотр созданных устройств:

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

### 2.3 Проверка последовательного порта

Включите тестовую программу:

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

Команды приёма, передачи, приёма с последующей передачей и внешнего loopback:

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

### 2.4 Поддерживаемые скорости

По источнику скорости ниже 1.5M поддерживаются. Выше 1.5M требуется реальная проверка, поскольку поддержка зависит от дерева тактирования CLK.

### 2.5 Настройка консоли

```text
RT-Thread Kernel  --->
    Kernel Device Object  --->
    [*] Using console for rt_kprintf
        (128) the buffer size for console log printf
        (uart2) the device name for console
```

{% endraw %}
