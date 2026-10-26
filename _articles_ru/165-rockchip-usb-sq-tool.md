---
title: "Rockchip USB SQ Tool: настройка PHY USB2.0/USB3.1 и интеграция кода"
description: "Rockchip USB SQ Tool: настройка PHY USB2.0/USB3.1 и интеграция кода — V1.8.0"
excerpt: "Rockchip USB SQ Tool: настройка PHY USB2.0/USB3.1 и интеграция кода"
translation_key: "165-rockchip-usb-sq-tool"
slug: "165-rockchip-usb-sq-tool"
lang: "ru"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, USB, PHY, Linux, Signal]
---

{% raw %}

# Rockchip USB SQ Tool: настройка PHY USB2.0/USB3.1 и интеграция кода

Платформенная справка ArmSoM по китайскому RK-SM-YF-195 V1.8.0. Указаны Linux 4.4/4.19/5.10/6.1, RT-Thread; поддержка чипов/портов приведена ниже. Проверяйте плату ArmSoM, BSP и драйвер PHY; поддержка всех плат не заявляется. Английского PDF нет, полные переводы EN/RU/DE используют все 13 рисунков китайского исходника. По источнику, руководства PHY не опубликованы, а TRM не содержит подробных регистров: инструмент упрощает отладку, выдавая команды проверки соответствия/настройки и генерируя код драйвера PHY. Настройка и аппаратные тесты не выполнялись.

Неясности: §3.13 RK3562 заканчивается `]`, не `}`; это подтверждено страницей, сохранено, но напрямую не компилируется. Примеры с многоточиями §3.25/3.26 не являются полными патчами. Список USB3.1 §2.1 не содержит RK3588S, но таблица 2 содержит; оба сохранены, поддержку нужно проверить. TXPREEMPPLUSE сохранён как в оригинале. Текст китайских рисунков не перерисован. Большие параметры не обязательно лучше.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip USB SQ Tool](https://redmine.rock-chips.com/documents/113)

## 1. Настройка сигналов USB PHY Rockchip

Проблемы качества USB-сигналов в реальном устройстве решают улучшением схемы или программной настройкой регистров PHY. В обоих случаях сначала измерьте глазковую диаграмму и используйте отчёт для анализа. Rockchip USB SQ Tool предназначен для программной коррекции проваленных eye-тестов, ошибок перечисления из-за сигнала или перепада питания PHY, неожиданных отключений и отсутствия обнаружения извлечения. Проблемы сильно зависят от аппаратуры: плохих/длинных кабелей, высокого импеданса трасс или кабеля. Сначала улучшайте аппаратуру; программную коррекцию рассматривайте, только если это невозможно.

## 2. Интерфейс Rockchip USB SQ Tool

### 2.1 Главное окно

USB 2.0 поддерживает RK1808, RK1820, RK2116, RK2118, RK3036, RK312X, RK3228, RK3288, RK3308, RK3308B-S, RK3326, RK3326S, RK3328, RK3399, RK3506, RK3528, RK3562, RK3566, RK3568, RK3576, RK3588, RK3588S, RV1103, RV1103B, RV1106, RV1109, RV1126, RV1126B, RV1126B-P, PX30, PX30S. RK3328 поддерживает только USB2.0 OTG/HOST, не U2PHY USB3.0. USB 3.1 поддерживает RK1808, RK1820, RK3399, RK3528, RK3562, RK3566, RK3568, RK3576, RK3588, RV1126B; остальные платформы планируются после разработки/проверки. Инструмент работает только в Windows. Адрес исходника: https://redmine.rock-chips.com/documents/113 . Откройте Rockchip USB SQ Tool.exe: появится выбор платформы (рисунок 1). Нажмите кнопку платформы для её окна настройки.

![Интерфейс из китайского исходника](/docs/rockchip-usb-sq-tool/assets/cn-p006-figure-01.png)

Рисунок 1. Главное окно. Некоторые платформы имеют одинаковый интерфейс PHY, поэтому приводится один представитель группы. Таблицы 1 и 2 сопоставляют платформы USB2.0/USB3.1 с примерами интерфейса.

Таблица 1. Примеры интерфейса USB2.0 PHY.

| Платформа | Пример интерфейса настройки PHY |
| --- | --- |
| RK1808 | RK1808 USB2.0 Tuning интерфейс |
| RK3036、RK312X、RK3228、RK3308、RK3326、RK3328 、RK3399、PX30 | RK3399 USB2.0 Tuning интерфейс |
| RK1820、RK3308B-S、RK3326S、RK3506、RK3528、RK3562、RK3566、 RK3568、RV1126B、RV1126B-P、PX30S | RK3568 USB2.0 Tuning интерфейс |
| RK3576、RK3588、RK3588S | RK3588 USB2.0 Tuning интерфейс |
| RK2116、RK2118、RV1103、RV1103B、RV1106 | RV1106 USB2.0 Tuning интерфейс |
| RV1109、RV1126 | RV1109 USB2.0 Tuning интерфейс |

Таблица 2. Примеры интерфейса USB3.1 PHY.

| Платформа | Пример интерфейса настройки PHY |
| --- | --- |
| RK1808 | RK1808 USB3.1 Tuning интерфейс |
| RK1820 | RK1820 USB3.1 Tuning интерфейс |
| RK3399 | RK3399 USB3.1 Tuning интерфейс |
| RK3528、RK3562、RK3566、RK3568、RV1126B | RK3528 USB3.1 Tuning интерфейс |
| RK3576、RK3588、RK3588S | RK3588 USB3.1 Tuning интерфейс |

Соблюдайте порядок настройки в инструменте. Переходите дальше, только если предыдущие шаги не улучшили результат или не обеспечили требования; шаги с малым влиянием можно пропустить. Настройка рискованна: не меняйте параметры вслепую. Желательно наблюдать глазковую диаграмму и изменять умеренно, останавливаясь при выполнении требований; больше не значит лучше. Оценивайте риск самостоятельно.

### 2.2 RK1808 USB2.0 Tuning интерфейс

Параметры USB2.0 RK1808 совпадают с RK3568. В отличие от RK3568, регистры PHY имеют write_enable в старших 16 битах, поэтому читать начальные значения не требуется. Описание параметров см. в подразделе RK3568 USB2.0.

![Интерфейс из китайского исходника](/docs/rockchip-usb-sq-tool/assets/cn-p008-figure-01.png)

Рисунок 2.  RK1808 USB2.0 PHY интерфейс настройки

### 2.3 RK3399 USB2.0 Tuning интерфейс

RK3399 USB2.0 поддерживает TYPE-C0, TYPE-C1, HOST0, HOST1. Порядок настройки:

1. Выберите интерфейс слева в рамке 1; справа автоматически появится команда SQ-теста.

2. Выберите параметры в красной рамке 2. Pre-emphasize выбирается флажками; остальные — элементами вроде рамки 4, вводом или кнопками вверх/вниз. Для каждого указаны диапазон и описание.

3. Выберите параметры и нажмите подтверждение в рамке 3. Рядом появятся команды io, в Code Output рамки 5 — пример кода.

![Интерфейс из китайского исходника](/docs/rockchip-usb-sq-tool/assets/cn-p009-figure-01.png)

Рисунок 3.  RK3399 USB2.0 PHY интерфейс настройкиRK3399 USB2.0 параметры настройки сигнала. 

Таблица 3.  RK3399 USB2.0 параметры настройки сигнала

| Параметр | Описание |
| --- | --- |
| Pre-emphasize | Предыскажение HS Tx |
| Slew Rate | Скорость фронта глаза HS Tx |
| Compensation Voltage | Калибровка напряжения HS Tx: повышение увеличивает высоту глаза |
| Compensation Current | Калибровка тока HS Tx: повышение увеличивает высоту глаза |
| Pre-emphasize Strength | Сила предыскажения HS Tx |
| Bypass ODT &amp; Driver Strength | Обход автоматической настройки сопротивления компенсационной схемы для изменения высоты глаза |
| Squelch | Порог шума HS Rx |
| HOST Disconnect Detection | Порог отключения HS, только HOST |

### 2.4 RK3568 USB2.0 Tuning интерфейс

RK3568 USB2.0 поддерживает OTG, HOST1, HOST2, HOST3. Порядок настройки:

1. Выберите интерфейс слева в рамке 1; справа автоматически появится команда SQ-теста.

2. Регистры PHY RK3568 USB2.0 не имеют write_enable в старших 16 битах. Чтобы не изменить посторонние биты, прочитайте исходное значение командой рамки 2 и введите его в поле справа.

3. Выберите параметры в рамке 3. Pre-emphasize задаётся флажками, остальные — элементами вроде рамки 5: вводом или кнопками вверх/вниз. Каждый параметр содержит диапазон и описание.

4. Нажмите подтверждение в рамке 4. Рядом появятся команды io, в Code Output рамки 6 — пример кода. Важно: поле начального значения заполнено по умолчанию; без замены это может повлиять на результат. Перед тестом обязательно прочитайте текущее значение регистра и введите его.

![Интерфейс из китайского исходника](/docs/rockchip-usb-sq-tool/assets/cn-p011-figure-01.png)

Рисунок 4. Интерфейс RK3568 USB2.0 PHY. Четыре категории: SQ, порог шума, порог отключения, B_Sessionvalid. SQ регулирует предыскажение, высоту глаза, скорость фронта и силу драйвера. Параметры — в таблице 4.

| Параметр | Описание |
| --- | --- |
| Pre-emphasize | Предыскажение HS Tx |
| HS Eye Height | Высота глаза HS Tx |
| HS ODT Value | Сопротивление ODT 45Ω: большее значение уменьшает сопротивление, повышает высоту глаза, но ускоряет фронты FS/LS |
| Slew Rate | Скорость фронта HS; влияние мало |
| Squelch | Порог шума HS Rx |
| HOST Disconnect Detection | Порог отключения, только HOST |
| B_Session Valid | Порог VBUS DET, только Device |

Порог шума RK3568 USB2.0: длинный, плохой или высокоимпедансный кабель может мешать перечислению High-speed. Обычно порог PHY равен 150mV. Затухание снижает полезный сигнал ниже 150mV, и он воспринимается как шум. Squelch позволяет умеренно снизить порог, обычно до 125mV или 112.5mV.

Порог отключения RK3568: используйте Host Disconnect Detection. Ниже типичный журнал подключения Host Rockchip:

```text
[ 1204.092638] usb 1-1: new high-speed USB device number 3 using ehci-platform
[ 1204.280373] usb 1-1: New USB device found, idVendor=058f, idProduct=6387, bcdDevice= 1.04
[ 1204.280449] usb 1-1: New USB device strings: Mfr=1, Product=2, SerialNumber=3
[ 1204.280476] usb 1-1: Product: Mass Storage
[ 1204.280498] usb 1-1: SerialNumber: FA45A19C
```

Типичный журнал отключения Host Rockchip:

```text
[ 985.341233] usb 1-1: USB disconnect, device number 2
```

1) Извлечение USB2.0 не обнаруживается. Если журнал отключения отсутствует, попробуйте следующее:

1. Включите предыскажение EOP, по умолчанию отключённое в SDK, как на рисунке 5.

![Интерфейс из китайского исходника](/docs/rockchip-usb-sq-tool/assets/cn-p013-figure-01.png)

Рисунок 5. Включение предыскажения EOP.

2. Уменьшите порог отключения Host. Некоторые чипы не имеют настройки EOP: пропустите шаг 1 согласно интерфейсу. Иначе выполняйте шаг 2 дополнительно к шагу 1, только если первый не помог. Слишком низкий порог вызывает самопроизвольные отключения при нормальной работе; учитывайте риск.

2) Неожиданное отключение USB2.0 при работе: попробуйте повысить порог Host. Не все отключения вызваны порогом: часто виновато устройство или аппаратная среда, поэтому не настраивайте вслепую. EOP уже отключён по умолчанию SDK, дополнительная запись не нужна. Слишком высокий порог мешает обнаружению извлечения.

B_Sessionvalid RK356X применяют, когда ПК не распознаёт USB Device (ADB/MTP) или теряет его после распознавания. Снизьте порог решения по напряжению: исходное 3'b000; в источнике рекомендованы 3'b111 (7) либо 3'b101 (5).

Три основные аппаратные причины: низкий VBUS (ниже 4.7V часто вызывает проблемы); большая пульсация USB_AVDD1V0 либо повышение до 1.2V, из-за чего PHY не обнаруживает Bvalid; большая пульсация Logic, нарушающая работу контроллера.

### 2.5 RK3588 USB2.0 Tuning интерфейс

RK3588 USB2.0 поддерживает TYPE-C0, TYPE-C1, USB2.0 HOST0, USB2.0 HOST1. Шаги:

1. Выберите интерфейс слева в рамке 1; справа автоматически появится команда SQ-теста.

2. Выберите параметры в рамке 2 вводом или кнопками вверх/вниз. Каждый содержит диапазон и описание.

3. Выберите параметры и нажмите подтверждение в рамке 2. Рядом появятся команды io, в Code Output рамки 3 — пример кода.

![Интерфейс из китайского исходника](/docs/rockchip-usb-sq-tool/assets/cn-p014-figure-01.png)

Рисунок 6.  RK3588 USB2.0 PHY интерфейс настройкиRK3588 USB2.0  параметры настройки сигнала. 

Таблица 5.  RK3588 USB2.0  параметры настройки сигнала

| Параметр | Описание |
| --- | --- |
| TXRISE | Скорость фронта HS Tx для изменения времени нарастания/спада |
| TXPREEMPAMP | Ток предыскажения HS Tx |
| TXPREEMPPLUSE | Коэффициент заполнения тока предыскажения; действует только при включённом TXPREEMPAMP TUNE |
| TXHSXV | Напряжение пересечения DP/DM HS Tx; заметного изменения нет |
| TXVREF | Постоянное напряжение HS Tx; заметно меняет амплитуду глаза |
| TXRES | Импеданс HS Tx; меняет амплитуду и время фронтов |
| TXFSLS | Импеданс FS/LS Tx; меняет амплитуду, фронты, напряжение пересечения и коэффициент заполнения |
| HOST DISCONNECT DETECTION | Порог отключения, только HOST |

### 2.6 RV1106 USB2.0 Tuning интерфейс

RV1106 USB2.0 поддерживает предыскажение и его силу, ODT, высоту глаза, пороги шума, Bvalid и отключения. У RV1103/RV1103B нет вывода VBUS DET, поэтому Bvalid не регулируется; остальные параметры совпадают с RV1106.

![Интерфейс из китайского исходника](/docs/rockchip-usb-sq-tool/assets/cn-p016-figure-01.png)

Рисунок 7.  RV1106 USB2.0 PHY интерфейс настройки

Таблица 6.  RV1106 USB2.0  параметры настройки сигнала

| Параметр | Описание |
| --- | --- |
| Pre-emphasize | Предыскажение HS Tx; по умолчанию включено |
| Pre-emphasize Strength | Сила предыскажения HS Tx; регистр действует только при включённом предыскажении |
| HS ODT Value | Сопротивление ODT 45Ω: большее значение снижает сопротивление и повышает высоту глаза, не меняя фронты FS/LS |
| Eye Height | Высота глаза HS Tx. Уровень 4:470mV требует напряжения logic чипа &gt; 850mV |
| Squelch | Порог шума HS Rx |
| BValid | Порог VBUS DET, только Device |
| HOST Disconnect Detection | Порог отключения, только HOST |

### 2.7 RV1109 USB2.0 Tuning интерфейс

RV1109 USB2.0 поддерживает скорость фронта, высоту глаза, пороги шума и отключения. RV1126 имеет те же параметры.

![Интерфейс из китайского исходника](/docs/rockchip-usb-sq-tool/assets/cn-p017-figure-01.png)

Рисунок 8.  RV1109 USB2.0 PHY интерфейс настройки



Таблица 7.  RV1109 USB2.0  параметры настройки сигнала

| Параметр | Описание |
| --- | --- |
| Slew Rate | Скорость фронта глаза HS Tx |
| Eye Height | Высота глаза HS Tx |
| Squelch | Порог шума HS Rx |
| HOST Disconnect Detection | Порог отключения, только HOST |

### 2.8 RK1808 USB3.1 Tuning интерфейс

RK1808 USB3.1 поддерживает напряжение Tx driver, размах и силу предыскажения Tx driver.

![Интерфейс из китайского исходника](/docs/rockchip-usb-sq-tool/assets/cn-p018-figure-01.png)

Рисунок 9.  RK1808 USB3.1 PHY интерфейс настройки

Таблица 8.  RK1808 USB3.1  параметры настройки сигнала

| Параметр | Описание |
| --- | --- |
| TX driver voltage | Синфазное выходное напряжение дифференциальных сигналов TXP/TXN |
| TX driver swing | Размах драйвера Tx |
| TX driver pre-emphasis strength | Сила предыскажения драйвера Tx |

### 2.9 RK1820 USB3.1 Tuning интерфейс

RK1820 USB3.1 поддерживает Full Txswing and Txmargin, Low Swing and Txmargin, Tx De-emphasis, Boost Level. Шаги:

1. RK1820 USB3.1 поддерживает настройку PHY ID. Прочитайте регистр командой рамки 1 и введите значение в поле; иначе появится ошибка.

2. Нажмите start в рамке 2, чтобы активировать кнопки подтверждения.

3. Выберите параметры и нажмите подтверждение в рамке 3. Рядом появятся команды io, в Code Output рамки Code Output — пример кода.

![Интерфейс из китайского исходника](/docs/rockchip-usb-sq-tool/assets/cn-p019-figure-01.png)

### 2.10 RK3399 USB3.1 Tuning интерфейс

RK3399 USB3.1 поддерживает OTG0 и OTG1. Шаги:

1. Выберите интерфейс слева в рамке 1; справа автоматически появится команда SQ-теста.

2. RK3399 USB3.1 определяет обе ориентации Type-C. При правильно подключённом кабеле прочитайте регистр командой рамки 2 и введите значение; иначе появится ошибка.

3. Нажмите start в рамке 3. Выбор интерфейса рамки 1 блокируется, подтверждение рамки 5 активируется.

4. Регистры PHY RK3399 USB3.1 не имеют write_enable в старших 16 битах. Чтобы не изменить посторонние биты, прочитайте исходное значение командой рамки 4 и введите его в поле справа.

5. Выберите параметры и нажмите подтверждение в рамке 5. Рядом появятся команды io, в Code Output рамки 6 — пример кода.

![Интерфейс из китайского исходника](/docs/rockchip-usb-sq-tool/assets/cn-p020-figure-01.png)

Рисунок 10.  RK3399 USB3.1 PHY интерфейс настройкиRK3399 USB3.1  параметры настройки сигнала. 

Таблица 9.  RK3399 USB3.1  параметры настройки сигнала

| Параметр | Описание |
| --- | --- |
| BOOST LEVEL | Уровень усиления Tx |

### 2.11 RK3528 USB3.1 Tuning интерфейс

RK3528 USB3.1 поддерживает Full Txswing and Txmargin, Low Swing and Txmargin, Tx De-emphasis, Boost Level. RK3562 и RK3568 имеют те же параметры.

![Интерфейс из китайского исходника](/docs/rockchip-usb-sq-tool/assets/cn-p021-figure-01.png)

Рисунок 11.  RK3528 USB3.1 PHY интерфейс настройки

Таблица 10.  RK3528 USB3.1  параметры настройки сигнала

| Параметр | Описание |
| --- | --- |
| Full Txswing and TXmargin | Полный размах/Txmargin: TX_SWING и TX_MARGIN[2:0] совместно управляют выходной амплитудой Tx |
| Low swing and Txmargin | Low swing/Txmargin: та же функция, что Full Tx swing, но другие уровни |
| TX De-emphasis | Уровень деэмфазиса передатчика |
| Boost Level | Уровень усиления Tx |

### 2.12 RK3588 USB3.1 Tuning интерфейс

RK3588 USB3.1 охватывает USB3-OTG0 (USB3&amp;Dp CombPhy0), USB3-OTG1 (USB3&amp;Dp CombPhy1), USB3-HOST2 (USB3&amp;PCIE&amp;SATA CombPhy). Шаги:

1. Выберите интерфейс слева в рамке 1; справа автоматически появится команда SQ-теста.

2. Для USB3-OTG0/1 прочитайте регистр ориентации CombPhy0/1 командой рамки 2 и введите значение. Требуется 0xCx либо 0x3x, иначе ошибка. Если чтение не удаётся (обычно Type-C), подключите кабель к проверяемому порту для активации CombPhy0/1 и повторите чтение.

3. Для USB3-HOST2 пропустите рамку 2 и нажмите START в рамке 3.

4. После START для USB3-OTG0/1 активны левые кнопки рамки 5, а правые USB3-HOST2 рамки 6 отключены; для HOST2 — наоборот.

5. Регистры PHY RK3588 USB3.1 не имеют write_enable в старших 16 битах. Чтобы не изменить посторонние биты, прочитайте исходное значение командой рамки 4 и введите его в поле справа.

6. Выберите параметры и нажмите подтверждение в рамке 5. Рядом появятся команды io, в Code Output рамки 7 — пример кода.

![Интерфейс из китайского исходника](/docs/rockchip-usb-sq-tool/assets/cn-p023-figure-01.png)

Рисунок 12.  RK3588 USB3.0 PHY интерфейс настройкиRK3588 USB3.1 параметры настройки сигнала. 

Таблица 11.  RK3588 USB3.1  параметры настройки сигнала

| Параметр | Описание |
| --- | --- |
| TX Driver main-tap level(USB3-OTG) | Напряжение SS Tx |
| TX Pmos current control(USB3-OTG) | Ток SS Tx; рекомендуется только если настройки напряжения недостаточно |
| TX De-emphasis(USB3-OTG) | Деэмфазис SS Tx |
| TX Slew Rate(USB3-OTG) | Скорость фронта SS Tx |
| Full Txswing and TXmargin(USB3-HOST) | Полный размах/Txmargin: TX_SWING и TX_MARGIN[2:0] совместно управляют выходной амплитудой Tx |
| Low swing and Txmargin(USB3-HOST) | Low swing/Txmargin: та же функция, что Full Tx swing, но другие уровни |
| TX De-emphasis(USB3- HOST) | Уровень деэмфазиса передатчика |

## 3. Генерация кода настройки USB PHY

### 3.1 RK1808 USB2.0 PHY

Добавьте код настройки RK1808 USB2.0 в `rk1808_usb2phy_tuning()` файла `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`.

```text
static int rk1808_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* OTG/Host PHY Tuning Code */
}
```

### 3.2 RK1820 USB2.0 PHY

Добавьте код настройки RK1820 USB2.0 в `HAL_USB_HsPhyInit()` файла `bsp/rockchip/common/hal/lib/hal/src/hal_usb_phy.c`.

```text
HAL_Status HAL_USB_HsPhyInit(uint8_t id)
{
    ...
#elif defined(SOC_RK1820)
    /* OTG/Host PHY Tuning Code */
#elif defined(XXXX)
    ...
}
```

### 3.3 RK2116 USB2.0 PHY

Добавьте код настройки RK2116 USB2.0 в `HAL_USB_HsPhyInit()` файла `bsp/rockchip/common/hal/lib/hal/src/hal_usb_phy.c`.

```text
HAL_Status HAL_USB_HsPhyInit(uint8_t id)
{
    ...
#elif defined(RKMCU_RK2116)
    /* OTG PHY Tuning Code */
#elif defined(XXXX)
    ...
}
```

### 3.4 RK2118 USB2.0 PHY

Добавьте код настройки RK2118 USB2.0 в `HAL_USB_HsPhyInit()` файла `bsp/rockchip/common/hal/lib/hal/src/hal_usb_phy.c`.

```text
HAL_Status HAL_USB_HsPhyInit(uint8_t id)
{
    ...
#elif defined(RKMCU_RK2118)
    /* OTG PHY Tuning Code */
#elif defined(XXXX)
    ...
}
```

### 3.5 RK3036/RK312X USB2.0 PHY

RK3036 пока поддерживает только ядро 3.10. Добавьте код в `usb20otg_hw_init()` файла `kernel/drivers/usb/dwc_otg_310/usbdev_rk3036.c`.

```text
static void usb20otg_hw_init(void) {
    .../* OTG/Host PHY Tuning Code */
}
```

Добавьте код настройки RK312X в `rk312x_usb2phy_tuning()` файла `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`.

```text
static int rk312x_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* OTG/Host PHY Tuning Code */
}
```

### 3.6 RK3228 USB2.0 PHY

Добавьте код настройки RK3228 в `rk3228_usb2phy_tuning()` файла `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`.

```text
static int rk3228_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* OTG/Host PHY Tuning Code */
}
```

### 3.7 RK3288 USB2.0 PHY

RK3288 имеет две версии PHY-драйвера. Выбирайте Kernel Version 4.4 для ядра 4.4 и старше, 4.19 для 4.19 и новее. Меняется лишь формат кода, не команды io. Для 4.19 добавляйте в конец `rk3288_usb_phy_probe_init()` файла `kernel/drivers/phy/rockchip/phy-rockchip-usb.c`. Для трёх портов перед фрагментами требуется проверка смещения регистра. Код OTG:

```text
if (rk_phy->reg_offset == 0x320) {
    ... /* OTG PHY Tuning Code */
}
```

Код HOST1:

```text
if (rk_phy->reg_offset == 0x334) {
    ... /* HOST1 PHY Tuning Code */
}
```

Код HOST2:

```text
if (rk_phy->reg_offset == 0x348) {
    ... /* HOST2 PHY Tuning Code */
}
```

Драйвер RK3288 ядра 4.4: `kernel/drivers/usb/dwc_otg_310/usbdev_rk32.c`. Код OTG добавьте в конец `usb20otg_hw_init()`, HOST1 — `rk_ehci_hw_init()`, HOST2 — `usb20host_hw_init()`.

### 3.8 RK3308B_S/RK3308 USB2.0 PHY

Для RK3308B_S добавьте код в конец ветви `soc_is_rk3308bs()` функции `rk3308_usb2phy_tuning()` файла `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`.

```text
if (soc_is_rk3308bs()) {
    ... /* OTG/HOST PHY Tuning Code */
}
```

Для RK3308 добавьте код в конец ветви else функции `rk3308_usb2phy_tuning()` файла `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`.

```text
if (soc_is_rk3308bs()) {
    ...
} else {
    .../* OTG/HOST PHY Tuning Code */
}
```

### 3.9 RK3326S/PX30S/RK3326/PX30/RK3328 USB2.0 PHY

Для RK3326S/PX30S добавьте код в конец ветви `soc_is_px30s()` функции `rk3328_usb2phy_tuning()` файла `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`.

```text
if (soc_is_px30s()) {
    .../* OTG/HOST PHY Tuning Code */
}
```

Для RK3326/PX30/RK3328 добавьте код в конец ветви else функции `rk3328_usb2phy_tuning()` файла `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`.

```text
if (soc_is_px30s()) {
    ...
} else {
    .../* OTG/HOST PHY Tuning Code */
}
```

### 3.10 RK3399 USB2.0 PHY

Добавьте настройку RK3399 USB2.0 перед `if (!of_property_read_bool(node, "rockchip,u2phy-tuning"))` в `rk3399_usb2phy_tuning()` файла `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`. TYPE-C0/HOST0 используют PHY 0xe450, TYPE-C1/HOST1 — 0xe460. Перед кодом нужна проверка адреса для различения четырёх портов.

```text
if (rphy->phy_cfg->reg == 0xe450) {
    .../* TYPE-C0/HOST0 PHY Tuning Code */
} else {
    ... /* TYPE-C1/HOST1 PHY Tuning Code */
}
if (!of_property_read_bool(node, "rockchip,u2phy-tuning"))
    return ret;
```

### 3.11 RK3506 USB2.0 PHY

Добавьте код настройки RK3506 USB2.0 в `rk3506_usb2phy_tuning()` файла `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`.

```text
static int rk3506_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* USB2.0 PHY Tuning Code */
}
```

### 3.12 RK3528 USB2.0 PHY

Добавьте код настройки RK3528 USB2.0 в `rk3528_usb2phy_tuning()` файла `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`.

```text
static int rk3528_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* USB2.0 PHY Tuning Code */
}
```

### 3.13 RK3562 USB2.0 PHY

Добавьте код настройки RK3562 USB2.0 в `rk3562_usb2phy_tuning()` файла `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`.

```text
static int rk3562_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* USB2.0 PHY Tuning Code */
]
```

### 3.14 RK3568/RK3566 USB2.0 PHY

RK3568/RK3566 используют общий код в конце `rk3568_usb2phy_tuning()` файла `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`. OTG/HOST1 RK3568 имеют базу 0xfe8a0000, HOST2/HOST3 — 0xfe8b0000. Перед кодом проверяйте базовый адрес. OTG/HOST1:

```text
if (rphy->phy_cfg->reg == 0xfe8a0000) {
    ... /* OTG/Host1 PHY Tuning Code */
}
```

Код HOST2/HOST3:

```text
if (rphy->phy_cfg->reg == 0xfe8b0000) {
    ... /* Host2/Host3 PHY Tuning Code */
}
```

### 3.15 RK3576 USB2.0 PHY

Добавьте настройку RK3576 USB2.0 в `rk3576_usb2phy_tuning()` файла `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`. Два порта OTG0/OTG1 различаются по `rphy->phy_cfg->reg`, как ниже:

```text
static int rk3576_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
        unsigned int reg;
        int ret = 0;

        if (rphy->phy_cfg->reg == 0x0) {
            .../* OTG0 PHY Tuning Code */
        } else if (rphy->phy_cfg->reg == 0x2000) {
            .../* OTG1 PHY Tuning Code */
        }
        return ret;
}
```

### 3.16 RK3588 USB2.0 PHY

Добавьте настройку RK3588 USB2.0 в `rk3588_usb2phy_tuning()` файла `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`. TYPE-C0, TYPE-C1, HOST0, HOST1 различаются по `rphy->phy_cfg->reg`:

```text
if (rphy->phy_cfg->reg == 0x0000) {
    .../* TYPE-C0 PHY Tuning Code */
} else if (rphy->phy_cfg->reg == 0x4000) {
    .../* TYPE-C1 PHY Tuning Code */
} else if (rphy->phy_cfg->reg == 0x8000) {
    .../* HOST0 PHY Tuning Code */
} else if (rphy->phy_cfg->reg == 0xc000) {
    .../* HOST1 PHY Tuning Code */
}
```

### 3.17 RV1103/RV1106 USB2.0 PHY

Добавьте код настройки RV1103/RV1106 в `rv1106_usb2phy_tuning()` файла `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`.

```text
static int rv1106_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* OTG PHY Tuning Code */
}
```

### 3.18 RV1103B USB2.0 PHY

Добавьте код настройки RV1103B в `rv1103b_usb2phy_tuning()` файла `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`.

```text
static int rv1103b_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* OTG PHY Tuning Code */
}
```

### 3.19 RV1109/RV1126 USB2.0 PHY

Добавьте код настройки RV1109/RV1126 в `rv1126_usb2phy_tuning()` файла `kernel/drivers/phy/rockchip/phy-rockchip-naneng-usb2.c`.

```text
static int rv1126_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    if (rphy->phy_cfg->reg == 0xff4c0000) {
        .../* OTG PHY Tuning Code */
    }
    if (rphy->phy_cfg->reg == 0xff4c8000) {
        .../* HOST PHY Tuning Code */
    }
}
```

### 3.20 RV1126B/RV1126B-P USB2.0 PHY

Добавьте код настройки RV1126B/RV1126B-P в `rv1126b_usb2phy_tuning()` файла `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`.

```text
static int rv1126b_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* OTG/HOST PHY Tuning Code */
}
```

### 3.21 RK1808 USB3.1 PHY

Добавьте код настройки RK1808 USB3.1 в `rk1808_combphy_cfg` файла `kernel/drivers/phy/rockchip/phy-rockchip-inno-combphy.c`.

```text
static int rk1808_combphy_cfg(struct rockchip_combphy_priv *priv)
{
    ...
    if (priv->phy_type == PHY_TYPE_PCIE) {
        ...
    } else if (priv->phy_type == PHY_TYPE_USB3) {
        ...
        /*
         * Tuning Tx:
         * offset 0x21b8 bit[7:4]: lane 0 TX driver swing
         * tuning bits with weight, "1111" represents the
         * largest swing and "0000" the smallest.
         */
        reg = readl(priv->mmio + 0x21b8);
        reg = (reg & ~0xf0) | 0xe0;
        writel(reg, priv->mmio + 0x21b8);

        .../* USB3.1 PHY Tuning Code */

        ...
    } else {
        dev_err(priv->dev, "failed to cfg incompatible PHY type\n");
        return -EINVAL;
    }
    return 0;
}
```

### 3.22 RK1820 USB3.1 PHY

Добавьте код настройки RK1820 USB3.1 в `HAL_USB_SsPhyInit()` файла `bsp/rockchip/common/hal/lib/hal/src/hal_usb_phy.c`.

```text
HAL_Status HAL_USB_SsPhyInit(uint8_t id)
{
    ...
    switch (id) {
    case 0:
#ifdef COMB_PIPE_PHY0_BASE
    /* OTG PHY Tuning Code */
#endif
        break;
    case 1:
#ifdef COMB_PIPE_PHY1_BASE
    /* OTG PHY Tuning Code */
#endif
        break;
    default:
        break;
    }
    ...
}
```

### 3.23 RK3399 USB3.1 PHY

Добавьте код настройки RK3399 USB3.1 в `tcphy_tx_usb3_cfg_lane()` файла `kernel/drivers/phy/phy-rockchip-typec.c`.

```text
static void tcphy_tx_usb3_cfg_lane(struct rockchip_typec_phy *tcphy, u32 lane)
{
    .../* OTG0/OTG1 PHY Tuning Code */
}
```

### 3.24 RK3528/RK3562/RK3566/RK3568 USB3.1 PHY

Код USB3.1 RK3528, RK3562, RK3568 добавляется в соответствующую combphy_cfg файла `kernel/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c`. Место в `rk3528_combphy_cfg` для RK3528:

```text
case PHY_TYPE_USB3:
    ...
    /* Enable adaptive CTLE for USB3.0 Rx */
    val = readl(priv->mmio + 0x200);
    val &= ~GENMASK(17, 17);
    val |= 0x01;
    writel(val, priv->mmio + 0x200);
    ...
    .../* USB3.1 PHY Tuning Code */
    ...
    param_write(priv->phy_grf, &cfg->pipe_txcomp_sel, false);
    param_write(priv->phy_grf, &cfg->pipe_txelec_sel, false);
    param_write(priv->phy_grf, &cfg->usb_mode_set, true);
    break;
```

Место RK3562 в `rk3562_combphy_cfg`:

```text
case PHY_TYPE_USB3:
    /* Set SSC downward spread spectrum */
    val = readl(priv->mmio + (0x1f << 2));
    val &= ~GENMASK(5, 4);
    val |= 0x01 << 4;
    writel(val, priv->mmio + 0x7c);
    ...
    .../* USB3.1 PHY Tuning Code */
    ...
    param_write(priv->phy_grf, &cfg->pipe_sel_usb, true);
    param_write(priv->phy_grf, &cfg->pipe_txcomp_sel, false);
    param_write(priv->phy_grf, &cfg->pipe_txelec_sel, false);
    param_write(priv->phy_grf, &cfg->usb_mode_set, true);
    break;
```

RK3566 и RK3568 используют общий код; добавьте его здесь в `rk3568_combphy_cfg`:

```text
case PHY_TYPE_USB3:
    ...
    /* Set PLL KVCO to min and set PLL charge pump current to max */
    writel(0xf0, priv->mmio + (0xa << 2));
    ...
    .../* USB3.1 PHY Tuning Code */
    ...
    param_write(priv->phy_grf, &cfg->pipe_sel_usb, true);
    param_write(priv->phy_grf, &cfg->pipe_txcomp_sel, false);
    param_write(priv->phy_grf, &cfg->pipe_txelec_sel, false);
    param_write(priv->phy_grf, &cfg->usb_mode_set, true);
```

### 3.25 RK3576 USB3.1 PHY

Добавьте RK3576 USB3-OTG0 в конец `udphy_init()` файла `kernel/drivers/phy/rockchip/phy-rockchip-usbdp.c`.

```text
ret = udphy_status_check(udphy);
if (ret)
    goto assert_phy;
    .../* USB3-OTG0 PHY Tuning Code */
return 0;
```

Добавьте RK3576 USB3-OTG1 в конец `rk3576_combphy_cfg()` файла `kernel/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c`.

```text
case PHY_TYPE_USB3:
    /* Set Rx squelch input filler bandwidth */
    writel(0x0d, priv->mmio + (0x14 << 2));
    ...
    .../* USB3-OTG1 PHY Tuning Code */
    ...
    param_write(priv->phy_grf, &cfg->pipe_txcomp_sel, false);
    param_write(priv->phy_grf, &cfg->pipe_txelec_sel, false);
    param_write(priv->phy_grf, &cfg->usb_mode_set, true);
    break;
```

### 3.26 RK3588 USB3.1 PHY

Для RK3588 USB3-OTG и USB3-HOST места различаются. У USB3-OTG пока нет отдельного интерфейса настройки как у USB2.0; добавьте код в конец `rk3588_udphy_init()` файла `kernel/drivers/phy/rockchip/phy-rockchip-usbdp.c`.

```text
ret = rk3588_udphy_status_check(udphy);
if (ret)
    goto assert_phy;
    .../* USB3-OTG PHY Tuning Code */
return 0;
```

RK3588 USB3-HOST добавляется в `rk3588_combphy_cfg()` файла `kernel/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c`.

```text
case PHY_TYPE_USB3:
    /* Set SSC downward spread spectrum */
    val = readl(priv->mmio + (0x1f << 2));
    val &= ~GENMASK(5, 4);
    val |= 0x01 << 4;
    ...
    .../* USB3-HOST PHY Tuning Code */
    ...
    param_write(priv->phy_grf, &cfg->pipe_txcomp_sel, false);
    param_write(priv->phy_grf, &cfg->pipe_txelec_sel, false);
    param_write(priv->phy_grf, &cfg->usb_mode_set, true);
    break;
```

### 3.27 RV1126B USB3.1 PHY

Добавьте код настройки RV1126B USB3.1 в `rv1126b_combphy_cfg()` файла `kernel/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c`.

```text
case PHY_TYPE_USB3:
    /* Set Rx squelch input filler bandwidth */
    writel(0x0e, priv->mmio + (0x14 << 2));
    ...
    .../* USB3.1 PHY Tuning Code */
    ...
    rockchip_combphy_param_write(priv->phy_grf, &cfg->pipe_sel_usb, true);
    rockchip_combphy_param_write(priv->phy_grf, &cfg->pipe_txcomp_sel, false);
    rockchip_combphy_param_write(priv->phy_grf, &cfg->pipe_txelec_sel, false);
    rockchip_combphy_param_write(priv->phy_grf, &cfg->usb_mode_set, true);
    break;
```

{% endraw %}
