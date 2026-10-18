---
title: "Rockchip RGMII Delayline: сканирование окна, rgmii-rxid и целостность сигнала"
description: "Полная настройка RGMII delayline: loopback, DTS, vendor storage, осциллограммы и выбор PHY."
translation_key: "066-rockchip-rgmii-delayline"
slug: "066-rockchip-rgmii-delayline"
lang: "ru"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "RGMII"]
keywords: "ArmSoM Rockchip rockchip rgmii delayline"
excerpt: "Полная настройка RGMII delayline: loopback, DTS, vendor storage, осциллограммы и выбор PHY."
---

{% raw %}

# Rockchip RGMII Delayline: сканирование окна, rgmii-rxid и целостность сигнала

## Применимость к ArmSoM и область исходника

Справочный материал для адаптации ArmSoM на основе CN/EN V1.2.0. Сочетания платы, SDK/BSP, ядра и соединений аппаратно не проверялись. Область исходника ниже не означает поддержку каждой платой ArmSoM либо каждым ядром. Проверьте SoC, схему, SDK/BSP, драйвер и pinmux. Команды, патчи, журналы и измерения взяты из исходника и не являются тестами ArmSoM.

Рисунки китайской версии взяты из китайского PDF, английской и русской — из английского.

| SoC исходника | Ядра по исходнику |
| --- | --- |
| ALL chipset | All version |

Gigabit Ethernet Rockchip использует RGMII. Регулируемые задержки TX/RX компенсируют различия аппаратных реализаций. Руководство описывает подбор пары delayline и улучшение аппаратуры для расширения рабочего окна.

[Редакционные примечания](/docs/rockchip-rgmii-delayline/EDITORIAL-NOTES.md) · [ArmSoM documentation](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source EN PDF p.5, unit 0 -->

## 1. Получение RGMII Delayline

<!-- Source EN PDF p.5, unit 1 -->

Если проект использует Gigabit Ethernet с интерфейсом RGMII, при любом изменении аппаратной реализации необходимо заново подобрать delayline. Значение, не соответствующее конкретному оборудованию, ухудшает производительность Gigabit Ethernet и может нарушить обычную работу сети.

<!-- Source EN PDF p.5, unit 2 -->

### 1.1 Проверка кода

<!-- Source EN PDF p.5, unit 3 -->

Реализация находится в `drivers/net/ethernet/stmicro/stmmac/dwmac-rk-tool.c`, поэтому её удобно переносить. Если этого кода в проекте нет, запросите патч через Redmine. Предусмотрены варианты для kernel-4.4 и kernel-3.10; английский исходник указывает, что версии после kernel-4.4 уже должны поддерживать эту функцию. Китайский исходник точнее называет Kernel-4.19 и последующие версии; различие сохранено в примечаниях.

<!-- Source EN PDF p.5, unit 4 -->

Патч для Kernel-4.4: `Rockchip_RGMII_Delayline_Kernel4.4.tar.gz`. Производительность ядра 4.4 была оптимизирована, а патч сформирован относительно актуального кода. Если возникают ошибки сборки, сначала примените `kernel4.4_stmmac_optimize_output_performances_20191119.zip`.

<!-- Source EN PDF p.5, unit 5 -->

Патч для Kernel-3.10: `Rockchip_RGMII_Delayline_Kernel3.10.tar.gz`.

<!-- Source EN PDF p.5, unit 6 -->

### 1.2 Проверка узлов

<!-- Source EN PDF p.5, unit 7 -->

После проверки кода и сборки прошивка должна создать несколько узлов sysfs. Если их нет, патч применён некорректно. Например, для RK3399 эти узлы находятся в `/sys/devices/platform/fe300000.ethernet`:

<!-- Source EN PDF p.5, unit 8 -->

![Узлы sysfs RGMII delayline — источник EN PDF p.5](/docs/rockchip-rgmii-delayline/assets/en-p05-figure1.png)

*Узлы sysfs RGMII delayline — источник EN PDF p.5.*

Копируемая техническая выдержка из изображения; обрезанные края и графические строки сканирования не восстанавливаются догадками. Полный исходный рисунок сохранён выше.

```text
rk3399_all:/ # ls -l /sys/devices/platform/fe300000.ethernet/
total 0
lrwxrwxrwx 1 root root    0 2013-01-18 20:21 driver -> ../../../bus/platform/drivers/rk_gmac-dwmac
-rw-r--r-- 1 root root 4096 2013-01-18 20:21 driver_override
--w------- 1 root root 4096 2013-01-18 20:21 mac_lb
drwxr-xr-x 3 root root    0 2013-01-18 08:50 mdio_bus
-r--r--r-- 1 root root 4096 2013-01-18 20:21 modalias
drwxr-xr-x 3 root root    0 2013-01-18 08:50 net
lrwxrwxrwx 1 root root    0 2013-01-18 20:21 of_node -> ../../../firmware/devicetree/base/ethernet@fe300000
--w------- 1 root root 4096 2013-01-18 20:21 phy_lb
--w------- 1 root root 4096 2013-01-18 20:21 phy_lb_scan
drwxr-xr-x 2 root root    0 2013-01-18 08:50 power
-rw-r--r-- 1 root root 4096 2013-01-18 20:21 rgmii_delayline
lrwxrwxrwx 1 root root    0 2013-01-18 20:21 subsystem -> ../../../bus/platform
-rw-r--r-- 1 root root 4096 2013-01-18 08:50 uevent
```

<!-- Source EN PDF p.5, unit 9 -->

### 1.3 Использование

<!-- Source EN PDF p.5, unit 10 -->

Если используется PHY RTL8211E, перед тестом необходимо отсоединить сетевой кабель.

<!-- Source EN PDF p.6, unit 11 -->

#### 1.3.1 Сканирование окна delayline

<!-- Source EN PDF p.6, unit 12 -->

Сканирование через узел `phy_lb_scan` позволяет получить окно и координаты его центра. Сканировать нужно на гигабитной скорости `1000`.

<!-- Source EN PDF p.6, unit 13 -->

```text
echo 1000 > phy_lb_scan
```

<!-- Source EN PDF p.6, unit 14 -->

Горизонтальная ось соответствует TX delayline с диапазоном `<0x00, 0x7f>`, вертикальная — RX delayline с тем же диапазоном. Символ `O` обозначает успешную проверку координаты, пробел — неудачный loopback. В примере RK3399 после гигабитного сканирования исключают строки и столбцы с пропусками внутри окна, получают прямоугольную область и её центр. Координаты RX напечатаны, а координаты TX из-за ширины вывода не показаны: их следует отсчитывать вручную от двоеточия в `RX(0xXX):`.

<!-- Source EN PDF p.6, unit 15 -->

![Окно сканирования TX/RX loopback — источник EN PDF p.6](/docs/rockchip-rgmii-delayline/assets/en-p06-figure1.png)

*Окно сканирования TX/RX loopback — источник EN PDF p.6.*

<!-- Source EN PDF p.6, unit 16 -->

Координаты центра также выводятся после окна сканирования:

<!-- Source EN PDF p.6, unit 17 -->

![Координаты центра окна delayline — источник EN PDF p.6](/docs/rockchip-rgmii-delayline/assets/en-p06-figure2.png)

*Координаты центра окна delayline — источник EN PDF p.6.*

Копируемая техническая выдержка из изображения; обрезанные края и графические строки сканирования не восстанавливаются догадками. Полный исходный рисунок сохранён выше.

```text
[42055.560261] RX(0x7d):
[42055.711729] RX(0x7e):
[42055.857406] RX(0x7f):
[42056.002810]
[42056.002810] Find suitable tx_delay = 0x2e, rx_delay = 0x0f
```

<!-- Source EN PDF p.6, unit 18 -->

В исходном примере качество аппаратных сигналов платы RK3399 невысокое, поэтому окно небольшое. Для 100 Мбит/с тоже можно получить окно: `echo 100 > phy_lb_scan` показывает существенно большую область, занимающую почти все координаты, поскольку требования к сигналу ниже, чем для гигабитного режима.

<!-- Source EN PDF p.7, unit 19 -->

#### 1.3.2 Проверка найденного значения

<!-- Source EN PDF p.7, unit 20 -->

Запишите найденные значения в `rgmii_delayline` и проверьте передачу TX/RX с помощью `phy_lb`. Прежде чем продолжать, этот тест должен завершиться успешно.

<!-- Source EN PDF p.7, unit 21 -->

```text
echo (tx delayline) (rx delayline) > rgmii_delayline
cat rgmii_delayline
echo 1000 > phy_lb
```

<!-- Source EN PDF p.7, unit 22 -->

![Настройки delayline и результат PHY loopback — источник EN PDF p.7](/docs/rockchip-rgmii-delayline/assets/en-p07-figure1.png)

*Настройки delayline и результат PHY loopback — источник EN PDF p.7.*

Копируемая техническая выдержка из изображения; обрезанные края и графические строки сканирования не восстанавливаются догадками. Полный исходный рисунок сохранён выше.

```text
[42265.031754] Set rgmii delayline tx: 0x2e, rx: 0xf
rk3399_all:/sys/devices/platform/fe300000.ethernet # cat rgmii_delayline
tx delayline: 0x2e, rx delayline: 0xf
rk3399_all:/sys/devices/platform/fe300000.ethernet # echo 1000 > phy_lb
[42270.042819] PHY loopback speed set to 1000
[42270.738739] PHY loopback: PASS
```

<!-- Source EN PDF p.7, unit 23 -->

После успешного теста внесите значения в DTS: `tx_delay = <0x2e>;` и `rx_delay = <0x0f>;`. Перепрошейте устройство и продолжите проверку ping либо производительности iperf. Обычно этого этапа достаточно.

<!-- Source EN PDF p.7, unit 24 -->

```text
&gmac {
        phy-supply = <&vcc_lan>;
        clock_in_out = "output";
        assigned-clocks = <&cru SCLK_MAC>, <&cru SCLK_RMII_SRC>;
        assigned-clock-parents = <&cru PLL_NPLL>, <&cru SCLK_MAC>;
        assigned-clock-rates = <0>, <125000000>;
        phy-mode = "rgmii";
        pinctrl-names = "default";
        pinctrl-0 = <&rgmii_pins>;
        snps,reset-gpio = <&gpio3 RK_PB7 GPIO_ACTIVE_LOW>;
        snps,reset-active-low;
        snps,reset-delays-us = <0 10000 50000>;
        tx_delay = <0x2e>;
        rx_delay = <0x0f>;
        status = "okay";
};
```

<!-- Source EN PDF p.7, unit 25 -->

#### 1.3.3 Автоматическое сканирование

<!-- Source EN PDF p.7, unit 26 -->

Если одна пара delayline не подходит всем экземплярам плат, причиной может быть низкое качество аппаратной реализации и маленькое окно с недостаточным запасом. Можно включить автоматическое сканирование параметром `CONFIG_DWMAC_RK_AUTO_DELAYLINE` в menuconfig. Однако без устранения причины малого окна эта настройка не решает проблему полностью; обычно включать её не требуется.

<!-- Source EN PDF p.7, unit 27 -->

```text
Device Drivers →
    Network device support →
        Ethernet driver support →
            [*] Auto search rgmii delayline
```

<!-- Source EN PDF p.8, unit 28 -->

Поиск выполняется только при первом запуске, после чего найденные delayline сохраняются в vendor storage. При последующих загрузках значения читаются оттуда и заменяют настройки DTS. Повторное сканирование при следующей загрузке выполняется только после очистки vendor storage.

<!-- Source EN PDF p.8, unit 29 -->

Журнал первого запуска:

<!-- Source EN PDF p.8, unit 30 -->

```text
[ 23.532138] Find suitable tx_delay = 0x2f, rx_delay = 0x10
```

<!-- Source EN PDF p.8, unit 31 -->

Журнал последующих запусков:

<!-- Source EN PDF p.8, unit 32 -->

```text
[ 23.092358] damac rk read rgmii dl from vendor tx: 0x2f, rx: 0x10
```

<!-- Source EN PDF p.8, unit 33 -->

### 1.4 Режим rgmii-rxid

<!-- Source EN PDF p.8, unit 34 -->

Если аппаратно включена задержка RX в PHY, например RTL8211F:

<!-- Source EN PDF p.8, unit 35 -->

![Выбор встроенной задержки RX/TX PHY — источник EN PDF p.8](/docs/rockchip-rgmii-delayline/assets/en-p08-figure1.png)

*Выбор встроенной задержки RX/TX PHY — источник EN PDF p.8.*

<!-- Source EN PDF p.8, unit 36 -->

Нужно выключить задержку RX в GMAC и выбрать в DTS режим `rgmii-rxid`, например:

<!-- Source EN PDF p.8, unit 37 -->

```text
&gmac0 {
    /* Use rgmii-rxid mode to disable rx delay inside Soc */
    phy-mode = "rgmii-rxid";
    clock_in_out = "output";
    ......
}；
```

<!-- Source EN PDF p.8, unit 38 -->

Сканирование описанным выше способом даёт следующий результат:

<!-- Source EN PDF p.8, unit 39 -->

![Сканирование только TX в режиме rgmii-rxid — источник EN PDF p.8](/docs/rockchip-rgmii-delayline/assets/en-p08-figure2.png)

*Сканирование только TX в режиме rgmii-rxid — источник EN PDF p.8.*

Копируемая техническая выдержка из изображения; обрезанные края и графические строки сканирования не восстанавливаются догадками. Полный исходный рисунок сохранён выше.

```text
# echo 1000 > phy_lb_scan
[ 429.089639] Delayline scan speed set to 1000
[ 429.560194] dwmac4: Master AXI performs any burst length
[ 429.859831] Find available tx_delay = 0x43, rx_delay = disable
[ 430.104205] dwmac4: Master AXI performs any burst length
[ 430.104254] rk_gmac-dwmac fe1b0000.ethernet eth1: No Safety Features support found
[ 430.104282] rk_gmac-dwmac fe1b0000.ethernet eth1: IEEE 1588-2008 Advanced Timestamp supported
[ 430.104718] rk_gmac-dwmac fe1b0000.ethernet eth1: registered PTP clock
[ 430.104758] rk_gmac-dwmac fe1b0000.ethernet eth1: configuring for phy/rgmii-rxid link mode
```

<!-- Source EN PDF p.8, unit 40 -->

Поскольку RX delay фиксирована аппаратурой PHY и обычно равна 2 ns, задержка RX не сканируется. После сканирования TX выберите оптимальное значение и внесите его в `tx_delay` узла GMAC в DTS; свойство `rx_delay` закомментируйте.

<!-- Source EN PDF p.9, unit 41 -->

```text
&gmac0 {
    /* Use rgmii-rxid mode to disable rx delay inside Soc */
    phy-mode = "rgmii-rxid";
    clock_in_out = "output";
    ......
    tx_delay = <0x43>;
    /* rx_delay = <0x42>; */
    phy-handle = <&rgmii_phy>;
    status = "okay";
}；
```

<!-- Source EN PDF p.9, unit 42 -->

## 2. Проверка аппаратной части

<!-- Source EN PDF p.9, unit 43 -->

### 2.1 Проверка временных параметров RGMII

<!-- Source EN PDF p.9, unit 44 -->

Проверьте соответствие платы следующим временным требованиям RGMII. Если измерение выполнить невозможно либо нет подходящего осциллографа, оформите запрос через Redmine. Ссылка исходника на «последний» протокол относится ко времени подготовки документа, а не подтверждает актуальную редакцию стандарта.

<!-- Source EN PDF p.9, unit 45 -->

![Временные требования RGMII и примечания — источник EN PDF p.9](/docs/rockchip-rgmii-delayline/assets/en-p09-figure1.png)

*Временные требования RGMII и примечания — источник EN PDF p.9.*

| Symbol | Параметр | Min | Typical | Max | Units |
| --- | --- | --- | --- | --- | --- |
| TskewT | Сдвиг данных относительно выходного такта передатчика, прим. 1 | -500 | 0 | 500 | ps |
| TskewR | Сдвиг входных данных относительно такта приёмника, прим. 1 | 1 | 1.8 | 2.6 | ns |
| TsetupT | Время установки выходных данных передатчика, встроенная задержка, прим. 4 | 1.2 | 2.0 |  | ns |
| TholdT | Время удержания выходных данных передатчика, встроенная задержка, прим. 4 | 1.2 | 2.0 |  | ns |
| TsetupR | Время установки входных данных приёмника, встроенная задержка, прим. 4 | 1.0 | 2.0 |  | ns |
| TholdR | Время установки входных данных приёмника, прим. 4 (исходник повторяет setup) | 1.0 | 2.0 |  | ns |
| Tcyc | Период такта, прим. 2 | 7.2 | 8 | 8.8 | ns |
| Duty_G | Коэффициент заполнения Gigabit, прим. 3 | 45 | 50 | 55 | % |
| Duty_T | Коэффициент заполнения 10/100T, прим. 3 | 40 | 50 | 60 | % |
| Tr / Tf | Время нарастания/спада (20–80%) |  |  | .75 | ns |

Прим. 1: до RGMII 2.0 разводка PCB должна добавлять к такту задержку более 1.5 ns и менее 2.0 ns. Максимум для 10/100 не задан.

Прим. 2: при 10 и 100 Mbps Tcyc составляет соответственно 400 ns ±40 ns и 40 ns ±4 ns.

Прим. 3: при смене скорости или переходе в тактовый домен принятого пакета заполнение может изменяться, если минимум соблюдён и растяжение не превышает три Tcyc меньшей скорости.

Прим. 4: TsetupT/TholdT допускают встроенную задержку TXC/RXC передатчика — RGMII-ID. Устройство может поддерживать включение/отключение задержки с соблюдением нормы. Описание TholdR в рисунке повторяет Setup; это не исправлялось молча.

<!-- Source EN PDF p.9, unit 46 -->

Например, при проверке CLK в гигабитном режиме измеряйте сигналы возле приёмника, а не передатчика: отражения на стороне передатчика искажают реальную картину. Для MAC_CLK, TX_CLK и RX_CLK важны коэффициент заполнения, амплитуда, время нарастания и спада. Полоса осциллографа и пробника должна превышать пятикратную частоту 125M. У однополярного пробника контур земли должен быть минимальным; предпочтителен дифференциальный пробник. Коэффициент заполнения должен составлять 45–55%. При корректной измерительной системе наблюдается прямоугольный, а не синусоидальный сигнал. Синусоида с заполнением 50%, часто получаемая при самостоятельной проверке, обычно означает неверное измерение.

<!-- Source EN PDF p.10, unit 47 -->

#### 2.1.1 RX_CLK / MAC_CLK

<!-- Source EN PDF p.10, unit 48 -->

MAC_CLK или RXCLK формируется PHY. При плохой целостности принимаемого CLK обычно нет регистра PHY для регулировки, поэтому требуется аппаратная коррекция. Последовательная высокочастотная индуктивность у передатчика может улучшить слишком пологий фронт; обычная индуктивность не подходит, её полоса должна удовлетворять требованиям. Резистивный делитель на стороне передатчика позволяет уменьшить амплитуду и скорректировать заполнение.

<!-- Source EN PDF p.10, unit 49 -->

#### 2.1.2 TX_CLK

<!-- Source EN PDF p.10, unit 50 -->

Если у TX_CLK слишком пологий фронт, прочитайте соответствующий регистр командой IO и проверьте, установлена ли максимальная сила драйвера IO. Одновременно наблюдайте осциллограмму и непосредственно меняйте силу драйвера командами IO. Если улучшение невелико, попробуйте последовательную высокочастотную индуктивность или увеличение последовательного резистора 22 ohm. Если заполнение не соответствует требованиям и TX_CLK получен обходом от MAC_CLK, его можно изменить делением амплитуды MAC_CLK: исходник предлагает последовательный резистор 100 ohm, а сопротивление к земле зависит от разводки платы. Начинайте со 100 и увеличивайте до выполнения требований по осциллограмме. Если эти методы малоэффективны и IO работает от 3.3V, при поддержке 1.8V обеими сторонами — PHY и платформой Rockchip — можно перевести питание IO на 1.8V и повторить измерение. Исходник рекомендует 1.8V IO как обеспечивающее лучшие показатели сигнала, чем 3.3V; применимость к конкретной схеме должна быть проверена.

<!-- Source EN PDF p.10, unit 51 -->

## 3. Частые вопросы

<!-- Source EN PDF p.10, unit 52 -->

### 3.1 Размер окна сканирования

<!-- Source EN PDF p.10, unit 53 -->

Чем больше успешное окно, тем лучше качество сигнала и запас. Отсутствие окна либо слишком маленькое окно обычно свидетельствуют об аппаратной проблеме; см. раздел об аппаратной части.

<!-- Source EN PDF p.10, unit 54 -->

### 3.2 Выбор PHY

<!-- Source EN PDF p.10, unit 55 -->

Специальных ограничений по выбору PHY нет, если он соответствует RGMII. Однако учитывайте два момента:

<!-- Source EN PDF p.10, unit 56 -->

Если предполагается гигабитный PHY RTL8211E, исходник рекомендует заменить его на RTL8211F либо другой PHY, ссылаясь на раздел 2.1. Полнота этого объяснения в оригинале сомнительна и отмечена в редакционных примечаниях.

<!-- Source EN PDF p.10, unit 57 -->

Если PHY не поддерживает loopback, используйте следующий способ подбора delayline:

<!-- Source EN PDF p.11, unit 58 -->

Регулируйте PHY по осциллограмме. Осциллографом с полосой более пятикратной частоты 125M измерьте возле PHY разность фаз TXC и TXD.

<!-- Source EN PDF p.11, unit 59 -->

Командами IO установите задержку в диапазоне 1.5–2 ns, оставляя запас относительно указанной нормы 1–2.6 ns; после этого TX должен работать. Поскольку задержка RX создаётся внутри SoC, без loopback её оценивают по пропускной способности. Зафиксировав tx_delay, задайте rx_delay равным 0x10 и измерьте входящий поток с iperf. Если результат недостаточен, изменяйте регистр rxdelay командами IO с шагом 5 в диапазоне 0x10–0x7f. Когда пропускная способность превысит 900M, уменьшите шаг до 2, найдите диапазон значений, позволяющих получить 900M, и внесите его середину в DTS. Эти величины и результаты — рекомендации и примеры исходника, не измерения ArmSoM.

<!-- Source EN PDF p.11, unit 60 -->

Осциллограмма разности фаз TXC и TXD:

<!-- Source EN PDF p.11, unit 61 -->

![Осциллограмма разности фаз TXC/TXD — источник EN PDF p.11](/docs/rockchip-rgmii-delayline/assets/en-p11-figure1.png)

*Осциллограмма разности фаз TXC/TXD — источник EN PDF p.11.*

{% endraw %}
