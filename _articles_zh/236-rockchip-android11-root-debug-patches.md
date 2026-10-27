---
title: "Rockchip Android 11 root 调试补丁原稿"
description: "Rockchip Android 11 root 调试补丁原稿 — V1.0.0"
excerpt: "Rockchip Android 11 root 调试补丁原稿"
translation_key: "236-rockchip-android11-root-debug-patches"
slug: "236-rockchip-android11-root-debug-patches"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: [ArmSoM, Rockchip, Android, Debugging, Security]
---

{% raw %}

# Rockchip Android 11 root 调试补丁原稿

完整整理 android11_root.pdf 的 3 页中文正文。文件无语言后缀，实际说明为中文；没有英文来源、原图或技术表格，也没有注明文档版本/发布日期。四个原步骤和五组补丁均为可编辑文本，路径单列。未修改源 PDF，未应用补丁、编译或测试硬件。

高风险调试资料：这些原稿改动会关闭 SELinux 强制策略、删除 su 调用身份限制、将 su 模式改为 06755、跳过 Zygote capability bounding set 裁剪，并注释内核 capability 参数/权限检查，从而显著削弱系统隔离。仅供拥有或明确授权的隔离 userdebug 实验设备研究，不用于量产、联网或处理真实敏感数据的设备；测试后恢复安全策略与原始镜像。文档保留原始补丁上下文与 PDF 折行，包括被截断的函数上下文和末尾片段，不是可直接应用或已经验证的补丁文件，不能据此声称获得完整可靠 root 方案。

<!-- source:cn p1 unit:0 -->

## 1. 需要编译 userdebug 版本

<!-- source:cn p1 unit:1 -->

## 2. 关闭 selinux

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

## 3. 修改 su.cpp，注释用户组权限检测

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

## 4. 给 su 文件默认授予 root 权限

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
