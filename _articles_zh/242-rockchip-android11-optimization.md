---
title: "Rockchip Android 11 平台优化：启动、性能、内存与分析工具"
description: "Rockchip Android 11 平台优化：启动、性能、内存与分析工具 — V1.0.0, ART, ZRAM, bootchart, Perfetto"
excerpt: "Rockchip Android 11 平台优化：启动、性能、内存与分析工具"
translation_key: "242-rockchip-android11-optimization"
slug: "242-rockchip-android11-optimization"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android11", "optimization", "ART"]
---

{% raw %}

# Rockchip Android 11 平台优化：启动、性能、内存与分析工具

ArmSoM 平台参考：依据唯一中文原稿《Rockchip Android 平台优化指导》1.0.0（文档290，10页）完整整理。原稿文件名标注Android11，正文还包含RK3399 Android7.1/Linux4.4、Linux4.19、Android8.1+和RK3568示例；不得把它们混作同一BSP补丁。英俄德文由中文完整翻译，没有独立英文稿；原稿没有技术图片，本篇不补造图片。未在ArmSoM或其他硬件实测，所有耗时、跑分和内存结果均为原稿示例。

## 适用限制与源稿差异

- 没有英文版本可作差异对照。跨版本示例必须核对对应内核、governor、DTS、init语法、ART与SDK。历史节点可能不在其他BSP存在。不要在生产设备上为性能关闭AVB或降低SELinux安全性；CTS设备按原稿明确保留ftrace。删驱动须确认硬件不使用，异步初始化/ko方案需验证依赖与启动顺序。
- touch boost提高频率、降低target_loads会改变功耗和发热；Pinner会占用不可回收内存，小DDR设备应谨慎。原稿“只有一个核”与RK3399大小核对照有歧义，应核对实际CPU policy拓扑，而不是假定所有单集群SoC只有一个物理核。
- 原稿声称file_contexts/genfs_contexts可二选一，实际不能忽略文件系统与标签机制的适用性，正文已经说明范围。32位系统选择还需满足应用ABI、认证及产品要求。
- ART说明提speed-profile，但变量PRODUCT_DEXPREOPT_SPEED_APPS与PRODUCT_SYSTEM_SERVER_APPS的注释说speed；两种过滤器不可静默等同。`TARGET_ARCH_VARIANT := armv8-2a`按原稿保留，需核对该SDK支持值。
- 4表数据均为原稿，不是受控A/B实测：Pinner表同时改变Android版本；安装例王者荣耀1.9G为约1:44→1:31；DDR3G/630MHz下FilesGoogle约2000ms→1100ms；1GB优化开机静置一分钟约320MB→450M。未补造实验方法或推广为保证收益。
- 代码保留原始注释/提交记录并合并两处跨页补丁，修复仅由PDF造成的长行折行；`...`、`do_something`、`xxxxx`仍为占位符，不是完整可执行补丁。原稿bootchart代码框末尾说明移出并翻译。除源命令展示外，本文没有刷机、修改系统或跑monkey测试。

## 1. Uboot

裁剪 U-Boot 中不需要的功能可提升加载速度。原稿还提出关闭 loader/U-Boot 串口日志，按需求关闭 AVB 校验。下列是 U-Boot AVB 的使能配置。关闭验证会削弱启动信任链，不作为生产或认证设备的建议。

```text
CONFIG_ANDROID_AVB=y
CONFIG_AVB_LIBAVB=y
CONFIG_AVB_LIBAVB_AB=y
CONFIG_AVB_LIBAVB_ATX=y
CONFIG_AVB_LIBAVB_USER=y
CONFIG_RK_AVB_LIBAVB_USER=y
```

## 2. Kernel

### 开机速度优化

#### 准备工作：统计内核启动耗时

从 kernel 第一句打印开始：

```text
[    0.000000] Booting Linux on physical CPU 0x0000000000 [0x412fd050]
```

到内核加载结束:

```text
[    1.259604] Freeing unused kernel memory: 3136K
```

两个日志之间的间隔近似为内核启动耗时。默认启用 `CONFIG_RK_CONSOLE_THREAD` 以降低串口打印影响，因此时间戳不是100%精确，但能反映总体耗时。

#### 确认每个驱动耗时

在 bootargs 加入 `initcall_debug` 测量驱动加载时间，以 RK3568 为例：

```text
+++ b/arch/arm64/boot/dts/rockchip/rk3568-android.dtsi
@@ -6,7 +6,7 @@

 / {
        chosen: chosen {
-               bootargs = "earlycon=uart8250,mmio32,0xfe660000 console=ttyFIQ0";
+               bootargs = "earlycon=uart8250,mmio32,0xfe660000 console=ttyFIQ0 initcall_debug loglevel=8";
        };
```

#### 查找耗时驱动并优化

删除驱动模块有两种方法：

1. 去掉这些模块对应的config选项,对于某些没有dts节点配置的模块,只能使用这种方法,比如内核的一些debug选项。

2. disable对应模块的dts节点。对于上面两种方法,第一种方法不仅仅减去了模块初始化的时间,并且还可以减小内核的大小,但是无法通过不同的device tree兼容不同的硬件设计,所以如果确认硬件上确实不会使用某个模块,则建议直接删掉对应的config选项,不让内核编译对应的模块。接下来简单描述下如何通过内核initcall的log,查找耗时大的驱动,如下面所示:

```text
[    3.723183] initcall rknand_driver_init+0x0/0x40 returned -1 after 2261968 usecs
```

NAND驱动耗时2.2s,如果不需要支持NAND,可以去掉CONFIG_RK_NAND配置。

```text
[    3.212658] ov5695 4-0036-1: Unexpected sensor id(000000),ret(-5)
[    3.213655] probe of 4-0036-1 returned 0 after 599822 usecs

... ...

[    3.052600] gc8034 4-0037: gc8034 read reg:0xf0 failed !
[    3.852833] gc8034 4-0037: gc8034 read reg:0xf1 failed !
[    3.852874] gc8034 4-0037: Unexpected sensor id(000000), ret(-6)
[    3.853169] probe of 4-0037 returned 0 after 1598844 usecs
```

sensor ov5695和gc8034读取id失败,如果硬件上没有接这两个sensor,可以去掉CONFIG_VIDEO_GC8034和CONFIG_VIDEO_OV5695两个配置或者dts中disable相关节点。

```text
[    0.412736] calling  tracer_init_tracefs+0x0/0x1d4 @ 1
[    0.524499] initcall tracer_init_tracefs+0x0/0x1d4 returned 0 after 109063 usecs
```

这个对应的kernel配置为CONFIG_TRACING,可以禁用trace功能,该功能主要用于性能调试,会增加内核固件的大小以及内核的初始化时间,建议在正式出货版本去掉trace功能,即去掉CONFIG_FTRACE和CONFIG_TRACING这两个配置。去掉这个配置项,除了上述log中打印出的时间以外,还能够显著减小内核其他一些模块耗时。去掉这个配置,在linux4.19内核上编译会报错,请加上如下补丁:

```text
diff --git a/drivers/staging/android/ion/ion_trace.h b/drivers/staging/android/ion/ion_trace.h
index 8233691a73eb..4ac3c3786448 100644
--- a/drivers/staging/android/ion/ion_trace.h
+++ b/drivers/staging/android/ion/ion_trace.h
@@ -14,6 +14,7 @@
 #include <linux/tracepoint.h>

 #ifndef __ION_PTR_TO_HASHVAL
+#ifdef CONFIG_FTRACE
 static unsigned int __ion_ptr_to_hash(const void *ptr)
 {
        unsigned long hashval;
@@ -24,6 +25,7 @@ static unsigned int __ion_ptr_to_hash(const void *ptr)
        /* The hashed value is only 32-bit */
        return (unsigned int)hashval;
 }
+#endif
```

注意:CTS测试用户请不要修改ftrace,去除后将无法使用systrace等功能,同时产生CTS fail

内核模块的裁剪需要基于客户实际的硬件进行调整,上面只是举了一些典型的例子,主要针对一些可以禁用的模块,如果碰到一些确定需要使用的模块,并且这些模块存在开机启动耗时比较⻓的问题,可以有如下两个解决方案:

1. 看看能否将比较耗时的操作放在linux的work中,进行并行处理,不会阻塞驱动的初始化流程。

2. 看能否将驱动作为 `.ko` 加载。

### 性能优化

### touch boost功能

该功能用于在触摸或者鼠标操作的时候cpu提速,一般默认的代码没有将速度提到最高,主要考虑到功耗和性能平衡,如果应用场景对于瞬时响应要求很高的话,可以考虑将对应频率提到最高,以rk3399linux4.4为例:

```text
diff --git a/drivers/cpufreq/cpufreq_interactive.c b/drivers/cpufreq/cpufreq_interactive.c
index 7a627216ac39..cad6026da0f5 100644
--- a/drivers/cpufreq/cpufreq_interactive.c
+++ b/drivers/cpufreq/cpufreq_interactive.c
@@ -1329,9 +1329,9 @@ static void rockchip_cpufreq_policy_init(struct cpufreq_policy *policy)
        if (policy->cpu == 0) {
                tunables->hispeed_freq = 1008000;
                tunables->touchboostpulse_duration_val = 500 * USEC_PER_MSEC;
-               tunables->touchboost_freq = 1200000;
+               tunables->touchboost_freq = 1416000;
        } else {
-               tunables->hispeed_freq = 816000;
+               tunables->hispeed_freq = 1800000;
        }

        index = (policy->cpu == 0) ? 0 : 1;
```

【注意】由于rk3399有大小核,所以这里两个地方都有改,如果只有一个核,请修改

```text
if (policy->cpu == 0)
```

这个分支。

### cpu target_loads

除了每种变频策略定义的变频方式以外,linux默认通过负载进行频率的变化,target_loads定义了变频依赖的负载大小,对应的内核节点为:

```text
/sys/devices/system/cpu/cpufreq/policy0/interactive/target_loads
```

这个值越低,表明cpu会更容易变到高的频点,默认的配置是90,也就是对于每个频点,达到90%负载就往上变频。这个值的调整需要对功耗和性能进行取舍,如果客户不考虑功耗,可以将这个值降低,这样会更容易变到最高频。但是大部分场景都需要既考虑功耗又考虑性能,所以为了在两者进行平衡,可以为多个频点配置负载,以rk3399 7.1的如下补丁为例:

```text
commit 0d73bc800b4fdd9a4b5d4a31d521e1e897b107e2
Author: Wenping Zhang <wenping.zhang@rock-chips.com>
Date:   Tue Dec 25 15:21:29 2018 +0800

    change the target_loads of cpu frequence policy for cpuB.

    previous target_loads is 65, which will cause cpu increase to
    high freqence when load is low, so we change the target_loads
    to make sure cpu will transmit to high frequence when cpu load
    is high and make sure cpu will stay in low frequence when load
    is low.

    Change-Id: I3c99039ac79d5915f1186994d7c2f58ffcbdd581
    Signed-off-by: Wenping Zhang <wenping.zhang@rock-chips.com>

diff --git a/init.tablet.rc b/init.tablet.rc
index faac269..8b535ec 100755
--- a/init.tablet.rc
+++ b/init.tablet.rc
@@ -19,7 +19,7 @@ on boot
     write /dev/cpuset/background/cpus 0
     write /dev/cpuset/system-background/cpus 0-3
     write /dev/cpuset/top-app/cpus 0-5
-    write /sys/devices/system/cpu/cpufreq/policy4/interactive/target_loads 65
+    write /sys/devices/system/cpu/cpufreq/policy4/interactive/target_loads "65 1008000:70 1200000:75 1416000:80 1608000:90"
     ioprio rt 4
service lan_bridge_on /system/bin/sh /system/bin/lan_bridge_on.sh
```

对于target_loads,更详细的说明,请参考内核下面的文档:Documentation/cpu-freq/governors.txt

## 3. Android

开机速度优化

`init.rc` 默认支持开机期间 CPU/DDR 定频，原稿称可明显提高开机速度。

如需其他操作，在 `init.rc` 添加：

```text
on early-init
    do_something

on property:sys.boot_completed=1
    do_some_resume
```

### 优化IO效率

开机过程顺序读写量大，修改预读参数可提高 I/O 效率。SDK 示例以 `mmcblk2` 为例配置读取量大的分区；请检查实际分区，新增高读取量分区时也可参考修改。

```text
on late-fs
    # boot time fs tune
    write /sys/block/mmcblk2/queue/iostats 0
    write /sys/block/mmcblk2/queue/read_ahead_kb 2048
    write /sys/block/mmcblk2/queue/nr_requests 256
    write /sys/block/dm-0/queue/read_ahead_kb 2048

on property:sys.boot_completed=1
    # end boot time fs tune
    write /sys/block/mmcblk2/queue/read_ahead_kb 128
    write /sys/block/mmcblk2/queue/nr_requests 128
    write /sys/block/dm-0/queue/read_ahead_kb 128
    write /sys/block/mmcblk2/queue/iostats 1
```

DTS可以绑定emmc的初始化顺序:

```text
aliases {
    mmc0 = &sdmmc0;
    mmc1 = &sdmmc1;
    mmc2 = &sdhci;
    mmc3 = &sdmmc2;
};
```

#### 检查开机期间异常服务等待

结合 bootchart 与启动日志分析；如果单线程执行某项任务，确认它是否阻塞了启动流程。

### 优化SELinux策略

原稿介绍通过 `file_contexts` 或 `genfs_contexts` 给设备节点打标签，两者区别如下。实际适用范围由文件系统与策略决定，并非可任意互换。

1. file_contexts支持正则表达式匹配,但速度慢

2. genfs_contexts 不支持正则表达式，速度快。尽量避免不必要的通配符匹配，在适用范围内使用 genfs_contexts 以降低策略加载耗时。

### 性能优化

### Pinner Service

Android 7.1及以上支持锁定特定模块到内存中,防止这些模块被反复移出/移入内存,从而提高程序的运行效率,Rockchip Android 11中默认配置了一些调用频率高的模块,位于:

```text
vendor/rockchip/common/apps:
RockchipPinnerService
```

这个 App 是 overlay 模块，编译时自动区分32位和64位系统。启用时在 `device.mk` 添加：

```text
PRODUCT_PACKAGES += RockchipPinnerService
```

1. 对于10.0及以下的版本,可以参考上述apk源码,直接修改frameworks/base中的config.xml文件,但需要自己确认32位和64位的文件。

2. 建议使用 lsof 命令查看库被占用的情况,参考代码中的库都是被system_server等进程广泛占用的,所以将其锁到内存中才会提高程序运行效率,盲目添加只会白白增加内存占用,反而导致性能下降。实际还是要根据自己的应用场景进行调整。

3. 该功能会占用一定内存,DDR容量小的设备尽量不要尝试

4. 该功能也会对安兔兔跑分有一定的提升,如果机器内存较为充足,可以考虑使能。使能PinnerService后的跑分对比(RK3399挖掘机)

| Android版本 | 安兔兔分数 |
| --- | --- |
| android 10.0 | 约13w |
| android 11.0 | 约14.3w |

#### 实际应用场景定向优化

参考原稿 AOSP 链接：https://source.android.com/devices/bootloader/boot-image-profiles

注意: 仅仅一次的用户场景便修改profile文件,反而会使设备开机变慢,apk运行变慢。

### 使用32位系统

原稿称 DDR 容量较小或频率较低时，32位 Android 可提升整体流畅性。核对平台与应用要求后，在 `BoardConfig.mk` 添加：

```text
TARGET_ARCH := arm
TARGET_ARCH_VARIANT := armv8-2a
TARGET_CPU_ABI := armeabi-v7a
TARGET_CPU_ABI2 := armeabi

TARGET_2ND_ARCH :=
TARGET_2ND_ARCH_VARIANT :=
TARGET_2ND_CPU_ABI :=
TARGET_2ND_CPU_ABI2 :=
TARGET_2ND_CPU_VARIANT :=
```

### 配置系统 art 编译参数

原稿提出为核心应用配置名单并使用 `speed-profile` 引导式编译；下方示例注释实际指定 `speed` 过滤器，二者不能混为一谈。原注释解释：常驻应用如 SystemUI 下次重启才有机会进行配置文件引导编译，因此始终AOT可能更合适；系统服务器应用列表默认使用speed。以下示例适用于原稿所述 Android 8.1+。

```text
# ⼀个应⽤列表，⽤于列出哪些应⽤已被确定为产品的核⼼应⽤。
# 添加后将使⽤ speed 编译过滤器对其进⾏编译。
# 注意，常驻应⽤（如 SystemUI）只有在下次系统重新启动时才有机会使⽤配置⽂件引导型编译。
# 因此对于产品来说，让这些应⽤始终采⽤ AOT 编译可能会更好。
PRODUCT_DEXPREOPT_SPEED_APPS += \
    Settings \
    Camera2 \
    ...

# 系统服务器加载的应⽤的列表。这些应⽤将默认使⽤ speed 编译过滤器进⾏编译
PRODUCT_SYSTEM_SERVER_APPS += \
    FilesGoogle \
    Settings \
    ...
```

使能前后App启动时间对比(DDR 3G/630MHz)

| FilesGoogle应用 | am start -S -W 启动时间 |
| --- | --- |
| PRODUCT_DEXPREOPT_SPEED_APPS未添加 | 约2000ms |
| PRODUCT_DEXPREOPT_SPEED_APPS添加后 | 约1100ms |

原稿说明 `PRODUCT_SYSTEM_SERVER_APPS` 需结合32位系统，才能在低频DDR设备上发挥较好效果。

否则可能只增加系统占用空间，无明显收益。

#### 手动编译测试

```text
adb shell cmd package compile -m speed-profile -f com.android.settings
```

#### 修改编译线程与CPU绑定

Android11开始，可让编译器多线程运行于指定CPU集合，选项如下：

1. dalvik.vm.boot-dex2oat-cpu-set : 在启动时运行 dex2oat 线程的 CPU

2. dalvik.vm.image-dex2oat-cpu-set : 在编译启动映像时运行 dex2oat 的 CPU

3. dalvik.vm.dex2oat-cpu-set : 在启动后运行 dex2oat 线程的 CPU

4. dalvik.vm.dex2oat-threads : 多线程编译例如:

```text
PRODUCT_PRODUCT_PROPERTIES += \
    dalvik.vm.dex2oat-cpu-set=0,1,2,3 \
    dalvik.vm.boot-dex2oat-threads=4 \
    dalvik.vm.dex2oat-threads=4
```

建议 dex2oat 线程数与选中的CPU数量一致，以免不必要的CPU/I/O争用。

多线程可提高APK安装速度，尤其大APK；原稿对比如下。

| 王者荣耀（1.9G） | time adb install *.apk |
| --- | --- |
| N/A | 约1:44 |
| 4线程 | 约1:31 |

## 4. 低内存设备优化

主要针对1GB设备的内存优化。指在提升ZRAM利用率,定期回收后台进程的文件缓存和匿名⻚。增加优化后,系统内存整体控制在较好的水平,基本满足1GB的使用场景。从SDK中的以下位置获取补丁包,按包中的README说明合入补丁:

```text
RKDocs/android/patches/memory_optimization/MemoryReclaim_*.tar.gz
```

| 开机静置一分钟可用内存 | adb shell dumpsys meminfo |
| --- | --- |
| N/A | 约320MB |
| 优化后 | 约450M |

补丁包中有一定的裁剪,可以按自己实际需求进行调整

## 5. 分析工具

### bootchart

bootchart是Linux平台分析开机状态的工具,能够抓取开机过程中各个进程的启动时间及CPU/IO的使用情况,并将数据生成直观的图片,Android中也可以使用该功能对开机流程进行分析。手动开启并生成图片可以使用bootchart抓取Android启动过程中,各个服务启动的时间、占用cpu/rom的资源情况,针对性的对Android系统进行优化,降低开机时间。

```text
adb shell 'touch /data/bootchart/enabled'
adb reboot
# 开机后，pull出相关数据⽂件
adb shell 'tar -czf /sdcard/bootchart.tgz /data/bootchart'
adb pull /sdcard/bootchart.tgz .
bootchart bootchart.tgz -o bootchart.png
```

上述命令会生成服务资源占用图。也可使用SDK脚本 `./system/extras/boottime_tools/bootanalyze/bootanalyze.py -h`，添加 `-b` 抓取bootchart。

### 修改CPU调度优先级和IO优先级,调整服务启动顺序,避免服务集中占用CPU/IO

在 `init.rc` 使用 `priority`/`ioprio` 调整CPU/I/O优先级；下方高权限服务示例不是通用安全默认值。

```text
service xxxxx /vendor/bin/hw/xxxx
    user root
    group root system
    priority -20
    ioprio rt 0
    writepid /dev/cpuset/foreground/tasks
```

### 内存分析

Android11内核可收集dmabuf信息以分析DMA内存：

```text
cat /d/dma_buf/bufinfo
cat /d/dma_buf/bufprocs
```

SDK支持monkey测试,内存不足时抓取dmabuf info的新命令。可以参考以下补丁,对monkey进行修改,出问题时抓取对应的有效信息,以协助分析monkey测试时出现的问题。

```text
development:
commit f82c5582bfc5f1fb9fcf46c9716e5f414bf89c84
Author: Bian Jin chen <kenjc.bian@rock-chips.com>
Date:   Fri Apr 2 16:20:38 2021 +0800

    Capture dmabuf info when the device is in low memory.

    Use: monkey ** --dump-dmabuf
    Example: monkey --throttle 200 --ignore-crashes \
            --ignore-timeouts --ignore-security-exceptions --dump-dmabuf -v -v 5000000

    Signed-off-by: Bian Jin chen <kenjc.bian@rock-chips.com>
    Change-Id: Ic0c0629158ef45db2cea4bbe30b9147cf4023363
```

### 使用perfetto抓取trace

Android 9.0以上,支持设备端抓取trace,pull后网⻚查看的方法。

1. 开发者选项中,打开System Tracing(系统跟踪)设置;也可以开启Show Quick Setting tile,在下拉状态栏中添加抓取开关。

2. 抓取后,通过adb pull出trace文件。

```text
adb pull data/local/traces .
```

3. 打开网⻚ https://ui.perfetto.dev/#!/

4. 选择打开trace文件,即可查看抓取的相关数据

5. 选择 Open with legacy UI 可以查看旧格式的systrace

[Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/)

{% endraw %}
