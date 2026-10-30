---
title: "Rockchip Android libhwjpeg: кодирование и декодирование JPEG"
description: "Аппаратные JPEG API, синхронное и асинхронное декодирование, dmaBuffer и полные примеры источника."
excerpt: "Аппаратные JPEG API, синхронное и асинхронное декодирование, dmaBuffer и полные примеры источника."
translation_key: "269-rockchip-android-libhwjpeg"
slug: "269-rockchip-android-libhwjpeg"
lang: "ru"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

## Применимость и источник

Это платформенный справочный материал по китайскому документу RK-SM-YF-E10 V1.0.0 «Rockchip Android Libhwjpeg Interface». Источник указывает Linux 4.19 и 5.10 и «все чипы»; это утверждение источника, а не подтверждение для всех плат ArmSoM. Проверьте наличие соответствующих реализаций и заголовков MPP/libhwjpeg в Android BSP. Аппаратные испытания ArmSoM и выполнение примеров не проводились. Английский PDF и технические иллюстрации отсутствуют.

| Область чипов по источнику | Версии ядра |
| --- | --- |
| Все чипы (формулировка источника; проверьте BSP) | Linux-4.19, Linux-5.10 |

## 1 Обзор

Библиотека libhwjpeg обеспечивает аппаратное кодирование и декодирование JPEG на Rockchip, инкапсулируя JPEG-логику MPP (Media Process Platform). `MpiJpegEncoder` предоставляет интерфейсы кодирования, а `MpiJpegDecoder` — декодирования изображений и потоков MJPEG. Основные каталоги:

- `inc`: заголовки libhwjpeg.
- `src`: реализация.
- `test`: тестовые примеры.

Проект организован с помощью файлов сборки `bp` и собирается непосредственно в среде Android SDK.

## 2 MpiJpegDecoder

`MpiJpegDecoder` инкапсулирует аппаратный декодер JPEG, принимает изображения JPG и потоки MJPEG, поддерживает синхронную и асинхронную работу.

```cpp
decodePacket(char* data, size_t size, OutputFrame_t *frameOut);
decodeFile(const char *inputFile, const char *outputFile);
```

`decodePacket` и `decodeFile` работают синхронно и блокируются до получения результата. `OutputFrame_t` содержит ширину, высоту, физический и виртуальный адреса выходного кадра.

```cpp
sendpacket(char* data, size_t size);
getoutframe(OutputFrame_t *frameOut);
```

`sendpacket` и `getoutframe` совместно обеспечивают асинхронное декодирование. Приложение запускает два потока: первый подаёт данные через `sendpacket`, второй асинхронно получает результат через `getoutframe`.

### Примечания к декодеру

1. По умолчанию выдаются данные RAW NV12.
2. Аппаратный декодер выравнивает выходные YUV-буферы. Перед отображением выделите фактическое изображение по виртуальной ширине и высоте буфера, иначе возможны зелёные края. Внутреннее обрезание libhwjpeg включается свойством ниже.
3. Буфер `OutFrame` инкапсулирует выходной dmaBuffer и повторно используется внутри библиотеки. После отображения кадра освободите его через `deinitOutputFrame`.
4. Обычно используется внутренний циклический пул буферов. Внешний dmaBuffer fd можно передать через `OutputFrame_t->outputPhyAddr` в параметрах `decodePacket`.

```sh
setprop hwjpeg_dec_debug 0x10
```

### Пример декодирования

```cpp
MpiJpegDecoder decoder;
MpiJpegDecoder::OutputFrame_t frameOut;

memset(&frameOut, 0, sizeof(frameOut));

err = decoder.prepareDecoder();
if (!err) {
    ALOGE("failed to prepare JPEG decoder");
    goto cleanUp;
}

err = decoder.decodePacket(data, size, &frameOut);
if (!err) {
    ALOGE("failed to decode packet");
    goto cleanUp;
}

/* TODO - Get diaplay for the frameOut.
 * - frame address: frameOut.MemVirAddr
 * - frame size: frameOut.OutputSize */

/* output buffer count within limits, so release frame buffer if one
frame has been display successfully. */
decoder.deinitOutputFrame(&frameOut);

decoder.flushBuffer();
```

## 3 MpiJpegEncoder

`MpiJpegEncoder` инкапсулирует аппаратное кодирование JPEG. Основные интерфейсы приведены ниже.

```cpp
encodeFrame(char *data, OutputPacket_t *packetOut);
encodeFile(const char *inputFile, const char *outputFile);
```

`encodeFrame` и `encodeFile` выполняют синхронное блокирующее кодирование. `OutputPacket_t` инкапсулирует результат и адреса памяти выходных данных.

```cpp
encode(EncInInfo *inInfo, EncOutInfo *outInfo);
```

Интерфейс `encode` предназначен для cameraHal. Он принимает входные и выходные dmaBuffer fd от вызывающей стороны. JPEG-результат включает закодированную миниатюру, заголовок APP1 EXIF и сопутствующие данные.

Буфер `OutputPacket_t` повторно используется внутри библиотеки. После завершения кодирования освободите результат через `deinitOutputPacket`.

### Пример кодирования

```cpp
MpiJpegEncoder encoder;
MpiJpegEncoder::OutputPacket_t pktOut;

memset(&pktOut, 0, sizeof(pktOut));

err = encoder.prepareEncoder();
if (!err) {
    ALOGE("failed to prepare JPEG encoder");
    goto cleanUp;
}

err = encoder.updateEncodeCfg(
    720 /*width*/, 1080 /*height*/, MpiJpegEncoder::INPUT_FMT_YUV420SP);
if (!err) {
    ALOGE("failed to update encode config");
    goto cleanUp;
}

err = encoder.encodeFrame(data, &pktOut);
if (!err) {
    ALOGE("failed to encode packet");
    goto cleanUp;
}

/* TODO - Get diaplay for the PacketOut.
 * - Pakcet address: pktOut.data
 * - Pakcet size: pktOut.size */

/* output buffer count within limits, so release frame buffer if one
frame has been display successful. */
encoder.deinitOutputPacket(&pktOut);

encoder.flushBuffer();
```

## Вопросы к исходному тексту

В обоих примерах сохранены проверки `if (!err)` и переходы `goto cleanUp`, хотя соглашение о возвращаемых значениях и метка очистки в отрывках не определены. Это фрагменты источника, а не самостоятельные программы. Опечатки `diaplay` и `Pakcet` в комментариях сохранены. Проверьте передачу fd через `OutputFrame_t->outputPhyAddr` по заголовкам используемого SDK; имя поля само по себе не определяет его смысл.

Официальные материалы: [Rockchip MPP](https://github.com/rockchip-linux/mpp), [документация ArmSoM](https://docs.armsom.org/).

{% endraw %}
