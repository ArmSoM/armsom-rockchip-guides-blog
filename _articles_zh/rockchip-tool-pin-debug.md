---
title: "PinDebug：排查 Rockchip IOMUX、GPIO 与电压域配置"
description: "PinDebug 将管脚功能规划与目标板当前寄存器配置联系起来，适合排查接口因仍处于 GPIO 或其他复用功能而不能工作的问题。手册为 V1.1，本批下载分别为 Linux 1.11、Windows 1.18。"
excerpt: "PinDebug 将管脚功能规划与目标板当前寄存器配置联系起来，适合排查接口因仍处于 GPIO 或其他复用功能而不能工作的问题。手册为 V1.1，本批下载分别为 Linux 1.11、Windows 1.18。"
translation_key: "rockchip-tool-pin-debug"
slug: "rockchip-tool-pin-debug"
lang: "zh"
date: "2026-11-15"
author: "ArmSoM"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "PinDebug"]
---

{% raw %}

![PinDebug](/assets/rockchip-tools/flows/pin-debug-zh.svg)

PinDebug 将管脚功能规划与目标板当前寄存器配置联系起来，适合排查接口因仍处于 GPIO 或其他复用功能而不能工作的问题。手册为 V1.1，本批下载分别为 Linux 1.11、Windows 1.18。

## 先离线确认平台

搜索引脚前创建正确 SoC 工程。手册列出 RK3588、RK3566/3568、RV1126/1109、RV1106/1103、RK3528，不能据此扩展为 RK3576 或全部 ArmSoM 产品均支持。Pin 与 IOMUX 视图提供不同查找方式；右键功能可查看对应 I/O 命令，先核对再操作。

## 读取运行板状态

使用具备所需 ADB/调试能力的匹配 BSP，连接后读取 IOMUX 寄存器，与原理图和 DTS 对比。修改前记录当前值。连接状态下双击可能执行写入，不能把在线双击当作纯离线查看。

## 理解 GPIO 字段

此处 `ddr` 是 GPIO 方向，并非 DDR 内存；`dr` 为输出数据配置，`ext_port` 为观测到的端口电平。工具还提供上下拉、驱动强度与 `vsel`。电气修改前必须核对电压域及外部电路，寄存器值不能证明外设耐压。

## 将定位结果变成持久修复

确认冲突后，在 BSP 的 pinctrl/DTS 或对应驱动中实现正确配置。运行时寄存器改动会在重启后消失，也可能被驱动覆盖。支持时导出 GPIO 表，保留前后对比，验证冷启动、休眠唤醒与对应外设。

Linux 包因体积较大分为两卷，按下载入口说明还原后解压。没有英文原图的截图保留中文，不冒充英文界面。本文没有执行在线寄存器写入或调压。

## 适用范围与验证状态

本文依据本次工具包及原始资料整理。使用前核对具体板卡、SoC、载板、SDK/BSP 与主机架构。本次未执行烧录、生产配置、寄存器写入或硬件测试；提供下载不代表所有 ArmSoM 产品均支持。

## 工具下载、版本与 SHA-256

下载对应压缩包，校验哈希后完整解压。Linux PinDebug 分卷请先按链接中的说明还原；下方该项哈希对应合并后的完整文件。

| 主机 / 版本 | 下载包 |
|---|---|
| Linux / 1.11 | [pin_debug_tool_v1.11_for_linux.tar.gz](https://github.com/ArmSoM/rockchip-tools/blob/main/downloads/pin-debug/README.md) |
| Windows / 1.18 | [pin_debug_tool_v1.18_20250322_win.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/pin-debug/pin_debug_tool_v1.18_20250322_win.zip) |

**pin_debug_tool_v1.11_for_linux.tar.gz — SHA-256**

```text
16cb25b8fc2533e8f730a790c7486ab5042baa964b3bdb95a161ddce143c4a34
```

**pin_debug_tool_v1.18_20250322_win.zip — SHA-256**

```text
88c550ee9a578eaa451a9b8a05b3d088247dc63dd9bd426b832191994dc6a7d5
```

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## 资料依据与原图

- PinDebug_UserManual.pdf V1.1; Linux 1.11 and Windows 1.18 packages
- [原始 PDF: PinDebug_UserManual.pdf](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/manuals/1cae2e2c0777.pdf)

插图直接提取自标明的原始 PDF。只有中文原图时保留原界面文字，图注按语言整理；这些是历史示例，不是本次 ArmSoM 测试截图。

![原手册插图 · PinDebug](/assets/rockchip-tools/pin-debug/zh-p02-01.png)

PinDebug_UserManual.pdf · p. 2

![原手册插图 · PinDebug](/assets/rockchip-tools/pin-debug/zh-p02-02.png)

PinDebug_UserManual.pdf · p. 2

![原手册插图 · PinDebug](/assets/rockchip-tools/pin-debug/zh-p03-01.png)

PinDebug_UserManual.pdf · p. 3

## 继续阅读相关流程

- [Rockchip Linux Pinctrl 完整指南：GPIO、IOMUX、驱动强度与 DTS](/zh/articles/116-rockchip-linux-pinctrl/)
- [USB SQ Tool 1.5：从 USB 眼图排查到 PHY 参数与代码生成](/zh/articles/rockchip-tool-usb-sq-tool/)
- [Rockchip 工具下载与使用指南索引](/zh/articles/rockchip-tools-download-guide/)

## 查找准确的 ArmSoM 板卡资料

板卡、载板与接口要求先以产品手册为准。以下链接是平台参考，不表示该归档工具已在这些产品上验证。

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
