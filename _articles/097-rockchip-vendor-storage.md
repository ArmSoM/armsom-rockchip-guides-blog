---
title: "Rockchip Vendor Storage: Complete Data Layout, ID Definitions and U-Boot/Linux APIs"
description: "Rockchip Vendor Storage: Complete Data Layout, ID Definitions and U-Boot/Linux APIs — Rev.08, SN, MAC, NVM, ioctl."
translation_key: "097-rockchip-vendor-storage"
slug: "097-rockchip-vendor-storage"
lang: "en"
date: "2026-10-22"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "Vendor Storage", "NVM", "Linux", "U-Boot"]
excerpt: "Rockchip Vendor Storage: Complete Data Layout, ID Definitions and U-Boot/Linux APIs — Rev.08, SN, MAC, NVM, ioctl."
---

{% raw %}

# Rockchip Vendor Storage: Complete Data Layout, ID Definitions and U-Boot/Linux APIs

This complete article follows Appnote_rk_storage_0001, Rev.08, pages 4–23. The only supplied PDF is in the Chinese directory but its actual body is English. English preserves that original; Chinese, Russian and German fully translate it. All four languages use its original English diagrams and screenshots; no separate Chinese or English-directory PDF was supplied. This is an ArmSoM platform reference, not proof of support on every board. The source does not specify an exact SoC, board, SDK/BSP or kernel version; verify storage backend, boot layout, driver configuration, API ABI and device node against the actual platform. No hardware read/write or power-loss validation was performed.

> Warning: the final write example overwrites ID 1 (SN) with bytes 0–31. Do not run it on production devices. Back up device identity/provisioning data first. Source types, error macros and file-descriptor cleanup are incomplete; code is retained for traceability, not certified runnable.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel) · [EDITORIAL-NOTES](/docs/rockchip-vendor-storage/EDITORIAL-NOTES.md)

<!-- PDF p.4 -->

## 1 Application Note Summary

Vendor storage is designed for storing SN, MAC and other vendor data. Features:

- Unique ID access
- Reliable data validation
- Power-loss recovery
- Readable and writable from PC
- Readable and writable from UBOOT
- Readable and writable from the kernel
- Readable and writable from Linux applications

<!-- PDF p.5 -->

## 2 Vendor Storage Architecture

![Vendor Storage architecture — PDF p.5](/docs/rockchip-vendor-storage/assets/en-original-p005-figure-01.png)

The diagram connects PC → USB → UBOOT and Linux Application → IOCTL NODE to Vendor Storage API; Kernel also connects to Vendor Storage API. Storage API provides the lower layer for EMMC, SPI NOR and NAND.

<!-- PDF p.6 -->

## 3 Data Layout

### 3.1 SPI NOR and EMMC

![SPI NOR and EMMC data layouts — PDF p.6](/docs/rockchip-vendor-storage/assets/en-original-p006-figure-01.png)

The original figure expands Header / Index / Data within each vendor block. Its SPI NOR labels show 4K before a 28K region, with four 4K block labels in the expanded vendor area. The EMMC labels show 3.5M before a 256K region, expanded into four 64K blocks. Keep these source labels and verify their applicability against the actual boot/storage layout; the diagram is not a universal partitioning command.

<!-- PDF p.7 -->

### 3.2 SPI NAND / SLC NAND

![MTD and FTL NAND data layouts — PDF p.7](/docs/rockchip-vendor-storage/assets/en-original-p007-figure-01.png)

- MTD: define a `vnvm` partition of 512KB or larger to enable vendor storage. The diagram shows four 4K blocks and Header / Index / Data within the `vnvm` area.
- With FTL: the diagram places four 4K blocks in the reserved area of SPI/SLC NAND (FTL). The system API cannot access this reserved area.

<!-- PDF p.8 -->

### 3.3 Record layout

| Offset (B) | Size (B) | Name |
| --- | --- | --- |
| 0x0000 | 0x0004 | Tag, the value is 0x524B5644. |
| 0x0004 | 0x0004 | Version, increase after write |
| 0x0008 | 0x0002 | Next index |
| 0x000A | 0x0002 | Total items |
| 0x000C | 0x0002 | Free offset |
| 0x000E | 0x0002 | Free size |
| 0x0010 | 0x0002 | Item0-&gt;id |
| 0x0012 | 0x0002 | Item0-&gt;offset |
| 0x0014 | 0x0002 | Item0-&gt;size |
| 0x0016 | 0x0002 | Item0-&gt;flag(reversed) |
| 0x0018 | 0x0008 | Item1 |
| … | … | Item x |
| --- | --- | Data (EMMC: about 62KB, other: about 3.5KB) |
| Size – 0x08 | 0x0004 | Hash |
| Size – 0x04 | 0x0004 | Version2, the value is the same as the Version |

<!-- PDF p.9 -->

## 4 ID Definitions

| ID | Function |
| --- | --- |
| 0 | reserved |
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
| 14 | SENSOR CALIBRATION |
| 15 | IMEI |
| 16 | LAN_RGMII_DL |
| 17 | EINK_VCOM_ID |
| 18 | FIRMWARE_VER_ID |
| 19 | HDCP_2X_RX_ID |
| 20 | HDCP_2X_HDMIRX_ID |
| 21 – 31 | RK reserved for future use |
| 32 - 65535 | Vendor use |

<!-- PDF p.10 -->

Data is stored in NVM with 64-byte alignment. Each item therefore has a minimum allocation of 64 bytes: writing 1–64 bytes allocates 64 bytes; writing 65–128 bytes allocates 128 bytes.

<!-- PDF p.11 -->

## 5 API for UBOOT

`u-boot/board/rockchip/common/storage/storage.c`

### `vendor_storage_init`

```c
int vendor_storage_init(void);
```

| Field | Description |
| --- | --- |
| Function | Initialize vendor storage |
| Input | none |
| Return | 0: initialization succeeded; other: initialization failed |

### `vendor_storage_read`

```c
int vendor_storage_read(u32 id, void *pbuf, u32 size);
```

| Field | Description |
| --- | --- |
| Function | Read vendor storage by ID |
| Input | id: item ID; pbuf: data buffer; size: number of bytes to read |
| Return | -1: read failed; other: number of bytes read |

<!-- PDF p.12 -->

### `vendor_storage_write`

```c
int vendor_storage_write(u32 id, void *pbuf, u32 size);
```

| Field | Description |
| --- | --- |
| Function | Write vendor storage by ID |
| Input | id: item ID; pbuf: data buffer; size: number of bytes to write |
| Return | 0: write succeeded; other: write failed |

<!-- PDF p.13 -->

## 6 API for the Kernel

`kernel/drivers/soc/rockchip/rk_vendor_storage.c`

`kernel/drivers/soc/rockchip/sdmmc_vendor_storage.c`

### `rk_vendor_read`

```c
int rk_vendor_read(u32 id, void *pbuf, u32 size);
```

| Field | Description |
| --- | --- |
| Function | Read vendor storage by ID |
| Input | id: item ID; pbuf: data buffer; size: number of bytes to read |
| Return | -1: read failed; other: number of bytes read |

### `rk_vendor_write`

```c
int rk_vendor_write(u32 id, void *pbuf, u32 size);
```

| Field | Description |
| --- | --- |
| Function | Write vendor storage by ID |
| Input | id: item ID; pbuf: data buffer; size: number of bytes to write |
| Return | 0: write succeeded; other: write failed |

<!-- PDF p.14 -->

## 7 Kernel Configuration

### Makefile

![Original Makefile configuration — PDF p.14](/docs/rockchip-vendor-storage/assets/en-original-p014-figure-01.png)

```makefile
#
# Rockchip soc drivers
#
obj-$(CONFIG_MMC_DW_ROCKCHIP) += sdmmc_vendor_storage.o
obj-$(CONFIG_ROCKCHIP_VENDOR_STORAGE) += rk_vendor_storage.o
```

### Menuconfig

![Original menuconfig help — PDF p.14](/docs/rockchip-vendor-storage/assets/en-original-p014-figure-02.png)

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

Select `y` to enable vendor storage support for SN, MAC, BT ADDR and similar data. The original screenshot shows the symbol enabled (`[=y]`), a boolean option under Device Drivers → SOC (System On Chip) specific Drivers. The dependency is `ARCH_ROCKCHIP [=y] || COMPILE_TEST`; the definition is at `drivers/soc/rockchip/Kconfig:6`.

<!-- PDF p.15 -->

## 8 PC Demo Tool

**1.** Select the **SN** option, enter the SN value, and press **ENTER** to add the SN item to the write request list. The example uses `123SN`; the screenshot status is `Not found rockusb`.

![Add SN to the request list — PDF p.15](/docs/rockchip-vendor-storage/assets/en-original-p015-figure-01.png)

<!-- PDF p.16 -->

**2.** Press **Burning** to write data into vendor storage. The source shows `Burning OK.` and `Found one loader`.

![Write operation result in the original — PDF p.16](/docs/rockchip-vendor-storage/assets/en-original-p016-figure-01.png)

<!-- PDF p.17 -->

**3.** Select **SN** and press **Read** to read the data back from vendor storage. The example shows `123SN`, `Reading OK.` and `Found one loader`.

![Read operation result in the original — PDF p.17](/docs/rockchip-vendor-storage/assets/en-original-p017-figure-01.png)

<!-- PDF p.18 -->

## 9 PC Tool Source Code

![Original PC project file listing — PDF p.18](/docs/rockchip-vendor-storage/assets/en-original-p018-figure-01.png)

The source provides a project-directory screenshot, not the contents of these source files. The truncated name below remains truncated; its hidden suffix is not reconstructed.

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

## 10 PC Tool: Read Data

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

Read provisioning data by ID. `pDataBuffer` is allocated by the caller; `nBufferSize` supplies the buffer size on input and actual data size on output. `dwLayer` selects the device layer and defaults to 0. Return `TRUE` on success, `FALSE` on failure.

<!-- PDF p.20 -->

## 11 PC Tool: Write Data

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

Write provisioning data by ID. The caller allocates `pDataBuffer`; `nBufferSize` is the input buffer size. `dwLayer` is the device layer, default 0. Return `TRUE` on success, `FALSE` on failure.

<!-- PDF p.21 -->

## 12 Linux Demo Code

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

### 12.1 Read test

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

### 12.2 Write test

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
