---
title: "programmer_image_tool：将 update.img 转为 eMMC、SPI NOR 与 NAND 烧录器文件"
description: "programmer_image_tool 把打包固件转换为生产烧录器所需数据，在主机准备文件，本身不直接刷写连接的板卡。输出与存储类型及几何参数有关。"
excerpt: "programmer_image_tool 把打包固件转换为生产烧录器所需数据，在主机准备文件，本身不直接刷写连接的板卡。输出与存储类型及几何参数有关。"
translation_key: "rockchip-tool-programmer-image-tool"
slug: "rockchip-tool-programmer-image-tool"
lang: "zh"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "programmer_image_tool"]
---

{% raw %}

![programmer_image_tool](/assets/rockchip-tools/flows/programmer-image-tool-zh.svg)

`programmer_image_tool` 把打包固件转换为生产烧录器所需数据，在主机准备文件，本身不直接刷写连接的板卡。输出与存储类型及几何参数有关。

## eMMC 与 SPI NOR

原文示例分别为：

```text
./programmer_image_tool -i update.img -t emmc
```

```text
./programmer_image_tool -i update.img -t spinor
```

手册说明这两种情况生成 `out_image.bin`。仍需确认生产烧录器要求该原始布局，固件也必须对应具体产品。

## SPI NAND

```text
./programmer_image_tool -i update.img -b 256 -p 4 -t spinand -o out
```

原例 `-b 256` 为 256 KB block，`-p 4` 为 4 KB page，是 Flash 几何参数，不是性能调节值。输出写入目录，不能当作通用 eMMC 单文件互换。

## SLC NAND

```text
./programmer_image_tool -i update.img -b 256 -p 4 -s 256 -t slc -2 -o rockdev
```

示例增加 `-s 256`，代表 256 字节 spare/OOB，并原样保留 `-2`。简短手册未完整解释 `-2`，量产前需按匹配工具/烧录器说明核实含义，不猜测也不静默省略。

## 生产交接检查

记录固件哈希、工具版本、Flash 料号、block/page/OOB 和输出哈希。按烧录器文档确认坏块、ECC/OOB、启动放置处理；生成目录不代表已经正确配置这些行为。先烧指定样机，适用时回读，验证冷启动和存储。

Linux 1.26、Windows 1.28 分别提供，程序名前缀要匹配主机。Linux 手册有失效的本地图片引用，本文不声称已恢复该缺失截图。示例参数来自原文，不是 ArmSoM 验证的通用值。

## 适用范围与验证状态

本文依据本次工具包及原始资料整理。使用前核对具体板卡、SoC、载板、SDK/BSP 与主机架构。本次未执行烧录、生产配置、寄存器写入或硬件测试；提供下载不代表所有 ArmSoM 产品均支持。

## 工具下载、版本与 SHA-256

下载对应压缩包，校验哈希后完整解压。Linux PinDebug 分卷请先按链接中的说明还原；下方该项哈希对应合并后的完整文件。

| 主机 / 版本 | 下载包 |
|---|---|
| Linux / 1.26 | [programmer_image_tool_v1.26_linux.tar.gz](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/programmer-image-tool/programmer_image_tool_v1.26_linux.tar.gz) |
| Windows / 1.28 | [programmer_image_tool_v1.28.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/programmer-image-tool/programmer_image_tool_v1.28.zip) |

**programmer_image_tool_v1.26_linux.tar.gz — SHA-256**

```text
ea38df34e97cd697aa53d09af06fa1ff2b0847fe2c9699c49d1890509cc5c0d0
```

**programmer_image_tool_v1.28.zip — SHA-256**

```text
696d07d8232a637ef59b724d0c0522e500fc9f26571c2633d96271ffce48e56f
```

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## 资料依据与原图

- programmer_image_tool 1.26 Linux / 1.28 Windows; both bundled usage PDFs
- [原始 PDF: user_manual.pdf](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/manuals/454e7646c90d.pdf)
- [原始 PDF: user_manual.pdf](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/manuals/47ce51e919d3.pdf)

## 继续阅读相关流程

- [Firmware_Merger：Flat RK、Flat GPT 与 Compact GPT 固件打包](/zh/articles/rockchip-tool-firmware-merger/)
- [afptool 与 rkImageMaker：理解并打包 Rockchip update.img](/zh/articles/rockchip-tool-firmware-pack-tools/)
- [Rockchip 存储应用完整说明：Flash、启动流程、分区、烧录与 Vendor Storage](/zh/articles/099-rockchip-storage-application/)
- [Rockchip 工具下载与使用指南索引](/zh/articles/rockchip-tools-download-guide/)

## 查找准确的 ArmSoM 板卡资料

板卡、载板与接口要求先以产品手册为准。以下链接是平台参考，不表示该归档工具已在这些产品上验证。

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
