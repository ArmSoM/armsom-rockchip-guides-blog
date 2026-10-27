---
title: "Rockchip Android SELinux（Sepolicy）完整开发指南"
description: "Rockchip Android SELinux（Sepolicy）完整开发指南 — sepolicy, init, Binder, HAL, AVC, Android 7.1–10"
excerpt: "Rockchip Android SELinux（Sepolicy）完整开发指南"
translation_key: "249-rockchip-android-selinux"
slug: "249-rockchip-android-selinux"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android", "SELinux", "Sepolicy"]
---

{% raw %}

# Rockchip Android SELinux（Sepolicy）完整开发指南

ArmSoM 平台参考。依据 Rockchip 中文文档 RK-KF-YF-217 V1.0（2019版技术语境），覆盖 Android 7.1、8.0+ 及部分 10.0 BSP 示例；未声明统一 SoC、内核或 ArmSoM 板卡支持矩阵。具体 sepolicy 目录、init 语法、分区和构建变量须按实际 SDK 核对，未进行硬件验证。

本篇含 root、烧写、Permissive 与敏感权限示例，仅用于获得授权的开发设备调试。量产须恢复并验证强制访问控制，不应绕过 neverallow 或照抄宽泛授权；操作前备份。未执行本文命令。

## 1. SeAndroid 简介

### 1.1 SeAndroid 的作用

Android的安全模型是基于一部分应用程序沙箱(sandbox)的概念, 每个应用程序都运行在自己的沙箱之中。在Android 4.3之前的版本,系统在应用程序安装时为每一个应用程序创建一个独立的uid,基于uid来控制访问进程来访问资源,这种安全模型是基于Linux传统的安全模型DAC(Discretionary AccessControl,翻译为自主访问控制)来实现的。从Android 4.3开始,安全增强型Linux (SElinux) 用于进一步定义应用程序沙箱的界限。作为Android安全模型的一部分,Android使用SELinux的强制访问控制(MAC) 来管理所有的进程,即使是进程具有root(超级用户权限)的能力,SELinux通过创建自动化的安全策略(sepolicy)来限制特权进程来增强 Android的安全性。从Android 4.4开始Android打开了SELinux的Enforcing模式,使其工作在默认的AOSP代码库定义的安全策略(sepolicy)下。在Enforcing模式下,违反SELinux安全策略的行为都会被阻止,所有不合法的访问都会记录在dmesg和logcat中。因此,我们通过查看dmesg或者logcat, 可以收集有关违背SELinux策略的错误信息,来完善我们自己的软件和SELinux策略。

### 1.2 SeAndroid 安全策略

安全上下文实际上就是一个附加在对象上的标签(label)。这个标签实际上就是一个字符串,它由四部分内容组成,分别是SELinux用户、SELinux 角色、类型、安全级别,每一个部分都通过一个冒号来分隔,格式为“user:role:type:rank”。可通过ps -Z命令查看,如下所示:

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

最左边的那一列是进程的SContext,以第一个进程/system/bin/logwrapper的SContext为例,其值为u:r:init:s0,其中:u为user的意思。SEAndroid中定义了一个SELinux用户,值为u。r为role的意思。role是角色之意,它是SELinux中一种比较高层次,一个u可以属于多个role,不同的role具有不同的权限。init,代表该进程所属的Domain为init,是这个进程type,在andorid里面,定义了100多个type。按照目前我的理解,这个是进程所属的类型。S0是一个安全的等级MLS将系统的进程和文件进行了分级,不同级别的资源需要对应级别的进程才能访问。

### 1.3 SeAndroid 关键文件

政策文件以 *.te 结尾的文件是 SELinux 政策源代码文件,用于定义域及其标签。您可能需要在/device/manufacturer/device-name/sepolicy 中创建新的政策文件,但您应尽可能尝试更新现有文件。上下文的描述文件

1. file_contexts 用于为文件分配标签,并且可供多种用户空间组件使用。在创建新政策时,请创建或更新该文件,以便为文件分配新标签。要应用新的 file_contexts,请重新构建文件系统映像,或对要重新添加标签的文件运行 restorecon。在升级时,对 file_contexts 所做的更改会在升级过程中自动应用于系统和用户数据分区。此外,您还可以通过以下方式使这些更改在升级过程中自动应用于其他分区:在以允许读写的方式装载相应分区后,将 restorecon_recursive 调用添加init.board.rc 文件中。

2. genfs_contexts 用于为不支持扩展属性的文件系统(例如,proc 或 vfat)分配标签。此配置会作为内核政策的一部分进行加载,但更改可能对内核 inode 无效。要全面应用更改,您需要重新启动设备,或卸载并重新装载文件系统。此外,通过使用 context=mount 选项,您还可以为装载的特定系统文件(例如 vfat)分配特定标签。

3. property_contexts 用于为 Android 系统属性分配标签,以便控制哪些进程可以设置这些属性。在启动期间,init 进程会读取此配置。

4. service_contexts 用于为 Android Binder 服务分配标签,以便控制哪些进程可以为相应服务添加(注册)和查找(查询)Binder 引用。在启动期间,servicemanager 进程会读取此配置。

5. seapp_contexts 用于为应用进程和 /data/data 目录分配标签。在每次应用启动时,zygote 进程都会读取此配置;在启动期间,installd 会读取此配置。

6. mac_permissions.xml 用于根据应用签名和应用软件包名称(后者可选)为应用分配 seinfo 标记。随后,分配的 seinfo 标记可在seapp_contexts 文件中用作密钥,以便为带有该 seinfo 标记的所有应用分配特定标签。在启动期间,system_server 会读取此配置。

BoardConfig.mk：修改政策及上下文文件后，更新 `/device/rockchip/device-name/BoardConfig.mk`。

```text
BOARD_SEPOLICY_DIRS += \
        <root>/device/rockchip/device-name/sepolicy
```

Android 8.0+ 不需要以下部分；原文末尾 `sepolicy.te。` 的句号保留为疑点。

```text
BOARD_SEPOLICY_UNION += \
        genfs_contexts \
        file_contexts \
        sepolicy.te。
```

## 2. Sepolicy 相关问题确认

1. 烧入user版本的镜像后如果发现有相关功能无法正常工作了,但是烧入userdebug版本的镜像后发现可以正常工作,有可能是权限没有添加成功导致。

2. 如果出现了selinux相关的权限拒绝,则在kernel log 或者android log中都有对应的”avc:denied”,当然也可能和selinux的模式有关系,我们需要首先要确认当时SELinux 的模式, 是enforcing mode 还是 permissve mode。如果问题容易复现,我们可以先将SELinux 模式调整到Permissive mode,然后再测试确认是否与SELinux 约束相关。

```text
adb shell setenforce 0
```

原文把 `setenforce 0` 称为临时关闭 SELinux，把 `setenforce 1` 称为临时打开。准确说法是切换 Permissive/Enforcing，不是卸载或禁用 SELinux。

3. 另外当出现selinux相关问题,我们可以通过下面的命令来抓取对应的log:

```text
adb shell logcat | grep avc

adb shell dmesg | grep avc
```

## 3. Sepolicy Rule 添加及验证

### 3.1 根据 log 推导权限

例 1

```text
audit(1444651438.800:8): avc: denied { search } for pid=158 comm="setmacaddr"
name="/" dev="nandi" ino=1 scontext=u:r:engsetmacaddr:s0
tcontext=u:object_r:vfat:s0 tclass=dir permissive=0
```

缺少权限：`search`；主体：`engsetmacaddr`；目标：`vfat`；文件类型：`dir`。最后输入的规则：

```text
allow engsetmacaddr vfat:dir { search };
```

例 2

```text
auditd  (  627):  avc: denied { write } for pid=15848 comm=“system_server”
name=“enable” dev=“sysfs” ino=9381 scontext=u:r:zygote:s0
tcontext=u:object_r:sysfs:s0 tclass=file permissive=1
```

缺少权限：`write`；主体：`scontext=u:r:zygote:s0`；目标：`tcontext=u:object_r:sysfs:s0`；文件类型：`tclass=file`。最后输入的规则：

```text
allow zygote sysfs:file write
```

例 3

```text
audit(1441759284.810:5): avc: denied { read } for pid=1494 comm="sdcard"
name="0" dev="nandk" ino=245281 scontext=u:r:sdcardd:s0
tcontext=u:object_r:system_data_file:s0 tclass=dir permissive=0
```

缺少权限：`read`；主体：`sdcardd`；目标：`system_data_file`；文件类型：`dir`。最后输入的规则：

```text
allow sdcardd system_data_file:dir read
```

例4：ioctl 特别说明

```text
avc: denied { ioctl } for path="/dev/cmx_ddlsw" dev="tmpfs" ino=10422
ioctlcmd=4d02 scontext=u:r:system_server:s0
tcontext=u:object_r:cmx_ddlsw_device:s0 tclass=chr_file permissive=0
```

添加 ioctl 后还必须结合源码声明具体 iocmd。原文规则如下（`chr_file` 与 `file` 不同，`allowxperm` 原拼写保留；执行前核对目标 SDK）：

```text
allow system_server cmx_ddlsw_device:file { ioctl };
allowxperm system_server cmx_ddlsw_device:file ioctl { 0x4d02 };
```

1. 有时候avc denied的log不是一次性显示所有问题,要等解决一个权限问题之后,才会提示另外一个权限问题,比如提示缺失某个目录的read权限,你加入read之后,再显示缺少write权限,要你一次一次试,一次一次加。所以建议在permissive模式下进行debug和添加权限,否则会无限放大工作量。

2. 多个权限可用花括号或宏，原稿强烈建议宏以改善兼容性。例如：

```text
allow engsetmacaddr vfat:dir { search write add_name create};
```

### 3.2 利用 audit2allow 简化方法添加 log

1. 从 logcat 或串口中提取相应的 avc-denied log,下面的语句为提取所有的 avc- denied log

```text
$ adb shell "cat /proc/kmsg | grep avc" > avc_log.txt
```

2. 使用 audit2allow 生成 policy；先执行 `source build/envsetup.sh` 导入环境。原文此处另写 audio2allow，保留为笔误记录。

```text
$ audit2allow -i avc_log.txt
```

3. 将对应的policy 添加到 te 文件中一般添加在 /device/<company>/common/sepolicy 或者/device/<company>/$DEVICE/sepolicy 目录下,具体哪个目录,请执行get_build_var 查看,参考第5章

### 3.3 使修改生效

根据上述log进入$SDK/device/rockchip/common,将相应的权限语句添加到相应的文件中,重新编译烧写vendor.img(8.0及以上, 之前的版本是boot.img)进行验证。对于10.0, 请通过fastboot烧写odm.img

## 4. GMS 相关测试

```text
GtsSecurityHostTestCases
CtsSecurityHostTestCases
```

## 5. 添加新的开机服务的权限

### 5.1 添加系统框架服务，例 redmine:179485

用于 Java Binder service。如果需要调用框架接口或为 app 提供特殊接口，可能需要新增 Java Binder 服务：

```text
    @Override
    public void onStart() {
        publishBinderService("ccc_service", new BinderService());

        publishLocalService(CCCServiceInternal.class, new LocalService());

        Watchdog.getInstance().addMonitor(this);
        Watchdog.getInstance().addThread(mHandler);
    }
```

执行 `get_build_var BOARD_PLAT_PRIVATE_SEPOLICY_DIR`，在输出目录中修改 `service.te`，例如 `device/rockchip/common/sepolicy/private/service.te`，插入一行：

```text
type ccc_service, system_api_service, system_server_service, service_manager_type;
```

再修改同目录的 `device/rockchip/common/sepolicy/private/service_contexts`，最后添加以下上下文关联以标记服务。原文另称可在 service_context 目录进行；`ccc` 与前例 `ccc_service` 的服务名差异需核对。

```text
ccc u:object_r:ccc_service:s0
```

### 5.2 开机自启动二进制服务：Android 7.1

增加某个二进制程序或某个脚本,想要开机自动执行,如 rockchip.sample.nougat.sh

```text
#! /system/bin/sh
echo "starting service..."
```

脚本首行必须包含 shell 路径；原文要求 `!` 后有空格，示例如上。本节修改文件位于 `get_build_var BOARD_SEPOLICY_DIRS` 输出目录。

声明服务在init.rc(任意会加载执行到的rc文件,或自己声明一个新的rc文件)中声明服务

```text
service rockchip-sample-nougat-sh /system/bin/rockchip.sample.nougat.sh
    class main
    user root
    group root wifi
    oneshot
```

格式为 `service service_name service_path`。脚本必须可执行，服务名后直接接可执行文件，并在 file_context 中指定标签；不能写成 `/system/bin/sh xxx.sh`，否则主体是 sh/shell 而不是脚本。`class` 表示启动阶段，按需求调整；`oneshot` 表示仅启动一次后退出。原文说非自启动时加 `disable` 并通过 `start servic_name` 触发，这两个拼写按原稿记录，使用前核对 init 语法。

错误脚本服务示例:

```text
service rockchip-sample-nougat-sh /system/bin/sh /system/bin/rockchip.sample.nougat.sh
    class main
    user root
    group root wifi
    oneshot
```

声明运行域sepolicy目录下新建 rockchip_sample_nougat.te

```text
type rockchip_sample_nougat, domain;
type rockchip_sample_nougat_exec, exec_type, file_type;

init_daemon_domain(rockchip_sample_nougat)
```

给二进制程序打标签,绑定到te文件在sepolicy目录下的file_contexts文件添加:

```text
/system/bin/rockchip\.sample\.nougat\.sh u:object_r:rockchip_sample_nougat_exec:s0
```

格式：`service_path u:object_r:te_type_name_exec:s0`，对应前述 te 类型，并注意转义字符 `\`。至此结束。

### 5.3 开机自启动二进制服务：Android 8.0 及以上

本节文件都在 `get_build_var BOARD_SEPOLICY_DIRS` 输出目录。以 xxxservice 为例，与 Android 7.1 相近，但程序或脚本必须位于 vendor/bin/。1. init.rc 或其他 rc：

```text
service xxxservice /vendor/bin/xxxservice
    class main
    oneshot
```

2. xxxservice.te：声明 exec type 时同时关联 vendor_file_type。

```text
type xxxservice, domain;
type xxxservice_exec, exec_type, vendor_file_type, file_type;
init_daemon_domain(xxxservice)
```

3. file_contexts：与 Android 7.1 一致，添加：

```text
/vendor/bin/xxxservice u:object_r:xxxservice_exec:s0
```

### 5.4 Android 7.1~9.0添加一个新二进制服务的完整代码示例(供内部同事参考)

```text
https://10.10.10.29/#/q/topic:%22npu+monitor+service%22
```

以上为原稿内网地址，未访问，也不保证外部可用。

### 5.5 Android 8.0以上添加一个HAL服务

Android 8.0 引入 hwservice，概念参考 Google 官方文档，通常用于新增 NFC、指纹、虹膜识别等硬件。本例以 NXP NFC 模块介绍新增 HAL 服务。

添加 instance 节点：执行 `get_build_var DEVICE_MANIFEST_FILE`，修改输出文件（例如 `device/rockchip/common/manifest.xml`），加入服务节点：

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

通过hwservice统一调用,rc文件写法

```text
service vendor.nxp.nxpnfc-1-0 /vendor/bin/hw/vendor.nxp.nxpnfc@1.0-service

    class hal
    user system
    group system
```

rc 中声明 `class hal` 将其归类为 HAL 服务；原稿说明这些服务在 init 的 start hal 阶段通过 hwservice 启动。

声明 hwservice：执行 `get_build_var BOARD_SEPOLICY_DIRS`，修改输出目录中的 hwservice.te。

```text
type vnd_nxpnfc_hwservice, hwservice_manager_type;
```

服务文件标签绑定：再次用 `get_build_var BOARD_SEPOLICY_DIRS` 定位，修改 file_contexts：

```text
/vendor/bin/hw/vendor\.nxp\.nxpnfc@1\.0-service u:object_r:nxpnfc_hal_exec:s0
```

绑定 manifest 的 instance：在 `get_build_var BOARD_SEPOLICY_DIRS` 输出目录修改 hwservice_contexts，名称与 manifest 新增 instance 对照，不能写错。

```text
vendor.nxp.nxpnfc::INxpNfc u:object_r:vnd_nxpnfc_hwservice:s0
```

服务声明：在 `get_build_var BOARD_SEPOLICY_DIRS` 输出目录新建 nxpnfc.te。最后 add_hwservice 仅在通过 nfc 进程启动新服务时需要。

```text
type nxpnfc_hal, domain;
type nxpnfc_hal_exec, exec_type, vendor_file_type, file_type;
init_daemon_domain(nxpnfc_hal)
add_hwservice(nfc, vnd_nxpnfc_hwservice)
```

## 6. Android 8.0+ 常见问题及处理方法

### 6.1 怎么在Android 8.0以上的版本关闭selinux?

原稿说明 8.0 及以后不能关闭，只能使用 permissive 模式。疑似错误日志末尾 `permissive=0` 表示拒绝生效；`permissive=1` 表示提示而不由该拒绝阻止操作。执行 `adb shell getenforce`，结果 permissive 为宽容模式，enforcing 为强制模式。这是原稿 BSP 语境，不能替代目标构建的安全验证。

### 6.12 如何修改selinux为permissive模式?

在 cmdline 添加 `androidboot.selinux=permissive`。先用下面命令确认 uboot 分支：

```text
cd u-boot; git branch -a
```

develop：加到 parameter.txt。next-dev：加到 kernel dts（例如 px30-android.dtsi）chosen 节点的 bootargs。

### 6.13 如何在user固件下也设置selinux为permissive模式?

按 6.12 修改后，在 system/core 增加以下原文修改，仅作调试参考，不应作为量产默认安全策略。

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

### 6.2 为什么 permissive 下 app 仍不能访问节点，添加权限仍提示无权限？

敏感权限的特征是 log 包含 `c512,c768`。尝试在 untrusted_app.te 添加：

```text
allow untrusted_app audio_device:chr_file { open write read };
```

仍出现以下权限错误：

```text
[ 141.935275] type=1400 audit(1546939304.786:43): avc: denied { write } for
pid=1836 comm="Thread-4" name="pcmC0D1c" dev="tmpfs" ino=11947
scontext=u:r:untrusted_app:s0:c512,c768 tcontext=
u:object_r:audio_device:s0 tclass=chr_file permissive=1
```

先确认访问节点是否为敏感的 audio_device；尽可能修改访问目录/文件，缩小该类型范围。

1. 从源码或 log 确定具体节点，例如 `/dev/pcmc00xx`。
2. 在对应 te 文件声明新的类型，例如 file.te：

```text
type test_audio_device, dev_type;
```

3. 在 file_context 将具体节点绑定到新类型：

```text
/dev/pcmc00xx u:object_r:test_audio_device:s0
```

4. 增加或修改所需权限：

```text
allow untrusted_app test_audio_device:chr_file { open write read };
```

原稿另述不做 GMS 认证时可把敏感权限对象关联 mlstrustedobject，但明确不推荐，因为会造成严重安全问题。下面仅保留原文反面示例，不作为建议：

```text
typeattribute audio_device mlstrustedobject;
```

### 6.3 为什么在Android 8.0+中自己添加的服务无法启动

参照第5章排查。8.0 以上新服务应放到 vendor。

### 6.4 添加权限后编译报错,neverallow xxx

原稿将根因归为权限过大，建议缩小范围，声明并指定真正要访问的节点；原文交叉引用写“第2节”，应结合实际规则及 neverallow 报错定位，不删除约束。

### 6.5 Android 8.0 后 vendor 二进制服务中 system() 等调用系统命令无效

vendor 服务的 PATH 被改为 `/vendor/bin:/vendor/xbin`，因而无法找到 system 分区的命令。

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

可在调用时加入 system 路径，例如：

```text
system("export PATH=$PATH:/system/bin; input tap 0 0");
```

system 函数 fork 子进程，不能分开调用 export 和 input，必须在同一调用内连续执行。

### 6.6 我需要修改哪个目录下的文件?修改后怎么生效?

通过各节的 get_build_var 查找文件。原稿说明 Android 8.0 及以后无需改 system/sepolicy；目标文件不存在则新建。构建产物对应关系如下（以实际 BSP 为准）：

```text
BOARD_SEPOLICY_DIRS/BOARD_PLAT_PUBLIC_SEPOLICY_DIR -> vendor/etc/selinux
BOARD_PLAT_PRIVATE_SEPOLICY_DIR -> system/etc/selinux
```

### 6.7 为什么ioctl的权限加上了还一直提示denied?

ioctl 直接操作驱动，包含上千种命令，因此权限必须指出具体 cmd。方法和示例见 3.1 的例4。

## 校对与来源说明

- 无对应英文 PDF，英俄德为中文全文翻译。原稿10页，第1页即含技术正文，六章全部保留；原稿无技术插图。非技术封面表、目录、密级等删除。
- 将灰底中的解释恢复为可编辑正文，而非把所有灰底当代码；日志、规则、Java、init、XML、补丁和构建示例保留。修复同坐标 fi 连字重复（file_contexts、BoardConfig.mk），跨页代码、行内说明错序和长命令折行。
- 保留源问题：/system/bin/logwrapper 与首行 /init 不一致；S0/s0；ccc/ccc_service；缺分号的 allow 示例；chr_file/file 与 allowxperm；audio2allow；sepolicy.te。；disable、servic_name；context=mount；旧版路径和镜像分工。均须按目标 SDK 核对。6.12/6.13 沿用原编号。
- 第6.2原稿认为 c512,c768 表示敏感权限，第6.4称缩小权限即可编译；这些是原稿解释，不是已验证的通用诊断。保留 mlstrustedobject 反例与严重安全风险提示。
- GTS/CTS仅为原文测试名称，没有 ArmSoM 测试结果。内网示例链接未访问。四语共享恢复后的代码，中文解释不作为可执行代码。

[Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/) · [AOSP SELinux](https://source.android.com/docs/security/features/selinux/customize)

{% endraw %}
