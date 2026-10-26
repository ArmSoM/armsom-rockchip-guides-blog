---
title: "Rockchip Secure Boot 完整应用指南：签名、eFuse、OTP 与验证"
description: "Rockchip Secure Boot 完整应用指南：签名、eFuse、OTP 与验证 — RK-SM-YF-024 V2.2.0"
translation_key: "105-rockchip-secure-boot"
slug: "105-rockchip-secure-boot"
lang: "zh"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Secure Boot", "eFuse", "OTP"]
excerpt: "Rockchip Secure Boot 完整应用指南：签名、eFuse、OTP 与验证 — RK-SM-YF-024 V2.2.0"
---

{% raw %}

# Rockchip Secure Boot 完整应用指南：签名、eFuse、OTP 与验证

本文完整整理英文 RK-SM-YF-024 V2.2.0：保留第2–3页技术前言与第8–43页全部技术内容。只有英文 PDF，四语均使用英文原图（部分工具界面本身为中文）。适用芯片按原稿列出，不据此扩大到新 SoC 或所有 ArmSoM 板卡；SDK/BSP、Loader/U-Boot、ROM、密钥格式、烧写电压及板级供电必须核对。未经 ArmSoM 硬件验证，未执行签名、烧录或熔丝操作。

> eFuse/OTP 编程不可逆，密钥及电压错误可能使设备无法启动或更新。以下为原厂参考流程，不是板卡可直接执行方案。原文 §2.5 的 rsaHash[128] 与 RSA2048、§7.5 的 RK3336 与 §7.6 的 RK3326、旧章节交叉引用及 RSA Encryption/Decryption 措辞均保留并记录疑点，不猜改值。

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip U-Boot](https://github.com/rockchip-linux/u-boot)

## 1. 前言

术语（沿用原稿定义）：

| 术语 | 定义 |
| --- | --- |
| Sector | 扇区大小为512字节 |
| eFuse | SoC内一次性可编程存储IP |
| RSA Encryption | 使用公钥加密 |
| RSA Decryption | 使用私钥解密 |
| OTP | SoC内一次性可编程存储IP |
| MaskRom | SoC内BootROM，只读引导存储器 |
| loader | 引导/第一级加载器，一般指RKMiniloader或SPL(uboot) |
| OBM CODE | 一般指OEM/OBM编译或信任的代码 |

本文介绍Rockchip安全启动方案。安全启动验证固件有效性，防止无效固件升级和启动。已编程eFuse的设备会启用安全启动ROM，不能启动未签名固件；升级未签名或密钥不匹配的固件将失败。

注意：有效签名固件仍可以在复制的设备电路板或相同CPU平台硬件上正常启动。安全启动验证软件有效性，不验证硬件。

原稿适用RK3126、RK3128、RK3228、RK3229、RK3288、RK3368、RK3399、RK3228H、RK3328、RK3326、RK3308、PX30。功能包括安全启动ROM、SHA256、RSA2048和通过eFuse或OTP哈希校验公钥。

原稿工具版本要求：Efuse tool V1.35或更新；SecureBootTool 1.79或更新；RKBatchTool 1.8或更新（已弃用，改用FactoryTool）；FactoryTool 1.39或更新。这是该文档的历史版本要求；§7.6另要求SecureBootTool V1.9或更新。

## 2. 架构

### 2.1 安全启动流程

![英文原稿技术图，第 8](/docs/rockchip-secure-boot/assets/en-p008-figure-01.png)

图 1-1 安全启动过程

### 2.2 安全启动顺序

![英文原稿技术图，第 9](/docs/rockchip-secure-boot/assets/en-p009-figure-01.png)

图 1-2 安全启动顺序

### 2.3 MaskRom 启动第一加载器（RKminiLoader/U-Boot）

![英文原稿技术图，第 9](/docs/rockchip-secure-boot/assets/en-p009-figure-02.png)

图 1-3-1 MaskRom 到 loader 的顺序。Flash 用户分区内第一加载器的布局。表 1-1 第一加载器数据布局。

| Range | 说明 |
| --- | --- |
| 0–63 sector | 64 sector reverse（原文） |
| 第一加载器(8128 sector)(5份) | 引导加载器分区 |
| 0-2047 | 加载器头部 |
| 2048-4095 | 公钥与数字签名 |
| 4096 - | 原始二进制 |
| ... |  |
| 引导加载器副本(4)分区 |  |
| 0-2047 | 加载器头部 |
| 2048-4095 | 公钥与数字签名 |
| 4096 - | 原始二进制 |

地址 2048–4095 的公钥与数字签名结构：

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

公钥：`uint32 RSA_N[64], RSA_E[64], RSA_C[64];` 数字签名：`uint32 signature[64]`。步骤1：从第一加载器分区获取公钥。步骤2：计算公钥的 SHA256 哈希，并与 OTP 中的哈希比较；匹配则成功加载第一加载器，否则启动失败。步骤3：计算原始二进制的 SHA256 哈希，并与数字签名经 RSA2048 加密的结果比较（使用步骤1取得的公钥）；匹配则成功加载第一加载器，否则启动失败。这里保留原文步骤2与步骤3的措辞。

### 2.4 第一加载器启动 U-Boot（可选的第二级加载器）

![英文原稿技术图，第 11](/docs/rockchip-secure-boot/assets/en-p011-figure-01.png)

图 1-4-1 启动 U-Boot

![英文原稿技术图，第 11](/docs/rockchip-secure-boot/assets/en-p011-figure-02.png)

U-Boot 分区为4MB，共4份；原图范围和内容如下。

| 实例 | 范围 | 说明 |
| --- | --- | --- |
| U-Boot | 0-2047 | 头部, 数字签名 |
| U-Boot | 2048- | 原始二进制 |
| ... | ... | ... |
| U-Boot copy(3) | 0-2047 | 头部, 数字签名 |
| U-Boot copy(3) | 2048- | 原始二进制 |

表 1-4 Flash 中的 U-Boot 布局。地址 0–2047 中含数字签名的头部结构：

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

数字签名：`unsigned char rsaHash[256];` 步骤1：从第一加载器分区获取公钥。步骤2：计算公钥的 SHA256 哈希并与 OTP 哈希比较；匹配则继续，否则启动失败。步骤3：计算原始二进制的 SHA256 哈希并与数字签名的 RSA2048 加密结果比较（使用步骤1的公钥）；匹配则加载成功并把公钥传给 U-Boot，否则启动失败。

### 2.5 U-Boot 启动包含 Linux 内核的 boot 镜像

![英文原稿技术图，第 12](/docs/rockchip-secure-boot/assets/en-p012-figure-01.png)

图 1-5 U-Boot 到 boot 的顺序。表 1-2 boot 数据布局。

| boot.img | 说明 |
| --- | --- |
| 0-2047 | 头部 |
| 2048-4095 | 数字签名 |
| 4096- | kernel,ramdisk,dtb... |
| ... |  |

地址 0–2047 的头部结构：

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

数字签名：`unsigned char rsaHash[128];` 步骤1：U-Boot 获取第一加载器取得的公钥。步骤2：计算公钥 SHA256 并与 OTP 哈希比较；匹配则继续，否则启动失败。步骤3：计算原始二进制 SHA256 并与签名的 RSA2048 加密结果比较（使用步骤1取得的公钥）；匹配则启动 Linux 内核，否则启动失败。

### 2.6 U-Boot 启动 Recovery

与启动 boot 镜像相同；原文要求参阅第 1.4 节（旧编号保留，需核对）。

## 3. eFuse 布局

RK3368、RK3288、RK3229 和 RK3228 使用 1024 bit eFuse 实现安全启动。表 2-1 eFuse 数据布局：

| 32位字寻址 | 说明 |
| --- | --- |
| 0x00 | 安全标志 Bits[7:0]：安全使能；Bits[31:8]：保留 |
| 0x01-0x3 | 保留 |
| 0x04-0x07 | 保留 |
| 0x8-0xF | RSA公钥哈希 |
| 0x10-0x17 | 保留 |
| 0x18 | 保留 |
| 0x19-0x1A | 保留 |
| 0x1B-0x1D | 保留 |
| 0x1E | 保留 |
| 0x1F | eFuse写锁定位 |

RK3228H 和 RK3328 使用 7680 bit OTP 实现安全启动。表 2-2 OTP 数据布局：

| 32位字寻址 | 说明 |
| --- | --- |
| 0-63 | 公钥(N) |
| 64-127 | 公钥(E) |
| 128 | 安全标志 Bits[7:0]：0xff启用；Bits[15:8]：RSA_E大小（原稿word uint）；Bits[31:16]：保留 |
| 129 | 可信固件撤销计数器(ID #0) |
| 130-131 | 非可信固件撤销计数器(ID #1) |
| 132-239 | 保留 |

RK3326、PX30 和 RK3308 使用 4096 bit OTP 实现安全启动。表 2-3 OTP 数据布局2：

| 32位字寻址 | 说明 |
| --- | --- |
| 0 | 安全启动使能标志 |
| 1-3 | 保留 |
| 4-11 | RSA公钥哈希(SHA256) |
| 12-19 | 设备根密钥 |
| 20-23 | 固件加密密钥 |
| 24-25 | 可信固件撤销计数器(ID #0) |
| 26-31 | 非可信固件撤销计数器(ID #1) |
| 32-97 | 为OEM保留 |

## 4. 总体操作流程

启用安全启动的流程：

1. 打包 update.img

2. 签名固件 update.img

3. 烧写 eFuse 或 OTP

4. 升级固件 update.img

5. 检查安全启动已启用

![英文原稿技术图，第 18](/docs/rockchip-secure-boot/assets/en-p018-figure-01.png)

图 3-1 操作流程

## 5. 制作 update.img

### 5.1 生成镜像

编译 Android 后，使用 `./mkimage.sh ota` 生成镜像。

![英文原稿技术图，第 21](/docs/rockchip-secure-boot/assets/en-p021-figure-01.png)

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

图 4-1 打包脚本

### 5.2 打包 update.img

参阅 RKTools/windows/AndroidTool/rockdev/package-file，该文件控制需要打包的文件。以 RK3288 为例，修改 bootloader 路径，注释 resource 和 kernel 行，将 backup 设置为 RESERVED。

![英文原稿技术图，第 21](/docs/rockchip-secure-boot/assets/en-p021-figure-02.png)

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

图 4-2 控制打包的 package-file。把 RKTools/windows 目录复制到 Windows 系统，然后运行 AndroidTool/rockdev/mkupdate.bat 生成 update.img。

![英文原稿技术图，第 22](/docs/rockchip-secure-boot/assets/en-p022-figure-01.png)

图 4-3 打包脚本

## 6. 固件签名流程

本说明针对 Windows 工具；Linux 有对应的独立工具。

### 6.1 生成 RSA 密钥

![英文原稿技术图，第 24](/docs/rockchip-secure-boot/assets/en-p024-figure-01.png)

图 5-1 生成密钥

### 6.2 保存 RSA 密钥

此密钥用于签名固件和 OTA，请备份到安全存储。密钥对非常重要，必须妥善保管；丢失或泄露会使产品面临高风险，原有设备也将无法继续更新。必须在整个产品生命周期内维护该密钥。

![英文原稿技术图，第 25](/docs/rockchip-secure-boot/assets/en-p025-figure-01.png)

图 5-2 保存密钥

### 6.3 加载 RSA 密钥

![英文原稿技术图，第 25](/docs/rockchip-secure-boot/assets/en-p025-figure-02.png)

图 5-3 加载密钥

### 6.4 配置

![英文原稿技术图，第 26](/docs/rockchip-secure-boot/assets/en-p026-figure-01.png)

选择 SoC 平台。

![英文原稿技术图，第 26](/docs/rockchip-secure-boot/assets/en-p026-figure-02.png)

efuse 选项把 RSA 公钥哈希存入 eFuse，并启用安全启动 ROM（原稿推荐）。soft 用于特殊应用，不启用安全启动 ROM，使用 RSA1024 和 SHA160。

![英文原稿技术图，第 26](/docs/rockchip-secure-boot/assets/en-p026-figure-03.png)

每个产品型号只生成一次 RSA KEY，请备份，否则可能无法再次升级固件或 OTA。

![英文原稿技术图，第 26](/docs/rockchip-secure-boot/assets/en-p026-figure-04.png)

加载备份 RSA 密钥，支持 openssl 生成的 .pem 格式。

![英文原稿技术图，第 26](/docs/rockchip-secure-boot/assets/en-p026-figure-05.png)

签名固件。

### 6.5 签名固件

原文要求“确保 boot.img 和 recovery.img 包含在 kernel image 中”，参阅打包命令。此包含关系措辞存在疑点，保留原信息，不据此推断镜像结构。

![英文原稿技术图，第 26](/docs/rockchip-secure-boot/assets/en-p026-figure-06.png)

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

图 5-4 镜像打包命令。打开固件镜像：

![英文原稿技术图，第 27](/docs/rockchip-secure-boot/assets/en-p027-figure-01.png)

图 5-5 SecureBootTool 选择固件。签名后的固件：

![英文原稿技术图，第 27](/docs/rockchip-secure-boot/assets/en-p027-figure-02.png)

图 5-6 已签名固件

## 7. 烧写 eFuse

### 7.1 硬件条件

Rockchip AP 系列有两种用户安全数据烧写方式：eFuse 编程，以及仅少量芯片支持的 OTP 编程，说明如下。

#### 7.1.1 eFuse 编程

RK3126、RK3128、RK3228、RK3229、RK3288、RK3368 和 RK3399 支持 eFuse 编程。一般要求如下。

A. 不需要编程 eFuse 数据的产品，建议把 eFuse 电源脚直接接地，避免误操作改变数据。RK3126/RK3126C 的 eFuse 电源脚与 SARADC 复用，不能接地。

B. 需要 eFuse 编程的产品，在 eFuse 电源脚加下拉电阻接地，确保正常工作时电压不波动并防止误编程。阻值参照各平台原理图，通常为 47Ω–10KΩ。

C. eFuse 编程有两种供电方式。a) 板载供电：优点是不需要 PCBA 针床测试板，可先编程 eFuse 再升级固件；正常工作时固件必须确保 eFuse 电源关闭，保持 0V 防误操作。缺点是主板需增加电源电路，增加物料成本，且必须确保固件始终不误操作。适用于不希望增加 PCBA 测试流程的产品，如接口和装配简单、PCBA 测试不需要针床的部分 BOX 产品。b) PCBA 测试板供电（原稿推荐）：优点是主板只需测试点，无供电电路，用户也无法通过软件破解该供电路径；缺点是增加 PCBA 测试流程和测试成本。适用于平板等装配复杂的产品；PCBA 异常后的返修替换更复杂，通常已有 PCBA 测试流程，在该流程中编程 eFuse 较合理。

D. 电路说明：各芯片平台的 eFuse 编程电压不同（如 1.5/1.8/2.5V），引脚号和电流要求也不同。

建议供电能力超过 50mA；具体电压和下拉阻值参阅原理图。表 6-1 汇总硬件参数。

| 芯片型号 | eFuse电源 | 编程方式 | VQPS电流要求 | 下拉阻值 | eFuse电源引脚 | 备注 |
| --- | --- | --- | --- | --- | --- | --- |
| RK3126/RK3126C | 2.5V | PCBA测试板供电 | >50mA | 无 | PIN68 | 与ADC复用 |
| RK3128 | 2.5V | 板载或外部供电 | >50mA | <=10K | R10 |  |
| RK3168/RK3188 | 1.5V | 板载或外部供电 | >50mA | <=510R | Y10 |  |
| RK3228/RK3229 | 1.6V | 板载或外部供电 | >50mA | <=100R | R10 |  |
| RK3288 | 1.5V | 板载或外部供电 | >50mA | <=510R | P19 |  |
| RK3368 | 1.5V | 板载或外部供电 | >50mA | <=47R | Y10 |  |
| RK3399 | 1.8V | 板载或外部供电 | >50mA | <=1K | AD23 |  |

推荐供电方式见下图。a) PartA：eFuse 供电电路，按上述电压选择合适 LDO，可放在主板或 PCBA 测试板。b) PartB：eFuse 电源脚通过 R4（47R–10K）下拉保持低电平，防止误操作。若电源电路位于测试板，SoC 主板需增加对应测试点，便于夹具探针接触。注意：a) RK3126C 的 eFuse 电源与 ADC 复用，不能接下拉电阻。b) RK3228/RK3229 建议调为 1.55–1.6V 以提高稳定性。c) 板载供电时，图中的 eFuse_PWREN 必须分配独立 GPIO 控制 LDO，确保正常工作时 VCC_eFuse 脚没有电压输出。详见 Rockchip 参考原理图；若未分配 GPIO，原稿要求联系厂商或使用外部供电。

![英文原稿技术图，第 31](/docs/rockchip-secure-boot/assets/en-p031-figure-01.png)

图 6-1 eFuse 电路

#### 7.1.2 OTP 编程

RK3328 和 RK3228H 支持 OTP 编程，无需外部供电电路。OTP_VCC18（PIN16）始终由 VCC_18 供电；只需执行 OTP 编程的专用时序，无需额外硬件改动。

![英文原稿技术图，第 31](/docs/rockchip-secure-boot/assets/en-p031-figure-02.png)

图 6-2 OTP 电路

### 7.2 工具界面

![英文原稿技术图，第 31](/docs/rockchip-secure-boot/assets/en-p031-figure-03.png)

图 6-3 工具界面

### 7.3 加载已签名固件

![英文原稿技术图，第 32](/docs/rockchip-secure-boot/assets/en-p032-figure-01.png)

图 6-4 加载已签名固件

### 7.4 单击 Run 开始

![英文原稿技术图，第 32](/docs/rockchip-secure-boot/assets/en-p032-figure-02.png)

图 6-5 芯片编程

### 7.5 烧写 eFuse

通过 USB 将设备连接 PC，工具自动把 RSA 公钥哈希写入 eFuse。eFuse 编程需要外部供电，详见 SoC 数据手册。注意：原文列 RK3228H、RK3328、RK3336、RK3308、PX30 不需要步骤 6.2–6.4，通过升级已签名固件完成编程。型号 RK3336 及章节编号均照录待核对。

### 7.6 烧写 OTP

RK3228H、RK3328、RK3326、RK3308 和 PX30 支持 OTP 编程，公钥哈希需要写入 OTP。步骤如下：

1. 先按上述流程烧录已签名固件。若机器正常启动，签名流程正确，然后才能编程 OTP。

2. 使用 SecureBootTool V1.9 或更新版本。打开工具目录 config.ini，找到 sign_flag=，设置 sign_flag=0x20（bit5=1），使 RKMiniLoader 能写 OTP。保存后重新打开 SecureBootTool.exe，对固件或 RKMiniLoader 重新签名。

![英文原稿技术图，第 33](/docs/rockchip-secure-boot/assets/en-p033-figure-01.png)

图 6-6-1 工具

![英文原稿技术图，第 34](/docs/rockchip-secure-boot/assets/en-p034-figure-01.png)

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

原稿截图右侧的部分注释已截断；上方转录全部可见配置键和值，不猜补注释。

图 6-6-2 config.ini 配置

3. 使用重新签名的固件或 RKMiniLoader 烧录，然后重启。启动过程中 RKMiniLoader 生成公钥哈希、写入 OTP 并启用安全启动。

![英文原稿技术图，第 35](/docs/rockchip-secure-boot/assets/en-p035-figure-01.png)

图 6-6-3 OTP 流程

4. 成功时串口输出 `otp write key success!!!`；失败时输出 `otp write error: !!!`。

## 8. 固件升级

### 8.1 固件升级

打开已签名固件，通过 USB 将已编程 eFuse 的设备连接 PC。

![英文原稿技术图，第 37](/docs/rockchip-secure-boot/assets/en-p037-figure-01.png)

图 7-1 升级工具1。选择 Upgrade，单击 Run 开始升级并等待完成。

![英文原稿技术图，第 38](/docs/rockchip-secure-boot/assets/en-p038-figure-01.png)

图 7-2 升级工具2

## 9. 验证

### 9.1 检查安全标志

使用串口工具（如 SecureCRT）读取启动日志。`Secure Boot Mode: 0x1` 或 `SecureMode = 0x1` 表示安全启动已开启。

![英文原稿技术图，第 40](/docs/rockchip-secure-boot/assets/en-p040-figure-01.png)

图 8-1 启动日志

### 9.2 安全启动测试

已编程 eFuse 的设备启用安全启动 ROM，不能从未签名固件启动。升级未签名或密钥不匹配的固件应失败；匹配签名的固件应成功启动。RK3128 和 RK3126 会在 wait for loader 阶段失败。

![英文原稿技术图，第 41](/docs/rockchip-secure-boot/assets/en-p041-figure-01.png)

图 8-2 升级失败1。其他 SoC 在 Download Boot 阶段失败：

![英文原稿技术图，第 41](/docs/rockchip-secure-boot/assets/en-p041-figure-02.png)

图 8-3 升级失败2

## 10. 安全调试

### 10.1 简介

Secure Debug 仅支持关闭安全启动校验，以便升级未签名内核并加速调试。每颗 SoC 有唯一的128位 CPU ID。签名工具读取 CPU ID，以 RSA 私钥执行原文所称的 Decryption，生成证书；设备用 RSA 公钥验证证书，验证通过后在 U-Boot 中关闭安全启动校验。仅保留原厂受控调试流程，不表示可以绕过未知设备的授权。

### 10.2 安全调试流程

![安全调试流程（英文原图）](/docs/rockchip-secure-boot/assets/en-p043-secure-debug.png)

{% endraw %}
