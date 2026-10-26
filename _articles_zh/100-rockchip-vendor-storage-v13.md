---
title: "Rockchip Vendor Storage V1.3.0：完整布局、ID 与 U-Boot/Linux/Android API"
description: "Rockchip Vendor Storage V1.3.0：完整布局、ID 与 U-Boot/Linux/Android API — RK-KF-YF-C35, kernel 4.19/5.10/6.1, GKI, SN, MAC."
translation_key: "100-rockchip-vendor-storage-v13"
slug: "100-rockchip-vendor-storage-v13"
lang: "zh"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "Vendor Storage", "GKI", "Linux", "Android"]
excerpt: "Rockchip Vendor Storage V1.3.0：完整布局、ID 与 U-Boot/Linux/Android API — RK-KF-YF-C35, kernel 4.19/5.10/6.1, GKI, SN, MAC."
---

{% raw %}

# Rockchip Vendor Storage V1.3.0：完整布局、ID 与 U-Boot/Linux/Android API

本文完整保留 RK-KF-YF-C35 V1.3.0 英文 PDF 第 5–18 页技术正文。仅提供英文原稿，中文、俄文和德文均完整翻译，四语统一使用英文原图。这与 097 篇旧 Rev.08 说明不同，布局、ID 及 GKI/Android 接口存在差异。原稿列出 RockChip kernel-4.19、kernel-5.10、kernel-6.1，未列具体 ArmSoM 板卡或 SDK/BSP 发行版。本文仅为平台参考，不作通用兼容认证：须核对板卡 SoC、存储后端、预留区域布局、内核 ABI/模块配置、Android 分支和 SDK/BSP。未进行硬件读写或掉电测试。

> 安全与原文疑点：示例会用 0–31 字节覆盖 ID 1（SN），不可直接在生产设备执行，先备份身份/预置数据。ID 1063 的功能名写超分辨率，说明却写 MEMC；ID 76 写“离线密钥预留字段”，但 1076 又指回它。均保留原始信息，不猜测修正。ID 61 同时用于超分辨率预留和 HDCP2.x RKIV。不能套用 097/099 篇的 ID 分配。GKI 模块原句语法不清，实际 ram_vendor_storage.ko 的构建与加载方式须按 BSP 核对。代码保留原稿拼写、类型及未补齐的错误宏/清理逻辑。

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel) · [EDITORIAL-NOTES](/docs/rockchip-vendor-storage-v13/EDITORIAL-NOTES.md)

<!-- English PDF p.5 -->

## 1. 应用说明概要

<!-- English PDF p.5 -->

Vendor Storage 用于存储 SN、MAC 等厂商数据。功能包括：

- 按唯一 ID 访问；
- 可靠的数据校验；
- 掉电恢复；
- PC 读写；
- UBOOT 读写；
- 内核读写；
- Linux 应用读写。

<!-- English PDF p.5 -->

## 2. Vendor Storage 架构

<!-- English PDF p.5 -->

![2. Vendor Storage 架构：英文原图，第 5 页](/docs/rockchip-vendor-storage-v13/assets/en-p005-figure-01.png)

*2. Vendor Storage 架构：英文原图，第 5 页*

<!-- English PDF p.6 -->

## 3. 数据布局

<!-- English PDF p.6 -->

### 3.1 SPI NOR 数据布局

<!-- English PDF p.6 -->

![3.1 SPI NOR 数据布局：英文原图，第 6 页](/docs/rockchip-vendor-storage-v13/assets/en-p006-figure-01.png)

*3.1 SPI NOR 数据布局：英文原图，第 6 页*

<!-- English PDF p.6 -->

### 3.2 Raw NAND 和 SPI NAND 数据布局

<!-- English PDF p.6 -->

![3.2 Raw NAND 和 SPI NAND 数据布局：英文原图，第 6 页](/docs/rockchip-vendor-storage-v13/assets/en-p006-figure-02.png)

*3.2 Raw NAND 和 SPI NAND 数据布局：英文原图，第 6 页*

<!-- English PDF p.7 -->

### 3.3 EMMC 数据布局

<!-- English PDF p.7 -->

![3.3 EMMC 数据布局：英文原图，第 7 页](/docs/rockchip-vendor-storage-v13/assets/en-p007-figure-01.png)

*3.3 EMMC 数据布局：英文原图，第 7 页*

<!-- English PDF p.7 -->

### 3.4 数据结构

<!-- English PDF p.7 -->

![3.4 数据结构：英文原图，第 7 页](/docs/rockchip-vendor-storage-v13/assets/en-p007-figure-02.png)

*3.4 数据结构：英文原图，第 7 页*

| 偏移 (B) | 大小 (B) | 名称 |
| --- | --- | --- |
| 0x0000 | 0x0004 | Tag，值为 0x524B5644。 |
| 0x0004 | 0x0004 | Version，写入后递增 |
| 0x0008 | 0x0002 | 下一个索引 |
| 0x000A | 0x0002 | item 总数 |
| 0x000C | 0x0002 | 空闲偏移 |
| 0x000E | 0x0002 | 空闲大小 |
| 0x0010 | 0x0002 | Item0->id |
| 0x0012 | 0x0002 | Item0->offset |
| 0x0014 | 0x0002 | Item0->size |
| 0x0016 | 0x0002 | Item0->flag(reversed) |
| 0x0018 | 0x0008 | Item1 |
| ... | ... | Item x |
| --- | --- | 数据 |
| Size – 0x08 | 0x0004 | Hash |
| Size – 0x04 | 0x0004 | Version2，与 Version 值相同 |

<!-- English PDF p.8 -->

### 3.5 ID 定义

<!-- English PDF p.8 -->

| ID | 功能 | 说明 |
| --- | --- | --- |
| 1 | SN | 序列号 |
| 2 | WIFI MAC | WIFI MAC 地址 |
| 3 | LAN MAC | 以太网 MAC 地址 |
| 4 | BT MAC | 蓝牙 MAC 地址 |
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
| 17 | EINK_VCOM_ID | 电子墨水屏 VCOM 电压 |
| 18 |  |  |
| 19 |  |  |
| 20 | HDMIRX HDCP2.3 KEY | HDMIRX HDCP2.3 KEY |
| ... |  |  |
| 60 | sr | 存储超分辨率在线授权密钥，对应离线密钥位置 +1000，即 1060。 |
| 61 | 超分辨率 算法预留字段 / HDCP2.x RKIV | 超分辨率算法预留字段，对应离线预留 1061；RKIV 是 HDMI2.x 固件的 16 字节加密密钥，提供附加安全保护。原文称部分 3528、356x 客户使用这种附加加密方案。 |

<!-- English PDF p.9 -->

| ID | 功能 | 说明 |
| --- | --- | --- |
| 62 | memc | 存储MEMC在线授权密钥，对应离线密钥位置 +1000，即 1062。 |
| 63 | MEMC 算法预留字段 | MEMC算法预留字段，对应离线预留 1063。 |
| 64 | pq | 存储PQ在线授权密钥，对应离线密钥位置 +1000，即 1064。 |
| 65 | PQ 算法预留字段 | PQ算法预留字段，对应离线预留 1065。 |
| 66 | RKP 预留字段 | RKP CSR 使用；生成 CSR 时的序列号 |
| 67 | RKP 预留字段 | RKP CSR 使用；生成的 CSR 内容 |
| 68 | multi-module | 存储multi-module在线授权密钥，对应离线密钥位置 +1000，即 1068。 |
| 69 | multi-module 预留字段 | multi-module算法预留字段，对应离线预留 1069。 |
| 70 | touch_read | 存储点读在线授权密钥，对应离线密钥位置 +1000，即 1070。 |
| 71 | touch_read 算法预留字段 | 点读算法预留字段，对应离线预留 1071。 |
| 72 | rknpu_ocr | 存储OCR 算法在线授权密钥，对应离线密钥位置 +1000，即 1072。 |
| 73 | rknpu_ocr 算法预留字段 | OCR 算法算法预留字段，对应离线预留 1073。 |
| 74 | face | 存储人脸解锁在线授权密钥，对应离线密钥位置 +1000，即 1074。 |
| 75 | 人脸解锁 算法预留字段 | 人脸解锁算法预留字段，对应离线预留 1075。 |
| 76 | knowledge | 离线密钥预留字段 |
| 77 | knowledge 算法预留字段 | Knowledge算法预留字段，对应离线预留 1077。 |
| ... |  |  |
| 84 | asr | 存储ASR 语音转文本算法在线授权密钥，对应离线密钥位置 +1000，即 1084。 |

<!-- English PDF p.10 -->

| ID | 功能 | 说明 |
| --- | --- | --- |
| 85 | asr 算法预留字段 | ASR 语音转文本算法算法预留字段，对应离线预留 1085。 |
| 86 | llm | 存储LLM 翻译在线授权密钥，对应离线密钥位置 +1000，即 1086。 |
| 87 | llm 算法预留字段 | LLM 翻译算法预留字段，对应离线预留 1087。 |
| 88 | tts | 存储TTS 文本转语音算法在线授权密钥，对应离线密钥位置 +1000，即 1088。 |
| 89 | tts 算法预留字段 | TTS 文本转语音算法算法预留字段，对应离线预留 1089。 |
| ... |  |  |
| 96 | aieraser | 存储AI 消除算法在线授权密钥，对应离线密钥位置 +1000，即 1096。 |
| 97 | aieraser 算法预留字段 | AI 消除算法算法预留字段，对应离线预留 1097。 |
| ... |  |  |
| 156 | 客户预留 | 保留供客户使用，不供 RK 内部使用 |
| ... | 客户预留 | 保留供客户使用，不供 RK 内部使用 |
| 256 | 客户预留 | 保留供客户使用，不供 RK 内部使用 |
| 1060 | 超分辨率 离线密钥位置 | 超分辨率离线密钥位置，减去 1000 即在线密钥位置 60。 |
| 1061 | 超分辨率 离线密钥预留字段 | 超分辨率离线密钥预留字段 |
| 1062 | MEMC 离线密钥位置 | MEMC离线密钥位置，减去 1000 即在线密钥位置 62。 |
| 1063 | 超分辨率 离线密钥预留字段 | MEMC离线密钥预留字段 |
| 1064 | PQ 离线密钥位置 | PQ离线密钥位置，减去 1000 即在线密钥位置 64。 |
| 1065 | PQ 离线密钥预留字段 | PQ离线密钥预留字段 |
| 1068 | multi-module 离线密钥位置 | multi-module离线密钥位置，减去 1000 即在线密钥位置 68。 |

<!-- English PDF p.11 -->

| ID | 功能 | 说明 |
| --- | --- | --- |
| 1069 | multi-module 离线密钥预留字段 | multi-module离线密钥预留字段 |
| 1070 | 点读 离线密钥位置 | 点读离线密钥位置，减去 1000 即在线密钥位置 70。 |
| 1071 | 点读 离线密钥预留字段 | 点读离线密钥预留字段 |
| 1072 | OCR 离线密钥位置 | OCR 算法离线密钥位置，减去 1000 即在线密钥位置 72。 |
| 1073 | OCR 离线密钥预留字段 | OCR 算法离线密钥预留字段 |
| 1074 | Face 离线密钥位置 | 人脸解锁离线密钥位置，减去 1000 即在线密钥位置 74。 |
| 1075 | Face 离线密钥预留字段 | 人脸解锁离线密钥预留字段 |
| 1076 | Knowledge 离线密钥位置 | Knowledge离线密钥位置，减去 1000 即在线密钥位置 76。 |
| 1077 | Knowledge 离线密钥预留字段 | Knowledge离线密钥预留字段 |
| 1084 | ASR 离线密钥位置 | ASR 语音转文本算法离线密钥位置，减去 1000 即在线密钥位置 84。 |
| 1085 | ASR 离线密钥预留字段 | ASR 语音转文本算法离线密钥预留字段 |
| 1086 | LLM 离线密钥位置 | LLM 翻译离线密钥位置，减去 1000 即在线密钥位置 86。 |
| 1087 | LLM 离线密钥预留字段 | LLM 翻译离线密钥预留字段 |
| 1088 | TTS 离线密钥位置 | TTS 文本转语音算法离线密钥位置，减去 1000 即在线密钥位置 88。 |
| 1089 | TTS 离线密钥预留字段 | TTS 文本转语音算法离线密钥预留字段 |
| 1096 | AI 消除 Algorithm 离线密钥位置 | AI 消除算法离线密钥位置，减去 1000 即在线密钥位置 96。 |
| 1097 | AI 消除 Algorithm 离线密钥预留字段 | AI 消除算法离线密钥预留字段 |

<!-- English PDF p.11 -->

注意：NVM 中的数据按 64 字节对齐存放，每个 item 至少分配 64 字节。因此写入 1–64 字节分配 64 字节，写入 65–128 字节分配 128 字节。

<!-- English PDF p.12 -->

## 4. UBOOT API

<!-- English PDF p.12 -->

源代码：`u-boot/board/rockchip/common/storage/storage.c`

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

### 4.1 非 GKI 内核 API

<!-- English PDF p.12 -->

源代码：`kernel/drivers/soc/rockchip/rk_vendor_storage.c`

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

Menuconfig 配置

<!-- English PDF p.13 -->

![4.1 非 GKI 内核 API：英文原图，第 13 页](/docs/rockchip-vendor-storage-v13/assets/en-p013-figure-01.png)

*4.1 非 GKI 内核 API：英文原图，第 13 页*

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

### 4.2 GKI 内核 API

<!-- English PDF p.13 -->

受 GKI 内核接口限制，原文要求内核添加 `ram_vendor_storage.ko`，Vendor Storage 才能支持读取接口；不支持写入接口。

<!-- English PDF p.13 -->

### 4.3 Android API

<!-- English PDF p.13 -->

源代码：`hardware/rockchip/libvendor_storage/vendor_storage.c`

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

具体用法参考 `hardware/rockchip/libvendor_storage/vendor_storage_test.c`。

<!-- English PDF p.14 -->

## 5. PC 演示工具

<!-- English PDF p.14 -->

选择 SN 选项并输入 SN 值，按 ENTER 将 SN item 加入写请求列表。

<!-- English PDF p.14 -->

![5. PC 演示工具：英文原图，第 14 页](/docs/rockchip-vendor-storage-v13/assets/en-p014-figure-01.png)

*5. PC 演示工具：英文原图，第 14 页*

<!-- English PDF p.14 -->

点击 Burning 按钮会将数据写入 Vendor Storage。

<!-- English PDF p.15 -->

![5. PC 演示工具：英文原图，第 15 页](/docs/rockchip-vendor-storage-v13/assets/en-p015-figure-01.png)

*5. PC 演示工具：英文原图，第 15 页*

<!-- English PDF p.15 -->

选择 SN 选项并点击 Read，从 Vendor Storage 读取数据。

<!-- English PDF p.15 -->

![5. PC 演示工具：英文原图，第 15 页](/docs/rockchip-vendor-storage-v13/assets/en-p015-figure-02.png)

*5. PC 演示工具：英文原图，第 15 页*

<!-- English PDF p.16 -->

## 6. PC 工具源代码

<!-- English PDF p.16 -->

PC 工具读取数据

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

PC 工具写入数据

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

## 7. Linux 应用演示代码

<!-- English PDF p.16 -->

使用内核提供的 `vendor_storage` 节点访问。

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

不使用内核驱动的用户态应用访问方式：

<!-- English PDF p.18 -->

实现参考：`hardware/rockchip/libvendor_storage/vendor_storage_test.c`。

{% endraw %}
