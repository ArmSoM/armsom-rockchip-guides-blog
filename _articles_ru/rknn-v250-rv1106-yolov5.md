---
title: "RKNN на RV1103/RV1106, часть 4: YOLOv5, Python и развёртывание C"
description: "RKNN на RV1103/RV1106, часть 4: YOLOv5, Python и развёртывание C · RKNN2 V2.5.0"
excerpt: "RKNN на RV1103/RV1106, часть 4: YOLOv5, Python и развёртывание C"
translation_key: "rknn-v250-rv1106-yolov5"
slug: "rknn-v250-rv1106-yolov5"
lang: "ru"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "RV1103", "RV1106", "Mini Runtime"]
---

Справочный материал RKNN2 V2.5.0 для RV1103/RV1103B/RV1106/RV1106B с соответствующими SDK платы, драйвером RKNPU2 и librknnmrt.so. Совместимая плата ArmSoM не подтверждена. Журнал Linux 5.10.160 и результаты инференса — примеры из источника, а не испытания ArmSoM. Питание, подключение и драйверы сверяйте с BSP конкретной платы.

Источник: локальные китайский и английский PDF V2.5.0. Китайский использует свой текст и рисунки, английский, русский и немецкий — английский источник. Все технические разделы, команды и таблицы сохранены; восстановлены переносы PDF и отступы деревьев каталогов. Старая версия драйвера в примере журнала не является рекомендованной: рекомендация приведена в тексте. Загрузки и установки pip без фиксации версии сверяйте с SDK.

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

[RKNN на RV1103/RV1106, часть 1: развёртывание, платформы и репозитории](/ru/articles/rknn-v250-rv1106-deployment-flow/)

[RKNN на RV1103/RV1106, часть 2: подключение и проверка оборудования](/ru/articles/rknn-v250-rv1106-hardware/)

[RKNN на RV1103/RV1106, часть 3: среда ПК и Mini Runtime](/ru/articles/rknn-v250-rv1106-host-runtime/)

**RKNN на RV1103/RV1106, часть 4: YOLOv5, Python и развёртывание C**

[RKNN на RV1103/RV1106, часть 5: Docker, диагностика и документация](/ru/articles/rknn-v250-rv1106-docker-faq/)

{% raw %}

## 4. Запуск первой модели общего назначения

На примере RV1106 и YOLOv5 выполняются получение модели, преобразование в RKNN, инференс через Python и развёртывание C/C++ на плате.

Примечание: параметры и способы использования примеров Model Zoo могут различаться. Следуйте README.md в соответствующем каталоге.

### 4.1 Получение примера и модели

RKNN Model Zoo содержит примеры распространённых моделей. Структура проекта:

```text
rknn_model_zoo
├── 3rdparty # Third-party libraries
├── datasets # Datasets
├── examples # Example code
├── utils # Common utilities, such as file operations and drawing
├── build-android.sh # Build script for Android development boards
├── build-linux.sh # Build script for Linux development boards
└── ...
```

Пример YOLOv5:

```text
rknn_model_zoo
├── examples
│   └── yolov5
│       ├── cpp # C/C++ example code
│       ├── model # Models, test images, and other files
│       ├── python # Model conversion script and Python example code
│       └── README.md
└── ...
```

Перейдите в каталог model и запустите download_model.sh для загрузки ONNX-модели YOLOv5:

```text
cd Projects/rknn_model_zoo/examples/yolov5/model

# Download the yolov5 ONNX model
# Example download result: model/yolov5s_relu.onnx
./download_model.sh
```

### 4.2 Преобразование модели

В каталоге Python-примера YOLOv5 преобразуйте ONNX в RKNN с помощью convert.py:

```text
cd Projects/rknn_model_zoo/examples/yolov5/python

# Usage: python convert.py model_path [rv1103|rv1103b|rv1106|rv1106b] [i8/fp] [output_path]
python convert.py ../model/yolov5s_relu.onnx rv1106 i8 ../model/yolov5s_relu.rknn
```

Модели RKNN для RV1103/RV1106 нельзя использовать на RV1103B/RV1106B. При другой плате измените параметр платформы в команде.

### 4.3 Запуск RKNN Python Demo

RKNN Python Demo запускает преобразованную модель YOLOv5 RKNN на подключённой плате через механизм отладки:

```text
cd Projects/rknn_model_zoo/examples/yolov5/python

# Usage: python yolov5.py --model_path {rknn_model} --target {target_platform} --img_show
# --img_show displays the result image
python yolov5.py --model_path ../model/yolov5s_relu.rknn --target rv1106 --img_show
```

Для предварительного запуска исходной ONNX-модели на компьютере выполните:

```text
python yolov5.py --model_path ../model/yolov5s_relu.onnx --img_show
```

Входное изображение по умолчанию — model/bus.jpg. Ниже показан результат источника:

![Рисунок английского оригинала · PDF 22](/assets/images/rknn-v250/rv1106/en/p022-figure-01.png)

*Рисунок английского оригинала · PDF 22*

Рисунок 4-1. Результат RKNN Python Demo

Успешный инференс Python Demo проверяет базовое преобразование модели, соединение ADB, rknn_server и Mini Runtime на плате.

### 4.4 Сборка и развёртывание RKNN C Demo

Python Demo и C Demo используют одну преобразованную модель RKNN; повторять разделы 4.1 и 4.2 не нужно.

Для полного запуска RKNN C Demo скомпилируйте C/C++ в исполняемый файл, затем передайте на плату этот файл, модель, тестовое изображение и библиотеки зависимостей.

#### 4.4.1 Компиляция

В примере используется RV1106 с Linux и архитектурой armhf. RV1103/RV1103B также являются платами Linux.

Перед запуском build-linux.sh укажите локальный кросс-компилятор GCC. Добавьте в начало build-linux.sh:

```text
GCC_COMPILER=Projects/arm-rockchip831-linux-uclibcgnueabihf/bin/arm-rockchip831-linux-uclibcgnueabihf
```

Затем скомпилируйте:

```text
cd Projects/rknn_model_zoo

# Usage: ./build-linux.sh -t <target> -a <arch> -d <build_demo_name> [-b <build_type>] [-m]
# -t : target (rv1103/rv1106); rv1103b/rv1106b and rv1103/rv1106 can share code other than models
# -a : arch (aarch64/armhf)
# -d : demo name, corresponding to a subdirectory under examples, such as yolov5 or mobilenet
# -b : build_type(Debug/Release)
# -m : enable address sanitizer; build_type must be set to Debug
./build-linux.sh -t rv1106 -a armhf -d yolov5
```

#### 4.4.2 Передача файлов на плату

После сборки в rknn_model_zoo появляется install с исполняемым файлом, библиотеками, моделью и тестовым изображением. Пример структуры:

```text
install
└── rv1106_linux_armhf
    └── rknn_yolov5_demo
        ├── lib
        ├── model
        └── rknn_yolov5_demo
```

Передайте на плату весь каталог Demo:

```text
cd Projects/rknn_model_zoo

# For different models and platforms, select the corresponding path under install
adb push install/rv1106_linux_armhf/rknn_yolov5_demo /data/
```

### 4.5 Запуск на плате и проверка результата

Войдите на плату и запустите программу:

```text
adb shell

cd /data/rknn_yolov5_demo/

# Set the dependency library environment
export LD_LIBRARY_PATH=/data/rknn_yolov5_demo/lib

# Usage: ./rknn_yolov5_demo <model_path> <input_path>
./rknn_yolov5_demo model/yolov5s_relu.rknn model/bus.jpg
```

По умолчанию изображение сохраняется в rknn_yolov5_demo/out.png. На компьютере получите результат следующей командой:

```text
adb pull /data/rknn_yolov5_demo/out.png .
```

Изображение результата источника:

![Рисунок английского оригинала · PDF 25](/assets/images/rknn-v250/rv1106/en/p025-figure-01.png)

*Рисунок английского оригинала · PDF 25*

Рисунок 4-2. Результат RKNN C Demo

Если out.png создаётся и успешно передаётся, первая проверка компиляции C/C++, развёртывания файлов, загрузки Mini Runtime и инференса на плате завершена.

### 4.6 Оценка точности на наборе данных (необязательно)

rknn_model_zoo/datasets хранит наборы данных для оценки точности. Для YOLOv5 сначала загрузите проверочный набор COCO.

```text
cd Projects/rknn_model_zoo/datasets/COCO

# Download the val2017 dataset
python download_eval_dataset.py
```

Установите pycocotools и задайте режим оценки и путь набора данных параметрами --coco_map_test и --img_folder:

```text
pip install pycocotools

cd Projects/rknn_model_zoo/examples/yolov5/python

python yolov5.py \
    --model_path ../model/yolov5s_relu.rknn \
    --target rv1106 \
    --img_folder ../../../datasets/COCO/val2017 \
    --coco_map_test
```

{% endraw %}
