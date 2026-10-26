---
title: "Rockchip Linux ROS: Buildroot-Kompilierung, Integration und Ausführung"
description: "Rockchip Linux ROS: Buildroot-Kompilierung, Integration und Ausführung — V1.0.2"
excerpt: "Rockchip Linux ROS: Buildroot-Kompilierung, Integration und Ausführung"
translation_key: "174-rockchip-linux-ros"
slug: "174-rockchip-linux-ros"
lang: "de"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, ROS, Buildroot, Linux]
---

{% raw %}

# Rockchip Linux ROS: Buildroot-Kompilierung, Integration und Ausführung

Plattformreferenz nach CN/EN V1.0.2 zu ROS im Rockchip Linux SDK. Quellenbereich: RK3XXX, Kernel4.4, Beispiel RK3308. SoC, SDK/BSP und Kernel des ArmSoM-Boards prüfen; keine Zusage für alle Platinen. Ausgaben sind Quellenbeispiele, keine ArmSoM-Messungen. Die Quelle enthält keine technischen Abbildungen.

Unterschiede: Der englische Diff auf Seite5 enthält zusätzlich `@@ -46,6 +46,7 @@ source`. Alle vier Sprachen verwenden den vollständigen chinesischen Diff; Abweichung dokumentiert. Build-Ausgabe rootfs.squashfs, Schreibabschnitt CN rootfs.img, EN Rootfs.img. Austauschbarkeit nicht voraussetzen, SDK-Artefakt prüfen. Config.in-help-Zeilen sind im Original ohne Einrückung und bleiben Quellenbeispiel; Kconfig-Syntax vor Nutzung prüfen. Keine Build-, Schreib- oder Laufzeitbefehle ausgeführt.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

## 1. Überblick

Rockchip Linux SDK integriert ROS mit Bibliotheken und Werkzeugen zur Entwicklung von Roboteranwendungen. Integriert sind Indigo und kinetic.

## 2. Kompilierung

In `buildroot/configs/rockchip` liegen `ros_indigo.config` und `ros_kinetic.config`. Vor dem rootfs-Bau `ros_xxx.config` zur entsprechenden rootfs-Konfiguration hinzufügen. Beispiel RK3308 Linux SDK; andere Fälle sind ähnlich. `buildroot/configs/rockchip_rk3308_release_defconfig` ändern:

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

Danach `./build.sh` ausführen. Alternativ zuerst `source envsetup.sh`, `rockchip_rk3308_release` wählen und `make` ausführen. Der erste Bau dauert laut Quelle mehrere Stunden. Ergebnis ist die rootfs-Firmware `buildroot/output/rockchip_rk3308_release/images/rootfs.squashfs`.

## 3. Neuen ROS-Code hinzufügen

Beispiel: https://github.com/DZain/ROS_Sample.git . Projekt unter `external` ablegen und in `beginner_tutorials` umbenennen. Danach folgende Buildroot-Dateien hinzufügen bzw. ändern:

1. `vi buildroot/package/rockchip/ros/beginner_tutorials/Config.in` — Folgendes hinzufügen:

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

Die `select`-Einträge in Config hängen von den Projektabhängigkeiten ab.

2. `vi buildroot/package/rockchip/ros/beginner_tutorials/beginner_tutorials.mk`

```text
BEGINNER_TUTORIALS_VERSION = 1.0.0
BEGINNER_TUTORIALS_SITE_METHOD = local
BEGINNER_TUTORIALS_SITE = $(TOPDIR)/../external/beginner_tutorials

BEGINNER_TUTORIALS_DEPENDENCIES = roscpp rospy std-msgs genmsg

${eval ${catkin-package}}
```

3. `beginner_tutorials` zu Buildroot hinzufügen:

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

4. Im SDK-Hauptverzeichnis `source envsetup.sh` ausführen und `rockchip_rk3308_release` wählen; falls bereits erfolgt, nicht wiederholen. `make menuconfig` öffnen, mit `/` nach `BEGINNER_TUTORIALS` aus Schritt 1 (Config.in) suchen und aktivieren. Konfiguration speichern. Mit `make` bauen. Alternativ direkt `make beginner_tutorials`; Neubau: `make beginner_tutorials-dirclean && make beginner_tutorials`.

## 4. Firmware schreiben

Schreibverfahren siehe Release-Dokumentation des Rockchip Linux SDK; hier wird es nicht wiederholt. Das beim ROS-Bau erzeugte rootfs-Abbild in die passende rootfs-Partition schreiben (abweichende Quelldateinamen siehe oben).

## 5. Ausführen

ROS wie folgt ausführen:

1. Umgebungsvariablen konfigurieren.

```text
source /opt/ros/indigo/setup.sh
```

2. roscore starten.

```text
roscore &
```

3. Code ausführen, beispielsweise beginner_tutorials:

```text
rosrun beginner_tutorials talker
```

Ergebnis aus der Quelldokumentation:

```text
[ INFO] [1501923947.458788791]: hello world 0
[ INFO] [1501923947.558904332]: hello world 1
[ INFO] [1501923947.658774958]: hello world 2
[ INFO] [1501923947.758644458]: hello world 3
[ INFO] [1501923947.858779666]: hello world 4
[ INFO] [1501923947.958779291]: hello world 5
```

beginner_tutorials besteht aus zwei Programmen: talker sendet, listener empfängt. Allein gestarteter talker zählt fortlaufend hoch. listener allein zeigt nichts; sobald auch talker läuft, geben beide gleichzeitig den steigenden Zähler aus.

{% endraw %}
