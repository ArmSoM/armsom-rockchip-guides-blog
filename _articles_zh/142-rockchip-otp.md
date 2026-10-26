---
title: "Rockchip OTP开发指南：安全区、密钥与生命周期"
description: "Rockchip OTP开发指南：安全区、密钥与生命周期 — V1.9.2."
translation_key: "142-rockchip-otp"
slug: "142-rockchip-otp"
lang: "zh"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "production"
products: []
tags: [ArmSoM, Rockchip, OTP, TEE]
excerpt: "Rockchip OTP开发指南：安全区、密钥与生命周期 — V1.9.2."
---

{% raw %}

依据中英文 V1.9.2 原稿（24/25页）完整技术正文整理。本文为 ArmSoM 平台参考，按各节支持矩阵核对具体 SoC、SDK/BSP、U-Boot、OP-TEE和内核驱动；原稿未指定统一内核版本，不代表所有板卡均支持。未做 ArmSoM 硬件验证，命令及输出是原厂示例。

> OTP写入、锁定及生命周期降权可能永久且不可恢复，错误可能损坏启动与密钥访问。先核验芯片技术手册和配套实现，在专用测试板验证。本文仅文档整理，未运行任何烧写、安全配置或锁定命令。

> 原稿代码疑点保留：void demo(void)中出现return ret；若干TEE_InvokeTACommand错误后只打印但最终仍返回TEE_SUCCESS；DTS示例用#作为行尾说明。使用前须按实际编译器和驱动接口核验，本文未擅自修改算法或返回值。

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip U-Boot](https://github.com/rockchip-linux/u-boot)

## 1. 概述

OTP NVM (One Time Programmable Non-Volatile Memory),即只可编程一次的非易失性存储。作为对比,FLASH存储可多次擦写。OTP又将存储区域划分为安全区(Secure OTP)和非安全区(Non-Secure OTP),非安全世界(例如U-Boot,UserSpace)可以直接读取非安全区数据,但是无权直接读写安全区数据,一般敏感数据都是存储于安全区域,只有安全世界(例如Miniloader/SPL,OP-TEE)可以直接读写安全区域OTP。关于安全世界和非安全世界相关概念涉及TrustZone和TEE知识,细节请参考《Rockchip_Developer_Guide_TEE_SDK_CN.md》或 ARM 官方资料。

## 2. Non-Secure OTP

RK 平台 Non-Secure OTP 一般用于存储芯片型号、芯片唯一码 CPUID 等 RK 私有数据,这些数据在芯片生产时就已经写入。大部分 RK 平台 Non-Secure OTP 没有预留 OEM 区域,所以内核驱动仅提供读取接口,不提供烧写接口。仅部分 RK 平台 Non-Secure OTP 有预留 OEM 区域(参考如下支持平台列表),内核驱动提供烧写接口,方便客戶存储自定义数据,比如:序列号,MAC 地址,产品信息等。客戶可通过标准文件 API 对 OEM 区域进行读写。

### 2.1 支持平台

| Platform | OTP_OEM_OFFSET | RANGE | TOTAL SIZE |
| --- | --- | --- | --- |
| RV1126/RV1109 | 0x100 | 0x100 ~ 0x1EF | 240 Bytes |

### 2.2 使用方法

OEM Read

```text
/*
 * @offset: offset from oem base
 * @buf: buf to store data which read from oem
 * @len: data len in bytes
 */
int rockchip_otp_oem_read(int offset, char *buf, int len)
{
    int fd = 0, ret = 0;

    fd = open("/sys/bus/nvmem/devices/rockchip-otp0/nvmem", O_RDONLY);
    if (fd < 0)
        return -1;

    ret = lseek(fd, OTP_OEM_OFFSET + offset, SEEK_SET);
    if (ret < 0)
        goto out;

    ret = read(fd, buf, len);
out:
    close(fd);

    return ret;
}
```

OEM Write

1. 每笔 OEM Write 前都需要使能写开关,目的是避免误写。

```text
int rockchip_otp_enable_write(void)
{
    char magic[] = "1380926283";
    int fd, ret;

    fd = open("/sys/module/nvmem_rockchip_otp/parameters/rockchip_otp_wr_magic", O_WRONLY);
    if (fd < 0)
        return -1;

    ret = write(fd, magic, 10);
    close(fd);

    return ret;
}
```

2. 写入的数据大小及偏移需要4字节对⻬,数据写入后将被标记写保护,相应数据写保护将在下次重启后生效。

```text
/*
 * @offset: offset from oem base, MUST be 4 bytes aligned
 * @buf: data buf for write
 * @len: data len in bytes, MUST be 4 bytes aligned
 */
int rockchip_otp_oem_write(int offset, char *buf, int len)
{
    int fd = 0, ret = 0;

    /* MUST be 4 bytes aligned */
    if (len % 4)
        return -1;

    fd = open("/sys/bus/nvmem/devices/rockchip-otp0/nvmem", O_WRONLY);
    if (fd < 0)
        return -1;
    ret = lseek(fd, OTP_OEM_OFFSET + offset, SEEK_SET);
    if (ret < 0)
        goto out;

    ret = write(fd, buf, len);
out:
    close(fd);

    return ret;
}
```

Demo

1. OEM 区域 偏移0的位置写入 0 ~ 15

```text
void demo(void)
{
    char buf[16] = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 };
    int ret = 0;

    ret = rockchip_otp_enable_write();
    if (ret < 0)
        return ret;

    rockchip_otp_oem_write(0, buf, 16);
}
```

2. 通过 OEM Read 或者 hexdump 命令查看结果,如下为通过命令查看 OEM 区域数据

```text
# hexdump -C /sys/bus/nvmem/devices/rockchip-otp0/nvmem
00000000  52 56 11 26 91 fe 21 4b  50 41 30 31 37 00 00 00
00000010  00 00 00 00 10 25 16 12  2f 0e 0f 00 08 00 00 00
00000020  00 00 00 e0 0a e0 0a 1e  00 00 00 00 00 00 00 00
00000030  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00
*
00000100  00 01 02 03 04 05 06 07  08 09 0a 0b 0c 0d 0e 0f
00000110  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00
*
000001e0  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00
000001f0  00 00 00 00 00 00 00 00  0f 00 00 00 00 00 00 00
```

## 3. Secure OTP

Secure OTP中预留多种不同的OEM Zone区域用以满足用戶不同的使用需求。

### 3.1 OEM OTP Description

下列表格列举出了Rockchip支持的各 OEM 数据。Rockchip 提供了读写 OEM 数据的接口,用戶可以直接调用,接口内部自动设置 OEM 数据偏移地址,所以用戶无需设置偏移地址,只需要关心 OEM 数据的⻓度即可。

| Data | Length | Description | Support Platforms |
| --- | --- | --- | --- |
| Public Key<br>Hash | 32 or 64 Bytes | 公钥哈希,安全启动时用于校验公<br>钥的合法性,再用公钥校验固件的<br>合法性。 | 全平台 |
| Secure Boot<br>Enable Flag | 4 Bits or 1 Byte | 安全启动使能标志,开启安全启动<br>后会设置该标志位,后续启动会对<br>固件的合法性进行校验。 | 全平台 |
| AVB<br>Attribute<br>Hash | 32 Bytes | AVB根证书哈希,AVB流程中用于<br>校验根证书合法性。 | 所有OTP平台 |
| FW Encrypt<br>Key | 16 Bytes | 固件加解密密钥,启动过程使用该<br>密钥解密固件。 | RK3562/RK3568/RV1126B |
| TA Encrypt<br>Key | 32 Bytes | TA加解密密钥,加载密文TA应用时<br>使用该密钥先解密再加载。 | RV1126/RV1109<br>RK3308/PX30/RK3326/<br>RK3358/RK3566/RK3568<br>RK3588/RK3528/RK3562<br>RV1106/RV1103/RK3576<br>RV1106B/RV1103B<br>RK3506/RV1126B |
| Security<br>Level | 1 or 2 Bytes | TEE安全等级,用于决定使用哪一把<br>Root Key进行密钥派生,不同的安<br>全等级对eMMC/安全存储的保护强<br>度不同。 | RK3588/RK3528/RK3562<br>RV1106/RV1103/RK3576<br>RV1106B/RV1103B<br>RK3506/RV1126B |
| OEM HUK | 32 Bytes | OEM自定义硬件唯一密钥,当使用<br>TEE安全等级1时需要注入该密钥,<br>后续TEE使用该密钥进行密钥派生。 | RK3588/RK3528/RK3562<br>RV1106/RV1103/RK3576<br>RV1106B/RV1103B<br>RK3506/RV1126B |
| OEM Encrypt<br>Data | 16 Bytes | 防抄板中级方案需要注入的OEM私<br>有数据,用于校验板子的合法性。 | RV1126/RV1109<br>RK3566/RK3568<br>RK3588/RK3528/RK3562<br>RV1106/RV1103/RK3576<br>RV1106B/RV1103B<br>RK3506/RV1126B |
| Protected<br>OEM Zone | 参考"Protected<br>OEM Zone"章节 | 参考"Protected OEM Zone"章节 | 参考"Protected OEM<br>Zone"章节 |
| Non-<br>Protected<br>OEM Zone | 参考"Non-<br>Protected OEM<br>Zone"章节 | 参考"Non-Protected OEM<br>Zone"章节 | 参考"Non-Protected OEM<br>Zone"章节 |
| OEM Cipher<br>Key | 参考"OEM Cipher<br>Key"章节 | 参考"OEM Cipher Key"章节 | 参考"OEM Cipher Key"章节 |

### 3.2 Protected OEM Zone

该OEM Zone区域仅供运行在OP-TEE OS上的合法Trust Application(TA应用) 调用,非安全世界无法直接读写该OEMZone区域,不想暴露给非安全世界的敏感数据建议使用该OEM Zone区域。RK3588平台还支持关闭 Protected OEMZone 烧写功能,一旦关闭烧写功能,将无法再烧写 Protected OEM Zone。

#### 3.2.1 支持平台

| Platform | Protected OEM Zone Length | Support Write Lock |
| --- | --- | --- |
| RV1126/RV1109 | 2048 Bytes | Not Support |
| RK3308/PX30/RK3326/RK3358 | 64 Bytes | Not Support |
| RK3566/RK3568 | 224 Bytes | Not Support |
| RK3588 | 1536 Bytes | Support |
| RK3528/RK3562 | 128 Bytes | Not Support |
| RV1106/RV1103 | 224 Bytes | Not Support |
| RK3576 | 128 Bytes | Not Support |
| RV1106B/RV1103B | 64 Bytes | Not Support |
| RK3506 | 128 Bytes | Not Support |
| RV1126B | 64 Bytes | Not Support |

#### 3.2.2 使用方法

用戶需先参考《Rockchip_Developer_Guide_TEE_SDK_CN.md》文档,编译运行 rk_tee_user/ 目录下的CA TA应用,Demo请参考rk_tee_user/v2/ta/rk_test/rktest_otp.c,若rktest_otp.c文件不存在则直接在TA中调用以下函数即可。获取 Protected OEM Zone Size

```text
static TEE_Result get_oem_otp_size(uint32_t *size)
{
    TEE_UUID sta_uuid = { 0x527f12de, 0x3f8e, 0x434f,
            { 0x8f, 0x40, 0x03, 0x07, 0xae, 0x86, 0x4b, 0xaf } };
    TEE_TASessionHandle sta_session = TEE_HANDLE_NULL;
    uint32_t origin;
    TEE_Result res;
    TEE_Param taParams[4];
    uint32_t nParamTypes;

    nParamTypes = TEE_PARAM_TYPES(TEE_PARAM_TYPE_NONE,
            TEE_PARAM_TYPE_NONE,
            TEE_PARAM_TYPE_NONE,
            TEE_PARAM_TYPE_NONE);

    res = TEE_OpenTASession(&sta_uuid, 0, nParamTypes, taParams, &sta_session, &origin);
    if (res != TEE_SUCCESS)
    {
        EMSG("TEE_OpenTASession failed\n");
        return res;
    }

    nParamTypes = TEE_PARAM_TYPES(TEE_PARAM_TYPE_VALUE_OUTPUT,
            TEE_PARAM_TYPE_NONE,
            TEE_PARAM_TYPE_NONE,
            TEE_PARAM_TYPE_NONE);

    res = TEE_InvokeTACommand(sta_session, 0, 160, nParamTypes,
                              taParams, &origin);
    if (res != TEE_SUCCESS)
    {
        EMSG("TEE_InvokeTACommand returned 0x%x\n", res);
    }
    *size = taParams[0].value.a;

    TEE_CloseTASession(sta_session);
    sta_session = TEE_HANDLE_NULL;

    return TEE_SUCCESS;

}
```

读取 Protected OEM Zone

```text
/*
 * read_offset： 偏移区间从0 - (size - 1)
 * read_data： 参数请使⽤TA中定义的变量
 * read_data_size：读取⻓度，以字节为单位
 */
static TEE_Result read_oem_otp(uint32_t read_offset, uint8_t *read_data, uint32_t
read_data_size)
{
    TEE_UUID sta_uuid = { 0x527f12de, 0x3f8e, 0x434f,
            { 0x8f, 0x40, 0x03, 0x07, 0xae, 0x86, 0x4b, 0xaf } };
    TEE_TASessionHandle sta_session = TEE_HANDLE_NULL;
    uint32_t origin;
    TEE_Result res;
    TEE_Param taParams[4];
    uint32_t nParamTypes;

    nParamTypes = TEE_PARAM_TYPES(TEE_PARAM_TYPE_NONE,
            TEE_PARAM_TYPE_NONE,
            TEE_PARAM_TYPE_NONE,
            TEE_PARAM_TYPE_NONE);
    res = TEE_OpenTASession(&sta_uuid, 0, nParamTypes, taParams, &sta_session, &origin);
    if (res != TEE_SUCCESS)
    {
        EMSG("TEE_OpenTASession failed\n");
        return res;
    }

    nParamTypes = TEE_PARAM_TYPES(TEE_PARAM_TYPE_VALUE_INPUT,
            TEE_PARAM_TYPE_MEMREF_INOUT,
            TEE_PARAM_TYPE_NONE,
            TEE_PARAM_TYPE_NONE);

    taParams[0].value.a = read_offset;
    taParams[1].memref.buffer = read_data;
    taParams[1].memref.size = read_data_size;

    res = TEE_InvokeTACommand(sta_session, 0, 130, nParamTypes,
                              taParams, &origin);
    if (res != TEE_SUCCESS)
    {
        EMSG("TEE_InvokeTACommand returned 0x%x\n", res);
    }

    TEE_CloseTASession(sta_session);
    sta_session = TEE_HANDLE_NULL;

    return TEE_SUCCESS;

}
```

烧写 Protected OEM Zone

```text
/*
 * write_offset： 偏移区间从0 - (size - 1)
 * write_data： 参数请使⽤TA中定义的变量
 * write_data_size：烧写⻓度，以字节为单位
 */
static TEE_Result write_oem_otp(uint32_t write_offset, uint8_t *write_data, uint32_t
write_data_size)
{
    TEE_UUID sta_uuid = { 0x527f12de, 0x3f8e, 0x434f,
            { 0x8f, 0x40, 0x03, 0x07, 0xae, 0x86, 0x4b, 0xaf } };
    TEE_TASessionHandle sta_session = TEE_HANDLE_NULL;
    uint32_t origin;
    TEE_Result res;
    TEE_Param taParams[4];
    uint32_t nParamTypes;

    nParamTypes = TEE_PARAM_TYPES(TEE_PARAM_TYPE_NONE,
            TEE_PARAM_TYPE_NONE,
            TEE_PARAM_TYPE_NONE,
            TEE_PARAM_TYPE_NONE);
    res = TEE_OpenTASession(&sta_uuid, 0, nParamTypes, taParams, &sta_session, &origin);
    if (res != TEE_SUCCESS)
    {
        EMSG("TEE_OpenTASession failed\n");
        return res;
    }

    nParamTypes = TEE_PARAM_TYPES(TEE_PARAM_TYPE_VALUE_INPUT,
            TEE_PARAM_TYPE_MEMREF_INOUT,
            TEE_PARAM_TYPE_NONE,
            TEE_PARAM_TYPE_NONE);

    taParams[0].value.a = write_offset;
    taParams[1].memref.buffer = write_data;
    taParams[1].memref.size = write_data_size;

    res = TEE_InvokeTACommand(sta_session, 0, 140, nParamTypes,
                              taParams, &origin);
    if (res != TEE_SUCCESS)
    {
        EMSG("TEE_InvokeTACommand returned 0x%x\n", res);
    }

    TEE_CloseTASession(sta_session);
    sta_session = TEE_HANDLE_NULL;

    return TEE_SUCCESS;

}
```

关闭 Protected OEM Zone 烧写功能

```text
enum rk_otp_flag_type {
    LIFE_CYCLE_TO_MISSIONED,
    OEM_OTP_WRITE_LOCK,
};
#define CMD_SET_OTP_FLAGS       170
static TEE_Result set_oem_otp_write_lock(void)
{
    TEE_UUID sta_uuid = { 0x527f12de, 0x3f8e, 0x434f,
            { 0x8f, 0x40, 0x03, 0x07, 0xae, 0x86, 0x4b, 0xaf } };
    TEE_TASessionHandle sta_session = TEE_HANDLE_NULL;
    uint32_t origin;
    TEE_Result res;
    TEE_Param taParams[4];
    uint32_t nParamTypes;

    nParamTypes = TEE_PARAM_TYPES(TEE_PARAM_TYPE_NONE,
            TEE_PARAM_TYPE_NONE,
            TEE_PARAM_TYPE_NONE,
            TEE_PARAM_TYPE_NONE);

    res = TEE_OpenTASession(&sta_uuid, 0, nParamTypes, taParams, &sta_session, &origin);
    if (res != TEE_SUCCESS)
    {
        EMSG("TEE_OpenTASession failed\n");
        return res;
    }

    nParamTypes = TEE_PARAM_TYPES(TEE_PARAM_TYPE_VALUE_INPUT,
            TEE_PARAM_TYPE_NONE,
            TEE_PARAM_TYPE_NONE,
            TEE_PARAM_TYPE_NONE);

    taParams[0].value.a = OEM_OTP_WRITE_LOCK;
    //disable Protected OEM Zone write from 0 to 511
    taParams[0].value.b = 0;
    res = TEE_InvokeTACommand(sta_session, 0, CMD_SET_OTP_FLAGS, nParamTypes,
                              taParams, &origin);
    if (res != TEE_SUCCESS)
    {
        EMSG("TEE_InvokeTACommand returned 0x%x\n", res);
    }

    //disable Protected OEM Zone write from 512 to 1023
    taParams[0].value.b = 1;
    res = TEE_InvokeTACommand(sta_session, 0, CMD_SET_OTP_FLAGS, nParamTypes,
                              taParams, &origin);
    if (res != TEE_SUCCESS)
    {
        EMSG("TEE_InvokeTACommand returned 0x%x\n", res);
    }

    //disable Protected OEM Zone write from 1024 to 1535
    taParams[0].value.b = 2;
    res = TEE_InvokeTACommand(sta_session, 0, CMD_SET_OTP_FLAGS, nParamTypes,
                              taParams, &origin);
    if (res != TEE_SUCCESS)
    {
        EMSG("TEE_InvokeTACommand returned 0x%x\n", res);
    }

    TEE_CloseTASession(sta_session);
    sta_session = TEE_HANDLE_NULL;

    return TEE_SUCCESS;

}
```

以下是 TA 使用 Protected OEM Zone 参考 Demo:

```text
TEE_Result demo_for_oem_otp(void)
{
    TEE_Result res = TEE_SUCCESS;
    uint32_t otp_size = 0;
    res = get_oem_otp_size(&otp_size);
    if (res != TEE_SUCCESS) {
        EMSG("get_oem_otp_size failed with code 0x%x", res);
        return res;
    }
    IMSG("The OEM Zone size is %d byte.", otp_size);

    uint32_t write_len = 2;
    uint8_t write_data[2] = {0xaa, 0xaa};
    uint32_t write_offset = 0;

    res = write_oem_otp(write_offset, write_data, write_len);
    if (res != TEE_SUCCESS) {
        EMSG("write_oem_otp failed with code 0x%x", res);
        return res;
    }
    IMSG("write_oem_otp succes with data: 0x%x, 0x%x", write_data[0], write_data[1]);

    uint32_t read_len = 2;
    uint8_t read_data[2];
    uint32_t read_offset = 0;

    res = read_oem_otp(read_offset, read_data, read_len);
    if (res != TEE_SUCCESS) {
        EMSG("read_oem_otp failed with code 0x%x", res);
        return res;
    }
    IMSG("read_oem_otp succes with data: 0x%x, 0x%x", read_data[0], read_data[1]);
    return res;
}
```

### 3.3 Non-Protected OEM Zone

该OEM Zone区域可以被U-Boot和UserSpace调用,数据会暴露在非安全世界内存中。由于Non-Secure OTP区域较小以及安全因素等原因,目前仅部分平台Non-Secure OTP有预留OEM Zone区域,对于Non-Secure OTP没有预留OEM Zone区域的平台,用戶又有在U-Boot和UserSpace读写OTP的需求,可以使用该OEM Zone区域。

#### 3.3.1 支持平台

| Platform | Non-Protected OEM Zone Length |
| --- | --- |
| RK3308/PX30/RK3326/RK3358 | 64 Bytes |
| RK3566/RK3568/RK3588 | 64 Bytes |
| RV1106/RV1103 | 64 Bytes |
| RK3528/RK3562/RK3576 | 32 Bytes |
| RV1106B/RV1103B/RK3506/RV1126B | 32 Bytes |

#### 3.3.2 使用方法

##### 3.3.2.1 U-Boot 使用方法

U-Boot 读取 Non-Protected OEM Zone,请调用 u-boot/lib/optee_clientApi/OpteeClientInterface.c 中trusty_read_oem_ns_otp 函数。U-Boot 烧写 Non-Protected OEM Zone,请调用 u-boot/lib/optee_clientApi/OpteeClientInterface.c 中trusty_write_oem_ns_otp 函数。以下是U-Boot 使用 Non-Protected OEM Zone 参考 Demo:

```text
uint32_t demo_for_oem_ns_otp(void)
{
    TEEC_Result res = TEEC_SUCCESS;

    uint32_t write_len = 2;
    uint8_t write_data[2] = {0xbb, 0xbb};
    uint32_t write_offset = 0;

    res = trusty_write_oem_ns_otp(write_offset, write_data, write_len);
    if (res != TEEC_SUCCESS) {
        printf("trusty_write_oem_ns_otp failed with code 0x%x", res);
        return res;
    }
    printf("trusty_write_oem_ns_otp succes with data: 0x%x, 0x%x", write_data[0],
write_data[1]);

    uint32_t read_len = 2;
    uint8_t read_data[2];
    uint32_t read_offset = 0;

    res = trusty_read_oem_ns_otp(read_offset, read_data, read_len);
    if (res != TEEC_SUCCESS) {
        printf("trusty_read_oem_ns_otp failed with code 0x%x", res);
            return res;
        }
    printf("trusty_read_oem_ns_otp succes with data: 0x%x, 0x%x", read_data[0],
read_data[1]);
    return res;
}
```

##### 3.3.2.2 UserSpace 使用方法

UserSpace 读写 Non-Protected OEM Zone 方法:确认内核是否集成了读写 Non-Protected OEM Zone 驱动,存在 kernel/drivers/nvmem/rockchip-secure-otp.c 文件则说明已集成。内核已集成读写 Non-Protected OEM Zone 驱动,请参考以下步骤:

1. 确认开启了TEE驱动。确认对应平台 dtsi 中添加了如下节点:

```text
firmware {
    optee: optee {
        compatible = "linaro,optee-tz";
        method = "smc";
    };
};
```

config 中添加以下两个配置:

```text
CONFIG_TEE=y
CONFIG_OPTEE=y
```

若出现 /dev/tee0 和 /dev/teepriv0 节点,说明TEE驱动已开启。

2. 确认开启了读写 Non-Protected OEM Zone 驱动。确认对应平台 dtsi 中添加了如下节点:

```text
secure_otp: secure-otp {
    compatible = "rockchip,secure-otp";
    rockchip,otp-size = <32>;#此处应该修改成对应平台 Non-Protected OEM Zone 实际⼤⼩
};
```

config 中添加以下配置:

```text
CONFIG_NVMEM_ROCKCHIP_SEC_OTP=y
```

若出现 /sys/bus/nvmem/devices/rockchip-secure-otp0/nvmem 节点,说明读写 Non-Protected OEM Zone 驱动已开启。

3. 读取 Non-Protected OEM Zone

```text
/*
 * @offset: offset from Non-Protected OEM Zone, MUST be 4 bytes aligned
 * @buf: buf to store data which read from Non-Protected OEM Zone
 * @len: data len in bytes, MUST be 4 bytes aligned
 */
int rockchip_otp_non_protected_oem_read(int offset, char *buf, int len)
{
    int fd = 0, ret = 0;

    /* MUST be 4 bytes aligned */
    if ((offset % 4) || (len % 4))
        return -1;

    fd = open("/sys/bus/nvmem/devices/rockchip-secure-otp0/nvmem", O_RDONLY);
    if (fd < 0)
        return -1;

    ret = lseek(fd, offset, SEEK_SET);
    if (ret < 0)
        goto out;

    ret = read(fd, buf, len);
out:
    close(fd);

    return ret;
}
```

4. 烧写 Non-Protected OEM Zone

```text
/*
 * @offset: offset from Non-Protected OEM Zone, MUST be 4 bytes aligned
 * @buf: data buf for write
 * @len: data len in bytes, MUST be 4 bytes aligned
 */
int rockchip_otp_non_protected_oem_write(int offset, char *buf, int len)
{
    int fd = 0, ret = 0;

    /* MUST be 4 bytes aligned */
    if ((offset % 4) || (len % 4))
        return -1;

    fd = open("/sys/bus/nvmem/devices/rockchip-secure-otp0/nvmem", O_WRONLY);
    if (fd < 0)
        return -1;

    ret = lseek(fd, offset, SEEK_SET);
    if (ret < 0)
        goto out;

    ret = write(fd, buf, len);
out:
    close(fd);

    return ret;
}
```

5. 读写 Demo

```text
void demo(void)
{
    char wbuf[4] = { 0, 1, 2, 3};
    char rbuf[4];
    int ret = 0;

    ret = rockchip_otp_non_protected_oem_write(0, wbuf, sizeof(wbuf));
    if (ret < 0) {
        printf("write non protected oem fail!\n");
        return;
    }

    ret = rockchip_otp_non_protected_oem_read(0, rbuf, sizeof(rbuf));
    if (ret < 0) {
        printf("read non protected oem fail!\n");
        return;
    }
}
```

也可以通过 hexdump 命令查看结果

```text
# busybox hexdump -C -v /sys/bus/nvmem/devices/rockchip-secure-otp0/nvmem
00000000  00 01 02 03 00 00 00 00  00 00 00 00 00 00 00 00  |................|
00000010  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
00000020
```

内核未集成读写 Non-Protected OEM Zone 驱动,请参考以下步骤:UserSpace 用戶需先参考《Rockchip_Developer_Guide_TEE_SDK_CN.md》文档,编译 rk_tee_user/ 目录下的CA应用,然后在CA中参考rk_tee_user/v2/host/rk_test/rktest.c 中 invoke_otp_ns_read 和 invoke_otp_ns_write 函数的实现。

### 3.4 OEM Cipher Key

该OEM Zone区域用于存储用戶密钥,密钥一旦写入不可更改,用戶烧写密钥后可以使用指定密钥进行加解密操作,为保证密钥不泄露,系统只提供烧写接口没有读取接口,烧写接口和算法接口可以被U-Boot和UserSpace调用。

#### 3.4.1 支持平台

| Platform | OEM Cipher Key Length | Is Support Hardware Read |
| --- | --- | --- |
| RV1126/RV1109 | Key0-3: 16 or 32 | Not Support |
| RK3566/RK3568 | Key0-3: 16 or 24 or 32 | Not Support |
| RK3588 | Key2: 16 or 24<br>Key0 1 3: 16 or 24 or 32 | Support |
| RK3528/RK3562/RK3576 | Key0-3: 16 or 24 or 32 | Support |
| RV1106/RV1103/RV1106B/RV1103B | Key0-3: 16 or 24 or 32 | Not Support |
| RK3506/RV1126B | Key0-3: 16 or 24 or 32 | Support |

#### 3.4.2 使用方法

##### 3.4.2.1 U-Boot 使用方法

U-Boot 烧写 OEM Cipher Key,请调用 u-boot/lib/optee_clientApi/OpteeClientInterface.c 中trusty_write_oem_otp_key 函数。函数 uint32_t trusty_write_oem_otp_key(enum RK_OEM_OTP_KEYID key_id, uint8_t *byte_buf, uint32_tbyte_len)中 key_id 结构如下:

```text
enum RK_OEM_OTP_KEYID {
    RK_OEM_OTP_KEY0 = 0,
    RK_OEM_OTP_KEY1 = 1,
    RK_OEM_OTP_KEY2 = 2,
    RK_OEM_OTP_KEY3 = 3,
    RK_OEM_OTP_KEY_FW = 10, //keyid of fw_encryption_key
    RK_OEM_OTP_KEYMAX
};
```

上诉平台均支持烧写 RK_OEM_OTP_KEY0、RK_OEM_OTP_KEY1、RK_OEM_OTP_KEY2、RK_OEM_OTP_KEY3;RV1126/RV1109 平台还额外支持烧写 RK_OEM_OTP_KEY_FW 密钥,RK_OEM_OTP_KEY_FW 密钥主要用于BootROM 解密 Loader 固件,用戶也可以使用该密钥处理业务数据或者解密 Kernel 固件。以下是U-Boot烧写 OEM Cipher Key 参考 Demo:

```text
uint32_t demo_for_trusty_write_oem_otp_key(void)
{
    uint32_t res;
    uint8_t key[16] = {
        0x53, 0x46, 0x1f, 0x93, 0x4b, 0x16, 0x00, 0x28,
        0xcc, 0x34, 0xb1, 0x37, 0x30, 0xa4, 0x72, 0x66,
    };
    res = trusty_write_oem_otp_key(RK_OEM_OTP_KEY0, key, sizeof(key));
    if (res)
        printf("test trusty_write_oem_otp_key fail! 0x%08x\n", res);
    else
        printf("test trusty_write_oem_otp_key success.\n");
    return res;
}
```

U-Boot 判断是否已经烧写 OEM Cipher Key,请调用 u-boot/lib/optee_clientApi/OpteeClientInterface.c 中trusty_oem_otp_key_is_written 函数。以下是U-Boot判断是否已经烧写 OEM Cipher Key 参考 Demo:

```text
void demo_for_trusty_oem_otp_key_is_written(void)
{
    uint8_t value;
    uint32_t res = trusty_oem_otp_key_is_written(RK_OEM_OTP_KEY0, &value);
    if (res == TEEC_SUCCESS) {
        printf("oem otp key is %s", value ? "written" : "empty");
    } else {
        printf("access oem otp key fail!");
    }
}
```

部分平台还支持 Hardware Read 功能,用戶可以调用 u-boot/lib/optee_clientApi/OpteeClientInterface.c 中trusty_set_oem_hr_otp_read_lock 函数,调用该函数后CPU将无权限访问该密钥,密钥数据不出现在安全和非安全世界内存中,达到密钥与CPU隔离的目的,硬件可以自动读取该密钥送到crypto模块进行加解密运算。若RK3588使用的是RK_OEM_OTP_KEY0、RK_OEM_OTP_KEY1、RK_OEM_OTP_KEY2,在调用该函数后会更改CPU 对OTP 其他数据的读写权限,比如SecureBoot、Security Level等数据将失去烧写权限,所以用戶需要确认后续不会烧写OTP数据后再调用该函数。若RK3588使用的是RK_OEM_OTP_KEY3时,调用该函数不会影响OTP其他数据读写权限。以下是 RK3588 平台 U-Boot 使用 Hardware Read 功能参考 Demo:

```text
uint32_t demo_for_trusty_set_oem_hr_otp_read_lock(void)
{
    uint32_t res;

    res = trusty_set_oem_hr_otp_read_lock(RK_OEM_OTP_KEY0);
    if (res)
        printf("test trusty_set_oem_hr_otp_read_lock fail! 0x%08x\n", res);
    else
        printf("test trusty_set_oem_hr_otp_read_lock success.\n");
    return res;
}
```

U-Boot 使用OEM Cipher Key进行加解密操作,请调用 u-boot/lib/optee_clientApi/OpteeClientInterface.c 中trusty_oem_otp_key_cipher 函数。以下是U-Boot使用 OEM Cipher Key 参考 Demo:

```text
uint32_t demo_for_trusty_oem_otp_key_cipher(void)
{
    uint32_t res;
    rk_cipher_config config;
    uintptr_t src_phys_addr, dest_phys_addr;
    uint32_t key_id = RK_OEM_OTP_KEY0;
    uint32_t key_len = 16;
    uint32_t algo = RK_ALGO_AES;
    uint32_t mode = RK_CIPHER_MODE_CBC;
    uint32_t operation = RK_MODE_ENCRYPT;
    uint8_t iv[16] = {
        0x10, 0x44, 0x80, 0xb3, 0x88, 0x5f, 0x02, 0x03,
        0x05, 0x21, 0x07, 0xc9, 0x44, 0x00, 0x1b, 0x80,
    };
    uint8_t inout[16] = {
        0xc9, 0x07, 0x21, 0x05, 0x80, 0x1b, 0x00, 0x44,
        0xac, 0x13, 0xfb, 0x23, 0x93, 0x4a, 0x66, 0xe4,
    };
    uint32_t data_len = sizeof(inout);

    config.algo = algo;
    config.mode = mode;
    config.operation = operation;
    config.key_len = key_len;
    config.reserved = NULL;
    memcpy(config.iv, iv, sizeof(iv));

    src_phys_addr = (uintptr_t)inout;
    dest_phys_addr = src_phys_addr;

    res = trusty_oem_otp_key_cipher(key_id, &config,
                    src_phys_addr,
                    dest_phys_addr,
                    data_len);
    if (res)
        printf("test trusty_oem_otp_key_phys_cipher fail! 0x%08x\n", res);
    else
        printf("test trusty_oem_otp_key_phys_cipher success.\n");

    return res;
}
```

##### 3.4.2.2 UserSpace 使用方法

UserSpace 端烧写和使用 OEM Cipher Key 与 U-Boot 端类似,使用注意事项参考上述U-Boot 烧写和使用OEMCipher Key 内容。UserSpace 用戶烧写和使用 OEM Cipher Key 请参考 librkcrypto/demo/demo_otpkey.c, librkcrypto源码和文档《Rockchip_Developer_Guide_Crypto_HWRNG_CN.pdf》默认已集成到SDK中。Android平台:librkcrypto源码在hardware/rockchip/目录下。

Linux平台:librkcrypto源码在external/目录下。

### 3.5 OTP Life Cycle

部分平台支持OTP Life Cycle,其作用是控制OTP中数据在不同生命周期具有不同的访问权限。

#### 3.5.1 支持平台

| Platform | OTP Life Cycle Type | 说明 |
| --- | --- | --- |
| RK3588 | Blank/Tested/Provisioned/Missioned | Blank阶段拥有最高的读写权限,Missioned阶段读写<br>权限最低,读写权限依次递减,高权限阶段可以选择<br>进入低权限阶段,低权限阶段不能进入高权限阶段。<br>芯片出厂时是Provisioned阶段,OEM可以选择进入<br>Missioned阶段,OEM从Provisioned阶段进入<br>Missioned阶段后,部分OTP数据读写权限将发生变<br>更。 |

#### 3.5.2 权限变更

以下为RK3588 OTP在Provisioned阶段和Missioned阶段的读写权限列表,其中 RW 表示可读写,R 表示只读。

| 数据 | Provisioned | Missioned | 说明 |
| --- | --- | --- | --- |
| Secure Boot<br>Enable Flag | RW | R | 若用戶需要使用Secure Boot功能,需要开启Secure Boot功能后才能更改OTP Life Cycle,Secure<br>Boot详⻅《Rockchip_Developer_Guide_Secure_Boot_Application_Note_EN.md》 |
| RSA Public<br>Hash | RW | R | 同上 |
| Security Level | RW | R | 若用戶需要使用强弱安全可选功能,需要选择Security Level后才能更改OTP Life Cycle,Security<br>Level详⻅《Rockchip_Developer_Guide_TEE_SDK_CN》文档 |
| OEM Cipher<br>Key0-2 | RW | 无读写权限 | 详⻅ OEM Cipher Key 章节 |
| FW<br>encryption<br>key | RW | 无读写权限 | 主要用于加密Loader固件,BootRom启动阶段会使用该密钥解密 |

#### 3.5.3 使用方法

目前更改OTP Life Cycle只能在安全世界修改,若要将OTP Life Cycle从Provisioned阶段改为Missioned阶段,用戶需先参考《Rockchip_Developer_Guide_TEE_SDK_CN.md》文档,编译运行 rk_tee_user/ 目录下的CA TA应用,然后在TA中调用以下函数即可。

```text
enum rk_otp_flag_type {
    LIFE_CYCLE_TO_MISSIONED,
    OEM_OTP_WRITE_LOCK,
};
#define CMD_SET_OTP_FLAGS       170
static TEE_Result set_otp_life_cycle_to_missioned(void)
{
    TEE_UUID sta_uuid = { 0x527f12de, 0x3f8e, 0x434f,
            { 0x8f, 0x40, 0x03, 0x07, 0xae, 0x86, 0x4b, 0xaf } };
    TEE_TASessionHandle sta_session = TEE_HANDLE_NULL;
    uint32_t origin;
    TEE_Result res;
    TEE_Param taParams[4];
    uint32_t nParamTypes;

    nParamTypes = TEE_PARAM_TYPES(TEE_PARAM_TYPE_NONE,
            TEE_PARAM_TYPE_NONE,
            TEE_PARAM_TYPE_NONE,
            TEE_PARAM_TYPE_NONE);

    res = TEE_OpenTASession(&sta_uuid, 0, nParamTypes, taParams, &sta_session, &origin);
    if (res != TEE_SUCCESS)
    {
        EMSG("TEE_OpenTASession failed\n");
        return res;
    }

    nParamTypes = TEE_PARAM_TYPES(TEE_PARAM_TYPE_VALUE_INPUT,
            TEE_PARAM_TYPE_NONE,
            TEE_PARAM_TYPE_NONE,
            TEE_PARAM_TYPE_NONE);

    taParams[0].value.a = LIFE_CYCLE_TO_MISSIONED;
    res = TEE_InvokeTACommand(sta_session, 0, CMD_SET_OTP_FLAGS, nParamTypes,
                              taParams, &origin);
    if (res != TEE_SUCCESS)
    {
        EMSG("TEE_InvokeTACommand returned 0x%x\n", res);
    }

    TEE_CloseTASession(sta_session);
    sta_session = TEE_HANDLE_NULL;

    return TEE_SUCCESS;

}
```

{% endraw %}
