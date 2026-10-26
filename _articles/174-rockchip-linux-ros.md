---
title: "Rockchip Linux ROS: Buildroot Compilation, Application Integration and Execution"
description: "Rockchip Linux ROS: Buildroot Compilation, Application Integration and Execution — V1.0.2"
excerpt: "Rockchip Linux ROS: Buildroot Compilation, Application Integration and Execution"
translation_key: "174-rockchip-linux-ros"
slug: "174-rockchip-linux-ros"
lang: "en"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, ROS, Buildroot, Linux]
---

{% raw %}

# Rockchip Linux ROS: Buildroot Compilation, Application Integration and Execution

Platform reference based on Chinese/English V1.0.2 sources describing ROS in Rockchip Linux SDK. Source scope: RK3XXX, kernel 4.4; RK3308 is the example. Verify the actual ArmSoM SoC, SDK/BSP and kernel; support for every board is not implied. Outputs are source examples, not ArmSoM measurements. The source has no technical figures; none are invented.

Source differences: the English page-5 diff has an extra `@@ -46,6 +46,7 @@ source` prefix. All four languages use the complete Chinese diff while recording the discrepancy. Build output is rootfs.squashfs; flashing text says rootfs.img in Chinese and Rootfs.img in English. Do not assume interchangeability; check the actual SDK artifact. Config.in help lines lack indentation in the source and are retained as source examples; check Kconfig syntax before use. No build, flash or runtime commands executed.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

## 1. Overview

Rockchip Linux SDK integrated ROS which provides a range of libraries and tools to help software developers create robotic applications. ROS version which Rockchip integrated are Indigo and kinetic.

## 2. Build

There are two default configurations of ros_indigo.config and ros_kinetic.config under buildroot/configs/rockchip directory. Before building rootfs, add ros_xxx.config to the config corresponding to rootfs. Take RK3308 Linux SDK as an example. Others are similar, modify buildroot/configs/rockchip_rk3308_release_defconfig:

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

And then run ./build.sh . Or first select the rockchip_rk3308_release corresponding to source envsetup.sh, then run make . The compilation for the first time will take a few hours. After the compilation is complete, buildroot/output/rockchip_rk3308_release/images/rootfs.squashfs which is the rootfs firmware will be generated.

## 3. Add the New ROS Code

There is a ros_sample provided: https://github.com/DZain/ROS_Sample.git Put the project to external, and rename to beginner_tutorials. Then add the following files and modifications in buildroot:

1. vi buildroot/package/rockchip/ros/beginner_tutorials/Config.in , add the following contents:

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

The select option in the Config depends on the dependencies in the project.

2. vi buildroot/package/rockchip/ros/beginner_tutorials/beginner_tutorials.mk

```text
BEGINNER_TUTORIALS_VERSION = 1.0.0
BEGINNER_TUTORIALS_SITE_METHOD = local
BEGINNER_TUTORIALS_SITE = $(TOPDIR)/../external/beginner_tutorials

BEGINNER_TUTORIALS_DEPENDENCIES = roscpp rospy std-msgs genmsg

${eval ${catkin-package}}
```

3. Add beginner_tutorials to buildroot:

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

4. Build Run the source envsetup.sh in the SDK root directory, select rockchip_rk3308_release (If you have already ran it, don't have to run again). Configure make menuconfig , use '/' opening search menu, search BEGINNER_TUTORIALS (in step 1, defined in Config.in), and select. Save the configuration. Build with make. (Or use make beginner_tutorials directly. Rebuild using make beginner_tutorials-dirclean && make beginner_tutorials )

## 4. Flashing

Please refer to the release documentations of Rockchip Linux SDK for instructions on how to flash firmware. It won't go into details here. Just download the Rootfs.img generated by ROS building to the corresponding rootfs partition.

## 5. Run

The steps to run ROS are as follows:

1. Configure environment variables

```text
source /opt/ros/indigo/setup.sh
```

2. Run roscore

```text
roscore &
```

3. Run the code Take the beginner_tutorials as an example:

```text
rosrun beginner_tutorials talker
```

Running result:

```text
[ INFO] [1501923947.458788791]: hello world 0
[ INFO] [1501923947.558904332]: hello world 1
[ INFO] [1501923947.658774958]: hello world 2
[ INFO] [1501923947.758644458]: hello world 3
[ INFO] [1501923947.858779666]: hello world 4
[ INFO] [1501923947.958779291]: hello world 5
```

(The beginner_tutorials code is a pair of programs, "talker" is used to send and "listener" is used to listen, open talker alone, number will accumulate continuously, and there is no phenomenon when opening listener alone, but when talker is opened at the same time, two programs number print simultaneously)

{% endraw %}
