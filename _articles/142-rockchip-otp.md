---
title: "Rockchip OTP: secure regions, keys and lifecycle"
description: "Rockchip OTP: secure regions, keys and lifecycle — V1.9.2."
translation_key: "142-rockchip-otp"
slug: "142-rockchip-otp"
lang: "en"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "production"
products: []
tags: [ArmSoM, Rockchip, OTP, TEE]
excerpt: "Rockchip OTP: secure regions, keys and lifecycle — V1.9.2."
---

{% raw %}

Full technical content from Chinese/English V1.9.2 originals (24/25 pages). This ArmSoM platform reference requires checking each support matrix against the exact SoC, SDK/BSP, U-Boot, OP-TEE and kernel driver. No universal kernel version or support for every board is implied. No ArmSoM hardware testing was performed; commands and output are vendor examples.

> OTP programming, locking and lifecycle permission reductions can be permanent and irreversible; errors may break boot and key access. Verify the chip manual and matching implementation, then validate on dedicated test boards. No programming, security configuration or locking commands were executed.

> Source code issues are retained: void demo(void) contains return ret; some TEE_InvokeTACommand errors only log and the function still returns TEE_SUCCESS; the DTS example uses # for an inline note. Check against the compiler and driver before use; algorithms and return values were not silently changed.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip U-Boot](https://github.com/rockchip-linux/u-boot)

## 1 Overview

OTP NVM (One Time Programmable Non-Volatile Memory) can be programmed only once, unlike FLASH, which supports repeated erase/write. OTP is divided into Secure OTP and Non-Secure OTP. The normal world (for example U-Boot and userspace) can directly read nonsecure data but cannot directly read/write secure data. Sensitive data is generally kept in Secure OTP; only the secure world, such as Miniloader/SPL and OP-TEE, can directly access it. For TrustZone/TEE concepts, see Rockchip_Developer_Guide_TEE_SDK_CN.md or Arm documentation.

## 2. Non-Secure OTP

Non-Secure OTP normally stores Rockchip-private chip type and CPUID data programmed during manufacture. Most platforms reserve no OEM region, so the kernel driver exposes only reads. Only the platforms listed below reserve a Non-Secure OTP OEM region and expose programming for customer serial numbers, MAC addresses, product information and similar data. Standard file APIs can read/write that OEM region.

### 2.1 Supported platforms

| Platform | OTP_OEM_OFFSET | RANGE | TOTAL SIZE |
| --- | --- | --- | --- |
| RV1126/RV1109 | 0x100 | 0x100 ~ 0x1EF | 240 Bytes |

### 2.2 Usage

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

1. Enable the write switch before every OEM Write to prevent accidental writes.

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

2. Write size and offset must be 4-byte aligned. Written data is marked write-protected; that protection takes effect after the next reboot.

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

1. Write values 0–15 at offset 0 in the OEM region.

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

2. Inspect the result through OEM Read or hexdump. The following command displays OEM-region data.

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

Secure OTP reserves different OEM zones for different requirements.

### 3.1 OEM OTP Description

The table lists supported OEM data. Rockchip provides read/write interfaces that automatically set the OEM offset internally. Callers only need the data length, not an explicit offset.

| Data | Length | Description | Support Platforms |
| --- | --- | --- | --- |
| Public Key<br>Hash | 32 or 64 Bytes | Public-key hash: secure boot verifies the public key, then uses it to verify firmware. | All platforms |
| Secure Boot<br>Enable Flag | 4 Bits or 1 Byte | Secure Boot enable flag: set when Secure Boot is enabled; later boots verify firmware authenticity. | All platforms |
| AVB<br>Attribute<br>Hash | 32 Bytes | AVB root-certificate hash used to verify the root certificate in AVB. | All OTP platforms |
| FW Encrypt<br>Key | 16 Bytes | Firmware encryption/decryption key used to decrypt firmware during boot. | RK3562/RK3568/RV1126B |
| TA Encrypt<br>Key | 32 Bytes | TA encryption/decryption key: encrypted TAs are decrypted with this key before loading. | RV1126/RV1109<br>RK3308/PX30/RK3326/<br>RK3358/RK3566/RK3568<br>RK3588/RK3528/RK3562<br>RV1106/RV1103/RK3576<br>RV1106B/RV1103B<br>RK3506/RV1126B |
| Security<br>Level | 1 or 2 Bytes | TEE security level selects the Root Key for key derivation; levels provide different protection strengths for eMMC/secure storage. | RK3588/RK3528/RK3562<br>RV1106/RV1103/RK3576<br>RV1106B/RV1103B<br>RK3506/RV1126B |
| OEM HUK | 32 Bytes | OEM-defined hardware-unique key, provisioned for TEE security level 1 and subsequently used by TEE for key derivation. | RK3588/RK3528/RK3562<br>RV1106/RV1103/RK3576<br>RV1106B/RV1103B<br>RK3506/RV1126B |
| OEM Encrypt<br>Data | 16 Bytes | OEM-private data provisioned for the mid-level anti-copy solution to verify board authenticity. | RV1126/RV1109<br>RK3566/RK3568<br>RK3588/RK3528/RK3562<br>RV1106/RV1103/RK3576<br>RV1106B/RV1103B<br>RK3506/RV1126B |
| Protected<br>OEM Zone | See section ProtectedOEM Zone | See section Protected OEM Zone | See section Protected OEMZone |
| Non-<br>Protected<br>OEM Zone | See section Non-Protected OEMZone | See section Non-Protected OEMZone | See section Non-Protected OEMZone |
| OEM Cipher<br>Key | See section OEM CipherKey | See section OEM Cipher Key | See section OEM Cipher Key |

### 3.2 Protected OEM Zone

This OEM zone can be accessed only by authorized trusted applications running on OP-TEE OS; the normal world cannot access it directly. Use it for sensitive data that must not be exposed to the normal world. RK3588 also supports disabling Protected OEM Zone programming; once disabled it cannot be programmed again.

#### 3.2.1 Supported platforms

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

#### 3.2.2 Usage

First follow Rockchip_Developer_Guide_TEE_SDK_CN.md to build/run the CA and TA applications under rk_tee_user/. See rk_tee_user/v2/ta/rk_test/rktest_otp.c for the demo; if absent, directly call the following TA functions. Obtain Protected OEM Zone size:

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

Read Protected OEM Zone

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

Program Protected OEM Zone

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

Disable Protected OEM Zone programming

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

TA reference demo for Protected OEM Zone:

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

This OEM zone is accessible from U-Boot and userspace, exposing its data in normal-world memory. Because Non-Secure OTP is small and for security reasons, only some platforms reserve a Non-Secure OTP OEM zone. Platforms without such a reservation can use this zone when U-Boot/userspace OTP access is needed.

#### 3.3.1 Supported platforms

| Platform | Non-Protected OEM Zone Length |
| --- | --- |
| RK3308/PX30/RK3326/RK3358 | 64 Bytes |
| RK3566/RK3568/RK3588 | 64 Bytes |
| RV1106/RV1103 | 64 Bytes |
| RK3528/RK3562/RK3576 | 32 Bytes |
| RV1106B/RV1103B/RK3506/RV1126B | 32 Bytes |

#### 3.3.2 Usage

##### 3.3.2.1 U-Boot usage

In U-Boot, read Non-Protected OEM Zone using trusty_read_oem_ns_otp and program it using trusty_write_oem_ns_otp, both in u-boot/lib/optee_clientApi/OpteeClientInterface.c. Reference demo:

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

##### 3.3.2.2 Userspace usage

For userspace access, check whether the kernel includes the Non-Protected OEM Zone driver: kernel/drivers/nvmem/rockchip-secure-otp.c indicates integration. If present, follow these steps:

1. Enable the TEE driver. Ensure the platform dtsi contains:

```text
firmware {
    optee: optee {
        compatible = "linaro,optee-tz";
        method = "smc";
    };
};
```

Add these two config options:

```text
CONFIG_TEE=y
CONFIG_OPTEE=y
```

The presence of /dev/tee0 and /dev/teepriv0 indicates that the TEE driver is enabled.

2. Enable the Non-Protected OEM Zone driver. Ensure the platform dtsi contains:

```text
secure_otp: secure-otp {
    compatible = "rockchip,secure-otp";
    rockchip,otp-size = <32>;#此处应该修改成对应平台 Non-Protected OEM Zone 实际⼤⼩
};
```

Add this config option:

```text
CONFIG_NVMEM_ROCKCHIP_SEC_OTP=y
```

The node /sys/bus/nvmem/devices/rockchip-secure-otp0/nvmem indicates the Non-Protected OEM Zone driver is enabled.

3. Read Non-Protected OEM Zone

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

4. Program Non-Protected OEM Zone

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

5. Read/write demo

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

The result can also be inspected with hexdump.

```text
# busybox hexdump -C -v /sys/bus/nvmem/devices/rockchip-secure-otp0/nvmem
00000000  00 01 02 03 00 00 00 00  00 00 00 00 00 00 00 00  |................|
00000010  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
00000020
```

If the kernel lacks the Non-Protected OEM Zone driver, first follow Rockchip_Developer_Guide_TEE_SDK_CN.md to build the CA under rk_tee_user/. In your CA, follow invoke_otp_ns_read and invoke_otp_ns_write in rk_tee_user/v2/host/rk_test/rktest.c.

### 3.4 OEM Cipher Key

This OEM zone stores customer keys, which cannot be changed after programming. The programmed key can encrypt/decrypt data. To prevent disclosure, the system offers programming but no read interface. Programming and algorithm interfaces can be called from U-Boot and userspace.

#### 3.4.1 Supported platforms

| Platform | OEM Cipher Key Length | Is Support Hardware Read |
| --- | --- | --- |
| RV1126/RV1109 | Key0-3: 16 or 32 | Not Support |
| RK3566/RK3568 | Key0-3: 16 or 24 or 32 | Not Support |
| RK3588 | Key2: 16 or 24<br>Key0 1 3: 16 or 24 or 32 | Support |
| RK3528/RK3562/RK3576 | Key0-3: 16 or 24 or 32 | Support |
| RV1106/RV1103/RV1106B/RV1103B | Key0-3: 16 or 24 or 32 | Not Support |
| RK3506/RV1126B | Key0-3: 16 or 24 or 32 | Support |

#### 3.4.2 Usage

##### 3.4.2.1 U-Boot usage

In U-Boot, program OEM Cipher Key with trusty_write_oem_otp_key in u-boot/lib/optee_clientApi/OpteeClientInterface.c. For uint32_t trusty_write_oem_otp_key(enum RK_OEM_OTP_KEYID key_id, uint8_t *byte_buf, uint32_t byte_len), key_id is defined as follows:

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

All listed platforms support RK_OEM_OTP_KEY0, RK_OEM_OTP_KEY1, RK_OEM_OTP_KEY2 and RK_OEM_OTP_KEY3. RV1126/RV1109 additionally support RK_OEM_OTP_KEY_FW, mainly used by BootROM to decrypt Loader firmware. Customers may also use it for application data or kernel-firmware decryption. U-Boot programming demo:

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

To test in U-Boot whether OEM Cipher Key is already programmed, call trusty_oem_otp_key_is_written in u-boot/lib/optee_clientApi/OpteeClientInterface.c. Reference demo:

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

Some platforms support Hardware Read. Calling trusty_set_oem_hr_otp_read_lock in u-boot/lib/optee_clientApi/OpteeClientInterface.c removes CPU access to the key. Key data then appears in neither secure- nor normal-world memory, isolating it from the CPU; hardware automatically delivers it to the crypto module for cryptographic operations. On RK3588, locking RK_OEM_OTP_KEY0, RK_OEM_OTP_KEY1 or RK_OEM_OTP_KEY2 also changes CPU access to other OTP data: SecureBoot, Security Level and similar fields lose programming permission. Ensure no further OTP programming is required before calling it. Locking RK_OEM_OTP_KEY3 on RK3588 does not affect other OTP access. RK3588 U-Boot Hardware Read demo:

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

To encrypt/decrypt with OEM Cipher Key in U-Boot, call trusty_oem_otp_key_cipher in u-boot/lib/optee_clientApi/OpteeClientInterface.c. Reference demo:

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

##### 3.4.2.2 Userspace usage

Userspace programming/use of OEM Cipher Key is similar to U-Boot; the same precautions apply. See librkcrypto/demo/demo_otpkey.c. librkcrypto sources and Rockchip_Developer_Guide_Crypto_HWRNG_CN.pdf are integrated into the SDK by default. On Android, librkcrypto is under hardware/rockchip/.

On Linux, librkcrypto sources are under external/.

### 3.5 OTP Life Cycle

Some platforms support OTP Life Cycle, controlling data-access permissions at different lifecycle stages.

#### 3.5.1 Supported platforms

| Platform | OTP Life Cycle Type | Description |
| --- | --- | --- |
| RK3588 | Blank/Tested/Provisioned/Missioned | Read/write permissions decrease from Blank (highest) to Missioned (lowest). A higher-permission stage can transition to a lower one, never the reverse. Chips leave the factory in Provisioned. OEMs may enter Missioned; this changes access permissions for some OTP data. |

#### 3.5.2 Permission changes

The table shows RK3588 OTP access permissions in the Provisioned and Missioned stages. RW means read/write; R means read-only.

| Data | Provisioned | Missioned | Description |
| --- | --- | --- | --- |
| Secure Boot<br>Enable Flag | RW | R | Enable Secure Boot before changing OTP Life Cycle if that feature is required. See Rockchip_Developer_Guide_Secure_Boot_Application_Note_EN.md. |
| RSA Public<br>Hash | RW | R | Same as above |
| Security Level | RW | R | For selectable security strength, select Security Level before changing OTP Life Cycle. See Rockchip_Developer_Guide_TEE_SDK_CN. |
| OEM Cipher<br>Key0-2 | RW | No read/write access | See OEM Cipher Key section |
| FW<br>encryption<br>key | RW | No read/write access | Mainly encrypts Loader firmware; BootRom decrypts it with this key during boot. |

#### 3.5.3 Usage

OTP Life Cycle can currently be changed only in the secure world. To change Provisioned to Missioned, follow Rockchip_Developer_Guide_TEE_SDK_CN.md to build/run CA/TA under rk_tee_user/, then call the following function in the TA.

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
