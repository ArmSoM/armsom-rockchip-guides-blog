---
title: "Руководство Rockchip DDR: частота, ёмкость, проверка, глазковые диаграммы и ECC"
description: "Полный технический материал Rockchip DDR V2.7.2: разработка, диагностика, проверка памяти, глазковые диаграммы, пропускная способность, контроль пайки и HAL ECC."
translation_key: "037-rockchip-ddr"
slug: "037-rockchip-ddr"
lang: "ru"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["DDR", "ECC", "RK3588", "RK3576", "Rockchip"]
keywords: "ArmSoM Rockchip DDR LPDDR4 LPDDR5 ECC RK3588 RK3576"
excerpt: "Полный технический материал Rockchip DDR V2.7.2: разработка, диагностика, проверка памяти, глазковые диаграммы, пропускная способность, контроль пайки и HAL ECC."
---

{% raw %}

# Руководство Rockchip DDR: частота, ёмкость, проверка, глазковые диаграммы и ECC

Это справочный материал по платформе на основе Rockchip DDR V2.7.2, а не отчёт об испытаниях ArmSoM и не гарантия поддержки всех возможностей каждой платой. Исходник охватывает несколько поколений SoC, Linux 3.0/3.10/4.4 и последующие ядра, Android, U-Boot, loader, Trust/ATF и HAL. Необходимо проверить конкретную плату, микросхемы DRAM и разводку, SoC, ветку SDK/BSP, DDR bin, Trust и ядро. Адаптация к платам ArmSoM аппаратно не проверялась.

Китайская статья следует китайскому PDF из 110 страниц, английская — английскому PDF из 115 страниц. Русская статья полностью переводит английский технический текст. Версия обоих источников — V2.7.2. Только английский исходник содержит §6.2.1 о настройке английского интерфейса, поэтому номера последующих подразделов главы 6 сдвинуты. Расхождения в расчётах ёмкости, обозначениях глазковых диаграмм, версиях и путях явно сохранены по месту и в [редакционных записях](/docs/rockchip-ddr/EDITORIAL-NOTES.md), без скрытого объединения.

**Риск операций:** прошивка, изменение напряжения/частоты/ёмкости, удаление RZQ, инъекция ошибок ECC и стресс-тесты памяти могут повредить оборудование или данные либо вызвать перезапуск. Команды и отладочные значения вроде 1.6V — примеры исходника, а не рекомендации для произвольной платы ArmSoM. Проверьте документацию DRAM, схему, электрические пределы и соответствующий SDK; сохраните резервные копии и используйте контролируемое испытательное оборудование. Аппаратные команды не выполнялись. Наблюдения и измерения принадлежат исходнику. Указание путей инструментов и ресурсов не означает, что эти двоичные файлы поставляются с сайтом.

Официальные ресурсы: [документация ArmSoM](https://docs.armsom.org/), [Rockchip Linux](https://github.com/rockchip-linux), [rkbin](https://github.com/rockchip-linux/rkbin).

Предисловие посвящено разработке DDR SDRAM для всех SoC Rockchip. Таблица версий исходника указывает «Все SoC / Все версии ядра». Это заявленная область документа, а не подтверждённая совместимость всех сочетаний.

| SoC | Версия ядра |
|---|---|
| Все SoC | Все версии ядра |

<!-- Source EN PDF p.7, block 0 -->

## 1. Глава 1. Руководство разработчика DDR: частые вопросы

<!-- Source EN PDF p.7, block 1 -->

### 1.1 Как читать журнал DDR

<!-- Source EN PDF p.7, block 2 -->

Журнал DDR включает сообщения загрузчика loader и ядра. Сообщения loader разбираются ниже:

<!-- Source EN PDF p.7, block 3 -->

```text
DDR Version 1.05 20170712//Version information of the DDR initialization code used to check
the version. From this line, you have entered the DDR initialization code.
In
SRX //If it prints SRX, means hot restart; without SRX, it means that it is cold boot. While
some chipset does not have this feature, there will not show SRX.
Channel a: DDR3 400MHz //The following log are the details of the DDR capacity. For more
explanation,please see the chapter"How to Check the Capacity of DDR".
Bus Width=32 Col=10 Bank=8 Row=15 CS=1 Die Bus-Width=16 Size=1024MB
Channel b: DDR3 400MHz
Bus Width=32 Col=10 Bank=8 Row=15 CS=1 Die Bus-Width=16 Size=1024MB
Memory OK //This is the result of DDR self-test, the first "Memroy OK" is the self-test
result of Channel a.
Memory OK //It is the self-test result of Channel b.If Channel a or b shows an error,
turning out that something wrong with the welding; no error, indicating that the current
self-test is good.But whether the entire DDR can work stably or not,also depends on the
subsequent stages of operation results.
OUT //After this line, the DDR initialization code is exited.
```

<!-- Source EN PDF p.7, block 4 -->

Ниже приведён журнал DDR для kernel 3.0 и kernel 3.10:

<!-- Source EN PDF p.7, block 5 -->

```text
[ 0.528564] DDR DEBUG: version 1.00 20150126 //Version information
[ 0.528690] DDR DEBUG: Channel a: //The details of the DDR capacity
[ 0.528701] DDR DEBUG: DDR3 Device
[ 0.528716] DDR DEBUG: Bus Width=32 Col=10 Bank=8 Row=15 CS=1 Total Capability=1024MB
[ 0.528727] DDR DEBUG: Channel b:
[ 0.528736] DDR DEBUG: DDR3 Device
[ 0.528750] DDR DEBUG: Bus Width=32 Col=10 Bank=8 Row=15 CS=1 Total Capability=1024MB
//The following information about DDR specialize for DDR engineer debug, please ignore it.
//After "DDR DEBUG" print end, which means DDR initialization finishes in kernel.
```

<!-- Source EN PDF p.7, block 6 -->

В kernel 3.10 также выводятся следующие сообщения модуля изменения частоты DDR.

<!-- Source EN PDF p.8, block 7 -->

```text
[ 1.473637] ddrfreq: verion 1.2 20140526 //DDR frequency scaling module version
[ 1.473653] ddrfreq: normal 396MHz video_1080p 240MHz video_4k 396MHz dualview 396MHz
idle 0MHz suspend 200MHz reboot 396MHz //The frequencies which read from dts table are
corresponding to the different scenarios.
[ 1.473661] ddrfreq: auto-freq=1 //This line reflects load scaling functon is enable or
not,"1" means on,"0" means off.
[ 1.473667] ddrfreq: auto-freq-table[0] 240MHz //the table of the load scaling
[ 1.473673] ddrfreq: auto-freq-table[1] 324MHz
[ 1.473678] ddrfreq: auto-freq-table[2] 396MHz
[ 1.473683] ddrfreq: auto-freq-table[3] 528MHz
//If crash or block in this print porcedure,it is most likely DDR frequency scaling bug.
```

<!-- Source EN PDF p.8, block 8 -->

В версиях после kernel 3.10 сведения об объёме DDR больше не печатаются ядром.

<!-- Source EN PDF p.8, block 9 -->

### 1.2 Как включить DDR bin Rockchip в готовый к использованию loader

<!-- Source EN PDF p.8, block 10 -->

1\. Поместите DDR bin в соответствующий каталог `rk\rkbin\bin\` проекта U-Boot.

<!-- Source EN PDF p.8, block 11 -->

2\. Удалите прежний файл DDR bin.

<!-- Source EN PDF p.8, block 12 -->

3\. Переименуйте новый DDR bin, присвоив ему имя удалённого файла.

<!-- Source EN PDF p.8, block 13 -->

4\. Соберите U-Boot (см. `Rockchip-Developer-Guide-UBoot-nextdev.pdf`); будет создан соответствующий файл loader.

<!-- Source EN PDF p.8, block 14 -->

5\. По журналу loader проверьте, что он действительно обновлён.

<!-- Source EN PDF p.8, block 15 -->

Каталоги DDR bin для разных платформ:

<!-- Source EN PDF p.9, block 16 -->

| SoC | Путь | Примечание |
|---|---|---|
| PX30 | rk\rkbin\bin\rk33\px30_ddr_333MHz_vX.XX.bin |  |
| PX3SE | rk\rkbin\bin\rk31\px3se_ddr_300MHz_vX.XX_uartX.bin |  |
| RK1808 | rk\rkbin\bin\rk1x\rk1808_ddr_XXXMHz_vX.XX.bin |  |
| RK3036 | rk\rkbin\bin\rk30\rk3036_ddr_XXXMHz_vX.XX.bin | 1 |
| RK3126<br>RK3126B<br>RK3126C | rk\rkbin\bin\rk31\rk3126_ddr3_300MHz_vX.XX.bin |  |
| RK3128 | rk\rkbin\bin\rk31\rk3128_ddr_300MHz_vX.XX.bin |  |
| RK3288 | rk\rkbin\bin\rk32\rk3288_ddr_400MHz_vX.XX.bin |  |
| RK322x | rk\rkbin\bin\rk32\rk322x_ddr_XXXMHz_vX.XX.bin |  |
| RK322xh | rk\rkbin\bin\rk33\rk322xh_ddr_333MHz_vX.XX.bin |  |
| RK3308 | rk\rkbin\bin\rk33\rk3308_ddr_XXXMHz_uartX_mX_vX.XX.bin |  |
| RK3326 | rk\rkbin\bin\rk33\rk3326_ddr_333MHz_vX.XX.bin |  |
| RK3328 | rk\rkbin\bin\rk33\rk3328_ddr_XXXMHz_vX.XX.bin |  |
| RK3368 | rk\rkbin\bin\rk33\rk3368_ddr_600MHz_vX.XX.bin |  |
| RK3399 | rk\rkbin\bin\rk33\rk3399_ddr_XXXMHz_vX.XX.bin | 2 |
| RK3399PRO | rk\rkbin\bin\rk33\rk3399pro_ddr_XXXMHz_vX.XX.bin |  |
| RK3528 | rk\rkbin\bin\rk35\rk3528_ddr_XXXMHz_vX.XX.bin | 3 |
| RK3562 | rk\rkbin\bin\rk35\rk3562_ddr_XXXMHz_vX.XX.bin |  |
| RK3566 | rk\rkbin\bin\rk35\rk3566_ddr_XXXMHz_vX.XX.bin |  |
| RK3568 | rk\rkbin\bin\rk35\rk3568_ddr_XXXMHz_vX.XX.bin |  |
| RK3576 | rk\rkbin\bin\rk35\rk3576_ddr_lp4_XXXXMHz_lp5_XXXXMHz_vX.XX.bin |  |
| RK3588 | rk\rkbin\bin\rk35\rk3588_ddr_lp4_XXXXMHz_lp5_XXXXMHz_vX.XX.bin |  |
| RV1106 | rk\rkbin\bin\rv11\rv1106_ddr_XXXMHz_vX.XX.bin |  |
| RV1108 | rk\rkbin\bin\rv11\rv1108_ddr_vX.XX.bin |  |
| RV1126 | rk\rkbin\bin\rv11\rv1126_ddr_XXXMHz_vX.XX.bin |  |
| Новые платформы | Размещаются в rk\rkbin\bin по аналогичному правилу именования; их можно найти самостоятельно |  |

<!-- Source EN PDF p.9, block 17 -->

Примечание 1: используемая частота задаётся в `rk\rkbin\RKBOOT\RK3036_ECHOMINIALL.ini` или `RK3036MINIALL.ini`. Первый файл предназначен для изделий ECHO; остальные изделия RK3036 используют `RK3036MINIALL.ini`. Способ определения устройства ECHO исходник предлагает уточнять у подразделения системных продуктов Rockchip.

<!-- Source EN PDF p.9, block 18 -->

Примечание 2: используемая частота задаётся файлом `rk\rkbin\RKBOOT\RK3399MINIALL.ini`.

<!-- Source EN PDF p.9, block 19 -->

Примечание 3: вариант RK3528 предназначен для платы не с двумя слоями и DDR не с организацией 4BIT. Для двухслойной PCB или DDR 4BIT см. следующий раздел об особых вариантах DDR bin.

<!-- Source EN PDF p.10, block 20 -->

Примечание 4: файлы новых платформ размещаются в `rk\rkbin\bin\` по аналогичному правилу именования; их можно найти самостоятельно.

<!-- Source EN PDF p.10, block 21 -->

### 1.3 Платформы с четырьмя частотами в DDR bin

<!-- Source EN PDF p.10, block 22 -->

DDR bin перечисленных ниже платформ содержит четыре частоты DDR. Наибольшая отражена в имени файла: например, в `rv1126_ddr_924MHz_v1.05.bin` последняя частотная точка — 924M.

<!-- Source EN PDF p.10, block 23 -->

В ядре можно использовать только эти четыре частоты. Для их изменения см. раздел «Изменение DDR bin».

<!-- Source EN PDF p.10, block 24 -->

Обычно по умолчанию используются следующие четыре частоты:

<!-- Source EN PDF p.10, block 25 -->

| Платформа | Файл | Частоты в файле (MHz) |
|---|---|---|
| RK3528 | rk3528_ddr_XXXMHz_vX.XX.bin | 324,528,780 и частота из имени файла |
| RK3562 | rk3562_ddr_XXXMHz_vX.XX.bin | 324,528,780 и частота из имени файла |
| RK3566 | rk3566_ddr_XXXMHz_vX.XX.bin | 324,528,780 и частота из имени файла |
| RK3568 | rk3568_ddr_XXXMHz_vX.XX.bin | 324,528,780 и частота из имени файла |
| RK3576 | rk3576_ddr_lp4_XXXXMHz_lp5_XXXXMHz_vX.XX.bin | LP4/LP4X:528,1068,1560 и частота из имени файла<br>LP5/LP5X:534,1320,1968 и частота из имени файла |
| RK3588 | rk3588_ddr_lp4_XXXXMHz_lp5_XXXXMHz_vX.XX.bin | LP4/LP4X:528,1068,1560 и частота из имени файла<br>LP5/LP5X:534,1320,1968 и частота из имени файла |
| RV1126 | rv1126_ddr_XXXMHz_vX.XX.bin | 328,528,784 и частота из имени файла |

<!-- Source EN PDF p.10, block 26 -->

Эти четыре точки можно увидеть в журнале последовательного порта loader:

<!-- Source EN PDF p.10, block 27 -->

```text
DDR ... v1.14
LPDDR4X, 2112MHz
channel[0] BW=16 Col=10 Bk=8 CS0 Row=16/0 CS1 Row=16/0 CS=2 Die BW=16 Size=2048MB
channel[1] BW=16 Col=10 Bk=8 CS0 Row=16/0 CS1 Row=16/0 CS=2 Die BW=16 Size=2048MB
channel[2] BW=16 Col=10 Bk=8 CS0 Row=16/0 CS1 Row=16/0 CS=2 Die BW=16 Size=2048MB
channel[3] BW=16 Col=10 Bk=8 CS0 Row=16/0 CS1 Row=16/0 CS=2 Die BW=16 Size=2048MB
...
change to F1: 528MHz /* 4 DDR frequencies */
change to F2: 1068MHz
change to F3: 1560MHz
change to F0: 2112MHz
out
```

<!-- Source EN PDF p.10, block 28 -->

Также текущие четыре частоты можно прочитать инструментом `rkbin/tools/ddrbin_tool`, например:

<!-- Source EN PDF p.10, block 29 -->

```text
./ddrbin_tool px30 -g gen_param.txt px30_ddr_333MHz_v1.15.bin
```

<!-- Source EN PDF p.10, block 30 -->

Подробнее о ddrbin_tool см. его руководство.

<!-- Source EN PDF p.11, block 31 -->

### 1.4 Особые варианты DDR bin

<!-- Source EN PDF p.11, block 32 -->

Некоторые файлы в `rk\rkbin\bin` требуют дополнительных пояснений.

<!-- Source EN PDF p.11, block 33 -->

RK3399

<!-- Source EN PDF p.11, block 34 -->

Разные типы памяти RK3399 поддерживают разные частоты, но имя DDR bin не разделяет их по типу DDR. Это может вызывать путаницу; пояснение приведено ниже.

<!-- Source EN PDF p.11, block 35 -->

| Файл | DDR3/LP3: частота при выходе из loader (MHz) | DDR3/LP3: частоты ядра (MHz) | LP4: частота при выходе из loader (MHz) | LP4: частоты ядра (MHz) |
|---|---|---|---|---|
| rk33\rk3399_ddr_666MHz_v1.30.bin | 666 | <=666 | 416 | 328, 416, 666, 856 |
| rk33\rk3399_ddr_800MHz_v1.30.bin | 800 | <=800 | 856 | 328,416, 666, 856 |
| rk33\rk3399_ddr_933MHz_v1.30.bin | 933 | <=933 | 856 | 328, 416, 666, 856,<br>933 |

<!-- Source EN PDF p.11, block 36 -->

Файлы с суффиксом eyescan

<!-- Source EN PDF p.11, block 37 -->

DDR bin с суффиксом eyescan используется для сборки loader, позволяющего получить двумерную глазковую диаграмму сигнала DDR. Примеры:

<!-- Source EN PDF p.11, block 38 -->

```text
rk\rkbin\bin\rk35\rk3566_ddr_1056MHz_eyescan_v1.16.bin
```

<!-- Source EN PDF p.11, block 39 -->

```text
rk\rkbin\bin\rk35\rk3588_ddr_lp4_2112MHz_lp5_2736MHz_eyescan_v1.11.bin
```

<!-- Source EN PDF p.11, block 40 -->

```text
rk\rkbin\bin\rk35\rk3562_ddr_1332MHz_eyescan_v1.04.bin
```

<!-- Source EN PDF p.11, block 41 -->

```text
rk\rkbin\bin\rk35\rk3568_ddr_1560MHz_eyescan_v1.16.bin
```

<!-- Source EN PDF p.11, block 42 -->

Файлы с суффиксом ultra

<!-- Source EN PDF p.11, block 43 -->

Сверхнизкое энергопотребление для электронных книг; используется совместно с соответствующей аппаратной платформой. Примеры:

<!-- Source EN PDF p.11, block 44 -->

```text
rk\rkbin\bin\rk35\rk3566_ddr_XXXMHz_ultra_v1.10.bin
```

<!-- Source EN PDF p.11, block 45 -->

```text
rk\rkbin\bin\rk35\rk3562_ddr_XXXMHz_ultra_v1.05.bin
```

<!-- Source EN PDF p.11, block 46 -->

Файлы с суффиксом tb

<!-- Source EN PDF p.11, block 47 -->

Предназначены для быстрой загрузки. Необходимо выбрать bin для фактического типа DDR. Примеры:

<!-- Source EN PDF p.11, block 48 -->

```text
rk\rkbin\bin\rv11\rv1126_tpl_XXXMHz_ddr4_tb_v1.08.bin
```

<!-- Source EN PDF p.11, block 49 -->

```text
rk\rkbin\bin\rv11\rv1126_tpl_XXXMHz_ddr3_tb_v1.08.bin
```

<!-- Source EN PDF p.11, block 50 -->

```text
rk\rkbin\bin\rv11\rv1126_tpl_XXXMHz_lp3_tb_v1.08.bin
```

<!-- Source EN PDF p.11, block 51 -->

```text
rk\rkbin\bin\rv11\rv1126_tpl_XXXMHz_lp4_tb_v1.08.bin
```

<!-- Source EN PDF p.11, block 52 -->

Для быстрой загрузки RV1106 с DDR3:

<!-- Source EN PDF p.11, block 53 -->

```text
rk\rkbin\bin\rv11\rv1106_ddr_924MHz_tb_v1.13.bin
```

<!-- Source EN PDF p.12, block 54 -->

Файлы RK3528 с PCB в имени

<!-- Source EN PDF p.12, block 55 -->

Для конструкции DDR 4BIT:

<!-- Source EN PDF p.12, block 56 -->

```text
rk\rkbin\bin\rk35\rk3528_ddr_1056MHz_4BIT_PCB_v1.07.bin
```

<!-- Source EN PDF p.12, block 57 -->

Для двухслойной PCB:

<!-- Source EN PDF p.12, block 58 -->

```text
rk\rkbin\bin\rk35\rk3528_ddr_1056MHz_2L_PCB_v1.07.bin
```

<!-- Source EN PDF p.12, block 59 -->

### 1.5 Изменение DDR bin

<!-- Source EN PDF p.12, block 60 -->

Описанный выше DDR bin инициализирует DDR при загрузке. Инструменты Rockchip позволяют изменить параметры инициализации, частоту DDR, отключить последовательный порт, изменить его скорость и другие параметры.

<!-- Source EN PDF p.12, block 61 -->

rk_ddrBin_tool_windows

<!-- Source EN PDF p.12, block 62 -->

Исходник рекомендует rk_ddrBin_tool_windows: инструмент с графическим интерфейсом, которым проще пользоваться.

<!-- Source EN PDF p.12, block 63 -->

Инструменты доступны по адресу:

<!-- Source EN PDF p.12, block 64 -->

```text
https://redmine.rock-chips.com/documents/49 -> rk_ddrBin_tool_windows_Vx.xx.7z
```

<!-- Source EN PDF p.12, block 65 -->

Обычно имеется несколько архивов. Необходимо скачать их все, затем распаковать.

<!-- Source EN PDF p.12, block 66 -->

Руководство пользователя доступно через меню Help инструмента.

<!-- Source EN PDF p.12, block 67 -->

```text
rkbin/tools/ddrbin_tool
```

<!-- Source EN PDF p.12, block 68 -->

Это инструмент командной строки в проекте rkbin: `rkbin/tools/ddrbin_tool`.

<!-- Source EN PDF p.12, block 69 -->

Документация: `rkbin/tools/ddrbin_tool_user_guide.txt`.

<!-- Source EN PDF p.12, block 70 -->

Часто изменяемые параметры:

<!-- Source EN PDF p.12, block 71 -->

Изменение частоты DDR

<!-- Source EN PDF p.12, block 72 -->

Для SoC, поддерживающих только четыре частоты, см. раздел «Платформы с четырьмя частотами в DDR bin».

<!-- Source EN PDF p.12, block 73 -->

Четыре частоты можно изменить для соответствующего типа DDR. Ниже пример четырёх частот LPDDR4:

<!-- Source EN PDF p.12, block 74 -->

![Технический рисунок исходника — PDF 12](/docs/rockchip-ddr/assets/en-p12-figure1.png)

Редактируемая расшифровка снимка (исходные поля и значения):

| Параметр | Значение | Допустимый диапазон | Unit | Описание |
|---|---|---|---|---|
| lp4_freq | 2112 | 300-2133 | MHz | Начальная частота DDR (FSP_0) |
| lp4_f1_freq_mhz | 528 | 300-2133 | MHz | Частота DDR FSP_1 для переключения |
| lp4_f2_freq_mhz | 1068 | 300-2133 | MHz | Частота DDR FSP_2 для переключения |
| lp4_f3_freq_mhz | 1560 | 300-2133 | MHz | Частота DDR FSP_3 для переключения |

<!-- Source EN PDF p.12, block 75 -->

Изменение последовательного порта

<!-- Source EN PDF p.12, block 76 -->

![Технический рисунок исходника — PDF 12](/docs/rockchip-ddr/assets/en-p12-figure2.png)

Редактируемая расшифровка снимка (исходные поля и значения):

| Параметр | Значение | Допустимый диапазон | Unit | Описание |
|---|---|---|---|---|
| uart id | 0 |  | — | ID UART; 0xf отключает вывод UART |

<!-- Source EN PDF p.12, block 77 -->

Изменение скорости последовательного порта

<!-- Source EN PDF p.13, block 78 -->

![Технический рисунок исходника — PDF 13](/docs/rockchip-ddr/assets/en-p13-figure1.png)

Редактируемая расшифровка снимка (исходные поля и значения):

| Параметр | Значение | Допустимый диапазон | Unit | Описание |
|---|---|---|---|---|
| uart id | 0 |  | — | ID UART; 0xf отключает вывод UART |
| uart iomux | 0 |  | — | IOMUX UART |
| uart baudrate | 1500000 |  | bps | Поддерживает 115200 или 1500000 |

<!-- Source EN PDF p.13, block 79 -->

### 1.6 Изменение частоты DDR в U-Boot

<!-- Source EN PDF p.13, block 80 -->

RK322x

<!-- Source EN PDF p.13, block 81 -->

Следующий способ поддерживается только RK322x. Измените `arch/arm/boot/dts/rk322x.dtsi` в исходниках kernel-3.10.

<!-- Source EN PDF p.13, block 82 -->

```text
dram: dram {
    compatible = "rockchip,rk322x-dram";
    status = "okay";
    dram_freq = <786000000>;
    rockchip,dram_timing = <&dram_timing>;
};
```

<!-- Source EN PDF p.13, block 83 -->

Достаточно изменить dram_freq в приведённом блоке; единица измерения — Hz. Частоту можно выбрать произвольно в рамках исходного способа настройки.

<!-- Source EN PDF p.13, block 84 -->

U-Boot автоматически разбирает DTS, читает значение и устанавливает соответствующую частоту.

<!-- Source EN PDF p.13, block 85 -->

RK3576/RK3588

<!-- Source EN PDF p.13, block 86 -->

Следующий способ поддерживается только RK3576 и RK3588. При инициализации DDR loader настраивает четыре частоты для последующего использования ядром. По умолчанию loader завершает работу на наибольшей частоте, после чего загрузка продолжается.

<!-- Source EN PDF p.13, block 87 -->

F1, F2, F3 и F0 ниже — эти четыре частоты. По умолчанию выход из loader выполняется на F0.

<!-- Source EN PDF p.13, block 88 -->

```text
DDR ... v1.14
LPDDR4X, 2112MHz
channel[0] BW=16 Col=10 Bk=8 CS0 Row=16/0 CS1 Row=16/0 CS=2 Die BW=16 Size=2048MB
channel[1] BW=16 Col=10 Bk=8 CS0 Row=16/0 CS1 Row=16/0 CS=2 Die BW=16 Size=2048MB
channel[2] BW=16 Col=10 Bk=8 CS0 Row=16/0 CS1 Row=16/0 CS=2 Die BW=16 Size=2048MB
channel[3] BW=16 Col=10 Bk=8 CS0 Row=16/0 CS1 Row=16/0 CS=2 Die BW=16 Size=2048MB
...
change to F1: 528MHz /* 4 DDR frequencies */
change to F2: 1068MHz
change to F3: 1560MHz
change to F0: 2112MHz
out
```

<!-- Source EN PDF p.13, block 89 -->

Для изменения частоты DDR в U-Boot достаточно изменить частоту, на которой loader завершает работу.

<!-- Source EN PDF p.14, block 90 -->

В инструменте из раздела «Изменение DDR bin» найдите boot_fsp. Этот параметр выбирает F0/F1/F2/F3 как частоту выхода из loader и тем самым частоту DDR в U-Boot.

<!-- Source EN PDF p.14, block 91 -->

![Технический рисунок исходника — PDF 14](/docs/rockchip-ddr/assets/en-p14-figure1.png)

Редактируемая расшифровка снимка (исходные поля и значения):

| Параметр | Значение | Допустимый диапазон | Unit | Описание |
|---|---|---|---|---|
| boot_fsp | 0 |  | — | Частота DDR при входе в систему после инициализации: 0=fsp0, 1=fsp1, 2=fsp2, 3=fsp3 |

<!-- Source EN PDF p.14, block 92 -->

### 1.7 Включение и отключение изменения частоты DDR в ядре

<!-- Source EN PDF p.14, block 93 -->

Сначала убедитесь, что SoC поддерживает изменение частоты DDR в ядре. Затем включите или отключите его следующим способом.

<!-- Source EN PDF p.14, block 94 -->

Для kernel 4.4 и новее найдите окончательное описание узла dmc в DTS. Значение status = "disabled" отключает изменение частоты, а "okay" включает его.

<!-- Source EN PDF p.14, block 95 -->

Примечание 1: на RK3576 и RK3588 после включения dmc проверьте свойства center-supply и mem-supply согласно реальным соединениям питания изделия. Значения указывают имена узлов регуляторов, питающих модуль DDR на стороне

<!-- Source EN PDF p.14, block 96 -->

SoC и LOGIC соответственно.

<!-- Source EN PDF p.14, block 97 -->

По умолчанию для RK3576: `center-supply = <&vdd_ddr_s0>`, `mem-supply = <&vdd_logic_s0>`.

<!-- Source EN PDF p.14, block 98 -->

По умолчанию для RK3588: `center-supply = <&vdd_ddr_s0>`, `mem-supply = <&vdd_log_s0>`.

<!-- Source EN PDF p.14, block 99 -->

Если этих свойств нет в узле dmc, драйвер dmc не загрузится. Сообщение ядра:

<!-- Source EN PDF p.14, block 100 -->

```text
rockchip-dmc dmc: Cannot get the regulator "center"
```

<!-- Source EN PDF p.14, block 101 -->

Примечание 2: на остальных платформах после включения dmc проверьте center-supply согласно реальным соединениям питания изделия. Значение указывает имя регулятора, питающего DDR-модуль на стороне SoC.

<!-- Source EN PDF p.14, block 102 -->

По умолчанию для RK3399: `center-supply = <&vdd_center>`.

<!-- Source EN PDF p.14, block 103 -->

Для других платформ, например PX30/RK3568/RV1126: `center-supply=<&vdd_logic>`.

<!-- Source EN PDF p.14, block 104 -->

Если этого свойства нет в узле dmc, драйвер dmc не загрузится. Сообщение ядра:

<!-- Source EN PDF p.14, block 105 -->

```text
rockchip-dmc dmc: Cannot get the regulator "center"
```

<!-- Source EN PDF p.14, block 106 -->

Примечание 3: рекомендуется одинаковый status для dfi и dmc. В старом коде dmc зависит от dfi; отключение dfi делает dmc неработоспособным.

<!-- Source EN PDF p.14, block 107 -->

Например, для RK3399 EVB окончательное описание dmc находится в `arch/arm64/boot/dts/rockchip/rk3399-evb.dtsi`.

<!-- Source EN PDF p.15, block 108 -->

```text
&dfi {
    status = "okay";
};
&dmc {
    center-supply = <&vdd_center>; /* This requires the customer to configure it according
to the actual hardware circuit*/
    status = "okay"; /* enable kernel DDR scaling function */
    ...
};
```

<!-- Source EN PDF p.15, block 109 -->

```text
&dfi {
    status = "disabled";
};
&dmc {
    status = "disabled"; /* disable kernel DDR scaling function */
    ...
};
```

<!-- Source EN PDF p.15, block 110 -->

Для kernel 3.10 найдите окончательное описание узла clk_ddr_dvfs_table в DTS. Установите status в "disabled", чтобы отключить изменение частоты, либо в "okay", чтобы включить.

<!-- Source EN PDF p.15, block 111 -->

Например, для платы RK3288 SDK окончательное описание clk_ddr_dvfs_table находится в `arch/arm/boot/dts/rk3288-tb_8846.dts`.

<!-- Source EN PDF p.15, block 112 -->

```text
&clk_ddr_dvfs_table {
    ...
    status="okay"; /* enable kernel DDR scaling function */
};
```

<!-- Source EN PDF p.15, block 113 -->

```text
&clk_ddr_dvfs_table {
    ...
    status="disabled"; /* disable kernel DDR scaling function */
};
```

<!-- Source EN PDF p.15, block 114 -->

Для kernel 3.0 измените dvfs_ddr_table в файле платы borad-\*\*.c: оставьте в таблице только одну частоту DDR_FREQ_NORMAL, чтобы DDR не меняла частоту.

<!-- Source EN PDF p.15, block 115 -->

Например, файл платы RK3066 SDK: `arch/arm/mach-rk30/board-rk30-sdk.c`.

<!-- Source EN PDF p.15, block 116 -->

```text
/* This table enable DDR scaling function */
static struct cpufreq_frequency_table dvfs_ddr_table[] = {
    {.frequency = 200 * 1000 + DDR_FREQ_SUSPEND, .index = 1050 * 1000},
    {.frequency = 300 * 1000 + DDR_FREQ_VIDEO, .index = 1050 * 1000},
    {.frequency = 400 * 1000 + DDR_FREQ_NORMAL, .index = 1125 * 1000},
    {.frequency = CPUFREQ_TABLE_END},
};
/* This table disable DDR scaling function */
static struct cpufreq_frequency_table dvfs_ddr_table[] = {
    //{.frequency = 200 * 1000 + DDR_FREQ_SUSPEND, .index = 1050 * 1000},
    //{.frequency = 300 * 1000 + DDR_FREQ_VIDEO, .index = 1050 * 1000},
    {.frequency = 400 * 1000 + DDR_FREQ_NORMAL, .index = 1125 * 1000},
    {.frequency = CPUFREQ_TABLE_END},
};
```

<!-- Source EN PDF p.16, block 118 -->

### 1.8 Полный запрет изменения частоты DDR, включая инициализацию

<!-- Source EN PDF p.16, block 119 -->

Предыдущий раздел отключает обычное изменение частоты. Однако при включении питания ddr_init может один раз изменить частоту, обновляя тайминги ради повышения производительности. Чтобы запретить и этот переход, кроме действий из предыдущего раздела внесите изменения ниже.

<!-- Source EN PDF p.16, block 120 -->

Для kernel 4.4 и новее

<!-- Source EN PDF p.16, block 121 -->

Достаточно выполнить действия раздела «Включение и отключение изменения частоты DDR в ядре»: переходы отключаются и в ddr_init.

<!-- Source EN PDF p.16, block 122 -->

Для kernel 3.10

<!-- Source EN PDF p.16, block 123 -->

SoC: RK322X.

<!-- Source EN PDF p.16, block 124 -->

Расположение кода: в ядре соответствующего кода нет.

<!-- Source EN PDF p.16, block 125 -->

Способ: достаточно отключить узел dram, установив "disabled".

<!-- Source EN PDF p.16, block 126 -->

```text
dram: dram {
    compatible = "rockchip,rk322x-dram";
    status = "disabled"; /* Please,modify here! */
    dram_freq = <786000000>;
    rockchip,dram_timing = <&dram_timing>;
};
```

<!-- Source EN PDF p.16, block 127 -->

SoC: RK3188.

<!-- Source EN PDF p.16, block 128 -->

Расположение: функция ddr_init() в `arch/arm/mach-rockchip/ddr_rk30.c`.

<!-- Source EN PDF p.16, block 129 -->

SoC: RK3288.

<!-- Source EN PDF p.16, block 130 -->

Расположение: функция ddr_init() в `arch/arm/mach-rockchip/ddr_rk32.c`.

<!-- Source EN PDF p.16, block 131 -->

SoC: RK3126B, RK3126C с прошивкой без trust.img.

<!-- Source EN PDF p.16, block 132 -->

Расположение: функция ddr_init() в `arch/arm/mach-rockchip/ddr_rk3126b.c`.

<!-- Source EN PDF p.16, block 133 -->

SoC: RK3126/RK3128.

<!-- Source EN PDF p.16, block 134 -->

Расположение: функция ddr_init() в `./arch/arm/mach-rockchip/ddr_rk3126.c`.

<!-- Source EN PDF p.16, block 135 -->

Способ: закомментируйте следующие строки в функции ddr_init():

<!-- Source EN PDF p.17, block 136 -->

```text
if(freq != 0)
    value = clk_set_rate(clk, 1000*1000*freq);
else
    value = clk_set_rate(clk, clk_get_rate(clk));
```

<!-- Source EN PDF p.17, block 137 -->

SoC: RV1108.

<!-- Source EN PDF p.17, block 138 -->

Расположение: функция ddr_init() в `arch/arm/mach-rockchip/ddr_rv1108.c`.

<!-- Source EN PDF p.17, block 139 -->

Способ: закомментируйте следующие строки в функции ddr_init():

<!-- Source EN PDF p.17, block 140 -->

```text
if (freq == 0)
_ddr_change_freq(ddr_freq_current);
else
_ddr_change_freq(freq);
```

<!-- Source EN PDF p.17, block 141 -->

Для остальных SoC, включая RK3126B и RK3126C с trust.img, достаточно действий предыдущего раздела: изменение частоты отключается и в ddr_init. Для kernel 3.0:

<!-- Source EN PDF p.17, block 142 -->

```text
Code Path
```

<!-- Source EN PDF p.17, block 143 -->

| SoC | Расположение кода |
|---|---|
| RK3066 | arch/arm/mach-rk30/ddr.c, функция ddr_init() |
| RK3026, RK3028A | arch/arm/mach-rk2928/ddr.c, функция ddr_init() |

<!-- Source EN PDF p.17, block 144 -->

```text
arch/arm/mach-rk2928/ddr.c, ddr_init() function
```

<!-- Source EN PDF p.17, block 145 -->

Способ: закомментируйте следующие строки в функции ddr_init():

<!-- Source EN PDF p.17, block 146 -->

```text
if(freq != 0)
    value=ddr_change_freq(freq);
else
    value=ddr_change_freq(clk_get_rate(clk_get(NULL, "ddr"))/1000000);
```

<!-- Source EN PDF p.17, block 147 -->

### 1.9 Определение объёма DDR

<!-- Source EN PDF p.17, block 148 -->

Для приблизительной оценки выполните следующую команду и посмотрите MemTotal. Это значение немного меньше фактического объёма; округлите оценку до целого объёма памяти.

<!-- Source EN PDF p.17, block 149 -->

```text
root@rk3399:/ # cat /proc/meminfo
MemTotal: 3969804 kB
```

<!-- Source EN PDF p.17, block 150 -->

Подробные сведения об объёме DDR можно получить следующим образом.

<!-- Source EN PDF p.17, block 151 -->

Объём DDR печатается при её инициализации в loader и ядре. В kernel 4.4 и новее он не выводится; в kernel 3.10 выводится на части SoC (см. таблицу). В loader сведения доступны на всех SoC. Сообщения loader необходимо захватить через последовательный порт: при подключении ADB эта стадия уже пропущена.

<!-- Source EN PDF p.18, block 152 -->

| SoC | loader | kernel 3.0/3.10/<br>kernel 4.4 и новее |
|---|---|---|
| RK3026 | √ | √ |
| RK3028A | √ | √ |
| RK3036 | √ | × |
| RK3066 | √ | √ |
| RK3126 | √ | √ |
| RK3126B, RK3126C с trust.img | √ | × |
| RK3126B, RK3126C без trust.img | √ | √ |
| RK3128 | √ | √ |
| RK3188 | √ | √ |
| RK322x | √ | × |
| RK322xh | √ | × |
| RK3288 | √ | √ |
| RK3328 | √ | × |
| RK3368 | √ | × |
| RK3399 | √ | × |
| RV1108 | √ | × |
| Другие SoC | √ | × |

<!-- Source EN PDF p.18, block 153 -->

√ — сведения об объёме выводятся.

<!-- Source EN PDF p.18, block 154 -->

× — сведения об объёме не выводятся.

<!-- Source EN PDF p.18, block 155 -->

Подробные сведения включают тип DDR, частоту, канал (channel a/channel b), ширину шины BW, строки row, столбцы col, банки BK, CS, ширину шины кристалла die BW и размер size (total capability).

<!-- Source EN PDF p.18, block 156 -->

При одном канале SoC общий объём равен Size или Total capacity; при двух — сумме этих значений обоих каналов.

<!-- Source EN PDF p.18, block 157 -->

Подробный вывод объёма DDR в loader:

<!-- Source EN PDF p.19, block 158 -->

```text
DDR Version 1.05 20170712
In
Channel a: DDR3 400MHz
Bus Width=32 Col=10 Bank=8 Row=15 CS=1 Die Bus-Width=16 Size=1024MB
Channel b: DDR3 400MHz
Bus Width=32 Col=10 Bank=8 Row=15 CS=1 Die Bus-Width=16 Size=1024MB
Memory OK
Memory OK
OUT
```

<!-- Source EN PDF p.19, block 159 -->

Подробный вывод объёма DDR в ядре:

<!-- Source EN PDF p.19, block 160 -->

```text
[ 0.528564] DDR DEBUG: version 1.00 20150126
[ 0.528690] DDR DEBUG: Channel a:
[ 0.528701] DDR DEBUG: DDR3 Device
[ 0.528716] DDR DEBUG: Bus Width=32 Col=10 Bank=8 Row=15 CS=1 Total Capability=1024MB
[ 0.528727] DDR DEBUG: Channel b:
[ 0.528736] DDR DEBUG: DDR3 Device
[ 0.528750] DDR DEBUG: Bus Width=32 Col=10 Bank=8 Row=15 CS=1 Total Capability=1024MB
[ 0.528762] DDR DEBUG: addr=0xd40000
```

<!-- Source EN PDF p.19, block 161 -->

### 1.10 Изменение доступного объёма DDR

<!-- Source EN PDF p.19, block 162 -->

По исходнику, на всех платформах Rockchip объём DDR определяется автоматически; пользователю не требуется его задавать. Описанный способ предназначен прежде всего для оценки производительности или влияния уменьшения доступного объёма.

<!-- Source EN PDF p.19, block 163 -->

Другой способ приведён в `Rockchip_Developer_Guide_UBoot_Nextdev_CN` → CH08 Debugging Methods → Modify DDR Capacity.

<!-- Source EN PDF p.19, block 164 -->

При загрузке код инициализации DDR передаёт объём в U-Boot. U-Boot исключает часть защищённой памяти и передаёт результат ядру. Пользователь может изменить передаваемый ядру объём на стадии U-Boot.

<!-- Source EN PDF p.19, block 165 -->

Расположение кода:

<!-- Source EN PDF p.19, block 166 -->

```text
./arch/arm/mach-rockchip/param.c
```

<!-- Source EN PDF p.19, block 167 -->

Порядок изменения:

<!-- Source EN PDF p.19, block 168 -->

1\. Добавьте диагностический вывод текущего объёма DDR.

<!-- Source EN PDF p.19, block 169 -->

```text
struct memblock *param_parse_ddr_mem(int *out_count)
{
    ...
    for (i = 0, n = 0; i < count; i++, n++) {
        base = t->u.ddr_mem.bank[i];
        size = t->u.ddr_mem.bank[i + count];
        printf("base:0x%llx, size:0x%llx\n", base, size); //Add this line to print
        /* 0~4GB */
        if (base < SZ_4GB) {
            mem[n].base = base;
            mem[n].size = ddr_mem_get_usable_size(base, size);
    ...
}
```

<!-- Source EN PDF p.20, block 171 -->

После изменений пересоберите и загрузите U-Boot. В новом журнале запуска появится следующий вывод.

<!-- Source EN PDF p.20, block 172 -->

```text
U-Boot 2017.09-g0236dc3682-220712-dirty #hcy (Aug 04 2022 - 10:46:07 +0800)
Model: Rockchip RK3568 Evaluation Board
PreSerial: 2, raw, 0xfe660000
DRAM: base:0x0, size:0x40000000 //This line is the output we added
```

<!-- Source EN PDF p.20, block 173 -->

В следующем примере:

<!-- Source EN PDF p.20, block 174 -->

```text
base:0x0, size:0x40000000
```

<!-- Source EN PDF p.20, block 175 -->

Как показано ниже, имеется одна область DRAM с базовым адресом 0x0 и размером 0x40000000.

<!-- Source EN PDF p.20, block 176 -->

![Технический рисунок исходника — PDF 20](/docs/rockchip-ddr/assets/en-p20-figure1.png)

<!-- Source EN PDF p.20, block 177 -->

Перед запуском ядра U-Boot исключает часть защищённой памяти и передаёт сведения об объёме DDR следующим образом.

<!-- Source EN PDF p.20, block 178 -->

```text
Adding bank: 0x00200000 - 0x08400000 (size: 0x08200000) //After removing the secure memory
block
Adding bank: 0x09400000 - 0x40000000 (size: 0x36c00000) //After removing the secure memory
block
Total: 1182.666 ms
Starting kernel ...
[ 0.000000] Booting Linux on physical CPU 0x0000000000 [0x412fd050]
```

<!-- Source EN PDF p.21, block 179 -->

2\. Разобравшись с форматом описания объёма, можно его изменить.

<!-- Source EN PDF p.21, block 180 -->

Предположим, в систему добавлена область DRAM Region 1, показанная на рисунке. Для этого внесите следующие изменения:

<!-- Source EN PDF p.21, block 181 -->

![Технический рисунок исходника — PDF 21](/docs/rockchip-ddr/assets/en-p21-figure1.png)

<!-- Source EN PDF p.21, block 182 -->

```text
struct memblock *param_parse_ddr_mem(int *out_count)
{
    ...
    /* extend top ram size */
    if (t->u.ddr_mem.flags & DDR_MEM_FLG_EXT_TOP)
        gd->ram_top_ext_size = t->u.ddr_mem.data[0];
    //Modify DDR capacity information,starting here
    count = 2;
    t->u.ddr_mem.count = count;
    t->u.ddr_mem.bank[0] = 0x0; //Region 0 base address
    t->u.ddr_mem.bank[0 + count] = 0x40000000 - 0x0; //Region 0 size
    t->u.ddr_mem.bank[1] = 0x70000000; //Region 1 base address
    t->u.ddr_mem.bank[1 + count] = 0x80000000 - 0x70000000; //Region 1 size
    t->u.ddr_mem.hash = 0;
    ///Modify DDR capacity information, end here
    /* normal ram size */
    count = t->u.ddr_mem.count;
    mem = calloc(count + MEM_RESV_COUNT, sizeof(*mem));
    if (!mem) {
        printf("Calloc ddr memory failed\n");
        return 0;
    }
    ...
    for (i = 0, n = 0; i < count; i++, n++) {
        base = t->u.ddr_mem.bank[i];
        size = t->u.ddr_mem.bank[i + count];
        printf("base:0x%llx, size:0x%llx\n", base, size);
        /* 0~4GB */
        if (base < SZ_4GB) {
            mem[n].base = base;
            mem[n].size = ddr_mem_get_usable_size(base, size);
    ...
}
```

<!-- Source EN PDF p.22, block 184 -->

Рассмотрим следующий код подробнее:

<!-- Source EN PDF p.22, block 185 -->

```text
    count = 2; //Indicates that there are 2 blocks of DRAM space
    t->u.ddr_mem.count = count; //Must be written like this
    t->u.ddr_mem.bank[0] = 0x0;
    t->u.ddr_mem.bank[0 + count] = 0x40000000 - 0x0; //The array index must have "+count"
    //Region base address plus Region size is One group, how many groups there are, must be
the same as the "count" above
    t->u.ddr_mem.bank[1] = 0x70000000;
    t->u.ddr_mem.bank[1 + count] = 0x80000000 - 0x70000000; //The array index must have
"+count"
    t->u.ddr_mem.hash = 0; //Must be written like this
```

<!-- Source EN PDF p.22, block 186 -->

Пересоберите и загрузите U-Boot. Новый журнал запуска покажет, что изменения вступили в силу.

<!-- Source EN PDF p.22, block 187 -->

```text
...
U-Boot 2017.09-g0236dc3682-220712-dirty #hcy (Aug 04 2022 - 10:46:07 +0800)
Model: Rockchip RK3568 Evaluation Board
PreSerial: 2, raw, 0xfe660000
DRAM: base:0x0, size:0x40000000
base:0x70000000, size:0x10000000 //this is what we have added
...
Adding bank: 0x00200000 - 0x08400000 (size: 0x08200000)
Adding bank: 0x09400000 - 0x40000000 (size: 0x36c00000)
Adding bank: 0x70000000 - 0x80000000 (size: 0x10000000) //this is what we have added
Total: 1182.666 ms
Starting kernel ...
[ 0.000000] Booting Linux on physical CPU 0x0000000000 [0x412fd050]
```

<!-- Source EN PDF p.22, block 188 -->

Если физически используется только одна область DRAM, но её доступный размер требуется изменить на 0x80000000, добавьте следующий код.

<!-- Source EN PDF p.23, block 189 -->

```text
count = 1; //Indicates that there is 1 block
t->u.ddr_mem.count = count; //Must be written like this
t->u.ddr_mem.bank[0] = 0x0;
t->u.ddr_mem.bank[0 + count] = 0x80000000 - 0x0; //The array index must have "+count"
t->u.ddr_mem.hash = 0; //Must be written like this
```

<!-- Source EN PDF p.23, block 190 -->

\*\*Внимание:\*\* нельзя произвольно увеличивать заявленный объём DRAM: при отсутствии реальной памяти система будет работать неправильно. Обычно объём уменьшают для оценки. Region1 добавлена в примере только для объяснения способа.

<!-- Source EN PDF p.23, block 191 -->

### 1.11 Просмотр частоты DDR

<!-- Source EN PDF p.23, block 192 -->

Через devfreq

<!-- Source EN PDF p.23, block 193 -->

Если изменение частоты DDR включено, текущую частоту можно получить через следующие узлы:

<!-- Source EN PDF p.23, block 194 -->

```text
cat /sys/class/devfreq/dmc/cur_freq
```

<!-- Source EN PDF p.23, block 195 -->

```text
console:/ # cat /sys/class/devfreq/dmc/cur_freq
780000000
```

<!-- Source EN PDF p.23, block 196 -->

Через clk_summary

<!-- Source EN PDF p.23, block 197 -->

```text
cat /sys/kernel/debug/clk/clk_summary | grep scmi_clk_ddr
```

<!-- Source EN PDF p.23, block 198 -->

Или:

<!-- Source EN PDF p.23, block 199 -->

```text
cat /sys/kernel/debug/clk/clk_summary | grep sclk_ddrc
```

<!-- Source EN PDF p.23, block 200 -->

Или:

<!-- Source EN PDF p.23, block 201 -->

```text
cat /sys/kernel/debug/clk/clk_summary | grep sclk_ddr
```

<!-- Source EN PDF p.23, block 202 -->

Выбор зависит от версии ядра.

<!-- Source EN PDF p.23, block 203 -->

```text
console:/ # cat /sys/kernel/debug/clk/clk_summary | grep scmi_clk_ddr
scmi_clk_ddr 0 0 0 2736000000 0 0 50000
/*2736000000 is the DDR frequency in Hz, that is, 2736MHz*/
```

<!-- Source EN PDF p.23, block 204 -->

### 1.12 Изменение частоты DDR

<!-- Source EN PDF p.23, block 205 -->

В ядре используются две стратегии: изменение частоты по сценарию и по нагрузке. Поведение kernel 4.4 и новее отличается от kernel 3.10.

<!-- Source EN PDF p.23, block 206 -->

Kernel 4.4 и новее:

<!-- Source EN PDF p.24, block 207 -->

По сценарию: при входе в заданный сценарий частота DDR переходит на соответствующее значение SYS_STATUS_XXX, если управление по нагрузке отключено. Если оно включено, частота повышается или снижается по фактической нагрузке и порогам upthreshold/downdifferential, но не ниже значения SYS_STATUS_XXX.

<!-- Source EN PDF p.24, block 208 -->

По нагрузке: частота во всех сценариях зависит от нагрузки, но остаётся не ниже значения SYS_STATUS_XXX. Исключение — SYS_STATUS_NORMAL: его значение заменяется частотой по нагрузке, а нижняя граница определяется auto-min-freq, а не SYS_STATUS_NORMAL.

<!-- Source EN PDF p.24, block 209 -->

Kernel 3.10:

<!-- Source EN PDF p.24, block 210 -->

По сценарию: при входе в заданный сценарий частота DDR переходит на SYS_STATUS_XXX и далее не меняется, даже если включено управление по нагрузке.

<!-- Source EN PDF p.24, block 211 -->

По нагрузке: заменяется сценарий SYS_STATUS_NORMAL; только в нём частота DDR определяется нагрузкой.

<!-- Source EN PDF p.24, block 212 -->

Способ изменения частоты необходимо выбирать по ветке ядра.

<!-- Source EN PDF p.24, block 213 -->

Для PX30S/RK3326S см. ниже раздел «Выбор частот DDR для PX30S/RK3326S».

<!-- Source EN PDF p.24, block 214 -->

Для платформ с четырьмя частотами в DDR bin см. ниже соответствующий раздел о выборе частоты.

<!-- Source EN PDF p.24, block 215 -->

В kernel 4.4 найдите узел dmc в DTS. Например, для RK3399 EVB он описан в `arch/arm64/boot/dts/rockchip/rk3399-evb.dtsi` и `arch/arm64/boot/dts/rockchip/rk3399.dtsi`.

<!-- Source EN PDF p.24, block 216 -->

```text
&dmc {
    status = "okay";
    center-supply = <&vdd_center>;
    upthreshold = <40>;
    downdifferential = <20>;
    system-status-freq = <
        /*system status freq(KHz)*/
        SYS_STATUS_NORMAL 800000
        SYS_STATUS_REBOOT 528000
        SYS_STATUS_SUSPEND 200000
        SYS_STATUS_VIDEO_1080P 200000
        SYS_STATUS_VIDEO_4K 600000
        SYS_STATUS_VIDEO_4K_10B 800000
        SYS_STATUS_PERFORMANCE 800000
        SYS_STATUS_BOOST 400000
        SYS_STATUS_DUALVIEW 600000
        SYS_STATUS_ISP 600000
    >;
    /* Each line is used as a group of data, "min_bw "and "max_bw" represent the bandwidth
requirement corresponded by vop.When the requirement value fallling between the range of
"min_bw" and "max_bw", the DDR frequency needs to increase the frequency specified by
"freq", and is valid at "auto-freq-en=1" */
    vop-bw-dmc-freq = <
    /* min_bw(MB/s) max_bw(MB/s) freq(KHz) */
        0 577 200000
        578 1701 300000
        1702 99999 400000
    >;
    auto-min-freq = <200000>;
};
```

<!-- Source EN PDF p.25, block 218 -->

```text
dmc: dmc {
    compatible = "rockchip,rk3399-dmc";
    devfreq-events = <&dfi>;
    interrupts = <GIC_SPI 1 IRQ_TYPE_LEVEL_HIGH 0>;
    clocks = <&cru SCLK_DDRCLK>;
    clock-names = "dmc_clk";
    ddr_timing = <&ddr_timing>;
    /* DDR utilization exceeds 40%, starts to increase frequency when "auto-freq-en=1 " */
    upthreshold = <40>;
    /* DDR utilization less than 20%, start to reduce frequency when "auto-freq-en=1 " */
    downdifferential = <20>;
    system-status-freq = <
    /*system status freq(KHz)*/
    /* It is valid when "auto-freq-en=0". It indicates that this scene is in common use
except for the following scenes */
    SYS_STATUS_NORMAL 800000
    /* It means the DDR frequency before reboot. When auto-freq-en=1, this frequency will be
used as the min value and increased according to the load status */
    SYS_STATUS_REBOOT 528000
    /* It means the DDR frequency at early suspend. When auto-freq-en=1, this frequency will
be used as the min value and increased according to the load status */
    SYS_STATUS_SUSPEND 200000
    /* It means the DDR frequency at playing 1080P video.When auto-freq-en=1, this frequency
will be used as the min value and increased according to the load status */
    SYS_STATUS_VIDEO_1080P 300000
    /* It means the DDR frequency at playing 4K video When auto-freq-en=1, this frequency
will be used as the min value and increased according to the load status */
    SYS_STATUS_VIDEO_4K 600000
    /* It means the DDR frequency at playing 4K 10bit video. When auto-freq-en=1, this
frequency will be used as the min value and increased according to the load status */
    SYS_STATUS_VIDEO_4K_10B 800000
    /* It means the DDR frequency at performance mode.When auto-freq-en=1, this frequency
will be used as the min value and increased according to the load status */
    SYS_STATUS_PERFORMANCE 800000
    /* It means the DDR frequency at touching,getting higher frequency from low in order to
improve touching respond.When auto-freq-en=1, this frequency will be used as the min value
and increased according to the load status */
    SYS_STATUS_BOOST 400000
    /* It means the DDR frequency at dual display mode.When auto-freq-en=1, this frequency
will be used as the min value and increased according to the load status */
    SYS_STATUS_DUALVIEW 600000
    /* It means the DDR frequency at ISP mode.When auto-freq-en=1, this frequency will be
used as the min value and increased according to the load status */
    SYS_STATUS_ISP 600000
    >;
    /* When auto-freq-en=1, this frequency will be used as the min value of
SYS_STATUS_NORMAL scenario */
    auto-min-freq = <400000>;
    /* The value equals to 1,which indicates this function is on, to 0,which means off.If it
is on, "SYS_STATUS_NORMAL" will be taken by the load frequency completely and the lowest
frequency is" auto-min-freq" instead of "SYS_STATUS_NORMAL".That means,it takes the
frequency defined by this scene as the lowest frequency and the system will increase or
reduece DDR frequency through "upthreshold/downdifferential" according to DDR utilization */
    auto-freq-en = <1>;
    status = "disabled";
};
```

<!-- Source EN PDF p.26, block 220 -->

\*\*Примечание 1:\*\* таблица частот и напряжений kernel 4.4 работает иначе, чем в kernel 3.10. Частота непосредственно используется только при совпадении с opp-hz из dmc_opp_table. Меньшее значение округляется вверх к opp-hz, а превышающее верхнюю границу ограничивается ею. Чтобы избежать неожиданного ограничения, проверьте dmc_opp_table.

<!-- Source EN PDF p.26, block 221 -->

```text
dmc_opp_table: opp-table3 {
    opp-200000000 {
        /* When the DDR frequency equals to 200MHz,this voltage is effective;less than
200MHz,running at 200MHz */
        opp-hz = /bits/ 64 <200000000>;
        opp-microvolt = <825000>; //vdd_center voltage
    };
    ...
    opp-800000000 {
        opp-hz = /bits/ 64 <800000000>;
        opp-microvolt = <900000>;
    };
};
```

<!-- Source EN PDF p.26, block 222 -->

Разобравшись с параметрами конфигурации, измените частоту нужного сценария. При auto-freq-en=1 точно контролировать частоту сложнее. Если снижение частоты нужно для поиска неисправности, задайте auto-freq-en=0 и измените значения частот отдельных сценариев.

<!-- Source EN PDF p.26, block 223 -->

\*\*Примечание 2:\*\* для RK3399 с LPDDR4 и RV1126 набор поддерживаемых частот определяется loader. Он выводится через последовательный порт при инициализации DDR. Частоты в dmc_opp_table ядра должны соответствовать этому набору.

<!-- Source EN PDF p.26, block 224 -->

Например, loader RV1126 выводит 328MHz, 528MHz, 784MHz и 924MHz; в dmc_opp_table допустимо определить только эти четыре частоты.

<!-- Source EN PDF p.26, block 225 -->

```text
change to: 328MHz
change to: 528MHz
change to: 784MHz
change to: 924MHz(final freq)
```

<!-- Source EN PDF p.26, block 226 -->

```text
dmc_opp_table: dmc-opp-table {
    compatible = "operating-points-v2";
    opp-328000000 {
        opp-hz = /bits/ 64 <328000000>;
        opp-microvolt = <800000>;
    };
    opp-528000000 {
        opp-hz = /bits/ 64 <528000000>;
        opp-microvolt = <800000>;
    };
    opp-784000000 {
        opp-hz = /bits/ 64 <784000000>;
        opp-microvolt = <800000>;
    };
    opp-924000000 {
        opp-hz = /bits/ 64 <924000000>;
        opp-microvolt = <800000>;
    };
};
```

<!-- Source EN PDF p.27, block 228 -->

При несовпадении частот dmc_opp_table и loader драйвер dmc встретит ошибку несоответствия при переключении DDR. Пример журнала:

<!-- Source EN PDF p.27, block 229 -->

```text
rockchip-dmc dmc: Get wrong frequency, Request 1056000000, Current 924000000
```

<!-- Source EN PDF p.27, block 230 -->

В kernel 3.10 найдите узел clk_ddr_dvfs_table в DTS. Например, для платы RK3288 SDK его окончательное описание находится в `arch/arm/boot/dts/rk3288-tb_8846.dts`.

<!-- Source EN PDF p.27, block 231 -->

```text
&clk_ddr_dvfs_table {
    /* The logic voltage corresponding to the DDR frequency, if the frequency in "freq-
table" or "bd-freq-table" is larger than the maximum frequency here, the corresponding
voltage cannot be found and can not switched to the corresponding frequency. At this time,
you need to add frequency voltage table here */
    operating-points = <
        /* KHz uV */
        200000 1050000
        300000 1050000
        400000 1100000
        533000 1150000
        >;
    freq-table = <
        /*status freq(KHz)*/
        /* It is valid only when "auto-freq-en=0".And it indicates that this scene is common
use scene except for the following scenes */
        SYS_STATUS_NORMAL 400000
        /* DDR frequency at the early suspend */
        SYS_STATUS_SUSPEND 200000
        /* DDR frequency at playing 1080P video */
        SYS_STATUS_VIDEO_1080P 240000
        /* DDR frequency at playing 4K video */
        SYS_STATUS_VIDEO_4K 400000
        /* DDR frequency at playing 60FPS video */
        SYS_STATUS_VIDEO_4K_60FPS 400000
        /* DDR frequency at performance mode */
        SYS_STATUS_PERFORMANCE 528000
        /* DDR frequency at dual display */
        SYS_STATUS_DUALVIEW 400000
        /* DDR frequency at touching,getting higher frequency from low in order to improve
touching respond */
        SYS_STATUS_BOOST 324000
        /* DDR frequency at ISP */
        SYS_STATUS_ISP 400000
        >;
    bd-freq-table = <
        /* bandwidth freq */
        5000 800000
        3500 456000
        2600 396000
        2000 324000
    >;
    /* After the load frequency scaling turned on,where the "SYS_STATUS_NORMAL" scenario, it
will switch between several frequencies listed by this table according to the DDR bandwidth
utilization */
    auto-freq-table = <
        240000
        324000
        396000
        528000
        >;
    /* The value equals to "1", indicating that the load frequency conversion function is
enabled; equals to 0, means disabled. After the load frequency conversion function turning
on, the "SYS_STATUS_NORMAL" scene frequency scaling will be completely replaced by the load
scaling frequency */
    auto-freq=<1>;
    /*
     * 0: use standard flow
     * 1: vop dclk never divided
     * 2: vop dclk always divided
     */
    vop-dclk-mode = <0>;
    status="okay";
};
```

<!-- Source EN PDF p.28, block 233 -->

Разобравшись с параметрами конфигурации, измените частоту нужного сценария. При auto-freq-en=1 точно контролировать частоту сложнее. Если снижение частоты нужно для поиска неисправности, задайте auto-freq-en=0 и измените значения частот отдельных сценариев.

<!-- Source EN PDF p.28, block 234 -->

\*\*Обязательно убедитесь, что выбранного напряжения достаточно для этой частоты.\*\* Изменение напряжения описано в разделе «Изменение напряжения для заданной частоты DDR».

<!-- Source EN PDF p.28, block 235 -->

В английском исходнике здесь указано kernel3.10: найдите dvfs_ddr_table в файле платы borad-\*\*.c. Например, для RK3066 SDK таблица находится в `arch/arm/mach-rk30/board-rk30-sdk.c`. Следующий абзац относится к kernel 3.0; это несогласованность исходника.

<!-- Source EN PDF p.29, block 236 -->

```text
static struct cpufreq_frequency_table dvfs_ddr_table[] = {
    /* DDR frequency at the early suspend */
    {.frequency = 200 * 1000 + DDR_FREQ_SUSPEND, .index = 1050 * 1000},
    /* DDR frequency at playing video */
    {.frequency = 300 * 1000 + DDR_FREQ_VIDEO, .index = 1050 * 1000},
    /* it indicates that this scene is common use scene except for above two scenes */
    {.frequency = 400 * 1000 + DDR_FREQ_NORMAL, .index = 1125 * 1000},
    {.frequency = CPUFREQ_TABLE_END},
};
```

<!-- Source EN PDF p.29, block 237 -->

В kernel 3.0 предусмотрены только три сценария. Частота задаётся значением «200 \* 1000» поля .frequency, единица — KHz. Суффикс «+ DDR_FREQ_SUSPEND» при выборе частоты можно не учитывать.

<!-- Source EN PDF p.29, block 238 -->

\*\*Обязательно убедитесь, что выбранного напряжения достаточно для этой частоты.\*\* Изменение напряжения описано в разделе «Изменение напряжения для заданной частоты DDR».

<!-- Source EN PDF p.29, block 239 -->

#### 1.12.1 Включение 928MHz для RK3399 с LPDDR4

<!-- Source EN PDF p.29, block 240 -->

1\. Измените `RKBOOT/RK3399MINIALL.ini` в каталоге rkbin: выберите DDR bin для 933MHz и соберите loader.

<!-- Source EN PDF p.29, block 241 -->

```text
diff --git a/RKBOOT/RK3399MINIALL.ini b/RKBOOT/RK3399MINIALL.ini
index d8e71dd7..3e20f255 100755
--- a/RKBOOT/RK3399MINIALL.ini
+++ b/RKBOOT/RK3399MINIALL.ini
@@ -5,7 +5,7 @@ MAJOR=1
 MINOR=26
 [CODE471_OPTION]
 NUM=1
-Path1=bin/rk33/rk3399_ddr_800MHz_v1.27.bin
+Path1=bin/rk33/rk3399_ddr_933MHz_v1.27.bin
 Sleep=1
 [CODE472_OPTION]
 NUM=1
@@ -14,7 +14,7 @@ Path1=bin/rk33/rk3399_usbplug_v1.26.bin
 NUM=2
 LOADER1=FlashData
 LOADER2=FlashBoot
-FlashData=bin/rk33/rk3399_ddr_800MHz_v1.27.bin
+FlashData=bin/rk33/rk3399_ddr_933MHz_v1.27.bin
 FlashBoot=bin/rk33/rk3399_miniloader_v1.26.bin
 [OUTPUT]
 PATH=rk3399_loader_v1.27.126.bin
```

<!-- Source EN PDF p.29, block 242 -->

После записи собранного loader в устройство журнал последовательного порта покажет пять поддерживаемых частот: 416MHz, 856MHz, 328MHz, 666MHz и 928MHz. Текущая частота DDR — 856MHz.

<!-- Source EN PDF p.30, block 243 -->

```text
DDR Version 1.27 20211018
In
...
support 416 856 328 666 928 MHz, current 856MHz
OUT
```

<!-- Source EN PDF p.30, block 244 -->

2\. В узле dmc_opp_table DTS ядра измените status = "disabled" записи opp-928000000 на status = "okay" либо удалите это свойство.

<!-- Source EN PDF p.30, block 245 -->

```text
                opp-928000000 {
                        opp-hz = /bits/ 64 <928000000>;
                        opp-microvolt = <900000>;
- status = "disabled";
                };
```

<!-- Source EN PDF p.30, block 246 -->

3\. В узле dmc замените все значения «856000» таблицы system-status-freq на «928000». Либо, согласно описанию SYS_STATUS_XXX в разделе об изменении частоты DDR, изменяйте отдельные сценарии в зависимости от требуемой пропускной способности реального проекта.

<!-- Source EN PDF p.30, block 247 -->

#### 1.12.2 Выбор частот DDR для PX30S/RK3326S

<!-- Source EN PDF p.30, block 248 -->

На RK3326S/PX30S поддерживаются только четыре частотные точки. Они задаются узлом ddrx_params в `arch/arm64/boot/dts/rockchip/px30s-dram-default-timing.dtsi` и узлом px30s_dmc_opp_table в `arch/arm64/boot/dts/rockchip/px30.dtsi`.

<!-- Source EN PDF p.30, block 249 -->

В ddrx_params для DDR3 задайте freq_0, freq_1, freq_2, freq_3 внутри ddr3_params; для DDR4 — внутри ddr4_params.

<!-- Source EN PDF p.30, block 250 -->

В px30s_dmc_opp_table все типы DDR используют общую таблицу. Включённые частоты должны соответствовать freq_0, freq_1, freq_2, freq_3 в ddrx_params. Например, для LPDDR4 они должны совпадать со значениями lpddr4_params. Пример конфигурации:

<!-- Source EN PDF p.30, block 251 -->

```text
px30s_dmc_opp_table: px30s-dmc-opp-table {
    compatible = "operating-points-v2";
    opp-328000000 {
        opp-hz = /bits/ 64 <328000000>;
        opp-microvolt = <1000000>;
    };
    opp-666000000 {
        opp-hz = /bits/ 64 <666000000>;
        opp-microvolt = <1000000>;
    };
    opp-786000000 {
        opp-hz = /bits/ 64 <786000000>;
        opp-microvolt = <1000000>;
    };
    opp-924000000 {
        opp-hz = /bits/ 64 <924000000>;
        opp-microvolt = <1000000>;
    };
    /* 1056M only for LP4 */
    opp-1056000000 {
        opp-hz = /bits/ 64 <1056000000>;
        opp-microvolt = <1000000>;
        status = "disabled";
    };
};
```

<!-- Source EN PDF p.31, block 253 -->

```text
/ {
    ...
    lpddr4_params: lpddr4-params {
        ...
        /* freq info, freq_0 is final frequency, unit: MHz */
        freq_0 = <924>;
        freq_1 = <328>;
        freq_2 = <666>;
        freq_3 = <786>;
        ...
    };
};
```

<!-- Source EN PDF p.31, block 254 -->

Для работы LPDDR4 на 1056MHz измените одну из freq_0, freq_1, freq_2, freq_3 в lpddr4_params на 1056. В px30s_dmc_opp_table отключите прежнюю частотную точку и добавьте 1056000000.

<!-- Source EN PDF p.31, block 255 -->

Новая конфигурация:

<!-- Source EN PDF p.31, block 256 -->

```text
px30s_dmc_opp_table: px30s-dmc-opp-table {
    compatible = "operating-points-v2";
    opp-328000000 {
        opp-hz = /bits/ 64 <328000000>;
        opp-microvolt = <1000000>;
    };
    opp-666000000 {
        opp-hz = /bits/ 64 <666000000>;
        opp-microvolt = <1000000>;
    };
    opp-786000000 {
        opp-hz = /bits/ 64 <786000000>;
        opp-microvolt = <1000000>;
    };
    opp-924000000 {
        opp-hz = /bits/ 64 <924000000>;
        opp-microvolt = <1000000>;
        status = "disabled";
    };
    /* 1056M only for LP4 */
    opp-1056000000 {
        opp-hz = /bits/ 64 <1056000000>;
        opp-microvolt = <1000000>;
    };
};
```

<!-- Source EN PDF p.32, block 258 -->

```text
/ {
    ...
    lpddr4_params: lpddr4-params {
        ...
        /* freq info, freq_0 is final frequency, unit: MHz */
        freq_0 = <1056>;
        freq_1 = <328>;
        freq_2 = <666>;
        freq_3 = <786>;
        ...
    };
};
```

<!-- Source EN PDF p.32, block 259 -->

#### 1.12.3 Выбор частоты для платформ с четырьмя точками в DDR bin

<!-- Source EN PDF p.32, block 260 -->

Способ подходит всем платформам из раздела о DDR bin с четырьмя частотами, кроме RV1126.

<!-- Source EN PDF p.32, block 261 -->

На этих платформах loader четырежды меняет частоту и сохраняет результаты тренировки для соответствующих частот.

<!-- Source EN PDF p.32, block 262 -->

F1, F2, F3 и F0 ниже — эти четыре частоты. По умолчанию выход из loader выполняется на F0.

<!-- Source EN PDF p.32, block 263 -->

```text
DDR ... v1.14
LPDDR4X, 2112MHz
channel[0] BW=16 Col=10 Bk=8 CS0 Row=16/0 CS1 Row=16/0 CS=2 Die BW=16 Size=2048MB
channel[1] BW=16 Col=10 Bk=8 CS0 Row=16/0 CS1 Row=16/0 CS=2 Die BW=16 Size=2048MB
channel[2] BW=16 Col=10 Bk=8 CS0 Row=16/0 CS1 Row=16/0 CS=2 Die BW=16 Size=2048MB
channel[3] BW=16 Col=10 Bk=8 CS0 Row=16/0 CS1 Row=16/0 CS=2 Die BW=16 Size=2048MB
...
change to F1: 528MHz /* 4 DDR frequencies*/
change to F2: 1068MHz
change to F3: 1560MHz
change to F0: 2112MHz
out
```

<!-- Source EN PDF p.32, block 264 -->

Хотя поддерживаемые частоты здесь тоже определяются loader, драйвер dmc автоматически получает их значения. Поэтому проблема согласования dmc_opp_table отсутствует. Узлы dmc этих платформ выглядят следующим образом:

<!-- Source EN PDF p.32, block 265 -->

```text
dmc: dmc {
    ...
    system-status-freq = <
    /*system status freq(KHz)*/
    SYS_STATUS_NORMAL DMC_FREQ_LEVEL_MID_HIGH
    SYS_STATUS_REBOOT DMC_FREQ_LEVEL_MID_LOW
    ...
    SYS_STATUS_SUSPEND DMC_FREQ_LEVEL_LOW
    ...
    SYS_STATUS_PERFORMANCE DMC_FREQ_LEVEL_HIGH
    ...
    >;
    ...
};
```

<!-- Source EN PDF p.33, block 267 -->

Частоты сценариев задаются не числами, а определениями вида DMC_FREQ_LEVEL_HIGH, автоматически соответствующими четырём частотам loader. Если изменить их инструментом из раздела «Изменение DDR bin», определения DMC_FREQ_LEVEL_HIGH и другие также будут соответствовать новому набору. Для приведённого loader соответствие следующее:

<!-- Source EN PDF p.33, block 268 -->

| Макрос | Частота | Описание |
|---|---|---|
| DMC_FREQ_LEVEL_HIGH | F0 2112MHz | Наибольшая частота |
| DMC_FREQ_LEVEL_MID_HIGH | F3 1560MHz | Вторая по убыванию |
| DMC_FREQ_LEVEL_MID_LOW | F2 1068MHz | Третья по убыванию |
| DMC_FREQ_LEVEL_LOW | F1 528MHz | Наименьшая частота |

<!-- Source EN PDF p.33, block 269 -->

Чтобы изменить значения частот F0, F1, F2 и F3, см. «Изменение DDR bin».

<!-- Source EN PDF p.33, block 270 -->

Для изменения частоты сценария, например SYS_STATUS_NORMAL или SYS_STATUS_REBOOT, выберите DMC_FREQ_LEVEL_HIGH, DMC_FREQ_LEVEL_MID_HIGH, DMC_FREQ_LEVEL_MID_LOW либо DMC_FREQ_LEVEL_LOW.

<!-- Source EN PDF p.33, block 271 -->

### 1.13 Изменение напряжения для заданной частоты DDR

<!-- Source EN PDF p.33, block 272 -->

Для поиска неисправности изменением напряжения из командной строки используйте следующий способ. В версиях после kernel 4.4 напряжение регулятора можно менять через `/sys/kernel/debug/regulator/`. Сначала зафиксируйте частоту DDR, иначе ручная настройка будет конфликтовать с регулировкой напряжения при смене частоты. См. раздел «Фиксация частоты DDR».

<!-- Source EN PDF p.33, block 273 -->

Пример изменения напряжения для 3588:

<!-- Source EN PDF p.33, block 274 -->

```text
cat /sys/kernel/debug/regulator/vdd_ddr_s0/voltage
echo 700000 > /sys/kernel/debug/regulator/vdd_ddr_s0/voltage
```

<!-- Source EN PDF p.34, block 275 -->

Регуляторы, которые требуется менять на каждой платформе для настройки напряжения при заданной частоте DDR:

<!-- Source EN PDF p.34, block 276 -->

| Платформа | Регулируемые узлы |
|---|---|
| RK3308/RK3308B | "vdd_core" или "vdd_log" |
| RK3576 | "vdd_logic_s0" и "vdd_ddr_s0" |
| RK3588 | "vdd_log_s0" и "vdd_ddr_s0" |
| Другие SoC | "vdd_center" или "vdd_logic" |

<!-- Source EN PDF p.34, block 277 -->

Kernel 4.4: пересоберите ядро, включив pm_tests: `make ARCH=arm64 menuconfig -> Device Drivers -> SOC (System On Chip) specific Drivers -> Rockchip pm_test support`.

<!-- Source EN PDF p.34, block 278 -->

Kernel 3.10: пересоберите ядро, включив pm_tests: `make menuconfig -> System Type -> /sys/pm_tests/ support`.

<!-- Source EN PDF p.34, block 279 -->

Команда изменения напряжения DDR:

<!-- Source EN PDF p.34, block 280 -->

RK3399

<!-- Source EN PDF p.34, block 281 -->

```text
echo set vdd_center 900000 > /sys/pm_tests/clk_volt
```

<!-- Source EN PDF p.34, block 282 -->

Другие SoC

<!-- Source EN PDF p.34, block 283 -->

```text
echo set vdd_logic 1200000 > /sys/pm_tests/clk_volt
```

<!-- Source EN PDF p.34, block 284 -->

Если pm_tests отсутствует или команда не решает задачу, измените прошивку ядра следующим образом.

<!-- Source EN PDF p.34, block 285 -->

В kernel 4.4 найдите dmc_opp_table в DTS. Для RK3399 EVB он находится в `arch/arm64/boot/dts/rockchip/rk3399-opp.dtsi`, для RK3368 — в `arch/arm64/boot/dts/rockchip/rk3368.dtsi`.

<!-- Source EN PDF p.34, block 286 -->

Пример для RK3399:

<!-- Source EN PDF p.34, block 287 -->

```text
/* it runs in this frequency only when frequency equals to "opp-hz"listed by
"dmc_opp_table".If the frequency less than "opp-hz", the frequency will getting
higher,otherwise, it exceeds "opp-hz" the upper limited,it will restricted by "opp-hz".It is
different from kernel 3.10 */
dmc_opp_table: opp-table3 {
    compatible = "operating-points-v2";
    opp-200000000 {
        /* When the DDR frequency equals to 200MHz,this voltage is effective;less than
200MHz,running at 200MHz */
        opp-hz = /bits/ 64 <200000000>;
        opp-microvolt = <825000>; //vdd_center voltage
    };
    opp-300000000 {
        opp-hz = /bits/ 64 <300000000>;
        opp-microvolt = <850000>;
    };
    opp-400000000 {
        opp-hz = /bits/ 64 <400000000>;
        opp-microvolt = <850000>;
    };
    opp-528000000 {
        opp-hz = /bits/ 64 <528000000>;
        opp-microvolt = <900000>;
    };
    opp-600000000 {
        opp-hz = /bits/ 64 <600000000>;
        opp-microvolt = <900000>;
    };
    opp-800000000 {
        opp-hz = /bits/ 64 <800000000>;
        opp-microvolt = <900000>;
    };
};
```

<!-- Source EN PDF p.35, block 289 -->

Пример для RK3368:

<!-- Source EN PDF p.35, block 290 -->

```text
/* it runs in this frequency only when frequency equals to "opp-hz"listed by
"dmc_opp_table".If the frequency less than "opp-hz", the frequency will getting
higher,otherwise, it exceeds "opp-hz" the upper limited,it will restricted by "opp-hz".It is
different from kernel 3.10 */
dmc_opp_table: opp_table2 {
    compatible = "operating-points-v2";
    opp-192000000 {
        /* When the DDR frequency equals to 200MHz,this voltage is effective;less than
200MHz,running at 200MHz */
        opp-hz = /bits/ 64 <192000000>;
        opp-microvolt = <1100000>; //vdd_logic voltage
    };
    opp-300000000 {
        opp-hz = /bits/ 64 <300000000>;
        opp-microvolt = <1100000>;
    };
    opp-396000000 {
        opp-hz = /bits/ 64 <396000000>;
        opp-microvolt = <1100000>;
    };
    opp-528000000 {
        opp-hz = /bits/ 64 <528000000>;
        opp-microvolt = <1100000>;
    };
    opp-600000000 {
        opp-hz = /bits/ 64 <600000000>;
        opp-microvolt = <1100000>;
    };
};
```

<!-- Source EN PDF p.36, block 291 -->

Измените напряжение, соответствующее частоте. Исходник описывает выбор напряжения по записи с частотой не выше заданной. Если новая частота выходит за границы таблицы, подходящее напряжение не будет найдено и переход DDR завершится ошибкой. Добавьте соответствующую пару частота–напряжение.

<!-- Source EN PDF p.36, block 292 -->

В kernel 3.10 найдите clk_ddr_dvfs_table в DTS. Например, для платы RK3288 SDK его окончательное описание находится в `arch/arm/boot/dts/rk3288-tb_8846.dts`.

<!-- Source EN PDF p.36, block 293 -->

```text
&clk_ddr_dvfs_table {
    /* This is Frequency-voltage table */
    operating-points = <
        /* KHz uV */
        /* it is show when DDR frequency less than or equals to 200MHz,logic voltage uses
1050mV.Other lines mean the same here */
        200000 1050000
        300000 1050000
        400000 1100000
        533000 1150000
        >;
    ...
    status="okay";
};
```

<!-- Source EN PDF p.36, block 294 -->

Измените напряжение, соответствующее частоте. Исходник описывает выбор напряжения по записи с частотой не выше заданной. Если новая частота выходит за границы таблицы, подходящее напряжение не будет найдено и переход DDR завершится ошибкой. Добавьте соответствующую пару частота–напряжение.

<!-- Source EN PDF p.36, block 295 -->

В kernel 3.0 измените dvfs_ddr_table в файле платы borad-\*\*.c. Например, для RK3066 SDK

<!-- Source EN PDF p.36, block 296 -->

файл находится в `arch/arm/mach-rk30/board-rk30-sdk.c`.

<!-- Source EN PDF p.36, block 297 -->

```text
static struct cpufreq_frequency_table dvfs_ddr_table[] = {
    {.frequency = 200 * 1000 + DDR_FREQ_SUSPEND, .index = 1050 * 1000},
    {.frequency = 300 * 1000 + DDR_FREQ_VIDEO, .index = 1050 * 1000},
    {.frequency = 400 * 1000 + DDR_FREQ_NORMAL, .index = 1125 * 1000},
    {.frequency = CPUFREQ_TABLE_END},
};
```

<!-- Source EN PDF p.36, block 298 -->

Поле .index в dvfs_ddr_table задаёт соответствующее напряжение в uV.

<!-- Source EN PDF p.36, block 299 -->

### 1.14 Отключение управления по нагрузке с сохранением частот сценариев

<!-- Source EN PDF p.36, block 300 -->

В kernel 4.4 и новее найдите auto-freq-en в узле dmc DTS. Например, для RK3399 EVB оно находится в `arch/arm64/boot/dts/rockchip/rk3399.dtsi`.

<!-- Source EN PDF p.37, block 301 -->

```text
dmc: dmc {
    compatible = "rockchip,rk3399-dmc";
    ...
    auto-min-freq = <400000>;
    /* Set this value to 0 to close the load DDR Frequency scaling with leaving only the
scene frequency scaling */
    auto-freq-en = <0>;
    ...
};
```

<!-- Source EN PDF p.37, block 302 -->

В kernel 3.10 найдите clk_ddr_dvfs_table в DTS. Например, для RK3288 EVB — `arch/arm/boot/dts/rk3288-tb_8846.dts`.

<!-- Source EN PDF p.37, block 303 -->

```text
&clk_ddr_dvfs_table {
    ...
    /* Set this value to 0 to close the load DDR Frequency scaling with leaving only the
scene frequency scaling */
    auto-freq=<0>;
    ...
    status="okay";
};
```

<!-- Source EN PDF p.37, block 304 -->

В kernel 3.0 управление частотой по нагрузке не поддерживается, поэтому отключать его не требуется.

<!-- Source EN PDF p.37, block 305 -->

### 1.15 Фиксация частоты DDR

<!-- Source EN PDF p.37, block 306 -->

Для поиска неисправности фиксацией частоты из командной строки используйте следующий способ.

<!-- Source EN PDF p.37, block 307 -->

Kernel 4.4 и новее:

<!-- Source EN PDF p.37, block 308 -->

Получите доступные частоты: `cat /sys/class/devfreq/dmc/available_frequencies`.

<!-- Source EN PDF p.37, block 309 -->

Установите частоту:

<!-- Source EN PDF p.37, block 310 -->

```text
echo userspace > /sys/class/devfreq/dmc/governor
echo 300000000 > /sys/class/devfreq/dmc/min_freq //This line purposes to prevent the frequency to be set lower than "min_freq", cause operation failed.
echo 300000000 > /sys/class/devfreq/dmc/userspace/set_freq
```

<!-- Source EN PDF p.37, block 311 -->

Kernel 3.10:

<!-- Source EN PDF p.37, block 312 -->

Пересоберите ядро с pm_tests: `make menuconfig -> System Type -> /sys/pm_tests/ support`. Команда фиксации частоты DDR:

<!-- Source EN PDF p.37, block 313 -->

```text
echo set clk_ddr 300000000 > /sys/pm_tests/clk_rate
```

<!-- Source EN PDF p.37, block 314 -->

Частота задаётся в Hz; параметр команды можно изменить по необходимости.

<!-- Source EN PDF p.37, block 315 -->

Если способ неприменим, остаётся изменить исходный код или DTS.

<!-- Source EN PDF p.37, block 316 -->

В kernel 4.4 и новее типичная причина неудачи — отсутствие требуемой частоты в выводе `cat /sys/class/devfreq/dmc/available_frequencies`.

<!-- Source EN PDF p.38, block 317 -->

Найдите DTS платы и добавьте требуемую частоту в dmc_opp_table. Например, для RK3399 EVB используется `arch/arm64/boot/dts/rockchip/rk3399-opp.dtsi`. Ниже предполагается добавление 666MHz:

<!-- Source EN PDF p.38, block 318 -->

```text
dmc_opp_table: opp-table3 {
compatible = "operating-points-v2";
opp-200000000 {
    opp-hz = /bits/ 64 <200000000>;
    opp-microvolt = <825000>;
};
...
opp-666000000 {
    /* When DDR frequency equals to 666MHz,use this voltage */
    opp-hz = /bits/ 64 <666000000>;
    opp-microvolt = <900000>; //vdd_center voltage
};
opp-800000000 {
    opp-hz = /bits/ 64 <800000000>;
    opp-microvolt = <900000>;
};
};
```

<!-- Source EN PDF p.38, block 319 -->

После этого частоту можно зафиксировать предыдущей командой.

<!-- Source EN PDF p.38, block 320 -->

Чтобы система сразу запускалась на фиксированной частоте, без ввода команды после включения, измените DTS следующим образом.

<!-- Source EN PDF p.38, block 321 -->

Предположим, требуется 666MHz. Для RK3399 EVB узел dmc находится в `arch/arm64/boot/dts/rockchip/rk3399-evb.dtsi`.

<!-- Source EN PDF p.38, block 322 -->

```text
/* Here "dfi" status must be "okay", it is due to lagacy code, the dmc node is
restriced by the dfi node. If the "dfi" node is disabled, it will also invalidate the
dmc node. So it is best to keep the status of the "dfi" node consistent with dmc */
&dfi {
    status = "okay";
};
&dmc {
status = "okay";
...
system-status-freq = <
    /*system status freq(KHz)*/
    SYS_STATUS_NORMAL 666000
    /* Remove the rest scenario */
    /*
    SYS_STATUS_REBOOT 528000
    SYS_STATUS_SUSPEND 200000
    SYS_STATUS_VIDEO_1080P 200000
    SYS_STATUS_VIDEO_4K 600000
    SYS_STATUS_VIDEO_4K_10B 800000
    SYS_STATUS_PERFORMANCE 800000
    SYS_STATUS_BOOST 400000
    SYS_STATUS_DUALVIEW 600000
    SYS_STATUS_ISP 600000
    */
>;
...
auto-min-freq = <666000>;
/* The value of "auto-freq-en" shall be 0 to disable load DDR Frequency scaling */
auto-freq-en = <0>;
};
```

<!-- Source EN PDF p.39, block 324 -->

В kernel 3.10 найдите clk_ddr_dvfs_table. Для платы RK3288 SDK он находится в `arch/arm/boot/dts/rk3288-tb_8846.dts`.

<!-- Source EN PDF p.39, block 325 -->

```text
&clk_ddr_dvfs_table {
    operating-points = <
        /* KHz uV */
        /* step 3,if the target frequency exceeds the maximun of this table,you shall add
the voltage table corresponding to the target frequency */
        200000 1050000
        300000 1050000
        400000 1100000
        533000 1150000
        >;
    freq-table = <
        /*status freq(KHz)*/
        /* step 2, Comment out the other scenario,keep "SYS_STATUS_NORMAL" and define it to
you target frequency, for example you need 400MHz as below */
        SYS_STATUS_NORMAL 400000
        /*
        SYS_STATUS_SUSPEND 200000
        SYS_STATUS_VIDEO_1080P 240000
        SYS_STATUS_VIDEO_4K 400000
        SYS_STATUS_VIDEO_4K_60FPS 400000
        SYS_STATUS_PERFORMANCE 528000
        SYS_STATUS_DUALVIEW 400000
        SYS_STATUS_BOOST 324000
        SYS_STATUS_ISP 400000
        */
        >;
    bd-freq-table = <
        /* bandwidth freq */
        5000 800000
        3500 456000
        2600 396000
        2000 324000
    >;
    auto-freq-table = <
        240000
        324000
        396000
        528000
        >;
    /* setp 1，set 0 to disable load DDR Frequency scaling */
    auto-freq=<0>;
    /*
     * 0: use standard flow
     * 1: vop dclk never divided
     * 2: vop dclk always divided
     */
    vop-dclk-mode = <0>;
    status="okay";
};
```

<!-- Source EN PDF p.40, block 327 -->

Прошивка с фиксированной частотой получается за три шага:

<!-- Source EN PDF p.40, block 328 -->

1\. Установите управление по нагрузке в 0.

<!-- Source EN PDF p.40, block 329 -->

2\. Закомментируйте остальные сценарии; оставьте SYS_STATUS_NORMAL и задайте ему требуемую частоту.

<!-- Source EN PDF p.40, block 330 -->

3\. Если частота превышает максимум таблицы, добавьте соответствующую ей запись напряжения.

<!-- Source EN PDF p.40, block 331 -->

В kernel 3.0 измените dvfs_ddr_table в borad-\*\*.c. Например, для RK3066 SDK файл находится в `arch/arm/mach-rk30/board-rk30-sdk.c`.

<!-- Source EN PDF p.40, block 332 -->

```text
static struct cpufreq_frequency_table dvfs_ddr_table[] = {
    /* */
    /* step 1. Comment out the other scene with leaving "DDR_FREQ_NORMAL" only */
    //{.frequency = 200 * 1000 + DDR_FREQ_SUSPEND, .index = 1050 * 1000},
    //{.frequency = 300 * 1000 + DDR_FREQ_VIDEO, .index = 1050 * 1000},
    /* step 2, Define "DDR_FREQ_NORMAL" to your target frequency,meanwhile pay attention to
whether the voltage match the frequency or not */
    {.frequency = 400 * 1000 + DDR_FREQ_NORMAL, .index = 1125 * 1000},
    {.frequency = CPUFREQ_TABLE_END},
};
```

<!-- Source EN PDF p.40, block 333 -->

Достаточно двух шагов:

<!-- Source EN PDF p.40, block 334 -->

1\. Закомментируйте остальные сценарии; оставьте только DDR_FREQ_NORMAL.

<!-- Source EN PDF p.40, block 335 -->

2\. Задайте требуемую частоту DDR_FREQ_NORMAL и убедитесь, что напряжение ей соответствует.

<!-- Source EN PDF p.40, block 336 -->

### 1.16 Определение загрузки пропускной способности DDR

<!-- Source EN PDF p.40, block 337 -->

В kernel 4.4 и новее имеется команда просмотра общей загрузки DDR:

<!-- Source EN PDF p.40, block 338 -->

```text
rk3288:/sys/class/devfreq/dmc # cat load
11@396000000Hz
```

<!-- Source EN PDF p.40, block 339 -->

Значение 11 означает, что текущая загрузка пропускной способности DDR равна 11%.

<!-- Source EN PDF p.40, block 340 -->

Rockchip также предоставляет отдельную программу наблюдения за пропускной способностью DDR. См. главу «Инструмент пропускной способности Rockchip DDR».

<!-- Source EN PDF p.41, block 341 -->

### 1.17 Проверка надёжности DDR

<!-- Source EN PDF p.41, block 342 -->

См. документ/главу DDR-Verification-Process.

<!-- Source EN PDF p.41, block 343 -->

### 1.18 Определение максимальной рабочей частоты DDR

<!-- Source EN PDF p.41, block 344 -->

1\. Сначала добавьте соответствующую пару частота–напряжение. См. разделы «Изменение частоты DDR» и «Изменение напряжения для заданной частоты DDR».

<!-- Source EN PDF p.41, block 345 -->

2\. Если платформа поддерживает глазковый инструмент, проверьте диаграмму по главе «Инструмент глазковой диаграммы Rockchip DDR DQ».

<!-- Source EN PDF p.41, block 346 -->

3\. Запускайте google stressapptest от высокой частоты к низкой. При ошибке снизьте частоту и повторите тест. Если ошибок нет, увеличьте время тестирования. При устойчивой работе переходите к следующему шагу.

<!-- Source EN PDF p.41, block 347 -->

Google stressapptest находится в `https://redmine.rock-chips.com/documents/49` → DDR related information_VerX.XX.7z → DDR particle verification_DDR test resource file → static_stressapptest. Использование описано в главе Guide_DDR_Verification_Process.

<!-- Source EN PDF p.41, block 348 -->

4\. Предыдущий шаг даёт приблизительную верхнюю частоту. Теперь запустите memtester. При ошибке снижайте частоту и повторяйте тест; при отсутствии ошибок увеличьте время работы. Если тест остаётся успешным, получена проверенная этим методом верхняя частотная точка.

<!-- Source EN PDF p.41, block 349 -->

Memtester находится в `https://redmine.rock-chips.com/documents/49` → DDR related information_VerX.XX.7z → DDR particle verification_DDR test resource file → static_memtester. См. главу Guide_DDR_Verification_Process.

<!-- Source EN PDF p.41, block 350 -->

Google stressapptest выполняет более грубую проверку и быстрее выявляет ошибки. Memtester проверяет тщательнее и сообщает ошибки медленнее; он ориентирован прежде всего на сигналы и покрывает часть случаев, пропускаемых google stressapptest.

<!-- Source EN PDF p.41, block 351 -->

Все эти способы являются программными тестами для быстрой оценки максимальной частоты. Они не гарантируют, что фактическая целостность сигналов DDR на этой частоте соответствует JEDEC. Необходимы измерения сигналов и длительные нагрузочные испытания.

<!-- Source EN PDF p.41, block 352 -->

### 1.19 Определение режима self-refresh

<!-- Source EN PDF p.41, block 353 -->

Режим можно определить измерением CKE; осциллограф с очень высокой полосой не требуется.

<!-- Source EN PDF p.41, block 354 -->

| Состояние CKE | Пояснение |
|---|---|
| Низкий уровень (время >7.8us) | Режим self-refresh |
| Высокий уровень | Обычная работа |

<!-- Source EN PDF p.42, block 355 -->

Если CKE периодически переключается между низким и высоким уровнями, таблица выше также применима: память входит в self-refresh, затем возвращается к обычной работе.

<!-- Source EN PDF p.42, block 356 -->

Примечание: в описанном методе низкий уровень CKE должен длиться более 7.8 us, чтобы считать состояние self-refresh. В power-down CKE тоже низкий, но менее 7.8 us. Не путайте эти случаи.

<!-- Source EN PDF p.42, block 357 -->

### 1.20 Определение режима auto power-down

<!-- Source EN PDF p.42, block 358 -->

Режим можно определить измерением CKE; осциллограф с очень высокой полосой не требуется.

<!-- Source EN PDF p.42, block 359 -->

| Состояние CKE | Пояснение |
|---|---|
| Низкий уровень (время <7.8us) | Режим power-down |
| Высокий уровень | Обычная работа |

<!-- Source EN PDF p.42, block 360 -->

В auto power-down CKE остаётся низким почти 7.8us для DDR3/DDR4 или 3.9us для LPDDR2/LPDDR3/LPDDR4, кратко становится высоким и повторяет цикл.

<!-- Source EN PDF p.42, block 361 -->

Примечание: для определения auto power-down время низкого уровня CKE должно быть меньше 7.8 us для DDR3/DDR4 или 3.9us для LPDDR2/LPDDR3/LPDDR4.

<!-- Source EN PDF p.42, block 362 -->

### 1.21 Отключение self-refresh и power-down

<!-- Source EN PDF p.42, block 363 -->

Микросхемы DDR имеют базовые функции энергосбережения, включая self-refresh и power-down; программное обеспечение также включает их для экономии энергии. При простое DDR входит в один из этих режимов в зависимости от длительности простоя.

<!-- Source EN PDF p.42, block 364 -->

Если энергосбережение не требуется, приоритетна только производительность либо у микросхемы возникают проблемы с этими режимами, их можно отключить следующим способом.

<!-- Source EN PDF p.42, block 365 -->

Установите sr_idle на рисунке в 0, чтобы запретить вход в self-refresh по времени простоя DDR.

<!-- Source EN PDF p.42, block 366 -->

![Технический рисунок исходника — PDF 42](/docs/rockchip-ddr/assets/en-p42-figure1.png)

Редактируемая расшифровка снимка (исходные поля и значения):

| Параметр | Значение | Допустимый диапазон | Unit | Описание |
|---|---|---|---|---|
| uart id | 2 |  | — | ID UART; 0xf отключает вывод UART |
| uart iomux | 0 |  | — | IOMUX UART |
| uart baudrate | 1500000 |  | bps | Поддерживает 115200 или 1500000 |
| sr_idle | 93 | 0-1023 | 32clk | Число тактов простоя DRAM до self refresh; 0 отключает |
| pd_idle | 13 | 0-127 | 32clk | Число тактов простоя DRAM до power down; 0 отключает |

<!-- Source EN PDF p.42, block 367 -->

Установите pd_idle на рисунке в 0, чтобы запретить вход DDR в

<!-- Source EN PDF p.42, block 368 -->

power-down по времени простоя.

<!-- Source EN PDF p.43, block 369 -->

![Технический рисунок исходника — PDF 43](/docs/rockchip-ddr/assets/en-p43-figure1.png)

Редактируемая расшифровка снимка (исходные поля и значения):

| Параметр | Значение | Допустимый диапазон | Unit | Описание |
|---|---|---|---|---|
| uart id | 2 |  | — | ID UART; 0xf отключает вывод UART |
| uart iomux | 0 |  | — | IOMUX UART |
| uart baudrate | 1500000 |  | bps | Поддерживает 115200 или 1500000 |
| sr_idle | 93 | 0-1023 | 32clk | Число тактов простоя DRAM до self refresh; 0 отключает |
| pd_idle | 13 | 0-127 | 32clk | Число тактов простоя DRAM до power down; 0 отключает |

<!-- Source EN PDF p.43, block 370 -->

### 1.22 Настройка de-skew сигналов DQ/DQS/CA/CLK

<!-- Source EN PDF p.43, block 371 -->

De-skew позволяет компенсировать неодинаковую длину дорожек DDR на PCB. В DDR PHY последовательно с сигналами включены элементы задержки. Регистры skew управляют числом элементов на каждой линии и тем самым её задержкой, приближая результат к равной длине трасс.

<!-- Source EN PDF p.43, block 372 -->

#### 1.22.1 Настройка de-skew в ядре

<!-- Source EN PDF p.43, block 373 -->

Способ поддерживается только RK322Xh/RK3328; изменяется DTS.

<!-- Source EN PDF p.43, block 374 -->

SoC: RK322xh, RK3328.

<!-- Source EN PDF p.43, block 375 -->

Расположение кода:

<!-- Source EN PDF p.43, block 376 -->

```text
arch/arm64/boot/dts/rk322xh-dram-default-timing.dtsi
```

<!-- Source EN PDF p.43, block 377 -->

```text
arch/arm64/boot/dts/rk322xh-dram-2layer-timing.dtsi
```

<!-- Source EN PDF p.43, block 378 -->

Если эти файлы заменены собственными, измените соответствующие собственные файлы.

<!-- Source EN PDF p.43, block 379 -->

Способ изменения:

<!-- Source EN PDF p.43, block 380 -->

По результату инструмента deskew automatic scanning tool выберите значение mid и внесите его в соответствующее определение DTS.

<!-- Source EN PDF p.43, block 381 -->

Работа с инструментом описана в `3228H deskew automatic scanning tool instruction. pdf`.

<!-- Source EN PDF p.43, block 382 -->

#### 1.22.2 Настройка de-skew в loader

<!-- Source EN PDF p.43, block 383 -->

Изменение de-skew в loader этим способом поддерживается только RK3308.

<!-- Source EN PDF p.43, block 384 -->

SoC: RK3308.

<!-- Source EN PDF p.43, block 385 -->

Необходимые файлы и инструмент:

<!-- Source EN PDF p.43, block 386 -->

Инструмент автоматического сканирования deskew, `3308_deskew.exe`, `RK3308_DDRXPXXXXXX_Template_VXX_de-skew.txt`, `rk3308_ddr_XXXMHz_uartX_mX_vX.XX.bin`.

<!-- Source EN PDF p.43, block 387 -->

Способ изменения:

<!-- Source EN PDF p.44, block 388 -->

По результату deskew automatic scanning tool выберите mid и внесите его в соответствующее определение `RK3308_DDRXPXXXXXX_Template_VXX_de-skew.txt`. С помощью `3308_deskew.exe` перенесите определение de-skew из `rk3308_ddrxpxxxxxx_template_vxx_de-skew.txt` в `rk3308_ddr_xxxmhz_uartx_mx_vx.xx.bin`.

<!-- Source EN PDF p.44, block 389 -->

Использование описано в `deskew automatic scanning tool instruction. pdf`.

<!-- Source EN PDF p.44, block 390 -->

### 1.23 Нагрузочный тест DDR в U-Boot

<!-- Source EN PDF p.44, block 391 -->

В U-Boot портированы две распространённые программы проверки DDR: stressapptest и memtester.

<!-- Source EN PDF p.44, block 392 -->

Основные случаи применения:

<!-- Source EN PDF p.44, block 393 -->

- Если ядро не запускается, тест DDR в U-Boot помогает исключить проблему памяти.

<!-- Source EN PDF p.44, block 394 -->

- В ядре нет условий для запуска stressapptest или memtester.

<!-- Source EN PDF p.44, block 395 -->

Например, незавершённые модули ядра вызывают нестабильность системы и не позволяют длительно запускать тесты.

<!-- Source EN PDF p.44, block 396 -->

- Проверка большего объёма DDR.

<!-- Source EN PDF p.44, block 397 -->

Ядро может тестировать только память, не занятую системой. U-Boot занимает значительно меньше и позволяет проверить больший объём.

<!-- Source EN PDF p.44, block 398 -->

- Проверка заданного физического адреса.

<!-- Source EN PDF p.44, block 399 -->

#### 1.23.1 stressapptest

<!-- Source EN PDF p.44, block 400 -->

Включите:

<!-- Source EN PDF p.44, block 401 -->

make ARCH=arm64 menuconfig ->Command line interface -> DDR Tool -> Enable DDR Tool

<!-- Source EN PDF p.44, block 402 -->

И включите:

<!-- Source EN PDF p.44, block 403 -->

make ARCH=arm64 menuconfig ->Command line interface -> DDR Tool -> Enable DDR Tool -> Enable stressapptest for ddr

<!-- Source EN PDF p.44, block 404 -->

Соберите U-Boot и запишите uboot.img.

<!-- Source EN PDF p.44, block 405 -->

Перезапустите устройство. В терминале последовательного порта ПК нажимайте CTRL+C, пока U-Boot не перейдёт в командный режим:

<!-- Source EN PDF p.44, block 406 -->

```text
  pclk_top_root 100000 KHz
  aclk_low_top_root 396000 KHz
Net: No ethernet found.
Hit key to stop autoboot('CTRL+C'): 0
=> <INTERRUPT>
=> <INTERRUPT>
```

<!-- Source EN PDF p.44, block 407 -->

Введите `stressapptest -h` и выполните тест по описанию параметров.

<!-- Source EN PDF p.45, block 408 -->

#### 1.23.2 memtester

<!-- Source EN PDF p.45, block 409 -->

Включите:

<!-- Source EN PDF p.45, block 410 -->

make ARCH=arm64 menuconfig ->Command line interface -> DDR Tool -> Enable DDR Tool

<!-- Source EN PDF p.45, block 411 -->

И включите:

<!-- Source EN PDF p.45, block 412 -->

make ARCH=arm64 menuconfig ->Command line interface -> DDR Tool -> Enable DDR Tool -> Enable memtester for ddr

<!-- Source EN PDF p.45, block 413 -->

Соберите U-Boot и запишите uboot.img.

<!-- Source EN PDF p.45, block 414 -->

Перезапустите устройство. В терминале последовательного порта ПК нажимайте CTRL+C, пока U-Boot не перейдёт в командный режим:

<!-- Source EN PDF p.45, block 415 -->

```text
  pclk_top_root 100000 KHz
  aclk_low_top_root 396000 KHz
Net: No ethernet found.
Hit key to stop autoboot('CTRL+C'): 0
=> <INTERRUPT>
=> <INTERRUPT>
```

<!-- Source EN PDF p.45, block 416 -->

Введите `memtester -h` и выполните тест по описанию параметров.

<!-- Source EN PDF p.45, block 417 -->

### 1.24 Включение ECC на RK3568

<!-- Source EN PDF p.45, block 418 -->

ECC — Error Correcting Code, код исправления ошибок. DDR ECC обнаруживает и исправляет ошибки данных DDR.

<!-- Source EN PDF p.45, block 419 -->

RK3568 поддерживает SideBand ECC: рядом с каналом данных DDR устанавливается дополнительный кристалл для хранения ECC.

<!-- Source EN PDF p.45, block 420 -->

Поддерживается исправление однобитовых и обнаружение двухбитовых ошибок: SEC/DED ECC (Single Error Correction/Double Error Detection).

<!-- Source EN PDF p.45, block 421 -->

1\. Включение ECC: при подключении микросхемы DDR к DDR_ECC_DQ0-7 ECC включается автоматически.

<!-- Source EN PDF p.45, block 422 -->

2\. Назначение DDR_ECC_DQ0-7: реализация использует 32 бита данных DQ и 7 бит ECC.

<!-- Source EN PDF p.45, block 423 -->

DDR_ECC_DQ0-7 хранит ECC, вычисленные из DQ0-DQ31. Для этого к DDR_ECC_DQ0-7 требуется дополнительная микросхема DDR.

<!-- Source EN PDF p.45, block 424 -->

3\. Дополнительная микросхема должна иметь тот же тип DRAM и то же число строк, столбцов и банков, что микросхемы на DQ0-31.

<!-- Source EN PDF p.45, block 425 -->

4\. Поддерживаемые типы DRAM: исходник указывает поддержку ECC для всех типов DRAM в данном контексте платформы.

<!-- Source EN PDF p.46, block 426 -->

### 1.25 Получение сведений DDR ECC в ядре

<!-- Source EN PDF p.46, block 427 -->

Информация DDR ECC доступна через архитектуру EDAC ядра. На поддерживаемой платформе, например RK3568, аппаратный ECC должен быть включён (см. предыдущий раздел). Для получения сведений включите модуль edac в DTSI. Если в DTSI платформы нет узла edac, описанная поддержка отсутствует.

<!-- Source EN PDF p.46, block 428 -->

```text
edac: edac {
    ...
    status = "okay";
};
```

<!-- Source EN PDF p.46, block 429 -->

RK EDAC регистрируется в системе по следующему пути:

<!-- Source EN PDF p.46, block 430 -->

```text
sys/devices/system/edac/mc/mc0
or
sys/bus/edac/devices/mc/mc0/
```

<!-- Source EN PDF p.46, block 431 -->

Получение имени RK EDAC:

<!-- Source EN PDF p.46, block 432 -->

```text
# cat sys/devices/system/edac/mc/mc0/mc_name
rk_edac_ecc
```

<!-- Source EN PDF p.46, block 433 -->

Получение числа однобитовых исправляемых ошибок ce с текущей загрузки:

<!-- Source EN PDF p.46, block 434 -->

```text
# cat sys/devices/system/edac/mc/mc0/ce_count
0
```

<!-- Source EN PDF p.46, block 435 -->

Получение числа многобитовых неисправляемых ошибок ue с текущей загрузки:

<!-- Source EN PDF p.46, block 436 -->

```text
# cat sys/devices/system/edac/mc/mc0/ue_count
0
```

<!-- Source EN PDF p.46, block 437 -->

После перезагрузки ядро заново инициализирует EDAC и счётчики. Прежние значения очищаются; подсчёт начинается с нуля.

<!-- Source EN PDF p.46, block 438 -->

### 1.26 Программная инъекция ошибок DDR ECC в ядре

<!-- Source EN PDF p.46, block 439 -->

Для инъекции ошибок в DTS соответствующей платформы должен быть включён edac, а аппаратная часть должна поддерживать DDR ECC.

<!-- Source EN PDF p.46, block 440 -->

```text
edac: edac {
        ...
        status = "okay";
    };
```

<!-- Source EN PDF p.47, block 441 -->

После загрузки тип внедряемой ошибки выбирается через следующий узел:

<!-- Source EN PDF p.47, block 442 -->

```text
echo ce > /sys/module/rockchip_edac/parameters/edac_poison_mode
echo ue > /sys/module/rockchip_edac/parameters/edac_poison_mode
```

<!-- Source EN PDF p.47, block 443 -->

Параметр edac_poison_mode принимает два значения:

<!-- Source EN PDF p.47, block 444 -->

1\. ce — однобитовая исправляемая ошибка.

<!-- Source EN PDF p.47, block 445 -->

2\. ue — многобитовая неисправляемая ошибка.

<!-- Source EN PDF p.47, block 446 -->

Для формирования ошибок используйте следующий узел. Число, переданное echo, задаёт количество ошибок DDR ECC:

<!-- Source EN PDF p.47, block 447 -->

```text
echo 10 > /sys/module/rockchip_edac/parameters/rockchip_edac_trigger
```

<!-- Source EN PDF p.47, block 448 -->

Примечания:

<!-- Source EN PDF p.47, block 449 -->

1\. Если появилось следующее сообщение, убедитесь, что EDAC включён в ядре и аппаратная часть поддерживает DDR ECC:

<!-- Source EN PDF p.47, block 450 -->

```text
echo 1 > /sys/module/rockchip_edac/parameters/rockchip_edac_trigger
sh: echo: write error: Operation not permitted
```

<!-- Source EN PDF p.47, block 451 -->

2\. По умолчанию многобитовая неисправляемая ошибка ue вызывает перезагрузку системы. Для однобитовой ce ядро выводит предупреждение и учитывает событие в `/sys/devices/system/edac/mc/mc0/ce_count`.

<!-- Source EN PDF p.47, block 452 -->

Инъекция ошибок DDR ECC в HAL описана в главе Rockchip_Developer_Guide_HAL_DDR_ECC.

<!-- Source EN PDF p.47, block 453 -->

### 1.27 Получение идентификатора производителя DDR

<!-- Source EN PDF p.47, block 454 -->

Идентификатор производителя имеют только LPDDR, например LPDDR2/LPDDR3/LPDDR4/LPDDR4X/LPDDR5/LPDDR5X. У DDR2/DDR3/DDR4 такого идентификатора нет.

<!-- Source EN PDF p.47, block 455 -->

#### 1.27.1 Через узел dmcdbg ядра

<!-- Source EN PDF p.47, block 456 -->

Следующие платформы позволяют читать идентификатор производителя через proc/dmcdbg/dmcinfo:

<!-- Source EN PDF p.47, block 457 -->

RK3566

<!-- Source EN PDF p.47, block 458 -->

RK3568

<!-- Source EN PDF p.47, block 459 -->

RK3326

<!-- Source EN PDF p.47, block 460 -->

RK3326S

<!-- Source EN PDF p.47, block 461 -->

Сначала включите dmcdbg в DTSI платформы. Если узла нет, платформа этот способ не поддерживает. Например, на RK356X включите dmcdbg в `arch/arm64/boot/dts/rockchip/rk3568.dtsi`:

<!-- Source EN PDF p.48, block 462 -->

```text
dmcdbg: dmcdbg {
    compatible = "rockchip,rk3568-dmcdbg";
    status = "okay";
};
```

<!-- Source EN PDF p.48, block 463 -->

Пересоберите и обновите прошивку ядра, затем загрузите её. Команда `cat proc/dmcdbg/dmcinfo` показывает идентификатор производителя и другие сведения DDR.

<!-- Source EN PDF p.48, block 464 -->

```text
console:/ # cat proc/dmcdbg/dmcinfo
DramType: LPDDR4
Dram ID: MR5=0x1,MR6=0x0,MR7=0x1 /* The MR5 is the manufacturer ID, and MR6 and MR7
are the version IDs reserved for the manufacturer definition */
DramCapacity:
CS Count: 1
Bus Width: 32 bit
Column: 10
Bank: 8
CS0_Row: 16
CS1_Row: 0
DieBusWidth: 16 bit
TotalSize: 2048 MB
devfreq/dmc: Enable
governor: dmc_ondemand
cur_freq: 780000000
NOTE:
more information about dmc can get from /sys/class/devfreq/dmc.
```

<!-- Source EN PDF p.48, block 465 -->

#### 1.27.2 Через сообщения loader

<!-- Source EN PDF p.48, block 466 -->

Вывод loader RK3576/RK3588 содержит идентификатор производителя:

<!-- Source EN PDF p.48, block 467 -->

```text
DDR ... v1.14
LPDDR5, 2736MHz
channel[0] BW=16 Col=10 Bk=16 CS0 Row=15 CS1 Row=15 CS=2 Die BW=16 Size=2048MB
channel[1] BW=16 Col=10 Bk=16 CS0 Row=15 CS1 Row=15 CS=2 Die BW=16 Size=2048MB
channel[2] BW=16 Col=10 Bk=16 CS0 Row=15 CS1 Row=15 CS=2 Die BW=16 Size=2048MB
channel[3] BW=16 Col=10 Bk=16 CS0 Row=15 CS1 Row=15 CS=2 Die BW=16 Size=2048MB
Manufacturer ID:0xff /* This is the manufacturer ID */
...
change to F0: 2736MHz
out
```

<!-- Source EN PDF p.48, block 468 -->

Вывод loader RK3399 содержит идентификатор производителя:

<!-- Source EN PDF p.49, block 469 -->

```text
DDR Version ...
In
channel 0
...
MR5=0xFF /* This is the manufacturer ID */
...
change freq to 416MHz 0,1
Channel 0: LPDDR4,416MHz
Bus Width=32 Col=10 Bank=8 Row=16 CS=1 Die Bus-Width=16 Size=2048MB
Channel 1: LPDDR4,416MHz
Bus Width=32 Col=10 Bank=8 Row=16 CS=1 Die Bus-Width=16 Size=2048MB
...
OUT
```

<!-- Source EN PDF p.49, block 470 -->

#### 1.27.3 Важные замечания

<!-- Source EN PDF p.49, block 471 -->

Обратите внимание:

<!-- Source EN PDF p.49, block 472 -->

1\. Идентификатор производителя есть только у LPDDR2/LPDDR3/LPDDR4/LPDDR4X/LPDDR5/LPDDR5X; у DDR2/DDR3/DDR4 его нет.

<!-- Source EN PDF p.49, block 473 -->

2\. Идентификатор обозначает производителя кристалла, а не марку корпусированной памяти. Многие поставщики DDR не изготавливают собственные пластины.

<!-- Source EN PDF p.49, block 474 -->

3\. Для LPDDR нельзя получить модель, напечатанную на корпусе. Это отличается от NAND Flash и eMMC.

<!-- Source EN PDF p.49, block 475 -->

4\. Расшифровка идентификатора производителя кристалла следует стандарту JEDEC JEP166.

<!-- Source EN PDF p.49, block 476 -->

#### 1.27.4 Таблицы идентификаторов производителей

<!-- Source EN PDF p.49, block 477 -->

Ниже приведены таблицы, актуальные на момент подготовки исходного документа.

<!-- Source EN PDF p.49, block 478 -->

Таблицы могут обновляться. Для поиска новой версии используйте JEP166 на `https://www.jedec.org`.

<!-- Source EN PDF p.49, block 479 -->

Таблица идентификаторов LPDDR2 и LPDDR3:

<!-- Source EN PDF p.50, block 480 -->

| Значение MR5 | Производитель |
|---|---|
| 0x1 | Samsung |
| 0x2 | Qimonda |
| 0x3 | Elpida |
| 0x4 | Etron |
| 0x5 | Nanya |
| 0x6 | SK hynix |
| 0x7 | Mosel |
| 0x8 | Winbond |
| 0x9 | ESMT |
| 0xa | Zentel |
| 0xb | Spansion |
| 0xc | SST |
| 0xd | ZMOS |
| 0xe | Intel |
| 0x12 | Being Advanced Memory Corp |
| 0x1a | Xi'an UniIC Semiconductors Co., Ltd |
| 0x1b | ISSI |
| 0x1c | JSC |
| 0xaa | Tezzaron |
| 0xc2 | Macronix |
| 0xf8 | Fidelix |
| 0xfc | eveRAM |
| 0xfd | AP Memory |
| 0xfe | Numonyx |
| 0xff | Micron |

<!-- Source EN PDF p.50, block 481 -->

Таблица идентификаторов LPDDR4:

<!-- Source EN PDF p.51, block 482 -->

| Значение MR5 | Производитель |
|---|---|
| 0x1 | Samsung |
| 0x5 | Nanya |
| 0x6 | SK hynix |
| 0x8 | Winbond |
| 0x9 | ESMT |
| 0x13 | CXMT |
| 0x1a | Xi'an UniIC Semiconductors Co., Ltd |
| 0x1c | JSC |
| 0xf8 | Fidelix |
| 0xf9 | Ultra Memory |
| 0xfd | AP Memory |
| 0xff | Micron |

<!-- Source EN PDF p.51, block 483 -->

Таблица идентификаторов LPDDR5:

<!-- Source EN PDF p.51, block 484 -->

| Значение MR5 | Производитель |
|---|---|
| 0x1 | Samsung |
| 0x5 | Nanya |
| 0x6 | SK hynix |
| 0x8 | Winbond |
| 0x9 | ESMT |
| 0x13 | CXMT |
| 0xe5 | Dosilicon |
| 0xff | Micron |

<!-- Source EN PDF p.52, block 485 -->

### 1.28 Частые вопросы о сигналах

<!-- Source EN PDF p.52, block 486 -->

#### 1.28.1 tINIT3 не соответствует протоколу

<!-- Source EN PDF p.52, block 487 -->

Причина: при инициализации DDR на Rockchip RESET срабатывает несколько раз. При измерении за начало tINIT3 ошибочно принимают первый переход RESET в высокий уровень, поэтому результат не соответствует протоколу.

<!-- Source EN PDF p.52, block 488 -->

Правильная точка измерения tINIT3 — последний переход RESET в высокий уровень, как показано ниже.

<!-- Source EN PDF p.52, block 489 -->

Нельзя использовать M2; следует использовать M3.

<!-- Source EN PDF p.52, block 490 -->

![Технический рисунок исходника — PDF 52](/docs/rockchip-ddr/assets/en-p52-figure1.png)

<!-- Source EN PDF p.52, block 491 -->

#### 1.28.2 Ограничения включения ODT

<!-- Source EN PDF p.52, block 492 -->

По утверждению исходника со ссылкой на JEDEC, LPDDR4/LPDDR4X не допускают включение ODT ниже 800MHz.

<!-- Source EN PDF p.52, block 493 -->

По утверждению исходника со ссылкой на JEDEC, DDR4 не допускает включение ODT ниже 625MHz.

<!-- Source EN PDF p.53, block 494 -->

### 1.29 Частота регенерации при высокой температуре

<!-- Source EN PDF p.53, block 495 -->

При температуре выше 85°C исходник требует удвоенной частоты регенерации DDR.

<!-- Source EN PDF p.53, block 496 -->

Это особенно важно для промышленных и автомобильных изделий.

<!-- Source EN PDF p.53, block 497 -->

На платформе Rockchip предусмотрены следующие способы удвоения частоты регенерации.

<!-- Source EN PDF p.53, block 498 -->

LPDDR4/LPDDR4X/LPDDR5/LPDDR5X имеют собственный датчик температуры и через MR4 сообщают требуемую частоту регенерации. На некоторых платформах Rockchip реализован Automatic Temperature Derating (derate): частота автоматически меняется по MR4 и соответствует температуре кристалла DDR.

<!-- Source EN PDF p.53, block 499 -->

Для LPDDR3 derate не поддерживается по аппаратным причинам, поэтому принудительно применяется удвоенная частота регенерации.

<!-- Source EN PDF p.53, block 500 -->

DDR3 и DDR4 не имеют собственного датчика температуры и функции MR4 для сообщения требуемой частоты. Derate неприменим; нужна принудительная удвоенная регенерация.

<!-- Source EN PDF p.53, block 501 -->

Для удвоения частоты можно изменить ext_temp_ref в DDR bin.

<!-- Source EN PDF p.53, block 502 -->

![Технический рисунок исходника — PDF 53](/docs/rockchip-ddr/assets/en-p53-figure1.png)

Редактируемая расшифровка снимка (исходные поля и значения):

| Параметр | Значение | Допустимый диапазон | Unit | Описание |
|---|---|---|---|---|
| ext_temp_ref | 0 |  | — | 0: решение кода (1x для обычного SoC, 2x для 3568M/3568J); 1: фиксированное 2x; 2: фиксированное 4x; 3: фиксированное 1x обновление |

<!-- Source EN PDF p.53, block 503 -->

Способ изменения приведён в разделе «Изменение DDR bin».

<!-- Source EN PDF p.53, block 504 -->

Примечание: для промышленных, автомобильных и широкотемпературных SoC Rockchip частоты регенерации уже изменены. Повторно удваивать их этим инструментом не требуется.

<!-- Source EN PDF p.53, block 505 -->

В инструменте фиксированным режимам 2x/4x/1x соответствует следующая таблица:

<!-- Source EN PDF p.53, block 506 -->

| ext_temp_ref | DDR2/DDR3/DDR4 | LPDDR3/LPDDR4/LPDDR4x/LPDDR5 |
|---|---|---|
| Фиксированная регенерация 1x | tREFI=7.8us | tREFI=3.9us |
| Фиксированная регенерация 2x | tREFI=3.9us | tREFI=1.95us |
| Фиксированная регенерация 4x | tREFI=1.95us | tREFI=0.975us |

<!-- Source EN PDF p.53, block 507 -->

Обычные платформы, не относящиеся к промышленным, автомобильным или широкотемпературным, по умолчанию используют 1x, кроме DRAM с включённым derate.

<!-- Source EN PDF p.53, block 508 -->

Способы обработки и требуемые версии DDR bin для промышленных, автомобильных и широкотемпературных SoC Rockchip:

<!-- Source EN PDF p.54, block 509 -->

| Платформа | Тип DDR | Способ обработки и требования к версии DDR bin |
|---|---|---|
| RK3308J/M<br>RK3308K<br>RK3308GK | Все типы DDR | rk3308_ddr_XXXMHz_uartX_mX_v1.26.bin и новее<br>По умолчанию регенерация 4x (tREFI 0.25x) |
| RK3568J/M | LPDDR3<br>DDR3<br>DDR4 | rk3568_ddr_XXXXMHz_v1.16.bin и новее<br>По умолчанию регенерация 2x (tREFI 0.5x) |
| RK3568J/M | LPDDR4<br>LPDDR4X | rk3568_ddr_XXXXMHz_v1.18.bin и новее<br>Derate включён по умолчанию |
| RK3588J/M | LPDDR4<br>LPDDR4X<br>LPDDR5<br>LPDDR5X | rk3588_ddr_XXXXMHz_v1.13.bin и новее<br>Derate включён по умолчанию |
| RV1126K | Все типы DDR | rv1126_ddr_XXXXMHz_v1.03.bin и новее<br>По умолчанию регенерация 2x (tREFI 0.5x) |

<!-- Source EN PDF p.54, block 510 -->

Платформы, в чьих DDR bin derate включён по умолчанию:

<!-- Source EN PDF p.54, block 511 -->

| Платформа | Тип DDR | Способ обработки и требования к версии DDR bin |
|---|---|---|
| RK3528 | LPDDR4<br>LPDDR4X | rk3528_ddr_XXXXMHz_v1.07.bin<br>или rk3528_ddr_XXXXMHz_2L_PCB_v1.07.bin<br>или rk3528_ddr_XXXXMHz_4BIT_PCB_v1.07.bin<br>и новее<br>Derate включён по умолчанию; лишний обратный апостроф исходника после имени файла отмечен в редакционных записях |
| RK3562 | LPDDR4<br>LPDDR4X | rk3562_ddr_XXXXMHz_v1.05.bin<br>или rk3562_ddr_XXXXMHz_ultra_v1.05.bin<br>и новее<br>Derate включён по умолчанию |
| RK3568 | LPDDR4<br>LPDDR4X | rk3568_ddr_XXXXMHz_v1.18.bin и новее<br>Derate включён по умолчанию |
| RK3576 | LPDDR4<br>LPDDR4X<br>LPDDR5<br>LPDDR5X | rk3576_ddr_XXXXMHz_v1.00.bin и новее<br>Derate включён по умолчанию |
| RK3588 | LPDDR4<br>LPDDR4X<br>LPDDR5<br>LPDDR5X | rk3588_ddr_XXXXMHz_v1.13.bin и новее<br>Derate включён по умолчанию |

<!-- Source EN PDF p.55, block 512 -->

## 2. Глава 2. Поиск неисправностей DDR

<!-- Source EN PDF p.55, block 513 -->

### 2.1 Как определить, связана ли проблема с DDR

<!-- Source EN PDF p.55, block 514 -->

1\. Проверьте журнал UART.

<!-- Source EN PDF p.55, block 515 -->

1\. Если ошибка возникает в разделе инициализации DDR загрузчика loader, исходник относит её к проблеме DDR.

<!-- Source EN PDF p.55, block 516 -->

2\. Проверьте в этом разделе число строк, столбцов и банков, тип DRAM и ширину шины. Неверные сведения могут приводить к проблемам DDR.

<!-- Source EN PDF p.55, block 517 -->

3\. Если возникает panic системы, повторите запуск и сравните адреса panic. Совпадающие адреса обычно указывают не на DDR; разные — на возможную проблему DDR или целостности питания.

<!-- Source EN PDF p.55, block 518 -->

2\. Проверьте изображение. Его искажение может указывать на проблему DDR.

<!-- Source EN PDF p.55, block 519 -->

3\. Проведите диагностические проверки:

<!-- Source EN PDF p.55, block 520 -->

1\. Уменьшите частоту ARM/GPU и, при фиксированной частоте, допустимым образом увеличьте напряжение. Если это помогает, исходник считает более вероятной проблему питания, а не DDR.

<!-- Source EN PDF p.55, block 521 -->

2\. Отключите изменение частоты DDR. Если это помогает, вероятна проблема переключения частот.

<!-- Source EN PDF p.55, block 522 -->

3\. Уменьшите частоту DDR до безопасного для проверяемой платформы значения (в исходнике приведён пример 324M). Улучшение указывает на вероятную проблему качества сигналов DDR.

<!-- Source EN PDF p.55, block 523 -->

### 2.2 Основные причины проблем DDR

<!-- Source EN PDF p.55, block 524 -->

1\. Питание:

<!-- Source EN PDF p.55, block 525 -->

1\. Недостаточное число конденсаторов, слишком большое расстояние до микросхемы или неудачное распределение.

<!-- Source EN PDF p.55, block 526 -->

2\. Обратная связь питания не возвращена от требуемой конечной точки к PMU/DC-DC.

<!-- Source EN PDF p.55, block 527 -->

3\. Проверьте выполнение медных полигонов по правилам разводки RK.

<!-- Source EN PDF p.55, block 528 -->

4\. Площадка GND непосредственно под корпусом LQFP должна быть припаяна для хорошего заземления. Иначе ухудшаются внутреннее питание и теплоотвод.

<!-- Source EN PDF p.55, block 529 -->

2\. Целостность сигналов:

<!-- Source EN PDF p.55, block 530 -->

1\. Неравная длина дорожек PCB. Некоторые платформы RK не имеют соответствующих тренировок чтения/записи; разница длин непосредственно уменьшает запас setup/hold DDR.

<!-- Source EN PDF p.55, block 531 -->

2\. Слишком малое расстояние между дорожками вызывает сильные перекрёстные помехи.

<!-- Source EN PDF p.55, block 532 -->

3\. Неравная длина ветвей T-топологии

<!-- Source EN PDF p.56, block 533 -->

ухудшает фронт сигнала и делает его немонотонным.

<!-- Source EN PDF p.56, block 534 -->

4\. Разрывы обратного пути в опорном слое. Слишком большой зазор при заливке меди может привести к тому, что переходное отверстие разрежет опорный слой и ухудшит целостность сигнала.

<!-- Source EN PDF p.56, block 535 -->

3\. Дефекты компонентов DRAM:

<!-- Source EN PDF p.56, block 536 -->

1\. Безымянные компоненты могут быть не проверены или даже отбракованы изготовителем; выход годных не гарантирован.

<!-- Source EN PDF p.56, block 537 -->

2\. У некоторых безымянных компонентов слабый драйвер, то есть неблагоприятный выходной импеданс.

<!-- Source EN PDF p.56, block 538 -->

3\. Для Hynix 4Gb C-die DDR3, например H5TQ4G63CFR, ранний код kernel 3.10 требует исправления перед использованием.

<!-- Source EN PDF p.56, block 539 -->

### 2.3 Способы локализации и устранения проблем DDR

<!-- Source EN PDF p.56, block 540 -->

Общий подход — искать закономерность зависаний: конкретная частота, связь с длительностью сна после пробуждения и т. п. Последовательно проверяйте фиксированную частоту, другие частоты, напряжение и силу драйвера, сужая область поиска. Значения должны оставаться допустимыми для конкретной аппаратуры.

<!-- Source EN PDF p.56, block 541 -->

1\. Ошибки при инициализации DDR.

<!-- Source EN PDF p.56, block 542 -->

1\. Сообщения «rd addr 0x... = 0x...», «16bit error!!!», «unknow device» обычно указывают на пайку. Инструмент Rockchip Platform DDR Test Tool помогает непосредственно локализовать такую проблему.

<!-- Source EN PDF p.56, block 543 -->

2\. Для необычных объёмов, не являющихся степенью 2, например 768MB, 1.5GB или 3GB, некоторые версии кода могут быть несовместимы. Обновите loader; если проблема остаётся, передайте сведения специалистам DDR для анализа.

<!-- Source EN PDF p.56, block 544 -->

3\. Большинство ошибок DDR loader в исходнике связывается с пайкой. В DDR test tool можно выбрать специальный тест пайки и пункты для соответствующего объёма памяти.

<!-- Source EN PDF p.56, block 545 -->

2\. Проверьте в журнале loader число строк, столбцов и банков, ширину шины и тип DRAM.

<!-- Source EN PDF p.56, block 546 -->

На рисунке первая строка — версия кода DDR, третья — частота, четвёртая — тип DDR. Пятая слева направо: ширина шины DRAM, столбцы, банки, строки, число CS, ширина шины кристалла и общий объём. Строка OUT означает успешное завершение инициализации; далее печатают usbplug или miniloader. По исходнику, Die Bus-Width больше фактической не вызывает проблемы, но значение меньше фактического приводит к сбою.

<!-- Source EN PDF p.56, block 547 -->

![Технический рисунок исходника — PDF 56](/docs/rockchip-ddr/assets/en-p56-figure1.png)

Редактируемая расшифровка снимка (исходные поля и значения):

```text
DDR Version V1.06 20171026
In
300MHz
DDR3
Bus Width=32 Col=10 Bank=8 Row=15 CS=2 Die Bus-Width=16 Size=2048MB
mach:14
OUT
Boot1 Release Time: 2017-06-12, version: 2.37
```

<!-- Source EN PDF p.56, block 548 -->

3\. Проверьте изображение.

<!-- Source EN PDF p.56, block 549 -->

При зависании системы CPU может остановиться, но VOP продолжает повторно читать данные из DDR

<!-- Source EN PDF p.57, block 550 -->

и выводить изображение. Поэтому экран позволяет предварительно оценить состояние DDR в момент зависания.

<!-- Source EN PDF p.57, block 551 -->

1\. Нормальное изображение означает, что DDR всё ещё доступна, но не исключает DDR как причину исходного сбоя.

<!-- Source EN PDF p.57, block 552 -->

2\. Если изображение искажено:

<!-- Source EN PDF p.57, block 553 -->

Как на рисунке, зависание при переключении частоты может сделать DDR недоступной. Попробуйте фиксированную частоту. Другая возможная причина — нарушение питания и работы логики контроллера DDR.

<!-- Source EN PDF p.57, block 554 -->

![Технический рисунок исходника — PDF 57](/docs/rockchip-ddr/assets/en-p57-figure1.png)

<!-- Source EN PDF p.57, block 555 -->

На следующем рисунке дефекты PCB ухудшают целостность питания и сигналов, приводя к потере синхронизации DLL DDR3. В исходнике предложено рассмотреть VCC_DDR=1.6V или обход DLL. Это исходный пример, а не разрешение подавать 1.6V на произвольную плату: сначала проверьте допустимые пределы компонентов.

<!-- Source EN PDF p.58, block 556 -->

![Технический рисунок исходника — PDF 58](/docs/rockchip-ddr/assets/en-p58-figure1.png)

<!-- Source EN PDF p.58, block 557 -->

4\. Проверка питания.

<!-- Source EN PDF p.58, block 558 -->

1\. Зафиксируйте CPU/GPU на более низкой частоте и допустимым образом увеличьте напряжение arm/logic. Улучшение может указывать на питание.

<!-- Source EN PDF p.58, block 559 -->

2\. Проверьте разводку питания.

<!-- Source EN PDF p.58, block 560 -->

3\. Измерьте пульсации питания.

<!-- Source EN PDF p.58, block 561 -->

5\. Проверка целостности сигналов.

<!-- Source EN PDF p.58, block 562 -->

1\. Уменьшите частоту DDR. Улучшение делает проблему целостности сигналов вероятной.

<!-- Source EN PDF p.58, block 563 -->

2\. Проверьте разводку и Gerber: трассировку и непрерывность опорного слоя.

<!-- Source EN PDF p.58, block 564 -->

3\. Допустимым образом увеличьте или уменьшите силу драйвера/ODT и оцените изменение.

<!-- Source EN PDF p.58, block 565 -->

4\. Проверьте влияние сопротивления RZQ. Исходник описывает случаи LPDDR3 220ball, где для усиления драйвера требовалось уменьшить RZQ или удалить его. Это аппаратно-зависимый пример, не универсальная инструкция для ArmSoM.

<!-- Source EN PDF p.58, block 566 -->

6\. Безымянные компоненты.

<!-- Source EN PDF p.58, block 567 -->

Если целостность питания и сигналов проверена и нарушений нет, возможна проблема ячеек DRAM. Исходник предлагает следующие проверки:

<!-- Source EN PDF p.58, block 568 -->

1\. Отключить pd_idle и sr_idle и проверить результат.

<!-- Source EN PDF p.58, block 569 -->

2\. Для DDR3 обойти DLL DRAM.

<!-- Source EN PDF p.58, block 570 -->

3\. Некоторые дефекты ячеек выявляет DDR test tool, но это лишь вспомогательное средство. PASS не доказывает отсутствие проблем DRAM или стабильность платы.

<!-- Source EN PDF p.59, block 571 -->

## 3. Глава 3. Процедура проверки DDR

<!-- Source EN PDF p.59, block 572 -->

Примечания

<!-- Source EN PDF p.59, block 573 -->

1\. Для kernel Linux 4.19, 5.10, 6.1 и новее: в Android следуйте разделу проверки DDR в Android; для Buildroot, Yocto и Debian — разделу проверки в Linux.

<!-- Source EN PDF p.59, block 574 -->

2\. Для kernel Linux 3.10 следуйте отдельному разделу проверки DDR в Linux 3.10.

<!-- Source EN PDF p.59, block 575 -->

3\. Процедуры RV1108 и RK3308 отличаются от остальных платформ. См. соответствующие разделы этой главы.

<!-- Source EN PDF p.59, block 576 -->

4\. Проверка требует тестовых файлов, описанных в исходном документе и предоставляемых вместе с ним. Это указание источника; наличие этих бинарных файлов в данной статье не подразумевается.

<!-- Source EN PDF p.59, block 577 -->

### 3.1 Проверка DDR в Android

<!-- Source EN PDF p.59, block 578 -->

#### 3.1.1 Сборка тестовой прошивки Android

<!-- Source EN PDF p.59, block 579 -->

Сначала включите изменение частоты DDR. В DTS тестируемой платы найдите dfi и dmc и установите status = "okay".

<!-- Source EN PDF p.59, block 580 -->

```text
&dfi {
    status = "okay";
};
&dmc {
    status = "okay";
    ...
};
```

<!-- Source EN PDF p.59, block 581 -->

Здесь приведено только краткое описание сборки. Подробности — в разделе «Включение и отключение изменения частоты DDR в ядре» документа Rockchip_Developer_Guide_DDR_EN.

<!-- Source EN PDF p.59, block 582 -->

#### 3.1.2 Подготовка тестовой среды Android

<!-- Source EN PDF p.59, block 583 -->

##### 3.1.2.1 Запись прошивки

<!-- Source EN PDF p.59, block 584 -->

Перед тестом определите:

<!-- Source EN PDF p.59, block 585 -->

1\. Разрядность ОС: 32 или 64 бита.

<!-- Source EN PDF p.60, block 586 -->

2\. Общий объём DDR устройства: 512MB, 1GB, 2GB и т. д.

<!-- Source EN PDF p.60, block 587 -->

3\. Максимальную частоту DDR для теста с фиксированной частотой: например 533MHz, 1560MHz или 2112MHz.

<!-- Source EN PDF p.60, block 588 -->

##### 3.1.2.2 Автоматическая подготовка среды

<!-- Source EN PDF p.60, block 589 -->

1\. В каталоге android_ddr_test_files тестового пакета дважды щёлкните push_files.bat. По подсказке скрипта и типу прошивки введите 1 или 2. Дождитесь завершения автоматической настройки.

<!-- Source EN PDF p.60, block 590 -->

Примечание: по журналу проверьте, что все действия выполнены нормально и нет сообщений об ошибках.

<!-- Source EN PDF p.60, block 591 -->

2\. Если ошибок не было, раздел ручной подготовки можно пропустить.

<!-- Source EN PDF p.60, block 592 -->

##### 3.1.2.3 Ручная подготовка среды

<!-- Source EN PDF p.60, block 593 -->

Если автоматическая настройка не удалась, выполните её вручную. Выберите и установите следующие файлы из android_ddr_test_files.

<!-- Source EN PDF p.60, block 594 -->

1\. Установите fishingjoy.

<!-- Source EN PDF p.60, block 595 -->

Примечание: fishingjoy — сторонний APK, который требуется получить самостоятельно. Можно использовать другое приложение, автоматически работающее весь тест, либо циклическое воспроизведение видео.

<!-- Source EN PDF p.60, block 596 -->

```text
<adb_tool> adb.exe install fishingjoy1.apk
```

<!-- Source EN PDF p.60, block 597 -->

2\. Передайте stressapptest.

<!-- Source EN PDF p.60, block 598 -->

По разрядности прошивки Linux (64 или 32 бита) выберите соответствующий stressapptest в каталоге static_stressapptest.

<!-- Source EN PDF p.60, block 599 -->

Пример:

<!-- Source EN PDF p.60, block 600 -->

Для Linux 32bit передайте stressapptest_32bit.

<!-- Source EN PDF p.60, block 601 -->

```text
<adb_tool> adb.exe push stressapptest_32bit /data/stressapptest
<adb_tool> adb.exe shell chmod 0777 /data/stressapptest
```

<!-- Source EN PDF p.60, block 602 -->

Для Linux 64bit передайте stressapptest_64bit.

<!-- Source EN PDF p.60, block 603 -->

```text
<adb_tool> adb.exe push stressapptest_64bit /data/stressapptest
<adb_tool> adb.exe shell chmod 0777 /data/stressapptest
```

<!-- Source EN PDF p.60, block 604 -->

3\. Передайте memtester.

<!-- Source EN PDF p.60, block 605 -->

По разрядности прошивки Linux (64 или 32 бита) выберите соответствующий memtester в каталоге static_memtester.

<!-- Source EN PDF p.61, block 606 -->

Пример:

<!-- Source EN PDF p.61, block 607 -->

Для Linux 32bit передайте memtester_32bit.

<!-- Source EN PDF p.61, block 608 -->

```text
<adb_tool> adb.exe push memtester_32bit /data/memtester
<adb_tool> adb.exe shell chmod 0777 /data/memtester
```

<!-- Source EN PDF p.61, block 609 -->

Для Linux 64bit передайте memtester_64bit.

<!-- Source EN PDF p.61, block 610 -->

```text
<adb_tool> adb.exe push memtester_64bit /data/memtester
<adb_tool> adb.exe shell chmod 0777 /data/memtester
```

<!-- Source EN PDF p.61, block 611 -->

4\. Передайте ddr_freq_scan.sh.

<!-- Source EN PDF p.61, block 612 -->

```text
<adb_tool> adb.exe push ddr_freq_scan.sh /data/ddr_freq_scan.sh
<adb_tool> adb.exe shell chmod 0777 /data/ddr_freq_scan.sh
```

<!-- Source EN PDF p.61, block 613 -->

5\. Запишите буферизованные данные файловой системы из памяти на накопитель.

<!-- Source EN PDF p.61, block 614 -->

```text
<adb_tool> adb.exe shell sync
```

<!-- Source EN PDF p.61, block 615 -->

##### 3.1.2.4 Подготовка через USB-накопитель и последовательный порт

<!-- Source EN PDF p.61, block 616 -->

Если ADB недоступен, скопируйте тестовые файлы на плату с USB-накопителя, а среду подготовьте через последовательный порт.

<!-- Source EN PDF p.61, block 617 -->

1\. Подготовка.

<!-- Source EN PDF p.61, block 618 -->

После включения запретите переход системы в сон: добавьте wake_lock командой `echo 1 > /sys/power/wake_lock` либо выберите Setting → Dsiplay → Sleep → Never sleep. Написание пункта Dsiplay сохранено из исходника.

<!-- Source EN PDF p.61, block 619 -->

Подключите USB-накопитель к ПК и скопируйте на него android_ddr_test_files.

<!-- Source EN PDF p.61, block 620 -->

Перейдите к пользователю root для получения прав.

<!-- Source EN PDF p.61, block 621 -->

```text
<rk3399:/ $> su
```

<!-- Source EN PDF p.61, block 622 -->

Подключите USB-накопитель к плате и скопируйте файлы из android_ddr_test_files, static_memtester и static_stressapptest в /data устройства. Накопитель обычно смонтирован в `/mnt/media_rw/***`; имя узла индивидуально, используйте TAB для дополнения.

<!-- Source EN PDF p.61, block 623 -->

Пример:

<!-- Source EN PDF p.61, block 624 -->

Если точка монтирования — `/mnt/media_rw/B4FE-5315`, выполните:

<!-- Source EN PDF p.61, block 625 -->

```text
<rk3399:/ #> cp -rf /mnt/media_rw/B4FE-5315/android_ddr_test_files /data/
<rk3399:/ #> cp -rf /mnt/media_rw/B4FE-5315/static_memtester /data/
<rk3399:/ #> cp -rf /mnt/media_rw/B4FE-5315/static_stressapptest /data/
```

<!-- Source EN PDF p.62, block 626 -->

2\. Автоматическая подготовка среды.

<!-- Source EN PDF p.62, block 627 -->

Для прошивки linux 32bit выберите test_files_install_32bit.sh.

<!-- Source EN PDF p.62, block 628 -->

```text
<rk3399:/ #> chmod 0777 /data/android_ddr_test_files/test_files_install_32bit.sh
<rk3399:/ #> /data/android_ddr_test_files/test_files_install_32bit.sh
```

<!-- Source EN PDF p.62, block 629 -->

Для прошивки linux 64bit выберите test_files_install_64bit.sh.

<!-- Source EN PDF p.62, block 630 -->

```text
<rk3399:/ #> chmod 0777 /data/android_ddr_test_files/test_files_install_64bit.sh
<rk3399:/ #> /data/android_ddr_test_files/test_files_install_64bit.sh
```

<!-- Source EN PDF p.62, block 631 -->

По журналу проверьте успешное выполнение каждого пункта. Если ошибок нет, ручную подготовку можно пропустить.

<!-- Source EN PDF p.62, block 632 -->

3\. Ручная подготовка среды.

<!-- Source EN PDF p.62, block 633 -->

Если автоматическая подготовка не удалась, выполните её вручную.

<!-- Source EN PDF p.62, block 634 -->

Для Linux 32bit скопируйте соответствующие тестовые файлы.

<!-- Source EN PDF p.62, block 635 -->

```text
<rk3399:/ #> cp /data/static_stressapptest/stressapptest_32bit /data/stressapptest
<rk3399:/ #> cp /data/static_memtester/memtester_32bit /data/memtester
<rk3399:/ #> cp /data/android_ddr_test_files/ddr_freq_scan.sh /data/ddr_freq_scan.sh
```

<!-- Source EN PDF p.62, block 636 -->

Для Linux 64bit скопируйте соответствующие тестовые файлы.

<!-- Source EN PDF p.62, block 637 -->

```text
<rk3399:/ #> cp /data/static_stressapptest/stressapptest_64bit /data/stressapptest
<rk3399:/ #> cp /data/static_memtester/memtester_64bit /data/memtester
<rk3399:/ #> cp /data/android_ddr_test_files/ddr_freq_scan.sh /data/ddr_freq_scan.sh
```

<!-- Source EN PDF p.62, block 638 -->

Измените права файлов.

<!-- Source EN PDF p.62, block 639 -->

```text
<rk3399:/ #> chmod 777 /data/memtester /data/stressapptest /data/ddr_freq_scan.sh
```

<!-- Source EN PDF p.62, block 640 -->

Установите fishingjoy.

<!-- Source EN PDF p.62, block 641 -->

Примечание: fishingjoy — сторонний APK, который требуется получить самостоятельно. Можно использовать другое приложение, автоматически работающее весь тест, либо циклическое воспроизведение видео.

<!-- Source EN PDF p.62, block 642 -->

```text
<rk3399:/ #> pm install /data/fishingjoy1.apk
```

<!-- Source EN PDF p.62, block 643 -->

Запишите буферизованные данные файловой системы из памяти на накопитель.

<!-- Source EN PDF p.62, block 644 -->

```text
<rk3399:/ #> sync
```

<!-- Source EN PDF p.63, block 645 -->

#### 3.1.3 Проверка объёма DDR в Android

<!-- Source EN PDF p.63, block 646 -->

Командой `<rkxxxx:/ #> cat /proc/meminfo` проверьте, соответствует ли MemTotal фактическому объёму DDR устройства.

<!-- Source EN PDF p.63, block 647 -->

Пример журнала:

<!-- Source EN PDF p.63, block 648 -->

```text
rkxxxx:/ # cat /proc/meminfo
MemTotal: 2038904 kB
```

<!-- Source EN PDF p.63, block 649 -->

512MB приблизительно соответствует 533504kB (значение исходника).

<!-- Source EN PDF p.63, block 650 -->

1GB приблизительно соответствует 1048576kB.

<!-- Source EN PDF p.63, block 651 -->

1.5GB приблизительно соответствует 1582080kB (значение исходника).

<!-- Source EN PDF p.63, block 652 -->

2GB приблизительно соответствует 2097152kB.

<!-- Source EN PDF p.63, block 653 -->

3GB приблизительно соответствует 3145728kB.

<!-- Source EN PDF p.63, block 654 -->

4GB приблизительно соответствует 4194304kB.

<!-- Source EN PDF p.63, block 655 -->

Из-за различий управления и распределения памяти небольшое отклонение нормально.

<!-- Source EN PDF p.63, block 656 -->

#### 3.1.4 Тест Android с фиксированной частотой DDR

<!-- Source EN PDF p.63, block 657 -->

1\. Запустите fishingjoy.

<!-- Source EN PDF p.63, block 658 -->

2\. Перейдите к root для получения прав.

<!-- Source EN PDF p.63, block 659 -->

```text
<rkxxxx:/ $> su
```

<!-- Source EN PDF p.63, block 660 -->

3\. Зафиксируйте частоту DDR.

<!-- Source EN PDF p.63, block 661 -->

Установите максимальную частоту DDR, поддерживаемую тестируемым устройством.

<!-- Source EN PDF p.63, block 662 -->

Пример:

<!-- Source EN PDF p.63, block 663 -->

Если требуется 2112MHz:

<!-- Source EN PDF p.63, block 664 -->

```text
<rkxxxx:/ #> /data/ddr_freq_scan.sh 2112000000
```

<!-- Source EN PDF p.63, block 665 -->

Если требуется 1056MHz:

<!-- Source EN PDF p.63, block 666 -->

```text
<rkxxxx:/ #> /data/ddr_freq_scan.sh 1056000000
```

<!-- Source EN PDF p.63, block 667 -->

Если требуется 600MHz:

<!-- Source EN PDF p.63, block 668 -->

```text
<rkxxxx:/ #> /data/ddr_freq_scan.sh 600000000
```

<!-- Source EN PDF p.63, block 669 -->

4\. По журналу проверьте правильность частоты.

<!-- Source EN PDF p.64, block 670 -->

Пример журнала:

<!-- Source EN PDF p.64, block 671 -->

```text
<rkxxxx:/ #> /data/ddr_freq_scan.sh 1560000000
already change to 1560000000 done.
change frequency to available max frequency done.
```

<!-- Source EN PDF p.64, block 672 -->

5\. Определите объём свободной памяти для тестирования DDR.

<!-- Source EN PDF p.64, block 673 -->

Выполните `free -m`. Обычно для теста выделяют 90% памяти, доступной для новых приложений, то есть значения available.

<!-- Source EN PDF p.64, block 674 -->

Пример журнала:

<!-- Source EN PDF p.64, block 675 -->

```text
<rkxxxx:/ #> free -m
               total used free shared buff/cache available
Mem: 3909 433 3294 9 181 3427
Swap: 0 0 0
```

<!-- Source EN PDF p.64, block 676 -->

Если available составляет 3427MB, для теста выбирают 3427MB \* 0.9 = 3084MB.

> Сопоставление: китайский абзац указывает 3427MB доступной памяти, но содержит 3294MB*0.9=3084MB. Английский использует 3427MB*0.9; расхождение зафиксировано без скрытого исправления.

<!-- Source EN PDF p.64, block 677 -->

6\. Запустите stressapptest более чем на 12 часов.

<!-- Source EN PDF p.64, block 678 -->

Запуск stressapptest:

<!-- Source EN PDF p.64, block 679 -->

Основные параметры stressapptest:

<!-- Source EN PDF p.64, block 680 -->

-M mbytes: объём выделяемой для теста памяти в MB.

<!-- Source EN PDF p.64, block 681 -->

-s seconds: длительность теста в секундах. Для 12 часов используется 43200 секунд.

<!-- Source EN PDF p.64, block 682 -->

Пример:

<!-- Source EN PDF p.64, block 683 -->

Если доступно 3084MB и требуется 12-часовой тест (43200 секунд), выполните:

<!-- Source EN PDF p.64, block 684 -->

```text
<rkxxxx:/ #> /data/stressapptest -s 43200 -i 4 -C 4 -W --stop_on_errors -M 3084
```

<!-- Source EN PDF p.64, block 685 -->

Проверка результатов:

<!-- Source EN PDF p.64, block 686 -->

После теста проверьте работу устройства, fishingjoy и результат PASS/FAIL stressapptest. Программа каждые 10 секунд выводит оставшееся время. Успешный результат: «Status: PASS - please verify no corrected errors»; ошибка: «Status: FAIL - test discovered HW problems».

<!-- Source EN PDF p.64, block 687 -->

7\. Запустите memtester более чем на 12 часов.

<!-- Source EN PDF p.64, block 688 -->

Запуск memtester:

<!-- Source EN PDF p.64, block 689 -->

Основной параметр memtester:

<!-- Source EN PDF p.64, block 690 -->

`<mem>m`: объём выделяемой для теста памяти в MB.

<!-- Source EN PDF p.64, block 691 -->

Пример:

<!-- Source EN PDF p.65, block 692 -->

Если для memtester доступно 3084MB, выполните:

<!-- Source EN PDF p.65, block 693 -->

```text
<rkxxxx:/ #> /data/memtester 3084m
```

<!-- Source EN PDF p.65, block 694 -->

Проверка результата:

<!-- Source EN PDF p.65, block 695 -->

После теста проверьте устройство, fishingjoy и ошибки memtester. Версия memtester из пакета изменена так, что автоматически останавливается при любой ошибке. Работа более 12 часов без остановки означает, что за этот период ошибок не обнаружено.

<!-- Source EN PDF p.65, block 696 -->

Если ошибок нет, memtester продолжает печатать следующий журнал:

<!-- Source EN PDF p.65, block 697 -->

```text
Loop 10:
    Stuck Address : ok
    Random Value : ok
    Compare XOR : ok
    Compare SUB : ok
    Compare MUL : ok
    Compare DIV : ok
    Compare OR : ok
    Compare AND : ok
    Sequential Increment: ok
    Solid Bits : ok
    Block Sequential : ok
    Checkerboard : ok
    Bit Spread : ok
    Bit Flip : ok
    Walking Ones : ok
    Walking Zeroes : ok
```

<!-- Source EN PDF p.65, block 698 -->

При обнаружении ошибки memtester автоматически завершает тест и выходит. Пример журнала:

<!-- Source EN PDF p.65, block 699 -->

```text
FAILURE: 0xffffffff != 0xffffbfff at offset 0x03b7d9e4.
EXIT_FAIL_OTHERTEST
```

<!-- Source EN PDF p.65, block 700 -->

#### 3.1.5 Тест изменения частоты DDR в Android

<!-- Source EN PDF p.65, block 701 -->

1\. Запустите fishingjoy.

<!-- Source EN PDF p.65, block 702 -->

2\. Перейдите к root для получения прав.

<!-- Source EN PDF p.65, block 703 -->

```text
<rkxxxx:/$> su
```

<!-- Source EN PDF p.65, block 704 -->

3\. Запустите memtester в фоне.

<!-- Source EN PDF p.65, block 705 -->

Основной параметр memtester:

<!-- Source EN PDF p.65, block 706 -->

`<mem>m`: объём выделяемой для теста памяти в MB.

<!-- Source EN PDF p.66, block 707 -->

Пример:

<!-- Source EN PDF p.66, block 708 -->

Определение объёма памяти для теста описано в предыдущем разделе с фиксированной частотой.

<!-- Source EN PDF p.66, block 709 -->

Если для memtester доступно 3084MB, выполните:

<!-- Source EN PDF p.66, block 710 -->

```text
<rkxxxx:/ #> /data/memtester 3084m
```

<!-- Source EN PDF p.66, block 711 -->

4\. Запустите тестовые скрипты.

<!-- Source EN PDF p.66, block 712 -->

```text
<rkxxxx9:/ #> /data/ddr_freq_scan.sh
```

<!-- Source EN PDF p.66, block 713 -->

Примечание: при принудительном изменении частоты возможно мерцание изображения, например из-за недостаточной пропускной способности. Исходник считает такое явление нормальным в этом тесте.

<!-- Source EN PDF p.66, block 714 -->

5\. Проверьте результат; длительность тестирования — более 12 часов.

<!-- Source EN PDF p.66, block 715 -->

Убедитесь, что fishingjoy и само устройство работают нормально.

<!-- Source EN PDF p.66, block 716 -->

Проверьте работу программы изменения частоты и нормальный вывод её журнала.

<!-- Source EN PDF p.66, block 717 -->

Пример журнала:

<!-- Source EN PDF p.66, block 718 -->

```text
DDR freq will change to 600000000 8786
already change to 600000000 done
DDR freq will change to 800000000 8787
already change to 800000000 done
DDR freq will change to 200000000 8788
already change to 200000000 done
```

<!-- Source EN PDF p.66, block 719 -->

Убедитесь, что memtester продолжает работать.

<!-- Source EN PDF p.66, block 720 -->

Командой `<rkxxxx:/ #> ps | grep memtester` проверьте, что процесс memtester всё ещё запущен.

<!-- Source EN PDF p.66, block 721 -->

Пример:

<!-- Source EN PDF p.66, block 722 -->

```text
<rkxxxx:/ #> ps | grep memtester
root 14309 1730 74332 68156 0 5e980bf564 R /data/memtester
```

<!-- Source EN PDF p.66, block 723 -->

#### 3.1.6 Тест перезагрузки Android

<!-- Source EN PDF p.66, block 724 -->

Тест перезагрузки через приложение Calculator:

<!-- Source EN PDF p.66, block 725 -->

\*\*Чтобы устройство не засыпало, отключите экран блокировки: setting → security → set screen lock → None. Затем выберите Setting → Dsiplay → Sleep → Never sleep.\*\* Названия меню приведены по исходнику.

<!-- Source EN PDF p.66, block 726 -->

Откройте Calculator, введите «83991906=» и нажмите RebootTest. Тест должен продолжаться более 12 часов.

<!-- Source EN PDF p.67, block 727 -->

#### 3.1.7 Тест сна Android

<!-- Source EN PDF p.67, block 728 -->

Для RK3399 с LPDDR4 этот тест обязателен; для других типов DDR и платформ — необязателен.

<!-- Source EN PDF p.67, block 729 -->

Тест сна через Calculator:

<!-- Source EN PDF p.67, block 730 -->

Отключите USB-кабель ADB. Откройте Calculator, введите «83991906=» и нажмите SleepTest. Тест должен продолжаться более 12 часов.

<!-- Source EN PDF p.67, block 731 -->

### 3.2 Проверка DDR в Linux

<!-- Source EN PDF p.67, block 732 -->

#### 3.2.1 Сборка тестовой прошивки Linux

<!-- Source EN PDF p.67, block 733 -->

Сначала включите изменение частоты DDR. В DTS тестируемой платы найдите dfi и dmc и установите status = "okay".

<!-- Source EN PDF p.67, block 734 -->

```text
&dfi {
    status = "okay";
};
&dmc {
    status = "okay";
    ...
};
```

<!-- Source EN PDF p.67, block 735 -->

Здесь приведено только краткое описание сборки. Подробности — в разделе «Включение и отключение изменения частоты DDR в ядре» документа Rockchip_Developer_Guide_DDR_EN.

<!-- Source EN PDF p.67, block 736 -->

#### 3.2.2 Подготовка тестовой среды Linux

<!-- Source EN PDF p.67, block 737 -->

##### 3.2.2.1 Запись прошивки

<!-- Source EN PDF p.67, block 738 -->

Перед тестом определите:

<!-- Source EN PDF p.67, block 739 -->

1\. Разрядность ОС: 32 или 64 бита.

<!-- Source EN PDF p.67, block 740 -->

2\. Общий объём DDR устройства: 512MB, 1GB, 2GB и т. д.

<!-- Source EN PDF p.67, block 741 -->

3\. Максимальную частоту DDR для теста с фиксированной частотой: например 533MHz, 1560MHz или 2112MHz.

<!-- Source EN PDF p.67, block 742 -->

##### 3.2.2.2 Подготовка среды

<!-- Source EN PDF p.67, block 743 -->

Прошивка SDK содержит ROCKCHIPS TEST TOOLS в каталоге /rockchip-test.

<!-- Source EN PDF p.68, block 744 -->

Если в сторонней ОС этих инструментов нет (отсутствует /rockchip-test), вручную скопируйте следующие файлы из тестового пакета DDR. Часть скриптов может требовать переноса и адаптации специалистом.

<!-- Source EN PDF p.68, block 745 -->

```text
1. linux_ddr_test_files/ddr_freq_scaling.sh
```

<!-- Source EN PDF p.68, block 746 -->

```text
2. linux_ddr_test_files/test_stress_glmark2.sh
```

<!-- Source EN PDF p.68, block 747 -->

```text
3. linux_ddr_test_files/auto_reboot.sh
```

<!-- Source EN PDF p.68, block 748 -->

```text
4. linux_ddr_test_files/suspend_resume.sh
```

<!-- Source EN PDF p.68, block 749 -->

5\. Для Linux 64-bit выберите `static_stressapptest/stressapptest_64bit` и `static_stressapptest/memtester_64bit`; для Linux 32-bit — `static_stressapptest/stressapptest_32bit` и `static_stressapptest/memtester_32bit`. Пути memtester сохранены из исходника и требуют сверки с фактическим пакетом.

<!-- Source EN PDF p.68, block 750 -->

#### 3.2.3 Проверка объёма DDR в Linux

<!-- Source EN PDF p.68, block 751 -->

Командой `root@rkxxxx:/# cat /proc/meminfo` проверьте соответствие MemTotal фактическому объёму DDR устройства.

<!-- Source EN PDF p.68, block 752 -->

Пример журнала:

<!-- Source EN PDF p.68, block 753 -->

```text
root@rkxxxx:/# cat /proc/meminfo
MemTotal: 2038904 kB
```

<!-- Source EN PDF p.68, block 754 -->

512MB приблизительно соответствует 533504kB (значение исходника).

<!-- Source EN PDF p.68, block 755 -->

1GB приблизительно соответствует 1048576kB.

<!-- Source EN PDF p.68, block 756 -->

1.5GB приблизительно соответствует 1582080kB (значение исходника).

<!-- Source EN PDF p.68, block 757 -->

2GB приблизительно соответствует 2097152kB.

<!-- Source EN PDF p.68, block 758 -->

3GB приблизительно соответствует 3145728kB.

<!-- Source EN PDF p.68, block 759 -->

4GB приблизительно соответствует 4194304kB.

<!-- Source EN PDF p.68, block 760 -->

Из-за различий управления и распределения памяти небольшое отклонение нормально.

<!-- Source EN PDF p.68, block 761 -->

#### 3.2.4 Тест Linux с фиксированной частотой DDR

<!-- Source EN PDF p.68, block 762 -->

1\. Запустите glmark2 либо другое приложение с длительной непрерывной нагрузкой на GPU или NPU.

<!-- Source EN PDF p.68, block 763 -->

```text
root@rkxxxx:/# /rockchip-test/gpu/test_stress_glmark2.sh > /dev/null &
```

<!-- Source EN PDF p.68, block 764 -->

2\. Зафиксируйте частоту DDR.

<!-- Source EN PDF p.68, block 765 -->

Установите максимальную частоту DDR, поддерживаемую тестируемым устройством.

<!-- Source EN PDF p.68, block 766 -->

Пример:

<!-- Source EN PDF p.68, block 767 -->

Если требуется 1332MHz:

<!-- Source EN PDF p.69, block 768 -->

```text
root@rkxxxx:/# /rockchip-test/ddr/ddr_freq_scaling.sh 1332000000
```

<!-- Source EN PDF p.69, block 769 -->

Если требуется 1056MHz:

<!-- Source EN PDF p.69, block 770 -->

```text
root@rkxxxx:/# /rockchip-test/ddr/ddr_freq_scaling.sh 1056000000
```

<!-- Source EN PDF p.69, block 771 -->

3\. Проверьте правильность частоты.

<!-- Source EN PDF p.69, block 772 -->

Пример журнала:

<!-- Source EN PDF p.69, block 773 -->

```text
root@rkxxxx:/# cat /sys/class/devfreq/dmc/cur_freq
1332000000
```

<!-- Source EN PDF p.69, block 774 -->

4\. Определите объём свободной памяти для теста DDR.

<!-- Source EN PDF p.69, block 775 -->

Выполните `free -m`. Обычно для теста выделяют 90% памяти, доступной для новых приложений, то есть значения available.

<!-- Source EN PDF p.69, block 776 -->

Пример журнала:

<!-- Source EN PDF p.69, block 777 -->

```text
root@rkxxxx:/# free -m
               total used free shared buff/cache available
Mem: 3909 433 3294 9 181 3427
Swap: 0 0 0
```

<!-- Source EN PDF p.69, block 778 -->

Если available составляет 3427MB, для теста выбирают 3427MB \* 0.9 = 3084MB.

> Сопоставление: китайский абзац указывает 3427MB доступной памяти, но содержит 3294MB*0.9=3084MB. Английский использует 3427MB*0.9; расхождение зафиксировано без скрытого исправления.

<!-- Source EN PDF p.69, block 779 -->

5\. Запустите stressapptest более чем на 12 часов.

<!-- Source EN PDF p.69, block 780 -->

Запуск stressapptest:

<!-- Source EN PDF p.69, block 781 -->

Основные параметры stressapptest:

<!-- Source EN PDF p.69, block 782 -->

-M mbytes: объём выделяемой для теста памяти в MB.

<!-- Source EN PDF p.69, block 783 -->

-s seconds: длительность теста в секундах. Для 12 часов используется 43200 секунд.

<!-- Source EN PDF p.69, block 784 -->

Пример:

<!-- Source EN PDF p.69, block 785 -->

Если доступно 3084MB и требуется 12-часовой тест (43200 секунд), выполните:

<!-- Source EN PDF p.69, block 786 -->

```text
root@rkxxxx:/# stressapptest -s 43200 -i 4 -C 4 -W --stop_on_errors -M 3084
```

<!-- Source EN PDF p.69, block 787 -->

Проверка результатов:

<!-- Source EN PDF p.69, block 788 -->

После теста проверьте устройство, glmark2 и результат PASS/FAIL stressapptest. Каждые 10 секунд программа выводит оставшееся время. Успех: «Status: PASS - please verify no corrected errors»; ошибка: «Status: FAIL - test discovered HW problems».

<!-- Source EN PDF p.70, block 789 -->

6\. Запустите memtester более чем на 12 часов.

<!-- Source EN PDF p.70, block 790 -->

Запуск memtester:

<!-- Source EN PDF p.70, block 791 -->

Основной параметр memtester:

<!-- Source EN PDF p.70, block 792 -->

`<mem>m`: объём выделяемой для теста памяти в MB.

<!-- Source EN PDF p.70, block 793 -->

Пример:

<!-- Source EN PDF p.70, block 794 -->

Если для memtester доступно 3084MB, выполните:

<!-- Source EN PDF p.70, block 795 -->

```text
root@rkxxxx:/# memtester 3084m
```

<!-- Source EN PDF p.70, block 796 -->

Проверка результата:

<!-- Source EN PDF p.70, block 797 -->

После теста проверьте устройство, glmark2 и ошибки memtester. Версия из тестового пакета изменена так, что автоматически останавливается при любой ошибке. Работа более 12 часов без остановки означает отсутствие обнаруженных ошибок за этот период.

<!-- Source EN PDF p.70, block 798 -->

Если ошибок нет, memtester продолжает печатать следующий журнал:

<!-- Source EN PDF p.70, block 799 -->

```text
Loop 10:
    Stuck Address : ok
    Random Value : ok
    Compare XOR : ok
    Compare SUB : ok
    Compare MUL : ok
    Compare DIV : ok
    Compare OR : ok
    Compare AND : ok
    Sequential Increment: ok
    Solid Bits : ok
    Block Sequential : ok
    Checkerboard : ok
    Bit Spread : ok
    Bit Flip : ok
    Walking Ones : ok
    Walking Zeroes : ok
```

<!-- Source EN PDF p.70, block 800 -->

При обнаружении ошибки memtester автоматически завершает тест и выходит. Пример журнала:

<!-- Source EN PDF p.70, block 801 -->

```text
FAILURE: 0xffffffff != 0xffffbfff at offset 0x03b7d9e4.
EXIT_FAIL_OTHERTEST
```

<!-- Source EN PDF p.71, block 802 -->

#### 3.2.5 Тест изменения частоты DDR в Linux

<!-- Source EN PDF p.71, block 803 -->

1\. Запустите glmark2 либо другое приложение с длительной непрерывной нагрузкой на GPU или NPU.

<!-- Source EN PDF p.71, block 804 -->

```text
root@rkxxxx:/# /rockchip-test/gpu/test_stress_glmark2.sh > /dev/null &
```

<!-- Source EN PDF p.71, block 805 -->

2\. Запустите memtester в фоне.

<!-- Source EN PDF p.71, block 806 -->

Основной параметр memtester:

<!-- Source EN PDF p.71, block 807 -->

`<mem>m`: объём выделяемой для теста памяти в MB.

<!-- Source EN PDF p.71, block 808 -->

Пример:

<!-- Source EN PDF p.71, block 809 -->

Определение объёма памяти для теста описано в предыдущем разделе с фиксированной частотой.

<!-- Source EN PDF p.71, block 810 -->

Если для memtester доступно 3084MB, выполните:

<!-- Source EN PDF p.71, block 811 -->

```text
root@rkxxxx:/# memtester 3084m > /data/memtester_log.txt &
```

<!-- Source EN PDF p.71, block 812 -->

3\. Запустите тестовые скрипты.

<!-- Source EN PDF p.71, block 813 -->

```text
root@rkxxxx:/# /rockchip-test/ddr/ddr_freq_scaling.sh
```

<!-- Source EN PDF p.71, block 814 -->

Примечание: при принудительном изменении частоты возможно мерцание изображения, например из-за недостаточной пропускной способности. Исходник считает такое явление нормальным в этом тесте.

<!-- Source EN PDF p.71, block 815 -->

4\. Проверьте результат; длительность теста — более 12 часов.

<!-- Source EN PDF p.71, block 816 -->

Убедитесь, что glmark2 и устройство работают нормально.

<!-- Source EN PDF p.71, block 817 -->

Проверьте работу программы изменения частоты и нормальный вывод её журнала.

<!-- Source EN PDF p.71, block 818 -->

Пример журнала:

<!-- Source EN PDF p.71, block 819 -->

```text
cnt: 2315, ddr freq: success change to 528000000 Hz
cnt: 2316, ddr freq: success change to 528000000 Hz
cnt: 2317, ddr freq: success change to 1332000000 Hz
```

<!-- Source EN PDF p.71, block 820 -->

Убедитесь, что memtester продолжает работать.

<!-- Source EN PDF p.71, block 821 -->

Командой `root@rkxxxx:/# ps | grep memtester` проверьте, что memtester всё ещё запущен.

<!-- Source EN PDF p.71, block 822 -->

Пример:

<!-- Source EN PDF p.71, block 823 -->

```text
root@rkxxxx:/# ps | grep memtester
root 14309 1730 74332 68156 0 5e980bf564 R /data/memtester
```

<!-- Source EN PDF p.72, block 824 -->

#### 3.2.6 Тест перезагрузки Linux

<!-- Source EN PDF p.72, block 825 -->

1\. Запустите тестовые скрипты.

<!-- Source EN PDF p.72, block 826 -->

```text
root@rkxxxx:/# /rockchip-test/auto_reboot/auto_reboot.sh
```

<!-- Source EN PDF p.72, block 827 -->

2\. Выполняйте тест более 12 часов и проверяйте работу устройства. Остановить тест можно следующей командой.

<!-- Source EN PDF p.72, block 828 -->

```text
root@rkxxxx:/# echo off > /userdata/rockchip-test/reboot_cnt
```

<!-- Source EN PDF p.72, block 829 -->

#### 3.2.7 Тест сна Linux

<!-- Source EN PDF p.72, block 830 -->

1\. Запустите тестовые скрипты.

<!-- Source EN PDF p.72, block 831 -->

```text
root@rkxxxx:/# /rockchip-test/suspend_resume/suspend_resume.sh
```

<!-- Source EN PDF p.72, block 832 -->

2\. Выполняйте тест более 12 часов и проверяйте работу устройства.

<!-- Source EN PDF p.72, block 833 -->

### 3.3 Проверка DDR в Linux 3.10

<!-- Source EN PDF p.72, block 834 -->

#### 3.3.1 Сборка тестовой прошивки Linux 3.10

<!-- Source EN PDF p.72, block 835 -->

В menuconfig ядра откройте System Type и включите DDR Test и pm_tests.

<!-- Source EN PDF p.72, block 836 -->

```text
menuconfig
System Type --->
  [*] /sys/pm_tests/ support
  [*] DDR Test
```

<!-- Source EN PDF p.72, block 837 -->

Если пункта `[] /sys/pm_tests/ support` в menuconfig нет, соберите прошивку с фиксированной или изменяемой частотой по разделам «Фиксация частоты DDR» и «Включение и отключение изменения частоты DDR в ядре» документа Rockchip_Developer_Guide_DDR_EN.

<!-- Source EN PDF p.72, block 838 -->

#### 3.3.2 Подготовка тестовой среды Linux 3.10

<!-- Source EN PDF p.72, block 839 -->

##### 3.3.2.1 Запись прошивки

<!-- Source EN PDF p.72, block 840 -->

Перед тестом определите:

<!-- Source EN PDF p.72, block 841 -->

1\. Версия Android тестовой прошивки: например android4.4, android5.0, android6.0 или android7.1.

<!-- Source EN PDF p.73, block 842 -->

2\. Разрядность ОС: 32 или 64 бита.

<!-- Source EN PDF p.73, block 843 -->

3\. Общий объём DDR: например 512MB, 1GB или 2GB.

<!-- Source EN PDF p.73, block 844 -->

4\. Для фиксированной частоты — максимальная требуемая частота DDR, например 456MHz или 533MHz.

<!-- Source EN PDF p.73, block 845 -->

5\. Для переменной частоты — диапазон, например 200MHz–456MHz или 200MHz–533MHz.

<!-- Source EN PDF p.73, block 846 -->

##### 3.3.2.2 Автоматическая подготовка среды

<!-- Source EN PDF p.73, block 847 -->

В каталоге linux3.10_ddr_test_files дважды щёлкните push_files.bat. По подсказке и типу прошивки введите 1 или 2. Дождитесь завершения автоматической настройки. Если ошибок нет, ручную подготовку можно пропустить.

<!-- Source EN PDF p.73, block 848 -->

##### 3.3.2.3 Ручная подготовка среды

<!-- Source EN PDF p.73, block 849 -->

Если автоматическая настройка не удалась, выберите и установите следующие файлы из linux3.10_ddr_test_files вручную.

<!-- Source EN PDF p.73, block 850 -->

1\. Установите fishingjoy.

<!-- Source EN PDF p.73, block 851 -->

```text
<adb_tool> adb.exe install fishingjoy1.apk
```

<!-- Source EN PDF p.73, block 852 -->

2\. Передайте google stressapptest.

<!-- Source EN PDF p.73, block 853 -->

Выберите версию stressapptest согласно версии прошивки.

<!-- Source EN PDF p.73, block 854 -->

```text
<adb_tool> adb.exe root
<adb_tool> adb.exe remount
<adb_tool> adb.exe push libstlport.so /system/lib/libstlport.so
<adb_tool> adb.exe shell chmod 644 /system/lib/libstlport.so
```

<!-- Source EN PDF p.73, block 855 -->

Для android4.4 передайте stressapptest_android4.4.

<!-- Source EN PDF p.73, block 856 -->

```text
<adb_tool> adb.exe push stressapptest_android4.4 /data/stressapptest
<adb_tool> adb.exe shell chmod 0777 /data/stressapptest
```

<!-- Source EN PDF p.73, block 857 -->

Для остальных версий Android передайте stressapptest.

<!-- Source EN PDF p.73, block 858 -->

```text
<adb_tool> adb.exe push stressapptest /data/stressapptest
<adb_tool> adb.exe shell chmod 0777 /data/stressapptest
```

<!-- Source EN PDF p.73, block 859 -->

3\. Передайте memtester.

<!-- Source EN PDF p.73, block 860 -->

Выберите memtester согласно версии прошивки.

<!-- Source EN PDF p.73, block 861 -->

Пример:

<!-- Source EN PDF p.73, block 862 -->

Для Linux 32bit передайте memtester_32bit.

<!-- Source EN PDF p.74, block 863 -->

```text
<adb_tool> adb.exe push memtester_32bit /data/memtester
<adb_tool> adb.exe shell chmod 644 /data/memtester
```

<!-- Source EN PDF p.74, block 864 -->

Для Linux 64bit передайте memtester_64bit.

<!-- Source EN PDF p.74, block 865 -->

```text
<adb_tool> adb.exe push memtester_64bit /data/memtester
<adb_tool> adb.exe shell chmod 644 /data/memtester
```

<!-- Source EN PDF p.74, block 866 -->

4\. Выполните синхронизацию.

<!-- Source EN PDF p.74, block 867 -->

```text
<adb_tool> adb.exe shell sync
```

<!-- Source EN PDF p.74, block 868 -->

#### 3.3.3 Проверка объёма DDR в Linux 3.10

<!-- Source EN PDF p.74, block 869 -->

Командой `<rkxxxx:/ $> cat /proc/meminfo` проверьте соответствие MemTotal фактическому объёму DDR.

<!-- Source EN PDF p.74, block 870 -->

Пример журнала:

<!-- Source EN PDF p.74, block 871 -->

```text
<rkxxxx:/ $> cat /proc/meminfo
MemTotal: 2038904 kB
```

<!-- Source EN PDF p.74, block 872 -->

512MB приблизительно соответствует 533504kB (значение исходника).

<!-- Source EN PDF p.74, block 873 -->

1GB приблизительно соответствует 1048576kB.

<!-- Source EN PDF p.74, block 874 -->

1.5GB приблизительно соответствует 1582080kB (значение исходника).

<!-- Source EN PDF p.74, block 875 -->

2GB приблизительно соответствует 2097152kB.

<!-- Source EN PDF p.74, block 876 -->

3GB приблизительно соответствует 3145728kB.

<!-- Source EN PDF p.74, block 877 -->

4GB приблизительно соответствует 4194304kB.

<!-- Source EN PDF p.74, block 878 -->

Из-за различий управления и распределения памяти небольшое отклонение нормально.

<!-- Source EN PDF p.74, block 879 -->

#### 3.3.4 Тест Linux 3.10 с фиксированной частотой DDR

<!-- Source EN PDF p.74, block 880 -->

1\. Запустите fishingjoy.

<!-- Source EN PDF p.74, block 881 -->

2\. Выполните su в последовательной консоли.

<!-- Source EN PDF p.74, block 882 -->

```text
<rkxxxx:/ $> su
```

<!-- Source EN PDF p.74, block 883 -->

3\. Зафиксируйте частоту DDR.

<!-- Source EN PDF p.74, block 884 -->

Установите максимальную частоту DDR, поддерживаемую тестируемым устройством.

<!-- Source EN PDF p.74, block 885 -->

Пример:

<!-- Source EN PDF p.74, block 886 -->

Если максимальная частота DDR — 533MHz:

<!-- Source EN PDF p.75, block 887 -->

```text
<rkxxxx:/ #> echo set clk_ddr 533000000 > /sys/pm_tests/clk_rate
```

<!-- Source EN PDF p.75, block 888 -->

4\. Выполняйте google stressapptest более 12 часов.

<!-- Source EN PDF p.75, block 889 -->

При общем объёме 512MB выделите 64MB для stressapptest.

<!-- Source EN PDF p.75, block 890 -->

```text
<rkxxxx:/ #> /data/stressapptest -s 43200 -i 4 -C 4 -W --stop_on_errors -M 64
```

<!-- Source EN PDF p.75, block 891 -->

При общем объёме 1GB выделите 128MB для stressapptest.

<!-- Source EN PDF p.75, block 892 -->

```text
<rkxxxx:/ #> /data/stressapptest -s 43200 -i 4 -C 4 -W --stop_on_errors -M 128
```

<!-- Source EN PDF p.75, block 893 -->

При общем объёме 2GB выделите 256MB для stressapptest.

<!-- Source EN PDF p.75, block 894 -->

```text
<rkxxxx:/ #> /data/stressapptest -s 43200 -i 4 -C 4 -W --stop_on_errors -M 256
```

<!-- Source EN PDF p.75, block 895 -->

Исходник указывает общий объём 4MB и выделение 512MB для stressapptest. Это явное противоречие размеров, сохранённое для прослеживаемости; не используйте эту строку без сверки.

<!-- Source EN PDF p.75, block 896 -->

```text
<rkxxxx:/ #> /data/stressapptest -s 43200 -i 4 -C 4 -W --stop_on_errors -M 512
```

<!-- Source EN PDF p.75, block 897 -->

5\. Проверьте результат.

<!-- Source EN PDF p.75, block 898 -->

После теста проверьте устройство, fishingjoy и результат PASS/FAIL stressapptest. Каждые 10 секунд выводится оставшееся время. После завершения успешный тест печатает Status: PASS, неуспешный — Status: FAIL.

<!-- Source EN PDF p.75, block 899 -->

6\. Выполняйте memtester более 12 часов.

<!-- Source EN PDF p.75, block 900 -->

При общем объёме 512MB выделите 64MB для memtester.

<!-- Source EN PDF p.75, block 901 -->

```text
<rkxxxx:/ #> /data/memtester 64m
```

<!-- Source EN PDF p.75, block 902 -->

При общем объёме 1GB выделите 128MB для memtester.

<!-- Source EN PDF p.75, block 903 -->

```text
<rkxxxx:/ #> /data/memtester 128m
```

<!-- Source EN PDF p.75, block 904 -->

При общем объёме 2GB выделите 256MB для memtester.

<!-- Source EN PDF p.75, block 905 -->

```text
<rkxxxx:/ #> /data/memtester 256m
```

<!-- Source EN PDF p.75, block 906 -->

При общем объёме 4GB выделите 512MB для memtester.

<!-- Source EN PDF p.75, block 907 -->

```text
<rkxxxx:/ #> /data/memtester 512m
```

<!-- Source EN PDF p.75, block 908 -->

7\. Проверьте результат.

<!-- Source EN PDF p.76, block 909 -->

После теста проверьте устройство, fishingjoy и ошибки memtester. Версия из тестового пакета изменена так, что автоматически останавливается при ошибке. Работа более 12 часов без остановки означает отсутствие обнаруженных ошибок за это время.

<!-- Source EN PDF p.76, block 910 -->

Если ошибок нет, memtester продолжает печатать следующий журнал:

<!-- Source EN PDF p.76, block 911 -->

```text
Loop 10:
    Stuck Address : ok
    Random Value : ok
    Compare XOR : ok
    Compare SUB : ok
    Compare MUL : ok
    Compare DIV : ok
    Compare OR : ok
    Compare AND : ok
    Sequential Increment: ok
    Solid Bits : ok
    Block Sequential : ok
    Checkerboard : ok
    Bit Spread : ok
    Bit Flip : ok
    Walking Ones : ok
    Walking Zeroes : ok
```

<!-- Source EN PDF p.76, block 912 -->

При обнаружении ошибки memtester автоматически завершает тест и выходит. Пример журнала:

<!-- Source EN PDF p.76, block 913 -->

```text
FAILURE: 0xffffffff != 0xffffbfff at offset 0x03b7d9e4.
EXIT_FAIL_OTHERTEST
```

<!-- Source EN PDF p.76, block 914 -->

#### 3.3.5 Тест изменения частоты DDR в Linux 3.10

<!-- Source EN PDF p.76, block 915 -->

Если ранее выполнялся тест с фиксированной частотой, перезагрузите устройство, иначе следующая команда изменения частоты не сможет работать.

<!-- Source EN PDF p.76, block 916 -->

1\. Запустите fishingjoy.

<!-- Source EN PDF p.76, block 917 -->

2\. Выполните su в последовательной консоли.

<!-- Source EN PDF p.76, block 918 -->

```text
<rkxxxx:/ $> su
```

<!-- Source EN PDF p.76, block 919 -->

3\. Запустите memtester в фоне.

<!-- Source EN PDF p.76, block 920 -->

При общем объёме 512MB выделите 64MB для memtester.

<!-- Source EN PDF p.76, block 921 -->

```text
<rkxxxx:/ #> /data/memtester 64m > /data/_log.txt &
```

<!-- Source EN PDF p.76, block 922 -->

При общем объёме 1GB выделите 128MB для memtester.

<!-- Source EN PDF p.77, block 923 -->

```text
<rkxxxx:/ #> /data/memtester 128m > /data/memtester_log.txt &
```

<!-- Source EN PDF p.77, block 924 -->

При общем объёме 2GB выделите 256MB для memtester.

<!-- Source EN PDF p.77, block 925 -->

```text
<rkxxxx:/ #> /data/memtester 256m > /data/memtester_log.txt &
```

<!-- Source EN PDF p.77, block 926 -->

При общем объёме 4GB выделите 512MB для memtester.

<!-- Source EN PDF p.77, block 927 -->

```text
<rkxxxx:/ #> /data/memtester 512m > /data/memtester_log.txt &
```

<!-- Source EN PDF p.77, block 928 -->

4\. Выполните команду изменения частоты.

<!-- Source EN PDF p.77, block 929 -->

Задайте диапазон согласно поддерживаемым частотам тестируемого устройства.

<!-- Source EN PDF p.77, block 930 -->

Пример:

<!-- Source EN PDF p.77, block 931 -->

Если устройство поддерживает диапазон от 200MHZ до 533MHz:

<!-- Source EN PDF p.77, block 932 -->

```text
<rkxxxx:/ #> echo 'a:200M-533M-1000000T' > proc/driver/ddr_ts
```

<!-- Source EN PDF p.77, block 933 -->

5\. Проверьте результат; длительность — более 12 часов.

<!-- Source EN PDF p.77, block 934 -->

Убедитесь, что fishingjoy и само устройство работают нормально.

<!-- Source EN PDF p.77, block 935 -->

Проверьте работу программы изменения частоты и нормальный вывод её журнала.

<!-- Source EN PDF p.77, block 936 -->

Убедитесь, что memtester продолжает работать. Для проверки выполните `<rkxxxx:/ #> ps | grep memtester`.

<!-- Source EN PDF p.77, block 937 -->

Пример:

<!-- Source EN PDF p.77, block 938 -->

```text
<rkxxxx:/ #> ps | grep memtester
root 14309 1730 74332 68156 0 5e980bf564 R /data/memtester
```

<!-- Source EN PDF p.77, block 939 -->

#### 3.3.6 Тест перезагрузки Linux 3.10

<!-- Source EN PDF p.77, block 940 -->

Откройте Calculator, введите «83991906=» и нажмите RebootTest. Тест должен продолжаться более 12 часов.

<!-- Source EN PDF p.77, block 941 -->

### 3.4 Проверка DDR на RV1108

<!-- Source EN PDF p.77, block 942 -->

#### 3.4.1 Сборка тестовой прошивки RV1108

<!-- Source EN PDF p.77, block 943 -->

В menuconfig ядра откройте System Type и включите DDR Test и pm_tests.

<!-- Source EN PDF p.78, block 944 -->

```text
menuconfig
System Type --->
  [*] /sys/pm_tests/ support
  [*] DDR Test
```

<!-- Source EN PDF p.78, block 945 -->

Если пункта `[] /sys/pm_tests/ support` в menuconfig нет, соберите прошивку с фиксированной или изменяемой частотой по соответствующим разделам Rockchip_Developer_Guide_DDR.

<!-- Source EN PDF p.78, block 946 -->

#### 3.4.2 Подготовка тестовой среды RV1108

<!-- Source EN PDF p.78, block 947 -->

Скопируйте stressapptest и memtester_32bit из rv1108_ddr_test_files в корень SD-карты и вставьте её в тестируемую плату.

<!-- Source EN PDF p.78, block 948 -->

#### 3.4.3 Проверка объёма DDR на RV1108

<!-- Source EN PDF p.78, block 949 -->

Командой `<rv1108:/ #> cat /proc/meminfo` проверьте соответствие MemTotal фактическому объёму DDR.

<!-- Source EN PDF p.78, block 950 -->

Пример журнала:

<!-- Source EN PDF p.78, block 951 -->

```text
<rv1108:/ #> cat /proc/meminfo
MemTotal: 133376 kB
```

<!-- Source EN PDF p.78, block 952 -->

64MB приблизительно соответствует 66688kB (значение исходника).

<!-- Source EN PDF p.78, block 953 -->

128MB приблизительно соответствует 133376kB (значение исходника).

<!-- Source EN PDF p.78, block 954 -->

256MB приблизительно соответствует 266752kB (значение исходника).

<!-- Source EN PDF p.78, block 955 -->

512MB приблизительно соответствует 533504kB (значение исходника).

<!-- Source EN PDF p.78, block 956 -->

Из-за различий управления и распределения памяти небольшое отклонение нормально.

<!-- Source EN PDF p.78, block 957 -->

#### 3.4.4 Тест RV1108 с фиксированной частотой DDR

<!-- Source EN PDF p.78, block 958 -->

1\. Зафиксируйте частоту DDR.

<!-- Source EN PDF p.78, block 959 -->

Установите максимальную частоту DDR, поддерживаемую тестируемым устройством.

<!-- Source EN PDF p.78, block 960 -->

Пример:

<!-- Source EN PDF p.78, block 961 -->

Если максимальная поддерживаемая частота DDR — 800MHz:

<!-- Source EN PDF p.78, block 962 -->

```text
<rv1108:/ #> echo set clk_ddr 800000000 > /sys/pm_tests/clk_rate
```

<!-- Source EN PDF p.78, block 963 -->

2\. Выполняйте google stressapptest более 12 часов.

<!-- Source EN PDF p.78, block 964 -->

При общем объёме 128MB выделите 16MB для stressapptest. Обычно выделяется одна восьмая общего объёма.

<!-- Source EN PDF p.79, block 965 -->

```text
<rv1108:/ #> /mnt/sdcard/stressapptest -s 500 -i 1 -C 1 -W --stop_on_errors -M 16
```

<!-- Source EN PDF p.79, block 966 -->

3\. Проверьте результат.

<!-- Source EN PDF p.79, block 967 -->

После теста проверьте устройство и результат PASS/FAIL stressapptest. Каждые 10 секунд выводится оставшееся время. После завершения успех обозначается Status: PASS, ошибка — Status: FAIL.

<!-- Source EN PDF p.79, block 968 -->

4\. Выполняйте memtester более 12 часов.

<!-- Source EN PDF p.79, block 969 -->

При общем объёме 128MB выделите 16MB для stressapptest. Обычно выделяется одна восьмая общего объёма.

<!-- Source EN PDF p.79, block 970 -->

```text
<rv1108:/ #> /mnt/sdcard/memtester_32bit 16m
```

<!-- Source EN PDF p.79, block 971 -->

5\. Проверьте результат.

<!-- Source EN PDF p.79, block 972 -->

После теста проверьте устройство и ошибки memtester. Версия из тестового пакета изменена так, что автоматически останавливается при любой ошибке. Работа более 12 часов означает отсутствие обнаруженных ошибок за этот период.

<!-- Source EN PDF p.79, block 973 -->

Если ошибок нет, memtester продолжает печатать следующий журнал:

<!-- Source EN PDF p.79, block 974 -->

```text
Loop 10:
     Stuck Address : ok
     Random Value : ok
     Compare XOR : ok
     Compare SUB : ok
     Compare MUL : ok
     Compare DIV : ok
     Compare OR : ok
     Compare AND : ok
     Sequential Increment: ok
     Solid Bits : ok
     Block Sequential : ok
     Checkerboard : ok
     Bit Spread : ok
     Bit Flip : ok
     Walking Ones : ok
     Walking Zeroes : ok
```

<!-- Source EN PDF p.79, block 975 -->

При обнаружении ошибки memtester автоматически завершает тест и выходит. Пример журнала:

<!-- Source EN PDF p.79, block 976 -->

```text
FAILURE: 0xffffffff != 0xffffbfff at offset 0x03b7d9e4.
EXIT_FAIL_OTHERTEST
```

<!-- Source EN PDF p.80, block 977 -->

#### 3.4.5 Тест изменения частоты DDR на RV1108

<!-- Source EN PDF p.80, block 978 -->

Если ранее выполнялся тест с фиксированной частотой, перезагрузите устройство, иначе следующая команда изменения частоты не сможет работать.

<!-- Source EN PDF p.80, block 979 -->

1\. Запустите memtester в фоне.

<!-- Source EN PDF p.80, block 980 -->

При общем объёме 128MB выделите 16MB для memtester. Обычно выделяется одна восьмая общего объёма.

<!-- Source EN PDF p.80, block 981 -->

```text
<rv1108:/ #> /mnt/sdcard/memtester_32bit 16m > /data/memtester_log.txt &
```

<!-- Source EN PDF p.80, block 982 -->

2\. Выполните команду изменения частоты.

<!-- Source EN PDF p.80, block 983 -->

Тестовый диапазон — от 400MHz до максимальной частоты устройства.

<!-- Source EN PDF p.80, block 984 -->

Пример:

<!-- Source EN PDF p.80, block 985 -->

Если максимальная частота DDR устройства — 800MHz:

<!-- Source EN PDF p.80, block 986 -->

```text
<rv1108:/ #> echo 'a:400M-800M-1000000T' > proc/driver/ddr_ts
```

<!-- Source EN PDF p.80, block 987 -->

3\. Проверьте результат; длительность теста — более 12 часов.

<!-- Source EN PDF p.80, block 988 -->

Убедитесь, что устройство работает нормально.

<!-- Source EN PDF p.80, block 989 -->

Проверьте работу программы изменения частоты DDR и нормальный вывод журнала.

<!-- Source EN PDF p.80, block 990 -->

Убедитесь, что memtester продолжает работать, командой `<rkxxxx:/ #> ps | grep memtester`.

<!-- Source EN PDF p.80, block 991 -->

Пример:

<!-- Source EN PDF p.80, block 992 -->

```text
<rkxxxx:/ #> ps | grep memtester
root 14309 1730 74332 68156 0 5e980bf564 R /data/memtester
```

<!-- Source EN PDF p.80, block 993 -->

#### 3.4.6 Тест перезагрузки RV1108

<!-- Source EN PDF p.80, block 994 -->

Можно использовать встроенную функцию 1108: menu → debug → reboot test.

<!-- Source EN PDF p.80, block 995 -->

### 3.5 Проверка DDR на RK3308

<!-- Source EN PDF p.80, block 996 -->

#### 3.5.1 Проверка объёма DDR на RK3308

<!-- Source EN PDF p.80, block 997 -->

Командой `<rk3308:/ #> cat /proc/meminfo` проверьте соответствие MemTotal фактическому объёму DDR.

<!-- Source EN PDF p.80, block 998 -->

Пример журнала:

<!-- Source EN PDF p.81, block 999 -->

```text
<rk3308:/ #> cat /proc/meminfo
MemTotal: 246832 kB
MemFree: 201800 kB
```

<!-- Source EN PDF p.81, block 1000 -->

64MB приблизительно соответствует 66688kB (значение исходника).

<!-- Source EN PDF p.81, block 1001 -->

128MB приблизительно соответствует 133376kB (значение исходника).

<!-- Source EN PDF p.81, block 1002 -->

256MB приблизительно соответствует 266752kB (значение исходника).

<!-- Source EN PDF p.81, block 1003 -->

512MB приблизительно соответствует 533504kB (значение исходника).

<!-- Source EN PDF p.81, block 1004 -->

Из-за различий управления и распределения памяти небольшое отклонение нормально.

<!-- Source EN PDF p.81, block 1005 -->

#### 3.5.2 Тест RK3308 с фиксированной частотой DDR

<!-- Source EN PDF p.81, block 1006 -->

RK3308 не поддерживает изменение частоты DDR: она задаётся loader при инициализации и далее не меняется. Используйте loader с максимальной частотой. Для DDR3 исходник указывает 800MHz, для DDR2 и LPDDR2 — 533MHz.

<!-- Source EN PDF p.81, block 1007 -->

1\. Выполняйте memtester более 12 часов.

<!-- Source EN PDF p.81, block 1008 -->

Сначала проверьте наличие тестового файла:

<!-- Source EN PDF p.81, block 1009 -->

```text
<rk3308:/ #> ls usr/bin/memtester
usr/bin/memtester
```

<!-- Source EN PDF p.81, block 1010 -->

Если memtester имеется, команда следующая. При общем объёме 128MB выделите 16MB, обычно одну восьмую общей памяти.

<!-- Source EN PDF p.81, block 1011 -->

```text
<rk3308:/ #> memtester 16m > /data/memtester_log.txt &
```

<!-- Source EN PDF p.81, block 1012 -->

Если файла нет, через ADB передайте в /data/ файл memtester_32bit.32bit для Linux-32 либо memtester_64bit.64bit для Linux-64.

<!-- Source EN PDF p.81, block 1013 -->

Команда для Linux-32:

<!-- Source EN PDF p.81, block 1014 -->

```text
adb push \*file path*\memtester_32bit.32bit data/memtester
```

<!-- Source EN PDF p.81, block 1015 -->

Команда для Linux-64:

<!-- Source EN PDF p.81, block 1016 -->

```text
adb push \*file path*\memtester_64bit.64bit data/memtester
```

<!-- Source EN PDF p.81, block 1017 -->

Измените права:

<!-- Source EN PDF p.81, block 1018 -->

```text
<rk3308:/ #> chmod 777 /data/memtester
```

<!-- Source EN PDF p.81, block 1019 -->

Команда memtester ниже. При общем объёме 128MB выделите 16MB, обычно одну восьмую общей памяти.

<!-- Source EN PDF p.82, block 1020 -->

```text
<rk3308:/ #> /data/memtester 16m > /data/memtester_log.txt &
```

<!-- Source EN PDF p.82, block 1021 -->

2\. Проверьте результат.

<!-- Source EN PDF p.82, block 1022 -->

После теста убедитесь, что устройство работает нормально.

<!-- Source EN PDF p.82, block 1023 -->

Проверьте ошибки memtester. \*\*В этом варианте memtester не останавливается автоматически при ошибке; необходимо проверить весь вывод.\*\*

<!-- Source EN PDF p.82, block 1024 -->

Если ошибок нет, memtester продолжает печатать следующий журнал:

<!-- Source EN PDF p.82, block 1025 -->

```text
Loop 1:
  Stuck Address : ok
  Random Value : ok
  Compare XOR : ok
  Compare SUB : ok
  Compare MUL : ok
  Compare DIV : ok
  Compare OR : ok
  Compare AND : ok
  Sequential Increment: ok
  Solid Bits : ok
  Block Sequential : ok
  Checkerboard : ok
  Bit Spread : ok
  Bit Flip : ok
  Walking Ones : ok
  Walking Zeroes : ok
  8-bit Writes : ok
  16-bit Writes : ok
```

<!-- Source EN PDF p.82, block 1026 -->

При ошибке memtester не останавливается автоматически. Пример журнала:

<!-- Source EN PDF p.82, block 1027 -->

```text
Loop 92:
  Stuck Address : ok
  Random Value : FAILURE: 0x37fe0f4190f6b999 != 0x37fe0f4196f6b999 at offset
0x0027a958.
FAILURE: 0x2823d0d6f62a4b01 != 0x2823d0d6f02a4b01 at offset 0x0027a958.
  Compare XOR : FAILURE: 0x4c4f418e764340e8 != 0x4c4f418e704340e8 at offset
0x0027a958.
  Compare SUB : FAILURE: 0x2856fb8ee22bd230 != 0xfe5ee503ee2bd230 at offset
0x0027a958.
  Compare MUL : FAILURE: 0x00000000 != 0x00000001 at offset 0x0027a958.
  Compare DIV : FAILURE: 0xefb2eceaffbf9604 != 0xefb2eceaffbf9605 at offset
0x0027a958.
  Compare OR : FAILURE: 0xcbb2a0e8cfbb8200 != 0xcbb2a0e8cfbb8201 at offset
0x0027a958.
  Compare AND : Sequential Increment: ok
  Solid Bits : ok
  Block Sequential : ok
  Checkerboard : ok
  Bit Spread : ok
  Bit Flip : ok
Walking Ones : ok
Walking Zeroes : ok
8-bit Writes : ok
16-bit Writes : ok
```

<!-- Source EN PDF p.83, block 1029 -->

3\. Выполняйте google stressapptest более 12 часов.

<!-- Source EN PDF p.83, block 1030 -->

Сначала проверьте наличие тестового файла:

<!-- Source EN PDF p.83, block 1031 -->

```text
<rk3308:/ #> ls usr/bin/stressapptest
usr/bin/stressapptest
```

<!-- Source EN PDF p.83, block 1032 -->

Если stressapptest имеется, используйте следующую команду. При общем объёме 256MB выделите 32MB, обычно одну восьмую памяти. Параметр -s задаёт время в секундах; команда ниже выполняет тест 24 часа.

<!-- Source EN PDF p.83, block 1033 -->

```text
<rk3308:/ #> stressapptest -s 86400 -i 4 -C 4 -W --stop_on_errors -M 32
```

<!-- Source EN PDF p.83, block 1034 -->

Если файла нет, передайте через ADB в /data/ stressapptest_32bit для Linux-32 либо stressapptest_64bit для Linux-64.

<!-- Source EN PDF p.83, block 1035 -->

Команда для Linux-32:

<!-- Source EN PDF p.83, block 1036 -->

```text
adb push \*file path*\stressapptest_32bit data/stressapptest
```

<!-- Source EN PDF p.83, block 1037 -->

Команда для Linux-64:

<!-- Source EN PDF p.83, block 1038 -->

```text
adb push \*file path*\stressapptest_64bit data/stressapptest
```

<!-- Source EN PDF p.83, block 1039 -->

Измените права:

<!-- Source EN PDF p.83, block 1040 -->

```text
<rk3308:/ #> chmod 777 /data/stressapptest
```

<!-- Source EN PDF p.83, block 1041 -->

Команда stressapptest ниже. При общем объёме 256MB выделите 32MB, обычно одну восьмую памяти. В примере тест длится 24 часа.

<!-- Source EN PDF p.83, block 1042 -->

```text
<rk3308:/ #> /data/stressapptest -s 86400 -i 4 -C 4 -W --stop_on_errors -M 32
```

<!-- Source EN PDF p.83, block 1043 -->

4\. Проверьте результат.

<!-- Source EN PDF p.83, block 1044 -->

После теста убедитесь, что устройство работает нормально.

<!-- Source EN PDF p.83, block 1045 -->

Проверьте PASS/FAIL stressapptest. Каждые 10 секунд программа выводит оставшееся время; после завершения успех обозначается Status: PASS, ошибка — Status: FAIL.

<!-- Source EN PDF p.84, block 1046 -->

#### 3.5.3 Тест сна и пробуждения RK3308

<!-- Source EN PDF p.84, block 1047 -->

Для теста ядро должно поддерживать автоматическое пробуждение. В файле rk3308.dtsi найдите rockchip_suspend и добавьте RKPM_TIMEOUT_WAKEUP_EN побитовым ИЛИ, как показано ниже. В исходнике имя файла напечатано «rk3308. dtsi» с пробелом.

<!-- Source EN PDF p.84, block 1048 -->

```text
rockchip_suspend: rockchip-suspend {
                ...
                rockchip,wakeup-config = <
                        (0
                        | RKPM_GPIO0_WAKEUP_EN
                        | RKPM_TIMEOUT_WAKEUP_EN
                        )
                >;
        };
```

<!-- Source EN PDF p.84, block 1049 -->

После сборки прошивки рекомендуется тестовый скрипт. Сначала проверьте его наличие:

<!-- Source EN PDF p.84, block 1050 -->

```text
<rk3308:/ #> ls rockchip_test/rockchip_test.sh
rockchip_test/rockchip_test.sh
```

<!-- Source EN PDF p.84, block 1051 -->

Если файл есть, команда следующая:

<!-- Source EN PDF p.84, block 1052 -->

```text
<rk3308:/ #> /rockchip_test/rockchip_test.sh
...
please input your test moudle: //the serial console first input 8<enter>, then 1<enter>
8
1
```

<!-- Source EN PDF p.84, block 1053 -->

Если файла нет, выполните команду теста сна непосредственно в последовательной консоли:

<!-- Source EN PDF p.84, block 1054 -->

```text
<rk3308:/ #> while true; do echo mem > /sys/power/state; sleep 5; done
```

<!-- Source EN PDF p.84, block 1055 -->

Выполняйте тест более 12 часов, затем проверьте работу устройства.

<!-- Source EN PDF p.84, block 1056 -->

#### 3.5.4 Тест перезагрузки RK3308

<!-- Source EN PDF p.84, block 1057 -->

Рекомендуется скрипт проверки перезагрузки 3308. Сначала проверьте его наличие:

<!-- Source EN PDF p.84, block 1058 -->

```text
<rk3308:/ #> ls rockchip_test/rockchip_test.sh
rockchip_test/rockchip_test.sh
```

<!-- Source EN PDF p.84, block 1059 -->

Если файл есть, команда перезагрузки следующая:

<!-- Source EN PDF p.85, block 1060 -->

```text
<rk3308:/ #> /rockchip_test/rockchip_test.sh
...
please input your test moudle: //the serial console input 13<enter>
13
```

<!-- Source EN PDF p.85, block 1061 -->

Если файла нет, передайте auto_reboot_test.sh в /data/:

<!-- Source EN PDF p.85, block 1062 -->

```text
adb push \*file path*\auto_reboot_test.sh data/.
```

<!-- Source EN PDF p.85, block 1063 -->

Измените права:

<!-- Source EN PDF p.85, block 1064 -->

```text
<rk3308:/ #> chmod 777 /data/auto_reboot_test.sh
```

<!-- Source EN PDF p.85, block 1065 -->

Команда перезагрузки:

<!-- Source EN PDF p.85, block 1066 -->

```text
<rk3308:/ #> /data/auto_reboot_test.sh
```

<!-- Source EN PDF p.85, block 1067 -->

Выполняйте тест более 12 часов, затем проверьте работу устройства.

<!-- Source EN PDF p.86, block 1068 -->

## 4. Глава 4. Руководство по Rockchip DDR DQ Eye Tool

<!-- Source EN PDF p.86, block 1069 -->

### 4.1 Сканирование двумерной глазковой диаграммы

<!-- Source EN PDF p.86, block 1070 -->

#### 4.1.1 Поддерживаемые платформы

<!-- Source EN PDF p.86, block 1071 -->

RK3528, RK3562, RK3566, RK3568, RK3588, RK3576

<!-- Source EN PDF p.86, block 1072 -->

#### 4.1.2 Порядок использования

<!-- Source EN PDF p.86, block 1073 -->

В loader необходимо включить eye_scan ddr bin. Этот файл содержит «eyescan» в имени и находится в rkbin/bin/rkxx, рядом с обычными ddr bin; пример: rkbin/bin/rk35/rk3568_ddr_1560MHz_eyescan_v1.16.bin. Сборка loader описана в разделе руководства разработчика DDR.

<!-- Source EN PDF p.86, block 1074 -->

Если нужна другая частота, измените её в eye_scan ddr bin инструментом rkbin/tools/ddrbin_tool, затем соберите loader. Инструкция находится в rkbin/tools/ddrbin_tool_user_guide.txt.

<!-- Source EN PDF p.86, block 1075 -->

Переведите устройство в режим maskrom и загрузите loader через RKDevTool. Результат выводится в последовательный порт. После сканирования двумерной диаграммы loader автоматически останавливается, поэтому инструмент сообщает об ошибке.

<!-- Source EN PDF p.86, block 1076 -->

![Технический рисунок исходника — PDF 86](/docs/rockchip-ddr/assets/en-p86-figure1.png)

<!-- Source EN PDF p.86, block 1077 -->

В режиме loader загрузка loader завершается успешно. После этого при каждом включении выполняется сканирование двумерной диаграммы с выводом в последовательный порт, а затем выполнение останавливается. Обычная загрузка системы невозможна; для восстановления перейдите в maskrom и загрузите обычный loader.

<!-- Source EN PDF p.87, block 1078 -->

##### 4.1.2.1 Анализ результатов

<!-- Source EN PDF p.87, block 1079 -->

В начале журнала двумерной диаграммы указана задержка одного шага в fs (0.001ps). Например, «Unit: 1913 fs» в первой строке рисунка означает 1.913 ps на шаг.

<!-- Source EN PDF p.87, block 1080 -->

Вторая строка «margin: rx:22-8,tx:26-32» означает минимально необходимые запасы setup/hold для чтения 22step/8step и для записи 26step/32step соответственно. Значения пересчитаны из ps в шаги программной диаграммы с учётом частоты. На диаграмме rx dq0 минимальный диапазон setup 22step и hold 8step отмечен символами «\|». Значение «[33 ~ -1 ~-35]» справа означает запас setup 33 шага и hold 35 шагов при данном vref. По сравнению с минимумом 22step/8step дополнительный запас составляет 33-22=11step для setup и 35-8=27step для hold.

<!-- Source EN PDF p.87, block 1081 -->

![Технический рисунок исходника — PDF 87](/docs/rockchip-ddr/assets/en-p87-figure1.png)

<!-- Source EN PDF p.87, block 1082 -->

На рисунке выше показана диаграмма одного DQ.

<!-- Source EN PDF p.87, block 1083 -->

Слева vref указывает опорное напряжение для соответствующей ширины глаза. Символ «\*» перед vref отмечает напряжение с максимальной шириной, а «+» — напряжение, используемое текущей прошивкой. Значение vref приближённое: фактически выбирается ближайшее доступное внутреннее значение. Например, если показано 30.4%, а ближайшее доступное значение — 30.2%, реально действует 30.2%.

<!-- Source EN PDF p.87, block 1084 -->

В середине «-» обозначает недопустимую фазовую точку, «\*» — допустимую, «+» — исходную точку выборки. Диапазон между «\|» соответствует минимально необходимому запасу setup/hold. Расстояние от «+» до крайнего левого «\*» — запас setup, до крайнего правого «\*» — запас hold. Если фактическая граница допустимого глаза попадает внутрь диапазона «\|», соответствующая точка заменяется на «o». Символ «o» указывает на недостаточный запас сигнала. Пример приведён ниже.

> Редакционное уточнение: в самом английском PDF два обозначения в кавычках пусты. По `*` в конце того же абзаца и по китайскому соответствию здесь восстановлено чтение `*`; это явно отмеченная редакционная интерпретация, требующая сверки с выводом инструмента.

<!-- Source EN PDF p.88, block 1085 -->

![Технический рисунок исходника — PDF 88](/docs/rockchip-ddr/assets/en-p88-figure1.png)

<!-- Source EN PDF p.88, block 1086 -->

Справа в «[]» последовательно указаны левая граница глаза, среднее значение, правая граница и общая ширина.

<!-- Source EN PDF p.88, block 1087 -->

![Технический рисунок исходника — PDF 88](/docs/rockchip-ddr/assets/en-p88-figure2.png)

<!-- Source EN PDF p.88, block 1088 -->

На рисунке выше приведён объединённый результат для всех DQ.

<!-- Source EN PDF p.89, block 1089 -->

![Технический рисунок исходника — PDF 89](/docs/rockchip-ddr/assets/en-p89-figure1.png)

Редактируемая расшифровка снимка (исходные поля и значения):

| cs0 RD | Поле | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| max eye | left | -42 | -42 | -44 | -46 | -39 | -44 | -44 | -39 | -45 | -44 | -47 | -44 | -46 | -47 | -44 | -49 |
| max eye | midd | 0 | 0 | -2 | -4 | 1 | -2 | -3 | 0 | 3 | 3 | 0 | 3 | 3 | 1 | 2 | -1 |
| max eye | right | 41 | 43 | 39 | 38 | 42 | 40 | 38 | 40 | 51 | 51 | 48 | 51 | 52 | 50 | 49 | 47 |
| max eye | range | 83 | 85 | 83 | 84 | 81 | 84 | 82 | 79 | 96 | 95 | 95 | 95 | 98 | 97 | 93 | 96 |
| current eye | left | -39 | -44 | -44 | -43 | -39 | -44 | -41 | -39 | -44 | -43 | -45 | -41 | -45 | -46 | -40 | -47 |
| current eye | midd | 0 | -1 | -2 | -1 | 1 | -2 | 0 | 0 | 3 | 4 | 1 | 5 | 3 | 2 | 6 | 0 |
| current eye | right | 38 | 41 | 39 | 40 | 41 | 40 | 40 | 40 | 51 | 52 | 48 | 52 | 52 | 51 | 52 | 48 |
| current eye | range | 77 | 85 | 83 | 83 | 80 | 84 | 81 | 79 | 95 | 95 | 93 | 93 | 97 | 97 | 92 | 95 |

<!-- Source EN PDF p.89, block 1090 -->

Для проверки отдельных DQ на рисунке выше сведены результаты всех отдельных диаграмм.

<!-- Source EN PDF p.89, block 1091 -->

Строка «max eye» содержит левую границу, среднее значение, правую границу и общую ширину самого широкого глаза для каждого DQ. Слева направо идут DQ0, DQ1 и далее. Здесь исходник связывает это значение с vref, отмеченным «+»; выше назначение «+» и «\*» описано иначе — это противоречие требует проверки.

<!-- Source EN PDF p.89, block 1092 -->

Строка «current eye» содержит результат для текущего vref в том же формате, что «max eye». Здесь исходник указывает маркер «\*», что противоречит описанию маркеров выше; обозначения не следует считать проверенными.

> Противоречие исходника: выше * обозначает Vref максимальной ширины, а + — текущий Vref; здесь обозначения max/current переставлены. Обе формулировки сохранены; проверьте версию инструмента и фактический вывод.

<!-- Source EN PDF p.89, block 1093 -->

Итог: «all result: pass» в конце журнала означает, что запасы всех dq удовлетворяют требованиям. В противном случае выводится «all result: err».

<!-- Source EN PDF p.89, block 1094 -->

### 4.2 Сканирование одномерной глазковой диаграммы

<!-- Source EN PDF p.89, block 1095 -->

На платформах с поддержкой двумерного сканирования сначала используйте его: оно дополнительно учитывает vref. Одномерное сканирование применяют при особых требованиях.

<!-- Source EN PDF p.89, block 1096 -->

#### 4.2.1 Поддерживаемые платформы

<!-- Source EN PDF p.89, block 1097 -->

RV1109, RV1126, RK3566, RK3568, RK3528, RK3562

<!-- Source EN PDF p.89, block 1098 -->

#### 4.2.2 Порядок использования

<!-- Source EN PDF p.89, block 1099 -->

##### 4.2.2.1 Подготовка

<!-- Source EN PDF p.89, block 1100 -->

1\. Проверьте версию DDR bin: для RV1126 требуется V1.09 или новее, для RK3568/RK3566 — V1.07 или новее. При более старой версии обновите проект rkbin.

<!-- Source EN PDF p.89, block 1101 -->

2\. Перед сборкой U-Boot откройте menuconfig в корне проекта, перейдите в «Command line interface», включите «Enable ddr test tool» и сохраните конфигурацию. Rockchip DDR DQ Eye Tool встроен в DDR Test Tool.

<!-- Source EN PDF p.90, block 1102 -->

![Технический рисунок исходника — PDF 90](/docs/rockchip-ddr/assets/en-p90-figure1.png)

Редактируемая расшифровка снимка (исходные поля и значения):

```text
[ ] Enable memtester for ddr
[*] Enable ddr test tool
    Misc commands --->
```

<!-- Source EN PDF p.90, block 1103 -->

3\. Соберите U-Boot и загрузите Loader и uboot. Подробности приведены в соответствующем разделе документации UBOOT.

<!-- Source EN PDF p.90, block 1104 -->

4\. Подключите последовательный порт проверяемой платы к компьютеру и проверьте связь. При включении платы удерживайте Ctrl + C на компьютере, чтобы остановить загрузку в U-Boot. Сообщение «`<INTERRUPT>`» означает, что выполнение остановлено в U-Boot.

<!-- Source EN PDF p.90, block 1105 -->

![Технический рисунок исходника — PDF 90](/docs/rockchip-ddr/assets/en-p90-figure2.png)

Редактируемая расшифровка снимка (исходные поля и значения):

```text
hclk_top 150000 KHz
pclk_top 100000 KHz
aclk_perimid 300000 KHz
hclk_perimid 150000 KHz
pclk_pmu 100000 KHz
Net: eth0: ethernet@fe010000
Hit key to stop autoboot('CTRL+C'): 0
=> <INTERRUPT>
=> <INTERRUPT>
=> <INTERRUPT>
```

<!-- Source EN PDF p.90, block 1106 -->

##### 4.2.2.2 Просмотр диаграмм чтения и записи DDR DQ в U-Boot

<!-- Source EN PDF p.90, block 1107 -->

Введите команду в U-Boot:

<!-- Source EN PDF p.90, block 1108 -->

```text
ddr_dq_eye <DDR frequency in MHz>
```

<!-- Source EN PDF p.90, block 1109 -->

Параметр `<DDR frequency in MHz>` задаёт частоту DDR для просмотра диаграммы DQ в MHz. Если параметр не указан, используется максимальная частота.

<!-- Source EN PDF p.90, block 1110 -->

Пример просмотра диаграммы DQ при частоте DDR 1056MHz:

<!-- Source EN PDF p.90, block 1111 -->

```text
ddr_dq_eye 1056
```

<!-- Source EN PDF p.90, block 1112 -->

Пример просмотра диаграммы DQ при максимальной частоте DDR:

<!-- Source EN PDF p.90, block 1113 -->

```text
ddr_dq_eye
```

<!-- Source EN PDF p.91, block 1114 -->

##### 4.2.2.3 Анализ результатов

<!-- Source EN PDF p.91, block 1115 -->

![Технический рисунок исходника — PDF 91](/docs/rockchip-ddr/assets/en-p91-figure1.png)

<!-- Source EN PDF p.91, block 1116 -->

![Технический рисунок исходника — PDF 91](/docs/rockchip-ddr/assets/en-p91-figure2.png)

<!-- Source EN PDF p.91, block 1117 -->

В начале инструмент показывает свою версию, тип DDR и частоту.

<!-- Source EN PDF p.92, block 1118 -->

Далее выводятся диаграммы чтения и записи каждого CS.

<!-- Source EN PDF p.92, block 1119 -->

В диаграмме «-» обозначает положение вне глаза, «\*» — внутри глаза, «\|» — точку выборки.

<!-- Source EN PDF p.92, block 1120 -->

Справа показаны левый и правый запасы Margin_L и Margin_R, положение выборки и ширина глаза. Квадратными скобками отмечена ширина, не удовлетворяющая минимальному пределу, как у read eye DQ0 на рисунке.

<!-- Source EN PDF p.92, block 1121 -->

В конце инструмент показывает минимальную ширину глаза для чтения и записи, а также требуемый минимум; выбирайте предел для близкой частоты.

<!-- Source EN PDF p.92, block 1122 -->

#### 4.2.3 Минимально допустимая ширина глаза DDR DQ

<!-- Source EN PDF p.92, block 1123 -->

На основании испытаний DEMO и опыта проектов исходник задаёт минимальную ширину глаза чтения и записи DDR DQ. Если хотя бы одна из этих величин ниже предела, работа DDR может быть нестабильной. Это данные исходника, а не измерения ArmSoM.

<!-- Source EN PDF p.92, block 1124 -->

Соответствие пределу означает лишь сравнительно надёжную ширину глаза DQ в данной конструкции. Оно не исключает другие проблемы DDR. Дополнительные испытания надёжности проводятся по требованиям фактического применения.

<!-- Source EN PDF p.92, block 1125 -->

##### 4.2.3.1 RV1126

<!-- Source EN PDF p.92, block 1126 -->

| Тип DDR | Частота DDR CLK | Минимальная ширина глаза чтения | Минимальная ширина глаза записи |
|---|---|---|---|
| LPDDR4 | 1056MHz | 12 | 13 |
| LPDDR4 | 924MHz | 15 | 15 |
| DDR4 | 1056MHz | 13 | 9 |
| DDR4 | 924MHz | 15 | 11 |
| LPDDR3 | 1056MHz | 15 | 13 |
| LPDDR3 | 924MHz | 16 | 15 |
| DDR3 | 1056MHz | 14 | 14 |
| DDR3 | 924MHz | 17 | 17 |

<!-- Source EN PDF p.93, block 1127 -->

##### 4.2.3.2 RK3568/RK3566

<!-- Source EN PDF p.93, block 1128 -->

| Тип DDR | Частота DDR CLK | Минимальная ширина глаза чтения | Минимальная ширина глаза записи |
|---|---|---|---|
| LPDDR4 | 1560MHz | 25 | 24 |
| LPDDR4 | 1184MHz | 30 | 29 |
| DDR4 | 1560MHz | 30 | 22 |
| DDR4 | 1184MHz | 32 | 26 |
| LPDDR3 | 1184MHz | 34 | 25 |
| LPDDR3 | 1056MHz | 39 | 28 |
| DDR3 | 1184MHz | 32 | 31 |
| DDR3 | 1056MHz | 39 | 34 |

<!-- Source EN PDF p.94, block 1129 -->

## 5. Глава 5. Руководство по измерению пропускной способности DDR

<!-- Source EN PDF p.94, block 1130 -->

### 5.1 Терминология

<!-- Source EN PDF p.94, block 1131 -->

В этом разделе используются следующие основные термины:

<!-- Source EN PDF p.94, block 1132 -->

monitor: функция наблюдения за различными командами DDR и сбора статистики.

<!-- Source EN PDF p.94, block 1133 -->

### 5.2 Получение инструмента

<!-- Source EN PDF p.94, block 1134 -->

```text
https://redmine.rock-chips.com/documents/49 -> DDR Related Materials_VerX.XX.7z -> Tools ->DDR Bandwidth Tool
```

<!-- Source EN PDF p.94, block 1135 -->

### 5.3 Поддерживаемые платформы

<!-- Source EN PDF p.94, block 1136 -->

Список поддерживаемых платформ можно получить командой:

<!-- Source EN PDF p.94, block 1137 -->

```text
# rk-msch-probe_vx.xx -h
```

<!-- Source EN PDF p.94, block 1138 -->

Будет выведена следующая информация; точный список платформ зависит от версии инструмента:

<!-- Source EN PDF p.94, block 1139 -->

```text
Usage: [-c chip_name -d msecs -f freq -h help]
-c <chip_name>:
'rk312x' include rk3126,rk3128 and px3se
'rk322x' include rk3128h,rk3228a,rk3228b and rk3229
...
[option] -d <msecs>: Sets the sampling interval in milliseconds.
[option] -f <freq>: Specifies the mean current DDR frequency in MHz.
[option] -h: Displays help information.
```

<!-- Source EN PDF p.94, block 1140 -->

### 5.4 Параметры

<!-- Source EN PDF p.94, block 1141 -->

Инструмент измерения пропускной способности DDR rk_msch_probe_vx.xx поддерживает следующие параметры:

<!-- Source EN PDF p.94, block 1142 -->

-c: имя микросхемы. Убедившись в поддержке платформы, укажите её имя, например rk3326.

<!-- Source EN PDF p.94, block 1143 -->

-d: интервал наблюдения в ms, необязательный параметр. По умолчанию 1000ms.

<!-- Source EN PDF p.94, block 1144 -->

-f: текущая частота DDR в MHz, необязательный параметр. На каждом интервале инструмент пытается определить частоту DDR. Если это не удаётся, её необходимо указать вручную.

<!-- Source EN PDF p.94, block 1145 -->

Сначала следует зафиксировать частоту DDR, иначе её изменение

<!-- Source EN PDF p.95, block 1146 -->

сделает результаты неточными. Параметр -t test_loop задаёт число циклов измерения, после которых инструмент завершается. По умолчанию выполнение не ограничено.

<!-- Source EN PDF p.95, block 1147 -->

-h: справка.

<!-- Source EN PDF p.95, block 1148 -->

### 5.5 Условия использования

<!-- Source EN PDF p.95, block 1149 -->

Регулятор devfreq для DMC не должен быть «dmc_ondemand». Рекомендуется переключиться на «userspace» следующей командой:

<!-- Source EN PDF p.95, block 1150 -->

```text
# echo userspace > /sys/class/devfreq/dmc/governor
```

<!-- Source EN PDF p.95, block 1151 -->

Затем зафиксируйте частоту DDR; пример для 780MHz:

<!-- Source EN PDF p.95, block 1152 -->

```text
# echo 780000000 > /sys/class/devfreq/dmc/userspace/set_freq
```

<!-- Source EN PDF p.95, block 1153 -->

Если при проверке инструмент выводит следующее сообщение, перечисленные условия не выполнены:

<!-- Source EN PDF p.95, block 1154 -->

```text
Error: The DDR monitor time gets error!!!
Please check the devfreq governor is not 'dmc_ondemand'!!!
For example:
# cat sys/class/devfreq/dmc/governor
# dmc_ondemand
Please switch the devfreq governor to others, such as 'userspace'.
For example:
# echo userspace > /sys/class/devfreq/dmc/governor
Delete the result of this time!
```

<!-- Source EN PDF p.95, block 1155 -->

### 5.6 Пояснение вывода

<!-- Source EN PDF p.95, block 1156 -->

При запуске rk_msch_probe_vx.xx отслеживает и выводит пропускную способность и загрузку DDR.

<!-- Source EN PDF p.95, block 1157 -->

Вывод для обычных платформ:

<!-- Source EN PDF p.95, block 1158 -->

```text
V1.06_20200629
ddr freq: 928Mhz
CH0:
ddr monitor statistics:
ddr load = 3251.23MB/s(43.76%) [RD:1859.93MB/s(25.03%), WR:1391.30MB/s(18.72%), ACT(access :
active): 3.34, srex:0.54%, pdex:1.27%, clkstp:0.00%, lp:1.81%]
```

<!-- Source EN PDF p.95, block 1159 -->

Вывод для RK3588:

<!-- Source EN PDF p.96, block 1160 -->

```text
ddr freq: 2133Mhz
===========ALL=============CH0===============CH1==============CH2===============CH3========
LOAD: 4.51MB/s(0.03%), 1.23MB/s(0.04%), 1.13MB/s(0.03%), 1.16MB/s(0.04%),
 1.00MB/s(0.03%)
RD: 2.57MB/s(0.02%), 0.74MB/s(0.02%), 0.65MB/s(0.02%), 0.67MB/s(0.02%),
 0.51MB/s(0.02%)
WR: 1.94MB/s(0.01%), 0.49MB/s(0.02%), 0.48MB/s(0.01%), 0.49MB/s(0.02%),
 0.48MB/s(0.01%)
===========================================================================================
```

<!-- Source EN PDF p.96, block 1161 -->

Пояснение статистических показателей:

<!-- Source EN PDF p.96, block 1162 -->

| Поле вывода | Пояснение |
|---|---|
| ALL | Суммарная статистика пропускной способности всех каналов. |
| CHx | Статистика пропускной способности канала DDR x. |
| recorded LOAD<br>（max, min, avg） | Для всех банков DDR: максимальные, минимальные и средние значения пропускной способности и загрузки, зарегистрированные во время работы инструмента. |
| load/LOAD | Пропускная способность и загрузка данного канала по всем банкам DDR. |
| RD | Пропускная способность и процентная доля чтения DDR по всем банкам. |
| WR | Пропускная способность и процентная доля записи DDR по всем банкам. |
| PRE | Для всех банков DDR: доля команд precharge в общем числе команд. Команды precharge и active появляются попарно; отдельной аппаратной статистики precharge нет, поэтому используется статистика команд active. |
| ACT(access :<br>active) | Для всех банков DDR: среднее число чтений/записей после каждой команды active. Чем выше значение, тем более последовательны обращения к адресам DDR, что предпочтительнее. |
| srex | Доля времени DDR в состоянии self-refresh. |
| pdex | Доля времени DDR в состоянии power down. |
| clkstp | Доля времени DDR в состоянии clock stop. |
| srpdex | Доля времени DDR в состоянии self-refresh power down. |
| dsmex | Доля времени DDR в состоянии Deep Sleep Mode. |
| lp/ LOW POWER | Доля времени DDR в энергосберегающих состояниях, включая self-refresh, power down, clock stop и другие. |

<!-- Source EN PDF p.97, block 1163 -->

### 5.7 Частые вопросы

<!-- Source EN PDF p.97, block 1164 -->

1) Если при работе сообщается об отсутствии «/dev/mem», вывод выглядит следующим образом:

<!-- Source EN PDF p.97, block 1165 -->

```text
rk3568:/ # rk-msch-probe_vx.xx -c rk356x
open /dev/mem error: No such file or directory
```

<!-- Source EN PDF p.97, block 1166 -->

Ошибка возникает, когда в конфигурации ядра выключен CONFIG_DEVMEM: инструмент не может обратиться к регистрам устройства.

<!-- Source EN PDF p.97, block 1167 -->

Способ 1: добавьте CONFIG_DEVMEM=y в соответствующий файл конфигурации ядра, например android-11.config, и пересоберите прошивку.

<!-- Source EN PDF p.97, block 1168 -->

Способ 2: выполните make menuconfig в дереве ядра, найдите DEVMEM, включите его и пересоберите ядро. Следите за тем, чтобы не перезаписать нужную конфигурацию.

<!-- Source EN PDF p.97, block 1169 -->

```text
Symbol: DEVMEM [=y]
Type : bool
Prompt: /dev/mem virtual device support
Location:
    -> Device Drivers
(1) -> Character devices
  Defined at drivers/char/Kconfig:10
...
[*] /dev/mem virtual device support
...
```

<!-- Source EN PDF p.98, block 1170 -->

## 6. Глава 6. Руководство по DDR_UserTool — проверке пайки DDR

<!-- Source EN PDF p.98, block 1171 -->

### 6.1 Обзор

<!-- Source EN PDF p.98, block 1172 -->

DDR_UserTool предназначен для проверки пайки DDR.

<!-- Source EN PDF p.98, block 1173 -->

Инструмент распространяется по адресу https://redmine.rock-chips.com/documents/49 в DDR相关资料_Verx.xx.7z -> 工具 -> DDR_UserTool_vx.xx.

<!-- Source EN PDF p.98, block 1174 -->

Номер версии DDR_UserTool может долго не меняться, хотя внутренние конфигурационные файлы обновляются, например для поддержки новых платформ. Поэтому для каждого нового проекта необходимо получать свежую поставку DDR_UserTool с Redmine.

<!-- Source EN PDF p.98, block 1175 -->

### 6.2 Этапы проверки

<!-- Source EN PDF p.98, block 1176 -->

#### 6.2.1 Переключение DDR_UserTool на английский язык

<!-- Source EN PDF p.98, block 1177 -->

Откройте resource/config.ini и замените «Selected=1» на «Selected=2», чтобы выбрать английский язык.

<!-- Source EN PDF p.98, block 1178 -->

![Технический рисунок исходника — PDF 98](/docs/rockchip-ddr/assets/en-p98-figure1.png)

<!-- Source EN PDF p.99, block 1179 -->

![Технический рисунок исходника — PDF 99](/docs/rockchip-ddr/assets/en-p99-figure1.png)

Редактируемая расшифровка снимка (исходные поля и значения):

```text
[Language]
Kinds=2
Selected=2
LangPath=Language\
Lang1File=Chinese.ini
Lang1FontName=宋体
Lang1FontSize=9
Lang1Tag=CHN
Lang1CHNTitle=中文
Lang1ENGTitle=Chinese
Lang2File=English.ini
Lang2FontName=Arial
Lang2FontSize=9
Lang2Tag=ENG
Lang2CHNTitle=英文
Lang2ENGTitle=English
[System]
```

<!-- Source EN PDF p.99, block 1180 -->

#### 6.2.2 Запуск DDR_UserTool.exe

<!-- Source EN PDF p.99, block 1181 -->

Примечание: в Windows 7 щёлкните правой кнопкой и выберите «Run as Administrator».

<!-- Source EN PDF p.100, block 1182 -->

#### 6.2.3 Выбор TestFile

<!-- Source EN PDF p.100, block 1183 -->

![Технический рисунок исходника — PDF 100](/docs/rockchip-ddr/assets/en-p100-figure1.png)

<!-- Source EN PDF p.100, block 1184 -->

TestFile находится в папке TestFile каталога инструмента и имеет расширение .cfg. Выберите файл, соответствующий целевой платформе и сведениям об объёме DDR.

<!-- Source EN PDF p.100, block 1185 -->

Обратите внимание:

<!-- Source EN PDF p.100, block 1186 -->

Микросхему DDR4 x16 DDP (Dual Die Package) следует считать двумя микросхемами x8. Например, если исходная конфигурация — «4GB DDR4(1CS x 2pcs x 1Gb×16bit)», но установлены DDR4 x16 DDP, выберите TestFile для «4GB DDR4(1CS x 4pcs x 1Gb×8bit)». Определение DDR4 x16 DDP описано ниже.

<!-- Source EN PDF p.100, block 1187 -->

Файлы TestFile для LPDDR4 и LPDDR4X не взаимозаменяемы.

<!-- Source EN PDF p.100, block 1188 -->

Для DDR3L используйте TestFile для DDR3.

<!-- Source EN PDF p.100, block 1189 -->

#### 6.2.4 Подпись TestFile

<!-- Source EN PDF p.100, block 1190 -->

Этот шаг нужен только для устройств с secure-boot. На устройствах без secure-boot пропустите его.

<!-- Source EN PDF p.101, block 1191 -->

![Технический рисунок исходника — PDF 101](/docs/rockchip-ddr/assets/en-p101-figure1.png)

<!-- Source EN PDF p.101, block 1192 -->

Для проверки устройства с secure-boot подпишите TestFile с помощью SecureBootTool, доступного по адресу https://redmine.rock-chips.com/documents/49. Настройте Chip, Key и другие параметры, затем нажмите «Sign DDR File». Подробности приведены в SecureBootTool_UserManual.

<!-- Source EN PDF p.101, block 1193 -->

#### 6.2.5 Перевод целевого устройства в состояние проверки

<!-- Source EN PDF p.101, block 1194 -->

Подключите OTG-порт устройства. По возможности также подключите последовательный порт.

<!-- Source EN PDF p.101, block 1195 -->

Перевести устройство в состояние проверки можно несколькими способами:

<!-- Source EN PDF p.101, block 1196 -->

Устройство, на которое ещё не записана прошивка

<!-- Source EN PDF p.101, block 1197 -->

Такое устройство уже находится в Maskrom и может проверяться непосредственно.

<!-- Source EN PDF p.101, block 1198 -->

Перевод устройства в Maskrom

<!-- Source EN PDF p.101, block 1199 -->

Исходник описывает замыкание CLK и GND накопителя при включении питания для входа в Maskrom. Конкретные контакты определяются схемой RK; обычно предусмотрена кнопка или тестовые точки. Не замыкайте произвольные контакты: способ зависит от схемы конкретной платы.

<!-- Source EN PDF p.101, block 1200 -->

Перевод устройства в режим Loader

<!-- Source EN PDF p.101, block 1201 -->

Когда устройство готово к проверке, инструмент показывает «Found one device».

<!-- Source EN PDF p.102, block 1202 -->

![Технический рисунок исходника — PDF 102](/docs/rockchip-ddr/assets/en-p102-figure1.png)

<!-- Source EN PDF p.102, block 1203 -->

#### 6.2.6 Запуск проверки

<!-- Source EN PDF p.102, block 1204 -->

![Технический рисунок исходника — PDF 102](/docs/rockchip-ddr/assets/en-p102-figure2.png)

<!-- Source EN PDF p.103, block 1205 -->

Нажмите «StartTest». Индикатор начнёт двигаться, а журнал будет одновременно отображаться в окне инструмента. По данным исходника, проверка обычно занимает менее 2 минут; это не результат измерения на ArmSoM.

<!-- Source EN PDF p.103, block 1206 -->

При включённом «AutoTest» проверка автоматически запускается при подключении устройства.

<!-- Source EN PDF p.103, block 1207 -->

#### 6.2.7 Получение результатов

<!-- Source EN PDF p.103, block 1208 -->

##### 6.2.7.1 Проверка PASS

<!-- Source EN PDF p.103, block 1209 -->

![Технический рисунок исходника — PDF 103](/docs/rockchip-ddr/assets/en-p103-figure1.png)

<!-- Source EN PDF p.103, block 1210 -->

##### 6.2.7.2 Проверка FAIL

<!-- Source EN PDF p.103, block 1211 -->

По сообщениям инструмента определите неисправные микросхемы DDR и SoC, требующие перепайки. Для определения конкретных сигнальных линий используйте раздел о соответствии сообщений об ошибках аппаратным линиям.

<!-- Source EN PDF p.103, block 1212 -->

После ремонта устройство, не прошедшее проверку, обязательно проверяют повторно, пока проверка не завершится успешно.

<!-- Source EN PDF p.104, block 1213 -->

![Технический рисунок исходника — PDF 104](/docs/rockchip-ddr/assets/en-p104-figure1.png)

<!-- Source EN PDF p.104, block 1214 -->

##### 6.2.7.3 Проверка прервана

<!-- Source EN PDF p.104, block 1215 -->

![Технический рисунок исходника — PDF 104](/docs/rockchip-ddr/assets/en-p104-figure2.png)

<!-- Source EN PDF p.105, block 1216 -->

Для поиска причины используйте раздел «Причины прерывания проверки».

<!-- Source EN PDF p.105, block 1217 -->

### 6.3 Частые вопросы

<!-- Source EN PDF p.105, block 1218 -->

#### 6.3.1 Проверяет ли DDR_UserTool стабильность DDR?

<!-- Source EN PDF p.105, block 1219 -->

Нет. DDR_UserTool сейчас проверяет только пайку DDR. Проверка стабильности описана в разделе о процессе проверки DDR этого документа.

<!-- Source EN PDF p.105, block 1220 -->

#### 6.3.2 Выявляет ли DDR_UserTool дефекты пайки всех контактов?

<!-- Source EN PDF p.105, block 1221 -->

Нет. Это быстрый программный способ проверки пайки DDR, но программные средства имеют ограничения: они не проверяют все контакты DDR и не проверяют контакты других модулей.

<!-- Source EN PDF p.105, block 1222 -->

Обычно выявляются дефекты пайки DQ и большинства CA. Дефекты контактов питания, CKE и ODT не обнаруживаются.

<!-- Source EN PDF p.105, block 1223 -->

#### 6.3.3 Определение микросхем DDR4 x16 DDP

<!-- Source EN PDF p.105, block 1224 -->

1\. Проверьте схему. Если вывод M9 микросхемы DDR4 подключён к BG1 со стороны SoC, это x16 DDP. Если M9 подключён к VSS, это не x16 DDP.

<!-- Source EN PDF p.106, block 1225 -->

![Технический рисунок исходника — PDF 106](/docs/rockchip-ddr/assets/en-p106-figure1.png)

<!-- Source EN PDF p.106, block 1226 -->

2\. Проверьте журнал Loader при загрузке исправного устройства. Значение «Die BW=8» в сведениях об объёме DDR, согласно исходнику, подтверждает использование x16 DDP.

<!-- Source EN PDF p.106, block 1227 -->

3\. Проверьте datasheet: найдите прямое указание DDP (Dual Die Package). Также можно проверить назначение M9: BG1 означает x16 DDP, VSS — не x16 DDP.

<!-- Source EN PDF p.106, block 1228 -->

#### 6.3.4 Не удаётся найти TestFile для устройства

<!-- Source EN PDF p.106, block 1229 -->

Проверьте наличие обновлений.

<!-- Source EN PDF p.106, block 1230 -->

Если для новой платформы TestFile ещё отсутствует, дождитесь обновления инструмента.

<!-- Source EN PDF p.106, block 1231 -->

Для платформ с опубликованными TestFile обычно имеются файлы для распространённых конфигураций DDR. Файлов много, поэтому проверьте список внимательно. Если конфигурация необычная и подходящий файл отсутствует, задайте вопрос на Redmine.

<!-- Source EN PDF p.106, block 1232 -->

#### 6.3.5 Причины прерывания проверки

<!-- Source EN PDF p.106, block 1233 -->

1\. В Windows 7 инструмент запущен без «Run as Administrator».

<!-- Source EN PDF p.106, block 1234 -->

2\. Неверно выбран TestFile: не совпадают платформа, тип DDR или сведения об объёме.

<!-- Source EN PDF p.107, block 1235 -->

3\. Повторная проверка запущена без повторного перевода устройства в состояние проверки.

<!-- Source EN PDF p.107, block 1236 -->

4\. Для устройства с secure-boot не подписан TestFile.

<!-- Source EN PDF p.107, block 1237 -->

5\. Не обновлены инструмент и TestFile.

<!-- Source EN PDF p.107, block 1238 -->

6\. Проблема питания устройства, например недостаточное питание USB.

<!-- Source EN PDF p.107, block 1239 -->

7\. Проблема соединения USB: попробуйте другой кабель или другой компьютер.

<!-- Source EN PDF p.107, block 1240 -->

8\. Если устройство находится в Loader, попробуйте проверку в Maskrom.

<!-- Source EN PDF p.107, block 1241 -->

#### 6.3.6 Соответствие сообщений об ошибках аппаратным сигнальным линиям

<!-- Source EN PDF p.107, block 1242 -->

Перестановка линий CA не допускается, поэтому их соответствие обычно однозначно.

<!-- Source EN PDF p.107, block 1243 -->

Ошибки DQ относятся к именам выводов со стороны SoC. Ориентируйтесь на общую часть имени, а не на часть, зависящую от типа DDR. На фрагменте схемы RK3528 DDR4 общая часть выделена зелёной рамкой. Если инструмент сообщает об ошибке DQ1_B, проблема относится к линии вывода DDRPHY_B_DQ1 SoC, то есть к сигналу DDR4_DQU0_B.

<!-- Source EN PDF p.108, block 1244 -->

![Технический рисунок исходника — PDF 108](/docs/rockchip-ddr/assets/en-p108-figure1.png)

<!-- Source EN PDF p.108, block 1245 -->

#### 6.3.7 DDR_UserTool показывает FAIL, но рентген не выявляет дефектов пайки

<!-- Source EN PDF p.108, block 1246 -->

Рентген не всегда обнаруживает все дефекты. Исходник рекомендует попробовать перепайку микросхем DDR и SoC.

<!-- Source EN PDF p.109, block 1247 -->

#### 6.3.8 После перепайки результат по-прежнему FAIL

<!-- Source EN PDF p.109, block 1248 -->

1\. Неверно выбран TestFile либо не обновлены инструмент и TestFile.

<!-- Source EN PDF p.109, block 1249 -->

2\. Непропай возможен одновременно на стороне DDR и SoC; требуется проверка и перепайка обеих сторон.

<!-- Source EN PDF p.109, block 1250 -->

3\. Дефекты изготовления PCB, например обрыв проводников.

<!-- Source EN PDF p.109, block 1251 -->

4\. Причины, не связанные с пайкой DDR: неисправность микросхемы DDR, ошибки схемы, проблемы питания и т. п.

<!-- Source EN PDF p.109, block 1252 -->

#### 6.3.9 FAIL у большого числа устройств

<!-- Source EN PDF p.109, block 1253 -->

1\. Неверно выбран TestFile либо не обновлены инструмент и TestFile.

<!-- Source EN PDF p.109, block 1254 -->

2\. Проблемы сборочного производства или изготовления PCB.

<!-- Source EN PDF p.109, block 1255 -->

3\. Причины, не связанные с пайкой DDR: неисправность микросхемы DDR, ошибки схемы, проблемы питания и т. п.

<!-- Source EN PDF p.109, block 1256 -->

#### 6.3.10 Дополнительные вопросы на Redmine

<!-- Source EN PDF p.109, block 1257 -->

Чтобы ускорить анализ, вместе с чётким описанием проблемы предоставьте:

<!-- Source EN PDF p.109, block 1258 -->

1\. Обозначение DDR PN и datasheet.

<!-- Source EN PDF p.109, block 1259 -->

2\. Число установленных микросхем DDR, желательно со схемой.

<!-- Source EN PDF p.109, block 1260 -->

3\. Использованный TestFile.

<!-- Source EN PDF p.109, block 1261 -->

4\. Долю устройств с отклонениями.

<!-- Source EN PDF p.109, block 1262 -->

5\. DDR_Test_Log.txt из каталога инструмента, соответствующий журнал из resource\Log и журнал последовательного порта во время проверки. При наличии исправных устройств приложите такие же журналы для сравнения.

<!-- Source EN PDF p.109, block 1263 -->

6\. Журнал последовательного порта при включении питания. При наличии исправных устройств приложите также их журналы загрузки.

<!-- Source EN PDF p.110, block 1264 -->

## 7. Глава 7. Руководство по DDR ECC в HAL

<!-- Source EN PDF p.110, block 1265 -->

### 7.1 Область применения

<!-- Source EN PDF p.110, block 1266 -->

Этот раздел применим только к системам с HAL и не относится к системам Linux.

<!-- Source EN PDF p.110, block 1267 -->

### 7.2 Терминология

<!-- Source EN PDF p.110, block 1268 -->

| Сокращение | Описание |
|---|---|
| ECC | Код исправления ошибок (Error Correcting Code) |
| SEC ECC | Код исправления одиночной однобитной ошибки (Single Bit Single Error Correction Code) |
| DED ECC | Код обнаружения двойной ошибки; исходная расшифровка: Double Error Detection Error Correction Code |
| DDR | SDRAM с удвоенной скоростью передачи данных (Double Data Rate SDRAM) |
| CE | Исправимая ошибка |
| UE | Неисправимая ошибка |
| cs | Выбор микросхемы |
| Row | Адрес строки DDR |
| Chip ID | Идентификатор микросхемы DDR; сейчас не используется, игнорируйте. |
| BankGroup | Адрес группы банков DDR4; для других типов DDR игнорируется. |
| Bank | Адрес банка DDR |
| Col | Адрес столбца DDR |
| Bit position | Позиция бита, исправленного при CE |

<!-- Source EN PDF p.110, block 1269 -->

### 7.3 Введение

<!-- Source EN PDF p.110, block 1270 -->

ECC означает Error Correcting Code. DDR ECC обнаруживает и исправляет ошибки данных DDR. RK3568 поддерживает SideBand ECC: к каналу данных DDR добавляется выделенный канал для данных ECC. Механизм исправляет однобитные ошибки и обнаруживает двухбитные ошибки — SEC/DED ECC (Single Error Correction/Double Error Detection).

<!-- Source EN PDF p.111, block 1271 -->

### 7.4 Включение DDR ECC

<!-- Source EN PDF p.111, block 1272 -->

1\. Включение ECC: согласно исходнику, DDR ECC включается автоматически при подключении микросхемы к DDR_ECC_DQ0-7.

<!-- Source EN PDF p.111, block 1273 -->

2\. Назначение DDR_ECC_DQ0-7: используются 32 бита данных DQ и 7 бит ECC. На DDR_ECC_DQ0-7 хранятся данные ECC, вычисленные по DQ0-DQ31; для их хранения нужна дополнительная микросхема.

<!-- Source EN PDF p.111, block 1274 -->

3\. Дополнительная микросхема ECC должна совпадать с микросхемами DQ0-31 по типу, Row, Column и Bank.

<!-- Source EN PDF p.111, block 1275 -->

4\. Поддерживаемые типы DDR: в рамках описанной реализации исходник заявляет поддержку ECC для всех типов DDR. Это не утверждение о поддержке на всех платах ArmSoM.

<!-- Source EN PDF p.111, block 1276 -->

### 7.5 Получение информации DDR ECC в HAL

<!-- Source EN PDF p.111, block 1277 -->

Проверку и исправление ошибок выполняет аппаратный IP-блок DDR ECC. Программа может получить соответствующую информацию.

<!-- Source EN PDF p.111, block 1278 -->

#### 7.5.1 Конфигурация

<!-- Source EN PDF p.111, block 1279 -->

Включите модуль DDR ECC в hal_conf.h проекта. Например, для rk3568 добавьте следующий код в project/rk3568/src/hal_conf.h.

<!-- Source EN PDF p.111, block 1280 -->

```text
#define HAL_DDR_ECC_MODULE_ENABLED
```

<!-- Source EN PDF p.111, block 1281 -->

#### 7.5.2 Код и API

<!-- Source EN PDF p.111, block 1282 -->

```text
lib/hal/src/hal_ddr_ecc.c
```

<!-- Source EN PDF p.111, block 1283 -->

```text
lib/hal/inc/hal_ddr_ecc.h
```

<!-- Source EN PDF p.111, block 1284 -->

```text
/* Initialize DDR ECC related information */
HAL_Status HAL_DDR_ECC_Init(struct DDR_ECC_CNT *p);
/*
 * Get cumulative statistical information of DDR ECC, including the number of single-bit
 * correctable errors and double-bit detectable but uncorrectable errors
 */
HAL_Status HAL_DDR_ECC_GetInfo(struct DDR_ECC_CNT *p);
```

<!-- Source EN PDF p.111, block 1285 -->

#### 7.5.3 Примеры использования

<!-- Source EN PDF p.111, block 1286 -->

Верхний программный уровень получает сведения DDR ECC двумя способами: программным опросом или аппаратными прерываниями.

<!-- Source EN PDF p.111, block 1287 -->

Программный опрос

<!-- Source EN PDF p.112, block 1288 -->

Пример:

<!-- Source EN PDF p.112, block 1289 -->

```text
struct DDR_ECC_CNT eccInfo;
void HAL_DDR_ECC_TEST_POLL(void)
{
    uint32_t cpuID;
    cpuID = HAL_CPU_TOPOLOGY_GetCurrentCpuId();
    if (cpuID == 0) { /* Use a CPU, thread, or other method to
initialize and poll DDR ECC status */
        HAL_DDR_ECC_Init(&eccInfo);
        while (1) { /* After initializing DDR ECC information,
poll to get DDR ECC information */
            HAL_DDR_ECC_GetInfo(&eccInfo); /* Cumulative CE and UE counts are stored
in the eccInfo structure */
            HAL_DelayMs(50);/* Polling interval, or other APIs to let the CPU idle */
        }
    }
}
```

<!-- Source EN PDF p.112, block 1290 -->

Аппаратные прерывания

<!-- Source EN PDF p.112, block 1291 -->

Пример:

<!-- Source EN PDF p.112, block 1292 -->

```text
struct DDR_ECC_CNT eccInfo;
void HAL_DDR_ECC_IRQHandler(uint32_t irq)
{
    HAL_DDR_ECC_GetInfo(&eccInfo);
}
void HAL_DDR_ECC_TEST_INT(void)
{
    uint32_t cpuID;
    cpuID = HAL_CPU_TOPOLOGY_GetCurrentCpuId();
    if (cpuID == 0) { /* Use a CPU, thread, or other method to initialize DDR ECC
related */
        HAL_DDR_ECC_Init(&eccInfo);
        HAL_GIC_SetHandler(DDR_ECC_CE_IRQn, HAL_DDR_ECC_IRQHandler); /* Attach CE
interrupt service routine */
        HAL_GIC_SetHandler(DDR_ECC_UE_IRQn, HAL_DDR_ECC_IRQHandler); /* Attach UE
interrupt service routine */
        HAL_GIC_Enable(DDR_ECC_CE_IRQn); /* Enable CE interrupt
service */
        HAL_GIC_Enable(DDR_ECC_UE_IRQn); /* Enable UE interrupt
service */
    }
}
```

<!-- Source EN PDF p.112, block 1293 -->

При обнаружении ошибки ECC выведите полученные сведения DDR ECC.

<!-- Source EN PDF p.113, block 1294 -->

```text
# 2 CE (correctable errors) detected
[HAL WARNING] DDR ECC error: CE, 2 errors, the last is in DDR cs 0, Row 0xa0, ChipID
0x0, BankGroup 0x0, Bank 0x5, Col 0x318, Bit position 0x10000000
# 1 UE (uncorrectable error) detected
[HAL ERROR] DDR ECC error: UE, 1 errors, the last is in DDR cs 0, Row 0xa0, ChipID
0x0, bankGroup 0x0, Bank 0x5, Col 0x354
```

<!-- Source EN PDF p.113, block 1295 -->

### 7.6 DDR ECC data poison

<!-- Source EN PDF p.113, block 1296 -->

Для проверки работы DDR ECC предусмотрен режим data poison — намеренного внесения ошибки. После его включения запись и чтение по заданному физическому адресу вызывают DDR ECC CE/UE.

<!-- Source EN PDF p.113, block 1297 -->

#### 7.6.1 Код и API

<!-- Source EN PDF p.113, block 1298 -->

```text
lib/hal/src/hal_ddr_ecc.c
```

<!-- Source EN PDF p.113, block 1299 -->

```text
lib/hal/inc/hal_ddr_ecc.h
```

<!-- Source EN PDF p.113, block 1300 -->

```text
/* Enable DDR ECC error injection */
HAL_Status HAL_DDR_ECC_PoisonEnable(struct DDR_ECC_CNT *p);
/* Disable DDR ECC error injection */
HAL_Status HAL_DDR_ECC_PoisonDisable(struct DDR_ECC_CNT *p);
```

<!-- Source EN PDF p.113, block 1301 -->

По умолчанию data poison создаёт обнаруживаемую и исправимую однобитную ошибку CE. Для перехода к

<!-- Source EN PDF p.113, block 1302 -->

обнаруживаемой, но неисправимой двухбитной ошибке UE внесите следующее изменение:

<!-- Source EN PDF p.113, block 1303 -->

```text
static HAL_Status DDR_ECC_SMCPoison(uint32_t eccPoisonEn,
                                    struct DDR_ECC_CNT *priv)
{
    ...
    pShareMemCfg->eccPoisonMode = DDR_ECC_UE_DATA_POISON;
    ...
}
```

<!-- Source EN PDF p.113, block 1304 -->

#### 7.6.2 Пример использования

<!-- Source EN PDF p.113, block 1305 -->

```text
struct DDR_ECC_CNT eccInfo;
void DDR_ECC_PoisonTriger(struct DDR_ECC_CNT *priv)
{
    uint32_t volatile *p = NULL;
    printf("DDR_ECC debug: eccPoisonAddr = 0x%llx\n", priv->eccPoisonAddr);
    if (priv->eccPoisonAddr) {
        p = (uint32_t volatile *)priv->eccPoisonAddr;
        *p = 0x5aa5f00f; /* Write to the DDR ECC data poison physical address */
        HAL_DCACHE_CleanInvalidate(); /* If the address attribute is cacheable, flush Dcache
to ensure the write is successful */
        printf("DDR_ECC debug: %p = 0x%x, reread = 0x%x\n", p, *p, *p);
    }
}
void DDR_ECC_GetInfo(void)
{
    HAL_DDR_ECC_GetInfo(&eccInfo);
}
void HAL_DDR_ECC_TEST_POLL(void)
{
    uint32_t cpuID;
    uint32_t i = 10;
    cpuID = HAL_CPU_TOPOLOGY_GetCurrentCpuId();
    if (cpuID == 0) {
        HAL_DDR_ECC_Init(&eccInfo);
        HAL_DDR_ECC_PoisonEnable(&eccInfo);/* Enable DDR ECC data poison, the physical
address for data poison will be saved in eccInfo.eccPoisonAddr */
        while (i) {
            DDR_ECC_GetInfo();
            HAL_DelayMs(50);
            i--;
            if (i == 5) {
                DDR_ECC_PoisonTriger(&eccInfo); /* Trigger DDR ECC error */
            }
        }
        HAL_DDR_ECC_PoisonDisable(&eccInfo);
    }
}
```

<!-- Source EN PDF p.114, block 1307 -->

### 7.7 Примечания

<!-- Source EN PDF p.114, block 1308 -->

1\. DDR ECC использует пространство DDR [0x100000, 0x1F0000]. Если оно не отображено в MMU, добавьте отображение.

<!-- Source EN PDF p.114, block 1309 -->

```text
--- a/lib/CMSIS/Device/RK3568/Source/Templates/mmu_rk3568.c
+++ b/lib/CMSIS/Device/RK3568/Source/Templates/mmu_rk3568.c
@@ -41,6 +41,8 @@ void MMU_CreateTranslationTable(void)
     // Define dram address space
    ...
+ MMU_TTSection(MMUTable, 0x100000, 0x100000 >> 20, Sect_Normal);
    ...
```

<!-- Source EN PDF p.114, block 1310 -->

2\. Физическое адресное пространство для data poison может быть не отображено в HAL. Добавьте отображение; пример ниже относится к адресу 0x13576c20.

<!-- Source EN PDF p.115, block 1311 -->

```text
--- a/lib/CMSIS/Device/RK3568/Source/Templates/mmu_rk3568.c
+++ b/lib/CMSIS/Device/RK3568/Source/Templates/mmu_rk3568.c
@@ -41,6 +41,8 @@ void MMU_CreateTranslationTable(void)
     // Define dram address space
    ...
+ MMU_TTSection(MMUTable, 0x13500000, 0x100000 >> 20, Sect_Normal);
    ...
```

<!-- Source EN PDF p.115, block 1312 -->

3\. DED ECC вызывает исключение CPU data abort. По умолчанию HAL его не обрабатывает. Чтобы вывести сообщение об ошибке DDR ECC UE, внесите следующее изменение.

<!-- Source EN PDF p.115, block 1313 -->

```text
--- a/lib/CMSIS/Device/RK3568/Source/Templates/GCC/startup_rk3568.c
+++ b/lib/CMSIS/Device/RK3568/Source/Templates/GCC/startup_rk3568.c
@@ -237,6 +237,7 @@ void Reset_Handler(void)
  *----------------------------------------------------------------------------*/
 void Default_Handler(void)
 {
+ DDR_ECC_GetInfo();
     while(1);
 }
```

{% endraw %}
