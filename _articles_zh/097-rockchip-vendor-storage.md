---
title: "Rockchip Vendor Storage 完整指南：数据布局、ID 定义与 U-Boot/Linux 读写接口"
description: "Rockchip Vendor Storage 完整指南：数据布局、ID 定义与 U-Boot/Linux 读写接口 — Rev.08, SN, MAC, NVM, ioctl."
translation_key: "097-rockchip-vendor-storage"
slug: "097-rockchip-vendor-storage"
lang: "zh"
date: "2026-10-22"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "Vendor Storage", "NVM", "Linux", "U-Boot"]
excerpt: "Rockchip Vendor Storage 完整指南：数据布局、ID 定义与 U-Boot/Linux 读写接口 — Rev.08, SN, MAC, NVM, ioctl."
---

{% raw %}

# Rockchip Vendor Storage 完整指南：数据布局、ID 定义与 U-Boot/Linux 读写接口

本文完整整理 Appnote_rk_storage_0001、Rev.08 第 4–23 页。唯一提供的 PDF 位于中文目录，但实际正文是英文；英文保留原稿，中文、俄文、德文完整翻译该英文内容。四语均使用这份原稿的英文框图与截图，没有另行提供中文原图或英文目录 PDF。本文仅为 ArmSoM 平台参考，不代表所有板卡均支持。原稿没有明确 SoC、具体板卡、SDK/BSP 或内核版本，需针对实际平台核对存储后端、启动布局、驱动配置、接口 ABI 与设备节点。未进行硬件读写或掉电测试。

> 警告：最后的写入示例会用 0–31 字节覆盖 ID 1（SN）。不要在生产设备运行；须先备份设备身份和烧录数据。原稿类型、错误宏和文件描述符清理不完整，保留代码用于溯源，不保证直接可运行。

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel) · [EDITORIAL-NOTES](/docs/rockchip-vendor-storage/EDITORIAL-NOTES.md)

<!-- PDF p.4 -->

## 1 应用说明概要

Vendor Storage 用于存储 SN、MAC 及其他厂商数据。功能包括：

- 按唯一 ID 访问
- 可靠的数据校验
- 掉电恢复
- PC 端可读写
- UBOOT 可读写
- 内核可读写
- Linux 应用程序可读写

<!-- PDF p.5 -->

## 2 Vendor Storage 架构

![Vendor Storage 架构原图 — PDF p.5](/docs/rockchip-vendor-storage/assets/en-original-p005-figure-01.png)

原图连接关系为 PC → USB → UBOOT，以及 Linux Application → IOCTL NODE，接入 Vendor Storage API；Kernel 同样接入该 API。底层通过 Storage API 访问 EMMC、SPI NOR 与 NAND。

<!-- PDF p.6 -->

## 3 数据布局

### 3.1 SPI NOR 与 EMMC

![SPI NOR 与 EMMC 数据布局原图 — PDF p.6](/docs/rockchip-vendor-storage/assets/en-original-p006-figure-01.png)

原图展开每个 Vendor 数据块中的 Header / Index / Data。SPI NOR 图标注前部 4K、随后区域 28K，放大区域标出四个 4K 块；EMMC 图标注前部 3.5M、随后区域 256K，放大为四个 64K 块。保留原图数值，须对照实际启动和存储布局核对适用性，不能当成通用分区命令。

<!-- PDF p.7 -->

### 3.2 SPI NAND / SLC NAND

![MTD 与 FTL NAND 数据布局原图 — PDF p.7](/docs/rockchip-vendor-storage/assets/en-original-p007-figure-01.png)

- MTD：需定义至少 512KB 的 `vnvm` 分区才能启用 Vendor Storage。原图在 `vnvm` 区域中标出四个 4K 块及 Header / Index / Data。
- 使用 FTL：原图把四个 4K 块放在 SPI/SLC NAND (FTL) 的 reserved 区域。系统 API 无法访问该保留区域。

<!-- PDF p.8 -->

### 3.3 记录格式

| 偏移（B） | 大小（B） | 名称 |
| --- | --- | --- |
| 0x0000 | 0x0004 | Tag，值为 0x524B5644。 |
| 0x0004 | 0x0004 | Version，每次写入后递增 |
| 0x0008 | 0x0002 | 下一个索引 |
| 0x000A | 0x0002 | 条目总数 |
| 0x000C | 0x0002 | 空闲区偏移 |
| 0x000E | 0x0002 | 空闲区大小 |
| 0x0010 | 0x0002 | Item0-&gt;id |
| 0x0012 | 0x0002 | Item0-&gt;offset |
| 0x0014 | 0x0002 | Item0-&gt;size |
| 0x0016 | 0x0002 | Item0-&gt;flag(reversed) |
| 0x0018 | 0x0008 | Item1 |
| … | … | Item x |
| --- | --- | 数据（EMMC：约 62KB，其他：约 3.5KB） |
| Size – 0x08 | 0x0004 | Hash |
| Size – 0x04 | 0x0004 | Version2，值与 Version 相同 |

<!-- PDF p.9 -->

## 4 ID 定义

| ID | 功能 |
| --- | --- |
| 0 | 保留 |
| 1 | SN |
| 2 | WIFI MAC |
| 3 | LAN MAC |
| 4 | BT MAC |
| 5 | HDCP 1.4 HDMI |
| 6 | HDCP 1.4 DP |
| 7 | HDCP 2.X |
| 8 | DRM KEY |
| 9 | PLAYREADY Cert |
| 10 | ATTENTION KEY |
| 11 | PLAYREADY ROOT KEY 0 |
| 12 | PLAYREADY ROOT KEY 1 |
| 13 | HDCP 1.4 HDMIRX |
| 14 | SENSOR CALIBRATION（传感器校准） |
| 15 | IMEI |
| 16 | LAN_RGMII_DL |
| 17 | EINK_VCOM_ID |
| 18 | FIRMWARE_VER_ID |
| 19 | HDCP_2X_RX_ID |
| 20 | HDCP_2X_HDMIRX_ID |
| 21 – 31 | RK 预留，供未来使用 |
| 32 - 65535 | 厂商使用 |

<!-- PDF p.10 -->

数据在 NVM 中按 64 字节对齐存储，每个条目的最小分配空间为 64 字节：写入 1–64 字节分配 64 字节，写入 65–128 字节分配 128 字节。

<!-- PDF p.11 -->

## 5 UBOOT API

`u-boot/board/rockchip/common/storage/storage.c`

### `vendor_storage_init`

```c
int vendor_storage_init(void);
```

| 字段 | 说明 |
| --- | --- |
| 功能 | 初始化 Vendor Storage |
| 输入 | 无 |
| 返回 | 0：初始化成功；其他：初始化失败 |

### `vendor_storage_read`

```c
int vendor_storage_read(u32 id, void *pbuf, u32 size);
```

| 字段 | 说明 |
| --- | --- |
| 功能 | 按 ID 读取 Vendor Storage |
| 输入 | id：条目 ID；pbuf：数据缓冲区；size：读取字节数 |
| 返回 | -1：读取失败；其他：实际读取字节数 |

<!-- PDF p.12 -->

### `vendor_storage_write`

```c
int vendor_storage_write(u32 id, void *pbuf, u32 size);
```

| 字段 | 说明 |
| --- | --- |
| 功能 | 按 ID 写入 Vendor Storage |
| 输入 | id：条目 ID；pbuf：数据缓冲区；size：写入字节数 |
| 返回 | 0：写入成功；其他：写入失败 |

<!-- PDF p.13 -->

## 6 内核 API

`kernel/drivers/soc/rockchip/rk_vendor_storage.c`

`kernel/drivers/soc/rockchip/sdmmc_vendor_storage.c`

### `rk_vendor_read`

```c
int rk_vendor_read(u32 id, void *pbuf, u32 size);
```

| 字段 | 说明 |
| --- | --- |
| 功能 | 按 ID 读取 Vendor Storage |
| 输入 | id：条目 ID；pbuf：数据缓冲区；size：读取字节数 |
| 返回 | -1：读取失败；其他：实际读取字节数 |

### `rk_vendor_write`

```c
int rk_vendor_write(u32 id, void *pbuf, u32 size);
```

| 字段 | 说明 |
| --- | --- |
| 功能 | 按 ID 写入 Vendor Storage |
| 输入 | id：条目 ID；pbuf：数据缓冲区；size：写入字节数 |
| 返回 | 0：写入成功；其他：写入失败 |

<!-- PDF p.14 -->

## 7 内核配置

### Makefile

![Makefile 配置原图 — PDF p.14](/docs/rockchip-vendor-storage/assets/en-original-p014-figure-01.png)

```makefile
#
# Rockchip soc drivers
#
obj-$(CONFIG_MMC_DW_ROCKCHIP) += sdmmc_vendor_storage.o
obj-$(CONFIG_ROCKCHIP_VENDOR_STORAGE) += rk_vendor_storage.o
```

### Menuconfig

![menuconfig 帮助原图 — PDF p.14](/docs/rockchip-vendor-storage/assets/en-original-p014-figure-02.png)

```text
CONFIG_ROCKCHIP_VENDOR_STORAGE:

Say y here to enable vendor storage support.
Vendor storage is used for stored SN, MAC, BT ADDR etc.

Symbol: ROCKCHIP_VENDOR_STORAGE [=y]
Type  : boolean
Prompt: Rockchip vendor storage support
  Location:
    -> Device Drivers
      -> SOC (System On Chip) specific Drivers
  Defined at drivers/soc/rockchip/Kconfig:6
  Depends on: ARCH_ROCKCHIP [=y] || COMPILE_TEST
```

选择 `y` 可启用用于 SN、MAC、BT ADDR 等数据的 Vendor Storage 支持。原图显示符号已启用（`[=y]`），类型为 boolean，路径为 Device Drivers → SOC (System On Chip) specific Drivers。依赖为 `ARCH_ROCKCHIP [=y] || COMPILE_TEST`，定义位于 `drivers/soc/rockchip/Kconfig:6`。

<!-- PDF p.15 -->

## 8 PC 演示工具

**1.** 选择 **SN**，输入 SN 值并按 **ENTER**，将 SN 条目加入写入请求列表。示例为 `123SN`，该截图状态为 `Not found rockusb`。

![将 SN 加入请求列表 — PDF p.15](/docs/rockchip-vendor-storage/assets/en-original-p015-figure-01.png)

<!-- PDF p.16 -->

**2.** 按 **Burning** 将数据写入 Vendor Storage。原图显示 `Burning OK.` 和 `Found one loader`。

![原稿写入操作结果 — PDF p.16](/docs/rockchip-vendor-storage/assets/en-original-p016-figure-01.png)

<!-- PDF p.17 -->

**3.** 选择 **SN** 并按 **Read**，从 Vendor Storage 读回数据。示例显示 `123SN`、`Reading OK.` 和 `Found one loader`。

![原稿读取操作结果 — PDF p.17](/docs/rockchip-vendor-storage/assets/en-original-p017-figure-01.png)

<!-- PDF p.18 -->

## 9 PC 工具源码

![PC 工程文件列表原图 — PDF p.18](/docs/rockchip-vendor-storage/assets/en-original-p018-figure-01.png)

原稿提供工程目录截图，并未提供这些源码文件的正文。下列被截断的文件名保持截断状态，不猜测隐藏后缀。

```text
cmLib/
colorEdit/
FontStatic/
grid/
res/
upgradeLib/
ProvisioningTool.aps
ProvisioningTool.cpp
ProvisioningTool.h
ProvisioningTool.rc
ProvisioningTool.vcproj
ProvisioningTool.vcproj.HP-INPRC6N...
ProvisioningToolDlg.cpp
ProvisioningToolDlg.h
ReadMe.txt
resource.h
stdafx.cpp
stdafx.h
targetver.h
```

<!-- PDF p.19 -->

## 10 PC 工具：读取数据

```c
/*----------------------------------------------------------------------
Name   : RK_ReadProvisioningData
Desc   : Read provisioning data by id
Params : (IN)nID                    id
         (OUT)pDataBuffer:          buffer to save data, malloc by caller
         (IN|OUT)nBufferSize:       in = size of buffer,out = actual data size
         (IN)dwLayer:               device layer
Return : TRUE:  SUCCESSED
         FALSE: FAILED
----------------------------------------------------------------------*/
BOOL RK_ReadProvisioningData(USHORT nID,PBYTE pDataBuffer,USHORT &nBufferSize,DWORD dwLayer=0);
```

按 ID 读取烧录数据。`pDataBuffer` 由调用者分配；`nBufferSize` 输入为缓冲区大小，输出为实际数据大小。`dwLayer` 表示设备层，默认值为 0。成功返回 `TRUE`，失败返回 `FALSE`。

<!-- PDF p.20 -->

## 11 PC 工具：写入数据

```c
/*----------------------------------------------------------------------
Name   : RK_WriteProvisioningData
Desc   : Write provisioning data by id
Params : (IN)nID                    id
         (IN)pDataBuffer:           buffer to save data, malloc by caller
         (IN)nBufferSize:           size of buffer
         (IN)dwLayer:               device layer
Return : TRUE:  SUCCESSED
         FALSE: FAILED
----------------------------------------------------------------------*/
BOOL RK_WriteProvisioningData(USHORT nID,PBYTE pDataBuffer,USHORT nBufferSize,DWORD dwLayer=0);
```

按 ID 写入烧录数据。调用者分配 `pDataBuffer`；`nBufferSize` 为输入缓冲区大小。`dwLayer` 是设备层，默认 0。成功返回 `TRUE`，失败返回 `FALSE`。

<!-- PDF p.21 -->

## 12 Linux 示例代码

```c
#include <fcntl.h>
#include <sys/ioctl.h>

typedef unsigned short uint16;
typedef unsigned long uint32;
typedef unsigned char uint8;

#define VENDOR_REQ_TAG 0x56524551
#define VENDOR_READ_IO _IOW('v', 0x01, unsigned int)
#define VENDOR_WRITE_IO _IOW('v', 0x02, unsigned int)
#define VENDOR_SN_ID 1
#define VENDOR_WIFI_MAC_ID 2
#define VENDOR_LAN_MAC_ID 3
#define VENDOR_BLUETOOTH_ID 4

struct rk_vendor_req {
    u32 tag;
    u16 id;
    u16 len;
    u8 data[1];
};
```

<!-- PDF p.22 -->

### 12.1 读取测试

```c
int vendor_storage_read_test(void)
{
    uint32 i;
    int ret ;
    uint8 p_buf[2048]; /* malloc req buffer or used extern buffer */
    struct rk_vendor_req *req;

    req = (struct rk_vendor_req *)p_buf;
    int sys_fd = open("/dev/vendor_storage",O_RDWR,0);
    if(sys_fd < 0){
        ERROR("vendor_storage open fail\n");
        return -1;
    }

    req->tag = VENDOR_REQ_TAG;
    req->id = VENDOR_SN_ID;
    req->len = 512; /* max read length to read*/
    ret = ioctl(sys_fd, VENDOR_READ_IO, req);
    /* return req->len is the real data length stored in the NV-storage */
    if(ret){
        ERROR("vendor read error\n");
        return -1;
    }
    return 0;
}
```

<!-- PDF p.23 -->

### 12.2 写入测试

```c
int vendor_storage_write_test(void)
{
    uint32 i;
    int ret ;
    uint8 p_buf[2048]; /* malloc req buffer or used extern buffer */
    struct rk_vendor_req *req;

    req = (struct rk_vendor_req *)p_buf;
    int sys_fd = open("/dev/vendor_storage",O_RDWR,0);
    if(sys_fd < 0){
        ERROR("vendor_storage open fail\n");
        return -1;
    }
    req->tag = VENDOR_REQ_TAG;
    req->id = VENDOR_SN_ID;
    req->len = 32; /* data len */
    for (i = 0; i < 32; i++)
        req->data[i] = i;
    rknand_print_hex_data("vendor write:", (uint32*)req, req->len + 8);
    ret = ioctl(sys_fd, VENDOR_WRITE_IO, req);
    if(ret){
        ERROR("vendor write error\n");
        return -1;
    }
    return 0;
}
```

{% endraw %}
