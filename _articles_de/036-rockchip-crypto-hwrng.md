---
title: "Rockchip Crypto und HWRNG: Treiber, librkcrypto-API und Leistung"
description: "Vollständige Referenz für Rockchip Crypto V1/V2/V3/V4/CE und HWRNG: Kernelkonfiguration, DTS, librkcrypto-Strukturen und APIs sowie Leistungstests und Einschränkungen der Quelle."
translation_key: "036-rockchip-crypto-hwrng"
slug: "036-rockchip-crypto-hwrng"
lang: "de"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["Crypto", "HWRNG", "librkcrypto", "RK3588", "RK3576"]
keywords: "ArmSoM Rockchip Crypto HWRNG librkcrypto RK3588 RK3576"
excerpt: "Vollständige Referenz für Rockchip Crypto V1/V2/V3/V4/CE und HWRNG: Kernelkonfiguration, DTS, librkcrypto-Strukturen und APIs sowie Leistungstests und Einschränkungen der Quelle."
---

{% raw %}

# Rockchip Crypto und HWRNG: Treiber, librkcrypto-API und Leistung

Dies ist eine aus der Rockchip-Dokumentation V1.4.2 abgeleitete Plattformreferenz, kein Bericht über eine ArmSoM-Hardwarevalidierung und keine Zusage der Unterstützung auf jedem Board. Die Quelle behandelt unter anderem die SoCs RK3588 und RK3576. Prüfen Sie das konkrete ArmSoM-Board, den SDK-/BSP-Zweig, die Kernelkonfiguration, die Verfügbarkeit von TEE/OTP und die Algorithmusauswahl. Die Quelle nennt Commit-Abhängigkeiten für Kernel 4.19/5.10/6.1; diese Kombinationen sind nicht austauschbar. Die boardspezifische Anpassung ist weiterhin unbestätigt.

Der chinesische Artikel folgt dem 49-seitigen chinesischen PDF; der englische Artikel folgt dem 52-seitigen englischen PDF, und die russische sowie diese deutsche Fassung übersetzen den englischen Text. Beide Quellen tragen V1.4.2, lokale Unterschiede sind jedoch im Text und in den [Redaktionsnotizen](/docs/rockchip-crypto-hwrng/EDITORIAL-NOTES.md) gekennzeichnet. Alle technischen Kapitel, Beispiele, Parameter und Abbildungen bleiben erhalten. Deckblattdatum, Vertraulichkeitsstufe, Rechts- und Kontaktangaben, Zielgruppe und Änderungsverlauf wurden ausgelassen. Originale Codekommentare bleiben unverändert.

**Betriebsrisiko:** OTP-Schreibvorgänge und Lesesperren können unumkehrbar sein und andere OTP-Bereiche beeinflussen. Die API-Beispiele sind ausschließlich Quellenmaterial; es wurden keine Programmierungs-, Sperr- oder Kryptotests ausgeführt. Prüfen Sie zuerst das genaue SoC-TRM, die OTP-/TEE-Leitfäden und die SDK-Implementierung. Alle Leistungswerte sind Rockchip-Quellbeispiele, keine ArmSoM-Messungen. Offizielle Plattformressourcen: [ArmSoM-Dokumentation](https://docs.armsom.org/), [Rockchip Linux](https://github.com/rockchip-linux).

Aus dem Vorwort übernommener technischer Umfang: Entwicklung der Rockchip-Crypto- und HWRNG(TRNG)-Treiber sowie übergeordneter Anwendungen. Die folgende Produktversionstabelle stammt aus der Quelle und garantiert keine Kompatibilität mit ArmSoM-Boards.

| Chipsatzname | Kernelversion |
|---|---|
| Alle Rockchip-Chips mit Crypto-IP | Linux 4.19 |
| Alle Rockchip-Chips mit Crypto-IP | Linux 5.10 |
| Alle Rockchip-Chips mit Crypto-IP | Linux 6.1 |

<!-- Source EN PDF p.7, block 0 -->

## 1. Übersicht

<!-- Source EN PDF p.7, block 1 -->

CRYPTO: Auf der RK-Plattform gibt es derzeit fünf Versionen der CRYPTO-IP: CRYPTO V1/V2/V3/V4/CE. V1 ist eine ältere IP mit weniger unterstützten Algorithmen und Funktionen. Deshalb wurde der IP-Kern von CRYPTO V2 neu entwickelt; auf dieser Grundlage folgten funktionale Erweiterungen und Aktualisierungen. V2/V3/V4 sind hinsichtlich der grundlegenden Funktionen kompatibel. V3 ergänzt V2 um die Unterstützung für Thread-Umschaltung; V4 ermöglicht auf Grundlage von V3 die Wiederverwendung des CRYPTO-IP-Kerns und reduziert die benötigte Chipfläche.

<!-- Source EN PDF p.7, block 2 -->

RKCE verwendet den ursprünglichen Rechenkern, gestaltet jedoch Register und Aufrufverfahren neu. Der Treiber ist vollständig inkompatibel mit V2/V3/V4 und wurde neu geschrieben.

<!-- Source EN PDF p.7, block 3 -->

TRNG: Die Hardware-Zufallszahlenmodule der meisten früheren Chipplattformen waren Bestandteil der Hardware-CRYPTO-IP, einschließlich CRYPTO V1 und einiger CRYPTO-V2-Varianten. Ab RK356x ist HWRNG (TRNG) ein eigenständiges Hardwaremodul.

<!-- Source EN PDF p.7, block 4 -->

### 1.1 crypto v1

<!-- Source EN PDF p.7, block 5 -->

| Algorithmus | Beschreibung |
|---|---|
| DES/TDES | Unterstützt DES/3DES (Verkettungsmodi ECB und CBC) |
| AES | Unterstützt Schlüssellängen von 128/192/256 Bit und die Verkettungsmodi ECB/CBC/CTR/XTS |
| HASH | Unterstützt SHA1/SHA256/MD5 mit Hardware-Padding |
| RSA | Unterstützt modulare Exponentiation mit PKA 512/1024/2048 Bit (RK3126, RK3128, RK3288 und RK3368 werden<br>nicht unterstützt) |
| TRNG | Unterstützt einen echten 256-Bit-Zufallszahlengenerator (TRNG) |


> Quellenunterschied: Der chinesische Abschnitt §1.1 nennt zusätzlich TDES EEE/EDE; §1.2 beschränkt TDES auf EDE. Diese Einschränkungen sind in der englischen Tabelle nicht vollständig angegeben. Prüfen Sie die konkrete IP und das SDK.



<!-- Source EN PDF p.8, block 9 -->

### 1.2 crypto v2

<!-- Source EN PDF p.8, block 11 -->

| Algorithmus | Beschreibung |
|---|---|
| DES/TDES | Unterstützt die Modi ECB/CBC/OFB/CFB. |
| AES | Unterstützt die Modi ECB/CBC/OFB/CFB/CTR/CTS/XTS/CCM/GCM/CBC-MAC/CMAC. |
| SM4 | Unterstützt die Modi ECB/CBC/OFB/CFB/CTR/CTS/XTS/CCM/GCM/CBC-MAC/CMAC. (SM4 ist<br>optional) |
| HASH | Unterstützt MD5/SHA1/SHA224/SHA256/SHA384/SHA512/SM3/SHA512-224/SHA512-256 mit<br>Hardware-Padding. (SM3 ist optional) |
| HMAC | Unterstützt HMAC für SHA-1, SHA-256, SHA-512, MD5 und SM3 mit Hardware-Padding. (SM3 ist<br>optional) |
| RSA/ECC | Unterstützt mathematische PKA-Operationen mit bis zu 4096 Bit für RSA/ECC/SM2. |
| TRNG | Unterstützt einen echten 256-Bit-Zufallszahlengenerator (TRNG) |


> Quellenunterschied: Der chinesische Abschnitt §1.1 nennt zusätzlich TDES EEE/EDE; §1.2 beschränkt TDES auf EDE. Diese Einschränkungen sind in der englischen Tabelle nicht vollständig angegeben. Prüfen Sie die konkrete IP und das SDK.



<!-- Source EN PDF p.8, block 15 -->

### 1.3 crypto v3

<!-- Source EN PDF p.8, block 16 -->

Crypto V3 ergänzt die Algorithmen von Crypto V2 um Multithreading-Unterstützung. Ab RV1106 kann die Crypto-V3-Plattform die unterstützten Algorithmen automatisch erkennen; daher verwendet compatible die Kennung "rockchip,crypto-v3".

<!-- Source EN PDF p.8, block 17 -->

### 1.4 crypto v4

<!-- Source EN PDF p.8, block 18 -->

Auf Grundlage der Algorithmen von Crypto V3 wurden Optimierungen vorgenommen. IP-Treiber können kompatibel mit Crypto V3 denselben Code wiederverwenden. compatible verwendet einheitlich die Kennung "rockchip,crypto-v4".

<!-- Source EN PDF p.8, block 19 -->

### 1.5 crypto ce

<!-- Source EN PDF p.8, block 20 -->

RKCE verwendet den ursprünglichen Rechenkern, gestaltet jedoch Register und Aufrufverfahren neu. Der Treiber ist vollständig inkompatibel mit V2/V3/V4 und wurde neu geschrieben. compatible verwendet einheitlich die Kennung "rockchip,crypto-ce".

<!-- Source EN PDF p.8, block 21 -->

### 1.6 Crypto-IP-Versionen der Chips

<!-- Source EN PDF p.8, block 22 -->

Die Crypto-IP-Versionen der Chips sind nachfolgend aufgeführt:

<!-- Source EN PDF p.8, block 23 -->

Folgende Plattformen verwenden Crypto V1:

<!-- Source EN PDF p.8, block 24 -->

RK3399, RK3288, RK3368, RK3328/RK3228H, RK322x, RK3128, RK1108, RK3126

<!-- Source EN PDF p.9, block 25 -->

Folgende Plattformen verwenden Crypto V2:

<!-- Source EN PDF p.9, block 26 -->

RK3326/PX30, RK3308, RK1808, RV1126/RV1109, RK2206, RK356x, RK3588

<!-- Source EN PDF p.9, block 27 -->

Folgende Plattformen verwenden Crypto V3:

<!-- Source EN PDF p.9, block 28 -->

RV1106, RV1103

<!-- Source EN PDF p.9, block 29 -->

Folgende Plattformen verwenden Crypto V4:

<!-- Source EN PDF p.9, block 30 -->

RK3528, RK3562, RK3503, RK3506, RK3576, RV1103B, RV1106B

<!-- Source EN PDF p.9, block 31 -->

Folgende Plattformen verwenden Crypto CE:

<!-- Source EN PDF p.9, block 32 -->

RV1126B

<!-- Source EN PDF p.9, block 33 -->

## 2. Treiberentwicklung

<!-- Source EN PDF p.9, block 34 -->

### 2.1 Beschreibung des Treibercodes

<!-- Source EN PDF p.9, block 35 -->

#### 2.1.1 hwrng

<!-- Source EN PDF p.9, block 36 -->

Die vier Plattformvarianten Crypto V1 / V2, TRNGV1 und RKRNG sind in derselben C-Datei zusammengefasst, da der HWRNG-Treiber vergleichsweise einfach ist.

<!-- Source EN PDF p.9, block 37 -->

Der Treiber unterscheidet nicht nach konkretem Chipmodell, sondern nur anhand der vier compatible-Kennungen "rockchip,cryptov1-rng", "rockchip,cryptov2-rng", "rockchip,trngv1" und "rockchip,rkrng". Derzeit sind "rockchip,trngv1" und "rockchip,rkrng" eigenständige HWRNG-Module; die beiden anderen HWRNG-Varianten sind in das Crypto-Modul integriert.

<!-- Source EN PDF p.9, block 38 -->

Treiberquellcode: drivers/char/hw_random/rockchip-rng.c

<!-- Source EN PDF p.9, block 39 -->

#### 2.1.2 crypto

<!-- Source EN PDF p.9, block 40 -->

Derzeit sind folgende Algorithmen im Treiber implementiert:

<!-- Source EN PDF p.9, block 41 -->

crypto v1:

<!-- Source EN PDF p.9, block 42 -->

AES: ECB/CBC

<!-- Source EN PDF p.9, block 43 -->

DES/TDES: ECB/CBC

<!-- Source EN PDF p.9, block 44 -->

HASH: SHA1/SHA256/MD5

<!-- Source EN PDF p.9, block 45 -->

crypto v2/v3/v4: (Einige Chipsätze unterstützen möglicherweise nicht alle Algorithmen)

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

RSA: Unterstützt Schlüssellängen bis zu 4096 Bit.

<!-- Source EN PDF p.10, block 52 -->

Vollständige Hardwarefunktionen von crypto v2/v3/v4 (für die durchgestrichenen Modi unten ist noch kein Treiber implementiert):

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

RSA: Unterstützt Schlüssellängen bis zu 4096 Bit.

<!-- Source EN PDF p.10, block 59 -->

Tabelle der Hardwareunterschiede von crypto v2/v3/v4

<!-- Source EN PDF p.10, block 60 -->

| Chip | AES | DES/TDES | SM3/SM4 | HASH | HMAC | RSA/ECC | Multi-<br>threading |
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

Hinweis:

<!-- Source EN PDF p.10, block 62 -->

1\. RK1808: AES unterstützt nur 128 Bit. Die Kerneltreiber unterstützen AES nicht.

<!-- Source EN PDF p.10, block 63 -->

2\. RV1126/RV1109: AES-192 wird nicht unterstützt. Daher kann AES-192 nur durch einen Softwarealgorithmus implementiert werden; dieser unterstützt jedoch nicht alle Modi des Hardwarealgorithmus. Es wird deshalb empfohlen, die Liste der konfigurierten Algorithmen im Code nicht zu verändern.

<!-- Source EN PDF p.10, block 64 -->

Die Treiberdateien sind nachfolgend dargestellt:

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

### 2.2 HWRNG aktivieren

<!-- Source EN PDF p.12, block 70 -->

#### 2.2.1 Menuconfig

<!-- Source EN PDF p.12, block 71 -->

Der HWRNG-Treiber wird standardmäßig in den Kernel einkompiliert. Die DTS-Datei bestimmt, ob er aktiviert wird.

<!-- Source EN PDF p.12, block 72 -->

Die Konfiguration ist in der folgenden Abbildung dargestellt. Rote Markierungen kennzeichnen den Konfigurationspfad und die einzustellenden Optionen.

<!-- Source EN PDF p.12, block 73 -->

![Technische Originalabbildung — PDF S. 12](/docs/rockchip-crypto-hwrng/assets/en-p12-figure1.png)

<!-- Source EN PDF p.12, block 74 -->

Alternativ fügen Sie der Konfigurationsdatei die folgende Anweisung hinzu; in rockchip_defconfig ist sie bereits standardmäßig konfiguriert:

<!-- Source EN PDF p.12, block 75 -->

```text
CONFIG_HW_RANDOM=y
CONFIG_HW_RANDOM_ROCKCHIP=y
```

<!-- Source EN PDF p.12, block 76 -->

#### 2.2.2 RNG-Knoten in DTS aktivieren

<!-- Source EN PDF p.12, block 77 -->

Die DTSI-Dateien der meisten Chips enthalten bereits HWRNG-Knoten. Sie müssen lediglich das RNG-Modul in der boardspezifischen DTS-Datei wie folgt aktivieren:

<!-- Source EN PDF p.12, block 78 -->

```text
&rng {
    status = "okay";
}
```

<!-- Source EN PDF p.12, block 79 -->

#### 2.2.3 RNG-Knoten für einen neuen Chip hinzufügen

<!-- Source EN PDF p.12, block 80 -->

Für die meisten Chipplattformen sind RNG-Knoten bereits konfiguriert. Fehlt ein solcher Knoten in der DTSI-Datei des Chips, konfigurieren Sie ihn mit den folgenden Schritten.

<!-- Source EN PDF p.12, block 81 -->

Achtung:

<!-- Source EN PDF p.13, block 82 -->

1\. Passen Sie die RNG-Basisadresse entsprechend dem Chip-TRM an. Die RNG-Basisadresse ist die CRYPTO-Basisadresse.

<!-- Source EN PDF p.13, block 83 -->

2\. Die Taktmakros können je nach Plattform variieren. Bei einem DTS-Fehler wechseln Sie in das Verzeichnis include/dt-bindings/clock und führen grep -rn CRYPTO aus, um die passenden Taktmakronamen zu finden, wie nachfolgend gezeigt:

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

TRNG benötigt tatsächlich nicht alle Takte, sondern nur hclk_crypto.

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

RK3588 und RV1106 verwenden derzeit das Zufallszahlenmodul TRNG V1. Dessen Aufbau unterscheidet sich vollständig vom aus Crypto V2 herausgetrennten TRNG-Modul und verbessert die Zufallseigenschaften.

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

#### 2.2.4 Aktivierung von HWRNG überprüfen

<!-- Source EN PDF p.14, block 94 -->

1\. Führen Sie `cat /sys/devices/virtual/misc/hw_random/rng_current` aus. Der Wert `rockchip` kennzeichnet den ausgewählten Hardwaretreiber.

<!-- Source EN PDF p.14, block 95 -->

2\. Linux: `cat /dev/hwrng | od -x | head -n 1` liefert eine Zeile mit Zufallszahlen. Bei jedem Aufruf unterscheiden sich die ausgegebenen Werte.

<!-- Source EN PDF p.14, block 96 -->

3\. Android: `cat /dev/hw_random | od -x | head -n 1` liefert eine Zeile mit Zufallszahlen. Bei jedem Aufruf unterscheiden sich die ausgegebenen Werte.

<!-- Source EN PDF p.14, block 97 -->

### 2.3 Hardware-Crypto aktivieren

<!-- Source EN PDF p.14, block 98 -->

Der aktuelle Treibercode unterstützt mit crypto v1 rk3328, mit crypto v2 px30 / rv1126 / rk3568 / rk3588 und mit crypto v3 rv1106. Auf diesen Plattformen genügt es, die Konfigurationsoptionen und DTS-Knoten zu aktivieren, um Hardware-Crypto einzuschalten.

<!-- Source EN PDF p.14, block 99 -->

Ab RV1106 spiegeln die Registerinformationen die unterstützten Funktionen wider. Crypto V3 kann sich automatisch an neue Chips anpassen.

<!-- Source EN PDF p.14, block 100 -->

#### 2.3.1 Menuconfig

<!-- Source EN PDF p.14, block 101 -->

Nach der Konfiguration mit menuconfig wird der Rockchip-Crypto-Treiber in den Kernel einkompiliert. Er passt sich anhand der compatible-Kennung der Chipplattform automatisch an die Crypto-IP-Version an.

<!-- Source EN PDF p.14, block 102 -->

Die Konfigurationsoptionen für Hardware-Crypto werden erst angezeigt, wenn CONFIG_CRYPTO_HW aktiviert ist.

<!-- Source EN PDF p.15, block 103 -->

![Technische Originalabbildung — PDF S. 15](/docs/rockchip-crypto-hwrng/assets/en-p15-figure1.png)

<!-- Source EN PDF p.15, block 104 -->

Alternativ ergänzen Sie die folgenden Anweisungen in der Konfigurationsdatei. CONFIG_CRYPTO_DEV_ROCKCHIP_V3 ist nur ein Beispiel und muss an den tatsächlichen Chip angepasst werden. Es wird empfohlen, menuconfig zu verwenden, da es die Plattform automatisch auswählt.

<!-- Source EN PDF p.15, block 105 -->

```text
CONFIG_CRYPTO_HW=y
CONFIG_CRYPTO_DEV_ROCKCHIP=y
CONFIG_CRYPTO_DEV_ROCKCHIP_V3=y
CONFIG_CRYPTO_DEV_ROCKCHIP_DEV=y
```

<!-- Source EN PDF p.15, block 106 -->

#### 2.3.2 Crypto-Knoten in DTS aktivieren

<!-- Source EN PDF p.15, block 107 -->

Nachdem Sie die korrekte Konfiguration des Crypto-DTS-Knotens bestätigt haben, aktivieren Sie das Crypto-Modul in der boardspezifischen DTS-Datei wie folgt:

<!-- Source EN PDF p.15, block 108 -->

```text
&crypto {
    status = "okay";
};
```

<!-- Source EN PDF p.15, block 109 -->

#### 2.3.3 Crypto-Knoten für einen neuen Chip hinzufügen

<!-- Source EN PDF p.15, block 110 -->

Wenn die DTSI-Datei des Chips keinen Crypto-Knoten enthält, ergänzen Sie die Unterstützung mit den folgenden Schritten.

<!-- Source EN PDF p.15, block 111 -->

1\. Ermitteln Sie die Crypto-IP-Version des Chips: V1 / V2 / V3. Für V3 ab RV1106 ist compatible als "rockchip,crypto-v3" festgelegt; die Software passt Algorithmusauswahl und Funktionen an.

<!-- Source EN PDF p.15, block 112 -->

2\. Ergänzen Sie algs_name, soc_data und compatible-Informationen in drivers/crypto/rockchip/rk_crypto_core.c.

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

3\. Fügen Sie einen Crypto-Knoten für den neuen Chip hinzu.

<!-- Source EN PDF p.16, block 116 -->

Achtung:

<!-- Source EN PDF p.16, block 117 -->

1\. Ermitteln Sie die CRYPTO-Basisadresse anhand des Chip-TRM.

<!-- Source EN PDF p.16, block 118 -->

2\. Die Taktmakros können je nach Plattform variieren. Bei einem DTS-Fehler suchen Sie mit grep -rn CRYPTO in include/dt-bindings/clock nach den passenden Taktmakronamen, wie nachfolgend gezeigt:

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

Bei den meisten Crypto-V2-Chips liegt die HWRNG-Registeradresse innerhalb des Crypto-Adressraums. Deshalb muss dieser bei der Konfiguration der reg-Adressen in zwei Teile aufgeteilt werden: Der erste Teil enthält die von CIPHER verwendeten Register, der zweite die von RSA verwendeten Register.

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

4\. Aktivieren Sie den Crypto-Knoten.

<!-- Source EN PDF p.17, block 127 -->

```text
&crypto {
    status = "okay";
};
```

<!-- Source EN PDF p.17, block 128 -->

#### 2.3.4 Aktivierung von Hardware-Crypto überprüfen

<!-- Source EN PDF p.17, block 130 -->

Mit `cat /proc/crypto | grep rk` zeigen Sie die registrierten Rockchip-Hardware-Crypto-Algorithmen an. Das folgende Beispiel verwendet RV1126.

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

Mit cat /proc/rkcrypto lassen sich Informationen über den Rockchip-Crypto-Treiber anzeigen. Aktualisieren Sie zuvor auf den neuesten Code, da ältere Versionen diese Funktion nicht unterstützen. Angezeigt werden unter anderem Crypto-Version, Taktfrequenz, aktuell verfügbare Algorithmen und Statistiken zum laufenden Treiberbetrieb. Diese Informationen sollen künftig weiter ergänzt und verbessert werden. ("CRYPTO V3.0.0.0 multi" bedeutet, dass die aktuelle Plattform Crypto-Multithreading unterstützt.)

<!-- Source EN PDF p.18, block 136 -->

Hinweis: RKCE-Plattformen erzeugen kein /proc/rkcrypto.

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

## 3. Entwicklung im Userspace

<!-- Source EN PDF p.20, block 140 -->

### 3.1 HWRNG aus dem Userspace aufrufen

<!-- Source EN PDF p.20, block 141 -->

Der Userspace kann die von HWRNG ausgegebenen Zufallszahlen auf zwei Wegen beziehen:

<!-- Source EN PDF p.20, block 142 -->

Kerneltreiberknoten lesen

<!-- Source EN PDF p.20, block 143 -->

librkcrypto-API aufrufen

<!-- Source EN PDF p.20, block 144 -->

Achtung:

<!-- Source EN PDF p.20, block 145 -->

1\. Nach erfolgreicher Registrierung des HWRNG-Hardwaretreibers kann dem Zufallstreiber des Kernels Entropie zugeführt werden. Die von HWRNG erzeugten Zufallszahlen fließen in dessen Entropiepool ein. Der Zufallstreiber des Kernels ist ein CSPRNG (kryptographisch sicherer Pseudozufallszahlengenerator), der kryptographische Sicherheitsanforderungen erfüllt. Für hochwertige Zufallszahlen können Sie die Knoten /dev/random oder /dev/urandom lesen.

<!-- Source EN PDF p.20, block 146 -->

#### 3.1.1 Kerneltreiberknoten lesen

<!-- Source EN PDF p.20, block 147 -->

Wenn das RNG-Modul im Kernel aktiviert ist, lassen sich Zufallszahlen durch Lesen der Knoten aus dem Userspace beziehen. Unter Linux wird /dev/hwrng gelesen, unter Android /dev/hw_random. Referenzcode:

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

#### 3.1.2 librkcrypto-API aufrufen

<!-- Source EN PDF p.21, block 151 -->

Siehe API-Beschreibung: rk_get_random.

<!-- Source EN PDF p.21, block 152 -->

### 3.2 Hardware-Crypto aus dem Userspace aufrufen

<!-- Source EN PDF p.21, block 153 -->

Der Userspace steuert das Hardware-Kryptographiemodul über die librkcrypto-Schnittstelle. Dieser Abschnitt beschreibt die Verwendung von librkcrypto.

<!-- Source EN PDF p.21, block 154 -->

Prüfen Sie vor der Verwendung, ob Hardware-Crypto im Kernel aktiviert ist; Konfiguration und Prüfung sind in §2.3 und §2.3.4 beschrieben.

<!-- Source EN PDF p.21, block 155 -->

#### 3.2.1 Anwendungsbereich

<!-- Source EN PDF p.21, block 156 -->

| API | RK3588 | RK356x | RV1109/1126 | Andere |
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

#### 3.2.2 Versionsabhängigkeiten

<!-- Source EN PDF p.22, block 158 -->

##### 3.2.2.1 V1.3.0

<!-- Source EN PDF p.22, block 159 -->

Die Bibliotheksfunktionen von librkcrypto V1.3.0 hängen von den nachfolgend aufgeführten Kernel-Commits ab. Derzeit unterstützen nur neuere Chips wie RK3576 ECC/SM2-Funktionen, hauptsächlich mit Kernel 6.1.

<!-- Source EN PDF p.22, block 160 -->

1\. Kernel 6.1

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

Die Bibliotheksfunktionen von librkcrypto V1.2.0 hängen von den nachfolgend aufgeführten Kernel-Commits ab. Wenn der Crypto-Kerneltreiber nicht auf diese Commits aktualisiert wurde, können einige Funktionen fehlen.

<!-- Source EN PDF p.22, block 164 -->

1\. Kernel 4.19

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

2\. Kernel 5.10

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

#### 3.2.3 Wichtige Hinweise

<!-- Source EN PDF p.23, block 169 -->

Die Eingabedatenlänge symmetrischer Algorithmen muss den Anforderungen des gewählten Algorithmus und Modus entsprechen. ECB und CBC erfordern beispielsweise Blockausrichtung, CTS und CTR dagegen keine Ausrichtung der Datenlänge. Die API führt kein Padding aus.

<!-- Source EN PDF p.23, block 170 -->

Bei großen Datenmengen wird zur Effizienzsteigerung die Algorithmusschnittstelle empfohlen, die Daten über dma_fd überträgt. Da Crypto nur zusammenhängende physische Adressen unterhalb von 4G unterstützt, muss der über dma_fd zugewiesene Puffer physisch zusammenhängend sein und in diesem Adressbereich liegen (CMA). Er kann über die von librkcrypto bereitgestellte rk_crypto_mem-Schnittstelle oder selbstständig über eine Speicherallokationsschnittstelle wie DRM zugewiesen werden, die einen dma_fd liefert.

<!-- Source EN PDF p.23, block 171 -->

CMA-Konfiguration: Crypto unterstützt ausschließlich Zugriffe auf CMA-Adressen unterhalb von 4G. Bei Geräten mit mehr als 4G Speicher muss die CMA-Konfiguration in DTS angepasst werden. Andernfalls kann rk_crypto_mem zwar erfolgreich Speicher zuweisen, dieser lässt sich jedoch nicht verwenden. Das folgende Beispiel verwendet rk3588-android.dtsi. Dabei bezeichnet 0x10000000 die CMA-Startadresse (256MB; diesen Wert nicht ändern) und 0x00800000 die CMA-Größe, die nach Bedarf angepasst werden kann. Einzelheiten zu CMA enthält `Rockchip_Developer_Guide_Linux_CMA_CN`.

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

Stellen Sie vor Verwendung der folgenden Schnittstellen sicher, dass die TEE-Funktion verfügbar ist. Einzelheiten enthält `Rockchip_Developer_Guide_TEE_SDK_CN`.

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

rk_set_oem_hr_otp_read_lock: Wenn key_id auf RK_OEM_OTP_KEY0/1/2 gesetzt wird, beeinflusst die erfolgreiche Einstellung die Eigenschaften anderer OTP-Bereiche. Beispielsweise können einige OTP-Bereiche danach nicht mehr beschreibbar sein; siehe `Rockchip_Developer_Guide_OTP_CN`. Daher wird RK_OEM_OTP_KEY3 empfohlen.

<!-- Source EN PDF p.23, block 180 -->

rk_oem_otp_key_cipher_virt: Der maximal unterstützte len-Wert hängt vom gemeinsam genutzten TEE-Speicher ab. Ist dieser vor dem Schnittstellenaufruf bereits belegt, kann der verfügbare Wert kleiner als erwartet sein.

<!-- Source EN PDF p.24, block 181 -->

#### 3.2.4 Datenstrukturen

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

- vaddr - virtuelle Speicheradresse

<!-- Source EN PDF p.24, block 185 -->

- dma_fd - dma_fd des Speichers

<!-- Source EN PDF p.24, block 186 -->

- size - Speichergröße

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

- algo - Algorithmustyp, siehe RK_CRYPTO_ALGO. Der tatsächliche Wertebereich richtet sich nach der API-Beschreibung. Dies gilt auch nachfolgend.

<!-- Source EN PDF p.24, block 190 -->

- mode - Algorithmusmodus, siehe RK_CIPIHER_MODE. Unterstützt ECB/CBC/CTR/CFB/OFB/.

<!-- Source EN PDF p.24, block 191 -->

- operation - Verschlüsseln oder Entschlüsseln, siehe RK_CRYPTO_OPERATION.

<!-- Source EN PDF p.24, block 192 -->

- key - Klartextschlüssel. Bei Verwendung eines OTP-Schlüssels ungültig.

<!-- Source EN PDF p.24, block 193 -->

- key_len - Schlüssellänge (Einheit: Byte)

<!-- Source EN PDF p.24, block 194 -->

- iv - Initialisierungsvektor; im ECB-Modus ungültig. In anderen Modi aktualisiert rk_cipher_crypt/crypt_virt iv automatisch für die Verarbeitung mehrerer Teilstücke.

<!-- Source EN PDF p.24, block 195 -->

- reserved - für künftige Verwendung reserviert

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

- algo - Algorithmustyp, siehe RK_CRYPTO_ALGO. Unterstützt AES/SM4.

<!-- Source EN PDF p.25, block 199 -->

- mode - Algorithmusmodus, siehe RK_CIPIHER_MODE. Unterstützt GCM/CCM.

<!-- Source EN PDF p.25, block 200 -->

- operation - Verschlüsseln oder Entschlüsseln, siehe RK_CRYPTO_OPERATION.

<!-- Source EN PDF p.25, block 201 -->

- key - Klartextschlüssel. Bei Verwendung eines OTP-Schlüssels ungültig.

<!-- Source EN PDF p.25, block 202 -->

- key_len - Schlüssellänge (Einheit: Byte)

<!-- Source EN PDF p.25, block 203 -->

- iv - Initialisierungsvektor

<!-- Source EN PDF p.25, block 204 -->

- iv_len - Länge des Initialisierungsvektors (Einheit: Byte)

<!-- Source EN PDF p.25, block 205 -->

- tag_len - Tag-Länge (Einheit: Byte)

<!-- Source EN PDF p.25, block 206 -->

- aad_len - AAD-Länge (Einheit: Byte)

<!-- Source EN PDF p.25, block 207 -->

- payload_len - Nutzdatenlänge (Einheit: Byte)

<!-- Source EN PDF p.25, block 208 -->

- reserved - für künftige Verwendung reserviert

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

- algo - Algorithmustyp, siehe RK_CRYPTO_ALGO. Unterstützt HASH/HMAC.

<!-- Source EN PDF p.25, block 212 -->

- key - Schlüssel für Hash-MAC; nur gültig, wenn algo HMAC ist

<!-- Source EN PDF p.25, block 213 -->

- key_len - Schlüssellänge (Einheit: Byte)

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

- n - Modulus, wie bei OpenSSL im Big-Endian-Format

<!-- Source EN PDF p.26, block 217 -->

- e - Exponent, wie bei OpenSSL im Big-Endian-Format

<!-- Source EN PDF p.26, block 218 -->

- n_len - Moduluslänge

<!-- Source EN PDF p.26, block 219 -->

- e_len - Exponentenlänge

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

- key_type - Schlüsseltyp, siehe RK_RSA_KEY_TYPE. Unterstützt Klartextschlüssel und mit OTP_KEY verschlüsselte Schlüssel. librkcrypto übergibt den Schlüssel an den Crypto-Treiber, der ihn vor der Verwendung mit dem entsprechenden OTP-Schlüssel entschlüsselt.

<!-- Source EN PDF p.26, block 223 -->

- key - öffentlicher Schlüssel, siehe rk_rsa_pub_key.

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

- n - Modulus, wie bei OpenSSL im Big-Endian-Format

<!-- Source EN PDF p.27, block 228 -->

- e - Exponent, wie bei OpenSSL im Big-Endian-Format

<!-- Source EN PDF p.27, block 229 -->

- d - privater Schlüssel, wie bei OpenSSL im Big-Endian-Format

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

- len - die Längenangaben der einzelnen Elemente werden hier nicht näher beschrieben

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

- key_type - Schlüsseltyp, siehe RK_RSA_KEY_TYPE. Unterstützt Klartextschlüssel und mit OTP_KEY verschlüsselte Schlüssel. librkcrypto übergibt den Schlüssel; vor der Verwendung wird er mit dem entsprechenden OTP-Schlüssel entschlüsselt.

<!-- Source EN PDF p.27, block 239 -->

- key - privater Schlüssel, siehe rk_rsa_priv_key.

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

- curve - Kurvenauswahl, siehe RK_EC_CURVE, beispielsweise RK_EC_CURVE_SM2/P192/P224/P256...

<!-- Source EN PDF p.27, block 243 -->

- x - x-Koordinate des öffentlichen Schlüssels, wie bei OpenSSL im Big-Endian-Format

<!-- Source EN PDF p.27, block 244 -->

- y - y-Koordinate des öffentlichen Schlüssels, wie bei OpenSSL im Big-Endian-Format

<!-- Source EN PDF p.27, block 245 -->

- x_len - Länge der x-Daten

<!-- Source EN PDF p.27, block 246 -->

- y_len - Länge der y-Daten

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

- key_type - Schlüsseltyp, siehe RK_EC_KEY_TYPE. Unterstützt Klartextschlüssel und mit OTP_KEY verschlüsselte Schlüssel. librkcrypto übergibt den Schlüssel; vor der Verwendung wird er mit dem entsprechenden OTP-Schlüssel entschlüsselt.

<!-- Source EN PDF p.28, block 250 -->

- key - öffentlicher Schlüssel, siehe rk_ec_pub_key.

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

- curve - Kurvenauswahl, siehe RK_EC_CURVE, beispielsweise RK_EC_CURVE_SM2/P192/P224/P256...

<!-- Source EN PDF p.28, block 254 -->

- x - x-Koordinate des öffentlichen Schlüssels, wie bei OpenSSL im Big-Endian-Format

<!-- Source EN PDF p.28, block 255 -->

- y - y-Koordinate des öffentlichen Schlüssels, wie bei OpenSSL im Big-Endian-Format

<!-- Source EN PDF p.28, block 256 -->

- d - d-Wert des privaten Schlüssels, wie bei OpenSSL im Big-Endian-Format

<!-- Source EN PDF p.28, block 257 -->

- x_len - Länge der x-Daten

<!-- Source EN PDF p.28, block 258 -->

- y_len - Länge der y-Daten

<!-- Source EN PDF p.28, block 259 -->

- d_len - Länge der d-Daten

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

- key_type - Schlüsseltyp, siehe RK_EC_KEY_TYPE. Unterstützt Klartextschlüssel und mit OTP_KEY verschlüsselte Schlüssel. librkcrypto übergibt den Schlüssel; vor der Verwendung wird er mit dem entsprechenden OTP-Schlüssel entschlüsselt.

<!-- Source EN PDF p.28, block 263 -->

- key - privater Schlüssel, siehe rk_ec_priv_key.

<!-- Source EN PDF p.29, block 264 -->

#### 3.2.5 Konstanten

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

##### 3.2.5.10 Weitere Konstanten

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

##### 3.2.6.1 Datentyp

<!-- Source EN PDF p.32, block 287 -->

```text
typedef uint32_t RK_RES;
typedef uint32_t rk_handle;
```

<!-- Source EN PDF p.33, block 288 -->

##### 3.2.6.2 Rückgabecodes

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

Funktion

<!-- Source EN PDF p.33, block 293 -->

Fordert einen Speicherblock an und gibt rk_crypto_mem zurück. Diese Struktur enthält die virtuelle Speicheradresse und dma_fd.

<!-- Source EN PDF p.33, block 294 -->

Parameter

<!-- Source EN PDF p.33, block 295 -->

- [in] size - Größe des zuzuweisenden Speichers

<!-- Source EN PDF p.33, block 296 -->

- [out] memory - Speicheradressinformationen, siehe rk_crypto_mem.

<!-- Source EN PDF p.33, block 297 -->

Achtung

<!-- Source EN PDF p.33, block 298 -->

1\. Die maximale Speichergröße hängt von der Größe und Belegung des CMA-Puffers im Kernel ab.

<!-- Source EN PDF p.33, block 299 -->

##### 3.2.6.4 rk_crypto_mem_free

<!-- Source EN PDF p.33, block 300 -->

```text
void rk_crypto_mem_free(rk_crypto_mem *memory);
```

<!-- Source EN PDF p.33, block 301 -->

Funktion

<!-- Source EN PDF p.33, block 302 -->

Gibt den von rk_crypto_mem_alloc zugewiesenen Speicher frei.

<!-- Source EN PDF p.33, block 303 -->

Parameter

<!-- Source EN PDF p.33, block 304 -->

- [in] memory - Speicheradressinformationen, siehe rk_crypto_mem.

<!-- Source EN PDF p.34, block 305 -->

##### 3.2.6.5 rk_crypto_init

<!-- Source EN PDF p.34, block 306 -->

```text
RK_RES rk_crypto_init(void);
```

<!-- Source EN PDF p.34, block 307 -->

Funktion

<!-- Source EN PDF p.34, block 308 -->

Initialisiert Crypto, beispielsweise durch Öffnen von Geräteknoten.

<!-- Source EN PDF p.34, block 309 -->

Parameter

<!-- Source EN PDF p.34, block 310 -->

Keine

<!-- Source EN PDF p.34, block 311 -->

##### 3.2.6.6 rk_crypto_deinit

<!-- Source EN PDF p.34, block 312 -->

```text
void rk_crypto_deinit(void);
```

<!-- Source EN PDF p.34, block 313 -->

Funktion

<!-- Source EN PDF p.34, block 314 -->

Gibt Crypto-Ressourcen frei, beispielsweise durch Schließen von Geräteknoten.

<!-- Source EN PDF p.34, block 315 -->

Parameter

<!-- Source EN PDF p.34, block 316 -->

Keine

<!-- Source EN PDF p.34, block 317 -->

##### 3.2.6.7 rk_hash_init

<!-- Source EN PDF p.34, block 318 -->

```text
RK_RES rk_hash_init(rk_hash_config *config, rk_handle *handle);
```

<!-- Source EN PDF p.34, block 319 -->

Funktion

<!-- Source EN PDF p.34, block 320 -->

Initialisiert den Hash-Algorithmus. Unterstützt MD5/SHA1/SHA224/SHA256/SHA384/SHA512/SM3.

<!-- Source EN PDF p.34, block 321 -->

Parameter

<!-- Source EN PDF p.34, block 322 -->

- [in] config - Hash-/HMAC-Konfiguration

<!-- Source EN PDF p.34, block 323 -->

- [out] handle - Hash-/HMAC-Handle

<!-- Source EN PDF p.34, block 324 -->

Achtung

<!-- Source EN PDF p.34, block 325 -->

1\. Nach erfolgreichem rk_hash_init muss rk_hash_final zur Freigabe der Ressourcen aufgerufen werden, unabhängig davon, ob rk_hash_update() oder rk_hash_update_virt erfolgreich ausgeführt wurde.

<!-- Source EN PDF p.34, block 326 -->

2\. Wenn rk_hash_init RK_CRYPTO_ERR_BUSY zurückgibt, unterstützt die Plattform kein Multithreading und es kann jeweils nur ein Handle arbeiten. Warten Sie auf die Freigabe des vorherigen Handles, bevor Sie ein neues anfordern.

<!-- Source EN PDF p.35, block 327 -->

##### 3.2.6.8 rk_hash_update

<!-- Source EN PDF p.35, block 328 -->

```text
RK_RES rk_hash_update(rk_handle handle, int data_fd, uint32_t data_len);
```

<!-- Source EN PDF p.35, block 329 -->

Funktion

<!-- Source EN PDF p.35, block 330 -->

Empfängt den dma_fd der Eingabedaten, berechnet den Hash-/HMAC-Wert und unterstützt die Verarbeitung mehrerer Datenpakete.

<!-- Source EN PDF p.35, block 331 -->

Parameter

<!-- Source EN PDF p.35, block 332 -->

- [in] handle - Hash-/HMAC-Handle

<!-- Source EN PDF p.35, block 333 -->

- [in] data_fd - Handle der zu verarbeitenden Daten

<!-- Source EN PDF p.35, block 334 -->

- [in] data_len - Datenlänge (Einheit: Byte)

<!-- Source EN PDF p.35, block 335 -->

Achtung

<!-- Source EN PDF p.35, block 336 -->

1\. handle muss mit rk_hash_init() initialisiert sein.

<!-- Source EN PDF p.35, block 337 -->

2\. Die Funktion kann mehrfach aufgerufen werden, um die zu verarbeitenden Daten zuzuführen.

<!-- Source EN PDF p.35, block 338 -->

3\. Falls die Daten nicht das letzte Datenpaket bilden, muss data_len auf 64 Byte ausgerichtet sein.

<!-- Source EN PDF p.35, block 339 -->

##### 3.2.6.9 rk_hash_update_virt

<!-- Source EN PDF p.35, block 340 -->

```text
RK_RES rk_hash_update_virt(rk_handle handle, uint8_t *data, uint32_t data_len);
```

<!-- Source EN PDF p.35, block 341 -->

Funktion

<!-- Source EN PDF p.35, block 342 -->

Empfängt Eingabedaten über eine virtuelle Adresse und berechnet den Hash-Wert. Unterstützt die Verarbeitung mehrerer Datenpakete.

<!-- Source EN PDF p.35, block 343 -->

Parameter

<!-- Source EN PDF p.35, block 344 -->

- [in] handle - Hash-/HMAC-Handle

<!-- Source EN PDF p.35, block 345 -->

- [in] data - zu verarbeitende Daten

<!-- Source EN PDF p.35, block 346 -->

- [in] data_len - Datenlänge (Einheit: Byte)

<!-- Source EN PDF p.35, block 347 -->

Achtung

<!-- Source EN PDF p.35, block 348 -->

1\. handle muss mit rk_hash_init() initialisiert sein.

<!-- Source EN PDF p.35, block 349 -->

2\. Die Funktion kann mehrfach aufgerufen werden, um die zu verarbeitenden Daten zuzuführen.

<!-- Source EN PDF p.35, block 350 -->

3\. Falls die Daten nicht das letzte Datenpaket bilden, muss data_len auf 64 Byte ausgerichtet sein.

<!-- Source EN PDF p.35, block 351 -->

##### 3.2.6.10 rk_hash_final

<!-- Source EN PDF p.35, block 352 -->

```text
RK_RES rk_hash_final(rk_handle handle, uint8_t *hash);
```

<!-- Source EN PDF p.35, block 353 -->

Funktion

<!-- Source EN PDF p.35, block 354 -->

Nach Verarbeitung aller Daten wird diese Schnittstelle aufgerufen, um den endgültigen Hash-/HMAC-Wert abzurufen und das Handle freizugeben. Auch beim Abbrechen der Berechnung muss sie aufgerufen werden, um die Hash-Berechnung zu beenden.

<!-- Source EN PDF p.36, block 355 -->

Parameter

<!-- Source EN PDF p.36, block 356 -->

- [in] handle - Hash-/HMAC-Handle

<!-- Source EN PDF p.36, block 357 -->

- [out] hash - Hash-/HMAC-Ausgabe

<!-- Source EN PDF p.36, block 358 -->

Achtung

<!-- Source EN PDF p.36, block 359 -->

1\. handle muss mit rk_hash_init() initialisiert sein.

<!-- Source EN PDF p.36, block 360 -->

2\. Der Hash-/HMAC-Ausgabepuffer muss mindestens so groß wie die Hash-Länge sein.

<!-- Source EN PDF p.36, block 361 -->

##### 3.2.6.11 rk_hash_virt

<!-- Source EN PDF p.36, block 362 -->

```text
RK_RES rk_hash_virt(uint32_t algo, const uint8_t *input, uint32_t in_len,
             uint8_t *hash, uint32_t *hash_len);
```

<!-- Source EN PDF p.36, block 363 -->

Funktion

<!-- Source EN PDF p.36, block 364 -->

Empfängt Eingabedaten über eine virtuelle Adresse und berechnet den Hash-Wert in einem einzigen Aufruf.

<!-- Source EN PDF p.36, block 365 -->

Parameter

<!-- Source EN PDF p.36, block 366 -->

- [in] algo - Hash-Algorithmus, beispielsweise RK_ALGO_MD5/SHA1/SHA256...

<!-- Source EN PDF p.36, block 367 -->

- [in] input - virtuelle Adresse der Daten für die Hash-Berechnung

<!-- Source EN PDF p.36, block 368 -->

- [in] in_len - Länge von input (Einheit: Byte)

<!-- Source EN PDF p.36, block 369 -->

- [out] hash - Hash-Ausgabe

<!-- Source EN PDF p.36, block 370 -->

- [in/out] hash_len - als Eingabe die Größe des Hash-Puffers, als Ausgabe die tatsächliche Hash-Länge

<!-- Source EN PDF p.36, block 371 -->

##### 3.2.6.12 rk_cipher_init

<!-- Source EN PDF p.36, block 372 -->

```text
RK_RES rk_cipher_init(rk_cipher_config *config, rk_handle *handle);
```

<!-- Source EN PDF p.36, block 373 -->

Funktion

<!-- Source EN PDF p.36, block 374 -->

Initialisiert symmetrische Verschlüsselungsalgorithmen. Unterstützt die Algorithmustypen TDES/AES/SM4 und die Modi ECB/CBC/CTR/CFB/OFB.

<!-- Source EN PDF p.36, block 375 -->

Parameter

<!-- Source EN PDF p.36, block 376 -->

- [in] config - Algorithmus, Modus, Schlüssel, iv usw.; siehe rk_cipher_config

<!-- Source EN PDF p.36, block 377 -->

- [out] handle - Cipher-Handle

<!-- Source EN PDF p.36, block 378 -->

Achtung

<!-- Source EN PDF p.36, block 379 -->

1\. Nach erfolgreicher Initialisierung muss rk_cipher_final() zur Freigabe der zugehörigen Ressourcen aufgerufen werden, unabhängig davon, ob rk_cipher_crypt/crypt_virt() erfolgreich ausgeführt wurde.

<!-- Source EN PDF p.37, block 380 -->

##### 3.2.6.13 rk_cipher_crypt

<!-- Source EN PDF p.37, block 381 -->

```text
RK_RES rk_cipher_crypt(rk_handle handle, int in_fd, int out_fd, uint32_t len);
```

<!-- Source EN PDF p.37, block 382 -->

Funktion

<!-- Source EN PDF p.37, block 383 -->

Empfängt den dma_fd der Daten und führt die Ver- oder Entschlüsselung mit einem symmetrischen Algorithmus aus.

<!-- Source EN PDF p.37, block 384 -->

Parameter

<!-- Source EN PDF p.37, block 385 -->

- [in] handle - Cipher-Handle

<!-- Source EN PDF p.37, block 386 -->

- [in] in_fd - dma_fd der Eingabedaten

<!-- Source EN PDF p.37, block 387 -->

- [out] out_fd - dma_fd der Ausgabedaten

<!-- Source EN PDF p.37, block 388 -->

- [in] len - Eingabedatenlänge (Einheit: Byte)

<!-- Source EN PDF p.37, block 389 -->

Achtung

<!-- Source EN PDF p.37, block 390 -->

1\. handle muss mit rk_cipher_init() initialisiert sein.

<!-- Source EN PDF p.37, block 391 -->

2\. in_fd und out_fd können derselbe dma_fd sein.

<!-- Source EN PDF p.37, block 392 -->

3\. Nach der Berechnung wird iv in rk_cipher_config aktualisiert. Wiederholte Aufrufe ermöglichen eine Verarbeitung in Teilstücken.

<!-- Source EN PDF p.37, block 393 -->

##### 3.2.6.14 rk_cipher_crypt_virt

<!-- Source EN PDF p.37, block 394 -->

```text
RK_RES rk_cipher_crypt_virt(rk_handle handle, const uint8_t *in, uint8_t *out, uint32_t
len);
```

<!-- Source EN PDF p.37, block 395 -->

Funktion

<!-- Source EN PDF p.37, block 396 -->

Empfängt die virtuelle Adresse der Daten und führt die Ver- oder Entschlüsselung mit einem symmetrischen Algorithmus aus.

<!-- Source EN PDF p.37, block 397 -->

Parameter

<!-- Source EN PDF p.37, block 398 -->

- [in] handle - Cipher-Handle

<!-- Source EN PDF p.37, block 399 -->

- [in] in - Eingabedatenpuffer

<!-- Source EN PDF p.37, block 400 -->

- [out] out - Ausgabedatenpuffer

<!-- Source EN PDF p.37, block 401 -->

- [in] len - Eingabedatenlänge (Einheit: Byte)

<!-- Source EN PDF p.37, block 402 -->

Achtung

<!-- Source EN PDF p.37, block 403 -->

1\. handle muss mit rk_cipher_init() initialisiert sein.

<!-- Source EN PDF p.37, block 404 -->

2\. Ein- und Ausgabe können denselben Puffer verwenden.

<!-- Source EN PDF p.37, block 405 -->

3\. Nach der Berechnung wird iv in rk_cipher_config aktualisiert. Wiederholte Aufrufe ermöglichen eine Verarbeitung in Teilstücken.

<!-- Source EN PDF p.38, block 406 -->

##### 3.2.6.15 rk_cipher_final

<!-- Source EN PDF p.38, block 407 -->

```text
RK_RES rk_cipher_final(rk_handle handle);
```

<!-- Source EN PDF p.38, block 408 -->

Funktion

<!-- Source EN PDF p.38, block 409 -->

Beendet den Berechnungsvorgang und gibt das Handle frei.

<!-- Source EN PDF p.38, block 410 -->

Parameter

<!-- Source EN PDF p.38, block 411 -->

- [in] handle - Cipher-Handle, das mit rk_cipher_init() initialisiert sein muss

<!-- Source EN PDF p.38, block 412 -->

##### 3.2.6.16 rk_get_random

<!-- Source EN PDF p.38, block 413 -->

```text
RK_RES rk_get_random(uint8_t *data, uint32_t len)
```

<!-- Source EN PDF p.38, block 414 -->

Funktion

<!-- Source EN PDF p.38, block 415 -->

Bezieht Zufallsdaten der angegebenen Länge aus HWRNG.

<!-- Source EN PDF p.38, block 416 -->

Parameter

<!-- Source EN PDF p.38, block 417 -->

- [out] data - Zufallsdaten

<!-- Source EN PDF p.38, block 418 -->

- [in] len - Länge der abzurufenden Zufallsdaten (Einheit: Byte)

<!-- Source EN PDF p.38, block 419 -->

##### 3.2.6.17 rk_write_oem_otp_key

<!-- Source EN PDF p.38, block 420 -->

```text
RK_RES rk_write_oem_otp_key(enum RK_OEM_OTP_KEYID key_id, uint8_t *key,
                            uint32_t key_len);
```

<!-- Source EN PDF p.38, block 421 -->

Funktion

<!-- Source EN PDF p.38, block 422 -->

Schreibt den Schlüssel im Klartext in den angegebenen OEM-OTP-Bereich.

<!-- Source EN PDF p.38, block 423 -->

Einzelheiten zu den OEM-OTP-Funktionen enthält `Rockchip_Developer_Guide_OTP_CN`.

<!-- Source EN PDF p.38, block 424 -->

Parameter

<!-- Source EN PDF p.38, block 425 -->

- [in] key_id - Index des zu beschreibenden Schlüsselbereichs

<!-- Source EN PDF p.38, block 426 -->

- [in] key - Klartext des Schlüssels

<!-- Source EN PDF p.38, block 427 -->

- [in] key_len - Klartextschlüssellänge (Einheit: Byte)

<!-- Source EN PDF p.38, block 428 -->

Achtung

<!-- Source EN PDF p.38, block 429 -->

1\. key_id unterstützt standardmäßig die vier Schlüssel RK_OEM_OTP_KEY0 - 3. Für RV1126 / RV1109 wird außerdem RK_OEM_OTP_KEY_FW unterstützt. Diesen Schlüssel verwendet BootROM zum Entschlüsseln des Loaders. rk_oem_otp_key_cipher_virt unterstützt die Ver- und Entschlüsselung von Anwendungsdaten mit diesem Schlüssel.

<!-- Source EN PDF p.38, block 430 -->

2\. Für RK_OEM_OTP_KEY_FW unterstützt key_len 16 Byte. Für andere Schlüssel unterstützt key_len 16, 24 und 32 Byte.

<!-- Source EN PDF p.39, block 431 -->

##### 3.2.6.18 rk_oem_otp_key_is_written

<!-- Source EN PDF p.39, block 432 -->

```text
RK_RES rk_oem_otp_key_is_written(enum RK_OEM_OTP_KEYID key_id, uint8_t *is_written);
```

<!-- Source EN PDF p.39, block 433 -->

Funktion

<!-- Source EN PDF p.39, block 434 -->

Prüft, ob der Schlüssel in den angegebenen OEM-OTP-Bereich geschrieben wurde. Einzelheiten zu den OEM-OTP-Funktionen enthält `Rockchip_Developer_Guide_OTP_CN`.

<!-- Source EN PDF p.39, block 435 -->

Parameter

<!-- Source EN PDF p.39, block 436 -->

- [in] key_id - Index des zu beschreibenden Schlüsselbereichs

<!-- Source EN PDF p.39, block 437 -->

- [out] is_written - gibt an, ob der geheime Schlüssel geschrieben wurde: 1 bedeutet geschrieben, 0 bedeutet nicht geschrieben

<!-- Source EN PDF p.39, block 438 -->

Rückgabewert

<!-- Source EN PDF p.39, block 439 -->

is_written ist nur aussagekräftig, wenn der Rückgabewert #define RK_CRYPTO_SUCCESS 0x00000000 ist.

<!-- Source EN PDF p.39, block 441 -->

Auf RK3588 prüft der Treiber zusätzlich, ob key_id gesperrt ist. Bei gesperrtem key_id wird `#define RK_CRYPTO_ERR_ACCESS_DENIED 0xF0000005` zurückgegeben.

<!-- Source EN PDF p.39, block 444 -->

Achtung

<!-- Source EN PDF p.39, block 445 -->

1\. key_id unterstützt standardmäßig die vier Schlüssel RK_OEM_OTP_KEY0 - 3. Für RV1126/RV1109 wird außerdem der Schlüssel mit key_id RK_OEM_OTP_KEY_FW unterstützt.

<!-- Source EN PDF p.39, block 446 -->

##### 3.2.6.19 rk_set_oem_hr_otp_read_lock

<!-- Source EN PDF p.39, block 447 -->

```text
RK_RES rk_set_oem_hr_otp_read_lock(enum RK_OEM_OTP_KEYID key_id);
```

<!-- Source EN PDF p.39, block 448 -->

Funktion

<!-- Source EN PDF p.39, block 449 -->

Setzt das Lesesperrflag für den angegebenen OEM-OTP-Bereich. Nach erfolgreichem Setzen ist das Schreiben in diesen Bereich verboten, und die CPU-Software kann die vorhandenen Daten nicht mehr lesen. Der Schlüssel lässt sich weiterhin über rk_oem_otp_key_cipher_virt verwenden. Einzelheiten zu den OEM-OTP-Funktionen enthält `Rockchip_Developer_Guide_OTP_CN`.

<!-- Source EN PDF p.39, block 450 -->

Parameter

<!-- Source EN PDF p.39, block 451 -->

- [in] key_id - einzustellende Schlüsselkennung; unterstützt RK_OEM_OTP_KEY0 - 3

<!-- Source EN PDF p.39, block 452 -->

##### 3.2.6.20 rk_oem_otp_key_cipher

<!-- Source EN PDF p.39, block 453 -->

```text
RK_RES rk_oem_otp_key_cipher(enum RK_OEM_OTP_KEYID key_id, rk_cipher_config *config,
                             int32_t in_fd, int32_t out_fd, uint32_t len);
```

<!-- Source EN PDF p.39, block 454 -->

Funktion

<!-- Source EN PDF p.39, block 455 -->

Wählt den Schlüssel im OEM-OTP-Bereich aus und führt eine einzelne Cipher-Berechnung im dma_fd-Modus aus.

<!-- Source EN PDF p.40, block 456 -->

Parameter

<!-- Source EN PDF p.40, block 457 -->

- [in] key_id - Index des zu verwendenden OTP-Schlüssels

<!-- Source EN PDF p.40, block 458 -->

- [in] config - Algorithmus, Modus, Schlüssel, iv usw.

<!-- Source EN PDF p.40, block 459 -->

- [in] in_fd - dma_fd der Eingabe; darf mit dem der Ausgabe identisch sein

<!-- Source EN PDF p.40, block 460 -->

- [out] out_fd - dma_fd der Ausgabe

<!-- Source EN PDF p.40, block 461 -->

- [in] len - Eingabedatenlänge (Einheit: Byte)

<!-- Source EN PDF p.40, block 462 -->

Achtung

<!-- Source EN PDF p.40, block 463 -->

1\. key_id unterstützt standardmäßig RK_OEM_OTP_KEY0 - 3. Für RV1126 / RV1109 wird RK_OEM_OTP_KEY_FW unterstützt.

<!-- Source EN PDF p.40, block 464 -->

2\. Unterstützt die Algorithmustypen AES/SM4 und die Modi ECB/CBC/CTS/CTR/CFB/OFB.

<!-- Source EN PDF p.40, block 465 -->

3\. Die Schlüssellänge kann 16, 24 oder 32 Byte betragen. Auf RV1109/RV1126 sind 16 oder 32 Byte möglich. Wenn key_id RK_OEM_OTP_KEY_FW ist, beträgt die unterstützte Schlüssellänge 16 Byte.

<!-- Source EN PDF p.40, block 466 -->

4\. in_fd und out_fd dürfen identisch sein.

<!-- Source EN PDF p.40, block 467 -->

##### 3.2.6.21 rk_oem_otp_key_cipher_virt

<!-- Source EN PDF p.40, block 468 -->

```text
RK_RES rk_oem_otp_key_cipher_virt(enum RK_OEM_OTP_KEYID key_id, rk_cipher_config *config,
                                  uint8_t *src, uint8_t *dst, uint32_t len);
```

<!-- Source EN PDF p.40, block 469 -->

Funktion

<!-- Source EN PDF p.40, block 470 -->

Wählt den Schlüssel im OEM-OTP-Bereich aus und führt eine einzelne Cipher-Berechnung mit virtuellen Adressen aus.

<!-- Source EN PDF p.40, block 471 -->

Parameter

<!-- Source EN PDF p.40, block 472 -->

- [in] key_id - Index des zu verwendenden OTP-Schlüssels

<!-- Source EN PDF p.40, block 473 -->

- [in] config - Algorithmus, Modus, Schlüssel, iv usw.

<!-- Source EN PDF p.40, block 474 -->

- [in] src - Eingabedatenpuffer

<!-- Source EN PDF p.40, block 475 -->

- [out] dst - Ausgabedatenpuffer

<!-- Source EN PDF p.40, block 476 -->

- [in] len - Eingabedatenlänge (Einheit: Byte)

<!-- Source EN PDF p.40, block 477 -->

Achtung

<!-- Source EN PDF p.40, block 478 -->

1\. key_id unterstützt standardmäßig RK_OEM_OTP_KEY0 - 3. Für RV1126 / RV1109 wird RK_OEM_OTP_KEY_FW unterstützt.

<!-- Source EN PDF p.40, block 479 -->

2\. Unterstützt die Algorithmustypen AES/SM4 und die Modi ECB/CBC/CTS/CTR/CFB/OFB.

<!-- Source EN PDF p.40, block 480 -->

3\. Die Schlüssellänge kann 16, 24 oder 32 Byte betragen. Auf RV1109/RV1126 sind 16 oder 32 Byte möglich. Wenn key_id RK_OEM_OTP_KEY_FW ist, beträgt die unterstützte Schlüssellänge 16 Byte.

<!-- Source EN PDF p.40, block 481 -->

4\. in_fd und out_fd dürfen identisch sein.

<!-- Source EN PDF p.40, block 482 -->

5\. Die standardmäßige maximale Länge len der Ein- und Ausgabepuffer beträgt 1MB. Für RV1126/RV1109 beträgt len 500KB.

<!-- Source EN PDF p.41, block 483 -->

##### 3.2.6.22 rk_ae_init

<!-- Source EN PDF p.41, block 484 -->

Funktion


> Die Quelle enthält hier keinen Prototyp für rk_ae_init; es wurde keine Deklaration erfunden.



<!-- Source EN PDF p.41, block 485 -->

Initialisiert AEAD-Algorithmen. AES/SM4 werden unterstützt; derzeit wird nur GCM unterstützt.

<!-- Source EN PDF p.41, block 486 -->

Parameter

<!-- Source EN PDF p.41, block 487 -->

- [in] config - Algorithmus, Modus, Schlüssel, iv, AAD-Länge, Tag-Länge usw.; siehe rk_ae_config.

<!-- Source EN PDF p.41, block 488 -->

- [out] handle - AEAD-Handle

<!-- Source EN PDF p.41, block 489 -->

Achtung

<!-- Source EN PDF p.41, block 490 -->

Nach erfolgreicher Initialisierung müssen Sie rk_ae_final() zur Freigabe der Ressourcen aufrufen, unabhängig vom Erfolg der nachfolgenden Ausführung.

<!-- Source EN PDF p.41, block 491 -->

##### 3.2.6.23 rk_ae_set_aad

<!-- Source EN PDF p.41, block 492 -->

```text
RK_RES rk_ae_set_aad(rk_handle handle, int aad_fd);
```

<!-- Source EN PDF p.41, block 493 -->

Funktion

<!-- Source EN PDF p.41, block 494 -->

Empfängt den dma_fd der Daten und setzt die AAD-Parameter.

<!-- Source EN PDF p.41, block 495 -->

Parameter

<!-- Source EN PDF p.41, block 496 -->

- [in] handle - Cipher-Handle

<!-- Source EN PDF p.41, block 497 -->

- [in] aad_fd - dma_fd der AAD-Daten

<!-- Source EN PDF p.41, block 498 -->

Achtung

<!-- Source EN PDF p.41, block 499 -->

1\. handle muss mit rk_ae_init() initialisiert sein.

<!-- Source EN PDF p.41, block 500 -->

2\. Derzeit darf rk_ae_set_aad nach rk_ae_init nur einmal aufgerufen werden. Mehrfache AAD-Aktualisierungen werden nicht unterstützt und überschreiben den AAD-Inhalt.

<!-- Source EN PDF p.41, block 501 -->

##### 3.2.6.24 rk_ae_set_aad_virt

<!-- Source EN PDF p.41, block 502 -->

```text
RK_RES rk_ae_set_aad_virt(rk_handle handle, uint8_t *aad_virt);
```

<!-- Source EN PDF p.41, block 503 -->

Funktion

<!-- Source EN PDF p.41, block 504 -->

Empfängt eine virtuelle Adresse zum Setzen der AAD-Daten.

<!-- Source EN PDF p.41, block 505 -->

Parameter

<!-- Source EN PDF p.41, block 506 -->

- [in] handle - Cipher-Handle

<!-- Source EN PDF p.41, block 507 -->

- [in] in - Puffer der AAD-Daten

<!-- Source EN PDF p.41, block 508 -->

Achtung

<!-- Source EN PDF p.41, block 509 -->

1\. handle muss mit rk_ae_init() initialisiert sein.

<!-- Source EN PDF p.42, block 510 -->

2\. Derzeit darf rk_ae_set_aad_virt nach rk_ae_init nur einmal aufgerufen werden. Mehrfache AAD-Aktualisierungen werden nicht unterstützt und überschreiben den AAD-Inhalt.

<!-- Source EN PDF p.42, block 511 -->

##### 3.2.6.25 rk_ae_crypt

<!-- Source EN PDF p.42, block 512 -->

```text
RK_RES rk_ae_crypt(rk_handle handle, int in_fd, int out_fd, uint32_t len, uint8_t *tag);
```

<!-- Source EN PDF p.42, block 513 -->

Funktion

<!-- Source EN PDF p.42, block 514 -->

Verwendet einen AEAD-Algorithmus zur Ver- und Entschlüsselung sowie zur Tag-Berechnung/-Prüfung für über dma_fd übergebene Daten.

<!-- Source EN PDF p.42, block 515 -->

Parameter

<!-- Source EN PDF p.42, block 516 -->

- [in] handle - AE-Handle

<!-- Source EN PDF p.42, block 517 -->

- [in] in_fd - dma_fd der Eingabedaten

<!-- Source EN PDF p.42, block 518 -->

- [out] out_fd - dma_fd der Ausgabedaten

<!-- Source EN PDF p.42, block 519 -->

- [in] len - Eingabedatenlänge (Einheit: Byte)

<!-- Source EN PDF p.42, block 520 -->

- [in/out] tag - Eingabe beim Verschlüsseln, Ausgabe beim Entschlüsseln


> Quellenwiderspruch: Die chinesische Quelle nennt für tag eine Ausgabe beim Verschlüsseln und eine Eingabe beim Entschlüsseln; die englische Quelle gibt oben das Gegenteil an. Der Widerspruch bleibt ausdrücklich dokumentiert und wird nicht stillschweigend korrigiert. Prüfen Sie die passende SDK-Implementierung.



<!-- Source EN PDF p.42, block 521 -->

Achtung

<!-- Source EN PDF p.42, block 522 -->

1\. handle muss mit rk_ae_init() initialisiert sein.

<!-- Source EN PDF p.42, block 523 -->

2\. in_fd und out_fd können derselbe dma_fd sein.

<!-- Source EN PDF p.42, block 524 -->

3\. Mehrteilige Aufrufe werden nicht unterstützt.

<!-- Source EN PDF p.42, block 525 -->

##### 3.2.6.26 rk_ae_crypt_virt

<!-- Source EN PDF p.42, block 526 -->

```text
RK_RES rk_ae_crypt_virt(rk_handle handle, const uint8_t *in, uint8_t *out, uint32_t len,
uint8_t *tag);
```

<!-- Source EN PDF p.42, block 527 -->

Funktion

<!-- Source EN PDF p.42, block 528 -->

Verwendet einen AEAD-Algorithmus zur Ver- und Entschlüsselung von Daten über virtuelle Adressen.

<!-- Source EN PDF p.42, block 529 -->

Parameter

<!-- Source EN PDF p.42, block 530 -->

- [in] handle - AE-Handle

<!-- Source EN PDF p.42, block 531 -->

- [in] in - Eingabepuffer

<!-- Source EN PDF p.42, block 532 -->

- [out] out - Ausgabepuffer

<!-- Source EN PDF p.42, block 533 -->

- [in] len - Eingabedatenlänge (Einheit: Byte)

<!-- Source EN PDF p.42, block 534 -->

- [in/out] tag - Eingabe beim Verschlüsseln, Ausgabe beim Entschlüsseln


> Quellenwiderspruch: Die chinesische Quelle nennt für tag eine Ausgabe beim Verschlüsseln und eine Eingabe beim Entschlüsseln; die englische Quelle gibt oben das Gegenteil an. Der Widerspruch bleibt ausdrücklich dokumentiert und wird nicht stillschweigend korrigiert. Prüfen Sie die passende SDK-Implementierung.



<!-- Source EN PDF p.42, block 535 -->

Achtung

<!-- Source EN PDF p.42, block 536 -->

1\. handle muss mit rk_ae_init() initialisiert sein.

<!-- Source EN PDF p.42, block 537 -->

2\. Ein- und Ausgabe können denselben Puffer verwenden.

<!-- Source EN PDF p.43, block 538 -->

3\. Mehrteilige Aufrufe werden nicht unterstützt.

<!-- Source EN PDF p.43, block 539 -->

##### 3.2.6.27 rk_ae_final

<!-- Source EN PDF p.43, block 540 -->

```text
RK_RES rk_ae_final(rk_handle handle);
```

<!-- Source EN PDF p.43, block 541 -->

Funktion

<!-- Source EN PDF p.43, block 542 -->

Beendet den Berechnungsvorgang und gibt das Handle frei.

<!-- Source EN PDF p.43, block 543 -->

Parameter

<!-- Source EN PDF p.43, block 544 -->

- [in] handle - AE-Handle, das mit rk_ae_init() initialisiert sein muss

<!-- Source EN PDF p.43, block 545 -->

##### 3.2.6.28 rk_rsa_pub_encrypt

<!-- Source EN PDF p.43, block 546 -->

```text
RK_RES rk_rsa_pub_encrypt(const rk_rsa_pub_key_pack *pub, enum RK_RSA_CRYPT_PADDING padding,
const uint8_t *in, uint32_t in_len, uint8_t *out, uint32_t *out_len);
```

<!-- Source EN PDF p.43, block 547 -->

Funktion

<!-- Source EN PDF p.43, block 548 -->

Verschlüsselt Daten mit dem öffentlichen Schlüssel und unterstützt Verschlüsselungs-Padding.

<!-- Source EN PDF p.43, block 549 -->

Parameter

<!-- Source EN PDF p.43, block 550 -->

- [in] pub - Informationen zum öffentlichen RSA-Schlüssel; siehe rk_rsa_pub_key_pack.

<!-- Source EN PDF p.43, block 551 -->

- [in] padding - Padding-Typ für die Verschlüsselung; siehe RK_RSA_CRYPT_PADDING.

<!-- Source EN PDF p.43, block 552 -->

- [in] in - Eingabedaten

<!-- Source EN PDF p.43, block 553 -->

- [in] in_len - Eingabedatenlänge (Einheit: Byte). Bei zu langen Eingabedaten wird RK_CRYPTO_ERR_PADDING_OVERFLOW zurückgegeben.

<!-- Source EN PDF p.43, block 554 -->

- [out] out - mit dem öffentlichen Schlüssel verschlüsselter Geheimtext

<!-- Source EN PDF p.43, block 555 -->

- [out] out_len - Geheimtextlänge

<!-- Source EN PDF p.43, block 556 -->

Achtung

<!-- Source EN PDF p.43, block 557 -->

1\. Der öffentliche Schlüssel muss korrekt angeben, ob er als Klartext oder mit OTP KEY verschlüsselt vorliegt. Diese Einstellung beeinflusst die Schlüsselinterpretation.

<!-- Source EN PDF p.43, block 558 -->

2\. Ver- und Entschlüsselung im selben Speicherbereich werden nicht empfohlen.

<!-- Source EN PDF p.43, block 559 -->

##### 3.2.6.29 rk_rsa_priv_decrypt

<!-- Source EN PDF p.43, block 560 -->

```text
RK_RES rk_rsa_priv_decrypt(const rk_rsa_priv_key_pack *priv, enum RK_RSA_CRYPT_PADDING
padding, const uint8_t *in, uint32_t in_len, uint8_t *out, uint32_t *out_len);
```

<!-- Source EN PDF p.43, block 561 -->

Funktion

<!-- Source EN PDF p.43, block 562 -->

Entschlüsselt Daten mit dem privaten Schlüssel und unterstützt die Auswertung des Paddings.

<!-- Source EN PDF p.44, block 563 -->

Parameter

<!-- Source EN PDF p.44, block 564 -->

- [in] priv - Informationen zum privaten RSA-Schlüssel; siehe rk_rsa_priv_key_pack

<!-- Source EN PDF p.44, block 565 -->

- [in] padding - muss mit dem Padding-Typ der Verschlüsselung übereinstimmen; siehe RK_RSA_CRYPT_PADDING

<!-- Source EN PDF p.44, block 566 -->

- [in] in - Eingabedaten

<!-- Source EN PDF p.44, block 567 -->

- [in] in_len - Eingabedatenlänge (Einheit: Byte)

<!-- Source EN PDF p.44, block 568 -->

- [out] out - mit dem privaten Schlüssel entschlüsselter Klartext

<!-- Source EN PDF p.44, block 569 -->

- [out] out_len - Klartextlänge

<!-- Source EN PDF p.44, block 570 -->

Achtung

<!-- Source EN PDF p.44, block 571 -->

1\. Der private Schlüssel muss korrekt angeben, ob er als Klartext oder mit OTP KEY verschlüsselt vorliegt. Diese Einstellung beeinflusst die Schlüsselinterpretation.

<!-- Source EN PDF p.44, block 572 -->

2\. Ver- und Entschlüsselung im selben Speicherbereich werden nicht empfohlen.

<!-- Source EN PDF p.44, block 573 -->

##### 3.2.6.30 rk_rsa_priv_encrypt

<!-- Source EN PDF p.44, block 574 -->

```text
RK_RES rk_rsa_priv_encrypt(const rk_rsa_priv_key_pack *priv, enum RK_RSA_CRYPT_PADDING
padding, const uint8_t *in, uint32_t in_len, uint8_t *out, uint32_t *out_len);
```

<!-- Source EN PDF p.44, block 575 -->

Funktion

<!-- Source EN PDF p.44, block 576 -->

Verschlüsselt Daten mit dem privaten Schlüssel und unterstützt Verschlüsselungs-Padding.

<!-- Source EN PDF p.44, block 577 -->

Parameter

<!-- Source EN PDF p.44, block 578 -->

- [in] priv - Informationen zum privaten RSA-Schlüssel; siehe rk_rsa_priv_key_pack

<!-- Source EN PDF p.44, block 579 -->

- [in] padding - Padding-Typ für die Verschlüsselung; siehe RK_RSA_CRYPT_PADDING

<!-- Source EN PDF p.44, block 580 -->

- [in] in - Eingabedaten

<!-- Source EN PDF p.44, block 581 -->

- [in] in_len - Eingabedatenlänge (Einheit: Byte). Bei zu langen Eingabedaten wird RK_CRYPTO_ERR_PADDING_OVERFLOW zurückgegeben.

<!-- Source EN PDF p.44, block 582 -->

- [out] out - mit dem privaten Schlüssel verschlüsselter Geheimtext

<!-- Source EN PDF p.44, block 583 -->

- [out] out_len - Geheimtextlänge

<!-- Source EN PDF p.44, block 584 -->

Achtung

<!-- Source EN PDF p.44, block 585 -->

1\. Der private Schlüssel muss korrekt angeben, ob er als Klartext oder mit OTP KEY verschlüsselt vorliegt. Diese Einstellung beeinflusst die Schlüsselinterpretation.

<!-- Source EN PDF p.44, block 586 -->

2\. Ver- und Entschlüsselung im selben Speicherbereich werden nicht empfohlen.

<!-- Source EN PDF p.44, block 587 -->

##### 3.2.6.31 rk_rsa_pub_decrypt

<!-- Source EN PDF p.44, block 588 -->

```text
RK_RES rk_rsa_pub_decrypt(const rk_rsa_pub_key_pack *pub, enum RK_RSA_CRYPT_PADDING padding,
const uint8_t *in, uint32_t in_len, uint8_t *out, uint32_t *out_len);
```

<!-- Source EN PDF p.45, block 589 -->

Funktion

<!-- Source EN PDF p.45, block 590 -->

Entschlüsselt Daten mit dem öffentlichen Schlüssel und unterstützt die Auswertung des Paddings.

<!-- Source EN PDF p.45, block 591 -->

Parameter

<!-- Source EN PDF p.45, block 592 -->

- [in] pub - Informationen zum öffentlichen RSA-Schlüssel; siehe rk_rsa_pub_key_pack.

<!-- Source EN PDF p.45, block 593 -->

- [in] padding - muss mit dem Padding-Typ der Verschlüsselung übereinstimmen; siehe RK_RSA_CRYPT_PADDING

<!-- Source EN PDF p.45, block 594 -->

- [in] in - Eingabedaten

<!-- Source EN PDF p.45, block 595 -->

- [in] in_len - Eingabedatenlänge (Einheit: Byte)

<!-- Source EN PDF p.45, block 596 -->

- [out] out - mit dem öffentlichen Schlüssel entschlüsselter Klartext

<!-- Source EN PDF p.45, block 597 -->

- [out] out_len - Klartextlänge

<!-- Source EN PDF p.45, block 598 -->

Achtung

<!-- Source EN PDF p.45, block 599 -->

1\. Der öffentliche Schlüssel muss korrekt angeben, ob er als Klartext oder mit OTP KEY verschlüsselt vorliegt. Diese Einstellung beeinflusst die Schlüsselinterpretation.

<!-- Source EN PDF p.45, block 600 -->

2\. Ver- und Entschlüsselung im selben Speicherbereich werden nicht empfohlen.

<!-- Source EN PDF p.45, block 601 -->

##### 3.2.6.32 rk_rsa_sign

<!-- Source EN PDF p.45, block 602 -->

```text
RK_RES rk_rsa_sign(const rk_rsa_priv_key_pack *priv, enum RK_RSA_SIGN_PADDING padding, const
uint8_t *in, uint32_t in_len, const uint8_t *hash, uint8_t *out, uint32_t *out_len);
```

<!-- Source EN PDF p.45, block 603 -->

Funktion

<!-- Source EN PDF p.45, block 604 -->

Verwendet den privaten Schlüssel zum Signieren des berechneten Hash-Werts der Eingabedaten oder eines extern bereitgestellten Hash-Werts.

<!-- Source EN PDF p.45, block 605 -->

Parameter

<!-- Source EN PDF p.45, block 606 -->

- [in] priv - Informationen zum privaten RSA-Schlüssel; siehe rk_rsa_priv_key_pack

<!-- Source EN PDF p.45, block 607 -->

- [in] padding - Padding-Typ für die Signatur; siehe RK_RSA_SIGN_PADDING

<!-- Source EN PDF p.45, block 608 -->

- [in] in - Eingabedaten, deren Hash zuerst berechnet und anschließend mit dem privaten Schlüssel signiert wird (optional)

<!-- Source EN PDF p.45, block 609 -->

- [in] in_len - Eingabedatenlänge (Einheit: Byte)

<!-- Source EN PDF p.45, block 610 -->

- [in] hash - Hash-Wert (optional); die Hash-Länge wird durch den Padding-Algorithmus bestimmt. Der Hash-Wert kann direkt mit dem privaten Schlüssel signiert werden.

<!-- Source EN PDF p.45, block 611 -->

- [out] out - mit dem privaten Schlüssel erzeugte Signaturdaten

<!-- Source EN PDF p.45, block 612 -->

- [out] out_len - Länge der Signaturdaten

<!-- Source EN PDF p.45, block 613 -->

Achtung

<!-- Source EN PDF p.45, block 614 -->

1\. Der private Schlüssel muss korrekt angeben, ob er als Klartext oder mit OTP KEY verschlüsselt vorliegt. Diese Einstellung beeinflusst die Schlüsselinterpretation.

<!-- Source EN PDF p.45, block 615 -->

2\. Bei in != NULL && hash == NULL berechnet die Schnittstelle den Hash-Wert der Eingabedaten; der Hash-Algorithmus wird durch das Padding-Format bestimmt. Anschließend wird der Hash-Wert mit Padding signiert.

<!-- Source EN PDF p.46, block 616 -->

3\. Bei hash != NULL wendet die Schnittstelle das Padding direkt auf den übergebenen Hash-Wert an.

<!-- Source EN PDF p.46, block 617 -->

##### 3.2.6.33 rk_rsa_verify

<!-- Source EN PDF p.46, block 618 -->

```text
RK_RES rk_rsa_verify(const rk_rsa_pub_key_pack *pub, enum RK_RSA_SIGN_PADDING padding, const
uint8_t *in, uint32_t in_len, const uint8_t *hash, uint8_t *sign, uint32_t sign_len);
```

<!-- Source EN PDF p.46, block 619 -->

Funktion

<!-- Source EN PDF p.46, block 620 -->

Prüft die Signatur mit dem öffentlichen Schlüssel.

<!-- Source EN PDF p.46, block 621 -->

Parameter

<!-- Source EN PDF p.46, block 622 -->

- [in] pub - Informationen zum öffentlichen RSA-Schlüssel; siehe rk_rsa_pub_key_pack.

<!-- Source EN PDF p.46, block 623 -->

- [in] padding - muss mit dem Padding-Typ der Signaturerstellung übereinstimmen; siehe RK_RSA_SIGN_PADDING

<!-- Source EN PDF p.46, block 624 -->

- [in] in - Eingabedaten, deren Hash zuerst berechnet und anschließend mit dem privaten Schlüssel signiert wird (optional)

<!-- Source EN PDF p.46, block 625 -->

- [in] in_len - Eingabedatenlänge (Einheit: Byte)

<!-- Source EN PDF p.46, block 626 -->

- [in] hash - Hash-Wert (optional)

<!-- Source EN PDF p.46, block 627 -->

- [in] sign - Signaturdaten

<!-- Source EN PDF p.46, block 628 -->

- [in] sign_len - Länge der Signaturdaten (Einheit: Byte)

<!-- Source EN PDF p.46, block 629 -->

Achtung

<!-- Source EN PDF p.46, block 630 -->

1\. Der öffentliche Schlüssel muss korrekt angeben, ob er als Klartext oder mit OTP KEY verschlüsselt vorliegt. Diese Einstellung beeinflusst die Schlüsselinterpretation.

<!-- Source EN PDF p.46, block 631 -->

2\. Bei in != NULL && hash == NULL berechnet die Schnittstelle den Hash-Wert von in; der Hash-Algorithmus wird durch das Padding-Format bestimmt. Anschließend wird der Hash-Wert unter Berücksichtigung des Paddings geprüft.

<!-- Source EN PDF p.46, block 632 -->

3\. Bei hash != NULL wendet die Schnittstelle das Padding direkt auf den übergebenen Hash-Wert an.

<!-- Source EN PDF p.46, block 633 -->

##### 3.2.6.34 rk_ec_verify

<!-- Source EN PDF p.46, block 634 -->

```text
RK_RES rk_ec_verify(const rk_ec_pub_key_pack *pub, int hash_algo,
            const uint8_t *in, uint32_t in_len, const uint8_t *hash,
            uint8_t *sign, uint32_t sign_len);
```

<!-- Source EN PDF p.46, block 635 -->

Funktion

<!-- Source EN PDF p.46, block 636 -->

Prüft die ECC-/SM2-Signatur mit dem öffentlichen Schlüssel.

<!-- Source EN PDF p.46, block 637 -->

Parameter

<!-- Source EN PDF p.46, block 638 -->

- [in] pub - öffentlicher ECC-/SM2-Schlüssel; siehe rk_ec_pub_key_pack

<!-- Source EN PDF p.46, block 639 -->

- [in] hash_algo - das Hash-Algorithmusformat muss mit dem Signaturformat übereinstimmen

<!-- Source EN PDF p.46, block 640 -->

- [in] in - Eingabedaten, deren Hash zuerst berechnet und anschließend mit dem privaten Schlüssel signiert wird (optional)

<!-- Source EN PDF p.46, block 641 -->

- [in] in_len - Eingabedatenlänge (Einheit: Byte)

<!-- Source EN PDF p.46, block 642 -->

- [in] hash - Hash-Wert (optional)

<!-- Source EN PDF p.47, block 643 -->

- [in] sign - Signaturdaten

<!-- Source EN PDF p.47, block 644 -->

- [in] sign_len - Länge der Signaturdaten (Einheit: Byte)

<!-- Source EN PDF p.47, block 645 -->

Achtung

<!-- Source EN PDF p.47, block 646 -->

1\. Der öffentliche Schlüssel muss korrekt angeben, ob er als Klartext oder mit OTP KEY verschlüsselt vorliegt. Diese Einstellung beeinflusst die Schlüsselinterpretation.

<!-- Source EN PDF p.47, block 647 -->

2\. Bei in != NULL && hash == NULL berechnet die Schnittstelle den Hash-Wert von in mit dem durch hash_algo bestimmten Algorithmus. Anschließend wird der Hash-Wert unter Berücksichtigung des Paddings geprüft.

<!-- Source EN PDF p.47, block 648 -->

3\. Bei hash != NULL wendet die Schnittstelle das Padding direkt auf den übergebenen Hash-Wert an.

<!-- Source EN PDF p.47, block 649 -->

#### 3.2.7 Debug-Protokollierung

<!-- Source EN PDF p.47, block 650 -->

Die librkcrypto-Protokollierung ist derzeit in die folgenden Stufen unterteilt.

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

Die Standardprotokollstufe ist TRACE_INFO. Sie lässt sich über die Umgebungsvariable ändern, die vor dem Laden der librkcrypto-Bibliothek gesetzt werden muss. Alternativ kann die Stufe vor rk_crypto_init über rkcrypto_set_trace_level eingestellt werden.

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

## 4. Leistung von Hardware-Crypto

<!-- Source EN PDF p.47, block 658 -->

Nachfolgend sind typische Leistungswerte von Chips unter U-Boot als Referenz aufgeführt. Konkrete Leistungsdaten finden Sie im Verzeichnis "perf_reports" des librkcrypto-Quellcodes. Die dortigen Werte wurden durch Aufrufe des Crypto-Kerneltreibers aus der Anwendungsebene bei fest eingestellter maximaler CPU-/DDR-Frequenz gemessen. Aufgrund der Systemaufrufe ist die Leistung etwas geringer als beim U-Boot-Test.

<!-- Source EN PDF p.48, block 659 -->

### 4.1 Einflussfaktoren auf die Leistung

<!-- Source EN PDF p.48, block 660 -->

1\. Ob die den Benutzerdaten entsprechenden physischen Adressen zusammenhängend sind und die Startadresse auf 64 Byte ausgerichtet ist, beeinflusst die Berechnungseffizienz. Die CRYPTO-IP besitzt keine integrierte MMU und kann nur Daten in zusammenhängendem Speicher mit entsprechend ausgerichteter Startadresse verarbeiten. Bei Verwendung virtueller Adressen virt kann der Treiber einen Berechnungsauftrag in mehrere Hardwareberechnungen aufteilen, wenn Ausrichtung oder Kontiguität fehlen. Dabei werden die Benutzerdaten zur Berechnung in einen physisch zusammenhängenden 32KByte-Puffer innerhalb des Treibers kopiert, was die Leistung beeinträchtigt.

<!-- Source EN PDF p.48, block 661 -->

2\. Blockgröße eines einzelnen Berechnungsvorgangs: Je größer der Block, desto näher liegt die tatsächliche an der theoretischen Leistung. Neben der eigentlichen Hardwareberechnung verursacht der CRYPTO-Treiber zusätzlichen Aufwand durch Kernelaufrufe, Aufgabenwarteschlangen, Cache-Flushes usw. Dieser Zeitaufwand ist relativ konstant. Bei kleinen Blöcken steigt sein Anteil an der Gesamtzeit, wodurch die tatsächliche Leistung stark abnimmt.

<!-- Source EN PDF p.48, block 662 -->

Als Beispiel für den Einfluss der Blockgröße auf die Rechenleistung dient der librkcrypto-Test auf RK3588. Die Ergebnisse lauten:

<!-- Source EN PDF p.48, block 663 -->

![Technische Originalabbildung — PDF S. 48](/docs/rockchip-crypto-hwrng/assets/en-p48-figure1.png)

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

Die obige Abbildung zeigt, dass eine Blockgröße von 1MByte und zusammenhängender Speicher über dma_fd eine bessere Leistung ermöglichen. Für kleine Datenmengen von 64KByte oder weniger wird Hardware-CRYPTO nicht empfohlen; Softwarealgorithmen sind vorzuziehen. Einige Chips unterstützen NEON-/CE-Befehlssätze zur Beschleunigung der Ver- und Entschlüsselung.

<!-- Source EN PDF p.49, block 665 -->

### 4.2 Leistung von Hardware-Crypto unter U-Boot

<!-- Source EN PDF p.49, block 666 -->

#### 4.2.1 Leistung von crypto v1

<!-- Source EN PDF p.49, block 667 -->

Testumgebung (U-Boot RK3399):

<!-- Source EN PDF p.49, block 668 -->

Taktfrequenz: CRYPTO_CORE = 200M. Die maximale Frequenz variiert geringfügig je nach Chip.

<!-- Source EN PDF p.49, block 669 -->

CIPHER-/HASH-Leistung:

<!-- Source EN PDF p.49, block 670 -->

| ALGO | Tatsächlich (MBps) | Theoretisch (MBps) |
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

RSA-Leistung:

<!-- Source EN PDF p.49, block 672 -->

| RSA-Schlüssellänge (nbits) | Verschlüsselung mit öffentlichem / Entschlüsselung mit privatem Schlüssel (ms) |
|---|---|
| 2048 | 8 / 632 |

<!-- Source EN PDF p.49, block 673 -->

#### 4.2.2 Leistung von crypto v2 / v3 / v4

<!-- Source EN PDF p.49, block 674 -->

Der Rechenkern dieser CRYPTO-IP-Versionen hat sich nicht wesentlich geändert. Leistungsunterschiede ergeben sich daher nur aus der Betriebsfrequenz der CRYPTO-IP. CRYPTO V3/V4 können bis zu 350M erreichen; ihre theoretische Leistung lässt sich durch einfache Umrechnung auf Grundlage von V2 bestimmen.

<!-- Source EN PDF p.49, block 675 -->

Testumgebung (U-Boot RV1126 V2):

<!-- Source EN PDF p.49, block 676 -->

Taktfrequenz: CRYPTO_CORE = 200M, CRYPTO_PKA=300M, DDR=786M

<!-- Source EN PDF p.49, block 677 -->

Hash/HMAC: Insgesamt werden 128M Daten getestet, jeweils 4M pro Berechnung.

<!-- Source EN PDF p.49, block 678 -->

DES/3DES/AES/SM4: Insgesamt werden 128M Daten getestet, jeweils 4M Klartext und 4M AAD-Daten pro Berechnung.

<!-- Source EN PDF p.50, block 679 -->

![Technische Originalabbildung — PDF S. 50](/docs/rockchip-crypto-hwrng/assets/en-p50-figure1.png)

| Algorithmus | Modus | Tatsächlicher Quellwert (MBps) | Theoretisch (MBps) |
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

RSA-Test: RSA-Schlüssel einschließlich n, e und d erzeugen und Tests zur Verschlüsselung mit dem öffentlichen sowie Entschlüsselung mit dem privaten Schlüssel durchführen.

<!-- Source EN PDF p.50, block 681 -->

Verschlüsselung mit öffentlichem Schlüssel: ciphertext = d ^e % n

<!-- Source EN PDF p.50, block 682 -->

Entschlüsselung mit privatem Schlüssel: plaintext = d^d % n

<!-- Source EN PDF p.50, block 683 -->

![Technische Originalabbildung — PDF S. 50](/docs/rockchip-crypto-hwrng/assets/en-p50-figure2.png)

| RSA | Operation | Zeit laut Quelle (ms) |
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

### 5.1 Was bedeuten seriell und parallel bei der theoretischen Algorithmusleistung, und können Benutzer dies auswählen?

<!-- Source EN PDF p.51, block 686 -->

Antwort: Die Ver- und Entschlüsselung mit OFB, CCM, GCM, CBC_MAC, CMAC und BYPASS sowie die Verschlüsselung mit CFB, CBC und CTS erfolgen seriell. Die Ver- und Entschlüsselung mit ECB, CTR und XTS sowie die Entschlüsselung mit CFB, CBC und CTS erfolgen parallel.

<!-- Source EN PDF p.51, block 687 -->

Hardware-CRYPTO verfügt über vier Recheneinheiten und führt je nach Algorithmusmodus automatisch serielle oder parallele Ver- und Entschlüsselung aus. Benutzer können diesen Ablauf nicht beeinflussen und müssen keine zusätzlichen Schritte ausführen. Wird ein paralleler Modus gewählt, ergibt sich entsprechend eine höhere Effizienz. Die Quelle bevorzugt aus Sicherheits- und Anwendungssicht den CTR-Modus, bei dem sowohl Ver- als auch Entschlüsselung parallel arbeiten.

<!-- Source EN PDF p.51, block 688 -->

### 5.2 Warum weicht die Leistung in "perf_reports" stark vom theoretischen Wert ab?

<!-- Source EN PDF p.51, block 689 -->

Antwort: Der theoretische Wert wird aus der Betriebsfrequenz der CRYPTO-IP und den Zyklen der Hardware-Recheneinheit abgeleitet. Anderer Aufwand des tatsächlichen Betriebs wird vollständig vernachlässigt. In der Praxis kommen zur reinen CRYPTO-IP-Rechenzeit folgende Zeitaufwände hinzu:

<!-- Source EN PDF p.51, block 690 -->

1\. Kernel-Systemaufrufe benötigen Zeit: sowohl der Eintritt in den Kernel als auch die Rückkehr nach der Ausführung.

<!-- Source EN PDF p.51, block 691 -->

2\. Datenübertragungen benötigen Zeit. Bei physisch nicht zusammenhängendem Speicher muss der Treiber die Daten zusätzlich ordnen und kopieren; dies hängt von der CPU-Frequenz ab.

<!-- Source EN PDF p.51, block 692 -->

3\. Hardware-CRYPTO überträgt und verarbeitet Daten mittels DMA. Je größer der Datenblock, desto näher liegt die Leistung am theoretischen Wert. Aufgrund von Systemgrenzen können die Datenblöcke jedoch nicht beliebig groß sein. Die Demo verwendet 1MByte.

<!-- Source EN PDF p.51, block 693 -->

4\. Das Aktualisieren des Caches im Kerneltreiber zur Sicherstellung der Cache-Kohärenz benötigt Zeit.

<!-- Source EN PDF p.51, block 694 -->

5\. Hinzu kommen Aufrufkosten des Kerneltreibers, beispielsweise das Serialisieren parallel eintreffender Benutzeraufträge zur Hardwareberechnung, sowie der Aufwand für die Aufgabenplanung. Seriell/parallel bezieht sich hier auf Berechnungsaufträge und ist nicht mit seriellen/parallelen Algorithmen gleichzusetzen.

<!-- Source EN PDF p.51, block 695 -->

### 5.3 Warum unterscheiden sich die theoretischen Werte von paralleler und serieller Verarbeitung um den Faktor 4, die tatsächlichen Werte jedoch weniger stark?

<!-- Source EN PDF p.51, block 696 -->

Antwort: Die in Frage 5.2 aufgeführten Zeitaufwände sind für serielle und parallele Algorithmen im Wesentlichen gleich. Angenommen, das Framework benötigt konstant 10ms und die Hardwareberechnung im seriellen Modus 90ms, dann erreicht der serielle Modus 90% seiner Leistung. Benötigt die parallele Berechnung 20ms, erreicht sie nur 66%.

<!-- Source EN PDF p.52, block 697 -->

Zusammengefasst erreicht das Verhältnis der tatsächlichen Leistung im seriellen und parallelen Modus nur dann den theoretischen Wert 1:4, wenn der zusätzliche Framework-Aufwand verschwindend klein ist und gegen 0 geht.

<!-- Source EN PDF p.52, block 698 -->

## 6. Referenzen

<!-- Source EN PDF p.52, block 699 -->

## 7. Anhang

<!-- Source EN PDF p.52, block 700 -->

### 7.1 Fachbegriffe



> Die Quellkapitel 6 und 7 sowie §7.1 enthalten nur Überschriften; auf der letzten PDF-Seite folgt kein weiterer Text. Die leeren Quellabschnitte sind hier ausdrücklich dokumentiert.


{% endraw %}
