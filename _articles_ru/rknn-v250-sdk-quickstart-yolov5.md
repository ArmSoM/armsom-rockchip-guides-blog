---
title: "RKNN2 V2.5.0, часть 5: детекция YOLOv5 и оценка точности"
description: "RKNN2 V2.5.0, часть 5: детекция YOLOv5 и оценка точности · RKNN2 V2.5.0"
excerpt: "RKNN2 V2.5.0, часть 5: детекция YOLOv5 и оценка точности"
translation_key: "rknn-v250-sdk-quickstart-yolov5"
slug: "rknn-v250-sdk-quickstart-yolov5"
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

[RKNN2 V2.5.0, часть 4: преобразование и развёртывание MobileNet](/ru/articles/rknn-v250-sdk-quickstart-mobilenet/)

**RKNN2 V2.5.0, часть 5: детекция YOLOv5 и оценка точности**

[RKNN2 V2.5.0, часть 6: Docker, диагностика и документация](/ru/articles/rknn-v250-sdk-quickstart-docker-faq/)

{% raw %}

### 4.2 Пример детекции объектов

На примере YOLOv5 рассматриваются преобразование, запуск с подключённой платой, развёртывание и оценка точности детектора. Пример находится в examples/yolov5.

#### 4.2.1 Преобразование модели

В rknn_model_zoo/examples/yolov5/model запустите download_model.sh. Скрипт загрузит доступную модель YOLOv5 ONNX в текущий каталог model. Команды:

```text
# Switch to the rknn_model_zoo/examples/yolov5/model directory
cd Projects/rknn_model_zoo/examples/yolov5/model

# Run the download_model.sh script to download the yolov5 ONNX model
# For example, the downloaded ONNX model is stored at model/yolov5s_relu.onnx
./download_model.sh
```

Перейдите в rknn_model_zoo/examples/yolov5/python и запустите convert.py. Сценарий преобразует исходную ONNX-модель в RKNN. Пример команд:

```text
# Switch to the rknn_model_zoo/examples/yolov5/python directory
cd Projects/rknn_model_zoo/examples/yolov5/python

# Run the convert.py script to convert the original ONNX model to RKNN format
# Usage: python convert.py model_path [rk3566|rk3588|rk3562] [i8/fp] [output_path]
python convert.py ../model/yolov5s_relu.onnx rk3588 i8 ../model/yolov5s_relu.rknn
```

Здесь i8 включает 8-битное квантование. После преобразования в каталоге модели создаётся соответствующий файл .rknn.

#### 4.2.2 Запуск RKNN Python Demo

RKNN Python Demo запускает YOLOv5 через отладку с подключённой платой. В rknn_model_zoo/examples/yolov5/python выполните yolov5.py:

```text
# Run the yolov5.py script to run the yolov5 model on the board
# Usage: python yolov5.py --model_path {rknn_model} --target {target_platform} --img_show

# If the --img_show parameter is included, the result image will be displayed
# Note: Here, the example is for the rk3588 platform. If using a different board, modify the platform type in the command accordingly
python yolov5.py --model_path ../model/yolov5s_relu.rknn --target rk3588 --img_show

# If you want to run the original onnx model on the computer first, you can use the following command
# Usage: python yolov5.py --model_path {onnx_model} --img_show
python yolov5.py --model_path ../model/yolov5s_relu.onnx --img_show
```

После успешного запуска сценария появится следующий вывод. Поле class — предсказанная категория, score — уверенность; (xmin, ymin) — координаты верхнего левого угла рамки обнаружения, (xmax, ymax) — нижнего правого.

```text
# class @ (xmin, ymin, xmax, ymax) score
person @ (209 244 286 506) 0.884
person @ (478 238 559 526) 0.868
person @ (110 238 230 534) 0.825
bus @ (94 129 553 468) 0.705
person @ (79 354 122 516) 0.339
```

Входное изображение по умолчанию — model/bus.jpg. Результат показан ниже:

![Рисунок английского оригинала · PDF 27](/assets/images/rknn-v250/sdkquick/en/p027-figure-01.png)

*Рисунок английского оригинала · PDF 27*

Рис. 4-1 Визуализация результата RKNN Python Demo

#### 4.2.3 Запуск RKNN C Demo

Сначала скомпилируйте исходный код C/C++ в исполняемый файл, передайте его на плату и запустите. Перед компиляцией установите инструменты (раздел 3.4): для Android задайте ANDROID_NDK_PATH в начале build-android.sh, для Linux — GCC_COMPILER в начале build-linux.sh. Параметры сборки описаны в README.md каждого примера.

1. Компиляция

```text
# Board running on the Android system
# Note: configure ANDROID_NDK_PATH at the beginning of the build-android.sh script
cd Projects/rknn_model_zoo
./build-android.sh -t rk3588 -a arm64-v8a -d yolov5

# Board running on the Linux system
# Note: configure GCC_COMPILER at the beginning of the build-linux.sh script
cd Projects/rknn_model_zoo
./build-linux.sh -t rk3588 -a aarch64 -d yolov5
```

2. Передача файлов на плату

После компиляции исполняемый файл находится в папке rknn_yolov5_demo внутри install:

```text
# Board running on the Android system
adb root
adb push install/rk3588_android_arm64-v8a/rknn_yolov5_demo /data/

# Board running on the Linux system
adb push install/rk3588_linux_aarch64/rknn_yolov5_demo /userdata/
```

3. Запуск Demo на плате

```text
# Switch to the board
adb shell

# Switch to the rknn_yolov5_demo directory
# /data/rknn_yolov5_demo for Android, /userdata/rknn_yolov5_demo for Linux
cd /userdata/rknn_yolov5_demo

# Set the library dependency environment
export LD_LIBRARY_PATH=./lib

# Run the executable file
# Usage: ./rknn_yolov5_demo <model_path> <input_path>
./rknn_yolov5_demo model/yolov5s_relu.rknn model/bus.jpg
```

По умолчанию выходное изображение сохраняется в rknn_yolov5_demo/out.png. Скопируйте его с платы на компьютер через adb. В терминале компьютера выполните следующую команду:

```text
# Pull to the local current directory
adb pull /userdata/rknn_yolov5_demo/out.png .
```

Выходное изображение:

![Рисунок английского оригинала · PDF 29](/assets/images/rknn-v250/sdkquick/en/p029-figure-01.png)

*Рисунок английского оригинала · PDF 29*

Рис. 4-2 Визуализация результата RKNN C Demo

Для первого запуска достаточно убедиться, что Demo завершается нормально и создаёт out.png. Фактическая детекция зависит от версии модели, входного изображения и среды выполнения.

#### 4.2.4 Оценка точности на наборе данных (необязательно)

В rknn_model_zoo/datasets хранятся наборы для оценки точности. Сначала загрузите нужный набор в этот каталог. Для YOLOv5 нужен COCO: в rknn_model_zoo/datasets/COCO выполните download_eval_dataset.py. Скрипт загрузит val2017 в текущий каталог COCO. Команды:

```text
# Switch to the rknn_model_zoo/datasets/COCO directory
cd Projects/rknn_model_zoo/datasets/COCO

# Run the download_eval_dataset.py script to download the COCO dataset
python download_eval_dataset.py
```

Для оценки точности задайте --coco_map_test и путь набора --img_folder. Команды:

```text
# Please install pycocotools first
pip install pycocotools

# Switch to the rknn_model_zoo/examples/yolov5/python directory
cd Projects/rknn_model_zoo/examples/yolov5/python

# Run the yolov5.py script
python yolov5.py \
    --model_path ../model/yolov5s_relu.rknn \
    --target rk3588 \
    --img_folder ../../../datasets/COCO/val2017 \
    --coco_map_test
```

Примечание: для послойного сравнения результатов квантованной модели с моделью с плавающей точкой используйте rknn.accuracy_analysis() из RKNN-Toolkit2. См. «Model Accuracy Analysis» в RKNN2 SDK Development Guide.

{% endraw %}
