---
title: "Руководство разработчика Rockchip Linux Secure Boot"
description: "Руководство разработчика Rockchip Linux Secure Boot — V4.1.1 / V4.0.0"
excerpt: "Руководство разработчика Rockchip Linux Secure Boot"
translation_key: "203-rockchip-linux-secure-boot"
slug: "203-rockchip-linux-secure-boot"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "system"
products: []
tags: [ArmSoM, Rockchip, Linux, Secure-Boot, AVB, FIT, TEE]
---

{% raw %}

# Руководство разработчика Rockchip Linux Secure Boot

Основа — RK-KF-YF-379, китайский V4.1.1 (2025-04-16, 44 страницы), сверенный с английским V4.0.0 (2024-01-11, 40 страниц). Полный перевод английской технической части дополнен новыми китайскими разделами, кодом и таблицами. Сохранены все главы, технические рисунки и код; титульные, юридические, контактные сведения и история изменений удалены. Это справочный материал для ArmSoM без аппаратной проверки. Проверьте плату, SDK, носитель, цепочку загрузки и TEE. Запись OTP/eFuse необратима и может навсегда заблокировать устройство. Примерные секреты и пароли запрещено использовать в производстве. Команды сохранены из источника, не выполнялись и не признаны безопасными для прямого копирования.

| Платформа (китайский V4.1.1) | Подпись | Носитель | Настройка уровня TEE | Особые указания |
| --- | --- | --- | --- | --- |
| RK3308 / RK3328 / RK3326 / PX30 / RK3358 | AVB | OTP | Нет | Нет |
| RK3399 | AVB | EFUSE | Нет | Нет |
| RK3566 / RK3568 | FIT | OTP | Нет | Нет |
| RK3588 / RK3576 / RK3562 | FIT | OTP | Да | Нет |
| RV1126 | FIT | OTP | Нет | Да |
| RV1106 / RV1103 / RK3506 | FIT | OTP | Да | Да |
| RV1126B | FIT | OTP | Да | Нет |

## 1. Введение в Secure Boot

Secure Boot проверяет целостность и подлинность прошивки устройства и препятствует внедрению ПО посторонними. Изменение защищённого раздела вызывает ошибку, вплоть до остановки загрузки. Secure Boot защищает ранние этапы загрузки; для системного и пользовательского разделов документ дополнительно описывает проверку и шифрование.

|  | System-Verity | System-Encryption |
| --- | --- | --- |
| На носителе | Открытый текст | Шифротекст |
| Системный ключ | Открытый ключ в Boot.img (термин источника; см. пояснение корневого хеша) | Зашифрованный ключ в RPMB [1] |
| Защита от копирования | Нет | Да |
| Защита от изменения | Да; изменение вызывает ошибки ввода-вывода | Источник: да; изменения нарушают расшифровку, но это не гарантия аутентифицированной целостности |

Сначала определите класс чипа по таблице платформ: ресурсы и стратегии безопасности различаются. Документ основан на общем SDK и описывает построение защиты с нуля, а также скрипты управления и упрощения процесса.

### 1.1 Процесс Linux Secure Boot

![Руководство разработчика Rockchip Linux Secure Boot — en 6](/docs/rockchip-linux-secure-boot/assets/en-p006-figure-01.png)

Схема показывает проверку loader в Bootrom; другие этапы аналогичны. Подписанный пакет состоит из Firmware (OBM Code) + Digital Signature + Public Key; подпись и ключ добавляет инструмент подписания. Прошивка хранится в eMMC/flash, хеш открытого ключа — в OTP/eFuse чипа. При загрузке хеш проверяет открытый ключ прошивки, а ключ — цифровую подпись. Так чип связывается с подписанным кодом. Подробности: Rockchip-Secure-Boot-Application-Note-V1.9.pdf.

![Руководство разработчика Rockchip Linux Secure Boot — en 7](/docs/rockchip-linux-secure-boot/assets/en-p007-figure-01.png)

Trust находится на одном уровне с U-Boot и проверяется SPL/Loader тем же способом; новые платформы включают Trust в U-Boot. По описанной схеме прошивки используют один набор ключей: в OTP/eFuse достаточно записать хеш открытого ключа, затем каждый этап проверяет следующий, создавая цепочку доверия. Код U-Boot защищает следующие этапы, а проверку/расшифрование системы выполняет Ramdisk (раздел о защите системы).

### 1.2 Защищённое хранение

Корень доверия должен храниться в аппаратном модуле и быть жёстко связан с устройством. Помимо него Linux предоставляет следующие области для пользовательской защищённой информации.

| Область хранения | Описание |
| --- | --- |
| OTP / eFuse | Внутри SoC; необратимая запись предохранителей. OTP записывает Miniloader/SPL, eFuse — PC-инструменты. Исторический английский список: eFuse RK3399/RK3288; OTP RK3308/RK3326/PX30/RK3328. Ёмкость зависит от чипа, обычно один-два ключа. |
| RPMB | Физический раздел eMMC, невидимый как файловая система; только аутентифицированный доступ SoC/TEE, шифрование, монтирование невозможно. |
| Security Partition | Логический раздел flash вместо отсутствующего RPMB; шифрование, доступ через TEE, монтирование невозможно. Принудительно стирается. Английский V4.0.0 говорит об ошибке TEE и отказе Secure Boot; китайский V4.1.1 — о повторной инициализации TEE и потере прежних данных. |

OTP/eFuse преимущественно используется Rockchip; пользовательские данные следует хранить прежде всего в RPMB/Security. При обязательной потребности в OTP запросите документацию через коммерческий канал.

## 2. Secure Boot

В Linux есть схемы FIT и AVB с одинаковой целью защиты, но их нельзя смешивать. Конкретную схему выбирайте по таблице платформ.

### 2.1 FIT

FIT (Flattened Image Tree) — поддерживаемый U-Boot формат загрузки, упаковки и проверки нескольких образов. Файл its (Image Source File) описывает образы; mkimage создаёт itb (Flattened Image Tree Blob). its использует синтаксис DTS, совместимый с libfdt и соответствующими инструментами, и собственную схему проверки подписи. Подробности: глава 12 Rockchip_Developer_Guide_UBoot_Nextdev.

#### 2.1.1 Создание ключей

В проекте U-Boot выполните три команды для создания пары RSA. Обычно она создаётся один раз и затем используется для подписания и проверки. Храните ключи безопасно.

```text
# 1. The directory where the key is placed: keys
mkdir -p keys

# 2. Use Rockchip's "rk_sign_tool" tool to generate RSA2048 private keys,
privateKey.pem and publicKey.pem, rename and store them as keys/dev.key and
keys/dev.pubkey respectively. The command is:
../rkbin/tools/rk_sign_tool kk --bits 2048 --out .
ln -s privateKey.pem keys/dev.key
ln -s publicKey.pem keys/dev.pubkey

# 3.Use -x509 and the private key to generate a self-signed certificate:
keys/dev.crt (the effect is essentially the same as the public key)
openssl req -batch -new -x509 -key keys/dev.key -out keys/dev.crt
```

При ошибке отсутствия .rnd, например Can't load /home4/cjh//.rnd into RNG и RAND_load_file:Cannot open file:../crypto/rand/randfile.c:88:Filename=/home4/cjh//.rnd, источник предлагает touch ~/.rnd. Результат проверить через ls keys/. Это обработка указанного исходного случая, не рекомендация ослаблять источник случайности.

```text
dev.crt dev.key dev.pubkey
```

Имена keys, dev.key, dev.crt, dev.pubkey фиксированы в its; изменение приводит к ошибке упаковки.

#### 2.1.2 Конфигурация

В defconfig U-Boot включите:

```text
# Required
CONFIG_FIT_SIGNATURE=y
CONFIG_SPL_FIT_SIGNATURE=y

# Optional
CONFIG_FIT_ROLLBACK_PROTECT=y       # boot.img Rollback protect
CONFIG_SPL_FIT_ROLLBACK_PROTECT=y   # uboot.img Rollback protect
```

Рекомендуется выбирать параметры в make menuconfig и обновлять defconfig через make savedefconfig, чтобы избежать неверных зависимостей и ошибок сборки.

#### 2.1.3 Сборка U-Boot и подписывание прошивки

При сборке одновременно подписываются boot.img, recovery.img, loader.bin и uboot.img. Заранее определите пути boot.img/recovery.img. (1) Базовая команда без защиты от отката:

```text
./make.sh rv1126 --spl-new --boot_img boot.img --recovery_img recovery.img
```

Результат сборки:

```text
#......
# After compilation is completed, generate signed uboot.img, boot.img and
recovery.img.
start to sign rv1126_spl_loader_v1.00.100.bin
# ......
sign loader ok.
# ......
Image(signed, version=0):  uboot.img (FIT with uboot, trust...) is ready
Image(signed, version=0):  recovery.img (FIT with kernel, fdt, resource...) is
ready
Image(signed, version=0):  boot.img (FIT with kernel, fdt, resource...) is ready
Image(signed):  rv1126_spl_loader_v1.05.106.bin (with spl, ddr, usbplug) is ready
pack uboot.img okay! Input: /home4/cjh/rkbin/RKTRUST/RV1126TOS.ini

Platform RV1126 is build OK, with new .config(make rv1126-secure_defconfig)
```

(2) Расширение 1: при защите от отката добавьте параметры версии rollback к базовой команде. Пример:

```text
// Specify the minimum version numbers of uboot.img, boot.img and recovery.img as
10, 12 and 12 respectively.
./make.sh rv1126 --spl-new --boot_img boot.img --recovery_img recovery.img --
rollback-index-uboot 10 --rollback-index-boot 12 --rollback-index-recovery 12
```

Результат сборки:

```text
...

// After the compilation is completed, the signed uboot.img, boot.img and
recovery.img are generated, and include the anti-rollback version number.
start to sign rv1126_spl_loader_v1.00.100.bin
......
sign loader ok.
......
Image(signed, version=0, rollback-index=10):  uboot.img (FIT with uboot, trust)
is ready
Image(signed, version=0, rollback-index=12):  recovery.img (FIT with kernel, fdt,
resource...) is ready
Image(signed, version=0, rollback-index=12):  boot.img (FIT with kernel, fdt,
resource...) is ready
Image(signed):  rv1126_spl_loader_v1.00.100.bin (with spl, ddr, usbplug) is ready
```

(3) Расширение 2: для необратимой записи хеша открытого ключа в OTP/eFuse добавьте --burn-key-hash к (1) или (2). Пример:

```text
# Specify the minimum version numbers of uboot.img, boot.img and recovery.img as
10, 12 and 12 respectively.
# Require burning the public key hash into OTP/eFUSE in the SPL stage.
./make.sh rv1126 --spl-new --boot_img boot.img --recovery_img recovery.img --
rollback-index-uboot 10 --rollback-index-boot 12 --rollback-index-recovery 12 --
burn-key-hash
```

При включённой защите от отката новая версия не может быть ниже предыдущей; равная допускается. Иначе загрузка запрещается. Результат сборки:

```text
#......
# Enable burn-key-hash
### spl/u-boot-spl.dtb: burn-key-hash=1

# After compilation is completed, generate signed uboot.img, boot.img and
recovery.img, and include the anti-rollback version number.
start to sign rv1126_spl_loader_v1.00.100.bin
# ......
sign loader ok.
# ......
Image(signed, version=0, rollback-index=10):  uboot.img (FIT with uboot, trust)
is ready
Image(signed, version=0, rollback-index=12):  recovery.img (FIT with kernel, fdt,
resource...) is ready
Image(signed, version=0, rollback-index=12):  boot.img (FIT with kernel, fdt,
resource...) is ready
Image(signed):  rv1126_spl_loader_v1.00.100.bin (with spl, ddr, usbplug) is ready
```

При включении SPL выводит RSA: Write key hash successfully. Запись хеша определяет проверку loader в Maskrom и необратима; проверка U-Boot из loader и дальнейших этапов остаётся такой же. Поэтому при отладке источник рекомендует не использовать --burn-key-hash. (4) Расширение 3: boot/recovery можно подписывать отдельно, если ранее хотя бы один раз полностью собран подписанный U-Boot.

```text
./make.sh rv1126 --spl-new
# Before compilation, ensure that U-Boot has been compiled at least once with
signing enabled.

./scripts/fit.sh --boot_img boot.img            # Sign boot.img separately
./scripts/fit.sh --recovery_img recovery.img    # Sign recovery.img separately
```

Нужен патч scripts: fit.sh: repack boot / recovery individually, Change-Id Ib9c0396625971469e13e8092d233e2aea5714486. (5) Параметры: --boot_img и --recovery_img необязательны и задают подписываемые образы. --rollback-index-uboot, --rollback-index-boot, --rollback-index-recovery задают версии защиты от отката. Без --spl-new loader упаковывается с SPL из rkbin; с ним используется текущий собранный SPL.

u-boot-spl.dtb должен содержать пользовательский открытый RSA-ключ, поэтому Rockchip не помещает готовый Secure-Boot-SPL в rkbin. При сборке нужен --spl-new. Альтернатива — добавить собственный стабильный SPL в rkbin и далее использовать его без этого параметра. Результат включает loader, uboot.img, boot.img; пока RSA-ключ неизменен, образы можно обновлять по отдельности.

#### 2.1.4 Проверка загрузки

После правильной настройки прошивки и записи Key Hash в OTP по соответствующему разделу появляется следующий журнал.

```text
...
Trying to boot from MMC1
//SPL completes signature verification
sha256,rsa2048:dev+
// Anti-rollback detection: The current uboot.img firmware version number is 10,
and the minimum version number of this device is 9
rollback index: 10 >= 9, OK
// SPL completes hash verification of each sub-mirror
### Checking optee ... sha256+ OK
### Checking uboot ... sha256+ OK
### Checking fdt ... sha256+ OK

Jumping to U-Boot via OP-TEE
I/TC:
E/TC:0 0 plat_rockchip_pmu_init:2003 0
E/TC:0 0 plat_rockchip_pmu_init:2006 cpu off
E/TC:0 0 plat_rockchip_pmusram_prepare:1945 pmu sram prepare 0x14b10000 0x8400880
0x1c
E/TC:0 0 plat_rockchip_pmu_init:2020 pmu sram prepare
E/TC:0 0 plat_rockchip_pmu_init:2056 remap
I/TC: OP-TEE version: 3.6.0-233-g35ecf936 #1 Tue Mar 31 08:46:13 UTC 2020 arm
I/TC: Next entry point address: 0x00400000
I/TC: Initialized
......
### Loading kernel from FIT Image at 3d8122c0 ...
   Using 'conf' configuration
   // Uboot completes signature verification
   Verifying Hash Integrity ... sha256,rsa2048:dev+ OK
   // Anti-rollback detection: The current boot.img firmware version number is
22, and the minimum version number of this device is 21
   Verifying Rollback-index ... 22 >= 21, OK
   Trying 'kernel' kernel subimage
......
   Verifying Hash Integrity ... sha256+ OK  // hash verification of kernel is
completed
### Loading ramdisk from FIT Image at 3d8122c0 ...
   Using 'conf' configuration
   Trying 'ramdisk' ramdisk subimage
......
```

```text
   Verifying Hash Integrity ... sha256+ OK  // hash verification of ramdisk is
completed
   Loading ramdisk from 0x3dd3d4c0 to 0x0a200000
### Loading fdt from FIT Image at 3d8122c0 ...
   Using 'conf' configuration
   Trying 'fdt' fdt subimage
......
   Verifying Hash Integrity ... sha256+ OK // hash verification of Fdt is
completed
   Loading fdt from 0x3d812ec0 to 0x08300000
   Booting using the fdt blob at 0x8300000
   Loading Kernel Image from 0x3d8234c0 to 0x02008000 ... OK
   Using Device Tree in place at 08300000, end 0831359d
Adding bank: 0x00000000 - 0x08400000 (size: 0x08400000)
Adding bank: 0x0848a000 - 0x40000000 (size: 0x37b76000)
Total: 236.327 ms

Starting kernel ...
```

Замена защищённой прошивки неподписанной должна препятствовать нормальной загрузке.

### 2.2 AVB

AVB (Android Verified Boot) строит цепочку доверия от аппаратного корня через загрузчики и разделы до/после U-Boot, например boot/recovery. В Linux из-за отсутствия компонентов Android используется сокращённый AVB только для boot/recovery. Проверка Loader→U-Boot выполняется закрытой схемой Rockchip.

#### 2.2.1 Создание ключей

Loader→U-Boot требует пары RSA, как в FIT. Дополнительно AVB использует четыре ключа: PRK (Product RootKey) — корень AVB, на eFuse проверяется ключом Base Secure Boot, на OTP — предварительно записанным PRK-Hash; PIK (Product Intermediate Key) — промежуточный; PSK (Product Signing Key) — подпись прошивки; PUK (Product Unlock Key) — разблокировка.

![Руководство разработчика Rockchip Linux Secure Boot — en 15](/docs/rockchip-linux-secure-boot/assets/en-p015-figure-01.png)

Из четырёх ключей выводятся файлы на схеме; описание AVB: https://android.googlesource.com/platform/external/avb/+/master/README.md. В Linux выделена проверка прошивки. Для eFuse Rockchip дополнительно создаёт permanent_attributes_cer.bin: loader проверяет permanent_attributes.bin открытым ключом без хранения этих атрибутов в eFuse, экономя место. Тестовые ключи/сертификаты tools/linux/Linux_SecurityAVB/avb_keys допустимы только при отладке; в готовом продукте замените их своими. Создание показано ниже.

```text
cd tools/linux/Linux_SecurityAVB/
touch avb_keys/temp.bin

# Input 16 bytes product id, like "0123456789ABCDE"
# Or use random id,
# head -c 16 /dev/urandom | od -An -t x | tr -d ' \n' > avb_keys/product_id.bin
echo -n $PRODUCT_ID > avb_keys/product_id.bin

# Generate test keys.
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:4096 -outform PEM -out
avb_keys/testkey_prk.pem
```

```text
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:4096 -outform PEM -out
avb_keys/testkey_psk.pem
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:4096 -outform PEM -out
avb_keys/testkey_pik.pem
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:4096 -outform PEM -out
avb_keys/testkey_puk.pem

# Generate certificate.bin and metadata.
python scripts/avbtool make_atx_certificate --output=avb_keys/pik_certificate.bin
--subject=avb_keys/temp.bin --subject_key=avb_keys/testkey_pik.pem --
subject_is_intermediate_authority --subject_key_version 42 --
authority_key=avb_keys/testkey_prk.pem
python scripts/avbtool make_atx_certificate --output=avb_keys/psk_certificate.bin
--subject=avb_keys/product_id.bin --subject_key=avb_keys/testkey_psk.pem --
subject_key_version 42 --authority_key=avb_keys/testkey_pik.pem
python scripts/avbtool make_atx_certificate --output=avb_keys/puk_certificate.bin
--subject=avb_keys/product_id.bin --subject_key=avb_keys/testkey_puk.pem --
usage=com.google.android.things.vboot.unlock --subject_key_version 42 --
authority_key=avb_keys/testkey_pik.pem
python scripts/avbtool make_atx_metadata --output=avb_keys/metadata.bin --
intermediate_key_certificate=avb_keys/pik_certificate.bin --
product_key_certificate=avb_keys/psk_certificate.bin

# Generate permanent_attributes.bin
python scripts/avbtool make_atx_permanent_attributes --
output=avb_keys/permanent_attributes.bin --product_id=avb_keys/product_id.bin --
root_authority_key=avb_keys/testkey_prk.pem

# If eFuse device used, generate permanent_attributes.bin.
openssl dgst -sha256 -out avb_keys/permanent_attributes_cer.bin -sign dev.key
avb_keys/permanent_attributes.bin
```

Таким образом, ключи AVB состоят из двух частей в двух каталогах:

```text
PC:~/SDK$ tree u-boot/keys/
.
├── dev.key
└── dev.pubkey

PC:~/SDK$ tree tools/linux/Linux_SecurityAVB/avb_keys
.
├── metadata.bin
├── permanent_attributes.bin
├── pik_certificate.bin
├── product_id.bin
├── psk_certificate.bin
├── puk_certificate.bin
├── testkey_pik.pem
├── testkey_prk.pem
├── testkey_psk.pem
└── testkey_puk.pem
# testkey_*.pem is the key of AVB, and the other bin files are key certificates
derived from the AVB key according to specific uses.
```

#### 2.2.2 Конфигурация

2.2.2.1 Trust

В rkbin/RKTRUST найдите, например для RK3308, RK3308TRUST.ini и замените:

```text
[BL32_OPTION]
SEC=0
```

На:

```text
[BL32_OPTION]
SEC=1
```

Для Trust формата TOS, например RK3288TOS.ini, BL32_OPTION уже включён.

2.2.2.2 U-Boot

U-Boot требует следующих функций:

```text
# OPTEE support
CONFIG_OPTEE_CLIENT=y
CONFIG_OPTEE_V1=y           #RK312x/RK322x/RK3288/RK3228H/RK3368/RK3399 and V2
are mutually exclusive
CONFIG_OPTEE_V2=y           #RK3308/RK3326 and V1 are mutually exclusive

# CRYPTO support
CONFIG_DM_CRYPTO=y          # IT is required for eFuse device
CONFIG_ROCKCHIP_CRYPTO_V1=y # For eFuse devices,For example, RK3399/RK3288,
select according to chip
CONFIG_ROCKCHIP_CRYPTO_V2=y # eFuse device, For example, RK1808, select according
to chip
# AVB support
CONFIG_AVB_LIBAVB=y
CONFIG_AVB_LIBAVB_AB=y
CONFIG_AVB_LIBAVB_ATX=y
CONFIG_AVB_LIBAVB_USER=y
CONFIG_RK_AVB_LIBAVB_USER=y
CONFIG_AVB_VBMETA_PUBLIC_KEY_VALIDATE=y
CONFIG_ANDROID_AVB=y
CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION=y # For a non-eMMC device, to enable
it, a security partition must exist.
CONFIG_ROCKCHIP_PRELOADER_PUB_KEY=y          # Only available for eFuse devices
CONFIG_RK_AVB_LIBAVB_ENABLE_ATH_UNLOCK=y

#fastboot support
CONFIG_FASTBOOT=y
CONFIG_FASTBOOT_BUF_ADDR=0x2000000           # Can be modified if necessary
CONFIG_FASTBOOT_BUF_SIZE=0x08000000          # Can be modified if necessary
CONFIG_FASTBOOT_FLASH=y
CONFIG_FASTBOOT_FLASH_MMC_DEV=0
```

На некоторых платформах fastboot выключен. При обычной загрузке удерживайте Ctrl-M для просмотра памяти; CONFIG_FASTBOOT_BUF_* должен задавать адрес и размер без конфликтов. ./make.sh xxxx создаёт uboot.img, trust.img и loader.bin.

2.2.2.3 Parameter

vbmeta обязателен, содержит подписи разделов и имеет размер 1M. security добавляется по аппаратным условиям как замена RPMB, например на не-eMMC без RPMB; типичный размер 4M. CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION принудительно выбирает security. Пример таблицы разделов:

```text
# AVB parameter:
0x00002000@0x00004000(uboot),0x00002000@0x00006000(trust),0x00002000@0x00008000(
misc),0x00010000@0x0000a000(boot),0x00010000@0x0001a000(recovery),0x00010000@0x0
002a000(backup),0x00020000@0x0003a000(oem),0x00300000@0x0005a000(system),0x00000
800@0x0035a000(vbmeta),0x00002000@0x0035a800(security),-
@0x0035c800(userdata:grow)
uuid:system=614e0000-0000-4b53-8000-1d28000054a9
```

В инструменте загрузки одновременно обновите имена разделов и повторно загрузите parameter.txt.

#### 2.2.3 Подписывание прошивки

Loader, U-Boot и Trust подписываются rk_sign_tool.

```text
export RK_SIGN_TOOL=${SDK_DIR}/rkbin/tools/rk_sign_tool
export KEYS=${SDK_DIR}/u-boot/keys    # Keys generates chapters. The key is
stored under uboot/keys by default,.
${RK_SIGN_TOOL} cc --chip $CHIP
${RK_SIGN_TOOL} lk --key $KEYS/dev.key --pubkey $KEYS/dev.pubkey

${RK_SIGN_TOOL} sl --loader < path to loader.bin >
${RK_SIGN_TOOL} si --img < path to trust.img or uboot.img >
```

По умолчанию подпись не записывает Public Key Hash в OTP, что удобно при отладке. Для записи добавьте sign_flag=0x20 в ${SDK_DIR}/rkbin/tools/setting.ini. Boot/Recovery подписывает avbtool:

```text
# Sign boot.img
IMAG=boot.img # path to boot.img
SIZE=`ls ${IMAGE} -l | awk '{printf $5}'`
SIZE=$[(SIZE / 4096 + 18) * 4096] # Align 4K
python scripts/avbtool add_hash_footer --image ${IMAGE} --partition_size ${SIZE}
--partition_name boot --key avb_keys/testkey_psk.pem --algorithm SHA512_RSA4096
# Generate the boot.img with signed information

python scripts/avbtool make_vbmeta_image --public_key_metadata
avb_keys/metadata.bin --include_descriptors_from_image ${IMAGE} --algorithm
SHA256_RSA4096 --rollback_index 0 --key avb_keys/testkey_psk.pem  --output
out/vbmeta.img
# Generated the out/vbmeta.img corresponding to boot.img

# Sign recovery.img
IMAG=recovery.img # path to recovery.img
SIZE=$(get_from_parameter) # Get the size of the recovery partition from
parameter. Partition size must be 4K aligned.
python scripts/avbtool add_hash_footer --image ${IMAGE} --partition_size ${SIZE}
--partition_name boot --key avb_keys/testkey_psk.pem --algorithm SHA512_RSA4096 -
-public_key_metadata avb_keys/metadata.bin
# Generate recovery.img with signed information. Recovery does not need to be
bound to vbmeta and comes with metadata information.
```

#### 2.2.4 Запись ключей AVB

AVB имеет состояния Lock и Unlock. Lock строго проверяет прошивку и останавливает загрузку при ошибке — для выпуска. Unlock предупреждает, но допускает загрузку — для отладки. Состояние меняется через fastboot. После записи AVB-прошивки перезапустите устройство в fastboot, запишите ключи с ПК и заблокируйте устройство. Некоторые U-Boot входят в fastboot автоматически при первом запуске; если загрузилась система, используйте reboot fastboot. Команды записи ключей и блокировки:

```text
cd ${SDK_DIR}/tools/linux/Linux_SecurityAVB

# download permanent_attributes.bin
./scripts/fastboot stage avb_keys/permanent_attributes.bin
./scripts/fastboot oem fuse at-perm-attr

# If eFuse device:
./scripts/fastboot stage avb_keys/permanent_attributes_cer.bin
./scripts/fastboot oem fuse at-rsa-perm-attr

# Lock device
./scripts/fastboot oem at-lock-vboot
```

После блокировки и перезапуска виден журнал:

```text
ANDROID: reboot reason: "(none)"
read_is_device_unlocked() ops returned that device is LOCKED
```

При необходимости разблокировки используется:

```text
./scripts/fastboot oem at-get-vboot-unlock-challenge
./scripts/fastboot get_staged raw_unlock_challenge.bin
python ./scripts/avb-challenge-verify.py raw_unlock_challenge.bin
avb_keys/product_id.bin # Generate unlock_challenge.bin
python ./scripts/avbtool make_atx_unlock_credential --
output=unlock_credential.bin --
intermediate_key_certificate=avb_keys/pik_certificate.bin --
unlock_key_certificate=avb_keys/puk_certificate.bin --
challenge=unlock_challenge.bin --unlock_key=$KEYS/testkey_puk.pem
./scripts/fastboot stage unlock_credential.bin
./scripts/cmd_fastboot oem at-unlock-vboot
```

#### 2.2.5 Журнал загрузки

После полной записи AVB-прошивки и блокировки выводится:

```text
DDR Version V1.31 20210118
...
Boot1 Release Time: Mar 29 2021 14:15:15, version: 1.27
...
StorageInit ok = 10694
SecureMode = 1                            # OTP / eFuse have been burned
Secure read PBA: 0x4
# Head flags=0x20b3                       # | Only when burning the signature
loader with Sign_flag = 0x20 for the first time
# SecureCheckHeader 0, 0, 0               # | The OTP burning Log will be
printed, and then power on the computer again, but there will be no such Log.
# SecureWriteOTP                          # |
# enable secure flag!                     # |
# otp write key success! !!               # |
atags_set_pub_key: ret:(0)                # public key verification is valid
```

```text
SecureInit ret = 0, SecureMode = 1        # Start by SecureMode
...
U-Boot 2017.09-gfae486e407-210107 #zain (Aug 18 2021 - 17:34:57 +0800)
...
Hit key to stop autoboot('CTRL+C'):  0
ANDROID: reboot reason: "(none)"
Vboot=1, AVB images, AVB erify
read_is_device_unlocked() ops returned that device is LOCKED # The device is in
Lock state
Fdt Ramdisk skip relocation
Booting IMAGE kernel at 0x00680000 with fdt at 0x1f00000...  # Kernel loads
normally and no errors are reported.
...
```

#### 2.2.6 Упрощающий скрипт

В tools/linux/Linux_SecurityAVB/ имеются скрипты управления. Источник называет avb_user_avb_user_tool.sh; проверьте реальное имя. Функции:

```text
# Generate AVB Keys
./avb_user_tool.sh -n <Product ID> #The size of Product ID is 16 bytes.

# Sign boot and recovery, final image in `out`.
./avb_user_tool.sh -s -b < /path/to/boot.img > -r < /path/to/recovery.img > #
Remove -r option if no recovery.img
# Loader / Uboot / Trust still use `rk_sign_tool`.

# Lock and Unlock device
# Save root password for fastboot operation.
./avb_user_tool.sh --su_pswd < /user/password >
# Mark eFuse tool, and generate permanent_attributes_cer.bin. OTP device skip
this step.
./avb_user_tool.sh -f < /path/to/privatekey.pem >
# download AVB Keys
./avb_user_tool.sh -d
# Lock device
./avb_user_tool.sh -l # reboot device after finishing lock.

# Unlock device
./avb_user_tool.sh -u # reboot device after finishing unlock.
```

#### 2.2.7 Нестандартное упрощение AVB

Обычный AVB требует отдельной загрузки открытых ключей, усложняющей производство. Открытый ключ нужен только для проверки и может храниться открыто, если защищён от изменения. Поэтому его можно включить в U-Boot, который проверяется loader, обеспечивая подлинность ключа.

Это исключает отдельный шаг fastboot-загрузки ключей. Изменение нестандартное: применяется вручную и не объединяется с основной веткой.

```text
diff --git a/common/android_bootloader.c b/common/android_bootloader.c
index 5525fe620e8..7d59257633f 100644
--- a/common/android_bootloader.c
+++ b/common/android_bootloader.c
@@ -801,6 +801,7 @@ static AvbSlotVerifyResult android_slot_verify(char
*boot_partname,
        if (ops->read_is_device_unlocked(ops, (bool *)&unlocked) !=
AVB_IO_RESULT_OK)
                printf("Error determining whether device is unlocked.\n");

+       unlocked = 0; /* Lock State Fixed */
        printf("read_is_device_unlocked() ops returned that device is %s\n",
               (unlocked & LOCK_MASK)? "UNLOCKED" : "LOCKED");

diff --git a/lib/avb/libavb_user/avb_ops_user.c
b/lib/avb/libavb_user/avb_ops_user.c
index 18c0c1fb237..bb96a4bade2 100644
--- a/lib/avb/libavb_user/avb_ops_user.c
+++ b/lib/avb/libavb_user/avb_ops_user.c
@@ -42,6 +42,7 @@
 #include <android_avb/avb_vbmeta_image.h>
 #include <android_avb/avb_atx_validate.h>
 #include <boot_rkimg.h>
+#include <android_avb/avb_root_pub.h>

 static void byte_to_block(int64_t *offset,
                          size_t *num_bytes,
@@ -192,21 +193,17 @@ validate_vbmeta_public_key(AvbOps *ops,
                           size_t public_key_metadata_length,
                           bool *out_is_trusted)
 {
-/* remain AVB_VBMETA_PUBLIC_KEY_VALIDATE to compatible legacy code */
-#if defined(CONFIG_AVB_VBMETA_PUBLIC_KEY_VALIDATE) || \
-    defined(AVB_VBMETA_PUBLIC_KEY_VALIDATE)
-       if (out_is_trusted) {
-               avb_atx_validate_vbmeta_public_key(ops,
-                                                  public_key_data,
-                                                  public_key_length,
-                                                  public_key_metadata,
-                                                  public_key_metadata_length,
-                                                  out_is_trusted);
+       if (!public_key_length || !out_is_trusted || !public_key_data) {
+               printf("%s: Invalid parameters\n", __func__);
+               return AVB_IO_RESULT_ERROR_IO;
        }
-#else
-       if (out_is_trusted)
+
```

```text
+       *out_is_trusted = false;
+       if (public_key_length != avb_root_pub_bin_len)
+               return AVB_IO_RESULT_ERROR_IO;
+       if (memcmp(public_key_data, avb_root_pub_bin, public_key_length) == 0)
                *out_is_trusted = true;
-#endif
+
        return AVB_IO_RESULT_OK;
 }

@@ -558,21 +555,17 @@ AvbIOResult validate_public_key_for_partition(AvbOps *ops,
                                              bool *out_is_trusted,
                                              uint32_t
*out_rollback_index_location)
 {
-/* remain AVB_VBMETA_PUBLIC_KEY_VALIDATE to compatible legacy code */
-#if defined(CONFIG_AVB_VBMETA_PUBLIC_KEY_VALIDATE) || \
-    defined(AVB_VBMETA_PUBLIC_KEY_VALIDATE)
-       if (out_is_trusted) {
-               avb_atx_validate_vbmeta_public_key(ops,
-                                                  public_key_data,
-                                                  public_key_length,
-                                                  public_key_metadata,
-                                                  public_key_metadata_length,
-                                                  out_is_trusted);
+       if (!public_key_length || !out_is_trusted || !public_key_data) {
+               printf("%s: Invalid parameters\n", __func__);
+               return AVB_IO_RESULT_ERROR_IO;
        }
-#else
-       if (out_is_trusted)
+
+       *out_is_trusted = false;
+       if (public_key_length != avb_root_pub_bin_len)
+               return AVB_IO_RESULT_ERROR_IO;
+       if (memcmp(public_key_data, avb_root_pub_bin, public_key_length) == 0)
                *out_is_trusted = true;
-#endif
+
        *out_rollback_index_location = 0;
        return AVB_IO_RESULT_OK;
 }
```

Создайте файл открытого ключа и поместите в U-Boot перед сборкой.

```text
./scripts/avbtool extract_public_key --key avb_keys/testkey_psk.pem --output
avb_root_pub.bin

echo "#ifndef __AVB_ROOT_PUB_H_" > avb_root_pub.h
echo "#define __AVB_ROOT_PUB_H_" >> avb_root_pub.h
echo "" >> avb_root_pub.h
xxd -i avb_root_pub.bin >> avb_root_pub.h
echo "" >> avb_root_pub.h
echo "#endif /* __AVB_ROOT_PUB_H_ */" >> avb_root_pub.h

cp avb_root_pub.h $UBoot/include/android_avb/.
```

Настройте U-Boot по разделу AVB и соберите подписанный образ.

## 3. Защита системы

![Руководство разработчика Rockchip Linux Secure Boot — en 24](/docs/rockchip-linux-secure-boot/assets/en-p024-figure-01.png)

Схема показывает проверку/расшифрование системы из boot.img:

1. boot.img обязательно защищён Secure Boot — это основа механизма.

2. Ramdisk через набор Luksmeta и Device-Mapper ядра представляет Security-System как vroot, затем switch_root переходит в конечную систему.

3. Чтение/запись корневой файловой системы проходят через Device-Mapper к Security-System.

4. Обнаруженное изменение защищённых данных приводит к I/O-ошибке; изменённая область недоступна.

### 3.1 Device-Mapper

Полное хеширование большого системного раздела замедляет запуск. Device-Mapper позволяет проверять данные в ядре по обращениям, а совместно с Crypt — шифровать/расшифровывать. В примере dm-verity образ разбивается на блоки 4K; хеши итеративно образуют многослойный Hash-Map и Root-Hash.

![Руководство разработчика Rockchip Linux Secure Boot — en 25](/docs/rockchip-linux-secure-boot/assets/en-p025-figure-01.png)

Root-Hash проверяет Hash-Map, затем dm-verity создаёт и монтирует виртуальный раздел. При I/O ядро сверяет хеш соответствующего блока 4K; несовпадение даёт I/O-ошибку, похожую на повреждение ФС. Источник аналогично описывает замену хеширования симметричным шифрованием; это разные свойства защиты, см. примечания. Преимущество — быстрый запуск, особенно больших образов; недостаток — некоторое снижение скорости чтения. Подробнее: Documentation/device-mapper/ в ядре и https://source.android.google.cn/security/verifiedboot/dm-verity.

#### 3.1.1 Конфигурация

В ядре включите Device-Mapper:

```text
CONFIG_BLK_DEV_DM=y
CONFIG_DM_CRYPT=y
CONFIG_BLK_DEV_CRYPTOLOOP=y
CONFIG_DM_VERITY=y
```

Одно boot.img, созданное сборкой ядра, ещё не выполняет активную проверку/расшифрование. Нужно упаковать Ramdisk вместе с ядром, как описано далее.

### 3.2 Обработка системного образа

Выберите проверку или шифрование по требованиям.

#### 3.2.1 System-Verity

veritysetup настраивает dm-verity — модуль ядра на Device-Mapper для целостности блочных данных и предотвращения незаметной модификации ФС. Инструмент создаёт Hash-Map и Root-Hash по системному образу. Hash-Map добавляется к концу образа, Root-Hash включается в Ramdisk boot.img. При старте Ramdisk создаёт dm-verity-устройство vroot, монтирует его и выполняет switch_root. На ПК обработайте образ и сохраните Root-Hash:

```text
target_image=$(realpath $path_to_system_img)             #Enter the system image,
and the verification information is directly attached to the input image.

sectors=$(ls -l "$target_image" | awk '{printf $5}')     # Get image size
hash_offset=$[(sectors / 1024 / 1024 + 2) * 1024 * 1024] # The system is aligned
at 1M, calculates the offset of Hash-Map placement, and the 2M space behind the
system image
result=$(veritysetup --hash-offset=$hash_offset format "$target_image"
"$target_image")
# Save data for subsequent operations
echo "root_hash=$(echo ${result##*:})" > security.info
echo "hash_offset=$hash_offset" >> security.info
```

Root-Hash хранится в security.info для последующей настройки init. Образ содержит дополнительный Hash-Map, но по-прежнему может быть смонтирован как обычная ФС без veritysetup — тогда такая проверка не действует.

#### 3.2.2 System-Encryption

dmsetup управляет виртуальными блочными устройствами Device Mapper: объединение, разделение, переназначение и шифрование. На ПК создаётся шифрованный контейнер, куда помещается система.

```text
target_image=$(realpath $path_to_system_img)    # Enter system image
security_system=${path_to_output_system}        # Output encryption system
key=$(cat ${path_to_key_file})                  # To read the encryption key, the
key length must match the following algorithm
cipher=${cipher_name}                           # Symmetric encryption algorithm
name, such as aes-cbc-plain

sectors=$(ls -l "$target_image" | awk '{printf $5}')
sectors=$[(sectors + (21 * 1024 * 1024) - 1) / 512] # remain 20M for partition
info / unit: 512 bytes

#Create an encrypted container
loopdevice=$(losetup -f)
mappername=encfs-$(shuf -i 1-10000000000000000000 -n 1)
dd if=/dev/null of="$security_system" seek=$sectors bs=512
sudo losetup $loopdevice "$security_system"
sudo dmsetup create $mappername --table "0 $sectors crypt $cipher $key 0
$loopdevice 0 1 allow_discards"

#Put the system into an encrypted container
sudo dd if="$target_image" of=/dev/mapper/$mappername conv=fsync

sync && sudo dmsetup remove $mappername
sudo losetup -d $loopdevice

# Save data for subsequent operations
echo "cipher=$cipher" > security.info
echo "key=$key" >> security.info
```

Полученный образ — шифротекст, напрямую использовать его нельзя. Ramdisk получает алгоритм и ключ, через dmsetup создаёт /dev/mapper/vroot и монтирует его. См. настройку init Ramdisk. В отличие от Root-Hash System-Verity, секретный ключ System-Encryption нельзя хранить непосредственно в прошивке Ramdisk.

3.2.2.1 Хранение ключа

Ключ шифрования не хранится в Ramdisk. Демонстрационная схема SDK сначала помещает его в misc.img; Ramdisk читает ключ, переносит в RPMB/Security и очищает misc.img. Упаковка ключа в misc.img на ПК:

```text
# The key is stored at an offset of 10K in the misc image by default.
MISC=misc.img                                             # Original misc file
key="af16857cf77982040e6dbeee739d00619847b0e16a25c8a9589b4ce93aced6b1"
dd if="$MISC" of=security-misc.img bs=1k count=10
echo -en "\x40\x00" >> security-misc.img                  # Declare that the key
length bit is 64 bytes (0x40)
echo -n "$key" >> security-misc.img                       # write key
skip=$[10 * 1024 + 64 + 2]
dd if="$MISC" of=security-misc.img seek=$skip skip=$skip bs=1
# Generate security-misc.img of the key
```

Обработка ключа в Ramdisk:

![Руководство разработчика Rockchip Linux Secure Boot — en 28](/docs/rockchip-linux-secure-boot/assets/en-p028-figure-01.png)

Чтение/запись RPMB выполняет KeyBox. Для ограничения использования извлечённой копии KeyBox предусмотрены проверки: запуск только в Ramdisk и программе с PID=1. Подробнее в разделе KeyBox.

### 3.3 Настройка Ramdisk

Ramdisk — небольшая система Buildroot, упакованная с ядром в boot.img. Она проверяет/расшифровывает систему, затем switch_root переходит к целевой системе и освобождает Ramdisk. Настройка зависит от задачи.

#### 3.3.1 Начальный скрипт Ramdisk

Работа выполняется в /init (buildroot/output/rockchip_${chip}_ramboot/target/init). Скрипт по типу упаковки проверяет или расшифровывает систему и создаёт vroot. Схема учитывает A/B, проверку и шифрование.

![Руководство разработчика Rockchip Linux Secure Boot — en 29](/docs/rockchip-linux-secure-boot/assets/en-p029-figure-01.png)

[1] При шифровании файловая система расширяется до фактического размера системного раздела.

init создаётся из buildroot/board/rockchip/common/security-ramdisk-overlay/init.in. Заранее подготовьте security.info по System-Verity или System-Encryption; он используется ниже.

```text
cp buildroot/board/rockchip/common/security-ramdisk-overlay/init.in \
   buildroot/board/rockchip/common/security-ramdisk-overlay/init
init_file=buildroot/board/rockchip/common/security-ramdisk-overlay/init
optee_storage=RPMB #Depending on the actual hardware conditions, optee_storage is
filled with RPMB or SECURITY (security partition)
source security.info

# Choose between system-Encryption or System-Verity:
# - System-Verity
sed -i "s/ENC_EN=/ENC_EN=false/" $init_file
sed -i "s/OFFSET=/OFFSET=$hash_offset/" $init_file
sed -i "s/HASH=/HASH=$root_hash/" $init_file
sed -i "s/# exec busybox switch_root/exec busybox switch_root/" "$init_file"

# - System-Encryption
sed -i "s/ENC_EN=/ENC_EN=true/" $init_file
sed -i "s/CIPHER=/CIPHER=$cipher/" $init_file
sed -i "s/SECURITY_STORAGE=RPMB/SECURITY_STORAGE=$optee_storage/" $init_file
sed -i "s/# exec busybox switch_root/exec busybox switch_root/" "$init_file"
```

#### 3.3.2 Конфигурация сборки Ramdisk

По умолчанию rockchip_&lt;chip_name&gt;_ramboot_defconfig рассчитан на System-Verity. Для System-Encryption добавьте:

```text
BR2_PACKAGE_TEE_USER_APP=y # Refer to the KeyBox chapter configuration. Some SDKs
can be included "tee_aarch64_v2.config" directly.
BR2_PACKAGE_TEE_USER_APP_COMPILE_CMD="6432"
BR2_PACKAGE_TEE_USER_APP_TEE_VERSION="v2"
BR2_PACKAGE_TEE_USER_APP_EXTRA_TOOLCHAIN="$(PATH_TO_CROSS_COMPILE)"

BR2_PACKAGE_RECOVERY=y
BR2_PACKAGE_RECOVERY_UPDATEENGINEBIN=y # The encryption key is stored in misc,
and the Recovery option is to add the misc parsing program.
```

BR2_ROOTFS_OVERLAY+="board/rockchip/common/security-ramdisk-overlay/" помещает init в Ramdisk. Параметры BR2_PACKAGE_TEE_USER_APP описаны в KeyBox и выбираются по требованиям. Ramdisk — полноценная промежуточная система, поэтому собирается как обычный Buildroot:

```text
cd buildroot
./build/envsetup.sh rockchip_${chip}_ramboot_defconfig   # chip: Fill in
according to actual situation
make # Firmware is generated in
output/rockchip_${chip}_ramboot/images/rootfs.cpio.gz
```

Можно подготовить собственный Ramdisk при следующих условиях:

1. Включить набор Luksmeta, минимум veritysetup для проверки и dmsetup для шифрования.

2. Для шифрования перенести TEE-программы чтения/записи ключей и updateEngine для чтения ключа из misc. Последнюю часть можно выделить в отдельную программу либо передавать ключ из другого источника.

3. Адаптировать init по разделу настройки, чтобы смонтировать новую систему.

#### 3.3.3 Упаковка Ramdisk

Ramdisk упаковывается с ядром в boot.img; способ зависит от схемы.

```text
# Package it with kernel into boot.img, choose one of FIT / AVB solutions
cd ${RK_SDK_DIR} # SDK root directory
# FIT solution
./device/rockchip/common/scripts/mk-fitimage.sh boot.img \
    device/rockchip/${chip}/boot4recovery.its \
    kernel/arch/arm64/boot/Image \
    kernel/arch/arm64/boot/dts/rockchip/${RK_KERNEL_DTB} \
    kernel/resource.img \
    buildroot/output/rockchip_${chip}_ramboot/images/rootfs.cpio.gz

#AVB solution
./kernel/scripts/mkbootimg \
    --kernel kernel/arch/arm64/boot/Image \
    --ramdisk buildroot/output/rockchip_${chip}_ramboot/images/rootfs.cpio.gz \
    --second kernel/arch/arm64/boot/dts/rockchip/${RK_KERNEL_DTB} \
    -o boot.img
```

Подпишите полученный boot.img по расширению FIT 3 или разделу подписания AVB.

## 4. KeyBox

Ключи шифрования обычно хранятся через OPTEE в RPMB/Security. Поскольку этот код работает с секретами производителя, его следует проектировать самостоятельно. SDK содержит демонстрационный KeyBox, используемый System-Encryption; рекомендуется переработать его для продукта. Под &lt;SDK&gt;/external/security/ находятся bin (предсобранные закрытые части и заголовки базовой OPTEE-библиотеки) и rk_tee_user (сборка собственных CA/TA и демонстрации). Подробнее об OPTEE: Rockchip_Developer_Guide_TEE_SDK_CN.pdf. Далее рассматривается сборка KeyBox.

### 4.1 Отдельная сборка

Исходники KeyBox: &lt;SDK&gt;/buildroot/package/rockchip/tee-user-app.

```text
# tree buildroot/package/rockchip/tee-user-app/
buildroot/package/rockchip/tee-user-app/
├── Config.in
├── extra_app
│   ├── host
│   │   ├── main.c
│   │   └── Makefile
│   └── ta
│       ├── include
│       │   ├── ta_keybox.h
│       │   └── user_ta_header_defines.h
│       ├── keybox.c
│       ├── Makefile
│       └── sub.mk
└── tee-user-app.mk
```

Перенесите host и ta из extra_app в соответствующие части rk_tee_user, например:

```text
# tree rk_tee_user/v2/host/extra_app/ rk_tee_user/v2/ta/extra_app/
rk_tee_user/v2/host/extra_app/
├── main.c
└── Makefile
rk_tee_user/v2/ta/extra_app/
├── include
│   ├── ta_keybox.h
│   └── user_ta_header_defines.h
├── keybox.c
├── Makefile
└── sub.mk
```

rk_tee_user одновременно создаёт CA (keybox_app) и TA. CA работает в пользовательском пространстве и использует toolchain системы. TA работает в TrustZone и требует toolchain, совместимый с BL32/TEE; без особых указаний он 32-битный. Поэтому могут понадобиться две цепочки. Пример: система 64-bit, TA 32-bit.

```text
cd rk_tee_user/v2 # v1 is the same, but the compilation directory is different.
./build.sh 6432
ARM32_TOOLCHAIN=${ARM32_CROSS_COMPILER_PATH} \
AARCH64_TOOLCHAIN=${AARCH64_CROSS_COMPILER_PATH} \
./build.sh 6432                     # Compile 64-bit CA, 32-bit TA
# Generate program:
# out/ta/extra_app/8c6cf810-685d-4654-ae71-8031beee467e.ta
# out/extra_app/keybox_app
```

### 4.2 Сборка tee_user_app

В Buildroot KeyBox собирается пакетом tee_user_app. Пример конфигурации 64-битной системы с 32-битным TA:

```text
BR2_PACKAGE_TEE_USER_APP=y
BR2_PACKAGE_TEE_USER_APP_COMPILE_CMD="6432"
BR2_PACKAGE_TEE_USER_APP_TEE_VERSION="v2"
BR2_PACKAGE_TEE_USER_APP_EXTRA_TOOLCHAIN="$(PATH_TO_CROSS_COMPILE)"
```

KeyBox и TA автоматически включаются в систему.

### 4.3 Включение OPTEE в ядре

KeyBox основан на OPTEE; добавьте поддержку в ядро.

```text
CONFIG_TEE=y
CONFIG_OPTEE=y
```

Также добавьте узел optee в DTS.

```text
optee: optee {
        compatible = "linaro,optee-tz";
        method = "smc";
        status = "okay";
}
```

### 4.4 Рекомендации по переработке KeyBox

Общий пример KeyBox доступен всем, поэтому для усиления защиты его следует адаптировать. Используйте только доверенную среду с FIT/AVB. Подписывайте TA по главе 5 TA Signing в Rockchip_Developer_Guide_TEE_SDK_CN.pdf, чтобы исключить сторонние TA. Ограничивайте среду CA, не позволяя извлечённому CA читать секреты вне защиты. По умолчанию запись ключа разрешена всегда, чтение — только в Ramdisk и PID=1. Переработайте обмен CA–TA: демонстрация использует простые случайные проверки и возвращает случайный ключ при ошибке обмена.

## 5. Запись защищённой информации

### 5.1 Key Hash

Определите носитель защищённой информации по таблице чипов и выполните подходящую процедуру.

#### 5.1.1 OTP

Для активации Secure Boot через OTP обеспечьте питание OTP-выводов на этапе Loader. Загрузите прошивку через AndroidTool (Windows) или upgrade_tool (Linux). При первом перезапуске Loader записывает хеш ключа в OTP и активирует защиту; при следующем запуске действует проверка. Запись необратима.

![Руководство разработчика Rockchip Linux Secure Boot — en 35](/docs/rockchip-linux-secure-boot/assets/en-p035-figure-01.png)

#### 5.1.2 eFuse

Для eFuse обеспечьте VCC_IO в MaskRom (исходное аппаратное состояние); для VCC_EFUSE требуется следующая схема управления питанием.

![Руководство разработчика Rockchip Linux Secure Boot — en 35](/docs/rockchip-linux-secure-boot/assets/en-p035-figure-02.png)

Используйте tools/windows/eFusetool_vXX.zip, переведите плату в MaskRom. Firmware выбирает подписанный update.img или Miniloader.bin, Start запускает необратимое программирование eFuse.

![Руководство разработчика Rockchip Linux Secure Boot — en 36](/docs/rockchip-linux-secure-boot/assets/en-p036-figure-01.png)

После успешной записи выключите/включите плату, войдите в MaskRom и загрузите остальные подписанные образы.

### 5.2 Пользовательская защищённая информация

Для собственных секретов рекомендуется OPTEE; см. Rockchip_Developer_Guide_TEE_SDK_CN.pdf.

## 6. Security Demo

Для упрощения описанной ручной настройки SDK включает управляющие скрипты в build.sh: несколькими параметрами задаётся проверка или шифрование. Принципы и подробные действия рассмотрены выше. Скрипты основаны на общем SDK; различия версий могут нарушить их работу, универсальная совместимость не гарантируется. При ошибке возвращайтесь к подробным разделам и отлаживайте.

Поскольку схема защиты общедоступна и чувствительна к деталям, помимо быстрого запуска проанализируйте принципы и адаптируйте её под требования своего продукта.

### 6.1 Конфигурация SDK

В корне SDK make menuconfig открывает настройки сборки; безопасность находится под RK_SECURITY.

![Руководство разработчика Rockchip Linux Secure Boot — en 37](/docs/rockchip-linux-secure-boot/assets/en-p037-figure-01.png)

Подробная конфигурация:

```text
RK_SECURITY                             # Security function is enabled

RK_SECUREBOOT_FIT                       # Basic security function mode, choose
one of FIT / AVB
RK_SECUREBOOT_AVB

RK_SECURITY_OPTEE_STORAGE_RPMB          # OPTEE Secure Storage Medium，choose one
between the two
RK_SECURITY_OPTEE_STORAGE_SECURITY      # Choose RPMB for eMMC storage and
SECURITY for flash storage.

RK_SECURITY_CHECK_SYSTEM_BASE           # Just check loader + uboot + boot
RK_SECURITY_CHECK_SYSTEM_VERITY         # Add rootfs verification to the base
RK_SECURITY_CHECK_SYSTEM_ENCRYPTION     # Add rootfs encryption to the base

RK_SECURITY_INITRD_BASE_CFG             # When there is rootfs verification or
encryption, ramboot needs to be configured
RK_SECURITY_INITRD_TYPE
RK_SECURITY_FIT_ITS

RK_SECURITY_BURN_KEY                    # Enable public key hash burning function
```

RK_SECURITY_BURN_KEY по умолчанию выключен для отладки. Хеш не записывается в OTP, loader.bin считается доверенным и может заменяться; начиная с loader, U-Boot и последующие этапы проверяются строго. Для выпуска требуется осознанная активация записи хеша после проверки схемы. Затем ./build.sh или make запускает сборку; ошибки устраняются по сообщениям и документации. Проверки сборки охватывают только ключевые параметры.

Стандартные настройки SDK различаются, успешная сборка не гарантирует полноценной защиты. Обязательна итоговая проверка. При проблеме определите нарушенный этап проверки и обратитесь к его разделу.

### 6.2 Подробная настройка

#### 6.2.1 Создание ключей

Создание ключей:

```text
./build.sh createkeys
```

При шифровании источник сохраняет пароль пользователя с root-правами в рабочем каталоге U-Boot для сборки; это секрет сборочного хоста, не ключ устройства. См. предупреждение ниже.

```text
echo "Password for sudo" > u-boot/keys/root_passwd
```

Шифрование использует loopback на сборочном ПК и требует root-прав. На сервере без соответствующих прав этот способ недоступен.

#### 6.2.2 Изменение U-Boot

По способу проверки Kernel в таблице платформ выберите схему. Для FIT добавьте:

```text
CONFIG_FIT_SIGNATURE=y
CONFIG_SPL_FIT_SIGNATURE=y
```

AVB требует больше изменений U-Boot; см. раздел его конфигурации.

#### 6.2.3 Изменение ядра

Включите OPTEE и Device Mapper:

```text
CONFIG_BLK_DEV_DM=y
CONFIG_DM_CRYPT=y
CONFIG_BLK_DEV_CRYPTOLOOP=y
CONFIG_DM_VERITY=y

CONFIG_TEE=y                 # It is required in encryption system
CONFIG_OPTEE=y               # It is required in encryption system
```

Добавьте узел OPTEE в DTS:

```text
optee: optee {
        compatible = "linaro,optee-tz";
        method = "smc";
        status = "okay";
}
```

#### 6.2.4 Изменение Buildroot

В конфигурацию Buildroot добавьте:

```text
BR2_ROOTFS_OVERLAY+="board/rockchip/common/security-system-overlay"
```

#### 6.2.5 Изменение Ramdisk

Ramdisk по умолчанию настроен на проверку. Для шифрования добавьте:

```text
BR2_PACKAGE_TEE_USER_APP=y                   # Refer to the KeyBox chapter
configuration. Some SDKs can directly include "tee_aarch64_v2.config"
BR2_PACKAGE_TEE_USER_APP_COMPILE_CMD="6432"
BR2_PACKAGE_TEE_USER_APP_TEE_VERSION="v2"
BR2_PACKAGE_TEE_USER_APP_EXTRA_TOOLCHAIN="$(PATH_TO_CROSS_COMPILE)"

BR2_PACKAGE_RECOVERY=y
BR2_PACKAGE_RECOVERY_UPDATEENGINEBIN=y     # The encryption key is stored in
misc, and the Recovery option is to add the misc parser
```

### 6.3 Метод проверки

Защищаемые этапы: loader, trust, U-Boot, boot, system. Соберите защищённую прошивку, корректно запишите ключи и добейтесь обычной загрузки. Сначала устраните любые исходные ошибки старта.

На отдельном тестовом устройстве подготовьте неподписанную прошивку или прошивку с другим ключом. Замена любого защищённого образа должна нарушить загрузку. Если защита не сработала, по схеме цепочки определите этап и проверьте соответствующую конфигурацию. Это отрицательный тест, не выполненная здесь операция.

### 6.4 Отладка

Если init не переходит в систему, включите вывод и добавьте диагностические сообщения через DEBUG; определите состояние по разделу init Ramdisk.

```text
diff --git a/board/rockchip/common/security-ramdisk-overlay/init.in
b/board/rockchip/common/security-ramdisk-overlay/init.in
index 756d0b5375..c3267e28b1 100755
--- a/board/rockchip/common/security-ramdisk-overlay/init.in
+++ b/board/rockchip/common/security-ramdisk-overlay/init.in
@@ -16,7 +16,7 @@ BLOCK_TYPE_SUPPORTED="
 mmcblk
 flash"

-MSG_OUTPUT=/dev/null
+MSG_OUTPUT=/dev/kmsg
 DEBUG() {
        echo $1 > $MSG_OUTPUT
 }
```

## 7. Ссылки английского V4.0.0

Rockchip_Developer_Guide_UBoot_Nextdev_CN.pdf; Rockchip-Secure-Boot-Application-Note-V1.9.pdf; Rockchip-Secure-Boot2.0.pdf; Rockchip_Developer_Guide_TEE_SDK_CN.pdf; SDK/kernel/Documentation/device-mapper/; https://android.googlesource.com/platform/external/avb/+/master/README.md; https://source.android.google.cn/security/verifiedboot/dm-verity.

## Дополнения и замена конфигурации по китайскому V4.1.1

### 1.4 Виды ключей (китайский V4.1.1)

Таблица указывает ключи, хранение, назначение и этап записи для соответствующего чипа и сценария.

| Ключ | Хранение [1] | Назначение | Запись |
| --- | --- | --- | --- |
| Secure Boot Public Key Hash | OTP или EFUSE | Проверка от Bootrom до U-Boot; FIT также проверяет Boot/Recovery. | Запись SPL (для eFuse см. ограничение PC-инструмента). |
| AVB permanent_attributes.bin | OTP или RPMB [2] | Только AVB [3]. Предпочтительно OTP, иначе RPMB. Проверяет vbmeta и данные AVB fastboot; vbmeta проверяет Boot/Recovery. | U-Boot, Fastboot |
| AVB permanent_attributes_cer.bin | EFUSE (обозначение источника) | Только AVB [3]; для OTP пропускается. Проверяет permanent_attributes.bin в RPMB. | U-Boot, Fastboot |
| System Encryption Key [4] | RPMB [2] | Расшифровывает систему. Демо при первом старте переносит секрет из misc в RPMB и затирает misc. | Ramdisk, KeyBox |

[1] Области описаны в защищённом хранении. [2] RPMB относится к eMMC; для других носителей альтернативой служит Security. [3] См. таблицу платформ.

[4] См. System-Encryption. Демо сначала помещает ключ шифрования в открытом виде в misc, затем при первом запуске переносит его в защищённое хранилище и затирает исходный секрет.

Китайский V4.1.1, страница источника 9:

```text
# 1. 放key的⽬录：keys
mkdir -p keys

# 2. 使⽤RK的"rk_sign_tool"⼯具⽣成RSA2048的私钥privateKey.pem和publicKey.pem，分别更名存放为：
keys/dev.key和keys/dev.pubkey。命令为：
../rkbin/tools/rk_sign_tool kk --bits 2048 --out $(pwd)/keys/
ln -s privateKey.pem keys/dev.key
ln -s publicKey.pem keys/dev.pubkey

# 3. 使⽤-x509和私钥⽣成⼀个⾃签名证书：keys/dev.crt （效果本质等同于公钥）
openssl req -batch -new -x509 -key keys/dev.key -out keys/dev.crt
```

#### 2.1.2 Настройка FIT rkbin (новое расположение в китайском)

В rkbin/RKTRUST для исходного примера RK3308 найдите RK3308TRUST.ini и измените параметр. Это пример источника, не утверждение, что RK3308 использует FIT по таблице платформ.

Китайский V4.1.1, страница источника 10:

```text
[BL32_OPTION]
SEC=0
```

Заменить на:

Китайский V4.1.1, страница источника 10:

```text
[BL32_OPTION]
SEC=1
```

Trust формата TOS, например RK3288TOS.ini, включает BL32_OPTION по умолчанию. Китайский AVB 2.2.2.1 ссылается на эту общую настройку.

Китайский V4.1.1, страница источника 10:

```text
# 必选。
CONFIG_OPTEE_CLIENT=y
CONFIG_OPTEE_V1=y           #RK312x/RK322x/RK3288/RK3228H/RK3368/RK3399 与V2互斥
CONFIG_OPTEE_V2=y           #RK3308/RK3326/RV1126B 与V1互斥
CONFIG_SPL_ROCKCHIP_SECURE_OTP=y
CONFIG_FIT_SIGNATURE=y
CONFIG_SPL_FIT_SIGNATURE=y

# 可选。
CONFIG_FIT_ROLLBACK_PROTECT=y       # boot.img防回滚
CONFIG_SPL_FIT_ROLLBACK_PROTECT=y   # uboot.img防回滚
CONFIG_SPL_ROVOKE_PUB_KEY=y         # 密钥撤销

# RV1126B新增keylad模块，需要开启keylad相关配置。
CONFIG_SPL_KEYLAD=y
CONFIG_SPL_KEYLAD_SUPPORT=y
CONFIG_ROCKCHIP_CIPHER=y
CONFIG_SPL_ROCKCHIP_CIPHER=y
```

#### 2.1.5 Отзыв ключа (только RV1126B)

Описанная процедура поддерживается только RV1126B. (1) Первый исходный ключ поместите в u-boot/ori_keys, новый — в u-boot/keys; создайте по разделу FIT. (2) Включите следующий параметр U-Boot.

Китайский V4.1.1, страница источника 13:

```text
CONFIG_SPL_ROVOKE_PUB_KEY=y
```

(3) Соберите и запишите по процедуре подписания U-Boot: новый ключ будет записан и активирован. (4) Для последующей работы выключите макрос:

Китайский V4.1.1, страница источника 13:

```text
CONFIG_SPL_ROVOKE_PUB_KEY=n
```

ori_keys больше не нужен; собирайте обычным способом. (5) По умолчанию текущий U-Boot поддерживает один отзыв; несколько требуют инструкции Rockchip_Developer_Guide_UBoot_Nextdev_CN.pdf. Эта смена на конкретной платформе не стирает и не отменяет программирование OTP/eFuse.

#### 2.2.8 Предосторожности AVB с разделом security

При выборе security китайский источник требует упрощённую модификацию AVB, принудительно задающую Lock в проверенном U-Boot. Стирание логического раздела может удалить состояние блокировки и привести к исходному Unlock, лишив защиты. RPMB требует аутентификации и не имеет описанного поведения случайного стирания. Не полагайтесь на старое английское утверждение, что стирание security обязательно остановит Secure Boot.

|  | System-Verity | System-Encryption |
| --- | --- | --- |
| На носителе | Открытый текст | Шифротекст |
| Системный ключ | Открытый ключ в Boot.img (термин источника; см. пояснение корневого хеша) | Зашифрованный ключ в RPMB [1] |
| Защита от копирования | Нет | Да |
| Защита от изменения | Да; изменение вызывает ошибки ввода-вывода | Источник: да; изменения нарушают расшифровку, но это не гарантия аутентифицированной целостности |
| Файловые системы | Все файловые системы, только чтение | Без UBIFS; чтение/запись [2] |

[1] Демо сначала хранит секрет открыто в misc, при первом запуске переносит в RPMB и затирает исходный ключ. [2] UBIFS не предоставляет доступное для записи блочное устройство, поэтому данное шифрование с записью неприменимо. Для чтения можно сначала преобразовать в UBI_SQUASHFS; это только чтение и обычно меньший объём, чем UBIFS. В источнике также опечатка UBI_SQUAHSFS; проверяйте реальные имена инструментов.

Китайский V4.1.1, страница источника 31:

```text
BR2_PACKAGE_TEE_USER_APP=y # 参考KeyBox章节配置，部分SDK可以直接 include "tee_aarch64_v2.config"
或 "tee_arm_v2.config"
BR2_PACKAGE_TEE_USER_APP_COMPILE_CMD="6432" # 32位处理器件，填写"3232"
BR2_PACKAGE_TEE_USER_APP_TEE_VERSION="v2"
BR2_PACKAGE_TEE_USER_APP_EXTRA_TOOLCHAIN="$(PATH_TO_CROSS_COMPILE)" #
BR2_PACKAGE_TEE_USER_APP_COMPILE_CMD="6432" 需要补充32位编译链

BR2_PACKAGE_RECOVERY=y
BR2_PACKAGE_RECOVERY_UPDATEENGINEBIN=y # 加密Key是存放在misc中的，Recovery 选项是为了添加misc解析
程序
```

### 4.1 Раздел security (китайский V4.1.1)

На не-eMMC для защищённого хранения OPTEE нужен security как замена RPMB. При возможности предпочитайте RPMB: логический security можно случайно стереть. Содержимое зашифровано и напрямую не расшифровывается. Минимум 1M, половина (512K) — резервная копия. Это минимум, отличный от типичных 4M примера AVB.

#### 4.3.1 Ошибки сборки tee_user_app

При ошибке сборки tee_user_app в Buildroot проверьте причины ниже, затем очистите и пересоберите пакет.

Китайский V4.1.1, страница источника 34:

```text
cd buildroot/output/${system_name}
make tee_user_app-dirclean # 或者 rm build/tee_user_app* -rf

make tee_user_app # 或者重新编译整个buildroot⼯程
```

Частые ошибки:

1. No module named Crypto.Signature означает отсутствие Python-зависимости на сборочном хосте. Ниже исторические команды источника; не выполняйте глобальное удаление пакетов автоматически.

Китайский V4.1.1, страница источника 34:

```text
pip uninstall Crypto
pip uninstall pycrypto
pip install pycrypto
```

2. ModuleNotFoundError: No module named 'Cryptodome': источник предлагает pip3 install [--user] pycryptodomex; [--user] означает необязательный аргумент, не буквальные скобки. Старые SDK не останавливали общую сборку при ошибках tee_user_app. Проверьте патч rk_tee_user ниже; без него собирайте пакет отдельно и проверяйте успех.

Китайский V4.1.1, страница источника 35:

```text
commit 2dcba4774da20ee5f4aebfe6c797eb3ee555468d
Author: Zain Wang <wzz@rock-chips.com>
Date:   Sat May 11 11:47:38 2024 +0800

 v1/v2: add errexit for build.sh

 Easier to be called by other scripts.

 Signed-off-by: Zain Wang <wzz@rock-chips.com>
 Change-Id: I7f8ff92d800ffec580c6f4fbba19c5f5c948ba23
```

### 4.5 Уровень безопасности TEE

Некоторые платформы допускают слабый/сильный уровень TEE для отладки и по умолчанию используют минимальный; см. таблицу. На нерегулируемых платформах по умолчанию сильная схема. В продукте обязательно включите сильную. Процедура: Rockchip_Developer_Guide_TEE_SDK_CN.pdf.

### 4.7 Использование TEE SDK

Дополнительные сведения TEE: Rockchip_Developer_Guide_TEE_SDK_CN.pdf.

Китайский V4.1.1, страница источника 39:

```text
./build.sh security-createkeys
```

Китайский V4.1.1, страница источника 39:

```text
CONFIG_BLK_DEV_DM=y
CONFIG_DM_CRYPT=y
CONFIG_DM_VERITY=y
CONFIG_BLK_DEV_LOOP=y
CONFIG_CRYPTO_USER=y
CONFIG_CRYPTO_USER_API_HASH=y
CONFIG_BLK_DEV_CRYPTOLOOP=y        # 低于 Kernel 6.1 的需要选上

CONFIG_TEE=y                                           # 加密系统必须选
CONFIG_OPTEE=y                                     # 加密系统必须选
```

При наличии следующего патча Buildroot изменение security-system-overlay можно пропустить.

Китайский V4.1.1, страница источника 40:

```text
commit adf939df39823efa3e017463bc707a42e891e308
Author: Zain Wang <wzz@rock-chips.com>
Date:   Thu Nov 28 14:31:21 2024 +0800

board: security: Remove S00mount_sys.sh in security-system

Using "mount --move" in ramboot to mount devtempfs,
Other base serives can be mounted by system.

Signed-off-by: Zain Wang <wzz@rock-chips.com>
Change-Id: I3f29965ebcdfb02f311689c26e2d5d9718377e
```

При шифровании системы обязательно выполните усиление уровня TEE, описанное выше.

### 6.5 Сторонние системы

Предыдущие скрипты рассчитаны на Buildroot. Другой системный образ обработайте до упаковки update.img. Проверьте поддержку SDK:

Китайский V4.1.1, страница источника 41:

```text
# ./build.sh --help | grep security

security-createkeys                     create keys for security
security-misc                           build misc with system encryption key
security-ramboot[:system_image]         build security ramboot
security-system[:system_image]          build security system
clean-security                          cleanup security
```

Суффикс [:system_image] у security-system означает поддержку стороннего образа.

Сначала полностью соберите Security Demo с конфигурацией безопасности SDK. Далее используется та же конфигурация, но вместо Buildroot обрабатывается сторонний образ. Пример Debian: &lt;SDK&gt;/debian/linaro-rootfs.img.

Китайский V4.1.1, страница источника 42:

```text
cd <SDK>
./build.sh security-system:debian/linaro-rootfs.img
# 在⽬标系统同级⽬录下，⽣成处理好的安全固件`debian/security_system.img`和安全信息⽂件
`debian/security.info`

./build.sh security-ramboot:debian/linaro-rootfs.img
# ⽣成附带安全信息的`ramboot`，打包并签名成`output/firmware/boot.img`

cd output/firmware
ln -rsf ../../debian/security_system.img/security_system.img rootfs.img
./build.sh updateimg
# 重新链接rootfs.img，并打包成update.img
```

Если таких опций нет, обработайте систему и ramboot вручную по разделам обработки образа и настройки Ramdisk.

## 7. Защита пользовательских разделов

### 7.1 Шифрование пользовательского раздела

Зашифруйте образ пользовательского раздела на ПК:

Китайский V4.1.1, страница источника 42:

```text
./device/rockchip/common/scripts/mk-security.sh system system-encryption
path_to_userdate_img
# path_to_userdate_img统计⽬录下，⽣成安全固件security_system.img和安全信息security.info

cat $(dirname "path_to_userdate_img")/security.info
touch="2024-12-27 15:46"
sectors=8972288
cipher=aes-cbc-plain
key=af16857cf77982040e6dbeee739d00619847b0e16a25c8a9589b4ce93aced6b1
```

Запишите security_system.img в нужный раздел, например userdata. На устройстве смонтируйте шифрованный раздел по security.info:

Китайский V4.1.1, страница источника 42:

```text
dmsetup create userdata --table "0 ${sectors} crypt ${cipher} ${key} 0 /dev/block/by-
name/userdata 0 1 allow_discards"
# ⽣成 /dev/mapper/userdata 节点

mount /dev/mapper/userdata userdata
# 挂载加密分区到userdata节点
```

Храните ключ отдельно, не в доступной файловой системе, откуда его можно извлечь. Рекомендуется OPTEE; см. KeyBox или руководство TEE.

### 7.2 Проверка пользовательского раздела

Подготовьте данные проверки пользовательского образа на ПК:

Китайский V4.1.1, страница источника 43:

```text
./device/rockchip/common/scripts/mk-security.sh system system-verity path_to_userdate_img
# path_to_userdate_img统计⽬录下，⽣成安全固件security_system.img和安全信息security.info

cat $(dirname "path_to_userdate_img")/security.info
touch="2024-12-27 15:46"
hash_offset=4595908608
root_hash=23ea81cdc7f0b903257bcfd38c734064226a8b5d4e59493218418ec0c2fcd743
```

Запишите security_system.img, например в userdata, и используйте security.info для монтирования проверяемого раздела. Несоответствие имён vroot/userdata разобрано ниже.

Китайский V4.1.1, страница источника 43:

```text
veritysetup --hash-offset=${hash_offset} create vroot /dev/block/by-name/userdata
/dev/block/by-name/userdata ${root_hash}
# ⽣成 /dev/mapper/userdata 节点

mount /dev/mapper/userdata userdata
# 挂载加密分区到userdata节点
```

## 8. Особенности SDK

### 8.1 RK3506 SDK

RK3506 по умолчанию рассчитан на малую память и не резервирует область TEE. Для System-Encryption, KeyBox или OPTEE включите TEE вручную. В make menuconfig SDK добавьте TRUST:

Китайский V4.1.1, страница источника 43:

```text
RK_UBOOT_TRUST_INI="RK3506TOS_TA.ini"
```

Зарезервируйте память TEE в DTS ядра:

Китайский V4.1.1, страница источника 44:

```text
+&reserved_memory {
+       ta_tee:ta-tee@3c00000 {
+               reg = <0x03c00000 0x00400000>;
+               no-map;
+       };
+};
```

Без этих шагов вызов TA может дать TEEC_Opensession failed with code 0xffff0008 origin 0x3. Однако эта ошибка не доказывает, что причина только в памяти/прошивке.

### 8.2 IPC SDK серии RV

Каталоги RV IPC SDK отличаются от общего SDK, поэтому Security Demo нельзя применять напрямую. Принципы и отдельная сборка остаются справочными. Для скриптов IPC SDK следуйте Quick Start конкретного чипа.

## 9. Обновлённые ссылки

Rockchip_Developer_Guide_UBoot_Nextdev_CN.pdf; Rockchip-Secure-Boot-Application-Note-V1.9.pdf; Rockchip-Secure-Boot2.0.pdf; SDK/kernel/Documentation/device-mapper/; https://android.googlesource.com/platform/external/avb/+/master/README.md; https://source.android.google.cn/security/verifiedboot/dm-verity.

### 9.1 Другие документы безопасности

Ищите в &lt;SDK&gt;/docs: OPTEE — Rockchip_Developer_Guide_TEE_SDK_CN.pdf; поля OTP — Rockchip_Developer_Guide_OTP_CN.pdf; защита от копирования платы — Rockchip_Developer_Guide_Anti_Copy_Board_CN.pdf; crypto/HWRNG — Rockchip_Developer_Guide_Crypto_HWRNG_CN.pdf.

## Сверка версий и проверки перед выполнением

- Китайский содержит девять глав, английский — семь. Дополнены таблица ключей, key ladder/отзыв RV1126B, риск AVB Security, уровни TEE/ошибки сборки, сторонние системы, пользовательские разделы и RK3506/RV IPC. Все новые сведения приведены ниже. Историческое упоминание RK3288 в английском описании хранения не означает поддержку в новой таблице платформ; общее RK356X заменено конкретными моделями.
- Старая таблица имеет четыре критерия, новая добавляет файловые системы. «Открытый ключ» System-Verity здесь следует понимать в контексте корневого хеша и метаданных проверки, не секретного ключа. aes-cbc-plain не содержит тега аутентификации. Заявленная защита от изменения описывает неправильную расшифровку, но не гарантирует криптографическую целостность или защиту от активной атаки; требуется проверка/аутентификация.
- Новая версия меняет вывод RSA на $(pwd)/keys/ и генерацию на ./build.sh security-createkeys (английская: текущий каталог и createkeys). Добавлены tee_arm_v2.config и сильный уровень TEE. CONFIG_BLK_DEV_CRYPTOLOOP относится к ядрам ниже 6.1. Выбирайте конфигурацию SDK, не смешивайте взаимоисключающие OPTEE V1/V2.
- Security — стираемый логический раздел, не эквивалент RPMB. Английский говорит об отказе старта после стирания, китайский — о повторной инициализации TEE, потере данных и возможном сбросе блокировки AVB. Следуйте новому требованию принудительно устанавливать Lock в проверенном U-Boot, а не полагайтесь на невозможность стирания.
- Таблица помечает хранение permanent_attributes_cer.bin как EFUSE, одновременно описывая Fastboot и проверку RPMB. Это сокращение не задаёт сырую разметку eFuse. Метка записи SPL также не отменяет требование PC-инструмента для eFuse. Проверьте SoC и инструмент.
- avb_user_avb_user_tool.sh — повтор в имени источника; команды используют avb_user_tool.sh. Дублированное табличное извлечение с китайской страницы 21 восстановлено как один код генерации AVB. Комментарии и переносы PDF сохранены; разорванные команды проверяйте. Примерные секреты/пароли/хеши не пригодны для производства.
- В сторонней системе ln -rsf повторяет security_system.img/security_system.img; ./build.sh после cd output/firmware также требует проверки пути. Пример verity создаёт vroot, затем комментарий/mount используют userdata: согласуйте фактическое имя mapper. Исходный код и написание path_to_userdate_img сохранены для аудита.
- pip/pycrypto описывают старую среду, не современные безопасные зависимости; не изменяйте вслепую системный Python. TRUST/зарезервированная память RK3506 относятся к указанной конфигурации; TEEC_Opensession может иметь другие причины. RV IPC не запускает этот Security Demo напрямую: используйте его Quick Start. Лицензии/авторские права кода, идентификаторы коммитов и исходные комментарии сохранены. Для русского используются английские рисунки; схема не подтверждает электрическую корректность платы.

Дополнительно проверьте код подписи AVB: задаётся IMAG, читается IMAGE. Пример recovery использует --partition_name boot, а get_from_parameter — заполнитель реализации. Оригинал сохранён, но перед выполнением сверьте AVB и разделы. Историческая схема называет операции RSA2048 Encryption/Decryption; это не спецификация алгоритма подписи или дополнения.

{% endraw %}
