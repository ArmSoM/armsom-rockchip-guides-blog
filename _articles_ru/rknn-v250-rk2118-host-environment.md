---
title: "RK2118 NPU, часть 2: среда ПК и установка Toolkit2"
description: "RK2118 NPU, часть 2: среда ПК и установка Toolkit2 · RKNN2 V2.5.0"
excerpt: "RK2118 NPU, часть 2: среда ПК и установка Toolkit2"
translation_key: "rknn-v250-rk2118-host-environment"
slug: "rknn-v250-rk2118-host-environment"
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

**Серия RK2118 для начинающих · 2/5**

[RK2118 NPU, часть 1: плата, подключение и последовательная консоль](/ru/articles/rknn-v250-rk2118-hardware/)

**RK2118 NPU, часть 2: среда ПК и установка Toolkit2**

[RK2118 NPU, часть 3: RT-Thread и прошивка DSP](/ru/articles/rknn-v250-rk2118-firmware/)

[RK2118 NPU, часть 4: преобразование модели, USB-входы и результаты инференса](/ru/articles/rknn-v250-rk2118-model-demo/)

[RK2118 NPU, часть 5: Docker, частые вопросы и документация](/ru/articles/rknn-v250-rk2118-docker-faq/)

<!-- rk2118-series:end -->

{% raw %}

## 3. Подготовка среды разработки

В этой главе описывается установка среды непосредственно на компьютере. Последующие примеры также предполагают такую установку. Для запуска примеров в Docker подготовьте среду по главе 5.

Глава состоит из трёх частей:

- Загрузка репозиториев RKNN

- Установка RKNN-Toolkit2 на компьютер

- Подготовка RK2118 SDK

### 3.1 Загрузка репозиториев RKNN

Рекомендуется создать отдельный каталог для репозиториев RKNN, например Projects, и поместить туда RKNN-Toolkit2. Пример команд:

```text
# Create the 'Projects' folder
mkdir Projects

# Switch to this directory
cd Projects

# Download the RKNN-Toolkit2 repository
git clone https://github.com/airockchip/rknn-toolkit2.git --depth 1

# Notice:
# 1. Parameter --depth 1 means to clone only the latest commit
# 2. If the 'git clone' command fails, you can also download the compressed file directly from GitHub and unzip it locally in this directory.
```

Общая структура каталогов:

```text
Projects
├── rknn-toolkit2
│ ├── doc
│ ├── rknn-toolkit2
│ │ ├── packages
│ │ ├── docker
│ │ └── ...
│ ├── rknpu2
│ │ ├── runtime
│ │ └── ...
│ └── ...
```

### 3.2 Установка RKNN-Toolkit2 на компьютер

#### 3.2.1 Установка Python

Если Python 3.8 не установлен или в системе имеется несколько версий Python, рекомендуется создать новую среду Python 3.8 с помощью Miniforge.

##### 3.2.1.1 Установка miniforge

В терминале компьютера выполните следующую команду, чтобы проверить наличие miniforge. Если он уже установлен, этот шаг можно пропустить.

```text
conda -V
# Reference output: conda 24.3.0, indicating that Miniforge Conda version is 24.3.0
# If it shows 'conda: command not found', it means Miniforge Conda is not installed.
```

Если Miniforge не установлен, загрузите установщик по следующей ссылке:

```text
https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-x86_64.sh
```

Затем установите miniforge следующими командами:

```text
chmod 777 Miniforge3-Linux-x86_64.sh
bash Miniforge3-Linux-x86_64.sh
```

##### 3.2.1.2 Создание среды Python с помощью miniforge

В терминале компьютера перейдите в базовую среду conda следующей командой:

```text
source /opt/miniforge3/bin/activate
# Upon successful activation, the command prompt will change to the following form:
# (base) xxx@xxx:~$
```

Создайте среду Python 3.8 с именем toolkit2:

```text
conda create -n toolkit2 python=3.8
```

Активируйте toolkit2. Далее RKNN-Toolkit2 устанавливается в этой среде.

```text
conda activate toolkit2
# (toolkit2) xxx@xxx:~$
```

#### 3.2.2 Установка RKNN-Toolkit2

После активации toolkit2 установите RKNN-Toolkit2 из источника pip либо из локального wheel-пакета. Первый вариант — установка через pip:

```text
pip install rknn-toolkit2 -i https://pypi.org/simple

# If RKNN-Toolkit2 is already installed, you can upgrade it with the following command:
pip install rknn-toolkit2 -i https://pypi.org/simple --upgrade
```

- Установка из локального wheel-пакета:

```text
# Switch to the rknn-toolkit2 directory
cd Projects/rknn-toolkit2/rknn-toolkit2

# Please choose the appropriate requirements file based on the Python version and processor architecture:
# where cpxx is the Python version
pip install -r packages/x86_64/requirements_cpxx.txt
# pip install -r packages/arm64/arm64_requirements_cpxx.txt

# Install RKNN-Toolkit2
# Please choose the appropriate wheel package file based on the Python version and processor architecture:
# where x.x.x is the RKNN-Toolkit2 version number, cpxx is the Python version
pip install packages/x86_64/rknn_toolkit2-x.x.x-cpxx-cpxx-manylinux_2_17_x86_64.manylinux2014_x86_64.whl
# pip install packages/arm64/rknn_toolkit2-x.x.x-cpxx-cpxx-manylinux_2_17_aarch64.manylinux2014_aarch64.whl
```

#### 3.2.3 Проверка установки RKNN-Toolkit2

Выполните следующие команды. Отсутствие ошибок означает успешную установку среды RKNN-Toolkit2.

```text
# Switch to Python interactive mode
python

# Import the RKNN class
from rknn.api import RKNN
```

При ошибках установки обратитесь к разделу 5.4.2 «RKNN-Toolkit2 Installation Issues» документа RKNN2_SDK_Development_Guide_V2.5.0.pdf: в нём подробно описаны способы устранения проблем установки.

{% endraw %}
