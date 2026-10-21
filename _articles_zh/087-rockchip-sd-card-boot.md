---
title: "Rockchip SD 卡启动：升级卡、启动卡、修复卡与 BCB 完整指南"
description: "完整整理 V1.3.1 的制卡步骤、GPT/非 GPT 布局、IDB/BCB 标志和 pre-loader/SPL/U-Boot 流程。"
translation_key: "087-rockchip-sd-card-boot"
slug: "087-rockchip-sd-card-boot"
lang: "zh"
date: "2026-10-21"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "SD", "U-Boot", "BCB"]
keywords: "ArmSoM Rockchip SD boot GPT BCB RK3588"
excerpt: "完整整理 V1.3.1 的制卡步骤、GPT/非 GPT 布局、IDB/BCB 标志和 pre-loader/SPL/U-Boot 流程。"
---

{% raw %}

# Rockchip SD 卡启动：升级卡、启动卡、修复卡与 BCB 完整指南

本文是 ArmSoM 适配的平台参考，完整依据唯一提供的中文 Rockchip_Developer_Guide_SD_Boot_CN.pdf（RK-KF-YF-171，V1.3.1，17 页）。没有英文 PDF；英文、俄文和德文均完整译自中文。四语均使用中文原图，德文与英文图片 URL 完全一致。原稿“产品版本”栏为空，未限定 SDK/BSP 或内核版本；第 4 节只列明各 SoC 的 IDB/BCB 支持情况，不等于所有 ArmSoM 板卡已适配。使用前核对板卡 SoC、SD 接线及供电、启动优先级、SDK/BSP、pre-loader/SPL/U-Boot、recovery 与 SDDiskTool 版本。本文没有硬件验证，所有流程和示例均来自原稿，不是 ArmSoM 实测。

制卡和升级会覆盖所选 SD 卡或设备存储。先备份并核对目标设备；本文没有执行制卡、格式化或升级操作。截图中的 v1.53 不能视为满足 BCB 所需 v1.67 的证据。

[校对记录](/docs/rockchip-sd-card-boot/EDITORIAL-NOTES.md) · [ArmSoM Docs](https://docs.armsom.org/) · [Rockchip U-Boot](https://github.com/rockchip-linux/u-boot)

## 概述

本文介绍 Rockchip 对 SD 卡的几种使用，包括制作固件、制作各种 SD 功能卡、固件在 SD 卡内的分布以及 boot 流程，供工程师排查使用 SD 卡时出现的问题。

## 1. 类型简介

Rockchip 将 SD 卡划分为常规 SD 卡、SD 升级卡、SD 启动卡和 SD 修复卡。可以通过瑞芯微创建升级磁盘工具将 `update.img` 下载到 SD 卡内，制作不同类型的卡。

<!-- Source CN PDF p.4: types -->

| 卡类型 | 功能 |
| --- | --- |
| 常规 SD 卡 | 普通的存储设备 |
| SD 升级卡 | 设备从 SD 卡内启动到 recovery,由 recovery 负责把 sd 内固件更新到设备存储 |
| SD 启动卡 | 设备直接从 SD 卡启动 |
| SD 修复卡 | 从 pre-loader 开始拷贝 SD 卡内的固件到设备存储 |

## 2. 固件制作

`update.img` 是 Rockchip 提供的整套固件合集，不仅包含完整固件，还包括固件完整性校验等数据，便于用户更新整套固件。

Rockchip 提供专用工具制作 `update.img`。使用 Rockchip SDK 时，可进入 `RKTools/linux/Linux_Pack_Firmware/rockdev/` 目录，如下。

![固件打包目录 — 中文原图，PDF 第 4](/docs/rockchip-sd-card-boot/assets/cn-p04.png)

*固件打包目录 — 中文原图，PDF 第 4*

```text
backupimage/
Image/
AFPTool.exe
baseparamer.img
mkupdate.bat
package-file
recover-script
RKImageMaker.exe
update.img
update-script
```

可修改 `package-file` 来打包所需的 `update.img`。文件内容如下（原 PDF 第 4–5 页跨页代码已合并）：

```text
# NAME Relative path
#
#HWDEF HWDEF
package-file package-file
bootloader Image/MiniLoaderAll.bin
parameter Image/parameter.txt
uboot Image/uboot.img
trust Image/trust.img
misc Image/misc.img
resource Image/resource.img
kernel Image/kernel.img
boot Image/boot.img
#recovery Image/recovery.img
#system Image/system.img
#vendor Image/vendor.img
#oem Image/oem.img
# baseparamer Image/baseparamer.img
# 要写入backup分区的文件就是自身(update.img)
# SELF 是关键字,表示升级文件(update.img)自身
# 在生成升级文件时,不加入SELF文件的内容,但在头部信息中有记录
# 在解包升级文件时,不解包SELF文件的内容。
# RESERVED不打包backup
backup backupimage/backup.img
update-script update-script
recover-script recover-script
```

代码注释说明：backup 的 SELF 表示升级文件 `update.img` 自身；生成升级文件时不加入 SELF 的内容，但在头部信息中记录；解包时不解出 SELF；RESERVED 不打包 backup。

添加文件时，写入文件名及固件地址。不需要打包某个固件时，在固件名前加 `#` 屏蔽。运行 `mkupdate.bat` 即可生成 `update.img`。

## 3. 工具使用

### 3.1 常规 SD 卡

普通 SD 卡与 PC 上的使用完全一样，可以在 U-Boot 和 Kernel 系统中作为普通存储空间使用，无需用工具对 SD 卡做任何操作。

### 3.2 SD 升级卡

SD 升级卡由 RK 工具制作，用于通过 SD 卡升级本地存储（例如 eMMC、nand flash）中的系统，无需 PC 或网络。启动代码写入 SD 卡保留区，固件拷贝到可见分区。主控从 SD 卡启动后，由启动代码和升级代码把固件烧写到本地主存储。SD 升级卡还支持 PCBA 测试和 Demo 文件拷贝，使固件升级脱离 PC，提高生产效率。制作流程如下。

![升级卡创建界面 — 中文原图，PDF 第 6](/docs/rockchip-sd-card-boot/assets/cn-p06.png)

*升级卡创建界面 — 中文原图，PDF 第 6*

1. 选择可移动磁盘设备。
2. 选择功能模式：固件升级。
3. 选择需要升级的固件。
4. 点击“开始创建”。

具体配置参考上图。

具体配置可参考上图。再次制作时，如果已有 SD 升级卡，仅需更新固件和 demo 文件，可按以下步骤完成：

1. 将固件拷贝到 SD 卡根目录，并重命名为 `sdupdate.img`。
2. 将 demo 文件拷贝到 SD 卡根目录下的 `Demo` 目录。

#### 升级卡 — 非 GPT

<!-- Source CN PDF p.7: upgrade-non-gpt -->

| 偏移 | 数据段 |
| --- | --- |
| 扇区 0 | MBR |
| 扇区 64-4M | IDBLOCK(启动标志置 0) |
| 4M-8M | Parameter |
| 12M-16M | uboot |
| 16M-20M | trust |
| ...... | misc(BCB写入recovery\n--rk_fwupdate\n) |
| ...... | resource |
| ...... | kernel |
| ...... | recovery |
| 剩下空间 | Fat32 存放 update.img |

#### 升级卡 — GPT

<!-- Source CN PDF p.7: upgrade-gpt -->

| 偏移 | 数据段 |
| --- | --- |
| 扇区 0 | MBR |
| 扇区 1-34 | GPT 分区表 |
| 扇区 64-4M | IDBLOCK(启动标志置 0) |
| 4M-8M | Parameter |
| ...... | uboot |
| ...... | trust |
| ...... | misc |
| ...... | resource |
| ...... | kernel |
| ...... | recovery |
| 剩下空间 | Fat32 存放 update.img |

### 3.3 SD 启动卡

SD 启动卡由 RK 工具制作，使设备系统直接从 SD 卡启动，便于更新新编译的固件而无需烧写设备存储，也可作为设备主存储。主要用于系统从 SD 卡启动或 PCBA 测试。注意：PCBA 测试只是 recovery 下的一个功能项，升级卡和启动卡均可使用。制作流程如下。

![启动卡创建界面 — 中文原图，PDF 第 8](/docs/rockchip-sd-card-boot/assets/cn-p08.png)

*启动卡创建界面 — 中文原图，PDF 第 8*

1. 选择可移动磁盘设备。
2. 选择功能模式：SD 启动。
3. 选择需要升级的固件。
4. 点击“开始创建”。

具体配置参考上图。

#### 启动卡 — 非 GPT

<!-- Source CN PDF p.8: boot-non-gpt -->

| 偏移 | 数据段 |
| --- | --- |
| 扇区 0 | MBR |
| 扇区 64-4M | IDBLOCK(启动标志置 1) |
| 4M-8M | Parameter |
| 8M-12M | uboot |
| 12M-16M | trust |
| ...... | misc |
| ...... | resource |
| ...... | boot |
| ...... | kernel |
| ...... | recovery |
| ...... | system |
| ...... | user |

#### 启动卡 — GPT

<!-- Source CN PDF p.9: boot-gpt -->

| 偏移 | 数据段 |
| --- | --- |
| 扇区 0 | MBR |
| 扇区 1-34 | GPT 分区表 |
| 扇区 64-4M | IDBLOCK(启动标志置 1) |
| ...... | uboot |
| ...... | Boot |
| ...... | trust |
| ...... | resource |
| ...... | kernel |
| ...... | recovery |
| ...... | system |
| ...... | vendor |
| ...... | oem |
| ...... | user |
| 最后 33 扇区 | 备份 GPT |

### 3.4 SD 修复卡

SD 修复卡功能类似升级卡，但固件升级发生在 pre-loader（miniloader）的 SD 卡升级代码中。工具先把启动代码写入 SD 卡保留区，再把固件拷贝到可见分区。主控从 SD 卡启动时，升级代码将固件更新到本地主存储。主要用于设备固件损坏后，通过 SD 卡修复设备。制作流程如下。

![修复卡创建界面 — 中文原图，PDF 第 10](/docs/rockchip-sd-card-boot/assets/cn-p10.png)

*修复卡创建界面 — 中文原图，PDF 第 10*

1. 选择可移动磁盘设备。
2. 选择功能模式：SD 启动和修复。
3. 选择需要升级的固件。
4. 点击“开始创建”。

具体配置参考上图。

#### 修复卡 — 非 GPT

<!-- Source CN PDF p.11: repair-non-gpt -->

| 偏移 | 数据段 |
| --- | --- |
| 扇区 0 | MBR |
| 扇区 64-4M | IDBLOCK(启动标志置 2) |
| 4M-8M | Parameter |
| 8M-12M | uboot |
| 12M-16M | trust |
| ...... | misc |
| ...... | resource |
| ...... | boot |
| ...... | kernel |
| ...... | recovery |
| ...... | system |
| ...... | user |

#### 修复卡 — GPT

<!-- Source CN PDF p.11: repair-gpt -->

| 偏移 | 数据段 |
| --- | --- |
| 扇区 0 | MBR |
| 扇区 1-34 | GPT 分区表 |
| 扇区 64-4M | IDBLOCK(启动标志置 2) |
| ...... | uboot |
| ...... | Boot |
| ...... | trust |
| ...... | resource |
| ...... | kernel |
| ...... | recovery |
| ...... | system |
| ...... | vendor |
| ...... | oem |
| ...... | user |
| 最后 33 扇区 | 备份 GPT |

## 4. 标志说明

不同功能的 SD 卡会写入相应标志。第 64 扇区起始魔数为 `0xFCDC8C3B` 时，视为特殊卡，从卡内读取固件启动设备；否则按普通 SD 卡处理。在“第 64 扇区 + 616bytes”处存放卡类型标志，目前有三种：

<!-- Source CN PDF p.12: flags -->

| 标志 | 卡类型 |
| --- | --- |
| 0 | 升级卡或 PCBA 测试卡 |
| 1 | 启动卡 |
| 2 | 修复卡 |

写入 idb block flag 的方式有以下劣势：

- RK 独有设计，不兼容。
- 存在安全问题：制卡时将标志写入 idb block，破坏其完整性。
- 新版 idb block 未预留该标志位置；实际上也无须预留，否则仍会遇到上述问题。

为解决这些问题，RK 复用 Android BCB 设计，在 recovery 字段中添加 `recovery\n--rk_fwupdate\n`，作为进入 SD 升级的标志。两种标志的支持情况如下。

<!-- Source CN PDF p.12: platforms -->

| 平台 | idb block flag | Android BCB |
| --- | --- | --- |
| rk3588 |  | ✓ |
| rk3568/rk3566 |  | ✓ |
| rv1126/rv1109 | ✓ | ✓ |
| rk3399 | ✓ | ✓ |
| rk3368 | ✓ | ✓ |
| rk3328 | ✓ | ✓ |
| rk3326 | ✓ | ✓ |
| rk3308 | ✓ | ✓ |
| rk3288 | ✓ | ✓ |
| rk3229 | ✓ | ✓ |
| rk3128 | ✓ | ✓ |
| rk3126 | ✓ | ✓ |

随着平台升级和工具更新，写入 idb block flag 的方式会逐渐被弃用。**注意：SDDiskTool 需更新到 v1.67 或更高版本，才支持 Android BCB 方式。**

## 5. 流程分析

SD 卡 boot 流程分为 pre-loader/SPL 启动流程和 U-Boot 启动流程。pre-loader 与 U-Boot 均需加载检测 SD 卡及其 IDB Block 中的 Startup Flag，并按标志执行不同功能。SPL 则把 SD 卡设为最高优先级启动设备；若卡中有可启动固件，优先从 SD 卡加载并启动。

### 5.1 pre-loader 启动流程

![pre-loader 流程原图 — 中文原图，PDF 第 13](/docs/rockchip-sd-card-boot/assets/cn-p13.png)

*pre-loader 流程原图 — 中文原图，PDF 第 13*

图中步骤的可复制说明：maskrom → pre-loader → 查找存储设备。无 SD 卡或第 64 扇区魔数不是 `0xFCDC8C3B` 时，进入正常启动流程；满足条件时，按“64 扇区 + 616bytes”处的标志分支：0 为升级卡/PCBA 测试卡，1 为启动卡，两者均从 SD 卡读取固件并启动 UBOOT；2 为修复卡，在 loader 下更新固件。

### 5.2 SPL 启动流程

![SPL 流程矢量原图裁取 — 中文原图，PDF 第 14](/docs/rockchip-sd-card-boot/assets/cn-p14.png)

*SPL 流程矢量原图裁取 — 中文原图，PDF 第 14*

Start → SPL → 查找存储设备。无 SD 卡时查找其他存储设备；有 SD 卡但无可启动固件时，同样查找其他存储设备；有可启动固件则启动下一级 → End。

### 5.3 U-Boot 启动流程

![U-Boot 流程第一部分 — 中文原图，PDF 第 16](/docs/rockchip-sd-card-boot/assets/cn-p16.png)

*U-Boot 流程第一部分 — 中文原图，PDF 第 16*

![U-Boot 流程跨页续图 — 中文原图，PDF 第 17](/docs/rockchip-sd-card-boot/assets/cn-p17.png)

*U-Boot 流程跨页续图 — 中文原图，PDF 第 17*

图中节点与分支：

1. Start → Uboot → 查找存储设备；没有 SD 卡则检测其他存储设备。
2. 有 SD 卡时，检查第 64 扇区起始标志是否为 `0xFCDC8C3B`。若是，再检查 616bytes 标志是否为 0；非 0 则检测其他存储设备。
3. 若魔数不是 `0xFCDC8C3B`，检查是否为 `0x534e4b52` 或 `0x534e5252`；不是则检测其他存储设备。
4. 旧魔数且标志为 0，或符合上述新魔数时，将当前设备设置为 SD 卡。
5. cmdline 添加 `sdfwupdate` 标志 → 从 misc 分区获取启动模式为 recovery → 检查 BCB 的 recovery 是否为 `recovery\n--rk_fwupdate\n`。不符合则检测其他存储设备。
6. 符合时，跨页续图再次显示 cmdline 添加 `sdfwupdate`，随后加载 recovery、进入 recovery 模式 → End。重复节点按原图保留，具体实现需对照所用 U-Boot 分支核验。

### 5.4 recovery 及 PCBA 说明

具体参见原文引用的《Rockchip Recovery 用户操作指南 V1.03.pdf》。该引用文档不在本篇输入资料内。

## 6. 注意事项

1. 非 GPT 格式下，U-Boot 需配置 `CONFIG_RKPARM_PARTITION`。
2. 制作 SD 升级卡时，`update.img` 必须包含 `MiniloaderAll.bin`、`parameter.txt`、`uboot.img`、`trust.img`、`misc.img`、`resource.img`、`recovery.img`，否则烧写时会出现写入 MBR 失败的提示。这里的 `MiniloaderAll.bin` 与第 2 节 `MiniLoaderAll.bin` 大小写不同，按原文保留，实际文件名需核对。

{% endraw %}
