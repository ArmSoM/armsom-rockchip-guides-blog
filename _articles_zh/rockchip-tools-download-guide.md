---
title: "ArmSoM Rockchip 工具库：24 类工具下载与使用指南"
description: "先按操作目标选择工具，再核对主机平台、版本、原始手册和板卡条件。本工具库包含 24 类工具、35 个平台或版本包，每篇指南链接到实际 GitHub 下载，中英俄德四语共用准确的命令与校验值。"
excerpt: "先按操作目标选择工具，再核对主机平台、版本、原始手册和板卡条件。本工具库包含 24 类工具、35 个平台或版本包，每篇指南链接到实际 GitHub 下载，中英俄德四语共用准确的命令与校验值。"
translation_key: "rockchip-tools-download-guide"
slug: "rockchip-tools-download-guide"
lang: "zh"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["Rockchip", "ArmSoM", "Tools"]
---

先按操作目标选择工具，再核对主机平台、版本、原始手册和板卡条件。本工具库包含 24 类工具、35 个平台或版本包，每篇指南链接到实际 GitHub 下载，中英俄德四语共用准确的命令与校验值。

目前 34 个包可下载；USB SQ Tool 1.5 暂停，等待原厂安全核验。

[Security review / 核验状态](https://github.com/ArmSoM/rockchip-tools/blob/main/SECURITY-REVIEW.md)

## 工具下载、版本与 SHA-256

[ArmSoM / rockchip-tools](https://github.com/ArmSoM/rockchip-tools)

- [RKDevTool 下载与使用：Loader、分区镜像和整包固件烧录](/zh/articles/rockchip-tool-rkdevtool/)
- [DriverAssitant 5.13：Windows Rockusb 与 ADB 驱动安装排查](/zh/articles/rockchip-tool-driver-assistant/)
- [upgrade_tool 下载与使用：命令行烧录、设备选择和结果校验](/zh/articles/rockchip-tool-upgrade-tool/)
- [boot_merger 使用流程：正确组合 DDR、下载代码与 Loader](/zh/articles/rockchip-tool-boot-merger/)
- [Firmware_Merger：Flat RK、Flat GPT 与 Compact GPT 固件打包](/zh/articles/rockchip-tool-firmware-merger/)
- [afptool 与 rkImageMaker：理解并打包 Rockchip update.img](/zh/articles/rockchip-tool-firmware-pack-tools/)
- [Linux_Diff_Firmware：制作和验证 Rockchip 差分 OTA 包](/zh/articles/rockchip-tool-diff-firmware/)
- [DDR Bandwidth Tool：测量 Rockchip 内存带宽并读懂统计指标](/zh/articles/rockchip-tool-ddr-bandwidth/)
- [DDR_UserTool 1.41：为板卡选择 DDR 测试配置](/zh/articles/rockchip-tool-ddr-user-tool/)
- [rk_ddrbin_tool：读取和修改 DDR 初始化参数](/zh/articles/rockchip-tool-ddrbin-tool/)
- [PinDebug：排查 Rockchip IOMUX、GPIO 与电压域配置](/zh/articles/rockchip-tool-pin-debug/)
- [USB SQ Tool 1.5：从 USB 眼图排查到 PHY 参数与代码生成](/zh/articles/rockchip-tool-usb-sq-tool/)
- [rk_sign_tool 与 sign_tool：Rockchip 固件签名和校验流程](/zh/articles/rockchip-tool-rk-sign-tool/)
- [SecureBootTool 1.85：理解历史 Rockchip 安全启动工具链](/zh/articles/rockchip-tool-secureboot-tool/)
- [Linux SecurityAVB：密钥、启动镜像签名与版本边界](/zh/articles/rockchip-tool-linux-avb/)
- [Linux SecurityDM：检查 dm-verity 与加密根文件系统打包流程](/zh/articles/rockchip-tool-linux-dm/)
- [BoardProofTool 1.01：下载、CPU ID 完整性与集成准备](/zh/articles/rockchip-tool-board-proof/)
- [EfuseTool 1.42：建立可追溯的安全启动配置工位](/zh/articles/rockchip-tool-efuse-tool/)
- [ParameterTool 1.2：烧录前检查 Rockchip 分区参数](/zh/articles/rockchip-tool-parameter-tool/)
- [RKDevInfoWriteTool：受控写入序列号与 MAC 信息](/zh/articles/rockchip-tool-devinfo-write/)
- [RKPCBATool 1.2.1：配置 Linux 板卡功能测试与人工判定](/zh/articles/rockchip-tool-pcba-tool/)
- [HDCP Key Writer：授权密钥打包与设备写入流程](/zh/articles/rockchip-tool-hdcp-key-writer/)
- [SDDiskTool 1.78：区分 SD 启动卡、升级卡与 PCBA 测试卡](/zh/articles/rockchip-tool-sd-disk-tool/)
- [programmer_image_tool：将 update.img 转为 eMMC、SPI NOR 与 NAND 烧录器文件](/zh/articles/rockchip-tool-programmer-image-tool/)

## 适用范围与验证状态

本文依据本次工具包及原始资料整理。使用前核对具体板卡、SoC、载板、SDK/BSP 与主机架构。本次未执行烧录、生产配置、寄存器写入或硬件测试；提供下载不代表所有 ArmSoM 产品均支持。

下载对应压缩包，校验哈希后完整解压。Linux PinDebug 分卷请先按链接中的说明还原；下方该项哈希对应合并后的完整文件。

[SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS) · [PDF](https://github.com/ArmSoM/rockchip-tools/tree/main/manuals)
