---
title: "Rockchip RK3399 MCU: Perilp M0, Mailbox, сборка и отладка"
description: "Все адреса загрузки MCU, SGRF, тактирование/сброс, SWD, SCPI и код с различиями веток CN/EN."
translation_key: "082-rockchip-rk3399-mcu"
slug: "082-rockchip-rk3399-mcu"
lang: "ru"
date: "2026-10-20"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "RK3399", "MCU", "Cortex-M0"]
keywords: "ArmSoM Rockchip RK3399 MCU Cortex-M0 Mailbox"
excerpt: "Все адреса загрузки MCU, SGRF, тактирование/сброс, SWD, SCPI и код с различиями веток CN/EN."
---

{% raw %}

# Rockchip RK3399 MCU: Perilp M0, Mailbox, сборка и отладка

## Применимость к ArmSoM и различия источников

Справочный материал для адаптации ArmSoM по CN/EN RK3399 MCU V1.3.0. Исходник относится к RK3399, Linux 4.4 и старой цепочке miniloader/ATF/U-Boot SDK, а не ко всем платам ArmSoM или RK3588/RK3576. Сверьте плату, SDK/BSP, драйверы, безопасный резерв DDR, прошивку и соединения SWD. Аппаратной проверки нет; код, регистры и частоты — примеры исходника, не тесты ArmSoM.

По решению пользователя все четыре языка используют ветку rk3399-box-m0 из китайского исходника; английский оригинал указывает rk3399-pmu-m0. Оба варианта явно отмечены. Версия обоих PDF V1.3.0, но ID/объём различаются: CN RK-KF-YF-124/11 страниц, EN RK-KF-YF-123/10 страниц. Упоминание Jlink из английского сохранено с указанием источника. Технических рисунков в PDF нет; вымышленные не добавлены.

[Редакционные примечания](/docs/rockchip-rk3399-mcu/EDITORIAL-NOTES.md) · [ArmSoM Docs](https://docs.armsom.org/) · [Rockchip MCU](https://github.com/rockchip-linux/mcu)

| SoC исходника | Ядро исходника |
| --- | --- |
| RK3399 | 4.4 |

<!-- Source EN PDF p.3, unit 0 -->

## 1. Обзор MCU Rockchip

<!-- Source EN PDF p.3, unit 1 -->

Семейство ARM® Cortex®-M отличается простотой, удобством, высокой эффективностью и сверхнизким энергопотреблением.

<!-- Source EN PDF p.3, unit 2 -->

Cortex-M позволяет реализовать больше функций при меньшей стоимости. Повторное использование кода и эффективность разработки делают семейство распространённым во встраиваемых устройствах. Далее кратко описан Cortex-M0.

<!-- Source EN PDF p.3, unit 3 -->

Cortex-M0 использует ARMv6-M: высокоинтегрированное малопотребляющее 32-битное ядро с архитектурой фон Неймана, 16-битным набором Thumb и технологией Thumb-2.

<!-- Source EN PDF p.3, unit 4 -->

С учётом преимуществ ARM® Cortex®-M интегрированные MCU Rockchip описаны ниже.

<!-- Source EN PDF p.3, unit 5 -->

В RK3399 два Cortex-M0: PMU M0 используется ATF, а Perilp M0 доступен для собственной разработки.

<!-- Source EN PDF p.3, unit 6 -->

## 2. Основы разработки

<!-- Source EN PDF p.3, unit 7 -->

### 2.1 Конфигурация перед запуском

<!-- Source EN PDF p.3, unit 8 -->

Основные методы разработки MCU Rockchip показаны на примере RK3399 Perilp M0.

<!-- Source EN PDF p.3, unit 9 -->

#### 2.1.1 Адрес загрузки

<!-- Source EN PDF p.3, unit 10 -->

Пример использует обычную цепочку загрузки `miniloader + ATF + u-boot`.

<!-- Source EN PDF p.3, unit 11 -->

В этом варианте BIN MCU и BIN ATF обычно упаковываются вместе в `trust.img`. Добавьте следующую конфигурацию упаковки в U-Boot.

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

`PATH` задаёт путь BIN MCU, `ADDR` — адрес загрузки в DDR, соответствующий началу адресного пространства MCU. В DDR необходимо зарезервировать безопасную область. Адрес передаётся miniloader, который загружает код MCU из ROM в эту область DDR.

<!-- Source EN PDF p.4, unit 14 -->

Если загрузчиком первого уровня служит U-Boot или другой loader, прошивку M0 можно упаковать и загрузить аналогично.

<!-- Source EN PDF p.4, unit 15 -->

Сборка BIN MCU описана в разделе 3.2.2.

<!-- Source EN PDF p.4, unit 16 -->

#### 2.1.2 Отображение адресов

<!-- Source EN PDF p.4, unit 17 -->

Cortex-M0/Cortex-M3 имеют фиксированную карту памяти, облегчающую перенос ПО между системами. Пространство разделено на сегменты: см. Cortex-M0 Devices Generic User Guide, 2.2 Memory model, и RK3399 TRM, 7.4.2. Обычно достаточно настроить отображение `0x00000000-0x1FFFFFFF` MCU.

<!-- Source EN PDF p.4, unit 18 -->

Отображение RK3399 M0 настраивается через SGRF. Выполняйте настройку из модуля с доступом к SGRF, обычно miniloader или ATF. Для адреса загрузки из 2.1.1 настройка следующая.

<!-- Source EN PDF p.4, unit 19 -->

Конфигурация адреса загрузки:

<!-- Source EN PDF p.4, unit 20 -->

```text
sgrf_perilp_m0_con7 = 0xf << (4 + 16) | (0x080000 >> 28) & 0x0f
sgrf_perilp_m0_con15 = 0xffff << 16 | (0x80000 >> 12) & 0xffff
```

<!-- Source EN PDF p.4, unit 21 -->

Конфигурация периферийных адресов:

<!-- Source EN PDF p.4, unit 22 -->

Отображение периферии `0x40000000-0x5FFFFFFF` в MCU Rockchip настроено по умолчанию:

<!-- Source EN PDF p.4, unit 23 -->

`ADDR_MCU = ADDR_CA72 – 0xB8000000`

<!-- Source EN PDF p.4, unit 24 -->

Речь о периферии из RK3399 TRM, Chapter 2 System Overview.

<!-- Source EN PDF p.4, unit 25 -->

#### 2.1.3 Конфигурация тактовой частоты

<!-- Source EN PDF p.4, unit 26 -->

Источником тактирования MCU может быть CPLL или GPLL. Согласно RK3399 TRM, Chapter 3 CRU, регистр настройки — `CRU_CLKSEL_CON24 (0x0160)`:

<!-- Source EN PDF p.4, unit 27 -->

- `bit[15]`: выбор источника, `1’b0: CPLL`; `1’b1: GPLL`.
- `bit[12:8]`: делитель рабочей частоты MCU.

<!-- Source EN PDF p.4, unit 28 -->

Пример кода U-Boot:

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

#### 2.1.4 Снятие сброса

<!-- Source EN PDF p.5, unit 31 -->

Последний шаг запуска MCU — снятие сброса. См. RK3399 TRM, Chapter 3 CRU. Исходник указывает следующий регистр для RK3399 Perilp M0:

<!-- Source EN PDF p.5, unit 32 -->

`PMUCRU_SOFTRST_CON0(0x0110)`

`PMUCRU_SOFTRST_CON0[5:0] = 4b’0000.`

<!-- Source EN PDF p.5, unit 33 -->

Пример кода:

<!-- Source EN PDF p.5, unit 34 -->

```text
arch/arm/cpu/armv8/rk33xx/clock-rk3399.c
#ifdef CONFIG_PERILP_MCU
    /* perilp m0 dereset */
    cru_writel(0x00160000, CRU_SOFTRSTS_CON(11));
#endif
```

<!-- Source EN PDF p.5, unit 35 -->

Настройку тактирования и сброса можно поместить в точку, где должен стартовать MCU. В описанном Rockchip SDK она находится в U-Boot.

<!-- Source EN PDF p.5, unit 36 -->

### 2.2 Другие настройки

<!-- Source EN PDF p.5, unit 37 -->

#### 2.2.1 Включение JTAG

<!-- Source EN PDF p.5, unit 38 -->

JTAG используется для трассировки, отладки и поиска ошибок MCU. Интерфейс JTAG MCU Rockchip работает в двухпроводном режиме SWD; для подключения настройте JTAG iomux.

<!-- Source EN PDF p.5, unit 39 -->

Настройка iomux RK3399 Perilp M0 описана в RK3399 TRM, Chapter 7.3. В исходнике перечислены два регистра (обе строки одинаковы):

<!-- Source EN PDF p.5, unit 40 -->

```text
GRF_GPIO4B_IOMUX[9:8] = 2’b10
GRF_GPIO4B_IOMUX[9:8] = 2’b10
```

<!-- Source EN PDF p.6, unit 41 -->

### 2.3 Связь MCU с основным SoC

<!-- Source EN PDF p.6, unit 42 -->

#### 2.3.1 Mailbox

<!-- Source EN PDF p.6, unit 43 -->

Mailbox SoC Rockchip имеет четыре канала с прерываниями; данные передаются через общую память. MCU может обмениваться с главным SoC через mailbox. Для RK3399 см. TRM Chapter 21 Mailbox, для RK3368 — TRM Chapter 11 Mailbox.

<!-- Source EN PDF p.6, unit 44 -->

В Linux 4.4 верхний уровень Mailbox Driver использует ARM SCPI. Включите `CONFIG_RK3368_MBOX` и `CONFIG_RK3368_SCPI_PROTOCOL` в ядре. На стороне MCU также нужны драйвер mailbox и поддержка SCPI.

<!-- Source EN PDF p.6, unit 45 -->

Пример конфигурации DTS ядра:

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

#### 2.3.2 Общая память

<!-- Source EN PDF p.6, unit 48 -->

Для связи можно выделить область INTMEM (SRAM), доступную и главному SoC, и MCU. Это реализует обмен через общую память.

<!-- Source EN PDF p.6, unit 49 -->

Также возможна связь через UART и другие механизмы.

<!-- Source EN PDF p.7, unit 50 -->

## 3. Демонстрационная программа

<!-- Source EN PDF p.7, unit 51 -->

### 3.1 Получение кода

<!-- Source EN PDF p.7, unit 52 -->

Git-репозиторий:

<!-- Source EN PDF p.7, unit 53 -->

[Rockchip MCU](https://github.com/rockchip-linux/mcu)

<!-- Source EN PDF p.7, unit 54 -->

По решению пользователя используйте ветку `rk3399-box-m0` из китайского PDF. Английский исходник вместо неё указывает `rk3399-pmu-m0`. Обе записи сохранены здесь как различие источников, а не как подтверждение пригодности ветки для любой платы.

<!-- Source EN PDF p.7, unit 55 -->

### 3.2 Обзор кода

<!-- Source EN PDF p.7, unit 56 -->

#### 3.2.1 Структура каталогов

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

`build`: скомпилированные файлы obj и bin.

<!-- Source EN PDF p.7, unit 59 -->

`include`: заголовочные файлы.

<!-- Source EN PDF p.7, unit 60 -->

`src`: исходные файлы.

<!-- Source EN PDF p.7, unit 61 -->

`startup.c` — точка входа M0 с таблицей векторов прерываний и обработчиками. `main.c` содержит главную функцию программы M0.

<!-- Source EN PDF p.8, unit 62 -->

#### 3.2.2 Сборка

<!-- Source EN PDF p.8, unit 63 -->

Используйте кросс-компилятор gcc-arm-none-eabi-v4.8 или новее. Способ сборки:

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

Сборка создаёт `build/RK3399M0/bin/RK3399M0.bin`. Скопируйте `RK3399M0.bin` в `tools/rk_tools/bin/rk33/` U-Boot и переименуйте в `rk3399bl30_v1.00.bin`. Примените настройку 2.1.1 и пересоберите U-Boot, чтобы включить BIN M0 в `trust.img`.

<!-- Source EN PDF p.8, unit 66 -->

#### 3.2.3 Программирование прерываний

<!-- Source EN PDF p.8, unit 67 -->

Таблица векторов M0 описана в Cortex-M0 Devices Generic User Guide, Chapter 2.3 Exception model.

<!-- Source EN PDF p.8, unit 68 -->

Пример из `src/startup.c`:

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

Cortex-M0 имеет 16 внутренних исключений: `g_pfnVectors[0]`–`g_pfnVectors[15]`. Зарегистрируйте и реализуйте нужные обработчики для приложения.

<!-- Source EN PDF p.9, unit 72 -->

Поддерживаются 32 внешних прерывания: `g_pfnVectors[16]`–`g_pfnVectors[47]`.

<!-- Source EN PDF p.9, unit 73 -->

Арбитр RK3399 Perilp M0 расширяет 32 внешних прерывания до 256. См. RK3399 TRM, 7.4.6 Interrupt Source Arbiter for PERILPM0. Для арбитра настройте mask bit; получив прерывание, M0 определяет конкретный источник по соответствующим битам.

<!-- Source EN PDF p.9, unit 74 -->

Интерфейс арбитра находится в `include/rk3399.h`:

<!-- Source EN PDF p.9, unit 75 -->

```text
M0_INT_ARB_SET_MASK() // Set interrupt mask
M0_INT_ARB_GET_FLAG() // Get interrupt bit
```

<!-- Source EN PDF p.9, unit 76 -->

Поддерживаемые внешние прерывания перечислены в RK3399 TRM, 2.4 System Interrupt Connection for Cortex-M0.

<!-- Source EN PDF p.9, unit 77 -->

## 4. Отладка MCU

<!-- Source EN PDF p.9, unit 78 -->

### 4.1 Отладка JTAG

<!-- Source EN PDF p.9, unit 79 -->

Настройте iomux, tck и tms JTAG в GRF согласно 2.2.1.

<!-- Source EN PDF p.9, unit 80 -->

Переключите JTAG или tck/tms на плате в положение MCU.

<!-- Source EN PDF p.9, unit 81 -->

Подключите MCU через DS-5, ICE или Jlink для отладки. Китайский исходник перечисляет DS-5 и ICE, английский дополнительно Jlink.

<!-- Source EN PDF p.9, unit 82 -->

### 4.2 Вывод через UART

<!-- Source EN PDF p.9, unit 83 -->

M0 может обращаться к регистрам UART напрямую для отладочного вывода.

<!-- Source EN PDF p.9, unit 84 -->

Если MCU и главный SoC используют один UART, отключайте вывод M0 в обычной работе, чтобы конфликты доступа UART не нарушили работу системы.

<!-- Source EN PDF p.9, unit 85 -->

### 4.3 Чтение и запись регистров

<!-- Source EN PDF p.9, unit 86 -->

Остановите систему в командной строке U-Boot или ядра и читайте регистры состояния MCU через io.

<!-- Source EN PDF p.9, unit 87 -->

Другой способ — записать состояние ключевых точек MCU в свободные регистры GRF и прочитать их из U-Boot или ядра для определения текущего состояния MCU.

<!-- Source EN PDF p.10, unit 88 -->

## 5. Справочные документы

<!-- Source EN PDF p.10, unit 89 -->

Документы сторонних разработчиков:

<!-- Source EN PDF p.10, unit 90 -->

- Cortex-M0 Devices Generic User Guide
- Cortex-M0 Technical Reference Manual
- Rockchip RK3399 TRM V1.4

{% endraw %}
