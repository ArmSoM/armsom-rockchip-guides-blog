---
title: "Rockchip Android日志系统：异常抓取、内核panic与日志管理"
description: "Rockchip Android日志系统：异常抓取、内核panic与日志管理"
excerpt: "Rockchip Android日志系统：异常抓取、内核panic与日志管理"
translation_key: "258-rockchip-android-log-system"
slug: "258-rockchip-android-log-system"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android", "log", "panic"]
---

{% raw %}

# Rockchip Android日志系统：异常抓取、内核panic与日志管理

ArmSoM平台参考：完整整理8页中文原稿《Rockchip Android LOG系统介绍》。文件名未标语言，但正文为中文，无独立英文原稿；英俄德完整翻译，四语共用4张中文标注的原始截图，并附本地化操作说明。封面标V1.1.0，而原稿内部最后技术版本为v1.2.0；保留这一版本不一致说明，以实际正文为准。下表为原稿支持范围，不表示所有ArmSoM板卡都经过实测。

| 产品 | 内核 |
| --- | --- |
| ALL | linux-5.10 |

## RK LOG系统概述

RK Log系统是一套由异常事件触发的日志系统，主要解决以下问题。

1. 在user版本下可用。为避免产生过多日志，异常日志只在异常发生时生成；下文还单独说明启动记录。

2. 内核panic并重启后，保存上次panic的内核信息。

3. Android启动后，对system crash、ANR、watchdog、lowmem、tombstone等Android异常抓取相关日志。

4. 所有日志保存在`/data/user_de/0/com.android.shell/files/bugreports`。可以通过adb抓取，或复制到U盘、SD卡。使用U盘/SD卡时，请使用Android原生Files文件管理器。首先启用开发者选项，再按下面原图操作。

操作1：进入设置，点击Storage。

![操作1：进入设置，点击Storage。](/docs/rockchip-android-log-system/assets/unspecified-p003-figure-01.png)

操作2：在Storage中点击Documents & other，进入文档浏览。

![操作2：在Storage中点击Documents & other，进入文档浏览。](/docs/rockchip-android-log-system/assets/unspecified-p004-figure-01.png)

操作3：在Documents界面点击左上角菜单按钮，或从左向右滑动打开菜单。

![操作3：在Documents界面点击左上角菜单按钮，或从左向右滑动打开菜单。](/docs/rockchip-android-log-system/assets/unspecified-p005-figure-01.png)

操作4：点击Bug reports列出已抓取的日志；可在文件管理器中复制或删除。删除前确认所需日志已经成功导出。

![操作4：点击Bug reports列出已抓取的日志；可在文件管理器中复制或删除。删除前确认所需日志已经成功导出。](/docs/rockchip-android-log-system/assets/unspecified-p006-figure-01.png)

5. 根目录中的`bugreports`软链接指向`/data/user_de/0/com.android.shell/files/bugreports`，因此可以直接访问`/bugreports/`抓取文件：

```text
rk3588_s:/ $ ls bugreports -l
lrw-r--r-- 1 root root 50 2022-09-16 07:36 bugreports -> /data/user_de/0/com.android.shell/files/bugreports
```

## 使用指南

每次异常触发的日志生成一个日期开头的zip文件。按时间排序即可找到最近触发的日志，例如：

```text
rk3588_s:/ $ ls bugreports/
2023-03-14-10-04-27-SYSTEM_BOOT.zip  2023-03-14-10-04-30-TOMBSTONE.zip
2023-03-14-10-04-34-TOMBSTONE.zip  2023-03-14-10-04-39-system_app_crash.zip
```

### 启动与Android重启

开机时生成一次启动日志：

```text
rk3588_s:/ $ ls bugreports/
2023-03-14-10-04-27-SYSTEM_BOOT.zip
```

晚于该文件时间的文件对应本次开机后产生的日志。如果Android重启，则生成名称含SYSTEM_RESTART的文件：

```text
rk3588_s:/ $ ls bugreports/
2023-03-14-09-12-03-SYSTEM_RESTART.zip
```

可通过这些文件名判断系统开机和Android重启时间。

### 内核重启和卡死

这里关注内核重启与卡死。原稿所述RK默认配置仅在某些场景（如segment fault）发生panic重启；hard lock、soft lock、rcu stall等可能一直卡死。如果可以连接串口，使用串口上的fiq工具抓取更多日志；若不便连接串口，原稿建议启用以下配置，使系统重启后收集日志：

```diff
+CONFIG_BOOTPARAM_HUNG_TASK_PANIC=y
+CONFIG_BOOTPARAM_SOFTLOCKUP_PANIC=y
+CONFIG_BOOTPARAM_HARDLOCKUP_PANIC=y
+CONFIG_BOOTPARAM_RCU_STALL_PANIC=y
```

原稿提供的补丁和SDK默认只在user版本启用这些配置。userdebug版本如需启用，应在`arch/arm64/configs/rockchip_defconfig`中添加相应配置。异常日志示例：

```text
rk3588_s:/ $ ls bugreports/
2022-09-24-09-58-10-kernel_panic.zip
```

该压缩包包含panic的具体内核日志。

### Android异常类型

| 异常 | 含义 |
| --- | --- |
| TOMBSTONE | native层crash |
| system_server_crash | 系统服务crash |
| system_server_anr | 系统服务ANR |
| system_server_lowmem | 低内存 |
| system_server_watchdog | system_server watchdog异常 |
| SYSTEM_RESTART | Android重启 |
| system_app_crash | 系统app强制关闭 |
| system_app_anr | 系统app ANR |
| system_server_wtf | Android框架严重错误；wtf为What a Terrible Failure |
| data_app_anr | 用户安装app ANR |
| data_app_crash | 用户安装app crash |
| data_app_wtf | 用户安装app wtf |

属性`persist.sys.rklog.level`控制抓取的异常。值为0时不抓取Android层异常日志，只保留内核panic异常日志；默认值为7。定义如下：

```c
enum {
    DROPBOX_SYSTEM_SERVER_CRASH = 1,
    DROPBOX_SYSTEM_SERVER_ANR = 2,
    DROPBOX_SYSTEM_SERVER_LOWMEM = 3,
    DROPBOX_SYSTEM_SERVER_WATCHDOG = 4,
    DROPBOX_SYSTEM_RESTART = 5,
    DROPBOX_SYSTEM_APP_CRASH = 6,
    DROPBOX_SYSTEM_APP_ANR = 7,
    DROPBOX_SYSTEM_SERVER_WTF = 8,
    DROPBOX_SYSTEM_APP_WTF = 9,
    DROPBOX_DATA_APP_ANR = 10,
    DROPBOX_DATA_APP_CRASH =11,
    DROPBOX_DATA_APP_WTF = 12,
    DROPBOX_MAX_ENTRY,
};
```

`persist.sys.rklog.level=7`表示枚举中DROPBOX_SYSTEM_APP_ANR及之前的dropbox类型都会触发日志，是顺序阈值而非位掩码。tombstone默认触发，除非`persist.sys.rklog.level=0`。上面的枚举还包含正文类型列表未单列的DROPBOX_SYSTEM_APP_WTF=9；保留其原始定义。异常类型写入日志文件名，例如：

```text
2022-09-24-09-58-17-SYSTEM_BOOT.zip     2022-09-24-09-58-10-kernel_panic.zip
2022-09-24-09-55-10-system_app_crash.zip   2022-09-24-09-58-24-system_app_crash.zip
2022-09-24-09-55-16-system_app_crash.zip   2022-09-24-10-01-24-system_app_crash.zip
```

### 空间限制与清理

日志保存在`/data/user_de/0/com.android.shell/files/bugreports`。原稿将日志系统产生文件的大小限制在约300M，可用属性`dumpstate.max_log_size`设置，单位为M；例如200表示200M。修改默认属性可编辑`frameworks/native/cmds/dumpstate/dumpstate.rc`。超过大小限制时删除最早的日志。可按文件名中的日期筛选。原稿建议抓取所需日志后清理目录；执行删除前应先验证导出文件完整并保留必要备份。

### 重复异常去重

为避免同一异常不断触发大量日志，系统会检查本次开机后是否已出现相同异常。如已出现，则5分钟后才再次生成。例如同一位置反复产生相同的system_server_wtf，5分钟内只生成一次日志。

## 使用边界

这些行为和默认值对应原稿的SDK/补丁及linux-5.10，不是所有Android或ArmSoM固件的统一保证。启用panic配置会把部分卡死转为重启，影响可用性并可能丢失未保存数据，应在匹配的内核版本上验证。配置块开头的`+`是补丁新增行标记，不是配置项名称的一部分。日志可能含设备标识、应用数据和其他敏感信息，导出与共享前应审查并妥善保护。本文未执行配置修改、故障注入、文件删除或硬件测试。

[Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/)

{% endraw %}
