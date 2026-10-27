---
title: "Rockchip Parameter 文件格式 1.4：字段、GPT 与传统分区"
description: "Rockchip Parameter 文件格式 1.4：字段、GPT 与传统分区"
excerpt: "Rockchip Parameter 文件格式 1.4：字段、GPT 与传统分区"
translation_key: "238-rockchip-parameter-file-format"
slug: "238-rockchip-parameter-file-format"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "parameter", "GPT", "Android"]
---

{% raw %}

# Rockchip Parameter 文件格式 1.4：字段、GPT 与传统分区

ArmSoM 平台参考：依据唯一中文原稿《Rockchip Parameter File Format》1.4（2018.1，5页）完整整理。未提供英文原稿，英俄德文为中文译文，四语均使用这份原稿的两张技术图。本文没有硬件验证，也不表示原稿适用列表以外的 SoC 或 ArmSoM 板卡已验证；先核对实际 SDK、启动链、存储介质和板级分区布局。刷写或改分区可能丢失数据，务必备份。

原稿内部差异：3.6 标题 ATAG 为 `0x60000800`，两张截图却为 `0x00200800`；3.7 标题 MACHINE 为 `3226`，截图及 RK3326 识别码为 `3326`。这里同时保留并标明，不选择一个值假装已验证。原稿多处 `updata.img` 为原拼写，应核对 SDK 实际打包文件名。MB/KB 按原稿保留，分区扇区计算采用 512 Bytes/sector。GPT 截图与后面的传统布局示例地址不同，不可混用。截图中的 `androidboot.selinux=permissive` 是历史示例，不是生产安全建议。

## 1. 概述

Rockchip Android 平台使用 parameter 文件配置固件版本、存储分区等系统参数。它是关键配置文件，只有理解各项功能后才应修改，否则可能导致系统无法工作。文件最大不能超过 64KB。

原稿适用芯片：RK3066、RK3168、RK3188、RK3288、RK312X、RK3036、RK3399、RK3368、RK322X、RK3328、RK3326 等。

## 2. Parameter 文件预览

以下原图分别展示 GPT 与传统 cmdline 分区模式。不同项目、平台的文件可能不同；本稿以 RK3326 参考定义解释各项内容。图中代码另转录为文本，长 CMDLINE 合并为逻辑行。

![图一：GPT 分区模式](/docs/rockchip-parameter-file-format/assets/cn-p002-figure-01.png)

```text
FIRMWARE_VER:8.1
MACHINE_MODEL:RK3326
MACHINE_ID:007
MANUFACTURER:rk3326
MAGIC:0x5041524B
ATAG:0x00200800
MACHINE:3326
CHECK_MASK:0x80
TYPE:GPT
CMDLINE:mtdparts=rk29xxnand:0x00002000@0x00004000(uboot),0x00002000@0x00006000(trust),0x00002000@0x00008000(misc),0x00008000@0x0000a000(resource),0x00010000@0x00012000(kernel),0x00010000@0x00022000(boot),0x00020000@0x00032000(recovery),0x00038000@0x00052000(backup),0x00002000@0x0008a000(security),0x00100000@0x0008c000(cache),0x00400000@0x0018c000(system),0x00008000@0x0058c000(metadata),0x00080000@0x00594000(vendor),0x00080000@0x00614000(oem),0x00000400@0x00694000(frp),-@0x00694400(userdata:grow)
```

![图二：传统 cmdline 分区模式](/docs/rockchip-parameter-file-format/assets/cn-p002-figure-02.png)

```text
FIRMWARE_VER:8.1
MACHINE_MODEL:RK3326
MACHINE_ID:007
MANUFACTURER:rk3326
MAGIC:0x5041524B
ATAG:0x00200800
MACHINE:3326
CHECK_MASK:0x80
CMDLINE:console=ttyFIQ0 androidboot.baseband=N/A androidboot.selinux=permissive androidboot.veritymode=/dev/block/rknand_metadata androidboot.hardware=rk30board androidboot.console=ttyFIQ0 init=/init initrd=0x62000000,0x00800000 mtdparts=rk29xxnand:0x00002000@0x00002000(uboot),0x00002000@0x00004000(trust),0x00002000@0x00006000(misc),0x00008000@0x00008000(resource),0x00010000@0x00010000(kernel),0x00010000@0x00020000(boot),0x00020000@0x00030000(recovery),0x00038000@0x00050000(backup),0x00002000@0x00088000(security),0x00100000@0x0008a000(cache),0x00400000@0x0018a000(system),0x00008000@0x0058a000(metadata),0x00080000@0x00592000(vendor),0x00080000@0x00612000(oem),0x00000400@0x00692000(frp),-@0x00692400(userdata)
```

## 3. 文件内容说明

### 3.1. `FIRMWARE_VER:8.1`

固件版本，打包原稿所称 `updata.img` 时使用，升级工具据此识别固件版本。

### 3.2. `MACHINE_MODEL:RK3326`

机器型号，打包 `updata.img` 时使用；项目可自行修改，供升级工具显示。recovery 升级时可用于判断固件是否匹配。

### 3.3. `MACHINE_ID:007`

产品开发 ID，可由字符与数字组成，打包 `updata.img` 时使用。不同项目使用不同 ID 识别机型；recovery 升级时也可判断固件是否匹配。

### 3.4. `MANUFACTURER: rk3326`

厂商信息，打包 `updata.img` 时使用，可自行修改，供升级工具显示。

### 3.5. `MAGIC: 0x5041524B`

MAGIC 魔数，不能修改。部分较新 AP 使用 DTS 后此项不再起作用，但为兼容仍不得删除或修改。

### 3.6. `ATAG: 0x60000800`

ATAG 不能修改。部分较新 AP 使用 DTS 后此项不再起作用，但为兼容仍不得删除或修改。

### 3.7. `MACHINE: 3226`

供内核识别，必须与内核匹配，不能随意修改。原稿列出的识别码如下。

```text
RK29xx: MACHINE:2929
RK292x: MACHINE:2928
RK3066: MACHINE:3066
RK3326: MACHINE:3326
```

### 3.8. `CHECK_MASK: 0x80`

保留字段，不能修改。

### 3.9. `TYPE: GPT`

表示使用文件中 CMDLINE 定义的分区创建 GPT；原稿说明此模式下 parameter 文件本身不会烧录到 NVM（NAND、EMMC 等）存储器件。

### 3.10. CMDLINE

`console=ttyFIQ0 androidboot.console=ttyFIQ0` 定义串口。

`initrd=0x62000000,0x00800000`：第一个参数是 boot.img 加载到 SDRAM 的地址，第二个是 ramdisk 大小；原稿称当时 ramdisk 大小没有限制。

`androidboot.xxx` 在 Android 启动时使用；某些平台在内核 DTS 中定义。一般无需修改，使用发布 SDK 的默认值即可。

#### MTD 分区定义

```text
mtdparts=rk29xxnand:0x00002000@0x00002000(uboot),0x00002000@0x00004000(trust),0x00002000@0x00006000(misc),0x00008000@0x00008000(resource),0x00010000@0x00010000(kernel),0x00010000@0x00020000(boot),0x00020000@0x00030000(recovery),0x00038000@0x00050000(backup),0x00002000@0x00088000(security),0x00100000@0x0008a000(cache),0x00400000@0x0018a000(system),0x00008000@0x0058a000(metadata),0x00080000@0x00592000(vendor),0x00080000@0x00612000(oem),0x00000400@0x00692000(frp),-@0x00692400(userdata)
```

1. 为保持兼容，原稿所述 RK AP 均使用 `rk29xxnand` 标识。

2. 例如 `0x00002000@0x00008000(boot)`：`@` 前为分区大小，后为起始位置，括号内为分区名。数值单位均为 sector，1 sector = 512 Bytes。本例 boot 从 0x8000 sectors 开始，大小 0x2000 sectors，即原稿所称 4MB（按二进制换算为 4 MiB）。

3. 为保证性能，各分区起始地址须按 32KB（64 sectors）对齐，大小也是 32KB 的整数倍。

4. sparse 格式镜像升级时会擦除数据。为更好兼容，对应分区最好按 4MB 对齐，大小也设为 4MB 的整数倍。

5. GPT 模式中 parameter 地址是真实逻辑地址（LBA）。例如 uboot 定义为 0x4000，烧录至 EMMC 或 NAND 的逻辑地址也为 0x4000。最后一个分区须指定 grow 参数，工具把剩余空间全部分配给它。

| 名称 | Parameter 定义地址 | EMMC 逻辑地址 | NAND 逻辑地址 | 大小 |
| --- | --- | --- | --- | --- |
| GPT | -- | 0 | 0 | 32KB |
| LOADER | -- | 0x40 | 0x40 | 4MB-32KB |
| 保留 | -- | 0x2000 | 0x2000 | 4MB |
| UBOOT | 0x4000 | 0x4000 | 0x4000 | 4MB |
| TRUST | 0x6000 | 0x6000 | 0x6000 | 4MB |

6. 传统 cmdline 模式：EMMC 的前 0–4MB 预留给 loader，因此 parameter 定义的地址须加 4MB（0x2000 sectors）。例如 uboot 定义 0x2000，实际 EMMC 地址为 0x4000，与 GPT 示例相同。NAND 为兼容旧产品，定义的地址就是真实逻辑地址；定义 0x2000 则写入 0x2000，与 GPT 示例不同。

| 名称 | Parameter 定义地址 | EMMC 逻辑地址 | NAND 逻辑地址 | 大小 |
| --- | --- | --- | --- | --- |
| 保留 | -- | 0 | 0 | 32KB |
| LOADER | -- | 0x40 | 0x40 | 4MB-32KB |
| parameter | -- | 0x2000 | 0x0 | 4MB |
| UBOOT | 0x2000 | 0x4000 | 0x2000 | 4MB |
| TRUST | 0x4000 | 0x6000 | 0x4000 | 4MB |

NAND FLASH 设备可能在 0x40 写入 loader 镜像，与 parameter 同处一个 4MB 空间；原稿说明有效数据错开存放，不会相互覆盖。不能因此假定任意自定义布局都安全。

## 4. 常见问题和解决办法

原稿第 5 页只有本节标题，没有问题或解答正文；不补造缺失内容。

[Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/)

{% endraw %}
