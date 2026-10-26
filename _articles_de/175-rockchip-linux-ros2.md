---
title: "Rockchip Linux ROS2: Docker-Cross-Compiling, Buildroot-Integration und Fehlerbehebung"
description: "Rockchip Linux ROS2: Docker-Cross-Compiling, Buildroot-Integration und Fehlerbehebung — V1.1.1"
excerpt: "Rockchip Linux ROS2: Docker-Cross-Compiling, Buildroot-Integration und Fehlerbehebung"
translation_key: "175-rockchip-linux-ros2"
slug: "175-rockchip-linux-ros2"
lang: "de"
date: "2026-10-24"
category: "linux"
author: "ArmSoM Editorial · Rockchip source documentation"
products: []
tags: [ArmSoM, Rockchip, ROS2, Buildroot, Docker]
---

{% raw %}

Technisches Vorwort (Quellseite2): Einige RK Linux SDKs integrieren ROS1-Builds; ROS1 ist nicht Gegenstand dieses Dokuments, siehe buildroot/package/rockchip/ros und docs/. Für ROS2 liefert das SDK nur Abhängigkeiten, während Docker ROS2 kompiliert. Diese Entkopplung erleichtert Aktualisierung und Wartung. ROS2-Referenzen [1][2] bieten arm/aarch64-Cross-Compiling-Images wie Dockerfile_ubuntu_arm64_prebuilt[2], zielen aber nur auf Ubuntu18.04(bionic), das stark von RK-rootfs abweicht. Drei Schritte: RK Linux SDK mit python3, bullet, opencv, eigen und weiteren Abhängigkeiten bauen; in Docker ROS2 mit Ubuntu-Umgebung, SDK-Cross-Toolchain und Sysroot kompilieren; Docker verlassen und SDK-rootfs erneut packen. Die Quelle meldet erfolgreiche Builds von foxy, galactic, humble und iron. Geltungsbereich sind RK356x, RK3588 und andere arm64-Chips unabhängig von der Kernelversion; dies ist Quellenumfang, kein ArmSoM-Hardwaretest.

# Rockchip Linux ROS2: Docker-Cross-Compiling, Buildroot-Integration und Fehlerbehebung

Plattformreferenz: CN/EN V1.1.1, RK Linux SDK/Buildroot, Beispiele RK356x/RK3562. Versions- und Python-Zuordnung unten; 32-Bit-rootfs laut Quelle nicht geprüft/unterstützt. Für das ArmSoM-Board SDK, Toolchain und rootfs prüfen; keine Hardwarevalidierung. Build-Zeiten und Ausgaben sind Herstellerbeispiele. Beide PDFs enthalten keine technischen Bilder; Tabellen und Code sind editierbar.

Quellenzweifel bleiben erhalten: Beide docker-container-cp-Befehle kopieren ros2-sources.tar.gz, später wird jedoch ros2-build-scripts.tar.gz benötigt. build_ros2.sh/build-ros2.sh, pybind11_verdor und cross_compile.mimix/mimix gegenüber cross-compile.mixin sind inkonsistent. Keine validierten Skripte. Das Entfernen von _FORTIFY_SOURCE ist ein Quellenvorschlag zur Fehlersuche, kann Schutz schwächen und muss bewertet werden. Flash- und Swap-Vorgänge verändern das System; nicht ausgeführt. Quellautoren bleiben erhalten.

Erläuterung chinesischer Codekommentare: Dockerfiles erzeugen Images; die beiden Image-Archive sind vorgefertigt; linux-sdk-patches enthält eventuell fehlende SDK-Patches; MD5SUM prüft Archive; scripts enthält Build-Skripte/Patches, sources die Quellabhängigkeiten. Fehlendes LTTNG_TOOLS für iron ergänzen; newgrp wechselt zur Docker-Gruppe; zuerst Container-ID ermitteln; ./ (aktuelles Verzeichnis) nicht weglassen; erfolgreiche Builds zeigen die Beispielmeldung; TRY_RUN-Ergebnisse vom Board in Docker eintragen; rootfs packt das Image neu; strace zeigt die falsche Suche unter Toolchain-sysroot/$CMAKE_PREFIX_PATH.

[ArmSoM Docs](https://docs.armsom.org/) · [ROS2 Documentation](https://docs.ros.org/)

## 1. ROS2-Versionen

Das Rockchip Linux SDK basiert auf Buildroot; Toolchain und Pakete werden laufend aktualisiert. Daher können bei ROS2-Builds mit neueren SDKs kleinere Fehler auftreten. Das Verfahren fixiert möglichst die Versionen: ROS2-Quellen von GitHub herunterladen und jede Paketversion ausdrücklich festlegen. ROS2-Veröffentlichungen folgen:

| ROS2-Ausgabe | Version | Link |
| --- | --- | --- |
| foxy | ros2-release-foxy-20230620 | https://github.com/ros2/ros2/releases/tag/release-foxy-20230620 |
| galactic | ros2-release-galactic-20221209 | https://github.com/ros2/ros2/releases/tag/release-galactic-20221209 |
| humble | ros2-release-humble-20230724 | https://github.com/ros2/ros2/releases/tag/release-humble-20230724 |
| iron | ros2-release-iron-20230912 | https://github.com/ros2/ros2/releases/tag/release-iron-20230912 |

RK-Linux-SDK-Versionen mit laut Quelle erfolgreicher Kompilierung:

| Linux SDKBuildroot Version | Python-Version | Passendes Docker-Image | Hinweis |
| --- | --- | --- | --- |
| linux-5.10-stan-rkr1 | Python 3.10.5 | jammy-ros2-build | Patch ros2_dep.config hinzufügen |
| linux-4.19-gen-rkr3 | Python 3.8.6 | focal-ros2-build | lttng-Patches aktualisieren und aktivieren: lttng-tools(2.12.3), lttng-libust(2.12.3), liburcu(0.13.0) |

Hinweis: Python-Versionen im Docker-Host und in der Ziel-rootfs müssen übereinstimmen. 32-Bit-Systeme wurden nicht geprüft.

## 2. Dateien und Hinweise zum Docker-Build

Patches, Docker-Images und Quellen dieses Abschnitts stehen unter folgendem Link bereit:

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

Im Buildroot-Verzeichnis des RK Linux SDK prüfen, ob ros2_dep.config vorhanden ist.

```text
ls buildroot/configs/rockchip/ros2_dep.config
buildroot/configs/rockchip/ros2_dep.config

# 如该ros2_dep.config中缺少：LTTNG_TOOLS，⼿动加上（ROS2 iron有依赖）
tail -f buildroot/configs/rockchip/ros2_dep.config
# Required by ros2-iron tracetools; With LTTNG foxy/galactic/humble will build tracetools too.
BR2_PACKAGE_LTTNG_TOOLS=y
BR2_PACKAGE_LTTNG_LIBUST=y
```

Falls die Datei fehlt, die folgenden zwei Patches im Buildroot-Verzeichnis anwenden.

```text
0001-package-add-libasio.patch
0002-configs-rockchip-add-ros2-build-dependencies.patch
```

Die erforderlichen Versionen lttng-tools (2.12.3), lttng-libust (2.12.3) und liburcu (0.13.0) prüfen.

## 3. ROS2-Abhängigkeiten kompilieren

Im Buildroot-Projekt des RK Linux SDK legt ros2_dep.config die Build- und Laufzeitabhängigkeiten von ROS2 fest. Diese zur rootfs hinzufügen und kompilieren. Beispielsweise ros2_dep.config zu rockchip_rk356x_robot_defconfig hinzufügen:

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

Nach vollständigem rootfs-Build mit dem nächsten Schritt fortfahren.

## 4. Build-Umgebung auf einem Linux-PC (Ubuntu) vorbereiten

Docker auf dem Ubuntu-PC installieren:

```text
sudo apt install docker.io
sudo usermod -aG docker $USER
newgrp docker  # 登录到docker⽤⼾组
```

### 4.1 Docker-Image importieren

Zunächst die vom RK Linux SDK kompilierte Python-Version prüfen, beispielsweise:

```text
./buildroot/output/rockchip_rk3562_robot/host/bin/python --version
Python 3.10.5
```

Das zur Python-Version passende Docker-Image wählen:

| Python-Version | Passendes Docker-Image |
| --- | --- |
| Python 3.10.5 | jammy-ros2-build |
| Python 3.8.6 | focal-ros2-build |

jammy-ros2-build wählen, importieren und den Docker-Container betreten:

```text
gunzip jammy-ros2-build.tar.gz
docker image load -i jammy-ros2-build.tar
docker run -it --mount type=bind,source=/home/zsq/29/linux-sdk/buildroot/output/rockchip_rk3562_robot/,target=/buildroot jammy-ros2-build
```

source= durch den absoluten Pfad zum output-Verzeichnis des gebauten Linux SDK ersetzen. Im Container lautet der Standardbenutzer builder, das Standardpasswort rockchip.

### 4.2 Build-Skript und Quellarchiv kopieren

Benötigte Dateien mit docker container cp kopieren:

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

Im Container entpacken:

```text
builder@c519d9d668f9:/opt/ros$ ls /tmp/
ros2-build-scripts.tar.gz  ros2-sources.tar.gz

builder@c519d9d668f9:/opt/ros$ tar zxf /tmp/ros2-build-scripts.tar.gz -C /
builder@c519d9d668f9:/opt/ros$ tar zxf /tmp/ros2-sources.tar.gz -C /

builder@c519d9d668f9:/opt/ros$ ls
cross-compile  foxy  galactic  humble  iron
```

### 4.3 Python-Version in den Skripten ändern

/opt/ros/cross-compile/cross-compile.mixin und build_ros2.sh prüfen und die Python-Version an das RK Linux SDK anpassen: beispielsweise 310 durch 38 ersetzen; 310 bedeutet Python 3.10, andere Werte entsprechend.

3.10 durch 3.8 ersetzen.

### 4.4 (Optional) ROS2 mit Docker kompilieren

Zum Erstellen eines Docker-Images von Grund auf kann die von RK bereitgestellte rosdep.Dockerfile verwendet werden:

```text
docker build -t jammy-ros2-build -f rosdep.Dockerfile ./  # "./"不要少拷⻉了，表⽰当前⽬录
```

### 4.5 (Optional) Quellen herunterladen

Zum Herunterladen anderer Quellversionen nach dem Docker-Einstieg vcs-import verwenden:

```text
cd /opt/ros/foxy
mkdir src
vcs-import -w 10 --retry 10 --skip-existing --recursive src < ros2-release-foxy-20230620/ros2.repos
```

## 5. ROS2 kompilieren

Erneut prüfen, dass ros2_dep.config im RK Linux SDK enthalten und die rootfs vollständig gebaut ist. Das Docker-Image muss zur vom SDK gebauten Python-Version passen. ROS2-Version wählen und folgende Befehle nacheinander ausführen:

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

Build-Ergebnisse liegen in /buildroot/target/opt/ros, Zwischenprodukte in /buildroot/build/ros. Meldet build_ros2.sh keine Fehler, ist die Kompilierung erfolgreich. Einige Pakete lassen sich im Buildroot SDK nicht kompilieren bzw. ausführen: rviz benötigt X11/Desktop; dafür ein Ubuntu-arm-Image statt Buildroot verwenden. turtlesim benötigt eine grafische Oberfläche. Zum Ausschließen eines Pakets COLCON_IGNORE im entsprechenden src-Verzeichnis anlegen, beispielsweise: touch src/ros/ros_tutorials/turtlesim/COLCON_IGNORE.

### 5.1 TRY_RUN manuell ausführen und Ergebnis eintragen

TRY_RUN-Meldung für fastrtps:

```text
--- stderr: fastrtps
CMake Error: TRY_RUN() invoked in cross-compiling mode, please set the following
cache variables appropriately:
   SM_RUN_RESULT (advanced)
   SM_RUN_RESULT__TRYRUN_OUTPUT (advanced)
For details see /buildroot/build/ros/fastrtps/TryRunResults.cmake
```

Die Anwendung gemäß Anweisung auf das Board übertragen, ausführen und das Ergebnis eintragen. Beispiel:

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

TRY_RUN-Meldung für rosbag2_cpp:

```text
--- stderr: rosbag2_cpp
CMake Error: TRY_RUN() invoked in cross-compiling mode, please set the following
cache variables appropriately:
   HAVE_SANITIZERS_EXITCODE (advanced)
   HAVE_SANITIZERS_EXITCODE__TRYRUN_OUTPUT (advanced)
For details see /buildroot/build/ros/rosbag2_cpp/TryRunResults.cmake
```

Wie oben die Anwendung gemäß Anweisung auf dem Board ausführen und Ergebnisse eintragen. Beispiel:

```text
  set( HAVE_SANITIZERS_EXITCODE
       "127"
       CACHE STRING "error while loading shared libraries: liblsan.so.0: cannot open shared object file: No such file or directory" FORCE)

  set( HAVE_SANITIZERS_EXITCODE__TRYRUN_OUTPUT
       "127"
       CACHE STRING "error while loading shared libraries: liblsan.so.0: cannot open shared object file: No such file or directory" FORCE)
```

### 5.2 Einzelne ROS2-Pakete und Anwendungen kompilieren

Mit colcon build --packages-select <pacage_name> lässt sich ein Paket einzeln bauen; siehe colcon build --help.

## 6. rootfs packen und ROS2 ausführen

Nach dem vollständigen ROS2-Build zum Buildroot SDK wechseln und die rootfs erneut packen. ROS2 ist unter /opt/ros installiert.

```text
cd /data/linux-sdk/rk3562
./build.sh rootfs   # 重新打包rootfs.img
```

Nach dem Flashen von rootfs.img auf dem rk3562-Board die Hello-World-Demo ausführen:

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

## 7. Gelöste häufige Build-Fehler

### 7.1 Zu wenig Arbeitsspeicher auf dem Build-Rechner

Swap kann aktiviert werden, beispielsweise zram:

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

### 7.2 Board-Fehler: `GLIBCXX_3.4.30' not found

```text
root@rk3562-buildroot:/opt/ros-foxy# ros2 run demo_nodes_cpp talker
/opt/ros-foxy/lib/demo_nodes_cpp/talker: /lib/libstdc++.so.6: version
`GLIBCXX_3.4.30' not found (required by /opt/ros-foxy/lib/librclcpp.so)
/opt/ros-foxy/lib/demo_nodes_cpp/talker: /lib/libstdc++.so.6: version
`GLIBCXX_3.4.30' not found (required by /opt/ros-foxy/lib/libspdlog.so.1)
```

Es gibt zahlreiche RK-Linux-SDK-Versionen mit laufend aktualisierter Toolchain. ROS2 mit der Cross-Toolchain kompilieren, die auch die Linux-SDK-rootfs erzeugt hat.

### 7.3 x86_64-Bibliotheken im Build-Ergebnis

```text
ls /opt/ros/lib/python3.10/site-packages/rclpy/_rclpy_pybind11.cpython-310-x86_64-linux-gnu.so
```

pybind11 hat bekannte Probleme beim Cross-Compiling: Das gefundene Python ist ein HOST-Programm, daher werden auch die Parameter anhand des HOST erzeugt, beispielsweise:

```text
PYTHON_MODULE_EXTENSION:INTERNAL=.cpython-310-x86_64-linux-gnu.so
```

Neuere Versionen von pybind11/tools/FindPythonLibsNew.cmake empfehlen, Python-Parameter beim Cross-Compiling manuell von außen zu setzen. Darauf aufbauend:

1. pybind11 in src/ros2/pybind11_vendor auf v2.10.2 aktualisieren.

2. In pybind11_verdor/CMakeLists.txt folgende zwei Parameter setzen und PYTHON_MODULE_EXTENSION ausdrücklich festlegen:

```text
     list(APPEND extra_cmake_args "-DPYBIND11_PYTHONLIBS_OVERWRITE=OFF")
     list(APPEND extra_cmake_args "-DPYTHON_MODULE_EXTENSION=.cpython-310-aarch64-linux-gnu.so")
```

3. Auch in cross-compile.mixin deklarieren:

```text
- "-DPYBIND11_PYTHONLIBS_OVERWRITE=OFF"
- "-DPYTHON_MODULE_EXTENSION=.cpython-310-aarch64-linux-gnu.so"
```

Danach verweist PYTHON_MODULE_EXTENSION in der CMakeCache.txt von rclpy weiterhin auf x86_64; beim zweiten Build wird es jedoch auf das erwartete aarch64 geändert. Ursachen:

1. In pybind11/tools/pybind11NewTools.cmake wird PYTHON_MODULE_EXTENSION gelöscht, wenn PYBIND11_PYTHON_EXECUTABLE_LAST noch nicht gesetzt oder ihr Wert geändert wurde.

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

2. pybind11 issue #236 beschreibt ein ähnliches Verhalten.

3. Lösung: pybind11 so ändern, dass die Parameter bei PYBIND11_PYTHONLIBS_OVERWRITE = "OFF" nicht zurückgesetzt werden:

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

### 7.4 Fehlender limits-Header in google_benchmark

Beim foxy-Build tritt folgender Fehler auf:

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

Ursache ist der fehlende Header:

```text
/buildroot/build/ros/google_benchmark_vendor/benchmark-1.5.2-prefix/src/benchmark-1.5.2/src/benchmark_register.h

#include <limits>
```

In neueren ROS2-Versionen behoben; auch im Patch-Paket enthalten.

### 7.5 _FORTIFY_SOURCE in der Linux-SDK-Toolchain definiert

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

Der Fehler tritt nur bei -DCMAKE_TOOLCHAIN_FILE="/opt/aarch64-buildroot-linux-gnu_sdk-buildroot/share/buildroot/toolchainfile.cmake" auf, wenn diese CMake-Datei _FORTIFY_SOURCE definiert. CMAKE_TOOLCHAIN_FILE weglassen oder _FORTIFY_SOURCE entfernen.

### 7.6 CMake findet exlibConfig.cmake nicht

Beim Build von ament_cmake_vendor_package wird exlib nicht gefunden, obwohl die Bibliothek korrekt angegeben ist.

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

CMAKE_PREFIX_PATH enthält korrekt den exlib-Pfad. strace make zeigt aber einen falschen Suchpfad mit zusätzlichem Präfix /opt/aarch64-buildroot-linux-gnu_sdk-buildroot/aarch64-buildroot-linux-gnu/sysroot/. Ursache: colcon erhält --cmake-args -DCMAKE_TOOLCHAIN_FILE="/opt/aarch64-buildroot-linux-gnu_sdk-buildroot/share/buildroot/toolchainfile.cmake"; dies weicht von der Toolchain in exportierten Umgebungsvariablen und mimix ab.

### 7.7 pkg-config nicht gefunden

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

Docker muss pkgconf installieren, nicht pkg-config; cmake pkg_check_modules() benötigt es. Baut das Linux SDK ebenfalls pkgconf, entsteht host-pkgconf. Wegen abweichender Versionen wird bei der Suche nach pkgconf.so die von Buildroot gebaute Host-Bibliothek statt der Docker-Version gefunden; dadurch scheitert der Vorgang.

### 7.8 PKG_CONFIG_PATH setzen

Beim Build von src/ros2/ros2_tracing/tracetools/ steht in CMakeLists.txt:

```text
pkg_check_modules(LTTNG REQUIRED lttng-ust)
```

Build-Fehler:

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

strace -f zeigt, dass nicht in der sysroot des Linux SDK gesucht wird. export PKG_CONFIG_PATH=/buildroot/host/aarch64-buildroot-linux-gnu/sysroot/usr/lib/pkgconfig setzen. In einem anderen Fall findet pkg-config Docker-lttng statt der Zielversion und meldet:

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

Die gefundene Docker-lttng-Version unterscheidet sich von Buildroot. Ihre lttng-ust.pc verlangt lttng-ust-common, das in Buildroot fehlt. Ebenfalls export PKG_CONFIG_PATH=/buildroot/host/aarch64-buildroot-linux-gnu/sysroot/usr/lib/pkgconfig setzen. Das Build-Skript setzt dies bereits. lttng muss im Docker nicht installiert werden.

### 7.9 CMAKE_INCLUDE_PATH setzen

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

Den Pfad der beim Linux-SDK-Build erzeugten Header gesondert angeben, sonst findet CMake sie nicht:

```text
export CMAKE_INCLUDE_PATH='/buildroot/host/aarch64-buildroot-linux-gnu/sysroot/usr/include/'
```

Dieser Parameter ist bereits im Build-Skript gesetzt.

### 7.10 unsafe header/library used in cross-compilation

```text
--- stderr: action_msgs
aarch64-buildroot-linux-gnu-gcc: WARNING: unsafe header/library path used in
cross-compilation: '-isystem' '/usr/local/lib/python3.10/dist-packages/numpy/core/include'
```

Beim Cross-Compiling wird /usr/bin/python des Hosts verwendet. Wird numpy/numpyconfig.h nicht gefunden, liefert folgende Ermittlung von include dir nicht den korrekten Zielboard-Pfad:

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

Nachdem PythonExtra_INCLUDE_DIRS als Suchpfad erkannt wurde, zeigt dessen Definition in pybind11 auf PYTHON_INCLUDE_DIR. Beim Cross-Compiling kann der Wert in cross_compile.mimix vorbelegt werden. Das Build-Skript enthält den Parameter bereits; mehrere Verzeichnisse sind möglich.

## 8. Noch zu verbessern

### 8.1 Unnötige installierte Dateien entfernen

Beispielsweise CMake-Dateien, Header und statische Bibliotheken; diese können in sysroot installiert werden.

### 8.2 ROS2-Build für arm32-rootfs des Linux SDK noch nicht unterstützt

## 9. Referenzen

1. https://docs.ros.org/en/foxy/Guides/Cross-compilation.html

2. https://github.com/ros-tooling/cross_compile.git

3. https://docs.ros.org/en/foxy/Releases.html

{% endraw %}
