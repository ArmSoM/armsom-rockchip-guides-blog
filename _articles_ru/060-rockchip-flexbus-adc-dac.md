---
title: "Руководство Rockchip FLEXBUS ADC/DAC: параллельные преобразователи, DMA и IIO"
description: "Руководство Rockchip FLEXBUS ADC/DAC: параллельные преобразователи, DMA и IIO с полными техническими разделами, кодом, параметрами и замечаниями к исходнику."
translation_key: "060-rockchip-flexbus-adc-dac"
slug: "060-rockchip-flexbus-adc-dac"
lang: "ru"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["Rockchip", "FLEXBUS"]
keywords: "ArmSoM Rockchip rockchip-flexbus-adc-dac"
excerpt: "Руководство Rockchip FLEXBUS ADC/DAC: параллельные преобразователи, DMA и IIO с полными техническими разделами, кодом, параметрами и замечаниями к исходнику."
---

{% raw %}

# Руководство Rockchip FLEXBUS ADC/DAC: параллельные преобразователи, DMA и IIO

Это полный технический материал на основе исходника, справочник по платформе для ArmSoM. Область исходника: RK3576, Linux kernel 6.1. Перед применением проверьте плату, SoC, ветку SDK/BSP, выводы и периферию. Аппаратная проверка не проводилась; поддержка всеми платами ArmSoM не подразумевается. Вывод и числовые результаты — примеры исходника, а не испытания ArmSoM.

Китайская статья следует китайскому исходнику, английская — английскому; русская полностью переводит английский технический текст. Код, комментарии и вывод команд сохраняют язык источника. В технической части исходника нет отдельных технических рисунков или таблиц; вымышленные иллюстрации не добавлялись.

Оба исходника имеют версию V1.0.0.

**Осторожно:** резервирование памяти, DMA, мультиплексирование выводов и запись в устройства влияют на оборудование. Команды приведены для изучения; аппаратные операции не выполнялись. Проверьте схему, питание, тайминги и устройство. xxx и многоточия в DTS — заполнители исходника, а не готовая конфигурация.

**Сомнительные места исходника:** английский §2.3.1 указывает iio:device1, хотя команда и китайское пояснение используют iio:device2. В обоих исходниках §2.3.2 переходит в device0, но следующее приглашение относится к device2. Исходные значения сохранены. Перед записью определите DAC по файлу name; не копируйте номера устройств без проверки.

Источники и исправления: [EDITORIAL-NOTES](/docs/rockchip-flexbus-adc-dac/EDITORIAL-NOTES.md)。Официальные материалы: [ArmSoM](https://docs.armsom.org/), [Rockchip Linux](https://github.com/rockchip-linux).

Таблица версий продукта из исходника (PDF p.2; область исходника, не результат проверки платы):

| SoC | Версия ядра |
| --- | --- |
| RK3576 | 6.1 |

<!-- Source EN PDF p.5, block 0 -->

## 1. Режим FLEXBUS ADC

<!-- Source EN PDF p.5, block 1 -->

### 1.1 Обзор

<!-- Source EN PDF p.5, block 2 -->

В режиме FLEXBUS ADC блок FLEXBUS1 подключается к высокоскоростным параллельным ADC, например TI ADS6144 (https://www.ti.com/product/ADS6144) и ADI LTC2207 (https://www.analog.com/en/products/ltc2207.html). ADC с интерфейсами SPI, I2C и подобными не поддерживаются.

<!-- Source EN PDF p.5, block 3 -->

Тактовая частота до 100MHz

<!-- Source EN PDF p.5, block 4 -->

Разрешение до 16-Bit

<!-- Source EN PDF p.5, block 5 -->

### 1.2 Настройка

<!-- Source EN PDF p.5, block 6 -->

#### 1.2.1 Аппаратная настройка

<!-- Source EN PDF p.5, block 7 -->

Младший бит ADC необходимо подключать к FLEXBUS1_D0: например, 10-Bit ADC — к FLEXBUS1_D[9:0], 16-Bit ADC — к FLEXBUS1_D[15:0].

<!-- Source EN PDF p.5, block 8 -->

В режиме slave устройство подаёт CLK на FLEXBUS1; в режиме master FLEXBUS1 подаёт CLK на устройство.

<!-- Source EN PDF p.5, block 9 -->

#### 1.2.2 Настройка ядра

<!-- Source EN PDF p.5, block 10 -->

Режим FLEXBUS ADC использует подсистему iio/adc.

<!-- Source EN PDF p.5, block 11 -->

`Device Drivers -> Multifunction device drivers -> Rockchip Flexbus`

<!-- Source EN PDF p.5, block 12 -->

`Device Drivers -> Industrial I/O support -> Analog to digital converters -> Rockchip Flexbus ADC opmode driver`

<!-- Source EN PDF p.5, block 13 -->

#### 1.2.3 Настройка dtsi

<!-- Source EN PDF p.5, block 14 -->

Пример для платформы RK3576 и платы RK3576 TEST1 с ADC, подключённым к FLEXBUS1.

<!-- Source EN PDF p.5, block 15 -->

В rk3576.dtsi:

<!-- Source EN PDF p.5, block 16 -->

```text
flexbus: flexbus@2a2f0000 {
    ......
    flexbus_adc: adc {
        compatible = "rockchip,flexbus-adc";
        #io-channel-cells = <0>;
        rockchip,slave-mode; // Configuring this is the slave mode, not configuring this is the master mode
        rockchip,free-sclk; // Configuring this is clock keeps output, not configuring this is clock follows data
        rockchip,auto-pad; // Default configuration
        rockchip,cpol; // Configuring this is CPOL = 1, not configuring this is 0
        rockchip,cpha; // Configuring this is CPHA = 1, not configuring this is 0
        rockchip,dfs = <16>; // data frames
        status = "disabled";
    };
    flexbus_dac: dac {
        ......
    };
};
```

<!-- Source EN PDF p.6, block 18 -->

rockchip,slave-mode: при наличии свойства используется режим slave — устройство подаёт CLK на FLEXBUS1. Без свойства используется master — FLEXBUS1 подаёт CLK на устройство.

<!-- Source EN PDF p.6, block 19 -->

rockchip,free-sclk: при наличии свойства тактовый сигнал выдаётся непрерывно; без него — только во время передачи данных. Настройка действует только в режиме master.

<!-- Source EN PDF p.6, block 20 -->

rockchip,cpol, rockchip,cpha: имеют тот же смысл, что в протоколе SPI; настраиваются по временной диаграмме из документации устройства.

<!-- Source EN PDF p.6, block 21 -->

rockchip,dfs: ширина кадра данных; допустимы только 4, 8, 16. Если разрешение устройства отличается, выберите ближайшее большее допустимое значение. Например, для ADC с разрешением 14-Bit задайте rockchip,dfs = 16, а при приёме программно оставляйте только 14bit данных.

<!-- Source EN PDF p.6, block 22 -->

В arch/arm64/boot/dts/rockchip/rk3576-test1.dtsi:

<!-- Source EN PDF p.6, block 23 -->

```text
&flexbus {
    rockchip,flexbus0-opmode = <ROCKCHIP_FLEXBUS0_OPMODE_xxx>;
    rockchip,flexbus1-opmode = <ROCKCHIP_FLEXBUS1_OPMODE_ADC>; // FLEXBUS1 selects ADC mode
    status = "okay"; // Enable FLEXBUS
};
&flexbus_adc {
    pinctrl-names = "default";
    pinctrl-0 = <&flexbus1m4_csn &flexbus1_clk
             &flexbus1_d0 &flexbus1_d1 &flexbus1_d2 &flexbus1_d3
             &flexbus1_d4 &flexbus1_d5 &flexbus1_d6 &flexbus1_d7
             &flexbus1_d8 &flexbus1_d9 &flexbus1_d10 &flexbus1_d11
             &flexbus1m1_d12 &flexbus1m1_d13 &flexbus1m1_d14 &flexbus1m1_d15>;
// Configure IOMUX for FLEXBUS1 ADC mode
    status = "okay"; // Enable ADC mode
};
```

<!-- Source EN PDF p.7, block 24 -->

#### 1.2.4 Файл драйвера

<!-- Source EN PDF p.7, block 25 -->

Файл драйвера — drivers/iio/adc/rockchip-flexbus-adc.c.

<!-- Source EN PDF p.7, block 26 -->

Функция rockchip_flexbus_adc_read_block() читает данные ADC. Основные операции:

<!-- Source EN PDF p.7, block 27 -->

(1) `rockchip_flexbus_writel(rkfb, FLEXBUS_RX_NUM, num_of_dfs);`

<!-- Source EN PDF p.7, block 28 -->

Настроить объём RX в единицах dfs (rockchip,dfs в dtsi).

<!-- Source EN PDF p.7, block 29 -->

(2) `rockchip_flexbus_writel(rkfb, FLEXBUS_DMA_DST_ADDR0, (ulong)dst_phys >> 2);`

<!-- Source EN PDF p.7, block 30 -->

Задать физический адрес буфера назначения dst.

<!-- Source EN PDF p.7, block 31 -->

(3) `rockchip_flexbus_writel(rkfb, FLEXBUS_DMA_DST_LEN0, dst_len);`

<!-- Source EN PDF p.7, block 32 -->

Задать длину буфера назначения dst.

<!-- Source EN PDF p.7, block 33 -->

(4) `rockchip_flexbus_writel(rkfb, FLEXBUS_ENR, FLEXBUS_RX_ENR);`

<!-- Source EN PDF p.7, block 34 -->

Включить передачу RX.

<!-- Source EN PDF p.7, block 35 -->

(5) `wait_for_completion_timeout(&rkfb_adc->completion, FLEXBUS_ADC_TIMEOUT)`

<!-- Source EN PDF p.7, block 36 -->

Ожидать завершения RX и возникновения прерывания; обработчик — rockchip_flexbus_adc_isr().

<!-- Source EN PDF p.7, block 37 -->

(6) `rockchip_flexbus_writel(rkfb, FLEXBUS_ENR, FLEXBUS_RX_DIS);`

<!-- Source EN PDF p.7, block 38 -->

Отключить передачу RX.

<!-- Source EN PDF p.7, block 39 -->

### 1.3 Основные интерфейсы

<!-- Source EN PDF p.7, block 40 -->

#### 1.3.1 Определение устройства FLEXBUS ADC

<!-- Source EN PDF p.7, block 41 -->

Например:

<!-- Source EN PDF p.7, block 42 -->

```text
root@rk3576-buildroot:/# cat /sys/bus/iio/devices/iio\:device0/name
2a2f0000.flexbus:adc
```

<!-- Source EN PDF p.7, block 43 -->

FLEXBUS ADC соответствует iio:device0.

<!-- Source EN PDF p.7, block 44 -->

#### 1.3.2 Получение значения ADC

<!-- Source EN PDF p.7, block 45 -->

```text
root@rk3576-buildroot:/# cd /sys/bus/iio/devices/iio\:device0
root@rk3576-buildroot:/sys/bus/iio/devices/iio:device0# cat in_voltage_raw
33004
```

<!-- Source EN PDF p.8, block 46 -->

#### 1.3.3 Чтение и изменение тактовой частоты

<!-- Source EN PDF p.8, block 47 -->

Прочитать тактовую частоту:

<!-- Source EN PDF p.8, block 48 -->

```text
root@rk3576-buildroot:/# cd /sys/bus/iio/devices/iio\:device0
root@rk3576-buildroot:/sys/bus/iio/devices/iio:device0# cat in_voltage_sampling_frequency
99000000
```

<!-- Source EN PDF p.8, block 49 -->

Текущая тактовая частота — 99MHz.

<!-- Source EN PDF p.8, block 50 -->

Изменить тактовую частоту:

<!-- Source EN PDF p.8, block 51 -->

```text
root@rk3576-buildroot:/sys/bus/iio/devices/iio:device0# echo 25000000 > in_voltage_sampling_frequency
```

<!-- Source EN PDF p.8, block 52 -->

Тактовая частота изменяется на 25MHz.

<!-- Source EN PDF p.8, block 53 -->

Примечание:

<!-- Source EN PDF p.8, block 54 -->

Чтение и изменение тактовой частоты поддерживаются только в режиме master. В режиме slave CLK поступает от ADC.

<!-- Source EN PDF p.8, block 55 -->

Максимальная тактовая частота — 100MHz.

<!-- Source EN PDF p.8, block 56 -->

## 2. Режим FLEXBUS DAC

<!-- Source EN PDF p.8, block 57 -->

### 2.1 Обзор

<!-- Source EN PDF p.8, block 58 -->

В режиме FLEXBUS DAC блок FLEXBUS0 подключается к высокоскоростным параллельным DAC, например ADI MAX5885 (https://www.analog.com/en/products/max5885.html) и ADI AD9744 (https://www.analog.com/en/products/ad9744.html). DAC с интерфейсами SPI, I2C и подобными не поддерживаются.

<!-- Source EN PDF p.8, block 59 -->

Тактовая частота до 100MHz

<!-- Source EN PDF p.8, block 60 -->

Разрешение до 16-Bit

<!-- Source EN PDF p.8, block 61 -->

### 2.2 Настройка

<!-- Source EN PDF p.8, block 62 -->

#### 2.2.1 Аппаратная настройка

<!-- Source EN PDF p.8, block 63 -->

Младший бит DAC необходимо подключать к FLEXBUS0_D0: например, 10-Bit DAC — к FLEXBUS0_D[9:0], 16-Bit DAC — к FLEXBUS0_D[15:0].

<!-- Source EN PDF p.9, block 64 -->

#### 2.2.2 Настройка ядра

<!-- Source EN PDF p.9, block 65 -->

Режим FLEXBUS DAC использует подсистему iio/dac.

<!-- Source EN PDF p.9, block 66 -->

`Device Drivers -> Multifunction device drivers -> Rockchip Flexbus`

<!-- Source EN PDF p.9, block 67 -->

`Device Drivers -> Industrial I/O support -> Digital to analog converters -> Rockchip Flexbus DAC opmode driver`

<!-- Source EN PDF p.9, block 68 -->

#### 2.2.3 Настройка dtsi

<!-- Source EN PDF p.9, block 69 -->

Пример для платформы RK3576 и платы RK3576 TEST1 с DAC, подключённым к FLEXBUS0.

<!-- Source EN PDF p.9, block 70 -->

В rk3576.dtsi:

<!-- Source EN PDF p.9, block 71 -->

```text
flexbus: flexbus@2a2f0000 {
    ......
    flexbus_adc: adc {
        ......
    };
    flexbus_dac: dac {
        compatible = "rockchip,flexbus-dac";
        #io-channel-cells = <0>;
        rockchip,free-sclk; // Configuring this is clock keeps output, not configuring this is clock follows data
        rockchip,cpol; // Configuring this is CPOL = 1, not configuring this is 0
        rockchip,cpha; // Configuring this is CPHA = 1, not configuring this is 0
        rockchip,dfs = <16>; // data frames
        status = "disabled";
    };
};
```

<!-- Source EN PDF p.9, block 72 -->

rockchip,free-sclk: при наличии свойства тактовый сигнал выдаётся непрерывно; без него — только во время передачи данных.

<!-- Source EN PDF p.9, block 73 -->

rockchip,cpol, rockchip,cpha: имеют тот же смысл, что в протоколе SPI; настраиваются по временной диаграмме из документации устройства.

<!-- Source EN PDF p.9, block 74 -->

rockchip,dfs: ширина кадра данных; допустимы только 4, 8, 16. Если разрешение устройства отличается, выберите ближайшее большее допустимое значение. Например, для DAC с разрешением 14-Bit задайте rockchip,dfs = 16 и заполните нулями bit15 и bit14 передаваемых данных.

<!-- Source EN PDF p.9, block 75 -->

В arch/arm64/boot/dts/rockchip/rk3576-test1.dtsi:

<!-- Source EN PDF p.9, block 76 -->

```text
&flexbus {
    rockchip,flexbus0-opmode = <ROCKCHIP_FLEXBUS0_OPMODE_DAC>; // FLEXBUS0 selects DAC mode
    rockchip,flexbus1-opmode = <ROCKCHIP_FLEXBUS1_OPMODE_xxx>;
    status = "okay"; // Enable FLEXBUS
};
&flexbus_dac {
    pinctrl-names = "default";
    pinctrl-0 = <&flexbus0m4_csn &flexbus0_clk
             &flexbus0_d0 &flexbus0_d1 &flexbus0_d2 &flexbus0_d3
             &flexbus0_d4 &flexbus0_d5 &flexbus0_d6 &flexbus0_d7
             &flexbus0_d8 &flexbus0_d9 &flexbus0_d10 &flexbus0_d11
             &flexbus0_d12 &flexbus0m0_d13 &flexbus0m0_d14 &flexbus0m0_d15>;
// Configure IOMUX for FLEXBUS0 DAC mode
    status = "okay"; // Enable DAC mode
};
```

<!-- Source EN PDF p.10, block 78 -->

#### 2.2.4 Файл драйвера

<!-- Source EN PDF p.10, block 79 -->

Файл драйвера — drivers/iio/dac/rockchip-flexbus-dac.c.

<!-- Source EN PDF p.10, block 80 -->

Функция rockchip_flexbus_dac_write_block() передаёт данные DAC. Основные операции:

<!-- Source EN PDF p.10, block 81 -->

(1) `rockchip_flexbus_writel(rkfb, FLEXBUS_TX_NUM, num_of_dfs);`

<!-- Source EN PDF p.10, block 82 -->

Настроить объём TX в единицах dfs (rockchip,dfs в dtsi).

<!-- Source EN PDF p.10, block 83 -->

(2) `rockchip_flexbus_writel(rkfb, FLEXBUS_TXWAT_START, val);`

<!-- Source EN PDF p.10, block 84 -->

Настроить порог заполнения.

<!-- Source EN PDF p.10, block 85 -->

(3) `rockchip_flexbus_writel(rkfb, FLEXBUS_DMA_SRC_ADDR0, (ulong)src_phys >> 2);`

<!-- Source EN PDF p.10, block 86 -->

Задать физический адрес исходного буфера src.

<!-- Source EN PDF p.10, block 87 -->

(4) `rockchip_flexbus_writel(rkfb, FLEXBUS_DMA_SRC_LEN0, src_len);`

<!-- Source EN PDF p.10, block 88 -->

Задать длину исходного буфера src.

<!-- Source EN PDF p.10, block 89 -->

(5) `rockchip_flexbus_writel(rkfb, FLEXBUS_ENR, FLEXBUS_TX_ENR);`

<!-- Source EN PDF p.10, block 90 -->

Включить передачу TX.

<!-- Source EN PDF p.10, block 91 -->

(6) `wait_for_completion_timeout(&rkfb_dac->completion, FLEXBUS_DAC_TIMEOUT)`

<!-- Source EN PDF p.10, block 92 -->

Ожидать завершения TX и возникновения прерывания; обработчик — rockchip_flexbus_dac_isr().

<!-- Source EN PDF p.10, block 93 -->

(7) `rockchip_flexbus_writel(rkfb, FLEXBUS_ENR, FLEXBUS_TX_DIS);`

<!-- Source EN PDF p.10, block 94 -->

Отключить передачу TX.

<!-- Source EN PDF p.10, block 95 -->

### 2.3 Основные интерфейсы

<!-- Source EN PDF p.10, block 96 -->

#### 2.3.1 Определение устройства FLEXBUS DAC

<!-- Source EN PDF p.10, block 97 -->

Например:

<!-- Source EN PDF p.10, block 98 -->

```text
root@rk3576-buildroot:/# cat /sys/bus/iio/devices/iio\:device2/name
2a2f0000.flexbus:dac
```

<!-- Source EN PDF p.11, block 99 -->

В исходном английском пояснении FLEXBUS DAC соответствует iio:device1; это противоречит iio:device2 в приведённой команде и в китайском пояснении. Значение не заменено без проверки.

<!-- Source EN PDF p.11, block 100 -->

#### 2.3.2 Передача данных DAC

<!-- Source EN PDF p.11, block 101 -->

```text
root@rk3576-buildroot:/# cd /sys/bus/iio/devices/iio\:device0
root@rk3576-buildroot:/sys/bus/iio/devices/iio:device2# echo 16383 > out_voltage_raw
```

<!-- Source EN PDF p.11, block 102 -->

#### 2.3.3 Чтение и изменение тактовой частоты

<!-- Source EN PDF p.11, block 103 -->

Прочитать тактовую частоту:

<!-- Source EN PDF p.11, block 104 -->

```text
root@rk3576-buildroot:/# cd /sys/bus/iio/devices/iio\:device2
root@rk3576-buildroot:/sys/bus/iio/devices/iio:device2# cat out_voltage_sampling_frequency
99000000
```

<!-- Source EN PDF p.11, block 105 -->

Текущая тактовая частота — 99MHz.

<!-- Source EN PDF p.11, block 106 -->

Изменить тактовую частоту:

<!-- Source EN PDF p.11, block 107 -->

```text
root@rk3576-buildroot:/sys/bus/iio/devices/iio:device2# echo 25000000 > out_voltage_sampling_frequency
```

<!-- Source EN PDF p.11, block 108 -->

Тактовая частота изменяется на 25MHz.

<!-- Source EN PDF p.11, block 109 -->

Примечание:

<!-- Source EN PDF p.11, block 110 -->

Максимальная тактовая частота — 100MHz.

{% endraw %}
