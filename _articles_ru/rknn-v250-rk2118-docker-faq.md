---
title: "RK2118 NPU, часть 5: Docker, частые вопросы и документация"
description: "RK2118 NPU, часть 5: Docker, частые вопросы и документация · RKNN2 V2.5.0"
excerpt: "RK2118 NPU, часть 5: Docker, частые вопросы и документация"
translation_key: "rknn-v250-rk2118-docker-faq"
slug: "rknn-v250-rk2118-docker-faq"
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

**Серия RK2118 для начинающих · 5/5**

[RK2118 NPU, часть 1: плата, подключение и последовательная консоль](/ru/articles/rknn-v250-rk2118-hardware/)

[RK2118 NPU, часть 2: среда ПК и установка Toolkit2](/ru/articles/rknn-v250-rk2118-host-environment/)

[RK2118 NPU, часть 3: RT-Thread и прошивка DSP](/ru/articles/rknn-v250-rk2118-firmware/)

[RK2118 NPU, часть 4: преобразование модели, USB-входы и результаты инференса](/ru/articles/rknn-v250-rk2118-model-demo/)

**RK2118 NPU, часть 5: Docker, частые вопросы и документация**

<!-- rk2118-series:end -->

{% raw %}

## 5. Преобразование RKNN в Docker (необязательно)

Чтобы выполнять RKNN Python Demo в Docker, подготовьте среду по этой главе.

Источник предоставляет образ Docker со средой RKNN-Toolkit2, позволяющий запускать RKNN Python Demo без самостоятельной установки среды. Однако образ содержит только чистую среду RKNN-Toolkit2 и предназначен именно для RKNN Python Demo.

Глава состоит из трёх частей:

- Установка Docker

- Установка среды RKNN-Toolkit2 в Docker

- Запуск RKNN Python Demo

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

### 5.2 Установка среды RKNN-Toolkit2 в Docker

#### 5.2.1 Подготовка образа RKNN-Toolkit2

Предусмотрены два способа создания среды RKNN-Toolkit2. Выберите любой из них.

**1. Создание образа RKNN Toolkit2 с помощью Dockerfile**

В проекте RKNN-Toolkit2 каталог docker/docker_file содержит Dockerfile для сборки среды разработки. Создайте образ командой docker build:

```text
# Note: Replace 'xx' and 'x.x.x' with the actual version numbers
cd Projects/rknn-toolkit2/rknn-toolkit2/docker/docker_file/ubuntu_xx_xx_cpxx
docker build -f Dockerfile_ubuntu_xx_xx_for_cpxx -t rknn-toolkit2:x.x.x-cpxx .
```

**2. Создание образа RKNN Toolkit2 загрузкой готового файла образа Docker**

Загрузите файлы проекта RKNN-Toolkit2 нужной версии по следующей ссылке. После распаковки каталог docker/docker_image содержит готовый образ Docker со всей средой разработки.

Ссылка на облачный диск: https://console.zbox.filez.com/l/I00fc3 (код доступа: rknn).

Загрузите файл образа для нужной версии Python следующей командой:

```text
# Note: Replace 'x.x.x' with the actual version number of RKNN-Toolkit2, and 'cpxx' with the Python version
docker load --input rknn-toolkit2-x.x.x-cpxx-docker.tar.gz
```

#### 5.2.2 Просмотр информации об образах

После создания или загрузки образа его информацию можно посмотреть следующей командой:

```text
docker images
```

Пример информации об образе RKNN-Toolkit2:

```text
REPOSITORY TAG IMAGE ID CREATED SIZE
rknn-toolkit2 x.x.x-cpxx xxxxxxxxxxxx 1 hours ago 5.89GB
```

### 5.3 Преобразование модели

- Подключение файлов и запуск контейнера

В источнике дана ссылка на главу 3.1 для загрузки rt-thread. Подключите локальный проект к контейнеру и запустите его через docker run. После запуска откроется bash контейнера. Пример команд:

```text
# Use the docker run command to create and run the RKNN Toolkit2 container
# Map local files into the container by attaching the -v <host src folder>:<image dst folder> parameter
docker run -t -i --privileged \
    -v /dev/bus/usb:/dev/bus/usb \
    -v /Projects/rt-thread:/rt-thread \
    rknn-toolkit2:x.x.x-cpxx \
    /bin/bash
```

- Преобразование модели

Перейдите в rt-thread/components/rknpu/examples/rknn_benchmark/res и запустите convert.py.

```text
cd rt-thread/components/rknpu/examples/rknn_benchmark/res
python convert.py
```

## 6. Частые вопросы

### 6.1 Устройство adb не отображается

RK2118 сейчас не поддерживает отладку через adb, поэтому команда не показывает устройства adb.

### 6.2 Назначение rknn_demo_server

На RK2118 rknn_demo_server не используется для отладки подключённой платы через RKNN-Toolkit2. Он обеспечивает взаимодействие DSP и MCU.

## 7. Справочные документы

- Подробное описание использования и интерфейсов RKNN-Toolkit2 и RKNPU2 см. в RKNN2_SDK_Development_Guide_V2.5.0.pdf.

- Документацию по RK2118 см. в Rockchip_Developer_Guide_RK2118_CN.pdf.

Примечание: если в этом руководстве не указано фиксированное имя сопутствующего документа, используйте фактическое имя в текущем выпуске SDK.

{% endraw %}
