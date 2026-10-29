---
title: "RKNN2 SDK V2.5.0 · Среда разработки, версии и подключение платы"
description: "RKNN2 SDK V2.5.0 · Среда разработки, версии и подключение платы · Полная серия руководства разработчика"
excerpt: "Среда разработки, версии и подключение платы"
translation_key: "rknn-v250-sdk-guide-environment"
slug: "rknn-v250-sdk-guide-environment"
lang: "ru"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "V2.5.0", "NPU"]
---

Справочник платформы по руководству Rockchip RKNN2 SDK V2.5.0. Рассматриваются только перечисленные в исходном документе SoC, Linux/Android Runtime и Toolkit. Возможности действуют при указанных в каждом разделе условиях для чипа, SDK, драйвера и ядра и не означают поддержку всех плат ArmSoM. Перед развёртыванием проверьте BSP, драйвер NPU, Runtime и версию модели конкретной платы. Проверка на оборудовании ArmSoM не проводилась; журналы, показатели и примеры взяты из оригинала.

Источники и вычитка: китайская версия следует китайскому V2.5.0 (182 страницы), английская, русская и немецкая — английскому V2.5.0 (208 страниц). Различия оригиналов сохранены; сведения старой версии не выдаются за новые. Китайские рисунки взяты из китайского PDF, остальные — из английского, включая отдельно извлечённые векторные схемы. Номера разделов и формул сохранены. Некоторые ссылки используют старую нумерацию; примеры динамической формы содержат «1224+140=264», утверждения о TP_NORM противоречат друг другу, а init()/rknn.val_perf() отличаются от последующих описаний API. Эти сомнения сохранены: перед выполнением проверьте реальные заголовки и справочник V2.5.0. Код и параметры сохранены, разрывы PDF и продолжения таблиц восстановлены.

[Rockchip RKNN2 SDK V2.5.0](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

**RKNN2 SDK V2.5.0 · 2/22**

[1. Программный стек и основные понятия](/ru/articles/rknn-v250-sdk-guide-overview/)

**Среда разработки, версии и подключение платы**

[3. Процесс разработки и выбор интерфейса](/ru/articles/rknn-v250-sdk-guide-workflow/)

[4. Преобразование моделей и редактирование ONNX](/ru/articles/rknn-v250-sdk-guide-conversion/)

[5. Квантование, гибридное квантование и QAT](/ru/articles/rknn-v250-sdk-guide-quantization/)

[6. Инференс, оценка точности, производительности и памяти](/ru/articles/rknn-v250-sdk-guide-evaluation/)

[7. Жизненный цикл Runtime, размещение данных и память](/ru/articles/rknn-v250-sdk-guide-runtime-basics/)

[8. Нулевое копирование и ограничения входов/выходов](/ru/articles/rknn-v250-sdk-guide-zero-copy/)

[9. Развёртывание через C API и генерация кода](/ru/articles/rknn-v250-sdk-guide-c-deployment/)

[10. Развёртывание Python через Toolkit Lite2](/ru/articles/rknn-v250-sdk-guide-lite-deployment/)

[11. Matmul API и размещение матриц](/ru/articles/rknn-v250-sdk-guide-matmul/)

[12. Многоядерная настройка NPU и производительность](/ru/articles/rknn-v250-sdk-guide-multicore/)

[13. Модели с динамической формой и развёртывание](/ru/articles/rknn-v250-sdk-guide-dynamic-shape/)

[14. Многопакетный инференс](/ru/articles/rknn-v250-sdk-guide-multi-batch/)

[15. SRAM NPU RK3588/RK3576](/ru/articles/rknn-v250-sdk-guide-sram/)

[16. Согласованность кэша и разреженный инференс](/ru/articles/rknn-v250-sdk-guide-cache-sparsity/)

[17. Пользовательские операторы: Python и C API](/ru/articles/rknn-v250-sdk-guide-custom-operators/)

[18. Развёртывание зашифрованных моделей](/ru/articles/rknn-v250-sdk-guide-encryption/)

[19. Диагностика точности](/ru/articles/rknn-v250-sdk-guide-accuracy/)

[20. Анализ производительности и оптимизация сети](/ru/articles/rknn-v250-sdk-guide-performance/)

[21. Анализ, совместное использование и повторное использование памяти](/ru/articles/rknn-v250-sdk-guide-memory/)

[22. Вопросы, обработка ошибок и справочные ресурсы](/ru/articles/rknn-v250-sdk-guide-faq/)

{% raw %}

## 1.2 Версии и среда разработки

RKNN-Toolkit2 предоставляется в двух версиях: для x86 и ARM64. Установка одинакова, за исключением того, что ARM64 пока не поддерживает Docker. Кроме того, ARM64 поддерживает преобразование только моделей onnx и pytorch; другие среды в настоящее время не поддерживаются.

Различия версий x86 и ARM64:

| Фреймворк глубокого обучения | x86 | ARM64 |
| --- | --- | --- |
| Caffe | ✔ | ✗ |
| TensorFlow | ✔ | ✗ |
| TF Lite | ✔ | ✗ |
| ONNX | ✔ | ✔ |
| DarkNet | ✔ | ✗ |
| PyTorch | ✔ | ✔ |

Различия инструментов:

| Необходимые инструменты | x86 | ARM64 |
| --- | --- | --- |
| adb | ✔ | ✗ |
| rknn_server | ✔ | ✗ |
| rknn runtime | ✔ | ✔ |

Различия при использовании x86 и ARM64:

Основное отличие касается отладочных функций, например анализа точности и инференса. Версия ARM64 устанавливается в ARM64 Linux; для этих функций достаточно, чтобы librknnrt.so находилась в '/usr/lib64'. Поскольку ARM64 не поддерживает adb, она работает только на текущей плате. Для x86 необходимо обновлять и использовать rknn_server, а также обеспечить доступность adb для отладочных функций и подключения к другой плате при необходимости.

Кроме того, производительность x86 и ARM64 может различаться при анализе точности и квантовании.

Примечание: подготовка среды разработки RK2118 описана в 01_RKNN2_RK2118_QuickStart_V2.5.0.

### 1.2.1 Установка RKNN-Toolkit2

В этой главе описаны два способа установки RKNN-Toolkit2: Docker и Pip. Выберите любой удобный способ.

#### 1.2.1.1 Установка через Docker

##### 1.2.1.1.1 Установка Docker

Если Docker уже установлен, этот шаг можно пропустить. В противном случае установите его по официальному руководству: https://docs.docker.com/install/linux/docker-ce/ubuntu/.

Примечание: обязательно добавьте пользователя в группу docker.

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

При правильном выполнении результат будет следующим:

```text
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
719385e32844: Pull complete
Digest: sha256:88ec0acaa3ec199d3b7eaf73588f4518c25f9d34f58ce9a0df68429c5af48e8d
Status: Downloaded newer image for hello-world:latest
Hello from Docker!
```

##### 1.2.1.1.2 Подготовка образа

В этом разделе описаны два способа подготовки образа RKNN-Toolkit2. Можно выбрать любой.

**1 Создание среды образа через Dockerfile**

Каталог docker/docker_file проекта RKNN-Toolkit2 содержит Dockerfile для сборки среды разработки RKNN-Toolkit2. Образ создаётся следующей командой Docker.

```text
# Note: xx and x.x.x below represent version numbers, please replace them with actual values
cd docker/docker_file/ubuntu_xx_xx_cpxx
docker build -f Dockerfile_ubuntu_xx_xx_for_cpxx -t rknn-toolkit2:x.x.x-cpxx .
```

**2. Загрузка образа Docker с заранее упакованной средой разработки**

Загрузите проект RKNN-Toolkit2 нужной версии. После распаковки образ Docker с полной средой разработки находится в docker/docker_image.

Ссылка на сетевое хранилище: https://console.zbox.filez.com/l/I00fc3. Код доступа: rknn.

Загрузите образ, соответствующий версии Python, следующей командой:

```text
# Note: x.x.x represents the version number of RKNN-Toolkit2, and cpxx represents the Python version number
docker load --input rknn-toolkit2-x.x.x-cpxx-docker.tar.gz
```

##### 1.2.1.1.3 Просмотр информации об образе

После создания или загрузки образа проверьте информацию об образе Docker:

```text
docker images
```

Отобразится информация об образе RKNN-Toolkit2:

```text
REPOSITORY TAG IMAGE ID CREATED SIZE
rknn-toolkit2 x.x.x-cpxx xxxxxxxxxxxx 1 hours ago 5.89GB
```

##### 1.2.1.1.4 Запуск образа

Запустите образ Docker следующей командой. Вы попадете в среду bash образа.

```text
docker run -t -i --privileged -v /dev/bus/usb:/dev/bus/usb rknn-toolkit2:x.x.x-cpxx /bin/bash
```

Каталог examples с кодом можно подключить в среду Docker, добавив параметр `-v &lt;host src folder&gt;: &lt;image dst folder&gt;`.

```text
docker run -t -i --privileged -v /dev/bus/usb:/dev/bus/usb -v /your/rknn-toolkit2-x.x.x/examples:/examples rknn-
toolkit2:x.x.x-cpxx /bin/bash
```

##### 1.2.1.1.5 Запуск демонстрационного примера

```text
cd examples/onnx/yolov5
python test.py
```

После успешного выполнения скрипта результат должен выглядеть следующим образом:

```text
class score xmin, ymin, xmax, ymax
--------------------------------------------------
person 0.884 [ 208, 244, 286, 506]
person 0.868 [ 478, 236, 559, 528]
person 0.825 [ 110, 238, 230, 534]
person 0.339 [ 79, 353, 122, 516]
bus 0.705 [ 92, 128, 554, 467]
```

#### 1.2.1.2 Установка через Pip

##### 1.2.1.2.1 Установка среды Python

Если среда Python уже установлена, этот шаг можно пропустить.

```text
sudo apt-get update
sudo apt-get install python3 python3-dev python3-pip
sudo apt-get install libxslt1-dev zlib1g zlib1g-dev libglib2.0-0 libsm6 libgl1-mesa-glx libprotobuf-dev gcc
```

Если требуется установить RKNN-Toolkit2 в локальную среду, а не виртуальную среду Conda, после установки Python перейдите к шагу 2.1.2.4.

##### 1.2.1.2.2 Установка Conda

Если в системе установлено несколько версий Python, рекомендуется управлять средой Python через Conda.

Проверьте наличие и версию Conda. Если она уже установлена, этот шаг можно пропустить.

```text
conda -V
# Prompt conda: command not found means conda is not installed.
# Successful installation will display the version such as: conda X.X.X
# X.X.X means version number, such as 23.9.0.
```

Загрузите установочный пакет Conda:

```text
wget -c https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-x86_64.sh
```

Установите Conda:

```text
chmod 777 Miniforge3-Linux-x86_64.sh
bash Miniforge3-Linux-x86_64.sh
```

Версия ARM64:

Загрузите установочный пакет Conda:

```text
wget -c https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-aarch64.sh
```

Установите Conda:

```text
chmod 777 Miniforge3-Linux-aarch64.sh
bash Miniforge3-Linux-aarch64.sh
```

##### 1.2.1.2.3 Создание среды Conda для RKNN-Toolkit2

Перейдите в базовую среду Conda:

```text
source ~/miniforge3/bin/activate # Miniforge install directory path
# (base) xxx@xxx-pc:~$
```

Создайте среду Conda с именем RKNN-Toolkit2 и Python 3.8 — рекомендуемой версией:

```text
conda create -n RKNN-Toolkit2 python=3.8
```

Активируйте среду Conda RKNN-Toolkit2:

```text
conda activate RKNN-Toolkit2
# (RKNN-Toolkit2) xxx@xxx-pc:~$
```

##### 1.2.1.2.4 Установка RKNN-Toolkit2

После активации среды Conda RKNN-Toolkit2 установите RKNN-Toolkit2 из источника pip либо из локального пакета wheel: Установка из источника pip

```text
pip install rknn-toolkit2 -i https://pypi.org/simple

# If RKNN-Toolkit2 is already installed, you can upgrade it with the following command:
pip install rknn-toolkit2 -i https://pypi.org/simple --upgrade
```

Установка из локального пакета wheel

```text
# Please choose the appropriate requirements file based on the Python version and processor architecture:
# where cpxx is the Python version
pip install -r /rknn-toolkit2/packages/x86_64/requirements_cpxx.txt
# pip install -r /rknn-toolkit2/packages/arm64/arm64_requirements_cpxx.txt

# Install RKNN-Toolkit2
# Please choose the appropriate wheel package file based on the Python version and processor architecture:
# where x.x.x is the RKNN-Toolkit2 version number, cpxx is the Python version
pip install /rknn-toolkit2/packages/x86_64/rknn_toolkit2-x.x.x-cpxx-cpxx-
manylinux_2_17_x86_64.manylinux2014_x86_64.whl
# pip install /rknn-toolkit2/packages/arm64/rknn_toolkit2-x.x.x-cpxx-cpxx-
manylinux_2_17_aarch64.manylinux2014_aarch64.whl
```

Если следующая команда выполняется без ошибок, установка завершена успешно.

```text
$ python
>>> from rknn.api import RKNN
```

### 1.2.2 Подготовка среды устройства NPU

#### 1.2.2.1 Проверка версии драйвера NPU

Команды проверки:

```text
dmesg | grep -i rknpu
# or
cat /sys/kernel/debug/rknpu/version
# or
cat /sys/kernel/debug/rknpu/driver_version
# or
cat /proc/debug/rknpu/driver_version
```

Результаты проверки:

```text
RKNPU driver: vX.X.X
```

X.X.X обозначает номер версии, например 0.9.2.

В прошивке Rockchip драйвер RKNPU установлен заранее. Если приведенные команды не определяют версию NPU, в сторонней прошивке может отсутствовать драйвер RKNPU. Включите параметр CONFIG_ROCKCHIP_RKNPU=y в конфигурации ядра, пересоберите драйвер ядра и прошейте его. Рекомендуется версия драйвера RKNPU &gt;= 0.9.2.

#### 1.2.2.2 Проверка среды подключения устройства NPU

Для отладки RKNN-Toolkit2 с подключенной платой нужен RKNN Server на устройстве. Это фоновая прокси-служба, которая получает команды и данные от компьютера через USB, выполняет соответствующие интерфейсы и возвращает результаты компьютеру. Поэтому необходимо убедиться, что RKNN Server на устройстве запущен.

Примечание: версии ARM64 для отладки не нужен RKNN Server. Если RKNN Toolkit2 используется на ARM64, пропустите этот шаг.

Проверьте, выполняется ли процесс RKNN Server на плате разработки.

```text
adb shell
ps | grep rknn_server
```

Результаты проверки:

```text
702 root 1192 S grep rknn_server
```

Если получен идентификатор процесса RKNN Server, служба запущена нормально. Если идентификатор не найден, запустите службу вручную следующей командой и повторите проверку.

Ручной запуск RKNN Server в Android:

```text
su
setenforce 0
nohup /vendor/bin/rknn_server >/dev/null&
```

Ручной запуск RKNN Server в Linux на RK356X/RK3576/RK3588/RV1126B:

```text
nohup /usr/bin/rknn_server >/dev/null&
```

Ручной запуск RKNN Server в Linux на RV1103/RV1103B/RV1106/RV1106B:

```text
nohup /oem/usr/bin/rknn_server >/dev/null&
```

Обычно прошивка Rockchip содержит RKNN Server, автоматически запускаемый при загрузке. Если автоматического запуска нет или отсутствуют файлы для ручного запуска, установите либо обновите RKNN Server вручную.

#### 1.2.2.3 Установка и обновление RKNN Server

Для отладки подключённой платы из RKNN-Toolkit2 на плате должны быть установлены среда RKNPU2 и запущен RKNN Server. Основные понятия среды RKNPU2:

1. RKNN Server: фоновый прокси-сервис на плате. Он получает данные ПК через USB, вызывает соответствующий интерфейс Runtime платы и возвращает результаты ПК.

2 Библиотека RKNPU2 Runtime

librknnrt.so: библиотека Runtime для плат RK3562 / RK3566 / RK3568 / RK3576 / RK3588 / RV1126B.

librknnmrt.so: библиотека Runtime для плат RV1103 / RV1103B / RV1106 / RV1106B.

Если RKNN Server не установлен, библиотека Runtime отсутствует или их версии не совпадают, переустановите либо обновите компоненты.

Примечание:

1. Для RKNN-модели с динамическими входными размерностями версии RKNN Server и RKNPU2 Runtime должны быть &gt;= 1.5.0.

2. Для модели размером более 2 GB требуется rknn_server &gt;= 2.0.0b0.

3. На платформах с малой памятью, включая RV1103 / RV1103B / RV1106 / RV1106B, рекомендуется rknn_server &gt;= 2.1.0.

4. Согласуйте версии RKNN Server, Runtime и RKNN-Toolkit2; источник рекомендует устанавливать последние версии всех компонентов.

5. RKNN Server на RK2118 не предназначен для отладки платы через RKNN-Toolkit2: он обслуживает взаимодействие DSP и MCU.

6. Версия ARM64 не зависит от RKNN Server, поэтому его не нужно запускать или обновлять. Однако отладка зависит от RKNPU2 Runtime платы: убедитесь, что библиотека установлена и обновлена до последней версии.

##### 1.2.2.3.1 Платформа RK356X/RK3576/RK3588/RV1126B

1 Система Android

Проверьте версии RKNN Server и librknnrt.so. Если номера различаются, обновите их до одинаковой версии.

```text
# Query the rknn_server version
strings /vendor/bin/rknn_server | grep -i "rknn_server version"
# Display the rknn_server version as X.X.X
# rknn_server version: X.X.X

# Query the librknnrt.so library version
# 64-bit system
strings /vendor/lib64/librknnrt.so | grep -i "librknnrt version"
# 32-bit system
strings /vendor/lib/librknnrt.so | grep -i "librknnrt version"
# Display the librknnrt library version as X.X.X
# librknnrt version: X.X.X
```

Обновите RKNN Server и librknnrt.so.

```text
adb root
adb remount

# 64-bit system:
adb push runtime/Android/rknn_server/arm64/rknn_server /vendor/bin/
adb push runtime/Android/librknn_api/arm64-v8a/librknnrt.so /vendor/lib64

# 32-bit system:
adb push runtime/Android/rknn_server/arm/rknn_server /vendor/bin/
adb push runtime/Android/librknn_api/armeabi-v7a/librknnrt.so /vendor/lib

# Restart the RKNN Server:
adb shell
su
chmod +x /vendor/bin/rknn_server
nohup /vendor/bin/rknn_server >/dev/null&
sync
reboot
```

2 Система Linux

Проверьте версии RKNN Server и librknnrt.so. При несовпадении обновите их до одной версии.

```text
# Query the rknn_server version
strings /usr/bin/rknn_server | grep -i "rknn_server version"
# Display the rknn_server version as X.X.X
# rknn_server version: X.X.X

# Query the librknnrt.so library version
strings /usr/lib/librknnrt.so | grep -i "librknnrt version"
# Display the librknnrt library version as X.X.X
# librknnrt version: X.X.X
```

Обновите RKNN Server и librknnrt.so.

-битная система:

```text
adb push runtime/Linux/rknn_server/aarch64/usr/bin/* /usr/bin
adb push runtime/Linux/librknn_api/aarch64/librknnrt.so /usr/lib64
```

-битная система:

```text
adb push runtime/Linux/rknn_server/armhf/usr/bin/* /usr/bin
adb push runtime/Linux/librknn_api/armhf/librknnrt.so /usr/lib
```

Перезапустите RKNN Server:

```text
adb shell
chmod +x /usr/bin/rknn_server
nohup /usr/bin/rknn_server >/dev/null&
restart_rknn.sh
```

##### 1.2.2.3.2 Платформа RV1103/RV1103B/RV1106/RV1106B

Проверьте версии RKNN Server и librknnmrt.so. При несовпадении обновите их до одной версии.

```text
# Query the rknn_server version
strings /oem/usr/bin/rknn_server | grep -i "rknn_server version"
# Display the rknn_server version as X.X.X
# rknn_server version: X.X.X

# Query the librknnmrt.so library version
strings /oem/usr/lib/librknnmrt.so | grep -i "librknnmrt version"
# Display the librknnmrt library version as X.X.X
# librknnmrt version: X.X.X
```

Обновите RKNN Server и librknnmrt.so. RV1103 / RV1103B и RV1106 / RV1106B используют один и тот же RKNN Server и librknnmrt.so.

```text
adb push runtime/Linux/rknn_server/armhf-uclibc/usr/bin/* /oem/usr/bin
adb push runtime/Linux/librknn_api/armhf-uclibc/librknnmrt.so /oem/usr/lib

# Restart the RKNN Server:
adb shell
chmod +x /oem/usr/bin/rknn_server
nohup /oem/usr/bin/rknn_server >/dev/null&
restart_rknn.sh
```

#### 1.2.2.4 Просмотр подробных журналов RKNN Server

##### 1.2.2.4.1 Система Android

Откройте терминал устройства и установите уровень журналирования:

```text
adb shell
su
setenforce 0
setprop persist.vendor.rknn.server.log.level 5
```

Завершите текущий процесс службы RKNN Server:

```text
kill -9 `pgrep rknn_server`
```

Если RKNN Server не перезапускается автоматически, запустите его вручную и просмотрите подробный журнал:

```text
nohup /vendor/bin/rknn_server >/dev/null&
logcat
```

##### 1.2.2.4.2 Система Linux

Откройте терминал устройства и установите уровень журналирования:

```text
adb shell
export RKNN_SERVER_LOGLEVEL=5
```

Перезапустите RKNN Server для просмотра подробных журналов:

На платформе RK356X / RK3576 / RK3588 / RV1126B выполните следующую команду:

```text
nohup /usr/bin/rknn_server >/dev/null&
```

На платформе RV1103 / RV1103B / RV1106 / RV1106B выполните следующие команды:

```text
nohup /oem/usr/bin/rknn_server >/dev/null&
```

### 1.2.3 Проверка среды

После настройки рекомендуется проверить готовность всех компонентов следующим образом:

**1. Проверка установки RKNN-Toolkit2**

```text
# Enter Python interactive mode and import the RKNN class
python
>>> from rknn.api import RKNN
# No error means the installation succeeded
```

**2. Проверка подключения устройства**

```text
# Query adb-connected devices on the PC
adb devices
# The connection is normal if device IDs are listed
```

Примечание: Toolkit2 ARM64 не поддерживает adb; отладка выполняется локально на плате, поэтому эта проверка не нужна.

**3. Проверка среды платы**

Проверьте версию драйвера NPU, состояние процесса RKNN Server и наличие Runtime. Методы проверки, установки и обновления описаны в 1.2.2 «Подготовка среды NPU на устройстве».

**4. Запрос версий компонентов**

При диагностике версии компонентов можно запросить следующим образом:

```text
# Query the RKNN-Toolkit2 version
pip list | grep rknn-toolkit2

# Query the on-board rknn_server version (paths subject to 1.2.2)
strings /usr/bin/rknn_server | grep -i "rknn_server version"

# Query the on-board Runtime library version (RK356X / RK3576 / RK3588 / RV1126B platforms, path subject to 1.2.2)
strings /usr/lib64/librknnrt.so | grep -i "librknnrt version"

# Query the on-board Runtime library version (RV1103 / RV1103B / RV1106 / RV1106B platforms)
strings /oem/usr/lib/librknnmrt.so | grep -i "librknnmrt version"
```

Примечание: файл RKNN сохраняет версию Toolkit2, использованную при преобразовании. При ошибках на плате сравните эту версию с версией Runtime платы.

{% endraw %}
