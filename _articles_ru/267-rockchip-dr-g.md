---
title: "Rockchip Dr.G: диагностика дисплея, частоты и тесты RGA/GPU/VOP"
description: "Rockchip Dr.G: диагностика дисплея, частоты и тесты RGA/GPU/VOP"
excerpt: "Rockchip Dr.G: диагностика дисплея, частоты и тесты RGA/GPU/VOP"
translation_key: "267-rockchip-dr-g"
slug: "267-rockchip-dr-g"
lang: "ru"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

Руководство основано на двуязычном оригинале Dr.G V1.5 для перечисленных платформ Rockchip Android 7.1/8.1/9.0 с ядром 4.4. Платы ArmSoM и новые BSP не испытывались: проверьте SoC, ядро, 32-битные библиотеки, инструмент и драйверы. Все результаты — примеры производителя, не измерения ArmSoM. В двуязычном PDF общий комплект снимков терминала; он сохранён во всех языках, отдельных английских изображений нет. Расхождения между командами и описаниями отмечены на месте без скрытого исправления. См. [документацию ArmSoM](https://docs.armsom.org/).

## 1 Основные функции

Dr.G объединяет скрипты и приложения повседневной отладки дисплея: сбор сведений и журналов, проверку/настройку частот и приоритетов шины, автоматические тесты RGA/GPU/VOP и анализ журналов. После изучения руководства часть проблем можно исследовать самостоятельно. Сбор журналов и состояния уменьшает предварительный обмен и синхронизацию кода между заказчиком и разработчиком.

## 2 Зависимости платформы

### 2.1 Поддерживаемые платформы

Источник рассчитан на ядро 4.4. Платформы и версии Android приведены ниже; команда справки:

| SoC | Android |
|---|---|
| RK3368 | 7.1, 8.1, 9.0 |
| RK3288 | 7.1, 8.1, 9.0 |
| RK3399 | 7.1, 8.1, 9.0 |
| RK3328 | 8.1, 9.0 |
| RK3126C | 8.1, 9.0 |
| RK3326 | 8.1, 9.0 |

```sh
dr-g -h
```

![Команда справки (PDF 6)](/docs/rockchip-dr-g/images/bilingual-p006-1.png)

Команда справки (PDF 6)

### 2.2 Зависимости Android

Для совместимости Dr.G собран как 32-битный binary; рекомендуемое размещение — `/system/bin`. При отсутствии библиотеки, например `librga.so not found`, скопируйте нужную `.so` из `/vendor/lib/` в `/system/lib/`; исходный push-скрипт делает это автоматически.

![Ошибка зависимости librga (PDF 6)](/docs/rockchip-dr-g/images/bilingual-p006-2.png)

Ошибка зависимости librga (PDF 6)

### 2.3 Архивы программы

| Archive | Android |
|---|---|
| `dr-g-release_for_Android_7.1_v1.5.tar.gz` | 7.1 |
| `dr-g-release_for_Android_8.1_v1.5.tar.gz` | 8.1 |
| `dr-g-release_for_Android_9.0_v1.5.tar.gz` | 9.0 |

Распакуйте соответствующий архив, убедитесь в соединении ADB и работоспособности `adb root`, `adb remount`, `adb shell`, затем выполните `only_push_dr-g.bat` для установки и диагностики на плате.

![Скрипт установки (PDF 7)](/docs/rockchip-dr-g/images/bilingual-p007-1.png)

Скрипт установки (PDF 7)

## 3 Использование

### 3.1 Сбор системных сведений и журналов

#### 3.1.1 Команда

```sh
dr-g -dump-info
```

Собирает `manifest.xml`, `commit_id.xml`, `build.prop`, `anr_trace`, `logcat`, `dmesg`, приоритеты I/O, текущие частоты/напряжения и максимальные частоты CPU/GPU/DDR, `vop_clk_summary`, состояние fence, `dumpsys SurfaceFlinger`, процессы `ps`. Создаёт `/data/dr-g-file/dumpInfo.tar`.

![Пример системных сведений (PDF 8)](/docs/rockchip-dr-g/images/bilingual-p008-1.png)

Пример системных сведений (PDF 8)

#### 3.1.2 Скрипты

Двойной щелчок по `push_and_pull_dr-g.bat` собирает сведения и сохраняет `dumpInfo.tar` в каталоге с отметкой времени по текущему пути. Только для установки используйте `only_push_dr-g.bat`, только для получения архива — `only_pull_dr-g.bat`.

![Сбор одним действием (PDF 9)](/docs/rockchip-dr-g/images/bilingual-p009-1.png)

Сбор одним действием (PDF 9)

### 3.2 Проверка и настройка частот

#### 3.2.1 Максимальная производительность

```sh
dr-g -sys-set perf
```

Устанавливает максимальные частоты CPU/GPU/DDR, отключает термоконтроль и выводит частоты для отладки производительности. Поскольку термоконтроль отключается, проверьте охлаждение в контролируемых условиях.

![Максимальные частоты (PDF 9)](/docs/rockchip-dr-g/images/bilingual-p009-2.png)

Максимальные частоты (PDF 9)

#### 3.2.2 Текущие частоты

```sh
dr-g -sys-set info
```

Выводит текущие частоты CPU/GPU/DDR и состояние термоконтроля для отладки.

![Проверка частот (PDF 10)](/docs/rockchip-dr-g/images/bilingual-p010-1.png)

Проверка частот (PDF 10)

#### 3.2.3 Уровни частоты GPU

```sh
dr-g -sys-set gpu low
dr-g -sys-set gpu mid
dr-g -sys-set gpu high
```

Для поиска узкого места GPU команды устанавливают максимальные частоты CPU и DDR, а для GPU выбирают низкий, средний или высокий уровень таблицы; сравните поведение приложения.

![GPU низкая (PDF 11)](/docs/rockchip-dr-g/images/bilingual-p011-1.png)

GPU низкая (PDF 11)

![GPU средняя (PDF 11)](/docs/rockchip-dr-g/images/bilingual-p011-2.png)

GPU средняя (PDF 11)

![GPU высокая (PDF 11)](/docs/rockchip-dr-g/images/bilingual-p011-3.png)

GPU высокая (PDF 11)

#### 3.2.4 Уровни частоты CPU

```sh
dr-g -sys-set cpu low
dr-g -sys-set cpu mid
dr-g -sys-set cpu high
```

Для поиска узкого места CPU команды устанавливают максимальные частоты GPU и DDR, а для CPU выбирают низкий, средний или высокий уровень таблицы; сравните поведение приложения.

![CPU низкая (PDF 12)](/docs/rockchip-dr-g/images/bilingual-p012-1.png)

CPU низкая (PDF 12)

![CPU средняя (PDF 12)](/docs/rockchip-dr-g/images/bilingual-p012-2.png)

CPU средняя (PDF 12)

![CPU высокая (PDF 12)](/docs/rockchip-dr-g/images/bilingual-p012-3.png)

CPU высокая (PDF 12)

#### 3.2.5 Уровни частоты DDR

```sh
dr-g -sys-set ddr low
dr-g -sys-set ddr mid
dr-g -sys-set ddr high
```

Для поиска узкого места DDR команды устанавливают максимальные частоты CPU и GPU, а для DDR выбирают низкий, средний или высокий уровень таблицы; сравните поведение приложения.

![DDR низкая (PDF 13)](/docs/rockchip-dr-g/images/bilingual-p013-1.png)

DDR низкая (PDF 13)

![DDR средняя (PDF 13)](/docs/rockchip-dr-g/images/bilingual-p013-2.png)

DDR средняя (PDF 13)

![DDR высокая (PDF 14)](/docs/rockchip-dr-g/images/bilingual-p014-1.png)

DDR высокая (PDF 14)

#### 3.2.6 Восстановление регулирования

```sh
dr-g -sys-set reset
```

Восстанавливает системное регулирование частот CPU/DDR/GPU и термоконтроль.

![Восстановление регулирования (PDF 14)](/docs/rockchip-dr-g/images/bilingual-p014-2.png)

Восстановление регулирования (PDF 14)

### 3.3 Приоритет шины

#### 3.3.1 Запрос

```sh
dr-g -io-qos get
```

Выводит приоритеты и таблицу name с номерами для последующей настройки.

![Приоритеты I/O (PDF 15)](/docs/rockchip-dr-g/images/bilingual-p015-1.png)

Приоритеты I/O (PDF 15)

#### 3.3.2 Настройка

Выберите элемент таблицы; `pri_num` принимает `0~3`. Успех: `io_qos set SUCCESS !!!`.

```sh
dr-g -io-qos set
dr-g -io-qos set 4 1
dr-g -io-qos set 1 2
dr-g -io-qos set 0 1
```

Первые примеры задают `[4]` приоритет 1 и `[1]` приоритет 2. Третья команда `set 0 1` противоречит обоим исходным комментариям «установить [0] в 0». Расхождение сохранено; перед выполнением проверьте справку инструмента.

![Настройка I/O (PDF 16)](/docs/rockchip-dr-g/images/bilingual-p016-1.png)

Настройка I/O (PDF 16)

### 3.4 Автотесты RGA

#### 3.4.1 Сведения

```sh
dr-g -rga info
```

Выводит версию RGA, аппаратные форматы, коэффициенты масштабирования и максимальное разрешение входа/выхода.

![Сведения RGA (PDF 16)](/docs/rockchip-dr-g/images/bilingual-p016-2.png)

Сведения RGA (PDF 16)

#### 3.4.2 Самопроверка

```sh
dr-g -rga test
```

Проверяет преобразование, масштабирование, вращение и композицию поддерживаемых форматов, сравнивая CRC с сохранёнными. Несовпадение источник рассматривает как признак проблемы RGA.

![Самопроверка RGA (PDF 17)](/docs/rockchip-dr-g/images/bilingual-p017-1.png)

Самопроверка RGA (PDF 17)

#### 3.4.3 Эффективность

```sh
dr-g -rga perf
```

По частоте DDR и RGA aclk вычисляет теоретическое время для 720p, 1080p и 4k и сравнивает с измеренным.

![Эффективность RGA (PDF 17)](/docs/rockchip-dr-g/images/bilingual-p017-2.png)

Эффективность RGA (PDF 17)

#### 3.4.4 Demo

Параметры выбирают операции RGA; исходные и результирующие данные находятся в data. Строка после `-rga demo` должна быть непрерывной, без пробелов.

```sh
dr-g -rga demo
dr-g -rga demo sw1280sh720sf0dw1280dh720df0rt2sx0sy0dx0dy0
```

![Исходные данные RGA (PDF 18)](/docs/rockchip-dr-g/images/bilingual-p018-1.png)

Исходные данные RGA (PDF 18)

![Результат RGA (PDF 18)](/docs/rockchip-dr-g/images/bilingual-p018-2.png)

Результат RGA (PDF 18)

Таблицы параметров (сохранены написание `alpah` и значения blit 105/405; основание системы счисления не предполагается):

| alpah | blit | Formula |
|---|---|---|
| bd1 | 105 | `src + dst*(1-alpha)` |
| bd2 | 405 | `src*alpha + dst*(1-alpha)` |

| Parameter | Rotation |
|---|---|
| rt1 | rotate 90 |
| rt2 | rotate180 |
| rt3 | rotate270 |
| rt4 | mirrorH |
| rt5 | mirrorV |

| Parameter | Format |
|---|---|
| sf0 | RGBA8888 |
| sf1 | RGBX8888 |
| sf2 | BGRA8888 |
| sf3 | RGB888 |
| sf4 | RGB565 |
| sf5 | NV12 |
| sf6 | NV21 |
| sf7 | YV12 |
| sf8 | YV21 |
| sf9 | NV16 |
| sf10 | NV61 |
| sf11 | YV16 |
| sf12 | YV61 |

Пример поворачивает `/data/in0w1280-h720-rgba8888.bin` на 180° в `/data/out0w1280-h720-rgba8888.bin`. Скопируйте raw-данные для просмотра. Снимок показывает соответствующий путь `out0w1280-h720-rgba8888.bin`.

![Журнал RGA (PDF 19)](/docs/rockchip-dr-g/images/bilingual-p019-1.png)

Журнал RGA (PDF 19)

![Результат вращения RGA (PDF 20)](/docs/rockchip-dr-g/images/bilingual-p020-1.png)

Результат вращения RGA (PDF 20)

### 3.5 Автотесты GPU

#### 3.5.1 Максимальная нагрузка

```sh
dr-g -gpu max-load
dr-g -gpu max-load 100
dr-g -gpu max-load-bg
```

Можно добавить время в секундах: 100 означает 100 секунд при нагрузке около 100%, для прогона или нагрузки системы. `max-load-bg` работает в фоне, не меняя изображение; остальное как у `max-load`. В некоторых строках вёрстка разрывает `max-load` на `max -load`; параметр восстановлен по непрерывному примеру той же страницы.

![Максимальная нагрузка GPU (PDF 20)](/docs/rockchip-dr-g/images/bilingual-p020-2.png)

Максимальная нагрузка GPU (PDF 20)

#### 3.5.2 Максимальная частота кадров

```sh
dr-g -gpu max-fps
```

Shell выводит максимальную частоту кадров приложения GPU. Источник связывает её с обновлением экрана и советует проверить настройки при большом отклонении от 60fps. Это условия исходного теста, а не требование 60Hz для всех экранов.

![Максимальная частота кадров GPU (PDF 21)](/docs/rockchip-dr-g/images/bilingual-p021-1.png)

Максимальная частота кадров GPU (PDF 21)

#### 3.5.3 Производительность

```sh
dr-g -sys-set perf
dr-g -gpu perf
```

Перед тестом установите максимальные частоты CPU/DDR/GPU. Выводятся время теста и эталон платформы; превышение более чем на 10% источник считает признаком неполной производительности GPU.

![Производительность GPU (PDF 21)](/docs/rockchip-dr-g/images/bilingual-p021-2.png)

Производительность GPU (PDF 21)

#### 3.5.4 Поддержка GLES

```sh
dr-g -gpu gles11
```

![GLES 1.1 (PDF 22)](/docs/rockchip-dr-g/images/bilingual-p022-1.png)

GLES 1.1 (PDF 22)

```sh
dr-g -gpu gles20
```

![GLES 2.0 (PDF 22)](/docs/rockchip-dr-g/images/bilingual-p022-2.png)

GLES 2.0 (PDF 22)

```sh
dr-g -gpu gles30
```

![GLES 3.0 (PDF 22)](/docs/rockchip-dr-g/images/bilingual-p022-3.png)

GLES 3.0 (PDF 22)

После выполнения shell выводит EGL-сведения для GLES 1.1, 2.0 и 3.0. Абзац gles11 говорит об успехе «GLES1.0», что противоречит заголовку/команде 1.1. Это отмеченное расхождение источника, требующее проверки вывода.

#### 3.5.5 OpenCL

```sh
dr-g -cl
```

В исходнике `dr-g –cl` содержит типографское тире; по снимку восстановлено ASCII `-cl`. Сообщение `OpenCL test OK !` означает успех исходного теста OpenCL.

![Тест OpenCL (PDF 23)](/docs/rockchip-dr-g/images/bilingual-p023-1.png)

Тест OpenCL (PDF 23)

#### 3.5.6 Vulkan

```sh
dr-g -vk info
```

Выводит версию Vulkan, поддерживаемые расширения и функции.

![Сведения Vulkan (PDF 23)](/docs/rockchip-dr-g/images/bilingual-p023-2.png)

Сведения Vulkan (PDF 23)

```sh
dr-g -vk test
```

Рисует простой треугольник. Видимый треугольник и `vulkan test ok` означают успешную проверку среды драйвера Vulkan.

![Результат Vulkan (PDF 23)](/docs/rockchip-dr-g/images/bilingual-p023-3.png)

Результат Vulkan (PDF 23)

### 3.6 Автотесты VOP

#### 3.6.1 Максимальная нагрузка DDR

```sh
dr-g -vop -c chip-type
```

Настраивает VOP и увеличивает нагрузку DDR, проверяя вывод при заданных условиях. `chip-type`: `rk3399`, `rk3326`, `rk3368`, `rk3328`, `rk3288`, `rk3128`, `rk3188`. Список отличается от §2.1 и не доказывает более широкую поддержку.

![Максимальная нагрузка VOP (PDF 24)](/docs/rockchip-dr-g/images/bilingual-p024-1.png)

Максимальная нагрузка VOP (PDF 24)

#### 3.6.2 VOP demo

Параметры задают вывод для `win_id`, упрощая отладку экрана. Синтаксис и пример:

```sh
dr-g -vop -w <win_id>@<crtc_id>:<src_left>,<src_top>,<src_w>,<src_h>:<dst_left>,<dst_top>,<dst_w>,<dst_h>[#zpos][@<format>]
dr-g -vop -w 0@0:0,0,1536,2048:0,0,1536,2048#1@AR24 -f 1536x2048@AR24
```

![Источник VOP (PDF 25)](/docs/rockchip-dr-g/images/bilingual-p025-1.png)

Источник VOP (PDF 25)

![Результат VOP (PDF 25)](/docs/rockchip-dr-g/images/bilingual-p025-2.png)

Результат VOP (PDF 25)

### 3.7 Автоматический анализ журналов

#### 3.7.1 Текущие журналы

```sh
dr-g -log-ans
```

Сопоставляет logcat с заранее заданными правилами ошибок, выдаёт предупреждение и рекомендации. Предварительно подготовленные правила позволяют сразу выводить нужную строку и уменьшают ручной поиск в сложных журналах.

![Анализ журналов (PDF 26)](/docs/rockchip-dr-g/images/bilingual-p026-1.png)

Анализ журналов (PDF 26)

#### 3.7.2 XML-правила

`log_id` — ID журнала правила; `match_str` — строка поиска; `advice` — рекомендация.

![Исходные XML-правила (PDF 26)](/docs/rockchip-dr-g/images/bilingual-p026-2.png)

Исходные XML-правила (PDF 26)

```sh
<collection instructions="This is the rule of log analysis">
<rule>
  <log_id>1</log_id>
  <match_str>Kernel module may not have been loaded</match_str>
  <advice>此报错是由于kernel以module的形式加载mali驱动，且加载失败了，/dev/mali0节点并未被生成。建议：检查/system/lib/module下是否有该模块的.ko文件。或采用build_in的方式编译该驱动。</advice>
</rule>
<rule>
  <log_id>2</log_id>
  <match_str>Runtime and build version of gralloc private structure does not match for handle</match_str>
  <advice>Gralloc版本与预期版本对不上。建议：请同步SDK对应匹配的Gralloc版本。</advice>
</rule>
<rule>
  <log_id>3</log_id>
  <match_str>Failed to set damage region on surface</match_str>
  <advice>此报错多发生在安卓8.1系统，是hwui框架代码，在abandon之后，无返回直接报fatal导致的。可以参考redmine:189373</advice>
</rule>
<rule>
  <log_id>4</log_id>
  <match_str>beginning of crash</match_str>
  <advice>发现有Android Crash信息，可以搜索关键字：beginning of crash定位，查看堆栈</advice>
</rule>
</collection>
```

XML снимка преобразован в копируемый текст, исходные китайские advice сохранены. Рекомендации: проверить модуль Mali или встроить; синхронизировать Gralloc с SDK; hwui fatal после abandon в Android8.1 — redmine:189373; искать beginning of crash для стека.

{% endraw %}
