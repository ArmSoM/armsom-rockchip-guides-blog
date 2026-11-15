---
title: "DriverAssitant 5.13：Windows Rockusb 与 ADB 驱动安装排查"
description: "Windows 绑定了错误驱动时，烧录软件无法与板卡正常通讯。DriverAssitant 用于安装和卸载 Rockchip USB 驱动，是主机准备环节，本身不负责烧录固件。"
excerpt: "Windows 绑定了错误驱动时，烧录软件无法与板卡正常通讯。DriverAssitant 用于安装和卸载 Rockchip USB 驱动，是主机准备环节，本身不负责烧录固件。"
translation_key: "rockchip-tool-driver-assistant"
slug: "rockchip-tool-driver-assistant"
lang: "zh"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "DriverAssitant"]
---

{% raw %}

![DriverAssitant](/assets/rockchip-tools/flows/driver-assistant-zh.svg)

Windows 绑定了错误驱动时，烧录软件无法与板卡正常通讯。DriverAssitant 用于安装和卸载 Rockchip USB 驱动，是主机准备环节，本身不负责烧录固件。

## 保留完整驱动包

驱动目录需要与安装程序一起保留。包内 README 介绍驱动预安装，并建议更换版本时先卸载旧驱动，再安装新包。安装需要相应管理员权限，不要为了强行加载不兼容驱动而关闭系统安全机制。

历史 README 列出 Windows XP、7、8、10 的 32/64 位版本，不能据此认定 Windows 11 或 Windows on Arm 已经支持；还应核对实际驱动架构及签名。

## 安装和识别顺序

1. 先在设备管理器记录已有驱动名称和提供者，方便定位变更。
2. 按包内替换流程卸载旧 Rockchip 驱动，再安装当前驱动。
3. 只连接一块板卡，使用手册指定的数据口；Rockusb 操作需要进入 Loader 或 Maskrom。
4. 设备管理器中检查枚举异常，再查看 RKDevTool 或 `upgrade_tool ld` 是否识别板卡。
5. 如需 ADB，设备系统必须已经启动、启用 ADB 并完成授权。Rockusb 驱动不会给固件增加 ADB 服务。

## 不要把所有问题归因于驱动

仅供电线无法靠装驱动变成数据线；接口错误、供电不足、启动模式不对，也会导致没有设备。Windows 已识别而工具不识别时，重点核对驱动绑定和工具版本。ADB 授权问题属于运行中的系统，Maskrom 恢复属于启动链路。

## 固化工作站环境

记录安装包版本、Windows 版本与架构、USB 控制器、设备模式和最终驱动名称。一块板验证后再扩展到多口集线器。本文基于包内 README，整理过程没有实际安装驱动。

## 适用范围与验证状态

本文依据本次工具包及原始资料整理。使用前核对具体板卡、SoC、载板、SDK/BSP 与主机架构。本次未执行烧录、生产配置、寄存器写入或硬件测试；提供下载不代表所有 ArmSoM 产品均支持。

## GitHub 工具目录、版本与 SHA-256

打开 GitHub 对应目录后选择所需平台和版本，再校验文件哈希并完整解压。下方链接均为仓库目录入口。

[前往 GitHub 对应工具目录](https://github.com/ArmSoM/rockchip-tools/tree/main/downloads/driver-assistant)

| 平台 / 版本 | 文件 | SHA-256 |
|---|---|---|
| Windows / 5.13 | `DriverAssitant_v5.13.zip` | `b2cabce5ab23551d8649c1201ef741fd73c8326044b78edac5439f013f034ff9` |

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## 资料依据与原图

- DriverAssitant_v5.13.zip: Readme and packaged driver directories

## 继续阅读相关流程

- [RKDevTool 下载与使用：Loader、分区镜像和整包固件烧录](/zh/articles/rockchip-tool-rkdevtool/)
- [upgrade_tool 下载与使用：命令行烧录、设备选择和结果校验](/zh/articles/rockchip-tool-upgrade-tool/)
- [Rockchip 工具下载与使用指南索引](/zh/articles/rockchip-tools-download-guide/)

## 查找准确的 ArmSoM 板卡资料

板卡、载板与接口要求先以产品手册为准。以下链接是平台参考，不表示该归档工具已在这些产品上验证。

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
