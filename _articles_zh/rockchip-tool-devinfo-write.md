---
title: "RKDevInfoWriteTool：受控写入序列号与 MAC 信息"
description: "RKDevInfoWriteTool 界面包含 SN、Wi-Fi、LAN、Bluetooth 等设备信息，也有安全相关字段；看到某个字段不代表目标板支持该项。设备身份分配与安全配置应分成不同生产流程。"
excerpt: "RKDevInfoWriteTool 界面包含 SN、Wi-Fi、LAN、Bluetooth 等设备信息，也有安全相关字段；看到某个字段不代表目标板支持该项。设备身份分配与安全配置应分成不同生产流程。"
translation_key: "rockchip-tool-devinfo-write"
slug: "rockchip-tool-devinfo-write"
lang: "zh"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "RKDevInfoWriteTool"]
---

{% raw %}

![RKDevInfoWriteTool](/assets/rockchip-tools/flows/devinfo-write-zh.svg)

RKDevInfoWriteTool 界面包含 SN、Wi-Fi、LAN、Bluetooth 等设备信息，也有安全相关字段；看到某个字段不代表目标板支持该项。设备身份分配与安全配置应分成不同生产流程。

## 使用干净工具包

ArmSoM 重打包移除了历史日志、保存配置和 `DEVNAME.bin`，可执行文件保持不变，需要重新创建工位配置。语言资源可确认 Read、Write、Single、Loader、Test、Reboot 等控件，但没有完整 PDF，设备端实际存储行为必须以匹配 SDK 为准。

## 先建立分配台账

写入前明确序列号和网络地址的分配责任、允许范围、重复检测。MAC 应采用产品有权使用的地址分配方案。客户标识和分配文件私下保存，不可把示例值复用到整批设备。

## 从单台验证开始

确认设备身份、固件和 BSP 支持的字段；配置所需来源/范围，只启用必要写入项，先做可控单台试验再自动化。支持读取时回读，并通过运行系统或板级 API 核对，重启后再次确认持久保存。

## 失败处理

记录已消耗 ID、设备状态、回读结果。超时后先核对是否实际写入，再决定是否重新分配。`ForceWrite`、擦除、RPMB、锁定相关选项不是普通 SN 失败的默认修复方法，需要对应板卡或安全流程。本下载不包含客户标识或授权密钥。

## 适用范围与验证状态

本文依据本次工具包及原始资料整理。使用前核对具体板卡、SoC、载板、SDK/BSP 与主机架构。本次未执行烧录、生产配置、寄存器写入或硬件测试；提供下载不代表所有 ArmSoM 产品均支持。

## 工具下载、版本与 SHA-256

下载对应压缩包，校验哈希后完整解压。Linux PinDebug 分卷请先按链接中的说明还原；下方该项哈希对应合并后的完整文件。

| 主机 / 版本 | 下载包 |
|---|---|
| Windows / 1.3.7 | [RKDevInfoWriteTool-v1.3.7-clean.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/devinfo-write/RKDevInfoWriteTool-v1.3.7-clean.zip) |

**RKDevInfoWriteTool-v1.3.7-clean.zip — SHA-256**

```text
66a3a94142470356adc8c7e3a2b9ba2deee60fd3bb7bcbba9c196c2534eb6f3a
```

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## 资料依据与原图

- RKDevInfoWriteTool-v1.3.7.zip: English.ini, configuration UI resources and packaging inventory

## 继续阅读相关流程

- [HDCP Key Writer：授权密钥打包与设备写入流程](/zh/articles/rockchip-tool-hdcp-key-writer/)
- [RKPCBATool 1.2.1：配置 Linux 板卡功能测试与人工判定](/zh/articles/rockchip-tool-pcba-tool/)
- [EfuseTool 1.42：建立可追溯的安全启动配置工位](/zh/articles/rockchip-tool-efuse-tool/)
- [Rockchip 工具下载与使用指南索引](/zh/articles/rockchip-tools-download-guide/)

## 查找准确的 ArmSoM 板卡资料

板卡、载板与接口要求先以产品手册为准。以下链接是平台参考，不表示该归档工具已在这些产品上验证。

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
