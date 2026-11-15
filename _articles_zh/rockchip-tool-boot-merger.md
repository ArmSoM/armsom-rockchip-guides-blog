---
title: "boot_merger 使用流程：正确组合 DDR、下载代码与 Loader"
description: "boot_merger 将早期启动组件打包为 Loader，位于固件烧录之前；生成 Loader 本身不会写入板卡。当前下载包主要提供程序和修订说明，没有完整独立使用手册。"
excerpt: "boot_merger 将早期启动组件打包为 Loader，位于固件烧录之前；生成 Loader 本身不会写入板卡。当前下载包主要提供程序和修订说明，没有完整独立使用手册。"
translation_key: "rockchip-tool-boot-merger"
slug: "rockchip-tool-boot-merger"
lang: "zh"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "boot_merger"]
---

{% raw %}

![boot_merger](/assets/rockchip-tools/flows/boot-merger-zh.svg)

`boot_merger` 将早期启动组件打包为 Loader，位于固件烧录之前；生成 Loader 本身不会写入板卡。当前下载包主要提供程序和修订说明，没有完整独立使用手册。

## 输入必须来自同一板卡 SDK

Loader 可能组合 DDR 初始化、USB 下载组件和启动代码。Rockchip 官方 `rkbin` 的 RK3588 配置展示了 `[CODE471_OPTION]`、`[CODE472_OPTION]`、`[LOADER_OPTION]`、`[OUTPUT]` 等段，`FlashData` 与 `FlashBoot` 指向不同组件。应沿用板卡 SDK 配置，不能仅凭文件名包含相同 SoC 就随意混搭。

## 可追溯的打包流程

1. 确认板卡版本、内存类型和容量、SoC、目标存储，先保留可正常启动的 Loader。
2. 把 SDK 的配置和引用的二进制文件完整复制到独立构建目录，核对相对路径所依赖的工作目录。
3. 选择对应主机工具，并采用 SDK 给出的调用方式。本批 Linux 修订记录到 1.35，macOS 标注 1.3，Windows 标注 1.32，不能视为同步版本。
4. 检查返回状态、输出路径、长度和哈希，将配置与输入组件版本一并归档。
5. 在具备恢复手段的开发板上按手册验证，明确区分下载到 RAM 与写入存储中的 IDBlock。

## 版本差异影响什么

Linux 修订记录涉及 IDBlock 对齐、2K 交错以及 CRC 相关选项。这些关系到启动格式，不只是文件名变化；不能未经核对就把格式开关移植到另一套 BSP。

## 失败时从输入回溯

找不到文件应先检查路径与配置；能打包但 DDR 初始化失败，应回查内存对应组件。打包成功不代表目标板能够启动。保留已知可用 Loader 和恢复路径。本文提供准备、打包核对与验证流程，不编造原资料未提供的命令参数。

## 适用范围与验证状态

本文依据本次工具包及原始资料整理。使用前核对具体板卡、SoC、载板、SDK/BSP 与主机架构。本次未执行烧录、生产配置、寄存器写入或硬件测试；提供下载不代表所有 ArmSoM 产品均支持。

## GitHub 工具目录、版本与 SHA-256

打开 GitHub 对应目录后选择所需平台和版本，再校验文件哈希并完整解压。下方链接均为仓库目录入口。

[前往 GitHub 对应工具目录](https://github.com/ArmSoM/rockchip-tools/tree/main/downloads/boot-merger)

| 平台 / 版本 | 文件 | SHA-256 |
|---|---|---|
| Linux / 1.35 release notes | `boot_merger-linux-directory-snapshot.zip` | `185fb0b12c95317f70a683919f36486153e7219a60c30bd3c9ef0a5019783bbb` |
| macOS / 1.3 | `boot_merger_v1.3_mac.zip` | `c9427f5e6448c610dae2e450ad1e245d03c39fd36756bbb02b78f20a0228f64f` |
| Windows / 1.32 | `boot_merger_v1.32.zip` | `00e12d8683c73c62df0d10102d284407721ab90310d10da23e8e090cdac124f9` |

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## 资料依据与原图

- boot_merger Linux revison.log through 1.35; macOS 1.3 and Windows 1.32 package notes
- [https://github.com/rockchip-linux/rkbin/blob/master/RKBOOT/RK3588MINIALL.ini](https://github.com/rockchip-linux/rkbin/blob/master/RKBOOT/RK3588MINIALL.ini)

## 继续阅读相关流程

- [rk_ddrbin_tool：读取和修改 DDR 初始化参数](/zh/articles/rockchip-tool-ddrbin-tool/)
- [RKDevTool 下载与使用：Loader、分区镜像和整包固件烧录](/zh/articles/rockchip-tool-rkdevtool/)
- [afptool 与 rkImageMaker：理解并打包 Rockchip update.img](/zh/articles/rockchip-tool-firmware-pack-tools/)
- [Rockchip 工具下载与使用指南索引](/zh/articles/rockchip-tools-download-guide/)

## 查找准确的 ArmSoM 板卡资料

板卡、载板与接口要求先以产品手册为准。以下链接是平台参考，不表示该归档工具已在这些产品上验证。

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
