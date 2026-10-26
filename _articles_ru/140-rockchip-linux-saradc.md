---
title: "Rockchip Linux SARADC: драйверы V1/V2/V3, DMA и тестирование"
description: "Rockchip Linux SARADC: драйверы V1/V2/V3, DMA и тестирование — V1.1.0 / V1.0.0"
excerpt: "Rockchip Linux SARADC: драйверы V1/V2/V3, DMA и тестирование"
translation_key: "140-rockchip-linux-saradc"
slug: "140-rockchip-linux-saradc"
lang: "ru"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, Linux, SARADC, DMA]
---

{% raw %}

# Rockchip Linux SARADC: драйверы V1/V2/V3, DMA и тестирование

Общая основа четырёх языков — китайский RK-KF-YF-079 V1.1.0 (8 стр.); уникальные детали английского V1.0.0 (7 стр.) добавлены отдельно. Область китайского источника: Rockchip/Linux 4.4, 4.19, 5.10, 6.1. Справочник не подтверждает поколение SARADC, выводы, опорное напряжение и тестовый интерфейс конкретной платы ArmSoM. Проверьте TRM, BSP и DTS; не переносите IRQ/номера каналов без проверки. Отдельных технических рисунков нет. Аппаратные тесты не выполнялись.

> Обзор источника: 6 каналов, 10bit, 1MSPS при 13MHz; китайский текст называет устройство цифро-аналоговым преобразователем. Эту формулировку и дальнейшие каналы 0–7 нужно сверить с чипом, не исправляя исходные значения догадкой. Оба DTS-примера пишут io-channel-cells без # и связывают 1.8V с 1024; проверьте binding и разрядность. В журнале раздела 6 есть 537 и 538, хотя пояснение называет только 537; всё сохранено.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## 1. Драйвер SARADC

### 1.1 Файл драйвера

Путь драйвера: `drivers/iio/adc/rockchip_saradc.c`

### 1.2 Настройка узла DTS

См. `Documentation/devicetree/bindings/iio/adc/rockchip-saradc.txt`. Параметры:

- `interrupts = <GIC_SPI 62 IRQ_TYPE_LEVEL_HIGH 0>;`: прерывание по завершении преобразования.
- `io-channel-cells = <1>;`: обязательно 1; см. iio-bindings.txt.
- `vref-supply = <&vccadc_ref>;`: опорное напряжение выбирается по оборудованию. Источник указывает максимум 1.8V, соответствующий значению SARADC 1024, и линейную зависимость напряжения и ADC.

## 2. Использование SARADC

### 2.1 Обзор

Как экземпляр IIO SARADC требует инициализации `struct iio_dev` и регистрации через `iio_device_register(indio_dev)`; см. `rockchip_saradc_probe`.

Основной пример — adc-key. Его драйвер использует input: инициализируйте `struct input_polled_dev`, затем вызовите `input_register_polled_device(poll_dev);`; см. `adc_keys_probe` в `drivers/input/keyboard/adc-keys.c`.

Кнопки проверяются через getevent. Если adc-key — event0, команда `getevent -s /dev/input/event0` проходит следующую цепочку:

```text
adc_keys_poll -> iio_read_channel_processed -> iio_channel_read -> chan->indio_dev
->info->read_raw(rockchip_saradc_read_raw) -> iio_convert_raw_to_processed_unlocked
```

Это полный путь опроса adc-key, по которому можно проследить работу SARADC.

### 2.2 Рабочий процесс

#### 2.2.1 Настройка выборки

`rockchip_saradc_read_raw` настраивает выборку. Основная реализация использует callback `start` структуры `struct rockchip_saradc_data`; именно здесь сосредоточены различия трёх версий.

##### 2.2.1.1 rockchip_saradc_start_v1

```text
writel_relaxed(8, info->regs + SARADC_DLY_PU_SOC);
```

Задайте задержку от включения питания до начала выборки.

```text
writel(SARADC_CTRL_POWER_CTRL | (chan->channel & SARADC_CTRL_CHN_MASK) |
SARADC_CTRL_IRQ_ENABLE,info->regs + SARADC_CTRL);
```

Задайте канал, включите прерывания и начните выборку. Это основные шаги настройки V1.

##### 2.2.1.2 rockchip_saradc_start_v2

```text
writel_relaxed(0xc, info->regs + SARADC_T_DAS_SOC);
writel_relaxed(0x20, info->regs + SARADC_T_PD_SOC);
```

Настройте совместимость PHY.

```text
val = FIELD_PREP(SARADC2_EN_END_INT, 1);
val |= SARADC2_EN_END_INT << 16;
writel_relaxed(val, info->regs + SARADC2_END_INT_EN);
```

Включите прерывание END_INT.

```text
val = FIELD_PREP(SARADC2_START, 1) |
    FIELD_PREP(SARADC2_SINGLE_MODE, 1) |
    FIELD_PREP(SARADC2_CONV_CHANNELS, chn);
val |= (SARADC2_START | SARADC2_SINGLE_MODE | SARADC2_CONV_CHANNELS) << 16;
writel(val, info->regs + SARADC2_CONV_CON);
```

Задайте режим и канал, затем начните выборку.

##### 2.2.1.3 rockchip_saradc_start_v3

Настройка V3 без DMA совпадает с V2. Режим DMA V3 вызывает rockchip_saradc_start_v3_dma.

###### 2.2.1.3.1 rockchip_saradc_start_v3_dma

```text
writel_relaxed(0x11, info->regs + SARADC_T_DAS_SOC);
writel_relaxed(0x20, info->regs + SARADC_T_PD_SOC);
writel_relaxed(0x0, info->regs + SARADC_T_SEL_SOC);
```

Настройте совместимость PHY.

```text
val = FIELD_PREP(SARADC3_PMASTER_EN, 1);
val |= SARADC3_PMASTER_EN << 16;
writel_relaxed(val, info->regs + SARADC3_FIFO_CON);
```

Включите FIFO.

```text
writel_relaxed((u64)info->dma_phys >> 32, info->regs + SARADC3_PADDR_BASE_H);
writel_relaxed(((u32)info->dma_phys) >> 2, info->regs + SARADC3_PADDR_BASE_L);
```

Задайте адрес буфера назначения DMA.

```text
writel_relaxed((SARADC3_DMA_SIZE >> 2) - 1, info->regs + SARADC3_PADDR_OFF_MAX);
```

Задайте размер буфера записи DMA.

```text
val = FIELD_PREP(SARADC3_EN_END_MAX_INT, 1);
val |= SARADC3_EN_END_MAX_INT << 16;
writel_relaxed(val, info->regs + SARADC2_END_INT_EN);
```

Настройте прерывание MAX_INT.

```text
val = BIT(chn) << 16 | BIT(chn);
writel_relaxed(val, info->regs + SARADC3_AUTO_CH_EN);
```

Переведите выбранный канал в режим auto.

```text
val = FIELD_PREP(SARADC2_START, 1) |
    FIELD_PREP(SARADC3_AUTO_MODE, 1) |
    FIELD_PREP(SARADC2_CONV_CHANNELS, chn);
val |= (SARADC2_START | SARADC3_AUTO_MODE | SARADC2_CONV_CHANNELS) << 16;
writel(val, info->regs + SARADC2_CONV_CON);
```

Настройте циклическую выборку и запустите её.

#### 2.2.2 Ожидание завершения выборки

```text
wait_for_completion_timeout(&info->completion, SARADC_TIMEOUT)
```

#### 2.2.3 Чтение данных

Завершение вызывает прерывание. `rockchip_saradc_isr` вызывает `rockchip_saradc_read`, сохраняет значение в `info->last_val`, пробуждает `rockchip_saradc_read_raw` и возвращает его через `*val = info->last_val`. Реализации read для версий:

```text
rockchip_saradc_read_v1
rockchip_saradc_read_v2
rockchip_saradc_read_v3
```

Функции read просты и далее источником не разбираются.

#### 2.2.4 Отключение SARADC

Следующая функция отключает SARADC. Ручное отключение нужно только V1; V2/V3 отключаются автоматически после выборки.

```text
rockchip_saradc_power_down
```

#### 2.2.5 Итог

Полный цикл: `rockchip_saradc_read_raw` настраивает и включает SARADC, запускает выборку и ждёт прерывания. Обработчик сбрасывает прерывание, читает значение, пробуждает `rockchip_saradc_read_raw`, возвращает результат и выключает SARADC.

## 3. Конфигурация ядра

```text
Symbol: ROCKCHIP_SARADC [=y]
Type  : tristate
Prompt: Rockchip SARADC driver
    Location:
        -> Device Drivers
            -> Industrial I/O support (IIO [=y])
(1)             -> Analog to digital converters
    Defined at drivers/iio/adc/Kconfig:319
    Depends on: IIO [=y] && (ARCH_ROCKCHIP [=y] || ARM && COMPILE_TEST [=n]) &&
    RESET_CONTROLLER [=y]
```

## 4. Основные интерфейсы SARADC

1. Получение ADC из userspace; * — номер канала:

```sh
cat /sys/bus/iio/devices/iio\:device0/in_voltage*_raw
```

Например, channel0:

```sh
cat /sys/bus/iio/devices/iio\:device0/in_voltage0_raw
```

2. Интерфейсы ядра: `iio_read_channel_raw()` получает ADC, `iio_read_channel_processed()` — напряжение.

## 5. Улучшения V2/V3

V2 несовместима с V1 и добавляет прерывания по порогу и автоматическую выборку.

V3 совместима с V2 и добавляет запись DMA во внешнюю память.

## 6. Тестовый интерфейс

Включите:

```text
CONFIG_ROCKCHIP_SARADC_TEST_CHN
```

В sys появится узел saradc_test_chn. Найдите полный путь:

```text
echo chn > /sys/full_path_of_saradc_test_chn/saradc_test_chn
```

При chn 0–7 соответствующий канал опрашивается циклически, а порт выводит:

```text
chn[0] val = 537
chn[0] val = 537
chn[0] val = 538
```

Источник описывает этот журнал как значение 537 канала 0.

```text
echo 8 > /sys/full_path_of_saradc_test_chn/saradc_test_chn
```

Для остановки запишите число больше максимального допустимого номера канала, например 8.

## Дополнение английского V1.0.0: старая реализация V1

Английские стр.5–6 уточняют задержку в 8 тактов sclk, включение питания, выбор канала, разрешение прерываний и запуск. После завершения и прерывания результат присваивается val; `iio_convert_raw_to_processed_unlocked` преобразует его в напряжение. Старый ISR непосредственно читает SARADC_DATA, затем записью 0 сбрасывает прерывание и отключает SARADC:

```c
*val = info->last_val;
info->last_val = readl_relaxed(info->regs + SARADC_DATA);
writel_relaxed(0, info->regs + SARADC_CTRL);
```

{% endraw %}
