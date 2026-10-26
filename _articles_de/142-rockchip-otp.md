---
title: "Rockchip OTP: sichere Bereiche, Schlüssel und Lebenszyklus"
description: "Rockchip OTP: sichere Bereiche, Schlüssel und Lebenszyklus — V1.9.2."
translation_key: "142-rockchip-otp"
slug: "142-rockchip-otp"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "production"
products: []
tags: [ArmSoM, Rockchip, OTP, TEE]
excerpt: "Rockchip OTP: sichere Bereiche, Schlüssel und Lebenszyklus — V1.9.2."
---

{% raw %}

Vollständiger technischer Inhalt der chinesischen/englischen Originale V1.9.2 (24/25 Seiten). Für ArmSoM jede Unterstützungsmatrix mit konkretem SoC, SDK/BSP, U-Boot, OP-TEE und Kerneltreiber abgleichen. Keine einheitliche Kernelversion oder Unterstützung aller Boards wird zugesichert. Keine ArmSoM-Hardwaretests; Befehle/Ausgaben sind Herstellerbeispiele.

> OTP-Programmierung, Sperren und Berechtigungsreduzierungen im Lebenszyklus können dauerhaft und unumkehrbar sein; Fehler können Booten und Schlüsselzugriff verhindern. Chiphandbuch und passende Implementierung prüfen und auf Testboards validieren. Keine Programmier-, Sicherheitskonfigurations- oder Sperrbefehle wurden ausgeführt.

> Quellprobleme bleiben erhalten: void demo(void) enthält return ret; manche TEE_InvokeTACommand-Fehler werden nur protokolliert, dennoch folgt TEE_SUCCESS; das DTS-Beispiel nutzt # für eine Erläuterung. Vor Nutzung mit Compiler/Treiber prüfen; Algorithmen und Rückgaben wurden nicht still geändert.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip U-Boot](https://github.com/rockchip-linux/u-boot)

## 1 Übersicht

OTP NVM (One Time Programmable Non-Volatile Memory) ist nur einmal programmierbar, anders als wiederholt lösch-/beschreibbarer FLASH. OTP ist in Secure OTP und Non-Secure OTP geteilt. Die normale Welt (etwa U-Boot, Userspace) kann nicht sichere Daten direkt lesen, sichere Daten aber nicht direkt lesen/schreiben. Sensible Daten liegen gewöhnlich in Secure OTP; direkten Zugriff hat nur die sichere Welt, beispielsweise Miniloader/SPL und OP-TEE. TrustZone-/TEE-Grundlagen siehe Rockchip_Developer_Guide_TEE_SDK_CN.md oder Arm-Dokumentation.

## 2. Non-Secure OTP

Non-Secure OTP speichert gewöhnlich bei der Fertigung programmierte Rockchip-Daten wie Chiptyp und CPUID. Die meisten Plattformen reservieren keinen OEM-Bereich; der Kerneltreiber bietet daher nur Lesen. Nur die unten genannten Plattformen haben einen Non-Secure-OTP-OEM-Bereich mit Programmierung für Seriennummern, MAC-Adressen, Produktinformationen und Ähnliches. Standarddatei-APIs ermöglichen Lesen/Schreiben dieses Bereichs.

### 2.1 Unterstützte Plattformen

| Plattform | OTP_OEM_OFFSET | BEREICH | GESAMTGRÖSSE |
| --- | --- | --- | --- |
| RV1126/RV1109 | 0x100 | 0x100 ~ 0x1EF | 240 Bytes |

### 2.2 Verwendung

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

1. Vor jedem OEM Write den Schreibschalter aktivieren, um versehentliches Schreiben zu verhindern.

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

2. Schreibgröße und Offset müssen auf 4 Byte ausgerichtet sein. Geschriebene Daten werden als schreibgeschützt markiert; der Schutz tritt nach dem nächsten Neustart in Kraft.

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

1. Werte 0–15 an Offset 0 des OEM-Bereichs schreiben.

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

2. Ergebnis über OEM Read oder hexdump prüfen. Folgender Befehl zeigt die OEM-Daten.

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

Secure OTP reserviert unterschiedliche OEM-Zonen für verschiedene Anforderungen.

### 3.1 OEM OTP Description

Die Tabelle zeigt unterstützte OEM-Daten. Rockchip-Lese-/Schreibschnittstellen setzen den OEM-Offset intern automatisch. Aufrufer benötigen nur die Datenlänge, keinen expliziten Offset.

| Data | Länge | Beschreibung | Unterstützte Plattformen |
| --- | --- | --- | --- |
| Public Key<br>Hash | 32 or 64 Bytes | Hash des öffentlichen Schlüssels: Secure Boot prüft den Schlüssel und damit anschließend die Firmware. | Alle Plattformen |
| Secure Boot<br>Enable Flag | 4 Bits or 1 Byte | Secure-Boot-Aktivierungsflag: wird beim Aktivieren gesetzt; spätere Starts prüfen die Firmwareauthentizität. | Alle Plattformen |
| AVB<br>Attribute<br>Hash | 32 Bytes | Hash des AVB-Stammzertifikats zur Prüfung im AVB-Ablauf. | Alle OTP-Plattformen |
| FW Encrypt<br>Key | 16 Bytes | Firmware-Verschlüsselungsschlüssel zum Entschlüsseln beim Start. | RK3562/RK3568/RV1126B |
| TA Encrypt<br>Key | 32 Bytes | TA-Schlüssel: verschlüsselte TAs werden vor dem Laden damit entschlüsselt. | RV1126/RV1109<br>RK3308/PX30/RK3326/<br>RK3358/RK3566/RK3568<br>RK3588/RK3528/RK3562<br>RV1106/RV1103/RK3576<br>RV1106B/RV1103B<br>RK3506/RV1126B |
| Security<br>Level | 1 or 2 Bytes | TEE-Sicherheitsstufe wählt den Root Key zur Schlüsselableitung; die Stufen schützen eMMC/sicheren Speicher unterschiedlich stark. | RK3588/RK3528/RK3562<br>RV1106/RV1103/RK3576<br>RV1106B/RV1103B<br>RK3506/RV1126B |
| OEM HUK | 32 Bytes | OEM-definierter hardwareeindeutiger Schlüssel für TEE-Stufe 1; TEE verwendet ihn anschließend zur Schlüsselableitung. | RK3588/RK3528/RK3562<br>RV1106/RV1103/RK3576<br>RV1106B/RV1103B<br>RK3506/RV1126B |
| OEM Encrypt<br>Data | 16 Bytes | Private OEM-Daten für die mittlere Kopierschutzstufe zur Prüfung der Platinenauthentizität. | RV1126/RV1109<br>RK3566/RK3568<br>RK3588/RK3528/RK3562<br>RV1106/RV1103/RK3576<br>RV1106B/RV1103B<br>RK3506/RV1126B |
| Protected<br>OEM Zone | Siehe Abschnitt ProtectedOEM Zone | Siehe Abschnitt Protected OEM Zone | Siehe Abschnitt Protected OEMZone |
| Non-<br>Protected<br>OEM Zone | Siehe Abschnitt Non-Protected OEMZone | Siehe Abschnitt Non-Protected OEMZone | Siehe Abschnitt Non-Protected OEMZone |
| OEM Cipher<br>Key | Siehe Abschnitt OEM CipherKey | Siehe Abschnitt OEM Cipher Key | Siehe Abschnitt OEM Cipher Key |

### 3.2 Protected OEM Zone

Diese OEM-Zone ist nur für autorisierte TAs unter OP-TEE OS zugänglich, nicht direkt aus der normalen Welt. Sie eignet sich für Daten, die dort nicht offengelegt werden sollen. RK3588 unterstützt zusätzlich das Abschalten der Protected-OEM-Zone-Programmierung; danach ist weiteres Programmieren nicht möglich.

#### 3.2.1 Unterstützte Plattformen

| Plattform | Länge der Protected OEM Zone | Schreibsperre unterstützt |
| --- | --- | --- |
| RV1126/RV1109 | 2048 Bytes | Nicht unterstützt |
| RK3308/PX30/RK3326/RK3358 | 64 Bytes | Nicht unterstützt |
| RK3566/RK3568 | 224 Bytes | Nicht unterstützt |
| RK3588 | 1536 Bytes | Unterstützt |
| RK3528/RK3562 | 128 Bytes | Nicht unterstützt |
| RV1106/RV1103 | 224 Bytes | Nicht unterstützt |
| RK3576 | 128 Bytes | Nicht unterstützt |
| RV1106B/RV1103B | 64 Bytes | Nicht unterstützt |
| RK3506 | 128 Bytes | Nicht unterstützt |
| RV1126B | 64 Bytes | Nicht unterstützt |

#### 3.2.2 Verwendung

Zuerst gemäß Rockchip_Developer_Guide_TEE_SDK_CN.md die CA-/TA-Anwendungen unter rk_tee_user/ kompilieren/ausführen. Demo: rk_tee_user/v2/ta/rk_test/rktest_otp.c; fehlt die Datei, folgende Funktionen direkt in der TA aufrufen. Protected-OEM-Zone-Größe ermitteln:

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

Protected OEM Zone lesen

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

Protected OEM Zone programmieren

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

Protected-OEM-Zone-Programmierung deaktivieren

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

TA-Referenzdemo für Protected OEM Zone:

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

Diese OEM-Zone ist aus U-Boot und Userspace zugänglich; ihre Daten erscheinen im Speicher der normalen Welt. Wegen der kleinen Non-Secure OTP und aus Sicherheitsgründen reservieren nur manche Plattformen dort eine OEM-Zone. Ohne solche Reservierung kann diese Zone für benötigten U-Boot-/Userspace-Zugriff verwendet werden.

#### 3.3.1 Unterstützte Plattformen

| Plattform | Länge der Non-Protected OEM Zone |
| --- | --- |
| RK3308/PX30/RK3326/RK3358 | 64 Bytes |
| RK3566/RK3568/RK3588 | 64 Bytes |
| RV1106/RV1103 | 64 Bytes |
| RK3528/RK3562/RK3576 | 32 Bytes |
| RV1106B/RV1103B/RK3506/RV1126B | 32 Bytes |

#### 3.3.2 Verwendung

##### 3.3.2.1 Verwendung in U-Boot

Unter U-Boot Non-Protected OEM Zone mit trusty_read_oem_ns_otp lesen und mit trusty_write_oem_ns_otp programmieren, beide in u-boot/lib/optee_clientApi/OpteeClientInterface.c. Referenzdemo:

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

##### 3.3.2.2 Verwendung im Userspace

Für Userspace-Zugriff prüfen, ob der Kernel den Non-Protected-OEM-Zone-Treiber enthält: kernel/drivers/nvmem/rockchip-secure-otp.c zeigt die Integration an. Wenn vorhanden, folgende Schritte beachten:

1. TEE-Treiber aktivieren. Die Plattform-dtsi muss Folgendes enthalten:

```text
firmware {
    optee: optee {
        compatible = "linaro,optee-tz";
        method = "smc";
    };
};
```

Diese zwei Konfigurationsoptionen hinzufügen:

```text
CONFIG_TEE=y
CONFIG_OPTEE=y
```

Die Knoten /dev/tee0 und /dev/teepriv0 zeigen einen aktivierten TEE-Treiber an.

2. Non-Protected-OEM-Zone-Treiber aktivieren. Die Plattform-dtsi muss Folgendes enthalten:

```text
secure_otp: secure-otp {
    compatible = "rockchip,secure-otp";
    rockchip,otp-size = <32>;#此处应该修改成对应平台 Non-Protected OEM Zone 实际⼤⼩
};
```

Diese Konfigurationsoption hinzufügen:

```text
CONFIG_NVMEM_ROCKCHIP_SEC_OTP=y
```

Der Knoten /sys/bus/nvmem/devices/rockchip-secure-otp0/nvmem zeigt den aktivierten Non-Protected-OEM-Zone-Treiber an.

3. Non-Protected OEM Zone lesen

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

4. Non-Protected OEM Zone programmieren

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

5. Lese-/Schreibdemo

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

Das Ergebnis lässt sich auch mit hexdump prüfen.

```text
# busybox hexdump -C -v /sys/bus/nvmem/devices/rockchip-secure-otp0/nvmem
00000000  00 01 02 03 00 00 00 00  00 00 00 00 00 00 00 00  |................|
00000010  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
00000020
```

Fehlt der Kerneltreiber für Non-Protected OEM Zone, zuerst die CA unter rk_tee_user/ gemäß Rockchip_Developer_Guide_TEE_SDK_CN.md kompilieren. In der CA die Implementierung von invoke_otp_ns_read und invoke_otp_ns_write in rk_tee_user/v2/host/rk_test/rktest.c als Referenz verwenden.

### 3.4 OEM Cipher Key

Diese OEM-Zone speichert Kundenschlüssel, die nach der Programmierung unveränderlich sind. Sie können zum Ver-/Entschlüsseln verwendet werden. Gegen Offenlegung bietet das System Programmierung, aber keine Leseschnittstelle. Programmier- und Algorithmusschnittstellen sind aus U-Boot und Userspace aufrufbar.

#### 3.4.1 Unterstützte Plattformen

| Plattform | Länge des OEM Cipher Key | Hardware-Lesen unterstützt |
| --- | --- | --- |
| RV1126/RV1109 | Key0-3: 16 or 32 | Nicht unterstützt |
| RK3566/RK3568 | Key0-3: 16 or 24 or 32 | Nicht unterstützt |
| RK3588 | Key2: 16 or 24<br>Key0 1 3: 16 or 24 or 32 | Unterstützt |
| RK3528/RK3562/RK3576 | Key0-3: 16 or 24 or 32 | Unterstützt |
| RV1106/RV1103/RV1106B/RV1103B | Key0-3: 16 or 24 or 32 | Nicht unterstützt |
| RK3506/RV1126B | Key0-3: 16 or 24 or 32 | Unterstützt |

#### 3.4.2 Verwendung

##### 3.4.2.1 Verwendung in U-Boot

OEM Cipher Key unter U-Boot mit trusty_write_oem_otp_key in u-boot/lib/optee_clientApi/OpteeClientInterface.c programmieren. Für uint32_t trusty_write_oem_otp_key(enum RK_OEM_OTP_KEYID key_id, uint8_t *byte_buf, uint32_t byte_len) ist key_id wie folgt definiert:

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

Alle genannten Plattformen unterstützen RK_OEM_OTP_KEY0, RK_OEM_OTP_KEY1, RK_OEM_OTP_KEY2 und RK_OEM_OTP_KEY3. RV1126/RV1109 unterstützen zusätzlich RK_OEM_OTP_KEY_FW, hauptsächlich zur Loader-Entschlüsselung durch BootROM. Er kann auch für Anwendungsdaten oder Kernelfirmware genutzt werden. U-Boot-Programmierdemo:

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

Zum Prüfen in U-Boot, ob OEM Cipher Key bereits programmiert ist, trusty_oem_otp_key_is_written in u-boot/lib/optee_clientApi/OpteeClientInterface.c aufrufen. Referenzdemo:

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

Einige Plattformen unterstützen Hardware Read. trusty_set_oem_hr_otp_read_lock in u-boot/lib/optee_clientApi/OpteeClientInterface.c entzieht der CPU den Schlüsselzugriff. Schlüsseldaten erscheinen weder im Speicher der sicheren noch der normalen Welt und bleiben von der CPU isoliert; Hardware führt sie dem Crypto-Modul automatisch zu. Auf RK3588 verändert das Sperren von RK_OEM_OTP_KEY0, RK_OEM_OTP_KEY1 oder RK_OEM_OTP_KEY2 auch CPU-Zugriffe auf weitere OTP-Daten: SecureBoot, Security Level und ähnliche Felder verlieren ihre Programmierberechtigung. Vorher sicherstellen, dass kein weiteres OTP-Programmieren nötig ist. RK_OEM_OTP_KEY3-Sperren beeinflussen auf RK3588 andere OTP-Zugriffe nicht. RK3588-U-Boot-Hardware-Read-Demo:

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

Zum Ver-/Entschlüsseln mit OEM Cipher Key unter U-Boot trusty_oem_otp_key_cipher in u-boot/lib/optee_clientApi/OpteeClientInterface.c aufrufen. Referenzdemo:

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

##### 3.4.2.2 Verwendung im Userspace

Programmierung/Nutzung von OEM Cipher Key im Userspace entspricht U-Boot; dieselben Vorsichtsmaßnahmen gelten. Siehe librkcrypto/demo/demo_otpkey.c. librkcrypto-Quellen und Rockchip_Developer_Guide_Crypto_HWRNG_CN.pdf sind standardmäßig im SDK enthalten. Unter Android liegt librkcrypto in hardware/rockchip/.

Unter Linux liegen die librkcrypto-Quellen in external/.

### 3.5 OTP Life Cycle

Einige Plattformen unterstützen OTP Life Cycle zur Steuerung der Datenzugriffsrechte in verschiedenen Lebenszyklusphasen.

#### 3.5.1 Unterstützte Plattformen

| Plattform | OTP-Lebenszykluszustände | Beschreibung |
| --- | --- | --- |
| RK3588 | Blank/Tested/Provisioned/Missioned | Lese-/Schreibrechte nehmen von Blank (höchste) bis Missioned (niedrigste) ab. Übergänge sind nur zu geringeren Rechten möglich, nicht zurück. Ab Werk gilt Provisioned. OEMs können zu Missioned wechseln; dabei ändern sich Zugriffe auf bestimmte OTP-Daten. |

#### 3.5.2 Berechtigungsänderungen

Die Tabelle zeigt RK3588-OTP-Rechte in den Phasen Provisioned und Missioned. RW bedeutet Lesen/Schreiben, R nur Lesen.

| Daten | Provisioned | Missioned | Beschreibung |
| --- | --- | --- | --- |
| Secure Boot<br>Enable Flag | RW | R | Falls Secure Boot benötigt wird, vor Änderung des OTP Life Cycle aktivieren. Siehe Rockchip_Developer_Guide_Secure_Boot_Application_Note_EN.md. |
| RSA Public<br>Hash | RW | R | Wie oben |
| Security Level | RW | R | Für wählbare Sicherheitsstärke Security Level vor Änderung des OTP Life Cycle wählen. Siehe Rockchip_Developer_Guide_TEE_SDK_CN. |
| OEM Cipher<br>Key0-2 | RW | Kein Lese-/Schreibzugriff | Siehe Abschnitt OEM Cipher Key |
| FW<br>encryption<br>key | RW | Kein Lese-/Schreibzugriff | Dient hauptsächlich zum Verschlüsseln der Loader-Firmware; BootRom entschlüsselt sie beim Start mit diesem Schlüssel. |

#### 3.5.3 Verwendung

OTP Life Cycle kann derzeit nur in der sicheren Welt geändert werden. Für Provisioned → Missioned CA/TA unter rk_tee_user/ gemäß Rockchip_Developer_Guide_TEE_SDK_CN.md kompilieren/ausführen und dann folgende Funktion in der TA aufrufen.

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
