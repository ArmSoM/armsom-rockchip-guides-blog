---
title: "Rockchip Linux UART: последовательные порты, консоль, DMA и управление потоком"
description: "Rockchip Linux UART: последовательные порты, консоль, DMA и управление потоком"
excerpt: "Rockchip Linux UART: последовательные порты, консоль, DMA и управление потоком"
translation_key: 155-rockchip-linux-uart
slug: 155-rockchip-linux-uart
lang: ru
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: interfaces
products: []
tags: [ArmSoM, Rockchip, UART, Linux, DMA]
---

{% raw %}

# Rockchip Linux UART: последовательные порты, консоль, DMA и управление потоком

Полностью сверены китайский V1.5.0 и английский V1.5.1. Английская редакция меняет только ID документа; новых технических глав или параметров команд не обнаружено. Различия версий зафиксированы без выдуманных дополнений. Область: Linux kernel 3.10, 4.4 и более поздние платформы, включая примеры 4.19/RK3568.

Только платформенный справочник ArmSoM: сверяйте SoC платы, SDK/BSP, драйвер ядра, DTS, мультиплексирование, уровни и внешнюю схему. Поддержка всех плат не заявляется. Отдельных технических рисунков нет; код, журналы и конфигурации доступны для копирования. Испытания источника не являются измерениями ArmSoM. Команды регистров, прошивки и прочие аппаратные команды не выполнялись.

> Прямой доступ к регистрам, изменение тактирования или отключение консоли могут нарушить связь, отладку и загрузку. Сверяйте конкретный TRM/BSP; адреса RK3568 нельзя переносить на другие чипы.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. Функции

Rockchip UART (Universal Asynchronous Receiver/Transmitter) основан на стандарте 16550A. Полный модуль поддерживает 5, 6, 7 или 8 бит данных; 1, 1.5 или 2 стоп-бита; чётный и нечётный паритет, но не mark/space; FIFO приёма и передачи обычно на 32 или 64 байта; скорость до 4M бод с учётом делителей тактирования чипа; передачу по прерываниям и DMA; автоматическое аппаратное управление потоком RTS+CTS. Фактический набор функций определяется разделом UART руководства конкретного чипа: некоторые UART имеют сокращённые возможности.

## 2. Обычный последовательный порт

### 2.1 Пути драйверов

В Linux kernel 3.10 используются следующие файлы драйвера:

```text
drivers/tty/serial/rk_serial.c
```

В Linux kernel 4.4 и 4.19 используется универсальный драйвер 8250. Основные файлы:

```text
drivers/tty/serial/8250/8250_core.c     # 8250串口驱动核心
drivers/tty/serial/8250/8250_dw.c       # Synopsis DesignWare 8250串口驱动
drivers/tty/serial/8250/8250_dma.c      # 8250串口DMA驱动
drivers/tty/serial/8250/8250_port.c     # 8250串口端口操作
drivers/tty/serial/8250/8250_early.c    # 8250串口early console驱动
```

### 2.2 Настройка menuconfig

В разных версиях Linux kernel настройки UART в menuconfig находятся по следующему пути. Параметры подробно описаны в самом меню и здесь не раскрываются:

```text
Device Drivers  --->
    Character devices  --->
        Serial drivers  --->
```

Рекомендуется стандартная конфигурация UART из Rockchip SDK.

### 2.3 Настройка DTS

В разных версиях Linux kernel конфигурация DTS UART сходна со следующим примером для RK3568, Linux kernel 4.19, файл rk3568.dtsi:

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

В DTS платы разрешено изменять только следующие параметры UART. dma-names: "tx" включает TX DMA, "rx" включает RX DMA, "!tx" отключает TX DMA, "!rx" отключает RX DMA. pinctrl-0: &uart1m0_xfer выбирает iomux group 0 для TX/RX; &uart1m1_xfer — group 1; &uart1m0_ctsn и &uart1m0_rtsn выбирают group 0 для CTS/RTS аппаратного управления потоком; &uart1m1_ctsn и &uart1m1_rtsn — group 1. status: "okay" включает, "disabled" отключает. Например, следующая конфигурация платы включает RK3568 UART1, DMA и group0 для TX, RX, CTS и RTS с аппаратным управлением потоком:

```text
&uart1 {
    dma-names = "tx", "rx";
    pinctrl-names = "default";
    pinctrl-0 = <&uart1m0_xfer &uart1m0_ctsn &uart1m0_rtsn>;
    status = "okay";
};
```

pinctrl-0 лишь настраивает iomux выводов CTS/RTS. Само аппаратное управление потоком включается драйвером UART. Если оно не требуется, настройки iomux CTS/RTS можно убрать.

### 2.4 Скорость передачи

Скорость UART = частота рабочего источника / внутренний делитель / 16. При прямом тактировании от кварца 24M используется внутренний делитель. Если источник поступает из CRU после деления PLL, скорость UART обычно равна 1/16 рабочей частоты. Допустимые скорости и стабильность передачи в основном определяются программной стратегией деления тактового сигнала UART. Драйвер автоматически получает нужную частоту согласно заданной скорости. Проверить рабочую частоту можно командой:

```text
cat /sys/kernel/debug/clk/clk_summary | grep uart
```

Источник заявляет стабильную поддержку обычных скоростей 115200, 460800, 921600, 1500000, 3000000, 4000000 и т. д. Для нестандартных скоростей может понадобиться изменение стратегии деления тактового сигнала.

### 2.5 Использование DMA

DMA заметно снижает нагрузку CPU лишь при больших объёмах данных. Обычно DMA не обязательно быстрее передачи по прерываниям: производительности CPU достаточно, а ограничение находится в периферии. Кроме того, запуск DMA требует дополнительных ресурсов, а неопределённая длина данных UART снижает эффективность DMA. Поэтому обычно рекомендуется стандартный режим прерываний, с таким выводом:

```text
failed to request DMA, use interrupt mode
```

При нехватке каналов DMA можно отключить DMA передачи TX; вывод будет следующим:

```text
got rx dma channels only
```

### 2.6 Автоматическое аппаратное управление потоком

Для автоматического аппаратного управления потоком драйвер UART должен включать эту функцию, а DTS — переключать iomux CTS/RTS. При высокой скорости (от 1.5M бод) и больших объёмах рекомендуется четырёхпроводный UART с аппаратным управлением потоком.

### 2.7 Пробуждение через UART

При пробуждении через UART порт остаётся включённым во время сна, а его прерывание служит источником пробуждения. Добавьте в DTS следующие параметры:

```text
&uart1 {
    wakeup-source;
};
```

Пробуждение через UART требует также изменения прошивки trust; за поддержкой следует обратиться к Rockchip.

### 2.8 Регистрация устройства

После включения UART в DTS следующий вывод загрузки подтверждает регистрацию устройства:

```text
fe650000.serial: ttyS1 at MMIO 0xfe650000 (irq = 67, base_baud = 1500000) is a
16550A
```

Обычные UART нумеруются по aliases в DTS и регистрируются как ttySx. Пример aliases:

```text
aliases {
    serial0 = &uart0;
    serial1 = &uart1;
    serial2 = &uart2;
    serial3 = &uart3;
    ......
```

Чтобы зарегистрировать uart3 как ttyS1, измените конфигурацию так:

```text
aliases {
    serial0 = &uart0;
    serial1 = &uart3;
    serial2 = &uart2;
    serial3 = &uart1;
    ......
```

## 3. Консоль

### 3.1 Пути драйверов

В качестве консоли Rockchip UART использует fiq_debugger. Rockchip SDK обычно настраивает uart2 как ttyFIQ0. Файлы драйвера:

```text
drivers/staging/android/fiq_debugger/fiq_debugger.c # 驱动文件
drivers/soc/rockchip/rk_fiq_debugger.c              # kernel 4.4及之后的平台实现
arch/arm/mach-rockchip/rk_fiq_debugger.c            # kernel 3.10平台实现
```

### 3.2 Настройка menuconfig

В разных версиях Linux kernel параметры fiq_debugger в menuconfig находятся по следующему пути:

```text
Device Drivers  --->
    [*] Staging drivers  --->
        Android  --->
```

Рекомендуется стандартная конфигурация Rockchip SDK.

### 3.3 Настройка DTS

Пример fiq_debugger в DTS для RK3568, Linux kernel 4.19. fiq_debugger и обычный UART взаимно исключают друг друга, поэтому после включения fiq_debugger нужно отключить соответствующий обычный узел uart.

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

Параметры: rockchip,serial-id — номер используемого UART; даже при выборе другого UART устройство fiq_debugger регистрируется как ttyFIQ0. rockchip,irq-mode-enable: 1 — IRQ, 0 — FIQ. interrupts — вспомогательное прерывание; оставьте стандартное значение.

### 3.4 Настройка parameter.txt

Для Linux kernel 3.10 и 4.4 проверьте наличие следующего указания консоли в parameter.txt:

```text
CMDLINE: console=ttyFIQ0 androidboot.console=ttyFIQ0
```

## 4. Отладка драйвера

Для отладки предоставляются программа ts_uart.uart и файлы send_0x55, send_00_ff; их можно получить у Rockchip FAE. Через adb поместите программу в исполняемый каталог платы; ниже используется data:

```text
adb root
adb remount
adb push ts_uart.uart /data
adb push send_0x55 /data
adb push send_00_ff /data
```

Измените разрешения программы на плате:

```text
su
chmod +x /data/ts_uart.uart
```

Получите справку программы командой:

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

### 4.1 Проверка передачи

Команды проверки передачи; send_0x55 и send_00_ff — передаваемые файлы:

```text
./data/ts_uart.uart s ./data/send_0x55 1500000 0 0 0 /dev/ttyS1
./data/ts_uart.uart s ./data/send_00_ff 1500000 0 0 0 /dev/ttyS1
```

Передачу можно проверить на ПК, подключив плату через USB–UART и используя программу отладки последовательного порта.

### 4.2 Проверка приёма

Команда проверки приёма; receive_0x55 — файл принятых данных:

```text
./data/ts_uart.uart r ./data/receive_0x55 1500000 0 0 0 /dev/ttyS1
```

Передавайте данные программой последовательного порта на ПК. Тест автоматически проверяет правильный приём U (0x55). Для других символов выводится шестнадцатеричный ASCII-код, по которому можно проверить правильность приёма.

### 4.3 Внутренняя петля

Команда внутренней петли передачи/приёма:

```text
./data/ts_uart.uart m ./data/send_00_ff 1500000 0 0 0 /dev/ttyS1
```

Остановите тест сочетанием Ctrl+C и сравните переданные и принятые данные в итоговом журнале:

```text
Sending data from file to port...
send:1172, receive:1172 total:1172 # 收发数据一致,测试成功
send:3441, receive:3537 total:3441 # 收发数据不一致,测试失败
```

Ошибка теста указывает на проблему UART либо одновременное использование порта другой программой. Следующая команда показывает программы, открывшие порт:

```text
lsof | grep ttyS1
```

### 4.4 Проверка управления потоком

Для проверки CTS вручную установите высокий уровень на CTS и отправьте данные командой:

```text
./data/ts_uart.uart s ./data/send_0x55 1500000 1 0 0 /dev/ttyS1
```

При высоком CTS передача блокируется. После перевода CTS в низкий уровень заблокированные данные отправляются. RTS проверяется измерением возможности переключения его уровня между высоким и низким.

{% endraw %}
