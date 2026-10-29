---

title: "Rockchip RKNN SDK V2.3.2: полное руководство по преобразованию, развёртыванию, квантованию и отладке"

description: "Полный справочник RKNN SDK V2.3.2: RKNN-Toolkit2, Runtime, C API, MatMul, пользовательские операторы, разреженный инференс, квантование, точность, производительность и FAQ."

translation_key: "092-rockchip-rknn-sdk-user-guide"

slug: "092-rockchip-rknn-sdk-user-guide"

lang: "ru"

date: "2026-10-22"

author: "ArmSoM Editorial · Rockchip source documentation"

category: "ai"

reference_products: ["Sige7", "Sige7S", "Sige5", "CM7S", "CM5", "AIM7", "Sige3", "CM3", "AIM3", "AIM5", "LM7", "W3", "KVM"]
products: []

tags: ["Rockchip", "RKNN", "NPU", "RKNN-Toolkit2", "RK3588", "RK3576"]

keywords: "ArmSoM Rockchip RKNN SDK RKNN-Toolkit2 NPU quantization"

excerpt: "Полный справочник RKNN SDK V2.3.2: RKNN-Toolkit2, Runtime, C API, MatMul, пользовательские операторы, разреженный инференс, квантование, точность, производительность и FAQ."

---

{% raw %}

# Rockchip RKNN SDK V2.3.2: полное руководство по преобразованию, развёртыванию, квантованию и отладке

## Применимость к ArmSoM и источники

Это справочник по платформе Rockchip, а не отчёт об испытаниях оборудования ArmSoM. Источник — RKNN SDK User Guide V2.3.2: 165 страниц на китайском и 178 на английском. Китайская статья следует китайскому оригиналу, английская, русская и немецкая — английскому. Китайские иллюстрации используются только в китайской статье, в остальных — английские оригиналы. Перечень SoC и требования к программной среде сохранены ниже; совместимость конкретной платы ArmSoM, SDK/BSP, драйвера ядра и RKNN Runtime не проверена. Перед развёртыванием проверьте SoC платы, драйвер NPU, версии SDK/Runtime и поддержку операторов. Все показатели производительности, точности, памяти, адреса и журналы — примеры источника. Код не выполнялся, аппаратные испытания не проводились.

Источники одной версии различаются: китайская схема анализа производительности отсутствует в английском; английский текст о разреженном инференсе добавляет ограничение числа каналов весов больше 32; различается пример оценки памяти. Опечатки, противоречивые описания API, отсутствующие значения и обрезанный текст скриншотов сохранены и отмечены, а не исправлены без пояснений. Формулы даны в редактируемой записи рядом с фрагментами оригинала; round обозначает исходную операцию округления. Подробности с номерами страниц приведены в редакционных примечаниях.

[EDITORIAL-NOTES](/docs/rockchip-rknn-sdk-user-guide/EDITORIAL-NOTES.md) · [ArmSoM](https://docs.armsom.org/) · [RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2)

<!-- source: EN PDF p7; unit 0 -->

## 1 Введение в RKNN

<!-- source: EN PDF p7; unit 1 -->

### 1\.1 Инструментарий RKNN

<!-- source: EN PDF p7; unit 2 -->

#### 1\.1.1 Обзор программного стека RKNN

<!-- source: EN PDF p7; unit 3 -->

Программный стек RKNN позволяет быстро развертывать модели ИИ на чипах Rockchip. Общая структура показана ниже:

<!-- source: EN PDF p7; unit 4 -->

![Рисунок 1-1. Программный стек RKNN](/docs/rockchip-rknn-sdk-user-guide/assets/en-p007-figure-01.png)

<!-- source: EN PDF p7; unit 5 -->

Рисунок 1-1. Программный стек RKNN

<!-- source: EN PDF p7; unit 6 -->

Для использования RKNPU сначала запустите RKNN-Toolkit2 на компьютере и преобразуйте обученную модель в формат RKNN. Затем разверните ее на плате разработки с помощью RKNN C API или Python.

<!-- source: EN PDF p7; unit 7 -->

#### 1\.1.2 Возможности RKNN-Toolkit2

<!-- source: EN PDF p7; unit 8 -->

RKNN-Toolkit2 — набор средств разработки для преобразования моделей, инференса и оценки моделей на компьютере. Его основная схема приведена ниже:

<!-- source: EN PDF p7; unit 9 -->

![Рисунок 1-2. Программная структура RKNN-Toolkit2](/docs/rockchip-rknn-sdk-user-guide/assets/en-p007-figure-02.png)

<!-- source: EN PDF p7; unit 10 -->

Рисунок 1-2. Программная структура RKNN-Toolkit2

<!-- source: EN PDF p7; unit 11 -->

Удобный интерфейс Python предоставляет следующие функции:

<!-- source: EN PDF p7; unit 12 -->

1\. Преобразование моделей: преобразование моделей PyTorch, ONNX, TensorFlow, TensorFlow Lite, Caffe, DarkNet и других форматов в RKNN.

<!-- source: EN PDF p8; unit 13 -->

2\. Квантование: преобразование моделей с плавающей точкой в модели с фиксированной точкой. Поддерживается также смешанное квантование.

<!-- source: EN PDF p8; unit 14 -->

3\. Инференс модели: передача модели RKNN на выбранное устройство NPU для выполнения и получения результатов либо моделирование NPU на компьютере для запуска модели RKNN и получения результатов.

<!-- source: EN PDF p8; unit 15 -->

4\. Оценка производительности и памяти: передача модели RKNN на выбранное устройство NPU для оценки производительности и использования памяти при выполнении на реальном устройстве.

<!-- source: EN PDF p8; unit 16 -->

5\. Анализ точности квантования: вычисление косинусного и евклидова расстояний между результатами каждого слоя квантованной модели и модели с плавающей точкой. Это облегчает анализ возникновения ошибок квантования и помогает повысить точность квантованной модели.

<!-- source: EN PDF p8; unit 17 -->

6\. Шифрование модели: шифрование всей модели RKNN с указанным уровнем шифрования.

<!-- source: EN PDF p8; unit 18 -->

#### 1\.1.3 Возможности RKNN Runtime

<!-- source: EN PDF p8; unit 19 -->

RKNN Runtime главным образом загружает модель RKNN и вызывает драйвер NPU для ее выполнения на NPU. При инференсе исходные данные проходят три основных этапа: предварительная обработка входа, выполнение модели на NPU и последующая обработка выхода. В зависимости от формата входа и способа квантования RKNN Runtime предоставляет два процесса: обычный API и API нулевого копирования.

<!-- source: EN PDF p8; unit 20 -->

Обычный API: простой и понятный набор интерфейсов инференса. Процесс показан на рисунке 1-3. Нормализация, квантование, преобразование формата расположения данных и деквантование выполняются на CPU, а инференс модели — на NPU.

<!-- source: EN PDF p8; unit 21 -->

![Рисунок 1-3. Обработка данных обычного API](/docs/rockchip-rknn-sdk-user-guide/assets/en-p008-figure-01.png)

<!-- source: EN PDF p8; unit 22 -->

Рисунок 1-3. Обработка данных обычного API

API нулевого копирования: процесс показан на рисунке 1-4 и оптимизирует обработку обычного API. Нормализация, квантование и инференс выполняются на NPU; преобразование расположения выходных данных NPU и деквантование — на CPU или NPU. API нулевого копирования эффективнее обрабатывает входной поток и позволяет получать данные между разными IP-блоками без копирования, уменьшая нагрузку на CPU и пропускную способность DDR. Например, данные камеры или декодированные данные можно напрямую передать в NPU через этот API.

<!-- source: EN PDF p9; unit 23 -->

![Рисунок 1-4. Обработка данных API нулевого копирования](/docs/rockchip-rknn-sdk-user-guide/assets/en-p009-figure-02.png)

<!-- source: EN PDF p9; unit 24 -->

Рисунок 1-4. Обработка данных API нулевого копирования

<!-- source: EN PDF p9; unit 25 -->

Если входные данные имеют только виртуальный адрес, доступен только обычный API. Если имеется физический адрес или файловый дескриптор (fd), можно использовать оба API.

<!-- source: EN PDF p9; unit 26 -->

### 1\.2 Процесс разработки RKNN

<!-- source: EN PDF p9; unit 27 -->

Блок-схема помогает понять общие этапы разработки RKNN: преобразование модели, оценка модели, развертывание и выполнение на плате.

<!-- source: EN PDF p9; unit 28 -->

![Рисунок 1-5. Процесс разработки RKNN](/docs/rockchip-rknn-sdk-user-guide/assets/en-p009-figure-01.png)

<!-- source: EN PDF p9; unit 29 -->

Рисунок 1-5. Процесс разработки RKNN

<!-- source: EN PDF p9; unit 30 -->

#### 1\.2.1 Преобразование модели

<!-- source: EN PDF p9; unit 31 -->

На этом этапе исходная модель глубокого обучения преобразуется в формат RKNN для эффективного инференса на платформах RKNPU. Этап включает:

<!-- source: EN PDF p9; unit 32 -->

Получение исходной модели: получите или обучите модель глубокого обучения в распространенной среде, например ONNX, PyTorch или TensorFlow.

<!-- source: EN PDF p9; unit 33 -->

Настройка модели: задайте необходимые параметры RKNN-Toolkit2, например средние значения, нормализацию, параметры квантования и целевую платформу.

<!-- source: EN PDF p9; unit 34 -->

Загрузка модели: импортируйте модель в RKNN-Toolkit2 подходящим интерфейсом загрузки, выбрав способ в соответствии с типом модели.

<!-- source: EN PDF p9; unit 35 -->

Построение модели: создайте модель RKNN через rknn.build(). Можно выбрать квантование, чтобы повысить производительность на аппаратной платформе.

<!-- source: EN PDF p9; unit 36 -->

Экспорт модели: сохраните модель RKNN в файл формата .rknn через rknn.export\_rknn() для последующего развертывания.

<!-- source: EN PDF p9; unit 37 -->

Подробности приведены в разделах 3.1 и 4.2.1.

<!-- source: EN PDF p10; unit 38 -->

#### 1\.2.2 Оценка модели

<!-- source: EN PDF p10; unit 39 -->

Оценка помогает проанализировать производительность, точность квантования и использование памяти на плате. Основные операции:

<!-- source: EN PDF p10; unit 40 -->

Отладка модели с подключенной платой: Python связывает компьютер с платформой RKNPU для инференса и проверки модели. Это включает предварительную обработку входа и последующую обработку результатов, чтобы проверить правильность выполнения на плате.

<!-- source: EN PDF p10; unit 41 -->

Оценка точности: используйте rknn.accuracy\_analysis() для сравнения выходов квантованной модели и модели с плавающей точкой и анализа ошибок квантования.

<!-- source: EN PDF p10; unit 42 -->

Оценка производительности: используйте rknn.eval\_perf() для определения производительности инференса на платформе, дальнейшей оптимизации структуры модели и ускорения инференса.

<!-- source: EN PDF p10; unit 43 -->

Оценка памяти: используйте rknn.eval\_memory(), чтобы определить использование памяти на плате, оптимизировать структуру модели и минимизировать потребление памяти.

<!-- source: EN PDF p10; unit 44 -->

Подробности приведены в разделах 3.2, 3.3, 4.2.2 и 4.2.3.

<!-- source: EN PDF p10; unit 45 -->

#### 1\.2.3 Развертывание и выполнение на плате

<!-- source: EN PDF p10; unit 46 -->

Этот этап охватывает фактическое развертывание и выполнение модели. Обычно он включает:

<!-- source: EN PDF p10; unit 47 -->

Инициализация модели: загрузите модель RKNN на платформу RKNPU и подготовьтесь к предварительной обработке.

<!-- source: EN PDF p10; unit 48 -->

Предварительная обработка: загрузите входные данные на платформу RKNPU и подготовьтесь к инференсу.

<!-- source: EN PDF p10; unit 49 -->

Инференс: передайте входные данные модели, выполните инференс и получите результаты.

<!-- source: EN PDF p10; unit 50 -->

Последующая обработка: получите результаты инференса, обработайте их и передайте приложению.

<!-- source: EN PDF p10; unit 51 -->

Освобождение модели: после инференса освободите ресурсы модели, чтобы другие задачи могли использовать модель RKNN.

<!-- source: EN PDF p10; unit 52 -->

Подробности приведены в разделах 3.4 и 4.2.3.

<!-- source: EN PDF p10; unit 53 -->

Эти три этапа образуют полный процесс разработки RKNN: преобразование, отладка, оценка и эффективное развертывание моделей ИИ на RKNPU.

<!-- source: EN PDF p10; unit 54 -->

### 1\.3 Поддерживаемые аппаратные платформы

<!-- source: EN PDF p10; unit 55 -->

Документ относится к следующим аппаратным платформам:

<!-- source: EN PDF p10; unit 56 -->

RV1103, RV1103B, RV1106, RV1106B, RK2118, RK3562, серии RK3566, серии RK3568, RK3576, серии RK3588, RV1126B

<!-- source: EN PDF p10; unit 57 -->

Примечание: RK3566\_RK3568 обозначает в этом документе серии RK3566/RK3568. RK3588 обозначает серии RK3588/RK3588S.

<!-- source: EN PDF p10; unit 58 -->

### 1\.4 Термины

<!-- source: EN PDF p10; unit 59 -->

Модель RKNN: двоичный файл для выполнения на RKNPU с расширением .rknn.

<!-- source: EN PDF p10; unit 60 -->

Инференс с подключенной платой: запуск модели через API RKNN-Toolkit2, причем фактически модель выполняется на NPU платы разработки.

<!-- source: EN PDF p10; unit 61 -->

DRM: Direct Rendering Manager, распространенная система графического вывода в Linux.

<!-- source: EN PDF p11; unit 62 -->

tensor: многомерный массив данных.

<!-- source: EN PDF p11; unit 63 -->

fd: файловый дескриптор, представляющий буфер.

<!-- source: EN PDF p11; unit 64 -->

NATIVE\_LAYOUT: собственное расположение данных NPU, обеспечивающее наилучшую производительность обработки при таком размещении данных в памяти.

<!-- source: EN PDF p11; unit 65 -->

Модель i8: квантованная модель RKNN, работающая с 8-битными целыми числами со знаком.

<!-- source: EN PDF p11; unit 66 -->

Модель fp16: неквантованная модель RKNN, работающая с 16-битными числами половинной точности с плавающей точкой.

<!-- source: EN PDF p11; unit 67 -->

## 2 Подготовка среды разработки

<!-- source: EN PDF p11; unit 68 -->

RKNN-Toolkit2 предоставляется в двух версиях: для x86 и ARM64. Установка одинакова, за исключением того, что ARM64 пока не поддерживает Docker. Кроме того, ARM64 поддерживает преобразование только моделей onnx и pytorch; другие среды в настоящее время не поддерживаются.

<!-- source: EN PDF p11; unit 69 -->

Различия версий x86 и ARM64:

<!-- source: EN PDF p11; unit 70 -->

| Фреймворк глубокого обучения | x86 | ARM64 |
| --- | --- | --- |
| Caffe | ✔ | ✗ |
| TensorFlow | ✔ | ✗ |
| TF Lite | ✔ | ✗ |
| ONNX | ✔ | ✔ |
| DarkNet | ✔ | ✗ |
| PyTorch | ✔ | ✔ |

<!-- source: EN PDF p11; unit 71 -->

Различия инструментов:

<!-- source: EN PDF p11; unit 72 -->

| Необходимые инструменты | x86 | ARM64 |
| --- | --- | --- |
| adb | ✔ | ✗ |
| rknn\_server | ✔ | ✗ |
| rknn runtime | ✔ | ✔ |

<!-- source: EN PDF p11; unit 73 -->

Различия при использовании x86 и ARM64:

<!-- source: EN PDF p11; unit 74 -->

Основное отличие касается отладочных функций, например анализа точности и инференса. Версия ARM64 устанавливается в ARM64 Linux; для этих функций достаточно, чтобы librknnrt.so находилась в '/usr/lib64'. Поскольку ARM64 не поддерживает adb, она работает только на текущей плате. Для x86 необходимо обновлять и использовать rknn\_server, а также обеспечить доступность adb для отладочных функций и подключения к другой плате при необходимости.

<!-- source: EN PDF p11; unit 75 -->

Кроме того, производительность x86 и ARM64 может различаться при анализе точности и квантовании.

<!-- source: EN PDF p12; unit 76 -->

Примечание: подготовка среды разработки RK2118 описана в «Rockchip\_RK2118\_Quick\_Start\_RKNN\_SDK\_EN».

<!-- source: EN PDF p12; unit 77 -->

### 2\.1 Установка RKNN-Toolkit2

<!-- source: EN PDF p12; unit 78 -->

В этой главе описаны два способа установки RKNN-Toolkit2: Docker и Pip. Выберите любой удобный способ.

<!-- source: EN PDF p12; unit 79 -->

#### 2\.1.1 Установка через Docker

<!-- source: EN PDF p12; unit 80 -->

##### 2\.1.1.1 Установка Docker

<!-- source: EN PDF p12; unit 81 -->

Если Docker уже установлен, этот шаг можно пропустить. В противном случае установите его по официальному руководству: https://docs.docker.com/install/linux/docker-ce/ubuntu/.

<!-- source: EN PDF p12; unit 82 -->

Примечание: обязательно добавьте пользователя в группу docker.

<!-- source: EN PDF p12; unit 83 -->

```text
# Create docker group
sudo groupadd docker
# Add the current user to the docker group
sudo usermod -aG docker $USER
# Update and activate the docker group
newgrp docker
# Verify that sudo is not needed to execute docker commands
docker run hello-world
```

<!-- source: EN PDF p12; unit 84 -->

При правильном выполнении результат будет следующим:

<!-- source: EN PDF p12; unit 85 -->

```text
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
719385e32844: Pull complete
Digest: sha256:88ec0acaa3ec199d3b7eaf73588f4518c25f9d34f58ce9a0df68429c5af48e8d
Status: Downloaded newer image for hello-world:latest
Hello from Docker!
```

<!-- source: EN PDF p12; unit 86 -->

##### 2\.1.1.2 Подготовка образа

<!-- source: EN PDF p12; unit 87 -->

В этом разделе приведены два способа подготовки среды образа RKNN-Toolkit2; можно выбрать любой из них.

<!-- source: EN PDF p12; unit 88 -->

1\. Создание среды образа через Dockerfile

<!-- source: EN PDF p12; unit 89 -->

В каталоге docker/docker\_file проекта RKNN-Toolkit2 находится Dockerfile для построения среды разработки RKNN-Toolkit2. Создайте образ следующей командой:

<!-- source: EN PDF p12; unit 90 -->

```text
cd docker/docker_file/ubuntu_xx_xx_cpxx
docker build -f Dockerfile_ubuntu_xx_xx_for_cpxx -t rknn-toolkit2:x.x.x-cpxx .
```

<!-- source: EN PDF p12; unit 91 -->

2\. Загрузка готового образа Docker со всеми средами разработки

<!-- source: EN PDF p12; unit 92 -->

Загрузите файл проекта RKNN-Toolkit2 нужной версии. После распаковки в каталоге docker/docker\_image находится образ Docker со всеми средами разработки.

<!-- source: EN PDF p12; unit 93 -->

Ссылка на сетевое хранилище: https://console.zbox.filez.com/l/I00fc3. Код доступа: rknn.

<!-- source: EN PDF p12; unit 94 -->

Загрузите образ, соответствующий версии Python, следующей командой:

<!-- source: EN PDF p13; unit 95 -->

```text
docker load --input rknn-toolkit2-x.x.x-cpxx-docker.tar.gz
```

<!-- source: EN PDF p13; unit 96 -->

##### 2\.1.1.3 Просмотр информации об образе

<!-- source: EN PDF p13; unit 97 -->

После создания или загрузки образа проверьте информацию об образе Docker:

<!-- source: EN PDF p13; unit 98 -->

```text
docker images
```

<!-- source: EN PDF p13; unit 99 -->

Отобразится информация об образе RKNN-Toolkit2:

<!-- source: EN PDF p13; unit 100 -->

```text
REPOSITORY TAG IMAGE ID CREATED SIZE
rknn-toolkit2 x.x.x-cpxx xxxxxxxxxxxx 1 hours ago 5.89GB
```

<!-- source: EN PDF p13; unit 101 -->

##### 2\.1.1.4 Запуск образа

<!-- source: EN PDF p13; unit 102 -->

Запустите образ Docker следующей командой. Вы попадете в среду bash образа.

<!-- source: EN PDF p13; unit 103 -->

```text
docker run -t -i --privileged -v /dev/bus/usb:/dev/bus/usb rknn-toolkit2:x.x.x-cpxx /bin/bash
```

<!-- source: EN PDF p13; unit 104 -->

Каталог examples с кодом можно подключить в среду Docker, добавив параметр `-v <host src folder>: <image dst folder>`.

<!-- source: EN PDF p13; unit 105 -->

```text
docker run -t -i --privileged -v /dev/bus/usb:/dev/bus/usb -v /your/rknn-toolkit2-x.x.x/examples:/examples rknn-toolkit2:x.x.x-cpxx /bin/bash
```

<!-- source: EN PDF p13; unit 106 -->

##### 2\.1.1.5 Запуск демонстрационного примера

<!-- source: EN PDF p13; unit 107 -->

```text
cd examples/onnx/yolov5
python test.py
```

<!-- source: EN PDF p13; unit 108 -->

После успешного выполнения скрипта результат должен выглядеть следующим образом:

<!-- source: EN PDF p13; unit 109 -->

```text
class score xmin, ymin, xmax, ymax
--------------------------------------------------
person 0.884 [ 208, 244, 286, 506]
person 0.868 [ 478, 236, 559, 528]
person 0.825 [ 110, 238, 230, 534]
person 0.339 [ 79, 353, 122, 516]
bus 0.705 [ 92, 128, 554, 467]
```

<!-- source: EN PDF p13; unit 110 -->

#### 2\.1.2 Установка через Pip

<!-- source: EN PDF p13; unit 111 -->

##### 2\.1.2.1 Установка среды Python

<!-- source: EN PDF p13; unit 112 -->

Если среда Python уже установлена, этот шаг можно пропустить.

<!-- source: EN PDF p13; unit 113 -->

```text
sudo apt-get update
sudo apt-get install python3 python3-dev python3-pip
sudo apt-get install libxslt1-dev zlib1g zlib1g-dev libglib2.0-0 libsm6 libgl1-mesa-glx libprotobuf-dev gcc
```

<!-- source: EN PDF p13; unit 114 -->

Если требуется установить RKNN-Toolkit2 в локальную среду, а не виртуальную среду Conda, после установки Python перейдите к шагу 2.1.2.4.

<!-- source: EN PDF p14; unit 115 -->

##### 2\.1.2.2 Установка Conda

<!-- source: EN PDF p14; unit 116 -->

Если в системе установлено несколько версий Python, рекомендуется управлять средой Python через Conda.

<!-- source: EN PDF p14; unit 117 -->

Проверьте наличие и версию Conda. Если она уже установлена, этот шаг можно пропустить.

<!-- source: EN PDF p14; unit 118 -->

```text
conda -V
# Prompt conda: command not found means conda is not installed.
# Successful installation will display the version such as: conda X.X.X
# X.X.X means version number, such as 23.9.0.
```

<!-- source: EN PDF p14; unit 119 -->

Загрузите установочный пакет Conda:

<!-- source: EN PDF p14; unit 120 -->

```text
wget -c https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-x86_64.sh
```

<!-- source: EN PDF p14; unit 121 -->

Установите Conda:

<!-- source: EN PDF p14; unit 122 -->

```text
chmod 777 Miniforge3-Linux-x86_64.sh
bash Miniforge3-Linux-x86_64.sh
```

<!-- source: EN PDF p14; unit 123 -->

Версия ARM64:

<!-- source: EN PDF p14; unit 124 -->

Загрузите установочный пакет Conda:

<!-- source: EN PDF p14; unit 125 -->

```text
wget -c https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-aarch64.sh
```

<!-- source: EN PDF p14; unit 126 -->

Установите Conda:

<!-- source: EN PDF p14; unit 127 -->

```text
chmod 777 Miniforge3-Linux-aarch64.sh
bash Miniforge3-Linux-aarch64.sh
```

<!-- source: EN PDF p14; unit 128 -->

##### 2\.1.2.3 Создание среды Conda для RKNN-Toolkit2

<!-- source: EN PDF p14; unit 129 -->

Перейдите в базовую среду Conda:

<!-- source: EN PDF p14; unit 130 -->

```text
source ~/miniforge3/bin/activate # Miniforge install directory path
# (base) xxx@xxx-pc:~$
```

<!-- source: EN PDF p14; unit 131 -->

Создайте среду Conda с именем RKNN-Toolkit2 и Python 3.8 — рекомендуемой версией:

<!-- source: EN PDF p14; unit 132 -->

```text
conda create -n RKNN-Toolkit2 python=3.8
```

<!-- source: EN PDF p14; unit 133 -->

Активируйте среду Conda RKNN-Toolkit2:

<!-- source: EN PDF p14; unit 134 -->

```text
conda activate RKNN-Toolkit2
# (RKNN-Toolkit2) xxx@xxx-pc:~$
```

<!-- source: EN PDF p15; unit 135 -->

##### 2\.1.2.4 Установка RKNN-Toolkit2

<!-- source: EN PDF p15; unit 136 -->

После активации среды Conda RKNN-Toolkit2 установите RKNN-Toolkit2 из источника pip либо из локального пакета wheel:

<!-- source: EN PDF p15; unit 137 -->

Установка из источника pip

<!-- source: EN PDF p15; unit 138 -->

```text
pip install rknn-toolkit2 -i https://pypi.org/simple

# If RKNN-Toolkit2 is already installed, you can upgrade it with the following command:
pip install rknn-toolkit2 -i https://pypi.org/simple --upgrade
```

<!-- source: EN PDF p15; unit 139 -->

Установка из локального пакета wheel

<!-- source: EN PDF p15; unit 140 -->

```text
# Please choose the appropriate requirements file based on the Python version and processor architecture:
# where cpxx is the Python version
pip install -r /rknn-toolkit2/packages/x86_64/requirements_cpxx.txt
# pip install -r /rknn-toolkit2/packages/arm64/arm64_requirements_cpxx.txt

# Install RKNN-Toolkit2
# Please choose the appropriate wheel package file based on the Python version and processor architecture:
# where x.x.x is the RKNN-Toolkit2 version number, cpxx is the Python version
pip install /rknn-toolkit2/packages/x86_64/rknn_toolkit2-x.x.x-cpxx-cpxx-manylinux_2_17_x86_64.manylinux2014_x86_64.whl
# pip install /rknn-toolkit2/packages/arm64/rknn_toolkit2-x.x.x-cpxx-cpxx-manylinux_2_17_aarch64.manylinux2014_aarch64.whl
```

<!-- source: EN PDF p15; unit 141 -->

Если следующая команда выполняется без ошибок, установка завершена успешно.

<!-- source: EN PDF p15; unit 142 -->

```text
$ python
>>> from rknn.api import RKNN
```

<!-- source: EN PDF p15; unit 143 -->

### 2\.2 Подготовка среды устройства NPU

<!-- source: EN PDF p15; unit 144 -->

#### 2\.2.1 Проверка версии драйвера NPU

<!-- source: EN PDF p15; unit 145 -->

Команды проверки:

<!-- source: EN PDF p15; unit 146 -->

```text
dmesg | grep -i rknpu
# or
cat /sys/kernel/debug/rknpu/version
# or
cat /sys/kernel/debug/rknpu/driver_version
# or
cat /proc/debug/rknpu/driver_version
```

<!-- source: EN PDF p15; unit 147 -->

Результаты проверки:

<!-- source: EN PDF p15; unit 148 -->

```text
RKNPU driver: vX.X.X
```

<!-- source: EN PDF p15; unit 149 -->

X.X.X обозначает номер версии, например 0.9.2.

<!-- source: EN PDF p16; unit 150 -->

В прошивке Rockchip драйвер RKNPU установлен заранее. Если приведенные команды не определяют версию NPU, в сторонней прошивке может отсутствовать драйвер RKNPU. Включите параметр CONFIG\_ROCKCHIP\_RKNPU=y в конфигурации ядра, пересоберите драйвер ядра и прошейте его. Рекомендуется версия драйвера RKNPU &gt;= 0.9.2.

<!-- source: EN PDF p16; unit 151 -->

#### 2\.2.2 Проверка среды подключения устройства NPU

<!-- source: EN PDF p16; unit 152 -->

Для отладки RKNN-Toolkit2 с подключенной платой нужен RKNN Server на устройстве. Это фоновая прокси-служба, которая получает команды и данные от компьютера через USB, выполняет соответствующие интерфейсы и возвращает результаты компьютеру. Поэтому необходимо убедиться, что RKNN Server на устройстве запущен.

<!-- source: EN PDF p16; unit 153 -->

Примечание: версии ARM64 для отладки не нужен RKNN Server. Если RKNN Toolkit2 используется на ARM64, пропустите этот шаг.

<!-- source: EN PDF p16; unit 154 -->

Проверьте, выполняется ли процесс RKNN Server на плате разработки.

<!-- source: EN PDF p16; unit 155 -->

```text
adb shell
ps | grep rknn_server
```

<!-- source: EN PDF p16; unit 156 -->

Результаты проверки:

<!-- source: EN PDF p16; unit 157 -->

```text
702 root 1192 S grep rknn_server
```

<!-- source: EN PDF p16; unit 158 -->

Если получен идентификатор процесса RKNN Server, служба запущена нормально. Если идентификатор не найден, запустите службу вручную следующей командой и повторите проверку.

<!-- source: EN PDF p16; unit 159 -->

Ручной запуск RKNN Server в Android:

<!-- source: EN PDF p16; unit 160 -->

```text
su
setenforce 0
nohup /vendor/bin/rknn_server >/dev/null&
```

<!-- source: EN PDF p16; unit 161 -->

Ручной запуск RKNN Server в Linux на RK356X/RK3576/RK3588/RV1126B:

<!-- source: EN PDF p16; unit 162 -->

```text
nohup /usr/bin/rknn_server >/dev/null&
```

<!-- source: EN PDF p16; unit 163 -->

Ручной запуск RKNN Server в Linux на RV1103/RV1103B/RV1106/RV1106B:

<!-- source: EN PDF p16; unit 164 -->

```text
nohup /oem/usr/bin/rknn_server >/dev/null&
```

<!-- source: EN PDF p16; unit 165 -->

Обычно прошивка Rockchip содержит RKNN Server, автоматически запускаемый при загрузке. Если автоматического запуска нет или отсутствуют файлы для ручного запуска, установите либо обновите RKNN Server вручную.

<!-- source: EN PDF p16; unit 166 -->

#### 2\.2.3 Установка и обновление RKNN Server

<!-- source: EN PDF p16; unit 167 -->

Если RKNN Server не установлен на плате, отсутствует библиотека Runtime или версии RKNN Server и Runtime не совпадают, их необходимо переустановить либо обновить. Основные понятия:

<!-- source: EN PDF p17; unit 168 -->

1\. RKNN Server: фоновая прокси-служба на плате. Получает данные компьютера через USB, вызывает соответствующий интерфейс Runtime на плате и возвращает результаты компьютеру.

<!-- source: EN PDF p17; unit 169 -->

2\. Библиотека RKNPU2 Runtime

<!-- source: EN PDF p17; unit 170 -->

librknnrt.so: библиотека Runtime для плат RK3562/RK3566/RK3568/RK3576/RK3588/RV1126B.

<!-- source: EN PDF p17; unit 171 -->

librknnmrt.so: библиотека Runtime для плат RV1103/RV1103B/RV1106/RV1106B.

<!-- source: EN PDF p17; unit 172 -->

Если на плате нет RKNN Server, отсутствует библиотека Runtime или их версии не совпадают, требуется переустановка либо обновление.

<!-- source: EN PDF p17; unit 173 -->

Примечание:

<!-- source: EN PDF p17; unit 174 -->

1\. Для модели RKNN с динамическими размерами входа требуются версии RKNN Server и RKNPU2 Runtime &gt;= 1.5.0.

<!-- source: EN PDF p17; unit 175 -->

2\. Для модели размером более 2 GB требуется rknn\_server версии &gt;=2.0.0b0.

<!-- source: EN PDF p17; unit 176 -->

3\. Для платформ с малым объемом памяти, таких как RV1103, RV1106, RV1103B и RV1106B, рекомендуется rknn\_server версии &gt;=2.1.0.

<!-- source: EN PDF p17; unit 177 -->

4\. Версии RKNN Server, библиотеки Runtime и RKNN-Toolkit2 должны быть согласованы. Рекомендуется установить последние версии всех компонентов.

<!-- source: EN PDF p17; unit 178 -->

5\. Служба rknn\_server на RK2118 не служит для отладки платы через RKNN-Toolkit2, а обеспечивает связь между DSP и MCU.

<!-- source: EN PDF p17; unit 179 -->

6\. Версии ARM64 не нужен RKNN Server, поэтому обновлять и использовать его не требуется. Однако отладка зависит от библиотеки RKNPU Runtime; убедитесь, что на плате установлена ее последняя версия.

<!-- source: EN PDF p17; unit 180 -->

##### 2\.2.3.1 Платформа RK356X/RK3576/RK3588/RV1126B

<!-- source: EN PDF p17; unit 181 -->

1\. Система Android

<!-- source: EN PDF p17; unit 182 -->

Проверьте версии RKNN Server и librknnrt.so. Если они различаются, обновите их до одной версии.

<!-- source: EN PDF p17; unit 183 -->

```text
# Query rknn_server version
strings /vendor/bin/rknn_server | grep -i "rknn_server version"
# Display rknn_server version is X.X.X, such as 1.6.0
# rknn_server version: X.X.X
# Query the librknnrt.so library version

# 64-bit system
strings /vendor/lib64/librknnrt.so | grep -i "librknnrt version"
# 32-bit system
strings /vendor/lib/librknnrt.so | grep -i "librknnrt version"
# Display the librknnrt library version is X.X.X, such as 1.6.0
# librknnrt version: X.X.X
```

<!-- source: EN PDF p17; unit 184 -->

Обновите RKNN Server и librknnrt.so.

<!-- source: EN PDF p17; unit 185 -->

```text
adb root
adb remount
```

<!-- source: EN PDF p17; unit 186 -->

64-битная система:

<!-- source: EN PDF p18; unit 187 -->

```text
adb push runtime/Android/rknn_server/arm64/rknn_server /vendor/bin/
adb push runtime/Android/librknn_api/arm64-v8a/librknnrt.so /vendor/lib64
```

<!-- source: EN PDF p18; unit 188 -->

32-битная система:

<!-- source: EN PDF p18; unit 189 -->

```text
adb push runtime/Android/rknn_server/arm/rknn_server /vendor/bin/
adb push runtime/Android/librknn_api/armeabi-v7a/librknnrt.so /vendor/lib
```

<!-- source: EN PDF p18; unit 190 -->

Перезапустите RKNN Server:

<!-- source: EN PDF p18; unit 191 -->

```text
adb shell
su
chmod +x /vendor/bin/rknn_server
nohup /vendor/bin/rknn_server >/dev/null&
sync
reboot
```

<!-- source: EN PDF p18; unit 192 -->

2\. Система Linux

<!-- source: EN PDF p18; unit 193 -->

Проверьте версии RKNN Server и librknnrt.so. Если они различаются, обновите их до одной версии.

<!-- source: EN PDF p18; unit 194 -->

```text
# Check rknn_server version
strings /usr/bin/rknn_server | grep -i "rknn_server version"
# Display rknn_server version is X.X.X, such as 1.6.0
# rknn_server version: X.X.X

# Query the librknnrt.so version
strings /usr/lib/librknnrt.so | grep -i "librknnrt version"
# Display the librknnrt version is X.X.X, such as 1.6.0
# librknnrt version: X.X.X
```

<!-- source: EN PDF p18; unit 195 -->

Обновите RKNN Server и librknnrt.so.

<!-- source: EN PDF p18; unit 196 -->

64-битная система:

<!-- source: EN PDF p18; unit 197 -->

```text
adb push runtime/Linux/rknn_server/aarch64/usr/bin/* /usr/bin
adb push runtime/Linux/librknn_api/aarch64/librknnrt.so /usr/lib64
```

<!-- source: EN PDF p18; unit 198 -->

32-битная система:

<!-- source: EN PDF p18; unit 199 -->

```text
adb push runtime/Linux/rknn_server/armhf/usr/bin/* /usr/bin
adb push runtime/Linux/librknn_api/armhf/librknnrt.so /usr/lib
```

<!-- source: EN PDF p18; unit 200 -->

Перезапустите RKNN Server:

<!-- source: EN PDF p18; unit 201 -->

```text
adb shell
chmod +x /usr/bin/rknn_server
nohup /usr/bin/rknn_server >/dev/null&
restart_rknn.sh
```

<!-- source: EN PDF p19; unit 202 -->

##### 2\.2.3.2 Платформа RV1103/RV1103B/RV1106/RV1106B

<!-- source: EN PDF p19; unit 203 -->

Проверьте версии rknn\_server и librknnmrt.so. Если они различаются, обновите их до одной версии.

<!-- source: EN PDF p19; unit 204 -->

```text
# Query rknn_server version
strings /oem/usr/bin/rknn_server | grep -i "rknn_server version"
# Display rknn_server version is X.X.X, such as 1.6.0
# rknn_server version: X.X.X

# Query the librknnrt.so version
strings /oem/usr/lib/librknnmrt.so | grep -i "librknnmrt version"
# Display the librknnrt version is X.X.X, such as 1.6.0
# librknnmrt version: X.X.X
```

<!-- source: EN PDF p19; unit 205 -->

Обновите RKNN Server и librknnmrt.so. RV1103, RV1103B, RV1106 и RV1106B используют одинаковые RKNN Server и librknnmrt.so.

<!-- source: EN PDF p19; unit 206 -->

```text
adb push runtime/Linux/rknn_server/armhf-uclibc/usr/bin/* /oem/usr/bin
adb push runtime/Linux/librknn_api/armhf-uclibc/librknnmrt.so /oem/usr/lib
```

<!-- source: EN PDF p19; unit 207 -->

Перезапустите RKNN Server:

<!-- source: EN PDF p19; unit 208 -->

```text
adb shell
chmod +x /oem/usr/bin/rknn_server
nohup /oem/usr/bin/rknn_server >/dev/null&
restart_rknn.sh
```

<!-- source: EN PDF p19; unit 209 -->

#### 2\.2.4 Просмотр подробных журналов RKNN Server

<!-- source: EN PDF p19; unit 210 -->

##### 2\.2.4.1 Система Android

<!-- source: EN PDF p19; unit 211 -->

Откройте терминал устройства и установите уровень журналирования:

<!-- source: EN PDF p19; unit 212 -->

```text
adb shell
su
setenforce 0
setprop persist.vendor.rknn.server.log.level 5
```

<!-- source: EN PDF p19; unit 213 -->

Завершите текущий процесс службы RKNN Server:

<!-- source: EN PDF p19; unit 214 -->

```text
kill -9 `pgrep rknn_server`
```

<!-- source: EN PDF p19; unit 215 -->

Если RKNN Server не перезапускается автоматически, запустите его вручную и просмотрите подробный журнал:

<!-- source: EN PDF p19; unit 216 -->

```text
nohup /vendor/bin/rknn_server >/dev/null&
logcat
```

<!-- source: EN PDF p20; unit 217 -->

##### 2\.2.4.2 Система Linux

<!-- source: EN PDF p20; unit 218 -->

Откройте терминал устройства и установите уровень журналирования:

<!-- source: EN PDF p20; unit 219 -->

```text
adb shell
export RKNN_SERVER_LOGLEVEL=5
```

<!-- source: EN PDF p20; unit 220 -->

Перезапустите RKNN Server для просмотра подробных журналов:

<!-- source: EN PDF p20; unit 221 -->

На платформе RK356X / RK3576 / RK3588 / RV1126B выполните следующую команду:

<!-- source: EN PDF p20; unit 222 -->

```text
nohup /usr/bin/rknn_server >/dev/null&
```

<!-- source: EN PDF p20; unit 223 -->

На платформе RV1103 / RV1103B / RV1106 / RV1106B выполните следующие команды:

<!-- source: EN PDF p20; unit 224 -->

```text
nohup /oem/usr/bin/rknn_server >/dev/null&
```

<!-- source: EN PDF p20; unit 225 -->

## 3 Основные инструкции по RKNN

<!-- source: EN PDF p20; unit 226 -->

### 3\.1 Преобразование модели

<!-- source: EN PDF p20; unit 227 -->

RKNN-Toolkit2 предоставляет преобразование моделей, анализ производительности, развертывание, отладку и другие функции. Этот раздел посвящен преобразованию моделей — одной из основных функций RKNN-Toolkit2, позволяющей преобразовывать модели глубокого обучения разных сред в формат RKNN для выполнения на RKNPU. Блок-схема поможет понять процесс преобразования.

<!-- source: EN PDF p21; unit 228 -->

![Рисунок 3-1. Процесс преобразования модели](/docs/rockchip-rknn-sdk-user-guide/assets/en-p021-figure-01.png)

<!-- source: EN PDF p21; unit 229 -->

Рисунок 3-1. Процесс преобразования модели

<!-- source: EN PDF p21; unit 230 -->

RKNN-Toolkit2 поддерживает преобразование моделей следующих распространенных сред глубокого обучения:

<!-- source: EN PDF p21; unit 231 -->

Caffe (рекомендуемая версия 1.0)

<!-- source: EN PDF p21; unit 232 -->

TensorFlow (рекомендуемые версии 1.12.0~2.8.0)

<!-- source: EN PDF p21; unit 233 -->

TensorFlow Lite (рекомендуется Schema version = 3)

<!-- source: EN PDF p21; unit 234 -->

ONNX (рекомендуемые версии 1.7.0~1.10.0)

<!-- source: EN PDF p21; unit 235 -->

PyTorch (рекомендуемые версии 1.6.0~1.13.1)

<!-- source: EN PDF p21; unit 236 -->

Darknet (рекомендуется Commit ID = 810d7f7)

<!-- source: EN PDF p21; unit 237 -->

Обучите или получите предварительно обученные модели этих сред и преобразуйте их в RKNN для более эффективного развертывания и инференса на RKNPU.

<!-- source: EN PDF p21; unit 238 -->

#### 3\.1.1 Инициализация RKNN и освобождение объекта

<!-- source: EN PDF p21; unit 239 -->

Сначала необходимо инициализировать объект RKNN. Это первый шаг всего процесса.

<!-- source: EN PDF p21; unit 240 -->

Инициализация объекта RKNN:

<!-- source: EN PDF p21; unit 241 -->

Инициализируйте объект конструктором RKNN(). Можно передать параметры verbose и verbose\_file.

<!-- source: EN PDF p22; unit 242 -->

verbose определяет, выводить ли подробный журнал на экран.

<!-- source: EN PDF p22; unit 243 -->

Если задан verbose\_file и verbose установлен в True, журнал также записывается в указанный файл.

<!-- source: EN PDF p22; unit 244 -->

Пример кода:

<!-- source: EN PDF p22; unit 245 -->

```text
rknn = RKNN(verbose=True, verbose_file='./mobilenet_build.log')
```

<!-- source: EN PDF p22; unit 246 -->

После завершения всех операций RKNN освободите ресурсы. Это последний шаг процесса:

<!-- source: EN PDF p22; unit 247 -->

Освобождение ресурсов:

<!-- source: EN PDF p22; unit 248 -->

Освободите объект rknn вызовом release().

<!-- source: EN PDF p22; unit 249 -->

Пример кода:

<!-- source: EN PDF p22; unit 250 -->

```text
rknn.release()
```

<!-- source: EN PDF p22; unit 251 -->

#### 3\.1.2 Настройка Config

<!-- source: EN PDF p22; unit 252 -->

Перед преобразованием задайте конфигурацию, обеспечивающую правильность и производительность преобразования модели. Интерфейс rknn.config() позволяет указать средние входные значения, нормализацию, квантование и другие параметры. Некоторые распространенные параметры:

<!-- source: EN PDF p22; unit 253 -->

mean\_values и std\_values задают средние значения и нормализацию входа. Они используются при квантовании, поэтому при инференсе через C API повторно вычитать среднее и нормализовать изображение не нужно; это сокращает время развертывания.

<!-- source: EN PDF p22; unit 254 -->

quant\_img\_RGB2BGR определяет, преобразовывать ли RGB в BGR при загрузке изображения для квантования. По умолчанию false. Параметр действует при калибровке квантования, но не при инференсе; соответствующую обработку пользователь должен выполнить при подготовке входа. Подробные предостережения см. в разделе 10.3. Примечание: при quant\_img\_RGB2BGR= True сначала выполняется RGB2BGR, затем операции mean\_values и std\_values.

<!-- source: EN PDF p22; unit 255 -->

target\_platform задает целевую платформу модели RKNN. Поддерживаются RV1103, RV1103B, RV1106, RV1106B, RV1126B, RK2118, RK3562, RK3566, RK3568, RK3576 и RK3588.

<!-- source: EN PDF p22; unit 256 -->

quantized\_algorithm задает алгоритм расчета параметров квантования каждого слоя: normal, mmse или kl\_divergence. По умолчанию normal. Подробности см. в разделах 3.1.7, 6.1 и 6.2.

<!-- source: EN PDF p22; unit 257 -->

quantized\_method принимает layer или channel и определяет совместное использование параметров весами каждого слоя. По умолчанию channel. Подробности см. в разделах 3.1.7, 6.1 и 6.2.

<!-- source: EN PDF p22; unit 258 -->

optimization\_level изменяет уровень оптимизации модели и позволяет отключить часть или все правила оптимизации при преобразовании. Значение по умолчанию 3 включает все оптимизации. При 2 или 1 отключаются некоторые оптимизации, способные влиять на точность отдельных моделей. При 0 отключены все оптимизации.

<!-- source: EN PDF p22; unit 259 -->

quantized\_dtype задает тип квантования. Поддерживается INT8 с линейным асимметричным квантованием; значение по умолчанию 'asymmetric\_quantized-8'.

<!-- source: EN PDF p23; unit 260 -->

custom\_string добавляет пользовательскую строку в модель RKNN, например информацию о версии модели. Строка доступна через запрос RKNN\_QUERY\_CUSTOM\_STRING, что позволяет особым образом обрабатывать разные модели при развертывании. По умолчанию None.

<!-- source: EN PDF p23; unit 261 -->

dynamic\_input поддерживает динамический вход, имитируя его по нескольким наборам форм входа, заданных пользователем. По умолчанию None. Подробности см. в разделе 5.4.

<!-- source: EN PDF p23; unit 262 -->

Полное описание rknn.config() см. в руководстве API; выше приведены только распространенные параметры.

<!-- source: EN PDF p23; unit 263 -->

Пример кода:

<!-- source: EN PDF p23; unit 264 -->

```text
rknn.config(
    mean_values=[[103.94, 116.78, 123.68]],
    std_values=[[58.82, 58.82, 58.82]],
    quant_img_RGB2BGR=False,
    target_platform='rk3566')
```

<!-- source: EN PDF p23; unit 265 -->

#### 3\.1.3 Интерфейсы загрузки модели

<!-- source: EN PDF p23; unit 266 -->

Для каждого типа модели используйте соответствующий интерфейс загрузки. RKNN-Toolkit2 предоставляет отдельные интерфейсы для Caffe, TensorFlow, TensorFlow Lite, ONNX, PyTorch и других сред. Краткое описание интерфейсов:

<!-- source: EN PDF p23; unit 267 -->

Загрузка Caffe:

<!-- source: EN PDF p23; unit 268 -->

Загрузите модель Caffe через rknn.load\_caffe().

<!-- source: EN PDF p23; unit 269 -->

Укажите путь к файлу модели .prototxt и файлу весов .caffemodel.

<!-- source: EN PDF p23; unit 270 -->

При нескольких входных слоях можно задать порядок имен этих слоев.

<!-- source: EN PDF p23; unit 271 -->

Пример кода:

<!-- source: EN PDF p23; unit 272 -->

```text
ret = rknn.load_caffe(model='./mobilenet_v2.prototxt', blobs='./mobilenet_v2.caffemodel')
```

<!-- source: EN PDF p23; unit 273 -->

Загрузка TensorFlow:

<!-- source: EN PDF p23; unit 274 -->

Загрузите модель TensorFlow через rknn.load\_tensorflow().

<!-- source: EN PDF p23; unit 275 -->

Укажите путь к файлу модели TensorFlow .pb, имя и форму входного узла, а также имя выходного узла.

<!-- source: EN PDF p23; unit 276 -->

Пример кода:

<!-- source: EN PDF p23; unit 277 -->

```text
ret = rknn.load_tensorflow(tf_pb='./ssd_mobilenet_v1_coco_2017_11_17.pb',
              inputs=['Preprocessor/sub'],
              outputs=['concat', 'concat_1'],
              input_size_list=[[1, 300, 300, 3]])
```

<!-- source: EN PDF p23; unit 278 -->

Загрузка TensorFlow Lite:

<!-- source: EN PDF p23; unit 279 -->

Загрузите модель TensorFlow Lite через rknn.load\_tflite().

<!-- source: EN PDF p23; unit 280 -->

Укажите путь к файлу модели TensorFlow с расширением .tflite.

<!-- source: EN PDF p23; unit 281 -->

Пример кода:

<!-- source: EN PDF p24; unit 282 -->

```text
ret = rknn.load_tflite(model='./mobilenet_v1.tflite')
```

<!-- source: EN PDF p24; unit 283 -->

Загрузка ONNX:

<!-- source: EN PDF p24; unit 284 -->

Загрузите модель ONNX через rknn.load\_onnx().

<!-- source: EN PDF p24; unit 285 -->

Укажите путь к файлу модели ONNX .onnx.

<!-- source: EN PDF p24; unit 286 -->

Пример кода:

<!-- source: EN PDF p24; unit 287 -->

```text
ret = rknn.load_tflite(model='./mobilenet_v1.tflite')
```

<!-- source: EN PDF p24; unit 288 -->

Загрузка DarkNet:

<!-- source: EN PDF p24; unit 289 -->

Загрузите модель DarkNet через rknn.load\_darknet().

<!-- source: EN PDF p24; unit 290 -->

Укажите путь к файлу модели DarkNet .cfg и файлу весов .weights.

<!-- source: EN PDF p24; unit 291 -->

Пример кода:

<!-- source: EN PDF p24; unit 292 -->

```text
ret = rknn.load_darknet(model='./yolov3-tiny.cfg', weight='./yolov3.weights')
```

<!-- source: EN PDF p24; unit 293 -->

Загрузка PyTorch:

<!-- source: EN PDF p24; unit 294 -->

Загрузите модель PyTorch через rknn.load\_pytorch().

<!-- source: EN PDF p24; unit 295 -->

Укажите путь к файлу модели PyTorch .pt; модель должна быть в формате torchscript.

<!-- source: EN PDF p24; unit 296 -->

Пример кода:

<!-- source: EN PDF p24; unit 297 -->

```text
ret = rknn.load_pytorch(model='./resnet18.pt', input_size_list=[[1, 3, 224, 224]])
```

<!-- source: EN PDF p24; unit 298 -->

Выберите интерфейс загрузки, соответствующий типу модели, чтобы обеспечить ее преобразование.

<!-- source: EN PDF p24; unit 299 -->

#### 3\.1.4 Построение модели RKNN

<!-- source: EN PDF p24; unit 300 -->

После загрузки исходной модели создайте модель RKNN через rknn.build(). При этом можно выбрать квантование, уменьшающее размер модели и повышающее производительность на RKNPU. Параметры rknn.build():

<!-- source: EN PDF p24; unit 301 -->

do\_quantization управляет квантованием модели; рекомендуется True.

<!-- source: EN PDF p24; unit 302 -->

dataset задает набор данных для калибровки квантования. Набор задается текстовым файлом.

<!-- source: EN PDF p24; unit 303 -->

Пример dataset.txt:

<!-- source: EN PDF p24; unit 304 -->

```text
./imgs/ILSVRC2012_val_00000665.JPEG
./imgs/ILSVRC2012_val_00001123.JPEG
./imgs/ILSVRC2012_val_00001129.JPEG
./imgs/ILSVRC2012_val_00001284.JPEG
./imgs/ILSVRC2012_val_00003026.JPEG
./imgs/ILSVRC2012_val_00005276.JPEG
```

<!-- source: EN PDF p24; unit 305 -->

Пример кода

<!-- source: EN PDF p24; unit 306 -->

```text
ret = rknn.build(do_quantization=True, dataset='./dataset.txt')
```

<!-- source: EN PDF p25; unit 307 -->

#### 3\.1.5 Экспорт модели RKNN

<!-- source: EN PDF p25; unit 308 -->

После построения через rknn.build() модель RKNN можно сохранить в файл .rknn для развертывания с помощью rknn.export\_rknn(). Параметры этого интерфейса:

<!-- source: EN PDF p25; unit 309 -->

export\_path — путь к экспортируемому файлу модели.

<!-- source: EN PDF p25; unit 310 -->

cpp\_gen\_cfg позволяет дополнительно создать примеры развертывания на C++.

<!-- source: EN PDF p25; unit 311 -->

Пример кода

<!-- source: EN PDF p25; unit 312 -->

```text
ret = rknn.export_rknn(export_path='./mobilenet_v1.rknn')
```

<!-- source: EN PDF p25; unit 313 -->

Эти операции и интерфейсы охватывают преобразование модели в RKNN-Toolkit2. В зависимости от требований и сценария выбирайте конфигурацию и алгоритмы квантования, упрощающие последующее развертывание.

<!-- source: EN PDF p25; unit 314 -->

#### 3\.1.6 Инструмент преобразования RKNN\_Convert

<!-- source: EN PDF p25; unit 315 -->

RKNN\_CONVERT — инструмент преобразования моделей из RKNN-Toolkit2, оборачивающий описанные API. Для преобразования командами достаточно отредактировать yml-конфигурацию модели. Ниже приведены пример использования rknn\_convert и поддерживаемые параметры:

<!-- source: EN PDF p25; unit 316 -->

```text
python -m rknn.api.rknn_convert -t rk3588 -i ./model_config.yml -o ./output_path
```

<!-- source: EN PDF p25; unit 317 -->

Эти команды и параметры преобразуют модель в RKNN и сохраняют ее по указанному пути. Поддерживаемые параметры:

<!-- source: EN PDF p25; unit 318 -->

-i: путь к конфигурации модели .yml.

<!-- source: EN PDF p25; unit 319 -->

-o: каталог вывода преобразованной модели.

<!-- source: EN PDF p25; unit 320 -->

-t: target\_platform; целевая платформа rv1103, rv1103b, rv1106, rv1106b, rv1126b, rk2118, rk3562, rk3566, rk3568, rk3576 или rk3588.

<!-- source: EN PDF p25; unit 321 -->

-e: необязательная оценка времени выполнения и использования памяти на плате. Для включения укажите -e. Обязательно подключите плату и правильно задайте target\_platform, иначе возникнет ошибка. При нескольких устройствах выберите идентификатор через -d device\_id.

<!-- source: EN PDF p25; unit 322 -->

-a: необязательная оценка точности созданной модели rknn. Для оценки в симуляторе укажите в командной строке -a "xx1.jpg xx2.jpg". Для анализа точности используйте совместно с -d.

<!-- source: EN PDF p25; unit 323 -->

-v: необязательный вывод подробного журнала на экран; для включения укажите -v в командной строке.

<!-- source: EN PDF p25; unit 324 -->

-d: необязательный параметр. Для одного устройства adb используйте -d, для нескольких — -d device\_id. Узнать device\_id можно через adb devices.

<!-- source: EN PDF p25; unit 325 -->

Пример конфигурации yaml:

<!-- source: EN PDF p25; unit 326 -->

```text
models:
  # model output name
  name: object_detection
  # Original model framework
  platform: onnx
  # Model input file path
  model_file_path: ./object_detection.onnx
  # Describe information such as input and output shapes
  subgraphs:
   # model input tensor shape
   input_size_list:
    - 1,3,512,512
   # input tensor name
   inputs:
    - data
   # output tensor name
   outputs:
    - conv6-1
    - conv6-2
    - conv6-3
  # quantification flag
  quantize: true
  # Quantify dataset file path (relative yml path)
  dataset: ./dataset.txt
  configs:
   quantized_dtype: asymmetric_quantized-8
   # rknn.config mean_values
   mean_values: [127.5,127.5,127.5]
   # rknn.config std_values
   std_values: [128.0,128.0,128.0]
   # rknn.config quant_img_RGB2BGR
   quant_img_RGB2BGR: false
   # rknn.config quantized_algorithm
   quantized_algorithm: normal
```

<!-- source: EN PDF p26; unit 328 -->

Конфигурация содержит имя модели, исходную среду, путь к файлу модели, сведения о входах и выходах и параметр квантования. Изменяйте соответствующие файлы под требования модели.

<!-- source: EN PDF p26; unit 329 -->

Описание конфигурации yml приведено ниже:

<!-- source: EN PDF p26; unit 330 -->

Таблица 3-1. Параметры yml-конфигурации преобразования модели

<!-- source: EN PDF p26; unit 331 -->

| Параметр | Заполняемое значение |
| --- | --- |
| -name | Имя выходного файла модели |
| -platform | Фреймворк исходной модели; поддерживаются tensorflow, tflite, caffe, onnx, pytorch, darknet |
| -model\_file\_path | Путь к исходному файлу модели; для модели из одного файла, например tensorflow, tflite, onnx, pytorch |
| -quantize | Использовать ли квантование |
| -dataset | Путь к набору данных для квантования (достаточно относительного пути). При включённом accuracy\_analysis этот параметр обязателен |
| -prototxt\_file\_path | Файл prototxt модели при использовании caffe |
| -caffemodel\_file\_path | Файл caffemodel модели при использовании caffe |
| -darknet\_cfg\_path | Файл cfg модели при использовании darknet |
| -darknet\_weights\_path | Файл весов модели при использовании darknet |
| -subgraphs | Описывает формы входов и выходов и прочие сведения о модели. Обычно этот параметр и его подпараметры необязательны; кроме отдельных фреймворков, можно использовать значения модели по умолчанию |
| ----input\_size\_list<br>(подпараметр) | Форма входного тензора |
| ----inputs<br>(подпараметр) | Имя входного тензора |
| ----outputs<br>(подпараметр) | Имя выходного тензора |
| -configs | Соответствующие настройки rknn.config() |
| ----quantized\_dtype<br>(подпараметр) | Тип квантования RKNN-Toolkit2: можно указать [asymmetric\_quantized-8]. Если не указан, используется значение по умолчанию |
| ----mean\_values<br>(подпараметр) | Средние значения входа модели. Для одного входа RGB, например [123.675,116.28,103.53]; для нескольких входов, например [[123,116,103],[255,255,255]] |
| ----std\_values<br>(подпараметр) | Стандартные отклонения входа модели. Для одного входа RGB, например [58.395,58.295,58.391]; для нескольких входов, например [[127,127,127], [255,255,255]] |
| ----<br>quant\_img\_RGB2BGR<br>(подпараметр) | Нужно ли выполнять RGB2BGR при загрузке изображений для квантования. По умолчанию false |
| ----quantized\_algorithm<br>(подпараметр) | Алгоритм квантования: ['normal', 'kl\_divergence', 'mmse']; по умолчанию normal |
| ----quantized\_method<br>(подпараметр) | Метод квантования RKNN\_toolkit2: ['layer', 'channel']; по умолчанию channel |
| ----optimization\_level<br>(подпараметр) | Уровень оптимизации. По умолчанию 3: используются все стандартные оптимизации |
| ----model\_pruning<br>(подпараметр) | Обрезка модели для уменьшения её размера. По умолчанию false; true включает функцию |
| ----quantize\_weight<br>(подпараметр) | При quantize=false уменьшает размер модели rknn, квантуя часть весов. По умолчанию false; true включает функцию |
| ----single\_core\_mode<br>(подпараметр) | Генерировать ли только одноядерные модели для уменьшения размера и расхода памяти RKNN. По умолчанию false. Сейчас действует только для RK3576/RK3588. По умолчанию false. |

<!-- source: EN PDF p28; unit 334 -->

#### 3\.1.7 Квантование моделей в RKNN-Toolkit2

<!-- source: EN PDF p28; unit 335 -->

RKNN-Toolkit2 предоставляет два способа и три алгоритма квантования, выбираемые параметрами quantized\_algorithm и quantized\_method в rknn.config(). Ниже описаны алгоритмы и способы квантования признаков:

<!-- source: EN PDF p28; unit 336 -->

Три алгоритма квантования:

<!-- source: EN PDF p28; unit 337 -->

1\. Normal: максимум и минимум диапазона квантования определяются по максимальному и минимальному значениям признаков модели с плавающей точкой. Алгоритм быстрый, но хуже работает при неравномерном распределении признаков. Обычно рекомендуется около 20–100 образцов калибровочных данных.

<!-- source: EN PDF p28; unit 338 -->

2\. MMSE: границы диапазона определяются минимизацией среднеквадратичной ошибки между исходными числами с плавающей точкой и результатом квантования с последующим деквантованием. Это частично уменьшает потери точности из-за крупных выбросов. Итерационный перебор работает медленнее, но обычно точнее normal. Рекомендуется около 20–50 образцов; количество можно менять с учетом времени квантования.

<!-- source: EN PDF p28; unit 339 -->

3\. KL-Divergence: числа с плавающей и фиксированной точкой в признаках представляются двумя распределениями. Изменением порогов распределения обновляются, а их сходство оценивается по KL-дивергенции для выбора максимума и минимума диапазона квантования. Алгоритм медленнее normal, но намного быстрее mmse. В некоторых случаях, например при неблагоприятном распределении признаков, результат заметно улучшается. Обычно рекомендуется около 20–100 изображений.

<!-- source: EN PDF p28; unit 340 -->

Два способа квантования:

<!-- source: EN PDF p28; unit 341 -->

1\. Layer: все каналы одного слоя квантуются совместно и используют общие параметры квантования.

<!-- source: EN PDF p28; unit 342 -->

2\. Channel: каждый канал одного слоя квантуется независимо и имеет собственные параметры. Обычно точность выше, чем при Layer.

<!-- source: EN PDF p28; unit 343 -->

Выбирайте алгоритм и способ квантования признаков по фактическому результату и требованиям модели. Подробные инструкции и принципы квантования см. в главе 6.

<!-- source: EN PDF p29; unit 344 -->

### 3\.2 Оценка модели

<!-- source: EN PDF p29; unit 345 -->

#### 3\.2.1 Инференс модели

<!-- source: EN PDF p29; unit 346 -->

После преобразования исходной модели в RKNN выполните инференс в симуляторе или на плате и обработайте результаты для проверки правильности. Если результаты неверны, используйте анализ точности квантованной модели и проверьте предварительную и последующую обработку.

<!-- source: EN PDF p29; unit 347 -->

Параметры инициализации rknn.init\_runtime():

<!-- source: EN PDF p29; unit 348 -->

target: целевая аппаратная платформа. По умолчанию None — инференс выполняется в симуляторе. Для результатов на реальной плате укажите соответствующую платформу: RV1103 / RV1103B / RV1106 / RV1106B / RV1126B / RK3562 / RK3566 / RK3568 / RK3576 / RK3588.

<!-- source: EN PDF p29; unit 349 -->

device\_id: идентификатор устройства. По умолчанию None. Если задан target, для инференса выбирается одно устройство. При нескольких подключенных платах необходимо указать нужный ID. Для инференса через сетевой ADB сначала вручную выполните adb connect [IP], затем укажите идентификатор устройства — обычно IP-адрес либо IP-адрес с портом. Команда adb devices выводит все подключенные устройства.

<!-- source: EN PDF p29; unit 350 -->

perf\_debug: включение режима отладки при оценке производительности. По умолчанию False; rknn.eval\_perf() возвращает общее время выполнения модели. При True дополнительно выводится время каждого слоя. RV1103, RV1103B, RV1106 и RV1106B этого не поддерживают.

<!-- source: EN PDF p29; unit 351 -->

eval\_mem: переход в режим оценки памяти. По умолчанию false. После установки True можно вызвать rknn.eval\_memory(), чтобы получить использование памяти при выполнении модели.

<!-- source: EN PDF p29; unit 352 -->

Параметры rknn.inference():

<!-- source: EN PDF p29; unit 353 -->

inputs: список входов для инференса в формате ndarray.

<!-- source: EN PDF p29; unit 354 -->

data\_format: список расположений входных данных, действующий только для четырехмерных входов. Допустимы NCHW и NHWC. По умолчанию None, что означает NHWC для всех входов.

<!-- source: EN PDF p29; unit 355 -->

Пример кода:

<!-- source: EN PDF p29; unit 356 -->

```text
ret = rknn.init_runtime(target=platform, device_id='515e9b401c060c0b')

# Preprocess
image_src = cv2.imread(IMG_PATH)
img = preprocess(image_src)

# Inference
outputs = rknn.inference(inputs=[img])

# Postprocess
outputs = postprocess(outputs)
```

<!-- source: EN PDF p29; unit 357 -->

Примечание:

<!-- source: EN PDF p29; unit 358 -->

1\. При ошибке «E RKNN: failed to allocate fd, ret: -1, errno: 12» во время инференса на RV1103 или RV1106 выполните RkLunch-stop.sh в терминале платы, чтобы закрыть другие приложения, занимающие память.

<!-- source: EN PDF p30; unit 359 -->

2\. В версии ARM64 rknn.init\_runtime() не поддерживает device\_id.

<!-- source: EN PDF p30; unit 360 -->

#### 3\.2.2 Анализ точности модели

<!-- source: EN PDF p30; unit 361 -->

При проблемах с результатами инференса квантованной модели используйте rknn.accuracy\_analysis(), чтобы проанализировать точность и проверить каждый слой операторов.

<!-- source: EN PDF p30; unit 362 -->

Параметры интерфейса анализа точности rknn.accuracy\_analysis():

<!-- source: EN PDF p30; unit 363 -->

inputs: список путей к входным файлам jpg, png, bmp или npy.

<!-- source: EN PDF p30; unit 364 -->

output\_dir: каталог сохранения, по умолчанию './snapshot'.

<!-- source: EN PDF p30; unit 365 -->

Target: целевая аппаратная платформа, по умолчанию None. Если target задан как RV1103 / RV1103B / RV1106 / RV1106B / RV1126B / RK3562 / RK3566 / RK3568 / RK3576 / RK3588, получаются результаты каждого слоя во время выполнения и проводится анализ точности.

<!-- source: EN PDF p30; unit 366 -->

device\_id: идентификатор устройства. По умолчанию None — анализ только в симуляторе. При заданном target выбирается одно устройство. Если подключено несколько устройств, укажите соответствующий ID. Для анализа через сетевой ADB вручную подключитесь командой adb connect [IP], затем введите идентификатор — обычно IP-адрес либо IP-адрес с номером порта.

<!-- source: EN PDF p30; unit 367 -->

Примечание:

<!-- source: EN PDF p30; unit 368 -->

1\. Анализ точности может завершиться ошибкой, если модель слишком велика, а хранилища платы недостаточно. Проверьте свободное место командой df -h в терминале платы. При нехватке удалите ненужные файлы, чтобы раздел output\_dir вместил результаты.

<!-- source: EN PDF p30; unit 369 -->

2\. После загрузки через rknn.load\_rknn() анализ точности недоступен, поскольку в модели RKNN отсутствует информация об исходной модели.

<!-- source: EN PDF p30; unit 370 -->

3\. В версии ARM64 rknn.accuracy\_analysis() не поддерживает device\_id.

<!-- source: EN PDF p30; unit 371 -->

Пример кода:

<!-- source: EN PDF p30; unit 372 -->

```text
ret = rknn.accuracy_analysis(inputs=[img_path], target=platform, device_id='515e9b401c060c0b')
```

<!-- source: EN PDF p30; unit 373 -->

Результаты анализа точности:

<!-- source: EN PDF p30; unit 374 -->

![Рисунок 3-2. Результаты анализа точности](/docs/rockchip-rknn-sdk-user-guide/assets/en-p030-figure-01.png)

```text
# simulator_error: calculate the output error of each layer of the simulator (compared to the 'golden' value).
# entire: output error of each layer between 'golden' and 'simulator', these errors will accumulate layer by layer.
# single: single-layer output error between 'golden' and 'simulator', can better reflect the single-layer accuracy of the simulator.
# runtime_error: calculate the output error of each layer of the runtime.
# entire: output error of each layer between 'golden' and 'runtime', these errors will accumulate layer by layer.
# single_sim: single-layer output error between 'simulator' and 'runtime', can better reflect the single-layer accuracy of runtime.
```

| layer\_name | simulator\_error entire cos | simulator\_error entire euc | simulator\_error single cos | simulator\_error single euc | runtime\_error entire cos | runtime\_error entire euc | runtime\_error single\_sim cos | runtime\_error single\_sim euc |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [Input] images | 1\.00000 | 0\.0 | 1\.00000 | 0\.0 |  |  |  |  |
| [exDataConvert] images\_int8 | 1\.00000 | 2\.5780 | 1\.00000 | 2\.5780 |  |  |  |  |
| [Conv] 128 | 1\.00000 | 2\.5780 | 1\.00000 | 2\.5780 | 1\.00000 | 2\.5780 | 1\.00000 | 0\.0 |
| [Conv] 286 |  |  |  |  |  |  |  |  |
| [Relu] 131 | 0\.99977 | 37\.674 | 0\.99977 | 37\.674 | 0\.99977 | 37\.682 | 1\.00000 | 2\.0193 |
| [Conv] 132 |  |  |  |  |  |  |  |  |
| [Relu] 133 | 0\.99949 | 53\.789 | 0\.99960 | 47\.679 | 0\.99949 | 53\.790 | 1\.00000 | 3\.2487 |
| ... |  |  |  |  |  |  |  |  |
| [Sigmoid] 283\_int8 | 0\.99903 | 3\.6972 | 0\.99995 | 0\.8721 |  |  |  |  |
| [exDataConvert] 283 | 0\.99903 | 3\.6972 | 0\.99996 | 0\.7372 | 0\.99908 | 3\.5866 | 1\.00000 | 0\.1702 |
| [Conv] 280 |  |  |  |  |  |  |  |  |
| [Sigmoid] output\_int8 | 0\.99934 | 6\.3987 | 0\.99995 | 1\.7267 |  |  |  |  |
| [exDataConvert] output | 0\.99934 | 6\.3987 | 0\.99996 | 1\.4713 | 0\.99932 | 6\.4315 | 1\.00000 | 0\.3788 |

<!-- source: EN PDF p30; unit 375 -->

Рисунок 3-2. Результаты анализа точности

<!-- source: EN PDF p30; unit 376 -->

Результаты точности разделены на четыре столбца:

<!-- source: EN PDF p31; unit 377 -->

|  |  |  |
| --- | --- | --- |
| simulator\_error | entire | Косинусное и евклидово расстояния между результатом симулятора от начала до текущего слоя и эталонным результатом. |
|  | single | При эталонном входе текущего слоя сравниваются косинусное и евклидово расстояния между результатом симулятора и эталонным результатом. |
| runtime\_error | entire | Косинусное и евклидово расстояния между фактическим и эталонным результатами от начала до конца текущего слоя. |
|  | single\_sim | При эталонном входе текущего слоя сравниваются косинусное и евклидово расстояния между фактическим результатом слоя на плате и результатом симулятора. |

<!-- source: EN PDF p31; unit 378 -->

#### 3\.2.3 Оценка производительности модели

<!-- source: EN PDF p31; unit 379 -->

rknn.eval\_perf() выводит текущие аппаратные частоты и результаты оценки производительности модели. fix\_freq определяет, нужно ли попытаться зафиксировать частоты CPU/NPU/DDR. Для фиксации задайте True, иначе False; по умолчанию True. Если при инициализации perf\_debug в rknn.init\_runtime() установлен в True, выводится время каждого слоя и общее время; при False — только общее время.

<!-- source: EN PDF p31; unit 380 -->

Примечание:

<!-- source: EN PDF p31; unit 381 -->

1\. RV1103, RV1103B, RV1106 и RV1106B не поддерживают perf\_debug=True и выводят только общее время модели.

<!-- source: EN PDF p31; unit 382 -->

Пример кода:

<!-- source: EN PDF p31; unit 383 -->

```text
ret = rknn.init_runtime(target=platform, perf_debug=True)
perf_detail = rknn.eval_perf()
```

<!-- source: EN PDF p31; unit 384 -->

Пример вывода частот после eval\_perf на RK3588 приведен ниже; частоты зависят от прошивки. У RK3588 есть большие и малые ядра CPU, поэтому столбец CPU содержит несколько частот в KHz. Единицы частот NPU и DDR — Hz.

<!-- source: EN PDF p31; unit 385 -->

```text
CPU Current Frequency List:
  - 1800000
  - 2256000
  - 2304000
NPU Current Frequency List:
  - 1000000000
DDR Current Frequency List:
  - 2112000000
```

<!-- source: EN PDF p31; unit 386 -->

Результат оценки производительности:

<!-- source: EN PDF p32; unit 387 -->

![Рисунок 3-3. Результаты оценки производительности](/docs/rockchip-rknn-sdk-user-guide/assets/en-p032-figure-01.png)

```text
Network Layer Information Table
ID | OpType | DataType | Target | InputShape | OutputShape | DDRCycles | NPUCycles | MaxCycles | Time(us) | MacUsage(%) | WorkLoad(0/1/2)--ImproveTherical | TaskNumber | RW(KB) | FullName
1 | InputOperator | UINT8 | CPU | \ | (1,3,224,224) | 0 | 0 | 0 | 22 | \ | 0.0%/0.0%/0.0%--Up:0.0% | 0/0 | 0 | InputOperator:data
2 | ConvRelu | UINT8 | NPU | (1,3,224,224),(32,3,3,3),(32) | (1,32,112,112) | 94150 | 112896 | 112896 | 428 | 0.00/0.00/0.00 | 300.0%/0.0%/0.0%--Up:-200.0% | 3/0 | 151 | Conv:conv1
3 | ConvRelu | INT8 | NPU | (1,32,112,112),(32,32,1,1),(32) | (1,32,112,112) | 135965 | 50176 | 135965 | 351 | 0.00/0.00/0.00 | 300.0%/0.0%/0.0%--Up:-200.0% | 2/0 | 393 | Conv:conv2_1/expand
4 | ConvRelu | INT8 | NPU | (1,32,112,112),(1,32,3,3),(32) | (1,32,112,112) | 135884 | 112896 | 135884 | 383 | 0.00/0.00/0.00 | 300.0%/0.0%/0.0%--Up:-200.0% | 2/0 | 392 | Conv:conv2_1/dwise
5 | Conv | INT8 | NPU | (1,32,112,112),(16,32,1,1),(16) | (1,16,112,112) | 101942 | 50176 | 101942 | 219 | 0.00/0.00/0.00 | 300.0%/0.0%/0.0%--Up:-200.0% | 2/0 | 392 | Conv:conv2_1/linear
...
52 | ConvRelu | INT8 | NPU | (1,960,7,7),(1,960,3,3),(960) | (1,960,7,7) | 18668 | 8640 | 18668 | 268 | 0.00/0.00/0.00 | 300.0%/0.0%/0.0%--Up:-200.0% | 1/0 | 61 | Conv:conv6_3/dwise
53 | Conv | INT8 | NPU | (1,960,7,7),(320,960,1,1),(320) | (1,320,7,7) | 62983 | 19200 | 62983 | 295 | 0.00/0.00/0.00 | 300.0%/0.0%/0.0%--Up:-200.0% | 1/0 | 348 | Conv:conv6_3/linear
54 | ConvRelu | INT8 | NPU | (1,320,7,7),(1280,320,1,1),(1280) | (1,1280,7,7) | 84248 | 25600 | 84248 | 322 | 0.00/0.00/0.00 | 300.0%/0.0%/0.0%--Up:-200.0% | 1/0 | 425 | Conv:conv6_4
55 | Conv | INT8 | NPU | (1,1280,7,7),(1,1280,7,7),(1280) | (1,1280,1,1) | 23159 | 15680 | 23159 | 281 | 0.00/0.00/0.00 | 300.0%/0.0%/0.0%--Up:-200.0% | 1/0 | 132 | Conv:pool6
56 | Conv | INT8 | NPU | (1,1280,1,1),(1000,1280,1,1),(1000) | (1,1000,1,1) | 218208 | 20480 | 218208 | 418 | 0.00/0.00/0.00 | 300.0%/0.0%/0.0%--Up:-200.0% | 1/0 | 1259 | Conv:fc7
57 | exDataConvert | INT8 | NPU | (1,1000,1,1) | (1,1000,1,1) | 509 | 0 | 509 | 257 | \ | 300.0%/0.0%/0.0%--Up:-200.0% | 2/0 | 0 | exDataConvert:fc7__cv
58 | exSoftmax13 | FLOAT16 | NPU | (1,1000,1,1),(1,1000,1,1) | (1,1000,1,1) | 1012 | 0 | 1012 | 287 | \ | 300.0%/0.0%/0.0%--Up:-200.0% | 7/1 | 3 | exSoftmax13:prob
59 | OutputOperator | FLOAT16 | CPU | (1,1000,1,1) | \ | 0 | 0 | 0 | 67 | \ | 300.0%/0.0%/0.0%--Up:-200.0% | 2/0 | 1 | OutputOperator:prob

Total Operator Elapsed Per Frame Time(us): 14374
Total Memory Read/Write Per Frame Size(KB): 12872.1

Operator Time Consuming Ranking Table
OpType | CallNumber | CPUTime(us) | GPUTime(us) | NPUTime(us) | TotalTime(us) | TimeRatio(%)
ConvRelu | 36 | 0 | 0 | 9319 | 9319 | 64.83%
Conv | 9 | 0 | 0 | 2238 | 2238 | 15.57%
ConvAdd | 10 | 0 | 0 | 2184 | 2184 | 15.19%
exSoftmax13 | 1 | 0 | 0 | 287 | 287 | 2.00%
exDataConvert | 1 | 0 | 0 | 257 | 257 | 1.79%
OutputOperator | 1 | 67 | 0 | 0 | 67 | 0.47%
InputOperator | 1 | 22 | 0 | 0 | 22 | 0.15%
```

<!-- source: EN PDF p32; unit 388 -->

Рисунок 3-3. Результаты оценки производительности

<!-- source: EN PDF p32; unit 389 -->

Описание некоторых параметров:

<!-- source: EN PDF p32; unit 390 -->

| Параметр | Описание |
| --- | --- |
| ID | Идентификатор каждого оператора |
| OpType | Тип каждого оператора |
| DataType | Тип входных данных |
| Target | Аппаратный исполнитель оператора (CPU/NPU/GPU) |
| InputShape | Форма входа |
| OutputShape | Форма выхода |
| DDRCycles | Такты чтения и записи DDR |
| NPUCycles | Число тактов NPU |
| MaxCycles | Максимум DDR Cycles и NPU Cycles |
| Time(us) | Время вычисления оператора (us) |
| MacUsage(%) | Загрузка MAC |
| WorkLoad(0/1/2) | Загрузка ядер 0/1/2 (только RK3588) |
| WorkLoad(0/1/2) | Загрузка ядер 0/1 (только RK3576) |
| RW(KB) | Общий объём прочитанных и записанных данных (KB) |
| FullName | Полное имя оператора |
| Total Operator Elapsed Per<br>Frame Time(us) | Общее время вывода модели для одного кадра |
| Total Memory Read/Write Per<br>Frame Size(KB) | Общий расход полосы памяти при выводе одного кадра |
| CallNumber | Число запусков оператора для одного кадра |
| CPUTime(us) | Общее время этого оператора на CPU для одного кадра |
| GPUTime(us) | Общее время этого оператора на GPU для одного кадра |
| NPUTime(us) | Общее время этого оператора на NPU для одного кадра |
| TotalTime(us) | Общее время этого оператора для одного кадра |
| TimeRatio(%) | Отношение общего времени этого оператора для одного кадра к общему времени обработки кадра |

<!-- source: EN PDF p33; unit 392 -->

#### 3\.2.4 Оценка использования памяти моделью

<!-- source: EN PDF p33; unit 393 -->

rknn.eval\_memory() оценивает потребление памяти моделью. Если eval\_mem в rknn.init\_runtime() установлен в True, также выводится потребление памяти каждой частью.

<!-- source: EN PDF p33; unit 394 -->

Пример кода:

<!-- source: EN PDF p33; unit 395 -->

```text
ret = rknn.init_runtime(target=platform, eval_mem=True)
memory_detail = rknn.eval_memory()
```

<!-- source: EN PDF p33; unit 396 -->

Результат оценки памяти:

<!-- source: EN PDF p33; unit 397 -->

```text
======================================================
      Memory Profile Info Dump
======================================================
NPU model memory detail(bytes):
  Weight Memory: 8.67 MiB
  Internal Tensor Memory: 7.42 MiB
  Other Memory: 3.03 MiB
  Total Memory: 19.12 MiB

INFO: When evaluating memory usage, we need consider
the size of model, current model size is: 11.86 MiB
======================================================
```

<!-- source: EN PDF p33; unit 398 -->

Описание некоторых параметров:

<!-- source: EN PDF p33; unit 399 -->

| Total Weight Memory | Память весов модели (MB) |
| --- | --- |
| Total Internal Tensor<br>Memory | Память тензоров признаков модели (MB) |
| Other Memory | Прочая память, например конфигурация регистров и входные/выходные тензоры (MB) |
| Total Memory | Общий расход памяти модели (MB) |

<!-- source: EN PDF p33; unit 400 -->

### 3\.3 Инференс на плате с демонстрационным кодом C

<!-- source: EN PDF p33; unit 401 -->

В этой главе описана последовательность вызовов обычного API. Для нулевого копирования см. раздел 5.2. Последовательность обычного RKNN API:

<!-- source: EN PDF p33; unit 402 -->

1\. rknn\_init() — инициализация модели;

<!-- source: EN PDF p33; unit 403 -->

2\. rknn\_query() — запрос атрибутов входов и выходов модели;

<!-- source: EN PDF p34; unit 404 -->

3\. Предварительная обработка входа;

<!-- source: EN PDF p34; unit 405 -->

4\. rknn\_inputs\_set() — настройка входных данных;

<!-- source: EN PDF p34; unit 406 -->

5\. rknn\_run() — выполнение инференса модели;

<!-- source: EN PDF p34; unit 407 -->

6\. rknn\_outputs\_get() — получение выходных данных;

<!-- source: EN PDF p34; unit 408 -->

7\. Последующая обработка выхода;

<!-- source: EN PDF p34; unit 409 -->

8\. rknn\_outputs\_release() — освобождение памяти выхода;

<!-- source: EN PDF p34; unit 410 -->

9\. rknn\_destroy() — освобождение ресурсов RKNN.

<!-- source: EN PDF p34; unit 411 -->

Последовательность показана на рисунке 3-4. Желтым шрифтом отмечены действия пользователя, позволяющие вводить данные циклически.

<!-- source: EN PDF p34; unit 412 -->

![Рисунок 3-4. Процесс обычного API](/docs/rockchip-rknn-sdk-user-guide/assets/en-p034-figure-01.png)

<!-- source: EN PDF p34; unit 413 -->

Рисунок 3-4. Процесс обычного API

<!-- source: EN PDF p34; unit 414 -->

Пример кода обычного API:

<!-- source: EN PDF p34; unit 415 -->

```text
// Init RKNN model
ret = rknn_init(&ctx, model, model_len, 0, NULL);

// Get Model Input Output Number
rknn_input_output_num io_num;
ret = rknn_query(ctx, RKNN_QUERY_IN_OUT_NUM, &io_num, sizeof(io_num));

// Get Model Input Info
rknn_tensor_attr input_attrs[io_num.n_input];
memset(input_attrs, 0, sizeof(input_attrs));
for (int i = 0; i < io_num.n_input; i++)
{
  input_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_INPUT_ATTR, &(input_attrs[i]), sizeof(rknn_tensor_attr));
}

// Get Model Output Info
rknn_tensor_attr output_attrs[io_num.n_output];
memset(output_attrs, 0, sizeof(output_attrs));
for (int i = 0; i < io_num.n_output; i++)
{
  output_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_OUTPUT_ATTR, &(output_attrs[i]), sizeof(rknn_tensor_attr));
}

rknn_input inputs[io_num.n_input];
rknn_output outputs[io_num.n_output];
memset(inputs, 0, sizeof(inputs));
memset(outputs, 0, sizeof(outputs));

// Pre-process
// Read Image
image_buffer_t src_image;
memset(&src_image, 0, sizeof(image_buffer_t));
ret = read_image(image_path, &src_image);

// Set Input Data
inputs[0].index = 0;
inputs[0].type = RKNN_TENSOR_UINT8;
inputs[0].fmt = RKNN_TENSOR_NHWC;
inputs[0].size = src_image.size;
inputs[0].buf = src_image.virt_addr;

ret = rknn_inputs_set(rknn_ctx, io_num.n_input, inputs);

// Run
ret = rknn_run(rknn_ctx, nullptr);

// Get Output Data
ret = rknn_outputs_get(rknn_ctx, io_num.n_output, outputs, NULL);

// Post-process
post_process(outputs, results);

// Release RKNN Output
rknn_outputs_release(rknn_ctx, io_num.n_output, outputs);

if (rknn_ctx != 0)
{
  rknn_destroy(rknn_ctx);
}
```

<!-- source: EN PDF p36; unit 417 -->

### 3\.4 Инференс Python на плате

<!-- source: EN PDF p36; unit 418 -->

RKNN-Toolkit Lite2 предоставляет Python-интерфейс инференса на плате, упрощая разработку приложений ИИ на Python.

<!-- source: EN PDF p36; unit 419 -->

Примечание: перед разработкой с RKNN-Toolkit Lite2 преобразуйте экспортированные модели соответствующих сред глубокого обучения в RKNN с помощью RKNN-Toolkit2. Подробности см. в разделе 3.1.

<!-- source: EN PDF p36; unit 420 -->

#### 3\.4.1 Требования к системной среде

<!-- source: EN PDF p36; unit 421 -->

Для RKNN-Toolkit Lite2 необходима следующая среда:

<!-- source: EN PDF p36; unit 422 -->

Таблица 3-2. Среда выполнения RKNN-Toolkit Lite2

<!-- source: EN PDF p36; unit 423 -->

| OS | Debian 10 / 11 (aarch64) |
| --- | --- |
| Версия Python | 3\.7 / 3.8 / 3.9 / 3.10 / 3.11 |
| Зависимости Python | 'numpy'<br>'ruamel.yaml'<br>'psutils' |

<!-- source: EN PDF p36; unit 424 -->

#### 3\.4.2 Установка инструментов

<!-- source: EN PDF p36; unit 425 -->

Установите RKNN-Toolkit Lite2 командой pip3 install. Последовательность установки:

<!-- source: EN PDF p36; unit 426 -->

Если python3/pip3 и другие программы отсутствуют, сначала установите их через apt-get, например:

<!-- source: EN PDF p36; unit 427 -->

```text
sudo apt-get update
sudo apt-get install -y python3 python3-dev python3-pip gcc
```

<!-- source: EN PDF p36; unit 428 -->

Примечание: некоторые зависимости собираются из исходного кода, для чего нужны python3-dev и gcc. Поэтому оба пакета устанавливаются на этом шаге, чтобы избежать последующих ошибок компиляции.

<!-- source: EN PDF p36; unit 429 -->

Установите зависимости opencv-python и numpy, например:

<!-- source: EN PDF p36; unit 430 -->

```text
sudo apt-get install -y python3-opencv
sudo apt-get install -y python3-numpy
```

<!-- source: EN PDF p36; unit 431 -->

Примечание:

<!-- source: EN PDF p36; unit 432 -->

1\. Сам RKNN-Toolkit Lite2 не зависит от opencv-python, но пример использует этот модуль для обработки изображений.

<!-- source: EN PDF p36; unit 433 -->

2\. Установка numpy через pip3 в прошивке Debian10 может завершиться ошибкой. Рекомендуется приведенный выше способ.

<!-- source: EN PDF p36; unit 434 -->

Установка RKNN-Toolkit Lite2

<!-- source: EN PDF p36; unit 435 -->

Пакеты для платформ находятся в rknn-toolkit-lite2/packages в SDK. Перейдите в packages и выполните следующую команду установки:

<!-- source: EN PDF p37; unit 436 -->

```text
# Python 3.7
pip3 install rknn_toolkit_lite2-x.y.z-cp37-cp37m-linux_aarch64.whl
# Python 3.8
pip3 install rknn_toolkit_lite2-x.y.z-cp38-cp38-linux_aarch64.whl
# Python 3.9
pip3 install rknn_toolkit_lite2-x.y.z-cp39-cp39-linux_aarch64.whl
# Python 3.10
pip3 install rknn_toolkit_lite2-x.y.z-cp310-cp310-linux_aarch64.whl
# Python 3.11
pip3 install rknn_toolkit_lite2-x.y.z-cp311-cp311-linux_aarch64.whl
```

<!-- source: EN PDF p37; unit 437 -->

#### 3\.4.3 Основной процесс RKNN-Toolkit Lite2

<!-- source: EN PDF p37; unit 438 -->

Основной процесс развертывания модели RKNN через RKNN-Toolkit Lite2 показан ниже:

<!-- source: EN PDF p37; unit 439 -->

![Рисунок 3-5. Процесс RKNN-Toolkit Lite2](/docs/rockchip-rknn-sdk-user-guide/assets/en-p037-figure-01.png)

<!-- source: EN PDF p37; unit 440 -->

Рисунок 3-5. Процесс RKNN-Toolkit Lite2

<!-- source: EN PDF p37; unit 441 -->

Примечание:

<!-- source: EN PDF p37; unit 442 -->

1\. До вызова inference загрузите и предварительно обработайте входные данные, затем задайте параметры интерфейса по сведениям о входе.

<!-- source: EN PDF p37; unit 443 -->

2\. После вызова inference результаты обычно нужно обработать, чтобы реализовать функции приложения верхнего уровня.

<!-- source: EN PDF p37; unit 444 -->

#### 3\.4.4 Пример запуска RKNN-Toolkit Lite2

<!-- source: EN PDF p37; unit 445 -->

В SDK/rknn-toolkit-lite2/examples находится приложение классификации изображений на RKNN-Toolkit Lite2. Через его интерфейс приложение загружает модель RKNN Resnet18, обрабатывает изображение и выводит пять лучших результатов классификации (top5).

<!-- source: EN PDF p37; unit 446 -->

Шаги запуска примера:

<!-- source: EN PDF p37; unit 447 -->

1\. Подготовьте плату с установленным RKNN-Toolkit Lite2;

<!-- source: EN PDF p37; unit 448 -->

2\. Скопируйте SDK/rknn-toolkit-lite2/examples на плату;

<!-- source: EN PDF p37; unit 449 -->

3\. Перейдите в examples/resent18 и выполните следующие команды запуска примера;

<!-- source: EN PDF p37; unit 450 -->

```text
python test.py
```

<!-- source: EN PDF p37; unit 451 -->

Результат приведен ниже:

<!-- source: EN PDF p38; unit 452 -->

```text
model: resnet18
-----TOP 5-----
[812]: 0.999676 [class: space shuttle]
[404]: 0.000249 [class: airliner]
[657]: 0.000014 [class: missile]
[833]: 0.000009 [class: bullet train, bullet | submarine, pigboat, sub, U-boat]
[466]: 0.000009 [class: bullet train, bullet | submarine, pigboat, sub, U-boat]
```

<!-- source: EN PDF p38; unit 453 -->

#### 3\.4.5 Подробное описание API RKNN-Toolkit Lite2

<!-- source: EN PDF p38; unit 454 -->

В этой главе подробно описано использование всех API RKNN-Toolkit Lite2.

<!-- source: EN PDF p38; unit 455 -->

##### 3\.4.5.1 Инициализация и освобождение RKNNLite

<!-- source: EN PDF p38; unit 456 -->

При работе с RKNN-Toolkit Lite2 вызовите RKNNLite() для инициализации объекта RKNNLite. После использования освободите ресурсы методом объекта rknn\_lite.release().

<!-- source: EN PDF p38; unit 457 -->

При инициализации RKNNLite можно задать verbose и verbose\_file для подробного журналирования. verbose управляет выводом на экран. Если задан verbose\_file и verbose имеет значение true, журнал также записывается в указанный файл.

<!-- source: EN PDF p38; unit 458 -->

Пример кода:

<!-- source: EN PDF p38; unit 459 -->

```text
# Output detailed log information to the screen and write it to the inference.log file
rknn_lite = RKNNLite(verbose=True, verbose_file='./inference.log')
# Only print detailed log information on the screen
rknn_lite = RKNNLite(verbose=True)
…
rknn_lite.release()
```

<!-- source: EN PDF p38; unit 460 -->

##### 3\.4.5.2 Загрузка модели RKNN

<!-- source: EN PDF p38; unit 461 -->

| API | load\_rknn |
| --- | --- |
| Описание | Загрузить модель RKNN |
| Параметр | Путь к модели RKNN |
| Возвращаемое значение | 0: успешно<br>-1: ошибка |

<!-- source: EN PDF p38; unit 462 -->

Пример кода:

<!-- source: EN PDF p38; unit 463 -->

```text
# Load the resnet18.rknn model from the current directory
ret = rknn_lite.load_rknn('./resnet_18.rknn')
```

<!-- source: EN PDF p38; unit 464 -->

##### 3\.4.5.3 Инициализация init\_runtime

<!-- source: EN PDF p38; unit 465 -->

init\_runtime необходимо вызвать до инференса модели.

<!-- source: EN PDF p38; unit 466 -->

| API | init\_runtime |
| --- | --- |
| Описание | Инициализировать среду выполнения |
| Параметр | core\_mask: настройка ядер NPU. Варианты:<br>- RKNNLite.NPU\_CORE\_AUTO: автоматически выбирается свободное ядро NPU<br>- RKNNLite.NPU\_CORE\_0: выполнение на NPU0<br>- RKNNLite.NPU\_CORE\_1: выполнение на NPU1<br>- RKNNLite.NPU\_CORE\_2: выполнение на NPU2<br>- RKNNLite.NPU\_CORE\_0\_1: выполнение на NPU0 и NPU1 одновременно<br>- RKNNLite.NPU\_CORE\_0\_1\_2: выполнение на NPU0, NPU1 и NPU2 одновременно<br>- RKNNLite.NPU\_CORE\_ALL: выполнение на всех ядрах NPU<br>По умолчанию NPU\_CORE\_AUTO — автоматическое планирование.<br>Примечание: параметр действует только для RK3576/RK3588. |
| Возвращаемое значение | 0: успешно<br>-1: ошибка |

<!-- source: EN PDF p39; unit 468 -->

Пример кода:

<!-- source: EN PDF p39; unit 469 -->

```text
# to initialize the init_runtime
ret = rknn_lite.init_runtime(core_mask=RKNNLite.NPU_CORE_AUTO)
if ret != 0:
  print('Init runtime environment failed')
  exit(ret)
```

<!-- source: EN PDF p39; unit 470 -->

##### 3\.4.5.4 Инференс модели

<!-- source: EN PDF p39; unit 471 -->

| API | inference |
| --- | --- |
| Описание | Выполнить вывод для заданного входа и вернуть результат |
| Параметр | inputs: входные данные, например изображения OpenCV (четырёхмерный вход необходимо вручную расширить до 4 измерений). Тип list; элементы списка — ndarray. |
|  | data\_format: формат данных; тип list, для каждого входа допустимы "nhwc", "nchw"; действует только для четырёхмерного входа. По умолчанию None. Если параметр не задан, буфер четырёхмерного входа организуется как NHWC, а прочих входов — в формате, требуемом моделью. Если параметр задан, нечетырёхмерный вход по-прежнему должен соответствовать формату модели независимо от "nhwc" или "nchw"; четырёхмерный — указанному формату. Для моделей с несколькими входами укажите все входы. |
| Возвращаемое значение | results: результаты вывода; тип Python list, элементы — ndarray |

<!-- source: EN PDF p39; unit 472 -->

Ниже приведен пример кода инференса для классификации:

<!-- source: EN PDF p40; unit 473 -->

```text
# Get input data
img = cv2.imread('./space_shuttle_224.jpg')
img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
img = np.expand_dims(img, 0)

# Inference
outputs = rknn_lite.inference(inputs=[img])

# Show the classification results
show_top5(outputs)
```

<!-- source: EN PDF p40; unit 474 -->

##### 3\.4.5.5 Запрос версии SDK

<!-- source: EN PDF p40; unit 475 -->

| API | get\_sdk\_version |
| --- | --- |
| Описание | Получить версии среды выполнения, драйвера и модели RKNN.<br>Примечание: до вызова необходимо загрузить модель и инициализировать среду выполнения. |
| Параметр | None |
| Возвращаемое значение | sdk\_version: сведения о версиях среды выполнения, драйвера и моделей RKNN; тип Python string |

<!-- source: EN PDF p40; unit 476 -->

Пример кода:

<!-- source: EN PDF p40; unit 477 -->

```text
# Get SDK version information
……
sdk_version = rknn_lite.get_sdk_version()
……
```

<!-- source: EN PDF p40; unit 478 -->

Возвращаемая информация:

<!-- source: EN PDF p40; unit 479 -->

```text
==============================================
RKNN VERSION:
 API: 1.5.2 (71720f3fc@2023-08-21T09:29:52)
 DRV: 0.7.2
==============================================
```

<!-- source: EN PDF p40; unit 480 -->

##### 3\.4.5.6 Запрос платформ, доступных для выполнения модели

<!-- source: EN PDF p40; unit 481 -->

| API | list\_support\_target\_platform |
| --- | --- |
| Описание | Запросить платформы чипов, на которых может работать заданная модель RKNN |
| Параметр | rknn\_model: путь к модели RKNN. Если путь не задан, платформы, поддерживаемые RKNN-Toolkit Lite2, выводятся по категориям |
| Возвращаемое значение | support\_target\_platform: платформы чипов, на которых может работать модель. Если путь пуст или отсутствует, возвращается None |

<!-- source: EN PDF p40; unit 482 -->

Пример кода:

<!-- source: EN PDF p41; unit 483 -->

```text
rknn_lite.list_support_target_platform(rknn_model=’mobilenet_v1.rknn’)
```

<!-- source: EN PDF p41; unit 484 -->

Результат приведен ниже:

<!-- source: EN PDF p41; unit 485 -->

```text
**************************************************
Target platforms filled in RKNN model: ['rk3566']
Target platforms supported by this RKNN model: ['RK3566', 'RK3568']
**************************************************
```

<!-- source: EN PDF p41; unit 486 -->

### 3\.5 API умножения матриц

<!-- source: EN PDF p41; unit 487 -->

Matmul API — отдельный набор C API в Runtime для умножения матриц на NPU. RV1103/RV1103B/RV1106/RV1106B/RK2118 пока не поддерживаются. Умножение матриц — важная операция линейной алгебры, определяемая следующим образом:

<!-- source: EN PDF p41; unit 488 -->

C=AB,

<!-- source: EN PDF p41; unit 489 -->

где A — матрица M×K, B — матрица K×N, C — матрица M×N.

<!-- source: EN PDF p41; unit 490 -->

#### 3\.5.1 Возможности и применение

<!-- source: EN PDF p41; unit 491 -->

Matmul API в основном применяется для вычисления параметров в глубоком обучении. Например, умножение матриц широко используется в основных модулях Transformer — механизме self-attention и слоях сети прямого распространения. Поэтому эффективность умножения матриц критична для общей производительности Transformer. Возможности:

<!-- source: EN PDF p41; unit 492 -->

Эффективность: низкоуровневая реализация Matmul API использует RKNPU, обеспечивая высокую производительность и низкое энергопотребление.

<!-- source: EN PDF p41; unit 493 -->

Гибкость: загружать модель RKNN не нужно. Поддерживаются распространенные на периферийных устройствах входные типы int4, int8 и float16, отдельный интерфейс выделения памяти и механизм внешней памяти. Пользователь может управлять и повторно использовать входную и выходную память матриц.

<!-- source: EN PDF p41; unit 494 -->

#### 3\.5.2 Схема Matmul API

<!-- source: EN PDF p41; unit 495 -->

При компиляции подключите заголовок rknn\_matmul\_api.h: в нем определены структуры и интерфейсы Matmul API.

<!-- source: EN PDF p42; unit 496 -->

![Техническая иллюстрация оригинала (EN PDF p42)](/docs/rockchip-rknn-sdk-user-guide/assets/en-p042-vector-01.png)

<!-- source: EN PDF p42; unit 510 -->

Рисунок 3-6. Основной процесс Matmul API

<!-- source: EN PDF p42; unit 511 -->

Шаги использования Matmul API:

<!-- source: EN PDF p42; unit 512 -->

1\. Создайте контекст: настройте rknn\_matmul\_info, включая M, K, N, типы и расположение данных входных и выходных матриц и другую информацию. Вызовите rknn\_matmul\_create для инициализации контекста. После инициализации получите указатель rknn\_matmul\_io\_attr со сведениями о тензорах входных и выходных матриц.

<!-- source: EN PDF p43; unit 513 -->

2\. Выберите ядро NPU, только на многоядерных платформах: вызовите rknn\_matmul\_set\_core\_mask и задайте маску нужного ядра. Без этого вызова на многоядерной NPU по умолчанию автоматически выбирается свободное ядро.

<!-- source: EN PDF p43; unit 514 -->

3\. Задайте параметры квантования матриц A, B и C: вызовите rknn\_matmul\_set\_quant\_params со структурой rknn\_quant\_params, содержащей соответствующие значения. Без этого вызова для каждой матрицы действуют scale=1.0 и zero\_point=0.

<!-- source: EN PDF p43; unit 515 -->

4\. Создайте входную и выходную память через rknn\_create\_mem в соответствии с размерами тензоров матриц.

<!-- source: EN PDF p43; unit 516 -->

5\. Заполните входные матрицы A и B согласно форме и типу данных. Задайте параметры квантования в соответствии со способом квантования.

<!-- source: EN PDF p43; unit 517 -->

6\. Настройте входную и выходную память: rknn\_matmul\_set\_io\_mem записывает заполненную входную матрицу и выходную память в контекст. Помимо адреса памяти интерфейс преобразует расположение данных согласно настройке layout. Его нужно вызывать после заполнения или изменения входных данных; этим он отличается от rknn\_set\_io\_mem в API нулевого копирования.

<!-- source: EN PDF p43; unit 518 -->

7\. После настройки памяти выполните умножение матриц вызовом rknn\_matmul\_run.

<!-- source: EN PDF p43; unit 519 -->

8\. После умножения прочитайте результат из выходной памяти в соответствии с заданным layout.

<!-- source: EN PDF p43; unit 520 -->

9\. По завершении освободите память через rknn\_destroy\_mem, а контекст — через rknn\_matmul\_destroy.

<!-- source: EN PDF p43; unit 521 -->

#### 3\.5.3 Расширенное использование Matmul API

<!-- source: EN PDF p43; unit 522 -->

При создании контекста задайте структуру rknn\_matmul\_info со спецификацией умножения: размерами, типами и расположением данных входных и выходных матриц. B\_layout и AC\_layout задают высокопроизводительное расположение. Определение структуры приведено в таблице:

<!-- source: EN PDF p43; unit 523 -->

Таблица 3-3. Поля rknn\_matmul\_info

<!-- source: EN PDF p43; unit 524 -->

| Поле | Тип данных | Описание |
| --- | --- | --- |
| M | int32\_t | Число строк матрицы A |
| K | int32\_t | Число столбцов матрицы A |
| N | int32\_t | Число столбцов матрицы B |
| type | rknn\_matmul\_type | Типы входных и выходных матриц:<br>RKNN\_FLOAT16\_MM\_FLOAT16\_TO\_FLOAT32: A — float16, B — float16, C — float32;<br>RKNN\_INT8\_MM\_INT8\_TO\_INT32: A — int8, B — int8, C — int32;<br>RKNN\_INT8\_MM\_INT8\_TO\_INT8: A — int8, B — int8, C — int8;<br>RKNN\_FLOAT16\_MM\_FLOAT16\_TO\_FLOAT16: A — float16, B — float16, C — float16;<br>RKNN\_FLOAT16\_MM\_INT8\_TO\_FLOAT32: A — float16, B — int8, C — float32;<br>RKNN\_FLOAT16\_MM\_INT8\_TO\_FLOAT16: A — float16, B — int8, C — float16;<br>RKNN\_FLOAT16\_MM\_INT4\_TO\_FLOAT32: A — float16, B — int4, C — float32;<br>RKNN\_FLOAT16\_MM\_INT4\_TO\_FLOAT16: A — float16, B — int4, C — float16;<br>RKNN\_INT8\_MM\_INT8\_TO\_FLOAT32: A — int8, B — int8, C — float32;<br>RKNN\_INT4\_MM\_INT4\_TO\_INT16: A — int4, B — int4, C — int16;<br>RKNN\_INT8\_MM\_INT4\_TO\_INT32: A — int8, B — int4, C — int32; |
| B\_layout | int16\_t | Размещение данных матрицы B.<br>RKNN\_MM\_LAYOUT\_NORM: исходная форма KxN;<br>RKNN\_MM\_LAYOUT\_NATIVE: высокопроизводительная компоновка;<br>RKNN\_MM\_LAYOUT\_TP\_NORM: форма после транспонирования, то есть NxK. |
| B\_quant\_type | int16\_t | Метод квантования матрицы B.<br>RKNN\_QUANT\_TYPE\_PER\_LAYER\_SYM: симметричное квантование матрицы B по слоям;<br>RKNN\_QUANT\_TYPE\_PER\_LAYER\_ASYM: асимметричное квантование матрицы B по слоям;<br>RKNN\_QUANT\_TYPE\_PER\_CHANNEL\_SYM: симметричное квантование матрицы B по каналам;<br>RKNN\_QUANT\_TYPE\_PER\_CHANNEL\_ASYM: асимметричное квантование матрицы B по каналам;<br>RKNN\_QUANT\_TYPE\_PER\_GROUP\_SYM: симметричное квантование матрицы B по группам;<br>RKNN\_QUANT\_TYPE\_PER\_GROUP\_ASYM: асимметричное квантование матрицы B по группам; |
| AC\_layout | int16\_t | Размещение данных матриц A и C.<br>RKNN\_MM\_LAYOUT\_NORM: исходные формы;<br>RKNN\_MM\_LAYOUT\_NATIVE: высокопроизводительная компоновка.<br>Спецификация приведена в 3.5.4. |
| AC\_quant\_type | int16\_t | Размещение данных матриц A и C.<br>RKNN\_MM\_LAYOUT\_NORM: исходные формы;<br>RKNN\_MM\_LAYOUT\_NATIVE: высокопроизводительная компоновка. |
| iommu\_domain\_id | int32\_t | Индекс домена адресного пространства IOMMU, в котором находится контекст матриц. Адресное пространство IOMMU соответствует контексту один к одному, размер каждого пространства — 4GB. Параметр применяется главным образом, когда размеры матриц A, B, C велики и выделенная NPU память в одном домене превышает 4GB: требуется переключение в другой домен. |
| group\_size | int16\_t | Число элементов группы; действует только при включённом групповом квантовании. |
| reserved | int8\_t[] | Зарезервированные поля |

<!-- source: EN PDF p45; unit 527 -->

Исходная форма A — MxK, B — KxN, C — MxN.

<!-- source: EN PDF p46; unit 528 -->

##### 3\.5.3.1 Умножение матриц с заданными параметрами квантования

<!-- source: EN PDF p46; unit 529 -->

Если результат умножения высокой разрядности нужно квантовать в низкую разрядность, например для A и B типа int8 и C типа int8, задайте параметры квантования матриц. Они состоят из scale и zero\_point и представлены rknn\_quant\_params. Параметры A и C устанавливаются через rknn\_matmul\_set\_quant\_params. После успешной установки параметры B в режиме Per-Channel можно прочитать через rknn\_matmul\_get\_quant\_params. Структура rknn\_quant\_params описана ниже:

<!-- source: EN PDF p46; unit 530 -->

Таблица 3-4. Структура rknn\_quant\_params

<!-- source: EN PDF p46; unit 531 -->

| Поле | Тип данных | Описание |
| --- | --- | --- |
| name | char[] | Имя матрицы |
| scale | float\* | Начальный адрес массива параметров квантования scale |
| scale\_len | int32\_t | Длина массива параметров квантования scale |
| zp | int32\_t\* | Начальный адрес массива параметров квантования zero\_point |
| zp\_len | int32\_t | Длина массива параметров квантования zero\_point |

<!-- source: EN PDF p46; unit 532 -->

Matmul поддерживает Per-Layer, Per-Channel и Per-Group с такими параметрами:

<!-- source: EN PDF p46; unit 533 -->

Per-Layer: длина массивов scale и zp равна 1.

<!-- source: EN PDF p46; unit 534 -->

Per-Channel: длина массивов scale и zp равна N.

<!-- source: EN PDF p46; unit 535 -->

Per-Group: длина массивов scale и zp равна N\*K/group\_size. Число элементов группы задается group\_size, а элементы одной группы используют общие параметры квантования group\_size — так сформулировано в оригинале.

<!-- source: EN PDF p46; unit 536 -->

Поддерживаются симметричное и асимметричное квантование. При симметричном все zp равны 0, при асимметричном не все zp равны 0.

<!-- source: EN PDF p47; unit 537 -->

##### 3\.5.3.2 Умножение матриц с динамической формой входа

<!-- source: EN PDF p47; unit 538 -->

![Техническая иллюстрация оригинала (EN PDF p47)](/docs/rockchip-rknn-sdk-user-guide/assets/en-p047-vector-01.png)

<!-- source: EN PDF p47; unit 554 -->

Рисунок 3-7. Вызовы Matmul API с динамической формой входа

<!-- source: EN PDF p47; unit 555 -->

Процесс для динамической формы входа показан выше. Он отличается от основного процесса Matmul API следующим:

<!-- source: EN PDF p47; unit 556 -->

1\. Создайте контекст: задайте число и значения форм, а также rknn\_matmul\_info с типами и расположением данных входных и выходных матриц. M, K и N в rknn\_matmul\_info для динамической формы задавать не нужно. Вызовите rknn\_matmul\_create\_dynamic\_shape для инициализации контекста. После нее получите

<!-- source: EN PDF p48; unit 557 -->

массив структур rknn\_matmul\_io\_attr со сведениями о входных и выходных тензорах для всех конфигураций формы.

<!-- source: EN PDF p48; unit 558 -->

2\. Создайте входную и выходную память: определите максимальный размер тензора из массива rknn\_matmul\_io\_attr и вызовите rknn\_create\_mem с максимальными размерами входной и выходной матриц.

<!-- source: EN PDF p48; unit 559 -->

3\. Задайте текущую форму входа через rknn\_matmul\_set\_dynamic\_shape, передав указатель rknn\_matmul\_shape.

<!-- source: EN PDF p48; unit 560 -->

4\. Настройте память через rknn\_matmul\_set\_io\_mem: заполненная входная матрица и выходная память записываются в контекст. rknn\_tensor\_mem\* указывает на ранее созданную память максимального размера, а rknn\_matmul\_tensor\_attr\* содержит атрибуты матриц для текущей формы.

<!-- source: EN PDF p48; unit 561 -->

#### 3\.5.4 Высокопроизводительное расположение данных

<!-- source: EN PDF p48; unit 562 -->

NPU имеет специализированную аппаратную архитектуру, поэтому чтение исходных форм MxK и KxN и запись C в форме MxN не наиболее эффективны. Специальное расположение повышает производительность. AC\_layout определяет использование высокопроизводительного layout матрицами A и C, B\_layout — матрицей B.

<!-- source: EN PDF p48; unit 563 -->

Пусть исходные формы A, B и C равны MxK, KxN и MxN. Требуемое расположение:

<!-- source: EN PDF p48; unit 564 -->

1\. При AC\_layout=RKNN\_MM\_LAYOUT\_NORM и B\_layout=RKNN\_MM\_LAYOUT\_NORM формы A, B и C равны [M,K], [K,N] и [M,N].

<!-- source: EN PDF p48; unit 565 -->

2\. При AC\_layout=RKNN\_MM\_LAYOUT\_NATIVE и B\_layout=RKNN\_MM\_LAYOUT\_NATIVE расположение A, B и C для разных чипов и типов данных приведено ниже. Результаты деления в таблице округляются вверх, избыточная часть заполняется 0.

<!-- source: EN PDF p48; unit 566 -->

3\. При B\_layout=RKNN\_MM\_LAYOUT\_NORM форма B — [K,N], а при B\_layout=RKNN\_MM\_LAYOUT\_TP\_NORM — [N,K]. Второй вариант эффективнее при выполнении.

<!-- source: EN PDF p49; unit 567 -->

Таблица 3-5. Высокопроизводительные формы A, B и C на разных чипах

<!-- source: EN PDF p49; unit 568 -->

| Форма | RK3562 | RK3566/RK3568 | RK3576/RV1126B | RK3588 |
| --- | --- | --- | --- | --- |
| A(int4) | не поддерживается | не поддерживается | [K/32,M,32] | [K/32,M,32] |
| B(int4) | не поддерживается | не поддерживается | [N/64,K/32,64,32]\* | [N/64,K/32,64,32] |
| C(int16) | не поддерживается | не поддерживается | [N/8,M,8] | [N/8,M,8] |
| A(int8) | [K/16,M,16] | [K/8, M, 8] | [K/16,M,16] | [K/16,M,16] |
| B(int8) | [N/16,K/32,16,32] | [N/16,K/32,16,32] | [N/32,K/32,32,32]\* | [N/32,K/32,32,32] |
| C(int32) | [N/4,M,4] | [N/4,M,4] | [N/4,M,4] | [N/4,M,4] |
| A(float16) | [K/8,M,8] | [K/4,M,4] | [K/8,M,8] | [K/8,M,8] |
| B(float16) | [N/8,K/32,8,32] | [N/8,K/16,8,16] | [N/16,K/32,16,32] | [N/16,K/32,16,32] |
| C(float32) | [N/4,M,4] | [N/4,M,4] | [N/4,M,4] | [N/4,M,4] |

<!-- source: EN PDF p49; unit 569 -->

Примечание

<!-- source: EN PDF p49; unit 570 -->

Таблица предполагает одинаковые типы A и B. RK3576/RV1126B поддерживает входы разных типов. В таком случае высокопроизводительное расположение B совпадает с расположением B для одинаковых типов, соответствующим типу C. Например, если A имеет тип int4, B — float16, C — float32, высокопроизводительное расположение B равно [N/16,K/32,16,32]. Интерфейс rknn\_B\_normal\_layout\_to\_native\_layout преобразует исходную форму B в высокопроизводительное расположение.

<!-- source: EN PDF p49; unit 571 -->

На примере RK3566/RK3568 и int8 соответствие элементов A при преобразовании [M,K] в [K/8,M,8] показано ниже:

<!-- source: EN PDF p50; unit 572 -->

![Техническая иллюстрация оригинала (EN PDF p50)](/docs/rockchip-rknn-sdk-user-guide/assets/en-p050-vector-01.png)

<!-- source: EN PDF p50; unit 581 -->

Рисунок 3-8. Соответствие элементов int8-матрицы A при преобразовании [M,K] в [K/8,M,8]

<!-- source: EN PDF p50; unit 582 -->

Элементу (i, j) матрицы A соответствует Di, j. Слева показана матрица shape=[M,K]; справа сверху вниз расположены K/8 подматриц, каждая shape=[M,8].

<!-- source: EN PDF p50; unit 583 -->

Пример преобразования A или C из исходной формы в высокопроизводительную:

<!-- source: EN PDF p50; unit 584 -->

```text
template <typename Ti, typename To>
void norm_layout_to_perf_layout(Ti *src, To *dst, int32_t M, int32_t K, int32_t subK)
{
  int outter_size = (int)std::ceil(K * 1.0f / subK);
  for (int i = 0; i < outter_size; i++)
  {
    for (int m = 0; m < M; m++)
    {
      for (int j = 0; j < subK; j++)
      {
        int ki = i * subK + j;
        if (ki >= K)
        {
          dst[i * M * subK + m * subK + j] = 0;
        }
        else
        {
          dst[i * M * subK + m * subK + j] = src[m * K + ki];
        }
      }
    }
  }
}
```

<!-- source: EN PDF p51; unit 586 -->

Для RK3566/RK3568 соответствие элементов int8-матрицы B при преобразовании [K,N] в [N/16,K/32,16,32] показано ниже:

<!-- source: EN PDF p51; unit 587 -->

![Техническая иллюстрация оригинала (EN PDF p51)](/docs/rockchip-rknn-sdk-user-guide/assets/en-p051-vector-01.png)

<!-- source: EN PDF p51; unit 595 -->

Рисунок 3-9. Соответствие элементов int8-матрицы B при преобразовании [K,N] в [N/16,K/32,16,32]

<!-- source: EN PDF p51; unit 596 -->

Элементу (i, j) матрицы B соответствует Di, j. Слева матрица shape=[K,N]; каждый куб справа имеет shape=[K/32,16,32]. Сверху вниз всего N/16 кубов.

<!-- source: EN PDF p51; unit 597 -->

Пример преобразования B из исходной формы в высокопроизводительную:

<!-- source: EN PDF p51; unit 598 -->

```text
template <typename Ti, typename To>
void norm_layout_to_native_layout(Ti *src, To *dst, int32_t K, int32_t N, int32_t subN, int32_t subK)
{
  int N_remain = (int)std::ceil(N * 1.0f / subN);
  int K_remain = (int)std::ceil(K * 1.0f / subK);
  for (int i = 0; i < N_remain; i++)
  {
    for (int j = 0; j < K_remain; j++)
    {
      for (int n = 0; n < subN; n++)
      {
        int ni = i * subN + n;
        for (int k = 0; k < subK; k++)
        {
          int ki = j * subK + k;
          if (ki < K && ni < N)
          {
            dst[((i * K_remain + j) * subN + n) * subK + k] = src[ki * N + ni];
          }
          else
          {
            dst[((i * K_remain + j) * subN + n) * subK + k] = 0;
          }
        }
      }
    }
  }
}
```

<!-- source: EN PDF p52; unit 600 -->

Примечание

<!-- source: EN PDF p52; unit 601 -->

Полный пример Matmul API: https://github.com/airockchip/rknn-toolkit2/tree/master/rknpu2/examples/rknn\_matmul\_api\_demo

<!-- source: EN PDF p52; unit 602 -->

##### 3\.5.4.1 Ограничения спецификации матриц

<!-- source: EN PDF p52; unit 603 -->

Matmul API реализован на аппаратной архитектуре NPU и подчиняется ее ограничениям. Ограничения параметров:

<!-- source: EN PDF p52; unit 604 -->

AC\_layout и B\_layout задаются независимо. Оригинал утверждает поддержку RKNN\_MM\_LAYOUT\_NORM или RKNN\_MM\_LAYOUT\_TP\_NORM для обоих параметров на всех платформах, а затем указывает, что RKNN\_MM\_LAYOUT\_TP\_NORM поддерживается везде, кроме RK3566/RK3568. Это противоречие оригинала сохранено и требует проверки.

<!-- source: EN PDF p52; unit 605 -->

MATMUL поддерживает разные разрядности входа и выхода. Поддерживаемые каждой платформой типы матриц сведены в таблицу:

<!-- source: EN PDF p52; unit 606 -->

Таблица 3-6. Типы данных A, B и C, поддерживаемые Matmul

<!-- source: EN PDF p52; unit 607 -->

| Номер | RK3562 | RK3566/RK3568 | RK3576/RV1126B | RK3588 |
| --- | --- | --- | --- | --- |
| 1 | RKNN\_INT8\_MM\_INT8\_TO\_INT32 | RKNN\_INT8\_MM\_INT8\_TO\_INT32 | RKNN\_FLOAT16\_MM\_FLOAT16\_TO\_FLOAT16 | RKNN\_FLOAT16\_MM\_FLOAT16\_TO\_FLOAT16 |
| 2 | RKNN\_FLOAT16\_MM\_FLOAT16\_TO\_FLOAT32 | RKNN\_FLOAT16\_MM\_FLOAT16\_TO\_FLOAT32 | RKNN\_FLOAT16\_MM\_FLOAT16\_TO\_FLOAT32 | RKNN\_FLOAT16\_MM\_FLOAT16\_TO\_FLOAT32 |
| 3 |  |  | RKNN\_INT8\_MM\_INT8\_TO\_INT32 | RKNN\_INT8\_MM\_INT8\_TO\_INT32 |
| 4 |  |  | RKNN\_FLOAT16\_MM\_INT8\_TO\_FLOAT32 | RKNN\_INT8\_MM\_INT8\_TO\_FLOAT32 |
| 5 |  |  | RKNN\_FLOAT16\_MM\_INT4\_TO\_FLOAT16 | RKNN\_INT8\_MM\_INT8\_TO\_INT8 |
| 6 |  |  | RKNN\_FLOAT16\_MM\_INT4\_TO\_FLOAT32 | RKNN\_INT4\_MM\_INT4\_TO\_INT16 |
| 7 |  |  | RKNN\_INT8\_MM\_INT4\_TO\_INT32 |  |

<!-- source: EN PDF p52; unit 608 -->

Формат float16 соответствует IEEE-754. Подробнее см. IEEE-754 half.

<!-- source: EN PDF p53; unit 609 -->

Ограничения размеров K и N:

<!-- source: EN PDF p53; unit 610 -->

Таблица 3-7. Ограничения K и N для каждой платформы

<!-- source: EN PDF p53; unit 611 -->

|  | RK3562 | RK3566/RK3568 | RK3576/RV1126B | RK3588 |
| --- | --- | --- | --- | --- |
| Ограничение размера K<br>(int4) | не поддерживается | не поддерживается | \* | выравнивание по 32 |
| Ограничение размера K<br>(int8) | K &lt;= 10240<br>и K mod 32<br>= 0 | K &lt;= 10240 и K<br>mod 32 = 0 | выравнивание по 32 | выравнивание по 32 |
| Ограничение размера K<br>(float16) | K &lt;= 10240<br>и K mod 32<br>= 0 | K &lt;= 10240 и K<br>mod 32 = 0 | выравнивание по 32 | выравнивание по 32 |
| Ограничение размера N<br>(int4) | не поддерживается | не поддерживается | \* | N &lt;= 8192<br>и N mod 64<br>= 0 |
| Ограничение размера N<br>(int8) | N &lt;= 4096 и<br>N mod 16 = 0 | N &lt;= 4096 и N<br>mod 16 = 0 | N &lt;= 4096 и N<br>mod 32 = 0 | N &lt;= 4096<br>и N mod 32<br>= 0 |
| Ограничение размера N<br>(float16) | N &lt;= 4096 и<br>N mod 16 = 0 | N &lt;= 4096 и N<br>mod 16 = 0 | N &lt;= 4096 и N<br>mod 32 = 0 | N &lt;= 4096<br>и N mod 32<br>= 0 |

<!-- source: EN PDF p53; unit 612 -->

Примечание

<!-- source: EN PDF p53; unit 613 -->

\* означает, что ограничения размера и выравнивания совпадают с ограничениями B, соответствующими типу A на той же платформе. Например, для B в RKNN\_FLOAT16\_MM\_INT4\_TO\_FLOAT32 ограничения совпадают с RKNN\_FLOAT16\_MM\_FLOAT16\_TO\_FLOAT32.

<!-- source: EN PDF p53; unit 614 -->

Для RK3588:

<!-- source: EN PDF p53; unit 615 -->

При K &gt; 8192 данные B делятся на T сегментов.

<!-- source: EN PDF p53; unit 616 -->

```text
int T = std::ceil(K / 8192);
```

<!-- source: EN PDF p53; unit 617 -->

Например: normal layout -&gt; native layout, K = 20488, N = 4096, T = 3; данные делятся на 3 сегмента.

<!-- source: EN PDF p53; unit 618 -->

```text
subN = rknn_matmul_io_attr.B.dims[2];
subK = rknn_matmul_io_attr.B.dims[3];
```

<!-- source: EN PDF p53; unit 619 -->

Форма K,N при преобразовании:

<!-- source: EN PDF p53; unit 620 -->

```text
                     (8196, 4096) (4096 / subN, 8196 / subK, subN, subK)
 (K, N) = (20488, 4096)->(8196, 4096)->(4096 / subN, 8196 / subK, subN, subK)
         normal layout (4096, 4096) (4096 / subN, 4096 / subK, subN, subK)
                   T normal layout T native layout
```

<!-- source: EN PDF p54; unit 621 -->

Для прямого преобразования данных рекомендуется rknn\_B\_normal\_layout\_to\_native\_layout.

<!-- source: EN PDF p54; unit 622 -->

Для RK3576/RV1126B:

<!-- source: EN PDF p54; unit 623 -->

При K &gt; 4096 данные B делятся на T сегментов.

<!-- source: EN PDF p54; unit 624 -->

```text
int T = std::ceil(K / 4096);
```

<!-- source: EN PDF p54; unit 625 -->

Например: normal layout -&gt; native layout, K = 10240, N = 2048, T = 3; данные делятся на 3 сегмента.

<!-- source: EN PDF p54; unit 626 -->

```text
subN = rknn_matmul_io_attr.B.dims[2];
subK = rknn_matmul_io_attr.B.dims[3];
```

<!-- source: EN PDF p54; unit 627 -->

Форма K,N при преобразовании:

<!-- source: EN PDF p54; unit 628 -->

```text
                        (4096, 2048) (2048 / subN, 4096 / subK, subN, subK)
(K, N) = (10240, 2048) -> (4096, 2048) -> (2048 / subN, 4096 / subK, subN, subK)
        normal layout (2048, 2048) (2048 / subN, 2048 / subK, subN, subK)
                     T normal layout T native layout
```

<!-- source: EN PDF p54; unit 629 -->

Для прямого преобразования данных рекомендуется rknn\_B\_normal\_layout\_to\_native\_layout.

<!-- source: EN PDF p54; unit 630 -->

## 4 Примеры

<!-- source: EN PDF p54; unit 631 -->

RKNN предоставляет примеры разных моделей, включая MobileNet и YOLOv5. Исходный код находится в https://github.com/airockchip/rknn\_model\_zoo/tree/main/examples.

<!-- source: EN PDF p54; unit 632 -->

Ниже используются RK3588 Linux, Ubuntu22.04 и Python3.8 в среде Conda. Установка среды разработки описана в главе 2. Развертывание на других платформах см. в `Rockchip_RKNPU_Quick_Start_RKNN_SDK`.

<!-- source: EN PDF p54; unit 633 -->

### 4\.1 Пример развертывания MobileNet

<!-- source: EN PDF p54; unit 634 -->

На примере MobileNet показан быстрый старт преобразования, запуска с подключенной платой, оценки и развертывания модели на плате.

<!-- source: EN PDF p54; unit 635 -->

#### 4\.1.1 Преобразование модели

<!-- source: EN PDF p54; unit 636 -->

1\. Перейдите в rknn\_model\_zoo/examples/mobilenet/python:

<!-- source: EN PDF p54; unit 637 -->

```text
cd rknn_model_zoo/examples/mobilenet/python
```

<!-- source: EN PDF p54; unit 638 -->

2\. Преобразуйте модель и выполните инференс изображения:

<!-- source: EN PDF p54; unit 639 -->

```text
python mobilenet.py --model ../model/mobilenetv2-12.onnx --target rk3588
```

<!-- source: EN PDF p54; unit 640 -->

Команда выполняет инференс в симуляторе на компьютере. По умолчанию преобразованная модель сохраняется в rknn\_model\_zoo/examples/mobilenet/model/mobilenet\_v2.rknn.

<!-- source: EN PDF p55; unit 641 -->

#### 4\.1.2 Запуск модели на устройстве

<!-- source: EN PDF p55; unit 642 -->

1\. Перейдите в rknn\_model\_zoo/examples/mobilenet/python:

<!-- source: EN PDF p55; unit 643 -->

```text
cd rknn_model_zoo/examples/mobilenet/python
```

<!-- source: EN PDF p55; unit 644 -->

2\. Запустите модель на устройстве:

<!-- source: EN PDF p55; unit 645 -->

```text
python mobilenet.py --target rk3588 --npu_device_test
```

<!-- source: EN PDF p55; unit 646 -->

После этой команды инференс модели выполняется на устройстве.

<!-- source: EN PDF p55; unit 647 -->

Вывод:

<!-- source: EN PDF p55; unit 648 -->

```text
-----TOP 5-----
[494] score=0.99 class="n03017168 chime, bell, gong"
[469] score=0.00 class="n02939185 caldron, cauldron"
[653] score=0.00 class="n03764736 milk can"
[747] score=0.00 class="n04023962 punching bag, punch bag, punching ball, punchball"
[505] score=0.00 class="n03063689 coffeepot"
```

<!-- source: EN PDF p55; unit 649 -->

#### 4\.1.3 Оценка модели

<!-- source: EN PDF p55; unit 650 -->

RKNN предоставляет оценку точности в симуляторе и на устройстве, времени выполнения и памяти, помогая оптимизировать и развертывать модели RKNN.

<!-- source: EN PDF p55; unit 651 -->

##### 4\.1.3.1 Оценка точности

<!-- source: EN PDF p55; unit 652 -->

1\. Перейдите в rknn\_model\_zoo/examples/mobilenet/python:

<!-- source: EN PDF p55; unit 653 -->

```text
cd rknn_model_zoo/examples/mobilenet/python
```

<!-- source: EN PDF p55; unit 654 -->

2\. Выполните анализ точности модели:

<!-- source: EN PDF p55; unit 655 -->

```text
python mobilenet.py --target rk3588 --accuracy_analysis --npu_device_test
```

<!-- source: EN PDF p55; unit 656 -->

Результаты анализа точности модели:

<!-- source: EN PDF p55; unit 657 -->

```text
# simulator_error: calculate the output error of each layer of the simulator (compared to the 'golden' value).
# entire: output error of each layer between 'golden' and 'simulator', these errors will accumulate layer by layer.
# single: single-layer output error between 'golden' and 'simulator', can better reflect the single-layer accuracy of the simulator.
layer_name simulator_error
                  entire single
                cos euc cos euc
---------------------------------------------------------------
...
[Conv] 464 0.99202 | 4.1079 0.99998 | 0.1981
[Conv] output_conv 0.99308 | 13.235 0.99992 | 1.4133
[Reshape] output_int8 0.99308 | 13.235 0.99993 | 1.3043
[exDataConvert] output 0.99308 | 13.235 0.99993 | 1.3043

# runtime_error: calculate the output error of each layer of the runtime.
# entire: output error of each layer between 'golden' and 'runtime', these errors will accumulate layer by layer.
# single_sim: single-layer output error between 'simulator' and 'runtime', can better reflect the single-layer accuracy of runtime.
layer_name runtime_error
                  entire single_sim
                cos euc cos euc
---------------------------------------------------------------
...
[Conv] 464 0.99210 | 4.2718 1.00000 | 0.0
[Conv] output_conv 0.99203 | 14.847 1.00000 | 0.2007
[Reshape] output_int8
[exDataConvert] output 0.99203 | 14.847 1.00000 | 0.0
```

<!-- source: EN PDF p56; unit 659 -->

##### 4\.1.3.2 Оценка времени выполнения

<!-- source: EN PDF p56; unit 660 -->

1\. Перейдите в rknn\_model\_zoo/examples/mobilenet/python:

<!-- source: EN PDF p56; unit 661 -->

```text
cd rknn_model_zoo/examples/mobilenet/python
```

<!-- source: EN PDF p56; unit 662 -->

2\. Оцените время выполнения модели:

<!-- source: EN PDF p56; unit 663 -->

```text
python mobilenet.py --target rk3588 --eval_perf
```

<!-- source: EN PDF p56; unit 664 -->

Результаты оценки времени выполнения:

<!-- source: EN PDF p56; unit 665 -->

```text
---------------------------------------------------------------
    Network Layer Information Table
---------------------------------------------------------------
ID OpType DataType Target Time(us) ...
---------------------------------------------------------------
1 InputOperator UINT8 CPU 17
2 ConvClip UINT8 NPU 331
3 ConvClip INT8 NPU 429
4 Conv INT8 NPU 292
....
55 Conv INT8 NPU 374
56 Reshape INT8 CPU 61
57 OutputOperator INT8 CPU 11
---------------------------------------------------------------
Total Operator Elapsed Per Frame Time(us): 12631
Total Memory Read/Write Per Frame Size(KB): 10563
---------------------------------------------------------------

---------------------------------------------------------------
    Operator Time Consuming Ranking Table
---------------------------------------------------------------
OpType CallNumber ... NPUTime(us) TotalTime(us) TimeRatio(%)
---------------------------------------------------------------
ConvClip 35 8436 8436 66.79%
Conv 9 2093 2093 16.57%
ConvAdd 10 2013 2013 15.94%
Reshape 1 0 61 0.48%
InputOperator 1 0 17 0.13%
OutputOperator 1 0 11 0.09%
---------------------------------------------------------------
```

<!-- source: EN PDF p57; unit 667 -->

##### 4\.1.3.3 Оценка памяти

<!-- source: EN PDF p57; unit 668 -->

1\. Перейдите в rknn\_model\_zoo/examples/mobilenet/python:

<!-- source: EN PDF p57; unit 669 -->

```text
cd rknn_model_zoo/examples/mobilenet/python
```

<!-- source: EN PDF p57; unit 670 -->

2\. Оцените использование памяти моделью:

<!-- source: EN PDF p57; unit 671 -->

```text
python mobilenet.py --target rk3588 --eval_memory
```

<!-- source: EN PDF p57; unit 672 -->

Результаты оценки памяти модели:

<!-- source: EN PDF p57; unit 673 -->

```text
---------------------------------------------------------------
    Network Layer Information Table
---------------------------------------------------------------
ID OpType DataType Target Time(us) ...
---------------------------------------------------------------
1 InputOperator UINT8 CPU 17
2 ConvClip UINT8 NPU 331
3 ConvClip INT8 NPU 429
4 Conv INT8 NPU 292
....
55 Conv INT8 NPU 374
56 Reshape INT8 CPU 61
57 OutputOperator INT8 CPU 11
---------------------------------------------------------------
Total Operator Elapsed Per Frame Time(us): 12631
Total Memory Read/Write Per Frame Size(KB): 10563
---------------------------------------------------------------

---------------------------------------------------------------
    Operator Time Consuming Ranking Table
---------------------------------------------------------------
OpType CallNumber ... NPUTime(us) TotalTime(us) TimeRatio(%)
---------------------------------------------------------------
ConvClip 35 8436 8436 66.79%
Conv 9 2093 2093 16.57%
ConvAdd 10 2013 2013 15.94%
Reshape 1 0 61 0.48%
InputOperator 1 0 17 0.13%
OutputOperator 1 0 11 0.09%
---------------------------------------------------------------
```

<!-- source: EN PDF p57; unit 674 -->

#### 4\.1.4 Развертывание модели на устройстве

<!-- source: EN PDF p57; unit 675 -->

1\. Задайте путь к кросс-компилятору gcc в скрипте build-linsx.sh проекта rknn\_model\_zoo; имя скрипта сохранено как в оригинале.

<!-- source: EN PDF p57; unit 676 -->

```text
GCC_COMPILER=~/opts/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu
```

<!-- source: EN PDF p57; unit 677 -->

Загрузка и установка кросс-компилятора gcc описаны в `Rockchip_RKNPU_Quick_Start_RKNN_SDK`.

<!-- source: EN PDF p58; unit 678 -->

2\. Компиляция

<!-- source: EN PDF p58; unit 679 -->

```text
cd rknn_model_zoo
./build-linux.sh -t rk3588 -a aarch64 -d mobilenet
```

<!-- source: EN PDF p58; unit 680 -->

3\. Передайте исполняемый файл на плату:

<!-- source: EN PDF p58; unit 681 -->

```text
adb push install/rk3588_linux_aarch64/rknn_mobilenet_demo /userdata/
```

<!-- source: EN PDF p58; unit 682 -->

4\. Запустите модель на устройстве:

<!-- source: EN PDF p58; unit 683 -->

```text
adb shell

cd /userdata/rknn_mobilenet_demo
export LD_LIBRARY_PATH=./lib
./rknn_mobilenet_demo model/mobilenet_v2.rknn model/bell.jpg
```

<!-- source: EN PDF p58; unit 684 -->

Вывод:

<!-- source: EN PDF p58; unit 685 -->

```text
-----TOP 5-----
[494] score=0.993227 class=n03017168 chime, bell, gong
[469] score=0.002560 class=n02939185 caldron, cauldron
[747] score=0.000466 class=n04023962 punching bag, punch bag, punching ball, punchball
[792] score=0.000466 class=n04208210 shovel
[618] score=0.000405 class=n03633091 ladle
```

<!-- source: EN PDF p58; unit 686 -->

### 4\.2 Пример развертывания YOLOv5

<!-- source: EN PDF p58; unit 687 -->

#### 4\.2.1 Преобразование модели

<!-- source: EN PDF p58; unit 688 -->

1\. Загрузите модель.

<!-- source: EN PDF p58; unit 689 -->

```text
cd rknn_model_zoo/examples/yolov5/model
./download_model.sh
```

<!-- source: EN PDF p58; unit 690 -->

2\. Преобразуйте модель:

<!-- source: EN PDF p58; unit 691 -->

```text
cd rknn_model_zoo/examples/yolov5/python
python convert.py ../model/yolov5s_relu.onnx rk3588 i8 ../model/yolov5.rknn
```

<!-- source: EN PDF p58; unit 692 -->

Преобразованная модель сохраняется в rknn\_model\_zoo/examples/yolov5/model/yolov5.rknn.

<!-- source: EN PDF p58; unit 693 -->

#### 4\.2.2 Запуск модели на устройстве

<!-- source: EN PDF p58; unit 694 -->

1\. Перейдите в rknn\_model\_zoo/examples/yolov5/python:

<!-- source: EN PDF p58; unit 695 -->

```text
cd rknn_model_zoo/examples/yolov5/python
```

<!-- source: EN PDF p58; unit 696 -->

2\. Запустите модель на устройстве:

<!-- source: EN PDF p58; unit 697 -->

```text
python yolov5.py --model_path ../model/yolov5.rknn --target rk3588 --img_show
```

<!-- source: EN PDF p59; unit 698 -->

По умолчанию входное изображение — model/bus.jpg. Результат показан ниже:

<!-- source: EN PDF p59; unit 699 -->

![Рисунок 4-1. Результат RKNN в демонстрационном примере Python](/docs/rockchip-rknn-sdk-user-guide/assets/en-p059-figure-01.png)

<!-- source: EN PDF p59; unit 700 -->

Рисунок 4-1. Результат RKNN в демонстрационном примере Python

<!-- source: EN PDF p59; unit 701 -->

#### 4\.2.3 Развертывание модели на устройстве

<!-- source: EN PDF p59; unit 702 -->

1\. Задайте путь к кросс-компилятору gcc в скрипте build-linsx.sh проекта rknn\_model\_zoo; имя скрипта сохранено как в оригинале.

<!-- source: EN PDF p59; unit 703 -->

```text
GCC_COMPILER=~/opts/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu
```

<!-- source: EN PDF p59; unit 704 -->

Загрузка и установка кросс-компилятора gcc описаны в `Rockchip_RKNPU_Quick_Start_RKNN_SDK`.

<!-- source: EN PDF p59; unit 705 -->

2\. Компиляция:

<!-- source: EN PDF p59; unit 706 -->

```text
cd rknn_model_zoo
./build-linux.sh -t rk3588 -a aarch64 -d yolov5
```

<!-- source: EN PDF p59; unit 707 -->

3\. Передайте исполняемый файл на устройство:

<!-- source: EN PDF p59; unit 708 -->

```text
adb push install/rk3588_linux_aarch64/rknn_yolov5_demo /userdata/
```

<!-- source: EN PDF p60; unit 709 -->

4\. Запустите модель на устройстве:

<!-- source: EN PDF p60; unit 710 -->

```text
adb shell
cd userdata/rknn_yolov5_demo
export LD_LIBRARY_PATH=./lib
./rknn_yolov5_demo model/yolov5.rknn model/bus.jpg
```

<!-- source: EN PDF p60; unit 711 -->

5\. Скопируйте результат с платы для локального просмотра. Выполните в терминале локального компьютера:

<!-- source: EN PDF p60; unit 712 -->

```text
adb pull /userdata/rknn_yolov5_demo/out.png .
```

<!-- source: EN PDF p60; unit 713 -->

Выходное изображение:

<!-- source: EN PDF p60; unit 714 -->

![Рисунок 4-2. Результат RKNN в демонстрационном примере C](/docs/rockchip-rknn-sdk-user-guide/assets/en-p060-figure-01.png)

<!-- source: EN PDF p60; unit 715 -->

Рисунок 4-2. Результат RKNN в демонстрационном примере C

<!-- source: EN PDF p61; unit 716 -->

## 5 Расширенные инструкции RKNN

<!-- source: EN PDF p61; unit 717 -->

### 5\.1 Форматы данных

<!-- source: EN PDF p61; unit 718 -->

RKNN использует четыре формата данных: NHWC, NCHW, NC1HWC2 и UNDEFINE. NHWC и NCHW распространены в глубоком обучении и дополнительно не рассматриваются. Этот раздел посвящен хранению и преобразованию NC1HWC2, предназначенного для аппаратуры RKNPU.

<!-- source: EN PDF p61; unit 719 -->

![Рисунок 5-1. Формат и хранение RKNPU NC1HWC2](/docs/rockchip-rknn-sdk-user-guide/assets/en-p061-figure-01.png)

<!-- source: EN PDF p61; unit 720 -->

Рисунок 5-1. Формат и хранение RKNPU NC1HWC2

<!-- source: EN PDF p61; unit 721 -->

На рисунке 5-1 число 0 обозначает хранение блока C2, размер которого определяется платформой. Ограничения C2 приведены в таблице 5-1; C1 равен C/C2 с округлением вверх. Порядок хранения NC1HWC2 соответствует росту чисел на рисунке: сначала 0–15, затем 16–31. Например, на RK3568 признакам int8 формы (1, 13, 4, 4) соответствует NC1HWC2 (1, 2, 4, 4, 8): C2=8, C1=2. В блоках C2 с номерами 16–31 действительны только первые пять элементов каждого блока; оставшиеся три — недействительное заполнение для выравнивания.

<!-- source: EN PDF p61; unit 722 -->

Таблица 5-1. C2 на аппаратных платформах RKNPU

<!-- source: EN PDF p61; unit 723 -->

|  | RV1103/RV1106 | RV1103B/RV1106B | RK2118 | RK3562 | RK3566/RK3568 | RK3576/RK3588/RV1126B |
| --- | --- | --- | --- | --- | --- | --- |
| int8 | 16 | 8 | / | 16 | 8 | 16 |
| float16 | 8 | / | 4 | 8 | 4 | 8 |

<!-- source: EN PDF p61; unit 724 -->

Далее рассмотрено преобразование NC1HWC2 в NCHW и NHWC в памяти. На RK3568 согласно требованиям выравнивания признакам int8 (1, 13, 2, 2) соответствует NC1HWC2 (1, 2, 2, 2, 8). Хранение показано ниже; красным выделено недействительное заполнение.

<!-- source: EN PDF p62; unit 725 -->

![Рисунок 5-2. Развернутое расположение NC1HWC2](/docs/rockchip-rknn-sdk-user-guide/assets/en-p062-figure-01.png)

<!-- source: EN PDF p62; unit 726 -->

Рисунок 5-2. Развернутое расположение NC1HWC2

<!-- source: EN PDF p62; unit 727 -->

После удаления недействительных данных и преобразования в NCHW, то есть (1, 13, 2, 2), расположение в памяти следующее:

<!-- source: EN PDF p62; unit 728 -->

![Рисунок 5-3. Расположение NCHW](/docs/rockchip-rknn-sdk-user-guide/assets/en-p062-figure-02.png)

<!-- source: EN PDF p62; unit 729 -->

Рисунок 5-3. Расположение NCHW

<!-- source: EN PDF p62; unit 730 -->

После удаления недействительных данных и преобразования в NHWC, то есть (1, 2, 2, 13), расположение в памяти следующее:

<!-- source: EN PDF p63; unit 731 -->

![Рисунок 5-4. Расположение NHWC](/docs/rockchip-rknn-sdk-user-guide/assets/en-p063-figure-01.png)

<!-- source: EN PDF p63; unit 732 -->

Рисунок 5-4. Расположение NHWC

<!-- source: EN PDF p63; unit 733 -->

Пример кода преобразования:

<!-- source: EN PDF p63; unit 734 -->

1\. NC1HWC2 в NCHW: преобразование данных int8 NC1HWC2 в int8 NCHW.

<!-- source: EN PDF p63; unit 735 -->

```text
/*
 *src: represents the address of NC1HWC2 tensor
 *dst: represents the address of the NCHW tensor
 *dims: represents the shape information of NC1HWC2
 *channel: represents the value of C in NCHW
 * h : represents the value of h in NCHW
 * w: represents the value of w in NCHW
 */
int NC1HWC2_to_NCHW(const int8_t* src, int8_t* dst, int* dims, int channel, int h, int w)
{
  int batch = dims[0];
  int C1 = dims[1];
  int C2 = dims[4];
  int hw_src = dims[2] * dims[3];
  int hw_dst = h * w;
  for (int i = 0; i < batch; i++) {
    src = src + i * C1 * hw_src * C2;
    dst = dst + i * channel * hw_dst;
    for (int c = 0; c < channel; ++c) {
    int plane = c / C2;
    const int8_t* src_c = plane * hw_src * C2 + src;
    int offset = c % C2;
    for (int cur_h = 0; cur_h < h; ++cur_h)
      for (int cur_w = 0; cur_w < w; ++cur_w) {
      int cur_hw = cur_h * w + cur_w;
      dst[c * hw_dst + cur_h * w + cur_w] = src_c[C2 * cur_hw + offset];
      }
    }
  }

  return 0;
}
```

<!-- source: EN PDF p63; unit 736 -->

2\. NC1HWC2 в NHWC: преобразование данных int8 NC1HWC2 в int8 NHWC.

<!-- source: EN PDF p63; unit 737 -->

```text
/*
 *src: represents the address of NC1HWC2 tensor
 *dst: represents the address of the NCHW tensor
 *dims: represents the shape information of NC1HWC2
 *channel: represents the value of C in NCHW
 * h : represents the value of h in NCHW
 * w: represents the value of w in NCHW
 */
int NC1HWC2_to_NHWC(const int8_t* src, int8_t* dst, int* dims, int channel, int h, int w)
{
  int batch = dims[0];
  int C1 = dims[1];
  int C2 = dims[4];
  int hw_src = dims[2] * dims[3];
  int hw_dst = h * w;
  for (int i = 0; i < batch; i++) {
    src = src + i * C1 * hw_src * C2;
    dst = dst + i * channel * hw_dst;
    for (int cur_h = 0; cur_h < h; ++cur_h) {
      for (int cur_w = 0; cur_w < w; ++cur_w) {
        int cur_hw = cur_h * dims[3] + cur_w;
        for (int c = 0; c < channel; ++c) {
          int plane = c / C2;
          const auto* src_c = plane * hw_src * C2 + src;
          int offset = c % C2;
          dst[cur_h * w * channel + cur_w * channel + c] = src_c[C2 * cur_hw + offset];
        }
      }
    }
  }
  return 0;
}
```

<!-- source: EN PDF p64; unit 739 -->

### 5\.2 Интерфейс нулевого копирования RKNN Runtime

<!-- source: EN PDF p64; unit 740 -->

#### 5\.2.1 Введение в нулевое копирование

<!-- source: EN PDF p64; unit 741 -->

На RK3562/RK3566/RK3568/RK3576/RK3588/RV1126B доступны обычный API и API нулевого копирования; RV1103/RV1103B/RV1106/RV1106B поддерживают только последний. Примеры нулевого копирования находятся в examples/rknn\_zero\_copy проекта rknpu2. Подробности и исходный код: https://github.com/airockchip/rknn-toolkit2/tree/master/rknpu2.

<!-- source: EN PDF p64; unit 742 -->

При инференсе RKNN исходные данные проходят обработку входа, выполнение модели на NPU и обработку выхода. В зависимости от входного формата и способа квантования используются обычный API или нулевое копирование, как показано на

<!-- source: EN PDF p64; unit 743 -->

рисунках 5-5 и 5-6. При каждом обновлении кадра обычный API копирует внешние данные во входную память NPU во время выполнения. Нулевое копирование напрямую использует заранее выделенную память NPU или другой подсистемы, например DRM, снижая расходы на копирование и пропускную способность и повышая производительность. Если вход имеет только виртуальный адрес, доступен лишь обычный API. При физическом адресе или fd доступны оба API. Обычный API и API нулевого копирования нельзя вызывать совместно.

<!-- source: EN PDF p65; unit 744 -->

![Рисунок 5-5. Обработка данных обычного API](/docs/rockchip-rknn-sdk-user-guide/assets/en-p065-figure-01.png)

<!-- source: EN PDF p65; unit 745 -->

Рисунок 5-5. Обработка данных обычного API

<!-- source: EN PDF p65; unit 746 -->

![Рисунок 5-6. Обработка данных API нулевого копирования](/docs/rockchip-rknn-sdk-user-guide/assets/en-p065-figure-02.png)

<!-- source: EN PDF p65; unit 747 -->

Рисунок 5-6. Обработка данных API нулевого копирования

<!-- source: EN PDF p65; unit 748 -->

Обычный API

<!-- source: EN PDF p65; unit 749 -->

На рисунке 5-5 нормализация, квантование, преобразование формата и деквантование выполняются на CPU, а инференс — на NPU. Если вход удовлетворяет выравниванию нулевого копирования, нормализация и квантование выполняются на NPU, но CPU все равно копирует вход в буфер модели.

<!-- source: EN PDF p65; unit 750 -->

API нулевого копирования

<!-- source: EN PDF p65; unit 751 -->

Процесс на рисунке 5-6 оптимизирует обычный API. Нормализация, квантование и инференс выполняются на NPU; преобразование формата выхода и деквантование — на CPU или NPU. Входной поток обрабатывается эффективнее обычного API.

<!-- source: EN PDF p65; unit 752 -->

Условия нулевого копирования приведены в таблице:

<!-- source: EN PDF p65; unit 753 -->

Таблица 5-2. Выравнивание входа для нулевого копирования

<!-- source: EN PDF p65; unit 754 -->

| Размерность входа | Требования к выравниванию входа |  |
| --- | --- | --- |
|  | RV1103B/RV1106B/RK3566/RK3568 | RV1103/RV1106/RV1126B/RK3562/RK3576/RK3588 |
| 4 измерения; число каналов — 1, 3, 4 | Ширина выровнена по 8 байтам | Ширина выровнена по 16 байтам |
| Не 4 измерения | Общий размер выровнен по 8 байтам | Общий размер выровнен по 16 байтам |

<!-- source: EN PDF p66; unit 755 -->

#### 5\.2.2 Процесс нулевого копирования C API

<!-- source: EN PDF p66; unit 756 -->

API нулевого копирования использует rknn\_tensor\_memory. До инференса структуру нужно создать и настроить, а после — прочитать сведения о памяти. В зависимости от внешнего выделения памяти модели (вход/выход/веса/промежуточные результаты) и ее представления (fd, физический адрес и т. п.) существуют три типовых процесса на рисунках 5-7–5-9. Красным показаны специальные интерфейсы и структуры нулевого копирования, курсивом — структуры, передаваемые между вызовами.

<!-- source: EN PDF p66; unit 757 -->

1\. Входная и выходная память выделяется Runtime

<!-- source: EN PDF p66; unit 758 -->

![Рисунок 5-7. Нулевое копирование с внутренним выделением входа и выхода](/docs/rockchip-rknn-sdk-user-guide/assets/en-p066-figure-01.png)

<!-- source: EN PDF p66; unit 759 -->

Рисунок 5-7. Нулевое копирование с внутренним выделением входа и выхода

<!-- source: EN PDF p66; unit 760 -->

На рисунке 5-7 Runtime создает rknn\_tensor\_memory через rknn\_create\_mem(), а rknn\_set\_io\_mem() задает структуры входной и выходной памяти.

<!-- source: EN PDF p67; unit 761 -->

Структура, созданная rknn\_create\_mem(), содержит файловый дескриптор и физический адрес. RGA использует память, выделенную NPU. preprocess\_rga() обозначает интерфейс RGA, stream\_fd — его исходный входной буфер, postprocess\_cpu() — последующую обработку на CPU.

<!-- source: EN PDF p67; unit 762 -->

2\. Входная и выходная память выделяется извне

<!-- source: EN PDF p67; unit 763 -->

![Рисунок 5-8. Нулевое копирование с внешним выделением входа и выхода](/docs/rockchip-rknn-sdk-user-guide/assets/en-p067-figure-01.png)

<!-- source: EN PDF p67; unit 764 -->

Рисунок 5-8. Нулевое копирование с внешним выделением входа и выхода

<!-- source: EN PDF p67; unit 765 -->

На рисунке 5-8 внешняя память представляется rknn\_tensor\_memory через rknn\_create\_mem\_from\_fd()/rknn\_create\_mem\_from\_phys(), затем rknn\_set\_io\_mem() задает вход и выход. flush\_cache означает, что пользователь должен вызвать соответствующий типу памяти интерфейс сброса выходного кэша.

<!-- source: EN PDF p67; unit 766 -->

3\. Вход, выход, веса и внутренние тензоры выделяются извне

<!-- source: EN PDF p68; unit 767 -->

![Рисунок 5-9. Нулевое копирование с внешней памятью входа, выхода, весов и внутренних тензоров](/docs/rockchip-rknn-sdk-user-guide/assets/en-p068-figure-01.png)

<!-- source: EN PDF p68; unit 768 -->

Рисунок 5-9. Нулевое копирование с внешней памятью входа, выхода, весов и внутренних тензоров

<!-- source: EN PDF p68; unit 769 -->

На рисунке 5-9 внешняя память входа, выхода, весов и промежуточных результатов представляется через rknn\_create\_mem\_from\_fd()/rknn\_create\_mem\_from\_phys() как rknn\_tensor\_memory. rknn\_set\_io\_mem() задает вход и выход; rknn\_set\_weight\_mem()/rknn\_set\_internal\_mem() — веса и внутренние результаты.

<!-- source: EN PDF p69; unit 770 -->

#### 5\.2.3 Использование C API нулевого копирования

<!-- source: EN PDF p69; unit 771 -->

Ниже рассмотрен процесс нулевого копирования с внутренним выделением входа и выхода, названный в оригинале рисунком 5-6:

<!-- source: EN PDF p69; unit 772 -->

rknn\_query()

<!-- source: EN PDF p69; unit 773 -->

Вход:

<!-- source: EN PDF p69; unit 774 -->

Запросите атрибуты через RKNN\_QUERY\_NATIVE\_INPUT\_ATTR, а не RKNN\_QUERY\_INPUT\_ATTR. Предварительная обработка зависит от полученного формата/layout. Запрошенные таким образом layout и тип оптимальны для аппаратуры.

<!-- source: EN PDF p69; unit 775 -->

Варианты входа rknn\_query():

<!-- source: EN PDF p69; unit 776 -->

1\. При RKNN\_TENSOR\_NCHW вход обычно четырехмерный, типа bool или int64. Передаваемые в NPU данные также должны иметь NCHW.

<!-- source: EN PDF p69; unit 777 -->

2\. При RKNN\_TENSOR\_NHWC вход обычно четырехмерный, типа float32/float16/int8/uint8, с 1, 3 или 4 каналами. Данные передаются в NHWC. При pass\_through=1 ширину может потребоваться выровнять по stride в соответствии с запрошенным w\_stride.

<!-- source: EN PDF p69; unit 778 -->

3\. При RKNN\_TENSOR\_NC1HWC2 вход обычно четырехмерный, типа float16/int8, а число каналов не равно 1, 3 или 4. При pass\_through=0 данные передаются в NHWC, и интерфейс преобразует их в NC1HWC2 на CPU. При pass\_through=1 данные должны иметь NC1HWC2, и преобразование выполняет пользователь извне.

<!-- source: EN PDF p69; unit 779 -->

4\. При RKNN\_TENSOR\_UNDEFINED вход обычно не четырехмерный. Данные передаются в NPU в формате входа модели ONNX. NPU не выполняет mean/std и преобразование layout.

<!-- source: EN PDF p69; unit 780 -->

Если требуемый вход отличается от полученной структуры rknn\_tensor\_attr, ее можно изменить. Поддерживаемые изменения типов приведены в таблице 5-3. Важно: если запрос вернул uint8, а нужен float32, увеличьте size в четыре раза и измените тип на RKNN\_TENSOR\_FLOAT32. Такой вариант не оптимален для аппаратуры: интерфейс внутренне вызывает CPU для преобразования типа.

<!-- source: EN PDF p69; unit 781 -->

Таблица 5-3. Изменяемые типы входных данных

<!-- source: EN PDF p69; unit 782 -->

|  | Тип входных данных, полученный через rknn\_query |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  |  | bool | int8 | float16 | int16 | int32 | int64 |
| Тип входных данных, изменённый пользователем | bool | Y |  |  |  |  |  |
|  | int8 |  | Y |  |  |  |  |
|  | uint8 |  | Y | Y |  |  |  |
|  | float32 |  | Y | Y |  |  |  |
|  | float16 |  |  | Y |  |  |  |
|  | int16 |  |  |  | Y |  |  |
|  | int32 |  |  |  |  | Y |  |
|  | int64 |  |  |  |  |  | Y |

<!-- source: EN PDF p70; unit 784 -->

Выход:

<!-- source: EN PDF p70; unit 785 -->

Запросите атрибуты через RKNN\_QUERY\_NATIVE\_OUTPUT\_ATTR, а не RKNN\_QUERY\_OUTPUT\_ATTR. Обработка зависит от полученного формата/layout. Запрошенные таким образом layout и тип оптимальны для аппаратуры.

<!-- source: EN PDF p70; unit 786 -->

Для четырехмерного выхода в NHWC используйте RKNN\_QUERY\_NATIVE\_NHWC\_OUTPUT\_ATTR. Он напрямую запрашивает native-выход NPU в NHWC.

<!-- source: EN PDF p70; unit 787 -->

Варианты выхода rknn\_query():

<!-- source: EN PDF p70; unit 788 -->

1\. При RKNN\_TENSOR\_NC1HWC2 выход обычно четырехмерный, а

<!-- source: EN PDF p70; unit 789 -->

тип данных — float16/int8. Если нужен NCHW, преобразуйте NC1HWC2 в NCHW извне.

<!-- source: EN PDF p70; unit 790 -->

2\. При RKNN\_TENSOR\_UNDEFINED выход обычно не четырехмерный, а

<!-- source: EN PDF p70; unit 791 -->

тип данных — float16/int8. Внешнее преобразование layout не требуется.

<!-- source: EN PDF p70; unit 792 -->

3\. При RKNN\_TENSOR\_NCHW выход обычно четырехмерный, с типом

<!-- source: EN PDF p70; unit 793 -->

float16/int8. Внешнее преобразование layout не требуется.

<!-- source: EN PDF p70; unit 794 -->

4\. При RKNN\_TENSOR\_NHWC выход обычно четырехмерный, с типом

<!-- source: EN PDF p70; unit 795 -->

float16/int8. Обычно это результат запроса layout через RKNN\_QUERY\_NATIVE\_NHWC\_OUTPUT\_ATTR.

<!-- source: EN PDF p70; unit 796 -->

Если требуемый выход отличается от полученной структуры rknn\_tensor\_attr, ее можно изменить согласно таблицам 5-4 и 5-5. Важно: если выходной тип int8, а нужен float32, увеличьте size в четыре раза и измените тип на RKNN\_TENSOR\_FLOAT32. Такое изменение не оптимально для аппаратуры: интерфейс выполняет преобразование типа на CPU.

<!-- source: EN PDF p70; unit 797 -->

Таблица 5-4. Изменяемые типы выходных данных

<!-- source: EN PDF p70; unit 798 -->

|  | Тип выходных данных, полученный через rknn\_query |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  |  | bool | int8 | float16 | int16 | int32 | int64 |
| Тип выходных данных, изменённый пользователем | bool | Y |  |  |  |  |  |
|  | int8 |  | Y |  |  |  |  |
|  | uint8 |  |  |  |  |  |  |
|  | float32 |  | Y | Y |  |  |  |
|  | float16 |  |  | Y |  |  |  |
|  | int16 |  |  |  | Y |  |  |
|  | int32 |  |  |  |  | Y |  |
|  | int64 |  |  |  |  |  | Y |

<!-- source: EN PDF p71; unit 800 -->

Таблица 5-5. Расположение выхода

<!-- source: EN PDF p71; unit 801 -->

|  | Компоновка выхода, полученная через rknn\_query |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
|  | NC1HWC2 | NCHW | NHWC | UNDEFINED |  |
| Компоновка выхода, заданная пользователем | NC1HWC2 | Y |  |  |  |
|  | NCHW | Y | Y |  |  |
|  | NHWC |  |  | Y |  |
|  | UNDEFINED |  |  |  | Y |

<!-- source: EN PDF p71; unit 802 -->

Конфигурации выхода NPU с нулевым копированием для RK3562/RK3566/RK3568/RK3576/RK3588/RV1126B приведены в таблице 5-6, для RV1103/RV1103B/RV1106/RV1106B — в таблице 5-7.

<!-- source: EN PDF p71; unit 803 -->

Таблица 5-6. Выход NPU с нулевым копированием на RK3562/RK3566/RK3568/RK3576/RK3588/RV1126B

<!-- source: EN PDF p71; unit 804 -->

| Тип модели | Тип выходных данных | Размерность выхода | Поддерживаемая компоновка выхода |
| --- | --- | --- | --- |
| Модель int8 | int8/float16/float32 | 4 измерения | NCHW/NC1HWC2/NHWC |
|  |  | Не 4 измерения | UNDEFINE |
| Модель float16 | float16/float32 | 4 измерения | NCHW/NC1HWC2/NHWC |
|  |  | Не 4 измерения | UNDEFINE |

<!-- source: EN PDF p72; unit 806 -->

Таблица 5-7. Выход NPU с нулевым копированием на RV1103/RV1103B/RV1106/RV1106B

<!-- source: EN PDF p72; unit 807 -->

```text
| Model type | Output data type | Output dimensions | Supported output layout |
|------------|------------------|-------------------|-------------------------|
| int8 Model | int8/float16 | 4 dimensions | NCHW/NC1HWC2/NHWC |
| | | Not 4 dimensions | UNDEFINE |
```

<!-- source: EN PDF p72; unit 808 -->

rknn\_create\_mem

<!-- source: EN PDF p72; unit 809 -->

API нулевого копирования использует rknn\_tensor\_memory: до инференса структуру создают и настраивают, после — читают ее сведения о памяти. Если layout и тип из RKNN\_QUERY\_NATIVE\_INPUT\_ATTR/RKNN\_QUERY\_NATIVE\_OUTPUT\_ATTR не меняются, память создают непосредственно по size\_with\_stride. При изменении layout или типа размер памяти корректируют соответственно. Например, для преобразования выходного int8 в float32 размер увеличивают в четыре раза.

<!-- source: EN PDF p72; unit 810 -->

rknn\_set\_io\_mem

<!-- source: EN PDF p72; unit 811 -->

rknn\_set\_io\_mem() задает rknn\_tensor\_mem со сведениями о входной/выходной памяти модели. Как и rknn\_init(), его достаточно вызвать один раз в начале, после чего rknn\_run() выполняется многократно.

<!-- source: EN PDF p72; unit 812 -->

### 5\.3 Настройка многоядерной NPU

<!-- source: EN PDF p72; unit 813 -->

RK3588 повышает вычислительную мощность с помощью 3 ядер NPU, RK3576 — 2 ядер. В этом разделе подробно описана настройка многоядерной NPU для повышения эффективности инференса.

<!-- source: EN PDF p72; unit 814 -->

Примечание: многоядерное выполнение подходит для вычислительно тяжелых сетей. Для небольших сетей улучшение незначительно; переключение между одним и несколькими ядрами может даже снизить производительность, поскольку требует участия CPU.

<!-- source: EN PDF p72; unit 815 -->

#### 5\.3.1 Настройка многоядерного выполнения

<!-- source: EN PDF p72; unit 816 -->

В приложении Python ядра NPU для модели задаются параметром core\_mask интерфейса init\_runtime() в RKNN-Toolkit2 или RKNN-Toolkit Lite2. Подробное описание параметра:

<!-- source: EN PDF p72; unit 817 -->

В приложении Python ядра NPU для модели задаются параметром core\_mask интерфейса init\_runtime() в RKNN-Toolkit2 или RKNN-Toolkit Lite2. Подробное описание параметра:

<!-- source: EN PDF p72; unit 818 -->

Таблица 5-8. Параметр core\_mask интерфейса init\_runtime

<!-- source: EN PDF p73; unit 819 -->

| Параметр | Описание |
| --- | --- |
| core\_mask | Настройка ядер NPU при выполнении модели. Поддерживаются:<br>- NPU\_CORE\_AUTO: автоматически выбирается свободное ядро NPU<br>- NPU\_CORE\_0: выполнение на NPU0<br>- NPU\_CORE\_1: выполнение на NPU1<br>- NPU\_CORE\_2: выполнение на NPU2<br>- NPU\_CORE\_0\_1: выполнение на NPU0 и NPU1 одновременно<br>- NPU\_CORE\_0\_1\_2: выполнение на NPU0, NPU1 и NPU2 одновременно<br>- NPU\_CORE\_ALL: число используемых ядер выбирается в зависимости от платформы<br>По умолчанию NPU\_CORE\_AUTO.<br>Примечание: в RKNN-Toolkit Lite2 перед значением добавляется RKNNLite, например RKNNLite.NPU\_CORE\_AUTO; в RKNN-Toolkit2 — RKNN, например RKNN.NPU\_CORE\_AUTO. |

<!-- source: EN PDF p73; unit 820 -->

Настройка ядра NPU в RKNN-Toolkit2, пример:

<!-- source: EN PDF p73; unit 821 -->

```text
# Init runtime environment
print('--> Init runtime environment')
ret = rknn.init_runtime(target='rk3588', core_mask=RKNN.NPU_CORE_0)
if ret != 0:
  print('Init runtime environment failed!')
  exit(ret)
print('done')
```

<!-- source: EN PDF p73; unit 822 -->

Настройка ядра NPU в RKNN-Toolkit Lite2, пример:

<!-- source: EN PDF p73; unit 823 -->

```text
......
# Init runtime environment
print('--> Init runtime environment')
ret = rknn_lite.init_runtime(core_mask=RKNNLite.NPU_CORE_0)
if ret != 0:
  print('Init runtime environment failed')
  exit(ret)
print('done')
......
```

<!-- source: EN PDF p73; unit 824 -->

В приложениях C/C++ ядро NPU для модели задается через rknn\_set\_core\_mask(). Описание параметра core\_mask:

<!-- source: EN PDF p73; unit 825 -->

Таблица 5-9. Параметр core\_mask интерфейса rknn\_set\_core\_mask

<!-- source: EN PDF p74; unit 826 -->

| Параметр | Описание |
| --- | --- |
| core\_mask | Настройка ядер NPU при выполнении модели. Поддерживаются:<br>- RKNN\_NPU\_CORE\_AUTO: автоматически выбирается свободное ядро NPU<br>- RKNN\_NPU\_CORE\_0: выполнение на NPU0<br>- RKNN\_NPU\_CORE\_1: выполнение на NPU1<br>- RKNN\_NPU\_CORE\_2: выполнение на NPU2<br>- RKNN\_NPU\_CORE\_0\_1: выполнение на NPU0 и NPU1 одновременно<br>- RKNN\_NPU\_CORE\_0\_1\_2: выполнение на NPU0, NPU1 и NPU2 одновременно<br>- RKNN\_NPU\_CORE\_ALL: число используемых ядер выбирается в зависимости от платформы |

<!-- source: EN PDF p74; unit 827 -->

Пример настройки ядра NPU через C/C++ API:

<!-- source: EN PDF p74; unit 828 -->

```text
// rknn_context ctx;
rknn_core_mask core_mask = RKNN_NPU_CORE_0;
int ret = rknn_set_core_mask(ctx, core_mask);
```

<!-- source: EN PDF p74; unit 829 -->

#### 5\.3.2 Проверка многоядерного выполнения

<!-- source: EN PDF p74; unit 830 -->

В этом разделе подробно рассмотрено поведение модели RKNN в многоядерном режиме.

<!-- source: EN PDF p74; unit 831 -->

Для инференса на подключенном RKNPU через RKNN-Toolkit2 задайте perf\_debug=True в rknn.init\_runtime(), затем вызовите rknn.eval\_perf() для вывода сведений о каждом слое. Пример:

<!-- source: EN PDF p74; unit 832 -->

```text
# Init runtime environment
ret = rknn.init_runtime(target='rk3588', device_id='29d5dd97766a5c27', perf_debug=True)
if ret != 0:
  print('Init runtime environment failed!')
  exit(ret)

# Eval performance
rknn.eval_perf()
```

<!-- source: EN PDF p74; unit 833 -->

При выполнении непосредственно на устройстве установите RKNN\_LOG\_LEVEL в 4 или выше перед запуском приложения. Будут выведены сведения о каждом слое. Настройка:

<!-- source: EN PDF p74; unit 834 -->

```text
# Using the python interface provided by RKNN-Toolkit Lite2, just set verbose to True when creating the RKNNLite object.
rknnlite = RKNNLite(verbose=True)

# Using the C/C++ interface, you need to set the following environment variables before running the binary program
export RKNN_LOG_LEVEL=4
```

<!-- source: EN PDF p74; unit 835 -->

Для модели lenet после этих настроек терминал выводит журнал, подобный следующему. Для удобства показа удалены поля InputShape, OutputShape, DDR Cycles, NPU Cycles, Total Cycles, Time(us), MacUsage(%), Task Number, Lut Number, RW(kb), FullName и другие:

<!-- source: EN PDF p75; unit 836 -->

```text
ID OpType DataType Target WorkLoad(0/1/2)-ImproveTherical
1 InputOperator UINT8 CPU 100.0%/0.0%/0.0% - Up:0.0%
2 Conv UINT8 NPU 50.0%/50.0%/0.0% - Up:50.0%
3 MaxPool INT8 NPU 100.0%/0.0%/0.0% - Up:0.0%
4 Conv INT8 NPU 50.0%/50.0%/0.0% - Up:50.0%
5 MaxPool INT8 NPU 100.0%/0.0%/0.0% - Up:0.0%
6 ConvRelu INT8 NPU 48.1%/51.9%/0.0% - Up:48.1%
7 Conv INT8 NPU 100.0%/0.0%/0.0% - Up:0.0%
8 Softmax INT8 CPU 0.0%/0.0%/0.0% - Up:0.0%
9 OutputOperator FLOAT16 CPU 0.0%/0.0%/0.0% - Up:0.0%
Total Operator Elapsed Time(us): 591
Total Memory RW Amount(MB): 0
```

<!-- source: EN PDF p75; unit 837 -->

Столбец WorkLoad(0/1/2)-ImproveTherical выводится только для многоядерных NPU. Он показывает распределение задач каждого слоя по ядрам и теоретическое ускорение. Например, «50.0%/50.0%/0.0% - Up:50.0%» означает 50% вычислений на Core0 и 50% на Core1, с теоретическим улучшением на 50% относительно одного ядра. Если улучшения нет, например «100.0%/0.0%/0.0% - Up:0.0%», возможны причины:

<!-- source: EN PDF p75; unit 838 -->

Нагрузка слоя меньше гранулярности распределения задач многоядерной NPU, поэтому слой выполняется на одном ядре.

<!-- source: EN PDF p75; unit 839 -->

Драйвер NPU пока не реализует многоядерное разделение для этого оператора; поддержка ожидается в следующих версиях. В оригинале перечислены поддерживаемые операторы: Conv, DepthwiseConvolution, Add, Concat, Relu, Clip, Relu6, ThresholdedRelu, PRelu и LeakyRelu.

<!-- source: EN PDF p75; unit 840 -->

#### 5\.3.3 Улучшение многоядерной производительности

<!-- source: EN PDF p75; unit 841 -->

Для повышения производительности попробуйте:

<!-- source: EN PDF p75; unit 842 -->

Установить максимальные частоты CPU/DDR/NPU.

<!-- source: EN PDF p75; unit 843 -->

Привязать приложение к большому ядру CPU.

<!-- source: EN PDF p75; unit 844 -->

Привязать прерывание NPU к тому же большому ядру CPU.

<!-- source: EN PDF p75; unit 845 -->

Команды фиксации частоты зависят от прошивки; см. раздел 8.1.1.

<!-- source: EN PDF p75; unit 846 -->

Для последних двух пунктов пример привязки к CPU4 приведен в скрипте:

<!-- source: EN PDF p75; unit 847 -->

```text
interrupts=$(cat /proc/interrupts | grep npu)
interrupts_array=($interrupts)

irq1=$(echo ${interrupts_array[0]} | awk -F ':' '{print $1}')
irq2=$(echo ${interrupts_array[14]} | awk -F ':' '{print $1}')
irq3=$(echo ${interrupts_array[28]} | awk -F ':' '{print $1}')

for irq in $irq1 $irq2 $irq3; do
 echo 4 > /proc/irq/$irq/smp_affinity_list
done

taskset 10 ./rknn_benchmark lenet.rknn "" 10 3 # The taskset mask value corresponding to CPU4 is 0x10
```

<!-- source: EN PDF p76; unit 848 -->

Скрипт выполняет следующие действия:

<!-- source: EN PDF p76; unit 849 -->

Выполняет `cat /proc/interrupts | grep npu` и извлекает три номера прерываний, удаляя двоеточия.

<!-- source: EN PDF p76; unit 850 -->

Циклом задает smp\_affinity\_list каждого прерывания в 4 — идентификатор CPU4.

<!-- source: EN PDF p76; unit 851 -->

Выполняет `taskset 10 ./rknn_benchmark lenet.rknn "" 10 3`. Параметр taskset для CPU4 равен 10. Описание taskset: https://man7.org/linux/man-pages/man1/taskset.1.html.

<!-- source: EN PDF p76; unit 852 -->

После этого прерывание NPU и rknn\_benchmark выполняются на CPU4, устраняя расходы переключения ядер при обработке прерывания NPU.

<!-- source: EN PDF p76; unit 853 -->

### 5\.4 Динамическая форма

<!-- source: EN PDF p76; unit 854 -->

#### 5\.4.1 Введение в динамическую форму

<!-- source: EN PDF p76; unit 855 -->

Динамическая форма позволяет менять форму входных данных во время выполнения, обрабатывая переменные размеры и повышая гибкость модели. Когда RKNN поддерживал только статические формы, для нескольких входных форм требовались отдельные модели и контексты инференса. С динамической формой достаточно одной модели RKNN размером, близким к статической, и одного контекста, что экономит Flash и DDR. Это важно для обработки изображений и последовательностей. Типичные сценарии:

<!-- source: EN PDF p76; unit 856 -->

Переменная длина последовательности, например NLP-модели BERT и GPT.

<!-- source: EN PDF p76; unit 857 -->

Переменные пространственные размеры, например сегментация и перенос стиля.

<!-- source: EN PDF p76; unit 858 -->

Изменяемый размер batch в пакетных моделях.

<!-- source: EN PDF p76; unit 859 -->

Обнаружение объектов с переменным числом выходов.

<!-- source: EN PDF p76; unit 860 -->

#### 5\.4.2 Требования к версии RKNN SDK и платформе

<!-- source: EN PDF p76; unit 861 -->

Версия RKNN-Toolkit2 &gt;=1.5.0

<!-- source: EN PDF p76; unit 862 -->

Версия RKNPU Runtime (librknnrt.so) &gt;=1.5.0

<!-- source: EN PDF p76; unit 863 -->

Функция поддерживается на RK3562/RK3566/RK3568/RK3576/RK3588/RV1126B.

<!-- source: EN PDF p76; unit 864 -->

#### 5\.4.3 Создание модели RKNN с динамической формой

<!-- source: EN PDF p76; unit 865 -->

Создание модели с динамической формой через Python-интерфейс RKNN-Toolkit2:

<!-- source: EN PDF p76; unit 866 -->

1\. Убедитесь, что модель поддерживает динамическую форму.

<!-- source: EN PDF p76; unit 867 -->

RKNN-Toolkit2 может расширить статическую модель до динамической. Сначала убедитесь, что операторы или структура подграфов не ограничивают изменение формы. Например, форма константы неизменяема, и инструмент сообщит об ошибке преобразования. Если расширение не поддерживается, измените структуру по сообщению об ошибке и переобучите модель. Рекомендуется исходная модель с динамической формой.

<!-- source: EN PDF p76; unit 868 -->

2\. Задайте используемые формы входа.

<!-- source: EN PDF p77; unit 869 -->

Аппаратура NPU не допускает произвольных форм: необходимо заранее задать ограниченное число входных форм. У многовходной модели число форм каждого входа должно совпадать. Пример Python для преобразования Caffe:

<!-- source: EN PDF p77; unit 870 -->

```text
dynamic_input = [
  [[1,3,224,224]], # set the first shape for all inputs
  [[1,3,192,192]], # set the second shape for all inputs
  [[1,3,160,160]], # set the third shape for all inputs
]

# Pre-process config
rknn.config(mean_values=[103.94, 116.78, 123.68], std_values=[58.82, 58.82, 58.82],
      quant_img_RGB2BGR=True, dynamic_input=dynamic_shapes)
```

<!-- source: EN PDF p77; unit 871 -->

Настройка создает модель с тремя формами: [1,3,224,224], [1,3,192,192] и [1,3,160,160]. Формы dynamic\_input соответствуют layout исходной среды. Для RGB-классификации 224x224 вход TensorFlow/TFLite имеет [1,224,224,3], а ONNX — [1,3,224,224].

<!-- source: EN PDF p77; unit 872 -->

3\. Квантование

<!-- source: EN PDF p77; unit 873 -->

После задания форм для квантования нужен калибровочный набор. Инструмент использует набор форм с максимальной суммой размеров всех входов. Например, первый вход имеет формы [1,224] и [1,112], второй — [1,40] и [1,80]. Оригинал печатает суммы как «1224+140=264» и «1112+180=192»; знаки умножения визуально отсутствуют, поэтому запись сохранена как спорное место оригинала. Первая группа больше, и для квантования используются [1,224] и [1,40].

<!-- source: EN PDF p77; unit 874 -->

Для калибровочных jpg/png допустимы разные разрешения: перед квантованием opencv resize масштабирует изображение до максимального разрешения.

<!-- source: EN PDF p77; unit 875 -->

Для npy необходимо использовать форму максимального разрешения. После квантования все формы модели используют один набор параметров квантования при инференсе.

<!-- source: EN PDF p77; unit 876 -->

Максимальная входная форма также выводится при rknn.config:

<!-- source: EN PDF p77; unit 877 -->

```text
W config: The 'dynamic_input' function has been enabled, the MaxShape is dynamic_input[0] = [[1,224],[1,40]]!
The following functions are subject to the MaxShape:
1. The quantified dataset needs to be configured according to MaxShape
2. The eval_perf or eval_memory return the results of MaxShape
```

<!-- source: EN PDF p77; unit 878 -->

4\. Инференс или анализ точности

<!-- source: EN PDF p77; unit 879 -->

Для инференса или анализа точности используйте одну из групп форм шага 2. Интерфейсы такие же, как у статической модели RKNN, и повторно не описываются.

<!-- source: EN PDF p77; unit 880 -->

Полный пример динамической формы: https://github.com/airockchip/rknn-toolkit2/tree/master/rknn-toolkit2/examples/functions/dynamic\_shape

<!-- source: EN PDF p78; unit 881 -->

#### 5\.4.4 Развертывание через C API

<!-- source: EN PDF p78; unit 882 -->

После получения модели с динамической формой разверните ее через RKNPU2 C API. В зависимости от интерфейса используются обычный API или нулевое копирование.

<!-- source: EN PDF p78; unit 883 -->

##### 5\.4.4.1 Обычный API

<!-- source: EN PDF p78; unit 884 -->

Процесс развертывания динамической модели через обычный API:

<!-- source: EN PDF p79; unit 885 -->

![Рисунок 5-10. Вызовы обычного API для динамической формы входа](/docs/rockchip-rknn-sdk-user-guide/assets/en-p079-figure-01.png)

<!-- source: EN PDF p79; unit 886 -->

Рисунок 5-10. Вызовы обычного API для динамической формы входа

<!-- source: EN PDF p80; unit 887 -->

После загрузки модели форму входа можно менять во время выполнения. rknn\_query() возвращает поддерживаемые формы каждого входа в rknn\_input\_range: имя, layout, число и значения форм. Затем rknn\_set\_input\_shapes() принимает указатель на массив rknn\_tensor\_attr со всеми входными формами и задает текущую форму. Повторный rknn\_query() позволяет получить формы входа и выхода после установки.

<!-- source: EN PDF p80; unit 888 -->

Далее выполните обычный процесс инференса. При каждой смене формы установите новую форму, подготовьте соответствующие данные и повторно вызовите rknn\_inputs\_set(). Если форма не меняется, повторять rknn\_set\_input\_shapes() не нужно.

<!-- source: EN PDF p80; unit 889 -->

1\. Инициализация

<!-- source: EN PDF p80; unit 890 -->

Инициализируйте динамическую модель через rknn\_init().

<!-- source: EN PDF p80; unit 891 -->

При инициализации контекста действуют ограничения:

<!-- source: EN PDF p80; unit 892 -->

Совместное использование весов с флагом RKNN\_FLAG\_SHARE\_WEIGHT\_MEM не поддерживается.

<!-- source: EN PDF p80; unit 893 -->

Повторное использование контекста не поддерживается; см. rknn\_dup\_context.

<!-- source: EN PDF p80; unit 894 -->

2\. Запрос поддерживаемых форм входа модели RKNN

<!-- source: EN PDF p80; unit 895 -->

После инициализации rknn\_query() возвращает список форм каждого входа как rknn\_input\_range с именем, layout, количеством и конкретными формами. Пример C:

<!-- source: EN PDF p80; unit 896 -->

```text
// Query the input shape supported by the model
rknn_input_range dyn_range[io_num.n_input];
memset(dyn_range, 0, io_num.n_input * sizeof(rknn_input_range));
for (uint32_t i = 0; i < io_num.n_input; i++)
{
  dyn_range[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_INPUT_DYNAMIC_RANGE, &dyn_range[i],
sizeof(rknn_input_range));
  if (ret != RKNN_SUCC)
  {
    fprintf(stderr, "rknn_query error! ret=%d\n", ret);
    return -1;
  }
  dump_input_dynamic_range(&dyn_range[i]);
}
```

<!-- source: EN PDF p80; unit 897 -->

Примечание: у многовходных моделей формы соответствуют друг другу по порядку. Первая форма первого входа сочетается с первой формой второго; перекрестные сочетания недопустимы. Например, A имеет [1,224] и [1,112], B — [1,40] и [1,80]. Поддерживаются только:

<!-- source: EN PDF p80; unit 898 -->

Форма A = [1,224], форма B=[1,40]

<!-- source: EN PDF p80; unit 899 -->

Форма A = [1,112], форма B=[1,80]

<!-- source: EN PDF p80; unit 900 -->

3\. Установка формы входа

<!-- source: EN PDF p81; unit 901 -->

При первом вводе данных или смене формы вызовите rknn\_set\_input\_shapes(). После загрузки динамической модели этот интерфейс позволяет менять форму во время выполнения. Передайте массив rknn\_tensor\_attr для всех входов; поля dims, n\_dims и fmt каждого элемента описывают текущую форму инференса. Пример C:

<!-- source: EN PDF p81; unit 902 -->

```text
/**
 dynamic inputs shape range:
 index=0, name=data, shape_number=2, range=[[1, 224, 224, 3],[1, 112, 224, 3]], fmt = NHWC
**/
input_attrs[0].dims[0] = 1;
input_attrs[0].dims[1] = 224;
input_attrs[0].dims[2] = 224;
input_attrs[0].dims[3] = 3;
input_attrs[0].fmt=RKNN_TENSOR_NHWC;
ret = rknn_set_input_shapes(ctx, io_num.n_input, input_attrs);
if (ret < 0) {
  fprintf(stderr, "rknn_set_input_shapes error! ret=%d\n", ret);
  return -1;
}
```

<!-- source: EN PDF p81; unit 903 -->

Здесь io\_num.n\_input — число входов, input\_attrs — массив rknn\_tensor\_attr входов модели.

<!-- source: EN PDF p81; unit 904 -->

Примечание: заданная форма должна присутствовать в списке шага 2.

<!-- source: EN PDF p81; unit 905 -->

После установки формы повторно вызовите rknn\_query для получения текущих форм входа и выхода. Пример C:

<!-- source: EN PDF p81; unit 906 -->

```text
// Get the input and output shape of the current inference
rknn_tensor_attr cur_input_attrs[io_num.n_input];
memset(cur_input_attrs, 0, io_num.n_input * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_input; i++)
{
  cur_input_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_CURRENT_INPUT_ATTR, &(cur_input_attrs[i]),
sizeof(rknn_tensor_attr));
  if (ret < 0)
  {
    printf("rknn_init error! ret=%d\n", ret);
    return -1;
  }
  dump_tensor_attr(&cur_input_attrs[i]);
}

rknn_tensor_attr cur_output_attrs[io_num.n_output];
memset(cur_output_attrs, 0, io_num.n_output * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_output; i++)
{
  cur_output_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_CURRENT_OUTPUT_ATTR, &(cur_output_attrs[i]),
sizeof(rknn_tensor_attr));
  if (ret != RKNN_SUCC)
  {
    printf("rknn_query fail! ret=%d\n", ret);
    return -1;
  }
  dump_tensor_attr(&cur_output_attrs[i]);
}
```

<!-- source: EN PDF p82; unit 908 -->

Примечание:

<!-- source: EN PDF p82; unit 909 -->

rknn\_set\_input\_shapes требует четырехмерный тензор с fmt=NHWC либо нечетырехмерный с fmt=UNDEFINED.

<!-- source: EN PDF p82; unit 910 -->

До вызова rknn\_set\_input\_shapes сведения о формах, запрошенные командами с префиксом RKNN\_QUERY\_CURRENT, недействительны.

<!-- source: EN PDF p82; unit 911 -->

4\. Инференс

<!-- source: EN PDF p82; unit 912 -->

После установки текущей формы предположим, что сведения о входном тензоре находятся в cur\_input\_attrs. Пример C для обычного API:

<!-- source: EN PDF p82; unit 913 -->

```text
// Set input information
rknn_input inputs[io_num.n_input];
memset(inputs, 0, io_num.n_input * sizeof(rknn_input));
for (int i = 0; i < io_num.n_input; i++)
{
  int height = cur_input_attrs[i].fmt == RKNN_TENSOR_NHWC ? cur_input_attrs[i].dims[1] :
cur_input_attrs[i].dims[2];
  int width = cur_input_attrs[i].fmt == RKNN_TENSOR_NHWC ? cur_input_attrs[i].dims[2] :
cur_input_attrs[i].dims[3];
  cv::resize(imgs[i], imgs[i], cv::Size(width, height));
  inputs[i].index = i;
  inputs[i].pass_through = 0;
  inputs[i].type = RKNN_TENSOR_UINT8;
  inputs[i].fmt = RKNN_TENSOR_NHWC;
  inputs[i].buf = imgs[i].data;
  inputs[i].size = imgs[i].total() * imgs[i].channels();
}

// After converting the input data into the correct format, put it into the input buffer
ret = rknn_inputs_set(ctx, io_num.n_input, inputs);
if (ret < 0)
{
  printf("rknn_input_set fail! ret=%d\n", ret);
  return -1;
}

// Inferences
printf("Begin perf ...\n");
double total_time = 0;
for (int i = 0; i < loop_count; ++i)
{
  int64_t start_us = getCurrentTimeUs();
  ret = rknn_run(ctx, NULL);
  int64_t elapse_us = getCurrentTimeUs() - start_us;
  if (ret < 0)
  {
    printf("rknn run error %d\n", ret);
    return -1;
  }
  total_time += elapse_us / 1000.f;
  printf("%4d: Elapse Time = %.2fms, FPS = %.2f\n", i, elapse_us / 1000.f, 1000.f * 1000.f / elapse_us);
}
printf("Avg FPS = %.3f\n", loop_count * 1000.f / total_time);

// Get output results
rknn_output outputs[io_num.n_output];
memset(outputs, 0, io_num.n_output * sizeof(rknn_output));
for (uint32_t i = 0; i < io_num.n_output; ++i)
{
  outputs[i].want_float = 1;
  outputs[i].index = i;
  outputs[i].is_prealloc = 0;
}

ret = rknn_outputs_get(ctx, io_num.n_output, outputs, NULL);
if (ret < 0)
{
  printf("rknn_outputs_get fail! ret=%d\n", ret);
  return ret;
}

//Release the output buffer
ret = rknn_outputs_release(ctx, io_num.n_output, outputs);
```

<!-- source: EN PDF p83; unit 915 -->

##### 5\.4.4.2 API нулевого копирования

<!-- source: EN PDF p83; unit 916 -->

В API нулевого копирования после инициализации запросите формы через rknn\_query() и выделите входную и выходную память через rknn\_create\_mem(). Затем передайте в rknn\_set\_input\_shapes() массив rknn\_tensor\_attr с формами всех входов, задав текущую форму. Повторите rknn\_query() для получения установленных форм входа и выхода. Вызовите rknn\_set\_io\_mem() для настройки памяти. При каждом изменении формы задайте ее, подготовьте данные и снова вызовите rknn\_set\_io\_mem(). Без изменения формы повторять rknn\_set\_input\_shapes() не требуется. Типовой процесс показан ниже:

<!-- source: EN PDF p84; unit 917 -->

![Рисунок 5-11. Нулевое копирование для динамической формы входа](/docs/rockchip-rknn-sdk-user-guide/assets/en-p084-figure-01.png)

<!-- source: EN PDF p84; unit 918 -->

Рисунок 5-11. Нулевое копирование для динамической формы входа

<!-- source: EN PDF p85; unit 919 -->

Инициализация, запрос и установка формы аналогичны обычному API и повторно не описываются. Отличаются интерфейсы после установки формы. Пример C для нулевого копирования:

<!-- source: EN PDF p85; unit 920 -->

```text
// Create the largest input tensor memory
rknn_tensor_mem *input_mems[io_num.n_input];
for (int i = 0; i < io_num.n_input; i++) {
  // default input type is int8 (normalize and quantize need compute in outside)
  // if set uint8, will fuse normalize and quantize to npu
  input_attrs[i].type = RKNN_TENSOR_UINT8;
  // default fmt is NHWC, npu only support NHWC in zero copy mode
  input_attrs[i].fmt = RKNN_TENSOR_NHWC;
  input_mems[i] = rknn_create_mem(ctx, input_attrs[i].size_with_stride);
...
// Create the largest output tensor memory
rknn_tensor_mem *output_mems[io_num.n_output];
for (uint32_t i = 0; i < io_num.n_output; ++i) {
  // default output type is depend on model, this require float32 to compute top5
  // allocate float32 output tensor
  int output_size = output_attrs[i].size * sizeof(float);
  output_mems[i] = rknn_create_mem(ctx, output_size);
...
// Load the input and set the model input shape. This is called once each time the input shape is switched.
for (int s = 0; s < shape_num; ++s) {
  for (int i = 0; i < io_num.n_input; i++) {
    for (int j = 0; j < input_attrs[i].n_dims; ++j) {
      input_attrs[i].dims[j] = shape_range[i].dyn_range[s][j];
  ....
  ret = rknn_set_input_shapes(ctx, io_num.n_input, input_attrs);
  if (ret < 0) {
    fprintf(stderr, "rknn_set_input_shape error! ret=%d\n", ret);
    return -1;
  ...
  // Get the input and output shape of the current inference
  printf("current input tensors:\n");
  rknn_tensor_attr cur_input_attrs[io_num.n_input];
  memset(cur_input_attrs, 0, io_num.n_input * sizeof(rknn_tensor_attr));
  for (uint32_t i = 0; i < io_num.n_input; i++) {
    cur_input_attrs[i].index = i;
    // query info
    ret = rknn_query(ctx, RKNN_QUERY_CURRENT_INPUT_ATTR, &(cur_input_attrs[i]), sizeof(rknn_tensor_attr));

    if (ret < 0) {
      printf("rknn_init error! ret=%d\n", ret);
      return -1;
  dump_tensor_attr(&cur_input_attrs[i]);
  ...
  printf("current output tensors:\n");
  rknn_tensor_attr cur_output_attrs[io_num.n_output];
  memset(cur_output_attrs, 0, io_num.n_output * sizeof(rknn_tensor_attr));
  for (uint32_t i = 0; i < io_num.n_output; i++) {
    cur_output_attrs[i].index = i;
    // query info
    ret = rknn_query(ctx, RKNN_QUERY_CURRENT_OUTPUT_ATTR, &(cur_output_attrs[i]),
sizeof(rknn_tensor_attr));
     if (ret != RKNN_SUCC) {
       printf("rknn_query fail! ret=%d\n", ret);
       return -1;
   dump_tensor_attr(&cur_output_attrs[i]);
   ...
   // Specify the number of NPU cores, only 3588/3576 is supported
   rknn_set_core_mask(ctx, (rknn_core_mask)core_mask);

   // Set input information
   rknn_input inputs[io_num.n_input];
   memset(inputs, 0, io_num.n_input * sizeof(rknn_input));
   std::vector<cv::Mat> resize_imgs;
   resize_imgs.resize(io_num.n_input);
   for (int i = 0; i < io_num.n_input; i++) {
     int height = cur_input_attrs[i].fmt == RKNN_TENSOR_NHWC ? cur_input_attrs[i].dims[1] :
 cur_input_attrs[i].dims[2];
     int width = cur_input_attrs[i].fmt == RKNN_TENSOR_NHWC ? cur_input_attrs[i].dims[2] :
 cur_input_attrs[i].dims[3];
     int stride = cur_input_attrs[i].w_stride;
     cv::resize(imgs[i], resize_imgs[i], cv::Size(width, height));
     int input_size = resize_imgs[i].total() * resize_imgs[i].channels();
     // Copy external data to zero-copy input buffer
     if (width == stride)
       memcpy(input_mems[i]->virt_addr, resize_imgs[i].data, input_size);
     else {
       int height = cur_input_attrs[i].dims[1];
       int channel = cur_input_attrs[i].dims[3];
       // copy from src to dst with stride
       uint8_t *src_ptr = resize_imgs[i].data;
       uint8_t *dst_ptr = (uint8_t *)input_mems[i]->virt_addr;
       // width-channel elements
       int src_wc_elems = width * channel;
       int dst_wc_elems = stride * channel;
       for (int b = 0; b < cur_input_attrs[i].dims[0]; b++) {
         for (int h = 0; h < height; ++h) {
           memcpy(dst_ptr, src_ptr, src_wc_elems);
           src_ptr += src_wc_elems;
           dst_ptr += dst_wc_elems;
    ....
   // Update input zero-copy buffer
   for (int i = 0; i < io_num.n_input; i++) {
     cur_input_attrs[i].type = RKNN_TENSOR_UINT8;
     ret = rknn_set_io_mem(ctx, input_mems[i], &cur_input_attrs[i]);
     if (ret < 0) {
       printf("rknn_set_io_mem fail! ret=%d\n", ret);
       return -1;
   ....
   // Update output zero-copy buffer
   for (uint32_t i = 0; i < io_num.n_output; ++i) {
     // default output type is depend on model, this require float32 to compute top5
     cur_output_attrs[i].type = RKNN_TENSOR_FLOAT32;
     cur_output_attrs[i].fmt = RKNN_TENSOR_NCHW;
     // set output memory and attribute
     ret = rknn_set_io_mem(ctx, output_mems[i], &cur_output_attrs[i]);
     if (ret < 0) {
       printf("rknn_set_io_mem fail! ret=%d\n", ret);
      return -1;
  ....
  // Inference
  printf("Begin perf ...\n");
  double total_time = 0;
  for (int i = 0; i < loop_count; ++i) {
    int64_t start_us = getCurrentTimeUs();
    ret = rknn_run(ctx, NULL);
    int64_t elapse_us = getCurrentTimeUs() - start_us;
    if (ret < 0) {
      printf("rknn run error %d\n", ret);
      return -1;
    ...
    total_time += elapse_us / 1000.f;
    printf("%4d: Elapse Time = %.2fms, FPS = %.2f\n", i, elapse_us / 1000.f, 1000.f * 1000.f / elapse_us);
  ...
  printf("Avg FPS = %.3f\n", loop_count * 1000.f / total_time);
```

<!-- source: EN PDF p87; unit 923 -->

Примечание:

<!-- source: EN PDF p87; unit 924 -->

1\. Форма и размер входного буфера rknn\_set\_io\_mem() при динамической форме:

<!-- source: EN PDF p87; unit 925 -->

После инициализации, но до rknn\_set\_input\_shapes(), rknn\_query() с RKNN\_QUERY\_INPUT\_ATTR и RKNN\_QUERY\_OUTPUT\_ATTR обычно возвращает максимальные формы входа и выхода. Эти размеры можно использовать при выделении памяти. У многовходной модели некоторые формы могут не быть максимальными; тогда найдите максимальные размеры среди всех поддерживаемых форм и выделите соответствующую память.

<!-- source: EN PDF p87; unit 926 -->

Для нечетырехмерного входа используйте fmt=UNDEFINED; размер буфера исходной формы рассчитывается по форме и типу входа.

<!-- source: EN PDF p87; unit 927 -->

Для четырехмерного входа поддерживается fmt=NHWC или NC1HWC2. Через соответствующие поля rknn\_query получите форму и размер и передайте буфер соответствующего NHWC- или NC1HWC2-layout.

<!-- source: EN PDF p87; unit 928 -->

rknn\_query() с RKNN\_QUERY\_CURRENT\_INPUT\_ATTR/RKNN\_QUERY\_CURRENT\_OUTPUT\_ATTR возвращает вход/выход исходной модели в NHWC или UNDEFINED. RKNN\_QUERY\_CURRENT\_NATIVE\_INPUT\_ATTR/RKNN\_QUERY\_CURRENT\_NATIVE\_OUTPUT\_ATTR возвращает оптимальные для NPU вход/выход в NHWC или NC1HWC2.

<!-- source: EN PDF p87; unit 929 -->

2\. Для буфера NHWC в rknn\_set\_io\_mem() задайте shape и fmt в rknn\_tensor\_attr по RKNN\_QUERY\_CURRENT\_INPUT\_ATTR. Для NC1HWC2 используйте сведения RKNN\_QUERY\_CURRENT\_NATIVE\_INPUT\_ATTR.

<!-- source: EN PDF p87; unit 930 -->

Полный пример динамической формы C API: https://github.com/airockchip/rknn-toolkit2/tree/master/rknpu2/examples/rknn\_dynamic\_shape\_input\_demo

<!-- source: EN PDF p88; unit 931 -->

### 5\.5 Пользовательские операторы

<!-- source: EN PDF p88; unit 932 -->

#### 5\.5.1 Введение

<!-- source: EN PDF p88; unit 933 -->

RKNN SDK позволяет определять и выполнять пользовательские операторы при инференсе RKNN. Они расширяют и оптимизируют модель для CPU или GPU, эффективнее используют аппаратуру и ускоряют инференс. Для правильности и производительности необходимо глубоко понимать вычислительные принципы глубокого обучения и целевую платформу. Поддерживаются только пользовательские операторы моделей ONNX.

<!-- source: EN PDF p88; unit 934 -->

Работа с пользовательскими операторами включает два основных этапа:

<!-- source: EN PDF p88; unit 935 -->

Зарегистрируйте операторы в RKNN-Toolkit2 и экспортируйте модель RKNN.

<!-- source: EN PDF p88; unit 936 -->

Реализуйте оператор на C, загрузите, зарегистрируйте и выполните его через RKNN API.

<!-- source: EN PDF p89; unit 937 -->

![Рисунок 5-12. Полный процесс регистрации пользовательских операторов](/docs/rockchip-rknn-sdk-user-guide/assets/en-p089-figure-01.png)

<!-- source: EN PDF p89; unit 938 -->

Рисунок 5-12. Полный процесс регистрации пользовательских операторов

<!-- source: EN PDF p90; unit 939 -->

#### 5\.5.2 Общий процесс

<!-- source: EN PDF p90; unit 940 -->

##### 5\.5.2.1 Регистрация операторов в RKNN-Toolkit2 и экспорт модели RKNN

<!-- source: EN PDF p90; unit 941 -->

1\. Подготовьте onnx-модель: по спецификации ONNX задайте тип op, имя, атрибуты, число входов/выходов пользовательского оператора и вставьте его в нужную позицию графа. Создайте и экспортируйте модель через API пакета onnx.

<!-- source: EN PDF p90; unit 942 -->

2\. Реализуйте Python-класс оператора, прежде всего shape\_infer() и compute(), и зарегистрируйте его через rknn.reg\_custom\_op().

<!-- source: EN PDF p90; unit 943 -->

3\. После успешного rknn.build() выполните инференс; при ошибке проверьте shape\_infer() шага 2. Запустите симуляцию. Если результат правильный, экспортируйте модель через rknn.export\_rknn(); иначе проверьте compute() шага 2.

<!-- source: EN PDF p90; unit 944 -->

##### 5\.5.2.2 Реализация оператора на C, загрузка, регистрация и выполнение через RKNN API

<!-- source: EN PDF p90; unit 945 -->

1\. Реализуйте оператор на C на основе rknn\_custom\_op из rknn\_custom\_op.h, затем заполните сведения rknn\_custom\_op.

<!-- source: EN PDF p90; unit 946 -->

2\. Зарегистрируйте сведения rknn\_custom\_op через rknn\_register\_custom\_ops().

<!-- source: EN PDF p90; unit 947 -->

3\. Постройте и выполните модель по процессу обычного API или нулевого копирования. Для проверки оператора можно включить подробный журнал и dump модели.

<!-- source: EN PDF p90; unit 948 -->

##### 5\.5.2.3 Инференс или анализ точности с подключенным устройством через RKNN-Toolkit2

<!-- source: EN PDF p90; unit 949 -->

Для анализа точности модели с пользовательским оператором на подключенной плате скомпилируйте его callback-функции в .so, поместите файл по указанному пути и перезапустите rknn\_server. Подробности см. в разделе 5.5.4.4.

<!-- source: EN PDF p90; unit 950 -->

#### 5\.5.3 Процесс Python

<!-- source: EN PDF p90; unit 951 -->

Пользовательские операторы поддерживаются только моделями onnx; можно добавлять нестандартные для ONNX операторы, поддерживаемые RKNN.

<!-- source: EN PDF p90; unit 952 -->

Такой оператор отсутствует в стандартном списке ONNX. Помимо ONNX spec он должен соответствовать правилам:

<!-- source: EN PDF p90; unit 953 -->

op\_type не должен совпадать со стандартным оператором ONNX. Рекомендуется префикс cst.

<!-- source: EN PDF p90; unit 954 -->

Оператор должен быть связан с другими операторами с определенными формами, типами и прочими характеристиками входов/выходов.

<!-- source: EN PDF p90; unit 955 -->

Входные атрибуты поддерживают отдельные значения или массивы bool, int32, float32 и int64.

<!-- source: EN PDF p90; unit 956 -->

Константные входы поддерживают bool, int32, float32 и int64. Это типы неквантованной модели ONNX.

<!-- source: EN PDF p90; unit 957 -->

Поскольку оператор не входит в ONNX SPEC, модель с ним нужно создать и экспортировать через ONNX API либо API другой среды.

<!-- source: EN PDF p90; unit 958 -->

В качестве простого примера изменим определение Softmax и создадим ONNX-модель с нестандартным оператором cstSoftmax:

<!-- source: EN PDF p91; unit 959 -->

```text
import onnx

path="test_softmax.onnx"
model=onnx.load(path)

for node in model.graph.node:
  if node.op_type =="Softmax":
    node.op_type = "cstSoftmax"
    ... # Modify the attribute definition of cstSoftmax, etc
onnx.save(model, "./test_softmax_custom.onnx")
```

<!-- source: EN PDF p91; unit 960 -->

После создания модели откройте ее в Netron и проверьте соответствие оператора требованиям. Затем реализуйте класс, например для пользовательского Softmax:

<!-- source: EN PDF p91; unit 961 -->

```text
import numpy as np
from rknn.api.custom_op import get_node_attr
class cstSoftmax:
  op_type = 'cstSoftmax'
  def shape_infer(self, node, in_shapes, in_dtypes):
    out_shapes = in_shapes.copy()
    out_dtypes = in_dtypes.copy()
    return out_shapes, out_dtypes
  def compute(self, node, inputs):
    x = inputs[0]
    axis = get_node_attr(node, 'axis')
    x_max = np.max(x, axis=axis, keepdims=True)
    tmp = np.exp(x - x_max)
    s = np.sum(tmp, axis=axis, keepdims=True)
    outputs = [tmp / s]
    return outputs
```

<!-- source: EN PDF p91; unit 962 -->

Пользовательский оператор должен быть классом Python.

<!-- source: EN PDF p91; unit 963 -->

Класс должен содержать строковую переменную op\_type, совпадающую с именем типа оператора в ONNX.

<!-- source: EN PDF p91; unit 964 -->

Класс должен содержать shape\_infer(self, node, in\_shapes, in\_dtypes); имена функции и параметров должны точно совпадать, иначе возникнет ошибка. Функция выводит формы оператора. node — объект узла ONNX с атрибутами и сведениями о входах/выходах. in\_shapes — формы всех входов в формате [shape\_0, shape\_1, ...], каждая shape также является списком. in\_dtypes — типы всех входов в формате [dtype\_0, dtype\_1, ...], каждый dtype имеет тип numpy dtype. Функция возвращает формы и dtype всех выходов в тех же форматах, что in\_shapes и in\_dtypes.

<!-- source: EN PDF p91; unit 965 -->

Класс должен содержать compute(self, node, inputs); имена функции и параметров должны совпадать, иначе возникнет ошибка. Функция выполняет оператор. node — объект ONNX с атрибутами и сведениями о входах/выходах; inputs — данные входов в формате [array\_0, array\_1, ...], элементы — numpy ndarray. Возвращаются все выходные данные в том же формате, что inputs.

<!-- source: EN PDF p92; unit 966 -->

Для получения пользовательских атрибутов используйте `from rknn.api.custom_op import get_node_attr`.

<!-- source: EN PDF p92; unit 967 -->

Зарегистрируйте готовый класс через rknn.reg\_custom\_op(), затем вызовите rknn.build() для преобразования и создания RKNN. Класс обеспечивает функции преобразования и инференса модели. Пример с пользовательским Softmax:

<!-- source: EN PDF p92; unit 968 -->

```text
from rknn.api import RKNN
# Create RKNN object
rknn = RKNN(verbose=True)

# Pre-process config
print('--> Config model')
rknn.config(mean_values=[103.94, 116.78, 123.68], std_values=[58.82, 58.82, 58.82], quant_img_RGB2BGR=True,
target_platform='rk3566')
print('done')

print('--> Register cstSoftmax op')
ret = rknn.reg_custom_op(cstSoftmax())
if ret != 0:
  print('Register cstSoftmax op failed!')
  exit(ret)
print('done')

print('--> Loading model')
ret = rknn.load_onnx(model='mobilenet_v2.onnx')
if ret != 0:
  print('Load model failed!')
  exit(ret)
print('done')

# Build model
print('--> Building model')
ret = rknn.build(do_quantization=True, dataset='./dataset.txt')
if ret != 0:
  print('Build model failed!')
  exit(ret)
print('done')
```

<!-- source: EN PDF p92; unit 969 -->

rknn.reg\_custom\_op() вызывается между rknn.config() и rknn.load\_xxx().

<!-- source: EN PDF p92; unit 970 -->

#### 5\.5.4 Развертывание через C API

<!-- source: EN PDF p92; unit 971 -->

Получив модель с пользовательскими операторами, используйте C API для развертывания. Структуры и интерфейсы находятся в rknn\_custom\_op.h; подключите этот заголовок. Процесс показан ниже:

<!-- source: EN PDF p93; unit 972 -->

![Рисунок 5-13. Вызовы C API для регистрации пользовательских операторов](/docs/rockchip-rknn-sdk-user-guide/assets/en-p093-figure-01.png)

<!-- source: EN PDF p93; unit 973 -->

Рисунок 5-13. Вызовы C API для регистрации пользовательских операторов

<!-- source: EN PDF p94; unit 974 -->

##### 5\.5.4.1 Инициализация структуры пользовательского оператора

<!-- source: EN PDF p94; unit 975 -->

После создания контекста rknn создайте rknn\_custom\_op и задайте следующие сведения:

<!-- source: EN PDF p94; unit 976 -->

version: версия оператора.

<!-- source: EN PDF p94; unit 977 -->

target: исполнительная среда оператора; поддерживаются CPU и GPU.

<!-- source: EN PDF p94; unit 978 -->

op\_type: тип оператора, совпадающий с типом в модели ONNX.

<!-- source: EN PDF p94; unit 979 -->

cl\_kernel\_name: имя функции cl\_kernel кода OpenCL; обязательно при регистрации GPU-оператора.

<!-- source: EN PDF p94; unit 980 -->

cl\_kernel\_source: полный путь к .cl-файлу либо строка ядра OpenCL. При cl\_source\_size=0 это путь к .cl, при cl\_source\_size&gt;0 — строка кода OpenCL. Обязательно для GPU-оператора.

<!-- source: EN PDF p94; unit 981 -->

cl\_source\_size: размер cl\_kernel\_source. Специальное значение 0 означает, что cl\_kernel\_source является путем.

<!-- source: EN PDF p94; unit 982 -->

cl\_build\_options: строка параметров компиляции ядра OpenCL; обязательно для GPU-оператора.

<!-- source: EN PDF p94; unit 983 -->

init: необязательный callback, однократно вызываемый в rknn\_register\_custom\_ops.

<!-- source: EN PDF p94; unit 984 -->

prepare: необязательный callback предварительной обработки. Каждый rknn\_run выполняет сначала prepare, затем compute/compute\_native.

<!-- source: EN PDF p94; unit 985 -->

compute: обязательный вычислительный callback. Входы и выходы — NCHW float32; если вход/выход ONNX имеет тип int64, данные будут int64.

<!-- source: EN PDF p94; unit 986 -->

compute\_native: зарезервировано; установите NULL.

<!-- source: EN PDF p94; unit 987 -->

destroy: необязательный callback, выполняемый один раз в rknn\_destory; написание имени сохранено из оригинала.

<!-- source: EN PDF p94; unit 988 -->

Параметры callback-функций init/prepare/compute:

<!-- source: EN PDF p94; unit 989 -->

rknn\_custom\_op\_context\* op\_ctx: контекст callback-функции оператора.

<!-- source: EN PDF p94; unit 990 -->

rknn\_custom\_op\_tensor\* inputs: данные и сведения входных тензоров.

<!-- source: EN PDF p94; unit 991 -->

uint32\_t n\_inputs: число входов оператора.

<!-- source: EN PDF p94; unit 992 -->

rknn\_custom\_op\_tensor\* outputs: данные и сведения выходных тензоров.

<!-- source: EN PDF p94; unit 993 -->

uint32\_t n\_outputs: число выходов оператора.

<!-- source: EN PDF p94; unit 994 -->

destroy имеет только один параметр: rknn\_custom\_op\_context\* op\_ctx.

<!-- source: EN PDF p94; unit 995 -->

rknn\_custom\_op\_context

<!-- source: EN PDF p94; unit 996 -->

Содержит target (устройство исполнения), контекст GPU, частный контекст оператора и priv\_data. Разработчик управляет присваиванием, чтением, записью и уничтожением priv\_data. Контекст GPU содержит указатели cl\_context, cl\_command\_queue и cl\_kernel, из которых соответствующие объекты OpenCL получают приведением типов.

<!-- source: EN PDF p94; unit 997 -->

priv\_data — необязательный указатель. Обычно ресурс создают в init(), его адрес сохраняют в priv\_data, используют в prepare()/compute() и освобождают в destroy().

<!-- source: EN PDF p94; unit 998 -->

rknn\_custom\_op\_tensor

<!-- source: EN PDF p94; unit 999 -->

Описывает входной/выходной тензор: имя, форму, размер, параметры квантования, виртуальный базовый адрес, fd, смещение данных и другие сведения.

<!-- source: EN PDF p95; unit 1000 -->

В compute() не нужно выделять память входных и выходных тензоров: данные по виртуальному адресу уже подготовлены. Эффективный адрес тензора = виртуальный базовый адрес + смещение данных. virt\_addr члена mem — базовый адрес, offset члена mem — смещение в байтах. Во время callback адрес входа указывает на выход предыдущего оператора, а адрес выхода — на данные, которые получит следующий оператор.

<!-- source: EN PDF p95; unit 1001 -->

rknn\_custom\_op\_attr

<!-- source: EN PDF p95; unit 1002 -->

Для получения атрибутов вызовите rknn\_custom\_op\_get\_op\_attr() с полем атрибута. Результат представлен rknn\_custom\_op\_attr. Его void-буфер, dtype и число элементов описывают участок памяти. Приведением типа указателя в C/C++ согласно dtype можно получить массив нужного числового типа.

<!-- source: EN PDF p95; unit 1003 -->

###### 5\.5.4.1.1 Callback Init

<!-- source: EN PDF p95; unit 1004 -->

Используется для разбора сведений оператора либо инициализации временных и входных/выходных буферов, например выделения временной памяти. Пример init:

<!-- source: EN PDF p95; unit 1005 -->

Оператор CPU:

<!-- source: EN PDF p95; unit 1006 -->

```text
/**
* cpu kernel init callback for custom op
*/
int custom_op_init_callback(rknn_custom_op_context* op_ctx, rknn_custom_op_tensor* inputs, uint32_t n_inputs,
              rknn_custom_op_tensor* outputs, uint32_t n_outputs)
{
  printf("custom_op_init_callback\n");
  // create tmp buffer
  float* tmp_buffer = (float*)malloc(inputs[0].attr.n_elems * sizeof(float));
  op_ctx->priv_data = tmp_buffer;
  return 0;
}
```

<!-- source: EN PDF p95; unit 1007 -->

Оператор GPU:

<!-- source: EN PDF p95; unit 1008 -->

```text
/**
* opencl kernel init callback for custom op
* */
int relu_init_callback_gpu(rknn_custom_op_context* op_ctx, rknn_custom_op_tensor* inputs, uint32_t n_inputs,
             rknn_custom_op_tensor* outputs, uint32_t n_outputs)
{
  printf("relu_init_callback_gpu\n");
  // 获取opencl context
  cl_context cl_ctx = (cl_context)op_ctx->gpu_ctx.cl_context;

  // create tmp cl buffer
  cl_mem* memObject = (cl_mem*)malloc(sizeof(cl_mem) * 2);
  memObject[0] = clCreateBuffer(cl_ctx, CL_MEM_READ_WRITE, inputs[0].attr.size, NULL, NULL);
  memObject[1] = clCreateBuffer(cl_ctx, CL_MEM_READ_WRITE, outputs[0].attr.size, NULL, NULL);
  op_ctx->priv_data = memObject;
  return 0;
}
```

<!-- source: EN PDF p96; unit 1009 -->

###### 5\.5.4.1.2 Callback Prepare

<!-- source: EN PDF p96; unit 1010 -->

Этот callback вызывается для каждого кадра инференса; в оригинале также указано, что он пока зарезервирован для будущего использования.

<!-- source: EN PDF p96; unit 1011 -->

###### 5\.5.4.1.3 Callback Compute

<!-- source: EN PDF p96; unit 1012 -->

Это вычислительная функция пользовательского оператора. Разработчик должен реализовать обработку входов/выходов формата NCHW или UNDEFINED с типом float32.

<!-- source: EN PDF p96; unit 1013 -->

1\. Compute callback (CPU)

<!-- source: EN PDF p96; unit 1014 -->

Пример compute CPU-оператора для softmax:

<!-- source: EN PDF p96; unit 1015 -->

```text
/**
* float32 kernel implemetation sample for custom op
* */
int compute_custom_softmax_float32(rknn_custom_op_context* op_ctx, rknn_custom_op_tensor* inputs, uint32_t
n_inputs,
                 rknn_custom_op_tensor* outputs, uint32_t n_outputs)
{
  unsigned char* in_ptr = (unsigned char*)inputs[0].mem.virt_addr + inputs[0].mem.offset;
  unsigned char* out_ptr = (unsigned char*)outputs[0].mem.virt_addr + outputs[0].mem.offset;
  int axis = 0;
  const float* in_data = (const float*)in_ptr;
  float* out_data = (float*)out_ptr;
  std::string name = "";
  rknn_custom_op_attr op_name;
  rknn_custom_op_get_op_attr(op_ctx, "name", &op_name);
  if (op_name.n_elems > 0 && op_name.dtype == RKNN_TENSOR_UINT8) {
    name = (char*)op_name.data;
  }

  rknn_custom_op_attr op_attr;
  rknn_custom_op_get_op_attr(op_ctx, "axis", &op_attr);
  if (op_attr.n_elems == 1 && op_attr.dtype == RKNN_TENSOR_INT64) {
    axis = ((int64_t*)op_attr.data)[0];
  }

  printf("op name = %s, axis = %d\n", name.c_str(), axis);
  float* tmp_buffer = (float*)op_ctx->priv_data;
  // kernel implemetation for custom op
  {
    int inside = 1;
    int outside = 1;
    int channel = 1;

    while (axis < 0) {
      axis += inputs[0].attr.n_dims;
    }

    for (int i = 0; i < axis; i++) {
      outside *= inputs[0].attr.dims[i];
    }
    channel = inputs[0].attr.dims[axis];
    for (int i = axis; i < inputs[0].attr.n_dims; i++) {
      inside *= inputs[0].attr.dims[i];
    }
    for (int y = 0; y < outside; y++) {
      const float* src_y = in_data + y * inside;
      float* dst_y = out_data + y * inside;
      float max_data = -FLT_MAX;
      float sum_data = 0.0f;

      for (int i = 0; i < inside; ++i) {
        max_data = fmaxf(max_data, src_y[i]);
      }
      for (int i = 0; i < inside; ++i) {
        tmp_buffer[i] = expf(src_y[i] - max_data);
        sum_data += tmp_buffer[i];
      }
      for (int i = 0; i < inside; ++i) {
        dst_y[i] = tmp_buffer[i] / sum_data;
      }
    }
  }
  return 0;
}
```

<!-- source: EN PDF p97; unit 1017 -->

2\. Compute callback (GPU)

<!-- source: EN PDF p97; unit 1018 -->

Для GPU в callback выполняются следующие шаги:

<!-- source: EN PDF p97; unit 1019 -->

Получите cl\_context, cl\_command\_queue и cl\_kernel из gpu\_ctx в rknn\_custom\_op\_context с соответствующим приведением типов.

<!-- source: EN PDF p97; unit 1020 -->

При необходимости создайте cl\_mem-буфер входа или выхода оператора.

<!-- source: EN PDF p97; unit 1021 -->

Задайте аргументы функции cl\_kernel.

<!-- source: EN PDF p97; unit 1022 -->

Входной буфер ядра OpenCL поддерживает только float; другие типы не поддерживаются.

<!-- source: EN PDF p97; unit 1023 -->

При нулевом копировании clImportMemoryARM отображает память входного тензора в cl\_mem OpenCL. Вход уже содержит данные, повторное копирование не требуется. Это можно выполнить в init, сохранив cl\_mem в priv\_data, а затем извлечь и использовать priv\_data в compute.

<!-- source: EN PDF p97; unit 1024 -->

Выполните cl\_kernel в блокирующем режиме.

<!-- source: EN PDF p97; unit 1025 -->

Входные данные ядра CL имеют формат NCHW.

<!-- source: EN PDF p97; unit 1026 -->

Если после GPU данные читает CPU, перед чтением обновите кэш выходного тензора через rknn\_mem\_sync.

<!-- source: EN PDF p97; unit 1027 -->

Пример вычислительной функции GPU для пользовательского слоя relu:

<!-- source: EN PDF p97; unit 1028 -->

```text
/**
* opencl kernel init callback for custom op
* */
int compute_custom_relu_float32(rknn_custom_op_context* op_ctx, rknn_custom_op_tensor* inputs, uint32_t
num_inputs,
                rknn_custom_op_tensor* outputs, uint32_t num_outputs)
{
   std::string name = "";
   rknn_custom_op_attr op_name;
   rknn_custom_op_get_op_attr(op_ctx, "name", &op_name);
   if (op_name.n_elems > 0 && op_name.dtype == RKNN_TENSOR_UINT8) {
     name = (char*)op_name.data;
   }

   // // save input npy
   // char output_path[PATH_MAX];
   // sprintf(output_path, "%s/cpu_input%d.npy", ".", 0);
   // save_npy(output_path, (float*)in_data, &inputs[0].attr);

   // get context
   cl_context cl_ctx = (cl_context)op_ctx->gpu_ctx.cl_context;

   // get command queue
   cl_command_queue queue = (cl_command_queue)op_ctx->gpu_ctx.cl_command_queue;

   // get kernel
   cl_kernel kernel = (cl_kernel)op_ctx->gpu_ctx.cl_kernel;

   // import input/output buffer
   const cl_import_properties_arm props[3] = {
     CL_IMPORT_TYPE_ARM,
     CL_IMPORT_TYPE_DMA_BUF_ARM,
     0,
   };

   cl_int status;
   cl_mem inObject = clImportMemoryARM(cl_ctx, CL_MEM_READ_WRITE, props, &inputs[0].mem.fd,
                     inputs[0].mem.offset + inputs[0].mem.size, &status);
   if (status != CL_SUCCESS) {
     printf("Tensor: %s clImportMemoryARM failed\n", inputs[0].attr.name);
   }
   cl_mem outObject = clImportMemoryARM(cl_ctx, CL_MEM_READ_WRITE, props, &outputs[0].mem.fd,
                     outputs[0].mem.offset + outputs[0].mem.size, &status);
   if (status != CL_SUCCESS) {
     printf("Tensor: %s clImportMemoryARM failed\n", outputs[0].attr.name);
   }

   int in_type_bytes = get_type_bytes(inputs[0].attr.type);
   int out_type_bytes = get_type_bytes(outputs[0].attr.type);
   int in_offset = inputs[0].mem.offset / in_type_bytes;
   int out_offset = outputs[0].mem.offset / out_type_bytes;
   unsigned int elems = inputs[0].attr.n_elems;

   // set kernel args
   int argIndex = 0;
   clSetKernelArg(kernel, argIndex++, sizeof(cl_mem), &inObject);
   clSetKernelArg(kernel, argIndex++, sizeof(cl_mem), &outObject);
   clSetKernelArg(kernel, argIndex++, sizeof(int), &in_offset);
   clSetKernelArg(kernel, argIndex++, sizeof(int), &out_offset);
   clSetKernelArg(kernel, argIndex++, sizeof(unsigned int), &elems);

   // set global worksize
   const size_t global_work_size[3] = {elems, 1, 1};
  // enqueueNDRangeKernel
  clEnqueueNDRangeKernel(queue, kernel, 1, NULL, global_work_size, NULL, 0, NULL, NULL);

  // finish command queue
  clFinish(queue);

  // //cpu access data after sync to device
  // rknn_mem_sync(&outputs[0].mem, RKNN_MEMORY_SYNC_FROM_DEVICE);
  // // save output npy
  // char output_path[PATH_MAX];
  // sprintf(output_path, "%s/cpu_output%d.npy", ".", 0);
  // unsigned char* out_data = (unsigned char*)outputs[0].mem.virt_addr+outputs[0].mem.offset;
  // save_npy(output_path, (float*)out_data, &inputs[0].attr);
  return 0;
}
```

<!-- source: EN PDF p99; unit 1031 -->

###### 5\.5.4.1.4 Callback Destroy

<!-- source: EN PDF p99; unit 1032 -->

Освобождает временные либо входные/выходные буферы пользовательского оператора. Пример освобождения временного буфера:

<!-- source: EN PDF p99; unit 1033 -->

Оператор CPU

<!-- source: EN PDF p99; unit 1034 -->

```text
/**
* cpu kernel destroy callback for custom op
*/
int custom_op_destroy_callback(rknn_custom_op_context* op_ctx)
{
  printf("custom_op_destroy_callback\n");
  // clear tmp buffer
  free(op_ctx->priv_data);
  return 0;
}
```

<!-- source: EN PDF p99; unit 1035 -->

Оператор GPU

<!-- source: EN PDF p99; unit 1036 -->

```text
/**
* opencl kernel destroy callback for custom op
*/
int relu_destroy_callback_gpu(rknn_custom_op_context* op_ctx)
{
  // clear tmp buffer
  printf("relu_destroy_callback_gpu\n");
  cl_mem* memObject = (cl_mem*)op_ctx->priv_data;
  clReleaseMemObject(memObject[0]);
  clReleaseMemObject(memObject[1]);
  free(memObject);
  return 0;
}
```

<!-- source: EN PDF p100; unit 1037 -->

##### 5\.5.4.2 Регистрация пользовательского оператора

<!-- source: EN PDF p100; unit 1038 -->

После настройки rknn\_custom\_op зарегистрируйте его в rknn\_context через rknn\_register\_custom\_ops(). Можно одновременно зарегистрировать несколько операторов.

<!-- source: EN PDF p100; unit 1039 -->

После реализации compute CPU-оператора зарегистрируйте cstSoftmax и ArgMax, например:

<!-- source: EN PDF p100; unit 1040 -->

Оператор CPU

<!-- source: EN PDF p100; unit 1041 -->

```text
// CPU operators
rknn_custom_op user_op[2];
memset(user_op, 0, 2 * sizeof(rknn_custom_op));
strncpy(user_op[0].op_type, "cstSoftmax", RKNN_MAX_NAME_LEN - 1);
user_op[0].version = 1;
user_op[0].target = RKNN_TARGET_TYPE_CPU;
user_op[0].init = custom_op_init_callback;
user_op[0].compute = compute_custom_softmax_float32;
user_op[0].destroy = custom_op_destroy_callback;

strncpy(user_op[1].op_type, "ArgMax", RKNN_MAX_NAME_LEN - 1);
user_op[1].version = 1;
user_op[1].target = RKNN_TARGET_TYPE_CPU;
user_op[1].init = custom_op_init_callback;
user_op[1].compute = compute_custom_argmax_float32;
user_op[1].destroy = custom_op_destroy_callback;

ret = rknn_register_custom_ops(ctx, user_op, 2);
if (ret < 0) {
  printf("rknn_register_custom_ops fail! ret = %d\n", ret);
  return -1;
}
```

<!-- source: EN PDF p100; unit 1042 -->

Оператор GPU

<!-- source: EN PDF p100; unit 1043 -->

Ядро OpenCL GPU-оператора регистрируется строкой-константой или путем к файлу. При cl\_source\_size=0 в rknn\_custom\_op поле cl\_kernel\_source обозначает путь; при cl\_source\_size&gt;0 — строку функции ядра. Пример строки ядра relu:

<!-- source: EN PDF p100; unit 1044 -->

```text
char* cl_kernel_source = "#pragma OPENCL EXTENSION cl_arm_printf : enable"
  "#pragma OPENCL EXTENSION cl_khr_fp16 : enable "
  " __kernel void relu_float(__global const float* input, __global float* output, int "
  "in_offset, int out_offset, const unsigned int elems) "
  "{"
  " int gid = get_global_id(0);"
  " if (gid < elems) {"
  " float in_value = input[in_offset + gid];"
  " output[out_offset + gid] = in_value >= 0.f ? in_value : 0.f;"
  " }"
  "}"
  "__kernel void relu_half(__global const half* input, __global half* output, int in_offset, "
  "int out_offset, const unsigned int elems)"
  "{"
  " int gid = get_global_id(0);"
  " if (gid < elems) {"
  " half in_value = input[in_offset + gid];"
  " output[out_offset + gid] = in_value >= 0.f ? in_value : 0.f;"
  " }"
  "}";
```

<!-- source: EN PDF p101; unit 1046 -->

После реализации ядра OpenCL и GPU callback compute заполните массив rknn\_custom\_op и зарегистрируйте GPU-оператор. Пример:

<!-- source: EN PDF p101; unit 1047 -->

```text
// GPU operators
rknn_custom_op user_op[1];
memset(user_op, 0, sizeof(rknn_custom_op));
strncpy(user_op->op_type, "cstSoftmax", RKNN_MAX_NAME_LEN - 1);
user_op->version = 1;
user_op->target = RKNN_TARGET_TYPE_GPU;
user_op->init = relu_init_callback_gpu;
user_op->compute = compute_custom_relu_float32;
user_op->destroy = relu_destroy_callback_gpu;
#ifdef LOAD_FROM_PATH
user_op->cl_kernel_source = "./custom_op.cl";
user_op->cl_source_size = 0;
#else
user_op->cl_kernel_source = cl_kernel_source;
user_op->cl_source_size = strlen(cl_kernel_source);
#endif
strcpy(user_op->cl_kernel_name, "relu_float");

ret = rknn_register_custom_ops(ctx, user_op, 1);
if (ret < 0) {
  printf("rknn_register_custom_ops fail! ret = %d\n", ret);
  return -1;
}
```

<!-- source: EN PDF p101; unit 1048 -->

До регистрации четко определите op\_type, подготовьте сведения оператора и массив rknn\_custom\_op. Каждый тип регистрируется один раз; несколько операторов того же типа в сети не требуют повторной регистрации.

<!-- source: EN PDF p101; unit 1049 -->

##### 5\.5.4.3 Инференс модели

<!-- source: EN PDF p101; unit 1050 -->

После регистрации всех операторов выполните инференс через обычный API или API нулевого копирования.

<!-- source: EN PDF p101; unit 1051 -->

##### 5\.5.4.4 Анализ точности с подключенным устройством

<!-- source: EN PDF p101; unit 1052 -->

Для отладки пользовательских операторов с подключенной платой нужен rknn\_server версии &gt;= 1.6.0.

<!-- source: EN PDF p101; unit 1053 -->

При отладке rknn\_server через dlopen открывает скомпилированную пользователем библиотеку плагина из указанного каталога и получает сведения оператора. Для регистрации в библиотеке реализуйте get\_rknn\_custom\_op().

<!-- source: EN PDF p101; unit 1054 -->

Для анализа точности модели с такими операторами на подключенном устройстве:

<!-- source: EN PDF p101; unit 1055 -->

1\. Реализуйте get\_rknn\_custom\_op() и необходимые callback-функции, затем скомпилируйте библиотеку для системы. Имя должно начинаться с librkcst\_, например librkcst\_relu.so.

<!-- source: EN PDF p101; unit 1056 -->

2\. Поместите плагин в /vendor/lib64/ для Android arm64-v8a либо /usr/lib/rknpu/op\_plugins для Linux.

<!-- source: EN PDF p102; unit 1057 -->

3\. Выполните анализ точности с компьютера через Python-интерфейс RKNN-Toolkit2.

<!-- source: EN PDF p102; unit 1058 -->

Пример get\_rknn\_custom\_op:

<!-- source: EN PDF p102; unit 1059 -->

```text
/**
 * To obtain operator information to be registered, a plugin library must have one and only one of this function.
 */
RKNN_CUSTOM_OP_EXPORT rknn_custom_op* get_rknn_custom_op()
{
  // register a custom op
  memset(&user_op, 0, sizeof(rknn_custom_op));
  strncpy(user_op.op_type, "cstSoftmax", RKNN_MAX_NAME_LEN - 1);
  user_op.version = 1;
  user_op.target = RKNN_TARGET_TYPE_CPU;
  user_op.init = custom_op_init_callback;
  user_op.compute = compute_custom_softmax_float32;
  user_op.destroy = custom_op_destroy_callback;
  return &user_op;
}
```

<!-- source: EN PDF p102; unit 1060 -->

Для экспорта символа get\_rknn\_custom\_op добавьте функции атрибут RKNN\_CUSTOM\_OP\_EXPORT.

<!-- source: EN PDF p102; unit 1061 -->

rknn\_server вызывает dlopen для получения дескрипторов всех библиотек so в заданном каталоге, затем dlsym для указателя get\_rknn\_custom\_op. Вызов указателя возвращает структуру оператора. Пример:

<!-- source: EN PDF p102; unit 1062 -->

```text
std::vector<std::string> get_all_plugin_paths(std::string plugin_dir)
{
  std::vector<std::string> plugin_paths;
  if (access(plugin_dir.c_str(), 0) != 0) {
    fprintf(stderr, "Can not access plugin directory: %s, please check it!\n", plugin_dir.c_str());
  }

  DIR* dir;
  struct dirent* ent;
  const char* prefix = RKNN_CSTOP_PLUGIN_PREFIX; // All library file names should start with this prefix

  if ((dir = opendir(plugin_dir.c_str())) != NULL) {
    while ((ent = readdir(dir)) != NULL) {
      if (ent->d_type == DT_REG) {
        const char* filename = ent->d_name;
        size_t len = strlen(filename);

        if (len > 10 && strncmp(filename, prefix, strlen(prefix)) == 0) {
          printf("Found plugin: %s file in %s\n", filename, plugin_dir.c_str());
          plugin_paths.push_back(plugin_dir + "/" + filename);
        }
      }
    }
    closedir(dir);
  } else {
    fprintf(stderr, "Unable to open directory");
  }
  return plugin_paths;
}

// the default path of the custom operator plugin libraries
std::string plugin_dir =
#if defined(__ANDROID__)
# if defined(__aarch64__)
  "/vendor/lib64/";
# else
  "/vendor/lib/";
# endif // __aarch64__
#elif defined(__linux__)
  "/usr/lib/rknpu/op_plugins/";
#endif

std::vector<std::string> plugin_paths = get_all_plugin_paths(plugin_dir);
std::vector<void*> so_handles;
for (auto path : plugin_paths) {
  printf("load plugin %s\n", path.c_str());
  void* plugin_lib = dlopen(path.c_str(), RTLD_NOW);
  char* error = dlerror();
  if (error != NULL) {
    fprintf(stderr, "dlopen %s fail: %s.\nPlease try to set 'export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:%s'\n",
        path.c_str(), error, plugin_dir.c_str());
    dlclose(plugin_lib);
    return -1;
  }
  printf("dlopen %s successfully!\n", path.c_str());
  get_custom_op_func custom_op_func = (get_custom_op_func)dlsym(plugin_lib, "get_rknn_custom_op");
  error = dlerror();
  if (error != NULL) {
    fprintf(stderr, "dlsym fail: %s\n", error);
    dlclose(plugin_lib);
    return -1;
  }

  rknn_custom_op* user_op = custom_op_func();
  ret = rknn_register_custom_ops(ctx, user_op, 1);
  if (ret < 0) {
    printf("rknn_register_custom_ops fail! ret = %d\n", ret);
    return -1;
  }
  so_handles.push_back(plugin_lib);
}
```

<!-- source: EN PDF p103; unit 1064 -->

Замечания о библиотеке плагина:

<!-- source: EN PDF p103; unit 1065 -->

Одна библиотека плагина регистрирует только один пользовательский оператор. Для нескольких операторов создайте несколько библиотек.

<!-- source: EN PDF p103; unit 1066 -->

Имя библиотеки должно начинаться с librkcst\_ и заканчиваться .so.

<!-- source: EN PDF p103; unit 1067 -->

Для плагина на C++ добавьте следующие макросы до и после определения функции, чтобы C-интерфейс правильно открывал ее символы:

<!-- source: EN PDF p104; unit 1068 -->

```text
#ifdef __cplusplus
extern "C" {
#endif

//code

#ifdef __cplusplus
} // extern "C"
#endif
```

<!-- source: EN PDF p104; unit 1069 -->

Если dlopen не загружает библиотеку, проверьте LD\_LIBRARY\_PATH и наличие каталога плагина в указанном пути.

<!-- source: EN PDF p104; unit 1070 -->

### 5\.6 Работа с несколькими batch

<!-- source: EN PDF p104; unit 1071 -->

#### 5\.6.1 Принцип Multi-Batch

<!-- source: EN PDF p104; unit 1072 -->

NPU RK3588 содержит три ядра, RK3576 — два. Для эффективного пакетного инференса предусмотрен Multi-Batch. При включении внутренне вызывается rknn\_dup\_context: копируется только Internal, а Weight используется совместно. При rknn\_batch\_size=2 выполняется одно копирование, при rknn\_batch\_size &gt;=3 — два, поскольку одновременно работают только 3 ядра, а лишние копии расходовали бы память. core\_mask каждого контекста устанавливается в 0 для автоматического распределения по ядрам. rknn\_run() создает внутренний пул потоков; три потока одновременно выполняют три контекста.

<!-- source: EN PDF p104; unit 1073 -->

![Рисунок 5-14. Внутренний принцип Multi-Batch](/docs/rockchip-rknn-sdk-user-guide/assets/en-p104-figure-01.png)

<!-- source: EN PDF p104; unit 1074 -->

Рисунок 5-14. Внутренний принцип Multi-Batch

<!-- source: EN PDF p105; unit 1075 -->

#### 5\.6.2 Использование Multi-Batch

<!-- source: EN PDF p105; unit 1076 -->

Порядок использования Multi-Batch:

<!-- source: EN PDF p105; unit 1077 -->

1\. Включите Multi-Batch в Python:

<!-- source: EN PDF p105; unit 1078 -->

```text
ret = rknn.build(do_quantization=True, dataset='./dataset.txt', rknn_batch_size=3)
```

<!-- source: EN PDF p105; unit 1079 -->

Для оптимальной производительности rknn\_batch\_size рекомендуется кратным 3 на RK3588 и кратным 2 на RK3576.

<!-- source: EN PDF p105; unit 1080 -->

2\. Рекомендуется интерфейс нулевого копирования.

<!-- source: EN PDF p105; unit 1081 -->

#### 5\.6.3 Входы и выходы Multi-Batch

<!-- source: EN PDF p105; unit 1082 -->

При включенном Multi-Batch запрошенные размеры входа и выхода в rknn\_batch\_size раз больше, чем без него. Каждый контекст вычисляет свое входное смещение, читает данные и выполняет инференс, затем вычисляет выходное смещение и записывает результат. Например, для второго batch входное смещение равно input\_size/rknn\_batch\_size, выходное — output\_size/rknn\_batch\_size.

<!-- source: EN PDF p105; unit 1083 -->

![Рисунок 5-15. Внутренние смещения входа и выхода Multi-Batch](/docs/rockchip-rknn-sdk-user-guide/assets/en-p105-figure-01.png)

<!-- source: EN PDF p105; unit 1084 -->

Рисунок 5-15. Внутренние смещения входа и выхода Multi-Batch

<!-- source: EN PDF p106; unit 1085 -->

### 5\.7 SRAM NPU RK3588/RK3576

<!-- source: EN PDF p106; unit 1086 -->

RK3588 содержит 1MB SRAM, из которых 956KB доступны IP-блокам SoC и могут быть выделены RKNPU.

<!-- source: EN PDF p106; unit 1087 -->

RK3576 содержит 512KB SRAM, из которых 480KB доступны IP-блокам SoC и могут быть выделены RKNPU.

<!-- source: EN PDF p106; unit 1088 -->

SRAM снижает нагрузку RKNPU на пропускную способность DDR, но может влиять на время инференса.

<!-- source: EN PDF p106; unit 1089 -->

#### 5\.7.1 Требования к среде RKNPU

<!-- source: EN PDF p106; unit 1090 -->

##### 5\.7.1.1 Требования к ядру

<!-- source: EN PDF p106; unit 1091 -->

Версия драйвера RKNPU &gt;=0.8.0

<!-- source: EN PDF p106; unit 1092 -->

В конфигурации ядра включите CONFIG\_ROCKCHIP\_RKNPU\_SRAM=y.

<!-- source: EN PDF p106; unit 1093 -->

Путь конфигурации Android:

<!-- source: EN PDF p106; unit 1094 -->

```text
<path-to-your-kernel>/arch/arm64/configs/rockchip_defconfig
```

<!-- source: EN PDF p106; unit 1095 -->

Путь конфигурации Linux:

<!-- source: EN PDF p106; unit 1096 -->

```text
<path-to-your-kernel>/arch/arm64/configs/rockchip_linux_defconfig
```

<!-- source: EN PDF p106; unit 1097 -->

В соответствующем DTS ядра выделите системную SRAM для RKNPU.

<!-- source: EN PDF p106; unit 1098 -->

Выделите необходимый объем: максимум 956KB на RK3588 и 480KB на RK3576. Размер должен быть выровнен на 4K.

<!-- source: EN PDF p106; unit 1099 -->

Примечание: SRAM по умолчанию может быть выделена другим IP-блокам, например кодеку. Области разных блоков не должны перекрываться, иначе одновременное чтение и запись повредят данные.

<!-- source: EN PDF p106; unit 1100 -->

Пример выделения RKNPU 956KB на RK3588 и 480KB на RK3576:

<!-- source: EN PDF p106; unit 1101 -->

RK3588:

<!-- source: EN PDF p106; unit 1102 -->

```text
syssram: sram@ff001000 {
  compatible = "mmio-sram";
  reg = <0x0 0xff001000 0x0 0xef000>;

  #address-cells = <1>;
  #size-cells = <1>;
  ranges = <0x0 0x0 0xff001000 0xef000>;
  /* Allocate RKNPU SRAM /
  / start address and size should be 4k algin */
  rknpu_sram: rknpu_sram@0 {
    reg = <0x0 0xef000>; // 956KB
  };
};
```

<!-- source: EN PDF p106; unit 1103 -->

Подключите выделенную SRAM к узлу RKNPU, изменив dtsi:

<!-- source: EN PDF p107; unit 1104 -->

```text
<path-to-your-kernel>/arch/arm64/boot/dts/rockchip/rk3588s.dtsi
```

<!-- source: EN PDF p107; unit 1105 -->

```text
rknpu: npu@fdab0000 {
  compatible = "rockchip,rk3588-rknpu";
  /* ... /
  / Add reference RKNPU sram */
  rockchip,sram = <&rknpu_sram>;
  status = "disabled";
};
```

<!-- source: EN PDF p107; unit 1106 -->

RK3576:

<!-- source: EN PDF p107; unit 1107 -->

```text
sram: sram@3ff88000 {
  compatible = "mmio-sram";
  reg = <0x0 0x3ff88000 0x0 0x78000>;

  #address-cells = <1>;
  #size-cells = <1>;
  ranges = <0x0 0x0 0x3ff88000 0x78000>;
  /* Allocate RKNPU SRAM /
  / start address and size should be 4k algin */
  rknpu_sram: rknpu-sram@0 {
      reg = <0x0 0x78000>; // 480KB
  };
};
```

<!-- source: EN PDF p107; unit 1108 -->

Подключите выделенную SRAM к узлу RKNPU, изменив dtsi:

<!-- source: EN PDF p107; unit 1109 -->

```text
<path-to-your-kernel>/arch/arm64/boot/dts/rockchip/rk3576.dtsi
```

<!-- source: EN PDF p107; unit 1110 -->

```text
rknpu: npu@27700000 {
  compatible = "rockchip,rk3576-rknpu";
  /* ... /
  / Add reference RKNPU sram */
  rockchip,sram = <&rknpu_sram>;
  status = "disabled";
};
```

<!-- source: EN PDF p107; unit 1111 -->

##### 5\.7.1.2 Требования к версии RKNN SDK

<!-- source: EN PDF p107; unit 1112 -->

Версия RKNPU Runtime (librknnrt.so) &gt;=1.6.0

<!-- source: EN PDF p107; unit 1113 -->

#### 5\.7.2 Использование

<!-- source: EN PDF p107; unit 1114 -->

Задайте RKNN\_FLAG\_ENABLE\_SRAM в flags вызова rknn\_init(), чтобы включить SRAM для контекста.

<!-- source: EN PDF p107; unit 1115 -->

Например:

<!-- source: EN PDF p107; unit 1116 -->

```text
ret = rknn_init(&ctx, rknn_model, size, RKNN_FLAG_ENABLE_SRAM, NULL);
```

<!-- source: EN PDF p107; unit 1117 -->

При RKNN\_FLAG\_ENABLE\_SRAM из доступной системной SRAM выделяется максимально возможный объем для Internal Tensor модели.

<!-- source: EN PDF p108; unit 1118 -->

Примечание:

<!-- source: EN PDF p108; unit 1119 -->

Если участок SRAM занят одним контекстом rknn, другие контексты не могут повторно использовать его. RKNN\_FLAG\_SHARE\_SRAM в rknn\_api.h еще не реализован.

<!-- source: EN PDF p108; unit 1120 -->

Если контекст не занимает всю SRAM, остаток доступен другим контекстам rknn.

<!-- source: EN PDF p108; unit 1121 -->

#### 5\.7.3 Отладка

<!-- source: EN PDF p108; unit 1122 -->

##### 5\.7.3.1 Проверка включения SRAM

<!-- source: EN PDF p108; unit 1123 -->

Проверьте включение SRAM в загрузочном журнале ядра, где приведены диапазон адресов и размер SRAM для RKNPU:

<!-- source: EN PDF p108; unit 1124 -->

```text
rk3588_s:/ # dmesg | grep rknpu -i
RKNPU fdab0000.npu: RKNPU: sram region: [0x00000000ff001000, 0x00000000ff0f0000), sram size: 0xef000
```

<!-- source: EN PDF p108; unit 1125 -->

##### 5\.7.3.2 Запрос использования SRAM

<!-- source: EN PDF p108; unit 1126 -->

Использование SRAM можно запросить через узлы.

<!-- source: EN PDF p108; unit 1127 -->

Битовая карта неиспользованной SRAM; каждая точка соответствует 4K:

<!-- source: EN PDF p108; unit 1128 -->

```text
rk3588_s:/ # cat /sys/kernel/debug/rknpu/mm
SRAM bitmap: "*" - used, "." - free (1bit = 4KB)
[000] [................................]
[001] [................................]
[002] [................................]
[003] [................................]
[004] [................................]
[005] [................................]
[006] [................................]
[007] [...............]
SRAM total size: 978944, used: 0, free: 978944
# Unit is Byte
```

<!-- source: EN PDF p108; unit 1129 -->

Битовая карта после использования 512KB SRAM:

<!-- source: EN PDF p108; unit 1130 -->

```text
rk3588_s:/ # cat /sys/kernel/debug/rknpu/mm
SRAM bitmap: "*" - used, "." - free (1bit = 4KB)
[000] [********************************]
[001] [********************************]
[002] [********************************]
[003] [********************************]
[004] [................................]
[005] [................................]
[006] [................................]
[007] [...............]
SRAM total size: 978944, used: 524288, free: 454656
# Unit is Byte
```

<!-- source: EN PDF p109; unit 1131 -->

##### 5\.7.3.3 Запрос размера SRAM через RKNN API

<!-- source: EN PDF p109; unit 1132 -->

Запросите размер SRAM через RKNN\_QUERY\_MEM\_SIZE интерфейса rknn\_query().

<!-- source: EN PDF p109; unit 1133 -->

```text
typedef struct _rknn_mem_size {
  uint32_t total_weight_size;
  uint32_t total_internal_size;
  uint64_t total_dma_allocated_size;
  uint32_t total_sram_size;
  uint32_t free_sram_size;
  uint32_t reserved[10];
} rknn_mem_size;
```

<!-- source: EN PDF p109; unit 1134 -->

total\_sram\_size — общий объем SRAM, выделенный системой для RKNPU, в байтах.

<!-- source: EN PDF p109; unit 1135 -->

free\_sram\_size — оставшийся доступный объем SRAM для RKNPU, в байтах.

<!-- source: EN PDF p109; unit 1136 -->

##### 5\.7.3.4 Запрос занятой моделью SRAM

<!-- source: EN PDF p109; unit 1137 -->

До запуска приложения RKNN на устройстве задайте следующую переменную среды для вывода прогнозируемого использования SRAM:

<!-- source: EN PDF p109; unit 1138 -->

```text
export RKNN_LOG_LEVEL=3
```

<!-- source: EN PDF p109; unit 1139 -->

Послойное использование SRAM, выделенной для Internal, показано в журнале:

<!-- source: EN PDF p109; unit 1140 -->

```text
---------------------------------------------------------------------------
Total allocated Internal SRAM Size: 524288, Addr: [0xff3e0000, 0xff460000)
---------------------------------------------------------------------------
---------------------------------------------------------------------+----------------------------------+-----------
ID User Tensor DataType OrigShape NativeShape | [Start End) Size | SramHit
---------------------------------------------------------------------+----------------------------------+-----------
1 ConvRelu input0 INT8 (1,3,224,224) (1,1,224,224,3) | 0xff3b0000 0xff3d4c00 0x00024c00 | \
2 ConvRelu output2 INT8 (1,32,112,112) (1,2,112,112,16) | 0xff404c00 0xff466c00 0x00062000 |
0x0005b400
3 ConvRelu output4 INT8 (1,32,112,112) (1,4,112,112,16) | 0xff466c00 0xff52ac00 0x000c4000 |
0x00000000
4 ConvRelu output6 INT8 (1,64,112,112) (1,4,112,112,16) | 0xff52ac00*0xff5eec00 0x000c4000 |
0x00000000
5 ConvRelu output8 INT8 (1,64,56,56) (1,4,56,56,16) | 0xff3e0000 0xff411000 0x00031000 |
0x00031000
6 ConvRelu output10 INT8 (1,128,56,56) (1,8,56,56,16) | 0xff411000 0xff473000 0x00062000 |
0x0004f000
7 ConvRelu output12 INT8 (1,128,56,56) (1,8,56,56,16) | 0xff473000 0xff4d5000 0x00062000 |
0x00000000
8 ConvRelu output14 INT8 (1,128,56,56) (1,8,56,56,16) | 0xff3e0000 0xff442000 0x00062000 |
0x00062000
9 ConvRelu output16 INT8 (1,128,28,28) (1,8,28,28,16) | 0xff442000 0xff45a800 0x00018800 |
0x00018800
10 ConvRelu output18 INT8 (1,256,28,28) (1,16,28,28,16) | 0xff3e0000 0xff411000 0x00031000 |
0x00031000
11 ConvRelu output20 INT8 (1,256,28,28) (1,16,28,28,16) | 0xff411000 0xff442000 0x00031000 |
0x00031000
12 ConvRelu output22 INT8 (1,256,28,28) (1,16,28,28,16) | 0xff3e0000 0xff411000 0x00031000 |
0x00031000
13 ConvRelu output24 INT8 (1,256,14,14) (1,16,14,14,16) | 0xff411000 0xff41d400 0x0000c400 |
0x0000c400
14 ConvRelu output26 INT8 (1,512,14,14) (1,32,14,14,16) | 0xff3e0000 0xff3f8800 0x00018800 |
0x00018800
15 ConvRelu output28 INT8 (1,512,14,14) (1,32,14,14,16) | 0xff3f8800 0xff411000 0x00018800 |
0x00018800
16 ConvRelu output30 INT8 (1,512,14,14) (1,32,14,14,16) | 0xff3e0000 0xff3f8800 0x00018800 |
0x00018800
17 ConvRelu output32 INT8 (1,512,14,14) (1,32,14,14,16) | 0xff3f8800 0xff411000 0x00018800 |
0x00018800
18 ConvRelu output34 INT8 (1,512,14,14) (1,32,14,14,16) | 0xff3e0000 0xff3f8800 0x00018800 |
0x00018800
19 ConvRelu output36 INT8 (1,512,14,14) (1,32,14,14,16) | 0xff3f8800 0xff411000 0x00018800 |
0x00018800
20 ConvRelu output38 INT8 (1,512,14,14) (1,32,14,14,16) | 0xff3e0000 0xff3f8800 0x00018800 |
0x00018800
21 ConvRelu output40 INT8 (1,512,14,14) (1,32,14,14,16) | 0xff3f8800 0xff411000 0x00018800 |
0x00018800
22 ConvRelu output42 INT8 (1,512,14,14) (1,32,14,14,16) | 0xff3e0000 0xff3f8800 0x00018800 |
0x00018800
23 ConvRelu output44 INT8 (1,512,14,14) (1,32,14,14,16) | 0xff3f8800 0xff411000 0x00018800 |
0x00018800
24 ConvRelu output46 INT8 (1,512,14,14) (1,32,14,14,16) | 0xff3e0000 0xff3f8800 0x00018800 |
0x00018800
25 ConvRelu output48 INT8 (1,512,7,7) (1,33,7,7,16) | 0xff3f8800 0xff3ff000 0x00006800 | 0x00006800
26 ConvRelu output50 INT8 (1,1024,7,7) (1,67,7,7,16) | 0xff3e0000 0xff3ed000 0x0000d000 |
0x0000d000
27 ConvRelu output52 INT8 (1,1024,7,7) (1,67,7,7,16) | 0xff3ed000 0xff3fa000 0x0000d000 |
0x0000d000
28 AveragePool output54 INT8 (1,1024,7,7) (1,67,7,7,16) | 0xff3e0000 0xff3ed000 0x0000d000 |
0x0000d000
29 Conv output55 INT8 (1,1024,1,1) (1,64,1,1,16) | 0xff3ed000 0xff3ed400 0x00000400 | 0x00000400
30 Softmax output56 INT8 (1,1000,1,1) (1,64,1,1,16) | 0xff3e0000 0xff3e0400 0x00000400 |
0x00000400
31 OutputOperator output57 FLOAT (1,1000,1,1) (1,1000,1,1) | 0xff3ae000 0xff3aefa0 0x00000fa0 | \
---------------------------------------------------------------------+----------------------------------+-----------
----------------------------------------
Total Weight Memory Size: 4260864
Total Internal Memory Size: 2157568
Predict Internal Memory RW Amount: 11068320
Predict Weight Memory RW Amount: 4260832
Predict SRAM Hit RW Amount: 6688768
----------------------------------------
```

<!-- source: EN PDF p110; unit 1142 -->

SRAM Hit в таблице — объем SRAM тензора текущего слоя, то есть объем чтения/записи DDR, который экономится относительно режима без SRAM.

<!-- source: EN PDF p110; unit 1143 -->

Predict SRAM Hit RW Amount — прогноз чтения и записи SRAM всей модели, показывающий экономию чтения/записи DDR на кадр относительно режима без SRAM.

<!-- source: EN PDF p110; unit 1144 -->

Примечание: в Linux журнал направляется в терминал, в Android — в logcat.

<!-- source: EN PDF p111; unit 1145 -->

### 5\.8 Прореживание модели

<!-- source: EN PDF p111; unit 1146 -->

Прореживание бывает с потерями и без потерь. RKNN-Toolkit2 использует вариант без потерь: размер модели и объем вычислений уменьшаются без снижения точности с плавающей точкой. Точность квантованной модели может даже улучшиться.

<!-- source: EN PDF p111; unit 1147 -->

Без потерь прореживаются не все модели. Метод использует разреженность весов для удаления весов и каналов признаков, не влияющих на результат, уменьшая размер и вычисления. При model\_pruning=True в rknn.config() модель автоматически прореживается при преобразовании согласно разреженности весов.

<!-- source: EN PDF p111; unit 1148 -->

При успешном прореживании выводится результат:

<!-- source: EN PDF p111; unit 1149 -->

```text
I model_pruning results:

I Weight: -1.12145 MB (-6.9%)

I GFLOPs: -0.15563 (-13.4%)
```

<!-- source: EN PDF p111; unit 1150 -->

Здесь удалено 1.12145 MB весов, то есть 6.9%, а объем вычислений уменьшен на 0.15563 GFLOPs, то есть 13.4%.

<!-- source: EN PDF p111; unit 1151 -->

При недостаточной разреженности обработка не выполняется и сообщение не выводится. Поэтому эта настройка не мешает обычному преобразованию модели.

<!-- source: EN PDF p111; unit 1152 -->

### 5\.9 Шифрование модели

<!-- source: EN PDF p111; unit 1153 -->

Шифрование — дополнительная обработка после создания RKNN. Структуру модели, экспортированной rknn.export\_rknn(), можно просмотреть сторонними инструментами, например Netron. После шифрования Netron и подобные инструменты не смогут просматривать структуру и получать веса, что защищает модель. Зашифрованная модель используется так же, как незашифрованная; изменения инференса на RKNPU не нужны. Защита паролем в оригинале рассматривается как будущая возможность.

<!-- source: EN PDF p111; unit 1154 -->

Использование:

<!-- source: EN PDF p111; unit 1155 -->

```text
# Create RKNN object
rknn = RKNN()
# Export encrypted RKNN model
crypt_level= 1
ret = rknn.export_encrypted_rknn_model("input.rknn", "encrypt.rknn", crypt_level)
if ret != 0:
  print('Encrypt RKNN model failed!')
```

<!-- source: EN PDF p111; unit 1156 -->

crypt\_level задает уровень 1, 2 или 3; по умолчанию 1. Чем выше уровень, тем выше защищенность и больше время расшифровки, и наоборот.

<!-- source: EN PDF p111; unit 1157 -->

Поддерживаемые платформы: RK3562/RK3566/RK3568/RK3576/RK3588/RV1126B.

<!-- source: EN PDF p112; unit 1158 -->

### 5\.10 Согласованность кэшируемой памяти

<!-- source: EN PDF p112; unit 1159 -->

Если CPU и NPU обращаются к одной кэшируемой памяти, CPU сохраняет данные в кэше. Несогласованность данных DDR, читаемых NPU, с кэшем CPU вызывает ошибки чтения. Поэтому интерфейс обновления кэша должен обеспечивать согласованность данных CPU и NPU. Здесь описаны направление синхронизации и использование rknn\_mem\_sync.

<!-- source: EN PDF p112; unit 1160 -->

#### 5\.10.1 Направление синхронизации кэшируемой памяти

<!-- source: EN PDF p112; unit 1161 -->

После записи CPU перед доступом NPU данные кэша CPU должны быть синхронизированы в DDR: направление CPU→NPU. После записи NPU перед чтением CPU нужно обеспечить согласованность DDR и кэша CPU: направление NPU→CPU. RKNN C API предоставляет перечисление rknn\_mem\_sync\_mode для выбора направления. Структура:

<!-- source: EN PDF p112; unit 1162 -->

```text
/*
  The mode to sync cacheable rknn memory.
*/
typedef enum _rknn_mem_sync_mode {
RKNN_MEMORY_SYNC_TO_DEVICE = 0x1, /* the mode used for consistency of device access after CPU accesses
data. */
RKNN_MEMORY_SYNC_FROM_DEVICE = 0x2, /* the mode used for consistency of CPU access after device
accesses data. */
RKNN_MEMORY_SYNC_BIDIRECTIONAL =
  RKNN_MEMORY_SYNC_TO_DEVICE | RKNN_MEMORY_SYNC_FROM_DEVICE, /* the mode used for
consistency of data access
between device and CPU in both directions. */
} rknn_mem_sync_mode;
```

<!-- source: EN PDF p112; unit 1163 -->

RKNN\_MEMORY\_SYNC\_TO\_DEVICE: синхронизация от CPU к NPU.

<!-- source: EN PDF p112; unit 1164 -->

RKNN\_MEMORY\_SYNC\_FROM\_DEVICE: синхронизация от NPU к CPU.

<!-- source: EN PDF p112; unit 1165 -->

RKNN\_MEMORY\_SYNC\_BIDIRECTIONAL: двунаправленная синхронизация NPU и CPU. Используется, если направление данных неизвестно.

<!-- source: EN PDF p112; unit 1166 -->

Если направление известно, рекомендуется однонаправленное обновление кэша CPU, чтобы избежать потерь производительности от лишних операций.

<!-- source: EN PDF p112; unit 1167 -->

#### 5\.10.2 Синхронизация кэшируемой памяти

<!-- source: EN PDF p112; unit 1168 -->

Определив направление, синхронизируйте память через rknn\_mem\_sync. Форма интерфейса:

<!-- source: EN PDF p112; unit 1169 -->

```text
int rknn_mem_sync(rknn_context context, rknn_tensor_mem* mem, rknn_mem_sync_mode mode);
```

<!-- source: EN PDF p113; unit 1170 -->

Здесь context — контекст (на платформах, отличных от RV1103/RV1103B/RV1106/RV1106B, по умолчанию NULL), mem — указатель типа rknn\_tensor\_mem\*, возвращаемый rknn\_create\_mem, а mode задаёт направление синхронизации данных.

<!-- source: EN PDF p113; unit 1171 -->

### 5\.11 Разреженный инференс модели

<!-- source: EN PDF p113; unit 1172 -->

Эта функция автоматически разреживает веса модели Torch при обучении и использует RKNN для разреженного инференса, сокращая время выполнения. В настоящее время поддерживается только RK3576.

<!-- source: EN PDF p113; unit 1173 -->

#### 5\.11.1 Принцип разреживания

<!-- source: EN PDF p113; unit 1174 -->

При обучении выбранные веса обнуляются по заданному пользователем правилу. Предусмотрены разреживание 4:2 по входному направлению, 4:2 по выходному направлению, 16:4 по направлениям вход–выход и 16:4 по направлениям выход–вход. Принцип 4:2 по входному направлению показан на рисунке 5-16: из четырёх последовательных весов вдоль входного направления два обнуляются. Если размер по указанному направлению не кратен 4, выполняется дополнение. Для действия разреживания число каналов весов должно превышать 32.

<!-- source: EN PDF p113; unit 1175 -->

![Рисунок 5-16. Принцип разреживания 4:2 по входному направлению](/docs/rockchip-rknn-sdk-user-guide/assets/en-p113-figure-01.png)

<!-- source: EN PDF p113; unit 1176 -->

Рисунок 5-16. Принцип разреживания 4:2 по входному направлению

<!-- source: EN PDF p113; unit 1177 -->

Четыре типа разреживания весов описаны в таблице 5-10. Входное и выходное направления относятся к весам. Например, форма весов двумерной свёртки — C\_out × C\_in × K\_h × K\_w; входное направление — C\_in, выходное — C\_out. При разреженности 75% исходная предобученная модель может быть как плотной, так и разреженной. Для уменьшения потери точности рекомендуется использовать предобученную модель с разреживанием 4:2 по входному или выходному направлению.

<!-- source: EN PDF p113; unit 1178 -->

Таблица 5-10. Способы разреживания весов модели

<!-- source: EN PDF p113; unit 1179 -->

| Метод разреживания | Степень разреженности | Описание |
| --- | --- | --- |
| Разреживание 4:2 по входному направлению | 50% | Разреживание весов по входному направлению |
| Разреживание 4:2 по выходному направлению | 50% | Разреживание весов по выходному направлению |
| Разреживание 16:4 по входному, затем выходному направлению | 75% | Сначала разреживание 4:2 по входному, затем 4:2 по выходному направлению |
| Разреживание 16:4 по выходному, затем входному направлению | 75% | Сначала разреживание 4:2 по выходному, затем 4:2 по входному направлению |

<!-- source: EN PDF p114; unit 1181 -->

#### 5\.11.2 Обучение разреженной модели

<!-- source: EN PDF p114; unit 1182 -->

1\. Убедитесь, что cuda доступна, и установите пакет autosparsity.

<!-- source: EN PDF p114; unit 1183 -->

```text
pip install autosparsity-1.0-cp38-cp38m-linux_x86_64.whl
```

<!-- source: EN PDF p114; unit 1184 -->

Пакет установки autosparsity находится по адресу https://github.com/airockchip/rknn-toolkit2/tree/master/autosparsity/packages

<!-- source: EN PDF p114; unit 1185 -->

2\. Пример автоматического разреживания 4:2 по входному направлению для resnet50 из torchvision:

<!-- source: EN PDF p114; unit 1186 -->

```text
import torch
import torchvision.models as models
from autosparsity.sparsity import sparsity_model

if __name__ == "__main__":
  model = models.resnet50(pretrained=True).cuda()
  optimizer = None
  mode = 0
  sparsity_model(model, optimizer, mode)
  model.eval()
  x = torch.randn((1,3,224,224)).cuda()
  torch.onnx.export(
  model, x, 'resnet50.onnx', input_names=['inputs'], output_names=['outputs']
  )
```

<!-- source: EN PDF p114; unit 1187 -->

Для разреживания собственной модели достаточно добавить вызов sparsity\_model перед обучением. Пример:

<!-- source: EN PDF p114; unit 1188 -->

```text
# insert model autosparsity code before training
import torch
import torchvision.models as models
from autosparsity.sparsity import sparsity_model

...

model = models.resnet34(pretrained=True).cuda()
mode = 0
sparsity_model(model, optimizer, mode)

# normal training
x, y = DataLoader(args)
for epoch in range(epochs):
  y_pred = model(x)
  loss = loss_func(y_pred, y)
  loss.backward()
  optimizer.step()
  ...
```

<!-- source: EN PDF p115; unit 1190 -->

Примечание: обучение с разреживанием опирается на уже обученную исходную модель. Поэтому сначала обучите модель с хорошим результатом, а затем выполните разреженное обучение на её основе.

<!-- source: EN PDF p115; unit 1191 -->

Параметры функции sparsity\_model:

<!-- source: EN PDF p115; unit 1192 -->

Таблица 5-11. Параметры функции sparsity\_model

<!-- source: EN PDF p115; unit 1193 -->

| Параметры | Описание |
| --- | --- |
| model | Исходная обученная модель |
| optimizer | Исходный оптимизатор; по умолчанию None |
| mode | Метод разреживания; значения 0, 1, 2, 3, по умолчанию 0.<br>0: разреживание 4:2 по входному направлению (50%);<br>1: разреживание 4:2 по выходному направлению (50%);<br>2: разреживание 16:4 по входному, затем выходному направлению (75%);<br>3: разреживание 16:4 по выходному, затем входному направлению (75%). |
| verbose | Уровень журналирования: 0, 1, 2; по умолчанию 2.<br>0: ошибки;<br>1: ошибки и предупреждения;<br>2: ошибки, предупреждения и информация. |
| whitelist | Список модулей, поддерживающих разреживание: 1d conv, 2d conv, 3d conv, linear, MultiheadAttention. По умолчанию [torch.nn.Linear, torch.nn.Conv2d]. |
| allowed\_layer\_names | Имена слоёв, которым разрешено разреживание. Если пользователь задаёт параметр, разреживаются только разрешённые слои. По умолчанию None. |
| disallowed\_layer\_names | Имена слоёв, для которых разреживание запрещено. Указанные пользователем слои пропускаются. По умолчанию []. |
| fast | True включает быстрый метод вычисления маски; по умолчанию False. Стандартный метод расчёта маски может не работать для некоторых моделей; при ошибке разреживания попробуйте True. |

<!-- source: EN PDF p115; unit 1194 -->

#### 5\.11.3 Использование разреженного инференса RKNN

<!-- source: EN PDF p115; unit 1195 -->

Разреженный инференс включается параметром sparse\_infer интерфейса config() в RKNN-Toolkit2. Значения — True/False, по умолчанию False. Пример включения:

<!-- source: EN PDF p115; unit 1196 -->

```text
rknn.config(target_platform=’rk3576’, sparse_infer=True)
```

<!-- source: EN PDF p115; unit 1197 -->

Полный пример Python: https://github.com/airockchip/rknn-toolkit2/tree/master/autosparsity/examples

<!-- source: EN PDF p115; unit 1198 -->

Для развёртывания через C API сначала в RKNN-Toolkit2 задайте sparse\_infer=True в config() и создайте RKNN-модель с разреженным инференсом. Затем используйте обычную последовательность общего API или интерфейса нулевого копирования.

<!-- source: EN PDF p116; unit 1199 -->

При инференсе Python задайте verbose=True при создании объекта RKNN, чтобы вывести разреженность каждого слоя. При использовании C API установите переменную среды RKNN\_LOG\_LEVEL=4. Примеры журналов:

<!-- source: EN PDF p116; unit 1200 -->

![Рисунок 5-17. Журнал Python для разреживания 4:2 по входному направлению](/docs/rockchip-rknn-sdk-user-guide/assets/en-p116-figure-01.png)

| Log prefix | ID | OpType | DataType | Target | InputShape | OutputShape | Cycles(DDR/NPU/Total) | SparseRatio | RW(KB) | FullName |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| D RKNN: [14:58:09.324] | 0 | InputOperator | INT8 | CPU | \ | (1,3,224,224) | 0/0/0 | \ | 0 | InputOperator:inputs |
| D RKNN: [14:58:09.324] | 1 | ConvRelu | INT8 | NPU | (1,3,224,224),(64,3,7,7),(64) | (1,64,112,112) | 129458/1229312/1229312 | 0% | 159 | Conv:/conv1/Conv |
| D RKNN: [14:58:09.324] | 2 | MaxPool | INT8 | NPU | (1,64,112,112) | (1,64,56,56) | 134430/0/134430 | \ | 784 | MaxPool:/maxpool/MaxPool |
| D RKNN: [14:58:09.324] | 3 | ConvRelu | INT8 | NPU | (1,64,56,56),(64,32,1,1),(64) | (1,64,56,56) | 53807/25088/53807 | 50%(IC) | 196 | Conv:/layer1/layer1.0/conv1/Conv |
| D RKNN: [14:58:09.324] | 4 | ConvRelu | INT8 | NPU | (1,64,56,56),(64,32,3,3),(64) | (1,64,56,56) | 53532/112896/112896 | 50%(IC) | 194 | Conv:/layer1/layer1.0/conv2/Conv |
| D RKNN: [14:58:09.324] | 5 | Conv | INT8 | NPU | (1,64,56,56),(256,32,1,1),(256) | (1,256,56,56) | 134568/100352/134568 | 50%(IC) | 197 | Conv:/layer1/layer1.0/conv3/Conv |
| D RKNN: [14:58:09.324] | 6 | ConvAddRelu | INT8 | NPU | (1,64,56,56),(256,32,1,1),(256),... | (1,256,56,56) | 242112/100352/242112 | 50%(IC) | 981 | Conv:/layer1/layer1.0/downsample/downsample.0/Conv |
| D RKNN: [14:58:09.324] | 7 | ConvRelu | INT8 | NPU | (1,256,56,56),(64,128,1,1),(64) | (1,64,56,56) | 134362/50176/134362 | 50%(IC) | 783 | Conv:/layer1/layer1.1/conv1/Conv |
| D RKNN: [14:58:09.324] | 8 | ConvRelu | INT8 | NPU | (1,64,56,56),(64,32,3,3),(64) | (1,64,56,56) | 53532/112896/112896 | 50%(IC) | 194 | Conv:/layer1/layer1.1/conv2/Conv |
| D RKNN: [14:58:09.324] | 9 | ConvAddRelu | INT8 | NPU | (1,64,56,56),(256,32,1,1),(256),... | (1,256,56,56) | 242112/100352/242112 | 50%(IC) | 981 | Conv:/layer1/layer1.1/conv3/Conv |
| D RKNN: [14:58:09.324] | 10 | ConvRelu | INT8 | NPU | (1,256,56,56),(64,128,1,1),(64) | (1,64,56,56) | 134362/50176/134362 | 50%(IC) | 783 | Conv:/layer1/layer1.2/conv1/Conv |
| D RKNN: [14:58:09.324] | 11 | ConvRelu | INT8 | NPU | (1,64,56,56),(64,32,3,3),(64) | (1,64,56,56) | 53532/112896/112896 | 50%(IC) | 194 | Conv:/layer1/layer1.2/conv2/Conv |
| D RKNN: [14:58:09.324] | 12 | ConvAddRelu | INT8 | NPU | (1,64,56,56),(256,32,1,1),(256),... | (1,256,56,56) | 242112/100352/242112 | 50%(IC) | 981 | Conv:/layer1/layer1.2/conv3/Conv |
| D RKNN: [14:58:09.324] | 13 | ConvRelu | INT8 | NPU | (1,256,56,56),(128,128,1,1),(128) | (1,128,56,56) | 161179/100352/161179 | 50%(IC) | 783 | Conv:/layer2/layer2.0/conv1/Conv |
| D RKNN: [14:58:09.324] | 14 | ConvRelu | INT8 | NPU | (1,128,56,56),(128,64,3,3),(128) | (1,128,28,28) | 66118/112896/112896 | 50%(IC) | 384 | Conv:/layer2/layer2.0/conv2/Conv |
| D RKNN: [14:58:09.324] | 15 | Conv | INT8 | NPU | (1,128,28,28),(512,64,1,1),(512) | (1,512,28,28) | 67215/50176/67215 | 50%(IC) | 98 | Conv:/layer2/layer2.0/conv3/Conv |
| D RKNN: [14:58:09.324] | 16 | ConvAddRelu | INT8 | NPU | (1,256,56,56),(512,128,1,1),(512),... | (1,512,28,28) | 214540/100352/214540 | 50%(IC) | 1172 | Conv:/layer2/layer2.0/downsample/downsample.0/Conv |
| D RKNN: [14:58:09.324] | 17 | ConvRelu | INT8 | NPU | (1,512,28,28),(128,256,1,1),(128) | (1,128,28,28) | 66804/50176/66804 | 50%(IC) | 389 | Conv:/layer2/layer2.1/conv1/Conv |
| D RKNN: [14:58:09.324] | 18 | ConvRelu | INT8 | NPU | (1,128,28,28),(128,64,3,3),(128) | (1,128,28,28) | 25789/112896/112896 | 50%(IC) | 90 | Conv:/layer2/layer2.1/conv2/Conv |
| D RKNN: [14:58:09.324] | 19 | ConvAddRelu | INT8 | NPU | (1,128,28,28),(512,64,1,1),(512),... | (1,512,28,28) | 120988/50176/120988 | 50%(IC) | 490 | Conv:/layer2/layer2.1/conv3/Conv |
| D RKNN: [14:58:09.324] | 20 | ConvRelu | INT8 | NPU | (1,512,28,28),(128,256,1,1),(128) | (1,128,28,28) | 66804/50176/66804 | 50%(IC) | 389 | Conv:/layer2/layer2.2/conv1/Conv |
| D RKNN: [14:58:09.324] | 21 | ConvRelu | INT8 | NPU | (1,128,28,28),(128,64,3,3),(128) | (1,128,28,28) | 25789/112896/112896 | 50%(IC) | 90 | Conv:/layer2/layer2.2/conv2/Conv |
| D RKNN: [14:58:09.324] | 22 | ConvAddRelu | INT8 | NPU | (1,128,28,28),(512,64,1,1),(512),... | (1,512,28,28) | 120988/50176/120988 | 50%(IC) | 490 | Conv:/layer2/layer2.2/conv3/Conv |
| D RKNN: [14:58:09.324] | 23 | ConvRelu | INT8 | NPU | (1,512,28,28),(128,256,1,1),(128) | (1,128,28,28) | 66804/50176/66804 | 50%(IC) | 389 | Conv:/layer2/layer2.3/conv1/Conv |
| D RKNN: [14:58:09.324] | 24 | ConvRelu | INT8 | NPU | (1,128,28,28),(128,64,3,3),(128) | (1,128,28,28) | 25789/112896/112896 | 50%(IC) | 90 | Conv:/layer2/layer2.3/conv2/Conv |
| D RKNN: [14:58:09.324] | 25 | ConvAddRelu | INT8 | NPU | (1,128,28,28),(512,64,1,1),(512),... | (1,512,28,28) | 120988/50176/120988 | 50%(IC) | 490 | Conv:/layer2/layer2.3/conv3/Conv |
| D RKNN: [14:58:09.324] | 26 | ConvRelu | INT8 | NPU | (1,512,28,28),(256,256,1,1),(256) | (1,256,28,28) | 79835/100352/100352 | 50%(IC) | 386 | Conv:/layer3/layer3.0/conv1/Conv |
| D RKNN: [14:58:09.324] | 27 | ConvRelu | INT8 | NPU | (1,256,28,28),(256,256,3,3),(256) | (1,256,14,14) | 112894/119808/119808 | 0% | 774 | Conv:/layer3/layer3.0/conv2/Conv |

<!-- source: EN PDF p116; unit 1201 -->

Рисунок 5-17. Журнал Python для разреживания 4:2 по входному направлению

<!-- source: EN PDF p116; unit 1202 -->

![Рисунок 5-18. Журнал C API для разреживания 4:2 по входному направлению](/docs/rockchip-rknn-sdk-user-guide/assets/en-p116-figure-02.png)

| ID | OpType | DataType | Target | InputShape | OutputShape | Cycles(DDR/NPU/Total) | Time(us) | MacUsage(%) | WorkLoad(0/1) | SparseRatio | RW(KB) | FullName |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | InputOperator | UINT8 | CPU | \ | (1,3,224,224) | 0/0/0 | 6 | \ | 0\.0%/0.0% | \ | 0 | InputOperator:inputs |
| 2 | ConvRelu | INT8 | NPU | (1,3,224,224),(64,3,7,7),(64) | (1,64,112,112) | 70436/1229312/1229312 | 4281 | 9\.06/0.00 | 100\.0%/0.0% | 0% | 944 | Conv:/conv1/Conv |
| 3 | MaxPool | INT8 | NPU | (1,64,112,112) | (1,64,56,56) | 47923/0/47923 | 715 | \ | 100\.0%/0.0% | \ | 980 | MaxPool:/maxpool/MaxPool |
| 4 | ConvRelu | INT8 | NPU | (1,64,56,56),(64,32,1,1),(64) | (1,64,56,56) | 24118/25088/25088 | 164 | 12\.88/0.00 | 100\.0%/0.0% | 50%(IC) | 395 | Conv:/layer1/layer1.0/conv1/Conv |
| 5 | ConvRelu | INT8 | NPU | (1,64,56,56),(64,32,3,3),(64) | (1,64,56,56) | 24846/112896/112896 | 280 | 67\.88/0.00 | 100\.0%/0.0% | 50%(IC) | 413 | Conv:/layer1/layer1.0/conv2/Conv |
| 6 | Conv | INT8 | NPU | (1,64,56,56),(256,32,1,1),(256) | (1,256,56,56) | 72375/100352/100352 | 426 | 19\.83/0.00 | 100\.0%/0.0% | 50%(IC) | 992 | Conv:/layer1/layer1.0/conv3/Conv |
| 7 | ConvAddRelu | INT8 | NPU | (1,64,56,56),(256,32,1,1),(256),... | (1,256,56,56) | 104319/100352/104319 | 498 | 16\.96/0.00 | 100\.0%/0.0% | 50%(IC) | 1776 | Conv:/layer1/layer1.0/downsample/downsample.0/Conv |
| 8 | ConvRelu | INT8 | NPU | (1,256,56,56),(64,128,1,1),(64) | (1,64,56,56) | 48494/50176/50176 | 300 | 28\.16/0.00 | 100\.0%/0.0% | 50%(IC) | 994 | Conv:/layer1/layer1.1/conv1/Conv |
| 9 | ConvRelu | INT8 | NPU | (1,64,56,56),(64,32,3,3),(64) | (1,64,56,56) | 24903/112896/112896 | 279 | 68\.12/0.00 | 100\.0%/0.0% | 50%(IC) | 415 | Conv:/layer1/layer1.1/conv2/Conv |
| 10 | ConvAddRelu | INT8 | NPU | (1,64,56,56),(256,32,1,1),(256),... | (1,256,56,56) | 104336/100352/104336 | 492 | 17\.17/0.00 | 100\.0%/0.0% | 50%(IC) | 1776 | Conv:/layer1/layer1.1/conv3/Conv |
| 11 | ConvRelu | INT8 | NPU | (1,256,56,56),(64,128,1,1),(64) | (1,64,56,56) | 48522/50176/50176 | 297 | 28\.44/0.00 | 100\.0%/0.0% | 50%(IC) | 995 | Conv:/layer1/layer1.2/conv1/Conv |
| 12 | ConvRelu | INT8 | NPU | (1,64,56,56),(64,32,3,3),(64) | (1,64,56,56) | 24931/112896/112896 | 275 | 69\.11/0.00 | 100\.0%/0.0% | 50%(IC) | 415 | Conv:/layer1/layer1.2/conv2/Conv |
| 13 | ConvAddRelu | INT8 | NPU | (1,64,56,56),(256,32,1,1),(256),... | (1,256,56,56) | 104338/100352/104338 | 497 | 17\.00/0.00 | 100\.0%/0.0% | 50%(IC) | 1777 | Conv:/layer1/layer1.2/conv3/Conv |
| 14 | ConvRelu | INT8 | NPU | (1,256,56,56),(128,128,1,1),(128) | (1,128,56,56) | 64949/100352/100352 | 391 | 43\.21/0.00 | 100\.0%/0.0% | 50%(IC) | 1202 | Conv:/layer2/layer2.0/conv1/Conv |
| 15 | ConvRelu | INT8 | NPU | (1,128,56,56),(128,64,3,3),(128) | (1,128,28,28) | 31355/112896/112896 | 354 | 53\.69/0.00 | 100\.0%/0.0% | 50%(IC) | 671 | Conv:/layer2/layer2.0/conv2/Conv |
| 16 | Conv | INT8 | NPU | (1,128,28,28),(512,64,1,1),(512) | (1,512,28,28) | 37642/50176/50176 | 236 | 35\.79/0.00 | 100\.0%/0.0% | 50%(IC) | 531 | Conv:/layer2/layer2.0/conv3/Conv |
| 17 | ConvAddRelu | INT8 | NPU | (1,256,56,56),(512,128,1,1),(512),... | (1,512,28,28) | 81157/100352/100352 | 417 | 40\.51/0.00 | 100\.0%/0.0% | 50%(IC) | 1600 | Conv:/layer2/layer2.0/downsample/downsample.0/Conv |
| 18 | ConvRelu | INT8 | NPU | (1,512,28,28),(128,256,1,1),(128) | (1,128,28,28) | 25689/50176/50176 | 220 | 38\.40/0.00 | 100\.0%/0.0% | 50%(IC) | 532 | Conv:/layer2/layer2.1/conv1/Conv |
| 19 | ConvRelu | INT8 | NPU | (1,128,28,28),(128,64,3,3),(128) | (1,128,28,28) | 15434/112896/112896 | 267 | 71\.18/0.00 | 100\.0%/0.0% | 50%(IC) | 280 | Conv:/layer2/layer2.1/conv2/Conv |
| 20 | ConvAddRelu | INT8 | NPU | (1,128,28,28),(512,64,1,1),(512),... | (1,512,28,28) | 53704/50176/53704 | 268 | 31\.52/0.00 | 100\.0%/0.0% | 50%(IC) | 926 | Conv:/layer2/layer2.1/conv3/Conv |
| 21 | ConvRelu | INT8 | NPU | (1,512,28,28),(128,256,1,1),(128) | (1,128,28,28) | 25694/50176/50176 | 218 | 38\.75/0.00 | 100\.0%/0.0% | 50%(IC) | 532 | Conv:/layer2/layer2.2/conv1/Conv |
| 22 | ConvRelu | INT8 | NPU | (1,128,28,28),(128,64,3,3),(128) | (1,128,28,28) | 15508/112896/112896 | 267 | 71\.18/0.00 | 100\.0%/0.0% | 50%(IC) | 282 | Conv:/layer2/layer2.2/conv2/Conv |
| 23 | ConvAddRelu | INT8 | NPU | (1,128,28,28),(512,64,1,1),(512),... | (1,512,28,28) | 53765/50176/53765 | 270 | 31\.29/0.00 | 100\.0%/0.0% | 50%(IC) | 927 | Conv:/layer2/layer2.2/conv3/Conv |
| 24 | ConvRelu | INT8 | NPU | (1,512,28,28),(128,256,1,1),(128) | (1,128,28,28) | 25728/50176/50176 | 217 | 38\.93/0.00 | 100\.0%/0.0% | 50%(IC) | 533 | Conv:/layer2/layer2.3/conv1/Conv |
| 25 | ConvRelu | INT8 | NPU | (1,128,28,28),(128,64,3,3),(128) | (1,128,28,28) | 15655/112896/112896 | 267 | 71\.18/0.00 | 100\.0%/0.0% | 50%(IC) | 286 | Conv:/layer2/layer2.3/conv2/Conv |
| 26 | ConvAddRelu | INT8 | NPU | (1,128,28,28),(512,64,1,1),(512),... | (1,512,28,28) | 53772/50176/53772 | 273 | 30\.94/0.00 | 100\.0%/0.0% | 50%(IC) | 927 | Conv:/layer2/layer2.3/conv3/Conv |
| 27 | ConvRelu | INT8 | NPU | (1,512,28,28),(256,256,1,1),(256) | (1,256,28,28) | 35358/100352/100352 | 316 | 53\.46/0.00 | 100\.0%/0.0% | 50%(IC) | 671 | Conv:/layer3/layer3.0/conv1/Conv |
| 28 | ConvRelu | INT8 | NPU | (1,256,28,28),(256,256,3,3),(256) | (1,256,14,14) | 35572/119808/119808 | 531 | 71\.59/0.00 | 100\.0%/0.0% | 0% | 824 | Conv:/layer3/layer3.0/conv2/Conv |

<!-- source: EN PDF p116; unit 1203 -->

Рисунок 5-18. Журнал C API для разреживания 4:2 по входному направлению

<!-- source: EN PDF p116; unit 1204 -->

Поле SparseRation обозначает степень разреженности: 4:2 по входному направлению соответствует 50%(IC), 4:2 по выходному — 50%(OC), оба варианта 16:4 (вход–выход и выход–вход) — 75%. Значение 0% означает отсутствие разреживания. Написание SparseRation сохранено из оригинала.

<!-- source: EN PDF p116; unit 1205 -->

#### 5\.11.4 Ограничения разреженного инференса RKNN

<!-- source: EN PDF p116; unit 1206 -->

Разреженный инференс реализован аппаратной архитектурой NPU. Из-за аппаратных ограничений RK3576 сейчас поддерживает только 2d Conv с group=1. Остальные ограничения приведены ниже.

<!-- source: EN PDF p116; unit 1207 -->

Таблица 5-12. Ограничения разреженного инференса RK3576

<!-- source: EN PDF p116; unit 1208 -->

|  | Число каналов | Тип данных |
| --- | --- | --- |
| Разреживание 4:2 по входному направлению | Вход и выход выровнены по 32 | Int8; Float16 не поддерживается |
| Разреживание 4:2 по выходному направлению | Вход и выход выровнены по 32 | Int8; Float16 не поддерживается |
| Разреживание 16:4 по входному, затем выходному направлению | Вход и выход выровнены по 32 | Int8; Float16 не поддерживается |
| Разреживание 16:4 по выходному, затем входному направлению | Вход и выход выровнены по 32 | Int8; Float16 не поддерживается |

<!-- source: EN PDF p117; unit 1209 -->

### 5\.12 Codegen

<!-- source: EN PDF p117; unit 1210 -->

В RKNN-Toolkit2 2.0.0 добавлен интерфейс Codegen для генерации кода развёртывания модели и упрощения начала работы. Он построен поверх CAPI с нулевым копированием; стиль интерфейса соответствует примерам RKNN\_Model\_Zoo. Сгенерированный код позволяет непосредственно измерять производительность и проверять точность инференса, а также служит основой для собственной разработки.

<!-- source: EN PDF p117; unit 1211 -->

Пример использования:

<!-- source: EN PDF p117; unit 1212 -->

```text
ret = rknn.codegen(output_path='./rknn_app_demo',
          inputs=['../../caffe/mobilenet_v2/dog_224x224.jpg'], overwrite=True)
```

<!-- source: EN PDF p117; unit 1213 -->

Перед codegen необходимо вызвать rknn.export для сохранения RKNN-модели. Имя rknn.export сохранено из текста оригинала.

<!-- source: EN PDF p117; unit 1214 -->

output\_path задаёт каталог вывода; его имя выбирает пользователь.

<!-- source: EN PDF p117; unit 1215 -->

Inputs содержит список путей входных данных модели и может быть пустым. Поддерживаются jpg/png/npy. Для npy размерности данных должны соответствовать размерностям входа модели.

<!-- source: EN PDF p117; unit 1216 -->

При overwrite=True файлы в каталоге output\_path перезаписываются. Значение по умолчанию — False.

<!-- source: EN PDF p117; unit 1217 -->

Для компиляции и тестирования сгенерированного кода следуйте README.md в созданном каталоге.

<!-- source: EN PDF p117; unit 1218 -->

Если inputs содержит допустимые данные, пример после инференса оценивает различия результатов CAPI и симулятора RKNN-Toolkit2, сравнивая косинусное сходство каждого выхода.

<!-- source: EN PDF p117; unit 1219 -->

Ограничений по аппаратной платформе NPU нет; на плате требуется Linux или Android.

<!-- source: EN PDF p117; unit 1220 -->

Поддерживаются квантованные и неквантованные модели.

<!-- source: EN PDF p117; unit 1221 -->

### 5\.13 Редактирование ONNX

<!-- source: EN PDF p117; unit 1222 -->

После преобразования некоторых моделей в RKNN могут оставаться лишние операции, обычно reshape и transpose у входов и выходов, снижающие производительность. Интерфейс onnx\_edit в RKNN-Toolkit2 изменяет определения входных и выходных размерностей ONNX-модели, чтобы при последующем преобразовании получить более производительную RKNN-модель с меньшим числом лишних reshape и transpose.

<!-- source: EN PDF p117; unit 1223 -->

#### 5\.13.1 Описание интерфейса

<!-- source: EN PDF p117; unit 1224 -->

Пример использования:

<!-- source: EN PDF p117; unit 1225 -->

```text
from rknn.utils import onnx_edit
ret = onnx_edit(model = './concat_block.onnx',
  export_path = './concat_block_edited.onnx',
  inputs_transform = {'k_in': 'a,b,c,d->1,ad,b,c'},
  outputs_transform = {'k_cache': 'a,b,c,d->1,ab,c,d'},
  dataset = './dataset.txt'
)
```

<!-- source: EN PDF p117; unit 1226 -->

Model задаёт изменяемую модель; обязательный параметр.

<!-- source: EN PDF p117; unit 1227 -->

Export\_path задаёт путь создаваемой модели; обязательный параметр.

<!-- source: EN PDF p118; unit 1228 -->

Inputs\_transform — словарь формул преобразования входов: ключ — имя узла, значение — формула. Необязательный параметр, по умолчанию пустой словарь.

<!-- source: EN PDF p118; unit 1229 -->

Outputs\_transform — словарь формул преобразования выходов. Необязательный параметр, по умолчанию пустой словарь.

<!-- source: EN PDF p118; unit 1230 -->

Dataset задаёт файл со списком путей входных данных, в том же формате, что dataset у rknn.build. Если он указан, onnx\_edit изменяет не только определения входов и выходов, но и соответствующие данные набора, создавая новый набор на одном уровне каталога с export\_path. Его можно использовать для проверки и квантования новой модели. Параметр необязателен, по умолчанию пуст.

<!-- source: EN PDF p118; unit 1231 -->

#### 5\.13.2 Формулы преобразования

<!-- source: EN PDF p118; unit 1232 -->

В inputs\_transform и outputs\_transform интерфейса onnx\_edit задаются формулы, по синтаксису похожие на оператор einsum. Например, 'a,b,c,d-&gt;1,ad,b,c' преобразует исходные размерности 'a,b,c,d' в '1,ad,b,c'. Правила записи:

<!-- source: EN PDF p118; unit 1233 -->

Формула состоит из двух частей, разделённых '-&gt;': слева исходная символьная форма, справа преобразованная.

<!-- source: EN PDF p118; unit 1234 -->

Допустимы только символы [a-z], ',' и '1'. Другие цифры не поддерживаются, поскольку одинаковые числовые символы не позволяют определить контекст transpose.

<!-- source: EN PDF p118; unit 1235 -->

Символы [a-z] независимы и не имеют порядка: 'a,b-&gt;b,a' и 'c,a-&gt;a,c' обозначают одно преобразование.

<!-- source: EN PDF p118; unit 1236 -->

Исходная форма слева разделяется запятыми на n частей; n должно соответствовать числу измерений модели. Для входа [32,4,1,64] допустимы 'a,b,c,d' или 'a,b,1,d'.

<!-- source: EN PDF p118; unit 1237 -->

Каждый исходный символ, кроме '1', должен присутствовать в преобразованной форме. Например, 'a,1,c,d-&gt;ac,d,1' допустимо, а 'a,1,c,d-&gt;ac,1' — нет: отсутствует 'd'.

<!-- source: EN PDF p118; unit 1238 -->

В преобразованную форму можно вставить любое число '1' для добавления измерений, например 'a,b,c-&gt; a,1,cb,1,1'.

<!-- source: EN PDF p118; unit 1239 -->

Для разбиения измерения исходная форма допускает несколько букв и присваивания. Например, при входе [32,4,1,64] формула 'ab,c,d,qk[a=2,k =8]-&gt;aq,cd,1,kb' разбивает 32 на 2x16 и 64 на 8x8, затем выполняет transpose и reshape. Часть '[ ]' содержит присваивания, разделённые запятыми. Некоторые значения можно не задавать: они выводятся автоматически. Если a=2 и из модели известно ab=32, выводится b=16. Недопустимая полученная размерность вызывает ошибку: при ab=32 и a=5 получается b=6.4, но размерность должна быть целым числом.

<!-- source: EN PDF p118; unit 1240 -->

#### 5\.13.3 Примеры формул преобразования

<!-- source: EN PDF p118; unit 1241 -->

Преобразование 3-мерного входа в 4-мерный: 'a,b,c-&gt;a,b,1,c'

<!-- source: EN PDF p118; unit 1242 -->

Преобразование 5-мерного входа в 4-мерный: 'a,b,c,d,e-&gt;ab,c,d,e'

<!-- source: EN PDF p118; unit 1243 -->

Операция transpose(0,3,1,2): 'a,b,c,d-&gt;a,d,b,c'

<!-- source: EN PDF p118; unit 1244 -->

Перестановка и объединение измерений: 'a,b,c,d-&gt;d,acb,1'

<!-- source: EN PDF p118; unit 1245 -->

Разбиение, перестановка и объединение измерений: 'a,bc,de,f[b=2,d=4]-&gt;ab,fe,dc,1'

<!-- source: EN PDF p119; unit 1246 -->

## 6 Введение в квантование

<!-- source: EN PDF p119; unit 1247 -->

### 6\.1 Основы квантования

<!-- source: EN PDF p119; unit 1248 -->

#### 6\.1.1 Определение квантования

<!-- source: EN PDF p119; unit 1249 -->

Квантование модели — преобразование параметров и операций модели глубокого обучения с плавающей точкой в представление с фиксированной точкой, например из FLOAT32 в INT8. Оно уменьшает потребление памяти, сжимает модель и ускоряет инференс, но может приводить к некоторой потере точности.

<!-- source: EN PDF p119; unit 1250 -->

#### 6\.1.2 Принцип вычислений при квантовании

<!-- source: EN PDF p119; unit 1251 -->

На примере линейного асимметричного квантования преобразование чисел с плавающей точкой в знаковые числа с фиксированной точкой рассчитывается следующим образом:

![Формула (6-1)](/docs/rockchip-rknn-sdk-user-guide/assets/en-p119-equation-01.png)

```text
x_int = clamp(round(x / s) + z; -2^(b-1), 2^(b-1) - 1)
```

<!-- source: EN PDF p119; unit 1252 -->

Здесь x — число с плавающей точкой, x\_int — квантованное число с фиксированной точкой, round(·) — округление, s — масштаб квантования, z — нулевая точка, b — разрядность квантования, например 8 для INT8. clamp — операция ограничения диапазона, определяемая следующим образом:

![Формула (6-2)](/docs/rockchip-rknn-sdk-user-guide/assets/en-p119-equation-02.png)

```text
clamp(x; a, c) = a, if x < a
                 x, if a <= x <= c
                 c, if x > c
```

<!-- source: EN PDF p119; unit 1253 -->

Преобразование чисел с фиксированной точкой в числа с плавающей точкой называется деквантованием и определяется следующим образом:

![Формула (6-3)](/docs/rockchip-rknn-sdk-user-guide/assets/en-p119-equation-03.png)

```text
x ≈ x_hat = s (x_int - z)
```

<!-- source: EN PDF p119; unit 1254 -->

Для заданного диапазона квантования (q\_min) и диапазона ограничения (c\_min) параметры s и z рассчитываются по следующим формулам:

![Формула (6-4)](/docs/rockchip-rknn-sdk-user-guide/assets/en-p119-equation-04.png)

```text
s = (q_max - q_min) / (c_max - c_min) = (q_max - q_min) / (2^b - 1)
```

![Формула (6-5)](/docs/rockchip-rknn-sdk-user-guide/assets/en-p119-equation-05.png)

```text
z = c_max - round(q_max / s) OR z = c_min - round(q_min / s)
```

<!-- source: EN PDF p119; unit 1256 -->

Диапазон ограничения определяется типом данных квантования: например, для INT8 он составляет (-128, 127). Диапазон квантования определяется выбранным алгоритмом; подробности см. в разделе 6.1.6 «Алгоритмы квантования».

<!-- source: EN PDF p119; unit 1257 -->

#### 6\.1.3 Ошибка квантования

<!-- source: EN PDF p119; unit 1258 -->

Квантование вносит определённую потерю точности. Согласно (6-1), ошибка состоит из ошибки округления и ошибки ограничения, то есть операций round(·) и clamp. Ошибка округления лежит в диапазоне (−s/2, s/2). Если число x слишком велико, а масштаб s слишком мал, квантованное число может выйти за диапазон ограничения, вызывая ошибку ограничения. Теоретически увеличение s уменьшает ошибку ограничения, но увеличивает ошибку округления. Поэтому для баланса этих ошибок нужно выбирать подходящие масштаб и нулевую точку, минимизирующие ошибку квантования.

<!-- source: EN PDF p120; unit 1259 -->

#### 6\.1.4 Линейное симметричное и линейное асимметричное квантование

<!-- source: EN PDF p120; unit 1260 -->

При линейном квантовании интервалы между числами с фиксированной точкой одинаковы. Например, линейное квантование INT8 равномерно делит диапазон на 256 чисел. При симметричном квантовании нулевая точка определяется типом данных и находится в центре симметрии диапазона квантованных чисел; например, для INT8 она равна 0. При асимметричном квантовании нулевая точка вычисляется по (6-5) и обычно не совпадает с центром симметрии диапазона.

<!-- source: EN PDF p120; unit 1261 -->

Симметричное квантование — упрощённый вариант асимметричного. Теоретически асимметричное квантование лучше обрабатывает неравномерные распределения данных, поэтому на практике оно широко применяется.

<!-- source: EN PDF p120; unit 1262 -->

![Рисунок 6-1 Линейное симметричное и асимметричное квантование](/docs/rockchip-rknn-sdk-user-guide/assets/en-p120-figure-01.png)

<!-- source: EN PDF p120; unit 1263 -->

Рисунок 6-1 Линейное симметричное и асимметричное квантование

<!-- source: EN PDF p120; unit 1264 -->

#### 6\.1.5 Послойное и поканальное квантование

<!-- source: EN PDF p120; unit 1265 -->

Послойное квантование (Per-Layer) рассматривает все каналы слоя как одно целое с общими параметрами квантования. Поканальное квантование (Per-Channel) независимо квантует каждый канал слоя, используя его собственные параметры. Оно лучше сохраняет информацию каждого канала, учитывает различия каналов и даёт лучшие результаты квантования.

<!-- source: EN PDF p120; unit 1266 -->

![Рисунок 6-2 Послойное и поканальное квантование](/docs/rockchip-rknn-sdk-user-guide/assets/en-p120-figure-02.png)

<!-- source: EN PDF p120; unit 1267 -->

Рисунок 6-2 Послойное и поканальное квантование

<!-- source: EN PDF p120; unit 1268 -->

Примечание: в RKNN-Toolkit2 поканальное квантование применяется только к весам; активации и промежуточные значения по-прежнему квантуются послойно.

<!-- source: EN PDF p120; unit 1269 -->

#### 6\.1.6 Алгоритмы квантования

<!-- source: EN PDF p120; unit 1270 -->

Масштаб и нулевая точка — ключевые параметры ошибки квантования; вычисление диапазона играет решающую роль в их определении. Здесь рассматриваются три алгоритма определения диапазона: Normal, KL-Divergence и MMSE.

<!-- source: EN PDF p121; unit 1271 -->

Normal непосредственно задаёт границы диапазона по максимальному и минимальному значениям чисел с плавающей точкой. Из принципа в разделе 6.1.2 следует, что Normal не вносит ошибки ограничения, но чувствителен к выбросам: большие выбросы могут вызвать существенную ошибку округления.

![Формула (6-6)](/docs/rockchip-rknn-sdk-user-guide/assets/en-p121-equation-06.png)

```text
q_min = min V
```

![Формула (6-7)](/docs/rockchip-rknn-sdk-user-guide/assets/en-p121-equation-07.png)

```text
q_max = max V
```

<!-- source: EN PDF p121; unit 1272 -->

Здесь V — тензор чисел с плавающей точкой.

<!-- source: EN PDF p121; unit 1273 -->

KL-Divergence вычисляет распределения чисел с плавающей и фиксированной точкой, изменяет их различными порогами и выбирает границы диапазона, минимизируя KL-дивергенцию для максимального сходства распределений. Минимизация различия распределений позволяет лучше учитывать неравномерные данные и ослабляет влияние немногочисленных выбросов.

![Формула (6-8)](/docs/rockchip-rknn-sdk-user-guide/assets/en-p121-equation-08.png)

```text
arg min_(q_min,q_max) H(Ψ(V), Ψ(V_int))
```

<!-- source: EN PDF p121; unit 1274 -->

Здесь H(·) — формула KL-дивергенции, Ψ(·) — функция, преобразующая данные в дискретное распределение, а V\_int — тензор квантованных чисел с фиксированной точкой.

<!-- source: EN PDF p121; unit 1275 -->

MMSE (Minimum Mean Square Error) определяет границы диапазона, минимизируя среднеквадратичную ошибку между исходными числами с плавающей точкой и результатом их квантования с последующим деквантованием. Он частично уменьшает потерю точности от больших выбросов. Приближённое решение ищется переборным итерационным методом, поэтому алгоритм медленнее и требует больше памяти. Однако точность обычно выше, чем у Normal.

![Формула (6-9)](/docs/rockchip-rknn-sdk-user-guide/assets/en-p121-equation-09.png)

```text
arg min_(q_min,q_max) ||V - V_hat(q_min, q_max)||_F^2
```

<!-- source: EN PDF p121; unit 1276 -->

Здесь V̂(q\_min, q\_max) — результат квантования и деквантования, а ‖·‖\_F — норма Фробениуса.

<!-- source: EN PDF p121; unit 1277 -->

### 6\.2 Настройка квантования

<!-- source: EN PDF p121; unit 1278 -->

#### 6\.2.1 Типы данных квантования

<!-- source: EN PDF p121; unit 1279 -->

RKNN-Toolkit2 поддерживает INT8 как тип данных квантования.

<!-- source: EN PDF p121; unit 1280 -->

#### 6\.2.2 Рекомендации по алгоритмам квантования

<!-- source: EN PDF p121; unit 1281 -->

Normal работает быстро и подходит для общих сценариев.

<!-- source: EN PDF p121; unit 1282 -->

KL-Divergence немного медленнее Normal. Он повышает точность для моделей с неравномерными распределениями и может уменьшить потерю точности от немногочисленных выбросов.

<!-- source: EN PDF p121; unit 1283 -->

MMSE медленнее и потребляет больше памяти. По сравнению с KL-Divergence он лучше уменьшает потери от выбросов. Для моделей, подходящих для квантования, можно попробовать MMSE для повышения точности. В большинстве сценариев MMSE точнее Normal и KL-Divergence.

<!-- source: EN PDF p121; unit 1284 -->

По умолчанию применяется Normal. При проблемах точности можно попробовать KL-Divergence и MMSE.

<!-- source: EN PDF p122; unit 1285 -->

#### 6\.2.3 Рекомендации по калибровочному набору

<!-- source: EN PDF p122; unit 1286 -->

Калибровочный набор используется для вычисления диапазона активаций. Он должен охватывать разные распределения данных реального сценария применения. Например, для классификатора нужны изображения разных категорий этого сценария. Обычно рекомендуется 20-200 изображений; количество можно менять с учётом времени работы алгоритма. Увеличение набора увеличивает время квантования, но не обязательно повышает точность.

<!-- source: EN PDF p122; unit 1287 -->

#### 6\.2.4 Способ настройки квантования

<!-- source: EN PDF p122; unit 1288 -->

Настройка квантования RKNN-Toolkit2 выполняется через rknn.config() и rknn.build(). Метод задаётся через rknn.config(), а включение квантования и путь к калибровочному набору — через rknn.build().

<!-- source: EN PDF p122; unit 1289 -->

rknn.config() содержит следующие параметры квантования:

<!-- source: EN PDF p122; unit 1290 -->

quantized\_dtype: тип данных квантования. Сейчас поддерживается только линейное асимметричное INT8; по умолчанию 'asymmetric\_quantized-8'.

<!-- source: EN PDF p122; unit 1291 -->

quantized\_algorithm: алгоритм Normal, KL-Divergence или MMSE. Значения: 'normal', 'kl\_divergence', 'mmse'; по умолчанию 'normal'.

<!-- source: EN PDF p122; unit 1292 -->

quantized\_method: послойное или поканальное квантование. Значения: 'layer' и 'channel'; по умолчанию 'channel'.

<!-- source: EN PDF p122; unit 1293 -->

rknn.build() содержит следующие параметры квантования:

<!-- source: EN PDF p122; unit 1294 -->

do\_quantization: включать ли квантование; по умолчанию 'False'.

<!-- source: EN PDF p122; unit 1295 -->

dataset: путь к калибровочному набору; по умолчанию 'None'.

<!-- source: EN PDF p122; unit 1296 -->

Поддерживается текстовый файл .txt с путями к изображениям jpg/png или файлам npy для калибровки. Каждая строка содержит один путь, например:

<!-- source: EN PDF p122; unit 1297 -->

```text
a.jpg
b.jpg
```

<!-- source: EN PDF p122; unit 1298 -->

При нескольких входах соответствующие файлы разделяются пробелом:

<!-- source: EN PDF p122; unit 1299 -->

```text
a0.jpg a1.jpg
b0.jpg b1.jpg
```

<!-- source: EN PDF p122; unit 1300 -->

### 6\.3 Смешанное квантование

<!-- source: EN PDF p122; unit 1301 -->

Смешанное квантование использует разные типы данных для разных слоёв. Для слоёв, плохо подходящих для квантования, выбирается более высокая точность, уменьшающая потери. Однако смешанная точность создаёт дополнительные накладные расходы и требует определить типы квантования отдельных слоёв.

<!-- source: EN PDF p123; unit 1302 -->

#### 6\.3.1 Применение смешанного квантования

<!-- source: EN PDF p123; unit 1303 -->

Для лучшего баланса производительности и точности RKNN-Toolkit2 предоставляет смешанное квантование. По результатам анализа точности пользователь может вручную задать, должен ли квантоваться каждый слой.

<!-- source: EN PDF p123; unit 1304 -->

Поддерживаются следующие способы использования:

<!-- source: EN PDF p123; unit 1305 -->

Перевод выбранных квантованных слоёв в неквантованные вычисления FLOAT16. (Производительность неквантованных вычислений на NPU ниже, поэтому скорость инференса уменьшается.)

<!-- source: EN PDF p123; unit 1306 -->

Можно также изменять параметры квантования каждого слоя. (Изменять эти параметры не рекомендуется.)

<!-- source: EN PDF p123; unit 1307 -->

#### 6\.3.2 Порядок использования смешанного квантования

<!-- source: EN PDF p123; unit 1308 -->

Использование смешанного квантования состоит из четырёх шагов.

<!-- source: EN PDF p123; unit 1309 -->

1\. Загрузить исходную модель и создать конфигурацию квантования, временный файл модели и файл данных. Порядок вызовов интерфейсов:

<!-- source: EN PDF p123; unit 1310 -->

![Рисунок 6-3 Шаг 1 смешанного квантования](/docs/rockchip-rknn-sdk-user-guide/assets/en-p123-figure-01.png)

<!-- source: EN PDF p123; unit 1311 -->

Рисунок 6-3 Шаг 1 смешанного квантования

<!-- source: EN PDF p123; unit 1312 -->

2\. Изменить конфигурационный файл, созданный на первом шаге.

<!-- source: EN PDF p123; unit 1313 -->

После вызова hybrid\_quantization\_step1 на первом шаге в текущем каталоге создаётся {model\_name}.quantization.cfg. Формат файла:

<!-- source: EN PDF p124; unit 1314 -->

```text
custom_quantize_layers:
  Conv__350:0: float16
  Conv__358:0: float16
  ....
quantize_parameters:
  ....
  FeatureExtractor/MobilenetV2/Conv/Relu6:0:
    qtype: asymmetric_quantized
    qmethod: layer
    dtype: int8
    min:
    - 0.0
    max:
    - 6.0
    scale:
    - 0.023529411764705882
    zero_point:
    - -128
  ....
```

<!-- source: EN PDF p124; unit 1315 -->

В разделе "custom\_quantize\_layers" можно добавить пользовательские слои квантования: после имени тензора указать тип квантования. Тип операций соответствующего слоя будет изменён на заданный. Сейчас доступен тип "float16".

<!-- source: EN PDF p124; unit 1316 -->

Раздел "quantize\_parameters" содержит параметры каждого тензора в формате "tensor\_name: quantization\_properties\_and\_parameters". "min" и "max" — границы диапазона квантования. Имена выходных тензоров можно найти в результатах анализа точности либо открыв временный файл {model\_name}.model в Netron.

<!-- source: EN PDF p124; unit 1317 -->

3\. Создать модель RKNN. Порядок вызовов интерфейсов:

<!-- source: EN PDF p124; unit 1318 -->

![Рисунок 6-4 Шаг 3 смешанного квантования](/docs/rockchip-rknn-sdk-user-guide/assets/en-p124-figure-01.png)

<!-- source: EN PDF p124; unit 1319 -->

Рисунок 6-4 Шаг 3 смешанного квантования

<!-- source: EN PDF p125; unit 1320 -->

4\. Выполнить инференс моделью RKNN, созданной на третьем шаге.

<!-- source: EN PDF p125; unit 1321 -->

Примечание: в проекте RKNN-Toolkit2 есть пример смешанного квантования в каталоге "examples/functions/hybrid\_quant". Его можно использовать как образец.

<!-- source: EN PDF p125; unit 1322 -->

#### 6\.3.3 Автоматическое смешанное квантование

<!-- source: EN PDF p125; unit 1323 -->

Чтобы упростить смешанное квантование и устранить переполнение модели, RKNN-Toolkit2 предоставляет автоматический режим. Через auto\_hybrid модель смешанного квантования автоматически корректируется во время квантования по порогам евклидова и косинусного расстояния. Для неквантованных моделей проверяется переполнение fp16 каждого слоя; слои с переполнением переводятся на int16.

<!-- source: EN PDF p125; unit 1324 -->

Сейчас поддерживаются следующие сценарии:

<!-- source: EN PDF p125; unit 1325 -->

1\. При квантовании модель автоматически корректируется по порогам евклидова и косинусного расстояния. Сейчас поддерживается только автоматический переход с квантования int8 на fp16.

<!-- source: EN PDF p125; unit 1326 -->

```text
ret = rknn.build(do_quantization=True, dataset='./dataset.txt', auto_hybrid=True)
```

<!-- source: EN PDF p125; unit 1327 -->

Пороги задаются параметрами auto\_hybrid\_cos\_thresh и auto\_hybrid\_euc\_thresh интерфейса config. По умолчанию порог косинусного расстояния равен 0.98, евклидова — None, то есть отключён. Поэтому по умолчанию на fp16 переводятся только операторы с показателем точности по косинусному расстоянию ниже порога. При включённом евклидовом пороге на fp16 переводятся операторы, у которых косинусное расстояние ниже своего порога или евклидово расстояние выше своего порога.

<!-- source: EN PDF p125; unit 1328 -->

2\. Для неквантованных моделей каждый слой проверяется на переполнение fp16, а слои с переполнением переводятся на int16. Нужно предоставить набор данных для вычисления диапазона значений каждого слоя.

<!-- source: EN PDF p125; unit 1329 -->

```text
ret = rknn.build(do_quantization=False, dataset='./dataset.txt', auto_hybrid=True)
```

<!-- source: EN PDF p125; unit 1330 -->

По заданному входу послойно вычисляются максимум и минимум. Если они превышают верхнюю или нижнюю границу fp16, оператор соответствующего слоя переводится на int16.

<!-- source: EN PDF p125; unit 1331 -->

### 6\.4 Обучение с учётом квантования (QAT)

<!-- source: EN PDF p125; unit 1332 -->

#### 6\.4.1 Введение в QAT

<!-- source: EN PDF p125; unit 1333 -->

Quantization-Aware Training (QAT) направлено на устранение потери точности при низкоразрядном квантовании. Такая потеря возникает при переходе от диапазона чисел с плавающей точкой к фиксированной точке. При QAT ошибка квантования включается в функцию потерь обучения, что позволяет обучать модель с параметрами квантования.

<!-- source: EN PDF p125; unit 1334 -->

Сравнение с квантованием после обучения (PTQ), предоставляемым RKNN-Toolkit2:

<!-- source: EN PDF p126; unit 1335 -->

| Метод<br>квантования | Повторное обучение<br>в исходном<br>фреймворке | Набор данных | Изменение<br>весов | Функция потерь | Производительность |
| --- | --- | --- | --- | --- | --- |
| Квантование<br>после обучения<br>(PTQ) | Нет | Небольшое количество<br>неразмеченных данных | Нет | Не относится | Оптимальная |
| Обучение с учётом<br>квантования<br>(QAT) | Да | Полный обучающий<br>набор данных | Да | Ошибка квантования<br>включается в функцию<br>потерь обучения. | Если есть операторы,<br>не поддерживающие QAT,<br>производительность<br>немного ниже PTQ. |

<!-- source: EN PDF p126; unit 1336 -->

#### 6\.4.2 Принцип QAT

<!-- source: EN PDF p126; unit 1337 -->

При QAT веса хранятся и вычисления выполняются с плавающей точкой, обеспечивая корректное обратное распространение и эффективное обучение. В отличие от обычного обучения, в квантуемые места модели вставляются модули FakeQuantize, имитирующие потерю точности при переходе к фиксированной точке. Это позволяет функции потерь учитывать и оптимизировать квантование, обеспечивая точные результаты после преобразования модели в фиксированную точку.

<!-- source: EN PDF p126; unit 1338 -->

QAT широко применяется и поддерживается основными фреймворками инференса. Подробные инструкции доступны по следующим ссылкам.

<!-- source: EN PDF p126; unit 1339 -->

Pytorch - https://pytorch.org/blog/quantization-in-practice/#quantization-aware-training-qat

<!-- source: EN PDF p126; unit 1340 -->

Paddle - https://paddleslim.readthedocs.io/zh-cn/develop/api\_cn/dygraph/quanter/qat.html

<!-- source: EN PDF p126; unit 1341 -->

Tensorflow - https://www.tensorflow.org/model\_optimization/guide/quantization/training

<!-- source: EN PDF p126; unit 1342 -->

#### 6\.4.3 Рекомендации по применению QAT

<!-- source: EN PDF p126; unit 1343 -->

QAT требует дополнительного кода обучения и может конфликтовать с возможностями некоторых открытых репозиториев. Поэтому его рекомендуется рассматривать, когда выполнены оба условия:

<!-- source: EN PDF p126; unit 1344 -->

Проверка точности по главе 7 подтвердила, что PTQ RKNN не удовлетворяет требованиям точности.

<!-- source: EN PDF p126; unit 1345 -->

Проверка смешанного квантования по главе 6.3 подтвердила, что оно не удовлетворяет требованиям точности и производительности.

<!-- source: EN PDF p126; unit 1346 -->

#### 6\.4.4 Пример реализации и настройки QAT

<!-- source: EN PDF p126; unit 1347 -->

Ниже приведена документация QAT различных фреймворков. При практическом использовании руководствуйтесь официальными инструкциями.

<!-- source: EN PDF p127; unit 1348 -->

PyTorch: https://pytorch.org/docs/stable/quantization.html (PyTorch имеет несколько наборов интерфейсов квантования. RKNN поддерживает модели, созданные интерфейсом FX, в частности prepare\_qat\_fx и связанными интерфейсами.)

<!-- source: EN PDF p127; unit 1349 -->

Paddle: https://www.paddlepaddle.org.cn/tutorials/projectdetail/3949129#anchor-14

<!-- source: EN PDF p127; unit 1350 -->

TensorFlow: https://www.tensorflow.org/model\_optimization/guide/quantization/training

<!-- source: EN PDF p127; unit 1351 -->

На примере PyTorch показаны процесс реализации QAT и важные замечания.

<!-- source: EN PDF p127; unit 1352 -->

```text
# for 1.10 <= torch <= 1.13
import torch
class M(torch.nn.Module):
 def __init__(self):
 super().__init__()
 self.conv = torch.nn.Conv(3, 8, 3, 1)

 def forward(self, x):
 x = self.conv(x)
 return x

# initialize a floating point model
float_model = M().train()

from torch.quantization import quantize_fx, QConfig, FakeQuantize, MovingAverageMinMaxObserver, MovingAveragePerChannelMinMaxObserver

qconfig = QConfig(activation=FakeQuantize.with_args(observer=
        MovingAverageMinMaxObserver,
        quant_min=0,
        quant_max=255,
        reduce_range=False), # reudece_range -> the default is True

 weight=FakeQuantize.with_args(observer=
      MovingAveragePerChannelMinMaxObserver,
      quant_min=-128,
      quant_max=127,
      dtype=torch.qint8,
      qscheme=torch.per_channel_affine,
      #qscheme->the default is torch.per_channel_symmetric
      reduce_range=False))
qconfig_dict = {"": qconfig}
model_qat = quantize_fx.prepare_qat_fx(float_model, qconfig_dict)

# define the training loop for quantization aware training
def train_loop(model, train_data):
 model.train()
 for image, target in data_loader:
  ...
# Run training
train_loop(model_qat, train_loop)

model_qat = quantize_fx.convert_fx(model_qat)
```

<!-- source: EN PDF p128; unit 1353 -->

В приведённом коде все операции соответствуют официальным примерам, кроме настройки qconfig под оборудование RKNN. В qconfig внесены два основных изменения:

<!-- source: EN PDF p128; unit 1354 -->

Для квантования активаций reduce\_range задан как False. При False эффективный диапазон составляет от -128 до 127; при True — от -64 до 63, что ухудшает квантование. Оборудование RKNN поддерживает reduce\_range = False.

<!-- source: EN PDF p128; unit 1355 -->

Для квантования весов qscheme задан как torch.per\_channel\_affine. Значение по умолчанию torch.per\_channel\_symmetric фиксирует zero\_point на 0, но RKNN поддерживает ненулевую zero\_point. Поэтому выбран torch.per\_channel\_affine.

<!-- source: EN PDF p128; unit 1356 -->

#### 6\.4.5 Операторы, поддерживаемые QAT

<!-- source: EN PDF p128; unit 1357 -->

На примере PyTorch: сначала Conv и Linear с весами квантуются по правилам QAT, затем проверяются остальные операторы. Если они отвечают обычным правилам квантования, применяется обычное квантование. Оператор, не удовлетворяющий ни QAT, ни обычным правилам, сохраняет вычисления FP32.

<!-- source: EN PDF p128; unit 1358 -->

Поддержка различается между фреймворками. Подробности для используемых фреймворка и версии доступны по ссылкам:

<!-- source: EN PDF p128; unit 1359 -->

Pytorch: https://github.com/pytorch/pytorch/blob/main/torch/ao/quantization/quantization\_mappings.py

<!-- source: EN PDF p128; unit 1360 -->

Paddle: https://github.com/PaddlePaddle/Paddle/blob/86df789a567f1285101c57b6e3ada4b952c58f48/python/paddle/quantization/config.py

<!-- source: EN PDF p128; unit 1361 -->

Tensorflow: https://www.tensorflow.org/model\_optimization/api\_docs/python/tfmot/quantization/keras/QuantizeConfig

<!-- source: EN PDF p128; unit 1362 -->

#### 6\.4.6 Обработка операторов с плавающей точкой в модели QAT

<!-- source: EN PDF p128; unit 1363 -->

Если оператор QAT-модели нельзя квантовать, используются вычисления с плавающей точкой. При преобразовании таких операторов в RKNN различают два случая.

<!-- source: EN PDF p128; unit 1364 -->

1\. Предшествующий и последующий операторы квантуемы:

<!-- source: EN PDF p129; unit 1365 -->

![Рисунок 6-5 До и после QAT OP находятся квантуемые операторы](/docs/rockchip-rknn-sdk-user-guide/assets/en-p129-figure-01.png)

<!-- source: EN PDF p129; unit 1366 -->

Рисунок 6-5 До и после QAT OP находятся квантуемые операторы

<!-- source: EN PDF p129; unit 1367 -->

Слева gelu исходной модели работает с плавающей точкой, а предшествующий и последующий conv2d квантованы. При загрузке через RKNN-Toolkit2 оператор между двумя квантованными операторами также квантуется, повышая производительность без потери точности. Справа показана структура полученной модели RKNN.

<!-- source: EN PDF p129; unit 1368 -->

1\. До или после находятся неквантуемые операторы:

<!-- source: EN PDF p130; unit 1369 -->

![Рисунок 6-6 До и после QAT OP находятся неквантуемые операторы](/docs/rockchip-rknn-sdk-user-guide/assets/en-p130-figure-01.png)

<!-- source: EN PDF p130; unit 1370 -->

Рисунок 6-6 До и после QAT OP находятся неквантуемые операторы

<!-- source: EN PDF p130; unit 1371 -->

Слева gelu и softmax исходной модели работают с плавающей точкой, а соседние conv2d квантованы. При загрузке через RKNN-Toolkit2 у gelu и softmax отсутствуют параметры квантования, поэтому они остаются с плавающей точкой. Справа в полученной модели RKNN перед exGelu вставлен оператор деквантования exDataConvert, а после Softmax — оператор квантования exDataConvert. Эти дополнительные преобразования увеличивают задержку.

<!-- source: EN PDF p130; unit 1372 -->

#### 6\.4.7 Практические выводы по QAT

<!-- source: EN PDF p130; unit 1373 -->

1\. Настройки QAT

<!-- source: EN PDF p130; unit 1374 -->

Для лучших результатов QAT часто требует настройки с учётом оборудования. Для RKNPU рекомендуется задавать qconfig по инструкциям к коду раздела 6.4.4.

<!-- source: EN PDF p130; unit 1375 -->

2\. Коррекция сохранённых в модели параметров квантования

<!-- source: EN PDF p130; unit 1376 -->

Например, параметры оператора sigmoid, записанные в модели, могут отличаться от фактически используемых при инференсе. В официальном коде (https://github.com/pytorch/pytorch/blob/main/aten/src/ATen/native/quantized/cpu/qsigmoid.cpp) они корректируются во время инференса: min задаётся как 0, а max как [В оригинале значение max не приведено.]

<!-- source: EN PDF p130; unit 1377 -->

3\. Для учёта этого RKNN-Toolkit2 корректирует параметры таких операторов при преобразовании модели, приближая результаты к исходному инференсу PyTorch.

<!-- source: EN PDF p131; unit 1378 -->

## 7 Диагностика точности

<!-- source: EN PDF p131; unit 1379 -->

Диагностика точности обычно охватывает симулятор и среду выполнения на плате. Правильный результат симулятора необходим для правильного инференса на плате. Поэтому сначала следует добиться корректной работы симулятора, а затем проверять плату.

<!-- source: EN PDF p131; unit 1380 -->

В этой главе приведены рекомендации и решения для обоих случаев. На рисунке показана последовательность проверки:

<!-- source: EN PDF p131; unit 1381 -->

![Рисунок 7-1 Этапы анализа точности](/docs/rockchip-rknn-sdk-user-guide/assets/en-p131-figure-01.png)

<!-- source: EN PDF p131; unit 1382 -->

Рисунок 7-1 Этапы анализа точности

<!-- source: EN PDF p131; unit 1383 -->

Диагностика симулятора делится на проверку точности FP16 и точности квантования (тёмные блоки рисунка).

<!-- source: EN PDF p131; unit 1384 -->

Диагностика среды выполнения делится на проверку с подключённой платой и проверку runtime (светлые блоки).

<!-- source: EN PDF p131; unit 1385 -->

Косинусное расстояние может служить базовым критерием точности, но окончательное влияние квантования нужно проверять на наборе данных.

<!-- source: EN PDF p131; unit 1386 -->

### 7\.1 Проверка точности симулятора

<!-- source: EN PDF p131; unit 1387 -->

Правильный инференс симулятора — условие правильной работы на плате; поэтому в первую очередь нужно проверить симулятор.

<!-- source: EN PDF p131; unit 1388 -->

Симулятор RKNN-Toolkit2 выполняет FP16- или квантованный инференс. Правильные результаты FP16 необходимы для правильного квантованного инференса. При проблемах квантования сначала проверяют FP16, затем точность квантования.

<!-- source: EN PDF p131; unit 1389 -->

#### 7\.1.1 Точность FP16 в симуляторе

<!-- source: EN PDF p131; unit 1390 -->

RKNPU сейчас не поддерживает вычисления FP32, поэтому без квантования симулятор использует FP16. Чтобы преобразовать исходную модель в FP16 RKNN, вызовите rknn.build() с do\_quantization = False. Затем выполните rknn.init\_runtime(target=None) и rknn.inference() для симуляции FP16 и получения результатов.

<!-- source: EN PDF p132; unit 1391 -->

При неверной выходной информации FP16 выполните следующие проверки:

<!-- source: EN PDF p132; unit 1392 -->

Ошибка конфигурации

<!-- source: EN PDF p132; unit 1393 -->

Основные настройки модели сосредоточены в rknn.config(), но на точность FP16 могут влиять и отдельные параметры других API. Главные параметры:

<!-- source: EN PDF p132; unit 1394 -->

mean\_values / std\_values: параметры нормализации. В исходной модели нормализация обычно выполняется при предварительной обработке входа. В RKNN она может входить в сам инференс; при квантовании калибровочный набор сначала нормализуется. Если исходная модель использует нормализацию, эти параметры должны совпадать с её параметрами.

<!-- source: EN PDF p132; unit 1395 -->

input\_size\_list: неверные формы входных узлов в rknn.load\_tensorflow(), rknn.load\_pytorch() или rknn.load\_onnx() приводят к неверному инференсу.

<!-- source: EN PDF p132; unit 1396 -->

inputs / outputs: неверные имена входных или выходных узлов в rknn.load\_tensorflow() и rknn.load\_onnx() приводят к неверному инференсу.

<!-- source: EN PDF p132; unit 1397 -->

Параметры inference: основные входные параметры rknn.inference() — inputs и data\_format.

<!-- source: EN PDF p132; unit 1398 -->

В Python изображения обычно читают через cv2.imread(), который возвращает BGR. Если вход исходной модели — BGR (как у большинства моделей caffe), перестановка RGB не нужна. Если вход — RGB, выполните cv2.cvtColor(img, cv2.COLOR\_BGR2RGB). Изображение cv2.imread() 3-мерное, а большинство моделей ожидают 4 измерения, поэтому перед rknn.inference() добавьте измерение через np.expand\_dims(img, 0). Раскладка cv2.imread() — NHWC, и data\_format по умолчанию также NHWC, поэтому задавать data\_format не требуется.

<!-- source: EN PDF p132; unit 1399 -->

Если данные прочитаны не через cv2.imread(), определите их раскладку и правильно задайте data\_format. Форма данных должна соответствовать исходной модели. Для изображений также должен совпадать порядок RGB.

<!-- source: EN PDF p132; unit 1400 -->

Проверка параметров крайне важна: неверная конфигурация — частая причина неправильных результатов FP16. Порядок проверки:

<!-- source: EN PDF p132; unit 1401 -->

1\. Выполнить исходную модель в исходном фреймворке и сохранить результаты.

<!-- source: EN PDF p132; unit 1402 -->

2\. Преобразовать и выполнить модель через RKNN-Toolkit2 с теми же входными данными в FP16: do\_quantization = False в rknn.build(), target = None в rknn.init\_runtime(). Сохранить результаты симулятора.

<!-- source: EN PDF p132; unit 1403 -->

3\. Сравнить результаты. Если они достаточно близки (можно использовать косинусное расстояние), настройки корректны.

<!-- source: EN PDF p132; unit 1404 -->

4\. При расхождении проверить перечисленные параметры.

<!-- source: EN PDF p132; unit 1405 -->

Если настройки верны, но результаты различаются, тензоры модели могут выходить за диапазон FP16.

<!-- source: EN PDF p132; unit 1406 -->

Выход за диапазон FP16

<!-- source: EN PDF p133; unit 1407 -->

При переходе с FP32 на FP16 промежуточные тензоры могут переполняться. Обычно модель использует FP32; значения вне диапазона FP16 (-65504～65504) вызывают переполнение и аномальные результаты.

<!-- source: EN PDF p133; unit 1408 -->

Для проверки переполнения используйте rknn.accuracy\_analysis(..., target=None), см. анализ точности модели. Аномальные значения, например 'inf', в колонках entire или single группы simulator\_error могут означать переполнение FP16. Попробуйте изменить структуру, например добавить BN-слои, чтобы все тензоры укладывались в FP16.

<!-- source: EN PDF p133; unit 1409 -->

Если настройки верны, переполнения FP16 нет, но результаты различаются, возможна ошибка реализации симулятора. Передайте воспроизводимый пример модели команде Rockchip NPU для анализа и исправления.

<!-- source: EN PDF p133; unit 1410 -->

#### 7\.1.2 Точность квантования в симуляторе

<!-- source: EN PDF p133; unit 1411 -->

После исключения проблем FP16 квантовать модель можно через rknn.build() с do\_quantization = True. Затем выполните rknn.accuracy\_analysis(..., target=None), см. анализ точности модели, для проверки квантования в симуляторе.

<!-- source: EN PDF p133; unit 1412 -->

Если точность в колонке entire группы simulator\_error существенно упала, но в single нет отдельного слоя с сильным падением, проверьте следующие области:

<!-- source: EN PDF p133; unit 1413 -->

Ошибки конфигурации

<!-- source: EN PDF p133; unit 1414 -->

Как и для FP16, неверные настройки вызывают проблемы квантования. Даже при корректных настройках FP16 нужно дополнительно проверить параметры квантования ниже.

<!-- source: EN PDF p133; unit 1415 -->

quant\_img\_RGB2BGR: выполнять ли RGB2BGR при загрузке изображений квантования; обычно применяется к caffe. Подробнее см. описание quant\_img\_RGB2BGR. Настройка должна соответствовать порядку каналов обучающих изображений, иначе точность может существенно снизиться.

<!-- source: EN PDF p133; unit 1416 -->

optimization\_level: уровень оптимизации, по умолчанию 3 — приоритет скорости. Включаются правила, немного влияющие на точность ради производительности. При снижении уровня, например до 0, эти правила отключаются.

<!-- source: EN PDF p133; unit 1417 -->

dataset: калибровочный набор rknn.build(), используемый для расчёта scale/zero\_point каждого тензора. Сильное отличие набора от реального сценария может снизить точность. Слишком большое или малое количество изображений также влияет на точность; обычно выбирают 20–200 изображений.

<!-- source: EN PDF p133; unit 1418 -->

Параметры квантования обычно проверяют следующим образом:

<!-- source: EN PDF p133; unit 1419 -->

1\. Выполнить квантованный инференс и сравнить с исходной моделью в её фреймворке. Если различие невелико, параметры quant\_img\_RGB2BGR и dataset можно считать в основном корректными.

<!-- source: EN PDF p133; unit 1420 -->

2\. Если различие остаётся заметным:

<!-- source: EN PDF p133; unit 1421 -->

Если исходная модель ожидает BGR, что часто бывает у caffe, задайте quant\_img\_RGB2BGR = True. Порядок RGB можно проверить в коде обработки входа, использованном на предыдущем этапе проверки FP16.

<!-- source: EN PDF p134; unit 1422 -->

Сначала используйте для квантования одно изображение — оставьте одну строку в dataset.txt — и выполните инференс на нём. Значительное улучшение точности указывает на неудачный выбор прежнего калибровочного набора. Подберите изображения, лучше соответствующие сценарию применения. Если улучшение невелико, причина может быть не в dataset.

<!-- source: EN PDF p134; unit 1423 -->

Если изначально использовалось только одно изображение, то есть одна строка dataset.txt, попробуйте увеличить набор примерно до 20–200 изображений.

<!-- source: EN PDF p134; unit 1424 -->

После проверки этих настроек полностью неверных результатов квантования быть не должно. Если они сохраняются, перепроверьте настройки. Если конфигурация верна, но точность недостаточна, попробуйте изменить методы и алгоритмы квантования.&lt;br&gt;Методы и алгоритмы квантования

<!-- source: EN PDF p134; unit 1425 -->

Некоторые модели плохо подходят для квантования. Попробуйте другие методы и алгоритмы. Основные методы — layer и channel, задаваемые quantized\_method в rknn.config() (по умолчанию channel). Алгоритмы normal, kl\_divergence и mmse выбираются через quantized\_algorithm в rknn.config() (по умолчанию normal). Порядок действий:

<!-- source: EN PDF p134; unit 1426 -->

1\. Если использовался layer, попробуйте channel. Поканальное квантование часто значительно точнее послойного.

<!-- source: EN PDF p134; unit 1427 -->

2\. Если уже используется channel, но точности недостаточно, смените normal на kl\_divergence или mmse. Время квантования может значительно вырасти, но точность обычно лучше normal; производительность при выполнении не ухудшается.

<!-- source: EN PDF p134; unit 1428 -->

Если entire в simulator\_error остаётся неудовлетворительным, а single показывает сильное падение точности отдельных слоёв, причиной может быть неудачное распределение их весов. Например, сильно неравномерные веса Conv теряют точность после квантования. Для улучшения можно применить смешанное квантование:

<!-- source: EN PDF p134; unit 1429 -->

1\. Через анализ точности найдите слои с большим падением и запишите имена их выходных тензоров. Поскольку ошибки накапливаются послойно, ранние слои сильнее влияют на итог. Учитывайте и потерю в single группы simulator\_error, и положение слоя.

<!-- source: EN PDF p134; unit 1430 -->

2\. Внесите полученные имена тензоров в конфигурацию смешанного квантования; см. соответствующий раздел.

<!-- source: EN PDF p134; unit 1431 -->

3\. Завершите смешанное квантование и проверьте точность. Для сравнения изменений можно снова использовать интерфейс анализа.

<!-- source: EN PDF p134; unit 1432 -->

Обычно смешанное квантование улучшает точность. Если улучшение недостаточно, охватите больше слоёв, но это снизит скорость инференса. Необходимо соблюдать баланс точности и скорости. Отдельный вариант для последнего слоя с потерей точности — перенести его операцию в постобработку, чтобы избежать проблемы квантования этого слоя.

<!-- source: EN PDF p134; unit 1433 -->

QAT (обучение с учётом квантования):

<!-- source: EN PDF p135; unit 1434 -->

Если после смешанного квантования точность всё ещё мала либо она достаточна, но производительность не устраивает, можно переобучить модель с QAT. Экспортируйте её вместе с параметрами квантования, например в ONNX, PyTorch или TensorFlow Lite. Подробнее см. раздел об обучении с учётом квантования (QAT).

<!-- source: EN PDF p135; unit 1435 -->

### 7\.2 Проверка точности среды выполнения

<!-- source: EN PDF p135; unit 1436 -->

Даже при корректном симуляторе развёртывание C API на плате может давать неверные результаты. Обычно причин три: ошибка runtime платы, неправильное использование RKNPU2 C API или неверная пред-/постобработка модели.

<!-- source: EN PDF p135; unit 1437 -->

Сначала используйте режим с подключённой платой, чтобы быстро проверить возможную ошибку runtime. Если он работает правильно, проверяйте развёртывание C API.

<!-- source: EN PDF p135; unit 1438 -->

#### 7\.2.1 Точность при подключённой плате

<!-- source: EN PDF p135; unit 1439 -->

1\. Настройте среду отладки с платой, как описано в настройке среды NPU, подключите плату к ПК через USB и выполните инференс RKNN-Toolkit2 с target в rknn.init\_runtime(), например target='rk3566'. Проверьте примерную корректность результата: симулятор не полностью воспроизводит NPU, поэтому абсолютного совпадения может не быть.

<!-- source: EN PDF p135; unit 1440 -->

2\. Значительное отличие от симулятора предварительно указывает на ошибку runtime платы. Выполните анализ точности с подключённой платой: rknn.accuracy\_analysis() с target, например target='rk3566'; см. анализ точности модели. После завершения будут выведены результаты каждого слоя.

<!-- source: EN PDF p135; unit 1441 -->

3\. Проверьте single\_sim группы runtime\_error. Низкое косинусное cos или высокое евклидово euc расстояние, выделенное жёлтым/красным, может увеличивать разницу entire между runtime\_error и simulator\_error. Возможно, реализация этого слоя в runtime теряет точность или работает аномально. Передайте результаты анализа и воспроизводимую модель команде Rockchip NPU для исправления.

<!-- source: EN PDF p135; unit 1442 -->

#### 7\.2.2 Точность runtime

<!-- source: EN PDF p135; unit 1443 -->

Если режим с подключённой платой корректен, но приложение нет, проблема может находиться в пользовательском C/C++ коде, использующем RKNN C API. Проверьте настройки интерфейсов и пред-/постобработку: они должны полностью совпадать с симулятором. Порядок проверки:

<!-- source: EN PDF p135; unit 1444 -->

1\. Проверить настройки и данные входа

<!-- source: EN PDF p135; unit 1445 -->

Проверьте вход C API. Если при преобразовании RKNN-Toolkit2 уже заданы среднее и дисперсия, повторная нормализация в C/C++ не нужна. Для 3-мерного входа порядок каналов должен соответствовать обучению; для 4-мерного fmt=NHWC, для не4-мерного fmt=UNDEFINED. В обычном API размер входного буфера равен числу элементов тензора, умноженному на число байтов элемента. Для zero-copy размер памяти rknn\_create\_mem и формат данных см. в разделе использования RKNN Runtime Zero-Copy.

<!-- source: EN PDF p136; unit 1446 -->

После проверки настроек проверьте данные входного слоя. До запуска приложения задайте RKNN\_LOG\_LEVEL=5. Послойные результаты сохраняются как numpy-файлы в /data/dumps (Android) или /userdata/dumps (Linux). Проверьте файл с InputOperator. Для обычного API он содержит результат нормализации входа, для zero-copy — данные до нормализации.

<!-- source: EN PDF p136; unit 1447 -->

2\. Проверить настройки и данные выхода

<!-- source: EN PDF p136; unit 1448 -->

После проверки входа проверьте выход. В обычном API want\_float=1 возвращает float32, want\_float=0 — квантованный тип либо FP16 для неквантованных данных. Для zero-copy размер памяти и формат входных данных, создаваемых rknn\_create\_mem(), см. в разделе использования RKNN Runtime Zero-Copy.

<!-- source: EN PDF p136; unit 1449 -->

Откройте созданный послойный numpy-файл с OutputOperator и проверьте выход. Если вход подтверждён, но выход неверен, возможна ошибка обработки конкретного входного/выходного типа в runtime. Передайте анализ и воспроизводимую модель команде Rockchip NPU для исправления.

<!-- source: EN PDF p136; unit 1450 -->

## 8 Оптимизация производительности

<!-- source: EN PDF p136; unit 1451 -->

### 8\.1 Порядок анализа производительности модели

<!-- source: EN PDF p136; unit 1452 -->

#### 8\.1.1 Проверка среды выполнения

<!-- source: EN PDF p136; unit 1453 -->

Перед анализом и оптимизацией установите одинаковые исходные условия тестовой среды. Только при совпадении условий данные имеют смысл. Например, инференс одной модели на разных частотах может сильно различаться; это нельзя характеризовать средним временем кадра одного пакета.

<!-- source: EN PDF p136; unit 1454 -->

При проверке и настройке среды учитывайте следующие аспекты:

<!-- source: EN PDF p136; unit 1455 -->

Проверка и установка частот CPU, DDR и NPU

<!-- source: EN PDF p136; unit 1456 -->

Фиксированные частоты напрямую влияют на скорость; более высокие частоты обычно дают лучшую производительность. Однако зависимость нелинейна, а повышение частоты увеличивает энергопотребление.

<!-- source: EN PDF p136; unit 1457 -->

Команды фиксации частот: https://github.com/airockchip/rknn\_model\_zoo/blob/main/scaling\_frequency.sh

<!-- source: EN PDF p136; unit 1458 -->

Либо включите режим производительности следующей командой:

<!-- source: EN PDF p136; unit 1459 -->

```text
echo performance | tee $(find /sys/ -name *governor) /dev/null || true
```

<!-- source: EN PDF p136; unit 1460 -->

Проверка версии драйвера ядра NPU

<!-- source: EN PDF p136; unit 1461 -->

Оптимизации некоторых функций и операторов могут зависеть от версии драйвера. Новые версии содержат свежие низкоуровневые оптимизации. Проверьте, достаточно ли свежий драйвер используется. Рекомендуется версия 0.8.8 или новее; это не обязательное требование.

<!-- source: EN PDF p136; unit 1462 -->

Версию драйвера можно проверить командами:

<!-- source: EN PDF p137; unit 1463 -->

```text
cat /sys/kernel/debug/rknpu/version # for RK3566/RK3568/RK3588/RK3562/RK3576
cat /proc/rknpu/version # for RV1106/RV1106B/RV1103/RV1103B/RV1126B
```

<!-- source: EN PDF p137; unit 1464 -->

Примечание: RK2118 пока не поддерживает запрос версии NPU.&lt;br&gt;Проверка загрузки NPU

<!-- source: EN PDF p137; unit 1465 -->

Загрузка NPU — доля времени выполнения задач за единицу времени. Она отражает активность NPU. Низкая загрузка означает длительное ожидание новых задач. Проверьте время копирования входов/выходов, пред-/постобработку и другие факторы приложения. Многопоточность также может повысить загрузку NPU.

<!-- source: EN PDF p137; unit 1466 -->

Загрузка NPU не равна фактической утилизации MAC. Последняя отражает эффективность исполнения задач аппаратными вычислительными блоками.

<!-- source: EN PDF p137; unit 1467 -->

Команда запроса загрузки NPU:

<!-- source: EN PDF p137; unit 1468 -->

```text
cat /sys/kernel/debug/rknpu/load
# or
cat /proc/debug/rknpu/load
```

<!-- source: EN PDF p137; unit 1469 -->

Примечание: RK2118 пока не поддерживает запрос загрузки NPU.

<!-- source: EN PDF p137; unit 1470 -->

#### 8\.1.2 Анализ времени развёртывания

<!-- source: EN PDF p137; unit 1471 -->

Общее время делится на работу приложения, копирование входов/выходов и инференс модели. Распределение времени помогает определить приоритеты оптимизации. Каждый этап можно измерить временными метками в приложении.

<!-- source: EN PDF p137; unit 1472 -->

Время приложения:

<!-- source: EN PDF p137; unit 1473 -->

Это время инференс-процесса, не связанное с NPU: обычно предобработка, постобработка и логика программы. Пользователь полностью контролирует эту часть. Если её доля велика, помимо упрощения и оптимизации кода можно ускорить отдельные операции специализированным оборудованием.

<!-- source: EN PDF p137; unit 1474 -->

Например, матричные умножения и сложения можно ускорить через Matmul API с участием NPU, а масштабирование изображений — через RGA.

<!-- source: EN PDF p137; unit 1475 -->

Время копирования входов/выходов:

<!-- source: EN PDF p137; unit 1476 -->

Обычный API копирует данные между входной/выходной памятью и памятью NPU; это время можно вывести при вызове API. Оно зависит от DDR и CPU. Для малых данных затраты невелики, для больших ими нельзя пренебрегать. Поэтому рекомендуется zero-copy API.

<!-- source: EN PDF p137; unit 1477 -->

При zero-copy NPU напрямую обращается к входной/выходной памяти. Подробнее см. раздел интерфейса RKNN Runtime Zero-Copy.

<!-- source: EN PDF p137; unit 1478 -->

Время инференса:

<!-- source: EN PDF p137; unit 1479 -->

Время инференса NPU зависит от размера модели, версии оптимизаций компилятора и других факторов. Время, выводимое RKNN LOG, различается при разных RKNN\_LOG\_LEVEL, поскольку вывод журнала сам занимает время.

<!-- source: EN PDF p137; unit 1480 -->

Обычно для измерения одного кадра задают уровень LOG 1 и усредняют несколько запусков.

<!-- source: EN PDF p138; unit 1481 -->

### 8\.2 Анализ производительности

<!-- source: EN PDF p138; unit 1482 -->

#### 8\.2.1 Получение профиля

<!-- source: EN PDF p138; unit 1483 -->

Чтобы узнать время каждого слоя, перед запуском программы задайте следующую команду для подробного вывода:

<!-- source: EN PDF p138; unit 1484 -->

```text
export RKNN_LOG_LEVEL=4
./run_rknn_test ./test.rknn ./input.jpg
```

<!-- source: EN PDF p138; unit 1485 -->

На Android подробные журналы после запуска можно получить через logcat.

<!-- source: EN PDF p138; unit 1486 -->

При использовании RKNN-Toolkit2 время каждого слоя получают следующим способом:

<!-- source: EN PDF p138; unit 1487 -->

```text
rknn.init_runtime(target=platform, perf_debug=True)
rknn.eval_perf()
```

<!-- source: EN PDF p138; unit 1488 -->

Можно получить следующий отчёт анализа производительности:

<!-- source: EN PDF p138; unit 1489 -->

![Рисунок 8-1 Отчёт анализа производительности](/docs/rockchip-rknn-sdk-user-guide/assets/en-p138-figure-01.png)

| OpType | CallNumber | CPUTime(us) | GPUTime(us) | NPUTime(us) | TotalTime(us) | TimeRatio(%) |
| --- | --- | --- | --- | --- | --- | --- |
| ConvLeakyRelu | 7 | 0 | 0 | 4584 | 4584 | 53\.77% |
| MaxPool | 6 | 0 | 0 | 2273 | 2273 | 26\.66% |
| Conv | 2 | 0 | 0 | 846 | 846 | 9\.92% |
| ConvAdd | 1 | 0 | 0 | 511 | 511 | 5\.99% |
| Split | 1 | 0 | 0 | 152 | 152 | 1\.78% |
| LeakyRelu | 1 | 0 | 0 | 68 | 68 | 0\.80% |
| OutputOperator | 1 | 62 | 0 | 0 | 62 | 0\.73% |
| InputOperator | 1 | 29 | 0 | 0 | 29 | 0\.34% |

<!-- source: EN PDF p138; unit 1490 -->

Рисунок 8-1 Отчёт анализа производительности

<!-- source: EN PDF p138; unit 1491 -->

![Рисунок 8-2 Отчёт анализа производительности](/docs/rockchip-rknn-sdk-user-guide/assets/en-p138-figure-02.png)

| ID | OpType | DataType | Target | InputShape | OutputShape | DDRCycles | NPUCycles | MaxCycles | Time(us) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | InputOperator | UINT8 | CPU | \ | (1,3,480,640) | 0 | 0 | 0 | 9 |
| 1 | ConvExSwish | INT8 | NPU | (1,3,480,640),(32,3,3,3),(32) | (1,32,240,320) | 794117 | 1382400 | 1382400 | 2805 |
| 2 | ConvExSwish | INT8 | NPU | (1,32,240,320),(64,32,3,3),(64) | (1,64,120,160) | 665207 | 691200 | 691200 | 1605 |
| 3 | ConvExSwish | INT8 | NPU | (1,64,120,160),(32,64,1,1),(32) | (1,32,120,160) | 332036 | 153600 | 332036 | 832 |
| 4 | ConvExSwish | INT8 | NPU | (1,64,120,160),(32,64,1,1),(32) | (1,32,120,160) | 332036 | 153600 | 332036 | 788 |
| 5 | ConvExSwish | INT8 | NPU | (1,32,120,160),(32,32,1,1),(32) | (1,32,120,160) | 248988 | 153600 | 248988 | 722 |
| 6 | ConvExSwish | INT8 | NPU | (1,32,120,160),(32,32,3,3),(32) | (1,32,120,160) | 250087 | 345600 | 345600 | 768 |
| 7 | Add | INT8 | NPU | (1,32,120,160),(1,32,120,160) | (1,32,120,160) | 329574 | 0 | 329574 | 298 |
| 8 | Concat | INT8 | NPU | (1,32,120,160),(1,32,120,160) | (1,64,120,160) | 494407 | 0 | 494407 | 453 |
| 9 | ConvExSwish | INT8 | NPU | (1,64,120,160),(64,64,1,1),(64) | (1,64,120,160) | 497258 | 307200 | 497258 | 1427 |
| 10 | ConvExSwish | INT8 | NPU | (1,64,120,160),(128,64,3,3),(128) | (1,128,60,80) | 401859 | 691200 | 691200 | 962 |
| 11 | ConvExSwish | INT8 | NPU | (1,128,60,80),(64,128,1,1),(64) | (1,64,60,80) | 167682 | 76800 | 167682 | 405 |

<!-- source: EN PDF p138; unit 1492 -->

Рисунок 8-2 Отчёт анализа производительности

<!-- source: EN PDF p138; unit 1493 -->

Общий и послойный профили позволяют быстро найти нужные сведения и выбрать дальнейшую стратегию оптимизации. После получения профиля анализируют время слоёв для поиска длительных операторов, влияние операторов вне NPU и узкие места операторов NPU. Далее эти проверки описаны подробно.

<!-- source: EN PDF p138; unit 1494 -->

#### 8\.2.2 Послойный анализ времени

<!-- source: EN PDF p138; unit 1495 -->

В колонке Times можно найти длительные операторы и оптимизировать их первыми. Колонка Op Type показывает, относятся ли они к одному OpType, чтобы оптимизировать их совместно.

<!-- source: EN PDF p139; unit 1496 -->

![Рисунок 8-3 Анализ длительных операторов](/docs/rockchip-rknn-sdk-user-guide/assets/en-p139-figure-01.png)

| ID | OpType | DataType | Target | InputShape | OutputShape | DDRCycles | NPUCycles | MaxCycles | Time(us) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 117 | Sigmoid | INT8 | NPU | (1,83,60,80) | (1,83,60,80) | 186625 | 0 | 186625 | 541 |
| 118 | ConvRelu | INT8 | NPU | (1,128,60,80),(128,128,3,3),(128) | (1,128,60,80) | 327096 | 1382400 | 1382400 | 1595 |
| 119 | ConvRelu | INT8 | NPU | (1,128,60,80),(128,128,3,3),(128) | (1,128,60,80) | 327096 | 1382400 | 1382400 | 1596 |
| 120 | Conv | INT8 | NPU | (1,128,60,80),(4,128,1,1),(4) | (1,4,60,80) | 103405 | 19200 | 103405 | 150 |
| 121 | Conv | INT8 | NPU | (1,128,60,80),(1,128,1,1),(1) | (1,1,60,80) | 103345 | 19200 | 103345 | 150 |
| 122 | Sigmoid | INT8 | NPU | (1,1,60,80) | (1,1,60,80) | 32181 | 0 | 32181 | 142 |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 144 | Mul | INT8 | NPU | (1,83,60,80),(1,1,60,80) | (1,83,60,80) | 319655 | 0 | 319655 | 414 |
| 145 | ReduceMax | INT8 | CPU | (1,83,60,80) | (1,1,60,80) | 0 | 0 | 0 | 7441 |
| 146 | ArgMax | INT8 | CPU | (1,83,60,80) | (1,1,60,80) | 0 | 0 | 0 | 7389 |
| 147 | Reshape | INT64 | CPU | (1,1,60,80),(3) | (1,60,80) | 0 | 0 | 0 | 69 |
| 148 | OutputOperator | INT64 | CPU | (1,60,80) | \ | 0 | 0 | 0 | 13 |

<!-- source: EN PDF p139; unit 1497 -->

Рисунок 8-3 Анализ длительных операторов

<!-- source: EN PDF p139; unit 1498 -->

Длительный оператор не обязательно неэффективен. При высокой утилизации Mac следует уменьшить его размер для снижения времени. Низкая утилизация требует особого внимания.

<!-- source: EN PDF p139; unit 1499 -->

#### 8\.2.3 Влияние операторов CPU

<!-- source: EN PDF p139; unit 1500 -->

На рисунке часть длительных операторов выполняется на CPU. Перенос на NPU может значительно сократить их влияние. Большинство пользовательских проблем производительности решается переносом CPU-операторов на NPU, поэтому их времени следует уделять особое внимание.

<!-- source: EN PDF p139; unit 1501 -->

![Рисунок 8-4 Анализ производительности операторов CPU](/docs/rockchip-rknn-sdk-user-guide/assets/en-p139-figure-02.png)

| OpType | CallNumber | CPUTime(us) | GPUTime(us) | NPUTime(us) | TotalTime(us) | TimeRatio(%) |
| --- | --- | --- | --- | --- | --- | --- |
| ConvRelu | 125 | 0 | 0 | 54613 | 54613 | 42\.09% |
| ConvExSwish | 35 | 0 | 0 | 20047 | 20047 | 15\.45% |
| ReduceMax | 7 | 16104 | 0 | 0 | 16104 | 12\.41% |
| ArgMax | 7 | 14833 | 0 | 0 | 14833 | 11\.43% |
| Concat | 36 | 0 | 0 | 10464 | 10464 | 8\.06% |
| Conv | 25 | 0 | 0 | 3685 | 3685 | 2\.84% |
| exSoftmax13 | 1 | 0 | 0 | 1916 | 1916 | 1\.48% |
| Resize | 11 | 0 | 0 | 1893 | 1893 | 1\.46% |
| Sigmoid | 12 | 0 | 0 | 1595 | 1595 | 1\.23% |
| Reshape | 14 | 388 | 0 | 699 | 1087 | 0\.84% |
| Mul | 7 | 0 | 0 | 1065 | 1065 | 0\.82% |
| Add | 7 | 0 | 0 | 1046 | 1046 | 0\.81% |
| MaxPool | 9 | 0 | 0 | 784 | 784 | 0\.60% |
| OutputOperator | 32 | 569 | 0 | 0 | 569 | 0\.44% |
| ConvSigmoid | 1 | 0 | 0 | 40 | 40 | 0\.03% |
| InputOperator | 1 | 9 | 0 | 0 | 9 | 0\.01% |

<!-- source: EN PDF p139; unit 1502 -->

Рисунок 8-4 Анализ производительности операторов CPU

<!-- source: EN PDF p139; unit 1503 -->

Операторы обычно выполняются вне NPU по следующим причинам:

<!-- source: EN PDF p139; unit 1504 -->

Размер оператора превышает ограничение; см. ограничения размеров в OpList.

<!-- source: EN PDF p139; unit 1505 -->

Оператор пока не поддерживается NPU. Проверьте OpList; можно создать issue в проекте Github.

<!-- source: EN PDF p139; unit 1506 -->

Аппаратные ограничения NPU не позволяют поддержку; рассмотрите эквивалентную реализацию алгоритма через другие поддерживаемые варианты NPU.

<!-- source: EN PDF p140; unit 1507 -->

#### 8\.2.4 Анализ узких мест операторов NPU

<!-- source: EN PDF p140; unit 1508 -->

При длительном выполнении NPU-оператора по DDR Cycles/NPU Cycles/Total Cycles можно определить теоретическое ограничение: пропускная способность или вычислительная мощность. DDR Cycles — циклы чтения/записи, пересчитанные на частоту NPU, поэтому их можно напрямую сравнивать с NPU Cycle.

<!-- source: EN PDF p140; unit 1509 -->

Как показано ниже:

<!-- source: EN PDF p140; unit 1510 -->

![Рисунок 8-5 Анализ производительности операторов NPU](/docs/rockchip-rknn-sdk-user-guide/assets/en-p140-figure-01.png)

| ID | OpType | DataType | Target | InputShape | OutputShape | DDR Cycles | NPU Cycles | Total Cycles | Time(us) | MacUsage(% [clipped] | Task Number | Regcmd Size | RW [clipped] |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | InputOperat [clipped] | UINT8 | CPU | \ | (1,3,300,300) | 0 | 0 | 0 | 12 | \ | 0 | 0 | [clipped] |
| 1 | Conv | UINT8 | NPU | (1,3,300,300) | (1,3,300,300) | 261543 | 1582 | 261543 | 585 | 0\.3 | 0 | 0 | 1 [clipped] |
| 2 | Split | INT8 | CPU | (1,3,300,300) | (1,1,300,300),(1 [clipped] | 0 | 0 | 0 | 6677 | \ | 0 | 0 | [clipped] |
| 3 | Conv | INT8 | NPU | (1,1,300,300) | (1,8,150,150) | 275553 | 17226 | 275553 | 1556 | 1\.23 | 0 | 0 | 1 [clipped] |
| 4 | Conv | INT8 | NPU | (1,1,300,300) | (1,8,150,150) | 275553 | 17226 | 275553 | 1505 | 1\.27 | 0 | 0 | 1 [clipped] |
| 5 | Conv | INT8 | NPU | (1,1,300,300) | (1,8,150,150) | 275553 | 17226 | 275553 | 1573 | 1\.22 | 0 | 0 | 1 [clipped] |
| 6 | Concat | INT8 | CPU | (1,8,150,150) [clipped] | (1,24,150,150) | 0 | 0 | 0 | 4684 | \ | 0 | 0 | 1 [clipped] |
| 7 | Conv | INT8 | NPU | (1,24,150,150) | (1,64,150,150) | 329723 | 67500 | 329723 | 684 | 10\.96 | 0 | 0 | 2 [clipped] |
| 8 | Clip | INT8 | NPU | (1,64,150,150) | (1,64,150,150) | 438387 | 0 | 438387 | 729 | \ | 0 | 0 | 2 [clipped] |
| 9 | MaxPool | INT8 | NPU | (1,64,150,150) | (1,64,75,75) | 275490 | 0 | 275490 | 725 | \ | 0 | 0 | 1 [clipped] |
| 10 | Conv | INT8 | NPU | (1,64,75,75) | (1,64,75,75) | 110676 | 45000 | 110676 | 281 | 17\.79 | 0 | 0 | [clipped] |
| 11 | Clip | INT8 | NPU | (1,64,75,75) | (1,64,75,75) | 109676 | 0 | 109676 | 275 | \ | 0 | 0 | [clipped] |
| 12 | Conv | INT8 | NPU | (1,64,75,75) | (1,192,75,75) | 253595 | 1215000 | 1215000 | 1456 | 92\.72 | 0 | 0 | 1 [clipped] |
| 13 | Clip | INT8 | NPU | (1,192,75,75) | (1,192,75,75) | 328817 | 0 | 328817 | 599 | \ | 0 | 0 | 2 [clipped] |
| 14 | MaxPool | INT8 | NPU | (1,192,75,75) | (1,192,38,38) | 206599 | 0 | 206599 | 535 | \ | 0 | 0 | 1 [clipped] |
| 15 | AveragePool [clipped] | INT8 | CPU | (1,192,38,38) | (1,192,38,38) | 0 | 0 | 0 | 16159 | \ | 0 | 0 | [clipped] |
| 16 | Conv | INT8 | NPU | (1,192,38,38) | (1,32,38,38) | 50564 | 17328 | 50564 | 192 | 10\.03 | 0 | 0 | [clipped] |
| 17 | Clip | INT8 | NPU | (1,32,38,38) | (1,32,38,38) | 14169 | 0 | 14169 | 121 | \ | 0 | 0 | [clipped] |
| 18 | Conv | INT8 | NPU | (1,192,38,38) | (1,64,38,38) | 58609 | 34656 | 58609 | 139 | 19\.95 | 0 | 0 | [clipped] |
| 19 | Clip | INT8 | NPU | (1,64,38,38) | (1,64,38,38) | 28233 | 0 | 28233 | 132 | \ | 0 | 0 | [clipped] |
| 20 | Conv | INT8 | NPU | (1,64,38,38) | (1,96,38,38) | 43855 | 155952 | 155952 | 304 | 57 | 0 | 0 | [clipped] |
| 21 | Clip | INT8 | NPU | (1,96,38,38) | (1,96,38,38) | 42297 | 0 | 42297 | 152 | \ | 0 | 0 | [clipped] |
| 22 | Conv | INT8 | NPU | (1,96,38,38) | (1,96,38,38) | 55095 | 233928 | 233928 | 399 | 65\.14 | 0 | 0 | [clipped] |
| 23 | Clip | INT8 | NPU | (1,96,38,38) | (1,96,38,38) | 42297 | 0 | 42297 | 153 | \ | 0 | 0 | [clipped] |
| 24 | Conv | INT8 | NPU | (1,192,38,38) | (1,64,38,38) | 58609 | 34656 | 58609 | 144 | 26\.74 | 0 | 0 | [clipped] |

<!-- source: EN PDF p140; unit 1511 -->

Рисунок 8-5 Анализ производительности операторов NPU

<!-- source: EN PDF p140; unit 1512 -->

В третьем слое DDR Cycles намного больше NPU Cycles: чтение/запись требует больше циклов, чем вычисления. Значит, Conv ограничен пропускной способностью.

<!-- source: EN PDF p140; unit 1513 -->

В двенадцатом слое DDR Cycles намного меньше NPU Cycles: чтение/запись требует меньше циклов, чем вычисления. Значит, Conv ограничен вычислительной мощностью.

<!-- source: EN PDF p140; unit 1514 -->

Сейчас колонка NPU Cycles показывает циклы только для Conv; другие типы операторов планируется добавить позже.

<!-- source: EN PDF p140; unit 1515 -->

### 8\.3 Ускорение квантованием

<!-- source: EN PDF p140; unit 1516 -->

Квантование существенно уменьшает вычисления и расход пропускной способности. Кроме того, вычислительная мощность INT8 у NPU значительно выше FP16, поэтому модель может сильно ускориться. Рекомендуется развёртывать квантованные модели; способы описаны во введении в квантование.

<!-- source: EN PDF p140; unit 1517 -->

### 8\.4 Оптимизация графа

<!-- source: EN PDF p140; unit 1518 -->

Оптимизация графа позволяет координировать улучшения модели в целом. После выявления длительных операторов или подграфов граф можно преобразовывать разными способами. Основные цели — убрать избыточные операторы, перенести операции на NPU и использовать эффективные для оборудования операторы. Цели иногда противоречат друг другу: перенос на NPU может потребовать дополнительных операторов. Это формально увеличивает их число, но оправдано улучшением общей производительности инференса.

<!-- source: EN PDF p141; unit 1519 -->

RKNN-Toolkit2 уже частично оптимизирует граф при преобразовании модели. Однако этот процесс не универсален: в неучтённых сценариях остаются лишние операции. Пользователь может предварительно оптимизировать граф по идеям этого раздела. Методы носят ознакомительный, необязательный характер и применяются гибко по ситуации.

<!-- source: EN PDF p141; unit 1520 -->

#### 8\.4.1 Перенос OP на NPU

<!-- source: EN PDF p141; unit 1521 -->

Операторы вне NPU можно заменять эквивалентными преобразованиями графа на поддерживаемые NPU операторы.

<!-- source: EN PDF p141; unit 1522 -->

Ниже на примере shufflenetv2\_0.5 перемешивание каналов заменяется свёрткой. Веса 0/1 обеспечивают перестановку данных. Если Transpose и Reshape не реализуются на NPU, их можно включить в Conv для выполнения перестановки.

<!-- source: EN PDF p141; unit 1523 -->

![Рисунок 8-6 Перестановка с помощью свёртки](/docs/rockchip-rknn-sdk-user-guide/assets/en-p141-figure-01.png)

<!-- source: EN PDF p141; unit 1524 -->

Рисунок 8-6 Перестановка с помощью свёртки

<!-- source: EN PDF p141; unit 1525 -->

#### 8\.4.2 Аппаратное слияние при проектировании сети и оптимизации графа

<!-- source: EN PDF p141; unit 1526 -->

NPU поддерживает слияние некоторых операторов. Их порядок можно скорректировать под правила аппаратного слияния.

<!-- source: EN PDF p141; unit 1527 -->

Оптимизация графа в RKNN не охватывает все случаи. Некоторые теоретически сливаемые структуры не объединяются в итоговом графе. Пользователь может вручную изменить алгоритм для устранения проблемы.

<!-- source: EN PDF p141; unit 1528 -->

Например, перестановка Transpose и Clip без изменения правильности вычислений позволяет слить Conv и Clip и повысить производительность.

<!-- source: EN PDF p142; unit 1529 -->

![Рисунок 8-7 Оптимизация и слияние графа операторов](/docs/rockchip-rknn-sdk-user-guide/assets/en-p142-figure-01.png)

<!-- source: EN PDF p142; unit 1530 -->

Рисунок 8-7 Оптимизация и слияние графа операторов

<!-- source: EN PDF p142; unit 1531 -->

Правила аппаратного слияния:

<!-- source: EN PDF p142; unit 1532 -->

| Поддерживаемые правила слияния | Правила слияния, запланированные на будущее |
| --- | --- |
| Conv+Relu | Activation+Add(Mul) |
| Conv+PRelu(LeakyRelu) | Add(Mul)+Activation |
| Conv+Clip | Conv+Mul |
| Conv+Sigmoid(Tanh/Elu/Silu...) | Conv+Activation+Mul |
| Conv+Add | Conv+Activation+Pooling |
| Conv+Activation+Add | Conv+Activation+Add(Mul)+Pooling |

<!-- source: EN PDF p142; unit 1533 -->

#### 8\.4.3 Преобразование подграфа

<!-- source: EN PDF p142; unit 1534 -->

Иногда алгоритм ради наглядности не учитывает производительность при развёртывании, создавая сложный избыточный граф. Эквивалентные преобразования участка графа уменьшают число вычислительных шагов.

<!-- source: EN PDF p142; unit 1535 -->

Ниже эквивалентное преобразование Yolov5-nano объединяет несколько сложных Slice с Conv в новый Conv и значительно упрощает граф.

<!-- source: EN PDF p142; unit 1536 -->

Источник решения: https://github.com/ultralytics/yolov5/issues/4825

<!-- source: EN PDF p143; unit 1537 -->

![Рисунок 8-8 Эквивалентное преобразование графа](/docs/rockchip-rknn-sdk-user-guide/assets/en-p143-figure-01.png)

<!-- source: EN PDF p143; unit 1538 -->

Рисунок 8-8 Эквивалентное преобразование графа

<!-- source: EN PDF p143; unit 1539 -->

#### 8\.4.4 «Приведение подобных» и «Вынесение общего множителя»

<!-- source: EN PDF p143; unit 1540 -->

Последовательные повторные операции можно объединить в один оператор, например Reshape, Transpose, Slice, некоторые Add/Mul/Sub/Div.

<!-- source: EN PDF p143; unit 1541 -->

Ниже сходные операторы объединяются простым изменением порядка в графе.

<!-- source: EN PDF p143; unit 1542 -->

![Рисунок 8-9 Объединение подобных операторов](/docs/rockchip-rknn-sdk-user-guide/assets/en-p143-figure-02.png)

<!-- source: EN PDF p143; unit 1543 -->

Рисунок 8-9 Объединение подобных операторов

<!-- source: EN PDF p143; unit 1544 -->

В некоторых структурах общие части можно выделить в одну операцию, изменив порядок однотипных операций.

<!-- source: EN PDF p143; unit 1545 -->

Например, перестановка операторов позволяет вынести reshape отдельно и выполнить его только один раз.

<!-- source: EN PDF p144; unit 1546 -->

![Рисунок 8-10 Объединение повторяющихся операторов](/docs/rockchip-rknn-sdk-user-guide/assets/en-p144-figure-01.png)

<!-- source: EN PDF p144; unit 1547 -->

Рисунок 8-10 Объединение повторяющихся операторов

<!-- source: EN PDF p144; unit 1548 -->

### 8\.5 Оптимизация отдельных операторов

<!-- source: EN PDF p144; unit 1549 -->

Оптимизация операторов более адресная: изменение конкретных операторов дополнительно повышает производительность. Важен выбор размеров, наиболее эффективных для оборудования. Операторы близкого масштаба могут сильно различаться по времени при выровненных и невыровненных размерах: для последних аппаратуре нужны дополнительные операции для корректности. Поэтому размеры существенно влияют на скорость. Ниже приведены идеи оптимизации.

<!-- source: EN PDF p144; unit 1550 -->

#### 8\.5.1 Размеры OP, удобные для DDR (необязательно)

<!-- source: EN PDF p144; unit 1551 -->

Определённые выровненные размеры повышают эффективность NPU и чтения/записи DDR. При одинаковой пропускной способности более удобный доступ лучше использует DDR и повышает производительность. Ниже приведены необязательные рекомендации по размерам.

<!-- source: EN PDF p144; unit 1552 -->

Требования к выравниванию каналов

<!-- source: EN PDF p144; unit 1553 -->

Требования приведены в таблице ниже.

<!-- source: EN PDF p144; unit 1554 -->

Таблица 8-1 RK3566/RK3568

<!-- source: EN PDF p144; unit 1555 -->

|  | Conv |  | Depthwise Conv | Другие OP |
| --- | --- | --- | --- | --- |
| Тип данных | Каналы<br>входа | Каналы<br>выхода | Каналы входа<br>и выхода | Каналы входа<br>и выхода |
| Int8 | 32 | 16 | 32 | 8 |
| Int16 | 16 | 8 | 16 | 4 |
| Float16 | 16 | 8 | 16 | 4 |
| BFloat16 | 16 | 8 | 16 | 4 |

<!-- source: EN PDF p145; unit 1556 -->

Таблица 8-2 RK3588/RK3576/RV1126B

<!-- source: EN PDF p145; unit 1557 -->

|  | Conv |  | Depthwise Conv | Другие OP |
| --- | --- | --- | --- | --- |
| Тип данных | Каналы<br>входа | Каналы<br>выхода | Каналы входа<br>и выхода | Каналы входа<br>и выхода |
| Int8 | 32 | 32 | 64 | 16 |
| Int16 | 32 | 16 | 32 | 8 |
| Float16 | 32 | 16 | 32 | 8 |
| BFloat16 | 32 | 16 | 32 | 8 |
| TFloat32 | 16 | 16 | 16 | 4 |

<!-- source: EN PDF p145; unit 1558 -->

Таблица 8-3 RV1106/RV1103

<!-- source: EN PDF p145; unit 1559 -->

|  | Conv |  | Depthwise Conv | Другие OP |
| --- | --- | --- | --- | --- |
| Тип данных | Каналы<br>входа | Каналы<br>выхода | Каналы входа<br>и выхода | Каналы входа<br>и выхода |
| Int8 | 32 | 16 | 32 | 16 |
| Int16 | 16 | 16 | 16 | 8 |

<!-- source: EN PDF p145; unit 1560 -->

Таблица 8-4 RK3562

<!-- source: EN PDF p145; unit 1561 -->

|  | Conv |  | Depthwise Conv | Другие OP |
| --- | --- | --- | --- | --- |
| Тип данных | Каналы<br>входа | Каналы<br>выхода | Каналы входа<br>и выхода | Каналы входа<br>и выхода |
| Int8 | 32 | 16 | 32 | 16 |
| Int16 | 32 | 8 | 16 | 8 |
| Float16 | 32 | 8 | 16 | 8 |
| BFloat16 | 32 | 8 | 16 | 8 |
| TFloat32 | 16 | 8 | 8 | 4 |

<!-- source: EN PDF p145; unit 1562 -->

Выравнивание по 4 при Height \* Width &gt; 1

<!-- source: EN PDF p145; unit 1563 -->

При одинаковом размере оператор с большей Width и меньшей Height удобнее для DDR. На рисунке справа свёртка эффективнее, чем слева.

<!-- source: EN PDF p146; unit 1564 -->

![Рисунок 8-11 Сравнение свёрток одинакового размера](/docs/rockchip-rknn-sdk-user-guide/assets/en-p146-figure-01.png)

<!-- source: EN PDF p146; unit 1565 -->

Рисунок 8-11 Сравнение свёрток одинакового размера

<!-- source: EN PDF p146; unit 1566 -->

#### 8\.5.2 Проектирование операторов с высокой утилизацией

<!-- source: EN PDF p146; unit 1567 -->

Для высокого использования вычислительных ресурсов нужно избегать неэффективных операторов и выбирать размеры, обеспечивающие высокую утилизацию. Далее перечислены нежелательные операторы и рассмотрена связь размера свёртки с утилизацией.

<!-- source: EN PDF p146; unit 1568 -->

Избегайте неэффективных операторов

<!-- source: EN PDF p146; unit 1569 -->

По возможности уменьшайте количество следующих трёх типов операторов.

<!-- source: EN PDF p146; unit 1570 -->

Таблица 8-5 Три типа неэффективных операторов

<!-- source: EN PDF p146; unit 1571 -->

| Перенос данных | Преобразование размеров | Функция активации, отличная от Relu |
| --- | --- | --- |
| Transpose | Resize | Sigmoid |
| Reshape | Tile | Tanh |
| Split | Pooling | Softplus |
| Concat | Pad | Hardswish |

<!-- source: EN PDF p146; unit 1572 -->

Связь размера свёртки с утилизацией

<!-- source: EN PDF p146; unit 1573 -->

На свёртку влияют и вычислительная мощность, и пропускная способность. Поэтому при оценке производительности часто используют утилизацию MAC как показатель использования аппаратной вычислительной мощности.

<!-- source: EN PDF p146; unit 1574 -->

Эта связь рассматривается как ориентир при проектировании моделей. Ниже приведены приблизительные рекомендации на основе эмпирических данных:

<!-- source: EN PDF p146; unit 1575 -->

Обозначения: KH — высота ядра, KW — ширина ядра, KC — число каналов ядра, type\_bytes — разрядность веса, делённая на 8, Ksize — KW или KH, Kstride — шаг в направлении KW или KH.

<!-- source: EN PDF p146; unit 1576 -->

Если число каналов входного и выходного Tensor свёртки отвечает требованиям выравнивания (см. таблицу в 8.4.1), утилизация выше.

<!-- source: EN PDF p146; unit 1577 -->

При числе каналов входного Tensor &lt; 256 утилизация относительно высокая. При &gt; 512 она постепенно снижается с ростом числа каналов.

<!-- source: EN PDF p147; unit 1578 -->

Для размера весов утилизация относительно высока при KH\* KW \* KC \* type\_bytes &lt; 6K Bytes. После превышения некоторого размера она заметно падает.

<!-- source: EN PDF p147; unit 1579 -->

Чем больше отношение Ksize / Kstride, тем выше утилизация. Например, Ksize=3, Kstride=1 лучше, чем Ksize=2, Kstride=1.

<!-- source: EN PDF p147; unit 1580 -->

Утилизация снижается при Height \* Width выходного Tensor &lt; 16.

<!-- source: EN PDF p147; unit 1581 -->

Чем больше Channel выходного Tensor, тем выше утилизация.

<!-- source: EN PDF p147; unit 1582 -->

Выше отдельные размеры рассматривались независимо. Реальная утилизация MAC свёртки в развёрнутой модели определяется сочетанием многих факторов.

<!-- source: EN PDF p147; unit 1583 -->

#### 8\.5.3 Слияние подграфов

<!-- source: EN PDF p147; unit 1584 -->

RKNN сопоставляет определённые связи графа пользовательским операторам, как показано ниже. Если слияния не произошло, проверьте, не отличается ли структура соединений от ожидаемой.

<!-- source: EN PDF p147; unit 1585 -->

![Рисунок 8-12 Слияние подграфа Glu](/docs/rockchip-rknn-sdk-user-guide/assets/en-p147-figure-01.png)

<!-- source: EN PDF p147; unit 1586 -->

Рисунок 8-12 Слияние подграфа Glu

<!-- source: EN PDF p148; unit 1587 -->

![Рисунок 8-13 Слияние подграфа LayerNorm](/docs/rockchip-rknn-sdk-user-guide/assets/en-p148-figure-01.png)

<!-- source: EN PDF p148; unit 1588 -->

Рисунок 8-13 Слияние подграфа LayerNorm

<!-- source: EN PDF p148; unit 1589 -->

Поддерживаемые правила слияния:

<!-- source: EN PDF p148; unit 1590 -->

Split + Sigmoid + Mul -&gt; GLU

<!-- source: EN PDF p148; unit 1591 -->

ReduceMean + Sub + Pow + ReduceMean + Add + Sqrt + Div (+ Mul + Add) -&gt; LayerNorm

<!-- source: EN PDF p148; unit 1592 -->

## 9 Оптимизация использования памяти

<!-- source: EN PDF p148; unit 1593 -->

### 9\.1 Состав памяти и методы анализа

<!-- source: EN PDF p148; unit 1594 -->

#### 9\.1.1 Состав памяти при выполнении модели RKNN

<!-- source: EN PDF p148; unit 1595 -->

Память времени выполнения RKNN в основном состоит из четырёх частей: веса и внутренние тензоры, конфигурации регистров, входные тензоры и выходные тензоры. Обычно память создаётся при rknn\_init.

<!-- source: EN PDF p148; unit 1596 -->

#### 9\.1.2 Анализ памяти модели

<!-- source: EN PDF p148; unit 1597 -->

После rknn\_init() при необходимости проверить выделенную модели память или выделить веса внешним способом вызовите rknn\_query с RKNN\_QUERY\_MEM\_SIZE. Так запрашиваются веса и внутренняя память модели без входов/выходов, а также занятые при инференсе DMA- и SRAM-память. Для SRAM возвращается 0, если она не включена либо функция отсутствует.

<!-- source: EN PDF p148; unit 1598 -->

Пример кода:

<!-- source: EN PDF p148; unit 1599 -->

```text
 rknn_context ctx = 0;
 // Load RKNN Model
 int ret = rknn_init(&ctx, model_path, 0, NULL, NULL);
 if (ret < 0) {
  printf("rknn_init fail! ret=%d\n", ret);
  return -1;
 }

 // Get weight and internal mem size
 rknn_mem_size mem_size;
 ret = rknn_query(ctx, RKNN_QUERY_MEM_SIZE, &mem_size, sizeof(mem_size));
 if (ret != RKNN_SUCC) {
  printf("rknn_query fail! ret=%d\n", ret);
  return -1;
 }
 printf("total weight size: %d, total internal size: %d\n", mem_size.total_weight_size, mem_size.total_internal_size);
```

<!-- source: EN PDF p149; unit 1601 -->

### 9\.2 Использование памяти, выделенной извне

<!-- source: EN PDF p149; unit 1602 -->

#### 9\.2.1 Внешнее выделение памяти входов и выходов

<!-- source: EN PDF p149; unit 1603 -->

Как описано в процессе C API Zero-Copy, при использовании zero-copy API можно выделить входные и выходные тензоры извне, затем передать эту память NPU. Подробный порядок приведён на блок-схеме C API Zero-Copy. Внешнее выделение требует именно zero-copy API. Такой способ предназначен прежде всего для случаев, когда приложение само выделяет память NPU вместо вызова rknn\_create\_mem().

<!-- source: EN PDF p149; unit 1604 -->

Внешняя память описывается физическим адресом или fd; используются главным образом следующие два интерфейса:

<!-- source: EN PDF p149; unit 1605 -->

rknn\_create\_mem\_from\_phys(): создаёт структуру rknn\_tensor\_mem по физическому адресу.

<!-- source: EN PDF p149; unit 1606 -->

rknn\_create\_mem\_from\_fd(): создаёт структуру rknn\_tensor\_mem по fd.

<!-- source: EN PDF p149; unit 1607 -->

Ниже показан пример выделения памяти через mpi mmz. rknn\_create\_mem\_from\_phys() использует физический адрес внешней памяти для создания структуры rknn\_tensor\_mem с информацией о физической памяти.

<!-- source: EN PDF p149; unit 1608 -->

```text
......

// Create input tensor memory
rknn_tensor_mem* input_mems[1];
// default input type is int8 (normalize and quantize need compute in outside)
// if set uint8, will fuse normalize and quantize to npu
input_attrs[0].type = input_type;
// default fmt is NHWC, npu only support NHWC in zero copy mode
input_attrs[0].fmt = input_layout;

input_mems[0] = rknn_create_mem_from_phys(ctx, input_phys, input_virt, input_attrs[0].size_with_stride);

......

// Create output tensor memory
rknn_tensor_mem* output_mems[io_num.n_output];
for (uint32_t i = 0; i < io_num.n_output; ++i) {
  output_mems[i] = rknn_create_mem_from_phys(ctx, output_physs[i], output_virts[i], output_attrs[i].size);
}

// Set input tensor memory
ret = rknn_set_io_mem(ctx, input_mems[0], &input_attrs[0]);
if (ret < 0) {
  printf("rknn_set_io_mem fail! ret=%d\n", ret);
  return -1;
}

// Set output tensor memory
for (uint32_t i = 0; i < io_num.n_output; ++i) {
  // set output memory and attribute
  ret = rknn_set_io_mem(ctx, output_mems[i], &output_attrs[i]);
  if (ret < 0) {
    printf("rknn_set_io_mem fail! ret=%d\n", ret);
    return -1;
  }
}
```

<!-- source: EN PDF p150; unit 1610 -->

Кроме физического адреса внешнюю память можно подключить через fd. Пример кода:

<!-- source: EN PDF p150; unit 1611 -->

```text
int mb_flags = RK_MMZ_ALLOC_TYPE_CMA | RK_MMZ_ALLOC_UNCACHEABLE;

// Allocate weight memory in outside
MB_BLK weight_mb;
rknn_tensor_mem* weight_mem;
ret = RK_MPI_MMZ_Alloc(&weight_mb, mem_size.total_weight_size, mb_flags);
if (ret < 0) {
  printf("RK_MPI_MMZ_Alloc failed, ret: %d\n", ret);
  return ret;
}
void* weight_virt = RK_MPI_MMZ_Handle2VirAddr(weight_mb);
if (weight_virt == NULL) {
  printf("RK_MPI_MMZ_Handle2VirAddr failed!\n");
  return -1;
}
int weight_fd = RK_MPI_MMZ_Handle2Fd(weight_mb);
if (weight_fd < 0) {
  printf("RK_MPI_MMZ_Handle2Fd failed!\n");
  return -1;
}
weight_mem = rknn_create_mem_from_fd(ctx, weight_fd, weight_virt, mem_size.total_weight_size, 0);
printf("weight mb info: virt = %p, fd = %d, size: %d\n", weight_virt, weight_fd, mem_size.total_weight_size);
```

<!-- source: EN PDF p150; unit 1612 -->

#### 9\.2.2 Внешнее выделение памяти модели

<!-- source: EN PDF p150; unit 1613 -->

Как отмечалось в разделе о составе и анализе памяти, память модели разделена на внутреннюю память и память весов. Чтобы использовать внешнюю память, приложение задаёт память весов через rknn\_set\_weight\_mem(), а внутреннюю — через rknn\_set\_internal\_mem(). Пример кода:

<!-- source: EN PDF p150; unit 1614 -->

```text
// Load RKNN Model
ret = rknn_init(&ctx, model_virt, model_size, RKNN_FLAG_MEM_ALLOC_OUTSIDE, NULL);
TIME_END(rknn_init);
if (ret < 0) {
  printf("rknn_init fail! ret=%d\n", ret);
  return -1;
}

//query and inset input / output tensor
......

// Allocate weight memory in outside
MB_BLK weight_mb;
rknn_tensor_mem* weight_mem;
ret = RK_MPI_MMZ_Alloc(&weight_mb, SIZE_ALIGN_128(mem_size.total_weight_size), mb_flags);
void* weight_virt = RK_MPI_MMZ_Handle2VirAddr(weight_mb);
int weight_fd = RK_MPI_MMZ_Handle2Fd(weight_mb);

weight_mem = rknn_create_mem_from_fd(ctx, weight_fd, weight_virt, mem_size.total_weight_size, 0);

ret = rknn_set_weight_mem(ctx, weight_mem);
if (ret < 0) {
  printf("rknn_set_weight_mem fail! ret=%d\n", ret);
  return -1;
}
printf("weight mb info: virt = %p, fd = %d, size: %d\n", weight_virt, weight_fd, mem_size.total_weight_size);

// Allocate internal memory in outside
MB_BLK internal_mb;
rknn_tensor_mem* internal_mem;
ret = RK_MPI_MMZ_Alloc(&internal_mb, SIZE_ALIGN_128(mem_size.total_internal_size), mb_flags);
void* internal_virt = RK_MPI_MMZ_Handle2VirAddr(internal_mb);
int internal_fd = RK_MPI_MMZ_Handle2Fd(internal_mb);

internal_mem = rknn_create_mem_from_fd(ctx, internal_fd, internal_virt, mem_size.total_internal_size, 0);
ret = rknn_set_internal_mem(ctx, internal_mem);
if (ret < 0) {
  printf("rknn_set_internal_mem fail! ret=%d\n", ret);
  return -1;
}
printf("internal mb info: virt = %p, fd = %d, size: %d\n", internal_virt, internal_fd, mem_size.total_internal_size);
```

<!-- source: EN PDF p151; unit 1616 -->

### 9\.3 Повторное использование внутренней памяти

<!-- source: EN PDF p151; unit 1617 -->

RKNN API позволяет управлять NPU-памятью извне. Флаг RKNN\_FLAG\_MEM\_ALLOC\_OUTSIDE указывает, что память промежуточных признаков модели выделяется внешним способом. Типичные применения:

<!-- source: EN PDF p151; unit 1618 -->

При развёртывании пользователь выделяет всю NPU-память сам, что позволяет согласованно распределить память всей системы.

<!-- source: EN PDF p151; unit 1619 -->

При последовательном запуске нескольких моделей память промежуточных признаков повторно используется разными контекстами; особенно полезно для RV1103/RV1106 с очень ограниченной памятью.

<!-- source: EN PDF p151; unit 1620 -->

В исходной схеме Internal Tensor модели 1 больше, чем модели 2. При последовательном выполнении приложение может выделить для обеих моделей один общий участок 0x00000000~0x000c4000. После инференса модели 1 модель 2 использует тот же участок для чтения/записи Internal Tensor, экономя память. Это схематические адреса исходника, не проверенные адреса платы.

<!-- source: EN PDF p152; unit 1621 -->

![Рисунок 9-1. Два Internal Tensor разных моделей используют общее адресное пространство](/docs/rockchip-rknn-sdk-user-guide/assets/en-p152-figure-01.png)

<!-- source: EN PDF p152; unit 1622 -->

Рисунок 9-1. Два Internal Tensor разных моделей используют общее адресное пространство

<!-- source: EN PDF p152; unit 1623 -->

Пусть пути моделей 1 и 2 — model\_path\_a и model\_path\_b. Пример кода:

<!-- source: EN PDF p152; unit 1624 -->

```text
rknn_init(&ctx_a, model_path_a, 0, RKNN_FLAG_MEM_ALLOC_OUTSIDE, NULL);
rknn_query(ctx_a, RKNN_QUERY_MEM_SIZE, &mem_size_a, sizeof(mem_size_a));

rknn_init(&ctx_b, model_path_b, 0, RKNN_FLAG_MEM_ALLOC_OUTSIDE, NULL);
rknn_query(ctx_b, RKNN_QUERY_MEM_SIZE, &mem_size_b, sizeof(mem_size_b));

// Get the largest internal size of the two models
max_internal_size = MAX(mem_size_a.total_internal_size, mem_size_b.total_internal_size);
internal_mem_max = rknn_create_mem(ctx_a, max_internal_size);
// Set a model internal memory
internal_mem_a = rknn_create_mem_from_fd(ctx_a, internal_mem_max->fd,
internal_mem_max->virt_addr, mem_size_a.total_internal_size, 0);
rknn_set_internal_mem(ctx_a, internal_mem_a);
// Set b model internal memory
internal_mem_b = rknn_create_mem_from_fd(ctx_b, internal_mem_max->fd,
internal_mem_max->virt_addr, mem_size_b.total_internal_size, 0);
rknn_set_internal_mem(ctx_b, internal_mem_b);
```

<!-- source: EN PDF p153; unit 1625 -->

### 9\.4 Повторное использование контекста RKNN в нескольких потоках

<!-- source: EN PDF p153; unit 1626 -->

В многопоточной программе одну модель могут выполнять несколько потоков одновременно. Если каждый создаёт собственный контекст, расход памяти велик. Поэтому приложение может рассмотреть совместное использование контекста, чтобы избежать повторного выделения RKNN-контекста и уменьшить память времени выполнения.

<!-- source: EN PDF p153; unit 1627 -->

RKNN API предоставляет интерфейс повторного использования контекста:

<!-- source: EN PDF p153; unit 1628 -->

```text
int rknn_dup_context(rknn_context* context_in,rknn_context* context_out)
```

<!-- source: EN PDF p153; unit 1629 -->

context\_in — уже инициализированный контекст; context\_out — контекст, повторно использующий context\_in.

<!-- source: EN PDF p153; unit 1630 -->

На следующей схеме структуры моделей двух контекстов одинаковы, поэтому возможно повторное использование контекстов.

<!-- source: EN PDF p153; unit 1631 -->

![Рисунок 9-2. Повторное использование контекстов для двух одинаковых моделей](/docs/rockchip-rknn-sdk-user-guide/assets/en-p153-figure-01.png)

<!-- source: EN PDF p153; unit 1632 -->

Рисунок 9-2. Повторное использование контекстов для двух одинаковых моделей

<!-- source: EN PDF p153; unit 1633 -->

### 9\.5 Общие веса моделей с разным разрешением

<!-- source: EN PDF p153; unit 1634 -->

Если веса моделей с разными разрешениями одинаковы, они могут совместно использовать память весов. В RKNPU SDK &lt;= 1.5.0 это позволяет динамически переключать разрешения при небольшом расходе памяти; после 1.5.0 источник указывает замену данного механизма функцией dynamic shape.

<!-- source: EN PDF p153; unit 1635 -->

На следующей схеме веса моделей A и B полностью совпадают.

<!-- source: EN PDF p154; unit 1636 -->

![Рисунок 9-3. Общие веса двух моделей с разными разрешениями](/docs/rockchip-rknn-sdk-user-guide/assets/en-p154-figure-01.png)

<!-- source: EN PDF p154; unit 1637 -->

Рисунок 9-3. Общие веса двух моделей с разными разрешениями

<!-- source: EN PDF p154; unit 1638 -->

Совместное использование весов моделей с разными разрешениями реализуется так:

<!-- source: EN PDF p154; unit 1639 -->

1\. При преобразовании RKNN одну модель задайте как master с remove\_weight=False в rknn.config, другую — как slave с remove\_weight=True. Master-модель RKNN содержит веса; slave-модель не содержит весов свёрточного типа.

<!-- source: EN PDF p154; unit 1640 -->

2\. При развёртывании сначала инициализируйте master-модель RKNN, затем slave. Для slave используйте RKNN\_FLAG\_SHARE\_WEIGHT\_MEM и добавьте параметр rknn\_init\_extend с контекстом master-модели. Пусть пути моделей — model\_A и model\_B. Пример кода:

<!-- source: EN PDF p154; unit 1641 -->

```text
rknn_context context_A;
rknn_context context_B;
ret = rknn_init(&context_A,model_A,0,0,NULL);
...
rknn_init_extend extend;
extend.ctx = context_A;
ret = rknn_init(&context_B,model_B,0,RKNN_FLAG_SHARE_WEIGHT_MEM,&extend);
```

<!-- source: EN PDF p155; unit 1642 -->

## 10 Устранение неполадок

<!-- source: EN PDF p155; unit 1643 -->

### 10\.1 Проблемы окружения NPU SDK

<!-- source: EN PDF p155; unit 1644 -->

Совместимость версий

<!-- source: EN PDF p155; unit 1645 -->

Драйвер ядра NPU и Runtime

<!-- source: EN PDF p155; unit 1646 -->

Рекомендуется обновить драйвер ядра NPU до версии 0.9.2 или новее. При возникновении проблем попробуйте установить последнюю версию драйвера ядра NPU.

<!-- source: EN PDF p155; unit 1647 -->

Модель RKNN (версия определяется RKNN-Toolkit2) и Runtime:

<!-- source: EN PDF p155; unit 1648 -->

Таблица 10-1 Соответствие версий модели RKNN и Runtime

<!-- source: EN PDF p155; unit 1649 -->

| Версия модели RKNN | Версия Runtime |
| --- | --- |
| 1\.2.0 | &gt;=1.2.0 и &lt;=1.5.0 |
| 1\.3.0 | &gt;=1.3.0 и &lt;=1.5.0 |
| 1\.4.0 | &gt;=1.4.0 и &lt;=1.5.0 |
| 1\.5.0 | 1\.5.0 |
| 1\.5.2 | &gt;=1.5.2 |
| 1\.6.0 | &gt;=1.5.2 |
| 2\.0.0 | &gt;=2.0.0 |
| 2\.1.0 | &gt;=2.1.0 |

<!-- source: EN PDF p155; unit 1650 -->

Как обновить драйвер ядра NPU

<!-- source: EN PDF p155; unit 1651 -->

Для обновления драйвера NPU рекомендуется обновить всю прошивку. Соответствующую прошивку должен предоставить производитель платы.

<!-- source: EN PDF p155; unit 1652 -->

Использование NPU в Docker

<!-- source: EN PDF p155; unit 1653 -->

При запуске контейнера Docker сопоставьте ресурсы NPU с указанными путями. Пример команд:

<!-- source: EN PDF p155; unit 1654 -->

```text
docker run -t -i --privileged -v /dev/dri/renderD129:/dev/dri/renderD129 -v /proc/device-tree/compatible:/proc/device-tree/compatible -v /usr/lib/librknnrt.so:/usr/lib/librknnrt.so ai_application:v1.0.0 /bin/bash
```

<!-- source: EN PDF p155; unit 1655 -->

Пояснения параметров:

<!-- source: EN PDF p155; unit 1656 -->

/dev/dri/renderD129 — узел устройства NPU RK3588. Runtime использует этот узел для включения NPU.

<!-- source: EN PDF p155; unit 1657 -->

/proc/device-tree/compatible содержит модель SOC. Такие компоненты, как RKNN-Toolkit Lite2, получают из этого файла сведения о текущем SOC.

<!-- source: EN PDF p155; unit 1658 -->

/usr/lib/librknnrt.so — файл Runtime. RKNN-Toolkit Lite2 и RKNPU2 C API используют его для доступа к ресурсам NPU.

<!-- source: EN PDF p155; unit 1659 -->

ai\_application:v1.0.0 означает &lt;имя образа Docker&gt;:&lt;версия&gt;.

<!-- source: EN PDF p156; unit 1660 -->

### 10\.2 Проблемы установки RKNN-Toolkit2

<!-- source: EN PDF p156; unit 1661 -->

Слишком строгие зависимости мешают установке RKNN-Toolkit2

<!-- source: EN PDF p156; unit 1662 -->

Если все зависимые библиотеки установлены, но версии некоторых из них не соответствуют требованиям, попробуйте добавить --no-deps после команды установки, чтобы отключить проверку окружения при установке Python wheel:

<!-- source: EN PDF p156; unit 1663 -->

```text
pip install rknn-toolkit2*.whl --no-deps
```

<!-- source: EN PDF p156; unit 1664 -->

Зависимость от PyTorch

<!-- source: EN PDF p156; unit 1665 -->

Рекомендуемые версии PyTorch: 1.6.0, 1.9.0, 1.10 или 1.13.1.

<!-- source: EN PDF p156; unit 1666 -->

Функция загрузки моделей PyTorch зависит от библиотеки PyTorch. Модели PyTorch делятся на модели с плавающей точкой и квантованные модели (включая QAT и PTQ).

<!-- source: EN PDF p156; unit 1667 -->

Для моделей, экспортированных PyTorch 1.6.0, рекомендуется понизить версию PyTorch, используемую RKNN-Toolkit2, чтобы избежать ошибок загрузки.

<!-- source: EN PDF p156; unit 1668 -->

Для квантованных моделей (QAT, PTQ) рекомендуется экспорт через PyTorch 1.10~1.13.1 и обновление PyTorch, от которого зависит RKNN-Toolkit2, до 1.10~1.13.1.

<!-- source: EN PDF p156; unit 1669 -->

Итак, версия PyTorch для экспорта модели должна по возможности совпадать с версией PyTorch, используемой RKNN-Toolkit2.

<!-- source: EN PDF p156; unit 1670 -->

Зависимость от TensorFlow

<!-- source: EN PDF p156; unit 1671 -->

Рекомендуемые версии TensorFlow: 2.6.2, 2.8.0.

<!-- source: EN PDF p156; unit 1672 -->

Загрузка моделей TensorFlow в RKNN-Toolkit2 зависит от библиотеки TensorFlow. Совместимость между версиями TensorFlow ограничена, поэтому другие версии могут вызывать ошибки загрузки моделей в RKNN-Toolkit2. Рекомендуется по возможности использовать при экспорте ту же версию Tensorflow, от которой зависит RKNN-Toolkit2.

<!-- source: EN PDF p156; unit 1673 -->

Проблемы из-за версии TensorFlow обычно проявляются на этапе rknn.load\_tensorflow(); сообщение об ошибке указывает путь к зависимой библиотеке TensorFlow.

<!-- source: EN PDF p156; unit 1674 -->

Правила именования установочного пакета RKNN-Toolkit2

<!-- source: EN PDF p156; unit 1675 -->

На примере выпуска 1.5.2 имя wheel-пакета RKNN-Toolkit2 формируется следующим образом:

<!-- source: EN PDF p156; unit 1676 -->

```text
rknn_toolkit2-1.5.2+b642f30c-cp38-cp38-linux_x86_64.whl
```

<!-- source: EN PDF p156; unit 1677 -->

rknn\_toolkit2: имя инструмента.

<!-- source: EN PDF p156; unit 1678 -->

1\.5.2: версия.

<!-- source: EN PDF p156; unit 1679 -->

b642f30c: идентификатор commit.

<!-- source: EN PDF p156; unit 1680 -->

cp&lt;xx&gt;-cp&lt;xx&gt;: поддерживаемая версия Python; например, cp38-cp38 означает Python 3.8.

<!-- source: EN PDF p156; unit 1681 -->

linux\_x86\_64: тип системы и архитектура CPU.

<!-- source: EN PDF p156; unit 1682 -->

Несоответствие типа системы, архитектуры CPU или версии Python приводит к сбою установки RKNN-Toolkit2.

<!-- source: EN PDF p156; unit 1683 -->

Есть ли версия RKNN-Toolkit2 для ARM Linux?

<!-- source: EN PDF p157; unit 1684 -->

Версии для ARM Linux нет. Для инференса через Python в ARM Linux можно установить RKNN-Toolkit-lite2, поддерживающий такой режим.

Сбой установки библиотеки bfloat16

<!-- source: EN PDF p157; unit 1685 -->

При установке библиотеки bfloat16 возникла следующая ошибка:

<!-- source: EN PDF p157; unit 1686 -->

![Рисунок 10-1 Журнал сбоя установки зависимой библиотеки bfloat16](/docs/rockchip-rknn-sdk-user-guide/assets/en-p157-figure-01.png)

Оригинальный скриншот обрезан; перенесён только видимый текст. Невидимые части не восстановлены предположениями.

```text
bfloat16.cc:2013:57: note: expected a type, got ‘bfloat16’
bfloat16.cc:2013:57: error: type/value mismatch at argument 2 in templa
e, class Functor> struct greenwaves::{anonymous}::UnaryUFunc’
bfloat16.cc:2013:57: note: expected a type, got ‘bfloat16’
bfloat16.cc:2015:67: error: ‘>>’ should be ‘> >’ within a nested templa
RegisterUFunc<BinaryUFunc<bfloat16, bfloat16, ufuncs::NextAfter>>(
                                                               ^
bfloat16.cc:2015:58: error: type/value mismatch at argument 1 in templa
e, class Functor> struct greenwaves::{anonymous}::BinaryUFunc’
RegisterUFunc<BinaryUFunc<bfloat16, bfloat16, ufuncs::NextAfter>>(
```

<!-- source: EN PDF p157; unit 1687 -->

Рисунок 10-1 Журнал сбоя установки зависимой библиотеки bfloat16

<!-- source: EN PDF p157; unit 1688 -->

Смените источник pip на Alibaba либо обновите RKNN-Toolkit2 до 1.5.0 или новее (начиная с 1.5.0 зависимость от bfloat16 удалена).

<!-- source: EN PDF p157; unit 1689 -->

### 10\.3 Описание параметров преобразования модели

<!-- source: EN PDF p157; unit 1690 -->

В этом разделе описывается применение часто используемых параметров преобразования модели.

<!-- source: EN PDF p157; unit 1691 -->

Параметры, определяемые моделью

<!-- source: EN PDF p157; unit 1692 -->

При преобразовании модели интерфейсы rknn.config() и rknn.build() влияют на результат. Указание входных и выходных узлов через rknn.load\_onnx и rknn.load\_tensorflow() также влияет на результат, как и размеры входов, задаваемые через rknn.load\_pytorch() и rknn.load\_tensorflow().

<!-- source: EN PDF p157; unit 1693 -->

Основные шаги преобразования модели:

<!-- source: EN PDF p157; unit 1694 -->

1\. Подготовьте данные квантования и файл dataset.txt.

<!-- source: EN PDF p157; unit 1695 -->

2\. Определите платформу NPU, например RK3566 или RV1106, и задайте target\_platform в rknn.config().

<!-- source: EN PDF p157; unit 1696 -->

3\. Если вход — 3-канальное изображение, а данные квантования имеют формат изображения (jpg, png), уточните, использует ли модель RGB или BGR, и задайте quant\_img\_RGB2BGR в rknn.config().

<!-- source: EN PDF p157; unit 1697 -->

4\. Уточните параметры нормализации при обучении модели, чтобы задать mean\_values и std\_values в rknn.config.

<!-- source: EN PDF p157; unit 1698 -->

5\. Уточните размер входа модели и заполните соответствующие параметры интерфейса load, например input\_size\_list в rknn.load\_pytorch().

<!-- source: EN PDF p157; unit 1699 -->

6\. Определите требуемую разрядность квантования, чтобы задать quantized\_dtype в rknn.config(). Если квантование не требуется или загружается уже квантованная модель, этот шаг можно пропустить.

<!-- source: EN PDF p157; unit 1700 -->

7\. Определите алгоритм квантования модели, чтобы задать quantized\_algorithm в rknn.config(). Если квантование не требуется или загружается уже квантованная модель, этот шаг можно пропустить.

<!-- source: EN PDF p158; unit 1701 -->

8\. Определите, требуется ли квантование, чтобы задать do\_quantization в rknn.build(). При включённом квантовании параметр dataset в rknn.build() должен указывать данные квантования.

Межплатформенная совместимость моделей RKNN

<!-- source: EN PDF p158; unit 1702 -->

Для платформы, заданной target\_platform в rknn.config(), действуют следующие отношения совместимости:

<!-- source: EN PDF p158; unit 1703 -->

Модель RKNN для RK3566 можно использовать на RK3568.

<!-- source: EN PDF p158; unit 1704 -->

Модель RKNN для RK3588 можно использовать на RK3588s.

<!-- source: EN PDF p158; unit 1705 -->

Модель RKNN для RV1106 можно использовать на RV1103.

<!-- source: EN PDF p158; unit 1706 -->

Формат и требования к данным квантования

<!-- source: EN PDF p158; unit 1707 -->

Данные квантования имеют два формата: изображения (jpg, png), читаемые RKNN-Toolkit2 через OpenCV, и npy, читаемый через numpy.

<!-- source: EN PDF p158; unit 1708 -->

Если вход модели — не изображение RGB/BGR, рекомендуется предоставлять данные квантования в формате numpy npy.

<!-- source: EN PDF p158; unit 1709 -->

Формат dataset.txt для модели с несколькими входами

<!-- source: EN PDF p158; unit 1710 -->

Для квантования модели файл dataset.txt должен задавать пути к данным. Одна строка представляет один набор входов. Если входов несколько, их записывают в одной строке через пробел.

<!-- source: EN PDF p158; unit 1711 -->

Пример модели с одним входом и двумя наборами данных квантования:

<!-- source: EN PDF p158; unit 1712 -->

```text
sampleA.npy
sampleB.npy
```

<!-- source: EN PDF p158; unit 1713 -->

Пример модели с тремя входами и двумя наборами данных квантования:

<!-- source: EN PDF p158; unit 1714 -->

```text
sampleA_in0.npy sampleA_in1.npy sampleA_in2.npy
sampleB_in0.npy sampleB_in1.npy sampleB_in2.npy
```

<!-- source: EN PDF p158; unit 1715 -->

Проверка quant\_img\_RGB2BGR в rknn.config()

<!-- source: EN PDF p158; unit 1716 -->

При использовании изображений (jpg, png) для квантования нужно учитывать quant\_img\_RGB2BGR.

<!-- source: EN PDF p158; unit 1717 -->

Если модель обучалась на RGB, установите quant\_img\_RGB2BGR=False либо не задавайте его. Для инференса через Python API и RKNPU2 CAPI также подавайте RGB-изображения.

<!-- source: EN PDF p158; unit 1718 -->

Если модель обучалась на BGR, установите quant\_img\_RGB2BGR=True. Для инференса через Python API и RKNPU2 CAPI подавайте BGR-изображения. quant\_img\_RGB2BGR влияет только на чтение изображений при квантовании.

<!-- source: EN PDF p158; unit 1719 -->

Если данные квантования сохранены в numpy npy, рекомендуется не использовать quant\_img\_RGB2BGR во избежание путаницы.

<!-- source: EN PDF p158; unit 1720 -->

Порядок применения mean, std и quant\_img\_RGB2BGR в rknn.config()

<!-- source: EN PDF p158; unit 1721 -->

quant\_img\_RGB2BGR влияет лишь на чтение изображений на этапе квантования, но не на другие этапы.

<!-- source: EN PDF p158; unit 1722 -->

Поэтому в интерфейсах инференса RKNN-Toolkit2 Python API и RKNPU2 C API из входных данных сначала вычитают Mean, затем делят на std и передают в модель RKNN.

<!-- source: EN PDF p159; unit 1723 -->

Настройка mean\_values и std\_values в rknn.config() для модели с числом входных каналов, отличным от 3, или с несколькими входами.

<!-- source: EN PDF p159; unit 1724 -->

Формат настройки mean\_values и std\_values одинаков. Рассмотрим mean\_values.

<!-- source: EN PDF p159; unit 1725 -->

Если вход имеет N каналов, значение mean\_values равно [[channel\_1, channel\_2, channel\_3, channel\_4, ..., channel\_n]].

<!-- source: EN PDF p159; unit 1726 -->

При нескольких входах значение mean\_values равно [[channel\_1, channel\_2, channel\_3, channel\_4, ..., channel\_n], [channel\_1, channel\_2, channel\_3, channel\_4, ..., channel\_n]].

<!-- source: EN PDF p159; unit 1727 -->

Алгоритм квантования и выбор числа изображений

<!-- source: EN PDF p159; unit 1728 -->

RKNN-Toolkit2 предоставляет три алгоритма калибровки параметров квантования через quantized\_algorithm в rknn.config(): normal, mmse и kl\_divergence. По умолчанию используется normal.

<!-- source: EN PDF p159; unit 1729 -->

normal — базовый алгоритм квантования.

<!-- source: EN PDF p159; unit 1730 -->

mmse итеративно обрабатывает результаты промежуточных слоёв и ограничивает значения весов определённым диапазоном для повышения точности инференса. Повышение точности не гарантируется; по сравнению с normal квантование требует больше памяти и времени.

<!-- source: EN PDF p159; unit 1731 -->

kl\_divergence требует больше времени, чем normal, но значительно меньше, чем mmse. В некоторых сценариях с неравномерным распределением признаков он даёт лучшие результаты.

<!-- source: EN PDF p159; unit 1732 -->

Рекомендуется сначала использовать normal. Если точность после квантования неудовлетворительна, попробуйте mmse или kl\_divergence.

<!-- source: EN PDF p159; unit 1733 -->

Для normal и kl\_divergence рекомендуется 20-200 наборов данных; для mmse — 20-50.

<!-- source: EN PDF p159; unit 1734 -->

Различия входов и выходов при инференсе квантованных и неквантованных моделей

<!-- source: EN PDF p159; unit 1735 -->

При использовании общего RKNPU2 C API (без pass\_through и zero\_copy) тип входных данных, например uint8 или float, не зависит от того, квантована ли модель. Выход можно автоматически преобразовать в float32 или сохранить формат модели. При использовании Python-интерфейса инференса имеются отличия, приведённые ниже:

<!-- source: EN PDF p159; unit 1736 -->

Таблица 10-2 Отличия Python-интерфейса инференса от общего C API

<!-- source: EN PDF p159; unit 1737 -->

| После квантования модели | Python-интерфейс инференса (rknn.inference()) | C API инференса (rknn.run())<br>(без pass\_through и zero\_copy) |
| --- | --- | --- |
| Ограничения типа входа | Нет ограничений.<br>Вход rknn.inference() — список массивов numpy с атрибутом типа данных. Вход автоматически преобразуется в тип, требуемый моделью RKNN. | Нет ограничений.<br>Параметр rknn\_tensor\_type структуры rknn\_inputs может задавать RKNN\_TENSOR\_FLOAT32, RKNN\_TENSOR\_FLOAT16, RKNN\_TENSOR\_INT8, RKNN\_TENSOR\_UIN8, RKNN\_TENSOR\_INT16 согласно реальным входным данным. После задания вход автоматически преобразуется в тип, требуемый моделью RKNN. |
| Меняется ли тип выходных данных? | Не меняется.<br>Независимо от квантования Python-интерфейс rknn.inference() всегда возвращает float. Другой тип задать нельзя. | Меняется.<br>В RKNPU2 C API атрибут rknn outputs можно задать как want\_float=1 для получения float. После квантования want\_float=0 возвращает тип, заданный моделью. Например, при квантовании i8 выход имеет тип int8. |
| Меняется ли формат входа (NCHW, NHWC)? | Не меняется.<br>Независимо от квантования параметр data\_format в rknn.inference() можно задавать как nchw или nhwc по необходимости. | Меняется.<br>Независимо от квантования параметр rknn\_tensor\_format структуры rknn inputs можно задавать как NCHW или NHWC по необходимости. |

<!-- source: EN PDF p160; unit 1739 -->

Есть ли режим онлайн-предкомпиляции?

<!-- source: EN PDF p160; unit 1740 -->

RKNN-Toolkit2 поддерживает только экспорт офлайн-предкомпилированных моделей, но не онлайн-предкомпилированных моделей, доступных в RKNN-Toolkit1. Поэтому выбора между этими режимами нет.

<!-- source: EN PDF p160; unit 1741 -->

Можно ли использовать модель, преобразованную RKNN-Toolkit, на RK3566?

<!-- source: EN PDF p160; unit 1742 -->

Нет.

<!-- source: EN PDF p160; unit 1743 -->

Модели RKNN, преобразованные RKNN-Toolkit, предназначены для RK1806 / RK1808 / RK3399Pro / RV1109 / RV1126. Для RK3566 нужна модель, преобразованная RKNN-Toolkit2. Модели RKNN-Toolkit2 подходят для RK2118/ RV1103B/ RV1103 / RV1106B / RV1106 / RV1126B / RK3562 / RK3566 / RK3568 / RK3576/ RK3588.

<!-- source: EN PDF p160; unit 1744 -->

Инструкции по RKNN-Toolkit приведены в проекте: https://github.com/airockchip/rknn-toolkit

<!-- source: EN PDF p160; unit 1745 -->

Инструкции по RKNN-Toolkit2 приведены в проекте: https://github.com/airockchip/rknn-toolkit2

<!-- source: EN PDF p160; unit 1746 -->

### 10\.4 Вопросы о фреймворках глубокого обучения

<!-- source: EN PDF p160; unit 1747 -->

#### 10\.4.1 Фреймворки глубокого обучения и версии, поддерживаемые RKNN-Toolkit2

<!-- source: EN PDF p160; unit 1749 -->

См. раздел 3.1.

<!-- source: EN PDF p160; unit 1750 -->

#### 10\.4.2 Список поддерживаемых операторов каждого фреймворка

<!-- source: EN PDF p160; unit 1751 -->

Уровень поддержки разных фреймворков в RKNN-Toolkit2 различается. Подробности приведены в документе RKNNToolkit2\_OP\_Support по ссылке:

<!-- source: EN PDF p160; unit 1752 -->

https://github.com/airockchip/rknn-toolkit2/blob/master/doc/

<!-- source: EN PDF p161; unit 1753 -->

#### 10\.4.3 Вопросы о преобразовании моделей ONNX

<!-- source: EN PDF p161; unit 1754 -->

Ошибка «Error parsing message» при загрузке модели

<!-- source: EN PDF p161; unit 1755 -->

Например, преобразование модели examples/onnx/resnet50v2 завершается с сообщением:

<!-- source: EN PDF p161; unit 1756 -->

```text
E load_onnx: Catch exception when loading onnx model: /rknn_resnet_demo/resnet50v2.onnx!

E lod_onnx: Traceback (most recent call last):

E load_onnx: File "rknn/api/rknn_base.py", line 1094, in rknn.api.rknn_base.RKNNBase.load_onnx

E load_onnx: File "/usr/local/lib/python3.6/dist-packages/onnx/__init__.py", line 115, in load_model

……

E load_onnx: google.protobuf.message.DecoderError: Error parsing message
```

<!-- source: EN PDF p161; unit 1757 -->

Возможно, resnet50v2.onnx повреждён или загружен не полностью. Скачайте модель заново и проверьте MD5, например:

<!-- source: EN PDF p161; unit 1758 -->

```text
22ed6e6a8fb9192f0980acca0c941414 resnet50v2.onnx
```

<!-- source: EN PDF p161; unit 1759 -->

Поддерживается ли динамическая форма входа?

<!-- source: EN PDF p161; unit 1760 -->

Например, вход ONNX [-1, 3, -1, -1] означает, что batch, height и width не фиксированы. RKNN-Toolkit2 до версии 1.5.2 не поддерживает динамическую форму входа.

<!-- source: EN PDF p161; unit 1761 -->

Версии 1.5.2 и новее поддерживают их через dynamic\_input в rknn.config(); подробности см. в разделе 5.4.

<!-- source: EN PDF p161; unit 1762 -->

Ошибка при задании собственного выходного узла

<!-- source: EN PDF p161; unit 1763 -->

Например, вызов rknn.load\_onnx() с параметром outputs приводит к следующей ошибке:

<!-- source: EN PDF p161; unit 1764 -->

```text
E load_onnx: the '378' in outputs=['378', '439', '500'] is invalied!
```

<!-- source: EN PDF p161; unit 1765 -->

Журнал сообщает, что выходной узел 378 недействителен. Параметр outputs должен содержать правильное имя выходного узла.

<!-- source: EN PDF p161; unit 1766 -->

#### 10\.4.4 Вопросы о преобразовании моделей Pytorch

<!-- source: EN PDF p161; unit 1767 -->

Ошибка загрузки модели Pytorch: у torch.\_C нет атрибута \_jit\_pass\_inline

<!-- source: EN PDF p161; unit 1768 -->

Журнал ошибки:

<!-- source: EN PDF p161; unit 1769 -->

```text
'torch._C' has no attribute '_jit_pass_inline'
```

<!-- source: EN PDF p161; unit 1770 -->

Обновите PyTorch до 1.6.0 или новее.

<!-- source: EN PDF p161; unit 1771 -->

Формат сохранения моделей Pytorch

<!-- source: EN PDF p161; unit 1772 -->

Сейчас поддерживаются только модели, экспортированные через torch.jit.trace(). torch.save() сохраняет лишь словарь весов без структуры сети; такой файл нельзя корректно импортировать и преобразовать в RKNN.

<!-- source: EN PDF p161; unit 1773 -->

Сбой PytorchStreamReader при преобразовании

<!-- source: EN PDF p162; unit 1774 -->

Журнал ошибки:

<!-- source: EN PDF p162; unit 1775 -->

```text
E Catch exception when loading pytorch model: ./mobilenet0.25_Final.pth!

E Traceback (most recent call last):

……

E cpp_module = torch._C.import_ir_module(cu, f, map_location, extra_files)

E RuntimeError: [enforce fail at inline container.cc:137]. PytorchStreamReader failed reading zip archive: faild
finding central directory frame #0 ……
```

<!-- source: EN PDF p162; unit 1776 -->

Причина — отсутствие сведений о структуре сети в модели PyTorch.

<!-- source: EN PDF p162; unit 1777 -->

Файл .pth обычно содержит только веса. Для экспорта модели со структурой сети сначала инициализируйте соответствующую структуру и загрузите веса .pth через net.load\_state\_dict(). Затем зафиксируйте структуру и веса через torch.jit.trace(). Сохраните трассированную модель в .pt с помощью torch.jit.save(); rknn.load\_pytorch() сможет преобразовать её в RKNN.

KeyError при преобразовании

<!-- source: EN PDF p162; unit 1778 -->

Журнал ошибки:

<!-- source: EN PDF p162; unit 1779 -->

```text
E Traceback (most recent call last):

……

E KeyError: 'aten::softmax'
```

<!-- source: EN PDF p162; unit 1780 -->

Сообщение вида KeyError: ‘aten::xxx’ означает, что текущая версия не поддерживает этот оператор. При обновлениях RKNN-Toolkit2 такие ошибки исправляются; используйте последнюю версию.

<!-- source: EN PDF p162; unit 1781 -->

Ошибка «Syntax error in input! LexToken(xxx)» при преобразовании

<!-- source: EN PDF p162; unit 1782 -->

Журнал ошибки:

<!-- source: EN PDF p162; unit 1783 -->

```text
WARNING: Token 'COMMENT' defined, but not used

WARNING: There is 1 unused token

!!!!! Illegal character '"'

Syntax error in input! LexToken(NAMED_IDENTIFIER, 'fc', 1, 27)

!!!!! Illegal character '"'
```

<!-- source: EN PDF p162; unit 1784 -->

Причин может быть несколько. Проверяйте в следующем порядке:

<!-- source: EN PDF p162; unit 1785 -->

1) Сеть создана без наследования torch.nn.module. Создайте её на основе класса torch.nn.module и затем сформируйте pt-файл через torch.jit.trace().

<!-- source: EN PDF p162; unit 1786 -->

2) Обновите RKNN-Toolkit2 до 1.4.0 или новее. Для torch рекомендуются 1.6.0, 1.9.0, 1.10.0 или 1.13.1.

<!-- source: EN PDF p163; unit 1787 -->

#### 10\.4.5 Вопросы о преобразовании моделей Tensorflow

<!-- source: EN PDF p163; unit 1788 -->

Ошибка модели Tensorflow1.x

<!-- source: EN PDF p163; unit 1789 -->

При загрузке модели tensorflow1.x через rknn.load\_tensorflow() появляется сообщение:

<!-- source: EN PDF p163; unit 1790 -->

```text
E load_tensorflow: Catch exception when loading tensorflow model: ./yolov3_mobilenetv2.pb!

E load_tensorflow: Traceback (most recent call last):

……

E load_tensorflow: tensorflow.python.framework.errors_impl.InvalidArgumentError: Node
'MobilenetV2/expanded_conv/depthwise/BatchNorm/cond/Switch_1' expects to be colocated with unknown node
'MobilenetV2/expanded_conv/depthwise/BatchNorm/moving_mean'

E load_tensorflow: During handling of the above exception, another exception occurred:

E load_tensorflow: Traceback (most recent call last):

E load_tensorflow: File "rknn/api/rknn_base.py", line 990, in rknn.api.rknn_base.RKNNBase.load_tensorflow

……

E load_tensorflow: return func(*args, **kwargs)

E load_tensorflow: File "/usr/local/lib/python3.6/dist-packages/tensorflow/python/framework/importer.py", line
431, in import_graph_def

E load_tensorflow: raise ValueError(str(e))

E load_tensorflow: ValueError: Node 'MobilenetV2/expanded_conv/depthwise/BatchNorm/cond/Switch_1' expects
to be colocated with unknown node 'MobilenetV2/expanded_conv/depthwise/BatchNorm/moving_mean'
```

<!-- source: EN PDF p163; unit 1791 -->

Рекомендации:

<!-- source: EN PDF p163; unit 1792 -->

Если установлен TensorFlow 1.x, обновите его до TensorFlow 2.x.

<!-- source: EN PDF p163; unit 1793 -->

Обновите RKNN-Toolkit2/RKNPU2 до последней версии.

<!-- source: EN PDF p163; unit 1794 -->

Ошибка TransformGraph

<!-- source: EN PDF p163; unit 1795 -->

Журнал ошибки:

<!-- source: EN PDF p163; unit 1796 -->

```text
Traceback (most recent call last):

File "test.py", line 80, in <module>

input_size_list=[[1, 368, 368, 3]])

File "/usr/local/lib/python3.6/site-packages/rknn/api/rknn.py", line 68, in load_tensorflow

input_size_list=input_size_list, outputs=outputs)

File "rknn/api/rknn_base.py", line 940, in rknn.api.rknn_base.RKNNBase.load_tensorflow
File "/usr/local/lib/python3.6/dist-packages/tensorflow/tools/graph_transforms/__init__", line 51, in
TransformGraph.transforms_string, status)

File "/usr/local/lib/python3.6/dist-packages/tensorflow/python/framework/errors_impl.py". ;ome 548, in __exit__

C_api.TF_GetCode(self.status.status)

Tensorflow.python.framework.error_impl.InvalidArgumentError: Beta input to batch norm has bad shape: [24]
```

<!-- source: EN PDF p164; unit 1798 -->

Причины:

<!-- source: EN PDF p164; unit 1799 -->

1) RKNN-Toolkit2 вызывает собственную функцию TensorFlow TransformGraph для оптимизации модели, но вызов завершается ошибкой.

<!-- source: EN PDF p164; unit 1800 -->

2) Возможно, версия TensorFlow, использованная при экспорте, несовместима с установленной версией.

<!-- source: EN PDF p164; unit 1801 -->

Рекомендации:

<!-- source: EN PDF p164; unit 1802 -->

Экспортируйте модель с помощью TensorFlow 1.14.0 либо найдите аналогичную модель в другом фреймворке глубокого обучения.

Ошибка «Shape must be rank 4 but is rank 0»

<!-- source: EN PDF p164; unit 1803 -->

При загрузке модели pb следующей командой:

<!-- source: EN PDF p164; unit 1804 -->

```text
  rknn.load_tensorflow(tf_pb='./model.pb',

  inputs=["X","Y"],

  outputs=['generator/xs'],

  input_size_list=1, INPUT_SIZE, INPUT_SIZE, 3)
```

<!-- source: EN PDF p164; unit 1805 -->

Возникает ошибка:

<!-- source: EN PDF p164; unit 1806 -->

```text
  E load_tensorflow: Catch exception when loading tensorflow model: ./model.pb!

  E load_tensorflow: Traceback (most recent call last):

  E load_tensorflow: File "/usr/local/lib/python3.6/dist-packages/tensorflow/python/framework/importer.py", line
427, in import_graph_def

  E load_tensorflow: graph._c_graph, serialized, options) # pylint: disable=protected-access

  E load_tensorflow: tensorflow.python.framework.errors_impl.InvalidArgumentError: Shape must be rank 4 but is
rank 0 for 'generator/conv2d_3/Conv2D' (op: 'Conv2D') with input shapes: [], [7,7,3,32].
```

<!-- source: EN PDF p164; unit 1807 -->

Возможно, модель имеет несколько входов, а input\_size\_list в rknn.load\_tensorflow() заполнен не по спецификации. См. следующий пример в examples/functions/multi\_input\_test:

<!-- source: EN PDF p165; unit 1808 -->

```text
  rknn.load_tensorflow(tf_pb='./conv_128.pb',

  inputs=['input1', 'input2', 'input3', 'input4'],

  outputs=['output'],

  input_size_list=[[1, 128, 128, 3], [1, 128, 128, 3],

  [1, 128, 128, 3], [1, 128, 128, 1]])
```

<!-- source: EN PDF p165; unit 1809 -->

Диагностика ошибок загрузки модели

<!-- source: EN PDF p165; unit 1810 -->

Сначала убедитесь, что исходный фреймворк корректно загружает и вызывает модель.

<!-- source: EN PDF p165; unit 1811 -->

Затем обновите RKNN-Toolkit2 до последней версии. Неподдерживаемые слои или операторы должны быть указаны в отладочном журнале. При необходимости вызовите RKNN(verbose=True), чтобы получить более подробные журналы преобразования.

<!-- source: EN PDF p165; unit 1812 -->

Если проблема остаётся, передайте версию RKNN-Toolkit2 и подробный журнал ошибок команде разработки Rockchip NPU.

<!-- source: EN PDF p165; unit 1813 -->

### 10\.5 Проблемы квантования модели

<!-- source: EN PDF p165; unit 1814 -->

Влияние квантования на размер модели

<!-- source: EN PDF p165; unit 1815 -->

Возможны два случая. Если импортируется квантованная модель, do\_quantization=False в rknn.build() использует её параметры квантования. Если импортируется модель с плавающей точкой, квантование не выполняется, но веса преобразуются из float32 в float16 почти без потери точности. В обоих случаях размер модели и занимаемое ею пространство уменьшаются.

<!-- source: EN PDF p165; unit 1816 -->

Должны ли изображения для квантования иметь тот же размер, что и вход модели?

<!-- source: EN PDF p165; unit 1817 -->

Не обязательно.

<!-- source: EN PDF p165; unit 1818 -->

RKNN-Toolkit2 автоматически изменяет размеры изображений. Однако это может изменить информацию изображения и повлиять на точность квантования, поэтому лучше использовать изображения требуемого входного размера.

<!-- source: EN PDF p165; unit 1819 -->

Если калибровочные данные — не изображения, например npy, их форма должна совпадать с входом модели.

<!-- source: EN PDF p165; unit 1820 -->

Нужно ли менять калибровочные данные согласно rknn\_batch\_size?

<!-- source: EN PDF p165; unit 1821 -->

Не нужно.

<!-- source: EN PDF p165; unit 1822 -->

Параметр rknn\_batch\_size в rknn.build() меняет только размерность batch экспортируемой модели RKNN — с 1 на rknn\_batch\_size — и не влияет на квантование. Поэтому данные калибровки готовят как для модели без пакетной обработки.

<!-- source: EN PDF p165; unit 1823 -->

При квантовании программа преобразования зависает или принудительно завершается

<!-- source: EN PDF p165; unit 1824 -->

В ходе квантования RKNN-Toolkit2 выделяет участки системной памяти, из-за чего программа может зависнуть или быть завершена системой.

<!-- source: EN PDF p165; unit 1825 -->

Решение: увеличьте оперативную память компьютера или виртуальную память (раздел swap).

<!-- source: EN PDF p166; unit 1826 -->

### 10\.6 Проблемы преобразования модели

<!-- source: EN PDF p166; unit 1827 -->

Типичные ошибки преобразования

<!-- source: EN PDF p166; unit 1828 -->

Ошибки преобразования, подобные приведённым ниже, вероятно, вызваны дефектом текущей версии. Попробуйте обновить RKNN-Toolkit2 до последней версии.

<!-- source: EN PDF p166; unit 1829 -->

Ошибка вида infer\_shapes

<!-- source: EN PDF p166; unit 1830 -->

```text
  (op_type:Mul, name:Where_2466_mul): Inferred elem type differs from existing elem type: (FLOAT) vs
(INT64)

  E build: Catch exception when building RKNN model!

  E build: Traceback (most recent call last):

  E build: File "rknn/api/rknn_base.py", line 1555, in rknn.api.rknn_base.RKNNBase.build

  E build: File "rknn/api/graph_optimizer.py", line 5409, in rknn.api.graph_optimizer.GraphOptimizer.run

  E build: File "rknn/api/graph_optimizer.py", line 5123, in
rknn.api.graph_optimizer.GraphOptimizer._fuse_ops

  E build: File "rknn/api/ir_graph.py", line 180, in rknn.api.ir_graph.IRGraph.rebuild

  E build: File "rknn/api/ir_graph.py", line 140, in rknn.api.ir_graph.IRGraph._clean_model

  E build: File "rknn/api/ir_graph.py", line 56, in rknn.api.ir_graph.IRGraph.infer_shapes

  E build: File "/home/anaconda3/envs/rk2/lib/python3.6/site-packages/onnx/shape_inference.py", line 35, in
infer_shapes

  E build: inferred_model_str = C.infer_shapes(model_str, check_type)

  E build: RuntimeError: Inferred elem type differs from existing elem type: (FLOAT) vs (INT64)
```

<!-- source: EN PDF p166; unit 1831 -->

или:

<!-- source: EN PDF p166; unit 1832 -->

```text
  E build: Traceback (most recent call last):

  E build: File "rknn/api/rknn_base.py", line 1643, in rknn.api.rknn_base.RKNNBase.build

  E build: File "rknn/api/graph_optimizer.py", line 6256, in
rknn.api.graph_optimizer.GraphOptimizer.fuse_ops

  E build: File "rknn/api/ir_graph.py", line 285, in rknn.api.ir_graph.IRGraph.rebuild

  E build: File "rknn/api/ir_graph.py", line 149, in rknn.api.ir_graph.IRGraph._clean_model

  E build: File "rknn/api/ir_graph.py", line 62, in rknn.api.ir_graph.IRGraph.infer_shapes

  E build: File "/usr/local/lib/python3.6/dist-packages/onnx/shape_inference.py", line 35, in infer_shapes

  E build: inferred_model_str = C.infer_shapes(model_str, check_type)
  E build: RuntimeError: Inferred shape and existing shape differ in rank: (0) vs (3)
```

<!-- source: EN PDF p167; unit 1834 -->

или:

<!-- source: EN PDF p167; unit 1835 -->

```text
  (op_type:ReduceMax, name:ReduceMax_18): Interred shape and existing shape differ in rank: (3) vs (0)

  E build: Catch exception when building RKNN model!

  E build: Traceback (most recent call last):

  ……

  E build: RuntimeError: Interred shape and existing shape differ in rank: (3) vs (0)
```

<!-- source: EN PDF p167; unit 1836 -->

Ошибка вида \_p\_fuse\_two\_mul

<!-- source: EN PDF p167; unit 1837 -->

```text
  E build: Catch exception when building RKNN model!

  E build: Traceback (most recent call last):

  E build: File "rknn/api/rknn_base.py", line 1643, in rknn.api.rknn_base.RKNNBase.build

  E build: File "rknn/api/graph_optimizer.py", line 6197, in
rknn.api.graph_optimizer.GraphOptimizer.fuse_ops

  E build: File "rknn/api/graph_optimizer.py", line 204, in rknn.api.graph_optimizer._p_fuse_two_mul

  E build: ValueError: non-broadcastable output operand with shape () doesn't match the broadcast shape
(3,2)
```

<!-- source: EN PDF p167; unit 1838 -->

Ошибка вида «Segmentation fault»

<!-- source: EN PDF p167; unit 1839 -->

Например, ошибка преобразования модели picodet:

<!-- source: EN PDF p167; unit 1840 -->

```text
 I _fold_constant remove nodes = ['Shape_0', 'Gather_4', 'Shape_1', 'Gather_6', 'Unsqueeze_0',
'Concat_8', 'Cast_3']

Segmentation fault (Core dumped)
```

<!-- source: EN PDF p167; unit 1841 -->

Ошибка вида \_p\_fuse\_mul\_into\_conv

<!-- source: EN PDF p167; unit 1842 -->

```text
E build: Catch exception when building RKNN model:

……
E build: ValueError: non broadcastable output operand whith shape (1,258,1,256) doesn`t match the
broadcast shape (80256,258,1,256)
```

<!-- source: EN PDF p167; unit 1843 -->

Как определить, поддерживается ли оператор в RKNN

<!-- source: EN PDF p167; unit 1844 -->

Попробуйте преобразовать модель. Если оператор не поддерживается, появится соответствующее сообщение.

<!-- source: EN PDF p167; unit 1845 -->

Также можно обратиться к двум документам поддержки операторов:

<!-- source: EN PDF p167; unit 1846 -->

doc/RKNNToolKit2\_OP\_Support-x.x.x.md в выпуске RKNN-Toolkit2 содержит общий список поддержки для каждого фреймворка.

<!-- source: EN PDF p168; unit 1847 -->

doc/RKNN\_Compiler\_Support\_Operator\_List\_vx.x.x.pdf в выпуске RKNPU2 содержит подробные спецификации операторов RKNN.

Сообщение о том, что ‘expand’ не поддерживается

<!-- source: EN PDF p168; unit 1848 -->

Рекомендации:

<!-- source: EN PDF p168; unit 1849 -->

1\. Новая версия уже поддерживает ‘Expand’ на CPU; попробуйте обновить RKNN-Toolkit2 / RKNPU2 до последней версии.

<!-- source: EN PDF p168; unit 1850 -->

2\. Измените модель, заменив ‘Expand’ на ‘Repeat’.

<!-- source: EN PDF p168; unit 1851 -->

Сообщение «Meet unsupported dims in reducesum»

<!-- source: EN PDF p168; unit 1852 -->

При преобразовании появляется «Meet unsupported dims in reducesum, dims: 6», как показано ниже:

<!-- source: EN PDF p168; unit 1853 -->

```text
D RKNN: [14:54:19.434] >>>>>> start: N4rknn17RKNNInitCastConstE

D RKNN: [14:54:19.434] <<<<<<<< end: N4rknn17RKNNInitCastConstE

D RKNN: [14:54:19.434] >>>>>> start: N4rknn20RKNNMultiSurfacePassE

D RKNN: [14:54:19.434] <<<<<<<< end: N4rknn20RKNNMultiSurfacePassE

D RKNN: [14:54:19.434] >>>>>> start: N4rknn14RKNNTilingPassE

D RKNN: [14:54:19.434] <<<<<<<< end: N4rknn14RKNNTilingPassE

D RKNN: [14:54:19.434] >>>>>> start: N4rknn23RKNNProfileAnalysisPassE

D RKNN: [14:54:19.434] <<<<<<<< end: N4rknn23RKNNProfileAnalysisPassE

D RKNN: [14:54:19.434] >>>>>> start: OpEmit

E RKNN: [14:54:19.438] Meet unsupported dims in reducesum, dims: 6

Aborted (core dumped)
```

<!-- source: EN PDF p168; unit 1854 -->

В настоящее время RKNN не поддерживает 6-мерные операторы. В большинстве случаев поддерживаются только 4 измерения; для других размерностей есть ограничения.

<!-- source: EN PDF p168; unit 1855 -->

Ошибка преобразования из-за NonMaxSuppression

<!-- source: EN PDF p168; unit 1856 -->

RKNN пока не поддерживает операторы постобработки, такие как NonMaxSuppression.

<!-- source: EN PDF p168; unit 1857 -->

Подграф постобработки можно удалить, например:

<!-- source: EN PDF p168; unit 1858 -->

```text
rknn.load_onnx(model='picodet_xxx.onnx', outputs=['concat_4.tmp_0', 'tmp_16'])
```

<!-- source: EN PDF p168; unit 1859 -->

Удалённые подграфы обрабатываются отдельно на CPU.

<!-- source: EN PDF p168; unit 1860 -->

Ошибка вида «invalid expand shape»

<!-- source: EN PDF p168; unit 1861 -->

Например, при преобразовании rvm\_mobilenetv3\_fp32.onnx возникает следующая ошибка:

<!-- source: EN PDF p168; unit 1862 -->

```text
[E:onnxruntime:, sequential_executor.cc:333 Execute] Non-zero status code returned while running Expand node.
Name:'Expand_294' Status Message: invalid expand shape

E build: Catch exception when building RKNN model!
E build: Traceback (most recent call last):

E build: File "rknn/api/rknn_base.py", line 1638, in rknn.api.rknn_base.RKNNBase.build

E build: File "rknn/api/graph_optimizer.py", line 5529, in rknn.api.graph_optimizer.GraphOptimizer.fold_constant

E build: File "rknn/api/session.py", line 69, in rknn.api.session.Session.run

E build: File "/home/cx/work/tools/Anaconda3/envs/rknn/lib/python3.8/site-packages/onnxruntime/capi/onnxruntime_inference_collection.py", line 124, in run

E build: return self._sess.run(output_names, input_feed, run_options)

E build: onnxruntime.capi.onnxruntime_pybind11_state.InvalidArgument: [ONNXRuntimeError] : 2 :
INVALID_ARGUMENT : Non-zero status code returned while running Expand node. Name:'Expand_294' Status
Message: invalid expand shape
```

<!-- source: EN PDF p169; unit 1864 -->

Входное значение downsample\_ratio меняет размер внутренних признаков модели, поэтому такой граф по сути динамический. Рекомендуется изменить логику downsample\_ratio, чтобы входное значение не управляло формой внутренних признаков. Если нужен динамический граф, после обновления RKNN-Toolkit2 до 1.5.2 можно использовать dynamic\_shape для его имитации. При этом всё равно нужно изменить логику downsample\_ratio: входное значение не должно управлять внутренней формой. Сейчас dynamic\_shape поддерживает только изменение формы входа.

<!-- source: EN PDF p169; unit 1865 -->

Ошибка mean\_values в rknn.config()

<!-- source: EN PDF p169; unit 1866 -->

Параметры mean/std заданы так:

<!-- source: EN PDF p169; unit 1867 -->

```text
rknn.config(mean_values=[128, 128, 128], std_values=[128, 128, 128])
```

<!-- source: EN PDF p169; unit 1868 -->

Выдаётся ошибка:

<!-- source: EN PDF p169; unit 1869 -->

```text
--> Loading model

transpose_input for input_1: shape must be rank 4, ignored

E load_tflite: The len of mean_values ([128, 128, 128]) for input 0 is wrong, expect 32!
```

<!-- source: EN PDF p169; unit 1870 -->

Возможно, вход модели — не 3-канальное изображение, например форма равна 1x32. В таком случае:

<!-- source: EN PDF p169; unit 1871 -->

Задайте mean\_values / std\_values согласно числу входных каналов.

<!-- source: EN PDF p169; unit 1872 -->

Если модель не требует mean/std, параметры mean\_values / std\_values в rknn.config можно не задавать; mean/std обычно применимы только к изображениям.

<!-- source: EN PDF p169; unit 1873 -->

Ошибка при числе измерений модели больше 4 (5 или 6)

<!-- source: EN PDF p169; unit 1874 -->

Если модель содержит операторы с более чем 4 измерениями, например 5 или 6, возникает следующая ошибка:

<!-- source: EN PDF p170; unit 1875 -->

```text
E build: Catch exception when building RKNN model!

E build: Traceback (most recent call last):

E build: File "rknn/api/rknn_base.py", line 1580, in rknn.api.rknn_base.RKNNBase.build

E build: File "rknn/api/rknn_base.py", line 341, in rknn.api.rknn_base.RKNNBase._generate_rknn

E build: File "rknn/api/rknn_base.py", line 307, in rknn.api.rknn_base.RKNNBase._biild_rknn

E build: IndexError: vector::_M_range_check: __n (which is 4) >= this->size() (which is 4)
```

<!-- source: EN PDF p170; unit 1876 -->

RKNN сейчас не поддерживает операторы с размерностью выше 4; такие узлы можно удалить вручную.

Поддерживает ли RKNN динамическую свёртку?

<!-- source: EN PDF p170; unit 1877 -->

В настоящее время RK3588/RK3576/RV1126B поддерживают динамическую свёртку с group=1. Остальные платформы пока не поддерживаются.

<!-- source: EN PDF p170; unit 1878 -->

Ошибка «Not support input data type 'float16'»

<!-- source: EN PDF p170; unit 1879 -->

Веса модели, обученной в Pytorch, имеют тип float16; при преобразовании в RKNN возникает ошибка:

<!-- source: EN PDF p170; unit 1880 -->

```text
--> Building model

E build: Not support input data type 'float16'

W build: ==================== WARN(3) =================

E rknn-toolkit2 version: 1.3.0-11912b58

E build: Catch exception when building RKNN model!

E build: Traceback (most recent call last):

E build: File "rknn/api/rknn_base.py", line 1638, in rknn.api.rknn_base.RKNNBase.build

E build: File "rknn/api/graph_optimizer.py", line 5524, in rknn.api.graph_optimizer.GraphOptimzer.fold_constant

E build: File "rknn/api/load_checker.py", line 63, in rknn.api.load_checker.create_random_data

E build: File "rknn/api/rknn_log.py", line 113, in rknn.api.rknn_log.RKNNLog.e

E build: ValueError: Not support input data type 'float16'!
```

<!-- source: EN PDF p170; unit 1881 -->

RKNN-Toolkit2 пока не поддерживает модели Pytorch с весами float16; их нужно перевести в float32.

<!-- source: EN PDF p170; unit 1882 -->

Ошибка, связанная с динамическим графом

<!-- source: EN PDF p170; unit 1883 -->

Если при преобразовании модели возникает ошибка следующего вида:

<!-- source: EN PDF p170; unit 1884 -->

```text
E build: ValueError: The Op of 'NonZero' is not support! it will cause the graph to be a dynamic graph!
```

<!-- source: EN PDF p171; unit 1885 -->

Это означает, что оператор делает граф динамическим. Модель нужно изменить вручную, заменив оператор другим или удалив его.

Размер модели RKNN

<!-- source: EN PDF p171; unit 1886 -->

После преобразования модель RKNN может быть больше исходной; размер может зависеть даже от формы входа. Это нормально: кроме весов и структуры графа RKNN содержит множество конфигураций регистров NPU. Для повышения эффективности выполнения также могут выполняться разбиение операторов и другие операции, увеличивающие размер модели.

<!-- source: EN PDF p171; unit 1887 -->

### 10\.7 Инференс в симуляторе или на устройстве

<!-- source: EN PDF p171; unit 1888 -->

Терминология

<!-- source: EN PDF p171; unit 1889 -->

Инференс в симуляторе: RKNN-Toolkit2 предоставляет на Linux x86\_64 симулятор для выполнения моделей без отладочной платы. Его результаты могут отличаться от результатов платы; предпочтительнее инференс через подключённую плату или непосредственно на ней.

<!-- source: EN PDF p171; unit 1890 -->

Инференс через подключённую плату: плата подключена к PC, а модель запускается и результаты получаются через Python API RKNN-Toolkit2.

<!-- source: EN PDF p171; unit 1891 -->

Инференс на плате: результаты получают через C API RKNPU2.

<!-- source: EN PDF p171; unit 1892 -->

Результаты симулятора отличаются от результатов подключённой платы

<!-- source: EN PDF p171; unit 1893 -->

Это может означать, что результаты на плате неверны.

<!-- source: EN PDF p171; unit 1894 -->

Из-за различий аппаратуры и драйверов полное совпадение результатов симулятора и платы не гарантируется. Однако слишком большая разница, вероятно, вызвана ошибкой драйвера платы. Сообщите о ней команде RK NPU для анализа и отладки.

<!-- source: EN PDF p171; unit 1895 -->

Как работает инференс через подключённую плату

<!-- source: EN PDF p171; unit 1896 -->

RKNN-Toolkit2 связывается с rknn\_server на плате. Модель и входные данные передаются с PC на плату, где RKNPU2 C API выполняет инференс. Затем результат отправляется обратно на PC.

<!-- source: EN PDF p171; unit 1897 -->

Различия результатов инференса через подключённую плату и непосредственно на плате

<!-- source: EN PDF p171; unit 1898 -->

Инференс через подключённую плату основан на RKNPU2 C API, поэтому теоретически результаты должны совпадать. При большой разнице проверьте предобработку, тип данных и расположение данных (NCHW, NHWC).

<!-- source: EN PDF p171; unit 1899 -->

Очень небольшие различия нормальны: они могут возникать из-за разных библиотек чтения изображений, преобразования типов и т. п.

<!-- source: EN PDF p171; unit 1900 -->

Инференс непосредственно на плате быстрее, чем через подключённую плату

<!-- source: EN PDF p171; unit 1901 -->

Инференс через подключённую плату включает дополнительные копирование и передачу данных, поэтому уступает прямому запуску RKNPU2 C API на плате. Реальную производительность NPU следует оценивать по инференсу через RKNPU2 C API непосредственно на плате.

<!-- source: EN PDF p171; unit 1902 -->

Получение более подробного журнала

<!-- source: EN PDF p171; unit 1903 -->

При инференсе через подключённую плату инициализация и запуск модели выполняются главным образом на плате, где создаётся и основная часть журнала.

<!-- source: EN PDF p172; unit 1904 -->

Для подробной отладочной информации войдите в ОС платы через последовательный порт. Выполните две следующие команды настройки переменных окружения для журналирования. Не закрывайте окно последовательного порта и запустите инференс через подключённую плату: сообщения об ошибках платы появятся в этом окне.

<!-- source: EN PDF p172; unit 1905 -->

```text
export RKNN_LOG_LEVEL=5

restart_rknn.sh
```

<!-- source: EN PDF p172; unit 1906 -->

Расположение данных для пакетного инференса

<!-- source: EN PDF p172; unit 1907 -->

Расположение входных данных rknn.inference можно задать как NCHW или NHWC через 1data\_format='NCHW' либо data\_format='NHWC'. По умолчанию используется NHWC.

<!-- source: EN PDF p172; unit 1908 -->

В rknn-toolkit2 модели ONNX с 4D-входами при преобразовании обычно используют NCHW. Однако при инференсе RKNN по умолчанию используется NHWC, и инструментарий внутри преобразует NCHW в NHWC. Если явно задать data\_format='NCHW', это преобразование пропускается и вход используется как есть в NCHW. Примеры см. в обсуждении GitHub: https://github.com/airockchip/rknn-toolkit2/issues/220.

<!-- source: EN PDF p172; unit 1909 -->

### 10\.8 Типичные проблемы оценки модели

<!-- source: EN PDF p172; unit 1910 -->

Точность квантования ниже ожидаемой

<!-- source: EN PDF p172; unit 1911 -->

См. главу 7 этого документа.

<!-- source: EN PDF p172; unit 1912 -->

Квантованные модели каких фреймворков поддерживаются?

<!-- source: EN PDF p172; unit 1913 -->

RKNN-Toolkit2 1.4 и новее поддерживает квантованные модели TensorFlow, TensorFlow Lite и PyTorch.

<!-- source: EN PDF p172; unit 1914 -->

Не удаётся подключиться к устройству при инференсе через плату

<!-- source: EN PDF p172; unit 1915 -->

При rknn.accuracy\_analysis возникает ошибка:

<!-- source: EN PDF p172; unit 1916 -->

```text
  E accuracy_analysis: Connect to Device Failure (-1)

  E accuracy_analysis: Catch exception when init runtime!

  E accuracy_analysis: Traceback (most recent call last):

  E accuracy_analysis: File "rknn/api/rknn_base.py", line 2001, in rknn.api.rknn_base.RKNNBase.init_runtime

  E accuracy_analysis: File "rknn/api/rknn_runtime.py", line 194, in
rknn.api.rknn_runtime.RKNNRuntime.__init__

  E accuracy_analysis: File "rknn/api/rknn_platform.py", line 331, in rknn.api.rknn_platform.start_ntp_or_adb
```

<!-- source: EN PDF p172; unit 1917 -->

Или при rknn.inference возникает ошибка:

<!-- source: EN PDF p172; unit 1918 -->

```text
  I target set by user is: rk3568

  I Starting ntp or adb, target is RK3568

  I Device [0c6a9900ef4871e1] not found in ntb device list.

  I Start adb…
  I Connect to Device success!

  I NPUTransfer: Starting NPU Transfer Client, Transfer version 2.1.0 (b5861e7@2020-11-23T11:50:36)

  D NPUTransfer: Transfer spec = local:transfer_proxy

  D NPUTransfer: ERROR: socket read fd = 3, n = -1: Connection reset by peer

  D NPUTransfer: Transfer client closed fd = 3

  E RKNNAPI: rknn_init, server connect fail! ret = -9(ERROR_PIPE)!

  E init_runtime: Catch exception when init_runtime!

  E init_runtime: Traceback (most recent call last):

  E init_runtime: File "rknn/api/rknn_base.py", line 2001, in rknn.api.rknn_base.RKNNBase.init_runtime

  E init_runtime: File "rknn/api/rknn_runtime.py", line 361, in rknn.api.rknn_runtime.RKNNRuntime.build_graph

  E init_runtime: Exception: RKNN init failed. error code: RKNN_ERR_DEVICE_UNAVAILABLE
```

<!-- source: EN PDF p173; unit 1920 -->

Возможно, на плате не запущена служба rknn\_server. Запустите её согласно разделу 2.2.

rknn\_init возвращает RKNN\_ERROR\_MODEL\_INVALID

<!-- source: EN PDF p173; unit 1921 -->

Журнал ошибки:

<!-- source: EN PDF p173; unit 1922 -->

```text
E RKNNAPI: rknn_init, msg_load_ack fail, ack = 1(ACK_FAIL), expect 0(ACK_SUCC)!

D NPUTransfer: Transfer client closed, fd = 4

E init_runtime: Catch exception when init runtime!

E init_runtime: Traceback (most recent call last):

E init_runtime: File "rknn/api/rknn_base.py", line 2011, in rknn.api.rknn_base.RKNNBase.init_runtime

E init_runtime: File "rknn/api/rknn_runtime.py", line 361, in rknn.api.rknn_runtime.RKNNRuntime.build_graph

E init_runtime: Exception: RKNN init failed. error code: RKNN_ERR_MODEL_INVALID
```

<!-- source: EN PDF p173; unit 1923 -->

Эта ошибка обычно возникает в следующих случаях:

<!-- source: EN PDF p173; unit 1924 -->

При создании rknn-модели нужно учитывать соответствие версий RKNN-Toolkit2 и драйверов. Рекомендуется обновить RKNN-Toolkit2 / RKNPU2 и прошивку платы до последних версий.

<!-- source: EN PDF p173; unit 1925 -->

Неверно задан target\_platform. Если target\_platform в rknn.config() не указан, модель работает только на RK3566/RK3568. Для других платформ, например RK3588/RK3588S/RV1103/RV1106/RK3562, при вызове rknn.config() нужно задать соответствующий target\_platform.

<!-- source: EN PDF p174; unit 1926 -->

Если ошибка возникает в Docker, возможно, процесс npu\_transfer\_proxy на хосте не завершился и нарушает связь. Выйдите из контейнера, завершите npu\_transfer\_proxy на хосте, затем снова войдите в контейнер и запустите скрипт инференса.

<!-- source: EN PDF p174; unit 1927 -->

Возможна проблема с моделью RKNN. Подключитесь к плате через последовательный порт, задайте RKNN\_LOG\_LEVEL=5 и выполните restart\_rknn.sh. Затем запустите программу, сохраните подробный журнал и передайте команде Rockchip NPU.

rknn\_init возвращает RKNN\_ERR\_DEVICE\_UNAVAILABLE

<!-- source: EN PDF p174; unit 1928 -->

Журнал ошибки:

<!-- source: EN PDF p174; unit 1929 -->

```text
E RKNNAPI: rknn_init, msg_ioctl_ack fail, data_len = 104985, except 102961!

D NPUTransfer: Transfer client closed, fd = 3

E init_runtime: Catch exception when init_runtime!

E init_runtime: Traceback (most recent call last):

E init_runtime: File "rknn/api/rknn_base.py", line 1961, in rknn.api.rknn_base.RKNNBase.init_runtime

E init_runtime: File "rknn/api/rknn_runtime.py", line 360, in rknn.api.rknn_runtime.RKNNRuntime.build_graph

E init_runtime: Exception: RKNN init failed. error code: RKNN_ERR_DEVICE_UNAVAILABLE
```

<!-- source: EN PDF p174; unit 1930 -->

Проверьте следующее:

<!-- source: EN PDF p174; unit 1931 -->

Убедитесь, что RKNN-Toolkit2 / RKNPU2 и прошивка устройств обновлены до последних версий. Как узнать версии компонентов, см. в разделе 2.2.

<!-- source: EN PDF p174; unit 1932 -->

Также убедитесь, что adb devices или rknn.list\_devices() обнаруживает устройство, а target и device\_id в rknn.init\_runtime() заданы правильно.

<!-- source: EN PDF p174; unit 1933 -->

Ошибка Runtime «Invalid RKNN model version 6»

<!-- source: EN PDF p174; unit 1934 -->

```text
  Loading model …

  E RKNN: [09:13:25.728] 6, 1

  E RKNN: [09:13:25.728] Invalid RKNN model version 6

  E RKNN: [06:28:39.049] rknn_init, load model failed!

  Exception: RKNN init failed. error code: RKNN_ERR_FAIL
```

<!-- source: EN PDF p174; unit 1935 -->

Причина:

<!-- source: EN PDF p174; unit 1936 -->

Версия Runtime несовместима с моделями RKNN.

<!-- source: EN PDF p174; unit 1937 -->

Рекомендация:

<!-- source: EN PDF p174; unit 1938 -->

Обновите RKNN-Toolkit2 и Runtime до одной версии.

<!-- source: EN PDF p174; unit 1939 -->

Ошибка Runtime «Invalid RKNN format»

<!-- source: EN PDF p174; unit 1940 -->

В Runtime возникает ошибка:

<!-- source: EN PDF p175; unit 1941 -->

```text
Loading model …

E RKNN: [06:28:39.048] parseRKNN from buffer: Invalid RKNN format!

E RKNN: [06:28:39.049] rknn_init, load model failed!

rknn_init error ret=-1
```

<!-- source: EN PDF p175; unit 1942 -->

Причины:

<!-- source: EN PDF p175; unit 1943 -->

1) При преобразовании модели target\_platform задан неверно или не задан; по умолчанию используется rk3566.

<!-- source: EN PDF p175; unit 1944 -->

2) Версия Runtime несовместима с RKNN-Toolkit2.

<!-- source: EN PDF p175; unit 1945 -->

Рекомендации:

<!-- source: EN PDF p175; unit 1946 -->

1) Задайте правильный target\_platform.

<!-- source: EN PDF p175; unit 1947 -->

2) Обновите RKNN-Toolkit2 и Runtime до одной версии.

rknn.inference медленнее rknn.eval\_perf

<!-- source: EN PDF p175; unit 1948 -->

rknn.inference использует PC и adb для инференса через подключённую плату, поэтому есть фиксированные накладные расходы на передачу данных. Скорость отличается от теоретической оценки rknn.eval\_perf.

<!-- source: EN PDF p175; unit 1949 -->

Для более реалистичной частоты кадров рекомендуется тестировать RKNPU2 C API непосредственно на плате.

<!-- source: EN PDF p175; unit 1950 -->

Поддержка нескольких batch в rknn.inference()

<!-- source: EN PDF p175; unit 1951 -->

Обновите RKNN-Toolkit2 до 1.4.0 или новее и укажите число входных изображений при построении RKNN-модели. Подробности см. в описании rknn.build в RKNN-Toolkit2 API Reference.

<!-- source: EN PDF p175; unit 1952 -->

Кроме того, если rknn\_batch\_size больше 1, например равен 4, код инференса Python:

<!-- source: EN PDF p175; unit 1953 -->

```text
outputs = rknn.inference(inputs=[img])
```

<!-- source: EN PDF p175; unit 1954 -->

нужно изменить на:

<!-- source: EN PDF p175; unit 1955 -->

```text
img = np.expand_dims(img, 0)

img = np.concatenate((img, img, img, img), axis=0)

outputs = rknn.inference(inputs=[img])
```

<!-- source: EN PDF p175; unit 1956 -->

Полный пример: examples/functions/multi\_batch/

<!-- source: EN PDF p175; unit 1957 -->

Запуск нескольких моделей RKNN

<!-- source: EN PDF p175; unit 1958 -->

Для двух и более моделей создайте несколько объектов RKNN. Каждый объект соответствует одной модели и играет роль контекста. Модели независимо инициализируются, выполняют инференс и получают результаты в собственных контекстах. На NPU они исполняются последовательно.

<!-- source: EN PDF p175; unit 1959 -->

Инференс длится очень долго и выдаёт неверный результат

<!-- source: EN PDF p175; unit 1960 -->

Если инференс занимает более 20s и результат неверен, обычно это ошибка ‘NPU Hang’. Попробуйте обновить RKNN-Toolkit2 / RKNPU2 до последней версии.

<!-- source: EN PDF p175; unit 1961 -->

Неверный результат платы при 3-мерном входе

<!-- source: EN PDF p176; unit 1962 -->

Если при 3-мерном входе симулятор даёт правильный результат, а подключённая плата — неверный, причиной может быть неполная поддержка таких входов текущей NPU. Поддержку 3 измерений планируется улучшить.

<!-- source: EN PDF p176; unit 1963 -->

Рекомендации:

<!-- source: EN PDF p176; unit 1964 -->

Измените вход модели на 4D.

<!-- source: EN PDF p176; unit 1965 -->

Попробуйте обновить RKNN-Toolkit2 / RKNPU2 до последней версии.

Результат платы неверен и меняется при каждом запуске

<!-- source: EN PDF p176; unit 1966 -->

Если симулятор выдаёт правильные и стабильные результаты, а подключённая плата — неверные и каждый раз разные, возможна ошибка драйвера ядра NPU на плате. Обновите этот драйвер одновременно с RKNN-Toolkit2 / RKNPU2 до последних версий.

<!-- source: EN PDF p176; unit 1967 -->

При большом числе Resize точность падает

<!-- source: EN PDF p176; unit 1968 -->

Если ONNX-модель содержит много Resize, после преобразования в RKNN точность может снизиться. Возможные причины:

<!-- source: EN PDF p176; unit 1969 -->

1\. NPU пока не поддерживает Resize на аппаратном уровне (поддержка планируется), поэтому RKNN-Toolki2 преобразует Reszie в ConvTranspose, что немного снижает точность.

<!-- source: EN PDF p176; unit 1970 -->

2\. Несколько последовательных Resize могут накапливать ошибки и сильнее снижать точность.

<!-- source: EN PDF p176; unit 1971 -->

Рекомендации:

<!-- source: EN PDF p176; unit 1972 -->

1\. Пока по возможности избегайте Resize: например, замените его ConvTranspose и обучите модель заново.

<!-- source: EN PDF p176; unit 1973 -->

2\. Добавьте optimization\_level=2 в rknn.config. Тогда Resize будет выполняться на CPU без потери точности, но производительность снизится.

<!-- source: EN PDF p176; unit 1974 -->

Все результаты равны ‘nan’ при do\_quantization = False

<!-- source: EN PDF p176; unit 1975 -->

При do\_quantization=True в rknn.build результаты нормальны, а при False становятся ‘nan’. Возможная причина: do\_quantization=False задаёт вычисления RKNN в fp16, но выход промежуточного слоя, например свёртки, может выходить за диапазон fp16 (65536), например -51597~75642.

<!-- source: EN PDF p176; unit 1976 -->

Рекомендация:

<!-- source: EN PDF p176; unit 1977 -->

При обучении обеспечьте, чтобы выходы промежуточных слоёв не превышали диапазон fp16. Обычно это решается добавлением слоя BN.

<!-- source: EN PDF p176; unit 1978 -->

Результаты QAT-модели и RKNN-модели различаются

<!-- source: EN PDF p176; unit 1979 -->

После обучения классификатора QAT в Pytroch и преобразования в RKNN результаты инференса Pytorch и RKNN могут различаться. Возможно, при инференсе Pytorch не задано engine='qnnpack', тогда как RKNN ближе к qnnpack.

<!-- source: EN PDF p176; unit 1980 -->

Как получить расход памяти при работе модели

<!-- source: EN PDF p176; unit 1981 -->

Используйте rknn.eval\_memory. Поле ‘total’ в журнале означает общий занимаемый объём.

<!-- source: EN PDF p176; unit 1982 -->

Различия между perf\_debug=True и False

<!-- source: EN PDF p177; unit 1983 -->

При perf\_debug=True добавляется отладочный код для сбора сведений по слоям, а некоторые механизмы параллелизма могут отключаться. Поэтому выполнение дольше, чем при perf\_debug=False.

<!-- source: EN PDF p177; unit 1984 -->

Основное назначение perf\_debug=True — выявить самые затратные слои модели и на этой основе спланировать оптимизацию.

После перезапуска Docker инференс зависает на инициализации окружения

<!-- source: EN PDF p177; unit 1985 -->

При перезапуске Docker npu\_transfer\_proxy завершается некорректно, поэтому rknn\_server на плате не замечает разрыва соединения с хостом. Перезапустите плату, чтобы сбросить состояние соединения rknn\_server.

<!-- source: EN PDF p177; unit 1986 -->

### 10\.9 Вопросы по использованию C API

<!-- source: EN PDF p177; unit 1987 -->

Освобождает ли rknn\_outputs\_release() массив rknn\_output?

<!-- source: EN PDF p177; unit 1988 -->

rknn\_outputs\_release() используется вместе с rknn\_outputs\_get() и освобождает только буфер в массиве rknn\_output. Аналогичная ситуация у rknn\_destroy\_mem().

<!-- source: EN PDF p177; unit 1989 -->

Как выделить память правильного размера через rknn\_create\_mem?

<!-- source: EN PDF p177; unit 1990 -->

Для входов действует правило: у квантованной модели rknn\_create\_mem() выделяет память по size\_with\_stride из rknn\_tensor\_attr; у неквантованной — по n\_bytes\_type \* n\_elems.

<!-- source: EN PDF p177; unit 1991 -->

Для выходов rknn\_create\_mem() выделяет память по n\_bytes\_type \* n\_elems.

<!-- source: EN PDF p177; unit 1992 -->

Как заполнять входные данные?

<!-- source: EN PDF p177; unit 1993 -->

В общем API для 4-мерного входа fmt=NHWC: порядок заполнения [batch, height, width, channel]. Для входа, отличного от 4D, fmt=UNDEFINED, то есть данные следуют исходной форме модели.

<!-- source: EN PDF p177; unit 1994 -->

В zero-copy API для входа 4D fmt может быть NHWC/NC1HWC2. Заполнение при fmt=NC1HWC2 описано в разделе «RKNN Runtime Zero Copy». Для входа, отличного от 4D, fmt=UNDEFINED, то есть используется исходная форма модели.

<!-- source: EN PDF p177; unit 1995 -->

Как использовать pass\_through?

<!-- source: EN PDF p177; unit 1996 -->

Формат входа получают командой RKNN\_NATIVE\_INPUT\_ATTR функции rknn\_query(). Для 4-мерной формы при числе каналов 1, 3 или 4 требуется NHWC, при других значениях — NC1HWC2. Для формы, отличной от 4 измерений, рекомендуется UNDEFINED.

<!-- source: EN PDF p177; unit 1997 -->

Кроме того, в режиме pass\_through квантованные модели обычно задают dtype входного Tensor как INT8, а неквантованные — как FLOAT16.

<!-- source: EN PDF p177; unit 1998 -->

Как устранить ошибку «failed to submit»?

<!-- source: EN PDF p177; unit 1999 -->

Если ошибка возникает на первом слое свёртки при zero-copy, возможно, для входного тензора выделено недостаточно памяти. Используйте size\_with\_stride из атрибутов тензора для выделения.

<!-- source: EN PDF p177; unit 2000 -->

Если ошибка возникает в промежуточном NPU-слое, возможна неверная конфигурация модели. В журнале можно найти ссылку на последний SDK. Рекомендуется обновить инструментарий либо назначить этот слой CPU при преобразовании RKNN-модели.

<!-- source: EN PDF p177; unit 2001 -->

Как устранить «Meet unsupport xxx operator»?

<!-- source: EN PDF p178; unit 2002 -->

При такой ошибке запуска демонстрации на плате её Runtime (librknnrt.so) обычно не поддерживает оператор. Сначала обновите инструментарий RKNN, заново преобразуйте модель и повторите запуск демонстрации.

<!-- source: EN PDF p178; unit 2003 -->

Если ошибка остаётся в последней версии, нужно самостоятельно добавить реализацию оператора. См. раздел 5.5 о пользовательских операторах либо сообщите команде RKNN через redmine.

Поддерживает ли модель с динамической формой внешне выделенную память в zero-copy?

<!-- source: EN PDF p178; unit 2004 -->

Версии до 1.6.0 этого не поддерживают. Более поздние версии позволяют инициализировать контекст с флагом RKNN\_FLAG\_MEM\_ALLOC\_OUTSIDE.

<!-- source: EN PDF p178; unit 2005 -->

Оценка производительности пользовательского оператора в Runtime

<!-- source: EN PDF p178; unit 2006 -->

Задайте RKNN\_LOG\_LEVEL=4 или выше и запустите тестовый пример C API. Он выведет производительность каждого слоя, включая пользовательский оператор.

<!-- source: EN PDF p178; unit 2007 -->

Примечание: время пользовательского оператора включает действия внутри обратного вызова compute. Для GPU-оператора это, например, время clImportMemoryARM, преобразований расположения и типов входных и выходных данных, а также выполнения самого GPU-ядра OpenCL.

<!-- source: EN PDF p178; unit 2008 -->

## 11 Справочные материалы

<!-- source: EN PDF p178; unit 2009 -->

RKNN: https://github.com/airockchip/rknn-toolkit2

<!-- source: EN PDF p178; unit 2010 -->

RKNN\_Model\_Zoo: https://github.com/airockchip/rknn\_model\_zoo

<!-- source: EN PDF p178; unit 2011 -->

RGA: https://github.com/airockchip/librga

{% endraw %}
