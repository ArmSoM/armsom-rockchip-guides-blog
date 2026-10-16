---
title: "Rockchip Crypto и HWRNG: драйверы, API librkcrypto и производительность"
description: "Полное руководство по Crypto V1/V2/V3/V4/CE, HWRNG, настройке ядра и DTS, структурам и API librkcrypto, исходным тестам и ограничениям."
translation_key: "036-rockchip-crypto-hwrng"
slug: "036-rockchip-crypto-hwrng"
lang: "ru"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["Crypto", "HWRNG", "librkcrypto", "RK3588", "RK3576"]
keywords: "ArmSoM Rockchip Crypto HWRNG librkcrypto RK3588 RK3576"
excerpt: "Полное руководство по Crypto V1/V2/V3/V4/CE, HWRNG, настройке ядра и DTS, структурам и API librkcrypto, исходным тестам и ограничениям."
---

{% raw %}

# Rockchip Crypto и HWRNG: драйверы, API librkcrypto и производительность

Это справочный материал по платформе на основе документа Rockchip V1.4.2, а не отчёт об испытаниях ArmSoM и не обещание поддержки всеми платами. Исходник охватывает, в частности, RK3588 и RK3576. Для конкретной платы ArmSoM необходимо проверить ветку SDK/BSP, конфигурацию ядра, TEE/OTP и набор алгоритмов. В документе указаны зависимости от коммитов kernel 4.19/5.10/6.1; эти сочетания не взаимозаменяемы. Адаптация к конкретной плате аппаратно не проверялась.

Китайская статья следует китайскому PDF из 49 страниц; английская — английскому PDF из 52 страниц. Русская статья полностью переводит английский технический текст. Оба исходника имеют версию V1.4.2, но различия отмечены по месту и в [редакционных записях](/docs/rockchip-crypto-hwrng/EDITORIAL-NOTES.md). Сохранены технические главы, примеры, параметры, таблицы и рисунки. Дата обложки, гриф, юридические и контактные сведения, аудитория и история редакций удалены. Комментарии внутри кода сохранены на языке источника.

**Риск операций:** запись OTP и установка read lock могут быть необратимыми и влиять на другие области OTP. Примеры API приведены только как исходный материал; запись, блокировка и криптографические испытания не выполнялись. Сначала проверьте TRM точного SoC, руководства OTP/TEE и реализацию SDK. Все показатели производительности принадлежат исходным тестам Rockchip, а не измерениям ArmSoM. Официальные ресурсы: [документация ArmSoM](https://docs.armsom.org/), [Rockchip Linux](https://github.com/rockchip-linux).

Техническая область из предисловия: разработка драйверов и прикладного ПО Rockchip Crypto и HWRNG(TRNG). Ниже сохранена таблица версий исходника; она не гарантирует совместимость всех плат ArmSoM.

| SoC | Версия ядра |
|---|---|
| Все SoC Rockchip с блоком Crypto IP | Linux 4.19 |
| Все SoC Rockchip с блоком Crypto IP | Linux 5.10 |
| Все SoC Rockchip с блоком Crypto IP | Linux 6.1 |

<!-- Source EN PDF p.7, block 0 -->

## 1. Обзор

<!-- Source EN PDF p.7, block 1 -->

CRYPTO: на платформе RK используются пять версий IP-блока CRYPTO: V1/V2/V3/V4/CE. V1 — ранняя версия с меньшим набором алгоритмов и функций. Поэтому ядро CRYPTO V2 было разработано заново; последующие версии расширяют его возможности. Базовые функции V2/V3/V4 совместимы. V3 добавляет переключение между несколькими потоками, а V4 повторно использует вычислительное ядро V3, уменьшая площадь IP-блока на кристалле.

<!-- Source EN PDF p.7, block 2 -->

В RKCE сохранено вычислительное ядро, но заново разработаны регистры и способ вызова. Драйвер полностью несовместим с V2/V3/V4 и написан заново.

<!-- Source EN PDF p.7, block 3 -->

TRNG: ранее аппаратный генератор случайных чисел большинства SoC находился внутри CRYPTO IP, включая CRYPTO V1 и часть CRYPTO V2. Начиная с RK356x, HWRNG (TRNG) является отдельным аппаратным модулем.

<!-- Source EN PDF p.7, block 4 -->

### 1.1 crypto v1

<!-- Source EN PDF p.7, block 5 -->

| Алгоритм | Описание |
|---|---|
| DES/TDES | DES/3DES, режимы ECB/CBC |
| AES | AES с ключом 128/192/256 бит, режимы ECB/CBC/CTR/XTS |
| HASH | Хеширование SHA1/SHA256/MD5 с аппаратным заполнением |
| RSA | Модульное возведение в степень PKA 512/1024/2048 бит; не поддерживается в RK3126, RK3128, RK3288, RK3368 |
| TRNG | Аппаратный генератор истинно случайных чисел (TRNG), 256 бит |


> Различие источников: китайский §1.1 дополнительно указывает TDES EEE/EDE, а §1.2 — только EDE. В английской таблице эти ограничения изложены не полностью. Проверьте точный IP и SDK.



<!-- Source EN PDF p.8, block 9 -->

### 1.2 crypto v2

<!-- Source EN PDF p.8, block 11 -->

| Алгоритм | Описание |
|---|---|
| DES/TDES | Режимы ECB/CBC/OFB/CFB |
| AES | Режимы ECB/CBC/OFB/CFB/CTR/CTS/XTS/CCM/GCM/CBC-MAC/CMAC |
| SM4 | Режимы ECB/CBC/OFB/CFB/CTR/CTS/XTS/CCM/GCM/CBC-MAC/CMAC; SM4 — необязательная возможность |
| HASH | MD5/SHA1/SHA224/SHA256/SHA384/SHA512/SM3/SHA512-224/SHA512-256 с аппаратным заполнением; SM3 — необязательная возможность |
| HMAC | HMAC для SHA-1, SHA-256, SHA-512, MD5, SM3 с аппаратным заполнением; SM3 — необязательная возможность |
| RSA/ECC | Вычисления PKA до 4096 бит для RSA/ECC/SM2 |
| TRNG | Аппаратный генератор истинно случайных чисел (TRNG), 256 бит |


> Различие источников: китайский §1.1 дополнительно указывает TDES EEE/EDE, а §1.2 — только EDE. В английской таблице эти ограничения изложены не полностью. Проверьте точный IP и SDK.



<!-- Source EN PDF p.8, block 15 -->

### 1.3 crypto v3

<!-- Source EN PDF p.8, block 16 -->

Crypto V3 добавляет многопоточность к алгоритмам Crypto V2. Начиная с RV1106, платформа Crypto V3 автоматически определяет поддерживаемые алгоритмы; в свойстве `compatible` используется идентификатор `"rockchip,crypto-v3"`.

<!-- Source EN PDF p.8, block 17 -->

### 1.4 crypto v4

<!-- Source EN PDF p.8, block 18 -->

В Crypto V4 выполнены дополнительные оптимизации относительно V3. Драйверы совместимы и могут повторно использовать код V3. В `compatible` используется идентификатор `"rockchip,crypto-v4"`.

<!-- Source EN PDF p.8, block 19 -->

### 1.5 crypto ce

<!-- Source EN PDF p.8, block 20 -->

В RKCE сохранено вычислительное ядро, но заново разработаны регистры и способ вызова. Драйвер полностью несовместим с V2/V3/V4 и написан заново. В `compatible` используется идентификатор `"rockchip,crypto-ce"`.

<!-- Source EN PDF p.8, block 21 -->

### 1.6 Версии Crypto IP в различных SoC

<!-- Source EN PDF p.8, block 22 -->

Распределение версий Crypto IP по SoC приведено ниже.

<!-- Source EN PDF p.8, block 23 -->

Платформы с Crypto V1:

<!-- Source EN PDF p.8, block 24 -->

RK3399, RK3288, RK3368, RK3328/RK3228H, RK322x, RK3128, RK1108, RK3126

<!-- Source EN PDF p.9, block 25 -->

Платформы с Crypto V2:

<!-- Source EN PDF p.9, block 26 -->

RK3326/PX30, RK3308, RK1808, RV1126/RV1109, RK2206, RK356x, RK3588

<!-- Source EN PDF p.9, block 27 -->

Платформы с Crypto V3:

<!-- Source EN PDF p.9, block 28 -->

RV1106, RV1103

<!-- Source EN PDF p.9, block 29 -->

Платформы с Crypto V4:

<!-- Source EN PDF p.9, block 30 -->

RK3528, RK3562, RK3503, RK3506, RK3576, RV1103B, RV1106B

<!-- Source EN PDF p.9, block 31 -->

Платформы с Crypto CE:

<!-- Source EN PDF p.9, block 32 -->

RV1126B

<!-- Source EN PDF p.9, block 33 -->

## 2. Разработка драйвера

<!-- Source EN PDF p.9, block 34 -->

### 2.1 Исходный код драйвера

<!-- Source EN PDF p.9, block 35 -->

#### 2.1.1 hwrng

<!-- Source EN PDF p.9, block 36 -->

Драйвер HWRNG относительно прост, поэтому четыре варианта — Crypto V1/V2, TRNGV1 и RKRNG — реализованы в одном файле C.

<!-- Source EN PDF p.9, block 37 -->

Драйвер не разделяет конкретные модели SoC: варианты выбираются по четырём значениям `compatible`: `"rockchip,cryptov1-rng"`, `"rockchip,cryptov2-rng"`, `"rockchip,trngv1"`, `"rockchip,rkrng"`. Последние два соответствуют отдельным модулям HWRNG; первые два — генераторам, встроенным в Crypto.

<!-- Source EN PDF p.9, block 38 -->

Исходный код драйвера: `drivers/char/hw_random/rockchip-rng.c`.

<!-- Source EN PDF p.9, block 39 -->

#### 2.1.2 crypto

<!-- Source EN PDF p.9, block 40 -->

В текущем драйвере реализованы следующие алгоритмы.

<!-- Source EN PDF p.9, block 41 -->

crypto v1:

<!-- Source EN PDF p.9, block 42 -->

AES: ECB/CBC

<!-- Source EN PDF p.9, block 43 -->

DES/TDES: ECB/CBC

<!-- Source EN PDF p.9, block 44 -->

HASH: SHA1/SHA256/MD5

<!-- Source EN PDF p.9, block 45 -->

crypto v2/v3/v4: часть SoC поддерживает не все перечисленные алгоритмы.

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

RSA: длина ключа до 4096 бит.

<!-- Source EN PDF p.10, block 52 -->

Полный аппаратный набор crypto v2/v3/v4. Зачёркнутые режимы в драйвере ещё не реализованы:

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

RSA: длина ключа до 4096 бит.

<!-- Source EN PDF p.10, block 59 -->

Различия аппаратных возможностей crypto v2/v3/v4:

<!-- Source EN PDF p.10, block 60 -->

| SoC | AES | DES/TDES | SM3/SM4 | HASH | HMAC | RSA/ECC | Многопоточность |
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

Примечания:

<!-- Source EN PDF p.10, block 62 -->

1\. RK1808: AES поддерживает только ключи 128 бит. Для драйвера ядра AES не поддерживается.

<!-- Source EN PDF p.10, block 63 -->

2\. RV1126/RV1109 не поддерживают AES-192 аппаратно. Этот вариант реализуется программным алгоритмом, который не поддерживает все режимы аппаратного блока. Поэтому не рекомендуется менять уже настроенный в коде список алгоритмов.

<!-- Source EN PDF p.10, block 64 -->

Файлы драйвера:

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

### 2.2 Включение HWRNG

<!-- Source EN PDF p.12, block 70 -->

#### 2.2.1 Menuconfig

<!-- Source EN PDF p.12, block 71 -->

Драйвер HWRNG по умолчанию компилируется в ядро, а включение устройства определяется файлом DTS.

<!-- Source EN PDF p.12, block 72 -->

Конфигурация показана на рисунке. Красным отмечены путь в меню и необходимые параметры.

<!-- Source EN PDF p.12, block 73 -->

![Технический рисунок из исходника — PDF 12](/docs/rockchip-crypto-hwrng/assets/en-p12-figure1.png)

<!-- Source EN PDF p.12, block 74 -->

Либо добавьте следующие строки в файл конфигурации. В `rockchip_defconfig` они уже заданы по умолчанию:

<!-- Source EN PDF p.12, block 75 -->

```text
CONFIG_HW_RANDOM=y
CONFIG_HW_RANDOM_ROCKCHIP=y
```

<!-- Source EN PDF p.12, block 76 -->

#### 2.2.2 Включение узла rng в DTS

<!-- Source EN PDF p.12, block 77 -->

В DTSI большинства SoC узел HWRNG уже описан. Достаточно включить модуль rng в DTS платы:

<!-- Source EN PDF p.12, block 78 -->

```text
&rng {
    status = "okay";
}
```

<!-- Source EN PDF p.12, block 79 -->

#### 2.2.3 Добавление узла rng для нового SoC

<!-- Source EN PDF p.12, block 80 -->

На большинстве платформ узел rng уже настроен. Если в DTSI SoC его нет, выполните следующие действия.

<!-- Source EN PDF p.12, block 81 -->

Внимание:

<!-- Source EN PDF p.13, block 82 -->

1\. Базовый адрес RNG необходимо определить по TRM конкретного SoC. В исходном примере базовый адрес RNG совпадает с базовым адресом CRYPTO.

<!-- Source EN PDF p.13, block 83 -->

2\. Макросы тактовых сигналов различаются между платформами. При ошибке DTS перейдите в `include/dt-bindings/clock` и выполните `grep -rn CRYPTO`, чтобы найти соответствующие имена:

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

Для TRNG фактически не нужны все тактовые сигналы; достаточно `hclk_crypto`.

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

В RK3588 и RV1106 используется модуль TRNG V1. Его архитектура отличается от генератора, выделенного из Crypto V2, и улучшает случайность.

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

#### 2.2.4 Проверка включения HWRNG

<!-- Source EN PDF p.14, block 94 -->

1\. Выполните `cat /sys/devices/virtual/misc/hw_random/rng_current`. Значение `rockchip` показывает, что выбран аппаратный драйвер.

<!-- Source EN PDF p.14, block 95 -->

2\. Linux: команда `cat /dev/hwrng | od -x | head -n 1` выводит строку случайных чисел. При каждом запуске содержимое меняется.

<!-- Source EN PDF p.14, block 96 -->

3\. Android: команда `cat /dev/hw_random | od -x | head -n 1` выводит строку случайных чисел. При каждом запуске содержимое меняется.

<!-- Source EN PDF p.14, block 97 -->

### 2.3 Включение аппаратного Crypto

<!-- Source EN PDF p.14, block 98 -->

В описанном исходном коде Crypto V1 поддерживает rk3328, Crypto V2 — px30/rv1126/rk3568/rk3588, Crypto V3 — rv1106. Для этих платформ достаточно включить конфигурацию ядра и узел DTS.

<!-- Source EN PDF p.14, block 99 -->

Начиная с RV1106, поддерживаемые возможности отражаются в регистрах. Crypto V3 может автоматически адаптироваться к новому SoC.

<!-- Source EN PDF p.14, block 100 -->

#### 2.3.1 Menuconfig

<!-- Source EN PDF p.14, block 101 -->

После настройки menuconfig драйвер Rockchip Crypto компилируется в ядро. Версия Crypto IP автоматически выбирается по идентификатору `compatible` платформы.

<!-- Source EN PDF p.14, block 102 -->

Пункты конфигурации аппаратного Crypto доступны только после включения `CONFIG_CRYPTO_HW`.

<!-- Source EN PDF p.15, block 103 -->

![Технический рисунок из исходника — PDF 15](/docs/rockchip-crypto-hwrng/assets/en-p15-figure1.png)

<!-- Source EN PDF p.15, block 104 -->

Либо добавьте следующие строки в файл конфигурации. `CONFIG_CRYPTO_DEV_ROCKCHIP_V3` здесь приведён только как пример: выберите вариант для фактического SoC. Рекомендуется menuconfig, автоматически выбирающий платформу.

<!-- Source EN PDF p.15, block 105 -->

```text
CONFIG_CRYPTO_HW=y
CONFIG_CRYPTO_DEV_ROCKCHIP=y
CONFIG_CRYPTO_DEV_ROCKCHIP_V3=y
CONFIG_CRYPTO_DEV_ROCKCHIP_DEV=y
```

<!-- Source EN PDF p.15, block 106 -->

#### 2.3.2 Включение узла crypto в DTS

<!-- Source EN PDF p.15, block 107 -->

Убедившись в правильности описания узла crypto, включите модуль в DTS платы:

<!-- Source EN PDF p.15, block 108 -->

```text
&crypto {
    status = "okay";
};
```

<!-- Source EN PDF p.15, block 109 -->

#### 2.3.3 Добавление поддержки нового SoC

<!-- Source EN PDF p.15, block 110 -->

Если в DTSI SoC нет узла crypto, добавьте поддержку следующим образом.

<!-- Source EN PDF p.15, block 111 -->

1\. Определите версию Crypto IP: V1/V2/V3. Для V3 начиная с RV1106 используется `"rockchip,crypto-v3"`; программное обеспечение само адаптирует набор алгоритмов и возможностей.

<!-- Source EN PDF p.15, block 112 -->

2\. В `drivers/crypto/rockchip/rk_crypto_core.c` добавьте `algs_name`, `soc_data` и значение `compatible`.

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

3\. Добавьте узел crypto для нового SoC.

<!-- Source EN PDF p.16, block 116 -->

Внимание:

<!-- Source EN PDF p.16, block 117 -->

1\. Определите базовый адрес CRYPTO по TRM SoC.

<!-- Source EN PDF p.16, block 118 -->

2\. Макросы тактовых сигналов могут различаться. При ошибке DTS перейдите в `include/dt-bindings/clock` и найдите соответствующие имена командой `grep -rn CRYPTO`, как показано ниже.

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

У большинства SoC с Crypto V2 регистры HWRNG находятся внутри адресного пространства Crypto. Поэтому при задании `reg` разделите его на две части: регистры CIPHER и регистры RSA.

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

4\. Включите узел crypto.

<!-- Source EN PDF p.17, block 127 -->

```text
&crypto {
    status = "okay";
};
```

<!-- Source EN PDF p.17, block 128 -->

#### 2.3.4 Проверка включения аппаратного Crypto

<!-- Source EN PDF p.17, block 130 -->

Команда `cat /proc/crypto | grep rk` показывает зарегистрированные аппаратные алгоритмы Rockchip. Ниже приведён пример RV1126.

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

Команда `cat /proc/rkcrypto` показывает сведения о драйвере Rockchip Crypto: версию, частоты, доступные алгоритмы и статистику работы. Исходник требует обновлённый код: старый драйвер эту функцию не поддерживает. В документе отмечено дальнейшее расширение сведений. Значение `"CRYPTO V3.0.0.0 multi"` означает поддержку многопоточности на платформе.

<!-- Source EN PDF p.18, block 136 -->

Примечание: на платформах RKCE файл `/proc/rkcrypto` не создаётся.

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

## 3. Разработка в пользовательском пространстве

<!-- Source EN PDF p.20, block 140 -->

### 3.1 Вызов HWRNG из пользовательского пространства

<!-- Source EN PDF p.20, block 141 -->

Получить случайные числа аппаратного HWRNG можно двумя способами:

<!-- Source EN PDF p.20, block 142 -->

- чтением узла драйвера ядра;

<!-- Source EN PDF p.20, block 143 -->

- вызовом API librkcrypto.

<!-- Source EN PDF p.20, block 144 -->

Внимание:

<!-- Source EN PDF p.20, block 145 -->

1\. После успешной регистрации драйвер HWRNG может добавлять энтропию в драйвер random ядра. Аппаратные случайные числа поступают в его пул энтропии. Драйвер random использует криптографически стойкий генератор псевдослучайных чисел (CSPRNG). Для случайных чисел высокого качества исходник рекомендует чтение `/dev/random` или `/dev/urandom`.

<!-- Source EN PDF p.20, block 146 -->

#### 3.1.1 Чтение узла драйвера ядра

<!-- Source EN PDF p.20, block 147 -->

Если модуль rng включён в ядре, случайные числа можно читать из пользовательского пространства: в Linux — `/dev/hwrng`, в Android — `/dev/hw_random`. Пример:

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

#### 3.1.2 Вызов API librkcrypto

<!-- Source EN PDF p.21, block 151 -->

См. описание API `rk_get_random`.

<!-- Source EN PDF p.21, block 152 -->

### 3.2 Вызов аппаратного Crypto из пользовательского пространства

<!-- Source EN PDF p.21, block 153 -->

Для работы с аппаратным криптографическим модулем пользовательское приложение вызывает интерфейсы librkcrypto. Ниже описано использование этой библиотеки.

<!-- Source EN PDF p.21, block 154 -->

Внимание: сначала убедитесь, что аппаратный Crypto включён в ядре. Порядок включения и проверки приведён в §2.3 и §2.3.4.

<!-- Source EN PDF p.21, block 155 -->

#### 3.2.1 Область применения

<!-- Source EN PDF p.21, block 156 -->

| API | RK3588 | RK356x | RV1109/1126 | Другие |
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

#### 3.2.2 Зависимости от версий

<!-- Source EN PDF p.22, block 158 -->

##### 3.2.2.1 V1.3.0

<!-- Source EN PDF p.22, block 159 -->

Функции librkcrypto V1.3.0 зависят от приведённых ниже коммитов ядра. ECC/SM2 поддерживают только более новые SoC, например RK3576, преимущественно с ядром 6.1.

<!-- Source EN PDF p.22, block 160 -->

1\. Ядро 6.1

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

Функции librkcrypto V1.2.0 зависят от следующих коммитов ядра. Если драйвер Crypto не обновлён до этих состояний, часть функций может быть недоступна.

<!-- Source EN PDF p.22, block 164 -->

1\. Ядро 4.19

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

2\. Ядро 5.10

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

#### 3.2.3 Важные ограничения

<!-- Source EN PDF p.23, block 169 -->

Длина входных данных симметричного алгоритма должна отвечать требованиям выбранного режима. ECB и CBC требуют выравнивания по блоку; CTS и CTR такого требования к длине не предъявляют. API не выполняет заполнение (padding).

<!-- Source EN PDF p.23, block 170 -->

Для больших объёмов данных рекомендуется интерфейс с передачей через `dma_fd`. Crypto поддерживает только физически непрерывную память ниже границы 4G, поэтому буфер dma fd должен быть физически непрерывным и находиться в этой области (CMA). Можно использовать интерфейсы `rk_crypto_mem` из librkcrypto либо самостоятельно выделить память, например через DRM, и получить dma fd.

<!-- Source EN PDF p.23, block 171 -->

Настройка CMA: Crypto обращается только к адресам CMA ниже 4G. Если устройство имеет более 4G памяти, измените конфигурацию CMA в DTS, иначе `rk_crypto_mem` может успешно выделить недоступную для Crypto память. Ниже пример `rk3588-android.dtsi`: `0x10000000` — начальный адрес CMA (256MB; исходник запрещает менять это значение), `0x00800000` — размер, который можно изменить по необходимости. Подробнее см. `Rockchip_Developer_Guide_Linux_CMA_CN`.

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

Перед использованием следующих интерфейсов убедитесь, что TEE работает. См. `Rockchip_Developer_Guide_TEE_SDK_CN`.

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

`rk_set_oem_hr_otp_read_lock`: при `key_id`, равном `RK_OEM_OTP_KEY0/1/2`, успешная установка влияет на атрибуты других областей OTP; некоторые могут стать недоступны для записи. См. `Rockchip_Developer_Guide_OTP_CN`. Поэтому рекомендуется `RK_OEM_OTP_KEY3`.

<!-- Source EN PDF p.23, block 180 -->

`rk_oem_otp_key_cipher_virt`: максимальное значение `len` зависит от разделяемой памяти TEE. Если она уже занята, допустимый размер может оказаться меньше ожидаемого.

<!-- Source EN PDF p.24, block 181 -->

#### 3.2.4 Структуры данных

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

- vaddr - виртуальный адрес памяти.

<!-- Source EN PDF p.24, block 185 -->

- dma_fd - дескриптор dma_fd памяти.

<!-- Source EN PDF p.24, block 186 -->

- size - размер области памяти.

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

- algo - тип алгоритма, см. `RK_CRYPTO_ALGO`. Допустимый диапазон определяется описанием API; это правило действует и далее.

<!-- Source EN PDF p.24, block 190 -->

- mode - режим алгоритма, см. `RK_CIPIHER_MODE`. Поддерживаются ECB/CBC/CTR/CFB/OFB/.

<!-- Source EN PDF p.24, block 191 -->

- operation - шифрование или расшифрование, см. `RK_CRYPTO_OPERATION`.

<!-- Source EN PDF p.24, block 192 -->

- key - незашифрованный ключевой материал; не используется при работе с otp key.

<!-- Source EN PDF p.24, block 193 -->

- key_len - длина ключа, байт.

<!-- Source EN PDF p.24, block 194 -->

- iv - вектор инициализации; не используется в ECB. В других режимах `rk_cipher_crypt/crypt_virt` автоматически обновляет iv для последовательной обработки нескольких частей данных.

<!-- Source EN PDF p.24, block 195 -->

- reserved - зарезервировано.

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

- algo - тип алгоритма, см. `RK_CRYPTO_ALGO`. Поддерживаются AES/SM4.

<!-- Source EN PDF p.25, block 199 -->

- mode - режим алгоритма, см. `RK_CIPIHER_MODE`. Поддерживаются GCM/CCM.

<!-- Source EN PDF p.25, block 200 -->

- operation - шифрование или расшифрование, см. `RK_CRYPTO_OPERATION`.

<!-- Source EN PDF p.25, block 201 -->

- key - незашифрованный ключевой материал; не используется при работе с otp key.

<!-- Source EN PDF p.25, block 202 -->

- key_len - длина ключа, байт.

<!-- Source EN PDF p.25, block 203 -->

- iv - вектор инициализации.

<!-- Source EN PDF p.25, block 204 -->

- iv_len - длина вектора инициализации, байт.

<!-- Source EN PDF p.25, block 205 -->

- tag_len - длина тега, байт.

<!-- Source EN PDF p.25, block 206 -->

- aad_len - длина aad, байт.

<!-- Source EN PDF p.25, block 207 -->

- payload_len - длина полезных данных, байт.

<!-- Source EN PDF p.25, block 208 -->

- reserved - зарезервировано.

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

- algo - тип алгоритма, см. `RK_CRYPTO_ALGO`. Поддерживаются HASH/HMAC.

<!-- Source EN PDF p.25, block 212 -->

- key - ключ hash-mac; используется только при выборе HMAC в algo.

<!-- Source EN PDF p.25, block 213 -->

- key_len - длина ключа, байт.

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

- n - модуль, в формате big-endian, как в OpenSSL.

<!-- Source EN PDF p.26, block 217 -->

- e - показатель степени, в формате big-endian, как в OpenSSL.

<!-- Source EN PDF p.26, block 218 -->

- n_len - длина модуля.

<!-- Source EN PDF p.26, block 219 -->

- e_len - длина показателя степени.

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

- key_type - тип ключа, см. `RK_RSA_KEY_TYPE`. Поддерживаются незашифрованный ключевой материал и материал, зашифрованный OTP_KEY. librkcrypto передаёт ключ драйверу Crypto, который перед использованием расшифровывает его соответствующим otp key.

<!-- Source EN PDF p.26, block 223 -->

- key - открытый ключ, см. `rk_rsa_pub_key`.

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

- n - модуль, в формате big-endian, как в OpenSSL.

<!-- Source EN PDF p.27, block 228 -->

- e - показатель степени, в формате big-endian, как в OpenSSL.

<!-- Source EN PDF p.27, block 229 -->

- d - закрытый ключ, в формате big-endian, как в OpenSSL.

<!-- Source EN PDF p.27, block 230 -->

- p - необязательный параметр.

<!-- Source EN PDF p.27, block 231 -->

- q - необязательный параметр.

<!-- Source EN PDF p.27, block 232 -->

- dp - необязательный параметр.

<!-- Source EN PDF p.27, block 233 -->

- dq - необязательный параметр.

<!-- Source EN PDF p.27, block 234 -->

- qp - необязательный параметр.

<!-- Source EN PDF p.27, block 235 -->

- len - сведения о длине каждого элемента; повторное описание опущено в исходнике.

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

- key_type - тип ключа, см. `RK_RSA_KEY_TYPE`. Поддерживаются незашифрованный ключевой материал и материал, зашифрованный OTP_KEY. Перед использованием librkcrypto передаёт ключ для расшифрования соответствующим otp key.

<!-- Source EN PDF p.27, block 239 -->

- key - закрытый ключ, см. `rk_rsa_priv_key`.

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

- curve - выбор кривой, см. `RK_EC_CURVE`, например RK_EC_CURVE_SM2/P192/P224/P256...

<!-- Source EN PDF p.27, block 243 -->

- x - координата x открытого ключа, в формате big-endian, как в OpenSSL.

<!-- Source EN PDF p.27, block 244 -->

- y - координата y открытого ключа, в формате big-endian, как в OpenSSL.

<!-- Source EN PDF p.27, block 245 -->

- x_len - длина данных x.

<!-- Source EN PDF p.27, block 246 -->

- y_len - длина данных y.

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

- key_type - тип ключа, см. `RK_EC_KEY_TYPE`. Поддерживаются незашифрованный ключевой материал и материал, зашифрованный OTP_KEY. Перед использованием librkcrypto передаёт ключ для расшифрования соответствующим otp key.

<!-- Source EN PDF p.28, block 250 -->

- key - открытый ключ, см. `rk_ec_pub_key`.

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

- curve - выбор кривой, см. `RK_EC_CURVE`, например RK_EC_CURVE_SM2/P192/P224/P256...

<!-- Source EN PDF p.28, block 254 -->

- x - координата x открытого ключа, в формате big-endian, как в OpenSSL.

<!-- Source EN PDF p.28, block 255 -->

- y - координата y открытого ключа, в формате big-endian, как в OpenSSL.

<!-- Source EN PDF p.28, block 256 -->

- d - значение d закрытого ключа, в формате big-endian, как в OpenSSL.

<!-- Source EN PDF p.28, block 257 -->

- x_len - длина данных x.

<!-- Source EN PDF p.28, block 258 -->

- y_len - длина данных y.

<!-- Source EN PDF p.28, block 259 -->

- d_len - длина данных d.

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

- key_type - тип ключа, см. `RK_EC_KEY_TYPE`. Поддерживаются незашифрованный ключевой материал и материал, зашифрованный OTP_KEY. Перед использованием librkcrypto передаёт ключ для расшифрования соответствующим otp key.

<!-- Source EN PDF p.28, block 263 -->

- key - закрытый ключ, см. `rk_ec_priv_key`.

<!-- Source EN PDF p.29, block 264 -->

#### 3.2.5 Константы

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

##### 3.2.5.10 Другие константы

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

##### 3.2.6.1 Типы данных

<!-- Source EN PDF p.32, block 287 -->

```text
typedef uint32_t RK_RES;
typedef uint32_t rk_handle;
```

<!-- Source EN PDF p.33, block 288 -->

##### 3.2.6.2 Коды возврата

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

Функция

<!-- Source EN PDF p.33, block 293 -->

Выделяет область памяти и возвращает `rk_crypto_mem`, содержащую виртуальный адрес и dma_fd.

<!-- Source EN PDF p.33, block 294 -->

Параметры

<!-- Source EN PDF p.33, block 295 -->

- [in] size - размер выделяемой памяти.

<!-- Source EN PDF p.33, block 296 -->

- [out] memory - сведения об адресе памяти, см. `rk_crypto_mem`.

<!-- Source EN PDF p.33, block 297 -->

Внимание

<!-- Source EN PDF p.33, block 298 -->

1\. Максимальный размер зависит от размера буфера CMA ядра и его занятости.

<!-- Source EN PDF p.33, block 299 -->

##### 3.2.6.4 rk_crypto_mem_free

<!-- Source EN PDF p.33, block 300 -->

```text
void rk_crypto_mem_free(rk_crypto_mem *memory);
```

<!-- Source EN PDF p.33, block 301 -->

Функция

<!-- Source EN PDF p.33, block 302 -->

Освобождает память, выделенную `rk_crypto_mem_alloc`.

<!-- Source EN PDF p.33, block 303 -->

Параметры

<!-- Source EN PDF p.33, block 304 -->

- [in] memory - сведения об адресе памяти, см. `rk_crypto_mem`.

<!-- Source EN PDF p.34, block 305 -->

##### 3.2.6.5 rk_crypto_init

<!-- Source EN PDF p.34, block 306 -->

```text
RK_RES rk_crypto_init(void);
```

<!-- Source EN PDF p.34, block 307 -->

Функция

<!-- Source EN PDF p.34, block 308 -->

Инициализация Crypto, включая открытие узлов устройств.

<!-- Source EN PDF p.34, block 309 -->

Параметры

<!-- Source EN PDF p.34, block 310 -->

Нет.

<!-- Source EN PDF p.34, block 311 -->

##### 3.2.6.6 rk_crypto_deinit

<!-- Source EN PDF p.34, block 312 -->

```text
void rk_crypto_deinit(void);
```

<!-- Source EN PDF p.34, block 313 -->

Функция

<!-- Source EN PDF p.34, block 314 -->

Освобождение ресурсов Crypto, включая закрытие узлов устройств.

<!-- Source EN PDF p.34, block 315 -->

Параметры

<!-- Source EN PDF p.34, block 316 -->

Нет.

<!-- Source EN PDF p.34, block 317 -->

##### 3.2.6.7 rk_hash_init

<!-- Source EN PDF p.34, block 318 -->

```text
RK_RES rk_hash_init(rk_hash_config *config, rk_handle *handle);
```

<!-- Source EN PDF p.34, block 319 -->

Функция

<!-- Source EN PDF p.34, block 320 -->

Инициализация алгоритма хеширования. Поддерживаются MD5/SHA1/SHA224/SHA256/SHA384/SHA512/SM3.

<!-- Source EN PDF p.34, block 321 -->

Параметры

<!-- Source EN PDF p.34, block 322 -->

- [in] config - конфигурация hash/hmac.

<!-- Source EN PDF p.34, block 323 -->

- [out] handle - дескриптор hash/hmac.

<!-- Source EN PDF p.34, block 324 -->

Внимание

<!-- Source EN PDF p.34, block 325 -->

1\. После успешного `rk_hash_init` обязательно вызовите `rk_hash_final` для освобождения ресурсов независимо от результата `rk_hash_update()` или `rk_hash_update_virt`.

<!-- Source EN PDF p.34, block 326 -->

2\. Если `rk_hash_init` возвращает `RK_CRYPTO_ERR_BUSY`, платформа не поддерживает многопоточность: одновременно может работать только один дескриптор. Перед созданием нового дождитесь освобождения предыдущего.

<!-- Source EN PDF p.35, block 327 -->

##### 3.2.6.8 rk_hash_update

<!-- Source EN PDF p.35, block 328 -->

```text
RK_RES rk_hash_update(rk_handle handle, int data_fd, uint32_t data_len);
```

<!-- Source EN PDF p.35, block 329 -->

Функция

<!-- Source EN PDF p.35, block 330 -->

Принимает dma_fd входных данных, вычисляет hash/hmac и поддерживает обработку данных несколькими частями.

<!-- Source EN PDF p.35, block 331 -->

Параметры

<!-- Source EN PDF p.35, block 332 -->

- [in] handle - дескриптор hash/hmac.

<!-- Source EN PDF p.35, block 333 -->

- [in] data_fd - дескриптор обрабатываемых данных.

<!-- Source EN PDF p.35, block 334 -->

- [in] data_len - длина данных, байт.

<!-- Source EN PDF p.35, block 335 -->

Внимание

<!-- Source EN PDF p.35, block 336 -->

1\. handle должен быть инициализирован вызовом `rk_hash_init()`.

<!-- Source EN PDF p.35, block 337 -->

2\. Можно вызывать несколько раз для последовательной передачи данных.

<!-- Source EN PDF p.35, block 338 -->

3\. Если это не последняя группа данных, data_len должна быть кратна 64 байтам.

<!-- Source EN PDF p.35, block 339 -->

##### 3.2.6.9 rk_hash_update_virt

<!-- Source EN PDF p.35, block 340 -->

```text
RK_RES rk_hash_update_virt(rk_handle handle, uint8_t *data, uint32_t data_len);
```

<!-- Source EN PDF p.35, block 341 -->

Функция

<!-- Source EN PDF p.35, block 342 -->

Принимает виртуальный адрес данных и вычисляет хеш. Поддерживается обработка несколькими частями.

<!-- Source EN PDF p.35, block 343 -->

Параметры

<!-- Source EN PDF p.35, block 344 -->

- [in] handle - дескриптор hash/hmac.

<!-- Source EN PDF p.35, block 345 -->

- [in] data - обрабатываемые данные.

<!-- Source EN PDF p.35, block 346 -->

- [in] data_len - длина данных, байт.

<!-- Source EN PDF p.35, block 347 -->

Внимание

<!-- Source EN PDF p.35, block 348 -->

1\. handle должен быть инициализирован вызовом `rk_hash_init()`.

<!-- Source EN PDF p.35, block 349 -->

2\. Можно вызывать несколько раз для последовательной передачи данных.

<!-- Source EN PDF p.35, block 350 -->

3\. Если это не последняя группа данных, data_len должна быть кратна 64 байтам.

<!-- Source EN PDF p.35, block 351 -->

##### 3.2.6.10 rk_hash_final

<!-- Source EN PDF p.35, block 352 -->

```text
RK_RES rk_hash_final(rk_handle handle, uint8_t *hash);
```

<!-- Source EN PDF p.35, block 353 -->

Функция

<!-- Source EN PDF p.35, block 354 -->

После обработки всех данных получает окончательное значение hash/hmac и освобождает дескриптор. Этот интерфейс также необходимо вызвать для завершения при прерывании вычисления.

<!-- Source EN PDF p.36, block 355 -->

Параметры

<!-- Source EN PDF p.36, block 356 -->

- [in] handle - дескриптор hash/hmac.

<!-- Source EN PDF p.36, block 357 -->

- [out] hash - результат hash/hmac.

<!-- Source EN PDF p.36, block 358 -->

Внимание

<!-- Source EN PDF p.36, block 359 -->

1\. handle должен быть инициализирован вызовом `rk_hash_init()`.

<!-- Source EN PDF p.36, block 360 -->

2\. Размер выходного буфера hash/hmac должен быть не меньше длины хеша.

<!-- Source EN PDF p.36, block 361 -->

##### 3.2.6.11 rk_hash_virt

<!-- Source EN PDF p.36, block 362 -->

```text
RK_RES rk_hash_virt(uint32_t algo, const uint8_t *input, uint32_t in_len,
             uint8_t *hash, uint32_t *hash_len);
```

<!-- Source EN PDF p.36, block 363 -->

Функция

<!-- Source EN PDF p.36, block 364 -->

Принимает виртуальный адрес данных и вычисляет хеш за один вызов.

<!-- Source EN PDF p.36, block 365 -->

Параметры

<!-- Source EN PDF p.36, block 366 -->

- [in] algo - алгоритм хеширования, например RK_ALGO_MD5/SHA1/SHA256...

<!-- Source EN PDF p.36, block 367 -->

- [in] input - виртуальный адрес данных для хеширования.

<!-- Source EN PDF p.36, block 368 -->

- [in] in_len - длина input, байт.

<!-- Source EN PDF p.36, block 369 -->

- [out] hash - полученный хеш.

<!-- Source EN PDF p.36, block 370 -->

- [in/out] hash_len - на входе размер буфера hash, на выходе фактическая длина хеша.

<!-- Source EN PDF p.36, block 371 -->

##### 3.2.6.12 rk_cipher_init

<!-- Source EN PDF p.36, block 372 -->

```text
RK_RES rk_cipher_init(rk_cipher_config *config, rk_handle *handle);
```

<!-- Source EN PDF p.36, block 373 -->

Функция

<!-- Source EN PDF p.36, block 374 -->

Инициализация симметричного шифрования. Поддерживаются TDES/AES/SM4 и режимы ECB/CBC/CTR/CFB/OFB.

<!-- Source EN PDF p.36, block 375 -->

Параметры

<!-- Source EN PDF p.36, block 376 -->

- [in] config - алгоритм, режим, ключ, iv и другие параметры, см. `rk_cipher_config`.

<!-- Source EN PDF p.36, block 377 -->

- [out] handle - дескриптор cipher.

<!-- Source EN PDF p.36, block 378 -->

Внимание

<!-- Source EN PDF p.36, block 379 -->

1\. После успешной инициализации обязательно вызовите `rk_cipher_final()` для освобождения ресурсов независимо от результата `rk_cipher_crypt/crypt_virt()`.

<!-- Source EN PDF p.37, block 380 -->

##### 3.2.6.13 rk_cipher_crypt

<!-- Source EN PDF p.37, block 381 -->

```text
RK_RES rk_cipher_crypt(rk_handle handle, int in_fd, int out_fd, uint32_t len);
```

<!-- Source EN PDF p.37, block 382 -->

Функция

<!-- Source EN PDF p.37, block 383 -->

Принимает dma_fd данных и выполняет симметричное шифрование или расшифрование.

<!-- Source EN PDF p.37, block 384 -->

Параметры

<!-- Source EN PDF p.37, block 385 -->

- [in] handle - дескриптор cipher.

<!-- Source EN PDF p.37, block 386 -->

- [in] in_fd - dma_fd входных данных.

<!-- Source EN PDF p.37, block 387 -->

- [out] out_fd - dma_fd выходных данных.

<!-- Source EN PDF p.37, block 388 -->

- [in] len - длина входных данных, байт.

<!-- Source EN PDF p.37, block 389 -->

Внимание

<!-- Source EN PDF p.37, block 390 -->

1\. handle должен быть инициализирован вызовом `rk_cipher_init()`.

<!-- Source EN PDF p.37, block 391 -->

2\. in_fd и out_fd могут быть одним и тем же dma_fd.

<!-- Source EN PDF p.37, block 392 -->

3\. После вычисления iv в `rk_cipher_config` обновляется. Повторные вызовы позволяют обрабатывать данные по частям.

<!-- Source EN PDF p.37, block 393 -->

##### 3.2.6.14 rk_cipher_crypt_virt

<!-- Source EN PDF p.37, block 394 -->

```text
RK_RES rk_cipher_crypt_virt(rk_handle handle, const uint8_t *in, uint8_t *out, uint32_t
len);
```

<!-- Source EN PDF p.37, block 395 -->

Функция

<!-- Source EN PDF p.37, block 396 -->

Принимает виртуальный адрес данных и выполняет симметричное шифрование или расшифрование.

<!-- Source EN PDF p.37, block 397 -->

Параметры

<!-- Source EN PDF p.37, block 398 -->

- [in] handle - дескриптор cipher.

<!-- Source EN PDF p.37, block 399 -->

- [in] in - буфер входных данных.

<!-- Source EN PDF p.37, block 400 -->

- [out] out - буфер выходных данных.

<!-- Source EN PDF p.37, block 401 -->

- [in] len - длина входных данных, байт.

<!-- Source EN PDF p.37, block 402 -->

Внимание

<!-- Source EN PDF p.37, block 403 -->

1\. handle должен быть инициализирован вызовом `rk_cipher_init()`.

<!-- Source EN PDF p.37, block 404 -->

2\. Вход и выход могут использовать один буфер.

<!-- Source EN PDF p.37, block 405 -->

3\. После вычисления iv в `rk_cipher_config` обновляется. Повторные вызовы позволяют обрабатывать данные по частям.

<!-- Source EN PDF p.38, block 406 -->

##### 3.2.6.15 rk_cipher_final

<!-- Source EN PDF p.38, block 407 -->

```text
RK_RES rk_cipher_final(rk_handle handle);
```

<!-- Source EN PDF p.38, block 408 -->

Функция

<!-- Source EN PDF p.38, block 409 -->

Завершает вычисление и освобождает дескриптор.

<!-- Source EN PDF p.38, block 410 -->

Параметры

<!-- Source EN PDF p.38, block 411 -->

- [in] handle - дескриптор cipher, предварительно инициализированный `rk_cipher_init()`.

<!-- Source EN PDF p.38, block 412 -->

##### 3.2.6.16 rk_get_random

<!-- Source EN PDF p.38, block 413 -->

```text
RK_RES rk_get_random(uint8_t *data, uint32_t len)
```

<!-- Source EN PDF p.38, block 414 -->

Функция

<!-- Source EN PDF p.38, block 415 -->

Получает из HWRNG случайные данные заданной длины.

<!-- Source EN PDF p.38, block 416 -->

Параметры

<!-- Source EN PDF p.38, block 417 -->

- [out] data - случайные данные.

<!-- Source EN PDF p.38, block 418 -->

- [in] len - требуемая длина случайных данных, байт.

<!-- Source EN PDF p.38, block 419 -->

##### 3.2.6.17 rk_write_oem_otp_key

<!-- Source EN PDF p.38, block 420 -->

```text
RK_RES rk_write_oem_otp_key(enum RK_OEM_OTP_KEYID key_id, uint8_t *key,
                            uint32_t key_len);
```

<!-- Source EN PDF p.38, block 421 -->

Функция

<!-- Source EN PDF p.38, block 422 -->

Записывает незашифрованный ключ в указанную область OEM OTP.

<!-- Source EN PDF p.38, block 423 -->

Особенности OEM OTP описаны в `Rockchip_Developer_Guide_OTP_CN`.

<!-- Source EN PDF p.38, block 424 -->

Параметры

<!-- Source EN PDF p.38, block 425 -->

- [in] key_id - индекс области ключа для записи.

<!-- Source EN PDF p.38, block 426 -->

- [in] key - незашифрованный ключевой материал.

<!-- Source EN PDF p.38, block 427 -->

- [in] key_len - длина незашифрованного ключа, байт.

<!-- Source EN PDF p.38, block 428 -->

Внимание

<!-- Source EN PDF p.38, block 429 -->

1\. По умолчанию поддерживаются четыре ключа `RK_OEM_OTP_KEY0 - 3`. Для RV1126/RV1109 дополнительно поддерживается `RK_OEM_OTP_KEY_FW`, используемый BootROM для расшифрования loader. `rk_oem_otp_key_cipher_virt` позволяет шифровать и расшифровывать прикладные данные этим ключом.

<!-- Source EN PDF p.38, block 430 -->

2\. Для `RK_OEM_OTP_KEY_FW` key_len составляет 16 байт; для остальных ключей поддерживаются 16, 24 и 32 байта.

<!-- Source EN PDF p.39, block 431 -->

##### 3.2.6.18 rk_oem_otp_key_is_written

<!-- Source EN PDF p.39, block 432 -->

```text
RK_RES rk_oem_otp_key_is_written(enum RK_OEM_OTP_KEYID key_id, uint8_t *is_written);
```

<!-- Source EN PDF p.39, block 433 -->

Функция

<!-- Source EN PDF p.39, block 434 -->

Проверяет, записан ли ключ в указанную область OEM OTP. Подробнее см. `Rockchip_Developer_Guide_OTP_CN`.

<!-- Source EN PDF p.39, block 435 -->

Параметры

<!-- Source EN PDF p.39, block 436 -->

- [in] key_id - индекс области ключа для записи.

<!-- Source EN PDF p.39, block 437 -->

- [out] is_written - наличие записанного ключа: 1 — записан, 0 — не записан.

<!-- Source EN PDF p.39, block 438 -->

Возвращаемое значение

<!-- Source EN PDF p.39, block 439 -->

Значение is_written имеет смысл только при возврате `#define RK_CRYPTO_SUCCESS 0x00000000`.

<!-- Source EN PDF p.39, block 441 -->

На RK3588 также проверяется блокировка key_id. Если область заблокирована, возвращается ошибка `#define RK_CRYPTO_ERR_ACCESS_DENIED 0xF0000005`.

<!-- Source EN PDF p.39, block 444 -->

Внимание

<!-- Source EN PDF p.39, block 445 -->

1\. По умолчанию поддерживаются четыре ключа `RK_OEM_OTP_KEY0 - 3`. Для RV1126/RV1109 также поддерживается `RK_OEM_OTP_KEY_FW`.

<!-- Source EN PDF p.39, block 446 -->

##### 3.2.6.19 rk_set_oem_hr_otp_read_lock

<!-- Source EN PDF p.39, block 447 -->

```text
RK_RES rk_set_oem_hr_otp_read_lock(enum RK_OEM_OTP_KEYID key_id);
```

<!-- Source EN PDF p.39, block 448 -->

Функция

<!-- Source EN PDF p.39, block 449 -->

Устанавливает флаг read lock для указанной области OEM OTP. После успешной установки запись в область запрещается, а существующие данные недоступны для чтения программами CPU. Использовать ключ можно через `rk_oem_otp_key_cipher_virt`. Подробнее см. `Rockchip_Developer_Guide_OTP_CN`.

<!-- Source EN PDF p.39, block 450 -->

Параметры

<!-- Source EN PDF p.39, block 451 -->

- [in] key_id - индекс блокируемой области; поддерживаются RK_OEM_OTP_KEY0 - 3.

<!-- Source EN PDF p.39, block 452 -->

##### 3.2.6.20 rk_oem_otp_key_cipher

<!-- Source EN PDF p.39, block 453 -->

```text
RK_RES rk_oem_otp_key_cipher(enum RK_OEM_OTP_KEYID key_id, rk_cipher_config *config,
                             int32_t in_fd, int32_t out_fd, uint32_t len);
```

<!-- Source EN PDF p.39, block 454 -->

Функция

<!-- Source EN PDF p.39, block 455 -->

Выбирает ключ OEM OTP и выполняет однократное вычисление cipher через dma_fd.

<!-- Source EN PDF p.40, block 456 -->

Параметры

<!-- Source EN PDF p.40, block 457 -->

- [in] key_id - индекс используемого ключа otp.

<!-- Source EN PDF p.40, block 458 -->

- [in] config - алгоритм, режим, ключ, iv и другие параметры.

<!-- Source EN PDF p.40, block 459 -->

- [in] in_fd - dma_fd входных данных; может совпадать с выходом.

<!-- Source EN PDF p.40, block 460 -->

- [out] out_fd - dma_fd выходных данных.

<!-- Source EN PDF p.40, block 461 -->

- [in] len - длина входных данных, байт.

<!-- Source EN PDF p.40, block 462 -->

Внимание

<!-- Source EN PDF p.40, block 463 -->

1\. По умолчанию поддерживаются RK_OEM_OTP_KEY0 - 3; для RV1126/RV1109 дополнительно поддерживается RK_OEM_OTP_KEY_FW.

<!-- Source EN PDF p.40, block 464 -->

2\. Поддерживаются AES/SM4 и режимы ECB/CBC/CTS/CTR/CFB/OFB.

<!-- Source EN PDF p.40, block 465 -->

3\. Длина ключа — 16, 24 или 32 байта. Для RV1109/RV1126 — 16 или 32 байта. При key_id, равном RK_OEM_OTP_KEY_FW, длина составляет 16 байт.

<!-- Source EN PDF p.40, block 466 -->

4\. in_fd и out_fd могут совпадать.

<!-- Source EN PDF p.40, block 467 -->

##### 3.2.6.21 rk_oem_otp_key_cipher_virt

<!-- Source EN PDF p.40, block 468 -->

```text
RK_RES rk_oem_otp_key_cipher_virt(enum RK_OEM_OTP_KEYID key_id, rk_cipher_config *config,
                                  uint8_t *src, uint8_t *dst, uint32_t len);
```

<!-- Source EN PDF p.40, block 469 -->

Функция

<!-- Source EN PDF p.40, block 470 -->

Выбирает ключ OEM OTP и выполняет однократное вычисление cipher с виртуальными адресами.

<!-- Source EN PDF p.40, block 471 -->

Параметры

<!-- Source EN PDF p.40, block 472 -->

- [in] key_id - индекс используемого ключа otp.

<!-- Source EN PDF p.40, block 473 -->

- [in] config - алгоритм, режим, ключ, iv и другие параметры.

<!-- Source EN PDF p.40, block 474 -->

- [in] src - буфер входных данных.

<!-- Source EN PDF p.40, block 475 -->

- [out] dst - буфер выходных данных.

<!-- Source EN PDF p.40, block 476 -->

- [in] len - длина входных данных, байт.

<!-- Source EN PDF p.40, block 477 -->

Внимание

<!-- Source EN PDF p.40, block 478 -->

1\. По умолчанию поддерживаются RK_OEM_OTP_KEY0 - 3; для RV1126/RV1109 дополнительно поддерживается RK_OEM_OTP_KEY_FW.

<!-- Source EN PDF p.40, block 479 -->

2\. Поддерживаются AES/SM4 и режимы ECB/CBC/CTS/CTR/CFB/OFB.

<!-- Source EN PDF p.40, block 480 -->

3\. Длина ключа — 16, 24 или 32 байта. Для RV1109/RV1126 — 16 или 32 байта. При key_id, равном RK_OEM_OTP_KEY_FW, длина составляет 16 байт.

<!-- Source EN PDF p.40, block 481 -->

4\. in_fd и out_fd могут совпадать.

<!-- Source EN PDF p.40, block 482 -->

5\. По умолчанию максимальная длина len входного и выходного буферов — 1MB. Для RV1126/RV1109 — 500KB.

<!-- Source EN PDF p.41, block 483 -->

##### 3.2.6.22 rk_ae_init

<!-- Source EN PDF p.41, block 484 -->

Функция


> В исходнике здесь отсутствует прототип rk_ae_init; предполагаемое объявление не добавляется.



<!-- Source EN PDF p.41, block 485 -->

Инициализирует алгоритм AEAD. Поддерживаются AES/SM4; в настоящее время доступен только GCM.

<!-- Source EN PDF p.41, block 486 -->

Параметры

<!-- Source EN PDF p.41, block 487 -->

- [in] config - алгоритм, режим, ключ, iv, длина aad, длина tag и другие параметры, см. `rk_ae_config`.

<!-- Source EN PDF p.41, block 488 -->

- [out] handle - дескриптор AEAD.

<!-- Source EN PDF p.41, block 489 -->

Внимание

<!-- Source EN PDF p.41, block 490 -->

После успешной инициализации обязательно вызовите `rk_ae_final()` для освобождения ресурсов независимо от результата дальнейшего выполнения.

<!-- Source EN PDF p.41, block 491 -->

##### 3.2.6.23 rk_ae_set_aad

<!-- Source EN PDF p.41, block 492 -->

```text
RK_RES rk_ae_set_aad(rk_handle handle, int aad_fd);
```

<!-- Source EN PDF p.41, block 493 -->

Функция

<!-- Source EN PDF p.41, block 494 -->

Принимает dma_fd данных и задаёт параметры aad.

<!-- Source EN PDF p.41, block 495 -->

Параметры

<!-- Source EN PDF p.41, block 496 -->

- [in] handle - дескриптор cipher.

<!-- Source EN PDF p.41, block 497 -->

- [in] aad_fd - dma_fd данных aad.

<!-- Source EN PDF p.41, block 498 -->

Внимание

<!-- Source EN PDF p.41, block 499 -->

1\. handle должен быть инициализирован вызовом `rk_ae_init()`.

<!-- Source EN PDF p.41, block 500 -->

2\. После одного `rk_ae_init` функция `rk_ae_set_aad` может быть вызвана только один раз. Обновление AAD несколькими частями не поддерживается: повторные вызовы перезаписывают содержимое AAD.

<!-- Source EN PDF p.41, block 501 -->

##### 3.2.6.24 rk_ae_set_aad_virt

<!-- Source EN PDF p.41, block 502 -->

```text
RK_RES rk_ae_set_aad_virt(rk_handle handle, uint8_t *aad_virt);
```

<!-- Source EN PDF p.41, block 503 -->

Функция

<!-- Source EN PDF p.41, block 504 -->

Принимает виртуальный адрес и задаёт данные AAD.

<!-- Source EN PDF p.41, block 505 -->

Параметры

<!-- Source EN PDF p.41, block 506 -->

- [in] handle - дескриптор cipher.

<!-- Source EN PDF p.41, block 507 -->

- [in] in - буфер данных aad.

<!-- Source EN PDF p.41, block 508 -->

Внимание

<!-- Source EN PDF p.41, block 509 -->

1\. handle должен быть инициализирован вызовом `rk_ae_init()`.

<!-- Source EN PDF p.42, block 510 -->

2\. После одного `rk_ae_init` функция `rk_ae_set_aad_virt` может быть вызвана только один раз. Обновление AAD несколькими частями не поддерживается: повторные вызовы перезаписывают содержимое AAD.

<!-- Source EN PDF p.42, block 511 -->

##### 3.2.6.25 rk_ae_crypt

<!-- Source EN PDF p.42, block 512 -->

```text
RK_RES rk_ae_crypt(rk_handle handle, int in_fd, int out_fd, uint32_t len, uint8_t *tag);
```

<!-- Source EN PDF p.42, block 513 -->

Функция

<!-- Source EN PDF p.42, block 514 -->

Принимает dma_fd данных и выполняет шифрование/расшифрование AEAD, а также вычисление/проверку тега.

<!-- Source EN PDF p.42, block 515 -->

Параметры

<!-- Source EN PDF p.42, block 516 -->

- [in] handle - дескриптор ae.

<!-- Source EN PDF p.42, block 517 -->

- [in] in_fd - dma_fd входных данных.

<!-- Source EN PDF p.42, block 518 -->

- [out] out_fd - dma_fd выходных данных.

<!-- Source EN PDF p.42, block 519 -->

- [in] len - длина входных данных, байт.

<!-- Source EN PDF p.42, block 520 -->

- [in/out] tag - английский исходник указывает вход при шифровании и выход при расшифровании. Это противоречит китайскому исходнику; см. редакционное замечание ниже.


> Противоречие источников: китайский документ задаёт tag как выход при шифровании и вход при расшифровании; английский — наоборот. Обе версии явно сохранены; поведение необходимо проверить по соответствующему SDK.



<!-- Source EN PDF p.42, block 521 -->

Внимание

<!-- Source EN PDF p.42, block 522 -->

1\. handle должен быть инициализирован вызовом `rk_ae_init()`.

<!-- Source EN PDF p.42, block 523 -->

2\. in_fd и out_fd могут быть одним и тем же dma_fd.

<!-- Source EN PDF p.42, block 524 -->

3\. Обработка несколькими последовательными вызовами не поддерживается.

<!-- Source EN PDF p.42, block 525 -->

##### 3.2.6.26 rk_ae_crypt_virt

<!-- Source EN PDF p.42, block 526 -->

```text
RK_RES rk_ae_crypt_virt(rk_handle handle, const uint8_t *in, uint8_t *out, uint32_t len,
uint8_t *tag);
```

<!-- Source EN PDF p.42, block 527 -->

Функция

<!-- Source EN PDF p.42, block 528 -->

Выполняет шифрование/расшифрование AEAD для данных по виртуальному адресу.

<!-- Source EN PDF p.42, block 529 -->

Параметры

<!-- Source EN PDF p.42, block 530 -->

- [in] handle - дескриптор ae.

<!-- Source EN PDF p.42, block 531 -->

- [in] in - входной буфер.

<!-- Source EN PDF p.42, block 532 -->

- [out] out - выходной буфер.

<!-- Source EN PDF p.42, block 533 -->

- [in] len - длина входных данных, байт.

<!-- Source EN PDF p.42, block 534 -->

- [in/out] tag - английский исходник указывает вход при шифровании и выход при расшифровании. Это противоречит китайскому исходнику; см. редакционное замечание ниже.


> Противоречие источников: китайский документ задаёт tag как выход при шифровании и вход при расшифровании; английский — наоборот. Обе версии явно сохранены; поведение необходимо проверить по соответствующему SDK.



<!-- Source EN PDF p.42, block 535 -->

Внимание

<!-- Source EN PDF p.42, block 536 -->

1\. handle должен быть инициализирован вызовом `rk_ae_init()`.

<!-- Source EN PDF p.42, block 537 -->

2\. Вход и выход могут использовать один буфер.

<!-- Source EN PDF p.43, block 538 -->

3\. Обработка несколькими последовательными вызовами не поддерживается.

<!-- Source EN PDF p.43, block 539 -->

##### 3.2.6.27 rk_ae_final

<!-- Source EN PDF p.43, block 540 -->

```text
RK_RES rk_ae_final(rk_handle handle);
```

<!-- Source EN PDF p.43, block 541 -->

Функция

<!-- Source EN PDF p.43, block 542 -->

Завершает вычисление и освобождает дескриптор.

<!-- Source EN PDF p.43, block 543 -->

Параметры

<!-- Source EN PDF p.43, block 544 -->

- [in] handle - дескриптор AE, предварительно инициализированный `rk_ae_init()`.

<!-- Source EN PDF p.43, block 545 -->

##### 3.2.6.28 rk_rsa_pub_encrypt

<!-- Source EN PDF p.43, block 546 -->

```text
RK_RES rk_rsa_pub_encrypt(const rk_rsa_pub_key_pack *pub, enum RK_RSA_CRYPT_PADDING padding,
const uint8_t *in, uint32_t in_len, uint8_t *out, uint32_t *out_len);
```

<!-- Source EN PDF p.43, block 547 -->

Функция

<!-- Source EN PDF p.43, block 548 -->

Шифрует данные открытым ключом с поддержкой заполнения (padding).

<!-- Source EN PDF p.43, block 549 -->

Параметры

<!-- Source EN PDF p.43, block 550 -->

- [in] pub - сведения об открытом ключе RSA, см. `rk_rsa_pub_key_pack`.

<!-- Source EN PDF p.43, block 551 -->

- [in] padding - формат заполнения при шифровании, см. `RK_RSA_CRYPT_PADDING`.

<!-- Source EN PDF p.43, block 552 -->

- [in] in - входные данные.

<!-- Source EN PDF p.43, block 553 -->

- [in] in_len - длина входных данных, байт. Слишком большой вход приводит к ошибке `RK_CRYPTO_ERR_PADDING_OVERFLOW`.

<!-- Source EN PDF p.43, block 554 -->

- [out] out - данные, зашифрованные открытым ключом.

<!-- Source EN PDF p.43, block 555 -->

- [out] out_len - длина зашифрованных данных.

<!-- Source EN PDF p.43, block 556 -->

Внимание

<!-- Source EN PDF p.43, block 557 -->

1\. В открытом ключе необходимо правильно указать, передаётся ли незашифрованный ключевой материал или материал, зашифрованный OTP KEY. Это влияет на разбор ключа.

<!-- Source EN PDF p.43, block 558 -->

2\. Шифрование и расшифрование на месте не рекомендуется.

<!-- Source EN PDF p.43, block 559 -->

##### 3.2.6.29 rk_rsa_priv_decrypt

<!-- Source EN PDF p.43, block 560 -->

```text
RK_RES rk_rsa_priv_decrypt(const rk_rsa_priv_key_pack *priv, enum RK_RSA_CRYPT_PADDING
padding, const uint8_t *in, uint32_t in_len, uint8_t *out, uint32_t *out_len);
```

<!-- Source EN PDF p.43, block 561 -->

Функция

<!-- Source EN PDF p.43, block 562 -->

Расшифровывает данные закрытым ключом с разбором заполнения (padding).

<!-- Source EN PDF p.44, block 563 -->

Параметры

<!-- Source EN PDF p.44, block 564 -->

- [in] priv - сведения о закрытом ключе RSA, см. `rk_rsa_priv_key_pack`.

<!-- Source EN PDF p.44, block 565 -->

- [in] padding - формат заполнения, совпадающий с применённым при шифровании; см. `RK_RSA_CRYPT_PADDING`.

<!-- Source EN PDF p.44, block 566 -->

- [in] in - входные данные.

<!-- Source EN PDF p.44, block 567 -->

- [in] in_len - длина входных данных, байт.

<!-- Source EN PDF p.44, block 568 -->

- [out] out - данные, расшифрованные закрытым ключом.

<!-- Source EN PDF p.44, block 569 -->

- [out] out_len - длина расшифрованных данных.

<!-- Source EN PDF p.44, block 570 -->

Внимание

<!-- Source EN PDF p.44, block 571 -->

1\. В закрытом ключе необходимо правильно указать, передаётся ли незашифрованный ключевой материал или материал, зашифрованный OTP KEY. Это влияет на разбор ключа.

<!-- Source EN PDF p.44, block 572 -->

2\. Шифрование и расшифрование на месте не рекомендуется.

<!-- Source EN PDF p.44, block 573 -->

##### 3.2.6.30 rk_rsa_priv_encrypt

<!-- Source EN PDF p.44, block 574 -->

```text
RK_RES rk_rsa_priv_encrypt(const rk_rsa_priv_key_pack *priv, enum RK_RSA_CRYPT_PADDING
padding, const uint8_t *in, uint32_t in_len, uint8_t *out, uint32_t *out_len);
```

<!-- Source EN PDF p.44, block 575 -->

Функция

<!-- Source EN PDF p.44, block 576 -->

Шифрует данные закрытым ключом с поддержкой заполнения (padding).

<!-- Source EN PDF p.44, block 577 -->

Параметры

<!-- Source EN PDF p.44, block 578 -->

- [in] priv - сведения о закрытом ключе RSA, см. `rk_rsa_priv_key_pack`.

<!-- Source EN PDF p.44, block 579 -->

- [in] padding - формат заполнения при шифровании, см. `RK_RSA_CRYPT_PADDING`.

<!-- Source EN PDF p.44, block 580 -->

- [in] in - входные данные.

<!-- Source EN PDF p.44, block 581 -->

- [in] in_len - длина входных данных, байт. Слишком большой вход приводит к ошибке `RK_CRYPTO_ERR_PADDING_OVERFLOW`.

<!-- Source EN PDF p.44, block 582 -->

- [out] out - данные, зашифрованные закрытым ключом.

<!-- Source EN PDF p.44, block 583 -->

- [out] out_len - длина зашифрованных данных.

<!-- Source EN PDF p.44, block 584 -->

Внимание

<!-- Source EN PDF p.44, block 585 -->

1\. В закрытом ключе необходимо правильно указать, передаётся ли незашифрованный ключевой материал или материал, зашифрованный OTP KEY. Это влияет на разбор ключа.

<!-- Source EN PDF p.44, block 586 -->

2\. Шифрование и расшифрование на месте не рекомендуется.

<!-- Source EN PDF p.44, block 587 -->

##### 3.2.6.31 rk_rsa_pub_decrypt

<!-- Source EN PDF p.44, block 588 -->

```text
RK_RES rk_rsa_pub_decrypt(const rk_rsa_pub_key_pack *pub, enum RK_RSA_CRYPT_PADDING padding,
const uint8_t *in, uint32_t in_len, uint8_t *out, uint32_t *out_len);
```

<!-- Source EN PDF p.45, block 589 -->

Функция

<!-- Source EN PDF p.45, block 590 -->

Расшифровывает данные открытым ключом с разбором заполнения (padding).

<!-- Source EN PDF p.45, block 591 -->

Параметры

<!-- Source EN PDF p.45, block 592 -->

- [in] pub - сведения об открытом ключе RSA, см. `rk_rsa_pub_key_pack`.

<!-- Source EN PDF p.45, block 593 -->

- [in] padding - формат заполнения, совпадающий с применённым при шифровании; см. `RK_RSA_CRYPT_PADDING`.

<!-- Source EN PDF p.45, block 594 -->

- [in] in - входные данные.

<!-- Source EN PDF p.45, block 595 -->

- [in] in_len - длина входных данных, байт.

<!-- Source EN PDF p.45, block 596 -->

- [out] out - данные, расшифрованные открытым ключом.

<!-- Source EN PDF p.45, block 597 -->

- [out] out_len - длина расшифрованных данных.

<!-- Source EN PDF p.45, block 598 -->

Внимание

<!-- Source EN PDF p.45, block 599 -->

1\. В открытом ключе необходимо правильно указать, передаётся ли незашифрованный ключевой материал или материал, зашифрованный OTP KEY. Это влияет на разбор ключа.

<!-- Source EN PDF p.45, block 600 -->

2\. Шифрование и расшифрование на месте не рекомендуется.

<!-- Source EN PDF p.45, block 601 -->

##### 3.2.6.32 rk_rsa_sign

<!-- Source EN PDF p.45, block 602 -->

```text
RK_RES rk_rsa_sign(const rk_rsa_priv_key_pack *priv, enum RK_RSA_SIGN_PADDING padding, const
uint8_t *in, uint32_t in_len, const uint8_t *hash, uint8_t *out, uint32_t *out_len);
```

<!-- Source EN PDF p.45, block 603 -->

Функция

<!-- Source EN PDF p.45, block 604 -->

Вычисляет хеш входных данных либо использует переданный хеш и подписывает его закрытым ключом.

<!-- Source EN PDF p.45, block 605 -->

Параметры

<!-- Source EN PDF p.45, block 606 -->

- [in] priv - сведения о закрытом ключе RSA, см. `rk_rsa_priv_key_pack`.

<!-- Source EN PDF p.45, block 607 -->

- [in] padding - формат заполнения подписи, см. `RK_RSA_SIGN_PADDING`.

<!-- Source EN PDF p.45, block 608 -->

- [in] in - исходные данные: сначала вычисляется хеш, затем выполняется подпись закрытым ключом; параметр необязателен.

<!-- Source EN PDF p.45, block 609 -->

- [in] in_len - длина входных данных, байт.

<!-- Source EN PDF p.45, block 610 -->

- [in] hash - необязательное значение хеша. Длина определяется алгоритмом заполнения; хеш может быть непосредственно подписан закрытым ключом.

<!-- Source EN PDF p.45, block 611 -->

- [out] out - подпись, полученная закрытым ключом.

<!-- Source EN PDF p.45, block 612 -->

- [out] out_len - длина подписи.

<!-- Source EN PDF p.45, block 613 -->

Внимание

<!-- Source EN PDF p.45, block 614 -->

1\. В закрытом ключе необходимо правильно указать, передаётся ли незашифрованный ключевой материал или материал, зашифрованный OTP KEY. Это влияет на разбор ключа.

<!-- Source EN PDF p.45, block 615 -->

2\. При `in != NULL && hash == NULL` интерфейс сначала вычисляет хеш входных данных (алгоритм задаётся форматом padding), затем заполняет и подписывает хеш.

<!-- Source EN PDF p.46, block 616 -->

3\. При `hash != NULL` интерфейс непосредственно выполняет заполнение переданного хеша.

<!-- Source EN PDF p.46, block 617 -->

##### 3.2.6.33 rk_rsa_verify

<!-- Source EN PDF p.46, block 618 -->

```text
RK_RES rk_rsa_verify(const rk_rsa_pub_key_pack *pub, enum RK_RSA_SIGN_PADDING padding, const
uint8_t *in, uint32_t in_len, const uint8_t *hash, uint8_t *sign, uint32_t sign_len);
```

<!-- Source EN PDF p.46, block 619 -->

Функция

<!-- Source EN PDF p.46, block 620 -->

Проверяет подпись открытым ключом.

<!-- Source EN PDF p.46, block 621 -->

Параметры

<!-- Source EN PDF p.46, block 622 -->

- [in] pub - сведения об открытом ключе RSA, см. `rk_rsa_pub_key_pack`.

<!-- Source EN PDF p.46, block 623 -->

- [in] padding - формат заполнения, совпадающий с применённым при подписании; см. `RK_RSA_SIGN_PADDING`.

<!-- Source EN PDF p.46, block 624 -->

- [in] in - исходные данные: сначала вычисляется хеш, затем выполняется подпись закрытым ключом; параметр необязателен.

<!-- Source EN PDF p.46, block 625 -->

- [in] in_len - длина входных данных, байт.

<!-- Source EN PDF p.46, block 626 -->

- [in] hash - необязательное значение хеша.

<!-- Source EN PDF p.46, block 627 -->

- [in] sign - данные подписи.

<!-- Source EN PDF p.46, block 628 -->

- [in] sign_len - длина подписи, байт.

<!-- Source EN PDF p.46, block 629 -->

Внимание

<!-- Source EN PDF p.46, block 630 -->

1\. В открытом ключе необходимо правильно указать, передаётся ли незашифрованный ключевой материал или материал, зашифрованный OTP KEY. Это влияет на разбор ключа.

<!-- Source EN PDF p.46, block 631 -->

2\. При `in != NULL && hash == NULL` интерфейс сначала вычисляет хеш данных in (алгоритм задаётся форматом padding), затем выполняет проверку подписи хеша с этим заполнением.

<!-- Source EN PDF p.46, block 632 -->

3\. При `hash != NULL` интерфейс непосредственно выполняет заполнение переданного хеша.

<!-- Source EN PDF p.46, block 633 -->

##### 3.2.6.34 rk_ec_verify

<!-- Source EN PDF p.46, block 634 -->

```text
RK_RES rk_ec_verify(const rk_ec_pub_key_pack *pub, int hash_algo,
            const uint8_t *in, uint32_t in_len, const uint8_t *hash,
            uint8_t *sign, uint32_t sign_len);
```

<!-- Source EN PDF p.46, block 635 -->

Функция

<!-- Source EN PDF p.46, block 636 -->

Проверяет подпись ECC/SM2 открытым ключом.

<!-- Source EN PDF p.46, block 637 -->

Параметры

<!-- Source EN PDF p.46, block 638 -->

- [in] pub - открытый ключ ECC/SM2, см. `rk_ec_pub_key_pack`.

<!-- Source EN PDF p.46, block 639 -->

- [in] hash_algo - алгоритм хеширования подписи; должен совпадать с использованным при подписании.

<!-- Source EN PDF p.46, block 640 -->

- [in] in - исходные данные: сначала вычисляется хеш, затем выполняется подпись закрытым ключом; параметр необязателен.

<!-- Source EN PDF p.46, block 641 -->

- [in] in_len - длина входных данных, байт.

<!-- Source EN PDF p.46, block 642 -->

- [in] hash - необязательное значение хеша.

<!-- Source EN PDF p.47, block 643 -->

- [in] sign - данные подписи.

<!-- Source EN PDF p.47, block 644 -->

- [in] sign_len - длина подписи, байт.

<!-- Source EN PDF p.47, block 645 -->

Внимание

<!-- Source EN PDF p.47, block 646 -->

1\. В открытом ключе необходимо правильно указать, передаётся ли незашифрованный ключевой материал или материал, зашифрованный OTP KEY. Это влияет на разбор ключа.

<!-- Source EN PDF p.47, block 647 -->

2\. При `in != NULL && hash == NULL` интерфейс сначала вычисляет хеш данных in (алгоритм задаётся hash_algo), затем выполняет проверку подписи хеша.

<!-- Source EN PDF p.47, block 648 -->

3\. При `hash != NULL` интерфейс непосредственно выполняет заполнение переданного хеша.

<!-- Source EN PDF p.47, block 649 -->

#### 3.2.7 Отладочный журнал

<!-- Source EN PDF p.47, block 650 -->

В librkcrypto предусмотрены следующие уровни журнала:

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

По умолчанию используется TRACE_INFO. Уровень можно изменить переменной окружения, установленной до загрузки библиотеки librkcrypto, либо интерфейсом `rkcrypto_set_trace_level` до вызова `rk_crypto_init`.

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

## 4. Производительность аппаратного Crypto

<!-- Source EN PDF p.47, block 658 -->

Ниже приведены исходные результаты для типичных SoC в U-Boot. Подробные результаты находятся в каталоге `perf_reports` исходного кода librkcrypto. Там приложение вызывает драйвер ядра при фиксированных максимальных частотах CPU/DDR. Из-за системных вызовов производительность несколько ниже, чем в тестах U-Boot. Это измерения исходного документа, а не ArmSoM.

<!-- Source EN PDF p.48, block 659 -->

### 4.1 Факторы, влияющие на производительность

<!-- Source EN PDF p.48, block 660 -->

1\. Важны физическая непрерывность пользовательских данных и выравнивание начального адреса по 64 байтам. В CRYPTO IP нет MMU, поэтому он обрабатывает только непрерывную память с требуемым выравниванием. Если данные по виртуальному адресу virt не удовлетворяют этим условиям, драйвер может разделить один запрос приложения на несколько аппаратных вычислений, копируя данные во внутренний физически непрерывный буфер 32KByte. Это снижает производительность.

<!-- Source EN PDF p.48, block 661 -->

2\. Размер блока одного вычисления: чем он больше, тем ближе результат к теоретическому. Кроме самого вычисления драйвер тратит время на вызовы ядра, очереди задач, обслуживание кеша и другие операции. Эти накладные расходы относительно постоянны; при малых блоках их доля растёт и производительность резко снижается.

<!-- Source EN PDF p.48, block 662 -->

Влияние размера блока показано на примере теста librkcrypto для RK3588:

<!-- Source EN PDF p.48, block 663 -->

![Технический рисунок из исходника — PDF 48](/docs/rockchip-crypto-hwrng/assets/en-p48-figure1.png)

| Блок (Byte) | virt (kB/s) | dma_fd (kB/s) |
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

По данным рисунка, хороший результат даёт блок 1MByte и физически непрерывная память dma fd. Для небольших объёмов, например 64KByte и меньше, исходник рекомендует программные алгоритмы вместо аппаратного CRYPTO. Некоторые SoC ускоряют шифрование набором инструкций NEON/CE.

<!-- Source EN PDF p.49, block 665 -->

### 4.2 Производительность аппаратного Crypto в U-Boot

<!-- Source EN PDF p.49, block 666 -->

#### 4.2.1 Производительность Crypto V1

<!-- Source EN PDF p.49, block 667 -->

Условия исходного теста: U-Boot, RK3399.

<!-- Source EN PDF p.49, block 668 -->

Частота CRYPTO_CORE = 200M. Максимальная частота несколько различается между SoC.

<!-- Source EN PDF p.49, block 669 -->

Производительность CIPHER/HASH:

<!-- Source EN PDF p.49, block 670 -->

| Алгоритм | Измерено в исходнике (MBps) | Теоретически (MBps) |
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

Производительность RSA:

<!-- Source EN PDF p.49, block 672 -->

| Длина ключа RSA (бит) | Шифрование открытым / расшифрование закрытым ключом (ms) |
|---|---|
| 2048 | 8 / 632 |

<!-- Source EN PDF p.49, block 673 -->

#### 4.2.2 Производительность Crypto V2/V3/V4

<!-- Source EN PDF p.49, block 674 -->

Вычислительное ядро этих версий CRYPTO IP существенно не менялось. Разница определяется рабочей частотой; по английскому исходнику частота V3/V4 достигает 350M. Теоретические показатели можно пересчитать относительно V2.

<!-- Source EN PDF p.49, block 675 -->

Условия исходного теста: U-Boot, RV1126 V2.

<!-- Source EN PDF p.49, block 676 -->

Частоты: CRYPTO_CORE = 200M, CRYPTO_PKA=300M, DDR=786M.

<!-- Source EN PDF p.49, block 677 -->

Hash/HMAC: всего 128M данных, по 4M за одно вычисление.

<!-- Source EN PDF p.49, block 678 -->

DES/3DES/AES/SM4: всего 128M данных; за один вызов — 4M открытого текста и 4M aad.

<!-- Source EN PDF p.50, block 679 -->

![Технический рисунок из исходника — PDF 50](/docs/rockchip-crypto-hwrng/assets/en-p50-figure1.png)

| Алгоритм | Режим | Измерено в исходнике (MBps) | Теоретически (MBps) |
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

Тест RSA: создаются ключи n, e, d, затем выполняются шифрование открытым ключом и расшифрование закрытым ключом.

<!-- Source EN PDF p.50, block 681 -->

Шифрование открытым ключом: `ciphertext = d ^e % n`.

<!-- Source EN PDF p.50, block 682 -->

Расшифрование закрытым ключом: `plaintext = d^d % n`.

<!-- Source EN PDF p.50, block 683 -->

![Технический рисунок из исходника — PDF 50](/docs/rockchip-crypto-hwrng/assets/en-p50-figure2.png)

| RSA | Операция | Время исходного теста (ms) |
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

## 5. Частые вопросы

<!-- Source EN PDF p.51, block 685 -->

### 5.1 Что означают последовательный и параллельный режимы в теоретических показателях? Может ли пользователь их выбирать?

<!-- Source EN PDF p.51, block 686 -->

Ответ: шифрование и расшифрование OFB, CCM, GCM, CBC_MAC, CMAC, BYPASS, а также шифрование CFB, CBC, CTS выполняются последовательно. Шифрование и расшифрование ECB, CTR, XTS, а также расшифрование CFB, CBC, CTS выполняются параллельно.

<!-- Source EN PDF p.51, block 687 -->

Аппаратный CRYPTO имеет четыре вычислительных ядра и автоматически выбирает последовательное или параллельное выполнение по режиму алгоритма. Пользователь не вмешивается в этот процесс; дополнительных действий не требуется. Выбор параллельного режима алгоритма повышает эффективность. Исходник рекомендует CTR с точки зрения безопасности и использования, поскольку оба направления работают параллельно. Это рекомендация исходника, а не универсальная оценка безопасности протокола.

<!-- Source EN PDF p.51, block 688 -->

### 5.2 Почему показатели perf_reports сильно отличаются от теоретических?

<!-- Source EN PDF p.51, block 689 -->

Ответ: теоретические значения выводятся из частоты CRYPTO IP и числа циклов вычислительного блока без учёта остальных затрат. В реальной работе добавляются следующие расходы:

<!-- Source EN PDF p.51, block 690 -->

1\. Системный вызов ядра: переход в ядро и возврат после выполнения занимают время.

<!-- Source EN PDF p.51, block 691 -->

2\. Передача данных требует времени; если память физически не является непрерывной, драйверу также необходимо упорядочить и скопировать данные. Эти затраты зависят от частоты CPU.

<!-- Source EN PDF p.51, block 692 -->

3\. Размер блока. Аппаратный CRYPTO перемещает и вычисляет данные через DMA: большой блок приближает производительность к теоретической, но размер ограничен системой. В тестовом примере используется 1MByte.

<!-- Source EN PDF p.51, block 693 -->

4\. Обслуживание кеша в драйвере ядра для обеспечения его согласованности.

<!-- Source EN PDF p.51, block 694 -->

5\. Накладные расходы драйвера и планировщика: например, поступающие параллельные запросы пользователей сериализуются для аппаратного выполнения. Здесь последовательность запросов не равнозначна последовательному или параллельному режиму самого алгоритма.

<!-- Source EN PDF p.51, block 695 -->

### 5.3 Почему теоретическая разница составляет четыре раза, а фактическая меньше?

<!-- Source EN PDF p.51, block 696 -->

Ответ: расходы из §5.2 примерно одинаковы в обоих режимах. Если инфраструктура занимает фиксированные 10ms, а последовательное аппаратное вычисление — 90ms, полезная доля составляет 90%. Если параллельное вычисление занимает 20ms, полезная доля составляет лишь 66%, как округлено в исходнике.

<!-- Source EN PDF p.52, block 697 -->

Только когда дополнительные расходы инфраструктуры стремятся к 0, отношение фактической производительности последовательного и параллельного режимов приближается к теоретическому 1:4.

<!-- Source EN PDF p.52, block 698 -->

## 6. Справочные материалы

<!-- Source EN PDF p.52, block 699 -->

## 7. Приложение

<!-- Source EN PDF p.52, block 700 -->

### 7.1 Термины



> В главах 6 и 7 и §7.1 исходника есть только заголовки; на последней странице нет последующего текста. Пустые разделы отмечены явно.


{% endraw %}
