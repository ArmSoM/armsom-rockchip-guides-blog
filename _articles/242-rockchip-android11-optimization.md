---
title: "Rockchip Android 11 Optimization: Boot, Performance, Memory and Analysis"
description: "Rockchip Android 11 Optimization: Boot, Performance, Memory and Analysis — V1.0.0, ART, ZRAM, bootchart, Perfetto"
excerpt: "Rockchip Android 11 Optimization: Boot, Performance, Memory and Analysis"
translation_key: "242-rockchip-android11-optimization"
slug: "242-rockchip-android11-optimization"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android11", "optimization", "ART"]
---

{% raw %}

# Rockchip Android 11 Optimization: Boot, Performance, Memory and Analysis

ArmSoM platform reference, preserving the full Chinese Rockchip Android Platform Optimization Guide 1.0.0 (document 290, 10 pages). Its filename specifies Android 11, but examples also cover RK3399 Android 7.1/Linux 4.4, Linux 4.19, Android 8.1+ and RK3568; do not treat them as one BSP patch set. English, Russian and German translate the sole Chinese source. It contains no technical figures, so none are invented. No ArmSoM or other hardware was tested; all timing, score and memory figures are source examples.

## Applicability and source caveats

- There is no English edition to compare. Check each historical example against its kernel, governor, DTS, init syntax, ART and SDK; nodes may not exist in another BSP. Do not disable AVB or weaken SELinux in production for performance. The source explicitly requires keeping ftrace for CTS. Remove drivers only for absent hardware; asynchronous initialization and .ko loading require dependency/order validation.
- Higher touch-boost frequencies and lower target_loads affect power and heat. Pinner consumes unreclaimable memory; be cautious with small DDR. The source single-core wording contrasted with RK3399 big/LITTLE is ambiguous: inspect CPU policy topology rather than assume one cluster means one physical core.
- file_contexts/genfs_contexts are not interchangeable without considering filesystem/labeling applicability. A 32-bit system must still satisfy application ABI, certification and product requirements.
- ART prose names speed-profile, while comments for PRODUCT_DEXPREOPT_SPEED_APPS and PRODUCT_SYSTEM_SERVER_APPS specify speed. These filters are not silently equated. `TARGET_ARCH_VARIANT := armv8-2a` is preserved; verify that SDK accepts it.
- All four tables are source examples, not controlled A/B tests. The Pinner table also changes Android version. Honor of Kings 1.9G installation is approximately 1:44 to 1:31; FilesGoogle with DDR 3G/630MHz approximately 2000ms to 1100ms; 1GB optimization after one idle minute approximately 320MB to 450M. No missing methodology or guaranteed benefit is invented.
- Code retains original comments/commits; two cross-page patches were joined and PDF-only line wraps repaired. `...`, `do_something` and `xxxxx` remain placeholders, not complete executable patches. The explanatory sentence inside the bootchart block was moved out and translated. No flashing, system modification or monkey tests were performed.

## 1. U-Boot

Remove unused U-Boot features to reduce loading time. The source also proposes disabling loader/U-Boot serial logging and, according to requirements, AVB verification. The following settings enable U-Boot AVB. Disabling verification weakens the verified-boot trust chain; this is not a recommendation for production or certified devices.

```text
CONFIG_ANDROID_AVB=y
CONFIG_AVB_LIBAVB=y
CONFIG_AVB_LIBAVB_AB=y
CONFIG_AVB_LIBAVB_ATX=y
CONFIG_AVB_LIBAVB_USER=y
CONFIG_RK_AVB_LIBAVB_USER=y
```

## 2. Kernel

### Boot-time optimization

#### Preparation: measure kernel startup

Start with the first kernel log:

```text
[    0.000000] Booting Linux on physical CPU 0x0000000000 [0x412fd050]
```

End when kernel loading finishes:

```text
[    1.259604] Freeing unused kernel memory: 3136K
```

The interval between the two logs approximates kernel startup time. `CONFIG_RK_CONSOLE_THREAD` is enabled by default to reduce serial-output impact, so timestamps are not 100% precise but broadly reflect elapsed time.

#### Measure each driver's initialization

Add `initcall_debug` to bootargs to measure driver loading. This RK3568 patch enables the diagnostic output:

```text
+++ b/arch/arm64/boot/dts/rockchip/rk3568-android.dtsi
@@ -6,7 +6,7 @@

 / {
        chosen: chosen {
-               bootargs = "earlycon=uart8250,mmio32,0xfe660000 console=ttyFIQ0";
+               bootargs = "earlycon=uart8250,mmio32,0xfe660000 console=ttyFIQ0 initcall_debug loglevel=8";
        };
```

#### Find and optimize slow drivers

Two ways to remove a driver module:

1. Disable its kernel config. This is the only option for modules without DTS nodes, including some kernel debugging features.

2. Disable its DTS node. Removing config also reduces kernel size, not just initialization time, but prevents reuse of that kernel for different hardware via different device trees. If the hardware definitely never uses a module, excluding it from compilation is appropriate. The following initcall logs illustrate slow drivers.

```text
[    3.723183] initcall rknand_driver_init+0x0/0x40 returned -1 after 2261968 usecs
```

NAND takes about 2.2s. If NAND is not required, remove `CONFIG_RK_NAND`.

```text
[    3.212658] ov5695 4-0036-1: Unexpected sensor id(000000),ret(-5)
[    3.213655] probe of 4-0036-1 returned 0 after 599822 usecs

... ...

[    3.052600] gc8034 4-0037: gc8034 read reg:0xf0 failed !
[    3.852833] gc8034 4-0037: gc8034 read reg:0xf1 failed !
[    3.852874] gc8034 4-0037: Unexpected sensor id(000000), ret(-6)
[    3.853169] probe of 4-0037 returned 0 after 1598844 usecs
```

ov5695 and gc8034 sensor ID reads fail. If these sensors are physically absent, remove `CONFIG_VIDEO_GC8034` and `CONFIG_VIDEO_OV5695`, or disable their DTS nodes.

```text
[    0.412736] calling  tracer_init_tracefs+0x0/0x1d4 @ 1
[    0.524499] initcall tracer_init_tracefs+0x0/0x1d4 returned 0 after 109063 usecs
```

This corresponds to `CONFIG_TRACING`. Tracing supports performance debugging but increases image size and initialization time. The source proposes removing `CONFIG_FTRACE` and `CONFIG_TRACING` in shipping builds, potentially reducing other modules' startup time too. However, the CTS warning below takes precedence for CTS users. Linux 4.19 needs this patch to avoid a build error after removal:

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

Warning: CTS users must not modify ftrace. Removing it prevents systrace and related functions and causes CTS failures.

Tailor kernel trimming to actual hardware; the examples concern optional modules. For required modules with long startup, consider the following two approaches.

1. Move expensive operations into Linux work items for parallel execution without blocking driver initialization.

2. Consider loading the driver as a `.ko` module.

### Performance optimization

### Touch boost

Touch/mouse activity raises CPU speed. Defaults normally avoid maximum frequency to balance power and performance. For latency-sensitive workloads, the source suggests raising the relevant frequency to its maximum; this RK3399 Linux 4.4 example illustrates it. Check thermal and power limits first.

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

RK3399 has big/LITTLE cores, so the example changes two places. For the source's single-core/single-policy case, change this branch:

```text
if (policy->cpu == 0)
```

Apply the change inside that branch.

### CPU target_loads

In addition to the chosen frequency governor, Linux scales frequency with load. `target_loads` defines the governing load threshold at this node:

```text
/sys/devices/system/cpu/cpufreq/policy0/interactive/target_loads
```

A lower value makes higher frequencies easier to reach. The described default is 90: at each frequency, 90% load triggers an increase. Lower values can favor responsiveness at a power cost. Most products need both, so set load targets for multiple frequency points. The following RK3399 Android 7.1 patch demonstrates this balance.

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

For details about target_loads, see kernel `Documentation/cpu-freq/governors.txt`.

## 3. Android

### Boot-time optimization

`init.rc` supports fixed CPU/DDR frequencies during boot by default; the source reports a noticeable startup improvement.

For additional actions, add to `init.rc`:

```text
on early-init
    do_something

on property:sys.boot_completed=1
    do_some_resume
```

### Improve I/O efficiency

Boot involves substantial sequential I/O. Read-ahead tuning can improve throughput and boot time. The SDK example uses `mmcblk2` and several heavily read partitions. Verify actual device partitions and apply analogous changes to additional heavily read partitions.

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

DTS can bind the EMMC initialization order:

```text
aliases {
    mmc0 = &sdmmc0;
    mmc1 = &sdmmc1;
    mmc2 = &sdhci;
    mmc3 = &sdmmc2;
};
```

#### Check for abnormal service waits during boot

Correlate bootchart with boot logs. If one task executes on a single thread, determine whether it blocks the boot sequence.

### Optimize SELinux policy

The source describes labeling device nodes through file_contexts or genfs_contexts and contrasts them as follows. Their actual applicability depends on filesystem and policy context; they are not freely interchangeable.

1. file_contexts supports regular-expression matching, but the source describes it as slower.

2. genfs_contexts does not support regular expressions and is described as faster. Avoid unnecessary wildcard matching and use genfs_contexts where applicable to reduce policy-loading time.

### Performance optimization

### Pinner Service

Android 7.1 and later can pin selected modules in memory to avoid repeated eviction/reloading. Rockchip Android 11 preconfigures frequently used modules under:

```text
vendor/rockchip/common/apps:
RockchipPinnerService
```

This app is an overlay module; the build automatically distinguishes 32-bit and 64-bit systems. Enable it by adding to `device.mk`:

```text
PRODUCT_PACKAGES += RockchipPinnerService
```

1. For Android 10.0 and earlier, consult this APK source and modify `config.xml` in frameworks/base directly, selecting 32-bit/64-bit files yourself.

2. Use `lsof` to inspect library use. The reference libraries are widely used by system_server and other processes, making pinning useful. Adding libraries blindly wastes memory and may reduce performance; tailor choices to the workload.

3. Pinning consumes memory; avoid trying it on devices with little DDR.

4. The source reports higher AnTuTu scores and suggests considering it when RAM is sufficient. Its comparison after enabling PinnerService on RK3399 “Excavator” follows; this also compares different Android versions and does not isolate the service's effect.

| Android version | AnTuTu score |
| --- | --- |
| android 10.0 | about 13w (130,000) |
| android 11.0 | about 14.3w (143,000) |

#### Workload-specific optimization

See the source's AOSP reference: https://source.android.com/devices/bootloader/boot-image-profiles

Warning: changing the profile after only one user scenario can instead slow device startup and APK execution.

### Use a 32-bit system

The source reports better overall responsiveness with 32-bit Android on low-capacity or low-frequency DDR devices. Add to `BoardConfig.mk`, after checking application and platform requirements:

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

### Configure ART compilation

The source proposes a core-app list and profile-guided compilation using `speed-profile` to improve launch/runtime performance. The examples below instead select the `speed` filter for listed apps; keep this distinction. The comments describe core apps, resident apps such as SystemUI only obtaining another profile-guided opportunity after reboot, and the possible benefit of always using AOT for them. System-server apps also default to speed.

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

Source launch-time comparison before/after enabling, DDR 3G/630MHz:

| FilesGoogle | Launch time: am start -S -W |
| --- | --- |
| PRODUCT_DEXPREOPT_SPEED_APPS not added | about 2000ms |
| PRODUCT_DEXPREOPT_SPEED_APPS added | about 1100ms |

The source says PRODUCT_SYSTEM_SERVER_APPS works better with a 32-bit system on low-frequency DDR devices.

Otherwise it may only increase system storage use without obvious benefit.

#### Manual compilation test

```text
adb shell cmd package compile -m speed-profile -f com.android.settings
```

#### Compilation threads and CPU affinity

From Android 11, compilation options allow multiple compiler threads on a chosen CPU set:

1. `dalvik.vm.boot-dex2oat-cpu-set`: CPUs for dex2oat threads during boot.

2. `dalvik.vm.image-dex2oat-cpu-set`: CPUs for dex2oat while compiling boot images.

3. `dalvik.vm.dex2oat-cpu-set`: CPUs for dex2oat threads after boot.

4. `dalvik.vm.dex2oat-threads`: multithreaded compilation. Example:

```text
PRODUCT_PRODUCT_PROPERTIES += \
    dalvik.vm.dex2oat-cpu-set=0,1,2,3 \
    dalvik.vm.boot-dex2oat-threads=4 \
    dalvik.vm.dex2oat-threads=4
```

Match the number of dex2oat threads to the selected CPU count to avoid unnecessary CPU and I/O contention.

Multiple threads can improve APK installation speed, particularly for large APKs. Source comparison:

| Honor of Kings (1.9G) | time adb install *.apk |
| --- | --- |
| N/A | about 1:44 |
| 4 threads | about 1:31 |

## 4. Low-memory device optimization

For 1GB devices, improve ZRAM utilization and periodically reclaim file caches and anonymous pages of background processes. The source reports an acceptable overall memory level for typical 1GB use. Obtain the patch archive below and apply it according to its README.

```text
RKDocs/android/patches/memory_optimization/MemoryReclaim_*.tar.gz
```

| Free memory after boot and one idle minute | adb shell dumpsys meminfo |
| --- | --- |
| N/A | about 320MB |
| After optimization | about 450M |

The archive includes some feature trimming; adjust it to actual product needs.

## 5. Analysis tools

### bootchart

bootchart analyzes Linux startup, collecting each process's start time and CPU/I/O activity and rendering an image. Android can use it too. Enable it manually with the following commands to identify costly services and target boot-time optimization; the source also refers to CPU/ROM resource use.

```text
adb shell 'touch /data/bootchart/enabled'
adb reboot
# 开机后，pull出相关数据⽂件
adb shell 'tar -czf /sdcard/bootchart.tgz /data/bootchart'
adb pull /sdcard/bootchart.tgz .
bootchart bootchart.tgz -o bootchart.png
```

The commands produce an image of service resource usage. Alternatively use the SDK script `./system/extras/boottime_tools/bootanalyze/bootanalyze.py -h`; add `-b` to capture bootchart.

### Adjust CPU/I/O priority and startup ordering to avoid simultaneous contention

Use `priority` and `ioprio` in init.rc to adjust CPU and I/O priorities. The source's privileged service example follows; these values are not a universal safe default.

```text
service xxxxx /vendor/bin/hw/xxxx
    user root
    group root system
    priority -20
    ioprio rt 0
    writepid /dev/cpuset/foreground/tasks
```

### Memory analysis

Android 11 kernels can collect dmabuf information to analyze DMA memory:

```text
cat /d/dma_buf/bufinfo
cat /d/dma_buf/bufprocs
```

The SDK adds a monkey option to capture dmabuf information under low-memory conditions. Use the following patch as reference and modify monkey to capture useful evidence when failures occur.

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

### Capture traces with Perfetto

Android 9.0 and later supports device-side tracing followed by pulling the file and viewing it in a browser.

1. Enable System Tracing in Developer options. Optionally enable Show Quick Setting tile to add a capture switch to the notification shade.

2. After capture, pull the trace file with adb:

```text
adb pull data/local/traces .
```

3. Open https://ui.perfetto.dev/#!/

4. Open the trace file to inspect the captured data.

5. The source's Open with legacy UI option displays old-format systrace. Interface availability may differ from the 2021 guide.

[Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/)

{% endraw %}
