---
title: "upgrade_tool 下载与使用：命令行烧录、设备选择和结果校验"
description: "upgrade_tool 提供 Rockusb 命令行操作，适合固定工作站流程。本次分别提供 Linux 2.44、macOS 2.13、Windows 2.46，按主机选择，不能把不同平台版本混为一谈。"
excerpt: "upgrade_tool 提供 Rockusb 命令行操作，适合固定工作站流程。本次分别提供 Linux 2.44、macOS 2.13、Windows 2.46，按主机选择，不能把不同平台版本混为一谈。"
translation_key: "rockchip-tool-upgrade-tool"
slug: "rockchip-tool-upgrade-tool"
lang: "zh"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "upgrade_tool"]
---

{% raw %}

![upgrade_tool](/assets/rockchip-tools/flows/upgrade-tool-zh.svg)

## 命令行开发工具手册：版本与适用范围

以下完整操作章节合并两份中文手册：V1.0 与文件名标 V1.1 的版本。后者封面仍写 1.0，但技术变更增加 SPI NAND 擦除，本文明确保留差异。原稿列出 RK3308、RK3326、RK3399、RK3328、RK3228H、RK3229、RK3368、RK3228、RK3288、RK3128、RK3126、RK3188、RK3036、RK1808、PX30、RV1109、RV1126、RK3566、RK3568；这不是本次工具包对所有 ArmSoM 板卡的验证清单。

### 1. 列出升级设备

```text
upgrade_tool ld
```

可升级设备统称 Rockusb，分为 Loader 和 Maskrom。连接多块板时，先确认目标设备；不要把 LocationID 当作永久序列号。

### 2. 下载 Boot 到内存

```text
upgrade_tool db rkxxloader.bin
```

Maskrom 状态下先下载 Boot 才能继续通信；此步骤不写设备存储。失败时分别检查 DDR/主控或 USB，重试前先重启设备。文件名是原文示例，必须换成匹配板卡的 Loader。

### 3. 烧写 Loader

```text
upgrade_tool ul rkxxloader.bin
upgrade_tool ul rkxxloader.bin -noreset
upgrade_tool ul rkxxloader.bin SPINOR
```

三行分别为写入后重启、写入后不重启、指定多存储设备中的 SPINOR。Maskrom 或 Loader 均可执行；过程中下载 Boot、生成 IDBlock 并写入存储。除 DDR 和 USB 外，还需检查 Flash 支持列表、虚焊；偶发通信异常优先排查 USB，必现异常检查设备端。

### 4. 烧录分区镜像

```text
upgrade_tool di -p parameter.txt
upgrade_tool di -k kernel.img
upgrade_tool di -u uboot.img -b boot.img
upgrade_tool di -vendor vendor.img
upgrade_tool di -boot_a boot.img -boot_b boot.img
```

先烧录分区表，再写单个或多个镜像。未定义缩写的分区使用完整名称；A/B 分区同样按名称指定。以下是原文全部缩写。文件不存在/被占用、镜像大于分区、USB 异常分别处理，不通过强制地址写入绕过大小错误。

| 选项 | 分区 |
|---|---|
| `-b` | `boot` |
| `-k` | `kernel` |
| `-r` | `recovery` |
| `-s` | `system` |
| `-u` | `uboot` |
| `-m` | `misc` |
| `-t` | `trust` |

### 5. Loader 切换到 Maskrom

```text
upgrade_tool rd 3
```

### 6. 升级完整固件

```text
upgrade_tool uf update.img
upgrade_tool uf update.img -noreset
```

在 Maskrom 或 Loader 下升级，无须提前下载 Boot；第二行禁止完成后自动重启。原文列出七类故障：①文件不存在/占用；②固件标识错误，检查打包；③摘要校验失败，核对文件是否被修改；④读取失败，更新打包工具并重新生成；⑤分区小于镜像；⑥芯片标志错误，读取芯片信息后重打包；⑦通信异常，偶发查 USB、必现查设备端。

### 7. 按地址读写

```text
upgrade_tool wl 0x12000 oem.img
upgrade_tool rl 0x12000 0x2000 out.img
```

第一行向 LBA `0x12000` 写入文件；第二行从 `0x12000` 起读取 `0x2000` 个扇区到 `out.img`。地址和长度保持原文示例，不能直接套用到其他分区布局。

### 8. 擦除设备及 V1.1 差异

```text
upgrade_tool ef rkxxloader.bin
upgrade_tool el 0 0x2000
```

`ef` 在 Maskrom 下擦除全部数据，无须提前下载 Boot，原文列出 eMMC、NAND。`el` 示例擦除从第 0 扇区起的 `0x2000` 个扇区；V1.0 仅写 eMMC，V1.1 扩为 `emmc|spinand|spinor`。V1.1 额外给出 SPI NAND 全擦流程：进入 Maskrom，先执行下面第一行，再执行第二行。`-1` 保留原文值，仅在对应工具和存储实现确认后使用。

```text
upgrade_tool db rkxxloader.bin
upgrade_tool el 0 -1
```

### 9. 读取设备信息

```text
upgrade_tool rfi
upgrade_tool rci
upgrade_tool pl
```

依次读取存储信息、芯片 ID、分区表。

### 10. 多存储选择

```text
upgrade_tool ssd
```

在 Maskrom 中先成功下载 Boot，再执行。列表中 `*` 表示当前存储，输入存储前的 No 选择目标。

### 11. 多设备选择

```text
upgrade_tool -s 100 ul rkxxloader.bin
```

先用 `ld` 记录目标 LocationID，再通过 `-s` 指定。这里的 `100` 为示例。此处 `-s` 是设备选择，`di -s` 则是 system 分区缩写，作用域不同。

## 适用范围与验证状态

本文依据本次工具包及原始资料整理。使用前核对具体板卡、SoC、载板、SDK/BSP 与主机架构。本次未执行烧录、生产配置、寄存器写入或硬件测试；提供下载不代表所有 ArmSoM 产品均支持。

## GitHub 工具目录、版本与 SHA-256

打开 GitHub 对应目录后选择所需平台和版本，再校验文件哈希并完整解压。下方链接均为仓库目录入口。

[前往 GitHub 对应工具目录](https://github.com/ArmSoM/rockchip-tools/tree/main/downloads/upgrade-tool)

| 平台 / 版本 | 文件 | SHA-256 |
|---|---|---|
| Linux / 2.44 | `upgrade_tool_v2.44_for_linux.zip` | `b779239cb1dc6cadd823520439e4163cf223145d048e6b5f9eaf1735b407cff8` |
| macOS / 2.13 | `upgrade_tool_v2.13_for_mac.zip` | `d49db00e892b72a1760b9766b5e4ab998e75a17a37cb3acc8bf13b981b0ffc34` |
| Windows / 2.46 | `upgrade_tool_v2.46.zip` | `de1dc7ce00ed5cfdaa0432f1c7e3efaf096e5dbb7e0ad851345739f6342c06dc` |

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## 资料依据与原图

- 命令行开发工具使用文档.pdf
- 命令行开发工具使用文档v1.1.pdf

## 继续阅读相关流程

- [RKDevTool 下载与使用：Loader、分区镜像和整包固件烧录](/zh/articles/rockchip-tool-rkdevtool/)
- [Rockchip 存储应用完整说明：Flash、启动流程、分区、烧录与 Vendor Storage](/zh/articles/099-rockchip-storage-application/)
- [Rockchip 工具下载与使用指南索引](/zh/articles/rockchip-tools-download-guide/)

## 查找准确的 ArmSoM 板卡资料

板卡、载板与接口要求先以产品手册为准。以下链接是平台参考，不表示该归档工具已在这些产品上验证。

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
