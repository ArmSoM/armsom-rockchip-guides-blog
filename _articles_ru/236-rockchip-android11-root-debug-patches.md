---
title: "Исходные отладочные патчи root для Rockchip Android 11"
description: "Исходные отладочные патчи root для Rockchip Android 11 — V1.0.0"
excerpt: "Исходные отладочные патчи root для Rockchip Android 11"
translation_key: "236-rockchip-android11-root-debug-patches"
slug: "236-rockchip-android11-root-debug-patches"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: [ArmSoM, Rockchip, Android, Debugging, Security]
---

{% raw %}

# Исходные отладочные патчи root для Rockchip Android 11

Полный китайский текст трёх страниц android11_root.pdf. У имени нет языкового суффикса, но инструкции на китайском. Нет английского источника, оригинальных рисунков или технических таблиц; версия и дата публикации не указаны. Все четыре исходных шага и пять фрагментов патчей редактируемы; пути приведены отдельно. PDF не изменён; патчи, сборка и аппаратные тесты не выполнялись.

Материал повышенного риска для отладки: исходные изменения отключают SELinux enforcement, снимают ограничение личности вызывающего su, меняют режим su на 06755, обходят сокращение capability bounding set Zygote и комментируют проверки аргументов/прав capability в ядре, существенно ослабляя изоляцию. Только для принадлежащих вам или явно разрешённых изолированных лабораторных userdebug-устройств, не для серийных, сетевых или содержащих реальные чувствительные данные. После теста восстановите политику безопасности и исходный образ. Сохранены исходный контекст и переносы PDF, включая обрезанный контекст функции и завершающий фрагмент. Это не готовый проверенный патч и не доказательство полного надёжного решения root.

<!-- source:cn p1 unit:0 -->

## 1. Соберите версию userdebug

<!-- source:cn p1 unit:1 -->

## 2. Отключите selinux

<!-- source:cn p1 unit:2 -->

```text
device/rockchip/common
```

<!-- source:cn p1 unit:3 -->

```text
diff --git a/BoardConfig.mk b/BoardConfig.mk
index 3706d7b7..8099919f 100755
--- a/BoardConfig.mk
+++ b/BoardConfig.mk
@@ -59,7 +59,7 @@ BOARD_BOOT_HEADER_VERSION ?= 2
 BOARD_MKBOOTIMG_ARGS :=
 BOARD_PREBUILT_DTBOIMAGE ?= $(TARGET_DEVICE_DIR)/dtbo.img
 BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE ?= false
-BOARD_SELINUX_ENFORCING ?= true
+BOARD_SELINUX_ENFORCING ?= false
```

<!-- source:cn p1 unit:4 -->

## 3. Измените su.cpp: закомментируйте проверку прав пользователя/группы

<!-- source:cn p1 unit:5 -->

```text
system/extras/su/su.cpp
```

<!-- source:cn p1 unit:6 -->

```text
diff --git a/su/su.cpp b/su/su.cpp
index 1a1ab6bf..af3d2a68 100644
--- a/su/su.cpp
+++ b/su/su.cpp
@@ -80,8 +80,8 @@ void extract_uidgids(const char* uidgids, uid_t* uid, gid_t*
gid, gid_t* gids, i
 }
 int main(int argc, char** argv) {
-    uid_t current_uid = getuid();
-    if (current_uid != AID_ROOT && current_uid != AID_SHELL) error(1, 0, "not
allowed");
+    //uid_t current_uid = getuid();
+    //if (current_uid != AID_ROOT && current_uid != AID_SHELL) error(1, 0, "not
allowed");
     // Handle -h and --help.
     ++argv;
```

<!-- source:cn p1 unit:7 -->

## 4. По умолчанию предоставьте файлу su права root

<!-- source:cn p1 unit:8 -->

```text
system/core/libcutils/fs_config.cpp
```

<!-- source:cn p2 unit:9 -->

```text
diff --git a/libcutils/fs_config.cpp b/libcutils/fs_config.cpp
index 5805a4d19..92e93e76f 100644
--- a/libcutils/fs_config.cpp
+++ b/libcutils/fs_config.cpp
@@ -188,7 +188,7 @@ static const struct fs_path_config android_files[] = {
     // the following two files are INTENTIONALLY set-uid, but they
     // are NOT included on user builds.
     { 06755, AID_ROOT,      AID_ROOT,      0, "system/xbin/procmem" },
-    { 04750, AID_ROOT,      AID_SHELL,     0, "system/xbin/su" },
+    { 06755, AID_ROOT,      AID_SHELL,     0, "system/xbin/su" },
     // the following files have enhanced capabilities and ARE included
     // in user builds.
```

<!-- source:cn p2 unit:10 -->

```text
frameworks/base/core/jni/com_android_internal_os_Zygote.cpp
```

<!-- source:cn p2 unit:11 -->

```text
diff --git a/core/jni/com_android_internal_os_Zygote.cpp
b/core/jni/com_android_internal_os_Zygote.cpp
index 9eede83e21e5..694eec2a40ac 100644
--- a/core/jni/com_android_internal_os_Zygote.cpp
+++ b/core/jni/com_android_internal_os_Zygote.cpp
@@ -656,6 +656,7 @@ static void EnableKeepCapabilities(fail_fn_t fail_fn) {
 }
 static void DropCapabilitiesBoundingSet(fail_fn_t fail_fn) {
+/*
   for (int i = 0; prctl(PR_CAPBSET_READ, i, 0, 0, 0) >= 0; i++) {;
     if (prctl(PR_CAPBSET_DROP, i, 0, 0, 0) == -1) {
       if (errno == EINVAL) {
@@ -666,6 +667,7 @@ static void DropCapabilitiesBoundingSet(fail_fn_t fail_fn) {
       }
     }
   }
+  */
 }
```

<!-- source:cn p2 unit:12 -->

```text
kernel/security/commoncap.c
```

<!-- source:cn p2 unit:13 -->

```text
diff --git a/security/commoncap.c b/security/commoncap.c
index f86557a8e43f6..19124dd6239a1 100644
--- a/security/commoncap.c
+++ b/security/commoncap.c
@@ -1147,12 +1147,12 @@ int cap_task_setnice(struct task_struct *p, int nice)
 static int cap_prctl_drop(unsigned long cap)
 {
        struct cred *new;
-
+/*
        if (!ns_capable(current_user_ns(), CAP_SETPCAP))
                return -EPERM;
        if (!cap_valid(cap))
                return -EINVAL;
-
+*/
        new = prepare_creds();
if (!new)
        return -ENOMEM;
```

{% endraw %}
