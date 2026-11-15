---
title: "BoardProofTool 1.01：下载、CPU ID 完整性与集成准备"
description: "BoardProofTool 是包含 ProofDll.dll、RKUpgrade_DLL.dll 和 Qt 依赖的 Windows 包。修订记录明确修复“丢失 CPU ID 最后一个字节”，这关系到设备身份使用，但包内没有完整 PDF 来定义保护算法或生产配置协议。"
excerpt: "BoardProofTool 是包含 ProofDll.dll、RKUpgrade_DLL.dll 和 Qt 依赖的 Windows 包。修订记录明确修复“丢失 CPU ID 最后一个字节”，这关系到设备身份使用，但包内没有完整 PDF 来定义保护算法或生产配置协议。"
translation_key: "rockchip-tool-board-proof"
slug: "rockchip-tool-board-proof"
lang: "zh"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "BoardProofTool"]
---

{% raw %}

![BoardProofTool](/assets/rockchip-tools/flows/board-proof-zh.svg)

BoardProofTool 是包含 `ProofDll.dll`、`RKUpgrade_DLL.dll` 和 Qt 依赖的 Windows 包。修订记录明确修复“丢失 CPU ID 最后一个字节”，这关系到设备身份使用，但包内没有完整 PDF 来定义保护算法或生产配置协议。

## 保持程序包完整

解压所有文件，包括 `platforms/qwindows.dll`；只复制程序可能造成 Qt 平台插件错误。`config.json` 指定 `DLL=ProofDll.dll` 并启用日志。配置里的 `APP_VERSION` 仍为 `v1.0`，压缩包与修订号为 1.01，两者分别记录，不擅自改写原配置。

## 建立身份核对基线

任何写入集成之前，先按板卡 SDK 的文档读取设备标识，保留完整字节长度、表示方式、前导零和最后一个字节，再与工具在指定样机上的结果对比。被截短的 CPU ID 会使表面合理的记录失效；ID 也不自动等于序列号或密钥。

## 明确尚缺的集成约定

实际部署需要匹配 BSP 对输入、输出格式、SoC 支持、设备通讯模式、成功条件的说明，还要确定操作只是生成主机文件，还是改变设备状态。文件名和两行修订记录不能证明这些行为，因此不编造“点 Run 即可”的流程。

## 保存验收记录

归档包哈希、DLL 版本、板卡、SDK、完整标识对比和预期输出。含设备标识的日志应私下保存。本文提供已核实的包内容与使用准备，板卡专用写入步骤仍需相应资料和验证。

## 适用范围与验证状态

本文依据本次工具包及原始资料整理。使用前核对具体板卡、SoC、载板、SDK/BSP 与主机架构。本次未执行烧录、生产配置、寄存器写入或硬件测试；提供下载不代表所有 ArmSoM 产品均支持。

## 工具下载、版本与 SHA-256

下载对应压缩包，校验哈希后完整解压。Linux PinDebug 分卷请先按链接中的说明还原；下方该项哈希对应合并后的完整文件。

| 主机 / 版本 | 下载包 |
|---|---|
| Windows / 1.01 | [BoardProofTool_v1.01_20240823_02.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/board-proof/BoardProofTool_v1.01_20240823_02.zip) |

**BoardProofTool_v1.01_20240823_02.zip — SHA-256**

```text
72c732d7c91ba7742c4c36d2a549171f9289d820c3d50aad468e38cdd7806029
```

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## 资料依据与原图

- BoardProofTool_v1.01_20240823_02.zip: config.json, revision.log and executable/dependency inventory

## 继续阅读相关流程

- [RKDevInfoWriteTool：受控写入序列号与 MAC 信息](/zh/articles/rockchip-tool-devinfo-write/)
- [EfuseTool 1.42：建立可追溯的安全启动配置工位](/zh/articles/rockchip-tool-efuse-tool/)
- [Rockchip 工具下载与使用指南索引](/zh/articles/rockchip-tools-download-guide/)

## 查找准确的 ArmSoM 板卡资料

板卡、载板与接口要求先以产品手册为准。以下链接是平台参考，不表示该归档工具已在这些产品上验证。

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
