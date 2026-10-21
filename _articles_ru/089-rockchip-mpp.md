---
title: "Rockchip MPP: медиаплатформа, API кодеков, память и отладка"
description: "Полная справка MPP V1.4.2: архитектура, MPI, память, декодирование и кодирование, таблицы параметров, примеры, сборка и вопросы с исходными рисунками и кодом."
translation_key: "089-rockchip-mpp"
slug: "089-rockchip-mpp"
lang: "ru"
date: "2026-10-21"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "camera"
products: []
tags: ["Rockchip", "MPP", "MPI", "codec", "Linux"]
keywords: "ArmSoM Rockchip MPP MPI H.264 H.265"
excerpt: "Полная справка MPP V1.4.2: архитектура, MPI, память, декодирование и кодирование, таблицы параметров, примеры, сборка и вопросы с исходными рисунками и кодом."
---

{% raw %}

# Rockchip MPP: медиаплатформа, API кодеков, память и отладка

## Применимость к ArmSoM и источник

Это справка по платформе Rockchip, а не отчёт испытаний ArmSoM. Источник — руководство MPP V1.4.2: 53 страницы на китайском и 57 на английском. Китайская статья следует китайскому оригиналу; английская — английскому, полностью переведённому на русский и немецкий. Китайская версия использует китайские рисунки, английская, русская и немецкая — английские. Ниже сохранены список SoC, среды Android/Linux и функции источника, но сочетание SDK/BSP и ядра для конкретной платы ArmSoM не задано. Проверьте аппаратные кодеки, драйверы ядра, версию MPP, форматы и среду сборки. Все журналы, скорости, частоты кадров и объёмы памяти — примеры оригинала; код не запускался, аппаратных испытаний не было.

Предупреждение редакции: здесь сохранены примеры источника, а не проверенная исполняемая исправленная версия. В оригинале есть расхождения списков платформ/форматов, подозрительные знаки в перечислениях и описания параметров; перед копированием команд и конфигурации сверяйтесь с редакционными примечаниями и реальным SDK.

[EDITORIAL-NOTES](/docs/rockchip-mpp/EDITORIAL-NOTES.md) · [ArmSoM Documentation](https://docs.armsom.org/)


<!-- source: EN PDF p6; unit 0 -->

## 1\. Введение в MPP

<!-- source: EN PDF p6; unit 1 -->

### 1.1 Обзор

<!-- source: EN PDF p6; unit 2 -->

Media Process Platform (MPP) компании Rockchip — универсальная программная платформа обработки мультимедиа для микросхем Rockchip. Она скрывает от приложений сложную низкоуровневую обработку, связанную с конкретным чипом, устраняет различия между платформами и предоставляет единый интерфейс обработки мультимедиа MPI. MPP предоставляет следующие функции:

<!-- source: EN PDF p6; unit 3 -->

Декодирование видео

<!-- source: EN PDF p6; unit 4 -->

H.265/H.264/H.263/AV1/VP9/VP8/AVS2/AVS/AVS+ /MPEG-4/MPEG-2/MPEG-1/VC1/MJPEG

<!-- source: EN PDF p6; unit 5 -->

Кодирование видео

<!-- source: EN PDF p6; unit 6 -->

H.265/H.264/VP8/MJPEG

<!-- source: EN PDF p6; unit 7 -->

Обработка видео

<!-- source: EN PDF p6; unit 8 -->

Копирование и масштабирование видео, преобразование цветового пространства, устранение чересстрочности (Deinterlace)

<!-- source: EN PDF p6; unit 9 -->

### 1.2 Архитектура системы

<!-- source: EN PDF p6; unit 10 -->

Иерархия платформы MPP в архитектуре системы показана ниже:

<!-- source: EN PDF p7; unit 11 -->

![Исходный технический рисунок, английский PDF, страница 7](/docs/rockchip-mpp/assets/en-p007-figure-01.png)

<!-- source: EN PDF p7; unit 12 -->

Рисунок 1. Архитектура системы MPP

<!-- source: EN PDF p7; unit 13 -->

Аппаратный уровень

<!-- source: EN PDF p7; unit 14 -->

Аппаратный уровень содержит ускорители кодирования и декодирования видео платформы Rockchip: vdpu, vepu, rkvdec, rkvenc и другие аппаратные блоки с различными функциями.

<!-- source: EN PDF p7; unit 15 -->

Уровень драйверов ядра

<!-- source: EN PDF p7; unit 16 -->

Драйвер аппаратного кодека в ядре Linux включает драйвер устройства и связанные модули MMU, памяти, тактирования и управления питанием. Основные поддерживаемые версии ядра Linux: 3.10, 4.4, 4.19, 5.10 и 6.1. Библиотеки MPP зависят от драйверов ядра.

<!-- source: EN PDF p7; unit 17 -->

Уровень MPP

<!-- source: EN PDF p7; unit 18 -->

MPP в пространстве пользователя скрывает различия операционных систем и аппаратных платформ и предоставляет верхнему уровню единый интерфейс MPI. Уровень MPP включает модули MPI, OSAL, HAL, Video Decoder / Video Encoder и Video Processing.

<!-- source: EN PDF p7; unit 19 -->

Уровень операционной системы

<!-- source: EN PDF p7; unit 20 -->

Платформы выполнения MPP в пользовательском пространстве: Android и дистрибутивы Linux, например Debian.

<!-- source: EN PDF p7; unit 21 -->

Уровень приложения

<!-- source: EN PDF p7; unit 22 -->

Через MPI уровень MPP может подключаться к промежуточному ПО OpenMax, ffmpeg и gstreamer либо вызываться непосредственно приложением пользователя.

<!-- source: EN PDF p8; unit 23 -->

### 1.3 Поддерживаемые платформы

<!-- source: EN PDF p8; unit 24 -->

#### 1.3.1 Программные платформы

<!-- source: EN PDF p8; unit 25 -->

MPP поддерживает различные версии Android и платформы на чистом Linux.

<!-- source: EN PDF p8; unit 26 -->

Поддерживаются ядра Rockchip Linux 3.10, 4.4, 4.19 и 5.10; необходимы драйвер vcodec_service и соответствующая конфигурация DTS.

<!-- source: EN PDF p8; unit 27 -->

#### 1.3.2 Аппаратные платформы

<!-- source: EN PDF p8; unit 28 -->

Поддерживаются следующие основные семейства микросхем Rockchip:

<!-- source: EN PDF p8; unit 29 -->

Семейства RK3288, RK3368, RK3399, RK3588

<!-- source: EN PDF p8; unit 30 -->

Семейства RK30xx, RK312x, RK322x, RK332x

<!-- source: EN PDF p8; unit 31 -->

Семейства RV1109/RV1126 (примечание: поддержка RV1107/RV1108 постепенно прекращается)

<!-- source: EN PDF p8; unit 32 -->

### 1.4 Поддерживаемые функции

<!-- source: EN PDF p8; unit 33 -->

Возможности кодирования и декодирования MPP существенно различаются между аппаратными платформами. См. Multimedia Benchmark для соответствующего чипа.

<!-- source: EN PDF p8; unit 34 -->

### 1.5 Замечания

<!-- source: EN PDF p8; unit 35 -->

Для быстрого знакомства с использованием MPP и примерами см. главу 4 с описанием демонстрационных программ.

<!-- source: EN PDF p8; unit 36 -->

Для быстрой сборки и использования MPP см. главу 5. Подробности устройства MPP и принципов проектирования приведены в readme.txt в корне исходного кода MPP, текстовых документах каталога doc и комментариях заголовочных файлов.

<!-- source: EN PDF p8; unit 37 -->

## 2\. Проектирование интерфейсов

<!-- source: EN PDF p8; unit 38 -->

В этой главе описаны структуры данных, непосредственно доступные пользователям MPP, и способы их использования.

<!-- source: EN PDF p8; unit 39 -->

Кодирование, декодирование и обработка видео требуют интенсивного обмена потоковыми, кадровыми и буферными данными, а также взаимодействия верхнего приложения с драйвером ядра. Поэтому MPP предоставляет интерфейс MPI для верхнего уровня. Здесь объясняются используемые в MPI структуры данных и принципы их проектирования.

<!-- source: EN PDF p9; unit 40 -->

### 2.1 Обзор структур интерфейса

<!-- source: EN PDF p9; unit 41 -->

Основные структуры данных интерфейса MPI показаны ниже:

<!-- source: EN PDF p9; unit 42 -->

![Исходный технический рисунок, английский PDF, страница 9](/docs/rockchip-mpp/assets/en-p009-figure-01.png)

<!-- source: EN PDF p9; unit 43 -->

Рисунок 2. Структуры данных интерфейса MPI

<!-- source: EN PDF p9; unit 44 -->

MppMem — оболочка над памятью malloc библиотеки C.

<!-- source: EN PDF p9; unit 45 -->

MppBuffer — оболочка над памятью dmabuf для аппаратуры.

<!-- source: EN PDF p9; unit 46 -->

MppPacket представляет одномерный буфер, который может создаваться из MppMem и MapBuffer. Он преимущественно служит для потоковых данных. Имя MapBuffer сохранено из оригинала.

<!-- source: EN PDF p9; unit 47 -->

MppFrame представляет двумерные кадровые данные, которые могут создаваться из MppMem и MapBuffer, и используется преимущественно для изображений. Имя MapBuffer сохранено из оригинала.

<!-- source: EN PDF p9; unit 48 -->

MppPacket и MapFrame позволяют просто и эффективно выполнять обычное кодирование и декодирование видео (MapFrame — написание оригинала).

<!-- source: EN PDF p9; unit 49 -->

Например, при декодировании адрес и размер входного потока задаются в MppPacket. Данные передаются через put_packet, а на выходе через get_frame получается изображение MppFrame. Это простейшая схема декодирования видео.

<!-- source: EN PDF p10; unit 50 -->

![Исходный технический рисунок, английский PDF, страница 10](/docs/rockchip-mpp/assets/en-p010-figure-01.png)

Копируемая транскрипция кода/журнала рисунка (исходный текст сохранён; готовность к запуску не утверждается):

```text
Input thread:

Allocate input stream memory;
Initialize MppPacket pkt;

While (!EOF) {
    Read file to pkt;
    Setup pkt valid length;
    Setup pkt EOS flag;

RESEND_PKT:
    ret = decode_put_packet(pkt);
    IF (ret == NOT_OK)
        Wait and goto RESEND_PKT;
}
Deinitialize pkt;
Release input stream memory;

Output thread:

MppFrame frm;

While (!EOS) {
    ret = decode_get_frame(&frm);
    IF (ret == OK && frm != NULL) {
        Write frm to file or display frm;
        Read EOS flag from frm;
        Release frm;
    }
}
```

<!-- source: EN PDF p10; unit 51 -->

Рисунок 3. Декодирование видео через простой интерфейс

<!-- source: EN PDF p10; unit 52 -->

MppMeta и MPTask — расширенные комбинированные интерфейсы задач ввода/вывода для сложных сценариев, например заданных режимов входа и выхода. Они используются сравнительно редко.

<!-- source: EN PDF p10; unit 53 -->

Примечание: для расширяемости и прямой совместимости перечисленные структуры интерфейса адресуются через void*handle. Доступ к их членам осуществляется функциями наподобие mpp_xxx_set/get_xxx.

<!-- source: EN PDF p10; unit 54 -->

### 2.2 Структура памяти MppBuffer

<!-- source: EN PDF p10; unit 55 -->

MppBuffer описывает блоки памяти для аппаратуры и предоставляет выделение/освобождение памяти, увеличение/уменьшение счётчика ссылок. Поддерживаются аллокаторы ion/drm. Основные параметры:

<!-- source: EN PDF p10; unit 56 -->

| Имя параметра | Тип параметра | Описание |
| --- | --- | --- |
| ptr | void * | Виртуальный адрес блока памяти. |
| size | size_t | Размер блока памяти. |
| fd | int | Файловый дескриптор блока памяти в пользовательском пространстве. |

<!-- source: EN PDF p10; unit 57 -->

При декодировании буферы декодированных кадров обычно повторно используются в фиксированном пуле. Для этого MPP определяет MppBufferGroup на базе MppBuffer. Возможны два следующих варианта использования:

<!-- source: EN PDF p11; unit 58 -->

![Исходный технический рисунок, английский PDF, страница 11](/docs/rockchip-mpp/assets/en-p011-figure-01.png)

<!-- source: EN PDF p11; unit 59 -->

Рисунок 4. Обычное использование MppBuffer

<!-- source: EN PDF p11; unit 60 -->

Псевдокод процесса:

<!-- source: EN PDF p11; unit 61 -->

![Исходный технический рисунок, английский PDF, страница 11](/docs/rockchip-mpp/assets/en-p011-figure-02.png)

Копируемая транскрипция кода/журнала рисунка (исходный текст сохранён; готовность к запуску не утверждается):

```text
MppBuffer normal usage

MppBufferGroup group = NULL;

// Acquire buffer pool and limit buffer size and buffer count
mpp_buffer_group_get_internal(&group, type);
mpp_buffer_group_limit_config(group, size, count);

// Configure buffer pool to decoder, let decoder get buffer from
// buffer pool to decode.
mpi->control(dec, MPP_DEC_SET_EXT_BUF_GROUP, group);

// Start decoding process
while (!end_of_decoding) {
    {   // MPP decoder behave is within brackets.
        // MPP decoder uses buffer data.
        MppBuffer buffer_in_mpp_decoder;
        // Decoder get buffer from buffer pool internally.
        mpp_buffer_get(group, &buffer_in_mpp_decoder);
        // Decode image data to buffer.
        ...
    }
    mpi->decode_get_frame(&frame);
    // Output MppBuffer to external user
    MppBuffer buffer_of_user = mpp_frame_get_buffer(frame);
    // Process to image pixel data
    ......
    // User release reference of MppBuffer and MppFrame
    mpp_buffer_put(buffer_of_user);
    mpp_frame_deinit(frame);
}

// Release buffer pool
mpp_buffer_group_put(group);
```

<!-- source: EN PDF p12; unit 62 -->

Такой способ обеспечивает выход декодера без копирования: выходной кадр совпадает с опорным кадром декодера. Однако реализовать вывод на экран без копирования непросто: выходной кадр может быть непригоден для непосредственного отображения. Пользователь также должен знать требования декодера к объёму памяти.

<!-- source: EN PDF p12; unit 63 -->

Другой вариант — использовать MppBufferGroup только как менеджер внешних импортированных буферов. Схема приведена ниже:

<!-- source: EN PDF p12; unit 64 -->

![Исходный технический рисунок, английский PDF, страница 12](/docs/rockchip-mpp/assets/en-p012-figure-01.png)

<!-- source: EN PDF p12; unit 65 -->

Рисунок 5. Импорт внешней памяти MppBuffer

<!-- source: EN PDF p12; unit 66 -->

Псевдокод процедуры приведён ниже:

<!-- source: EN PDF p13; unit 67 -->

![Исходный технический рисунок, английский PDF, страница 13](/docs/rockchip-mpp/assets/en-p013-figure-01.png)

Копируемая транскрипция кода/журнала рисунка (исходный текст сохранён; готовность к запуску не утверждается):

```text
MppBuffer usage of import external buffer (Zero-copy display)

MppBufferGroup group = NULL;
MppBufferInfo info[16];

// Acquire the buffer pool.
mpp_buffer_group_get_external(&group, type);

// import extern buffer to the buffer pool
mpp_buffer_commit(group, &info[0]);
mpp_buffer_commit(group, &info[1]);
...
...

// Configure buffer pool to decoder let decoder get buffer to
// decode from buffer pool
mpi->control(dec, MPP_DEC_SET_EXT_BUF_GROUP, group);

// Start decoding procedural.
while (!end_of_decoding) {
    {   // MPP decoder behave is within brackets.
        // MPP decoder uses buffer data.
        MppBuffer buffer_in_mpp_decoder;
        // Decoder get buffer from buffer pool internally.
        mpp_buffer_get(group, &buffer_in_mpp_decoder);
        // Decode image data to buffer.
        ...
    }
    mpi->decode_get_frame(&frame);
    // Output MppBuffer to external user
    MppBuffer buffer_of_user = mpp_frame_get_buffer(frame);
    // Process to image pixel data
    ......
    // User release reference of MppBuffer and MppFrame
    mpp_buffer_put(buffer_of_user);
    mpp_frame_deinit(frame);
}

// Release buffer pool
mpp_buffer_group_put(group);
```

<!-- source: EN PDF p13; unit 68 -->

Этот процесс позволяет декодеру использовать внешние буферы, подключаться к OpenMax/ffmpeg/gstreamer и легко интегрироваться в приложение пользователя. Он также упрощает отображение без копирования.

<!-- source: EN PDF p13; unit 69 -->

### 2.3 Структура потока MppPacket

<!-- source: EN PDF p13; unit 70 -->

MppPacket описывает одномерные потоковые данные, прежде всего положение и длину действительных данных. Важные параметры MppPacket приведены ниже:

<!-- source: EN PDF p14; unit 71 -->

| Имя параметра | Тип параметра | Описание |
| --- | --- | --- |
| data | void * | Начальный адрес буферной области. |
| size | size_t | Размер буферной области. |
| pos | void * | Начальный адрес действительных данных в буферной области. |
| length | size_t | Длина действительных данных в буферной области.<br>Если после вызова decode_put_packet длина становится 0, поток пакета потреблён. |

<!-- source: EN PDF p14; unit 72 -->

Связь параметров показана ниже:

<!-- source: EN PDF p14; unit 73 -->

![Исходный технический рисунок, английский PDF, страница 14](/docs/rockchip-mpp/assets/en-p014-figure-01.png)

<!-- source: EN PDF p14; unit 74 -->

Рисунок 6. Важные параметры MppPacket

<!-- source: EN PDF p14; unit 75 -->

Другие параметры конфигурации MppPacket:

<!-- source: EN PDF p14; unit 76 -->

| Имя параметра | Тип параметра | Описание |
| --- | --- | --- |
| pts | RK_U64 | Метка времени показа (Present Time Stamp). |
| dts | RK_U64 | Метка времени декодирования (Decoding Time Stamp). |
| eos | RK_U32 | Флаг конца потока (End Of Stream). |
| buffer | MppBuffer | MppBuffer, связанный с MppPacket. |
| flag | RK_U32 | Флаги, используемые внутри MPP, включая следующие:<br>#define MPP_PACKET_FLAG_EOS (0x00000001)<br>#define MPP_PACKET_FLAG_EXTRA_DATA (0x00000002)<br>#define MPP_PACKET_FLAG_INTERNAL (0x00000004)<br>#define MPP_PACKET_FLAG_INTRA (0x00000008) |

<!-- source: EN PDF p14; unit 77 -->

MppPacket, описывающий одномерную память, должен инициализироваться выделенной памятью или памятью MppBuffer. При освобождении MppPacket возможны следующие случаи:

<!-- source: EN PDF p14; unit 78 -->

Если MppPacket настроен на внешний адрес malloc, эта память не освобождается. Пример:

<!-- source: EN PDF p15; unit 79 -->

![Исходный технический рисунок, английский PDF, страница 15](/docs/rockchip-mpp/assets/en-p015-figure-01.png)

Копируемая транскрипция кода/журнала рисунка (исходный текст сохранён; готовность к запуску не утверждается):

```text
void *data = malloc(size);
MppPacket pkt = NULL;

mpp_packet_init(&pkt, data, size);
mpp_packet_deinit(&pkt); // <<-- NOT release data

free(data);
```

<!-- source: EN PDF p15; unit 80 -->

Если MppPacket создан через copy_init, выделенная при копировании память освобождается после завершения копирования, как сформулировано в оригинале. Пример:

<!-- source: EN PDF p15; unit 81 -->

![Исходный технический рисунок, английский PDF, страница 15](/docs/rockchip-mpp/assets/en-p015-figure-02.png)

Копируемая транскрипция кода/журнала рисунка (исходный текст сохранён; готовность к запуску не утверждается):

```text
void *data = malloc(size);
MppPacket pkt = NULL;
MppPacket pkt_copy = NULL;

mpp_packet_init(&pkt, data, size);
mpp_packet_copy_init(&pkt_copy, pkt);

mpp_packet_deinit(&pkt); // <<-- NOT release data
mpp_packet_deinit(&pkt_copy); // <<-- release allocated memory

free(data);
```

<!-- source: EN PDF p15; unit 82 -->

Если MppPacket создан из MppBuffer, при создании добавляется ссылка на MppBuffer, а при освобождении MppPacket ссылка снимается.

<!-- source: EN PDF p15; unit 83 -->

![Исходный технический рисунок, английский PDF, страница 15](/docs/rockchip-mpp/assets/en-p015-figure-03.png)

Копируемая транскрипция кода/журнала рисунка (исходный текст сохранён; готовность к запуску не утверждается):

```text
MppBuffer buffer;
MppPacket pkt = NULL;

mpp_buffer_get(NULL, &buffer, size);

mpp_packet_init_with_buffer(&pkt, buffer); // <<-- Auto increase reference

mpp_packet_deinit(&pkt); // <<-- Auto decrease reference
mpp_buffer_put(buffer);
```

<!-- source: EN PDF p15; unit 84 -->

### 2.4 Структура изображения MppFrame

<!-- source: EN PDF p15; unit 85 -->

MppFrame задаёт сведения о двумерном буфере изображения, положении и длине действительных данных. Важные параметры MppFrame:

<!-- source: EN PDF p16; unit 86 -->

| Имя параметра | Тип параметра | Описание |
| --- | --- | --- |
| width | RK_U32 | Количество пикселей по горизонтали; единица — пиксель. |
| height | RK_U32 | Количество пикселей по вертикали; единица — пиксель. |
| hor_stride | RK_U32 | Расстояние между двумя соседними строками по вертикали, в байтах. |
| ver_stride | RK_U32 | Количество строк между компонентами изображения; единица — 1. |

<!-- source: EN PDF p16; unit 87 -->

![Исходный технический рисунок, английский PDF, страница 16](/docs/rockchip-mpp/assets/en-p016-figure-01.png)

<!-- source: EN PDF p16; unit 88 -->

Рисунок 7. Важные параметры MppFrame

<!-- source: EN PDF p16; unit 89 -->

Остальные параметры конфигурации MppFrame:

<!-- source: EN PDF p17; unit 90 -->

| Имя параметра | Тип параметра | Описание |
| --- | --- | --- |
| mode | RK_U32 | Свойства кадра/поля данных изображения: |
| pts | RK_U64 | Метка времени показа изображения (Present Time Stamp). |
| dts | RK_U64 | Метка времени декодирования изображения (Decoding Time Stamp). |
| eos | RK_U32 | Флаг конца потока изображения (End Of Stream). |
| errinfo | RK_U32 | Флаг ошибки изображения: содержит ли изображение ошибку декодирования. |
| discard | RK_U32 | Метка отбрасывания изображения. Если зависимости от опорных изображений при декодировании не удовлетворяют требованиям, кадр помечается для отбрасывания без отображения. |
| buf_size | size_t | Размер буфера, который требуется выделить для изображения; зависит от формата изображения и формата декодированных данных. |
| info_change | RK_U32 | Если значение истинно, текущий MppFrame является описательной структурой, отмечающей изменение информации потока: ширины, высоты, шага или формата изображения. Возможные причины info_change:<br>1. Изменение ширины и высоты последовательности изображений.<br>2. Изменение формата последовательности, например с 8 бит на 10 бит.<br>После возникновения info_change пул памяти декодера необходимо выделить заново. |

<!-- source: EN PDF p17; unit 91 -->

![Исходный технический рисунок, английский PDF, страница 17](/docs/rockchip-mpp/assets/en-p017-figure-01.png)

Копируемая транскрипция кода/журнала рисунка (исходный текст сохранён; готовность к запуску не утверждается):

```text
/*
 * bit definition for mode flag in MppFrame
 */
/* progressive frame */
#define MPP_FRAME_FLAG_FRAME          (0x00000000)
/* top field only */
#define MPP_FRAME_FLAG_TOP_FIELD      (0x00000001)
/* bottom field only */
#define MPP_FRAME_FLAG_BOT_FIELD      (0x00000002)
/* paired field */
#define MPP_FRAME_FLAG_PAIRED_FIELD   (MPP_FRAME_FLAG_TOP_FIELD|MPP_FRAME_FLAG_BOT_FIELD)
/* paired field with field order of top first */
#define MPP_FRAME_FLAG_TOP_FIRST      (0x00000004)
/* paired field with field order of bottom first */
#define MPP_FRAME_FLAG_BOT_FIRST      (0x00000008)
/* paired field with unknown field order (MBAFF) */
#define MPP_FRAME_FLAG_DEINTERLACED    (MPP_FRAME_FLAG_TOP_FIRST|MPP_FRAME_FLAG_BOT_FIRST)
#define MPP_FRAME_FLAG_FIELD_ORDER_MASK (0x0000000C)
// for multi-view stream
#define MPP_FRAME_FLAG_VIEW_ID_MASK   (0x000000f0)
```

<!-- source: EN PDF p18; unit 92 -->

| Имя параметра | Тип параметра | Описание |
| --- | --- | --- |
| fmt | MppFrameFormat | Формат цветового пространства и расположение изображения в памяти: |
| color_range | MppFrameColorRange | Диапазон цветового пространства данных изображения:<br>Полный диапазон YUV: 0 ~ 255 (8 бит)<br>Ограниченный диапазон YUV: 16 ~ 235 (8 бит) |
| buffer | MppBuffer | MppBuffer, соответствующий MppFrame. |

<!-- source: EN PDF p18; unit 93 -->

![Исходный технический рисунок, английский PDF, страница 18](/docs/rockchip-mpp/assets/en-p018-figure-01.png)

Копируемая транскрипция кода/журнала рисунка (исходный текст сохранён; готовность к запуску не утверждается):

```text
typedef enum {
    MPP_FMT_YUV420SP       = MPP_FRAME_FMT_YUV,       /* YYYY... UV... (NV12)    */
    /*
     * A rockchip specific pixel format, without gap between pixel against
     * the P010_10LE/P010_10BE
     */
    MPP_FMT_YUV420SP_10BIT,
    MPP_FMT_YUV422SP,                                 /* YYYY... UVUV... (NV24)  */
    MPP_FMT_YUV422SP_10BIT,                            ///< Not part of ABI
    MPP_FMT_YUV420P,                                  /* YYYY... U...V... (I420) */
    MPP_FMT_YUV420SP_VU,                               /* YYYY... VUVUVU... (NV21) */
    MPP_FMT_YUV422P,                                  /* YYYY... UU...VV... (422P) */
    MPP_FMT_YUV422SP_VU,                               /* YYYY... VUVUVU... (NV42) */
    MPP_FMT_YUV422_YUYV,                               /* YUYVYUYV... (YUY2)      */
    MPP_FMT_YUV422_UYVY,                               /* UYVYUYVY... (UYVY)      */
    MPP_FMT_YUV400SP,                                  /* YYYY...                 */
    MPP_FMT_YUV440SP,                                  /* YYYY... UVUV...         */
    MPP_FMT_YUV411SP,                                  /* YYYY... UV...           */
    MPP_FMT_YUV444SP,                                  /* YYYY... UVUVUVUV...     */
    MPP_FMT_YUV_BUTT,
    MPP_FMT_RGB565        = MPP_FRAME_FMT_RGB,         /* 16-bit RGB              */
    MPP_FMT_BGR565,                                    /* 16-bit RGB              */
    MPP_FMT_RGB555,                                    /* 15-bit RGB              */
    MPP_FMT_BGR555,                                    /* 15-bit RGB              */
    MPP_FMT_RGB444,                                    /* 12-bit RGB              */
    MPP_FMT_BGR444,                                    /* 12-bit RGB              */
    MPP_FMT_RGB888,                                    /* 24-bit RGB              */
    MPP_FMT_BGR888,                                    /* 24-bit RGB              */
    MPP_FMT_RGB101010,                                 /* 30-bit RGB              */
    MPP_FMT_BGR101010,                                 /* 30-bit RGB              */
    MPP_FMT_ARGB8888,                                  /* 32-bit RGB              */
    MPP_FMT_ABGR8888,                                  /* 32-bit RGB              */
    MPP_FMT_RGB_BUTT,
    /* similar to I420, but Pixels are grouped in macroblocks of 8x4 size */
    MPP_FMT_YUV420_8Z4    = MPP_FRAME_FMT_COMPLEX,
    /* The end of these formats have a complex layout */
    MPP_FMT_COMPLEX_BUTT,
    MPP_FMT_BUTT         = MPP_FMT_COMPLEX_BUTT,
} ? end MppFrameFormat ? MppFrameFormat;
```

<!-- source: EN PDF p18; unit 94 -->

![Исходный технический рисунок, английский PDF, страница 18](/docs/rockchip-mpp/assets/en-p018-figure-02.png)

Копируемая транскрипция кода/журнала рисунка (исходный текст сохранён; готовность к запуску не утверждается):

```text
/*
 * MPEG vs JPEG YUV range.
 */
typedef enum {
    MPP_FRAME_RANGE_UNSPECIFIED = 0,
    MPP_FRAME_RANGE_MPEG        = 1,    ///< the normal 219*2^(n-8) "MPEG" YUV ranges
    MPP_FRAME_RANGE_JPEG        = 2,    ///< the normal     2^n-1   "JPEG" YUV ranges
    MPP_FRAME_RANGE_NB,                ///< Not part of ABI
} MppFrameColorRange;
```

<!-- source: EN PDF p18; unit 95 -->

Для декодера MppFrame является выходной информационной структурой. Через неё вызывающему коду передаются декодированные данные, включая пиксели, pts, сведения об ошибках и другие параметры. Флаги PTS/DTS и EOS наследуются от соответствующего входного MppPacket.

<!-- source: EN PDF p18; unit 96 -->

При изменении разрешения входного потока в MppFrame устанавливается info_change. Пользователь получает соответствующее событие и должен изменить пул буферов.

<!-- source: EN PDF p18; unit 97 -->

### 2.5 Расширенная структура задачи MppTask

<!-- source: EN PDF p18; unit 98 -->

Если возможностей MppPacket и MppFrame недостаточно, контейнер MppTask позволяет реализовать более сложные требования ввода/вывода. MppTask используется совместно с poll/dequeuer/enqueue. По сравнению с простыми интерфейсами put_packet/get_frame его процесс сложнее и менее эффективен — это цена дополнительной гибкости.

<!-- source: EN PDF p19; unit 99 -->

![Исходный технический рисунок, английский PDF, страница 19](/docs/rockchip-mpp/assets/en-p019-figure-01.png)

<!-- source: EN PDF p19; unit 100 -->

Рисунок 8. Ввод и вывод с MppTask

<!-- source: EN PDF p19; unit 101 -->

MppTask расширяется парами ключ–значение MppMetaKey. Добавление поддерживаемых типов данных позволяет удовлетворять сложным требованиям верхнего уровня. Доступ к данным разных ключей осуществляется функциями mpp_task_meta_set/get_xxx.

<!-- source: EN PDF p19; unit 102 -->

![Исходный технический рисунок, английский PDF, страница 19](/docs/rockchip-mpp/assets/en-p019-figure-02.png)

<!-- source: EN PDF p19; unit 103 -->

Рисунок 9. Типы данных и ключей MppTask

<!-- source: EN PDF p19; unit 104 -->

На практике MppTask сначала получают из входного порта MPP через dequeue, заполняют функциями mpp_task_meta_set_xxx, затем передают в экземпляр MPP через enqueue. Выходной порт работает аналогично, но вместо mpp_task_meta_set_xxx используются mpp_task_meta_get_xxx для извлечения данных из MppTask.

<!-- source: EN PDF p19; unit 105 -->

В настоящее время практический интерфейс кодировщика и интерфейс декодирования MJPEG реализованы через MppTask.

<!-- source: EN PDF p20; unit 106 -->

### 2.6 Контекст экземпляра MppCtx

<!-- source: EN PDF p20; unit 107 -->

MppCtx — дескриптор контекста экземпляра MPP, представляющего декодер или кодировщик. mpp_create создаёт MppCtx и структуру MppApi; mpp_init задаёт тип кодирования/декодирования и формат. Затем контекст используется через decode_xxx/encode_xx либо poll/dequeuer/enqueue. По завершении mpp_destroy уничтожает экземпляр.

<!-- source: EN PDF p20; unit 108 -->

![Исходный технический рисунок, английский PDF, страница 20](/docs/rockchip-mpp/assets/en-p020-figure-01.png)

<!-- source: EN PDF p20; unit 109 -->

Рисунок 10. Использование MppCtx

<!-- source: EN PDF p20; unit 110 -->

### 2.7 Структура API MppApi (MPI)

<!-- source: EN PDF p20; unit 111 -->

MppApi инкапсулирует API MPP. Пользователь реализует видеокодек через указатели функций этой структуры, показанной ниже:

<!-- source: EN PDF p21; unit 112 -->

| Имя параметра | Тип параметра | Описание |
| --- | --- | --- |
| size | RK_U32 | Размер структуры MppApi. |
| version | RK_U32 | Версия структуры MppApi. |
| decode | Указатель на функцию | MPP_RET (*decode)(MppCtx ctx, MppPacket packet, MppFrame<br>*frame)<br>Интерфейс декодирования видео с одновременным вводом и выводом; используется самостоятельно.<br>ctx: контекст экземпляра MPP.<br>packet: входной битовый поток.<br>frame: выходное изображение.<br>Возвращаемое значение: 0 — нормальное завершение, ненулевое значение — код ошибки. |
| decode_put_packet | Указатель на функцию | MPP_RET (*decode_put_packet)(MppCtx ctx, MppPacket packet)<br>Входной интерфейс декодирования видео; используется совместно с decode_get_frame.<br>ctx: контекст экземпляра MPP.<br>packet: входной битовый поток.<br>Возвращаемое значение: 0 — нормальное завершение, поток обработан MPP; ненулевое значение — ошибка, поток не обработан и его необходимо отправить повторно. |
| decode_get_frame | Указатель на функцию | MPP_RET (*decode_get_frame)(MppCtx ctx, MppFrame *frame)<br>Выходной интерфейс декодирования видео; используется совместно с decode_put_packet.<br>ctx: контекст экземпляра MPP.<br>frame: выходное изображение.<br>Возвращаемое значение: 0 означает нормальное выполнение получения выхода; следует проверить, имеет ли указатель frame значение. Ненулевое значение — код ошибки. |
| encode | Указатель на функцию | MPP_RET (*encode)(MppCtx ctx, MppFrame frame, MppPacket<br>*packet)<br>Интерфейс кодирования видео с одновременным вводом и выводом; используется отдельно.<br>ctx: контекст экземпляра MPP.<br>frame: входное изображение.<br>packet: выходной битовый поток.<br>Возвращаемое значение: 0 — нормальное завершение, ненулевое значение — код ошибки. |
| encode_put_frame | Указатель на функцию | MPP_RET (*encode_put_frame)(MppCtx ctx, MppFrame frame)<br>Входной интерфейс кодирования видео; используется совместно с encode_get_packet.<br>ctx: контекст экземпляра MPP.<br>frame: входное изображение.<br>Возвращаемое значение: 0 — нормальное завершение, ненулевое значение — код ошибки. |

<!-- source: EN PDF p22; unit 113 -->

| Имя параметра | Тип параметра | Описание |
| --- | --- | --- |
| encode_get_packet | Указатель на функцию | MPP_RET (*encode_get_packet)(MppCtx ctx, MppPacket *packet)<br>Выходной интерфейс кодирования видео; используется совместно с encode_put_frame.<br>ctx: контекст экземпляра MPP.<br>packet: выходной битовый поток.<br>Возвращаемое значение: 0 — нормальное завершение, ненулевое значение — код ошибки. |
| poll | Указатель на функцию | MPP_RET (*poll)(MppCtx ctx, MppPortType type, MppPollType<br>timeout)<br>Интерфейс опроса порта: проверяет, доступны ли в порте данные для извлечения из очереди.<br>ctx: контекст экземпляра MPP.<br>type: тип порта — входной или выходной.<br>timeout: тайм-аут опроса; -1 — блокирующий опрос, 0 — неблокирующий, положительное значение — тайм-аут в миллисекундах.<br>Возвращаемое значение: 0 — нормальное завершение, данные можно извлечь; ненулевое значение — код ошибки. |
| dequeue | Указатель на функцию | MPP_RET (*dequeue)(MppCtx ctx, MppPortType type, MppTask<br>*task)<br>Интерфейс извлечения из очереди порта получает структуру MppTask из порта.<br>ctx: контекст экземпляра MPP.<br>type: тип порта — входной или выходной.<br>task: MppTask.<br>Возвращаемое значение: 0 — нормальное завершение, ненулевое значение — код ошибки. |
| enqueue | Указатель на функцию | MPP_RET (*enqueue)( MppCtx ctx, MppPortType type, MppTask<br>task)<br>Интерфейс постановки в очередь порта передаёт структуру MppTask в порт.<br>ctx: контекст экземпляра MPP.<br>type: тип порта — входной или выходной.<br>task: MppTask.<br>Возвращаемое значение: 0 — нормальное завершение, ненулевое значение — код ошибки. |
| reset | Указатель на функцию | MPP_RET (*reset)(MppCtx ctx)<br>Интерфейс сброса возвращает внутреннее состояние MppCtx в доступное инициализированное состояние.<br>ПРИМЕЧАНИЕ: reset — блокирующий синхронный интерфейс.<br>ctx: контекст экземпляра MPP.<br>Возвращаемое значение: 0 — нормальное завершение, ненулевое значение — код ошибки. |

<!-- source: EN PDF p23; unit 114 -->

| Имя параметра | Тип параметра | Описание |
| --- | --- | --- |
| control | Указатель на функцию | MPP_RET (*control)(MppCtx ctx, MpiCmd cmd, MppParam<br>param)<br>Интерфейс дополнительных управляющих операций над экземплярами MPP.<br>ctx: контекст экземпляра MPP.<br>cmd: идентификатор команды Mpi, задающий тип управляющей команды.<br>param: параметр команды Mpi, дополнительный параметр управляющей команды.<br>Возвращаемое значение: 0 — нормальное завершение, ненулевое значение — код ошибки. |

<!-- source: EN PDF p23; unit 115 -->

## 3\. Использование интерфейса MPI

<!-- source: EN PDF p23; unit 116 -->

В главе описаны конкретный порядок работы с MPI и необходимые замечания. MPI (Media Process Interface) — пользовательский интерфейс MPP для аппаратного кодирования, декодирования и связанных функций. Он предоставляется через указатели функций в структуре C. Контекст MppCtx и структура MppApi позволяют реализовать декодер и кодировщик.

<!-- source: EN PDF p23; unit 117 -->

![Исходный технический рисунок, английский PDF, страница 23](/docs/rockchip-mpp/assets/en-p023-figure-01.png)

<!-- source: EN PDF p23; unit 118 -->

Рисунок 11. Область интерфейса MPI

<!-- source: EN PDF p24; unit 119 -->

На рисунке mpp_create, mpp_init и mpp_destroy управляют MppCtx. mpp_create также возвращает структуру MppApi. Собственно кодирование и декодирование выполняются через указатели функций MppApi — область в красной рамке. В ней различаются интерфейсы потока кодека put/get_packet/frame и интерфейсы управления и сброса. Далее описаны эти интерфейсы и основные особенности работы кодека.

<!-- source: EN PDF p24; unit 120 -->

### 3.1 Интерфейс потока данных декодера

<!-- source: EN PDF p24; unit 121 -->

Интерфейс декодера принимает поток и выдаёт изображения. Он включает decode_put_packet, decode_get_frame и decode в структуре MppApi и обеспечивает простейший способ декодирования.

<!-- source: EN PDF p24; unit 122 -->

#### 3.1.1 decode_put_packet

<!-- source: EN PDF p24; unit 123 -->

| Определение интерфейса | MPP_RET decode_put_packet(MppCtx ctx, MppPacket packet) |
| --- | --- |
| Входной параметр | ctx: экземпляр декодера MPP; packet: вводимые данные битового потока. |
| Возвращаемый параметр | Код ошибки выполнения. |
| Функция | Передача пакета данных потока в экземпляр декодера MPP ctx. |

<!-- source: EN PDF p24; unit 124 -->

##### 3.1.1.1 Форма входного потока

<!-- source: EN PDF p24; unit 125 -->

На вход MPP подаётся исходный поток без контейнерной информации. Предусмотрены две формы входа:

<!-- source: EN PDF p24; unit 126 -->

1\. Полные кадры

<!-- source: EN PDF p24; unit 127 -->

Данные уже разделены по кадрам: каждый MppPacket, передаваемый в decode_put_packet, содержит ровно один полный кадр. MPP может обрабатывать каждый пакет непосредственно. Это режим MPP по умолчанию.

<!-- source: EN PDF p24; unit 128 -->

2\. Части кадров

<!-- source: EN PDF p24; unit 129 -->

Данные разделены по длине, поэтому нельзя определить, содержит ли отдельный MppPacket ровно один полный кадр. MPP должен выполнять разбиение на кадры внутри. Этот режим поддерживается, но до mpp_init необходимо установить need_split командой MPP_DEC_SET_PARSER_SPLIT_MODE интерфейса control.

<!-- source: EN PDF p24; unit 130 -->

![Исходный технический рисунок, английский PDF, страница 24](/docs/rockchip-mpp/assets/en-p024-figure-01.png)

Копируемая транскрипция кода/журнала рисунка (исходный текст сохранён; готовность к запуску не утверждается):

```text
// NOTE: decoder split mode need to be set before init
RK_U32 need_split = 1;
mpi_cmd = MPP_DEC_SET_PARSER_SPLIT_MODE;
param = &need_split;
ret = mpi->control(ctx, mpi_cmd, param);
if (MPP_OK != ret) {
    mpp_err("mpi->control failed\n");
    goto MPP_TEST_OUT;
}
```

<!-- source: EN PDF p25; unit 131 -->

Тогда MppPacket с частями кадров, поступающие через decode_put_packet, разделяются внутри MPP на кадры и обрабатываются как полнокадровые данные.

<!-- source: EN PDF p25; unit 132 -->

Если перепутать эти два режима, возникают ошибки декодирования потока.

<!-- source: EN PDF p25; unit 133 -->

Полные кадры обрабатываются эффективнее, но перед подачей требуют разбора и разделения потока. Части кадров проще подавать, однако эффективность обработки снижается.

<!-- source: EN PDF p25; unit 134 -->

В mpi_dec_test по умолчанию используется режим частей кадров, а в Rockchip Android SDK — полные кадры. Выбор зависит от сценария приложения и платформы.

<!-- source: EN PDF p25; unit 135 -->

##### 3.1.1.2 Потребление входного потока

<!-- source: EN PDF p25; unit 136 -->

Длина действительных данных MppPacket задаётся length. Если после decode_put_packet поток успешно принят, функция возвращает ноль (MPP_OK), а length обнуляется. Если поток не обработан, возвращается ненулевой код ошибки и length остаётся неизменным.

<!-- source: EN PDF p25; unit 137 -->

##### 3.1.1.3 Режим вызова функции

<!-- source: EN PDF p25; unit 138 -->

decode_put_packet передаёт исходный поток экземпляру MPP. Если экземпляр временно не может принять новые данные, неблокирующая функция сразу возвращает ошибку. Пользователь должен обработать код ошибки, немного подождать и повторно отправить данные, избегая лишних накладных расходов.

<!-- source: EN PDF p25; unit 139 -->

##### 3.1.1.4 Максимальное число буферизованных пакетов

<!-- source: EN PDF p25; unit 140 -->

По умолчанию очередь обработки MPP принимает четыре входных пакета. При слишком быстрой подаче возвращается ошибка; необходимо немного подождать и отправить данные повторно.

<!-- source: EN PDF p25; unit 141 -->

#### 3.1.2 decode_get_frame

<!-- source: EN PDF p25; unit 142 -->

| Определение интерфейса | MPP_RET decode_get_frame(MppCtx ctx, MppFrame *frame) |
| --- | --- |
| Входной параметр | ctx: экземпляр декодера MPP.<br>frame: указатель для получения экземпляров MppFrame. |
| Возвращаемый параметр | Код ошибки выполнения. |
| Функция | Получение описания декодированного кадра из экземпляра декодера MPP ctx. |

<!-- source: EN PDF p25; unit 143 -->

Декодированное изображение описывается MppFrame. Эта же структура служит каналом выходной информации декодера MPP, включая ошибки изображения и изменения его параметров.

<!-- source: EN PDF p26; unit 144 -->

Ошибки выходного изображения

<!-- source: EN PDF p26; unit 145 -->

Поле errinfo показывает наличие ошибки при декодировании изображения. Ненулевой errInfo означает ошибку декодирования соответствующего потока; такое изображение можно отбросить.

<!-- source: EN PDF p26; unit 146 -->

Требования к памяти декодированного изображения

<!-- source: EN PDF p26; unit 147 -->

Декодеру необходима память для пикселей выходного изображения. Пользователь должен предоставить буфер подходящего размера. MPP рассчитывает необходимый объём с учётом чипа и видеоформата и сообщает его через buf_size структуры MppFrame. Выделять память следует согласно buf_size.

<!-- source: EN PDF p26; unit 148 -->

Изменение параметров выходного изображения (Info change)

<!-- source: EN PDF p26; unit 149 -->

При изменении ширины, высоты, формата или битовой глубины потока декодер уведомляет пользователя. Пользователь должен обновить пул памяти декодера, предоставив новые буферы. Порядок выделения и использования памяти описан в разделе о распределении памяти изображения и взаимодействии с пользователем (в оригинале ссылка «3..2»).

<!-- source: EN PDF p26; unit 150 -->

#### 3.1.3 decode

<!-- source: EN PDF p26; unit 151 -->

decode объединяет decode_put_packet и decode_get_frame в один вызов. Внутренняя логика:

<!-- source: EN PDF p26; unit 152 -->

1\. Попытаться получить выходное изображение;

<!-- source: EN PDF p26; unit 153 -->

2\. Если изображение получено, завершить вызов;

<!-- source: EN PDF p26; unit 154 -->

3\. Если поток уже успешно отправлен, завершить вызов;

<!-- source: EN PDF p26; unit 155 -->

4\. Отправить входной поток;

<!-- source: EN PDF p26; unit 156 -->

5\. Проверить успешность отправки и вернуться к шагу 1.

<!-- source: EN PDF p26; unit 157 -->

С точки зрения пользователя decode сначала пытается получить декодированное изображение и при наличии возвращает его в приоритетном порядке. Если готового изображения нет, функция отправляет поток, снова пытается получить изображение и завершается.

<!-- source: EN PDF p26; unit 158 -->

### 3.2 Интерфейс управления декодером

<!-- source: EN PDF p26; unit 159 -->

#### 3.2.1 control

<!-- source: EN PDF p26; unit 160 -->

Перечисление MpiCmd в rk_mpi_cmd.h определяет команды интерфейса control. Команды декодера и процесса декодирования:

<!-- source: EN PDF p27; unit 161 -->

![Исходный технический рисунок, английский PDF, страница 27](/docs/rockchip-mpp/assets/en-p027-figure-01.png)

Копируемая транскрипция кода/журнала рисунка (исходный текст сохранён; готовность к запуску не утверждается):

```text
MPP_DEC_CMD_BASE                 = CMD_MODULE_CODEC | CMD_CTX_ID_DEC,
MPP_DEC_SET_FRAME_INFO,          /* vpu api legacy control for buffer slot dimension init */
MPP_DEC_SET_EXT_BUF_GROUP,       /* IMPORTANT: set external buffer group to mpp decoder */
MPP_DEC_SET_INFO_CHANGE_READY,
MPP_DEC_SET_PRESENT_TIME_ORDER,  /* use input time order for output */
MPP_DEC_SET_PARSER_SPLIT_MODE,   /* Need to setup before init */
MPP_DEC_SET_PARSER_FAST_MODE,    /* Need to setup before init */
MPP_DEC_GET_STREAM_COUNT,
MPP_DEC_GET_VPUMEM_USED_COUNT,
MPP_DEC_SET_VC1_EXTRA_DATA,
MPP_DEC_SET_OUTPUT_FORMAT,
MPP_DEC_SET_DISABLE_ERROR,       /* When set it will disable sw/hw error (H.264 / H.265) */
MPP_DEC_SET_IMMEDIATE_OUT,
MPP_DEC_CMD_END,
```

<!-- source: EN PDF p27; unit 162 -->

MPP_DEC_SET_FRAME_INFO

<!-- source: EN PDF p27; unit 163 -->

Параметр команды — MppFrame. Команда задаёт исходные ширину и высоту декодера. Возвращаемый MppFrame содержит требуемый размер буфера изображения. Обычно вызывается сразу после mpp_init и до decode_put_packet.

<!-- source: EN PDF p27; unit 164 -->

MPP_DEC_SET_EXT_BUF_GROUP

<!-- source: EN PDF p27; unit 165 -->

Параметр — MppBufferGroup, задающий пул буферов декодера. Место вызова зависит от режима выделения памяти изображений.

<!-- source: EN PDF p27; unit 166 -->

MPP_DEC_SET_INFO_CHANGE_READY

<!-- source: EN PDF p27; unit 167 -->

Команда не имеет параметра. Она сообщает, что MppBufferGroup декодера завершил перенастройку после Info change и декодирование можно продолжить. Место вызова зависит от режима выделения памяти.

<!-- source: EN PDF p27; unit 168 -->

MPP_DEC_SET_PRESENT_TIME_ORDER

<!-- source: EN PDF p27; unit 169 -->

Параметр RK_U32* используется для обработки особых случаев временных меток потока.

<!-- source: EN PDF p27; unit 170 -->

MPP_DEC_SET_PARSER_SPLIT_MODE

<!-- source: EN PDF p27; unit 171 -->

Параметр RK_U32* включает внутреннее разбиение на кадры парсером MPP. По умолчанию вход содержит полные кадры и считается уже разделённым. Команду вызывают до mpp_init.

<!-- source: EN PDF p27; unit 172 -->

MPP_DEC_SET_PARSER_FAST_MODE

<!-- source: EN PDF p27; unit 173 -->

Параметр RK_U32* включает быстрый разбор кадров и увеличивает параллелизм аппаратной и программной частей декодера. Побочный эффект — влияние на отметку ошибочного потока, поэтому режим по умолчанию отключён. Вызывать до mpp_init.

<!-- source: EN PDF p27; unit 174 -->

MPP_DEC_GET_STREAM_COUT

<!-- source: EN PDF p27; unit 175 -->

Параметр RK_U32*. Внешние приложения получают число ещё не обработанных пакетов потока. Унаследованный исторический интерфейс.

<!-- source: EN PDF p27; unit 176 -->

MPP_DEC_GET_VPUMEM_USED_COUT

<!-- source: EN PDF p27; unit 177 -->

Параметр RK_U32*. Внешние приложения получают число MppBuffer, используемых MPP. Унаследованный исторический интерфейс.

<!-- source: EN PDF p27; unit 178 -->

MPP_DEC_SET_VC1_EXTRA_DATA

<!-- source: EN PDF p27; unit 179 -->

Ещё не реализован. Унаследованный исторический интерфейс.

<!-- source: EN PDF p27; unit 180 -->

MPP_DEC_SET_OUTPUT_FORMAT

<!-- source: EN PDF p28; unit 181 -->

Параметр MppFrameFormat. Внешнее приложение задаёт выходной формат изображения JPEG-декодера. По умолчанию не используется.

<!-- source: EN PDF p28; unit 182 -->

MPP_DEC_SET_DISABLE_ERROR

<!-- source: EN PDF p28; unit 183 -->

Параметр RK_U32* отключает обработку ошибок декодером MPP. После включения декодер игнорирует признаки ошибок потока, выдаёт все декодируемые изображения и не устанавливает errinfo в выходном MppFrame. Вызывать до decode_put_packet.

<!-- source: EN PDF p28; unit 184 -->

MPP_DEC_SET_IMMEDIATE_OUT

<!-- source: EN PDF p28; unit 185 -->

Параметр RK_U32* включает немедленный вывод H.264. Декодер игнорирует разрывы последовательности из-за пропусков кадров или picture order count и сразу выдаёт текущее декодированное изображение. Вызывать до decode_put_packet.

<!-- source: EN PDF p28; unit 186 -->

MPP_DEC_SET_ENABLE_FAST_PLAY

<!-- source: EN PDF p28; unit 187 -->

Параметр FastPlayMode* включает быстрый старт H.264 без ожидания заполнения dpb. Если текущий кадр декодируется после I-кадра, но должен отображаться до него, возможна потеря кадров. Вызывать до decode_put_packet.

<!-- source: EN PDF p28; unit 188 -->

#### 3.2.2 reset

<!-- source: EN PDF p28; unit 189 -->

reset возвращает декодер в состояние после нормальной инициализации.

<!-- source: EN PDF p28; unit 190 -->

После передачи последнего пакета MppPacket с признаком EOS декодер обрабатывает его и переходит в EOS, прекращая приём и обработку потока. Приём нового потока возможен только после сброса.

<!-- source: EN PDF p28; unit 191 -->

### 3.3 Основные особенности использования декодера

<!-- source: EN PDF p28; unit 192 -->

При использовании декодера необходимо учитывать следующее:

<!-- source: EN PDF p28; unit 193 -->

#### 3.3.1 Одно- и многопоточное использование декодера

<!-- source: EN PDF p28; unit 194 -->

MPI декодера MPP потокобезопасен и допускает многопоточную работу. Однопоточный режим показан в mpi_dec_test, многопоточный — в mpi_dec_mt_test.

<!-- source: EN PDF p29; unit 195 -->

![Исходный технический рисунок, английский PDF, страница 29](/docs/rockchip-mpp/assets/en-p029-figure-01.png)

<!-- source: EN PDF p29; unit 196 -->

![Исходный технический рисунок, английский PDF, страница 29](/docs/rockchip-mpp/assets/en-p029-figure-02.png)

<!-- source: EN PDF p29; unit 197 -->

Рисунок 12. Одно- и многопоточное использование декодера

<!-- source: EN PDF p29; unit 198 -->

#### 3.3.2 Выделение памяти изображений и взаимодействие с пользователем

<!-- source: EN PDF p29; unit 199 -->

Для записи пикселей декодер получает память, после декодирования передаёт её пользователю, а после использования пользователь возвращает её декодеру. При закрытии декодера вся память освобождается. Такой порядок позволяет взаимодействовать без копирования. MPP поддерживает три режима выделения памяти и взаимодействия с пользователем:

<!-- source: EN PDF p29; unit 200 -->

##### 3.3.2.1 Режим 1: полностью внутреннее выделение памяти

<!-- source: EN PDF p29; unit 201 -->

Память изображения выделяется непосредственно декодером MPP. Пользователь получает выходное изображение декодера и освобождает его сразу после использования.

<!-- source: EN PDF p30; unit 202 -->

![Исходный технический рисунок, английский PDF, страница 30](/docs/rockchip-mpp/assets/en-p030-figure-01.png)

<!-- source: EN PDF p30; unit 203 -->

Рисунок 13. Схема полностью внутреннего выделения памяти

<!-- source: EN PDF p30; unit 204 -->

В этом режиме пользователю не требуется вызывать команду MPP_DEC_SET_EXT_BUF_GROUP интерфейса управления декодером. Когда декодер сообщает об info change, достаточно непосредственно вызвать команду MPP_DEC_SET_INFO_CHANGE_READY интерфейса управления.

<!-- source: EN PDF p30; unit 205 -->

Декодер автоматически выделяет память внутри себя, а пользователь должен непосредственно освобождать полученные данные каждого кадра.

<!-- source: EN PDF p30; unit 206 -->

![Исходный технический рисунок, английский PDF, страница 30](/docs/rockchip-mpp/assets/en-p030-figure-02.png)

<!-- source: EN PDF p30; unit 207 -->

Рисунок 14. Последовательность вызовов при полностью внутреннем выделении памяти изображений декодера

<!-- source: EN PDF p30; unit 208 -->

Преимущество:

<!-- source: EN PDF p30; unit 209 -->

Процедура проста. Можно быстро подготовить демонстрационный пример для оценки производительности декодера. Недостатки:

<!-- source: EN PDF p30; unit 210 -->

1\. Память выделяется внутри декодера. Если к моменту уничтожения декодера она не освобождена, возможна утечка памяти или аварийное завершение.

<!-- source: EN PDF p30; unit 211 -->

2\. Невозможно контролировать потребление памяти декодером: он может использовать её без ограничений. При быстрой подаче битового потока и несвоевременном освобождении пользователем памяти декодированных изображений декодер быстро израсходует всю доступную память.

<!-- source: EN PDF p30; unit 212 -->

3\. Реализовать вывод без копирования сложно, поскольку память выделяется внутри декодера и может быть несовместима с системой отображения пользователя.

<!-- source: EN PDF p30; unit 213 -->

##### 3.3.2.2 Режим 2: частично внутреннее выделение памяти

<!-- source: EN PDF p30; unit 214 -->

Этот режим по умолчанию используется в примере mpi_dec_test. Пользователь должен создать MppBufferGroup согласно buf_size объекта MppFrame, возвращённого get_frame, и передать группу декодеру через MPP_DEC_SET_EXT_BUF_GROUP интерфейса управления. Ограничить потребление памяти декодером можно через интерфейс mpp_buffer_group_limit_config.

<!-- source: EN PDF p31; unit 215 -->

![Исходный технический рисунок, английский PDF, страница 31](/docs/rockchip-mpp/assets/en-p031-figure-01.png)

<!-- source: EN PDF p31; unit 216 -->

Рисунок 15. Рабочий процесс декодера при частично внутреннем выделении памяти

<!-- source: EN PDF p31; unit 217 -->

Преимущество:

<!-- source: EN PDF p31; unit 218 -->

Процедура проста и понятна; потребление памяти можно в определённой степени ограничить. Недостатки:

<!-- source: EN PDF p31; unit 219 -->

1\. Ограничение объёма памяти неточно. Использование памяти не фиксировано строго на 100% и будет колебаться.

<!-- source: EN PDF p31; unit 220 -->

2\. Вывод без копирования также сложно реализовать.

<!-- source: EN PDF p31; unit 221 -->

##### 3.3.2.3 Режим 3: полностью внешнее выделение памяти

<!-- source: EN PDF p31; unit 222 -->

В этом режиме создаётся пустая MppBufferGroup внешнего режима, через которую декодер импортирует от пользователя файловые дескрипторы памяти внешнего распределителя, обычно dmabuf/ion/drm. На Android Mediaserver получает память отображения у SurfaceFlinger через gralloc, передаёт полученные gralloc файловые дескрипторы в MppBufferGroup и задаёт эту группу декодеру командой MPP_DEC_SET_EXT_BUF_GROUP интерфейса управления. После этого декодер MPP повторно использует память, полученную через gralloc.

<!-- source: EN PDF p31; unit 223 -->

![Исходный технический рисунок, английский PDF, страница 31](/docs/rockchip-mpp/assets/en-p031-figure-02.png)

<!-- source: EN PDF p31; unit 224 -->

Рисунок 16. Схема полностью внешнего выделения памяти

<!-- source: EN PDF p32; unit 225 -->

![Исходный технический рисунок, английский PDF, страница 32](/docs/rockchip-mpp/assets/en-p032-figure-01.png)

<!-- source: EN PDF p32; unit 226 -->

Рисунок 17. Рабочий процесс декодера при полностью внешнем выделении памяти

<!-- source: EN PDF p32; unit 227 -->

Преимущество:

<!-- source: EN PDF p32; unit 228 -->

Непосредственное использование памяти внешней системы отображения облегчает реализацию работы без копирования. Недостатки:

<!-- source: EN PDF p32; unit 229 -->

1\. Этот режим сложно понять и использовать.

<!-- source: EN PDF p32; unit 230 -->

2\. Требуются изменения пользовательской программы. Рабочий процесс некоторых программ ограничивает возможность использования полностью внешнего выделения памяти.

<!-- source: EN PDF p32; unit 231 -->

Замечания по использованию полностью внешнего выделения памяти:

<!-- source: EN PDF p32; unit 232 -->

1\. Если пул памяти изображений создаётся раньше декодера, необходим дополнительный способ определения размера памяти изображения.

<!-- source: EN PDF p32; unit 233 -->

Общий расчёт памяти изображения YUV420: данные пикселей изображения — hor_stride * ver_stride * 3 / 2; дополнительная информация — hor_stride * ver_stride / 2.

<!-- source: EN PDF p32; unit 234 -->

2\. Число блоков памяти должно учитывать требования и декодирования, и отображения. В английском оригинале буквально сказано: если блоков «достаточно» (enough), декодер может зависнуть. Это подозрительное противоречие сохранено для проверки; вероятную недостающую отрицательную частицу нельзя считать подтверждённым исправлением.

<!-- source: EN PDF p32; unit 235 -->

Для H.264/H.265 с большим числом опорных кадров требуется 20+ блоков памяти, чтобы гарантировать декодирование. Для остальных протоколов требуется 10+ блоков.

<!-- source: EN PDF p32; unit 236 -->

3\. Если при декодировании битового потока возникает info change, существующую MppBufferGroup необходимо сбросить. Следует передать новые буферы памяти изображений и соответствующим образом настроить внешнюю систему отображения.

<!-- source: EN PDF p33; unit 237 -->

### 3.4 Интерфейс потока данных кодера

<!-- source: EN PDF p33; unit 238 -->

Интерфейс кодера предоставляет функции ввода изображений и вывода битового потока: encode_put_frame, encode_get_packet и encode в структуре MppApi. Этот набор обеспечивает базовое кодирование, а интерфейс управления позволяет настраивать кодер.

<!-- source: EN PDF p33; unit 239 -->

#### 3.4.1 encode_put_frame

<!-- source: EN PDF p33; unit 240 -->

| Определение интерфейса | MPP_RET encode_put_frame(MppCtx ctx, MppFrame frame) |
| --- | --- |
| Входной параметр | ctx: экземпляр декодера MPP.<br>,frame: вводимые данные изображения. |
| Возвращаемый параметр | Код ошибки выполнения. |
| Функция | Передача данных изображения кадра в экземпляр кодера MPP, указанный ctx. |

<!-- source: EN PDF p33; unit 241 -->

##### 3.4.1.1 Режим работы функции

<!-- source: EN PDF p33; unit 242 -->

Входное изображение кодера обычно очень велико, поэтому его копирование значительно снижает эффективность. Следовательно, функция ввода должна дождаться, пока аппаратный кодер закончит использовать память входного изображения, и только затем вернуться. Использованное изображение возвращается вызывающей стороне. Поэтому encode_put_frame — блокирующая функция: вызов блокируется до окончания использования входного изображения. Это в определённой степени препятствует параллельной работе программной и аппаратной частей и снижает эффективность.

<!-- source: EN PDF p33; unit 243 -->

##### 3.4.1.2 Ввод с копированием и без копирования

<!-- source: EN PDF p33; unit 244 -->

Вход кодера не поддерживает память, выделенную CPU. Для использования адреса памяти, выделенной CPU, необходимо выделить MppBuffer и скопировать в него данные, что значительно снижает эффективность. Для входа кодера предпочтительна память dmabuf/ion/drm: она позволяет кодировать без копирования с минимальными накладными расходами.

<!-- source: EN PDF p34; unit 245 -->

#### 3.4.2 encode_get_packet

<!-- source: EN PDF p34; unit 246 -->

| Определение интерфейса | MPP_RET encode_get_packet(MppCtx ctx, MppPacket *packet) |
| --- | --- |
| Входной параметр | ctx: экземпляр декодера MPP.<br>,packet: указатель для получения экземпляра MppPacket. |
| Возвращаемый параметр | Режим ошибки выполнения. |
| Функция | Получение описания пакета завершённого кодирования из экземпляра кодера MPP, указанного ctx. |

<!-- source: EN PDF p34; unit 247 -->

##### 3.4.2.1 Заголовочная информация и данные изображения

<!-- source: EN PDF p34; unit 248 -->

На примере H.264 выход кодера делится на поток заголовочной информации (sps/pps) и поток данных изображения (I/P slice). Заголовки получают командой MPP_ENC_GET_EXTRA_INFO интерфейса управления, а данные изображения — через encode_get_packet. Заголовочную информацию следует запрашивать после завершения команд настройки параметров SET_RC_CFG/SET_PREP_CFG/SET_CODEC_CFG интерфейса управления. При вызове команды настройки кодер обновляет параметры; после завершения обновления актуальные заголовки можно получить вызовом следующей команды:

<!-- source: EN PDF p34; unit 249 -->

MPP_ENC_GET_EXTRA_INFO

<!-- source: EN PDF p34; unit 250 -->

##### 3.4.2.2 Формат выходного потока кодера H.264

<!-- source: EN PDF p34; unit 251 -->

В описываемой реализации аппаратная часть выдаёт поток с фиксированным стартовым кодом 00 00 00 01, поэтому encode_get_packet возвращает поток с этим стартовым кодом 00 00 00 01. Чтобы убрать стартовый код, можно копировать данные начиная с адреса сразу после него.

<!-- source: EN PDF p34; unit 252 -->

##### 3.4.2.3 Данные битового потока без копирования

<!-- source: EN PDF p34; unit 253 -->

При использовании encode_put_frame и encode_get_packet выходной буфер настроить невозможно, поэтому encode_get_packet выполняет копирование. Обычно выходной поток кодера невелик по сравнению с входным изображением, и копирование битового потока допустимо. Если нужен интерфейс без копирования, следует использовать enqueue/dequeue и структуру MppTask.

<!-- source: EN PDF p34; unit 254 -->

#### 3.4.3 encode

<!-- source: EN PDF p34; unit 255 -->

Пока не реализовано.

<!-- source: EN PDF p35; unit 256 -->

### 3.5 Интерфейс управления кодером

<!-- source: EN PDF p35; unit 257 -->

Кодеры отличаются от декодеров и требуют настройки определённых параметров пользователем. До начала кодирования пользователь должен задать конфигурацию кодера через интерфейс управления.

<!-- source: EN PDF p35; unit 258 -->

#### 3.5.1 Управление и MppEncCfg

<!-- source: EN PDF p35; unit 259 -->

MPP рекомендует настраивать кодер с помощью инкапсулированной структуры MppEncCfg через команды MPP_ENC_SET_CFG/MPP_ENC_GET_CFG интерфейса управления.

<!-- source: EN PDF p35; unit 260 -->

Из-за множества настраиваемых возможностей и параметров кодера применение фиксированных структур ведёт к частым изменениям структуры интерфейса. В результате невозможно гарантировать двоичную совместимость, усложняется управление версиями и существенно возрастают затраты на сопровождение.

<!-- source: EN PDF p35; unit 261 -->

Для смягчения этой проблемы MppEncCfg использует тип (void *) и конфигурацию сопоставления ключей &lt;string-value&gt;. Функциональные интерфейсы разделены по типам s32/u32/s64/u64/ptr/st; соответствующие функции образуют две группы — set и get, как показано далее:

<!-- source: EN PDF p35; unit 262 -->

```text
MPP_RET mpp_enc_cfg_set_s32(MppEncCfg cfg, const char *name, RK_S32 val);
MPP_RET mpp_enc_cfg_set_u32(MppEncCfg cfg, const char *name, RK_U32 val);
MPP_RET mpp_enc_cfg_set_s64(MppEncCfg cfg, const char *name, RK_S64 val);
MPP_RET mpp_enc_cfg_set_u64(MppEncCfg cfg, const char *name, RK_U64 val);
MPP_RET mpp_enc_cfg_set_ptr(MppEncCfg cfg, const char *name, void *val);
MPP_RET mpp_enc_cfg_set_st(MppEncCfg cfg, const char *name, void *val);

MPP_RET mpp_enc_cfg_get_s32(MppEncCfg cfg, const char *name, RK_S32 *val);
MPP_RET mpp_enc_cfg_get_u32(MppEncCfg cfg, const char *name, RK_U32 *val);
MPP_RET mpp_enc_cfg_get_s64(MppEncCfg cfg, const char *name, RK_S64 *val);
MPP_RET mpp_enc_cfg_get_u64(MppEncCfg cfg, const char *name, RK_U64 *val);
MPP_RET mpp_enc_cfg_get_ptr(MppEncCfg cfg, const char *name, void **val);
MPP_RET mpp_enc_cfg_get_st(MppEncCfg cfg, const char *name, void *val);
```

<!-- source: EN PDF p35; unit 263 -->

Строка обычно задаётся в формате [type:parameter]. Поддерживаемые строки и типы параметров перечислены далее:

<!-- source: EN PDF p36; unit 264 -->

| Строка параметра | Интерфейс | Фактический тип | Описание |
| --- | --- | --- | --- |
| rc:mode | S32 | MppEncRcMode | Режим управления битрейтом; в настоящее время поддерживаются CBR и VBR:<br>CBR — Constant Bit Rate, режим постоянного битрейта. Определяющее значение имеет целевой битрейт.<br>VBR — Variable Bit Rate, режим переменного битрейта. Определяющее значение имеют максимальный и минимальный битрейты.<br>FIX_QP — режим фиксированного QP для отладки и оценки производительности. |
| rc:bps_target | S32 | RK_S32 | Целевой битрейт в режиме CBR. |
| rc:bps_max | S32 | RK_S32 | Наибольший битрейт в режиме VBR. |
| rc:bps_min | S32 | RK_S32 | Наименьший битрейт в режиме VBR. |
| rc:fps_in_flex | S32 | RK_S32 | Флаг переменной входной частоты кадров. По умолчанию 0.<br>0: входная частота фиксирована и вычисляется как fps_in_num/fps_in_denom, что позволяет задать дробную частоту.<br>1: входная частота переменная; частота не фиксирована, а расчёт и распределение битрейта выполняются по фактическому времени. |
| rc:fps_in_flex | S32 | RK_S32 | Флаг переменной входной частоты кадров. По умолчанию 0.<br>0: входная частота фиксирована и вычисляется как fps_in_num/fps_in_denom, что позволяет задать дробную частоту.<br>1: входная частота переменная; частота не фиксирована, а расчёт и распределение битрейта выполняются по фактическому времени. |
| rc:fps_in_num | S32 | RK_S32 | Числитель дробного значения входной частоты кадров; например, 0 означает стандартные 30fps. |
| rc:fps_in_denom | S32 | RK_S32 | Знаменатель дробного значения входной частоты кадров. Если 0, используется 1. |

<!-- source: EN PDF p36; unit 265 -->

![Исходный технический рисунок, английский PDF, страница 36](/docs/rockchip-mpp/assets/en-p036-figure-01.png)

Копируемая транскрипция кода/журнала рисунка (исходный текст сохранён; готовность к запуску не утверждается):

```text
typedef enum MppEncRcMode_e {
    MPP_ENC_RC_MODE_VBR,
    MPP_ENC_RC_MODE_CBR,
    MPP_ENC_RC_MODE_FIXQP,
    MPP_ENC_RC_MODE_AVBR,
    MPP_ENC_RC_MODE_BUTT
} MppEncRcMode;
```

<!-- source: EN PDF p37; unit 266 -->

| Строка параметра | Интерфейс | Фактический тип | Описание |
| --- | --- | --- | --- |
| rc:fps_out_flex | S32 | RK_S32 | Флаг переменной выходной частоты кадров. По умолчанию 0.<br>0: выходная частота фиксирована и вычисляется как fps_out_num/fps_out_denom, что позволяет задать дробную частоту.<br>1: выходная частота переменная; частота не фиксирована, а время выдачи соответствующего битового потока вычисляется по фактическому времени. |
| rc:fps_out_num | S32 | RK_S32 | Числитель дробного значения выходной частоты кадров; например, 0 означает стандартные 30fps. |
| rc:fps_out_denom | S32 | RK_S32 | Знаменатель дробного значения выходной частоты кадров. Если 0, используется 1. |
| rc:gop |  | RK_S32 | Group Of Picture — интервал между двумя I-кадрами:<br>0 — только один I-кадр, остальные кадры P.<br>1 — все кадры I.<br>2 — последовательность I P I P I P...<br>3 — последовательность I P P I P P I P P...<br>Обычно gop выбирают целым кратным входной частоты кадров. |
| rc:max_reenc_times | U32 | RK_U32 | Максимальное число повторных кодирований одного кадра. |
| prep:width | S32 | RK_S32 | Число пикселей входного изображения по горизонтали; единица — пиксель. |
| prep:height | S32 | RK_S32 | Число пикселей входного изображения по вертикали; единица — пиксель. |
| prep:hor_stride | S32 | RK_S32 | Расстояние между двумя соседними строками входного изображения по вертикали, в байтах. |
| prep:ver_stride | S32 | RK_S32 | Количество строк между компонентами входного изображения; единица — 1. |

<!-- source: EN PDF p38; unit 267 -->

| Строка параметра | Интерфейс | Фактический тип | Описание |
| --- | --- | --- | --- |
| prep:format | S32 | MppFrameFormat | Формат цветового пространства и размещение входного изображения в памяти. |
| prep:color | S32 | MppFrameColorSpace | Диапазон цветового пространства данных входного изображения. |
| prep:range | S32 | MppFrameColorRange | Полный или ограниченный диапазон входного изображения. |
| prep:rotation | S32 | MppEncRotationCfg | Свойство поворота входного изображения; по умолчанию 0 — без поворота. |
| prep:mirroring | S32 | RK_S32 | Свойство зеркального отображения входного изображения; по умолчанию зеркальное отображение отключено. |

<!-- source: EN PDF p38; unit 268 -->

![Исходный технический рисунок, английский PDF, страница 38](/docs/rockchip-mpp/assets/en-p038-figure-01.png)

Копируемая транскрипция кода/журнала рисунка (исходный текст сохранён; готовность к запуску не утверждается):

```text
typedef enum {
    MPP_FMT_YUV420SP       = (MPP_FRAME_FMT_YUV + 0),  /* YYYY... UV... (NV12)       */
    /*
     * A rockchip specific pixel format, without gap between pixel against
     * the P010_10LE/P010_10BE
     */
    MPP_FMT_YUV420SP_10BIT = (MPP_FRAME_FMT_YUV + 1),
    MPP_FMT_YUV422SP       = (MPP_FRAME_FMT_YUV + 2),  /* YYYY... UVUV... (NV16)     */
    MPP_FMT_YUV422SP_10BIT = (MPP_FRAME_FMT_YUV + 3),  ///< Not part of ABI
    MPP_FMT_YUV420P        = (MPP_FRAME_FMT_YUV + 4),  /* YYYY... U...V... (I420)    */
    MPP_FMT_YUV420SP_VU    = (MPP_FRAME_FMT_YUV + 5),  /* YYYY... VUVUVU... (NV21)   */
    MPP_FMT_YUV422P        = (MPP_FRAME_FMT_YUV + 6),  /* YYYY... UUU...VVV... (422P) */
    MPP_FMT_YUV422SP_VU    = (MPP_FRAME_FMT_YUV + 7),  /* YYYY... VUVUVU... (NV61)   */
    MPP_FMT_YUV422_YUYV    = (MPP_FRAME_FMT_YUV + 8),  /* YUYVYUYV... (YUY2)        */
    MPP_FMT_YUV422_UYVY    = (MPP_FRAME_FMT_YUV + 9),  /* UYVYUYVY... (UYVY)        */
    MPP_FMT_YUV422_YVYU    = (MPP_FRAME_FMT_YUV + 10), /* YVYUYVYU... (YVYU)        */
    MPP_FMT_YUV422_VYUY    = (MPP_FRAME_FMT_YUV + 11), /* VYUYVYUY... (VYUY)        */
    MPP_FMT_YUV400         = (MPP_FRAME_FMT_YUV + 12), /* YYYY...                   */
    MPP_FMT_YUV440SP       = (MPP_FRAME_FMT_YUV + 13), /* YYYY... UVUV...           */
    MPP_FMT_YUV411SP       = (MPP_FRAME_FMT_YUV + 14), /* YYYY... UV...             */
    MPP_FMT_YUV444SP       = (MPP_FRAME_FMT_YUV + 15), /* YYYY... UVUVUVUV...       */
    MPP_FMT_YUV444P        = (MPP_FRAME_FMT_YUV + 16), /* YYYY... UUUU... VVVV...   */
    MPP_FMT_YUV_BUTT,

    MPP_FMT_RGB565         = (MPP_FRAME_FMT_RGB + 0),  /* 16-bit RGB */
    MPP_FMT_BGR565         = (MPP_FRAME_FMT_RGB + 1),  /* 16-bit RGB */
    MPP_FMT_RGB555         = (MPP_FRAME_FMT_RGB + 2),  /* 15-bit RGB */
    MPP_FMT_BGR555         = (MPP_FRAME_FMT_RGB + 3),  /* 15-bit RGB */
    MPP_FMT_RGB444         = (MPP_FRAME_FMT_RGB + 4),  /* 12-bit RGB */
    MPP_FMT_BGR444         = (MPP_FRAME_FMT_RGB + 5),  /* 12-bit RGB */
    MPP_FMT_RGB888         = (MPP_FRAME_FMT_RGB + 6),  /* 24-bit RGB */
    MPP_FMT_BGR888         = (MPP_FRAME_FMT_RGB + 7),  /* 24-bit RGB */
    MPP_FMT_RGB101010      = (MPP_FRAME_FMT_RGB + 8),  /* 30-bit RGB */
    MPP_FMT_BGR101010      = (MPP_FRAME_FMT_RGB + 9),  /* 30-bit RGB */
    MPP_FMT_ARGB8888       = (MPP_FRAME_FMT_RGB + 10), /* 32-bit RGB */
    MPP_FMT_ABGR8888       = (MPP_FRAME_FMT_RGB + 11), /* 32-bit RGB */
    MPP_FMT_BGRA8888       = (MPP_FRAME_FMT_RGB + 12), /* 32-bit RGB */
    MPP_FMT_RGBA8888       = (MPP_FRAME_FMT_RGB + 13), /* 32-bit RGB */
    MPP_FMT_RGB_BUTT,

    MPP_FMT_BUTT,
} MppFrameFormat;
```

<!-- source: EN PDF p38; unit 269 -->

![Исходный технический рисунок, английский PDF, страница 38](/docs/rockchip-mpp/assets/en-p038-figure-02.png)

Копируемая транскрипция кода/журнала рисунка (исходный текст сохранён; готовность к запуску не утверждается):

```text
/*
 * MPEG vs JPEG YUV range.
 */
typedef enum {
    MPP_FRAME_RANGE_UNSPECIFIED = 0,
    MPP_FRAME_RANGE_MPEG        = 1,    ///< the normal 219*2^(n-8) "MPEG" YUV ranges
    MPP_FRAME_RANGE_JPEG        = 2,    ///< the normal     2^n-1   "JPEG" YUV ranges
    MPP_FRAME_RANGE_NB,                ///< Not part of ABI
} MppFrameColorRange;
```

<!-- source: EN PDF p38; unit 270 -->

![Исходный технический рисунок, английский PDF, страница 38](/docs/rockchip-mpp/assets/en-p038-figure-03.png)

Копируемая транскрипция кода/журнала рисунка (исходный текст сохранён; готовность к запуску не утверждается):

```text
/*
 * input frame rotation parameter
 * 0 - disable rotation
 * 1 - 90 degree
 * 2 - 180 degree
 * 3 - 270 degree
 */
typedef enum MppEncRotationCfg_t {
    MPP_ENC_ROT_0,
    MPP_ENC_ROT_90,
    MPP_ENC_ROT_180,
    MPP_ENC_ROT_270,
    MPP_ENC_ROT_BUTT
} MppEncRotationCfg;
```

<!-- source: EN PDF p38; unit 271 -->

![Исходный технический рисунок, английский PDF, страница 38](/docs/rockchip-mpp/assets/en-p038-figure-04.png)

Копируемая транскрипция кода/журнала рисунка (исходный текст сохранён; готовность к запуску не утверждается):

```text
/*
 * input frame mirroring parameter
 * 0 - disable mirroring
 * 1 - horizontal mirroring
 * 2 - vertical mirroring
 */
```

<!-- source: EN PDF p39; unit 272 -->

| Строка параметра | Интерфейс | Фактический тип | Описание |
| --- | --- | --- | --- |
| codec:type | S32 | MppCodingType | Тип протокола, соответствующий MppEncCodecCfg; должен совпадать с параметрами функции инициализации MppCtx mpp_init. |
| h264:stream_type | S32 | RK_S32 | Тип формата входного потока H.264; по умолчанию 0.<br>0 — формат Annex B, добавляется стартовый код 00 00 00 01.<br>1 — формат без стартового кода.<br>В настоящее время внутри фиксирован формат Annex B. |
| h264:profile | S32 | RK_S32 | Параметр profile_idc в SPS:<br>66 — профиль Baseline.<br>77 — профиль Main.<br>100 — профиль High. |
| h264:level | S32 | RK_S32 | Параметр level_idc в SPS; 10 означает уровень 1.0:<br>10/11/12/13 – qcif@15fps / cif@7.5fps / cif@15fps / cif@30fps<br>20/21/22 – cif@30fps / half-D1@25fps / D1@12.5fps<br>30/31/32 – D1@25fps / 720p@30fps / 720p@60fps<br>40/41/42 – 1080p@30fps / 1080p@30fps / 1080p@60fps<br>50/51/52 – 4K@30fps / 4K@30fps / 4K@60fps<br>Обычно для выполнения требований выбирают уровень 4.1. |
| h264:cabac_en | S32 | RK_S32 | Формат энтропийного кодирования, используемый кодером:<br>0 – CAVLC, адаптивное кодирование переменной длины.<br>1 – CABAC, адаптивное арифметическое кодирование. |
| h264:cabac_idc | S32 | RK_S32 | cabac_init_idc в синтаксисе протокола действует, когда cabac_en равен 1; допустимые значения 0~2. |
| h264:trans8x8 | S32 | RK_S32 | Флаг включения преобразования 8x8 в синтаксисе протокола. |

<!-- source: EN PDF p39; unit 273 -->

![Исходный технический рисунок, английский PDF, страница 39](/docs/rockchip-mpp/assets/en-p039-figure-01.png)

Копируемая транскрипция кода/журнала рисунка (исходный текст сохранён; готовность к запуску не утверждается):

```text
typedef enum {
    MPP_VIDEO_CodingUnused,                 /**< Value when coding is N/A */
    MPP_VIDEO_CodingAutoDetect,             /**< Autodetection of coding type */
    MPP_VIDEO_CodingMPEG2,                  /**< AKA: H.262 */
    MPP_VIDEO_CodingH263,                   /**< H.263 */
    MPP_VIDEO_CodingMPEG4,                  /**< MPEG-4 */
    MPP_VIDEO_CodingWMV,                    /**< Windows Media Video (WMV1,WMV2,WMV3)*/
    MPP_VIDEO_CodingRV,                     /**< all versions of Real Video */
    MPP_VIDEO_CodingAVC,                    /**< H.264/AVC */
    MPP_VIDEO_CodingMJPEG,                  /**< Motion JPEG */
    MPP_VIDEO_CodingVP8,                    /**< VP8 */
    MPP_VIDEO_CodingVP9,                    /**< VP9 */
    MPP_VIDEO_CodingVC1 = 0x01000000,       /**< Windows Media Video (WMV1,WMV2,WMV3)*/
    MPP_VIDEO_CodingFLV1,                   /**< Sorenson H.263 */
    MPP_VIDEO_CodingDIVX3,                  /**< DIVX3 */
    MPP_VIDEO_CodingVP6,
    MPP_VIDEO_CodingHEVC,                   /**< H.265/HEVC */
    MPP_VIDEO_CodingAVSPLUS,                /**< AVS+ */
    MPP_VIDEO_CodingAVS,                    /**< AVS profile=0x20 */
    MPP_VIDEO_CodingAVS2,                   /**< AVS2 */
    MPP_VIDEO_CodingAV1,                    /**< av1 */
    MPP_VIDEO_CodingKhronosExtensions = 0x6F000000, /**< Reserved region for introducing Khronos Standard Extensions */
    MPP_VIDEO_CodingVendorStartUnused = 0x7F000000, /**< Reserved region for introducing Vendor Extensions */
    MPP_VIDEO_CodingMax = 0x7FFFFFFF
} MppCodingType;
```

<!-- source: EN PDF p39; unit 274 -->

![Исходный технический рисунок, английский PDF, страница 39](/docs/rockchip-mpp/assets/en-p039-figure-02.png)

Копируемая транскрипция кода/журнала рисунка (исходный текст сохранён; готовность к запуску не утверждается):

```text
typedef enum h264_profile_t {
    H264_PROFILE_FREXT_CAVLC444 = 44,  //!< YUV 4:4:4/14 "CAVLC 4:4:4"
    H264_PROFILE_BASELINE      = 66,  //!< YUV 4:2:0/8 "Baseline"
    H264_PROFILE_MAIN          = 77,  //!< YUV 4:2:0/8 "Main"
    H264_PROFILE_EXTENDED      = 88,  //!< YUV 4:2:0/8 "Extended"
    H264_PROFILE_HIGH          = 100, //!< YUV 4:2:0/8 "High"
    H264_PROFILE_HIGH10        = 110, //!< YUV 4:2:0/10 "High 10"
    H264_PROFILE_HIGH422       = 122, //!< YUV 4:2:2/10 "High 4:2:2"
    H264_PROFILE_HIGH444       = 244, //!< YUV 4:4:4/14 "High 4:4:4"
    H264_PROFILE_MVC_HIGH      = 118, //!< YUV 4:2:0/8 "Multiview High"
    H264_PROFILE_STEREO_HIGH   = 128  //!< YUV 4:2:0/8 "Stereo High"
} H264Profile;
```

<!-- source: EN PDF p40; unit 275 -->

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
|  | Строка параметра | Интерфейс | Фактический тип | Описание |  |
|  | h264:const_intra | S32 | RK_S32 | 0 — отключить; в профилях Baseline/Main всегда отключено. |  |
|  | h264:scaling_list | S32 | RK_S32 | 1 — включить; в профиле High включение можно выбрать. |  |
|  | h264:cb_qp_offset | S32 | RK_S32 | Флаг включения constrained_intra_pred_mode в синтаксисе протокола. |  |
|  | h264:cr_qp_offset | S32 | RK_S32 | 0 — выключено, 1 — включено. |  |
|  | h264:dblk_disable | S32 | RK_S32 | Режим scaling_list_matrix в синтаксисе протокола. |  |
|  | h264:dblk_alpha | S32 | RK_S32 | 0 — плоская матрица, 1 — матрица по умолчанию. |  |
|  | h264:dblk_beta | S32 | RK_S32 | Значение deblock_offset_beta в синтаксисе протокола. |  |
|  | h264:qp_init | S32 | RK_S32 | Допустимый диапазон [-6, 6]. |  |
|  | h264:qp_max | S32 | RK_S32 | Начальное значение QP. В обычных условиях не настраивать. |  |
|  | h264:qp_min | S32 | RK_S32 | Максимальное значение QP. В обычных условиях не настраивать. |  |
|  | h264:qp_max_i | S32 | RK_S32 | Минимальное значение QP. В обычных условиях не настраивать. |  |
|  | h264:qp_min_i | S32 | RK_S32 | Максимальное значение QP I-кадра. В обычных условиях не настраивать. |  |
|  | h264:qp_step | S32 | RK_S32 | Минимальное значение QP I-кадра. В обычных условиях не настраивать. |  |
|  | h265:profile | S32 | RK_S32 | Величина изменения QP уровня кадра между двумя соседними кадрами. |  |
|  | h265:level | S32 | RK_S32 | Параметр profile_idc в VPS: |  |
|  | h265:scaling_list | S32 | RK_S32 | Фиксированное значение 1, профиль Main. |  |
|  | h265:cb_qp_offset | S32 | RK_S32 | Параметр level_idc в VPS. |  |
|  | h265:cr_qp_offset | S32 | RK_S32 | Режим scaling_list_matrix в синтаксисе протокола. |  |
|  | h265:dblk_disable | S32 | RK_S32 | 0 — плоская матрица, 1 — матрица по умолчанию. |  |
|  | h265:dblk_alpha | S32 | RK_S32 | Значение chroma_cb_qp_offset в синтаксисе протокола. |  |
|  | h265:dblk_beta | S32 | RK_S32 | Допустимый диапазон [-12, 12]. |  |
|  | h265:qp_init | S32 | RK_S32 | Значение chroma_cr_qp_offset в синтаксисе протокола. |  |
|  | h265:qp_max | S32 | RK_S32 | Допустимый диапазон [-12, 12]. |  |
|  | h265:qp_min | S32 | RK_S32 | Флаг deblock_disable в синтаксисе протокола; допустимый диапазон [0, 2]. |  |
|  |  |  |  |  |  |

<!-- source: EN PDF p41; unit 276 -->

| Строка параметра | Интерфейс | Фактический тип | Описание |
| --- | --- | --- | --- |
| h265:qp_max_i | S32 | RK_S32 | 0 — деблокинг включён. |
| h265:qp_min_i | S32 | RK_S32 | Минимальное значение QP I-кадра. В обычных условиях не настраивать. |
| h265:qp_step | S32 | RK_S32 | Величина изменения QP уровня кадра между двумя соседними кадрами. |
| h265:qp_delta_ip | S32 | RK_S32 | Разница QP между I-кадром и предшествующим P-кадром. |
| jpeg: quant | S32 | RK_S32 | Уровень параметра квантования кодера JPEG. Всего имеется 11 уровней таблиц коэффициентов квантования, от 0 до 10; качество изображения изменяется от низкого к высокому. |
| split:mode | U32 | MppEncSplitMode | Режим разделения на слайсы для H.264/H.265:<br>0 — без разделения.<br>1 — BY_BYTE разделяет по размеру слайса.<br>2 — BY_CTU разделяет по количеству макроблоков или CTU. |
| split:arg | U32 | RK_U32 | Параметры разделения на слайсы:<br>В режиме BY_BYTE параметр задаёт максимальный размер каждого слайса.<br>В режиме BY_CTU параметр задаёт число макроблоков или CTU в каждом слайсе. |

<!-- source: EN PDF p41; unit 277 -->

![Исходный технический рисунок, английский PDF, страница 41](/docs/rockchip-mpp/assets/en-p041-figure-01.png)

Копируемая транскрипция кода/журнала рисунка (исходный текст сохранён; готовность к запуску не утверждается):

```text
typedef enum MppEncSplitMode_e {
    MPP_ENC_SPLIT_NONE,
    MPP_ENC_SPLIT_BY_BYTE,
    MPP_ENC_SPLIT_BY_CTU,
} MppEncSplitMode;
```

<!-- source: EN PDF p41; unit 278 -->

В дальнейшем будут добавлены другие строки и параметры.

<!-- source: EN PDF p41; unit 279 -->

#### 3.5.2 Другие команды управления

<!-- source: EN PDF p41; unit 280 -->

Перечисление MpiCmd в файле rk_mpi_cmd.h определяет коды команд интерфейса управления. Команды, относящиеся к кодеру и процессу кодирования, приведены далее:

<!-- source: EN PDF p42; unit 281 -->

![Исходный технический рисунок, английский PDF, страница 42](/docs/rockchip-mpp/assets/en-p042-figure-01.png)

Копируемая транскрипция кода/журнала рисунка (исходный текст сохранён; готовность к запуску не утверждается):

```text
MPP_ENC_CMD_BASE              = CMD_MODULE_CODEC | CMD_CTX_ID_ENC,
/* basic encoder setup control */
MPP_ENC_SET_CFG,              /* set MppEncCfg structure */
MPP_ENC_GET_CFG,              /* get MppEncCfg structure */
MPP_ENC_SET_PREP_CFG,         /* deprecated set MppEncPrepCfg structure, use MPP_ENC_SET_CFG instead */
MPP_ENC_GET_PREP_CFG,         /* deprecated get MppEncPrepCfg structure, use MPP_ENC_GET_CFG instead */
MPP_ENC_SET_RC_CFG,           /* deprecated set MppEncRcCfg structure, use MPP_ENC_SET_CFG instead */
MPP_ENC_GET_RC_CFG,           /* deprecated get MppEncRcCfg structure, use MPP_ENC_GET_CFG instead */
MPP_ENC_SET_CODEC_CFG,        /* deprecated set MppEncCodecCfg structure, use MPP_ENC_SET_CFG instead */
MPP_ENC_GET_CODEC_CFG,        /* deprecated get MppEncCodecCfg structure, use MPP_ENC_GET_CFG instead */
/* runtime encoder setup control */
MPP_ENC_SET_IDR_FRAME,        /* next frame will be encoded as intra frame */
MPP_ENC_SET_OSD_LEGACY_0,     /* deprecated */
MPP_ENC_SET_OSD_LEGACY_1,     /* deprecated */
MPP_ENC_SET_OSD_LEGACY_2,     /* deprecated */
MPP_ENC_GET_HDR_SYNC,         /* get vps / sps / pps which has better sync behavior parameter is MppPacket */
MPP_ENC_GET_EXTRA_INFO,       /* deprecated */
MPP_ENC_SET_SEI_CFG,          /* SEI: Supplement Enhancement Information, parameter is MppSeiMode */
MPP_ENC_GET_SEI_DATA,         /* SEI: Supplement Enhancement Information, parameter is MppPacket */
MPP_ENC_PRE_ALLOC_BUFF,       /* allocate buffers before encoding */
MPP_ENC_SET_QP_RANGE,         /* used for adjusting qp range, the parameter can be 1 or 2 */
MPP_ENC_SET_ROI_CFG,          /* set MppEncROICfg structure */
MPP_ENC_SET_CTU_QP,           /* for H265 Encoder,set CTU's size and QP */
```

<!-- source: EN PDF p42; unit 282 -->

Команды от MPP_ENC_CMD_BASE до MPP_ENC_CMD_END относятся к интерфейсу управления кодером. MPP_ENC_SET/GET_CFG уже описана в разделе 3.5.1 как базовая команда настройки. Остальные команды кратко рассмотрены далее; они зависят от аппаратного кодера и поддерживаются только частью оборудования.

<!-- source: EN PDF p42; unit 283 -->

В описываемом исходником состоянии MPP поддерживает аппаратные кодеры семейств vepu и rkvenc. Семейство vepu поддерживает H.264, vp8 и jpeg и присутствует в большинстве чипов RK. Согласно исходнику, семейство rkvenc поддерживает только H.264 и доступно лишь в SoC RV1109/RV1126; оно предоставляет больше функций кодирования, чем vepu. Это историческое описание источника, а не утверждение о текущем составе всех платформ.

<!-- source: EN PDF p42; unit 284 -->

Краткое описание некоторых команд CMD:

<!-- source: EN PDF p42; unit 285 -->

MPP_ENC_SET_PREP_CFG/ MPP_ENC_GET_PREP_CFG MPP_ENC_SET_RC_CFG/ MPP_ENC_GET_RC_CFG MPP_ENC_SET_CODEC_CFG/ MPP_ENC_GET_CODEC_CFG

<!-- source: EN PDF p42; unit 286 -->

Устаревшие команды, сохранённые для прямой совместимости; не использовать.

<!-- source: EN PDF p42; unit 287 -->

MPP_ENC_SET_IDR_FRAME

<!-- source: EN PDF p42; unit 288 -->

Команда не имеет параметра и запрашивает у кодера IDR-кадр. Получив запрос, кодер кодирует следующий кадр как IDR. Поддерживается всем оборудованием.

<!-- source: EN PDF p42; unit 289 -->

MPP_ENC_SET_OSD_LEGACY_0 MPP_ENC_SET_OSD_LEGACY_1 MPP_ENC_SET_OSD_LEGACY_2

<!-- source: EN PDF p42; unit 290 -->

Устаревшие команды, сохранённые для прямой совместимости; не использовать.

<!-- source: EN PDF p42; unit 291 -->

MPP_ENC_GET_HDR_SYNC/ MPP_ENC_GET_EXTRA_INFO

<!-- source: EN PDF p42; unit 292 -->

Команды для отдельного получения заголовочных данных потока. MPP_ENC_GET_EXTRA_INFO — старая команда, её использование не рекомендуется.

<!-- source: EN PDF p42; unit 293 -->

Входной параметр MPP_ENC_GET_HDR_SYNC имеет тип MppPacket. Внешний пользователь должен выделить память, инкапсулировать её в MppPacket и передать кодеру через control. К моменту возврата интерфейса управления копирование данных завершено; операция потокобезопасна. Вызывать её следует после завершения базовой настройки кодера. Пользователь должен самостоятельно освободить ранее выделенный MppPacket. Входной параметр MPP_ENC_GET_EXTRA_INFO имеет тип MppPacket*: для доступа предоставляется внутренний MppPacket кодера. Эту команду также вызывают после завершения базовой настройки кодера. Полученный MppPacket относится к внутренней памяти MPP, и пользователь не должен его освобождать.

<!-- source: EN PDF p43; unit 294 -->

При многопоточной работе MppPacket, полученный через MPP_ENC_GET_EXTRA_INFO, может изменяться другими управляющими вызовами во время чтения. Поэтому команда не потокобезопасна и оставлена только для совместимости со старым vpu_api. Не используйте её в новых вызовах.

<!-- source: EN PDF p43; unit 295 -->

MPP_ENC_SET_SEI_CFG/MPP_ENC_GET_SEI_DATA

<!-- source: EN PDF p43; unit 296 -->

Устаревшие команды, сохранённые для прямой совместимости; не использовать.

<!-- source: EN PDF p43; unit 297 -->

MPP_ENC_PRE_ALLOC_BUFF/MPP_ENC_SET_QP_RANGE/MPP_ENC_SET_ROI_CFG/ MPP_ENC_SET_CTU_QP

<!-- source: EN PDF p43; unit 298 -->

Устаревшие команды, сохранённые для прямой совместимости; не использовать.

<!-- source: EN PDF p43; unit 299 -->

MPP_ENC_GET_RC_API_ALL

<!-- source: EN PDF p43; unit 300 -->

Получает сведения API обо всех поддерживаемых MPP стратегиях управления битрейтом. Передайте указатель RcApiQueryAll*; при возврате содержимое структуры будет заполнено.

<!-- source: EN PDF p43; unit 301 -->

MPP_ENC_GET_RC_API_BY_TYPE

<!-- source: EN PDF p43; unit 302 -->

Получает сведения API обо всех стратегиях управления битрейтом заданного MppCodingType. Передайте RcApiQueryType* и задайте MppCodingType; структура заполняется при возврате.

<!-- source: EN PDF p43; unit 303 -->

MPP_ENC_SET_RC_API_CFG

<!-- source: EN PDF p43; unit 304 -->

Регистрирует API внешней стратегии управления битрейтом через указатель RcImplApi*. Указатели функций в структуре задают поведение плагина. После регистрации стратегию можно запросить и активировать.

<!-- source: EN PDF p43; unit 305 -->

MPP_ENC_GET_RC_API_CURRENT

<!-- source: EN PDF p43; unit 306 -->

Возвращает сведения API используемой стратегии управления битрейтом. Передайте RcApiBrief*; структура заполняется при возврате.

<!-- source: EN PDF p43; unit 307 -->

MPP_ENC_SET_RC_API_CURRENT

<!-- source: EN PDF p43; unit 308 -->

Активирует API стратегии управления битрейтом с указанным именем. Передайте RcApiBrief*: кодер найдёт API по строковому имени в RcApiBrief и активирует его как текущую стратегию.

<!-- source: EN PDF p43; unit 309 -->

MPP_ENC_SET_HEADER_MODE/MPP_ENC_GET_HEADER_MODE

<!-- source: EN PDF p43; unit 310 -->

По тексту исходника настраивает и запрашивает способ вывода отладочной информации SEI кодера H.264/H.265. В будущем переключатель заменят переменные окружения; не использовать. Несоответствие этому описанию имени HEADER_MODE сохранено, а не исправлено по догадке.

<!-- source: EN PDF p43; unit 311 -->

MPP_ENC_SET_SPLIT/ MPP_ENC_GET_SPLIT

<!-- source: EN PDF p43; unit 312 -->

Настраивает и запрашивает разбиение на slices кодера H.264/H265. Заменено параметрами split:mode и split:arg в MppEncCfg; не использовать.

<!-- source: EN PDF p43; unit 313 -->

MPP_ENC_SET_REF_CFG

<!-- source: EN PDF p43; unit 314 -->

Настраивает расширенный режим опорных кадров. Обычно настройка не требуется; интерфейс нужен для особых связей долгосрочных и краткосрочных опорных кадров. Это расширенный интерфейс, для которого исходник обещает дальнейшую документацию.

<!-- source: EN PDF p43; unit 315 -->

MPP_ENC_SET_OSD_PLT_CFG

<!-- source: EN PDF p44; unit 316 -->

Параметр команды MppEncOSDPlt настраивает палитру OSD аппаратуры серии rkvenc. Исходник повторяет это назначение дважды. Обычно палитра задаётся один раз в начале и остаётся общей на весь процесс кодирования. Поддерживается только серией RV1109/RV1126.

<!-- source: EN PDF p44; unit 317 -->

MPP_ENC_GET_OSD_PLT_CFG

<!-- source: EN PDF p44; unit 318 -->

По тексту исходника используется для отдельного получения заголовка потока; MPP_ENC_GET_EXTRA_INFO — старая команда, применять её не рекомендуется. Несоответствие описания заголовку GET_OSD_PLT_CFG сохранено.

<!-- source: EN PDF p44; unit 319 -->

MPP_ENC_SET_OSD_DATA_CFG

<!-- source: EN PDF p44; unit 320 -->

Параметр MppEncOSDData задаёт данные OSD аппаратуры rkvenc; исходник повторяет эту формулировку. Настраивать для каждого кадра и повторно после кодирования каждого кадра. Команда заменена KEY_OSD_DATA в MppMeta, переносимом MppFrame, и больше не используется.

<!-- source: EN PDF p44; unit 321 -->

### 3.6 Важные особенности использования кодера

<!-- source: EN PDF p44; unit 322 -->

#### 3.6.1 Ширина, высота и stride входного изображения

<!-- source: EN PDF p44; unit 323 -->

Настройки ширины и высоты должны соответствовать расположению изображения в памяти. Для YUV420 размером 1920x1080, с учётом параметров MppFrame на рисунке 7, рассмотрим два случая.

<!-- source: EN PDF p44; unit 324 -->

![Исходный технический рисунок, английский PDF, страница 44](/docs/rockchip-mpp/assets/en-p044-figure-01.png)

<!-- source: EN PDF p45; unit 325 -->

![Исходный технический рисунок, английский PDF, страница 45](/docs/rockchip-mpp/assets/en-p045-figure-01.png)

<!-- source: EN PDF p45; unit 326 -->

Рисунок 18. Расположение входного кадра кодера в памяти

<!-- source: EN PDF p45; unit 327 -->

Слева: яркостная компонента имеет ширину 1920 и высоту 1080. Яркость и цветность не примыкают непосредственно: между ними 8 пустых строк.

<!-- source: EN PDF p45; unit 328 -->

В этом случае горизонтальный stride равен 1920, вертикальный — 1088. Приложение выделяет и заполняет память размером 1920*1088*3/2. Установите width 1920, height 1080, horizontal stride 1920 и vertical stride 1088 для нормального кодирования.

<!-- source: EN PDF p45; unit 329 -->

Справа: ширина яркости 1920, высота 1080. Яркость и цветность примыкают без пустых строк.

<!-- source: EN PDF p45; unit 330 -->

Горизонтальный stride здесь 1920, вертикальный — 1080. Но кодер обращается к данным с выравниванием 16: при чтении нижнего края яркости затрагивается цветность, а у нижнего края цветности — память за её пределами. Поэтому выделите дополнительное заполнение: 1920*1080*3/2+1920*4, чтобы кодер не обращался к невыделенной памяти.

<!-- source: EN PDF p45; unit 331 -->

#### 3.6.2 Ввод и расширение управляющей информации кодера

<!-- source: EN PDF p45; unit 332 -->

Есть два способа передачи управляющей информации:

<!-- source: EN PDF p45; unit 333 -->

Глобальные параметры — битрейт, размеры изображения и т. п. — влияют на весь кодер и процесс. Временные параметры, например OSD или пользовательские данные отдельного кадра, действуют только при кодировании этого кадра.

<!-- source: EN PDF p45; unit 334 -->

Первая группа настраивается преимущественно через control; вторая — через MppMeta, передаваемое с MppFrame.

<!-- source: EN PDF p45; unit 335 -->

Будущие расширения управляющей информации будут следовать этим двум правилам.

<!-- source: EN PDF p46; unit 336 -->

#### 3.6.3 Процесс ввода и вывода кодера

<!-- source: EN PDF p46; unit 337 -->

По исходнику входной интерфейс кодера поддерживает только блокирующие вызовы, а выходной — блокирующие и неблокирующие. По умолчанию выход неблокирующий, поэтому получение данных может не удаваться; учитывайте это при использовании.

<!-- source: EN PDF p46; unit 338 -->

#### 3.6.4 Подключаемая пользовательская стратегия управления битрейтом

<!-- source: EN PDF p46; unit 339 -->

MPP позволяет задавать собственную стратегию управления битрейтом. RcImplApi определяет несколько hook-функций процесса кодирования для вставки пользовательской обработки в заданных точках. Пример — стандартные стратегии H.264/H.265 (структуры default_h264e/default_h265e).

<!-- source: EN PDF p46; unit 340 -->

Механизм плагинов зарезервирован в MPP, но его интерфейс и процесс нестабильны и в будущем будут часто меняться. Рекомендуется только тем, кто способен читать код, понимать и постоянно сопровождать этот механизм. Обычным пользователям не рекомендуется.

<!-- source: EN PDF p46; unit 341 -->

## 4\. Демонстрационные программы MPP

<!-- source: EN PDF p46; unit 342 -->

Демонстрационные программы быстро меняются; описание справочное, фактическую работу следует проверять на практике. Окружение примеров исходника — Android 32bit.

<!-- source: EN PDF p46; unit 343 -->

### 4.1 Демонстрация декодера

<!-- source: EN PDF p46; unit 344 -->

Декодер демонстрируют программы mpi_dec_test: однопоточная mpi_dec_test с decode_put_packet/decode_get_frame, многопоточная mpi_dec_mt_test и многоконтекстная mpi_dec_multi_test.

<!-- source: EN PDF p46; unit 345 -->

Пример для Android: сначала непосредственно запустите mpi_dec_test, чтобы вывести справку в журнал, как показано ниже.

<!-- source: EN PDF p47; unit 346 -->

![Исходный технический рисунок, английский PDF, страница 47](/docs/rockchip-mpp/assets/en-p047-figure-01.png)

Копируемая транскрипция кода/журнала рисунка (исходный текст сохранён; готовность к запуску не утверждается):

```text
--------- beginning of main
08-16 05:00:51.320  2150  2150 I mpi_dec_utils: usage: mpi_dec_test [options]
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -i    input_file   input bitstream file
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -o    output_file  output decoded frame file
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -w    width        the width of input bitstream
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -h    height       the height of input bitstream
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -t    type         input stream coding type
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -f    format       output frame format type
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -n    frame_number max output frame number
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -s    instance_nb  number of instances
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -v    trace option q - quiet f - show fps
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -slt  slt file     slt verify data file
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -help help         show help
08-16 05:00:51.321  2150  2150 I mpi      : mpp coding type support list:
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: mpeg2         id 2
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: mpeg4         id 4
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: h.263         id 3
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: h.264/AVC     id 7
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: h.265/HEVC    id 16777220
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: vp8           id 9
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: VP9           id 10
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: avs+          id 16777221
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: avs2          id 16777223
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: jpeg          id 8
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: av1           id 16777224
08-16 05:00:51.321  2150  2150 I mpi      : type: enc id 1 coding: h.264/AVC     id 7
08-16 05:00:51.322  2150  2150 I mpi      : type: enc id 1 coding: jpeg          id 8
08-16 05:00:51.322  2150  2150 I mpi      : type: enc id 1 coding: h265          id 16777220
08-16 05:00:51.322  2150  2150 I mpi      : type: enc id 1 coding: vp8           id 9
```

<!-- source: EN PDF p47; unit 347 -->

Справка состоит из двух частей: описание параметров mpi_dec_test и поддерживаемых типов кодирования входного потока.

<!-- source: EN PDF p47; unit 348 -->

Параметры команды описаны ниже.

<!-- source: EN PDF p47; unit 349 -->

| Параметр команды | Описание |
| --- | --- |
| -i | Файл входного битового потока. |
| -o | Файл выходных декодированных кадров. |
| -w | Ширина входного битового потока, в пикселях. |
| -h | Высота входного битового потока, в пикселях. |
| -t | Тип кодирования входного битового потока. |
| -f | Тип формата выходного кадра; по умолчанию NV12. |
| -n | Максимальное число выходных кадров. Если входной битовый поток слишком длинный, декодируются только первые n кадров. |
| -s | Число экземпляров; по умолчанию 1. |
| -v | Параметр трассировки: q — без вывода; f — показывать fps. |
| -slt | Файл контрольных данных slt для выходного декодированного кадра. |
| -help | Показать справку. |

<!-- source: EN PDF p48; unit 350 -->

В mpi_dec_test обязательны входной файл (i) и тип кодирования (t). Выходной файл (o), ширина (w), высота (h), число декодируемых кадров (n) и другие параметры необязательны и меньше влияют на работу.

<!-- source: EN PDF p48; unit 351 -->

В выводе/параметрах mpi_dec_test: Файл проверки slt преобразует данные выходных кадров в соответствующие CRC-коды (см. utils/utils.c). Обычно slt занимает лишь несколько kB. В тесте чипа сравнение кадров заменяется сравнением slt, что значительно сокращает цикл проверки.

<!-- source: EN PDF p48; unit 352 -->

Следующий вывод показывает форматы библиотеки MPP: декодирование MPEG2/4, H.263/4/5 и VP8/9. Число после id соответствует значению -t данного формата; значения основаны на OMX. HEVC и AVS заметно отличаются по числовым значениям от остальных форматов — учитывайте это.

<!-- source: EN PDF p48; unit 353 -->

Пример: декодирование 30 кадров из ocrean.h264 в /data/. Команда:

<!-- source: EN PDF p48; unit 354 -->

```text
mpi_dec_test -t 7 -i /data/ocrean.h264 -n 30
```

<!-- source: EN PDF p48; unit 355 -->

Здесь -t 7 означает поток H.264, -i задаёт входной файл, -n 30 — декодировать 30 кадров. При нормальной работе получится следующий результат.

<!-- source: EN PDF p48; unit 356 -->

![Исходный технический рисунок, английский PDF, страница 48](/docs/rockchip-mpp/assets/en-p048-figure-01.png)

Копируемая транскрипция кода/журнала рисунка (исходный текст сохранён; готовность к запуску не утверждается):

```text
08-17 11:58:03.511  2801  2801 I mpi_dec_utils: input file /data/ocrean.h264 size 38052414
08-17 11:58:03.512  2801  2801 I mpi_dec_utils: cmd parse result:
08-17 11:58:03.512  2801  2801 I mpi_dec_utils: input  file name: /data/ocrean.h264
08-17 11:58:03.512  2801  2801 I mpi_dec_utils: output file name:
08-17 11:58:03.512  2801  2801 I mpi_dec_utils: width      :    0
08-17 11:58:03.512  2801  2801 I mpi_dec_utils: height     :    0
08-17 11:58:03.512  2801  2801 I mpi_dec_utils: type       :    7
08-17 11:58:03.512  2801  2801 I mpi_dec_utils: max frames :   30
08-17 11:58:03.512  2801  2801 I mpi_dec_test: mpi_dec_test start
08-17 11:58:03.512  2801  2801 I mpp_info: mpp version: 6cc173d1 author: Ding Wei    2022-08-29 [hal_avsd]: Fix crash on avsd ref err path
08-17 11:58:03.512  2801  2801 I mpi_dec_test: 0xf1c40730 mpi_dec_test decoder test start w 0 h 0 type 7
08-17 11:58:03.538  2801  2805 I mpi_dec_test: 0xf1c40730 decode_get_frame get info changed found
08-17 11:58:03.538  2801  2805 I mpi_dec_test: 0xf1c40730 decoder require buffer w:h [1920:1088] stride [1920:1088] buf_size 4177920
08-17 11:58:03.538  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 0
08-17 11:58:03.585  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 1
08-17 11:58:03.585  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 2
08-17 11:58:03.585  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 3
08-17 11:58:03.585  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 4
08-17 11:58:03.586  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 5
08-17 11:58:03.601  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 6
08-17 11:58:03.608  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 7
08-17 11:58:03.616  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 8
08-17 11:58:03.624  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 9
08-17 11:58:03.640  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 10
08-17 11:58:03.647  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 11
08-17 11:58:03.655  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 12
08-17 11:58:03.664  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 13
08-17 11:58:03.673  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 14
08-17 11:58:03.681  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 15
08-17 11:58:03.689  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 16
08-17 11:58:03.698  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 17
08-17 11:58:03.698  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 18
08-17 11:58:03.706  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 19
08-17 11:58:03.713  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 20
08-17 11:58:03.726  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 21
08-17 11:58:03.726  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 22
08-17 11:58:03.734  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 23
08-17 11:58:03.742  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 24
08-17 11:58:03.749  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 25
08-17 11:58:03.756  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 26
08-17 11:58:03.764  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 27
08-17 11:58:03.771  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 28
08-17 11:58:03.778  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 29
08-17 11:58:03.778  2801  2801 I mpi_dec_test: decode 30 frames time 263 ms delay 69 ms fps 113.99
08-17 11:58:03.781  2801  2801 I mpi_dec_test: test success max memory 19.92 MB
```

<!-- source: EN PDF p48; unit 357 -->

Вывод содержит сведения о версии библиотеки MPP:

<!-- source: EN PDF p48; unit 358 -->

```text
I mpp_info: mpp version: 6cc173d1 author: Ding Wei 2022-08-29 [hal_avsd]: Fix crash on avsd
ref err path
```

<!-- source: EN PDF p49; unit 359 -->

```text
I mpi_dec_test: 0xeebc01c0 decode_get_frame get info changed found
```

<!-- source: EN PDF p49; unit 360 -->

Вывод mpi_dec_test сообщает событие info change декодера MPP.

<!-- source: EN PDF p49; unit 361 -->

```text
I mpi_dec_test: 0xeebc01c0 decoder require buffer w:h [1920:1080] stride [1920:1088]
buf_size 4177920
```

<!-- source: EN PDF p49; unit 362 -->

Вывод mpi_dec_test показывает требования декодера MPP к памяти изображения.

<!-- source: EN PDF p49; unit 363 -->

```text
I mpi_dec_test: 0xf1c40730 decode get frame 0
```

<!-- source: EN PDF p49; unit 364 -->

Вывод mpi_dec_test указывает на нормальное декодирование и выдачу кадров.

<!-- source: EN PDF p49; unit 365 -->

```text
I mpi_dec_test: decode 30 frames time 263ms delay 69ms fps 113.99
```

<!-- source: EN PDF p49; unit 366 -->

В выводе/параметрах mpi_dec_test: По выводу исходного примера декодер обработал 30 кадров за 263ms, задержка первого кадра 69ms, скорость 113.99 fps. Это данные исходника, не измерения ArmSoM.

<!-- source: EN PDF p49; unit 367 -->

```text
I mpi_dec_test: test success max memory 19.92 MB
```

<!-- source: EN PDF p49; unit 368 -->

В выводе/параметрах mpi_dec_test: По исходному выводу максимальный расход памяти декодирования — 19.92 MB.

<!-- source: EN PDF p49; unit 369 -->

Подробный код примера декодера: test/mpi_dec_test.c.

<!-- source: EN PDF p49; unit 370 -->

### 4.2 Демонстрация кодера

<!-- source: EN PDF p49; unit 371 -->

Примеры кодера — серия mpi_enc_test, включающая однопоточную mpi_enc_test и многоконтекстную mpi_enc_multi_test.

<!-- source: EN PDF p49; unit 372 -->

Для примера Android сначала непосредственно запустите mpi_enc_test; вывод показан ниже.

<!-- source: EN PDF p50; unit 373 -->

![Исходный технический рисунок, английский PDF, страница 50](/docs/rockchip-mpp/assets/en-p050-figure-01.png)

Копируемая транскрипция кода/журнала рисунка (исходный текст сохранён; готовность к запуску не утверждается):

```text
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: usage: mpi_enc_test [options]
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -i       input_file    input frame file
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -o       output_file   output encoded bitstream file
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -w       width         the width of input picture
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -h       height        the height of input picture
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -hstride hor_stride    the horizontal stride of input picture
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -vstride ver_stride    the vertical stride of input picture
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -f       format        the format of input picture
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -t       type          output stream coding type
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -tsrc    source type   input file source coding type
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -n       max frame number max encoding frame number
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -g       gop reference mode gop_mode:gop_len:vi_len
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -rc      rate control mode set rc_mode
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -bps     bps target:min:max set target/min/max bps and rc_mode
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -fps     in/output fps set input and output frame rate
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -q       quality control set qp_init/min/max/min_i/max_i
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -s       instance_nb   number of instances
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -v       trace option  q - quiet f - show fps
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -l       loop count    looping times for each frame
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -ini     ini file      encoder extra ini config file
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -slt     slt file      slt verify data file
08-16 10:41:16.339  2526  2526 I mpi      : mpp coding type support list:
08-16 10:41:16.339  2526  2526 I mpi      : type: dec id 0 coding: mpeg2         id 2
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: mpeg4         id 4
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: h.263         id 3
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: h.264/AVC     id 7
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: h.265/HEVC    id 16777220
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: vp8           id 9
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: VP9           id 10
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: avs+          id 16777221
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: avs2          id 16777223
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: jpeg          id 8
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: av1           id 16777224
08-16 10:41:16.340  2526  2526 I mpi      : type: enc id 1 coding: h.264/AVC     id 7
08-16 10:41:16.340  2526  2526 I mpi      : type: enc id 1 coding: jpeg          id 8
08-16 10:41:16.340  2526  2526 I mpi      : type: enc id 1 coding: h265          id 16777220
08-16 10:41:16.340  2526  2526 I mpi      : type: enc id 1 coding: vp8           id 9
08-16 10:41:16.340  2526  2526 I mpi      : mpp color support list:
08-16 10:41:16.340  2526  2526 I mpi      : color: id 0     0x00000 YUV420SP,         NV12
08-16 10:41:16.340  2526  2526 I mpi      : color: id 1     0x00001 YUV420SP-10bit
08-16 10:41:16.340  2526  2526 I mpi      : color: id 2     0x00002 YUV422SP,         NV24
08-16 10:41:16.340  2526  2526 I mpi      : color: id 3     0x00003 YUV422SP-10bit
08-16 10:41:16.340  2526  2526 I mpi      : color: id 4     0x00004 YUV420P,          I420
08-16 10:41:16.340  2526  2526 I mpi      : color: id 5     0x00005 YUV420SP,         NV21
08-16 10:41:16.340  2526  2526 I mpi      : color: id 6     0x00006 YUV422P,          422P
08-16 10:41:16.340  2526  2526 I mpi      : color: id 7     0x00007 YUV422SP,         NV42
08-16 10:41:16.340  2526  2526 I mpi      : color: id 8     0x00008 YUV422-YUYV,      YUY2
08-16 10:41:16.340  2526  2526 I mpi      : color: id 10    0x0000a YUV422-UYVY,      UYVY
08-16 10:41:16.340  2526  2526 I mpi      : color: id 12    0x0000c YUV400-Y8,        Y800
08-16 10:41:16.340  2526  2526 I mpi      : color: id 15    0x0000f YUV444SP
08-16 10:41:16.340  2526  2526 I mpi      : color: id 16    0x00010 YUV444P
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65536 0x10000 RGB565
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65537 0x10001 BGR565
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65538 0x10002 RGB555
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65539 0x10003 BGR555
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65542 0x10006 RGB888
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65543 0x10007 BGR888
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65546 0x1000a ARGB8888
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65547 0x1000b ABGR8888
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65548 0x1000c BGRA8888
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65549 0x1000d RGBA8888
```

<!-- source: EN PDF p50; unit 374 -->

Справка разделена на три части:

<!-- source: EN PDF p50; unit 375 -->

(1) параметры команды mpi_enc_test;

<!-- source: EN PDF p50; unit 376 -->

(2) тип кодирования выходного потока;

<!-- source: EN PDF p50; unit 377 -->

(3) формат входного изображения.

<!-- source: EN PDF p50; unit 378 -->

Параметры команды описаны ниже.

<!-- source: EN PDF p51; unit 379 -->

| Параметр команды | Описание |
| --- | --- |
| -i | Файл входных кадров. |
| -o | Выходной кодированный битовый поток. |
| -w | Ширина входного битового потока, в пикселях. |
| -h | Высота входного битового потока, в пикселях. |
| -hstride | Горизонтальный шаг входного изображения, в байтах. |
| -vstride | Вертикальный шаг входного изображения; единица — 1. |
| -f | Формат входного изображения; по умолчанию NV12. |
| -t | Тип кодирования выходного потока. |
| -tsrc | Тип кодирования исходного входного файла; используется только в тесте производительности кодека (см. mpi_rc2_test.c). |
| -n | Максимальное число кодируемых кадров. Если входной битовый поток слишком длинный, декодируются только первые n кадров. |
| -g | Режим опорных кадров gop. |
| -rc | Задать rc_mode: 0:vbr 1:cbr 2:fixqp 3:avbr. |
| -bps | Задать битрейт. |
| -fps | Задать входную и выходную частоту кадров, по умолчанию 30. Этот параметр команды описывает только пропорциональное соотношение входной и выходной частот кадров; в исходнике указана связь с реальной частотой кадров. |
| -qc | Задать управление качеством. |
| -s | Число экземпляров; по умолчанию 1. |
| -v | Параметр трассировки: q — без вывода; f — показывать fps. |
| -ini | Дополнительный конфигурационный ini-файл кодера (пока не действует). |
| -slt | Файл контрольных данных slt для выходного кодированного битового потока. |

<!-- source: EN PDF p51; unit 380 -->

В mpi_enc_test обязательны ширина (w), высота (h) и тип кодирования (t). Входной файл (i), выходной файл (o), число кадров (n) и формат входного изображения (f) необязательны. Без входного файла mpi_enc_test создаёт стандартное изображение цветовых полос для кодирования.

<!-- source: EN PDF p51; unit 381 -->

Параметры mpi_enc_test предлагают различные схемы управления выходным битрейтом через режим и ограничения. Режимы: переменный битрейт VBR, постоянный CBR, фиксированный QP FIXQP и адаптивный AVBR; по умолчанию VBR. Ограничения служат ориентиром для границ битрейта внутри MPP.

<!-- source: EN PDF p52; unit 382 -->

Формат параметра входной/выходной частоты кадров (fps) mpi_enc_test:

<!-- source: EN PDF p52; unit 383 -->

```text
-fps fps_in_num:fps_in_den:fps_in_flex/fps_out_num:fps_out_den:fps_out_flex
```

<!-- source: EN PDF p52; unit 384 -->

in/out обозначает вход/выход, num — числитель, den — знаменатель. flex=0 задаёт постоянную, flex=1 переменную частоту кадров. По умолчанию num=30 и den=1 для входа и выхода, то есть 30 кадров/с. Параметр задаёт только отношение входной и выходной частоты и не зависит от фактической частоты.

<!-- source: EN PDF p52; unit 385 -->

Управление качеством mpi_enc_test действует только для выходных H.264, H.265, VP8 или JPEG. Формат команды:

<!-- source: EN PDF p52; unit 386 -->

```text
-qc qp_init/min/max/min_i/max_i
```

<!-- source: EN PDF p52; unit 387 -->

qp означает параметр качества, init — начальное значение, min — минимум, max — максимум. Исходник описывает суффикс i как максимальное значение I-кадров; без суффикса — для B- и P-кадров. Неоднозначная формулировка сохранена.

<!-- source: EN PDF p52; unit 388 -->

Если параметр журналирования (v) mpi_enc_test равен q, обычный журнал MPP выключается. При f раз в секунду печатаются средняя и текущая частоты кадров.

<!-- source: EN PDF p52; unit 389 -->

Форматы цветового пространства делятся на YUV и RGB. MPP поддерживает различные форматы (f), значения параметра соответствуют разным раскладкам. Числовые значения YUV и RGB заметно различаются — учитывайте это.

<!-- source: EN PDF p52; unit 390 -->

Пример кодирования 30 кадров из ocrean.yuv в /data. Команда запуска:

<!-- source: EN PDF p52; unit 391 -->

```text
mpi_enc_test -w 1920 -h 1080 -t 7 -i /data/ocrean.yuv -o /data/out.h264 -n 30
```

<!-- source: EN PDF p52; unit 392 -->

При нормальной работе получится следующий результат.

<!-- source: EN PDF p53; unit 393 -->

![Исходный технический рисунок, английский PDF, страница 53](/docs/rockchip-mpp/assets/en-p053-figure-01.png)

Копируемая транскрипция кода/журнала рисунка (исходный текст сохранён; готовность к запуску не утверждается):

```text
08-17 11:54:12.841  2790  2790 I mpi_enc_utils: cmd parse result:
08-17 11:54:12.841  2790  2790 I mpi_enc_utils: input  file name: /data/ocrean.yuv
08-17 11:54:12.841  2790  2790 I mpi_enc_utils: output file name: /data/out.h264
08-17 11:54:12.841  2790  2790 I mpi_enc_utils: width     : 1920
08-17 11:54:12.841  2790  2790 I mpi_enc_utils: height    : 1080
08-17 11:54:12.841  2790  2790 I mpi_enc_utils: format    :    0
08-17 11:54:12.841  2790  2790 I mpi_enc_utils: type      :    7
08-17 11:54:12.842  2790  2791 I mpi_enc_test: mpi_enc_test start
08-17 11:54:12.844  2790  2791 I mpp_info: mpp version: 6cc173d1 author: Ding Wei    2022-08-29 [hal_avsd]: Fix crash on avsd ref err path
08-17 11:54:12.844  2790  2791 I mpi_enc_test: 0xe9a806d0 encoder test start w 1920 h 1080 type 7
08-17 11:54:12.846  2790  2792 I mpp_enc : MPP_ENC_SET_RC_CFG bps 7776000 [486000 : 8262000] fps [30:30] gop 60
08-17 11:54:12.846  2790  2792 I h264e_api_v2: MPP_ENC_SET_PREP_CFG w:h [1920:1080] stride [1920:1080]
08-17 11:54:12.846  2790  2792 I mpp_enc : send header for set cfg change input/format/color
08-17 11:54:12.846  2790  2792 I mpp_enc : mode vbr bps [486000:7776000:8262000] fps fix [30/1] -> fix [30/1] gop i [60] v [0]
08-17 11:54:12.867  2790  2791 I mpi_enc_test: chn 0 encoded frame 0  size 218616 qp 11
08-17 11:54:12.878  2790  2791 I mpi_enc_test: chn 0 encoded frame 1  size 53379  qp 16
08-17 11:54:12.889  2790  2791 I mpi_enc_test: chn 0 encoded frame 2  size 44736  qp 18
08-17 11:54:12.899  2790  2791 I mpi_enc_test: chn 0 encoded frame 3  size 46086  qp 19
08-17 11:54:12.910  2790  2791 I mpi_enc_test: chn 0 encoded frame 4  size 49246  qp 19
08-17 11:54:12.921  2790  2791 I mpi_enc_test: chn 0 encoded frame 5  size 44351  qp 21
08-17 11:54:12.932  2790  2791 I mpi_enc_test: chn 0 encoded frame 6  size 45968  qp 21
08-17 11:54:12.945  2790  2791 I mpi_enc_test: chn 0 encoded frame 7  size 39819  qp 22
08-17 11:54:12.956  2790  2791 I mpi_enc_test: chn 0 encoded frame 8  size 40786  qp 22
08-17 11:54:12.968  2790  2791 I mpi_enc_test: chn 0 encoded frame 9  size 29039  qp 22
08-17 11:54:12.993  2790  2791 I mpi_enc_test: chn 0 encoded frame 10 size 30438  qp 23
08-17 11:54:13.017  2790  2791 I mpi_enc_test: chn 0 encoded frame 11 size 38220  qp 23
08-17 11:54:13.042  2790  2791 I mpi_enc_test: chn 0 encoded frame 12 size 35324  qp 24
08-17 11:54:13.068  2790  2791 I mpi_enc_test: chn 0 encoded frame 13 size 36299  qp 24
08-17 11:54:13.093  2790  2791 I mpi_enc_test: chn 0 encoded frame 14 size 36672  qp 24
08-17 11:54:13.120  2790  2791 I mpi_enc_test: chn 0 encoded frame 15 size 36288  qp 25
08-17 11:54:13.147  2790  2791 I mpi_enc_test: chn 0 encoded frame 16 size 30886  qp 26
08-17 11:54:13.173  2790  2791 I mpi_enc_test: chn 0 encoded frame 17 size 31390  qp 25
08-17 11:54:13.199  2790  2791 I mpi_enc_test: chn 0 encoded frame 18 size 32035  qp 26
08-17 11:54:13.223  2790  2791 I mpi_enc_test: chn 0 encoded frame 19 size 30808  qp 26
08-17 11:54:13.248  2790  2791 I mpi_enc_test: chn 0 encoded frame 20 size 32234  qp 26
08-17 11:54:13.272  2790  2791 I mpi_enc_test: chn 0 encoded frame 21 size 31154  qp 26
08-17 11:54:13.297  2790  2791 I mpi_enc_test: chn 0 encoded frame 22 size 30745  qp 26
08-17 11:54:13.323  2790  2791 I mpi_enc_test: chn 0 encoded frame 23 size 32082  qp 26
08-17 11:54:13.349  2790  2791 I mpi_enc_test: chn 0 encoded frame 24 size 31948  qp 26
08-17 11:54:13.374  2790  2791 I mpi_enc_test: chn 0 encoded frame 25 size 27847  qp 27
08-17 11:54:13.400  2790  2791 I mpi_enc_test: chn 0 encoded frame 26 size 31434  qp 27
08-17 11:54:13.427  2790  2791 I mpi_enc_test: chn 0 encoded frame 27 size 31533  qp 27
08-17 11:54:13.453  2790  2791 I mpi_enc_test: chn 0 encoded frame 28 size 31289  qp 27
08-17 11:54:13.478  2790  2791 I mpi_enc_test: chn 0 encoded frame 29 size 32659  qp 27
08-17 11:54:13.480  2790  2790 I mpi_enc_test: chn 0 encode 30 frames time 628 ms delay 4 ms fps 47.72 bps 10265048
08-17 11:54:13.481  2790  2790 I mpi_enc_test: mpi_enc_test average frame rate 47.72
```

<!-- source: EN PDF p53; unit 394 -->

Описание журналов, уже приведённое для декодера, здесь опущено в исходнике.

<!-- source: EN PDF p53; unit 395 -->

```text
I mpp_enc: MPP_ENC_SET_RC_CFG bps 7776000 [486000:8262000] fps [30:30] gop 60
```

<!-- source: EN PDF p53; unit 396 -->

Стандартные параметры управления битрейтом кодера: цель 7.8 Mbps, нижний ориентир 0.5 Mbps, верхний 8.3 Mbps. Частота входа и выхода по умолчанию 30, размер GOP — 60.

<!-- source: EN PDF p53; unit 397 -->

```text
I mpi_enc_test: chn 0 encoded frame 0 size 218616 qp 11
```

<!-- source: EN PDF p53; unit 398 -->

По выводу mpi_enc_test кодер работает нормально; размер потока одного кадра 0.2 M, параметр качества 11.

<!-- source: EN PDF p53; unit 399 -->

```text
I mpi_enc_test: chn 0 encode 30 frames time 628 ms delay 4 ms fps 47.72 bps 10265048
```

<!-- source: EN PDF p53; unit 400 -->

Вывод mpi_enc_test: По исходному примеру кодер обработал 30 кадров за 628 ms; задержка первого кадра 4 ms, скорость 47.72 fps, битрейт 10.2 Mbps. Это данные исходника, не тест ArmSoM.

<!-- source: EN PDF p53; unit 401 -->

```text
I mpi_enc_test: mpi_enc_test average frame rate 47.72
```

<!-- source: EN PDF p53; unit 402 -->

Вывод mpi_enc_test сообщает среднюю скорость кодера 47.72 fps.

<!-- source: EN PDF p53; unit 403 -->

Параметры кодера можно задавать переменными окружения. В Android используется команда:

<!-- source: EN PDF p54; unit 404 -->

```text
setprop <control parameter> value
```

<!-- source: EN PDF p54; unit 405 -->

В Linux переменные окружения задаются командой:

<!-- source: EN PDF p54; unit 406 -->

```text
export <control parameter>=value
```

<!-- source: EN PDF p54; unit 407 -->

Описание параметров приведено ниже.

<!-- source: EN PDF p55; unit 408 -->

| Управляющий параметр | Тип | Описание |
| --- | --- | --- |
| constraint_set | RK_U32 | Действует только для потока H.264; соответствует constraint_set0_flag–constraint_set5_flag в синтаксисе. Флаг принудительного задания force_flag и параметр constraint_force хранятся в формате: &#124; 00 &#124; force_flag &#124; 00 &#124; constraint_force &#124;. Действительны только младшие 6 бит, соответствующие constraint_set5_flag–constraint_set0_flag. Когда force_flag равен 1, соответствующий constraint_set задаётся кодеру. |
| split_mode | RK_U32 | Режим разделения кодера. 0: без разделения. 1: разделение по размеру слайса. 2: разделение по числу макроблоков или CTU. |
| split_arg | RK_U32 | split_arg действует только при включённом split_mode кодера. При разделении по байтам задаёт предельное число байт каждого слайса; при разделении по CTU — предельное число CTU каждого слайса. |
| split_out | RK_U32 | Режим вывода разделённых частей; действует только при включённом разделении кодера. 1: вывод с малой задержкой; 2: вывод информации о сегментах. В режиме малой задержки кодер выдаёт каждый слайс с малой задержкой; в режиме информации о сегментах он упаковывает сведения о сегментах для каждого слайса. |
| sei_mode | RK_U32 | Режим записи SEI. 0: не записывать SEI; 1: запись для последовательности; 2: запись для кадров. В режиме последовательности на каждый GOP приходится только один SEI; в кадровом режиме при изменении информации SEI она также добавляется перед каждым кадром. |
| gop_mode | RK_U32 | Режим опорных кадров gop. Если переменная окружения gop_mode не задана, используется параметр команды; иначе используется переменная окружения. |
| osd_enable | RK_U32 | Включить палитру OSD. |
| osd_mode | RK_U32 | Режим палитры OSD; действует только после включения палитры. 0: стандартная конфигурация; 1: пользовательская конфигурация. |
| roi_enable | RK_U32 | Включить тестирование ROI и использовать стандартную для платформы конфигурацию roi_type. |
| roi_type | RK_U32 | Принудительно задать roi_type. |
| user_data_enable | RK_U32 | Включить пользовательские данные. |

<!-- source: EN PDF p55; unit 409 -->

Код примера кодера находится в test/mpi_enc_test.c. По исходнику текущая версия использует интерфейс enqueue/dequeue, который планируется изменить.

<!-- source: EN PDF p56; unit 410 -->

### 4.3 Утилиты

<!-- source: EN PDF p56; unit 411 -->

MPP предоставляет утилиты модульного тестирования аппаратной и программной платформы и самой библиотеки MPP.

<!-- source: EN PDF p56; unit 412 -->

mpp_info_test

<!-- source: EN PDF p56; unit 413 -->

Читает и печатает версию библиотеки MPP. При сообщении о проблеме можно приложить этот вывод.

<!-- source: EN PDF p56; unit 414 -->

mpp_buffer_test

<!-- source: EN PDF p56; unit 415 -->

Проверяет нормальную работу распределителя памяти ядра.

<!-- source: EN PDF p56; unit 416 -->

mpp_mem_test

<!-- source: EN PDF p56; unit 417 -->

Проверяет нормальную работу распределителя памяти библиотеки C.

<!-- source: EN PDF p56; unit 418 -->

mpp_runtime_test

<!-- source: EN PDF p56; unit 419 -->

Проверяет некоторые аппаратные и программные условия окружения выполнения.

<!-- source: EN PDF p56; unit 420 -->

mpp_platform_test

<!-- source: EN PDF p56; unit 421 -->

Читает сведения о чиповой платформе и проверяет их корректность.

<!-- source: EN PDF p56; unit 422 -->

## 5\. Сборка и использование библиотеки MPP

<!-- source: EN PDF p56; unit 423 -->

### 5.1 Загрузка исходного кода

<!-- source: EN PDF p56; unit 424 -->

Официальный адрес исходного кода MPP: https://github.com/rockchip-linux/mpp

<!-- source: EN PDF p56; unit 425 -->

Ветка выпуска — release, разработки — develop; исходник указывает develop как ветку по умолчанию.

<!-- source: EN PDF p56; unit 426 -->

Команда загрузки: git clone https://github.com/rockchip-linux/mpp.git

<!-- source: EN PDF p56; unit 427 -->

### 5.2 Сборка

<!-- source: EN PDF p56; unit 428 -->

Для сборки используется cmake версии выше 2.8.12; рекомендуется 3.x. Исходник сообщает проверку cmake-3.28. Более новые версии могут выдавать больше предупреждений. Это проверка из исходника, не результат данной работы.

<!-- source: EN PDF p57; unit 429 -->

#### 5.2.1 Кросс-сборка для Android

<!-- source: EN PDF p57; unit 430 -->

Для Android-библиотеки требуется NDK; стандартный сценарий использует android-ndk-r16b. В исходнике проверены android-ndk-r16b и android-ndk-r25c. Первый указан для SDK ниже Android 14, второй — выше Android 14; пограничный Android 14 отдельно не определён.

<!-- source: EN PDF p57; unit 431 -->

Пример для NDK r16b:

<!-- source: EN PDF p57; unit 432 -->

Ссылка загрузки NDK r16b указана в build/android/ndk_links.md дерева исходников.

<!-- source: EN PDF p57; unit 433 -->

Распакуйте NDK в /home/pub/ndk/android-ndk-r16b либо вручную измените путь ANDROID_NDK в env_setup.sh каталога build/android/.

<!-- source: EN PDF p57; unit 434 -->

Перейдите в build/android/arm/, запустите make-Android.bash для создания Makefile, затем выполните указанное в исходнике make –j16. В исходном тексте перед j16 длинное тире, а не ASCII-дефис; перед выполнением сверяйте параметр со сценарием сборки.

<!-- source: EN PDF p57; unit 435 -->

#### 5.2.2 Сборка для Unix/Linux

<!-- source: EN PDF p57; unit 436 -->

Сначала настройте toolchain в build/linux/arm/arm.linux.cross.cmake, затем запустите make-Makefiles.bash для создания Makefile через cmake и, наконец, указанное в исходнике make –j16. Длинное тире исходного параметра не следует слепо копировать как проверенную команду.

<!-- source: EN PDF p57; unit 437 -->

MPP также поддерживает сборку непосредственно в Debian на плате разработки.

<!-- source: EN PDF p57; unit 438 -->

## 6\. Часто задаваемые вопросы

<!-- source: EN PDF p57; unit 439 -->

В: При сборке Aarch64 ошибка undefined reference to `system_property_get`.

<!-- source: EN PDF p57; unit 440 -->

О: По исходнику это проблема Google 64bit NDK: в libc.so отсутствуют некоторые определения символов. Ссылка с описанием проблемы:

<!-- source: EN PDF p57; unit 441 -->

Исходный URL (перенос восстановлен по полному адресу китайского оригинала): [http://stackoverflow.com/questions/28413530/api-to-get-android-system-properties-is-removed-in-arm64-platforms](http://stackoverflow.com/questions/28413530/api-to-get-android-system-properties-is-removed-in-arm64-platforms)

<!-- source: EN PDF p57; unit 442 -->

Решение из исходника: соответствующая libc.so помещена в build/android/aarch64/fix/. Скопируйте библиотеку в path_to_ndk/platforms/android-21/arch-arm64/usr/lib/ и пересоберите. Это историческое решение исходного SDK, а не рекомендация заменять системные библиотеки любой современной NDK.

<!-- source: EN PDF p57; unit 443 -->

В: При работе появляется следующий журнал ядра. Это проблема?

<!-- source: EN PDF p57; unit 444 -->

vpu_service_ioctl:1844: error: unknow vpu service ioctl cmd 40086c01

<!-- source: EN PDF p57; unit 445 -->

О: Согласно исходнику, само это сообщение не является проблемой. MPP зависит от драйвера ядра и пробует разные версии его интерфейса. При неудаче пробует другой; сообщение печатается только один раз при неуспешной попытке и может быть проигнорировано.

<!-- source: EN PDF p57; unit 446 -->

В: Как анализировать ненормальную работу MPP?

<!-- source: EN PDF p57; unit 447 -->

О: Сначала изучите журнал ошибок. Если не открывается устройство ядра, проверьте доступность аппаратной конфигурации видеокодека данной платформы, затем передайте проблему в redmine по процедуре исходника. После анализа окружения исследуйте внутренние проблемы MPP.

{% endraw %}
