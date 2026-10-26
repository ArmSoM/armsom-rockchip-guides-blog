---
title: "Rockchip Vendor Storage V1.3.0: размещение, ID и API U-Boot/Linux/Android"
description: "Rockchip Vendor Storage V1.3.0: размещение, ID и API U-Boot/Linux/Android — RK-KF-YF-C35, kernel 4.19/5.10/6.1, GKI, SN, MAC."
translation_key: "100-rockchip-vendor-storage-v13"
slug: "100-rockchip-vendor-storage-v13"
lang: "ru"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "Vendor Storage", "GKI", "Linux", "Android"]
excerpt: "Rockchip Vendor Storage V1.3.0: размещение, ID и API U-Boot/Linux/Android — RK-KF-YF-C35, kernel 4.19/5.10/6.1, GKI, SN, MAC."
---

{% raw %}

# Rockchip Vendor Storage V1.3.0: размещение, ID и API U-Boot/Linux/Android

Статья полностью сохраняет технический текст RK-KF-YF-C35 V1.3.0, английский PDF, стр. 5–18. Предоставлен только английский оригинал; китайская, русская и немецкая версии переведены полностью, все четыре используют английские оригинальные рисунки. Это не старая Rev.08 из статьи 097: размещение, ID и интерфейсы GKI/Android отличаются. Источник называет ядра RockChip 4.19, 5.10 и 6.1, но не конкретные платы ArmSoM и версии SDK/BSP. Это справочник платформы, а не универсальное подтверждение поддержки: проверьте SoC платы, тип накопителя, резервные области, ABI/модули ядра, ветку Android и SDK/BSP. Аппаратные проверки чтения, записи и отключения питания не проводились.

> Безопасность и неоднозначности: пример перезаписывает ID 1 (SN) байтами 0–31. Не запускать на производственных устройствах; сначала сохранить идентификационные данные. ID 1063 назван полем Super-Resolution, но описан как MEMC; ID 76 описан как резерв офлайн-ключа, хотя 1076 ссылается на него. Оба противоречия сохранены без догадок. ID 61 совмещает резерв Super-Resolution и HDCP2.x RKIV. Нельзя подставлять распределение ID из статей 097/099. Фраза о модуле GKI грамматически неясна; сборку и загрузку ram_vendor_storage.ko проверить по BSP. В коде сохранены исходные опечатки, типы и неполные определения обработки ошибок/очистки.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel) · [EDITORIAL-NOTES](/docs/rockchip-vendor-storage-v13/EDITORIAL-NOTES.md)

<!-- English PDF p.5 -->

## 1. Краткое описание

<!-- English PDF p.5 -->

Vendor Storage предназначен для хранения SN, MAC и других данных производителя. Возможности:

- Доступ по уникальному ID.
- Надёжная проверка данных.
- Восстановление после потери питания.
- Чтение и запись с ПК.
- Чтение и запись из UBOOT.
- Чтение и запись из ядра.
- Чтение и запись из Linux-приложения.

<!-- English PDF p.5 -->

## 2. Архитектура Vendor Storage

<!-- English PDF p.5 -->

![2. Архитектура Vendor Storage: английский оригинал, стр. 5](/docs/rockchip-vendor-storage-v13/assets/en-p005-figure-01.png)

*2. Архитектура Vendor Storage: английский оригинал, стр. 5*

<!-- English PDF p.6 -->

## 3. Размещение данных

<!-- English PDF p.6 -->

### 3.1 Размещение данных SPI NOR

<!-- English PDF p.6 -->

![3.1 Размещение данных SPI NOR: английский оригинал, стр. 6](/docs/rockchip-vendor-storage-v13/assets/en-p006-figure-01.png)

*3.1 Размещение данных SPI NOR: английский оригинал, стр. 6*

<!-- English PDF p.6 -->

### 3.2 Размещение данных Raw NAND и SPI NAND

<!-- English PDF p.6 -->

![3.2 Размещение данных Raw NAND и SPI NAND: английский оригинал, стр. 6](/docs/rockchip-vendor-storage-v13/assets/en-p006-figure-02.png)

*3.2 Размещение данных Raw NAND и SPI NAND: английский оригинал, стр. 6*

<!-- English PDF p.7 -->

### 3.3 Размещение данных EMMC

<!-- English PDF p.7 -->

![3.3 Размещение данных EMMC: английский оригинал, стр. 7](/docs/rockchip-vendor-storage-v13/assets/en-p007-figure-01.png)

*3.3 Размещение данных EMMC: английский оригинал, стр. 7*

<!-- English PDF p.7 -->

### 3.4 Структура данных

<!-- English PDF p.7 -->

![3.4 Структура данных: английский оригинал, стр. 7](/docs/rockchip-vendor-storage-v13/assets/en-p007-figure-02.png)

*3.4 Структура данных: английский оригинал, стр. 7*

| Смещение (B) | Размер (B) | Название |
| --- | --- | --- |
| 0x0000 | 0x0004 | Tag, значение 0x524B5644. |
| 0x0004 | 0x0004 | Version, увеличивается после записи |
| 0x0008 | 0x0002 | Следующий индекс |
| 0x000A | 0x0002 | Всего элементов |
| 0x000C | 0x0002 | Смещение свободного места |
| 0x000E | 0x0002 | Размер свободного места |
| 0x0010 | 0x0002 | Item0->id |
| 0x0012 | 0x0002 | Item0->offset |
| 0x0014 | 0x0002 | Item0->size |
| 0x0016 | 0x0002 | Item0->flag(reversed) |
| 0x0018 | 0x0008 | Item1 |
| ... | ... | Item x |
| --- | --- | Данные |
| Size – 0x08 | 0x0004 | Hash |
| Size – 0x04 | 0x0004 | Version2, значение совпадает с Version |

<!-- English PDF p.8 -->

### 3.5 Определения ID

<!-- English PDF p.8 -->

| ID | Функция | Описание |
| --- | --- | --- |
| 1 | SN | Серийный номер |
| 2 | WIFI MAC | MAC-адрес WIFI |
| 3 | LAN MAC | MAC-адрес Ethernet |
| 4 | BT MAC | MAC-адрес Bluetooth |
| 5 | HDMITX HDCP1.4 KEY | HDMITX HDCP1.4 KEY |
| 6 | DP HDCP1.4 KEY | DP HDCP1.4 KEY |
| 7 | HDCP_2X_ID |  |
| 8 | DRM_KEY_ID |  |
| 9 | PLAYREADY_CERT_ID |  |
| 10 | ATTENTION_KEY_ID |  |
| 11 | PLAYREADY_ROOT_KEY_0_ID |  |
| 12 | PLAYREADY_ROOT_KEY_1_ID |  |
| 13 | HDMIRX HDCP1.4 KEY | HDMIRX HDCP1.4 KEY |
| 14 | SENSOR_CALIBRATION_ID |  |
| 15 | IMEI_ID |  |
| 16 | LAN_RGMII_DL_ID |  |
| 17 | EINK_VCOM_ID | Напряжение VCOM экрана E-ink |
| 18 |  |  |
| 19 |  |  |
| 20 | HDMIRX HDCP2.3 KEY | HDMIRX HDCP2.3 KEY |
| ... |  |  |
| 60 | sr | Хранит онлайн-ключ авторизации сверхразрешения; соответствующая позиция офлайн-ключа +1000, то есть 1060. |
| 61 | сверхразрешения резервное поле алгоритма / HDCP2.x RKIV | Резервное поле алгоритма сверхразрешения, соответствует офлайн-резерву 1061; RKIV — 16-байтный ключ шифрования прошивки HDMI2.x для дополнительной защиты. По оригиналу, эту дополнительную схему используют некоторые заказчики 3528 и 356x. |

<!-- English PDF p.9 -->

| ID | Функция | Описание |
| --- | --- | --- |
| 62 | memc | Хранит онлайн-ключ авторизации MEMC; соответствующая позиция офлайн-ключа +1000, то есть 1062. |
| 63 | MEMC резервное поле алгоритма | Резервное поле алгоритма MEMC, соответствует офлайн-резерву 1063. |
| 64 | pq | Хранит онлайн-ключ авторизации PQ; соответствующая позиция офлайн-ключа +1000, то есть 1064. |
| 65 | PQ резервное поле алгоритма | Резервное поле алгоритма PQ, соответствует офлайн-резерву 1065. |
| 66 | RKP резервное поле | Используется RKP CSR; серийный номер при создании CSR |
| 67 | RKP резервное поле | Используется RKP CSR; содержимое созданного CSR |
| 68 | multi-module | Хранит онлайн-ключ авторизации multi-module; соответствующая позиция офлайн-ключа +1000, то есть 1068. |
| 69 | multi-module резервное поле | Резервное поле алгоритма multi-module, соответствует офлайн-резерву 1069. |
| 70 | touch_read | Хранит онлайн-ключ авторизации точечного чтения; соответствующая позиция офлайн-ключа +1000, то есть 1070. |
| 71 | touch_read резервное поле алгоритма | Резервное поле алгоритма точечного чтения, соответствует офлайн-резерву 1071. |
| 72 | rknpu_ocr | Хранит онлайн-ключ авторизации алгоритма OCR; соответствующая позиция офлайн-ключа +1000, то есть 1072. |
| 73 | rknpu_ocr резервное поле алгоритма | Резервное поле алгоритма алгоритма OCR, соответствует офлайн-резерву 1073. |
| 74 | face | Хранит онлайн-ключ авторизации разблокировки по лицу; соответствующая позиция офлайн-ключа +1000, то есть 1074. |
| 75 | разблокировки по лицу резервное поле алгоритма | Резервное поле алгоритма разблокировки по лицу, соответствует офлайн-резерву 1075. |
| 76 | knowledge | Резервное поле офлайн-ключа |
| 77 | knowledge резервное поле алгоритма | Резервное поле алгоритма Knowledge, соответствует офлайн-резерву 1077. |
| ... |  |  |
| 84 | asr | Хранит онлайн-ключ авторизации алгоритма ASR преобразования речи в текст; соответствующая позиция офлайн-ключа +1000, то есть 1084. |

<!-- English PDF p.10 -->

| ID | Функция | Описание |
| --- | --- | --- |
| 85 | asr резервное поле алгоритма | Резервное поле алгоритма алгоритма ASR преобразования речи в текст, соответствует офлайн-резерву 1085. |
| 86 | llm | Хранит онлайн-ключ авторизации перевода LLM; соответствующая позиция офлайн-ключа +1000, то есть 1086. |
| 87 | llm резервное поле алгоритма | Резервное поле алгоритма перевода LLM, соответствует офлайн-резерву 1087. |
| 88 | tts | Хранит онлайн-ключ авторизации алгоритма TTS преобразования текста в речь; соответствующая позиция офлайн-ключа +1000, то есть 1088. |
| 89 | tts резервное поле алгоритма | Резервное поле алгоритма алгоритма TTS преобразования текста в речь, соответствует офлайн-резерву 1089. |
| ... |  |  |
| 96 | aieraser | Хранит онлайн-ключ авторизации алгоритма AI Eraser; соответствующая позиция офлайн-ключа +1000, то есть 1096. |
| 97 | aieraser резервное поле алгоритма | Резервное поле алгоритма алгоритма AI Eraser, соответствует офлайн-резерву 1097. |
| ... |  |  |
| 156 | резерв заказчика | Зарезервировано для заказчиков, не для внутреннего использования RK |
| ... | резерв заказчика | Зарезервировано для заказчиков, не для внутреннего использования RK |
| 256 | резерв заказчика | Зарезервировано для заказчиков, не для внутреннего использования RK |
| 1060 | сверхразрешения позиция офлайн-ключа | Позиция офлайн-ключа сверхразрешения; минус 1000 даёт позицию онлайн-ключа 60. |
| 1061 | сверхразрешения резервное поле офлайн-ключа | Резервное поле офлайн-ключа сверхразрешения |
| 1062 | MEMC позиция офлайн-ключа | Позиция офлайн-ключа MEMC; минус 1000 даёт позицию онлайн-ключа 62. |
| 1063 | сверхразрешения резервное поле офлайн-ключа | Резервное поле офлайн-ключа MEMC |
| 1064 | PQ позиция офлайн-ключа | Позиция офлайн-ключа PQ; минус 1000 даёт позицию онлайн-ключа 64. |
| 1065 | PQ резервное поле офлайн-ключа | Резервное поле офлайн-ключа PQ |
| 1068 | multi-module позиция офлайн-ключа | Позиция офлайн-ключа multi-module; минус 1000 даёт позицию онлайн-ключа 68. |

<!-- English PDF p.11 -->

| ID | Функция | Описание |
| --- | --- | --- |
| 1069 | multi-module резервное поле офлайн-ключа | Резервное поле офлайн-ключа multi-module |
| 1070 | точечного чтения позиция офлайн-ключа | Позиция офлайн-ключа точечного чтения; минус 1000 даёт позицию онлайн-ключа 70. |
| 1071 | точечного чтения резервное поле офлайн-ключа | Резервное поле офлайн-ключа точечного чтения |
| 1072 | OCR позиция офлайн-ключа | Позиция офлайн-ключа алгоритма OCR; минус 1000 даёт позицию онлайн-ключа 72. |
| 1073 | OCR резервное поле офлайн-ключа | Резервное поле офлайн-ключа алгоритма OCR |
| 1074 | Face позиция офлайн-ключа | Позиция офлайн-ключа разблокировки по лицу; минус 1000 даёт позицию онлайн-ключа 74. |
| 1075 | Face резервное поле офлайн-ключа | Резервное поле офлайн-ключа разблокировки по лицу |
| 1076 | Knowledge позиция офлайн-ключа | Позиция офлайн-ключа Knowledge; минус 1000 даёт позицию онлайн-ключа 76. |
| 1077 | Knowledge резервное поле офлайн-ключа | Резервное поле офлайн-ключа Knowledge |
| 1084 | ASR позиция офлайн-ключа | Позиция офлайн-ключа алгоритма ASR преобразования речи в текст; минус 1000 даёт позицию онлайн-ключа 84. |
| 1085 | ASR резервное поле офлайн-ключа | Резервное поле офлайн-ключа алгоритма ASR преобразования речи в текст |
| 1086 | LLM позиция офлайн-ключа | Позиция офлайн-ключа перевода LLM; минус 1000 даёт позицию онлайн-ключа 86. |
| 1087 | LLM резервное поле офлайн-ключа | Резервное поле офлайн-ключа перевода LLM |
| 1088 | TTS позиция офлайн-ключа | Позиция офлайн-ключа алгоритма TTS преобразования текста в речь; минус 1000 даёт позицию онлайн-ключа 88. |
| 1089 | TTS резервное поле офлайн-ключа | Резервное поле офлайн-ключа алгоритма TTS преобразования текста в речь |
| 1096 | AI Eraser Algorithm позиция офлайн-ключа | Позиция офлайн-ключа алгоритма AI Eraser; минус 1000 даёт позицию онлайн-ключа 96. |
| 1097 | AI Eraser Algorithm резервное поле офлайн-ключа | Резервное поле офлайн-ключа алгоритма AI Eraser |

<!-- English PDF p.11 -->

Примечание: данные в NVM хранятся с выравниванием по 64 байта. Каждому элементу выделяется не менее 64 байт: запись 1–64 байт занимает 64 байта, запись 65–128 байт — 128 байт.

<!-- English PDF p.12 -->

## 4. API UBOOT

<!-- English PDF p.12 -->

Исходный код: `u-boot/board/rockchip/common/storage/storage.c`

<!-- English PDF p.12 -->

```text
int vendor_storage_init(void)
function: Initialize vendor storage
input : none
return: 0: Initialize success
        other: Initialize fail

int vendor_storage_read(u32 id, void *pbuf, u32 size)
function: read vendor storage by id
input : id, item id;
pbuf, data buffer;
size, number byte to read.
return: other: number byte have read.
        -1: read fail.

int vendor_storage_write(u32 id, void *pbuf, u32 size)
function: write vendor storage by id
input : id: item id;
pbuf: data buffer;
size: number bytes to write.
return:  0: write success
         other: write fail
```

<!-- English PDF p.12 -->

### 4.1 API ядра без GKI

<!-- English PDF p.12 -->

Исходный код: `kernel/drivers/soc/rockchip/rk_vendor_storage.c`

<!-- English PDF p.12 -->

```text
int rk_vendor_read(u32 id, void *pbuf, u32 size)
function: read vendor storage by id
input : id: item id;
pbuf: data buffer;
size: number bytes to read.
return: other: number byte have read.
        -1: read fail

int rk_vendor_write(u32 id, void *pbuf, u32 size)
function: write vendor storage by id
input : id, item id;
pbuf: data buffer;
size: number bytes to write.
return: 0: write success
        other : write fail
```

<!-- English PDF p.13 -->

Настройка Menuconfig

<!-- English PDF p.13 -->

![4.1 API ядра без GKI: английский оригинал, стр. 13](/docs/rockchip-vendor-storage-v13/assets/en-p013-figure-01.png)

*4.1 API ядра без GKI: английский оригинал, стр. 13*

```text
CONFIG_ROCKCHIP_VENDOR_STORAGE:

Say Y here to enable vendor storage support.
Vendor storage is used for stored SN, MAC, BT ADDR etc.

Symbol: ROCKCHIP_VENDOR_STORAGE [=y]
Type  : boolean
Prompt: Rockchip vendor storage support
  Location:
    -> Device Drivers
      -> SOC (System On Chip) specific Drivers
  Defined at drivers/soc/rockchip/Kconfig:6
  Depends on: ARCH_ROCKCHIP [=y] || COMPILE_TEST
```

<!-- English PDF p.13 -->

### 4.2 API ядра GKI

<!-- English PDF p.13 -->

Из-за ограничений интерфейсов ядра GKI оригинал требует добавить `ram_vendor_storage.ko` в ядро, чтобы Vendor Storage поддерживал чтение; интерфейс записи не поддерживается.

<!-- English PDF p.13 -->

### 4.3 API Android

<!-- English PDF p.13 -->

Исходный код: `hardware/rockchip/libvendor_storage/vendor_storage.c`

<!-- English PDF p.13 -->

```text
/*
 * vendor_storage_init must be call first
 * rerurn:  ret=0 succes   ret<0 failed
 */
 int vendor_storage_init(void);

/*
 * emmc_vendor_write
 * id: item id
 * pbuf: write data
 * size: vendor_item.size
 * rerurn:  ret>0 succes   ret<0 failed
 */
 int emmc_vendor_write(uint32 id, void *pbuf, uint32 size);

 /*
 * emmc_vendor_read
 * id: item id
 * pbuf: read data
 * size: vendor_item.size
 * rerurn:  ret>0 succes   ret<0 failed
 */
 int emmc_vendor_read(uint32 id, void *pbuf, uint32 size);
```

<!-- English PDF p.13 -->

Пример использования см. в `hardware/rockchip/libvendor_storage/vendor_storage_test.c`.

<!-- English PDF p.14 -->

## 5. Демонстрационный инструмент ПК

<!-- English PDF p.14 -->

Выберите SN, введите значение SN и нажмите ENTER, чтобы добавить элемент SN в список запросов записи.

<!-- English PDF p.14 -->

![5. Демонстрационный инструмент ПК: английский оригинал, стр. 14](/docs/rockchip-vendor-storage-v13/assets/en-p014-figure-01.png)

*5. Демонстрационный инструмент ПК: английский оригинал, стр. 14*

<!-- English PDF p.14 -->

Нажатие Burning записывает данные в Vendor Storage.

<!-- English PDF p.15 -->

![5. Демонстрационный инструмент ПК: английский оригинал, стр. 15](/docs/rockchip-vendor-storage-v13/assets/en-p015-figure-01.png)

*5. Демонстрационный инструмент ПК: английский оригинал, стр. 15*

<!-- English PDF p.15 -->

Выберите SN и нажмите Read, чтобы прочитать данные из Vendor Storage.

<!-- English PDF p.15 -->

![5. Демонстрационный инструмент ПК: английский оригинал, стр. 15](/docs/rockchip-vendor-storage-v13/assets/en-p015-figure-02.png)

*5. Демонстрационный инструмент ПК: английский оригинал, стр. 15*

<!-- English PDF p.16 -->

## 6. Исходный код инструмента ПК

<!-- English PDF p.16 -->

Чтение данных инструментом ПК

<!-- English PDF p.16 -->

```text
/*----------------------------------------------------------------------
Name    : RK_ReadProvisioningData
Desc    : Read provisioning data by id
Params  : (IN)nID: id
          (OUT)pDataBuffer: buffer to save data, malloc by caller
          (IN|OUT)nBufferSize: in = size of buffer,out = actual data size
          (IN)dwLayer:device layer
Return  : TRUE: SUCCESSED
          FALSE: FAILED
----------------------------------------------------------------------*/
BOOL RK_ReadProvisioningData(USHORT nID,PBYTE pDataBuffer,USHORT &nBufferSize,DWORD dwLayer=0);
```

<!-- English PDF p.16 -->

Запись данных инструментом ПК

<!-- English PDF p.16 -->

```text
 /*----------------------------------------------------------------------
Name    : RK_WriteProvisioningData
Desc    : Write provisioning data by id
Params  : (IN)nID: id
          (IN)pDataBuffer: buffer to save data, malloc by caller
          (IN)nBufferSize: size of buffer
          (IN)dwLayer:device layer
Return  : TRUE: SUCCESSED
          FALSE: FAILED
----------------------------------------------------------------------*/
BOOL RK_WriteProvisioningData(USHORT nID,PBYTE pDataBuffer,USHORT nBufferSize,DWORD dwLayer=0);
```

<!-- English PDF p.16 -->

## 7. Пример Linux-приложения

<!-- English PDF p.16 -->

Доступ через узел `vendor_storage`, предоставляемый ядром.

<!-- English PDF p.16 -->

```text
#include <fcntl.h>
#include <sys/ioctl.h>

typedef unsigned short uint16;
typedef unsigned long uint32;
typedef unsigned char uint8;

#define VENDOR_REQ_TAG      0x56524551
#define VENDOR_READ_IO      _IOW('v', 0x01, unsigned int)
#define VENDOR_WRITE_IO     _IOW('v', 0x02, unsigned int)
#define VENDOR_SN_ID        1
#define VENDOR_WIFI_MAC_ID  2
#define VENDOR_LAN_MAC_ID   3
#define VENDOR_BLUETOOTH_ID 4

struct rk_vendor_req {
    u32 tag;
    u16 id;
    u16 len;
    u8 data[1];
};

int vendor_storage_read_test(void)
{
    uint32 i;
    int ret ;
    uint8 p_buf[2048]; /* malloc req buffer or used extern buffer */
    struct rk_vendor_req *req;

    req = (struct rk_vendor_req *)p_buf;
    int sys_fd = open("/dev/vendor_storage",O_RDWR,0);
    if(sys_fd < 0){
        ERROR("vendor_storage open fail\n");
        return -1;
    }

    req->tag = VENDOR_REQ_TAG;
    req->id = VENDOR_SN_ID;
    req->len = 512; /* max read length to read*/

    ret = ioctl(sys_fd, VENDOR_READ_IO, req);
    /* return req->len is the real data length stored in the NV-storage */
    if(ret){
        ERROR("vendor read error\n");
        return -1;
    }

    return 0;
}

int vendor_storage_write_test(void)
{
    uint32 i;
    int ret ;
    uint8 p_buf[2048]; /* malloc req buffer or used extern buffer */
    struct rk_vendor_req *req;

    req = (struct rk_vendor_req *)p_buf;
    int sys_fd = open("/dev/vendor_storage",O_RDWR,0);
    if(sys_fd < 0){
        ERROR("vendor_storage open fail\n");
        return -1;
    }
    req->tag = VENDOR_REQ_TAG;
    req->id = VENDOR_SN_ID;
    req->len = 32; /* data len */
    for (i = 0; i < 32; i++)
        req->data[i] = i;
    ret = ioctl(sys_fd, VENDOR_WRITE_IO, req);
    if(ret){
        ERROR("vendor write error\n");
        return -1;
    }

    return 0;
}
```

<!-- English PDF p.18 -->

Доступ пользовательских приложений без драйверов ядра:

<!-- English PDF p.18 -->

Реализацию см. в `hardware/rockchip/libvendor_storage/vendor_storage_test.c`.

{% endraw %}
