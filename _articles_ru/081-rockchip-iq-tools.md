---
title: "Rockchip IQ Tools: полный захват, калибровка и интерактивная настройка ISP"
description: "Все технические главы V1.0.1: RKISP Tuner, Raw/YUV, BLC/LSC/AWB/CCM/NR/FEC, Gamma и автономная симуляция."
translation_key: "081-rockchip-iq-tools"
slug: "081-rockchip-iq-tools"
lang: "ru"
date: "2026-10-20"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "camera"
products: []
tags: ["ArmSoM", "Rockchip", "IQ Tools", "RKISP", "Camera"]
keywords: "ArmSoM Rockchip RK356x RK3588 RV1106 ISP IQ Tools"
excerpt: "Все технические главы V1.0.1: RKISP Tuner, Raw/YUV, BLC/LSC/AWB/CCM/NR/FEC, Gamma и автономная симуляция."
---

{% raw %}

# Rockchip IQ Tools: полный захват, калибровка и интерактивная настройка ISP

## Применимость к ArmSoM и источник

Справочный материал для адаптации ArmSoM по единственному предоставленному Rockchip_IQ_Tools_Guide_EN_v1.0.1.pdf (RK-SM-YF-609, 81 страница). Китайского PDF нет; китайская, русская и немецкая версии полностью переведены с английского. Во всех версиях английские оригинальные рисунки; URL немецких и английских изображений совпадают. Область 1.2: RK356x/RKISP21, RK3588/RKISP30, RV1106/RKISP32, Linux/Android; версия ядра не указана. Сверьте плату ArmSoM, SoC, SDK/BSP, ядро, драйверы сенсора/объектива, ToolServer, Tuner и шаблоны IQ. Адаптация платы и качество изображения аппаратно не проверены. Время, усиление, сравнения и параметры — примеры исходника, не измерения ArmSoM.

Примеры содержат перезагрузку, изменение прав и `setenforce 0` (ослабление SELinux). Они сохранены для полноты, не выполнялись при подготовке и не предназначены для слепого применения в рабочей системе.

[Редакционные примечания](/docs/rockchip-iq-tools/EDITORIAL-NOTES.md) · [ArmSoM Docs](https://docs.armsom.org/) · [Rockchip AIQ](https://github.com/rockchip-toybrick/camera_engine_rkaiq)

<!-- Source EN PDF p.1, unit 0 -->

Статья описывает RKISP2 Tuner и настройку ISP, помогая инженерам начать работу и предоставляя справочный материал для настройки IQ.

<!-- Source EN PDF p.4, unit 1 -->

## 1 Введение

<!-- Source EN PDF p.4, unit 2 -->

### 1.1 Обзор

<!-- Source EN PDF p.4, unit 3 -->

RKISP Tuner (далее Tuner) предоставляет набор инструментов настройки параметров ISP: Calibration, Tuning и другие операции со всеми модулями. Capture Tool захватывает Raw, Calibration Tool калибрует базовые модули, затем Tuner подключается к устройству для интерактивной настройки ISP.

<!-- Source EN PDF p.4, unit 4 -->

### 1.2 Поддерживаемые версии

<!-- Source EN PDF p.4, unit 5 -->

| SoC | Системы | Версия ISP |
| --- | --- | --- |
| RK356x | Linux/Android | RKISP21 |
| RK3588 | Linux/Android | RKISP30 |
| RV1106 | Linux/Android | RKISP32 |

<!-- Source EN PDF p.4, unit 6 -->

Версии ISP21, ISP30 и ISP32 значительно улучшили совместимость. Версии ToolServer и RKISP Tuner должны соответствовать друг другу. Если параметры интерфейса отличаются от файлов устройства, обратитесь к инженерам Rockchip для обновления шаблона параметров.

<!-- Source EN PDF p.4, unit 7 -->

### 1.3 Подготовка среды

<!-- Source EN PDF p.4, unit 8 -->

##### Требования к компьютеру

<!-- Source EN PDF p.4, unit 9 -->

1. Компьютеру Tuner требуется x64 Windows 7 либо более новая 64-битная Windows.

<!-- Source EN PDF p.4, unit 10 -->

2. До запуска установите 64-битный MCR_R2016a (9.0.1); исходник поддерживает только эту версию. Загрузка: https://ww2.mathworks.cn/products/compiler/matlab-runtime

<!-- Source EN PDF p.4, unit 11 -->

##### Требования на стороне устройства

<!-- Source EN PDF p.4, unit 12 -->

1. Нужен сетевой адаптер с проводным, беспроводным или иным подключением к локальной сети.

<!-- Source EN PDF p.4, unit 13 -->

2. Устройство без сетевого адаптера должно поддерживать RNDIS: оно определяется как USB-сетевой адаптер и соединяется с ПК через USB.

<!-- Source EN PDF p.5, unit 14 -->

### 1.4 Установка и настройка

<!-- Source EN PDF p.5, unit 15 -->

RKISP2.x Tuner не требует установки: распакуйте архив в любой каталог и запускайте. Избегайте путей с китайскими символами.

<!-- Source EN PDF p.5, unit 16 -->

Исходник ссылается на раздел 3 с требованием предварительной установки MCR_R2016a. Шаги ниже; фактически требования находятся в 1.3, несоответствие ссылки отмечено.

<!-- Source EN PDF p.5, unit 17 -->

1. Запустите MCR_R2016a_x64.exe и дождитесь распаковки.

<!-- Source EN PDF p.5, unit 18 -->

![Технический рисунок английского PDF, страница 5](/docs/rockchip-iq-tools/assets/en-p005-figure-01.png)

<!-- Source EN PDF p.5, unit 19 -->

Рисунок 1-4-1

<!-- Source EN PDF p.5, unit 20 -->

2. Нажмите Next, примите условия, затем Next и Install.

<!-- Source EN PDF p.5, unit 21 -->

![Технический рисунок английского PDF, страница 5](/docs/rockchip-iq-tools/assets/en-p005-figure-02.png)

<!-- Source EN PDF p.5, unit 22 -->

Рисунок 1-4-2

<!-- Source EN PDF p.6, unit 23 -->

3. Дождитесь завершения установки.

<!-- Source EN PDF p.6, unit 24 -->

![Технический рисунок английского PDF, страница 6](/docs/rockchip-iq-tools/assets/en-p006-figure-01.png)

<!-- Source EN PDF p.6, unit 25 -->

Рисунок 1-4-3

<!-- Source EN PDF p.6, unit 26 -->

4. Установка завершена.

<!-- Source EN PDF p.6, unit 27 -->

![Технический рисунок английского PDF, страница 6](/docs/rockchip-iq-tools/assets/en-p006-figure-02.png)

<!-- Source EN PDF p.6, unit 28 -->

Рисунок 1-4-4

<!-- Source EN PDF p.7, unit 29 -->

## 2 Описание функций

<!-- Source EN PDF p.7, unit 30 -->

### 2.1 Обзор

<!-- Source EN PDF p.7, unit 31 -->

Следуйте приведённому ниже процессу настройки:

<!-- Source EN PDF p.7, unit 32 -->

![Технический рисунок английского PDF, страница 7](/docs/rockchip-iq-tools/assets/en-p007-figure-01.png)

<!-- Source EN PDF p.7, unit 33 -->

Рисунок 2-1-1

<!-- Source EN PDF p.7, unit 34 -->

На подготовительном этапе создайте базовый IQ-файл (.json) со всеми регулируемыми параметрами ISP. После настройки замените соответствующий файл прошивки или устройства и перезапустите приложение камеры для проверки результата.

<!-- Source EN PDF p.7, unit 35 -->

Захват Raw, интерактивная настройка и обмен параметрами работают через сетевой протокол. ПК и устройство должны находиться в одной локальной сети.

<!-- Source EN PDF p.7, unit 36 -->

Процесс калибровки:

<!-- Source EN PDF p.7, unit 37 -->

![Технический рисунок английского PDF, страница 7](/docs/rockchip-iq-tools/assets/en-p007-figure-02.png)

<!-- Source EN PDF p.7, unit 38 -->

Рисунок 2-1-2

<!-- Source EN PDF p.7, unit 39 -->

Калибровка некоторых модулей зависит от результатов предыдущих. Соблюдайте порядок и проверяйте корректность результата после каждого модуля.

<!-- Source EN PDF p.8, unit 40 -->

### 2.2 Конфигурация сенсора

<!-- Source EN PDF p.8, unit 41 -->

![Технический рисунок английского PDF, страница 8](/docs/rockchip-iq-tools/assets/en-p008-figure-01.png)

<!-- Source EN PDF p.8, unit 42 -->

Рисунок 2-2-1

<!-- Source EN PDF p.8, unit 43 -->

Интерфейс сенсора на рисунке 2-2-1 состоит из двух частей:

<!-- Source EN PDF p.8, unit 44 -->

1. Область параметров: см. sensorinfo parameters, 4.1.2.5 Rockchip_Tuning_Guide_ISP21/30/32. Заполняйте по Datasheet сенсора; может потребоваться помощь разработчика драйвера.

<!-- Source EN PDF p.8, unit 45 -->

2. Меню: импорт из SensorList.ini и экспорт в него.

<!-- Source EN PDF p.9, unit 46 -->

### 2.3 RKISP Capture Tool

<!-- Source EN PDF p.9, unit 47 -->

![Технический рисунок английского PDF, страница 9](/docs/rockchip-iq-tools/assets/en-p009-figure-01.png)

<!-- Source EN PDF p.9, unit 48 -->

Рисунок 2-3-1

<!-- Source EN PDF p.9, unit 49 -->

Основной интерфейс RKISP Capture Tool на рисунке 2-3-1 содержит три части:

<!-- Source EN PDF p.9, unit 50 -->

1. Соединение с устройством: сетевые параметры, переключение режима и проверка связи.

<!-- Source EN PDF p.9, unit 51 -->

2. Настройки захвата делятся на Raw Capture и Online Capture. Raw Capture — автономный захват Raw с конфигурацией камеры и экспозиции. Задаются параметры сенсора, имена Module/Light, разрешение и диапазоны Gain/Exposure. Поддерживаются ручная и автоматическая экспозиция и захват для калибровки NR. В ручном режиме шаг задаёт перебор комбинаций экспозиции; автоматический ищет параметры до целевой яркости. YNR Capture получает Raw для калибровки YNR, см. 4.6.1. Online Capture захватывает raw и yuv из работающего потока.

<!-- Source EN PDF p.9, unit 52 -->

3. Предпросмотр и статистика Raw: серое изображение, гистограмма и яркость ROI.

<!-- Source EN PDF p.10, unit 53 -->

### 2.4 RKISP Calibration Tool

<!-- Source EN PDF p.10, unit 54 -->

Для выбранных SoC и версии (рисунок 2-4-1) загружается соответствующий RKISP Calibration Tool (2-4-2). Импортируемый IQ-файл также должен соответствовать SoC и версии.

<!-- Source EN PDF p.10, unit 55 -->

![Технический рисунок английского PDF, страница 10](/docs/rockchip-iq-tools/assets/en-p010-figure-01.png)

<!-- Source EN PDF p.10, unit 56 -->

Рисунок 2-4-1

<!-- Source EN PDF p.10, unit 57 -->

![Технический рисунок английского PDF, страница 10](/docs/rockchip-iq-tools/assets/en-p010-figure-02.png)

<!-- Source EN PDF p.10, unit 58 -->

Рисунок 2-4-2

<!-- Source EN PDF p.10, unit 59 -->

Интерфейс RKISP Calibration Tool (2-4-2) включает BLC — коррекцию чёрного, LSC — коррекцию затенения объектива, CCM — матрицу цветокоррекции, AWB — автоматический баланс белого.

<!-- Source EN PDF p.11, unit 60 -->

GIC — баланс зелёных каналов (калибровка входит в Bayer NR); Bayer NR — шумоподавление Raw с Bayer 2DNR/Bayer 3DNR; YNR — шумоподавление Y; FEC — калибровка fisheye.

<!-- Source EN PDF p.11, unit 61 -->

### 2.5 RKRAW Tool

<!-- Source EN PDF p.11, unit 62 -->

![Технический рисунок английского PDF, страница 11](/docs/rockchip-iq-tools/assets/en-p011-figure-01.png)

<!-- Source EN PDF p.11, unit 63 -->

Рисунок 2-5-1

<!-- Source EN PDF p.11, unit 64 -->

RKRAW Tool (2-5-1) просматривает jpg/bmp/png, raw, RKRawV1 и RKRawV2. Исходник говорит о четырёх частях, но перечисляет пять; сохранены все:

<!-- Source EN PDF p.11, unit 65 -->

1. Файловая система: выбор пути изображения.

<!-- Source EN PDF p.11, unit 66 -->

2. Окно просмотра: правой кнопкой переключаются GRAY/RGB и Normal/Hdr Short/Mid/Long (последние только RKRawV2), см. 2-5-2. Ctrl и колесо изменяют масштаб.

<!-- Source EN PDF p.11, unit 67 -->

3. Гистограмма: статистика серого канала.

<!-- Source EN PDF p.11, unit 68 -->

4. Информация RKRawV2: формат raw, экспозиция и другие параметры.

<!-- Source EN PDF p.11, unit 69 -->

5. Compare: удерживая Ctrl, выберите более двух изображений и нажмите compare, см. 2-5-3.

<!-- Source EN PDF p.12, unit 70 -->

![Технический рисунок английского PDF, страница 12](/docs/rockchip-iq-tools/assets/en-p012-figure-01.png)

<!-- Source EN PDF p.12, unit 71 -->

Рисунок 2-5-2

<!-- Source EN PDF p.12, unit 72 -->

![Технический рисунок английского PDF, страница 12](/docs/rockchip-iq-tools/assets/en-p012-figure-02.png)

<!-- Source EN PDF p.12, unit 73 -->

Рисунок 2-5-3

<!-- Source EN PDF p.13, unit 74 -->

### 2.6 RKISP 3D-LUT Tools

<!-- Source EN PDF p.13, unit 75 -->

![Технический рисунок английского PDF, страница 13](/docs/rockchip-iq-tools/assets/en-p013-figure-01.png)

<!-- Source EN PDF p.13, unit 76 -->

Рисунок 2-6-1

<!-- Source EN PDF p.13, unit 77 -->

RKISP 3D-LutTool (2-6-1): слева область LUT, справа предпросмотр.

<!-- Source EN PDF p.13, unit 78 -->

1. File: импорт изображений, импорт/сохранение IQ и LUT Info. Load Image поддерживает jpg/bmp/png/nv12 и показывает изображение справа в Preview (2-6-2). Load IQ File импортирует IQ с выбором сцены и таблицы Lut3D (2-6-3).

<!-- Source EN PDF p.13, unit 79 -->

![Технический рисунок английского PDF, страница 13](/docs/rockchip-iq-tools/assets/en-p013-figure-02.png)

<!-- Source EN PDF p.13, unit 80 -->

Рисунок 2-6-2

<!-- Source EN PDF p.14, unit 81 -->

![Технический рисунок английского PDF, страница 14](/docs/rockchip-iq-tools/assets/en-p014-figure-01.png)

<!-- Source EN PDF p.14, unit 82 -->

![Технический рисунок английского PDF, страница 14](/docs/rockchip-iq-tools/assets/en-p014-figure-02.png)

<!-- Source EN PDF p.14, unit 83 -->

Рисунок 2-6-3

<!-- Source EN PDF p.14, unit 84 -->

Save IQ File: перезапись существующей таблицы IQ либо создание новой (2-6-4).

<!-- Source EN PDF p.14, unit 85 -->

![Технический рисунок английского PDF, страница 14](/docs/rockchip-iq-tools/assets/en-p014-figure-03.png)

<!-- Source EN PDF p.14, unit 86 -->

Рисунок 2-6-4

<!-- Source EN PDF p.14, unit 87 -->

2. Поиск цвета: при движении мыши соответствующий цвет отмечается в LUT слева (2-6-5). Левая кнопка фиксирует его. Меняйте цвет через Adjust Sat, Adjust Hue либо перетаскиванием точки. Отображаются AB, Sat, Hue, RGB до/после и изменения LUT/Preview.

<!-- Source EN PDF p.15, unit 88 -->

![Технический рисунок английского PDF, страница 15](/docs/rockchip-iq-tools/assets/en-p015-figure-01.png)

<!-- Source EN PDF p.15, unit 89 -->

Рисунок 2-6-5

<!-- Source EN PDF p.15, unit 90 -->

3. Adjust Sat: ползунок меняет отмеченный цвет и соседние (2-6-6(a)). Для изменения только отмеченного цвета зафиксируйте остальные правой кнопкой: круг превращается в квадрат. После этого Adjust Sat меняет лишь отмеченный цвет (2-6-6(b)).

<!-- Source EN PDF p.15, unit 91 -->

![Технический рисунок английского PDF, страница 15](/docs/rockchip-iq-tools/assets/en-p015-figure-02.png)

<!-- Source EN PDF p.15, unit 92 -->

(a)

<!-- Source EN PDF p.16, unit 93 -->

![Технический рисунок английского PDF, страница 16](/docs/rockchip-iq-tools/assets/en-p016-figure-01.png)

<!-- Source EN PDF p.16, unit 94 -->

(b)

<!-- Source EN PDF p.16, unit 95 -->

Рисунок 2-6-6

<!-- Source EN PDF p.16, unit 96 -->

4. After & Before: просмотр до и после настройки.

<!-- Source EN PDF p.16, unit 97 -->

5. Reset LUT: восстановление LUT по умолчанию.

<!-- Source EN PDF p.16, unit 98 -->

6. Image: вращение влево/вправо, вертикальное/горизонтальное отражение и сохранение результата (2-6-7).

<!-- Source EN PDF p.16, unit 99 -->

![Технический рисунок английского PDF, страница 16](/docs/rockchip-iq-tools/assets/en-p016-figure-02.png)

<!-- Source EN PDF p.16, unit 100 -->

Рисунок 2-6-7

<!-- Source EN PDF p.16, unit 101 -->

7. Options: настройки отображения LUT, размера точек и толщины линий (2-6-8).

<!-- Source EN PDF p.16, unit 102 -->

![Технический рисунок английского PDF, страница 16](/docs/rockchip-iq-tools/assets/en-p016-figure-03.png)

<!-- Source EN PDF p.16, unit 103 -->

Рисунок 2-6-8

<!-- Source EN PDF p.17, unit 104 -->

### 2.7 RKISP 3A Analyzer Tool

<!-- Source EN PDF p.17, unit 105 -->

![Технический рисунок английского PDF, страница 17](/docs/rockchip-iq-tools/assets/en-p017-figure-01.png)

<!-- Source EN PDF p.17, unit 106 -->

Рисунок 2-7-1

<!-- Source EN PDF p.17, unit 107 -->

Нажмите Connect для соединения с rkaiq_tool_server и откройте RKISP 3AAnalyzerTool (2-7-1). Измените URL, включите Open для предпросмотра. Версия поддерживает статистику AE и AWB.

<!-- Source EN PDF p.17, unit 108 -->

TimerSet: интервал получения данных.

<!-- Source EN PDF p.17, unit 109 -->

Reverse color: изменение цвета данных в предпросмотре.

<!-- Source EN PDF p.17, unit 110 -->

Кнопка AE открывает модуль и динамическую гистограмму в AE Statistics. Предпросмотр делится на 15 * 15 ячеек с 12bit-статистикой соответствующих блоков. Channel переключает канал; HDR поддерживает кадры L/M/S (2-7-2).

<!-- Source EN PDF p.18, unit 111 -->

![Технический рисунок английского PDF, страница 18](/docs/rockchip-iq-tools/assets/en-p018-figure-01.png)

<!-- Source EN PDF p.18, unit 112 -->

Рисунок 2-7-2

<!-- Source EN PDF p.18, unit 113 -->

Кнопка AWB выводит текущий статус в AWB Statistics. Предпросмотр делится на 15 * 15 ячеек с числом белых точек и WBGains соответствующего блока (2-7-3).

<!-- Source EN PDF p.18, unit 114 -->

![Технический рисунок английского PDF, страница 18](/docs/rockchip-iq-tools/assets/en-p018-figure-02.png)

<!-- Source EN PDF p.18, unit 115 -->

Рисунок 2-7-3

<!-- Source EN PDF p.19, unit 116 -->

## 3 Быстрый старт

<!-- Source EN PDF p.19, unit 117 -->

### 3.1 Подготовка

<!-- Source EN PDF p.19, unit 118 -->

Значительная часть настройки ISP выполняется на устройстве. Сервис передаёт данные между Tuner и AIQ, захватывает Raw и выполняет другие задачи. До настройки передайте сервис и связанные файлы на устройство и запустите их. Ниже подготовка Android и Linux:

<!-- Source EN PDF p.19, unit 119 -->

1. Подключение к LAN.

<!-- Source EN PDF p.19, unit 120 -->

2. Запуск rkaiq_tool_server и настройка среды. Команды и файлы передаются через TFTP, последовательный порт, ADB и другие средства; пример использует ADB.

<!-- Source EN PDF p.19, unit 121 -->

#### 3.1.1 Android

<!-- Source EN PDF p.19, unit 122 -->

##### 3.1.1.1 RK356X & RK3588

<!-- Source EN PDF p.19, unit 123 -->

Для устройств с проводной сетью:

<!-- Source EN PDF p.19, unit 124 -->

1. Соедините устройство и маршрутизатор сетевым кабелем.

<!-- Source EN PDF p.19, unit 125 -->

2. Проверьте IP устройства командой ifconfig.

<!-- Source EN PDF p.19, unit 126 -->

3. Подключите ПК к тому же маршрутизатору по кабелю или Wi-Fi.

<!-- Source EN PDF p.19, unit 127 -->

4. Проверьте IP ПК и выполните ping на ПК или устройстве для проверки связи.

<!-- Source EN PDF p.19, unit 128 -->

Для устройств без проводной сети (планшетов и т. п.):

<!-- Source EN PDF p.19, unit 129 -->

1. Соедините ПК и EVB кабелем USB через тот же порт, что ADB.

<!-- Source EN PDF p.19, unit 130 -->

2. Включите питание и загрузите систему.

<!-- Source EN PDF p.19, unit 131 -->

3. Откройте Settings.

<!-- Source EN PDF p.19, unit 132 -->

4. Перейдите в Network&internet.

<!-- Source EN PDF p.19, unit 133 -->

5. Перейдите в Hotspot&tethering.

<!-- Source EN PDF p.19, unit 134 -->

6. Включите USB tethering.

<!-- Source EN PDF p.19, unit 135 -->

7. Войдите на устройство через adb shell.

<!-- Source EN PDF p.19, unit 136 -->

8. Выполните ifconfig usb0 для просмотра IP.

<!-- Source EN PDF p.19, unit 137 -->

9. Проверьте сеть командой ping на ПК или устройстве.

<!-- Source EN PDF p.20, unit 138 -->

Порядок запуска rkaiq_tool_server. Если сервис и зависимости уже находятся в нужных каталогах устройства, просто запустите rkaiq_tool_server.

<!-- Source EN PDF p.20, unit 139 -->

1. Соберите rkaiq_tool_server и rkaiq_3A_server в SDK.

<!-- Source EN PDF p.20, unit 140 -->

2. Путь SDK: external/rkaiq_tool_server. Нужна прошивка user-debug.

<!-- Source EN PDF p.20, unit 141 -->

3. Передайте android.hardware.camera.provider@2.4-service.rc в /vendor/etc/init/ платы.

<!-- Source EN PDF p.20, unit 142 -->

4. В /vendor/etc/init/ выполните chmod 644 android.hardware.camera.provider@2.4-service.rc.

<!-- Source EN PDF p.20, unit 143 -->

5. Передайте rkaiq_tool_server и rkaiq_3A_server в /vendor/bin/.

<!-- Source EN PDF p.20, unit 144 -->

6. В /vendor/bin/ выполните chmod 755 rkaiq_tool_server, аналогично для rkaiq_3A_server.

<!-- Source EN PDF p.20, unit 145 -->

7. Сбросьте кэш командой sync.

<!-- Source EN PDF p.20, unit 146 -->

8. Перезагрузите устройство.

<!-- Source EN PDF p.20, unit 147 -->

9. Выполните setenforce 0.

<!-- Source EN PDF p.20, unit 148 -->

10. Запустите apk камеры.

<!-- Source EN PDF p.20, unit 149 -->

11. Запустите rkaiq_tool_server.

<!-- Source EN PDF p.20, unit 150 -->

Пример работы через ADB:

<!-- Source EN PDF p.20, unit 151 -->

```sh
#The following commands are run in cmd on the PC side
adb root
adb remount
adb push android.hardware.camera.provider@2.4-service.rc /vendor/etc/init/
adb push rkaiq_tool_server /vendor/bin/
adb shell

# The following commands are executed in adb shell terminal
chmod 644 /vendor/etc/init/android.hardware.camera.provider@2.4-service.rc
chmod 755 /vendor/bin/rkaiq_tool_server
sync
reboot

# After restart, enter adb shell again
# disable SELinux
setenforce 0
# Manually run the camera apk first
# Then run tool server
/vendor/bin/rkaiq_tool_server &
```

<!-- Source EN PDF p.20, unit 152 -->

Пример нескольких камер:

<!-- Source EN PDF p.20, unit 153 -->

```sh
#If there are 2 sensors in the device and you need to switch to another sensor for tuning, run tool server as follows:
/vendor/bin/rkaiq_tool_server -d 1 &
```

<!-- Source EN PDF p.21, unit 154 -->

После передачи на устройство исходных IQ-параметров, созданных New, сбросьте приложение камеры и снова запустите ToolServer следующим образом. При сбое, зависании, отказе настройки или предпросмотра также попробуйте это переподключение.

<!-- Source EN PDF p.21, unit 155 -->

```sh
source /vendor/etc/camera/reset_camera.sh
# run camera apk
/vendor/bin/rkaiq_tool_server &
```

<!-- Source EN PDF p.21, unit 156 -->

#### 3.1.2 Linux

<!-- Source EN PDF p.21, unit 157 -->

##### 3.1.2.1 RK356X & RK3588 & RV1106

<!-- Source EN PDF p.21, unit 158 -->

Для устройств с проводной сетью:

<!-- Source EN PDF p.21, unit 159 -->

1. Соедините устройство и маршрутизатор сетевым кабелем.

<!-- Source EN PDF p.21, unit 160 -->

2. Проверьте IP устройства командой ifconfig.

<!-- Source EN PDF p.21, unit 161 -->

3. Подключите ПК к тому же маршрутизатору по кабелю или Wi-Fi.

<!-- Source EN PDF p.21, unit 162 -->

4. Проверьте IP ПК и выполните ping на ПК или устройстве для проверки связи.

<!-- Source EN PDF p.21, unit 163 -->

Для устройств без проводной сети:

<!-- Source EN PDF p.21, unit 164 -->

1. Попробуйте запустить RNDIS.

<!-- Source EN PDF p.21, unit 165 -->

2. Проверьте IP устройства командой ifconfig.

<!-- Source EN PDF p.21, unit 166 -->

3. Проверьте сеть командой ping на ПК или устройстве.

<!-- Source EN PDF p.21, unit 167 -->

Порядок запуска rkaiq_tool_server. Если сервис и зависимости уже находятся в нужных каталогах устройства, просто запустите rkaiq_tool_server.

<!-- Source EN PDF p.21, unit 168 -->

1. Соберите rkaiq_tool_server и librkmedia.so в SDK.

<!-- Source EN PDF p.21, unit 169 -->

2. Передайте librkmedia.so в /data/ платы.

<!-- Source EN PDF p.21, unit 170 -->

3. В /data/ выполните chmod 777 librkmedia.so.

<!-- Source EN PDF p.21, unit 171 -->

4. Передайте rkaiq_tool_server в /data/ платы.

<!-- Source EN PDF p.21, unit 172 -->

5. В /data/ выполните chmod 777 rkaiq_tool_server.

<!-- Source EN PDF p.21, unit 173 -->

6. Сбросьте кэш командой sync.

<!-- Source EN PDF p.21, unit 174 -->

7. Перезагрузите устройство.

<!-- Source EN PDF p.21, unit 175 -->

8. Запустите приложение камеры.

<!-- Source EN PDF p.21, unit 176 -->

9. Запустите rkaiq_tool_server.

<!-- Source EN PDF p.22, unit 177 -->

Пример работы через ADB:

<!-- Source EN PDF p.22, unit 178 -->

```sh
#The following commands are run in cmd on the PC side
adb root
adb remount
adb push librkmedia.so /data/
adb push rkaiq_tool_server /data/
adb shell

# The following commands are executed in adb shell
chmod 777 /data/rkaiq_tool_server
sync
reboot

# After restart, enter adb shell again
# Run the camera app first
/data/rkaiq_tool_server &
```

<!-- Source EN PDF p.22, unit 179 -->

### 3.2 Параметры ToolServer

<!-- Source EN PDF p.22, unit 180 -->

Параметры и конфигурация rkaiq_tool_server:

<!-- Source EN PDF p.22, unit 181 -->

`-d`: выбор сенсора по номеру 0/1/2, по умолчанию 0. Команда `media-ctl -p -d /dev/mediaX` (X=0/1/2/3...) показывает топологию с именами сенсоров. В `m01_b_ov8858 2-0036` m01 соответствует mNN, где NN — двузначный индекс. Поэтому используется `-d 1`, без ведущего нуля.

<!-- Source EN PDF p.22, unit 182 -->

`-s`: video-узел захвата YUV; по умолчанию ищется iqtool, вручную можно задать mainPath или selfPath.

<!-- Source EN PDF p.22, unit 183 -->

`-r`: RTSP, 0 — выключен, 1 — включён, по умолчанию 0. После включения доступен Start RTSP в CaptureTool.

<!-- Source EN PDF p.22, unit 184 -->

`-i`: путь IQ-файла; меняйте вместе с расположением файла, при `-r` 0 игнорируется.

<!-- Source EN PDF p.22, unit 185 -->

`-w/-h`: разрешение предпросмотра RTSP с масштабированием выхода ISP, по умолчанию 1920/1080.

<!-- Source EN PDF p.22, unit 186 -->

`-n`: число буферов непрерывного онлайн-захвата Raw, по умолчанию 4. При большом числе последовательных Raw увеличьте его.

<!-- Source EN PDF p.22, unit 187 -->

`-f`: частота отправки кадров автономной функции; исходное значение по умолчанию — 10 frames.

<!-- Source EN PDF p.23, unit 188 -->

### 3.3 Платформа и IP-адрес

<!-- Source EN PDF p.23, unit 189 -->

1. Откройте RKISP Tuner; начальная конфигурация показана на 3-3-1.

<!-- Source EN PDF p.23, unit 190 -->

![Технический рисунок английского PDF, страница 23](/docs/rockchip-iq-tools/assets/en-p023-figure-01.png)

<!-- Source EN PDF p.23, unit 191 -->

Рисунок 3-3-1

<!-- Source EN PDF p.23, unit 192 -->

2. Выберите SoC и введите найденный IP. Порт по умолчанию 5543; без особой необходимости не меняйте. Проверьте работу rkaiq_tool_server и нажмите Connect to rkaiq_tool_server. Для предпросмотра сторонними средствами исходник отсылает к пункту 3 раздела 3.7.

<!-- Source EN PDF p.23, unit 193 -->

3. Нажмите OK; интерфейс выбранных SoC и версии показан на 3-3-2.

<!-- Source EN PDF p.23, unit 194 -->

![Технический рисунок английского PDF, страница 23](/docs/rockchip-iq-tools/assets/en-p023-figure-02.png)

<!-- Source EN PDF p.23, unit 195 -->

Рисунок 3-3-2

<!-- Source EN PDF p.24, unit 196 -->

### 3.4 Создание конфигурации сенсора и IQ-файла

<!-- Source EN PDF p.24, unit 197 -->

1. Выберите File → New.

<!-- Source EN PDF p.24, unit 198 -->

![Технический рисунок английского PDF, страница 24](/docs/rockchip-iq-tools/assets/en-p024-figure-01.png)

<!-- Source EN PDF p.24, unit 199 -->

Рисунок 3-4-1

<!-- Source EN PDF p.24, unit 200 -->

![Технический рисунок английского PDF, страница 24](/docs/rockchip-iq-tools/assets/en-p024-figure-02.png)

<!-- Source EN PDF p.24, unit 201 -->

Рисунок 3-4-2

<!-- Source EN PDF p.24, unit 202 -->

2. Нажмите New справа от списка Sensor для открытия Sensor Information.

<!-- Source EN PDF p.24, unit 203 -->

![Технический рисунок английского PDF, страница 24](/docs/rockchip-iq-tools/assets/en-p024-figure-03.png)

<!-- Source EN PDF p.24, unit 204 -->

Рисунок 3-4-3

<!-- Source EN PDF p.25, unit 205 -->

3. Заполните Sensor Information и выберите File → Export To Sensor List.

<!-- Source EN PDF p.25, unit 206 -->

![Технический рисунок английского PDF, страница 25](/docs/rockchip-iq-tools/assets/en-p025-figure-01.png)

<!-- Source EN PDF p.25, unit 207 -->

Рисунок 3-4-4

<!-- Source EN PDF p.25, unit 208 -->

4. Введите имя сенсора и нажмите OK для сохранения.

<!-- Source EN PDF p.25, unit 209 -->

![Технический рисунок английского PDF, страница 25](/docs/rockchip-iq-tools/assets/en-p025-figure-02.png)

<!-- Source EN PDF p.25, unit 210 -->

Рисунок 3-4-5

<!-- Source EN PDF p.25, unit 211 -->

5. Закройте конфигурацию: новый сенсор появится в списке окна Generated New IQ File.

<!-- Source EN PDF p.25, unit 212 -->

![Технический рисунок английского PDF, страница 25](/docs/rockchip-iq-tools/assets/en-p025-figure-03.png)

<!-- Source EN PDF p.25, unit 213 -->

Рисунок 3-4-6

<!-- Source EN PDF p.25, unit 214 -->

6. Выберите сенсор и нажмите Generate IQ File.

<!-- Source EN PDF p.25, unit 215 -->

### 3.5 Загрузка/сохранение параметров и выбор сцены

<!-- Source EN PDF p.25, unit 216 -->

1. Выберите File → Open... и IQ-файл.

<!-- Source EN PDF p.25, unit 217 -->

![Технический рисунок английского PDF, страница 25](/docs/rockchip-iq-tools/assets/en-p025-figure-04.png)

<!-- Source EN PDF p.25, unit 218 -->

Рисунок 3-5-1

<!-- Source EN PDF p.26, unit 219 -->

2. Scene Selection показывает группы сцен IQ-файла. Выберите нужную сцену и OK.

<!-- Source EN PDF p.26, unit 220 -->

![Технический рисунок английского PDF, страница 26](/docs/rockchip-iq-tools/assets/en-p026-figure-01.png)

<!-- Source EN PDF p.26, unit 221 -->

Рисунок 3-5-2

<!-- Source EN PDF p.26, unit 222 -->

3. IQ-файл сравнивается с шаблоном UI, различия выводятся в Different Member List. Слева Missing — отсутствующие в IQ параметры; справа Existed — имеющиеся в IQ, но удалённые или переименованные в UI.

<!-- Source EN PDF p.26, unit 223 -->

![Технический рисунок английского PDF, страница 26](/docs/rockchip-iq-tools/assets/en-p026-figure-02.png)

<!-- Source EN PDF p.26, unit 224 -->

Рисунок 3-5-3

<!-- Source EN PDF p.27, unit 225 -->

4. File → Save As... (3-5-4, 3-5-5) сохраняет параметры в сцену шага 2 либо в новую. Можно сохранить только выбранные модули; изменённые параметры показаны справа.

<!-- Source EN PDF p.27, unit 226 -->

![Технический рисунок английского PDF, страница 27](/docs/rockchip-iq-tools/assets/en-p027-figure-01.png)

<!-- Source EN PDF p.27, unit 227 -->

Рисунок 3-5-4

<!-- Source EN PDF p.27, unit 228 -->

![Технический рисунок английского PDF, страница 27](/docs/rockchip-iq-tools/assets/en-p027-figure-02.png)

<!-- Source EN PDF p.27, unit 229 -->

Рисунок 3-5-5

<!-- Source EN PDF p.27, unit 230 -->

### 3.6 Редактирование сенсора

<!-- Source EN PDF p.27, unit 231 -->

1. Загрузите IQ-файл по предыдущему разделу.

<!-- Source EN PDF p.27, unit 232 -->

2. Выберите Tuning → Edit Sensor Information для открытия Sensor Info.

<!-- Source EN PDF p.27, unit 233 -->

![Технический рисунок английского PDF, страница 27](/docs/rockchip-iq-tools/assets/en-p027-figure-03.png)

<!-- Source EN PDF p.27, unit 234 -->

Рисунок 3-6-1

<!-- Source EN PDF p.28, unit 235 -->

![Технический рисунок английского PDF, страница 28](/docs/rockchip-iq-tools/assets/en-p028-figure-01.png)

<!-- Source EN PDF p.28, unit 236 -->

Рисунок 3-6-2

<!-- Source EN PDF p.28, unit 237 -->

3. Выберите File → Import From Sensor List.

<!-- Source EN PDF p.28, unit 238 -->

![Технический рисунок английского PDF, страница 28](/docs/rockchip-iq-tools/assets/en-p028-figure-02.png)

<!-- Source EN PDF p.28, unit 239 -->

Рисунок 3-6-3

<!-- Source EN PDF p.28, unit 240 -->

4. Выберите сенсор, как показано ниже.

<!-- Source EN PDF p.28, unit 241 -->

![Технический рисунок английского PDF, страница 28](/docs/rockchip-iq-tools/assets/en-p028-figure-03.png)

<!-- Source EN PDF p.28, unit 242 -->

Рисунок 3-6-4

<!-- Source EN PDF p.29, unit 243 -->

5. Нажмите OK для импорта параметров.

<!-- Source EN PDF p.29, unit 244 -->

6. Закройте Sensor Information.

<!-- Source EN PDF p.29, unit 245 -->

7. Если сенсора нет в списке, создайте конфигурацию в Sensor Information по его Datasheet.

<!-- Source EN PDF p.29, unit 246 -->

### 3.7 Захват Raw и YUV

<!-- Source EN PDF p.29, unit 247 -->

#### 3.7.1 Автономный захват Raw

<!-- Source EN PDF p.29, unit 248 -->

1. Выберите Tools → RK Capture Tool.

<!-- Source EN PDF p.29, unit 249 -->

![Технический рисунок английского PDF, страница 29](/docs/rockchip-iq-tools/assets/en-p029-figure-01.png)

<!-- Source EN PDF p.29, unit 250 -->

Рисунок 3-7-1-1

<!-- Source EN PDF p.29, unit 251 -->

2. Проверьте IP и нажмите Device Status. При правильном соединении Tuner с rkaiq_tool_server появится Device is Ready.

<!-- Source EN PDF p.29, unit 252 -->

![Технический рисунок английского PDF, страница 29](/docs/rockchip-iq-tools/assets/en-p029-figure-02.png)

<!-- Source EN PDF p.29, unit 253 -->

Рисунок 3-7-1-2

<!-- Source EN PDF p.29, unit 254 -->

3. Start RTSP Streaming включает камеру и поток RTSP (необязательно).

<!-- Source EN PDF p.30, unit 255 -->

1) Android: после Start RTSP Streaming откройте `rtsp://192.168.10.104:1234/v` сторонним плеером. APK камеры устройства отключается; чтобы вернуть камеру, нажмите Stop RTSP Streaming, затем Switch To Tuning Mode.

<!-- Source EN PDF p.30, unit 256 -->

2) Linux: завершите другие работающие на плате программы камеры, затем запустите ToolServer. После Start RTSP Streaming предпросмотр доступен через `rtsp://192.168.10.104/live/0`.

<!-- Source EN PDF p.30, unit 257 -->

4. Выберите сенсор для настройки.

<!-- Source EN PDF p.30, unit 258 -->

![Технический рисунок английского PDF, страница 30](/docs/rockchip-iq-tools/assets/en-p030-figure-01.png)

<!-- Source EN PDF p.30, unit 259 -->

Рисунок 3-7-1-3

<!-- Source EN PDF p.30, unit 260 -->

5. Выберите правильные разрешение, источник света и имя модуля.

<!-- Source EN PDF p.30, unit 261 -->

6. Задайте Gain, Exposure Time, количество и другие параметры.

<!-- Source EN PDF p.30, unit 262 -->

7. Нажмите Start Manual Capture.

<!-- Source EN PDF p.30, unit 263 -->

8. Raw появится справа в Raw Preview & Statistics.

<!-- Source EN PDF p.30, unit 264 -->

9. Здесь также доступны гистограмма, максимальная/минимальная/средняя яркость, глобальный wb gain и другие данные.

<!-- Source EN PDF p.30, unit 265 -->

10. Raw по умолчанию сохраняется в `./raw_capture/module name/`.

<!-- Source EN PDF p.31, unit 266 -->

![Технический рисунок английского PDF, страница 31](/docs/rockchip-iq-tools/assets/en-p031-figure-01.png)

<!-- Source EN PDF p.31, unit 267 -->

Рисунок 3-7-1-4: одиночный Raw, Gain=5x ExpTime=0.01s

<!-- Source EN PDF p.31, unit 268 -->

#### 3.7.2 Онлайн-захват YUV

<!-- Source EN PDF p.31, unit 269 -->

1. Запустите приложение камеры и проверьте предпросмотр.

<!-- Source EN PDF p.31, unit 270 -->

2. Запустите ToolServer, введите IP в инструменте и подключитесь.

<!-- Source EN PDF p.31, unit 271 -->

3. Перейдите в Online Capture и введите Sensor Name — префикс имени YUV-файла.

<!-- Source EN PDF p.31, unit 272 -->

4. Для последовательных кадров задайте количество Frame Num.

<!-- Source EN PDF p.31, unit 273 -->

5. Нажмите Capture YUV: изображение доступно в предпросмотре, файл сохраняется в `raw_capture/yuv/` (3-7-2-1).

<!-- Source EN PDF p.31, unit 274 -->

![Технический рисунок английского PDF, страница 31](/docs/rockchip-iq-tools/assets/en-p031-figure-02.png)

<!-- Source EN PDF p.31, unit 275 -->

Рисунок 3-7-2-1

<!-- Source EN PDF p.32, unit 276 -->

#### 3.7.3 Онлайн-захват Raw

<!-- Source EN PDF p.32, unit 277 -->

1. Запустите приложение камеры и проверьте предпросмотр.

<!-- Source EN PDF p.32, unit 278 -->

2. Запустите ToolServer, введите IP в инструменте и подключитесь.

<!-- Source EN PDF p.32, unit 279 -->

3. Выберите Online Capture и введите Sensor Name — префикс имени Raw-файла.

<!-- Source EN PDF p.32, unit 280 -->

4. Для последовательных кадров задайте количество Frame Num.

<!-- Source EN PDF p.32, unit 281 -->

5. Нажмите Capture Raw: изображение видно в предпросмотре, файл сохраняется в `raw_capture/` (3-7-3-1).

<!-- Source EN PDF p.32, unit 282 -->

![Технический рисунок английского PDF, страница 32](/docs/rockchip-iq-tools/assets/en-p032-figure-01.png)

<!-- Source EN PDF p.32, unit 283 -->

Рисунок 3-7-3-1

<!-- Source EN PDF p.32, unit 284 -->

Максимальное число последовательных Raw онлайн

<!-- Source EN PDF p.32, unit 285 -->

Максимум последовательных кадров зависит от числа буферов, задаваемого `-n` ToolServer. Больше буферов позволяет захватить больше кадров за операцию; если кадров больше буферов, возможны потери. Предел также зависит от выделенных ядром буферов и памяти. Пример изменений ядра приведён ниже.

<!-- Source EN PDF p.33, unit 286 -->

![Технический рисунок английского PDF, страница 33](/docs/rockchip-iq-tools/assets/en-p033-figure-01.png)

Изображение патча полностью расшифровано ниже, оригинал оставлен для сверки. Это фрагмент исходника, не гарантия применимости к любому ядру.

```diff
diff --git a/include/media/videobuf2-core.h b/include/media/videobuf2-core.h
index 3f4f171..ee359c5 100644
--- a/include/media/videobuf2-core.h
+++ b/include/media/videobuf2-core.h
@@ -19,7 +19,7 @@
 #include <linux/bitops.h>
 #include <media/media-request.h>

-#define VB2_MAX_FRAME (64)
+#define VB2_MAX_FRAME (128)
 #define VB2_MAX_PLANES (8)

 /**
diff --git a/include/uapi/linux/videodev2.h b/include/uapi/linux/videodev2.h
index d900af7..592fccc 100644
--- a/include/uapi/linux/videodev2.h
+++ b/include/uapi/linux/videodev2.h
@@ -70,7 +70,7 @@
 /*
  * Common stuff for both V4L1 and V4L2
  * Moved from videodev.h
  */
-#define VIDEO_MAX_FRAME        64
+#define VIDEO_MAX_FRAME        128
 #define VIDEO_MAX_PLANES       8
```

<!-- Source EN PDF p.34, unit 287 -->

## 4 Описание калибровки

<!-- Source EN PDF p.34, unit 288 -->

Калибровка каждого модуля состоит из трёх этапов:

<!-- Source EN PDF p.34, unit 289 -->

1. Захват: снимите Raw калибровочной мишени или сцены с подходящей для модуля экспозицией.

<!-- Source EN PDF p.34, unit 290 -->

2. Вычисление: импортируйте Raw и рассчитайте параметры; отдельные модули допускают дополнительную подстройку.

<!-- Source EN PDF p.34, unit 291 -->

3. Проверка и сохранение: оцените корректность параметров по критериям модуля.

<!-- Source EN PDF p.34, unit 292 -->

### 4.1 Захват Raw

<!-- Source EN PDF p.34, unit 293 -->

Исходник отсылает к 3.6 (там редактирование сенсора; захват находится в 3.7). Несоответствие ссылки отмечено.

<!-- Source EN PDF p.34, unit 294 -->

### 4.2 Калибровка BLC

<!-- Source EN PDF p.34, unit 295 -->

#### 4.2.1 Основные принципы

<!-- Source EN PDF p.34, unit 296 -->

Из-за Black Level сенсор выдаёт напряжение даже без внешнего света; его нужно вычитать из конечного сигнала. Для измерения резервируются неэкспонируемые пиксели, позволяющие получать Optical Black Level в реальном времени: `Raw = Sensor Input - Optical Black Level`.

<!-- Source EN PDF p.34, unit 297 -->

С учётом отношения сигнал/шум обычно вводится базовый Pedestal: `Raw = Sensor Input - Optical Black Level - Pedestal`.

<!-- Source EN PDF p.34, unit 298 -->

Для разных конфигураций сенсора итоговую коррекцию BLC получают из RAW полностью тёмной сцены.

<!-- Source EN PDF p.34, unit 299 -->

Коррекция зависит главным образом от Gain и Temperature, поэтому разные ISO калибруются отдельно. BLC — смещение; при калибровке других модулей его необходимо вычесть, иначе параметры будут неверны.

<!-- Source EN PDF p.34, unit 300 -->

RV1106: для сохранения тёмных деталей в Bayer2D/Bayer3D модуль BLC добавляет Sensor OB, то есть Pedestal. Некоторые сенсоры настраиваются последовательностью драйвера, другие имеют фиксированные значения, которые

<!-- Source EN PDF p.35, unit 301 -->

уточняются по Datasheet или коду драйвера. Если определить их сложно, используйте справочные значения 4.2.4 либо среднее BLC каждого канала при Gain=1x.

<!-- Source EN PDF p.35, unit 302 -->

#### 4.2.2 Требования к Raw

<!-- Source EN PDF p.35, unit 303 -->

1. Закройте объектив, полностью исключив свет.

<!-- Source EN PDF p.35, unit 304 -->

2. Переберите Gain=1x, 2x, 4x, 8x, 16x...Max; если драйвер поддерживает до 40x, Max=32.

<!-- Source EN PDF p.35, unit 305 -->

3. Выдержка не влияет на BLC и может быть одинаковой: 10ms.

<!-- Source EN PDF p.35, unit 306 -->

#### 4.2.3 Захват Raw

<!-- Source EN PDF p.35, unit 307 -->

1. Откройте RK Capture Tool и подключитесь по 3.1/3.2. Свет — unknow (без света), модуль — BLC.

<!-- Source EN PDF p.35, unit 308 -->

2. Поместите устройство/модуль в темноту и плотно закройте объектив чёрной тканью или крышкой.

<!-- Source EN PDF p.35, unit 309 -->

3. В Manual Exposure включите Step и 2^n; по Gain Range задайте Gain Begin=1.0, Gain End=Max, ExpTime=0.010.

<!-- Source EN PDF p.35, unit 310 -->

4. Start Manual Capture выполняет захват Raw с шагом степеней 2.

<!-- Source EN PDF p.35, unit 311 -->

5. Raw отображаются справа; выбирайте изображение выпадающим списком.

<!-- Source EN PDF p.35, unit 312 -->

![Технический рисунок английского PDF, страница 35](/docs/rockchip-iq-tools/assets/en-p035-figure-01.png)

<!-- Source EN PDF p.35, unit 313 -->

Рисунок 4-2-3-1

<!-- Source EN PDF p.36, unit 314 -->

#### 4.2.4 Процесс калибровки

<!-- Source EN PDF p.36, unit 315 -->

![Технический рисунок английского PDF, страница 36](/docs/rockchip-iq-tools/assets/en-p036-figure-01.png)

<!-- Source EN PDF p.36, unit 316 -->

Рисунок 4-2-4-1: результаты BLC

<!-- Source EN PDF p.36, unit 317 -->

1. В Calibration Tool откройте Edit Options слева сверху и задайте размер Raw, разрядность и порядок Bayer.

<!-- Source EN PDF p.36, unit 318 -->

2. На странице BLC нажмите Load Raw Files и выберите каталог Raw.

<!-- Source EN PDF p.36, unit 319 -->

3. Импортированные Raw появятся в списке справа.

<!-- Source EN PDF p.36, unit 320 -->

4. Нажмите Calibrate. Для Linear на RV1106 сначала введите Sensor OB. Справочные значения:

<!-- Source EN PDF p.36, unit 321 -->

| Производитель | OB для справки |
| --- | --- |
| GalaxyCore(gc) | 256 |
| OmniVision(ov/os) | 256 |
| Samsung(s5k) | 256 |
| SmartSens(sc) | 256 |
| Sony(imx) | Настраивается последовательностью драйвера; сверяйте Datasheet и код драйвера. |

<!-- Source EN PDF p.36, unit 322 -->

5. Полученная Black Level Curve отображается сверху.

<!-- Source EN PDF p.36, unit 323 -->

6. Значения BLC показаны в таблице; нажмите Save.

Примечания:

<!-- Source EN PDF p.36, unit 324 -->

1. Проверьте засветку от индикаторов питания и состояния.

<!-- Source EN PDF p.36, unit 325 -->

2. Ошибка BLC влияет на все последующие модули. Проверьте результат до дальнейшей калибровки.

<!-- Source EN PDF p.37, unit 326 -->

### 4.3 Калибровка LSC

<!-- Source EN PDF p.37, unit 327 -->

#### 4.3.1 Основные принципы

<!-- Source EN PDF p.37, unit 328 -->

Luma Shading обусловлен оптикой объектива. Если представить его выпуклой линзой, центр собирает свет сильнее краёв, поэтому центр сенсора ярче углов. Для камеры без искажений спад освещённости подчиняется формуле:

<!-- Source EN PDF p.37, unit 329 -->

![Технический рисунок английского PDF, страница 37](/docs/rockchip-iq-tools/assets/en-p037-figure-01.png)

<!-- Source EN PDF p.37, unit 330 -->

`cos^4(theta)`

<!-- Source EN PDF p.37, unit 331 -->

#### 4.3.2 Требования к Raw

<!-- Source EN PDF p.37, unit 332 -->

1. Закройте объектив рассеивателем либо используйте DNP light box, интегрирующую сферу и т. п.

<!-- Source EN PDF p.37, unit 333 -->

2. Снимайте в стандартном световом боксе; рекомендуются семь источников HZ, A, CWF, TL84, D50, D65, D75.

<!-- Source EN PDF p.37, unit 334 -->

3. Для подавления мерцания сетевого света задавайте выдержку кратной 10ms.

<!-- Source EN PDF p.37, unit 335 -->

4. Максимальная яркость Raw около 200 (8bit), минимальная заметно выше ранее найденного чёрного.

<!-- Source EN PDF p.37, unit 336 -->

5. Рекомендуется показанный рассеиватель.

<!-- Source EN PDF p.37, unit 337 -->

![Технический рисунок английского PDF, страница 37](/docs/rockchip-iq-tools/assets/en-p037-figure-02.png)

<!-- Source EN PDF p.37, unit 338 -->

Рисунок 4-3-2-1: опаловый рассеиватель

<!-- Source EN PDF p.37, unit 339 -->

#### 4.3.3 Захват Raw

<!-- Source EN PDF p.37, unit 340 -->

1. По 3.1/3.2 откройте RK Capture Tool, подключите устройство и выберите LSC.

<!-- Source EN PDF p.37, unit 341 -->

2. Поместите модуль в световой бокс, включите HZ и установите рассеиватель у объектива.

<!-- Source EN PDF p.38, unit 342 -->

3. Выберите HZ, в Auto Exposure включите Search Exposure by Max Luma (8bit) и Anti Flicker (50hz), задайте максимум 200±10%, Frame Number = 1.

<!-- Source EN PDF p.38, unit 343 -->

4. Start Auto Capture автоматически подбирает экспозицию до заданного максимума яркости.

<!-- Source EN PDF p.38, unit 344 -->

5. Переключите свет и имя на A, повторяйте шаг 4 для всех источников.

<!-- Source EN PDF p.38, unit 345 -->

![Технический рисунок английского PDF, страница 38](/docs/rockchip-iq-tools/assets/en-p038-figure-01.png)

<!-- Source EN PDF p.38, unit 346 -->

Рисунок 4-3-3-1

<!-- Source EN PDF p.38, unit 347 -->

#### 4.3.4 Процесс калибровки

<!-- Source EN PDF p.38, unit 348 -->

1. В Calibration Tool → Edit Options слева сверху задайте размер, разрядность и порядок Bayer.

<!-- Source EN PDF p.38, unit 349 -->

2. Выберите LSC и импортируйте все Raw через Load Raw Files.

<!-- Source EN PDF p.38, unit 350 -->

3. Raw появятся в верхнем окне.

<!-- Source EN PDF p.38, unit 351 -->

4. Установите Light Fall off 100%.

<!-- Source EN PDF p.38, unit 352 -->

5. Нажмите Calibrate.

<!-- Source EN PDF p.38, unit 353 -->

6. После калибровки просмотрите Raw каждого источника на странице результатов.

<!-- Source EN PDF p.38, unit 354 -->

7. Нажмите Save.

<!-- Source EN PDF p.38, unit 355 -->

8. Измените Light Fall off на 70% и повторите 5–7.

<!-- Source EN PDF p.39, unit 356 -->

![Технический рисунок английского PDF, страница 39](/docs/rockchip-iq-tools/assets/en-p039-figure-01.png)

<!-- Source EN PDF p.39, unit 357 -->

Рисунок 4-3-4-1

<!-- Source EN PDF p.39, unit 358 -->

![Технический рисунок английского PDF, страница 39](/docs/rockchip-iq-tools/assets/en-p039-figure-02.png)

<!-- Source EN PDF p.39, unit 359 -->

Рисунок 4-3-4-2

<!-- Source EN PDF p.39, unit 360 -->

При слишком ярком или слабом свете инструмент может не найти экспозицию. Возможные решения:

<!-- Source EN PDF p.39, unit 361 -->

1. Измените яркость света.

<!-- Source EN PDF p.39, unit 362 -->

2. Используйте ND-фильтр.

<!-- Source EN PDF p.40, unit 363 -->

3. Измените направление объектива.

<!-- Source EN PDF p.40, unit 364 -->

4. Измените Gain Range либо Exp Range.

<!-- Source EN PDF p.40, unit 365 -->

5. Измените максимум яркости или порог автоэкспозиции.

<!-- Source EN PDF p.40, unit 366 -->

6. Используйте ручную экспозицию; минимальная яркость должна быть заметно выше чёрного из предыдущего раздела.

<!-- Source EN PDF p.40, unit 367 -->

### 4.4 Калибровка AWB

<!-- Source EN PDF p.40, unit 368 -->

#### 4.4.1 Введение

<!-- Source EN PDF p.40, unit 369 -->

Калибруются условия белых точек Raw в XY, UV, YUV, параметры алгоритма простых цветов и усиления баланса белого при стандартном свете.

<!-- Source EN PDF p.40, unit 370 -->

#### 4.4.2 Требования к Raw

<!-- Source EN PDF p.40, unit 371 -->

Подготовка захвата Raw:

<!-- Source EN PDF p.40, unit 372 -->

1. Оборудование: X-Rite 24 ColorChecker и световой бокс D75, D65, D50, TL84, CWF, A, HZ.

<!-- Source EN PDF p.40, unit 373 -->

2. Настройте экспозицию: максимум самого яркого белого поля [150-240], чем ярче в этом диапазоне, тем лучше. Если Raw будет использоваться для CCM, сделайте его темнее.

<!-- Source EN PDF p.40, unit 374 -->

3. ColorChecker занимает больше 1/9 кадра.

Порядок захвата Raw:

<!-- Source EN PDF p.40, unit 375 -->

1. По 3.1/3.2 откройте RK Capture Tool, подключите устройство, модуль CCM_AWB.

<!-- Source EN PDF p.40, unit 376 -->

2. Поместите устройство и ColorChecker в бокс, расположите мишень по центру как можно крупнее и не перемещайте устройство.

<!-- Source EN PDF p.40, unit 377 -->

3. Включите бокс и свет HZ.

<!-- Source EN PDF p.40, unit 378 -->

4. Выберите HZ, в Auto Exposure включите Search Exposure By Max Luma (8bit), Anti Flicker (50hz), максимум 200±10%, Frame Number = 1. Если при 1x Gain и выдержке кратной 10ms Raw не получается, отключите Anti-Flicker (50hz) и повторите.

<!-- Source EN PDF p.41, unit 379 -->

![Технический рисунок английского PDF, страница 41](/docs/rockchip-iq-tools/assets/en-p041-figure-01.png)

<!-- Source EN PDF p.41, unit 380 -->

Рисунок 4-4-2-1

<!-- Source EN PDF p.41, unit 381 -->

5. Start Auto Capture автоматически подбирает экспозицию до заданной максимальной яркости.

<!-- Source EN PDF p.41, unit 382 -->

6. Переключите свет и имя на A и повторите для всех источников.

<!-- Source EN PDF p.41, unit 383 -->

Пример калибровочных Raw после демозаики:

<!-- Source EN PDF p.41, unit 384 -->

![Технический рисунок английского PDF, страница 41](/docs/rockchip-iq-tools/assets/en-p041-figure-02.png)

<!-- Source EN PDF p.41, unit 385 -->

Рисунок 4-4-2-2

<!-- Source EN PDF p.42, unit 386 -->

#### 4.4.3 Инструмент калибровки

<!-- Source EN PDF p.42, unit 387 -->

1. Настройте условия белых точек UV/XY и TH в YUV.

<!-- Source EN PDF p.42, unit 388 -->

![Технический рисунок английского PDF, страница 42](/docs/rockchip-iq-tools/assets/en-p042-figure-01.png)

<!-- Source EN PDF p.42, unit 389 -->

Рисунок 4-4-3-1

<!-- Source EN PDF p.42, unit 390 -->

![Технический рисунок английского PDF, страница 42](/docs/rockchip-iq-tools/assets/en-p042-figure-02.png)

<!-- Source EN PDF p.42, unit 391 -->

Рисунок 4-4-3-2

<!-- Source EN PDF p.42, unit 392 -->

2. Настройка условий белых точек UV/XY:

<!-- Source EN PDF p.42, unit 393 -->

a) Перетаскивайте четыре угла области белых точек источника для изменения положения и размера.

<!-- Source EN PDF p.42, unit 394 -->

b) Перетаскивайте пустую область координат для изменения диапазона отображения.

<!-- Source EN PDF p.42, unit 395 -->

c) Колесом меняйте масштаб.

<!-- Source EN PDF p.42, unit 396 -->

d) Exclude WPC Range задаёт области не-белых точек и белых точек дополнительных источников.

<!-- Source EN PDF p.42, unit 397 -->

3. AWB Simulation обнаруживает белые точки исходного изображения, вычисляет WB Gain и их количество и отображает выбранные пиксели в UV/XY для проверки условий.

<!-- Source EN PDF p.43, unit 398 -->

![Технический рисунок английского PDF, страница 43](/docs/rockchip-iq-tools/assets/en-p043-figure-01.png)

<!-- Source EN PDF p.43, unit 399 -->

Рисунок 4-4-3-3

<!-- Source EN PDF p.44, unit 400 -->

a) После LoadImage выводятся данные белых точек. Разные источники обозначены разными цветами. WP Number, RGain и BGain показывают число точек среднего/большого прямоугольников и накопленные RGain/BGain.

<!-- Source EN PDF p.44, unit 401 -->

![Технический рисунок английского PDF, страница 44](/docs/rockchip-iq-tools/assets/en-p044-figure-01.png)

<!-- Source EN PDF p.44, unit 402 -->

Рисунок 4-4-3-4

<!-- Source EN PDF p.45, unit 403 -->

b) Щелчок по изображению (чёрная стрелка) показывает точку чёрным квадратом в UV/XY для проверки диапазона белого. Выводятся R G B U V X Y RGain BGain (красная область), а также u, th и расстояние до стандартного белого после проекции на источники YUV (три зелёные колонки).

<!-- Source EN PDF p.45, unit 404 -->

![Технический рисунок английского PDF, страница 45](/docs/rockchip-iq-tools/assets/en-p045-figure-01.png)

<!-- Source EN PDF p.45, unit 405 -->

Рисунок 4-4-3-5

<!-- Source EN PDF p.45, unit 406 -->

![Технический рисунок английского PDF, страница 45](/docs/rockchip-iq-tools/assets/en-p045-figure-02.png)

<!-- Source EN PDF p.45, unit 407 -->

Рисунок 4-4-3-6

<!-- Source EN PDF p.46, unit 408 -->

#### 4.4.4 Процесс калибровки

<!-- Source EN PDF p.46, unit 409 -->

1. В Calibration Tool → Edit Options задайте размер Raw, sensor bpp и порядок Bayer.

<!-- Source EN PDF p.46, unit 410 -->

2. До AWB завершите BLC и LSC.

<!-- Source EN PDF p.46, unit 411 -->

3. Через Load Raw Files импортируйте Raw семи рекомендуемых источников A, CWF, D50, D65, D75, HZ, TL84.

<!-- Source EN PDF p.46, unit 412 -->

4. Find Chart открывает поиск цветовых полей. Зеркальные изображения исправляются через Flip справа; поддерживаются горизонтальное и вертикальное отражения.

<!-- Source EN PDF p.46, unit 413 -->

![Технический рисунок английского PDF, страница 46](/docs/rockchip-iq-tools/assets/en-p046-figure-01.png)

<!-- Source EN PDF p.46, unit 414 -->

Рисунок 4-4-4-1

<!-- Source EN PDF p.46, unit 415 -->

a) Перетащите центры красных рамок в четырёх углах так, чтобы статистические области находились в центре каждого поля (4-4-4-1).

<!-- Source EN PDF p.46, unit 416 -->

b) Нажмите FindChart для распознавания полей всех источников (4-4-4-2).

<!-- Source EN PDF p.47, unit 417 -->

![Технический рисунок английского PDF, страница 47](/docs/rockchip-iq-tools/assets/en-p047-figure-01.png)

<!-- Source EN PDF p.47, unit 418 -->

Рисунок 4-4-4-2

<!-- Source EN PDF p.47, unit 419 -->

c) Выберите другие источники и проверьте распознавание. Верно — 4-4-4-4, неверное положение — 4-4-4-3. Для исправления выберите Find Current Chart в Mode и повторяйте a)/b) только для текущего источника.

<!-- Source EN PDF p.47, unit 420 -->

![Технический рисунок английского PDF, страница 47](/docs/rockchip-iq-tools/assets/en-p047-figure-02.png)

<!-- Source EN PDF p.47, unit 421 -->

Рисунок 4-4-4-3

<!-- Source EN PDF p.48, unit 422 -->

![Технический рисунок английского PDF, страница 48](/docs/rockchip-iq-tools/assets/en-p048-figure-01.png)

<!-- Source EN PDF p.48, unit 423 -->

Рисунок 4-4-4-4

<!-- Source EN PDF p.48, unit 424 -->

d) Нажмите save для завершения.

<!-- Source EN PDF p.48, unit 425 -->

5. Calibrate занимает по исходнику около 30s и вычисляет начальные условия белых точек. Цветные точки UV/XY — положения полей ColorChecker разных источников, прямоугольники — их условия белого.

<!-- Source EN PDF p.48, unit 426 -->

![Технический рисунок английского PDF, страница 48](/docs/rockchip-iq-tools/assets/en-p048-figure-02.png)

<!-- Source EN PDF p.48, unit 427 -->

Рисунок 4-4-4-5

<!-- Source EN PDF p.49, unit 428 -->

![Технический рисунок английского PDF, страница 49](/docs/rockchip-iq-tools/assets/en-p049-figure-01.png)

<!-- Source EN PDF p.49, unit 429 -->

Рисунок 4-4-4-6

<!-- Source EN PDF p.49, unit 430 -->

6. В AWB Simulation поочерёдно импортируйте Raw A, CWF, D50, D65, D75, HZ, TL84 и проверьте белые точки.

<!-- Source EN PDF p.49, unit 431 -->

7. Меняйте рамки UV/XY либо TH YUV для повышения точности.

<!-- Source EN PDF p.49, unit 432 -->

8. Нажмите Save, затем Run Simulator в AWB Simulation для просмотра белых точек.

<!-- Source EN PDF p.49, unit 433 -->

9. Повторяйте 6–8 до корректного распознавания всех источников.

<!-- Source EN PDF p.50, unit 434 -->

Примечания:

<!-- Source EN PDF p.50, unit 435 -->

1. Добейтесь попадания белых полей 19, 20, 21, 22 внутрь рамки, остальных — наружу.

<!-- Source EN PDF p.50, unit 436 -->

2. Средние рамки источников вдоль локуса чёрного тела должны быть непрерывны по x. Ошибка: малые промежутки больших рамок, но большие промежутки средних.

<!-- Source EN PDF p.50, unit 437 -->

![Технический рисунок английского PDF, страница 50](/docs/rockchip-iq-tools/assets/en-p050-figure-01.png)

<!-- Source EN PDF p.50, unit 438 -->

Правильный пример:

<!-- Source EN PDF p.50, unit 439 -->

![Технический рисунок английского PDF, страница 50](/docs/rockchip-iq-tools/assets/en-p050-figure-02.png)

<!-- Source EN PDF p.50, unit 440 -->

3. В направлении Y пространства XY области A/HZ можно сделать меньше, D50/D65 — больше.

<!-- Source EN PDF p.50, unit 441 -->

4. Близкие по цветовой температуре CWF/TL84 можно расположить рядом по Y.

<!-- Source EN PDF p.50, unit 442 -->

5. В UV между любыми двумя источниками не должно быть зазоров.

<!-- Source EN PDF p.50, unit 443 -->

6. Области могут перекрываться, но не одновременно в XY и UV.

<!-- Source EN PDF p.50, unit 444 -->

7. Исключая не-белые точки, настраивайте UV с учётом распределения XY.

<!-- Source EN PDF p.51, unit 445 -->

Например, обведённое поле 7 D75 попадает в HZ и ошибочно распознаётся белым.

<!-- Source EN PDF p.51, unit 446 -->

![Технический рисунок английского PDF, страница 51](/docs/rockchip-iq-tools/assets/en-p051-figure-01.png)

<!-- Source EN PDF p.51, unit 447 -->

После настройки поле 7 D75 относится к разным источникам в xy/uv и больше не признаётся белым.

<!-- Source EN PDF p.51, unit 448 -->

![Технический рисунок английского PDF, страница 51](/docs/rockchip-iq-tools/assets/en-p051-figure-02.png)

<!-- Source EN PDF p.51, unit 449 -->

8. Не-белые точки внутри диапазонов XY/UV можно исключить уменьшением TH либо расширением диапазона не-белого.

<!-- Source EN PDF p.51, unit 450 -->

9. Если точка в XY/UV не распознаётся белой, она может выходить за диапазон яркости, попадать в не-белую область либо быть ниже TH и не входить в диапазон белого YUV.

<!-- Source EN PDF p.52, unit 451 -->

#### 4.4.5 Примеры результатов AWB

<!-- Source EN PDF p.52, unit 452 -->

Итоговые условия белых точек:

<!-- Source EN PDF p.52, unit 453 -->

![Технический рисунок английского PDF, страница 52](/docs/rockchip-iq-tools/assets/en-p052-figure-01.png)

<!-- Source EN PDF p.52, unit 454 -->

Рисунок 4-4-5-1

<!-- Source EN PDF p.52, unit 455 -->

Результаты распознавания каждого источника:

<!-- Source EN PDF p.52, unit 456 -->

![Технический рисунок английского PDF, страница 52](/docs/rockchip-iq-tools/assets/en-p052-figure-02.png)

<!-- Source EN PDF p.53, unit 457 -->

Рисунок 4-4-5-1 A

<!-- Source EN PDF p.53, unit 458 -->

![Технический рисунок английского PDF, страница 53](/docs/rockchip-iq-tools/assets/en-p053-figure-01.png)

<!-- Source EN PDF p.53, unit 459 -->

Рисунок 4-4-5-2 CWF

<!-- Source EN PDF p.53, unit 460 -->

![Технический рисунок английского PDF, страница 53](/docs/rockchip-iq-tools/assets/en-p053-figure-02.png)

<!-- Source EN PDF p.54, unit 461 -->

Рисунок 4-4-5-3 D50

<!-- Source EN PDF p.54, unit 462 -->

![Технический рисунок английского PDF, страница 54](/docs/rockchip-iq-tools/assets/en-p054-figure-01.png)

<!-- Source EN PDF p.54, unit 463 -->

Рисунок 4-4-5-4 D65

<!-- Source EN PDF p.54, unit 464 -->

![Технический рисунок английского PDF, страница 54](/docs/rockchip-iq-tools/assets/en-p054-figure-02.png)

<!-- Source EN PDF p.55, unit 465 -->

Рисунок 4-4-5-5 D75

<!-- Source EN PDF p.55, unit 466 -->

![Технический рисунок английского PDF, страница 55](/docs/rockchip-iq-tools/assets/en-p055-figure-01.png)

<!-- Source EN PDF p.55, unit 467 -->

Рисунок 4-4-5-6 HZ

<!-- Source EN PDF p.55, unit 468 -->

![Технический рисунок английского PDF, страница 55](/docs/rockchip-iq-tools/assets/en-p055-figure-02.png)

<!-- Source EN PDF p.55, unit 469 -->

Рисунок 4-4-5-7 TL84

<!-- Source EN PDF p.56, unit 470 -->

### 4.5 Калибровка CCM

<!-- Source EN PDF p.56, unit 471 -->

#### 4.5.1 Требования к Raw

<!-- Source EN PDF p.56, unit 472 -->

Требования см. 4.4: CCM может использовать Raw AWB. Gamma влияет на CCM, поэтому после изменения кривой может потребоваться перенастройка. См.

<!-- Source EN PDF p.56, unit 473 -->

4.5.2, пункт 12.

<!-- Source EN PDF p.56, unit 474 -->

#### 4.5.2 Процесс калибровки CCM

<!-- Source EN PDF p.56, unit 475 -->

1. В Calibration Tool выберите CCM, импортируйте все Raw через Load Raw Files; они появятся в списке.

<!-- Source EN PDF p.56, unit 476 -->

![Технический рисунок английского PDF, страница 56](/docs/rockchip-iq-tools/assets/en-p056-figure-01.png)

<!-- Source EN PDF p.56, unit 477 -->

Рисунок 4-5-2-1

<!-- Source EN PDF p.57, unit 478 -->

2. Find Chart открывает поиск полей.

<!-- Source EN PDF p.57, unit 479 -->

![Технический рисунок английского PDF, страница 57](/docs/rockchip-iq-tools/assets/en-p057-figure-01.png)

<!-- Source EN PDF p.57, unit 480 -->

Рисунок 4-5-2-2

<!-- Source EN PDF p.57, unit 481 -->

3. Перетащите центры красных рамок в четырёх углах, расположив выборки по центру полей.

<!-- Source EN PDF p.57, unit 482 -->

4. Find Chart вычисляет значения полей; области отмечаются зелёным.

<!-- Source EN PDF p.57, unit 483 -->

5. Проверьте правильность областей у всех источников списка.

<!-- Source EN PDF p.57, unit 484 -->

![Технический рисунок английского PDF, страница 57](/docs/rockchip-iq-tools/assets/en-p057-figure-02.png)

<!-- Source EN PDF p.57, unit 485 -->

Рисунок 4-5-2-3

<!-- Source EN PDF p.57, unit 486 -->

6. После поиска нажмите Save и выйдите.

<!-- Source EN PDF p.57, unit 487 -->

7. Установите насыщенность 100%, см. 4-5-2-4.

<!-- Source EN PDF p.58, unit 488 -->

![Технический рисунок английского PDF, страница 58](/docs/rockchip-iq-tools/assets/en-p058-figure-01.png)

<!-- Source EN PDF p.58, unit 489 -->

Рисунок 4-5-2-4

<!-- Source EN PDF p.58, unit 490 -->

8. Нажмите Calibrate; по исходнику около 20s.

<!-- Source EN PDF p.58, unit 491 -->

9. После калибровки расчёт появится на странице результатов.

<!-- Source EN PDF p.58, unit 492 -->

10. Нажмите Save.

<!-- Source EN PDF p.58, unit 493 -->

11. Измените насыщенность на 74% и повторите 8–10.

<!-- Source EN PDF p.58, unit 494 -->

![Технический рисунок английского PDF, страница 58](/docs/rockchip-iq-tools/assets/en-p058-figure-02.png)

<!-- Source EN PDF p.58, unit 495 -->

Рисунок 4-5-2-5

<!-- Source EN PDF p.58, unit 496 -->

12. Слишком большой ΔE может быть вызван ярким Raw. Правой кнопкой по ColorChecker справа на 4-5-2-5 выберите Save Current и проверьте пересвет полей или насыщение канала. Применение Gamma перед CCM может насыщать поля.

<!-- Source EN PDF p.58, unit 497 -->

a) При пересвете или насыщении уменьшите экспозицию, повторно снимите мишень этого источника и калибруйте.

<!-- Source EN PDF p.58, unit 498 -->

b) При нормальной яркости возможны неверные BLC/LSC либо засветка объектива инфракрасным светом и т. п.

<!-- Source EN PDF p.58, unit 499 -->

13. Методы настройки см. в Rockchip_Color_Optimization_Guide.

<!-- Source EN PDF p.59, unit 500 -->

### 4.6 Калибровка NR

<!-- Source EN PDF p.59, unit 501 -->

#### 4.6.1 Требования к Raw

<!-- Source EN PDF p.59, unit 502 -->

Захват Raw для NR:

<!-- Source EN PDF p.59, unit 503 -->

1. Снимайте в стандартном световом боксе; рекомендуется регулируемый источник постоянного света.

<!-- Source EN PDF p.59, unit 504 -->

2. Обязательна градационная серая мишень (4-6-1-1).

<!-- Source EN PDF p.59, unit 505 -->

![Технический рисунок английского PDF, страница 59](/docs/rockchip-iq-tools/assets/en-p059-figure-01.png)

<!-- Source EN PDF p.59, unit 506 -->

Рисунок 4-6-1-1

<!-- Source EN PDF p.59, unit 507 -->

3. Переберите Gain=1x, 2x, 4x, 8x, 16x...Max; при максимуме 40x используйте Max=32.

<!-- Source EN PDF p.59, unit 508 -->

4. Для каждого Gain нужны четыре Raw: яркий суммированный, яркий одиночный, тёмный суммированный, тёмный одиночный.

<!-- Source EN PDF p.59, unit 509 -->

5. Яркий/тёмный режим меняется выдержкой или освещением; многокадровые и одиночные результаты формирует инструмент.

<!-- Source EN PDF p.59, unit 510 -->

6. Все значения яркости далее 8-bit.

<!-- Source EN PDF p.59, unit 511 -->

7. Тёмное изображение: самое яркое поле 4-6-1-1 достигает 30, чтобы различались границы; при необходимости увеличьте. Самое тёмное достигает Black-Level, обычно когда яркое едва достигает 30.

<!-- Source EN PDF p.59, unit 512 -->

8. Яркое изображение: максимум 255, самое тёмное поле обычно 60–70.

<!-- Source EN PDF p.59, unit 513 -->

9. YNR Capture в RK Capture Tool автоматически подбирает экспозицию по порогам самого тёмного и светлого полей.

<!-- Source EN PDF p.59, unit 514 -->

#### 4.6.2 Захват Raw

<!-- Source EN PDF p.59, unit 515 -->

1. По 3.1/3.2 откройте RK Capture Tool и подключите устройство.

<!-- Source EN PDF p.59, unit 516 -->

2. Поместите устройство/модуль в бокс и закрепите градационную мишень на нём.

<!-- Source EN PDF p.59, unit 517 -->

3. Расположите мишень по центру, по возможности заполняя кадр.

<!-- Source EN PDF p.60, unit 518 -->

4. Включите свет TL84 либо CWF.

<!-- Source EN PDF p.60, unit 519 -->

5. Имя источника TL84 или CWF, модуль NR_Normal.

<!-- Source EN PDF p.60, unit 520 -->

6. Если сенсор поддерживает Gain=1-24, снимите 1x, 2x, 4x, 8x, 16x.

<!-- Source EN PDF p.60, unit 521 -->

7. Выберите YNR Capture и снимите Raw. В предпросмотре справа правой кнопкой выберите Draw ROI, отметьте самое светлое и тёмное поля (далее белое и чёрное). Двойной щелчок позволяет перерисовать прямоугольник. Зафиксируйте кадр и ROI для NR, см.

<!-- Source EN PDF p.60, unit 522 -->

рисунок 4-6-2-1.

<!-- Source EN PDF p.60, unit 523 -->

![Технический рисунок английского PDF, страница 60](/docs/rockchip-iq-tools/assets/en-p060-figure-01.png)

<!-- Source EN PDF p.60, unit 524 -->

Рисунок 4-6-2-1

<!-- Source EN PDF p.60, unit 525 -->

8. Тёмный Raw: бокс около 800lux, Gain Range 1.0 - 1.0, Exp Range без изменения. Включите Multi-Frame и Low-Light. В YNR Capture задайте пороги, FrameNumber=32. Black Block Mean Luma — цель чёрного, начально BLC(8bit)+1; White Block Mean Luma — цель белого, начально

<!-- Source EN PDF p.60, unit 526 -->

30.

<!-- Source EN PDF p.60, unit 527 -->

![Технический рисунок английского PDF, страница 60](/docs/rockchip-iq-tools/assets/en-p060-figure-02.png)

<!-- Source EN PDF p.60, unit 528 -->

Рисунок 4-6-2-2

<!-- Source EN PDF p.61, unit 529 -->

a) Start YNR Capture выводит средние значения ROI и экспозицию. meanValue[0] — чёрное поле, meanValue[1] — белое, blackTarget — введённый Black Block Mean Luma, whiteTarget — White Block Mean Luma.

<!-- Source EN PDF p.61, unit 530 -->

b) Если порог препятствует захвату (4-6-2-3), проверьте журнал. Исходник неясно говорит найти «meanValue[0], у которого meanValue[1] только превышает whiteTarget», и задать его как Black Block Mean Luma; meanValue[0] можно чуть повысить против шума (4-6-2-4). Неоднозначное сравнение сохранено и отмечено для проверки, без догадки.

<!-- Source EN PDF p.61, unit 531 -->

![Технический рисунок английского PDF, страница 61](/docs/rockchip-iq-tools/assets/en-p061-figure-01.png)

<!-- Source EN PDF p.61, unit 532 -->

Рисунок 4-6-2-3

<!-- Source EN PDF p.61, unit 533 -->

![Технический рисунок английского PDF, страница 61](/docs/rockchip-iq-tools/assets/en-p061-figure-02.png)

<!-- Source EN PDF p.61, unit 534 -->

Рисунок 4-6-2-4

<!-- Source EN PDF p.62, unit 535 -->

c) Подобрав порог, снова нажмите Start YNR Capture. Получатся Raw с суффиксами Multiple и Single (4-6-2-5).

<!-- Source EN PDF p.62, unit 536 -->

![Технический рисунок английского PDF, страница 62](/docs/rockchip-iq-tools/assets/en-p062-figure-01.png)

<!-- Source EN PDF p.62, unit 537 -->

Рисунок 4-6-2-5

<!-- Source EN PDF p.62, unit 538 -->

9. Яркий Raw: бокс около 800lux, Gain Range 1.0 - 1.0, Exp Range без изменения. Включите Multi-Frame и High-Light. В YNR Capture Black Block Mean Luma начально 60, White Block Mean Luma всегда 255, FrameNumber=32.

<!-- Source EN PDF p.63, unit 539 -->

![Технический рисунок английского PDF, страница 63](/docs/rockchip-iq-tools/assets/en-p063-figure-01.png)

<!-- Source EN PDF p.63, unit 540 -->

Рисунок 4-6-2-6

<!-- Source EN PDF p.63, unit 541 -->

a) После Start YNR Capture каждое изменение экспозиции записывает средние ROI, экспозицию и усиление. meanValue[0] — самое тёмное поле, meanValue[1] — самое яркое; blackTarget/whiteTarget — заданные Black Block Mean Luma/White Block Mean Luma.

<!-- Source EN PDF p.63, unit 542 -->

b) Если при максимальных выдержке и Gain яркое поле не достигает 255 (4-6-2-7), вручную измените яркость бокса и повторите Start YNR Capture. При выполнении условий появятся Multiple/Single Raw (4-6-2-8).

<!-- Source EN PDF p.63, unit 543 -->

![Технический рисунок английского PDF, страница 63](/docs/rockchip-iq-tools/assets/en-p063-figure-02.png)

<!-- Source EN PDF p.63, unit 544 -->

Рисунок 4-6-2-7

<!-- Source EN PDF p.64, unit 545 -->

![Технический рисунок английского PDF, страница 64](/docs/rockchip-iq-tools/assets/en-p064-figure-01.png)

<!-- Source EN PDF p.64, unit 546 -->

Рисунок 4-6-2-8

<!-- Source EN PDF p.64, unit 547 -->

10. Измените Gain Range на 2x и повторяйте 8/9 для всех усилений.

<!-- Source EN PDF p.64, unit 548 -->

11. При росте Gain шум сильнее влияет на порог чёрного; слегка подстраивайте его по журналу.

<!-- Source EN PDF p.65, unit 549 -->

#### 4.6.3 Процесс калибровки

<!-- Source EN PDF p.65, unit 550 -->

GIC & BayerNR и YNR & MFNR используют один набор Raw:

<!-- Source EN PDF p.65, unit 551 -->

1. В Calibration Tool → Edit Options слева сверху задайте размер, разрядность и порядок Bayer.

<!-- Source EN PDF p.65, unit 552 -->

2. На GIC & Bayer NR импортируйте все Raw через Load Raw Files; они появятся снизу.

<!-- Source EN PDF p.65, unit 553 -->

3. Find ROI выделяет градационную мишень (4-6-3-1); прямоугольник должен лежать внутри поля.

<!-- Source EN PDF p.65, unit 554 -->

![Технический рисунок английского PDF, страница 65](/docs/rockchip-iq-tools/assets/en-p065-figure-01.png)

<!-- Source EN PDF p.65, unit 555 -->

Рисунок 4-6-3-1

<!-- Source EN PDF p.65, unit 556 -->

4. Нажмите Calibrate.

<!-- Source EN PDF p.65, unit 557 -->

5. Кривая шума BayerNR появится справа (4-6-3-2).

<!-- Source EN PDF p.65, unit 558 -->

![Технический рисунок английского PDF, страница 65](/docs/rockchip-iq-tools/assets/en-p065-figure-02.png)

<!-- Source EN PDF p.65, unit 559 -->

Рисунок 4-6-3-2

<!-- Source EN PDF p.66, unit 560 -->

6. Нажмите Save.

<!-- Source EN PDF p.66, unit 561 -->

7. На YNR&MFNR импортируйте Raw через Load Raw Files, они появятся снизу.

<!-- Source EN PDF p.66, unit 562 -->

8. Calculate YUV преобразует Raw в YUV симулятором.

<!-- Source EN PDF p.66, unit 563 -->

9. Нажмите Calibrate; предварительно включите YNRCurve Print для сохранения параметров и выборок каждого iso.

<!-- Source EN PDF p.66, unit 564 -->

10. Кривая шума YNR появится справа (4-6-3-3).

<!-- Source EN PDF p.66, unit 565 -->

11. Нажмите Save.

<!-- Source EN PDF p.66, unit 566 -->

![Технический рисунок английского PDF, страница 66](/docs/rockchip-iq-tools/assets/en-p066-figure-01.png)

<!-- Source EN PDF p.66, unit 567 -->

Рисунок 4-6-3-3

<!-- Source EN PDF p.66, unit 568 -->

Если кривая сильно отличается от 4-6-3-3, возможно неверна яркость светлых/тёмных кадров. Ошибка слева указывает на тёмные, справа — на яркие. Слишком высокая/низкая цветовая температура может нарушить Calculate YUV. Если минимальная яркость бокса слишком велика, используйте ослабляющую свет плёнку.

<!-- Source EN PDF p.67, unit 569 -->

### 4.7 FEC/LDCH

<!-- Source EN PDF p.67, unit 570 -->

FEC/LDCH требует map table с координатами изображения x/y после понижения дискретизации. Для её получения нужны параметры объектива, набор снимков шахматной мишени и инструмент калибровки.

<!-- Source EN PDF p.67, unit 571 -->

#### 4.7.1 Требования к изображениям

<!-- Source EN PDF p.67, unit 572 -->

Размер шахматной мишени может меняться; поддерживаются только jpg, bmp, png. Способ 1: одна мишень в кадре, выше точность, рекомендуется. Способ 2: n мишеней в кадре, для удобства n=4.

<!-- Source EN PDF p.67, unit 573 -->

1. Подготовка

(1) Используйте стандартную мишень. При самостоятельной печати соблюдайте фактический размер, плоскостность и желательно закрепите на ровной доске. Числа горизонтальных и вертикальных клеток должны различаться для распознавания направления.

(2) Освещение умеренное: все ракурсы чёткие, без бликов и размытия. На всём протяжении фиксируйте диафрагму и фокусное расстояние, сохраняя световой поток и фокусное расстояние.

<!-- Source EN PDF p.67, unit 574 -->

2. Правила съёмки

(1) Мишень занимает примерно 1/4–1/8 поля зрения.

(2) Все кадры должны покрывать поле зрения; обычно около 15. Слишком мало кадров снижает точность. На каждой позиции снимайте 3–4 для отбора и замены неудачных.

(3) Распределяйте мишень по всем областям и углам (исходник ссылается на 2-1). При съёмке краёв приближайте её к границе, но не выводите за кадр.

(4) Используйте разные наклоны, не только параллельные плоскости объектива.

<!-- Source EN PDF p.68, unit 575 -->

3. Пример съёмки

<!-- Source EN PDF p.68, unit 576 -->

Два способа: (1) рекомендуемый способ 1 — четыре кадра с мишенью сверху слева/справа и снизу слева/справа, в любом порядке.

<!-- Source EN PDF p.68, unit 577 -->

![Технический рисунок английского PDF, страница 68](/docs/rockchip-iq-tools/assets/en-p068-figure-01.png)

<!-- Source EN PDF p.68, unit 578 -->

![Технический рисунок английского PDF, страница 68](/docs/rockchip-iq-tools/assets/en-p068-figure-02.png)

<!-- Source EN PDF p.68, unit 579 -->

![Технический рисунок английского PDF, страница 68](/docs/rockchip-iq-tools/assets/en-p068-figure-03.png)

<!-- Source EN PDF p.69, unit 580 -->

![Технический рисунок английского PDF, страница 69](/docs/rockchip-iq-tools/assets/en-p069-figure-01.png)

<!-- Source EN PDF p.69, unit 581 -->

Рисунок 4-7-1-1

<!-- Source EN PDF p.69, unit 582 -->

(2) Способ 2: один кадр с мишенями во всех четырёх углах.

<!-- Source EN PDF p.69, unit 583 -->

![Технический рисунок английского PDF, страница 69](/docs/rockchip-iq-tools/assets/en-p069-figure-02.png)

<!-- Source EN PDF p.69, unit 584 -->

Рисунок 4-7-1-2

<!-- Source EN PDF p.70, unit 585 -->

#### 4.7.2 Процесс калибровки

<!-- Source EN PDF p.70, unit 586 -->

![Технический рисунок английского PDF, страница 70](/docs/rockchip-iq-tools/assets/en-p070-figure-01.png)

<!-- Source EN PDF p.70, unit 587 -->

Рисунок 4-7-2-1

<!-- Source EN PDF p.70, unit 588 -->

1. В Raw Options задайте разрешение; Bit и Bayer Pattern не нужны.

<!-- Source EN PDF p.70, unit 589 -->

2. Импортируйте каталог jpg, bmp, png.

<!-- Source EN PDF p.70, unit 590 -->

3. Настройте параметры калибровки.

<!-- Source EN PDF p.70, unit 591 -->

a) Square Size: реальный размер клетки, обычно 30mm либо 25mm.

<!-- Source EN PDF p.70, unit 592 -->

b) Horizontal/Vertical: число внутренних углов по горизонтали/вертикали.

<!-- Source EN PDF p.70, unit 593 -->

c) Check Board Number: число мишеней на изображении, 1 либо 4.

<!-- Source EN PDF p.70, unit 594 -->

d) Level: 256 уровней коррекции. Level = 0 не корректирует, выход равен входу; Level = 255 — максимальная коррекция LDCH.

<!-- Source EN PDF p.70, unit 595 -->

e) Correct Direction для FEC: i. Только Correct X — горизонталь, подобно LDCH; ii. Только Correct Y — вертикаль; iii. Оба — обе оси.

<!-- Source EN PDF p.70, unit 596 -->

4. Нажмите Calibrate.

<!-- Source EN PDF p.70, unit 597 -->

5. Сохраните результат.

<!-- Source EN PDF p.71, unit 598 -->

Различие углов и внутренних углов см. 4-7-2-2. В примере 12 клеток по горизонтали и 9 по вертикали: горизонтальных углов 13, внутренних 11. Поэтому Horizontal = 11, Vertical = 8.

<!-- Source EN PDF p.71, unit 599 -->

![Технический рисунок английского PDF, страница 71](/docs/rockchip-iq-tools/assets/en-p071-figure-01.png)

<!-- Source EN PDF p.71, unit 600 -->

Рисунок 4-7-2-2: углы и внутренние углы

<!-- Source EN PDF p.71, unit 601 -->

Углы включают красные и зелёные, внутренние — только красные.

<!-- Source EN PDF p.71, unit 602 -->

Примечания:

<!-- Source EN PDF p.71, unit 603 -->

1. Проверьте каталог result рядом с Calibration Tool; при отсутствии создайте.

<!-- Source EN PDF p.71, unit 604 -->

2. Внешнее кольцо также участвует в расчёте; при съёмке его чёрные/белые клетки не должны полностью скрываться предпросмотром.

<!-- Source EN PDF p.71, unit 605 -->

3. Горизонтальные углы: число чёрно-белых клеток по горизонтали минус 1.

<!-- Source EN PDF p.71, unit 606 -->

4. Вертикальные углы: число чёрно-белых клеток по вертикали минус 1.

<!-- Source EN PDF p.71, unit 607 -->

5. FEC по умолчанию корректирует обе оси; направление выбирается при калибровке.

<!-- Source EN PDF p.71, unit 608 -->

6. Каталог изображений лучше назвать по сенсору + объективу/фокусному расстоянию + разрешению; по этому имени создаётся каталог калибровки.

<!-- Source EN PDF p.72, unit 609 -->

#### 4.7.3 Примеры результатов

<!-- Source EN PDF p.72, unit 610 -->

1. Неудача обычно связана с нечёткой мишенью и неверными/неполными углами. Проверьте каждый кадр; полностью распознанных должно быть минимум 3.

<!-- Source EN PDF p.72, unit 611 -->

2. Успех показан на 4-7-3-1. Шесть параметров в log слева сверху вниз: центр cx, cy и искажения a0, a2, a3, a4.

<!-- Source EN PDF p.72, unit 612 -->

3. В result просмотрите углы каждого кадра. Удалите неточные изображения и повторите калибровку. Таблицы FEC/LDCH находятся в соответствующем подкаталоге result.

<!-- Source EN PDF p.72, unit 613 -->

![Технический рисунок английского PDF, страница 72](/docs/rockchip-iq-tools/assets/en-p072-figure-01.png)

<!-- Source EN PDF p.72, unit 614 -->

Рисунок 4-7-3-1

<!-- Source EN PDF p.73, unit 615 -->

## 5 Интерактивная настройка

<!-- Source EN PDF p.73, unit 616 -->

### 5.1 Интерфейс настройки

<!-- Source EN PDF p.73, unit 617 -->

![Технический рисунок английского PDF, страница 73](/docs/rockchip-iq-tools/assets/en-p073-figure-01.png)

<!-- Source EN PDF p.73, unit 618 -->

Рисунок 5-1-1: основной интерфейс RKISP Tuner v2

<!-- Source EN PDF p.73, unit 619 -->

На 5-1-1 типичное состояние после загрузки UI и IQ. Значения номеров:

<!-- Source EN PDF p.73, unit 620 -->

1. Дерево: normal: day сверху — выбранная сцена IQ; normal — основная, day — подсцена.

<!-- Source EN PDF p.73, unit 621 -->

2. Модули ISP: сцена содержит модули, модули — страницы.

<!-- Source EN PDF p.73, unit 622 -->

3. Страница: узел модуля включает страницы с блоками настройки.

<!-- Source EN PDF p.73, unit 623 -->

4. Блок: например InitExp с 5 числовыми параметрами.

<!-- Source EN PDF p.73, unit 624 -->

5. Кнопки блока читают/записывают все его параметры онлайн.

<!-- Source EN PDF p.74, unit 625 -->

6. Автозапись: при соединении с rkaiq_tool_server каждое изменение немедленно передаётся устройству и применяется.

<!-- Source EN PDF p.74, unit 626 -->

7. Кнопки страницы/модуля читают и записывают их целиком.

<!-- Source EN PDF p.74, unit 627 -->

8. Undo/Redo отменяет последнее изменение; при AutoWrite устройство синхронизируется.

<!-- Source EN PDF p.74, unit 628 -->

9. Поиск страницы параметра по ключевому слову.

<!-- Source EN PDF p.74, unit 629 -->

### 5.2 Платформа и сеть

<!-- Source EN PDF p.74, unit 630 -->

При первом запуске либо через Project → Network and Platform Settings откройте настройки платформы/сети.

<!-- Source EN PDF p.74, unit 631 -->

![Технический рисунок английского PDF, страница 74](/docs/rockchip-iq-tools/assets/en-p074-figure-01.png)

<!-- Source EN PDF p.74, unit 632 -->

Рисунок 5-2-1

<!-- Source EN PDF p.74, unit 633 -->

1. Platform Setting загружает UI выбранного SoC; соответствия записаны в config/config.ini.

<!-- Source EN PDF p.74, unit 634 -->

2. Network Config задаёт адрес; порт 5543 без особой причины не меняйте.

<!-- Source EN PDF p.74, unit 635 -->

Connect подключается к rkaiq_tool_server устройства; сервис должен работать.

<!-- Source EN PDF p.75, unit 636 -->

### 5.3 Регистры и параметры алгоритмов

<!-- Source EN PDF p.75, unit 637 -->

Блоки содержат регистры или параметры алгоритмов. По форме и диапазону используются четыре вида элементов:

<!-- Source EN PDF p.75, unit 638 -->

1. Число: целое либо вещественное с диапазоном; ввод напрямую, стрелки или ползунок справа.

<!-- Source EN PDF p.75, unit 639 -->

![Технический рисунок английского PDF, страница 75](/docs/rockchip-iq-tools/assets/en-p075-figure-01.png)

<!-- Source EN PDF p.75, unit 640 -->

Рисунок 5-3-1

<!-- Source EN PDF p.75, unit 641 -->

2. Boolean: 0/1 для переключателей, Enable = 1, Disable = 0.

<!-- Source EN PDF p.75, unit 642 -->

![Технический рисунок английского PDF, страница 75](/docs/rockchip-iq-tools/assets/en-p075-figure-02.png)

<!-- Source EN PDF p.75, unit 643 -->

Рисунок 5-3-2

<!-- Source EN PDF p.75, unit 644 -->

3. Список: предустановленные режимы, ISO, Day/Night, LCG/HCG.

<!-- Source EN PDF p.75, unit 645 -->

![Технический рисунок английского PDF, страница 75](/docs/rockchip-iq-tools/assets/en-p075-figure-03.png)

<!-- Source EN PDF p.75, unit 646 -->

Рисунок 5-3-3

<!-- Source EN PDF p.75, unit 647 -->

4. Таблица: матрица NxM целых/вещественных элементов; открывается Show data либо Enter Array Table.

<!-- Source EN PDF p.75, unit 648 -->

![Технический рисунок английского PDF, страница 75](/docs/rockchip-iq-tools/assets/en-p075-figure-04.png)

<!-- Source EN PDF p.75, unit 649 -->

Рисунок 5-3-4

<!-- Source EN PDF p.76, unit 650 -->

### 5.4 Интерактивная настройка Gamma

<!-- Source EN PDF p.76, unit 651 -->

#### 5.4.1 Визуальная настройка Gamma

<!-- Source EN PDF p.76, unit 652 -->

1. На GammaTuningPara нажмите Edit Curve параметра Gamma_Curve (5-4-1-1).

<!-- Source EN PDF p.76, unit 653 -->

![Технический рисунок английского PDF, страница 76](/docs/rockchip-iq-tools/assets/en-p076-figure-01.png)

<!-- Source EN PDF p.76, unit 654 -->

Рисунок 5-4-1-1: интерфейс Gamma

<!-- Source EN PDF p.76, unit 655 -->

2. Функции интерфейса 5-4-1-2:

<!-- Source EN PDF p.76, unit 656 -->

1) Кривая: перетаскивайте красные точки; AutoWrite немедленно передаёт изменения плате.

<!-- Source EN PDF p.76, unit 657 -->

2) Curve Coeff создаёт Gamma по коэффициенту. Изменение автоматически генерирует кривую и может перезаписать ручную.

<!-- Source EN PDF p.76, unit 658 -->

3. Position Control: наведите на точку для обновления X/Y; Y вводится вручную.

<!-- Source EN PDF p.76, unit 659 -->

4. Control Point Number: число точек 49, 45, 24, 13.

<!-- Source EN PDF p.76, unit 660 -->

5. Axis Range меняет масштаб X/Y, особенно для плотных узлов тёмной области.

<!-- Source EN PDF p.76, unit 661 -->

6. Export/Import сохраняет кривые Gamma в файл и читает из файла.

<!-- Source EN PDF p.77, unit 662 -->

![Технический рисунок английского PDF, страница 77](/docs/rockchip-iq-tools/assets/en-p077-figure-01.png)

<!-- Source EN PDF p.77, unit 663 -->

Рисунок 5-4-1-2: визуальная настройка Gamma

<!-- Source EN PDF p.77, unit 664 -->

#### 5.4.2 Настройка кривой Gamma

<!-- Source EN PDF p.77, unit 665 -->

Синяя кривая исходная, красная текущая. Над красной точкой указатель становится стрелками вверх/вниз; перетаскивание меняет кривую (5-4-2-1).

<!-- Source EN PDF p.77, unit 666 -->

![Технический рисунок английского PDF, страница 77](/docs/rockchip-iq-tools/assets/en-p077-figure-02.png)

<!-- Source EN PDF p.77, unit 667 -->

Рисунок 5-4-2-1: кривая после перемещения

<!-- Source EN PDF p.78, unit 668 -->

Измените Gamma Coeff в Curve Coeff на 1.5 и нажмите Enter для новой кривой (5-4-2-2).

<!-- Source EN PDF p.78, unit 669 -->

![Технический рисунок английского PDF, страница 78](/docs/rockchip-iq-tools/assets/en-p078-figure-01.png)

<!-- Source EN PDF p.78, unit 670 -->

Рисунок 5-4-2-2: кривая по коэффициенту

<!-- Source EN PDF p.79, unit 671 -->

## 6 Другие функции

<!-- Source EN PDF p.79, unit 672 -->

### 6.1 Импорт IQ-файла

<!-- Source EN PDF p.79, unit 673 -->

Выберите File Transfer → Send File To Device, IQ-файл и путь на устройстве, затем Send. После передачи файл находится в указанном месте (6-1-1).

<!-- Source EN PDF p.79, unit 674 -->

![Технический рисунок английского PDF, страница 79](/docs/rockchip-iq-tools/assets/en-p079-figure-01.png)

<!-- Source EN PDF p.79, unit 675 -->

Рисунок 6-1-1: путь передачи

<!-- Source EN PDF p.79, unit 676 -->

![Технический рисунок английского PDF, страница 79](/docs/rockchip-iq-tools/assets/en-p079-figure-02.png)

<!-- Source EN PDF p.79, unit 677 -->

Рисунок 6-1-2: передача успешна

<!-- Source EN PDF p.79, unit 678 -->

### 6.2 Автономная симуляция Raw

<!-- Source EN PDF p.79, unit 679 -->

Функция отправляет Raw обратно на плату для обработки ISP.

<!-- Source EN PDF p.79, unit 680 -->

1. File → Send RAW Image To Device открывает настройки.

<!-- Source EN PDF p.80, unit 681 -->

![Технический рисунок английского PDF, страница 80](/docs/rockchip-iq-tools/assets/en-p080-figure-01.png)

<!-- Source EN PDF p.80, unit 682 -->

Рисунок 6-2-1: конфигурация Raw

<!-- Source EN PDF p.80, unit 683 -->

2. Add загружает Raw-файлы.

<!-- Source EN PDF p.80, unit 684 -->

![Технический рисунок английского PDF, страница 80](/docs/rockchip-iq-tools/assets/en-p080-figure-02.png)

<!-- Source EN PDF p.80, unit 685 -->

Рисунок 6-2-2: загрузка Raw

<!-- Source EN PDF p.80, unit 686 -->

Поддерживается только .rkraw с данными compact+align256. Другие форматы конвертируются пакетно RKRAW Tool. При захвате задайте RKRawV2=1 в config.ini. Исходник ссылается на 3.7.2 для Raw, но Raw находится в 3.7.3; ошибка отмечена.

<!-- Source EN PDF p.81, unit 687 -->

3. Send передаёт Raw устройству и создаёт конфигурацию в /tmp.

<!-- Source EN PDF p.81, unit 688 -->

![Технический рисунок английского PDF, страница 81](/docs/rockchip-iq-tools/assets/en-p081-figure-01.png)

<!-- Source EN PDF p.81, unit 689 -->

Рисунок 6-2-3: передача Raw устройству

<!-- Source EN PDF p.81, unit 690 -->

5. Не закрывая окно, перезапустите камеру. Обнаружив конфигурацию, устройство перейдёт в автономную симуляцию. Шаг 4 отсутствует в исходнике; нумерация сохранена с примечанием.

<!-- Source EN PDF p.81, unit 691 -->

6. Run запускает симуляцию.

<!-- Source EN PDF p.81, unit 692 -->

7. Raw поочерёдно поступают в ISP, обработанные изображения видны в камере. Поддерживаются интерактивное чтение/запись параметров и захват YUV.

<!-- Source EN PDF p.81, unit 693 -->

8. Для замены Raw:

<!-- Source EN PDF p.81, unit 694 -->

1) Stop приостанавливает симуляцию.

<!-- Source EN PDF p.81, unit 695 -->

2) Add загружает Raw.

<!-- Source EN PDF p.81, unit 696 -->

3) Send передаёт Raw.

<!-- Source EN PDF p.81, unit 697 -->

4) Run запускает автономную симуляцию.

{% endraw %}
