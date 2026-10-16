---
title: "Rockchip Crypto and HWRNG: Drivers, librkcrypto API and Performance"
description: "Complete Rockchip Crypto V1/V2/V3/V4/CE and HWRNG reference: kernel configuration, DTS, librkcrypto structures and APIs, source performance tests and limitations."
translation_key: "036-rockchip-crypto-hwrng"
slug: "036-rockchip-crypto-hwrng"
lang: "en"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["Crypto", "HWRNG", "librkcrypto", "RK3588", "RK3576"]
keywords: "ArmSoM Rockchip Crypto HWRNG librkcrypto RK3588 RK3576"
excerpt: "Complete Rockchip Crypto V1/V2/V3/V4/CE and HWRNG reference: kernel configuration, DTS, librkcrypto structures and APIs, source performance tests and limitations."
---

{% raw %}

# Rockchip Crypto and HWRNG: Drivers, librkcrypto API and Performance

This is a platform reference derived from Rockchip V1.4.2 documentation, not an ArmSoM hardware validation report or a promise of support on every board. The source covers SoCs including RK3588 and RK3576. Verify the actual ArmSoM board, SDK/BSP branch, kernel configuration, TEE/OTP availability and algorithm selection. The source lists kernel 4.19/5.10/6.1 commit dependencies; these combinations are not interchangeable. Board-specific adaptation remains unverified.

The Chinese article follows the 49-page Chinese PDF; this English article follows the 52-page English PDF, and Russian translates the English text. Both sources are V1.4.2, but local differences are identified inline and in the [editorial notes](/docs/rockchip-crypto-hwrng/EDITORIAL-NOTES.md). All technical chapters, examples, parameters and figures are retained. Cover date, classification, legal/contact matter, intended audience and revision history are omitted. Original code comments are preserved.

**Operational risk:** OTP writes and read locks may be irreversible and may affect other OTP regions. The API examples are source material only; no programming, locking or crypto test was performed. Check the exact SoC TRM, OTP/TEE guides and SDK implementation first. All performance figures are Rockchip source examples, not ArmSoM measurements. Official platform resources: [ArmSoM documentation](https://docs.armsom.org/), [Rockchip Linux](https://github.com/rockchip-linux).

Technical scope retained from the source preface: Rockchip Crypto and HWRNG(TRNG) driver and upper-layer application development. The following is the source product-version table, not an ArmSoM board compatibility guarantee.

| Chipset name | Kernel version |
|---|---|
| All Rockchip chips with crypto IP | Linux 4.19 |
| All Rockchip chips with crypto IP | Linux 5.10 |
| All Rockchip chips with crypto IP | Linux 6.1 |

<!-- Source EN PDF p.7, block 0 -->

## 1. Overview

<!-- Source EN PDF p.7, block 1 -->

CRYPTO: There are currently five versions of CRYPTO IP on the RK platform, including CRYPTO V1/V2/V3/V4/CE. V1 is an earlier IP, which supports fewer algorithms and functions. Therefore, the IP core of CRYPTO V2 was redesigned, and a series of functional strengthening and updating were carried out on the basis of V2.V2/V3/V4 was fully compatible with the basic generation function, V3 added multi-threaded switching support on the basis of V2, V4 realized the reuse of CRYPTO IP core on the basis of V3 and reduce the IP chip area.

<!-- Source EN PDF p.7, block 2 -->

RKCE is on the original computing core, redesign the register and call mode, the driver is completely incompatible with V2/V3/V4, rewrite the new driver.

<!-- Source EN PDF p.7, block 3 -->

TRNG: Most of the hardware random number modules of the chip platform previously existed in the hardware CRYPTO IP (including CRYPTO V1 and some CRYPTO V2). Starting with RK356x, HWRNG (TRNG) is a separate hardware module.

<!-- Source EN PDF p.7, block 4 -->

### 1.1 crypto v1

<!-- Source EN PDF p.7, block 5 -->

| Algorithm | Description |
|---|---|
| DES/TDES | Support DES/3DES (ECB and CBC chain mode) |
| AES | Support AES 128/192/256 bits key mode, ECB/CBC/CTR/XTS chain mode |
| HASH | Support SHA1/SHA256/MD5 (with hardware padding) HASH function |
| RSA | Support PKA 512/1024/2048 bit Exp Modulator (RK3126, RK3128, RK3288, and RK3368 are<br>not supported) |
| TRNG | Support 256 bit True Random Number Generator (TRNG) |


> Source difference: Chinese §1.1 additionally lists TDES EEE/EDE, and §1.2 limits TDES to EDE. These restrictions are not fully stated in the English table; verify the exact IP and SDK.



<!-- Source EN PDF p.8, block 9 -->

### 1.2 crypto v2

<!-- Source EN PDF p.8, block 11 -->

| Algorithm | Description |
|---|---|
| DES/TDES | Support ECB/CBC/OFB/CFB mode. |
| AES | Support ECB/CBC/OFB/CFB/CTR/CTS/XTS/CCM/GCM/CBC-MAC/CMAC mode. |
| SM4 | Support ECB/CBC/OFB/CFB/CTR/CTS/XTS/CCM/GCM/CBC-MAC/CMAC mode. (SM4 is<br>optional) |
| HASH | Support MD5/SHA1/SHA224/SHA256/SHA384/SHA512/SM3/SHA512-224/SHA512-256 with<br>hardware padding. (SM3 is optional) |
| HMAC | Support HMAC of SHA-1, SHA-256, SHA-512, MD5, SM3 with hardware padding. (SM3 is<br>optional) |
| RSA/ECC | Support up to 4096 bits PKA mathematical operations for RSA/ECC/SM2. |
| TRNG | Support 256 bit True Random Number Generator (TRNG) |


> Source difference: Chinese §1.1 additionally lists TDES EEE/EDE, and §1.2 limits TDES to EDE. These restrictions are not fully stated in the English table; verify the exact IP and SDK.



<!-- Source EN PDF p.8, block 15 -->

### 1.3 crypto v3

<!-- Source EN PDF p.8, block 16 -->

On the basis of Crypto V2 algorithm, Crypto V3 add multithreading support. The Cyrpto V3 platform has been able to automatically identify supported algorithms since RV1106, so compatible uses "rockchip,crypto-v3" as the identifier.

<!-- Source EN PDF p.8, block 17 -->

### 1.4 crypto v4

<!-- Source EN PDF p.8, block 18 -->

On the basis of crypto v3 algorithm, some optimization is done. In the use of IP drivers and crypto v3 can be compatible with normal reuse code. This compatible uniformly uses "rockchip,crypto-v4" as the identifier.

<!-- Source EN PDF p.8, block 19 -->

### 1.5 crypto ce

<!-- Source EN PDF p.8, block 20 -->

RKCE is on the original computing core, redesign the register and call mode, the driver is completely incompatible with V2/V3/V4, rewrite the new driver. This compatible uniformly uses "rockchip,crypto-ce" as the identifier.

<!-- Source EN PDF p.8, block 21 -->

### 1.6 The crypto IP version of chips

<!-- Source EN PDF p.8, block 22 -->

The crypto IP version of chips show below:

<!-- Source EN PDF p.8, block 23 -->

The platforms that use crypto V1 are:

<!-- Source EN PDF p.8, block 24 -->

RK3399, RK3288, RK3368, RK3328/RK3228H, RK322x, RK3128, RK1108, RK3126

<!-- Source EN PDF p.9, block 25 -->

The platforms that use crypto V2 are:

<!-- Source EN PDF p.9, block 26 -->

RK3326/PX30, RK3308, RK1808, RV1126/RV1109, RK2206, RK356x, RK3588

<!-- Source EN PDF p.9, block 27 -->

The platforms that use crypto V3 are:

<!-- Source EN PDF p.9, block 28 -->

RV1106, RV1103

<!-- Source EN PDF p.9, block 29 -->

The platforms that use crypto V4 are:

<!-- Source EN PDF p.9, block 30 -->

RK3528, RK3562, RK3503, RK3506, RK3576, RV1103B, RV1106B

<!-- Source EN PDF p.9, block 31 -->

The platforms that use crypto CE are:

<!-- Source EN PDF p.9, block 32 -->

RV1126B

<!-- Source EN PDF p.9, block 33 -->

## 2. Driver Development

<!-- Source EN PDF p.9, block 34 -->

### 2.1 Driver Code Description

<!-- Source EN PDF p.9, block 35 -->

#### 2.1.1 hwrng

<!-- Source EN PDF p.9, block 36 -->

Crypto V1 / V2, TRNGV1, RKRNG four platforms are centralized in the same c file because HWRNG driver is relatively simple.

<!-- Source EN PDF p.9, block 37 -->

The driver does not distinguish the specific chip model, only according to "rockchip,cryptov1-rng" and "rockchip,cryptov2-rng", "rockchip,trngv1", "rockchip,rkrng" four compatible partition. Currently, 'rockchip,trngv1' and "rockchip,rkrng" is a separate HWRNG module, and the other two HWRNG are built into the Crypto module.

<!-- Source EN PDF p.9, block 38 -->

Driver Source Code: drivers/char/hw_random/rockchip-rng.c

<!-- Source EN PDF p.9, block 39 -->

#### 2.1.2 crypto

<!-- Source EN PDF p.9, block 40 -->

The current driver implementation algorithm is as follows:

<!-- Source EN PDF p.9, block 41 -->

crypto v1:

<!-- Source EN PDF p.9, block 42 -->

AES: ECB/CBC

<!-- Source EN PDF p.9, block 43 -->

DES/TDES: ECB/CBC

<!-- Source EN PDF p.9, block 44 -->

HASH: SHA1/SHA256/MD5

<!-- Source EN PDF p.9, block 45 -->

crypto v2/v3/v4: (Some chipset may not support all algorithm)

<!-- Source EN PDF p.9, block 46 -->

AES: ECB/CBC/OFB/CFB/CTR/GCM

<!-- Source EN PDF p.9, block 47 -->

DES/TDES: ECB/CBC/CFB/OFB

<!-- Source EN PDF p.9, block 48 -->

SM4: ECB/CBC/OFB/CFB/OFB/CTR/GCM

<!-- Source EN PDF p.9, block 49 -->

HASH: SHA1/SHA256/SHA384/SHA512/MD5/SM3

<!-- Source EN PDF p.10, block 50 -->

HMAC: HMAC_SHA1/HMAC_SHA256/HMAC_SHA512/HMAC_MD5/HMAC_SM3

<!-- Source EN PDF p.10, block 51 -->

RSA: Support up to 4096 bits key length.

<!-- Source EN PDF p.10, block 52 -->

crypto v2/v3/v4 Hardware full version(The mode driver for the following deleted lines has not been implemented yet):

<!-- Source EN PDF p.10, block 53 -->

AES(128/192/256): ECB/CBC/OFB/CFB/CTR/~~XTS/CTS/CCM~~/GCM/~~CBC-MAC/CMAC~~

<!-- Source EN PDF p.10, block 54 -->

SM4: ECB/CBC/OFB/CFB/CTR/~~XTS/CTS/CCM~~/GCM/~~CBC-MAC/CMAC~~

<!-- Source EN PDF p.10, block 55 -->

DES/TDES: ECB/CBC/OFB/CFB

<!-- Source EN PDF p.10, block 56 -->

HASH: MD5/SHA-1/SHA256/SHA512/SM3/SHA224/SHA384/~~SHA512_224/SHA512_384~~

<!-- Source EN PDF p.10, block 57 -->

HMAC: SHA-1/SHA-256/SHA-512/MD5/SM3

<!-- Source EN PDF p.10, block 58 -->

RSA: Support up to 4096 bits key length.

<!-- Source EN PDF p.10, block 59 -->

crypto v2/v3/v4 Hardware difference table

<!-- Source EN PDF p.10, block 60 -->

| Chip | AES | DES/TDES | SM3/SM4 | HASH | HMAC | RSA/ECC | multi -<br>thread |
|---|---|---|---|---|---|---|---|
| RK3326/PX30/RK3308 | ✓ | ✓ | × | ✓ | ✓ | RSA | × |
| RK1808 | AES-128 | × | × | SHA-1SHA-224/SHA-256/MD5 | ✓ | RSA | × |
| RV1126/RV1109 | AES-128/AES-256 | ✓ | ✓ | ✓ | ✓ | RSA | × |
| RK2206 | ✓ | ✓ | × | ✓ | ✓ | RSA | × |
| RK3568/RK3588 | ✓ | ✓ | ✓ | ✓ | ✓ | RSA | × |
| RV1106/RV1103 | ✓ | ✓ | × | SHA-1/SHA-224/SHA-256/MD5 | ✓ | RSA | ✓ |
| RK3562 | ✓ | ✓ | × | SHA-1/SHA-224/SHA-256/MD5 | ✓ | RSA | ✓ |
| RK3528 | ✓ | ✓ | ✓ | ✓ | ✓ | RSA | ✓ |
| RK3503/RK3506 | ✓ | × | × | SHA-1/SHA-224/SHA-256/MD5 | ✓ | RSA | ✓ |
| RK3576 | ✓ | ✓ | ✓ | ✓ | ✓ | RSA/ECC/SM2 | ✓ |
| RV1103B/RV1106B | ✓ | ✓ | × | SHA-1/SHA-224/SHA-256/MD5 | ✓ | RSA | ✓ |
| RV1126B | ✓ | × | ✓ | SHA-1/SHA-224/SHA-256/MD5 | ✓ | RSA/ECC/SM2 | ✓ |

<!-- Source EN PDF p.10, block 61 -->

Note:

<!-- Source EN PDF p.10, block 62 -->

1\. RK1808 : AES supports only 128bit. For kernel drivers, AES is not supported.

<!-- Source EN PDF p.10, block 63 -->

2\. RV1126/RV1109: AES-192 is not supported, so the AES-192 part can only be implemented by the soft algorithm, but the soft algorithm cannot support all the modes of the hard algorithm. Therefore, it is recommended not to change the list of configured algorithms in the code.

<!-- Source EN PDF p.10, block 64 -->

The driver file are show as below:

<!-- Source EN PDF p.10, block 65 -->

```text
drivers/crypto/rockchip/rkcrypto // crypto v1/v2/v3/v4 driver
|-- procfs.c // proc statistics info (clock rate, algo list, etc.)
|-- procfs.h // proc head file
|-- rk_crypto_bignum.c // crypto PKA bignum api
|-- rk_crypto_bignum.h // crypto PKA bignum file
|-- rk_crypto_core.c // linux crypto Driver framework and public interface
|-- rk_crypto_core.h // linux crypto common head file
|-- rk_crypto_ecc.c // crypto v4 ecc/sm2 operation implement
|-- rk_crypto_ecc.h // crypto v4 ecc/sm2 register definition
|-- rk_crypto_ahash_utils.c // ahash common api
|-- rk_crypto_ahash_utils.h // ahash common head file
|-- rk_crypto_skcipher_utils.c // skcipher common api
|-- rk_crypto_skcipher_utils.h // skcipher common head file
|-- rk_crypto_utils.c // crypto common api
|-- rk_crypto_utils.h // crypto common head file
|-- rk_crypto_v1.c // crypto v1 hardware related interface implementation
|-- rk_crypto_v1.h // crypto v1 structure and interface declaration
|-- rk_crypto_v1_skcipher.c // crypto v1 block cipher algorithm implement
|-- rk_crypto_v1_ahash.c // crypto v1 hash algorithm implement
|-- rk_crypto_v1_reg.h // crypto v1 hardware register definition
|-- rk_crypto_v2.c // crypto v2 hardware related interface implementation
|-- rk_crypto_v2.h // crypto v2 structure and interface declaration
|-- rk_crypto_v2_skcipher.c // crypto v2 block cipher algorithm implement
|-- rk_crypto_v2_ahash.c // crypto v2 hash algorithm implement
|-- rk_crypto_v2_akcipher.c // crypto v2 RSA/EC algorithm implement
|-- rk_crypto_v2_pka.c // crypto v2 pka operation implement
|-- rk_crypto_v2_reg.h // crypto v2 hardware register definition
|-- rk_crypto_v3.c // crypto v3/v4 Hardware related interface implementation
|-- rk_crypto_v3.h // crypto v3/v4 Structure and interface declaration
|-- rk_crypto_v3_skcipher.c // crypto v3/v4 block cipher algorithm implement
|-- rk_crypto_v3_ahash.c // crypto v3/v4 hash algorithm implement
|-- rk_crypto_v3_reg.h // crypto v3/v4 hardware register definition
|-- rk_ecdsasignature.asn1 // ecdsa signature asn1 struct definition
`-- rk_sm2signature.asn1 // sm2 signature ans1 struct definition
```

<!-- Source EN PDF p.11, block 67 -->

```text
drivers/crypto/rockchip/rkce // crypto ce driver
|-- rkce_akcipher.c // rkce RSA/EC algorithm implement
|-- rkce_akcipher.h // rkce RSA/EC algorithm define
|-- rkce_bignum.c // rkce PKA bignum api
|-- rkce_bignum.h // rkce PKA bignum file
|-- rkce_buf.c // rkce CMA buffer api
|-- rkce_buf.h // rkce CMA buffer file
|-- rkce_core.c // linux crypto Driver framework and public interface
|-- rkce_core.h // linux crypto common head file
|-- rkce_debug.c // rkce debug api
|-- rkce_debug.h // rkce debug file
|-- rkce_dev.c // rkce crypto algorithm registration
|-- rkce_dev.h // rkce crypto head file
|-- rkce_ecc.c // rkce ecc/sm2 operation
|-- rkce_ecc.h // rkce v4 ecc/sm2 register definition
|-- rkce_ecdsasignature.asn1 // ecdsa signature asn1 struct
|-- rkce_error.h // rkce error code define
|-- rkce_hash.c // rkce hash algorithm implement
|-- rkce_hash.h // rkce hash algorithm define
|-- rkce_monitor.c // monitor thread to prevent computation from stalling
|-- rkce_monitor.h // monitor thread head file
|-- rkce_pka.c // rkce pka operation implement
|-- rkce_pka.h // rkce pka operation define
|-- rkce_reg.h // rkce hardware register
|-- rkce_skcipher.c // rkce block cipher algorithm
|-- rkce_skcipher.h // rkce block cipher define
`-- rkce_sm2signature.asn1 // sm2 signature ans1 struct
```

<!-- Source EN PDF p.12, block 69 -->

### 2.2 Enable hwrng

<!-- Source EN PDF p.12, block 70 -->

#### 2.2.1 Menuconfig

<!-- Source EN PDF p.12, block 71 -->

The HWRNG driver is compiled into the kernel by default, and the dts file determines whether to enable it.

<!-- Source EN PDF p.12, block 72 -->

The configuration is shown in the following figure (Red marks indicate the configuration path and the options that need to be configured).

<!-- Source EN PDF p.12, block 73 -->

![Source technical figure — PDF 12](/docs/rockchip-crypto-hwrng/assets/en-p12-figure1.png)

<!-- Source EN PDF p.12, block 74 -->

Or add the following statement to the config file (which is configured by default in rockchip_defconfig) :

<!-- Source EN PDF p.12, block 75 -->

```text
CONFIG_HW_RANDOM=y
CONFIG_HW_RANDOM_ROCKCHIP=y
```

<!-- Source EN PDF p.12, block 76 -->

#### 2.2.2 Enable rng node in dts

<!-- Source EN PDF p.12, block 77 -->

At present, most chips dtsi file have been configured with HWRNG nodes, and you only need to enable the rng module in the board-level dts, as shown below:

<!-- Source EN PDF p.12, block 78 -->

```text
&rng {
    status = "okay";
}
```

<!-- Source EN PDF p.12, block 79 -->

#### 2.2.3 Added rng node for new chip

<!-- Source EN PDF p.12, block 80 -->

Most of the chip platforms have been configured with rng nodes. If the dtsi of chip has not been configured with rng nodes, you can perform the following operations to configure them.

<!-- Source EN PDF p.12, block 81 -->

Attention:

<!-- Source EN PDF p.13, block 82 -->

1\. The RNG base address needs to be modified according to the chip TRM. The RNG base address is the CRYPTO base address.

<!-- Source EN PDF p.13, block 83 -->

2\. Clocks macros may differ from platform to platform. If there is an error on dts, you can go to the include/dt-bindings/clock directory and execute grep -rn CRYPTO to find the corresponding clock macros name, as shown below:

<!-- Source EN PDF p.13, block 84 -->

```text
troy@inno:~/kernel/include/dt-bindings/clock$ grep -rn CRYPTO
rk3328-cru.h:57:#define SCLK_CRYPTO 59
rk3328-cru.h:206:#define HCLK_CRYPTO_MST 336
rk3328-cru.h:207:#define HCLK_CRYPTO_SLV 337
rk3328-cru.h:284:#define SRST_CRYPTO 68
```

<!-- Source EN PDF p.13, block 85 -->

crypto v1:

<!-- Source EN PDF p.13, block 86 -->

```text
rng: rng@ff060000 {
    compatible = "rockchip,cryptov1-rng";
    reg = <0x0 0xff060000 0x0 0x4000>;
    clocks = <&cru SCLK_CRYPTO>, <&cru HCLK_CRYPTO_SLV>;
    clock-names = "clk_crypto", "hclk_crypto";
    assigned-clocks = <&cru SCLK_CRYPTO>, <&cru HCLK_CRYPTO_SLV>;
    assigned-clock-rates = <150000000>, <100000000>;
    status = "disabled";
};
```

<!-- Source EN PDF p.13, block 87 -->

crypto v2:

<!-- Source EN PDF p.13, block 88 -->

The actual TRNG does not need to rely on all clocks, but only on hclk_crypto

<!-- Source EN PDF p.13, block 89 -->

```text
rng: rng@ff500400 {
    compatible = "rockchip,cryptov2-rng";
    reg = <0xff500400 0x80>; # Need to add 0x400 if rng is inside crypto
    clocks = <&cru HCLK_CRYPTO>;
    clock-names = "hclk_crypto";
    power-domains = <&power RV1126_PD_CRYPTO>;
    resets = <&cru SRST_CRYPTO_CORE>;
    reset-names = "reset";
    status = "disabled";
};
```

<!-- Source EN PDF p.13, block 90 -->

trng v1:

<!-- Source EN PDF p.13, block 91 -->

At present, RK3588 and RV1106 use the random number module of TRNG V1, which is completely different from the TRNG module split in Crypto V2 in design and improves the randomness.

<!-- Source EN PDF p.14, block 92 -->

```text
rng: rng@fe378000 {
    compatible = "rockchip,trngv1";
    reg = <0x0 0xfe378000 0x0 0x200>;
    interrupts = <GIC_SPI 400 IRQ_TYPE_LEVEL_HIGH>;
    clocks = <&scmi_clk SCMI_HCLK_SECURE_NS>;
    clock-names = "hclk_trng";
    resets = <&scmi_reset SRST_H_TRNG_NS>;
    reset-names = "reset";
    status = "disabled";
};
```

<!-- Source EN PDF p.14, block 93 -->

#### 2.2.4 Verify that HWRNG is enabled

<!-- Source EN PDF p.14, block 94 -->

1\. Execute `cat /sys/devices/virtual/misc/hw_random/rng_current`. A value of `rockchip` identifies the selected hardware driver.

<!-- Source EN PDF p.14, block 95 -->

2\. linux: execute `cat /dev/hwrng | od -x | head -n 1` will get a row of random numbers, and every time you run it, the content of the random number is different.

<!-- Source EN PDF p.14, block 96 -->

3\. Android: execute `cat /dev/hw_random | od -x | head -n 1` will get a row of random numbers, and every time you run it, the content of the random number is different.

<!-- Source EN PDF p.14, block 97 -->

### 2.3 Enable hardware crypto

<!-- Source EN PDF p.14, block 98 -->

Current driver code crypto v1 support rk3328, crypto v2 support px30 / rv1126 / rk3568 / rk3588, crypto v3 support rv1106 . For the above platforms, just enable config and dts node to enable hardware crypto.

<!-- Source EN PDF p.14, block 99 -->

The supported features will be reflected in the register information since RV1106, and Crypto V3 can automatically adapt to the new chip.

<!-- Source EN PDF p.14, block 100 -->

#### 2.3.1 Menuconfig

<!-- Source EN PDF p.14, block 101 -->

After menuconfig configuration, Rockchip crypto driver will be compiled into kernel. It will automatically adapt crypto IP version according to the chip platform compatible ID.

<!-- Source EN PDF p.14, block 102 -->

You can see the related configuration items of hardware crypto only after ensuring that CONFIG_CRYPTO_HW is enabled.

<!-- Source EN PDF p.15, block 103 -->

![Source technical figure — PDF 15](/docs/rockchip-crypto-hwrng/assets/en-p15-figure1.png)

<!-- Source EN PDF p.15, block 104 -->

Or add the following statement to the config file. CONFIG_CRYPTO_DEV_ROCKCHIP_V3 is just an example. You must change it according to the actual chip configuration. It is recommended to use menuconfig, which will automatically select the platform.

<!-- Source EN PDF p.15, block 105 -->

```text
CONFIG_CRYPTO_HW=y
CONFIG_CRYPTO_DEV_ROCKCHIP=y
CONFIG_CRYPTO_DEV_ROCKCHIP_V3=y
CONFIG_CRYPTO_DEV_ROCKCHIP_DEV=y
```

<!-- Source EN PDF p.15, block 106 -->

#### 2.3.2 Enable crypto node dts

<!-- Source EN PDF p.15, block 107 -->

After confirming that the crypto dts node is correctly configured, just enable the crypto module in the board- level dts file, as shown in the following:

<!-- Source EN PDF p.15, block 108 -->

```text
&crypto {
    status = "okay";
};
```

<!-- Source EN PDF p.15, block 109 -->

#### 2.3.3 Added crypto node for new chip

<!-- Source EN PDF p.15, block 110 -->

If there is no crypto node in chip dtsi file, follow these steps to add support.

<!-- Source EN PDF p.15, block 111 -->

1\. Determine the version of the chip crypto IP V1 / V2 /V3. V3 version from RV1106, compatible has been determined as "rockchip,crypto-v3", algorithm tailoring and feature are adapted by the software..

<!-- Source EN PDF p.15, block 112 -->

2\. drivers/crypto/rockchip/rk_crypto_core.c add algs_name, soc_data, compatible info.

<!-- Source EN PDF p.15, block 113 -->

```text
/* Add the algorithm information supported by the chip. Px30 belongs to crypto V2. For
the supported algorithms, see crypto_V2_algs */
/* Attention: Crypto_v2_algs is full algorithms supported by crypto V2. */
/* Some chips are trimmed on Crypto V2. For example, RK1808 does not support SHA512
algorithm, so it is necessary to compare TRM to confirm the algorithm supported */
static char *px30_algs_name[] = {
    "ecb(aes)", "cbc(aes)", "xts(aes)",
    "ecb(des)", "cbc(des)",
    "ecb(des3_ede)", "cbc(des3_ede)",
    "sha1", "sha256", "sha512", "md5",
};
/* bind px30_algs_name to px30_soc_data */
static const struct rk_crypto_soc_data px30_soc_data =
    RK_CRYPTO_V2_SOC_DATA_INIT(px30_algs_name, false);
/* bind px30_soc_data to id_table */
static const struct of_device_id crypto_of_id_table[] = {
    /* crypto v2 in belows */
    {
        .compatible = "rockchip,px30-crypto",
        .data = (void *)&px30_soc_data,
    },
    {
        .compatible = "rockchip,rv1126-crypto",
        .data = (void *)&rv1126_soc_data,
    },
    /* crypto v1 in belows */
    {
        .compatible = "rockchip,rk3288-crypto",
        .data = (void *)&rk3288_soc_data,
    },
    { /* sentinel */ }
};
```

<!-- Source EN PDF p.16, block 115 -->

3\. Add crypto node for new chip

<!-- Source EN PDF p.16, block 116 -->

Attention:

<!-- Source EN PDF p.16, block 117 -->

1\. Determine the CRYPTO base address according to the chip TRM

<!-- Source EN PDF p.16, block 118 -->

2\. Clocks macros may differ from platform to platform. If there is an error on dts, you can go to include/dt-bindings/clock and grep -rn CRYPTO to find the corresponding clock macros name, as shown below:

<!-- Source EN PDF p.16, block 119 -->

```text
troy@inno:~/kernel/include/dt-bindings/clock$ grep -rn CRYPTO
rk3328-cru.h:57:#define SCLK_CRYPTO 59
rk3328-cru.h:206:#define HCLK_CRYPTO_MST 336
rk3328-cru.h:207:#define HCLK_CRYPTO_SLV 337
rk3328-cru.h:284:#define SRST_CRYPTO 68
```

<!-- Source EN PDF p.16, block 120 -->

crypto v1:

<!-- Source EN PDF p.17, block 121 -->

```text
crypto: cypto-controller@ff8a0000 { /* crypto base address */
    compatible = "rockchip,rk3288-crypto"; /* platform "rk3399-crypto" */
    reg = <0x0 0xff8a0000 0x0 0x4000>; /* crypto base address */
    interrupts = <GIC_SPI 48 IRQ_TYPE_LEVEL_HIGH>; /* crypto interrupts number */
    clocks = <&cru ACLK_CRYPTO>, <&cru HCLK_CRYPTO>,
             <&cru SCLK_CRYPTO>, <&cru ACLK_DMAC1>;
    clock-names = "aclk", "hclk", "sclk", "apb_pclk";
    resets = <&cru SRST_CRYPTO>;
    reset-names = "crypto-rst";
    status = "disabled";
};
```

<!-- Source EN PDF p.17, block 122 -->

crypto v2:

<!-- Source EN PDF p.17, block 123 -->

For most crypto V2 chips, the register address of HWRNG is in the middle of crypto. Therefore, you need to split the crypto address space into two parts when configuring reg address. The first part is the register used by the CIPHER and the second part is the register used by RSA.

<!-- Source EN PDF p.17, block 124 -->

```text
---------------------- reg map ----------------------
| cipher/hash | rng | pka |
-----------------------------------------------------
```

<!-- Source EN PDF p.17, block 125 -->

```text
crypto: crypto@ff500000 { /* crypto base address */
    compatible = "rockchip,rv1126-crypto"; /* modify platform */
    reg = <0xff500000 0x400>, <0xff500480 0x3B80>; /* crypto base address */
    interrupts = <GIC_SPI 3 IRQ_TYPE_LEVEL_HIGH>;
    clocks = <&cru CLK_CRYPTO_CORE>, <&cru CLK_CRYPTO_PKA>,
    <&cru ACLK_CRYPTO>, <&cru HCLK_CRYPTO>;
    clock-names = "aclk", "hclk", "sclk", "apb_pclk";
    power-domains = <&power RV1126_PD_CRYPTO>;
    resets = <&cru SRST_CRYPTO_CORE>;
    reset-names = "crypto-rst";
    status = "disabled";
};
```

<!-- Source EN PDF p.17, block 126 -->

4\. enable crypto node

<!-- Source EN PDF p.17, block 127 -->

```text
&crypto {
    status = "okay";
};
```

<!-- Source EN PDF p.17, block 128 -->

#### 2.3.4 Verify that hardware crypto is enabled

<!-- Source EN PDF p.17, block 130 -->

Run `cat /proc/crypto | grep rk` to see registered Rockchip hardware crypto algorithms. The following example uses RV1126.

<!-- Source EN PDF p.17, block 133 -->

```text
driver : pkcs1pad(rsa-rk,sha256)
driver : rsa-rk
driver : hmac-sm3-rk
driver : hmac-md5-rk
driver : hmac-sha512-rk
driver : hmac-sha256-rk
driver : hmac-sha1-rk
driver : sm3-rk
driver : md5-rk
driver : sha512-rk
driver : sha256-rk
driver : sha1-rk
driver : ofb-des3_ede-rk
driver : cfb-des3_ede-rk
driver : cbc-des3_ede-rk
driver : ecb-des3_ede-rk
driver : ofb-des-rk
driver : cfb-des-rk
driver : cbc-des-rk
driver : ecb-des-rk
driver : xts-aes-rk
driver : ctr-aes-rk
driver : cfb-aes-rk
driver : cbc-aes-rk
driver : ecb-aes-rk
driver : xts-sm4-rk
driver : ctr-sm4-rk
driver : ofb-sm4-rk
driver : cfb-sm4-rk
driver : cbc-sm4-rk
driver : ecb-sm4-rk
```

<!-- Source EN PDF p.18, block 135 -->

You can view the information about the Rockchip crypto driver by running the cat /proc/rkcrypto command. (Make sure to update the latest code. The old code does not support this function.) Including crypto version, clock frequency, currently available algorithms, and some statistics of current driver operation, will continue to improve and supplement in the future. ("CRYPTO V3.0.0.0 multi" indicates that the current platform supports CRYPTO support multithreading).

<!-- Source EN PDF p.18, block 136 -->

Note: RKCE's platform does not generate /proc/rkcrypto.

<!-- Source EN PDF p.18, block 137 -->

```text
Rockchip Crypto Version: CRYPTO V2.0.0.0
use_soft_aes192 : false
clock info:
        aclk 350000000
        hclk 150000000
        sclk 350000000
        pka 350000000
Valid algorithms:
        CIPHER:
                ecb(sm4)
                cbc(sm4)
                cfb(sm4)
                ofb(sm4)
                ctr(sm4)
                ecb(aes)
                cbc(aes)
                cfb(aes)
                ofb(aes)
                ctr(aes)
                ecb(des)
                cbc(des)
                cfb(des)
                ofb(des)
                ecb(des3_ede)
                cbc(des3_ede)
                cfb(des3_ede)
                ofb(des3_ede)
        AEAD:
                gcm(sm4)
                gcm(aes)
        HASH:
                sha1
                sha224
                sha256
                sha384
                sha512
                md5
                sm3
        HMAC:
                hmac(sha1)
                hmac(sha256)
                hmac(sha512)
                hmac(md5)
                hmac(sm3)
        ASYM:
                rsa
Statistic info:
        busy_cnt : 1
        equeue_cnt : 28764
        dequeue_cnt : 28765
        done_cnt : 310710
        complete_cnt : 28765
        fake_cnt : 0
        irq_cnt : 310710
        timeout_cnt : 0
        error_cnt : 0
        last_error : 0
Crypto queue usage [0/50], ever_max = 1, status: idle
```

<!-- Source EN PDF p.20, block 139 -->

## 3. User space development

<!-- Source EN PDF p.20, block 140 -->

### 3.1 user space invoke hwrng

<!-- Source EN PDF p.20, block 141 -->

There are two ways for user space to obtain random numbers output by hwrng:

<!-- Source EN PDF p.20, block 142 -->

read kernel driver node

<!-- Source EN PDF p.20, block 143 -->

invoke librkcrypto API

<!-- Source EN PDF p.20, block 144 -->

Attention:

<!-- Source EN PDF p.20, block 145 -->

1\. After the hwrng hardware driver is successfully registered, entropy can be added to the kernel random driver. The random numbers generated by hwrng are input to the entropy pool of the random driver. The random driver of kernel is CSPRNG (Cryptography Secure Pseudo Random Number Generator), which meets the security standards of cryptography. For high quality random numbers,, you can read /dev/random or /dev/urandom nodes for random numbers.

<!-- Source EN PDF p.20, block 146 -->

#### 3.1.1 read kernel driver node

<!-- Source EN PDF p.20, block 147 -->

If the kernel has enabled rng module, random numbers can be obtained by reading nodes in the user space. Linux reads the node /dev/hwrng, Android reads the node /dev/hw_random. Reference code is as follows:

<!-- Source EN PDF p.20, block 148 -->

```text
#ifdef ANDROID
#define HWRNG_NODE "/dev/hw_random"
#else
#define HWRNG_NODE "/dev/hwrng"
#endif
RK_RES rk_get_random(uint8_t *data, uint32_t len)
{
        RK_RES res = RK_CRYPTO_SUCCESS;
        int hwrng_fd = -1;
        int read_len = 0;
        hwrng_fd = open(HWRNG_NODE, O_RDONLY, 0);
        if (hwrng_fd < 0) {
                E_TRACE("open %s error!", HWRNG_NODE);
                return RK_CRYPTO_ERR_GENERIC;
        }
        read_len = read(hwrng_fd, data, len);
        if (read_len != len) {
                E_TRACE("read %s error!", HWRNG_NODE);
                res = RK_CRYPTO_ERR_GENERIC;
        }
        close(hwrng_fd);
        return res;
}
```

<!-- Source EN PDF p.21, block 150 -->

#### 3.1.2 invoke librkcrypto API

<!-- Source EN PDF p.21, block 151 -->

Refer to the API description: rk_get_random.

<!-- Source EN PDF p.21, block 152 -->

### 3.2 user space invoke hardware crypto

<!-- Source EN PDF p.21, block 153 -->

user space calls the librkcrypto interface to operate the hardware cipher module. This section provides instructions for librkcrypto.

<!-- Source EN PDF p.21, block 154 -->

Before use, verify that hardware Crypto is enabled in the kernel; see §2.3 and §2.3.4 for configuration and verification.

<!-- Source EN PDF p.21, block 155 -->

#### 3.2.1 Scope of application

<!-- Source EN PDF p.21, block 156 -->

| API | RK3588 | RK356x | RV1109/1126 | others |
|---|---|---|---|---|
| rk_crypto_mem_alloc/free | ✓ | ✓ | ✓ |  |
| rk_crypto_init/deinit | ✓ | ✓ | ✓ |  |
| rk_get_random | ✓ | ✓ | ✓ |  |
| rk_hash_init/update/update_virt/final/rk_hash_virt | ✓ | ✓ | ✓ |  |
| rk_cipher_init/crypt/crypt_virt/final | ✓ | ✓ | ✓ |  |
| rk_ae_init/set_aad/set_aad_virt/crypt/crypt_virt/final | ✓ | ✓ | ✓ |  |
| rk_rsa_pub_encrypt/priv_decrypt/priv_encrypt/pub_decrypt | ✓ | ✓ | ✓ |  |
| rk_rsa_sign/verify | ✓ | ✓ | ✓ |  |
| rk_ec_verify | × | × | × | RK3576 |
| rk_write_oem_otp_key | ✓ | ✓ | ✓ |  |
| rk_oem_otp_key_is_written | ✓ | ✓ | ✓ |  |
| rk_set_oem_hr_otp_read_lock | ✓ | × | × |  |
| rk_oem_otp_key_cipher | ✓ | ✓ | ✓ |  |
| rk_oem_otp_key_cipher_virt | ✓ | ✓ | ✓ |  |

<!-- Source EN PDF p.22, block 157 -->

#### 3.2.2 Version Dependencies

<!-- Source EN PDF p.22, block 158 -->

##### 3.2.2.1 V1.3.0

<!-- Source EN PDF p.22, block 159 -->

Librkcrypto V1.3.0 library functions depends on the following kernel commit points. Currently, only newer chips support ECC/SM2 functionality (such as RK3576), mainly on the kernel 6.1 core.

<!-- Source EN PDF p.22, block 160 -->

1\. kernel 6.1

<!-- Source EN PDF p.22, block 161 -->

```text
commit 3b667c194bcbb60c1087afc54094d585d965f493
Author: Lin Jinhan <troy.lin@rock-chips.com>
Date: Thu Oct 10 17:32:29 2024 +0800
    crypto: rockchip: cryptodev: add ec verify support
    Signed-off-by: Lin Jinhan <troy.lin@rock-chips.com>
    Change-Id: If5372d28643b16c16c86448292887a011c3d9900
```

<!-- Source EN PDF p.22, block 162 -->

##### 3.2.2.2 V1.2.0

<!-- Source EN PDF p.22, block 163 -->

Librkcrypto V1.2.0 library functions depend on the following kernel commit points. If the kernel crypto driver is not updated to the following commit points, some functions may be unavailable.

<!-- Source EN PDF p.22, block 164 -->

1\. kernel 4.19

<!-- Source EN PDF p.22, block 165 -->

```text
commit c255a0aa097afbf7f28e3c0770c5ab778e5616b2
Author: Lin Jinhan <troy.lin@rock-chips.com>
Date: Tue Sep 13 17:20:46 2022 +0800
    crypto: rockchip: rk3326/px30 add aes gcm support
    Signed-off-by: Lin Jinhan <troy.lin@rock-chips.com>
    Change-Id: I75949554d4f573c63092841eef76765a69cc6b24
```

<!-- Source EN PDF p.22, block 166 -->

2\. kernel 5.10

<!-- Source EN PDF p.22, block 167 -->

```text
commit 47e85085826daf6401265b803ac9ac7116ae6bb4
Author: Lin Jinhan <troy.lin@rock-chips.com>
Date: Tue Sep 13 17:20:46 2022 +0800
    crypto: rockchip: rk3326/px30 add aes gcm support
    Signed-off-by: Lin Jinhan <troy.lin@rock-chips.com>
    Change-Id: I75949554d4f573c63092841eef76765a69cc6b24
```

<!-- Source EN PDF p.23, block 168 -->

#### 3.2.3 Attention

<!-- Source EN PDF p.23, block 169 -->

The input data length of the symmetric algorithm is required to be consistent with the data length of the selected algorithm and mode. For example, ECB and CBC require block alignment, while CTS and CTR do not require data length alignment. There's no padding in the API.

<!-- Source EN PDF p.23, block 170 -->

If the amount of calculated data is pretty large, the algorithm interface that transmits data through dma_fd is recommended to improve the efficiency. Since crypto only supports contiguous physical addresses up to 4G, the buffer allocated by dma fd must be physically contiguous addresses up to 4G (CMA). It can be allocated using the rk_crypto_mem interface provided by librkcrypto, or allocated by yourself using a memory allocation interface such as DRM to get dma fd.

<!-- Source EN PDF p.23, block 171 -->

CMA config: Crypto only supports access to CMA addresses up to 4G. If the device uses more than 4G memory, you need to modify the CMA configuration in dts. Otherwise, rk_crypto_mem can be allocated successfully, but the allocated memory cannot be used.The following takes rk3588-android.dtsi platform as an example. In the preceding command, 0x10000000 indicates the start address of the CMA (256MB, do not change the value), and 0x00800000 indicates the size of the CMA. You can change the value as required. For details about the CMA, see the documentation `Rockchip_Developer_Guide_Linux_CMA_CN`.

<!-- Source EN PDF p.23, block 172 -->

```text
--- a/arch/arm64/boot/dts/rockchip/rk3588-android.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588-android.dtsi
@@ -70,7 +70,8 @@
                cma {
                          compatible = "shared-dma-pool";
                          reusable;
  - size = <0x0 (8 * 0x100000)>;
  + //size = <0x0 (8 * 0x100000)>;
  + reg = <0x0 0x10000000 0x0 0x00800000>;
                          linux,cma-default;
                  };
```

<!-- Source EN PDF p.23, block 173 -->

Before using the following interface, ensure that the TEE function is available. See `Rockchip_Developer_Guide_TEE_SDK_CN` for details.

<!-- Source EN PDF p.23, block 174 -->

rk_write_oem_otp_key

<!-- Source EN PDF p.23, block 175 -->

rk_oem_otp_key_is_written

<!-- Source EN PDF p.23, block 176 -->

rk_set_oem_hr_otp_read_lock

<!-- Source EN PDF p.23, block 177 -->

rk_oem_otp_key_cipher

<!-- Source EN PDF p.23, block 178 -->

rk_oem_otp_key_cipher_virt

<!-- Source EN PDF p.23, block 179 -->

rk_set_oem_hr_otp_read_lock: If key_id is set to RK_OEM_OTP_KEY0/1/2, the attributes of other OTP areas will be affected after the setting is successful. For example, some OTP regions become unwritable, see the `Rockchip_Developer_Guide_OTP_CN` document. Therefore, RK_OEM_OTP_KEY3 is recommended.

<!-- Source EN PDF p.23, block 180 -->

rk_oem_otp_key_cipher_virt: The maximum len value supported is affected by the shared memory of the TEE, which may be smaller than expected if the TEE shared memory is occupied before this interface is used.

<!-- Source EN PDF p.24, block 181 -->

#### 3.2.4 Data Structure

<!-- Source EN PDF p.24, block 182 -->

##### 3.2.4.1 rk_crypto_mem

<!-- Source EN PDF p.24, block 183 -->

```text
typedef struct {
    void *vaddr;
    int dma_fd;
    size_t size;
} rk_crypto_mem;
```

<!-- Source EN PDF p.24, block 184 -->

- vaddr - virtual address of memory

<!-- Source EN PDF p.24, block 185 -->

- dma_fd - dma_fd of memory

<!-- Source EN PDF p.24, block 186 -->

- size - size of memory

<!-- Source EN PDF p.24, block 187 -->

##### 3.2.4.2 rk_cipher_config

<!-- Source EN PDF p.24, block 188 -->

```text
typedef struct {
        uint32_t algo;
        uint32_t mode;
        uint32_t operation;
        uint8_t key[64];
        uint32_t key_len;
        uint8_t iv[16];
        void *reserved;
} rk_cipher_config;
```

<!-- Source EN PDF p.24, block 189 -->

- algo - algorithms type, See RK_CRYPTO_ALGO. The actual value range is subject to the API description. The same below.

<!-- Source EN PDF p.24, block 190 -->

- mode - algorithms mode, See RK_CIPIHER_MODE. Support ECB/CBC/CTR/CFB/OFB/ mode.

<!-- Source EN PDF p.24, block 191 -->

- operation - encrypt or decrypt, See RK_CRYPTO_OPERATION.

<!-- Source EN PDF p.24, block 192 -->

- key - plaintext key. Invalid when otp key is used.

<!-- Source EN PDF p.24, block 193 -->

- key_len - key length (Unit: byte)

<!-- Source EN PDF p.24, block 194 -->

- iv - the initial vector is not valid in ECB mode. In other modes, executing rk_cipher_crypt/crypt_virt will automatically update iv for multiple segmentation calculations

<!-- Source EN PDF p.24, block 195 -->

- reserved - for future use

<!-- Source EN PDF p.25, block 196 -->

##### 3.2.4.3 rk_ae_config

<!-- Source EN PDF p.25, block 197 -->

```text
typedef struct {
        uint32_t algo;
        uint32_t mode;
        uint32_t operation;
        uint8_t key[32];
        uint32_t key_len;
        uint8_t iv[16];
        uint32_t iv_len;
        uint32_t tag_len;
        uint32_t aad_len;
        uint32_t payload_len;
        void *reserved;
} rk_ae_config;
```

<!-- Source EN PDF p.25, block 198 -->

- algo - algorithms type, See RK_CRYPTO_ALGO. Support AES/SM4.

<!-- Source EN PDF p.25, block 199 -->

- mode - algorithms mode, See RK_CIPIHER_MODE. Support GCM/CCM.

<!-- Source EN PDF p.25, block 200 -->

- operation - encrypt or decrypt, See RK_CRYPTO_OPERATION.

<!-- Source EN PDF p.25, block 201 -->

- key - plaintext key. Invalid when otp key is used.

<!-- Source EN PDF p.25, block 202 -->

- key_len - key length (Unit: byte)

<!-- Source EN PDF p.25, block 203 -->

- iv - initial vector

<!-- Source EN PDF p.25, block 204 -->

- iv_len - initial vector length (Unit: byte)

<!-- Source EN PDF p.25, block 205 -->

- tag_len - tag length (Unit: byte)

<!-- Source EN PDF p.25, block 206 -->

- aad_len - aad length (Unit: byte)

<!-- Source EN PDF p.25, block 207 -->

- payload_len - payload length (Unit: byte)

<!-- Source EN PDF p.25, block 208 -->

- reserved - for future use

<!-- Source EN PDF p.25, block 209 -->

##### 3.2.4.4 rk_hash_config

<!-- Source EN PDF p.25, block 210 -->

```text
typedef struct {
        uint32_t algo;
        uint8_t *key;
        uint32_t key_len;
} rk_hash_config;
```

<!-- Source EN PDF p.25, block 211 -->

- algo - algorithms type, See RK_CRYPTO_ALGO. Support HASH/HMAC.

<!-- Source EN PDF p.25, block 212 -->

- key - key for hash-mac, only valid when algo is HMAC

<!-- Source EN PDF p.25, block 213 -->

- key_len - key length (Unit: byte)

<!-- Source EN PDF p.26, block 214 -->

##### 3.2.4.5 rk_rsa_pub_key

<!-- Source EN PDF p.26, block 215 -->

```text
typedef struct {
    const uint8_t *n;
    const uint8_t *e;
    uint16_t n_len;
    uint16_t e_len;
} rk_rsa_pub_key;
```

<!-- Source EN PDF p.26, block 216 -->

- n - module, same as OpenSSL, big-endian mode

<!-- Source EN PDF p.26, block 217 -->

- e - exponent, same as OpenSSL, big-endian mode

<!-- Source EN PDF p.26, block 218 -->

- n_len - module length

<!-- Source EN PDF p.26, block 219 -->

- e_len - exponent length

<!-- Source EN PDF p.26, block 220 -->

##### 3.2.4.6 rk_rsa_pub_key_pack

<!-- Source EN PDF p.26, block 221 -->

```text
typedef struct {
    enum RK_RSA_KEY_TYPE key_type;
    rk_rsa_pub_key key;
} rk_rsa_pub_key_pack;
```

<!-- Source EN PDF p.26, block 222 -->

- key_type - key type, See RK_RSA_KEY_TYPE . Support plaintext key and OTP_KEY encrypted ciphertext key, librkcrypto will pass the key to crypto driver and decrypt it with the corresponding otp key before use.

<!-- Source EN PDF p.26, block 223 -->

- key - public key, See rk_rsa_pub_key .

<!-- Source EN PDF p.26, block 224 -->

##### 3.2.4.7 rk_rsa_priv_key

<!-- Source EN PDF p.26, block 225 -->

```text
typedef struct {
    const uint8_t *n;
    const uint8_t *e;
    const uint8_t *d;
    const uint8_t *p;
    const uint8_t *q;
    const uint8_t *dp;
    const uint8_t *dq;
    const uint8_t *qp;
    uint16_t n_len;
    uint16_t e_len;
    uint16_t d_len;
    uint16_t p_len;
    uint16_t q_len;
    uint16_t dp_len;
    uint16_t dq_len;
    uint16_t qp_len;
} rk_rsa_priv_key;
```

<!-- Source EN PDF p.27, block 227 -->

- n - module, same as OpenSSL, big-endian mode

<!-- Source EN PDF p.27, block 228 -->

- e - exponent, same as OpenSSL, big-endian mode

<!-- Source EN PDF p.27, block 229 -->

- d - private key, same as OpenSSL, big-endian mode

<!-- Source EN PDF p.27, block 230 -->

- p - optional

<!-- Source EN PDF p.27, block 231 -->

- q - optional

<!-- Source EN PDF p.27, block 232 -->

- dp - optional

<!-- Source EN PDF p.27, block 233 -->

- dq - optional

<!-- Source EN PDF p.27, block 234 -->

- qp - optional

<!-- Source EN PDF p.27, block 235 -->

- len - the length information of each element will not be described here

<!-- Source EN PDF p.27, block 236 -->

##### 3.2.4.8 rk_rsa_priv_key_pack

<!-- Source EN PDF p.27, block 237 -->

```text
typedef struct {
    enum RK_RSA_KEY_TYPE key_type;
    rk_rsa_priv_key key;
} rk_rsa_priv_key_pack;
```

<!-- Source EN PDF p.27, block 238 -->

- key_type - key type, See RK_RSA_KEY_TYPE . Support plaintext key and OTP_KEY encrypted ciphertext key, librkcrypto will pass the key, with the corresponding otp key decrypted before use.

<!-- Source EN PDF p.27, block 239 -->

- key - private key, See rk_rsa_priv_key .

<!-- Source EN PDF p.27, block 240 -->

##### 3.2.4.9 rk_ec_pub_key

<!-- Source EN PDF p.27, block 241 -->

```text
typedef struct {
    uint32_t curve;
    const uint8_t *x;
    const uint8_t *y;
    uint16_t x_len;
    uint16_t y_len;
} rk_ec_pub_key;
```

<!-- Source EN PDF p.27, block 242 -->

- curve -curve select, See RK_EC_CURVE,.Such as RK_EC_CURVE_SM2/P192/P224/P256...

<!-- Source EN PDF p.27, block 243 -->

- x - The x-coordinate of the public key, same as OpenSSL, big-endian mode

<!-- Source EN PDF p.27, block 244 -->

- y - The y-coordinate of the public key, same as OpenSSL, big-endian mode

<!-- Source EN PDF p.27, block 245 -->

- x_len - The length of x data

<!-- Source EN PDF p.27, block 246 -->

- y_len - The length of y data

<!-- Source EN PDF p.28, block 247 -->

##### 3.2.4.10 rk_ec_pub_key_pack

<!-- Source EN PDF p.28, block 248 -->

```text
typedef struct {
    enum RK_EC_KEY_TYPE key_type;
    rk_ec_pub_key key;
} rk_ec_pub_key_pack;
```

<!-- Source EN PDF p.28, block 249 -->

- key_type - key type, See RK_EC_KEY_TYPE . Support plaintext key and OTP_KEY encrypted ciphertext key, librkcrypto will pass the key, with the corresponding otp key decrypted before use.

<!-- Source EN PDF p.28, block 250 -->

- key - public key, See rk_ec_pub_key .

<!-- Source EN PDF p.28, block 251 -->

##### 3.2.4.11 rk_ec_priv_key

<!-- Source EN PDF p.28, block 252 -->

```text
typedef struct {
    uint32_t curve;
    const uint8_t *x;
    const uint8_t *y;
    const uint8_t *d;
    uint16_t x_len;
    uint16_t y_len;
    uint16_t d_len;
} rk_ec_priv_key;
```

<!-- Source EN PDF p.28, block 253 -->

- curve -curve select, See RK_EC_CURVE,.Such as RK_EC_CURVE_SM2/P192/P224/P256...

<!-- Source EN PDF p.28, block 254 -->

- x - The x-coordinate of the public key, same as OpenSSL, big-endian mode

<!-- Source EN PDF p.28, block 255 -->

- y - The y-coordinate of the public key, same as OpenSSL, big-endian mode

<!-- Source EN PDF p.28, block 256 -->

- d - The d value of the private key, same as OpenSSL, big-endian mode

<!-- Source EN PDF p.28, block 257 -->

- x_len - The length of x data

<!-- Source EN PDF p.28, block 258 -->

- y_len - The length of y data

<!-- Source EN PDF p.28, block 259 -->

- d_len - The length of d data

<!-- Source EN PDF p.28, block 260 -->

##### 3.2.4.12 rk_ec_priv_key_pack

<!-- Source EN PDF p.28, block 261 -->

```text
typedef struct {
    enum RK_EC_KEY_TYPE key_type;
    rk_ec_priv_key key;
} rk_ec_priv_key_pack;
```

<!-- Source EN PDF p.28, block 262 -->

- key_type - key type, See RK_EC_KEY_TYPE . Support plaintext key and OTP_KEY encrypted ciphertext key, librkcrypto will pass the key, with the corresponding otp key decrypted before use.

<!-- Source EN PDF p.28, block 263 -->

- key - private key, See rk_ec_priv_key .

<!-- Source EN PDF p.29, block 264 -->

#### 3.2.5 Constant

<!-- Source EN PDF p.29, block 265 -->

##### 3.2.5.1 RK_CRYPTO_ALGO

<!-- Source EN PDF p.29, block 266 -->

```text
/* crypto algorithm */
enum RK_CRYPTO_ALGO {
        RK_ALGO_CIPHER_TOP = 0x00,
        RK_ALGO_AES,
        RK_ALGO_DES,
        RK_ALGO_TDES,
        RK_ALGO_SM4,
        RK_ALGO_CIPHER_BUTT,
        RK_ALGO_HASH_TOP = 0x10,
        RK_ALGO_MD5,
        RK_ALGO_SHA1,
        RK_ALGO_SHA256,
        RK_ALGO_SHA224,
        RK_ALGO_SHA512,
        RK_ALGO_SHA384,
        RK_ALGO_SHA512_224,
        RK_ALGO_SHA512_256,
        RK_ALGO_SM3,
        RK_ALGO_HASH_BUTT,
        RK_ALGO_HMAC_TOP = 0x20,
        RK_ALGO_HMAC_MD5,
        RK_ALGO_HMAC_SHA1,
        RK_ALGO_HMAC_SHA256,
        RK_ALGO_HMAC_SHA512,
        RK_ALGO_HMAC_SM3,
        RK_ALGO_CMAC_AES,
        RK_ALGO_CBCMAC_AES,
        RK_ALGO_CMAC_SM4,
        RK_ALGO_CBCMAC_SM4,
        RK_ALGO_HMAC_BUTT,
};
```

<!-- Source EN PDF p.30, block 267 -->

##### 3.2.5.2 RK_CIPIHER_MODE

<!-- Source EN PDF p.30, block 268 -->

```text
/* crypto mode */
enum RK_CIPIHER_MODE {
        RK_CIPHER_MODE_ECB = 0x00,
        RK_CIPHER_MODE_CBC,
        RK_CIPHER_MODE_CTS,
        RK_CIPHER_MODE_CTR,
        RK_CIPHER_MODE_CFB,
        RK_CIPHER_MODE_OFB,
        RK_CIPHER_MODE_XTS,
        RK_CIPHER_MODE_CCM,
        RK_CIPHER_MODE_GCM,
        RK_CIPHER_MODE_BUTT
};
```

<!-- Source EN PDF p.30, block 269 -->

##### 3.2.5.3 RK_OEM_HR_OTP_KEYID

<!-- Source EN PDF p.30, block 270 -->

```text
enum RK_OEM_OTP_KEYID {
        RK_OEM_OTP_KEY0 = 0,
        RK_OEM_OTP_KEY1,
        RK_OEM_OTP_KEY2,
        RK_OEM_OTP_KEY3,
        RK_OEM_OTP_KEY_FW = 10, //key id of fw_encryption_key
        RK_OEM_OTP_KEYMAX
};
```

<!-- Source EN PDF p.30, block 271 -->

##### 3.2.5.4 RK_CRYPTO_OPERATION

<!-- Source EN PDF p.30, block 272 -->

```text
/* Algorithm operation */
#define RK_OP_CIPHER_ENC 1
#define RK_OP_CIPHER_DEC 0
```

<!-- Source EN PDF p.30, block 273 -->

##### 3.2.5.5 RK_RSA_KEY_TYPE

<!-- Source EN PDF p.30, block 274 -->

```text
enum RK_RSA_KEY_TYPE {
    RK_RSA_KEY_TYPE_PLAIN = 0,
    RK_RSA_KEY_TYPE_KEY0_ENC = RK_OEM_OTP_KEY0 +1,
    RK_RSA_KEY_TYPE_KEY1_ENC,
    RK_RSA_KEY_TYPE_KEY2_ENC,
    RK_RSA_KEY_TYPE_KEY3_ENC,
    RK_RSA_KEY_TYPE_MAX,
};
```

<!-- Source EN PDF p.31, block 275 -->

##### 3.2.5.6 RK_RSA_CRYPT_PADDING

<!-- Source EN PDF p.31, block 276 -->

```text
enum RK_RSA_CRYPT_PADDING {
    RK_RSA_CRYPT_PADDING_NONE = 0x00, /* without padding */
    RK_RSA_CRYPT_PADDING_BLOCK_TYPE_0, /* PKCS#1 block type 0 padding*/
    RK_RSA_CRYPT_PADDING_BLOCK_TYPE_1, /* PKCS#1 block type 1padding*/
    RK_RSA_CRYPT_PADDING_BLOCK_TYPE_2, /* PKCS#1 block type 2 padding*/
    RK_RSA_CRYPT_PADDING_OAEP_SHA1, /* PKCS#1 RSAES-OAEP-SHA1 padding*/
    RK_RSA_CRYPT_PADDING_OAEP_SHA224, /* PKCS#1 RSAES-OAEP-SHA224 padding*/
    RK_RSA_CRYPT_PADDING_OAEP_SHA256, /* PKCS#1 RSAES-OAEP-SHA256 padding*/
    RK_RSA_CRYPT_PADDING_OAEP_SHA384, /* PKCS#1 RSAES-OAEP-SHA384 padding*/
    RK_RSA_CRYPT_PADDING_OAEP_SHA512, /* PKCS#1 RSAES-OAEP-SHA512 padding*/
    RK_RSA_CRYPT_PADDING_PKCS1_V1_5, /* PKCS#1 RSAES-PKCS1_V1_5 padding*/
};
```

<!-- Source EN PDF p.31, block 277 -->

##### 3.2.5.7 RK_RSA_SIGN_PADDING

<!-- Source EN PDF p.31, block 278 -->

```text
enum RK_RSA_SIGN_PADDING {
    RK_RSA_SIGN_PADDING_PKCS1_V15_SHA1 = 0x100,/* PKCS#1 RSASSA_PKCS1_V15_SHA1 signature*/
    RK_RSA_SIGN_PADDING_PKCS1_V15_SHA224, /* PKCS#1 RSASSA_PKCS1_V15_SHA224 signature*/
    RK_RSA_SIGN_PADDING_PKCS1_V15_SHA256, /* PKCS#1 RSASSA_PKCS1_V15_SHA256 signature*/
    RK_RSA_SIGN_PADDING_PKCS1_V15_SHA384, /* PKCS#1 RSASSA_PKCS1_V15_SHA384 signature*/
    RK_RSA_SIGN_PADDING_PKCS1_V15_SHA512, /* PKCS#1 RSASSA_PKCS1_V15_SHA512 signature*/
    RK_RSA_SIGN_PADDING_PKCS1_PSS_SHA1, /* PKCS#1 RSASSA_PKCS1_PSS_SHA1 signature*/
    RK_RSA_SIGN_PADDING_PKCS1_PSS_SHA224, /* PKCS#1 RSASSA_PKCS1_PSS_SHA224 signature*/
    RK_RSA_SIGN_PADDING_PKCS1_PSS_SHA256, /* PKCS#1 RSASSA_PKCS1_PSS_SHA256 signature*/
    RK_RSA_SIGN_PADDING_PKCS1_PSS_SHA384, /* PKCS#1 RSASSA_PKCS1_PSS_SHA1 signature*/
    RK_RSA_SIGN_PADDING_PKCS1_PSS_SHA512, /* PKCS#1 RSASSA_PKCS1_PSS_SHA256 signature*/
};
```

<!-- Source EN PDF p.31, block 279 -->

##### 3.2.5.8 RK_EC_KEY_TYPE

<!-- Source EN PDF p.31, block 280 -->

```text
enum RK_EC_KEY_TYPE {
    RK_EC_KEY_TYPE_PLAIN = 0,
    RK_EC_KEY_TYPE_KEY0_ENC = RK_OEM_OTP_KEY0 +1,
    RK_EC_KEY_TYPE_KEY1_ENC,
    RK_EC_KEY_TYPE_KEY2_ENC,
    RK_EC_KEY_TYPE_KEY3_ENC,
    RK_EC_KEY_TYPE_MAX,
};
```

<!-- Source EN PDF p.32, block 281 -->

##### 3.2.5.9 RK_EC_CURVE

<!-- Source EN PDF p.32, block 282 -->

```text
enum RK_EC_CURVE {
    RK_EC_CURVE_SM2 = 0,
    RK_EC_CURVE_P192,
    RK_EC_CURVE_P224,
    RK_EC_CURVE_P256,
    RK_EC_CURVE_P384,
    RK_EC_CURVE_P521,
};
```

<!-- Source EN PDF p.32, block 283 -->

##### 3.2.5.10 Other Constants

<!-- Source EN PDF p.32, block 284 -->

```text
/* Algorithm block length */
#define DES_BLOCK_SIZE 8
#define AES_BLOCK_SIZE 16
#define SM4_BLOCK_SIZE 16
#define SHA1_HASH_SIZE 20
#define SHA224_HASH_SIZE 28
#define SHA256_HASH_SIZE 32
#define SHA384_HASH_SIZE 48
#define SHA512_HASH_SIZE 64
#define MD5_HASH_SIZE 16
#define SM3_HASH_SIZE 32
#define AES_AE_DATA_BLOCK 128
#define MAX_HASH_BLOCK_SIZE 128
#define MAX_TDES_KEY_SIZE 24
#define MAX_AES_KEY_SIZE 32
#define MAX_AE_TAG_SIZE 16
#define RSA_BITS_1024 1024
#define RSA_BITS_2048 2048
#define RSA_BITS_3072 3072
#define RSA_BITS_4096 4096
#define MAX_RSA_KEY_BITS RSA_BITS_4096
#define RK_CRYPTO_MAX_DATA_LEN (1 * 1024 * 1024)
```

<!-- Source EN PDF p.32, block 285 -->

#### 3.2.6 API

<!-- Source EN PDF p.32, block 286 -->

##### 3.2.6.1 Data Type

<!-- Source EN PDF p.32, block 287 -->

```text
typedef uint32_t RK_RES;
typedef uint32_t rk_handle;
```

<!-- Source EN PDF p.33, block 288 -->

##### 3.2.6.2 Return Codes

<!-- Source EN PDF p.33, block 289 -->

```text
/* API return codes */
#define RK_CRYPTO_SUCCESS 0x00000000
#define RK_CRYPTO_ERR_GENERIC 0xF0000000
#define RK_CRYPTO_ERR_PARAMETER 0xF0000001
#define RK_CRYPTO_ERR_STATE 0xF0000002
#define RK_CRYPTO_ERR_NOT_SUPPORTED 0xF0000003
#define RK_CRYPTO_ERR_OUT_OF_MEMORY 0xF0000004
#define RK_CRYPTO_ERR_ACCESS_DENIED 0xF0000005
#define RK_CRYPTO_ERR_BUSY 0xF0000006
#define RK_CRYPTO_ERR_TIMEOUT 0xF0000007
#define RK_CRYPTO_ERR_UNINITED 0xF0000008
#define RK_CRYPTO_ERR_KEY 0xF0000009
#define RK_CRYPTO_ERR_VERIFY 0xF000000A
#define RK_CRYPTO_ERR_PADDING 0xF000000B
#define RK_CRYPTO_ERR_PADDING_OVERFLOW 0xF000000C
#define RK_CRYPTO_ERR_MAC_INVALID 0xF000000D
```

<!-- Source EN PDF p.33, block 290 -->

##### 3.2.6.3 rk_crypto_mem_alloc

<!-- Source EN PDF p.33, block 291 -->

```text
rk_crypto_mem *rk_crypto_mem_alloc(size_t size);
```

<!-- Source EN PDF p.33, block 292 -->

function

<!-- Source EN PDF p.33, block 293 -->

To request a block of memory, rk_crypto_mem is returned, which contains the virtual address of the memory and dma_fd.

<!-- Source EN PDF p.33, block 294 -->

parameters

<!-- Source EN PDF p.33, block 295 -->

- [in] size - size of the memory to be alloced

<!-- Source EN PDF p.33, block 296 -->

- [out] memory - memory address info, See rk_crypto_mem .

<!-- Source EN PDF p.33, block 297 -->

Attention

<!-- Source EN PDF p.33, block 298 -->

1\. The maximum memory size depends on the kernel CMA buffer size and usage.

<!-- Source EN PDF p.33, block 299 -->

##### 3.2.6.4 rk_crypto_mem_free

<!-- Source EN PDF p.33, block 300 -->

```text
void rk_crypto_mem_free(rk_crypto_mem *memory);
```

<!-- Source EN PDF p.33, block 301 -->

function

<!-- Source EN PDF p.33, block 302 -->

Free the memory allocated by rk_crypto_mem_alloc.

<!-- Source EN PDF p.33, block 303 -->

parameters

<!-- Source EN PDF p.33, block 304 -->

- [in] memory - memory address info, See rk_crypto_mem .

<!-- Source EN PDF p.34, block 305 -->

##### 3.2.6.5 rk_crypto_init

<!-- Source EN PDF p.34, block 306 -->

```text
RK_RES rk_crypto_init(void);
```

<!-- Source EN PDF p.34, block 307 -->

function

<!-- Source EN PDF p.34, block 308 -->

crypto initialization, such as open device nodes, etc.

<!-- Source EN PDF p.34, block 309 -->

parameters

<!-- Source EN PDF p.34, block 310 -->

None

<!-- Source EN PDF p.34, block 311 -->

##### 3.2.6.6 rk_crypto_deinit

<!-- Source EN PDF p.34, block 312 -->

```text
void rk_crypto_deinit(void);
```

<!-- Source EN PDF p.34, block 313 -->

function

<!-- Source EN PDF p.34, block 314 -->

Release crypto resources, such as close device nodes.

<!-- Source EN PDF p.34, block 315 -->

parameters

<!-- Source EN PDF p.34, block 316 -->

None

<!-- Source EN PDF p.34, block 317 -->

##### 3.2.6.7 rk_hash_init

<!-- Source EN PDF p.34, block 318 -->

```text
RK_RES rk_hash_init(rk_hash_config *config, rk_handle *handle);
```

<!-- Source EN PDF p.34, block 319 -->

function

<!-- Source EN PDF p.34, block 320 -->

Initializes the hash algorithm, support MD5/SHA1/SHA224/SHA256/SHA384/SHA512/SM3.

<!-- Source EN PDF p.34, block 321 -->

parameters

<!-- Source EN PDF p.34, block 322 -->

- [in] config - hash/hmac configure

<!-- Source EN PDF p.34, block 323 -->

- [out] handle - hash/hmac handle

<!-- Source EN PDF p.34, block 324 -->

Attention

<!-- Source EN PDF p.34, block 325 -->

1\. After rk_hash_init succeeds, rk_hash_final must be called to destroy resources regardless of whether rk_hash_update() or rk_hash_update_virt was executed successfully or not.

<!-- Source EN PDF p.34, block 326 -->

2\. If rk_hash_init returns RK_CRYPTO_ERR_BUSY, the platform does not support multithreading and only one handle can work at a time. You need to wait for the previous handle to be released before applying for a new handle.

<!-- Source EN PDF p.35, block 327 -->

##### 3.2.6.8 rk_hash_update

<!-- Source EN PDF p.35, block 328 -->

```text
RK_RES rk_hash_update(rk_handle handle, int data_fd, uint32_t data_len);
```

<!-- Source EN PDF p.35, block 329 -->

function

<!-- Source EN PDF p.35, block 330 -->

Receive dma_fd of data as input, calculates the hash/hmac value, and supports multiple packet calculations.

<!-- Source EN PDF p.35, block 331 -->

parameters

<!-- Source EN PDF p.35, block 332 -->

- [in] handle - hash/hmac handle

<!-- Source EN PDF p.35, block 333 -->

- [in] data_fd - handle of data to be calculated

<!-- Source EN PDF p.35, block 334 -->

- [in] data_len - data length (Unit: byte)

<!-- Source EN PDF p.35, block 335 -->

Attention

<!-- Source EN PDF p.35, block 336 -->

1\. handle must be initialized with rk_hash_init().

<!-- Source EN PDF p.35, block 337 -->

2\. It can be called multiple times to feed the data that needs to be computed.

<!-- Source EN PDF p.35, block 338 -->

3\. The data length data_len must be 64 bytes aligned if data is not the last group of data.

<!-- Source EN PDF p.35, block 339 -->

##### 3.2.6.9 rk_hash_update_virt

<!-- Source EN PDF p.35, block 340 -->

```text
RK_RES rk_hash_update_virt(rk_handle handle, uint8_t *data, uint32_t data_len);
```

<!-- Source EN PDF p.35, block 341 -->

function

<!-- Source EN PDF p.35, block 342 -->

Receive virtual address data as input and computes the hash value. Supports multiple packet computations.

<!-- Source EN PDF p.35, block 343 -->

parameters

<!-- Source EN PDF p.35, block 344 -->

- [in] handle - hash/hmac handle

<!-- Source EN PDF p.35, block 345 -->

- [in] data - data to be calculated

<!-- Source EN PDF p.35, block 346 -->

- [in] data_len - data length (Unit: byte)

<!-- Source EN PDF p.35, block 347 -->

Attention

<!-- Source EN PDF p.35, block 348 -->

1\. handle must be initialized with rk_hash_init().

<!-- Source EN PDF p.35, block 349 -->

2\. It can be called multiple times to feed the data that needs to be computed.

<!-- Source EN PDF p.35, block 350 -->

3\. The data length data_len must be 64 bytes aligned if data is not the last group of data.

<!-- Source EN PDF p.35, block 351 -->

##### 3.2.6.10 rk_hash_final

<!-- Source EN PDF p.35, block 352 -->

```text
RK_RES rk_hash_final(rk_handle handle, uint8_t *hash);
```

<!-- Source EN PDF p.35, block 353 -->

function

<!-- Source EN PDF p.35, block 354 -->

After all the data is computed, the interface is called to get the final hash/hmac value and release the handle. If you need to interrupt the computation, you must also call this interface to end the hash computation.

<!-- Source EN PDF p.36, block 355 -->

parameters

<!-- Source EN PDF p.36, block 356 -->

- [in] handle- hash/hmac handle

<!-- Source EN PDF p.36, block 357 -->

- [out] hash - output of hash/hmac

<!-- Source EN PDF p.36, block 358 -->

Attention

<!-- Source EN PDF p.36, block 359 -->

1\. handle must be initialized with rk_hash_init().

<!-- Source EN PDF p.36, block 360 -->

2\. The hash/hmac output buffer size must be greater than or equal to the hash length.

<!-- Source EN PDF p.36, block 361 -->

##### 3.2.6.11 rk_hash_virt

<!-- Source EN PDF p.36, block 362 -->

```text
RK_RES rk_hash_virt(uint32_t algo, const uint8_t *input, uint32_t in_len,
             uint8_t *hash, uint32_t *hash_len);
```

<!-- Source EN PDF p.36, block 363 -->

function

<!-- Source EN PDF p.36, block 364 -->

Receives virtual address data as input and calculates the hash value at a single time

<!-- Source EN PDF p.36, block 365 -->

parameters

<!-- Source EN PDF p.36, block 366 -->

- [in] algo- hash algo, Such as RK_ALGO_MD5/SHA1/SHA256...

<!-- Source EN PDF p.36, block 367 -->

- [in] input- virtual address of the hash to be computed

<!-- Source EN PDF p.36, block 368 -->

- [in] in_len- the length of input (Unit: byte)

<!-- Source EN PDF p.36, block 369 -->

- [out] hash - output of hash

<!-- Source EN PDF p.36, block 370 -->

- [in/out] hash_len - the input indicates the hash buffer size, and the output indicates the actual hash length

<!-- Source EN PDF p.36, block 371 -->

##### 3.2.6.12 rk_cipher_init

<!-- Source EN PDF p.36, block 372 -->

```text
RK_RES rk_cipher_init(rk_cipher_config *config, rk_handle *handle);
```

<!-- Source EN PDF p.36, block 373 -->

function

<!-- Source EN PDF p.36, block 374 -->

Initialize symmetric cipher algorithms. Support TDES/AES/SM4 algorithms type. Support ECB/CBC/CTR/CFB/OFB mode.

<!-- Source EN PDF p.36, block 375 -->

parameters

<!-- Source EN PDF p.36, block 376 -->

- [in] config - algorithm, pattern, key, iv, etc. See rk_cipher_config

<!-- Source EN PDF p.36, block 377 -->

- [out] handle - handle of cipher

<!-- Source EN PDF p.36, block 378 -->

Attention

<!-- Source EN PDF p.36, block 379 -->

1\. After init succeeds, rk_cipher_final() must be called to destroy the related resources, regardless of whether rk_cipher_crypt/crypt_virt() was successfully executed.

<!-- Source EN PDF p.37, block 380 -->

##### 3.2.6.13 rk_cipher_crypt

<!-- Source EN PDF p.37, block 381 -->

```text
RK_RES rk_cipher_crypt(rk_handle handle, int in_fd, int out_fd, uint32_t len);
```

<!-- Source EN PDF p.37, block 382 -->

function

<!-- Source EN PDF p.37, block 383 -->

Receive dma_fd of data to perform encryption and decryption by using symmetric cipher algorithm.

<!-- Source EN PDF p.37, block 384 -->

parameters

<!-- Source EN PDF p.37, block 385 -->

- [in] handle - handle of cipher

<!-- Source EN PDF p.37, block 386 -->

- [in] in_fd - dma_fd of input data

<!-- Source EN PDF p.37, block 387 -->

- [out] out_fd - dma_fd of output data

<!-- Source EN PDF p.37, block 388 -->

- [in] len - input data length(Unit: byte)

<!-- Source EN PDF p.37, block 389 -->

Attention

<!-- Source EN PDF p.37, block 390 -->

1\. handle must be initialized with rk_cipher_init().

<!-- Source EN PDF p.37, block 391 -->

2\. in_fd and out_fd can be the same dma_fd.

<!-- Source EN PDF p.37, block 392 -->

3\. After the calculation, iv in rk_cipher_config will be updated. Repeat many times, can realize the segmented call.

<!-- Source EN PDF p.37, block 393 -->

##### 3.2.6.14 rk_cipher_crypt_virt

<!-- Source EN PDF p.37, block 394 -->

```text
RK_RES rk_cipher_crypt_virt(rk_handle handle, const uint8_t *in, uint8_t *out, uint32_t
len);
```

<!-- Source EN PDF p.37, block 395 -->

function

<!-- Source EN PDF p.37, block 396 -->

Receive virtual address of data to perform encryption and decryption by using symmetric cipher algorithm.

<!-- Source EN PDF p.37, block 397 -->

parameters

<!-- Source EN PDF p.37, block 398 -->

- [in] handle - handle of cipher

<!-- Source EN PDF p.37, block 399 -->

- [in] in - input data buffer

<!-- Source EN PDF p.37, block 400 -->

- [out] out - output data buffer

<!-- Source EN PDF p.37, block 401 -->

- [in] len - input data length (Unit: byte)

<!-- Source EN PDF p.37, block 402 -->

Attention

<!-- Source EN PDF p.37, block 403 -->

1\. handle must be initialized with rk_cipher_init().

<!-- Source EN PDF p.37, block 404 -->

2\. input and output can be the same buffer.

<!-- Source EN PDF p.37, block 405 -->

3\. After the calculation, iv in rk_cipher_config will be updated. Repeat many times, can realize the segmented call.

<!-- Source EN PDF p.38, block 406 -->

##### 3.2.6.15 rk_cipher_final

<!-- Source EN PDF p.38, block 407 -->

```text
RK_RES rk_cipher_final(rk_handle handle);
```

<!-- Source EN PDF p.38, block 408 -->

function

<!-- Source EN PDF p.38, block 409 -->

End the calculation process and release the handle.

<!-- Source EN PDF p.38, block 410 -->

parameters

<!-- Source EN PDF p.38, block 411 -->

- [in] handle - handle of cipher that must be initialized with rk_cipher_init().

<!-- Source EN PDF p.38, block 412 -->

##### 3.2.6.16 rk_get_random

<!-- Source EN PDF p.38, block 413 -->

```text
RK_RES rk_get_random(uint8_t *data, uint32_t len)
```

<!-- Source EN PDF p.38, block 414 -->

function

<!-- Source EN PDF p.38, block 415 -->

Gets a random number of the specified length from HWRNG.

<!-- Source EN PDF p.38, block 416 -->

parameters

<!-- Source EN PDF p.38, block 417 -->

- [out] data - random data

<!-- Source EN PDF p.38, block 418 -->

- [in] len - the length of the random number to get (Unit: byte)

<!-- Source EN PDF p.38, block 419 -->

##### 3.2.6.17 rk_write_oem_otp_key

<!-- Source EN PDF p.38, block 420 -->

```text
RK_RES rk_write_oem_otp_key(enum RK_OEM_OTP_KEYID key_id, uint8_t *key,
                            uint32_t key_len);
```

<!-- Source EN PDF p.38, block 421 -->

function

<!-- Source EN PDF p.38, block 422 -->

Writes the key in plaintext to the specified OEM OTP region.

<!-- Source EN PDF p.38, block 423 -->

For details of OEM OTP features, see `Rockchip_Developer_Guide_OTP_CN`.

<!-- Source EN PDF p.38, block 424 -->

parameters

<!-- Source EN PDF p.38, block 425 -->

- [in] key_id - the key region index to be written

<!-- Source EN PDF p.38, block 426 -->

- [in] key - plaintext of key

<!-- Source EN PDF p.38, block 427 -->

- [in] key_len - plaintext key length (Unit: byte)

<!-- Source EN PDF p.38, block 428 -->

Attention

<!-- Source EN PDF p.38, block 429 -->

1\. Key_id supports four keys RK_OEM_OTP_KEY0 - 3 by default. For RV1126 / RV1109, key_id RK_OEM_OTP_KEY_FW is supported. RK_OEM_OTP_KEY_FW is the key used by BootROM to decrypt loader.rk_oem_otp_key_cipher_virt supports the encryption and decryption of service data using this key.

<!-- Source EN PDF p.38, block 430 -->

2\. For RK_OEM_OTP_KEY_FW, key_len supports 16 byte. For other keys, key_len supports 16, 24, and 32 byte.

<!-- Source EN PDF p.39, block 431 -->

##### 3.2.6.18 rk_oem_otp_key_is_written

<!-- Source EN PDF p.39, block 432 -->

```text
RK_RES rk_oem_otp_key_is_written(enum RK_OEM_OTP_KEYID key_id, uint8_t *is_written);
```

<!-- Source EN PDF p.39, block 433 -->

function

<!-- Source EN PDF p.39, block 434 -->

Check whether the key has been written to the specified OEM OTP area. For details of OEM OTP features, see `Rockchip_Developer_Guide_OTP_CN`.

<!-- Source EN PDF p.39, block 435 -->

parameters

<!-- Source EN PDF p.39, block 436 -->

- [in] key_id - the key region index to be written

<!-- Source EN PDF p.39, block 437 -->

- [out] is_written - check whether the secret key has been written. 1 indicates that the secret key has been written. 0 indicates that the secret key has not been written.

<!-- Source EN PDF p.39, block 438 -->

return value

<!-- Source EN PDF p.39, block 439 -->

is_written values are meaningful only when the return value is #define RK_CRYPTO_SUCCESS 0x00000000.

<!-- Source EN PDF p.39, block 441 -->

On RK3588, the driver also checks whether key_id is locked. A locked key_id returns `#define RK_CRYPTO_ERR_ACCESS_DENIED 0xF0000005`.

<!-- Source EN PDF p.39, block 444 -->

Attention

<!-- Source EN PDF p.39, block 445 -->

1\. key_id supports four keys RK_OEM_OTP_KEY0 - 3 by default. For RV1126/RV1109, the key whose key_id is RK_OEM_OTP_KEY_FW is supported.

<!-- Source EN PDF p.39, block 446 -->

##### 3.2.6.19 rk_set_oem_hr_otp_read_lock

<!-- Source EN PDF p.39, block 447 -->

```text
RK_RES rk_set_oem_hr_otp_read_lock(enum RK_OEM_OTP_KEYID key_id);
```

<!-- Source EN PDF p.39, block 448 -->

function

<!-- Source EN PDF p.39, block 449 -->

Set the read lock flag for the specified OEM OTP area. After the read lock flag is set successfully, the OTP area is forbidden to write data, and the existing data in the OTP area is unreadable by CPU software. You can use the key through the rk_oem_otp_key_cipher_virt interface. For details of OEM OTP features, see `Rockchip_Developer_Guide_OTP_CN`.

<!-- Source EN PDF p.39, block 450 -->

parameters

<!-- Source EN PDF p.39, block 451 -->

- [in] key_id - The key_id to be set supports RK_OEM_OTP_KEY0 - 3

<!-- Source EN PDF p.39, block 452 -->

##### 3.2.6.20 rk_oem_otp_key_cipher

<!-- Source EN PDF p.39, block 453 -->

```text
RK_RES rk_oem_otp_key_cipher(enum RK_OEM_OTP_KEYID key_id, rk_cipher_config *config,
                             int32_t in_fd, int32_t out_fd, uint32_t len);
```

<!-- Source EN PDF p.39, block 454 -->

function

<!-- Source EN PDF p.39, block 455 -->

Select the key in the OEM OTP area and perform single cipher calculation in dma_fd mode.

<!-- Source EN PDF p.40, block 456 -->

parameters

<!-- Source EN PDF p.40, block 457 -->

- [in] key_id - the otp key index to use

<!-- Source EN PDF p.40, block 458 -->

- [in] config - algorithm, pattern, key, iv, etc

<!-- Source EN PDF p.40, block 459 -->

- [in] in_fd - dma_fd of input which can be the same as output

<!-- Source EN PDF p.40, block 460 -->

- [out] out_fd - dma_fd of output

<!-- Source EN PDF p.40, block 461 -->

- [in] len - input data length (Unit: byte)

<!-- Source EN PDF p.40, block 462 -->

Attention

<!-- Source EN PDF p.40, block 463 -->

1\. Key_id supports RK_OEM_OTP_KEY0 - 3 by default. For RV1126 / RV1109, RK_OEM_OTP_KEY_FW is supported.

<!-- Source EN PDF p.40, block 464 -->

2\. Support AES/SM4 algorithms type and ECB/CBC/CTS/CTR/CFB/OFB mode.

<!-- Source EN PDF p.40, block 465 -->

3\. The key length can be 16, 24, or 32 bytes. On the RV1109/RV1126 platform, the key length can be 16 or 32 bytes. When the key_id is RK_OEM_OTP_KEY_FW , the key length can be 16 bytes.

<!-- Source EN PDF p.40, block 466 -->

4\. in_fd and out_fd can be the same.

<!-- Source EN PDF p.40, block 467 -->

##### 3.2.6.21 rk_oem_otp_key_cipher_virt

<!-- Source EN PDF p.40, block 468 -->

```text
RK_RES rk_oem_otp_key_cipher_virt(enum RK_OEM_OTP_KEYID key_id, rk_cipher_config *config,
                                  uint8_t *src, uint8_t *dst, uint32_t len);
```

<!-- Source EN PDF p.40, block 469 -->

function

<!-- Source EN PDF p.40, block 470 -->

Select the key in the OEM OTP area, and perform single cipher calculation in virtual addr mode.

<!-- Source EN PDF p.40, block 471 -->

parameters

<!-- Source EN PDF p.40, block 472 -->

- [in] key_id -the otp key index to use

<!-- Source EN PDF p.40, block 473 -->

- [in] config - algorithm, pattern, key, iv, etc

<!-- Source EN PDF p.40, block 474 -->

- [in] src - input data buffer

<!-- Source EN PDF p.40, block 475 -->

- [out] dst - output data buffer

<!-- Source EN PDF p.40, block 476 -->

- [in] len - input data length (Unit: byte)

<!-- Source EN PDF p.40, block 477 -->

Attention

<!-- Source EN PDF p.40, block 478 -->

1\. Key_id supports RK_OEM_OTP_KEY0 - 3 by default. For RV1126 / RV1109, RK_OEM_OTP_KEY_FW is supported.

<!-- Source EN PDF p.40, block 479 -->

2\. Support AES/SM4 algorithms type and ECB/CBC/CTS/CTR/CFB/OFB mode.

<!-- Source EN PDF p.40, block 480 -->

3\. The key length can be 16, 24, or 32 bytes. On the RV1109/RV1126 platform, the key length can be 16 or 32 bytes. When the key_id is RK_OEM_OTP_KEY_FW , the key length can be 16 bytes.

<!-- Source EN PDF p.40, block 481 -->

4\. in_fd and out_fd can be the same.

<!-- Source EN PDF p.40, block 482 -->

5\. The default maximum length of the input and output buffers len is 1MB. For RV1126/RV1109, len is 500KB.

<!-- Source EN PDF p.41, block 483 -->

##### 3.2.6.22 rk_ae_init

<!-- Source EN PDF p.41, block 484 -->

function


> The source does not provide an rk_ae_init prototype here; no declaration has been invented.



<!-- Source EN PDF p.41, block 485 -->

AEAD algorithms initialization. AES/SM4 is supported. Currently, only GCM is supported.

<!-- Source EN PDF p.41, block 486 -->

parameters

<!-- Source EN PDF p.41, block 487 -->

- [in] config - algorithm, mode, key, iv, aad length, tag length, etc. See rk_ae_config .

<!-- Source EN PDF p.41, block 488 -->

- [out] handle - handle of AEAD

<!-- Source EN PDF p.41, block 489 -->

Attention

<!-- Source EN PDF p.41, block 490 -->

After init succeeds, you must call rk_ae_final() to destroy resources regardless of whether subsequent execution succeeds.

<!-- Source EN PDF p.41, block 491 -->

##### 3.2.6.23 rk_ae_set_aad

<!-- Source EN PDF p.41, block 492 -->

```text
RK_RES rk_ae_set_aad(rk_handle handle, int aad_fd);
```

<!-- Source EN PDF p.41, block 493 -->

function

<!-- Source EN PDF p.41, block 494 -->

Receiving dma_fd of data and sets aad parameters.

<!-- Source EN PDF p.41, block 495 -->

parameters

<!-- Source EN PDF p.41, block 496 -->

- [in] handle - handle of cipher

<!-- Source EN PDF p.41, block 497 -->

- [in] aad_fd - dma_fd of aad data

<!-- Source EN PDF p.41, block 498 -->

Attention

<!-- Source EN PDF p.41, block 499 -->

1\. handle must be initialized with rk_ae_init().

<!-- Source EN PDF p.41, block 500 -->

2\. Currently, rk_ae_set_aad can only be called once after rk_ae_init. Multiple AAD data updates are not supported. Multiple updates cause the contents of AAD to be overwritten.

<!-- Source EN PDF p.41, block 501 -->

##### 3.2.6.24 rk_ae_set_aad_virt

<!-- Source EN PDF p.41, block 502 -->

```text
RK_RES rk_ae_set_aad_virt(rk_handle handle, uint8_t *aad_virt);
```

<!-- Source EN PDF p.41, block 503 -->

function

<!-- Source EN PDF p.41, block 504 -->

Receiving virtual address to sets AAD data.

<!-- Source EN PDF p.41, block 505 -->

parameters

<!-- Source EN PDF p.41, block 506 -->

- [in] handle - handle of cipher

<!-- Source EN PDF p.41, block 507 -->

- [in] in - buffer of aad data

<!-- Source EN PDF p.41, block 508 -->

Attention

<!-- Source EN PDF p.41, block 509 -->

1\. handle must be initialized with rk_ae_init().

<!-- Source EN PDF p.42, block 510 -->

2\. Currently, rk_ae_set_aad_virt can only be called once after rk_ae_init. Multiple AAD data updates are not supported. Multiple updates cause the contents of AAD to be overwritten.

<!-- Source EN PDF p.42, block 511 -->

##### 3.2.6.25 rk_ae_crypt

<!-- Source EN PDF p.42, block 512 -->

```text
RK_RES rk_ae_crypt(rk_handle handle, int in_fd, int out_fd, uint32_t len, uint8_t *tag);
```

<!-- Source EN PDF p.42, block 513 -->

function

<!-- Source EN PDF p.42, block 514 -->

AEAD algorithm is used to perform encryption and decryption and tag calculation/verification for receiving dma_fd of data.

<!-- Source EN PDF p.42, block 515 -->

parameters

<!-- Source EN PDF p.42, block 516 -->

- [in] handle - handle of ae

<!-- Source EN PDF p.42, block 517 -->

- [in] in_fd - dma_fd of input data

<!-- Source EN PDF p.42, block 518 -->

- [out] out_fd - dma_fd of output data

<!-- Source EN PDF p.42, block 519 -->

- [in] len - input data length(Unit: byte)

<!-- Source EN PDF p.42, block 520 -->

- [in/out] tag - input for encryption, output for decryption


> Source conflict: the Chinese source specifies tag output for encryption and input for decryption; the English source says the reverse above. The conflict is preserved explicitly, not silently corrected. Verify the matching SDK implementation.



<!-- Source EN PDF p.42, block 521 -->

Attention

<!-- Source EN PDF p.42, block 522 -->

1\. handle must be initialized with rk_ae_init().

<!-- Source EN PDF p.42, block 523 -->

2\. in_fd and out_fd can be the same dma_fd.

<!-- Source EN PDF p.42, block 524 -->

3\. Multiple call segments are not supported.

<!-- Source EN PDF p.42, block 525 -->

##### 3.2.6.26 rk_ae_crypt_virt

<!-- Source EN PDF p.42, block 526 -->

```text
RK_RES rk_ae_crypt_virt(rk_handle handle, const uint8_t *in, uint8_t *out, uint32_t len,
uint8_t *tag);
```

<!-- Source EN PDF p.42, block 527 -->

function

<!-- Source EN PDF p.42, block 528 -->

AEAD algorithm is used to encrypt and decrypt virtual address data.

<!-- Source EN PDF p.42, block 529 -->

parameters

<!-- Source EN PDF p.42, block 530 -->

- [in] handle - handle of ae

<!-- Source EN PDF p.42, block 531 -->

- [in] in - input buffer

<!-- Source EN PDF p.42, block 532 -->

- [out] out - output buffer

<!-- Source EN PDF p.42, block 533 -->

- [in] len - input data length(Unit: byte)

<!-- Source EN PDF p.42, block 534 -->

- [in/out] tag - input for encryption, output for decryption


> Source conflict: the Chinese source specifies tag output for encryption and input for decryption; the English source says the reverse above. The conflict is preserved explicitly, not silently corrected. Verify the matching SDK implementation.



<!-- Source EN PDF p.42, block 535 -->

Attention

<!-- Source EN PDF p.42, block 536 -->

1\. handle must be initialized with rk_ae_init().

<!-- Source EN PDF p.42, block 537 -->

2\. input and output can be the same buffer..

<!-- Source EN PDF p.43, block 538 -->

3\. Multiple call segments are not supported.

<!-- Source EN PDF p.43, block 539 -->

##### 3.2.6.27 rk_ae_final

<!-- Source EN PDF p.43, block 540 -->

```text
RK_RES rk_ae_final(rk_handle handle);
```

<!-- Source EN PDF p.43, block 541 -->

function

<!-- Source EN PDF p.43, block 542 -->

End the calculation process and release the handle.

<!-- Source EN PDF p.43, block 543 -->

parameters

<!-- Source EN PDF p.43, block 544 -->

- [in] handle - handle of AE that must be initialized with rk_ae_init().

<!-- Source EN PDF p.43, block 545 -->

##### 3.2.6.28 rk_rsa_pub_encrypt

<!-- Source EN PDF p.43, block 546 -->

```text
RK_RES rk_rsa_pub_encrypt(const rk_rsa_pub_key_pack *pub, enum RK_RSA_CRYPT_PADDING padding,
const uint8_t *in, uint32_t in_len, uint8_t *out, uint32_t *out_len);
```

<!-- Source EN PDF p.43, block 547 -->

function

<!-- Source EN PDF p.43, block 548 -->

The public key is used to encrypt data, and encryption padding is supported.

<!-- Source EN PDF p.43, block 549 -->

parameters

<!-- Source EN PDF p.43, block 550 -->

- [in] pub - rsa public key information. See rk_rsa_pub_key_pack .

<!-- Source EN PDF p.43, block 551 -->

- [in] padding - encrypt padding type. See RK_RSA_CRYPT_PADDING .

<!-- Source EN PDF p.43, block 552 -->

- [in] in - input data

<!-- Source EN PDF p.43, block 553 -->

- [in] in_len - input data length(Unit: byte). If the input data is too long, the error code RK_CRYPTO_ERR_PADDING_OVERFLOW is returned.

<!-- Source EN PDF p.43, block 554 -->

- [out] out - ciphertext encrypted by the public key

<!-- Source EN PDF p.43, block 555 -->

- [out] out_len - ciphertext length

<!-- Source EN PDF p.43, block 556 -->

Attention

<!-- Source EN PDF p.43, block 557 -->

1\. The public key must be set correctly to specify whether the key is in plaintext or the ciphertext encrypted by OTP KEY. This step will affect key parsing.

<!-- Source EN PDF p.43, block 558 -->

2\. In-situ encryption and decryption are not recommended.

<!-- Source EN PDF p.43, block 559 -->

##### 3.2.6.29 rk_rsa_priv_decrypt

<!-- Source EN PDF p.43, block 560 -->

```text
RK_RES rk_rsa_priv_decrypt(const rk_rsa_priv_key_pack *priv, enum RK_RSA_CRYPT_PADDING
padding, const uint8_t *in, uint32_t in_len, uint8_t *out, uint32_t *out_len);
```

<!-- Source EN PDF p.43, block 561 -->

function

<!-- Source EN PDF p.43, block 562 -->

The private key is used to decrypt the data, and padding parsing is supported.

<!-- Source EN PDF p.44, block 563 -->

parameters

<!-- Source EN PDF p.44, block 564 -->

- [in] priv - rsa private key information. See rk_rsa_priv_key_pack

<!-- Source EN PDF p.44, block 565 -->

- [in] padding - the padding type must be the same as the encryption padding. See RK_RSA_CRYPT_PADDING

<!-- Source EN PDF p.44, block 566 -->

- [in] in - input data

<!-- Source EN PDF p.44, block 567 -->

- [in] in_len - input data length(Unit: byte)

<!-- Source EN PDF p.44, block 568 -->

- [out] out - plaintext decrypted by private key

<!-- Source EN PDF p.44, block 569 -->

- [out] out_len - plaintext length

<!-- Source EN PDF p.44, block 570 -->

Attention

<!-- Source EN PDF p.44, block 571 -->

1\. The private key must be set correctly to specify whether the key is in plain text or the ciphertext encrypted by OTP KEY. This step will affect key parsing.

<!-- Source EN PDF p.44, block 572 -->

2\. In-situ encryption and decryption are not recommended.

<!-- Source EN PDF p.44, block 573 -->

##### 3.2.6.30 rk_rsa_priv_encrypt

<!-- Source EN PDF p.44, block 574 -->

```text
RK_RES rk_rsa_priv_encrypt(const rk_rsa_priv_key_pack *priv, enum RK_RSA_CRYPT_PADDING
padding, const uint8_t *in, uint32_t in_len, uint8_t *out, uint32_t *out_len);
```

<!-- Source EN PDF p.44, block 575 -->

function

<!-- Source EN PDF p.44, block 576 -->

The private key is used to encrypt data, and encryption padding is supported.

<!-- Source EN PDF p.44, block 577 -->

parameters

<!-- Source EN PDF p.44, block 578 -->

- [in] priv - rsa private key information. See rk_rsa_priv_key_pack

<!-- Source EN PDF p.44, block 579 -->

- [in] padding - encrypt padding type. See RK_RSA_CRYPT_PADDING

<!-- Source EN PDF p.44, block 580 -->

- [in] in - input data

<!-- Source EN PDF p.44, block 581 -->

- [in] in_len - input data length(Unit: byte). If the input data is too long, the error code RK_CRYPTO_ERR_PADDING_OVERFLOW is returned.

<!-- Source EN PDF p.44, block 582 -->

- [out] out - ciphertext encrypted by the private key

<!-- Source EN PDF p.44, block 583 -->

- [out] out_len - ciphertext length

<!-- Source EN PDF p.44, block 584 -->

Attention

<!-- Source EN PDF p.44, block 585 -->

1\. The private key must be set correctly to specify whether the key is in plain text or the ciphertext encrypted by OTP KEY. This step will affect key parsing.

<!-- Source EN PDF p.44, block 586 -->

2\. In-situ encryption and decryption are not recommended.

<!-- Source EN PDF p.44, block 587 -->

##### 3.2.6.31 rk_rsa_pub_decrypt

<!-- Source EN PDF p.44, block 588 -->

```text
RK_RES rk_rsa_pub_decrypt(const rk_rsa_pub_key_pack *pub, enum RK_RSA_CRYPT_PADDING padding,
const uint8_t *in, uint32_t in_len, uint8_t *out, uint32_t *out_len);
```

<!-- Source EN PDF p.45, block 589 -->

function

<!-- Source EN PDF p.45, block 590 -->

The public key is used to decrypt the data, and padding parsing is supported.

<!-- Source EN PDF p.45, block 591 -->

parameters

<!-- Source EN PDF p.45, block 592 -->

- [in] pub - rsa public key information. See rk_rsa_pub_key_pack .

<!-- Source EN PDF p.45, block 593 -->

- [in] padding - the padding type must be the same as the encryption padding. see RK_RSA_CRYPT_PADDING

<!-- Source EN PDF p.45, block 594 -->

- [in] in - input data

<!-- Source EN PDF p.45, block 595 -->

- [in] in_len - input data length(Unit: byte)

<!-- Source EN PDF p.45, block 596 -->

- [out] out - plaintext decrypted by public key

<!-- Source EN PDF p.45, block 597 -->

- [out] out_len - plaintext length

<!-- Source EN PDF p.45, block 598 -->

Attention

<!-- Source EN PDF p.45, block 599 -->

1\. The public key must be set correctly to specify whether the key is in plain text or the ciphertext encrypted by OTP KEY. This step will affect key parsing.

<!-- Source EN PDF p.45, block 600 -->

2\. In-situ encryption and decryption are not recommended.

<!-- Source EN PDF p.45, block 601 -->

##### 3.2.6.32 rk_rsa_sign

<!-- Source EN PDF p.45, block 602 -->

```text
RK_RES rk_rsa_sign(const rk_rsa_priv_key_pack *priv, enum RK_RSA_SIGN_PADDING padding, const
uint8_t *in, uint32_t in_len, const uint8_t *hash, uint8_t *out, uint32_t *out_len);
```

<!-- Source EN PDF p.45, block 603 -->

function

<!-- Source EN PDF p.45, block 604 -->

Use the private key pair to calculate the hash of input data or use the external hash value for signature.

<!-- Source EN PDF p.45, block 605 -->

parameters

<!-- Source EN PDF p.45, block 606 -->

- [in] priv - rsa private key information. See rk_rsa_priv_key_pack

<!-- Source EN PDF p.45, block 607 -->

- [in] padding - signature padding type. See RK_RSA_SIGN_PADDING

<!-- Source EN PDF p.45, block 608 -->

- [in] in - input data will calculating hash first and signed by private key (optional)

<!-- Source EN PDF p.45, block 609 -->

- [in] in_len - input data length (Unit: byte)

<!-- Source EN PDF p.45, block 610 -->

- [in] hash - hash value(optional), the hash length is determined according to the padding algorithm, and the hash value can be signed directly by using the private key

<!-- Source EN PDF p.45, block 611 -->

- [out] out - signature data signed using the private key

<!-- Source EN PDF p.45, block 612 -->

- [out] out_len - signature data length

<!-- Source EN PDF p.45, block 613 -->

Attention

<!-- Source EN PDF p.45, block 614 -->

1\. The private key must be set correctly to specify whether the key is in plain text or the ciphertext encrypted by OTP KEY. This step will affect key parsing.

<!-- Source EN PDF p.45, block 615 -->

2\. When in != NULL && hash == NULL, the interface calculates the hash value of input data (the hash algorithm is determined by the padding format) and then executes the padding signature on the hash value.

<!-- Source EN PDF p.46, block 616 -->

3\. The interface padding the incoming hash value directly if hash != NULL.

<!-- Source EN PDF p.46, block 617 -->

##### 3.2.6.33 rk_rsa_verify

<!-- Source EN PDF p.46, block 618 -->

```text
RK_RES rk_rsa_verify(const rk_rsa_pub_key_pack *pub, enum RK_RSA_SIGN_PADDING padding, const
uint8_t *in, uint32_t in_len, const uint8_t *hash, uint8_t *sign, uint32_t sign_len);
```

<!-- Source EN PDF p.46, block 619 -->

function

<!-- Source EN PDF p.46, block 620 -->

Verify the signature using the public key.

<!-- Source EN PDF p.46, block 621 -->

parameters

<!-- Source EN PDF p.46, block 622 -->

- [in] pub - rsa public key information. See rk_rsa_pub_key_pack .

<!-- Source EN PDF p.46, block 623 -->

- [in] padding - the padding type must be the same as the signing padding. See RK_RSA_SIGN_PADDING

<!-- Source EN PDF p.46, block 624 -->

- [in] in - input data will calculating hash first and signed by private key (optional)

<!-- Source EN PDF p.46, block 625 -->

- [in] in_len - input data length (Unit: byte)

<!-- Source EN PDF p.46, block 626 -->

- [in] hash - hash value(optional)

<!-- Source EN PDF p.46, block 627 -->

- [in] sign - signature data

<!-- Source EN PDF p.46, block 628 -->

- [in] sign_len - signature data length (Unit: byte)

<!-- Source EN PDF p.46, block 629 -->

Attention

<!-- Source EN PDF p.46, block 630 -->

1\. The public key must be set correctly to specify whether the key is in plain text or the ciphertext encrypted by OTP KEY. This step will affect key parsing.

<!-- Source EN PDF p.46, block 631 -->

2\. When in != NULL && hash == NULL, the interface calculates the hash value of in (the hash algorithm is determined by the padding format) and then executes the padding verify the hash value.

<!-- Source EN PDF p.46, block 632 -->

3\. The interface padding the incoming hash value directly if hash != NULL.

<!-- Source EN PDF p.46, block 633 -->

##### 3.2.6.34 rk_ec_verify

<!-- Source EN PDF p.46, block 634 -->

```text
RK_RES rk_ec_verify(const rk_ec_pub_key_pack *pub, int hash_algo,
            const uint8_t *in, uint32_t in_len, const uint8_t *hash,
            uint8_t *sign, uint32_t sign_len);
```

<!-- Source EN PDF p.46, block 635 -->

function

<!-- Source EN PDF p.46, block 636 -->

Verify the ecc/sm2 signature using the public key.

<!-- Source EN PDF p.46, block 637 -->

parameters

<!-- Source EN PDF p.46, block 638 -->

- [in] pub - the public key of ecc/sm2. See rk_ec_pub_key_pack

<!-- Source EN PDF p.46, block 639 -->

- [in] hash_algo - The hash algorithm format of the signature must be consistent with the signature format

<!-- Source EN PDF p.46, block 640 -->

- [in] in - input data will calculating hash first and signed by private key (optional)

<!-- Source EN PDF p.46, block 641 -->

- [in] in_len - input data length (Unit: byte)

<!-- Source EN PDF p.46, block 642 -->

- [in] hash - hash value(optional)

<!-- Source EN PDF p.47, block 643 -->

- [in] sign - signature data

<!-- Source EN PDF p.47, block 644 -->

- [in] sign_len - signature data length (Unit: byte)

<!-- Source EN PDF p.47, block 645 -->

Attention

<!-- Source EN PDF p.47, block 646 -->

1\. The public key must be set correctly to specify whether the key is in plain text or the ciphertext encrypted by OTP KEY. This step will affect key parsing.

<!-- Source EN PDF p.47, block 647 -->

2\. When in != NULL && hash == NULL, the interface calculates the hash value of in (the hash algorithm is determined by the hash_algo) and then executes the padding verify the hash value.

<!-- Source EN PDF p.47, block 648 -->

3\. The interface padding the incoming hash value directly if hash != NULL.

<!-- Source EN PDF p.47, block 649 -->

#### 3.2.7 debug log

<!-- Source EN PDF p.47, block 650 -->

librkcrypto logs are currently divided into the following levels.

<!-- Source EN PDF p.47, block 651 -->

```text
enum RKCRYPTO_TRACE_LEVEL {
    TRACE_TOP = 0,
    TRACE_ERROR = 1,
    TRACE_INFO = 2,
    TRACE_DEBUG = 3,
    TRACE_VERBOSE = 4,
    TRACE_BUTT,
};
```

<!-- Source EN PDF p.47, block 652 -->

The default log level is TRACE_INFO. You can change the log level by setting the environment variable (which must be set before the librkcrypto library is loaded). It can also be set through the rkcrypto_set_trace_level interface before rk_crypto_init.

<!-- Source EN PDF p.47, block 653 -->

Android:

<!-- Source EN PDF p.47, block 654 -->

```text
setprop vendor.rkcrypto.trace.level 1/2/3/4
```

<!-- Source EN PDF p.47, block 655 -->

Linux:

<!-- Source EN PDF p.47, block 656 -->

```text
export rkcrypto_trace_level=1/2/3/4
```

<!-- Source EN PDF p.47, block 657 -->

## 4. Hardware Crypto Performance

<!-- Source EN PDF p.47, block 658 -->

The following is a list of typical chip performance under uboot as a reference, the specific performance of the librkcrypto source code in the "perf_reports" directory. The performance of the "perf_reports" directory is measured by the application layer calling the kernel crypto driver at the highest CPU/DDR fixed frequency. Due to the system call, the performance is slightly lower than that of the uboot test.

<!-- Source EN PDF p.48, block 659 -->

### 4.1 Factors that affect performance

<!-- Source EN PDF p.48, block 660 -->

1\. Whether the physical address corresponding to the user data is consecutive and whether the start address is 64-byte alignment affects the calculation efficiency.. Because CRYPTO IP has no integrated MMU, it can only process data in continuous memory, and the starting address has the requirement of alignment. In the case of using virtual address virt, if the data does not meet the address alignment and continuity, an application computation request may be split into multiple hardware calculations in the driver, and the user data will be copied to the 32KByte physical continuous memory inside the driver for calculation, and the performance will be affected.

<!-- Source EN PDF p.48, block 661 -->

2\. Block size of a single calculation. The larger the block size, the closer the actual performance is to the theoretical performance. In addition to the time consumed by the actual hardware computation, the CRYPTO driver also has additional overhead such as kernel calls, task queues, cache flushes, etc., and the extra overhead time is relatively constant. In the case of small partitions, the time proportion of the extra overhead increases, resulting in a sharp decline in actual performance.

<!-- Source EN PDF p.48, block 662 -->

In view of the impact of block size on computing performance, the librkcrypto test of RK3588 is taken as an example. The test performance results are as follows:

<!-- Source EN PDF p.48, block 663 -->

![Source technical figure — PDF 48](/docs/rockchip-crypto-hwrng/assets/en-p48-figure1.png)

| Block (Byte) | virt (kB/s) | dma_fd (kB/s) |
|---|---|---|
| 16 | 444 | 654 |
| 64 | 1627 | 2563 |
| 256 | 6606 | 6553 |
| 512 | 14747 | 11737 |
| 1024 | 33792 | 26624 |
| 8192 | 134144 | 181248 |
| 16384 | 204800 | 235520 |
| 65536 | 329728 | 439296 |
| 262144 | 390144 | 536576 |
| 524288 | 399360 | 580608 |
| 1048576 | 384000 | 607232 |

<!-- Source EN PDF p.48, block 664 -->

As can be seen from the figure above, the 1MByte block size is preferred and the continuous memory of dma fd is used for calculation, which can play a better performance. For small amounts of data such as 64KByte or less, hardware CRYPTO is not recommended, and soft algorithms are preferred (some chips support NEON/CE instruction sets, which accelerate encryption and decryption).

<!-- Source EN PDF p.49, block 665 -->

### 4.2 hardware crypto performance under uboot

<!-- Source EN PDF p.49, block 666 -->

#### 4.2.1 crypto v1 performance

<!-- Source EN PDF p.49, block 667 -->

Test environment (uboot RK3399):

<!-- Source EN PDF p.49, block 668 -->

clock Rate: CRYPTO_CORE = 200M, The highest frequency varies slightly from chip to chip.

<!-- Source EN PDF p.49, block 669 -->

CIPHER/HASH Performance:

<!-- Source EN PDF p.49, block 670 -->

| ALGO | Actual (MBps) | Theoretical (MBps) |
|---|---|---|
| DES | - | <=94 |
| TDES | - | <=31 |
| AES-128 | - | <=290 |
| AES-192 | - | <=246 |
| AES-256 | - | <213 |
| MD5 | 125 | <196 |
| SHA1 | 125 | <158 |
| SHA256 | 125 | - |

<!-- Source EN PDF p.49, block 671 -->

RSA Performance:

<!-- Source EN PDF p.49, block 672 -->

| RSA key length (nbits) | pub enc/priv dec (ms) |
|---|---|
| 2048 | 8 / 632 |

<!-- Source EN PDF p.49, block 673 -->

#### 4.2.2 crypto v2 / v3 /v4 performance

<!-- Source EN PDF p.49, block 674 -->

The computing core of these versions of CRYPTO IP has not changed greatly, and the performance difference is only reflected in the working frequency of CRYPTO IP, the frequency of CRYPTO V3/V4 can be up to 350M, and its theoretical performance can be simply converted on the basis of V2.

<!-- Source EN PDF p.49, block 675 -->

Test environment (uboot RV1126 V2) :

<!-- Source EN PDF p.49, block 676 -->

Clock Rate: CRYPTO_CORE = 200M, CRYPTO_PKA=300M, DDR=786M

<!-- Source EN PDF p.49, block 677 -->

Hash/HMAC: A total of 128M data is tested, and 4M data is calculated each time.

<!-- Source EN PDF p.49, block 678 -->

DES/3DES/AES/SM4: A total of 128M data is tested, 4M plaintext and 4M aad data are calculated each time.

<!-- Source EN PDF p.50, block 679 -->

![Source technical figure — PDF 50](/docs/rockchip-crypto-hwrng/assets/en-p50-figure1.png)

| Algorithm | Mode | Source actual (MBps) | Theoretical (MBps) |
|---|---|---|---|
| HASH/HMAC | MD5 | 183 | 196 |
| HASH/HMAC | SHA1 | 148 | 158 |
| HASH/HMAC | SHA256/224 | 183 | 196 |
| HASH/HMAC | SHA512/384/512_224/512_256 | 288 | 316 |
| HASH/HMAC | SM3 | 183 | - |
| DES | ECB | 289 | 352 |
| DES | CBC/CFB/OFB | 79 | 88 |
| 3DES | ECB | 107 | 116 |
| 3DES | CBC/CFB/OFB | 27 | 29 |
| AES (128 \| 192 \| 256) | ECB/CTR/XTS | 447 \| 442 \| 436 | 1066 \| 914 \| 800 |
| AES (128 \| 192 \| 256) | CBC/CFB/OFB/CTS | 234 \| 204 \| 180 | 266 \| 228 \| 200 |
| AES (128 \| 192 \| 256) | CMAC/CBC_MAC | 245 \| 212 \| 186 | 266 \| 228 \| 200 |
| AES (128 \| 192 \| 256) | CCM(data+aad) | 180 \| 162 \| 146 | - |
| AES (128 \| 192 \| 256) | GCM(data+aad) | 196 \| 184 \| 174 | - |
| SM4 | ECB/CTR/XTS | 320 | - |
| SM4 | CBC/CFB/OFB/CTS | 87 | - |
| SM4 | CMAC/CBC_MAC | 89 | - |
| SM4 | CCM(data+aad) | 156 | - |
| SM4 | GCM(data+aad) | 114 | - |

<!-- Source EN PDF p.50, block 680 -->

RSA test: Generate rsa keys, including n, e, and d, and perform public key encryption and private key decryption tests

<!-- Source EN PDF p.50, block 681 -->

Public key encrypt: ciphertext = d ^e % n

<!-- Source EN PDF p.50, block 682 -->

Private key decrypt: plaintext = d^d % n

<!-- Source EN PDF p.50, block 683 -->

![Source technical figure — PDF 50](/docs/rockchip-crypto-hwrng/assets/en-p50-figure2.png)

| RSA | Operation | Source time (ms) |
|---|---|---|
| RSA-1024 | ENC | < 1 |
| RSA-1024 | DEC | 12 |
| RSA-2048 | ENC | 1 |
| RSA-2048 | DEC | 93 |
| RSA-3072 | ENC | 1 |
| RSA-3072 | DEC | 304 |
| RSA-4096 | ENC | 2 |
| RSA-4096 | DEC | 710 |

<!-- Source EN PDF p.51, block 684 -->

## 5. FAQ

<!-- Source EN PDF p.51, block 685 -->

### 5.1 What is serial and parallel in the theoretical performance of the algorithm in the document, and can it be selected by the user?

<!-- Source EN PDF p.51, block 686 -->

Answer: The encryption and decryption of OFB, CCM, GCM, CBC_MAC, CMAC, BYPASS, and encryption of CFB, CBC, and CTS are set to serial mode. The encryption and decryption of ECB, CTR, XTS, and decryption of CFB, CBC, and CTSare in parallel mode.

<!-- Source EN PDF p.51, block 687 -->

There are four computing core units in hardware CYPTO, which automatically performs serial or parallel encryption and decryption according to the algorithm mode. Users cannot intervene in this process and do not need to do additional operations. As long as users choose the parallel mode, it will naturally be more efficient. From the point of view of security and use, CTR mode is preferred, so that encryption and decryption will work in parallel mode.

<!-- Source EN PDF p.51, block 688 -->

### 5.2 Why is the performance in "perf_reports" much different from the theoretical value?

<!-- Source EN PDF p.51, block 689 -->

Answer: The theoretical value is inferred from the operating frequency of the CRYPTO IP and the cycle of the hardware computing unit, completely ignoring other overhead in the actual operation. In practice, in addition to the time overhead of CRYPTO IP computing itself, there will be the following additional time overhead.

<!-- Source EN PDF p.51, block 690 -->

1\. Kernel system calls are time consuming, and it takes time to get stuck into the kernel from the system call and back from the kernel after execution.

<!-- Source EN PDF p.51, block 691 -->

2\. Data transfer requires time overhead, if it is physically non-continuous memory, the driver also needs to organize and copy the data, which is affected by the CPU frequency.

<!-- Source EN PDF p.51, block 692 -->

3\. Because hardware CRYPTO itself is moved and calculated using DMA, the larger the data block, the closer the performance will be to the theoretical value, but limited by the system itself, the data cannot be infinite. The block size taken by demo is 1MByte.

<!-- Source EN PDF p.51, block 693 -->

4\. Time spent refreshing cache in the kernel driver to ensure cache consistency.

<!-- Source EN PDF p.51, block 694 -->

5\. The call overhead of the kernel driver, such as converting the received user computing requests from parallel to serial in order to perform hardware calculations (the serial parallelism here is for computing requests, and the parallel and serial algorithm is not a concept), and the task scheduling overhead.

<!-- Source EN PDF p.51, block 695 -->

### 5.3 Why are the theoretical values of parallel and serial different by a factor of 4, but the actual values are not so different?

<!-- Source EN PDF p.51, block 696 -->

Answer: The time cost listed in question 5.2 is basically the same under the serial algorithm and the parallel algorithm. Assuming that the frame computation consumes 10ms fixed, and the hardware computation requires 90ms in serial mode, the serial mode can play 90% of the performance. It takes 20ms to compute in parallel mode, and the parallel mode can only perform 66% of the time.

<!-- Source EN PDF p.52, block 697 -->

In summary, only when the extra overhead of the framework is infinitesimal and approaches 0, the actual performance of the serial mode and the parallel mode will reach 1:4 as the theoretical performance.

<!-- Source EN PDF p.52, block 698 -->

## 6. References

<!-- Source EN PDF p.52, block 699 -->

## 7. Appendix

<!-- Source EN PDF p.52, block 700 -->

### 7.1 Professional Term



> Source chapters 6 and 7 and §7.1 contain headings only; the final PDF page has no subsequent body text. This records the empty source sections explicitly.


{% endraw %}
