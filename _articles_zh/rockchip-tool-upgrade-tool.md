---
title: "upgrade_tool 下载与使用：命令行烧录、设备选择和结果校验"
description: "upgrade_tool 提供 Rockusb 命令行操作，适合固定工作站流程。本次分别提供 Linux 2.44、macOS 2.13、Windows 2.46，按主机选择，不能把不同平台版本混为一谈。"
excerpt: "upgrade_tool 提供 Rockusb 命令行操作，适合固定工作站流程。本次分别提供 Linux 2.44、macOS 2.13、Windows 2.46，按主机选择，不能把不同平台版本混为一谈。"
translation_key: "rockchip-tool-upgrade-tool"
slug: "rockchip-tool-upgrade-tool"
lang: "zh"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "upgrade_tool"]
---

{% raw %}

![upgrade_tool](/assets/rockchip-tools/flows/upgrade-tool-zh.svg)

`upgrade_tool` 提供 Rockusb 命令行操作，适合固定工作站流程。本次分别提供 Linux 2.44、macOS 2.13、Windows 2.46，按主机选择，不能把不同平台版本混为一谈。

## 写入前先识别

正确供电，通过板卡手册进入 Loader/Maskrom。先列出设备，再在对应模式允许时查询信息。下列是检查命令，不是烧录流程：

```text
upgrade_tool ld
upgrade_tool rfi
upgrade_tool rci
upgrade_tool pl
```

`ld` 列设备，`rfi` 读存储信息，`rci` 读芯片信息，`pl` 读分区布局。识别不对时先排查驱动、数据线和模式。

## RAM 下载与持久写入

原手册的 Maskrom 下载示例如下，将升级代码加载到 RAM：

```text
upgrade_tool db rkxxloader.bin
```

示例文件名需换成对应板卡 Loader。`db` 不同于把 Loader 写入存储的 `ul`。写分区时，原手册先提供 parameter，再指定镜像：

```text
upgrade_tool di -p parameter.txt
upgrade_tool di -u uboot.img -b boot.img
```

这些命令会写存储，必须确认镜像、分区表、SoC、目标存储和备份。`-boot_a`、`-boot_b` 指定实际分区，不可套用到非 A/B 布局。整包升级使用：

```text
upgrade_tool uf update.img
```

## 多设备与擦除边界

原文使用 `ld` 返回的 LocationID 选择设备；这里的 `100` 只是示例，不是永久序列号：

```text
upgrade_tool -s 100 ul rkxxloader.bin
```

`wl`/`rl` 按原始存储范围操作，偏移和长度必须来自实际布局。`ef`/`el` 会擦除数据。V1.0 将 `el` 描述为 eMMC 操作，V1.1 扩充到 SPI NAND/NOR，不能把新版说明直接当作旧程序的能力。

## 结果与故障排查

逐条检查退出状态，保留设备身份和日志，成功写入后仍需验证冷启动和系统版本。镜像过大应修正分区布局，不能直接强行按地址写。固定的芯片标识错误应检查打包，偶发 USB 错误应检查连接和供电。本文没有执行设备操作。

## 适用范围与验证状态

本文依据本次工具包及原始资料整理。使用前核对具体板卡、SoC、载板、SDK/BSP 与主机架构。本次未执行烧录、生产配置、寄存器写入或硬件测试；提供下载不代表所有 ArmSoM 产品均支持。

## 工具下载、版本与 SHA-256

下载对应压缩包，校验哈希后完整解压。Linux PinDebug 分卷请先按链接中的说明还原；下方该项哈希对应合并后的完整文件。

| 主机 / 版本 | 下载包 |
|---|---|
| Linux / 2.44 | [upgrade_tool_v2.44_for_linux.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/upgrade-tool/upgrade_tool_v2.44_for_linux.zip) |
| macOS / 2.13 | [upgrade_tool_v2.13_for_mac.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/upgrade-tool/upgrade_tool_v2.13_for_mac.zip) |
| Windows / 2.46 | [upgrade_tool_v2.46.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/upgrade-tool/upgrade_tool_v2.46.zip) |

**upgrade_tool_v2.44_for_linux.zip — SHA-256**

```text
b779239cb1dc6cadd823520439e4163cf223145d048e6b5f9eaf1735b407cff8
```

**upgrade_tool_v2.13_for_mac.zip — SHA-256**

```text
d49db00e892b72a1760b9766b5e4ab998e75a17a37cb3acc8bf13b981b0ffc34
```

**upgrade_tool_v2.46.zip — SHA-256**

```text
de1dc7ce00ed5cfdaa0432f1c7e3efaf096e5dbb7e0ad851345739f6342c06dc
```

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## 资料依据与原图

- 命令行开发工具使用文档.pdf V1.0 (Linux/macOS packages), V1.1 (Windows package)
- [原始 PDF: 命令行开发工具使用文档.pdf](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/manuals/925b67105873.pdf)
- [原始 PDF: 命令行开发工具使用文档v1.1.pdf](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/manuals/8a7aa375abfc.pdf)

## 继续阅读相关流程

- [RKDevTool 下载与使用：Loader、分区镜像和整包固件烧录](/zh/articles/rockchip-tool-rkdevtool/)
- [Rockchip 存储应用完整说明：Flash、启动流程、分区、烧录与 Vendor Storage](/zh/articles/099-rockchip-storage-application/)
- [Rockchip 工具下载与使用指南索引](/zh/articles/rockchip-tools-download-guide/)

## 查找准确的 ArmSoM 板卡资料

板卡、载板与接口要求先以产品手册为准。以下链接是平台参考，不表示该归档工具已在这些产品上验证。

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
