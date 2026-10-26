---
title: "Rockchip Linux ROS2: кросс-компиляция Docker, интеграция Buildroot и диагностика"
description: "Rockchip Linux ROS2: кросс-компиляция Docker, интеграция Buildroot и диагностика — V1.1.1"
excerpt: "Rockchip Linux ROS2: кросс-компиляция Docker, интеграция Buildroot и диагностика"
translation_key: "175-rockchip-linux-ros2"
slug: "175-rockchip-linux-ros2"
lang: "ru"
date: "2026-10-24"
category: "linux"
author: "ArmSoM Editorial · Rockchip source documentation"
products: []
tags: [ArmSoM, Rockchip, ROS2, Buildroot, Docker]
---

{% raw %}

Техническое предисловие (стр.2): Некоторые RK Linux SDK включают сборку ROS1; она вне области документа, см. buildroot/package/rockchip/ros и docs/. Для ROS2 SDK предоставляет только зависимости, а сборка выполняется в Docker, максимально отделяя ROS2 от SDK ради обновления и сопровождения. Ссылки ROS2 [1][2] предлагают Docker-образы кросс-компиляции arm/aarch64, например Dockerfile_ubuntu_arm64_prebuilt[2], но только для целевой Ubuntu18.04(bionic), существенно отличающейся от RK rootfs. Три шага: собрать RK Linux SDK с python3, bullet, opencv, eigen и другими зависимостями; в Docker собрать ROS2 средствами Ubuntu, кросс-инструментарием SDK и Sysroot; выйти и переупаковать rootfs SDK. Источник сообщает об успешной сборке foxy, galactic, humble и iron. Область — RK356x, RK3588 и другие arm64 независимо от ядра; это область источника, не аппаратные испытания ArmSoM.

# Rockchip Linux ROS2: кросс-компиляция Docker, интеграция Buildroot и диагностика

Платформенная справка: CN/EN V1.1.1, RK Linux SDK/Buildroot, примеры RK356x/RK3562. Совместимость версий и Python указана ниже; 32-битная rootfs не проверена/не поддержана источником. Для ArmSoM проверьте SDK, инструментарий и rootfs; аппаратных испытаний нет. Время сборки и вывод — примеры производителя. Технических рисунков в PDF нет; таблицы и код редактируемые.

Сомнения источника сохранены: обе команды docker container cp копируют ros2-sources.tar.gz, хотя далее требуется ros2-build-scripts.tar.gz. Имена build_ros2.sh/build-ros2.sh, pybind11_verdor и cross_compile.mimix/mimix против cross-compile.mixin расходятся. Это не проверенные сценарии. Удаление _FORTIFY_SOURCE — предложение источника, способное ослабить защиту; нужна оценка. Прошивка и swap меняют систему, команды не выполнялись. Авторство кода сохранено.

Пояснение китайских комментариев кода: Dockerfile создаёт образ; два архива образов уже подготовлены; linux-sdk-patches содержит возможные недостающие патчи SDK; MD5SUM проверяет архивы; scripts содержит сценарии/патчи, sources — исходники зависимостей. Добавьте недостающий LTTNG_TOOLS для iron; newgrp входит в группу Docker; сначала получите ID контейнера; не пропускайте ./ (текущий каталог); успешная сборка выводит пример сообщения; результаты TRY_RUN с платы вносятся в Docker; rootfs переупаковывает образ; strace показывает ошибочный поиск в sysroot/$CMAKE_PREFIX_PATH инструментария.

[ArmSoM Docs](https://docs.armsom.org/) · [ROS2 Documentation](https://docs.ros.org/)

## 1. Версии ROS2

Rockchip Linux SDK основан на Buildroot; инструментарий и пакеты постоянно обновляются. Поэтому сборка ROS2 с новым SDK может давать небольшие ошибки. В предлагаемом методе версии по возможности фиксируются: исходники ROS2 скачиваются с GitHub, версии каждого пакета задаются явно. Выпуски ROS2 приведены ниже.

| Выпуск ROS2 | Версия | Ссылка |
| --- | --- | --- |
| foxy | ros2-release-foxy-20230620 | https://github.com/ros2/ros2/releases/tag/release-foxy-20230620 |
| galactic | ros2-release-galactic-20221209 | https://github.com/ros2/ros2/releases/tag/release-galactic-20221209 |
| humble | ros2-release-humble-20230724 | https://github.com/ros2/ros2/releases/tag/release-humble-20230724 |
| iron | ros2-release-iron-20230912 | https://github.com/ros2/ros2/releases/tag/release-iron-20230912 |

Версии RK Linux SDK, для которых источник сообщает об успешной сборке:

| Linux SDKBuildroot Version | Версия Python | Подходящий образ Docker | Примечание |
| --- | --- | --- | --- |
| linux-5.10-stan-rkr1 | Python 3.10.5 | jammy-ros2-build | Добавить патч ros2_dep.config |
| linux-4.19-gen-rkr3 | Python 3.8.6 | focal-ros2-build | Обновить и включить патчи lttng: lttng-tools(2.12.3), lttng-libust(2.12.3), liburcu(0.13.0) |

Примечание: версии Python на Docker-хосте и в целевой rootfs должны совпадать. 32-битная система не проверена.

## 2. Файлы и пояснения для сборки в Docker

Патчи, образы Docker и исходники этого раздела можно скачать по следующей ссылке:

```text
https://console.zbox.filez.com/l/iJBMWZ
```

```text
tree
.
├── docker-focal-python38
│   └── rosdep.Dockerfile     # 制作Docker Image的Dockerfile
├── docker-jammy-python310
│   └── rosdep.Dockerfile     # 制作Docker Image的Dockerfile
├── focal-ros2-build.tar.gz   # 根据Dockerfile制作好的Docker Image
├── jammy-ros2-build.tar.gz   # 根据Dockerfile制作好的Docker Image
├── linux-sdk-patches
│   └── buildroot             # RK Linux SDK不同发布版本有可能会缺少的补丁
│       ├── 0001-package-add-libasio.patch
│       └── 0002-configs-rockchip-add-ros2-build-dependencies.patch
├── MD5SUM.txt                # 各压缩包的MD5SUM检验码
├── ros2-build-scripts.tar.gz # 编译脚本及补丁
└── ros2-sources.tar.gz       # ROS2及其部分依赖库的源码包
```

Проверьте наличие ros2_dep.config в каталоге Buildroot RK Linux SDK.

```text
ls buildroot/configs/rockchip/ros2_dep.config
buildroot/configs/rockchip/ros2_dep.config

# 如该ros2_dep.config中缺少：LTTNG_TOOLS，⼿动加上（ROS2 iron有依赖）
tail -f buildroot/configs/rockchip/ros2_dep.config
# Required by ros2-iron tracetools; With LTTNG foxy/galactic/humble will build tracetools too.
BR2_PACKAGE_LTTNG_TOOLS=y
BR2_PACKAGE_LTTNG_LIBUST=y
```

Если файла нет, примените следующие два патча в каталоге Buildroot.

```text
0001-package-add-libasio.patch
0002-configs-rockchip-add-ros2-build-dependencies.patch
```

Проверьте требуемые версии lttng-tools (2.12.3), lttng-libust (2.12.3) и liburcu (0.13.0).

## 3. Сборка зависимостей ROS2

В проекте Buildroot RK Linux SDK файл ros2_dep.config задаёт зависимости сборки и выполнения ROS2; их нужно включить в rootfs и собрать. Например, добавьте ros2_dep.config в rockchip_rk356x_robot_defconfig:

```text
git diff
--- a/configs/rockchip_rk356x_robot_defconfig
+++ b/configs/rockchip_rk356x_robot_defconfig
@@ -10,6 +10,7 @@
 #include "wifi.config"
 #include "debug.config"
 #include "bt.config"
+#include "ros2_dep.config"
 BR2_TARGET_GENERIC_HOSTNAME="rk356x_robot"
 BR2_TARGET_GENERIC_ISSUE="Welcome to RK356X Buildroot For Robot"
 BR2_ROOTFS_OVERLAY:="board/rockchip/common/robot/base board/rockchip/common/wifi"
```

После полной сборки rootfs переходите к следующему шагу.

## 4. Подготовка среды сборки на Linux (Ubuntu) PC

Установите Docker на Ubuntu PC:

```text
sudo apt install docker.io
sudo usermod -aG docker $USER
newgrp docker  # 登录到docker⽤⼾组
```

### 4.1 Импорт образа Docker

Сначала проверьте версию Python, собранную RK Linux SDK, например:

```text
./buildroot/output/rockchip_rk3562_robot/host/bin/python --version
Python 3.10.5
```

Выберите соответствующий образ Docker по версии Python:

| Версия Python | Подходящий образ Docker |
| --- | --- |
| Python 3.10.5 | jammy-ros2-build |
| Python 3.8.6 | focal-ros2-build |

Выберите jammy-ros2-build, импортируйте образ и войдите в контейнер:

```text
gunzip jammy-ros2-build.tar.gz
docker image load -i jammy-ros2-build.tar
docker run -it --mount type=bind,source=/home/zsq/29/linux-sdk/buildroot/output/rockchip_rk3562_robot/,target=/buildroot jammy-ros2-build
```

Замените source= абсолютным путём к каталогу output собранного Linux SDK. После входа в контейнер пользователь по умолчанию — builder, пароль по умолчанию — rockchip.

### 4.2 Копирование сценария сборки и архива исходников

Скопируйте необходимые файлы командой docker container cp:

```text
# ⾸先查找已登录的container ID
docker container ls
CONTAINER ID   IMAGE              COMMAND       CREATED          STATUS
PORTS     NAMES
c519d9d668f9   jammy-ros2-build   "/bin/bash"   15 minutes ago   Up 15 minutes
          pedantic_feynman

docker container cp ros2-sources.tar.gz c519d9d668f9:/tmp/
docker container cp ros2-sources.tar.gz c519d9d668f9:/tmp/
```

Распакуйте их в контейнере:

```text
builder@c519d9d668f9:/opt/ros$ ls /tmp/
ros2-build-scripts.tar.gz  ros2-sources.tar.gz

builder@c519d9d668f9:/opt/ros$ tar zxf /tmp/ros2-build-scripts.tar.gz -C /
builder@c519d9d668f9:/opt/ros$ tar zxf /tmp/ros2-sources.tar.gz -C /

builder@c519d9d668f9:/opt/ros$ ls
cross-compile  foxy  galactic  humble  iron
```

### 4.3 Изменение версии Python в сценариях

Проверьте /opt/ros/cross-compile/cross-compile.mixin и build_ros2.sh. Замените версию Python версией RK Linux SDK: например, 310 на 38; 310 означает Python 3.10 и далее аналогично.

Замените 3.10 на 3.8.

### 4.4 (Необязательно) Сборка ROS2 с Docker

Для создания образа Docker с нуля используйте предоставленный RK файл rosdep.Dockerfile:

```text
docker build -t jammy-ros2-build -f rosdep.Dockerfile ./  # "./"不要少拷⻉了，表⽰当前⽬录
```

### 4.5 (Необязательно) Загрузка исходников

Чтобы скачать исходники других версий, после входа в Docker используйте vcs-import:

```text
cd /opt/ros/foxy
mkdir src
vcs-import -w 10 --retry 10 --skip-existing --recursive src < ros2-release-foxy-20230620/ros2.repos
```

## 5. Сборка ROS2

Ещё раз убедитесь, что в RK Linux SDK включён ros2_dep.config и rootfs полностью собрана. Версия Python выбранного образа Docker должна соответствовать версии из RK Linux SDK. Выберите выпуск ROS2 и последовательно выполните следующие команды:

```text
ls /opt/ros
cross-compile  foxy  galactic  humble  iron
cd /opt/ros/iron
./prepare-source.sh
./build-ros2.sh
# 编译成功后，应有类似提⽰:
...
Summary: 317 packages finished [15min 37s]
...
build ros quit & cleanup
```

Результаты сборки находятся в /buildroot/target/opt/ros, промежуточные файлы — в /buildroot/build/ros. Если build_ros2.sh не сообщает ошибок, сборка успешна. Некоторые пакеты в Buildroot SDK не собираются или не выполняются: rviz требует X11/рабочий стол; для этой функции используйте образ Ubuntu arm вместо Buildroot. turtlesim требует графический интерфейс. Чтобы исключить пакет, создайте COLCON_IGNORE в соответствующем каталоге src, например: touch src/ros/ros_tutorials/turtlesim/COLCON_IGNORE.

### 5.1 TRY_RUN: выполнить вручную и записать результат

Сообщение TRY_RUN для fastrtps:

```text
--- stderr: fastrtps
CMake Error: TRY_RUN() invoked in cross-compiling mode, please set the following
cache variables appropriately:
   SM_RUN_RESULT (advanced)
   SM_RUN_RESULT__TRYRUN_OUTPUT (advanced)
For details see /buildroot/build/ros/fastrtps/TryRunResults.cmake
```

Согласно инструкции перенесите приложение на плату, выполните его и внесите результат. Например:

```text
root@rk3562-buildroot:/# /tmp/cmTC_4f573-SM_RUN_RESULT
PTHREAD_RWLOCK_PREFER_READER_NP

# 根据上述执⾏结果，在docker中填⼊结果：
cat /buildroot/build/ros/fastrtps/TryRunResults.cmake
....
set( SM_RUN_RESULT
     "0"
     CACHE STRING "PTHREAD_RWLOCK_PREFER_READER_NP" FORCE)

set( SM_RUN_RESULT__TRYRUN_OUTPUT
     "0"
     CACHE STRING "PTHREAD_RWLOCK_PREFER_READER_NP" FORCE)
```

Сообщение TRY_RUN для rosbag2_cpp:

```text
--- stderr: rosbag2_cpp
CMake Error: TRY_RUN() invoked in cross-compiling mode, please set the following
cache variables appropriately:
   HAVE_SANITIZERS_EXITCODE (advanced)
   HAVE_SANITIZERS_EXITCODE__TRYRUN_OUTPUT (advanced)
For details see /buildroot/build/ros/rosbag2_cpp/TryRunResults.cmake
```

Как выше: запустите приложение на плате по инструкции и внесите результаты. Например:

```text
  set( HAVE_SANITIZERS_EXITCODE
       "127"
       CACHE STRING "error while loading shared libraries: liblsan.so.0: cannot open shared object file: No such file or directory" FORCE)

  set( HAVE_SANITIZERS_EXITCODE__TRYRUN_OUTPUT
       "127"
       CACHE STRING "error while loading shared libraries: liblsan.so.0: cannot open shared object file: No such file or directory" FORCE)
```

### 5.2 Отдельная сборка пакета ROS2 и приложения

Параметр colcon build --packages-select <pacage_name> позволяет собрать пакет отдельно; см. colcon build --help.

## 6. Упаковка rootfs и запуск ROS2

После полной сборки ROS2 вернитесь в Buildroot SDK и заново упакуйте rootfs. ROS2 установлена в /opt/ros.

```text
cd /data/linux-sdk/rk3562
./build.sh rootfs   # 重新打包rootfs.img
```

После прошивки rootfs.img на плате rk3562 выполните Hello World Demo:

```text
# cd /opt/ros/
# export COLCON_CURRENT_PREFIX=/opt/ros
# export ROS_HOME=/userdata/
# source ./local_setup.sh
# ros2 pkg list
# ros2 pkg executables

# ros2 run demo_nodes_cpp listener &
# ros2 run demo_nodes_cpp talker
[INFO] [1501839280.834017748] [talker]: Publishing: 'Hello World: 1'
[INFO] [1501839280.839280957] [listener]: I heard: [Hello World: 1]
[INFO] [1501839281.831636015] [talker]: Publishing: 'Hello World: 2'
[INFO] [1501839281.835092640] [listener]: I heard: [Hello World: 2]
[INFO] [1501839282.831618532] [talker]: Publishing: 'Hello World: 3'
[INFO] [1501839282.835336782] [listener]: I heard: [Hello World: 3]

# ros2 run demo_nodes_py listener &
# ros2 run demo_nodes_py talker
```

## 7. Решённые типичные ошибки сборки

### 7.1 Недостаточно памяти на машине сборки

Можно включить swap, например zram:

```text
sudo -i su
# modprobe zram
# echo 12G > /sys/block/zram0/disksize
# echo 6G > /sys/block/zram0/mem_limit
# mkswap /dev/zram0
# swapon  /dev/zram0
# free -h
              total        used        free      shared  buff/cache   available
Mem:           14Gi       3.9Gi       5.5Gi        27Mi       5.4Gi        10Gi
Swap:          11Gi       2.7Gi       9.3Gi
```

### 7.2 Ошибка на плате: `GLIBCXX_3.4.30' not found

```text
root@rk3562-buildroot:/opt/ros-foxy# ros2 run demo_nodes_cpp talker
/opt/ros-foxy/lib/demo_nodes_cpp/talker: /lib/libstdc++.so.6: version
`GLIBCXX_3.4.30' not found (required by /opt/ros-foxy/lib/librclcpp.so)
/opt/ros-foxy/lib/demo_nodes_cpp/talker: /lib/libstdc++.so.6: version
`GLIBCXX_3.4.30' not found (required by /opt/ros-foxy/lib/libspdlog.so.1)
```

Существует много версий RK Linux SDK с обновляемым инструментарем. Для ROS2 необходимо использовать тот же кросс-компилятор Linux SDK, которым собрана rootfs.

### 7.3 В результате сборки появляются библиотеки x86_64

```text
ls /opt/ros/lib/python3.10/site-packages/rclpy/_rclpy_pybind11.cpython-310-x86_64-linux-gnu.so
```

У pybind11 есть известные проблемы при кросс-компиляции: найденный Python является исполняемым файлом HOST, поэтому параметры также формируются для HOST, например:

```text
PYTHON_MODULE_EXTENSION:INTERNAL=.cpython-310-x86_64-linux-gnu.so
```

В новых версиях pybind11/tools/FindPythonLibsNew.cmake рекомендуется при кросс-компиляции задавать параметры Python вручную извне. На этой основе:

1. Обновите pybind11 в src/ros2/pybind11_vendor до v2.10.2.

2. Задайте следующие два параметра в pybind11_verdor/CMakeLists.txt, явно указав PYTHON_MODULE_EXTENSION:

```text
     list(APPEND extra_cmake_args "-DPYBIND11_PYTHONLIBS_OVERWRITE=OFF")
     list(APPEND extra_cmake_args "-DPYTHON_MODULE_EXTENSION=.cpython-310-aarch64-linux-gnu.so")
```

3. Также объявите в cross-compile.mixin:

```text
- "-DPYBIND11_PYTHONLIBS_OVERWRITE=OFF"
- "-DPYTHON_MODULE_EXTENSION=.cpython-310-aarch64-linux-gnu.so"
```

После этих изменений PYTHON_MODULE_EXTENSION в CMakeCache.txt сборки rclpy всё ещё указывает на x86_64, но при второй сборке меняется на ожидаемый aarch64. Причины:

1. В pybind11/tools/pybind11NewTools.cmake переменная PYTHON_MODULE_EXTENSION очищается, если PYBIND11_PYTHON_EXECUTABLE_LAST ещё не задана либо её значение изменилось.

```text
    76 if(NOT ${_Python}_EXECUTABLE STREQUAL PYBIND11_PYTHON_EXECUTABLE_LAST)
    77   # Detect changes to the Python version/binary in subsequent CMake runs, and refresh config if needed
    78   unset(PYTHON_IS_DEBUG CACHE)
    79   unset(PYTHON_MODULE_EXTENSION CACHE)
    80   set(PYBIND11_PYTHON_EXECUTABLE_LAST
    81       "${${_Python}_EXECUTABLE}"
    82       CACHE INTERNAL "Python executable during the last CMake run")
    83 endif()
```

2. Аналогичное явление описано в pybind11 issue #236.

3. Решение: измените pybind11 так, чтобы при PYBIND11_PYTHONLIBS_OVERWRITE = "OFF" эти параметры не переустанавливались:

```text
   commit f7f1f2a927dd785d109833e411325de4c248719f (HEAD -> v2.10.2-fix)
   Author: cross-build for rk-linux-sdk <cross-build@rk-linux-sdk.com>
   Date:   Fri Sep 22 08:24:58 2023 +0000

       Do not override the PYTHON_MODULE_EXTENSION if cross building

       As suggested in tools/FindPythonLibsNew.cmake,
PYBIND11_PYTHONLIBS_OVERWRITE is a flag to indicate that we set python variables
manually when cross building.

       In this case, do not override variables if PYBIND11_PYTHON_EXECUTABLE_LAST
changed or is empty.

   diff --git a/tools/pybind11NewTools.cmake b/tools/pybind11NewTools.cmake
   index 7d7424a7..91980dad 100644
   --- a/tools/pybind11NewTools.cmake
   +++ b/tools/pybind11NewTools.cmake
   @@ -73,7 +73,7 @@ if(NOT DEFINED ${_Python}_EXECUTABLE)

    endif()

   -if(NOT ${_Python}_EXECUTABLE STREQUAL PYBIND11_PYTHON_EXECUTABLE_LAST)
   +if(NOT ${_Python}_EXECUTABLE STREQUAL PYBIND11_PYTHON_EXECUTABLE_LAST AND NOT PYBIND11_PYTHONLIBS_OVERWRITE STREQUAL "OFF")
      # Detect changes to the Python version/binary in subsequent CMake runs, and refresh config if needed
      unset(PYTHON_IS_DEBUG CACHE)
      unset(PYTHON_MODULE_EXTENSION CACHE)
```

### 7.4 В google_benchmark отсутствует заголовок limits

При сборке foxy возникает следующая ошибка:

```text
In file included from /buildroot/build/ros/google_benchmark_vendor/benchmark-1.5.2-prefix/src/benchmark-1.5.2/src/benchmark_register.cc:15:
/buildroot/build/ros/google_benchmark_vendor/benchmark-1.5.2-prefix/src/benchmark-1.5.2/src/benchmark_register.h: In function ‘typename
std::vector<T>::iterator benchmark::internal::AddPowers(std::vector<T>*, T, T,
int)’:
/buildroot/build/ros/google_benchmark_vendor/benchmark-1.5.2-prefix/src/benchmark-1.5.2/src/benchmark_register.h:22:30: error:
‘numeric_limits’ is not a member of ‘std’
   22 |   static const T kmax = std::numeric_limits<T>::max();
      |                              ^~~~~~~~~~~~~~
```

Причина — отсутствующий заголовок:

```text
/buildroot/build/ros/google_benchmark_vendor/benchmark-1.5.2-prefix/src/benchmark-1.5.2/src/benchmark_register.h

#include <limits>
```

Исправлено в новых версиях ROS2; изменение включено и в комплект патчей.

### 7.5 _FORTIFY_SOURCE определён в инструментарии Linux SDK

```text
--- stderr: mimick_vendor
Cloning into 'mimick-f171450b5ebaa3d2538c762a059dfc6ab7a01039'...
fatal: unable to access 'https://github.com/ros2/Mimick.git/': gnutls_handshake()
failed: Error in the pull function.
Cloning into 'mimick-f171450b5ebaa3d2538c762a059dfc6ab7a01039'...
HEAD is now at f171450 Add armv7l as a 32-bit ARM architecture. (#16)
In file included from /opt/aarch64-buildroot-linux-gnu_sdk-buildroot/aarch64-buildroot-linux-gnu/sysroot/usr/include/errno.h:25,
                 from /buildroot/build/ros/mimick_vendor/mimick-f171450b5ebaa3d2538c762a059dfc6ab7a01039-prefix/src/mimick-f171450b5ebaa3d2538c762a059dfc6ab7a01039/include/mimick/mock.h:27,
                 from /buildroot/build/ros/mimick_vendor/mimick-f171450b5ebaa3d2538c762a059dfc6ab7a01039-prefix/src/mimick-f171450b5ebaa3d2538c762a059dfc6ab7a01039/include/mimick/mimick.h:401,
                 from /buildroot/build/ros/mimick_vendor/mimick-f171450b5ebaa3d2538c762a059dfc6ab7a01039-prefix/src/mimick-f171450b5ebaa3d2538c762a059dfc6ab7a01039/sample/strdup/test.c:1:
/opt/aarch64-buildroot-linux-gnu_sdk-buildroot/aarch64-buildroot-linux-gnu/sysroot/usr/include/features.h:412:4: error: #warning _FORTIFY_SOURCE
requires compiling with optimization (-O) [-Werror=cpp]
  412 | #  warning _FORTIFY_SOURCE requires compiling with optimization (-O)
      |    ^~~~~~~
cc1: all warnings being treated as errors
make[5]: *** [sample/strdup/CMakeFiles/strdup_test.dir/build.make:63:
sample/strdup/CMakeFiles/strdup_test.dir/test.c.o] Error 1
make[4]: *** [CMakeFiles/Makefile2:302:
sample/strdup/CMakeFiles/strdup_test.dir/all] Error 2
make[4]: *** Waiting for unfinished jobs....
In file included from /opt/aarch64-buildroot-linux-gnu_sdk-buildroot/aarch64-buildroot-linux-gnu/sysroot/usr/include/errno.h:25,
                 from /buildroot/build/ros/mimick_vendor/mimick-f171450b5ebaa3d2538c762a059dfc6ab7a01039-prefix/src/mimick-f171450b5ebaa3d2538c762a059dfc6ab7a01039/include/mimick/mock.h:27,
                 from /buildroot/build/ros/mimick_vendor/mimick-f171450b5ebaa3d2538c762a059dfc6ab7a01039-prefix/src/mimick-f171450b5ebaa3d2538c762a059dfc6ab7a01039/include/mimick/mimick.h:401,
                 from /buildroot/build/ros/mimick_vendor/mimick-f171450b5ebaa3d2538c762a059dfc6ab7a01039-prefix/src/mimick-f171450b5ebaa3d2538c762a059dfc6ab7a01039/test/test.c:1:
/opt/aarch64-buildroot-linux-gnu_sdk-buildroot/aarch64-buildroot-linux-gnu/sysroot/usr/include/features.h:412:4: error: #warning _FORTIFY_SOURCE
requires compiling with optimization (-O) [-Werror=cpp]
  412 | #  warning _FORTIFY_SOURCE requires compiling with optimization (-O)
      |    ^~~~~~~
cc1: all warnings being treated as errors
```

Ошибка возникает только при заданном -DCMAKE_TOOLCHAIN_FILE="/opt/aarch64-buildroot-linux-gnu_sdk-buildroot/share/buildroot/toolchainfile.cmake", если этот CMake-файл определяет _FORTIFY_SOURCE. Можно не задавать CMAKE_TOOLCHAIN_FILE либо удалить _FORTIFY_SOURCE.

### 7.6 CMake не находит exlibConfig.cmake

Сборка ament_cmake_vendor_package сообщает, что exlib не найдена, хотя библиотека задана правильно.

```text
root@db4be0cd3eca:/buildroot/build/ros/ament_cmake_vendor_package/test# make
[ 33%] Built target exlib_bad
[ 66%] Built target exlib_good
[ 71%] Performing configure step for 'depender'
loading initial cache file
/buildroot/build/ros/ament_cmake_vendor_package/test/depender-config.cmake
CMake Error at CMakeLists.txt:4 (find_package):
  By not providing "Findexlib.cmake" in CMAKE_MODULE_PATH this project has
  asked CMake to find a package configuration file provided by "exlib", but
  CMake did not find one.

  Could not find a package configuration file provided by "exlib" with any of
  the following names:

    exlibConfig.cmake
    exlib-config.cmake

  Add the installation prefix of "exlib" to CMAKE_PREFIX_PATH or set
  "exlib_DIR" to a directory containing one of the above files.  If "exlib"
  provides a separate development package or SDK, be sure it has been
  installed.

# strace make  可以看到：
[pid 458018] newfstatat(AT_FDCWD, "/opt/aarch64-buildroot-linux-gnu_sdk-buildroot/aarch64-buildroot-linux-gnu/sysroot/buildroot/build/ros/ament_cmake_vendor_package/test/exlib_bad-prefix/install", 0x7ffca495cf50, 0) = -1 ENOENT (No such file or directory)

# ：
# grep CMAKE_PREFIX_PATH depender-config.cmake
set(CMAKE_PREFIX_PATH [=[/buildroot/build/ros/ament_cmake_vendor_package/test/exlib_bad-prefix/install;/buildroot/build/ros/ament_cmake_vendor_package/test/exlib_good-prefix/install;/buildroot/build/ros/ament_cmake_vendor_package/test/depender-prefix/install]=] CACHE INTERNAL "")

它去找了Toolchain⽬录下的sysroot/$CMAKE_PREFIX_PATH，所以找不到。
```

CMAKE_PREFIX_PATH правильно содержит путь exlib. strace make показывает неверный фактический путь поиска с лишним префиксом /opt/aarch64-buildroot-linux-gnu_sdk-buildroot/aarch64-buildroot-linux-gnu/sysroot/. Причина: colcon получает --cmake-args -DCMAKE_TOOLCHAIN_FILE="/opt/aarch64-buildroot-linux-gnu_sdk-buildroot/share/buildroot/toolchainfile.cmake", что отличается от toolchain, заданной экспортированными переменными окружения и mimix.

### 7.7 pkg-config не найден

```text
Starting >>> tracetools
--- stderr: tracetools
CMake Error at /usr/share/cmake-3.22/Modules/FindPackageHandleStandardArgs.cmake:230(message):
  Could NOT find PkgConfig (missing: PKG_CONFIG_EXECUTABLE)
      Reason given by package: The command
      "/usr/bin/pkg-config" --version
      failed with output:
      stderr:
        /usr/bin/pkg-config: symbol lookup error: /usr/bin/pkg-config: undefined
symbol: pkgconf_cross_personality_deinit
      result:
  127
Call Stack (most recent call first):
  /usr/share/cmake-3.22/Modules/FindPackageHandleStandardArgs.cmake:594
(_FPHSA_FAILURE_MESSAGE)
  /usr/share/cmake-3.22/Modules/FindPkgConfig.cmake:99
(find_package_handle_standard_args)
  CMakeLists.txt:35 (find_package)
```

В Docker должен быть установлен pkgconf, не pkg-config: он нужен cmake pkg_check_modules(). Если Linux SDK также собирает pkgconf, создаётся host-pkgconf. Из-за отличия версий при поиске pkgconf.so находится библиотека host-pkgconf из Buildroot вместо Docker, и выполнение завершается ошибкой.

### 7.8 Нужно задать PKG_CONFIG_PATH

При сборке src/ros2/ros2_tracing/tracetools/ в CMakeLists.txt задано:

```text
pkg_check_modules(LTTNG REQUIRED lttng-ust)
```

Ошибка сборки:

```text
Starting >>> tracetools
--- stderr: tracetools
CMake Error at /usr/share/cmake-3.22/Modules/FindPkgConfig.cmake:611 (message):
  A required package was not found
Call Stack (most recent call first):
  /usr/share/cmake-3.22/Modules/FindPkgConfig.cmake:833
(_pkg_check_modules_internal)
  CMakeLists.txt:36 (pkg_check_modules)
```

strace -f показывает, что поиск не выполняется в sysroot Linux SDK. Задайте export PKG_CONFIG_PATH=/buildroot/host/aarch64-buildroot-linux-gnu/sysroot/usr/lib/pkgconfig. Другой случай: pkg-config находит lttng из Docker вместо целевой версии и выдаёт:

```text
Starting >>> tracetools
--- stderr: tracetools
/usr/lib/gcc-cross/aarch64-linux-gnu/11/../../../../aarch64-linux-gnu/bin/ld:
cannot find -llttng-ust-common: No such file or directory
collect2: error: ld returned 1 exit status
gmake[2]: *** [CMakeFiles/tracetools.dir/build.make:129: libtracetools.so] Error
1
gmake[1]: *** [CMakeFiles/Makefile2:161: CMakeFiles/tracetools.dir/all] Error 2
gmake[1]: *** Waiting for unfinished jobs....
gmake: *** [Makefile:146: all] Error 2
---
Failed   <<< tracetools [4.72s, exited with code 2]
```

Найдена версия lttng из Docker, отличная от Buildroot. Её lttng-ust.pc требует lttng-ust-common, но в Buildroot этой библиотеки нет. Также задайте export PKG_CONFIG_PATH=/buildroot/host/aarch64-buildroot-linux-gnu/sysroot/usr/lib/pkgconfig. Параметр уже задан в сценарии сборки. Пакет lttng можно не устанавливать в Docker.

### 7.9 Нужно задать CMAKE_INCLUDE_PATH

```text
Starting >>> orocos_kdl_vendor
--- stderr: orocos_kdl_vendor
Cloning into 'orocos_kdl-507de66'...
done.
HEAD is now at 507de66 Fix CMake warning on Windows (#392)
Submodule 'python_orocos_kdl/pybind11' (https://github.com/pybind/pybind11.git)
registered for path 'python_orocos_kdl/pybind11'
Cloning into '/buildroot/build/ros/orocos_kdl_vendor/orocos_kdl-507de66-prefix/src/orocos_kdl-507de66/python_orocos_kdl/pybind11'...
CMake Error: The following variables are used in this project, but they are set
to NOTFOUND.
Please set them or make sure they are set and tested correctly in the CMake
files:
EIGEN3_INCLUDE_DIR (ADVANCED)
```

Путь заголовков, созданных сборкой Linux SDK, нужно задать отдельно, иначе CMake их не найдёт:

```text
export CMAKE_INCLUDE_PATH='/buildroot/host/aarch64-buildroot-linux-gnu/sysroot/usr/include/'
```

Этот параметр уже задан в сценарии сборки.

### 7.10 unsafe header/library used in cross-compilation

```text
--- stderr: action_msgs
aarch64-buildroot-linux-gnu-gcc: WARNING: unsafe header/library path used in
cross-compilation: '-isystem' '/usr/local/lib/python3.10/dist-packages/numpy/core/include'
```

При кросс-компиляции используется /usr/bin/python хоста. Когда numpy/numpyconfig.h не найден, следующий способ получения include dir не даёт правильный путь целевой платы:

```text
# Check if numpy is in the include path
find_file(_numpy_h numpy/numpyconfig.h
  PATHS ${PythonExtra_INCLUDE_DIRS}
)

if(APPLE OR WIN32 OR NOT _numpy_h)
  # add include directory for numpy headers
  set(_python_code
    "import numpy"
    "print(numpy.get_include())"
  )
```

После выяснения, что путь задаётся PythonExtra_INCLUDE_DIRS, найдите его определение в pybind11: оно происходит из PYTHON_INCLUDE_DIR. При кросс-компиляции значение можно заранее задать в cross_compile.mimix. Параметр уже предусмотрен сценарием сборки; допускается несколько каталогов.

## 8. Что ещё предстоит улучшить

### 8.1 Удаление ненужных установленных файлов

Например CMake-файлы, заголовки и статические библиотеки: их можно устанавливать в sysroot.

### 8.2 ROS2 ещё не поддерживает сборку для arm32 rootfs Linux SDK

## 9. Ссылки

1. https://docs.ros.org/en/foxy/Guides/Cross-compilation.html

2. https://github.com/ros-tooling/cross_compile.git

3. https://docs.ros.org/en/foxy/Releases.html

{% endraw %}
