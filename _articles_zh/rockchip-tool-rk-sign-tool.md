---
title: "rk_sign_tool 与 sign_tool：Rockchip 固件签名和校验流程"
description: "签名为既定信任链准备启动文件，与向 OTP/eFuse 写公钥哈希是两个阶段。本批包含 Linux 1.42、较早 Linux 目录快照、macOS 1.2，需要分别核对命令名与能力。"
excerpt: "签名为既定信任链准备启动文件，与向 OTP/eFuse 写公钥哈希是两个阶段。本批包含 Linux 1.42、较早 Linux 目录快照、macOS 1.2，需要分别核对命令名与能力。"
translation_key: "rockchip-tool-rk-sign-tool"
slug: "rockchip-tool-rk-sign-tool"
lang: "zh"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "rk_sign_tool and sign_tool"]
---

{% raw %}

![rk_sign_tool and sign_tool](/assets/rockchip-tools/flows/rk-sign-tool-zh.svg)

签名为既定信任链准备启动文件，与向 OTP/eFuse 写公钥哈希是两个阶段。本批包含 Linux 1.42、较早 Linux 目录快照、macOS 1.2，需要分别核对命令名与能力。

## 先确定签名身份

按板卡 SDK 确定芯片和密钥策略。私钥放在工具仓库及日志之外，保存未签名输入、输出名称和密钥标识，便于追溯。已配置安全启动的设备升级失败时，不能随意生成另一把密钥代替原密钥。

## 原文流程示例

Linux README 给出使用已有密钥对的 RK3326 示例：

```text
rk_sign_tool cc --chip 3326
rk_sign_tool lk --key privateKey.pem --pubkey publicKey.pem
rk_sign_tool sl --loader loader.bin
rk_sign_tool si --img uboot.img
```

这里处理本地文件，不是 RK3576/RK3588 通用命令。`sign_tool` PDF 还说明 `sf`/`vf` 签名与校验整包、`sl`/`vl` 处理 Loader、`si`/`vi` 处理镜像。以当前程序支持的校验方式验证产物后再部署。

## 必须单独理解的开关

`ss --flag=0x20` 会启用 miniloader 的 OTP 写入，不能当作普通格式选项。A/B 的 `exclude_boot_sign=true` 跳过自动 boot 签名，意味着可能还需要明确的独立签名步骤。外部签名采用 extract/inject 阶段，必须保留数据与签名的严格对应。

## 验收与故障定位

核对签名、芯片、密钥身份和启动链覆盖。签名正确但密钥与设备中登记的不一致，仍会启动失败。填充模式与镜像格式依平台而异。在不可逆配置前，按产品安全方案验证签名升级与恢复。本文没有生成密钥或改变硬件信任状态。

## 适用范围与验证状态

本文依据本次工具包及原始资料整理。使用前核对具体板卡、SoC、载板、SDK/BSP 与主机架构。本次未执行烧录、生产配置、寄存器写入或硬件测试；提供下载不代表所有 ArmSoM 产品均支持。

## 工具下载、版本与 SHA-256

下载对应压缩包，校验哈希后完整解压。Linux PinDebug 分卷请先按链接中的说明还原；下方该项哈希对应合并后的完整文件。

| 主机 / 版本 | 下载包 |
|---|---|
| Linux / 1.42 | [rk_sign_tool_v1.42_linux.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/rk-sign-tool/rk_sign_tool_v1.42_linux.zip) |
| Linux / directory snapshot | [rk_sign_tool-linux-directory-snapshot.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/rk-sign-tool/rk_sign_tool-linux-directory-snapshot.zip) |
| macOS / 1.2 | [sign_tool_v1.2_mac.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/rk-sign-tool/sign_tool_v1.2_mac.zip) |

**rk_sign_tool_v1.42_linux.zip — SHA-256**

```text
799a0fad6e363b141e244580479ed8434e05c070d924db8a289e277e50a7ca1d
```

**rk_sign_tool-linux-directory-snapshot.zip — SHA-256**

```text
db3cd185e5e38b886be0a162a92d3400368acfb5684744b8e91af5ef9cdeb06e
```

**sign_tool_v1.2_mac.zip — SHA-256**

```text
30ee08cb35681b735f1636bcc9215af64c4b6b5ca303a0889509be32209ea8ed
```

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## 资料依据与原图

- rk_sign_tool/readme.txt; sign_tool用户使用手册.pdf V1.0; package revision notes
- [原始 PDF: sign_tool用户使用手册.pdf](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/manuals/8528f18eea87.pdf)

## 继续阅读相关流程

- [Rockchip Secure Boot 完整应用指南：签名、eFuse、OTP 与验证](/zh/articles/105-rockchip-secure-boot/)
- [Rockchip Linux Secure Boot 完整开发指南](/zh/articles/203-rockchip-linux-secure-boot/)
- [EfuseTool 1.42：建立可追溯的安全启动配置工位](/zh/articles/rockchip-tool-efuse-tool/)
- [Rockchip 工具下载与使用指南索引](/zh/articles/rockchip-tools-download-guide/)

## 查找准确的 ArmSoM 板卡资料

板卡、载板与接口要求先以产品手册为准。以下链接是平台参考，不表示该归档工具已在这些产品上验证。

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
