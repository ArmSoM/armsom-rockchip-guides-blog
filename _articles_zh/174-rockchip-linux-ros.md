---
title: "Rockchip Linux ROS：Buildroot编译、应用集成与运行"
description: "Rockchip Linux ROS：Buildroot编译、应用集成与运行 — V1.0.2"
excerpt: "Rockchip Linux ROS：Buildroot编译、应用集成与运行"
translation_key: "174-rockchip-linux-ros"
slug: "174-rockchip-linux-ros"
lang: "zh"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, ROS, Buildroot, Linux]
---

{% raw %}

# Rockchip Linux ROS：Buildroot编译、应用集成与运行

平台参考：依据中英V1.0.2原稿，介绍Rockchip Linux SDK的ROS使用；原稿范围为RK3XXX、内核4.4，示例RK3308。实际ArmSoM板卡需匹配SoC、SDK/BSP和内核；不是全部板卡支持承诺。原稿示例输出非ArmSoM实测。本篇原稿无技术配图，不虚构图片。

来源差异：英文第5页diff前多出 `@@ -46,6 +46,7 @@ source`，四语技术代码采用中文完整diff并保留此差异记录。编译段生成rootfs.squashfs，而烧写段中文写rootfs.img、英文写Rootfs.img；不擅自认定它们可直接互换，按实际SDK产物确认。Config.in帮助行原稿无缩进，作为原文示例保留，实际应用需检查Kconfig语法。未执行编译、烧写或运行命令。

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

## 1. 简述

Rockchip Linux SDK 集成了 ROS。ROS 提供一系列程序库和工具以帮助软件开发者创建机器人应用软件。Rockchip 所集成的 ROS 版本为 Indigo 和kinetic 两个版本。

## 2. 编译

在buildroot/configs/rockchip下面有ros_indigo.config 和 ros_kinetic.config 两个默认配置。在编译rootfs前,先将ros_xxx.config加入到rootfs对应的config中。以RK3308 Linux SDK为例。其他方法类似。修改buildroot/configs/rockchip_rk3308_release_defconfig:

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

然后运行 ./build.sh 。或者先source envsetup.sh选择对应rockchip_rk3308_release,然后再运行 make 。第一次编译需要几个小时的时间。编译完成后会生成 :buildroot/output/rockchip_rk3308_release/images/rootfs.squashfs。这就是 rootfs 的固件。

## 3. 添加新的ROS代码

提供一个ros_sample: https://github.com/DZain/ROS_Sample.git 。将该工程同步至external下, 并改名为beginner_tutorials。然后在buildroot中添加以下文件和修改:

1. vi buildroot/package/rockchip/ros/beginner_tutorials/Config.in 添加以下内容:

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

Config 中的select项,取决于工程中的依赖项。

2. vi buildroot/package/rockchip/ros/beginner_tutorials/beginner_tutorials.mk

```text
BEGINNER_TUTORIALS_VERSION = 1.0.0
BEGINNER_TUTORIALS_SITE_METHOD = local
BEGINNER_TUTORIALS_SITE = $(TOPDIR)/../external/beginner_tutorials

BEGINNER_TUTORIALS_DEPENDENCIES = roscpp rospy std-msgs genmsg

${eval ${catkin-package}}
```

3. 将beginner_tutorials 添加入buildroot:

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

4. 编译SDK根目录下运行source envsetup.sh, 选择rockchip_rk3308_release(已经跑过的,就不用再跑)。配置make menuconfig,使用/进入搜索,搜BEGINNER_TUTORIALS(步骤1中,定义在Config.in),并选中。保存配置。使用make编译。(或则直接使用make beginner_tutorials。重新编译使用make beginner_tutorials-dirclean && make beginner_tutorials)

## 4. 烧写

请参考 Rockchip Linux SDK 的发布文档查看如何烧写固件。这里不再赘述。只需将编译 ROS 生成的rootfs.img 烧到对应的 rootfs 分区即可。

## 5. 运行

运行 ROS 步骤如下:

1. 配置环境变量

```text
source /opt/ros/indigo/setup.sh
```

2. 运行 roscore

```text
roscore &
```

3. 运行代码以上述beginner_tutorials为例 :

```text
rosrun beginner_tutorials talker
```

运行结果:

```text
[ INFO] [1501923947.458788791]: hello world 0
[ INFO] [1501923947.558904332]: hello world 1
[ INFO] [1501923947.658774958]: hello world 2
[ INFO] [1501923947.758644458]: hello world 3
[ INFO] [1501923947.858779666]: hello world 4
[ INFO] [1501923947.958779291]: hello world 5
```

(beginner_tutorials代码为一对程序, talker发送, listener监听, 单独开talker, 计算会一直累加。单独开listener无现象, 同时开talker后, 两个程序计算同时累加打印)

{% endraw %}
