---
title: "Entwicklerleitfaden für Rockchip Linux Secure Boot"
description: "Entwicklerleitfaden für Rockchip Linux Secure Boot — V4.1.1 / V4.0.0"
excerpt: "Entwicklerleitfaden für Rockchip Linux Secure Boot"
translation_key: "203-rockchip-linux-secure-boot"
slug: "203-rockchip-linux-secure-boot"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "system"
products: []
tags: [ArmSoM, Rockchip, Linux, Secure-Boot, AVB, FIT, TEE]
---

{% raw %}

# Entwicklerleitfaden für Rockchip Linux Secure Boot

Grundlage ist RK-KF-YF-379, Chinesisch V4.1.1 (2025-04-16, 44 Seiten), abgeglichen mit Englisch V4.0.0 (2024-01-11, 40 Seiten). Der vollständig übersetzte englische Fachtext wird um neuere chinesische Abschnitte samt Code und Tabellen ergänzt. Alle Kapitel, technischen Bilder und Code bleiben erhalten; Titel-, Rechts-, Kontakt- und Revisionsmaterial entfällt. ArmSoM-Plattformreferenz ohne Hardwarevalidierung. Platine, SDK, Medium, Startkette und TEE prüfen. OTP-/eFuse-Programmierung ist irreversibel und kann Geräte dauerhaft sperren. Beispielgeheimnisse und Passwörter niemals produktiv verwenden. Befehle sind Quellenbelege, nicht ausgeführt oder zum sicheren direkten Kopieren freigegeben.

| Plattform (Chinesisch V4.1.1) | Signatur | Medium | TEE-Stufe konfigurierbar | Besondere Hinweise |
| --- | --- | --- | --- | --- |
| RK3308 / RK3328 / RK3326 / PX30 / RK3358 | AVB | OTP | Nein | Nein |
| RK3399 | AVB | EFUSE | Nein | Nein |
| RK3566 / RK3568 | FIT | OTP | Nein | Nein |
| RK3588 / RK3576 / RK3562 | FIT | OTP | Ja | Nein |
| RV1126 | FIT | OTP | Nein | Ja |
| RV1106 / RV1103 / RK3506 | FIT | OTP | Ja | Ja |
| RV1126B | FIT | OTP | Ja | Nein |

## 1. Einführung in Secure Boot

Secure Boot prüft Integrität und Echtheit der Gerätefirmware und schützt vor eingeschleuster Software. Änderungen geschützter Partitionen führen zu Fehlern bis zum Startabbruch. Secure Boot schützt frühe Startstufen; für System- und Benutzerpartitionen beschreibt das Dokument zusätzlich Prüfung und Verschlüsselung.

|  | System-Verity | System-Encryption |
| --- | --- | --- |
| Auf Datenträger | Klartext | Geheimtext |
| Systemschlüssel | Öffentlicher Klartextschlüssel in Boot.img (Quellenwortlaut; Root-Hash beachten) | Verschlüsselter Schlüssel in RPMB [1] |
| Kopierschutz | Nein | Ja |
| Manipulationsschutz | Ja; Änderungen erzeugen E/A-Fehler | Laut Quelle ja; Änderungen stören die Entschlüsselung, garantieren aber keine authentisierte Integrität |

Zuerst die Chipklasse anhand der Plattformtabelle bestimmen: Ressourcen und Sicherheitsstrategien unterscheiden sich. Das Dokument basiert auf dem allgemeinen SDK und beschreibt den Aufbau von Grund auf sowie Skripte zur Verwaltung und Vereinfachung.

### 1.1 Linux-Secure-Boot-Ablauf

![Entwicklerleitfaden für Rockchip Linux Secure Boot — en 6](/docs/rockchip-linux-secure-boot/assets/en-p006-figure-01.png)

Das Diagramm zeigt die Bootrom-Prüfung des Loaders; weitere Stufen sind ähnlich. Ein signiertes Paket besteht aus Firmware (OBM Code) + Digital Signature + Public Key; Signatur und Schlüssel ergänzt das Signierwerkzeug. Firmware liegt auf eMMC/Flash, der öffentliche Schlüsselhash in OTP/eFuse. Beim Start prüft der Hash den Firmware-Schlüssel und dieser die Signatur. So werden Chip und signierter Code verbunden. Details: Rockchip-Secure-Boot-Application-Note-V1.9.pdf.

![Entwicklerleitfaden für Rockchip Linux Secure Boot — en 7](/docs/rockchip-linux-secure-boot/assets/en-p007-figure-01.png)

Trust liegt auf derselben Stufe wie U-Boot und wird ebenso durch SPL/Loader geprüft; neuere Plattformen integrieren Trust in U-Boot. Im beschriebenen Verfahren verwenden die Images denselben Schlüsselsatz: Ein öffentlicher Schlüsselhash in OTP/eFuse genügt, danach prüft jede Stufe die nächste und bildet eine Vertrauenskette. U-Boot schützt nachfolgende Stufen; Systemprüfung/-entschlüsselung übernimmt Ramdisk (siehe Systemsicherheit).

### 1.2 Sichere Speicherung

Der Vertrauensanker muss in einem Hardwaremodul gespeichert und fest an das Gerät gebunden sein. Zusätzlich bietet Linux folgende Bereiche für kundenspezifische Sicherheitsinformationen.

| Speicherbereich | Beschreibung |
| --- | --- |
| OTP / eFuse | Im SoC; irreversible Sicherungsprogrammierung. OTP durch Miniloader/SPL, eFuse durch PC-Werkzeuge. Historische englische Liste: eFuse RK3399/RK3288; OTP RK3308/RK3326/PX30/RK3328. Kapazität chipabhängig, meist ein bis zwei Schlüssel. |
| RPMB | Physische eMMC-Partition, nicht als Dateisystem sichtbar; nur authentisierter SoC-/TEE-Zugriff, verschlüsselt, nicht einhängbar. |
| Security Partition | Logische Flash-Partition als RPMB-Ersatz; verschlüsselt, TEE-Zugriff, nicht einhängbar. Zwangslöschen möglich. Englisch V4.0.0 nennt TEE-Fehler und Startversagen; Chinesisch V4.1.1 nennt TEE-Neuinitialisierung und Verlust des bisherigen Inhalts. |

OTP/eFuse wird überwiegend intern durch Rockchip verwendet; Kundendaten bevorzugt in RPMB/Security speichern. Bei zwingendem OTP-Bedarf entsprechende Unterlagen über den Geschäftskontakt anfordern.

## 2. Secure Boot

Unter Linux gibt es FIT und AVB mit gleichem Schutzziel; sie dürfen nicht gemischt werden. Das Verfahren anhand der Plattformtabelle wählen.

### 2.1 FIT

FIT (Flattened Image Tree) ist ein von U-Boot unterstütztes Format zum Starten, Packen und Prüfen mehrerer Images. Eine its-Datei (Image Source File) beschreibt die Images; mkimage erzeugt itb (Flattened Image Tree Blob). its nutzt DTS-Syntax, ist mit libfdt und dessen Werkzeugen kompatibel und bringt ein Signaturprüfverfahren mit. Details: Kapitel 12 von Rockchip_Developer_Guide_UBoot_Nextdev.

#### 2.1.1 Schlüssel erzeugen

Im U-Boot-Projekt drei Befehle zum Erzeugen eines RSA-Paars ausführen. Üblicherweise wird es einmal erstellt und anschließend zum Signieren und Prüfen verwendet. Schlüssel sicher aufbewahren.

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

Bei fehlender .rnd, etwa Can't load /home4/cjh//.rnd into RNG und RAND_load_file:Cannot open file:../crypto/rand/randfile.c:88:Filename=/home4/cjh//.rnd, nennt die Quelle touch ~/.rnd. Ergebnis mit ls keys/ prüfen. Dies behandelt den beschriebenen Quellfall und empfiehlt keine Abschwächung der Zufallsquelle.

```text
dev.crt dev.key dev.pubkey
```

keys, dev.key, dev.crt und dev.pubkey sind im its festgelegt; Änderungen verursachen Paketierungsfehler.

#### 2.1.2 Konfiguration

In U-Boot-defconfig aktivieren:

```text
# Required
CONFIG_FIT_SIGNATURE=y
CONFIG_SPL_FIT_SIGNATURE=y

# Optional
CONFIG_FIT_ROLLBACK_PROTECT=y       # boot.img Rollback protect
CONFIG_SPL_FIT_ROLLBACK_PROTECT=y   # uboot.img Rollback protect
```

Einstellungen über make menuconfig wählen und defconfig mit make savedefconfig aktualisieren, um falsche Abhängigkeiten und Buildfehler zu vermeiden.

#### 2.1.3 U-Boot bauen und Firmware signieren

Beim Build werden boot.img, recovery.img, loader.bin und uboot.img gemeinsam signiert. Pfade von boot.img/recovery.img vorher bestimmen. (1) Basisbefehl ohne Rückrollschutz:

```text
./make.sh rv1126 --spl-new --boot_img boot.img --recovery_img recovery.img
```

Build-Ergebnis:

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

(2) Erweiterung 1: Bei Rückrollschutz rollback-Versionsparameter zum Basisbefehl ergänzen. Beispiel:

```text
// Specify the minimum version numbers of uboot.img, boot.img and recovery.img as
10, 12 and 12 respectively.
./make.sh rv1126 --spl-new --boot_img boot.img --recovery_img recovery.img --
rollback-index-uboot 10 --rollback-index-boot 12 --rollback-index-recovery 12
```

Build-Ergebnis:

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

(3) Erweiterung 2: Zum irreversiblen Schreiben des öffentlichen Schlüsselhashs in OTP/eFuse --burn-key-hash zu (1) oder (2) ergänzen. Beispiel:

```text
# Specify the minimum version numbers of uboot.img, boot.img and recovery.img as
10, 12 and 12 respectively.
# Require burning the public key hash into OTP/eFUSE in the SPL stage.
./make.sh rv1126 --spl-new --boot_img boot.img --recovery_img recovery.img --
rollback-index-uboot 10 --rollback-index-boot 12 --rollback-index-recovery 12 --
burn-key-hash
```

Mit Rückrollschutz darf die neue Version nicht kleiner als die vorherige sein; gleiche Versionen sind erlaubt. Andernfalls wird der Start verweigert. Build-Ergebnis:

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

Beim Einschalten meldet SPL RSA: Write key hash successfully. Das Schreiben des Hashs bestimmt die Loader-Prüfung durch Maskrom und ist irreversibel; die U-Boot-Prüfung durch den Loader und weitere Stufen bleiben gleich. Deshalb empfiehlt die Quelle während der Fehlersuche kein --burn-key-hash. (4) Erweiterung 3: boot/recovery lassen sich separat signieren, wenn zuvor mindestens einmal ein vollständiger signierter U-Boot gebaut wurde.

```text
./make.sh rv1126 --spl-new
# Before compilation, ensure that U-Boot has been compiled at least once with
signing enabled.

./scripts/fit.sh --boot_img boot.img            # Sign boot.img separately
./scripts/fit.sh --recovery_img recovery.img    # Sign recovery.img separately
```

Erforderlicher Patch: scripts: fit.sh: repack boot / recovery individually, Change-Id Ib9c0396625971469e13e8092d233e2aea5714486. (5) Parameter: --boot_img und --recovery_img sind optional und wählen zu signierende Images. --rollback-index-uboot, --rollback-index-boot, --rollback-index-recovery setzen Rückrollschutzversionen. Ohne --spl-new wird SPL aus rkbin in den Loader gepackt; mit diesem Parameter der aktuell gebaute SPL.

u-boot-spl.dtb muss den kundeneigenen öffentlichen RSA-Schlüssel enthalten; daher liefert Rockchip keinen fertigen Secure-Boot-SPL in rkbin. Beim Build ist --spl-new erforderlich. Alternativ einen eigenen stabilen SPL in rkbin ablegen und danach ohne diesen Parameter verwenden. Ergebnisse umfassen loader, uboot.img und boot.img; bei unverändertem RSA-Schlüssel sind Einzelupdates möglich.

#### 2.1.4 Startprüfung

Nach korrekter Firmwarekonfiguration und Schreiben des Key Hash in OTP gemäß entsprechendem Abschnitt erscheint folgendes Protokoll.

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

Das Ersetzen geschützter Firmware durch unsignierte muss einen normalen Start verhindern.

### 2.2 AVB

AVB (Android Verified Boot) bildet eine Vertrauenskette vom Hardwareanker über Loader und Partitionen vor/nach U-Boot, etwa boot/recovery. Unter Linux wird mangels Android-Komponenten ein reduziertes AVB nur für boot/recovery genutzt. Loader→U-Boot wird durch Rockchips proprietäres Verfahren geprüft.

#### 2.2.1 Schlüssel erzeugen

Loader→U-Boot benötigt wie FIT ein RSA-Paar. Zusätzlich nutzt AVB vier Schlüssel: PRK (Product RootKey), AVB-Wurzel, auf eFuse durch Base Secure Boot geprüft, auf OTP durch den vorab gespeicherten PRK-Hash; PIK (Product Intermediate Key), Zwischenschlüssel; PSK (Product Signing Key), Firmware-Signatur; PUK (Product Unlock Key), Entsperrung.

![Entwicklerleitfaden für Rockchip Linux Secure Boot — en 15](/docs/rockchip-linux-secure-boot/assets/en-p015-figure-01.png)

Aus den vier Schlüsseln entstehen die Dateien im Diagramm; AVB-Beschreibung: https://android.googlesource.com/platform/external/avb/+/master/README.md. Unter Linux wird die Firmwareprüfung herausgelöst. Für eFuse erzeugt Rockchip zusätzlich permanent_attributes_cer.bin: Der Loader prüft permanent_attributes.bin mit seinem öffentlichen Schlüssel, ohne die Attribute in eFuse zu speichern. Testschlüssel/-zertifikate unter tools/linux/Linux_SecurityAVB/avb_keys nur zum Debuggen nutzen; im Produkt durch eigene ersetzen. Erzeugung siehe unten.

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

AVB-Schlüssel bestehen somit aus zwei Teilen in zwei Verzeichnissen:

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

#### 2.2.2 Konfiguration

2.2.2.1 Trust

Unter rkbin/RKTRUST beispielsweise für RK3308 RK3308TRUST.ini suchen und ändern:

```text
[BL32_OPTION]
SEC=0
```

In:

```text
[BL32_OPTION]
SEC=1
```

Bei Trust im TOS-Format, etwa RK3288TOS.ini, ist BL32_OPTION bereits aktiviert.

2.2.2.2 U-Boot

U-Boot benötigt folgende Funktionen:

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

Auf manchen Plattformen ist fastboot deaktiviert. Beim normalen Start Ctrl-M halten, um die Speicherbelegung zu sehen; Adresse und Größe von CONFIG_FASTBOOT_BUF_* dürfen nicht kollidieren. ./make.sh xxxx erzeugt uboot.img, trust.img und loader.bin.

2.2.2.3 Parameter

vbmeta ist erforderlich, enthält Partitionssignaturen und ist 1M groß. security wird je nach Hardware als RPMB-Ersatz ergänzt, etwa bei Nicht-eMMC ohne RPMB; typisch 4M. CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION erzwingt security. Beispiel-Partitionstabelle:

```text
# AVB parameter:
0x00002000@0x00004000(uboot),0x00002000@0x00006000(trust),0x00002000@0x00008000(
misc),0x00010000@0x0000a000(boot),0x00010000@0x0001a000(recovery),0x00010000@0x0
002a000(backup),0x00020000@0x0003a000(oem),0x00300000@0x0005a000(system),0x00000
800@0x0035a000(vbmeta),0x00002000@0x0035a800(security),-
@0x0035c800(userdata:grow)
uuid:system=614e0000-0000-4b53-8000-1d28000054a9
```

Im Downloadwerkzeug gleichzeitig Partitionsnamen ändern und parameter.txt neu laden.

#### 2.2.3 Firmware signieren

Loader, U-Boot und Trust werden mit rk_sign_tool signiert.

```text
export RK_SIGN_TOOL=${SDK_DIR}/rkbin/tools/rk_sign_tool
export KEYS=${SDK_DIR}/u-boot/keys    # Keys generates chapters. The key is
stored under uboot/keys by default,.
${RK_SIGN_TOOL} cc --chip $CHIP
${RK_SIGN_TOOL} lk --key $KEYS/dev.key --pubkey $KEYS/dev.pubkey

${RK_SIGN_TOOL} sl --loader < path to loader.bin >
${RK_SIGN_TOOL} si --img < path to trust.img or uboot.img >
```

Standardmäßig schreibt die Signierung keinen Public Key Hash in OTP, was Debugging erleichtert. Zum Schreiben sign_flag=0x20 in ${SDK_DIR}/rkbin/tools/setting.ini ergänzen. Boot/Recovery werden mit avbtool signiert:

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

#### 2.2.4 AVB-Schlüssel programmieren

AVB kennt Lock und Unlock. Lock prüft strikt und stoppt bei Fehlern — für Produktion. Unlock warnt, lässt den Start aber zu — für Debugging. Der Zustand wird über fastboot geändert. Nach Flashen der AVB-Firmware nach fastboot starten, Schlüssel vom PC programmieren und sperren. Manche U-Boot-Versionen starten erstmals automatisch fastboot; andernfalls reboot fastboot verwenden. Befehle für Schlüssel und Sperrung:

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

Nach Sperrung und Neustart erscheint:

```text
ANDROID: reboot reason: "(none)"
read_is_device_unlocked() ops returned that device is LOCKED
```

Zum Entsperren bei Bedarf:

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

#### 2.2.5 Startprotokoll

Nach vollständigem Flashen der AVB-Firmware und Sperren erscheint:

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

#### 2.2.6 Hilfsskript

Unter tools/linux/Linux_SecurityAVB/ liegen Verwaltungsskripte. Die Quelle nennt avb_user_avb_user_tool.sh; tatsächlichen Namen prüfen. Funktionen:

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

#### 2.2.7 Nichtstandardisierte AVB-Vereinfachung

Normales AVB verlangt separates Laden öffentlicher Schlüssel und erschwert dadurch die Produktion. Ein öffentlicher Schlüssel dient nur der Prüfung und darf offen gespeichert werden, solange er vor Änderungen geschützt ist. Daher kann er in U-Boot eingebettet werden, das wiederum vom Loader geprüft wird und so den Schlüssel schützt.

Dies ersetzt den separaten fastboot-Schlüsseldownload. Die Änderung ist nichtstandardisiert, muss manuell angewandt werden und wird nicht in den Hauptzweig übernommen.

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

Öffentliche Schlüsseldatei erzeugen und vor dem Build in U-Boot ablegen.

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

U-Boot gemäß AVB-Abschnitt konfigurieren und signiert bauen.

## 3. Systemsicherheit

![Entwicklerleitfaden für Rockchip Linux Secure Boot — en 24](/docs/rockchip-linux-secure-boot/assets/en-p024-figure-01.png)

Das Diagramm zeigt Systemprüfung/-entschlüsselung durch boot.img:

1. boot.img muss durch Secure Boot geschützt sein; dies ist die Grundlage.

2. Ramdisk bildet Security-System über Luksmeta und Kernel-Device-Mapper als vroot ab; switch_root wechselt anschließend zum endgültigen System.

3. Lese-/Schreibzugriffe auf das Root-Dateisystem gelangen über Device-Mapper zu Security-System.

4. Erkannte Änderungen geschützter Daten führen zu I/O-Fehlern; der veränderte Bereich ist nicht nutzbar.

### 3.1 Device-Mapper

Vollständiges Hashen großer Systempartitionen verzögert den Start. Device-Mapper ermöglicht zugriffsbezogene Kernelprüfung und mit Crypt Verschlüsselung/Entschlüsselung. Im dm-verity-Beispiel wird das Image in 4K-Blöcke geteilt; deren Hashes bilden iterativ eine mehrstufige Hash-Map und einen Root-Hash.

![Entwicklerleitfaden für Rockchip Linux Secure Boot — en 25](/docs/rockchip-linux-secure-boot/assets/en-p025-figure-01.png)

Root-Hash prüft die Hash-Map, dann erzeugt und mountet dm-verity eine virtuelle Partition. Bei I/O vergleicht der Kernel den Hash des jeweiligen 4K-Blocks; Abweichungen erzeugen I/O-Fehler wie bei Dateisystemschäden. Die Quelle beschreibt analog den Austausch von Hashing gegen symmetrische Verschlüsselung; dies sind unterschiedliche Schutzeigenschaften, siehe Hinweise. Vorteil: schneller Start, besonders bei großen Images; Nachteil: etwas geringere Lesegeschwindigkeit. Details: Kernel-Documentation/device-mapper/ und https://source.android.google.cn/security/verifiedboot/dm-verity.

#### 3.1.1 Konfiguration

Im Kernel Device-Mapper aktivieren:

```text
CONFIG_BLK_DEV_DM=y
CONFIG_DM_CRYPT=y
CONFIG_BLK_DEV_CRYPTOLOOP=y
CONFIG_DM_VERITY=y
```

Ein allein durch den Kernelbuild erzeugtes boot.img prüft/entschlüsselt noch nicht aktiv. Ramdisk muss wie nachfolgend beschrieben mit dem Kernel gepackt werden.

### 3.2 Systemabbild verarbeiten

Prüfung oder Verschlüsselung gemäß Anforderungen wählen.

#### 3.2.1 System-Verity

veritysetup konfiguriert dm-verity, ein auf Device-Mapper basierendes Kernelmodul für Blockintegrität und Erkennung unerlaubter Dateisystemänderungen. Das Werkzeug erzeugt Hash-Map und Root-Hash aus dem Systemabbild. Die Hash-Map wird angehängt, der Root-Hash in boot.img-Ramdisk gepackt. Beim Start erzeugt Ramdisk das dm-verity-Gerät vroot, mountet es und führt switch_root aus. Auf dem PC Image bearbeiten und Root-Hash speichern:

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

Root-Hash liegt in security.info für die spätere init-Konfiguration. Das Image enthält zusätzlich die Hash-Map, lässt sich aber weiterhin ohne veritysetup als gewöhnliches Dateisystem mounten — dann greift diese Prüfung nicht.

#### 3.2.2 System-Encryption

dmsetup verwaltet virtuelle Device-Mapper-Blockgeräte für Zusammenführung, Aufteilung, Neuzuordnung und Verschlüsselung. Auf dem PC wird ein verschlüsselter Container angelegt und das System hineinkopiert.

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

Das Ergebnis ist Geheimtext und nicht direkt nutzbar. Ramdisk erhält Algorithmus und Schlüssel, erzeugt mit dmsetup /dev/mapper/vroot und mountet es. Siehe Ramdisk-init-Konfiguration. Anders als den System-Verity-Root-Hash darf man den geheimen System-Encryption-Schlüssel nicht direkt in der Ramdisk-Firmware speichern.

3.2.2.1 Schlüsselspeicherung

Der Verschlüsselungsschlüssel liegt nicht in Ramdisk. Das SDK-Demoverfahren legt ihn zunächst in misc.img ab; Ramdisk liest ihn, überträgt ihn nach RPMB/Security und löscht misc.img. Schlüssel auf dem PC in misc.img packen:

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

Schlüsselverarbeitung in Ramdisk:

![Entwicklerleitfaden für Rockchip Linux Secure Boot — en 28](/docs/rockchip-linux-secure-boot/assets/en-p028-figure-01.png)

RPMB-Lese-/Schreibzugriffe erfolgen über KeyBox. Um die Nutzung einer extrahierten Kopie einzuschränken, gibt es Laufzeitprüfungen: nur in Ramdisk und in einem Programm mit PID=1. Details im KeyBox-Abschnitt.

### 3.3 Ramdisk konfigurieren

Ramdisk ist ein kleines Buildroot-System, zusammen mit dem Kernel in boot.img. Es prüft/entschlüsselt das System; danach wechselt switch_root zum Zielsystem und gibt Ramdisk frei. Die Konfiguration hängt vom Zweck ab.

#### 3.3.1 Ramdisk-Startskript

Die Arbeit erfolgt in /init (buildroot/output/rockchip_${chip}_ramboot/target/init). Das Skript prüft oder entschlüsselt je nach Image-Typ und erzeugt vroot. Der Ablauf berücksichtigt A/B, Prüfung und Verschlüsselung.

![Entwicklerleitfaden für Rockchip Linux Secure Boot — en 29](/docs/rockchip-linux-secure-boot/assets/en-p029-figure-01.png)

[1] Bei Verschlüsselung wird das Dateisystem auf die tatsächliche Größe der Systempartition erweitert.

init entsteht aus buildroot/board/rockchip/common/security-ramdisk-overlay/init.in. security.info zuvor gemäß System-Verity oder System-Encryption vorbereiten; es wird nachfolgend benötigt.

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

#### 3.3.2 Ramdisk-Buildkonfiguration

rockchip_&lt;chip_name&gt;_ramboot_defconfig ist standardmäßig für System-Verity ausgelegt. Für System-Encryption ergänzen:

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

BR2_ROOTFS_OVERLAY+="board/rockchip/common/security-ramdisk-overlay/" integriert init in Ramdisk. BR2_PACKAGE_TEE_USER_APP-Optionen sind unter KeyBox beschrieben und bedarfsgerecht zu wählen. Ramdisk ist ein vollständiges Zwischensystem und wird wie normales Buildroot gebaut:

```text
cd buildroot
./build/envsetup.sh rockchip_${chip}_ramboot_defconfig   # chip: Fill in
according to actual situation
make # Firmware is generated in
output/rockchip_${chip}_ramboot/images/rootfs.cpio.gz
```

Ein eigener Ramdisk ist unter folgenden Bedingungen möglich:

1. Luksmeta-Werkzeuge integrieren, mindestens veritysetup für Prüfung und dmsetup für Verschlüsselung.

2. Für Verschlüsselung TEE-Programme zum Lesen/Schreiben der Schlüssel und updateEngine zum Lesen aus misc portieren. Letzteres kann separat implementiert oder durch eine andere Schlüsselquelle ersetzt werden.

3. init gemäß Konfigurationsabschnitt für das Mounten des neuen Systems anpassen.

#### 3.3.3 Ramdisk packen

Ramdisk wird mit dem Kernel zu boot.img gepackt; die Methode hängt vom Verfahren ab.

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

Das erzeugte boot.img gemäß FIT-Erweiterung 3 oder AVB-Signaturabschnitt signieren.

## 4. KeyBox

Verschlüsselungsschlüssel werden gewöhnlich über OPTEE in RPMB/Security gespeichert. Da dieser Code Herstellergeheimnisse verarbeitet, sollte er selbst entwickelt werden. Das SDK enthält den von System-Encryption genutzten Demo-KeyBox; für Produkte wird Überarbeitung empfohlen. Unter &lt;SDK&gt;/external/security/ liegen bin (vorkompilierte nichtöffentliche Teile und Header der OPTEE-Basisbibliothek) und rk_tee_user (eigene CA/TA-Builds und Demos). OPTEE-Details: Rockchip_Developer_Guide_TEE_SDK_CN.pdf. Nachfolgend wird KeyBox gebaut.

### 4.1 Separater Build

KeyBox-Quellen: &lt;SDK&gt;/buildroot/package/rockchip/tee-user-app.

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

host und ta aus extra_app in die entsprechenden rk_tee_user-Bereiche übernehmen, etwa:

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

rk_tee_user erzeugt gleichzeitig CA (keybox_app) und TA. CA läuft im Benutzerraum mit der System-Toolchain. TA läuft in TrustZone und benötigt die zu BL32/TEE passende Toolchain, ohne besondere Angabe 32-Bit. Daher können zwei Toolchains nötig sein. Beispiel: System 64-Bit, TA 32-Bit.

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

### 4.2 tee_user_app bauen

Unter Buildroot wird KeyBox durch tee_user_app gebaut. Beispiel für ein 64-Bit-System mit 32-Bit-TA:

```text
BR2_PACKAGE_TEE_USER_APP=y
BR2_PACKAGE_TEE_USER_APP_COMPILE_CMD="6432"
BR2_PACKAGE_TEE_USER_APP_TEE_VERSION="v2"
BR2_PACKAGE_TEE_USER_APP_EXTRA_TOOLCHAIN="$(PATH_TO_CROSS_COMPILE)"
```

KeyBox und TA werden automatisch ins System integriert.

### 4.3 OPTEE im Kernel aktivieren

KeyBox basiert auf OPTEE; Unterstützung im Kernel ergänzen.

```text
CONFIG_TEE=y
CONFIG_OPTEE=y
```

Zusätzlich den optee-Knoten in DTS konfigurieren.

```text
optee: optee {
        compatible = "linaro,optee-tz";
        method = "smc";
        status = "okay";
}
```

### 4.4 Empfehlungen zur KeyBox-Anpassung

Das allgemeine KeyBox-Beispiel ist allen zugänglich und sollte zur Absicherung angepasst werden. Nur in vertrauenswürdiger FIT-/AVB-Umgebung einsetzen. TA gemäß Kapitel 5 TA Signing in Rockchip_Developer_Guide_TEE_SDK_CN.pdf signieren, um fremde TAs auszuschließen. CA-Umgebung beschränken, damit extrahierte CAs außerhalb des Schutzes keine Geheimnisse lesen. Standardmäßig ist Schlüsselschreiben überall erlaubt, Lesen nur in Ramdisk mit PID=1. CA–TA-Kommunikation überarbeiten: Die Demo nutzt einfache Zufallsprüfungen und liefert bei Kommunikationsfehlern einen Zufallsschlüssel.

## 5. Sicherheitsinformationen programmieren

### 5.1 Key Hash

Sicherheitsmedium anhand der Chiptabelle bestimmen und das passende Verfahren verwenden.

#### 5.1.1 OTP

Zur Secure-Boot-Aktivierung per OTP die OTP-Pins während der Loader-Stufe versorgen. Firmware mit AndroidTool (Windows) oder upgrade_tool (Linux) laden. Beim ersten Neustart schreibt der Loader den Schlüsselhash in OTP und aktiviert den Schutz; beim nächsten Start greift die Prüfung. Das Schreiben ist irreversibel.

![Entwicklerleitfaden für Rockchip Linux Secure Boot — en 35](/docs/rockchip-linux-secure-boot/assets/en-p035-figure-01.png)

#### 5.1.2 eFuse

Für eFuse muss VCC_IO im MaskRom-Zustand (Hardwaregrundzustand) versorgt sein; VCC_EFUSE benötigt folgende Versorgungsschaltung.

![Entwicklerleitfaden für Rockchip Linux Secure Boot — en 35](/docs/rockchip-linux-secure-boot/assets/en-p035-figure-02.png)

tools/windows/eFusetool_vXX.zip verwenden und die Platine nach MaskRom versetzen. Über Firmware signiertes update.img oder Miniloader.bin wählen; Start beginnt die irreversible eFuse-Programmierung.

![Entwicklerleitfaden für Rockchip Linux Secure Boot — en 36](/docs/rockchip-linux-secure-boot/assets/en-p036-figure-01.png)

Nach erfolgreichem Schreiben aus-/einschalten, MaskRom starten und die übrigen signierten Images laden.

### 5.2 Kundenspezifische Sicherheitsinformationen

Für eigene Geheimnisse wird OPTEE empfohlen; siehe Rockchip_Developer_Guide_TEE_SDK_CN.pdf.

## 6. Security Demo

Zur Vereinfachung der manuellen Einrichtung integriert das SDK Verwaltungsskripte in build.sh: Wenige Optionen wählen Prüfung oder Verschlüsselung. Prinzipien und Einzelheiten stehen oben. Die Skripte basieren auf dem allgemeinen SDK; Versionsunterschiede können sie stören, universelle Kompatibilität ist nicht garantiert. Bei Fehlern anhand der ausführlichen Abschnitte debuggen.

Da die Schutzlösung öffentlich und detailkritisch ist, neben schneller Inbetriebnahme die Prinzipien analysieren und an die eigenen Produktanforderungen anpassen.

### 6.1 SDK-Konfiguration

Im SDK-Hauptverzeichnis öffnet make menuconfig die Buildkonfiguration; Sicherheitsoptionen stehen unter RK_SECURITY.

![Entwicklerleitfaden für Rockchip Linux Secure Boot — en 37](/docs/rockchip-linux-secure-boot/assets/en-p037-figure-01.png)

Detaillierte Konfiguration:

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

RK_SECURITY_BURN_KEY ist zum Debuggen standardmäßig aus. Der Hash wird nicht in OTP geschrieben, loader.bin gilt als vertraut und kann ersetzt werden; ab dem Loader werden U-Boot und weitere Stufen strikt geprüft. Für Produktion ist nach Prüfung des Verfahrens eine bewusste Hashprogrammierung erforderlich. ./build.sh oder make startet den Build; Fehler anhand Meldungen und Dokumentation beheben. Buildprüfungen erfassen nur wichtige Optionen.

SDK-Standards unterscheiden sich; ein erfolgreicher Build garantiert keinen vollständigen Schutz. Abschließende Prüfung ist erforderlich. Bei Problemen die fehlerhafte Prüfstufe bestimmen und den entsprechenden Abschnitt heranziehen.

### 6.2 Detaillierte Konfiguration

#### 6.2.1 Schlüssel erzeugen

Schlüsselerzeugung:

```text
./build.sh createkeys
```

Für Verschlüsselung speichert die Quelle ein Passwort eines root-berechtigten Benutzers im U-Boot-Arbeitsverzeichnis für den Build; dies ist ein Buildhost-Geheimnis, kein Geräteschlüssel. Warnung unten beachten.

```text
echo "Password for sudo" > u-boot/keys/root_passwd
```

Die Verschlüsselung nutzt loopback auf dem Build-PC und benötigt root-Rechte. Auf Servern ohne entsprechende Rechte ist dieses Verfahren nicht verfügbar.

#### 6.2.2 U-Boot anpassen

Verfahren gemäß Kernel-Prüfmethode der Plattformtabelle wählen. Für FIT ergänzen:

```text
CONFIG_FIT_SIGNATURE=y
CONFIG_SPL_FIT_SIGNATURE=y
```

AVB erfordert umfangreichere U-Boot-Änderungen; siehe dessen Konfigurationsabschnitt.

#### 6.2.3 Kernel anpassen

OPTEE und Device Mapper aktivieren:

```text
CONFIG_BLK_DEV_DM=y
CONFIG_DM_CRYPT=y
CONFIG_BLK_DEV_CRYPTOLOOP=y
CONFIG_DM_VERITY=y

CONFIG_TEE=y                 # It is required in encryption system
CONFIG_OPTEE=y               # It is required in encryption system
```

OPTEE-Knoten in DTS ergänzen:

```text
optee: optee {
        compatible = "linaro,optee-tz";
        method = "smc";
        status = "okay";
}
```

#### 6.2.4 Buildroot anpassen

In der Buildroot-Konfiguration ergänzen:

```text
BR2_ROOTFS_OVERLAY+="board/rockchip/common/security-system-overlay"
```

#### 6.2.5 Ramdisk anpassen

Ramdisk ist standardmäßig auf Prüfung eingestellt. Für Verschlüsselung ergänzen:

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

### 6.3 Prüfverfahren

Geschützte Stufen: loader, trust, U-Boot, boot, system. Geschützte Firmware bauen, Schlüssel korrekt programmieren und normalen Start sicherstellen. Zunächst vorhandene Startfehler beheben.

Auf einem separaten Testgerät unsignierte Firmware oder Firmware mit anderem Schlüssel vorbereiten. Ersetzen eines geschützten Images muss den Start verhindern. Falls der Schutz ausbleibt, anhand der Kette die Stufe bestimmen und deren Konfiguration prüfen. Dies ist ein negativer Test, keine hier ausgeführte Aktion.

### 6.4 Fehlersuche

Wenn init nicht ins System wechselt, Ausgaben aktivieren und Diagnosemeldungen mit DEBUG ergänzen; Zustand anhand des Ramdisk-init-Abschnitts bestimmen.

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

## 7. Referenzen der englischen Fassung V4.0.0

Rockchip_Developer_Guide_UBoot_Nextdev_CN.pdf; Rockchip-Secure-Boot-Application-Note-V1.9.pdf; Rockchip-Secure-Boot2.0.pdf; Rockchip_Developer_Guide_TEE_SDK_CN.pdf; SDK/kernel/Documentation/device-mapper/; https://android.googlesource.com/platform/external/avb/+/master/README.md; https://source.android.google.cn/security/verifiedboot/dm-verity.

## Ergänzungen und Ersatzkonfiguration aus Chinesisch V4.1.1

### 1.4 Schlüsselarten (Chinesisch V4.1.1)

Die Tabelle nennt Schlüssel, Speicherung, Zweck und Programmierstufe je nach Chip und Einsatz.

| Schlüssel | Speicherung [1] | Zweck | Programmierung |
| --- | --- | --- | --- |
| Secure Boot Public Key Hash | OTP oder EFUSE | Prüft Bootrom bis U-Boot; FIT prüft auch Boot/Recovery. | SPL-Programmierung (eFuse: PC-Werkzeugbeschränkung beachten). |
| AVB permanent_attributes.bin | OTP oder RPMB [2] | Nur AVB [3]. OTP bevorzugt, sonst RPMB. Prüft vbmeta und AVB-fastboot-Daten; vbmeta prüft Boot/Recovery. | U-Boot, Fastboot |
| AVB permanent_attributes_cer.bin | EFUSE (Quellenbezeichnung) | Nur AVB [3]; bei OTP überspringen. Prüft permanent_attributes.bin im RPMB. | U-Boot, Fastboot |
| System Encryption Key [4] | RPMB [2] | Entschlüsselt das System. Demo verschiebt den Klartextschlüssel beim ersten Start aus misc nach RPMB und überschreibt misc. | Ramdisk, KeyBox |

[1] Speicherbereiche siehe Sichere Speicherung. [2] RPMB gehört zu eMMC; bei anderen Medien dient Security als Alternative. [3] Plattformtabelle beachten.

[4] Siehe System-Encryption. Die Demo legt den geheimen Schlüssel zunächst im Klartext in misc ab, überträgt ihn beim ersten Start in sicheren Speicher und überschreibt den Klartext.

Chinesisch V4.1.1, Quellseite 9:

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

#### 2.1.2 FIT-rkbin-Konfiguration (neue chinesische Einordnung)

Unter rkbin/RKTRUST für das Quellbeispiel RK3308 RK3308TRUST.ini suchen und die Einstellung ändern. Dies ist ein Quellenbeispiel, keine Aussage, dass RK3308 laut Plattformtabelle FIT nutzt.

Chinesisch V4.1.1, Quellseite 10:

```text
[BL32_OPTION]
SEC=0
```

Ändern in:

Chinesisch V4.1.1, Quellseite 10:

```text
[BL32_OPTION]
SEC=1
```

Trust im TOS-Format, etwa RK3288TOS.ini, aktiviert BL32_OPTION standardmäßig. Chinesisch AVB 2.2.2.1 verweist auf diese gemeinsame Einstellung.

Chinesisch V4.1.1, Quellseite 10:

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

#### 2.1.5 Schlüsselwiderruf (nur RV1126B)

Das beschriebene Verfahren wird nur von RV1126B unterstützt. (1) Ursprünglichen ersten Schlüssel in u-boot/ori_keys, neuen in u-boot/keys ablegen; wie unter FIT erzeugen. (2) Folgende U-Boot-Option aktivieren.

Chinesisch V4.1.1, Quellseite 13:

```text
CONFIG_SPL_ROVOKE_PUB_KEY=y
```

(3) Gemäß U-Boot-Signierverfahren bauen und flashen: Der neue Schlüssel wird geschrieben und aktiviert. (4) Danach das Makro deaktivieren:

Chinesisch V4.1.1, Quellseite 13:

```text
CONFIG_SPL_ROVOKE_PUB_KEY=n
```

ori_keys wird nicht mehr benötigt; normal bauen. (5) Aktuelles U-Boot unterstützt standardmäßig einen Widerruf; mehrere erfordern das Verfahren in Rockchip_Developer_Guide_UBoot_Nextdev_CN.pdf. Dieser plattformspezifische Austausch löscht oder revidiert keine OTP-/eFuse-Programmierung.

#### 2.2.8 AVB-Hinweise zur security-Partition

Bei security-Speicherung verlangt die chinesische Quelle die vereinfachte AVB-Änderung, die Lock im geprüften U-Boot erzwingt. Löschen der logischen Partition kann den Sperrzustand entfernen und zur Initialisierung als Unlock führen. RPMB erfordert authentifizierten Zugriff und hat nicht dasselbe hier beschriebene versehentliche Löschverhalten. Nicht auf die ältere englische Behauptung vertrauen, security-Löschen stoppe zwangsläufig Secure Boot.

|  | System-Verity | System-Encryption |
| --- | --- | --- |
| Auf Datenträger | Klartext | Geheimtext |
| Systemschlüssel | Öffentlicher Klartextschlüssel in Boot.img (Quellenwortlaut; Root-Hash beachten) | Verschlüsselter Schlüssel in RPMB [1] |
| Kopierschutz | Nein | Ja |
| Manipulationsschutz | Ja; Änderungen erzeugen E/A-Fehler | Laut Quelle ja; Änderungen stören die Entschlüsselung, garantieren aber keine authentisierte Integrität |
| Dateisysteme | Alle Dateisysteme, nur lesbar einhängen | Kein UBIFS; les-/schreibbar [2] |

[1] Die Demo speichert den geheimen Schlüssel zuerst offen in misc, überträgt ihn beim ersten Start nach RPMB und überschreibt ihn in misc. [2] UBIFS stellt kein beschreibbares Blockgerät bereit; dieses beschreibbare Verschlüsselungsverfahren ist daher nicht anwendbar. Für schreibgeschützte Verschlüsselung zuerst nach UBI_SQUASHFS umwandeln; es ist nur lesbar und meist kleiner als UBIFS. Die Quelle schreibt auch UBI_SQUAHSFS falsch; tatsächliche Werkzeugnamen prüfen.

Chinesisch V4.1.1, Quellseite 31:

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

### 4.1 security-Partition (Chinesisch V4.1.1)

Nicht-eMMC-Geräte benötigen security für OPTEE-Speicherung als RPMB-Ersatz. RPMB bevorzugen, falls verfügbar: Die logische security-Partition kann versehentlich gelöscht werden. Inhalte sind verschlüsselt und nicht durch direktes Lesen entschlüsselbar. Minimum 1M, davon die Hälfte (512K) für Sicherung. Dieses Minimum unterscheidet sich von typischen 4M im AVB-Beispiel.

#### 4.3.1 tee_user_app-Buildfehler

Bei tee_user_app-Buildfehlern in Buildroot die folgenden Ursachen prüfen, anschließend das Paket bereinigen und neu bauen.

Chinesisch V4.1.1, Quellseite 34:

```text
cd buildroot/output/${system_name}
make tee_user_app-dirclean # 或者 rm build/tee_user_app* -rf

make tee_user_app # 或者重新编译整个buildroot⼯程
```

Häufige Fehler:

1. No module named Crypto.Signature deutet auf eine fehlende Python-Kryptografieabhängigkeit des Buildhosts hin. Historische Quellbefehle folgen; globale Paketentfernung nicht automatisch anwenden.

Chinesisch V4.1.1, Quellseite 34:

```text
pip uninstall Crypto
pip uninstall pycrypto
pip install pycrypto
```

2. ModuleNotFoundError: No module named 'Cryptodome': Quelle nennt pip3 install [--user] pycryptodomex; [--user] bezeichnet eine optionale Angabe, keine wörtlichen Klammern. Ältere SDKs stoppten den Gesamtbuild bei tee_user_app-Fehlern nicht. Folgenden rk_tee_user-Patch prüfen; ohne ihn das Paket separat bauen und Erfolg kontrollieren.

Chinesisch V4.1.1, Quellseite 35:

```text
commit 2dcba4774da20ee5f4aebfe6c797eb3ee555468d
Author: Zain Wang <wzz@rock-chips.com>
Date:   Sat May 11 11:47:38 2024 +0800

 v1/v2: add errexit for build.sh

 Easier to be called by other scripts.

 Signed-off-by: Zain Wang <wzz@rock-chips.com>
 Change-Id: I7f8ff92d800ffec580c6f4fbba19c5f5c948ba23
```

### 4.5 TEE-Sicherheitsniveau

Einige Plattformen bieten zum Debuggen schwache/starke TEE-Stufen und starten standardmäßig mit der niedrigsten; siehe Tabelle. Nicht konfigurierbare Plattformen verwenden standardmäßig die starke Variante. Produkte müssen die starke Variante nutzen. Verfahren: Rockchip_Developer_Guide_TEE_SDK_CN.pdf.

### 4.7 TEE-SDK-Nutzung

Weitere TEE-Informationen: Rockchip_Developer_Guide_TEE_SDK_CN.pdf.

Chinesisch V4.1.1, Quellseite 39:

```text
./build.sh security-createkeys
```

Chinesisch V4.1.1, Quellseite 39:

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

Mit folgendem Buildroot-Patch kann die security-system-overlay-Änderung entfallen.

Chinesisch V4.1.1, Quellseite 40:

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

Bei Systemverschlüsselung die oben beschriebene TEE-Härtung durchführen.

### 6.5 Fremdsysteme

Die bisherigen Skripte zielen auf Buildroot. Andere Systemabbilder vor dem Packen von update.img bearbeiten. SDK-Unterstützung prüfen:

Chinesisch V4.1.1, Quellseite 41:

```text
# ./build.sh --help | grep security

security-createkeys                     create keys for security
security-misc                           build misc with system encryption key
security-ramboot[:system_image]         build security ramboot
security-system[:system_image]          build security system
clean-security                          cleanup security
```

Der Zusatz [:system_image] bei security-system kennzeichnet Fremdimage-Unterstützung.

Zuerst Security Demo vollständig mit der SDK-Sicherheitskonfiguration bauen. Danach gilt dieselbe Konfiguration, aber das Fremdimage ersetzt Buildroot als Ziel. Debian-Beispiel: &lt;SDK&gt;/debian/linaro-rootfs.img.

Chinesisch V4.1.1, Quellseite 42:

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

Fehlen diese Optionen, System und ramboot manuell gemäß Systemverarbeitung und Ramdisk-Konfiguration bearbeiten.

## 7. Sicherheit von Benutzerpartitionen

### 7.1 Benutzerpartition verschlüsseln

Benutzerpartitionsabbild auf dem PC verschlüsseln:

Chinesisch V4.1.1, Quellseite 42:

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

security_system.img in die Zielpartition, etwa userdata, flashen. Auf dem Gerät verschlüsseltes userdata mit den Werten aus security.info mounten:

Chinesisch V4.1.1, Quellseite 42:

```text
dmsetup create userdata --table "0 ${sectors} crypt ${cipher} ${key} 0 /dev/block/by-
name/userdata 0 1 allow_discards"
# ⽣成 /dev/mapper/userdata 节点

mount /dev/mapper/userdata userdata
# 挂载加密分区到userdata节点
```

Den Schlüssel separat speichern, nicht direkt im extrahierbaren Dateisystem. OPTEE-Speicherung wird empfohlen; siehe KeyBox oder TEE-Handbuch.

### 7.2 Benutzerpartition prüfen

Prüfdaten für das Benutzerpartitionsabbild auf dem PC erzeugen:

Chinesisch V4.1.1, Quellseite 43:

```text
./device/rockchip/common/scripts/mk-security.sh system system-verity path_to_userdate_img
# path_to_userdate_img统计⽬录下，⽣成安全固件security_system.img和安全信息security.info

cat $(dirname "path_to_userdate_img")/security.info
touch="2024-12-27 15:46"
hash_offset=4595908608
root_hash=23ea81cdc7f0b903257bcfd38c734064226a8b5d4e59493218418ec0c2fcd743
```

security_system.img etwa nach userdata flashen und die geprüfte Partition mit security.info mounten. Der Quellwiderspruch vroot/userdata wird unten erläutert.

Chinesisch V4.1.1, Quellseite 43:

```text
veritysetup --hash-offset=${hash_offset} create vroot /dev/block/by-name/userdata
/dev/block/by-name/userdata ${root_hash}
# ⽣成 /dev/mapper/userdata 节点

mount /dev/mapper/userdata userdata
# 挂载加密分区到userdata节点
```

## 8. SDK-spezifische Behandlung

### 8.1 RK3506 SDK

RK3506-Standards zielen auf kleinen RAM/Speicher und reservieren keinen TEE-Laufzeitbereich. Für System-Encryption, KeyBox oder OPTEE TEE manuell aktivieren. In SDK-make menuconfig TRUST ergänzen:

Chinesisch V4.1.1, Quellseite 43:

```text
RK_UBOOT_TRUST_INI="RK3506TOS_TA.ini"
```

TEE-Laufzeitspeicher im Kernel-DTS reservieren:

Chinesisch V4.1.1, Quellseite 44:

```text
+&reserved_memory {
+       ta_tee:ta-tee@3c00000 {
+               reg = <0x03c00000 0x00400000>;
+               no-map;
+       };
+};
```

Ohne diese Schritte kann der TA-Aufruf TEEC_Opensession failed with code 0xffff0008 origin 0x3 melden. Derselbe Fehler beweist jedoch nicht, dass fehlender Speicher/Firmware die einzige Ursache ist.

### 8.2 IPC-SDK der RV-Serie

Die RV-IPC-SDK-Verzeichnisstruktur unterscheidet sich vom allgemeinen SDK; Security Demo ist daher nicht direkt nutzbar. Prinzipien und separate Builds bleiben Referenzen. Für IPC-SDK-Skripte das Quick Start des jeweiligen Chips verwenden.

## 9. Aktualisierte Referenzen

Rockchip_Developer_Guide_UBoot_Nextdev_CN.pdf; Rockchip-Secure-Boot-Application-Note-V1.9.pdf; Rockchip-Secure-Boot2.0.pdf; SDK/kernel/Documentation/device-mapper/; https://android.googlesource.com/platform/external/avb/+/master/README.md; https://source.android.google.cn/security/verifiedboot/dm-verity.

### 9.1 Weitere Sicherheitsdokumente

Unter &lt;SDK&gt;/docs suchen: OPTEE — Rockchip_Developer_Guide_TEE_SDK_CN.pdf; Kunden-OTP-Felder — Rockchip_Developer_Guide_OTP_CN.pdf; Kopierschutz der Platine — Rockchip_Developer_Guide_Anti_Copy_Board_CN.pdf; crypto/HWRNG — Rockchip_Developer_Guide_Crypto_HWRNG_CN.pdf.

## Versionsabgleich und Prüfungen vor Ausführung

- Chinesisch enthält neun Kapitel, Englisch sieben. Neu sind Schlüsseltabelle, RV1126B-Key-Ladder/Widerruf, AVB-Security-Risiko, TEE-Stufen/Baufehler, Fremdsysteme, Benutzerpartitionen und RK3506/RV IPC. Alle Ergänzungen folgen unten. Historisches RK3288 in der englischen Speicherbeschreibung bedeutet keine Unterstützung in der neuen Plattformtabelle; pauschales RK356X wird konkretisiert.
- Die alte Tabelle hat vier Kriterien, die neue ergänzt Dateisysteme. Der „öffentliche Klartextschlüssel“ bei System-Verity ist im Kontext von vertrauenswürdigem Root-Hash und Prüfmetadaten zu verstehen, nicht als geheimer Entschlüsselungsschlüssel. aes-cbc-plain besitzt keinen Authentisierungstag. Der behauptete Manipulationsschutz beschreibt fehlerhafte Entschlüsselung, garantiert aber keine kryptografische Integrität oder Abwehr aktiver Manipulation; geeignete Prüfung/Authentisierung ist nötig.
- Die neue Version setzt RSA-Ausgabe auf $(pwd)/keys/ und Schlüsselerzeugung auf ./build.sh security-createkeys (Englisch: aktuelles Verzeichnis und createkeys). tee_arm_v2.config und starke TEE-Stufe kommen hinzu. CONFIG_BLK_DEV_CRYPTOLOOP gilt unter Kernel 6.1. Passende SDK-Konfiguration verwenden, keine gegenseitig ausschließenden OPTEE-V1/V2-Optionen mischen.
- Security ist löschbarer logischer Speicher, nicht RPMB gleichwertig. Englisch nennt Startversagen nach Löschen, Chinesisch TEE-Neuinitialisierung, Datenverlust und möglichen AVB-Lock-Reset. Die neue Vorgabe verlangt erzwungenes Lock im verifizierten U-Boot, statt Unlöschbarkeit anzunehmen.
- Die Tabelle bezeichnet permanent_attributes_cer.bin als EFUSE-Speicherung, beschreibt aber Fastboot und RPMB-Prüfung. Diese Kurzform ist kein rohes eFuse-Dateilayout. Auch die SPL-Bezeichnung hebt die PC-Werkzeugpflicht für eFuse nicht auf. SoC-Layout und Werkzeug prüfen.
- avb_user_avb_user_tool.sh ist eine doppelte Quellenbezeichnung; Befehle nutzen avb_user_tool.sh. Die doppelt extrahierte Tabelle auf chinesischer Seite 21 wird als ein AVB-Schlüsselerzeugungsblock wiedergegeben. Originalkommentare und PDF-Umbrüche bleiben: geteilte Befehle prüfen. Beispielgeheimnisse/Passwörter/Hashes nicht produktiv verwenden.
- Im Fremdsystembeispiel wiederholt ln -rsf security_system.img/security_system.img; ./build.sh nach cd output/firmware ist ebenfalls pfadabhängig. Das Verity-Beispiel erzeugt vroot, spätere Kommentare/mount nutzen userdata: tatsächlichen Mapper-Namen vereinheitlichen. Originalcode und Schreibweise path_to_userdate_img bleiben zur Prüfung erhalten.
- pip/pycrypto dokumentieren eine historische Umgebung, keine aktuellen sicheren Abhängigkeiten; System-Python nicht blind verändern. RK3506-TRUST/reservierter Speicher gelten nur für die genannte Konfiguration; TEEC_Opensession kann andere Ursachen haben. RV IPC kann diese Security Demo nicht direkt ausführen: dessen Quick Start nutzen. Code-Lizenzen/Urheberrechte, Commit-IDs und Originalkommentare bleiben. Deutsch verwendet englische technische Bilder; diese validieren keine elektrische Platinenkonstruktion.

Zusätzlich AVB-Signiercode prüfen: IMAG wird gesetzt, IMAGE gelesen. Das recovery-Beispiel nutzt weiterhin --partition_name boot; get_from_parameter ist ein Implementierungsplatzhalter. Original erhalten, vor Ausführung mit AVB/Partitionslayout abgleichen. Die historische Grafik nennt RSA2048 Encryption/Decryption; sie spezifiziert weder tatsächliches Signaturverfahren noch Padding.

{% endraw %}
