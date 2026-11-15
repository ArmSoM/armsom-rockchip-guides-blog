---
title: "RKPCBATool 1.2.1：配置 Linux 板卡功能测试与人工判定"
description: "RKPCBATool 由 Windows 主机程序配合 Linux 目标端测试程序工作，可组织存储、无线、音频、按键等测试，但对应功能必须由 BSP 实现。它与旧版 Android PCBA 工具不是同一流程。"
excerpt: "RKPCBATool 由 Windows 主机程序配合 Linux 目标端测试程序工作，可组织存储、无线、音频、按键等测试，但对应功能必须由 BSP 实现。它与旧版 Android PCBA 工具不是同一流程。"
translation_key: "rockchip-tool-pcba-tool"
slug: "rockchip-tool-pcba-tool"
lang: "zh"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "RKPCBATool"]
---

{% raw %}

![RKPCBATool](/assets/rockchip-tools/flows/pcba-tool-zh.svg)

## PCBA 手册已经转成可阅读的四语正文

本工具包的中文 37 页、英文 43 页手册均为 RK-KF-YF-301 V1.2.0，与本站已有《Linux PCBA 测试开发指南》的主资料一致。因此复用已整理的完整正文，不把相同 80 页再复制成第二套重复文章。下面入口直接进入网页正文，没有 PDF 下载跳转。

完整教程覆盖：安装目录与 ADB 路径、JSON 测试项、自动/人工判定、重启配置、二次开发和发布、PCBA 软件架构、全部九张命令协议表、设备端代码与 rootfs/recovery 构建、带屏 PCBA 测试，以及安装错误、ADB forward、Windows 10、upload file fail 的排查。

[阅读完整 Linux PCBA 测试开发指南](/zh/articles/197-rockchip-linux-pcba/)

- 1. PCBA TEST Tool
- 2. PCBA软件设计说明
- 3. PCBA测试代码框架
- 4. 带屏的PCBA测试
- 5. 附录

### 工具版本与手册版本分开核对

包名 V1.2.1 与手册 V1.2.0、产品表里的 V1.7 含义不同，不能合并成一个版本。中文新版删除旧 camera 按钮章节，英文仍保留；完整教程已把它标为历史流程，并区分新自动 camera 测试。示例中的 RK3358、协议 TPYE/TYPE、CMD/RES 和代码路径差异有原文校对记录，不擅自改成看似正确的值。

## 适用范围与验证状态

本文依据本次工具包及原始资料整理。使用前核对具体板卡、SoC、载板、SDK/BSP 与主机架构。本次未执行烧录、生产配置、寄存器写入或硬件测试；提供下载不代表所有 ArmSoM 产品均支持。

## GitHub 工具目录、版本与 SHA-256

打开 GitHub 对应目录后选择所需平台和版本，再校验文件哈希并完整解压。下方链接均为仓库目录入口。

[前往 GitHub 对应工具目录](https://github.com/ArmSoM/rockchip-tools/tree/main/downloads/pcba-tool)

| 平台 / 版本 | 文件 | SHA-256 |
|---|---|---|
| Windows host + Linux target / 1.2.1 | `RKPCBATool_v1.2.1_20251226.zip` | `ec3747fa2360e8e1793920882d7ec51a4aa1087a4cfab5d3c218f677999440bc` |

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## 资料依据与原图

- Rockchip_Developer_Guide_Linux_PCBA_CN.pdf
- Rockchip_Developer_Guide_Linux_PCBA_EN.pdf

## 继续阅读相关流程

- [Rockchip Linux PCBA 测试开发指南](/zh/articles/197-rockchip-linux-pcba/)
- [Rockchip PCBA 测试工具开发指南](/zh/articles/252-rockchip-pcba-test-tool/)
- [RKDevInfoWriteTool：受控写入序列号与 MAC 信息](/zh/articles/rockchip-tool-devinfo-write/)
- [Rockchip 工具下载与使用指南索引](/zh/articles/rockchip-tools-download-guide/)

## 查找准确的 ArmSoM 板卡资料

板卡、载板与接口要求先以产品手册为准。以下链接是平台参考，不表示该归档工具已在这些产品上验证。

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
