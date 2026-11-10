---
title: "RK730: 65 регистров, значения сброса и группы управления"
description: "Полная сводка регистров datasheet с проверками аналогового питания, ADC/DAC, громкости и I2S."
excerpt: "Полная сводка регистров datasheet с проверками аналогового питания, ADC/DAC, громкости и I2S."
translation_key: "rk730-register-map-reference"
slug: "rk730-register-map-reference"
lang: "ru"
date: "2026-11-10"
author: "ArmSoM Editorial"
category: "production"
products: ["CM1", "Forge1"]
tags: ["RK730", "datasheet", "hardware design", "ArmSoM"]
image: "/assets/datasheet-series-20261110/rk730-datasheet-p10.png"
---

Статья основана на указанной редакции datasheet. Значения являются спецификациями производителя, а не измерениями ArmSoM; новых аппаратных испытаний не проводилось. Проверьте ревизию кристалла, схему платы, SDK/BSP, ядро и драйверы. Пояснения и редактируемые таблицы помогают чтению; полная спецификация и не рассмотренные подробно битовые поля находятся в исходном PDF.

**RK730 · Rockchip RK730 Datasheet V1.0-20241118.pdf · PDF 20–43.**


[![RK730: 65 регистров, значения сброса и группы управления](/assets/datasheet-series-20261110/rk730-datasheet-p10.png)](/assets/datasheet-series-20261110/rk730-datasheet-p10.png)

*Английский оригинал, PDF, стр. 10.*


## Адрес шины, смещение и битовое поле

CE выбирает I2C-адрес 0x16/0x17; 0x0000 и другие значения ниже — смещения регистров. B означает 8-bit данные, четыре цифры смещения не делают данные 16-bit. Сброс не равен рабочей инициализации. Проверяйте права доступа по битовым полям, не считайте все пропуски адресов доступными для записи.

## Полная сводка регистров



| Регистр | Смещение | Ширина | Сброс |
|---|---|---|---|
| `CODEC_HK_TOP_0` | `0x0000` | `B` | `0x08` |
| `CODEC_HK_TOP_1` | `0x0001` | `B` | `0xC0` |
| `CODEC_HK_TOP_2` | `0x0002` | `B` | `0x00` |
| `CODEC_HK_TRIM` | `0x0003` | `B` | `0x00` |
| `CODEC_ADC_0` | `0x0004` | `B` | `0x03` |
| `CODEC_ADC_1` | `0x0005` | `B` | `0x42` |
| `CODEC_ADC_2` | `0x0006` | `B` | `0x02` |
| `CODEC_ADC_3` | `0x0007` | `B` | `0x05` |
| `CODEC_DAC_0` | `0x0008` | `B` | `0x07` |
| `CODEC_DAC_1` | `0x0009` | `B` | `0x70` |
| `CODEC_MIC_BOOST_0` | `0x000a` | `B` | `0x01` |
| `CODEC_MIC_BOOST_1` | `0x000b` | `B` | `0x01` |
| `CODEC_MIC_BOOST_2` | `0x000c` | `B` | `0x01` |
| `CODEC_MIC_BOOST_3` | `0x000d` | `B` | `0x01` |
| `CODEC_ADC_PGA_BLOCK_0` | `0x000e` | `B` | `0x01` |
| `CODEC_ADC_PGA_BLOCK_1` | `0x000f` | `B` | `0x01` |
| `CODEC_SYSPLL_0` | `0x0010` | `B` | `0xff` |
| `CODEC_SYSPLL_3` | `0x0013` | `B` | `0x04` |
| `CODEC_LDO` | `0x001f` | `B` | `0x11` |
| `CODEC_MIC_BIAS` | `0x0020` | `B` | `0x09` |
| `CODEC_HP_0` | `0x0021` | `B` | `0xAC` |
| `CODEC_HP_1` | `0x0022` | `B` | `0x80` |
| `CODEC_HP_2` | `0x0023` | `B` | `0x00` |
| `CODEC_SPK_0` | `0x0024` | `B` | `0xAC` |
| `CODEC_SPK_1` | `0x0025` | `B` | `0x80` |
| `CODEC_DTOP_DIGEN_CLKE` | `0x0040` | `B` | `0x00` |
| `CODEC_DTOP_SRT` | `0x0041` | `B` | `0x00` |
| `CODEC_DADC_SEL` | `0x0042` | `B` | `0x00` |
| `CODEC_DDAC_SEL` | `0x0043` | `B` | `0x88` |
| `CODEC_DTOP_VUCTL` | `0x0044` | `B` | `0x03` |
| `CODEC_DTOP_VUCTIME` | `0x0045` | `B` | `0xFF` |
| `CODEC_DADC_VOLL` | `0x0046` | `B` | `0x00` |
| `CODEC_DADC_VOLR` | `0x0047` | `B` | `0x00` |
| `CODEC_DDAC_VOLL` | `0x0048` | `B` | `0x00` |
| `CODEC_DDAC_VOLR` | `0x0049` | `B` | `0x00` |
| `CODEC_DADC_RVOLL` | `0x004a` | `B` | `0xFF` |
| `CODEC_DADC_RVOLR` | `0x004b` | `B` | `0xFF` |
| `CODEC_DDAC_RVOLL` | `0x004c` | `B` | `0xFF` |
| `CODEC_DDAC_RVOLR` | `0x004d` | `B` | `0xFF` |
| `CODEC_DADC_FILTER` | `0x004e` | `B` | `0x1E` |
| `CODEC_DDAC_FILTER` | `0x004f` | `B` | `0xF4` |
| `CODEC_DDAC_PREL` | `0x0050` | `B` | `0x00` |
| `CODEC_DDAC_PRER` | `0x0051` | `B` | `0x00` |
| `CODEC_DDAC_POSTL` | `0x0052` | `B` | `0x1F` |
| `CODEC_DDAC_POSTR` | `0x0053` | `B` | `0x1F` |
| `CODEC_DDAC_DRC0` | `0x005e` | `B` | `0x9A` |
| `CODEC_DDAC_DRC1` | `0x005f` | `B` | `0xCC` |
| `CODEC_DDAC_DRC2` | `0x0060` | `B` | `0x1F` |
| `CODEC_DDAC_DRC3` | `0x0061` | `B` | `0xCC` |
| `CODEC_DDAC_DRC4` | `0x0062` | `B` | `0x0E` |
| `CODEC_DDAC_DRC5` | `0x0063` | `B` | `0x08` |
| `CODEC_DDAC_DRC6` | `0x0064` | `B` | `0x06` |
| `CODEC_DDAC_DRC7` | `0x0065` | `B` | `0x02` |
| `CODEC_DDAC_DRC8` | `0x0066` | `B` | `0x05` |
| `CODEC_DDAC_DRC9` | `0x0067` | `B` | `0x01` |
| `CODEC_READ1` | `0x0068` | `B` | `0x00` |
| `CODEC_DI2S_CKM` | `0x0069` | `B` | `0x01` |
| `CODEC_DI2S_OFFSET` | `0x006a` | `B` | `0x00` |
| `CODEC_DI2S_RSD` | `0x006b` | `B` | `0x00` |
| `CODEC_DI2S_RXCR1` | `0x006c` | `B` | `0x00` |
| `CODEC_DI2S_RXCR2` | `0x006d` | `B` | `0x17` |
| `CODEC_DI2S_RXCMD_TSD` | `0x006e` | `B` | `0x00` |
| `CODEC_DI2S_TXCR1` | `0x006f` | `B` | `0x00` |
| `CODEC_DI2S_TXCR2` | `0x0070` | `B` | `0x17` |
| `CODEC_DI2S_TXCR3_TXCMD` | `0x0071` | `B` | `0x00` |



## Сопоставление драйвера по группам



| Параметр | Спецификация / примечание |
|---|---|
| HK_TOP / 0x0000–0x0003 | Опоры, генератор, смещение и аналоговое управление |
| ADC / 0x0004–0x0007 | Питание и управление аналоговым ADC |
| DAC / 0x0008–0x0009 | Питание и управление аналоговым DAC |
| MIC / PGA / 0x000a–0x000f | Усиление микрофона и предусилитель |
| 0x0010 / 0x0013 / 0x001f | Системный PLL, управление PLL, смещение; адреса непоследовательны |
| 0x0020–0x0025 | Управление аналоговым выходом наушников |
| 0x0040–0x0053 | Цифровые ADC/DAC, частота, громкость и фильтрация |
| 0x005e–0x0071 | AGC, микширование и I2S; используйте только адреса сводки |



## Пример: HK_TOP_0 не единый переключатель байта



| Параметр | Спецификация / примечание |
|---|---|
| 0x0000[7] / [6] | Тестовое управление VREF / OSC |
| 0x0000[5:4] | VAG: 0x0=1.6 V; 0x1=1.52 V; 0x2=1.7 V; 0x3=1.8 V |
| 0x0000[3] | Разрешение генератора; сброс 1 |
| 0x0000[2] | Управление режимом половинного тока |
| 0x0000[1:0] | DAC chop: 0 / 200 / 400 / 800 kHz |
| 0x0001[7] / [6] | Биты выключения VAG / буфера DAC; сброс 1 |



## Как пользоваться справочником

Проверьте атрибуты доступа и обновляйте нужные биты через маску драйвера, сохраняя остальные. Сбросы со стр. 20–21 не заменяют полные определения на стр. 21–43. Код усиления микрофона не имеет равномерного шага dB; PLL, фильтры и AGC также требуют проверки определений. Сравнивайте состояния после сброса питания, инициализации и запуска/останова. Непроверенный скрипт записи всего устройства здесь не предлагается.

## Продукты ArmSoM и границы применения

CM1 и Forge1 приведены как платформы для проектов с аудиопериферией. Наличие RK730 на этих платах и готовая поддержка драйвера здесь не утверждаются. Сначала проверьте доступность I2S, I2C, тактовых сигналов и нужных уровней напряжения.

- [CM1](https://www.armsom.org/cm1) · [Docs](https://docs.armsom.org/armsom-cm1)
- [Forge1](https://www.armsom.org/forge1) · [Docs](https://docs.armsom.org/armsom-forge1)

## Серия по datasheet и исходный PDF

- [RK730 обзор](/ru/articles/rk730-audio-codec-design/)
- [RK730: корпус QFN28, выводы и питание аудиокодека](/ru/articles/rk730-package-power-pinout/)
- [RK730: PLL, I2S, sidetone и адресация I2C](/ru/articles/rk730-clocks-audio-i2c/)
- [RK730: 65 регистров, значения сброса и группы управления](/ru/articles/rk730-register-map-reference/)
- [RK730: питание, запуск и останов ADC/DAC](/ru/articles/rk730-power-adc-dac-sequences/)
- [Скачать полный исходный PDF](/assets/datasheet-series-20261110/Rockchip-RK730-Datasheet-V1.0-20241118.pdf)
