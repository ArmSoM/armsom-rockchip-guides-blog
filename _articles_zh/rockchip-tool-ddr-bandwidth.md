---
title: "DDR Bandwidth Tool：测量 Rockchip 内存带宽并读懂统计指标"
description: "DDR 带宽工具帮助判断视频、AI、显示任务的内存流量。它观察控制器计数器，不是内存稳定性测试，也不能把 MB/s 直接当作应用性能分数。"
excerpt: "DDR 带宽工具帮助判断视频、AI、显示任务的内存流量。它观察控制器计数器，不是内存稳定性测试，也不能把 MB/s 直接当作应用性能分数。"
translation_key: "rockchip-tool-ddr-bandwidth"
slug: "rockchip-tool-ddr-bandwidth"
lang: "zh"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "DDR Bandwidth Tool"]
---

{% raw %}

![DDR Bandwidth Tool](/assets/rockchip-tools/flows/ddr-bandwidth-zh.svg)

## DDR 带宽工具 V1.4.1 完整手册

原稿将 monitor 定义为监视和统计各 DDR 命令的功能。封面产品表写“所有芯片/所有内核”，但正文要求以实际工具帮助输出确认支持平台，因此不据此宣称所有 ArmSoM 板卡可用。下面覆盖名词、平台、参数、使用条件、打印说明和 FAQ 六章。

### 1–3. 平台与参数

```text
rk-msch-probe_vx.xx -h

Usage: [-c chip_name -d msecs -f freq -h help]
-c chip_name:
'rk312x' include rk3126,rk3128 and px3se
'rk322x' include rk3128h,rk3228a,rk3228b and rk3229
...
[option] -d msecs for sampling interval
[option] -f freq mean current ddr frequency unit MHz
-h for help
```

`-c` 是工具识别的平台名，如 `rk3326`；`-d` 是毫秒采样间隔，缺省 1000 ms；`-f` 是当前 DDR 频率，单位 MHz，工具每个周期尝试自动读取，失败时手动指定；`-h` 查看帮助。先固定 DDR 频率再测，否则中途变频会使结果失准。帮助示例将 `rk3128h` 列在 `rk322x` 下，保留原稿写法，不擅改成另一芯片。

### 4. 使用条件与频率单位

```text
echo userspace > /sys/class/devfreq/dmc/governor
echo 780000000 > /sys/class/devfreq/dmc/userspace/set_freq
```

DDR devfreq 策略不能是 `dmc_ondemand`，手册推荐 `userspace`。第二行是 780 MHz 的原文示例，sysfs 写入单位为 Hz，与 `-f` 的 MHz 不同；并非所有板卡都有此路径或频点。若出现以下错误，该周期结果应丢弃。错误示例里的 `cat sys/...` 少了开头 `/`，下面保留日志原样，实际检查用上面的绝对路径。

```text
Error: The DDR monitor time gets error!!!
Please check the devfreq governor is not 'dmc_ondemand'!!!
For example:
# cat sys/class/devfreq/dmc/governor
# dmc_ondemand
Please switch the devfreq governor to others, such as 'userspace'.
For example:
# echo userspace > /sys/class/devfreq/dmc/governor
Delete the result of this time!
```

### 5. 输出样例和全部指标

以下是厂商原文输出，不是 ArmSoM 实测。普通平台按通道打印，RK3588 以 ALL 与 CH0–CH3 展示。

```text
V1.06_20200629
ddr freq: 928Mhz
CH0:
ddr monitor statistics:
ddr load = 3251.23MB/s(43.76%) [RD:1859.93MB/s(25.03%), WR:1391.30MB/s(18.72%), ACT(access : active): 3.34, srex:0.54%, pdex:1.27%, clkstp:0.00%, lp:1.81%]

ddr freq: 2133Mhz
===========ALL=============CH0===============CH1==============CH2===============CH3========
LOAD:  4.51MB/s(0.03%),  1.23MB/s(0.04%),  1.13MB/s(0.03%),  1.16MB/s(0.04%),  1.00MB/s(0.03%)
RD:    2.57MB/s(0.02%),  0.74MB/s(0.02%),  0.65MB/s(0.02%),  0.67MB/s(0.02%),  0.51MB/s(0.02%)
WR:    1.94MB/s(0.01%),  0.49MB/s(0.02%),  0.48MB/s(0.02%),  0.49MB/s(0.02%),  0.48MB/s(0.01%)
===========================================================================================
```

| 指标 | 含义 |
|---|---|
| `ALL` | 所有通道总计 |
| `CHx` | 通道 x |
| `load / LOAD` | 该通道所有 bank 的带宽和负载 |
| `RD / WR` | 所有 bank 的读/写带宽及占比 |
| `PRE` | precharge 占总命令比例；与 active 配对，无独立硬件统计，直接取 active 计数 |
| `ACT(access : active)` | 每个 active 后平均 read/write 数，越大代表地址访问越连续 |
| `srex` | self-refresh 时间占比 |
| `pdex` | power down 时间占比 |
| `clkstp` | clock stop 时间占比 |
| `srpdex` | self-refresh power down 时间占比 |
| `dsmex` | Deep Sleep Mode 时间占比 |
| `lp / LOW POWER` | 低功耗总时间占比，包含 self-refresh、power down、clock stop 等 |

### 6. /dev/mem 不存在

```text
rk3568:/ # rk-msch-probe_vx.xx -c rk356x
open /dev/mem error: No such file or directory
```

原因是内核未启用 `CONFIG_DEVMEM`，工具无法访问寄存器。方式一：在实际使用的配置（原文举 `android-11.config`）加入 `CONFIG_DEVMEM=y`，重新编译固件。方式二：`make menuconfig` 搜索 DEVMEM，启用后重编内核，避免覆盖已有配置。该接口涉及物理内存访问，是否启用应结合系统权限和部署要求决定。

```text
Symbol: DEVMEM [=y]
Type  : bool
Prompt: /dev/mem virtual device support
Location:
    -> Device Drivers
(1)   -> Character devices
  Defined at drivers/char/Kconfig:10

[*] /dev/mem virtual device support
```

## 适用范围与验证状态

本文依据本次工具包及原始资料整理。使用前核对具体板卡、SoC、载板、SDK/BSP 与主机架构。本次未执行烧录、生产配置、寄存器写入或硬件测试；提供下载不代表所有 ArmSoM 产品均支持。

## GitHub 工具目录、版本与 SHA-256

打开 GitHub 对应目录后选择所需平台和版本，再校验文件哈希并完整解压。下方链接均为仓库目录入口。

[前往 GitHub 对应工具目录](https://github.com/ArmSoM/rockchip-tools/tree/main/downloads/ddr-bandwidth)

| 平台 / 版本 | 文件 | SHA-256 |
|---|---|---|
| Linux target / manual 1.4.1 | `ddr-bandwidth-linux-directory-snapshot.zip` | `198ec5ad23aedee97518936fb4c2810f3d92c415269fad56788e833811af612d` |

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## 资料依据与原图

- Rockchip_Introduction_DDR_Bandwidth_Tool_CN.pdf

## 继续阅读相关流程

- [Rockchip DDR 完整开发指南：频率、容量、验证、眼图与 ECC](/zh/articles/037-rockchip-ddr/)
- [DDR_UserTool 1.41：为板卡选择 DDR 测试配置](/zh/articles/rockchip-tool-ddr-user-tool/)
- [Rockchip 工具下载与使用指南索引](/zh/articles/rockchip-tools-download-guide/)

## 查找准确的 ArmSoM 板卡资料

板卡、载板与接口要求先以产品手册为准。以下链接是平台参考，不表示该归档工具已在这些产品上验证。

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
