---
title: "Руководство пользователя Rockchip RK3588 EVB7"
description: "Руководство пользователя Rockchip RK3588 EVB7 — V1.0"
excerpt: "Руководство пользователя Rockchip RK3588 EVB7"
translation_key: "222-rockchip-rk3588-evb7-user-guide"
slug: "222-rockchip-rk3588-evb7-user-guide"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "hardware"
products: []
tags: [ArmSoM, Rockchip, RK3588, EVB7]
---

{% raw %}

# Руководство пользователя Rockchip RK3588 EVB7

Полный технический текст основан на китайском V1.0 (2023-06-20, 44 страницы) и английском V1.0 (2023-06-29, 43 страницы). Сохранены версия изделия, глоссарий и все четыре главы; юридические страницы, сведения об аудитории, история изменений и оглавление исключены. Описывается конкретная плата Rockchip EVB7, а не характеристики продукции ArmSoM или текущие обязательства поддержки. Прошивка, подключение и аппаратные испытания не выполнялись. Обновление может перезаписать данные: предварительно сделайте резервную копию и проверьте версии платы и прошивки. Горячее подключение дисплея и платы расширения запрещено; соблюдайте меры защиты от статического электричества и требования питания последней главы.

Различия и замечания: китайский обзор функций и 3.8 указывают один SATA, английский обзор и обе таблицы функций — два. Исходные значения сохранены для проверки по реальной плате. Разрешение экрана по-китайски — 1920×1080, по-английски — 1080×1920. В китайском есть дополнительный подзаголовок 4.1. Английские подписи рисунков 3-10/3-11/3-14 UART/VGA/RS484 исправлены на SATA/DP/RS485 по китайскому тексту и фотографиям; корпус Aggreko трактуется как акриловый по китайскому. Добавлены отсутствующие в английском обзоре два четырёхполосных DPHY / два CPHY по 3 Trio и модели разъёмов из 2.4. В заголовке таблицы 3-1 китайский вариант CDPHY, английский DPHY; значения сигналов совпадают и сохранены. TBD — неопределённое значение источника, не редакционная заглушка. Иллюстрации сохраняют исходные английские/китайские подписи и не выдаются за локализованные.

<!-- source:en p3 unit:0 -->

В руководстве описаны основные функции и аппаратные характеристики RK3588 EVB7, конфигурация многофункциональных узлов и способы программной отладки. Оно помогает быстрее и точнее использовать RK3588 EVB7 и освоить разработку приложений на RK3588.

<!-- source:en p3 unit:1 -->

Версия изделия. Документ относится к следующим версиям:

<!-- source:en p3 unit:2 -->

| Изделие | Версия изделия |
| --- | --- |
| <code>RK3588 EVB7</code> | <code>RK_EVB7_RK3588_LP4XD200P232SD8_V11_20230428</code> |

<!-- source:en p5 unit:3 -->

Сокращения, используемые в документе:

<!-- source:en p5 unit:4 -->

| Сокращение | Расшифровка английского термина | Значение китайского термина |
| --- | --- | --- |
| <code>CPU</code> | Центральный процессор | Центральный процессор |
| <code>NPU</code> | Нейросетевой процессор | Нейросетевой процессор |
| <code>VPU</code> | Видеопроцессор | Видеопроцессор |
| <code>DDR</code> | Удвоенная скорость передачи данных | Синхронная динамическая память с удвоенной скоростью передачи |
| <code>eMMC</code> | Встраиваемая мультимедийная карта памяти | Встраиваемая мультимедийная карта памяти |
| <code>eDP</code> | Встраиваемый DisplayPort | Встраиваемый цифровой аудиовидеоинтерфейс |
| <code>HDMI</code> | Мультимедийный интерфейс высокой чёткости | Мультимедийный интерфейс высокой чёткости |
| <code>I2C</code> | Межмикросхемная шина | Межмикросхемная двухпроводная последовательная шина |
| <code>I2S</code> | Межмикросхемная аудиошина | Межмикросхемная аудиошина |
| <code>PMIC</code> | Микросхема управления питанием | Микросхема управления питанием |
| <code>LDO</code> | Линейный стабилизатор с малым падением напряжения | Линейный стабилизатор с малым падением напряжения |
| <code>DCDC</code> | Преобразование постоянного напряжения в постоянное | Преобразование постоянного напряжения в постоянное |
| <code>CAN</code> | Локальная сеть контроллеров | Локальная сеть контроллеров |
| <code>SARADC</code> | Аналого-цифровой преобразователь последовательного приближения | Аналого-цифровой преобразователь последовательного приближения |
| <code>UART</code> | Универсальный асинхронный приёмопередатчик | Универсальный асинхронный приёмопередатчик |
| <code>JTAG</code> | Объединённая группа по методам тестирования | Объединённая группа по методам тестирования |
| <code>PWM</code> | Широтно-импульсная модуляция | Широтно-импульсная модуляция |
| <code>MIPI</code> | Интерфейс процессоров мобильной индустрии | Интерфейс процессоров мобильной индустрии |
| <code>LVDS</code> | Низковольтная дифференциальная передача сигналов | Низковольтная дифференциальная передача сигналов |
| <code>PMIC</code> | Микросхема управления питанием | Микросхема управления питанием |
| <code>PMU</code> | Блок управления питанием | Блок управления питанием |
| <code>RK/Rockchip</code> | Rockchip Electronics Co., Ltd. | Rockchip Electronics Co., Ltd. |
| <code>USB</code> | Универсальная последовательная шина | Универсальная последовательная шина |
| <code>SATA</code> | Последовательный интерфейс подключения накопителей | Последовательный интерфейс подключения накопителей |
| <code>PCIe</code> | Высокоскоростное соединение периферийных компонентов | Высокоскоростное соединение периферийных компонентов |
| <code>RGB</code> | Красный, зелёный, синий; RGB — промышленный стандарт цветового представления | Красный, зелёный, синий; RGB — промышленный стандарт цветового представления |
| <code>VGA</code> | Видеоадаптер графического массива | Стандартный интерфейс видеовывода компьютера |
| <code>ADB</code> | Мост отладки Android | Мост отладки Android |
| <code>IR</code> | Инфракрасное излучение | Инфракрасное излучение |
| <code>SPDIF</code> | Цифровой интерфейс Sony/Philips | Цифровой аудиоинтерфейс Sony/Philips |
| <code>RTC</code> | Часы реального времени | Часы реального времени |
| <code>RGMII</code> | Сокращённый гигабитный интерфейс, независимый от среды передачи | Сокращённый гигабитный интерфейс, независимый от среды передачи |
| <code>WIFI</code> | Беспроводная связь высокой точности | Беспроводная связь высокой точности |
| <code>CIF</code> | Интерфейс камеры | Интерфейс камеры |

<!-- source:en p11 unit:6 -->

## 1 Обзор системы

<!-- source:en p11 unit:7 -->

### 1.1 Обзор RK3588

<!-- source:en p11 unit:8 -->

RK3588 — высокопроизводительный прикладной процессор с низким энергопотреблением. Он объединяет 4 ядра Cortex-A76, 4 ядра Cortex-A55 и независимый сопроцессор NEON и предназначен для ARM PC, периферийных вычислений, персональных мобильных интернет-устройств и других мультимедийных продуктов. Встроенные аппаратные ускорители обеспечивают производительность для сложных приложений. Поддерживаются декодирование H.265 и VP9 до 8K@60fps, H.264 до 8K@30fps и AV1 до 4K@60fps; кодирование H.264 и H.265 до 8K@30fps, высококачественное кодирование/декодирование JPEG, а также отдельные блоки предварительной и последующей обработки изображений. Встроенный 3D GPU совместим с OpenGL ES1.1/2.0/3.2, OpenCL 2.2 и Vulkan 1.2. Специализированный 2D-ускоритель с MMU повышает производительность отображения и плавность работы. Полностью аппаратный ISP нового поколения поддерживает до 48 миллионов пикселей и ускоряет HDR, 3A, LSC, 3DNR, 2DNR, повышение резкости, устранение дымки, коррекцию «рыбьего глаза» и гамма-коррекцию. NPU поддерживает смешанные операции INT4/INT8/INT16/FP16 с вычислительной мощностью до 6TOP. Благодаря совместимости возможна конвертация сетевых моделей TensorFlow/MXNet/PyTorch/Caffe. Высокопроизводительный 4-канальный интерфейс внешней памяти LPDDR4/LPDDR4X/LPDDR5 подходит системам с высокой потребностью в пропускной способности; полный набор периферийных интерфейсов обеспечивает гибкость применения.

<!-- source:en p12 unit:10 -->

### 1.2 Блок-схема RK3588

<!-- source:en p12 unit:11 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p012-figure-01.png)

<!-- source:en p12 unit:12 -->

Рисунок 1-1. Блок-схема RK3588

<!-- source:en p12 unit:13 -->

### 1.3 Структура системы

<!-- source:en p12 unit:14 -->

#### 1.3.1 Блок-схема системы

<!-- source:en p12 unit:15 -->

Система RK3588 EVB7 использует RK3588 и один PMIC RK806-1. Память сочетает LPDDR4X и eMMC. Поддерживаются 2xHDMI TX, 1xDP OUT, 1xHDMI RX, 2xMIPI TX, SATA, PCIe30x4, TYPEC, 2xRJ45 и другие интерфейсы. Решение рассчитано на стабильную работу и серийное производство. Подробная структурная схема приведена ниже:

<!-- source:en p13 unit:17 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p013-system-block.png)

<!-- source:en p13 unit:18 -->

Рисунок 1-2. Блок-схема системы RK3588 EVB7

<!-- source:en p13 unit:19 -->

#### 1.3.2 Перечень функций

<!-- source:en p13 unit:20 -->

RK3588 EVB7 предоставляет следующие функции:

<!-- source:en p13 unit:21 -->

- DC Power: вход питания от адаптера 12 В постоянного тока

<!-- source:en p13 unit:22 -->

- TYPEC: один полноценный интерфейс TYPEC, также используемый для обновления прошивки и вывода DP1.4

<!-- source:en p13 unit:23 -->

- USB2.0 HOST1: один USB2.0 standard-A для мыши, USB-накопителя, USB HUB и других устройств

<!-- source:en p13 unit:24 -->

- USB2.0 OTG: один USB2.0 standard-A с поддержкой OTG для ПК, мыши, USB-накопителя, USB HUB и других устройств

<!-- source:en p13 unit:25 -->

- USB3.0 HOST: один USB3.0 standard-A для мыши, USB-накопителя, USB HUB и других устройств

- MIPI DCPHY RX (дополнение из китайского): два четырёхполосных входа MIPI DPHY или два входа MIPI CPHY по три Trio через 80-контактный разъём.

<!-- source:en p13 unit:26 -->

- MIPI DPHY RX: два четырёхполосных или четыре двухполосных входа MIPI через 80-контактный разъём. Плата расширения RK_EVB_RK3588_EXTBOARD1_IMX415_V11_20211027 обеспечивает фото- и видеосъёмку

<!-- source:en p13 unit:27 -->

- HDMI2.1 OUT: два выхода HDMI2.1 OUT standard-A, каждый до 8K@60Hz

<!-- source:en p13 unit:28 -->

- DP OUT: один выход DP OUT standard-A, до 4K@60Hz

<!-- source:en p13 unit:29 -->

- HDMI2.0 IN: один вход HMI IN standard-A, видеовход до 4K@60Hz

<!-- source:en p14 unit:31 -->

- MIPI DPHY0/1 TX: два четырёхполосных выхода MIPI через FPC-шлейф

<!-- source:en p14 unit:32 -->

- Wi-Fi (2T2R MIMO): модуль AP6398 с внешней антенной SMA для беспроводного доступа в Интернет

<!-- source:en p14 unit:33 -->

- Ethernet: два порта RJ45 с Ethernet 10/100/1000M.

<!-- source:en p14 unit:34 -->

- Аудиоинтерфейс: выходы динамика и наушников, запись с одного микрофона.

<!-- source:en p14 unit:35 -->

- SATA3.0: два 7-контактных разъёма SATA.

<!-- source:en p14 unit:36 -->

- PCIe3.0: один стандартный разъём PCIex4 для подключения устройств PCIe

<!-- source:en p14 unit:37 -->

- TF Card: расширение через TF-карту, поддержка SD3.0 и MMC ver4.51

<!-- source:en p14 unit:38 -->

- UART Debug: отладка и просмотр LOG через TYPEC или MINI USB.

<!-- source:en p14 unit:39 -->

- JTAG: интерфейс отладки системы.

<!-- source:en p14 unit:40 -->

- Кнопки системы: Reset, MASKROM, PWRON, V+/Recover, V-, MENU, ESC.

<!-- source:en p14 unit:41 -->

- SPDIF: цифровой аудиоинтерфейс.

<!-- source:en p14 unit:42 -->

- RTC: HYM8563TS с питанием от платы либо батарейки CR1220-3V.

<!-- source:en p14 unit:43 -->

#### 1.3.3 Функциональные интерфейсы

<!-- source:en p14 unit:44 -->

Таблица 1-1. Функциональные интерфейсы PCB

<!-- source:en p14 unit:45 -->

| Функция | Доступность |
| --- | --- |
| LPDDR4x (общая ёмкость 8 ГБ) | <code>Да</code> |
| eMMC (общая ёмкость 32 ГБ) | <code>Да</code> |
| Вход 12 В постоянного тока | <code>Да</code> |
| TYPEC | <code>Да</code> |
| USB3.0 OTG (1 порт) | <code>Да</code> |
| USB2.0 Host (1 порт) | <code>Да</code> |
| USB2.0 OTG (1 порт) | <code>Да</code> |
| MIPI D/CPHY RX | <code>Да</code> |
| MIPI DPHY RX | <code>Да</code> |
| HDMI2.0 RX | <code>Да</code> |
| HDMI2.1 OUT (2 порта) | <code>Да</code> |
| MIPI DPHY DSI TX1 (2x4 полосы) | <code>Да</code> |
| DP OUT | <code>Да</code> |
| BT и Wi-Fi (2x2 Wi-Fi и BT5.0) | <code>Да</code> |
| Гигабитный Ethernet 10M/100M/1000M (2 порта) | <code>Да</code> |
| Аудио (динамик, микрофон, наушники) | <code>Да</code> |
| SATA3.0 (2 порта) | <code>Да</code> |
| PCIe3.0 (4 полосы) | <code>Да</code> |
| Отладка UART (TPYEC/MINI USB) | <code>Да</code> |
| Интерфейс JTAG | <code>Да</code> |
| Системные кнопки | <code>Да</code> |
| Кнопка Maskrom | <code>Да</code> |

<!-- source:en p15 unit:48 -->

#### 1.3.4 Расположение функциональных модулей

<!-- source:en p15 unit:49 -->

Расположение интерфейсов EVB7:

<!-- source:en p15 unit:50 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p015-figure-01.png)

<!-- source:en p15 unit:51 -->

Рисунок 1-3. Расположение интерфейсов EVB7, лицевая сторона

<!-- source:en p16 unit:53 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p016-figure-01.png)

<!-- source:en p16 unit:54 -->

Рисунок 1-4. Расположение интерфейсов EVB7, обратная сторона

<!-- source:en p16 unit:55 -->

### 1.4 Комплект поставки

<!-- source:en p16 unit:56 -->

Комплект RK3588 EVB7 включает:

<!-- source:en p16 unit:57 -->

- RK3588 EVB7.

<!-- source:en p16 unit:58 -->

- Адаптер питания: вход 100V AC~240V AC, 50Hz; выход 12V DC, 3A.

<!-- source:en p16 unit:59 -->

- Дисплей MIPI, 5.5 дюйма, вертикальная ориентация, разрешение 1080*1920.

<!-- source:en p16 unit:60 -->

- Одна двухдиапазонная антенна 2.4G/5G с разъёмом SMA male.

<!-- source:en p16 unit:61 -->

- Монокулярный модуль камеры IMX415 (EVB_RK3588_EXTBOARD1_IMX415_V11_20211027)

<!-- source:en p16 unit:62 -->

### 1.5 Включение, выключение и ожидание

<!-- source:en p16 unit:63 -->

Порядок включения, выключения и перехода EVB7 в ожидание:

<!-- source:en p16 unit:64 -->

- Включение: подключите DC 12V и включите главный выключатель питания. Появление интерфейса Android означает успешный запуск штатной прошивки.

<!-- source:en p16 unit:65 -->

- Выключение: удерживайте кнопку питания 6 секунд.

<!-- source:en p16 unit:66 -->

- Ожидание: нажмите кнопку питания для перехода на первый уровень ожидания. Если USB OTG не подключён, нет других действий (например, нажатий кнопок) и программного источника Wake_Lock, примерно через 3s система переходит на второй уровень ожидания. Кнопка Power используется для выхода из ожидания.

<!-- source:en p17 unit:68 -->

### 1.6 Обновление прошивки

<!-- source:en p17 unit:69 -->

#### 1.6.1 Установка USB-драйвера

<!-- source:en p17 unit:70 -->

Перед обновлением необходимо установить драйвер. Ниже описана установка в Windows. В папке инструментов найдите DriverAssitant_v5.1.1 и запустите DriverInstall.exe. Нажмите «Install Driver» и дождитесь сообщения об успешной установке. Если установлен старый драйвер, нажмите «Uninstall Driver» и установите драйвер заново.

<!-- source:en p17 unit:71 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p017-figure-01.png)

<!-- source:en p17 unit:72 -->

Рисунок 1-5. Успешная установка драйвера

<!-- source:en p17 unit:73 -->

#### 1.6.2 Способы обновления прошивки

<!-- source:en p17 unit:74 -->

Для RK3588 EVB7 предусмотрены два способа обновления:

<!-- source:en p17 unit:75 -->

- Режим Loader: перед подачей питания удерживайте SARADC_IN1 на низком уровне, чтобы система вошла в Loader. Действия:

<!-- source:en p17 unit:76 -->

1) Подключите TYPEC к ПК и удерживайте кнопку V+/REC на основной плате.

<!-- source:en p17 unit:77 -->

2) Подайте на EVB питание 12 В. Если питание уже включено, нажмите кнопку сброса.

<!-- source:en p17 unit:78 -->

3) После сообщения инструмента о найденном устройстве Loader отпустите V+/REC. В красной прямоугольной области нажмите правой кнопкой и выберите «Import Configuration», найдите каталог прошивки и выберите файл config.

<!-- source:en p17 unit:79 -->

4) Выберите соответствующие файлы Loader, Parameter, Uboot и остальные компоненты.

<!-- source:en p17 unit:80 -->

5) Нажмите Execute для запуска обновления. Справа отображаются ход загрузки и состояние проверки.

<!-- source:en p18 unit:82 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p018-figure-01.png)

<!-- source:en p18 unit:83 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p018-figure-02.png)

<!-- source:en p18 unit:84 -->

Рисунок 1-6. Вход в режим прошивки Loader

<!-- source:en p18 unit:85 -->

- Режим обновления MASKROM: до включения питания SARADC_IN0 должен иметь низкий уровень. Последовательность действий:

<!-- source:en p18 unit:86 -->

1) Подключите TYPEC к ПК и удерживайте кнопку MASKROM на плате.

<!-- source:en p18 unit:87 -->

2) Подайте на EVB питание 12 В. Если питание уже включено, нажмите кнопку сброса.

<!-- source:en p18 unit:88 -->

3) После сообщения о найденном устройстве MASKROM отпустите MASKROM. В красной прямоугольной области нажмите правой кнопкой, выберите «Import Configuration», найдите каталог прошивки и файл config.cfg.

<!-- source:en p18 unit:89 -->

4) Выберите соответствующие файлы Loader, Parameter, Uboot и остальные компоненты.

<!-- source:en p18 unit:90 -->

5) Нажмите Execute для запуска обновления. Справа отображаются ход загрузки и состояние проверки.

<!-- source:en p19 unit:92 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p019-figure-01.png)

<!-- source:en p19 unit:93 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p019-figure-02.png)

<!-- source:en p19 unit:94 -->

Рисунок 1-7. Вход в режим прошивки MASKROM

<!-- source:en p19 unit:95 -->

### 1.7 Последовательная отладка

<!-- source:en p19 unit:96 -->

#### 1.7.1 Терминальная программа

<!-- source:en p19 unit:97 -->

Подключите отладочный разъём MINI USB Debug платы к ПК. В диспетчере устройств ПК определите текущий номер COM-порта.

<!-- source:en p20 unit:99 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p020-figure-01.png)

<!-- source:en p20 unit:100 -->

Рисунок 1-8. Определение номера COM-порта

<!-- source:en p20 unit:101 -->

Откройте терминальную программу. В «Quick Connect» выберите последовательный порт и нужный номер порта, задайте скорость 1.5M (RK3588 по умолчанию поддерживает 1.5M), отключите управление потоком в Serial и нажмите «Open» для входа в интерфейс последовательной отладки.

<!-- source:en p21 unit:103 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p021-figure-01.png)

<!-- source:en p21 unit:104 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p021-figure-02.png)

<!-- source:en p21 unit:105 -->

Рисунок 1-9. Настройка терминальной программы

<!-- source:en p22 unit:107 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p022-figure-01.png)

<!-- source:en p22 unit:108 -->

Рисунок 1-10. Интерфейс последовательной отладки

<!-- source:en p22 unit:109 -->

#### 1.7.2 Отладка ADB

<!-- source:en p22 unit:110 -->

1) Убедитесь, что драйвер установлен, и подключите ПК к TYPE_C на стороне платы с разъёмом питания.

<!-- source:en p22 unit:111 -->

2) Включите плату и загрузите систему.

<!-- source:en p22 unit:112 -->

3) Откройте инструмент adb на ПК.

<!-- source:en p22 unit:113 -->

4) Введите `adb shell` для входа в отладочную оболочку.

<!-- source:en p22 unit:114 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p022-figure-02.png)

<!-- source:en p22 unit:115 -->

Рисунок 1-11. Успешное подключение ADB

<!-- source:en p23 unit:116 -->

## 2 Аппаратная часть

<!-- source:en p23 unit:117 -->

### 2.1 Фотография платы

<!-- source:en p23 unit:118 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p023-figure-01.png)

<!-- source:en p23 unit:119 -->

Рисунок 2-1. Внешний вид RK3588 EVB7

<!-- source:en p24 unit:120 -->

### 2.2 Схема питания

<!-- source:en p24 unit:121 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p024-figure-01.png)

<!-- source:en p24 unit:122 -->

Рисунок 2-2. Блок-схема RK3588 EVB7

<!-- source:en p24 unit:123 -->

### 2.3 Адреса I2C

<!-- source:en p24 unit:124 -->

Плата предоставляет множество периферийных интерфейсов. При отладке устройств I2C учитывайте мультиплексирование каналов I2C. Таблица 2-1 содержит адреса и уровни сигналов устройств платы.<br><br>Таблица 2-1. Адреса периферийных устройств и уровни IO по каналам I2C

<!-- source:en p24 unit:125 -->

| Канал I2C | Устройство | Адрес I2C | Домен питания |
| --- | --- | --- | --- |
| <code>I2C0_M2</code> | <code>RK860-2/RK860-3</code> | <code>0x42/0x43</code> | <code>3.3V</code> |
| <code>I2C1_M2</code> | <code>RK860-2</code> | <code>0x42</code> | <code>3.3V</code> |
| <code>I2C2_M4</code> | <code>MIPI DCPHY0/DCPHY1</code> | <code>TBD</code> | <code>1.8V</code> |
| <code>I2C3_M0</code> | <code>MIPI CSI0/MIPI CSI1</code> | <code>TBD</code> | <code>1.8V</code> |
| <code>I2C4_M1</code> | <code>STK3311-A/ICM-42607</code> | <code>TBD</code> | <code>1.8V</code> |
| <code>I2C5_M0</code> | <code>Сенсорная панель</code> | <code>TBD</code> | <code>3.3V</code> |
| <code>I2C6_M0</code> | <code>HYM8563TS</code> | <code>0xA3</code> | <code>3.3V</code> |
| <code>I2C7_M0</code> | <code>ES8388</code> | <code>0x10</code> | <code>1.8V</code> |
| <code>HDMITX0_I2C</code> | <code>HDMI_TX0</code> | <code>TBD</code> | <code>3.3V</code> |
| <code>HDMITX1_I2C</code> | <code>HDMI_TX1</code> | <code>TBD</code> | <code>3.3V</code> |
| <code>HDMIRX_I2C</code> | <code>HDMI_RX</code> | <code>TBD</code> | <code>3.3V</code> |

<!-- source:en p24 unit:126 -->

Примечание: адреса I2C устройств платы расширения не должны конфликтовать с адресами устройств основной платы.

<!-- source:en p25 unit:127 -->

### 2.4 Разъёмы расширения

<!-- source:en p25 unit:128 -->

При необходимости можно изготовить собственную плату расширения. U4600 и U4700 — вертикальные двухрядные разъёмы на 80 контактов, ширина контакта 0.3mm, шаг 0.8mm. Размеры приведены ниже.

Модели разъёмов по китайскому источнику: на плате 61082-081402LF; ответный разъём расширения 61083-081402LF.

<!-- source:en p25 unit:129 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p025-figure-01.png)

<!-- source:en p25 unit:130 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p025-figure-02.png)

<!-- source:en p26 unit:131 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p026-figure-01.png)

<!-- source:en p26 unit:132 -->

Рисунок 2-3. Посадочное место вертикального двухрядного 80-контактного разъёма с шагом 0.8mm

<!-- source:en p26 unit:133 -->

### 2.5 Исходные схемы

<!-- source:en p26 unit:134 -->

Схема и проект PCB для EVB7:

<!-- source:en p26 unit:135 -->

- Принципиальная схема: RK_EVB7_RK3588_LP4XD200P232SD8_V11_20230428RZF.DSN

<!-- source:en p26 unit:136 -->

- Проект печатной платы: RK_EVB7_RK3588_LP4XD200P232SD8_V11_20230428YWQ_final.brd

<!-- source:en p27 unit:137 -->

## 3 Описание модулей

<!-- source:en p27 unit:138 -->

### 3.1 Вход питания

<!-- source:en p27 unit:139 -->

Адаптер подаёт 12 В/3 А. Входной понижающий преобразователь формирует питание VCC4V0_SYS, которое поступает на PMIC; тот формирует различные напряжения системы. Вход адаптера, понижающий преобразователь и PMIC показаны ниже:

<!-- source:en p27 unit:140 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p027-figure-01.png)

<!-- source:en p27 unit:141 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p027-figure-02.png)

<!-- source:en p27 unit:142 -->

Рисунок 3-1. Вход DC12V, входной Buck-преобразователь и PMIC

<!-- source:en p28 unit:143 -->

### 3.2 Память

<!-- source:en p28 unit:144 -->

- eMMC: на плате установлена eMMC FLASH, стандартная ёмкость 32GB.

<!-- source:en p28 unit:145 -->

- DDR: два чипа LPDDR4x по 4GB, суммарно 8GB.

<!-- source:en p28 unit:146 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p028-figure-01.png)

<!-- source:en p28 unit:147 -->

Рисунок 3-2. Расположение LPDDR4x

<!-- source:en p28 unit:148 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p028-figure-02.png)

<!-- source:en p28 unit:149 -->

Рисунок 3-3. Расположение eMMC. Расположение кнопки перехода EVB в режим прошивки MASKROM:

<!-- source:en p28 unit:150 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p028-figure-03.png)

<!-- source:en p28 unit:151 -->

Рисунок 3-4. Кнопка перехода в режим прошивки MASKROM

<!-- source:en p29 unit:152 -->

### 3.3 Цепь RTC

<!-- source:en p29 unit:153 -->

В цепи RTC используется HYM8563TS с питанием от платы или собственной кнопочной батареи. Батарея по умолчанию не входит в комплект; CR1220-3V приобретается отдельно. Часы продолжают работать при отключённом питании платы и обмениваются данными с процессором по I2C.

<!-- source:en p29 unit:154 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p029-figure-01.png)

<!-- source:en p29 unit:155 -->

Рисунок 3-5. Цепь RTC

<!-- source:en p29 unit:156 -->

### 3.4 Кнопочные входы

<!-- source:en p29 unit:157 -->

SARADC_IN1 используется для обнаружения RECOVER с 12-битным разрешением. Кнопка V+/REC позволяет войти в режим прошивки LOADER. Кнопка RESET обеспечивает аппаратный сброс и перезапуск. Также имеются V+, V-, ESC, MENU и PWRON. Расположение показано ниже.

<!-- source:en p29 unit:158 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p029-figure-02.png)

<!-- source:en p29 unit:159 -->

Рисунок 3-6. Расположение кнопок

<!-- source:en p30 unit:160 -->

### 3.5 Разъём питания SATA

<!-- source:en p30 unit:161 -->

Разъёмы питания устройств SATA на плате выдают 12V/5V соответственно.

<!-- source:en p30 unit:162 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p030-figure-01.png)

<!-- source:en p30 unit:163 -->

Рисунок 3-7. Выходы питания SATA 12V/5V

<!-- source:en p30 unit:164 -->

### 3.6 Разъём PCIe

<!-- source:en p30 unit:165 -->

Стандартный разъём PCIe3.0 позволяет подключить внешнюю карту PCIe для обмена данными.

<!-- source:en p30 unit:166 -->

- Режимы: End Point (EP) и Root Complex (RC).

<!-- source:en p30 unit:167 -->

- Соединение поддерживает 4 полосы передачи данных.

<!-- source:en p30 unit:168 -->

- Внешний тактовый чип AU5426 обеспечивает частоту 100 МГц.

<!-- source:en p30 unit:169 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p030-figure-02.png)

<!-- source:en p30 unit:170 -->

Рисунок 3-8. Разъём PCIex4

<!-- source:en p30 unit:171 -->

### 3.7 Порты Ethernet

<!-- source:en p30 unit:172 -->

Плата имеет два разъёма RJ45 для двух гигабитных Ethernet-соединений.

<!-- source:en p31 unit:173 -->

Для подключения внешних PHY используются соответственно встроенный Gigabit Ethernet MAC и PCIe2.0. Модели PHY — RTL8211F-CG/RTL8111HS. Характеристики:

<!-- source:en p31 unit:174 -->

- Совместимость с IEEE802.3, полный и полудуплекс, обнаружение перекрёстного соединения и автоматическая адаптация.

<!-- source:en p31 unit:175 -->

- Скорости 10/100/1000M.

<!-- source:en p31 unit:176 -->

- RJ45 объединён с развязывающим трансформатором и индикатором.

<!-- source:en p31 unit:177 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p031-figure-01.png)

<!-- source:en p31 unit:178 -->

Рисунок 3-9. Гигабитные сетевые интерфейсы

<!-- source:en p31 unit:179 -->

### 3.8 Интерфейсы SATA

<!-- source:en p31 unit:180 -->

Плата предоставляет один 7-контактный порт SATA.

<!-- source:en p31 unit:181 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p031-figure-02.png)

<!-- source:en p31 unit:182 -->

Рисунок 3-10. Интерфейс SATA

<!-- source:en p31 unit:183 -->

### 3.9 Выход DP

<!-- source:en p31 unit:184 -->

Плата поддерживает видеовыход DP с разрешением до 4K@60.

<!-- source:en p32 unit:185 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p032-figure-01.png)

<!-- source:en p32 unit:186 -->

Рисунок 3-11. Видеовыход DP

<!-- source:en p32 unit:187 -->

### 3.10 Интерфейс BT/WIFI

<!-- source:en p32 unit:188 -->

На плате установлен комбинированный модуль Wi-Fi/BT AMPAK AP6398S со следующими характеристиками:

<!-- source:en p32 unit:189 -->

- 2x2WIFI (2.4G и 5G, 802.11 a/b/g/n/ac), BT5.0, две внешние SMA-антенны.

<!-- source:en p32 unit:190 -->

- Данные BT передаются через UART.

<!-- source:en p32 unit:191 -->

- Голосовой канал BT подключён к интерфейсу I2S основного процессора.

<!-- source:en p32 unit:192 -->

- Данные Wi-Fi передаются по SDIO. RK3588 EVB7 комплектуется одной двухдиапазонной антенной 2,4/5 ГГц.

<!-- source:en p32 unit:193 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p032-figure-02.png)

<!-- source:en p32 unit:194 -->

Рисунок 3-12. Разъёмы антенн BT/WIFI

<!-- source:en p33 unit:195 -->

### 3.11 Интерфейсы Debug

<!-- source:en p33 unit:196 -->

На плате установлен преобразователь USB-UART с отладочным интерфейсом MINI USB.

<!-- source:en p33 unit:197 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p033-figure-01.png)

<!-- source:en p33 unit:198 -->

Рисунок 3-13. Интерфейсы Debug

<!-- source:en p33 unit:199 -->

### 3.12 RS485 и RS232

<!-- source:en p33 unit:200 -->

На EVB предусмотрено по одному интерфейсу RS485 и RS232.

<!-- source:en p33 unit:201 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p033-figure-02.png)

<!-- source:en p33 unit:202 -->

Рисунок 3-14. Разъём RS485

<!-- source:en p34 unit:203 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p034-figure-01.png)

<!-- source:en p34 unit:204 -->

Рисунок 3-15. Разъём RS232

<!-- source:en p34 unit:205 -->

### 3.13 Вход MIPI D/CPHY

<!-- source:en p34 unit:206 -->

Вход MIPI D/CPHY использует вертикальный 80-контактный разъём 61082-081402LF с шагом 0,8 мм (см. 2.4) и поддерживает два входа MIPI D/CPHY: два четырёхполосных модуля DPHY либо два модуля CPHY по 3 Trio. Максимальные скорости — 4,5 Гбит/с на полосу DPHY и 5,7 Гбит/с на Trio CPHY. Ответный разъём — 61083-081402LF; размеры корпуса приведены в 2.4. Платы расширения можно разработать по потребности.

<!-- source:en p34 unit:208 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p034-figure-02.png)

<!-- source:en p34 unit:209 -->

Рисунок 3-16. Вход MIPI D/CPHY RX

<!-- source:en p35 unit:210 -->

Назначение контактов MIPI D/CPHY_RX: таблица 3-1. Сигналы MIPID/CPHY_RX

<!-- source:en p35 unit:211 -->

| Контакт | DPHY (одиночный) | DPHY (двойной) | Контакт |
| --- | --- | --- | --- |
| <code>1</code> | <code>GND</code> | <code>GND</code> | <code>2</code> |
| <code>3</code> | <code>MIPI_DPHY1_RX_D0N/MIPI_CPHY1_RX_TRIO0_A</code> | <code>MIPI_DPHY0_RX_D0N/MIPI_CPHY0_RX_TRIO0_A</code> | <code>4</code> |
| <code>5</code> | <code>MIPI_DPHY1_RX_D0P/MIPI_CPHY1_RX_TRIO0_B</code> | <code>MIPI_DPHY0_RX_D0P/MIPI_CPHY0_RX_TRIO0_B</code> | <code>6</code> |
| <code>7</code> | <code>GND</code> | <code>GND</code> | <code>8</code> |
| <code>9</code> | <code>MIPI_DPHY1_RX_D1N/MIPI_CPHY1_RX_TRIO0_C</code> | <code>MIPI_DPHY0_RX_D1N/MIPI_CPHY0_RX_TRIO0_C</code> | <code>10</code> |
| <code>11</code> | <code>MIPI_DPHY1_RX_D1P/MIPI_CPHY1_RX_TRIO1_A</code> | <code>MIPI_DPHY0_RX_D1P/MIPI_CPHY0_RX_TRIO1_A</code> | <code>12</code> |
| <code>13</code> | <code>GND</code> | <code>GND</code> | <code>14</code> |
| <code>15</code> | <code>MIPI_DPHY1_RX_CLKN/MIPI_CPHY1_RX_TRIO1_B</code> | <code>MIPI_DPHY0_RX_CLKN/MIPI_CPHY0_RX_TRIO1_B</code> | <code>16</code> |
| <code>17</code> | <code>MIPI_DPHY1_RX_CLKP/MIPI_CPHY1_RX_TRIO1_C</code> | <code>MIPI_DPHY0_RX_CLKP/MIPI_CPHY0_RX_TRIO1_C</code> | <code>18</code> |
| <code>19</code> | <code>GND</code> | <code>GND</code> | <code>20</code> |
| <code>21</code> | <code>MIPI_DPHY1_RX_D2N/MIPI_CPHY1_RX_TRIO2_A</code> | <code>MIPI_DPHY0_RX_D2N/MIPI_CPHY0_RX_TRIO2_A</code> | <code>22</code> |
| <code>23</code> | <code>MIPI_DPHY1_RX_D2P/MIPI_CPHY1_RX_TRIO2_B</code> | <code>MIPI_DPHY0_RX_D2P/MIPI_CPHY0_RX_TRIO2_B</code> | <code>24</code> |
| <code>25</code> | <code>GND</code> | <code>GND</code> | <code>26</code> |
| <code>27</code> | <code>MIPI_DPHY1_RX_D3N/MIPI_CPHY1_RX_TRIO2_C</code> | <code>MIPI_DPHY0_RX_D3N/MIPI_CPHY0_RX_TRIO2_C</code> | <code>28</code> |
| <code>29</code> | <code>MIPI_DPHY1_RX_D3P/NO_USE</code> | <code>MIPI_DPHY0_RX_D3P/NO_USE</code> | <code>30</code> |
| <code>31</code> | <code>GND</code> | <code>GND</code> | <code>32</code> |
| <code>33</code> | <code>NC</code> | <code>NC</code> | <code>34</code> |
| <code>35</code> | <code>NC</code> | <code>NC</code> | <code>36</code> |
| <code>37</code> | <code>GND</code> | <code>GND</code> | <code>38</code> |
| <code>39</code> | <code>MIPI_CAM1_CLKOUT</code> | <code>MIPI_CAM2_CLKOUT</code> | <code>40</code> |
| <code>41</code> | <code>NC</code> | <code>NC</code> | <code>42</code> |
| <code>43</code> | <code>GND</code> | <code>GND</code> | <code>44</code> |
| <code>45</code> | <code>I2C2_SDA_M4_MIPI</code> | <code>I2C2_SDA_M4_MIPI</code> | <code>46</code> |
| <code>47</code> | <code>I2C2_SCL_M4_MIPI</code> | <code>I2C2_SCL_M4_MIPI</code> | <code>48</code> |
| <code>49</code> | <code>NC</code> | <code>NC</code> | <code>50</code> |
| <code>51</code> | <code>MIPI_CAM1_PDN_L</code> | <code>MIPI_CAM2_PDN_L</code> | <code>52</code> |
| <code>53</code> | <code>NC</code> | <code>NC</code> | <code>54</code> |
| <code>55</code> | <code>NC</code> | <code>NC</code> | <code>56</code> |
| <code>57</code> | <code>MIPI_DPHY_FSYNC</code> | <code>MIPI_DPHY_FSYNC</code> | <code>58</code> |
| <code>59</code> | <code>MIPI_DPHY_HSYNC/PWM15_M2</code> | <code>MIPI_DPHY_HSYNC</code> | <code>60</code> |
| <code>61</code> | <code>VCC_1V8_S3</code> | <code>VCC_3V3_S3</code> | <code>62</code> |
| <code>63</code> | <code>NC</code> | <code>NC</code> | <code>64</code> |
| <code>65</code> | <code>MIPI_CAM1_PWREN_H</code> | <code>MIPI_CAM2_PWREN_H</code> | <code>66</code> |
| <code>67</code> | <code>IRC_AIN</code> | <code>NC</code> | <code>68</code> |
| <code>69</code> | <code>IRC_BIN</code> | <code>NC</code> | <code>70</code> |
| <code>71</code> | <code>NC</code> | <code>NC</code> | <code>72</code> |
| <code>73</code> | <code>NC</code> | <code>NC</code> | <code>74</code> |
| <code>75</code> | <code>GND</code> | <code>GND</code> | <code>76</code> |
| <code>77</code> | <code>VCC_5V0</code> | <code>GND</code> | <code>78</code> |
| <code>79</code> | <code>VCC_5V0</code> | <code>VCC12V_DCIN</code> | <code>80</code> |

<!-- source:en p36 unit:212 -->

### 3.14 Вход MIPI DPHY

<!-- source:en p36 unit:213 -->

Вход MIPI DPHY использует вертикальный 80-контактный разъём 61082-081402LF с шагом 0,8 мм (см. 2.4). Поддерживаются два четырёхполосных модуля MIPI DPHY либо четыре двухполосных входа MIPI DPHY, до 2,5 Гбит/с на полосу. Вместе с MIPI D/CPHY можно подключить до шести модулей. Ответный разъём — 61083-081402LF; размеры корпуса приведены в 2.4.

<!-- source:en p36 unit:214 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p036-figure-01.png)

<!-- source:en p36 unit:215 -->

Рисунок 3-17. Видеовход MIPI DPHY. Таблица 3-2. Сигналы MIPI DPHY_RX

<!-- source:en p36 unit:216 -->

| Контакт | DPHY (одиночный) | DPHY (двойной) | Контакт |
| --- | --- | --- | --- |
| <code>1</code> | <code>GND</code> | <code>GND</code> | <code>2</code> |
| <code>3</code> | <code>MIPI_CSI0_RX_D0N</code> | <code>MIPI_CSI1_RX_D0N</code> | <code>4</code> |
| <code>5</code> | <code>MIPI_CSI0_RX_D0P</code> | <code>MIPI_CSI1_RX_D0P</code> | <code>6</code> |
| <code>7</code> | <code>GND</code> | <code>GND</code> | <code>8</code> |
| <code>9</code> | <code>MIPI_CSI0_RX_D1N</code> | <code>MIPI_CSI1_RX_D1N</code> | <code>10</code> |
| <code>11</code> | <code>MIPI_CSI0_RX_D1P</code> | <code>MIPI_CSI1_RX_D1P</code> | <code>12</code> |
| <code>13</code> | <code>GND</code> | <code>GND</code> | <code>14</code> |
| <code>15</code> | <code>MIPI_CSI0_RX_CLK0N</code> | <code>MIPI_CSI1_RX_CLK0N</code> | <code>16</code> |
| <code>17</code> | <code>MIPI_CSI0_RX_CLK0P</code> | <code>MIPI_CSI1_RX_CLK0P</code> | <code>18</code> |
| <code>19</code> | <code>GND</code> | <code>GND</code> | <code>20</code> |
| <code>21</code> | <code>MIPI_CSI0_RX_D2N</code> | <code>MIPI_CSI1_RX_D2N</code> | <code>22</code> |
| <code>23</code> | <code>MIPI_CSI0_RX_D2P</code> | <code>MIPI_CSI1_RX_D2P</code> | <code>24</code> |
| <code>25</code> | <code>GND</code> | <code>GND</code> | <code>26</code> |
| <code>27</code> | <code>MIPI_CSI0_RX_D3N</code> | <code>MIPI_CSI1_RX_D3N</code> | <code>28</code> |
| <code>29</code> | <code>MIPI_CSI0_RX_D3P</code> | <code>MIPI_CSI1_RX_D3P</code> | <code>30</code> |
| <code>31</code> | <code>GND</code> | <code>GND</code> | <code>32</code> |
| <code>33</code> | <code>MIPI_CSI0_RX_CLK1N</code> | <code>MIPI_CSI1_RX_CLK1N</code> | <code>34</code> |
| <code>35</code> | <code>MIPI_CSI0_RX_CLK1P</code> | <code>MIPI_CSI1_RX_CLK1P</code> | <code>36</code> |
| <code>37</code> | <code>GND</code> | <code>GND</code> | <code>38</code> |
| <code>39</code> | <code>MIPI_CAM3_CLKOUT</code> | <code>MIPI_CAM4_CLKOUT</code> | <code>40</code> |
| <code>41</code> | <code>NC</code> | <code>NC</code> | <code>42</code> |
| <code>43</code> | <code>GND</code> | <code>GND</code> | <code>44</code> |
| <code>45</code> | <code>I2C3_SDA_M0_MIPI</code> | <code>I2C3_SDA_M0_MIPI</code> | <code>46</code> |
| <code>47</code> | <code>I2C3_SCL_M0_MIPI</code> | <code>I2C3_SCL_M0_MIPI</code> | <code>48</code> |
| <code>49</code> | <code>NC</code> | <code>NC</code> | <code>50</code> |
| <code>51</code> | <code>MIPI_CAM3_PDN_L</code> | <code>MIPI_CAM5_PDN_L</code> | <code>52</code> |
| <code>53</code> | <code>NC</code> | <code>NC</code> | <code>54</code> |
| <code>55</code> | <code>MIPI_CAM4_PDN_L</code> | <code>MIPI_CAM6_PDN_L</code> | <code>56</code> |
| <code>57</code> | <code>MIPI_DPHY_FSYNC</code> | <code>MIPI_DPHY_FSYNC</code> | <code>58</code> |
| <code>59</code> | <code>MIPI_DPHY_HSYNC/PWM15_M2</code> | <code>MIPI_DPHY_HSYNC</code> | <code>60</code> |
| <code>61</code> | <code>VCC_1V8_S3</code> | <code>VCC_3V3_S3</code> | <code>62</code> |
| <code>63</code> | <code>NC</code> | <code>NC</code> | <code>64</code> |
| <code>65</code> | <code>MIPI_CAM3/4_PWREN_H</code> | <code>MIPI_CAM5/6_PWREN_H</code> | <code>66</code> |
| <code>67</code> | <code>IRC_AIN</code> | <code>NC</code> | <code>68</code> |
| <code>69</code> | <code>IRC_BIN</code> | <code>NC</code> | <code>70</code> |
| <code>71</code> | <code>NC</code> | <code>NC</code> | <code>72</code> |
| <code>73</code> | <code>NC</code> | <code>NC</code> | <code>74</code> |
| <code>75</code> | <code>GND</code> | <code>GND</code> | <code>76</code> |
| <code>77</code> | <code>VCC_5V0</code> | <code>GND</code> | <code>78</code> |
| <code>79</code> | <code>VCC_5V0</code> | <code>VCC12V_DCIN</code> | <code>80</code> |

<!-- source:en p37 unit:217 -->

### 3.15 Интерфейс TYPEC

<!-- source:en p37 unit:218 -->

Один полнофункциональный интерфейс TYPEC поддерживает:

<!-- source:en p37 unit:219 -->

- Загрузку прошивки через TYPEC0_USB20_OTG.

<!-- source:en p37 unit:220 -->

- Функциональность TYPEC.

<!-- source:en p37 unit:221 -->

- Выход DP1.4.

<!-- source:en p38 unit:222 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p038-figure-01.png)

<!-- source:en p38 unit:223 -->

Рисунок 3-18. Интерфейс TYPEC

<!-- source:en p38 unit:224 -->

### 3.16 Интерфейс USB3.0

<!-- source:en p38 unit:225 -->

Плата предоставляет один USB3.0 OTG с разъёмом Standard-A для USB3.0-накопителей и других USB3.0-устройств.

<!-- source:en p38 unit:226 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p038-figure-02.png)

<!-- source:en p38 unit:227 -->

Рисунок 3-19. Интерфейс USB3.0 OTG

<!-- source:en p38 unit:228 -->

### 3.17 Интерфейс USB2.0 OTG/Host

<!-- source:en p38 unit:229 -->

Плата поддерживает один USB2.0 HOST и один USB2.0 OTG для USB-устройств, например мыши, накопителя и Bluetooth.

<!-- source:en p39 unit:230 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p039-figure-01.png)

<!-- source:en p39 unit:231 -->

Рисунок 3-20. Интерфейс USB2.0

<!-- source:en p39 unit:232 -->

### 3.18 Выходы HDMI

<!-- source:en p39 unit:233 -->

Два выхода HDMI Standard-A поддерживают HDMI2.1 и видео до 8K@60fps.

<!-- source:en p39 unit:234 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p039-figure-02.png)

<!-- source:en p39 unit:235 -->

Рисунок 3-21. Интерфейсы HDMI TX

<!-- source:en p39 unit:236 -->

### 3.19 Вход HDMI

<!-- source:en p39 unit:237 -->

Плата имеет один видеовход HDMI2.0 с разрешением до 4K60fps.

<!-- source:en p40 unit:238 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p040-figure-01.png)

<!-- source:en p40 unit:239 -->

Рисунок 3-22. Интерфейс HDMI RX

<!-- source:en p40 unit:240 -->

### 3.20 Разъём питания вентилятора

<!-- source:en p40 unit:241 -->

На плате предусмотрен разъём вентилятора с поддержкой 12 В/5 В и регулировки скорости. В комплект входит вентилятор 12 В. Контакты слева направо: GND, 12V, SENSOR, CONTROL.

<!-- source:en p40 unit:242 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p040-figure-02.png)

<!-- source:en p40 unit:243 -->

Рисунок 3-23. Разъём питания вентилятора

<!-- source:en p40 unit:244 -->

### 3.21 Расширение модуля сенсора

<!-- source:en p40 unit:245 -->

Плата комплектуется модулем IMX415 с разрешением до 8 миллионов пикселей (в китайском оригинале 800万; в английском написано 800W).

<!-- source:en p40 unit:246 -->

- Автоматический баланс белого, 3D-шумоподавление и HDR.

<!-- source:en p40 unit:247 -->

- Выход данных RAW10/RAW12.

<!-- source:en p40 unit:248 -->

- Встроенная схема переключения IRCUT для дневного/ночного режима сенсора.

<!-- source:en p40 unit:249 -->

- Предусмотрен 24-контактный интерфейс MIPI, позволяющий при необходимости расширить систему для стереозрения.

<!-- source:en p41 unit:250 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p041-figure-01.png)

<!-- source:en p41 unit:251 -->

Рисунок 3-24. Плата модуля IMX415<br><br>Назначение сигналов разъёма расширения приведено ниже.<br><br>Таблица 3-3. Сигналы расширения модуля IMX415

<!-- source:en p41 unit:252 -->

| Контакт | DPHY |
| --- | --- |
| <code>1</code> | <code>GND</code> |
| <code>2</code> | <code>GND</code> |
| <code>3</code> | <code>NC</code> |
| <code>4</code> | <code>MIPI_DCPHY1_RX_RST_L</code> |
| <code>5</code> | <code>I2C5_SDA_M0_MIPI</code> |
| <code>6</code> | <code>I2C5_SCL_M0_MIPI</code> |
| <code>7</code> | <code>GND</code> |
| <code>8</code> | <code>GND</code> |
| <code>9</code> | <code>MIPI_DPHY1_RX_D0N</code> |
| <code>10</code> | <code>MIPI_DPHY1_RX_D0P</code> |
| <code>11</code> | <code>MIPI_DPHY1_RX_D1N</code> |
| <code>12</code> | <code>MIPI_DPHY1_RX_D1P</code> |
| <code>13</code> | <code>MIPI_DPHY1_RX_D2N</code> |
| <code>14</code> | <code>MIPI_DPHY1_RX_D2P</code> |
| <code>15</code> | <code>MIPI_DPHY1_RX_D3N</code> |
| <code>16</code> | <code>MIPI_DPHY1_RX_D3P</code> |
| <code>17</code> | <code>GND</code> |
| <code>18</code> | <code>MIPI_DPHY1_RX_CLKN</code> |
| <code>19</code> | <code>MIPI_DPHY1_RX_CLKP</code> |
| <code>20</code> | <code>GND</code> |
| <code>21</code> | <code>MIPI_CAM2_CLKOUT</code> |
| <code>22</code> | <code>VCC_3V3_O</code> |
| <code>23</code> | <code>VCC_3V3_D</code> |
| <code>24</code> | <code>VCC_3V3_A</code> |

<!-- source:en p42 unit:253 -->

### 3.22 Разъёмы динамиков

<!-- source:en p42 unit:254 -->

Плата имеет два разъёма динамиков; два обычных динамика предварительно установлены в акриловом корпусе.

<!-- source:en p42 unit:255 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p042-figure-01.png)

<!-- source:en p42 unit:256 -->

Рисунок 3-25. Разъём SPK

<!-- source:en p43 unit:257 -->

## 4 Меры предосторожности

<!-- source:en p43 unit:258 -->

RK3588 EVB7 предназначен для лабораторных и инженерных условий. Перед работой соблюдайте следующие требования:

<!-- source:en p43 unit:259 -->

- Ни при каких обстоятельствах не подключайте и не отключайте экран или плату расширения при включённом питании.

<!-- source:en p43 unit:260 -->

- Перед распаковкой и установкой примите необходимые антистатические меры, чтобы избежать повреждения оборудования электростатическим разрядом (ESD).

<!-- source:en p43 unit:261 -->

- Держите плату за края, не касаясь открытых металлических частей, чтобы избежать повреждения компонентов статическим электричеством.

<!-- source:en p43 unit:262 -->

- Размещайте плату на сухой поверхности вдали от источников тепла, электромагнитных помех и излучения, а также оборудования, чувствительного к электромагнитному излучению, например медицинского.

{% endraw %}
