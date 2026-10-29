---
title: "RKNN2 V2.5.0, часть 6: Docker, диагностика и документация"
description: "RKNN2 V2.5.0, часть 6: Docker, диагностика и документация · RKNN2 V2.5.0"
excerpt: "RKNN2 V2.5.0, часть 6: Docker, диагностика и документация"
translation_key: "rknn-v250-sdk-quickstart-docker-faq"
slug: "rknn-v250-sdk-quickstart-docker-faq"
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

[RKNN2 V2.5.0, часть 5: детекция YOLOv5 и оценка точности](/ru/articles/rknn-v250-sdk-quickstart-yolov5/)

**RKNN2 V2.5.0, часть 6: Docker, диагностика и документация**

{% raw %}

## 5. Запуск RKNN Python Demo в Docker (необязательно)

Чтобы выполнять RKNN Python Demo в Docker, подготовьте среду по этой главе.

Предоставляемый образ Docker содержит среду RKNN-Toolkit2 и позволяет запускать RKNN Python Demo без самостоятельной установки среды. Однако в нём только чистая среда RKNN-Toolkit2; он предназначен именно для RKNN Python Demo.

### 5.1 Установка Docker

Если Docker уже установлен, пропустите этот шаг. Иначе установите его по официальной документации.

Официальная инструкция установки Docker: https://docs.docker.com/install/linux/docker-ce/ubuntu/

Примечание: пользователя необходимо добавить в группу docker.

```text
# Create the docker group
sudo groupadd docker

# Add the current user to the docker group
sudo usermod -aG docker $USER

# Update to activate the docker group
newgrp docker

# Verify that docker commands can be executed without sudo
docker run hello-world
```

Пример вывода при успешной установке:

```text
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
719385e32844: Pull complete
Digest: sha256:88ec0acaa3ec199d3b7eaf73588f4518c25f9d34f58ce9a0df68429c5af48e8d
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
```

### 5.2 Подготовка образа RKNN-Toolkit2

Предусмотрены два способа создания среды RKNN-Toolkit2. Выберите любой из них.

1. Создание образа RKNN-Toolkit2 из Dockerfile

В проекте RKNN-Toolkit2 каталог docker/docker_file содержит Dockerfile для среды разработки. Создайте образ командой docker build:

```text
# Note: Replace 'xx' and 'x.x.x' with the actual version numbers
cd Projects/rknn-toolkit2/rknn-toolkit2/docker/docker_file/ubuntu_xx_xx_cpxx
docker build -f Dockerfile_ubuntu_xx_xx_for_cpxx -t rknn-toolkit2:x.x.x-cpxx .
```

2. Создание образа RKNN-Toolkit2 загрузкой готового файла Docker

Загрузите проект RKNN-Toolkit2 нужной версии по ссылке ниже. После распаковки в docker/docker_image находится готовый образ со всеми средами разработки.

Облачная ссылка на образ Docker: https://console.zbox.filez.com/l/I00fc3 (код: rknn)

Загрузите файл образа для нужной версии Python следующей командой.

```text
# Note: Replace 'x.x.x' with the actual version number of RKNN-Toolkit2, and 'cpxx' with the Python version
docker load --input rknn-toolkit2-x.x.x-cpxx-docker.tar.gz
```

После создания или загрузки сведения об образе Docker можно посмотреть командой:

```text
docker images
```

Сведения о соответствующем образе RKNN-Toolkit2:

```text
REPOSITORY TAG IMAGE ID CREATED SIZE
rknn-toolkit2 x.x.x-cpxx xxxxxxxxxxxx 1 hours ago 5.89GB
```

### 5.3 Запуск RKNN Python Demo в Docker

Примечание: на плате должна быть установлена среда RKNPU2. Если её нет, установите по разделу 3.3.

1. Подключение файлов и запуск контейнера

Загрузите RKNN Model Zoo локально по разделу 1.5. Подключите каталог к контейнеру и запустите docker run. После запуска откроется bash контейнера. Команды:

```text
# Use the docker run command to create and run the RKNN-Toolkit2 container
# Map local files into the container by attaching the -v <host src folder>:<image dst folder> parameter
docker run -t -i --privileged \
    -v /dev/bus/usb:/dev/bus/usb \
    -v /Projects/rknn_model_zoo:/rknn_model_zoo \
    rknn-toolkit2:x.x.x-cpxx \
    /bin/bash
```

2. Подготовка и преобразование модели в контейнере

В контейнере загрузите и преобразуйте YOLOv5 по шагам раздела 4.2.1.

3. Запуск RKNN Python Demo в контейнере

Запустите RKNN Python Demo по разделу 4.2.2. Команда:

```text
# Switch to the rknn_model_zoo/examples/yolov5/python directory
cd rknn_model_zoo/examples/yolov5/python

# Run the yolov5.py script to run the yolov5 model on the board
# Usage: python yolov5.py --model_path {rknn_model} --target {target_platform}
# Note: Here, we use rk3588 as an example platform. If using a different board, modify the platform type in the command accordingly.
python yolov5.py --model_path ../model/yolov5s_relu.rknn --target rk3588
```

Примечание: при USB-подключении платы одновременно должен работать только один adb server — на компьютере или в Docker. Чтобы подключить плату из Docker, завершите локальный adb server командой adb kill-server в терминале компьютера.

## 6. Проблемы первого запуска и дальнейшие шаги

В этой главе перечислены проблемы первого запуска и способы диагностики. Полные FAQ, ошибки преобразования, точности, производительности и памяти приведены в главе 10 «FAQ» RKNN2 SDK Development Guide.

### 6.1 adb devices не показывает устройство

Попробуйте следующие способы устранения проблемы:

1. Проверьте правильность соединения, переподключите кабель, попробуйте другой USB-порт компьютера либо другой кабель.

2. При USB-подключении одновременно должен работать только один adb server — на компьютере или в Docker. Например, для подключения платы из Docker выполните adb kill-server в терминале компьютера, завершив локальный adb server.

3. Следующая ошибка означает, что adb не установлен. Установите его командой sudo apt install adb.

```text
command 'adb' not found, but can be installed with:
sudo apt install adb
```

### 6.2 Ручной запуск службы rknn_server

Для отладки с подключённой платой RKNN-Toolkit2 необходимы установленная среда RKNPU2 и работающий rknn_server.

На некоторых платах rknn_server не запускается автоматически при включении или перезагрузке. Тогда RKNN Python Demo может выдать E init_runtime: The rknn_server on the connected device is abnormal. Ручной запуск службы описан в разделе 3.3.2.

### 6.3 Навигация по документации

После первого запуска переходите к основному документу по вашей задаче, а не ищите полный API или расширенные настройки в этом кратком руководстве.

| Что изучить дальше | Основной документ / точка входа |
| --- | --- |
| Полная установка RKNN-Toolkit2, преобразование моделей и настройка квантования | RKNN2 SDK Development Guide |
| Методы, параметры и возвращаемые значения Toolkit (Python API) | RKNN2 SDK Development Guide |
| Справочник Runtime C API | RKNN2 Runtime C API Reference |
| FAQ установки инструментов, среды NPU, преобразования и оценки моделей | RKNN2 SDK Development Guide |
| Анализ точности модели (accuracy_analysis) | RKNN2 SDK Development Guide |
| Установка RKNN-Toolkit2 через Docker | RKNN2 SDK Development Guide |
| Использование примеров моделей RKNN Model Zoo | rknn_model_zoo/examples/&lt;model_name&gt;/README.md |

{% endraw %}
