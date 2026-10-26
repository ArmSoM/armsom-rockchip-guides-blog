---
title: "Rockchip Linux ROS: сборка Buildroot, интеграция и запуск"
description: "Rockchip Linux ROS: сборка Buildroot, интеграция и запуск — V1.0.2"
excerpt: "Rockchip Linux ROS: сборка Buildroot, интеграция и запуск"
translation_key: "174-rockchip-linux-ros"
slug: "174-rockchip-linux-ros"
lang: "ru"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, ROS, Buildroot, Linux]
---

{% raw %}

# Rockchip Linux ROS: сборка Buildroot, интеграция и запуск

Платформенная справка по CN/EN V1.0.2 об использовании ROS в Rockchip Linux SDK. Исходная область: RK3XXX, ядро4.4, пример RK3308. Проверяйте SoC, SDK/BSP и ядро платы ArmSoM; поддержка всех плат не заявляется. Вывод — пример источника, не измерения ArmSoM. Технических рисунков в источнике нет.

Различия: diff английской страницы5 имеет лишний префикс `@@ -46,6 +46,7 @@ source`. Четыре языка используют полный китайский diff с фиксацией различия. Результат сборки rootfs.squashfs, раздел записи CN говорит rootfs.img, EN — Rootfs.img. Не считать взаимозаменяемыми, проверять SDK. Строки help Config.in без отступов сохранены по источнику; перед применением проверить Kconfig. Команды сборки, записи и запуска не выполнялись.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

## 1. Обзор

Rockchip Linux SDK интегрирует ROS — библиотеки и инструменты для разработки робототехнических приложений. Интегрированы версии Indigo и kinetic.

## 2. Сборка

В `buildroot/configs/rockchip` имеются конфигурации `ros_indigo.config` и `ros_kinetic.config`. Перед сборкой rootfs добавьте `ros_xxx.config` в соответствующую конфигурацию rootfs. Пример RK3308 Linux SDK; для остальных аналогично. Измените `buildroot/configs/rockchip_rk3308_release_defconfig`:

```text
diff --git a/configs/rockchip_rk3308_release_defconfig b/configs/rockchip_rk3308_release_defconfig
index f905f16..a2afac1 100644
--- a/configs/rockchip_rk3308_release_defconfig
+++ b/configs/rockchip_rk3308_release_defconfig
@@ -135,3 +135,4 @@ BR2_TARGET_ROOTFS_SQUASHFS=y
 # BR2_TARGET_ROOTFS_TAR is not set
 BR2_PACKAGE_HOST_MKE2IMG=y
 BR2_PACKAGE_HOST_VBOOT_UTILS=y
+#include "ros_indigo.config"
```

Затем выполните `./build.sh`. Либо сначала `source envsetup.sh`, выберите `rockchip_rk3308_release`, затем `make`. Первая сборка по источнику занимает несколько часов. Результат — прошивка rootfs `buildroot/output/rockchip_rk3308_release/images/rootfs.squashfs`.

## 3. Добавление нового кода ROS

Пример: https://github.com/DZain/ROS_Sample.git . Получите проект в `external`, переименуйте в `beginner_tutorials`. Затем добавьте и измените следующие файлы Buildroot:

1. `vi buildroot/package/rockchip/ros/beginner_tutorials/Config.in` — добавьте:

```text
config BR2_PACKAGE_BEGINNER_TUTORIALS
bool "beginner tutorials"
select BR2_PACKAGE_ROSCPP
select BR2_PACKAGE_ROSPY
select BR2_PACKAGE_STD_MSGS
select BR2_PACKAGE_GENMSG
help
beginner tutorials
```

Пункты `select` в Config определяются зависимостями проекта.

2. `vi buildroot/package/rockchip/ros/beginner_tutorials/beginner_tutorials.mk`

```text
BEGINNER_TUTORIALS_VERSION = 1.0.0
BEGINNER_TUTORIALS_SITE_METHOD = local
BEGINNER_TUTORIALS_SITE = $(TOPDIR)/../external/beginner_tutorials

BEGINNER_TUTORIALS_DEPENDENCIES = roscpp rospy std-msgs genmsg

${eval ${catkin-package}}
```

3. Добавьте `beginner_tutorials` в Buildroot:

```text
diff --git a/package/rockchip/ros/Config.in b/package/rockchip/ros/Config.in
index e26003aa9f..cb6f6c18e6 100644
--- a/package/rockchip/ros/Config.in
+++ b/package/rockchip/ros/Config.in
@@ -46,6 +46,7 @@ source "package/rockchip/ros/cmake_modules/Config.in"
 source "package/rockchip/ros/rospack/Config.in"
 source "package/rockchip/ros/orocos_kinematics_dynamics/Config.in"
 source "package/rockchip/ros/image-common/Config.in"
+source "package/rockchip/ros/beginner_tutorials/Config.in"
 source "package/rockchip/ros/bond-core/Config.in"
 source "package/rockchip/ros/nodelet-core/Config.in"
```

4. В корне SDK выполните `source envsetup.sh`, выберите `rockchip_rk3308_release` (если уже выполнено, повтор не нужен). Откройте `make menuconfig`, через `/` найдите `BEGINNER_TUTORIALS`, определённый на шаге 1 в Config.in, и включите его. Сохраните конфигурацию. Соберите через `make`. Можно непосредственно `make beginner_tutorials`; повторная сборка: `make beginner_tutorials-dirclean && make beginner_tutorials`.

## 4. Запись прошивки

Порядок записи см. в документации выпуска Rockchip Linux SDK; здесь он не повторяется. Запишите образ rootfs, полученный при сборке ROS, в соответствующий раздел rootfs (различия имён исходников указаны выше).

## 5. Запуск

Порядок запуска ROS:

1. Настройте переменные окружения.

```text
source /opt/ros/indigo/setup.sh
```

2. Запустите roscore.

```text
roscore &
```

3. Запустите код, например beginner_tutorials:

```text
rosrun beginner_tutorials talker
```

Результат из исходного документа:

```text
[ INFO] [1501923947.458788791]: hello world 0
[ INFO] [1501923947.558904332]: hello world 1
[ INFO] [1501923947.658774958]: hello world 2
[ INFO] [1501923947.758644458]: hello world 3
[ INFO] [1501923947.858779666]: hello world 4
[ INFO] [1501923947.958779291]: hello world 5
```

beginner_tutorials состоит из пары программ: talker отправляет, listener слушает. При отдельном запуске talker счётчик непрерывно увеличивается. Один listener ничего не показывает; после запуска talker обе программы одновременно выводят возрастающий счётчик.

{% endraw %}
