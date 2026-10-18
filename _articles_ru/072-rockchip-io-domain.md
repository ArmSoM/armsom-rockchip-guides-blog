---
title: "Rockchip IO-Domain: источники питания, регистры напряжения и диагностика DTS"
description: "Полное руководство IO-domain: supply mapping, GRF/PMUGRF, fixed regulator и проверка напряжений RK3399."
translation_key: "072-rockchip-io-domain"
slug: "072-rockchip-io-domain"
lang: "ru"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "power"
products: []
tags: ["ArmSoM", "Rockchip", "IO-Domain"]
keywords: "ArmSoM Rockchip rockchip io domain"
excerpt: "Полное руководство IO-domain: supply mapping, GRF/PMUGRF, fixed regulator и проверка напряжений RK3399."
---

{% raw %}

# Rockchip IO-Domain: источники питания, регистры напряжения и диагностика DTS

## Применимость к ArmSoM и область исходника

Справочный материал для адаптации ArmSoM на основе CN V1.0.1; no EN PDF. Сочетания платы, SDK/BSP, ядра и соединений аппаратно не проверялись. Область исходника ниже не означает поддержку каждой платой ArmSoM либо каждым ядром. Проверьте SoC, схему, SDK/BSP, драйвер и pinmux. Команды, патчи, журналы и измерения взяты из исходника и не являются тестами ArmSoM.

Английский PDF не предоставлен. Английская и русская версии полностью переведены с китайского и используют его рисунки с локализованными подписями.

| SoC исходника | Ядра по исходнику |
| --- | --- |
| RK3188 | 4.4 |
| RK3288 | 4.4 |
| RK3036 | 4.4 |
| RK312x | 4.4 |
| RK322x | 4.4 |
| RK3368 | 3.10 |
| RK3368 | 4.4 |
| RK3366 | 4.4 |
| RK3399 | 4.4 |
| RV1108 | 3.10 |
| RV1108 | 4.4 |
| RK3228H | 3.10 |
| RK3328 | 4.4 |
| RK3326/PX30 | 4.4 |
| RK3308 | 4.4 |

Питание IO может иметь уровни 1.8v, 3.3v, 2.5v и 5.0v; часть IO поддерживает несколько уровней. IO-domain настраивает регистры по фактическому напряжению схемы. Неверная настройка нарушает работу. Таблица ниже перечисляет SoC из исходника, но не гарантирует допустимость всех этих напряжений для любого вывода.

[Редакционные примечания](/docs/rockchip-io-domain/EDITORIAL-NOTES.md) · [ArmSoM documentation](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source CN PDF p.4, unit 0 -->

## 1. Файл драйвера и узлы DTS

<!-- Source CN PDF p.4, unit 1 -->

### 1.1 Файл драйвера

<!-- Source CN PDF p.4, unit 2 -->

Расположение драйвера: `drivers/power/avs/rockchip-io-domain.c`.

<!-- Source CN PDF p.4, unit 3 -->

### 1.2 Узлы DTS

<!-- Source CN PDF p.4, unit 4 -->

В ядре 3.10 узлы DTS объединены:

<!-- Source CN PDF p.4, unit 5 -->

```text
io-domains {
    compatible = "rockchip,rk3368-io-voltage-domain";
    rockchip,grf = <&grf>;
    rockchip,pmugrf = <&pmugrf>;
    /*GRF_IO_VSEL*/
    dvp-supply = <&ldo7_reg>; /* DVPIO_VDD */
    wifi-supply = <&ldo7_reg>; /* APIO2_VDD */
    audio-supply = <&dcdc2_reg>; /* APIO3_VDD */
    sdcard-supply = <&ldo1_reg>; /* SDMMC0_VDD */
    gpio30-supply = <&dcdc2_reg>; /* APIO1_VDD */
    gpio1830-supply = <&dcdc2_reg>;/* ADIO4_VDD */
    /*PMU_GRF_IO_VSEL*/
    pmu-supply = <&ldo5_reg>; /* PMUIO_VDD */
    vop-supply = <&ldo5_reg>; /* LCDC_VDD */
};
```

<!-- Source CN PDF p.4, unit 6 -->

В ядре 4.4 узлы DTS для GRF и PMUGRF разделены:

<!-- Source CN PDF p.4, unit 7 -->

```text
&io_domains {
    status = "okay";
    dvp-supply = <&vcc_18>;
    audio-supply = <&vcc_io>;
    gpio30-supply = <&vcc_io>;
    gpio1830-supply = <&vcc_io>;
    sdcard-supply = <&vccio_sd>;
    wifi-supply = <&vccio_wl>;
};
&pmu_io_domains {
    status = "okay";
    pmu-supply = <&vcc_io>;
    vop-supply = <&vcc_io>;
};
```

<!-- Source CN PDF p.5, unit 8 -->

## 2. Описание в TRM

<!-- Source CN PDF p.5, unit 9 -->

Чтобы найти регистры io-domain в TRM, ищите `vsel`, `VSEL` или `volsel` в разделах GRF/PMUGRF. Регистры io-domain в PMUGRF управляют PMU IO.

<!-- Source CN PDF p.5, unit 10 -->

Описаны два настраиваемых диапазона напряжения: 1.8v и 3.3v.

<!-- Source CN PDF p.5, unit 11 -->

Значение регистра 1 обычно соответствует диапазону 1.62v–1.98v с типовым напряжением 1.8v.

<!-- Source CN PDF p.5, unit 12 -->

Значение регистра 0 обычно соответствует диапазону 3.00v–3.60v с типовым напряжением 3.3v.

<!-- Source CN PDF p.5, unit 13 -->

Точные пределы напряжения определяются datasheet конкретного SoC.

<!-- Source CN PDF p.5, unit 14 -->

## 3. Алгоритм работы драйвера

<!-- Source CN PDF p.5, unit 15 -->

Алгоритм драйвера `rockchip-io-domain.c` состоит из двух основных частей:

<!-- Source CN PDF p.5, unit 16 -->

### 3.1 Инициализация

<!-- Source CN PDF p.5, unit 17 -->

В probe драйвер получает regulator по соответствующему supply name из DTS. Затем по напряжению regulator настраивает регистр io-domain: бит 1 для диапазона 1.8v и бит 0 для диапазона 3.3v.

<!-- Source CN PDF p.6, unit 18 -->

![Технический рисунок — 072, источник CN PDF p.6, cn-p06-initialization-flow.png](/docs/rockchip-io-domain/assets/cn-p06-initialization-flow.png)

*Технический рисунок — 072, источник CN PDF p.6, cn-p06-initialization-flow.png.*

Алгоритм: начало → сопоставление Supply_Name → удалось получить regulator? Нет: пропустить; да: настроить io-domain. Продолжить? Да: следующий источник; нет: завершить.

<!-- Source CN PDF p.6, unit 25 -->

### 3.2 Динамическая настройка

<!-- Source CN PDF p.6, unit 26 -->

При инициализации драйвер связывается с regulator и регистрирует notifier. При изменении напряжения regulator уведомляет драйвер io-domain, который обновляет соответствующий регистр.

<!-- Source CN PDF p.6, unit 27 -->

## 4. Настройка io-domain

<!-- Source CN PDF p.6, unit 28 -->

Не каждый домен питания IO требует настройки: некоторые имеют фиксированное напряжение. Ниже приведены три шага программной настройки io-domain.

<!-- Source CN PDF p.7, unit 29 -->

### 4.1 Поиск supply name в rockchip-io-domain.txt

<!-- Source CN PDF p.7, unit 30 -->

Домены IO, требующие настройки DTS, описаны в `Documentation/devicetree/bindings/power/rockchip-io-domain.txt` дерева ядра Linux. Названия одного домена в TRM и схеме могут различаться; документ задаёт их соответствие.

<!-- Source CN PDF p.7, unit 31 -->

Для RK3399 исходный текст перечисляет bt565, audio, sdmmc, gpio1830 и pmu1830 в PMUGRF. В выдержке binding ниже используется `bt656-supply`, а не bt565; расхождение сохранено и отмечено. Фраза «The supply connected to ***_VDD» задаёт соответствующую цепь питания на схеме.

<!-- Source CN PDF p.7, unit 32 -->

Возможные источники питания для rk3399:

<!-- Source CN PDF p.7, unit 33 -->

`bt656-supply`: питание, подключённое к APIO2_VDD.

<!-- Source CN PDF p.7, unit 34 -->

`audio-supply`: питание, подключённое к APIO5_VDD.

<!-- Source CN PDF p.7, unit 35 -->

`sdmmc-supply`: питание, подключённое к SDMMC0_VDD.

<!-- Source CN PDF p.7, unit 36 -->

`gpio1830-supply`: питание, подключённое к APIO4_VDD.

<!-- Source CN PDF p.7, unit 37 -->

Возможные источники питания для rk3399 pmu-domains:

<!-- Source CN PDF p.7, unit 38 -->

`pmu1830-supply`: питание, подключённое к PMUIO2_VDD.

<!-- Source CN PDF p.7, unit 39 -->

### 4.2 Поиск фактического напряжения домена на схеме

<!-- Source CN PDF p.7, unit 40 -->

В примере схемы RK3399-EVB домен bt656 соответствует APIO2_VDD. Поиск APIO2_VDD на схеме показывает, что его питает VCC1V8_DVP от RK808.

<!-- Source CN PDF p.7, unit 41 -->

![Технический рисунок — 072, источник CN PDF p.7, cn-p07-figure1.png](/docs/rockchip-io-domain/assets/cn-p07-figure1.png)

*Технический рисунок — 072, источник CN PDF p.7, cn-p07-figure1.png.*

<!-- Source CN PDF p.8, unit 42 -->

![Технический рисунок — 072, источник CN PDF p.8, cn-p08-figure1.png](/docs/rockchip-io-domain/assets/cn-p08-figure1.png)

*Технический рисунок — 072, источник CN PDF p.8, cn-p08-figure1.png.*

<!-- Source CN PDF p.8, unit 43 -->

### 4.3 Настройка DTS

<!-- Source CN PDF p.8, unit 44 -->

Определив имя и источник питания, найдите regulator `vcc1v8_dvp` в DTS и добавьте `bt656-supply = `<&vcc1v8_dvp>`;` в `rk3399-evb.dtsi`. Остальные домены настраиваются аналогично.

<!-- Source CN PDF p.8, unit 45 -->

## 5. Домены, управляемые аппаратным выводом, обычно не настраиваются

<!-- Source CN PDF p.8, unit 46 -->

Некоторые домены IO Rockchip уже управляются аппаратным выводом. Обычно их не настраивают в DTS ядра, чтобы сохранить аппаратное состояние. Часто так устроены домены flash и eMMC.

<!-- Source CN PDF p.8, unit 47 -->

Описание регистров TRM указывает домены, управляемые выводами, и связь входного уровня с настройкой домена. Альтернативный способ — настройка через GRF.

<!-- Source CN PDF p.8, unit 48 -->

Например, TRM RK3368 и схема RK3368-EVB содержат следующие описания регистра и аппаратного вывода.

<!-- Source CN PDF p.8, unit 49 -->

Описания регистров TRM:

<!-- Source CN PDF p.8, unit 50 -->

![Технический рисунок — 072, источник CN PDF p.8, cn-p08-figure2.png](/docs/rockchip-io-domain/assets/cn-p08-figure2.png)

*Технический рисунок — 072, источник CN PDF p.8, cn-p08-figure2.png.*

Редактируемая расшифровка видимого рисунка; заголовки добавлены редакцией, значения регистров не изменены.

| Бит | Доступ | Сброс | Поле / значение |
| --- | --- | --- | --- |
| 14 | RW | 0x0 | flash_poc_control<br>Выбор управления POC домена Flash IO<br>0: управляется выводом gpio_0b5<br>1: управляется битом 2 IO_VSEL |

<!-- Source CN PDF p.8, unit 51 -->

![Технический рисунок — 072, источник CN PDF p.8, cn-p08-figure3.png](/docs/rockchip-io-domain/assets/cn-p08-figure3.png)

*Технический рисунок — 072, источник CN PDF p.8, cn-p08-figure3.png.*

Редактируемая расшифровка видимого рисунка; заголовки добавлены редакцией, значения регистров не изменены.

| Бит | Доступ | Сброс | Поле / значение |
| --- | --- | --- | --- |
| 2 | RW | 0x1 | flash0_v18sel<br>Выбор напряжения 1.8V домена FLASH0 IO<br>1'b0: 3.3V/2.5V<br>1'b1: 1.8V |

<!-- Source CN PDF p.8, unit 52 -->

Аппаратная схема:

<!-- Source CN PDF p.9, unit 53 -->

![Технический рисунок — 072, источник CN PDF p.9, cn-p09-figure1.png](/docs/rockchip-io-domain/assets/cn-p09-figure1.png)

*Технический рисунок — 072, источник CN PDF p.9, cn-p09-figure1.png.*

<!-- Source CN PDF p.9, unit 54 -->

![Технический рисунок — 072, источник CN PDF p.9, cn-p09-figure2.png](/docs/rockchip-io-domain/assets/cn-p09-figure2.png)

*Технический рисунок — 072, источник CN PDF p.9, cn-p09-figure2.png.*

Редактируемая расшифровка видимого рисунка; заголовки добавлены редакцией, значения регистров не изменены.

| FLASH_VOL_SEL | FLASH_IO Voltage |
| --- | --- |
| 1.8V or 2.5V or 3.3V | 1.8V Driver IO |
| 0V | 3.3V Driver IO |

На схеме также указаны `FLASH_VOLTAGE_SEL=0 FLASH_IO=3.3V` и `FLASH_VOLTAGE_SEL=1 FLASH_IO=1.8V`. Это подписи исходной схемы, а не универсальные допустимые напряжения выводов.

<!-- Source CN PDF p.9, unit 55 -->

## 6. Если regulator отсутствует в DTS

<!-- Source CN PDF p.9, unit 56 -->

Если нужного regulator нет, возможно, вместо PMIC используется напрямую подключённое фиксированное питание. Добавьте в DTS определения fixed-regulator. Обычно достаточно двух — 3.3v и 1.8v.

<!-- Source CN PDF p.9, unit 57 -->

Ниже приведён пример из `rk3229-evb.dts`. Определите фактическое напряжение схемы — 1.8v или 3.3v — и выберите соответствующий regulator:

<!-- Source CN PDF p.9, unit 58 -->

```text
    regulators {
       compatible = "simple-bus";
       #address-cells = <1>;
       #size-cells = <0>;
       vccio_1v8_reg: regulator@0 {
           compatible = "regulator-fixed";
           regulator-name = "vccio_1v8";
           regulator-min-microvolt = <1800000>;
           regulator-max-microvolt = <1800000>;
           regulator-always-on;
       };
       vccio_3v3_reg: regulator@1 {
           compatible = "regulator-fixed";
           regulator-name = "vccio_3v3";
           regulator-min-microvolt = <3300000>;
           regulator-max-microvolt = <3300000>;
           regulator-always-on;
       };
    };
&io_domains {
    status = "okay";
    vccio1-supply = <&vccio_3v3_reg>;
    vccio2-supply = <&vccio_1v8_reg>;
    vccio4-supply = <&vccio_3v3_reg>;
};
```

<!-- Source CN PDF p.10, unit 60 -->

## 7. Частые вопросы

<!-- Source CN PDF p.10, unit 61 -->

### 7.1 Проверка регистра домена конкретного вывода

<!-- Source CN PDF p.10, unit 62 -->

Неверное напряжение вывода может быть связано с настройкой домена питания. Например, программа выставляет высокий уровень GPIO2_B1 RK3399, но измеренное напряжение неверно. Если регистры подтверждают режим GPIO и высокий выход, проверьте io-domain, выполняя описанные шаги в обратном порядке.

<!-- Source CN PDF p.10, unit 63 -->

Сначала по схеме или datasheet определите домен вывода. В примере RK3399 GPIO2_B1 относится к APIO2_VDD, подключённому к VCC1V8_DVP.

<!-- Source CN PDF p.10, unit 64 -->

![Технический рисунок — 072, источник CN PDF p.10, cn-p10-figure1.png](/docs/rockchip-io-domain/assets/cn-p10-figure1.png)

*Технический рисунок — 072, источник CN PDF p.10, cn-p10-figure1.png.*

<!-- Source CN PDF p.11, unit 65 -->

![Технический рисунок — 072, источник CN PDF p.11, cn-p11-figure1.png](/docs/rockchip-io-domain/assets/cn-p11-figure1.png)

*Технический рисунок — 072, источник CN PDF p.11, cn-p11-figure1.png.*

<!-- Source CN PDF p.11, unit 66 -->

Найдите программное имя в `rockchip-io-domain.txt`; здесь это `bt656`.

<!-- Source CN PDF p.11, unit 67 -->

![Технический рисунок — 072, источник CN PDF p.11, cn-p11-figure2.png](/docs/rockchip-io-domain/assets/cn-p11-figure2.png)

*Технический рисунок — 072, источник CN PDF p.11, cn-p11-figure2.png.*

Копируемый фрагмент binding со снимка (в оригинале `gpio1830` без суффикса `-supply` и двоеточия; написание не изменено):

```text
Possible supplies for rk3368 pmu-domains:
- pmu-supply:    The supply connected to PMUIO_VDD.
- vop-supply:    The supply connected to LCDC_VDD.

Possible supplies for rk3399:
- bt656-supply:  The supply connected to APIO2_VDD.
- audio-supply:  The supply connected to APIO5_VDD.
- sdmmc-supply:  The supply connected to SDMMC0_VDD.
- gpio1830      The supply connected to APIO4_VDD.

Possible supplies for rk3399 pmu-domains:
- pmu1830-supply:The supply connected to PMUIO2_VDD.
```

У RK3368 домены pmu/vop связаны с PMUIO_VDD/LCDC_VDD. У RK3399 bt656/audio/sdmmc/gpio1830 связаны с APIO2_VDD/APIO5_VDD/SDMMC0_VDD/APIO4_VDD; питание PMU связано с PMUIO2_VDD.

<!-- Source CN PDF p.11, unit 68 -->

Найдите регистр в TRM и прочитайте его командой `io` либо другим подходящим средством. База обычно GRF или PMUGRF. Здесь bt656 соответствует bit0 по смещению `0xe640`, база GRF — `0xff770000`. В последовательном терминале выполните `io -4 0xff77e640`. Значение bit0=1 выбирает 1.8v и соответствует VCC1V8_DVP; настройка DTS верна. Значение bit0=0 выбирает 3.3v и не соответствует реальному питанию VCC1V8_DVP. Эти адреса относятся к исходному примеру RK3399, а не к произвольной плате.

<!-- Source CN PDF p.11, unit 69 -->

![Технический рисунок — 072, источник CN PDF p.11, cn-p11-figure3.png](/docs/rockchip-io-domain/assets/cn-p11-figure3.png)

*Технический рисунок — 072, источник CN PDF p.11, cn-p11-figure3.png.*

Редактируемая расшифровка видимого рисунка; заголовки добавлены редакцией, значения регистров не изменены.

| Бит | Доступ | Сброс | Поле / значение |
| --- | --- | --- | --- |
| 3 | RW | 0x0 | gpio1833_gpio4cd_ms |
| 2 | RW | 0x0 | sdmmc_gpio4b_ms |
| 1 | RW | 0x0 | audio_gpio3d4a_ms |
| 0 | RW | 0x0 | bt656_gpio2ab_ms |

Снимок регистра содержит `gpio1833_gpio4cd_ms`, а binding — `gpio1830`. Оба исходных написания сохранены; сверить с соответствующими TRM/BSP.

<!-- Source CN PDF p.12, unit 70 -->

### 7.2 Неверные регистры io-domain

<!-- Source CN PDF p.12, unit 71 -->

Типичные причины неверной настройки:

<!-- Source CN PDF p.12, unit 72 -->

Задано неверное напряжение regulator.

<!-- Source CN PDF p.12, unit 73 -->

Regulator не настроен либо не включён.

<!-- Source CN PDF p.12, unit 74 -->

Regulator загружается позже драйвера io-domain, поэтому его получение завершается ошибкой.

{% endraw %}
