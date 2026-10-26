---
title: "Rockchip OTP: защищённые области, ключи и жизненный цикл"
description: "Rockchip OTP: защищённые области, ключи и жизненный цикл — V1.9.2."
translation_key: "142-rockchip-otp"
slug: "142-rockchip-otp"
lang: "ru"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "production"
products: []
tags: [ArmSoM, Rockchip, OTP, TEE]
excerpt: "Rockchip OTP: защищённые области, ключи и жизненный цикл — V1.9.2."
---

{% raw %}

Полное техническое содержание китайского/английского оригиналов V1.9.2 (24/25 страниц). Для ArmSoM сопоставьте матрицы поддержки с конкретными SoC, SDK/BSP, U-Boot, OP-TEE и драйвером ядра. Единая версия ядра и поддержка всех плат не заявляются. Проверка на аппаратуре ArmSoM не выполнялась; команды и вывод — примеры производителя.

> Запись OTP, блокировка и снижение прав жизненного цикла могут быть необратимыми; ошибки нарушают загрузку и доступ к ключам. Проверьте руководство чипа и реализацию, затем тестируйте на отдельных платах. Команды записи, настройки безопасности и блокировки не выполнялись.

> Проблемы исходных примеров сохранены: void demo(void) содержит return ret; некоторые ошибки TEE_InvokeTACommand лишь выводятся, а функция возвращает TEE_SUCCESS; DTS использует # для пояснения. Проверьте компилятор и драйвер; алгоритмы и коды возврата не исправлялись молча.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip U-Boot](https://github.com/rockchip-linux/u-boot)

## 1 Обзор

OTP NVM (One Time Programmable Non-Volatile Memory) программируется только один раз, в отличие от многократно стираемой/записываемой FLASH. OTP делится на Secure OTP и Non-Secure OTP. Обычный мир (например U-Boot, userspace) напрямую читает незащищённые данные, но не может напрямую читать/писать защищённые. Чувствительные данные обычно хранятся в Secure OTP; непосредственный доступ имеет только защищённый мир, например Miniloader/SPL и OP-TEE. Основы TrustZone/TEE см. в Rockchip_Developer_Guide_TEE_SDK_CN.md или документации Arm.

## 2. Non-Secure OTP

Non-Secure OTP обычно хранит частные данные Rockchip — тип чипа и CPUID, записанные при производстве. Большинство платформ не резервирует OEM-область, поэтому драйвер ядра предоставляет только чтение. Только перечисленные ниже платформы имеют OEM-область Non-Secure OTP и запись серийных номеров, MAC-адресов, сведений о продукте и подобных данных заказчика. Для чтения/записи доступны стандартные файловые API.

### 2.1 Поддерживаемые платформы

| Платформа | OTP_OEM_OFFSET | ДИАПАЗОН | ОБЩИЙ РАЗМЕР |
| --- | --- | --- | --- |
| RV1126/RV1109 | 0x100 | 0x100 ~ 0x1EF | 240 Bytes |

### 2.2 Использование

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

1. Перед каждой OEM Write включайте разрешение записи для предотвращения случайной записи.

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

2. Размер записи и смещение должны быть выровнены по 4 байтам. Записанные данные помечаются защищёнными от записи; защита вступит в силу после следующей перезагрузки.

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

1. Записать значения 0–15 со смещения 0 OEM-области.

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

2. Просмотреть результат через OEM Read или hexdump. Следующая команда выводит данные OEM-области.

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

Secure OTP резервирует различные OEM-зоны для разных потребностей.

### 3.1 OEM OTP Description

Таблица перечисляет поддерживаемые OEM-данные. Интерфейсы чтения/записи Rockchip автоматически устанавливают смещение внутри; вызывающему нужен только размер данных, а не адрес смещения.

| Data | Длина | Описание | Поддерживаемые платформы |
| --- | --- | --- | --- |
| Public Key<br>Hash | 32 or 64 Bytes | Хеш открытого ключа: защищённая загрузка проверяет ключ, затем этим ключом проверяет прошивку. | Все платформы |
| Secure Boot<br>Enable Flag | 4 Bits or 1 Byte | Флаг включения Secure Boot устанавливается при включении; последующие загрузки проверяют подлинность прошивки. | Все платформы |
| AVB<br>Attribute<br>Hash | 32 Bytes | Хеш корневого сертификата AVB для его проверки в процессе AVB. | Все платформы OTP |
| FW Encrypt<br>Key | 16 Bytes | Ключ шифрования/расшифрования прошивки; при загрузке расшифровывает прошивку. | RK3562/RK3568/RV1126B |
| TA Encrypt<br>Key | 32 Bytes | Ключ TA: зашифрованные TA сначала расшифровываются этим ключом, затем загружаются. | RV1126/RV1109<br>RK3308/PX30/RK3326/<br>RK3358/RK3566/RK3568<br>RK3588/RK3528/RK3562<br>RV1106/RV1103/RK3576<br>RV1106B/RV1103B<br>RK3506/RV1126B |
| Security<br>Level | 1 or 2 Bytes | Уровень безопасности TEE выбирает Root Key для выработки ключей; уровни отличаются защитой eMMC/защищённого хранилища. | RK3588/RK3528/RK3562<br>RV1106/RV1103/RK3576<br>RV1106B/RV1103B<br>RK3506/RV1126B |
| OEM HUK | 32 Bytes | Уникальный аппаратный ключ OEM записывается для уровня TEE 1 и далее используется TEE для выработки ключей. | RK3588/RK3528/RK3562<br>RV1106/RV1103/RK3576<br>RV1106B/RV1103B<br>RK3506/RV1126B |
| OEM Encrypt<br>Data | 16 Bytes | Частные данные OEM для среднего уровня защиты от копирования, проверяющие подлинность платы. | RV1126/RV1109<br>RK3566/RK3568<br>RK3588/RK3528/RK3562<br>RV1106/RV1103/RK3576<br>RV1106B/RV1103B<br>RK3506/RV1126B |
| Protected<br>OEM Zone | См. раздел ProtectedOEM Zone | См. раздел Protected OEM Zone | См. раздел Protected OEMZone |
| Non-<br>Protected<br>OEM Zone | См. раздел Non-Protected OEMZone | См. раздел Non-Protected OEMZone | См. раздел Non-Protected OEMZone |
| OEM Cipher<br>Key | См. раздел OEM CipherKey | См. раздел OEM Cipher Key | См. раздел OEM Cipher Key |

### 3.2 Protected OEM Zone

Эта OEM-зона доступна только авторизованным TA в OP-TEE OS; обычный мир не имеет прямого доступа. Используйте её для данных, которые нельзя раскрывать обычному миру. RK3588 также поддерживает отключение записи Protected OEM Zone; после отключения дальнейшая запись невозможна.

#### 3.2.1 Поддерживаемые платформы

| Платформа | Размер Protected OEM Zone | Поддержка блокировки записи |
| --- | --- | --- |
| RV1126/RV1109 | 2048 Bytes | Не поддерживается |
| RK3308/PX30/RK3326/RK3358 | 64 Bytes | Не поддерживается |
| RK3566/RK3568 | 224 Bytes | Не поддерживается |
| RK3588 | 1536 Bytes | Поддерживается |
| RK3528/RK3562 | 128 Bytes | Не поддерживается |
| RV1106/RV1103 | 224 Bytes | Не поддерживается |
| RK3576 | 128 Bytes | Не поддерживается |
| RV1106B/RV1103B | 64 Bytes | Не поддерживается |
| RK3506 | 128 Bytes | Не поддерживается |
| RV1126B | 64 Bytes | Не поддерживается |

#### 3.2.2 Использование

Сначала по Rockchip_Developer_Guide_TEE_SDK_CN.md соберите/запустите CA/TA в rk_tee_user/. Пример: rk_tee_user/v2/ta/rk_test/rktest_otp.c; при отсутствии файла вызовите следующие функции непосредственно в TA. Получение размера Protected OEM Zone:

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

Чтение Protected OEM Zone

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

Запись Protected OEM Zone

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

Отключение записи Protected OEM Zone

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

Пример TA для Protected OEM Zone:

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

Эта OEM-зона доступна из U-Boot и userspace, поэтому данные появляются в памяти обычного мира. Из-за малого размера Non-Secure OTP и требований безопасности лишь некоторые платформы резервируют там OEM-зону. На остальных платформах при необходимости доступа из U-Boot/userspace можно использовать данную зону.

#### 3.3.1 Поддерживаемые платформы

| Платформа | Размер Non-Protected OEM Zone |
| --- | --- |
| RK3308/PX30/RK3326/RK3358 | 64 Bytes |
| RK3566/RK3568/RK3588 | 64 Bytes |
| RV1106/RV1103 | 64 Bytes |
| RK3528/RK3562/RK3576 | 32 Bytes |
| RV1106B/RV1103B/RK3506/RV1126B | 32 Bytes |

#### 3.3.2 Использование

##### 3.3.2.1 Использование в U-Boot

В U-Boot чтение Non-Protected OEM Zone выполняется через trusty_read_oem_ns_otp, запись — через trusty_write_oem_ns_otp в u-boot/lib/optee_clientApi/OpteeClientInterface.c. Пример:

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

##### 3.3.2.2 Использование в userspace

Для доступа из userspace проверьте наличие драйвера Non-Protected OEM Zone: файл kernel/drivers/nvmem/rockchip-secure-otp.c означает интеграцию. Если он есть, выполните следующие шаги:

1. Включите драйвер TEE. Убедитесь, что dtsi платформы содержит:

```text
firmware {
    optee: optee {
        compatible = "linaro,optee-tz";
        method = "smc";
    };
};
```

Добавьте две настройки config:

```text
CONFIG_TEE=y
CONFIG_OPTEE=y
```

Наличие /dev/tee0 и /dev/teepriv0 указывает на включённый драйвер TEE.

2. Включите драйвер Non-Protected OEM Zone. Убедитесь, что dtsi платформы содержит:

```text
secure_otp: secure-otp {
    compatible = "rockchip,secure-otp";
    rockchip,otp-size = <32>;#此处应该修改成对应平台 Non-Protected OEM Zone 实际⼤⼩
};
```

Добавьте настройку config:

```text
CONFIG_NVMEM_ROCKCHIP_SEC_OTP=y
```

Узел /sys/bus/nvmem/devices/rockchip-secure-otp0/nvmem указывает на включённый драйвер Non-Protected OEM Zone.

3. Чтение Non-Protected OEM Zone

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

4. Запись Non-Protected OEM Zone

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

5. Пример чтения/записи

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

Результат также можно посмотреть через hexdump.

```text
# busybox hexdump -C -v /sys/bus/nvmem/devices/rockchip-secure-otp0/nvmem
00000000  00 01 02 03 00 00 00 00  00 00 00 00 00 00 00 00  |................|
00000010  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
00000020
```

Если ядро не содержит драйвер Non-Protected OEM Zone, сначала соберите CA в rk_tee_user/ по Rockchip_Developer_Guide_TEE_SDK_CN.md. В CA используйте реализацию invoke_otp_ns_read и invoke_otp_ns_write из rk_tee_user/v2/host/rk_test/rktest.c.

### 3.4 OEM Cipher Key

Эта OEM-зона хранит ключи заказчика, которые после записи нельзя изменить. Записанный ключ используется для шифрования/расшифрования. Для предотвращения раскрытия система предоставляет запись, но не чтение ключей. Интерфейсы записи и алгоритмов доступны из U-Boot и userspace.

#### 3.4.1 Поддерживаемые платформы

| Платформа | Длина OEM Cipher Key | Аппаратное чтение поддерживается |
| --- | --- | --- |
| RV1126/RV1109 | Key0-3: 16 or 32 | Не поддерживается |
| RK3566/RK3568 | Key0-3: 16 or 24 or 32 | Не поддерживается |
| RK3588 | Key2: 16 or 24<br>Key0 1 3: 16 or 24 or 32 | Поддерживается |
| RK3528/RK3562/RK3576 | Key0-3: 16 or 24 or 32 | Поддерживается |
| RV1106/RV1103/RV1106B/RV1103B | Key0-3: 16 or 24 or 32 | Не поддерживается |
| RK3506/RV1126B | Key0-3: 16 or 24 or 32 | Поддерживается |

#### 3.4.2 Использование

##### 3.4.2.1 Использование в U-Boot

В U-Boot записывайте OEM Cipher Key через trusty_write_oem_otp_key в u-boot/lib/optee_clientApi/OpteeClientInterface.c. Для uint32_t trusty_write_oem_otp_key(enum RK_OEM_OTP_KEYID key_id, uint8_t *byte_buf, uint32_t byte_len) определение key_id следующее:

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

Все перечисленные платформы поддерживают RK_OEM_OTP_KEY0, RK_OEM_OTP_KEY1, RK_OEM_OTP_KEY2, RK_OEM_OTP_KEY3. RV1126/RV1109 дополнительно поддерживают RK_OEM_OTP_KEY_FW, в основном для расшифрования Loader в BootROM. Его также можно использовать для прикладных данных или прошивки ядра. Пример записи U-Boot:

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

Для проверки в U-Boot, записан ли OEM Cipher Key, вызовите trusty_oem_otp_key_is_written в u-boot/lib/optee_clientApi/OpteeClientInterface.c. Пример:

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

Некоторые платформы поддерживают Hardware Read. Вызов trusty_set_oem_hr_otp_read_lock в u-boot/lib/optee_clientApi/OpteeClientInterface.c запрещает CPU доступ к ключу. Данные ключа не появляются ни в защищённой, ни в обычной памяти и изолированы от CPU; оборудование само передаёт их в crypto для операций. На RK3588 блокировка RK_OEM_OTP_KEY0, RK_OEM_OTP_KEY1 или RK_OEM_OTP_KEY2 также меняет доступ CPU к другим данным OTP: SecureBoot, Security Level и подобные поля теряют возможность записи. До вызова убедитесь, что дальнейшая запись OTP не нужна. Блокировка RK_OEM_OTP_KEY3 на RK3588 не влияет на прочие данные OTP. Пример Hardware Read для U-Boot RK3588:

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

Для шифрования/расшифрования OEM Cipher Key в U-Boot вызовите trusty_oem_otp_key_cipher в u-boot/lib/optee_clientApi/OpteeClientInterface.c. Пример:

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

##### 3.4.2.2 Использование в userspace

Запись/использование OEM Cipher Key в userspace аналогичны U-Boot; применяются те же предостережения. См. librkcrypto/demo/demo_otpkey.c. Исходники librkcrypto и Rockchip_Developer_Guide_Crypto_HWRNG_CN.pdf по умолчанию входят в SDK. На Android librkcrypto находится в hardware/rockchip/.

На Linux исходники librkcrypto находятся в external/.

### 3.5 OTP Life Cycle

Некоторые платформы поддерживают OTP Life Cycle, управляющий доступом к данным на разных этапах жизненного цикла.

#### 3.5.1 Поддерживаемые платформы

| Платформа | Состояния жизненного цикла OTP | Описание |
| --- | --- | --- |
| RK3588 | Blank/Tested/Provisioned/Missioned | Права чтения/записи уменьшаются от Blank (максимальные) до Missioned (минимальные). Переход возможен только к меньшим правам, не обратно. С завода чип находится в Provisioned. OEM может перейти в Missioned; права для части данных OTP изменятся. |

#### 3.5.2 Изменения прав

Таблица показывает доступ к OTP RK3588 на этапах Provisioned и Missioned. RW — чтение/запись, R — только чтение.

| Данные | Provisioned | Missioned | Описание |
| --- | --- | --- | --- |
| Secure Boot<br>Enable Flag | RW | R | Если нужен Secure Boot, включите его до изменения OTP Life Cycle. См. Rockchip_Developer_Guide_Secure_Boot_Application_Note_EN.md. |
| RSA Public<br>Hash | RW | R | Как выше |
| Security Level | RW | R | Для выбора уровня защиты задайте Security Level до изменения OTP Life Cycle. См. Rockchip_Developer_Guide_TEE_SDK_CN. |
| OEM Cipher<br>Key0-2 | RW | Нет доступа чтения/записи | См. раздел OEM Cipher Key |
| FW<br>encryption<br>key | RW | Нет доступа чтения/записи | В основном шифрует прошивку Loader; BootRom расшифровывает её этим ключом при загрузке. |

#### 3.5.3 Использование

Изменять OTP Life Cycle сейчас можно только в защищённом мире. Для перехода Provisioned → Missioned соберите/запустите CA/TA в rk_tee_user/ по Rockchip_Developer_Guide_TEE_SDK_CN.md, затем вызовите следующую функцию в TA.

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
