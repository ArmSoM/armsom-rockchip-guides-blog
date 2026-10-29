---
title: "RKNN на RV1103/RV1106, часть 3: среда ПК и Mini Runtime"
description: "RKNN на RV1103/RV1106, часть 3: среда ПК и Mini Runtime · RKNN2 V2.5.0"
excerpt: "RKNN на RV1103/RV1106, часть 3: среда ПК и Mini Runtime"
translation_key: "rknn-v250-rv1106-host-runtime"
slug: "rknn-v250-rv1106-host-runtime"
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

**RKNN на RV1103/RV1106, часть 3: среда ПК и Mini Runtime**

[RKNN на RV1103/RV1106, часть 4: YOLOv5, Python и развёртывание C](/ru/articles/rknn-v250-rv1106-yolov5/)

[RKNN на RV1103/RV1106, часть 5: Docker, диагностика и документация](/ru/articles/rknn-v250-rv1106-docker-faq/)

{% raw %}

## 3. Подготовка среды компьютера и платы

Эта глава подготавливает RKNN-Toolkit2, RKNPU2 и средства компиляции для первого запуска. Основной вариант — прямая установка на компьютер. Для Docker см. главу 5.

### 3.1 Установка RKNN-Toolkit2

#### 3.1.1 Установка среды Python

Если рекомендуемый Python 3.8 не установлен или имеется несколько сред Python, рекомендуется создать независимую среду Python 3.8 с помощью Miniforge.

Шаг 1: установка Miniforge

Сначала проверьте, установлен ли Miniforge. Если установлен, пропустите этот шаг.

```text
conda -V
# Reference output: conda 23.3.1, indicating that the Miniforge conda version is 23.3.1
# If 'conda: command not found' is displayed, Miniforge is not installed
```

Если Miniforge не установлен, загрузите установщик:

```text
wget -c https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-x86_64.sh
```

Затем выполните:

```text
chmod +x Miniforge3-Linux-x86_64.sh
bash Miniforge3-Linux-x86_64.sh
```

Шаг 2: создание среды Python

Перейдите в базовую среду Miniforge:

```text
source ~/miniforge3/bin/activate
# Upon successful activation, the command prompt changes to:
# (base) xxx@xxx:~$
```

Создайте среду Python 3.8 с именем toolkit2:

```text
conda create -n toolkit2 python=3.8
```

Активируйте среду toolkit2:

```text
conda activate toolkit2
# Upon successful activation, the command prompt changes to:
# (toolkit2) xxx@xxx:~$
```

Примечание: предполагается, что все последующие команды Python выполняются в среде toolkit2.

#### 3.1.2 Установка RKNN-Toolkit2

После активации toolkit2 установите RKNN-Toolkit2 из источника pip или из локального wheel-пакета.

Способ 1: установка через pip

```text
pip install rknn-toolkit2 -i https://pypi.org/simple

# If RKNN-Toolkit2 is already installed, upgrade it using:
pip install rknn-toolkit2 -i https://pypi.org/simple --upgrade
```

Способ 2: установка из локального wheel-пакета

```text
# Switch to the rknn-toolkit2 directory
cd Projects/rknn-toolkit2/rknn-toolkit2

# Select the requirements file according to the Python version and processor architecture
# cpxx is the Python version number
pip install -r packages/x86_64/requirements_cpxx.txt
# pip install -r packages/arm64/arm64_requirements_cpxx.txt

# Install RKNN-Toolkit2
# x.x.x is the RKNN-Toolkit2 version number, and cpxx is the Python version number
pip install packages/x86_64/rknn_toolkit2-x.x.x-cpxx-cpxx-manylinux_2_17_x86_64.manylinux2014_x86_64.whl
# pip install packages/arm64/rknn_toolkit2-x.x.x-cpxx-cpxx-manylinux_2_17_aarch64.manylinux2014_aarch64.whl
```

### 3.2 Проверка установки Toolkit

Оставьте toolkit2 активной и перейдите в интерактивный режим Python:

```text
python
```

Затем импортируйте класс RKNN:

```text
from rknn.api import RKNN
```

Если импорт проходит без ошибок, базовая проверка установки RKNN-Toolkit2 завершена успешно.

При ошибке установки см. разделы установки RKNN-Toolkit2 и устранения ошибок в RKNN2_SDK_Development_Guide.

### 3.3 Установка или проверка RKNPU2 на плате

Далее для краткости отладочная плата называется платой.

Для отладки с подключённой платой через RKNN-Toolkit2 на ней должна быть установлена среда RKNPU2 и запущен rknn_server.

| Компонент | Назначение |
| --- | --- |
| RKNN Server (rknn_server) | Фоновая прокси-служба на плате. Обрабатывает данные от компьютера через USB и вызывает Mini Runtime на плате для инференса |
| RKNPU2 Mini Runtime (librknnmrt.so) | Загружает модели RKNN в системе и вызывает NPU для инференса |

#### 3.3.1 Проверка версии драйвера RKNPU2

Выполните на плате следующую команду для получения версии драйвера RKNPU2:

```text
dmesg | grep -i rknpu
```

На рисунке ниже версия драйвера RKNPU2 в исходном примере — 0.8.5:

![Рисунок английского оригинала · PDF 16](/assets/images/rknn-v250/rv1106/en/p016-figure-01.png)

*Рисунок английского оригинала · PDF 16*

Рисунок 3-1. Сведения о версии драйвера RKNPU2

Официальная прошивка отладочных плат Rockchip содержит драйвер RKNPU2. Если команда не показывает его версию, возможно, используется сторонняя прошивка без драйвера NPU. При наличии исходного кода установите CONFIG_ROCKCHIP_RKNPU=y в конфигурации ядра, пересоберите драйвер и запишите прошивку.

Рекомендация источника: драйвер RKNPU2 версии >= 0.9.2.

#### 3.3.2 Проверка RKNPU2 Mini Runtime и Server

Если RKNN Server или Mini Runtime отсутствуют на плате либо их версии не согласованы, переустановите среду RKNPU2.

Примечания:

1. Для модели RKNN с динамическими размерами входа версии RKNN Server и Mini Runtime должны быть >= 1.5.0.

2. Версии rknn_server, Mini Runtime и RKNN-Toolkit2 должны быть согласованы. Источник рекомендует компоненты одного последнего выпуска.

Шаг 1: проверка запуска rknn_server

```text
# Switch to the board
adb shell

# Start rknn_server
restart_rknn.sh
```

Похожий на приведённый ниже вывод означает успешный запуск rknn_server:

```text
start rknn server, version: x.x.x
```

Шаг 2: проверка версий Server и Mini Runtime

```text
# Query the rknn_server version
strings /oem/usr/bin/rknn_server | grep -i "rknn_server version"

# Query the librknnmrt.so version
strings /oem/usr/lib/librknnmrt.so | grep -i "librknnmrt version"
```

Пример вывода:

```text
rknn_server version: x.x.x
librknnmrt version: x.x.x
```

#### 3.3.3 Установка или обновление RKNPU2

Если среда RKNPU2 с согласованными версиями уже установлена, пропустите этот раздел.

Перейдите в rknpu2, передайте соответствующие rknn_server и librknnmrt.so на плату через ADB, затем запустите rknn_server:

```text
# Switch to the rknpu2 directory
cd Projects/rknn-toolkit2/rknpu2

# Push rknn_server to the board
adb push runtime/Linux/rknn_server/armhf-uclibc/usr/bin/* /oem/usr/bin

# Push librknnmrt.so
adb push runtime/Linux/librknn_api/armhf-uclibc/librknnmrt.so /oem/usr/lib

# Switch to the board
adb shell

# Grant executable permissions
chmod +x /oem/usr/bin/rknn_server
chmod +x /oem/usr/bin/start_rknn.sh
chmod +x /oem/usr/bin/restart_rknn.sh

# Restart the rknn_server service
restart_rknn.sh
```

### 3.4 Установка средств компиляции

#### 3.4.1 Установка CMake

Выполните следующие команды в терминале компьютера:

```text
# Update package list
sudo apt update

# Install cmake
sudo apt install cmake
```

#### 3.4.2 Установка компилятора

##### 3.4.2.1 Проверка архитектуры системы платы

Выполните на компьютере:

```text
adb shell uname -a
```

Пример вывода приведён ниже. armv7l обозначает ARMv7, относящуюся к armhf. Эта архитектура потребуется при компиляции RKNN C Demo.

```text
Linux Rockchip 5.10.160 #1 Tue Oct 24 18:52:11 CST 2023 armv7l GNU/Linux
```

##### 3.4.2.2 Установка кросс-компилятора GCC

GCC: https://console.zbox.filez.com/l/c1cKaR (код доступа: rknn).

После загрузки распакуйте пакет. Рекомендуется разместить GCC в Projects:

```text
Projects
├── rknn-toolkit2
├── rknn_model_zoo
└── arm-rockchip831-linux-uclibcgnueabihf
```

В следующих примерах используется путь компилятора GCC:

```text
Projects/arm-rockchip831-linux-uclibcgnueabihf/bin/arm-rockchip831-linux-uclibcgnueabihf
```

### 3.5 Предварительная проверка среды

Перед преобразованием модели рекомендуется выполнить следующие проверки:

| Проверка | Команда или расположение | Ожидаемый результат |
| --- | --- | --- |
| Toolkit | Войти в Python по разделу 3.2 и выполнить from rknn.api import RKNN | Без ошибок |
| Model Zoo | Projects/rknn_model_zoo/examples/yolov5 | Каталог примера существует |
| ADB | adb devices | Статус платы — device |
| Драйвер RKNPU2 | adb shell "dmesg &#124; grep -i rknpu" | Можно получить сведения о драйвере RKNPU2 |
| RKNN Server | adb shell restart_rknn.sh | rknn_server запускается нормально |
| Версия Mini Runtime | Проверить версии rknn_server и librknnmrt.so | Версии согласованы |
| CMake | cmake --version | Версия отображается корректно |
| GCC | Проверить Projects/arm-rockchip831-linux-uclibcgnueabihf | Каталог кросс-компилятора существует |

После успешных проверок переходите к первой модели.

{% endraw %}
