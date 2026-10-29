---
title: "RKNN2 V2.5.0, часть 4: преобразование и развёртывание MobileNet"
description: "RKNN2 V2.5.0, часть 4: преобразование и развёртывание MobileNet · RKNN2 V2.5.0"
excerpt: "RKNN2 V2.5.0, часть 4: преобразование и развёртывание MobileNet"
translation_key: "rknn-v250-sdk-quickstart-mobilenet"
slug: "rknn-v250-sdk-quickstart-mobilenet"
lang: "ru"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "RK3588", "RK3576", "V2.5.0"]
---

Область применения: справочный материал RKNN2 V2.5.0 для RK3562, семейств RK3566/3568/3576/3588 и RV1126B. Плате ArmSoM с тем же SoC всё равно нужны соответствующие BSP, драйвер NPU и Runtime; нельзя напрямую переносить требования EVB Rockchip к питанию, USB и прошивке. Требования к ПК и драйверу приведены ниже. Проверка на оборудовании ArmSoM не проводилась.

Подготовлено по локальным китайскому и английскому оригиналам V2.5.0 с сохранением нумерации. Китайский использует китайские рисунки, остальные языки — рисунки английского источника. Восстановлены переносы PDF, продолжения таблиц и отступы кода. Примеры вывода не являются испытаниями ArmSoM.

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

[RKNN2 V2.5.0, часть 1: развёртывание, платформы и репозитории SDK](/ru/articles/rknn-v250-sdk-quickstart-deployment-flow/)

[RKNN2 V2.5.0, часть 2: подключение и проверка ADB](/ru/articles/rknn-v250-sdk-quickstart-hardware/)

[RKNN2 V2.5.0, часть 3: Toolkit, Runtime Android/Linux и компиляторы](/ru/articles/rknn-v250-sdk-quickstart-environment/)

**RKNN2 V2.5.0, часть 4: преобразование и развёртывание MobileNet**

[RKNN2 V2.5.0, часть 5: детекция YOLOv5 и оценка точности](/ru/articles/rknn-v250-sdk-quickstart-yolov5/)

[RKNN2 V2.5.0, часть 6: Docker, диагностика и документация](/ru/articles/rknn-v250-sdk-quickstart-docker-faq/)

{% raw %}

## 4. Запуск примеров моделей

MobileNet (классификация изображений) и YOLOv5 (детекция объектов) показывают минимальный полный цикл: получение модели → преобразование → запуск с подключённой платой → компиляция и развёртывание → запуск на плате → проверка результатов. Полные настройки преобразования, методы квантования, оценку точности/производительности/памяти и порядок вызовов API см. в RKNN2 SDK Development Guide.

### 4.1 Пример классификации изображений

На примере MobileNet рассматриваются преобразование, запуск с подключённой платой и развёртывание модели классификации. Пример находится в examples/mobilenet.

#### 4.1.1 Преобразование модели

В rknn_model_zoo/examples/mobilenet/model запустите download_model.sh для загрузки модели MobileNet ONNX:

```text
# Switch to the rknn_model_zoo/examples/mobilenet/model directory
cd Projects/rknn_model_zoo/examples/mobilenet/model

# Download the mobilenetv2-12.onnx model
./download_model.sh
```

В rknn_model_zoo/examples/mobilenet/python запустите mobilenet.py. Скрипт преобразует ONNX в RKNN:

```text
# Switch to the rknn_model_zoo/examples/mobilenet/python directory
cd Projects/rknn_model_zoo/examples/mobilenet/python

# Usage: python mobilenet.py --model <onnx_model> --target <TARGET_PLATFORM> [--dtype <i8/fp>]
# Note: Here, the example is for the rk3588 platform. If using a different board, modify the platform type in the command accordingly
python mobilenet.py --model ../model/mobilenetv2-12.onnx --target rk3588
```

Если --dtype не указан, используется i8 (8-битное квантование); fp отключает квантование. После преобразования команда выполняет инференс в симуляторе ПК без подключения платы. Модель по умолчанию сохраняется в examples/mobilenet/model/mobilenet_v2.rknn.

#### 4.1.2 Запуск RKNN Python Demo

Инференс в симуляторе: без --npu_device_test используется симулятор ПК. Команда совпадает с разделом 4.1.1 и подходит для быстрой проверки без платы.

Запуск на плате: добавьте --npu_device_test для инференса через отладку с подключённой платой:

```text
python mobilenet.py --model ../model/mobilenetv2-12.onnx --target rk3588 --npu_device_test
```

После успешного выполнения выводятся результаты классификации TOP5:

```text
-----TOP 5-----
[494] score=0.990035 class=n03017168 chime, bell, gong
[469] score=0.003907 class=n02939185 caldron, cauldron
[653] score=0.001089 class=n03764736 milk can
[747] score=0.000945 class=n04023962 punching bag, punch bag, punching ball,
punchball
[442] score=0.000712 class=n02825657 bell cote, bell cot
```

Значение в квадратных скобках — индекс класса, score — оценка уверенности, class — имя класса.

#### 4.1.3 Запуск RKNN C Demo

Сначала скомпилируйте исходный код C/C++ в исполняемый файл, передайте его на плату и запустите. Перед компиляцией установите инструменты (раздел 3.4): для Android задайте ANDROID_NDK_PATH в начале build-android.sh, для Linux — GCC_COMPILER в начале build-linux.sh. Параметры сборки описаны в README.md каждого примера.

1. Компиляция

```text
# Board running on the Android system
# Note: configure ANDROID_NDK_PATH at the beginning of the build-android.sh script
cd Projects/rknn_model_zoo
./build-android.sh -t rk3588 -a arm64-v8a -d mobilenet

# Board running on the Linux system
# Note: configure GCC_COMPILER at the beginning of the build-linux.sh script
cd Projects/rknn_model_zoo
./build-linux.sh -t rk3588 -a aarch64 -d mobilenet
```

2. Передача файлов на плату

После компиляции исполняемый файл находится в папке rknn_mobilenet_demo внутри install:

```text
# Board running on the Android system
adb root
adb push install/rk3588_android_arm64-v8a/rknn_mobilenet_demo /data/

# Board running on the Linux system
adb push install/rk3588_linux_aarch64/rknn_mobilenet_demo /userdata/
```

3. Запуск Demo на плате

```text
# Switch to the board
adb shell

# Switch to the rknn_mobilenet_demo directory
# /data/rknn_mobilenet_demo for Android, /userdata/rknn_mobilenet_demo for Linux
cd /userdata/rknn_mobilenet_demo

# Set the library dependency environment
export LD_LIBRARY_PATH=./lib

# Run the executable file
# Usage: ./rknn_mobilenet_demo <model_path> <input_path>
./rknn_mobilenet_demo model/mobilenet_v2.rknn model/bell.jpg
```

Формат вывода TOP5 совпадает с разделом 4.1.2.

{% endraw %}
