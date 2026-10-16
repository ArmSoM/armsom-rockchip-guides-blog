---
title: "Руководство RK3588 HDCP: ключи, прошивка, настройка HDMI/DP и диагностика"
description: "Полный материал по RK3588 HDCP 1.4/2.3: инструменты, API libhdcp, упаковка ключей и прошивок, HDMIRX/HDMITX/DPTX, состояния и диагностика."
translation_key: "046-rockchip-rk3588-hdcp"
slug: "046-rockchip-rk3588-hdcp"
lang: "ru"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: ["Rockchip", "HDCP"]
keywords: "ArmSoM Rockchip HDCP"
excerpt: "Полный материал по RK3588 HDCP 1.4/2.3: инструменты, API libhdcp, упаковка ключей и прошивок, HDMIRX/HDMITX/DPTX, состояния и диагностика."
---

{% raw %}

# Руководство RK3588 HDCP: ключи, прошивка, настройка HDMI/DP и диагностика

Этот полный технический материал следует документу Rockchip V1.0.0. Область исходника: RK3588, Linux 5.10, Android12/Android13. Это справочник по платформе для ArmSoM; проверьте конкретную плату, SoC, ветку SDK/BSP, ядро и периферию. Аппаратная проверка платы не проводилась; поддержка всеми платами ArmSoM не подразумевается.

Китайская статья следует китайскому PDF из 19 страниц, английская — английскому PDF из 21 страниц; русская полностью переводит его технический текст. Для китайского использованы китайские рисунки, для английского и русского — рисунки английского PDF, включая китайские подписи интерфейса, присутствующие в оригинале. Противоречия и исправления извлечения отмечены в [редакционных записях](/docs/rockchip-rk3588-hdcp/EDITORIAL-NOTES.md). Комментарии к коду и вывод сохраняют язык источника.

**Риск операций:** запись ключей и прошивок изменяет хранилище и состояние аутентификации. Шестнадцатеричные ключи — примеры исходника, а не производственные ключи; легитимные ключи HDCP следует получать по соответствующей лицензии. Запись, операции OTP, аутентификация и воспроизведение не проверялись; частные ключи не включены. Описание шифрования не заменяет требования конкретного SDK и лицензирования.

Официальные ресурсы: [ArmSoM](https://docs.armsom.org/)、[Rockchip Linux](https://github.com/rockchip-linux)。

| SoC | Kernel | Android |
|---|---|---|
| RK3588 | Linux 5.10 | Android12 / Android13 |

<!-- Source EN PDF p.4, block 0 -->

## 1. Обзор HDCP

<!-- Source EN PDF p.4, block 1 -->

Платформа RK3588 поддерживает HDCP1.4 и HDCP2.3 на интерфейсах HDMITX, HDMIRX и DPTX.

<!-- Source EN PDF p.4, block 2 -->

В RK3588 имеются два независимых контроллера HDCP2.3 (hdcp0 и hdcp1); исходник указывает по 3 порта у каждого:

<!-- Source EN PDF p.4, block 3 -->

hdcp0: DPTX0 и DPTX1

<!-- Source EN PDF p.4, block 4 -->

hdcp1: HDMIRX, HDMITX0 и HDMITX1

<!-- Source EN PDF p.4, block 5 -->

![Технический рисунок исходника — PDF 4](/docs/rockchip-rk3588-hdcp/assets/en-p04-figure1.png)

Редактируемая расшифровка рисунка:

| Controller | Port | Interface |
|---|---|---|
| HDCP0 | Port0 | DPTX0 |
| HDCP0 | Port1 | DPTX1 |
| HDCP1 | Port0 | HDMIRX |
| HDCP1 | Port1 | HDMITX0 |
| HDCP1 | Port2 | HDMITX1 |

<!-- Source EN PDF p.4, block 6 -->

Ключи HDCP1.4 и HDCP2.3 заказчик должен самостоятельно приобрести через официальный ресурс HDCP. В RK3588 встроенных ключей HDCP нет.

<!-- Source EN PDF p.4, block 7 -->

## 2. Инструменты HDCP

<!-- Source EN PDF p.4, block 8 -->

### 2.1 Поддерживаемые способы записи

<!-- Source EN PDF p.4, block 9 -->

1\. RK предоставляет инструменты преобразования и записи ключей, которые можно получить из SDK:

<!-- Source EN PDF p.4, block 10 -->

Инструмент разделения и преобразования ключей:

<!-- Source EN PDF p.4, block 11 -->

Архив `RKTools/windows/Rockchip_HdcpKey_Writer_V1.0.1.7z` содержит KeyConvertor для разделения и преобразования ключей. Обновление до KeyConvertor-V2.0.5 позволяет разделить исходный набор на bin-файлы с одним ключом в каждом.

<!-- Source EN PDF p.5, block 12 -->

Инструмент записи ключей:

<!-- Source EN PDF p.5, block 13 -->

```text
RKTools/windows/Rockchip_HdcpKey_Writer_V1.0.1.7z
```

<!-- Source EN PDF p.5, block 14 -->

2\. RK предоставляет библиотеку шифрованной записи libhdcp.so. Заказчик может разработать собственный инструмент записи с учётом своих требований. Библиотеку libhdcp.so необходимо запросить через Redmine.

<!-- Source EN PDF p.5, block 15 -->

### 2.2 Различия между двумя способами записи HDCP

<!-- Source EN PDF p.5, block 16 -->

1\. Инструмент RK дополнительно шифрует ключ алгоритмом AES поверх шифрования SEED, после чего записывает его в Vendor Storage.

<!-- Source EN PDF p.5, block 17 -->

2\. Библиотека шифрованной записи libhdcp.so поддерживает только шифрование SEED.

<!-- Source EN PDF p.5, block 18 -->

### 2.3 Интерфейсы библиотеки шифрованной записи libhdcp.so

<!-- Source EN PDF p.5, block 19 -->

```text
enum HDCP_KEY_ID {
    HDCP1X_KEY_HDMITX_RK33 = 0,
    HDCP1X_KEY_HDMITX_RK3588,
    HDCP1X_KEY_HDMIRX_RK3588,
    HDCP1X_KEY_HDMIRX_RK628,
    HDCP1X_KEY_DP_RK3588,
    HDCP2X_KEY_HDMIRX_RK3588,
    HDCP2X_KEY_RKIV_RK3588,
};
/*
 * Encrypt the key, but is not written to vendor
 *
 * id: HDCP KEY type
 * keyin: HDCP1.x 308 Byte raw Key, HDCP2.x 1000 Byte Key
 * keyin_size: HDCP1.x 308, HDCP2.x 1000
 * keyout: The encrypted key
 * keyout_size: HDCP1.x 314, HDCP2.x 1000
 */
int hdcp_key_process(enum HDCP_KEY_ID id, uint8_t *keyin, int keyin_size, uint8_t *keyout,
int keyout_size);
/*
 * Encrypt key and write it to vendor
 *
 * id: HDCP KEY type
 * keyin: HDCP1.x 308 Byte raw Key, HDCP2.x 1000 Byte Key
 * keyin_size: HDCP1.x 308, HDCP2.x 1000
 */
int hdcp_key_process_and_write(enum HDCP_KEY_ID id, uint8_t *keyin, int keyin_size);
/*
 * Write key to vendor
 *
 * id: HDCP KEY type
 * key: HDCP1.x 308 Byte raw Key, HDCP2.x 1000 Byte Key
 * size: key size
 */
int hdcp_key_write(enum HDCP_KEY_ID id, uint8_t *key, int size);
/*
 * Read key from vendor
 *
 * id: HDCP KEY type
 * key: HDCP1.x 314 Byte Key, HDCP2.x 1000 Byte Key
 * len: key length
 */
int hdcp_key_read(enum HDCP_KEY_ID id, uint8_t *key, int *len);
/*
 * Write rkiv to vendor
 *
 * rkiv: rkiv
 * len: must be 16
 */
int hdcp_rkiv_write(uint8_t *rkiv, int len);
```

<!-- Source EN PDF p.6, block 21 -->

### 2.4 Шифрование ключа HDCP 1.4

<!-- Source EN PDF p.6, block 22 -->

Ключ HDCP 1.4 состоит из 308 байт: 8 байт KSV (5 байт KSV + 3 байта 0x0), 280 байт DPK и 20 байт SHA.

<!-- Source EN PDF p.6, block 23 -->

SEED шифрует только 280 байт DPK.

<!-- Source EN PDF p.6, block 24 -->

### 2.5 Упаковка прошивки HDCP 2.3

<!-- Source EN PDF p.6, block 25 -->

Инструмент упаковки DWC_HDCP2_BASE_ESM_Firmware не входит в SDK; его необходимо запросить у RK через Redmine или по электронной почте.

<!-- Source EN PDF p.6, block 26 -->

1\. Отдельная прошивка и ключ HDMIRX

<!-- Source EN PDF p.6, block 27 -->

Поместите RX KEY в корневой каталог инструмента упаковки и каталог tools:

<!-- Source EN PDF p.6, block 28 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_receivers.bin .
cp ../hdcp_receivers.bin tools/
```

<!-- Source EN PDF p.7, block 29 -->

Выполните build_rockchip_fw.sh и выберите вариант 1 — build firmware for both HDMIRX and HDMITX. Будет создана прошивка `./firmware/hdpc2_hdmi.fw`:

<!-- Source EN PDF p.7, block 30 -->

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP
Choose the fw type: 1
```

<!-- Source EN PDF p.7, block 31 -->

2\. Прошивка и ключ HDMIRX + HDMITX

<!-- Source EN PDF p.7, block 32 -->

Поместите RX KEY и TX KEY в корневой каталог инструмента и каталог tools:

<!-- Source EN PDF p.7, block 33 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_receivers.bin .
cp ../hdcp_receivers.bin tools/
cp ../hdcp_transmitter.bin .
cp ../hdcp_transmitter.bin tools/
```

<!-- Source EN PDF p.7, block 34 -->

Выполните build_rockchip_fw.sh и выберите 1 — build firmware for both HDMIRX and HDMITX. Исходник указывает выходной файл `./firmware/hdpc2_dp.fw`:

<!-- Source EN PDF p.7, block 35 -->

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP
Choose the fw type: 1
```

<!-- Source EN PDF p.7, block 36 -->

3\. Прошивка HDMITX

<!-- Source EN PDF p.7, block 37 -->

Поместите TX KEY в корневой каталог инструмента и каталог tools:

<!-- Source EN PDF p.7, block 38 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_transmitter.bin .
cp ../hdcp_transmitter.bin tools/
```

<!-- Source EN PDF p.7, block 39 -->

Выполните build_rockchip_fw.sh и выберите 2 — build firmware for HDMITX only. Будет создана прошивка `./firmware/hdpc2_hdmi.fw`:

<!-- Source EN PDF p.7, block 40 -->

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP
Choose the fw type: 2
```

<!-- Source EN PDF p.7, block 41 -->

4\. Прошивка DPTX

<!-- Source EN PDF p.7, block 42 -->

Поместите TX KEY в корневой каталог инструмента и каталог tools:

<!-- Source EN PDF p.7, block 43 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_transmitter.bin .
cp ../hdcp_transmitter.bin tools/
```

<!-- Source EN PDF p.8, block 44 -->

Выполните build_rockchip_fw.sh и выберите 3 — build firmware for DP. Исходник указывает выходной файл `./firmware/hdpc2_hdmi.fw`:

<!-- Source EN PDF p.8, block 45 -->

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP
Choose the fw type: 3
```

<!-- Source EN PDF p.8, block 46 -->

### 2.6 Шифрование прошивки и RX KEY (необязательное)

<!-- Source EN PDF p.8, block 47 -->

По умолчанию прошивка и RX KEY шифруются с помощью PKf/DUK. После загрузки контроллер HDCP расшифровывает их с помощью PKf/DUK. PKf/DUK записываются в OTP при производстве SoC.

<!-- Source EN PDF p.8, block 48 -->

Чтобы сделать прошивку и RX KEY уникальными для каждого заказчика, при упаковке можно добавить шифрование AES ключом RKIV. Сервис HDCP2 после загрузки сначала выполняет расшифрование AES, затем передаёт данные контроллеру HDCP для расшифрования Kf/DUK. Конфигурация следующая:

<!-- Source EN PDF p.8, block 49 -->

1\. В firmware.aic.nouart задайте 16-байтовый RKIV. Заказчик может определить его значение, но длина ключа должна составлять ровно 16 байт:

<!-- Source EN PDF p.8, block 50 -->

```text
--- a/DWC_HDCP2_BASE_ESM_Firmware/firmware/firmware.aic.nouart
+++ b/DWC_HDCP2_BASE_ESM_Firmware/firmware/firmware.aic.nouart
@@ -2,6 +2,7 @@ PKf = 0x00112233445566778899aabbccddeeff
 DUK = 0xffeeddccbbaa99887766554433221100
 IK = 0xffeeddccbbaa99887766554433221100
 IVc = 0xdeadbeeffedcba9876543210
+RKIV = 0x00112233445566778899aabbccddeeff
 BBRcode = 6144
 BBRdwb = 3072
 CLL = 64
```

<!-- Source EN PDF p.8, block 51 -->

2\. Вызовите интерфейс libhdcp.so, чтобы записать RKIV в Vendor Storage:

<!-- Source EN PDF p.8, block 52 -->

```text
int main(void)
{
    uint8_t rkiv[] = {0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77,
                      0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff};
    hdcp_rkiv_write(rkiv, 16);
    return 0;
}
```

<!-- Source EN PDF p.8, block 53 -->

3\. После записи HDCP2x RX KEY необходимо повторно записать RKIV.

<!-- Source EN PDF p.8, block 54 -->

4\. hdcp2_tx_rx необходимо обновить до версии 3.4 или новее.

<!-- Source EN PDF p.9, block 55 -->

```text
rk3588_t:/ # logcat | grep HDCP2
03-16 07:36:03.988 347 347 D HDCP2 : hdcp2 version v3.4
03-16 07:36:03.988 347 347 D HDCP2 : HDCP Port: 1
03-16 07:36:03.991 347 347 D HDCP2 : Firmware: [1]
```

<!-- Source EN PDF p.9, block 56 -->

## 3. Настройка HDCP1.4

<!-- Source EN PDF p.9, block 57 -->

### 3.1 HDMIRX

<!-- Source EN PDF p.9, block 58 -->

#### 3.1.1 Настройка DTS

<!-- Source EN PDF p.9, block 59 -->

Поддержка только HDCP 1.4:

<!-- Source EN PDF p.9, block 60 -->

```text
&hdmirx_ctrler {
    status = "okay";
    hdcp1x-enable;
};
```

<!-- Source EN PDF p.9, block 61 -->

При включении HDCP2.3 по умолчанию также включается HDCP1.4:

<!-- Source EN PDF p.9, block 62 -->

```text
&hdmirx_ctrler {
    status = "okay";
    hdcp2x-enable;
};
```

<!-- Source EN PDF p.9, block 63 -->

#### 3.1.2 Запись ключа

<!-- Source EN PDF p.9, block 64 -->

##### 3.1.2.1 Запись инструментом RK

<!-- Source EN PDF p.9, block 65 -->

Инструмент разделения и преобразования ключей из SDK:

<!-- Source EN PDF p.9, block 66 -->

Архив `RKTools/windows/Rockchip_HdcpKey_Writer_V1.0.1.7z` содержит KeyConvertor для разделения и преобразования ключей. Обновление до KeyConvertor-V2.0.5 позволяет разделить набор на bin-файлы с одним ключом в каждом.

<!-- Source EN PDF p.9, block 67 -->

Инструмент записи ключей из SDK:

<!-- Source EN PDF p.9, block 68 -->

```text
RKTools/windows/Rockchip_HdcpKey_Writer_V1.0.1.7z
```

<!-- Source EN PDF p.9, block 69 -->

Сначала извлеките отдельные ключи из исходного файла инструментом разделения и преобразования, затем преобразуйте ключи в формат .skf для записи.

<!-- Source EN PDF p.10, block 70 -->

Если запись выполняется не инструментом RK, ключи необходимо разделить на файлы по одному ключу. Для этого в поле «Number of Keys per file» укажите 1 и нажмите Extract. Преобразование в .skf в этом случае не требуется.

<!-- Source EN PDF p.10, block 71 -->

![Технический рисунок исходника — PDF 10](/docs/rockchip-rk3588-hdcp/assets/en-p10-figure1.png)

<!-- Source EN PDF p.10, block 72 -->

Переведите устройство в режим Loader и выберите в инструменте записи «hdcp1.4Hdmirx» и «RK3588». Для ключа HDCP1.4 RK3588 предусмотрено дополнительное AES-шифрование, поэтому флажок «Do AES» необязателен. Без него используется только SEED; с ним поверх SEED добавляется AES. Импортируйте указанный .skf и нажмите Write для записи ключа.

<!-- Source EN PDF p.10, block 73 -->

Примечание: после записи одного ключа инструмент автоматически переходит к следующему.

<!-- Source EN PDF p.11, block 74 -->

![Технический рисунок исходника — PDF 11](/docs/rockchip-rk3588-hdcp/assets/en-p11-figure1.png)

<!-- Source EN PDF p.11, block 75 -->

##### 3.1.2.2 Запись собственным инструментом заказчика

<!-- Source EN PDF p.11, block 76 -->

Можно разработать приложение, вызывающее интерфейсы libhdcp.so для шифрования ключа и записи в Vendor Storage.

<!-- Source EN PDF p.11, block 77 -->

### 3.2 HDMITX

<!-- Source EN PDF p.11, block 78 -->

Для HDMI TX HDCP 1.4 специальная настройка DTS не требуется: драйвер зарегистрирован по умолчанию.

<!-- Source EN PDF p.11, block 79 -->

Для работы сначала разделите и преобразуйте ключи. Инструменты и порядок те же, что у HDMIRX; см. §3.1.2.1.

<!-- Source EN PDF p.12, block 80 -->

![Технический рисунок исходника — PDF 12](/docs/rockchip-rk3588-hdcp/assets/en-p12-figure1.png)

<!-- Source EN PDF p.12, block 81 -->

Для записи используется тот же инструмент, что и для RX. Переведите устройство в режим Loader, нажмите Settings и отметьте «hdcp1.4 Hdmitx», «RK3588», «Force Write», «Single Write». Импортируйте преобразованный .skf и нажмите Write.

<!-- Source EN PDF p.12, block 82 -->

Примечание: после записи одного ключа инструмент автоматически переходит к следующему.

<!-- Source EN PDF p.12, block 83 -->

### 3.3 DPTX

<!-- Source EN PDF p.12, block 84 -->

#### 3.3.1 Настройка DTS

<!-- Source EN PDF p.12, block 85 -->

Драйвер DPTX изначально поддерживает HDCP1.4; дополнительная настройка DTS не нужна.

<!-- Source EN PDF p.12, block 86 -->

#### 3.3.2 Запись ключа

<!-- Source EN PDF p.12, block 87 -->

Инструмент разделения и преобразования тот же, что для HDMI RX; см. §3.1.2.1.

<!-- Source EN PDF p.12, block 88 -->

Для записи используется тот же инструмент, что для HDMI RX. В режиме Loader нажмите Settings и выберите «hdcp1.4 dp», «RK3588», «Force Write», «Single Write». Импортируйте преобразованный .skf и нажмите Write. Для ключа HDCP1.4 RK3588 доступен необязательный флажок «Do AES»: без него выполняется только SEED-шифрование, с ним — AES поверх SEED.

<!-- Source EN PDF p.13, block 89 -->

![Технический рисунок исходника — PDF 13](/docs/rockchip-rk3588-hdcp/assets/en-p13-figure1.png)

<!-- Source EN PDF p.13, block 90 -->

## 4. Настройка HDCP2.3

<!-- Source EN PDF p.13, block 91 -->

### 4.1 HDMIRX

<!-- Source EN PDF p.13, block 92 -->

#### 4.1.1 Настройка DTS

<!-- Source EN PDF p.13, block 93 -->

При включении HDCP2.3 по умолчанию также включается HDCP1.4:

<!-- Source EN PDF p.13, block 94 -->

```text
&hdcp1 {
    status = "okay";
};
&hdmirx_ctrler {
    status = "okay";
    hdcp2x-enable;
};
```

<!-- Source EN PDF p.14, block 95 -->

#### 4.1.2 Упаковка прошивки и запуск сервисов

<!-- Source EN PDF p.14, block 96 -->

Распакуйте DWC_HDCP2_BASE_ESM_Firmware в Linux и скопируйте hdcp_receivers.bin в корневой каталог и tools/. Если требуется также HDMI TX, скопируйте hdcp_transmitter.bin в те же каталоги.

<!-- Source EN PDF p.14, block 97 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_receivers.bin .
cp ../hdcp_receivers.bin tools/
```

<!-- Source EN PDF p.14, block 98 -->

Для упаковки прошивки и RX KEY выполните build_rockchip_fw.sh:

<!-- Source EN PDF p.14, block 99 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$ ./build_rockchip_fw.sh
```

<!-- Source EN PDF p.14, block 100 -->

Во время упаковки необходимо ответить на несколько запросов:

<!-- Source EN PDF p.14, block 101 -->

1\. Выберите тип прошивки 1 — build firmware for both HDMIRX and HDMITX. Будет создан файл `./firmware/hdpc2_hdmi.fw`.

<!-- Source EN PDF p.14, block 102 -->

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP
Choose the fw type: 1
```

<!-- Source EN PDF p.14, block 103 -->

2\. Задайте необходимое число RX KEY, например 10 или 100. Отдельные ключи сохраняются в файлах `fw_hdcp_receivers_*.bin` каталога `./rxkeys/hdcpkeys?-?/`. Если заказчик использует собственный инструмент, эти bin-файлы можно записывать напрямую.

<!-- Source EN PDF p.14, block 104 -->

```text
Create Rx Key Number:
10
......
Create 10 keys to tools/rxkeys/hdcpkeys1-10/
```

<!-- Source EN PDF p.14, block 105 -->

3\. Для инструмента RK необходимо упаковать файлы в формат .skf; результат сохраняется в `./rxkeys/hdcpkeys?-?/`. Если инструмент RK не используется, выберите n.

<!-- Source EN PDF p.14, block 106 -->

```text
Do want to pack these keys to .skf file? [y/n]:
y
10 file packed to ./rxkeys/hdcpkeys1-10/hdcprxkeys1-10.skf
```

<!-- Source EN PDF p.14, block 107 -->

Запись ключа приёмника HDCP2.3

<!-- Source EN PDF p.14, block 108 -->

1\. Поместите hdcp2_hdmi.fw в каталог проекта `device/rockchip/rk3588/`; при сборке файл будет скопирован в `vendor/firmware/hdcp2_hdmi.fw`.

<!-- Source EN PDF p.15, block 109 -->

2\. В RKDevInfoTool.exe выберите HDCP2X_HDMIRX, импортируйте созданный hdcprxkeys1-10.skf и выполните запись в режиме Loader. После записи одного ключа инструмент автоматически переходит к следующему ожидающему записи ключу.

<!-- Source EN PDF p.15, block 110 -->

3\. Для ключа HDCP2.3 AES-шифрование не требуется; достаточно выбрать «RK3588» и «hdcp2x hdmirx».

<!-- Source EN PDF p.15, block 111 -->

![Технический рисунок исходника — PDF 15](/docs/rockchip-rk3588-hdcp/assets/en-p15-figure1.png)

<!-- Source EN PDF p.15, block 112 -->

Сервис hdcp2_rx_tx

<!-- Source EN PDF p.15, block 113 -->

Сервис загружается автоматически при запуске. При ошибках аутентификации просмотрите журнал командой `logcat | grep HDCP2`.

<!-- Source EN PDF p.15, block 114 -->

### 4.2 HDMITX

<!-- Source EN PDF p.15, block 115 -->

#### 4.2.1 Настройка DTS

<!-- Source EN PDF p.15, block 116 -->

HDMITX и HDMIRX используют общий модуль HDCP. При включении HDCP2.3 по умолчанию также включается HDCP1.4:

<!-- Source EN PDF p.15, block 117 -->

```text
&hdcp1 {
    status = "okay";
};
```

<!-- Source EN PDF p.15, block 118 -->

Включение HDMI описано в `Rockchip_Developer_Guide_HDMI_CN`.

<!-- Source EN PDF p.16, block 119 -->

#### 4.2.2 Упаковка прошивки и запуск сервисов

<!-- Source EN PDF p.16, block 120 -->

Распакуйте DWC_HDCP2_BASE_ESM_Firmware в Linux, затем скопируйте hdcp_transmitter.bin в корневой каталог и tools/. Если нужен HDMI RX, также скопируйте hdcp_receivers.bin в эти каталоги.

<!-- Source EN PDF p.16, block 121 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_receivers.bin .
cp ../hdcp_receivers.bin tools/
```

<!-- Source EN PDF p.16, block 122 -->

Для упаковки прошивки и TX KEY выполните build_rockchip_fw.sh:

<!-- Source EN PDF p.16, block 123 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$ ./build_rockchip_fw.sh
```

<!-- Source EN PDF p.16, block 124 -->

Во время упаковки необходимо ответить на несколько запросов:

<!-- Source EN PDF p.16, block 125 -->

Выберите тип прошивки. Для совместной поддержки HDMI TX/RX выберите 1 — build firmware for both HDMIRX and HDMITX; только для HDMITX — 2 — build firmware for HDMITX only. Итоговый файл: `./firmware/hdpc2_hdmi.fw`.

<!-- Source EN PDF p.16, block 126 -->

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP
Choose the fw type: 2
```

<!-- Source EN PDF p.16, block 127 -->

Сервис hdcp2_rx_tx

<!-- Source EN PDF p.16, block 128 -->

Сервис загружается автоматически при запуске. При ошибках аутентификации просмотрите журнал командой `logcat | grep HDCP2`.

<!-- Source EN PDF p.16, block 129 -->

### 4.3 DPTX

<!-- Source EN PDF p.16, block 130 -->

#### 4.3.1 Настройка DTS

<!-- Source EN PDF p.16, block 131 -->

DPTX использует модуль HDCP0. Для включения HDCP2.3:

<!-- Source EN PDF p.16, block 132 -->

```text
&hdcp0 {
    status = "okay";
};
```

<!-- Source EN PDF p.16, block 133 -->

При включении HDCP2.3 по умолчанию включается и HDCP1.4.

<!-- Source EN PDF p.17, block 134 -->

#### 4.3.2 Упаковка прошивки и запуск сервисов

<!-- Source EN PDF p.17, block 135 -->

Распакуйте DWC_HDCP2_BASE_ESM_Firmware в Linux и скопируйте hdcp_transmitter.bin в корневой каталог и tools/.

<!-- Source EN PDF p.17, block 136 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_receivers.bin .
cp ../hdcp_receivers.bin tools/
```

<!-- Source EN PDF p.17, block 137 -->

Для упаковки прошивки и TX KEY выполните build_rockchip_fw.sh:

<!-- Source EN PDF p.17, block 138 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$ ./build_rockchip_fw.sh
```

<!-- Source EN PDF p.17, block 139 -->

Процесс упаковки запрашивает ввод:

<!-- Source EN PDF p.17, block 140 -->

Выберите 3 — build firmware for DP; будет создан файл `./firmware/hdpc2_dp.fw`.

<!-- Source EN PDF p.17, block 141 -->

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP
Choose the fw type: 3
```

<!-- Source EN PDF p.17, block 142 -->

В Android для копирования hdcp2_dp.fw в `/vendor/firmware/hdcp2_dp.fw` можно добавить следующий патч в `hardware/rockchip/hdcp2`:

<!-- Source EN PDF p.17, block 143 -->

```text
diff --git a/device.mk b/device.mk
index 6d6c328..d7ba0a2 100644
--- a/device.mk
+++ b/device.mk
@@ -82,6 +82,12 @@ ifeq ($(strip $(USE_PRODUCT_HDCP2_HDMI_FW)), true)
         $(LOCAL_PATH)/hdcp2_hdmi.fw:vendor/firmware/hdcp2_hdmi.fw
 endif
+USE_PRODUCT_HDCP2_DP_FW := $(shell test -f $(LOCAL_PATH)/hdcp2_dp.fw && echo true)
+ifeq ($(strip $(USE_PRODUCT_HDCP2_DP_FW)), true)
+ PRODUCT_COPY_FILES += \
+ $(LOCAL_PATH)/hdcp2_dp.fw:vendor/firmware/hdcp2_dp.fw
+endif
+
 #
 # add Rockchip properties here
 #
```

<!-- Source EN PDF p.17, block 144 -->

Поместите hdcp2_dp.fw в каталог проекта `device/rockchip/rk3588/`. При сборке файл будет скопирован в `/vendor/firmware/hdcp2_dp.fw`.

<!-- Source EN PDF p.17, block 145 -->

В Linux скопируйте hdcp2_dp.fw в `/system/etc/firmware/hdcp2_dp.fw`.

<!-- Source EN PDF p.17, block 146 -->

Сервис hdcp2_rx_tx

<!-- Source EN PDF p.18, block 147 -->

В Android добавьте следующий патч в `hardware/rockchip/hdcp2`:

<!-- Source EN PDF p.18, block 148 -->

```text
diff --git a/init.hdcp2-host.rc b/init.hdcp2-host.rc
index 5a9bee8..57eef7e 100644
--- a/init.hdcp2-host.rc
+++ b/init.hdcp2-host.rc
@@ -1,7 +1,14 @@
 #on early-boot
 on post-fs
+ start hdcp2_dp
     start hdcp2_hdmi
+service hdcp2_dp /vendor/bin/hdcp2_tx_rx 0
+ class core
+ oneshot
+ disabled
+ group root system net_admin net_bt
+ capabilities DAC_OVERRIDE
 service hdcp2_hdmi /vendor/bin/hdcp2_tx_rx 1
     class core
```

<!-- Source EN PDF p.18, block 149 -->

Сервис может автоматически запускаться при загрузке системы. При ошибках аутентификации просмотрите журнал командой `logcat | grep HDCP2`.

<!-- Source EN PDF p.18, block 150 -->

## 5. Проверка состояния HDCP

<!-- Source EN PDF p.18, block 151 -->

### 5.1 HDMIRX

<!-- Source EN PDF p.18, block 152 -->

```text
cat /sys/class/misc/hdmirx_hdcp/status
```

<!-- Source EN PDF p.18, block 153 -->

```text
HDCP Disable: HDCP is not enabled
HDCP1.4: Authenticated start: during authentication process
HDCP1.4: Authentication success: Authentication successful
HDCP1.4: Authentication failed: Authentication failed
HDCP1.4: Unknown status: Unknown status
```

Значения вывода: HDCP Disable — HDCP выключен; Authenticated start — идёт аутентификация; Authentication success — успешно; Authentication failed — ошибка; Unknown status — неизвестное состояние. Строки вывода сохранены как в английском исходнике.

<!-- Source EN PDF p.18, block 154 -->

```text
HDCP Disable: HDCP is not enabled
HDCP2.3: Authentication success: Authentication successful
HDCP2.3: Authenticated failed: Authentication failed
HDCP2.3: No dectypted: Source end did not enable HDCP2.x
```

Значения вывода: HDCP Disable — HDCP выключен; Authentication success — успешная аутентификация; Authenticated failed — ошибка; No dectypted — источник не включил HDCP2.x. Написание dectypted сохранено из исходника.

<!-- Source EN PDF p.18, block 155 -->

Если источник не включил HDCP-шифрование или источник сигнала не подключён:

<!-- Source EN PDF p.19, block 156 -->

```text
HDCP2.3: No dectypted
HDCP1.4: Unknown status
```

<!-- Source EN PDF p.19, block 157 -->

### 5.2 HDMITX

<!-- Source EN PDF p.19, block 158 -->

Состояние HDMITX проверяется через DRM PROPERTY. Пример просмотра свойств командой

<!-- Source EN PDF p.19, block 159 -->

`modetest -c`:

<!-- Source EN PDF p.19, block 160 -->

```text
---------------------------------------------------------------------
Content Protection:
                flags: enum
                enums: Undesired=0 Desired=1 Enabled=2
                value: 2
Undesired: Disable HDCP.
Desired: Enable HDCP.
Enabled: HDCP has been enabled and authenticated successfully.
---------------------------------------------------------------------
HDCP Content Type:
                flags: enum
                enums: HDCP Type0=0 HDCP Type1=1
                value: 0
HDCP Type0: If either HDCP 1.4 or HDCP 2.3 authentication succeeds at any level, normal
video output is permitted.
HDCP Type1: Must be successfully authenticated with HDCP2.3 to output a normal display.
Note: The current version of the driver does not actually support this feature. By default,
any level of successful authentication can output normally, so no configuration is required.
---------------------------------------------------------------------
hdcp_encrypted:
                flags: range
                values: 0 2
                value: 2
HDCP Authentication Level:
    0: HDCP unauthorized.
    1: hdcp1.4.
    2: hdcp2.3.
---------------------------------------------------------------------
```

Описание свойств: Content Protection: Undesired отключает HDCP, Desired запрашивает включение, Enabled означает включение и успешную аутентификацию. HDCP Content Type: Type0 допускает изображение при успешной аутентификации любого уровня HDCP1.4 или HDCP2.3; Type1 требует HDCP2.3. Примечание исходника: текущая версия драйвера фактически не поддерживает этот выбор; по умолчанию достаточно любого успешного уровня, поэтому настройка не требуется. hdcp_encrypted: 0 — аутентификации нет, 1 — HDCP1.4, 2 — HDCP2.3.

<!-- Source EN PDF p.19, block 161 -->

### 5.3 DPTX

<!-- Source EN PDF p.19, block 162 -->

Метод просмотра тот же, что для HDMITX.

<!-- Source EN PDF p.20, block 163 -->

## 6. Разбор распространённых проблем

<!-- Source EN PDF p.20, block 164 -->

### 6.1 Ошибка запуска hdcp2_tx_rx

<!-- Source EN PDF p.20, block 165 -->

Просмотр журнала:

<!-- Source EN PDF p.20, block 166 -->

```text
logcat | grep HDCP
```

<!-- Source EN PDF p.20, block 167 -->

```text
Failed to open firmware file [vendor/firmware/hdcp2_hdmi.fw] // indicating the firmware was
not imported
```

Пояснение: прошивка не была импортирована.

<!-- Source EN PDF p.20, block 168 -->

```text
Failed to open firmware driver /dev/hl_dev1 // indicating the hdcp driver is not loaded. The
DTS needs to enable the corresponding hdcp1 node.
```

Пояснение: драйвер HDCP не загружен; в DTS следует включить соответствующий узел hdcp1.

<!-- Source EN PDF p.20, block 169 -->

```text
07-14 10:53:17.033 2042 2042 D HDCP2 : hdcp2 version v3.0
07-14 10:53:17.033 2042 2042 D HDCP2 : HDCP Port: 1
07-14 10:53:17.034 2042 2042 D HDCP2 : Firmware: [1]
07-14 10:53:17.034 2042 2042 D HDCP2 : 223664 bytes
07-14 10:53:17.034 2042 2042 D HDCP2 : check rx key ok
07-14 10:53:17.034 2042 2042 D HDCP2 : rxkey read from vendor success, rxkey_len = 1000
07-14 10:53:17.034 2042 2042 D HDCP2 : Host Library version V0201
07-14 10:53:17.035 2042 2042 D HDCP2 : Exiting with err=1
```

<!-- Source EN PDF p.20, block 170 -->

Если программа сразу завершается без сообщения об ошибке, её можно запустить вручную для получения подробностей:

<!-- Source EN PDF p.20, block 171 -->

```text
console:/ # ./vendor/bin/hdcp2_tx_rx 1 &
[1] 2799
console:/ # device name = /dev/hl_dev1
<INFO> [external/hdcp/host_library/core_lib/host_lib_core.c:1199] [PID:2799] hlInst->driver->instance [0xee2401d0]
<INFO> [external/hdcp/host_library/core_lib/host_lib_core.c:1200] [PID:2799] hlInst->driver
[0xff8088f0:223664]
<WARN> [external/hdcp/host_library/core_lib/host_lib_core.c:1206] [PID:2799] Error in
file:external/hdcp/host_library/core_lib/host_lib_core.c, functio]
<ERROR> [external/hdcp/host_library/core_lib/host_lib_core.c:137] [PID:2799]
hostlib_init_mem failed
Failed HLC_Initialize, error -6
The logs of this type are caused by firmware packaging issues, which may be due to incorrect
KEY, improper DUK/PKf configuration, or incorrect packaging method. Refer to [HDCP 2.3
Firmware Packaging Instruction].
```

Такие сообщения связаны с упаковкой прошивки: возможны неверный KEY, неправильная настройка DUK/PKf или неверный способ упаковки. См. раздел об упаковке прошивки HDCP 2.3.

<!-- Source EN PDF p.20, block 172 -->

```text
HLC_HDCPRX_LoadRxDwb failed // Indicates RX KEY is incorrect
```

Пояснение: неверный RX KEY.

<!-- Source EN PDF p.21, block 173 -->

### 6.2 Чёрный или зелёный экран HDMIRX, не восстанавливающийся после переподключения

<!-- Source EN PDF p.21, block 175 -->

Сначала проверьте наличие hdcp2x-enable в DTS. Командой `cat /sys/class/misc/hdmirx_hdcp/enable` проверьте, равно ли значение 2.

<!-- Source EN PDF p.21, block 176 -->

Если hdcp2x-enable включён, сервис hdcp2_tx_rx должен быть загружен; иначе возможен чёрный или зелёный экран. Проверьте это командой `logcat | grep HDCP2`.

<!-- Source EN PDF p.21, block 177 -->

Если hdcp2_tx_rx уже загружен, убедитесь, что он не завершился аварийно; также используйте `logcat | grep HDCP2`.

<!-- Source EN PDF p.21, block 178 -->

Если после `echo 0 > /sys/class/misc/hdmirx_hdcp/enable` нормальная работа восстанавливается, это подтверждает описанную проблему.

<!-- Source EN PDF p.21, block 179 -->

### 6.3 Кратковременные артефакты TX при отключении RX, когда HDCP2.3 включён одновременно на HDMITX и HDMIRX

<!-- Source EN PDF p.21, block 180 -->

HDMIRX и HDMITX используют общий контроллер HDCP2.3. Отключение RX во время предварительного просмотра сбрасывает контроллер и вызывает его нештатное состояние. Обнаружив это, hdcp2_tx_rx повторно инициализирует контроллер и выполняет аутентификацию, что вызывает кратковременный артефакт изображения. Исходник рекомендует не включать HDCP2.3 одновременно для TX и RX.

{% endraw %}

