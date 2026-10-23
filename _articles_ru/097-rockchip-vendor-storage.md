---
title: "Rockchip Vendor Storage: полное описание структуры данных, ID и API U-Boot/Linux"
description: "Rockchip Vendor Storage: полное описание структуры данных, ID и API U-Boot/Linux — Rev.08, SN, MAC, NVM, ioctl."
translation_key: "097-rockchip-vendor-storage"
slug: "097-rockchip-vendor-storage"
lang: "ru"
date: "2026-10-22"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "Vendor Storage", "NVM", "Linux", "U-Boot"]
excerpt: "Rockchip Vendor Storage: полное описание структуры данных, ID и API U-Boot/Linux — Rev.08, SN, MAC, NVM, ioctl."
---

{% raw %}

# Rockchip Vendor Storage: полное описание структуры данных, ID и API U-Boot/Linux

Полный текст следует Appnote_rk_storage_0001, Rev.08, страницы 4–23. Единственный PDF находится в китайском каталоге, но его основной текст английский. Английская статья сохраняет оригинал; китайская, русская и немецкая полностью переводят его. Все версии используют исходные английские схемы и снимки; отдельного китайского оригинала или PDF из английского каталога нет. Это справочник по платформе ArmSoM, а не подтверждение поддержки всех плат. Источник не задаёт конкретные SoC, плату, SDK/BSP и версию ядра: необходимо проверить накопитель, загрузочную разметку, драйвер, ABI и узел устройства. Аппаратные операции чтения/записи и испытания при отключении питания не выполнялись.

> Внимание: последний пример записи заменяет ID 1 (SN) байтами 0–31. Не запускайте его на производственных устройствах; сначала сохраните идентификаторы и данные подготовки. Типы, макросы ошибок и закрытие дескриптора в оригинале неполны. Код сохранён для проверки источника, а не сертифицирован как готовый к запуску.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel) · [EDITORIAL-NOTES](/docs/rockchip-vendor-storage/EDITORIAL-NOTES.md)

<!-- PDF p.4 -->

## 1 Обзор применения

Vendor Storage предназначен для SN, MAC и других данных производителя. Возможности:

- Доступ по уникальному ID
- Надёжная проверка данных
- Восстановление после потери питания
- Чтение и запись с ПК
- Чтение и запись из UBOOT
- Чтение и запись из ядра
- Чтение и запись из приложений Linux

<!-- PDF p.5 -->

## 2 Архитектура Vendor Storage

![Архитектура Vendor Storage — PDF p.5](/docs/rockchip-vendor-storage/assets/en-original-p005-figure-01.png)

На схеме PC → USB → UBOOT и Linux Application → IOCTL NODE связаны с Vendor Storage API; Kernel также обращается к этому API. Нижний слой Storage API обслуживает EMMC, SPI NOR и NAND.

<!-- PDF p.6 -->

## 3 Структура данных

### 3.1 SPI NOR и EMMC

![Размещение данных SPI NOR и EMMC — PDF p.6](/docs/rockchip-vendor-storage/assets/en-original-p006-figure-01.png)

Схема раскрывает Header / Index / Data внутри блока Vendor. Для SPI NOR указаны начальные 4K и последующая область 28K; в увеличенной области подписаны четыре блока 4K. Для EMMC показаны начальные 3.5M, область 256K и четыре блока 64K. Сохранены исходные обозначения; применимость необходимо проверить по реальной загрузочной разметке. Это не универсальная команда разбиения накопителя.

<!-- PDF p.7 -->

### 3.2 SPI NAND / SLC NAND

![Размещение NAND с MTD и FTL — PDF p.7](/docs/rockchip-vendor-storage/assets/en-original-p007-figure-01.png)

- MTD: для Vendor Storage требуется раздел `vnvm` размером не менее 512KB. На схеме внутри него показаны четыре блока 4K и Header / Index / Data.
- С FTL: четыре блока 4K находятся в зарезервированной области SPI/SLC NAND (FTL). Системный API не может обращаться к этой области.

<!-- PDF p.8 -->

### 3.3 Формат записи

| Смещение (B) | Размер (B) | Название |
| --- | --- | --- |
| 0x0000 | 0x0004 | Tag со значением 0x524B5644. |
| 0x0004 | 0x0004 | Version, увеличивается после записи |
| 0x0008 | 0x0002 | Следующий индекс |
| 0x000A | 0x0002 | Всего элементов |
| 0x000C | 0x0002 | Смещение свободного места |
| 0x000E | 0x0002 | Размер свободного места |
| 0x0010 | 0x0002 | Item0-&gt;id |
| 0x0012 | 0x0002 | Item0-&gt;offset |
| 0x0014 | 0x0002 | Item0-&gt;size |
| 0x0016 | 0x0002 | Item0-&gt;flag(reversed) |
| 0x0018 | 0x0008 | Item1 |
| … | … | Item x |
| --- | --- | Данные (EMMC: около 62KB, остальные: около 3.5KB) |
| Size – 0x08 | 0x0004 | Hash |
| Size – 0x04 | 0x0004 | Version2, значение совпадает с Version |

<!-- PDF p.9 -->

## 4 Определения ID

| ID | Назначение |
| --- | --- |
| 0 | Зарезервировано |
| 1 | SN |
| 2 | WIFI MAC |
| 3 | LAN MAC |
| 4 | BT MAC |
| 5 | HDCP 1.4 HDMI |
| 6 | HDCP 1.4 DP |
| 7 | HDCP 2.X |
| 8 | DRM KEY |
| 9 | PLAYREADY Cert |
| 10 | ATTENTION KEY |
| 11 | PLAYREADY ROOT KEY 0 |
| 12 | PLAYREADY ROOT KEY 1 |
| 13 | HDCP 1.4 HDMIRX |
| 14 | SENSOR CALIBRATION (калибровка датчика) |
| 15 | IMEI |
| 16 | LAN_RGMII_DL |
| 17 | EINK_VCOM_ID |
| 18 | FIRMWARE_VER_ID |
| 19 | HDCP_2X_RX_ID |
| 20 | HDCP_2X_HDMIRX_ID |
| 21 – 31 | Резерв RK для будущего использования |
| 32 - 65535 | Для производителя |

<!-- PDF p.10 -->

Данные в NVM хранятся с выравниванием 64 байта. Минимальное выделение для элемента — 64 байта: запись 1–64 байт занимает 64 байта, запись 65–128 байт — 128 байт.

<!-- PDF p.11 -->

## 5 API UBOOT

`u-boot/board/rockchip/common/storage/storage.c`

### `vendor_storage_init`

```c
int vendor_storage_init(void);
```

| Поле | Описание |
| --- | --- |
| Назначение | Инициализация Vendor Storage |
| Вход | Нет |
| Результат | 0: успешно; другое значение: ошибка |

### `vendor_storage_read`

```c
int vendor_storage_read(u32 id, void *pbuf, u32 size);
```

| Поле | Описание |
| --- | --- |
| Назначение | Чтение Vendor Storage по ID |
| Вход | id: ID элемента; pbuf: буфер; size: число читаемых байт |
| Результат | -1: ошибка чтения; другое значение: число прочитанных байт |

<!-- PDF p.12 -->

### `vendor_storage_write`

```c
int vendor_storage_write(u32 id, void *pbuf, u32 size);
```

| Поле | Описание |
| --- | --- |
| Назначение | Запись Vendor Storage по ID |
| Вход | id: ID элемента; pbuf: буфер; size: число записываемых байт |
| Результат | 0: запись успешна; другое значение: ошибка записи |

<!-- PDF p.13 -->

## 6 API ядра

`kernel/drivers/soc/rockchip/rk_vendor_storage.c`

`kernel/drivers/soc/rockchip/sdmmc_vendor_storage.c`

### `rk_vendor_read`

```c
int rk_vendor_read(u32 id, void *pbuf, u32 size);
```

| Поле | Описание |
| --- | --- |
| Назначение | Чтение Vendor Storage по ID |
| Вход | id: ID элемента; pbuf: буфер; size: число читаемых байт |
| Результат | -1: ошибка чтения; другое значение: число прочитанных байт |

### `rk_vendor_write`

```c
int rk_vendor_write(u32 id, void *pbuf, u32 size);
```

| Поле | Описание |
| --- | --- |
| Назначение | Запись Vendor Storage по ID |
| Вход | id: ID элемента; pbuf: буфер; size: число записываемых байт |
| Результат | 0: запись успешна; другое значение: ошибка записи |

<!-- PDF p.14 -->

## 7 Конфигурация ядра

### Makefile

![Исходная конфигурация Makefile — PDF p.14](/docs/rockchip-vendor-storage/assets/en-original-p014-figure-01.png)

```makefile
#
# Rockchip soc drivers
#
obj-$(CONFIG_MMC_DW_ROCKCHIP) += sdmmc_vendor_storage.o
obj-$(CONFIG_ROCKCHIP_VENDOR_STORAGE) += rk_vendor_storage.o
```

### Menuconfig

![Исходная справка menuconfig — PDF p.14](/docs/rockchip-vendor-storage/assets/en-original-p014-figure-02.png)

```text
CONFIG_ROCKCHIP_VENDOR_STORAGE:

Say y here to enable vendor storage support.
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

Выберите `y` для поддержки SN, MAC, BT ADDR и подобных данных. На исходном снимке символ включён (`[=y]`), тип boolean, путь Device Drivers → SOC (System On Chip) specific Drivers. Зависимость: `ARCH_ROCKCHIP [=y] || COMPILE_TEST`; определение: `drivers/soc/rockchip/Kconfig:6`.

<!-- PDF p.15 -->

## 8 Демонстрационная утилита ПК

**1.** Выберите **SN**, введите значение и нажмите **ENTER**, чтобы добавить SN в список запросов записи. В примере используется `123SN`; состояние на снимке — `Not found rockusb`.

![Добавление SN в список запросов — PDF p.15](/docs/rockchip-vendor-storage/assets/en-original-p015-figure-01.png)

<!-- PDF p.16 -->

**2.** Нажмите **Burning** для записи в Vendor Storage. На исходном снимке показаны `Burning OK.` и `Found one loader`.

![Результат записи в оригинале — PDF p.16](/docs/rockchip-vendor-storage/assets/en-original-p016-figure-01.png)

<!-- PDF p.17 -->

**3.** Выберите **SN** и нажмите **Read** для чтения из Vendor Storage. В примере показаны `123SN`, `Reading OK.` и `Found one loader`.

![Результат чтения в оригинале — PDF p.17](/docs/rockchip-vendor-storage/assets/en-original-p017-figure-01.png)

<!-- PDF p.18 -->

## 9 Исходный код утилиты ПК

![Исходный список файлов проекта ПК — PDF p.18](/docs/rockchip-vendor-storage/assets/en-original-p018-figure-01.png)

В оригинале приведён снимок каталога проекта, а не содержимое этих исходных файлов. Усечённое имя ниже оставлено усечённым; скрытый суффикс не восстановлен.

```text
cmLib/
colorEdit/
FontStatic/
grid/
res/
upgradeLib/
ProvisioningTool.aps
ProvisioningTool.cpp
ProvisioningTool.h
ProvisioningTool.rc
ProvisioningTool.vcproj
ProvisioningTool.vcproj.HP-INPRC6N...
ProvisioningToolDlg.cpp
ProvisioningToolDlg.h
ReadMe.txt
resource.h
stdafx.cpp
stdafx.h
targetver.h
```

<!-- PDF p.19 -->

## 10 Утилита ПК: чтение данных

```c
/*----------------------------------------------------------------------
Name   : RK_ReadProvisioningData
Desc   : Read provisioning data by id
Params : (IN)nID                    id
         (OUT)pDataBuffer:          buffer to save data, malloc by caller
         (IN|OUT)nBufferSize:       in = size of buffer,out = actual data size
         (IN)dwLayer:               device layer
Return : TRUE:  SUCCESSED
         FALSE: FAILED
----------------------------------------------------------------------*/
BOOL RK_ReadProvisioningData(USHORT nID,PBYTE pDataBuffer,USHORT &nBufferSize,DWORD dwLayer=0);
```

Чтение данных подготовки по ID. `pDataBuffer` выделяется вызывающей стороной. `nBufferSize` на входе задаёт размер буфера, на выходе — фактический размер данных. `dwLayer` задаёт слой устройства, по умолчанию 0. Успех — `TRUE`, ошибка — `FALSE`.

<!-- PDF p.20 -->

## 11 Утилита ПК: запись данных

```c
/*----------------------------------------------------------------------
Name   : RK_WriteProvisioningData
Desc   : Write provisioning data by id
Params : (IN)nID                    id
         (IN)pDataBuffer:           buffer to save data, malloc by caller
         (IN)nBufferSize:           size of buffer
         (IN)dwLayer:               device layer
Return : TRUE:  SUCCESSED
         FALSE: FAILED
----------------------------------------------------------------------*/
BOOL RK_WriteProvisioningData(USHORT nID,PBYTE pDataBuffer,USHORT nBufferSize,DWORD dwLayer=0);
```

Запись данных подготовки по ID. Вызывающая сторона выделяет `pDataBuffer`; `nBufferSize` задаёт размер входного буфера. `dwLayer` — слой устройства, по умолчанию 0. Успех — `TRUE`, ошибка — `FALSE`.

<!-- PDF p.21 -->

## 12 Примеры кода Linux

```c
#include <fcntl.h>
#include <sys/ioctl.h>

typedef unsigned short uint16;
typedef unsigned long uint32;
typedef unsigned char uint8;

#define VENDOR_REQ_TAG 0x56524551
#define VENDOR_READ_IO _IOW('v', 0x01, unsigned int)
#define VENDOR_WRITE_IO _IOW('v', 0x02, unsigned int)
#define VENDOR_SN_ID 1
#define VENDOR_WIFI_MAC_ID 2
#define VENDOR_LAN_MAC_ID 3
#define VENDOR_BLUETOOTH_ID 4

struct rk_vendor_req {
    u32 tag;
    u16 id;
    u16 len;
    u8 data[1];
};
```

<!-- PDF p.22 -->

### 12.1 Проверка чтения

```c
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
```

<!-- PDF p.23 -->

### 12.2 Проверка записи

```c
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
    rknand_print_hex_data("vendor write:", (uint32*)req, req->len + 8);
    ret = ioctl(sys_fd, VENDOR_WRITE_IO, req);
    if(ret){
        ERROR("vendor write error\n");
        return -1;
    }
    return 0;
}
```

{% endraw %}
