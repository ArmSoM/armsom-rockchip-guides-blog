---
title: "Rockchip Vendor Storage V1.3.0: Complete Layouts, IDs and U-Boot/Linux/Android APIs"
description: "Rockchip Vendor Storage V1.3.0: Complete Layouts, IDs and U-Boot/Linux/Android APIs — RK-KF-YF-C35, kernel 4.19/5.10/6.1, GKI, SN, MAC."
translation_key: "100-rockchip-vendor-storage-v13"
slug: "100-rockchip-vendor-storage-v13"
lang: "en"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "Vendor Storage", "GKI", "Linux", "Android"]
excerpt: "Rockchip Vendor Storage V1.3.0: Complete Layouts, IDs and U-Boot/Linux/Android APIs — RK-KF-YF-C35, kernel 4.19/5.10/6.1, GKI, SN, MAC."
---

{% raw %}

# Rockchip Vendor Storage V1.3.0: Complete Layouts, IDs and U-Boot/Linux/Android APIs

This article preserves the complete technical body of RK-KF-YF-C35 V1.3.0 (English PDF, pages 5–18). Only an English original was supplied; Chinese, Russian and German are full translations and all four languages use the original English figures. This is distinct from the older Rev.08 note in article 097: layouts, IDs and GKI/Android interfaces differ. The source names RockChip kernels 4.19, 5.10 and 6.1, not specific ArmSoM boards or SDK/BSP releases. This is a platform reference, not universal support certification: verify the actual board SoC, storage backend, reserved-region layout, kernel ABI/module configuration, Android branch and SDK/BSP. No hardware reads/writes or power-loss tests were performed.

> Safety and source ambiguities: the example overwrites ID 1 (SN) with bytes 0–31. Do not run it on production devices; back up identity/provisioning data first. ID 1063 has a Super-Resolution function label but a MEMC description; ID 76 says “Offline key reserved field” although 1076 maps back to it. Both are preserved, not guessed. ID 61 combines Super-Resolution reservation and HDCP2.x RKIV. Do not substitute the ID allocation from article 097/099. The GKI module sentence is grammatically unclear; verify how ram_vendor_storage.ko is built/loaded for the actual BSP. Code retains source spellings, types and incomplete error/cleanup definitions.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel) · [EDITORIAL-NOTES](/docs/rockchip-vendor-storage-v13/EDITORIAL-NOTES.md)

<!-- English PDF p.5 -->

## 1. Application Note Summary

<!-- English PDF p.5 -->

Vendor storage is designed to store SN, MAC and other vendor data.

Features:

- Unique ID Access
- Reliable Data Validation
- Power Lost Recovery
- Writable and Readable for PC
- Writable and Readable for UBOOT
- Writable and Readable for Kernel
- Writable and Readable for Linux Application

<!-- English PDF p.5 -->

## 2. Vendor Storage Architecture

<!-- English PDF p.5 -->

![2. Vendor Storage Architecture: original English figure, page 5](/docs/rockchip-vendor-storage-v13/assets/en-p005-figure-01.png)

*2. Vendor Storage Architecture: original English figure, page 5*

<!-- English PDF p.6 -->

## 3. Data Layout

<!-- English PDF p.6 -->

### 3.1 SPI NOR Data Layout

<!-- English PDF p.6 -->

![3.1 SPI NOR Data Layout: original English figure, page 6](/docs/rockchip-vendor-storage-v13/assets/en-p006-figure-01.png)

*3.1 SPI NOR Data Layout: original English figure, page 6*

<!-- English PDF p.6 -->

### 3.2 Raw NAND and SPI NAND Data Layout

<!-- English PDF p.6 -->

![3.2 Raw NAND and SPI NAND Data Layout: original English figure, page 6](/docs/rockchip-vendor-storage-v13/assets/en-p006-figure-02.png)

*3.2 Raw NAND and SPI NAND Data Layout: original English figure, page 6*

<!-- English PDF p.7 -->

### 3.3 EMMC Data Layout

<!-- English PDF p.7 -->

![3.3 EMMC Data Layout: original English figure, page 7](/docs/rockchip-vendor-storage-v13/assets/en-p007-figure-01.png)

*3.3 EMMC Data Layout: original English figure, page 7*

<!-- English PDF p.7 -->

### 3.4 Data Structure

<!-- English PDF p.7 -->

![3.4 Data Structure: original English figure, page 7](/docs/rockchip-vendor-storage-v13/assets/en-p007-figure-02.png)

*3.4 Data Structure: original English figure, page 7*

| Offset (B) | Size (B) | Name |
| --- | --- | --- |
| 0x0000 | 0x0004 | Tag, the value is 0x524B5644. |
| 0x0004 | 0x0004 | Version, increase after write |
| 0x0008 | 0x0002 | Next index |
| 0x000A | 0x0002 | Total items |
| 0x000C | 0x0002 | Free offset |
| 0x000E | 0x0002 | Free size |
| 0x0010 | 0x0002 | Item0->id |
| 0x0012 | 0x0002 | Item0->offset |
| 0x0014 | 0x0002 | Item0->size |
| 0x0016 | 0x0002 | Item0->flag(reversed) |
| 0x0018 | 0x0008 | Item1 |
| ... | ... | Item x |
| --- | --- | Data |
| Size – 0x08 | 0x0004 | Hash |
| Size – 0x04 | 0x0004 | Version2, the value is the same as the Version |

<!-- English PDF p.8 -->

### 3.5 ID Define

<!-- English PDF p.8 -->

| ID | Function | Description |
| --- | --- | --- |
| 1 | SN | Serial Number |
| 2 | WIFI MAC | WIFI MAC Address |
| 3 | LAN MAC | Ethernet MAC Address |
| 4 | BT MAC | Bluetooth MAC Address |
| 5 | HDMITX HDCP1.4 KEY | HDMITX HDCP1.4 KEY |
| 6 | DP HDCP1.4 KEY | DP HDCP1.4 KEY |
| 7 | HDCP_2X_ID |  |
| 8 | DRM_KEY_ID |  |
| 9 | PLAYREADY_CERT_ID |  |
| 10 | ATTENTION_KEY_ID |  |
| 11 | PLAYREADY_ROOT_KEY_0_ID |  |
| 12 | PLAYREADY_ROOT_KEY_1_ID |  |
| 13 | HDMIRX HDCP1.4 KEY | HDMIRX HDCP1.4 KEY |
| 14 | SENSOR_CALIBRATION_ID |  |
| 15 | IMEI_ID |  |
| 16 | LAN_RGMII_DL_ID |  |
| 17 | EINK_VCOM_ID | E-ink Screen VCOM Voltage |
| 18 |  |  |
| 19 |  |  |
| 20 | HDMIRX HDCP2.3 KEY | HDMIRX HDCP2.3 KEY |
| ... |  |  |
| 60 | sr | Stores the Super-Resolution online authorization key, corresponding to the offline key position +1000, i.e., 1060 |
| 61 | Super-Resolution Algorithm Reserved Field / HDCP2.x RKIV | Super-Resolution algorithm reserved field, corresponding to offline reserved 1061/RKIV is a 16-byte encryption key for HDMI2.x firmware, providing additional security protection. Currently, some customers of 3528 and 356x use this additional encryption scheme. |

<!-- English PDF p.9 -->

| ID | Function | Description |
| --- | --- | --- |
| 62 | memc | Stores the MEMC online authorization key, corresponding to the offline key position +1000, i.e., 1062 |
| 63 | MEMC Algorithm Reserved Field | MEMC algorithm reserved field, corresponding to offline reserved 1063 |
| 64 | pq | Stores the PQ online authorization key, corresponding to the offline key position +1000, i.e., 1064 |
| 65 | PQ Algorithm Reserved Field | PQ algorithm reserved field, corresponding to offline reserved 1065 |
| 66 | RKP Reserved Field | Used by RKP CSR, serial number when generating CSR |
| 67 | RKP Reserved Field | Used by RKP CSR, content of generated CSR |
| 68 | multi-module | Stores the multi-module online authorization key, corresponding to the offline key position +1000, i.e., 1068 |
| 69 | multi-module Reserved Field | multi-module reserved field, corresponding to offline reserved 1069 |
| 70 | touch_read | Stores the touch reading online authorization key, corresponding to the offline key position +1000, i.e., 1070 |
| 71 | touch_read Algorithm Reserved Field | Touch reading algorithm reserved field, corresponding to offline reserved 1071 |
| 72 | rknpu_ocr | Stores the OCR algorithm online authorization key, corresponding to the offline key position +1000, i.e., 1072 |
| 73 | rknpu_ocr Algorithm Reserved Field | OCR algorithm reserved field, corresponding to offline reserved 1073 |
| 74 | face | Stores the face unlock online authorization key, corresponding to the offline key position +1000, i.e., 1074 |
| 75 | Face Unlock Algorithm Reserved Field | Face unlock algorithm reserved field, corresponding to offline reserved 1075 |
| 76 | knowledge | Offline key reserved field |
| 77 | knowledge Algorithm Reserved Field | Knowledge algorithm reserved field, corresponding to offline reserved 1077 |
| ... |  |  |
| 84 | asr | Stores the ASR voice-to-text algorithm online authorization key, corresponding to the offline key position +1000, i.e., 1084 |

<!-- English PDF p.10 -->

| ID | Function | Description |
| --- | --- | --- |
| 85 | asr Algorithm Reserved Field | ASR algorithm reserved field, corresponding to offline reserved 1085 |
| 86 | llm | Stores the LLM translation online authorization key, corresponding to the offline key position +1000, i.e., 1086 |
| 87 | llm Algorithm Reserved Field | LLM translation algorithm reserved field, corresponding to offline reserved 1087 |
| 88 | tts | Stores the TTS text-to-speech algorithm online authorization key, corresponding to the offline key position +1000, i.e., 1088 |
| 89 | tts Algorithm Reserved Field | TTS algorithm reserved field, corresponding to offline reserved 1089 |
| ... |  |  |
| 96 | aieraser | Stores the AI Eraser algorithm online authorization key, corresponding to the offline key position +1000, i.e., 1096 |
| 97 | aieraser Algorithm Reserved Field | AI Eraser algorithm reserved field, corresponding to offline reserved 1097 |
| ... |  |  |
| 156 | customer reservation | Reserved for customer use, not for internal use by RK |
| ... | customer reservation | Reserved for customer use, not for internal use by RK |
| 256 | customer reservation | Reserved for customer use, not for internal use by RK |
| 1060 | Super-Resolution Offline Key Position | Super-Resolution offline key position, -1000 equals online key position, i.e., 60 |
| 1061 | Super-Resolution Offline Key Reserved Field | Super-Resolution offline key reserved field |
| 1062 | MEMC Offline Key Position | MEMC offline key position, -1000 equals online key position, i.e., 62 |
| 1063 | Super-Resolution Offline Key Reserved Field | MEMC offline key reserved field |
| 1064 | PQ Offline Key Position | PQ offline key position, -1000 equals online key position, i.e., 64 |
| 1065 | PQ Offline Key Reserved Field | PQ offline key reserved field |
| 1068 | multi-module Offline Key Position | multi-module offline key position, -1000 equals online key position, i.e., 68 |

<!-- English PDF p.11 -->

| ID | Function | Description |
| --- | --- | --- |
| 1069 | multi-module Offline Key Reserved Field | multi-module offline key reserved field |
| 1070 | Touch Read Offline Key Position | Touch Read offline key position, -1000 equals online key position, i.e., 70 |
| 1071 | Touch Read Offline Key Reserved Field | Touch Read offline key reserved field |
| 1072 | OCR Offline Key Position | OCR offline key position, -1000 equals online key position, i.e., 72 |
| 1073 | OCR Offline Key Reserved Field | OCR offline key reserved field |
| 1074 | Face Offline Key Position | Face offline key position, -1000 equals online key position, i.e., 74 |
| 1075 | Face Offline Key Reserved Field | Face offline key reserved field |
| 1076 | Knowledge Offline Key Position | Knowledge offline key position, -1000 equals online key position, i.e., 76 |
| 1077 | Knowledge Offline Key Reserved Field | Knowledge offline key reserved field |
| 1084 | ASR Offline Key Position | ASR offline key position, -1000 equals online key position, i.e., 84 |
| 1085 | ASR Offline Key Reserved Field | ASR offline key reserved field |
| 1086 | LLM Offline Key Position | LLM offline key position, -1000 equals online key position, i.e., 86 |
| 1087 | LLM Offline Key Reserved Field | LLM offline key reserved field |
| 1088 | TTS Offline Key Position | TTS offline key position, -1000 equals online key position, i.e., 88 |
| 1089 | TTS Offline Key Reserved Field | TTS offline key reserved field |
| 1096 | AI Eraser Algorithm Offline Key Position | AI Eraser Algorithm offline key position, -1000 equals online key position, i.e., 96 |
| 1097 | AI Eraser Algorithm Offline Key Reserved Field | AI Eraser Algorithm offline key reserved field |

<!-- English PDF p.11 -->

Note: Data is in accordance with the 64 - bytes alignment stored in the NVM, this suggests that a minimum allocation for each item is 64 bytes, so write 1-64 bytes, the space will be allocated as 64 bytes, write 65-128 bytes, the space will be allocated as 128 bytes.

<!-- English PDF p.12 -->

## 4. API For UBOOT

<!-- English PDF p.12 -->

Source code u-boot/board/rockchip/common/storage/storage.c

<!-- English PDF p.12 -->

```text
int vendor_storage_init(void)
function: Initialize vendor storage
input : none
return: 0: Initialize success
        other: Initialize fail

int vendor_storage_read(u32 id, void *pbuf, u32 size)
function: read vendor storage by id
input : id, item id;
pbuf, data buffer;
size, number byte to read.
return: other: number byte have read.
        -1: read fail.

int vendor_storage_write(u32 id, void *pbuf, u32 size)
function: write vendor storage by id
input : id: item id;
pbuf: data buffer;
size: number bytes to write.
return:  0: write success
         other: write fail
```

<!-- English PDF p.12 -->

### 4.1 API For NON GKI kernel

<!-- English PDF p.12 -->

Source code kernel/drivers/soc/rockchip/rk_vendor_storage.c

<!-- English PDF p.12 -->

```text
int rk_vendor_read(u32 id, void *pbuf, u32 size)
function: read vendor storage by id
input : id: item id;
pbuf: data buffer;
size: number bytes to read.
return: other: number byte have read.
        -1: read fail

int rk_vendor_write(u32 id, void *pbuf, u32 size)
function: write vendor storage by id
input : id, item id;
pbuf: data buffer;
size: number bytes to write.
return: 0: write success
        other : write fail
```

<!-- English PDF p.13 -->

Menuconfig

<!-- English PDF p.13 -->

![4.1 API For NON GKI kernel: original English figure, page 13](/docs/rockchip-vendor-storage-v13/assets/en-p013-figure-01.png)

*4.1 API For NON GKI kernel: original English figure, page 13*

```text
CONFIG_ROCKCHIP_VENDOR_STORAGE:

Say Y here to enable vendor storage support.
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

<!-- English PDF p.13 -->

### 4.2 API For GKI kernel

<!-- English PDF p.13 -->

Due to the kernel interface limitations of GKI, the kernel needs to be added to ram_vendor_storage.ko. Only then can Vendor storage support the read interface, but not the write interface.

<!-- English PDF p.13 -->

### 4.3 API for Android

<!-- English PDF p.13 -->

Source code hardware/rockchip/libvendor_storage/vendor_storage.c

<!-- English PDF p.13 -->

```text
/*
 * vendor_storage_init must be call first
 * rerurn:  ret=0 succes   ret<0 failed
 */
 int vendor_storage_init(void);

/*
 * emmc_vendor_write
 * id: item id
 * pbuf: write data
 * size: vendor_item.size
 * rerurn:  ret>0 succes   ret<0 failed
 */
 int emmc_vendor_write(uint32 id, void *pbuf, uint32 size);

 /*
 * emmc_vendor_read
 * id: item id
 * pbuf: read data
 * size: vendor_item.size
 * rerurn:  ret>0 succes   ret<0 failed
 */
 int emmc_vendor_read(uint32 id, void *pbuf, uint32 size);
```

<!-- English PDF p.13 -->

For specific usage, you can refer to hardware/rockchip/libvendor_storage/vendor_storage_test.c.

<!-- English PDF p.14 -->

## 5. PC Demo Tool

<!-- English PDF p.14 -->

Select SN option and input SN value, press ENTER key to add SN item to write request list

<!-- English PDF p.14 -->

![5. PC Demo Tool: original English figure, page 14](/docs/rockchip-vendor-storage-v13/assets/en-p014-figure-01.png)

*5. PC Demo Tool: original English figure, page 14*

<!-- English PDF p.14 -->

Press Burning button will write data to vendor storage

<!-- English PDF p.15 -->

![5. PC Demo Tool: original English figure, page 15](/docs/rockchip-vendor-storage-v13/assets/en-p015-figure-01.png)

*5. PC Demo Tool: original English figure, page 15*

<!-- English PDF p.15 -->

Select SN option and press Read button to read data form vendor storage

<!-- English PDF p.15 -->

![5. PC Demo Tool: original English figure, page 15](/docs/rockchip-vendor-storage-v13/assets/en-p015-figure-02.png)

*5. PC Demo Tool: original English figure, page 15*

<!-- English PDF p.16 -->

## 6. PC Tool Source Code

<!-- English PDF p.16 -->

PC Tool Read Data

<!-- English PDF p.16 -->

```text
/*----------------------------------------------------------------------
Name    : RK_ReadProvisioningData
Desc    : Read provisioning data by id
Params  : (IN)nID: id
          (OUT)pDataBuffer: buffer to save data, malloc by caller
          (IN|OUT)nBufferSize: in = size of buffer,out = actual data size
          (IN)dwLayer:device layer
Return  : TRUE: SUCCESSED
          FALSE: FAILED
----------------------------------------------------------------------*/
BOOL RK_ReadProvisioningData(USHORT nID,PBYTE pDataBuffer,USHORT &nBufferSize,DWORD dwLayer=0);
```

<!-- English PDF p.16 -->

PC Tool Write Data

<!-- English PDF p.16 -->

```text
 /*----------------------------------------------------------------------
Name    : RK_WriteProvisioningData
Desc    : Write provisioning data by id
Params  : (IN)nID: id
          (IN)pDataBuffer: buffer to save data, malloc by caller
          (IN)nBufferSize: size of buffer
          (IN)dwLayer:device layer
Return  : TRUE: SUCCESSED
          FALSE: FAILED
----------------------------------------------------------------------*/
BOOL RK_WriteProvisioningData(USHORT nID,PBYTE pDataBuffer,USHORT nBufferSize,DWORD dwLayer=0);
```

<!-- English PDF p.16 -->

## 7. Linux Application Demo Code

<!-- English PDF p.16 -->

Access using the "vendor_storage" node provided by the kernel

<!-- English PDF p.16 -->

```text
#include <fcntl.h>
#include <sys/ioctl.h>

typedef unsigned short uint16;
typedef unsigned long uint32;
typedef unsigned char uint8;

#define VENDOR_REQ_TAG      0x56524551
#define VENDOR_READ_IO      _IOW('v', 0x01, unsigned int)
#define VENDOR_WRITE_IO     _IOW('v', 0x02, unsigned int)
#define VENDOR_SN_ID        1
#define VENDOR_WIFI_MAC_ID  2
#define VENDOR_LAN_MAC_ID   3
#define VENDOR_BLUETOOTH_ID 4

struct rk_vendor_req {
    u32 tag;
    u16 id;
    u16 len;
    u8 data[1];
};

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
    ret = ioctl(sys_fd, VENDOR_WRITE_IO, req);
    if(ret){
        ERROR("vendor write error\n");
        return -1;
    }

    return 0;
}
```

<!-- English PDF p.18 -->

The user mode applications access without kernel drivers

<!-- English PDF p.18 -->

Refer to the following code for implementation:
hardware/rockchip/libvendor_storage/vendor_storage_test.c

{% endraw %}
