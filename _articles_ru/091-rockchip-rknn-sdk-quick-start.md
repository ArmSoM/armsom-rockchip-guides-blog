---
title: "Быстрый старт Rockchip RKNN SDK: преобразование моделей, плата и Docker"
description: "Полное руководство V2.3.2: подключение платы, Miniforge, Toolkit2, RKNPU2, примеры YOLOv5 на Python/C, оценка точности и Docker."
translation_key: "091-rockchip-rknn-sdk-quick-start"
slug: "091-rockchip-rknn-sdk-quick-start"
lang: "ru"
date: "2026-10-22"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
reference_products: ["Sige7", "Sige7S", "Sige5", "CM7S", "CM5", "AIM7", "Sige3", "CM3", "AIM3", "AIM5", "LM7", "W3", "KVM"]
products: []
tags: ["Rockchip", "RKNN", "RK3588", "RK3576", "Toolkit2", "NPU"]
keywords: "ArmSoM Rockchip RKNN SDK Toolkit2 RKNPU2 YOLOv5"
excerpt: "Полное руководство V2.3.2: подключение платы, Miniforge, Toolkit2, RKNPU2, примеры YOLOv5 на Python/C, оценка точности и Docker."
---

{% raw %}

# Быстрый старт Rockchip RKNN SDK: преобразование моделей, плата и Docker

## Применимость к ArmSoM и источник

Это справка по платформе Rockchip, а не отчёт испытаний ArmSoM. Источники: RK-JC-YF-416, RKNN SDK V2.3.2, 27 китайских и 29 английских страниц. Китайская статья следует китайскому оригиналу, английская — английскому; русский и немецкий полностью переводят английский. Китайская версия использует все 16 китайских рисунков, остальные — 16 английских оригиналов. Показанные эталонные платы Rockchip, разъёмы и блоки питания не являются спецификацией ArmSoM: 12V-2A/12V-3A нельзя переносить на ArmSoM без проверки. Источник перечисляет RK3562, серии RK3566/3568/3576/3588 и RV1126B, но не определяет SDK/BSP, прошивку и ядро конкретной платы ArmSoM. Проверьте питание, OTG/adb, NPU-драйвер и совместимость Toolkit2/Server/Runtime. Linux 5.10.160, драйвер 0.8.8, детекции и журналы — примеры исходника, а не наши измерения. Установка, отладочные команды и аппаратные/скоростные тесты не выполнялись. V2.3.2 — состояние источника, не заявление о новейшей версии.

> Безопасность и сверка: исходник содержит root, adb remount, setenforce 0, членство в группе docker и --privileged. Они изменяют границы безопасности устройства/компьютера; это сохранённая справка, не проверенные команды для производственной системы. Различия версий, путей и нумерации, а также ошибки в журнальном снимке перечислены в редакционных примечаниях. Опасные параметры не заменены молча.

[EDITORIAL-NOTES](/docs/rockchip-rknn-sdk-quick-start/EDITORIAL-NOTES.md) · [ArmSoM Docs](https://docs.armsom.org/)


<!-- source: EN PDF p3; unit 0 -->

## 1 Введение

<!-- source: EN PDF p3; unit 1 -->

Это подробное руководство для начинающих по преобразованию моделей с помощью RKNN-Toolkit2 на компьютере и их развёртыванию на плате Rockchip через RKNPU2. Все примеры включены в RKNN Model Zoo.

<!-- source: EN PDF p3; unit 2 -->

Поддерживаемые платформы исходника: RK3562, серии RK3566, RK3568, RK3576, RK3588 и RV1126B.

<!-- source: EN PDF p3; unit 3 -->

## 2 Подготовка платы разработки

<!-- source: EN PDF p3; unit 4 -->

В этой главе подключение платы к компьютеру рассматривается в двух частях:

<!-- source: EN PDF p3; unit 5 -->

Знакомство с платой и средствами подключения

<!-- source: EN PDF p3; unit 6 -->

Подключение платы к компьютеру

<!-- source: EN PDF p3; unit 7 -->

### 2.1 Плата разработки и средства подключения

<!-- source: EN PDF p3; unit 8 -->

1\. Плата разработки

<!-- source: EN PDF p4; unit 9 -->

![Технический рисунок английского оригинала, страница 4](/docs/rockchip-rknn-sdk-quick-start/assets/en-p004-figure-01.png)

<!-- source: EN PDF p4; unit 10 -->

Рисунок 2-1. Плата разработки RK3562

<!-- source: EN PDF p4; unit 11 -->

![Технический рисунок английского оригинала, страница 4](/docs/rockchip-rknn-sdk-quick-start/assets/en-p004-figure-02.png)

<!-- source: EN PDF p4; unit 12 -->

Рисунок 2-2. Плата разработки RK3566

<!-- source: EN PDF p5; unit 13 -->

![Технический рисунок английского оригинала, страница 5](/docs/rockchip-rknn-sdk-quick-start/assets/en-p005-figure-01.png)

<!-- source: EN PDF p5; unit 14 -->

Рисунок 2-3. Плата разработки RK3568

<!-- source: EN PDF p5; unit 15 -->

![Технический рисунок английского оригинала, страница 5](/docs/rockchip-rknn-sdk-quick-start/assets/en-p005-figure-02.png)

<!-- source: EN PDF p5; unit 16 -->

Рисунок 2-4. Плата разработки RK3588

<!-- source: EN PDF p6; unit 17 -->

![Технический рисунок английского оригинала, страница 6](/docs/rockchip-rknn-sdk-quick-start/assets/en-p006-figure-01.png)

<!-- source: EN PDF p6; unit 18 -->

Рисунок 2-5. Плата разработки RK3576

<!-- source: EN PDF p6; unit 19 -->

![Технический рисунок английского оригинала, страница 6](/docs/rockchip-rknn-sdk-quick-start/assets/en-p006-figure-02.png)

<!-- source: EN PDF p6; unit 20 -->

Рисунок 2-6. Плата разработки RV1126B

<!-- source: EN PDF p7; unit 21 -->

![Технический рисунок английского оригинала, страница 7](/docs/rockchip-rknn-sdk-quick-start/assets/en-p007-figure-01.png)

<!-- source: EN PDF p7; unit 22 -->

Рисунок 2-7. Плата RV1126B, вид сбоку

<!-- source: EN PDF p7; unit 23 -->

2\. Кабель передачи данных между платой и компьютером

<!-- source: EN PDF p7; unit 24 -->

![Технический рисунок английского оригинала, страница 7](/docs/rockchip-rknn-sdk-quick-start/assets/en-p007-figure-02.png)

<!-- source: EN PDF p7; unit 25 -->

Рисунок 2-8. Кабель USB-A для платы RK3562/RK3568

<!-- source: EN PDF p7; unit 26 -->

![Технический рисунок английского оригинала, страница 7](/docs/rockchip-rknn-sdk-quick-start/assets/en-p007-figure-03.png)

<!-- source: EN PDF p7; unit 27 -->

Рисунок 2-9. Кабель Micro USB для платы RK3566

<!-- source: EN PDF p8; unit 28 -->

![Технический рисунок английского оригинала, страница 8](/docs/rockchip-rknn-sdk-quick-start/assets/en-p008-figure-01.png)

<!-- source: EN PDF p8; unit 29 -->

Рисунок 2-10. Кабель USB-C для платы RK3576/RK3588

<!-- source: EN PDF p8; unit 30 -->

3\. Блок питания

<!-- source: EN PDF p8; unit 31 -->

![Технический рисунок английского оригинала, страница 8](/docs/rockchip-rknn-sdk-quick-start/assets/en-p008-figure-02.png)

<!-- source: EN PDF p8; unit 32 -->

Рисунок 2-11. Блок питания с выходом 12V-2A для платы RK3562/RK3566/RK3568

<!-- source: EN PDF p8; unit 33 -->

![Технический рисунок английского оригинала, страница 8](/docs/rockchip-rknn-sdk-quick-start/assets/en-p008-figure-03.png)

<!-- source: EN PDF p8; unit 34 -->

Рисунок 2-12. Блок питания с выходом 12V-3A для платы RK3576/RK3588

<!-- source: EN PDF p8; unit 35 -->

### 2.2 Подключение платы к компьютеру

<!-- source: EN PDF p8; unit 36 -->

Подключение платы к компьютеру показано на примере RK3568:

<!-- source: EN PDF p8; unit 37 -->

1\. Подготовьте компьютер с Ubuntu18.04 / Ubuntu20.04 / Ubuntu22.04.

<!-- source: EN PDF p8; unit 38 -->

2\. Найдите на рисунке разъём питания и подключите блок питания платы.

<!-- source: EN PDF p9; unit 39 -->

3\. Соедините плату и компьютер кабелем передачи данных. Тип и расположение разъёма могут различаться между производственными партиями. Обычно интерфейс передачи данных обозначен на плате надписью OTG.

<!-- source: EN PDF p9; unit 40 -->

4\. Включите питание и дождитесь полной загрузки системы платы.

<!-- source: EN PDF p9; unit 41 -->

![Технический рисунок английского оригинала, страница 9](/docs/rockchip-rknn-sdk-quick-start/assets/en-p009-figure-01.png)

<!-- source: EN PDF p9; unit 42 -->

Рисунок 2-13. Плата разработки RK3568

<!-- source: EN PDF p9; unit 43 -->

1\. Проверьте, подключена ли плата к компьютеру. Номер шага 1 сохранён из английского оригинала; в китайском здесь шаг 5.

<!-- source: EN PDF p9; unit 44 -->

В терминале компьютера (интерфейсе командной строки) выполните следующую команду:

<!-- source: EN PDF p9; unit 45 -->

```text
# If adb has not been installed, please install it first using 'sudo apt install adb'
adb devices
```

<!-- source: EN PDF p9; unit 46 -->

При успешном подключении вывод будет следующим; 13af7b28115662cd — идентификатор устройства RK3568. Если устройство отсутствует, обратитесь к разделу 6.1.

<!-- source: EN PDF p9; unit 47 -->

```text
$ adb devices
List of devices attached
13af7b28115662cd device
```

<!-- source: EN PDF p9; unit 48 -->

## 3 Подготовка среды разработки

<!-- source: EN PDF p9; unit 49 -->

Глава описывает установку среды разработки непосредственно на компьютер; последующие примеры также предполагают такую установку. Для запуска примеров в Docker подготовьте среду по главе 5.

<!-- source: EN PDF p9; unit 50 -->

Глава состоит из четырёх частей:

<!-- source: EN PDF p9; unit 51 -->

Загрузка репозиториев RKNN

<!-- source: EN PDF p9; unit 52 -->

Установка RKNN-Toolkit2 на компьютер

<!-- source: EN PDF p10; unit 53 -->

Установка инструментов компиляции на компьютер

<!-- source: EN PDF p10; unit 54 -->

Установка среды RKNPU2 на плату

<!-- source: EN PDF p10; unit 55 -->

### 3.1 Загрузка репозиториев RKNN

<!-- source: EN PDF p10; unit 56 -->

Рекомендуется создать отдельный каталог для репозиториев RKNN, например Projects, и поместить в него RKNN-Toolkit2 и RKNN Model Zoo. Пример команд:

<!-- source: EN PDF p10; unit 57 -->

```text
# Create the 'Projects' folder
mkdir Projects

# Switch to this directory
cd Projects

# Download the RKNN-Toolkit2 repository
git clone https://github.com/airockchip/rknn-toolkit2.git --depth 1

# Download the RKNN Model Zoo repository
git clone https://github.com/airockchip/rknn_model_zoo.git --depth 1

# Notice:
# 1. Parameter --depth 1 means to clone only the latest commit
# 2. If the 'git clone' command fails, you can also download the compressed file directly from GitHub and unzip it locally in this directory.
```

<!-- source: EN PDF p10; unit 58 -->

Общая структура каталогов:

<!-- source: EN PDF p10; unit 59 -->

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
└── rknn_model_zoo
  ├── datasets
  ├── examples
  └── ...
```

<!-- source: EN PDF p10; unit 60 -->

### 3.2 Установка RKNN-Toolkit2 на компьютер

<!-- source: EN PDF p10; unit 61 -->

#### 3.2.1 Установка Python

<!-- source: EN PDF p10; unit 62 -->

Если Python 3.8 ещё не установлен либо имеется несколько сред Python, рекомендуется создать новую среду Python 3.8 с помощью Miniforge Conda.

<!-- source: EN PDF p11; unit 63 -->

##### 3.2.1.1 Установка Miniforge Conda

<!-- source: EN PDF p11; unit 64 -->

Проверьте установку Miniforge Conda следующей командой в терминале компьютера. Если программа уже установлена, этот этап можно пропустить.

<!-- source: EN PDF p11; unit 65 -->

```text
conda -V
# Reference output: conda 23.9.0, indicating that Miniforge Conda version is 23.9.0
# If it shows 'conda: command not found', it means Miniforge Conda is not installed.
```

<!-- source: EN PDF p11; unit 66 -->

Если Miniforge Conda не установлен, загрузите установщик по следующей ссылке:

<!-- source: EN PDF p11; unit 67 -->

```text
wget -c https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-x86_64.sh
```

<!-- source: EN PDF p11; unit 68 -->

Затем установите Miniforge Conda следующими командами:

<!-- source: EN PDF p11; unit 69 -->

```text
chmod 777 Miniforge3-Linux-x86_64.sh
bash Miniforge3-Linux-x86_64.sh
```

<!-- source: EN PDF p11; unit 70 -->

##### 3.2.1.2 Создание среды Python с Miniforge Conda

<!-- source: EN PDF p11; unit 71 -->

В терминале компьютера перейдите в базовую среду Miniforge conda следующей командой:

<!-- source: EN PDF p11; unit 72 -->

```text
source ~/miniforge3/bin/activate
# Upon successful activation, the command prompt will change to the following form:
# (base) xxx@xxx:~$
```

<!-- source: EN PDF p11; unit 73 -->

Создайте среду Python 3.8 с именем toolkit2 следующей командой:

<!-- source: EN PDF p11; unit 74 -->

```text
conda create -n toolkit2 python=3.8
```

<!-- source: EN PDF p11; unit 75 -->

Активируйте среду toolkit2; дальнейшая установка RKNN-Toolkit2 выполняется в ней.

<!-- source: EN PDF p11; unit 76 -->

```text
conda activate toolkit2
# Upon successful activation, the command prompt will change to the following form:
# (toolkit2) xxx@xxx:~$
```

<!-- source: EN PDF p11; unit 77 -->

#### 3.2.2 Установка RKNN-Toolkit2

<!-- source: EN PDF p11; unit 78 -->

После активации toolkit2 установите RKNN-Toolkit2 из источника pip либо из локального пакета wheel:

<!-- source: EN PDF p11; unit 79 -->

Установка из источника pip

<!-- source: EN PDF p11; unit 80 -->

```text
pip install rknn-toolkit2 -i https://pypi.org/simple

# If RKNN-Toolkit2 is already installed, you can upgrade it with the following command:
pip install rknn-toolkit2 -i https://pypi.org/simple --upgrade
```

<!-- source: EN PDF p11; unit 81 -->

Установка из локального пакета wheel

<!-- source: EN PDF p12; unit 82 -->

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

<!-- source: EN PDF p12; unit 83 -->

#### 3.2.3 Проверка установки среды RKNN-Toolkit2

<!-- source: EN PDF p12; unit 84 -->

Выполните следующую команду. Если ошибки отсутствуют, среда RKNN-Toolkit2 установлена успешно.

<!-- source: EN PDF p12; unit 85 -->

```text
# Switch to Python interactive mode
python

# Import the RKNN class
from rknn.api import RKNN
```

<!-- source: EN PDF p12; unit 86 -->

При ошибке установки см. раздел 10.2 «RKNN-Toolkit2 Installation Issue» документа Rockchip_RKNPU_User_Guide_RKNN_SDK_EN.pdf с подробными способами устранения проблем установки среды.

<!-- source: EN PDF p12; unit 87 -->

### 3.3 Установка инструментов компиляции на компьютер

<!-- source: EN PDF p12; unit 88 -->

#### 3.3.1 Установка CMake

<!-- source: EN PDF p12; unit 89 -->

В терминале компьютера выполните следующие команды:

<!-- source: EN PDF p12; unit 90 -->

```text
# Update package list
sudo apt update

# Install cmake
sudo apt install cmake
```

<!-- source: EN PDF p12; unit 91 -->

#### 3.3.2 Установка компилятора

<!-- source: EN PDF p12; unit 92 -->

##### 3.3.2.1 Определение типа системы и архитектуры платы

<!-- source: EN PDF p12; unit 93 -->

Далее для краткости плата разработки называется «платой».

<!-- source: EN PDF p12; unit 94 -->

1\. Определите тип системы платы.

<!-- source: EN PDF p12; unit 95 -->

В терминале компьютера выполните следующую команду:

<!-- source: EN PDF p12; unit 96 -->

```text
adb shell getprop ro.build.version.release
```

<!-- source: EN PDF p12; unit 97 -->

Если результат — число (версия Android), плата работает под Android.

<!-- source: EN PDF p13; unit 98 -->

```text
$ adb shell getprop ro.build.version.release
12
```

<!-- source: EN PDF p13; unit 99 -->

В противном случае плата работает под Linux.

<!-- source: EN PDF p13; unit 100 -->

```text
$ adb shell getprop ro.build.version.release
/bin/sh: getprop: not_found
```

<!-- source: EN PDF p13; unit 101 -->

1\. Определите архитектуру системы платы. Повтор номера сохранён из оригинала.

<!-- source: EN PDF p13; unit 102 -->

Для платы под Android запросите архитектуру следующей командой на компьютере:

<!-- source: EN PDF p13; unit 103 -->

```text
adb shell getprop ro.product.cpu.abi
```

<!-- source: EN PDF p13; unit 104 -->

Пример вывода приведён ниже: arm64-v8a обозначает 64-разрядную архитектуру ARM, ABI версии 8.

<!-- source: EN PDF p13; unit 105 -->

```text
$ adb shell getprop ro.product.cpu.abi
arm64-v8a
```

<!-- source: EN PDF p13; unit 106 -->

Для платы под Linux запросите архитектуру следующей командой на компьютере:

<!-- source: EN PDF p13; unit 107 -->

```text
adb shell uname -a
```

<!-- source: EN PDF p13; unit 108 -->

Пример вывода приведён ниже: aarch64 обозначает 64-разрядную архитектуру ARM.

<!-- source: EN PDF p13; unit 109 -->

```text
$ adb shell uname -a
Linux Rockchip 5.10.160 #183 SMP Tue Oct 24 18:52:11 CST 2023 aarch64 GNU/Linux
```

<!-- source: EN PDF p13; unit 110 -->

##### 3.3.2.2 Установка NDK для платы под Android

<!-- source: EN PDF p13; unit 111 -->

Примечание: раздел применим к платам под Android. Если плата работает под Linux, пропустите его.

<!-- source: EN PDF p13; unit 112 -->

Адрес загрузки NDK (исходник рекомендует r19c): [https://dl.google.com/android/repository/android-ndk-r19c-linux-x86_64.zip](https://dl.google.com/android/repository/android-ndk-r19c-linux-x86_64.zip)

<!-- source: EN PDF p13; unit 113 -->

Распаковка программного пакета

<!-- source: EN PDF p13; unit 114 -->

Рекомендуется распаковать пакет NDK в папку Projects. Расположение будет следующим:

<!-- source: EN PDF p13; unit 115 -->

```text
Projects
├── rknn-toolkit2
├── rknn_model_zoo
└── android-ndk-r19c # This path will be used when compiling RKNN C Demo
```

<!-- source: EN PDF p13; unit 116 -->

Таким образом, путь к компилятору NDK — Projects/android-ndk-r19c.

<!-- source: EN PDF p14; unit 117 -->

##### 3.3.2.3 Установка кросс-компилятора GCC для платы под Linux

<!-- source: EN PDF p14; unit 118 -->

Примечание: раздел применим к платам под Linux. Если плата работает под Android, пропустите его.

<!-- source: EN PDF p14; unit 119 -->

Адрес загрузки GCC

<!-- source: EN PDF p14; unit 120 -->

Для 64-разрядной системы платы: [https://releases.linaro.org/components/toolchain/binaries/6.3-2017.05/aarch64-linux-gnu/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu.tar.xz](https://releases.linaro.org/components/toolchain/binaries/6.3-2017.05/aarch64-linux-gnu/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu.tar.xz)

<!-- source: EN PDF p14; unit 121 -->

Для 32-разрядной системы платы: [https://releases.linaro.org/components/toolchain/binaries/6.3-2017.05/arm-linux-gnueabihf/gcc-linaro-6.3.1-2017.05-x86_64_arm-linux-gnueabihf.tar.xz](https://releases.linaro.org/components/toolchain/binaries/6.3-2017.05/arm-linux-gnueabihf/gcc-linaro-6.3.1-2017.05-x86_64_arm-linux-gnueabihf.tar.xz)

<!-- source: EN PDF p14; unit 122 -->

Распаковка программного пакета

<!-- source: EN PDF p14; unit 123 -->

Рекомендуется распаковать GCC в папку Projects. Пример расположения пакета GCC для 64-разрядной системы:

<!-- source: EN PDF p14; unit 124 -->

```text
  Projects
  ├── rknn-toolkit2
  ├── rknn_model_zoo
  └── gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu # This path will be used when compiling the RKNN C Demo
```

<!-- source: EN PDF p14; unit 125 -->

Таким образом, путь к компилятору GCC — Projects/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu.

<!-- source: EN PDF p14; unit 126 -->

### 3.4 Установка среды RKNPU2 на плату

<!-- source: EN PDF p14; unit 127 -->

#### 3.4.1 Проверка версии драйвера RKNPU2

<!-- source: EN PDF p14; unit 128 -->

Запросить версию драйвера RKNPU2 можно следующей командой на плате:

<!-- source: EN PDF p14; unit 129 -->

```text
dmesg | grep -i rknpu
```

<!-- source: EN PDF p14; unit 130 -->

На следующем рисунке показан исходный пример: версия драйвера RKNPU2 — 0.8.8.

<!-- source: EN PDF p14; unit 131 -->

![Технический рисунок английского оригинала, страница 14](/docs/rockchip-rknn-sdk-quick-start/assets/en-p014-figure-01.png)

Копируемая транскрипция журнала источника (ошибки сохранены; это не тест ArmSoM):

```text
rk3588_s_evb7:/ $ dmesg | grep -i rknpu
[    2.919448] [    T1] RKNPU fdab0000.npu: Adding to iommu group 0
[    2.919608] [    T1] RKNPU fdab0000.npu: RKNPU: rknpu iommu is enabled, using iommu mode
[    2.920935] [    T1] RKNPU fdab0000.npu: can't request region for resource [mem 0xfdab0000-0xfdabffff]
[    2.920959] [    T1] RKNPU fdab0000.npu: can't request region for resource [mem 0xfdac0000-0xfdacffff]
[    2.920973] [    T1] RKNPU fdab0000.npu: can't request region for resource [mem 0xfdad0000-0xfdadffff]
[    2.921339] [    T1] [drm] Initialized rknpu 0.8.8 20230428 for fdab0000.npu on minor 1
[    2.924082] [    T1] RKNPU fdab0000.npu: RKNPU: bin=0
[    2.924994] [    T1] RKNPU fdab0000.npu: leakage=10
[    2.925052] [    T1] debugfs: Directory 'fdab0000.npu-rknpu' with parent 'vdd_npu_s0' already present!
[    2.931816] [    T1] RKNPU fdab0000.npu: pvtm=866
[    2.936313] [    T1] RKNPU fdab0000.npu: pvtm-volt-sel=3
[    2.937408] [    T1] RKNPU fdab0000.npu: avs=0
[    2.937608] [    T1] RKNPU fdab0000.npu: l=10000 h=85000 hyst=5000 l_limit=0 h_limit=800000000 h_table=0
[    2.948777] [    T1] RKNPU fdab0000.npu: failed to find power_model node
[    2.948814] [    T1] RKNPU fdab0000.npu: RKNPU: failed to initialize power model
[    2.948826] [    T1] RKNPU fdab0000.npu: RKNPU: failed to get dynamic-coefficient
```

<!-- source: EN PDF p14; unit 132 -->

Рисунок 3-1. Информация о версии драйвера RKNPU2

<!-- source: EN PDF p14; unit 133 -->

По исходнику официальные прошивки плат Rockchip содержат драйвер RKNPU2. Если предыдущая команда не показывает версию NPU-драйвера, возможно, используется сторонняя прошивка без него. При наличии исходников прошивки установите CONFIG_ROCKCHIP_RKNPU в y в конфигурации ядра, затем пересоберите драйвер ядра и прошейте его. Рекомендуется версия драйвера RKNPU2 >= 0.9.2.

<!-- source: EN PDF p15; unit 135 -->

#### 3.4.2 Проверка установки среды RKNPU2

<!-- source: EN PDF p15; unit 136 -->

Для отладки с подключённой платой в RKNN-Toolkit2 необходимо установить на плате среду RKNPU2 и запустить службу rknn_server. Два основных понятия этой среды:

<!-- source: EN PDF p15; unit 137 -->

RKNN Server — фоновая прокси-служба на плате. Она вызывает соответствующие интерфейсы Runtime платы для обработки данных, переданных компьютером по USB, и возвращает результаты компьютеру.

<!-- source: EN PDF p15; unit 138 -->

Библиотека RKNPU2 Runtime (librknnrt.so) загружает в системе модель RKNN и выполняет её инференс, обращаясь к специализированному нейронному процессору NPU.

<!-- source: EN PDF p15; unit 139 -->

Если RKNN Server и библиотека Runtime не установлены либо их версии не согласованы, переустановите среду RKNPU2. Примечания исходника: 1. Моделям RKNN с динамическими входными размерами необходимы RKNN Server и Runtime версии >= 1.5.0. 2. Версии RKNN Server, Runtime и RKNN-Toolkit2 должны быть согласованы; источник рекомендует устанавливать последние версии. Эта рекомендация относится к состоянию исходного документа, а не к проверке современных пакетов.

<!-- source: EN PDF p15; unit 140 -->

Обычно на плате по умолчанию уже установлена среда RKNPU2 с согласованными версиями. Проверьте это следующей командой. Если среда отсутствует или версии не согласованы, установите/обновите её по следующему разделу.

<!-- source: EN PDF p15; unit 141 -->

1\. Плата работает под Android

<!-- source: EN PDF p15; unit 142 -->

Проверка установки среды RKNPU2

<!-- source: EN PDF p15; unit 143 -->

Если служба rknn_server запускается, среда RKNPU2 уже установлена на плате.

<!-- source: EN PDF p15; unit 144 -->

```text
# Switch to the board
adb shell

# Start rknn_server
su
setenforce 0
/vendor/bin/rknn_server &
```

<!-- source: EN PDF p15; unit 145 -->

Следующий вывод означает успешный запуск rknn_server и наличие установленной среды RKNPU2:

<!-- source: EN PDF p15; unit 146 -->

```text
start rknn server, version: x.x.x
```

<!-- source: EN PDF p15; unit 147 -->

Проверка согласованности версий

<!-- source: EN PDF p15; unit 148 -->

```text
# Query rknn_server version
strings /vendor/bin/rknn_server | grep -i "rknn_server version"

# Query librknnrt.so library version
# For 64-bit systems
strings /vendor/lib64/librknnrt.so | grep -i "librknnrt version"

# For 32-bit systems
strings /vendor/lib/librknnrt.so | grep -i "librknnrt version"
```

<!-- source: EN PDF p16; unit 149 -->

В следующем примере вывода версия rknn_server — x.x.x, версия librknnrt.so — x.x.x.

<!-- source: EN PDF p16; unit 150 -->

```text
rknn_server version: x.x.x
librknnrt version: x.x.x
```

<!-- source: EN PDF p16; unit 151 -->

1\. Плата работает под Linux. Повтор номера соответствует оригиналу.

<!-- source: EN PDF p16; unit 152 -->

Проверка установки среды RKNPU2

<!-- source: EN PDF p16; unit 153 -->

Если служба rknn_server запускается, среда RKNPU2 уже установлена на плате.

<!-- source: EN PDF p16; unit 154 -->

```text
# Switch to the board
adb shell

# Start rknn_server
restart_rknn.sh
```

<!-- source: EN PDF p16; unit 155 -->

Следующий вывод означает успешный запуск rknn_server и наличие установленной среды RKNPU2:

<!-- source: EN PDF p16; unit 156 -->

```text
start rknn server, version: x.x.x
```

<!-- source: EN PDF p16; unit 157 -->

Проверка согласованности версий

<!-- source: EN PDF p16; unit 158 -->

```text
# Query rknn_server version
strings /usr/bin/rknn_server | grep -i "rknn_server version"

# Query librknnrt.so library version
strings /usr/lib/librknnrt.so | grep -i "librknnrt version"
```

<!-- source: EN PDF p16; unit 159 -->

В следующем примере вывода версия rknn_server — x.x.x, версия librknnrt.so — x.x.x.

<!-- source: EN PDF p16; unit 160 -->

```text
rknn_server version: x.x.x
librknnrt version: x.x.x
```

<!-- source: EN PDF p16; unit 161 -->

#### 3.4.3 Установка/обновление среды RKNPU2

<!-- source: EN PDF p16; unit 162 -->

Разным системам платы соответствуют разные среды RKNPU2. Ниже приведены способы установки для каждой системы.

<!-- source: EN PDF p16; unit 163 -->

Примечание: если среда RKNPU2 с согласованными версиями уже установлена, этот раздел можно пропустить.

<!-- source: EN PDF p16; unit 164 -->

1\. Плата работает под Android

<!-- source: EN PDF p16; unit 165 -->

Перейдите в каталог rknpu2, передайте на плату соответствующие rknn_server и librknnrt.so с помощью adb, затем запустите rknn_server. Пример команд:

<!-- source: EN PDF p16; unit 166 -->

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

<!-- source: EN PDF p17; unit 168 -->

1\. Плата работает под Linux. Повтор номера соответствует оригиналу.

<!-- source: EN PDF p17; unit 169 -->

Перейдите в каталог rknpu2, передайте на плату соответствующие rknn_server и librknnrt.so с помощью adb, затем запустите rknn_server. Пример команд:

<!-- source: EN PDF p17; unit 170 -->

```text
# Switch to the rknpu2 directory
cd Projects/rknn-toolkit2/rknpu2

# Push rknn_server to the board
# Note: In 64-bit Linux systems, BOARD_ARCH corresponds to the aarch64 directory. in 32-bit systems, it corresponds to the armhf directory.
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

<!-- source: EN PDF p18; unit 171 -->

## 4 Запуск примеров

<!-- source: EN PDF p18; unit 172 -->

Глава описывает быстрый запуск примеров на плате и состоит из трёх частей:

<!-- source: EN PDF p18; unit 173 -->

Знакомство с RKNN Model Zoo

<!-- source: EN PDF p18; unit 174 -->

Запуск RKNN Python Demo

<!-- source: EN PDF p18; unit 175 -->

Запуск RKNN C Demo

<!-- source: EN PDF p18; unit 176 -->

### 4.1 Знакомство с RKNN Model Zoo

<!-- source: EN PDF p18; unit 177 -->

RKNN Model Zoo содержит примеры кода для быстрого запуска распространённых моделей на платах Rockchip. Структура проекта:

<!-- source: EN PDF p18; unit 178 -->

```text
rknn_model_zoo
├── 3rdparty # Third-party libraries
├── datasets # Datasets
├── examples # Example code
├── utils # Commonly used methods
├── build-android.sh # Compilation script for Android system board
├── build-linux.sh # Compilation script for Linux system board
└── ...
```

<!-- source: EN PDF p18; unit 179 -->

В examples находятся примеры распространённых моделей, например MobileNet и YOLO. Для каждой модели доступны реализации Python и C/C++; далее они называются RKNN Python Demo и RKNN C Demo. Пример структуры каталога модели YOLOv5:

<!-- source: EN PDF p18; unit 180 -->

```text
rknn_model_zoo
├── examples
│ └── yolov5
│ ├── cpp # C/C++ version of the sample code
│ ├── model # Models, test images, and other files
│ ├── python # Python version of the sample code
│ └── README.md
└── ...
```

<!-- source: EN PDF p18; unit 181 -->

### 4.2 Запуск RKNN Python Demo

<!-- source: EN PDF p18; unit 182 -->

Использование RKNN Python Demo рассматривается на примере YOLOv5.

<!-- source: EN PDF p18; unit 183 -->

Примечание: способы запуска разных RKNN Python Demo могут отличаться. Следуйте README.md в соответствующем каталоге.

<!-- source: EN PDF p18; unit 184 -->

#### 4.2.1 Подготовка модели

<!-- source: EN PDF p18; unit 185 -->

Перейдите в rknn_model_zoo/examples/yolov5/model и запустите download_model.sh. Сценарий загрузит доступную ONNX-модель YOLOv5 и сохранит её в текущем каталоге model. Пример команд:

<!-- source: EN PDF p19; unit 186 -->

```text
# Switch to the rknn_model_zoo/examples/yolov5/model directory
cd Projects/rknn_model_zoo/examples/yolov5/model

# Run the download_model.sh script to download the yolov5 ONNX model
# For example, the downloaded ONNX model is stored at model/yolov5s_relu.onnx
./download_model.sh
```

<!-- source: EN PDF p19; unit 187 -->

#### 4.2.2 Преобразование модели

<!-- source: EN PDF p19; unit 188 -->

Перейдите в rknn_model_zoo/examples/yolov5/python и запустите convert.py. Сценарий преобразует исходную ONNX-модель в RKNN. Пример команд:

<!-- source: EN PDF p19; unit 189 -->

```text
# Switch to the rknn_model_zoo/examples/yolov5/python directory
cd Projects/rknn_model_zoo/examples/yolov5/python

# Run the convert.py script to convert the original ONNX model to RKNN format
# Usage: python convert.py model_path [rk3566|rk3588|rk3562] [i8/fp] [output_path]
python convert.py ../model/yolov5s_relu.onnx rk3588 i8 ../model/yolov5s_relu.rknn
```

<!-- source: EN PDF p19; unit 190 -->

#### 4.2.3 Запуск RKNN Python Demo

<!-- source: EN PDF p19; unit 191 -->

Перейдите в rknn_model_zoo/examples/yolov5/python и запустите yolov5.py. Модель YOLOv5 будет выполняться на плате с помощью отладки с подключённым устройством. Пример команды:

<!-- source: EN PDF p19; unit 192 -->

```text
# Switch to the Projects/rknn_model_zoo/examples/yolov5/python directory
cd Projects/rknn_model_zoo/examples/yolov5/python

# Run the yolov5.py script to execute YOLOv5 model on the edge device
# Usage: python yolov5.py --model_path {rknn_model} --target {target_platform} --img_show

# If the --img_show parameter is included, the result image will be displayed
# Note: Here, the example is for the rk3588 platform. if using a different board, modify the platform type in the command accordingly
python yolov5.py --model_path ../model/yolov5s_relu.rknn --target rk3588 --img_show

# If you want to run the original onnx model on the computer first, you can use the following command
# Usage: python yolov5.py --model_path {onnx_model} --img_show
python yolov5.py --model_path ../model/yolov5s_relu.onnx --img_show
```

<!-- source: EN PDF p19; unit 193 -->

Входное изображение по умолчанию — model/bus.jpg; выходное показано ниже:

<!-- source: EN PDF p20; unit 194 -->

![Технический рисунок английского оригинала, страница 20](/docs/rockchip-rknn-sdk-quick-start/assets/en-p020-figure-01.png)

<!-- source: EN PDF p20; unit 195 -->

Рисунок 4-1. Выходное изображение RKNN Python Demo

<!-- source: EN PDF p20; unit 196 -->

#### 4.2.4 Оценка точности (необязательно)

<!-- source: EN PDF p20; unit 197 -->

В rknn_model_zoo/datasets хранятся наборы данных для оценки точности; предварительно их необходимо загрузить в этот каталог. Например, для YOLOv5 нужен COCO. Перейдите в rknn_model_zoo/datasets/COCO и запустите download_eval_dataset.py: он загрузит val2017 в текущий каталог COCO. Пример команд:

<!-- source: EN PDF p20; unit 198 -->

```text
# Switch to the rknn_model_zoo/datasets/COCO directory
cd Projects/rknn_model_zoo/datasets/COCO

# Run the download_eval_dataset.py script to download the COCO dataset
python download_eval_dataset.py
```

<!-- source: EN PDF p20; unit 199 -->

Для оценки точности укажите параметр --coco_map_test и путь набора данных --img_folder. Пример команд (визуальный перенос в названии --img_folder соединён):

<!-- source: EN PDF p21; unit 200 -->

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

<!-- source: EN PDF p21; unit 201 -->

### 4.3 Запуск RKNN C Demo

<!-- source: EN PDF p21; unit 202 -->

Использование RKNN C Demo рассматривается на примере YOLOv5.

<!-- source: EN PDF p21; unit 203 -->

Примечание: способы запуска разных RKNN C Demo могут отличаться. Следуйте README.md в соответствующем каталоге.

<!-- source: EN PDF p21; unit 204 -->

#### 4.3.1 Подготовка модели

<!-- source: EN PDF p21; unit 205 -->

Перейдите в rknn_model_zoo/examples/yolov5/model и запустите download_model.sh. Сценарий загрузит доступную ONNX-модель YOLOv5 и сохранит её в текущем каталоге model. Пример команд:

<!-- source: EN PDF p21; unit 206 -->

```text
# Switch to the rknn_model_zoo/examples/yolov5/model directory
cd Projects/rknn_model_zoo/examples/yolov5/model

# Run the download_model.sh script to download the yolov5 ONNX model
# For example, the downloaded ONNX model is stored at model/yolov5s_relu.onnx
./download_model.sh
```

<!-- source: EN PDF p21; unit 207 -->

#### 4.3.2 Преобразование модели

<!-- source: EN PDF p21; unit 208 -->

Перейдите в rknn_model_zoo/examples/yolov5/python и запустите convert.py. Сценарий преобразует исходную ONNX-модель в RKNN. Пример команд:

<!-- source: EN PDF p21; unit 209 -->

```text
# Switch to the rknn_model_zoo/examples/yolov5/python directory
cd Projects/rknn_model_zoo/examples/yolov5/python

# Run the convert.py script to convert the original ONNX model to RKNN format
# Usage: python convert.py model_path [rk3566|rk3588|rk3562] [i8/fp] [output_path]
python convert.py ../model/yolov5s_relu.onnx rk3588 i8 ../model/yolov5s_relu.rknn
```

<!-- source: EN PDF p21; unit 210 -->

#### 4.3.3 Запуск RKNN C Demo

<!-- source: EN PDF p21; unit 211 -->

Для RKNN C Demo сначала скомпилируйте C/C++-исходники в исполняемый файл. Затем передайте его на плату вместе с моделью, входными изображениями и другими необходимыми файлами и запустите на плате.

<!-- source: EN PDF p21; unit 212 -->

Порядок выполнения зависит от системы платы. Ниже показаны примеры для RK3588 под Android и RK356x под Linux.

<!-- source: EN PDF p22; unit 213 -->

##### 4.3.3.1 Компиляция

<!-- source: EN PDF p22; unit 214 -->

Плата работает под Android

<!-- source: EN PDF p22; unit 215 -->

Для RK3588 под Android с архитектурой arm64-v8a используется build-android.sh из rknn_model_zoo. Перед запуском задайте ANDROID_NDK_PATH как путь к локальному NDK-компилятору. Добавьте в build-android.sh следующую строку:

<!-- source: EN PDF p22; unit 216 -->

```text
# Add the following line to the beginning of the 'build-android.sh' script
ANDROID_NDK_PATH=Projects/android-ndk-r19c
```

<!-- source: EN PDF p22; unit 217 -->

Затем в каталоге rknn_model_zoo запустите build-android.sh следующей командой:

<!-- source: EN PDF p22; unit 218 -->

```text
# Switch to the rknn_model_zoo directory
cd Projects/rknn_model_zoo

# Run the build-android.sh script
# Usage: ./build-android.sh -t <target> -a <arch> -d <build_demo_name> [-b <build_type>] [-m]
# -t : target (rk356x/rk3588) # Platform type
# -a : arch (arm64-v8a/armeabi-v7a) # Edge device system architecture
# -d : demo name # Corresponding to the name of the subfolders under the examples directory, such as yolov5, MobileNet
# -b : build_type (Debug/Release)
# -m : enable address sanitizer, build_type needs to be set to Debug
./build-android.sh -t rk3588 -a arm64-v8a -d yolov5
```

<!-- source: EN PDF p22; unit 219 -->

Плата работает под Linux

<!-- source: EN PDF p22; unit 220 -->

Для RK356x под Linux с архитектурой aarch64 используется build-linux.sh из rknn_model_zoo. Перед запуском задайте GCC_COMPILER как путь к локальному GCC-компилятору. Добавьте в build-linux.sh следующую строку:

<!-- source: EN PDF p22; unit 221 -->

```text
# Add the following line to the beginning of the 'build-linux.sh' script
GCC_COMPILER=Projects/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu
```

<!-- source: EN PDF p22; unit 222 -->

Затем в каталоге rknn_model_zoo запустите build-linux.sh следующей командой:

<!-- source: EN PDF p22; unit 223 -->

```text
# Switch to the rknn_model_zoo directory
cd Projects/rknn_model_zoo

# Run the build-linux.sh script
# Usage: ./build-linux.sh -t <target> -a <arch> -d <build_demo_name> [-b <build_type>] [-m]
# -t : target (rk356x/rk3588) # Platform type, rk3568/rk3566 are both unified as rk356x
# -a : arch (aarch64/armhf) # Edge device system architecture
# -d : demo name # Corresponding to the name of the subfolders under the examples directory, such as yolov5, MobileNet
# -b : build_type(Debug/Release)
# -m : enable address sanitizer, build_type needs to be set to Debug
./build-linux.sh -t rk356x -a aarch64 -d yolov5
```

<!-- source: EN PDF p23; unit 224 -->

##### 4.3.3.2 Передача файлов на плату

<!-- source: EN PDF p23; unit 225 -->

После компиляции в rknn_model_zoo появится каталог install. В нём находятся исполняемый файл и связанные файлы, в том числе входные изображения. Структура каталога:

<!-- source: EN PDF p23; unit 226 -->

```text
install
├── rk356x_linux_aarch64 # rk356x platform
└── rk3588_android_arm64-v8a # rk3588 platform
 └── rknn_yolov5_demo
   ├── lib # Dependency library
   ├── model # Store models, test images and other files
   └── rknn_yolov5_demo # Executable file
```

<!-- source: EN PDF p23; unit 227 -->

Способ передачи файлов на плату зависит от типа её системы.

<!-- source: EN PDF p23; unit 228 -->

Плата работает под Android

<!-- source: EN PDF p23; unit 229 -->

Для платформы RK3588 под Android:

<!-- source: EN PDF p23; unit 230 -->

```text
# Switch to the rknn_model_zoo directory
cd Projects/rknn_model_zoo

# Switch to root user permissions
adb root

# Push the entire rknn_yolov5_demo folder to the board
# Note: The rknn_yolov5_demo folder contains an executable file with the same name, rknn_yolov5_demo
# Note: When using different models and platforms, it is recommended to find the corresponding path directly under the 'install' directory
adb push install/rk3588_android_arm64-v8a/rknn_yolov5_demo/ /data/
```

<!-- source: EN PDF p23; unit 231 -->

Плата работает под Linux

<!-- source: EN PDF p23; unit 232 -->

Для платформы RK356x под Linux:

<!-- source: EN PDF p23; unit 233 -->

```text
# Switch to the rknn_model_zoo directory
cd Projects/rknn_model_zoo

# Push the entire rknn_yolov5_demo folder to the board
# Note: The rknn_yolov5_demo folder contains an executable file with the same name, rknn_yolov5_demo
# Note: When using different models and platforms, it is recommended to find the corresponding path directly under the 'install' directory
adb push install/rk356x_linux_aarch64/rknn_yolov5_demo /data/
```

<!-- source: EN PDF p23; unit 234 -->

##### 4.3.3.3 Запуск Demo на плате разработки

<!-- source: EN PDF p23; unit 235 -->

Выполните следующие команды для запуска исполняемого файла на плате:

<!-- source: EN PDF p24; unit 236 -->

```text
# Switch to the board
adb shell

# Switch to the rknn_yolov5_demo directory
cd /data/rknn_yolov5_demo/

# Set the library dependency environment
export LD_LIBRARY_PATH=./lib

# Run the executable file
# Usage: ./rknn_yolov5_demo <model_path> <input_path>
./rknn_yolov5_demo model/yolov5s_relu.rknn model/bus.jpg
```

<!-- source: EN PDF p24; unit 237 -->

##### 4.3.3.4 Просмотр результатов

<!-- source: EN PDF p24; unit 238 -->

По умолчанию выходное изображение сохраняется в rknn_yolov5_demo/out.png. Скопируйте его с платы на компьютер через adb. В терминале компьютера выполните следующую команду:

<!-- source: EN PDF p24; unit 239 -->

```text
# Pull to the local current directory
adb pull /data/rknn_yolov5_demo/out.png .
```

<!-- source: EN PDF p24; unit 240 -->

Выходное изображение:

<!-- source: EN PDF p25; unit 241 -->

![Технический рисунок английского оригинала, страница 25](/docs/rockchip-rknn-sdk-quick-start/assets/en-p025-figure-01.png)

<!-- source: EN PDF p25; unit 242 -->

Рисунок 4-2. Выходное изображение RKNN C Demo

<!-- source: EN PDF p25; unit 243 -->

## 5 Запуск RKNN Python Demo в Docker (необязательно)

<!-- source: EN PDF p25; unit 244 -->

Для запуска RKNN Python Demo в Docker подготовьте среду разработки по этой главе.

<!-- source: EN PDF p25; unit 245 -->

Предоставляемый образ Docker содержит среду RKNN-Toolkit2, поэтому RKNN Python Demo можно запускать без самостоятельной установки её зависимостей. Однако образ содержит только чистую среду RKNN-Toolkit2 и предназначен именно для RKNN Python Demo.

<!-- source: EN PDF p25; unit 246 -->

Глава состоит из трёх частей:

<!-- source: EN PDF p25; unit 247 -->

Установка Docker

<!-- source: EN PDF p25; unit 248 -->

Установка RKNN-Toolkit2 в Docker

<!-- source: EN PDF p25; unit 249 -->

Запуск RKNN Python Demo

<!-- source: EN PDF p26; unit 250 -->

### 5.1 Установка Docker

<!-- source: EN PDF p26; unit 251 -->

Если Docker уже установлен, этот этап можно пропустить. В противном случае установите его по официальной документации.

<!-- source: EN PDF p26; unit 252 -->

Официальная инструкция установки Docker: [https://docs.docker.com/install/linux/docker-ce/ubuntu/](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

<!-- source: EN PDF p26; unit 253 -->

Примечание: пользователя необходимо добавить в группу docker.

<!-- source: EN PDF p26; unit 254 -->

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

<!-- source: EN PDF p26; unit 255 -->

Пример вывода после успешной установки:

<!-- source: EN PDF p26; unit 256 -->

```text
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
719385e32844: Pull complete
Digest: sha256:88ec0acaa3ec199d3b7eaf73588f4518c25f9d34f58ce9a0df68429c5af48e8d
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
```

<!-- source: EN PDF p26; unit 257 -->

### 5.2 Установка RKNN-Toolkit2 в Docker

<!-- source: EN PDF p26; unit 258 -->

#### 5.2.1 Подготовка образа RKNN-Toolkit2

<!-- source: EN PDF p26; unit 259 -->

Ниже описаны два способа создания образа среды RKNN-Toolkit2; выберите один из них.

<!-- source: EN PDF p26; unit 260 -->

1\. Создание образа RKNN Toolkit2 с помощью Dockerfile

<!-- source: EN PDF p26; unit 261 -->

В проекте RKNN-Toolkit2 каталог docker/docker_file содержит Dockerfile для сборки среды разработки. Создайте образ командой docker build, как показано ниже:

<!-- source: EN PDF p26; unit 262 -->

```text
# Note: Replace 'xx' and 'x.x.x' with the actual version numbers
cd Projects/rknn-toolkit2/rknn-toolkit2/docker/docker_file/ubuntu_xx_xx_cpxx

docker build -f Dockerfile_ubuntu_xx_xx_for_cpxx -t rknn-toolkit2:x.x.x-cpxx .
```

<!-- source: EN PDF p26; unit 263 -->

2\. Создание образа RKNN Toolkit2 загрузкой готового файла Docker-образа

<!-- source: EN PDF p26; unit 264 -->

Загрузите по следующей ссылке файлы проекта RKNN-Toolkit2 нужной версии и распакуйте их. В docker/docker_image находится готовый Docker-образ со всей средой разработки.

<!-- source: EN PDF p27; unit 265 -->

Ссылка на облачное хранилище: [https://console.zbox.filez.com/l/I00fc3](https://console.zbox.filez.com/l/I00fc3) (код доступа: rknn).

<!-- source: EN PDF p27; unit 266 -->

Следующей командой загрузите файл образа, соответствующий нужной версии Python.

<!-- source: EN PDF p27; unit 267 -->

```text
# Note: Replace 'x.x.x' with the actual version number of RKNN-Toolkit2, and 'cpxx' with the Python version

docker load --input rknn-toolkit2-x.x.x-cpxx-docker.tar.gz
```

<!-- source: EN PDF p27; unit 268 -->

#### 5.2.2 Просмотр сведений об образе

<!-- source: EN PDF p27; unit 269 -->

После создания или загрузки образа просмотрите сведения о Docker-образах следующей командой:

<!-- source: EN PDF p27; unit 270 -->

```text
docker images
```

<!-- source: EN PDF p27; unit 271 -->

Пример сведений об образе RKNN-Toolkit2:

<!-- source: EN PDF p27; unit 272 -->

```text
REPOSITORY TAG IMAGE ID CREATED SIZE
rknn-toolkit2 x.x.x-cpxx xxxxxxxxxxxx 1 hours ago 5.89GB
```

<!-- source: EN PDF p27; unit 273 -->

### 5.3 Запуск RKNN Python Demo

<!-- source: EN PDF p27; unit 274 -->

Примечание: убедитесь, что среда RKNPU2 установлена на плате. Если нет, см. раздел 3.4 с инструкциями установки.

<!-- source: EN PDF p27; unit 276 -->

Монтирование файлов и запуск контейнера

<!-- source: EN PDF p27; unit 277 -->

Загрузите проект RKNN Model Zoo на компьютер по разделу 3.1. Затем смонтируйте его в контейнер и запустите контейнер командой docker run; после запуска откроется среда bash контейнера. Пример команд:

<!-- source: EN PDF p27; unit 278 -->

```text
# Use the docker run command to create and run the RKNN Toolkit2 container
# Map local files into the container by attaching the -v <host src folder>:<image dst folder> parameter
docker run -t -i --privileged \
  -v /dev/bus/usb:/dev/bus/usb \
  -v /Projects/rknn_model_zoo:/rknn_model_zoo \
  rknn-toolkit2:x.x.x-cpxx \
  /bin/bash
```

<!-- source: EN PDF p27; unit 279 -->

Подготовка модели

<!-- source: EN PDF p27; unit 280 -->

Перейдите в rknn_model_zoo/examples/yolov5/model и запустите download_model.sh. Сценарий загрузит доступную ONNX-модель YOLOv5 и сохранит её в текущем каталоге model. Пример команд:

<!-- source: EN PDF p27; unit 281 -->

```text
# Switch to the rknn_model_zoo/examples/yolov5/model directory
cd rknn_model_zoo/examples/yolov5/model

# Run the download_model.sh script to download the yolov5 onnx model
./download_model.sh

# For example, the downloaded onnx model will be stored at model/yolov5s_relu.onnx
```

<!-- source: EN PDF p28; unit 282 -->

Преобразование модели

<!-- source: EN PDF p28; unit 283 -->

Перейдите в rknn_model_zoo/examples/yolov5/python и запустите convert.py. Сценарий преобразует исходную ONNX-модель в RKNN. Пример команд:

<!-- source: EN PDF p28; unit 284 -->

```text
# Switch to the rknn_model_zoo/examples/yolov5/python directory
cd Projects/rknn_model_zoo/examples/yolov5/python

# Run the convert.py script to convert the original ONNX model to RKNN format
# Usage: python convert.py model_path [rk3566|rk3588|rk3562] [i8/fp] [output_path]

python convert.py ../model/yolov5s_relu.onnx rk3588 i8 ../model/yolov5s_relu.rknn
```

<!-- source: EN PDF p28; unit 285 -->

Запуск RKNN Python Demo

<!-- source: EN PDF p28; unit 286 -->

Перейдите в rknn_model_zoo/examples/yolov5/python и запустите yolov5.py. Модель YOLOv5 будет выполняться на плате с помощью отладки с подключённым устройством. Пример команды:

<!-- source: EN PDF p28; unit 287 -->

```text
# Switch to the rknn_model_zoo/examples/yolov5/python directory
cd rknn_model_zoo/examples/yolov5/python

# Run the yolov5.py script to run the yolov5 model on the board
# Usage: python yolov5.py --model_path {rknn_model} --target {target_platform}
# Note: Here, we use rk3588 as an example platform. If using a different board, modify the platform type in the command accordingly.
python yolov5.py --model_path ../model/yolov5s_relu.rknn --target rk3588
```

<!-- source: EN PDF p28; unit 288 -->

После успешного запуска сценария появится следующий вывод. Поле class — предсказанная категория, score — уверенность; (xmin, ymin) — координаты верхнего левого угла рамки обнаружения, (xmax, ymax) — нижнего правого.

<!-- source: EN PDF p28; unit 289 -->

```text
# class @ （xmin, ymin, xmax, ymax）score
person @ (209 244 286 506) 0.884
person @ (478 238 559 526) 0.868
person @ (110 238 230 534) 0.825
bus @ (94 129 553 468) 0.705
person @ (79 354 122 516) 0.339
```

<!-- source: EN PDF p28; unit 290 -->

## 6 Часто задаваемые вопросы

<!-- source: EN PDF p28; unit 291 -->

### 6.1 Команда adb devices не показывает устройство

<!-- source: EN PDF p28; unit 292 -->

Попробуйте следующие способы устранения проблемы:

<!-- source: EN PDF p28; unit 293 -->

1\. Проверьте правильность соединения, переподключите кабель, попробуйте другой USB-порт компьютера либо другой кабель.

<!-- source: EN PDF p28; unit 294 -->

2\. При USB-подключении платы одновременно должен работать только один adb server — на компьютере либо в контейнере Docker. Например, перед подключением платы из контейнера выполните adb kill-server в терминале компьютера, чтобы остановить локальный adb server.

<!-- source: EN PDF p29; unit 295 -->

3\. Следующая ошибка означает, что adb не установлен. Установите его командой sudo apt install adb.

<!-- source: EN PDF p29; unit 296 -->

```text
command 'adb' not found, but can be installed with:
sudo apt install adb
```

<!-- source: EN PDF p29; unit 297 -->

### 6.2 Ручной запуск службы rknn_server

<!-- source: EN PDF p29; unit 298 -->

Для отладки с подключённой платой в RKNN-Toolkit2 на плате должны быть установлены среда RKNPU2 и запущена служба rknn_server.

<!-- source: EN PDF p29; unit 299 -->

На некоторых платах служба rknn_server не запускается автоматически после включения или перезагрузки. Поэтому RKNN Python Demo может сообщать E init_runtime: The rknn_server on the connected device is abnormal. Тогда перейдите на плату и запустите службу вручную по разделу 3.4.2 «Проверка установки среды RKNPU2».

<!-- source: EN PDF p29; unit 300 -->

## 7 Справочная документация

<!-- source: EN PDF p29; unit 301 -->

Подробное описание использования и интерфейсов RKNN-Toolkit2 и RKNPU2 приведено в Rockchip_RKNPU_User_Guide_RKNN_SDK_EN.pdf.

{% endraw %}
