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

DDR 带宽工具帮助判断视频、AI、显示任务的内存流量。它观察控制器计数器，不是内存稳定性测试，也不能把 MB/s 直接当作应用性能分数。

## 选择目标端程序与采样条件

包内有 32 位、64 位用户程序，应在目标板运行对应版本，而不是当作 Windows 主机工具。按实际文件名先查看帮助：

```text
./rk-msch-probe-for-user-64bit -h
```

原手册说明 `-c chip_name` 选择平台、`-d msecs` 指定采样间隔、`-f freq` 使用 MHz。手册通用文件名与当前包名不同，采样前核对 SoC 选择器与 BSP。

## 有意识地固定频率

原文要求测量期间避免 `dmc_ondemand`，并给出 userspace 示例：

```text
echo userspace > /sys/class/devfreq/dmc/governor
echo 780000000 > /sys/class/devfreq/dmc/userspace/set_freq
```

`780000000` 是单位为 Hz 的原例，不是所有板卡都推荐的频率。只能选择实际 BSP 支持的 OPP，保存原 governor 和频率以便恢复；`-f` 的单位则是 MHz。出现“DDR monitor time gets error”时，这次结果应丢弃。

## 正确理解输出

`ALL` 为全部通道汇总，`CHx` 为某个通道；`LOAD`、`RD`、`WR` 分别表示总、读、写流量及利用率。`ACT(access : active)` 表示每次激活后的访问次数，反映访问连续性。原文的 `PRE` 借用 active 统计推算，并非独立测量的预充电计数。低功耗字段表示时间占比，不是带宽。

## 怎样做有意义的对比

用相同 DDR 设置、固定采样时长，对比空闲与相同工作负载。记录 SoC、内存配置、内核、governor、频率、采样间隔和任务阶段。缺少 `/dev/mem` 可能是未启用 `CONFIG_DEVMEM`，应使用项目认可的调试内核，而不是随意放宽生产系统限制。本文没有 ArmSoM 实测带宽数据。

## 适用范围与验证状态

本文依据本次工具包及原始资料整理。使用前核对具体板卡、SoC、载板、SDK/BSP 与主机架构。本次未执行烧录、生产配置、寄存器写入或硬件测试；提供下载不代表所有 ArmSoM 产品均支持。

## 工具下载、版本与 SHA-256

下载对应压缩包，校验哈希后完整解压。Linux PinDebug 分卷请先按链接中的说明还原；下方该项哈希对应合并后的完整文件。

| 主机 / 版本 | 下载包 |
|---|---|
| Linux target / manual 1.4.1 | [ddr-bandwidth-linux-directory-snapshot.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/ddr-bandwidth/ddr-bandwidth-linux-directory-snapshot.zip) |

**ddr-bandwidth-linux-directory-snapshot.zip — SHA-256**

```text
198ec5ad23aedee97518936fb4c2810f3d92c415269fad56788e833811af612d
```

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## 资料依据与原图

- Rockchip_Introduction_DDR_Bandwidth_Tool_CN.pdf V1.4.1, pp.3–6; packaged 32/64-bit probes
- [原始 PDF: Rockchip_Introduction_DDR_Bandwidth_Tool_CN.pdf](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/manuals/35fc41c5ec2e.pdf)

## 继续阅读相关流程

- [Rockchip DDR 完整开发指南：频率、容量、验证、眼图与 ECC](/zh/articles/037-rockchip-ddr/)
- [DDR_UserTool 1.41：为板卡选择 DDR 测试配置](/zh/articles/rockchip-tool-ddr-user-tool/)
- [Rockchip 工具下载与使用指南索引](/zh/articles/rockchip-tools-download-guide/)

## 查找准确的 ArmSoM 板卡资料

板卡、载板与接口要求先以产品手册为准。以下链接是平台参考，不表示该归档工具已在这些产品上验证。

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
