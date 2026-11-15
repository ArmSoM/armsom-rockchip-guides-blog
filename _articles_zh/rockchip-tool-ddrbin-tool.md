---
title: "rk_ddrbin_tool：读取和修改 DDR 初始化参数"
description: "DDR binary 在 Linux 启动前控制内存初始化。rk_ddrbin_tool 修改受支持 DDR 二进制中的参数，不能替代布线分析，也不能把任意不兼容 Loader 自动修好。"
excerpt: "DDR binary 在 Linux 启动前控制内存初始化。rk_ddrbin_tool 修改受支持 DDR 二进制中的参数，不能替代布线分析，也不能把任意不兼容 Loader 自动修好。"
translation_key: "rockchip-tool-ddrbin-tool"
slug: "rockchip-tool-ddrbin-tool"
lang: "zh"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "rk_ddrbin_tool"]
---

{% raw %}

![rk_ddrbin_tool](/assets/rockchip-tools/flows/ddrbin-tool-zh.svg)

DDR binary 在 Linux 启动前控制内存初始化。`rk_ddrbin_tool` 修改受支持 DDR 二进制中的参数，不能替代布线分析，也不能把任意不兼容 Loader 自动修好。

## 同时检查工具与 binary 版本

工具版本与 DDR binary 版本是两回事。随包指南包含平台/版本支持矩阵，不支持的项不能靠改文件名获得支持。修改前保存原始文件和哈希。

## 读取、修改、比较

包内文字指南给出历史 PX30 Python 示例：

```text
./ddrbin_tool.py px30 ddrbin_param.txt px30_ddr_333MHz_v1.13.bin
./ddrbin_tool.py px30 -g gen_param.txt px30_ddr_333MHz_v1.15.bin
```

第一行应用 `ddrbin_param.txt`，第二行通过 `-g` 导出参数。这些是原指南示例，不表示每个 GUI 包都包含 `ddrbin_tool.py`，更不能把 PX30 参数套用其他 SoC。以选定包的实际界面为准。文字指南说明，参数留空可保留默认值。

选择准确芯片和受支持 binary，支持导出时先保存当前参数，再在副本中每次修改一个有文档依据的值。合入板卡 Loader 前，比较输出、长度和配置，把工具版本、修改前后哈希、参数文件一起保存。

## 验证完整启动链

在正确内存贴装的板卡上验证内存初始化、冷/热启动和 DDR 测试计划。编辑器接受文件不代表时序裕量和稳定性合格。若串口输出前就停止启动，使用已知可用 Loader 恢复，再分析修改项，不要不断更改无关参数。

## 适用范围与验证状态

本文依据本次工具包及原始资料整理。使用前核对具体板卡、SoC、载板、SDK/BSP 与主机架构。本次未执行烧录、生产配置、寄存器写入或硬件测试；提供下载不代表所有 ArmSoM 产品均支持。

## 工具下载、版本与 SHA-256

下载对应压缩包，校验哈希后完整解压。Linux PinDebug 分卷请先按链接中的说明还原；下方该项哈希对应合并后的完整文件。

| 主机 / 版本 | 下载包 |
|---|---|
| Linux / 1.01 | [rk_ddrbin_tool_V1.01.7z](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/ddrbin-tool/rk_ddrbin_tool_V1.01.7z) |
| Windows / 1.07.2 | [rk_ddrBin_tool_V1.07.2.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/ddrbin-tool/rk_ddrBin_tool_V1.07.2.zip) |

**rk_ddrbin_tool_V1.01.7z — SHA-256**

```text
db87698a90f620dcea6ab166af7d330dfb6f36e9b2cc9ec02dd000bf474b2212
```

**rk_ddrBin_tool_V1.07.2.zip — SHA-256**

```text
618bd996e570cb2f94b2c714e53776c3edc6bad3211e6c377be3cfd45bc48bc1
```

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## 资料依据与原图

- rk_ddrbin_tool 1.01 / 1.07.2 packages; ddrbin_tool_user_guide.txt; parameter/version matrix

## 继续阅读相关流程

- [Rockchip DDR 完整开发指南：频率、容量、验证、眼图与 ECC](/zh/articles/037-rockchip-ddr/)
- [boot_merger 使用流程：正确组合 DDR、下载代码与 Loader](/zh/articles/rockchip-tool-boot-merger/)
- [DDR_UserTool 1.41：为板卡选择 DDR 测试配置](/zh/articles/rockchip-tool-ddr-user-tool/)
- [Rockchip 工具下载与使用指南索引](/zh/articles/rockchip-tools-download-guide/)

## 查找准确的 ArmSoM 板卡资料

板卡、载板与接口要求先以产品手册为准。以下链接是平台参考，不表示该归档工具已在这些产品上验证。

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
