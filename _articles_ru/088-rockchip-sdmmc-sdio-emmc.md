---
title: "Rockchip SDMMC, SDIO и eMMC: полное руководство по DTS, режимам и совместимости"
description: "Все технические разделы V1.4.0: конфигурация интерфейсов, частоты, 52 теста mmc_test, питание, сигналы, JTAG и утечки."
translation_key: "088-rockchip-sdmmc-sdio-emmc"
slug: "088-rockchip-sdmmc-sdio-emmc"
lang: "ru"
date: "2026-10-21"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "SDMMC", "SDIO", "eMMC"]
keywords: "ArmSoM Rockchip SDMMC SDIO eMMC DTS mmc_test"
excerpt: "Все технические разделы V1.4.0: конфигурация интерфейсов, частоты, 52 теста mmc_test, питание, сигналы, JTAG и утечки."
---

{% raw %}

# Rockchip SDMMC, SDIO и eMMC: полное руководство по DTS, режимам и совместимости

Справочный материал для адаптации ArmSoM, а не заявление о поддержке всех функций каждой платой. Источники: Rockchip_Developer_Guide_SDMMC_SDIO_eMMC_CN.pdf (22 страницы) и английская версия (25 страниц), обе V1.4.0, RK-KF-YF-121. Китайская статья следует китайскому оригиналу, английская — английскому; русский и немецкий тексты полностью переведены с английского с явными пометками различий. Китайская статья использует китайские оригинальные рисунки, остальные — рисунки английского PDF. В самом английском PDF осциллограмма содержит китайские надписи; они не выдаются за переведённую графику. Проверьте конкретную плату ArmSoM, SoC, SDK/BSP, ядро, DTS, напряжение IO, накопитель и подключение WiFi. Аппаратная проверка не выполнялась; журналы, частоты и сигналы — примеры источника, не измерения ArmSoM.

> Безопасность: сохранены операции изменения состояния, отвязки драйвера, записи/стирания, форматирования и восстановления fsck. Они могут уничтожить данные. Проверять только на однозначно определённой отдельной тестовой карте после резервного копирования, не на системном диске или рабочем устройстве. При подготовке статьи эти операции не выполнялись.

| Чипы | Версия ядра |
| --- | --- |
| Все серии (область источника, не заявление о поддержке всех ArmSoM) | 4.4, 4.19, 5.10, 6.1 |

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel) · [EDITORIAL-NOTES](/docs/rockchip-sdmmc-sdio-emmc/EDITORIAL-NOTES.md)

<!-- Source EN PDF p.5; unit 0 -->

## 1. Конфигурация DTS

<!-- Source EN PDF p.5; unit 1 -->

### 1.1 Конфигурация DTS для SDMMC

<!-- Source EN PDF p.5; unit 2 -->

(1) `max-frequency = <150000000>;`

<!-- Source EN PDF p.5; unit 3 -->

Эта настройка задаёт рабочую частоту SD-карты. Хотя указано 150MHz, частота дополнительно изменяется в зависимости от режима карты. Пользователю не нужно выполнять эти изменения: соответствие рабочей частоты режиму обеспечивает программное обеспечение. Максимум не превышает 150MHz.

<!-- Source EN PDF p.5; unit 4 -->

(2) `supports-sd;`

<!-- Source EN PDF p.5; unit 5 -->

Эта обязательная настройка обозначает слот SD-карты. Без неё карта не инициализируется. После ядра 4.19 она больше не используется: сочетание `no-sdio` и` no-mmc` указывает, что слот не поддерживает SDIO и MMC и предназначен только для SD.

<!-- Source EN PDF p.5; unit 6 -->

(3) `bus-width = <4>;`

<!-- Source EN PDF p.5; unit 7 -->

Настройка задаёт ширину шины SD-карты. Поддерживается максимум 4 линии; без настройки используется 1 линия. Допустимы только значения 1 и 4. Любое другое значение считается недопустимым и принудительно включает режим с 1 линией.

<!-- Source EN PDF p.5; unit 8 -->

(4) `cap-mmc-highspeed; cap-sd-highspeed;`

<!-- Source EN PDF p.5; unit 9 -->

Эти настройки указывают, что слот поддерживает SD-карты Highspeed. Если они отсутствуют, поддержка Highspeed отсутствует.

<!-- Source EN PDF p.5; unit 10 -->

(5) Настройка SD3.0

<!-- Source EN PDF p.5; unit 11 -->

Сначала убедитесь, что чип поддерживает SD3.0, настройте питание IO контроллера SDMMC по цепи vqmmc и добавьте следующие скоростные режимы SD3.0:

<!-- Source EN PDF p.5; unit 12 -->

| Режим | Максимальная частота (исходное значение) | Примечание |
| --- | --- | --- |
| sd-uhs-sdr12 | 24M |  |
| sd-uhs-sdr25 | 50M |  |
| sd-uhs-sdr50 | 100M |  |
| sd-uhs-ddr50 | 50M | Выборка по обоим фронтам |
| sd-uhs-sdr104 | 208M |  |

<!-- Source EN PDF p.5; unit 13 -->

(6) Настройка питания 3V3 SD-карты

<!-- Source EN PDF p.5; unit 14 -->

Если для управления питанием карты используется штатный вывод питания контроллера SDMMC `sdmmc_pwren`, достаточно настроить его функцию в pinctrl и включить ссылку в default pinctrl узла sdmmc. Пример для RK312X:

<!-- Source EN PDF p.6; unit 15 -->

```text
sdmmc_pwren: sdmmc-pwren {
    rockchip,pins = <1 RK_PB6 1 &pcfg_pull_default>;
};
pinctrl-0 = <&sdmmc_pwr &sdmmc_clk &sdmmc_cmd &sdmmc_bus4>;
```

<!-- Source EN PDF p.6; unit 16 -->

Если питание 3V3 SD-карты управляется другим GPIO, определите его как regulator и укажите ссылку в vmmc-supply узла sdmmc, например:

<!-- Source EN PDF p.6; unit 17 -->

```text
sdmmc_pwr: sdmmc-pwr {
    rockchip,pins = <7 11 RK_FUNC_GPIO &pcfg_pull_none>;
};
vcc_sd: sdmmc-regulator {
    compatible = "regulator-fixed";
    gpio = <&gpio7 11 GPIO_ACTIVE_LOW>;
    pinctrl-names = "default";
    pinctrl-0 = <&sdmmc_pwr>;
    regulator-name = "vcc_sd";
    regulator-min-microvolt = <3300000>;
    regulator-max-microvolt = <3300000>;
    startup-delay-us = <100000>;
    vin-supply = <&vcc_io>;
};
&sdmmc {
    vmmc-supply = <&vcc_sd>;
};
```

<!-- Source EN PDF p.6; unit 18 -->

(7) Настройка вывода обнаружения установки и извлечения SD-карты

<!-- Source EN PDF p.6; unit 19 -->

Если вывод обнаружения непосредственно соединён с `sdmmc_cd` контроллера SDMMC, настройте его соответствующую функцию и укажите ссылку в default pinctrl узла sdmmc.

<!-- Source EN PDF p.6; unit 20 -->

Если используется другой GPIO, настройте cd-gpios в узле sdmmc, например:

<!-- Source EN PDF p.6; unit 21 -->

`cd-gpios = <&gpio4 24 GPIO_ACTIVE_LOW>;`

<!-- Source EN PDF p.6; unit 22 -->

Если используется GPIO, но требуется обратная полярность обнаружения, то есть высокий уровень при установленной SD-карте, добавьте:

<!-- Source EN PDF p.6; unit 23 -->

`cd-inverted;`

<!-- Source EN PDF p.6; unit 24 -->

### 1.2 Конфигурация DTS для SDIO

<!-- Source EN PDF p.6; unit 25 -->

(1) `max-frequency = <150000000>;`

<!-- Source EN PDF p.6; unit 26 -->

Как для SD-карты, максимальная рабочая частота не превышает 150MHz. Для устройства SDIO2.0 частота автоматически ограничивается 50MHz, для SDIO3.0 поддерживается максимум 150MHz.

<!-- Source EN PDF p.7; unit 27 -->

(2) `supports-SDIO;`

<!-- Source EN PDF p.7; unit 28 -->

Эта обязательная настройка обозначает слот SDIO. Без неё периферия SDIO не инициализируется. После ядра 4.19 она больше не используется: сочетание `no-sd` и` no-mmc` указывает, что слот не поддерживает SDMMC и MMC и предназначен только для SDIO.

<!-- Source EN PDF p.7; unit 29 -->

(3) `bus-width = <4>;`

<!-- Source EN PDF p.7; unit 30 -->

Аналогично настройке SD-карты.

<!-- Source EN PDF p.7; unit 31 -->

(4) `cap-sd-highspeed;`

<!-- Source EN PDF p.7; unit 32 -->

Аналогично настройке SD-карты; для периферии SDIO также различается поддержка Highspeed.

<!-- Source EN PDF p.7; unit 33 -->

(5) `cap-sdio-irq;`

<!-- Source EN PDF p.7; unit 34 -->

Настройка указывает, поддерживает ли периферийное устройство SDIO, обычно WiFi, прерывания SDIO. Если устройство использует прерывание OOB, не добавляйте этот параметр. Поддерживаемый тип прерывания уточните у изготовителя WiFi.

<!-- Source EN PDF p.7; unit 35 -->

(6) `keep-power-in-suspend;`

<!-- Source EN PDF p.7; unit 36 -->

Английский источник описывает параметр как поддержку отключения питания во сне и рекомендует добавлять его по умолчанию, поскольку WiFi обычно требуется пробуждение из глубокого сна. Примечание сверки: китайский источник, с. 6, прямо говорит о сохранении питания во сне; формулировка английского источника противоположна.

<!-- Source EN PDF p.7; unit 37 -->

(7) `mmc-pwrseq = <&sdio_pwrseq>;`

<!-- Source EN PDF p.7; unit 38 -->

Обязательное управление питанием периферии SDIO, обычно WiFi: без него WiFi не сможет включиться и работать. В примере ниже выбор кварцевого тактового сигнала и GPIO сброса/включения необходимо адаптировать к реальной аппаратной схеме платы.

<!-- Source EN PDF p.7; unit 39 -->

```text
sdio_pwrseq:sdio-pwrseq {
        compatible ="mmc-pwrseq-simple";
        clocks = <&rk808 1>;
        clock-names ="ext_clock";
        pinctrl-names ="default";
        pinctrl-0 =<&wifi_enable_h>;
        /*
        * On the module itself this is one of these (depending
        * on the actual card populated):
        * - SDIO_RESET_L_WL_REG_ON
        * - PDN (power down when low)
        */
        reset-gpios = <&gpio0 10GPIO_ACTIVE_LOW>; /* GPIO0_B2 */
};
```

<!-- Source EN PDF p.7; unit 40 -->

(8) `non-removable;`

<!-- Source EN PDF p.7; unit 41 -->

Обозначает несъёмное устройство в слоте. Для SDIO этот параметр обязателен.

<!-- Source EN PDF p.7; unit 42 -->

(9) `num-slots = <4>;`

<!-- Source EN PDF p.7; unit 43 -->

Аналогично настройке SD-карты.

<!-- Source EN PDF p.8; unit 44 -->

(10) `sd-uhs-sdr104;`

<!-- Source EN PDF p.8; unit 45 -->

Определяет поддержку SDIO3.0 устройством SDIO. Необходимое условие: напряжение IO WiFi равно 1.8v.

<!-- Source EN PDF p.8; unit 46 -->

### 1.3 Конфигурация DTS для eMMC

<!-- Source EN PDF p.8; unit 47 -->

(1) `max-frequency = <150000000>;`

<!-- Source EN PDF p.8; unit 48 -->

Как для SD-карты, максимальная рабочая частота не превышает 150MHz. В режиме eMMC Highspeed она автоматически снижается до 50MHz; в eMMC HS200 поддерживается максимум 150MHz.

<!-- Source EN PDF p.8; unit 49 -->

(2) `supports-emmc;`

<!-- Source EN PDF p.8; unit 50 -->

Эта обязательная настройка обозначает слот eMMC. Без неё периферия eMMC не инициализируется. После ядра 4.19 вместо неё используется сочетание `no-sd` и` no-sdio`: слот не поддерживает SDMMC и SDIO и предназначен только для eMMC.

<!-- Source EN PDF p.8; unit 51 -->

(3) `bus-width = <4>;`

<!-- Source EN PDF p.8; unit 52 -->

Аналогично настройке SD-карты.

<!-- Source EN PDF p.8; unit 53 -->

(4) `mmc-ddr-1_8v;`

<!-- Source EN PDF p.8; unit 54 -->

Указывает поддержку режима 50MDDR.

<!-- Source EN PDF p.8; unit 55 -->

(5) `mmc-hs200-1_8v;`

<!-- Source EN PDF p.8; unit 56 -->

Указывает поддержку режима HS200.

<!-- Source EN PDF p.8; unit 57 -->

(6) `mmc-hs400-1_8v; mmc-hs400-enhanced-strobe`

<!-- Source EN PDF p.8; unit 58 -->

Эти две настройки обозначают поддержку HS400 и HS400ES. Поддержку конкретным чипом уточните в его спецификации.

<!-- Source EN PDF p.8; unit 59 -->

(7) `non-removable;`

<!-- Source EN PDF p.8; unit 60 -->

Обязательная настройка, обозначающая несъёмное устройство в слоте.

<!-- Source EN PDF p.8; unit 61 -->

## 2. Переключение частоты и режима

<!-- Source EN PDF p.8; unit 62 -->

(1) Для переключения режима можно использовать соответствующие параметры DTS, описанные выше.

<!-- Source EN PDF p.8; unit 63 -->

(2) Если изменять прошивку нежелательно, используйте динамическое переключение.

<!-- Source EN PDF p.8-9; unit 64 -->

Источник сообщает, что ядро 6.1 уже содержит следующие коммиты; на другие платформы их нужно перенести.

```text
commit 0c11160a3c03bcf41fd1217d5e44e68ff078c54b
Author: Shawn Lin <shawn.lin@rock-chips.com>
Date: Tue Nov 5 18:05:50 2024 +0800
    mmc: debugfs: Allow more host caps to be modified
    Change-Id: I2d5df7bc95eaa4a380b5107364aff8df3a759788
commit 478cdcd25cba8be5cfcf56b503b0e070f5aef245
Author: Vincent Whitchurch <vincent.whitchurch@axis.com>
Date: Fri Sep 29 09:45:09 2023 +0200
    UPSTREAM: mmc: debugfs: Allow host caps to be modified
    Change-Id: I6ea2fc093234785e05d05128556c60ef42da02a4
commit a5a3ea5e45d09cff84c04b515b5b71d4dd76524e
Author: Vincent Whitchurch <vincent.whitchurch@axis.com>
Date: Fri Sep 29 09:45:08 2023 +0200
    UPSTREAM: mmc: core: Always reselect card type
    Change-Id: Ie80514ade3b267901818f477d74d91cf7c13e103
```

<!-- Source EN PDF p.9; unit 66 -->

### 2.1 Динамическое переключение SD/SDIO

<!-- Source EN PDF p.9; unit 67 -->

(1) Настройте DTS на максимальный поддерживаемый скоростной режим. Определите из журнала ID устройства MMC и адрес карты. Пример для одной TF-карты:

<!-- Source EN PDF p.9; unit 68 -->

```text
[ 5.739929] mmc_host mmc1: Bus speed (slot 0) = 400000Hz (slot req 400000Hz, actual 400000HZ div = 0)
[ 5.941037] mmc_host mmc1: Bus speed (slot 0) = 198000000Hz (slot req 200000000Hz, actual 198000000HZ div = 0)
[ 5.941682] dwmmc_rockchip 2a310000.mmc: Successfully tuned phase to 90
[ 5.941705] mmc1: new ultra high speed SDR104 SDHC card at address aaaa
[ 5.943229] mmcblk1: mmc1:aaaa SC32G 29.7 GiB
```

<!-- Source EN PDF p.9; unit 69 -->

Из журнала можно получить три значения:

<!-- Source EN PDF p.9; unit 70 -->

ID устройства MMC равен 1, то есть mmc1.

<!-- Source EN PDF p.9; unit 71 -->

Адрес TF-карты — aaaa; полный путь устройства — mmc1:aaaa.

<!-- Source EN PDF p.9; unit 72 -->

Текущий режим — sdr104, частота — 198MHz.

<!-- Source EN PDF p.9; unit 73 -->

(2) Поскольку используется mmc1, выполните `cd /sys/kernel/debug/mmc1`. Для mmc0 следует перейти в каталог mmc0 и так далее.

<!-- Source EN PDF p.9; unit 74 -->

(3) Чтобы изменить только частоту текущего режима на 100MHz, выполните `echo 100000000 > clock`. Для других частот действуйте аналогично.

<!-- Source EN PDF p.9; unit 75 -->

```text
root@rk3576-buildroot:/sys/kernel/debug/mmc1# echo 100000000 > clock
[ 86.451685] mmc_host mmc1: Bus speed (slot 0) = 100000000Hz (slot req 100000000Hz, actual 100000000HZ div = 0)
```

<!-- Source EN PDF p.9; unit 76 -->

(4) Переключение в High speed с частотой по умолчанию 50MHz.

<!-- Source EN PDF p.10; unit 77 -->

```text
#Execute the following commands in the sys/kernel/debug/mmc1 directory:
echo $(($(cat caps) | (1 << 7))) > caps
echo on > /sys/bus/mmc/devices/mmc1\:aaaa/power/control
echo auto > /sys/bus/mmc/devices/mmc1\:aaaa/power/control
echo $(($(cat caps) & ~(1 << 19))) > caps
echo on > /sys/bus/mmc/devices/mmc1\:aaaa/power/control
#You can see the switch has occurred
[ 78.304578] mmc_host mmc1: Bus speed (slot 0) = 400000Hz (slot req 400000Hz, actual 400000HZ div = 0)
[ 78.501126] mmc_host mmc1: Bus speed (slot 0) = 50000000Hz (slot req 50000000Hz, actual 50000000HZ div = 0)
#Execute the following command to confirm the switch was successful
grep timing ios
timing spec: 2 (sd high-speed) #High speed mode now
```

<!-- Source EN PDF p.10; unit 78 -->

(5) Переключение в Default speed с частотой по умолчанию 25MHz.

<!-- Source EN PDF p.10; unit 79 -->

```text
#Execute the following commands in the sys/kernel/debug/mmc1 directory:
echo $(($(cat caps) | (1 << 7))) > caps
echo on > /sys/bus/mmc/devices/mmc1\:aaaa/power/control
echo auto > /sys/bus/mmc/devices/mmc1\:aaaa/power/control
echo $(($(cat caps) & ~(1 << 2))) > caps
echo on > /sys/bus/mmc/devices/mmc1\:aaaa/power/control
#You can see the switch has occurred
[ 287.590885] mmc_host mmc1: Bus speed (slot 0) = 400000Hz (slot req 400000Hz, actual 400000HZ div = 0)
[ 287.784531] mmc_host mmc1: Bus speed (slot 0) = 25000000Hz (slot req 25000000Hz, actual 25000000HZ div = 0)
#Execute the following command to confirm the switch was successful
grep timing ios
timing spec: 0 (legacy) #Default speed mode now
```

<!-- Source EN PDF p.10; unit 80 -->

### 2.2 Динамическое переключение eMMC

<!-- Source EN PDF p.10; unit 81 -->

(1) Настройте DTS на максимальный поддерживаемый скоростной режим. Определите из журнала ID и адрес устройства MMC. Пример для eMMC RK3588:

<!-- Source EN PDF p.10; unit 82 -->

```text
[ 2.260445] mmc0: Command Queue Engine enabled
[ 2.260458] mmc0: new HS400 Enhanced strobe MMC card at address 0001
[ 2.260740] mmcblk0: mmc0:0001 BJTD4R 29.1 GiB
```

<!-- Source EN PDF p.10; unit 83 -->

Из журнала можно получить три значения:

<!-- Source EN PDF p.10; unit 84 -->

ID устройства MMC равен 0, то есть mmc0.

<!-- Source EN PDF p.10; unit 85 -->

Адрес eMMC — 0001; полный путь устройства — mmc0:0001.

<!-- Source EN PDF p.11; unit 86 -->

Текущий режим — HS400; частота eMMC по умолчанию на этой платформе — 198MHz.

<!-- Source EN PDF p.11; unit 87 -->

(2) Поскольку используется mmc0, выполните `cd /sys/kernel/debug/mmc0`. Для mmc1 следует перейти в каталог mmc1 и так далее.

<!-- Source EN PDF p.11; unit 88 -->

(3) Чтобы изменить частоту в текущем режиме, используйте команду `echo 100000000 > clock`; для других частот действуйте аналогично.

<!-- Source EN PDF p.11; unit 89 -->

```text
# First confirm the default frequency and mode
root@rk3588-buildroot:/sys/kernel/debug/mmc0# grep clock ios
clock: 200000000 Hz actual clock: 198000000 Hz #Default 198MHz
root@rk3588-buildroot:/sys/kernel/debug/mmc0# grep timing ios
timing spec: 10 (mmc HS400 enhanced strobe) #HS400es mode
# Begin frequency switching
root@rk3588-buildroot:/sys/kernel/debug/mmc0# echo 100000000 > clock
root@rk3588-buildroot:/sys/kernel/debug/mmc0# grep clock ios
clock: 100000000 Hz actual clock: 100000000 Hz #Switched to 100MHz
root@rk3588-buildroot:/sys/kernel/debug/mmc0# grep timing ios
timing spec: 10 (mmc HS400 enhanced strobe) #Still HS400es mode
```

<!-- Source EN PDF p.11; unit 90 -->

(4) Переключение в HS200 с частотой по умолчанию 198MHz.

<!-- Source EN PDF p.11; unit 91 -->

```text
# Execute the following commands in the sys/kernel/debug/mmc0 directory:
echo $(($(cat caps) | (1 << 7))) > caps
echo on > /sys/bus/mmc/devices/mmc0:0001/power/control
echo auto > /sys/bus/mmc/devices/mmc0:0001/power/control
echo $(($(cat caps2) & ~(1 << 15))) > caps2
echo on > /sys/bus/mmc/devices/mmc0:0001/power/control
# Execute the following command to confirm the switch was successful
grep timing ios
timing spec: 9 (mmc HS200) #HS200 mode now
```

<!-- Source EN PDF p.11; unit 92 -->

(5) Переключение в High speed с частотой по умолчанию 50MHz.

<!-- Source EN PDF p.11; unit 93 -->

```text
# Execute the following commands in the sys/kernel/debug/mmc0 directory:
echo $(($(cat caps) | (1 << 7))) > caps
echo on > /sys/bus/mmc/devices/mmc0:0001/power/control
echo auto > /sys/bus/mmc/devices/mmc0:0001/power/control
echo $(($(cat caps) & ~(1 << 1))) > caps
echo on > /sys/bus/mmc/devices/mmc0:0001/power/control
# Execute the following command to confirm the switch was successful
grep timing ios
timing spec: 1 (mmc high-speed) #High speed mode now
```

<!-- Source EN PDF p.12; unit 94 -->

### 2.3 Дополнительные сведения

<!-- Source EN PDF p.12; unit 95 -->

Помимо частоты и режима можно переключать ширину шины; уменьшение числа линий может автоматически понижать режим. Также доступны переключатели поддержки CMD23, CQE и DCMD. Пример для mmc0:0001:

<!-- Source EN PDF p.12; unit 96 -->

```text
# Execute the following commands in sequence in the sys/kernel/debug/mmc0 directory:
echo $(($(cat caps) | (1 << 7))) > caps
echo on > /sys/bus/mmc/devices/mmc0\:0001/power/control
echo auto > /sys/bus/mmc/devices/mmc0\:0001/power/control
# Select the following switching configurations as needed
echo $(($(cat caps) & ~(1 << 6))) > caps # Remove 8-bit support
echo $(($(cat caps) | (1 << 6))) > caps # Add 8-bit support
echo $(($(cat caps) & ~(1 << 0))) > caps # Remove 4-bit support
echo $(($(cat caps) | (1 << 0))) > caps # Add 4-bit support
echo $(($(cat caps) & ~(1 << 30))) > caps # Remove cmd23 support
echo $(($(cat caps) | (1 << 30))) > caps # Add cmd23 support
echo $(($(cat caps) & ~(1 << 30))) > caps # Remove cmd23 support
echo $(($(cat caps) | (1 << 30))) > caps # Add cmd23 support
echo $(($(cat caps2) & ~(1 << 23))) > caps2 # Remove cqe support
echo $(($(cat caps2) | (1 << 23))) > caps2 # Add cqe support
echo $(($(cat caps2) & ~(1 << 24))) > caps2 # Remove cqe dcmd support
echo $(($(cat caps2) | (1 << 24))) > caps2 # Add cqe dcmd support
# Execute this again
echo on > /sys/bus/mmc/devices/mmc0\:0001/power/control
# Confirm ios information, check the output results
cat ios
```

<!-- Source EN PDF p.12; unit 97 -->

Назначение битов caps и caps2 можно найти в файле ядра `include/linux/mmc/host.h`. Сейчас поддерживаются следующие caps и caps2:

<!-- Source EN PDF p.12; unit 98 -->

| caps | caps2 |
| --- | --- |
| MMC_CAP_AGGRESSIVE_PM | MMC_CAP2_HS400_1_8V |
| MMC_CAP_SD_HIGHSPEED | MMC_CAP2_HS400_1_2V |
| MMC_CAP_MMC_HIGHSPEED | MMC_CAP2_HS400_ES |
| MMC_CAP_UHS | MMC_CAP2_HS200_1_8V_SDR |
| MMC_CAP_DDR | MMC_CAP2_HS200_1_2V_SDR |
| MMC_CAP_4_BIT_DATA | MMC_CAP2_CQE |
| MMC_CAP_8_BIT_DATA | MMC_CAP2_CQE_DCMD |
| MMC_CAP_CMD23 |  |

<!-- Source EN PDF p.13; unit 99 -->

Если проекту нужны дополнительные настройки, их можно добавить по образцу указанного выше коммита `0c11160a3c03bcf41fd1217d5e44e68ff078c54b`.

<!-- Source EN PDF p.13; unit 100 -->

## 3. Проверка совместимости mmc_test

<!-- Source EN PDF p.13; unit 101 -->

Для изделий, зависящих от SD-карт, рекомендуется включить специальные проверки совместимости SD-карт.

<!-- Source EN PDF p.13; unit 102 -->

### 3.1 Проверка конфигурации ядра

<!-- Source EN PDF p.13; unit 103 -->

Убедитесь, что включено `CONFIG_MMC_TEST=y`:

```text
Device Drivers -->
   <*> MMC/SD/SDIO card support -->
   [*] MMC host test driver
```

При сборке модулем выполните `insmod mmc_test.ko` после загрузки.

<!-- Source EN PDF p.13; unit 104 -->

### 3.2 Использование

<!-- Source EN PDF p.13; unit 105 -->

(1) Выведите все устройства mmc.

```text
ls /sys/bus/mmc/devices/
```

(2) Определите тестируемое устройство, например SD-карту, и узнайте его полный путь из журнала.

```text
mmc1:aaaa
```

(3) Отвяжите SD-карту от драйвера mmcblk.

```text
echo 'mmc1:aaaa' > /sys/bus/mmc/drivers/mmcblk/unbind
```

(4) Привяжите SD-карту к mmc_test.

```text
echo 'mmc1:aaaa' > /sys/bus/mmc/drivers/mmc_test/bind
```

(5) Должна появиться следующая запись журнала.

```text
mmc_test mmc1:aaaa: Card claimed for testing.
```

(6) Посмотрите доступные тесты.

```text
cat /sys/kernel/debug/mmc1/mmc1:aaaa/testlist
```

(7) Выберите номер теста N; полное описание приведено ниже.

```text
echo N > /sys/kernel/debug/mmc1/mmc1:aaaa/test
```

<!-- Source EN PDF p.14; unit 106 -->

### 3.3 Результаты выполнения

<!-- Source EN PDF p.14; unit 107 -->

| Вывод | Значение |
| --- | --- |
| mmc1: Result: OK | Тест завершён |
| mmc1: Result: FAILED | Тест не пройден |
| mmc1: Result: UNSUPPORTED (by host) | Конфигурация контроллера не поддерживается |
| mmc1: Result: UNSUPPORTED (by card) | Карта не поддерживается |

<!-- Source EN PDF p.15; unit 108 -->

### 3.4 Описание тестов

<!-- Source EN PDF p.15; unit 109 -->

Английские названия тестов сохранены для точного сопоставления с выводом testlist.

| N | Исходное название теста | Описание |
| --- | --- | --- |
| 0 | Run all tests | Выполнить все тесты |
| 1 | Basic write (no data verification) | Запись без проверки данных |
| 2 | Basic read (no data verification) | Чтение без проверки данных |
| 3 | Basic write (with data verification) | Запись с проверкой данных |
| 4 | Basic read (with data verification) | Чтение с проверкой данных |
| 5 | Multi-block write | Запись нескольких блоков |
| 6 | Multi-block read | Чтение нескольких блоков |
| 7 | Power of two block writes | Запись блоков чётной степени (формулировка источника; название теста говорит о степени двойки) |
| 8 | Power of two block reads | Чтение блоков чётной степени (формулировка источника; название теста говорит о степени двойки) |
| 9 | Weird sized block writes | Запись блоков различных нестандартных размеров |
| 10 | Weird sized block reads | Чтение блоков различных нестандартных размеров |
| 11 | Badly aligned write | Запись одного блока с невыровненного адреса |
| 12 | Badly aligned read | Чтение одного блока с невыровненного адреса |
| 13 | Badly aligned multi-block write | Запись нескольких блоков с невыровненного адреса |
| 14 | Badly aligned multi-block read | Чтение нескольких блоков с невыровненного адреса |
| 15 | Proper xfer_size at write (start failure) | Преднамеренно неверный тип передачи: например, запись нескольких блоков командой одноблочной передачи |
| 16 | Proper xfer_size at read (start failure) | Преднамеренно неверный тип передачи: например, чтение нескольких блоков командой одноблочной передачи |
| 17 | Proper xfer_size at write (midway failure) | Как 15, но ошибка записи вводится в середине многоблочной передачи |
| 18 | Proper xfer_size at read (midway failure) | Как 16, но ошибка чтения вводится в середине многоблочной передачи |
| 19 | Highmem write | Запись одного блока с использованием страницы High memory |
| 20 | Highmem read | Чтение одного блока с использованием страницы High memory |

<!-- Source EN PDF p.16; unit 110 -->

Английские названия тестов сохранены для точного сопоставления с выводом testlist.

| N | Исходное название теста | Описание |
| --- | --- | --- |
| 21 | Multi-block highmem write | Запись нескольких блоков с использованием страницы High memory |
| 22 | Multi-block highmem read | Чтение нескольких блоков с использованием страницы High memory |
| 23 | Best-case read performance | Последовательное чтение 512K, непрерывные адреса, без sg |
| 24 | Best-case write performance | Последовательная запись 512K, непрерывные адреса, без sg |
| 25 | Best-case read performance into scattered pages | Последовательное чтение 512K с sg |
| 26 | Best-case write performance from scattered pages | Последовательная запись 512K с sg; китайская версия, с. 14, ошибочно описывает чтение |
| 27 | Single read performance by transfer size | Производительность чтения одного блока |
| 28 | Single write performance by transfer size | Производительность записи одного блока |
| 29 | Single trim performance by transfer size | Производительность стирания одного блока |
| 30 | Consecutive read performance by transfer size | Производительность последовательного чтения |
| 31 | Consecutive write performance by transfer size | Производительность последовательной записи |
| 32 | Consecutive trim performance by transfer size | Производительность последовательного стирания |
| 33 | Random read performance by transfer size | Производительность случайного чтения |
| 34 | Random write performance by transfer size | Производительность случайной записи |
| 35 | Large sequential read into scattered pages | Тест большого объёма последовательного чтения с sg |
| 36 | Large sequential write from scattered pages | Тест большого объёма последовательной записи с sg |
| 37 | Write performance with blocking req 4k to 4MB | Производительность блокирующей записи с длиной передачи от 4K до 4MB |

<!-- Source EN PDF p.17; unit 111 -->

Английские названия тестов сохранены для точного сопоставления с выводом testlist.

| N | Исходное название теста | Описание |
| --- | --- | --- |
| 38 | Write performance with non-blocking req 4k to 4MB | Производительность неблокирующей записи с длиной передачи от 4K до 4MB |
| 39 | Read performance with blocking req 4k to 4MB | Производительность блокирующего чтения с длиной передачи от 4K до 4MB |
| 40 | Read performance with non-blocking req 4k to 4MB | Производительность неблокирующего чтения с длиной передачи от 4K до 4MB |
| 41 | Write performance blocking req 1 to 512 sg elems | Производительность блокирующей записи с 1–512 элементами sg |
| 42 | Write performance non-blocking req 1 to 512 sg elems | Производительность неблокирующей записи с 1–512 элементами sg |
| 43 | Read performance blocking req 1 to 512 sg elems | Производительность блокирующего чтения с 1–512 элементами sg |
| 44 | Read performance non-blocking req 1 to 512 sg elems | Производительность неблокирующего чтения с 1–512 элементами sg; китайская версия, с. 15, ошибочно описывает запись |
| 45 | Reset test | Тест сброса |
| 46 | Commands during read - no Set Block Count (CMD23) | Отправка различных команд во время чтения без CMD23 |
| 47 | Commands during write - no Set Block Count (CMD23) | Отправка различных команд во время записи без CMD23 |
| 48 | Commands during read - use Set Block Count (CMD23) | Отправка различных команд во время чтения с CMD23 |
| 49 | Commands during write - use Set Block Count (CMD23) | Отправка различных команд во время записи с CMD23 |
| 50 | Commands during non-blocking read - use Set Block Count (CMD23) | Отправка различных команд во время неблокирующего чтения с CMD23 |
| 51 | Commands during non-blocking write - use Set Block Count (CMD23) | Отправка различных команд во время неблокирующей записи с CMD23 |

<!-- Source EN PDF p.18; unit 112 -->

## 4. Поиск распространённых неисправностей

<!-- Source EN PDF p.18; unit 113 -->

### 4.1 Анализ аппаратных проблем

<!-- Source EN PDF p.18; unit 114 -->

(1) SD-карта

<!-- Source EN PDF p.18; unit 115 -->

![Исходная разводка SD-карты и выводы обнаружения](/docs/rockchip-sdmmc-sdio-emmc/assets/en-p018-X101.png)

*Исходная разводка SD-карты и выводы обнаружения — Источник оригинального рисунка: EN PDF p.18.*

<!-- Source EN PDF p.18; unit 116 -->

Слева направо:

<!-- Source EN PDF p.18; unit 117 -->

DET ---- Вывод обнаружения

<!-- Source EN PDF p.18; unit 118 -->

DATA1 ---- Линия данных

<!-- Source EN PDF p.18; unit 119 -->

DATA0

<!-- Source EN PDF p.18; unit 120 -->

GND

<!-- Source EN PDF p.18; unit 121 -->

CLK ---- Тактовый сигнал

<!-- Source EN PDF p.18; unit 122 -->

VCC_SD ---- Питание SD-карты

<!-- Source EN PDF p.18; unit 123 -->

VCCIO_SD ---- Питание IO линий данных

<!-- Source EN PDF p.18; unit 124 -->

CMD ---- Командная линия

<!-- Source EN PDF p.18; unit 125 -->

DATA3

<!-- Source EN PDF p.18; unit 126 -->

DATA2

<!-- Source EN PDF p.18; unit 127 -->

Кроме DET/CLK/GND, на DATA0-3/VCC_SD/VCCIO_SD/CMD должно быть около 3.3v, минимум 3v. DET имеет низкий уровень при установленной карте и высокий после извлечения. DATA0-3/CMD питаются от VCCIO_SD, поэтому их напряжение должно соответствовать VCCIO_SD, а VCC_SD и VCCIO_SD должны совпадать. Примечание источника: для SD 3.0 требуется VCCIO_SD = 1.8v.

<!-- Source EN PDF p.18; unit 128 -->

При постоянном питании VCC_SD/VCCIO_SD убедитесь, что напряжение обеих цепей не проседает при установке или извлечении карты.

<!-- Source EN PDF p.18; unit 129 -->

(2) SDIO

<!-- Source EN PDF p.19; unit 130 -->

![Исходная схема данных и команд SDIO](/docs/rockchip-sdmmc-sdio-emmc/assets/en-p019-X108.png)

*Исходная схема данных и команд SDIO — Источник оригинального рисунка: EN PDF p.19.*

<!-- Source EN PDF p.19; unit 131 -->

![Исходная схема питания IO и управления WiFi](/docs/rockchip-sdmmc-sdio-emmc/assets/en-p019-X109.png)

*Исходная схема питания IO и управления WiFi — Источник оригинального рисунка: EN PDF p.19.*

<!-- Source EN PDF p.19; unit 132 -->

![Исходная схема генератора и питания WiFi](/docs/rockchip-sdmmc-sdio-emmc/assets/en-p019-X110.png)

*Исходная схема генератора и питания WiFi — Источник оригинального рисунка: EN PDF p.19.*

<!-- Source EN PDF p.19; unit 133 -->

Рассмотрим аппаратную схему: основные узлы находятся внутри зелёного прямоугольника.

<!-- Source EN PDF p.19; unit 134 -->

WIFI_D0~3: линии данных, обычно высокий уровень; напряжение зависит от VCCIO_WL.

<!-- Source EN PDF p.19; unit 135 -->

WIFI_CMD: командная линия, обычно высокий уровень; напряжение зависит от VCCIO_WL.

<!-- Source EN PDF p.19; unit 136 -->

WIFI_CLK: тактовый сигнал, обычно низкий уровень; напряжение зависит от VCCIO_WL.

<!-- Source EN PDF p.19; unit 137 -->

VBAT_WL: питание модуля WIFI, постоянно высокий уровень; источник указывает 3.3v (неясное слово оригинала: «print»).

<!-- Source EN PDF p.19-20; unit 138 -->

VCCIO_WL: питание IO DATA/CMD/CLK, допускается 3.3 или 1.8v, но для SDIO3.0 обязательно 1.8v.

<!-- Source EN PDF p.20; unit 140 -->

WIFI_REG_ON: 3.3v при нормальной работе, 0v при выключенном WiFi.

<!-- Source EN PDF p.20; unit 141 -->

Два кварцевых генератора: 32K и 26M/37.4M; при нормальной работе оба выдают сигналы.

<!-- Source EN PDF p.20; unit 142 -->

(3) eMMC

<!-- Source EN PDF p.20; unit 143 -->

![Исходная схема eMMC и питания](/docs/rockchip-sdmmc-sdio-emmc/assets/en-p020-X113.png)

*Исходная схема eMMC и питания — Источник оригинального рисунка: EN PDF p.20.*

<!-- Source EN PDF p.20; unit 144 -->

Допустимые сочетания напряжений eMMC:

<!-- Source EN PDF p.20; unit 145 -->

![Исходная таблица сочетаний напряжений eMMC](/docs/rockchip-sdmmc-sdio-emmc/assets/en-p020-X114.png)

*Исходная таблица сочетаний напряжений eMMC — Источник оригинального рисунка: EN PDF p.20.*

| VCC / VCCQ | 1.1 V–1.3 V | 1.70 V–1.95 V | 2.7 V–3.6 V |
| --- | --- | --- | --- |
| 2.7 V–3.6 V | Допустимо | Допустимо | Допустимо (1) |
| 1.7 V–1.95 V | Допустимо | Допустимо | НЕДОПУСТИМО |

Примечание 1: диапазон VCCQ (I/O) 3.3 V не поддерживается ни устройствами HS200, ни HS400.

<!-- Source EN PDF p.20; unit 146 -->

VCC_FLASH соответствует VCC.

<!-- Source EN PDF p.20; unit 147 -->

VCC_IO соответствует VCCQ.

<!-- Source EN PDF p.20; unit 148 -->

Убедитесь, что напряжения eMMC_CMD/DATA0~7/VCC_IO одинаковы: 1.8 или 3.3v.

<!-- Source EN PDF p.20; unit 149 -->

Напряжения VCC_FLASH/VCC_IO должны оставаться стабильными при включении, работе, переходе в сон и пробуждении, без провалов и чрезмерных пульсаций.

<!-- Source EN PDF p.20; unit 150 -->

По возможности измерьте качество сигналов clk, cmd и data и убедитесь в корректной форме.

<!-- Source EN PDF p.20; unit 151 -->

### 4.2 Анализ сигналов

<!-- Source EN PDF p.20; unit 152 -->

Ниже приведена временная диаграмма распознавания SD-карты; для sdio и emmc она аналогична.

<!-- Source EN PDF p.21; unit 153 -->

Кратко о распознавании SD-карты: контроллер передаёт карте 48clk и 48bit данных, а карта должна ответить контроллеру 48clk и 48bit данных, как показано ниже.

<!-- Source EN PDF p.21; unit 154 -->

![Исходная диаграмма команд и ответов](/docs/rockchip-sdmmc-sdio-emmc/assets/en-p021-X118.png)

*Исходная диаграмма команд и ответов — Источник оригинального рисунка: EN PDF p.21.*

<!-- Source EN PDF p.21; unit 155 -->

![Исходная осциллограмма команды контроллера и ответа карты](/docs/rockchip-sdmmc-sdio-emmc/assets/en-p021-X119.png)

*Исходная осциллограмма команды контроллера и ответа карты — Источник оригинального рисунка: EN PDF p.21.*

<!-- Source EN PDF p.21; unit 156 -->

Зелёный: SDMMC_CLK.

<!-- Source EN PDF p.21; unit 157 -->

Жёлтый: SDMMC_CMD; в состоянии покоя SDMMC_CMD остаётся на высоком уровне.

<!-- Source EN PDF p.21; unit 158 -->

Сигнал контроллера: если первые два уровня — один высокий и один низкий, это команда, переданная контроллером.

<!-- Source EN PDF p.21; unit 159 -->

Ответ SD-карты: два последовательных низких уровня в начале означают ответ карты.

<!-- Source EN PDF p.21; unit 160 -->

Команда контроллера и ответ обычно содержат 48 бит, поэтому полный пакет занимает 48 тактов. Необходимо проверить, отвечает ли SD-карта после отправки командного пакета контроллером.

<!-- Source EN PDF p.21; unit 161 -->

### 4.3 Анализ журналов

<!-- Source EN PDF p.21; unit 162 -->

(1) Журнал успешного распознавания SD-карты

<!-- Source EN PDF p.22; unit 163 -->

```text
[ 293.194013] mmc1: new high speed SDXC card at address 59b4
[ 293.198185] mmcblk1: mmc1:59b4 00000 59.6 GiB
[ 293.204351] mmcblk1: p1
```

<!-- Source EN PDF p.22; unit 164 -->

Такие сообщения ядра означают, что SD-карта распознана и доступен раздел p1.

<!-- Source EN PDF p.22; unit 165 -->

Если SD-карта не отображается в интерфейсе или недоступна, проверьте дисковый демон пользовательского пространства, например vold.

<!-- Source EN PDF p.22; unit 166 -->

Дополнительно можно вручную проверить доступность раздела:

<!-- Source EN PDF p.22; unit 167 -->

```text
mount -t vfat /dev/block/mmcblk1p1 /mnt
```

<!-- Source EN PDF p.22; unit 168 -->

или

<!-- Source EN PDF p.22; unit 169 -->

```text
mount -t vfat /dev/block/mmcblk1 /mnt
```

<!-- Source EN PDF p.22; unit 170 -->

Затем проверьте, появились ли файлы SD-карты в каталоге mnt.

<!-- Source EN PDF p.22; unit 171 -->

(2) При загрузке карта не читается, но после горячего подключения работает: наиболее вероятна проблема питания.

<!-- Source EN PDF p.22; unit 172 -->

Например, отключите все источники питания и проверьте, не возникает ли утечка в VCC_SD при подключённом HDMI. Другой вариант — проверка с внешним источником питания.

<!-- Source EN PDF p.22; unit 173 -->

(3) Ошибка монтирования:

<!-- Source EN PDF p.22; unit 174 -->

Если журнал из пункта (1) присутствует, но затем появляются следующие ошибки монтирования:

<!-- Source EN PDF p.22; unit 175 -->

```text
[ 2229.405694] FAT-fs (mmcblk1p1): bogus number of reserved sectors
[ 2229.405751] FAT-fs (mmcblk1p1): Can't find a valid FAT filesystem
```

<!-- Source EN PDF p.22; unit 176 -->

Источник рекомендует отформатировать SD-карту в FAT32.

<!-- Source EN PDF p.22; unit 177 -->

Либо для NTFS выберите поддержку файловой системы NTFS через `make menuconfig`.

<!-- Source EN PDF p.22; unit 178 -->

(4) Карта периодически не распознаётся:

<!-- Source EN PDF p.22; unit 179 -->

```text
mmc1: new high speed SD card at address b368
mmcblk1: mmc1:b368 SMI 486 MiB
[mmc1] Data transmission error !!!! MINTSTS: [0x00002000]
dwmmc_rockchip ff0c0000.rksdmmc: data FIFO error (status=00002000)
mmcblk1: error -110 sending status command, retrying
need_retune:0,brq->retune_retry_done:0.
```

<!-- Source EN PDF p.22; unit 180 -->

Понизьте частоту и увеличьте задержку обнаружения карты для повышения стабильности питания. Если понижение частоты устраняет проблему, проверьте разводку платы.

<!-- Source EN PDF p.22; unit 181 -->

```text
&sdmmc {
    card-detect-delay = <1200>;
}
```

<!-- Source EN PDF p.23; unit 182 -->

(5) TF-карта смонтирована, но её каталог недоступен. Похоже на проблему файловой системы, хотя в Windows карта читается.

<!-- Source EN PDF p.23; unit 183 -->

Попробуйте восстановить TF-карту с помощью fsck.

<!-- Source EN PDF p.23; unit 184 -->

(6) Аппаратная проблема: ненормальное напряжение IO.

<!-- Source EN PDF p.23; unit 185 -->

```text
Workqueue: kmmcd mmc_rescan
[<c0013e24>] (unwind_backtrace+0x0/0xe0) from [<c001172c>] (show_stack+0x10/0x14)
[<c001172c>] (show_stack+0x10/0x14) from [<c04fa444>] (dw_mci_set_ios+0x9c/0x21c)
[<c04fa444>] (dw_mci_set_ios+0x9c/0x21c) from [<c04e7748>] (mmc_set_chip_select+0x18/0x1c)
[<c04e7748>] (mmc_set_chip_select+0x18/0x1c) from [<c04ebd5c>] (mmc_go_idle+0x94/0xc4)
[<c04ebd5c>] (mmc_go_idle+0x94/0xc4) from [<c0748d80>] (mmc_rescan_try_freq+0x54/0xd0)
[<c0748d80>] (mmc_rescan_try_freq+0x54/0xd0) from [<c04e85d0>] (mmc_rescan+0x2c4/0x390)
[<c04e85d0>] (mmc_rescan+0x2c4/0x390) from [<c004d738>] (process_one_work+0x29c/0x458)
[<c004d738>] (process_one_work+0x29c/0x458) from [<c004da88>] (worker_thread+0x194/0x2d4)
[<c004da88>] (worker_thread+0x194/0x2d4) from [<c0052fb4>] (kthread+0xa0/0xac)
[<c0052fb4>] (kthread+0xa0/0xac) from [<c000da98>] (ret_from_fork+0x14/0x3c)
1409..dw_mci_set_ios: wait for unbusy timeout....... STATUS = 0x306 [mmc1]
```

<!-- Source EN PDF p.23; unit 186 -->

Проверьте высокий уровень на CMD и DATA без нагрузки. Убедитесь, что напряжение IO не слишком мало и соответствует конфигурации домена питания. Для SDIO также проверьте VCCIO_WL, VBAT_WL, WIFI_REG_ON и работу кварцевого генератора. Проверьте, не ухудшает ли слишком длинная разводка качество сигналов; выполните тест с пониженной частотой.

<!-- Source EN PDF p.23; unit 187 -->

### 4.4 Другие проблемы

<!-- Source EN PDF p.23; unit 188 -->

(1) SD-карта работает с 1 линией, но выдаёт ошибки с 4 линиями. Китайский источник, с. 20, уточняет контекст: u-boot; в английском заголовке это опущено.

<!-- Source EN PDF p.23; unit 189 -->

У большинства SoC линии SD-карты совмещены с JTAG. Если карта не установлена, SoC автоматически переключает IO на JTAG.

<!-- Source EN PDF p.23; unit 190 -->

На эталонной плате EVB низкий уровень SD DET означает вставленную карту согласно требованиям SoC. Если изменить схему так, чтобы установленная карта давала высокий уровень SD DET, SoC может ошибочно переключить IO на JTAG.

<!-- Source EN PDF p.23; unit 191 -->

Решение: найдите определение регистра GRF соответствующего чипа и установите force_jtag в Disable, отключив автоматическое переключение IO JTAG.

<!-- Source EN PDF p.23; unit 192 -->

Пример кода для RV1126:

<!-- Source EN PDF p.23-24; unit 193 -->

```text
diff --git a/arch/arm/mach-rockchip/rv1126/rv1126.c b/arch/arm/mach-rockchip/rv1126/rv1126.c
index 311310d3f2..29b694df9c 100644
--- a/arch/arm/mach-rockchip/rv1126/rv1126.c
+++ b/arch/arm/mach-rockchip/rv1126/rv1126.c
@@ -544,6 +544,9 @@ void board_debug_uart_init(void)
 #ifndef CONFIG_TPL_BUILD
 int arch_cpu_init(void)
 {
+ struct rv1126_grf * const grf = (void *)GRF_BASE;
+
+ writel(0x00100000, &grf->iofunc_con3);
        /*
         * CONFIG_DM_RAMDISK: for ramboot that without SPL.
         */
```

<!-- Source EN PDF p.24; unit 195 -->

(2) Утечка питания SD-карты вызывает нарушения работы

<!-- Source EN PDF p.24; unit 196 -->

Если питание IO модуля SD неуправляемое и карта вставлена до подачи 3V3, ток может поступать через IO обратно в карту и создавать промежуточное напряжение на её питании 3V3. Для некоторых карт это вызывает случайные ошибки и плохую совместимость с платформой. Для устранения утечки драйвер при вставке карты сначала включает подтяжку IO вниз, устраняет остаточное питание, а затем подаёт 3V3. После включения питания IO возвращаются к функции SD и получают подтяжку вверх. При высоких требованиях к совместимости убедитесь, что `drivers/mmc/host/dw_mmc.c` в ядре SDK содержит коммит "mmc: dw_mmc: Add normal and idle pinctrl control". По следующему примеру измените собственный узел DTS, добавив режим pinctrl idle. Линии clk, cmd и data необходимо выбрать согласно реальной схеме платы:

<!-- Source EN PDF p.24-25; unit 197 -->

```text
--- a/arch/arm/boot/dts/rv1126-evb-v10.dtsi
+++ b/arch/arm/boot/dts/rv1126-evb-v10.dtsi
    wireless_wlan: wireless-wlan {
@@ -104,9 +99,14 @@ sdmmc_pwren: sdmmc-pwren {
            rockchip,pins = <0 RK_PA1 RK_FUNC_GPIO &pcfg_pull_none>;
        };
+ sdmmc0_idle_pins: sdmmc-idle-pins {
+ rockchip,pins =
+ <3 RK_PA2 RK_FUNC_GPIO &pcfg_pull_down>,
+ <3 RK_PA3 RK_FUNC_GPIO &pcfg_pull_down>,
+ <3 RK_PA4 RK_FUNC_GPIO &pcfg_pull_down>,
+ <3 RK_PA5 RK_FUNC_GPIO &pcfg_pull_down>,
+ <3 RK_PA6 RK_FUNC_GPIO &pcfg_pull_down>,
+ <3 RK_PA7 RK_FUNC_GPIO &pcfg_pull_down>;
+ };
    };
@@ -140,21 +140,18 @@ &sdio {
 };
 &sdmmc {
    max-frequency = <200000000>;
    no-sdio;
    no-mmc;
    bus-width = <4>;
    cap-mmc-highspeed;
    cap-sd-highspeed;
    disable-wp;
- pinctrl-names = "default";
+ pinctrl-names = "normal", "idle";
    pinctrl-0 = <&sdmmc0_clk &sdmmc0_cmd &sdmmc0_det &sdmmc0_bus4>;
+ pinctrl-1 = <&sdmmc0_idle_gpios &sdmmc0_det>;
    vmmc-supply = <&vcc3v3_sd>;
    vqmmc-supply = <&vccio_sd>;
    status = "okay";
 };
```

{% endraw %}

