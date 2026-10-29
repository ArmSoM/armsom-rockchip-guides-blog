---
title: "RK2118 NPU, часть 4: преобразование модели, USB-входы и результаты инференса"
description: "RK2118 NPU, часть 4: преобразование модели, USB-входы и результаты инференса · RKNN2 V2.5.0"
excerpt: "RK2118 NPU, часть 4: преобразование модели, USB-входы и результаты инференса"
translation_key: "rknn-v250-rk2118-model-demo"
slug: "rknn-v250-rk2118-model-demo"
lang: "ru"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RK2118", "RKNN", "Toolkit2", "RT-Thread"]
---

Справочный материал для RK_EVB1_RK2118G_V20 (RK2118) и соответствующего RT-Thread SDK. Плата ArmSoM с подтверждённой совместимостью не установлена; не переносите эти инструкции напрямую на другой SoC. Проверенный BSP или ядро Linux не указаны, испытания на ArmSoM не проводились.

Источник: локальные китайский и английский RKNN2 RK2118 QuickStart V2.5.0; нумерация разделов сохранена. Китайский следует своему оригиналу, остальные языки — английскому. Исправлены переносы PDF внутри имён файлов, URL, комментариев и команд. Раздел 5.3 ссылается на 3.1 для загрузки RT-Thread, но нужные шаги находятся в 3.3.1. Docker монтирует /rt-thread, а последующая команда использует относительный путь rt-thread/...; проверьте рабочий каталог контейнера. Расхождение не исправлено скрытно. Журналы, 45ms и примеры вывода взяты из источника, а не из испытаний ArmSoM. Команды с latest или без фиксации версии не гарантируют V2.5.0; сверяйтесь с фактическим SDK.

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

<!-- rk2118-series:start -->

**Серия RK2118 для начинающих · 4/5**

[RK2118 NPU, часть 1: плата, подключение и последовательная консоль](/ru/articles/rknn-v250-rk2118-hardware/)

[RK2118 NPU, часть 2: среда ПК и установка Toolkit2](/ru/articles/rknn-v250-rk2118-host-environment/)

[RK2118 NPU, часть 3: RT-Thread и прошивка DSP](/ru/articles/rknn-v250-rk2118-firmware/)

**RK2118 NPU, часть 4: преобразование модели, USB-входы и результаты инференса**

[RK2118 NPU, часть 5: Docker, частые вопросы и документация](/ru/articles/rknn-v250-rk2118-docker-faq/)

<!-- rk2118-series:end -->

{% raw %}

## 4. Запуск примеров

В этой главе описан быстрый запуск примера на плате. Она состоит из трёх частей:

- Обзор RKNN SDK

- Преобразование модели RKNN

- Использование NPU Demo

### 4.1 Обзор RKNN SDK

На RK2118 инференс NPU выполняет HIFI4 DSP0; CPU0 не управляет оборудованием NPU напрямую. Соответствующий код разделён на три части:

```text
components/hifi4/samples/rk2118/npu_demo/ # DSP0 firmware project
| # (menuconfig: HIFI4 Project → npu Demo)
└── npu_demo_dsp0/
    └── src/rknn_api_test.c # Main test program on the DSP side; runs automatically at boot
components/hifi4/rtt/rknn_dsp_comm/ # CPU0-side service (rknn_demo_server)
                                        # Handshakes with the DSP and provides file I/O
components/hifi4/rtt/dsp_fw/npu_demo/ # DSP firmware for packaging
                                        # (dsp0.bin, updated automatically by the DSP build)
```

Поток данных во время выполнения:

1. После запуска системы CPU0 загружает прошивку DSP0 в DSP0 и запускает её; на CPU0 становится готов сервис rknn_demo_server.

2. rknn_api_test.c на DSP0 выполняет обмен подтверждениями с CPU0 через IPC, затем запрашивает файл модели check.rknn с USB-накопителя.

3. DSP0 вызывает API, например rknn_init и rknn_run, для выполнения инференса на NPU.

4. CPU0 записывает результат инференса обратно на USB-накопитель для поэлементного сравнения с эталонными данными на ПК.

Приложение на CPU0 не вызывает RKNN API напрямую. Вся логика теста находится в прошивке DSP0. Чтобы изменить её, пересоберите и упакуйте прошивку DSP; см. раздел 3.3.3.

### 4.2 Преобразование модели

Преобразование модели RKNN показано на примере MobileNetV1.

Перейдите в rt-thread/components/rknpu/examples/rknn_benchmark/res и запустите convert.py. Скрипт преобразует исходную модель PB в RKNN:

```text
cd rt-thread/components/rknpu/examples/rknn_benchmark/res
python convert.py
```

При успешном преобразовании создаются mobilenetv1.rknn и dog.npy. dog.npy содержит входные данные модели.

Примечание: перед подготовкой USB-накопителя переименуйте mobilenetv1.rknn в check.rknn, а dog.npy — в input_0.npy.

### 4.3 Использование NPU Demo

Ниже использование NPU Demo на DSP показано на примере npu_demo.

#### 4.3.1 Способ запуска

После записи прошивки DSP0 автоматически запускает npu_demo при загрузке системы; вручную выполнять команды не требуется. Наблюдайте за журналом через последовательный порт. Все сообщения имеют префикс [DSP0 INFO].

#### 4.3.2 Подготовка файлов на USB-накопителе

Подготовьте USB-накопитель FAT32, разместите файлы по приведённой структуре и вставьте его в порт USB 2.0 HOST платы. Система автоматически монтирует его в /udisk:

```text
/udisk
└── golden/
    ├── check.rknn # Model file generated in Section 4.2
    └── t0/
        └── <input_tensor_name>.npy # One file for each model input
```

Требования к входным файлам:

- Файл должен иметь стандартный формат NumPy .npy и тип данных float32. Число байтов данных должно равняться числу входных элементов × 4. Прошивка строго проверяет размер и при несоответствии сообщает Input %d size mismatch.

- Имя файла должно совпадать с именем входного тензора модели, причём символы /, : и . заменяются на _. Например, тензору input:0 соответствует input_0.npy.

- Используйте имя, выведенное в журнале последовательного порта при первом запуске, например load file: /udisk/golden/t0/xxx.npy.

- Входной .npy экспортируется из RKNN-Toolkit2 как эталонные данные (golden data).

#### 4.3.3 Просмотр результатов

Результаты доступны в двух местах:

1. Последовательный журнал: сведения о входах и выходах модели, время инференса NPU на каждой итерации, минимум и максимум выходного тензора, первые и последние 16 элементов. Сообщение rknn api test done означает успешное завершение теста.

2. USB-накопитель: полный результат записывается как float32 в /udisk/golden/t0_`<output_tensor_name>`.npy по тем же правилам именования. Файл можно прочитать через NumPy и поэлементно сравнить с эталонным выходом на ПК.

Ниже приведён фрагмент журнала измерения MobileNetV1 из исходного документа, а не тест ArmSoM:

```text
[DSP0 INFO] Read model file success: model_buffer = 0xA016CE80, model_size=...
[DSP0 INFO] index=0, name=input:0, n_dims=4, dims=[1, 224, 224, 3], ...
[DSP0 INFO] fmt=NHWC, w_stride=224, size_with_stride=301056, type=FP16
[DSP0 INFO] load file: /udisk/golden/t0/input_0.npy
[DSP0 INFO] Input 0 size check passed: 602112 bytes
[DSP0 INFO] NPU wait 0: Elapse Time = 45ms.
[DSP0 INFO] [0] MobilenetV1/Logits/SpatialSqueeze:0:
[DSP0 INFO] min = -8.1718752, max = 19.21875
```

Примечания:

- Чтобы заменить модель, достаточно заменить check.rknn и входные .npy в t0/ на USB-накопителе. Пересборка прошивки не требуется.

- Для изменения логики теста, например loop_count или переключателя дампа, пересоберите и упакуйте прошивку DSP; см. раздел 3.3.3.

{% endraw %}
