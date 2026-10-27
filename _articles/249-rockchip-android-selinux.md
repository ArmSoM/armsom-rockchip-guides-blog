---
title: "Rockchip Android SELinux (Sepolicy) Developer Guide"
description: "Rockchip Android SELinux (Sepolicy) Developer Guide — sepolicy, init, Binder, HAL, AVC, Android 7.1–10"
excerpt: "Rockchip Android SELinux (Sepolicy) Developer Guide"
translation_key: "249-rockchip-android-selinux"
slug: "249-rockchip-android-selinux"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android", "SELinux", "Sepolicy"]
---

{% raw %}

# Rockchip Android SELinux (Sepolicy) Developer Guide

ArmSoM platform reference based on Chinese Rockchip document RK-KF-YF-217 V1.0, in its 2019 technical context. It covers Android 7.1, 8.0+ and some 10.0 BSP examples, without a uniform SoC, kernel or ArmSoM-board support matrix. Check sepolicy directories, init syntax, partitions and build variables against the actual SDK. No hardware validation was performed.

Root, flashing, Permissive and sensitive-permission examples are for authorized development devices only. Restore and validate mandatory access control for production; do not bypass neverallow or copy broad grants blindly. Back up before operations. No commands were executed.

## 1. Introduction to SeAndroid

### 1.1 Purpose of SeAndroid

The Android security model relies partly on application sandboxes: each application runs in its own sandbox. Before Android 4.3, installation assigned each app a unique uid, and uid-based resource access followed traditional Linux discretionary access control (DAC). From Android 4.3, SELinux further defines sandbox boundaries. Android uses mandatory access control (MAC) for all processes, including those with root privileges; sepolicy constrains privileged processes. The source states that Android 4.4 enabled Enforcing mode with the default AOSP policy. In Enforcing mode, policy violations are blocked and unauthorized access is recorded in dmesg and logcat. Inspecting these logs helps identify violations and improve software and policy. This historical statement is retained as the source account, not a universal release/support assertion.

### 1.2 SeAndroid security policy

A security context is a label attached to an object. It is a colon-separated string containing SELinux user, role, type and security level: `user:role:type:rank`. Inspect it with `ps -Z`:

```text
LABEL                           USER     PID   PPID  NAME
u:r:init:s0                     root      1     0     /init
u:r:kernel:s0                  root      2     0     kthreadd
...
u:r:kernel:s0                  root      258   2     irq/322-HPH_R O
u:r:logd:s0                     logd      259   1     /system/bin/logd
u:r:healthd:s0                 root      260   1     /sbin/healthd
u:r:lmkd:s0                     root      261   1     /system/bin/lmkd
u:r:servicemanager:s0          system    262   1     /system/bin/servicemanager
u:r:vold:s0                     root      263   1     /system/bin/vold
```

The left column is the process SContext. The source calls its first process `/system/bin/logwrapper` and gives `u:r:init:s0`, although the displayed first row is `/init`. `u` denotes the SELinux user (SeAndroid defines `u`); `r` denotes a role. A user can belong to multiple roles with different permissions. `init` is the process domain/type; the source describes more than 100 Android types. `S0` is the source spelling of the security level (the sample actually uses `s0`). MLS classifies processes and files so access requires a corresponding level. Preserve these source inconsistencies for verification.

### 1.3 Key SeAndroid files

Policy source files end in `*.te` and define domains and labels. New files may be needed under `/device/manufacturer/device-name/sepolicy`, but update existing files where possible. Context-description files follow.

1. `file_contexts` labels files and is used by several userspace components. Create or update it when adding labels. Rebuild the filesystem image or run `restorecon` on files requiring relabeling. During upgrades its changes automatically apply to system and userdata. For other partitions, add `restorecon_recursive` to `init.board.rc` after mounting them read-write.

2. `genfs_contexts` labels filesystems without extended attributes, such as proc or vfat. It is loaded as part of kernel policy, but changes may not affect existing kernel inodes. Reboot or unmount/remount to apply fully. The source also describes `context=mount` for assigning a specific label to mounted filesystems such as vfat; verify actual mount syntax in the target system.

3. `property_contexts` labels Android system properties to control which processes may set them. init reads it during boot.

4. `service_contexts` labels Android Binder services and controls which processes may add/register or find/query their Binder references. servicemanager reads it at boot.

5. `seapp_contexts` labels app processes and `/data/data`. zygote reads it on each app launch; installd reads it during boot.

6. `mac_permissions.xml` assigns seinfo tags using application signatures and optionally package names. `seapp_contexts` then uses seinfo as a key to assign specific labels to all matching apps. system_server reads it at boot.

BoardConfig.mk: after changing policy/context files, update `/device/rockchip/device-name/BoardConfig.mk`.

```text
BOARD_SEPOLICY_DIRS += \
        <root>/device/rockchip/device-name/sepolicy
```

Android 8.0+ does not need the following portion. The trailing punctuation in source `sepolicy.te。` is retained as an issue.

```text
BOARD_SEPOLICY_UNION += \
        genfs_contexts \
        file_contexts \
        sepolicy.te。
```

## 2. Confirming Sepolicy-related problems

1. If functionality fails with a user image but works with userdebug, missing permissions may be responsible.

2. SELinux denials appear as `avc:denied` in kernel or Android logs. First identify Enforcing versus Permissive mode. If reproducible, temporarily test in Permissive mode to determine whether SELinux constraints are involved. Restrict this to controlled debugging.

```text
adb shell setenforce 0
```

The source calls `setenforce 0` temporary SELinux disabling and `setenforce 1` enabling. More precisely they switch Permissive/Enforcing; they do not remove or disable SELinux itself.

3. Capture the relevant logs with either command:

```text
adb shell logcat | grep avc

adb shell dmesg | grep avc
```

## 3. Adding and validating Sepolicy rules

### 3.1 Deriving permissions from logs

Example 1

```text
audit(1444651438.800:8): avc: denied { search } for pid=158 comm="setmacaddr"
name="/" dev="nandi" ino=1 scontext=u:r:engsetmacaddr:s0
tcontext=u:object_r:vfat:s0 tclass=dir permissive=0
```

Missing permission: `search`; subject: `engsetmacaddr`; target: `vfat`; file class: `dir`. Resulting source rule:

```text
allow engsetmacaddr vfat:dir { search };
```

Example 2

```text
auditd  (  627):  avc: denied { write } for pid=15848 comm=“system_server”
name=“enable” dev=“sysfs” ino=9381 scontext=u:r:zygote:s0
tcontext=u:object_r:sysfs:s0 tclass=file permissive=1
```

Missing permission: `write`; subject: `scontext=u:r:zygote:s0`; target: `tcontext=u:object_r:sysfs:s0`; file class: `tclass=file`. Resulting source rule:

```text
allow zygote sysfs:file write
```

Example 3

```text
audit(1441759284.810:5): avc: denied { read } for pid=1494 comm="sdcard"
name="0" dev="nandk" ino=245281 scontext=u:r:sdcardd:s0
tcontext=u:object_r:system_data_file:s0 tclass=dir permissive=0
```

Missing permission: `read`; subject: `sdcardd`; target: `system_data_file`; file class: `dir`. Resulting source rule:

```text
allow sdcardd system_data_file:dir read
```

Example 4: ioctl-specific handling

```text
avc: denied { ioctl } for path="/dev/cmx_ddlsw" dev="tmpfs" ino=10422
ioctlcmd=4d02 scontext=u:r:system_server:s0
tcontext=u:object_r:cmx_ddlsw_device:s0 tclass=chr_file permissive=0
```

After allowing ioctl, specify the concrete iocmd based on source code. Original rules follow (`chr_file` differs from `file`; original `allowxperm` spelling is retained). Verify against the target SDK before use.

```text
allow system_server cmx_ddlsw_device:file { ioctl };
allowxperm system_server cmx_ddlsw_device:file ioctl { 0x4d02 };
```

1. An AVC log may reveal only one permission failure at a time: after read is allowed, write may fail next. The source recommends controlled Permissive-mode debugging to see more denials and reduce repeated trials.

2. Group permissions in braces or use macros; the source strongly favors macros for compatibility. Example:

```text
allow engsetmacaddr vfat:dir { search write add_name create};
```

### 3.2 Simplifying rule generation with audit2allow

1. Extract AVC-denied entries from logcat or serial output; this example extracts all matching entries:

```text
$ adb shell "cat /proc/kmsg | grep avc" > avc_log.txt
```

2. Generate policy with audit2allow after `source build/envsetup.sh` imports the environment. The source also spells it audio2allow here; this is recorded as a source typo.

```text
$ audit2allow -i avc_log.txt
```

3. Add the generated policy to the appropriate te file, usually under `/device/<company>/common/sepolicy` or `/device/<company>/$DEVICE/sepolicy`. Determine the actual directory with `get_build_var`, as in chapter 5. Review permissions rather than granting every generated rule blindly.

### 3.3 Applying changes

Following the logs, edit the corresponding policy files under `$SDK/device/rockchip/common`. Rebuild and flash `vendor.img` on Android 8.0+ (`boot.img` on older versions) to validate. For Android 10.0 the source specifies flashing `odm.img` via fastboot.

## 4. GMS-related tests

```text
GtsSecurityHostTestCases
CtsSecurityHostTestCases
```

## 5. Permissions for new boot services

### 5.1 Adding a framework service: redmine:179485

A Java Binder service may be needed to call framework interfaces or provide special interfaces to apps:

```text
    @Override
    public void onStart() {
        publishBinderService("ccc_service", new BinderService());

        publishLocalService(CCCServiceInternal.class, new LocalService());

        Watchdog.getInstance().addMonitor(this);
        Watchdog.getInstance().addThread(mHandler);
    }
```

Run `get_build_var BOARD_PLAT_PRIVATE_SEPOLICY_DIR`. In the returned directory, edit `service.te`, for example `device/rockchip/common/sepolicy/private/service.te`, and insert:

```text
type ccc_service, system_api_service, system_server_service, service_manager_type;
```

Then append this context association to `device/rockchip/common/sepolicy/private/service_contexts` in the same directory to label the service. The source also mentions a service_context directory. Verify the naming difference between `ccc` here and `ccc_service` above.

```text
ccc u:object_r:ccc_service:s0
```

### 5.2 Autostart binary service: Android 7.1

Add a binary or script to execute automatically at boot, such as `rockchip.sample.nougat.sh`.

```text
#! /system/bin/sh
echo "starting service..."
```

The first script line must identify the shell; the source requests a space after `!`, as above. Files changed in this section are in directories returned by `get_build_var BOARD_SEPOLICY_DIRS`.

Declare the service in init.rc, any loaded rc file, or a newly declared rc file.

```text
service rockchip-sample-nougat-sh /system/bin/rockchip.sample.nougat.sh
    class main
    user root
    group root wifi
    oneshot
```

Syntax is `service service_name service_path`. The script must be executable and follow the service name directly, with a file_context label. Do not use `/system/bin/sh xxx.sh`, which makes sh/shell the service subject rather than the script. `class` specifies the startup phase; adjust as required. `oneshot` starts once and exits. The source says non-autostart services use `disable` and `start servic_name`; both spellings are recorded as written and must be checked against init syntax.

Incorrect script-service example:

```text
service rockchip-sample-nougat-sh /system/bin/sh /system/bin/rockchip.sample.nougat.sh
    class main
    user root
    group root wifi
    oneshot
```

Declare the domain in a new `rockchip_sample_nougat.te` under sepolicy:

```text
type rockchip_sample_nougat, domain;
type rockchip_sample_nougat_exec, exec_type, file_type;

init_daemon_domain(rockchip_sample_nougat)
```

Label the executable and bind it to the te declaration by adding to sepolicy `file_contexts`:

```text
/system/bin/rockchip\.sample\.nougat\.sh u:object_r:rockchip_sample_nougat_exec:s0
```

Format: `service_path u:object_r:te_type_name_exec:s0`, matching the declared te type. Observe the escape character `\`. This completes the example.

### 5.3 Autostart binary service: Android 8.0+

All files here are in directories returned by `get_build_var BOARD_SEPOLICY_DIRS`. The xxxservice example resembles Android 7.1, but the program/script must be under vendor/bin/. 1. init.rc or another rc file:

```text
service xxxservice /vendor/bin/xxxservice
    class main
    oneshot
```

2. xxxservice.te: associate the exec type with vendor_file_type as well.

```text
type xxxservice, domain;
type xxxservice_exec, exec_type, vendor_file_type, file_type;
init_daemon_domain(xxxservice)
```

3. file_contexts: as on Android 7.1, add:

```text
/vendor/bin/xxxservice u:object_r:xxxservice_exec:s0
```

### 5.4 Complete new binary-service example for Android 7.1–9.0 (internal reference)

```text
https://10.10.10.29/#/q/topic:%22npu+monitor+service%22
```

This is the source internal-network address; it was not accessed and may not be externally available.

### 5.5 Adding a HAL service on Android 8.0+

Android 8.0 introduces hwservice; consult Google documentation for the concept. It commonly supports hardware such as NFC, fingerprint or iris-recognition modules. This example adds an NXP NFC HAL service.

Add an instance node: run `get_build_var DEVICE_MANIFEST_FILE`, edit the returned file (for example `device/rockchip/common/manifest.xml`) and add the service node:

```text
 <hal format="hidl">
        <name>vendor.nxp.nxpnfc</name>
        <transport>hwbinder</transport>
        <version>1.0</version>
        <interface>
            <name>INxpNfc</name>
            <instance>default</instance>
        </interface>
    </hal>
```

Use hwservice for unified startup; rc example:

```text
service vendor.nxp.nxpnfc-1-0 /vendor/bin/hw/vendor.nxp.nxpnfc@1.0-service

    class hal
    user system
    group system
```

Declaring `class hal` in rc classifies it as a HAL service; the source says these start through hwservice at init’s start hal phase.

Declare hwservice: run `get_build_var BOARD_SEPOLICY_DIRS` and edit hwservice.te in the returned directory.

```text
type vnd_nxpnfc_hwservice, hwservice_manager_type;
```

Bind the service executable label: locate the directory again with `get_build_var BOARD_SEPOLICY_DIRS` and edit file_contexts:

```text
/vendor/bin/hw/vendor\.nxp\.nxpnfc@1\.0-service u:object_r:nxpnfc_hal_exec:s0
```

Bind the manifest instance: edit hwservice_contexts under `get_build_var BOARD_SEPOLICY_DIRS`. Check the name against the new manifest instance; it must match.

```text
vendor.nxp.nxpnfc::INxpNfc u:object_r:vnd_nxpnfc_hwservice:s0
```

Service declaration: create nxpnfc.te in the directory returned by `get_build_var BOARD_SEPOLICY_DIRS`. The final add_hwservice is needed only when the nfc process starts the new service.

```text
type nxpnfc_hal, domain;
type nxpnfc_hal_exec, exec_type, vendor_file_type, file_type;
init_daemon_domain(nxpnfc_hal)
add_hwservice(nfc, vnd_nxpnfc_hwservice)
```

## 6. Android 8.0+ troubleshooting

### 6.1 How can SELinux be disabled on Android 8.0+?

The source says Android 8.0+ cannot disable SELinux, only run Permissive. At the end of a denial log, `permissive=0` means the denial is enforced; `permissive=1` is informational and that denial does not block the operation. Run `adb shell getenforce`: permissive indicates Permissive, enforcing indicates Enforcing. This describes the source BSP context and does not replace target-build security validation.

### 6.12 How is SELinux changed to Permissive?

Add `androidboot.selinux=permissive` to cmdline. First identify the uboot branch:

```text
cd u-boot; git branch -a
```

develop: add to parameter.txt. next-dev: add to bootargs of the chosen node in a kernel dts, for example px30-android.dtsi.

### 6.13 How is Permissive enabled in user firmware?

After section 6.12, apply the following source change under system/core. It is a debugging reference, not a default production security policy.

```text
kenjc@ubuntu:~/1_RK3326_P_29/system/core/init$ git diff
diff --git a/init/Android.mk b/init/Android.mk
index c4a6a50..58161ca 100644
--- a/init/Android.mk
+++ b/init/Android.mk
@@ -14,7 +14,7 @@ init_options += \
 else
 init_options += \
     -DALLOW_LOCAL_PROP_OVERRIDE=0 \
-    -DALLOW_PERMISSIVE_SELINUX=0 \
+    -DALLOW_PERMISSIVE_SELINUX=1 \
     -DREBOOT_BOOTLOADER_ON_PANIC=0 \
     -DWORLD_WRITABLE_KMSG=0 \
     -DDUMP_ON_UMOUNT_FAILURE=0
```

### 6.2 Why can an app still not access a node in Permissive after adding permissions?

The source identifies sensitive permissions by `c512,c768` in logs. An attempted addition to untrusted_app.te is:

```text
allow untrusted_app audio_device:chr_file { open write read };
```

The following denial still appears:

```text
[ 141.935275] type=1400 audit(1546939304.786:43): avc: denied { write } for
pid=1836 comm="Thread-4" name="pcmC0D1c" dev="tmpfs" ino=11947
scontext=u:r:untrusted_app:s0:c512,c768 tcontext=
u:object_r:audio_device:s0 tclass=chr_file permissive=1
```

First determine whether the node is the sensitive audio_device. Where possible, change the accessed directory/file and narrow that type’s scope.

1. Identify the exact node from source or logs, such as `/dev/pcmc00xx`.
2. Declare a new type in the relevant te file, such as file.te:

```text
type test_audio_device, dev_type;
```

3. Bind the exact node to the new type in file_context:

```text
/dev/pcmc00xx u:object_r:test_audio_device:s0
```

4. Add or change the required permissions:

```text
allow untrusted_app test_audio_device:chr_file { open write read };
```

The source also says that without GMS certification such objects could be assigned mlstrustedobject, but explicitly discourages this because it causes serious security problems. The following is preserved as an unsafe source example, not a recommendation:

```text
typeattribute audio_device mlstrustedobject;
```

### 6.3 Why does a new service not start on Android 8.0+?

Troubleshoot using chapter 5. New services on Android 8.0+ belong under vendor.

### 6.4 Build failure after granting permissions: neverallow xxx

The source attributes this to overly broad permissions and recommends narrowing them by declaring and specifying the exact nodes needed. Its cross-reference says “section 2”; use the actual rule and neverallow diagnostic to locate the issue rather than deleting constraints.

### 6.5 System commands via system() fail in vendor binary services after Android 8.0

The vendor service PATH is overridden to `/vendor/bin:/vendor/xbin`, so it cannot find commands in the system partition.

```text
cc_binary {
    name: "sh_vendor",
    defaults: ["sh-defaults"],
    stem: "sh",
    vendor: true,
    cflags: [
        // Additional flags for vendor variant
        "-UMKSH_DEFAULT_PROFILEDIR",
        "-UMKSHRC_PATH",
        "-UMKSH_DEFAULT_EXECSHELL",
        "-DMKSH_DEFAULT_PROFILEDIR=\"/vendor/etc\"",
        "-DMKSHRC_PATH=\"/vendor/etc/mkshrc\"",
        "-DMKSH_DEFAULT_EXECSHELL=\"/vendor/bin/sh\"",
        "-DMKSH_DEFPATH_OVERRIDE=\"/vendor/bin:/vendor/xbin\"",
    ],
}
```

Add the system path within the call, for example:

```text
system("export PATH=$PATH:/system/bin; input tap 0 0");
```

system forks a child process: do not call export and input separately; execute them together in one call.

### 6.6 Which directories should be edited, and how do changes take effect?

Locate files with the get_build_var commands in each section. The source says Android 8.0+ does not require editing system/sepolicy; create missing target files. Build-output mappings follow; verify the actual BSP:

```text
BOARD_SEPOLICY_DIRS/BOARD_PLAT_PUBLIC_SEPOLICY_DIR -> vendor/etc/selinux
BOARD_PLAT_PRIVATE_SEPOLICY_DIR -> system/etc/selinux
```

### 6.7 Why do denials continue after allowing ioctl?

ioctl operates directly on drivers and covers thousands of commands, so permissions must identify the concrete cmd. See example 4 in section 3.1.

## Editorial and source notes

- No matching English PDF exists; English, Russian and German translate the full Chinese technical body. All six chapters across ten pages are retained, including technical content on page 1. No technical figures exist. Nontechnical cover tables, contents list and classification are omitted.
- Explanations inside gray boxes are restored as editable prose, not misclassified as code. Logs, rules, Java, init, XML, patches and build examples remain. Duplicate same-position fi ligatures, split code, displaced explanations and visual command wraps are repaired.
- Source issues remain explicit: /system/bin/logwrapper versus /init; S0/s0; ccc/ccc_service; missing allow semicolons; chr_file/file and allowxperm; audio2allow; sepolicy.te。; disable; servic_name; context=mount; historical paths and image roles. Verify each against the target SDK. Source numbering 6.12/6.13 is retained.
- The source treats c512,c768 as sensitive permissions and suggests narrowing permissions resolves neverallow builds. These are source explanations, not validated universal diagnoses. The unsafe mlstrustedobject example and its severe-risk warning remain.
- GTS/CTS are source test names, not ArmSoM results. The internal link was not accessed. All languages share restored code; explanatory prose is not executable code.

[Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/) · [AOSP SELinux](https://source.android.com/docs/security/features/selinux/customize)

{% endraw %}
