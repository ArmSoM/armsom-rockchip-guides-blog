---
title: "Complete Rockchip Secure Boot Application Guide: Signing, eFuse, OTP and Verification"
description: "Complete Rockchip Secure Boot Application Guide: Signing, eFuse, OTP and Verification — RK-SM-YF-024 V2.2.0"
translation_key: "105-rockchip-secure-boot"
slug: "105-rockchip-secure-boot"
lang: "en"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Secure Boot", "eFuse", "OTP"]
excerpt: "Complete Rockchip Secure Boot Application Guide: Signing, eFuse, OTP and Verification — RK-SM-YF-024 V2.2.0"
---

{% raw %}

# Complete Rockchip Secure Boot Application Guide: Signing, eFuse, OTP and Verification

Complete technical transcription/translation of English RK-SM-YF-024 V2.2.0, retaining the technical preface on pages 2–3 and all technical content on pages 8–43. Only an English PDF is available; all languages use English-source figures, some of whose tool interfaces are Chinese. Supported chips follow the source, not an extension to newer SoCs or all ArmSoM boards. Verify SDK/BSP, Loader/U-Boot, ROM, key format, programming voltage and board power. No ArmSoM hardware validation, signing, flashing or fuse operations were performed.

> eFuse/OTP programming is irreversible; incorrect keys or voltage can prevent boot or updates. These are vendor reference procedures, not a ready-to-run board recipe. Source issues are retained and recorded: §2.5 rsaHash[128] versus RSA2048; RK3336 in §7.5 versus RK3326 in §7.6; obsolete section cross-references; and RSA Encryption/Decryption terminology. No values are guessed.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip U-Boot](https://github.com/rockchip-linux/u-boot)

## 1. Preface

Terms (source definitions):

| Term | Definition |
| --- | --- |
| Sector | Sector size is 512 bytes |
| eFuse | One-Time Programmable Memory IP in SoC |
| RSA Encryption | Use public key for encryption |
| RSA Decryption | Use private key for decryption |
| OTP | One-Time Programmable Memory IP in SoC |
| MaskRom | BootROM, Boot Read-Only Memory in SoC |
| loader | Boot Loader/First Loader, generally RKMiniloader or SPL(uboot) |
| OBM CODE | Generally code compiled or trusted by OEM/OBM |

This document describes implementation of Rockchip secure boot. It verifies firmware validity to prevent invalid firmware upgrades and booting. Devices with programmed eFuse enable secure boot ROM and cannot boot unsigned firmware; upgrading unsigned firmware or firmware signed by an unmatched key fails.

Note: valid signed firmware can still boot on copied device circuit boards or hardware with the same CPU platform. Secure boot verifies software validity, not hardware.

The source covers RK3126, RK3128, RK3228, RK3229, RK3288, RK3368, RK3399, RK3228H, RK3328, RK3326, RK3308 and PX30. Features: secure boot ROM, SHA256, RSA2048, and eFuse/OTP hash verification of the public key.

Source tool requirements: Efuse tool V1.35 or later; SecureBootTool 1.79 or later; RKBatchTool 1.8 or later (deprecated, use FactoryTool); FactoryTool 1.39 or later. These are historical requirements of this document; §7.6 separately requires SecureBootTool V1.9 or later.

## 2. Architecture

### 2.1 Secure Boot Process

![English-source figure, page 8](/docs/rockchip-secure-boot/assets/en-p008-figure-01.png)

Figure 1-1 Secure boot process

### 2.2 Secure Boot Sequence

![English-source figure, page 9](/docs/rockchip-secure-boot/assets/en-p009-figure-01.png)

Figure 1-2 Secure boot sequence

### 2.3 MaskRom Boot to the First Loader (RKminiLoader/U-Boot)

![English-source figure, page 9](/docs/rockchip-secure-boot/assets/en-p009-figure-02.png)

Figure 1-3-1 MaskRom to loader sequence First loader layout in user partition of flash Table 1-1 First loader data layout

| Range | Description |
| --- | --- |
| 0-63 sector | 64 sector reverse |
| first loader(8128 sector)(5 copys) | Boot loader partition |
| 0-2047 | loader header |
| 2048-4095 | public key and digital signature |
| 4096 - | raw binary |
| ... |  |
| Boot loader copy(4) partition |  |
| 0-2047 | loader header |
| 2048-4095 | public key and digital signature |
| 4096 - | raw binary |

The structure of public key and digital signature layout at address 2048 to 4095:

```c
typedef struct tagBOOT_HEADER
{
    uint32 tag;
    uint32 version;
    uint32 flags;
    uint32 size;
    uint32 reserved1[3];
    uint16 HashBits;
    uint16 RSABits;        /* length in bits of modulus */
    uint32 RSA_N[64];      /* RSA public key*/
    uint32 RSA_E[64];
    uint32 RSA_C[64];
    uint32 HashData[(8+1)*2];
    uint32 signature[64];
}BOOT_HEADER, *PBOOT_HEADER;
```

Public key: uint32 RSA_N[64], RSA_E[64], RSA_C[64] ; Digital signature: uint32 signature[64] Step1: Get public key from first loader partition. Step2: Calculate the hash(SHA256) of public key and compare it with the the hash stored in OTP.If mathed,load the first loader successfully, otherwise booting failed. Step3: Calculate the hash(SHA256) of raw binary and compare it with RSA2048 encryption(have been obtainde in step1) of digital signature. If matched, load first loader successfully, otherwise booting failed.

### 2.4 First Loader boot to u-boot(Secondary Boot Loader, option)

![English-source figure, page 11](/docs/rockchip-secure-boot/assets/en-p011-figure-01.png)

Figure 1-4-1 boot to -uboot flow

![English-source figure, page 11](/docs/rockchip-secure-boot/assets/en-p011-figure-02.png)

The U-Boot area is 4MB, with 4 copies. Source ranges and contents:

| Instance | Range | Description |
| --- | --- | --- |
| U-Boot | 0-2047 | header, digital signature |
| U-Boot | 2048- | raw binary |
| ... | ... | ... |
| U-Boot copy(3) | 0-2047 | header, digital signature |
| U-Boot copy(3) | 2048- | raw binary |

Table 1-4 u-boot layout in flash The structure of header with digital digital signature layout at address 0 to 2047:

```c
typedef struct tag_second_loader_hdr
{
    unsigned char magic[LOADER_MAGIC_SIZE];
    unsigned int version;
    unsigned int reserved0;
    unsigned int loader_load_addr;         /* load to DDR address */
    unsigned int loader_load_size;         /* size in bytes */
    unsigned int crc32;                    /* crc32 */
    unsigned int hash_len;                 /* 20 or 32 , 0 is no hash */
    unsigned char hash[LOADER_HASH_SIZE];  /* sha256 */
    unsigned int js_hash;                  /* js hsah */
    unsigned char reserved[1024-32-32-4];
    unsigned int signTag;                  /* 0x4E474953, "NGIS" */
    unsigned int signlen;                  /* 256 */
    unsigned char rsaHash[256];            /* digital signature */
    unsigned char reserved2[2048-1024-256-8];
}second_loader_hdr;
```

Digital signature: unsigned char rsaHash[256]; l Step 1: Get public key from first loader partition l Step 2: Calculate the hash (sha256) of public key and compare it with hash in OTP, if matched go to next step, otherwise booting failed. l Step 3: Calculate the hash(SHA256) of raw binary and compare it with RSA2048 encryption (have been obtained in step 1) of digital signature, if matched, loading successfully and deliver the public key to U-Boot, otherwise booting failed.

### 2.5 U-Boot Boot to Boot Image with Linux kernel

![English-source figure, page 12](/docs/rockchip-secure-boot/assets/en-p012-figure-01.png)

Figure 1-5 U-Boot to boot sequence Table 1-2 Boot data layout

| boot.img | Description |
| --- | --- |
| 0-2047 | header |
| 2048-4095 | digital signature |
| 4096- | kernel,ramdisk,dtb... |
| ... |  |

The structure of layout 0-2047(header):

```c
#define BOOT_MAGIC_SIZE 8
#define BOOT_NAME_SIZE 16
#define BOOT_ARGS_SIZE 512
typedef struct tag_boot_img_hdr
{
    unsigned char magic[BOOT_MAGIC_SIZE]; /* "ANDROID!" */
    unsigned int kernel_size;             /* size in bytes */
    unsigned int kernel_addr;             /* physical load addr */
    unsigned int ramdisk_size;            /* size in bytes */
    unsigned int ramdisk_addr;            /* physical load addr */
    unsigned int second_size;             /* size in bytes */
    unsigned int second_addr;             /* physical load addr */
    unsigned int tags_addr;               /* physical addr for kernel tags */
    unsigned int page_size;               /* flash page size we assume */
    unsigned int unused[2];               /* future expansion: should be 0 */
    unsigned char name[BOOT_NAME_SIZE];   /* asciiz product name */
    unsigned char cmdline[BOOT_ARGS_SIZE];
    unsigned int id[8];                   /* timestamp / checksum / sha1 / etc */
    unsigned char reserved[0x400-0x260];
    unsigned int signTag;                 /* 0x4E474953 */
    unsigned int signlen;                 /* 128 */
    unsigned char rsaHash[128];
}boot_img_hdr;
```

Digital signature: unsigned char rsaHash[128]; l Step 1: U-Boot get public key obtained from first loader. l Step 2: Calculate the hash (sha256) of public key and compare it with hash in OTP, if matched go to next step, otherwise booting failed. l Step 3: Hash(SHA256) of raw binary and compare it with RSA2048 encryption (using public key get in step 1) of digital signature, if matched, boot to linux kernel, otherwise booting failed.

### 2.6 U-Boot Boot to Recovery

The same as boot to boot image, detail please refer to chapter 1.4.

## 3. eFuse Layout

RK3368, RK3288, RK3229 and RK3228 used 1024 bits eFuse for secure boot, data layout: Table 2-1 eFuse data layout

| 32-bit Word Addressing | Description |
| --- | --- |
| 0x00 | Security flagBits [7:0] security enable flag Bits [31:8] reserved |
| 0x01-0x3 | Reserved |
| 0x04-0x07 | Reserved |
| 0x8-0xF | RSA public key hash |
| 0x10-0x17 | Reserved |
| 0x18 | Reserved |
| 0x19-0x1A | Reserved |
| 0x1B-0x1D | Reserved |
| 0x1E | Reserved |
| 0x1F | eFuse write lock bits |

RK3228H and RK3328 used 7680 bits OTP for secure boot, data layout: Table 2-2 OTP data layout

| 32-bit Word<br>Addressing | Description |
| --- | --- |
| 0-63 | Public Key (N) |
| 64-127 | Public Key (E) |
| 128 | Security flagBits [7:0] 0xff: security enable flagBits [15:8] RSA_E size<br>(word uint)Bits [31:16] Reserved |
| 129 | Trusted Firmware revocation counter (ID #0) |
| 130-131 | Non-trusted Firmware revocation counter (ID #1) |
| 132-239 | Reserved |

RK3326、PX30 and RK3308 used 4096 bits OTP for secure boot, data layout: Table 2-3 OTP data layout2

| 32-bit Word Addressing | Description |
| --- | --- |
| 0 | Secure boot enable flag |
| 1-3 | Reserved |
| 4-11 | RSA Public key hash(using SHA256) |
| 12-19 | Device root key |
| 20-23 | FW encryption key |
| 24-25 | Trusted Firmware revocation counter (ID #0) |
| 26-31 | Non-trusted Firmware revocation counter (ID #1) |
| 32-97 | Reserved for OEM |

## 4. Overall Operation Flow

Enable secure boot flow:

1. Package update.img

2. Sign Firmware(update.img)

3. Program EFUSE or OTP

4. Upgrade Firmware(update.img)

5. Check secure boot enable

![English-source figure, page 18](/docs/rockchip-secure-boot/assets/en-p018-figure-01.png)

Figure 3-1 Secure boot operation process

## 5. Make Update.img

### 5.1 Generate Images

After build Android,use the following script to generate images: ./mkimage.sh ota

![English-source figure, page 21](/docs/rockchip-secure-boot/assets/en-p021-figure-01.png)

```text
./mkimage.sh ota
TARGET_PRODUCT=rk3288
TARGET_HARDWARE=rk30board
system filesystem is ext4
make ota images...
create boot.img with kernel... done.
create recovery.img with kernel... done.
create misc.img... done.
create system.img... done.
```

Figure 4-1 Script to generate images

### 5.2 Packet Update.img

Refer to RKTools/windows/AndroidTool/rockdev/package-file. This file controls which files will be packaged. Take RK3288, for example. Change bootloader path, commentaries resource and kernel lines, set backup to RESERVED.

![English-source figure, page 21](/docs/rockchip-secure-boot/assets/en-p021-figure-02.png)

```text
# NAME      Relative path
#
#HWDEF      HWDEF
package-file    package-file
bootloader  Image/RK3288UbootLoader.bin
parameter   rk3288-3.10-uboot.parameter.txt
#uboot      Image/uboot.img
misc        Image/misc.img
#resource   Image/resource.img
#kernel     Image/kernel.img
boot        Image/boot.img
recovery    Image/recovery.img
system      Image/system.img
# 要写入backup分区的文件就是自身（update.img）
# SELF 是关键字，表示升级文件（update.img）自身
# 在生成升级文件时，不加入SELF文件的内容，但在头部信息中有记录
# 在解包升级文件时，不解包SELF文件的内容
# RESERVED不打包backup
backup      RESERVED
update-script   update-script
recover-script  recover-script
```

Figure 4-2 Package-file to control the packaging Copy RKTools/windows folders to windows system, then run AndroidTool/rockdev/mkupdate.bat to generate the update.img.

![English-source figure, page 22](/docs/rockchip-secure-boot/assets/en-p022-figure-01.png)

Figure 4-3 Script-to-generate-images

## 6. Firmware Sign Flow

This instruction is for Windows tools, while Linux has its own.

### 6.1 Generating RSA key

![English-source figure, page 24](/docs/rockchip-secure-boot/assets/en-p024-figure-01.png)

Figure 5-1 SecureBootTool generates RSA key

### 6.2 Save RSA key

This key will be used for signed firmware and for OTA, please back up to a secure storage. NOTE: The keypair is VERY important! Make sure to save it securely. Once you lost it or leak it, your product will be exposed in high risk, also the old device will be unable to be updated anymore.It should be maintained through the whole product life cycle

![English-source figure, page 25](/docs/rockchip-secure-boot/assets/en-p025-figure-01.png)

Figure 5-2 SecureBootTool saves RSA key

### 6.3 Loading RSA key

![English-source figure, page 25](/docs/rockchip-secure-boot/assets/en-p025-figure-02.png)

Figure 5-3 SecureBootTool loads RSA key

### 6.4 Configuration

![English-source figure, page 26](/docs/rockchip-secure-boot/assets/en-p026-figure-01.png)

Choose SOC platform

![English-source figure, page 26](/docs/rockchip-secure-boot/assets/en-p026-figure-02.png)

Option ‘efuse’ means using eFuse to store the hash of the RSA public key, and will enable secure boot ROM(recommended). Option ‘soft’ is for some special applications, will not enable secure boot ROM, used RSA1024 and SHA160.

![English-source figure, page 26](/docs/rockchip-secure-boot/assets/en-p026-figure-03.png)

Every product model will generate RSA KEY only once, please backup in case that you cannot upgrade firmware or OTA again.

![English-source figure, page 26](/docs/rockchip-secure-boot/assets/en-p026-figure-04.png)

Loading backup RSA key (support ‘.pem’ file format generated by openssl)

![English-source figure, page 26](/docs/rockchip-secure-boot/assets/en-p026-figure-05.png)

Sign firmware

### 6.5 Sign Firmware

Make sure the ‘boot.img’ and the ‘recovery.img’ are included in the kernel image. Refer to the pack command:

![English-source figure, page 26](/docs/rockchip-secure-boot/assets/en-p026-figure-06.png)

```text
./mkimage.sh ota
TARGET_PRODUCT=rk3288
TARGET_HARDWARE=rk30board
system filesystem is ext4
make ota images...
create boot.img with kernel... done.
create recovery.img with kernel... done.
create misc.img... done.
create system.img... done.
```

Figure 5-4 Images’pack command Open firmware image:

![English-source figure, page 27](/docs/rockchip-secure-boot/assets/en-p027-figure-01.png)

Figure 5-5 SecureBootTool selects firmware Signed firmware:

![English-source figure, page 27](/docs/rockchip-secure-boot/assets/en-p027-figure-02.png)

Figure 5-6 Secure Boot Tool-signed firmware

## 7. Programming eFuse

### 7.1 Hardware Conditions

For Rockchip AP series, there are two ways to program user secure data. One is "eFuse programming", the other is "OTP programming"(only few chips support). Following is the introduction.

#### 7.1.1 eFuse Programming

RK3126, RK3128, RK3228, RK3229, RK3288, RK3368 and RK3399 support eFuse programming, following is the general requirements: A. If products do not need eFuse data programming, we advise to connect eFuse Power Pin directly to GND. Avoiding eFuse data change caused by misoperation. (RK3126/RK3126C eFuse Power Pin is reused with SARADC function, so that it would not to be grounded.) B. If products need eFuse programming, then connect a pull down resistance to GND on eFuse Power Pin, to make sure that eFuse power pin doesn't fluctuate in normal work condition. also to avoid eFuse data change caused by misoperation. This pull-down resistance value, please refer to each chip platform's reference schematics, generally it's at a range of 47Ω-10KΩ. C. There are two types of power supply for eFuse programming: a) Onboard power supply mode Advantage: PCBA socket test board is not needed, you can program eFuse data first, and then upgrade the firmware. When system works in normal condition, the firmware must make sure that eFuse power is not on,keep 0V to prevent misoperation. Disadvantange: Power supply circuit must placement on the board. The material cost is increased, and you need to make sure the firmware is no misoperation at any time. Apply to: This power supply mode applies to customers who don't want to add PCBA testing process. For example some BOX products, their interfaces and assembling are both simple, not need socket board to use on the PCBA test. b) Power supply by PCBA test board(recommended) Advantage: Only test points needed. It is no power supply circuit on board so users can't crack through software too. Disadvantage: Increase PCBA test process, the test cost is higher. l Apply to: Products like tablets, their assembling is complicated. If PCBA is abnormal, it 's more complicated to rework and replace, so these kinds of products usually have PCBA testing process, Programming eFuse on this process is reasonable. D. Electronic circuit introduction: Each chip platform’s eFuse power supply voltage is different(such as 1.5/1.8/2.5V), power supply pin number and current requirement is also different.

we recommend that power supply capacity should be 50mA above, for detailed voltage and pull- down resistance value, you can refer to schematic diagram. Summarized advices are below: Table 6-1 Hardware parameters

| Chip Part<br>Number | eFusePower | Programming<br>Mode | VQPS Current<br>Requirement | Pull-down<br>Resistance<br>Value | eFusePower<br>Pin Number | Remark |
| --- | --- | --- | --- | --- | --- | --- |
| RK3126/RK3126C | 2.5V | Power by PCBA<br>test board | >50mA | None | PIN68 | Reused<br>with ADC |
| RK3128 | 2.5V | Onboard or<br>powered by<br>external | >50mA | <=10K | R10 |  |
| RK3168/RK3188 | 1.5V | Onboard or<br>powered by<br>external | >50mA | <=510R | Y10 |  |
| RK3228/RK3229 | 1.6V | Onboard or<br>powered by<br>external | >50mA | <=100R | R10 |  |
| RK3288 | 1.5V | Onboard or<br>powered by<br>external | >50mA | <=510R | P19 |  |
| RK3368 | 1.5V | Onboard or<br>powered by<br>external | >50mA | <=47R | Y10 |  |
| RK3399 | 1.8V | Onboard or<br>powered by<br>external | >50mA | <=1K | AD23 |  |

Recommended power supply mode is shown as below diagram. a) PartA: eFuse power supply circuit, please choose suitable LDO part number according to the voltage requirement above, this part circuit can be placed on mainboard, and also can be placed on the PCBA test board. b) PartB: eFuse power pin with pull down resistance R4(47R-10K), keep the voltage low level to avoid misoperation. If power supply circuit is placed on the PCBA test board, the SOC mainboard needs to add responding testing points, to facilitate fixture pin touch. Attention: a) RK3126C's eFuse power is reused with ADC function, so it can't connect pull-down resistance. b) RK3228/RK3229's eFuse power supply is suggest to be adjusted to 1.55-1.6V, to be more stabled. c) If the device uses onboard power supply mode, please make sure eFuse_PWREN, which is in the following diagram be distributed an independent GPIO to control the LDO. It must make sure there is no power output on VCC_eFuse PIN in normal work condition. Details refer to reference schematic that RK released, if there is no GPIO distributed, contact us or use external power supply mode.

![English-source figure, page 31](/docs/rockchip-secure-boot/assets/en-p031-figure-01.png)

Figure 6-1 eFuse circuit

#### 7.1.2 OTP Programming

RK3328 and RK3228H support OTP programming mode, this mode is no need external power supply circuit, OTP_VCC18(PIN16) is always powered by VCC_18. you only need to run the special time sequence for OTP programming, not need the additional changes aboout hardware.

![English-source figure, page 31](/docs/rockchip-secure-boot/assets/en-p031-figure-02.png)

Figure 6-2 OTP circuit

### 7.2 Tool UI

![English-source figure, page 31](/docs/rockchip-secure-boot/assets/en-p031-figure-03.png)

Figure 6-3 eFuse tool UI

### 7.3 Load the Signed Firmware

![English-source figure, page 32](/docs/rockchip-secure-boot/assets/en-p032-figure-01.png)

Figure 6-4 Load signed firmware

### 7.4 Click 'run' Button to Start

![English-source figure, page 32](/docs/rockchip-secure-boot/assets/en-p032-figure-02.png)

Figure 6-5 Programming the chip

### 7.5 Programming eFuse

Connect the device to the PC by USB cable; the tool will program the hash of RSA public key to eFuse automatically. Programming eFuse needs an external power supply, the detail information please refer to SOC's DATASHEET. Notice:RK3228H,RK3328,RK3336,RK3308 and PX30 don’t need step 6.2 to 6.4. Programming will be done by upgrading firmware which has been signed.

### 7.6 Programming OTP

RK3228H,RK3328,RK3326,RK3308 and PX30 support OTP programming. Public key hash need program to OTP. Programming OTP performs are :

1. First, follow the above steps to burn signed firmware. If the machine can start normally,the signature process is correct. Then OTP can be programed.

2. The signature tool uses version of SecureBootTool V1.9 or more. Open the config.ini file in the tools directory. Find "sign_flag=",set"sign_flag=0x20"(bit 5 set 1) which enable write OTP in RKMiniLoader. Save config.ini file. Reopen SecureBootTool.exe to sign firmware or RKMiniLoader.

![English-source figure, page 33](/docs/rockchip-secure-boot/assets/en-p033-figure-01.png)

Figure 6-6-1 SecureBootTool

![English-source figure, page 34](/docs/rockchip-secure-boot/assets/en-p034-figure-01.png)

```text
[System]
support_chip=3308|3326|3399|3228h|3229|3368|3228|3288|3128|3036
new_crypto=3308|3326
#using software to check signature,using sha160 ,belong to "soft_sign"
soft_sign=3128|3036
hard_sign_big_hash=3228h|3368|3228|3288
hard_sign_little_hash=3399
hard_sign_pss=3308|3326|3229

sign_flag=0x20
sign_soft_version=
sign_nonce=
```

Some comments are clipped at the right edge of the source screenshot. All visible configuration keys and values are transcribed above; clipped comment endings are not guessed.

Figure 6-6-2 config.ini

3. Use re-signed firmware or RKMiniLoader burnning. After burnning, restart the machine. The RKMiniLoader will be responsible for generating hash of public key and writing it to OTP during startup and enable secure boot.

![English-source figure, page 35](/docs/rockchip-secure-boot/assets/en-p035-figure-01.png)

Figure 6-6-3 OTP program flow

4. If OTP program success, serial port print “otp write key success!!!”. If OTP program fail, serial port print"otp write error: !!!".

## 8. Firmware Upgrade

### 8.1 Firmware Upgrade

Open the signed firmware and connect the device which has programmed eFuse to the PC by USB cable:

![English-source figure, page 37](/docs/rockchip-secure-boot/assets/en-p037-figure-01.png)

Figure 7-1 Upgrade tool 1 Select ‘Upgrade’ option and Click "Run" button to start firmware upgrade and wait it to be completed:

![English-source figure, page 38](/docs/rockchip-secure-boot/assets/en-p038-figure-01.png)

Figure 7-2 Upgrade tool 2

## 9. Verification

### 9.1 Check Secure Flag

Use serial port tools (e.g. SecureCRT) to get the log of system boot. These words show that the security boot is on: Secure Boot Mode: 0x1 or SecureMode = 0x1

![English-source figure, page 40](/docs/rockchip-secure-boot/assets/en-p040-figure-01.png)

Figure 8-1 Log of system boot

### 9.2 Secure Boot Test

The device which had programmed eFuse will enable secure boot rom, and could not boot from the un-signed firmware. So try to upgrade un-signed firmware or unmatched key signed firmware will fail; And upgrade matched signed firmware will boot success. SOC RK3128 and RK3126 will fail at “wait for loader”:

![English-source figure, page 41](/docs/rockchip-secure-boot/assets/en-p041-figure-01.png)

Figure 8-2 Upgrade fail 1 Other SOC will fail at “Download Boot”:

![English-source figure, page 41](/docs/rockchip-secure-boot/assets/en-p041-figure-02.png)

Figure 8-3 Upgrade fail 2

## 10. Secure Debug

### 10.1 Introduction

The secure debug only support disabled secure boot verification feature for upgrade unsigned kernel to speed up debugging. There has a 128-bit unique CPU ID for each SOC. The Signed Tools read the CPU ID and using RSA private key to Decryption and got a certificate, then the device using RSA public key to verify it. After the certificate is verified, the device will disable secure boot verification in uboot.

### 10.2 Secure Debug Process

![Secure debug flow (English original)](/docs/rockchip-secure-boot/assets/en-p043-secure-debug.png)

{% endraw %}
