---
title: "Rockchip Android 11 Root Debug Patch Source"
description: "Rockchip Android 11 Root Debug Patch Source — V1.0.0"
excerpt: "Rockchip Android 11 Root Debug Patch Source"
translation_key: "236-rockchip-android11-root-debug-patches"
slug: "236-rockchip-android11-root-debug-patches"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: [ArmSoM, Rockchip, Android, Debugging, Security]
---

{% raw %}

# Rockchip Android 11 Root Debug Patch Source

Complete three-page Chinese body of android11_root.pdf. The filename has no language suffix, but its instructions are Chinese. No English source, original figures or technical tables exist, and no document version/publication date is stated. All four original steps and five patch excerpts are editable, with paths listed separately. The source PDF was not changed; no patch, build or hardware test was executed.

High-risk debugging material: these source changes disable SELinux enforcement, remove the su caller-identity restriction, change su mode to 06755, skip Zygote capability-bounding-set reduction, and comment out kernel capability argument/permission checks, substantially weakening system isolation. Study only on owned or explicitly authorized isolated userdebug lab devices, not production, networked or sensitive-data devices; restore security policy and the original image after testing. Original patch context and PDF wraps, including truncated function context and the final fragment, are retained. This is not a directly applicable or validated patch file, nor evidence of a complete reliable root solution.

<!-- source:cn p1 unit:0 -->

## 1. Build a userdebug version

<!-- source:cn p1 unit:1 -->

## 2. Disable selinux

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

## 3. Modify su.cpp to comment out the user/group permission check

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

## 4. Grant root permissions to the su file by default

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
