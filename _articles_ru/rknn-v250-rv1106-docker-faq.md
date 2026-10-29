---
title: "RKNN на RV1103/RV1106, часть 5: Docker, диагностика и документация"
description: "RKNN на RV1103/RV1106, часть 5: Docker, диагностика и документация · RKNN2 V2.5.0"
excerpt: "RKNN на RV1103/RV1106, часть 5: Docker, диагностика и документация"
translation_key: "rknn-v250-rv1106-docker-faq"
slug: "rknn-v250-rv1106-docker-faq"
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

[RKNN на RV1103/RV1106, часть 4: YOLOv5, Python и развёртывание C](/ru/articles/rknn-v250-rv1106-yolov5/)

**RKNN на RV1103/RV1106, часть 5: Docker, диагностика и документация**

{% raw %}

## 5. RKNN Python Demo в Docker (необязательно)

Вместо прямой установки RKNN-Toolkit2 на компьютер можно запускать RKNN Python Demo в Docker-образе с этой средой.

Образ этой главы содержит только RKNN-Toolkit2 и в основном предназначен для Python Demo. Среду RKNPU2 на плате всё равно необходимо подготовить по разделу 3.3.

### 5.1 Установка Docker

Если Docker установлен, пропустите раздел. Иначе следуйте официальной инструкции: https://docs.docker.com/install/linux/docker-ce/ubuntu/.

После установки добавьте текущего пользователя в группу docker:

```text
# Create the docker group
sudo groupadd docker

# Add the current user to the docker group
sudo usermod -aG docker $USER

# Activate the docker group
newgrp docker

# Verify that docker commands can be executed without sudo
docker run hello-world
```

При успехе появится похожий вывод:

```text
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
719385e32844: Pull complete
Digest: sha256:88ec0acaa3ec199d3b7eaf73588f4518c25f9d34f58ce9a0df68429c5af48e8d
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
```

### 5.2 Подготовка Docker-образа RKNN-Toolkit2

Можно собрать образ по Dockerfile либо загрузить готовый файл образа.

#### 5.2.1 Сборка по Dockerfile

Dockerfile находятся в docker/docker_file проекта RKNN-Toolkit2:

```text
# xx and x.x.x represent version numbers. Replace them with the actual values
cd Projects/rknn-toolkit2/rknn-toolkit2/docker/docker_file/ubuntu_xx_xx_cpxx

docker build -f Dockerfile_ubuntu_xx_xx_for_cpxx -t rknn-toolkit2:x.x.x-cpxx .
```

#### 5.2.2 Загрузка готового образа

Образ Docker: https://console.zbox.filez.com/l/I00fc3 (код доступа: rknn).

Выполните:

```text
# x.x.x is the RKNN-Toolkit2 version, and cpxx is the Python version

docker load --input rknn-toolkit2-x.x.x-cpxx-docker.tar.gz
```

#### 5.2.3 Проверка образа

```text
docker images
```

Пример вывода:

```text
REPOSITORY TAG IMAGE ID CREATED SIZE
rknn-toolkit2 x.x.x-cpxx xxxxxxxxxxxx 1 hours ago 5.89GB
```

### 5.3 Запуск RKNN Python Demo в контейнере

Подготовьте локальный RKNN Model Zoo по разделу 1.5, затем подключите каталог и USB-устройство к контейнеру:

```text
# -v <host src folder>:<image dst folder> maps a local directory into the container

docker run -t -i --privileged \
    -v /dev/bus/usb:/dev/bus/usb \
    -v "$HOME/Projects/rknn_model_zoo:/rknn_model_zoo" \
    rknn-toolkit2:x.x.x-cpxx \
    /bin/bash
```

В контейнере подготовьте модель:

```text
cd /rknn_model_zoo/examples/yolov5/model
./download_model.sh
```

Преобразуйте модель:

```text
cd /rknn_model_zoo/examples/yolov5/python
python convert.py ../model/yolov5s_relu.onnx rv1106 i8 ../model/yolov5s_relu.rknn
```

Запустите RKNN Python Demo:

```text
python yolov5.py --model_path ../model/yolov5s_relu.rknn --target rv1106
```

После успешного запуска вывод похож на приведённый ниже: class — предсказанный класс, score — достоверность, (xmin, ymin) — верхний левый угол рамки, (xmax, ymax) — нижний правый.

```text
# class @ (xmin, ymin, xmax, ymax) score
person @ (209 243 286 510) 0.880
person @ (479 238 560 527) 0.871
person @ (109 238 231 534) 0.840
bus @ (91 129 555 464) 0.692
```

## 6. Частые проблемы первого запуска и дальнейшие шаги

Глава описывает только основные проблемы соединения, Server и памяти при первом запуске. Установку инструментов, преобразование модели и систематическое устранение ошибок см. в RKNN2_SDK_Development_Guide. По вопросам API используйте RKNN2_Toolkit_Python_API_Reference, RKNN2_Toolkit_Lite_Python_API_Reference или RKNN2_Runtime_C_API_Reference согласно выбранному интерфейсу.

### 6.1 Устройство не распознаётся

Если adb devices не показывает устройство, проверьте по порядку:

1. Проверьте кабель и подключите его заново.

2. Попробуйте другой USB-порт компьютера.

3. Замените кабель данных.

4. При USB-подключении убедитесь, что между локальным компьютером и Docker работает только один ADB Server. Для подключения из Docker сначала выполните на локальном компьютере:

```text
adb kill-server
```

Следующая ошибка означает, что ADB не установлен:

```text
command 'adb' not found, but can be installed with:
sudo apt install adb
```

Установите его:

```text
sudo apt install adb
```

### 6.2 rknn_server не запускается правильно

Для отладки через RKNN-Toolkit2 необходимы среда RKNPU2 на плате и работающий rknn_server. Некоторые системы не запускают rknn_server при загрузке. Тогда Python Demo может вывести:

```text
E init_runtime: The rknn_server on the concected device is abnormal.
```

Запустите его вручную:

```text
adb shell
restart_rknn.sh
```

Если проблема сохраняется, вернитесь к разделу 3.3.2 и проверьте Mini Runtime, Server и их версии.

### 6.3 Загрузка модели не удаётся из-за нехватки памяти

Платы RV1103/RV1103B/RV1106/RV1106B имеют ограниченную память. Если уже работает rkipc, модель может не загрузиться со следующей ошибкой:

```text
E init_runtime: Exception: RKNN init failed. error code: RKNN_ERR_MODEL_INVALID
```

Войдите на плату и завершите процесс rkipc:

```text
adb shell

# View the currently running processes and find the PID corresponding to rkipc
top

# Terminate the rkipc process
kill -9 PID
```

### 6.4 Документация для следующих шагов

После первого запуска используйте соответствующий основной документ для дальнейшей разработки. Полные процессы, API и расширенные настройки не следует искать в этом кратком руководстве.

| Задача / цель обучения | Рекомендуемый документ |
| --- | --- |
| RK3588 и другие платформы: первоначальная настройка RKNN2 SDK, преобразование модели и проверка развёртывания | RKNN2_SDK_QuickStart |
| RK2118: первоначальная настройка RKNN2 SDK, преобразование модели и проверка развёртывания | RKNN2_RK2118_QuickStart |
| Полный процесс: архитектура стека RKNN2, преобразование и квантование моделей, анализ точности/производительности, полное развёртывание и диагностика | RKNN2_SDK_Development_Guide |
| Преобразование и анализ на ПК: методы, параметры и возвращаемые значения Python API RKNN-Toolkit2 | RKNN2_Toolkit_Python_API_Reference |
| Облегчённое развёртывание Python на плате: методы, параметры и возвращаемые значения Python API RKNN-Toolkit-Lite2 | RKNN2_Toolkit_Lite_Python_API_Reference |
| Развёртывание C/C++ на плате: C API, структуры, перечисления, коды ошибок и интерфейсы Mini Runtime | RKNN2_Runtime_C_API_Reference |
| Оценка совместимости моделей: список поддерживаемых операторов RKNN и их ограничения | RKNN2_Supported_Operators_and_Constraints_Reference |

Руководство предназначено для RV1103/RV1103B/RV1106/RV1106B и везде использует RKNPU2 Mini Runtime (librknnmrt.so). RKNN2_Runtime_C_API_Reference — имя справочника Runtime C API. В нём выбирайте интерфейсы для фактической платформы и версии SDK.

{% endraw %}
