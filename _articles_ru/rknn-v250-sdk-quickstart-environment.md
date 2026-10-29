---
title: "RKNN2 V2.5.0, часть 3: Toolkit, Runtime Android/Linux и компиляторы"
description: "RKNN2 V2.5.0, часть 3: Toolkit, Runtime Android/Linux и компиляторы · RKNN2 V2.5.0"
excerpt: "RKNN2 V2.5.0, часть 3: Toolkit, Runtime Android/Linux и компиляторы"
translation_key: "rknn-v250-sdk-quickstart-environment"
slug: "rknn-v250-sdk-quickstart-environment"
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

**RKNN2 V2.5.0, часть 3: Toolkit, Runtime Android/Linux и компиляторы**

[RKNN2 V2.5.0, часть 4: преобразование и развёртывание MobileNet](/ru/articles/rknn-v250-sdk-quickstart-mobilenet/)

[RKNN2 V2.5.0, часть 5: детекция YOLOv5 и оценка точности](/ru/articles/rknn-v250-sdk-quickstart-yolov5/)

[RKNN2 V2.5.0, часть 6: Docker, диагностика и документация](/ru/articles/rknn-v250-sdk-quickstart-docker-faq/)

{% raw %}

## 3. Подготовка среды компьютера и платы

### 3.1 Установка RKNN-Toolkit2

Здесь описан только рекомендуемый путь Conda + pip. Установка с Docker приведена в главе 5.

#### 3.1.1 Установка среды Python

Если Python 3.8 (рекомендуемая версия) не установлен или имеются несколько версий Python, рекомендуется создать новую среду Python 3.8 с помощью Miniforge Conda.

Шаг 1: установить Miniforge Conda

Проверьте установку Miniforge Conda следующей командой в терминале компьютера. Если программа уже установлена, этот этап можно пропустить.

```text
conda -V
# Reference output: conda 23.3.1, indicating that the Miniforge Conda version is 23.3.1
# If it shows 'conda: command not found', it means Miniforge Conda is not installed.
```

Если Miniforge Conda не установлен, загрузите установщик: https://github.com/conda-forge/miniforge/releases/download/25.3.0-1/Miniforge3-25.3.0-1-Linux-x86_64.sh

Затем установите Miniforge Conda следующими командами:

```text
# Copy to the user directory
cp /path/to/Miniforge3-25.3.0-1-Linux-x86_64.sh ~

# Grant executable permissions
chmod 777 Miniforge3-25.3.0-1-Linux-x86_64.sh

# Run the installation script
bash Miniforge3-25.3.0-1-Linux-x86_64.sh
```

Шаг 2: создание среды Python

После установки выполните в терминале компьютера следующую команду для переключения в базовую среду Conda:

```text
source ~/miniforge3/bin/activate # The installation directory of Miniforge
# Upon success, the command prompt will change to the following form:
# (base) xxx@xxx:~$
```

Создайте среду Python 3.8 с именем toolkit2:

```text
conda create -n toolkit2 python=3.8
```

Активируйте toolkit2. В эту среду будет установлен RKNN-Toolkit2:

```text
conda activate toolkit2
# Upon success, the command prompt will change to the following form:
# (toolkit2) xxx@xxx:~$
```

Примечание: далее команды Python по умолчанию выполняются в среде toolkit2.

#### 3.1.2 Установка RKNN-Toolkit2

После активации toolkit2 установите RKNN-Toolkit2 из источника pip либо локального wheel-пакета.

Способ 1: установка через источник pip

```text
pip install rknn-toolkit2 -i https://pypi.org/simple

# If RKNN-Toolkit2 is already installed, you can upgrade it with the following command
pip install rknn-toolkit2 -i https://pypi.org/simple --upgrade
```

Способ 2: установка локального wheel-пакета

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

### 3.2 Проверка установки Toolkit

Не выходя из активированной среды toolkit2, выполните:

```text
python -c "from rknn.api import RKNN; print('RKNN-Toolkit2 import OK')"
```

Если вывод следующий:

```text
RKNN-Toolkit2 import OK
```

базовая проверка импорта Toolkit пройдена.

При сбое установки см. раздел 5.4.2 «RKNN-Toolkit2 Installation Issue» руководства RKNN2 SDK Development Guide с подробными решениями ошибок установки среды.

### 3.3 Установка или проверка RKNPU2 на плате

Перед запуском Demo убедитесь, что драйвер NPU, служба rknn_server и библиотека Runtime установлены корректно.

#### 3.3.1 Проверка версии драйвера NPU

Запросить версию драйвера RKNPU2 можно следующей командой на плате:

```text
dmesg | grep -i rknpu
```

На следующем рисунке показан исходный пример: версия драйвера RKNPU2 — 0.8.8.

![Рисунок английского оригинала · PDF 16](/assets/images/rknn-v250/sdkquick/en/p016-figure-01.png)

*Рисунок английского оригинала · PDF 16*

Рисунок 3-1. Сведения о версии драйвера RKNPU2

Официальные прошивки плат Rockchip содержат драйвер RKNPU2. Если команда не возвращает версию драйвера NPU, возможно, используется сторонняя прошивка без драйвера. При наличии исходного кода прошивки задайте CONFIG_ROCKCHIP_RKNPU в конфигурации ядра значение 'y', затем пересоберите и прошейте драйвер ядра. Рекомендуется версия драйвера RKNPU2 >= 0.9.8.

#### 3.3.2 Проверка rknn_server и библиотеки Runtime

Для отладки с подключённой платой RKNN-Toolkit2 нужны установленная среда RKNPU2 и работающая служба rknn_server. Если rknn_server или Runtime отсутствуют либо версии не согласованы, переустановите среду RKNPU2.

Обычно плата уже поставляется со средой RKNPU2 согласованных версий. Проверьте это командами ниже. Если среда отсутствует или версии различаются, установите/обновите её по разделу 3.3.3.

1. Плата с Android

Проверка установки RKNPU2: возможность запуска службы rknn_server означает, что среда RKNPU2 установлена на плате.

```text
# Switch to the board
adb shell

# Start rknn_server
su
setenforce 0
/vendor/bin/rknn_server &
```

Следующий вывод означает успешный запуск rknn_server и наличие установленной среды RKNPU2.

```text
start rknn server, version: x.x.x
```

Проверьте согласованность версий:

```text
# Query rknn_server version
strings /vendor/bin/rknn_server | grep -i "rknn_server version"

# Query librknnrt.so library version
# For 64-bit systems
strings /vendor/lib64/librknnrt.so | grep -i "librknnrt version"
# For 32-bit systems
strings /vendor/lib/librknnrt.so | grep -i "librknnrt version"
```

В следующем примере вывода версия rknn_server — x.x.x, версия librknnrt.so — x.x.x.

```text
rknn_server version: x.x.x
librknnrt version: x.x.x
```

2. Плата с Linux

Проверка установки RKNPU2: возможность запуска службы rknn_server означает, что среда RKNPU2 установлена на плате.

```text
# Switch to the board
adb shell

# Start rknn_server
restart_rknn.sh
```

Следующий вывод означает успешный запуск rknn_server и наличие установленной среды RKNPU2.

```text
start rknn server, version: x.x.x
```

Проверьте согласованность версий:

```text
# Query rknn_server version
strings /usr/bin/rknn_server | grep -i "rknn_server version"

# Query librknnrt.so library version
strings /usr/lib/librknnrt.so | grep -i "librknnrt version"
```

В следующем примере вывода версия rknn_server — x.x.x, версия librknnrt.so — x.x.x.

```text
rknn_server version: x.x.x
librknnrt version: x.x.x
```

#### 3.3.3 Установка/обновление среды RKNPU2

Разным системам платы соответствуют разные среды RKNPU2. Ниже приведены способы установки для каждой системы.

Примечание: если среда RKNPU2 с согласованными версиями уже установлена, этот раздел можно пропустить.

1. Плата с Android

Перейдите в каталог rknpu2, передайте на плату соответствующие rknn_server и librknnrt.so с помощью adb, затем запустите rknn_server. Пример команд:

```text
# Switch to the rknpu2 directory
cd Projects/rknn-toolkit2/rknpu2

# Switch to root user permissions
adb root

# Remount the file system as read-write
adb remount

# Push the rknn_server executable
# Note: In a 64-bit Android system, BOARD_ARCH corresponds to the arm64 directory; in 32-bit systems, it corresponds to the arm directory.
adb push runtime/Android/rknn_server/${BOARD_ARCH}/rknn_server /vendor/bin/

# Push the librknnrt.so library
# For 64-bit systems
adb push runtime/Android/librknn_api/arm64-v8a/librknnrt.so /vendor/lib64/
# For 32-bit systems
adb push runtime/Android/librknn_api/armeabi-v7a/librknnrt.so /vendor/lib/

# Switch to the board
adb shell

# Grant executable permissions
chmod +x /vendor/bin/rknn_server

# Restart the rknn_server service
su
setenforce 0
/vendor/bin/rknn_server &
```

2. Плата с Linux

Перейдите в каталог rknpu2, передайте на плату соответствующие rknn_server и librknnrt.so с помощью adb, затем запустите rknn_server. Пример команд:

```text
# Switch to the rknpu2 directory
cd Projects/rknn-toolkit2/rknpu2

# Push rknn_server to the board
# Note: In 64-bit Linux systems, BOARD_ARCH corresponds to the aarch64 directory; in 32-bit systems, it corresponds to the armhf directory.
adb push runtime/Linux/rknn_server/${BOARD_ARCH}/usr/bin/* /usr/bin

# Push librknnrt.so
adb push runtime/Linux/librknn_api/${BOARD_ARCH}/librknnrt.so /usr/lib

# Switch to the board
adb shell

# Grant executable permissions
chmod +x /usr/bin/rknn_server
chmod +x /usr/bin/start_rknn.sh
chmod +x /usr/bin/restart_rknn.sh

# Restart the rknn_server service
restart_rknn.sh
```

### 3.4 Установка средств компиляции

#### 3.4.1 Установка CMake

В терминале компьютера выполните следующую команду:

```text
# Update package list
sudo apt update

# Install cmake
sudo apt install cmake
```

#### 3.4.2 Установка компиляторов

##### 3.4.2.1 Определение типа ОС и архитектуры платы

Для краткости далее сторона платы разработки называется «плата».

Шаг 1: определить тип ОС платы

В терминале компьютера выполните следующую команду:

```text
adb shell getprop ro.build.version.release
```

Если результат — число (версия Android), плата работает под Android.

```text
12
```

В противном случае плата работает под Linux.

```text
/bin/sh: getprop: not_found
```

Шаг 2: определить архитектуру платы

Для платы под Android запросите архитектуру следующей командой на компьютере:

```text
adb shell getprop ro.product.cpu.abi
```

Пример вывода команды: arm64-v8a означает 64-битную архитектуру ARM, ABI версии 8.

```text
arm64-v8a
```

Для платы под Linux запросите архитектуру следующей командой на компьютере:

```text
adb shell uname -a
```

Пример вывода команды: aarch64 означает 64-битную архитектуру ARM.

```text
Linux Rockchip 5.10.160 #183 SMP Tue Oct 24 18:52:11 CST 2023 aarch64 GNU/Linux
```

##### 3.4.2.2 Установка NDK для платы с Android

Применимость: платы с Android. Если плата работает под Linux, пропустите этот раздел.

Адрес загрузки NDK (рекомендуется r19c): https://dl.google.com/android/repository/android-ndk-r19c-linux-x86_64.zip

Распаковка программного пакета

Рекомендуется распаковать пакет NDK в Projects. Расположение:

```text
Projects
├── rknn-toolkit2
├── rknn_model_zoo
└── android-ndk-r19c # This path will be used when compiling the RKNN C Demo
```

Таким образом, путь к компилятору NDK — Projects/android-ndk-r19c.

##### 3.4.2.3 Установка кросс-компилятора GCC для платы с Linux

Применимость: платы с Linux. Если плата работает под Android, пропустите этот раздел.

Адрес загрузки GCC

64-битная система платы: https://developer.arm.com/-/cdn-downloads/permalink/legacy-linaro-gnu-toolchains/6.3-2017.05/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu.tar.xz

32-битная система платы: https://developer.arm.com/-/cdn-downloads/permalink/legacy-linaro-gnu-toolchains/6.3-2017.05/gcc-linaro-6.3.1-2017.05-x86_64_arm-linux-gnueabihf.tar.xz

Распаковка программного пакета

Рекомендуется распаковать пакет GCC в Projects. Например, для 64-битной системы расположение следующее:

```text
Projects
├── rknn-toolkit2
├── rknn_model_zoo
└── gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu # This path will be used when compiling the RKNN C Demo
```

Таким образом, путь к компилятору GCC — Projects/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu.

### 3.5 Предварительная проверка среды

Перед преобразованием модели рекомендуется выполнить все следующие проверки:

```text
# Toolkit
conda activate toolkit2
python -c "from rknn.api import RKNN; print('Toolkit OK')"

# Compilation tools
cmake --version

# Devices
adb devices
```

Для RKNN C Demo также проверьте путь компилятора в зависимости от ОС платы:

Плата с Android: путь NDK, например Projects/android-ndk-r19c;

Плата с Linux: путь GCC, например Projects/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu.

{% endraw %}
